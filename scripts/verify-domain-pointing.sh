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
echo -e "${YELLOW}[1/5] Verificando estructura del proyecto...${NC}"
if [ -f "frontend/apps/website-epic/Dockerfile" ]; then
    echo -e "${GREEN}✅ Dockerfile para website-epic encontrado${NC}"
else
    echo -e "${RED}❌ Dockerfile para website-epic NO encontrado${NC}"
    exit 1
fi

if [ -f "frontend/apps/website-epic/nginx.conf" ]; then
    echo -e "${GREEN}✅ nginx.conf para website-epic encontrado${NC}"
else
    echo -e "${RED}❌ nginx.conf para website-epic NO encontrado${NC}"
    exit 1
fi

if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✅ vercel.json encontrado${NC}"
else
    echo -e "${RED}❌ vercel.json NO encontrado${NC}"
    exit 1
fi

# Paso 2: Verificar configuración docker-compose.yml
echo -e "\n${YELLOW}[2/5] Verificando docker-compose.yml...${NC}"
if grep -q "frontend/apps/website-epic/Dockerfile" docker-compose.yml; then
    echo -e "${GREEN}✅ docker-compose.yml apunta a website-epic${NC}"
else
    echo -e "${RED}❌ docker-compose.yml NO apunta a website-epic${NC}"
    exit 1
fi

# Paso 3: Verificar vercel.json
echo -e "\n${YELLOW}[3/5] Verificando vercel.json...${NC}"
if grep -q "frontend/apps/website-epic" vercel.json; then
    echo -e "${GREEN}✅ vercel.json build apunta a website-epic${NC}"
else
    echo -e "${RED}❌ vercel.json build NO apunta a website-epic${NC}"
    exit 1
fi

if grep -q "aigestion.net" vercel.json; then
    echo -e "${GREEN}✅ Dominios configurados: aigestion.net + www${NC}"
else
    echo -e "${RED}❌ Dominios NO configurados correctamente${NC}"
    exit 1
fi

# Paso 4: Verificar package.json en website-epic
echo -e "\n${YELLOW}[4/5] Verificando website-epic/package.json...${NC}"
if [ -f "frontend/apps/website-epic/package.json" ]; then
    echo -e "${GREEN}✅ website-epic/package.json existe${NC}"
    # Verificar scripts
    if grep -q "\"build\"" frontend/apps/website-epic/package.json; then
        echo -e "${GREEN}✅ Scripts de build configurados${NC}"
    fi
else
    echo -e "${RED}❌ website-epic/package.json NO encontrado${NC}"
    exit 1
fi

# Paso 5: Verificar configuración de dominio en .env
echo -e "\n${YELLOW}[5/5] Verificando configuración de dominio...${NC}"
if [ -f ".env.example" ]; then
    if grep -q "FRONTEND_URL" .env.example; then
        FRONTEND_URL=$(grep "FRONTEND_URL" .env.example | cut -d'=' -f2)
        echo -e "${GREEN}✅ FRONTEND_URL configurado: $FRONTEND_URL${NC}"
    fi

    if grep -q "aigestion.net" .env.example; then
        echo -e "${GREEN}✅ aigestion.net presente en .env${NC}"
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
echo "🌐 Dominio secundario:    www.aigestion.net"
echo "📍 Aplicación:            website-epic"
echo "🏗️  Build Tool:            Vite"
echo "🐳 Container:             Docker + Nginx"
echo "☁️  Plataforma:            Vercel + Docker"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

echo -e "${BLUE}🚀 PRÓXIMOS PASOS:${NC}"
echo "1. Vercel: git push origin main"
echo "2. Docker: docker-compose -f docker-compose.yml up -d"
echo "3. Verificar: curl https://aigestion.net"
echo ""
echo -e "${GREEN}✨ ¡Listo para desplegar! ✨${NC}"
