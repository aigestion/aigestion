import asyncio
import logging
import os
import requests
from datetime import datetime
from typing import Any, Dict, Optional

from app.models.schemas import BrowserRequest, BrowserResponse
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

class AgentService:
    def __init__(self):
        self.browser_host = os.getenv("BROWSER_HOST", "browser-service")
        self.browser_port = os.getenv("BROWSER_PORT", "3000")
        self.browser_url = f"http://{self.browser_host}:{self.browser_port}"

    async def browse(self, url: str, instruction: str) -> BrowserResponse:
        """
        Browse a website using the browser service and return results.
        """
        try:
            # Prepare the browserless payload
            payload = {
                "url": url,
                "elements": [{
                    "selector": "body"
                }]
            }

            # Call browser service
            response = requests.post(
                f"{self.browser_url}/content",
                json=payload,
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                content = data.get("data", {}).get("results", [{}])[0].get("text", "")

                # Create a proper response with all required fields
                return BrowserResponse(
                    url=url,
                    original_task="browse",  # Fixed value for simplified version
                    status="success",
                    summary=self._create_summary(content, instruction),
                    extracted_data={"content": content[:1000]},  # First 1000 chars
                    timestamp=datetime.now().isoformat()
                )
            else:
                return BrowserResponse(
                    url=url,
                    original_task="browse",
                    status="error",
                    summary=f"Browser service error: {response.status_code}",
                    extracted_data={"error": f"HTTP {response.status_code}"},
                    timestamp=datetime.now().isoformat()
                )

        except requests.exceptions.ConnectionError:
            return BrowserResponse(
                url=url,
                original_task="browse",
                status="error",
                summary="Cannot connect to browser service",
                extracted_data={"error": "Connection failed"},
                timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            logger.error(f"Error in browse: {e}")
            return BrowserResponse(
                url=url,
                original_task="browse",
                status="error",
                summary=str(e),
                extracted_data={"error": str(e)},
                timestamp=datetime.now().isoformat()
            )

    def _extract_title(self, content: str) -> str:
        """Extract title from HTML content."""
        import re
        title_match = re.search(r'<title[^>]*>(.*?)</title>', content, re.IGNORECASE)
        if title_match:
            return title_match.group(1).strip()
        return "No title found"

    def _create_summary(self, content: str, instruction: str) -> str:
        """Create a simple summary based on content and instruction."""
        # Simple text extraction - in a real implementation, this would use AI
        content_length = len(content)
        summary = f"Content extracted successfully. Length: {content_length} characters.\n"
        summary += f"Instruction: {instruction}\n"
        summary += f"Content preview: {content[:200]}..."
        return summary

# Create singleton instance
agent_service = AgentService()
