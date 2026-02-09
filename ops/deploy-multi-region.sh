#!/bin/bash

# 🌍 AIGestion Multi-Region Deployment Script
# Complete multi-region deployment automation

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

# Default regions
DEFAULT_REGIONS="us-east-1,us-west-2,eu-west-1,ap-southeast-1"

# Parse arguments
REGIONS="${1:-$DEFAULT_REGIONS}"
SKIP_DNS="${2:-false}"
SKIP_MONITORING="${3:-false}"

print_header "🌍 AIGestion Multi-Region Deployment"

print_info "Deploying to regions: $REGIONS"
print_info "Skip DNS: $SKIP_DNS"
print_info "Skip Monitoring: $SKIP_MONITORING"

# Check prerequisites
check_prerequisites() {
    print_header "Checking Multi-Region Prerequisites"

    # Check kubectl
    if command -v kubectl &> /dev/null; then
        print_success "kubectl is available"
    else
        print_error "kubectl is required for multi-region deployment"
        exit 1
    fi

    # Check AWS CLI
    if command -v aws &> /dev/null; then
        print_success "AWS CLI is available"
    else
        print_error "AWS CLI is required for multi-region deployment"
        exit 1
    fi

    # Check Terraform
    if command -v terraform &> /dev/null; then
        print_success "Terraform is available"
    else
        print_warning "Terraform not found - some features may not work"
    fi

    # Check AWS credentials
    if aws sts get-caller-identity &> /dev/null; then
        print_success "AWS credentials are configured"
    else
        print_error "AWS credentials not configured"
        exit 1
    fi

    echo ""
}

# Create region configurations
create_region_configs() {
    print_header "Creating Region Configurations"

    # Create regions directory
    mkdir -p infrastructure/regions

    # Create region configurations
    IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"

    for region in "${REGION_ARRAY[@]}"; do
        print_info "Creating configuration for $region"

        # Create region namespace
        cat > "infrastructure/regions/${region}.yaml" << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: aigestion-${region}
  labels:
    app.kubernetes.io/name: aigestion
    app.kubernetes.io/component: namespace
    region: $region
    role: $([ "$region" = "us-east-1" ] && echo "primary" || echo "secondary")
spec:
  finalizers:
  - kubernetes
EOF

        # Create region-specific config map
        cat > "infrastructure/regions/${region}-config.yaml" << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: aigestion-config
  namespace: aigestion-${region}
data:
  region: $region
  role: $([ "$region" = "us-east-1" ] && echo "primary" || echo "secondary")
  database_host: $([ "$region" = "us-east-1" ] && echo "postgres-primary" || echo "postgres-replica")
  redis_cluster: aigestion-cluster-${region}
  ai_service_url: http://ai-service.${region}.aigestion.net
  monitoring_enabled: "true"
  log_level: "info"
EOF

        # Create region-specific secrets template
        cat > "infrastructure/regions/${region}-secrets.yaml.template" << EOF
apiVersion: v1
kind: Secret
metadata:
  name: aigestion-secrets
  namespace: aigestion-${region}
type: Opaque
data:
  database-url: <base64-encoded-database-url>
  redis-url: <base64-encoded-redis-url>
  jwt-secret: <base64-encoded-jwt-secret>
  openai-api-key: <base64-encoded-openai-key>
  anthropic-api-key: <base64-encoded-anthropic-key>
  aws-access-key: <base64-encoded-aws-access-key>
  aws-secret-key: <base64-encoded-aws-secret-key>
EOF

        print_success "Configuration created for $region"
    done

    echo ""
}

