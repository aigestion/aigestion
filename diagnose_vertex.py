import os
import logging
from google.cloud import aiplatform
import vertexai
from vertexai.generative_models import GenerativeModel
from google.oauth2 import service_account

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("DiagnoseVertex")

def diagnose():
    sa_path = "C:\\Users\\Alejandro\\antigravity-mcp-key.json"
    project_id = "aigestion"
    location = "us-central1" # standard for vertex

    try:
        logger.info(f"Targeting Vertex AI in project: {project_id}")
        
        if not os.path.exists(sa_path):
            raise FileNotFoundError(f"Key file not found at {sa_path}")

        creds = service_account.Credentials.from_service_account_file(sa_path)
        vertexai.init(project=project_id, location=location, credentials=creds)
        
        logger.info("Vertex AI initialized.")
        
        model = GenerativeModel("gemini-1.5-flash-002")
        
        logger.info("Testing content generation via Vertex...")
        response = model.generate_content("Say 'Sovereign Vertex Active'")
        logger.info(f"Response: {response.text}")
        logger.info("✨ SUCCESS: Vertex AI works!")
        
    except Exception as e:
        logger.error(f"❌ Vertex Diagnosis failed: {e}")

if __name__ == "__main__":
    diagnose()
