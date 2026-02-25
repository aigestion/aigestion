# 🏠 IoT & Sovereign Bridge Credentials Generator for AIGestion
# Nivel Dios - Automatización completa de credenciales de IoT y dispositivos

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("interactive", "batch", "test", "god")]
    [string]$Mode = "interactive",
    
    [Parameter(Mandatory=$false)]
    [string]$Service = "all",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose
)

# Configuración
$ErrorActionPreference = "Stop"
$ProgressPreference = "Continue"

# Colores para output
$colors = @{
    "title" = "Cyan"
    "success" = "Green"
    "warning" = "Yellow"
    "error" = "Red"
    "info" = "White"
    "highlight" = "Magenta"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Show-Header {
    Clear-Host
    Write-ColorOutput "╔════════════════════════════════════════════════════════════════════════════╗" "title"
    Write-ColorOutput "║                    🏠 IOT & SOVEREIGN BRIDGE GOD MODE                  ║" "title"
    Write-ColorOutput "║                  AIGestion Credentials Generator                      ║" "title"
    Write-ColorOutput "║                      Nivel Dios - Ultimate Setup                        ║" "title"
    Write-ColorOutput "╚════════════════════════════════════════════════════════════════════════════╝" "title"
    Write-Host ""
}

function Get-EnvPath {
    return ".env"
}

function Backup-EnvFile {
    param([string]$EnvPath)
    
    $backupPath = "$EnvPath.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    try {
        Copy-Item -Path $EnvPath -Destination $backupPath -ErrorAction Stop
        Write-ColorOutput "✅ Backup creado: $backupPath" "success"
        return $backupPath
    }
    catch {
        Write-ColorOutput "❌ Error creando backup: $_" "error"
        return $null
    }
}

function Test-Environment {
    Write-ColorOutput "🔍 Verificando entorno..." "info"
    
    # Verificar PowerShell versión
    if ($PSVersionTable.PSVersion.Major -lt 5) {
        Write-ColorOutput "❌ PowerShell 5+ requerido" "error"
        return $false
    }
    
    # Verificar archivo .env
    $envPath = Get-EnvPath
    if (-not (Test-Path $envPath)) {
        Write-ColorOutput "❌ Archivo .env no encontrado en: $envPath" "error"
        return $false
    }
    
    # Verificar permisos de escritura
    try {
        $testFile = "$envPath.test"
        "test" | Out-File -FilePath $testFile -ErrorAction Stop
        Remove-Item $testFile -ErrorAction Stop
    }
    catch {
        Write-ColorOutput "❌ Sin permisos de escritura en .env" "error"
        return $false
    }
    
    Write-ColorOutput "✅ Entorno verificado correctamente" "success"
    return $true
}

function Get-CredentialFromUser {
    param(
        [string]$ServiceName,
        [string]$CredentialType,
        [string]$Description,
        [string]$Example
    )
    
    Write-Host ""
    Write-ColorOutput "🔑 $ServiceName - $CredentialType" "highlight"
    Write-ColorOutput "📝 $Description" "info"
    Write-ColorOutput "💡 Ejemplo: $Example" "warning"
    
    do {
        $credential = Read-Host "→ Ingresa $CredentialType"
        
        if ([string]::IsNullOrWhiteSpace($credential)) {
            $retry = Read-Host "¿Deseas dejarlo vacío? (s/n)"
            if ($retry -eq 's') {
                return ""
            }
        }
        else {
            break
        }
    } while ($true)
    
    return $credential
}

function Get-HomeAssistantCredentials {
    Write-ColorOutput "🏠 Configurando Home Assistant..." "info"
    
    $url = Get-CredentialFromUser `
        -ServiceName "Home Assistant" `
        -CredentialType "URL" `
        -Description "URL de tu instancia Home Assistant" `
        -Example "http://homeassistant.local:8123"
    
    $token = Get-CredentialFromUser `
        -ServiceName "Home Assistant" `
        -CredentialType "Long-Lived Access Token" `
        -Description "Token de acceso de larga duración de Home Assistant" `
        -Example "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    
    return @{
        HA_URL = $url
        HA_TOKEN = $token
    }
}

function Get-PixelTaskerCredentials {
    Write-ColorOutput "📱 Configurando Pixel 8 Tasker Webhook..." "info"
    
    $webhookUrl = Get-CredentialFromUser `
        -ServiceName "Pixel 8 Tasker" `
        -CredentialType "Webhook URL" `
        -Description "URL del webhook de Tasker en tu Pixel 8" `
        -Example "http://192.168.1.130:1880/nexus-command"
    
    return @{
        PIXEL_TASKER_WEBHOOK_URL = $webhookUrl
    }
}

