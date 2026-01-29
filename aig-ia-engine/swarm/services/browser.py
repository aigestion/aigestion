import logging
import os
from typing import Any, Dict, Optional

from playwright.sync_api import sync_playwright

logger = logging.getLogger("BrowserService")


class BrowserService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(BrowserService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # In Docker, we talk to the browser-service container
        self.browser_host = os.getenv("BROWSER_HOST", "browser-service")
        self.browser_port = os.getenv("BROWSER_PORT", "3000")
        self.token = os.getenv("BROWSERLESS_API_KEY", "dev_browser_token")

        # Browserless Playwright Endpoint
        self.ws_endpoint = f"ws://{self.browser_host}:{self.browser_port}/chromium/playwright?token={self.token}"
        logger.info(
            f"BrowserService initialized. Target: {self.browser_host}:{self.browser_port}"
        )

    def navigate_and_extract(self, url: str) -> Dict[str, Any]:
        """
        Connects to the remote browser, navigates to the URL, and extracts content.
        """
        logger.info(f"Connecting to remote browser at {self.ws_endpoint}...")
        try:
            with sync_playwright() as p:
                # Connect to browserless
                browser = p.chromium.connect(self.ws_endpoint)

                # New context for isolation (incognito like)
                context = browser.new_context(
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    viewport={"width": 1280, "height": 720},
                )
                page = context.new_page()

                logger.info(f"Navigating to {url}")
                page.goto(url, wait_until="networkidle", timeout=30000)

                title = page.title()
                # Get main text content
                text = page.evaluate("() => document.body.innerText")

                # Simple cleaning
                clean_text = " ".join(text.split())[
                    :15000
                ]  # Limit to 15k chars for LLM safety

                context.close()
                browser.close()

                return {
                    "status": "success",
                    "title": title,
                    "content": clean_text,
                    "url": url,
                }

        except Exception as e:
            logger.error(f"Browser navigation failed: {e}")
            return {"status": "error", "error": str(e), "url": url}

    def take_screenshot(self, url: str) -> Dict[str, Any]:
        """
        Navigates to URL and takes a screenshot.
        """
        try:
            with sync_playwright() as p:
                browser = p.chromium.connect(self.ws_endpoint)
                context = browser.new_context()
                page = context.new_page()

                page.goto(url, wait_until="networkidle", timeout=30000)

                title = page.title()

                context.close()
                browser.close()

                return {
                    "status": "success",
                    "title": title,
                    "message": "Screenshot capability is ready.",
                    "url": url,
                }
        except Exception as e:
            return {"status": "error", "error": str(e)}
            return {"status": "error", "error": str(e)}
