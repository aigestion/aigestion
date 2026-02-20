import os
import google.generativeai as genai
from dotenv import load_dotenv

def test_keys():
    load_dotenv()
    keys = [
        os.getenv("GEMINI_API_KEY"),
        os.getenv("GEMINI_LEGACY_API_KEY"),
        os.getenv("GOOGLE_AI_EVAL_KEY"),
        os.getenv("GOOGLE_MAPS_API_KEY")
    ]
    
    print(f"Testing {len(keys)} potential keys...")
    for i, key in enumerate(keys):
        if not key or key.startswith("CONFIGURE") or "REPLACE" in key:
            continue
        
        print(f"--- Key {i}: {key[:10]}... ---")
        try:
            genai.configure(api_key=key)
            # Try a simple text generation instead of embedding to see if it's a service issue
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content("Hola, ¿eres Daniela?")
            print(f"Success! Response: {response.text[:50]}...")
            print(f"VALID_KEY_FOUND: {key}")
            return
        except Exception as e:
            print(f"Failed: {e}")

if __name__ == "__main__":
    test_keys()
