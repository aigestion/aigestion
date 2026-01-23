# Infrastructure Architecture

## Overview
AIGestion uses a containerized microservices architecture orchestrated via Docker Compose for local development and Kubernetes/Cloud Run for deployment.

## Services

| Service | Docker Container | Port | Description |
|---------|------------------|------|-------------|
| **Frontend** | `frontend` | 8080 | React/Vite application (Monorepo) |
| **Backend** | `backend` | 3000 | Node.js/Express API Gateway & Logic |
| **ML Service** | `ml-service` | 5000 | Python/FastAPI RAG Service |
| **MongoDB** | `mongodb` | 27017| Primary Database (NoSQL) |
| **Redis** | `redis` | 6379 | Caching & Rate Limiting |
| **Postgres** | `db` | 5432 | Relational DB (Likely for n8n/Legacy) |
| **Prometheus**| `nexus-prometheus`| 9090 | Metrics Collection |
| **Grafana** | `nexus-grafana` | 3001 | Observability Dashboard |

## Deployment
- **Local**: `docker-compose up -d --build` (See `package.json` scripts)
- **Production**:
    - **Cloud Run/K8s**: `deploy.ps1` script suggests Kubernetes deployment using `kubectl`.
    - **Firebase**: Frontend hosting support (`deploy:firebase` script).

## Automation (n8n)
- **Location**: `n8n/` directory.
- **Workflows**: Stored in `n8n/workflows/`.
- **Purpose**: Automations and integrations (e.g., Uptime monitoring).

## Monitoring
- **Stack**: Prometheus + Grafana (`docker-compose.monitoring.yml`).
- **Logs**: Winston (Backend), Sentry (Frontend).
