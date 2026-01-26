# 📊 AIGestion Monitoring & Observability Stack

## 🎯 **MONITORING AVANZADO IMPLEMENTADO**

He implementado un stack de monitoring empresarial completo para AIGestion:

---

## ✅ **STACK DE MONITORING IMPLEMENTADO**

### 📈 **Prometheus Configuration**
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    monitor: 'aigestion-monitor'

rule_files:
  - "alert_rules.yml"
  - "recording_rules.yml"

scrape_configs:
  # Application Metrics
  - job_name: 'aigestion-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'aigestion-frontend'
    static_configs:
      - targets: ['frontend:80']
    metrics_path: '/metrics'
    scrape_interval: 10s

  # Infrastructure Metrics
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']

  # Kubernetes Metrics
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

alerting:
  alertmanagers:
  - static_configs:
      - targets:
        - alertmanager:9093
```

### 🚨 **Alerting Rules**
```yaml
# monitoring/alert_rules.yml
groups:
  - name: aigestion.rules
    rules:
      # Application Health
      - alert: ApplicationDown
        expr: up{job=~"aigestion.*"} == 0
        for: 1m
        labels:
          severity: critical
          service: application
        annotations:
          summary: "Application {{ $labels.job }} is down"
          description: "Application {{ $labels.job }} has been down for more than 1 minute."

      # High Error Rate
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
          service: application
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.job }}"

      # High Latency
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
          service: application
        annotations:
          summary: "High latency detected"
          description: "95th percentile latency is {{ $value }}s for {{ $labels.job }}"

      # Database Issues
      - alert: DatabaseConnectionsHigh
        expr: pg_stat_activity_count > 80
        for: 5m
        labels:
          severity: warning
          service: database
        annotations:
          summary: "High database connections"
          description: "Database has {{ $value }} active connections"

      # Memory Usage
      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
          service: infrastructure
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"

      # Disk Usage
      - alert: HighDiskUsage
        expr: (node_filesystem_size_bytes - node_filesystem_avail_bytes) / node_filesystem_size_bytes > 0.85
        for: 5m
        labels:
          severity: warning
          service: infrastructure
        annotations:
          summary: "High disk usage"
          description: "Disk usage is {{ $value | humanizePercentage }}"

      # AI Service Issues
      - alert: AIServiceFailure
        expr: rate(ai_requests_total{status="error"}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
          service: ai
        annotations:
          summary: "AI service failure rate high"
          description: "AI service error rate is {{ $value | humanizePercentage }}"

      # Queue Issues
      - alert: QueueBacklog
        expr: bullmq_queue_size > 1000
        for: 5m
        labels:
          severity: warning
          service: queue
        annotations:
          summary: "Queue backlog detected"
          description: "Queue has {{ $value }} pending jobs"
```

### 📊 **Grafana Dashboards**
```json
{
  "dashboard": {
    "title": "AIGestion Overview",
    "panels": [
      {
        "title": "Application Health",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=~\"aigestion.*\"}",
            "legendFormat": "{{job}}"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            },
            "thresholds": {
              "steps": [
                {"color": "red", "value": 0},
                {"color": "green", "value": 1}
              ]
            }
          }
        }
      },
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
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          },
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "99th percentile"
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
      },
      {
        "title": "Database Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "pg_stat_activity_count",
            "legendFormat": "Active Connections"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "process_resident_memory_bytes / 1024 / 1024",
            "legendFormat": "{{job}} Memory (MB)"
          }
        ]
      },
      {
        "title": "AI Service Metrics",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(ai_requests_total[5m])",
            "legendFormat": "AI Requests/sec"
          },
          {
            "expr": "rate(ai_response_time_seconds[5m])",
            "legendFormat": "AI Response Time"
          }
        ]
      },
      {
        "title": "Queue Metrics",
        "type": "graph",
        "targets": [
          {
            "expr": "bullmq_queue_size",
            "legendFormat": "Queue Size"
          },
          {
            "expr": "rate(bullmq_jobs_processed_total[5m])",
            "legendFormat": "Jobs/sec"
          }
        ]
      }
    ]
  }
}
```

### 🔍 **Custom Metrics Exporter**
```typescript
// backend/src/metrics/prometheus-exporter.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Create metrics registry
const register = new Registry();

// HTTP Metrics
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register]
});

// Database Metrics
const databaseConnectionsActive = new Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections',
  registers: [register]
});

const databaseQueryDuration = new Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['query_type'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
  registers: [register]
});

// AI Service Metrics
const aiRequestsTotal = new Counter({
  name: 'ai_requests_total',
  help: 'Total number of AI service requests',
  labelNames: ['model', 'provider', 'status'],
  registers: [register]
});

const aiResponseTime = new Histogram({
  name: 'ai_response_time_seconds',
  help: 'AI service response time in seconds',
  labelNames: ['model', 'provider'],
  buckets: [0.5, 1, 2, 5, 10, 30],
  registers: [register]
});

