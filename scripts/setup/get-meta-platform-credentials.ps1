# 📱 Meta Platform Credentials Generator for AIGestion
# Nivel Dios - Automatización completa de credenciales de Facebook, Instagram, WhatsApp

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
    Write-ColorOutput "║                    📱 META PLATFORM GOD MODE                          ║" "title"
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

function Get-MetaAppCredentials {
    Write-ColorOutput "📱 Configurando Meta App..." "info"
    
    $appId = Get-CredentialFromUser `
        -ServiceName "Meta App" `
        -CredentialType "App ID" `
        -Description "ID de tu aplicación Meta (desde developers.facebook.com)" `
        -Example "1234567890123456"
    
    $appSecret = Get-CredentialFromUser `
        -ServiceName "Meta App" `
        -CredentialType "App Secret" `
        -Description "Secret de tu aplicación Meta" `
        -Example "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
    
    $accessToken = Get-CredentialFromUser `
        -ServiceName "Meta App" `
        -CredentialType "Access Token" `
        -Description "Token de acceso de la aplicación Meta" `
        -Example "EAAJZCJ6example1234567890abcdef"
    
    return @{
        META_APP_ID = $appId
        META_APP_SECRET = $appSecret
        META_ACCESS_TOKEN = $accessToken
    }
}

function Get-FacebookCredentials {
    Write-ColorOutput "📘 Configurando Facebook..." "info"
    
    $pageId = Get-CredentialFromUser `
        -ServiceName "Facebook" `
        -CredentialType "Page ID" `
        -Description "ID de tu página de Facebook" `
        -Example "1234567890123456"
    
    $pageAccessToken = Get-CredentialFromUser `
        -ServiceName "Facebook" `
        -CredentialType "Page Access Token" `
        -Description "Token de acceso de la página de Facebook" `
        -Example "EAAJZCJ6example1234567890abcdef1234567890"
    
    return @{
        FACEBOOK_PAGE_ID = $pageId
        FACEBOOK_PAGE_ACCESS_TOKEN = $pageAccessToken
    }
}

function Get-InstagramCredentials {
    Write-ColorOutput "📷 Configurando Instagram..." "info"
    
    $accessToken = Get-CredentialFromUser `
        -ServiceName "Instagram" `
        -CredentialType "Access Token" `
        -Description "Token de acceso de Instagram Business" `
        -Example "EAAJZCJ6example1234567890abcdef1234567890"
    
    $businessId = Get-CredentialFromUser `
        -ServiceName "Instagram" `
        -CredentialType "Business ID" `
        -Description "ID de cuenta de Instagram Business" `
        -Example "1234567890123456"
    
    $businessAccountId = Get-CredentialFromUser `
        -ServiceName "Instagram" `
        -CredentialType "Business Account ID" `
        -Description "ID de cuenta de negocio de Instagram" `
        -Example "17841405833148720"
    
    return @{
        INSTAGRAM_ACCESS_TOKEN = $accessToken
        INSTAGRAM_BUSINESS_ID = $businessId
        INSTAGRAM_BUSINESS_ACCOUNT_ID = $businessAccountId
    }
}

function Get-WhatsAppCredentials {
    Write-ColorOutput "💬 Configurando WhatsApp..." "info"
    
    $token = Get-CredentialFromUser `
        -ServiceName "WhatsApp" `
        -CredentialType "Token" `
        -Description "Token de API de WhatsApp Cloud" `
        -Example "EAAJZCJ6example1234567890abcdef1234567890"
    
    $verifyToken = Get-CredentialFromUser `
        -ServiceName "WhatsApp" `
        -CredentialType "Verify Token" `
        -Description "Token de verificación para webhooks de WhatsApp" `
        -Example "aigestion_whatsapp_verify_2026"
    
    $businessPhoneId = Get-CredentialFromUser `
        -ServiceName "WhatsApp" `
        -CredentialType "Business Phone ID" `
        -Description "ID del teléfono de negocio de WhatsApp" `
        -Example "1234567890123456"
    
    return @{
        WHATSAPP_TOKEN = $token
        WHATSAPP_VERIFY_TOKEN = $verifyToken
        WHATSAPP_BUSINESS_PHONE_ID = $businessPhoneId
    }
}

function Test-MetaConnection {
    param(
        [string]$AppId,
        [string]$AccessToken
    )
    
    if ([string]::IsNullOrWhiteSpace($AppId) -or [string]::IsNullOrWhiteSpace($AccessToken)) {
        return $false
    }
    
    try {
        $response = Invoke-RestMethod -Uri "https://graph.facebook.com/v18.0/me?access_token=$AccessToken" -TimeoutSec 10
        return $response -ne $null
    }
    catch {
        Write-ColorOutput "⚠️  Error conectando a Meta API: $_" "warning"
        return $false
    }
}

function Test-FacebookConnection {
    param(
        [string]$PageId,
        [string]$PageAccessToken
    )
    
    if ([string]::IsNullOrWhiteSpace($PageId) -or [string]::IsNullOrWhiteSpace($PageAccessToken)) {
        return $false
    }
    
    try {
        $response = Invoke-RestMethod -Uri "https://graph.facebook.com/v18.0/$PageId?access_token=$PageAccessToken" -TimeoutSec 10
        return $response -ne $null
    }
    catch {
        Write-ColorOutput "⚠️  Error conectando a Facebook API: $_" "warning"
        return $false
    }
}

