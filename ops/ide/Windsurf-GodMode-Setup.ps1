# Windsurf IDE - God Mode Setup for AIGestion.net
param(
    [switch]$Force,
    [switch]$Backup
)

Write-Host "🚀 Windsurf IDE - Optimización Nivel Dios para AIGestion.net" -ForegroundColor Cyan

# Paths
$windsurfPath = "$env:USERPROFILE\.windsurf"
$extensionsPath = "$windsurfPath\extensions"
$settingsPath = "$windsurfPath\settings.json"
$keybindingsPath = "$windsurfPath\keybindings.json"
$snippetsPath = "$windsurfPath\snippets"

# Backup existing configuration
if ($Backup) {
    Write-Host "📦 Creating backup..." -ForegroundColor Yellow
    $backupPath = "$windsurfPath\backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
    Copy-Item "$windsurfPath\*" $backupPath -Recurse -Force
    Write-Host "✅ Backup created at $backupPath" -ForegroundColor Green
}

# Install essential extensions
$extensions = @(
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "eamodio.gitlens",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "formulahendry.auto-close-tag",
    "christian-kohler.path-intellisense",
    "christian-kohler.npm-intellisense",
    "ms-vscode.vscode-react-javascript-snippets",
    "dsznajder.es7-react-js-snippets",
    "styled-components.vscode-styled-components",
    "wix.vscode-import-cost",
    "wallabyjs.console-ninja",
    "ms-playwright.playwright",
    "sonarsource.sonarlint-vscode",
    "bierner.markdown-mermaid",
    "yzhang.markdown-all-in-one",
    "streetsidesoftware.code-spell-checker",
    "aaron-bond.better-comments",
    "gruntfuggly.todo-tree",
    "ms-azuretools.vscode-docker",
    "ms-azuretools.vscode-containers",
    "ms-kubernetes-tools.vscode-kubernetes-tools",
    "hashicorp.terraform",
    "google.geminicodeassist",
    "github.vscode-github-actions",
    "humao.rest-client",
    "rangav.vscode-thunder-client",
    "redhat.vscode-yaml",
    "charliermarsh.ruff",
    "ms-python.vscode-python",
    "codeium.windsurfpyright",
    "ms-python.black-formatter",
    "ms-python.isort",
    "ms-python.debugpy",
    "ms-vscode.powershell",
    "googlecloudtools.cloudcode",
    "firebase.firebase-debugger",
    "supabase.supabase-vscode",
    "vercel.vercel-vscode"
)

Write-Host "📦 Installing extensions..." -ForegroundColor Yellow
foreach ($ext in $extensions) {
    Write-Host "  Installing $ext..." -ForegroundColor Cyan
    code --install-extension $ext --force
}
Write-Host "✅ Extensions installed" -ForegroundColor Green

# Create optimized settings.json
$settings = @{
    "editor.formatOnSave" = $true
    "editor.defaultFormatter" = "esbenp.prettier-vscode"
    "editor.codeActionsOnSave" = @{
        "source.fixAll.eslint" = "explicit"
    }
    "emmet.includeLanguages" = @{
        "javascript" = "javascriptreact"
        "typescript" = "typescriptreact"
    }
    "files.associations" = @{
        "*.css" = "tailwindcss"
        "*.jsx" = "javascriptreact"
        "*.tsx" = "typescriptreact"
    }
    "tailwindCSS.includeLanguages" = @("javascript", "javascriptreact", "typescript", "typescriptreact")
    "css.validate" = $false
    "workbench.colorTheme" = "One Dark Pro"
    "workbench.iconTheme" = "material-icon-theme"
    "terminal.integrated.defaultProfile.windows" = "PowerShell"
    "git.enableSmartCommit" = $true
    "git.autofetch" = $true
    "git.confirmSync" = $false
}

Write-Host "⚙️ Creating settings.json..." -ForegroundColor Yellow
$settings | ConvertTo-Json -Depth 10 | Out-File -FilePath $settingsPath -Encoding UTF8
Write-Host "✅ settings.json created" -ForegroundColor Green

# Create keybindings.json
$keybindings = @(
    @{
        "key" = "ctrl+shift+;"
        "command" = "editor.action.formatDocument"
        "when" = "editorHasDocumentFormattingProvider && editorTextFocus && !editorReadonly"
    },
    @{
        "key" = "ctrl+shift+/"
        "command" = "editor.action.commentLine"
        "when" = "editorTextFocus && !editorReadonly"
    }
)

Write-Host "⌨️ Creating keybindings.json..." -ForegroundColor Yellow
$keybindings | ConvertTo-Json -Depth 10 | Out-File -FilePath $keybindingsPath -Encoding UTF8
Write-Host "✅ keybindings.json created" -ForegroundColor Green

# Create snippets directory and files
$snippetsDir = "$snippetsPath\typescriptreact"
New-Item -ItemType Directory -Path $snippetsDir -Force | Out-Null

$snippets = @{
    "React Functional Component" = @{
        "prefix" = "rfc"
        "body" = @(
            "import React from 'react';",
            "",
            "interface ComponentNameProps {",
            "  props: string;",
            "}",
            "",
            "export const ComponentName: React.FC<ComponentNameProps> = ({ props }) => {",
            "  return (",
            "    <div>",
            "      <h1>ComponentName</h1>",
            "      <p>{props}</p>",
            "    </div>",
            "  );",
            "};",
            "",
            "export default ComponentName;"
        )
        "description" = "Create React functional component with TypeScript"
    }
}

Write-Host "📝 Creating snippets..." -ForegroundColor Yellow
$snippets.GetEnumerator() | ForEach-Object {
    $snippetFile = "$snippetsDir\$($_.Key).json"
    $_.Value | ConvertTo-Json -Depth 10 | Out-File -FilePath $snippetFile -Encoding UTF8
}
Write-Host "✅ Snippets created" -ForegroundColor Green

Write-Host "🎉 Windsurf IDE configurado a NIVEL DIOS para AIGestion.net!" -ForegroundColor Green
Write-Host "🔄 Reinicia VS Code para aplicar los cambios" -ForegroundColor Yellow