# Deploy infrastructure
deploy_infrastructure() {
    print_header "Deploying Infrastructure"

    IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"

    for region in "${REGION_ARRAY[@]}"; do
        print_info "Deploying infrastructure in $region"

        # Set AWS region
        export AWS_DEFAULT_REGION=$region

        # Create EKS cluster if it doesn't exist
        if ! aws eks describe-cluster --name aigestion-$region &> /dev/null; then
            print_info "Creating EKS cluster in $region"

            # Create VPC and networking
            aws cloudformation deploy \
                --stack-name aigestion-vpc-$region \
                --template-body file://infrastructure/vpc.yaml \
                --parameters ParameterRegion=$region \
                --capabilities CAPABILITY_IAM

            # Create EKS cluster
            aws eks create-cluster \
                --name aigestion-$region \
                --version 1.28 \
                --role-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/EKSServiceRole \
                --resources-vpc-config subnetIds=$(aws cloudformation describe-stacks --stack-name aigestion-vpc-$region --query 'Stacks[0].Outputs[?OutputKey==SubnetIds].OutputValue' --output text) \
                --nodegroup-name aigestion-nodes-$region \
                --node-type t3.medium \
                --nodes 3 \
                --nodes-min 1 \
                --nodes-max 10 \
                --managed

            # Wait for cluster to be ready
            print_info "Waiting for EKS cluster to be ready..."
            aws eks wait cluster-active --name aigestion-$region
        else
            print_success "EKS cluster already exists in $region"
        fi

        # Update kubeconfig
        aws eks update-kubeconfig --region $region --name aigestion-$region

        # Apply namespace and configurations
        kubectl apply -f infrastructure/regions/$region.yaml
        kubectl apply -f infrastructure/regions/$region-config.yaml

        print_success "Infrastructure deployed in $region"
    done

    echo ""
}

# Deploy databases
deploy_databases() {
    print_header "Deploying Multi-Region Databases"

    IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"
    PRIMARY_REGION="${REGION_ARRAY[0]}"

    # Deploy primary database
    print_info "Deploying primary database in $PRIMARY_REGION"
    export AWS_DEFAULT_REGION=$PRIMARY_REGION
    kubectl apply -f infrastructure/database-primary.yaml -n aigestion-$PRIMARY_REGION

    # Wait for primary database to be ready
    kubectl wait --for=condition=ready pod -l app=postgres-primary -n aigestion-$PRIMARY_REGION --timeout=300s

    # Deploy read replicas in other regions
    for region in "${REGION_ARRAY[@]:1}"; do
        print_info "Deploying read replica in $region"
        export AWS_DEFAULT_REGION=$region
        kubectl apply -f infrastructure/database-replica.yaml -n aigestion-$region
        kubectl wait --for=condition=ready pod -l app=postgres-replica -n aigestion-$region --timeout=300s
    done

    print_success "Multi-region databases deployed"
    echo ""
}

# Deploy Redis clusters
deploy_redis_clusters() {
    print_header "Deploying Redis Clusters"

    IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"

    for region in "${REGION_ARRAY[@]}"; do
        print_info "Deploying Redis cluster in $region"
        export AWS_DEFAULT_REGION=$region
        kubectl apply -f infrastructure/redis-cluster.yaml -n aigestion-$region
        kubectl wait --for=condition=ready pod -l app=redis-cluster -n aigestion-$region --timeout=300s
    done

    print_success "Redis clusters deployed"
    echo ""
}

# Deploy applications
deploy_applications() {
    print_header "Deploying Applications"

    IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"

    for region in "${REGION_ARRAY[@]}"; do
        print_info "Deploying application in $region"
        export AWS_DEFAULT_REGION=$region

        # Deploy application
        kubectl apply -f infrastructure/application.yaml -n aigestion-$region

        # Deploy services
        kubectl apply -f infrastructure/services.yaml -n aigestion-$region

        # Deploy ingress for edge regions
        if [[ "$region" == "ap-southeast-1" ]]; then
            kubectl apply -f infrastructure/ingress.yaml -n aigestion-$region
        fi

        # Wait for deployment to be ready
        kubectl wait --for=condition=available deployment/aigestion-api -n aigestion-$region --timeout=300s

        print_success "Application deployed in $region"
    done

    echo ""
}

