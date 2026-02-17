import sys
import os
from pathlib import Path

# Add 'swarm' folder to sys.path so 'import core' works as in agents
engine_root = Path(__file__).resolve().parents[1]
swarm_path = str(engine_root / "swarm")
if swarm_path not in sys.path:
    sys.path.insert(0, swarm_path)

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

# Import from 'core' directly to avoid duplicate module loading (Enum identity issue)
from core import SwarmOrchestrator, AgentType, Message
from agents.architect import Architect
from agents.builder import Builder
from models import MessageType


def test_handshake():
    print("Testing Swarm Agent Handshake...")
    orchestrator = SwarmOrchestrator()

    # Register agents
    architect = Architect(orchestrator)
    builder = Builder(orchestrator)

    orchestrator.register_agent(architect)
    orchestrator.register_agent(builder)

    print(f"Registered AgentTypes: {list(orchestrator.agents.keys())}")

    # Simulate an issue message to Architect
    test_issue = {
        "description": "Fix a simple typo in a comment",
        "file": "non_existent.py",
    }

    print("\nSending REVIEW_CODE message to Architect...")
    msg = Message(
        AgentType.OVERLORD, AgentType.ARCHITECT, test_issue, MessageType.REVIEW_CODE
    )
    print(f"Target Receiver: {msg.receiver} (Type: {type(msg.receiver)})")

    orchestrator.dispatch(msg)

    print(
        "\nHandshake test initiated. Check logs for activity between Architect and Builder."
    )


if __name__ == "__main__":
    test_handshake()
