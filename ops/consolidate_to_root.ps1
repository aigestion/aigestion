Write-Host "🚀 Consolidating existing builds to ROOT and /docs..."

# Setup folders
if (-not (Test-Path "docs")) { New-Item -ItemType Directory -Path "docs" }
$folders = @(".", "docs")

foreach ($root in $folders) {
    Write-Host "Processing $root..."

    # 1. Main Website
    if (Test-Path "frontend/apps/website-epic/dist") {
        Copy-Item -Recurse -Force "frontend/apps/website-epic/dist/*" "$root/"
    }

    # 2. Admin Dashboard
    if (Test-Path "frontend/apps/admindashboard/dist") {
        if (-not (Test-Path "$root/admin")) { New-Item -ItemType Directory -Path "$root/admin" }
        Copy-Item -Recurse -Force "frontend/apps/admindashboard/dist/*" "$root/admin/"
    }

    # 3. Client Dashboard
    if (Test-Path "frontend/apps/clientdashboard/dist") {
        if (-not (Test-Path "$root/client")) { New-Item -ItemType Directory -Path "$root/client" }
        Copy-Item -Recurse -Force "frontend/apps/clientdashboard/dist/*" "$root/client/"
    }

    # 4. Demo Dashboard
    if (Test-Path "frontend/apps/demodashboard/dist") {
        if (-not (Test-Path "$root/demo")) { New-Item -ItemType Directory -Path "$root/demo" }
        Copy-Item -Recurse -Force "frontend/apps/demodashboard/dist/*" "$root/demo/"
    }

    # Config files
    Set-Content -Path "$root/CNAME" -Value "www.aigestion.net"
    if (-not (Test-Path "$root/.nojekyll")) { New-Item -ItemType File -Path "$root/.nojekyll" -Force }
}

Write-Host "✅ All apps consolidated in root and /docs"