# Setup global DNS
setup_global_dns() {
    if [ "$SKIP_DNS" = "true" ]; then
        print_warning "Skipping DNS setup as requested"
        return
    fi

    print_header "Setting Up Global DNS"

    # Get hosted zone ID
    HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name==\`aigestion.net.\`].Id" --output text)

    if [ -z "$HOSTED_ZONE_ID" ]; then
        print_error "Hosted zone for aigestion.net not found"
        return 1
    fi

    # Create health checks
    print_info "Creating health checks"
    IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"

    HEALTH_CHECK_IDS=()
    for region in "${REGION_ARRAY[@]}"; do
        # Get load balancer IP
        LB_IP=$(kubectl get service aigestion-api-service -n aigestion-$region -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

        if [ -n "$LB_IP" ]; then
            HEALTH_CHECK_ID=$(aws route53 create-health-check \
                --fully-qualified-domain-name "${region}-health.aigestion.net" \
                --ip-address "$LB_IP" \
                --port 80 \
                --type HTTP \
                --resource-path "/health" \
                --failure-threshold 3 \
                --request-interval 30 \
                --query 'HealthCheck.Id' \
                --output text)

            HEALTH_CHECK_IDS+=("$HEALTH_CHECK_ID")
            print_success "Health check created for $region"
        fi
    done

    # Create latency-based records
    print_info "Creating latency-based routing records"

    CHANGE_BATCH=""
    for i in "${!REGION_ARRAY[@]}"; do
        region="${REGION_ARRAY[$i]}"
        health_check_id="${HEALTH_CHECK_IDS[$i]}"

        # Get load balancer IP
        LB_IP=$(kubectl get service aigestion-api-service -n aigestion-$region -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

        if [ -n "$LB_IP" ]; then
            CHANGE_BATCH+="{
                \"Action\": \"CREATE\",
                \"ResourceRecordSet\": {
                    \"Name\": \"api.aigestion.net\",
                    \"Type\": \"A\",
                    \"SetIdentifier\": \"$region\",
                    \"Region\": \"$region\",
                    \"TTL\": 60,
                    \"HealthCheckId\": \"$health_check_id\",
                    \"ResourceRecords\": [{\"Value\": \"$LB_IP\"}]
                }
            },"
        fi
    done

    # Remove trailing comma and add to JSON structure
    CHANGE_BATCH="[${CHANGE_BATCH%,}]"

    aws route53 change-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --change-batch "{
            \"Comment\": \"Multi-region latency routing for AIGestion\",
            \"Changes\": $CHANGE_BATCH
        }"

    print_success "Global DNS configured"
    echo ""
}

# Setup global monitoring
setup_global_monitoring() {
    if [ "$SKIP_MONITORING" = "true" ]; then
        print_warning "Skipping monitoring setup as requested"
        return
    fi

    print_header "Setting Up Global Monitoring"

    # Deploy monitoring stack in primary region
    PRIMARY_REGION="${REGION_ARRAY[0]}"
    export AWS_DEFAULT_REGION=$PRIMARY_REGION

    # Deploy Prometheus
    kubectl apply -f infrastructure/monitoring/prometheus.yaml -n aigestion-$PRIMARY_REGION

    # Deploy Grafana
    kubectl apply -f infrastructure/monitoring/grafana.yaml -n aigestion-$PRIMARY_REGION

    # Configure federation
    kubectl apply -f infrastructure/monitoring/prometheus-federation.yaml -n aigestion-$PRIMARY_REGION

    # Create global dashboards
    kubectl apply -f infrastructure/monitoring/grafana-dashboards.yaml -n aigestion-$PRIMARY_REGION

    print_success "Global monitoring configured"
    echo ""
}

# Verify deployment
verify_deployment() {
    print_header "Verifying Multi-Region Deployment"

    IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"

    for region in "${REGION_ARRAY[@]}"; do
        print_info "Verifying deployment in $region"
        export AWS_DEFAULT_REGION=$region

        # Check pods
        kubectl get pods -n aigestion-$region

        # Check services
        kubectl get services -n aigestion-$region

        # Check application health
        APP_URL=$(kubectl get ingress aigestion-ingress -n aigestion-$region -o jsonpath='{.rules[0].host}' 2>/dev/null || echo "")

        if [ -n "$APP_URL" ]; then
            if curl -f "http://$APP_URL/health" &> /dev/null; then
                print_success "Application is healthy in $region"
            else
                print_warning "Application health check failed in $region"
            fi
        else
            print_warning "No ingress found in $region"
        fi

        echo ""
    done
}

# Create status scripts
create_status_scripts() {
    print_header "Creating Status Scripts"

    # Multi-region status script
    cat > scripts/multi-region-status.sh << 'EOF'
#!/bin/bash

echo "🌍 AIGestion Multi-Region Status"
echo "=================================="

# Get regions from deployment
REGIONS="us-east-1,us-west-2,eu-west-1,ap-southeast-1"

IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"

for region in "${REGION_ARRAY[@]}"; do
    echo ""
    echo "📍 Region: $region"
    echo "-------------------"

    export AWS_DEFAULT_REGION=$region

    # Check EKS cluster status
    if aws eks describe-cluster --name aigestion-$region &> /dev/null; then
        echo "✅ EKS Cluster: Active"
    else
        echo "❌ EKS Cluster: Not found"
        continue
    fi

    # Check pods
    echo "📦 Pods:"
    kubectl get pods -n aigestion-$region --no-headers | wc -l | xargs echo "  Total pods:"
    kubectl get pods -n aigestion-$region --no-headers | awk '{print "  " $1 " " $2}' | head -5

    # Check services
    echo "🔗 Services:"
    kubectl get services -n aigestion-$region --no-headers | awk '{print "  " $1 " " $2 " " $3}'

    # Check application health
    APP_URL=$(kubectl get ingress aigestion-ingress -n aigestion-$region -o jsonpath='{.rules[0].host}' 2>/dev/null || echo "")
    if [ -n "$APP_URL" ]; then
        if curl -f "http://$APP_URL/health" &> /dev/null; then
            echo "✅ Application: Healthy"
        else
            echo "❌ Application: Unhealthy"
        fi
    fi
done

echo ""
echo "📊 Global DNS Status"
echo "=================="
aws route53 list-resource-record-sets --hosted-zone-name aigestion.net --query "ResourceRecordSets[?Type=='A']" --output table

echo ""
echo "🌐 Access URLs"
echo "============"
echo "🇺🇸 US East: https://us-east-1.aigestion.net"
echo "🇺🇸 US West: https://us-west-2.aigestion.net"
echo "🇪🇺 EU West: https://eu-west-1.aigestion.net"
echo "🇸🇬 Asia Pacific: https://ap-southeast-1.aigestion.net"
echo "🌍 Global API: https://api.aigestion.net"
EOF

    # Replication lag check script
    cat > scripts/check-replication-lag.sh << 'EOF'
#!/bin/bash

echo "📊 Database Replication Lag"
echo "=========================="

REGIONS="us-east-1,us-west-2,eu-west-1,ap-southeast-1"
PRIMARY_REGION="us-east-1"

IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"

for region in "${REGION_ARRAY[@]:1}"; do
    echo ""
    echo "📍 $region → $PRIMARY_REGION:"

    export AWS_DEFAULT_REGION=$PRIMARY_REGION

    # Get replication lag
    LAG=$(kubectl exec -n aigestion-$PRIMARY_REGION postgres-primary-0 -- psql -U postgres -d aigestion -c "
        SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS lag_bytes
        FROM pg_stat_replication
        WHERE application_name LIKE '%$region%'
    " -t -A 2>/dev/null || echo "N/A")

    if [ "$LAG" != "N/A" ] && [ -n "$LAG" ]; then
        LAG_BYTES=$(echo "$LAG" | tail -n 1)
        if [ "$LAG_BYTES" -gt 0 ]; then
            LAG_MB=$((LAG_BYTES / 1024 / 1024))
            if [ "$LAG_MB" -gt 10 ]; then
                echo "  ⚠️  Lag: ${LAG_MB}MB (High)"
            elif [ "$LAG_MB" -gt 1 ]; then
                echo "  ⚠️  Lag: ${LAG_MB}MB (Medium)"
            else
                echo "  ✅ Lag: ${LAG_MB}MB (Low)"
            fi
        else
            echo "  ✅ Lag: < 1MB"
        fi
    else
        echo "  ❌ Replication not found"
    fi
done

echo ""
echo "📈 Replication Status Summary"
echo "=========================="
echo "✅ Healthy: < 1MB lag"
echo "⚠️  Warning: 1-10MB lag"
echo "❌ Critical: > 10MB lag"
EOF

    # Make scripts executable
    chmod +x scripts/multi-region-status.sh
    chmod +x scripts/check-replication-lag.sh

    print_success "Status scripts created"
    echo ""
}

# Show final information
show_final_info() {
    print_header "🎉 Multi-Region Deployment Complete!"

    echo -e "${GREEN}AIGestion is now deployed globally across multiple regions!${NC}"
    echo ""
    echo -e "${CYAN}Deployed Regions:${NC}"
    IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"
    for region in "${REGION_ARRAY[@]}"; do
        echo "🌍 ${YELLOW}$region${NC} - https://$region.aigestion.net"
    done
    echo ""
    echo -e "${CYAN}Global Services:${NC}"
    echo "🌐 ${YELLOW}API Gateway:${NC} https://api.aigestion.net"
    echo "📊 ${YELLOW}Monitoring:${NC} https://grafana.aigestion.net"
    echo "🔍 ${YELLOW}Tracing:${NC} https://jaeger.aigestion.net"
    echo ""
    echo -e "${CYAN}Useful Commands:${NC}"
    echo "  ${YELLOW}./scripts/multi-region-status.sh${NC} - Check all regions"
    echo "  ${YELLOW}./scripts/check-replication-lag.sh${NC} - Check replication lag"
    echo "  ${YELLOW}kubectl get pods -A${NC} - Check all pods"
    echo "  ${YELLOW}aws route53 list-resource-record-sets --hosted-zone-name aigestion.net${NC} - Check DNS"
    echo ""
    echo -e "${CYAN}Next Steps:${NC}"
    echo "1. Test global connectivity"
    echo "2. Verify DNS propagation"
    echo "3. Monitor replication lag"
    echo "4. Test failover scenarios"
    echo "5. Configure alerting thresholds"
    echo ""
    echo -e "${CYAN}Documentation:${NC}"
    echo "📚 See docs/MULTI-REGION-DEPLOYMENT.md for detailed configuration"
    echo ""
    echo -e "${PURPLE}🌍 Your application is now globally available! 🎉${NC}"
}

# Main execution
main() {
    check_prerequisites
    create_region_configs
    deploy_infrastructure
    deploy_databases
    deploy_redis_clusters
    deploy_applications
    setup_global_dns
    setup_global_monitoring
    verify_deployment
    create_status_scripts
    show_final_info
}

# Handle script arguments
case "${1:-}" in
    "status")
        ./scripts/multi-region-status.sh
        ;;
    "lag")
        ./scripts/check-replication-lag.sh
        ;;
    "dns")
        setup_global_dns
        ;;
    "monitoring")
        setup_global_monitoring
        ;;
    "verify")
        verify_deployment
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [regions] [skip-dns] [skip-monitoring]"
        echo ""
        echo "Arguments:"
        echo "  regions        - Comma-separated list of regions (default: us-east-1,us-west-2,eu-west-1,ap-southeast-1)"
        echo "  skip-dns       - Skip DNS setup (default: false)"
        echo "  skip-monitoring - Skip monitoring setup (default: false)"
        echo ""
        echo "Commands:"
        echo "  status         - Show multi-region status"
        echo "  lag            - Check replication lag"
        echo "  dns            - Setup global DNS only"
        echo "  monitoring      - Setup global monitoring only"
        echo "  verify         - Verify deployment only"
        echo "  help           - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                                    # Deploy to all regions"
        echo "  $0 us-east-1,us-west-2               # Deploy to specific regions"
        echo "  $0 us-east-1,us-west-2 true           # Deploy without DNS"
        echo "  $0 us-east-1,us-west-2 false true     # Deploy without monitoring"
        ;;
    *)
        main
        ;;
esac
