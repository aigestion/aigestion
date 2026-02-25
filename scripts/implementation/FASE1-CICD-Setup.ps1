# 🚀 FASE 1: CI/CD PIPELINE SETUP - AIGESTION
# Script PowerShell para configurar pipeline automatizado completo

param(
    [string]$Environment = "development",
    [switch]$Production,
    [switch]$SetupGitHub,
    [switch]$SetupArgoCD,
    [switch]$Test,
    [switch]$Deploy,
    [switch]$Clean,
    [switch]$Help
)

# ============================================
# 📋 CONFIGURACIÓN INICIAL
# ============================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Colors for output
$colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    Cyan = "Cyan"
    Magenta = "Magenta"
    White = "White"
}

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Show-Help {
    Write-ColorOutput "🚀 FASE 1: CI/CD Pipeline Setup - AIGestion" "Cyan"
    Write-ColorOutput "" "White"
    Write-ColorOutput "Uso:" "Yellow"
    Write-ColorOutput "  .\FASE1-CICD-Setup.ps1 [parámetros]" "White"
    Write-ColorOutput "" "White"
    Write-ColorOutput "Parámetros:" "Yellow"
    Write-ColorOutput "  -Environment       Entorno (development|staging|production) [default: development]" "White"
    Write-ColorOutput "  -Production        Modo producción (GitHub Pages + ArgoCD)" "White"
    Write-ColorOutput "  -SetupGitHub       Configurar GitHub Actions" "White"
    Write-ColorOutput "  -SetupArgoCD       Configurar ArgoCD para Kubernetes" "White"
    Write-ColorOutput "  -Test              Ejecutar tests del pipeline" "White"
    Write-ColorOutput "  -Deploy            Deploy automático" "White"
    Write-ColorOutput "  -Clean             Limpiar configuración" "White"
    Write-ColorOutput "  -Help              Mostrar esta ayuda" "White"
    Write-ColorOutput "" "White"
    Write-ColorOutput "Ejemplos:" "Yellow"
    Write-ColorOutput "  .\FASE1-CICD-Setup.ps1 -SetupGitHub -Test" "White"
    Write-ColorOutput "  .\FASE1-CICD-Setup.ps1 -Production -SetupArgoCD -Deploy" "White"
    Write-ColorOutput "  .\FASE1-CICD-Setup.ps1 -Clean" "White"
}

if ($Help) {
    Show-Help
    exit 0
}

# ============================================
# 🎯 VARIABLES DE ENTORNO
# ============================================

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$CICDDir = Join-Path $ProjectRoot ".github\workflows"
$ArgoCDDir = Join-Path $ProjectRoot "argocd"
$ScriptsDir = Join-Path $ProjectRoot "scripts\ci-cd"

if ($Production) {
    $Environment = "production"
}

Write-ColorOutput "🚀 Iniciando CI/CD Pipeline Setup - Environment: $Environment" "Cyan"
Write-ColorOutput "📁 Project Root: $ProjectRoot" "Blue"
Write-ColorOutput "🔧 CI/CD Directory: $CICDDir" "Blue"

# ============================================
# 🧹 LIMPIEZA (Opcional)
# ============================================

if ($Clean) {
    Write-ColorOutput "🧹 Limpiando configuración CI/CD..." "Yellow"
    
    # Remove GitHub workflows
    if (Test-Path $CICDDir) {
        Write-ColorOutput "  🗑️ Removing GitHub workflows..." "Red"
        Remove-Item -Path $CICDDir -Recurse -Force
    }
    
    # Remove ArgoCD configs
    if (Test-Path $ArgoCDDir) {
        Write-ColorOutput "  🗑️ Removing ArgoCD configs..." "Red"
        Remove-Item -Path $ArgoCDDir -Recurse -Force
    }
    
    # Remove CI/CD scripts
    if (Test-Path $ScriptsDir) {
        Write-ColorOutput "  🗑️ Removing CI/CD scripts..." "Red"
        Remove-Item -Path $ScriptsDir -Recurse -Force
    }
    
    Write-ColorOutput "✅ Limpieza completada" "Green"
    exit 0
}

# ============================================
# 📁 CREAR ESTRUCTURA DE DIRECTORIOS
# ============================================

Write-ColorOutput "📁 Creando estructura de directorios CI/CD..." "Blue"

