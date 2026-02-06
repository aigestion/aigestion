# AIGestion Gemini Pro Integration Script
# Integración completa de Gemini Pro en el ecosistema AIGestion

param(
    [switch]$Setup,
    [switch]$Test,
    [switch]$UpdateScripts,
    [switch]$Interactive,
    [string]$Prompt = "",
    [switch]$AnalyzeSystem
)

# Función de configuración inicial
function Initialize-GeminiIntegration {
    Write-Host "🚀 Inicializando Gemini Pro para AIGestion..." -ForegroundColor Cyan
    
    # Verificar archivo de configuración
    $configPath = "c:\Users\Alejandro\AIGestion\.env.gemini"
    
    if (-not (Test-Path $configPath)) {
        Write-Host "❌ Archivo .env.gemini no encontrado" -ForegroundColor Red
        Write-Host "📝 Por favor configura tu API key en el archivo" -ForegroundColor Yellow
        return $false
    }
    
    # Cargar configuración
    . .\gemini-pro-service.ps1
    Write-Host "✅ Servicio Gemini Pro cargado" -ForegroundColor Green
    
    # Verificar API key
    $apiKey = $env:GEMINI_API_KEY
    if (-not $apiKey -or $apiKey -eq "your_new_gemini_api_key_here") {
        Write-Host "❌ API Key no configurada correctamente" -ForegroundColor Red
        Write-Host "📝 Edita .env.gemini y añade tu API key real" -ForegroundColor Yellow
        return $false
    }
    
    Write-Host "✅ Gemini Pro configurado correctamente" -ForegroundColor Green
    return $true
}

