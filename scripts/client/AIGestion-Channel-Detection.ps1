# 🚀 AIGESTION CHANNEL DETECTION AI
# Sistema inteligente para detectar y optimizar canales de comunicación con clientes

param(
    [string]$ClientId = "",
    [string]$TestContact = "",
    [switch]$AnalyzeAll = $false,
    [switch]$Interactive = $false,
    [switch]$TestMode = $false
)

# Configuración
$Config = @{
    DatabasePath = "c:\Users\Alejandro\AIGestion\data\clients\"
    LogPath = "c:\Users\Alejandro\AIGestion\scripts\client\logs\"
    TelegramBotToken = $env:TELEGRAM_BOT_TOKEN
    WhatsAppToken = $env:WHATSAPP_TOKEN
    OpenAIKey = $env:OPENAI_API_KEY
    ChannelWeights = @{
        Email = @{
            Reliability = 0.8
            Speed = 0.6
            Personalization = 0.7
            Tracking = 0.9
            Cost = 0.9
        }
        WhatsApp = @{
            Reliability = 0.9
            Speed = 0.95
            Personalization = 0.8
            Tracking = 0.7
            Cost = 0.6
        }
        Telegram = @{
            Reliability = 0.85
            Speed = 0.9
            Personalization = 0.75
            Tracking = 0.8
            Cost = 0.8
        }
    }
}

# Función de logging
function Write-ChannelLog {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [string]$ClientId = ""
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] [Channel:$ClientId] $Message"
    
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
    
    $logFile = "$($Config.LogPath)channel-detection-$(Get-Date -Format 'yyyy-MM-dd').log"
    Add-Content -Path $logFile -Value $logEntry -ErrorAction SilentlyContinue
}

# Función para analizar canal de email
function Test-EmailChannel {
    param(
        [string]$Email
    )
    
    try {
        Write-ChannelLog "Analizando canal Email: $Email" -Level "DEBUG"
        
        $analysis = @{
            Channel = "Email"
            Available = $false
            Quality = 0
            ResponseTime = ""
            Details = @{}
            Recommendations = @()
        }
        
        # Validación básica de formato
        if ($Email -notmatch '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') {
            $analysis.Details.Error = "Formato de email inválido"
            return $analysis
        }
        
        # Análisis de dominio
        $domain = ($Email -split '@')[1].ToLower()
        
        # Clasificación de dominio
        if ($domain -eq 'gmail.com') {
            $analysis.Details.Type = "Personal Gmail"
            $analysis.Quality = 0.7
            $analysis.ResponseTime = "2-4 horas"
            $analysis.Available = $true
        } elseif ($domain -match '\.(com|org|net|io|ai|tech)$') {
            $analysis.Details.Type = "Corporate/Professional"
            $analysis.Quality = 0.9
            $analysis.ResponseTime = "1-2 horas"
            $analysis.Available = $true
        } elseif ($domain -match '\.(edu|gov|mil)$') {
            $analysis.Details.Type = "Institutional"
            $analysis.Quality = 0.85
            $analysis.ResponseTime = "24-48 horas"
            $analysis.Available = $true
        } else {
            $analysis.Details.Type = "Other"
            $analysis.Quality = 0.6
            $analysis.ResponseTime = "4-8 horas"
            $analysis.Available = $true
        }
        
        # Verificación DNS MX
        try {
            $mxRecords = Resolve-DnsName -Name $domain -Type MX -ErrorAction SilentlyContinue
            if ($mxRecords) {
                $analysis.Details.MXRecords = $mxRecords.Count
                $analysis.Available = $true
            } else {
                $analysis.Details.MXRecords = 0
                $analysis.Quality *= 0.5
            }
        } catch {
            $analysis.Details.MXRecords = "Error"
            $analysis.Quality *= 0.7
        }
        
        # Análisis de reputación (simulado)
        $analysis.Details.Reputation = Get-EmailReputation -Domain $domain
        
        # Recomendaciones
        if ($analysis.Quality -lt 0.7) {
            $analysis.Recommendations += "Considerar verificar si el email está activo"
        }
        
        if ($domain -eq 'gmail.com') {
            $analysis.Recommendations += "Email personal - adecuado para comunicación informal"
        } else {
            $analysis.Recommendations += "Email corporativo - ideal para comunicación profesional"
        }
        
        # Calcular score final
        $weights = $Config.ChannelWeights.Email
        $analysis.FinalScore = (
            ($analysis.Available ? 1 : 0) * $weights.Reliability +
            $analysis.Quality * $weights.Speed +
            ($analysis.Details.Reputation -eq "Good" ? 1 : 0.5) * $weights.Personalization +
            0.8 * $weights.Tracking +
            0.9 * $weights.Cost
        ) / 5
        
        return $analysis
        
    } catch {
        Write-ChannelLog "Error analizando email $Email`: $($_.Exception.Message)" -Level "ERROR"
        return @{
            Channel = "Email"
            Available = $false
            Quality = 0
            Error = $_.Exception.Message
        }
    }
}

