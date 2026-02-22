import { expect, test } from '@playwright/test';

test.use({
  permissions: ['microphone'],
});

test.describe('Daniela AI Futurista - E2E Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the public Daniela route
    await page.goto('/daniela', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'debug-daniela.png' });
  });

  test('should load Daniela demo page correctly', async ({ page }) => {
    // Check main title in Hero
    await expect(page.getByText('DANIELA', { exact: true })).toBeVisible();

    // Check conversation mode content
    await expect(page.getByText('Conversa con Daniela')).toBeVisible();

    // Check the panel header
    await expect(page.getByText('ONLINE // V2.4')).toBeVisible();
  });

  test('should handle text conversation flow', async ({ page }) => {
    // Type a message
    const input = page.locator('[data-testid="daniela-input"]');
    await input.fill('Hola Daniela, ¿cuál es tu propósito?');

    // Send message
    await page.click('[data-testid="daniela-send"]');

    // Check user message is displayed
    await expect(page.getByText('Hola Daniela, ¿cuál es tu propósito?')).toBeVisible();

    // Wait for AI response (real or mocked)
    // The component shows "Hola, soy Daniela..." by default.
    // If we want to verify the dynamic response, we need to wait for a new message.
    await expect(page.locator('[data-testid="daniela-message"]')).toHaveCount(2, { timeout: 10000 });
  });

  test('should handle voice recording interaction', async ({ page }) => {
    const micButton = page.locator('[data-testid="daniela-mic"]');

    // Initial state: Not recording (Mic icon or just Mic component)
    await expect(micButton).toBeVisible();

    // Click to start listening
    await micButton.click();

    // Should indicate listening (pulse animation or indicator)
    // The component adds 'animate-pulse' and 'StopCircle' icon.
    // We can check for a change in class or presence of StopCircle if we want to be specific,
    // but just checking it stays visible and clickable is a good start.
    await expect(micButton).toBeVisible();

    // Click again to stop
    await micButton.click();

    await expect(micButton).toBeVisible();
  });

  test('should maintain conversation history', async ({ page }) => {
    const input = page.locator('[data-testid="daniela-input"]');
    const send = page.locator('[data-testid="daniela-send"]');

    const messages = ['Primer mensaje', 'Segundo mensaje'];

    for (const msg of messages) {
      await input.fill(msg);
      await send.click();
      await page.waitForTimeout(500); // Small delay to avoid race conditions
    }

    // Check message count (Initial AI message + 2 User messages + 2 AI responses = 5)
    await expect(page.locator('[data-testid="daniela-message"]')).toHaveCount(5);

    for (const msg of messages) {
      await expect(page.getByText(msg)).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.getByText('DANIELA', { exact: true })).toBeVisible();
    await expect(page.locator('[data-testid="daniela-input"]')).toBeVisible();

    // Check if the panel is still readable (no overflow issues that hide it)
    const panel = page.locator('[data-testid="daniela-input"]').locator('xpath=..');
    await expect(panel).toBeVisible();
  });
});
