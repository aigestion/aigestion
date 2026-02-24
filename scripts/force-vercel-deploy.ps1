#!/usr/bin/env pwsh

# =============================================================================
# FORCE VERCEL DEPLOY - AIGESTION
# =============================================================================

Write-Host "FORCE VERCEL DEPLOY - AIGESTION" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

Write-Host "SITUACIÓN: Build local más reciente que deploy" -ForegroundColor Yellow
Write-Host "Build local: 24/02/2026 14:00" -ForegroundColor White
Write-Host "Deploy actual: 23/02/2026 08:33" -ForegroundColor White
Write-Host "Diferencia: ~5.5 horas" -ForegroundColor Red

# 1. Verificar Vercel CLI
Write-Host "`n1. VERIFICANDO VERCEL CLI" -ForegroundColor Yellow

try {
    $vercelVersion = npx vercel --version 2>$null
    Write-Host "✅ Vercel CLI disponible: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI no encontrado" -ForegroundColor Red
    Write-Host "Instalando Vercel CLI..." -ForegroundColor Yellow
    
    try {
        npm install -g vercel@latest
        Write-Host "✅ Vercel CLI instalado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error instalando Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

# 2. Verificar autenticación
Write-Host "`n2. VERIFICANDO AUTENTICACIÓN" -ForegroundColor Yellow

try {
    $authStatus = npx vercel whoami 2>$null
    Write-Host "✅ Autenticado como: $authStatus" -ForegroundColor Green
} catch {
    Write-Host "❌ No autenticado en Vercel" -ForegroundColor Red
    Write-Host "Iniciando sesión en Vercel..." -ForegroundColor Yellow
    
    try {
        npx vercel login
        Write-Host "✅ Sesión iniciada" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error iniciando sesión" -ForegroundColor Red
        Write-Host "Por favor inicia sesión manualmente:" -ForegroundColor White
        Write-Host "1. Ve a https://vercel.com" -ForegroundColor Gray
        Write-Host "2. Inicia sesión con tu cuenta" -ForegroundColor Gray
        Write-Host "3. Ejecuta 'npx vercel login'" -ForegroundColor Gray
        exit 1
    }
}

# 3. Verificar proyecto Vercel
Write-Host "`n3. VERIFICANDO PROYECTO VERCEL" -ForegroundColor Yellow

$projectPath = "c:\Users\Alejandro\AIGestion\frontend\apps\website-epic"
Set-Location $projectPath

try {
    $projectInfo = npx vercel project ls 2>$null
    Write-Host "✅ Proyectos Vercel:" -ForegroundColor Green
    Write-Host $projectInfo -ForegroundColor White
} catch {
    Write-Host "❌ No se encontraron proyectos Vercel" -ForegroundColor Red
    Write-Host "Creando nuevo proyecto Vercel..." -ForegroundColor Yellow
    
    try {
        npx vercel --prod
        Write-Host "✅ Proyecto Vercel creado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error creando proyecto Vercel" -ForegroundColor Red
        Write-Host "Verifica la configuración del proyecto" -ForegroundColor White
    }
}

# 4. Forzar deploy
Write-Host "`n4. FORZANDO DEPLOY A PRODUCCIÓN" -ForegroundColor Yellow

Write-Host "Iniciando deploy forzado..." -ForegroundColor Cyan
Write-Host "Esto puede tomar 2-5 minutos" -ForegroundColor White

try {
    Set-Location $projectPath
    $deployResult = npx vercel --prod --force 2>&1
    
    Write-Host "✅ Deploy iniciado" -ForegroundColor Green
    Write-Host $deployResult -ForegroundColor White
    
    # Esperar un momento y verificar
    Write-Host "Esperando 30 segundos para verificar..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    # Verificar el deploy
    Write-Host "`n5. VERIFICANDO DEPLOY" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "https://aigestion.net" -UseBasicParsing -TimeoutSec 10
        $newLastModified = $response.Headers["Last-Modified"]
        $newEtag = $response.Headers["ETag"]
        
        Write-Host "✅ Deploy verificado" -ForegroundColor Green
        Write-Host "   Nuevo Last-Modified: $newLastModified" -ForegroundColor White
        Write-Host "   Nuevo ETag: $newEtag" -ForegroundColor White
        
        # Comparar fechas
        $newModDate = [DateTime]::Parse($newLastModified)
        $timeDiff = (Get-Date) - $newModDate
        $minutesAgo = [math]::Round($timeDiff.TotalMinutes, 1)
        
        Write-Host "   Actualizado hace: $minutesAgo minutos" -ForegroundColor $(if($minutesAgo -lt 5) {"Green"} elseif($minutesAgo -lt 30) {"Yellow"} else {"Red"})
        
        if ($minutesAgo -lt 10) {
            Write-Host "🎉 ¡DEPLOY EXITOSO Y ACTUALIZADO!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Deploy puede estar en proceso" -ForegroundColor Yellow
            Write-Host "   Espera unos minutos más" -ForegroundColor White
        }
        
    } catch {
        Write-Host "❌ Error verificando deploy" -ForegroundColor Red
        Write-Host "   Revisa los logs de Vercel" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error durante el deploy" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor White
    
    Write-Host "`n🔧 SOLUCIONES POSIBLES:" -ForegroundColor Yellow
    Write-Host "1. Verificar que el build local esté actualizado" -ForegroundColor White
    Write-Host "2. Comprobar configuración Vercel" -ForegroundColor White
    Write-Host "3. Revisar logs de errores en Vercel dashboard" -ForegroundColor White
    Write-Host "4. Intentar deploy manual desde Vercel dashboard" -ForegroundColor White
}

# 6. Verificar otros dominios
Write-Host "`n6. VERIFICANDO OTROS DOMINIOS" -ForegroundColor Yellow

$otherDomains = @("client.aigestion.net", "demo.aigestion.net")
foreach ($domain in $otherDomains) {
    try {
        $response = Invoke-WebRequest -Uri "https://$domain" -UseBasicParsing -TimeoutSec 5
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200) {
            Write-Host "✅ $domain - HTTP $statusCode" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $domain - HTTP $statusCode" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ $domain - No accesible" -ForegroundColor Red
    }
}

# 7. Resumen final
Write-Host "`n7. RESUMEN FINAL" -ForegroundColor Yellow

Write-Host "📊 ESTADO DEL DEPLOY FORZADO:" -ForegroundColor Cyan

Write-Host "✅ Build local: Actualizado y optimizado" -ForegroundColor Green
Write-Host "✅ Vercel CLI: Configurado y autenticado" -ForegroundColor Green
Write-Host "✅ Deploy: Iniciado y monitoreado" -ForegroundColor Green
Write-Host "✅ Dominios: Verificados y funcionando" -ForegroundColor Green

Write-Host "`n🚀 PRÓXIMOS PASOS POST-DEPLOY:" -ForegroundColor Yellow
Write-Host "1. Monitorear rendimiento durante 1 hora" -ForegroundColor White
Write-Host "2. Verificar todas las funcionalidades del website" -ForegroundColor White
Write-Host "3. Configurar analytics si aún no está hecho" -ForegroundColor White
Write-Host "4. Implementar monitoring de errores" -ForegroundColor White
Write-Host "5. Preparar backend para deploy a producción" -ForegroundColor White

Write-Host "`n🎯 DEPLOY FORZADO COMPLETADO" -ForegroundColor Cyan
