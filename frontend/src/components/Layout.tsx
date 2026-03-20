import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-radio-bg text-radio-text">
      {/* Header */}
      <header className="border-b border-radio-border bg-radio-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-radio-accent flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H18A3,3 0 0,0 21,17V10C21,5 17,1 12,1Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            EPIRBE <span className="text-radio-accent">Radio</span>
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}
