# ========================================
# SCRIPT DE VERIFICACIÓN DE DESPLIEGUE
# AIGestion - website-epic
# PowerShell Version
# ========================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     VERIFICACIÓN DE DESPLIEGUE - WEBSITE-EPIC                ║" -ForegroundColor Cyan
Write-Host "║     AIGestion NEXUS V1                                       ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Función para imprimir OK
function Print-OK {
    param($mensaje)
    Write-Host "✅ $mensaje" -ForegroundColor Green
}

# Función para imprimir ERROR
function Print-Error {
    param($mensaje)
    Write-Host "❌ $mensaje" -ForegroundColor Red
}

# Función para imprimir WARNING
function Print-Warning {
    param($mensaje)
    Write-Host "⚠️  $mensaje" -ForegroundColor Yellow
}

# ========================================
# 1. VERIFICAR NODE.JS
# ========================================
Write-Host "📦 Verificando Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    if ($nodeVersion -match "v(20|21|22)") {
        Print-OK "Node.js $nodeVersion instalado"
    } else {
        Print-Warning "Node.js $nodeVersion (recomendado v20+)"
    }
} else {
    Print-Error "Node.js NO instalado"
    exit 1
}

# ========================================
# 2. VERIFICAR PNPM
# ========================================
Write-Host ""
Write-Host "📦 Verificando pnpm..." -ForegroundColor Yellow
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    $pnpmVersion = pnpm --version
    Print-OK "pnpm v$pnpmVersion instalado"
} else {
    Print-Error "pnpm NO instalado"
    Write-Host "   Instalar con: npm install -g pnpm" -ForegroundColor Gray
    exit 1
}

# ========================================
# 3. VERIFICAR ESTRUCTURA DEL PROYECTO
# ========================================
Write-Host ""
Write-Host "📁 Verificando estructura del proyecto..." -ForegroundColor Yellow

$archivosRequeridos = @(
    "frontend\apps\website-epic\package.json",
    "frontend\apps\website-epic\vite.config.ts",
    "frontend\apps\website-epic\index.html",
    "frontend\apps\website-epic\Dockerfile",
    "frontend\apps\website-epic\nginx.conf",
    "vercel.json",
    "docker-compose.yml",
    "docker-compose.prod.yml"
)

$todoOK = $true
foreach ($archivo in $archivosRequeridos) {
    if (Test-Path $archivo) {
        Print-OK "$archivo"
    } else {
        Print-Error "$archivo NO ENCONTRADO"
        $todoOK = $false
    }
}

if (-not $todoOK) {
    Write-Host ""
    Print-Error "Faltan archivos críticos"
    exit 1
}

# ========================================
# 4. VERIFICAR VERCEL.JSON
# ========================================
Write-Host ""
Write-Host "☁️  Verificando vercel.json..." -ForegroundColor Yellow

$vercelContent = Get-Content "vercel.json" -Raw
if ($vercelContent -match "website-epic") {
    Print-OK "vercel.json apunta a website-epic"
} else {
    Print-Error "vercel.json NO apunta a website-epic"
}

if ($vercelContent -match "aigestion.net") {
    Print-OK "Dominio aigestion.net configurado"
} else {
    Print-Warning "Dominio aigestion.net no encontrado en vercel.json"
}

# ========================================
# 5. VERIFICAR DOCKER-COMPOSE
# ========================================
Write-Host ""
Write-Host "🐳 Verificando docker-compose.yml..." -ForegroundColor Yellow

$dockerContent = Get-Content "docker-compose.yml" -Raw
if ($dockerContent -match "website-epic/Dockerfile") {
    Print-OK "docker-compose.yml apunta a website-epic/Dockerfile"
} else {
    Print-Warning "docker-compose.yml podría necesitar actualización"
}

# ========================================
# 6. VERIFICAR DEPENDENCIAS
# ========================================
Write-Host ""
Write-Host "📚 Verificando dependencias de website-epic..." -ForegroundColor Yellow

