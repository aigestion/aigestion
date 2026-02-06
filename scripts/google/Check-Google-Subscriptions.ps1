# Google Subscriptions Checker for AIGestion
# Verifica todas las suscripciones Google activas

param(
    [switch]$Detailed,
    [switch]$Export,
    [string]$ExportPath = "c:\Users\Alejandro\AIGestion\scripts\reports\google-subs.json"
)

# Importar módulos necesarios
Import-Module Microsoft.PowerShell.Utility -ErrorAction SilentlyContinue

# Función para verificar suscripciones via Google Account
function Test-GoogleSubscription {
    param(
        [string]$ServiceName,
        [string]$CheckMethod,
        [string]$Url = $null
    )
    
    $result = @{
        Service = $ServiceName
        Status = "Unknown"
        Method = $CheckMethod
        Url = $Url
        LastChecked = Get-Date
        Details = @{}
    }
    
    try {
        switch ($CheckMethod) {
            "GmailAPI" {
                # Verificar emails de facturación Gmail
                $result.Status = "Requires API Access"
                $result.Details.Note = "Necesita acceso a Gmail API para verificar facturas"
            }
            "GooglePlay" {
                # Verificar suscripciones Google Play
                $result.Status = "Requires Device Access"
                $result.Details.Note = "Necesita acceso a dispositivo Android o Google Play Console"
            }
            "WorkspaceAdmin" {
                # Verificar via Google Workspace Admin
                $result.Status = "Requires Admin Access"
                $result.Details.Note = "Necesita acceso de administrador de Workspace"
            }
            "WebCheck" {
                if ($Url) {
                    try {
                        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 10 -ErrorAction Stop
                        $result.Status = "Accessible"
                        $result.Details.StatusCode = $response.StatusCode
                    } catch {
                        $result.Status = "Not Accessible"
                        $result.Details.Error = $_.Exception.Message
                    }
                }
            }
        }
    } catch {
        $result.Status = "Error"
        $result.Details.Error = $_.Exception.Message
    }
    
    return $result
}

# Lista de servicios Google comunes para verificar
$googleServices = @(
    @{Name="Google Workspace Business"; Method="WorkspaceAdmin"; Url="https://admin.google.com"},
    @{Name="Google One"; Method="GmailAPI"; Url="https://one.google.com"},
    @{Name="YouTube Premium"; Method="GooglePlay"; Url="https://www.youtube.com/premium"},
    @{Name="Google Play Pass"; Method="GooglePlay"; Url="https://play.google.com/pass"},
    @{Name="Google Fi"; Method="WebCheck"; Url="https://fi.google.com"},
    @{Name="Google Cloud Platform"; Method="WebCheck"; Url="https://console.cloud.google.com/billing"},
    @{Name="Google Ads"; Method="WebCheck"; Url="https://ads.google.com"},
    @{Name="Google Drive Storage"; Method="GmailAPI"; Url="https://drive.google.com"},
    @{Name="Google Photos Storage"; Method="GmailAPI"; Url="https://photos.google.com"},
    @{Name="Google Meet Advanced"; Method="WorkspaceAdmin"; Url="https://meet.google.com"},
    @{Name="Google Voice"; Method="WebCheck"; Url="https://voice.google.com"},
    @{Name="Google Nest Aware"; Method="WebCheck"; Url="https://home.google.com"},
    @{Name="Google Stadia Pro"; Method="GooglePlay"; Url="https://stadia.google.com"},
    @{Name="Google Play Music"; Method="GooglePlay"; Url="https://music.youtube.com"},
    @{Name="Google Books"; Method="GooglePlay"; Url="https://play.google.com/books"},
    @{Name="Google Movies & TV"; Method="GooglePlay"; Url="https://play.google.com/movies"},
    @{Name="Google News"; Method="WebCheck"; Url="https://news.google.com"},
    @{Name="Google Calendar"; Method="WorkspaceAdmin"; Url="https://calendar.google.com"},
    @{Name="Google Keep"; Method="WebCheck"; Url="https://keep.google.com"},
    @{Name="Google Tasks"; Method="WebCheck"; Url="https://tasks.google.com"}
)

