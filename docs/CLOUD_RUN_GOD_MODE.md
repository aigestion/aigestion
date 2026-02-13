# 🌌 Cloud Run God Mode - Complete Guide

## Overview

This document provides comprehensive guidance for deploying and managing the AIGestion backend on Google Cloud Run with **God Mode** configuration - maximum performance, scalability, security, and observability.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Vercel CDN                         │
│                    (Frontend)                          │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Cloud Run (Gen2)                          │
│          backend-aigestion.run.app                     │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Auto-scaling: 1-100 instances               │    │
│  │  Resources: 4 vCPU, 8Gi RAM                  │    │
│  │  Concurrency: 80 req/instance                │    │
│  │  Startup CPU Boost: Enabled                  │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  Health Probes:                               │    │
│  │  - Startup: /api/v1/health (30s timeout)     │    │
│  │  - Liveness: /api/v1/health (5s timeout)     │    │
│  └──────────────────────────────────────────────┘    │
└────────┬───────────────────────────┬──────────────────┘
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Secret Manager │         │   VPC Network   │
│  (Credentials)  │         │  (Optional)     │
└─────────────────┘         └─────────────────┘
```

## Configuration Summary

### Resource Limits (God Mode)

- **CPU**: 4 vCPU (4000m)
- **Memory**: 8Gi
- **CPU Boost**: Enabled (faster cold starts)
- **Execution Environment**: Gen2

### Autoscaling

- **Min Instances**: 1 (always warm, no cold starts)
- **Max Instances**: 100 (handle traffic spikes)
- **Concurrency**: 80 requests per instance
- **Target CPU**: 70% utilization

### Timeout & Networking

- **Request Timeout**: 300 seconds (5 minutes)
- **Port**: 8080
- **Ingress**: All traffic (public)
- **VPC Connector**: Optional (for private services)

### Health Checks

- **Startup Probe**: `/api/v1/health`
  - Initial delay: 5s
  - Timeout: 30s
  - Period: 10s
  - Failure threshold: 10
- **Liveness Probe**: `/api/v1/health`
  - Initial delay: 10s
  - Timeout: 5s
  - Period: 10s
  - Failure threshold: 3

## Deployment Methods

### Option 1: Terraform (Recommended)

```bash
# Navigate to terraform directory
cd infra/terraform/modules/cloud_run

# Initialize Terraform
terraform init

# Review the plan
terraform plan \
  -var="service_name=backend-aigestion" \
  -var="image_url=gcr.io/PROJECT_ID/backend:latest" \
  -var="region=us-central1"

# Apply configuration
terraform apply
```

### Option 2: Cloud Build (CI/CD)

```bash
# From backend directory
cd backend

# Submit build with Cloud Build
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_ENV=production

# The pipeline will:
# 1. Build Docker image
# 2. Run security scan
# 3. Deploy to Cloud Run (no traffic)
# 4. Run smoke tests
# 5. Route traffic to new revision
# 6. Verify deployment
```

### Option 3: Manual Deployment

```bash
# Build and push Docker image
cd backend
docker build -t gcr.io/PROJECT_ID/backend:latest .
docker push gcr.io/PROJECT_ID/backend:latest

# Deploy to Cloud Run with God Mode settings
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

## Monitoring & Observability

### Cloud Monitoring Dashboard

A custom dashboard has been created at `monitoring/cloud-run-dashboard.json` with:

- Request rate and latency (p50, p95, p99)
- Error rates (4xx, 5xx)
- Container instance count
- CPU and memory utilization
- Cold start frequency

**To deploy the dashboard:**

```bash
gcloud monitoring dashboards create --config-from-file=monitoring/cloud-run-dashboard.json
```

### Alert Policies

Alert policies are defined in `monitoring/alerts.yaml`:

- High error rate (>5% for 5 min)
- High latency (p95 > 2s)
- Low availability (<99.5%)
- High CPU utilization (>80%)
- High memory utilization (>85%)
- Frequent cold starts (>10 in 5 min)

**To create alerts:**

```bash
# First, create notification channels in Cloud Console
# Then deploy alert policies
gcloud alpha monitoring policies create --policy-from-file=monitoring/alerts.yaml
```

### Logging

View logs in real-time:

