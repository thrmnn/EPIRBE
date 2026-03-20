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
    <div className="fixed inset-0 z-[60] bg-radio-surface-base flex items-center justify-center overflow-hidden">
      {/* Subtle animated floating particles for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-radio-primary/5 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-radio-secondary/5 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-radio-primary/3 rounded-full blur-2xl animate-[pulse_7s_ease-in-out_infinite_2s]" />
      </div>

      <div className="relative flex flex-col items-center gap-6 px-4 text-center">
        {/* Headphone icon with warm amber glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-radio-primary/30 blur-xl rounded-full" aria-hidden="true" />
          <svg
            className="relative w-24 h-24 text-radio-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H18A3,3 0 0,0 21,17V10C21,5 17,1 12,1Z" />
          </svg>
        </div>

        <div>
          <h1 className="font-display text-4xl font-bold text-radio-text-primary">
            RADIO <span className="text-radio-primary">EPIRBE</span>
          </h1>
          <p className="text-radio-text-secondary mt-1">Web Radio Station</p>
        </div>

        <button
          onClick={onStart}
          aria-label="Start listening"
          className="min-h-[56px] px-8 py-4 text-lg font-semibold text-radio-surface-1 bg-radio-primary rounded-full shadow-glow-md hover:shadow-glow-lg hover:bg-radio-primary-hover transition-all"
        >
          Start Listening
        </button>

        <div className="flex flex-col items-center gap-1 text-sm">
          {listenerCount > 0 && (
            <p className="text-radio-text-tertiary">{listenerCount} listening now</p>
          )}
          {currentTrack && (
            <p className="text-radio-text-secondary truncate max-w-xs">
              {currentTrack}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
