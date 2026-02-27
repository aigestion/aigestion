# Fix Directo de Microfono

Write-Host "FIX DE MICROFONO" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Gray

# 1. Abrir configuracion de privacidad
Write-Host "1. Abriendo configuracion de privacidad..." -ForegroundColor Yellow
Start-Process "ms-settings:privacy-microphone"

# 2. Abrir configuracion de sonido
Write-Host "2. Abriendo configuracion de sonido..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "mmsys.cpl"

# 3. Reiniciar servicios de audio
Write-Host "3. Reiniciando servicios de audio..." -ForegroundColor Yellow
Stop-Service -Name "Audiosrv" -Force -ErrorAction SilentlyContinue
Stop-Service -Name "AudioEndpointBuilder" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
Start-Service -Name "Audiosrv" -ErrorAction SilentlyContinue
Start-Service -Name "AudioEndpointBuilder" -ErrorAction SilentlyContinue

# 4. Abrir grabadora para probar
Write-Host "4. Abriendo grabadora para probar..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "soundrecorder.exe"

Write-Host ""
Write-Host "INSTRUCCIONES:" -ForegroundColor Magenta
Write-Host "1. En privacidad: Permite acceso al microfono" -ForegroundColor Gray
Write-Host "2. En sonido: Selecciona microfono correcto" -ForegroundColor Gray
Write-Host "3. En grabadora: Prueba grabar y reproducir" -ForegroundColor Gray
Write-Host "4. Reinicia la aplicacion que falla" -ForegroundColor Gray
