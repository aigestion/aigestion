#!/bin/bash

# 🌍 AIGestion Multi-Region Status Script
# Check status of multi-region deployment

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

# Get regions from environment or use default
REGIONS="${1:-$DEFAULT_REGIONS}"

print_header "🌍 AIGestion Multi-Region Status"

print_info "Checking regions: $REGIONS"

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI not found. Please install AWS CLI and configure credentials."
    exit 1
fi

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl not found. Please install kubectl."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure'."
    exit 1
fi

print_success "Prerequisites checked"

# Function to check EKS cluster status
check_eks_cluster() {
    local region=$1
    local cluster_name="aigestion-$region"

    print_info "Checking EKS cluster in $region"

    if aws eks describe-cluster --name "$cluster_name" --region "$region" &> /dev/null; then
        local status=$(aws eks describe-cluster --name "$cluster_name" --region "$region" --query 'cluster.status' --output text 2>/dev/null || echo "UNKNOWN")
        print_success "EKS Cluster $cluster_name: $status"

        # Update kubeconfig
        aws eks update-kubeconfig --region "$region" --name "$cluster_name" &> /dev/null
        return 0
    else
        print_error "EKS Cluster $cluster_name: Not found"
        return 1
    fi
}

# Function to check pods in a region
check_pods() {
    local region=$1
    local namespace="aigestion-$region"

    print_info "Checking pods in $region"

    if kubectl get namespace "$namespace" &> /dev/null; then
        local pod_count=$(kubectl get pods -n "$namespace" --no-headers 2>/dev/null | wc -l)
        local running_pods=$(kubectl get pods -n "$namespace" --field-selector=status.phase=Running --no-headers 2>/dev/null | wc -l)

        echo "  Total pods: $pod_count"
        echo "  Running pods: $running_pods"

        # Show pod details
        kubectl get pods -n "$namespace" --no-headers 2>/dev/null | head -5 | while read -r line; do
            echo "  $line"
        done
    else
        print_warning "Namespace $namespace not found"
    fi
}

# Function to check services
check_services() {
    local region=$1
    local namespace="aigestion-$region"

    print_info "Checking services in $region"

    if kubectl get namespace "$namespace" &> /dev/null; then
        kubectl get services -n "$namespace" --no-headers 2>/dev/null | while read -r line; do
            echo "  $line"
        done
    else
        print_warning "Namespace $namespace not found"
    fi
}

# Function to check application health
check_app_health() {
    local region=$1
    local namespace="aigestion-$region"

    print_info "Checking application health in $region"

    # Try to get ingress URL
    local app_url=$(kubectl get ingress aigestion-ingress -n "$namespace" -o jsonpath='{.rules[0].host}' 2>/dev/null || echo "")

    if [ -n "$app_url" ]; then
        # Try to access health endpoint
        if curl -f "http://$app_url/health" &> /dev/null; then
            print_success "Application: Healthy (http://$app_url)"
        else
            print_error "Application: Unhealthy (http://$app_url)"
        fi
    else
        print_warning "No ingress found in $region"
    fi
}

# Function to check database status
check_database() {
    local region=$1
    local namespace="aigestion-$region"

    print_info "Checking database in $region"

    if kubectl get pods -n "$namespace" -l app=postgres-primary &> /dev/null; then
        local db_status=$(kubectl get pods -n "$namespace" -l app=postgres-primary -o jsonpath='{.items[0].status.phase}' 2>/dev/null || echo "Unknown")
        echo "  Database: $db_status"

        # Check database connections
        if [ "$db_status" = "Running" ]; then
            local connections=$(kubectl exec -n "$namespace" postgres-primary-0 -- psql -U postgres -d aigestion -c "SELECT count(*) as connections FROM pg_stat_activity;" -t -A 2>/dev/null | tail -n 1 || echo "N/A")
            echo "  Connections: $connections"
        fi
    else
        print_warning "Database pod not found in $region"
    fi
}

