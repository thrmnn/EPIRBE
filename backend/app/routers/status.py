import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.icecast import get_icecast_status

router = APIRouter(tags=["status"])


@router.get("/api/status")
async def get_status():
    return await get_icecast_status()


@router.websocket("/ws/status")
async def ws_status(ws: WebSocket):
    await ws.accept()
    prev_status: dict | None = None
    try:
        while True:
            status = await get_icecast_status()
            # Always send on first iteration; afterwards only when data changed
            if status != prev_status:
                await ws.send_json(status)
                prev_status = status
            await asyncio.sleep(2)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
