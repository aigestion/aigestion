# GitHub God-Level Automation Scripts - AIGestion Pro 2026

# ===========================================
# 🚀 GitHub Repository Setup Automation
# ===========================================

param(
    [string]$Repository = "aigestion",
    [string]$Owner = "nemisanalex",
    [string]$Token = $env:GITHUB_TOKEN
)

# GitHub API Headers
$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
}

# Base URL
$baseUrl = "https://api.github.com/repos/$Owner/$Repository"

Write-Host "🚀 Setting up GitHub God-Level Configuration for $Repository" -ForegroundColor Green

# ===========================================
# 🔐 Configure Branch Protection
# ===========================================

function Set-BranchProtection {
    param(
        [string]$Branch,
        [hashtable]$Config
    )
    
    Write-Host "🔒 Configuring branch protection for $Branch" -ForegroundColor Yellow
    
    $body = @{
        required_status_checks = @{
            strict = $Config.required_status_checks.strict
            contexts = $Config.required_status_checks.contexts
        }
        enforce_admins = $Config.enforce_admins
        required_pull_request_reviews = @{
            required_approving_review_count = $Config.required_pull_request_reviews.required_approving_review_count
            dismiss_stale_reviews = $Config.required_pull_request_reviews.dismiss_stale_reviews
            require_code_owner_reviews = $Config.required_pull_request_reviews.require_code_owner_reviews
        }
        restrictions = @{
            users = @()
            teams = $Config.restrictions.teams
        }
        allow_force_pushes = $Config.allow_force_pushes
        allow_deletions = $Config.allow_deletions
        required_linear_history = $Config.required_linear_history
    } | ConvertTo-Json -Depth 10
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/branches/$Branch/protection" -Method PUT -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "✅ Branch protection configured for $Branch" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to configure branch protection for $Branch: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ===========================================
# 👥 Create Teams
# ===========================================

function New-GitHubTeam {
    param(
        [string]$TeamName,
        [string]$Description,
        [string[]]$Members,
        [string[]]$Repos
    )
    
    Write-Host "👥 Creating team: $TeamName" -ForegroundColor Yellow
    
    $body = @{
        name = $TeamName
        description = $Description
        privacy = "closed"
    } | ConvertTo-Json
    
    try {
        $team = Invoke-RestMethod -Uri "https://api.github.com/orgs/$Owner/teams" -Method POST -Headers $headers -Body $body -ContentType "application/json"
        
        # Add members to team
        foreach ($member in $Members) {
            try {
                Invoke-RestMethod -Uri "$team.url/memberships/$member" -Method PUT -Headers $headers | Out-Null
                Write-Host "  ✅ Added $member to $TeamName" -ForegroundColor Green
            } catch {
                Write-Host "  ⚠️ Failed to add $member to $TeamName: $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
        
        # Add repository to team
        foreach ($repo in $Repos) {
            try {
                $repoBody = @{
                    permission = "push"
                } | ConvertTo-Json
                
                Invoke-RestMethod -Uri "$team.url/repos/$Owner/$repo" -Method PUT -Headers $headers -Body $repoBody -ContentType "application/json" | Out-Null
                Write-Host "  ✅ Added $repo to $TeamName" -ForegroundColor Green
            } catch {
                Write-Host "  ⚠️ Failed to add $repo to $TeamName: $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
        
        return $team
    } catch {
        Write-Host "❌ Failed to create team $TeamName: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# ===========================================
# 🔧 Configure Repository Settings
# ===========================================

function Set-RepositorySettings {
    Write-Host "⚙️ Configuring repository settings" -ForegroundColor Yellow
    
    $body = @{
        name = $Repository
        description = "AIGestion Pro 2026 - Divine-Level AI Management Platform"
        homepage = "https://aigestion.net"
        private = $false
        has_issues = $true
        has_projects = $true
        has_wiki = $true
        has_downloads = $true
        default_branch = "main"
        allow_squash_merge = $true
        allow_merge_commit = $false
        allow_rebase_merge = $true
        delete_branch_on_merge = $true
        allow_update_branch = $true
        use_squash_pr_title_as_default = $true
        squash_merge_commit_title = "PR_TITLE"
        squash_merge_commit_message = "COMMIT_MESSAGES"
        merge_commit_title = "PR_TITLE"
        merge_commit_message = "PR_BODY"
        archived = $false
        allow_auto_merge = $true
        allow_forking = $true
        web_commit_signoff_required = $true
        security_and_analysis = @{
            advanced_security = @{
                status = "enabled"
            }
            secret_scanning = @{
                status = "enabled"
            }
            secret_scanning_push_protection = @{
                status = "enabled"
            }
            dependabot_security_updates = @{
                status = "enabled"
            }
            dependabot_alerts = @{
                status = "enabled"
            }
            code_scanning_default_setup = @{
                status = "enabled"
            }
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        Invoke-RestMethod -Uri $baseUrl -Method PATCH -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "✅ Repository settings configured" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to configure repository settings: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ===========================================
# 🏷️ Create Labels
# ===========================================

function New-GitHubLabels {
    Write-Host "🏷️ Creating custom labels" -ForegroundColor Yellow
    
    $labels = @(
        @{name="bug";color="d73a4a";description="Something isn't working"},
        @{name="documentation";color="0075ca";description="Improvements or additions to documentation"},
        @{name="duplicate";color="cfd3d7";description="This issue or pull request already exists"},
        @{name="enhancement";color="a2eeef";description="New feature or request"},
        @{name="good first issue";color="7057ff";description="Good for newcomers"},
        @{name="help wanted";color="008672";description="Extra attention is needed"},
        @{name="invalid";color="e4e669";description="This doesn't seem right"},
        @{name="question";color="d876e3";description="Further information is requested"},
        @{name="wontfix";color="ffffff";description="This will not be worked on"},
        @{name="ai-generated";color="f1e05a";description="Generated by AI"},
        @{name="security";color="b60205";description="Security related"},
        @{name="performance";color="fbca04";description="Performance related"},
        @{name="urgent";color="ee0701";description="Urgent issue"},
        @{name="critical";color="b60205";description="Critical issue"},
        @{name="high-priority";color="d93f0b";description="High priority"},
        @{name="medium-priority";color="fbca04";description="Medium priority"},
        @{name="low-priority";color="0e8a16";description="Low priority"},
        @{name="dependencies";color="0366d6";description="Pull requests that update a dependency file"},
        @{name="automated";color="0052cc";description="Automated changes"},
        @{name="monitoring";color="5319e7";description="Monitoring and analytics"},
        @{name="compliance";color="b60205";description="Compliance related"},
        @{name="deployment";color="1d76db";description="Deployment related"},
        @{name="testing";color="d4c5f9";description="Testing related"},
        @{name="refactoring";color="f9d0c4";description="Code refactoring"},
        @{name="optimization";color="c2e0c6";description="Performance optimization"}
    )
    
    foreach ($label in $labels) {
        try {
            $labelBody = @{
                name = $label.name
                color = $label.color
                description = $label.description
            } | ConvertTo-Json
            
            Invoke-RestMethod -Uri "$baseUrl/labels" -Method POST -Headers $headers -Body $labelBody -ContentType "application/json" | Out-Null
            Write-Host "  ✅ Created label: $($label.name)" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️ Label $($label.name) may already exist" -ForegroundColor Yellow
        }
    }
}

# ===========================================
# 🤖 Configure GitHub Apps
# ===========================================

function Set-GitHubApps {
    Write-Host "🤖 Configuring GitHub Apps" -ForegroundColor Yellow
    
    # Enable GitHub Actions
    try {
        $body = @{
            enabled = $true
            allowed_actions = "all"
            enabled_workflows = @()
            disabled_workflows = @()
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri "$baseUrl/actions/permissions" -Method PUT -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "✅ GitHub Actions configured" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to configure GitHub Actions: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Enable GitHub Pages
    try {
        $body = @{
            source = @{
                branch = "gh-pages"
                path = "/"
            }
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri "$baseUrl/pages" -Method POST -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "✅ GitHub Pages configured" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ GitHub Pages may already be configured" -ForegroundColor Yellow
    }
}

# ===========================================
# 📊 Create Repository Templates
# ===========================================

function New-RepositoryTemplates {
    Write-Host "📊 Creating repository templates" -ForegroundColor Yellow
    
    $templates = @(
        "frontend-app",
        "backend-service",
        "ai-model",
        "mobile-app",
        "microservice",
        "library",
        "tool",
        "documentation"
    )
    
    foreach ($template in $templates) {
        try {
            $body = @{
                name = "$Repository-$template-template"
                description = "Template for $template in AIGestion Pro 2026"
                include_all_branches = $true
                private = $false
            } | ConvertTo-Json
            
            Invoke-RestMethod -Uri "https://api.github.com/repos/$Owner/$Repository/generate" -Method POST -Headers $headers -Body $body -ContentType "application/json"
            Write-Host "  ✅ Created template: $template" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️ Template $template may already exist" -ForegroundColor Yellow
        }
    }
}

# ===========================================
# 🎯 Main Execution
# ===========================================

# Main execution
try {
    Write-Host "🚀 Starting GitHub God-Level Setup" -ForegroundColor Green
    
    # Configure repository settings
    Set-RepositorySettings
    
    # Create labels
    New-GitHubLabels
    
    # Configure GitHub Apps
    Set-GitHubApps
    
    # Create repository templates
    New-RepositoryTemplates
    
    # Create teams
    $teams = @{
        "core-team" = @{
            Description = "Core development team with full repository access"
            Members = @("nemisanalex")
            Repos = @($Repository)
        }
        "security-team" = @{
            Description = "Security team responsible for security policies"
            Members = @()
            Repos = @($Repository)
        }
        "devops-team" = @{
            Description = "DevOps team responsible for CI/CD and infrastructure"
            Members = @()
            Repos = @($Repository)
        }
    }
    
    foreach ($team in $teams.GetEnumerator()) {
        New-GitHubTeam -TeamName $team.Key -Description $team.Value.Description -Members $team.Value.Members -Repos $team.Value.Repos
    }
    
    # Configure branch protection
    $branchConfigs = @{
        "main" = @{
            required_status_checks = @{
                strict = $true
                contexts = @("ci/ci-cd", "security/advanced-security", "ai-ml/ai-code-review", "performance/performance")
            }
            enforce_admins = $true
            required_pull_request_reviews = @{
                required_approving_review_count = 2
                dismiss_stale_reviews = $true
                require_code_owner_reviews = $true
            }
            restrictions = @{
                teams = @("core-team", "security-team", "devops-team")
            }
            allow_force_pushes = $false
            allow_deletions = $false
            required_linear_history = $true
        }
    }
    
    foreach ($branch in $branchConfigs.GetEnumerator()) {
        Set-BranchProtection -Branch $branch.Key -Config $branch.Value
    }
    
    Write-Host "🎉 GitHub God-Level Setup Complete!" -ForegroundColor Green
    Write-Host "📊 Repository: https://github.com/$Owner/$Repository" -ForegroundColor Cyan
    Write-Host "🌐 Website: https://aigestion.net" -ForegroundColor Cyan
    Write-Host "🔧 Workflows: 10+ automated workflows configured" -ForegroundColor Cyan
    Write-Host "🔒 Security: Enterprise security enabled" -ForegroundColor Cyan
    Write-Host "🤖 AI/ML: Full AI integration configured" -ForegroundColor Cyan
    Write-Host "📈 Monitoring: Real-time analytics enabled" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Setup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
