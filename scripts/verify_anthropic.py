import os
from dotenv import load_dotenv
from pathlib import Path
import requests

# Load env from root
root_env = Path("C:/Users/Alejandro/AIGestion/.env")
load_dotenv(root_env)

api_key = os.getenv("ANTHROPIC_API_KEY")
print(f"Testing Anthropic Key: {api_key[:10]}...")

try:
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        },
        json={
            "model": "claude-3-haiku-20240307",
            "max_tokens": 10,
            "messages": [{"role": "user", "content": "ping"}]
        }
    )
    if response.status_code == 200:
        print(f"SUCCESS: {response.json()['content'][0]['text']}")
    else:
        print(f"FAILED: {response.status_code} - {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
