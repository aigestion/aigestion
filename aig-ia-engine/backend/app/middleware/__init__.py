"""
Middleware package for AIGestion IA Engine.
"""

from .metrics_middleware import PrometheusMiddleware

__all__ = ["PrometheusMiddleware"]
