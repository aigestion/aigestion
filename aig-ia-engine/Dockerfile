
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/app ./app
COPY backend/app/main_simple.py ./app/main.py
COPY backend/app/api/routes_simple.py ./app/api/routes.py
COPY backend/app/services/agent_service_simple.py ./app/services/agent_service.py
COPY backend/app/services/daniela_clowd_safe.py ./app/services/
COPY backend/app/api/daniela_routes.py ./app/api/


# Create data and logs directories
RUN mkdir -p data logs

# Expose port
EXPOSE 8000

# Run commands
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
