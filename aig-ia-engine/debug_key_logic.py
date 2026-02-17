import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")
print(f"Key from env: '{key}'")
if key:
    print(f"Key length: {len(key)}")
    print(f"Key first 5: {key[:5]}")
    print(f"Key last 5: {key[-5:]}")

    genai.configure(api_key=key.strip())
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content('ping')
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("No key found")
