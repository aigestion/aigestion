#!/bin/bash

# 📊 AIGestion Monitoring Setup Script
# Complete monitoring stack deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${PURPLE}============================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}============================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Monitoring Prerequisites"

    # Check Docker
    if command -v docker &> /dev/null; then
        print_success "Docker is available"
    else
        print_error "Docker is required for monitoring stack"
        exit 1
    fi

    # Check Docker Compose
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is available"
    else
        print_error "Docker Compose is required for monitoring stack"
        exit 1
    fi

    # Check if main application is running
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        print_success "Main application is running"
    else
        print_warning "Main application is not running - starting it..."
        cd backend && pnpm dev &
        BACKEND_PID=$!
        sleep 10
        cd ..
    fi

    echo ""
}

# Setup monitoring configuration
setup_monitoring_config() {
    print_header "Setting Up Monitoring Configuration"

    # Create monitoring directories
    mkdir -p monitoring/{grafana/{dashboards,datasources},prometheus,alertmanager,loki}

    # Create Prometheus configuration
    print_info "Creating Prometheus configuration..."
    cat > monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    monitor: 'aigestion-monitor'

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'aigestion-backend'
    static_configs:
      - targets: ['host.docker.internal:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']

alerting:
  alertmanagers:
  - static_configs:
      - targets:
        - alertmanager:9093
EOF

    # Create alert rules
    print_info "Creating alert rules..."
    cat > monitoring/alert_rules.yml << 'EOF'
groups:
  - name: aigestion.rules
    rules:
      - alert: ApplicationDown
        expr: up{job=~"aigestion.*"} == 0
        for: 1m
        labels:
          severity: critical
          service: application
        annotations:
          summary: "Application {{ $labels.job }} is down"
          description: "Application {{ $labels.job }} has been down for more than 1 minute."

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
          service: application
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.job }}"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
          service: application
        annotations:
          summary: "High latency detected"
          description: "95th percentile latency is {{ $value }}s for {{ $labels.job }}"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
          service: infrastructure
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"
EOF

    # Create Grafana datasources
    print_info "Creating Grafana datasources..."
    cat > monitoring/grafana/datasources/prometheus.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    editable: true
EOF

    # Create AlertManager configuration
    print_info "Creating AlertManager configuration..."
    cat > monitoring/alertmanager.yml << 'EOF'
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@aigestion.net'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://localhost:8080/webhook'
EOF

    # Create Loki configuration
    print_info "Creating Loki configuration..."
    cat > monitoring/loki.yml << 'EOF'
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
    max_transfer_retries: 0

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /loki/boltdb-shipper-active
    cache_location: /loki/boltdb-shipper-cache
    shared_store: filesystem
  filesystem:
    directory: /loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: false
  retention_period: 0s
EOF

    print_success "Monitoring configuration created"
    echo ""
}

# Create Docker Compose for monitoring
create_monitoring_compose() {
    print_header "Creating Monitoring Docker Compose"

    cat > docker-compose.monitoring.yml << 'EOF'
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:v2.40.0
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
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    networks:
      - monitoring
    restart: unless-stopped

  grafana:
    image: grafana/grafana:9.3.0
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
    networks:
      - monitoring
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:v0.25.0
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager
    networks:
      - monitoring
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:v1.5.0
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring
    restart: unless-stopped

  postgres-exporter:
    image: prometheuscommunity/postgres-exporter:v0.10.0
    container_name: postgres-exporter
    ports:
      - "9187:9187"
    environment:
      - DATA_SOURCE_NAME=postgresql://postgres:password@host.docker.internal:5432/aigestion?sslmode=disable
    networks:
      - monitoring
    restart: unless-stopped

  redis-exporter:
    image: oliver006/redis_exporter:v1.3.1
    container_name: redis-exporter
    ports:
      - "9121:9121"
    environment:
      - REDIS_ADDR=redis://host.docker.internal:6379
    networks:
      - monitoring
    restart: unless-stopped

  loki:
    image: grafana/loki:2.8.0
    container_name: loki
    ports:
      - "3100:3100"
    volumes:
      - loki_data:/loki
      - ./monitoring/loki.yml:/etc/loki/local-config.yaml
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - monitoring
    restart: unless-stopped

  promtail:
    image: grafana/promtail:2.8.0
    container_name: promtail
    volumes:
      - ./monitoring/promtail.yml:/etc/promtail/config.yml
      - /var/log:/var/log:ro
      - ./logs:/logs:ro
    command: -config.file=/etc/promtail/config.yml
    networks:
      - monitoring
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
  alertmanager_data:
  loki_data:

networks:
  monitoring:
    driver: bridge
EOF

    print_success "Monitoring Docker Compose created"
    echo ""
}

