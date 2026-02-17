import sys
import os
import time
from unittest.mock import MagicMock

# Add swarm directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
engine_root = os.path.dirname(current_dir)
swarm_root = os.path.join(engine_root, 'swarm')
sys.path.append(swarm_root)

# Mock services
sys.modules['services'] = MagicMock()
sys.modules['services.llm'] = MagicMock()
sys.modules['services.llm.LLMService'] = MagicMock()
sys.modules['services.memory'] = MagicMock()
sys.modules['services.rag_v2'] = MagicMock()

from core import SwarmOrchestrator, AgentType, Message, MessageType
from agents.architect import Architect
from agents.builder import Builder

def test_coder_swarm():
    print("Testing Autonomous Coding Swarm...")

    orchestrator = SwarmOrchestrator()

    # Init Architect
    architect = Architect(orchestrator)
    architect.llm = MagicMock()
    architect.llm.generate_solution.return_value = "# Plan\n1. Print Hello World."

    # Init Builder
    builder = Builder(orchestrator)
    builder.llm = MagicMock()
    builder.llm.generate_text.return_value = "print('Hello World from Swarm')"

    orchestrator.register_agent(architect)
    orchestrator.register_agent(builder)

    # Trigger Architect
    msg = Message(
        sender=AgentType.OVERLORD,
        receiver=AgentType.ARCHITECT,
        content="Create a hello world python script",
        msg_type=MessageType.REVIEW_CODE # Architect logic triggers on REVIEW_CODE currently as entry point for tasks based on code provided
    )

    print("Dispatching Task to Architect...")
    orchestrator.dispatch(msg)

    time.sleep(2) # Wait for event loop

    # Verify File Creation
    target_file = os.path.join(swarm_root, "REF_TARGET.py")
    if os.path.exists(target_file):
        print(f"✅ SUCCESS: File created at {target_file}")
        with open(target_file, 'r') as f:
            print(f"Content: {f.read().strip()}")
        # Cleanup
        os.remove(target_file)
    else:
        print(f"❌ FAILED: File {target_file} not found.")

if __name__ == "__main__":
    test_coder_swarm()
