function Fix-Paths($folder, $prefix) {
    if (Test-Path "$folder/index.html") {
        Write-Host "Fixing paths in $folder/index.html..."
        $content = Get-Content "$folder/index.html" -Raw
        $content = $content.Replace('src="/assets/', "src=`"$prefix/assets/")
        $content = $content.Replace('href="/assets/', "href=`"$prefix/assets/")
        $content = $content.Replace('src="/images/', "src=`"$prefix/images/")
        $content = $content.Replace('href="/images/', "href=`"$prefix/images/")
        $content = $content.Replace('href="/manifest.webmanifest"', "href=`"$prefix/manifest.webmanifest`"")
        $content = $content.Replace('src="/registerSW.js"', "src=`"$prefix/registerSW.js`"")
        Set-Content -Path "$folder/index.html" -Value $content
    }
}

Fix-Paths "admin" "/admin"
Fix-Paths "client" "/client"
Fix-Paths "demo" "/demo"

Write-Host "✅ Path fixes complete in root."
