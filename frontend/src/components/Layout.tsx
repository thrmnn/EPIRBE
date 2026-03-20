import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  isLive?: boolean;
  headerExtra?: ReactNode;
}

export default function Layout({ children, isLive = false, headerExtra }: Props) {
  return (
    <div className="min-h-screen bg-radio-surface-base text-radio-text-primary">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-radio-primary focus:text-radio-surface-1 focus:px-4 focus:py-2 focus:rounded">
        Skip to main content
      </a>
      {/* Header */}
      <header role="banner" className="border-b border-radio-border-subtle bg-radio-surface-1/80 backdrop-blur-md sticky top-0 z-50 min-h-[56px]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-radio-primary/30 blur-md" aria-hidden="true" />
            <div className="relative w-8 h-8 rounded-lg bg-radio-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-radio-surface-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H18A3,3 0 0,0 21,17V10C21,5 17,1 12,1Z" />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight font-display">
            EPIRBE <span className="text-radio-primary">Radio</span>
          </h1>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-radio-live/20 border border-radio-live/40 text-xs font-semibold text-radio-live uppercase tracking-wider animate-live-glow">
              <span className="w-1.5 h-1.5 rounded-full bg-radio-live animate-pulse" aria-hidden="true" />
              Live
            </span>
          )}
          {headerExtra && (
            <div className="ml-auto flex items-center gap-2">
              {headerExtra}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main role="main" id="main-content" className="max-w-7xl mx-auto p-4 md:px-6 pb-20">{children}</main>
    </div>
  );
}
