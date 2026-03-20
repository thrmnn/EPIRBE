import asyncio
import json
from collections import deque
from datetime import datetime, timezone

from fastapi import WebSocket


class ChatManager:
    def __init__(self, history_size: int = 50):
        self.connections: list[WebSocket] = []
        self.history: deque[dict] = deque(maxlen=history_size)
        self._lock = asyncio.Lock()

    async def connect(self, ws: WebSocket):
        await ws.accept()
        async with self._lock:
            self.connections.append(ws)
        # Send chat history to new connection
        for msg in self.history:
            await ws.send_json(msg)

    async def disconnect(self, ws: WebSocket):
        async with self._lock:
            if ws in self.connections:
                self.connections.remove(ws)

    async def broadcast(self, username: str, message: str):
        msg = {
            "username": username,
            "message": message,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        self.history.append(msg)

        async with self._lock:
            dead = []
            for ws in self.connections:
                try:
                    await ws.send_json(msg)
                except Exception:
                    dead.append(ws)
            for ws in dead:
                self.connections.remove(ws)


chat_manager = ChatManager()
