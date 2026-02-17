import sys
import os
from pathlib import Path

# Setup paths
engine_root = Path(__file__).resolve().parent
swarm_path = str(engine_root / "swarm")
if swarm_path not in sys.path:
    sys.path.insert(0, swarm_path)

from dotenv import load_dotenv
load_dotenv(engine_root / ".env", override=True)

import google.generativeai as genai
from services.llm import LLMService, ModelTier

def deep_trace():
    print("--- ENVIRONMENT TRACE ---")
    key = os.getenv("GEMINI_API_KEY")
    print(f"GEMINI_API_KEY: '{key[:5]}...{key[-5:]}' (Len: {len(key) if key else 0})")
    print(f"GOOGLE_API_KEY: {os.getenv('GOOGLE_API_KEY')}")
    print(f"GOOGLE_APPLICATION_CREDENTIALS: {os.getenv('GOOGLE_APPLICATION_CREDENTIALS')}")

    print("\n--- SERVICE INITIALIZATION ---")
    # Reset singleton if possible (for testing)
    LLMService._instance = None
    service = LLMService()

    print(f"Initialized models: {list(service.models.keys())}")
    for tier, model in service.models.items():
        print(f"Tier {tier.name} -> Model: {model.model_name}")

    print("\n--- EXECUTION TEST ---")
    try:
        # Try direct call with configured SDK
        print("Testing direct genai.GenerativeModel('gemini-2.5-flash')...")
        m = genai.GenerativeModel('gemini-2.5-flash')
        r = m.generate_content('ping')
        print(f"Direct Call Success: {r.text}")
    except Exception as e:
        print(f"Direct Call Failure: {e}")

    try:
        print("\nTesting service.generate_text()...")
        r = service.generate_text("ping", tier=ModelTier.FAST)
        print(f"Service Call Result: {r}")
    except Exception as e:
        print(f"Service Call Failure: {e}")

if __name__ == "__main__":
    deep_trace()
