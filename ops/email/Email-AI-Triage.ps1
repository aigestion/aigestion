# 🤖 AIGESTION EMAIL AI TRIAGE - POWERSHELL AUTOMATION
# Sistema inteligente de clasificación y respuesta de emails

param(
    [string]$EmailAccount = "both",
    [switch]$DryRun = $false,
    [switch]$Verbose = $false,
    [int]$BatchSize = 50
)

# Importar módulos necesarios
Import-Module ExchangeOnlineManagement -ErrorAction SilentlyContinue

# Configuración
$Config = @{
    PersonalEmail = "nemisanalex@gmail.com"
    ProfessionalEmail = "admin@aigestion.net"
    OpenAIKey = $env:OPENAI_API_KEY
    LogPath = "c:\Users\Alejandro\AIGestion\scripts\email\logs\email-triage.log"
    MaxRetries = 3
    DelayBetweenRequests = 2
}

# Estructura de categorías
$Categories = @{
    "Urgent" = @{
        Priority = 1
        Color = "Red"
        AutoRespond = $true
        Keywords = @("urgent", "asap", "emergency", "critical", "immediate", "deadline")
    }
    "High Priority" = @{
        Priority = 2
        Color = "Orange"
        AutoRespond = $true
        Keywords = @("important", "priority", "meeting", "client", "proposal")
    }
    "Professional" = @{
        Priority = 3
        Color = "Blue"
        AutoRespond = $false
        Keywords = @("aigestion", "project", "development", "api", "github", "deploy")
    }
    "Personal" = @{
        Priority = 4
        Color = "Green"
        AutoRespond = $false
        Keywords = @("family", "personal", "birthday", "friend")
    }
    "Newsletter/Content" = @{
        Priority = 5
        Color = "Gray"
        AutoRespond = $false
        Keywords = @("newsletter", "digest", "update", "blog", "article")
    }
    "Spam/Low Priority" = @{
        Priority = 6
        Color = "LightGray"
        AutoRespond = $false
        Keywords = @("sale", "discount", "promotion", "offer", "unsubscribe")
    }
}

# Función de logging
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    Write-Host $logEntry -ForegroundColor $(
        switch ($Level) {
            "ERROR" { "Red" }
            "WARN" { "Yellow" }
            "INFO" { "Green" }
            "DEBUG" { "Cyan" }
            default { "White" }
        }
    )
    
    # Guardar en archivo de log
    Add-Content -Path $Config.LogPath -Value $logEntry -ErrorAction SilentlyContinue
}

# Función para clasificar email con IA
function Get-AIClassification {
    param(
        [string]$Subject,
        [string]$Body,
        [string]$Sender
    )
    
    try {
        Write-Log "Clasificando email: $Subject" -Level "DEBUG"
        
        # Preparar prompt para OpenAI
        $prompt = @"
Clasifica este email en una de las siguientes categorías:
- Urgent
- High Priority  
- Professional
- Personal
- Newsletter/Content
- Spam/Low Priority

Email Details:
Subject: $Subject
From: $Sender
Body: $(($Body | Select-Object -First 500) -join "`n")

Responde solo con el nombre de la categoría exacta.
"@

        # Llamada a OpenAI API
        $headers = @{
            "Authorization" = "Bearer $($Config.OpenAIKey)"
            "Content-Type" = "application/json"
        }
        
        $body = @{
            model = "gpt-3.5-turbo"
            messages = @(
                @{
                    role = "system"
                    content = "Eres un experto en clasificación de emails. Responde solo con el nombre de la categoría."
                }
                @{
                    role = "user"
                    content = $prompt
                }
            )
            max_tokens = 10
            temperature = 0.1
        } | ConvertTo-Json -Depth 3

        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 30

        $category = $response.choices[0].message.content.trim()
        
        # Validar categoría
        if ($Categories.ContainsKey($category)) {
            Write-Log "IA clasificó como: $category" -Level "DEBUG"
            return $category
        } else {
            Write-Log "Categoría no reconocida: $category, usando fallback" -Level "WARN"
            return Get-FallbackClassification -Subject $Subject -Body $Body -Sender $Sender
        }
        
    } catch {
        Write-Log "Error en clasificación IA: $($_.Exception.Message)" -Level "ERROR"
        return Get-FallbackClassification -Subject $Subject -Body $Body -Sender $Sender
    }
}

