import os
from fastapi import APIRouter, HTTPException

from app.config import settings
from app.database import get_db
from app.models import PlaylistCreate, PlaylistOut, PlaylistTrackAdd

router = APIRouter(prefix="/api/playlists", tags=["playlists"])


async def write_m3u(playlist_id: int):
    """Write the active playlist as current.m3u for Liquidsoap."""
    db = await get_db()
    try:
        cursor = await db.execute(
            """SELECT t.path FROM playlist_tracks pt
               JOIN tracks t ON t.id = pt.track_id
               WHERE pt.playlist_id = ?
               ORDER BY pt.position""",
            (playlist_id,),
        )
        rows = await cursor.fetchall()
        m3u_path = os.path.join(settings.playlist_dir, "current.m3u")
        with open(m3u_path, "w") as f:
            f.write("#EXTM3U\n")
            for row in rows:
                f.write(row["path"] + "\n")
    finally:
        await db.close()


@router.get("/", response_model=list[PlaylistOut])
async def list_playlists():
    db = await get_db()
    try:
        cursor = await db.execute("""
            SELECT p.id, p.name, p.is_active,
                   COUNT(pt.id) as track_count
            FROM playlists p
            LEFT JOIN playlist_tracks pt ON pt.playlist_id = p.id
            GROUP BY p.id
            ORDER BY p.name
        """)
        rows = await cursor.fetchall()
        return [PlaylistOut(**dict(row)) for row in rows]
    finally:
        await db.close()


@router.post("/", response_model=PlaylistOut)
async def create_playlist(data: PlaylistCreate):
    db = await get_db()
    try:
        cursor = await db.execute(
            "INSERT INTO playlists (name) VALUES (?)", (data.name,)
        )
        await db.commit()
        return PlaylistOut(id=cursor.lastrowid, name=data.name, is_active=False, track_count=0)
    finally:
        await db.close()


@router.delete("/{playlist_id}")
async def delete_playlist(playlist_id: int):
    db = await get_db()
    try:
        await db.execute("DELETE FROM playlist_tracks WHERE playlist_id = ?", (playlist_id,))
        await db.execute("DELETE FROM playlists WHERE id = ?", (playlist_id,))
        await db.commit()
        return {"status": "deleted"}
    finally:
        await db.close()


@router.post("/{playlist_id}/tracks")
async def add_track_to_playlist(playlist_id: int, data: PlaylistTrackAdd):
    db = await get_db()
    try:
        # Get next position
        cursor = await db.execute(
            "SELECT COALESCE(MAX(position), 0) + 1 as next_pos FROM playlist_tracks WHERE playlist_id = ?",
            (playlist_id,),
        )
        row = await cursor.fetchone()
        pos = row["next_pos"]

        await db.execute(
            "INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (?, ?, ?)",
            (playlist_id, data.track_id, pos),
        )
        await db.commit()

        # If this playlist is active, regenerate m3u
        cursor = await db.execute("SELECT is_active FROM playlists WHERE id = ?", (playlist_id,))
        pl = await cursor.fetchone()
        if pl and pl["is_active"]:
            await write_m3u(playlist_id)

        return {"status": "added", "position": pos}
    finally:
        await db.close()


@router.delete("/{playlist_id}/tracks/{track_id}")
async def remove_track_from_playlist(playlist_id: int, track_id: int):
    db = await get_db()
    try:
        await db.execute(
            "DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?",
            (playlist_id, track_id),
        )
        await db.commit()

        cursor = await db.execute("SELECT is_active FROM playlists WHERE id = ?", (playlist_id,))
        pl = await cursor.fetchone()
        if pl and pl["is_active"]:
            await write_m3u(playlist_id)

        return {"status": "removed"}
    finally:
        await db.close()


@router.get("/{playlist_id}/tracks")
async def get_playlist_tracks(playlist_id: int):
    db = await get_db()
    try:
        cursor = await db.execute(
            """SELECT t.*, pt.position FROM playlist_tracks pt
               JOIN tracks t ON t.id = pt.track_id
               WHERE pt.playlist_id = ?
               ORDER BY pt.position""",
            (playlist_id,),
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        await db.close()


@router.post("/{playlist_id}/activate")
async def activate_playlist(playlist_id: int):
    db = await get_db()
    try:
        # Check playlist exists
        cursor = await db.execute("SELECT id FROM playlists WHERE id = ?", (playlist_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Playlist not found")

        # Deactivate all, activate this one
        await db.execute("UPDATE playlists SET is_active = 0")
        await db.execute("UPDATE playlists SET is_active = 1 WHERE id = ?", (playlist_id,))
        await db.commit()

        await write_m3u(playlist_id)
        return {"status": "activated"}
    finally:
        await db.close()
