param(
    [string]$Target = "all" # all, backend, frontend
)

# Nexus Sovereign Cloud Deployment Script v3.1 - Inclusion Staging
$PROJECT_ID = "aigestion-sovereign-2026"
$REGION = "europe-west1"
$BACKEND_IMAGE = "gcr.io/$PROJECT_ID/nexus-backend:latest"
$FRONTEND_IMAGE = "gcr.io/$PROJECT_ID/nexus-frontend:latest"
$BACKEND_URL = "https://backend-aigestion-1046057023064.europe-west1.run.app"
$STAGING_BASE = "$env:TEMP\nexus-staging-sovereign"

function Clear-Staging {
  param($Path)
  if (Test-Path $Path) { Remove-Item $Path -Recurse -Force -ErrorAction SilentlyContinue }
  New-Item -ItemType Directory -Path $Path -Force | Out-Null
}

function New-Context {
  param($Type)
  $StagingPath = Join-Path $STAGING_BASE $Type
  Clear-Staging $StagingPath

  Write-Host "Creating $Type context (Inclusion-Only)..." -ForegroundColor Gray

  # 1. Copy Root Configs to CONTEXT ROOT
  $rootPatterns = @("package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml", "turbo.json", "tsconfig*.json", ".npmrc")
  foreach ($pattern in $rootPatterns) {
    $files = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
    foreach ($file in $files) {
      Copy-Item $file.FullName -Destination $StagingPath -Force
    }
  }

  # 2. Copy Target Components (Whitelisted Folders & Files)
  if ($Type -eq "backend") {
    $src = (Resolve-Path "backend").Path
    $dest = Join-Path $StagingPath "backend"
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
    $whitelist = @("src", "certs", "scripts", "prisma")
    foreach ($folder in $whitelist) {
      if (Test-Path "$src\$folder") {
        robocopy "$src\$folder" "$dest\$folder" /E /XJ /NFL /NDL /NJH /NJS /R:0 /W:0 | Out-Null
      }
    }
    # Individual files in root of backend
    Get-ChildItem -Path "$src\*" -File | ForEach-Object { Copy-Item $_.FullName -Destination $dest -Force }
  }
  elseif ($Type -eq "frontend") {
    $src = (Resolve-Path "frontend").Path
    $dest = Join-Path $StagingPath "frontend"
    New-Item -ItemType Directory -Path $dest -Force | Out-Null

    # Copy frontend root package.json
    if (Test-Path "$src\package.json") { Copy-Item "$src\package.json" -Destination $dest -Force }

    # Whitelist for app source
    $appWhitelist = @("src", "public", "scripts")
    $appsToInclude = @("website-epic", "client-dashboard")

    foreach ($app in $appsToInclude) {
      $appSrc = Join-Path $src "apps\$app"
      $appDest = Join-Path $dest "apps\$app"
      if (Test-Path $appSrc) {
        New-Item -ItemType Directory -Path $appDest -Force | Out-Null
        foreach ($folder in $appWhitelist) {
          if (Test-Path "$appSrc\$folder") {
            robocopy "$appSrc\$folder" "$appDest\$folder" /E /XJ /NFL /NDL /NJH /NJS /R:0 /W:0 | Out-Null
          }
        }
        # Individual files in app root (package.json, nginx.conf, vite.config.ts, etc.)
        Get-ChildItem -Path "$appSrc\*" -File | ForEach-Object { Copy-Item $_.FullName -Destination $appDest -Force }
      }
    }
  }

  # 3. Copy Shared Packages (Whitelisted Only)
  $pkgDest = Join-Path $StagingPath "packages"
  New-Item -ItemType Directory -Path $pkgDest -Force | Out-Null
  $pkgIncludes = @("nexus-shared", "design-system-v2", "eslint-config")
  foreach ($pkg in $pkgIncludes) {
    if (Test-Path "packages\$pkg") {
      $srcDir = (Resolve-Path "packages\$pkg").Path
      $destPkg = Join-Path $pkgDest $pkg
      New-Item -ItemType Directory -Path $destPkg -Force | Out-Null

      # Copy folders if they exist
      $foldersToCopy = @("src", "configs", "lib")
      foreach ($f in $foldersToCopy) {
        if (Test-Path "$srcDir\$f") {
          robocopy "$srcDir\$f" "$destPkg\$f" /E /XJ /NFL /NDL /NJH /NJS /R:0 /W:0 | Out-Null
        }
      }

      # IMPORTANT: Always copy manifests and configs in the root of the package
      Get-ChildItem -Path "$srcDir\*" -File | ForEach-Object { Copy-Item $_.FullName -Destination $destPkg -Force }
    }
  }

  $size = (Get-ChildItem $StagingPath -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
  if ($size -gt 300) {
    Write-Error "CRITICAL: Context size ($([math]::Round($size, 2)) MB) exceeds 300MB limit. Aborting to prevent hang."
    exit 1
  }
  Write-Host "Staging creation complete for $Type ($([math]::Round($size, 2)) MB)." -ForegroundColor Green
  return $StagingPath
}

Write-Host "🚀 Starting Sovereign Cloud Deployment v3.1..." -ForegroundColor Cyan
gcloud config set project $PROJECT_ID

# --- BACKEND ---
if ($Target -eq "all" -or $Target -eq "backend") {
    $backendStaging = New-Context "backend"
    $cbBackend = @(
      "steps:",
      "  - name: 'gcr.io/cloud-builders/docker'",
      "    args: ['build', '--network=cloudbuild', '-t', '$BACKEND_IMAGE', '-f', 'backend/Dockerfile', '.']",
      "images:",
      "  - '$BACKEND_IMAGE'",
      "options:",
      "  machineType: 'E2_HIGHCPU_8'"
    )
    $cbBackend | Set-Content (Join-Path $backendStaging "cloudbuild.yaml")

    Write-Host "☁️ Submitting Backend to Cloud Build..." -ForegroundColor Cyan
    gcloud builds submit $backendStaging --config (Join-Path $backendStaging "cloudbuild.yaml")
    if ($LASTEXITCODE -ne 0) { Write-Error "Backend build failed"; exit 1 }
}

# --- FRONTEND ---
if ($Target -eq "all" -or $Target -eq "frontend") {
    $frontendStaging = New-Context "frontend"
    $cbFrontend = @(
      "steps:",
      "  - name: 'gcr.io/cloud-builders/docker'",
      "    args: ['build', '--network=cloudbuild', '-t', '$FRONTEND_IMAGE', '-f', 'frontend/apps/website-epic/Dockerfile', '--build-arg', 'VITE_API_URL=$BACKEND_URL', '.']",
      "images:",
      "  - '$FRONTEND_IMAGE'",
      "options:",
      "  machineType: 'E2_HIGHCPU_8'"
    )
    $cbFrontend | Set-Content (Join-Path $frontendStaging "cloudbuild.yaml")

    Write-Host "☁️ Submitting Frontend to Cloud Build..." -ForegroundColor Cyan
    gcloud builds submit $frontendStaging --config (Join-Path $frontendStaging "cloudbuild.yaml")
    if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed"; exit 1 }
}

# --- DEPLOY ---
Write-Host "`n🚀 Deploying to Cloud Run..." -ForegroundColor Green

$envVars = "NODE_ENV=production," +
           "ENABLE_REDIS=false," +
           "MONGODB_URI=mongodb+srv://admin_db_user:AIGestionGodMode2026!Atlas@cluster0.mpfnejh.mongodb.net/?appName=Cluster0," +
           "JWT_SECRET=44810ed19aca3d4d642ec0f1f1f58ee744810ed19aca3d4d642ec0f1f1f58ee744810ed19aca3d4d642ec0f1f1f58ee744810ed19aca3d4d642ec0f1f1f58ee7"

if ($Target -eq "all" -or $Target -eq "backend") {
    gcloud run deploy backend-aigestion --image $BACKEND_IMAGE --platform managed --region $REGION --allow-unauthenticated --port 8080 --memory 4Gi --set-env-vars $envVars
}

if ($Target -eq "all" -or $Target -eq "frontend") {
    gcloud run deploy nexus-frontend --image $FRONTEND_IMAGE --platform managed --region $REGION --allow-unauthenticated --port 80 --memory 512Mi
}

Write-Host "`n✨ Sovereign Deployment Complete!" -ForegroundColor Green
    gcloud run deploy nexus-frontend --image $FRONTEND_IMAGE --platform managed --region $REGION --allow-unauthenticated --port 80 --memory 512Mi
}

Write-Host "`n✨ Sovereign Deployment Complete!" -ForegroundColor Green
