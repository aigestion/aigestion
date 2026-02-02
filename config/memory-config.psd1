# Memory Optimization Configuration
# Central configuration for all memory management scripts

@{
    # Memory thresholds (in MB)
    Memory = @{
        WarningPerProcess = 200      # Warn when single process exceeds this
        CriticalPerProcess = 300     # Critical when single process exceeds this
        MaxPerProcess = 400          # Kill when single process exceeds this
        
        WarningTotal = 800           # Warn when total Node.js memory exceeds this
        CriticalTotal = 1024         # Critical when total Node.js memory exceeds this
        MaxTotal = 1536              # Kill when total Node.js memory exceeds this
        
        MaxProcessCount = 15         # Maximum number of Node.js processes
    }
    
    # Monitoring settings
    Monitoring = @{
        CheckInterval = 10           # Seconds between checks
        ContinuousRefresh = 5         # Seconds for continuous monitoring refresh
        LogRetentionDays = 30         # Days to keep logs
        EnableNotifications = $true   # Enable desktop notifications
    }
    
    # Auto-management settings
    AutoManagement = @{
        EnableAutoKill = $false       # WARNING: Setting to $true will automatically kill processes
        GracefulShutdown = $true     # Try graceful shutdown before force kill
        RestartThreshold = 5         # Restart processes if count drops below this
        BackupBeforeKill = $true     # Create backup before killing processes
    }
    
    # System settings
    System = @{
        MinFreeMemoryMB = 1024       # Minimum free system memory required
        MaxCPUUsagePercent = 80      # Maximum CPU usage before intervention
        DiskSpaceCheckMB = 100       # Minimum disk space required
    }
    
    # Paths
    Paths = @{
        LogDirectory = "c:\Users\Alejandro\AIGestion\logs"
        BackupDirectory = "c:\Users\Alejandro\AIGestion\backups"
        ScriptDirectory = "c:\Users\Alejandro\AIGestion\scripts"
        ConfigFile = "c:\Users\Alejandro\AIGestion\config\memory-config.json"
    }
    
    # Notification settings
    Notifications = @{
        EmailEnabled = $false
        EmailTo = @("admin@aigestion.net")
        EmailFrom = "memory-manager@aigestion.net"
        SMTPServer = "smtp.aigestion.net"
        
        DesktopEnabled = $true
        SoundEnabled = $true
        
        TelegramEnabled = $true
        TelegramBotToken = "8507984320:AAFgRw_gQOM6uB4wqU-HjMp8"
        TelegramChatId = ""
    }
    
    # Reporting
    Reporting = @{
        GenerateDailyReport = $true
        GenerateWeeklyReport = $true
        ReportFormat = "HTML"         # HTML, JSON, or CSV
        IncludeCharts = $true
        EmailReports = $false
    }
    
    # Advanced settings
    Advanced = @{
        EnableProfiling = $false      # Enable Node.js profiling
        HeapDumpThreshold = 500       # Create heap dump at this memory usage
        GCThreshold = 400             # Force garbage collection at this threshold
        MemoryLeakDetection = $true   # Enable memory leak detection
    }
}
