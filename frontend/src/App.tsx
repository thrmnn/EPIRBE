import { useState, useCallback } from "react";
import Layout from "./components/Layout";
import Player from "./components/Player";
import NowPlaying from "./components/NowPlaying";
import Chat from "./components/Chat";
import Library from "./components/Library";
import Playlist from "./components/Playlist";
import SourceSwitch from "./components/SourceSwitch";
import { api } from "./api/client";

export default function App() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);

  const handleAddToPlaylist = useCallback(
    async (trackId: number) => {
      if (!selectedPlaylistId) {
        alert("Select a playlist first");
        return;
      }
      await api.addTrackToPlaylist(selectedPlaylistId, trackId);
      // Trigger playlist track reload by toggling selection
      setSelectedPlaylistId(null);
      setTimeout(() => setSelectedPlaylistId(selectedPlaylistId), 0);
    },
    [selectedPlaylistId]
  );

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: Player + Now Playing + Source */}
        <div className="space-y-4">
          <NowPlaying />
          <Player />
          <SourceSwitch />
        </div>

        {/* Center column: Library + Playlist */}
        <div className="lg:col-span-1 space-y-4">
          <Playlist
            selectedPlaylistId={selectedPlaylistId}
            onSelect={setSelectedPlaylistId}
          />
          <Library onAddToPlaylist={handleAddToPlaylist} />
        </div>

        {/* Right column: Chat */}
        <div>
          <Chat />
        </div>
      </div>
    </Layout>
  );
}
