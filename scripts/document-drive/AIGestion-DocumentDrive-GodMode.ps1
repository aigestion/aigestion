# 🚀 AIGESTION DOCUMENT DRIVE GOD MODE
# Sistema profesional de gestión de documentos compartidos nivel dios

param(
    [string]$ClientId = "",
    [string]$Action = "create",
    [string]$DocumentType = "",
    [string]$FilePath = "",
    [switch]$Interactive = $false,
    [switch]$TestMode = $false,
    [switch]$BatchMode = $false
)

# Configuración
$Config = @{
    BasePath = "c:\Users\Alejandro\AIGestion\AIGestion_Document_Drive"
    LogPath = "c:\Users\Alejandro\AIGestion\scripts\document-drive\logs\"
    TemplatesPath = "c:\Users\Alejandro\AIGestion\scripts\document-drive\templates\"
    
    # Google Drive API
    GoogleCredentialsPath = $env:GOOGLE_APPLICATION_CREDENTIALS
    GoogleServiceAccountJson = $env:GOOGLE_SERVICE_ACCOUNT_JSON
    GoogleDriveFolderId = $env:GOOGLE_DRIVE_FOLDER_ID
    
    # Supabase Storage
    SupabaseUrl = $env:SUPABASE_URL
    SupabaseKey = $env:SUPABASE_ANON_KEY
    SupabaseServiceKey = $env:SUPABASE_SERVICE_ROLE_KEY
    
    # OpenAI para procesamiento de documentos
    OpenAIKey = $env:OPENAI_API_KEY
    
    # Configuración de carpetas estándar
    StandardFolders = @(
        "01_Entrada_Documentos",
        "02_En_Proceso", 
        "03_Completado",
        "04_Revision",
        "05_Archivado",
        "06_Plantillas",
        "07_Contratos",
        "08_Facturas",
        "09_Reportes",
        "10_Presentaciones",
        "11_Recursos_Gráficos",
        "12_Videos_Multimedia",
        "13_Documentación_Técnica",
        "14_Certificados",
        "15_Backups"
    )
    
    # Tipos de documentos soportados
    DocumentTypes = @{
        "Contrato" = @{
            Extensions = @(".pdf", ".docx", ".doc")
            RequiredFields = @("cliente", "fecha_inicio", "fecha_fin", "monto")
            AutoProcess = $true
            RetentionDays = 2555  # 7 años
        }
        "Factura" = @{
            Extensions = @(".pdf", ".xml", ".xlsx")
            RequiredFields = @("numero_factura", "fecha_emision", "monto", "cliente")
            AutoProcess = $true
            RetentionDays = 1825  # 5 años
        }
        "Reporte" = @{
            Extensions = @(".pdf", ".xlsx", ".docx", ".pptx")
            RequiredFields = @("titulo", "fecha", "autor", "tipo")
            AutoProcess = $false
            RetentionDays = 1095  # 3 años
        }
        "Presentación" = @{
            Extensions = @(".pptx", ".pdf", ".key")
            RequiredFields = @("titulo", "autor", "fecha", "audiencia")
            AutoProcess = $false
            RetentionDays = 730   # 2 años
        }
        "Plantilla" = @{
            Extensions = @(".docx", ".xlsx", ".pptx", ".pdf")
            RequiredFields = @("nombre", "tipo", "version", "departamento")
            AutoProcess = $false
            RetentionDays = -1    # permanente
        }
        "Técnico" = @{
            Extensions = @(".pdf", ".docx", ".md", ".txt")
            RequiredFields = @("proyecto", "autor", "fecha", "tipo")
            AutoProcess = $true
            RetentionDays = 1825  # 5 años
        }
    }
    
    # Límites y cuotas
    ClientLimits = @{
        StorageGB = 10
        MaxFileSizeMB = 100
        MaxDocuments = 1000
        MaxVersions = 5
        AllowedExtensions = @(".pdf", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt", ".txt", ".md", ".jpg", ".jpeg", ".png", ".gif", ".zip", ".rar")
    }
}

# Crear directorios necesarios
$directories = @($Config.BasePath, $Config.LogPath, $Config.TemplatesPath)
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
}

