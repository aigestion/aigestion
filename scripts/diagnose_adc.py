import os
import logging
import google.generativeai as genai
import google.auth
from google.oauth2 import service_account
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DiagnoseADC")


def diagnose():
    load_dotenv()

    # Force unset credentials to avoid conflict
    for key in [
        "GEMINI_API_KEY",
        "GOOGLE_GENAI_API_KEY",
        "GOOGLE_APPLICATION_CREDENTIALS",
    ]:
        if key in os.environ:
            logger.info(f"Unsetting {key}")
            del os.environ[key]

    try:
        logger.info("Attempting to load Application Default Credentials (ADC)...")
        creds, project = google.auth.default()
        logger.info(f"ADC Loaded. Project: {project}")

        genai.configure(credentials=creds)
        logger.info("GenAI configured with ADC.")

        # models/gemini-1.5-flash is standard
        model = genai.GenerativeModel("gemini-1.5-flash")

        logger.info("Testing content generation...")
        response = model.generate_content("Say 'Sovereign ADC Active'")
        logger.info(f"Response: {response.text}")
        logger.info("✨ SUCCESS: Application Default Credentials work!")

    except Exception as e:
        logger.error(f"❌ Diagnosis failed: {e}")

        # Fallback: check if we can list models at least
        try:
            logger.info("Check if we can list models...")
            for m in genai.list_models():
                logger.info(f"Available model: {m.name}")
        except Exception as e2:
            logger.error(f"List models also failed: {e2}")


if __name__ == "__main__":
    diagnose()