```bash
# All logs
gcloud run services logs read backend-aigestion --region=us-central1 --follow

# Error logs only
gcloud run services logs read backend-aigestion --region=us-central1 --log-filter="severity>=ERROR" --follow
```

## Security

### Secret Manager Integration

Store sensitive data in Secret Manager:

```bash
# Create secret
echo -n "your-secret-value" | gcloud secrets create database-url --data-file=-

# Grant access to Cloud Run service account
gcloud secrets add-iam-policy-binding database-url \
  --member=serviceAccount:backend-sa@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Update Cloud Run to use secret
gcloud run services update backend-aigestion \
  --region=us-central1 \
  --set-secrets=DATABASE_URL=database-url:latest
```

### Service Account

Create a dedicated service account with minimal permissions:

```bash
# Create service account
gcloud iam service-accounts create backend-sa \
  --display-name="AIGestion Backend Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:backend-sa@PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Update Cloud Run to use service account
gcloud run services update backend-aigestion \
  --region=us-central1 \
  --service-account=backend-sa@PROJECT_ID.iam.gserviceaccount.com
```

## Performance Optimization

### Cold Start Mitigation

- **Min instances = 1**: Service is always warm
- **CPU boost enabled**: Faster container startup
- **Gen2 execution environment**: Better performance

### Autoscaling Strategy

- **70% CPU target**: Balance between cost and responsiveness
- **80 concurrency**: Optimal for Node.js event loop
- **1-100 instances**: Handle traffic from 80 to 8,000 req/s

### Cost Optimization

If cost is a concern, consider:

- Reduce CPU to 2 vCPU (`--cpu 2`)
- Reduce memory to 4Gi (`--memory 4Gi`)
- Set min-instances to 0 (accept cold starts)
- Reduce max-instances to 50

## Troubleshooting

### Service Not Responding

```bash
# Check service status
gcloud run services describe backend-aigestion --region=us-central1

# Check recent logs
gcloud run services logs read backend-aigestion --region=us-central1 --limit=50

# Check health endpoint
curl https://backend-aigestion-xxx-uc.a.run.app/api/v1/health
```

### High Error Rate

```bash
# Filter error logs
gcloud run services logs read backend-aigestion --region=us-central1 \
  --log-filter="severity>=ERROR" --limit=100

# Check instance count
gcloud run services describe backend-aigestion --region=us-central1 \
  --format="get(status.traffic[0].latestRevision)"
```

### Slow Performance

- Check Cloud Monitoring dashboard for CPU/Memory usage
- Review autoscaling settings
- Consider increasing CPU or memory
- Check for cold starts (increase min-instances)

### Deployment Failed

```bash
# Check Cloud Build logs
gcloud builds list --limit=10

# View specific build
gcloud builds log BUILD_ID

# Rollback to previous revision
gcloud run services update-traffic backend-aigestion \
  --region=us-central1 \
  --to-revisions=PREVIOUS_REVISION=100
```

## Cost Estimation

Based on God Mode configuration (approximate monthly costs):

**High Traffic Scenario** (1M requests/month, avg 100ms latency)

- Compute: ~$150-200/month
- Network: ~$10-20/month
- **Total**: ~$160-220/month

**Medium Traffic Scenario** (100K requests/month, avg 100ms latency)

- Compute: ~$50-70/month
- Network: ~$2-5/month
- **Total**: ~$52-75/month

**Note**: Costs vary based on actual usage. Monitor via Cloud Billing.

## Best Practices

1. **Always deploy via Cloud Build** for consistency
2. **Use Secret Manager** for all sensitive data
3. **Monitor the dashboard** regularly
4. **Set up alerts** for critical metrics
5. **Test in staging** before production
6. **Keep min-instances ≥ 1** for user-facing services
7. **Enable Cloud Trace** for request debugging
8. **Use structured logging** for better observability

## Next Steps

1. Deploy the configuration: `terraform apply` or `gcloud builds submit`
2. Set up monitoring dashboard
3. Configure alert policies
4. Test the deployment thoroughly
5. Monitor performance and adjust as needed

## Support

For issues or questions:

- Check Cloud Run logs
- Review Cloud Monitoring dashboard
- Consult Google Cloud documentation
- Contact the development team
