$token = "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"
$repo = "github.com/aigestion/aigestion.git"
$remoteUrl = "https://$token@$repo"

git config user.name "Alejandro (Antigravity)"
git config user.email "admin@aigestion.net"

git add .
git commit -m "Deploy: Consolidated apps to main root [skip ci]" --no-verify

Write-Host "🚀 Pushing to main..."
git push --force $remoteUrl main

Write-Host "✅ Pushed to main!"
