#!/usr/bin/env python3
"""Sync dated gospel Shorts from YouTube Data API v3.

Check both the dedicated gospel playlist and the channel's *uploads* playlist.
Look up actual video metadata with videos.list: playlistItems.list titles may
be stale, unavailable, or different from current published video titles.

Authentication: YOUTUBE_API_KEY GitHub Actions repository secret (read-only).
Safeguards: validate channel/video/date, keep prior records on API failure,
never log API keys, and do not erase previously mapped dates.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

PLAYLIST_ID = "PLBUpqEom8gNw"
CHANNEL_ID = "UCtTBC6WUY7cONg6jca5Zqqg"
DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "daily-gospel-video-map.json"
API_ROOT = "https://www.googleapis.com/youtube/v3/"
DATE_RE = re.compile(r"(?<!\d)(\d{1,2})\s*월\s*(\d{1,2})\s*일(?!\d)")
VIDEO_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")


def date_from_title(title: str) -> str | None:
    text = unicodedata.normalize("NFC", title).strip()
    if not re.match(r"^복음\s*묵상\b", text):
        # \b can behave differently when there is no whitespace following
        # Hangul; allow directly followed digits as well.
        if not re.match(r"^복음\s*묵상(?=\s|\d)", text):
            return None
    found = DATE_RE.search(text)
    if not found:
        return None
    month, day = map(int, found.groups())
    try:
        dt.date(2024, month, day)  # leap year validates Feb 29
    except ValueError:
        return None
    return f"{month:02d}-{day:02d}"


def parse_time(value):
    try:
        stamp = dt.datetime.fromisoformat(str(value or "").replace("Z", "+00:00"))
        if stamp.tzinfo is None:
            stamp = stamp.replace(tzinfo=dt.timezone.utc)
        return stamp.astimezone(dt.timezone.utc)
    except (ValueError, TypeError, OverflowError):
        return dt.datetime.min.replace(tzinfo=dt.timezone.utc)


def api_get(endpoint, api_key, **params):
    params["key"] = api_key
    url = API_ROOT + endpoint + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        # Do not output URLs: the query contains the private API key.
        raise RuntimeError(f"YouTube Data API {endpoint} HTTP {exc.code} (check API key, quota, and restrictions)") from None
    except (urllib.error.URLError, TimeoutError) as exc:
        raise RuntimeError(f"YouTube Data API {endpoint} connection failed: {type(exc).__name__}") from None


def uploads_playlist(api_key):
    obj = api_get("channels", api_key, part="contentDetails", id=CHANNEL_ID, maxResults=1)
    items = obj.get("items") or []
    if not items:
        raise ValueError("Authorized channel not found in YouTube Data API")
    channel = items[0]
    if channel.get("id") != CHANNEL_ID:
        raise ValueError("Unexpected YouTube channel returned")
    uploads = ((channel.get("contentDetails") or {}).get("relatedPlaylists") or {}).get("uploads")
    if not uploads:
        raise ValueError("Channel uploads playlist not found")
    return uploads


def playlist_video_ids(api_key, playlist_id, max_items):
    ids = []
    token = ""
    seen = set()
    while len(ids) < max_items:
        args = {"part": "snippet,contentDetails", "playlistId": playlist_id, "maxResults": min(50, max_items - len(ids))}
        if token:
            args["pageToken"] = token
        data = api_get("playlistItems", api_key, **args)
        items = data.get("items")
        if not isinstance(items, list):
            raise ValueError("Malformed playlistItems response")
        for entry in items:
            snippet = entry.get("snippet") or {}
            details = entry.get("contentDetails") or {}
            video_id = ((snippet.get("resourceId") or {}).get("videoId") or details.get("videoId") or "")
            if VIDEO_RE.fullmatch(video_id):
                ids.append(video_id)
        next_token = data.get("nextPageToken") or ""
        if not next_token:
            break
        if next_token in seen:
            raise ValueError("YouTube returned repeated pagination token")
        seen.add(next_token)
        token = next_token
    return ids


def fetch_videos(api_key):
    ids, errors = [], []
    try:
        base_ids = playlist_video_ids(api_key, PLAYLIST_ID, 500)
        ids.extend(base_ids)
        print(f"Gospel playlist: {len(base_ids)} video IDs")
    except (RuntimeError, ValueError) as exc:
        errors.append(f"gospel playlist: {exc}")
        print(f"NOTICE: Gospel playlist lookup failed: {exc}", file=sys.stderr)
    try:
        channel_uploads = uploads_playlist(api_key)
        new_ids = playlist_video_ids(api_key, channel_uploads, 150)
        ids.extend(new_ids)
        print(f"Channel uploads: {len(new_ids)} latest video IDs")
    except (RuntimeError, ValueError) as exc:
        errors.append(f"channel uploads: {exc}")
        print(f"NOTICE: Channel uploads lookup failed: {exc}", file=sys.stderr)
    ids = list(dict.fromkeys(ids))
    if not ids:
        raise RuntimeError("No YouTube video IDs could be listed: " + "; ".join(errors))

    found = {}
    checked = 0
    for start in range(0, len(ids), 50):
        batch = ids[start:start + 50]
        data = api_get("videos", api_key, part="snippet", id=",".join(batch))
        videos = data.get("items")
        if not isinstance(videos, list):
            raise ValueError("Malformed videos response")
        checked += len(videos)
        for video in videos:
            video_id = video.get("id") or ""
            snippet = video.get("snippet") or {}
            if not VIDEO_RE.fullmatch(video_id) or snippet.get("channelId") != CHANNEL_ID:
                continue
            title = unicodedata.normalize("NFC", snippet.get("title") or "").strip()
            key = date_from_title(title)
            if key is None:
                continue
            item = {"id": video_id, "title": title, "published": snippet.get("publishedAt") or ""}
            if key not in found or parse_time(item["published"]) > parse_time(found[key]["published"]):
                found[key] = item
    if not found:
        raise RuntimeError(f"Scanned {checked} video metadata records but found no dated gospel Shorts. Existing links preserved.")
    print(f"Checked {checked} public video metadata records; matched {len(found)} dated gospel videos")
    print("Dates identified: " + ", ".join(sorted(found)))
    return found


def merge(previous, found):
    if previous.get("playlist_id") != PLAYLIST_ID or not isinstance(previous.get("videos"), dict):
        raise ValueError("Invalid existing video map")
    merged = dict(previous["videos"])
    changed = []
    for key, item in found.items():
        old = merged.get(key)
        if old and old.get("id") == item["id"]:
            continue
        if old and parse_time(item["published"]) < parse_time(old.get("published")):
            continue
        merged[key] = item
        changed.append(key)
    return {"playlist_id": PLAYLIST_ID, "videos": dict(sorted(merged.items()))}, changed


def main():
    api_key = os.environ.get("YOUTUBE_API_KEY", "").strip()
    if not api_key:
        print("ERROR: Missing YOUTUBE_API_KEY GitHub Actions secret", file=sys.stderr)
        return 2
    previous = (json.loads(DATA_FILE.read_text(encoding="utf-8")) if DATA_FILE.exists()
                else {"playlist_id": PLAYLIST_ID, "videos": {}})
    found = fetch_videos(api_key)
    updated, changed = merge(previous, found)
    content = json.dumps(updated, ensure_ascii=False, indent=2) + "\n"
    before = DATA_FILE.read_text(encoding="utf-8") if DATA_FILE.exists() else ""
    if content != before:
        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        DATA_FILE.write_text(content, encoding="utf-8")
    print(f"Saved {len(updated['videos'])} dates; new/updated: {', '.join(sorted(changed)) or 'none'}")
    today = dt.datetime.now(dt.timezone(dt.timedelta(hours=7))).strftime("%m-%d")
    if today not in updated["videos"]:
        print(f"NOTICE: No video registered for today in Thailand ({today}). Check publication and retry later.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, RuntimeError, OSError, json.JSONDecodeError) as exc:
        print("ERROR: " + str(exc), file=sys.stderr)
        sys.exit(1)