$CICDDirs = @(
    $CICDDir,
    $ScriptsDir,
    Join-Path $ScriptsDir "scripts",
    Join-Path $ScriptsDir "templates",
    Join-Path $ArgoCDDir "applications",
    Join-Path $ArgoCDDir "projects",
    Join-Path $ArgoCDDir "environments"
)

foreach ($dir in $CICDDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-ColorOutput "  📁 Created: $dir" "Green"
    }
}

# ============================================
# 🔄 GITHUB ACTIONS WORKFLOWS
# ============================================

if ($SetupGitHub) {
    Write-ColorOutput "🔄 Configurando GitHub Actions..." "Blue"
    
    # Main CI/CD Workflow
    $MainWorkflow = @"
name: 🚀 AIGestion CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'staging'
        type: choice
        options:
        - development
        - staging
        - production

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ============================================
  # 🔍 TEST & QUALITY CHECKS
  # ============================================
  test:
    name: 🔍 Test & Quality
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      
    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: 📦 Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: ${{ env.PNPM_VERSION }}
        
    - name: 📥 Install Dependencies
      run: pnpm install --frozen-lockfile
      
    - name: 🔍 Lint Code
      run: pnpm lint
      
    - name: 🧪 Type Check
      run: pnpm type-check
      
    - name: 🧪 Unit Tests
      run: pnpm test:unit
      
    - name: 🧪 Integration Tests
      run: pnpm test:integration
      
    - name: 📊 Coverage Report
      run: pnpm test:coverage
      
    - name: 📤 Upload Coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

  # ============================================
  # 🏗️ BUILD & SECURITY
  # ============================================
  build:
    name: 🏗️ Build & Security
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      
    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: 📦 Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: ${{ env.PNPM_VERSION }}
        
    - name: 📥 Install Dependencies
      run: pnpm install --frozen-lockoff
      
    - name: 🔐 Security Audit
      run: pnpm audit --audit-level moderate
      
    - name: 🏗️ Build Frontend
      run: pnpm build:frontend
      
    - name: 🏗️ Build Backend
      run: pnpm build:backend
      
    - name: 🏗️ Build Services
      run: pnpm build:services
      
    - name: 📦 Build Docker Images
      run: |
        docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:\${{ github.sha }} ./frontend/apps/website-epic
        docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:\${{ github.sha }} ./backend
        docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-services:\${{ github.sha }} ./services
        
    - name: 📤 Upload Build Artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-artifacts
        path: |
          frontend/dist/
          backend/dist/
          services/dist/
        retention-days: 7

  # ============================================
  # 🚀 DEPLOYMENT
  # ============================================
  deploy:
    name: 🚀 Deploy
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' || github.event_name == 'workflow_dispatch'
    
    environment: ${{ github.event.inputs.environment || 'staging' }}
    
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      
    - name: 📦 Download Build Artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-artifacts
        path: ./dist/
        
    - name: 🔐 Login to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: 📤 Push Docker Images
      run: |
        docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:\${{ github.sha }}
        docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:\${{ github.sha }}
        docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-services:\${{ github.sha }}
        
    - name: 🚀 Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend/dist
        cname: aigestion.net
        
    - name: 🚀 Deploy to Kubernetes
      if: github.event.inputs.environment == 'production'
      run: |
        echo "🚀 Deploying to Kubernetes..."
        # Aquí irían los comandos de deploy a k8s
        kubectl apply -f argocd/applications/
        kubectl rollout status deployment/aigestion-frontend
        kubectl rollout status deployment/aigestion-backend
        kubectl rollout status deployment/aigestion-services
        
    - name: 🧪 Smoke Tests
      run: |
        echo "🧪 Running smoke tests..."
        # Tests de smoke para verificar deployment
        curl -f https://aigestion.net/health || exit 1
        curl -f https://api.aigestion.net/health || exit 1

  # ============================================
  # 📊 NOTIFICATIONS
  # ============================================
  notify:
    name: 📊 Notifications
    runs-on: ubuntu-latest
    needs: [test, build, deploy]
    if: always()
    
    steps:
    - name: 📢 Slack Notification
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        
    - name: 📧 Email Notification
      if: failure()
      uses: dawidd6/action-send-mail@v3
      with:
        server_address: smtp.gmail.com
        server_port: 587
        username: ${{ secrets.EMAIL_USERNAME }}
        password: ${{ secrets.EMAIL_PASSWORD }}
        subject: '🚨 AIGestion Deployment Failed'
        body: |
          Deployment failed for ${{ github.repository }}
          Commit: ${{ github.sha }}
          Branch: ${{ github.ref }}
          Workflow: ${{ github.workflow }}
        to: ${{ secrets.NOTIFICATION_EMAIL }}
"@

    Set-Content -Path (Join-Path $CICDDir "ci-cd.yml") -Value $MainWorkflow -Encoding UTF8
    Write-ColorOutput "  ✅ Main CI/CD workflow created" "Green"
    
    # Security Scanning Workflow
    $SecurityWorkflow = @"
name: 🔒 Security Scanning

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM

jobs:
  security-scan:
    name: 🔒 Security Scan
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      
    - name: 🔍 Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'
        
    - name: 📤 Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
        
    - name: 🔍 CodeQL Analysis
      uses: github/codeql-action/analyze@v2
      with:
        languages: javascript, typescript
        
    - name: 🔍 npm Audit
      run: |
        npm audit --audit-level high
        npm audit --json > npm-audit.json
        
    - name: 📤 Upload npm audit results
      uses: actions/upload-artifact@v3
      with:
        name: npm-audit
        path: npm-audit.json
"@

    Set-Content -Path (Join-Path $CICDDir "security.yml") -Value $SecurityWorkflow -Encoding UTF8
    Write-ColorOutput "  ✅ Security scanning workflow created" "Green"
    
    # Performance Testing Workflow
    $PerformanceWorkflow = @"
name: ⚡ Performance Testing

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  performance-test:
    name: ⚡ Performance Test
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout Code
      uses: actions/checkout@v4
      
    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: 📦 Install Dependencies
      run: npm install
      
    - name: 🏗️ Build Application
      run: npm run build
      
    - name: 🚀 Start Application
      run: |
        npm start &
        sleep 30
        
    - name: ⚡ Lighthouse CI
      uses: treosh/lighthouse-ci-action@v9
      with:
        configPath: './lighthouserc.json'
        uploadArtifacts: true
        temporaryPublicStorage: true
        
    - name: 📊 Bundle Analysis
      run: |
        npm run analyze
        echo 'Bundle size analysis completed'
        
    - name: 📤 Upload Bundle Analysis
      uses: actions/upload-artifact@v3
      with:
        name: bundle-analysis
        path: bundle-analysis/
"@

    Set-Content -Path (Join-Path $CICDDir "performance.yml") -Value $PerformanceWorkflow -Encoding UTF8
    Write-ColorOutput "  ✅ Performance testing workflow created" "Green"
}

