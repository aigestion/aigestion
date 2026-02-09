#!/bin/bash
set -e

echo "🚀 Iniciando deployment del frontend a GitHub Pages..."

# Variables
REPO="AIGestion"
BRANCH="gh-pages"
BUILD_DIR="frontend/apps/website-epic/dist"
GITHUB_USER="Alejandro"

# Verificar que estamos en el directorio correcto
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Directorio de build no encontrado: $BUILD_DIR"
    echo "Ejecutando build primero..."
    pnpm --filter website-epic run build
fi

# Crear directorio temporal para git
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

echo "📦 Preparando deployment..."
cp -r "$BUILD_DIR"/* "$TEMP_DIR/"

# Agregar archivos necesarios
touch "$TEMP_DIR/.nojekyll"
cat > "$TEMP_DIR/CNAME" << EOF
aigestion.net
EOF

# Cambiar a directorio temporal
cd "$TEMP_DIR"

# Configurar git
git init
git config user.name "GitHub Actions"
git config user.email "actions@github.com"

# Agregar todos los archivos
git add .

# Commit
git commit -m "Deploy frontend $(date +'%Y-%m-%d %H:%M:%S')"

# Push a gh-pages
git remote add origin "https://github.com/$GITHUB_USER/$REPO.git"
git branch -m main gh-pages
git push -u origin gh-pages --force

echo "✅ Deployment completado exitosamente"
echo "🌐 El sitio estará disponible en https://aigestion.net"
