import { useState, useRef } from "react";

export default function SourceSwitch() {
  const [isLive, setIsLive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 44100 });
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);

      // Connect to Liquidsoap harbor via backend proxy (future enhancement)
      // For now, we set the state to show mic is active
      // Full implementation would send PCM data over WebSocket to backend
      // which pipes it to ffmpeg -> Liquidsoap harbor

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioCtx.destination);

      // In production: open WS and send audio chunks
      // processor.onaudioprocess = (e) => { ... }

      setMicActive(true);
      setIsLive(true);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  };

  const stopMic = () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    processorRef.current?.disconnect();
    audioCtxRef.current?.close();
    wsRef.current?.close();
    setMicActive(false);
    setIsLive(false);
  };

  return (
    <div className="bg-radio-surface border border-radio-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-radio-muted uppercase tracking-wider">Source</h2>
          <p className="text-sm mt-1">
            {isLive ? (
              <span className="text-radio-accent font-semibold">LIVE MIC</span>
            ) : (
              <span className="text-radio-text">Playlist</span>
            )}
          </p>
        </div>

        <button
          onClick={micActive ? stopMic : startMic}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            micActive
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-radio-border text-radio-text hover:bg-radio-muted/30"
          }`}
        >
          {micActive ? "Stop Mic" : "Go Live"}
        </button>
      </div>
    </div>
  );
}
