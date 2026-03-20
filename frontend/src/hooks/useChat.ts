import { useState, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";

export interface ChatMsg {
  username: string;
  message: string;
  timestamp: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  const onMessage = useCallback((msg: ChatMsg) => {
    setMessages((prev) => [...prev.slice(-99), msg]);
  }, []);

  const { connected, send } = useWebSocket<ChatMsg>("/ws/chat", onMessage);

  const sendMessage = useCallback(
    (username: string, message: string) => {
      send({ username, message });
    },
    [send]
  );

  return { messages, sendMessage, connected };
}
