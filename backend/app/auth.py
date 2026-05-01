from fastapi import Header, HTTPException
from app.config import settings


async def verify_internal_key(x_internal_key: str = Header(...)):
    if x_internal_key != settings.internal_api_key:
        raise HTTPException(401, "Unauthorized")
