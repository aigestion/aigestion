---
description: Build and deploy the backend service to Cloud Run.
---

# Deploy Backend

## 1. Build
- [ ] Build the backend service.
// turbo
```bash
cd backend
npm run build
```

## 2. Docker Push
- [ ] Build and push Docker image.
```bash
docker build -t gcr.io/[PROJECT_ID]/backend:latest .
docker push gcr.io/[PROJECT_ID]/backend:latest
```

## 3. Deploy
- [ ] Deploy to Cloud Run.
```bash
gcloud run deploy backend-service --image gcr.io/[PROJECT_ID]/backend:latest
```
