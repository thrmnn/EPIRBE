import asyncio
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.icecast import get_icecast_status

router = APIRouter(tags=["status"])


@router.get("/api/status")
async def get_status():
    return await get_icecast_status()


@router.websocket("/ws/status")
async def ws_status(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            status = await get_icecast_status()
            await ws.send_json(status)
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
