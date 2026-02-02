# AIGestion.net - Google Cloud Configuration Validator (PowerShell)
# Script para verificar que todas las configuraciones de Google Cloud estén en lugar
# Usage: .\validate-gcp-config.ps1

Write-Host "🚀 ==========================================" -ForegroundColor Cyan
Write-Host "   AIGestion.net - NIVEL DIOS Validator" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$checksPass = 0
$checksFail = 0

# Función para validar
function Test-Check {
    param(
        [string]$Name,
        [scriptblock]$Condition
    )
    
    Write-Host "Checking $Name... " -NoNewline
    
    try {
        if (& $Condition) {
            Write-Host "✓" -ForegroundColor Green
            $global:checksPass++
        } else {
            Write-Host "✗" -ForegroundColor Red
            $global:checksFail++
        }
    } catch {
        Write-Host "✗" -ForegroundColor Red
        $global:checksFail++
    }
}

# ========================================
# 1. Verificar Credenciales
# ========================================
Write-Host "1. Verificando Credenciales" -ForegroundColor Blue

Test-Check "Service Account Key exists" { Test-Path ".\credentials\aigestion-master-key.json" }
Test-Check "Service Account Key is valid JSON" { 
    $json = Get-Content ".\credentials\aigestion-master-key.json" -Raw
    try { ConvertFrom-Json $json; return $true } catch { return $false }
}
Test-Check ".gitignore includes credentials" { 
    (Get-Content ".\.gitignore" -ErrorAction SilentlyContinue) -match "credentials/"
}

Write-Host ""

# ========================================
# 2. Verificar Variables de Entorno
# ========================================
Write-Host "2. Verificando Variables de Entorno" -ForegroundColor Blue

Test-Check ".env file exists" { Test-Path ".\.env" }
Test-Check "GOOGLE_CLOUD_PROJECT_ID set" { 
    (Get-Content ".\.env") -match "GOOGLE_CLOUD_PROJECT_ID=aigestion-net"
}
Test-Check "VERTEX_AI_LOCATION set" { 
    (Get-Content ".\.env") -match "VERTEX_AI_LOCATION=europe-west1"
}
Test-Check "GCS_BUCKET_BACKUPS set" { 
    (Get-Content ".\.env") -match "GCS_BUCKET_BACKUPS="
}
Test-Check "SECRET_MANAGER_ENABLED set" { 
    (Get-Content ".\.env") -match "SECRET_MANAGER_ENABLED=true"
}
Test-Check "CLOUD_LOGGING_ENABLED set" { 
    (Get-Content ".\.env") -match "CLOUD_LOGGING_ENABLED=true"
}
Test-Check "CLOUD_MONITORING_ENABLED set" { 
    (Get-Content ".\.env") -match "CLOUD_MONITORING_ENABLED=true"
}

Write-Host ""

# ========================================
# 3. Verificar Google Cloud CLI
# ========================================
Write-Host "3. Verificando Google Cloud CLI" -ForegroundColor Blue

Test-Check "gcloud installed" { 
    $null = Get-Command gcloud -ErrorAction SilentlyContinue
    $?
}

Test-Check "gcloud project configured" { 
    $project = & gcloud config get-value project 2>$null
    $project -eq "aigestion-net"
}

# ========================================
# 4. Verificar APIs habilitadas (con gcloud)
# ========================================
Write-Host "4. Verificando APIs Habilitadas" -ForegroundColor Blue

Test-Check "Vertex AI API enabled" { 
    $services = & gcloud services list --enabled --project aigestion-net 2>$null
    $services -match "aiplatform.googleapis.com"
}

Test-Check "Cloud Storage API enabled" { 
    $services = & gcloud services list --enabled --project aigestion-net 2>$null
    $services -match "storage-api.googleapis.com"
}

Test-Check "Secret Manager API enabled" { 
    $services = & gcloud services list --enabled --project aigestion-net 2>$null
    $services -match "secretmanager.googleapis.com"
}

