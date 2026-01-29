$token = "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"
$repo = "github.com/aigestion/aigestion.git"
$remoteUrl = "https://$token@$repo"

git config user.name "Alejandro (Antigravity)"
git config user.email "admin@aigestion.net"

# We want the content of the current directory (which has the consolidated build)
# to go into the gh-pages branch.
# We'll create a temporary branch for this or just push current state.
Write-Host "🚀 Pushing current root to gh-pages..."
git push --force $remoteUrl HEAD:gh-pages

Write-Host "✅ Pushed to gh-pages!"
