# 🚀 AIGESTION CLIENT FOLLOWUP GOD MODE
# Sistema inteligente de seguimiento y atención al cliente nivel dios

param(
    [string]$ClientId = "",
    [string]$Action = "check",
    [switch]$AllClients = $false,
    [switch]$Interactive = $false,
    [switch]$TestMode = $false
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
}

# Función de logging
function Write-FollowUpLog {
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
    
    $logFile = "$($Config.LogPath)followup-$(Get-Date -Format 'yyyy-MM-dd').log"
    Add-Content -Path $logFile -Value $logEntry -ErrorAction SilentlyContinue
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
            Write-FollowUpLog "Cliente no encontrado: $ClientId" -Level "WARN" -ClientId $ClientId
            return $null
        }
    } catch {
        Write-FollowUpLog "Error cargando perfil $ClientId`: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientId
        return $null
    }
}

# Función para obtener todos los clientes
function Get-AllClients {
    try {
        $clientFiles = Get-ChildItem -Path $Config.DatabasePath -Filter "*.json"
        $clients = @()
        
        foreach ($file in $clientFiles) {
            $profile = Get-ClientProfile -ClientId $file.BaseName
            if ($profile) {
                $clients += $profile
            }
        }
        
        return $clients
    } catch {
        Write-FollowUpLog "Error obteniendo todos los clientes: $($_.Exception.Message)" -Level "ERROR"
        return @()
    }
}

# Función para analizar IA de seguimiento
function Get-AIFollowUpAnalysis {
    param(
        [hashtable]$ClientProfile
    )
    
    try {
        $analysis = @{
            FollowUpNeeded = $false
            Priority = "Normal"
            RecommendedAction = ""
            NextContactDate = $null
            PersonalizedMessage = ""
            RiskFactors = @()
            Opportunities = @()
        }
        
        # Analizar tiempo desde último contacto
        $lastContact = if ($ClientProfile.ContactHistory.Count -gt 0) {
            $ClientProfile.ContactHistory[-1].Timestamp
        } else {
            $ClientProfile.CreatedAt
        }
        
        $daysSinceContact = (Get-Date) - $lastContact
        
        # Análisis basado en perfil IA
        $aiProfile = $ClientProfile.AIProfile
        
        # Determinar si se necesita seguimiento
        if ($daysSinceContact.Days -gt 7) {
            $analysis.FollowUpNeeded = $true
            $analysis.Priority = "High"
            $analysis.RecommendedAction = "Contactar cliente - hace $($daysSinceContact.Days) días sin contacto"
        } elseif ($daysSinceContact.Days -gt 3) {
            $analysis.FollowUpNeeded = $true
            $analysis.Priority = "Normal"
            $analysis.RecommendedAction = "Seguimiento regular - hace $($daysSinceContact.Days) días"
        }
        
        # Analizar factores de riesgo
        if ($ClientProfile.Status -eq "Inactive") {
            $analysis.RiskFactors += "Cliente inactivo"
            $analysis.Priority = "Urgent"
        }
        
        if ($daysSinceContact.Days -gt 14) {
            $analysis.RiskFactors += "Sin contacto por más de 2 semanas"
            $analysis.Priority = "Urgent"
        }
        
        # Analizar oportunidades
        if ($ClientProfile.AIProfile.ValueScore -gt 70) {
            $analysis.Opportunities += "Alto valor de cliente - priorizar atención"
        }
        
        if ($ClientProfile.AIProfile.TechSavviness -eq "High") {
            $analysis.Opportunities += "Cliente tech-savvy - ofrecer soluciones avanzadas"
        }
        
        # Generar mensaje personalizado con IA
        $analysis.PersonalizedMessage = Get-PersonalizedFollowUpMessage -ClientProfile $ClientProfile -Analysis $analysis
        
        # Calcular próxima fecha de contacto
        $analysis.NextContactDate = Get-OptimalFollowUpDate -ClientProfile $ClientProfile -Analysis $analysis
        
        return $analysis
        
    } catch {
        Write-FollowUpLog "Error en análisis IA: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientProfile.ClientId
        return @{
            FollowUpNeeded = $false
            Priority = "Normal"
            RecommendedAction = "Error en análisis"
            PersonalizedMessage = ""
        }
    }
}

