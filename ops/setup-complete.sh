#!/bin/bash

# 🚀 AIGestion Complete Setup Script
# This script sets up the entire AIGestion project for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print functions
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
    print_header "Checking Prerequisites"

    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        REQUIRED_NODE_VERSION="22.0.0"
        if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE_VERSION" ]; then
            print_success "Node.js $NODE_VERSION (✓)"
        else
            print_error "Node.js version $NODE_VERSION is too old. Required: $REQUIRED_NODE_VERSION+"
            exit 1
        fi
    else
        print_error "Node.js is not installed"
        exit 1
    fi

    # Check pnpm
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        print_success "pnpm $PNPM_VERSION (✓)"
    else
        print_error "pnpm is not installed"
        print_info "Install pnpm: npm install -g pnpm"
        exit 1
    fi

    # Check Docker
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "Docker $DOCKER_VERSION (✓)"
    else
        print_warning "Docker is not installed (optional for local development)"
    fi

    # Check Python
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        print_success "Python $PYTHON_VERSION (✓)"
    else
        print_warning "Python3 is not installed (required for ML service)"
    fi

    echo ""
}

# Setup environment
setup_environment() {
    print_header "Setting Up Environment"

    # Create .env.local if it doesn't exist
    if [ ! -f .env.local ]; then
        print_info "Creating .env.local from template..."
        cp docs/ENVIRONMENT.md .env.local.template
        print_warning "Please edit .env.local with your configuration"
        print_info "Template created at .env.local.template"
    else
        print_success ".env.local already exists"
    fi

    # Create necessary directories
    print_info "Creating necessary directories..."
    mkdir -p logs
    mkdir -p data
    mkdir -p backups
    mkdir -p tmp
    mkdir -p coverage

    print_success "Directories created"
    echo ""
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"

    # Install root dependencies
    print_info "Installing root dependencies..."
    pnpm install
    print_success "Root dependencies installed"

    # Install backend dependencies
    print_info "Installing backend dependencies..."
    cd backend
    pnpm install
    cd ..
    print_success "Backend dependencies installed"

    # Install frontend dependencies
    print_info "Installing frontend dependencies..."
    cd frontend
    pnpm install
    cd ..
    print_success "Frontend dependencies installed"

    # Install ML service dependencies if Python is available
    if command -v python3 &> /dev/null; then
        print_info "Installing ML service dependencies..."
        cd ml-service
        if [ -f requirements.txt ]; then
            pip3 install -r requirements.txt
            print_success "ML service dependencies installed"
        else
            print_warning "requirements.txt not found in ml-service"
        fi
        cd ..
    fi

    echo ""
}

# Setup database
setup_database() {
    print_header "Setting Up Database"

    # Start Docker services if Docker is available
    if command -v docker &> /dev/null; then
        print_info "Starting Docker services..."
        docker-compose up -d db mongo redis

        # Wait for services to be ready
        print_info "Waiting for database services to be ready..."
        sleep 10

        # Check if services are running
        if docker-compose ps | grep -q "Up"; then
            print_success "Database services are running"
        else
            print_error "Failed to start database services"
            print_info "Check docker-compose logs for details"
        fi
    else
        print_warning "Docker not available. Please set up databases manually."
    fi

    echo ""
}

# Run database migrations
run_migrations() {
    print_header "Running Database Migrations"

    # Check if backend is built
    if [ ! -d "backend/dist" ]; then
        print_info "Building backend..."
        cd backend
        pnpm build
        cd ..
    fi

    # Run migrations
    print_info "Running database migrations..."
    cd backend
    if pnpm run db:migrate; then
        print_success "Database migrations completed"
    else
        print_warning "Database migrations failed (might be already up to date)"
    fi
    cd ..

    echo ""
}

# Build project
build_project() {
    print_header "Building Project"

    # Build backend
    print_info "Building backend..."
    cd backend
    pnpm build
    print_success "Backend built"
    cd ..

    # Build frontend
    print_info "Building frontend..."
    cd frontend
    pnpm build:all
    print_success "Frontend built"
    cd ..

    echo ""
}

# Run tests
run_tests() {
    print_header "Running Tests"

    # Run backend tests
    print_info "Running backend tests..."
    cd backend
    if pnpm test; then
        print_success "Backend tests passed"
    else
        print_error "Backend tests failed"
        return 1
    fi
    cd ..

    # Run frontend tests
    print_info "Running frontend tests..."
    cd frontend
    if pnpm test:all; then
        print_success "Frontend tests passed"
    else
        print_error "Frontend tests failed"
        return 1
    fi
    cd ..

    echo ""
}

