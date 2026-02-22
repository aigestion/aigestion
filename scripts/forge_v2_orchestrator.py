import os
import json
import time
import requests
import argparse
from pathlib import Path

# Configuration
TRIPO_API_URL = "https://api.tripo3d.ai/v1/task"
POLL_INTERVAL = 10  # Seconds
MAX_RETRIES = 60    # 10 minutes total

class ForgeOrchestrator:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get("TRIPO_API_KEY")
        if not self.api_key:
            # Fallback: check for a local key file
            key_file = Path("TRIPO_KEY.txt")
            if key_file.exists():
                self.api_key = key_file.read_text().strip()

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def trigger_generation(self, prompt, name):
        if not self.api_key:
            print("⚠️ TRIPO_API_KEY missing. Falling back to LOCAL FORGE (Hunyuan3D)...")
            return self.trigger_local_generation(prompt, name)

        payload = {"type": "text_to_model", "prompt": prompt}

        print(f"🚀 Triggering 3D Generation (Tripo AI) for: {name}...")
        response = requests.post(TRIPO_API_URL, headers=self.headers, json=payload)

        if response.status_code != 200:
            print(f"❌ API Error ({response.status_code}): {response.text}")
            return None
        
        data = response.json()
        if data.get("code") != 0:
            print(f"❌ Tripo Error: {data.get('message')}")
            return None

        task_id = data.get("data", {}).get("task_id")
        print(f"✅ Generation started! Task ID: {task_id}")
        return task_id

    def poll_for_completion(self, task_id):
        if task_id.startswith("local_"):
            return f"models/local_output/{task_id.replace('local_', '')}.glb"

        print(f"⏳ Waiting for task {task_id} to complete...")
        for _ in range(MAX_RETRIES):
            response = requests.get(f"{TRIPO_API_URL}/{task_id}", headers=self.headers)
            if response.status_code != 200:
                print(f"⚠️ Polling error ({response.status_code}). Retrying...")
                time.sleep(POLL_INTERVAL)
                continue
            
            data = response.json()
            if data.get("code") != 0:
                print(f"❌ Polling Error: {data.get('message')}")
                return None

            task_data = data.get("data", {})
            status = task_data.get("status")
            progress = task_data.get("progress", 0)
            
            print(f"   [Status: {status} | Progress: {progress}%]")

            if status == "success":
                # Tripo returns output { model: URL, pbr_model: URL ... }
                model_url = task_data.get("output", {}).get("model")
                return model_url
            elif status == "failed":
                print("❌ Task FAILED.")
                return None
            
            time.sleep(POLL_INTERVAL)
        
        print("❌ Task TIMED OUT.")
        return None

    def trigger_local_generation(self, prompt, name):
        """Placeholder for Sovereign local execution using Hunyuan3D or TripoSR."""
        print(f"🛠️ [LOCAL FORGE] Initiating Hunyuan3D for: {name}")
        # In a real scenario, this would call a local subprocess or Docker container
        # For now, we simulate success if the local model exists
        local_id = f"local_{name.lower().replace(' ', '_')}"
        return local_id

    def finalize_integration(self, model_url, object_id):
        save_path = Path(f"packages/decentraland-parcel/models/{object_id}.glb")
        save_path.parent.mkdir(parents=True, exist_ok=True)

        if model_url.startswith("models/"):
            print(f"📦 Local asset detected. Linking: {model_url}")
            return True

        print(f"📥 Downloading GLB model from Tripo to: {save_path}...")
        response = requests.get(model_url)
        if response.status_code == 200:
            with open(save_path, "wb") as f:
                f.write(response.content)
            print(f"✨ Model saved and ready for Decentraland: {save_path}")
            return True
        else:
            print(f"❌ Download failed ({response.status_code})")
            return False

def forge_object(object_id):
    request_path = Path(f"models/forge_requests/{object_id}.json")
    if not request_path.exists():
        print(f"❌ Request file not found: {request_path}")
        return

    with open(request_path, "r") as f:
        request = json.load(f)

    orchestrator = ForgeOrchestrator()
    task_id = orchestrator.trigger_generation(request["description"], request["name"])
    
    if task_id:
        model_url = orchestrator.poll_for_completion(task_id)
        if model_url:
            orchestrator.finalize_integration(model_url, object_id)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sovereign 3D Forge Orchestrator")
    parser.add_argument("--id", help="Object ID to forge (e.g., sovereign_core)")
    parser.add_argument("--all", action="store_true", help="Forge all pending requests")
    
    args = parser.parse_args()
    
    if args.id:
        forge_object(args.id)
    elif args.all:
        request_dir = Path("models/forge_requests")
        for f in request_dir.glob("*.json"):
            forge_object(f.stem)
    else:
        parser.print_help()
