import { useState, useEffect, useRef } from "react";
import { api, Track } from "../api/client";

interface Props {
  onAddToPlaylist?: (trackId: number) => void;
}

export default function Library({ onAddToPlaylist }: Props) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [search, setSearch] = useState("");
  const [scanning, setScanning] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const loadTracks = async (q?: string) => {
    try {
      const data = await api.getTracks(q);
      setTracks(data);
    } catch {}
  };

  useEffect(() => {
    loadTracks();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadTracks(e.target.value || undefined), 300);
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      await api.scanLibrary();
      await loadTracks(search || undefined);
    } finally {
      setScanning(false);
    }
  };

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === tracks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tracks.map((t) => t.id)));
    }
  };

  const handleAddSelected = async () => {
    if (!onAddToPlaylist) return;
    for (const id of selectedIds) {
      onAddToPlaylist(id);
    }
    setSelectedIds(new Set());
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-radio-surface border border-radio-border rounded-xl flex flex-col h-96">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-radio-border">
        <h2 className="text-sm font-semibold text-radio-muted uppercase tracking-wider">Library</h2>
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="library-search" className="sr-only">Search tracks</label>
          <input
            id="library-search"
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search..."
            className="bg-radio-bg border border-radio-border rounded-lg px-3 py-1 text-sm outline-none focus:border-radio-accent w-40"
          />
          {onAddToPlaylist && selectedIds.size > 0 && (
            <button
              onClick={handleAddSelected}
              className="text-xs px-3 py-1 rounded-lg bg-radio-accent/20 text-radio-accent hover:bg-radio-accent/30 transition-all"
            >
              Add {selectedIds.size} Selected
            </button>
          )}
          <button
            onClick={handleScan}
            disabled={scanning}
            className="text-xs px-3 py-1 rounded-lg bg-radio-border hover:bg-radio-muted/30 transition-all disabled:opacity-50"
          >
            {scanning ? "Scanning..." : "Scan"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tracks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-radio-muted text-sm">
            No tracks found. Click Scan to import music.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-radio-muted text-xs uppercase sticky top-0 bg-radio-surface">
              <tr>
                {onAddToPlaylist && (
                  <th className="px-4 py-2 w-8">
                    <input
                      type="checkbox"
                      checked={tracks.length > 0 && selectedIds.size === tracks.length}
                      onChange={toggleSelectAll}
                      aria-label="Select all tracks"
                      className="accent-radio-accent"
                    />
                  </th>
                )}
                <th className="text-left px-4 py-2">Title</th>
                <th className="text-left px-4 py-2">Artist</th>
                <th className="text-right px-4 py-2">Duration</th>
                {onAddToPlaylist && <th className="px-4 py-2 w-8"></th>}
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr key={track.id} className="hover:bg-radio-border/50 transition-colors">
                  {onAddToPlaylist && (
                    <td className="px-4 py-1.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(track.id)}
                        onChange={() => toggleSelected(track.id)}
                        aria-label="Select track"
                        className="accent-radio-accent"
                      />
                    </td>
                  )}
                  <td className="px-4 py-1.5 truncate max-w-[200px]">{track.title || track.filename}</td>
                  <td className="px-4 py-1.5 text-radio-muted truncate max-w-[150px]">{track.artist || "Unknown"}</td>
                  <td className="px-4 py-1.5 text-right text-radio-muted">{formatDuration(track.duration)}</td>
                  {onAddToPlaylist && (
                    <td className="px-4 py-1.5 text-center">
                      <button
                        onClick={() => onAddToPlaylist(track.id)}
                        aria-label="Add to playlist"
                        className="text-radio-accent hover:brightness-125"
                        title="Add to playlist"
                      >
                        +
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
