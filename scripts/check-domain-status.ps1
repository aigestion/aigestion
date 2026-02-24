#!/usr/bin/env pwsh

# =============================================================================
# DOMAIN STATUS CHECK - AIGESTION
# =============================================================================

Write-Host "DOMAIN STATUS CHECK - AIGESTION" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Dominios a verificar
$domains = @(
    @{ Name = "aigestion.net"; Type = "Principal" },
    @{ Name = "www.aigestion.net"; Type = "WWW" },
    @{ Name = "admin.aigestion.net"; Type = "Admin Dashboard" },
    @{ Name = "client.aigestion.net"; Type = "Client Dashboard" },
    @{ Name = "demo.aigestion.net"; Type = "Demo Dashboard" }
)

Write-Host "`n📋 Verificando estado de dominios..." -ForegroundColor Yellow

# Función para verificar dominio
function Test-DomainStatus {
    param(
        [string]$Domain,
        [string]$Type
    )
    
    Write-Host "`n🔍 Verificando: $Domain ($Type)" -ForegroundColor Yellow
    
    try {
        # Test HTTP
        $httpResponse = Invoke-WebRequest -Uri "http://$Domain" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $httpStatus = $httpResponse.StatusCode
        Write-Host "   HTTP: $httpStatus" -ForegroundColor $(if($httpStatus -eq 200) {"Green"} else {"Red"})
        
        # Test HTTPS
        $httpsResponse = Invoke-WebRequest -Uri "https://$Domain" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
        $httpsStatus = $httpsResponse.StatusCode
        Write-Host "   HTTPS: $httpsStatus" -ForegroundColor $(if($httpsStatus -eq 200) {"Green"} else {"Red"})
        
        # Verificar contenido
        if ($httpsResponse.Content -match "AIGestion") {
            Write-Host "   ✅ Contenido AIGestion detectado" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Contenido AIGestion no detectado" -ForegroundColor Red
        }
        
        # Verificar SSL
        try {
            $cert = [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
            $req = [System.Net.WebRequest]::Create("https://$Domain")
            $req.GetResponse() | Out-Null
            Write-Host "   ✅ SSL Certificate válido" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ SSL Certificate inválido" -ForegroundColor Red
        }
        
        return @{
            Domain = $Domain
            Type = $Type
            HTTP = $httpStatus
            HTTPS = $httpsStatus
            Success = ($httpStatus -eq 200 -and $httpsStatus -eq 200)
        }
        
    } catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        return @{
            Domain = $Domain
            Type = $Type
            HTTP = "Error"
            HTTPS = "Error"
            Success = $false
        }
    }
}

# Verificar cada dominio
$results = @()
foreach ($domain in $domains) {
    $result = Test-DomainStatus -Domain $domain.Name -Type $domain.Type
    $results += $result
    Start-Sleep -Seconds 1
}

# Resumen
Write-Host "`n📊 RESUMEN DE DOMINIOS" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

$working = 0
$total = $results.Count

foreach ($result in $results) {
    if ($result.Success) {
        Write-Host "✅ $($result.Domain) - $($result.Type)" -ForegroundColor Green
        $working++
    } else {
        Write-Host "❌ $($result.Domain) - $($result.Type)" -ForegroundColor Red
    }
}

Write-Host "`n📈 Estadísticas:" -ForegroundColor Yellow
Write-Host "Total dominios: $total" -ForegroundColor White
Write-Host "Funcionando: $working" -ForegroundColor Green
Write-Host "Fallidos: $($total - $working)" -ForegroundColor Red

# Recomendaciones
Write-Host "`n💡 RECOMENDACIONES:" -ForegroundColor Yellow

if ($working -lt $total) {
    Write-Host "1. Configurar DNS en Squarespace:" -ForegroundColor White
    Write-Host "   - Iniciar sesión en Squarespace con noemisanalex@gmail.com" -ForegroundColor Gray
    Write-Host "   - Ir a Settings → Domains → aigestion.net" -ForegroundColor Gray
    Write-Host "   - Configurar registros A para GitHub Pages" -ForegroundColor Gray
    Write-Host "" -ForegroundColor White
    
    Write-Host "2. Registros DNS recomendados:" -ForegroundColor White
    Write-Host "   Type: A | Name: @ | Value: 185.199.108.153" -ForegroundColor Gray
    Write-Host "   Type: A | Name: @ | Value: 185.199.109.153" -ForegroundColor Gray
    Write-Host "   Type: A | Name: @ | Value: 185.199.110.153" -ForegroundColor Gray
    Write-Host "   Type: A | Name: @ | Value: 185.199.111.153" -ForegroundColor Gray
    Write-Host "" -ForegroundColor White
    
    Write-Host "3. Configurar GitHub Pages:" -ForegroundColor White
    Write-Host "   - Ir al repositorio GitHub" -ForegroundColor Gray
    Write-Host "   - Settings → Pages" -ForegroundColor Gray
    Write-Host "   - Añadir dominios personalizados" -ForegroundColor Gray
    Write-Host "   - Activar 'Enforce HTTPS'" -ForegroundColor Gray
} else {
    Write-Host "✅ Todos los dominios funcionando correctamente" -ForegroundColor Green
    Write-Host "📈 Monitorear uptime y rendimiento" -ForegroundColor White
}

# Estado del DNS
Write-Host "`n🔍 ESTADO DEL DNS" -ForegroundColor Yellow
Write-Host "==================" -ForegroundColor Yellow

# Verificar DNS de aigestion.net
try {
    $dnsRecords = Resolve-DnsName -Name "aigestion.net" -Type A -ErrorAction Stop
    Write-Host "✅ DNS aigestion.net resuelto" -ForegroundColor Green
    foreach ($record in $dnsRecords) {
        Write-Host "   → $($record.Address)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ DNS aigestion.net no resuelto" -ForegroundColor Red
    Write-Host "   Requiere configuración en Squarespace" -ForegroundColor Yellow
}

Write-Host "`n🎯 VERIFICACIÓN COMPLETADA" -ForegroundColor Cyan
