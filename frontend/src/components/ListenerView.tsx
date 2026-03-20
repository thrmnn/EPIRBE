import NowPlayingHero from "./NowPlayingHero";

interface ListenerViewProps {
  children?: React.ReactNode;
}

export default function ListenerView({ children }: ListenerViewProps) {
  return (
    <div className="pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left: Now Playing Hero (full on mobile, 1col on tablet, 2/3 on desktop) */}
        <div className="md:col-span-1">
          <NowPlayingHero />
        </div>

        {/* Right: Children slot for chat, library, etc */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
