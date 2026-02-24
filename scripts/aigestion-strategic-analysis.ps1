#!/usr/bin/env pwsh

# =============================================================================
# AIGESTION STRATEGIC ANALYSIS - FOCUSED
# =============================================================================

Write-Host "AIGESTION STRATEGIC ANALYSIS" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# 1. Estructura del Proyecto
Write-Host "`n📁 ESTRUCTURA DEL PROYECTO" -ForegroundColor Yellow
$projectRoot = "c:\Users\Alejandro\AIGestion"

$coreComponents = @(
    "frontend/apps/website-epic",
    "backend", 
    "scripts",
    "docs",
    "infra",
    ".env"
)

foreach ($component in $coreComponents) {
    $path = Join-Path $projectRoot $component
    if (Test-Path $path) {
        Write-Host "✅ $component" -ForegroundColor Green
    } else {
        Write-Host "❌ $component" -ForegroundColor Red
    }
}

# 2. Estado del Frontend
Write-Host "`n🎨 ESTADO DEL FRONTEND" -ForegroundColor Yellow
$frontendPath = "$projectRoot\frontend\apps\website-epic"

if (Test-Path "$frontendPath\package.json") {
    $package = Get-Content "$frontendPath\package.json" | ConvertFrom-Json
    Write-Host "✅ Versión: $($package.version)" -ForegroundColor Green
    Write-Host "📦 Dependencies: $($package.dependencies.PSObject.Properties.Count)" -ForegroundColor Cyan
}

if (Test-Path "$frontendPath\dist") {
    $distSize = (Get-ChildItem "$frontendPath\dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "✅ Build: $([math]::Round($distSize, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "⚠️  Build no encontrado" -ForegroundColor Yellow
}

# 3. Servicios Configurados
Write-Host "`n🔌 SERVICIOS CONFIGURADOS" -ForegroundColor Yellow
$envFile = "$projectRoot\.env"

if (Test-Path $envFile) {
    $services = @(
        "SUPABASE_URL",
        "MONGO_URI", 
        "REDIS_URL",
        "GEMINI_API_KEY",
        "ANTIGRAVITY_MODEL_API_KEY",
        "STRIPE_SECRET_KEY",
        "GITHUB_API_TOKEN"
    )
    
    $configured = 0
    foreach ($service in $services) {
        if (Select-String -Path $envFile -Pattern $service -Quiet) {
            Write-Host "✅ $service" -ForegroundColor Green
            $configured++
        } else {
            Write-Host "❌ $service" -ForegroundColor Red
        }
    }
    
    Write-Host "📊 Servicios configurados: $configured/$($services.Count)" -ForegroundColor Cyan
}

# 4. Scripts Disponibles
Write-Host "`n🔧 SCRIPTS DISPONIBLES" -ForegroundColor Yellow
$scriptsPath = "$projectRoot\scripts"

if (Test-Path $scriptsPath) {
    $categories = Get-ChildItem $scriptsPath -Directory
    Write-Host "✅ Categorías de scripts: $($categories.Count)" -ForegroundColor Green
    
    foreach ($category in $categories) {
        $scriptCount = (Get-ChildItem $category.FullName -Filter "*.ps1").Count
        if ($scriptCount -gt 0) {
            Write-Host "  📂 $($category.Name): $scriptCount scripts" -ForegroundColor Cyan
        }
    }
}

# 5. Estado de Deploy
Write-Host "`n🚀 ESTADO DE DEPLOY" -ForegroundColor Yellow

# GitHub Actions
$githubPath = "$projectRoot\.github\workflows"
if (Test-Path $githubPath) {
    $workflows = Get-ChildItem $githubPath -Filter "*.yml"
    Write-Host "✅ GitHub Actions: $($workflows.Count) workflows" -ForegroundColor Green
} else {
    Write-Host "❌ GitHub Actions no configurado" -ForegroundColor Red
}

# Dominios
Write-Host "`n🌐 ESTADO DE DOMINIOS" -ForegroundColor Yellow
$domains = @("aigestion.net", "client.aigestion.net", "demo.aigestion.net")

foreach ($domain in $domains) {
    try {
        $response = Invoke-WebRequest -Uri "https://$domain" -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ $domain - HTTP $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ $domain - No accesible" -ForegroundColor Red
    }
}

# 6. Métricas Clave
Write-Host "`n📊 MÉTRICAS CLAVE" -ForegroundColor Yellow

$totalFiles = (Get-ChildItem $projectRoot -Recurse -File).Count
$ps1Scripts = (Get-ChildItem $projectRoot -Recurse -Filter "*.ps1").Count
$tsFiles = (Get-ChildItem $projectRoot -Recurse -Filter "*.ts").Count

Write-Host "📄 Total archivos: $totalFiles" -ForegroundColor Cyan
Write-Host "🔧 Scripts PowerShell: $ps1Scripts" -ForegroundColor Cyan
Write-Host "📘 TypeScript: $tsFiles" -ForegroundColor Cyan

# 7. Diagnóstico Rápido
Write-Host "`n🔍 DIAGNÓSTICO RÁPIDO" -ForegroundColor Yellow

$issues = @()
$strengths = @()

# Fortalezas
if (Test-Path "$frontendPath\dist") { $strengths += "Frontend compilado y listo" }
if ((Select-String -Path $envFile -Pattern "SUPABASE_URL" -Quiet)) { $strengths += "Base de datos configurada" }
if ($ps1Scripts -gt 20) { $strengths += "Amplia automatización con scripts" }
if (Test-Path "$projectRoot\docs") { $strengths += "Documentación disponible" }

# Problemas
if (-not (Test-Path "$frontendPath\dist")) { $issues += "Frontend no compilado" }
if (-not (Select-String -Path $envFile -Pattern "OPENAI_API_KEY" -Quiet)) { $issues += "OpenAI no configurado" }
if (-not (Test-Path $githubPath)) { $issues += "CI/CD no configurado" }

Write-Host "✅ FORTALEZAS:" -ForegroundColor Green
$strengths | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }

Write-Host "⚠️  PROBLEMAS:" -ForegroundColor Yellow
$issues | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }

Write-Host "`n🎯 ANÁLISIS COMPLETADO" -ForegroundColor Cyan
