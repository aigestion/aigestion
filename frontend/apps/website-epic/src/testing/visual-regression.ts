import { Page } from 'playwright';
import { expect } from '@playwright/test';
import { compareScreenshots } from 'playwright-core';

export interface VisualRegressionConfig {
  readonly threshold?: number;
  readonly animationDisable?: boolean;
  readonly clip?: {
    readonly x?: number;
    readonly y?: number;
    readonly width?: number;
    readonly height?: number;
  };
  readonly fullPage?: boolean;
  readonly omitBackground?: boolean;
  readonly mask?: Array<{
    readonly selector: string;
    readonly color?: string;
  }>;
}

export class VisualRegressionTester {
  private page: Page;
  private config: VisualRegressionConfig;
  private baselineDir: string;
  private currentDir: string;
  private diffDir: string;

  constructor(page: Page, config: VisualRegressionConfig = {}) {
    this.page = page;
    this.config = {
      threshold: 0.2,
      animationDisable: true,
      fullPage: true,
      omitBackground: false,
      ...config,
    };
    this.baselineDir = 'tests/visual/baseline';
    this.currentDir = 'tests/visual/current';
    this.diffDir = 'tests/visual/diff';
  }

  async captureScreenshot(
    name: string,
    options: VisualRegressionConfig = {}
  ): Promise<string> {
    const config = { ...this.config, ...options };

    await this.page.waitForLoadState('networkidle');
    if (config.animationDisable) {
      await this.page.addStyleTag({
        content: '* { animation: none !important; transition: none !important; }',
      });
    }

    const screenshotPath = `${this.currentDir}/${name}.png`;
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: config.fullPage,
      clip: config.clip,
      omitBackground: config.omitBackground,
      animations: 'disabled',
      mask: config.mask,
    });

    return screenshotPath;
  }

  async compareWithBaseline(
    name: string,
    options: VisualRegressionConfig = {}
  ): Promise<{
    passed: boolean;
    diff?: string;
    baseline?: string;
    current?: string;
    threshold: number;
  }> {
    const currentPath = await this.captureScreenshot(name, options);
    const baselinePath = `${this.baselineDir}/${name}.png`;

    try {
      // Check if baseline exists
      await this.page.evaluate(() => {
        return fetch(`file://${baselinePath}`)
          .then(response => response.ok)
          .catch(() => false);
      });

      const baselineExists = await this.page.evaluate((path: string) => {
        return fetch(`file://${path}`)
          .then(response => response.ok)
          .catch(() => false);
      }, baselinePath);

      if (!baselineExists) {
        // Create baseline if it doesn't exist
        await this.page.evaluate((src: string, dest: string) => {
          return fetch(src)
            .then(response => response.arrayBuffer())
            .then(buffer => {
              const fs = require('fs');
              fs.writeFileSync(dest, Buffer.from(buffer));
            });
        }, currentPath, baselinePath);

        return {
          passed: true,
          current: currentPath,
          baseline: baselinePath,
          threshold: this.config.threshold || 0.2,
        };
      }

      // Compare screenshots
      const diff = await compareScreenshots(
        currentPath,
        baselinePath,
        {
          threshold: options.threshold || this.config.threshold,
        }
      );

      const diffPath = `${this.diffDir}/${name}.png`;
      if (!diff.passed) {
        await this.page.evaluate((diffBuffer: Buffer, path: string) => {
          const fs = require('fs');
          fs.writeFileSync(path, diffBuffer);
        }, diff.getDiff(), diffPath);
      }

      return {
        passed: diff.passed,
        diff: diff.passed ? undefined : diffPath,
        current: currentPath,
        baseline: baselinePath,
        threshold: diff.threshold || this.config.threshold,
      };
    } catch (error) {
      console.error('Visual regression comparison failed:', error);
      return {
        passed: false,
        current: currentPath,
        baseline: baselinePath,
        threshold: this.config.threshold || 0.2,
      };
    }
  }

  async testPage(
    name: string,
    testFn: () => Promise<void>,
    options: VisualRegressionConfig = {}
  ): Promise<{
    passed: boolean;
    diff?: string;
    baseline?: string;
    current?: string;
    threshold: number;
  }> {
    try {
      await testFn();
      return await this.compareToBaseline(name, options);
    } catch (error) {
      console.error(`Visual regression test failed for ${name}:`, error);
      return {
        passed: false,
        threshold: this.config.threshold || 0.2,
      };
    }
  }

  async testComponent(
    name: string,
    componentSelector: string,
    options: VisualRegressionConfig = {}
  ): Promise<{
    passed: boolean;
    diff?: string;
    baseline?: string;
    current?: string;
    threshold: number;
  }> {
      return this.testPage(name, async () => {
        // Wait for component to be visible
        await this.page.waitForSelector(componentSelector, { state: 'visible' });
        
        // Scroll component into view if needed
        const element = await this.page.$(componentSelector);
        await element.scrollIntoViewIfNeeded();
        
        // Wait for any animations to complete
        await this.page.waitForTimeout(1000);
      }, options);
  }

  async testResponsive(
    name: string,
    viewports: Array<{ width: number; height: number; name: string }>,
    testFn: () => Promise<void>,
    options: VisualRegressionConfig = {}
  ): Promise<Array<{
      viewport: { width: number; height: number; name: string };
      result: {
        passed: boolean;
        diff?: string;
        baseline?: string;
        current?: string;
        threshold: number;
      };
    }>> {
    const results = [];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      const result = await this.testPage(`${name}-${viewport.name}`, testFn, options);
      results.push({ viewport, result });
    }

    return results;
  }

  async updateBaseline(name: string): Promise<void> {
    const currentPath = `${this.currentDir}/${name}.png`;
    const baselinePath = `${this.baselineDir}/${name}.png`;

    try {
      await this.page.evaluate((src: string, dest: string) => {
        const fs = require('fs');
        fs.copyFileSync(src, dest);
      }, currentPath, baselinePath);
    } catch (error) {
      console.error(`Failed to update baseline for ${name}:`, error);
      throw error;
    }
  }

  async acceptChanges(name: string): Promise<void> {
    const currentPath = `${this.currentDir}/${name}.png`;
    const baselinePath = `${this.baselineDir}/${name}.png`;

    try {
      await this.page.evaluate((src: string, dest: string) => {
        const fs = require('fs');
        fs.copyFileSync(src, dest);
      }, currentPath, baselinePath);
      
      // Remove diff file if it exists
      const diffPath = `${this.diffDir}/${name}.png`;
      await this.page.evaluate((path: string) => {
        const fs = require('fs');
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      }, diffPath);
    } catch (error) {
      console.error(`Failed to accept changes for ${name}:`, error);
      throw error;
    }
  }

  async generateReport(): Promise<{
    totalTests: number;
    passedTests: number;
    failedTests: number;
    threshold: number;
    report: string;
  }> {
    const fs = require('fs');
    const path = require('path');

    const allFiles = fs.readdirSync(this.currentDir);
    const imageFiles = allFiles.filter(file => file.endsWith('.png'));

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    for (const file of imageFiles) {
      const testName = path.basename(file, '.png');
      const currentPath = path.join(this.currentDir, file);
      const baselinePath = path.join(this.baselineDir, file);
      const diffPath = path.join(this.diffDir, file);

      totalTests++;

      if (fs.existsSync(baselinePath)) {
        try {
          const diff = await compareScreenshots(currentPath, baselinePath);
          if (diff.passed) {
            passedTests++;
          } else {
            failedTests++;
          }
        } catch (error) {
          failedTests++;
        }
      } else {
        // No baseline exists, consider it as passed
        passedTests++;
      }
    }

    const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 100;
    const threshold = this.config.threshold || 0.2;

    const report = `
Visual Regression Test Report
========================
Total Tests: ${totalTests}
Passed: ${passedTests}
Failed: ${failedTests}
Pass Rate: ${passRate.toFixed(2)}%
Threshold: ${(threshold * 100).toFixed(1)}%

${failedTests > 0 ? '\nFailed Tests:\n' + 
      imageFiles.filter(file => {
        const testName = path.basename(file, '.png');
        const currentPath = path.join(this.currentDir, file);
        const baselinePath = path.join(this.baselineDir, file);
        const diffPath = path.join(this.diffDir, file);
        
        if (fs.existsSync(baselinePath)) {
          try {
            const diff = compareScreenshots(currentPath, baselinePath);
            return !diff.passed;
          } catch {
            return true;
          }
        }
        return false;
      }).map(file => `- ${path.basename(file, '.png')}`).join('\n') : ''}
    : ''}

Generated at: ${new Date().toISOString()}
    `;

    return {
      totalTests,
      passedTests,
      failedTests,
      threshold,
      report,
    };
  }

  // Utility methods
  async createDirectories(): Promise<void> {
    const fs = require('fs');
    const path = require('path');

    const dirs = [this.baselineDir, this.currentDir, this.diffDir];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  async cleanup(): Promise<void> {
    const fs = require('fs');
    const path = require('path');

    const dirs = [this.currentDir, this.diffDir];
    
    for (const dir of dirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          fs.unlinkSync(path.join(dir, file));
        }
        fs.rmdirSync(dir);
      }
    }
  }
}

