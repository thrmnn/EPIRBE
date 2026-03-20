from fastapi import APIRouter

from app.models import SourceSwitch
from app.services.liquidsoap import skip_track

router = APIRouter(prefix="/api/stream", tags=["stream"])


@router.post("/skip")
async def skip():
    result = await skip_track()
    return {"status": "ok", "result": result}


@router.post("/source")
async def switch_source(data: SourceSwitch):
    # Source switching is handled by Liquidsoap's fallback mechanism.
    # When a live source connects to harbor, it automatically takes priority.
    # This endpoint is kept for UI state tracking.
    return {"status": "ok", "source": data.source}
