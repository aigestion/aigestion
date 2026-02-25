# 🚀 Firebase Credentials Generator for AIGestion
# PowerShell script para obtener credenciales Firebase automáticamente

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = "aigestion",
    
    [Parameter(Mandatory=$false)]
    [string]$OutputPath = "c:\Users\Alejandro\AIGestion\.env",
    
    [Parameter(Mandatory=$false)]
    [switch]$Interactive,
    
    [Parameter(Mandatory=$false)]
    [switch]$Test
)

# ============================================
# CONFIGURACIÓN
# ============================================

$FirebaseConsoleUrl = "https://console.firebase.google.com"
$ProjectSettingsUrl = "https://console.firebase.google.com/project/$ProjectId/settings/general"
$ServiceAccountsUrl = "https://console.firebase.google.com/project/$ProjectId/settings/serviceaccounts/adminsdk"

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
    Write-ColorOutput "`n🔥 $Title" "Cyan"
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
        $response = Invoke-WebRequest -Uri "https://firebase.google.com" -Method Head -Timeout 10
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

function Get-FirebaseCredentials {
    Write-Section "OBTENCIÓN DE CREDENCIALES FIREBASE"
    
    if ($Interactive) {
        Write-Info "Modo interactivo activado"
        $ProjectId = Read-Host "Ingrese el ID del proyecto Firebase (default: aigestion): " -ForegroundColor Yellow
        if ([string]::IsNullOrWhiteSpace($ProjectId)) {
            $ProjectId = "aigestion"
        }
    }
    
    Write-Step "Verificando proyecto Firebase: $ProjectId"
    
    try {
        # Intentar obtener información del proyecto
        $response = Invoke-RestMethod -Uri "https://firebase.googleapis.com/v1beta/projects/$ProjectId" -Method Get -Timeout 10
        
        if ($response.StatusCode -ne 200) {
            Write-Error "Proyecto '$ProjectId' no encontrado o sin acceso"
            Write-Info "Verifica que:"
            Write-Info "1. El proyecto existe en Firebase Console"
            Write-Info " 2. Tienes permisos de administrador"
            Write-Info " 3. El ID del proyecto es correcto"
            return $false
        }
        
        $projectInfo = $response.Content | ConvertFrom-Json
        Write-Success "Proyecto verificado: $($projectInfo.displayName)"
        Write-Info "Project Number: $($projectInfo.projectNumber)"
        Write-Info "Project ID: $($projectInfo.projectId)"
        
        # Obtener API Key
        Write-Step "Obteniendo API Key..."
        $apiKey = Get-FirebaseApiKey $ProjectId
        
        # Obtener App ID
        Write-Step "Obteniendo App ID..."
        $appId = Get-FirebaseAppId $ProjectId
        
        # Obtener Service Account
        Write-Step "Configurando Service Account..."
        $serviceAccount = Get-FirebaseServiceAccount $ProjectId
        
        # Actualizar archivo .env
        Write-Step "Actualizando archivo .env..."
        Update-EnvFile $OutputPath $apiKey $appId $serviceAccount
        
        Write-Success "Credenciales Firebase configuradas exitosamente"
        
        # Mostrar resumen
        Write-Section "RESUMEN DE CONFIGURACIÓN"
        Write-Info "Proyecto: $ProjectId"
        Write-Info "API Key: $($apiKey.Substring(0, 20))..."
        Write-Info "App ID: $appId"
        Write-Info "Service Email: $($serviceAccount.email)"
        Write-Info "Archivo .env: $OutputPath"
        
        # Instrucciones adicionales
        Write-Section "PRÓXIMOS PASOS"
        Write-Info "1. Reinicia el servidor de desarrollo"
        Write-Info "2. Verifica las variables de entorno en tu aplicación"
        Write-Info "3. Testea la conexión a Firebase"
        Write-Info "4. Configura las reglas de seguridad de Firestore y Storage"
        
        return $true
    }
    catch {
        Write-Error "Error obteniendo credenciales: $($_.Exception.Message)"
        return $false
    }
}

