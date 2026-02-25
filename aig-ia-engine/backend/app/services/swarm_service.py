import os
import sys
import threading
from typing import Any, Dict, Optional

# Add swarm directory to sys.path
# Try repo structure first, then docker structure
PARENT_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
SWARM_PATH = os.path.join(PARENT_DIR, "swarm")

if not os.path.exists(SWARM_PATH):
    # Fallback for Docker layout where swarm might be at /app/swarm
    SWARM_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../swarm"))

if SWARM_PATH not in sys.path:
    sys.path.append(SWARM_PATH)

try:
    from core import SwarmOrchestrator, AgentType, Message, BaseAgent
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
import asyncio


class MissionControlAgent(BaseAgent):
    """Bridge agent that dispatches sub-missions back to the SwarmService."""

    def __init__(self, orchestrator, trigger_callback):
        super().__init__("MissionControl", AgentType.MISSION_CONTROL, orchestrator)
        self.trigger_callback = trigger_callback

    def process_message(self, message: Message):
        if message.msg_type == MessageType.SUB_MISSION_TRIGGER:
            self.log("sub_mission_trigger_received", content=message.content)
            description = message.content.get("description")
            metadata = message.content.get("metadata", {})
            # Trigger callback (which handles async bridging)
            self.trigger_callback(description, metadata)


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

        # Mission Control (Recursive Bridge)
        mission_control = MissionControlAgent(
            self.orchestrator, self._handle_sub_mission
        )
        self.orchestrator.register_agent(mission_control)

    async def trigger_mission(self, mission_description: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if not SWARM_AVAILABLE:
            return {"success": False, "message": "Swarm engine not available"}

        # Extract parent_job_id if provided
        parent_job_id = metadata.get("parent_job_id") if metadata else None

        # Register with Job Service for tracking
        job = job_service.create_job(
            job_type=JobType.BATCH_INFERENCE,  # Or better, create a SWARM type in JobType if possible
            metadata={"mission": mission_description, **(metadata or {})},
            parent_job_id=parent_job_id,
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

    def _handle_sub_mission(self, description: str, metadata: Dict[str, Any]):
        """Bridges sync agent trigger to async service trigger."""
        try:
            # We must use the current event loop
            try:
                loop = asyncio.get_running_loop()
            except RuntimeError:
                loop = asyncio.get_event_loop()

            print(f"Propagating sub-mission: {description}")
            asyncio.run_coroutine_threadsafe(
                self.trigger_mission(description, metadata), loop
            )
        except Exception as e:
            print(f"Failed to propagate sub-mission: {e}")


swarm_service = SwarmService()
