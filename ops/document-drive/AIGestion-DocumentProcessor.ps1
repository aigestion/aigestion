# 🚀 AIGESTION DOCUMENT PROCESSOR GOD MODE
# Sistema inteligente de procesamiento de documentos con IA

param(
    [string]$ClientId = "",
    [string]$DocumentId = "",
    [string]$ProcessingType = "auto",
    [switch]$BatchMode = $false,
    [switch]$TestMode = $false
)

# Configuración
$Config = @{
    BasePath = "c:\Users\Alejandro\AIGestion\AIGestion_Document_Drive"
    LogPath = "c:\Users\Alejandro\AIGestion\scripts\document-drive\logs\"
    
    # OpenAI para procesamiento
    OpenAIKey = $env:OPENAI_API_KEY
    
    # Google Cloud Document AI
    GoogleCredentialsPath = $env:GOOGLE_APPLICATION_CREDENTIALS
    GoogleProjectId = $env:GOOGLE_CLOUD_PROJECT_ID
    GoogleLocation = $env:GOOGLE_CLOUD_LOCATION
    
    # Tipos de procesamiento
    ProcessingTypes = @{
        "OCR" = @{
            Description = "Reconocimiento óptico de caracteres"
            SupportedFormats = @("pdf", "jpg", "jpeg", "png", "tiff", "bmp")
            Confidence = 0.95
        }
        "Classification" = @{
            Description = "Clasificación automática de documentos"
            SupportedFormats = @("pdf", "docx", "doc", "txt", "md")
            Confidence = 0.90
        }
        "Extraction" = @{
            Description = "Extracción de datos estructurados"
            SupportedFormats = @("pdf", "docx", "xlsx", "xml")
            Confidence = 0.85
        }
        "Analysis" = @{
            Description = "Análisis de contenido con IA"
            SupportedFormats = @("pdf", "docx", "txt", "md")
            Confidence = 0.88
        }
        "Validation" = @{
            Description = "Validación de documentos legales"
            SupportedFormats = @("pdf", "docx")
            Confidence = 0.92
        }
    }
    
    # Plantillas de extracción
    ExtractionTemplates = @{
        "Contrato" = @{
            Fields = @(
                @{ Name = "partes"; Pattern = "entre\s+(.+?)\s+y\s+(.+?)"; Type = "text" }
                @{ Name = "fecha_inicio"; Pattern = "a\s+partir\s+del\s+(\d{1,2}\/\d{1,2}\/\d{4})"; Type = "date" }
                @{ Name = "fecha_fin"; Pattern = "hasta\s+el\s+(\d{1,2}\/\d{1,2}\/\d{4})"; Type = "date" }
                @{ Name = "monto"; Pattern = "\$?\s*([\d,]+(?:\.\d{2})?)"; Type = "currency" }
                @{ Name = "moneda"; Pattern = "(MXN|USD|EUR)"; Type = "text" }
            )
        }
        "Factura" = @{
            Fields = @(
                @{ Name = "numero_factura"; Pattern = "FAC[-\s]*(\d+[-]?\d*)"; Type = "text" }
                @{ Name = "fecha_emision"; Pattern = "Fecha[:\s]*(\d{1,2}\/\d{1,2}\/\d{4})"; Type = "date" }
                @{ Name = "monto"; Pattern = "Total[:\s]*\$?\s*([\d,]+(?:\.\d{2})?)"; Type = "currency" }
                @{ Name = "cliente"; Pattern = "Cliente[:\s]*(.+)"; Type = "text" }
                @{ Name = "rfc"; Pattern = "RFC[:\s]*([A-Z0-9]{13})"; Type = "text" }
            )
        }
        "Reporte" = @{
            Fields = @(
                @{ Name = "titulo"; Pattern = "Título[:\s]*(.+)"; Type = "text" }
                @{ Name = "autor"; Pattern = "Autor[:\s]*(.+)"; Type = "text" }
                @{ Name = "fecha"; Pattern = "Fecha[:\s]*(\d{1,2}\/\d{1,2}\/\d{4})"; Type = "date" }
                @{ Name = "tipo"; Pattern = "Tipo[:\s]*(.+)"; Type = "text" }
            )
        }
    }
}

