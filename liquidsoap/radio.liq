#!/usr/bin/liquidsoap

settings.init.allow_root.set(true)
settings.server.telnet.set(true)
settings.server.telnet.bind_addr.set("0.0.0.0")
settings.server.telnet.port.set(1234)

# Playlist source — reads .m3u file, reloads every 10s
playlist_file = "/data/playlists/current.m3u"

radio_playlist = playlist(
  id="playlist",
  mode="normal",
  reload_mode="rounds",
  reload=1,
  playlist_file
)

# Silence fallback
silence = blank(id="silence")

# Live input via harbor (for browser mic)
live = input.harbor(
  id="live",
  port=8005,
  password="hackme",
  "/live"
)

# Use live when available, otherwise playlist, otherwise silence
radio = fallback(
  id="radio",
  track_sensitive=false,
  [live, radio_playlist, silence]
)

# Make the source infallible
radio = mksafe(radio)

# Output to Icecast
output.icecast(
  %mp3(bitrate=192),
  host="icecast",
  port=8000,
  password="hackme",
  mount="/stream",
  name="EPIRBE Radio",
  description="Web Radio",
  radio
)
