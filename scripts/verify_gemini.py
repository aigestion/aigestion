import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Load env from root
root_env = Path("C:/Users/Alejandro/AIGestion/.env")
load_dotenv(root_env)

# Hardcoded candidate keys found in codebase
keys = [
    os.getenv("GEMINI_API_KEY"),
    "AIzaSyBpVnT9h05o96lhDTOAEQtWKZfGJHRrTZ4",
    "AIzaSyCim3MiOaI2Szx3IxqrWNX8igZ5XKMD06Q",
    "AIzaSyC4r_moHyNm8gfSmyqR1CAUesgZUZwMZ78",
    "AIzaSyAAxAjBY1pH0dBYNFjdfMDygJVwi6KezVo",
]

for api_key in keys:
    if not api_key:
        continue
    print(f"\n--- Testing Key: {api_key[:15]}... ---")
    try:
        genai.configure(api_key=api_key)
        # Try both common models
        for model_id in ["gemini-1.5-flash", "gemini-2.0-flash"]:
            try:
                model = genai.GenerativeModel(model_id)
                response = model.generate_content("ping")
                print(f"SUCCESS ({model_id}): {response.text.strip()}")
                break
            except Exception as e_inner:
                print(f"FAILED ({model_id}): {str(e_inner)[:50]}")
    except Exception as e:
        print(f"FAILED (Config): {str(e)[:50]}")
