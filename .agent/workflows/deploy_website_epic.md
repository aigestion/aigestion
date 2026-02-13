---
description: Build and deploy the website-epic application to Cloud Run
---

# Deploy Website Epic

## 1. Build Docker Image

// turbo

```bash
cd frontend/apps/website-epic
docker build -f Dockerfile.production -t gcr.io/aigestion-pro-2026/website-epic:latest .
```

## 2. Push Docker Image

// turbo

```bash
docker push gcr.io/aigestion-pro-2026/website-epic:latest
```

## 3. Deploy to Cloud Run

// turbo

```bash
gcloud run deploy website-epic \
  --image gcr.io/aigestion-pro-2026/website-epic:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --project aigestion-pro-2026
```