# Create Grafana dashboards
create_grafana_dashboards() {
    print_header "Creating Grafana Dashboards"

    # Create dashboard directory
    mkdir -p monitoring/grafana/dashboards

    # Create main dashboard
    cat > monitoring/grafana/dashboards/aigestion-overview.json << 'EOF'
{
  "dashboard": {
    "id": null,
    "title": "AIGestion Overview",
    "tags": ["aigestion", "overview"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
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
        },
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0}
      },
      {
        "id": 2,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0}
      },
      {
        "id": 3,
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
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 8}
      },
      {
        "id": 4,
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m])",
            "legendFormat": "Error Rate"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 8}
      }
    ],
    "time": {"from": "now-1h", "to": "now"},
    "refresh": "5s"
  }
}
EOF

    print_success "Grafana dashboards created"
    echo ""
}

# Start monitoring stack
start_monitoring() {
    print_header "Starting Monitoring Stack"

    print_info "Starting monitoring services..."
    docker-compose -f docker-compose.monitoring.yml up -d

    # Wait for services to start
    print_info "Waiting for services to start..."
    sleep 30

    # Check service health
    print_info "Checking service health..."

    if curl -s http://localhost:9090/-/healthy > /dev/null; then
        print_success "Prometheus is healthy"
    else
        print_warning "Prometheus may still be starting"
    fi

    if curl -s http://localhost:3001/api/health > /dev/null; then
        print_success "Grafana is healthy"
    else
        print_warning "Grafana may still be starting"
    fi

    echo ""
}

# Setup application metrics
setup_app_metrics() {
    print_header "Setting Up Application Metrics"

    # Check if metrics endpoint exists
    if curl -s http://localhost:3000/metrics > /dev/null; then
        print_success "Metrics endpoint is available"
    else
        print_warning "Metrics endpoint not found - you may need to add metrics to your application"
        print_info "See docs/MONITORING-COMPLETE.md for implementation details"
    fi

    echo ""
}