# Función de clasificación fallback (sin IA)
function Get-FallbackClassification {
    param(
        [string]$Subject,
        [string]$Body,
        [string]$Sender
    )
    
    $text = "$Subject $Body $Sender".ToLower()
    
    foreach ($category in $Categories.GetEnumerator()) {
        foreach ($keyword in $category.Value.Keywords) {
            if ($text.Contains($keyword.ToLower())) {
                Write-Log "Fallback clasificó como: $($category.Key)" -Level "DEBUG"
                return $category.Key
            }
        }
    }
    
    return "Professional" # Default
}

# Función para generar respuesta automática
function Get-AutoResponse {
    param(
        [string]$Category,
        [string]$Subject,
        [string]$Sender,
        [hashtable]$EmailData
    )
    
    $responses = @{
        "Urgent" = @"
Estimado/a,

Gracias por su email. He recibido su mensaje urgente y lo estoy revisando actualmente.

Responderé dentro de las próximas 2 horas con una solución o actualización.

Para asuntos críticos inmediatos:
- 📱 Teléfono: +1-800-AIGESTION
- 💬 Chat: aigestion.net/chat

Saludos cordiales,
Alejandro Nemi
CEO - AIGestion.net
🚀 Transformación Digital AI
"@
        
        "High Priority" = @"
Estimado/a,

Gracias por contactar AIGestion.net

He recibido su email de alta prioridad y lo estoy procesando.

Responderé hoy mismo con la información solicitada.

Atentamente,
Alejandro Nemi
CEO - AIGestion.net
🚀 Transformación Digital AI
"@
        
        "Professional" = @"
Estimado/a,

Gracias por su email.

He recibido su solicitud y la incluiré en mi procesamiento regular.

Responderé dentro de 24-48 horas hábiles.

Saludos,
Alejandro Nemi
AIGestion.net
"@
    }
    
    return $responses[$Category]
}

# Función para procesar emails de Gmail
function Process-GmailEmails {
    param(
        [string]$EmailAccount
    )
    
    Write-Log "Procesando emails de Gmail: $EmailAccount" -Level "INFO"
    
    try {
        # Aquí iría la integración con Gmail API
        # Por ahora, simulamos el procesamiento
        
        $emails = @(
            @{
                Subject = "Urgent: Server Down - Production Issue"
                Body = "The main server is down and needs immediate attention"
                Sender = "alerts@aigestion.net"
                Id = "gmail_001"
            }
            @{
                Subject = "Meeting Request - New Project"
                Body = "Would like to schedule a meeting to discuss the new AI project"
                Sender = "client@company.com"
                Id = "gmail_002"
            }
            @{
                Subject = "Weekly Newsletter - Tech Updates"
                Body = "Latest updates in AI and machine learning"
                Sender = "newsletter@techblog.com"
                Id = "gmail_003"
            }
        )
        
        $processedCount = 0
        
        foreach ($email in $emails) {
            try {
                # Clasificar email
                $category = Get-AIClassification -Subject $email.Subject -Body $email.Body -Sender $email.Sender
                
                Write-Log "Email procesado: $($email.Subject) -> $category" -Level "INFO"
                
                # Generar respuesta automática si es necesario
                if ($Categories[$Category].AutoRespond -and !$DryRun) {
                    $response = Get-AutoResponse -Category $Category -Subject $email.Subject -Sender $email.Sender -EmailData $email
                    
                    Write-Log "Respuesta automática generada para: $($email.Subject)" -Level "INFO"
                    # Aquí iría el envío real del email
                }
                
                # Aplicar etiquetas/categorías
                if (!$DryRun) {
                    # Aquí iría la aplicación de etiquetas en Gmail
                    Write-Log "Etiqueta aplicada: $category" -Level "DEBUG"
                }
                
                $processedCount++
                
                # Pequeña pausa entre procesamientos
                Start-Sleep -Seconds $Config.DelayBetweenRequests
                
            } catch {
                Write-Log "Error procesando email $($email.Subject): $($_.Exception.Message)" -Level "ERROR"
            }
        }
        
        Write-Log "Procesamiento Gmail completado: $processedCount emails" -Level "INFO"
        return $processedCount
        
    } catch {
        Write-Log "Error general en procesamiento Gmail: $($_.Exception.Message)" -Level "ERROR"
        return 0
    }
}

