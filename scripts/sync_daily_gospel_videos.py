#!/usr/bin/env python3
"""Sync title-dated YouTube playlist entries to a static JSON file.

Uses the official public YouTube Atom feed; no API key or third-party proxy.
Refresh every hour from GitHub Actions. The feed exposes recent entries only,
so merge rather than replace prior dates.
"""
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

PLAYLIST_ID = "PLBUpqEom8gNw"
FEED_URL = f"https://www.youtube.com/feeds/videos.xml?playlist_id={PLAYLIST_ID}"
DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "daily-gospel-video-map.json"
ATOM_NS = "http://www.w3.org/2005/Atom"
YT_NS = "http://www.youtube.com/xml/schemas/2015"
DATE_RE = re.compile(r"(?<!\d)(\d{1,2})\s*월\s*(\d{1,2})\s*일(?!\d)")
VIDEO_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")


def parse_feed(xml_data):
    root = ET.fromstring(xml_data)
    if root.tag != f"{{{ATOM_NS}}}feed":
        raise ValueError("Not a valid YouTube Atom feed")
    playlist = root.findtext(f"{{{YT_NS}}}playlistId")
    if playlist is not None and playlist != PLAYLIST_ID:
        raise ValueError(f"Unexpected playlist: {playlist}")
    matched = {}
    for entry in root.findall(f"{{{ATOM_NS}}}entry"):
        title = entry.findtext(f"{{{ATOM_NS}}}title") or ""
        vid = (entry.findtext(f"{{{YT_NS}}}videoId") or "").strip()
        found = DATE_RE.search(title)
        if not found or not VIDEO_RE.fullmatch(vid):
            continue
        month, day = (int(n) for n in found.groups())
        try:
            dt.date(2024, month, day)  # supports Feb 29 if someday available
        except ValueError:
            continue
        key = f"{month:02d}-{day:02d}"
        pub = entry.findtext(f"{{{ATOM_NS}}}published") or ""
        item = {"id": vid, "title": title, "published": pub}
        if key not in matched or pub > matched[key]["published"]:
            matched[key] = item
    return matched


def fetch_xml():
    request = urllib.request.Request(
        FEED_URL,
        headers={"User-Agent": "Mozilla/5.0 (compatible; DailyGospelFeedSync/1.0)",
                 "Accept": "application/atom+xml,application/xml,text/xml,*/*"},
    )
    error = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                return response.read()
        except (OSError, urllib.error.URLError) as exc:
            error = exc
            print(f"Attempt {attempt+1} failed: {exc}", file=sys.stderr)
            if attempt < 2:
                time.sleep(5 * (attempt + 1))
    raise RuntimeError(f"Could not fetch YouTube feed: {error}")


def main():
    previous = json.loads(DATA_FILE.read_text(encoding="utf-8")) if DATA_FILE.exists() else {"playlist_id": PLAYLIST_ID, "videos": {}}
    if previous.get("playlist_id") != PLAYLIST_ID or not isinstance(previous.get("videos"), dict):
        raise ValueError("Existing map is invalid or belongs to another playlist")
    new = parse_feed(fetch_xml())
    if not new:
        raise RuntimeError("Feed returned no valid date-labelled videos; retaining existing map")
    merged = dict(previous["videos"])
    changes = []
    for key, item in new.items():
        old = merged.get(key)
        if old != item:
            merged[key] = item
            changes.append(key)
    merged = dict(sorted(merged.items(), key=lambda kv: tuple(int(n) for n in kv[0].split("-"))))
    updated = {"playlist_id": PLAYLIST_ID, "videos": merged}
    new_text = json.dumps(updated, ensure_ascii=False, indent=2) + "\n"
    if not DATA_FILE.exists() or DATA_FILE.read_text(encoding="utf-8") != new_text:
        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        DATA_FILE.write_text(new_text, encoding="utf-8")
    print(f"Feed entries: {len(new)}; total saved dates: {len(merged)}; changed: {', '.join(changes) or 'none'}")


if __name__ == "__main__":
    main()
