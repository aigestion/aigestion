import os
import logging
import google.generativeai as genai
from google.oauth2 import service_account
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DiagnoseSA")


def diagnose():
    load_dotenv()

    sa_path = "C:\\Users\\Alejandro\\antigravity-mcp-key.json"
    logger.info(f"Targeting SA: {sa_path}")

    try:
        # Crucial: Unset API key to avoid "mutually exclusive" error
        if "GEMINI_API_KEY" in os.environ:
            del os.environ["GEMINI_API_KEY"]
        if "GOOGLE_GENAI_API_KEY" in os.environ:
            del os.environ["GOOGLE_GENAI_API_KEY"]

        if not os.path.exists(sa_path):
            raise FileNotFoundError(f"Key file not found at {sa_path}")

        creds = service_account.Credentials.from_service_account_file(sa_path)
        genai.configure(credentials=creds)
        logger.info("GenAI configured with Service Account.")

        model = genai.GenerativeModel("gemini-1.5-flash")

        logger.info("Testing content generation...")
        response = model.generate_content("Say 'Sovereign SA Active'")
        logger.info(f"Response: {response.text}")
        logger.info("✨ SUCCESS: Service Account works!")

    except Exception as e:
        logger.error(f"❌ Diagnosis failed: {e}")


if __name__ == "__main__":
    diagnose()