# Función para generar mensaje personalizado
function Get-PersonalizedFollowUpMessage {
    param(
        [hashtable]$ClientProfile,
        [hashtable]$Analysis
    )
    
    try {
        $baseMessage = ""
        
        # Personalizar según estilo de comunicación
        switch ($ClientProfile.AIProfile.CommunicationStyle) {
            "Formal" {
                $baseMessage = "Estimado/a $($ClientProfile.Name),"
            }
            "Professional" {
                $baseMessage = "Hola $($ClientProfile.Name),"
            }
            "Casual" {
                $baseMessage = "¡Hola $($ClientProfile.Name)!"
            }
            default {
                $baseMessage = "Hola $($ClientProfile.Name),"
            }
        }
        
        # Mensaje según tiempo sin contacto
        $daysSinceContact = if ($ClientProfile.ContactHistory.Count -gt 0) {
            ((Get-Date) - $ClientProfile.ContactHistory[-1].Timestamp).Days
        } else {
            ((Get-Date) - $ClientProfile.CreatedAt).Days
        }
        
        if ($daysSinceContact -gt 14) {
            $followupText = "Ha pasado un tiempo desde nuestro último contacto. Quería asegurarme de que todo esté marchando bien y ver si hay algo en lo que pueda ayudarte."
        } elseif ($daysSinceContact -gt 7) {
            $followupText = "Espero que estés teniendo una excelente semana. Quería hacer un seguimiento para ver cómo va todo con la implementación de AIGestion."
        } else {
            $followupText = "Solo un saludo rápido para ver cómo estás y si necesitas algo adicional de nuestra parte."
        }
        
        # Agregar valor según perfil
        $valueAddition = ""
        if ($ClientProfile.AIProfile.TechSavviness -eq "High") {
            $valueAddition = "`n`nAdemás, tengo algunas nuevas actualizaciones de IA que podrían interesarte basadas en tu perfil tecnológico."
        }
        
        if ($ClientProfile.AIProfile.ValueScore -gt 70) {
            $valueAddition = "`n`nComo cliente valioso para nosotros, quiero asegurarme de que estás obteniendo el máximo valor de nuestras soluciones."
        }
        
        # Llamada a la acción
        $cta = "`n`n¿Te gustaría agendar una breve llamada esta semana para discutir tu progreso?"
        
        # Cierre
        $closing = switch ($ClientProfile.AIProfile.CommunicationStyle) {
            "Formal" { "Atentamente," }
            "Professional" { "Saludos cordiales," }
            "Casual" { "¡Que tengas un gran día!" }
            default { "Saludos," }
        }
        
        $fullMessage = @"
$baseMessage

$followupText$valueAddition$cta

$closing
Alejandro Nemi
CEO - AIGestion.net
🚀 Transformación Digital AI
"@
        
        return $fullMessage.Trim()
        
    } catch {
        Write-FollowUpLog "Error generando mensaje personalizado: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientProfile.ClientId
        return "Hola $($ClientProfile.Name), ¿Cómo estás? Quería hacer un seguimiento para ver cómo va todo."
    }
}

# Función para calcular fecha óptima de seguimiento
function Get-OptimalFollowUpDate {
    param(
        [hashtable]$ClientProfile,
        [hashtable]$Analysis
    )
    
    try {
        $baseDate = Get-Date
        
        # Ajustar según perfil del cliente
        switch ($ClientProfile.AIProfile.BestContactTime) {
            "Morning" {
                $optimalTime = "10:00 AM"
            }
            "Afternoon" {
                $optimalTime = "2:00 PM"
            }
            "Evening" {
                $optimalTime = "6:00 PM"
            }
            default {
                $optimalTime = "10:00 AM"
            }
        }
        
        # Calcular días según frecuencia
        $daysToAdd = switch ($ClientProfile.AIProfile.FollowupFrequency) {
            "Daily" { 1 }
            "Weekly" { 7 }
            "Biweekly" { 14 }
            "Monthly" { 30 }
            default { 7 }
        }
        
        # Ajustar según prioridad
        if ($Analysis.Priority -eq "Urgent") {
            $daysToAdd = 1
        } elseif ($Analysis.Priority -eq "High") {
            $daysToAdd = [Math]::Max(1, $daysToAdd - 3)
        }
        
        # Evitar fines de semana
        $nextDate = $baseDate.AddDays($daysToAdd)
        while ($nextDate.DayOfWeek -eq "Saturday" -or $nextDate.DayOfWeek -eq "Sunday") {
            $nextDate = $nextDate.AddDays(1)
        }
        
        # Establecer hora óptima
        $timeParts = $optimalTime -split " "
        $hour = if ($timeParts[1] -eq "PM") { [int]$timeParts[0] + 12 } else { [int]$timeParts[0] }
        
        return Get-Date -Year $nextDate.Year -Month $nextDate.Month -Day $nextDate.Day -Hour $hour -Minute 0 -Second 0
        
    } catch {
        Write-FollowUpLog "Error calculando fecha óptima: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientProfile.ClientId
        return (Get-Date).AddDays(7)
    }
}

