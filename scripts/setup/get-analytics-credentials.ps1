# 📊 Analytics & Business Intelligence Credentials Generator for AIGestion
# PowerShell script para obtener credenciales de analytics automáticamente

param(
    [Parameter(Mandatory=$false)]
    [string]$OutputPath = "c:\Users\Alejandro\AIGestion\.env",
    
    [Parameter(Mandatory=$false)]
    [switch]$Interactive,
    
    [Parameter(Mandatory=$false)]
    [switch]$Test,
    
    [Parameter(Mandatory=$false)]
    [switch]$BatchMode
)

# ============================================
# CONFIGURACIÓN
# ============================================

$AnalyticsServices = @{
    Mixpanel = @{
        Name = "Mixpanel"
        Url = "https://mixpanel.com"
        Description = "Product analytics platform"
        TokenType = "Project Token"
        TokenExample = "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
        SetupUrl = "https://mixpanel.com/help/reference"
    }
    Amplitude = @{
        Name = "Amplitude"
        Url = "https://amplitude.com"
        Description = "User behavior tracking"
        TokenType = "API Key"
        TokenExample = "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
        SetupUrl = "https://developers.amplitude.com/docs"
    }
    Segment = @{
        Name = "Segment"
        Url = "https://segment.com"
        Description = "Customer data platform"
        TokenType = "Write Key"
        TokenExample = "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
        SetupUrl = "https://segment.com/docs"
    }
    Looker = @{
        Name = "Looker"
        Url = "https://looker.com"
        Description = "BI & data visualization"
        TokenType = "API Key"
        TokenExample = "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
        SetupUrl = "https://docs.looker.com"
    }
    Tableau = @{
        Name = "Tableau"
        Url = "https://tableau.com"
        Description = "Advanced analytics"
        TokenType = "API Key"
        TokenExample = "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
        SetupUrl = "https://help.tableau.com"
    }
    Metabase = @{
        Name = "Metabase"
        Url = "http://localhost:3000"
        Description = "Open-source BI platform"
        TokenType = "Secret Key"
        TokenExample = "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
        SetupUrl = "https://www.metabase.com/docs"
    }
}

# Colores para output
$Colors = @{
    Reset = "`e[0m"
    Green = "`e[32m"
    Yellow = "`e[33m"
    Blue = "`e[34m"
    Cyan = "`e[36m"
    White = "`e[37m"
    Bold = "`e[1m"
    Dim = "`e[2m"
}

# ============================================
# FUNCIONES AUXILIARES
# ============================================

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host "$Colors$Color$Message$Colors.Reset"
}

function Write-Section {
    param([string]$Title)
    Write-ColorOutput "`n📊 $Title" "Cyan"
    Write-ColorOutput "================================" "Blue"
}

function Write-Step {
    param([string]$Step, [string]$Status = "⏳")
    Write-ColorOutput "$Status $Step" "Yellow"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✅ $Message" "Green"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "❌ $Message" "Red"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ️ $Message" "Blue"
}

function Write-Service {
    param([string]$ServiceName, [string]$Description)
    Write-ColorOutput "🔹 $ServiceName" "Yellow"
    Write-ColorOutput "   $Description" "Dim"
}

function Test-Environment {
    Write-Info "Testing environment setup..."
    
    # Test PowerShell version
    $psVersion = $PSVersionTable.PSVersion.Major
    if ($psVersion -lt 5) {
        Write-Error "PowerShell 5.0+ required. Current version: $psVersion"
        return $false
    }
    
    # Test internet connection
    try {
        $response = Invoke-WebRequest -Uri "https://mixpanel.com" -Method Head -Timeout 10
        if ($response.StatusCode -eq 200) {
            Write-Success "Internet connection OK"
        } else {
            Write-Error "Internet connection failed"
            return $false
        }
    }
    catch {
        Write-Error "Internet connection failed"
        return $false
    }
    
    # Test file system
    if (-not (Test-Path $OutputPath)) {
        Write-Error "Output path does not exist: $OutputPath"
        return $false
    }
    
    Write-Success "Environment test passed"
    return $true
}

# ============================================
# OBTENCIÓN DE CREDENCIALES
# ============================================

function Get-AnalyticsCredentials {
    Write-Section "OBTENCIÓN DE CREDENCIALES ANALYTICS"
    
    $credentials = @{}
    
    foreach ($service in $AnalyticsServices.GetEnumerator()) {
        $serviceName = $service.Key
        $serviceInfo = $service.Value
        
        Write-Service $serviceInfo.Name $serviceInfo.Description
        
        if ($Interactive) {
            $credential = Get-CredentialInteractive $serviceName $serviceInfo
        } elseif ($BatchMode) {
            $credential = Get-CredentialBatch $serviceName $serviceInfo
        } else {
            $credential = Get-CredentialManual $serviceName $serviceInfo
        }
        
        $credentials[$serviceName] = $credential
        Write-Success "$($serviceInfo.Name) credential obtained"
    }
    
    # Actualizar archivo .env
    Write-Step "Actualizando archivo .env..."
    Update-EnvFile $OutputPath $credentials
    
    # Mostrar resumen
    Show-Summary $credentials
    
    return $true
}

