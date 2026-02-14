import { injectable } from 'inversify';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

/**
 * SOVEREIGN BROWSERLESS SERVICE (God Mode)
 * Advanced navigation engine for high-resilience web automation and neural data harvesting.
 */
@injectable()
export class BrowserlessService {
  private readonly apiKey: string;
  private readonly host: string;

  constructor() {
    this.apiKey = env.BROWSERLESS_API_KEY || '';
    this.host = env.BROWSERLESS_HOST;
  }

  /**
   * Resilient execution wrapper with exponential backoff for connection and navigation
   */
  private async withRetry<T>(operation: () => Promise<T>, context: string): Promise<T> {
    const maxRetries = 3;
    const baseDelay = 1500;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        if (attempt === maxRetries - 1) throw error;
        
        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(`[BrowserlessService] ${context} transient error (${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`, { error: error.message });
        await new Promise(res => setTimeout(res, delay));
      }
    }
    throw new Error(`[BrowserlessService] ${context} exhausted all retry attempts`);
  }

  /**
   * Orchestrates a resilient browser connection
   */
  async connect(): Promise<Browser> {
    return this.withRetry(async () => {
      let endpoint = this.host;
      const separator = endpoint.includes('?') ? '&' : '?';
      
      // God Mode Connection Flags
      const flags = [
        this.apiKey ? `token=${this.apiKey}` : '',
        'stealth=true',
        '--disable-web-security=true',
        '--no-sandbox=true',
        '--disable-setuid-sandbox=true',
        '--window-size=1920,1080'
      ].filter(Boolean).join('&');

      const browserWSEndpoint = `${endpoint}${separator}${flags}`;

      logger.debug('[BrowserlessService] Connecting to Sovereign Browser Cluster...');
      
      return await puppeteer.connect({
        browserWSEndpoint,
        defaultViewport: { width: 1920, height: 1080 },
      });
    }, 'Connection');
  }

  /**
   * Initializes a page with extreme stealth and human-like fingerprinting
   */
  async setupPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();
    
    // Advanced Stealth Layer
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );
    
    // Inject Human-like behavior scripts
    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      // WebGL Fingerprint Spoofing
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37445) return 'Intel Open Source Technology Center';
        if (parameter === 37446) return 'Mesa DRI Intel(R) HD Graphics 520 (Skylake GT2)';
        return getParameter.apply(this, [parameter]);
      };
    });

    return page;
  }

  /**
   * Standardized resilient navigation
   */
  async navigate(page: Page, url: string, timeout: number = 30000): Promise<void> {
    await this.withRetry(async () => {
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout,
      });
    }, `Navigation: ${url}`);
  }

  /**
   * Diagnostics for the browser cluster
   */
  async checkHealth() {
    let browser;
    try {
      const start = Date.now();
      browser = await this.connect();
      const latency = Date.now() - start;
      const version = await browser.version();
      await browser.close();
      
      return {
        status: 'ready',
        latency: `${latency}ms`,
        version
      };
    } catch (error) {
      return { status: 'error', message: (error as Error).message };
    } finally {
      if (browser) await browser.close();
    }
  }
}

export const browserlessService = new BrowserlessService();
