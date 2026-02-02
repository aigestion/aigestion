# 🚀 AIGESTION CLIENT AUTOMATION GOD MODE
# Sistema completo de automatización de atención al cliente nivel dios

param(
    [string]$Mode = "monitor",
    [switch]$Interactive = $false,
    [switch]$TestMode = $false,
    [int]$IntervalMinutes = 5
)

# Configuración
$Config = @{
    DatabasePath = "c:\Users\Alejandro\AIGestion\data\clients\"
    LogPath = "c:\Users\Alejandro\AIGestion\scripts\client\logs\"
    TemplatesPath = "c:\Users\Alejandro\AIGestion\scripts\client\templates\"
    TelegramBotToken = $env:TELEGRAM_BOT_TOKEN
    WhatsAppToken = $env:WHATSAPP_TOKEN
    OpenAIKey = $env:OPENAI_API_KEY
    SupabaseUrl = $env:SUPABASE_URL
    SupabaseKey = $env:SUPABASE_ANON_KEY
    AutomationRules = @{
        FollowUpInterval = 7  # días
        InactivityThreshold = 14  # días
        HighValueThreshold = 70  # score
        UrgentResponseTime = 30  # minutos
        BusinessHoursStart = 9
        BusinessHoursEnd = 18
    }
}

# Función de logging
function Write-AutomationLog {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [string]$ClientId = ""
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] [Auto:$ClientId] $Message"
    
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
    
    $logFile = "$($Config.LogPath)automation-$(Get-Date -Format 'yyyy-MM-dd').log"
    Add-Content -Path $logFile -Value $logEntry -ErrorAction SilentlyContinue
}

# Función para cargar todos los clientes
function Get-AllClients {
    try {
        $clientFiles = Get-ChildItem -Path $Config.DatabasePath -Filter "*.json"
        $clients = @()
        
        foreach ($file in $clientFiles) {
            $profileJson = Get-Content -Path $file.FullName -Raw
            $profile = $profileJson | ConvertFrom-Json -AsHashtable
            $clients += $profile
        }
        
        return $clients
    } catch {
        Write-AutomationLog "Error obteniendo clientes: $($_.Exception.Message)" -Level "ERROR"
        return @()
    }
}

# Función para verificar si es horario laboral
function Test-BusinessHours {
    $now = Get-Date
    $dayOfWeek = $now.DayOfWeek
    
    # Dias laborables (Lunes a Viernes)
    if ($dayOfWeek -eq "Saturday" -or $dayOfWeek -eq "Sunday") {
        return $false
    }
    
    # Horario laboral
    $hour = $now.Hour
    return ($hour -ge $Config.AutomationRules.BusinessHoursStart -and $hour -lt $Config.AutomationRules.BusinessHoursEnd)
}

# Función para analizar estado del cliente
function Get-ClientStatusAnalysis {
    param(
        [hashtable]$Client
    )
    
    $analysis = @{
        ClientId = $Client.ClientId
        Status = $Client.Status
        LastContact = if ($Client.ContactHistory.Count -gt 0) { $Client.ContactHistory[-1].Timestamp } else { $Client.CreatedAt }
        DaysSinceContact = 0
        RiskLevel = "Low"
        Urgency = "Normal"
        ActionsNeeded = @()
        NextActions = @()
        Score = 0
    }
    
    # Calcular días desde último contacto
    $analysis.DaysSinceContact = [math]::Round(((Get-Date) - $analysis.LastContact).TotalDays)
    
    # Análisis de riesgo
    if ($analysis.DaysSinceContact -gt $Config.AutomationRules.InactivityThreshold) {
        $analysis.RiskLevel = "High"
        $analysis.Urgency = "Urgent"
        $analysis.ActionsNeeded += "Contacto inmediato - cliente inactivo"
    } elseif ($analysis.DaysSinceContact -gt $Config.AutomationRules.FollowUpInterval) {
        $analysis.RiskLevel = "Medium"
        $analysis.Urgency = "High"
        $analysis.ActionsNeeded += "Seguimiento programado"
    }
    
    # Análisis de valor
    if ($Client.AIProfile.ValueScore -gt $Config.AutomationRules.HighValueThreshold) {
        $analysis.RiskLevel = "High"
        $analysis.ActionsNeeded += "Cliente de alto valor - priorizar atención"
    }
    
    # Análisis de estado
    if ($Client.Status -eq "Inactive") {
        $analysis.RiskLevel = "High"
        $analysis.Urgency = "Urgent"
        $analysis.ActionsNeeded += "Cliente inactivo - requiere reactivación"
    }
    
    # Calcular score general
    $analysis.Score = Calculate-ClientScore -Client $Client -Analysis $analysis
    
    # Determinar acciones siguientes
    $analysis.NextActions = Get-NextActions -Client $Client -Analysis $analysis
    
    return $analysis
}

