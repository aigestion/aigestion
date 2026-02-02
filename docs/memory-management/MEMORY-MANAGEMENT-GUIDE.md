# AIGestion Memory Management - Complete Setup Guide

## 🚀 AUTOMATED MEMORY MANAGEMENT SYSTEM

### 📁 Files Created:
- `scripts/memory-monitor.ps1` - Real-time memory monitoring
- `scripts/auto-memory-manager.ps1` - Automatic memory management
- `scripts/memory-commands.ps1` - Quick command aliases
- `scripts/setup-memory-task.ps1` - Scheduled task setup
- `config/memory-config.psd1` - Central configuration
- `dashboard/memory-dashboard.html` - Web dashboard

## 🎯 QUICK START

### 1. Load Memory Commands (Run once per session)
```powershell
Import-Module .\scripts\memory-commands.ps1
```

### 2. Monitor Memory Usage
```powershell
# One-time check
mem

# Continuous monitoring
Show-MemoryStatus -Continuous -Interval 5

# Kill high memory processes (>300MB)
memkill -ThresholdMB 300
```

### 3. Auto Memory Management
```powershell
# Monitor only (safe mode)
Start-AutoMemoryManager -MaxMemoryPerProcess 300 -MaxTotalMemory 1024

# Auto-kill enabled (⚠️ DANGER)
Start-AutoMemoryManager -EnableAutoKill -MaxMemoryPerProcess 300
```

### 4. Setup Scheduled Task
```powershell
# Create monitoring task (safe)
.\scripts\setup-memory-task.ps1 -CreateTask

# Create with auto-kill (⚠️ DANGER)
.\scripts\setup-memory-task.ps1 -CreateTask -EnableAutoKill

# Remove task
.\scripts\setup-memory-task.ps1 -RemoveTask
```

### 5. Web Dashboard
Open `dashboard/memory-dashboard.html` in your browser for real-time monitoring

## ⚙️ CONFIGURATION

Edit `config/memory-config.psd1` to customize:
- Memory thresholds
- Monitoring intervals
- Auto-kill settings
- Notifications
- Logging

## 🔧 COMMANDS REFERENCE

### Memory Commands (after importing module)
```powershell
mem                    # Quick memory report
memkill                # Kill high memory processes
memauto                # Start auto memory manager
memopt                 # Optimize memory
Show-MemoryStatus      # Detailed memory monitoring
```

### Direct Script Execution
```powershell
# Memory monitoring
.\scripts\memory-monitor.ps1 -Continuous -Interval 10

# Auto management
.\scripts\auto-memory-manager.ps1 -EnableAutoKill

# One-time optimization
.\scripts\memory-monitor.ps1 -KillHighMemory -MemoryThresholdMB 400
```

## 📊 FEATURES

### ✅ MONITORING
- Real-time Node.js process tracking
- Memory usage per process
- System memory statistics
- Historical data tracking
- Web dashboard visualization

### ✅ AUTO-MANAGEMENT
- Configurable memory thresholds
- Automatic process termination
- Graceful shutdown attempts
- Process count management
- System resource protection

### ✅ NOTIFICATIONS
- Desktop alerts
- Email notifications (configurable)
- Telegram bot integration
- Log file tracking
- Real-time dashboard updates

### ✅ SCHEDULING
- Windows Task Scheduler integration
- Boot-time startup
- Recurring monitoring
- Configurable intervals
- Automatic recovery

## 🚨 SAFETY SETTINGS

### SAFE MODE (Default)
- Monitoring only
- Manual kill commands
- Warnings and alerts
- No automatic termination

### AUTO-KILL MODE (⚠️ DANGER)
- Automatic process termination
- Configurable thresholds
- Graceful shutdown attempts
- System protection limits

## 📈 THRESHOLDS

### Default Memory Limits:
- **Warning**: 200MB per process, 800MB total
- **Critical**: 300MB per process, 1024MB total
- **Maximum**: 400MB per process, 1536MB total
- **Process Count**: Maximum 15 Node.js processes

### System Protection:
- Minimum 1GB free system memory
- Maximum 80% CPU usage
- Minimum 100MB disk space

## 🔄 AUTOMATION SETUP

### Complete Automation (Recommended)
```powershell
# 1. Load commands
Import-Module .\scripts\memory-commands.ps1

# 2. Setup scheduled task (monitoring only)
.\scripts\setup-memory-task.ps1 -CreateTask

# 3. Open dashboard
Start-Process .\dashboard\memory-dashboard.html

# 4. Start continuous monitoring
Show-MemoryStatus -Continuous -Interval 10
```

### Full Auto-Kill Setup (⚠️ ADVANCED USERS ONLY)
```powershell
# 1. Enable auto-kill in config
# Edit config/memory-config.psd1: AutoManagement.EnableAutoKill = $true

# 2. Setup scheduled task with auto-kill
.\scripts\setup-memory-task.ps1 -CreateTask -EnableAutoKill

# 3. Start auto manager
Start-AutoMemoryManager -EnableAutoKill
```

## 📝 LOGGING

### Log Files Location:
- `logs/memory-manager.log` - Main activity log
- `logs/memory-monitor.log` - Monitoring data
- `logs/auto-kill.log` - Process termination log

### Log Retention:
- Default: 30 days
- Configurable in memory-config.psd1
- Automatic cleanup

## 🌐 DASHBOARD FEATURES

### Real-time Monitoring:
- Live process list
- Memory usage charts
- System statistics
- Historical trends

### Interactive Controls:
- Manual refresh
- Auto-refresh toggle
- Process termination
- Memory optimization

### Visual Indicators:
- Color-coded status
- Animated alerts
- Progress bars
- Chart visualizations

## 🛠️ TROUBLESHOOTING

### Common Issues:
1. **PowerShell Execution Policy**: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
2. **Module Import**: Ensure scripts are in correct directory
3. **Permissions**: Run as Administrator for auto-kill features
4. **Task Scheduler**: Check Windows Task Scheduler for task status

### Debug Mode:
```powershell
# Enable verbose logging
$VerbosePreference = "Continue"
.\scripts\memory-monitor.ps1 -Verbose
```

## 📞 SUPPORT

### Monitoring Commands:
```powershell
# Check task status
.\scripts\setup-memory-task.ps1

# View logs
Get-Content .\logs\memory-manager.log -Tail 20

# Test configuration
Get-Content .\config\memory-config.psd1 | ConvertFrom-Json
```

## 🎯 BEST PRACTICES

1. **Start in monitoring mode** before enabling auto-kill
2. **Set conservative thresholds** initially
3. **Monitor logs** regularly
4. **Test manually** before automation
5. **Backup configuration** before changes
6. **Review dashboard** frequently

---

## 🚀 READY TO USE

Your automated memory management system is now ready!

**Next Steps:**
1. Import the memory commands module
2. Run a memory check with `mem`
3. Open the web dashboard
4. Configure thresholds as needed
5. Setup scheduled task for continuous monitoring

The system will now automatically monitor and manage your Node.js memory usage 24/7! 🎉
