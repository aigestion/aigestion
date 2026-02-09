# Memory Monitor Script for AIGestion Backend
# Monitors Node.js processes and provides memory usage statistics

param(
    [switch]$Continuous,
    [int]$Interval = 5,
    [switch]$KillHighMemory,
    [int]$MemoryThresholdMB = 500
)

function Get-NodeMemoryStats {
    try {
        $processes = Get-Process -Name node -ErrorAction SilentlyContinue
        
        if ($processes) {
            $totalMemory = 0
            $processCount = 0
            $highMemoryProcesses = @()
            
            $results = $processes | ForEach-Object {
                $memoryMB = [math]::Round($_.WorkingSet / 1MB, 2)
                $totalMemory += $memoryMB
                $processCount++
                
                $processInfo = [PSCustomObject]@{
                    PID = $_.Id
                    Name = $_.ProcessName
                    MemoryMB = $memoryMB
                    StartTime = $_.StartTime
                    CPU = $_.CPU
                }
                
                if ($memoryMB -gt $MemoryThresholdMB) {
                    $highMemoryProcesses += $processInfo
                }
                
                return $processInfo
            }
            
            # System Memory Info
            $systemMemory = Get-CimInstance -ClassName Win32_OperatingSystem
            $totalSystemMemory = [math]::Round($systemMemory.TotalVisibleMemorySize / 1MB, 2)
            $freeMemory = [math]::Round($systemMemory.FreePhysicalMemory / 1MB, 2)
            $usedMemory = $totalSystemMemory - $freeMemory
            $memoryUsagePercent = [math]::Round(($usedMemory / $totalSystemMemory) * 100, 2)
            
            # Output results
            Write-Host "=== NODE.JS MEMORY MONITOR ===" -ForegroundColor Cyan
            Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
            Write-Host ""
            
            Write-Host "SYSTEM MEMORY:" -ForegroundColor Yellow
            Write-Host "  Total: $totalSystemMemory GB"
            Write-Host "  Used: $usedMemory GB ($memoryUsagePercent%)"
            Write-Host "  Free: $freeMemory GB"
            Write-Host ""
            
            Write-Host "NODE.JS PROCESSES ($processCount found):" -ForegroundColor Green
            $results | Format-Table -AutoSize
            
            Write-Host "SUMMARY:" -ForegroundColor Magenta
            Write-Host "  Total Node.js Memory: $([math]::Round($totalMemory, 2)) MB"
            Write-Host "  Average per Process: $([math]::Round($totalMemory / $processCount, 2)) MB"
            Write-Host "  High Memory Processes (> $MemoryThresholdMB MB): $($highMemoryProcesses.Count)"
            
            if ($highMemoryProcesses.Count -gt 0) {
                Write-Host ""
                Write-Host "HIGH MEMORY PROCESSES:" -ForegroundColor Red
                $highMemoryProcesses | ForEach-Object {
                    Write-Host "  PID $($_.PID): $($_.MemoryMB) MB"
                }
                
                if ($KillHighMemory) {
                    Write-Host ""
                    Write-Host "KILLING HIGH MEMORY PROCESSES..." -ForegroundColor Red
                    $highMemoryProcesses | ForEach-Object {
                        try {
                            Stop-Process -Id $_.PID -Force
                            Write-Host "  Killed PID $($_.PID) ($($_.MemoryMB) MB)" -ForegroundColor Red
                        } catch {
                            Write-Host "  Failed to kill PID $($_.PID): $($_.Exception.Message)" -ForegroundColor DarkRed
                        }
                    }
                }
            }
            
            Write-Host ""
            Write-Host "RECOMMENDATIONS:" -ForegroundColor Cyan
            if ($memoryUsagePercent -gt 85) {
                Write-Host "  ⚠️  System memory usage is high ($memoryUsagePercent%)" -ForegroundColor Yellow
            }
            if ($totalMemory -gt 2048) {
                Write-Host "  ⚠️  Total Node.js memory is high ($([math]::Round($totalMemory, 2)) MB)" -ForegroundColor Yellow
            }
            if ($processCount -gt 10) {
                Write-Host "  ⚠️  Many Node.js processes running ($processCount)" -ForegroundColor Yellow
            }
            if ($highMemoryProcesses.Count -gt 0 -and -not $KillHighMemory) {
                Write-Host "  💡 Consider using -KillHighMemory to terminate processes > $MemoryThresholdMB MB" -ForegroundColor Gray
            }
            
        } else {
            Write-Host "No Node.js processes found" -ForegroundColor Yellow
        }
        
        Write-Host "=" * 50 -ForegroundColor Gray
        Write-Host ""
        
    } catch {
        Write-Host "Error monitoring memory: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Start-ContinuousMonitoring {
    Write-Host "Starting continuous memory monitoring (Interval: $Interval seconds)" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Gray
    Write-Host ""
    
    try {
        while ($true) {
            Clear-Host
            Get-NodeMemoryStats
            Start-Sleep -Seconds $Interval
        }
    } catch [System.Management.Automation.HaltCommandException] {
        Write-Host "Monitoring stopped by user" -ForegroundColor Yellow
    } catch {
        Write-Host "Monitoring error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution
if ($Continuous) {
    Start-ContinuousMonitoring
} else {
    Get-NodeMemoryStats
}