# Setup development tools
setup_dev_tools() {
    print_header "Setting Up Development Tools"

    # Setup git hooks
    print_info "Setting up git hooks..."
    if [ -f package.json ] && grep -q "husky" package.json; then
        pnpm prepare
        print_success "Git hooks configured"
    else
        print_warning "Husky not found in package.json"
    fi

    # Setup VS Code settings
    if [ -d .vscode ]; then
        print_success "VS Code settings already exist"
    else
        print_info "Creating VS Code settings..."
        mkdir -p .vscode
        cat > .vscode/settings.json << EOF
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  }
}
EOF
        print_success "VS Code settings created"
    fi

    echo ""
}

# Generate documentation
generate_docs() {
    print_header "Generating Documentation"

    # Generate API documentation
    print_info "Generating API documentation..."
    cd backend
    if pnpm run docs:generate; then
        print_success "API documentation generated"
    else
        print_warning "API documentation generation failed"
    fi
    cd ..

    echo ""
}

# Health check
health_check() {
    print_header "Health Check"

    # Check if backend is running
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_warning "Backend is not running or not healthy"
    fi

    # Check if frontend is running
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        print_success "Frontend is running"
    else
        print_warning "Frontend is not running"
    fi

    # Check database connections
    print_info "Checking database connections..."
    cd backend
    if pnpm run db:health; then
        print_success "Database connections are healthy"
    else
        print_warning "Database connections failed"
    fi
    cd ..

    echo ""
}

# Show next steps
show_next_steps() {
    print_header "Setup Complete! 🎉"

    echo -e "${GREEN}AIGestion has been successfully set up!${NC}"
    echo ""
    echo -e "${CYAN}Next Steps:${NC}"
    echo "1. Edit .env.local with your configuration"
    echo "2. Start development servers:"
    echo "   ${YELLOW}pnpm run dev${NC}"
    echo "3. Open your browser:"
    echo "   ${YELLOW}Backend: http://localhost:3000${NC}"
    echo "   ${YELLOW}Frontend: http://localhost:5173${NC}"
    echo "4. Check the documentation:"
    echo "   ${YELLOW}docs/ARCHITECTURE.md${NC}"
    echo "   ${YELLOW}docs/DEVELOPMENT.md${NC}"
    echo "   ${YELLOW}docs/API.md${NC}"
    echo ""
    echo -e "${CYAN}Useful Commands:${NC}"
    echo "  ${YELLOW}pnpm run dev${NC}         - Start development servers"
    echo "  ${YELLOW}pnpm run test${NC}        - Run all tests"
    echo "  ${YELLOW}pnpm run build${NC}       - Build for production"
    echo "  ${YELLOW}pnpm run lint${NC}        - Run linting"
    echo "  ${YELLOW}pnpm run docker:dev${NC}   - Start with Docker"
    echo ""
    echo -e "${CYAN}Troubleshooting:${NC}"
    echo "  - Check logs: ${YELLOW}pnpm run logs${NC}"
    echo "  - Health check: ${YELLOW}pnpm run health:check${NC}"
    echo "  - Reset environment: ${YELLOW}pnpm run clean && pnpm install${NC}"
    echo ""
    echo -e "${PURPLE}Happy coding! 🚀${NC}"
}

# Main function
main() {
    print_header "🚀 AIGestion Complete Setup"

    check_prerequisites
    setup_environment
    install_dependencies
    setup_database
    run_migrations
    build_project
    setup_dev_tools
    generate_docs
    health_check
    show_next_steps
}

# Handle script arguments
case "${1:-}" in
    "prereqs")
        check_prerequisites
        ;;
    "env")
        setup_environment
        ;;
    "deps")
        install_dependencies
        ;;
    "db")
        setup_database
        run_migrations
        ;;
    "build")
        build_project
        ;;
    "test")
        run_tests
        ;;
    "dev-tools")
        setup_dev_tools
        ;;
    "docs")
        generate_docs
        ;;
    "health")
        health_check
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  prereqs     - Check prerequisites"
        echo "  env         - Setup environment"
        echo "  deps        - Install dependencies"
        echo "  db          - Setup database and run migrations"
        echo "  build       - Build project"
        echo "  test        - Run tests"
        echo "  dev-tools   - Setup development tools"
        echo "  docs        - Generate documentation"
        echo "  health      - Run health check"
        echo "  help        - Show this help message"
        echo ""
        echo "If no command is specified, runs the complete setup."
        ;;
    *)
        main
        ;;
esac
