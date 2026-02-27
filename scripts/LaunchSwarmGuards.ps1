# 🛡️ SWARM GUARD ORCHESTRATOR
# Launches a constellation of Guardian Agents across the tiered workspace.

$Tiers = @("AIGestion", "PROJECTS", "TOOLS", "RESEARCH", "ARCHIVE", "SCRIPTS")
$ScriptPath = "C:\Users\Alejandro\AIGestion\scripts\SwarmGuardAgent.js"

Write-Host "`n🛡️ DEPLOYING SWARM GUARD CONSTELLATION..." -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan

foreach ($Tier in $Tiers) {
    Write-Host "[DEPLOY] Launching Guard for Tier: $Tier" -ForegroundColor Yellow
    # Start each guard in its own background process
    Start-Process node -ArgumentList "$ScriptPath $Tier" -WindowStyle Hidden
}

Write-Host "`n✅ SWARM CONSTELLATION ONLINE. WORKSPACE UNDER SOVEREIGN OVERSIGHT." -ForegroundColor Green