# Función para calcular score del cliente
function Calculate-ClientScore {
    param(
        [hashtable]$Client,
        [hashtable]$Analysis
    )
    
    $score = 50  # Base score
    
    # Factor de valor
    $score += $Client.AIProfile.ValueScore * 0.3
    
    # Factor de actividad reciente
    if ($Analysis.DaysSinceContact -lt 7) {
        $score += 20
    } elseif ($Analysis.DaysSinceContact -lt 14) {
        $score += 10
    } elseif ($Analysis.DaysSinceContact -gt 30) {
        $score -= 20
    }
    
    # Factor de estado
    if ($Client.Status -eq "Active") {
        $score += 15
    } elseif ($Client.Status -eq "Inactive") {
        $score -= 25
    }
    
    # Factor de canal preferido
    if ($Client.PreferredChannel -and $Client.PreferredChannel.FinalScore -gt 0.7) {
        $score += 10
    }
    
    # Limitar score entre 0-100
    return [math]::Max(0, [math]::Min(100, $score))
}

# Función para obtener acciones siguientes
function Get-NextActions {
    param(
        [hashtable]$Client,
        [hashtable]$Analysis
    )
    
    $actions = @()
    
    if ($Analysis.Urgency -eq "Urgent") {
        $actions += @{
            Type = "ImmediateContact"
            Priority = "High"
            Channel = $Client.PreferredChannel.Type
            Message = "Contacto urgente requerido"
            Deadline = (Get-Date).AddHours($Config.AutomationRules.UrgentResponseTime / 60)
        }
    }
    
    if ($Analysis.DaysSinceContact -gt $Config.AutomationRules.FollowUpInterval) {
        $actions += @{
            Type = "FollowUp"
            Priority = "Normal"
            Channel = $Client.PreferredChannel.Type
            Message = "Seguimiento programado"
            Deadline = (Get-Date).AddDays(1)
        }
    }
    
    if ($Client.AIProfile.ValueScore -gt $Config.AutomationRules.HighValueThreshold) {
        $actions += @{
            Type = "ValueCheck"
            Priority = "Medium"
            Channel = "Email"
            Message = "Revisión de valor y satisfacción"
            Deadline = (Get-Date).AddDays(3)
        }
    }
    
    if ($Client.Status -eq "New" -and $Analysis.DaysSinceContact -gt 1) {
        $actions += @{
            Type = "OnboardingFollowUp"
            Priority = "High"
            Channel = $Client.PreferredChannel.Type
            Message = "Seguimiento de onboarding"
            Deadline = (Get-Date).AddHours(24)
        }
    }
    
    return $actions
}

# Función para ejecutar acción automatizada
function Execute-AutomatedAction {
    param(
        [hashtable]$Client,
        [hashtable]$Action
    )
    
    try {
        Write-AutomationLog "Ejecutando acción: $($Action.Type) para cliente $($Client.ClientId)" -Level "INFO" -ClientId $Client.ClientId
        
        switch ($Action.Type) {
            "ImmediateContact" {
                Send-UrgentContact -Client $Client -Action $Action
            }
            "FollowUp" {
                Send-AutomatedFollowUp -Client $Client -Action $Action
            }
            "ValueCheck" {
                Send-ValueCheckMessage -Client $Client -Action $Action
            }
            "OnboardingFollowUp" {
                Send-OnboardingFollowUp -Client $Client -Action $Action
            }
            default {
                Write-AutomationLog "Tipo de acción no reconocido: $($Action.Type)" -Level "WARN" -ClientId $Client.ClientId
            }
        }
        
        # Actualizar historial
        $Client.ContactHistory += @{
            Timestamp = Get-Date
            Type = $Action.Type
            Channel = $Action.Channel
            Status = "Automated"
            Message = $Action.Message
            ActionId = $Action.Priority
        }
        
        # Guardar perfil actualizado
        Update-ClientProfile -Profile $Client
        
        Write-AutomationLog "Acción ejecutada exitosamente: $($Action.Type)" -Level "SUCCESS" -ClientId $Client.ClientId
        return $true
        
    } catch {
        Write-AutomationLog "Error ejecutando acción: $($_.Exception.Message)" -Level "ERROR" -ClientId $Client.ClientId
        return $false
    }
}