Write-Host "🔍 Verificando suscripciones Google activas..." -ForegroundColor Cyan
Write-Host ""

# Verificar cada servicio
$results = @()
foreach ($service in $googleServices) {
    Write-Host "Verificando: $($service.Name)..." -ForegroundColor Yellow
    $result = Test-GoogleSubscription -ServiceName $service.Name -CheckMethod $service.Method -Url $service.Url
    $results += $result
    
    if ($Detailed) {
        Write-Host "  Estado: $($result.Status)" -ForegroundColor $(if($result.Status -eq "Accessible"){"Green"}else{"Red"})
        Write-Host "  Método: $($result.Method)" -ForegroundColor Gray
        if ($result.Details.Note) {
            Write-Host "  Nota: $($result.Details.Note)" -ForegroundColor Gray
        }
    }
}

# Mostrar resumen
Write-Host ""
Write-Host "📊 RESUMEN DE SUSCRIPCIONES GOOGLE" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$accessible = ($results | Where-Object {$_.Status -eq "Accessible"}).Count
$requiresAccess = ($results | Where-Object {$_.Status -match "Requires"}).Count
$errors = ($results | Where-Object {$_.Status -eq "Error"}).Count

Write-Host "✅ Servicios Accesibles: $accessible" -ForegroundColor Green
Write-Host "🔒 Requieren Acceso: $requiresAccess" -ForegroundColor Yellow
Write-Host "❌ Errores: $errors" -ForegroundColor Red

if ($Detailed) {
    Write-Host ""
    Write-Host "📋 DETALLE COMPLETO:" -ForegroundColor Cyan
    Write-Host ""
    
    foreach ($result in $results) {
        $color = switch ($result.Status) {
            "Accessible" { "Green" }
            "Requires API Access" { "Yellow" }
            "Requires Device Access" { "Yellow" }
            "Requires Admin Access" { "Yellow" }
            "Not Accessible" { "Red" }
            "Error" { "Red" }
            default { "Gray" }
        }
        
        Write-Host "🔸 $($result.Service)" -ForegroundColor $color
        Write-Host "   Estado: $($result.Status)" -ForegroundColor $color
        Write-Host "   URL: $($result.Url)" -ForegroundColor Gray
        if ($result.Details.Note) {
            Write-Host "   Nota: $($result.Details.Note)" -ForegroundColor Gray
        }
        Write-Host ""
    }
}

# Exportar resultados si se solicita
if ($Export) {
    $exportData = @{
        GeneratedAt = Get-Date
        Summary = @{
            Accessible = $accessible
            RequiresAccess = $requiresAccess
            Errors = $errors
            Total = $results.Count
        }
        Services = $results
        Recommendations = @(
            "Para verificar suscripciones reales, accede a: https://payments.google.com",
            "Revisa emails de facturación en: nemisanalex@gmail.com y admin@aigestion.net",
            "Usa Google Play Console para suscripciones de apps",
            "Verifica Google Workspace Admin para servicios empresariales"
        )
    }
    
    $exportPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($ExportPath)
    $directory = Split-Path $exportPath -Parent
    if (-not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    
    $exportData | ConvertTo-Json -Depth 10 | Set-Content -Path $exportPath
    Write-Host "📁 Resultados exportados a: $exportPath" -ForegroundColor Green
}

# Recomendaciones
Write-Host ""
Write-Host "💡 RECOMENDACIONES:" -ForegroundColor Cyan
Write-Host "1. Accede a https://payments.google.com para ver todas las suscripciones activas" -ForegroundColor White
Write-Host "2. Revisa tus emails de facturación: nemisanalex@gmail.com" -ForegroundColor White
Write-Host "3. Verifica Google Workspace Admin si tienes acceso de administrador" -ForegroundColor White
Write-Host "4. Usa la app Google Play en tu dispositivo Android para suscripciones de apps" -ForegroundColor White
Write-Host "5. Configura alertas de renovación para no sorpresas" -ForegroundColor White

Write-Host ""
Write-Host "🚀 Para ver facturas detalladas, ejecuta:" -ForegroundColor Cyan
Write-Host ".\Check-Google-Billing.ps1 -Detailed" -ForegroundColor White