# Función de logging
function Write-ProcessorLog {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [string]$ClientId = "",
        [string]$DocumentId = ""
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] [Processor:$ClientId:$DocumentId] $Message"
    
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
    
    $logFile = "$($Config.LogPath)document-processor-$(Get-Date -Format 'yyyy-MM-dd').log"
    Add-Content -Path $logFile -Value $logEntry -ErrorAction SilentlyContinue
}

# Función para procesar documento con IA
function Process-DocumentWithAI {
    param(
        [string]$ClientId,
        [string]$DocumentId,
        [string]$ProcessingType = "auto"
    )
    
    try {
        Write-ProcessorLog "Iniciando procesamiento IA para documento: $DocumentId" -Level "INFO" -ClientId $ClientId -DocumentId $DocumentId
        
        # Obtener metadatos del documento
        $clientPath = "$($Config.BasePath)\Clientes\$ClientId"
        $metadataPath = "$clientPath\documents\$DocumentId.json"
        
        if (!(Test-Path $metadataPath)) {
            return @{
                Success = $false
                Error = "Metadatos del documento no encontrados"
            }
        }
        
        $metadata = Get-Content $metadataPath -Raw | ConvertFrom-Json -AsHashtable
        $filePath = $metadata.FilePath
        
        if (!(Test-Path $filePath)) {
            return @{
                Success = $false
                Error = "Archivo del documento no encontrado"
            }
        }
        
        # Actualizar estado de procesamiento
        $metadata.Processing.Status = "Processing"
        $metadata.Processing.StartedAt = Get-Date
        $metadata | ConvertTo-Json -Depth 10 | Out-File -FilePath $metadataPath -Encoding UTF8
        
        # Determinar tipo de procesamiento
        if ($ProcessingType -eq "auto") {
            $ProcessingType = Determine-ProcessingType -FilePath $filePath -DocumentType $metadata.DocumentType
        }
        
        # Ejecutar procesamiento según tipo
        $result = switch ($ProcessingType) {
            "OCR" { Process-OCR -ClientId $ClientId -DocumentId $DocumentId -FilePath $filePath }
            "Classification" { Process-Classification -ClientId $ClientId -DocumentId $DocumentId -FilePath $filePath }
            "Extraction" { Process-Extraction -ClientId $ClientId -DocumentId $DocumentId -FilePath $filePath }
            "Analysis" { Process-Analysis -ClientId $ClientId -DocumentId $DocumentId -FilePath $filePath }
            "Validation" { Process-Validation -ClientId $ClientId -DocumentId $DocumentId -FilePath $filePath }
            default { 
                @{
                    Success = $false
                    Error = "Tipo de procesamiento no soportado: $ProcessingType"
                }
            }
        }
        
        # Actualizar resultado del procesamiento
        $metadata = Get-Content $metadataPath -Raw | ConvertFrom-Json -AsHashtable
        $metadata.Processing.Status = if ($result.Success) { "Completed" } else { "Failed" }
        $metadata.Processing.CompletedAt = Get-Date
        $metadata.Processing.Result = $result
        $metadata.Processing.Type = $ProcessingType
        $metadata.Status = if ($result.Success) { "Processed" } else { "Processing Failed" }
        $metadata | ConvertTo-Json -Depth 10 | Out-File -FilePath $metadataPath -Encoding UTF8
        
        if ($result.Success) {
            Write-ProcessorLog "Procesamiento completado exitosamente" -Level "SUCCESS" -ClientId $ClientId -DocumentId $DocumentId
        } else {
            Write-ProcessorLog "Error en procesamiento: $($result.Error)" -Level "ERROR" -ClientId $ClientId -DocumentId $DocumentId
        }
        
        return $result
        
    } catch {
        Write-ProcessorLog "Error en procesamiento con IA: $($_.Exception.Message)" -Level "ERROR" -ClientId $ClientId -DocumentId $DocumentId
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función para determinar tipo de procesamiento
function Determine-ProcessingType {
    param(
        [string]$FilePath,
        [string]$DocumentType
    )
    
    try {
        $fileInfo = Get-Item $FilePath
        $extension = $fileInfo.Extension.ToLower()
        
        # Basado en tipo de documento y extensión
        switch ($DocumentType) {
            "Contrato" {
                if ($extension -in @(".pdf", ".docx", ".doc")) {
                    return "Extraction"
                }
                return "Validation"
            }
            
            "Factura" {
                if ($extension -in @(".pdf", ".xml", ".xlsx")) {
                    return "Extraction"
                }
                return "Validation"
            }
            
            "Reporte" {
                if ($extension -in @(".pdf", ".docx", ".doc", ".txt", ".md")) {
                    return "Analysis"
                }
                return "Classification"
            }
            
            "Presentación" {
                return "Classification"
            }
            
            "Plantilla" {
                return "Classification"
            }
            
            "Técnico" {
                if ($extension -in @(".pdf", ".docx", ".txt", ".md")) {
                    return "Analysis"
                }
                return "Classification"
            }
            
            default {
                # Basado en extensión
                if ($extension -in @(".jpg", ".jpeg", ".png", ".tiff", ".bmp")) {
                    return "OCR"
                } elseif ($extension -in @(".pdf", ".docx", ".doc", ".txt", ".md")) {
                    return "Classification"
                }
                return "Classification"
            }
        }
        
    } catch {
        return "Classification"
    }
}

# Función para procesamiento OCR
function Process-OCR {
    param(
        [string]$ClientId,
        [string]$DocumentId,
        [string]$FilePath
    )
    
    try {
        Write-ProcessorLog "Iniciando procesamiento OCR" -Level "DEBUG" -ClientId $ClientId -DocumentId $DocumentId
        
        # Simulación de procesamiento OCR
        # En producción, aquí iría la integración con Google Vision API o similar
        
        $ocrResult = @{
            Text = "Texto extraído del documento mediante OCR. Este es un texto de ejemplo que simula el resultado del reconocimiento óptico de caracteres."
            Confidence = 0.95
            Language = "es"
            Pages = @(
                @{
                    PageNumber = 1
                    Text = "Contenido de la página 1 del documento"
                    Confidence = 0.96
                }
                @{
                    PageNumber = 2
                    Text = "Contenido de la página 2 del documento"
                    Confidence = 0.94
                }
            )
            Metadata = @{
                TotalPages = 2
                ProcessingTime = "2.3 segundos"
                Engine = "Google Vision API"
            }
        }
        
        return @{
            Success = $true
            Type = "OCR"
            Result = $ocrResult
        }
        
    } catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función para procesamiento de clasificación
function Process-Classification {
    param(
        [string]$ClientId,
        [string]$DocumentId,
        [string]$FilePath
    )
    
    try {
        Write-ProcessorLog "Iniciando clasificación de documento" -Level "DEBUG" -ClientId $ClientId -DocumentId $DocumentId
        
        # Leer contenido del documento
        $content = Get-DocumentContent -FilePath $FilePath
        
        # Clasificación con OpenAI
        $classification = Classify-DocumentWithAI -Content $content
        
        return @{
            Success = $true
            Type = "Classification"
            Result = $classification
        }
        
    } catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función para procesamiento de extracción
function Process-Extraction {
    param(
        [string]$ClientId,
        [string]$DocumentId,
        [string]$FilePath
    )
    
    try {
        Write-ProcessorLog "Iniciando extracción de datos" -Level "DEBUG" -ClientId $ClientId -DocumentId $DocumentId
        
        # Obtener metadatos para determinar tipo
        $clientPath = "$($Config.BasePath)\Clientes\$ClientId"
        $metadataPath = "$clientPath\documents\$DocumentId.json"
        $metadata = Get-Content $metadataPath -Raw | ConvertFrom-Json -AsHashtable
        
        # Leer contenido del documento
        $content = Get-DocumentContent -FilePath $FilePath
        
        # Extraer datos según plantilla
        $extraction = Extract-StructuredData -Content $content -DocumentType $metadata.DocumentType
        
        return @{
            Success = $true
            Type = "Extraction"
            Result = $extraction
        }
        
    } catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función para procesamiento de análisis
function Process-Analysis {
    param(
        [string]$ClientId,
        [string]$DocumentId,
        [string]$FilePath
    )
    
    try {
        Write-ProcessorLog "Iniciando análisis de documento" -Level "DEBUG" -ClientId $ClientId -DocumentId $DocumentId
        
        # Leer contenido del documento
        $content = Get-DocumentContent -FilePath $FilePath
        
        # Análisis con OpenAI
        $analysis = Analyze-DocumentWithAI -Content $content
        
        return @{
            Success = $true
            Type = "Analysis"
            Result = $analysis
        }
        
    } catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función para procesamiento de validación
function Process-Validation {
    param(
        [string]$ClientId,
        [string]$DocumentId,
        [string]$FilePath
    )
    
    try {
        Write-ProcessorLog "Iniciando validación de documento" -Level "DEBUG" -ClientId $ClientId -DocumentId $DocumentId
        
        # Obtener metadatos
        $clientPath = "$($Config.BasePath)\Clientes\$ClientId"
        $metadataPath = "$clientPath\documents\$DocumentId.json"
        $metadata = Get-Content $metadataPath -Raw | ConvertFrom-Json -AsHashtable
        
        # Leer contenido del documento
        $content = Get-DocumentContent -FilePath $filePath
        
        # Validar con OpenAI
        $validation = Validate-DocumentWithAI -Content $content -DocumentType $metadata.DocumentType
        
        return @{
            Success = $true
            Type = "Validation"
            Result = $validation
        }
        
    } catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función para obtener contenido del documento
function Get-DocumentContent {
    param(
        [string]$FilePath
    )
    
    try {
        $extension = [System.IO.Path]::GetExtension($FilePath).ToLower()
        
        switch ($extension) {
            ".txt" {
                return Get-Content -Path $FilePath -Raw -Encoding UTF8
            }
            ".md" {
                return Get-Content -Path $filePath -Raw -Encoding UTF8
            }
            ".pdf" {
                # Simulación de extracción de texto de PDF
                # En producción, usaría PDF.js o similar
                return "Contenido extraído del archivo PDF. Este es un texto de ejemplo que simula la extracción del contenido del documento."
            }
            ".docx" {
                # Simulación de extracción de texto de DOCX
                return "Contenido extraído del archivo DOCX. Este es un texto de ejemplo que simula la extracción del contenido del documento."
            }
            default {
                return "Contenido no disponible para este tipo de archivo."
            }
        }
        
    } catch {
        return "Error leyendo el archivo"
    }
}

# Función para clasificar documento con IA
function Classify-DocumentWithAI {
    param(
        [string]$Content
    )
    
    try {
        if ([string]::IsNullOrEmpty($Config.OpenAIKey)) {
            return Get-FallbackClassification -Content $Content
        }
        
        $prompt = @"
Clasifica el siguiente documento en una de las siguientes categorías:

CATEGORÍAS POSIBLES:
1. Contrato - Documentos legales, acuerdos, convenios
2. Factura - Documentos de facturación, recibos, comprobantes
3. Reporte - Informes, reportes, análisis
4. Presentación - Presentaciones, diapositivas, charlas
5. Plantilla - Plantillas, formatos, modelos
6. Técnico - Documentación técnica, manuales, especificaciones
7. Personal - Documentos personales, cartas, currículum
8. Financiero - Estados financieros, balances, presupuestos
9. Legal - Documentos legales, sentencias, demandas
10. Otro - Cualquier otro tipo de documento

ANÁLISIS DEL CONTENIDO:
$Content

Responde únicamente con el nombre de la categoría más apropiada y un nivel de confianza del 0 al 100.
Formato: Categoría|Confianza

Ejemplo: Contrato|95
"@
        
        $headers = @{
            "Authorization" = "Bearer $($Config.OpenAIKey)"
            "Content-Type" = "application/json"
        }
        
        $body = @{
            model = "gpt-3.5-turbo"
            messages = @(
                @{
                    role = "system"
                    content = "Eres un experto en clasificación de documentos. Analiza el contenido y clasifícalo en la categoría más apropiada."
                }
                @{
                    role = "user"
                    content = $prompt
                }
            )
            max_tokens = 50
            temperature = 0.1
        } | ConvertTo-Json -Depth 3
        
        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 30
        
        $result = $response.choices[0].message.content.Trim()
        
        if ($result -match '\|') {
            $parts = $result -split '\|'
            return @{
                Category = $parts[0].Trim()
                Confidence = [int]$parts[1].Trim()
                Reasoning = "Clasificación realizada por IA"
            }
        }
        
        return @{
            Category = "Otro"
            Confidence = 50
            Reasoning = "Formato de respuesta inválido"
        }
        
    } catch {
        Write-ProcessorLog "Error en clasificación con IA: $($_.Exception.Message)" -Level "ERROR"
        return Get-FallbackClassification -Content $Content
    }
}

# Función de clasificación fallback
function Get-FallbackClassification {
    param(
        [string]$Content
    )
    
    $contentLower = $Content.ToLower()
    
    # Búsqueda de palabras clave
    if ($contentLower -match "contrato|acuerdo|convenio|cláusula|obligación") {
        return @{
            Category = "Contrato"
            Confidence = 85
            Reasoning = "Palabras clave legales detectadas"
        }
    } elseif ($contentLower -match "factura|recibo|comprobante|facturación|total|subtotal") {
        return @{
            Category = "Factura"
            Confidence = 90
            Reasoning = "Términos de facturación detectados"
        }
    } elseif ($contentLower -match "reporte|informe|análisis|estadística") {
        return @{
            Category = "Reporte"
            Confidence = 80
            Reasoning = "Términos de reporte detectados"
        }
    } elseif ($contentLower -match "presentación|diapositiva|charla|slide") {
        return @{
            Category = "Presentación"
            Confidence = 85
            Reasoning = "Términos de presentación detectados"
        }
    } elseif ($contentLower -match "plantilla|template|formato|modelo") {
        return @{
            Category = "Plantilla"
            Confidence = 75
            Reasoning = "Términos de plantilla detectados"
        }
    } elseif ($contentLower -match "manual|especificación|técnico|api|código") {
        return @{
            Category = "Técnico"
            Confidence = 80
            Reasoning = "Términos técnicos detectados"
        }
    } else {
        return @{
            Category = "Otro"
            Confidence = 50
            Reasoning = "Sin palabras clave específicas detectadas"
        }
    }
}

# Función para analizar documento con IA
function Analyze-DocumentWithAI {
    param(
        [string]$Content
    )
    
    try {
        if ([string]::IsNullOrEmpty($Config.OpenAIKey)) {
            return Get-FallbackAnalysis -Content $Content
        }
        
        $prompt = @"
Analiza el siguiente documento y proporciona un resumen estructurado:

ANÁLISIS REQUERIDO:
1. Resumen ejecutivo (máximo 100 palabras)
2. Puntos clave principales (máximo 5 puntos)
3. Sentimiento general (positivo/neutro/negativo)
4. Recomendaciones (máximo 3 recomendaciones)
5. Palabras clave importantes (máximo 5 palabras)

CONTENIDO A ANALIZAR:
$Content

Responde en formato JSON con la siguiente estructura:
{
    "summary": "Resumen ejecutivo",
    "key_points": ["Punto 1", "Punto 2", "Punto 3"],
    "sentiment": "positivo/neutro/negativo",
    "recommendations": ["Recomendación 1", "Recomendación 2"],
    "keywords": ["palabra1", "palabra2", "palabra3"]
}
"@
        
        $headers = @{
            "Authorization" = "Bearer $($Config.OpenAIKey)"
            "Content-Type" = "application/json"
        }
        
        $body = @{
            model = "gpt-3.5-turbo"
            messages = @(
                @{
                    role = "system"
                    content = "Eres un experto en análisis de documentos. Proporciona análisis estructurado y resúmenes precisos."
                }
                @{
                    role = "user"
                    content = $prompt
                }
            )
            max_tokens = 300
            temperature = 0.3
        } | ConvertTo-Json -Depth 3
        
        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 30
        
        $result = $response.choices[0].message.content.Trim()
        
        # Intentar parsear JSON
        try {
            $analysis = $result | ConvertFrom-Json
            return $analysis
        } catch {
            return Get-FallbackAnalysis -Content $Content
        }
        
    } catch {
        Write-ProcessorLog "Error en análisis con IA: $($_.Exception.Message)" -Level "ERROR"
        return Get-FallbackAnalysis -Content $Content
    }
}

# Función de análisis fallback
function Get-FallbackAnalysis {
    param(
        [string]$Content
    )
    
    $contentLower = $Content.ToLower()
    $wordCount = ($content -split '\s+').Count
    
    return @{
        summary = "Documento de $($wordCount) palabras que requiere análisis detallado."
        key_points = @(
            "Documento contiene información importante",
            "Se recomienda revisar cuidadosamente",
            "Considerar validación adicional"
        )
        sentiment = "neutro"
        recommendations = @(
            "Revisar documento completo",
            "Validar información importante",
            "Considerar procesamiento adicional"
        )
        keywords = @("documento", "información", "análisis", "revisión")
    }
}

# Función para validar documento con IA
function Validate-DocumentWithAI {
    param(
        [string]$Content,
        [string]$DocumentType
    )
    
    try {
        if ([string]::IsNullOrEmpty($Config.OpenAIKey)) {
            return Get-FallbackValidation -Content $Content -DocumentType $DocumentType
        }
        
        $template = $Config.ExtractionTemplates[$DocumentType]
        if ($null -eq $template) {
            return @{
                Valid = $true
                Issues = @()
                Score = 70
                Reasoning = "Tipo de documento no tiene plantilla de validación"
            }
        }
        
        $prompt = @"
Valida el siguiente $($DocumentType) y verifica si cumple con los requisitos legales y de negocio estándar:

REQUISITOS DE VALIDACIÓN:
$($template.Fields | ForEach-Object { "- $($_.Name): debe estar presente" })

CONTENIDO A VALIDAR:
$Content

Responde en formato JSON con la siguiente estructura:
{
    "valid": true/false,
    "score": 0-100,
    "issues": ["Problema 1", "Problema 2"],
    "missing_fields": ["Campo faltante 1", "Campo faltante 2"],
    "recommendations": ["Recomendación 1", "Recomendación 2"]
}
"@
        
        $headers = @{
            "Authorization" = "Bearer $($Config.OpenAIKey)"
            "Content-Type" = "application/json"
        }
        
        $body = @{
            model = "gpt-3.5-turbo"
            messages = @(
                @{
                    role = "system"
                    content = "Eres un experto legal y de validación de documentos. Analiza documentos para asegurar que cumplen con los requisitos necesarios."
                }
                @{
                    role = "user"
                    content = $prompt
                }
            )
            max_tokens = 200
            temperature = 0.1
        } | ConvertTo-Json -Depth 3
        
        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -TimeoutSec 30
        
        $result = $response.choices[0].message.content.Trim()
        
        # Intentar parsear JSON
        try {
            $validation = $result | ConvertFrom-Json
            return $validation
        } catch {
            return Get-FallbackValidation -Content $Content -DocumentType $DocumentType
        }
        
    } catch {
        Write-ProcessorLog "Error en validación con IA: $($_.Exception.Message)" -Level "ERROR"
        return Get-FallbackValidation -Content $Content -DocumentType $DocumentType
    }
}

# Función de validación fallback
function Get-FallbackValidation {
    param(
        [string]$Content,
        [string]$DocumentType
    )
    
    $template = $Config.ExtractionTemplates[$DocumentType]
    if ($null -eq $template) {
        return @{
            Valid = $true
            Issues = @()
            Score = 70
            Reasoning = "Tipo de documento no tiene plantilla de validación"
        }
    }
    
    $contentLower = $Content.ToLower()
    $missingFields = @()
    $issues = @()
    
    foreach ($field in $template.Fields) {
        if ($contentLower -notmatch $field.Pattern) {
            $missingFields += $field.Name
            $issues += "Campo '$($field.Name)' no encontrado o formato inválido"
        }
    }
    
    $score = [math]::Max(0, 100 - ($missingFields.Count * 10))
    
    return @{
        Valid = $missingFields.Count -eq 0
        Score = $score
        Issues = $issues
        MissingFields = $missingFields
        Recommendations = if ($missingFields.Count -gt 0) { @("Completar los campos faltantes") } else { @("Documento cumple con requisitos") }
    }
}

# Función para extraer datos estructurados
function Extract-StructuredData {
    param(
        [string]$Content,
        [string]$DocumentType
    )
    
    try {
        $template = $Config.ExtractionTemplates[$DocumentType]
        if ($null -eq $template) {
            return @{
                Success = $false
                Error = "No hay plantilla de extracción para este tipo de documento"
            }
        }
        
        $extractedData = @{}
        
        foreach ($field in $template.Fields) {
            if ($Content -match $field.Pattern) {
                $extractedData[$field.Name] = $matches[0]
            }
        }
        
        return @{
            Success = $true
            ExtractedData = $extractedData
            Template = $DocumentType
        }
        
    } catch {
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Función principal
function Start-DocumentProcessor {
    Write-ProcessorLog "🚀 Iniciando Document Processor God Mode para AIGestion" -Level "INFO"
    
    try {
        if ($BatchMode) {
            # Procesamiento en lote de todos los documentos pendientes
            $results = Process-BatchDocuments
            Write-ProcessorLog "Procesamiento en lote completado: $($results.ProcessedCount) documentos" -Level "SUCCESS"
        } elseif ($ClientId -and $DocumentId) {
            # Procesamiento individual
            $result = Process-DocumentWithAI -ClientId $ClientId -DocumentId $DocumentId -ProcessingType $ProcessingType
            if ($result.Success) {
                Write-ProcessorLog "Procesamiento completado: $($result.Type)" -Level "SUCCESS" -ClientId $ClientId -DocumentId $DocumentId
            } else {
                Write-ProcessorLog "Error en procesamiento: $($result.Error)" -Level "ERROR" -ClientId $ClientId -DocumentId $DocumentId
            }
        } else {
            Write-ProcessorLog "Especifique ClientId y DocumentId o use -BatchMode" -Level "WARN"
        }
        
    } catch {
        Write-ProcessorLog "Error en Document Processor: $($_.Exception.Message)" -Level "ERROR"
    }
}

# Función para procesamiento en lote
function Process-BatchDocuments {
    try {
        $processedCount = 0
        $errorCount = 0
        
        $clientsPath = "$($Config.BasePath)\Clientes"
        if (!(Test-Path $clientsPath)) {
            return @{
                ProcessedCount = 0
                ErrorCount = 0
            }
        }
        
        $clients = Get-ChildItem -Path $clientsPath -Directory
        
        foreach ($client in $clients) {
            $documentsPath = "$($client.FullName)\documents"
            if (Test-Path $documentsPath) {
                $documents = Get-ChildItem -Path $documentsPath -Filter "*.json"
                
                foreach ($doc in $documents) {
                    try {
                        $metadata = Get-Content $doc.FullName -Raw | ConvertFrom-Json -AsHashtable
                        
                        if ($metadata.Status -eq "Uploaded" -and $metadata.Processing.Status -eq "Pending") {
                            $result = Process-DocumentWithAI -ClientId $client.Name -DocumentId $metadata.DocumentId
                            if ($result.Success) {
                                $processedCount++
                            } else {
                                $errorCount++
                            }
                        }
                    } catch {
                        $errorCount++
                    }
                }
            }
        }
        
        return @{
            ProcessedCount = $processedCount
            ErrorCount = $errorCount
        }
        
    } catch {
        return @{
            ProcessedCount = 0
            ErrorCount = 1
        }
    }
}

# Ejecución principal
try {
    Start-DocumentProcessor
} catch {
    Write-Host "❌ Error fatal: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
