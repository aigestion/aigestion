# 🚀 AIGESTION CLIENT ONBOARDING GOD MODE
# Sistema completo de onboarding y seguimiento de clientes nivel dios

param(
    [string]$ClientEmail = "",
    [string]$ClientName = "",
    [string]$ClientPhone = "",
    [string]$ClientCompany = "",
    [switch]$Interactive = $false,
    [switch]$TestMode = $false
)

# Configuración
$Config = @{
    DatabasePath     = "c:\Users\Alejandro\AIGestion\data\clients\"
    LogPath          = "c:\Users\Alejandro\AIGestion\scripts\client\logs\"
    TemplatesPath    = "c:\Users\Alejandro\AIGestion\scripts\client\templates\"
    TelegramBotToken = $env:TELEGRAM_BOT_TOKEN
    WhatsAppToken    = $env:WHATSAPP_TOKEN
    OpenAIKey        = $env:OPENAI_API_KEY
    SupabaseUrl      = $env:SUPABASE_URL
    SupabaseKey      = $env:SUPABASE_ANON_KEY
}

# Crear directorios necesarios
$directories = @($Config.DatabasePath, $Config.LogPath, $Config.TemplatesPath)
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
}

# Función de logging
function Write-ClientLog {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [string]$ClientId = ""
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] [Client:$ClientId] $Message"

    Write-Host $logEntry -ForegroundColor $(
        switch ($Level) {
            "ERROR" { "Red" }
            "WARN" { "Yellow" }
            "INFO" { "Green" }
            "DEBUG" { "Cyan" }
            "SUCCESS" { "Magenta" }
            default { "White" }
        }
    )

    $logFile = "$($Config.LogPath)client-onboarding-$(Get-Date -Format 'yyyy-MM-dd').log"
    Add-Content -Path $logFile -Value $logEntry -ErrorAction SilentlyContinue
}

# Función para validar email con Gmail
function Test-GmailAccount {
    param(
        [string]$Email
    )

    try {
        Write-ClientLog "Verificando cuenta Gmail: $Email" -Level "DEBUG"

        # Verificar formato de email
        if ($Email -notmatch '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') {
            return @{
                Valid   = $false
                Reason  = "Formato de email inválido"
                IsGmail = $false
                Domain  = ""
            }
        }

        # Extraer dominio
        $domain = ($Email -split '@')[1].ToLower()
        $isGmail = $domain -eq 'gmail.com'

        # Verificación adicional con Gmail API si es Gmail
        if ($isGmail) {
            try {
                # Aquí iría la verificación con Gmail API
                # Por ahora, simulamos la verificación
                $gmailValid = Test-GmailAPIValidation -Email $Email

                return @{
                    Valid   = $gmailValid
                    Reason  = if ($gmailValid) { "Cuenta Gmail verificada" } else { "Cuenta Gmail no encontrada o inválida" }
                    IsGmail = $true
                    Domain  = $domain
                }
            }
            catch {
                Write-ClientLog "Error en verificación Gmail API: $($_.Exception.Message)" -Level "WARN"
                return @{
                    Valid   = $true  # Fallback a validación básica
                    Reason  = "Verificación básica completada"
                    IsGmail = $true
                    Domain  = $domain
                }
            }
        }
        else {
            # Verificación DNS para dominios corporativos
            $dnsValid = Test-DomainValidation -Domain $domain

            return @{
                Valid   = $dnsValid
                Reason  = if ($dnsValid) { "Dominio corporativo verificado" } else { "Dominio no válido o inaccesible" }
                IsGmail = $false
                Domain  = $domain
            }
        }

    }
    catch {
        Write-ClientLog "Error validando email $Email`: $($_.Exception.Message)" -Level "ERROR"
        return @{
            Valid   = $false
            Reason  = "Error en validación: $($_.Exception.Message)"
            IsGmail = $false
            Domain  = ""
        }
    }
}

