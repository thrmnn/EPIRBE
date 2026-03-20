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
  password=environment.get(default="hackme", "ICECAST_SOURCE_PASSWORD"),
  "/live"
)

# Use live when available, otherwise playlist, otherwise silence.
# replay_metadata=true ensures metadata is re-sent when switching sources,
# preventing mksafe/blank from swallowing track titles.
radio = fallback(
  id="radio",
  track_sensitive=false,
  replay_metadata=true,
  [live, radio_playlist, silence]
)

# Make the source infallible — mksafe adds a blank() fallback that drops
# metadata.  Instead we already have silence in our fallback above, so we
# only need mksafe as a final safety net.  Re-inject metadata afterwards.
radio = mksafe(radio)

# Log metadata changes so we can debug now-playing issues
def on_meta(m)
  log("Now playing: #{m['artist']} - #{m['title']}")
end
radio.on_metadata(on_meta)

# Output to Icecast
output.icecast(
  %mp3(bitrate=192),
  host="icecast",
  port=8000,
  password=environment.get(default="hackme", "ICECAST_SOURCE_PASSWORD"),
  mount="/stream",
  name="EPIRBE Radio",
  description="Web Radio",
  encoding="UTF-8",
  radio
)
