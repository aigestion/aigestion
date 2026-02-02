#!/bin/bash
# AIGestion.net - Google Cloud Configuration Validator
# Script para verificar que todas las configuraciones de Google Cloud están en lugar

echo "🚀 =========================================="
echo "   AIGestion.net - NIVEL DIOS Validator"
echo "=========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
CHECKS_FAILED=0

# Función para verificar
check() {
    local name=$1
    local command=$2
    
    echo -n "Checking $name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC}"
        ((CHECKS_FAILED++))
    fi
}

# ========================================
# 1. Verificar credenciales
# ========================================
echo -e "${BLUE}1. Verificando Credenciales${NC}"

check "Service Account Key exists" "test -f ./credentials/aigestion-master-key.json"
check "Service Account Key is valid JSON" "jq empty ./credentials/aigestion-master-key.json 2>/dev/null"
check ".gitignore includes credentials" "grep -q 'credentials/' .gitignore"

echo ""

# ========================================
# 2. Verificar variables de entorno
# ========================================
echo -e "${BLUE}2. Verificando Variables de Entorno${NC}"

check ".env file exists" "test -f .env"
check "GOOGLE_CLOUD_PROJECT_ID set" "grep -q 'GOOGLE_CLOUD_PROJECT_ID=aigestion-net' .env"
check "VERTEX_AI_LOCATION set" "grep -q 'VERTEX_AI_LOCATION=europe-west1' .env"
check "GCS_BUCKET_BACKUPS set" "grep -q 'GCS_BUCKET_BACKUPS=' .env"
check "SECRET_MANAGER_ENABLED set" "grep -q 'SECRET_MANAGER_ENABLED=true' .env"
check "CLOUD_LOGGING_ENABLED set" "grep -q 'CLOUD_LOGGING_ENABLED=true' .env"
check "CLOUD_MONITORING_ENABLED set" "grep -q 'CLOUD_MONITORING_ENABLED=true' .env"

echo ""

# ========================================
# 3. Verificar Google Cloud CLI
# ========================================
echo -e "${BLUE}3. Verificando Google Cloud CLI${NC}"

check "gcloud installed" "command -v gcloud"
check "gcloud project set" "gcloud config get-value project | grep -q 'aigestion-net'"
check "gcloud auth configured" "gcloud auth list | grep -q aigestion-master"

echo ""

# ========================================
# 4. Verificar APIs habilitadas
# ========================================
echo -e "${BLUE}4. Verificando APIs Habilitadas${NC}"

check "Vertex AI API enabled" "gcloud services list --enabled --project aigestion-net | grep -q 'aiplatform.googleapis.com'"
check "Cloud Storage API enabled" "gcloud services list --enabled --project aigestion-net | grep -q 'storage-api.googleapis.com'"
check "Secret Manager API enabled" "gcloud services list --enabled --project aigestion-net | grep -q 'secretmanager.googleapis.com'"
check "Cloud Logging API enabled" "gcloud services list --enabled --project aigestion-net | grep -q 'logging.googleapis.com'"
check "Cloud Monitoring API enabled" "gcloud services list --enabled --project aigestion-net | grep -q 'monitoring.googleapis.com'"

echo ""

# ========================================
# 5. Verificar Google Cloud Resources
# ========================================
echo -e "${BLUE}5. Verificando Recursos de Google Cloud${NC}"

check "GCS Bucket: backups exists" "gsutil ls -b gs://aigestion-backups 2>/dev/null"
check "GCS Bucket: uploads exists" "gsutil ls -b gs://aigestion-uploads 2>/dev/null"
check "GCS Bucket: models exists" "gsutil ls -b gs://aigestion-models 2>/dev/null"
check "Service Account exists" "gcloud iam service-accounts describe aigestion-master@aigestion-net.iam.gserviceaccount.com --project aigestion-net 2>/dev/null"

echo ""

# ========================================
# 6. Verificar Secret Manager
# ========================================
echo -e "${BLUE}6. Verificando Secret Manager${NC}"

check "Secret: gemini-api-key exists" "gcloud secrets describe aigestion/gemini-api-key --project aigestion-net 2>/dev/null"
check "Secret: mongodb-uri exists" "gcloud secrets describe aigestion/mongodb-uri --project aigestion-net 2>/dev/null"
check "Secret: telegram tokens exists" "gcloud secrets describe aigestion/telegram-bot-token-dev --project aigestion-net 2>/dev/null"

echo ""

# ========================================
# 7. Verificar configuración local
# ========================================
echo -e "${BLUE}7. Verificando Configuración Local${NC}"

check "MongoDB running" "nc -z localhost 27017"
check "Backend dependencies installed" "test -d node_modules"
check "TypeScript config exists" "test -f tsconfig.json"
check "Docker compose file exists" "test -f ../docker-compose.yml"

echo ""

# ========================================
# Resumen
# ========================================
TOTAL=$((CHECKS_PASSED + CHECKS_FAILED))
PERCENTAGE=$((CHECKS_PASSED * 100 / TOTAL))

echo -e "${BLUE}========================================${NC}"
echo -e "Resultados:"
echo -e "${GREEN}✓ Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}✗ Failed: $CHECKS_FAILED${NC}"
echo -e "Total: $TOTAL"
echo -e "Coverage: ${PERCENTAGE}%"
echo -e "${BLUE}========================================${NC}"

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED - NIVEL DIOS READY!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some checks failed - Review configuration${NC}"
    exit 1
fi