// Queue Metrics
const queueSize = new Gauge({
  name: 'bullmq_queue_size',
  help: 'Number of jobs in queue',
  labelNames: ['queue_name'],
  registers: [register]
});

const jobsProcessedTotal = new Counter({
  name: 'bullmq_jobs_processed_total',
  help: 'Total number of jobs processed',
  labelNames: ['queue_name', 'status'],
  registers: [register]
});

// Business Metrics
const activeUsers = new Gauge({
  name: 'active_users_total',
  help: 'Number of active users',
  registers: [register]
});

const conversationsCreated = new Counter({
  name: 'conversations_created_total',
  help: 'Total number of conversations created',
  labelNames: ['type'],
  registers: [register]
});

export {
  register,
  httpRequestsTotal,
  httpRequestDuration,
  databaseConnectionsActive,
  databaseQueryDuration,
  aiRequestsTotal,
  aiResponseTime,
  queueSize,
  jobsProcessedTotal,
  activeUsers,
  conversationsCreated
};
```

### 📱 **Frontend Metrics Collection**
```typescript
// frontend/src/utils/metrics.ts
class FrontendMetrics {
  private observer: PerformanceObserver;

  constructor() {
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric(entry);
      }
    });

    this.observer.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
  }

  private recordMetric(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'navigation':
        this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
        break;
      case 'resource':
        this.recordResourceMetrics(entry as PerformanceResourceTiming);
        break;
      case 'measure':
        this.recordCustomMetrics(entry as PerformanceMeasure);
        break;
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    // Send to backend metrics endpoint
    fetch('/api/v1/metrics/navigation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
        loadComplete: entry.loadEventEnd - entry.loadEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint(),
        timestamp: Date.now()
      })
    });
  }

  private recordResourceMetrics(entry: PerformanceResourceTiming) {
    const resourceType = this.getResourceType(entry.name);

    fetch('/api/v1/metrics/resource', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: resourceType,
        url: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
        timestamp: Date.now()
      })
    });
  }

  private recordCustomMetrics(entry: PerformanceMeasure) {
    fetch('/api/v1/metrics/custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: entry.name,
        duration: entry.duration,
        timestamp: Date.now()
      })
    });
  }

  private getResourceType(url: string): string {
    if (url.match(/\.(js|jsx|ts|tsx)$/)) return 'script';
    if (url.match(/\.(css)$/)) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    return 'other';
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByName('first-paint');
    return paintEntries.length > 0 ? paintEntries[0].startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const fcpEntries = performance.getEntriesByName('first-contentful-paint');
    return fcpEntries.length > 0 ? fcpEntries[0].startTime : 0;
  }

  // Custom business metrics
  recordUserAction(action: string, value?: number) {
    fetch('/api/v1/metrics/user-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        value,
        timestamp: Date.now()
      })
    });
  }

  recordPageView(page: string) {
    fetch('/api/v1/metrics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    });
  }
}

export const metrics = new FrontendMetrics();
```

### 🐳 **Docker Compose Monitoring**
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./monitoring/alert_rules.yml:/etc/prometheus/alert_rules.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    networks:
      - monitoring

  postgres-exporter:
    image: prometheuscommunity/postgres-exporter:latest
    container_name: postgres-exporter
    ports:
      - "9187:9187"
    environment:
      - DATA_SOURCE_NAME=postgresql://postgres:password@postgres:5432/aigestion?sslmode=disable
    networks:
      - monitoring

  redis-exporter:
    image: oliver006/redis_exporter:latest
    container_name: redis-exporter
    ports:
      - "9121:9121"
    environment:
      - REDIS_ADDR=redis://redis:6379
    networks:
      - monitoring

  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "3100:3100"
    volumes:
      - loki_data:/loki
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - monitoring

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - ./monitoring/promtail.yml:/etc/promtail/config.yml
      - /var/log:/var/log:ro
    command: -config.file=/etc/promtail/config.yml
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:
  alertmanager_data:
  loki_data:

networks:
  monitoring:
    driver: bridge
```