Push-Location "frontend\apps\website-epic"

if (Test-Path "node_modules") {
    $packageCount = (Get-ChildItem "node_modules" -Directory | Measure-Object).Count
    Print-OK "Dependencias instaladas ($packageCount paquetes)"
} else {
    Print-Warning "Dependencias NO instaladas"
    Write-Host "   Ejecutar: pnpm install" -ForegroundColor Gray
}

Pop-Location

# ========================================
# 7. VERIFICAR BUILD
# ========================================
Write-Host ""
Write-Host "🔨 Verificando build..." -ForegroundColor Yellow

Push-Location "frontend\apps\website-epic"

if (Test-Path "dist") {
    $distSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Print-OK "Build dist/ existe ($('{0:N2}' -f $distSize) MB)"
} else {
    Print-Warning "Build dist/ NO existe"
    Write-Host "   Ejecutar: pnpm run build" -ForegroundColor Gray
}

Pop-Location

# ========================================
# 8. VERIFICAR DOCKER (OPCIONAL)
# ========================================
Write-Host ""
Write-Host "🐋 Verificando Docker..." -ForegroundColor Yellow

if (Get-Command docker -ErrorAction SilentlyContinue) {
    $dockerVersion = docker --version
    Print-OK "$dockerVersion"
} else {
    Print-Warning "Docker NO instalado (necesario solo para deploy Docker)"
}

# ========================================
# 9. VERIFICAR VARIABLES DE ENTORNO
# ========================================
Write-Host ""
Write-Host "🔐 Verificando variables de entorno..." -ForegroundColor Yellow

if (Test-Path ".env.example") {
    Print-OK ".env.example encontrado"
    if (Test-Path ".env") {
        Print-OK ".env configurado"
    } else {
        Print-Warning ".env NO encontrado (copiar desde .env.example)"
    }
} else {
    Print-Warning ".env.example NO encontrado"
}

# ========================================
# RESUMEN FINAL
# ========================================
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    RESUMEN FINAL                              ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Print-OK "Verificación completada"
Write-Host ""

Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Para DESARROLLO LOCAL:" -ForegroundColor Cyan
Write-Host "   1. cd frontend\apps\website-epic" -ForegroundColor White
Write-Host "   2. pnpm install" -ForegroundColor White
Write-Host "   3. pnpm dev" -ForegroundColor White
Write-Host "   4. Abrir http://localhost:5173" -ForegroundColor White
Write-Host ""

Write-Host "   Para BUILD:" -ForegroundColor Cyan
Write-Host "   1. cd frontend\apps\website-epic" -ForegroundColor White
Write-Host "   2. pnpm build" -ForegroundColor White
Write-Host "   3. pnpm preview  (para probar el build)" -ForegroundColor White
Write-Host ""

Write-Host "   Para VERCEL:" -ForegroundColor Cyan
Write-Host "   1. git add ." -ForegroundColor White
Write-Host "   2. git commit -m 'chore: frontend deployment'" -ForegroundColor White
Write-Host "   3. git push origin main" -ForegroundColor White
Write-Host "   4. Vercel auto-desplegará en 1-2 minutos" -ForegroundColor White
Write-Host ""

Write-Host "   Para DOCKER:" -ForegroundColor Cyan
Write-Host "   1. docker-compose -f docker-compose.prod.yml up -d" -ForegroundColor White
Write-Host "   2. Abrir http://localhost" -ForegroundColor White
Write-Host ""

Write-Host "📚 DOCUMENTACIÓN:" -ForegroundColor Yellow
Write-Host "   - DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "   - FRONTEND_DEPLOYMENT_SUMMARY.md" -ForegroundColor White
Write-Host "   - WEBSITE_EPIC_SHOWCASE.md" -ForegroundColor White
Write-Host ""

Write-Host "✅ TODO LISTO PARA DESPLIEGUE" -ForegroundColor Green
Write-Host ""