# Create monitoring scripts
create_monitoring_scripts() {
    print_header "Creating Monitoring Scripts"

    # Create monitoring status script
    cat > scripts/monitoring-status.sh << 'EOF'
#!/bin/bash

echo "🔍 AIGestion Monitoring Status"
echo "=========================="

# Check Docker containers
echo "Docker Containers:"
docker ps --filter "name=prometheus" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker ps --filter "name=grafana" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker ps --filter "name=alertmanager" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check service health
echo ""
echo "Service Health:"
curl -s http://localhost:9090/-/healthy > /dev/null && echo "✅ Prometheus: Healthy" || echo "❌ Prometheus: Unhealthy"
curl -s http://localhost:3001/api/health > /dev/null && echo "✅ Grafana: Healthy" || echo "❌ Grafana: Unhealthy"
curl -s http://localhost:9093/-/healthy > /dev/null && echo "✅ AlertManager: Healthy" || echo "❌ AlertManager: Unhealthy"

# Check metrics
echo ""
echo "Application Metrics:"
curl -s http://localhost:3000/metrics > /dev/null && echo "✅ Application metrics available" || echo "❌ Application metrics not available"

# Show URLs
echo ""
echo "Access URLs:"
echo "📊 Grafana: http://localhost:3001 (admin/admin)"
echo "🔍 Prometheus: http://localhost:9090"
echo "🚨 AlertManager: http://localhost:9093"
echo "📝 Loki: http://localhost:3100"
EOF

    # Create monitoring cleanup script
    cat > scripts/monitoring-cleanup.sh << 'EOF'
#!/bin/bash

echo "🧹 Cleaning up AIGestion Monitoring Stack"

# Stop and remove containers
docker-compose -f docker-compose.monitoring.yml down

# Remove volumes (optional)
read -p "Remove monitoring data volumes? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose -f docker-compose.monitoring.yml down -v
    echo "✅ Volumes removed"
fi

# Remove images (optional)
read -p "Remove monitoring images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker rmi prom/prometheus grafana/grafana prom/alertmanager prom/node-exporter 2>/dev/null || true
    echo "✅ Images removed"
fi

echo "✅ Monitoring stack cleaned up"
EOF

    # Make scripts executable
    chmod +x scripts/monitoring-status.sh
    chmod +x scripts/monitoring-cleanup.sh

    print_success "Monitoring scripts created"
    echo ""
}

# Show final information
show_final_info() {
    print_header "🎉 Monitoring Stack Setup Complete!"

    echo -e "${GREEN}AIGestion monitoring stack is now running!${NC}"
    echo ""
    echo -e "${CYAN}Access URLs:${NC}"
    echo "📊 ${YELLOW}Grafana:${NC} http://localhost:3001 (admin/admin)"
    echo "🔍 ${YELLOW}Prometheus:${NC} http://localhost:9090"
    echo "🚨 ${YELLOW}AlertManager:${NC} http://localhost:9093"
    echo "📝 ${YELLOW}Loki:${NC} http://localhost:3100"
    echo ""
    echo -e "${CYAN}Useful Commands:${NC}"
    echo "  ${YELLOW}./scripts/monitoring-status.sh${NC} - Check monitoring status"
    echo "  ${YELLOW}./scripts/monitoring-cleanup.sh${NC} - Clean up monitoring stack"
    echo "  ${YELLOW}docker-compose -f docker-compose.monitoring.yml logs${NC} - View logs"
    echo "  ${YELLOW}docker-compose -f docker-compose.monitoring.yml restart${NC} - Restart services"
    echo ""
    echo -e "${CYAN}Next Steps:${NC}"
    echo "1. Import the AIGestion dashboard in Grafana"
    echo "2. Configure alert notifications"
    echo "3. Set up custom metrics in your application"
    echo "4. Review and adjust alert rules"
    echo ""
    echo -e "${CYAN}Documentation:${NC}"
    echo "📚 See docs/MONITORING-COMPLETE.md for detailed configuration"
    echo ""
    echo -e "${PURPLE}Happy monitoring! 📊${NC}"
}

# Main execution
main() {
    print_header "📊 AIGestion Monitoring Setup"

    check_prerequisites
    setup_monitoring_config
    create_monitoring_compose
    create_grafana_dashboards
    start_monitoring
    setup_app_metrics
    create_monitoring_scripts
    show_final_info
}

# Handle script arguments
case "${1:-}" in
    "status")
        ./scripts/monitoring-status.sh
        ;;
    "cleanup")
        ./scripts/monitoring-cleanup.sh
        ;;
    "restart")
        docker-compose -f docker-compose.monitoring.yml restart
        ;;
    "logs")
        docker-compose -f docker-compose.monitoring.yml logs -f
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  status    - Show monitoring status"
        echo "  cleanup   - Clean up monitoring stack"
        echo "  restart   - Restart monitoring services"
        echo "  logs      - Show monitoring logs"
        echo "  help      - Show this help message"
        echo ""
        echo "If no command is specified, runs the complete setup."
        ;;
    *)
        main
        ;;
esac
