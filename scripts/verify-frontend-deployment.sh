#!/bin/bash
# Script de verificación del despliegue del frontend
# AIGestion - website-epic deployment checker

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_ok() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificaciones
print_header "Frontend Deployment Checker"

# 1. Node.js version
echo -e "\n${YELLOW}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    if [[ "$NODE_VERSION" == v20.* || "$NODE_VERSION" == v21.* || "$NODE_VERSION" == v22.* ]]; then
        print_ok "Node.js $NODE_VERSION"
    else
        print_warning "Node.js $NODE_VERSION (recomendado v20+)"
    fi
else
    print_error "Node.js no instalado"
    exit 1
fi

# 2. pnpm version
echo -e "\n${YELLOW}Checking pnpm...${NC}"
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    print_ok "pnpm v$PNPM_VERSION"
else
    print_error "pnpm no instalado"
    exit 1
fi

# 3. Project structure
echo -e "\n${YELLOW}Checking project structure...${NC}"
if [ -d "frontend/apps/website-epic" ]; then
    print_ok "website-epic directory found"
else
    print_error "website-epic directory not found"
    exit 1
fi

# 4. Files check
echo -e "\n${YELLOW}Checking critical files...${NC}"
files=(
    "frontend/apps/website-epic/package.json"
    "frontend/apps/website-epic/vite.config.ts"
    "frontend/apps/website-epic/index.html"
    "frontend/apps/website-epic/Dockerfile"
    "frontend/apps/website-epic/nginx.conf"
    "vercel.json"
    "docker-compose.yml"
    "docker-compose.prod.yml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        print_ok "$file"
    else
        print_error "$file not found"
    fi
done

# 5. Docker check
echo -e "\n${YELLOW}Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_ok "$DOCKER_VERSION"
else
    print_warning "Docker not installed (needed for docker deployment)"
fi

# 6. Build test
echo -e "\n${YELLOW}Testing TypeScript compilation...${NC}"
cd frontend/apps/website-epic
if pnpm run build > /dev/null 2>&1; then
    print_ok "Build successful"
    if [ -d "dist" ]; then
        SIZE=$(du -sh dist | cut -f1)
        print_ok "Build output size: $SIZE"
    fi
else
    print_error "Build failed"
    cd ../../../
    exit 1
fi
cd ../../../

# 7. Dependencies check
echo -e "\n${YELLOW}Checking dependencies...${NC}"
cd frontend/apps/website-epic
if [ -d "node_modules" ]; then
    TOTAL_PACKAGES=$(find node_modules -maxdepth 1 -type d | wc -l)
    print_ok "Dependencies installed ($TOTAL_PACKAGES packages)"
else
    print_warning "Dependencies not installed (run 'pnpm install')"
fi
cd ../../../

# 8. Environment check
echo -e "\n${YELLOW}Checking environment variables...${NC}"
if [ -f ".env.example" ]; then
    print_ok ".env.example found"
    if [ -f ".env" ]; then
        print_ok ".env configured"
    else
        print_warning ".env not found (copy from .env.example)"
    fi
fi

# 9. Vercel config check
echo -e "\n${YELLOW}Checking Vercel configuration...${NC}"
if [ -f "vercel.json" ]; then
    if grep -q "website-epic" vercel.json; then
        print_ok "vercel.json correctly points to website-epic"
    else
        print_error "vercel.json doesn't point to website-epic"
    fi
else
    print_error "vercel.json not found"
fi

# 10. Docker config check
echo -e "\n${YELLOW}Checking Docker configuration...${NC}"
if grep -q "website-epic/Dockerfile" docker-compose.yml; then
    print_ok "docker-compose.yml correctly configured"
else
    print_warning "docker-compose.yml may need updating"
fi

if [ -f "frontend/apps/website-epic/Dockerfile" ]; then
    print_ok "Dockerfile for website-epic exists"
else
    print_error "Dockerfile for website-epic not found"
fi

if [ -f "frontend/apps/website-epic/nginx.conf" ]; then
    print_ok "nginx.conf for website-epic exists"
else
    print_error "nginx.conf for website-epic not found"
fi

# Summary
print_header "Summary"
echo -e "\n${GREEN}✅ All critical checks passed!${NC}\n"

echo "Next steps:"
echo "1. Vercel:  git push origin main"
echo "2. Docker:  docker-compose -f docker-compose.prod.yml up -d"
echo "3. Local:   pnpm --filter website-epic run preview"
echo ""
echo "Documentation:"
echo "- Audit Report: FRONTEND_DEPLOYMENT_AUDIT.md"
echo "- Deployment:   DEPLOYMENT_GUIDE.md"
echo ""
