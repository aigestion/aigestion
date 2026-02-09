# 🚀 AIGESTION CONTENT GENERATOR GOD MODE
# Generador de contenido inteligente para redes sociales con IA

param(
    [string]$Platform = "all",
    [string]$Topic = "",
    [string]$ContentType = "post",
    [int]$Count = 5,
    [switch]$Interactive = $false,
    [switch]$BatchMode = $false
)

# Configuración
$Config = @{
    OpenAIKey = $env:OPENAI_API_KEY
    OutputPath = "c:\Users\Alejandro\AIGestion\content\social-media\generated\"
    TemplatesPath = "c:\Users\Alejandro\AIGestion\scripts\social-media\templates\"
    LogPath = "c:\Users\Alejandro\AIGestion\scripts\social-media\logs\"
    
    # Estrategia de contenido
    ContentPillars = @(
        "Educación AI",
        "Casos de Éxito", 
        "Innovación Tecnológica",
        "Tendencias del Mercado",
        "Consejos Profesionales",
        "Noticias de la Empresa",
        "Contenido entre Bastidores",
        "Tutoriales y Guías"
    )
    
    # Tonos de comunicación
    Tones = @(
        "professional",
        "inspirational", 
        "educational",
        "casual",
        "technical",
        "promotional"
    )
    
    # Formatos de contenido
    Formats = @(
        "post",
        "thread",
        "story",
        "reel",
        "short",
        "article",
        "carousel"
    )
    
    # Platform-specific configurations
    PlatformConfigs = @{
        Facebook = @{
            MaxLength = 63206
            HashtagLimit = 30
            ImageRequired = $false
            BestHashtags = @("#AIGestion", "#AI", "#TransformacionDigital", "#Innovacion", "#Tecnologia")
            CallToActions = @("Visítanos en aigestion.net", "Agenda una demo", "Descubre más", "Contáctanos")
        }
        Twitter = @{
            MaxLength = 280
            HashtagLimit = 3
            ImageRequired = $false
            BestHashtags = @("#AIGestion", "#AI", "#Tech", "#Startup", "#Innovation")
            CallToActions = @("Visítanos", "Agenda demo", "Descubre más", "Contáctanos")
        }
        Instagram = @{
            MaxLength = 2200
            HashtagLimit = 30
            ImageRequired = $true
            BestHashtags = @("#AIGestion", "#AI", "#Design", "#Technology", "#Innovation", "#DigitalTransformation")
            CallToActions = @("Link en bio", "Visítanos", "Agenda demo", "Descubre más")
        }
        LinkedIn = @{
            MaxLength = 3000
            HashtagLimit = 10
            ImageRequired = $false
            BestHashtags = @("#AIGestion", "#AI", "#Business", "#Technology", "#Leadership", "#DigitalTransformation")
            CallToActions = @("Visítanos en aigestion.net", "Conecta con nosotros", "Agenda una consulta")
        }
        TikTok = @{
            MaxLength = 150
            HashtagLimit = 5
            ImageRequired = $true
            BestHashtags = @("#AIGestion", "#AI", "#Tech", "#Trending", "#Viral", "#LearnOnTikTok")
            CallToActions = @("Link en bio", "Síguenos", "Descubre más")
        }
        YouTube = @{
            MaxLength = 5000
            HashtagLimit = 15
            ImageRequired = $true
            BestHashtags = @("#AIGestion", "#AI", "#Technology", "#Education", "#Tutorial", "#DigitalTransformation")
            CallToActions = @("Suscríbete", "Visítanos en aigestion.net", "Comenta abajo")
        }
    }
}

# Crear directorios necesarios
$directories = @($Config.OutputPath, $Config.TemplatesPath, $Config.LogPath)
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
}

# Función de logging
function Write-ContentLog {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] [ContentGen] $Message"
    
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
    
    $logFile = "$($Config.LogPath)content-generator-$(Get-Date -Format 'yyyy-MM-dd').log"
    Add-Content -Path $logFile -Value $logEntry -ErrorAction SilentlyContinue
}

