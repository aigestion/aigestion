#!/usr/bin/env pwsh

# AIGestion Deploy Script - God Mode
# Automatización de deploy para GitHub Pages

param(
    [switch]$Force,
    [switch]$SkipTests,
    [switch]$Verbose
)

# Configuración
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
$FRONTEND_PATH = "$PROJECT_ROOT\frontend\website-epic"
$DEPLOY_PATH = "$PROJECT_ROOT\deploy_dist"
$GITHUB_PAGES_BRANCH = "gh-pages"

Write-Host "🚀 AIGestion Deploy God Mode - Iniciando..." -ForegroundColor Cyan
Write-Host "📂 Proyecto: $PROJECT_ROOT" -ForegroundColor Gray

# Paso 1: Verificar estado del repositorio
Write-Host "`n📋 Paso 1: Verificando estado del repositorio..." -ForegroundColor Yellow
Set-Location $PROJECT_ROOT

$gitStatus = git status --porcelain
if ($gitStatus -and -not $Force) {
    Write-Host "❌ Hay cambios sin commit. Usa -Force para continuar de todos modos." -ForegroundColor Red
    Write-Host $gitStatus -ForegroundColor Gray
    exit 1
}

if ($gitStatus -and $Force) {
    Write-Host "⚠️  Ignorando cambios sin commit (modo -Force)" -ForegroundColor Yellow
}

# Paso 2: Build del frontend
Write-Host "`n🔨 Paso 2: Build del frontend..." -ForegroundColor Yellow
Set-Location $FRONTEND_PATH

if (-not $SkipTests) {
    Write-Host "🧪 Ejecutando tests..." -ForegroundColor Gray
    npm test -- --passWithNoTests --watchAll=false
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Tests fallaron. Usa -SkipTests para continuar." -ForegroundColor Red
        exit 1
    }
}

Write-Host "📦 Build de producción..." -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build falló" -ForegroundColor Red
    exit 1
}

# Paso 3: Preparar deploy
Write-Host "`n📦 Paso 3: Preparando deploy..." -ForegroundColor Yellow
if (Test-Path $DEPLOY_PATH) {
    Remove-Item $DEPLOY_PATH -Recurse -Force
}
New-Item -ItemType Directory -Path $DEPLOY_PATH -Force

# Copiar archivos build
Copy-Item "$FRONTEND_PATH\dist\*" $DEPLOY_PATH -Recurse

# Configurar GitHub Pages
Copy-Item "$DEPLOY_PATH\index.html" "$DEPLOY_PATH\404.html"
"aigestion.net" | Out-File "$DEPLOY_PATH\CNAME" -Encoding UTF8
New-Item "$DEPLOY_PATH\.nojekyll" -ItemType File -Force

# Paso 4: Commit y push
Write-Host "`n🚀 Paso 4: Deploy a GitHub Pages..." -ForegroundColor Yellow

# Verificar si existe la rama gh-pages
$branchExists = git show-ref --verify --quiet refs/heads/$GITHUB_PAGES_BRANCH
if (-not $branchExists) {
    Write-Host "🌿 Creando rama $GITHUB_PAGES_BRANCH..." -ForegroundColor Gray
    git checkout --orphan $GITHUB_PAGES_BRANCH
    git rm -rf .
} else {
    Write-Host "🌿 Cambiando a rama $GITHUB_PAGES_BRANCH..." -ForegroundColor Gray
    git checkout $GITHUB_PAGES_BRANCH
}

# Copiar archivos de deploy
Set-Location $PROJECT_ROOT
Remove-Item * -Recurse -Force -Exclude .git, .gitignore
Copy-Item "$DEPLOY_PATH\*" . -Recurse

# Commit y push
git add .
git commit -m "🚀 Deploy AIGestion Website - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin $GITHUB_PAGES_BRANCH --force

# Volver a la rama main
git checkout main

Write-Host "`n✅ Deploy completado exitosamente!" -ForegroundColor Green
Write-Host "🌐 Website disponible en: https://aigestion.net" -ForegroundColor Cyan
Write-Host "⏱️  Propagación DNS: 5-10 minutos" -ForegroundColor Gray

# Paso 5: Verificación
Write-Host "`n🔍 Paso 5: Verificación..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "https://aigestion.net" -TimeoutSec 30
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Website accesible" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Website respondió con código: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  No se pudo verificar el website (puede estar en propagación)" -ForegroundColor Yellow
}

Write-Host "`n🎉 AIGestion Deploy God Mode completado!" -ForegroundColor Green