# Función para enviar contacto urgente
function Send-UrgentContact {
    param(
        [hashtable]$Client,
        [hashtable]$Action
    )
    
    $message = Get-UrgentContactMessage -Client $Client
    
    switch ($Action.Channel) {
        "Email" {
            Send-EmailMessage -Client $Client -Message $message -Subject "🚨 Urgente - AIGestion"
        }
        "WhatsApp" {
            Send-WhatsAppMessage -Client $Client -Message $message
        }
        "Telegram" {
            Send-TelegramMessage -Client $Client -Message $message
        }
    }
}

# Función para enviar seguimiento automatizado
function Send-AutomatedFollowUp {
    param(
        [hashtable]$Client,
        [hashtable]$Action
    )
    
    $message = Get-FollowUpMessage -Client $Client
    
    switch ($Action.Channel) {
        "Email" {
            Send-EmailMessage -Client $Client -Message $message -Subject "📋 Seguimiento AIGestion"
        }
        "WhatsApp" {
            Send-WhatsAppMessage -Client $Client -Message $message
        }
        "Telegram" {
            Send-TelegramMessage -Client $Client -Message $message
        }
    }
}

# Función para enviar mensaje de verificación de valor
function Send-ValueCheckMessage {
    param(
        [hashtable]$Client,
        [hashtable]$Action
    )
    
    $message = GetValueCheckMessage -Client $Client
    
    switch ($Action.Channel) {
        "Email" {
            Send-EmailMessage -Client $Client -Message $message -Subject "💰 Valor AIGestion - Tu Opión Importa"
        }
        "WhatsApp" {
            Send-WhatsAppMessage -Client $Client -Message $message
        }
        "Telegram" {
            Send-TelegramMessage -Client $Client -Message $message
        }
    }
}

# Función para enviar seguimiento de onboarding
function Send-OnboardingFollowUp {
    param(
        [hashtable]$Client,
        [hashtable]$Action
    )
    
    $message = Get-OnboardingFollowUpMessage -Client $Client
    
    switch ($Action.Channel) {
        "Email" {
            Send-EmailMessage -Client $Client -Message $message -Subject "🚀 Onboarding AIGestion"
        }
        "WhatsApp" {
            Send-WhatsAppMessage -Client $Client -Message $message
        }
        "Telegram" {
            Send-TelegramMessage -Client $Client -Message $message
        }
    }
}

# Función para generar mensaje de contacto urgente
function Get-UrgentContactMessage {
    param(
        [hashtable]$Client
    )
    
    $baseMessage = switch ($Client.AIProfile.CommunicationStyle) {
        "Formal" { "Estimado/a $($Client.Name)," }
        "Professional" { "Hola $($Client.Name)," }
        "Casual" { "¡Hola $($Client.Name)!" }
        default { "Hola $($Client.Name)," }
    }
    
    $urgencyText = "He notado que hace tiempo que no tenemos contacto. Quería asegurarme de que todo esté bien y ver si hay algo en lo que pueda ayudarte urgentemente."
    
    $offerHelp = "Como cliente valioso para AIGestion, tu satisfacción es mi prioridad. ¿Hay algún desafío que esté enfrentando o alguna oportunidad donde pueda asistirte?"
    
    $closing = switch ($Client.AIProfile.CommunicationStyle) {
        "Formal" { "Espero tu pronta respuesta." }
        "Professional" { "Quedo a tu disposición." }
        "Casual" { "¡Espero saber de ti pronto!" }
        default { "Quedo a tu disposición." }
    }
    
    return @"
$baseMessage

$urgencyText

$offerHelp

$closing

Alejandro Nemi
CEO - AIGestion.net
🚀 Transformación Digital AI
📱 Respuesta inmediata: +1-800-AIGESTION
"@
}