# Function to check Redis status
check_redis() {
    local region=$1
    local namespace="aigestion-$region"

    print_info "Checking Redis in $region"

    if kubectl get pods -n "$namespace" -l app=redis-cluster &> /dev/null; then
        local redis_pods=$(kubectl get pods -n "$namespace" -l app=redis-cluster --no-headers 2>/dev/null | wc -l)
        echo "  Redis pods: $redis_pods"

        # Check Redis cluster status
        local cluster_status=$(kubectl exec -n "$namespace" redis-cluster-0 -- redis-cli cluster info 2>/dev/null | grep "cluster_state" | cut -d: -f2 | tr -d ' ' || echo "Unknown")
        echo "  Cluster state: $cluster_status"
    else
        print_warning "Redis cluster not found in $region"
    fi
}

# Function to check load balancer
check_load_balancer() {
    local region=$1
    local namespace="aigestion-$region"

    print_info "Checking load balancer in $region"

    if kubectl get service aigestion-api-service -n "$namespace" &> /dev/null; then
        local lb_ip=$(kubectl get service aigestion-api-service -n "$namespace" -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")

        if [ -n "$lb_ip" ]; then
            print_success "Load Balancer: $lb_ip"
        else
            print_warning "Load Balancer IP not found"
        fi
    else
        print_warning "Load balancer service not found"
    fi
}

# Main status check
main() {
    echo ""
    echo "🌍 AIGestion Multi-Region Status"
    echo "=================================="

    # Split regions by comma
    IFS=',' read -ra REGION_ARRAY <<< "$REGIONS"

    for region in "${REGION_ARRAY[@]}"; do
        echo ""
        echo "📍 Region: $region"
        echo "-------------------"

        # Check prerequisites for this region
        export AWS_DEFAULT_REGION=$region

        # Check EKS cluster
        if check_eks_cluster "$region"; then
            # Check various components
            check_pods "$region"
            check_services "$region"
            check_app_health "$region"
            check_database "$region"
            check_redis "$region"
            check_load_balancer "$region"
        fi
    done

    echo ""
    echo "📊 Global DNS Status"
    echo "=================="

    # Check Route53 records
    if aws route53 list-hosted-zones --query "HostedZones[?Name==\`aigestion.net.\`].Id" --output text &> /dev/null; then
        local hosted_zone_id=$(aws route53 list-hosted-zones --query "HostedZones[?Name==\`aigestion.net.\`].Id" --output text 2>/dev/null)
        if [ -n "$hosted_zone_id" ]; then
            echo "✅ Hosted zone found: $hosted_zone_id"

            # List A records
            echo "A Records:"
            aws route53 list-resource-record-sets --hosted-zone-name aigestion.net --query "ResourceRecordSets[?Type=='A']" --output table 2>/dev/null || echo "No A records found"
        fi
    else
        print_warning "Hosted zone aigestion.net not found"
    fi

    echo ""
    echo "🌐 Access URLs"
    echo "============"
    echo "🇺🇸 US East: https://us-east-1.aigestion.net"
    echo "🇺🇸 US West: https://us-west-2.aigestion.net"
    echo "🇪🇺 EU West: https://eu-west-1.aigestion.net"
    echo "🇸🇬 Asia Pacific: https://ap-southeast-1.aigestion.net"
    echo "🌍 Global API: https://api.aigestion.net"

    echo ""
    echo "📈 Health Summary"
    echo "================"

    # Count healthy regions
    healthy_regions=0
    total_regions=${#REGION_ARRAY[@]}

    for region in "${REGION_ARRAY[@]}"; do
        export AWS_DEFAULT_REGION=$region
        if aws eks describe-cluster --name "aigestion-$region" --region "$region" &> /dev/null; then
            healthy_regions=$((healthy_regions + 1))
        fi
    done

    echo "Healthy regions: $healthy_regions/$total_regions"

    if [ "$healthy_regions" -eq "$total_regions" ]; then
        print_success "All regions are healthy! 🎉"
    elif [ "$healthy_regions" -gt 0 ]; then
        print_warning "$healthy_regions of $total_regions regions are healthy"
    else
        print_error "No regions are healthy"
    fi
}

# Handle script arguments
case "${1:-}" in
    "help"|"-h"|"--help")
        echo "Usage: $0 [regions]"
        echo ""
        echo "Arguments:"
        echo "  regions        - Comma-separated list of regions (default: us-east-1,us-west-2,eu-west-1,ap-southeast-1)"
        echo ""
        echo "Examples:"
        echo "  $0                                    # Check all regions"
        echo "  $0 us-east-1,us-west-2               # Check specific regions"
        ;;
    *)
        main
        ;;
esac
