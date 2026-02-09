# Create Desktop Shortcuts for Memory Management
# Creates easy access shortcuts for memory management

param(
    [switch]$Create,
    [switch]$Remove
)

$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ScriptsPath = "c:\Users\Alejandro\AIGestion\scripts"

# Shortcut definitions
$Shortcuts = @(
    @{
        Name = "AIGestion Memory Monitor"
        Target = "PowerShell.exe"
        Arguments = "-ExecutionPolicy Bypass -Command `"& `"$ScriptsPath\memory-monitor.ps1`" -Continuous`""
        Icon = "shell32.dll,13"
        Description = "Monitor AIGestion memory usage in real-time"
    },
    @{
        Name = "AIGestion Memory Optimize"
        Target = "PowerShell.exe"
        Arguments = "-ExecutionPolicy Bypass -Command `"& `"$ScriptsPath\memory-quick.ps1`"; memopt`""
        Icon = "shell32.dll,24"
        Description = "Quick memory optimization for AIGestion"
    },
    @{
        Name = "AIGestion Control Center"
        Target = "PowerShell.exe"
        Arguments = "-ExecutionPolicy Bypass -Command `"& `"$ScriptsPath\memory-auto-scheduler.ps1`" -Status`""
        Icon = "shell32.dll,21"
        Description = "AIGestion Memory Management Control Center"
    }
)

function Create-Shortcut {
    param($ShortcutInfo)
    
    $ShortcutPath = Join-Path $DesktopPath "$($ShortcutInfo.Name).lnk"
    
    try {
        $Shell = New-Object -ComObject WScript.Shell
        $Shortcut = $Shell.CreateShortcut($ShortcutPath)
        $Shortcut.TargetPath = $ShortcutInfo.Target
        $Shortcut.Arguments = $ShortcutInfo.Arguments
        $Shortcut.WorkingDirectory = $ScriptsPath
        $Shortcut.Description = $ShortcutInfo.Description
        $Shortcut.IconLocation = $ShortcutInfo.Icon
        $Shortcut.Save()
        
        Write-Host "✅ Created: $($ShortcutInfo.Name)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Failed to create $($ShortcutInfo.Name): $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Remove-Shortcut {
    param($ShortcutInfo)
    
    $ShortcutPath = Join-Path $DesktopPath "$($ShortcutInfo.Name).lnk"
    
    try {
        if (Test-Path $ShortcutPath) {
            Remove-Item $ShortcutPath -Force
            Write-Host "🗑️ Removed: $($ShortcutInfo.Name)" -ForegroundColor Yellow
            return $true
        } else {
            Write-Host "⚠️ Not found: $($ShortcutInfo.Name)" -ForegroundColor Gray
            return $true
        }
    } catch {
        Write-Host "❌ Failed to remove $($ShortcutInfo.Name): $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main execution
Write-Host "AIGestion Memory Desktop Shortcuts" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Gray

if ($Create) {
    Write-Host "Creating desktop shortcuts..." -ForegroundColor Green
    Write-Host ""
    
    $successCount = 0
    foreach ($shortcut in $Shortcuts) {
        if (Create-Shortcut -ShortcutInfo $shortcut) {
            $successCount++
        }
    }
    
    Write-Host ""
    Write-Host "✅ Created $successCount/$($Shortcuts.Count) shortcuts" -ForegroundColor Green
    Write-Host "📁 Location: $DesktopPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Available shortcuts:" -ForegroundColor Cyan
    foreach ($shortcut in $Shortcuts) {
        Write-Host "  🖥️ $($shortcut.Name)" -ForegroundColor White
    }
    
}
elseif ($Remove) {
    Write-Host "Removing desktop shortcuts..." -ForegroundColor Yellow
    Write-Host ""
    
    $successCount = 0
    foreach ($shortcut in $Shortcuts) {
        if (Remove-Shortcut -ShortcutInfo $shortcut) {
            $successCount++
        }
    }
    
    Write-Host ""
    Write-Host "✅ Removed $successCount/$($Shortcuts.Count) shortcuts" -ForegroundColor Green
    
}
else {
    Write-Host "Usage:" -ForegroundColor Gray
    Write-Host "  Create:  .\memory-desktop-shortcut.ps1 -Create" -ForegroundColor Cyan
    Write-Host "  Remove:  .\memory-desktop-shortcut.ps1 -Remove" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Gray
    Write-Host "  # Create all shortcuts" -ForegroundColor Gray
    Write-Host "  .\memory-desktop-shortcut.ps1 -Create" -ForegroundColor Green
    Write-Host ""
    Write-Host "  # Remove all shortcuts" -ForegroundColor Gray
    Write-Host "  .\memory-desktop-shortcut.ps1 -Remove" -ForegroundColor Yellow
}

Write-Host ""
