# Build stage
FROM python:3.11-slim AS builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Pre-download model
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Final stage
FROM python:3.11-slim

WORKDIR /app
COPY --from=builder /root/.local /root/.local
# Copy only what's necessary and check path existence if possible,
# or just allow the final stage to handle its own cache if builder fails.
COPY --from=builder /app /app

# Install curl for health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY app/ app/

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

# Create non-root user
RUN addgroup --system app && adduser --system --group app \
    && chown -R app:app /app && chown -R app:app /root

USER app

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

EXPOSE 5001
CMD ["python", "-m", "app.main"]