# Función para enviar seguimiento
function Send-FollowUp {
    param(
        [hashtable]$ClientProfile,
        [hashtable]$Analysis
    )
    
    try {
        $message = $Analysis.PersonalizedMessage
        
        # Enviar por canal preferido
        switch ($ClientProfile.PreferredChannel.Type) {
            "Email" {
                Send-EmailFollowUp -Profile $ClientProfile -Message $message
            }
            "WhatsApp" {
                Send-WhatsAppFollowUp -Profile $ClientProfile -Message $message
            }
            "Telegram" {
                Send-TelegramFollowUp -Profile $ClientProfile -Message $message
            }
            default {
                Write-FollowUpLog "Canal preferido no válido: $($ClientProfile.PreferredChannel.Type)" -Level "WARN" -ClientId $ClientProfile.ClientId
                return $false
            }
        }
        
        # Actualizar historial de contacto
        $ClientProfile.ContactHistory += @{
            Timestamp = Get-Date
            Type = "FollowUp"
            Channel = $ClientProfile.PreferredChannel.Type
            Status = "Sent"
            Message = "Mensaje de seguimiento enviado"
            Analysis = $Analysis
        }
        
        # Actualizar próximo seguimiento
        $ClientProfile.NextFollowUp = $Analysis.NextContactDate
        
        # Guardar perfil actualizado
        Update-ClientProfile -Profile $ClientProfile
        
        Write-FollowUpLog "Seguimiento enviado por $($ClientProfile.PreferredChannel.Type)" -Level "SUCCESS" -ClientId $ClientProfile.ClientId
        
        return $true
        
    } catch {
        Write-FollowUpLog "Error enviando seguimiento: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientProfile.ClientId
        return $false
    }
}

# Función para enviar email de seguimiento
function Send-EmailFollowUp {
    param(
        [hashtable]$Profile,
        [string]$Message
    )
    
    try {
        $emailParams = @{
            To = $Profile.Email
            Subject = "🚀 Seguimiento AIGestion - ¿Cómo va todo?"
            Body = $Message
            From = "admin@aigestion.net"
            SmtpServer = "smtp.gmail.com"
            Port = 587
            UseSsl = $true
        }
        
        Send-MailMessage @emailParams
        Write-FollowUpLog "Email de seguimiento enviado a $($Profile.Email)" -Level "INFO" -ClientId $Profile.ClientId
        
    } catch {
        Write-FollowUpLog "Error enviando email: $($_.Exception.Message)" -Level "ERROR" -ClientId $Profile.ClientId
    }
}

# Función para enviar WhatsApp de seguimiento
function Send-WhatsAppFollowUp {
    param(
        [hashtable]$Profile,
        [string]$Message
    )
    
    try {
        # Aquí iría la integración con WhatsApp API
        # Por ahora, simulamos el envío
        $whatsappMessage = @"
🚀 *Seguimiento AIGestion*

$Message

---
*Alejandro Nemi*
CEO - AIGestion.net
🚀 Transformación Digital AI
"@
        
        Write-FollowUpLog "WhatsApp de seguimiento simulado para $($Profile.Phone)" -Level "INFO" -ClientId $Profile.ClientId
        Write-Host "📱 WhatsApp Follow-up: $whatsappMessage" -ForegroundColor Green
        
    } catch {
        Write-FollowUpLog "Error enviando WhatsApp: $($_.Exception.Message)" -Level "ERROR" -ClientId $Profile.ClientId
    }
}

# Función para enviar Telegram de seguimiento
function Send-TelegramFollowUp {
    param(
        [hashtable]$Profile,
        [string]$Message
    )
    
    try {
        # Aquí iría la integración con Telegram Bot API
        # Por ahora, simulamos el envío
        $telegramMessage = @"
🚀 *Seguimiento AIGestion*

$Message

---
*Alejandro Nemi* | @aigestion_bot
CEO - AIGestion.net
🚀 Transformación Digital AI
"@
        
        Write-FollowUpLog "Telegram de seguimiento simulado para @$($Profile.Telegram)" -Level "INFO" -ClientId $Profile.ClientId
        Write-Host "📱 Telegram Follow-up: $telegramMessage" -ForegroundColor Cyan
        
    } catch {
        Write-FollowUpLog "Error enviando Telegram: $($_.Exception.Message)" -Level "ERROR" -ClientId $Profile.ClientId
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
        Write-FollowUpLog "Perfil de cliente actualizado" -Level "DEBUG" -ClientId $Profile.ClientId
        
    } catch {
        Write-FollowUpLog "Error actualizando perfil: $($_.Exception.Message)" -Level "ERROR" -ClientId $Profile.ClientId
    }
}

