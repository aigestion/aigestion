import os
import sys
import threading
from typing import Any, Dict, Optional

# Add swarm directory to sys.path
SWARM_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../swarm"))
if SWARM_PATH not in sys.path:
    sys.path.append(SWARM_PATH)

try:
    from core import SwarmOrchestrator, AgentType, Message
    from agents.overlord import Overlord
    from agents.detective import Detective
    from agents.architect import Architect
    from agents.builder import Builder
    from agents.critic import Critic
    from agents.mechanic import Mechanic
    from models import MessageType
    SWARM_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Swarm engine not available: {e}")
    SWARM_AVAILABLE = False

from app.services.job_service import job_service, JobType, JobStatus


class SwarmService:
    def __init__(self):
        self.orchestrator = None
        self.overlord = None
        self._init_swarm()

    def _init_swarm(self):
        if not SWARM_AVAILABLE:
            return

        print("Initializing AIGestion Swarm Bridge...")
        self.orchestrator = SwarmOrchestrator()

        # Instantiate Agents
        self.overlord = Overlord(self.orchestrator)
        detective = Detective(self.orchestrator)
        architect = Architect(self.orchestrator)
        builder = Builder(self.orchestrator)
        critic = Critic(self.orchestrator)
        mechanic = Mechanic(self.orchestrator)

        # Register Agents
        self.orchestrator.register_agent(self.overlord)
        self.orchestrator.register_agent(detective)
        self.orchestrator.register_agent(architect)
        self.orchestrator.register_agent(builder)
        self.orchestrator.register_agent(critic)
        self.orchestrator.register_agent(mechanic)

    async def trigger_mission(self, mission_description: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if not SWARM_AVAILABLE:
            return {"success": False, "message": "Swarm engine not available"}

        # Register with Jab Service for tracking
        job = job_service.create_job(
            job_type=JobType.BATCH_INFERENCE,  # Or better, create a SWARM type in JobType if possible
            metadata={"mission": mission_description, **(metadata or {})},
        )
        job_id = job.job_id

        # Run mission in a background thread to avoid blocking FastAPI
        def run_mission():
            try:
                job_service.start_job(job_id)
                print(f"Swarm mission started: {mission_description} (Job: {job_id})")

                # The Overlord start_mission sends a message to Detective
                self.overlord.send_message(
                    AgentType.DETECTIVE, mission_description, MessageType.TASK_START
                )

                # For now, mark as completed since the agents are async
                # In a real loop, we would wait for Overlord signal
                job_service.complete_job(job_id, result={"status": "dispatched"})
            except Exception as e:
                job_service.fail_job(job_id, error=str(e))

        thread = threading.Thread(target=run_mission)
        thread.start()

        return {
            "success": True,
            "message": "Mission dispatched to Overlord",
            "job_id": job_id,
        }

swarm_service = SwarmService()
