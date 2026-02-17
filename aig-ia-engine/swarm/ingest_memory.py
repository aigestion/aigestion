import json
import logging
import os
import sys
from datetime import datetime

# Add the parent directory to sys.path to allow importing from services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.memory import MemoryService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("IngestSovereign")


def ingest_sovereign_memory():
    memory = MemoryService()

    # Path to the 257 core credentials snapshot
    snapshot_path = (
        "C:\\Users\\Alejandro\\AIGestion\\infra\\vault\\sovereign_snapshot.json"
    )

    if not os.path.exists(snapshot_path):
        logger.error(f"Snapshot not found at {snapshot_path}")
        return

    try:
        with open(snapshot_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        logger.info(f"Loaded snapshot with {len(data)} items.")

        timestamp = datetime.now().isoformat()

        count = 0
        for key, value in data.items():
            # Ingest each credential as a memory record
            text = f"CREDENTIAL: {key} = {value}"
            metadata = {
                "type": "sovereign_credential",
                "key": key,
                "timestamp": timestamp,
                "source": "sovereign_snapshot.json",
            }
            memory.remember(text, metadata)
            count += 1
            if count % 50 == 0:
                logger.info(f"Ingested {count} credentials...")

        logger.info(f"✨ SUCCESS: Ingested {count} core credentials into Swarm Memory.")

    except Exception as e:
        logger.error(f"Ingestion failed: {e}")


if __name__ == "__main__":
    ingest_sovereign_memory()
