"""
Simplified API Routes for AIGestion IA Engine - Clowd-Safe Browser Service.
"""

from typing import Dict, Any

from app.models.schemas import BrowserRequest, BrowserResponse
from app.services.agent_service_simple import agent_service
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/agent", tags=["agent"])

@router.post("/browse", response_model=BrowserResponse)
async def browse_website(request: BrowserRequest) -> BrowserResponse:
    """
    Secure browser endpoint that takes a URL and instruction,
    then returns the browser agent's response.
    """
    try:
        result = await agent_service.browse(request.url, request.instruction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_status() -> Dict[str, Any]:
    """Get the current status of the browser service."""
    return {
        "status": "ready",
        "service": "clowd-safe-browser",
        "version": "1.0.0"
    }
