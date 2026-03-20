import httpx
from app.config import settings


async def get_icecast_status() -> dict:
    """Poll Icecast status-json.xsl for stream info."""
    url = f"http://{settings.icecast_host}:{settings.icecast_port}/status-json.xsl"
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()

        icestats = data.get("icestats", {})
        source = icestats.get("source")

        # source can be a dict (single mount) or list (multiple mounts)
        if isinstance(source, list):
            # Find our /stream mount
            source = next((s for s in source if s.get("listenurl", "").endswith("/stream")), source[0] if source else {})
        elif source is None:
            source = {}

        return {
            "title": source.get("title") or source.get("yp_currently_playing"),
            "listeners": source.get("listeners", 0),
            "server_name": source.get("server_name", "EPIRBE Radio"),
        }
    except Exception:
        return {"title": None, "listeners": 0, "server_name": "EPIRBE Radio"}
