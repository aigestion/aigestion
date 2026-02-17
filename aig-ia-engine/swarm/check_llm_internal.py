import os
import sys
from pathlib import Path

# Setup paths to match mission context
engine_root = Path(__file__).resolve().parent.parent
if str(engine_root) not in sys.path:
    sys.path.insert(0, str(engine_root))

from services.llm import LLMService, ModelTier

def check_model():
    service = LLMService()
    print(f"Default Model (FAST): {service.default_model_name}")
    print(f"Pro Model (REASONING): {service.pro_model_name}")

    # Check if they are in models/ format
    print(f"Model keys in service: {list(service.models.keys())}")
    for tier, model in service.models.items():
        print(f"Tier {tier.name} -> {model.model_name}")

if __name__ == "__main__":
    check_model()
