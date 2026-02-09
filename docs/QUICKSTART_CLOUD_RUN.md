# 🌌 Quick Start: Deploy Backend God Mode

## Fast Deployment (Option 3: Manual gcloud)

Replace `PROJECT_ID` with your actual GCP project ID.

### Step 1: Set Project ID
```bash
export PROJECT_ID="your-project-id-here"
```

### Step 2: Build Backend
```bash
cd backend
npm ci
npm run build
```

### Step 3: Build & Push Docker Image
```bash
docker build -t gcr.io/$PROJECT_ID/backend:latest .
docker push gcr.io/$PROJECT_ID/backend:latest
```

### Step 4: Deploy to Cloud Run (God Mode)
```bash
gcloud run deploy backend-aigestion \
  --image gcr.io/$PROJECT_ID/backend:latest \
  --region us-central1 \
  --platform managed \
  --cpu 4 \
  --memory 8Gi \
  --cpu-boost \
  --execution-environment gen2 \
  --min-instances 1 \
  --max-instances 100 \
  --concurrency 80 \
  --timeout 300 \
  --port 8080 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,PORT=8080
```

### Step 5: Test Deployment
```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe backend-aigestion \
  --region=us-central1 \
  --format='value(status.url)')

echo "Service URL: $SERVICE_URL"

# Test health endpoint
curl $SERVICE_URL/api/v1/health
```

**Expected response:**
```json
{"status":"healthy","uptime":xxx,"version":"1.0.0"}
```

### Step 6: Update Vercel Configuration
Update the backend URL in your Vercel configuration:

**File: `vercel.json`**
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "YOUR_SERVICE_URL/api/$1"
    }
  ]
}
```

Replace `YOUR_SERVICE_URL` with the actual Cloud Run service URL from Step 5.

## Next Steps

- Set up monitoring dashboard: `gcloud monitoring dashboards create --config-from-file=monitoring/cloud-run-dashboard.json`
- Configure alerts: See `monitoring/alerts.yaml`
- Review complete documentation: `docs/CLOUD_RUN_GOD_MODE.md`

## Rollback

If something goes wrong:
```bash
# List revisions
gcloud run revisions list --service=backend-aigestion --region=us-central1

# Rollback to previous
gcloud run services update-traffic backend-aigestion \
  --region=us-central1 \
  --to-revisions=PREVIOUS_REVISION=100
```
