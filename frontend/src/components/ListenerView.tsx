import NowPlayingHero from "./NowPlayingHero";
// Chat, Library will be imported when wired in Phase 2

interface ListenerViewProps {
  children?: React.ReactNode;
}

export default function ListenerView({ children }: ListenerViewProps) {
  return (
    <div className="pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Now Playing Hero (2/3 on desktop) */}
        <div className="lg:col-span-2">
          <NowPlayingHero />
        </div>

        {/* Right: Children slot for chat, library, etc (1/3 on desktop) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
