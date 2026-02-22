# AIGestion Nexus Deployment Guide

## Local Orchestration (Docker)
1. Ensure `.env` is fully configured according to the 20-block standard.
2. Run `docker-compose up -d --build`.
3. Verify health via `scripts/docker-health-check.sh`.

## Cloud Run (Sovereign Deploy)
1. Authenticate: `gcloud auth login`.
2. Configure Project: `gcloud config set project aigestion-v2`.
3. Deploy: Use the `sovereign-deploy.yml` GitHub Action or run the Cloud Build pipeline.

## Monitoring
- Production logs are available via Google Cloud Logging.
- Health endpoints: `/api/v1/health`.
