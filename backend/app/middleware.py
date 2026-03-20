from fastapi import Depends, HTTPException, Header
from app.config import settings


async def require_admin(authorization: str = Header(None)):
    """Dependency that validates admin token from Authorization header."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    # Expect "Bearer <token>"
    parts = authorization.split(" ", 1)
    if len(parts) != 2 or parts[0] != "Bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization format")
    if parts[1] != settings.admin_token:
        raise HTTPException(status_code=403, detail="Invalid admin token")
    return True