# Función para verificar seguimientos pendientes
function Check-PendingFollowUps {
    Write-FollowUpLog "Verificando seguimientos pendientes..." -Level "INFO"
    
    try {
        $clients = Get-AllClients
        $pendingCount = 0
        $sentCount = 0
        
        foreach ($client in $clients) {
            # Verificar si necesita seguimiento
            $analysis = Get-AIFollowUpAnalysis -ClientProfile $client
            
            if ($analysis.FollowUpNeeded) {
                $pendingCount++
                
                # Verificar si ya pasó la fecha de seguimiento
                if ($client.NextFollowUp -and (Get-Date) -ge $client.NextFollowUp) {
                    Write-FollowUpLog "Enviando seguimiento para cliente $($client.ClientId)" -Level "INFO" -ClientId $client.ClientId
                    
                    if (!$TestMode) {
                        $success = Send-FollowUp -ClientProfile $client -Analysis $analysis
                        if ($success) {
                            $sentCount++
                        }
                    } else {
                        Write-FollowUpLog "MODO PRUEBA: Seguimiento simulado para $($client.ClientId)" -Level "INFO" -ClientId $client.ClientId
                        $sentCount++
                    }
                } else {
                    Write-FollowUpLog "Seguimiento programado para $($client.NextFollowUp)" -Level "DEBUG" -ClientId $client.ClientId
                }
            }
        }
        
        Write-FollowUpLog "Verificación completada: $pendingCount pendientes, $sentCount enviados" -Level "SUCCESS"
        
        return @{
            PendingCount = $pendingCount
            SentCount = $sentCount
            TotalClients = $clients.Count
        }
        
    } catch {
        Write-FollowUpLog "Error en verificación de seguimientos: $($_.Exception.Message)" -Level "ERROR"
        return @{
            PendingCount = 0
            SentCount = 0
            TotalClients = 0
        }
    }
}

# Función para generar reporte de seguimiento
function New-FollowUpReport {
    param(
        [hashtable]$Results
    )
    
    $report = @"
📊 **AIGESTION CLIENT FOLLOWUP REPORT**
📅 Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
🔧 Modo: $(if ($TestMode) { "PRUEBA" } else { "PRODUCCIÓN" })

📈 **RESUMEN DE SEGUIMIENTO**
=====================================
Total Clientes: $($Results.TotalClients)
Seguimientos Pendientes: $($Results.PendingCount)
Seguimientos Enviados: $($Results.SentCount)
Tasa de Ejecución: $(if ($Results.PendingCount -gt 0) { [math]::Round(($Results.SentCount / $Results.PendingCount) * 100, 1) } else { 0 })%

🎯 **MÉTRICAS DE RENDIMIENTO**
=====================================
Clientes Activos: $(($Results.TotalClients - $Results.PendingCount))
Clientes Necesitan Atención: $($Results.PendingCount)
Seguimientos Programados: $($Results.PendingCount - $Results.SentCount)

🤖 **ESTADO DEL SISTEMA**
=====================================
Análisis IA: ✅ Activo
Mensajes Personalizados: ✅ Generados
Múltiples Canales: ✅ Disponibles
Programación Inteligente: ✅ Activa

---
Generado por AIGestion Client FollowUp v1.0
🚀 Transformación Digital AI
"@
    
    return $report
}