# Función para analizar canal WhatsApp
function Test-WhatsAppChannel {
    param(
        [string]$Phone
    )
    
    try {
        Write-ChannelLog "Analizando canal WhatsApp: $Phone" -Level "DEBUG"
        
        $analysis = @{
            Channel = "WhatsApp"
            Available = $false
            Quality = 0
            ResponseTime = ""
            Details = @{}
            Recommendations = @()
        }
        
        # Limpiar y validar número
        $cleanPhone = $Phone -replace '[^\d+]' -replace '^(\d{2})', '+$1'
        
        if ($cleanPhone -notmatch '^\+\d{10,15}$') {
            $analysis.Details.Error = "Formato de teléfono inválido. Use formato internacional: +<país><número>"
            return $analysis
        }
        
        $analysis.Details.CleanNumber = $cleanPhone
        $analysis.Details.Country = Get-CountryFromPhone -Phone $cleanPhone
        
        # Análisis por país
        $countryAnalysis = Get-WhatsAppCountryAnalysis -Country $analysis.Details.Country
        $analysis.Details.CountryAnalysis = $countryAnalysis
        
        # Verificación de WhatsApp Business (simulada)
        $whatsappStatus = Test-WhatsAppBusinessStatus -Phone $cleanPhone
        $analysis.Details.WhatsappStatus = $whatsappStatus
        
        if ($whatsappStatus.Available) {
            $analysis.Available = $true
            $analysis.Quality = 0.9
            $analysis.ResponseTime = "5-15 minutos"
        } else {
            $analysis.Available = $false
            $analysis.Quality = 0.3
            $analysis.ResponseTime = "No disponible"
        }
        
        # Análisis de patrón de número
        $numberPattern = Get-PhoneNumberPattern -Phone $cleanPhone
        $analysis.Details.NumberPattern = $numberPattern
        
        # Recomendaciones
        if ($analysis.Available) {
            $analysis.Recommendations += "WhatsApp disponible - excelente para comunicación rápida"
            $analysis.Recommendations += "Ideal para notificaciones urgentes y seguimiento"
        } else {
            $analysis.Recommendations += "WhatsApp no disponible - verificar número"
            $analysis.Recommendations += "Considerar alternativas como Telegram o email"
        }
        
        if ($countryAnalysis.Penetration -gt 0.8) {
            $analysis.Recommendations += "Alta penetración de WhatsApp en $($analysis.Details.Country)"
        }
        
        # Calcular score final
        $weights = $Config.ChannelWeights.WhatsApp
        $analysis.FinalScore = (
            ($analysis.Available ? 1 : 0) * $weights.Reliability +
            ($analysis.Available ? 0.95 : 0) * $weights.Speed +
            0.8 * $weights.Personalization +
            0.7 * $weights.Tracking +
            0.6 * $weights.Cost
        ) / 5
        
        return $analysis
        
    } catch {
        Write-ChannelLog "Error analizando WhatsApp $Phone`: $($_.Exception.Message)" -Level "ERROR"
        return @{
            Channel = "WhatsApp"
            Available = $false
            Quality = 0
            Error = $_.Exception.Message
        }
    }
}

