import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Load env from root
root_env = Path("C:/Users/Alejandro/AIGestion/.env")
load_dotenv(root_env)

api_key = os.getenv("GEMINI_API_KEY")
print(f"Testing Gemini Key: {api_key[:15]}...")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content("ping")
    print(f"SUCCESS: {response.text.strip()}")
except Exception as e:
    print(f"FAILED: {e}")
