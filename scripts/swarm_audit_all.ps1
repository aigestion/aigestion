# 🌌 Swarm Audit All
# Aggregates system health, security, and quality audits.

$ConfigRoot = Resolve-Path "$PSScriptRoot\.."
$Issues = @()

Write-Host "🔍 Starting Swarm Deep Audit..." -ForegroundColor Cyan

# 1. Env Security Audit
Write-Host "Checking Environment Security..." -ForegroundColor Cyan
try {
    node "$ConfigRoot\ops\audit_env.js"
    if ($LASTEXITCODE -ne 0) { $Issues += "ENV_SECURITY_VULNERABILITY" }
}
catch {
    $Issues += "ENV_AUDIT_CRASH"
}

# 2. Docker Infrastructure
Write-Host "Checking Docker Health..."
try {
    $env:COMPOSE_FILE = "infra/docker/docker-compose.yml"
    bash "./ops/docker-health-check.sh" dev
    if ($LASTEXITCODE -ne 0) { $Issues += "DOCKER_SERVICE_DOWN" }
}
catch {
    $Issues += "DOCKER_AUDIT_CRASH"
}

# 3. Code Quality (Lint)
Write-Host "Checking Code Quality..."
try {
    Set-Location "$ConfigRoot"
    pnpm run lint -- --quiet
    if ($LASTEXITCODE -ne 0) { $Issues += "LINT_ERRORS_DETECTED" }
}
catch {
    $Issues += "LINT_CRASH"
}

# 4. Critical Tests
Write-Host "Running Critical Integration Tests..."
try {
    Set-Location "$ConfigRoot"
    pnpm test -- --bail 1
    if ($LASTEXITCODE -ne 0) { $Issues += "TEST_SUITE_BREAKAGE" }
}
catch {
    $Issues += "TEST_CRASH"
}

if ($Issues.Count -gt 0) {
    Write-Host "❌ Audit Failed with $($Issues.Count) issues." -ForegroundColor Red
    $Issues | ForEach-Object { Write-Host "  - $_" }
    exit 1
}
else {
    Write-Host "✅ Audit Clean. System at God-Level stability." -ForegroundColor Green
    exit 0
}
