---
description: Deploy ML service to Cloud Run.
---

# Deploy ML Service

## 1. Build
- [ ] Build ML container.
// turbo
```bash
cd ml-service
docker build -t gcr.io/[PROJECT_ID]/ml-service:latest .
```

## 2. Push & Deploy
- [ ] Push to registry and deploy.
```bash
docker push gcr.io/[PROJECT_ID]/ml-service:latest
gcloud run deploy ml-service --image gcr.io/[PROJECT_ID]/ml-service:latest
```