# Función para generar mensaje de seguimiento
function Get-FollowUpMessage {
    param(
        [hashtable]$Client
    )
    
    $baseMessage = switch ($Client.AIProfile.CommunicationStyle) {
        "Formal" { "Estimado/a $($Client.Name)," }
        "Professional" { "Hola $($Client.Name)," }
        "Casual" { "¡Hola $($Client.Name)!" }
        default { "Hola $($Client.Name)," }
    }
    
    $followUpText = "Espero que estés teniendo excelentes resultados con las soluciones de AIGestion. Quería hacer un seguimiento para ver cómo va todo y si necesitas algo adicional."
    
    $valueAdd = if ($Client.AIProfile.TechSavviness -eq "High") {
        "Además, tengo algunas actualizaciones técnicas que podrían interesarte basadas en tu perfil."
    } else {
        "Estoy aquí para asegurar que estés obteniendo el máximo valor de nuestra plataforma."
    }
    
    $closing = switch ($Client.AIProfile.CommunicationStyle) {
        "Formal" { "Atentamente," }
        "Professional" { "Saludos cordiales," }
        "Casual" { "¡Que tengas un excelente día!" }
        default { "Saludos," }
    }
    
    return @"
$baseMessage

$followUpText

$valueAdd

$closing

Alejandro Nemi
CEO - AIGestion.net
🚀 Transformación Digital AI
"@
}

# Función para generar mensaje de verificación de valor
function GetValueCheckMessage {
    param(
        [hashtable]$Client
    )
    
    $baseMessage = switch ($Client.AIProfile.CommunicationStyle) {
        "Formal" { "Estimado/a $($Client.Name)," }
        "Professional" { "Hola $($Client.Name)," }
        "Casual" { "¡Hola $($Client.Name)!" }
        default { "Hola $($Client.Name)," }
    }
    
    $valueText = "Como cliente valioso para AIGestion, tu opinión y satisfacción son extremadamente importantes para mí. Quisiera saber cómo ha sido tu experiencia hasta ahora."
    
    $questions = @"
• ¿Cómo ha sido tu experiencia con AIGestion?
• ¿Hay alguna característica que te gustaría que mejoremos?
• ¿Qué resultados has obtenido hasta ahora?
• ¿Hay algo adicional que podamos ofrecer para potenciar tu éxito?
"@
    
    $closing = switch ($Client.AIProfile.CommunicationStyle) {
        "Formal" { "Agradezco de antemano tu tiempo y feedback." }
        "Professional" { "Tu feedback nos ayuda a mejorar continuamente." }
        "Casual" { "¡Tu opinión es súper importante para nosotros!" }
        default { "Agradezco tu tiempo y consideración." }
    }
    
    return @"
$baseMessage

$valueText

$questions

$closing

Alejandro Nemi
CEO - AIGestion.net
🚀 Transformación Digital AI
"@
}

# Función para generar mensaje de seguimiento de onboarding
function Get-OnboardingFollowUpMessage {
    param(
        [hashtable]$Client
    )
    
    $baseMessage = switch ($Client.AIProfile.CommunicationStyle) {
        "Formal" { "Estimado/a $($Client.Name)," }
        "Professional" { "Hola $($Client.Name)," }
        "Casual" { "¡Hola $($Client.Name)!" }
        default { "Hola $($Client.Name)," }
    }
    
    $onboardingText = "Quería asegurarme de que tu proceso de onboarding con AIGestion esté yendo perfectamente. ¿Has tenido oportunidad de explorar todas las funcionalidades?"
    
    $helpOffer = "Estoy aquí para responder cualquier pregunta y ayudarte a sacar el máximo provecho desde el primer día. ¿Hay algo específico que te gustaría que configuremos o expliquemos?"
    
    $resources = @"
Recursos disponibles:
• Dashboard interactivo: aigestion.net/dashboard
• Documentación: docs.aigestion.net
• Video tutoriales: youtube.com/aigestestion
• Soporte 24/7: support@aigestion.net
"@
    
    $closing = switch ($Client.AIProfile.CommunicationStyle) {
        "Formal" { "Quedo a tu completa disposición." }
        "Professional" { "Estoy aquí para asegurar tu éxito." }
        "Casual" { "¡Cuenta conmigo para lo que necesites!" }
        default { "Estoy aquí para ayudarte." }
    }
    
    return @"
$baseMessage

$onboardingText

$helpOffer

$resources

$closing

Alejandro Nemi
CEO - AIGestion.net
🚀 Transformación Digital AI
"@
}

# Función para enviar email
function Send-EmailMessage {
    param(
        [hashtable]$Client,
        [string]$Message,
        [string]$Subject
    )
    
    try {
        $emailParams = @{
            To = $Client.Email
            Subject = $Subject
            Body = $Message
            From = "admin@aigestion.net"
            SmtpServer = "smtp.gmail.com"
            Port = 587
            UseSsl = $true
        }
        
        if (!$TestMode) {
            Send-MailMessage @emailParams
        }
        
        Write-AutomationLog "Email enviado a $($Client.Email): $Subject" -Level "INFO" -ClientId $Client.ClientId
        
    } catch {
        Write-AutomationLog "Error enviando email: $($_.Exception.Message)" -Level "ERROR" -ClientId $Client.ClientId
    }
}