# Función de logging
function Write-DocumentLog {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [string]$ClientId = ""
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] [DocDrive:$ClientId] $Message"
    
    Write-Host $logEntry -ForegroundColor $(
        switch ($Level) {
            "ERROR" { "Red" }
            "WARN" { "Yellow" }
            "INFO" { "Green" }
            "DEBUG" { "Cyan" }
            "SUCCESS" { "Magenta" }
            default { "White" }
        }
    )
    
    $logFile = "$($Config.LogPath)document-drive-$(Get-Date -Format 'yyyy-MM-dd').log"
    Add-Content -Path $logFile -Value $logEntry -ErrorAction SilentlyContinue
}

# Función para crear estructura de carpetas para cliente
function New-ClientFolderStructure {
    param(
        [string]$ClientId,
        [string]$ClientName,
        [string]$ClientEmail = ""
    )
    
    try {
        Write-DocumentLog "Creando estructura de carpetas para cliente: $ClientName" -Level "INFO" -ClientId $ClientId
        
        $clientBasePath = "$($Config.BasePath)\Clientes\$ClientId"
        
        # Crear carpeta principal del cliente
        if (!(Test-Path $clientBasePath)) {
            New-Item -ItemType Directory -Path $clientBasePath -Force
        }
        
        # Crear carpetas estándar
        foreach ($folder in $Config.StandardFolders) {
            $folderPath = "$clientBasePath\$folder"
            if (!(Test-Path $folderPath)) {
                New-Item -ItemType Directory -Path $folderPath -Force
                Write-DocumentLog "Creada carpeta: $folder" -Level "DEBUG" -ClientId $ClientId
            }
        }
        
        # Crear carpetas específicas por tipo de documento
        foreach ($docType in $Config.DocumentTypes.Keys) {
            $typeFolder = "15_$($docType.ToLower())"
            $typePath = "$clientBasePath\$typeFolder"
            if (!(Test-Path $typePath)) {
                New-Item -ItemType Directory -Path $typePath -Force
                Write-DocumentLog "Creada carpeta de tipo: $docType" -Level "DEBUG" -ClientId $ClientId
            }
        }
        
        # Crear archivo de configuración del cliente
        $clientConfig = @{
            ClientId = $ClientId
            ClientName = $ClientName
            ClientEmail = $ClientEmail
            CreatedAt = Get-Date
            FolderStructure = $Config.StandardFolders
            DocumentTypes = $Config.DocumentTypes.Keys
            StorageUsed = 0
            DocumentCount = 0
            LastActivity = Get-Date
            Status = "Active"
            Quota = $Config.ClientLimits
        }
        
        $configPath = "$clientBasePath\client-config.json"
        $clientConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath $configPath -Encoding UTF8
        
        Write-DocumentLog "Estructura de carpetas creada exitosamente para $ClientName" -Level "SUCCESS" -ClientId $ClientId
        
        return @{
            Success = $true
            ClientPath = $clientBasePath
            ConfigPath = $configPath
        }
        
    } catch {
        Write-DocumentLog "Error creando estructura de carpetas: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientId
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función para procesar documento subido
function Process-UploadedDocument {
    param(
        [string]$ClientId,
        [string]$FilePath,
        [string]$DocumentType,
        [hashtable]$Metadata = @{}
    )
    
    try {
        Write-DocumentLog "Procesando documento: $FilePath" -Level "INFO" -ClientId $ClientId
        
        # Validar archivo
        $validation = Validate-DocumentFile -FilePath $FilePath -ClientId $ClientId
        if (!$validation.Valid) {
            return @{
                Success = $false
                Error = $validation.Error
            }
        }
        
        # Determinar tipo de documento si no se especificó
        if ([string]::IsNullOrEmpty($DocumentType)) {
            $DocumentType = Detect-DocumentType -FilePath $FilePath
        }
        
        # Validar tipo de documento
        if (!$Config.DocumentTypes.ContainsKey($DocumentType)) {
            return @{
                Success = $false
                Error = "Tipo de documento no soportado: $DocumentType"
            }
        }
        
        # Generar ID único para el documento
        $documentId = "DOC-$($ClientId)-$(Get-Date -Format 'yyyyMMdd-HHmmss')-$(Get-Random -Maximum 9999)"
        
        # Crear metadatos del documento
        $fileInfo = Get-Item $FilePath
        $documentMetadata = @{
            DocumentId = $documentId
            ClientId = $ClientId
            DocumentType = $DocumentType
            OriginalName = $fileInfo.Name
            FileName = "$documentId$($fileInfo.Extension)"
            FilePath = $FilePath
            FileSize = $fileInfo.Length
            MimeType = Get-MimeType -FilePath $FilePath
            UploadedAt = Get-Date
            UploadedBy = "System"
            Status = "Uploaded"
            Version = 1
            Tags = @()
            Metadata = $Metadata
            Processing = @{
                Status = "Pending"
                StartedAt = $null
                CompletedAt = $null
                Result = $null
                Error = $null
            }
        }
        
        # Mover archivo a carpeta de entrada
        $clientPath = "$($Config.BasePath)\Clientes\$ClientId"
        $entryFolder = "$clientPath\01_Entrada_Documentos"
        $destinationPath = "$entryFolder\$($documentMetadata.FileName)"
        
        if (!(Test-Path $entryFolder)) {
            New-Item -ItemType Directory -Path $entryFolder -Force
        }
        
        Move-Item -Path $FilePath -Destination $destinationPath -Force
        $documentMetadata.FilePath = $destinationPath
        
        # Guardar metadatos
        $metadataPath = "$clientPath\documents\$documentId.json"
        $documentMetadata | ConvertTo-Json -Depth 10 | Out-File -FilePath $metadataPath -Encoding UTF8
        
        # Iniciar procesamiento automático si aplica
        if ($Config.DocumentTypes[$DocumentType].AutoProcess) {
            Start-DocumentProcessing -DocumentId $documentId -ClientId $ClientId
        }
        
        # Actualizar estadísticas del cliente
        Update-ClientStatistics -ClientId $ClientId -Operation "upload" -FileSize $fileInfo.Length
        
        Write-DocumentLog "Documento procesado exitosamente: $documentId" -Level "SUCCESS" -ClientId $ClientId
        
        return @{
            Success = $true
            DocumentId = $documentId
            DocumentType = $DocumentType
            Metadata = $documentMetadata
        }
        
    } catch {
        Write-DocumentLog "Error procesando documento: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientId
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función para validar archivo de documento
function Validate-DocumentFile {
    param(
        [string]$FilePath,
        [string]$ClientId
    )
    
    try {
        if (!(Test-Path $FilePath)) {
            return @{
                Valid = $false
                Error = "Archivo no encontrado: $FilePath"
            }
        }
        
        $fileInfo = Get-Item $FilePath
        
        # Validar tamaño
        $maxSizeBytes = $Config.ClientLimits.MaxFileSizeMB * 1024 * 1024
        if ($fileInfo.Length -gt $maxSizeBytes) {
            return @{
                Valid = $false
                Error = "Archivo demasiado grande. Máximo permitido: $($Config.ClientLimits.MaxFileSizeMB)MB"
            }
        }
        
        # Validar extensión
        $extension = $fileInfo.Extension.ToLower()
        if ($extension -notin $Config.ClientLimits.AllowedExtensions) {
            return @{
                Valid = $false
                Error = "Tipo de archivo no permitido: $extension"
            }
        }
        
        # Validar cuota del cliente
        $clientStats = Get-ClientStatistics -ClientId $ClientId
        if ($clientStats.StorageUsed + $fileInfo.Length -gt ($Config.ClientLimits.StorageGB * 1024 * 1024 * 1024)) {
            return @{
                Valid = $false
                Error = "Cuota de almacenamiento excedida"
            }
        }
        
        if ($clientStats.DocumentCount -ge $Config.ClientLimits.MaxDocuments) {
            return @{
                Valid = $false
                Error = "Límite de documentos alcanzado"
            }
        }
        
        return @{
            Valid = $true
            FileSize = $fileInfo.Length
            Extension = $extension
        }
        
    } catch {
        return @{
            Valid = $false
            Error = "Error validando archivo: $($_.Exception.Message)"
        }
    }
}

# Función para detectar tipo de documento
function Detect-DocumentType {
    param(
        [string]$FilePath
    )
    
    try {
        $fileInfo = Get-Item $FilePath
        $fileName = $fileInfo.Name.ToLower()
        $extension = $fileInfo.Extension.ToLower()
        
        # Detección por nombre de archivo
        if ($fileName -match "contrato|agreement|convenio") {
            return "Contrato"
        } elseif ($fileName -match "factura|invoice|recibo|receipt") {
            return "Factura"
        } elseif ($fileName -match "reporte|report|informe") {
            return "Reporte"
        } elseif ($fileName -match "presentacion|presentation|ppt") {
            return "Presentación"
        } elseif ($fileName -match "plantilla|template") {
            return "Plantilla"
        } elseif ($fileName -match "manual|tecnico|spec|specification") {
            return "Técnico"
        }
        
        # Detección por extensión
        if ($extension -in @(".pdf", ".docx", ".doc")) {
            # Por defecto, los PDF y Word son Contratos a menos que se indique lo contrario
            return "Contrato"
        } elseif ($extension -in @(".xlsx", ".xls")) {
            return "Reporte"
        } elseif ($extension -in @(".pptx", ".ppt")) {
            return "Presentación"
        } elseif ($extension -in @(".txt", ".md")) {
            return "Técnico"
        }
        
        return "Reporte"  # Tipo por defecto
        
    } catch {
        return "Reporte"
    }
}

# Función para obtener MIME type
function Get-MimeType {
    param(
        [string]$FilePath
    )
    
    $extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
    
    $mimeTypes = @{
        ".pdf" = "application/pdf"
        ".doc" = "application/msword"
        ".docx" = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ".xls" = "application/vnd.ms-excel"
        ".xlsx" = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ".ppt" = "application/vnd.ms-powerpoint"
        ".pptx" = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ".txt" = "text/plain"
        ".md" = "text/markdown"
        ".jpg" = "image/jpeg"
        ".jpeg" = "image/jpeg"
        ".png" = "image/png"
        ".gif" = "image/gif"
        ".zip" = "application/zip"
        ".rar" = "application/x-rar-compressed"
    }
    
    return $mimeTypes[$extension] ?? "application/octet-stream"
}

# Función para iniciar procesamiento de documento
function Start-DocumentProcessing {
    param(
        [string]$DocumentId,
        [string]$ClientId
    )
    
    try {
        Write-DocumentLog "Iniciando procesamiento de documento: $DocumentId" -Level "INFO" -ClientId $ClientId
        
        # Actualizar estado de procesamiento
        $clientPath = "$($Config.BasePath)\Clientes\$ClientId"
        $metadataPath = "$clientPath\documents\$DocumentId.json"
        
        if (Test-Path $metadataPath) {
            $metadata = Get-Content $metadataPath -Raw | ConvertFrom-Json -AsHashtable
            $metadata.Processing.Status = "Processing"
            $metadata.Processing.StartedAt = Get-Date
            $metadata | ConvertTo-Json -Depth 10 | Out-File -FilePath $metadataPath -Encoding UTF8
        }
        
        # Aquí iría el procesamiento real con IA
        # Por ahora, simulamos el procesamiento
        Start-Sleep -Seconds 2
        
        # Simular resultado del procesamiento
        $processingResult = @{
            Status = "Completed"
            Confidence = 0.95
            ExtractedData = @{
                Title = "Título extraído del documento"
                Date = Get-Date
                Type = "Contrato"
                Parties = @("Parte A", "Parte B")
                Amount = 10000
                Currency = "MXN"
            }
            Summary = "Documento procesado exitosamente con IA"
        }
        
        # Actualizar resultado del procesamiento
        if (Test-Path $metadataPath) {
            $metadata = Get-Content $metadataPath -Raw | ConvertFrom-Json -AsHashtable
            $metadata.Processing.Status = "Completed"
            $metadata.Processing.CompletedAt = Get-Date
            $metadata.Processing.Result = $processingResult
            $metadata.Status = "Processed"
            $metadata | ConvertTo-Json -Depth 10 | Out-File -FilePath $metadataPath -Encoding UTF8
        }
        
        # Mover a carpeta de completado
        $entryPath = "$clientPath\01_Entrada_Documentos\$($metadata.FileName)"
        $completedPath = "$clientPath\03_Completado\$($metadata.FileName)"
        if (Test-Path $entryPath) {
            Move-Item -Path $entryPath -Destination $completedPath -Force
        }
        
        Write-DocumentLog "Procesamiento completado para documento: $DocumentId" -Level "SUCCESS" -ClientId $ClientId
        
        return @{
            Success = $true
            Result = $processingResult
        }
        
    } catch {
        Write-DocumentLog "Error en procesamiento de documento: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientId
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función para obtener estadísticas del cliente
function Get-ClientStatistics {
    param(
        [string]$ClientId
    )
    
    try {
        $clientPath = "$($Config.BasePath)\Clientes\$ClientId"
        $configPath = "$clientPath\client-config.json"
        
        if (!(Test-Path $configPath)) {
            return @{
                StorageUsed = 0
                DocumentCount = 0
                LastActivity = $null
                Status = "Not Found"
            }
        }
        
        $config = Get-Content $configPath -Raw | ConvertFrom-Json -AsHashtable
        
        # Calcular almacenamiento usado
        $storageUsed = 0
        $documentCount = 0
        
        $documentsPath = "$clientPath\documents"
        if (Test-Path $documentsPath) {
            $documents = Get-ChildItem -Path $documentsPath -Filter "*.json"
            $documentCount = $documents.Count
            
            foreach ($doc in $documents) {
                $docMetadata = Get-Content $doc.FullName -Raw | ConvertFrom-Json -AsHashtable
                $storageUsed += $docMetadata.FileSize
            }
        }
        
        return @{
            StorageUsed = $storageUsed
            DocumentCount = $documentCount
            LastActivity = $config.LastActivity
            Status = $config.Status
            Quota = $config.Quota
        }
        
    } catch {
        return @{
            StorageUsed = 0
            DocumentCount = 0
            LastActivity = $null
            Status = "Error"
        }
    }
}

# Función para actualizar estadísticas del cliente
function Update-ClientStatistics {
    param(
        [string]$ClientId,
        [string]$Operation,
        [long]$FileSize = 0
    )
    
    try {
        $clientPath = "$($Config.BasePath)\Clientes\$ClientId"
        $configPath = "$clientPath\client-config.json"
        
        if (Test-Path $configPath) {
            $config = Get-Content $configPath -Raw | ConvertFrom-Json -AsHashtable
            
            switch ($Operation) {
                "upload" {
                    $config.StorageUsed += $FileSize
                    $config.DocumentCount++
                }
                "delete" {
                    $config.StorageUsed = [Math]::Max(0, $config.StorageUsed - $FileSize)
                    $config.DocumentCount = [Math]::Max(0, $config.DocumentCount - 1)
                }
            }
            
            $config.LastActivity = Get-Date
            $config | ConvertTo-Json -Depth 10 | Out-File -FilePath $configPath -Encoding UTF8
        }
        
    } catch {
        Write-DocumentLog "Error actualizando estadísticas: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientId
    }
}

# Función para generar reporte de cliente
function New-ClientReport {
    param(
        [string]$ClientId
    )
    
    try {
        Write-DocumentLog "Generando reporte para cliente: $ClientId" -Level "INFO" -ClientId $ClientId
        
        $clientStats = Get-ClientStatistics -ClientId $ClientId
        $clientPath = "$($Config.BasePath)\Clientes\$ClientId"
        $configPath = "$clientPath\client-config.json"
        
        if (!(Test-Path $configPath)) {
            return @{
                Success = $false
                Error = "Cliente no encontrado"
            }
        }
        
        $config = Get-Content $configPath -Raw | ConvertFrom-Json -AsHashtable
        
        # Generar reporte HTML
        $report = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Documentos - $($config.ClientName)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; font-size: 24px; }
        .metric p { margin: 0; font-size: 16px; }
        .document-list { margin-top: 30px; }
        .document-item { background: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Reporte de Documentos</h1>
            <h2>$($config.ClientName)</h2>
            <p>Generado: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')</p>
        </div>
        
        <div class="metrics">
            <div class="metric">
                <h3>$($clientStats.DocumentCount)</h3>
                <p>Total Documentos</p>
            </div>
            <div class="metric">
                <h3>$([math]::Round($clientStats.StorageUsed / 1MB, 2)) MB</h3>
                <p>Almacenamiento Usado</p>
            </div>
            <div class="metric">
                <h3>$([math]::Round(($clientStats.StorageUsed / ($config.Quota.StorageGB * 1024)) * 100, 1))%</h3>
                <p>Cuota Utilizada</p>
            </div>
            <div class="metric">
                <h3>$($clientStats.Status)</h3>
                <p>Estado del Cliente</p>
            </div>
        </div>
        
        <div class="document-list">
            <h3>📁 Estructura de Carpetas</h3>
"@
        
        foreach ($folder in $config.FolderStructure) {
            $folderPath = "$clientPath\$folder"
            if (Test-Path $folderPath) {
                $fileCount = (Get-ChildItem -Path $folderPath -File).Count
                $report += @"
            <div class="document-item">
                <strong>$folder</strong> - $fileCount archivos
            </div>
"@
            }
        }
        
        $report += @"
        </div>
        
        <div class="footer">
            <p>Generado por AIGestion Document Drive God Mode</p>
        </div>
    </div>
</body>
</html>
"@
        
        # Guardar reporte
        $reportPath = "$clientPath\report-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').html"
        $report | Out-File -FilePath $reportPath -Encoding UTF8
        
        Write-DocumentLog "Reporte generado: $reportPath" -Level "SUCCESS" -ClientId $ClientId
        
        return @{
            Success = $true
            ReportPath = $reportPath
        }
        
    } catch {
        Write-DocumentLog "Error generando reporte: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientId
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función para modo interactivo
function Start-InteractiveMode {
    Write-Host "🚀 MODO INTERACTIVO - DOCUMENT DRIVE GOD MODE AIGESTION" -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Cyan
    
    Write-Host "`n📁 ¿Qué deseas hacer?" -ForegroundColor Magenta
    Write-Host "1. Crear nuevo cliente" -ForegroundColor White
    Write-Host "2. Subir documento" -ForegroundColor White
    Write-Host "3. Ver estadísticas de cliente" -ForegroundColor White
    Write-Host "4. Generar reporte de cliente" -ForegroundColor White
    Write-Host "5. Listar todos los clientes" -ForegroundColor White
    Write-Host "0. Salir" -ForegroundColor White
    
    $choice = Read-Host "`nSelecciona una opción (0-5)"
    
    switch ($choice) {
        "1" {
            $clientName = Read-Host "👤 Nombre del cliente"
            $clientEmail = Read-Host "📧 Email del cliente (opcional)"
            $clientId = "CLI-" + (Get-Date -Format "yyyyMMdd-HHmmss") + "-" + (Get-Random -Maximum 9999)
            
            $result = New-ClientFolderStructure -ClientId $clientId -ClientName $clientName -ClientEmail $clientEmail
            
            if ($result.Success) {
                Write-Host "✅ Cliente creado exitosamente" -ForegroundColor Green
                Write-Host "📁 ID: $clientId" -ForegroundColor White
                Write-Host "📂 Ruta: $($result.ClientPath)" -ForegroundColor Cyan
            } else {
                Write-Host "❌ Error creando cliente: $($result.Error)" -ForegroundColor Red
            }
        }
        
        "2" {
            $clientId = Read-Host "📋 ID del cliente"
            $filePath = Read-Host "📄 Ruta del archivo a subir"
            $documentType = Read-Host "📄 Tipo de documento (opcional)"
            
            if (!(Test-Path $filePath)) {
                Write-Host "❌ Archivo no encontrado: $filePath" -ForegroundColor Red
                return
            }
            
            $result = Process-UploadedDocument -ClientId $clientId -FilePath $filePath -DocumentType $documentType
            
            if ($result.Success) {
                Write-Host "✅ Documento procesado exitosamente" -ForegroundColor Green
                Write-Host "📄 ID: $($result.DocumentId)" -ForegroundColor White
                Write-Host "📋 Tipo: $($result.DocumentType)" -ForegroundColor Cyan
            } else {
                Write-Host "❌ Error procesando documento: $($result.Error)" -ForegroundColor Red
            }
        }
        
        "3" {
            $clientId = Read-Host "📋 ID del cliente"
            $stats = Get-ClientStatistics -ClientId $clientId
            
            Write-Host "`n📊 Estadísticas del Cliente:" -ForegroundColor Magenta
            Write-Host "Documentos: $($stats.DocumentCount)" -ForegroundColor White
            Write-Host "Almacenamiento: $([math]::Round($stats.StorageUsed / 1MB, 2)) MB" -ForegroundColor White
            Write-Host "Estado: $($stats.Status)" -ForegroundColor White
            Write-Host "Última actividad: $($stats.LastActivity)" -ForegroundColor Gray
        }
        
        "4" {
            $clientId = Read-Host "📋 ID del cliente"
            $result = New-ClientReport -ClientId $clientId
            
            if ($result.Success) {
                Write-Host "✅ Reporte generado: $($result.ReportPath)" -ForegroundColor Green
                Write-Host "🌐 Abriendo reporte en navegador..." -ForegroundColor Cyan
                Start-Process $result.ReportPath
            } else {
                Write-Host "❌ Error generando reporte: $($result.Error)" -ForegroundColor Red
            }
        }
        
        "5" {
            Write-Host "`n📋 Lista de Clientes:" -ForegroundColor Yellow
            $clientsPath = "$($Config.BasePath)\Clientes"
            
            if (Test-Path $clientsPath) {
                $clients = Get-ChildItem -Path $clientsPath -Directory
                foreach ($client in $clients) {
                    $configPath = "$($client.FullName)\client-config.json"
                    if (Test-Path $configPath) {
                        $config = Get-Content $configPath -Raw | ConvertFrom-Json -AsHashtable
                        Write-Host "• $($client.Name) - $($config.ClientName) ($($config.Status))" -ForegroundColor White
                    }
                }
            } else {
                Write-Host "No hay clientes registrados" -ForegroundColor Gray
            }
        }
        
        "0" {
            Write-Host "👋 Saliendo del modo interactivo" -ForegroundColor Green
        }
        
        default {
            Write-Host "❌ Opción no válida" -ForegroundColor Red
        }
    }
}

# Función principal
function Start-DocumentDrive {
    Write-DocumentLog "🚀 Iniciando Document Drive God Mode para AIGestion" -Level "INFO"
    
    try {
        switch ($Action) {
            "create" {
                if ($Interactive) {
                    Start-InteractiveMode
                } elseif ($ClientId) {
                    $result = New-ClientFolderStructure -ClientId $ClientId -ClientName "Cliente Temporal"
                    if ($result.Success) {
                        Write-DocumentLog "Cliente creado: $ClientId" -Level "SUCCESS" -ClientId $ClientId
                    }
                }
            }
            
            "upload" {
                if ($Interactive) {
                    Start-InteractiveMode
                } elseif ($ClientId -and $FilePath) {
                    $result = Process-UploadedDocument -ClientId $ClientId -FilePath $FilePath -DocumentType $DocumentType
                    if ($result.Success) {
                        Write-DocumentLog "Documento subido: $($result.DocumentId)" -Level "SUCCESS" -ClientId $ClientId
                    }
                }
            }
            
            "report" {
                if ($Interactive) {
                    Start-InteractiveMode
                } elseif ($ClientId) {
                    $result = New-ClientReport -ClientId $ClientId
                    if ($result.Success) {
                        Write-DocumentLog "Reporte generado: $($result.ReportPath)" -Level "SUCCESS" -ClientId $ClientId
                    }
                }
            }
            
            default {
                Write-DocumentLog "Acción no reconocida: $Action" -Level "WARN"
            }
        }
        
    } catch {
        Write-DocumentLog "Error en Document Drive God Mode: $($_.Exception.Message)" -Level "ERROR"
    }
}

# Ejecución principal
try {
    Start-DocumentDrive
} catch {
    Write-Host "❌ Error fatal: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