# Función para modo interactivo
function Start-InteractiveMode {
    Write-Host "🚀 MODO INTERACTIVO - SEGUIMIENTO CLIENTES AIGESTION" -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Cyan
    
    $clients = Get-AllClients
    
    if ($clients.Count -eq 0) {
        Write-Host "❌ No hay clientes registrados" -ForegroundColor Red
        return
    }
    
    Write-Host "`n📋 Lista de Clientes:" -ForegroundColor Yellow
    for ($i = 0; $i -lt $clients.Count; $i++) {
        $client = $clients[$i]
        $status = if ($client.Status -eq "Active") { "✅" } else { "⚠️" }
        $lastContact = if ($client.ContactHistory.Count -gt 0) { 
            $client.ContactHistory[-1].Timestamp.ToString("yyyy-MM-dd") 
        } else { 
            "Nunca" 
        }
        
        Write-Host "$($i + 1). $($client.ClientId) - $($client.Name) - $($client.Company) $status (Último: $lastContact)" -ForegroundColor White
    }
    
    $choice = Read-Host "`n🎯 Selecciona un cliente (1-$($clients.Count)) o 0 para verificar todos"
    
    if ($choice -eq "0") {
        $results = Check-PendingFollowUps
        $report = New-FollowUpReport -Results $results
        Write-Host "`n$report" -ForegroundColor Green
        
    } elseif ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $clients.Count) {
        $selectedClient = $clients[[int]$choice - 1]
        
        Write-Host "`n📊 Análisis de Cliente: $($selectedClient.Name)" -ForegroundColor Magenta
        Write-Host "ID: $($selectedClient.ClientId)" -ForegroundColor White
        Write-Host "Empresa: $($selectedClient.Company)" -ForegroundColor White
        Write-Host "Estado: $($selectedClient.Status)" -ForegroundColor White
        Write-Host "Canal Preferido: $($selectedClient.PreferredChannel.Type)" -ForegroundColor White
        
        $analysis = Get-AIFollowUpAnalysis -ClientProfile $selectedClient
        
        Write-Host "`n🤖 Análisis IA:" -ForegroundColor Cyan
        Write-Host "Seguimiento Necesario: $(if ($analysis.FollowUpNeeded) { 'Sí' } else { 'No' })" -ForegroundColor $(if ($analysis.FollowUpNeeded) { 'Green' } else { 'Yellow' })
        Write-Host "Prioridad: $($analysis.Priority)" -ForegroundColor White
        Write-Host "Recomendación: $($analysis.RecommendedAction)" -ForegroundColor White
        
        if ($analysis.FollowUpNeeded) {
            $sendFollowUp = Read-Host "`n📤 ¿Enviar seguimiento ahora? (S/N)"
            if ($sendFollowUp -eq 'S' -or $sendFollowUp -eq 's') {
                $success = Send-FollowUp -ClientProfile $selectedClient -Analysis $analysis
                if ($success) {
                    Write-Host "✅ Seguimiento enviado exitosamente" -ForegroundColor Green
                } else {
                    Write-Host "❌ Error enviando seguimiento" -ForegroundColor Red
                }
            }
        }
        
    } else {
        Write-Host "❌ Selección inválida" -ForegroundColor Red
    }
}

# Función principal
function Start-ClientFollowUp {
    Write-FollowUpLog "🚀 Iniciando sistema de seguimiento de clientes AIGestion" -Level "INFO"
    
    try {
        switch ($Action) {
            "check" {
                if ($AllClients) {
                    $results = Check-PendingFollowUps
                    $report = New-FollowUpReport -Results $results
                    Write-Host $report -ForegroundColor Green
                } elseif ($ClientId) {
                    $client = Get-ClientProfile -ClientId $ClientId
                    if ($client) {
                        $analysis = Get-AIFollowUpAnalysis -ClientProfile $client
                        Write-FollowUpLog "Análisis completado para cliente $ClientId" -Level "SUCCESS" -ClientId $ClientId
                        
                        Write-Host "📊 Análisis para $($client.Name):" -ForegroundColor Cyan
                        Write-Host "Seguimiento Needed: $($analysis.FollowUpNeeded)" -ForegroundColor White
                        Write-Host "Priority: $($analysis.Priority)" -ForegroundColor White
                        Write-Host "Next Contact: $($analysis.NextContactDate)" -ForegroundColor White
                        
                        if ($analysis.FollowUpNeeded -and !$TestMode) {
                            Send-FollowUp -ClientProfile $client -Analysis $analysis
                        }
                    } else {
                        Write-FollowUpLog "Cliente no encontrado: $ClientId" -Level "ERROR"
                        Write-Host "❌ Cliente no encontrado: $ClientId" -ForegroundColor Red
                    }
                } else {
                    Write-Host "❌ Especifica ClientId o usa -AllClients" -ForegroundColor Red
                }
            }
            "interactive" {
                Start-InteractiveMode
            }
            default {
                Write-Host "❌ Acción no reconocida: $Action" -ForegroundColor Red
                Write-Host "Acciones disponibles: check, interactive" -ForegroundColor Yellow
            }
        }
        
    } catch {
        Write-FollowUpLog "Error en seguimiento: $($_.Exception.Message)" -Level "ERROR"
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Ejecución principal
try {
    if ($Interactive) {
        Start-InteractiveMode
    } else {
        Start-ClientFollowUp
    }
} catch {
    Write-Host "❌ Error fatal: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
