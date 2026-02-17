import os
import google.generativeai as genai
from google.oauth2 import service_account
from dotenv import load_dotenv

# Clear environment
if "GEMINI_API_KEY" in os.environ:
    del os.environ["GEMINI_API_KEY"]


def test_sa_auth():
    print("--- Sovereign Auth Diagnostic (Alternative SA) ---")

    sa_path = "C:\\Users\\Alejandro\\antigravity-mcp-key.json"
    print(f"Target SA Path: {sa_path}")

    if not os.path.exists(sa_path):
        print(f"Error: SA file not found at {sa_path}")
        return

    try:
        creds = service_account.Credentials.from_service_account_file(sa_path)
        genai.configure(credentials=creds)
        print("Success: GenAI configured with Service Account.")

        # Test model
        model = genai.GenerativeModel(
            "gemini-1.5-flash"
        )  # Use 1.5-flash for broader compatibility
        print("Sending test prompt...")
        response = model.generate_content("Hola, ¿estás operativo?")
        print(f"Response: {response.text}")
        print("✨ SUCCESS: Alternative SA authentication verified.")

    except Exception as e:
        print(f"Diagnostic failed: {e}")


if __name__ == "__main__":
    test_sa_auth()
