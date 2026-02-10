import asyncio
import logging
import os
import sys
from datetime import datetime
from typing import Any, Dict, Optional

# Add swarm directory to path to allow imports from swarm modules
# Assuming structure: /app/backend/app/services/agent_service.py -> ../../../swarm
# We need to find the absolute path to 'swarm'
current_dir = os.path.dirname(os.path.abspath(__file__))
# up to app, up to backend, up to root, then swarm
swarm_path = os.path.join(current_dir, "../../../swarm")
if os.path.exists(swarm_path):
    sys.path.append(swarm_path)

# Try imports, handling potential errors if path is wrong
try:
    from agents.navigator import Navigator
    from core import AgentType, Message, MessageType
    from services.browser import BrowserService
    from services.llm import LLMService
except ImportError as e:
    logging.getLogger(__name__).error(f"Failed to import Swarm modules: {e}")
    import_error_msg = str(e)
    # Define dummy classes to prevent crash if imports fail during setup (for linting/check)
    class Navigator:

        def __init__(self, *args, **kwargs):
            pass

        async def browse(self, url, instruction):
            return {"error": f"Swarm modules not available: {import_error_msg}"}

    class BrowserService: pass
    class LLMService: pass

    # Fallback classes for Message and MessageType
    class Message:
        def __init__(self, content="", msg_type=None):
            self.content = content
            self.msg_type = msg_type or MessageType.BROWSE_RESULT

    class MessageType:
        BROWSE_RESULT = "browse_result"
        ERROR = "error"

from app.models.schemas import BrowserRequest, BrowserResponse

logger = logging.getLogger(__name__)

class CaptureBus:
    """Mock bus to capture responses from agents."""
    def __init__(self):
        self.captured_message = None

    def dispatch(self, message):
        # We only care about BROWSE_RESULT or ERROR sent back to 'sender'
        # In this simple bridge, we capture the last message dispatched
        self.captured_message = message

class AgentService:
    def __init__(self):
        self._navigator = None
        self._init_agent()

    def _init_agent(self):
        try:
            # Create a dedicated bus for this API service instance
            self.bus = CaptureBus()
            self._navigator = Navigator(swarm_bus=self.bus)
            logger.info("AgentService initialized with Navigator agent")
        except Exception as e:
            logger.error(f"Failed to initialize Navigator: {e}")

    async def browse(self, request: BrowserRequest) -> BrowserResponse:
        """
        Invoke the Navigator agent to browse a URL.
        Runs the synchronous agent blocking code in a thread pool.
        """
        if not self._navigator:
            # Try to re-init if it failed before
            self._init_agent()
            if not self._navigator:
                 raise Exception("Navigator agent is not available")

        # Create a swarm message
        # We use AgentType.OVERLORD as sender to mimic a command
        msg = Message(
            sender=AgentType.OVERLORD,
            receiver=AgentType.NAVIGATOR,
            msg_type=MessageType.BROWSE_REQUEST,
            content={
                "url": request.url,
                "instruction": request.instruction
            }
        )

        # Reset capture bus
        self.bus.captured_message = None

        # Run synchronous processing in a thread to avoid blocking main loop
        loop = asyncio.get_event_loop()
        try:
            await loop.run_in_executor(None, self._navigator.process_message, msg)
        except Exception as e:
            logger.error(f"Error during agent processing: {e}")
            return self._create_error_response(request, f"Agent processing error: {str(e)}")

        response_msg = self.bus.captured_message

        if not response_msg:
             return self._create_error_response(request, "No response from Navigator agent")

        # Parse content
        return self._parse_response(request, response_msg)

    def _parse_response(self, request: BrowserRequest, message: Message) -> BrowserResponse:
        content = message.content
        status = "unknown"
        summary = ""
        extracted_data = None

        if message.msg_type == MessageType.ERROR:
            status = "error"
            summary = str(content)
        elif message.msg_type == MessageType.BROWSE_RESULT and isinstance(content, dict):
            status = "success"
            summary = content.get("summary", "")
            extracted_data = content
            # Remove summary from extracted data to avoid duplication if preferred,
            # but for now keep it simple.

        return BrowserResponse(
            url=request.url,
            original_task=request.task,
            status=status,
            summary=summary,
            extracted_data=extracted_data,
            timestamp=datetime.utcnow().isoformat()
        )

    def _create_error_response(self, request: BrowserRequest, error_msg: str) -> BrowserResponse:
        return BrowserResponse(
            url=request.url,
            original_task=request.task,
            status="error",
            summary=error_msg,
            timestamp=datetime.utcnow().isoformat()
        )

agent_service = AgentService()
