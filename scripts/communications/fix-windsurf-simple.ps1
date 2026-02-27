# Fix Simple de Microfono Windsurf

Write-Host "🌊 FIX DE MICROFONO WINDSURF" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Gray

# 1. Abrir configuracion de privacidad
Write-Host "1. Abriendo configuracion de privacidad..." -ForegroundColor Yellow
Start-Process "ms-settings:privacy-microphone"

# 2. Abrir configuracion de aplicaciones
Write-Host "2. Abriendo configuracion de aplicaciones..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "ms-settings:appsfeatures"

# 3. Abrir Windsurf si no esta corriendo
Write-Host "3. Verificando Windsurf..." -ForegroundColor Yellow
try {
    $windsurf = Get-Process | Where-Object { $_.Name -like "*windsurf*" }
    if (-not $windsurf) {
        Write-Host "Iniciando Windsurf..." -ForegroundColor Green
        Start-Process "windsurf"
        Start-Sleep -Seconds 5
    } else {
        Write-Host "Windsurf ya esta corriendo" -ForegroundColor Green
    }
} catch {
    Write-Host "Error verificando Windsurf" -ForegroundColor Red
}

# 4. Abrir configuracion de sonido
Write-Host "4. Abriendo configuracion de sonido..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "mmsys.cpl"

# 5. Crear test simple
Write-Host "5. Creando test de audio..." -ForegroundColor Yellow

$testHTML = @"
<!DOCTYPE html>
<html>
<head>
    <title>Test Micrófono Windsurf</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f0f0f0; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        button { background: #007acc; color: white; border: none; padding: 15px 30px; margin: 10px; border-radius: 5px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; }
        .info { background: #d1ecf1; color: #0c5460; }
        .error { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Test Micrófono Windsurf</h1>
        <button onclick="startRecording()">Iniciar Grabacion</button>
        <button onclick="stopRecording()">Detener</button>
        <button onclick="playRecording()">Reproducir</button>
        
        <div id="status" class="status info">Listo para probar...</div>
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
                    updateStatus('Grabacion completada', 'success');
                };
                
                mediaRecorder.start();
                isRecording = true;
                audioChunks = [];
                updateStatus('Grabando...', 'info');
                
            } catch (error) {
                updateStatus('Error: ' + error.message, 'error');
                console.error('Error:', error);
            }
        }

        function stopRecording() {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                isRecording = false;
                updateStatus('Grabacion detenida', 'info');
            }
        }

        function playRecording() {
            const audioPlayer = document.getElementById('audioPlayer');
            if (audioPlayer.src) {
                audioPlayer.play();
                updateStatus('Reproduciendo...', 'info');
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
    
    $testPath = "C:\Users\Alejandro\AIGestion\scripts\communications\windsurf-test.html"
    Set-Content -Path $testPath -Value $testHTML
    Write-Host "Test creado: $testPath" -ForegroundColor Green
    
    # Abrir el test
    Start-Process $testPath

Write-Host ""
Write-Host "INSTRUCCIONES:" -ForegroundColor Magenta
Write-Host "1. En privacidad: Permite acceso al microfono" -ForegroundColor Gray
Write-Host "2. En aplicaciones: Busca Windsurf y permite acceso" -ForegroundColor Gray
Write-Host "3. En el test: Prueba grabar y reproducir" -ForegroundColor Gray
Write-Host "4. Si falla: Reinicia Windsurf" -ForegroundColor Gray
