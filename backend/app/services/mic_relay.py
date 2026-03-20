import asyncio
import logging
import urllib.parse

from app.config import settings

logger = logging.getLogger(__name__)


class MicRelay:
    """Manages an ffmpeg subprocess that relays raw PCM audio to Liquidsoap's harbor."""

    def __init__(self) -> None:
        self._process: asyncio.subprocess.Process | None = None
        self._lock = asyncio.Lock()

    @property
    def is_active(self) -> bool:
        return self._process is not None and self._process.returncode is None

    async def start(self) -> bool:
        """Spawn the ffmpeg process. Returns True on success, False if already active or on error."""
        async with self._lock:
            if self.is_active:
                logger.warning("MicRelay already active, refusing to start another")
                return False

            try:
                self._process = await asyncio.create_subprocess_exec(
                    "ffmpeg",
                    "-f", "f32le",
                    "-ar", "44100",
                    "-ac", "1",
                    "-i", "pipe:0",
                    "-f", "mp3",
                    "-b:a", "192k",
                    "-content_type", "audio/mpeg",
                    f"icecast://source:{urllib.parse.quote(settings.icecast_source_password, safe='')}@liquidsoap:8005/live",
                    stdin=asyncio.subprocess.PIPE,
                    stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.PIPE,
                )
                logger.info("ffmpeg mic relay started (pid %s)", self._process.pid)
                return True
            except Exception:
                logger.exception("Failed to spawn ffmpeg")
                self._process = None
                return False

    async def feed(self, data: bytes) -> None:
        """Write raw PCM bytes to ffmpeg's stdin."""
        if not self.is_active or self._process.stdin is None:
            return

        try:
            self._process.stdin.write(data)
            await self._process.stdin.drain()
        except (BrokenPipeError, ConnectionResetError):
            logger.warning("ffmpeg stdin pipe broken, stopping relay")
            await self.stop()

    async def stop(self) -> None:
        """Terminate the ffmpeg process and clean up."""
        async with self._lock:
            if self._process is None:
                return

            proc = self._process
            self._process = None

            # Close stdin first so ffmpeg can finish writing
            if proc.stdin and not proc.stdin.is_closing():
                try:
                    proc.stdin.close()
                except Exception:
                    pass

            if proc.returncode is None:
                try:
                    proc.terminate()
                    # Give it a moment to exit gracefully
                    await asyncio.wait_for(proc.wait(), timeout=3.0)
                except asyncio.TimeoutError:
                    logger.warning("ffmpeg did not terminate, killing")
                    proc.kill()
                    await proc.wait()
                except Exception:
                    logger.exception("Error stopping ffmpeg")

            logger.info("ffmpeg mic relay stopped")


# Singleton instance
mic_relay = MicRelay()
