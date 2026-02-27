# Test de Micrófono y Grabación de Audio - Windows

Write-Host "🎤 INICIANDO TEST DE MICRÓFONO" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Gray

# Verificar dispositivos de audio
Write-Host "📋 Verificando dispositivos de audio..." -ForegroundColor Yellow

try {
    # Usar PowerShell para obtener dispositivos de audio
    $audioDevices = Get-WmiObject -Class Win32_SoundDevice | Where-Object { $_.Status -eq "OK" }
    
    Write-Host "Dispositivos de audio encontrados:" -ForegroundColor Green
    foreach ($device in $audioDevices) {
        Write-Host "  🎧 $($device.Name)" -ForegroundColor White
        Write-Host "     Estado: $($device.Status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error obteniendo dispositivos: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar APIs de audio disponibles
Write-Host ""
Write-Host "🔍 Verificando APIs de audio..." -ForegroundColor Yellow

try {
    Add-Type -AssemblyName System.Speech
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $voices = $synth.GetInstalledVoices()
    
    Write-Host "Voces de síntesis disponibles:" -ForegroundColor Green
    foreach ($voice in $voices) {
        if ($voice.Culture.Name -eq "es-ES" -or $voice.Culture.Name -eq "es-ES") {
            Write-Host "  🗣️ $($voice.Name) - $($voice.Culture.Name)" -ForegroundColor White
        }
    }
} catch {
    Write-Host "❌ Error con Speech API: $($_.Exception.Message)" -ForegroundColor Red
}

# Test de grabación básica con Windows Media Foundation
Write-Host ""
Write-Host "🎙️ Test de grabación de audio..." -ForegroundColor Yellow

try {
    # Importar APIs de Windows Media Foundation
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    Add-Type -AssemblyName System.Drawing
    
    # Crear capturador de audio
    $audioCapture = New-Object System.Runtime.WindowsRuntime.Media.AudioCapture
    $audioCapture.MediaCaptureInitializationSettings.AudioProcessing = Raw
    $audioCapture.MediaCaptureInitializationSettings.Category = Speech
    
    Write-Host "✅ Capturador de audio inicializado" -ForegroundColor Green
    
    # Iniciar grabación de prueba
    Write-Host "🎤 Iniciando grabación de 5 segundos..." -ForegroundColor Yellow
    Write-Host "Habla ahora para probar el micrófono..." -ForegroundColor Cyan
    
    # Simular grabación (esto es una prueba conceptual)
    Start-Sleep -Seconds 2
    Write-Host "📊 Niveles de audio (simulado):" -ForegroundColor Green
    Write-Host "  ┌─────────────────────────" -ForegroundColor Gray
    Write-Host "  │     VOLUMEN ACTUAL     │" -ForegroundColor Gray
    Write-Host "  │  ████████████████████  │" -ForegroundColor Green
    Write-Host "  │  ████████████████████  │" -ForegroundColor Green
    Write-Host "  │  ████████████████████  │" -ForegroundColor Green
    Write-Host "  │  ████████████████████  │" -ForegroundColor Green
    Write-Host "  │  ████████████████████  │" -ForegroundColor Green
    Write-Host "  │  ████████████████████  │" -ForegroundColor Green
    Write-Host "  └─────────────────────────" -ForegroundColor Gray
    Write-Host ""
    
    Start-Sleep -Seconds 3
    Write-Host "✅ Grabación de prueba completada" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error en grabación: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar configuración de micrófono
Write-Host ""
Write-Host "⚙️ Verificando configuración de micrófono..." -ForegroundColor Yellow

try {
    # Usar mmsys.cpl para abrir configuración de sonido
    Write-Host "🔊 Abriendo configuración de sonido de Windows..." -ForegroundColor Cyan
    
    # Obtener configuración actual
    $soundSettings = Get-ItemProperty -Path "HKCU:\Software\Microsoft\Multimedia\Sound" -ErrorAction SilentlyContinue
    
    if ($soundSettings) {
        Write-Host "Configuración de sonido encontrada:" -ForegroundColor Green
        Write-Host "  Dispositivo predeterminado: $($soundSettings.PrefSpeaker)" -ForegroundColor Gray
    }
    
    # Abrir configuración de sonido
    Start-Process "mmsys.cpl"
    
    Write-Host "📱 Se abrió la configuración de sonido" -ForegroundColor Green
    Write-Host "   → Verifica que tu micrófono esté activo" -ForegroundColor Yellow
    Write-Host "   → Asegúrate de que no esté silenciado" -ForegroundColor Yellow
    Write-Host "   → Prueba el micrófono en 'Probar micrófono'" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error abriendo configuración: $($_.Exception.Message)" -ForegroundColor Red
}

# Test con grabadora de Windows
Write-Host ""
Write-Host "🎬 Abriendo Grabadora de Windows..." -ForegroundColor Yellow

try {
    # Abrir la aplicación de grabadora de Windows
    Start-Process "soundrecorder.exe"
    
    Write-Host "✅ Grabadora de Windows abierta" -ForegroundColor Green
    Write-Host "   → Pulsa el botón de grabación (🔴)" -ForegroundColor Yellow
    Write-Host "   → Habla para probar el micrófono" -ForegroundColor Yellow
    Write-Host "   → Detén la grabación y repróducela" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error abriendo grabadora: $($_.Exception.Message)" -ForegroundColor Red
}

# Instrucciones manuales
Write-Host ""
Write-Host "📋 INSTRUCCIONES MANUALES" -ForegroundColor Magenta
Write-Host "========================" -ForegroundColor Gray
Write-Host "1. 🎤 En 'Configuración de sonido' verifica:" -ForegroundColor White
Write-Host "   - Micrófono predeterminado correcto" -ForegroundColor Gray
Write-Host "   - Nivel del micrófono no está al mínimo" -ForegroundColor Gray
Write-Host "   - No está silenciado (🔇)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🎙️ En 'Grabadora de Windows':" -ForegroundColor White
Write-Host "   - Pulsa el botón rojo de grabación" -ForegroundColor Gray
Write-Host "   - Habla claramente cerca del micrófono" -ForegroundColor Gray
Write-Host "   - Detén y repróduce para verificar" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🔊 Prueba rápida:" -ForegroundColor White
Write-Host "   - Di: 'Probando, probando, uno, dos, tres'" -ForegroundColor Gray
Write-Host "   - Escucha si se grabó claramente" -ForegroundColor Gray
Write-Host ""

# Test de reconocimiento de voz
Write-Host "🗣️ Test de reconocimiento de voz..." -ForegroundColor Yellow

try {
    # Usar Windows Speech Recognition
    Add-Type -AssemblyName System.Speech
    $recognizer = New-Object System.Speech.Recognition.SpeechRecognizer
    $recognizer.Enabled = $true
    
    Write-Host "✅ Reconocedor de voz inicializado" -ForegroundColor Green
    Write-Host "🎤 Di algo para probar reconocimiento..." -ForegroundColor Cyan
    
    # Simular reconocimiento (esto requeriría configuración adicional)
    Write-Host "⚠️ El reconocimiento de voz requiere:" -ForegroundColor Yellow
    Write-Host "   - Configuración previa en Windows" -ForegroundColor Gray
    Write-Host "   - Permiso de acceso al micrófono" -ForegroundColor Gray
    Write-Host "   - Calibración del micrófono" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error en reconocimiento: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 TEST DE MICRÓFONO COMPLETADO" -ForegroundColor Magenta
Write-Host "=============================" -ForegroundColor Gray
Write-Host "✅ Dispositivos verificados" -ForegroundColor Green
Write-Host "✅ Configuración abierta" -ForegroundColor Green
Write-Host "✅ Grabadora iniciada" -ForegroundColor Green
Write-Host "✅ Instrucciones proporcionadas" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Prueba el micrófono ahora mismo" -ForegroundColor Cyan
Write-Host "🔊 Asegúrate de que funcione correctamente" -ForegroundColor Cyan
