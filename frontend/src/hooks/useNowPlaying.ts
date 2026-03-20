import { useState, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";

export interface StreamStatus {
  title: string | null;
  listeners: number;
  server_name: string;
}

export function useNowPlaying() {
  const [status, setStatus] = useState<StreamStatus>({
    title: null,
    listeners: 0,
    server_name: "EPIRBE Radio",
  });

  const onMessage = useCallback((data: StreamStatus) => {
    setStatus(data);
  }, []);

  const { connected } = useWebSocket<StreamStatus>("/ws/status", onMessage);

  return { ...status, connected };
}
