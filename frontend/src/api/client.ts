import { config } from "../config";

const API_BASE = config.apiBase;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("epirbe_admin_token");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(),
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (password: string) => request<{ token: string; role: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  }),
  verify: (token: string) => request<{ status: string; role: string }>("/auth/verify", {
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
  }),

  // Library
  scanLibrary: () => request<{ status: string; tracks_found: number }>("/library/scan", { method: "POST" }),
  getTracks: (search?: string) => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    return request<Track[]>(`/library/tracks${q}`);
  },

  // Playlists
  getPlaylists: () => request<Playlist[]>("/playlists/"),
  createPlaylist: (name: string) => request<Playlist>("/playlists/", { method: "POST", body: JSON.stringify({ name }) }),
  deletePlaylist: (id: number) => request<void>(`/playlists/${id}`, { method: "DELETE" }),
  getPlaylistTracks: (id: number) => request<Track[]>(`/playlists/${id}/tracks`),
  addTrackToPlaylist: (playlistId: number, trackId: number) =>
    request<void>(`/playlists/${playlistId}/tracks`, { method: "POST", body: JSON.stringify({ track_id: trackId }) }),
  removeTrackFromPlaylist: (playlistId: number, trackId: number) =>
    request<void>(`/playlists/${playlistId}/tracks/${trackId}`, { method: "DELETE" }),
  activatePlaylist: (id: number) => request<void>(`/playlists/${id}/activate`, { method: "POST" }),

  // Stream
  skip: () => request<void>("/stream/skip", { method: "POST" }),
};

export interface Track {
  id: number;
  path: string;
  title: string | null;
  artist: string | null;
  album: string | null;
  duration: number | null;
  filename: string;
}

export interface Playlist {
  id: number;
  name: string;
  is_active: boolean;
  track_count: number;
}
