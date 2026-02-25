#!/usr/bin/env pwsh

# =============================================================================
# CONFIGURE VERCEL ENVIRONMENT AUTOMATICALLY - AIGESTION
# =============================================================================

Write-Host "CONFIGURE VERCEL ENVIRONMENT AUTOMATICALLY - AIGESTION" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

Write-Host "Configurando variables de entorno para Vercel..." -ForegroundColor Yellow

# Variables de entorno para configurar
$envVars = @{
    "VITE_SUPABASE_URL" = "https://nbymcxvlcfyhebzjurml.supabase.co"
    "VITE_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieW1jeHZsY2Z5aGViemp1cm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NzU1MDAsImV4cCI6MjA4NTE1MTUwMH0.naLyb4Fc2o0-c4K2S_D7rEXasUN-xu7zcBtX-nVHldA"
    "VITE_GOOGLE_ANALYTICS_ID" = "G-XXXXXXXXXX"
    "VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID" = "G-XXXXXXXXXX"
    "VITE_GOOGLE_ANALYTICS_DEBUG" = "false"
    "VITE_GOOGLE_ANALYTICS_TRACKING" = "true"
    "VITE_APP_NAME" = "AIGestion Nexus"
    "VITE_APP_VERSION" = "2.0.0"
    "VITE_APP_URL" = "https://aigestion.net"
    "VITE_API_BASE_URL" = "/api"
    "VITE_MAINTENANCE_MODE" = "false"
}

Write-Host "`nVariables a configurar:" -ForegroundColor White
foreach ($var in $envVars.GetEnumerator()) {
    $value = if ($var.Value.Length -gt 50) { $var.Value.Substring(0, 50) + "..." } else { $var.Value }
    Write-Host "  $($var.Name) = $value" -ForegroundColor Gray
}

Write-Host "`n📋 INSTRUCCIONES MANUALES PARA VERCEL:" -ForegroundColor Yellow
Write-Host "1. Ve a: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Busca el proyecto: aigestions-projects/website-epic" -ForegroundColor White
Write-Host "3. Ve a Settings → Environment Variables" -ForegroundColor White
Write-Host "4. Agrega las siguientes variables:" -ForegroundColor White

Write-Host "`nVARIABLES DE ENTORNO:" -ForegroundColor Cyan
foreach ($var in $envVars.GetEnumerator()) {
    Write-Host "  $($var.Name)" -ForegroundColor Green
    Write-Host "  Valor: $($var.Value)" -ForegroundColor White
    Write-Host "  Environments: Production, Preview, Development" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "`n5. Una vez configuradas todas las variables:" -ForegroundColor Yellow
Write-Host "   - Haz clic en Save" -ForegroundColor White
Write-Host "   - Espera a que se guarden" -ForegroundColor White
Write-Host "   - Ejecuta: npx vercel --prod --force" -ForegroundColor White
Write-Host "   - Verifica el deploy con: curl -I https://aigestion.net" -ForegroundColor White

Write-Host "`n🔥 VARIABLES PREPARADAS PARA VERCEL" -ForegroundColor Green
Write-Host "📊 PRÓXIMO: CONFIGURAR MANUALMENTE Y DEPLOY" -ForegroundColor Cyan

# Crear archivo .env.local para deploy
$envLocalContent = @"
# Generated automatically for Vercel deploy
# AIGestion Environment Variables
"@

foreach ($var in $envVars.GetEnumerator()) {
    $envLocalContent += "`n$($var.Name)=$($var.Value)"
}

$envLocalPath = "c:\Users\Alejandro\AIGestion\frontend\apps\website-epic\.env.local"
$envLocalContent | Out-File -FilePath $envLocalPath -Encoding UTF8
Write-Host "✅ Archivo .env.local creado: $envLocalPath" -ForegroundColor Green

Write-Host "`n🎯 ESTADO: VARIABLES LISTAS PARA CONFIGURACIÓN MANUAL" -ForegroundColor Magenta
Write-Host "📊 PRÓXIMO: CONFIGURAR VERCEL Y DEPLOY" -ForegroundColor Cyan