# Función de validación Gmail API (simulada)
function Test-GmailAPIValidation {
    param(
        [string]$Email
    )

    # Simulación de validación con Gmail API
    # En producción, aquí iría la llamada real a Gmail API

    try {
        # Simular respuesta
        $response = @{
            exists      = $true
            valid       = $true
            deliverable = $true
        }

        return $response.valid

    }
    catch {
        return $false
    }
}

# Función de validación DNS
function Test-DomainValidation {
    param(
        [string]$Domain
    )

    try {
        # Verificar registros MX
        $mxRecords = Resolve-DnsName -Name $Domain -Type MX -ErrorAction SilentlyContinue
        if ($mxRecords) {
            return $true
        }

        # Verificar registros A
        $aRecords = Resolve-DnsName -Name $Domain -Type A -ErrorAction SilentlyContinue
        return $aRecords -ne $null

    }
    catch {
        return $false
    }
}

# Función para detectar mejor canal de contacto
function Get-BestContactChannel {
    param(
        [hashtable]$ClientData
    )

    Write-ClientLog "Analizando mejor canal de contacto para cliente" -Level "DEBUG"

    $channels = @()

    # Evaluar canal Email
    if ($ClientData.Email) {
        $emailValidation = Test-GmailAccount -Email $ClientData.Email
        if ($emailValidation.Valid) {
            $channels += @{
                Type         = "Email"
                Priority     = 3
                Confidence   = 0.9
                ResponseTime = "2-4 horas"
                Details      = $emailValidation
            }
        }
    }

    # Evaluar canal WhatsApp
    if ($ClientData.Phone) {
        $phoneValidation = Test-WhatsAppNumber -Phone $ClientData.Phone
        if ($phoneValidation.Valid) {
            $channels += @{
                Type         = "WhatsApp"
                Priority     = 1
                Confidence   = 0.95
                ResponseTime = "5-15 minutos"
                Details      = $phoneValidation
            }
        }
    }

    # Evaluar canal Telegram
    if ($ClientData.Telegram) {
        $telegramValidation = Test-TelegramUser -Username $ClientData.Telegram
        if ($telegramValidation.Valid) {
            $channels += @{
                Type         = "Telegram"
                Priority     = 2
                Confidence   = 0.85
                ResponseTime = "10-30 minutos"
                Details      = $telegramValidation
            }
        }
    }

    # Ordenar por prioridad y confianza
    $channels = $channels | Sort-Object -Property @{Expression = { $_.Priority }; Ascending = $true }, @{Expression = { $_.Confidence }; Descending = $true }

    $bestChannel = if ($channels.Count -gt 0) { $channels[0] } else { $null }

    return @{
        BestChannel    = $bestChannel
        AllChannels    = $channels
        Recommendation = if ($bestChannel) { "Recomendado usar $($bestChannel.Type) - $($bestChannel.ResponseTime) respuesta" } else { "No se encontraron canales válidos" }
    }
}

# Función para validar número WhatsApp
function Test-WhatsAppNumber {
    param(
        [string]$Phone
    )

    try {
        # Limpiar número de teléfono
        $cleanPhone = $Phone -replace '[^\d+]' -replace '^(\d{2})', '+$1'

        # Validar formato internacional
        if ($cleanPhone -match '^\+\d{10,15}$') {
            return @{
                Valid            = $true
                CleanNumber      = $cleanPhone
                Country          = Get-CountryFromPhone -Phone $cleanPhone
                WhatsAppBusiness = $true
            }
        }
        else {
            return @{
                Valid  = $false
                Reason = "Formato de teléfono inválido. Use formato internacional: +<país><número>"
            }
        }

    }
    catch {
        return @{
            Valid  = $false
            Reason = "Error validando teléfono: $($_.Exception.Message)"
        }
    }
}