// Visual regression test utilities
export const visualRegressionUtils = {
  // Wait for element to be stable
  waitForStableElement: async (page: Page, selector: string, timeout = 5000) => {
    await page.waitForSelector(selector, { state: 'visible', timeout });
    await page.waitForTimeout(500);
    
    // Wait for all images to load
    const images = await page.$$(selector + ' img');
    await Promise.all(
      images.map(img => img.evaluate((img: HTMLImageElement) => 
        img.complete ? Promise.resolve() : new Promise(resolve => {
          img.onload = resolve;
        })
      ))
    );
  },

  // Wait for animations to complete
  waitForAnimations: async (page: Page, timeout = 2000) => {
    await page.waitForTimeout(timeout);
  },

  // Hide scrollbars for consistent screenshots
  hideScrollbars: async (page: Page) => {
    await page.addStyleTag({
      content: `
        ::-webkit-scrollbar { display: none !important; }
        body { overflow: hidden !important; }
      `,
    });
  },

  // Show scrollbars after test
  showScrollbars: async (page: Page) => {
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = `
        ::-webkit-scrollbar { display: block !important; }
        body { overflow: auto !important; }
      `;
      document.head.appendChild(style);
    });
  },

  // Set consistent viewport
  setViewport: async (page: Page, width: number, height: number) => {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  },

  // Mock network conditions
  mockNetwork: async (page: Page, condition: string) => {
    await page.route('**/*', route => {
      if (condition === 'offline') {
        route.fulfill({
          status: 503,
          statusText: 'Service Unavailable',
          contentType: 'text/plain',
          body: 'Offline',
        });
      } else if (condition === 'slow') {
        route.fulfill({
          status: 200,
          statusText: 'OK',
          headers: { 'x-delay': '3000' },
          body: 'Slow response',
        });
      } else {
        route.continue();
      }
    });
  },

  // Mock API responses
  mockAPI: async (page: Page, mockData: Record<string, any>) => {
    await page.route('**/api/**', route => {
      const url = new URL(route.request().url());
      const path = url.pathname;
      
      if (mockData[path]) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockData[path]),
        });
      } else {
        route.fulfill({
          status: 404,
          statusText: 'Not Found',
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Not found' }),
        });
      }
    });
  },
};

// Default visual regression tester instance
export function createVisualRegressionTester(
  page: Page,
  config: VisualRegressionConfig = {}
): VisualRegressionTester {
  const tester = new VisualRegressionTester(page, config);
  
  // Auto-create directories
  tester.createDirectories();
  
  return tester;
}
