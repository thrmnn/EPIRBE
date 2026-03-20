import asyncio
import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.mic_relay import mic_relay

logger = logging.getLogger(__name__)

router = APIRouter(tags=["mic"])

# Only allow one live mic connection at a time
_live_lock = asyncio.Lock()


@router.websocket("/ws/mic")
async def ws_mic(ws: WebSocket):
    if _live_lock.locked():
        await ws.close(code=1008, reason="Another mic session is already active")
        return

    async with _live_lock:
        await ws.accept()
        logger.info("Mic WebSocket connected")

        started = await mic_relay.start()
        if not started:
            await ws.close(code=1011, reason="Failed to start audio relay")
            return

        try:
            while True:
                # Check that ffmpeg hasn't died unexpectedly
                if not mic_relay.is_active:
                    logger.error("ffmpeg process died unexpectedly")
                    await ws.close(code=1011, reason="Audio relay process died")
                    break

                data = await ws.receive_bytes()
                await mic_relay.feed(data)
        except WebSocketDisconnect:
            logger.info("Mic WebSocket disconnected")
        except Exception:
            logger.exception("Error in mic WebSocket")
        finally:
            await mic_relay.stop()
