# ========================================
# SCRIPT DE VERIFICACION DE DESPLIEGUE
# AIGestion - website-epic
# PowerShell Version (Ultra-Robust)
# ========================================

$ErrorActionPreference = "Continue"

Write-Host "---------------------------------------------------------------"
Write-Host "     VERIFICACION DE DESPLIEGUE - WEBSITE-EPIC                "
Write-Host "---------------------------------------------------------------"

# FunciÃ³n para imprimir OK
function Print-OK {
  param($mensaje)
  Write-Host "SUCCESS: $mensaje" -ForegroundColor Green
}

# FunciÃ³n para imprimir ERROR
function Print-Error {
  param($mensaje)
  Write-Host "ERROR: $mensaje" -ForegroundColor Red
}

# FunciÃ³n para imprimir WARNING
function Print-Warning {
  param($mensaje)
  Write-Host "WARNING: $mensaje" -ForegroundColor Yellow
}

# 1. VERIFICAR NODE.JS
Write-Host "Verificando Node.js..."
$nodeV = node -v
if ($LASTEXITCODE -eq 0) {
  Print-OK "Node.js $nodeV instalado"
}
else {
  Print-Error "Node.js NO instalado"
}

# 2. VERIFICAR PNPM
Write-Host "Verificando pnpm..."
$pnpmV = pnpm -v
if ($LASTEXITCODE -eq 0) {
  Print-OK "pnpm v$pnpmV instalado"
}
else {
  Print-Warning "pnpm NO instalado"
}

# 3. VERIFICAR ESTRUCTURA DEL PROYECTO
Write-Host "Verificando estructura del proyecto..."
$items = @(
  "frontend\apps\website-epic\package.json",
  "frontend\apps\website-epic\vite.config.ts",
  "vercel.json",
  "docker-compose.yml"
)

foreach ($item in $items) {
  if (Test-Path $item) {
    Print-OK "$item encontrado"
  }
  else {
    Print-Error "$item NO ENCONTRADO"
  }
}

# 4. VERIFICAR BUILD
Write-Host "Verificando build..."
if (Test-Path "frontend\apps\website-epic\dist") {
  Print-OK "Build dist/ existe"
}
else {
  Print-Warning "Build dist/ NO existe (Ejecutar: npm run build en frontend/apps/website-epic)"
}

Write-Host "---------------------------------------------------------------"
Write-Host "VERIFICACION COMPLETADA"
Write-Host "---------------------------------------------------------------"
