$token = "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"
$repo = "github.com/aigestion/aigestion.git"
$remoteUrl = "https://$token@$repo"

$distFolder = "deploy_dist"

if (-not (Test-Path $distFolder)) {
    Write-Error "❌ Dist folder not found!"
    exit 1
}

cd $distFolder
git init
git config user.name "Alejandro (Antigravity)"
git config user.email "admin@aigestion.net"

git add .
git commit -m "Deploy: Website Epic + Dashboards $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-Host "🚀 Pushing to gh-pages..."
git push --force $remoteUrl HEAD:gh-pages

Write-Host "✅ Pushed to gh-pages!"
cd ..