# Función para generar contenido con OpenAI
function Get-OpenAIContent {
    param(
        [string]$Platform,
        [string]$Topic,
        [string]$ContentType,
        [string]$Tone = "professional",
        [string]$Format = "post"
    )
    
    try {
        Write-ContentLog "Generando contenido con OpenAI para $Platform - $Topic" -Level "DEBUG"
        
        if ([string]::IsNullOrEmpty($Config.OpenAIKey)) {
            Write-ContentLog "OpenAI API key no configurada" -Level "WARN"
            return Get-FallbackContent -Platform $Platform -Topic $Topic -ContentType $ContentType -Tone $Tone
        }
        
        $platformConfig = $Config.PlatformConfigs[$Platform]
        
        $prompt = @"
Genera contenido para redes sociales para AIGestion.net

PLATAFORMA: $Platform
TEMA: $Topic
TIPO DE CONTENIDO: $ContentType
TONO: $Tone
FORMATO: $Format
LÍMITE DE CARACTERES: $($platformConfig.MaxLength)
LÍMITE DE HASHTAGS: $($platformConfig.HashtagLimit)
HASHTAGS RECOMENDADOS: $($platformConfig.BestHashtags -join ", ")
LLAMADAS A LA ACCIÓN: $($platformConfig.CallToActions -join ", ")

AIGestion.net es una empresa líder en transformación digital con inteligencia artificial que ayuda a las empresas a:
- Automatizar procesos repetitivos
- Optimizar operaciones empresariales
- Tomar decisiones basadas en datos
- Implementar soluciones de IA personalizadas
- Transformar digitalmente sus negocios

INSTRUCCIONES ESPECÍFICAS:
1. Genera contenido auténtico y valioso
2. Adáptalo perfectamente a la plataforma $Platform
3. Incluye hashtags relevantes y efectivos
4. Añade una llamada a la acción clara
5. Mantén el tono $Tone
6. No excedas el límite de caracteres
7. Sé creativo pero profesional

Responde SOLO con el contenido generado, sin explicaciones adicionales.
"@
        
        $headers = @{
            "Authorization" = "Bearer $($Config.OpenAIKey)"
            "Content-Type" = "application/json"
        }
        
        $body = @{
            model = "gpt-3.5-turbo"
            messages = @(
                @{
                    role = "system"
                    content = "Eres un experto en marketing de contenidos y redes sociales, especializado en tecnología e inteligencia artificial. Creas contenido atractivo, valioso y profesional para empresas B2B."
                }
                @{
                    role = "user"
                    content = $prompt
                }
            )
            max_tokens = 800
            temperature = 0.7
        } | ConvertTo-Json -Depth 3
        
        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 30
        
        $content = $response.choices[0].message.content.Trim()
        
        # Validar y ajustar contenido
        $content = Optimize-ContentForPlatform -Content $content -Platform $Platform
        
        Write-ContentLog "Contenido OpenAI generado exitosamente ($($content.Length) caracteres)" -Level "SUCCESS"
        return $content
        
    } catch {
        Write-ContentLog "Error con OpenAI: $($_.Exception.Message)" -Level "ERROR"
        return Get-FallbackContent -Platform $Platform -Topic $Topic -ContentType $ContentType -Tone $Tone
    }
}

# Función para optimizar contenido para plataforma
function Optimize-ContentForPlatform {
    param(
        [string]$Content,
        [string]$Platform
    )
    
    $platformConfig = $Config.PlatformConfigs[$Platform]
    
    # Ajustar longitud
    if ($Content.Length -gt $platformConfig.MaxLength) {
        $Content = $Content.Substring(0, $platformConfig.MaxLength - 3) + "..."
    }
    
    # Validar hashtags
    $hashtagCount = ([regex]::Matches($Content, "#\w+").Count)
    if ($hashtagCount -gt $platformConfig.HashtagLimit) {
        $Content = Limit-Hashtags -Content $Content -Limit $platformConfig.HashtagLimit
    }
    
    return $Content
}

# Función para limitar hashtags
function Limit-Hashtags {
    param(
        [string]$Content,
        [int]$Limit
    )
    
    $hashtags = [regex]::Matches($Content, "#\w+")
    if ($hashtags.Count -le $Limit) {
        return $Content
    }
    
    # Mantener los primeros $Limit hashtags
    $keepHashtags = $hashtags | Select-Object -First $Limit
    $removeHashtags = $hashtags | Select-Object -Skip $Limit
    
    $result = $Content
    foreach ($hashtag in $removeHashtags) {
        $result = $result.Replace($hashtag.Value, "").Replace("  ", " ").Trim()
    }
    
    return $result
}

