. .\ops\NexusDoctor.ps1
$script:Results.Checks | Where-Object { $_.Status -eq 'WARN' } | Select-Object Name, Status, Details | ConvertTo-Json
