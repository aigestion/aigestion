import logging
import os
import time
from enum import Enum
from typing import Optional, Union

import google.generativeai as genai
from services.llm_cache import LLMCache
from services.circuit_breaker import CircuitBreaker
from services.telemetry import TelemetryService

logger = logging.getLogger("LLMService")


class ModelTier(str, Enum):
    FAST = "gemini-2.0-flash"
    BALANCED = "gemini-2.0-flash"
    REASONING = "gemini-2.0-pro-exp-02-05"


class LLMService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LLMService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        api_key = os.getenv("GEMINI_API_KEY")

        # Initialize Cache, Circuit Breaker and Telemetry
        self.cache = LLMCache()
        self.circuit_breaker = CircuitBreaker(name="GeminiAPI", failure_threshold=3)
        self.telemetry = TelemetryService()

        if not api_key:
            logger.warning(
                "GEMINI_API_KEY not found. LLM capabilities will be restricted."
            )
            self.model = None
            return

        try:
            genai.configure(api_key=api_key)
            self.default_model_name = "models/gemini-2.0-flash"
            self.pro_model_name = "models/gemini-2.0-pro-exp-02-05"

            # Pre-initialize both models
            self.models = {
                ModelTier.FAST: genai.GenerativeModel(self.default_model_name),
                ModelTier.REASONING: genai.GenerativeModel(self.pro_model_name),
            }
            logger.info(
                f"LLMService initialized with tiers: {[t.value for t in self.models.keys()]}"
            )
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {e}")
            self.models = {}

    def generate_text(
        self, prompt: str, use_cache: bool = True, tier: ModelTier = ModelTier.BALANCED
    ) -> Optional[str]:
        model = self.models.get(tier) or self.models.get(ModelTier.FAST)
        if not model:
            logger.error(f"LLM model for tier {tier} not initialized.")
            return "Error: LLM not configured."

        # 1. Check Cache
        if use_cache:
            cache_key = f"{tier.name}:{prompt}"
            cached = self.cache.get(cache_key)
            if cached:
                logger.info(f"LLM Cache Hit ({tier.name})")
                return cached

        # 2. Execute via Circuit Breaker
        try:
            start_t = time.time()

            def _call():
                response = model.generate_content(prompt)
                return response

            response = self.circuit_breaker.call(_call)
            result = response.text
            latency = time.time() - start_t

            # 3. Log Telemetry
            usage = getattr(response, "usage_metadata", None)
            token_count = (
                usage.total_token_count
                if usage
                else len(prompt) // 4 + len(result) // 4
            )  # Fallback estimation
            self.telemetry.log_inference(tier.name, latency, token_count)

            # 4. Store in Cache
            if result and use_cache:
                self.cache.set(cache_key, result)

            return result
        except Exception as e:
            logger.error(f"LLM Generation failed ({tier.name}): {e}")
            return f"Error communicating with AI service: {e}"

    def review_code(self, code: str, context: str = "") -> str:
        prompt = f"""
        Role: Senior Software Engineer & Security Auditor.
        Task: Review the following code.
        Context: {context}

        Code:
        ```
        {code}
        ```

        Output: valid markdown with findings (Security, Performance, Style) and a PASS/FAIL recommendation.
        """
        return self.generate_text(prompt, tier=ModelTier.REASONING)

    def generate_solution(self, issue: str) -> str:
        prompt = f"""
        Role: Senior Software Architect.
        Task: Design a technical solution for the following issue.

        Issue:
        {issue}

        Output: A concise implementation plan in markdown.
        """
        return self.generate_text(prompt, tier=ModelTier.REASONING)