# Función de contenido fallback
function Get-FallbackContent {
    param(
        [string]$Platform,
        [string]$Topic,
        [string]$ContentType,
        [string]$Tone
    )
    
    $platformConfig = $Config.PlatformConfigs[$Platform]
    $hashtags = $platformConfig.BestHashtags | Select-Object -First 3
    $cta = $platformConfig.CallToActions | Get-Random
    
    $templates = @{
        Facebook = @"
🚀 $Topic - Transformación Digital con AIGestion

Descubre cómo la inteligencia artificial está revolucionando el mundo empresarial. En AIGestion.net, lideramos la innovación tecnológica para ayudarte a alcanzar nuevos niveles de eficiencia.

$($hashtags -join " ")

$cta

#TransformacionDigital #InteligenciaArtificial #Innovacion
"@
        
        Twitter = @"
🚀 $Topic | IA Transformando Empresas

Descubre cómo la inteligencia artificial está cambiando las reglas del juego en el mundo empresarial con AIGestion.net.

$($hashtags -join " ")

$cta

#AI #Tecnologia #Innovacion
"@
        
        Instagram = @"
🚀 $Topic

La revolución de la inteligencia artificial ya está aquí. Transforma tu negocio con las soluciones de AIGestion.net.

$($hashtags -join " ")

$cta

#AIGestion #AI #Tecnologia #Innovacion
"@
        
        LinkedIn = @"
🚀 $Topic: El Futuro de la Transformación Digital

En AIGestion.net, estamos liderando la revolución de la inteligencia artificial en el sector empresarial. Descubre cómo nuestras soluciones están ayudando a las empresas a alcanzar nuevos niveles de eficiencia e innovación.

$($hashtags -join " ")

$cta

#AIGestion #TransformacionDigital #InteligenciaArtificial #LiderazgoTecnologico
"@
        
        TikTok = @"
🚀 $Topic en 15 segundos!

La revolución IA ya está aquí. AIGestion.net transformando empresas.

$($hashtags -join " ")

$cta

#AIGestion #AI #Tech #Trending
"@
        
        YouTube = @"
🚀 $Topic - La Revolución IA ha Llegado

Descubre cómo la inteligencia artificial está transformando las empresas en 2024. En AIGestion.net, estamos a la vanguardia de la innovación tecnológica.

$($hashtags -join " ")

$cta

#AIGestion #InteligenciaArtificial #Tecnologia #Educacion
"@
    }
    
    return $templates[$Platform] ?? "🚀 Descubre más en AIGestion.net - Transformación Digital con IA $($hashtags -join " ")"
}

# Función para generar batch de contenido
function New-ContentBatch {
    param(
        [string]$Platform,
        [string]$Topic,
        [int]$Count,
        [string]$ContentType = "post",
        [string]$Tone = "professional"
    )
    
    try {
        Write-ContentLog "Generando batch de $Count posts para $Platform" -Level "INFO"
        
        $batch = @()
        $generatedCount = 0
        $errors = 0
        
        for ($i = 1; $i -le $Count; $i++) {
            try {
                $content = Get-OpenAIContent -Platform $Platform -Topic $Topic -ContentType $ContentType -Tone $Tone
                
                $batch += @{
                    Id = "content_$(Get-Date -Format 'yyyyMMdd-HHmmss')_$i"
                    Platform = $Platform
                    Topic = $Topic
                    ContentType = $ContentType
                    Tone = $Tone
                    Content = $content
                    Length = $content.Length
                    GeneratedAt = Get-Date
                    Status = "generated"
                    Published = $false
                    Metrics = @{}
                }
                
                $generatedCount++
                Write-ContentLog "Contenido $i/$Count generado para $Platform" -Level "DEBUG"
                
                # Pequeña pausa entre generaciones
                Start-Sleep -Milliseconds 500
                
            } catch {
                $errors++
                Write-ContentLog "Error generando contenido $i: $($_.Exception.Message)" -Level "ERROR"
            }
        }
        
        # Guardar batch
        if ($batch.Count -gt 0) {
            $batchPath = "$($Config.OutputPath)batch-$Platform-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
            $batch | ConvertTo-Json -Depth 10 | Out-File -FilePath $batchPath -Encoding UTF8
            Write-ContentLog "Batch guardado en $batchPath" -Level "SUCCESS"
        }
        
        Write-ContentLog "Batch completado: $generatedCount generados, $errors errores" -Level "SUCCESS"
        
        return @{
            Batch = $batch
            GeneratedCount = $generatedCount
            Errors = $errors
            BatchPath = if ($batch.Count -gt 0) { $batchPath } else { $null }
        }
        
    } catch {
        Write-ContentLog "Error en batch generation: $($_.Exception.Message)" -Level "ERROR"
        return @{
            Batch = @()
            GeneratedCount = 0
            Errors = 1
            BatchPath = $null
        }
    }
}

