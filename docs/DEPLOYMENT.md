# 🚀 AIGestion Deployment Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Environments](#environments)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring](#monitoring)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

AIGestion supports multiple deployment environments with automated CI/CD pipelines and comprehensive monitoring.

### Deployment Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│   (Local)       │    │   (Cloud)       │    │   (Cloud)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Docker Compose│    │   Kubernetes    │    │   Kubernetes    │
│   (Local)       │    │   (GKE/AKS)     │    │   (GKE/AKS)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🌍 Environments

### Development Environment
- **Purpose**: Local development and testing
- **Infrastructure**: Docker Compose
- **Database**: Local PostgreSQL + MongoDB + Redis
- **Features**: Hot reload, debugging, detailed logging

### Staging Environment
- **Purpose**: Integration testing and QA
- **Infrastructure**: Kubernetes (GKE)
- **Database**: Cloud SQL (PostgreSQL) + Atlas (MongoDB) + Memorystore (Redis)
- **Features**: Production-like setup, performance testing

### Production Environment
- **Purpose**: Live application
- **Infrastructure**: Kubernetes (GKE) with multi-zone deployment
- **Database**: Cloud SQL (PostgreSQL) + Atlas (MongoDB) + Memorystore (Redis)
- **Features**: High availability, auto-scaling, monitoring

---

## 📋 Prerequisites

### Required Tools
```bash
# Development Tools
- Node.js 22+
- Python 3.11+
- Docker 20.10+
- Docker Compose 2.0+
- kubectl 1.28+
- helm 3.12+
- pnpm 8.15.0+

# Cloud Tools (for staging/production)
- gcloud CLI 444+
- AWS CLI 2.13+
- Terraform 1.6+
```

### Cloud Accounts
```bash
# Google Cloud Platform
- Project: aigestion-production
- Services: GKE, Cloud SQL, Cloud Storage, Cloud Build
- IAM: Container Admin, Cloud SQL Admin

# AWS (for backup/DR)
- S3 buckets for backups
- Route53 for DNS management

# GitHub
- Repository access
- Actions secrets configuration
- OIDC trust relationship
```

---

## 💻 Local Development

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/aigestion/aigestion-net.git
cd aigestion-net

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start services
docker-compose up -d

# 5. Run database migrations
pnpm run db:migrate

# 6. Start development servers
pnpm run dev
```

### Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/aigestion_dev
      - MONGODB_URL=mongodb://mongo:27017/aigestion_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - mongo
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:3000
    volumes:
      - ./frontend:/app
      - /app/node_modules

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=aigestion_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  mongo_data:
  redis_data:
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "concurrently \"pnpm run dev:backend\" \"pnpm run dev:frontend\"",
    "dev:backend": "cd backend && pnpm dev",
    "dev:frontend": "cd frontend && pnpm dev",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up",
    "docker:build": "docker-compose build",
    "docker:clean": "docker-compose down -v && docker system prune -f"
  }
}
```

---

## 🚀 Staging Deployment

### Kubernetes Configuration
```yaml
# k8s/staging/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: aigestion-staging
  labels:
    environment: staging
    project: aigestion

---
# k8s/staging/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: aigestion-staging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
        environment: staging
    spec:
      containers:
      - name: backend
        image: gcr.io/aigestion/backend:staging-latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "staging"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: aigestion-secrets
              key: database-url
        - name: MONGODB_URL
          valueFrom:
            secretKeyRef:
              name: aigestion-secrets
              key: mongodb-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: aigestion-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# k8s/staging/backend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: aigestion-staging
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP

---
# k8s/staging/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aigestion-ingress
  namespace: aigestion-staging
  annotations:
    kubernetes.io/ingress.class: "gce"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - staging.aigestion.net
    secretName: aigestion-staging-tls
  rules:
  - host: staging.aigestion.net
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

### Deployment Script
```bash
#!/bin/bash
# scripts/deploy-staging.sh

set -e

echo "🚀 Deploying to staging environment..."

# Set variables
PROJECT_ID="aigestion-production"
CLUSTER_NAME="aigestion-staging"
ZONE="us-central1-a"
NAMESPACE="aigestion-staging"

