# 🚀 Google Cloud Console - Script Optimización Nivel Dios

<#
.SYNOPSIS
    Script PowerShell para optimizar Google Cloud Console a nivel Dios
.DESCRIPTION
    Configura y optimiza Google Cloud Console con permisos máximos y servicios esenciales
.PARAMETER Action
    Acción a ejecutar: setup, verify, optimize
.PARAMETER ProjectId
    ID del proyecto a configurar
.EXAMPLE
    .\Google-Cloud-GodMode.ps1 -Action "setup" -ProjectId "aigestion-sovereign-2026"
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "setup",
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = "aigestion-sovereign-2026"
)

# Configuración
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

Write-Host "🚀 GOOGLE CLOUD CONSOLE - OPTIMIZACIÓN NIVEL DIOS" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Funciones
function Test-GCloudInstallation {
    try {
        $version = gcloud version --format="value(gcloud.version)" 2>$null
        if ($version) {
            Write-Host "✅ gCloud CLI versión $version detectado" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "❌ gCloud CLI no encontrado" -ForegroundColor Red
        return $false
    }
    return $false
}

function Set-ProjectConfiguration {
    param([string]$ProjectId)
    
    Write-Host "🔧 Configurando proyecto: $ProjectId" -ForegroundColor Yellow
    
    try {
        # Establecer proyecto activo
        gcloud config set project $ProjectId
        Write-Host "✅ Proyecto activo configurado" -ForegroundColor Green
        
        # Verificar permisos
        $policy = gcloud projects get-iam-policy $ProjectId --format="json" | ConvertFrom-Json
        $owner = $policy.bindings | Where-Object { $_.role -eq "roles/owner" }
        
        if ($owner.members -contains "user:admin@aigestion.net") {
            Write-Host "✅ Permisos de Owner verificados" -ForegroundColor Green
        } else {
            Write-Host "❌ No tienes permisos de Owner" -ForegroundColor Red
            return $false
        }
        
        return $true
    } catch {
        Write-Host "❌ Error configurando proyecto: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Enable-EssentialServices {
    param([string]$ProjectId)
    
    Write-Host "⚡ Activando servicios esenciales..." -ForegroundColor Yellow
    
    $services = @(
        "compute.googleapis.com",
        "cloudbuild.googleapis.com", 
        "run.googleapis.com",
        "artifactregistry.googleapis.com",
        "firebase.googleapis.com",
        "firebasehosting.googleapis.com",
        "bigquery.googleapis.com",
        "storage.googleapis.com",
        "logging.googleapis.com",
        "monitoring.googleapis.com"
    )
    
    foreach ($service in $services) {
        Write-Host "🔧 Activando $service..." -ForegroundColor Cyan
        try {
            gcloud services enable $service --project=$ProjectId --quiet
            Write-Host "✅ $service activado" -ForegroundColor Green
        } catch {
            Write-Host "❌ Error activando $service : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

function Create-ServiceAccount {
    param([string]$ProjectId)
    
    Write-Host "👤 Creando Service Account God Mode..." -ForegroundColor Yellow
    
    try {
        # Crear service account
        gcloud iam service-accounts create "aigestion-god-mode" `
            --display-name="AIGestion God Mode Service Account" `
            --description="Service account con permisos máximos para AIGestion" `
            --project=$ProjectId --quiet
            
        Write-Host "✅ Service Account creado" -ForegroundColor Green
        
        # Asignar rol Owner
        $saEmail = "aigestion-god-mode@$ProjectId.iam.gserviceaccount.com"
        gcloud projects add-iam-policy-binding $ProjectId `
            --member="serviceAccount:$saEmail" `
            --role="roles/owner" --quiet
            
        Write-Host "✅ Permisos Owner asignados" -ForegroundColor Green
        
        return $true
    } catch {
        Write-Host "❌ Error creando Service Account: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Set-BillingConfiguration {
    param([string]$ProjectId)
    
    Write-Host "💳 Configurando billing..." -ForegroundColor Yellow
    
    try {
        # Obtener cuenta de billing
        $billingAccounts = gcloud billing accounts list --format="value(name)" 2>$null
        if ($billingAccounts) {
            $firstAccount = $billingAccounts.Split("`n")[0]
            gcloud billing projects link $ProjectId --billing-account=$firstAccount --quiet
            Write-Host "✅ Billing configurado" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ No se encontraron cuentas de billing" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error configurando billing: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Show-ProjectStatus {
    param([string]$ProjectId)
    
    Write-Host "📊 ESTADO DEL PROYECTO" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    
    try {
        # Información del proyecto
        $project = gcloud projects describe $ProjectId --format="json" | ConvertFrom-Json
        Write-Host "📁 Nombre: $($project.name)" -ForegroundColor White
        Write-Host "🆔 ID: $($project.projectId)" -ForegroundColor White
        Write-Host "📅 Creado: $($project.createTime)" -ForegroundColor White
        Write-Host "🔄 Estado: $($project.lifecycleState)" -ForegroundColor White
        
        # Permisos
        Write-Host "`n👤 PERMISOS IAM:" -ForegroundColor Cyan
        $policy = gcloud projects get-iam-policy $ProjectId --format="json" | ConvertFrom-Json
        foreach ($binding in $policy.bindings) {
            Write-Host "   $($binding.role):" -ForegroundColor Yellow
            foreach ($member in $binding.members) {
                Write-Host "     - $member" -ForegroundColor White
            }
        }
        
        # Servicios activos
        Write-Host "`n⚡ SERVICIOS ACTIVOS:" -ForegroundColor Cyan
        $services = gcloud services list --enabled --project=$ProjectId --format="value(title)" 2>$null
        $serviceCount = ($services | Measure-Object).Count
        Write-Host "   Total: $serviceCount servicios activos" -ForegroundColor Green
        
        # Billing
        Write-Host "`n💳 BILLING:" -ForegroundColor Cyan
        $billing = gcloud billing projects describe $ProjectId --format="value(billingEnabled)" 2>$null
        if ($billing -eq "True") {
            Write-Host "   ✅ Billing activado" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Billing desactivado" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "❌ Error obteniendo estado: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Ejecución principal
switch ($Action.ToLower()) {
    "setup" {
        Write-Host "🚀 INICIANDO CONFIGURACIÓN COMPLETA..." -ForegroundColor Green
        
        if (-not (Test-GCloudInstallation)) {
            Write-Host "❌ Por favor instala gCloud CLI primero" -ForegroundColor Red
            exit 1
        }
        
        if (Set-ProjectConfiguration -ProjectId $ProjectId) {
            Set-BillingConfiguration -ProjectId $ProjectId
            Enable-EssentialServices -ProjectId $ProjectId
            Create-ServiceAccount -ProjectId $ProjectId
            Show-ProjectStatus -ProjectId $ProjectId
            
            Write-Host "`n🎉 CONFIGURACIÓN COMPLETADA NIVEL DIOS!" -ForegroundColor Green
            Write-Host "🔥 Google Cloud Console optimizado para AIGestion" -ForegroundColor Yellow
        }
    }
    
    "verify" {
        Write-Host "🔍 VERIFICANDO CONFIGURACIÓN..." -ForegroundColor Green
        Show-ProjectStatus -ProjectId $ProjectId
    }
    
    "optimize" {
        Write-Host "⚡ OPTIMIZANDO SERVICIOS..." -ForegroundColor Green
        if (Set-ProjectConfiguration -ProjectId $ProjectId) {
            Enable-EssentialServices -ProjectId $ProjectId
            Write-Host "`n✅ Optimización completada" -ForegroundColor Green
        }
    }
    
    default {
        Write-Host "❌ Acción no reconocida: $Action" -ForegroundColor Red
        Write-Host "Acciones válidas: setup, verify, optimize" -ForegroundColor Yellow
    }
}

Write-Host "`n🚀 GOOGLE CLOUD CONSOLE - COMPLETADO" -ForegroundColor Cyan
