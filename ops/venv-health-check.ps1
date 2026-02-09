# ============================================================================
# AIGestion.net - Health Check de Entornos Virtuales
# ============================================================================
# Uso: .\scripts\venv-health-check.ps1
# Descripción: Verifica el estado de todos los entornos virtuales
# ============================================================================

param(
    [switch]$Detailed = $false,
    [switch]$Fix = $false
)

$ErrorActionPreference = "SilentlyContinue"

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     AIGestion.net - Health Check Entornos Virtuales         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$rootPath = "C:\Users\Alejandro\AIGestion"
$venvs = @(
    @{
        Name = "Principal (.venv)"
        Path = "$rootPath\.venv"
        Requirements = "$rootPath\requirements.txt"
        Priority = "HIGH"
        Description = "Entorno principal para desarrollo backend y aig-ia-engine"
    },
    @{
        Name = "NotebookLM (.venv-notebooklm)"
        Path = "$rootPath\.venv-notebooklm"
        Requirements = $null
        Priority = "MEDIUM"
        Description = "MCP Server para NotebookLM (aislado)"
    },
    @{
        Name = "ML Service (ml-service\.venv-ml)"
        Path = "$rootPath\ml-service\.venv-ml"
        Requirements = "$rootPath\ml-service\requirements.txt"
        Priority = "LOW"
        Description = "Entorno ML para torch, chromadb (futuro)"
    }
)

$results = @()

foreach ($venv in $venvs) {
    Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host "🔍 Verificando: $($venv.Name)" -ForegroundColor Yellow
    Write-Host "   $($venv.Description)" -ForegroundColor Gray
    
    $status = @{
        Name = $venv.Name
        Priority = $venv.Priority
        Exists = $false
        HasPython = $false
        HasPip = $false
        PythonVersion = "N/A"
        PackageCount = 0
        SizeMB = 0
        Status = "❌ NO EXISTE"
        Issues = @()
    }
    
    # Verificar existencia
    if (Test-Path $venv.Path) {
        $status.Exists = $true
        
        # Verificar Python
        $pythonPath = Join-Path $venv.Path "Scripts\python.exe"
        if (Test-Path $pythonPath) {
            $status.HasPython = $true
            $version = & $pythonPath --version 2>&1
            $status.PythonVersion = $version -replace "Python ", ""
            
            # Verificar pip
            $pipPath = Join-Path $venv.Path "Scripts\pip.exe"
            if (Test-Path $pipPath) {
                $status.HasPip = $true
                
                # Contar paquetes
                $packages = & $pipPath list 2>&1
                if ($packages) {
                    $status.PackageCount = ($packages | Measure-Object).Count - 2  # -2 por headers
                }
                
                # Verificar dependencias si hay requirements.txt
                if ($venv.Requirements -and (Test-Path $venv.Requirements)) {
                    Write-Host "   📦 Verificando requirements.txt..." -ForegroundColor Gray
                    $missingPackages = @()
                    $reqContent = Get-Content $venv.Requirements | Where-Object { 
                        $_ -notmatch '^\s*#' -and $_ -notmatch '^\s*$' -and $_ -notmatch '^==='
                    }
                    
                    foreach ($req in $reqContent) {
                        $packageName = ($req -split '[><=]')[0].Trim()
                        $installed = & $pipPath show $packageName 2>&1
                        if ($installed -match "WARNING: Package\(s\) not found") {
                            $missingPackages += $packageName
                        }
                    }
                    
                    if ($missingPackages.Count -gt 0) {
                        $status.Issues += "Faltan $($missingPackages.Count) paquetes"
                        if ($Detailed) {
                            Write-Host "      ⚠️ Paquetes faltantes: $($missingPackages -join ', ')" -ForegroundColor Yellow
                        }
                    }
                }
            } else {
                $status.Issues += "No tiene pip"
            }
        } else {
            $status.Issues += "No tiene python.exe"
        }
        
        # Calcular tamaño
        $size = (Get-ChildItem $venv.Path -Recurse -ErrorAction SilentlyContinue | 
                 Measure-Object -Property Length -Sum).Sum / 1MB
        $status.SizeMB = [math]::Round($size, 2)
        
        # Determinar estado
        if ($status.HasPython -and $status.HasPip -and $status.Issues.Count -eq 0) {
            $status.Status = "✅ OK"
            Write-Host "   ✅ Estado: SALUDABLE" -ForegroundColor Green
        } elseif ($status.HasPython -and $status.HasPip) {
            $status.Status = "⚠️ WARNINGS"
            Write-Host "   ⚠️ Estado: CON ADVERTENCIAS" -ForegroundColor Yellow
        } else {
            $status.Status = "❌ ERROR"
            Write-Host "   ❌ Estado: CON ERRORES" -ForegroundColor Red
        }
        
        Write-Host "   🐍 Python: $($status.PythonVersion)" -ForegroundColor Cyan
        Write-Host "   📦 Paquetes: $($status.PackageCount)" -ForegroundColor Cyan
        Write-Host "   💾 Tamaño: $($status.SizeMB) MB" -ForegroundColor Cyan
        
        if ($status.Issues.Count -gt 0) {
            Write-Host "   ⚠️ Issues:" -ForegroundColor Yellow
            foreach ($issue in $status.Issues) {
                Write-Host "      • $issue" -ForegroundColor Yellow
            }
        }
        
    } else {
        Write-Host "   ❌ NO EXISTE" -ForegroundColor Red
        if ($venv.Priority -eq "HIGH") {
            Write-Host "   ⚠️ CRÍTICO: Entorno de prioridad ALTA no encontrado" -ForegroundColor Red
            $status.Issues += "Entorno crítico faltante"
        } elseif ($venv.Priority -eq "LOW") {
            Write-Host "   ℹ️ Entorno opcional no creado (normal)" -ForegroundColor Gray
        }
    }
    
    $results += $status
    Write-Host ""
}

