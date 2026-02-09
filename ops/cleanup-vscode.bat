@echo off
REM Script para limpiar VS Code y remover Google Cloud Code
REM Ejecutar como Administrador

echo.
echo ========================================
echo 🧹 Limpieza de VS Code - AIGestion
echo ========================================
echo.

REM Cerrar VS Code
echo [1/5] Cerrando VS Code...
taskkill /F /IM code.exe 2>nul
timeout /t 2 /nobreak

REM Borrar caché de extensiones de Google Cloud
echo [2/5] Limpiando caché de extensiones...
for /d %%i in ("%USERPROFILE%\.vscode\extensions\googlecloudtools*") do (
    echo Eliminando: %%i
    rmdir /s /q "%%i" 2>nul
)
for /d %%i in ("%USERPROFILE%\.vscode\extensions\google.gemini*") do (
    echo Eliminando Gemini: %%i
    rmdir /s /q "%%i" 2>nul
)
for /d %%i in ("%USERPROFILE%\.vscode\extensions\google.cloudcode*") do (
    echo Eliminando Cloud Code: %%i
    rmdir /s /q "%%i" 2>nul
)

REM Borrar caché de estado
echo [3/5] Limpiando estado de VS Code...
del /q "%APPDATA%\Code\User\workspaceStorage\*" 2>nul || echo Caché ya limpio

REM Borrar configuración de gcloud si existe
echo [4/5] Reseteando configuración gcloud...
if exist "%USERPROFILE%\.config\gcloud\configurations\config_default" (
    echo Encontrado: config_default
)

REM Listo
echo [5/5] ✅ Limpeza completada
echo.
echo ========================================
echo Próximos pasos:
echo 1. Abre AIGestion.code-workspace
echo 2. NO instales googlecloudtools.cloudcode
echo 3. Extensions → Disable/Uninstall si aparece
echo ========================================
echo.
pause
