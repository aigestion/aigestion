import os
import json
import time
import requests
import argparse
from pathlib import Path

# Configuration
API_URL = "https://api.meshy.ai/v1/text-to-3d" # Defaulting to latest accessible
POLL_INTERVAL = 10  # Seconds
MAX_RETRIES = 60    # 10 minutes total

class ForgeOrchestrator:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get("MESHY_API_KEY")
        if not self.api_key:
            # Fallback: check for a local key file
            key_file = Path("MESHY_KEY.txt")
            if key_file.exists():
                self.api_key = key_file.read_text().strip()
        
        if not self.api_key:
            print("❌ ERROR: MESHY_API_KEY not found in environment or MESHY_KEY.txt")
            exit(1)
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def trigger_generation(self, prompt, name):
        payload = {
            "mode": "preview", # Initial preview stage
            "prompt": prompt,
            "art_style": "realistic" # Setting a default
        }
        
        print(f"🚀 Triggering 3D Generation for: {name}...")
        response = requests.post(API_URL, headers=self.headers, json=payload)
        
        if response.status_code != 202:
            print(f"❌ API Error ({response.status_code}): {response.text}")
            return None
        
        data = response.json()
        task_id = data.get("result")
        print(f"✅ Generation started! Task ID: {task_id}")
        return task_id

    def poll_for_completion(self, task_id):
        print(f"⏳ Waiting for task {task_id} to complete...")
        for _ in range(MAX_RETRIES):
            response = requests.get(f"{API_URL}/{task_id}", headers=self.headers)
            if response.status_code != 200:
                print(f"⚠️ Polling error ({response.status_code}). Retrying...")
                time.sleep(POLL_INTERVAL)
                continue
            
            data = response.json()
            status = data.get("status")
            progress = data.get("progress", 0)
            
            print(f"   [Status: {status} | Progress: {progress}%]")
            
            if status == "SUCCEEDED":
                model_url = data.get("model_url") or data.get("result", {}).get("model_url")
                return model_url
            elif status == "FAILED":
                print(f"❌ Task FAILED: {data.get('task_error', 'Unknown error')}")
                return None
            
            time.sleep(POLL_INTERVAL)
        
        print("❌ Task TIMED OUT.")
        return None

    def finalize_integration(self, model_url, object_id):
        save_path = Path(f"packages/decentraland-parcel/models/{object_id}.glb")
        save_path.parent.mkdir(parents=True, exist_ok=True)
        
        print(f"📥 Downloading GLB model to: {save_path}...")
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
