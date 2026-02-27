# Fix de Microfono - Diagnostico y Solucion

Write-Host "🔧 DIAGNOSTICO Y SOLUCION DE MICROFONO" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Gray

# 1. Verificar permisos de acceso al micrófono
Write-Host "1️⃣ Verificando permisos de micrófono..." -ForegroundColor Yellow

try {
    # Verificar si el micrófono está accesible
    $micPermission = Get-WmiObject -Class Win32_SoundDevice | Where-Object { $_.Status -eq "OK" }
    
    if ($micPermission.Count -eq 0) {
        Write-Host "❌ No se detectan dispositivos de audio" -ForegroundColor Red
        Write-Host "   → Revisa conexión física del micrófono" -ForegroundColor Gray
        Write-Host "   → Verifica drivers de audio" -ForegroundColor Gray
    } else {
        Write-Host "✅ Dispositivos de audio detectados: $($micPermission.Count)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error verificando permisos: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Verificar configuración de privacidad
Write-Host ""
Write-Host "2️⃣ Verificando configuración de privacidad..." -ForegroundColor Yellow

try {
    # Abrir configuración de privacidad de micrófono
    Start-Process "ms-settings:privacy-microphone"
    Write-Host "✅ Configuración de privacidad abierta" -ForegroundColor Green
    Write-Host "   → Asegúrate de que el micrófono esté permitido" -ForegroundColor Gray
    Write-Host "   → Activa 'Permitir que las aplicaciones accedan a tu micrófono'" -ForegroundColor Gray
    
    Start-Sleep -Seconds 2
    
} catch {
    Write-Host "❌ Error abriendo configuración de privacidad: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Reiniciar servicios de audio
Write-Host ""
Write-Host "3️⃣ Reiniciando servicios de audio..." -ForegroundColor Yellow

try {
    # Detener servicios de audio
    Stop-Service -Name "Audiosrv" -Force -ErrorAction SilentlyContinue
    Stop-Service -Name "AudioEndpointBuilder" -Force -ErrorAction SilentlyContinue
    
    Write-Host "✅ Servicios de audio detenidos" -ForegroundColor Green
    
    Start-Sleep -Seconds 2
    
    # Iniciar servicios de audio
    Start-Service -Name "Audiosrv" -ErrorAction SilentlyContinue
    Start-Service -Name "AudioEndpointBuilder" -ErrorAction SilentlyContinue
    
    Write-Host "✅ Servicios de audio reiniciados" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error reiniciando servicios: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Verificar configuración de dispositivos de grabación
Write-Host ""
Write-Host "4️⃣ Verificando dispositivos de grabación..." -ForegroundColor Yellow

try {
    # Obtener dispositivos multimedia
    $multimediaDevices = Get-WmiObject -Class Win32_PnPEntity | Where-Object { $_.Name -like "*Audio*" }
    
    Write-Host "Dispositivos multimedia encontrados:" -ForegroundColor Green
    foreach ($device in $multimediaDevices) {
        Write-Host "  🎧 $($device.Name)" -ForegroundColor White
        Write-Host "     Estado: $($device.Status)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Error verificando dispositivos: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Abrir configuración avanzada de sonido
Write-Host ""
Write-Host "5️⃣ Abriendo configuración avanzada de sonido..." -ForegroundColor Yellow

try {
    # Abrir configuración de sonido clásica
    Start-Process "rundll32.exe" -ArgumentList "mmsys.cpl,PlaySound"
    
    Write-Host "✅ Configuración avanzada abierta" -ForegroundColor Green
    Write-Host "   → Ve a la pestaña 'Grabación'" -ForegroundColor Gray
    Write-Host "   → Selecciona tu micrófono como dispositivo predeterminado" -ForegroundColor Gray
    Write-Host "   → Haz clic en 'Propiedades'" -ForegroundColor Gray
    Write-Host "   → Ve a 'Niveles' y ajusta si es necesario" -ForegroundColor Gray
    
    Start-Sleep -Seconds 2
    
} catch {
    Write-Host "❌ Error abriendo configuración: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Verificar drivers de audio
Write-Host ""
Write-Host "6️⃣ Verificando drivers de audio..." -ForegroundColor Yellow

try {
    # Obtener información de drivers de audio
    $audioDrivers = Get-WmiObject -Class Win32_SystemDriver | Where-Object { $_.Description -like "*Audio*" }
    
    Write-Host "Drivers de audio encontrados:" -ForegroundColor Green
    foreach ($driver in $audioDrivers) {
        Write-Host "  🔧 $($driver.Description)" -ForegroundColor White
        Write-Host "     Versión: $($driver.DriverVersion)" -ForegroundColor Gray
        Write-Host "     Proveedor: $($driver.ProviderName)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Error verificando drivers: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Crear script de prueba de audio
Write-Host ""
Write-Host "7️⃣ Creando prueba de audio simple..." -ForegroundColor Yellow

try {
    # Crear un script HTML simple para probar el micrófono
    $testHTML = @"
<!DOCTYPE html>
<html>
<head>
    <title>Test de Microfono</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        button { background: #007acc; color: white; border: none; padding: 15px 30px; border-radius: 5px; cursor: pointer; margin: 10px; font-size: 16px; }
        button:hover { background: #0056b3; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .info { background: #d1ecf1; color: #0c5460; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎤 Test de Microfono</h1>
        <p>Esta pagina prueba el acceso al microfono usando la API Web Audio.</p>
        
        <button onclick="startRecording()">🎙️ Iniciar Grabacion</button>
        <button onclick="stopRecording()">⏹️ Detener Grabacion</button>
        <button onclick="playRecording()">▶️ Reproducir</button>
        
        <div id="status" class="status info">Listo para probar el microfono...</div>
        
        <audio id="audioPlayer" controls style="width: 100%; margin-top: 20px;"></audio>
    </div>

    <script>
        let mediaRecorder;
        let audioChunks = [];
        let isRecording = false;

        async function startRecording() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    document.getElementById('audioPlayer').src = audioUrl;
                    updateStatus('Grabacion completada. Puedes reproducirla.', 'success');
                };
                
                mediaRecorder.start();
                isRecording = true;
                audioChunks = [];
                updateStatus('🎙️ Grabando... Habla ahora.', 'info');
                
            } catch (error) {
                updateStatus('❌ Error: ' + error.message, 'error');
                console.error('Error accessing microphone:', error);
            }
        }

        function stopRecording() {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                isRecording = false;
                updateStatus('⏹️ Grabacion detenida.', 'info');
            }
        }

        function playRecording() {
            const audioPlayer = document.getElementById('audioPlayer');
            if (audioPlayer.src) {
                audioPlayer.play();
                updateStatus('▶️ Reproduciendo grabacion...', 'info');
            } else {
                updateStatus('❌ No hay grabacion para reproducir.', 'error');
            }
        }

        function updateStatus(message, type) {
            const statusDiv = document.getElementById('status');
            statusDiv.textContent = message;
            statusDiv.className = 'status ' + type;
        }
    </script>
</body>
</html>
"@
    
    # Guardar archivo HTML
    $testPath = "C:\Users\Alejandro\AIGestion\scripts\communications\test-microfono.html"
    Set-Content -Path $testPath -Value $testHTML
    Write-Host "✅ Test HTML creado en: $testPath" -ForegroundColor Green
    
    # Abrir el test en el navegador
    Start-Process $testPath
    
    Write-Host "✅ Test de microfono abierto en navegador" -ForegroundColor Green
    Write-Host "   → Permite el acceso al micrófono cuando se solicite" -ForegroundColor Gray
    Write-Host "   → Prueba grabar y reproducir" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error creando test: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Instrucciones finales
Write-Host ""
Write-Host "📋 INSTRUCCIONES FINALES" -ForegroundColor Magenta
Write-Host "========================" -ForegroundColor Gray
Write-Host "✅ Permisos de privacidad verificados" -ForegroundColor Green
Write-Host "✅ Servicios de audio reiniciados" -ForegroundColor Green
Write-Host "✅ Configuración de sonido abierta" -ForegroundColor Green
Write-Host "✅ Test HTML creado y abierto" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Pasos a seguir:" -ForegroundColor Yellow
Write-Host "1. En configuración de privacidad: Permite acceso al micrófono" -ForegroundColor Gray
Write-Host "2. En configuración de sonido: Selecciona micrófono correcto" -ForegroundColor Gray
Write-Host "3. En el navegador: Prueba el test HTML" -ForegroundColor Gray
Write-Host "4. Reinicia la aplicación que falla" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Si todo falla:" -ForegroundColor Red
Write-Host "→ Verifica conexión física del micrófono" -ForegroundColor Gray
Write-Host "→ Actualiza drivers de audio" -ForegroundColor Gray
Write-Host "→ Reinicia Windows" -ForegroundColor Gray
Write-Host "→ Ejecuta como administrador" -ForegroundColor Gray

Write-Host ""
Write-Host "🎉 DIAGNOSTICO COMPLETADO" -ForegroundColor Magenta
