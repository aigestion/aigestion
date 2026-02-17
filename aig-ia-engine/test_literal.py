import google.generativeai as genai
import os

key = "AIzaSyBBlqdK-WjbDLVOn9LnSygzWIiZscUb7yk"
print(f"Testing literal key: {key[:10]}...")
genai.configure(api_key=key)

try:
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content('ping')
    print(f"SUCCESS: {response.text}")
except Exception as e:
    print(f"FAILURE: {e}")
