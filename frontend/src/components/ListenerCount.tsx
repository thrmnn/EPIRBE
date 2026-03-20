// TODO: Consider removing — functionality integrated into NowPlaying.tsx
// This component is kept as a standalone if needed elsewhere.

interface Props {
  count: number;
}

export default function ListenerCount({ count }: Props) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-radio-text-secondary">
      <div className="w-2 h-2 rounded-full bg-radio-primary animate-pulse" />
      <span>
        {count} listener{count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