# Función para analizar canal Telegram
function Test-TelegramChannel {
    param(
        [string]$Username
    )
    
    try {
        Write-ChannelLog "Analizando canal Telegram: $Username" -Level "DEBUG"
        
        $analysis = @{
            Channel = "Telegram"
            Available = $false
            Quality = 0
            ResponseTime = ""
            Details = @{}
            Recommendations = @()
        }
        
        # Liminar username
        $cleanUsername = $Username.TrimStart('@')
        
        if ($cleanUsername -notmatch '^[a-zA-Z0-9_]{5,32}$') {
            $analysis.Details.Error = "Username inválido. Debe tener 5-32 caracteres alfanuméricos"
            return $analysis
        }
        
        $analysis.Details.Username = $cleanUsername
        $analysis.Details.TelegramUrl = "https://t.me/$cleanUsername"
        
        # Verificación de usuario (simulada)
        $telegramStatus = Test-TelegramUserStatus -Username $cleanUsername
        $analysis.Details.TelegramStatus = $telegramStatus
        
        if ($telegramStatus.Available) {
            $analysis.Available = $true
            $analysis.Quality = 0.85
            $analysis.ResponseTime = "10-30 minutos"
        } else {
            $analysis.Available = $false
            $analysis.Quality = 0.2
            $analysis.ResponseTime = "No disponible"
        }
        
        # Análisis de actividad (simulado)
        $activityAnalysis = Get-TelegramActivityAnalysis -Username $cleanUsername
        $analysis.Details.ActivityAnalysis = $activityAnalysis
        
        # Recomendaciones
        if ($analysis.Available) {
            $analysis.Recommendations += "Telegram disponible - bueno para comunicación técnica"
            $analysis.Recommendations += "Ideal para compartir archivos y enlaces"
        } else {
            $analysis.Recommendations += "Usuario no encontrado - verificar username"
            $analysis.Recommendations += "El usuario puede estar privado o no existir"
        }
        
        if ($activityAnalysis.IsActive) {
            $analysis.Recommendations += "Usuario activo - alta probabilidad de respuesta"
        }
        
        # Calcular score final
        $weights = $Config.ChannelWeights.Telegram
        $analysis.FinalScore = (
            ($analysis.Available ? 1 : 0) * $weights.Reliability +
            ($analysis.Available ? 0.9 : 0) * $weights.Speed +
            0.75 * $weights.Personalization +
            0.8 * $weights.Tracking +
            0.8 * $weights.Cost
        ) / 5
        
        return $analysis
        
    } catch {
        Write-ChannelLog "Error analizando Telegram $Username`: $($_.Exception.Message)" -Level "ERROR"
        return @{
            Channel = "Telegram"
            Available = $false
            Quality = 0
            Error = $_.Exception.Message
        }
    }
}

# Función para obtener reputación de email
function Get-EmailReputation {
    param(
        [string]$Domain
    )
    
    # Simulación de análisis de reputación
    $reputationDB = @{
        "gmail.com" = "Good"
        "outlook.com" = "Good"
        "yahoo.com" = "Fair"
        "hotmail.com" = "Good"
        "aigestion.net" = "Excellent"
        "google.com" = "Excellent"
        "microsoft.com" = "Excellent"
        "amazon.com" = "Excellent"
        "facebook.com" = "Excellent"
    }
    
    return $reputationDB[$Domain] ?? "Fair"
}

