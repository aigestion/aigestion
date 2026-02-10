# AIGestion - Sovereign Env Consistency Tool
# God Mode Maintenance Script

$SchemaPath = "docs/security/MASTER_ENV_SCHEMA.md"
if (-not (Test-Path $SchemaPath)) {
    Write-Host "Schema missing"
    exit 1
}

$EnvFiles = Get-ChildItem -Path . -Filter .env* -Recurse -Force -ErrorAction SilentlyContinue | Where-Object {
    $_.FullName -notmatch "node_modules" -and
    $_.FullName -notmatch ".venv" -and
    $_.FullName -notmatch ".git"
}

Write-Host "Auditing $($EnvFiles.Count) files..."

$RawSchema = Get-Content $SchemaPath
$StandardKeys = @()
foreach ($line in $RawSchema) {
    if ($line -match '\| `([^`]+)` \|') {
        $StandardKeys += $Matches[1]
    }
}

$Conflicts = 0
foreach ($file in $EnvFiles) {
    $content = Get-Content $file.FullName
    $keysInFile = @()
    foreach ($line in $content) {
        if ($line -match "^(?<key>[^=#\s]+)\s*=") {
            $keysInFile += $Matches['key']
        }
    }

    if ($keysInFile -contains "GOOGLE_GENAI_API_KEY") {
        Write-Host "CONFLICT: $($file.FullName) has legacy GOOGLE_GENAI_API_KEY"
        $Conflicts++
    }

    if ($content -match "AIzaSy[A-Za-z0-9_-]{35}") {
        Write-Host "SECURITY: $($file.FullName) has raw GEMINI KEY"
        $Conflicts++
    }
}

if ($Conflicts -eq 0) {
    Write-Host "DONE: All files harmonized."
    exit 0
}
else {
    Write-Host "FAILED: $Conflicts issues detected."
    exit 1
}
