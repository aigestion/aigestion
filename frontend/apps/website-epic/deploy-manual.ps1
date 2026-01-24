# Script de despliegue manual - AIGestion
Write-Host "🚀 Iniciando despliegue manual de AIGestion..." -ForegroundColor Green

# 1. Limpiar build anterior
Write-Host "🧹 Limpiando build anterior..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# 2. Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
pnpm install

# 3. Build de producción
Write-Host "🔨 Construyendo para producción..." -ForegroundColor Yellow
pnpm build

# 4. Verificar build
if (Test-Path "dist/index.html") {
    Write-Host "✅ Build exitoso" -ForegroundColor Green
    Write-Host "📁 Archivos generados en ./dist/" -ForegroundColor Cyan

    # Opcional: Copiar a servidor FTP
    # Write-Host "📤 Subiendo a servidor..." -ForegroundColor Yellow
    # Aquí iría tu comando FTP/SFTP

} else {
    Write-Host "❌ Build fallido" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Despliegue completado!" -ForegroundColor Green
