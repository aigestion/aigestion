#!/usr/bin/env pwsh
# ============================================================
# restore_env_from_gsm.ps1 — Restauración de emergencia
# Descarga TODOS los secrets de GSM y restaura el .env
# Uso: pwsh ops/restore_env_from_gsm.ps1
# ============================================================
param(
  [string]$Project = "aigestion-sovereign-2026",
  [string]$EnvFile = "C:\Users\Alejandro\AIGestion\.env"
)

Write-Host "🔄 Restaurando secrets de GSM → $EnvFile" -ForegroundColor Cyan

$secrets = gcloud secrets list --project=$Project --format="value(name)" 2>$null
if (-not $secrets) { Write-Host "❌ No se pueden listar secrets en $Project" -ForegroundColor Red; exit 1 }

$lines = Get-Content $EnvFile
$restored = 0

foreach ($secret in $secrets) {
  $val = gcloud secrets versions access latest --secret=$secret --project=$Project 2>$null
  if (-not $val -or $val.Length -lt 3) { continue }

  # Find and replace this key in .env
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "^$secret=(NEEDS_RESTORE_FROM_PLATFORM|\[REDACTED\]|)$") {
      $lines[$i] = "$secret=$val"
      $restored++
      Write-Host "  ✅ RESTORED: $secret ($($val.Length) chars)" -ForegroundColor Green
      break
    }
  }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines($EnvFile, $lines, $utf8NoBom)

Write-Host ""
Write-Host "══════════════════════════════════════" -ForegroundColor White
Write-Host "  Restored $restored keys from GSM" -ForegroundColor Green
$remaining = ($lines | Where-Object { $_ -match "NEEDS_RESTORE|REDACTED" }).Count
if ($remaining -gt 0) {
  Write-Host "  ⚠️  $remaining keys still need manual restore" -ForegroundColor Yellow
}
Write-Host "══════════════════════════════════════" -ForegroundColor White
