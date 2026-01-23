---
description: Build and deploy the frontend application to Cloud Run.
---

# Deploy Frontend

## 1. Build
- [ ] Build the frontend app.
// turbo
```bash
cd frontend/apps/dashboard
npm run build
```

## 2. Docker Push
- [ ] Build and push Docker image.
```bash
docker build -t gcr.io/[PROJECT_ID]/frontend:latest .
docker push gcr.io/[PROJECT_ID]/frontend:latest
```

## 3. Deploy
- [ ] Deploy to Cloud Run.
```bash
gcloud run deploy frontend-service --image gcr.io/[PROJECT_ID]/frontend:latest
```