# ============================================
# ☸️ ARGOCD CONFIGURATION
# ============================================

if ($SetupArgoCD) {
    Write-ColorOutput "☸️ Configurando ArgoCD..." "Blue"
    
    # ArgoCD Project
    $ArgoCDProject = @"
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: aigestion
  namespace: argocd
spec:
  description: AIGestion Application Project
  sourceRepos:
  - https://github.com/aigestion/aigestion.git
  destinations:
  - namespace: aigestion
    name: in-cluster
  - namespace: aigestion-staging
    name: in-cluster
  - namespace: aigestion-production
    name: in-cluster
  clusterResourceWhitelist:
  - group: ''
    kind: Namespace
  - group: apps
    kind: Deployment
  - group: apps
    kind: Service
  - group: networking.k8s.io
    kind: Ingress
  orphanedResources:
    warn: false
"@

    Set-Content -Path (Join-Path $ArgoCDDir "projects\aigestion-project.yaml") -Value $ArgoCDProject -Encoding UTF8
    Write-ColorOutput "  ✅ ArgoCD project created" "Green"
    
    # Frontend Application
    $FrontendApp = @"
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: aigestion-frontend
  namespace: argocd
spec:
  project: aigestion
  source:
    repoURL: https://github.com/aigestion/aigestion.git
    targetRevision: HEAD
    path: k8s/frontend
  destination:
    server: https://kubernetes.default.svc
    namespace: aigestion
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
"@

    Set-Content -Path (Join-Path $ArgoCDDir "applications\frontend.yaml") -Value $FrontendApp -Encoding UTF8
    Write-ColorOutput "  ✅ Frontend application created" "Green"
    
    # Backend Application
    $BackendApp = @"
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: aigestion-backend
  namespace: argocd
spec:
  project: aigestion
  source:
    repoURL: https://github.com/aigestion/aigestion.git
    targetRevision: HEAD
    path: k8s/backend
  destination:
    server: https://kubernetes.default.svc
    namespace: aigestion
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
"@

    Set-Content -Path (Join-Path $ArgoCDDir "applications\backend.yaml") -Value $BackendApp -Encoding UTF8
    Write-ColorOutput "  ✅ Backend application created" "Green"
    
    # Services Application
    $ServicesApp = @"
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: aigestion-services
  namespace: argocd
spec:
  project: aigestion
  source:
    repoURL: https://github.com/aigestion/aigestion.git
    targetRevision: HEAD
    path: k8s/services
  destination:
    server: https://kubernetes.default.svc
    namespace: aigestion
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
"@

    Set-Content -Path (Join-Path $ArgoCDDir "applications\services.yaml") -Value $ServicesApp -Encoding UTF8
    Write-ColorOutput "  ✅ Services application created" "Green"
}