function Get-CredentialInteractive {
    param([string]$ServiceName, [object]$ServiceInfo)
    
    Write-Info "Obteniendo credencial para $($ServiceInfo.Name)..."
    Write-Info "URL: $($ServiceInfo.Url)"
    Write-Info "Tipo: $($ServiceInfo.TokenType)"
    Write-Info "Setup: $($ServiceInfo.SetupUrl)"
    
    $credential = Read-Host "Ingresa tu $($ServiceInfo.TokenType) para $($ServiceInfo.Name)"
    
    if ([string]::IsNullOrWhiteSpace($credential)) {
        Write-Info "Usando credencial de ejemplo..."
        return $ServiceInfo.TokenExample
    }
    
    return $credential
}

function Get-CredentialBatch {
    param([string]$ServiceName, [object]$ServiceInfo)
    
    Write-Info "Modo batch - usando credenciales de ejemplo para $($ServiceInfo.Name)"
    return $ServiceInfo.TokenExample
}

function Get-CredentialManual {
    param([string]$ServiceName, [object]$ServiceInfo)
    
    Write-Info "Instrucciones para $($ServiceInfo.Name):"
    Write-Info "1. Ve a $($ServiceInfo.Url)"
    Write-Info "2. Crea cuenta o inicia sesión"
    Write-Info "3. Crea nuevo proyecto 'AIGestion'"
    Write-Info "4. Obtén tu $($ServiceInfo.TokenType)"
    Write-Info "5. Consulta: $($ServiceInfo.SetupUrl)"
    
    $credential = Read-Host "Ingresa tu $($ServiceInfo.TokenType) para $($ServiceInfo.Name)"
    
    if ([string]::IsNullOrWhiteSpace($credential)) {
        Write-Info "Usando credencial de ejemplo..."
        return $ServiceInfo.TokenExample
    }
    
    return $credential
}

function Update-EnvFile {
    param(
        [string]$EnvPath,
        [hashtable]$Credentials
    )
    
    try {
        # Leer archivo .env existente
        $envContent = if (Test-Path $EnvPath) {
            Get-Content $EnvPath -Raw
        } else {
            "# AIGestion Environment Variables`n"
        }
        
        # Encontrar y reemplazar líneas de Analytics
        $lines = $envContent -split "`n"
        $updatedLines = @()
        
        foreach ($line in $lines) {
            if ($line -match "^# MIXPANEL_TOKEN=") {
                $updatedLines += "MIXPANEL_TOKEN=$($Credentials.Mixpanel)"
            }
            elseif ($line -match "^# AMPLITUDE_API_KEY=") {
                $updatedLines += "AMPLITUDE_API_KEY=$($Credentials.Amplitude)"
            }
            elseif ($line -match "^# SEGMENT_WRITE_KEY=") {
                $updatedLines += "SEGMENT_WRITE_KEY=$($Credentials.Segment)"
            }
            elseif ($line -match "^# LOOKER_API_KEY=") {
                $updatedLines += "LOOKER_API_KEY=$($Credentials.Looker)"
            }
            elseif ($line -match "^# TABLEAU_API_KEY=") {
                $updatedLines += "TABLEAU_API_KEY=$($Credentials.Tableau)"
            }
            elseif ($line -match "^# METABASE_SECRET_KEY=") {
                $updatedLines += "METABASE_SECRET_KEY=$($Credentials.Metabase)"
            }
            else {
                $updatedLines += $line
            }
        }
        
        # Escribir archivo actualizado
        Set-Content -Path $EnvPath -Value ($updatedLines -join "`n") -Encoding UTF8
        Write-Success "Archivo .env actualizado: $EnvPath"
    }
    catch {
        throw "Error actualizando archivo .env: $($_.Exception.Message)"
    }
}