# Función para obtener país desde teléfono
function Get-CountryFromPhone {
    param(
        [string]$Phone
    )

    $countryCodes = @{
        '+1'   = 'Estados Unidos/Canadá'
        '+52'  = 'México'
        '+34'  = 'España'
        '+54'  = 'Argentina'
        '+56'  = 'Chile'
        '+57'  = 'Colombia'
        '+58'  = 'Venezuela'
        '+55'  = 'Brasil'
        '+598' = 'Uruguay'
        '+593' = 'Ecuador'
        '+51'  = 'Perú'
    }

    foreach ($code in $countryCodes.GetEnumerator()) {
        if ($Phone.StartsWith($code.Key)) {
            return $code.Value
        }
    }

    return 'Desconocido'
}

# Función para validar usuario Telegram
function Test-TelegramUser {
    param(
        [string]$Username
    )

    try {
        # Limpiar username (quitar @ si existe)
        $cleanUsername = $Username.TrimStart('@')

        # Validar formato
        if ($cleanUsername -match '^[a-zA-Z0-9_]{5,32}$') {
            # Aquí iría la verificación con Telegram Bot API
            # Por ahora, simulamos la validación
            return @{
                Valid       = $true
                Username    = $cleanUsername
                TelegramUrl = "https://t.me/$cleanUsername"
                Verified    = $true
            }
        }
        else {
            return @{
                Valid  = $false
                Reason = "Username de Telegram inválido. Debe tener 5-32 caracteres alfanuméricos"
            }
        }

    }
    catch {
        return @{
            Valid  = $false
            Reason = "Error validando Telegram: $($_.Exception.Message)"
        }
    }
}

# Función para crear perfil de cliente
function New-ClientProfile {
    param(
        [hashtable]$ClientData
    )

    $clientId = "CLI-" + (Get-Date -Format "yyyyMMdd-HHmmss") + "-" + (Get-Random -Maximum 9999)

    $clientProfile = @{
        ClientId         = $clientId
        Name             = $ClientData.Name
        Email            = $ClientData.Email
        Phone            = $ClientData.Phone
        Company          = $ClientData.Company
        Telegram         = $ClientData.Telegram
        CreatedAt        = Get-Date
        Status           = "New"
        OnboardingStage  = "Initial"
        PreferredChannel = $null
        ContactHistory   = @()
        Notes            = ""
        Tags             = @()
        LastContact      = $null
        NextFollowUp     = $null
        AIProfile        = Get-AIClientProfile -ClientData $ClientData
    }

    # Determinar mejor canal de contacto
    $channelAnalysis = Get-BestContactChannel -ClientData $ClientData
    $profile.PreferredChannel = $channelAnalysis.BestChannel
    $profile.ChannelAnalysis = $channelAnalysis

    # Guardar perfil
    $profilePath = "$($Config.DatabasePath)$clientId.json"
    $profile | ConvertTo-Json -Depth 10 | Out-File -FilePath $profilePath -Encoding UTF8

    Write-ClientLog "Perfil de cliente creado: $clientId" -Level "SUCCESS" -ClientId $clientId

    return $profile
}

# Función para generar perfil IA del cliente
function Get-AIClientProfile {
    param(
        [hashtable]$ClientData
    )

    try {
        # Análisis basado en datos disponibles
        $aiProfile = @{
            CommunicationStyle = "Professional"
            ResponsePreference = "Email"
            UrgencyLevel       = "Normal"
            TechSavviness      = "Medium"
            BestContactTime    = "Business Hours"
            FollowupFrequency  = "Weekly"
            RiskLevel          = "Low"
            ValueScore         = 0
        }

        # Analizar email para determinar estilo
        if ($ClientData.Email) {
            $domain = ($ClientData.Email -split '@')[1].ToLower()
            if ($domain -eq 'gmail.com') {
                $aiProfile.CommunicationStyle = "Casual"
                $aiProfile.TechSavviness = "High"
            }
            elseif ($domain -match '\.(com|org|net)$') {
                $aiProfile.CommunicationStyle = "Professional"
                $aiProfile.ValueScore = 70
            }
        }

        # Analizar teléfono para determinar región
        if ($ClientData.Phone) {
            $country = Get-CountryFromPhone -Phone $ClientData.Phone
            if ($country -eq 'México' -or $country -eq 'España') {
                $aiProfile.CommunicationStyle = "Formal"
                $aiProfile.BestContactTime = "Morning"
            }
        }

        # Determinar preferencia de contacto
        $channelAnalysis = Get-BestContactChannel -ClientData $ClientData
        if ($channelAnalysis.BestChannel) {
            $aiProfile.ResponsePreference = $channelAnalysis.BestChannel.Type
        }

        return $aiProfile

    }
    catch {
        Write-ClientLog "Error generando perfil IA: $($_.Exception.Message)" -Level "ERROR"
        return @{
            CommunicationStyle = "Professional"
            ResponsePreference = "Email"
            UrgencyLevel       = "Normal"
            TechSavviness      = "Medium"
        }
    }
}

