import { useState, useEffect } from "react";
import { api, Playlist as PlaylistType, Track } from "../api/client";

interface Props {
  selectedPlaylistId: number | null;
  onSelect: (id: number | null) => void;
}

export default function Playlist({ selectedPlaylistId, onSelect }: Props) {
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [newName, setNewName] = useState("");

  const loadPlaylists = async () => {
    try {
      setPlaylists(await api.getPlaylists());
    } catch {}
  };

  const loadTracks = async (id: number) => {
    try {
      setTracks(await api.getPlaylistTracks(id));
    } catch {}
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  useEffect(() => {
    if (selectedPlaylistId) loadTracks(selectedPlaylistId);
    else setTracks([]);
  }, [selectedPlaylistId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await api.createPlaylist(newName.trim());
    setNewName("");
    loadPlaylists();
  };

  const handleActivate = async (id: number) => {
    await api.activatePlaylist(id);
    loadPlaylists();
  };

  const handleDelete = async (id: number) => {
    await api.deletePlaylist(id);
    if (selectedPlaylistId === id) onSelect(null);
    loadPlaylists();
  };

  const handleRemoveTrack = async (trackId: number) => {
    if (!selectedPlaylistId) return;
    await api.removeTrackFromPlaylist(selectedPlaylistId, trackId);
    loadTracks(selectedPlaylistId);
    loadPlaylists();
  };

  return (
    <div className="bg-radio-surface-1 border border-radio-border-subtle rounded-xl flex flex-col h-96">
      <div className="px-4 py-2 border-b border-radio-border-subtle">
        <h2 className="text-sm font-semibold text-radio-text-tertiary uppercase tracking-wider mb-2">Playlists</h2>
        <form onSubmit={handleCreate} className="flex gap-2">
          <label htmlFor="playlist-name-input" className="sr-only">Playlist name</label>
          <input
            id="playlist-name-input"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New playlist..."
            className="flex-1 bg-radio-surface-base border border-radio-border-subtle rounded-lg px-3 py-1 text-sm outline-none focus:border-radio-primary"
          />
          <button type="submit" className="text-xs px-3 py-1 rounded-lg bg-radio-primary text-radio-surface-1 hover:bg-radio-primary-hover">
            Create
          </button>
        </form>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Playlist list */}
        <div role="listbox" aria-label="Playlists" className="w-1/3 border-r border-radio-border-subtle overflow-y-auto">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              role="option"
              aria-selected={selectedPlaylistId === pl.id}
              tabIndex={0}
              onClick={() => onSelect(pl.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(pl.id);
                }
              }}
              className={`px-3 py-2 cursor-pointer text-sm flex items-center justify-between hover:bg-radio-surface-2/50 transition-colors ${
                selectedPlaylistId === pl.id ? "bg-radio-surface-2" : ""
              }`}
            >
              <div className="truncate">
                <span className={pl.is_active ? "text-radio-primary font-semibold" : ""}>
                  {pl.name}
                </span>
                <span className="text-radio-text-secondary text-xs ml-1">({pl.track_count})</span>
              </div>
              <div className="flex items-center gap-1 ml-2 shrink-0">
                {!pl.is_active && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleActivate(pl.id); }}
                    aria-label="Activate playlist"
                    className="text-xs px-2.5 py-1.5 min-h-[36px] rounded bg-radio-primary-muted text-radio-primary hover:bg-radio-primary/20"
                    title="Activate"
                  >
                    ON
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(pl.id); }}
                  aria-label="Delete playlist"
                  className="text-xs px-2.5 py-1.5 min-h-[36px] rounded bg-radio-error-muted text-radio-error hover:bg-radio-error/20"
                  title="Delete"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Playlist tracks */}
        <div className="flex-1 overflow-y-auto">
          {selectedPlaylistId ? (
            tracks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-radio-text-secondary text-sm">
                Empty playlist. Add tracks from the Library.
              </div>
            ) : (
              <div className="divide-y divide-radio-border-subtle">
                {tracks.map((t: any) => (
                  <div key={t.id} className="flex items-center px-3 py-1.5 text-sm hover:bg-radio-surface-2/50">
                    <span className="text-radio-text-tertiary w-6 text-right mr-2">{t.position}</span>
                    <span className="truncate flex-1">{t.title || t.filename}</span>
                    <button
                      onClick={() => handleRemoveTrack(t.id)}
                      aria-label="Remove track from playlist"
                      className="text-radio-error hover:text-radio-error ml-2"
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-radio-text-secondary text-sm">
              Select a playlist
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
