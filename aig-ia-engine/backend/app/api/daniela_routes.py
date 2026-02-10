"""
Daniela Enhanced API Routes
"""

from typing import Dict, Any

from app.services.daniela_clowd_safe import daniela_enhanced
from fastapi import APIRouter, HTTPException

from pydantic import BaseModel

router = APIRouter(prefix="/daniela", tags=["daniela"])


class BrowseRequest(BaseModel):
    url: str
    instruction: str


class CompetitorRequest(BaseModel):
    competitor_url: str


class MarketResearchRequest(BaseModel):
    topic: str


@router.post("/browse")
async def daniela_browse(request: BrowseRequest) -> Dict[str, Any]:
    """
    Daniela's enhanced browsing capability.
    
    Args:
        url: Website to analyze
        instruction: What Daniela should look for
        
    Returns:
        Enhanced analysis with Daniela's personality
    """
    try:
        result = await daniela_enhanced.browse_and_analyze(
            request.url, request.instruction
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/competitor-analysis")
async def competitor_analysis(request: CompetitorRequest) -> Dict[str, Any]:
    """
    Daniela analyzes competitors for business intelligence.
    """
    try:
        result = await daniela_enhanced.competitive_analysis(request.competitor_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/market-research")
async def market_research(request: MarketResearchRequest) -> Dict[str, Any]:
    """
    Daniela conducts market research.
    """
    try:
        result = await daniela_enhanced.market_research(request.topic)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def daniela_status() -> Dict[str, Any]:
    """Get Daniela's current enhanced status."""
    return {
        "status": "enhanced",
        "agent": "Daniela Enhanced v2.0",
        "capabilities": [
            "Secure Web Browsing",
            "Competitive Analysis", 
            "Market Research",
            "Business Intelligence",
            "Clowd-Safe Integration"
        ],
        "power_level": "MAXIMUM",
        "message": "Daniela is ready with enhanced Clowd-Safe powers! 🌟"
    }