Test-Check "Cloud Logging API enabled" { 
    $services = & gcloud services list --enabled --project aigestion-net 2>$null
    $services -match "logging.googleapis.com"
}

Write-Host ""

# ========================================
# 5. Verificar Google Cloud Resources
# ========================================
Write-Host "5. Verificando Recursos de Google Cloud" -ForegroundColor Blue

Test-Check "Service Account exists" { 
    $sa = & gcloud iam service-accounts describe aigestion-master@aigestion-net.iam.gserviceaccount.com --project aigestion-net 2>$null
    $sa -match "aigestion-master"
}

# Verificar buckets si gsutil está disponible
if (Get-Command gsutil -ErrorAction SilentlyContinue) {
    Test-Check "GCS Bucket: backups exists" { 
        & gsutil ls -b gs://aigestion-backups 2>$null
    }
    
    Test-Check "GCS Bucket: uploads exists" { 
        & gsutil ls -b gs://aigestion-uploads 2>$null
    }
    
    Test-Check "GCS Bucket: models exists" { 
        & gsutil ls -b gs://aigestion-models 2>$null
    }
}

Write-Host ""

# ========================================
# 6. Verificar Secret Manager
# ========================================
Write-Host "6. Verificando Secret Manager" -ForegroundColor Blue

Test-Check "Secret Manager accessible" { 
    $secrets = & gcloud secrets list --project aigestion-net 2>$null
    $secrets.Length -gt 0
}

Write-Host ""

# ========================================
# 7. Verificar Configuración Local
# ========================================
Write-Host "7. Verificando Configuración Local" -ForegroundColor Blue

Test-Check "MongoDB running" { 
    $mongo = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    $mongo.TcpTestSucceeded
}

Test-Check "Backend dependencies installed" { 
    Test-Path ".\node_modules"
}

Test-Check "TypeScript config exists" { 
    Test-Path ".\tsconfig.json"
}

Test-Check "Docker compose file exists" { 
    Test-Path "..\docker-compose.yml"
}

Write-Host ""

# ========================================
# 8. Verificar Configuración de Backend
# ========================================
Write-Host "8. Verificando Configuración de Backend" -ForegroundColor Blue

Test-Check "src/server.ts exists" { 
    Test-Path ".\src\server.ts"
}

Test-Check "src/services/telegram-bot.handler.ts exists" { 
    Test-Path ".\src\services\telegram-bot.handler.ts"
}

Test-Check "src/services/daniela-ai.service.ts exists" { 
    Test-Path ".\src\services\daniela-ai.service.ts"
}

Test-Check "src/config/inversify.config.ts exists" { 
    Test-Path ".\src\config\inversify.config.ts"
}

Write-Host ""

# ========================================
# Resumen Final
# ========================================
$total = $checksPass + $checksFail
$percentage = if ($total -gt 0) { [math]::Round(($checksPass / $total) * 100) } else { 0 }

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Resultados:" -ForegroundColor Cyan
Write-Host "✓ Passed: $checksPass" -ForegroundColor Green
Write-Host "✗ Failed: $checksFail" -ForegroundColor Red
Write-Host "Total: $total"
Write-Host "Coverage: ${percentage}%"
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if ($checksFail -eq 0) {
    Write-Host "✅ ALL CHECKS PASSED - NIVEL DIOS READY!" -ForegroundColor Green
    Write-Host "You can now:" -ForegroundColor Green
    Write-Host "  1. Start backend: pnpm run dev" -ForegroundColor Green
    Write-Host "  2. Run tests: pnpm run test:gcp" -ForegroundColor Green
    Write-Host "  3. Deploy: pnpm run build && pnpm run deploy" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Some checks failed - Review configuration" -ForegroundColor Yellow
    Write-Host "Missing items:" -ForegroundColor Yellow
    Write-Host "  1. Ensure Google Cloud credentials are in ./credentials/aigestion-master-key.json" -ForegroundColor Yellow
    Write-Host "  2. Run: gcloud auth application-default login" -ForegroundColor Yellow
    Write-Host "  3. Verify all .env variables are set" -ForegroundColor Yellow
    exit 1
}