# Resumen
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 RESUMEN" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$results | ForEach-Object {
    $color = switch ($_.Status) {
        "✅ OK" { "Green" }
        "⚠️ WARNINGS" { "Yellow" }
        "❌ ERROR" { "Red" }
        "❌ NO EXISTE" { "DarkGray" }
    }
    
    Write-Host "`n$($_.Name)" -ForegroundColor White
    Write-Host "  Estado: $($_.Status)" -ForegroundColor $color
    if ($_.Exists) {
        Write-Host "  Python: $($_.PythonVersion) | Paquetes: $($_.PackageCount) | Tamaño: $($_.SizeMB) MB" -ForegroundColor Gray
    }
    if ($_.Issues.Count -gt 0) {
        Write-Host "  Issues: $($_.Issues.Count)" -ForegroundColor Yellow
    }
}

# Contadores
$totalVenvs = $results.Count
$healthy = ($results | Where-Object { $_.Status -eq "✅ OK" }).Count
$warnings = ($results | Where-Object { $_.Status -eq "⚠️ WARNINGS" }).Count
$errors = ($results | Where-Object { $_.Status -match "❌" }).Count

Write-Host "`n─────────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "Total: $totalVenvs | ✅ Saludables: $healthy | ⚠️ Advertencias: $warnings | ❌ Errores: $errors" -ForegroundColor Cyan

# Sugerencias de fix
if ($Fix -and ($warnings -gt 0 -or $errors -gt 0)) {
    Write-Host "`n🔧 MODO FIX ACTIVADO - Reparando entornos..." -ForegroundColor Yellow
    
    foreach ($result in $results) {
        if ($result.Status -ne "✅ OK" -and $result.Status -ne "❌ NO EXISTE") {
            Write-Host "`n🔨 Reparando: $($result.Name)" -ForegroundColor Yellow
            $venv = $venvs | Where-Object { $_.Name -eq $result.Name } | Select-Object -First 1
            
            if ($venv.Requirements -and (Test-Path $venv.Requirements)) {
                Write-Host "   📦 Reinstalando dependencias..." -ForegroundColor Gray
                $pythonPath = Join-Path $venv.Path "Scripts\python.exe"
                & uv pip install -r $venv.Requirements --python $pythonPath
                Write-Host "   ✅ Dependencias actualizadas" -ForegroundColor Green
            }
        }
    }
}

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    Health Check Completado                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Comandos útiles
if (-not $Detailed) {
    Write-Host "💡 Tips:" -ForegroundColor Cyan
    Write-Host "   • Ejecuta con -Detailed para ver más información" -ForegroundColor Gray
    Write-Host "   • Ejecuta con -Fix para reparar entornos automáticamente" -ForegroundColor Gray
    Write-Host "   • Ver guía completa: cat PYTHON_VENV_GUIDE.md`n" -ForegroundColor Gray
}
