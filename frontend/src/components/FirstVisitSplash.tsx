interface FirstVisitSplashProps {
  onStart: () => void;
  listenerCount: number;
  currentTrack?: string;
}

export default function FirstVisitSplash({
  onStart,
  listenerCount,
  currentTrack,
}: FirstVisitSplashProps) {
  return (
    <div className="fixed inset-0 z-40 bg-radio-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 px-4 text-center">
        {/* Headphone icon with accent glow */}
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-radio-accent/20 rounded-full" />
          <svg
            className="relative w-24 h-24 text-radio-accent"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H18A3,3 0 0,0 21,17V10C21,5 17,1 12,1Z" />
          </svg>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-radio-text">EPIRBE Radio</h1>
          <p className="text-radio-muted mt-1">Web Radio Station</p>
        </div>

        <button
          onClick={onStart}
          aria-label="Start listening"
          className="min-h-[56px] px-8 text-lg font-semibold text-white bg-radio-accent rounded-full hover:brightness-110 transition-all"
        >
          Start Listening
        </button>

        <div className="flex flex-col items-center gap-1 text-sm text-radio-muted">
          {listenerCount > 0 && (
            <p>{listenerCount} listening now</p>
          )}
          {currentTrack && (
            <p className="text-radio-text/70 truncate max-w-xs">
              {currentTrack}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
