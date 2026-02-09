# 🚀 CHROME AIGESTION - OPTIMIZACIÓN NIVEL DIOS
# Script PowerShell para configurar Chrome desarrollo extremo

Write-Host "🔥 INICIANDO CONFIGURACIÓN CHROME NIVEL DIOS PARA AIGESTION" -ForegroundColor Cyan

# 1. CERRAR CHROME COMPLETAMENTE
Write-Host "🛑 Cerrando Chrome completamente..." -ForegroundColor Yellow
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
Stop-Process -Name msedge -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# 2. RUTAS DE CHROME
$chromePath = "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe"
$chromeUserData = "${env:LOCALAPPDATA}\Google\Chrome\User Data"
$aigestionProfile = "$chromeUserData\AIGestion-Dev"

# 3. CREAR PERFIL DEDICADO AIGESTION
Write-Host "📁 Creando perfil dedicado AIGestion..." -ForegroundColor Green
if (!(Test-Path $aigestionProfile)) {
    New-Item -ItemType Directory -Path $aigestionProfile -Force
}

# 4. FLAGS DE RENDIMIENTO EXTREMO
$chromeArgs = @(
    "--profile-directory=AIGestion-Dev",
    "--user-data-dir=`"$chromeUserData`"",
    "--no-first-run",
    "--disable-background-mode",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-features=TranslateUI,BlinkGenPropertyTrees",
    "--disable-ipc-flooding-protection",
    "--max-active-webgl-contexts=16",
    "--enable-gpu-rasterization",
    "--enable-zero-copy",
    "--ignore-gpu-blacklist",
    "--enable-hardware-overlays",
    "--enable-features=VaapiVideoDecoder",
    "--disable-extensions-except=",
    "--disable-extensions-file-access-check",
    "--enable-automation",
    "--disable-web-security",
    "--disable-features=VizDisplayCompositor",
    "--enable-unsafe-swiftshader",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-software-rasterizer",
    "--enable-accelerated-2d-canvas",
    "--enable-accelerated-video-decode",
    "--enable-accelerated-jpeg-decoding",
    "--enable-native-gpu-memory-buffers",
    "--enable-oop-rasterization",
    "--enable-quic",
    "--enable-features=NetworkService",
    "--enable-features=NetworkServiceInProcess",
    "--disable-features=AudioServiceOutOfProcess",
    "--aggressive-cache-discard",
    "--enable-aggressive-domstorage-flushing",
    "--enable-features=CanvasOopRasterization",
    "--enable-features=UseSkiaRenderer",
    "--disable-logging",
    "--silent-debugger-extension-api",
    "--enable-automation"
)

# 5. CONFIGURACIÓN DE MEMORIA Y CACHE
Write-Host "⚡ Optimizando memoria y cache..." -ForegroundColor Yellow
$chromeArgs += @(
    "--memory-pressure-off",
    "--max_old_space_size=4096",
    "--optimize-for-size",
    "--enable-low-end-device-mode",
    "--enable-low-res-tiling",
    "--disable-partial-raster",
    "--enable-surface-synchronization",
    "--enable-per-tile-painting",
    "--disable-skia-runtime-opts"
)

# 6. NETWORK OPTIMIZATION
Write-Host "🌐 Optimizando red..." -ForegroundColor Blue
$chromeArgs += @(
    "--enable-features=NetworkService,NetworkServiceInProcess",
    "--enable-quic",
    "--host-resolver-rules=MAP * 0.0.0.0",
    "--disable-features=NetworkPrediction",
    "--force-fieldtrials=*BackgroundTracing/default/",
    "--disable-background-networking",
    "--disable-sync",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-component-extensions-with-background-pages"
)

# 7. AIGESTION SPECIFIC CONFIG
Write-Host "🎯 Configuración específica AIGestion..." -ForegroundColor Magenta
$chromeArgs += @(
    "--disable-web-security",
    "--allow-running-insecure-content",
    "--disable-features=VizDisplayCompositor",
    "--enable-features=UseSkiaRenderer,CanvasOopRasterization",
    "--disable-ipc-flooding-protection",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blacklist",
    "--ignore-certificate-errors",
    "--allow-insecure-localhost",
    "--disable-features=IsolateOrigins,site-per-process"
)

# 8. INICIAR CHROME CON CONFIGURACIÓN
Write-Host "🚀 Iniciando Chrome optimizado para AIGestion..." -ForegroundColor Green
Start-Process -FilePath $chromePath -ArgumentList $chromeArgs -WindowStyle Maximized

# 9. ESPERAR Y ABRIR SITIOS AIGESTION
Start-Sleep -Seconds 5
Write-Host "🌐 Abriendo sitios AIGestion..." -ForegroundColor Cyan

$sites = @(
    "https://aigestion.net",
    "https://admin.aigestion.net", 
    "https://client.aigestion.net",
    "https://demo.aigestion.net",
    "http://localhost:3000",
    "http://localhost:5173"
)

foreach ($site in $sites) {
    Start-Process $chromePath -ArgumentList "--profile-directory=AIGestion-Dev", $site
    Start-Sleep -Seconds 1
}

# 10. CONFIGURACIÓN DE EXTENSIONS ESENCIALES
Write-Host "🔧 Instalando extensions esenciales..." -ForegroundColor Yellow
$extensions = @(
    "fmkadmapgofadopljbjfkapdkoienihi", # React Developer Tools
    "lmhkpmbekcpmknklioeibfkpmmfibljd", # Redux DevTools
    "nhdogjmejiglipccpnnnanhbledajbpd", # Vue.js devtools
    "gighmmpiobklfepjocnamgkkbiglidom", # React Perf
    "hnmpcagpplmpfojmgmnngilcnanddlhb", # Wappalyzer
    "padekgcemlokbadohgkifijomclgjgif", # Postman
    "fimkadakjafbnjdkbklmklbfoocfnpnb", # JSON Viewer
    "bfbmjmiodbnnljcfcfjloiibkifhgkeo", # ColorZilla
    "jboaghagokjngndnnemdjbmfnkaegdog", # Window Resizer
    "cfhdojbkjhnklbpkdaibdccddilifddb"  # Adblock Plus
)

foreach ($ext in $extensions) {
    Start-Process $chromePath -ArgumentList "--profile-directory=AIGestion-Dev", "chrome://extensions/?id=$ext"
}

Write-Host "✅ CHROME AIGESTION NIVEL DIOS CONFIGURADO" -ForegroundColor Green
Write-Host "🎯 Perfil: AIGestion-Dev" -ForegroundColor Cyan
Write-Host "⚡ Rendimiento: Máximo" -ForegroundColor Yellow
Write-Host "🌐 Red: Optimizada" -ForegroundColor Blue
Write-Host "🔥 Listo para desarrollo extremo!" -ForegroundColor Magenta
