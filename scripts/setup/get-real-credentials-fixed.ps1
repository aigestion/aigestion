# 🎯 AIGestion REAL Credentials Setup Guide
# Guía paso a paso para obtener credenciales reales de todos los servicios

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("guide", "check", "help")]
    [string]$Action = "guide",
    
    [Parameter(Mandatory=$false)]
    [string]$Service = "all"
)

# Configuración
$colors = @{
    "title" = "Cyan"
    "success" = "Green"
    "warning" = "Yellow"
    "error" = "Red"
    "info" = "White"
    "highlight" = "Magenta"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Show-Header {
    Clear-Host
    Write-ColorOutput "╔══════════════════════════════════════════════════════════════════════════╗" "title"
    Write-ColorOutput "║                🎯 AIGESTION REAL CREDENTIALS SETUP GUIDE                   ║" "title"
    Write-ColorOutput "║                  Guía para obtener credenciales REALES                   ║" "title"
    Write-ColorOutput "║                      Paso a paso para cada servicio                        ║" "title"
    Write-ColorOutput "╚══════════════════════════════════════════════════════════════════════════╝" "title"
    Write-Host ""
}

function Get-ServiceInstructions {
    param([string]$ServiceName)
    
    $instructions = @{
        "project-management" = @{
            "name" = "Project Management Services"
            "services" = @("Jira", "Asana", "Trello", "Linear", "ClickUp", "Airtable", "Miro", "Zoom")
            "steps" = @(
                "1. Ve a la página oficial de cada servicio",
                "2. Crea cuenta o inicia sesión",
                "3. Ve a Settings/API/Developer",
                "4. Genera API Key o Access Token",
                "5. Copia las credenciales necesarias",
                "6. Actualiza tu archivo .env"
            )
            "urls" = @{
                "Jira" = "https://www.atlassian.com/software/jira"
                "Asana" = "https://asana.com/"
                "Trello" = "https://trello.com/"
                "Linear" = "https://linear.app/"
                "ClickUp" = "https://clickup.com/"
                "Airtable" = "https://airtable.com/"
                "Miro" = "https://miro.com/"
                "Zoom" = "https://zoom.us/"
            }
        }
        
        "meta-platform" = @{
            "name" = "Meta Platform - Facebook Instagram WhatsApp"
            "services" = @("Meta App", "Facebook", "Instagram", "WhatsApp")
            "steps" = @(
                "1. Ve a https://developers.facebook.com/",
                "2. Crea una nueva aplicación",
                "3. Configura los productos necesarios",
                "4. Obtén App ID, App Secret, Access Token",
                "5. Para Facebook: crea página y obtén Page Access Token",
                "6. Para Instagram: convierte a cuenta business",
                "7. Para WhatsApp: configura WhatsApp Business API"
            )
            "urls" = @{
                "Meta Developers" = "https://developers.facebook.com/"
                "Facebook Business" = "https://business.facebook.com/"
                "Instagram Business" = "https://business.instagram.com/"
                "WhatsApp Business" = "https://business.facebook.com/whatsapp"
            }
        }
        
        "finance" = @{
            "name" = "Finance and Payments"
            "services" = @("Revolut", "Payoneer", "Wise", "Coinbase", "Binance")
            "steps" = @(
                "1. Crea cuenta en cada servicio financiero",
                "2. Completa verificación de identidad (KYC)",
                "3. Ve a API/Developer section",
                "4. Solicita acceso a API",
                "5. Genera API Keys",
                "6. Configura webhooks si es necesario"
            )
            "urls" = @{
                "Revolut" = "https://www.revolut.com/business/api"
                "Payoneer" = "https://www.payoneer.com/developers"
                "Wise" = "https://wise.com/help/api-access"
                "Coinbase" = "https://developers.coinbase.com/"
                "Binance" = "https://binance-docs.github.io/apidocs/"
            }
        }
        
        "analytics" = @{
            "name" = "Analytics and Business Intelligence"
            "services" = @("Mixpanel", "Amplitude", "Segment", "Looker", "Tableau", "Metabase")
            "steps" = @(
                "1. Crea cuenta en cada plataforma de analytics",
                "2. Crea un nuevo proyecto/app",
                "3. Ve a Settings/API/Integration",
                "4. Obtén API Keys o tokens",
                "5. Configura tracking si es necesario"
            )
            "urls" = @{
                "Mixpanel" = "https://mixpanel.com/"
                "Amplitude" = "https://amplitude.com/"
                "Segment" = "https://segment.com/"
                "Looker" = "https://looker.com/"
                "Tableau" = "https://www.tableau.com/"
                "Metabase" = "https://www.metabase.com/"
            }
        }
        
        "security" = @{
            "name" = "Security and Compliance"
            "services" = @("Auth0", "Okta", "HashiCorp Vault", "Snyk", "SonarQube")
            "steps" = @(
                "1. Crea cuenta en cada servicio de seguridad",
                "2. Configura tu organización",
                "3. Ve a Developer/API section",
                "4. Obtén credenciales de API",
                "5. Configura integraciones necesarias"
            )
            "urls" = @{
                "Auth0" = "https://auth0.com/"
                "Okta" = "https://www.okta.com/developer/"
                "HashiCorp Vault" = "https://www.vaultproject.io/"
                "Snyk" = "https://snyk.io/"
                "SonarQube" = "https://www.sonarqube.org/"
            }
        }
        
        "communication" = @{
            "name" = "Email and Communication"
            "services" = @("SendGrid", "Mailchimp", "Postmark", "Intercom", "Zendesk", "Freshdesk")
            "steps" = @(
                "1. Crea cuenta en cada servicio de comunicación",
                "2. Verifica tu dominio/email",
                "3. Ve a API/Developer section",
                "4. Genera API Keys",
                "5. Configura sending domains si es necesario"
            )
            "urls" = @{
                "SendGrid" = "https://sendgrid.com/"
                "Mailchimp" = "https://mailchimp.com/developer/"
                "Postmark" = "https://postmarkapp.com/developer/"
                "Intercom" = "https://www.intercom.com/"
                "Zendesk" = "https://developer.zendesk.com/"
                "Freshdesk" = "https://developers.freshdesk.com/"
            }
        }
        
        "cloud" = @{
            "name" = "Cloud Storage and CDN"
            "services" = @("AWS S3", "Cloudflare", "Fastly", "Bunny CDN", "Backblaze")
            "steps" = @(
                "1. Crea cuenta en cada servicio cloud",
                "2. Configura tu bucket/zona",
                "3. Ve a IAM/Security/API",
                "4. Genera access keys",
                "5. Configura permisos necesarios"
            )
            "urls" = @{
                "AWS S3" = "https://aws.amazon.com/s3/"
                "Cloudflare" = "https://www.cloudflare.com/"
                "Fastly" = "https://www.fastly.com/"
                "Bunny CDN" = "https://bunny.net/"
                "Backblaze" = "https://www.backblaze.com/"
            }
        }
        
        "ai-ml" = @{
            "name" = "AI and Machine Learning"
            "services" = @("OpenAI", "Replicate", "Cohere", "Stability AI", "Midjourney")
            "steps" = @(
                "1. Crea cuenta en cada servicio de IA",
                "2. Añade método de pago",
                "3. Ve a API/Developer section",
                "4. Obtén API Keys",
                "5. Revisa límites de uso y costos"
            )
            "urls" = @{
                "OpenAI" = "https://platform.openai.com/"
                "Replicate" = "https://replicate.com/"
                "Cohere" = "https://cohere.com/"
                "Stability AI" = "https://stability.ai/"
                "Midjourney" = "https://docs.midjourney.com/"
            }
        }
    }
    
    return $instructions[$ServiceName]
}

function Show-ServiceGuide {
    param([string]$ServiceName)
    
    $serviceInfo = Get-ServiceInstructions -ServiceName $ServiceName
    
    if (-not $serviceInfo) {
        Write-ColorOutput "❌ Servicio '$ServiceName' no encontrado" "error"
        return
    }
    
    Write-Host ""
    Write-ColorOutput "📋 $($serviceInfo.name)" "highlight"
    Write-ColorOutput "════════════════════════════════════════════════════════════════════════════" "highlight"
    Write-Host ""
    
    Write-ColorOutput "🌐 Servicios incluidos:" "info"
    foreach ($svc in $serviceInfo.services) {
        Write-Host "   • $svc"
    }
    Write-Host ""
    
    Write-ColorOutput "📝 Pasos a seguir:" "info"
    foreach ($step in $serviceInfo.steps) {
        Write-Host "   $step"
    }
    Write-Host ""
    
    Write-ColorOutput "🔗 URLs importantes:" "info"
    foreach ($url in $serviceInfo.urls.GetEnumerator()) {
        Write-Host "   $($url.Key): $($url.Value)"
    }
    Write-Host ""
    
    Write-ColorOutput "💡 Tips adicionales:" "warning"
    Write-Host "   • Guarda tus credenciales en un lugar seguro"
    Write-Host "   • Usa variables de entorno en producción"
    Write-Host "   • Revisa los límites de uso de cada API"
    Write-Host "   • Configura webhooks para notificaciones"
    Write-Host "   • Mantén tus credenciales actualizadas"
    Write-Host ""
}

function Check-RealCredentials {
    Write-ColorOutput "🔍 Verificando credenciales reales en .env..." "info"
    Write-Host ""
    
    $envPath = ".env"
    if (-not (Test-Path $envPath)) {
        Write-ColorOutput "❌ Archivo .env no encontrado" "error"
        return
    }
    
    $envContent = Get-Content -Path $envPath
    $realCredentials = @()
    $demoCredentials = @()
    
    foreach ($line in $envContent) {
        if ($line -match "^([^=]+)=(.+)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            
            if ($value -match "god_mode|demo|test|placeholder|REPLACE_ME|example") {
                $demoCredentials += $key
            } elseif ($value -ne "" -and $value -notmatch "^#") {
                $realCredentials += $key
            }
        }
    }
    
    Write-ColorOutput "📊 Estado de credenciales:" "highlight"
    Write-Host ""
    Write-ColorOutput "✅ Credenciales reales configuradas: $($realCredentials.Count)" "success"
    Write-ColorOutput "⚠️  Credenciales de demo/prueba: $($demoCredentials.Count)" "warning"
    Write-Host ""
    
    if ($demoCredentials.Count -gt 0) {
        Write-ColorOutput "🔄 Necesitas configurar estas credenciales:" "warning"
        foreach ($cred in $demoCredentials) {
            Write-Host "   • $cred"
        }
        Write-Host ""
        Write-ColorOutput "💡 Ejecuta: .\get-real-credentials-fixed.ps1 -Action guide -Service <servicio>" "info"
    } else {
        Write-ColorOutput "🎉 ¡Todas las credenciales parecen ser reales!" "success"
    }
    
    if ($realCredentials.Count -gt 0) {
        Write-Host ""
        Write-ColorOutput "✅ Credenciales reales encontradas:" "success"
        foreach ($cred in $realCredentials) {
            Write-Host "   • $cred"
        }
    }
}

function Show-Help {
    Write-Host ""
    Write-ColorOutput "📖 AYUDA - Real Credentials Setup Guide" "title"
    Write-ColorOutput "════════════════════════════════════════════════════════════════════════════" "title"
    Write-Host ""
    Write-ColorOutput "🎯 MODOS DE USO:" "highlight"
    Write-Host ""
    Write-ColorOutput "1. Guía completa:" "info"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action guide"
    Write-Host ""
    Write-ColorOutput "2. Guía por servicio específico:" "info"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action guide -Service project-management"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action guide -Service meta-platform"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action guide -Service finance"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action guide -Service analytics"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action guide -Service security"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action guide -Service communication"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action guide -Service cloud"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action guide -Service ai-ml"
    Write-Host ""
    Write-ColorOutput "3. Verificar credenciales actuales:" "info"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action check"
    Write-Host ""
    Write-ColorOutput "4. Ayuda:" "info"
    Write-Host "   .\get-real-credentials-fixed.ps1 -Action help"
    Write-Host ""
    Write-ColorOutput "📋 SERVICIOS DISPONIBLES:" "highlight"
    Write-Host "   • project-management - Jira, Asana, Trello, Linear, ClickUp, Airtable, Miro, Zoom"
    Write-Host "   • meta-platform - Facebook, Instagram, WhatsApp"
    Write-Host "   • finance - Revolut, Payoneer, Wise, Coinbase, Binance"
    Write-Host "   • analytics - Mixpanel, Amplitude, Segment, Looker, Tableau, Metabase"
    Write-Host "   • security - Auth0, Okta, HashiCorp Vault, Snyk, SonarQube"
    Write-Host "   • communication - SendGrid, Mailchimp, Postmark, Intercom, Zendesk, Freshdesk"
    Write-Host "   • cloud - AWS S3, Cloudflare, Fastly, Bunny CDN, Backblaze"
    Write-Host "   • ai-ml - OpenAI, Replicate, Cohere, Stability AI, Midjourney"
    Write-Host ""
    Write-ColorOutput "💡 RECOMENDACIÓN:" "warning"
    Write-Host "   1. Empieza con los servicios que necesitas urgentemente"
    Write-Host "   2. Configura las credenciales una por una"
    Write-Host "   3. Usa el modo 'check' para verificar tu progreso"
    Write-Host "   4. Guarda tus credenciales en un gestor de contraseñas"
    Write-Host "   5. Nunca compartas tu archivo .env con otros"
    Write-Host ""
}

# Main execution
function Main {
    Show-Header
    
    switch ($Action) {
        "guide" {
            if ($Service -eq "all") {
                Write-ColorOutput "📚 GUIA COMPLETA DE TODOS LOS SERVICIOS" "title"
                Write-Host ""
                Write-ColorOutput "Selecciona el servicio que quieres configurar:" "info"
                Write-Host "   project-management - Gestión de proyectos"
                Write-Host "   meta-platform - Redes sociales de Meta"
                Write-Host "   finance - Finanzas y pagos"
                Write-Host "   analytics - Análisis y business intelligence"
                Write-Host "   security - Seguridad y cumplimiento"
                Write-Host "   communication - Email y comunicación"
                Write-Host "   cloud - Almacenamiento y CDN"
                Write-Host "   ai-ml - Inteligencia artificial"
                Write-Host ""
                Write-ColorOutput "Ejemplo:" "warning"
                Write-Host "   .\get-real-credentials-fixed.ps1 -Action guide -Service project-management"
            } else {
                Show-ServiceGuide -ServiceName $Service
            }
        }
        
        "check" {
            Check-RealCredentials
        }
        
        "help" {
            Show-Help
        }
        
        default {
            Show-Help
        }
    }
}

# Execute main function
Main