# Función para obtener país desde teléfono
function Get-CountryFromPhone {
    param(
        [string]$Phone
    )
    
    $countryCodes = @{
        '+1' = 'Estados Unidos/Canadá'
        '+52' = 'México'
        '+34' = 'España'
        '+54' = 'Argentina'
        '+56' = 'Chile'
        '+57' = 'Colombia'
        '+58' = 'Venezuela'
        '+55' = 'Brasil'
        '+598' = 'Uruguay'
        '+593' = 'Ecuador'
        '+51' = 'Perú'
        '+351' = 'Portugal'
        '+39' = 'Italia'
        '+33' = 'Francia'
        '+49' = 'Alemania'
        '+44' = 'Reino Unido'
        '+81' = 'Japón'
        '+86' = 'China'
        '+91' = 'India'
        '+61' = 'Australia'
        '+7' = 'Rusia'
    }
    
    foreach ($code in $countryCodes.GetEnumerator()) {
        if ($Phone.StartsWith($code.Key)) {
            return $code.Value
        }
    }
    
    return 'Desconocido'
}

# Función para analizar país para WhatsApp
function Get-WhatsAppCountryAnalysis {
    param(
        [string]$Country
    )
    
    $countryData = @{
        "México" = @{ Penetration = 0.85; Preferred = true; ResponseTime = "Rápido" }
        "España" = @{ Penetration = 0.88; Preferred = true; ResponseTime = "Rápido" }
        "Argentina" = @{ Penetration = 0.82; Preferred = true; ResponseTime = "Rápido" }
        "Colombia" = @{ Penetration = 0.80; Preferred = true; ResponseTime = "Rápido" }
        "Chile" = @{ Penetration = 0.78; Preferred = true; ResponseTime = "Rápido" }
        "Perú" = @{ Penetration = 0.75; Preferred = true; ResponseTime = "Rápido" }
        "Brasil" = @{ Penetration = 0.90; Preferred = true; ResponseTime = "Muy Rápido" }
        "Estados Unidos/Canadá" = @{ Penetration = 0.65; Preferred = false; ResponseTime = "Moderado" }
        "Reino Unido" = @{ Penetration = 0.70; Preferred = false; ResponseTime = "Moderado" }
        "Alemania" = @{ Penetration = 0.60; Preferred = false; ResponseTime = "Moderado" }
    }
    
    return $countryData[$Country] ?? @{ Penetration = 0.5; Preferred = $false; ResponseTime = "Variable" }
}

# Función para verificar estado WhatsApp Business (simulado)
function Test-WhatsAppBusinessStatus {
    param(
        [string]$Phone
    )
    
    # Simulación de verificación con WhatsApp API
    return @{
        Available = $true  # Simulación
        Business = $true
        LastSeen = (Get-Date).AddHours(-2)
        Status = "Active"
    }
}

# Función para obtener patrón de número telefónico
function Get-PhoneNumberPattern {
    param(
        [string]$Phone
    )
    
    if ($Phone.StartsWith('+52')) {
        return "México - Móvil"
    } elseif ($Phone.StartsWith('+1')) {
        return "Norteamérica"
    } elseif ($Phone.StartsWith('+34')) {
        return "España"
    } elseif ($Phone.StartsWith('+55')) {
        return "Brasil"
    } else {
        return "Internacional"
    }
}

# Función para verificar estado de usuario Telegram (simulado)
function Test-TelegramUserStatus {
    param(
        [string]$Username
    )
    
    # Simulación de verificación con Telegram Bot API
    return @{
        Available = $true  # Simulación
        Verified = $false
        Active = $true
        LastSeen = (Get-Date).AddHours(-1)
        Language = "es"
    }
}

# Función para analizar actividad de Telegram (simulada)
function Get-TelegramActivityAnalysis {
    param(
        [string]$Username
    )
    
    # Simulación de análisis de actividad
    return @{
        IsActive = $true
        DailyUsage = $true
        ResponseRate = 0.85
        AverageResponseTime = "15 minutos"
        PreferredFor = "Technical discussions"
    }
}

