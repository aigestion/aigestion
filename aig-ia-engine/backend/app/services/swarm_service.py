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

        # Run mission in a background thread to avoid blocking FastAPI
        # In a production scenario, this would use a task queue like Celery or BullMQ
        def run_mission():
            print(f"Swarm mission started: {mission_description}")
            # The Overlord start_mission sends a message to Detective
            self.overlord.send_message(
                AgentType.DETECTIVE,
                mission_description,
                MessageType.TASK_START
            )

        thread = threading.Thread(target=run_mission)
        thread.start()

        return {
            "success": True,
            "message": "Mission dispatched to Overlord",
            "job_id": "swarm_" + os.urandom(4).hex()
        }

swarm_service = SwarmService()
