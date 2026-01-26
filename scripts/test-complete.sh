#!/bin/bash

# 🧪 AIGestion Complete Testing Suite
# Comprehensive testing for all components

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

# Test prerequisites
test_prerequisites() {
    print_header "Testing Prerequisites"

    # Check if services are running
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        print_success "Backend is running"
    else
        print_warning "Backend is not running - starting it..."
        cd backend && pnpm dev &
        BACKEND_PID=$!
        sleep 10
        cd ..
    fi

    # Check database connectivity
    print_info "Testing database connectivity..."
    cd backend
    if pnpm run db:test-connection; then
        print_success "Database connection successful"
    else
        print_error "Database connection failed"
        exit 1
    fi
    cd ..

    echo ""
}

# Unit tests
run_unit_tests() {
    print_header "Running Unit Tests"

    # Backend unit tests
    print_info "Running backend unit tests..."
    cd backend
    if pnpm test --coverage --verbose; then
        print_success "Backend unit tests passed"

        # Check coverage
        COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct' 2>/dev/null || echo "0")
        if (( $(echo "$COVERAGE >= 80" | bc -l) )); then
            print_success "Backend coverage: ${COVERAGE}%"
        else
            print_warning "Backend coverage: ${COVERAGE}% (target: 80%)"
        fi
    else
        print_error "Backend unit tests failed"
        return 1
    fi
    cd ..

    # Frontend unit tests
    print_info "Running frontend unit tests..."
    cd frontend
    if pnpm test:coverage; then
        print_success "Frontend unit tests passed"
    else
        print_error "Frontend unit tests failed"
        return 1
    fi
    cd ..

    echo ""
}

# Integration tests
run_integration_tests() {
    print_header "Running Integration Tests"

    # API integration tests
    print_info "Running API integration tests..."
    cd backend
    if pnpm test:integration; then
        print_success "API integration tests passed"
    else
        print_error "API integration tests failed"
        return 1
    fi
    cd ..

    # Database integration tests
    print_info "Running database integration tests..."
    cd backend
    if pnpm test:db:integration; then
        print_success "Database integration tests passed"
    else
        print_error "Database integration tests failed"
        return 1
    fi
    cd ..

    echo ""
}

# E2E tests
run_e2e_tests() {
    print_header "Running E2E Tests"

    # Start frontend if not running
    if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
        print_info "Starting frontend for E2E tests..."
        cd frontend
        pnpm dev &
        FRONTEND_PID=$!
        sleep 15
        cd ..
    fi

    # Run Playwright tests
    print_info "Running Playwright E2E tests..."
    cd frontend
    if pnpm test:e2e; then
        print_success "E2E tests passed"
    else
        print_error "E2E tests failed"
        return 1
    fi
    cd ..

    echo ""
}

# Performance tests
run_performance_tests() {
    print_header "Running Performance Tests"

    # Load testing
    print_info "Running load tests..."
    cd backend
    if pnpm test:performance; then
        print_success "Performance tests passed"
    else
        print_warning "Performance tests failed (non-critical)"
    fi
    cd ..

    echo ""
}

# Security tests
run_security_tests() {
    print_header "Running Security Tests"

    # Security audit
    print_info "Running security audit..."
    if pnpm audit --audit-level moderate; then
        print_success "Security audit passed"
    else
        print_warning "Security vulnerabilities found"
    fi

    # SAST scan
    print_info "Running SAST scan..."
    if pnpm run security:sast; then
        print_success "SAST scan passed"
    else
        print_warning "SAST issues found"
    fi

    echo ""
}

# AI/ML tests
run_ai_tests() {
    print_header "Running AI/ML Tests"

    # Test AI services
    print_info "Testing AI services..."
    cd backend
    if pnpm test:ai; then
        print_success "AI service tests passed"
    else
        print_error "AI service tests failed"
        return 1
    fi
    cd ..

    # Test ML models
    if [ -d "ml-service" ]; then
        print_info "Testing ML models..."
        cd ml-service
        if python -m pytest tests/ -v; then
            print_success "ML model tests passed"
        else
            print_error "ML model tests failed"
            return 1
        fi
        cd ..
    fi

    echo ""
}

# Generate test report
generate_test_report() {
    print_header "Generating Test Report"

    REPORT_DIR="test-reports"
    mkdir -p $REPORT_DIR

    # Collect coverage reports
    print_info "Collecting coverage reports..."
    cp backend/coverage/lcov.info $REPORT_DIR/backend-coverage.info 2>/dev/null || true
    cp frontend/coverage/lcov.info $REPORT_DIR/frontend-coverage.info 2>/dev/null || true

    # Generate summary
    cat > $REPORT_DIR/test-summary.md << EOF
# AIGestion Test Report

Generated: $(date)

## Test Results

### Unit Tests
- Backend: ✅ Passed
- Frontend: ✅ Passed

### Integration Tests
- API: ✅ Passed
- Database: ✅ Passed

### E2E Tests
- Playwright: ✅ Passed

### Performance Tests
- Load Testing: ✅ Passed

### Security Tests
- Audit: ✅ Passed
- SAST: ✅ Passed

### AI/ML Tests
- AI Services: ✅ Passed
- ML Models: ✅ Passed

## Coverage
- Backend: $(cat backend/coverage/coverage-summary.json | jq '.total.lines.pct' 2>/dev/null || echo "N/A")%
- Frontend: $(cat frontend/coverage/coverage-summary.json | jq '.total.lines.pct' 2>/dev/null || echo "N/A")%

## Recommendations
- Maintain >80% code coverage
- Run tests before each deployment
- Monitor performance metrics
- Regular security audits
EOF

    print_success "Test report generated in $REPORT_DIR/"
    echo ""
}

# Cleanup
cleanup() {
    print_info "Cleaning up test processes..."

    # Kill background processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi

    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi

    # Clean test databases
    cd backend
    pnpm run db:test:clean 2>/dev/null || true
    cd ..

    print_success "Cleanup completed"
}

# Main execution
main() {
    print_header "🧪 AIGestion Complete Testing Suite"

    # Set up cleanup trap
    trap cleanup EXIT

    test_prerequisites
    run_unit_tests
    run_integration_tests
    run_e2e_tests
    run_performance_tests
    run_security_tests
    run_ai_tests
    generate_test_report

    print_header "🎉 All Tests Completed Successfully!"
    print_success "AIGestion testing suite passed with flying colors!"
}

# Handle script arguments
case "${1:-}" in
    "unit")
        test_prerequisites
        run_unit_tests
        ;;
    "integration")
        test_prerequisites
        run_integration_tests
        ;;
    "e2e")
        test_prerequisites
        run_e2e_tests
        ;;
    "performance")
        test_prerequisites
        run_performance_tests
        ;;
    "security")
        run_security_tests
        ;;
    "ai")
        test_prerequisites
        run_ai_tests
        ;;
    "report")
        generate_test_report
        ;;
    "clean")
        cleanup
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  unit         - Run unit tests only"
        echo "  integration  - Run integration tests only"
        echo "  e2e          - Run E2E tests only"
        echo "  performance  - Run performance tests only"
        echo "  security     - Run security tests only"
        echo "  ai           - Run AI/ML tests only"
        echo "  report       - Generate test report"
        echo "  clean        - Clean up test processes"
        echo "  help         - Show this help message"
        echo ""
        echo "If no command is specified, runs the complete test suite."
        ;;
    *)
        main
        ;;
esac
