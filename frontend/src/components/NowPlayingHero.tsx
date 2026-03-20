import { useNowPlaying } from "../hooks/useNowPlaying";

interface NowPlayingHeroProps {
  isLive?: boolean;
  djName?: string;
}

function Equalizer() {
  return (
    <div className="flex items-end gap-[3px] h-6">
      <span className="w-[4px] bg-radio-accent rounded-full animate-eq-1" />
      <span className="w-[4px] bg-radio-accent rounded-full animate-eq-2" />
      <span className="w-[4px] bg-radio-accent rounded-full animate-eq-3" />
      <span className="w-[4px] bg-radio-accent rounded-full animate-eq-1" style={{ animationDelay: "0.2s" }} />
      <span className="w-[4px] bg-radio-accent rounded-full animate-eq-2" style={{ animationDelay: "0.1s" }} />
    </div>
  );
}

export default function NowPlayingHero({ isLive = false, djName }: NowPlayingHeroProps) {
  const { title, artist, listeners } = useNowPlaying();

  const renderContent = () => {
    // Tier 1: Title exists
    if (title) {
      return (
        <div className="flex flex-col items-center gap-3">
          <Equalizer />
          <h1 className="text-2xl font-bold text-radio-text text-center">{title}</h1>
          {artist && (
            <p className="text-lg text-radio-muted text-center">{artist}</p>
          )}
          {isLive && (
            <span className="flex items-center gap-1.5 bg-red-600/20 text-red-400 text-sm font-semibold px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE
            </span>
          )}
        </div>
      );
    }

    // Tier 2: No title but live
    if (isLive) {
      return (
        <div className="flex flex-col items-center gap-3">
          <span className="flex items-center gap-2 text-red-400 text-2xl font-bold">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            LIVE
          </span>
          {djName && (
            <p className="text-lg text-radio-muted text-center">{djName}</p>
          )}
        </div>
      );
    }

    // Tier 3: No title and not live
    return (
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-radio-text">EPIRBE Radio</h1>
        <p className="text-sm text-radio-muted">Waiting for stream...</p>
      </div>
    );
  };

  return (
    <div
      aria-live="polite"
      className="relative bg-gradient-to-b from-radio-surface to-transparent border border-radio-border rounded-xl min-h-[200px] flex flex-col items-center justify-center p-8"
    >
      {/* Subtle animated gradient overlay for idle state */}
      {!title && !isLive && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-radio-accent/5 via-transparent to-radio-accent/5 animate-pulse pointer-events-none" />
      )}

      <div className="relative z-10">
        {renderContent()}
      </div>

      {/* Listener count */}
      <div className="relative z-10 flex items-center gap-1.5 mt-6 text-sm text-radio-muted">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
        </svg>
        <span>
          {listeners} listener{listeners !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
