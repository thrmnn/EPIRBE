import asyncio
from app.config import settings


async def telnet_command(cmd: str, timeout: float = 5.0) -> str:
    """Send a command to Liquidsoap's telnet interface and return the response."""
    try:
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(
                settings.liquidsoap_telnet_host,
                settings.liquidsoap_telnet_port,
            ),
            timeout=timeout,
        )

        writer.write((cmd + "\n").encode())
        await writer.drain()

        # Read until "END" marker or timeout
        response_lines = []
        while True:
            try:
                line = await asyncio.wait_for(reader.readline(), timeout=2.0)
                decoded = line.decode().strip()
                if decoded == "END":
                    break
                response_lines.append(decoded)
            except asyncio.TimeoutError:
                break

        writer.close()
        await writer.wait_closed()
        return "\n".join(response_lines)

    except (ConnectionRefusedError, OSError, asyncio.TimeoutError):
        return "ERROR: Cannot connect to Liquidsoap"


async def skip_track() -> str:
    return await telnet_command("playlist.skip")


async def get_metadata() -> dict:
    """Get currently playing metadata from Liquidsoap."""
    raw = await telnet_command("request.metadata 0")
    meta = {}
    for line in raw.split("\n"):
        if "=" in line:
            key, _, value = line.partition("=")
            meta[key.strip()] = value.strip().strip('"')
    return meta
