import os
from dotenv import load_dotenv
from pathlib import Path
import requests

# Load env from root
root_env = Path("C:/Users/Alejandro/AIGestion/.env")
load_dotenv(root_env)

api_key = os.getenv("OPENAI_API_KEY")
print(f"Testing OpenAI Key: {api_key[:10]}...")

try:
    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {api_key}"},
        json={
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": "ping"}]
        }
    )
    if response.status_code == 200:
        print(f"SUCCESS: {response.json()['choices'][0]['message']['content']}")
    else:
        print(f"FAILED: {response.status_code} - {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
