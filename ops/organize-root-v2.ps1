# AIGestion Root Directory Organization V2
# Organized loose files into appropriate folders

Write-Host "🗂️ Organizing AIGestion Root Directory V2" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Gray

$Root = "c:\Users\Alejandro\AIGestion"

# 1. Ensure Directories Exist
$Dirs = @(
    "$Root\docs\reports",
    "$Root\ops\deployment",
    "$Root\ops\database",
    "$Root\logs",
    "$Root\scripts",
    "$Root\docs\archive"
)

foreach ($Dir in $Dirs) {
    if (-not (Test-Path $Dir)) {
        New-Item -ItemType Directory -Path $Dir -Force | Out-Null
        Write-Host "  ✅ Created: $Dir" -ForegroundColor Green
    }
}

# 2. Define File Mappings
$Mappings = @{
    # Reports & Diagnostics
    "CORRECCIONES_NEXUS_DOCTOR.md"      = "$Root\docs\reports"
    "FRONTEND_OPTIMIZATION_REPORT.md"   = "$Root\docs\reports"
    "INFORME_DIAGNOSTICO_PC.md"         = "$Root\docs\reports"
    "PROGRESO_COMPLETO_PROYECTO.md"     = "$Root\docs\reports"
    "AUDIT_SUMMARY.md"                  = "$Root\docs\reports"
    "build_log.txt"                      = "$Root\logs"

    # Deployment & Plans
    "CLOUD_RUN_CONSOLE_STATUS.md"       = "$Root\ops\deployment"
    "ESTADO_DESPLIEGUE_ACTUAL.md"       = "$Root\ops\deployment"
    "NEXT_STEP_RAILWAY_DEPLOY.md"       = "$Root\ops\deployment"
    "RAILWAY_ALTERNATIVE_DEPLOY.md"     = "$Root\ops\deployment"
    "PLAN_MIGRACION_NUBE.md"            = "$Root\ops\deployment"

    # Database Ops
    "MONGODB_ATLAS_ACTUALIZADO.md"      = "$Root\ops\database"
    "MONGODB_ATLAS_EJECUCION.md"        = "$Root\ops\database"
    "MONGODB_ATLAS_EJECUCION_FINAL.md"  = "$Root\ops\database"
    "MONGODB_ATLAS_GOD_MODE.md"         = "$Root\ops\database"
    "MONGODB_ATLAS_QUICK_SETUP.md"      = "$Root\ops\database"
    "MONGODB_ATLAS_SETUP.md"            = "$Root\ops\database"
    "NEXT_STEP_REDIS_UPSTASH.md"        = "$Root\ops\database"

    # Logs
    "finance_test.log"                  = "$Root\logs"
    "finance_test_2.log"                = "$Root\logs"
    "finance_test_3.log"                = "$Root\logs"
    "price_alert_test.log"              = "$Root\logs"
    "test_final_verification.log"       = "$Root\logs"
    "test_output.log"                   = "$Root\logs"
    "test_output_v2.log"                = "$Root\logs"
    "test_output_v3.log"                = "$Root\logs"
    "wallet_test.log"                   = "$Root\logs"
    "wallet_test_2.log"                 = "$Root\logs"
    "wallet_test_3.log"                 = "$Root\logs"
    "audit_report.txt"                  = "$Root\logs"

    # Scripts
    "diagnose_adc.py"                   = "$Root\scripts"
    "diagnose_keys.py"                  = "$Root\scripts"
    "diagnose_sa.py"                    = "$Root\scripts"
    "diagnose_vertex.py"                = "$Root\scripts"
    "QUICK_REFERENCE.sh"                = "$Root\scripts"

    # Fixes & Archive
    "FRONTEND_BACKEND_CONNECTION_FIX.md" = "$Root\docs\archive"
}

# 3. Execute Move
foreach ($File in $Mappings.Keys) {
    $Source = "$Root\$File"
    $Dest = $Mappings[$File]
    if (Test-Path $Source) {
        Move-Item -Path $Source -Destination $Dest -Force
        Write-Host "  ✅ Moved: $File -> $Dest" -ForegroundColor Green
    }
}

Write-Host "`n🎉 Reorganization complete!" -ForegroundColor Cyan
