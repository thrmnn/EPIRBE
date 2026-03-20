import { useEffect, useRef, useState } from "react";

interface AudioMeterProps {
  stream: MediaStream | null;
  active: boolean;
}

export default function AudioMeter({ stream, active }: AudioMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!active || !stream) {
      setLevel(0);
      return;
    }

    let cancelled = false;

    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const source = audioCtx.createMediaStreamSource(stream);
    sourceRef.current = source;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const update = () => {
      if (cancelled) return;

      analyser.getByteFrequencyData(dataArray);

      // Compute RMS-like average level
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      // Normalize to 0-100
      const normalized = Math.min(100, (avg / 255) * 100 * 2);
      setLevel(normalized);

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);

      source.disconnect();
      sourceRef.current = null;

      analyserRef.current = null;

      if (audioCtx.state !== "closed") {
        audioCtx.close();
      }
      audioCtxRef.current = null;
    };
  }, [stream, active]);

  const getBarColor = (pct: number): string => {
    if (pct >= 80) return "bg-radio-error";
    if (pct >= 60) return "bg-radio-warning";
    return "bg-radio-success";
  };

  const isInactive = !active || !stream;

  return (
    <div
      className="w-full h-2 rounded-full bg-radio-surface-2 overflow-hidden"
      role="meter"
      aria-label="Audio level"
      aria-valuenow={Math.round(level)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {isInactive ? (
        <div className="h-full w-0 rounded-full bg-radio-surface-2 transition-all duration-200" />
      ) : (
        <div
          className={`h-full rounded-full transition-all duration-75 ${getBarColor(level)}`}
          style={{ width: `${level}%` }}
        />
      )}
    </div>
  );
}
