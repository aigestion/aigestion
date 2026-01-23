#!/bin/bash

# Security Setup Script for AIGestion
# This script helps set up and configure security measures

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root"
        exit 1
    fi
}

# Install security tools
install_security_tools() {
    log "Installing security tools..."

    # Install Node.js security tools
    if command -v npm &> /dev/null; then
        log "Installing Node.js security tools..."
        npm install -g audit-ci
        npm install -g snyk
        npm install -g retire
    fi

    # Install Python security tools
    if command -v pip3 &> /dev/null; then
        log "Installing Python security tools..."
        pip3 install safety
        pip3 install bandit
        pip3 install pip-audit
    fi

    # Install Docker security tools
    if command -v docker &> /dev/null; then
        log "Installing Trivy..."
        if ! command -v trivy &> /dev/null; then
            sudo apt-get update
            sudo apt-get install wget apt-transport-https gnupg lsb-release
            wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
            echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
            sudo apt-get update
            sudo apt-get install trivy
        fi
    fi

    # Install Gitleaks
    if ! command -v gitleaks &> /dev/null; then
        log "Installing Gitleaks..."
        wget https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks-linux-amd64
        chmod +x gitleaks-linux-amd64
        sudo mv gitleaks-linux-amd64 /usr/local/bin/gitleaks
    fi

    success "Security tools installed successfully"
}

# Setup security environment variables
setup_security_env() {
    log "Setting up security environment variables..."

    local env_file=".env"

    if [ ! -f "$env_file" ]; then
        warning ".env file not found. Creating with security defaults..."
        cat > "$env_file" << EOF
# Security Configuration
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_FREE_MAX=100
RATE_LIMIT_PRO_MAX=1000
RATE_LIMIT_ENTERPRISE_MAX=10000
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=5
AI_RATE_LIMIT_WINDOW_MS=60000
AI_RATE_LIMIT_MAX=10
UPLOAD_RATE_LIMIT_WINDOW_MS=3600000
UPLOAD_RATE_LIMIT_MAX=10

# CSP
CSP_REPORT_ONLY=false

# API Security
REQUIRE_API_KEY=true
API_KEY_FORMAT=nexus_[a-f0-9]{32}

# File Upload
MAX_FILE_SIZE=10mb
MAX_FILES=5
SCAN_UPLOADS_FOR_MALWARE=true

# IP Security
ENABLE_IP_BLOCKING=true
BLOCKED_IPS=
RATE_LIMIT_BY_IP=true
ENABLE_GEOBLOCKING=false
ALLOWED_COUNTRIES=
BLOCKED_COUNTRIES=

# Monitoring
LOG_SECURITY_EVENTS=true
SECURITY_LOG_LEVEL=warn
ENABLE_SECURITY_METRICS=true

# Session Security
SESSION_MAX_AGE=86400000
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=strict
SESSION_ROLLING=true
EOF
        success "Created .env file with security defaults"
    else
        log ".env file exists. Checking security variables..."

        # Add missing security variables
        local security_vars=(
            "RATE_LIMIT_WINDOW_MS=900000"
            "RATE_LIMIT_FREE_MAX=100"
            "RATE_LIMIT_PRO_MAX=1000"
            "RATE_LIMIT_ENTERPRISE_MAX=10000"
            "AUTH_RATE_LIMIT_WINDOW_MS=900000"
            "AUTH_RATE_LIMIT_MAX=5"
            "AI_RATE_LIMIT_WINDOW_MS=60000"
            "AI_RATE_LIMIT_MAX=10"
            "UPLOAD_RATE_LIMIT_WINDOW_MS=3600000"
            "UPLOAD_RATE_LIMIT_MAX=10"
            "CSP_REPORT_ONLY=false"
            "REQUIRE_API_KEY=true"
            "MAX_FILE_SIZE=10mb"
            "MAX_FILES=5"
            "SCAN_UPLOADS_FOR_MALWARE=true"
            "ENABLE_IP_BLOCKING=true"
            "LOG_SECURITY_EVENTS=true"
            "SECURITY_LOG_LEVEL=warn"
            "ENABLE_SECURITY_METRICS=true"
        )

        for var in "${security_vars[@]}"; do
            local key=$(echo "$var" | cut -d'=' -f1)
            if ! grep -q "^$key=" "$env_file"; then
                echo "$var" >> "$env_file"
                log "Added $key to .env"
            fi
        done

        success "Security environment variables configured"
    fi
}