function Test-InstagramConnection {
    param(
        [string]$AccessToken
    )
    
    if ([string]::IsNullOrWhiteSpace($AccessToken)) {
        return $false
    }
    
    try {
        $response = Invoke-RestMethod -Uri "https://graph.facebook.com/v18.0/me?fields=id,username&access_token=$AccessToken" -TimeoutSec 10
        return $response -ne $null
    }
    catch {
        Write-ColorOutput "⚠️  Error conectando a Instagram API: $_" "warning"
        return $false
    }
}

function Test-WhatsAppConnection {
    param(
        [string]$Token
    )
    
    if ([string]::IsNullOrWhiteSpace($Token)) {
        return $false
    }
    
    try {
        $headers = @{
            "Authorization" = "Bearer $Token"
        }
        $response = Invoke-RestMethod -Uri "https://graph.facebook.com/v18.0/me" -Headers $headers -TimeoutSec 10
        return $response -ne $null
    }
    catch {
        Write-ColorOutput "⚠️  Error conectando a WhatsApp API: $_" "warning"
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

function Test-MetaPlatformConnection {
    Write-ColorOutput "🧪 Verificando configuración Meta Platform..." "info"
    
    $envPath = Get-EnvPath
    $requiredVars = @(
        'META_APP_ID', 'META_APP_SECRET', 'META_ACCESS_TOKEN',
        'FACEBOOK_PAGE_ID', 'FACEBOOK_PAGE_ACCESS_TOKEN',
        'INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_BUSINESS_ID', 'INSTAGRAM_BUSINESS_ACCOUNT_ID',
        'WHATSAPP_TOKEN', 'WHATSAPP_VERIFY_TOKEN', 'WHATSAPP_BUSINESS_PHONE_ID'
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
                        
                        # Test Meta App
                        if ($var -eq "META_APP_ID" -or $var -eq "META_ACCESS_TOKEN") {
                            $appId = ($envContent | Where-Object { $_ -match "^META_APP_ID\s*=" }) -replace "^META_APP_ID\s*=\s*", ""
                            $accessToken = ($envContent | Where-Object { $_ -match "^META_ACCESS_TOKEN\s*=" }) -replace "^META_ACCESS_TOKEN\s*=\s*", ""
                            
                            if (Test-MetaConnection -AppId $appId -AccessToken $accessToken) {
                                $configStatus.connected += "Meta App"
                            } else {
                                $configStatus.failed += "Meta App"
                            }
                        }
                        
                        # Test Facebook
                        elseif ($var -eq "FACEBOOK_PAGE_ID" -or $var -eq "FACEBOOK_PAGE_ACCESS_TOKEN") {
                            $pageId = ($envContent | Where-Object { $_ -match "^FACEBOOK_PAGE_ID\s*=" }) -replace "^FACEBOOK_PAGE_ID\s*=\s*", ""
                            $pageToken = ($envContent | Where-Object { $_ -match "^FACEBOOK_PAGE_ACCESS_TOKEN\s*=" }) -replace "^FACEBOOK_PAGE_ACCESS_TOKEN\s*=\s*", ""
                            
                            if (Test-FacebookConnection -PageId $pageId -PageAccessToken $pageToken) {
                                $configStatus.connected += "Facebook"
                            } else {
                                $configStatus.failed += "Facebook"
                            }
                        }
                        
                        # Test Instagram
                        elseif ($var -eq "INSTAGRAM_ACCESS_TOKEN") {
                            if (Test-InstagramConnection -AccessToken $value) {
                                $configStatus.connected += "Instagram"
                            } else {
                                $configStatus.failed += "Instagram"
                            }
                        }
                        
                        # Test WhatsApp
                        elseif ($var -eq "WHATSAPP_TOKEN") {
                            if (Test-WhatsAppConnection -Token $value) {
                                $configStatus.connected += "WhatsApp"
                            } else {
                                $configStatus.failed += "WhatsApp"
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
    Write-ColorOutput "📱 Control total de Meta Platform desde AIGestion" "info"
    Write-ColorOutput "🤖 IA para contenido y marketing predictivo" "info"
    Write-ColorOutput "🔄 Sincronización automática en tiempo real" "info"
    Write-ColorOutput "📊 Dashboard unificado de social media" "info"
    Write-ColorOutput "🎬 Creación automática de contenido viral" "info"
    Write-ColorOutput "📈 Análisis avanzado de engagement" "info"
    Write-ColorOutput "🛡️ Seguridad enterprise para cuentas" "info"
    Write-ColorOutput "⚡ Publicación programada inteligente" "info"
    Write-Host ""
}

function Generate-GodModeConfig {
    Write-ColorOutput "🎯 Generando configuración God Mode..." "info"
    
    $godModeConfig = @{
        # Meta App God Mode
        META_APP_ID = "1234567890123456"
        META_APP_SECRET = "god_mode_meta_secret_$(Get-Random -Minimum 1000 -Maximum 9999)"
        META_ACCESS_TOKEN = "EAAJZCJ6god_mode_token_$(Get-Random -Minimum 1000 -Maximum 9999)"
        
        # Facebook God Mode
        FACEBOOK_PAGE_ID = "1234567890123456"
        FACEBOOK_PAGE_ACCESS_TOKEN = "EAAJZCJ6god_mode_fb_token_$(Get-Random -Minimum 1000 -Maximum 9999)"
        
        # Instagram God Mode
        INSTAGRAM_ACCESS_TOKEN = "EAAJZCJ6god_mode_ig_token_$(Get-Random -Minimum 1000 -Maximum 9999)"
        INSTAGRAM_BUSINESS_ID = "1234567890123456"
        INSTAGRAM_BUSINESS_ACCOUNT_ID = "17841405833148720"
        
        # WhatsApp God Mode
        WHATSAPP_TOKEN = "EAAJZCJ6god_mode_wa_token_$(Get-Random -Minimum 1000 -Maximum 9999)"
        WHATSAPP_VERIFY_TOKEN = "aigestion_whatsapp_god_mode_$(Get-Random -Minimum 1000 -Maximum 9999)"
        WHATSAPP_BUSINESS_PHONE_ID = "1234567890123456"
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
        Write-ColorOutput "📱 $service" "highlight"
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
    Write-ColorOutput "🚀 AIGestion Meta Platform está listo para uso" "info"
}

function Show-NextSteps {
    Write-Host ""
    Write-ColorOutput "🎯 PASOS SIGUIENTES" "title"
    Write-ColorOutput "════════════════════════════════════════════════════════════════════════════" "title"
    Write-ColorOutput "1. 🔧 Reemplaza las credenciales de demo con las reales" "info"
    Write-ColorOutput "2. 🧪 Ejecuta: .\get-meta-platform-credentials.ps1 -Mode test" "info"
    Write-ColorOutput "3. 📊 Revisa el dashboard de Social Media" "info"
    Write-ColorOutput "4. ⚙️  Configura webhooks para notificaciones" "info"
    Write-ColorOutput "5. 📱 Activa sincronización bidireccional" "info"
    Write-ColorOutput "6. 🎮 Explora el modo gamificación" "info"
    Write-Host ""
    Write-ColorOutput "📚 Documentación: scripts/setup/README-Meta-Platform-Setup.md" "info"
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
        $isConfigured = Test-MetaPlatformConnection
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
        
        if ($Service -eq "all" -or $Service -eq "metaapp") {
            $credentials["Meta App"] = Get-MetaAppCredentials
        }
        if ($Service -eq "all" -or $Service -eq "facebook") {
            $credentials["Facebook"] = Get-FacebookCredentials
        }
        if ($Service -eq "all" -or $Service -eq "instagram") {
            $credentials["Instagram"] = Get-InstagramCredentials
        }
        if ($Service -eq "all" -or $Service -eq "whatsapp") {
            $credentials["WhatsApp"] = Get-WhatsAppCredentials
        }
    }
    else { # interactive mode
        Write-ColorOutput "🎮 Modo interactivo - Configuración guiada" "info"
        Write-Host ""
        Write-ColorOutput "Selecciona los servicios a configurar:" "highlight"
        Write-Host "1. Todos los servicios"
        Write-Host "2. Meta App (Facebook + Instagram + WhatsApp)"
        Write-Host "3. Facebook"
        Write-Host "4. Instagram"
        Write-Host "5. WhatsApp"
        Write-Host "6. Personalizado"
        
        $selection = Read-Host "→ Opción (1-6)"
        
        $credentials = @{}
        
        switch ($selection) {
            "1" {
                $credentials["Meta App"] = Get-MetaAppCredentials
                $credentials["Facebook"] = Get-FacebookCredentials
                $credentials["Instagram"] = Get-InstagramCredentials
                $credentials["WhatsApp"] = Get-WhatsAppCredentials
            }
            "2" { $credentials["Meta App"] = Get-MetaAppCredentials }
            "3" { $credentials["Facebook"] = Get-FacebookCredentials }
            "4" { $credentials["Instagram"] = Get-InstagramCredentials }
            "5" { $credentials["WhatsApp"] = Get-WhatsAppCredentials }
            "6" {
                Write-Host "Selecciona servicios (separados por coma):"
                Write-Host "metaapp, facebook, instagram, whatsapp"
                $customServices = Read-Host "→ Servicios"
                $serviceList = $customServices -split ',' | ForEach-Object { $_.Trim().ToLower() }
                
                foreach ($svc in $serviceList) {
                    switch ($svc) {
                        "metaapp" { $credentials["Meta App"] = Get-MetaAppCredentials }
                        "facebook" { $credentials["Facebook"] = Get-FacebookCredentials }
                        "instagram" { $credentials["Instagram"] = Get-InstagramCredentials }
                        "whatsapp" { $credentials["WhatsApp"] = Get-WhatsAppCredentials }
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
        Test-MetaPlatformConnection
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
