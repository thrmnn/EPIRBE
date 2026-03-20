import { useState, useRef, useCallback, useEffect } from "react";
import { config } from "../config";

type ConnectionState = "idle" | "connecting" | "live" | "error";

export default function SourceSwitch() {
  const [connState, setConnState] = useState<ConnectionState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const connStateRef = useRef(connState);
  useEffect(() => { connStateRef.current = connState; }, [connState]);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const cleanup = useCallback(() => {
    // Disconnect and close ScriptProcessorNode
    if (processorRef.current) {
      processorRef.current.onaudioprocess = null;
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    // Disconnect source node
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    // Stop all media tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    // Close AudioContext
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      if (
        wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING
      ) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
  }, []);

  const startMic = async () => {
    setErrorMsg(null);
    setConnState("connecting");

    // 1. Get mic access
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
    } catch (err) {
      console.error("Mic access denied:", err);
      setErrorMsg("Microphone access denied");
      setConnState("error");
      return;
    }

    // 2. Open WebSocket
    const wsUrl = config.wsUrl("/ws/mic");
    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onerror = () => {
      console.error("WebSocket error");
      setErrorMsg("Connection error");
      setConnState("error");
      cleanup();
    };

    ws.onclose = () => {
      if (connStateRef.current === "live" || connStateRef.current === "connecting") {
        setConnState("idle");
      }
      cleanup();
    };

    // Wait for the WebSocket to open before starting audio
    ws.onopen = () => {
      try {
        // 3. Set up AudioContext at 44100 Hz
        const audioCtx = new AudioContext({ sampleRate: 44100 });
        audioCtxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        sourceNodeRef.current = source;

        // 4. ScriptProcessorNode: 4096 buffer, 1 input channel, 1 output channel
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e: AudioProcessingEvent) => {
          if (ws.readyState !== WebSocket.OPEN) return;

          const inputData = e.inputBuffer.getChannelData(0);
          // Send the raw Float32Array as binary
          ws.send(inputData.buffer.slice(
            inputData.byteOffset,
            inputData.byteOffset + inputData.byteLength
          ));
        };

        source.connect(processor);
        // Must connect to destination for onaudioprocess to fire
        processor.connect(audioCtx.destination);

        setConnState("live");
      } catch (err) {
        console.error("Audio setup failed:", err);
        setErrorMsg("Audio setup failed");
        setConnState("error");
        cleanup();
      }
    };
  };

  const stopMic = () => {
    cleanup();
    setConnState("idle");
    setErrorMsg(null);
  };

  const isActive = connState === "live" || connState === "connecting";

  return (
    <div className="bg-radio-surface-1 border border-radio-border-subtle rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-radio-text-tertiary uppercase tracking-wider">
            Source
          </h2>
          <p className="text-sm mt-1">
            {connState === "live" && (
              <span className="text-radio-live font-semibold">
                <span className="inline-block w-2 h-2 bg-radio-live rounded-full mr-1.5 animate-pulse" />
                LIVE MIC
              </span>
            )}
            {connState === "connecting" && (
              <span className="text-radio-warning font-semibold">Connecting...</span>
            )}
            {connState === "error" && (
              <span className="text-radio-error font-semibold">
                {errorMsg || "Error"}
              </span>
            )}
            {connState === "idle" && (
              <span className="text-radio-text-primary">Playlist</span>
            )}
          </p>
        </div>

        <button
          onClick={isActive ? stopMic : startMic}
          disabled={connState === "connecting"}
          aria-label={
            connState === "live" ? "Stop microphone" :
            connState === "connecting" ? "Connecting microphone" :
            connState === "error" ? "Retry microphone connection" :
            "Go live with microphone"
          }
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            isActive
              ? "bg-radio-error text-white hover:brightness-110"
              : connState === "error"
                ? "bg-radio-warning text-radio-surface-1 hover:brightness-110"
                : "bg-radio-surface-2 text-radio-text-primary hover:bg-radio-surface-highlight"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {connState === "live" && "Stop Mic"}
          {connState === "connecting" && "Connecting..."}
          {connState === "error" && "Retry"}
          {connState === "idle" && "Go Live"}
        </button>
      </div>
    </div>
  );
}