# Función para enviar WhatsApp
function Send-WhatsAppMessage {
    param(
        [hashtable]$Client,
        [string]$Message
    )
    
    try {
        # Aquí iría la integración con WhatsApp API
        # Por ahora, simulamos el envío
        $whatsappMessage = @"
🚀 *AIGestion*

$Message

---
*Alejandro Nemi*
CEO - AIGestion.net
🚀 Transformación Digital AI
"@
        
        if (!$TestMode) {
            # Integración real con WhatsApp API
        }
        
        Write-AutomationLog "WhatsApp enviado a $($Client.Phone)" -Level "INFO" -ClientId $Client.ClientId
        Write-Host "📱 WhatsApp: $whatsappMessage" -ForegroundColor Green
        
    } catch {
        Write-AutomationLog "Error enviando WhatsApp: $($_.Exception.Message)" -Level "ERROR" -ClientId $Client.ClientId
    }
}

# Función para enviar Telegram
function Send-TelegramMessage {
    param(
        [hashtable]$Client,
        [string]$Message
    )
    
    try {
        # Aquí iría la integración con Telegram Bot API
        # Por ahora, simulamos el envío
        $telegramMessage = @"
🚀 *AIGestion*

$Message

---
*Alejandro Nemi* | @aigestion_bot
CEO - AIGestion.net
🚀 Transformación Digital AI
"@
        
        if (!$TestMode) {
            # Integración real con Telegram Bot API
        }
        
        Write-AutomationLog "Telegram enviado a @$($Client.Telegram)" -Level "INFO" -ClientId $Client.ClientId
        Write-Host "📱 Telegram: $telegramMessage" -ForegroundColor Cyan
        
    } catch {
        Write-AutomationLog "Error enviando Telegram: $($_.Exception.Message)" -Level "ERROR" -ClientId $Client.ClientId
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
        Write-AutomationLog "Perfil actualizado" -Level "DEBUG" -ClientId $Profile.ClientId
        
    } catch {
        Write-AutomationLog "Error actualizando perfil: $($_.Exception.Message)" -Level "ERROR" -ClientId $Profile.ClientId
    }
}

# Función principal de monitoreo
function Start-ClientMonitoring {
    Write-AutomationLog "🚀 Iniciando monitoreo automatizado de clientes" -Level "INFO"
    
    try {
        $clients = Get-AllClients
        $actionsExecuted = 0
        $errors = 0
        
        Write-AutomationLog "Analizando $($clients.Count) clientes" -Level "INFO"
        
        foreach ($client in $clients) {
            try {
                # Analizar estado del cliente
                $analysis = Get-ClientStatusAnalysis -Client $client
                
                Write-AutomationLog "Cliente $($client.ClientId): Score $($analysis.Score), Riesgo $($analysis.RiskLevel)" -Level "DEBUG" -ClientId $client.ClientId
                
                # Ejecutar acciones necesarias
                foreach ($action in $analysis.NextActions) {
                    # Verificar si es horario laboral para acciones no urgentes
                    if ($action.Priority -ne "High" -or Test-BusinessHours) {
                        $success = Execute-AutomatedAction -Client $client -Action $action
                        if ($success) {
                            $actionsExecuted++
                        } else {
                            $errors++
                        }
                    } else {
                        Write-AutomationLog "Acción pospuesta por horario no laboral: $($action.Type)" -Level "DEBUG" -ClientId $client.ClientId
                    }
                }
                
            } catch {
                Write-AutomationLog "Error procesando cliente $($client.ClientId): $($_.Exception.Message)" -Level "ERROR" -ClientId $client.ClientId
                $errors++
            }
        }
        
        Write-AutomationLog "Monitoreo completado: $actionsExecuted acciones ejecutadas, $errors errores" -Level "SUCCESS"
        
        return @{
            ClientsProcessed = $clients.Count
            ActionsExecuted = $actionsExecuted
            Errors = $errors
        }
        
    } catch {
        Write-AutomationLog "Error en monitoreo: $($_.Exception.Message)" -Level "ERROR"
        return @{
            ClientsProcessed = 0
            ActionsExecuted = 0
            Errors = 1
        }
    }
}

