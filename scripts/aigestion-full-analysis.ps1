#!/usr/bin/env pwsh

# =============================================================================
# AIGESTION FULL ANALYSIS - STRATEGIC ASSESSMENT
# =============================================================================

Write-Host "AIGESTION FULL ANALYSIS - STRATEGIC ASSESSMENT" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Estado del Proyecto Principal
Write-Host "`n1. ESTADO DEL PROYECTO PRINCIPAL" -ForegroundColor Yellow

# Verificar estructura del proyecto
$projectRoot = "c:\Users\Alejandro\AIGestion"
if (Test-Path $projectRoot) {
    Write-Host "   ✅ Directorio principal encontrado" -ForegroundColor Green
    
    # Estructura de carpetas clave
    $keyDirs = @("frontend", "backend", "scripts", "docs", "ops", "infra")
    foreach ($dir in $keyDirs) {
        $path = Join-Path $projectRoot $dir
        if (Test-Path $path) {
            Write-Host "   ✅ $dir`: Existe" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $dir`: No existe" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ❌ Directorio principal no encontrado" -ForegroundColor Red
}

# 2. Estado del Frontend
Write-Host "`n2. ESTADO DEL FRONTEND" -ForegroundColor Yellow
$frontendPath = "$projectRoot\frontend\apps\website-epic"

if (Test-Path $frontendPath) {
    Write-Host "   ✅ Frontend website-epic encontrado" -ForegroundColor Green
    
    # Verificar package.json
    $packageJson = Join-Path $frontendPath "package.json"
    if (Test-Path $packageJson) {
        try {
            $package = Get-Content $packageJson | ConvertFrom-Json
            Write-Host "   ✅ package.json: Versión $($package.version)" -ForegroundColor Green
            Write-Host "   📦 Dependencies: $($package.dependencies.PSObject.Properties.Count)" -ForegroundColor Cyan
            Write-Host "   📦 DevDependencies: $($package.devDependencies.PSObject.Properties.Count)" -ForegroundColor Cyan
        } catch {
            Write-Host "   ❌ Error leyendo package.json" -ForegroundColor Red
        }
    }
    
    # Verificar build
    $distPath = Join-Path $frontendPath "dist"
    if (Test-Path $distPath) {
        $distSize = (Get-ChildItem $distPath -Recurse -ErrorAction SilentlyContinue | 
                    Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "   ✅ Build disponible: $([math]::Round($distSize, 2)) MB" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Build no encontrado" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Frontend no encontrado" -ForegroundColor Red
}

# 3. Estado del Backend
Write-Host "`n3. ESTADO DEL BACKEND" -ForegroundColor Yellow
$backendPath = "$projectRoot\backend"

if (Test-Path $backendPath) {
    Write-Host "   ✅ Backend encontrado" -ForegroundColor Green
    
    # Verificar package.json del backend
    $backendPackage = Join-Path $backendPath "package.json"
    if (Test-Path $backendPackage) {
        try {
            $package = Get-Content $backendPackage | ConvertFrom-Json
            Write-Host "   ✅ package.json: Versión $($package.version)" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Error leyendo package.json del backend" -ForegroundColor Red
        }
    }
    
    # Verificar si hay dist
    $backendDist = Join-Path $backendPath "dist"
    if (Test-Path $backendDist) {
        Write-Host "   ✅ Backend compilado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Backend no compilado" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Backend no encontrado" -ForegroundColor Red
}

# 4. Integraciones y Servicios
Write-Host "`n4. INTEGRACIONES Y SERVICIOS" -ForegroundColor Yellow

# Cargar .env
$envFile = "$projectRoot\.env"
$services = @()

if (Test-Path $envFile) {
    Write-Host "   ✅ Archivo .env encontrado" -ForegroundColor Green
    
    # Verificar servicios principales
    $serviceKeys = @(
        @{Name="Supabase"; Pattern="SUPABASE_URL"},
        @{Name="MongoDB"; Pattern="MONGO_URI"},
        @{Name="Redis"; Pattern="REDIS_URL"},
        @{Name="Gemini"; Pattern="GEMINI_API_KEY"},
        @{Name="Antigravity"; Pattern="ANTIGRAVITY_MODEL_API_KEY"},
        @{Name="OpenAI"; Pattern="OPENAI_API_KEY"},
        @{Name="Stripe"; Pattern="STRIPE_SECRET_KEY"},
        @{Name="GitHub"; Pattern="GITHUB_API_TOKEN"}
    )
    
    foreach ($service in $serviceKeys) {
        $found = Select-String -Path $envFile -Pattern $service.Pattern -Quiet
        if ($found) {
            Write-Host "   ✅ $($service.Name): Configurado" -ForegroundColor Green
            $services += $service.Name
        } else {
            Write-Host "   ❌ $($service.Name): No configurado" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ❌ Archivo .env no encontrado" -ForegroundColor Red
}

# 5. Scripts y Automatización
Write-Host "`n5. SCRIPTS Y AUTOMATIZACIÓN" -ForegroundColor Yellow
$scriptsPath = "$projectRoot\scripts"

if (Test-Path $scriptsPath) {
    $scriptCategories = @{
        "browser"="Chrome/Optimización"
        "email"="Email/Automatización"
        "social-media"="Social Media"
        "client"="Cliente/Onboarding"
        "mobile"="Móvil/Pixel"
    }
    
    foreach ($category in $scriptCategories.Keys) {
        $categoryPath = Join-Path $scriptsPath $category
        if (Test-Path $categoryPath) {
            $scriptCount = (Get-ChildItem $categoryPath -Filter "*.ps1").Count
            Write-Host "   ✅ $($scriptCategories[$category]): $scriptCount scripts" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $($scriptCategories[$category]): No encontrado" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ❌ Directorio scripts no encontrado" -ForegroundColor Red
}

# 6. Estado de Deploy
Write-Host "`n6. ESTADO DE DEPLOY" -ForegroundColor Yellow

# Verificar GitHub Actions
$githubActionsPath = "$projectRoot\.github\workflows"
if (Test-Path $githubActionsPath) {
    $workflows = Get-ChildItem $githubActionsPath -Filter "*.yml"
    Write-Host "   ✅ GitHub Actions: $($workflows.Count) workflows" -ForegroundColor Green
    
    foreach ($workflow in $workflows) {
        Write-Host "      📄 $($workflow.Name)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ GitHub Actions no configurado" -ForegroundColor Red
}

# Verificar Vercel
$vercelPath = "$projectRoot\infra\vercel"
if (Test-Path $vercelPath) {
    $vercelFiles = Get-ChildItem $vercelPath -Filter "*.json"
    Write-Host "   ✅ Vercel: $($vercelFiles.Count) configuraciones" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Vercel no configurado" -ForegroundColor Yellow
}

# 7. Métricas y Estadísticas
Write-Host "`n7. MÉTRICAS Y ESTADÍSTICAS" -ForegroundColor Yellow

# Contar archivos por tipo
$totalFiles = (Get-ChildItem $projectRoot -Recurse -File).Count
$totalDirs = (Get-ChildItem $projectRoot -Recurse -Directory).Count
$ps1Scripts = (Get-ChildItem $projectRoot -Recurse -Filter "*.ps1").Count
$tsFiles = (Get-ChildItem $projectRoot -Recurse -Filter "*.ts").Count
$jsFiles = (Get-ChildItem $projectRoot -Recurse -Filter "*.js").Count

Write-Host "   📁 Total directorios: $totalDirs" -ForegroundColor Cyan
Write-Host "   📄 Total archivos: $totalFiles" -ForegroundColor Cyan
Write-Host "   🔧 Scripts PowerShell: $ps1Scripts" -ForegroundColor Cyan
Write-Host "   📘 TypeScript: $tsFiles" -ForegroundColor Cyan
Write-Host "   📜 JavaScript: $jsFiles" -ForegroundColor Cyan

# 8. Análisis de Madurez
Write-Host "`n8. ANÁLISIS DE MADUREZ" -ForegroundColor Yellow

$maturityScore = 0
$maxScore = 10

# Frontend funcional
if (Test-Path "$frontendPath\dist") { $maturityScore += 2 }
# Backend configurado
if (Test-Path $backendPath) { $maturityScore += 1 }
# Servicios configurados
if ($services.Count -ge 5) { $maturityScore += 2 }
# Scripts disponibles
if ($ps1Scripts -ge 20) { $maturityScore += 1 }
# GitHub Actions
if (Test-Path $githubActionsPath) { $maturityScore += 1 }
# Documentación
if (Test-Path "$projectRoot\docs") { $maturityScore += 1 }
# Infraestructura
if (Test-Path "$projectRoot\infra") { $maturityScore += 1 }
# Tests
if ((Get-ChildItem $projectRoot -Recurse -Filter "*.test.*").Count -gt 0) { $maturityScore += 1 }

$percentage = [math]::Round(($maturityScore / $maxScore) * 100, 0)
Write-Host "   📊 Puntuación de madurez: $maturityScore/$maxScore ($percentage%)" -ForegroundColor $(if($percentage -ge 80) {"Green"} elseif($percentage -ge 60) {"Yellow"} else {"Red"})

# 9. Estado de Dominios
Write-Host "`n9. ESTADO DE DOMINIOS" -ForegroundColor Yellow

$domains = @("aigestion.net", "admin.aigestion.net", "client.aigestion.net", "demo.aigestion.net")

foreach ($domain in $domains) {
    try {
        $response = Invoke-WebRequest -Uri "https://$domain" -TimeoutSec 10 -ErrorAction Stop
        Write-Host "   ✅ $domain`: HTTP $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ $domain`: No accesible" -ForegroundColor Red
    }
}

Write-Host "`nANÁLISIS COMPLETADO" -ForegroundColor Cyan
