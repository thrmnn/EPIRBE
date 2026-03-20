from fastapi import APIRouter

from app.database import get_db
from app.models import Track
from app.services.library_scanner import scan_library

router = APIRouter(prefix="/api/library", tags=["library"])


@router.post("/scan")
async def scan_music_library():
    count = await scan_library()
    return {"status": "ok", "tracks_found": count}


@router.get("/tracks", response_model=list[Track])
async def list_tracks(search: str | None = None):
    db = await get_db()
    try:
        if search:
            query = """
                SELECT * FROM tracks
                WHERE title LIKE ? OR artist LIKE ? OR filename LIKE ?
                ORDER BY artist, title
            """
            pattern = f"%{search}%"
            cursor = await db.execute(query, (pattern, pattern, pattern))
        else:
            cursor = await db.execute("SELECT * FROM tracks ORDER BY artist, title")
        rows = await cursor.fetchall()
        return [Track(**dict(row)) for row in rows]
    finally:
        await db.close()
