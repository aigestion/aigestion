
FROM mcr.microsoft.com/playwright/python:v1.41.0-jammy

WORKDIR /app

# Install system dependencies if needed (Playwright image has most)
# Keeping build-essential just in case
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN playwright install chromium

# Copy application code
COPY backend/app ./app
# Simplified entrypoint is legacy. Using full main.py for metrics/health.
# Entrypoint is uvicorn app.main:app
# Ensure PYTHONPATH includes current directory to resolve 'app' module
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
COPY backend/app/services/agent_service_simple.py ./app/services/agent_service.py
COPY backend/app/services/daniela_clowd_safe.py ./app/services/
COPY backend/app/api/daniela_routes.py ./app/api/


# Create data and logs directories
RUN mkdir -p data logs

# Expose port
EXPOSE 8000

# Run commands
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
