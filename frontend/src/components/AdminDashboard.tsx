import { useState, useEffect, useCallback } from "react";
import { api, type Track, type Playlist } from "../api/client";
import SourceSwitch from "./SourceSwitch";
import Chat from "./Chat";
import { useToast } from "./ui/ToastContext";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { toast } = useToast();

  // Playlist state
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [playlistLoading, setPlaylistLoading] = useState(false);

  // Library state
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [libraryLoading, setLibraryLoading] = useState(false);

  // ---- Data fetching ----

  const fetchPlaylists = useCallback(async () => {
    try {
      const data = await api.getPlaylists();
      setPlaylists(data);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    }
  }, []);

  const fetchPlaylistTracks = useCallback(async (id: number) => {
    try {
      const data = await api.getPlaylistTracks(id);
      setPlaylistTracks(data);
    } catch (err) {
      console.error("Failed to fetch playlist tracks:", err);
    }
  }, []);

  const fetchTracks = useCallback(async (search?: string) => {
    setLibraryLoading(true);
    try {
      const data = await api.getTracks(search);
      setTracks(data);
    } catch (err) {
      console.error("Failed to fetch tracks:", err);
    } finally {
      setLibraryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
    fetchTracks();
  }, [fetchPlaylists, fetchTracks]);

  useEffect(() => {
    if (selectedPlaylistId !== null) {
      fetchPlaylistTracks(selectedPlaylistId);
    } else {
      setPlaylistTracks([]);
    }
  }, [selectedPlaylistId, fetchPlaylistTracks]);

  // ---- Playlist operations ----

  const handleCreatePlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name) return;
    setPlaylistLoading(true);
    try {
      await api.createPlaylist(name);
      setNewPlaylistName("");
      await fetchPlaylists();
      toast("Playlist created", "success");
    } catch (err) {
      console.error("Failed to create playlist:", err);
      toast(`Error: ${err instanceof Error ? err.message : "Failed to create playlist"}`, "error");
    } finally {
      setPlaylistLoading(false);
    }
  };

  const handleDeletePlaylist = async (id: number) => {
    try {
      await api.deletePlaylist(id);
      if (selectedPlaylistId === id) {
        setSelectedPlaylistId(null);
      }
      await fetchPlaylists();
      toast("Playlist deleted", "success");
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      toast(`Error: ${err instanceof Error ? err.message : "Failed to delete playlist"}`, "error");
    }
  };

  const handleActivatePlaylist = async (id: number) => {
    try {
      await api.activatePlaylist(id);
      await fetchPlaylists();
      toast("Playlist activated", "success");
    } catch (err) {
      console.error("Failed to activate playlist:", err);
      toast(`Error: ${err instanceof Error ? err.message : "Failed to activate playlist"}`, "error");
    }
  };

  const handleRemoveTrackFromPlaylist = async (trackId: number) => {
    if (selectedPlaylistId === null) return;
    try {
      await api.removeTrackFromPlaylist(selectedPlaylistId, trackId);
      await fetchPlaylistTracks(selectedPlaylistId);
      await fetchPlaylists(); // refresh track count
    } catch (err) {
      console.error("Failed to remove track:", err);
      toast(`Error: ${err instanceof Error ? err.message : "Failed to remove track"}`, "error");
    }
  };

  const handleAddTrackToPlaylist = async (trackId: number) => {
    if (selectedPlaylistId === null) return;
    try {
      await api.addTrackToPlaylist(selectedPlaylistId, trackId);
      await fetchPlaylistTracks(selectedPlaylistId);
      await fetchPlaylists(); // refresh track count
    } catch (err) {
      console.error("Failed to add track:", err);
      toast(`Error: ${err instanceof Error ? err.message : "Failed to add track"}`, "error");
    }
  };

  // ---- Library operations ----

  const handleScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const result = await api.scanLibrary();
      setScanResult(`Found ${result.tracks_found} tracks`);
      await fetchTracks(searchQuery || undefined);
      toast(`Library scan complete: ${result.tracks_found} tracks found`, "success");
    } catch (err) {
      console.error("Failed to scan library:", err);
      setScanResult("Scan failed");
      toast(`Error: ${err instanceof Error ? err.message : "Library scan failed"}`, "error");
    } finally {
      setScanning(false);
    }
  };

  const handleSearch = () => {
    fetchTracks(searchQuery || undefined);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  // ---- Helpers ----

  const formatDuration = (seconds: number | null): string => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-radio-bg text-radio-text">
      {/* Header */}
      <header className="bg-gradient-to-r from-radio-accent/20 via-radio-surface to-radio-surface border-b border-radio-accent/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-radio-accent rounded-full animate-pulse" />
          <h1 className="text-xl font-bold">DJ Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            aria-label="Back to listener view"
            className="text-sm text-radio-muted hover:text-radio-text transition-colors"
          >
            Listener View
          </button>
          <button
            onClick={onLogout}
            aria-label="Logout"
            className="px-3 py-1.5 text-sm font-semibold bg-radio-border text-radio-text rounded-lg hover:bg-radio-muted/30 transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ===== LEFT COLUMN ===== */}
          <div className="flex flex-col gap-6">
            {/* Mic Control Panel */}
            <SourceSwitch />

            {/* Playlist Manager Panel */}
            <section className="bg-radio-surface border border-radio-border rounded-xl p-4">
              <h2 className="text-sm font-semibold text-radio-muted uppercase tracking-wider mb-3">
                Playlists
              </h2>

              {/* Create form */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreatePlaylist();
                  }}
                  placeholder="New playlist name"
                  aria-label="New playlist name"
                  className="flex-1 px-3 py-2 bg-radio-bg border border-radio-border rounded-lg text-sm text-radio-text placeholder:text-radio-muted focus:outline-none focus:border-radio-accent"
                />
                <button
                  onClick={handleCreatePlaylist}
                  disabled={playlistLoading || !newPlaylistName.trim()}
                  aria-label="Create playlist"
                  className="px-4 min-h-[44px] bg-radio-accent text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>

              {/* Playlist list */}
              <div className="space-y-2 mb-4">
                {playlists.map((pl) => (
                  <div
                    key={pl.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                      selectedPlaylistId === pl.id
                        ? "border-radio-accent bg-radio-accent/10"
                        : "border-radio-border hover:border-radio-muted"
                    }`}
                    onClick={() =>
                      setSelectedPlaylistId(
                        selectedPlaylistId === pl.id ? null : pl.id
                      )
                    }
                    role="button"
                    aria-label={`Select playlist ${pl.name}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedPlaylistId(
                          selectedPlaylistId === pl.id ? null : pl.id
                        );
                      }
                    }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{pl.name}</p>
                      <p className="text-xs text-radio-muted">
                        {pl.track_count} track{pl.track_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivatePlaylist(pl.id);
                        }}
                        aria-label={
                          pl.is_active
                            ? `${pl.name} is active`
                            : `Activate ${pl.name}`
                        }
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                          pl.is_active
                            ? "bg-radio-muted/20 text-radio-muted cursor-default"
                            : "bg-radio-accent text-white hover:brightness-110"
                        }`}
                        disabled={pl.is_active}
                      >
                        {pl.is_active ? (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        ) : (
                          "Activate"
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlaylist(pl.id);
                        }}
                        aria-label={`Delete ${pl.name}`}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-xs font-semibold bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {playlists.length === 0 && (
                  <p className="text-sm text-radio-muted py-2">
                    No playlists yet. Create one above.
                  </p>
                )}
              </div>

              {/* Selected playlist tracks */}
              {selectedPlaylistId !== null && (
                <div className="border-t border-radio-border pt-3">
                  <h3 className="text-xs font-semibold text-radio-muted uppercase tracking-wider mb-2">
                    Tracks in{" "}
                    {playlists.find((p) => p.id === selectedPlaylistId)?.name}
                  </h3>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {playlistTracks.map((track, index) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-radio-bg/50"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-radio-muted w-5 text-right flex-shrink-0">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm truncate">
                              {track.title || track.filename}
                            </p>
                            {track.artist && (
                              <p className="text-xs text-radio-muted truncate">
                                {track.artist}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveTrackFromPlaylist(track.id)}
                          aria-label={`Remove ${track.title || track.filename} from playlist`}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 13H5v-2h14v2z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {playlistTracks.length === 0 && (
                      <p className="text-xs text-radio-muted py-2">
                        No tracks in this playlist.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="flex flex-col gap-6">
            {/* Library Panel */}
            <section className="bg-radio-surface border border-radio-border rounded-xl p-4">
              <h2 className="text-sm font-semibold text-radio-muted uppercase tracking-wider mb-3">
                Library
              </h2>

              {/* Search + Scan */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search tracks..."
                  aria-label="Search tracks"
                  className="flex-1 px-3 py-2 bg-radio-bg border border-radio-border rounded-lg text-sm text-radio-text placeholder:text-radio-muted focus:outline-none focus:border-radio-accent"
                />
                <button
                  onClick={handleSearch}
                  aria-label="Search"
                  className="px-3 min-h-[44px] bg-radio-border text-radio-text text-sm font-semibold rounded-lg hover:bg-radio-muted/30 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  aria-label="Scan library"
                  className="px-4 min-h-[44px] bg-radio-border text-radio-text text-sm font-semibold rounded-lg hover:bg-radio-muted/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {scanning ? "Scanning..." : "Scan"}
                </button>
              </div>

              {scanResult && (
                <p className="text-xs text-radio-muted mb-2">{scanResult}</p>
              )}

              {/* Track table */}
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-radio-muted uppercase border-b border-radio-border">
                      <th className="text-left py-2 px-1">Title</th>
                      <th className="text-left py-2 px-1 hidden sm:table-cell">
                        Artist
                      </th>
                      <th className="text-right py-2 px-1 w-16">Duration</th>
                      <th className="text-right py-2 px-1 w-12" />
                    </tr>
                  </thead>
                  <tbody>
                    {tracks.map((track) => (
                      <tr
                        key={track.id}
                        className="border-b border-radio-border/50 hover:bg-radio-bg/50"
                      >
                        <td className="py-2 px-1 truncate max-w-[200px]">
                          {track.title || track.filename}
                        </td>
                        <td className="py-2 px-1 text-radio-muted truncate max-w-[150px] hidden sm:table-cell">
                          {track.artist || "—"}
                        </td>
                        <td className="py-2 px-1 text-right text-radio-muted">
                          {formatDuration(track.duration)}
                        </td>
                        <td className="py-2 px-1 text-right">
                          <button
                            onClick={() => handleAddTrackToPlaylist(track.id)}
                            disabled={selectedPlaylistId === null}
                            aria-label={`Add ${track.title || track.filename} to playlist`}
                            title={
                              selectedPlaylistId === null
                                ? "Select a playlist first"
                                : "Add to playlist"
                            }
                            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-radio-accent hover:text-radio-accent/80 transition-colors disabled:text-radio-muted disabled:cursor-not-allowed"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {libraryLoading && (
                  <p className="text-sm text-radio-muted py-4 text-center">
                    Loading...
                  </p>
                )}
                {!libraryLoading && tracks.length === 0 && (
                  <p className="text-sm text-radio-muted py-4 text-center">
                    No tracks found. Try scanning your library.
                  </p>
                )}
              </div>
            </section>

            {/* Chat Panel */}
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
}
