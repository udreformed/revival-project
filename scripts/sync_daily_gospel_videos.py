#!/usr/bin/env python3
"""Merge public dated YouTube playlist videos into the devotional JSON map.

Requires an API key in GitHub Actions secret YOUTUBE_API_KEY.
Uses the official YouTube Data API rather than unreliable YouTube Atom feeds.
Runs once a day via GitHub Actions; never destroys old video records.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

PLAYLIST_ID = "PLBUpqEom8gNw"
CHANNEL_ID = "UCtTBC6WUY7cONg6jca5Zqqg"
DATA_FILE = Path(__file__).resolve().parents[1] / "data" / "daily-gospel-video-map.json"
DATE_RE = re.compile(r"(?<!\d)(\d{1,2})\s*월\s*(\d{1,2})\s*일(?!\d)")
VIDEO_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")


def parse_date_title(title):
    if not title.startswith("복음묵상"):
        return None
    found = DATE_RE.search(title)
    if not found:
        return None
    m, d = map(int, found.groups())
    try:
        dt.date(2024, m, d)  # leap year permits Feb 29
    except ValueError:
        return None
    return f"{m:02d}-{d:02d}"


def utc_time(value):
    """Return a sortable UTC datetime for both Z and +00:00 timestamps."""
    try:
        date = dt.datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        if date.tzinfo is None:
            date = date.replace(tzinfo=dt.timezone.utc)
        return date.astimezone(dt.timezone.utc)
    except (ValueError, TypeError, OverflowError):
        return dt.datetime.min.replace(tzinfo=dt.timezone.utc)


def request_page(api_key, page_token=""):
    params = {
        "part": "snippet,contentDetails",
        "playlistId": PLAYLIST_ID,
        "maxResults": "50",
        "key": api_key,
    }
    if page_token:
        params["pageToken"] = page_token
    # Do not log URL: it contains the API key.
    url = "https://www.googleapis.com/youtube/v3/playlistItems?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=25) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        if exc.code in (400, 403):
            raise RuntimeError(f"YouTube Data API HTTP {exc.code}: verify YOUTUBE_API_KEY, API activation, API restrictions and quota") from None
        raise RuntimeError(f"YouTube Data API HTTP {exc.code}") from None


def fetch_videos(api_key):
    gathered = {}
    total = 0
    page_token = ""
    seen_tokens = set()
    while True:
        response = request_page(api_key, page_token)
        if not isinstance(response.get("items"), list):
            raise ValueError("YouTube Data API response has no items list")
        items = response["items"]
        total += len(items)
        for entry in items:
            snippet = entry.get("snippet") or {}
            details = entry.get("contentDetails") or {}
            title = (snippet.get("title") or "").strip()
            key = parse_date_title(title)
            resource = snippet.get("resourceId") or {}
            vid = (resource.get("videoId") or details.get("videoId") or "").strip()
            owner = snippet.get("videoOwnerChannelId")
            if not key or not VIDEO_RE.fullmatch(vid):
                continue
            if owner and owner != CHANNEL_ID:
                continue
            published = details.get("videoPublishedAt") or snippet.get("publishedAt") or ""