# Función para análisis integral de canales
function Get-ComprehensiveChannelAnalysis {
    param(
        [hashtable]$ContactInfo
    )
    
    Write-ChannelLog "Iniciando análisis integral de canales" -Level "INFO"
    
    $analysis = @{
        Timestamp = Get-Date
        ContactInfo = $ContactInfo
        Channels = @()
        BestChannel = $null
        Recommendations = @()
        OverallScore = 0
    }
    
    # Analizar cada canal disponible
    if ($ContactInfo.Email) {
        $emailAnalysis = Test-EmailChannel -Email $ContactInfo.Email
        $analysis.Channels += $emailAnalysis
    }
    
    if ($ContactInfo.Phone) {
        $whatsappAnalysis = Test-WhatsAppChannel -Phone $ContactInfo.Phone
        $analysis.Channels += $whatsappAnalysis
    }
    
    if ($ContactInfo.Telegram) {
        $telegramAnalysis = Test-TelegramChannel -Username $ContactInfo.Telegram
        $analysis.Channels += $telegramAnalysis
    }
    
    # Ordenar canales por score final
    $analysis.Channels = $analysis.Channels | Sort-Object -Property FinalScore -Descending
    
    # Determinar mejor canal
    if ($analysis.Channels.Count -gt 0) {
        $analysis.BestChannel = $analysis.Channels[0]
        $analysis.OverallScore = $analysis.Channels[0].FinalScore
    }
    
    # Generar recomendaciones combinadas
    $analysis.Recommendations = Get-CombinedRecommendations -Channels $analysis.Channels
    
    return $analysis
}

# Función para generar recomendaciones combinadas
function Get-CombinedRecommendations {
    param(
        [array]$Channels
    )
    
    $recommendations = @()
    
    $availableChannels = $Channels | Where-Object { $_.Available }
    $highQualityChannels = $availableChannels | Where-Object { $_.FinalScore -gt 0.7 }
    
    if ($highQualityChannels.Count -eq 0) {
        $recommendations += "No se encontraron canales de alta calidad disponibles"
        $recommendations += "Verificar la información de contacto proporcionada"
    } elseif ($highQualityChannels.Count -eq 1) {
        $recommendations += "Usar $($highQualityChannels[0].Channel) como canal principal"
        $recommendations += "Canal con $($highQualityChannels[0].ResponseTime) de respuesta"
    } else {
        $recommendations += "Múltiples canales disponibles - usar estrategia multicanal"
        $recommendations += "Priorizar $($highQualityChannels[0].Channel) para comunicación urgente"
        $recommendations += "Usar $($highQualityChannels[1].Channel) para seguimiento regular"
    }
    
    # Recomendaciones específicas por canal
    foreach ($channel in $availableChannels) {
        $recommendations += $channel.Recommendations
    }
    
    return $recommendations | Select-Object -Unique
}

# Función para cargar perfil de cliente
function Get-ClientProfile {
    param(
        [string]$ClientId
    )
    
    try {
        $profilePath = "$($Config.DatabasePath)$ClientId.json"
        if (Test-Path $profilePath) {
            $profileJson = Get-Content -Path $profilePath -Raw
            return $profileJson | ConvertFrom-Json -AsHashtable
        } else {
            Write-ChannelLog "Cliente no encontrado: $ClientId" -Level "WARN"
            return $null
        }
    } catch {
        Write-ChannelLog "Error cargando perfil $ClientId`: $($_.Exception.Message)" -Level "ERROR"
        return $null
    }
}

