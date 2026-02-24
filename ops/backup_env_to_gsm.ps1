#!/usr/bin/env pwsh
# ============================================================
# backup_env_to_gsm.ps1 — ENV → Google Secret Manager Full Sync
# Ejecutar tras añadir/modificar cualquier credencial en .env
# Uso: pwsh ops/backup_env_to_gsm.ps1
# Uso (dry-run): pwsh ops/backup_env_to_gsm.ps1 -DryRun
# ============================================================
param(
  [string]$Project = "aigestion-sovereign-2026",
  [string]$EnvFile = "C:\Users\Alejandro\AIGestion\.env",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# ── Validate .env health before sync ──────────────────────────────────────────
$lines = Get-Content $EnvFile
$badLines = $lines | Where-Object { $_ -match "\[REDACTED\]|NEEDS_RESTORE_FROM_PLATFORM" }
if ($badLines.Count -gt 0) {
  Write-Host "❌ ABORT: .env contains $($badLines.Count) unrestored REDACTED values:" -ForegroundColor Red
  $badLines | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
  Write-Host ""
  Write-Host "Restore those values before syncing to GSM." -ForegroundColor Red
  exit 1
}

# ── Build key-value map from .env ─────────────────────────────────────────────
$envMap = @{}
foreach ($line in $lines) {
  if ($line -match "^([A-Z_0-9]+)=(.+)$") {
    $k = $Matches[1]; $v = $Matches[2].Trim()
    if ($v -ne "" -and $v.Length -gt 0 -and $v -notmatch "^#") {
      $envMap[$k] = $v
    }
  }
}

Write-Host "📦 Found $($envMap.Count) env vars in $EnvFile" -ForegroundColor Cyan

# ── Keys to always sync (critical for Cloud Run / infra) ─────────────────────
$criticalKeys = @(
  # Auth & Core
  "JWT_SECRET", "ENCRYPTION_KEY", "API_KEY", "AIGESTION_API_KEY", "AIGESTION_INTERNAL_PASSWORD",
  # Database
  "MONGODB_URI", "MONGO_ROOT_PASSWORD", "POSTGRES_PASSWORD", "REDIS_URL",
  # AI Services
  "GEMINI_API_KEY", "ANTHROPIC_API_KEY", "OPENAI_API_KEY", "DEEPSEEK_API_KEY",
  "ELEVENLABS_API_KEY", "VAPI_PRIVATE_KEY", "REPLICATE_API_TOKEN", "STABILITY_API_KEY",
  # Voice & Comms
  "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER", "TELEGRAM_BOT_TOKEN",
  # Storage & Search
  "PINECONE_API_KEY", "BROWSERLESS_API_KEY", "ML_SERVICE_API_KEY",
  # Payments
  "STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET",
  "PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET",
  # Cloud
  "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY",
  # Dev Tools
  "GITHUB_API_TOKEN", "VERCEL_TOKEN", "RAILWAY_TOKEN", "SUPABASE_KEY", "SUPABASE_ANON_KEY",
  # External APIs
  "FIGMA_ACCESS_TOKEN", "YOUTUBE_API_KEY", "META_APP_SECRET",
  "SENTRY_DSN", "MCP_API_KEY", "N8N_JWT_TOKEN", "IA_ENGINE_API_KEY"
)

# ── Sync to GSM ───────────────────────────────────────────────────────────────
$tmp = "$env:TEMP\gsm_sync_$(Get-Random)"
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$synced = 0; $skipped = 0; $errors = 0

foreach ($key in $criticalKeys) {
  if (-not $envMap.ContainsKey($key)) { $skipped++; continue }
  $val = $envMap[$key]
  if ($val.Length -lt 3) { $skipped++; continue }

  if ($DryRun) {
    Write-Host "DRY-RUN: $key ($($val.Length) chars)" -ForegroundColor DarkCyan
    $synced++
    continue
  }

  $tmpFile = "$tmp\$key.txt"
  [System.IO.File]::WriteAllText($tmpFile, $val, $utf8NoBom)
  try {
    $existing = gcloud secrets describe $key --project=$Project --format="value(name)" 2>$null
    if (-not $existing) {
      gcloud secrets create $key --data-file=$tmpFile --replication-policy="automatic" --project=$Project 2>&1 | Out-Null
      Write-Host "  ✅ CREATED: $key" -ForegroundColor Green
    }
    else {
      gcloud secrets versions add $key --data-file=$tmpFile --project=$Project 2>&1 | Out-Null
      Write-Host "  🔄 UPDATED: $key" -ForegroundColor Cyan
    }
    $synced++
  }
  catch {
    Write-Host "  ❌ ERROR: $key — $_" -ForegroundColor Red
    $errors++
  }
  Remove-Item $tmpFile -ErrorAction SilentlyContinue
}

Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "══════════════════════════════════════════" -ForegroundColor White
Write-Host "  ✅ Synced:  $synced secrets" -ForegroundColor Green
Write-Host "  ⏭  Skipped: $skipped (not in .env)" -ForegroundColor Yellow
Write-Host "  ❌ Errors:  $errors" -ForegroundColor $(if ($errors -gt 0) { "Red" } else { "Green" })
Write-Host "══════════════════════════════════════════" -ForegroundColor White

if (-not $DryRun -and $synced -gt 0) {
  Write-Host ""
  Write-Host "Next: redeploy Cloud Run to pick up new secret versions:" -ForegroundColor White
  Write-Host "  gcloud run deploy backend-aigestion --image=gcr.io/$Project/backend-aigestion:latest --region=europe-southwest1 --project=$Project" -ForegroundColor Gray
}

if ($errors -gt 0) { exit 1 }
