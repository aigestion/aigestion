import json
import sys
import time

import requests

API_URL = "http://127.0.0.1:8000/agent/browse"

def test_api():
    print("Initiating Clowd-Safe API System Check...")
    print(f"Target: {API_URL}")

    payload = {
        "url": "https://example.com",
        "instruction": "Extract the main heading and the background color if mentioned. Format as JSON."
    }

    try:
        start_time = time.time()
        print("\nSending Secure Browser Request...")
        response = requests.post(API_URL, json=payload, timeout=30)
        duration = time.time() - start_time

        if response.status_code == 200:
            data = response.json()
            print(f"\nSUCCESS (Time: {duration:.2f}s)")
            print("="*40)
            print(f"URL: {data.get('url')}")
            print(f"Title: {data.get('title')}")
            print("-" * 20)
            print(f"Agent Summary:\n{data.get('summary')}")
            print("="*40)
            print("\nAPI is fully operational and ready for n8n integration.")
            return True
        else:
            print(f"\nFAILED. Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            return False

    except requests.exceptions.ConnectionError:
        print("\nCONNECTION ERROR")
        print("Could not connect to aig-ia-engine at localhost:8000.")
        print("Ensure the Docker service is running:")
        print("   docker-compose -f docker/docker-compose.yml up -d aig-ia-engine browser-service")
        return False
    except Exception as e:
        print(f"\nUNEXPECTED ERROR: {e}")
        return False

if __name__ == "__main__":
    success = test_api()
    if not success:
        sys.exit(1)
        sys.exit(1)
