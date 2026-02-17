import google.generativeai as genai
import sys

key = "AIzaSyBBlqdK-WjbDLVOn9LnSygzWIiZscUb7yk"
print(f"Testing direct key: {key[:10]}...")

try:
    genai.configure(api_key=key)
    # List models to verify connectivity
    models = genai.list_models()
    found = False
    for m in models:
        print(f"Available Model: {m.name}")
        if "gemini-2.5-flash" in m.name or "gemini-2.0-flash" in m.name:
            found = True

    if found:
        print("SUCCESS: Connection established and model found.")
    else:
        print("WARNING: Key valid but model not found.")
except Exception as e:
    print(f"FAILED: {e}")
