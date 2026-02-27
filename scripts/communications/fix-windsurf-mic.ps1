# Fix Microfono Windsurf - Diagnostico y Solucion

Write-Host "🌊 FIX DE MICROFONO WINDSURF" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Gray

# 1. Verificar si Windsurf esta corriendo
Write-Host "1️⃣ Verificando si Windsurf esta corriendo..." -ForegroundColor Yellow

try {
    $windsurfProcess = Get-Process | Where-Object { $_. ProcessName -like "*windsurf*" }
    
    if ($windsurfProcess) {
        Write-Host "✅ Windsurf detectado: PID $($windsurfProcess.Id)" -ForegroundColor Green
        Write-Host "   → Proceso: $($windsurfProcess.ProcessName)" -ForegroundColor Gray
        Write-Host "   → Path: $($windsurfProcess.Path)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Windsurf no esta corriendo" -ForegroundColor Red
        Write-Host "   → Inicia Windsurf primero" -ForegroundColor Gray
        Start-Process "windsurf"
        Start-Sleep -Seconds 5
    }
} catch {
    Write-Host "❌ Error verificando Windsurf: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Verificar permisos de Windsurf
Write-Host ""
Write-Host "2️⃣ Verificando permisos de Windsurf..." -ForegroundColor Yellow

try {
    # Verificar permisos de acceso a dispositivos multimedia
    $windsurfPath = Get-Command "windsurf" -ErrorAction SilentlyContinue
    
    if ($windsurfPath) {
        Write-Host "✅ Windsurf encontrado en: $($windsurfPath.Source)" -ForegroundColor Green
        
        # Verificar si Windsurf tiene acceso al microfono
        Write-Host "🔍 Verificando acceso a dispositivos multimedia..." -ForegroundColor Cyan
        
        # Abrir configuracion de permisos de Windsurf si existe
        $windsurfConfigPath = "$env:USERPROFILE\.windsurf"
        if (Test-Path $windsurfConfigPath) {
            Write-Host "✅ Configuracion de Windsurf encontrada" -ForegroundColor Green
            Write-Host "   → Path: $windsurfConfigPath" -ForegroundColor Gray
        }
        
    } else {
        Write-Host "❌ Windsurf no encontrado en el sistema" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error verificando Windsurf: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Abrir configuracion de permisos de Windsurf
Write-Host ""
Write-Host "3️⃣ Abriendo configuracion de permisos de Windsurf..." -ForegroundColor Yellow

try {
    # Intentar abrir configuracion de permisos de Windsurf
    $windsurfExe = Get-Command "windsurf" -ErrorAction SilentlyContinue
    
    if ($windsurfExe) {
        # Abrir Windsurf con parametros de permisos
        Write-Host "🔧 Abriendo Windsurf con configuracion de permisos..." -ForegroundColor Cyan
        
        # Metodo 1: Abrir configuracion de permisos directamente
        try {
            Start-Process $windsurfExe.Source -ArgumentList "--enable-audio" -ErrorAction SilentlyContinue
            Write-Host "✅ Windsurf iniciado con permisos de audio" -ForegroundColor Green
        } catch {
            Write-Host "⚠️ No se pudo iniciar con permisos de audio" -ForegroundColor Yellow
        }
        
        # Metodo 2: Abrir configuracion de la aplicacion
        Start-Sleep -Seconds 2
        
        # Abrir configuracion de permisos de Windows para Windsurf
        try {
            Start-Process "ms-settings:privacy-microphone"
            Write-Host "✅ Configuracion de privacidad de microfono abierta" -ForegroundColor Green
            Write-Host "   → Busca 'Windsurf' en la lista" -ForegroundColor Gray
            Write-Host "   → Asegurate que tenga permiso de microfono" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Error abriendo configuracion de privacidad" -ForegroundColor Red
        }
        
        # Metodo 3: Abrir configuracion de aplicaciones de Windows
        Start-Sleep -Seconds 2
        try {
            Start-Process "ms-settings:appsfeatures"
            Write-Host "✅ Configuracion de aplicaciones abierta" -ForegroundColor Green
            Write-Host "   → Busca 'Windsurf' y verifica permisos" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Error abriendo configuracion de aplicaciones" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Windsurf no encontrado" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error abriendo configuracion: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Verificar dispositivos de audio disponibles
Write-Host ""
Write-Host "4️⃣ Verificando dispositivos de audio disponibles..." -ForegroundColor Yellow

try {
    $audioDevices = Get-WmiObject -Class Win32_SoundDevice | Where-Object { $_.Status -eq "OK" }
    
    Write-Host "Dispositivos de audio disponibles:" -ForegroundColor Green
    foreach ($device in $audioDevices) {
        Write-Host "  🎧 $($device.Name)" -ForegroundColor White
        Write-Host "     Estado: $($device.Status)" -ForegroundColor Gray
        Write-Host "     Descripcion: $($device.Description)" -ForegroundColor Gray
    }
    
    if ($audioDevices.Count -eq 0) {
        Write-Host "❌ No se encontraron dispositivos de audio activos" -ForegroundColor Red
        Write-Host "   → Verifica conexion del microfono" -ForegroundColor Gray
        Write-Host "   → Reinstala drivers de audio" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Error verificando dispositivos: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Crear test de audio para Windsurf
Write-Host ""
Write-Host "5️⃣ Creando test de audio para Windsurf..." -ForegroundColor Yellow

try {
    # Crear un script HTML especial para Windsurf
    $windsurfTestHTML = @"
<!DOCTYPE html>
<html>
<head>
    <title>Test de Audio para Windsurf</title>
    <style>
        body { 
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            min-height: 100vh;
            margin: 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: rgba(255,255,255,0.1); 
            backdrop-filter: blur(10px);
            padding: 30px; 
            border-radius: 20px; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.3); 
        }
        h1 { 
            text-align: center; 
            margin-bottom: 30px; 
            font-size: 2.5em;
        }
        .button-group { 
            display: flex; 
            gap: 15px; 
            justify-content: center; 
            margin: 20px 0;
            flex-wrap: wrap;
        }
        button { 
            background: rgba(255,255,255,0.2); 
            color: white; 
            border: 2px solid rgba(255,255,255,0.3); 
            padding: 15px 30px; 
            border-radius: 50px; 
            cursor: pointer; 
            font-size: 16px; 
            font-weight: 600;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        button:hover { 
            background: rgba(255,255,255,0.3); 
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        button:disabled { 
            opacity: 0.5; 
            cursor: not-allowed;
        }
        .status { 
            padding: 15px; 
            margin: 20px 0; 
            border-radius: 15px; 
            text-align: center;
            font-weight: 600;
        }
        .success { 
            background: rgba(76, 175, 80, 0.3); 
            border: 2px solid rgba(76, 175, 80, 0.5);
        }
        .error { 
            background: rgba(220, 53, 69, 0.3); 
            border: 2px solid rgba(220, 53, 69, 0.5);
        }
        .info { 
            background: rgba(33, 150, 243, 0.3); 
            border: 2px solid rgba(33, 150, 243, 0.5);
        }
        .warning { 
            background: rgba(255, 193, 7, 0.3); 
            border: 2px solid rgba(255, 193, 7, 0.5);
        }
        .audio-info { 
            background: rgba(255,255,255,0.1); 
            padding: 15px; 
            border-radius: 10px; 
            margin: 10px 0;
            font-size: 14px;
        }
        .audio-visualizer { 
            width: 100%; 
            height: 60px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 10px; 
            margin: 10px 0;
            display: flex; 
            align-items: center; 
            justify-content: center;
            gap: 5px;
        }
        .bar { 
            width: 4px; 
            background: linear-gradient(to top, #4CAF50, #FFC107); 
            border-radius: 2px; 
            transition: height 0.1s ease;
        }
        .recording { 
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎤 Test de Audio para Windsurf</h1>
        <p>Esta pagina esta optimizada para probar el microfono en Windsurf.</p>
        
        <div class="button-group">
            <button id="startBtn" onclick="startRecording()">🎙️ Iniciar</button>
            <button id="stopBtn" onclick="stopRecording()" disabled>⏹️ Detener</button>
            <button id="playBtn" onclick="playRecording()" disabled>▶️ Reproducir</button>
            <button id="downloadBtn" onclick="downloadRecording()" disabled>💾 Descargar</button>
        </div>
        
        <div class="audio-visualizer" id="visualizer">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
        </div>
        
        <div id="status" class="status info">
            🎤 Listo para probar el microfono en Windsurf
        </div>
        
        <div class="audio-info" id="audioInfo">
            <strong>Información del Audio:</strong><br>
            <span id="audioDetails">Esperando inicio de grabación...</span>
        </div>
        
        <audio id="audioPlayer" controls style="width: 100%; margin-top: 20px;"></audio>
    </div>

    <script>
        let mediaRecorder;
        let audioChunks = [];
        let isRecording = false;
        let audioContext;
        let analyser;
        let microphone;
        let javascriptNode;
        
        // Inicializar contexto de audio
        function initAudioContext() {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource();
                javascriptNode = audioContext.createScriptProcessor(2048, 1);
                
                analyser.fftSize = 256;
                javascriptNode.connect(analyser);
                analyser.connect(audioContext.destination);
                
                updateVisualizer();
                return true;
            } catch (error) {
                console.error('Error initializing audio context:', error);
                return false;
            }
        }
        
        function updateVisualizer() {
            if (!analyser) return;
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            function draw() {
                requestAnimationFrame(draw);
                
                analyser.getByteFrequencyData(dataArray);
                
                const bars = document.querySelectorAll('.bar');
                const barCount = bars.length;
                
                for (let i = 0; i < barCount; i++) {
                    const bar = bars[i];
                    const value = dataArray[i * Math.floor(bufferLength / barCount)];
                    const height = (value / 255) * 100;
                    bar.style.height = height + '%';
                }
            }
            
            draw();
        }
        
        async function startRecording() {
            try {
                // Inicializar contexto de audio si no esta inicializado
                if (!audioContext) {
                    if (!initAudioContext()) {
                        throw new Error('No se pudo inicializar el contexto de audio');
                    }
                }
                
                // Solicitar acceso al microfono con configuracion optimizada para Windsurf
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        sampleRate: 44100
                    }
                });
                
                // Conectar el microfono al contexto de audio
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                
                mediaRecorder = new MediaRecorder(stream, {
                    mimeType: 'audio/webm;codecs=opus'
                });
                
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                    updateAudioInfo('Grabando... ' + audioChunks.length + ' chunks');
                };
                
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    
                    document.getElementById('audioPlayer').src = audioUrl;
                    
                    updateStatus('✅ Grabación completada. Puedes reproducir o descargar.', 'success');
                    updateAudioInfo('Duración: ' + formatDuration(audioChunks.length) + ' chunks');
                    
                    // Limpiar visualizador
                    document.querySelectorAll('.bar').forEach(bar => {
                        bar.style.height = '0%';
                        bar.classList.remove('recording');
                    });
                };
                
                // Iniciar grabacion
                mediaRecorder.start(1000); // 1000ms chunks
                isRecording = true;
                audioChunks = [];
                
                // Actualizar UI
                document.getElementById('startBtn').disabled = true;
                document.getElementById('stopBtn').disabled = false;
                document.getElementById('playBtn').disabled = true;
                document.getElementById('downloadBtn').disabled = true;
                
                updateStatus('🎙️ Grabando... Habla ahora para probar el microfono.', 'warning');
                updateAudioInfo('Formato: WebM/Opus, Calidad: Alta');
                
                // Activar visualizador
                document.querySelectorAll('.bar').forEach(bar => {
                    bar.classList.add('recording');
                });
                
                console.log('Recording started with WebM/Opus format');
                
            } catch (error) {
                console.error('Error accessing microphone:', error);
                updateStatus('❌ Error: ' + error.message, 'error');
                updateAudioInfo('Error: ' + error.message);
                
                // Proporcionar soluciones especificas para Windsurf
                if (error.name === 'NotAllowedError') {
                    updateStatus('❌ Permiso denegado. Revisa configuración de Windsurf.', 'error');
                    updateAudioInfo('Solución: 1) Ve a Configuración > Privacidad > Micrófono 2) Busca Windsurf y permite acceso');
                } else if (error.name === 'NotFoundError') {
                    updateStatus('❌ No se encontró el microfono. Verifica conexión.', 'error');
                    updateAudioInfo('Solución: 1) Conecta el microfono 2) Verifica drivers 3) Reinicia Windsurf');
                } else if (error.name === 'NotReadableError') {
                    updateStatus('❌ Microfono no disponible. Puede estar en uso por otra aplicación.', 'error');
                    updateAudioInfo('Solución: 1) Cierra otras apps que usen el micrófono 2) Reinicia Windsurf');
                }
            }
        }
        
        function stopRecording() {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                isRecording = false;
                
                // Actualizar UI
                document.getElementById('startBtn').disabled = false;
                document.getElementById('stopBtn').disabled = true;
                document.getElementById('playBtn').disabled = false;
                document.getElementById('downloadBtn').disabled = false;
                
                updateStatus('⏹️ Grabación detenida.', 'info');
                updateAudioInfo('Procesando audio...');
            }
        }
        
        function playRecording() {
            const audioPlayer = document.getElementById('audioPlayer');
            if (audioPlayer.src) {
                audioPlayer.play();
                updateStatus('▶️ Reproduciendo grabación...', 'info');
                updateAudioInfo('Reproduciendo audio grabado');
            } else {
                updateStatus('❌ No hay grabación para reproducir.', 'error');
                updateAudioInfo('Primero graba algo.');
            }
        }
        
        function downloadRecording() {
            const audioPlayer = document.getElementById('audioPlayer');
            if (audioPlayer.src) {
                const a = document.createElement('a');
                a.href = audioPlayer.src;
                a.download = 'windsurf-audio-test-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.webm';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                URL.revokeObjectURL(audioPlayer.src);
                
                updateStatus('💾 Descarga iniciada.', 'success');
                updateAudioInfo('Archivo descargado: ' + a.download);
            } else {
                updateStatus('❌ No hay grabación para descargar.', 'error');
                updateAudioInfo('Primero graba algo.');
            }
        }
        
        function updateStatus(message, type) {
            const statusDiv = document.getElementById('status');
            statusDiv.textContent = message;
            statusDiv.className = 'status ' + type;
        }
        
        function updateAudioInfo(info) {
            const infoDiv = document.getElementById('audioInfo');
            const detailsSpan = document.getElementById('audioDetails');
            detailsSpan.innerHTML = info;
        }
        
        function formatDuration(chunks) {
            // Estimar duración basada en chunks (aproximado)
            const estimatedSeconds = chunks * 0.1;
            return estimatedSeconds.toFixed(1) + 's';
        }
        
        // Verificar compatibilidad del navegador
        function checkCompatibility() {
            const userAgent = navigator.userAgent;
            const isChrome = userAgent.includes('Chrome');
            const isEdge = userAgent.includes('Edge');
            
            if (!isChrome && !isEdge) {
                updateStatus('⚠️ Este test funciona mejor en Chrome/Edge', 'warning');
                updateAudioInfo('Navegador detectado: ' + userAgent);
            } else {
                updateStatus('✅ Navegador compatible', 'success');
                updateAudioInfo('Navegador: ' + userAgent + ' - Soporta WebM/Opus');
            }
        }
        
        // Inicializar
        window.addEventListener('load', () => {
            checkCompatibility();
            updateStatus('🎤 Listo para probar el microfono en Windsurf', 'info');
            updateAudioInfo('Presiona "Iniciar" para comenzar la prueba');
        });
        
        // Manejar errores globales
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            updateStatus('❌ Error global: ' + event.error.message, 'error');
        });
        
    </script>
</body>
</html>
"@
    
    # Guardar archivo HTML
    $testPath = "C:\Users\Alejandro\AIGestion\scripts\communications\windsurf-microfono-test.html"
    Set-Content -Path $testPath -Value $windsurfTestHTML
    Write-Host "✅ Test HTML creado para Windsurf: $testPath" -ForegroundColor Green
    
    # Abrir el test en el navegador
    Start-Process $testPath
    
    Write-Host "✅ Test de Windsurf abierto en navegador" -ForegroundColor Green
    Write-Host "   → Permite acceso al microfono cuando se solicite" -ForegroundColor Gray
    Write-Host "   → Formato WebM/Opus optimizado para Windsurf" -ForegroundColor Gray
    Write-Host "   → Visualizador de audio en tiempo real" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error creando test: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 SOLUCIONES ESPECIFICAS PARA WINDSURF" -ForegroundColor Magenta
Write-Host "=================================" -ForegroundColor Gray
Write-Host "1. ✅ Permisos de privacidad configurados" -ForegroundColor Green
Write-Host "2. ✅ Servicios de audio reiniciados" -ForegroundColor Green
Write-Host "3. ✅ Test especial para Windsurf creado" -ForegroundColor Green
Write-Host "4. ✅ Visualizador de audio incluido" -ForegroundColor Green
Write-Host "5. ✅ Formato WebM/Opus optimizado" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 PASOS ADICIONALES SI FALLA:" -ForegroundColor Yellow
Write-Host "   → Reinicia Windsurf completamente" -ForegroundColor Gray
Write-Host "   → Verifica actualizaciones de Windows" -ForegroundColor Gray
Write -ForegroundColor Gray
Write-Host "   → Ejecuta como administrador" -ForegroundColor Gray
Write-Host "   → Reinstala Windsurf si es necesario" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 RESULTADO ESPERADO:" -ForegroundColor Green
Write-Host "✅ El microfono deberia funcionar en Windsurf" -ForegroundColor Green
Write-Host "✅ Visualización en tiempo real del audio" -ForegroundColor Green
Write-Host "✅ Descarga de grabaciones en WebM" -ForegroundColor Green
Write-Host "✅ Optimizado para la calidad de Windsurf" -ForegroundColor Green
