export interface CSPDirective {
  readonly name: string;
  readonly value: string;
}

export interface CSPConfig {
  readonly directives: CSPDirective[];
  readonly reportOnly?: boolean;
  readonly reportURI?: string;
}

export interface CSPViolation {
  readonly blockedURI: string;
  readonly columnNumber?: number;
  readonly disposition: 'report' | 'enforce';
  readonly documentURI: string;
  readonly effectiveDirective: string;
  readonly lineNumber?: number;
  readonly originalPolicy: string;
  readonly referrer: string;
  readonly sample?: string;
  readonly sourceFile?: string;
  readonly statusCode?: number;
  readonly violatedDirective: string;
}

// Default CSP configuration for AIGestion
export const defaultCSPConfig: CSPConfig = {
  directives: [
    // Default-src: Allow only same origin by default
    {
      name: 'default-src',
      value: "'self' https://jhvtjyfmgncrrbzqpbkt.supabase.co https://*.supabase.co",
    },
    
    // Script-src: Allow scripts from same origin and trusted CDNs
    {
      name: 'script-src',
      value: "'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.googletagmanager.com https://*.google-analytics.com https://vercel.live https://*.vercel.live",
    },
    
    // Style-src: Allow inline styles and external stylesheets
    {
      name: 'style-src',
      value: "'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googleapis.com",
    },
    
    // Img-src: Allow images from same origin and trusted sources
    {
      name: 'img-src',
      value: "'self' data: blob: https://*.supabase.co https://*.githubusercontent.com https://*.unsplash.com https://*.images.unsplash.com https://*.googleusercontent.com https://vercel.live https://*.vercel.live",
    },
    
    // Font-src: Allow fonts from Google Fonts
    {
      name: 'font-src',
      value: "'self' https://fonts.gstatic.com https://*.gstatic.com data:",
    },
    
    // Connect-src: Allow API connections to trusted domains
    {
      name: 'connect-src',
      value: "'self' https://api.github.com https://api.openai.com https://*.supabase.co https://*.supabase.co wss://*.supabase.co",
    },
    
    // Media-src: Allow media from same origin and trusted sources
    {
      name: 'media-src',
      value: "'self' blob: https://*.supabase.co https://*.githubusercontent.com",
    },
    
    // Object-src: Disallow objects (plugins, etc.)
    {
      name: 'object-src',
      value: "'none'",
    },
    
    // Base-uri: Restrict base URI to same origin
    {
      name: 'base-uri',
      value: "'self'",
    },
    
    // Form-action: Allow forms to submit to same origin and trusted domains
    {
      name: 'form-action',
      value: "'self' https://*.supabase.co",
    },
    
    // Frame-ancestors: Allow iframes from trusted domains
    {
      name: 'frame-ancestors',
      value: "'self' https://www.youtube.com https://player.vimeo.com https://*.supabase.co",
    },
    
    // Frame-src: Allow iframes from trusted domains
    {
      name: 'frame-src',
      value: "'self' https://www.youtube.com https://player.vimeo.com https://*.supabase.co",
    },
    
    // Worker-src: Allow workers from same origin
    {
      name: 'worker-src',
      value: "'self' blob:",
    },
    
    // Manifest-src: Allow manifest from same origin
    {
      name: 'manifest-src',
      value: "'self'",
    },
    
    // Upgrade-insecure-requests: Upgrade HTTP to HTTPS
    {
      name: 'upgrade-insecure-requests',
      value: 'true',
    },
  ],
  reportOnly: false,
};

// Development CSP configuration (more permissive)
export const developmentCSPConfig: CSPConfig = {
  directives: [
    {
      name: 'default-src',
      value: "'self' https://jhvtjyfmgncrrbzqpbkt.supabase.co https://*.supabase.co ws://localhost:* ws://127.0.0.1:*",
    },
    {
      name: 'script-src',
      value: "'self' 'unsafe-inline' 'unsafe-eval' ws://localhost:* ws://127.0.0.1:*",
    },
    {
      name: 'style-src',
      value: "'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googleapis.com",
    },
    {
      name: 'img-src',
      value: "'self' data: blob: https://*.supabase.co https://*.githubusercontent.com https://*.unsplash.com https://*.images.unsplash.com https://*.googleusercontent.com",
    },
    {
      name: 'font-src',
      value: "'self' https://fonts.gstatic.com https://*.gstatic.com data:",
    },
    {
      name: 'connect-src',
      value: "'self' https://api.github.com https://api.openai.com https://*.supabase.co https://*.supabase.co wss://*.supabase.co ws://localhost:* ws://127.0.0.1:*",
    },
    {
      name: 'media-src',
      value: "'self' blob: https://*.supabase.co https://*.githubusercontent.com",
    },
    {
      name: 'object-src',
      value: "'none'",
    },
    {
      name: 'base-uri',
      value: "'self'",
    },
    {
      name: 'form-action',
      value: "'self' https://*.supabase.co",
    },
    {
      name: 'frame-ancestors',
      value: "'self' https://www.youtube.com https://player.vimeo.com https://*.supabase.co",
    },
    {
      name: 'frame-src',
      value: "'self' https://www.youtube.com https://player.vimeo.com https://*.supabase.co",
    },
    {
      name: 'worker-src',
      value: "'self' blob:",
    },
    {
      name: 'manifest-src',
      value: "'self'",
    },
    {
      name: 'upgrade-insecure-requests',
      value: 'true',
    },
  ],
  reportOnly: false,
};

