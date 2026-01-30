import { expect, test } from '@playwright/test';
import { performance as nodePerformance } from 'perf_hooks';

test.describe('AIGestion Performance Tests', () => {
  let page: any;

  test.beforeAll(async ({ browser }: { browser: any }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Page load performance - Homepage', async () => {
    const startTime = nodePerformance.now();

    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const loadTime = nodePerformance.now() - startTime;

    // Performance assertions
    expect(loadTime).toBeLessThan(3000); // 3 seconds max

    // Check Core Web Vitals
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation' as any)[0] as any;
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint:
          performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });

    expect(metrics.domContentLoaded).toBeLessThan(1500);
    expect(metrics.loadComplete).toBeLessThan(3000);
    expect(metrics.firstContentfulPaint).toBeLessThan(2000);
  });

  test('API response performance', async () => {
    // Monitor API calls
    const apiCalls: any[] = [];

    page.on('response', (response: any) => {
      if (response.url().includes('/api/')) {
        apiCalls.push({
          url: response.url(),
          status: response.status(),
          timing: response.timing(),
        });
      }
    });

    await page.goto('http://localhost:5173');
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-submit"]');
    await page.waitForLoadState('networkidle');

    // Check API performance
    const loginApiCall = apiCalls.find((call) => call.url.includes('/auth/login'));
    expect(loginApiCall).toBeDefined();
    expect(loginApiCall.timing.responseEnd - loginApiCall.timing.requestStart).toBeLessThan(2000);
    expect(loginApiCall.status).toBe(200);
  });

  test('Large list rendering performance', async () => {
    await page.goto('http://localhost:5173');

    // Login first
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-submit"]');

    // Navigate to conversations
    await page.click('[data-testid="nav-conversations"]');

    // Mock large list
    await page.evaluate(() => {
      const list = document.querySelector('[data-testid="conversation-list"]');
      if (list) {
        // Add 1000 items
        for (let i = 0; i < 1000; i++) {
          const item = document.createElement('div');
          item.setAttribute('data-testid', 'conversation-item');
          item.textContent = `Conversation ${i}`;
          list.appendChild(item);
        }
      }
    });

    // Measure scroll performance
    const startTime = nodePerformance.now();

    await page.evaluate(() => {
      const list = document.querySelector('[data-testid="conversation-list"]');
      if (list) {
        list.scrollTop = list.scrollHeight;
      }
    });

    const endTime = nodePerformance.now();
    const scrollTime = endTime - startTime;

    expect(scrollTime).toBeLessThan(500); // Should be smooth
  });

  test('Memory usage monitoring', async () => {
    await page.goto('http://localhost:5173');

    // Monitor memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Perform memory-intensive operations
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="nav-conversations"]');
      await page.click('[data-testid="nav-dashboard"]');
      await page.click('[data-testid="nav-settings"]');
    }

    // Force garbage collection if available
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });

    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be reasonable (< 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });

  test('Bundle size analysis', async () => {
    const responses: any[] = [];

    page.on('response', (response: any) => {
      if (response.url().includes('.js') || response.url().includes('.css')) {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length'] || 0,
          type: response.url().includes('.js') ? 'js' : 'css',
        });
      }
    });

    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Calculate total bundle size
    const totalJSSize = responses
      .filter((r) => r.type === 'js')
      .reduce((sum, r) => sum + parseInt(r.size || 0), 0);

    const totalCSSSize = responses
      .filter((r) => r.type === 'css')
      .reduce((sum, r) => sum + parseInt(r.size || 0), 0);

    // Bundle size should be reasonable
    expect(totalJSSize).toBeLessThan(2 * 1024 * 1024); // 2MB max for JS
    expect(totalCSSSize).toBeLessThan(200 * 1024); // 200KB max for CSS
  });

  test('Database query performance', async () => {
    // This would require backend instrumentation
    await page.goto('http://localhost:5173');

    // Login and navigate to data-heavy page
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-submit"]');

    await page.click('[data-testid="nav-conversations"]');

    // Monitor database queries through API timing
    const apiTimings: any[] = [];

    page.on('response', (response: any) => {
      if (response.url().includes('/api/conversations')) {
        apiTimings.push({
          url: response.url(),
          timing: response.timing(),
        });
      }
    });

    await page.click('[data-testid="refresh-conversations"]');
    await page.waitForLoadState('networkidle');

    // Check database query performance
    const conversationApiCall = apiTimings.find((call) => call.url.includes('/conversations'));
    expect(conversationApiCall).toBeDefined();
    expect(
      conversationApiCall.timing.responseEnd - conversationApiCall.timing.requestStart,
    ).toBeLessThan(1000);
  });

  test('Concurrent user load simulation', async () => {
    // Simulate multiple users
    const pages = await Promise.all([
      page.context().newPage(),
      page.context().newPage(),
      page.context().newPage(),
      page.context().newPage(),
      page.context().newPage(),
    ]);

    const startTime = nodePerformance.now();

    // All users login simultaneously
    await Promise.all(
      pages.map(async (p, index) => {
        await p.goto('http://localhost:5173');
        await p.click('[data-testid="login-button"]');
        await p.fill('[data-testid="email-input"]', `user${index}@example.com`);
        await p.fill('[data-testid="password-input"]', 'testpassword123');
        await p.click('[data-testid="login-submit"]');
        await p.waitForLoadState('networkidle');
      }),
    );

    const endTime = nodePerformance.now();
    const totalTime = endTime - startTime;

    // Average time per user should be reasonable
    const avgTimePerUser = totalTime / pages.length;
    expect(avgTimePerUser).toBeLessThan(5000); // 5 seconds max per user

    // Clean up
    await Promise.all(pages.map((p) => p.close()));
  });

  test('Image optimization performance', async () => {
    await page.goto('http://localhost:5173');

    // Monitor image loading
    const imageLoadTimes: any[] = [];

    page.on('response', (response: any) => {
      if (response.url().match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        const startTime = Date.now();
        response.text().then(() => {
          const endTime = Date.now();
          imageLoadTimes.push({
            url: response.url(),
            loadTime: endTime - startTime,
            size: response.headers()['content-length'] || 0,
          });
        });
      }
    });

    // Navigate to pages with images
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-submit"]');

    await page.waitForTimeout(2000); // Wait for images to load

    // Check image optimization
    if (imageLoadTimes.length > 0) {
      const avgLoadTime =
        imageLoadTimes.reduce((sum, img) => sum + img.loadTime, 0) / imageLoadTimes.length;
      expect(avgLoadTime).toBeLessThan(1000); // 1 second max average

      // Check if images are optimized (WebP preferred)
      const webpImages = imageLoadTimes.filter((img) => img.url.includes('.webp'));
      const totalImages = imageLoadTimes.length;

      if (totalImages > 0) {
        const webpRatio = webpImages.length / totalImages;
        expect(webpRatio).toBeGreaterThan(0.5); // At least 50% should be WebP
      }
    }
  });

  test('Animation performance', async () => {
    await page.goto('http://localhost:5173');

    // Login
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    await page.click('[data-testid="login-submit"]');

    // Test animation performance
    const animationStart = nodePerformance.now();

    await page.click('[data-testid="animated-button"]');
    await page.waitForSelector('[data-testid="animation-complete"]');

    const animationEnd = nodePerformance.now();
    const animationTime = animationEnd - animationStart;

    // Animation should be smooth (60fps = 16.67ms per frame)
    expect(animationTime).toBeLessThan(1000); // 1 second max

    // Check for layout shifts
    const layoutShift = await page.evaluate(() => {
      return new Promise((resolve) => {
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
          resolve(cls);
        }).observe({ entryTypes: ['layout-shift'] });

        setTimeout(() => resolve(cls), 1000);
      });
    });

    expect(layoutShift).toBeLessThan(0.1); // CLS should be minimal
  });

  test('Resource loading prioritization', async () => {
    const resourceTiming: any[] = [];

    page.on('response', (response: any) => {
      resourceTiming.push({
        url: response.url(),
        type: response.request().resourceType(),
        timing: response.timing(),
        size: response.headers()['content-length'] || 0,
      });
    });

    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Check critical resources load first
    const criticalResources = resourceTiming.filter(
      (r) => r.type === 'script' || r.type === 'stylesheet',
    );

    const nonCriticalResources = resourceTiming.filter(
      (r) => r.type === 'image' || r.type === 'font',
    );

    if (criticalResources.length > 0 && nonCriticalResources.length > 0) {
      const avgCriticalTime =
        criticalResources.reduce(
          (sum, r) => sum + (r.timing.responseEnd - r.timing.requestStart),
          0,
        ) / criticalResources.length;

      const avgNonCriticalTime =
        nonCriticalResources.reduce(
          (sum, r) => sum + (r.timing.responseEnd - r.timing.requestStart),
          0,
        ) / nonCriticalResources.length;

      // Critical resources should load faster
      expect(avgCriticalTime).toBeLessThan(avgNonCriticalTime);
    }
  });
});
