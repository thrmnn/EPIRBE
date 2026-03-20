import os
from pathlib import Path

from mutagen import File as MutagenFile
from mutagen.easyid3 import EasyID3
from mutagen.mp3 import MP3
from mutagen.flac import FLAC
from mutagen.oggvorbis import OggVorbis

from app.config import settings
from app.database import get_db

SUPPORTED_EXTENSIONS = {".mp3", ".flac", ".ogg", ".wav", ".m4a", ".aac"}


def extract_metadata(filepath: str) -> dict:
    """Extract metadata from an audio file using mutagen."""
    result = {
        "path": filepath,
        "filename": os.path.basename(filepath),
        "title": None,
        "artist": None,
        "album": None,
        "duration": None,
    }

    try:
        audio = MutagenFile(filepath, easy=True)
        if audio is None:
            return result

        if hasattr(audio, "info") and audio.info:
            result["duration"] = audio.info.length

        if isinstance(audio, dict) or hasattr(audio, "get"):
            result["title"] = (audio.get("title") or [None])[0]
            result["artist"] = (audio.get("artist") or [None])[0]
            result["album"] = (audio.get("album") or [None])[0]
    except Exception:
        pass

    if not result["title"]:
        result["title"] = Path(filepath).stem

    return result


async def scan_library() -> int:
    """Walk music directory, extract metadata, upsert into DB. Returns count of tracks found."""
    music_dir = settings.music_dir
    db = await get_db()
    count = 0

    try:
        for root, _dirs, files in os.walk(music_dir):
            for fname in files:
                ext = os.path.splitext(fname)[1].lower()
                if ext not in SUPPORTED_EXTENSIONS:
                    continue

                filepath = os.path.join(root, fname)
                meta = extract_metadata(filepath)

                await db.execute(
                    """INSERT INTO tracks (path, title, artist, album, duration, filename)
                       VALUES (?, ?, ?, ?, ?, ?)
                       ON CONFLICT(path) DO UPDATE SET
                         title=excluded.title,
                         artist=excluded.artist,
                         album=excluded.album,
                         duration=excluded.duration,
                         filename=excluded.filename
                    """,
                    (meta["path"], meta["title"], meta["artist"], meta["album"],
                     meta["duration"], meta["filename"]),
                )
                count += 1

        await db.commit()
    finally:
        await db.close()

    return count