function Test-HomeAssistantConnection {
    param([string]$Url, [string]$Token)
    
    if ([string]::IsNullOrWhiteSpace($Url) -or [string]::IsNullOrWhiteSpace($Token)) {
        return $false
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $Token"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri "$Url/api/config" -Headers $headers -TimeoutSec 10
        return $response -ne $null
    }
    catch {
        Write-ColorOutput "⚠️  Error conectando a Home Assistant: $_" "warning"
        return $false
    }
}

function Test-PixelTaskerConnection {
    param([string]$WebhookUrl)
    
    if ([string]::IsNullOrWhiteSpace($WebhookUrl)) {
        return $false
    }
    
    try {
        $testPayload = @{
            command = "test"
            source = "aigestion"
            timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri $WebhookUrl -Method POST -Body $testPayload -ContentType "application/json" -TimeoutSec 5
        return $true
    }
    catch {
        Write-ColorOutput "⚠️  Error conectando a Pixel Tasker: $_" "warning"
        return $false
    }
}

function Update-EnvFile {
    param(
        [hashtable]$Credentials,
        [string]$EnvPath,
        [switch]$Force
    )
    
    try {
        $envContent = Get-Content -Path $EnvPath -Raw
        $updated = $false
        
        foreach ($cred in $Credentials.GetEnumerator()) {
            $pattern = "^#?\s*$($cred.Key)\s*=.*"
            $newValue = "$($cred.Key)=$($cred.Value)"
            
            if ($cred.Value -eq "" -and $Force) {
                $newValue = "# $($cred.Key)="
            }
            
            if ($envContent -match $pattern) {
                if ($Force -or $cred.Value -ne "") {
                    $envContent = $envContent -replace $pattern, $newValue
                    $updated = $true
                    Write-ColorOutput "✅ Actualizado: $($cred.Key)" "success"
                }
            }
            else {
                # Agregar nueva variable si no existe
                $envContent += "`n$newValue"
                $updated = $true
                Write-ColorOutput "➕ Agregado: $($cred.Key)" "success"
            }
        }
        
        if ($updated) {
            Set-Content -Path $EnvPath -Value $envContent -NoNewline
            Write-ColorOutput "✅ Archivo .env actualizado exitosamente" "success"
        }
        else {
            Write-ColorOutput "ℹ️  No se realizaron cambios" "info"
        }
        
        return $true
    }
    catch {
        Write-ColorOutput "❌ Error actualizando .env: $_" "error"
        return $false
    }
}

function Test-IoTConnection {
    Write-ColorOutput "🧪 Verificando configuración IoT..." "info"
    
    $envPath = Get-EnvPath
    $requiredVars = @(
        'HA_URL', 'HA_TOKEN',
        'PIXEL_TASKER_WEBHOOK_URL'
    )
    
    $configStatus = @{
        "configured" = @()
        "missing" = @()
        "empty" = @()
        "connected" = @()
        "failed" = @()
    }
    
    try {
        $envContent = Get-Content -Path $envPath
        
        foreach ($var in $requiredVars) {
            $line = $envContent | Where-Object { $_ -match "^#?\s*$var\s*=" }
            
            if ($line) {
                if ($line -match "^#.*") {
                    $configStatus.missing += $var
                }
                elseif ($line -match "=$") {
                    $configStatus.empty += $var
                }
                else {
                    $configStatus.configured += $var
                    
                    # Extraer valor para test de conexión
                    if ($line -match "^#?$var\s*=\s*(.+)$") {
                        $value = $matches[1].Trim()
                        
                        if ($var -eq "HA_URL" -or $var -eq "HA_TOKEN") {
                            # Test Home Assistant
                            $haUrl = ($envContent | Where-Object { $_ -match "^HA_URL\s*=" }) -replace "^HA_URL\s*=\s*", ""
                            $haToken = ($envContent | Where-Object { $_ -match "^HA_TOKEN\s*=" }) -replace "^HA_TOKEN\s*=\s*", ""
                            
                            if (Test-HomeAssistantConnection -Url $haUrl -Token $haToken) {
                                $configStatus.connected += "Home Assistant"
                            } else {
                                $configStatus.failed += "Home Assistant"
                            }
                        }
                        elseif ($var -eq "PIXEL_TASKER_WEBHOOK_URL") {
                            # Test Pixel Tasker
                            if (Test-PixelTaskerConnection -WebhookUrl $value) {
                                $configStatus.connected += "Pixel Tasker"
                            } else {
                                $configStatus.failed += "Pixel Tasker"
                            }
                        }
                    }
                }
            }
            else {
                $configStatus.missing += $var
            }
        }
        
        Write-Host ""
        Write-ColorOutput "📊 Estado de la configuración:" "highlight"
        Write-ColorOutput "✅ Configuradas: $($configStatus.configured.Count)" "success"
        Write-ColorOutput "⚠️  Vacías: $($configStatus.empty.Count)" "warning"
        Write-ColorOutput "❌ Faltantes: $($configStatus.missing.Count)" "error"
        
        if ($configStatus.connected.Count -gt 0) {
            Write-Host ""
            Write-ColorOutput "🔗 Conectadas:" "success"
            $configStatus.connected | ForEach-Object { Write-Host "   • $_" }
        }
        
        if ($configStatus.failed.Count -gt 0) {
            Write-Host ""
            Write-ColorOutput "❌ Fallaron:" "error"
            $configStatus.failed | ForEach-Object { Write-Host "   • $_" }
        }
        
        if ($configStatus.missing.Count -gt 0 -or $configStatus.empty.Count -gt 0) {
            Write-Host ""
            Write-ColorOutput "⚠️  Necesitan atención:" "warning"
            ($configStatus.empty + $configStatus.missing) | ForEach-Object { Write-Host "   • $_" }
        }
        
        $totalRequired = $requiredVars.Count
        $totalConfigured = $configStatus.configured.Count
        $percentage = [math]::Round(($totalConfigured / $totalRequired) * 100, 1)
        
        Write-Host ""
        Write-ColorOutput "📈 Completitud: $percentage% ($totalConfigured/$totalRequired)" "info"
        
        return $percentage -ge 80
    }
    catch {
        Write-ColorOutput "❌ Error verificando configuración: $_" "error"
        return $false
    }
}

function Show-GodModeFeatures {
    Write-Host ""
    Write-ColorOutput "🚀 MODO DIOS ACTIVADO - Características Extremas:" "highlight"
    Write-ColorOutput "🏠 Control total del hogar desde AIGestion" "info"
    Write-ColorOutput "📱 Integración perfecta con Pixel 8 Pro" "info"
    Write-ColorOutput "🤖 IA para automatización inteligente del hogar" "info"
    Write-ColorOutput "🔄 Sincronización en tiempo real con dispositivos" "info"
    Write-ColorOutput "🎬 Escenas y automatizaciones avanzadas" "info"
    Write-ColorOutput "📊 Dashboard unificado de IoT" "info"
    Write-ColorOutput "🛡️ Seguridad enterprise para dispositivos" "info"
    Write-ColorOutput "⚡ Comandos por voz y gestos" "info"
    Write-Host ""
}

function Generate-GodModeConfig {
    Write-ColorOutput "🎯 Generando configuración God Mode..." "info"
    
    $godModeConfig = @{
        # Home Assistant God Mode
        HA_URL = "https://aigestion-ha.duckdns.org:8123"
        HA_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.god_mode_ha_token_$(Get-Random -Minimum 1000 -Maximum 9999)"
        
        # Pixel 8 Tasker God Mode
        PIXEL_TASKER_WEBHOOK_URL = "https://aigestion-pixel.duckdns.org:1880/nexus-command"
    }
    
    return $godModeConfig
}

function Show-Summary {
    param([hashtable]$AllCredentials)
    
    Write-Host ""
    Write-ColorOutput "📋 RESUMEN DE CONFIGURACIÓN" "title"
    Write-ColorOutput "════════════════════════════════════════════════════════════════════════════" "title"
    
    foreach ($service in $AllCredentials.Keys) {
        Write-Host ""
        Write-ColorOutput "🏠 $service" "highlight"
        foreach ($cred in $AllCredentials[$service].GetEnumerator()) {
            $displayValue = if ([string]::IsNullOrWhiteSpace($cred.Value)) { 
                "[No configurado]" 
            } elseif ($cred.Value.Length -gt 8) { 
                $cred.Value.Substring(0, 8) + "..." 
            } else { 
                $cred.Value 
            }
            Write-Host "   $($cred.Key): $displayValue"
        }
    }
    
    Write-Host ""
    Write-ColorOutput "✅ Configuración completada exitosamente" "success"
    Write-ColorOutput "🚀 AIGestion IoT & Sovereign Bridge está listo para uso" "info"
}

function Show-NextSteps {
    Write-Host ""
    Write-ColorOutput "🎯 PASOS SIGUIENTES" "title"
    Write-ColorOutput "════════════════════════════════════════════════════════════════════════════" "title"
    Write-ColorOutput "1. 🔧 Reemplaza las credenciales de demo con las reales" "info"
    Write-ColorOutput "2. 🧪 Ejecuta: .\get-iot-credentials.ps1 -Mode test" "info"
    Write-ColorOutput "3. 🏠 Configura automatizaciones en Home Assistant" "info"
    Write-ColorOutput "4. 📱 Configura perfiles en Tasker (Pixel 8)" "info"
    Write-ColorOutput "5. 🔄 Activa sincronización bidireccional" "info"
    Write-ColorOutput "6. 🎬 Crea escenas inteligentes" "info"
    Write-Host ""
    Write-ColorOutput "📚 Documentación: scripts/setup/README-IoT-Setup.md" "info"
    Write-ColorOutput "🌐 Soporte: https://aigestion.net/support" "info"
    Write-Host ""
}

# Main execution
function Main {
    Show-Header
    
    if (-not (Test-Environment)) {
        Write-ColorOutput "❌ Verificación de entorno fallida" "error"
        return
    }
    
    $envPath = Get-EnvPath
    
    if ($Mode -eq "test") {
        Write-ColorOutput "🧪 Modo de prueba activado" "info"
        $isConfigured = Test-IoTConnection
        if ($isConfigured) {
            Write-ColorOutput "✅ Configuración validada exitosamente" "success"
        } else {
            Write-ColorOutput "⚠️  Configuración incompleta" "warning"
        }
        return
    }
    
    if ($Mode -eq "god") {
        Show-GodModeFeatures
        $credentials = Generate-GodModeConfig
        $Force = $true
    }
    elseif ($Mode -eq "batch") {
        Write-ColorOutput "📝 Modo batch - Configuración automática" "info"
        $credentials = @{}
        
        if ($Service -eq "all" -or $Service -eq "homeassistant") {
            $credentials["Home Assistant"] = Get-HomeAssistantCredentials
        }
        if ($Service -eq "all" -or $Service -eq "pixel") {
            $credentials["Pixel 8"] = Get-PixelTaskerCredentials
        }
    }
    else { # interactive mode
        Write-ColorOutput "🎮 Modo interactivo - Configuración guiada" "info"
        Write-Host ""
        Write-ColorOutput "Selecciona los servicios a configurar:" "highlight"
        Write-Host "1. Todos los servicios"
        Write-Host "2. Home Assistant"
        Write-Host "3. Pixel 8 Tasker"
        Write-Host "4. Personalizado"
        
        $selection = Read-Host "→ Opción (1-4)"
        
        $credentials = @{}
        
        switch ($selection) {
            "1" {
                $credentials["Home Assistant"] = Get-HomeAssistantCredentials
                $credentials["Pixel 8"] = Get-PixelTaskerCredentials
            }
            "2" { $credentials["Home Assistant"] = Get-HomeAssistantCredentials }
            "3" { $credentials["Pixel 8"] = Get-PixelTaskerCredentials }
            "4" {
                Write-Host "Selecciona servicios (separados por coma):"
                Write-Host "homeassistant, pixel"
                $customServices = Read-Host "→ Servicios"
                $serviceList = $customServices -split ',' | ForEach-Object { $_.Trim().ToLower() }
                
                foreach ($svc in $serviceList) {
                    switch ($svc) {
                        "homeassistant" { $credentials["Home Assistant"] = Get-HomeAssistantCredentials }
                        "pixel" { $credentials["Pixel 8"] = Get-PixelTaskerCredentials }
                    }
                }
            }
            default {
                Write-ColorOutput "❌ Opción inválida" "error"
                return
            }
        }
    }
    
    # Backup .env file
    $backupPath = Backup-EnvFile -EnvPath $envPath
    if (-not $backupPath) {
        Write-ColorOutput "❌ No se pudo crear backup, abortando" "error"
        return
    }
    
    # Update .env file
    $allCredentials = @{}
    foreach ($service in $credentials.Keys) {
        foreach ($cred in $credentials[$service].GetEnumerator()) {
            $allCredentials[$cred.Key] = $cred.Value
        }
    }
    
    $success = Update-EnvFile -Credentials $allCredentials -EnvPath $envPath -Force:$Force
    
    if ($success) {
        Show-Summary -AllCredentials $credentials
        Test-IoTConnection
        Show-NextSteps
    }
    else {
        Write-ColorOutput "❌ Error actualizando archivo .env" "error"
        Write-ColorOutput "🔄 Restaurando backup..." "info"
        try {
            Copy-Item -Path $backupPath -Destination $envPath -Force
            Write-ColorOutput "✅ Backup restaurado" "success"
        }
        catch {
            Write-ColorOutput "❌ Error restaurando backup: $_" "error"
        }
    }
}

# Execute main function
Main
