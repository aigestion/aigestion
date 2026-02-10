from fastapi import Header, HTTPException, Depends
from app.config import get_settings
from typing import Optional

settings = get_settings()

async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """
    Verify that the X-API-Key header matches the configured IA_ENGINE_API_KEY.
    """
    if not settings.IA_ENGINE_API_KEY:
        # If no key is configured in dev, we might allow it (optional)
        # But for God Mode we enforce it if present
        return x_api_key
        
    if x_api_key != settings.IA_ENGINE_API_KEY:
        raise HTTPException(
            status_code=403, 
            detail="Invalid or missing IA Engine API Key"
        )
    return x_api_key
