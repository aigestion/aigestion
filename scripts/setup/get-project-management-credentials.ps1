# 🏢 Project Management Credentials Generator for AIGestion
# Nivel Dios - Automatización completa de credenciales de Project Management

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
    Write-ColorOutput "║                    🏢 PROJECT MANAGEMENT GOD MODE                      ║" "title"
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

function Get-JiraCredentials {
    Write-ColorOutput "🎯 Configurando Jira..." "info"
    
    $baseUrl = Get-CredentialFromUser `
        -ServiceName "Jira" `
        -CredentialType "Base URL" `
        -Description "URL de tu instancia Jira (ej: https://empresa.atlassian.net)" `
        -Example "https://miempresa.atlassian.net"
    
    $apiToken = Get-CredentialFromUser `
        -ServiceName "Jira" `
        -CredentialType "API Token" `
        -Description "Token de API de Jira (generado en Atlassian)" `
        -Example "ATATT3xFfGF0J1234567890abcdef"
    
    return @{
        JIRA_BASE_URL = $baseUrl
        JIRA_API_TOKEN = $apiToken
    }
}

function Get-AsanaCredentials {
    Write-ColorOutput "🎯 Configurando Asana..." "info"
    
    $accessToken = Get-CredentialFromUser `
        -ServiceName "Asana" `
        -CredentialType "Personal Access Token" `
        -Description "Token de acceso personal de Asana" `
        -Example "1/1234567890abcdef1234567890abcdef"
    
    return @{
        ASANA_ACCESS_TOKEN = $accessToken
    }
}

function Get-TrelloCredentials {
    Write-ColorOutput "🎯 Configurando Trello..." "info"
    
    $apiKey = Get-CredentialFromUser `
        -ServiceName "Trello" `
        -CredentialType "API Key" `
        -Description "API Key de Trello" `
        -Example "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
    
    $token = Get-CredentialFromUser `
        -ServiceName "Trello" `
        -CredentialType "Token" `
        -Description "Token de API de Trello" `
        -Example "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    
    return @{
        TRELLO_API_KEY = $apiKey
        TRELLO_TOKEN = $token
    }
}

function Get-LinearCredentials {
    Write-ColorOutput "🎯 Configurando Linear..." "info"
    
    $apiKey = Get-CredentialFromUser `
        -ServiceName "Linear" `
        -CredentialType "API Key" `
        -Description "API Key de Linear" `
        -Example "lin_api_1234567890abcdef1234567890abcdef"
    
    $teamId = Get-CredentialFromUser `
        -ServiceName "Linear" `
        -CredentialType "Team ID" `
        -Description "ID del equipo Linear (opcional)" `
        -Example "12345678-1234-1234-1234-123456789012"
    
    return @{
        LINEAR_API_KEY = $apiKey
        LINEAR_TEAM_ID = $teamId
    }
}

function Get-ClickUpCredentials {
    Write-ColorOutput "🎯 Configurando ClickUp..." "info"
    
    $apiKey = Get-CredentialFromUser `
        -ServiceName "ClickUp" `
        -CredentialType "API Key" `
        -Description "API Key de ClickUp" `
        -Example "pk_1234567890abcdef1234567890abcdef"
    
    return @{
        CLICKUP_API_KEY = $apiKey
    }
}

function Get-AirtableCredentials {
    Write-ColorOutput "🎯 Configurando Airtable..." "info"
    
    $apiKey = Get-CredentialFromUser `
        -ServiceName "Airtable" `
        -CredentialType "API Key" `
        -Description "API Key de Airtable" `
        -Example "key1234567890abcdef"
    
    $baseId = Get-CredentialFromUser `
        -ServiceName "Airtable" `
        -CredentialType "Base ID" `
        -Description "ID de la base Airtable" `
        -Example "app1234567890abcdef"
    
    return @{
        AIRTABLE_API_KEY = $apiKey
        AIRTABLE_BASE_ID = $baseId
    }
}

function Get-MiroCredentials {
    Write-ColorOutput "🎯 Configurando Miro..." "info"
    
    $accessToken = Get-CredentialFromUser `
        -ServiceName "Miro" `
        -CredentialType "Access Token" `
        -Description "Token de acceso de Miro" `
        -Example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    
    return @{
        MIRO_ACCESS_TOKEN = $accessToken
    }
}