# Authenticate
gcloud auth login
gcloud config set project $PROJECT_ID

# Get cluster credentials
gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE

# Build and push images
echo "📦 Building and pushing images..."
docker build -t gcr.io/$PROJECT_ID/backend:staging-latest ./backend
docker build -t gcr.io/$PROJECT_ID/frontend:staging-latest ./frontend

docker push gcr.io/$PROJECT_ID/backend:staging-latest
docker push gcr.io/$PROJECT_ID/frontend:staging-latest

# Apply Kubernetes manifests
echo "🔧 Applying Kubernetes manifests..."
kubectl apply -f k8s/staging/namespace.yaml
kubectl apply -f k8s/staging/secrets.yaml
kubectl apply -f k8s/staging/configmaps.yaml
kubectl apply -f k8s/staging/backend-deployment.yaml
kubectl apply -f k8s/staging/frontend-deployment.yaml
kubectl apply -f k8s/staging/services.yaml
kubectl apply -f k8s/staging/ingress.yaml

# Wait for rollout
echo "⏳ Waiting for rollout..."
kubectl rollout status deployment/backend -n $NAMESPACE
kubectl rollout status deployment/frontend -n $NAMESPACE

# Run health checks
echo "🏥 Running health checks..."
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

echo "✅ Staging deployment completed!"
echo "🌐 Application available at: https://staging.aigestion.net"
```

---

## 🏭 Production Deployment

### Production Configuration
```yaml
# k8s/production/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: aigestion-production
  labels:
    app: backend
    environment: production
    version: v2.0.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
        environment: production
        version: v2.0.0
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 2000
      containers:
      - name: backend
        image: gcr.io/aigestion/backend:prod-v2.0.0
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: aigestion-secrets
              key: database-url
        - name: MONGODB_URL
          valueFrom:
            secretKeyRef:
              name: aigestion-secrets
              key: mongodb-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: aigestion-secrets
              key: redis-url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: aigestion-secrets
              key: openai-api-key
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              name: aigestion-secrets
              key: anthropic-api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 60
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: tmp
          mountPath: /tmp
      volumes:
      - name: tmp
        emptyDir: {}
      nodeSelector:
        cloud.google.com/gke-nodepool: default-pool
      tolerations:
      - key: "workload"
        operator: "Equal"
        value: "production"
        effect: "NoSchedule"

---
# k8s/production/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: aigestion-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
```

### Blue-Green Deployment
```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

set -e

CURRENT_VERSION=$(kubectl get service backend-service -n aigestion-production -o jsonpath='{.spec.selector.version}')
NEW_VERSION="v2.0.1"

echo "🔄 Current version: $CURRENT_VERSION"
echo "🆕 New version: $NEW_VERSION"

# Deploy new version to green environment
echo "🚀 Deploying green environment..."
envsubst < k8s/production/backend-deployment.yaml | sed "s/version: $CURRENT_VERSION/version: $NEW_VERSION/g" | kubectl apply -f -

# Wait for green deployment
echo "⏳ Waiting for green deployment..."
kubectl rollout status deployment/backend -n aigestion-production --timeout=600s

# Health check green environment
echo "🏥 Health checking green environment..."
GREEN_POD=$(kubectl get pods -n aigestion-production -l version=$NEW_VERSION -o jsonpath='{.items[0].metadata.name}')
kubectl exec $GREEN_POD -n aigestion-production -- curl -f http://localhost:3000/health

# Switch traffic to green
echo "🔀 Switching traffic to green..."
kubectl patch service backend-service -n aigestion-production -p '{"spec":{"selector":{"version":"'$NEW_VERSION'"}}}'

# Wait for traffic switch
echo "⏳ Waiting for traffic switch..."
sleep 30

# Final health check
echo "🏥 Final health check..."
curl -f https://api.aigestion.net/health

# Clean up blue environment
echo "🧹 Cleaning up blue environment..."
kubectl delete deployment backend -n aigestion-production --ignore-not-found=true

