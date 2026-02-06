# Gemini Pro Service for AIGestion
# Servicio avanzado de IA con Google Gemini Pro

param(
    [string]$Prompt = "",
    [string]$Context = "AIGestion AI Assistant",
    [string]$Model = "gemini-1.5-pro",
    [double]$Temperature = 0.7,
    [int]$MaxTokens = 2048,
    [string]$OutputFormat = "json",
    [switch]$Interactive,
    [switch]$Analyze,
    [string]$FilePath = ""
)

# Cargar configuración segura
function Load-GeminiConfig {
    $envPath = "c:\Users\Alejandro\AIGestion\.env.gemini"
    
    if (Test-Path $envPath) {
        Get-Content $envPath | ForEach-Object {
            if ($_ -match '^([^=]+)=(.*)$') {
                [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }
        return $true
    } else {
        Write-Host "❌ Archivo de configuración .env.gemini no encontrado" -ForegroundColor Red
        Write-Host "📝 Por favor crea el archivo con tu API key de Gemini Pro" -ForegroundColor Yellow
        return $false
    }
}

# Función principal de Gemini Pro
function Invoke-GeminiPro {
    param(
        [string]$Prompt,
        [string]$Context,
        [string]$Model,
        [double]$Temperature,
        [int]$MaxTokens,
        [string]$OutputFormat
    )
    
    $apiKey = $env:GEMINI_API_KEY
    if (-not $apiKey -or $apiKey -eq "your_new_gemini_api_key_here") {
        throw "❌ API Key de Gemini Pro no configurada. Por favor edita .env.gemini"
    }
    
    $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/$($Model):generateContent?key=$apiKey"
    
    $body = @{
        contents = @(
            @{
                parts = @(
                    @{
                        text = "$Context`n`n$Prompt"
                    }
                )
            }
        )
        generationConfig = @{
            temperature = $Temperature
            maxOutputTokens = $MaxTokens
            topP = $env:GEMINI_TOP_P
            topK = $env:GEMINI_TOP_K
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $body -ContentType "application/json" -TimeoutSec 30
        return $response.candidates[0].content.parts[0].text
    }
    catch {
        Write-Host "❌ Error en API de Gemini Pro: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Modo interactivo
function Start-GeminiInteractive {
    Write-Host "🤖 Gemini Pro - Modo Interactivo AIGestion" -ForegroundColor Cyan
    Write-Host "📝 Escribe 'salir' para terminar" -ForegroundColor Yellow
    Write-Host "=" * 50 -ForegroundColor Gray
    
    while ($true) {
        Write-Host "`n🔮 Escribe tu pregunta o comando:" -ForegroundColor Green -NoNewline
        $input = Read-Host
        
        if ($input.ToLower() -eq "salir") {
            Write-Host "👋 Saliendo de Gemini Pro..." -ForegroundColor Yellow
            break
        }
        
        Write-Host "🧠 Procesando con Gemini Pro..." -ForegroundColor Blue
        $response = Invoke-GeminiPro -Prompt $input -Context $Context -Model $Model -Temperature $Temperature -MaxTokens $MaxTokens
        
        if ($response) {
            Write-Host "`n💎 Respuesta de Gemini Pro:" -ForegroundColor Cyan
            Write-Host $response -ForegroundColor White
        }
    }
}

# Análisis de archivos
function Start-FileAnalysis {
    if (-not $FilePath -or -not (Test-Path $FilePath)) {
        Write-Host "❌ Archivo no válido: $FilePath" -ForegroundColor Red
        return
    }
    
    Write-Host "📄 Analizando archivo: $FilePath" -ForegroundColor Yellow
    $content = Get-Content $FilePath -Raw
    
    $analysisPrompt = @"
Analiza este archivo de AIGestion y proporciona:
1. Resumen del contenido
2. Posibles mejoras
3. Identificación de errores
4. Sugerencias de optimización

Archivo:
$content
"@
    
    $response = Invoke-GeminiPro -Prompt $analysisPrompt -Context "Análisis de código AIGestion" -Model $Model
    
    if ($response) {
        Write-Host "`n📊 Análisis del archivo:" -ForegroundColor Cyan
        Write-Host $response -ForegroundColor White
    }
}

# Ejecutar según parámetros
if (Load-GeminiConfig) {
    if ($Interactive) {
        Start-GeminiInteractive
    }
    elseif ($Analyze -and $FilePath) {
        Start-FileAnalysis
    }
    elseif ($Prompt) {
        Write-Host "🤖 Enviando a Gemini Pro..." -ForegroundColor Blue
        $response = Invoke-GeminiPro -Prompt $Prompt -Context $Context -Model $Model -Temperature $Temperature -MaxTokens $MaxTokens
        
        if ($response) {
            Write-Host "`n💎 Respuesta:" -ForegroundColor Cyan
            Write-Host $response -ForegroundColor White
        }
    }
    else {
        Write-Host "🚀 Gemini Pro Service para AIGestion" -ForegroundColor Green
        Write-Host "📖 Uso:" -ForegroundColor Yellow
        Write-Host "  .\gemini-pro-service.ps1 -Prompt 'tu pregunta'" -ForegroundColor White
        Write-Host "  .\gemini-pro-service.ps1 -Interactive" -ForegroundColor White
        Write-Host "  .\gemini-pro-service.ps1 -Analyze -FilePath 'archivo.txt'" -ForegroundColor White
    }
}
