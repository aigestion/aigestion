param(
  [string]$PackagePath = "aigestion-deploy"
)

# Load .env if exists
if (Test-Path .env) {
  Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
      $name = $matches[1].Trim()
      $val = $matches[2].Trim("'\"")
      Set-Item -Path "Env:\$name" -Value $val
    }
  }
}

if (-not $env:FOUNDRY_PROJECT_ENDPOINT) { Write-Error 'FOUNDRY_PROJECT_ENDPOINT not set'; exit 1 }
if (-not $env:FOUNDRY_MODEL_DEPLOYMENT_NAME) { Write-Error 'FOUNDRY_MODEL_DEPLOYMENT_NAME not set'; exit 1 }
if (-not $env:FOUNDRY_API_KEY) { Write-Error 'FOUNDRY_API_KEY not set'; exit 1 }

if (-not (Test-Path $PackagePath)) { Write-Error "Package path '$PackagePath' not found"; exit 1 }

$zip = "$env:TEMP\deploy-$($env:FOUNDRY_MODEL_DEPLOYMENT_NAME).zip"
if (Test-Path $zip) { Remove-Item $zip -Force }

Write-Host "Compressing $PackagePath -> $zip"
Compress-Archive -Path $PackagePath -DestinationPath $zip -Force

$uri = $env:FOUNDRY_PROJECT_ENDPOINT
$headers = @{ Authorization = "Bearer $($env:FOUNDRY_API_KEY)" }

Write-Host "Uploading to $uri"
$response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Form @{ deploymentName = $env:FOUNDRY_MODEL_DEPLOYMENT_NAME; file = Get-Item $zip }

Write-Host "Response:`n" $response

Remove-Item $zip -Force
