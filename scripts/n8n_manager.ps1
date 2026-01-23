# n8n Manager Script for AIGestion
# Usage: .\scripts\n8n_manager.ps1 [status|export|import]

param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("status", "export", "import")]
    $Action
)

$ContainerName = "aigestion-n8n-1"
$WorkflowDir = "./workflows"

switch ($Action) {
    "status" {
        Write-Host "Checking n8n container status..." -ForegroundColor Cyan
        docker ps --filter "name=$ContainerName"
    }
    "export" {
        Write-Host "Exporting workflows to $WorkflowDir..." -ForegroundColor Cyan
        if (-not (Test-Path $WorkflowDir)) { New-Item -ItemType Directory -Path $WorkflowDir }
        docker exec -u node $ContainerName n8n export:workflow --all --output=/home/node/.n8n/workflows_export.json
        docker cp ${ContainerName}:/home/node/.n8n/workflows_export.json "${WorkflowDir}/all_workflows.json"
        Write-Host "Workflows exported successfully to ${WorkflowDir}/all_workflows.json" -ForegroundColor Green
    }
    "import" {
        Write-Host "Importing workflows from $WorkflowDir..." -ForegroundColor Cyan
        if (Test-Path "${WorkflowDir}/all_workflows.json") {
            docker cp "${WorkflowDir}/all_workflows.json" ${ContainerName}:/home/node/.n8n/workflows_import.json
            docker exec -u node $ContainerName n8n import:workflow --input=/home/node/.n8n/workflows_import.json
            Write-Host "Workflows imported successfully!" -ForegroundColor Green
        } else {
            Write-Host "Error: ${WorkflowDir}/all_workflows.json not found." -ForegroundColor Red
        }
    }
}
