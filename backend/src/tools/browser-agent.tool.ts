// @ts-nocheck
import { injectable } from 'inversify';
import { logger } from '../utils/logger';
import { browserlessService } from '../services/browserless.service';

export interface BrowserAction {
  action: 'navigate' | 'click' | 'type' | 'screenshot' | 'extract' | 'wait';
  url?: string;
  selector?: string;
  text?: string;
  timeout?: number;
}

/**
 * BrowserAgentTool - Refactored for God Mode Resilience.
 * Now utilizes BrowserlessService for centralized session and stealth management.
 */
@injectable()
export class BrowserAgentTool {
  /**
   * Executes a browser task via Sovereign BrowserlessService
   */
  async executeTask(actions: BrowserAction[]): Promise<any> {
    let browser;
    let page;
    const results: any = {};

    try {
      logger.info(`[BrowserAgentTool] Initiating sovereign browser task with ${actions.length} steps`);
      
      browser = await browserlessService.connect();
      page = await browserlessService.setupPage(browser);

      for (let i = 0; i < actions.length; i++) {
        const step = actions[i];
        logger.debug(`[BrowserAgentTool] Executing step ${i + 1}: ${step.action}`);

        switch (step.action) {
          case 'navigate':
            if (!step.url) throw new Error('URL required for navigate action');
            await browserlessService.navigate(page, step.url, step.timeout);
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
              results.metadata = await page.evaluate(() => {
                const doc = document as any;
                const getMeta = (name: string) =>
                  doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`)?.getAttribute('content');

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
        summary: `Successfully executed ${actions.length} sovereign browser actions.`,
      };
    } catch (error: any) {
      logger.error('[BrowserAgentTool] Sovereign task failed:', error.message);
      let errorScreenshot;
      if (page) {
        try {
          const sc = await page.screenshot();
          errorScreenshot = Buffer.from(sc).toString('base64');
        } catch (e) { /* ignore */ }
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

  async screenshot(url: string): Promise<string> {
    return this.executeTask([{ action: 'navigate', url }, { action: 'screenshot' }]).then(res =>
      res.success ? 'Screenshot captured' : 'Screenshot failed'
    );
  }
}