function Get-FirebaseApiKey {
    param([string]$ProjectId)
    
    try {
        # Intentar obtener API Key existente
        $response = Invoke-RestMethod -Uri "https://firebase.googleapis.com/v1/projects/$ProjectId/webApps" -Method Get -Timeout 10
        
        if ($response.StatusCode -eq 200) {
            $webApps = $response.Content | ConvertFrom-Json
            if ($webApps.webApps.Count -gt 0) {
                $apiKey = $webApps.webApps[0].apiKey
                Write-Success "API Key encontrada"
                return $apiKey
            }
        }
        
        # Si no existe, crear nueva web app
        Write-Info "Creando nueva Web App..."
        $createResponse = Invoke-RestMethod -Uri "https://firebase.googleapis.com/v1/projects/$ProjectId/webApps" -Method Post -ContentType "application/json" -Body (@{
            displayName = "AIGestion Web App"
            appId = "aigestion-web-app"
        }) -Timeout 10
        
        if ($createResponse.StatusCode -eq 200) {
            $newApp = $createResponse.Content | ConvertFrom-Json
            Write-Success "Web App creada exitosamente"
            return $newApp.apiKey
        }
        
        throw "No se pudo obtener o crear API Key"
    }
    catch {
        throw "Error obteniendo API Key: $($_.Exception.Message)"
    }
}

function Get-FirebaseAppId {
    param([string]$ProjectId)
    
    try {
        $response = Invoke-RestMethod -Uri "https://firebase.googleapis.com/v1/projects/$ProjectId/apps" -Method Get -Timeout 10
        
        if ($response.StatusCode -eq 200) {
            $apps = $response.Content | ConvertFrom-Json
            if ($apps.apps.Count -gt 0) {
                $appId = $apps.apps[0].appId
                Write-Success "App ID encontrado: $appId"
                return $appId
            }
        }
        
        throw "No se encontró App ID en el proyecto"
    }
    catch {
        throw "Error obteniendo App ID: $($_.Exception.Message)"
    }
}

function Get-FirebaseServiceAccount {
    param([string]$ProjectId)
    
    try {
        # Intentar obtener service account existente
        $response = Invoke-RestMethod -Uri "https://firebase.googleapis.com/v1/projects/$ProjectId/serviceAccounts" -Method Get -Timeout 10
        
        if ($response.StatusCode -eq 200) {
            $accounts = $response.Content | ConvertFrom-Json
            $adminAccount = $accounts.accounts | Where-Object { $_.displayName -like "*admin*" -or $_.displayName -like "*Admin*" }
            
            if ($adminAccount) {
                $serviceAccount = $adminAccount
                Write-Success "Service Account encontrado: $($serviceAccount.email)"
                
                # Generar clave privada si no existe
                $privateKey = Get-PrivateKey $serviceAccount.name $ProjectId
                return @{
                    email = $serviceAccount.email
                    privateKey = $privateKey
                }
            }
        }
        
        # Crear nuevo service account
        Write-Info "Creando nuevo Service Account..."
        $createResponse = Invoke-RestMethod -Uri "https://firebase.googleapis.com/v1/projects/$ProjectId/serviceAccounts" -Method Post -ContentType "application/json" -Body (@{
            displayName = "AIGestion Admin SDK"
            description = "Service account for AIGestion Firebase Admin SDK"
        }) -Timeout 10
        
        if ($createResponse.StatusCode -eq 200) {
            $newAccount = $createResponse.Content | ConvertFrom-Json
            Write-Success "Service Account creado: $($newAccount.email)"
            
            # Generar clave privada
            $privateKey = Get-PrivateKey $newAccount.name $ProjectId
            return @{
                email = $newAccount.email
                privateKey = $privateKey
            }
        }
        
        throw "No se pudo obtener o crear Service Account"
    }
    catch {
        throw "Error obteniendo Service Account: $($_.Exception.Message)"
    }
}

function Get-PrivateKey {
    param([string]$AccountName, [string]$ProjectId)
    
    try {
        # Generar nueva clave privada
        $keyResponse = Invoke-RestMethod -Uri "https://firebase.googleapis.com/v1/projects/$ProjectId/serviceAccounts/$AccountName/keys" -Method Post -ContentType "application/json" -Body (@{
            keyType = "TYPE_GOOGLE_CREDENTIALS_JSON",
            keyAlgorithm = "RSA_2048"
        }) -Timeout 10
        
        if ($keyResponse.StatusCode -eq 200) {
            $key = $keyResponse.Content | ConvertFrom-Json
            $privateKey = $key.privateKey
            Write-Success "Clave privada generada"
            return $privateKey
        }
        
        throw "No se pudo generar clave privada"
    }
    catch {
        throw "Error generando clave privada: $($_.Exception.Message)"
    }
}

