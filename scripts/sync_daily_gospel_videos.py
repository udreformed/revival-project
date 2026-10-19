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
            candidate = {"id": vid, "title": title, "published": published}
            prev = gathered.get(key)
            if not prev or utc_time(published) > utc_time(prev["published"]):
                gathered[key] = candidate
        next_token = response.get("nextPageToken") or ""
        if not next_token:
            break
        if next_token in seen_tokens:
            raise ValueError("YouTube returned a repeated page token")
        seen_tokens.add(next_token)
        page_token = next_token
    if not gathered:
        raise RuntimeError(f"YouTube returned {total} playlist items but no valid dated gospel videos; existing map untouched")
    print(f"YouTube API: scanned {total} playlist items; matched {len(gathered)} distinct dates")
    return gathered


def merge_map(previous, videos):
    if previous.get("playlist_id") != PLAYLIST_ID or not isinstance(previous.get("videos"), dict):
        raise ValueError("Existing video map is invalid or refers to a different playlist")
    merged = dict(previous["videos"])
    changes = []
    for key, item in videos.items():
        old = merged.get(key)
        if old is not None:
            if old.get("id") == item["id"]:
                continue  # preserve existing titles/timestamps; avoid unnecessary commits
            if utc_time(item["published"]) < utc_time(old.get("published")):
                continue
        merged[key] = item
        changes.append(key)
    merged = dict(sorted(merged.items()))
    return {"playlist_id": PLAYLIST_ID, "videos": merged}, changes


def main():
    api_key = os.environ.get("YOUTUBE_API_KEY", "").strip()
    if not api_key:
        print("ERROR: Add a GitHub Actions repository secret named YOUTUBE_API_KEY. Enable YouTube Data API v3 in Google Cloud.", file=sys.stderr)
        return 2
    previous = json.loads(DATA_FILE.read_text(encoding="utf-8")) if DATA_FILE.exists() else {"playlist_id": PLAYLIST_ID, "videos": {}}
    videos = fetch_videos(api_key)
    updated, changes = merge_map(previous, videos)
    data = json.dumps(updated, ensure_ascii=False, indent=2) + "\n"
    old = DATA_FILE.read_text(encoding="utf-8") if DATA_FILE.exists() else ""
    if data != old:
        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        DATA_FILE.write_text(data, encoding="utf-8")
    print(f"Saved {len(updated['videos'])} dates. New/updated: {', '.join(changes) or 'none'}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (RuntimeError, ValueError, OSError, json.JSONDecodeError) as exc:
        print("ERROR: " + str(exc), file=sys.stderr)
        sys.exit(1)