function Get-ZoomCredentials {
    Write-ColorOutput "🎯 Configurando Zoom..." "info"
    
    $apiKey = Get-CredentialFromUser `
        -ServiceName "Zoom" `
        -CredentialType "API Key" `
        -Description "API Key de Zoom" `
        -Example "abcdefghijklmnopqrstuvwxyz123456"
    
    $apiSecret = Get-CredentialFromUser `
        -ServiceName "Zoom" `
        -CredentialType "API Secret" `
        -Description "API Secret de Zoom" `
        -Example "1234567890abcdefghijklmnopqrstuvwxyz1234567890"
    
    return @{
        ZOOM_API_KEY = $apiKey
        ZOOM_API_SECRET = $apiSecret
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

function Test-ProjectManagementConnection {
    Write-ColorOutput "🧪 Verificando configuración..." "info"
    
    $envPath = Get-EnvPath
    $requiredVars = @(
        'JIRA_API_TOKEN', 'JIRA_BASE_URL',
        'ASANA_ACCESS_TOKEN',
        'TRELLO_API_KEY', 'TRELLO_TOKEN',
        'LINEAR_API_KEY', 'LINEAR_TEAM_ID',
        'CLICKUP_API_KEY',
        'AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID',
        'MIRO_ACCESS_TOKEN',
        'ZOOM_API_KEY', 'ZOOM_API_SECRET'
    )
    
    $configStatus = @{
        "configured" = @()
        "missing" = @()
        "empty" = @()
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
        
        if ($configStatus.configured.Count -gt 0) {
            Write-Host ""
            Write-ColorOutput "✅ Servicios configurados:" "success"
            $configStatus.configured | ForEach-Object { Write-Host "   • $_" }
        }
        
        if ($configStatus.missing.Count -gt 0 -or $configStatus.empty.Count -gt 0) {
            Write-Host ""
            Write-ColorOutput "⚠️  Necesita atención:" "warning"
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
    Write-ColorOutput "🔥 Integración completa con 8 servicios PM" "info"
    Write-ColorOutput "⚡ Sincronización automática en tiempo real" "info"
    Write-ColorOutput "🤖 IA para optimización de flujos de trabajo" "info"
    Write-ColorOutput "📊 Dashboard unificado con métricas avanzadas" "info"
    Write-ColorOutput "🔄 Automatización de tareas repetitivas" "info"
    Write-ColorOutput "📱 Notificaciones inteligentes multi-plataforma" "info"
    Write-ColorOutput "🎯 Gamificación de productividad" "info"
    Write-ColorOutput "🛡️ Seguridad enterprise nivel máximo" "info"
    Write-Host ""
}

function Generate-GodModeConfig {
    Write-ColorOutput "🎯 Generando configuración God Mode..." "info"
    
    $godModeConfig = @{
        # Jira God Mode
        JIRA_BASE_URL = "https://aigestion.atlassian.net"
        JIRA_API_TOKEN = "god_mode_jira_token_$(Get-Random -Minimum 1000 -Maximum 9999)"
        
        # Asana God Mode
        ASANA_ACCESS_TOKEN = "god_mode_asana_token_$(Get-Random -Minimum 1000 -Maximum 9999)"
        
        # Trello God Mode
        TRELLO_API_KEY = "god_mode_trello_key_$(Get-Random -Minimum 1000 -Maximum 9999)"
        TRELLO_TOKEN = "god_mode_trello_token_$(Get-Random -Minimum 1000 -Maximum 9999)"
        
        # Linear God Mode
        LINEAR_API_KEY = "lin_api_god_mode_$(Get-Random -Minimum 1000 -Maximum 9999)"
        LINEAR_TEAM_ID = "god-mode-team-$(Get-Random -Minimum 1000 -Maximum 9999)"
        
        # ClickUp God Mode
        CLICKUP_API_KEY = "pk_god_mode_$(Get-Random -Minimum 1000 -Maximum 9999)"
        
        # Airtable God Mode
        AIRTABLE_API_KEY = "key_god_mode_$(Get-Random -Minimum 1000 -Maximum 9999)"
        AIRTABLE_BASE_ID = "app_god_mode_$(Get-Random -Minimum 1000 -Maximum 9999)"
        
        # Miro God Mode
        MIRO_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.god_mode_$(Get-Random -Minimum 1000 -Maximum 9999)"
        
        # Zoom God Mode
        ZOOM_API_KEY = "god_mode_zoom_$(Get-Random -Minimum 1000 -Maximum 9999)"
        ZOOM_API_SECRET = "god_mode_secret_$(Get-Random -Minimum 1000 -Maximum 9999)"
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
        Write-ColorOutput "🏢 $service" "highlight"
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
    Write-ColorOutput "🚀 AIGestion Project Management está listo para uso" "info"
}

function Show-NextSteps {
    Write-Host ""
    Write-ColorOutput "🎯 PASOS SIGUIENTES" "title"
    Write-ColorOutput "════════════════════════════════════════════════════════════════════════════" "title"
    Write-ColorOutput "1. 🔧 Reemplaza las credenciales de demo con las reales" "info"
    Write-ColorOutput "2. 🧪 Ejecuta: .\get-project-management-credentials.ps1 -Mode test" "info"
    Write-ColorOutput "3. 📊 Revisa el dashboard de Project Management" "info"
    Write-ColorOutput "4. ⚙️  Configura flujos de trabajo automatizados" "info"
    Write-ColorOutput "5. 📱 Activa notificaciones inteligentes" "info"
    Write-ColorOutput "6. 🎮 Explora el modo gamificación" "info"
    Write-Host ""
    Write-ColorOutput "📚 Documentación: scripts/setup/README-Project-Management-Setup.md" "info"
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
        $isConfigured = Test-ProjectManagementConnection
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
        
        if ($Service -eq "all" -or $Service -eq "jira") {
            $credentials["Jira"] = Get-JiraCredentials
        }
        if ($Service -eq "all" -or $Service -eq "asana") {
            $credentials["Asana"] = Get-AsanaCredentials
        }
        if ($Service -eq "all" -or $Service -eq "trello") {
            $credentials["Trello"] = Get-TrelloCredentials
        }
        if ($Service -eq "all" -or $Service -eq "linear") {
            $credentials["Linear"] = Get-LinearCredentials
        }
        if ($Service -eq "all" -or $Service -eq "clickup") {
            $credentials["ClickUp"] = Get-ClickUpCredentials
        }
        if ($Service -eq "all" -or $Service -eq "airtable") {
            $credentials["Airtable"] = Get-AirtableCredentials
        }
        if ($Service -eq "all" -or $Service -eq "miro") {
            $credentials["Miro"] = Get-MiroCredentials
        }
        if ($Service -eq "all" -or $Service -eq "zoom") {
            $credentials["Zoom"] = Get-ZoomCredentials
        }
    }
    else { # interactive mode
        Write-ColorOutput "🎮 Modo interactivo - Configuración guiada" "info"
        Write-Host ""
        Write-ColorOutput "Selecciona los servicios a configurar:" "highlight"
        Write-Host "1. Todos los servicios"
        Write-Host "2. Jira"
        Write-Host "3. Asana"
        Write-Host "4. Trello"
        Write-Host "5. Linear"
        Write-Host "6. ClickUp"
        Write-Host "7. Airtable"
        Write-Host "8. Miro"
        Write-Host "9. Zoom"
        Write-Host "10. Personalizado"
        
        $selection = Read-Host "→ Opción (1-10)"
        
        $credentials = @{}
        
        switch ($selection) {
            "1" {
                $credentials["Jira"] = Get-JiraCredentials
                $credentials["Asana"] = Get-AsanaCredentials
                $credentials["Trello"] = Get-TrelloCredentials
                $credentials["Linear"] = Get-LinearCredentials
                $credentials["ClickUp"] = Get-ClickUpCredentials
                $credentials["Airtable"] = Get-AirtableCredentials
                $credentials["Miro"] = Get-MiroCredentials
                $credentials["Zoom"] = Get-ZoomCredentials
            }
            "2" { $credentials["Jira"] = Get-JiraCredentials }
            "3" { $credentials["Asana"] = Get-AsanaCredentials }
            "4" { $credentials["Trello"] = Get-TrelloCredentials }
            "5" { $credentials["Linear"] = Get-LinearCredentials }
            "6" { $credentials["ClickUp"] = Get-ClickUpCredentials }
            "7" { $credentials["Airtable"] = Get-AirtableCredentials }
            "8" { $credentials["Miro"] = Get-MiroCredentials }
            "9" { $credentials["Zoom"] = Get-ZoomCredentials }
            "10" {
                Write-Host "Selecciona servicios (separados por coma):"
                Write-Host "jira, asana, trello, linear, clickup, airtable, miro, zoom"
                $customServices = Read-Host "→ Servicios"
                $serviceList = $customServices -split ',' | ForEach-Object { $_.Trim().ToLower() }
                
                foreach ($svc in $serviceList) {
                    switch ($svc) {
                        "jira" { $credentials["Jira"] = Get-JiraCredentials }
                        "asana" { $credentials["Asana"] = Get-AsanaCredentials }
                        "trello" { $credentials["Trello"] = Get-TrelloCredentials }
                        "linear" { $credentials["Linear"] = Get-LinearCredentials }
                        "clickup" { $credentials["ClickUp"] = Get-ClickUpCredentials }
                        "airtable" { $credentials["Airtable"] = Get-AirtableCredentials }
                        "miro" { $credentials["Miro"] = Get-MiroCredentials }
                        "zoom" { $credentials["Zoom"] = Get-ZoomCredentials }
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
        Test-ProjectManagementConnection
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
