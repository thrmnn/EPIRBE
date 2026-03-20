import { useNowPlaying } from "../hooks/useNowPlaying";

function Equalizer() {
  return (
    <div className="flex items-end gap-[2px] h-4">
      <span className="w-[3px] bg-radio-primary rounded-full animate-eq-1" />
      <span className="w-[3px] bg-radio-primary rounded-full animate-eq-2" />
      <span className="w-[3px] bg-radio-primary rounded-full animate-eq-3" />
    </div>
  );
}

export default function NowPlaying() {
  const { title, artist, listeners, connected } = useNowPlaying();

  return (
    <div className="bg-radio-surface-1 border border-radio-border-subtle rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-radio-text-secondary uppercase tracking-wider">
          Now Playing
        </h2>
        <span className={`w-2 h-2 rounded-full ${connected ? "bg-radio-success" : "bg-radio-error"}`}>
          <span className="sr-only">{connected ? "Connected" : "Disconnected"}</span>
        </span>
      </div>
      <div aria-live="polite" className="flex items-center gap-2">
        {title && <Equalizer />}
        <div className="min-w-0">
          <p className="text-lg font-medium text-radio-text-primary truncate">
            {title || "Waiting for stream..."}
          </p>
          {artist && (
            <p className="text-sm text-radio-text-secondary truncate">{artist}</p>
          )}
        </div>
      </div>
      <div role="status" className="flex items-center gap-1 mt-2 text-sm text-radio-text-secondary">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
        </svg>
        <span>{listeners} listener{listeners !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
