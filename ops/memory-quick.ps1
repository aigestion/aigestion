# AIGestion Memory Management - Quick Commands
# Simple script for memory management without module restrictions

# Quick memory report
function Get-MemoryReport {
    $processes = Get-Process -Name node -ErrorAction SilentlyContinue
    
    if (-not $processes) {
        Write-Host "No Node.js processes running" -ForegroundColor Yellow
        return
    }
    
    $totalMemory = ($processes | Measure-Object -Property WorkingSet -Sum).Sum / 1MB
    $processCount = $processes.Count
    
    Write-Host "=== QUICK MEMORY REPORT ===" -ForegroundColor Cyan
    Write-Host "Node.js Processes: $processCount"
    Write-Host "Total Memory: $([math]::Round($totalMemory, 2)) MB"
    Write-Host "Average: $([math]::Round($totalMemory / $processCount, 2)) MB per process"
    
    $highMemory = $processes | Where-Object { $_.WorkingSet / 1MB -gt 300 }
    if ($highMemory) {
        Write-Host "High Memory Processes (>300MB): $($highMemory.Count)" -ForegroundColor Red
        $highMemory | ForEach-Object {
            Write-Host "  PID $($_.Id): $([math]::Round($_.WorkingSet/1MB, 2)) MB" -ForegroundColor Red
        }
    }
    
    Write-Host ""
}

# Kill high memory processes
function Kill-HighMemoryProcesses {
    param([int]$ThresholdMB = 300)
    
    $processes = Get-Process -Name node -ErrorAction SilentlyContinue
    if (-not $processes) {
        Write-Host "No Node.js processes found" -ForegroundColor Yellow
        return
    }
    
    $highMemory = $processes | Where-Object { $_.WorkingSet / 1MB -gt $ThresholdMB }
    
    if ($highMemory) {
        Write-Host "Killing $($highMemory.Count) high memory processes (>$ThresholdMB MB):" -ForegroundColor Red
        $highMemory | ForEach-Object {
            $memoryMB = [math]::Round($_.WorkingSet/1MB, 2)
            Write-Host "  Killing PID $($_.Id): $memoryMB MB" -ForegroundColor Red
            Stop-Process -Id $_.Id -Force
        }
        Write-Host "✅ Process cleanup completed" -ForegroundColor Green
    } else {
        Write-Host "No processes found above $ThresholdMB MB threshold" -ForegroundColor Green
    }
}

# Optimize memory
function Optimize-Memory {
    Write-Host "🧹 Memory Optimization Started" -ForegroundColor Green
    
    # Kill high memory processes
    Write-Host "Checking for high memory processes..." -ForegroundColor Yellow
    Kill-HighMemoryProcesses -ThresholdMB 400
    
    # Clear system memory
    Write-Host "Clearing system memory..." -ForegroundColor Yellow
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    [System.GC]::Collect()
    
    # Show final status
    Write-Host "Final memory status:" -ForegroundColor Green
    Get-MemoryReport
    
    Write-Host "✅ Memory optimization complete!" -ForegroundColor Green
}

# Create aliases
Set-Alias -Name mem -Value Get-MemoryReport
Set-Alias -Name memkill -Value Kill-HighMemoryProcesses
Set-Alias -Name memopt -Value Optimize-Memory

Write-Host "AIGestion Memory Commands Loaded" -ForegroundColor Cyan
Write-Host "Commands: mem, memkill, memopt" -ForegroundColor Gray