# Función para generar contenido multiplataforma
function New-MultiPlatformContent {
    param(
        [string]$Topic,
        [string]$ContentType = "post",
        [string]$Tone = "professional",
        [string[]]$Platforms = @("Facebook", "Twitter", "Instagram", "LinkedIn")
    )
    
    try {
        Write-ContentLog "Generando contenido multiplataforma para $Topic" -Level "INFO"
        
        $multiContent = @()
        
        foreach ($platform in $Platforms) {
            if ($Config.PlatformConfigs.ContainsKey($platform)) {
                $content = Get-OpenAIContent -Platform $platform -Topic $Topic -ContentType $ContentType -Tone $Tone
                
                $multiContent += @{
                    Platform = $platform
                    Topic = $Topic
                    ContentType = $ContentType
                    Tone = $Tone
                    Content = $content
                    Length = $content.Length
                    GeneratedAt = Get-Date
                    Status = "generated"
                    Published = $false
                    Metrics = @{}
                }
                
                Write-ContentLog "Contenido generado para $platform ($($content.Length) caracteres)" -Level "SUCCESS" -Platform $platform
            }
        }
        
        # Guardar contenido multiplataforma
        if ($multiContent.Count -gt 0) {
            $multiPath = "$($Config.OutputPath)multi-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
            $multiContent | ConvertTo-Json -Depth 10 | Out-File -FilePath $multiPath -Encoding UTF8
            Write-ContentLog "Contenido multiplataforma guardado en $multiPath" -Level "SUCCESS"
        }
        
        return $multiContent
        
    } catch {
        Write-ContentLog "Error en contenido multiplataforma: $($_.Exception.Message)" -Level "ERROR"
        return @()
    }
}

# Función para generar calendario de contenido
function New-ContentCalendar {
    param(
        [int]$Days = 30,
        [string[]]$Platforms = @("Facebook", "Twitter", "Instagram", "LinkedIn")
    )
    
    try {
        Write-ContentLog "Creando calendario de contenido para $Days días" -Level "INFO"
        
        $calendar = @()
        $startDate = Get-Date
        
        for ($i = 0; $i -lt $Days; $i++) {
            $currentDate = $startDate.AddDays($i)
            
            foreach ($platform in $Platforms) {
                # Seleccionar pilar aleatorio
                $pillar = $Config.ContentPillars | Get-Random
                $tone = $Config.Tones | Get-Random
                
                $content = Get-OpenAIContent -Platform $platform -Topic $pillar -ContentType "post" -Tone $tone
                
                $calendar += @{
                    Date = $currentDate
                    Platform = $platform
                    Topic = $pillar
                    ContentType = "post"
                    Tone = $tone
                    Content = $content
                    Status = "scheduled"
                    Published = $false
                    GeneratedAt = Get-Date
                    Metrics = @{}
                }
            }
        }
        
        # Guardar calendario
        $calendarPath = "$($Config.OutputPath)calendar-$(Get-Date -Format 'yyyy-MM-dd').json"
        $calendar | ConvertTo-Json -Depth 10 | Out-File -FilePath $calendarPath -Encoding UTF8
        
        Write-ContentLog "Calendario creado con $($calendar.Count) posts" -Level "SUCCESS"
        
        return $calendar
        
    } catch {
        Write-ContentLog "Error creando calendario: $($_.Exception.Message)" -Level "ERROR"
        return @()
    }
}

