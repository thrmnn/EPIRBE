from pydantic import BaseModel


class Track(BaseModel):
    id: int | None = None
    path: str
    title: str | None = None
    artist: str | None = None
    album: str | None = None
    duration: float | None = None
    filename: str


class PlaylistCreate(BaseModel):
    name: str


class PlaylistOut(BaseModel):
    id: int
    name: str
    is_active: bool
    track_count: int = 0


class PlaylistTrackAdd(BaseModel):
    track_id: int


class ChatMessage(BaseModel):
    username: str
    message: str
    timestamp: str | None = None


class StreamStatus(BaseModel):
    title: str | None = None
    artist: str | None = None
    listeners: int = 0
    source: str = "playlist"


class SourceSwitch(BaseModel):
    source: str  # "playlist" or "live"
