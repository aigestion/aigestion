import logging
import os
import time
from enum import Enum
from typing import Optional, Any, Dict, List

import google.generativeai as genai
from services.llm_cache import LLMCache
from services.circuit_breaker import CircuitBreaker
from services.telemetry import TelemetryService
from google.oauth2 import service_account

logger = logging.getLogger("LLMService")


class ModelTier(str, Enum):
    FAST = "gemini-2.5-flash"
    BALANCED = "gemini-2.5-flash"
    REASONING = "gemini-2.5-pro"


class LLMService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LLMService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # 1. Load configuration (Force override to ignore poisoned system env vars)
        from dotenv import load_dotenv

        # Look for .env in current and parent dirs to be robust
        load_dotenv(override=True)
        load_dotenv(os.path.join(os.getcwd(), ".env"), override=True)

        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        sa_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

        # 2. Initialize Infrastructure
        self.cache = LLMCache()
        self.circuit_breaker = CircuitBreaker(name="GeminiAPI", failure_threshold=3)
        self.telemetry = TelemetryService()
        self.models = {}

        # 3. Configure SDK
        if api_key:
            try:
                genai.configure(api_key=api_key)
                logger.info("LLMService: SDK configured with API Key.")
            except Exception as e:
                logger.error(f"LLMService: API Key config failed: {e}")
                return
        elif sa_path and os.path.exists(sa_path):
            try:
                creds = service_account.Credentials.from_service_account_file(sa_path)
                genai.configure(credentials=creds)
                logger.info("LLMService: SDK configured with Service Account.")
            except Exception as e:
                logger.error(f"LLMService: SA config failed: {e}")
                return
        else:
            logger.warning("LLMService: No Gemini API Key or SA Credentials found.")
            return

        # 4. Initialize Models
        try:
            # FAST tier
            self.default_model_name = os.getenv("GEMINI_MODEL", ModelTier.FAST.value)
            if not self.default_model_name.startswith("models/"):
                self.default_model_name = f"models/{self.default_model_name}"

            # REASONING tier
            self.pro_model_name = ModelTier.REASONING.value
            if not self.pro_model_name.startswith("models/"):
                self.pro_model_name = f"models/{self.pro_model_name}"

            self.models = {
                ModelTier.FAST: genai.GenerativeModel(self.default_model_name),
                ModelTier.BALANCED: genai.GenerativeModel(self.default_model_name),
                ModelTier.REASONING: genai.GenerativeModel(self.pro_model_name),
            }
            logger.info(f"LLMService: Models initialized: {list(self.models.keys())}")
        except Exception as e:
            logger.error(f"LLMService: Model initialization failed: {e}")
            self.models = {}

    def generate_text(
        self, prompt: Any, use_cache: bool = True, tier: ModelTier = ModelTier.BALANCED
    ) -> str:
        model = self.models.get(tier) or self.models.get(ModelTier.FAST)
        if not model:
            logger.error(f"LLM model for tier {tier} not initialized.")
            return "Error: LLM not configured."

        # Check Cache
        if use_cache:
            # Use string representation of prompt for cache key if it's not a string (e.g. List)
            prompt_str = str(prompt) if not isinstance(prompt, str) else prompt
            cache_key = f"{tier.name}:{prompt_str}"
            cached = self.cache.get(cache_key)
            if cached:
                logger.info(f"LLM Cache Hit ({tier.name})")
                return cached

        # Multimodal processing
        processed_prompt = prompt
        if isinstance(prompt, list):
            processed_prompt = []
            for item in prompt:
                if isinstance(item, dict):
                    if "image_uri" in item and item["image_uri"]:
                        uri = item["image_uri"]
                        if uri.startswith("http"):
                            try:
                                import requests

                                resp = requests.get(uri, timeout=10)
                                resp.raise_for_status()
                                processed_prompt.append(
                                    {
                                        "inline_data": {
                                            "mime_type": resp.headers.get(
                                                "Content-Type", "image/png"
                                            ),
                                            "data": resp.content,
                                        }
                                    }
                                )
                            except Exception as e:
                                logger.error(
                                    f"Failed to fetch image from URI {uri}: {e}"
                                )
                        else:
                            # Handle local path
                            if os.path.exists(uri):
                                with open(uri, "rb") as f:
                                    data = f.read()
                                processed_prompt.append(
                                    {
                                        "inline_data": {
                                            "mime_type": "image/png",  # Defaulting
                                            "data": data,
                                        }
                                    }
                                )
                    elif "image_base64" in item and item["image_base64"]:
                        import base64

                        img_data = base64.b64decode(item["image_base64"])
                        processed_prompt.append(
                            {
                                "inline_data": {
                                    "mime_type": item.get("mime_type", "image/png"),
                                    "data": img_data,
                                }
                            }
                        )
                    else:
                        processed_prompt.append(item)
                else:
                    processed_prompt.append(item)

        logger.info(
            f"LLM Processed Prompt structure confirmed. Parts: {len(processed_prompt) if isinstance(processed_prompt, list) else 1}"
        )

        # Execute via Circuit Breaker
        try:
            start_t = time.time()

            def _call():
                return model.generate_content(processed_prompt)

            response = self.circuit_breaker.call(_call)
            result = response.text
            latency = time.time() - start_t

            # Telemetry
            usage = getattr(response, "usage_metadata", None)
            token_count = (
                usage.total_token_count
                if usage
                else (len(prompt) // 4 + len(result) // 4)
            )
            self.telemetry.log_inference(tier.name, latency, token_count)

            # Store in Cache
            if result and use_cache:
                self.cache.set(cache_key, result)

            return result
        except Exception as e:
            logger.error(f"LLM Generation failed ({tier.name}): {e}")
            return f"Error communicating with AI service: {e}"

    def review_code(self, code: str, context: str = "") -> str:
        prompt = f"""
        Role: Ingeniero de Software Senior y Auditor de Seguridad.
        Task: Revisar el siguiente código.
        Context: {context}

        Code:
        ```
        {code}
        ```

        Output: markdown válido con hallazgos (Seguridad, Rendimiento, Estilo) y una recomendación de APROBADO/FALLIDO.
        """
        return self.generate_text(prompt, tier=ModelTier.REASONING)

    def generate_solution(self, issue: str) -> str:
        prompt = f"""
        Role: Arquitecto de Software Senior.
        Task: Diseñar una solución técnica para el siguiente problema.

        Issue:
        {issue}

        Output: Un plan de implementación conciso en markdown.
        """
        return self.generate_text(prompt, tier=ModelTier.REASONING)