# Función de prueba
function Test-GeminiIntegration {
    Write-Host "🧪 Probando integración con Gemini Pro..." -ForegroundColor Yellow
    
    $testPrompt = "Responde en español: ¿Qué es AIGestion.net en una frase?"
    
    try {
        $response = Invoke-GeminiPro -Prompt $testPrompt -Context "Test de integración" -Model "gemini-1.5-pro"
        
        if ($response) {
            Write-Host "✅ Test exitoso!" -ForegroundColor Green
            Write-Host "💎 Respuesta de prueba:" -ForegroundColor Cyan
            Write-Host $response -ForegroundColor White
            return $true
        } else {
            Write-Host "❌ No se obtuvo respuesta del API" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Error en test: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Actualizar scripts existentes
function Update-ExistingScripts {
    Write-Host "🔄 Actualizando scripts existentes con Gemini Pro..." -ForegroundColor Yellow
    
    $scriptsToUpdate = @(
        "social-media\AIGestion-SocialMedia-GodMode.ps1",
        "email\Email-AI-Triage.ps1", 
        "client\AIGestion-Client-Onboarding-GodMode.ps1"
    )
    
    foreach ($script in $scriptsToUpdate) {
        $scriptPath = "c:\Users\Alejandro\AIGestion\scripts\$script"
        
        if (Test-Path $scriptPath) {
            Write-Host "📝 Actualizando: $script" -ForegroundColor Blue
            
            # Añadir referencia a Gemini Pro
            $content = Get-Content $scriptPath -Raw
            
            # Reemplazar OpenAI con Gemini donde corresponda
            $updatedContent = $content -replace 'OpenAI', 'Gemini Pro'
            $updatedContent = $updatedContent -replace 'gpt-3.5-turbo', 'gemini-1.5-pro'
            
            # Añadir configuración de Gemini si no existe
            if ($updatedContent -notmatch "gemini-pro-service") {
                $updatedContent = $updatedContent -replace "# Importar servicios", "# Importar servicios`n. .\ai\gemini-pro-service.ps1"
            }
            
            Set-Content -Path $scriptPath -Value $updatedContent -Force
            Write-Host "✅ Actualizado: $script" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Script no encontrado: $scriptPath" -ForegroundColor Yellow
        }
    }
}

# Análisis del sistema AIGestion
function Start-SystemAnalysis {
    Write-Host "🔍 Analizando sistema AIGestion con Gemini Pro..." -ForegroundColor Cyan
    
    $analysisPrompt = @"
Analiza el ecosistema AIGestion.net y proporciona:

1. **Estado actual de componentes**:
   - Frontend (React, TypeScript, Vite)
   - Dashboards (Admin, Client, Demo)
   - Scripts PowerShell de automatización
   - Integraciones con APIs externas

2. **Oportunidades de mejora con Gemini Pro**:
   - ¿Dónde puede reemplazar OpenAI?
   - ¿Qué nuevas funcionalidades puede habilitar?
   - ¿Cómo optimizar los procesos actuales?

3. **Recomendaciones de implementación**:
   - Prioridades de migración
   - Configuraciones recomendadas
   - Posibles riesgos y mitigaciones

4. **Innovaciones posibles**:
   - Nuevas características con Gemini Pro
   - Mejoras en experiencia de usuario
   - Optimización de rendimiento

Basado en la arquitectura actual de AIGestion.net.
"@
    
    try {
        Write-Host "🧠 Procesando análisis con Gemini Pro..." -ForegroundColor Blue
        $response = Invoke-GeminiPro -Prompt $analysisPrompt -Context "Análisis estratégico AIGestion" -Model "gemini-1.5-pro" -MaxTokens 4096
        
        if ($response) {
            Write-Host "`n📊 Análisis estratégico del sistema:" -ForegroundColor Cyan
            Write-Host "=" * 60 -ForegroundColor Gray
            Write-Host $response -ForegroundColor White
            Write-Host "=" * 60 -ForegroundColor Gray
            
            # Guardar análisis en archivo
            $timestamp = Get-Date -Format "yyyy-MM-dd-HH-mm-ss"
            $analysisFile = "c:\Users\Alejandro\AIGestion\logs\gemini-analysis-$timestamp.txt"
            
            # Crear directorio si no existe
            $logDir = Split-Path $analysisFile -Parent
            if (-not (Test-Path $logDir)) {
                New-Item -ItemType Directory -Path $logDir -Force | Out-Null
            }
            
            Set-Content -Path $analysisFile -Value $response -Force
            Write-Host "`n💾 Análisis guardado en: $analysisFile" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "❌ Error en análisis: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Modo interactivo especializado para AIGestion
function Start-AIGestionInteractive {
    Write-Host "🚀 Gemini Pro - Modo Interactivo AIGestion" -ForegroundColor Cyan
    Write-Host "🎯 Especializado en gestión y automatización de IA" -ForegroundColor Yellow
    Write-Host "📝 Escribe 'ayuda' para comandos disponibles" -ForegroundColor Yellow
    Write-Host "📝 Escribe 'salir' para terminar" -ForegroundColor Yellow
    Write-Host "=" * 60 -ForegroundColor Gray
    
    while ($true) {
        Write-Host "`n🤖 AIGestion>" -ForegroundColor Green -NoNewline
        $input = Read-Host
        
        if ($input.ToLower() -eq "salir") {
            Write-Host "👋 Saliendo de AIGestion Gemini Pro..." -ForegroundColor Yellow
            break
        }
        
        if ($input.ToLower() -eq "ayuda") {
            Write-Host "`n📚 Comandos disponibles:" -ForegroundColor Cyan
            Write-Host "  analizar <componente> - Analiza un componente específico" -ForegroundColor White
            Write-Host "  optimizar <script>   - Optimiza un script PowerShell" -ForegroundColor White
            Write-Host "  ideas <área>        - Genera ideas innovadoras" -ForegroundColor White
            Write-Host "  código <descripción> - Genera código TypeScript/React" -ForegroundColor White
            Write-Host "  diagnosticar         - Diagnostica problemas del sistema" -ForegroundColor White
            Write-Host "  estrategia          - Proporciona estrategia técnica" -ForegroundColor White
            continue
        }
        
        # Procesar comandos especializados
        if ($input -match "^analizar\s+(.+)") {
            $component = $matches[1]
            $prompt = "Analiza el componente '$component' de AIGestion.net: arquitectura, mejoras, problemas y optimización."
        }
        elseif ($input -match "^optimizar\s+(.+)") {
            $script = $matches[1]
            $prompt = "Optimiza este script de AIGestion '$script': rendimiento, mejores prácticas, seguridad y automatización."
        }
        elseif ($input -match "^ideas\s+(.+)") {
            $area = $matches[1]
            $prompt = "Genera 5 ideas innovadoras para '$area' en AIGestion.net con viabilidad técnica y potencial impacto."
        }
        elseif ($input -match "^código\s+(.+)") {
            $desc = $matches[1]
            $prompt = "Genera código TypeScript/React para AIGestion: $desc. Incluye imports, tipos y mejores prácticas."
        }
        elseif ($input -eq "diagnosticar") {
            $prompt = "Diagnostica posibles problemas en el ecosistema AIGestion.net: frontend, backend, APIs, rendimiento y seguridad."
        }
        elseif ($input -eq "estrategia") {
            $prompt = "Proporciona estrategia técnica para AIGestion.net: roadmap, prioridades, tecnologías y arquitectura futura."
        }
        else {
            $prompt = $input
        }
        
        try {
            Write-Host "🧠 Procesando con Gemini Pro..." -ForegroundColor Blue
            $response = Invoke-GeminiPro -Prompt $prompt -Context "Asistente especializado AIGestion" -Model "gemini-1.5-pro"
            
            if ($response) {
                Write-Host "`n💎 Respuesta de Gemini Pro:" -ForegroundColor Cyan
                Write-Host $response -ForegroundColor White
            }
        }
        catch {
            Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Ejecutar según parámetros
if ($Setup) {
    Initialize-GeminiIntegration
}
elseif ($Test) {
    if (Initialize-GeminiIntegration) {
        Test-GeminiIntegration
    }
}
elseif ($UpdateScripts) {
    Update-ExistingScripts
}
elseif ($AnalyzeSystem) {
    if (Initialize-GeminiIntegration) {
        Start-SystemAnalysis
    }
}
elseif ($Interactive) {
    if (Initialize-GeminiIntegration) {
        Start-AIGestionInteractive
    }
}
elseif ($Prompt) {
    if (Initialize-GeminiIntegration) {
        Write-Host "🤖 Enviando a Gemini Pro..." -ForegroundColor Blue
        $response = Invoke-GeminiPro -Prompt $Prompt -Context "Consulta AIGestion" -Model "gemini-1.5-pro"
        
        if ($response) {
            Write-Host "`n💎 Respuesta:" -ForegroundColor Cyan
            Write-Host $response -ForegroundColor White
        }
    }
}
else {
    Write-Host "🚀 AIGestion Gemini Pro Integration" -ForegroundColor Green
    Write-Host "📖 Uso:" -ForegroundColor Yellow
    Write-Host "  .\AIGestion-Gemini-Integration.ps1 -Setup           # Configurar inicialmente" -ForegroundColor White
    Write-Host "  .\AIGestion-Gemini-Integration.ps1 -Test            # Probar conexión" -ForegroundColor White
    Write-Host "  .\AIGestion-Gemini-Integration.ps1 -Interactive     # Modo interactivo" -ForegroundColor White
    Write-Host "  .\AIGestion-Gemini-Integration.ps1 -AnalyzeSystem   # Analizar sistema" -ForegroundColor White
    Write-Host "  .\AIGestion-Gemini-Integration.ps1 -UpdateScripts   # Actualizar scripts" -ForegroundColor White
    Write-Host "  .\AIGestion-Gemini-Integration.ps1 -Prompt 'texto'  # Consulta directa" -ForegroundColor White
}