# Función para modo interactivo
function Start-InteractiveMode {
    Write-Host "🚀 MODO INTERACTIVO - CONTENT GENERATOR GOD MODE" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    
    Write-Host "`n📊 Plataformas Disponibles:" -ForegroundColor Yellow
    foreach ($platform in $Config.PlatformConfigs.Keys) {
        Write-Host "• $platform" -ForegroundColor White
    }
    
    Write-Host "`n🎯 Pilares de Contenido:" -ForegroundColor Yellow
    foreach ($pillar in $Config.ContentPillars) {
        Write-Host "• $pillar" -ForegroundColor White
    }
    
    Write-Host "`n🎨 Tonos Disponibles:" -ForegroundColor Yellow
    foreach ($tone in $Config.Tones) {
        Write-Host "• $tone" -ForegroundColor White
    }
    
    Write-Host "`n🎪 ¿Qué deseas hacer?" -ForegroundColor Magenta
    Write-Host "1. Generar contenido para una plataforma" -ForegroundColor White
    Write-Host "2. Generar contenido multiplataforma" -ForegroundColor White
    Write-Host "3. Generar batch de contenido" -ForegroundColor White
    Write-Host "4. Crear calendario de contenido" -ForegroundColor White
    Write-Host "5. Ver contenido generado" -ForegroundColor White
    Write-Host "0. Salir" -ForegroundColor White
    
    $choice = Read-Host "`nSelecciona una opción (0-5)"
    
    switch ($choice) {
        "1" {
            $platform = Read-Host "📱 Plataforma"
            $topic = Read-Host "💭 Tema (o presiona Enter para aleatorio)"
            if ([string]::IsNullOrEmpty($topic)) { $topic = $Config.ContentPillars | Get-Random }
            $tone = Read-Host "🎨 Tono (o presiona Enter para professional)"
            if ([string]::IsNullOrEmpty($tone)) { $tone = "professional" }
            
            $content = Get-OpenAIContent -Platform $platform -Topic $topic -Tone $tone
            Write-Host "`n📝 Contenido generado:" -ForegroundColor Green
            Write-Host $content -ForegroundColor White
            Write-Host "`n📊 Longitud: $($content.Length) caracteres" -ForegroundColor Cyan
        }
        
        "2" {
            $topic = Read-Host "💭 Temo (o presiona Enter para aleatorio)"
            if ([string]::IsNullOrEmpty($topic)) { $topic = $Config.ContentPillars | Get-Random }
            $tone = Read-Host "🎨 Tono (o presiona Enter para professional)"
            if ([string]::IsNullOrEmpty($tone)) { $tone = "professional" }
            
            $multiContent = New-MultiPlatformContent -Topic $topic -Tone $tone
            
            Write-Host "`n📝 Contenido Multiplataforma:" -ForegroundColor Green
            foreach ($item in $multiContent) {
                Write-Host "`n📱 $($item.Platform):" -ForegroundColor Cyan
                Write-Host $item.Content -ForegroundColor White
                Write-Host "📊 Longitud: $($item.Length) caracteres" -ForegroundColor Gray
            }
        }
        
        "3" {
            $platform = Read-Host "📱 Plataforma"
            $topic = Read-Host "💭 Tema (o presiona Enter para aleatorio)"
            if ([string]::IsNullOrEmpty($topic)) { $topic = $Config.ContentPillars | Get-Random }
            $count = Read-Host "🔢 Cantidad de posts (por defecto 5)"
            if ([string]::IsNullOrEmpty($count)) { $count = 5 }
            
            $batch = New-ContentBatch -Platform $platform -Topic $topic -Count ([int]$count)
            Write-Host "`n✅ Batch generado: $($batch.GeneratedCount) posts" -ForegroundColor Green
            if ($batch.BatchPath) {
                Write-Host "📁 Guardado en: $($batch.BatchPath)" -ForegroundColor Cyan
            }
        }
        
        "4" {
            $days = Read-Host "📅 Días para calendario (por defecto 30)"
            if ([string]::IsNullOrEmpty($days)) { $days = 30 }
            
            $calendar = New-ContentCalendar -Days ([int]$days)
            Write-Host "✅ Calendario creado con $($calendar.Count) posts" -ForegroundColor Green
        }
        
        "5" {
            Write-Host "📁 Contenido generado:" -ForegroundColor Yellow
            $files = Get-ChildItem -Path $Config.OutputPath -Filter "*.json"
            
            foreach ($file in $files) {
                Write-Host "`n📄 $($file.Name)" -ForegroundColor White
                $content = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json
                Write-Host "   Posts: $($content.Count)" -ForegroundColor Cyan
                Write-Host "   Creado: $($file.LastWriteTime)" -ForegroundColor Gray
            }
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
function Start-ContentGenerator {
    Write-ContentLog "🚀 Iniciando Content Generator God Mode" -Level "INFO"
    
    try {
        if ($Interactive) {
            Start-InteractiveMode
        } elseif ($BatchMode) {
            $batch = New-ContentBatch -Platform $Platform -Topic $Topic -Count $Count
            Write-ContentLog "Batch completado: $($batch.GeneratedCount) posts generados" -Level "SUCCESS"
        } elseif ($Platform -eq "all") {
            $multiContent = New-MultiPlatformContent -Topic $Topic
            Write-ContentLog "Contenido multiplataforma generado: $($multiContent.Count) posts" -Level "SUCCESS"
        } else {
            $content = Get-OpenAIContent -Platform $Platform -Topic $Topic
            Write-ContentLog "Contenido generado para $Platform ($($content.Length) caracteres)" -Level "SUCCESS" -Platform $Platform
            Write-Host $content -ForegroundColor White
        }
    } catch {
        Write-ContentLog "Error en Content Generator: $($_.Exception.Message)" -Level "ERROR"
    }
}

# Ejecución principal
try {
    Start-ContentGenerator
} catch {
    Write-ContentLog "Error fatal: $($_.Exception.Message)" -Level "ERROR"
    exit 1
}