// Generate CSP header string
export function generateCSPHeader(config: CSPConfig): string {
  const directives = config.directives
    .map(directive => `${directive.name} ${directive.value}`)
    .join('; ');
  
  let header = directives;
  
  if (config.reportOnly) {
    header += '; report-uri /api/csp-report';
  } else if (config.reportURI) {
    header += `; report-uri ${config.reportURI}`;
  }
  
  return header;
}

// CSP violation reporter
export class CSPViolationReporter {
  private violations: CSPViolation[] = [];
  private maxViolations: number;
  private reportEndpoint?: string;

  constructor(maxViolations: number = 100, reportEndpoint?: string) {
    this.maxViolations = maxViolations;
    this.reportEndpoint = reportEndpoint;
  }

  reportViolation(violation: CSPViolation): void {
    // Add timestamp
    const violationWithTimestamp = {
      ...violation,
      timestamp: new Date().toISOString(),
    };

    // Add to violations array
    this.violations.push(violationWithTimestamp);

    // Keep only the most recent violations
    if (this.violations.length > this.maxViolations) {
      this.violations = this.violations.slice(-this.maxViolations);
    }

    // Log to console
    console.warn('CSP Violation:', violationWithTimestamp);

    // Send to report endpoint if configured
    if (this.reportEndpoint) {
      this.sendReport(violationWithTimestamp);
    }
  }

  private async sendReport(violation: CSPViolation): Promise<void> {
    if (!this.reportEndpoint) return;

    try {
      await fetch(this.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          violation,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to send CSP violation report:', error);
    }
  }

  getViolations(): CSPViolation[] {
    return [...this.violations];
  }

  getViolationsByDirective(directive: string): CSPViolation[] {
    return this.violations.filter(v => v.violatedDirective === directive);
  }

  getRecentViolations(minutes: number = 60): CSPViolation[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.violations.filter(v => 
      new Date(v.timestamp) >= cutoff
    );
  }

  clearViolations(): void {
    this.violations = [];
  }

  getViolationStats(): {
    total: number;
    byDirective: Record<string, number>;
    recent: number;
  } {
    const byDirective: Record<string, number> = {};
    
    this.violations.forEach(violation => {
      byDirective[violation.violatedDirective] = 
        (byDirective[violation.violatedDirective] || 0) + 1;
    });

    return {
      total: this.violations.length,
      byDirective,
      recent: this.getRecentViolations(60).length,
    };
  }
}

// CSP middleware for Express.js
export function cspMiddleware(config: CSPConfig = defaultCSPConfig) {
  const cspHeader = generateCSPHeader(config);
  
  return (req: any, res: any, next: any) => {
    res.setHeader('Content-Security-Policy', cspHeader);
    next();
  };
}

// CSP nonce generator
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// CSP nonce validation
export function validateNonce(nonce: string, expectedNonce?: string): boolean {
  if (!expectedNonce) return false;
  return nonce === expectedNonce;
}

// CSP utilities
export const cspUtils = {
  // Check if a URL is allowed by CSP
  isAllowedURL: (url: string, config: CSPConfig): boolean => {
    try {
      const urlObj = new URL(url, globalThis.location.origin);
      return urlObj.origin === globalThis.location.origin;
    } catch {
      return false;
    }
  },

  // Generate CSP meta tag
  generateMetaTag: (config: CSPConfig): string => {
    const cspHeader = generateCSPHeader(config);
    return `<meta http-equiv="Content-Security-Policy" content="${cspHeader}">`;
  },

  // Parse CSP header
  parseCSPHeader: (header: string): CSPConfig => {
    const directives = header.split(';').map(directive => {
      const [name, ...values] = directive.trim().split(' ');
      return {
        name: name.replace('-', ''),
        value: values.join(' '),
      };
    });

    return {
      directives,
      reportOnly: header.includes('report-uri'),
    };
  },

  // Validate CSP configuration
  validateConfig: (config: CSPConfig): boolean => {
    const requiredDirectives = ['default-src', 'script-src', 'style-src'];
    
    return requiredDirectives.every(directive =>
      config.directives.some(d => d.name === directive)
    );
  },
};

// Default CSP violation reporter instance
export const defaultCSPReporter = new CSPViolationReporter(
  100,
  '/api/csp-report'
);
