import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.chat_manager import chat_manager

router = APIRouter(tags=["chat"])


@router.websocket("/ws/chat")
async def ws_chat(ws: WebSocket):
    await chat_manager.connect(ws)
    try:
        while True:
            data = await ws.receive_text()
            msg = json.loads(data)
            username = msg.get("username", "Anonymous")
            message = msg.get("message", "")
            if message.strip():
                await chat_manager.broadcast(username, message)
    except WebSocketDisconnect:
        await chat_manager.disconnect(ws)
    except Exception:
        await chat_manager.disconnect(ws)
