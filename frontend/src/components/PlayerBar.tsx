import { useRef, useState, useCallback } from "react";
import { useNowPlaying } from "../hooks/useNowPlaying";
import { api } from "../api/client";
import { config } from "../config";

interface PlayerBarProps {
  isLive?: boolean;
}

function Equalizer() {
  return (
    <div className="flex items-end gap-[2px] h-3">
      <span className="w-[2px] bg-radio-primary rounded-full animate-eq-1" />
      <span className="w-[2px] bg-radio-primary rounded-full animate-eq-2" />
      <span className="w-[2px] bg-radio-primary rounded-full animate-eq-3" />
    </div>
  );
}

export default function PlayerBar({ isLive = false }: PlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const { title, artist, listeners } = useNowPlaying();

  const streamUrl = config.streamUrl;

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      audio.src = "";
      setPlaying(false);
      setAutoplayBlocked(false);
    } else {
      audio.src = streamUrl;
      audio.volume = volume;
      try {
        await audio.play();
        setPlaying(true);
        setAutoplayBlocked(false);
      } catch {
        setAutoplayBlocked(true);
        setPlaying(false);
      }
    }
  }, [playing, volume]);

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const handleSkip = () => {
    api.skip();
  };

  return (
    <div
      role="region"
      aria-label="Audio player"
      className={`fixed bottom-0 left-0 right-0 h-16 xl:h-[72px] bg-radio-surface-1/95 backdrop-blur-md border-t border-radio-border-subtle z-50 flex items-center px-4 gap-4${playing ? " shadow-[0_-1px_12px_0_rgba(232,146,75,0.15)]" : ""}`}
    >
      <audio ref={audioRef} />

      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
        className="w-11 h-11 flex-shrink-0 rounded-full bg-radio-primary text-radio-surface-1 flex items-center justify-center hover:bg-radio-primary-hover transition-all"
      >
        {playing ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      {/* Track Info (center) */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {playing && <Equalizer />}
        <div className="min-w-0">
          <p className="text-sm font-medium text-radio-text-primary truncate">
            {title ? (
              <>
                {title}
                {artist && (
                  <span className="text-radio-text-secondary"> — {artist}</span>
                )}
              </>
            ) : (
              <span className="text-radio-text-secondary">
                {playing ? "Streaming..." : "Ready to play"}
              </span>
            )}
          </p>
          {autoplayBlocked && (
            <p className="text-xs text-radio-warning">
              Tap play again — your browser blocked autoplay
            </p>
          )}
        </div>
        {isLive && (
          <span className="flex-shrink-0 flex items-center gap-1.5 bg-radio-live/20 border border-radio-live/40 text-radio-live text-xs font-semibold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-radio-live rounded-full animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {/* Right: Skip, Volume, Listeners */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {!isLive && (
          <button
            onClick={handleSkip}
            aria-label="Skip track"
            className="w-9 h-9 rounded-lg bg-radio-surface-2 text-radio-text-secondary flex items-center justify-center hover:bg-radio-surface-highlight transition-all"
          >
            <svg className="w-4 h-4 text-radio-text-secondary" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 15,12 5,21" />
              <rect x="16" y="3" width="3" height="18" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-radio-text-secondary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
            <path
              d="M14,8.5 C15.3,9.8 16,11.3 16,12 C16,12.7 15.3,14.2 14,15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            aria-label="Volume"
            className="w-20 accent-radio-primary"
          />
        </div>

        <div className="flex items-center gap-1 text-xs text-radio-text-tertiary">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
          </svg>
          <span>{listeners}</span>
        </div>
      </div>
    </div>
  );
}
