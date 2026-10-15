#!/usr/bin/env python3
"""Sync public, date-labelled daily gospel videos to GitHub's static JSON map.

GitHub Actions runs at 03:00 Asia/Bangkok (20:00 UTC) once a day.
YouTube Atom feeds sometimes return intermittent HTTP 404 from cloud runners:
try the playlist feed, the owning channel feed, and the apex-domain URL
with a realistic browser User-Agent; retry transient errors with delays.
Never overwrite existing entries or write an empty map on feed failure.
"""
import datetime as dt
import json
import re
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

PLAYLIST_ID = "PLBUpqEom8gNw"
CHANNEL_ID = "UCtTBC6WUY7cONg6jca5Zqqg"
DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "daily-gospel-video-map.json"
ATOM_NS = "http://www.w3.org/2005/Atom"
YT_NS = "http://www.youtube.com/xml/schemas/2015"
DATE_RE = re.compile(r"(?<!\d)(\d{1,2})\s*월\s*(\d{1,2})\s*일(?!\d)")
VIDEO_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")

# Try the playlist first. The channel feed is a fallback; only titles that
# explicitly identify a gospel meditation are accepted from that channel.
FEED_URLS = (
    (f"https://www.youtube.com/feeds/videos.xml?playlist_id={PLAYLIST_ID}", "playlist"),
    (f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}", "channel"),
    (f"https://youtube.com/feeds/videos.xml?playlist_id={PLAYLIST_ID}", "playlist"),
)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Accept": "application/atom+xml,application/xml;q=0.9,text/xml;q=0.8,*/*;q=0.7",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cache-Control": "no-cache",
}


def parse_feed(xml_data, source="playlist"):
    root = ET.fromstring(xml_data)
    if root.tag != f"{{{ATOM_NS}}}feed":
        raise ValueError("Not a valid YouTube Atom feed")
    playlist = root.findtext(f"{{{YT_NS}}}playlistId")
    if source == "playlist" and playlist and playlist != PLAYLIST_ID:
        raise ValueError(f"Unexpected playlist: {playlist}")
    if source == "channel":
        channel = root.findtext(f"{{{YT_NS}}}channelId")
        if channel and channel != CHANNEL_ID:
            # Some feeds omit the 'UC' prefix on the channel identifier.
            if channel != CHANNEL_ID[2:]:
                raise ValueError(f"Unexpected channel: {channel}")
    matched = {}
    for entry in root.findall(f"{{{ATOM_NS}}}entry"):
        title = entry.findtext(f"{{{ATOM_NS}}}title") or ""
        vid = (entry.findtext(f"{{{YT_NS}}}videoId") or "").strip()
        if source == "channel" and not title.startswith("복음묵상"):
            continue
        found = DATE_RE.search(title)
        if not found or not VIDEO_RE.fullmatch(vid):
            continue
        month, day = (int(n) for n in found.groups())
        try:
            dt.date(2024, month, day)
        except ValueError:
            continue
        key = f"{month:02d}-{day:02d}"
        pub = entry.findtext(f"{{{ATOM_NS}}}published") or ""
        item = {"id": vid, "title": title, "published": pub}
        if key not in matched or pub > matched[key]["published"]:
            matched[key] = item
    return matched


def get_feed(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as res:
        return res.read()


def fetch_videos():
    failures = []
    # Six attempts from three URLs spread out over ~1 minute for transient 404s.
    for round_index in range(4):
        for url, source in FEED_URLS:
            try:
                found = parse_feed(get_feed(url), source=source)
                if found:
                    print(f"Feed OK ({source}): {len(found)} date-labelled videos")
                    return found
                failures.append(f"{source}: no dated videos")
                print(f"Feed ({source}) returned no matching videos", file=sys.stderr)
            except (OSError, ValueError, ET.ParseError, urllib.error.URLError) as exc:
                failures.append(f"{source}: {type(exc).__name__}: {exc}")
                print(f"Feed fetch round {round_index+1} ({source}) failed: {exc}", file=sys.stderr)
        if round_index < 3:
            delay = (15, 30, 45)[round_index]
            print(f"Retrying YouTube feeds in {delay} seconds...", file=sys.stderr)
            time.sleep(delay)
    raise RuntimeError(
        "YouTube's public feeds are not accessible from this GitHub runner; "
        "existing video links were preserved. Latest errors: " + "; ".join(failures[-3:])
    )


def main():
    if DATA_FILE.exists():
        previous = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    else:
        previous = {"playlist_id": PLAYLIST_ID, "videos": {}}
    if previous.get("playlist_id") != PLAYLIST_ID or not isinstance(previous.get("videos"), dict):
        raise ValueError("Existing map is invalid or belongs to another playlist")
    new = fetch_videos()
    merged = dict(previous["videos"])
    changed = []
    for key, item in new.items():
        existing = merged.get(key)
        if existing != item and (existing is None or item["published"] >= existing.get("published", "")):
            merged[key] = item
            changed.append(key)
    merged = dict(sorted(merged.items(), key=lambda kv: tuple(int(n) for n in kv[0].split("-"))))
    payload = json.dumps({"playlist_id": PLAYLIST_ID, "videos": merged}, ensure_ascii=False, indent=2) + "\n"
    if not DATA_FILE.exists() or DATA_FILE.read_text(encoding="utf-8") != payload:
        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        DATA_FILE.write_text(payload, encoding="utf-8")
    print(f"Saved dates: {len(merged)}; changed: {', '.join(changed) or 'none'}")


if __name__ == "__main__":
    main()
