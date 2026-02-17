import sys
import os
from pathlib import Path

# Setup paths
engine_root = Path(__file__).resolve().parent
swarm_path = str(engine_root / "swarm")
# Add swarm folder to path
if swarm_path not in sys.path:
    sys.path.insert(0, swarm_path)

from dotenv import load_dotenv

load_dotenv(engine_root / ".env")

from services.llm import LLMService, ModelTier


def test_service():
    key = os.getenv("GEMINI_API_KEY")
    print(
        f"DEBUG: GEMINI_API_KEY from env: {key[:10]}..."
        if key
        else "DEBUG: Key NOT found in env"
    )

    service = LLMService()
    print(f"DEBUG: Default model: {service.default_model_name}")
    print(f"DEBUG: Registered models: {list(service.models.keys())}")

    print("\nTesting FAST tier...")
    res = service.generate_text("ping", tier=ModelTier.FAST)
    print(f"FAST Result: {res}")

    print("\nTesting REASONING tier...")
    res = service.generate_text("hola, responde solo 'pong'", tier=ModelTier.REASONING)
    print(f"REASONING Result: {res}")


if __name__ == "__main__":
    test_service()