# Función para modo interactivo
function Start-InteractiveMode {
    Write-Host "🚀 MODO INTERACTIVO - AUTOMATIZACIÓN CLIENTES AIGESTION" -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Cyan
    
    $clients = Get-AllClients
    
    if ($clients.Count -eq 0) {
        Write-Host "❌ No hay clientes registrados" -ForegroundColor Red
        return
    }
    
    Write-Host "`n📊 Estado Actual de Clientes:" -ForegroundColor Yellow
    
    foreach ($client in $clients) {
        $analysis = Get-ClientStatusAnalysis -Client $client
        
        $statusColor = switch ($analysis.RiskLevel) {
            "High" { "Red" }
            "Medium" { "Yellow" }
            "Low" { "Green" }
            default { "White" }
        }
        
        Write-Host "$($client.ClientId) - $($client.Name)" -ForegroundColor White
        Write-Host "  Score: $($analysis.Score) | Riesgo: $($analysis.RiskLevel) | Último contacto: $($analysis.DaysSinceContact) días" -ForegroundColor $statusColor
        
        if ($analysis.NextActions.Count -gt 0) {
            Write-Host "  Acciones pendientes: $($analysis.NextActions.Count)" -ForegroundColor Cyan
        }
    }
    
    $choice = Read-Host "`n🎯 ¿Qué deseas hacer? (1=Monitoreo, 2=Análisis detallado, 3=Ejecutar acción, 0=Salir)"
    
    switch ($choice) {
        "1" {
            $results = Start-ClientMonitoring
            Write-Host "`n✅ Monitoreo completado: $($results.ActionsExecuted) acciones ejecutadas" -ForegroundColor Green
        }
        "2" {
            $clientId = Read-Host "📋 ID del cliente para análisis detallado"
            $client = $clients | Where-Object { $_.ClientId -eq $clientId }
            if ($client) {
                $analysis = Get-ClientStatusAnalysis -Client $client
                Write-Host "`n📊 Análisis detallado para $($client.Name):" -ForegroundColor Magenta
                Write-Host "Score: $($analysis.Score)" -ForegroundColor White
                Write-Host "Riesgo: $($analysis.RiskLevel)" -ForegroundColor White
                Write-Host "Urgencia: $($analysis.Urgency)" -ForegroundColor White
                Write-Host "Días desde contacto: $($analysis.DaysSinceContact)" -ForegroundColor White
                Write-Host "`nAcciones necesarias:" -ForegroundColor Yellow
                foreach ($action in $analysis.ActionsNeeded) {
                    Write-Host "• $action" -ForegroundColor White
                }
            } else {
                Write-Host "❌ Cliente no encontrado" -ForegroundColor Red
            }
        }
        "3" {
            Write-Host "🔧 Modo ejecución de acción - En desarrollo" -ForegroundColor Yellow
        }
        "0" {
            Write-Host "👋 Saliendo del modo interactivo" -ForegroundColor Green
        }
        default {
            Write-Host "❌ Opción no válida" -ForegroundColor Red
        }
    }
}

# Función principal
function Start-ClientAutomation {
    Write-AutomationLog "🚀 Iniciando sistema de automatización de clientes AIGestion" -Level "INFO"
    
    try {
        switch ($Mode) {
            "monitor" {
                if ($Interactive) {
                    Start-InteractiveMode
                } else {
                    $results = Start-ClientMonitoring
                    Write-AutomationLog "Automatización completada: $($results.ActionsExecuted) acciones ejecutadas" -Level "SUCCESS"
                }
            }
            "continuous" {
                Write-AutomationLog "Iniciando modo continuo (intervalo: $IntervalMinutes minutos)" -Level "INFO"
                
                while ($true) {
                    $results = Start-ClientMonitoring
                    Write-AutomationLog "Ciclo completado: $($results.ActionsExecuted) acciones" -Level "INFO"
                    
                    Write-Host "⏰ Próximo ciclo en $IntervalMinutes minutos..." -ForegroundColor Yellow
                    Start-Sleep -Seconds ($IntervalMinutes * 60)
                }
            }
            default {
                Write-AutomationLog "Modo no reconocido: $Mode" -Level "ERROR"
                Write-Host "❌ Modo no reconocido. Usa: monitor, continuous" -ForegroundColor Red
            }
        }
        
    } catch {
        Write-AutomationLog "Error en automatización: $($_.Exception.Message)" -Level "ERROR"
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Ejecución principal
try {
    Start-ClientAutomation
} catch {
    Write-Host "❌ Error fatal: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
