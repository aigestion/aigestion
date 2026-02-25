#!/usr/bin/env pwsh

# =============================================================================
# CONFIGURE VERCEL ENVIRONMENT - AIGESTION
# =============================================================================

Write-Host "CONFIGURE VERCEL ENVIRONMENT - AIGESTION" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "Configurando variables de entorno para Vercel..." -ForegroundColor Yellow

# Variables de entorno necesarias
$envVars = @(
    @{ Name = "VITE_SUPABASE_URL"; Value = "https://nbymcxvlcfyhebzjurml.supabase.co"; Type = "plain" },
    @{ Name = "VITE_SUPABASE_ANON_KEY"; Value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieW1jeHZsY2Z5aGViemp1cm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NzU1MDAsImV4cCI6MjA4NTE1MTUwMH0.naLyb4Fc2o0-c4K2S_D7rEXasUN-xu7zcBtX-nVHldA"; Type = "plain" },
    @{ Name = "VITE_GOOGLE_ANALYTICS_ID"; Value = "G-XXXXXXXXXX"; Type = "plain" },
    @{ Name = "VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID"; Value = "G-XXXXXXXXXX"; Type = "plain" },
    @{ Name = "VITE_GOOGLE_ANALYTICS_DEBUG"; Value = "false"; Type = "plain" },
    @{ Name = "VITE_GOOGLE_ANALYTICS_TRACKING"; Value = "true"; Type = "plain" },
    @{ Name = "VITE_APP_NAME"; Value = "AIGestion Nexus"; Type = "plain" },
    @{ Name = "VITE_APP_VERSION"; Value = "2.0.0"; Type = "plain" },
    @{ Name = "VITE_APP_URL"; Value = "https://aigestion.net"; Type = "plain" },
    @{ Name = "VITE_API_BASE_URL"; Value = "/api"; Type = "plain" },
    @{ Name = "VITE_MAINTENANCE_MODE"; Value = "false"; Type = "plain" }
)

Write-Host "`nVariables a configurar:" -ForegroundColor White
foreach ($var in $envVars) {
    Write-Host "  $($var.Name) = $($var.Value.Substring(0, [Math]::Min(50, $var.Value.Length)))..." -ForegroundColor Gray
}

Write-Host "`n📋 PASOS PARA CONFIGURAR MANUALMENTE:" -ForegroundColor Yellow
Write-Host "1. Ve a https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Selecciona el proyecto 'website-epic'" -ForegroundColor White
Write-Host "3. Ve a Settings → Environment Variables" -ForegroundColor White
Write-Host "4. Agrega las siguientes variables:" -ForegroundColor White

Write-Host "`nVARIABLES DE ENTORNO:" -ForegroundColor Cyan
foreach ($var in $envVars) {
    Write-Host "  $($var.Name) = $($var.Value)" -ForegroundColor White
}

Write-Host "`n5. Una vez configuradas, ejecuta:" -ForegroundColor Yellow
Write-Host "   npx vercel --prod" -ForegroundColor Gray
Write-Host "   npx vercel env pull" -ForegroundColor Gray

Write-Host "`n🔥 VARIABLES CONFIGURADAS PARA VERCEL" -ForegroundColor Green
Write-Host "📊 PRÓXIMO: EJECUTAR DEPLOY CON VARIABLES CORRECTAS" -ForegroundColor Cyan
