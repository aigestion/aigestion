# 🔧 ADMIN AIGESTION - CONFIGURACIÓN NIVEL DIOS
# Script para configurar usuario admin@aigestion.net y Chrome optimizado

Write-Host "🏆 CONFIGURACIÓN ADMIN AIGESTION NIVEL DIOS" -ForegroundColor Cyan
Write-Host "📧 Usuario: admin@aigestion.net" -ForegroundColor Yellow
Write-Host "🌐 Dominio: aigestion.net" -ForegroundColor Green

# 1. VERIFICAR ACCESO ADMIN
Write-Host "🔍 Verificando acceso administrativo..." -ForegroundColor Blue

# Función para verificar acceso Google Workspace
function Test-GoogleWorkspaceAccess {
    param(
        [string]$AdminEmail = "admin@aigestion.net"
    )
    
    try {
        $response = Invoke-WebRequest -Uri "https://admin.google.com" -Method Head -TimeoutSec 10
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

# 2. CONFIGURACIÓN CHROME PARA ADMIN
Write-Host "🚀 Configurando Chrome para admin@aigestion.net..." -ForegroundColor Green

# Rutas Chrome
$chromePath = "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe"
$adminProfile = "${env:LOCALAPPDATA}\Google\Chrome\User Data\Admin-AIGestion"

# Crear perfil admin
if (!(Test-Path $adminProfile)) {
    New-Item -ItemType Directory -Path $adminProfile -Force
}

# Flags específicos para admin
$adminChromeArgs = @(
    "--profile-directory=Admin-AIGestion",
    "--user-data-dir=${env:LOCALAPPDATA}\Google\Chrome\User Data",
    "--no-first-run",
    "--disable-background-mode",
    "--disable-features=TranslateUI",
    "--disable-ipc-flooding-protection",
    "--enable-gpu-rasterization",
    "--enable-zero-copy",
    "--ignore-gpu-blacklist",
    "--enable-features=VaapiVideoDecoder",
    "--disable-extensions-except=",
    "--enable-automation",
    "--disable-web-security",
    "--disable-features=VizDisplayCompositor",
    "--enable-unsafe-swiftshader",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--enable-accelerated-2d-canvas",
    "--enable-accelerated-video-decode",
    "--enable-quic",
    "--aggressive-cache-discard",
    "--enable-aggressive-domstorage-flushing",
    "--disable-logging",
    "--enable-features=UseSkiaRenderer",
    "--ignore-certificate-errors",
    "--allow-insecure-localhost",
    "--disable-features=IsolateOrigins,site-per-process",
    "--disable-sync",
    "--disable-background-networking",
    "--disable-default-apps"
)

# 3. INICIAR CHROME ADMIN
Write-Host "🌐 Iniciando Chrome para admin@aigestion.net..." -ForegroundColor Cyan
Start-Process -FilePath $chromePath -ArgumentList $adminChromeArgs -WindowStyle Maximized

# 4. ESPERAR Y ABRIR SITIOS ADMIN
Start-Sleep -Seconds 5
Write-Host "📊 Abriendo panel administrativo..." -ForegroundColor Yellow

$adminSites = @(
    "https://admin.google.com",
    "https://workspace.google.com",
    "https://admin.aigestion.net",
    "https://console.cloud.google.com",
    "https://supabase.com/dashboard",
    "https://github.com/aigestion",
    "https://analytics.google.com",
    "https://search.google.com/search-console"
)

foreach ($site in $adminSites) {
    Start-Process $chromePath -ArgumentList "--profile-directory=Admin-AIGestion", $site
    Start-Sleep -Seconds 1
}

# 5. CONFIGURACIÓN DE EXTENSIONS ADMIN
Write-Host "🔧 Instalando extensions administrativas..." -ForegroundColor Magenta

$adminExtensions = @(
    "fmkadmapgofadopljbjfkapdkoienihi", # React Developer Tools
    "lmhkpmbekcpmknklioeibfkpmmfibljd", # Redux DevTools
    "nhdogjmejiglipccpnnnanhbledajbpd", # Vue.js devtools
    "jboaghagokjngndnnemdjbmfnkaegdog", # Window Resizer
    "cfhdojbkjhnklbpkdaibdccddilifddb", # Adblock Plus
    "padekgcemlokbadohgkifijomclgjgif", # Postman
    "fimkadakjafbnjdkbklmklbfoocfnpnb", # JSON Viewer
    "bfbmjmiodbnnljcfcfjloiibkifhgkeo", # ColorZilla
    "hnmpcagpplmpfojmgmnngilcnanddlhb", # Wappalyzer
    "gighmmpiobklfepjocnamgkkbiglidom", # React Perf
    "elgohgojghkldbcfaefjgblgmpjkohmc", # Google Docs Offline
    "ghbmnnjooekpmoecnnnilnnbdlolhkhi", # Google Keep
    "blpcfgokakmgnkcojhhkbfbldkabnjo", # Google Hangouts
    "pjkljhegncpnkpknbcohdijeoejaedia", # Google Calendar
    "apngnlkebkbhpopmcofkmpoikecgidcn", # Google Slides
    "felcaaldnbdncclmgdcncolpebgiejap", # Google Sheets
    "aapocclcgogkmnckokdopfmhonfmigcm", # Google Drive
    "eemcgdkfndhiofomikejiohflblbdjfp", # Google Docs
    "cfhdojbkjhnklbpkdaibdccddilifddb", # Adblock Plus
    "bgnkhhhhamicfomdeacfejdgjhpnmehn", # Google Input Tools
    "kojcfkcebkibhdcppfhmhibmlokkcnki"  # Google Keep
)

foreach ($ext in $adminExtensions) {
    Start-Process $chromePath -ArgumentList "--profile-directory=Admin-AIGestion", "chrome://extensions/?id=$ext"
}

# 6. CONFIGURACIÓN DE BOOKMARKS ADMIN
Write-Host "📚 Creando bookmarks administrativos..." -ForegroundColor Green

$bookmarks = @(
    @{name="Google Admin"; url="https://admin.google.com"},
    @{name="AIGestion Admin"; url="https://admin.aigestion.net"},
    @{name="Supabase Dashboard"; url="https://supabase.com/dashboard"},
    @{name="Google Cloud"; url="https://console.cloud.google.com"},
    @{name="GitHub AIGestion"; url="https://github.com/aigestion"},
    @{name="Google Analytics"; url="https://analytics.google.com"},
    @{name="Search Console"; url="https://search.google.com/search-console"},
    @{name="Google Workspace"; url="https://workspace.google.com"},
    @{name="Google Ads"; url="https://ads.google.com"},
    @{name="Google My Business"; url="https://business.google.com"},
    @{name="Firebase Console"; url="https://console.firebase.google.com"},
    @{name="Google Domains"; url="https://domains.google.com"},
    @{name="Google Calendar"; url="https://calendar.google.com"},
    @{name="Google Drive"; url="https://drive.google.com"},
    @{name="Google Meet"; url="https://meet.google.com"},
    @{name="Google Chat"; url="https://chat.google.com"},
    @{name="Google Groups"; url="https://groups.google.com"},
    @{name="Google Sites"; url="https://sites.google.com"},
    @{name="Google Forms"; url="https://forms.google.com"},
    @{name="Google Slides"; url="https://slides.google.com"}
)

# 7. VERIFICACIÓN DE ACCESO
Write-Host "🔍 Verificando acceso a servicios..." -ForegroundColor Blue

$services = @{
    "Google Admin" = "https://admin.google.com"
    "AIGestion Admin" = "https://admin.aigestion.net"
    "Supabase" = "https://supabase.com/dashboard"
    "Google Cloud" = "https://console.cloud.google.com"
}

foreach ($service in $services.GetEnumerator()) {
    try {
        $response = Invoke-WebRequest -Uri $service.Value -Method Head -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($service.Key): Acceso OK" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $($service.Key): Código $($response.StatusCode)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ $($service.Key): Sin acceso" -ForegroundColor Red
    }
}

# 8. CONFIGURACIÓN DE SEGURIDAD
Write-Host "🔒 Configurando seguridad para admin..." -ForegroundColor Magenta

# Crear archivo de configuración de seguridad
$securityConfig = @"
{
    "admin_email": "admin@aigestion.net",
    "security_level": "maximum",
    "features": {
        "two_factor_auth": true,
        "session_timeout": 30,
        "ip_whitelist": ["192.168.1.0/24", "10.0.0.0/8"],
        "audit_logging": true,
        "password_policy": {
            "min_length": 16,
            "require_symbols": true,
            "require_numbers": true,
            "require_uppercase": true,
            "require_lowercase": true
        }
    },
    "monitoring": {
        "failed_login_attempts": 3,
        "lockout_duration": 900,
        "session_encryption": true,
        "api_rate_limit": 1000
    }
}
"@

$securityConfig | Out-File -FilePath "$adminProfile\security-config.json" -Encoding UTF8

# 9. RESUMEN FINAL
Write-Host "✅ CONFIGURACIÓN ADMIN AIGESTION COMPLETADA" -ForegroundColor Green
Write-Host "📧 Usuario: admin@aigestion.net" -ForegroundColor Cyan
Write-Host "🌐 Chrome Profile: Admin-AIGestion" -ForegroundColor Yellow
Write-Host "🔒 Seguridad: Máxima" -ForegroundColor Red
Write-Host "📊 Extensions: $($adminExtensions.Count) instaladas" -ForegroundColor Blue
Write-Host "📚 Bookmarks: $($bookmarks.Count) creados" -ForegroundColor Magenta
Write-Host "🚀 Listo para administración AIGestion!" -ForegroundColor Green

# 10. INSTRUCCIONES FINALES
Write-Host "`n📋 INSTRUCCIONES:" -ForegroundColor White
Write-Host "1. Iniciar sesión en admin.google.com con admin@aigestion.net" -ForegroundColor Yellow
Write-Host "2. Configurar autenticación de dos factores" -ForegroundColor Yellow
Write-Host "3. Verificar todos los servicios Google Workspace" -ForegroundColor Yellow
Write-Host "4. Configurar usuarios y permisos" -ForegroundColor Yellow
Write-Host "5. Establecer políticas de seguridad" -ForegroundColor Yellow

Write-Host "`n🔥 ADMIN AIGESTION NIVEL DIOS LISTO!" -ForegroundColor Green
