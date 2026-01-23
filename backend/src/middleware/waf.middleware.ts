import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * Web Application Firewall (WAF) Middleware
 * Protects against common web attacks and malicious requests
 */

interface WAFRule {
  name: string;
  enabled: boolean;
  pattern: RegExp;
  action: 'block' | 'warn' | 'log';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface WAFStats {
  totalRequests: number;
  blockedRequests: number;
  warnings: number;
  rulesTriggered: { [ruleName: string]: number };
}

class WebApplicationFirewall {
  private rules: WAFRule[] = [];
  private stats: WAFStats = {
    totalRequests: 0,
    blockedRequests: 0,
    warnings: 0,
    rulesTriggered: {},
  };

  constructor() {
    this.initializeRules();
  }

  private initializeRules() {
    this.rules = [
      // SQL Injection Detection
      {
        name: 'SQL_INJECTION',
        enabled: true,
        pattern:
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b|\b(OR|AND)\s+\d+\s*=\s*\d+|\'\s*OR\s*\d+\s*=\s*\d+|\'\s*OR\s*\'\w+\'\s*=\s*\'\w+\'|\'\s*;\s*DROP|\'\s*;\s*DELETE|\'\s*;\s*INSERT)/i,
        action: 'block',
        description: 'Detects SQL injection attempts',
        severity: 'critical',
      },

      // XSS Detection
      {
        name: 'XSS_ATTACK',
        enabled: true,
        pattern:
          /(<script[^>]*>.*?<\/script>|<iframe[^>]*>.*?<\/iframe>|javascript:|on\w+\s*=|<img[^>]*src\s*=\s*["\']?javascript:|<object[^>]*data\s*=\s*["\']?javascript:|eval\s*\(|alert\s*\(|confirm\s*\(|prompt\s*\()/i,
        action: 'block',
        description: 'Detects Cross-Site Scripting attempts',
        severity: 'high',
      },

      // Path Traversal Detection
      {
        name: 'PATH_TRAVERSAL',
        enabled: true,
        pattern: /(\.\.[\/\\])/,
        action: 'block',
        description: 'Detects path traversal attacks',
        severity: 'high',
      },

      // Command Injection Detection
      {
        name: 'COMMAND_INJECTION',
        enabled: true,
        pattern:
          /(;|\||&|\$\(|\`|\$\{)(\s*(rm|del|format|fdisk|cat|type|more|less|head|tail|grep|find|ls|dir|whoami|id|uname|ps|netstat|ipconfig|ifconfig|ping|curl|wget|nc|telnet|ssh|ftp|scp|rsync)\s)/i,
        action: 'block',
        description: 'Detects command injection attempts',
        severity: 'critical',
      },

      // LDAP Injection Detection
      {
        name: 'LDAP_INJECTION',
        enabled: true,
        pattern: /(\*|\(|\)|\\|\||&|!|=|<|>|~)/,
        action: 'warn',
        description: 'Detects potential LDAP injection',
        severity: 'medium',
      },

      // NoSQL Injection Detection
      {
        name: 'NOSQL_INJECTION',
        enabled: true,
        pattern: /(\$where|\$ne|\$gt|\$lt|\$regex|\$in|\$nin|\$exists|\$or|\$and|\$not|\$nor)/i,
        action: 'block',
        description: 'Detects NoSQL injection attempts',
        severity: 'high',
      },

      // XXE (XML External Entity) Detection
      {
        name: 'XXE_ATTACK',
        enabled: true,
        pattern: /(<\?xml|<!DOCTYPE|&lt;!ENTITY|&lt;!ATTLIST|SYSTEM|PUBLIC)/i,
        action: 'block',
        description: 'Detects XXE attacks',
        severity: 'critical',
      },

      // SSRF (Server-Side Request Forgery) Detection
      {
        name: 'SSRF_ATTACK',
        enabled: true,
        pattern:
          /(http:\/\/|https:\/\/|ftp:\/\/)(localhost|127\.0\.0\.1|0\.0\.0\.0|::1|169\.254\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|metadata|internal|private)/i,
        action: 'block',
        description: 'Detects SSRF attempts',
        severity: 'high',
      },

      // File Inclusion Detection
      {
        name: 'FILE_INCLUSION',
        enabled: true,
        pattern:
          /(php:\/\/|file:\/\/|data:\/\/|expect:\/\/|zip:\/\/|phar:\/\/|glob:\/\/|ssh2:\/\/|rar:\/\/|ogg:\/\/|compress\.zlib:\/\/)/i,
        action: 'block',
        description: 'Detects file inclusion attacks',
        severity: 'high',
      },

      // Buffer Overflow Detection
      {
        name: 'BUFFER_OVERFLOW',
        enabled: true,
        pattern: /(.){1000,}/,
        action: 'warn',
        description: 'Detects potential buffer overflow attempts',
        severity: 'medium',
      },

      // HTTP Header Injection
      {
        name: 'HEADER_INJECTION',
        enabled: true,
        pattern: /(\r|\n|%0d|%0a)/,
        action: 'block',
        description: 'Detects HTTP header injection',
        severity: 'medium',
      },

      // HTTP Parameter Pollution
      {
        name: 'PARAMETER_POLLUTION',
        enabled: true,
        pattern: /(&\w+=&|\w+=.*&\w+=)/,
        action: 'warn',
        description: 'Detects HTTP parameter pollution',
        severity: 'low',
      },
    ];
  }

  public analyzeRequest(req: Request): {
    blocked: boolean;
    warnings: string[];
    matchedRules: string[];
  } {
    const warnings: string[] = [];
    const matchedRules: string[] = [];
    let blocked = false;

    // Analyze URL
    const urlAnalysis = this.analyzeString(req.url, 'URL');
    if (urlAnalysis.blocked) blocked = true;
    warnings.push(...urlAnalysis.warnings);
    matchedRules.push(...urlAnalysis.matchedRules);

    // Analyze query parameters
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        const queryAnalysis = this.analyzeString(String(value), `QUERY_${key}`);
        if (queryAnalysis.blocked) blocked = true;
        warnings.push(...queryAnalysis.warnings);
        matchedRules.push(...queryAnalysis.matchedRules);
      }
    }

    // Analyze body
    if (req.body) {
      const bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const bodyAnalysis = this.analyzeString(bodyString, 'BODY');
      if (bodyAnalysis.blocked) blocked = true;
      warnings.push(...bodyAnalysis.warnings);
      matchedRules.push(...bodyAnalysis.matchedRules);
    }

    // Analyze headers
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        const headerAnalysis = this.analyzeString(String(value), `HEADER_${key}`);
        if (headerAnalysis.blocked) blocked = true;
        warnings.push(...headerAnalysis.warnings);
        matchedRules.push(...headerAnalysis.matchedRules);
      }
    }

    return { blocked, warnings, matchedRules };
  }

  private analyzeString(
    input: string,
    context: string,
  ): { blocked: boolean; warnings: string[]; matchedRules: string[] } {
    const warnings: string[] = [];
    const matchedRules: string[] = [];
    let blocked = false;

    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      if (rule.pattern.test(input)) {
        matchedRules.push(rule.name);

        // Update stats
        this.stats.rulesTriggered[rule.name] = (this.stats.rulesTriggered[rule.name] || 0) + 1;

        if (rule.action === 'block') {
          blocked = true;
          logger.warn('WAF: Request blocked', {
            rule: rule.name,
            severity: rule.severity,
            context,
            input: input.substring(0, 100), // Limit input length in logs
            ip: this.getClientIP(),
            userAgent: this.getUserAgent(),
            timestamp: new Date().toISOString(),
          });
        } else if (rule.action === 'warn') {
          warnings.push(`WAF Warning: ${rule.description} detected in ${context}`);
          logger.warn('WAF: Suspicious request detected', {
            rule: rule.name,
            severity: rule.severity,
            context,
            input: input.substring(0, 100),
            ip: this.getClientIP(),
            userAgent: this.getUserAgent(),
            timestamp: new Date().toISOString(),
          });
        } else {
          logger.info('WAF: Rule triggered', {
            rule: rule.name,
            context,
            ip: this.getClientIP(),
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    return { blocked, warnings, matchedRules };
  }

  private getClientIP(req?: Request): string {
    if (!req) return 'unknown';
    return (
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any)?.socket?.remoteAddress ||
      'unknown'
    );
  }

  private getUserAgent(req?: Request): string {
    if (!req) return 'unknown';
    return req.get('User-Agent') || 'unknown';
  }

  public getStats(): WAFStats {
    return { ...this.stats };
  }

  public resetStats(): void {
    this.stats = {
      totalRequests: 0,
      blockedRequests: 0,
      warnings: 0,
      rulesTriggered: {},
    };
  }

  public enableRule(ruleName: string): void {
    const rule = this.rules.find(r => r.name === ruleName);
    if (rule) {
      rule.enabled = true;
      logger.info(`WAF: Rule ${ruleName} enabled`);
    }
  }

  public disableRule(ruleName: string): void {
    const rule = this.rules.find(r => r.name === ruleName);
    if (rule) {
      rule.enabled = false;
      logger.info(`WAF: Rule ${ruleName} disabled`);
    }
  }

  public getRules(): WAFRule[] {
    return [...this.rules];
  }
}

// Singleton instance
const wafInstance = new WebApplicationFirewall();

/**
 * WAF Middleware
 */
export const wafMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Update total requests
  (wafInstance as any).stats.totalRequests++;

  // Analyze request
  const analysis = wafInstance.analyzeRequest(req);

  // Add WAF headers
  res.setHeader('X-WAF-Status', analysis.blocked ? 'blocked' : 'allowed');
  if (analysis.matchedRules.length > 0) {
    res.setHeader('X-WAF-Rules', analysis.matchedRules.join(','));
  }

  // Block request if needed
  if (analysis.blocked) {
    (wafInstance as any).stats.blockedRequests++;

    return res.status(403).json({
      error: 'Forbidden',
      message: 'Request blocked by Web Application Firewall',
      code: 'WAF_BLOCKED',
      timestamp: new Date().toISOString(),
    });
  }

  // Add warnings to response headers if any
  if (analysis.warnings.length > 0) {
    (wafInstance as any).stats.warnings++;
    res.setHeader('X-WAF-Warnings', analysis.warnings.length);

    // Log warnings for monitoring
    logger.warn('WAF: Request allowed with warnings', {
      warnings: analysis.warnings,
      ip: req.ip,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

/**
 * WAF Management API
 */
export const wafManagement = {
  getStats: () => wafInstance.getStats(),
  resetStats: () => wafInstance.resetStats(),
  getRules: () => wafInstance.getRules(),
  enableRule: (name: string) => wafInstance.enableRule(name),
  disableRule: (name: string) => wafInstance.disableRule(name),
  getInstance: () => wafInstance,
};

export default wafMiddleware;