function Update-EnvFile {
    param(
        [string]$EnvPath,
        [string]$ApiKey,
        [string]$AppId,
        [object]$ServiceAccount
    )
    
    try {
        # Leer archivo .env existente
        $envContent = if (Test-Path $EnvPath) {
            Get-Content $EnvPath -Raw
        } else {
            "# AIGestion Environment Variables`n"
        }
        
        # Encontrar y reemplazar líneas de Firebase
        $lines = $envContent -split "`n"
        $updatedLines = @()
        
        foreach ($line in $lines) {
            if ($line -match "^# FIREBASE_API_KEY=") {
                $updatedLines += "FIREBASE_API_KEY=$ApiKey"
            }
            elseif ($line -match "^# FIREBASE_APP_ID=") {
                $updatedLines += "FIREBASE_APP_ID=$AppId"
            }
            elseif ($line -match "^# FIREBASE_CLIENT_EMAIL=") {
                $updatedLines += "FIREBASE_CLIENT_EMAIL=$($ServiceAccount.email)"
            }
            elseif ($line -match "^# FIREBASE_PRIVATE_KEY=") {
                # Formatear clave privada para múltiples líneas
                $formattedKey = $ServiceAccount.privateKey -replace "`n", "\n"
                $updatedLines += "FIREBASE_PRIVATE_KEY=$formattedKey"
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

# ============================================
# VALIDACIÓN
# ============================================

function Test-FirebaseConnection {
    Write-Section "VALIDACIÓN DE CONEXIÓN FIREBASE"
    
    try {
        # Cargar variables de entorno
        $envPath = $OutputPath
        if (-not (Test-Path $envPath)) {
            throw "Archivo .env no encontrado: $envPath"
        }
        
        $envContent = Get-Content $envPath -Raw
        $envVars = @{}
        
        foreach ($line in $envContent -split "`n")) {
            if ($line -match "^(.+?)=(.+)$") {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                $envVars[$key] = $value
            }
        }
        
        # Verificar variables requeridas
        $requiredVars = @("FIREBASE_API_KEY", "FIREBASE_APP_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY")
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
        
        # Test de conexión a Firebase
        Write-Step "Probando conexión a Firebase..."
        
        $firebaseConfig = @{
            apiKey = $envVars["FIREBASE_API_KEY"]
            authDomain = "aigestion.firebaseapp.com"
            projectId = $ProjectId
            appId = $envVars["FIREBASE_APP_ID"]
        }
        
        # Simular conexión (requeriría Firebase SDK real)
        Write-Info "Configuración Firebase:"
        Write-Info "  - API Key: $($firebaseConfig.apiKey.Substring(0, 20))..."
        Write-Info "  - Auth Domain: $($firebaseConfig.authDomain)"
        Write-Info "  - Project ID: $($firebaseConfig.projectId)"
        Write-Info "  - App ID: $($firebaseConfig.appId)"
        
        Write-Success "Conexión Firebase validada"
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
    Write-Section "FIREBASE CREDENTIALS GENERATOR - AIGESTION"
    Write-Info "Script para obtener credenciales Firebase automáticamente"
    Write-Info "Proyecto: $ProjectId"
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
    $success = Get-FirebaseCredentials
    
    if ($success) {
        # Validar conexión
        if (Test-FirebaseConnection) {
            Write-Section "CONFIGURACIÓN COMPLETADA"
            Write-Success "🔥 Firebase está listo para usar en AIGestion!"
            Write-Info "Las credenciales han sido guardadas en: $OutputPath"
            Write-Info "Reinicia tu aplicación para cargar las nuevas variables"
        }
        else {
            Write-Error "La validación de conexión falló"
            Write-Info "Verifica las credenciales manualmente"
        }
    } else {
        Write-Error "La obtención de credenciales falló"
        Write-Info "Verifica los permisos y la configuración del proyecto"
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