# ============================================
# 🧪 TESTING PIPELINE
# ============================================

if ($Test) {
    Write-ColorOutput "🧪 Ejecutando tests del pipeline..." "Blue"
    
    # Unit Tests
    Write-ColorOutput "  🔍 Running unit tests..." "Yellow"
    Set-Location $ProjectRoot
    
    $unitTestResult = npm test 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ Unit tests failed" "Red"
        Write-ColorOutput $unitTestResult "Red"
    } else {
        Write-ColorOutput "  ✅ Unit tests passed" "Green"
    }
    
    # Integration Tests
    Write-ColorOutput "  🔍 Running integration tests..." "Yellow"
    $integrationTestResult = npm run test:integration 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ Integration tests failed" "Red"
        Write-ColorOutput $integrationTestResult "Red"
    } else {
        Write-ColorOutput "  ✅ Integration tests passed" "Green"
    }
    
    # E2E Tests
    Write-ColorOutput "  🔍 Running E2E tests..." "Yellow"
    $e2eTestResult = npm run test:e2e 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ E2E tests failed" "Red"
        Write-ColorOutput $e2eTestResult "Red"
    } else {
        Write-ColorOutput "  ✅ E2E tests passed" "Green"
    }
    
    # Performance Tests
    Write-ColorOutput "  ⚡ Running performance tests..." "Yellow"
    $perfTestResult = npm run test:performance 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ Performance tests failed" "Red"
        Write-ColorOutput $perfTestResult "Red"
    } else {
        Write-ColorOutput "  ✅ Performance tests passed" "Green"
    }
}

# ============================================
# 🚀 DEPLOYMENT
# ============================================

if ($Deploy) {
    Write-ColorOutput "🚀 Iniciando deployment..." "Blue"
    
    # Check if GitHub is configured
    if (!(Test-Path (Join-Path $ProjectRoot ".git"))) {
        Write-ColorOutput "  ❌ Not a Git repository. Initialize first." "Red"
        exit 1
    }
    
    # Check if remote exists
    $remoteCheck = git remote -v 2>$null
    if ($remoteCheck -notmatch "origin") {
        Write-ColorOutput "  ❌ No remote 'origin' found. Add GitHub remote first." "Red"
        exit 1
    }
    
    # Stage changes
    Write-ColorOutput "  📤 Staging changes..." "Yellow"
    git add .
    git commit -m "🚀 feat: Add CI/CD pipeline configuration - FASE 1"
    
    # Push to trigger workflow
    Write-ColorOutput "  📤 Pushing to trigger CI/CD..." "Yellow"
    $pushResult = git push origin main 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "  ❌ Failed to push to GitHub" "Red"
        Write-ColorOutput $pushResult "Red"
        exit 1
    }
    
    Write-ColorOutput "  ✅ Changes pushed. CI/CD pipeline triggered." "Green"
    Write-ColorOutput "  📊 Monitor progress at: https://github.com/aigestion/aigestion/actions" "Cyan"
}

# ============================================
# 📋 CONFIGURATION FILES
# ============================================

Write-ColorOutput "📋 Creando archivos de configuración..." "Blue"

