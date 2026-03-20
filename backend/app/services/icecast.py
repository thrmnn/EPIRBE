import re

import httpx
from app.config import settings


def _clean_title(raw: str | None) -> str | None:
    """Clean up a raw title string.

    - Strip file extensions (.mp3, .ogg, .flac, etc.)
    - Replace underscores with spaces
    - Remove leading path fragments
    - Return None if nothing useful remains
    """
    if not raw:
        return None

    # Take only the last path component if a path was embedded
    raw = raw.rsplit("/", 1)[-1]
    raw = raw.rsplit("\\", 1)[-1]

    # Strip common audio extensions
    raw = re.sub(r"\.(mp3|ogg|opus|flac|wav|aac|m4a)$", "", raw, flags=re.IGNORECASE)

    # Underscores → spaces
    raw = raw.replace("_", " ").strip()

    if not raw or raw.lower() in ("unknown", "untitled", "none"):
        return None

    return raw


def _parse_artist_title(source: dict) -> tuple[str | None, str | None]:
    """Extract artist and title from an Icecast source dict.

    Icecast can report metadata in several places:
      - source["artist"] / source["title"]  (separate fields from id3 tags)
      - source["title"] as "Artist - Title" (combined)
      - source["yp_currently_playing"]      (combined fallback)
    """
    artist = _clean_title(source.get("artist"))
    title = _clean_title(source.get("title"))

    # If title already contains artist via "artist - title" pattern, split it
    if title and not artist and " - " in title:
        parts = title.split(" - ", 1)
        artist = parts[0].strip() or None
        title = parts[1].strip() or None

    # Fall back to yp_currently_playing
    if not title:
        yp = _clean_title(source.get("yp_currently_playing"))
        if yp and " - " in yp:
            parts = yp.split(" - ", 1)
            artist = artist or parts[0].strip() or None
            title = parts[1].strip() or None
        elif yp:
            title = yp

    # If artist is "Unknown", discard it
    if artist and artist.lower() == "unknown":
        artist = None

    return artist, title


async def get_icecast_status() -> dict:
    """Poll Icecast status-json.xsl for stream info."""
    url = f"http://{settings.icecast_host}:{settings.icecast_port}/status-json.xsl"
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()

        icestats = data.get("icestats", {})
        source = icestats.get("source")

        # source can be a dict (single mount) or list (multiple mounts)
        if isinstance(source, list):
            # Find our /stream mount
            source = next(
                (s for s in source if s.get("listenurl", "").endswith("/stream")),
                source[0] if source else {},
            )
        elif source is None:
            source = {}

        artist, title = _parse_artist_title(source)

        return {
            "title": title,
            "artist": artist,
            "listeners": source.get("listeners", 0),
            "server_name": source.get("server_name", "EPIRBE Radio"),
        }
    except Exception:
        return {"title": None, "artist": None, "listeners": 0, "server_name": "EPIRBE Radio"}
