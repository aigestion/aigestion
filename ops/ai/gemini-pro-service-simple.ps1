# Gemini Pro Service Simple - AIGestion
# Versión simplificada y funcional para PRO

param(
    [string]$Prompt = "",
    [string]$Context = "AIGestion PRO Assistant",
    [switch]$Interactive,
    [switch]$Test
)

# Cargar configuración
$envPath = "c:\Users\Alejandro\AIGestion\.env.gemini"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

# Función principal
function Invoke-GeminiPro {
    param(
        [string]$Prompt,
        [string]$Context
    )
    
    $apiKey = $env:GEMINI_API_KEY
    $model = $env:GEMINI_MODEL
    $maxTokens = $env:GEMINI_MAX_TOKENS
    $temperature = $env:GEMINI_TEMPERATURE
    
    if (-not $apiKey) {
        throw "API Key no configurada"
    }
    
    $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/$($model):generateContent?key=$apiKey"
    
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
            temperature = [double]$temperature
            maxOutputTokens = [int]$maxTokens
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $body -ContentType "application/json" -TimeoutSec 30
        return $response.candidates[0].content.parts[0].text
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Ejecución principal
if ($Interactive) {
    Write-Host "🤖 Gemini 2.5 Flash - Modo Interactivo AIGestion PRO" -ForegroundColor Cyan
    Write-Host "📝 Escribe 'salir' para terminar" -ForegroundColor Yellow
    Write-Host "=" * 60 -ForegroundColor Gray
    
    while ($true) {
        Write-Host "`n🔮 AIGestion PRO>" -ForegroundColor Green -NoNewline
        $input = Read-Host
        
        if ($input.ToLower() -eq "salir") {
            break
        }
        
        Write-Host "🧠 Procesando con Gemini 2.5 Flash..." -ForegroundColor Blue
        $response = Invoke-GeminiPro -Prompt $input -Context $Context
        
        if ($response) {
            Write-Host "`n💎 Respuesta:" -ForegroundColor Cyan
            Write-Host $response -ForegroundColor White
        }
    }
}
elseif ($Test) {
    Write-Host "🧪 Probando Gemini 2.5 Flash..." -ForegroundColor Blue
    $response = Invoke-GeminiPro -Prompt "Responde en español: ¿Qué es AIGestion PRO?" -Context "Test de conexión"
    
    if ($response) {
        Write-Host "✅ Conexión exitosa!" -ForegroundColor Green
        Write-Host "💎 Respuesta: $response" -ForegroundColor Cyan
    }
}
elseif ($Prompt) {
    $response = Invoke-GeminiPro -Prompt $Prompt -Context $Context
    if ($response) {
        Write-Host $response -ForegroundColor White
    }
}
else {
    Write-Host "🚀 Gemini 2.5 Flash Service - AIGestion PRO" -ForegroundColor Green
    Write-Host "📖 Uso:" -ForegroundColor Yellow
    Write-Host "  .\gemini-pro-service-simple.ps1 -Test" -ForegroundColor White
    Write-Host "  .\gemini-pro-service-simple.ps1 -Interactive" -ForegroundColor White
    Write-Host "  .\gemini-pro-service-simple.ps1 -Prompt 'tu pregunta'" -ForegroundColor White
}
