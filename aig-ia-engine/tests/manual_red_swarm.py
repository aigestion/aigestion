import sys
import os
import time
from unittest.mock import MagicMock

# Add swarm directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
engine_root = os.path.dirname(current_dir)
swarm_root = os.path.join(engine_root, 'swarm')
sys.path.append(swarm_root)

# Mock services before importing agents
sys.modules['services'] = MagicMock()
sys.modules['services.llm'] = MagicMock()
sys.modules['services.llm.LLMService'] = MagicMock()

from core import SwarmOrchestrator, AgentType, Message
from agents.red_swarm import RedSwarmAgent

def test_red_swarm_scan():
    print("Testing Red Swarm Network Scan...")

    # Setup Orchestrator
    orchestrator = SwarmOrchestrator()

    # Setup Agent with mocked LLM
    agent = RedSwarmAgent(orchestrator)

    # Mock the LLM on the agent instance specifically
    agent.llm = MagicMock()
    agent.llm.generate_text.return_value = "Mock Analysis: Ports 5000 and 8000 are expected for backend and swarm."

    orchestrator.register_agent(agent)

    # Create Scan Message
    scan_msg = Message(
        sender=AgentType.OVERLORD,
        receiver=AgentType.CRITIC, # RedSwarm is initialized as CRITIC type in current code
        content={
            "target": "127.0.0.1",
            "ports": [5000, 8000, 9999] # 5000/8000 should be open, 9999 closed
        },
        msg_type="START_SCAN"
    )

    # Dispatch
    print("Dispatching START_SCAN...")
    orchestrator.dispatch(scan_msg)

    time.sleep(2) # Wait for thread pool

    # Check logs
    logs = agent.get_audit_log()
    print(f"Audit Log Count: {len(logs)}")
    if len(logs) > 0:
        entry = logs[-1]
        print("Latest Entry:")
        print(f"Target: {entry.get('target')}")
        print(f"Open Ports: {entry.get('open_ports')}")
        print(f"Analysis: {entry.get('analysis')}")

        # Validation
        open_ports = entry.get('open_ports', [])
        if 5000 in open_ports and 8000 in open_ports:
             print("✅ SUCCESS: Detected expected open ports.")
        else:
             print(f"⚠️ PARTIAL: Detected {open_ports}. Ensure backend and swarm are running.")
    else:
        print("❌ FAILED: No log entry found.")

if __name__ == "__main__":
    test_red_swarm_scan()