# Función para actualizar perfil con análisis de canales
function Update-ClientChannelAnalysis {
    param(
        [string]$ClientId,
        [hashtable]$ChannelAnalysis
    )
    
    try {
        $profile = Get-ClientProfile -ClientId $ClientId
        if ($profile) {
            $profile.ChannelAnalysis = $channelAnalysis
            $profile.PreferredChannel = $channelAnalysis.BestChannel
            $profile.LastChannelAnalysis = Get-Date
            
            $profilePath = "$($Config.DatabasePath)$ClientId.json"
            $profile | ConvertTo-Json -Depth 10 | Out-File -FilePath $profilePath -Encoding UTF8
            
            Write-ChannelLog "Análisis de canales actualizado para cliente $ClientId" -Level "SUCCESS" -ClientId $ClientId
            return $true
        }
        return $false
    } catch {
        Write-ChannelLog "Error actualizando análisis $ClientId`: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientId
        return $false
    }
}

# Función para modo interactivo
function Start-InteractiveMode {
    Write-Host "🚀 MODO INTERACTIVO - DETECCIÓN DE CANALES AIGESTION" -ForegroundColor Cyan
    Write-Host "=================================================" -ForegroundColor Cyan
    
    $contactInfo = @{}
    
    # Recopilar información de contacto
    $contactInfo.Email = Read-Host "📧 Email del contacto"
    $contactInfo.Phone = Read-Host "📱 Teléfono (formato internacional)"
    $contactInfo.Telegram = Read-Host "📱 Usuario Telegram (opcional, sin @)"
    
    Write-Host "`n🔍 Analizando canales de comunicación..." -ForegroundColor Yellow
    
    # Análisis integral
    $analysis = Get-ComprehensiveChannelAnalysis -ContactInfo $contactInfo
    
    # Mostrar resultados
    Write-Host "`n📊 ANÁLISIS DE CANALES" -ForegroundColor Magenta
    Write-Host "========================" -ForegroundColor Magenta
    
    foreach ($channel in $analysis.Channels) {
        $status = if ($channel.Available) { "✅ Disponible" } else { "❌ No disponible" }
        $score = [math]::Round($channel.FinalScore * 100, 1)
        
        Write-Host "`n📱 $($channel.Channel)" -ForegroundColor White
        Write-Host "   Estado: $status" -ForegroundColor $(if($channel.Available) { "Green" } else { "Red" })
        Write-Host "   Score: $score%" -ForegroundColor $(if($score -gt 70) { "Green" } elseif ($score -gt 50) { "Yellow" } else { "Red" })
        Write-Host "   Tiempo respuesta: $($channel.ResponseTime)" -ForegroundColor Cyan
        
        if ($channel.Details.Type) {
            Write-Host "   Tipo: $($channel.Details.Type)" -ForegroundColor White
        }
        
        if ($channel.Details.Country) {
            Write-Host "   País: $($channel.Details.Country)" -ForegroundColor White
        }
    }
    
    # Mostrar mejor canal
    if ($analysis.BestChannel) {
        Write-Host "`n🎯 CANAL RECOMENDADO" -ForegroundColor Green
        Write-Host "===================" -ForegroundColor Green
        Write-Host "Canal: $($analysis.BestChannel.Channel)" -ForegroundColor White
        Write-Host "Score: $([math]::Round($analysis.BestChannel.FinalScore * 100, 1))%" -ForegroundColor White
        Write-Host "Tiempo: $($analysis.BestChannel.ResponseTime)" -ForegroundColor White
    }
    
    # Mostrar recomendaciones
    Write-Host "`n💡 RECOMENDACIONES" -ForegroundColor Yellow
    Write-Host "==================" -ForegroundColor Yellow
    foreach ($rec in $analysis.Recommendations) {
        Write-Host "• $rec" -ForegroundColor White
    }
    
    # Opción de guardar
    $save = Read-Host "`n💾 ¿Desea guardar este análisis? (S/N)"
    if ($save -eq 'S' -or $save -eq 's') {
        $clientId = Read-Host "📋 ID del cliente (o dejar en blanco para nuevo)"
        if ([string]::IsNullOrEmpty($clientId)) {
            $clientId = "TEST-" + (Get-Date -Format "yyyyMMdd-HHmmss")
        }
        
        $success = Update-ClientChannelAnalysis -ClientId $clientId -ChannelAnalysis $analysis
        if ($success) {
            Write-Host "✅ Análisis guardado para cliente $clientId" -ForegroundColor Green
        } else {
            Write-Host "❌ Error guardando análisis" -ForegroundColor Red
        }
    }
}