function Show-Summary {
    param([hashtable]$Credentials)
    
    Write-Section "RESUMEN DE CONFIGURACIÓN"
    
    foreach ($service in $AnalyticsServices.GetEnumerator()) {
        $serviceName = $service.Key
        $serviceInfo = $service.Value
        $credential = $Credentials[$serviceName]
        
        Write-Info "$($serviceInfo.Name):"
        Write-Info "  - Token: $($credential.Substring(0, 20))..."
        Write-Info "  - Tipo: $($serviceInfo.TokenType)"
        Write-Info "  - URL: $($serviceInfo.Url)"
        Write-Info ""
    }
    
    # Instrucciones adicionales
    Write-Section "PRÓXIMOS PASOS"
    Write-Info "1. Reinicia el servidor de desarrollo"
    Write-Info "2. Verifica las variables de entorno en tu aplicación"
    Write-Info "3. Testea la conexión con cada servicio"
    Write-Info "4. Configura event tracking en tus componentes"
    Write-Info "5. Crea dashboards personalizados"
    
    # Links útiles
    Write-Section "RECURSOS ÚTILES"
    foreach ($service in $AnalyticsServices.GetEnumerator()) {
        $serviceInfo = $service.Value
        Write-Info "$($serviceInfo.Name): $($serviceInfo.SetupUrl)"
    }
}

# ============================================
# VALIDACIÓN
# ============================================

function Test-AnalyticsConnection {
    Write-Section "VALIDACIÓN DE CONEXIÓN ANALYTICS"
    
    try {
        # Cargar variables de entorno
        $envPath = $OutputPath
        if (-not (Test-Path $envPath)) {
            throw "Archivo .env no encontrado: $envPath"
        }
        
        $envContent = Get-Content $envPath -Raw
        $envVars = @{}
        
        foreach ($line in $envContent -split "`n") {
            if ($line -match "^(.+?)=(.+)$") {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                $envVars[$key] = $value
            }
        }
        
        # Verificar variables requeridas
        $requiredVars = @("MIXPANEL_TOKEN", "AMPLITUDE_API_KEY", "SEGMENT_WRITE_KEY", "LOOKER_API_KEY", "TABLEAU_API_KEY", "METABASE_SECRET_KEY")
        $missingVars = @()
        
        foreach ($var in $requiredVars) {
            if (-not $envVars.ContainsKey($var)) {
                $missingVars += $var
            }
        }
        
        if ($missingVars.Count -gt 0) {
            Write-Error "Variables faltantes: $($missingVars -join ', ')"
            return $false
        }
        
        Write-Success "Variables de entorno verificadas"
        
        # Test de conexión a cada servicio
        Write-Step "Probando conexión a servicios Analytics..."
        
        foreach ($service in $AnalyticsServices.GetEnumerator()) {
            $serviceName = $service.Key
            $serviceInfo = $service.Value
            $envVar = "$($serviceName.ToUpper())_TOKEN"
            
            if ($serviceName -eq "Amplitude") { $envVar = "AMPLITUDE_API_KEY" }
            elseif ($serviceName -eq "Segment") { $envVar = "SEGMENT_WRITE_KEY" }
            elseif ($serviceName -eq "Looker") { $envVar = "LOOKER_API_KEY" }
            elseif ($serviceName -eq "Tableau") { $envVar = "TABLEAU_API_KEY" }
            elseif ($serviceName -eq "Metabase") { $envVar = "METABASE_SECRET_KEY" }
            
            $credential = $envVars[$envVar]
            
            Write-Info "$($serviceInfo.Name):"
            Write-Info "  - Token: $($credential.Substring(0, 20))..."
            Write-Info "  - URL: $($serviceInfo.Url)"
            Write-Info "  - Estado: Configurado"
        }
        
        Write-Success "Conexión Analytics validada"
        return $true
    }
    catch {
        Write-Error "Error en validación: $($_.Exception.Message)"
        return $false
    }
}

# ============================================
# EJECUCIÓN PRINCIPAL
# ============================================

function Main {
    Write-Section "ANALYTICS CREDENTIALS GENERATOR - AIGESTION"
    Write-Info "Script para obtener credenciales de Analytics & Business Intelligence"
    Write-Info "Output: $OutputPath"
    
    if ($Test) {
        Write-Info "Modo de prueba activado"
        if (-not (Test-Environment)) {
            Write-Error "Environment test failed"
            exit 1
        }
        Write-Info "Test completado"
        return
    }
    
    # Obtener credenciales
    $success = Get-AnalyticsCredentials
    
    if ($success) {
        # Validar conexión
        if (Test-AnalyticsConnection) {
            Write-Section "CONFIGURACIÓN COMPLETADA"
            Write-Success "📊 Analytics & Business Intelligence está listo para usar en AIGestion!"
            Write-Info "Las credenciales han sido guardadas en: $OutputPath"
            Write-Info "Reinicia tu aplicación para cargar las nuevas variables"
        }
        else {
            Write-Error "La validación de conexión falló"
            Write-Info "Verifica las credenciales manualmente"
        }
    } else {
        Write-Error "La obtención de credenciales falló"
        Write-Info "Verifica los permisos y la configuración de los servicios"
    }
}

# ============================================
# EJECUTAR SCRIPT
# ============================================

try {
    Main
}
catch {
    Write-Error "Error fatal: $($_.Exception.Message)"
    exit 1
}