# Setup GitHub secrets
setup_github_secrets() {
    log "Setting up GitHub secrets guide..."

    cat > "github-secrets-guide.md" << EOF
# GitHub Secrets Setup Guide

## Required Secrets for Security Workflows

### 1. Snyk Token
\`\`\`bash
# Install Snyk CLI
npm install -g snyk

# Authenticate
snyk auth
\`\`\`

Add to GitHub Secrets:
- \`SNYK_TOKEN\`: Your Snyk authentication token

### 2. Gitleaks License (Optional)
\`\`\`bash
# Get license from https://gitleaks.io/
\`\`\`

Add to GitHub Secrets:
- \`GITLEAKS_LICENSE\`: Your Gitleaks license key

### 3. Database Credentials
\`\`\`bash
# Generate secure passwords
openssl rand -base64 32
\`\`\`

Add to GitHub Secrets:
- \`DATABASE_URL\`: Database connection string
- \`REDIS_URL\`: Redis connection string
- \`MONGODB_URL\`: MongoDB connection string

### 4. API Keys
\`\`\`bash
# Generate API keys
openssl rand -hex 16
\`\`\`

Add to GitHub Secrets:
- \`OPENAI_API_KEY\`: OpenAI API key
- \`ANTHROPIC_API_KEY\`: Anthropic API key
- \`GOOGLE_APPLICATION_CREDENTIALS\`: Google service account
\`\`\`

## Setting Secrets in GitHub

1. Go to your repository
2. Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each secret from the list above

## Environment-Specific Secrets

### Development
- \`DEV_DATABASE_URL\`
- \`DEV_REDIS_URL\`

### Production
- \`PROD_DATABASE_URL\`
- \`PROD_REDIS_URL\`
- \`PROD_JWT_SECRET\`

EOF

    success "GitHub secrets guide created: github-secrets-guide.md"
}

# Setup security monitoring
setup_monitoring() {
    log "Setting up security monitoring..."

    # Create monitoring directory
    mkdir -p monitoring/security

    # Create security monitoring script
    cat > "monitoring/security/security-monitor.sh" << 'EOF'
#!/bin/bash

# Security Monitoring Script
# Monitors security events and sends alerts

LOG_FILE="/var/log/nexus-security.log"
ALERT_THRESHOLD=10

# Check for failed authentication attempts
check_auth_failures() {
    local count=$(grep "Failed authentication" "$LOG_FILE" | wc -l)
    if [ "$count" -gt "$ALERT_THRESHOLD" ]; then
        echo "ALERT: $count failed authentication attempts detected"
        # Send alert (integrate with your alerting system)
    fi
}

# Check for suspicious IPs
check_suspicious_ips() {
    local suspicious_ips=$(grep "Suspicious request" "$LOG_FILE" | awk '{print $8}' | sort | uniq -c | sort -nr | head -5)
    if [ -n "$suspicious_ips" ]; then
        echo "ALERT: Suspicious activity detected from IPs:"
        echo "$suspicious_ips"
    fi
}

# Check rate limit violations
check_rate_limits() {
    local violations=$(grep "Rate limit exceeded" "$LOG_FILE" | wc -l)
    if [ "$violations" -gt 0 ]; then
        echo "ALERT: $violations rate limit violations detected"
    fi
}

# Run checks
check_auth_failures
check_suspicious_ips
check_rate_limits
EOF

    chmod +x "monitoring/security/security-monitor.sh"
    success "Security monitoring setup completed"
}

# Setup security policies
setup_policies() {
    log "Setting up security policies..."

    # Create security policy directory
    mkdir -p policies/security

    # Create password policy
    cat > "policies/security/password-policy.md" << EOF
# Password Policy

## Requirements
- Minimum length: 12 characters
- Must include: uppercase, lowercase, numbers, special characters
- Cannot contain common words or patterns
- Must be changed every 90 days
- Cannot reuse last 5 passwords

## Implementation
\`\`\`javascript
const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  historyCount: 5
};
\`\`\`
EOF

    # Create data classification policy
    cat > "policies/security/data-classification.md" << EOF
# Data Classification Policy

## Classification Levels

### Public
- Marketing materials
- Product documentation
- Public APIs

### Internal
- Internal documentation
- Employee information
- Development plans

### Confidential
- Customer data
- Financial information
- Source code

### Restricted
- Encryption keys
- API keys
- Personal identifiable information (PII)

## Handling Requirements

### Public Data
- No special handling required
- Can be shared freely

### Internal Data
- Internal access only
- VPN required for remote access

### Confidential Data
- Encryption at rest and in transit
- Access logging required
- Need-to-know basis

### Restricted Data
- End-to-end encryption
- Multi-factor authentication
- Audit trails required
- Regular access reviews
EOF

    success "Security policies created"
}

# Run security audit
run_security_audit() {
    log "Running initial security audit..."

    # Make scripts executable
    chmod +x scripts/security-audit.js
    chmod +x scripts/vulnerability-scan.sh

    # Run Node.js dependency audit
    if [ -f "package.json" ]; then
        log "Running Node.js security audit..."
        node scripts/security-audit.js || true
    fi

    # Run vulnerability scan
    log "Running vulnerability scan..."
    ./scripts/vulnerability-scan.sh || true

    success "Initial security audit completed"
}

# Main function
main() {
    log "Starting AIGestion security setup..."

    check_root
    install_security_tools
    setup_security_env
    setup_github_secrets
    setup_monitoring
    setup_policies
    run_security_audit

    success "Security setup completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Review and update .env file with your specific values"
    echo "2. Set up GitHub secrets using github-secrets-guide.md"
    echo "3. Configure your monitoring and alerting systems"
    echo "4. Review security policies in policies/security/"
    echo "5. Schedule regular security scans"
    echo
    echo "For more information, see docs/SECURITY_GUIDE.md"
}

# Run main function
main "$@"
