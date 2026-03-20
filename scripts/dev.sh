#!/bin/bash
set -euo pipefail

echo "=== EPIRBE Radio - Dev Startup ==="

# Copy .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

# Ensure playlist directory has a default m3u
mkdir -p /tmp/epirbe-playlists

# Build and start
docker compose up --build "$@"
