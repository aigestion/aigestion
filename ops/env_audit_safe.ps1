#!/usr/bin/env pwsh
# ============================================================
# env_audit_safe.ps1 — Auditoría de seguridad del .env
# MODO SEGURO: NUNCA modifica el .env en disco.
# Solo genera un reporte legible.
# ============================================================
param(
  [string]$EnvFile = "C:\Users\Alejandro\AIGestion\.env",
  [string]$ReportDir = "C:\Users\Alejandro\AIGestion\ops\audit"
)

$timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
$reportFile = "$ReportDir\env_audit_$timestamp.txt"
New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null

# ── Known-safe placeholder patterns ──
$safePatterns = @(
  "^mongodb\+srv://",  # MongoDB Atlas
  "^sk-",             # OpenAI / DeepSeek
  "^sk_",             # Stripe
  "^AIza",            # Google API key
  "^ey",              # JWT / Supabase / other base64
  "^tel:",            # Twilio
  "^AC",              # Twilio SID
  "^\d+:AA",          # Telegram bot token
  "aig-",             # AIGestion internal tokens
  "^amqp://",         # RabbitMQ URL
  "^https://",        # URLs (webhooks, DSNs)
  "^postgres://",     # Postgres URIs
  "^redis://"         # Redis URIs
)

$lines = Get-Content $EnvFile
$report = @()
$report += "=== AIGestion .env Security Audit ==="
$report += "Date: $(Get-Date)"
$report += "File: $EnvFile"
$report += "Total lines: $($lines.Count)"
$report += ""

$issues = @(); $ok = 0; $empty = 0

foreach ($line in $lines) {
  if ($line -match "^#" -or $line.Trim() -eq "") { continue }
  if ($line -match "^([A-Z_0-9]+)=(.*)$") {
    $key = $Matches[1]; $val = $Matches[2].Trim()
    if ($val -eq "" -or $val.Length -lt 3) {
      $issues += "EMPTY: $key"
      $empty++
    } elseif ($val -match "REDACTED|CONFIGURE_ME|PLACEHOLDER|NEEDS_RESTORE|YOUR_API_KEY|changeme") {
      $issues += "UNSET: $key = $val"
    } elseif ($val.Length -lt 8 -and $key -match "KEY|TOKEN|SECRET|PASSWORD") {
      $issues += "TOO_SHORT: $key ($($val.Length) chars) — may be incomplete"
    } else {
      $ok++
    }
  }
}

$report += "✅ Valid credentials: $ok"
$report += "⚠️  Issues found: $($issues.Count)"
$report += ""
if ($issues.Count -gt 0) {
  $report += "=== Issues (NOT fixing — report only) ==="
  $issues | ForEach-Object { $report += "  $_" }
}
$report += ""
$report += "=== NOTE: This script NEVER modifies .env ==="
$report += "To fix issues, edit .env manually, then run: pwsh ops/backup_env_to_gsm.ps1"

$report | Set-Content $reportFile -Encoding UTF8
Write-Host ($report -join "`n")
Write-Host ""
Write-Host "Report saved to: $reportFile" -ForegroundColor Cyan
