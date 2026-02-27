# Test Simple de Microfono - Windows

Write-Host "TEST DE MICROFONO" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Gray

# Verificar dispositivos de audio
Write-Host "Verificando dispositivos de audio..." -ForegroundColor Yellow

try {
    $audioDevices = Get-WmiObject -Class Win32_SoundDevice | Where-Object { $_.Status -eq "OK" }
    
    Write-Host "Dispositivos encontrados:" -ForegroundColor Green
    foreach ($device in $audioDevices) {
        Write-Host "Dispositivo: $($device.Name)" -ForegroundColor White
        Write-Host "Estado: $($device.Status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Abrir configuracion de sonido
Write-Host "Abriendo configuracion de sonido..." -ForegroundColor Yellow

try {
    Start-Process "mmsys.cpl"
    Write-Host "Configuracion de sonido abierta" -ForegroundColor Green
    Write-Host "Verifica tu microfono:" -ForegroundColor Yellow
    Write-Host "1. Que este activo" -ForegroundColor Gray
    Write-Host "2. Que no este silenciado" -ForegroundColor Gray
    Write-Host "3. Usa 'Probar microfono'" -ForegroundColor Gray
    
} catch {
    Write-Host "Error abriendo configuracion: $($_.Exception.Message)" -ForegroundColor Red
}

# Abrir grabadora de Windows
Write-Host "Abriendo grabadora..." -ForegroundColor Yellow

try {
    Start-Process "soundrecorder.exe"
    Write-Host "Grabadora abierta" -ForegroundColor Green
    Write-Host "Instrucciones:" -ForegroundColor Yellow
    Write-Host "1. Pulsa boton rojo de grabacion" -ForegroundColor Gray
    Write-Host "2. Habla cerca del microfono" -ForegroundColor Gray
    Write-Host "3. Deten y reproduce para verificar" -ForegroundColor Gray
    
} catch {
    Write-Host "Error abriendo grabadora: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "TEST COMPLETADO" -ForegroundColor Magenta
Write-Host "Prueba el microfono ahora" -ForegroundColor Cyan