# Función principal
function Start-ChannelDetection {
    Write-ChannelLog "🚀 Iniciando sistema de detección de canales AIGestion" -Level "INFO"
    
    try {
        if ($Interactive) {
            Start-InteractiveMode
        } elseif ($AnalyzeAll) {
            # Analizar todos los clientes
            $clients = Get-ChildItem -Path $Config.DatabasePath -Filter "*.json"
            Write-ChannelLog "Analizando canales para $($clients.Count) clientes" -Level "INFO"
            
            foreach ($file in $clients) {
                $profile = Get-ClientProfile -ClientId $file.BaseName
                if ($profile) {
                    $contactInfo = @{
                        Email = $profile.Email
                        Phone = $profile.Phone
                        Telegram = $profile.Telegram
                    }
                    
                    $analysis = Get-ComprehensiveChannelAnalysis -ContactInfo $contactInfo
                    Update-ClientChannelAnalysis -ClientId $file.BaseName -ChannelAnalysis $analysis
                    
                    Write-ChannelLog "Cliente $($file.BaseName): Mejor canal $($analysis.BestChannel.Channel)" -Level "SUCCESS" -ClientId $file.BaseName
                }
            }
            
        } elseif ($TestContact) {
            # Modo de prueba con contacto específico
            $contactInfo = @{
                Email = if ($TestContact -match '@') { $TestContact } else { $null }
                Phone = if ($TestContact -match '^\+') { $TestContact } else { $null }
                Telegram = if ($TestContact -match '^[a-zA-Z]') { $TestContact } else { $null }
            }
            
            $analysis = Get-ComprehensiveChannelAnalysis -ContactInfo $contactInfo
            
            Write-Host "📊 ANÁLISIS PARA: $TestContact" -ForegroundColor Cyan
            Write-Host "Mejor canal: $($analysis.BestChannel.Channel)" -ForegroundColor Green
            Write-Host "Score: $([math]::Round($analysis.BestChannel.FinalScore * 100, 1))%" -ForegroundColor White
            
        } elseif ($ClientId) {
            # Analizar cliente específico
            $profile = Get-ClientProfile -ClientId $ClientId
            if ($profile) {
                $contactInfo = @{
                    Email = $profile.Email
                    Phone = $profile.Phone
                    Telegram = $profile.Telegram
                }
                
                $analysis = Get-ComprehensiveChannelAnalysis -ContactInfo $contactInfo
                Update-ClientChannelAnalysis -ClientId $ClientId -ChannelAnalysis $analysis
                
                Write-ChannelLog "Análisis completado para cliente $ClientId" -Level "SUCCESS" -ClientId $ClientId
                
                Write-Host "📊 Cliente: $($profile.Name)" -ForegroundColor Cyan
                Write-Host "Mejor canal: $($analysis.BestChannel.Channel)" -ForegroundColor Green
                Write-Host "Score: $([math]::Round($analysis.BestChannel.FinalScore * 100, 1))%" -ForegroundColor White
            } else {
                Write-ChannelLog "Cliente no encontrado: $ClientId" -Level "ERROR"
                Write-Host "❌ Cliente no encontrado: $ClientId" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Especifica ClientId, -AnalyzeAll, -TestContact o usa -Interactive" -ForegroundColor Red
        }
        
    } catch {
        Write-ChannelLog "Error en detección de canales: $($_.Exception.Message)" -Level "ERROR"
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Ejecución principal
try {
    Start-ChannelDetection
} catch {
    Write-Host "❌ Error fatal: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