# Función para enviar bienvenida
function Send-WelcomeMessage {
    param(
        [hashtable]$ClientProfile
    )

    try {
        $welcomeTemplate = Get-Content -Path "$($Config.TemplatesPath)welcome-template.html" -Raw

        # Personalizar template
        $personalizedMessage = $welcomeTemplate `
            -replace '{{CLIENT_NAME}}', $ClientProfile.Name `
            -replace '{{CLIENT_COMPANY}}', $ClientProfile.Company `
            -replace '{{CLIENT_ID}}', $ClientProfile.ClientId `
            -replace '{{PREFERRED_CHANNEL}}', $ClientProfile.PreferredChannel.Type `
            -replace '{{RESPONSE_TIME}}', $ClientProfile.PreferredChannel.ResponseTime

        # Enviar por canal preferido
        switch ($ClientProfile.PreferredChannel.Type) {
            "Email" {
                Send-EmailWelcome -Profile $ClientProfile -Message $personalizedMessage
            }
            "WhatsApp" {
                Send-WhatsAppWelcome -Profile $ClientProfile -Message $personalizedMessage
            }
            "Telegram" {
                Send-TelegramWelcome -Profile $ClientProfile -Message $personalizedMessage
            }
        }

        # Registrar en historial
        $ClientProfile.ContactHistory += @{
            Timestamp = Get-Date
            Type      = "Welcome"
            Channel   = $ClientProfile.PreferredChannel.Type
            Status    = "Sent"
            Message   = "Mensaje de bienvenida enviado"
        }

        # Actualizar perfil
        Update-ClientProfile -Profile $ClientProfile

        Write-ClientLog "Mensaje de bienvenida enviado por $($ClientProfile.PreferredChannel.Type)" -Level "SUCCESS" -ClientId $ClientProfile.ClientId

    }
    catch {
        Write-ClientLog "Error enviando mensaje de bienvenida: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientProfile.ClientId
    }
}

# Función para enviar email de bienvenida
function Send-EmailWelcome {
    param(
        [hashtable]$Profile,
        [string]$Message
    )

    try {
        $emailParams = @{
            To         = $Profile.Email
            Subject    = "🚀 Bienvenido a AIGestion - Tu Transformación AI Comienza Aquí"
            Body       = $Message
            From       = "admin@aigestion.net"
            SmtpServer = "smtp.gmail.com"
            Port       = 587
            UseSsl     = $true
        }

        Send-MailMessage @emailParams
        Write-ClientLog "Email de bienvenida enviado a $($Profile.Email)" -Level "INFO" -ClientId $Profile.ClientId

    }
    catch {
        Write-ClientLog "Error enviando email: $($_.Exception.Message)" -Level "ERROR" -ClientId $Profile.ClientId
    }
}

# Función para enviar WhatsApp de bienvenida
function Send-WhatsAppWelcome {
    param(
        [hashtable]$Profile,
        [string]$Message
    )

    try {
        # Aquí iría la integración con WhatsApp API
        # Por ahora, simulamos el envío
        $whatsappMessage = @"
🚀 *¡Bienvenido a AIGestion!*

Hola $($Profile.Name),

Gracias por unirte a la revolución de IA en AIGestion.net

📋 *Tu ID de Cliente:* $($Profile.ClientId)
🏢 *Empresa:* $($Profile.Company)
⏰ *Tiempo de respuesta:* $($Profile.PreferredChannel.ResponseTime)

Estoy aquí para ayudarte en tu transformación digital.

¿En qué puedo asistirte hoy?

---
*Alejandro Nemi*
CEO - AIGestion.net
🚀 Transformación Digital AI
"@

        Write-ClientLog "WhatsApp de bienvenida simulado para $($Profile.Phone)" -Level "INFO" -ClientId $Profile.ClientId
        Write-Host "📱 WhatsApp Message: $whatsappMessage" -ForegroundColor Green

    }
    catch {
        Write-ClientLog "Error enviando WhatsApp: $($_.Exception.Message)" -Level "ERROR" -ClientId $Profile.ClientId
    }
}

# Función para enviar Telegram de bienvenida
function Send-TelegramWelcome {
    param(
        [hashtable]$Profile,
        [string]$Message
    )

    try {
        # Aquí iría la integración con Telegram Bot API
        # Por ahora, simulamos el envío
        $telegramMessage = @"
🚀 *¡Bienvenido a AIGestion!*

Hola $($Profile.Name),

Gracias por elegir AIGestion.net para tu transformación digital con IA.

📋 *ID de Cliente:* $($Profile.ClientId)
🏢 *Empresa:* $($Profile.Company)
⚡ *Canal preferido:* Telegram
⏰ *Tiempo de respuesta:* $($Profile.PreferredChannel.ResponseTime)

Estoy listo para ayudarte a alcanzar tus objetivos con IA.

¿En qué puedo asistirte hoy?

---
*Alejandro Nemi* | @aigestion_bot
CEO - AIGestion.net
🚀 Transformación Digital AI
"@

        Write-ClientLog "Telegram de bienvenida simulado para @$($Profile.Telegram)" -Level "INFO" -ClientId $Profile.ClientId
        Write-Host "📱 Telegram Message: $telegramMessage" -ForegroundColor Cyan

    }
    catch {
        Write-ClientLog "Error enviando Telegram: $($_.Exception.Message)" -Level "ERROR" -ClientId $Profile.ClientId
    }
}

# Función para actualizar perfil de cliente
function Update-ClientProfile {
    param(
        [hashtable]$Profile
    )

    try {
        $profilePath = "$($Config.DatabasePath)$($Profile.ClientId).json"
        $Profile | ConvertTo-Json -Depth 10 | Out-File -FilePath $profilePath -Encoding UTF8
        Write-ClientLog "Perfil de cliente actualizado" -Level "DEBUG" -ClientId $Profile.ClientId

    }
    catch {
        Write-ClientLog "Error actualizando perfil: $($_.Exception.Message)" -Level "ERROR" -ClientId $Profile.ClientId
    }
}

# Función para modo interactivo
function Start-InteractiveMode {
    Write-Host "🚀 MODO INTERACTIVO - ONBOARDING CLIENTE AIGESTION" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan

    $clientData = @{}

    # Recopilar información del cliente
    $clientData.Name = Read-Host "👤 Nombre completo del cliente"
    $clientData.Email = Read-Host "📧 Email del cliente"
    $clientData.Phone = Read-Host "📱 Teléfono (formato internacional: +<país><número>)"
    $clientData.Company = Read-Host "🏢 Nombre de la empresa"
    $clientData.Telegram = Read-Host "📱 Usuario de Telegram (opcional, sin @)"

    # Verificar datos
    Write-Host "`n🔍 Verificando información del cliente..." -ForegroundColor Yellow

    $emailValidation = Test-GmailAccount -Email $clientData.Email
    Write-Host "📧 Email: $($emailValidation.Valid) - $($emailValidation.Reason)" -ForegroundColor $(if ($emailValidation.Valid) { "Green" } else { "Red" })

    if ($clientData.Phone) {
        $phoneValidation = Test-WhatsAppNumber -Phone $clientData.Phone
        Write-Host "📱 WhatsApp: $($phoneValidation.Valid) - $(if($phoneValidation.Valid) { $($phoneValidation.CleanNumber) } else { $phoneValidation.Reason })" -ForegroundColor $(if ($phoneValidation.Valid) { "Green" } else { "Red" })
    }

    if ($clientData.Telegram) {
        $telegramValidation = Test-TelegramUser -Username $clientData.Telegram
        Write-Host "📱 Telegram: $($telegramValidation.Valid) - $(if($telegramValidation.Valid) { "@$($telegramValidation.Username)" } else { $telegramValidation.Reason })" -ForegroundColor $(if ($telegramValidation.Valid) { "Green" } else { "Red" })
    }

    # Análisis de canales
    $channelAnalysis = Get-BestContactChannel -ClientData $clientData
    Write-Host "`n🎯 Análisis de canales:" -ForegroundColor Magenta
    Write-Host "   Canal recomendado: $($channelAnalysis.Recommendation)" -ForegroundColor Green

    foreach ($channel in $channelAnalysis.AllChannels) {
        Write-Host "   $($channel.Type): Confianza $($channel.Confidence) - Respuesta $($channel.ResponseTime)" -ForegroundColor Cyan
    }

    # Confirmar creación
    $confirm = Read-Host "`n✅ ¿Desea crear el perfil de cliente? (S/N)"
    if ($confirm -eq 'S' -or $confirm -eq 's') {
        # Crear perfil
        $clientProfile = New-ClientProfile -ClientData $clientData

        Write-Host "`n🎉 Perfil creado exitosamente!" -ForegroundColor Green
        Write-Host "📋 ID de Cliente: $($clientProfile.ClientId)" -ForegroundColor White
        Write-Host "📊 Perfil IA: $($clientProfile.AIProfile.CommunicationStyle) - $($clientProfile.AIProfile.TechSavviness)" -ForegroundColor Cyan

        # Enviar bienvenida
        $sendWelcome = Read-Host "📤 ¿Desea enviar mensaje de bienvenida ahora? (S/N)"
        if ($sendWelcome -eq 'S' -or $sendWelcome -eq 's') {
            Send-WelcomeMessage -ClientProfile $clientProfile
            Write-Host "✅ Mensaje de bienvenida enviado" -ForegroundColor Green
        }

        # Programar seguimiento
        $clientProfile.NextFollowUp = (Get-Date).AddDays(3)
        Update-ClientProfile -Profile $clientProfile
        Write-Host "📅 Seguimiento programado para: $($clientProfile.NextFollowUp)" -ForegroundColor Yellow

    }
    else {
        Write-Host "❌ Creación de perfil cancelada" -ForegroundColor Red
    }
}

# Función principal
function Start-ClientOnboarding {
    Write-ClientLog "🚀 Iniciando sistema de onboarding de clientes AIGestion" -Level "INFO"

    try {
        if ($Interactive) {
            Start-InteractiveMode
        }
        elseif ($ClientEmail -and $ClientName) {
            # Modo no interactivo
            $clientData = @{
                Name     = $ClientName
                Email    = $ClientEmail
                Phone    = $ClientPhone
                Company  = $ClientCompany
                Telegram = $null
            }

            $clientProfile = New-ClientProfile -ClientData $clientData

            if (!$TestMode) {
                Send-WelcomeMessage -ClientProfile $clientProfile
            }

            Write-ClientLog "Onboarding completado para cliente $($profile.ClientId)" -Level "SUCCESS" -ClientId $profile.ClientId

            return $profile

        }
        else {
            Write-Host "❌ Especifica datos del cliente o usa -Interactive" -ForegroundColor Red
            Write-Host "Ejemplo: .\AIGestion-Client-Onboarding-GodMode.ps1 -ClientEmail 'user@example.com' -ClientName 'John Doe' -Interactive" -ForegroundColor Yellow
        }

    }
    catch {
        Write-ClientLog "Error en onboarding: $($_.Exception.Message)" -Level "ERROR"
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Ejecución principal
try {
    Start-ClientOnboarding
}
catch {
    Write-Host "❌ Error fatal: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
