from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.config import settings
from app.middleware import require_admin

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    token: str
    role: str


@router.post("/login", response_model=LoginResponse)
async def login(data: LoginRequest):
    """Validate admin password and return token."""
    if data.password == settings.admin_password:
        return LoginResponse(token=settings.admin_token, role="admin")
    raise HTTPException(status_code=401, detail="Invalid password")


@router.get("/verify")
async def verify(authorized: bool = Depends(require_admin)):
    """Verify that the current token is valid."""
    return {"status": "ok", "role": "admin"}
