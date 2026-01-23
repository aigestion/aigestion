# God-Level Chrome Extension Auto-Installer
# ---------------------------------------------------
# Uses Windows Registry Policies to force-install essential dev extensions.
# Applies to the User (HKCU), so it works without Admin privileges (usually),
# but creates a "Managed" browser environment.

$registryPath = "HKCU:\Software\Policies\Google\Chrome\ExtensionInstallForcelist"

# 1. Define Extensions (ID;UpdateURL)
$extensions = @{
    "1" = "fmkadmapgofadopljbjfkapdkoienihi;https://clients2.google.com/service/update2/crx" # React DevTools
    "2" = "lmhkpmbekcpmknklioeibfkpmmfibljd;https://clients2.google.com/service/update2/crx" # Redux DevTools
    "3" = "eifflpmocdbdmepbjaopkkhbfmdgijcc;https://clients2.google.com/service/update2/crx" # JSON Viewer Pro
    "4" = "blipmdconlkpinefehnmjammfjpmpbjk;https://clients2.google.com/service/update2/crx" # Lighthouse
}

# 2. Creating Registry Key
if (-not (Test-Path $registryPath)) {
    Write-Host "Creating Registry Key for Chrome Policies..." -ForegroundColor Cyan
    New-Item -Path $registryPath -Force | Out-Null
}

# 3. Setting Policies
Write-Host "Injecting Extension Policies..." -ForegroundColor Yellow
foreach ($key in $extensions.Keys) {
    Set-ItemProperty -Path $registryPath -Name $key -Value $extensions[$key]
    Write-Host "  + Enforced Extension: $($extensions[$key].Split(';')[0])" -ForegroundColor Gray
}

Write-Host "`n✅ Extensions will automatically install on next Chrome launch." -ForegroundColor Green
Write-Host "⚠️ Note: Chrome may show 'Managed by your organization' due to these policies." -ForegroundColor Yellow
