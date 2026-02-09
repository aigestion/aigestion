# God-Level Chrome Launcher for AIGestion
# ---------------------------------------------------
# Launches a dedicated Chrome instance for development.
# Features:
# - Isolated User Data Directory (Clean profile)
# - GPU Rasterization enabled
# - Memory Saver mode exposed
# - Auto-opens Frontend, Swagger, and Github

param(
    [string]$ProfileDir = "$env:USERPROFILE\.gemini\chrome_dev_profile"
)

# 1. Define the URLs to open
$urls = @(
    "http://localhost:3000",                  # Frontend
    "http://localhost:3001/api/docs",         # Backend Swagger (Assuming standard port/route)
    "https://github.com/noepab/aigestion",    # Repository
    "chrome://version"                        # For verifying flags (Optional)
)

# 2. Define Chrome executable path (Standard Windows Install)
$chromePath = "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
}

if (-not (Test-Path $chromePath)) {
    Write-Error "Chrome executable not found in standard locations."
    exit 1
}

# 3. Create Profile Directory if it doesn't exist
if (-not (Test-Path $ProfileDir)) {
    Write-Host "Creating dedicated profile at: $ProfileDir" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $ProfileDir -Force | Out-Null
}

# 4. Launch Chrome with God-Level Flags
# --no-first-run: Skip welcome wizard
# --no-default-browser-check: Stop asking to be default
# --enable-gpu-rasterization: Force GPU usage for UI rendering
# --user-data-dir: The magic sauce for isolation
$argsList = @(
    "--user-data-dir=`"$ProfileDir`"",
    "--no-first-run",
    "--no-default-browser-check",
    "--enable-gpu-rasterization"
) + $urls

Write-Host "Launching Chrome God Mode..." -ForegroundColor Green
Start-Process -FilePath $chromePath -ArgumentList $argsList

Write-Host "✅ Chrome launched in isolated dev profile." -ForegroundColor Green
