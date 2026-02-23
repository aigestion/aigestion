"""
Swarm Mission Orchestration API Routes
"""

from typing import Dict, Any
from app.services.swarm_service import swarm_service
from app.models.schemas import (
    SwarmTriggerRequest,
    SwarmTriggerResponse,
    VisionRequest,
    VisionResponse,
)
from fastapi import APIRouter, HTTPException
from app.services.agent_service import agent_service

router = APIRouter(prefix="/swarm", tags=["swarm"])


@router.post("/trigger", response_model=SwarmTriggerResponse)
async def trigger_swarm_mission(request: SwarmTriggerRequest) -> Dict[str, Any]:
    """
    Trigger an autonomous Swarm mission.
    """
    try:
        result = await swarm_service.trigger_mission(
            request.mission_description, request.metadata
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/vision", response_model=VisionResponse)
async def analyze_vision(request: VisionRequest) -> VisionResponse:
    """
    Analyze an image or screenshot using visual perception.
    """
    try:
        result = await agent_service.vision(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def get_swarm_status() -> Dict[str, Any]:
    """
    Get the current status of the Swarm Engine.
    """
    return {
        "status": "online" if swarm_service.orchestrator else "initializing",
        "service": "AIGestion Swarm Engine",
        "orchestrator_available": swarm_service.orchestrator is not None,
        "agents_registered": list(swarm_service.orchestrator.agents.keys())
        if swarm_service.orchestrator
        else [],
    }