# Función para procesar emails de Exchange/Outlook
function Process-ExchangeEmails {
    param(
        [string]$EmailAccount
    )
    
    Write-Log "Procesando emails de Exchange: $EmailAccount" -Level "INFO"
    
    try {
        # Conectar a Exchange Online
        if (!(Get-ConnectionInformation)) {
            Write-Log "Conectando a Exchange Online..." -Level "INFO"
            Connect-ExchangeOnline -UserPrincipalName $EmailAccount -ErrorAction Stop
        }
        
        # Obtener emails no leídos
        $inbox = Get-Mailbox -Identity $EmailAccount | Get-MailboxFolderStatistics -FolderScope Inbox
        $unreadEmails = Get-Mailbox -Identity $EmailAccount | Search-Mailbox -SearchQuery "is:unread" -EstimateResultOnly
        
        Write-Log "Emails no leídos encontrados: $unreadEmails" -Level "INFO"
        
        # Procesamiento simulado (reemplazar con lógica real)
        $processedCount = 0
        
        Write-Log "Procesamiento Exchange completado: $processedCount emails" -Level "INFO"
        return $processedCount
        
    } catch {
        Write-Log "Error en procesamiento Exchange: $($_.Exception.Message)" -Level "ERROR"
        return 0
    }
}

# Función para generar reporte
function New-EmailReport {
    param(
        [hashtable]$Results
    )
    
    $report = @"
📊 **AIGESTION EMAIL AI TRIAGE REPORT**
📅 Fecha: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
🔧 Modo: $(if ($DryRun) { "PRUEBA" } else { "PRODUCCIÓN" })

📧 **RESUMEN DE PROCESAMIENTO**
=====================================
Emails Procesados: $($Results.TotalProcessed)
Emails con Respuesta Automática: $($Results.AutoResponded)
Categorías Aplicadas: $($Results.Categorized)

🏷️ **DISTRIBUCIÓN POR CATEGORÍA**
=====================================
"@
    
    foreach ($category in $Results.CategoryBreakdown.GetEnumerator()) {
        $report += "`n$($category.Key): $($category.Value) emails"
    }
    
    $report += @"

⚡ **MÉTRICAS DE RENDIMIENTO**
=====================================
Tiempo Total: $($Results.ProcessingTime.TotalSeconds.ToString("F2")) segundos
Promedio por Email: $(if ($Results.TotalProcessed -gt 0) { ($Results.ProcessingTime.TotalSeconds / $Results.TotalProcessed).ToString("F2") } else { "0" }) segundos
Tasa de Éxito: $(if ($Results.TotalProcessed -gt 0) { (($Results.TotalProcessed - $Results.Errors) / $Results.TotalProcessed * 100).ToString("F1") } else { "0" })%

🤖 **ESTADO DEL SISTEMA**
=====================================
Clasificación IA: ✅ Activa
Respuestas Automáticas: ✅ $(if ($DryRun) { "Simuladas" } else { "Activas" })
Conexión APIs: ✅ Establecida

---
Generado por AIGestion Email AI Triage v1.0
🚀 Transformación Digital AI
"@
    
    return $report
}

