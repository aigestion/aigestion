// @ts-nocheck
import { injectable } from 'inversify';
import puppeteer from 'puppeteer-core';
import { env } from '../config/env.schema';
import { logger } from '../utils/logger';

export interface BrowserAction {
  action: 'navigate' | 'click' | 'type' | 'screenshot' | 'extract' | 'wait';
  url?: string;
  selector?: string;
  text?: string;
  timeout?: number;
}

@injectable()
export class BrowserAgentTool {
  private readonly apiKey: string;
  private readonly host: string;

  constructor() {
    this.apiKey = env.BROWSERLESS_API_KEY || '';
    this.host = env.BROWSERLESS_HOST;
  }

  /**
   * Connects to the browserless instance via WebSocket
   */
  private async connect() {
    // Construct the WebSocket endpoint
    let browserWSEndpoint = this.host;

    // Append token if provided
    if (this.apiKey) {
      const separator = browserWSEndpoint.includes('?') ? '&' : '?';
      browserWSEndpoint += `${separator}token=${this.apiKey}`;
    }

    // Add stealth and pre-boot flags for local/unauthenticated instances if not already in URL
    if (!browserWSEndpoint.includes('stealth')) {
      const separator = browserWSEndpoint.includes('?') ? '&' : '?';
      browserWSEndpoint += `${separator}stealth=true&--disable-web-security=true`;
    }

    logger.debug(
      `[BrowserAgentTool] Connecting to browser at ${browserWSEndpoint.split('?')[0]}...`
    );

    try {
      return await puppeteer.connect({
        browserWSEndpoint,
        defaultViewport: { width: 1920, height: 1080 },
      });
    } catch (error: any) {
      logger.error(`[BrowserAgentTool] Connection failed: ${error.message}`);
      throw new Error(`Failed to connect to Browserless at ${this.host}: ${error.message}`);
    }
  }

  /**
   * Executes a browser task via Puppeteer (Browserless)
   * This allows for complex, stateful interactions.
   */
  async executeTask(actions: BrowserAction[]): Promise<any> {
    let browser;
    let page;
    const results: any = {};

    try {
      logger.info(`[BrowserAgentTool] Initiating browser task with ${actions.length} steps`);
      browser = await this.connect();
      page = await browser.newPage();

      // Set some comprehensive headers/settings for better stealth
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      );

      for (let i = 0; i < actions.length; i++) {
        const step = actions[i];
        logger.debug(`[BrowserAgentTool] Executing step ${i + 1}: ${step.action}`);

        switch (step.action) {
          case 'navigate':
            if (!step.url) throw new Error('URL required for navigate action');
            await page.goto(step.url, {
              waitUntil: 'networkidle2',
              timeout: step.timeout || 30000,
            });
            break;

          case 'click':
            if (!step.selector) throw new Error('Selector required for click action');
            await page.waitForSelector(step.selector, { timeout: step.timeout || 10000 });
            await page.click(step.selector);
            break;

          case 'type':
            if (!step.selector) throw new Error('Selector required for type action');
            await page.waitForSelector(step.selector, { timeout: step.timeout || 10000 });
            await page.type(step.selector, step.text || '', { delay: 50 });
            break;

          case 'wait':
            if (step.timeout) {
              await new Promise(r => setTimeout(r, step.timeout));
            } else if (step.selector) {
              await page.waitForSelector(step.selector, { timeout: 10000 });
            }
            break;

          case 'screenshot':
            const screenshotBuffer = await page.screenshot({ fullPage: true });
            results.screenshot = Buffer.from(screenshotBuffer).toString('base64');
            break;

          case 'extract':
            if (step.selector) {
              await page.waitForSelector(step.selector, { timeout: 5000 });
              results.extracted = await page.$eval(step.selector, el => ({
                text: el.textContent,
                html: el.innerHTML,
                attributes: Array.from(el.attributes).reduce((acc: any, attr: any) => {
                  acc[attr.name] = attr.value;
                  return acc;
                }, {}),
              }));
            } else {
              // Detailed extraction strategy (Metadata, OG, Content)
              results.metadata = await page.evaluate(() => {
                const doc = document as any;
                const getMeta = (name: string) =>
                  doc
                    .querySelector(`meta[name="${name}"], meta[property="${name}"]`)
                    ?.getAttribute('content');

                return {
                  title: doc.title,
                  description: getMeta('description'),
                  ogTitle: getMeta('og:title'),
                  ogDescription: getMeta('og:description'),
                  ogImage: getMeta('og:image'),
                  canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),
                };
              });
              results.text = await page.$eval('body', (el: any) => el.innerText);
              results.html = await page.content();
            }
            break;
        }
      }

      return {
        success: true,
        data: results,
        summary: `Successfully executed ${actions.length} browser actions.`,
      };
    } catch (error: any) {
      logger.error('[BrowserAgentTool] Browser task failed:', error.message);
      let errorScreenshot;
      if (page) {
        try {
          const sc = await page.screenshot();
          errorScreenshot = Buffer.from(sc).toString('base64');
        } catch (e) {
          /* ignore */
        }
      }

      return {
        success: false,
        error: error.message,
        errorScreenshot: errorScreenshot ? 'captured' : 'failed',
      };
    } finally {
      if (browser) await browser.close();
    }
  }

  /**
   * One-off screenshot helper
   */
  async screenshot(url: string, outputPath?: string): Promise<string> {
    return this.executeTask([{ action: 'navigate', url }, { action: 'screenshot' }]).then(res =>
      res.success ? 'Screenshot captured' : 'Screenshot failed'
    );
  }
}