echo "✅ Blue-green deployment completed successfully!"
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  PROJECT_ID: aigestion-production
  REGISTRY: gcr.io
  IMAGE_NAME: aigestion

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '22'
        cache: 'npm'

    - name: Install dependencies
      run: pnpm install

    - name: Run tests
      run: pnpm run test:full

    - name: Run security scan
      run: pnpm run security:scan

    - name: SonarQube analysis
      uses: sonarsource/sonarqube-scan-action@v2
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: 'read'
      id-token: 'write'

    steps:
    - uses: actions/checkout@v4

    - name: Authenticate to Google Cloud
      id: 'auth'
      uses: 'google-github-actions/auth@v1'
      with:
        token_format: 'access_token'
        workload_identity_provider: 'projects/123456789/locations/global/workloadIdentityPools/my-pool/providers/my-provider'
        service_account: 'deploy@aigestion-production.iam.gserviceaccount.com'

    - name: Login to Artifact Registry
      uses: 'google-github-actions/login@v1'
      with:
        token: '${{ steps.auth.outputs.access_token }}'

    - name: Build and push backend image
      run: |
        docker build -t ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/backend:${{ github.sha }} ./backend
        docker push ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/backend:${{ github.sha }}

    - name: Build and push frontend image
      run: |
        docker build -t ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/frontend:${{ github.sha }} ./frontend
        docker push ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/frontend:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production

    steps:
    - uses: actions/checkout@v4

    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'v1.28.0'

    - name: Configure kubectl
      run: |
        echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
        export KUBECONFIG=kubeconfig

    - name: Deploy to production
      run: |
        # Update image tags in deployment files
        sed -i "s|image: .*backend:.*|image: ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/backend:${{ github.sha }}|g" k8s/production/backend-deployment.yaml
        sed -i "s|image: .*frontend:.*|image: ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/frontend:${{ github.sha }}|g" k8s/production/frontend-deployment.yaml

        # Apply deployments
        kubectl apply -f k8s/production/

        # Wait for rollout
        kubectl rollout status deployment/backend -n aigestion-production --timeout=600s
        kubectl rollout status deployment/frontend -n aigestion-production --timeout=600s

    - name: Run smoke tests
      run: |
        # Wait for DNS propagation
        sleep 60

        # Run smoke tests
        curl -f https://api.aigestion.net/health
        curl -f https://aigestion.net/

        # Run integration tests
        pnpm run test:smoke

    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 📊 Monitoring

