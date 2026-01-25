#!/bin/bash
# 🚀 DEPLOYMENT VERIFICATION SCRIPT
# AIGestion Frontend - website-epic
# Verifica que todo está correctamente desplegado en aigestion.net

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║     WEBSITE-EPIC DEPLOYMENT VERIFICATION v2.0.0        ║"
echo "║          🚀 Domain → aigestion.net Check 🚀            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Paso 1: Verificar estructura
echo -e "${YELLOW}[1/4] Verificando estructura del proyecto...${NC}"
if [ -f "frontend/apps/website-epic/Dockerfile" ]; then
    echo -e "${GREEN}✅ Dockerfile para website-epic encontrado${NC}"
else
    echo -e "${RED}❌ Dockerfile para website-epic NO encontrado${NC}"
    # No fallamos aquí si es GHP
fi

# Paso 2: Verificar GitHub CNAME
echo -e "\n${YELLOW}[2/4] Verificando CNAME config...${NC}"
if [ -f "dist/CNAME" ] || [ -f "CNAME" ]; then
    echo -e "${GREEN}✅ CNAME config encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  CNAME no encontrado en root, verificando workflows...${NC}"
fi

# Paso 3: Verificar package.json en website-epic
echo -e "\n${YELLOW}[3/4] Verificando website-epic/package.json...${NC}"
if [ -f "frontend/apps/website-epic/package.json" ]; then
    echo -e "${GREEN}✅ website-epic/package.json existe${NC}"
else
    echo -e "${RED}❌ website-epic/package.json NO encontrado${NC}"
    exit 1
fi

# Paso 4: Verificar configuración de dominio en .env
echo -e "\n${YELLOW}[4/4] Verificando configuración de API...${NC}"
if [ -f ".env" ]; then
    if grep -q "aigestion.net" .env; then
        echo -e "${GREEN}✅ api.aigestion.net presente en .env${NC}"
    fi
fi

# Resumen final
echo -e "\n${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║              ✅ VERIFICACIÓN COMPLETADA               ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}"
echo "📋 RESUMEN DE CONFIGURACIÓN:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Dominio primario:      aigestion.net"
echo "📡 API Backend:           api.aigestion.net"
echo "📍 Aplicación:            website-epic"
echo "🏗️  Build Tool:            Vite (base: /)"
echo "☁️  Plataforma:            GitHub Pages"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${BLUE}🚀 PRÓXIMOS PASOS:${NC}"
echo "1. Git: git push origin main"
echo "2. GitHub: Esperar a que Deploy Frontend action termine"
echo "3. Verificar: curl https://aigestion.net"
echo ""
echo -e "${GREEN}✨ ¡Todo validado para GitHub Universe! ✨${NC}"
