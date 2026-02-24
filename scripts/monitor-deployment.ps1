#!/usr/bin/env pwsh

# =============================================================================
# DEPLOYMENT MONITOR - AIGESTION
# =============================================================================

Write-Host "DEPLOYMENT MONITOR - AIGESTION" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

# 1. Verificar estado del repositorio
Write-Host "`n1. ESTADO DEL REPOSITORIO" -ForegroundColor Yellow

$lastCommit = git log --oneline -1
Write-Host "Último commit: $lastCommit" -ForegroundColor Green

$branch = git branch --show-current
Write-Host "Branch actual: $branch" -ForegroundColor Green

# 2. Verificar estado del build local
Write-Host "`n2. ESTADO DEL BUILD LOCAL" -ForegroundColor Yellow

$distPath = "c:\Users\Alejandro\AIGestion\frontend\apps\website-epic\dist"
if (Test-Path $distPath) {
    $files = Get-ChildItem $distPath -Recurse -File
    $totalSize = ($files | Measure-Object -Property Length -Sum).Sum / 1MB
    
    Write-Host "✅ Build local encontrado" -ForegroundColor Green
    Write-Host "📁 Archivos: $($files.Count)" -ForegroundColor Cyan
    Write-Host "📦 Tamaño: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan
    
    # Archivos principales
    $mainFiles = @("index.html", "admin.html", "client.html", "demo.html")
    foreach ($file in $mainFiles) {
        $filePath = Join-Path $distPath $file
        if (Test-Path $filePath) {
            $size = (Get-Item $filePath).Length
            Write-Host "  ✅ $file ($size bytes)" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $file (no encontrado)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Build local no encontrado" -ForegroundColor Red
}

# 3. Verificar configuración GitHub Actions
Write-Host "`n3. CONFIGURACIÓN GITHUB ACTIONS" -ForegroundColor Yellow

$workflowPath = "c:\Users\Alejandro\AIGestion\.github\workflows\deploy-website.yml"
if (Test-Path $workflowPath) {
    Write-Host "✅ Workflow deploy-website.yml encontrado" -ForegroundColor Green
    
    $workflowContent = Get-Content $workflowPath
    if ($workflowContent -match "on:\s*push") {
        Write-Host "✅ Trigger configurado para push" -ForegroundColor Green
    }
    if ($workflowContent -match "uses:\s*actions/deploy-pages") {
        Write-Host "✅ Deploy a GitHub Pages configurado" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Workflow no encontrado" -ForegroundColor Red
}

# 4. Verificar estado del website
Write-Host "`n4. ESTADO DEL WEBSITE" -ForegroundColor Yellow

$domains = @("aigestion.net", "client.aigestion.net", "demo.aigestion.net")
$websiteStatus = @()

foreach ($domain in $domains) {
    try {
        $response = Invoke-WebRequest -Uri "https://$domain" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200) {
            Write-Host "✅ $domain - HTTP $statusCode" -ForegroundColor Green
            $websiteStatus += @{ Domain = $domain; Status = "Working"; Code = $statusCode }
        } else {
            Write-Host "⚠️  $domain - HTTP $statusCode" -ForegroundColor Yellow
            $websiteStatus += @{ Domain = $domain; Status = "Warning"; Code = $statusCode }
        }
    } catch {
        Write-Host "❌ $domain - No accesible" -ForegroundColor Red
        $websiteStatus += @{ Domain = $domain; Status = "Failed"; Code = "Error" }
    }
}

# 5. Verificar variables de entorno críticas
Write-Host "`n5. VARIABLES DE ENTORNO CRÍTICAS" -ForegroundColor Yellow

$envFile = "c:\Users\Alejandro\AIGestion\.env"
$criticalVars = @(
    @{ Name = "SUPABASE_URL"; Required = $true },
    @{ Name = "GEMINI_API_KEY"; Required = $true },
    @{ Name = "OPENAI_API_KEY"; Required = $false },
    @{ Name = "ANTIGRAVITY_MODEL_API_KEY"; Required = $true }
)

$envStatus = @()
foreach ($var in $criticalVars) {
    $found = Select-String -Path $envFile -Pattern "$($var.Name)=" -Quiet
    if ($found) {
        Write-Host "✅ $($var.Name) - Configurado" -ForegroundColor Green
        $envStatus += @{ Variable = $var.Name; Status = "Configured" }
    } elseif ($var.Required) {
        Write-Host "❌ $($var.Name) - REQUERIDO" -ForegroundColor Red
        $envStatus += @{ Variable = $var.Name; Status = "Missing Required" }
    } else {
        Write-Host "⚠️  $($var.Name) - No configurado (opcional)" -ForegroundColor Yellow
        $envStatus += @{ Variable = $var.Name; Status = "Optional" }
    }
}

# 6. Diagnóstico y recomendaciones
Write-Host "`n6. DIAGNÓSTICO Y RECOMENDACIONES" -ForegroundColor Yellow

$issues = @()
$recommendations = @()

# Verificar issues
$workingSites = ($websiteStatus | Where-Object { $_.Status -eq "Working" }).Count
if ($workingSites -lt 3) {
    $issues += "Algunos dominios no funcionan"
    $recommendations += "Verificar configuración DNS y GitHub Pages"
}

$missingRequired = ($envStatus | Where-Object { $_.Status -eq "Missing Required" }).Count
if ($missingRequired -gt 0) {
    $issues += "Faltan variables de entorno requeridas"
    $recommendations += "Configurar variables críticas en .env"
}

if (-not (Test-Path $distPath)) {
    $issues += "Build local no encontrado"
    $recommendations += "Ejecutar npm run build en frontend"
}

# Mostrar resultados
if ($issues.Count -eq 0) {
    Write-Host "✅ NO SE DETECTARON PROBLEMAS CRÍTICOS" -ForegroundColor Green
    Write-Host "🎉 El deploy parece estar funcionando correctamente" -ForegroundColor Green
} else {
    Write-Host "⚠️  PROBLEMAS DETECTADOS:" -ForegroundColor Yellow
    $issues | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
    
    Write-Host "`n💡 RECOMENDACIONES:" -ForegroundColor Cyan
    $recommendations | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
}

# 7. Estado general del deploy
Write-Host "`n7. ESTADO GENERAL DEL DEPLOY" -ForegroundColor Yellow

$score = 0
$maxScore = 5

if (Test-Path $distPath) { $score++ }
if ($workingSites -ge 2) { $score++ }
if ($missingRequired -eq 0) { $score++ }
if (Test-Path $workflowPath) { $score++ }
if ($lastCommit -match "deploy") { $score++ }

$percentage = [math]::Round(($score / $maxScore) * 100, 0)
Write-Host "📊 Puntuación de deploy: $score/$maxScore ($percentage%)" -ForegroundColor $(if($percentage -ge 80) {"Green"} elseif($percentage -ge 60) {"Yellow"} else {"Red"})

# 8. Próximos pasos
Write-Host "`n8. PRÓXIMOS PASOS" -ForegroundColor Yellow

if ($percentage -ge 80) {
    Write-Host "🚀 DEPLOY EXITOSO - Próximos pasos:" -ForegroundColor Green
    Write-Host "  1. Monitorear rendimiento del website" -ForegroundColor White
    Write-Host "  2. Configurar analytics y monitoring" -ForegroundColor White
    Write-Host "  3. Optimizar para producción" -ForegroundColor White
    Write-Host "  4. Escalar a más usuarios" -ForegroundColor White
} elseif ($percentage -ge 60) {
    Write-Host "⚠️  DEPLOY PARCIAL - Acciones necesarias:" -ForegroundColor Yellow
    Write-Host "  1. Verificar GitHub Actions execution" -ForegroundColor White
    Write-Host "  2. Configurar variables faltantes" -ForegroundColor White
    Write-Host "  3. Resolver problemas de dominios" -ForegroundColor White
    Write-Host "  4. Re-deploy si es necesario" -ForegroundColor White
} else {
    Write-Host "❌ DEPLOY CON ERRORES - Acciones críticas:" -ForegroundColor Red
    Write-Host "  1. Ejecutar build local" -ForegroundColor White
    Write-Host "  2. Configurar variables de entorno" -ForegroundColor White
    Write-Host "  3. Verificar configuración GitHub Actions" -ForegroundColor White
    Write-Host "  4. Hacer push y monitorear deploy" -ForegroundColor White
}

Write-Host "`n🎯 MONITOREO COMPLETADO" -ForegroundColor Cyan
