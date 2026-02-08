---
description: Build and deploy the backend service to Cloud Run with God Mode configuration.
---

# Deploy Backend (God Mode)

## Prerequisites
- [ ] GCloud CLI authenticated and configured
- [ ] Docker installed and running
- [ ] Terraform installed (for Terraform deployment)
- [ ] Backend tests passing

## Option 1: Terraform Deployment (Recommended)

### 1. Review Configuration
- [ ] Check Terraform variables in `infra/terraform/modules/cloud_run/variables.tf`
- [ ] Verify service name, region, and resource limits

### 2. Build Backend
// turbo
```bash
cd backend
npm run build
```

### 3. Build Docker Image
```bash
cd backend
docker build -t gcr.io/PROJECT_ID/backend:latest .
docker push gcr.io/PROJECT_ID/backend:latest
```

### 4. Deploy with Terraform
```bash
cd infra/terraform/modules/cloud_run
terraform init
terraform plan -var="service_name=backend-aigestion" -var="image_url=gcr.io/PROJECT_ID/backend:latest"
terraform apply
```

### 5. Verify Deployment
// turbo
```bash
curl https://backend-aigestion-xxx-uc.a.run.app/api/v1/health
```

## Option 2: Cloud Build (CI/CD)

### 1. Submit Build
```bash
cd backend
gcloud builds submit --config=cloudbuild.yaml
```

The pipeline automatically:
- Builds Docker image
- Runs security scan
- Deploys to Cloud Run
- Runs smoke tests
- Routes traffic

### 2. Monitor Build
```bash
gcloud builds list --limit=5
gcloud builds log BUILD_ID --stream
```

## Option 3: Manual gcloud Deployment

### 1. Build and Push
```bash
cd backend
npm run build
docker build -t gcr.io/PROJECT_ID/backend:latest .
docker push gcr.io/PROJECT_ID/backend:latest
```

### 2. Deploy with God Mode Settings
```bash
gcloud run deploy backend-aigestion \
  --image gcr.io/PROJECT_ID/backend:latest \
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

## Post-Deployment

### 1. Setup Monitoring
```bash
# Deploy dashboard
gcloud monitoring dashboards create --config-from-file=monitoring/cloud-run-dashboard.json

# View metrics
gcloud monitoring dashboards list
```

### 2. Configure Alerts
```bash
# Deploy alert policies
gcloud alpha monitoring policies create --policy-from-file=monitoring/alerts.yaml
```

### 3. Verify Health
// turbo
```bash
# Health check
curl https://backend-aigestion-xxx-uc.a.run.app/api/v1/health

# Expected: {"status":"healthy","uptime":xxx,"version":"1.0.0"}
```

### 4. Check Metrics
```bash
# View recent logs
gcloud run services logs read backend-aigestion --region=us-central1 --limit=50

# Check instance count
gcloud run services describe backend-aigestion --region=us-central1 --format="value(status.traffic[0].percent)"
```

## Rollback

If deployment fails:
```bash
# List revisions
gcloud run revisions list --service=backend-aigestion --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic backend-aigestion \
  --region=us-central1 \
  --to-revisions=PREVIOUS_REVISION=100
```

## Troubleshooting

- **Build fails**: Check Docker logs and package.json
- **Deploy fails**: Check Cloud Run logs and quotas
- **Health check fails**: Verify `/api/v1/health` endpoint works locally
- **High latency**: Check CPU/Memory metrics, increase resources if needed
- **Cold starts**: Increase min-instances

See `docs/CLOUD_RUN_GOD_MODE.md` for comprehensive guide.

