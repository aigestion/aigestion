import json
import os
import time
from typing import Dict, Any


class TelemetryService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TelemetryService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.metrics_file = (
            "C:\\Users\\Alejandro\\AIGestion\\aig-ia-engine\\swarm\\agent_metrics.json"
        )
        self.metrics = self._load_metrics()

    def _load_metrics(self) -> Dict[str, Any]:
        if os.path.exists(self.metrics_file):
            try:
                with open(self.metrics_file, "r") as f:
                    return json.load(f)
            except Exception:
                return {
                    "missions": [],
                    "summary": {"total_tokens": 0, "total_cost": 0.0},
                }
        return {"missions": [], "summary": {"total_tokens": 0, "total_cost": 0.0}}

    def _save_metrics(self):
        with open(self.metrics_file, "w") as f:
            json.dump(self.metrics, f, indent=2)

    def log_inference(self, tier: str, latency: float, tokens: int):
        # Rough cost calculation (Gemini 2.0 Flash is very cheap, Pro is more)
        # Rates are illustrative
        rates = {
            "FAST": 0.10 / 1_000_000,  # $0.10 per million tokens
            "REASONING": 1.25 / 1_000_000,  # $1.25 per million tokens
        }

        cost = tokens * rates.get(tier, rates["FAST"])

        entry = {
            "tier": tier,
            "latency": round(latency, 2),
            "tokens": tokens,
            "cost": round(cost, 6),
            "timestamp": time.time(),
        }

        self.metrics["missions"].append(entry)
        self.metrics["summary"]["total_tokens"] += tokens
        self.metrics["summary"]["total_cost"] = round(
            self.metrics["summary"]["total_cost"] + cost, 6
        )

        # Keep only last 100 entries
        if len(self.metrics["missions"]) > 100:
            self.metrics["missions"].pop(0)

        self._save_metrics()
