import { useRef, useState } from "react";
import { api } from "../api/client";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const streamUrl = "/stream";

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      audio.src = "";
      setPlaying(false);
    } else {
      // Reload src to get fresh stream
      audio.src = streamUrl;
      audio.volume = volume;
      try {
        await audio.play();
        setPlaying(true);
      } catch (err) {
        setPlaying(false);
        console.warn("Playback failed:", err);
      }
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const handleSkip = () => {
    api.skip();
  };

  return (
    <div role="region" aria-label="Audio player" className="flex items-center gap-4 bg-radio-surface-1 border border-radio-border-subtle rounded-xl p-4">
      <audio ref={audioRef} />

      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
        className="w-12 h-12 rounded-full bg-radio-primary flex items-center justify-center hover:bg-radio-primary-hover transition-all"
      >
        {playing ? (
          <svg className="w-5 h-5 text-radio-surface-1" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-radio-surface-1 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      <button
        onClick={handleSkip}
        aria-label="Skip to next track"
        className="w-9 h-9 rounded-lg bg-radio-border-subtle flex items-center justify-center hover:bg-radio-text-secondary/30 transition-all"
        title="Skip track"
      >
        <svg className="w-4 h-4 text-radio-text-primary" fill="currentColor" viewBox="0 0 24 24">
          <polygon points="5,3 15,12 5,21" />
          <rect x="16" y="3" width="3" height="18" />
        </svg>
      </button>

      <div className="flex items-center gap-2 ml-auto">
        <svg className="w-4 h-4 text-radio-text-secondary" fill="currentColor" viewBox="0 0 24 24">
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
          <path d="M14,8.5 C15.3,9.8 16,11.3 16,12 C16,12.7 15.3,14.2 14,15.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <label htmlFor="volume-slider" className="sr-only">Volume</label>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolume}
          className="w-24 accent-radio-primary"
        />
      </div>
    </div>
  );
}