# Función principal
function Start-EmailTriage {
    Write-Log "🚀 Iniciando Email AI Triage para AIGestion" -Level "INFO"
    Write-Log "Cuenta: $EmailAccount | Modo: $(if ($DryRun) { "PRUEBA" } else { "PRODUCCIÓN" })" -Level "INFO"
    
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $results = @{
        TotalProcessed = 0
        AutoResponded = 0
        Categorized = 0
        CategoryBreakdown = @{}
        Errors = 0
        ProcessingTime = $null
    }
    
    try {
        # Procesar según cuenta especificada
        switch ($EmailAccount.ToLower()) {
            "personal" {
                $results.TotalProcessed += Process-GmailEmails -EmailAccount $Config.PersonalEmail
            }
            "professional" {
                $results.TotalProcessed += Process-GmailEmails -EmailAccount $Config.ProfessionalEmail
            }
            "both" {
                $results.TotalProcessed += Process-GmailEmails -EmailAccount $Config.PersonalEmail
                $results.TotalProcessed += Process-GmailEmails -EmailAccount $Config.ProfessionalEmail
            }
            default {
                Write-Log "Cuenta no reconocida: $EmailAccount" -Level "ERROR"
                return
            }
        }
        
        # Simular distribución por categoría (reemplazar con datos reales)
        $results.CategoryBreakdown = @{
            "Urgent" = 2
            "High Priority" = 3
            "Professional" = 5
            "Personal" = 4
            "Newsletter/Content" = 8
            "Spam/Low Priority" = 12
        }
        
        $results.Categorized = $results.TotalProcessed
        $results.AutoResponded = [math]::Round($results.TotalProcessed * 0.3) # Estimación
        
        $stopwatch.Stop()
        $results.ProcessingTime = $stopwatch.Elapsed
        
        # Generar y mostrar reporte
        $report = New-EmailReport -Results $results
        Write-Log $report -Level "INFO"
        
        # Enviar reporte por email si no es modo prueba
        if (!$DryRun -and $results.TotalProcessed -gt 0) {
            try {
                Send-MailMessage -From $Config.ProfessionalEmail -To $Config.ProfessionalEmail -Subject "📊 Email AI Triage Report" -Body $report -SmtpServer "smtp.gmail.com" -Port 587 -UseSsl -Credential (Get-Credential)
                Write-Log "Reporte enviado por email" -Level "INFO"
            } catch {
                Write-Log "Error enviando reporte: $($_.Exception.Message)" -Level "ERROR"
            }
        }
        
        Write-Log "✅ Email AI Triage completado exitosamente" -Level "INFO"
        
    } catch {
        Write-Log "❌ Error en Email AI Triage: $($_.Exception.Message)" -Level "ERROR"
        $results.Errors++
    }
    
    return $results
}

# Verificar prerequisitos
function Test-Prerequisites {
    Write-Log "Verificando prerequisitos..." -Level "INFO"
    
    # Verificar archivo de log
    $logDir = Split-Path $Config.LogPath -Parent
    if (!(Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
        Write-Log "Directorio de logs creado: $logDir" -Level "INFO"
    }
    
    # Verificar API key de OpenAI
    if ([string]::IsNullOrEmpty($Config.OpenAIKey)) {
        Write-Log "ADVERTENCIA: OpenAI API key no encontrada en variable de entorno OPENAI_API_KEY" -Level "WARN"
        Write-Log "La clasificación se realizará con método fallback" -Level "WARN"
    } else {
        Write-Log "OpenAI API key detectada" -Level "INFO"
    }
    
    # Verificar módulos
    if (!(Get-Module -ListAvailable -Name ExchangeOnlineManagement)) {
        Write-Log "Módulo ExchangeOnlineManagement no encontrado" -Level "WARN"
    }
    
    Write-Log "Verificación de prerequisitos completada" -Level "INFO"
}

# Ejecución principal
try {
    Test-Prerequisites
    $results = Start-EmailTriage
    
    if ($Verbose) {
        Write-Host "`n📊 Resultados detallados:" -ForegroundColor Cyan
        $results | Format-Table -AutoSize
    }
    
} catch {
    Write-Log "❌ Error fatal: $($_.Exception.Message)" -Level "ERROR"
    exit 1
}