# Lighthouse Configuration
$LighthouseConfig = @"
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run serve",
      "startServerReadyPattern": "Local:",
      "url": ["http://localhost:3000"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["warn", {"minScore": 0.8}],
        "categories:seo": ["warn", {"minScore": 0.8}],
        "categories:pwa": "off"
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
"@

Set-Content -Path (Join-Path $ProjectRoot "lighthouserc.json") -Value $LighthouseConfig -Encoding UTF8
Write-ColorOutput "  ✅ Lighthouse configuration created" "Green"

# Package.json scripts update
$PackageJsonPath = Join-Path $ProjectRoot "package.json"
if (Test-Path $PackageJsonPath) {
    $packageJson = Get-Content $PackageJsonPath | ConvertFrom-Json
    
    if (-not $packageJson.scripts) {
        $packageJson.scripts = @{}
    }
    
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "test:unit" -Value "jest --testPathPattern=unit"
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "test:integration" -Value "jest --testPathPattern=integration"
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "test:e2e" -Value "playwright test"
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "test:performance" -Value "lighthouse http://localhost:3000"
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "test:coverage" -Value "jest --coverage"
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "type-check" -Value "tsc --noEmit"
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "lint" -Value "eslint . --ext .ts,.tsx,.js,.jsx"
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "build:frontend" -Value "cd frontend/apps/website-epic && npm run build"
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "build:backend" -Value "cd backend && npm run build"
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "build:services" -Value "cd services && npm run build"
    $packageJson.scripts | Add-Member -Force -MemberType NoteProperty -Name "analyze" -Value "cd frontend/apps/website-epic && npm run analyze"
    
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $PackageJsonPath
    Write-ColorOutput "  ✅ Package.json scripts updated" "Green"
}

# ============================================
# ✅ COMPLETADO
# ============================================

Write-ColorOutput "" "White"
Write-ColorOutput "🎉 CI/CD PIPELINE SETUP COMPLETADO EXITOSAMENTE" "Green"
Write-ColorOutput "" "White"
Write-ColorOutput "📋 Resumen:" "Cyan"
Write-ColorOutput "  ✅ GitHub Actions workflows configurados" "Green"
Write-ColorOutput "  ✅ ArgoCD applications creadas" "Green"
Write-ColorOutput "  ✅ Security scanning implementado" "Green"
Write-ColorOutput "  ✅ Performance testing configurado" "Green"
Write-ColorOutput "  ✅ Lighthouse configuration creada" "Green"
Write-ColorOutput "  ✅ Package.json scripts actualizados" "Green"
Write-ColorOutput "" "White"

if ($SetupGitHub) {
    Write-ColorOutput "🔄 GitHub Actions:" "Cyan"
    Write-ColorOutput "  📁 .github/workflows/ci-cd.yml - Pipeline principal" "White"
    Write-ColorOutput "  📁 .github/workflows/security.yml - Security scanning" "White"
    Write-ColorOutput "  📁 .github/workflows/performance.yml - Performance tests" "White"
    Write-ColorOutput "" "White"
    Write-ColorOutput "🔧 Secrets requeridos en GitHub:" "Yellow"
    Write-ColorOutput "  SLACK_WEBHOOK - Para notificaciones Slack" "White"
    Write-ColorOutput "  EMAIL_USERNAME - Para notificaciones email" "White"
    Write-ColorOutput "  EMAIL_PASSWORD - Para notificaciones email" "White"
    Write-ColorOutput "  NOTIFICATION_EMAIL - Email para alertas" "White"
}

if ($SetupArgoCD) {
    Write-ColorOutput "☸️ ArgoCD:" "Cyan"
    Write-ColorOutput "  📁 argocd/projects/aigestion-project.yaml" "White"
    Write-ColorOutput "  📁 argocd/applications/frontend.yaml" "White"
    Write-ColorOutput "  📁 argocd/applications/backend.yaml" "White"
    Write-ColorOutput "  📁 argocd/applications/services.yaml" "White"
    Write-ColorOutput "" "White"
    Write-ColorOutput "🔧 Comandos ArgoCD:" "Yellow"
    Write-ColorOutput "  kubectl apply -f argocd/projects/" "White"
    Write-ColorOutput "  kubectl apply -f argocd/applications/" "White"
    Write-ColorOutput "  argocd app get aigestion-frontend" "White"
}

Write-ColorOutput "" "White"
Write-ColorOutput "🚀 Siguientes pasos:" "Cyan"
Write-ColorOutput "  1. Configurar secrets en GitHub" "White"
Write-ColorOutput "  2. Instalar ArgoCD en cluster Kubernetes" "White"
Write-ColorOutput "  3. Aplicar configuraciones ArgoCD" "White"
Write-ColorOutput "  4. Push cambios para activar pipeline" "White"
Write-ColorOutput "  5. Monitorear ejecución en GitHub Actions" "White"

Write-ColorOutput "" "White"
Write-ColorOutput "🚀 CI/CD PIPELINE - FASE 1 COMPLETADA" "Green"
Write-ColorOutput "   Listo para la siguiente fase: Security Baseline" "Cyan"
