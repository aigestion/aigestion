import os
import sys
from pathlib import Path

# Setup paths
engine_root = Path(__file__).resolve().parent.parent
if str(engine_root) not in sys.path:
    sys.path.insert(0, str(engine_root))

from core import SwarmOrchestrator, Message, AgentType
from models import MessageType
from agents.architect import Architect
from agents.builder import Builder
from agents.critic import Critic
from agents.mechanic import Mechanic
from utils import configure_swarm_logging


def run_mission():
    configure_swarm_logging()
    orchestrator = SwarmOrchestrator()

    # Instantiate all required agents for the pipeline
    architect = Architect(orchestrator)
    builder = Builder(orchestrator)
    critic = Critic(orchestrator)
    mechanic = Mechanic(orchestrator)

    # Register agents
    orchestrator.register_agent(architect)
    orchestrator.register_agent(builder)
    orchestrator.register_agent(critic)
    orchestrator.register_agent(mechanic)

    # MISSION: Refactor MemoryService
    mission_text = """
    TASK: Refactor 'swarm/services/memory.py'
    GOALS:
    1. Remove redundant genai.configure() (use LLMService patterns).
    2. Consolidate environment loading.
    3. Improve type hinting and error handling in _save_memory/_load_memory.
    4. Ensure it uses valid model names (models/embedding-001).
    """

    print("Dispatching mission to Architect...")
    msg = Message(
        sender=AgentType.NAVIGATOR,
        receiver=AgentType.ARCHITECT,
        content=mission_text,
        msg_type=MessageType.DESIGN_SOLUTION,
    )

    orchestrator.dispatch(msg)
    print("\nMission dispatch complete.")
    print(
        "The pipeline should now: Architect(Plan) -> Builder(Code) -> Critic(Review) -> Mechanic(Deploy)"
    )
    print("Verify output at: aig-ia-engine/swarm/REF_TARGET.py")


if __name__ == "__main__":
    run_mission()