### Prometheus Configuration
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
      action: replace
      target_label: __metrics_path__
      regex: (.+)
    - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:$2
      target_label: __address__

  - job_name: 'aigestion-backend'
    static_configs:
    - targets: ['backend-service:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'aigestion-frontend'
    static_configs:
    - targets: ['frontend-service:80']
    metrics_path: '/metrics'
    scrape_interval: 10s

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - alertmanager:9093
```

### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "AIGestion Production Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m])",
            "legendFormat": "Error Rate"
          }
        ]
      }
    ]
  }
}
```

### Health Checks
```typescript
// backend/src/health.ts
import { Router } from 'express';
import { promClient } from './monitoring';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.query('SELECT 1');

    // Check Redis connection
    await redis.ping();

    // Check external services
    await checkExternalServices();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || 'unknown',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      metrics: promClient.register.metrics()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/ready', async (req, res) => {
  // Check if application is ready to serve traffic
  const isReady = await checkReadiness();

  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ready' : 'not ready',
    timestamp: new Date().toISOString()
  });
});

async function checkExternalServices() {
  // Check AI services
  await Promise.all([
    checkOpenAIConnection(),
    checkAnthropicConnection(),
    checkDatabaseConnection()
  ]);
}

export default router;
```

---

## 🔄 Rollback Procedures

### Manual Rollback
```bash
#!/bin/bash
# scripts/rollback.sh

set -e

PREVIOUS_VERSION=$1
NAMESPACE="aigestion-production"

if [ -z "$PREVIOUS_VERSION" ]; then
  echo "Usage: $0 <previous-version>"
  exit 1
fi

echo "🔄 Rolling back to version: $PREVIOUS_VERSION"

# Get current deployment
CURRENT_REPLICAS=$(kubectl get deployment backend -n $NAMESPACE -o jsonpath='{.spec.replicas}')
echo "Current replicas: $CURRENT_REPLICAS"

# Scale down current deployment
echo "⬇️ Scaling down current deployment..."
kubectl scale deployment backend -n $NAMESPACE --replicas=0

# Deploy previous version
echo "🚀 Deploying previous version..."
sed "s/version: .*/version: $PREVIOUS_VERSION/" k8s/production/backend-deployment.yaml | kubectl apply -f -

# Scale up previous version
echo "⬆️ Scaling up previous version..."
kubectl scale deployment backend -n $NAMESPACE --replicas=$CURRENT_REPLICAS

# Wait for rollout
echo "⏳ Waiting for rollout..."
kubectl rollout status deployment/backend -n $NAMESPACE --timeout=300s

# Health check
echo "🏥 Running health check..."
curl -f https://api.aigestion.net/health

echo "✅ Rollback completed successfully!"
```

### Automatic Rollback
```yaml
# k8s/production/rollback-webhook.yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: aigestion-rollback-webhook
webhooks:
- name: rollback.aigestion.net
  rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    operations: ["UPDATE"]
  clientConfig:
    service:
      name: rollback-service
      namespace: aigestion-production
      path: "/validate"
  admissionReviewVersions: ["v1", "v1beta1"]
  sideEffects: None
  failurePolicy: Fail
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Pod Crashes
```bash
# Check pod status
kubectl get pods -n aigestion-production

# Check pod logs
kubectl logs <pod-name> -n aigestion-production

# Check pod events
kubectl describe pod <pod-name> -n aigestion-production

# Debug pod
kubectl exec -it <pod-name> -n aigestion-production -- /bin/bash
```

#### 2. Service Issues
```bash
# Check service endpoints
kubectl get endpoints -n aigestion-production

# Test service connectivity
kubectl port-forward service/backend-service 3000:80 -n aigestion-production

# Check ingress
kubectl get ingress -n aigestion-production
kubectl describe ingress aigestion-ingress -n aigestion-production
```

#### 3. Database Issues
```bash
# Check database connection
kubectl exec -it <backend-pod> -n aigestion-production -- npm run db:test

# Check database logs
kubectl logs deployment/postgres -n aigestion-production

# Connect to database
kubectl exec -it postgres-0 -n aigestion-production -- psql -U postgres -d aigestion
```

#### 4. Performance Issues
```bash
# Check resource usage
kubectl top pods -n aigestion-production
kubectl top nodes

# Check HPA status
kubectl get hpa -n aigestion-production
kubectl describe hpa backend-hpa -n aigestion-production

# Check metrics
kubectl get --raw "/metrics" | grep http_requests
```

### Debug Commands
```bash
# Comprehensive health check
kubectl get pods,svc,deploy,rs,hpa -n aigestion-production

# Check all resources in namespace
kubectl api-resources --verbs=list --namespaced -o name | xargs -n 1 kubectl get -n aigestion-production

# Watch for changes
kubectl get pods -n aigestion-production --watch

# Port forward for local debugging
kubectl port-forward deployment/backend 3000:3000 -n aigestion-production
```

### Emergency Procedures
```bash
# Emergency shutdown
kubectl scale deployment backend --replicas=0 -n aigestion-production
kubectl scale deployment frontend --replicas=0 -n aigestion-production

# Emergency restart
kubectl rollout restart deployment/backend -n aigestion-production
kubectl rollout restart deployment/frontend -n aigestion-production

# Force delete stuck pods
kubectl delete pod <pod-name> -n aigestion-production --force --grace-period=0

# Clear stuck deployments
kubectl delete deployment backend -n aigestion-production --force --grace-period=0
```

---

## 📚 Additional Resources

### Documentation Links
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### Monitoring Tools
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [Kubernetes Dashboard](https://github.com/kubernetes/dashboard)

### Debugging Tools
- [kubectl cheat sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [stern (multi-pod logs)](https://github.com/wercker/stern)
- [k9s (kubectl TUI)](https://k9scli.io/)

---

*Last Updated: 2025-01-25*
*Deployment Guide Version: 2.0.0-GOLD*