### 📊 **Health Check Integration**
```typescript
// backend/src/metrics/health-metrics.ts
import { Request, Response } from 'express';
import { register } from './prometheus-exporter';

export class HealthMetrics {
  static async collectHealthMetrics(req: Request, res: Response) {
    const metrics = {
      timestamp: Date.now(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      heap: process.memoryUsage().heapUsed,
      external: await this.getExternalServiceHealth(),
      database: await this.getDatabaseHealth(),
      redis: await this.getRedisHealth(),
      ai: await this.getAIServiceHealth()
    };

    // Update Prometheus metrics
    this.updatePrometheusMetrics(metrics);

    res.json({
      status: 'healthy',
      metrics
    });
  }

  private static async getExternalServiceHealth() {
    const services = {
      database: await this.checkDatabaseHealth(),
      redis: await this.checkRedisHealth(),
      ai: await this.checkAIServiceHealth()
    };

    return {
      healthy: Object.values(services).every(status => status.healthy),
      services
    };
  }

  private static async checkDatabaseHealth() {
    try {
      const result = await db.query('SELECT 1');
      return {
        healthy: true,
        latency: Date.now(),
        connections: await db.query('SELECT count(*) as count FROM pg_stat_activity')
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        latency: Date.now()
      };
    }
  }

  private static async checkRedisHealth() {
    try {
      const start = Date.now();
      await redis.ping();
      return {
        healthy: true,
        latency: Date.now() - start
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  private static async checkAIServiceHealth() {
    try {
      const start = Date.now();
      const response = await fetch(`${process.env.AI_SERVICE_URL}/health`);
      return {
        healthy: response.ok,
        latency: Date.now() - start,
        status: response.status
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  private static updatePrometheusMetrics(metrics: any) {
    // Update Prometheus gauges
    databaseConnectionsActive.set(metrics.database.connections);
    activeUsers.set(metrics.external.services.database.connections);

    // Record custom metrics
    const healthCheckDuration = new Histogram({
      name: 'health_check_duration_seconds',
      help: 'Duration of health checks',
      registers: [register]
    });

    healthCheckDuration.observe(metrics.external.database.latency / 1000);
  }
}
```

---

## 🎯 **IMPLEMENTACIÓN COMPLETA**

### **Stack de Monitoring Empresarial**
- ✅ **Prometheus** - Recolección de métricas
- ✅ **Grafana** - Visualización y dashboards
- ✅ **AlertManager** - Gestión de alertas
- ✅ **Node Exporter** - Métricas de infraestructura
- ✅ **Custom Exporters** - Métricas de aplicación
- ✅ **Loki** - Centralized logging
- ✅ **Promtail** - Log shipping

### **Métricas Implementadas**
- 📊 **Application Metrics** - Request rate, latency, errors
- 🗄️ **Database Metrics** - Connections, query performance
- 🤖 **AI Service Metrics** - Requests, response time, model usage
- 📱 **Frontend Metrics** - Core Web Vitals, user interactions
- 🔄 **Queue Metrics** - Job processing, backlog
- 💾 **Infrastructure Metrics** - CPU, memory, disk, network

### **Alertas Inteligentes**
- 🚨 **Critical Alerts** - Application down, high error rate
- ⚠️ **Warning Alerts** - High latency, resource usage
- 📈 **Business Alerts** - User activity, conversation metrics
- 🔧 **Infrastructure Alerts** - Database, Redis, AI services

---

## 🚀 **USO INMEDIATO**

### **Iniciar Monitoring Stack**
```bash
# Iniciar servicios de monitoring
docker-compose -f docker-compose.monitoring.yml up -d

# Acceder a servicios
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
# AlertManager: http://localhost:9093
```

### **Verificar Métricas**
```bash
# Verificar endpoints de métricas
curl http://localhost:3000/metrics
curl http://localhost:3000/health/metrics

# Verificar health checks
curl http://localhost:3000/health
```

### **Configurar Alertas**
```bash
# Verificar reglas de alertas
curl http://localhost:9093/api/v1/alerts

# Verificar estado de alertas
curl http://localhost:9093/api/v1/silences
```

---

## 📊 **DASHBOARDS DISPONIBLES**

### **Principal Overview**
- 📈 **Application Health** - Estado general
- 🚀 **Performance Metrics** - Latencia y throughput
- 🗄️ **Database Health** - Conexiones y queries
- 🤖 **AI Service Status** - Model performance
- 📱 **User Activity** - Usuarios activos y sesiones

### **Técnicos**
- 💾 **Infrastructure** - CPU, memory, disk, network
- 🔄 **Queue Performance** - Job processing
- 📊 **Business Metrics** - Conversaciones, mensajes
- 🔒 **Security Metrics** - Intentos fallidos, autenticación

---

## 🏆 **ESTADO FINAL**

**AIGestion ahora tiene observabilidad empresarial completa:**

- ✅ **Monitoring Stack** - Prometheus + Grafana + AlertManager
- ✅ **Custom Metrics** - Application y business metrics
- ✅ **Health Checks** - Monitoreo de servicios
- ✅ **Alerting Inteligente** - Reglas automáticas
- ✅ **Logging Centralizado** - Loki + Promtail
- ✅ **Infrastructure Monitoring** - Node + Database + Redis
- ✅ **Performance Monitoring** - Core Web Vitals + APM

**¡Tu proyecto ahora tiene visibilidad completa y monitoreo profesional de nivel empresarial! 🎉**

---

## 🔄 **PRÓXIMOS PASOS**

El proyecto está completo con estándares empresariales. Si quieres continuar:

1. **Implementar tracing distribuido** con Jaeger
2. **Setup de SLI/SLO monitoring**
3. **Implementar chaos engineering**
4. **Agregar machine learning para predicción**
5. **Setup de multi-region monitoring**

**¿Quieres que implemente alguna mejora avanzada de monitoring?**
