import { expect, test } from '@playwright/test';

test.describe('Daniela AI Futurista - E2E Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/daniela');
  });

  test('should load Daniela demo page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Daniela/);

    // Check main elements
    await expect(page.getByText('DANIELA')).toBeVisible();
    await expect(page.getByText('Asistente IA Futurista')).toBeVisible();

    // Check conversation panel
    await expect(page.getByPlaceholderText('Escribe o habla con Daniela...')).toBeVisible();
    await expect(page.getByRole('button', { name: /micrófono/i })).toBeVisible();
  });

  test('should handle text conversation flow', async ({ page }) => {
    // Type a message
    await page.fill('[data-testid="text-input"]', 'Hola Daniela, ¿cómo estás?');

    // Send message
    await page.click('[data-testid="send-button"]');

    // Wait for response
    await expect(page.getByText(/¡Hola! Estoy excelente/)).toBeVisible({
      timeout: 5000,
    });

    // Check that both messages are displayed
    await expect(page.getByText('Hola Daniela, ¿cómo estás?')).toBeVisible();
    await expect(page.getByText(/¡Hola! Estoy excelente/)).toBeVisible();
  });

  test('should handle voice recording flow', async ({ page }) => {
    // Mock microphone permission
    await page.context.grantPermissions(['microphone']);

    // Click record button
    await page.click('[data-testid="voice-button"]');

    // Check recording state
    await expect(page.getByText('ESCUCHANDO...')).toBeVisible();
    await expect(page.getByText('DANIELA_LISTENING')).toBeVisible();

    // Simulate voice input (mock)
    await page.evaluate(() => {
      const event = new CustomEvent('voice-input', {
        detail: { text: 'Hola Daniela por voz' },
      });
      window.dispatchEvent(event);
    });

    // Stop recording
    await page.click('[data-testid="voice-button"]');

    // Wait for response
    await expect(page.getByText(/Hola Daniela por voz/)).toBeVisible({
      timeout: 5000,
    });
  });

  test('should display emotional analysis', async ({ page }) => {
    // Send a message that should trigger emotional analysis
    await page.fill('[data-testid="text-input"]', 'Estoy muy feliz con el servicio');
    await page.click('[data-testid="send-button"]');

    // Wait for emotional analysis
    await expect(page.getByText('ANÁLISIS EMOCIONAL')).toBeVisible({
      timeout: 3000,
    });

    // Check emotional indicators
    await expect(page.getByText(/HAPPY/)).toBeVisible();
    await expect(page.getByText(/\d+%/)).toBeVisible();
    await expect(page.getByText(/POSITIVE/)).toBeVisible();
  });

  test('should show suggested actions', async ({ page }) => {
    // Send a message about dashboard
    await page.fill('[data-testid="text-input"]', 'Muéstrame el dashboard');
    await page.click('[data-testid="send-button"]');

    // Wait for suggested actions
    await expect(page.getByText('SUGERENCIAS RÁPIDAS:')).toBeVisible({
      timeout: 3000,
    });

    // Check for dashboard-related suggestions
    await expect(page.getByText(/dashboard/i)).toBeVisible();

    // Click on suggested action
    await page.click('[data-testid="suggested-action"]:first-child');

    // Check that it populates the input
    const inputValue = await page.inputValue('[data-testid="text-input"]');
    expect(inputValue).toContain('dashboard');
  });

  test('should handle conversation history', async ({ page }) => {
    // Send multiple messages
    const messages = [
      'Hola Daniela',
      '¿Cómo funciona el análisis emocional?',
      'Muéstrame un ejemplo',
    ];

    for (const message of messages) {
      await page.fill('[data-testid="text-input"]', message);
      await page.click('[data-testid="send-button"]');
      await page.waitForTimeout(1000);
    }

    // Check that all messages are displayed
    for (const message of messages) {
      await expect(page.getByText(message)).toBeVisible();
    }

    // Check conversation context
    await expect(page.locator('[data-testid="conversation-message"]')).toHaveCount(
      messages.length * 2 // user + daniela responses
    );
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Mock network error
    await page.route('/api/v1/enhanced-voice/process', route => {
      route.abort('failed');
    });

    // Try to send a message
    await page.fill('[data-testid="text-input"]', 'Test message');
    await page.click('[data-testid="send-button"]');

    // Should show error message
    await expect(page.getByText(/error/i)).toBeVisible({
      timeout: 5000,
    });

    // Should allow retry
    await expect(page.getByRole('button', { name: /reintentar/i })).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('DANIELA')).toBeVisible();
    await expect(page.getByPlaceholderText('Escribe o habla con Daniela...')).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('DANIELA')).toBeVisible();

    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByText('DANIELA')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on input
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholderText('Escribe o habla con Daniela...')).toBeFocused();

    // Type message
    await page.keyboard.type('Hola Daniela');

    // Send with Enter
    await page.keyboard.press('Enter');

    // Wait for response
    await expect(page.getByText(/¡Hola!/)).toBeVisible({
      timeout: 5000,
    });
  });

  test('should maintain conversation context across interactions', async ({ page }) => {
    // Start conversation
    await page.fill('[data-testid="text-input"]', 'Mi nombre es Alejandro');
    await page.click('[data-testid="send-button"]');

    await page.waitForTimeout(1000);

    // Follow-up question
    await page.fill('[data-testid="text-input"]', '¿Recuerdas mi nombre?');
    await page.click('[data-testid="send-button"]');

    // Should remember the context
    await expect(page.getByText(/Alejandro/)).toBeVisible({
      timeout: 5000,
    });
  });

  test('should handle concurrent interactions', async ({ page }) => {
    // Start typing
    await page.fill('[data-testid="text-input"]', 'Primer mensaje');

    // Click record before sending
    await page.click('[data-testid="voice-button"]');

    // Should handle both interactions
    await expect(page.getByText('ESCUCHANDO...')).toBeVisible();
    await expect(page.getByPlaceholderText('Escribe o habla con Daniela...')).toHaveValue(
      'Primer mensaje'
    );

    // Stop recording
    await page.click('[data-testid="voice-button"]');

    // Should be able to send the typed message
    await page.click('[data-testid="send-button"]');
    await expect(page.getByText('Primer mensaje')).toBeVisible();
  });

  test('should display performance metrics', async ({ page }) => {
    // Check for performance indicators
    await expect(page.locator('[data-testid="response-time"]')).toBeVisible();
    await expect(page.locator('[data-testid="connection-status"]')).toBeVisible();

    // Send message and check metrics update
    await page.fill('[data-testid="text-input"]', 'Test performance');
    await page.click('[data-testid="send-button"]');

    // Should show updated metrics
    await expect(page.locator('[data-testid="response-time"]')).toContainText(/\d+ms/);
  });

  test('should handle different modes (conversation, features, analytics)', async ({ page }) => {
    // Check mode tabs
    await expect(page.getByText('CONVERSACIÓN')).toBeVisible();
    await expect(page.getByText('CARACTERÍSTICAS')).toBeVisible();
    await expect(page.getByText('ANALÍTICA')).toBeVisible();

    // Switch to features mode
    await page.click('[data-testid="mode-tab"]:has-text("CARACTERÍSTICAS")');

    // Should show features
    await expect(page.getByText(/Inteligencia Emocional/)).toBeVisible();
    await expect(page.getByText(/Voz Natural/)).toBeVisible();

    // Switch to analytics mode
    await page.click('[data-testid="mode-tab"]:has-text("ANALÍTICA")');

    // Should show analytics
    await expect(page.getByText(/Métricas de Rendimiento/)).toBeVisible();
    await expect(page.getByText(/Análisis Emocional/)).toBeVisible();
  });

  test('should handle accessibility features', async ({ page }) => {
    // Check ARIA labels
    await expect(page.getByRole('button', { name: /micrófono/i })).toHaveAttribute('aria-label');

    // Check semantic structure
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: /daniela/i })).toBeVisible();

    // Check keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /micrófono/i })).toBeFocused();
  });

  test('should handle long conversations', async ({ page }) => {
    // Send many messages to test scrolling
    for (let i = 0; i < 20; i++) {
      await page.fill('[data-testid="text-input"]', `Mensaje ${i + 1}`);
      await page.click('[data-testid="send-button"]');
      await page.waitForTimeout(500);
    }

    // Check that conversation scrolls properly
    const lastMessage = page.getByText('Mensaje 20');
    await lastMessage.scrollIntoViewIfNeeded();
    await expect(lastMessage).toBeVisible();

    // Check that input is still accessible
    await expect(page.getByPlaceholderText('Escribe o habla con Daniela...')).toBeVisible();
  });

  test('should handle theme switching', async ({ page }) => {
    // Check for theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"]');

    if (await themeToggle.isVisible()) {
      // Switch theme
      await themeToggle.click();

      // Check that theme changed
      await expect(page.locator('body')).toHaveClass(/dark|light/);
    }
  });

  test('should handle network disconnection', async ({ page }) => {
    // Simulate network disconnection
    await page.context.setOffline(true);

    // Try to send message
    await page.fill('[data-testid="text-input"]', 'Test offline');
    await page.click('[data-testid="send-button"]');

    // Should show offline indicator
    await expect(page.getByText(/desconectado/i)).toBeVisible({
      timeout: 3000,
    });

    // Reconnect
    await page.context.setOffline(false);

    // Should show reconnected state
    await expect(page.getByText(/conectado/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('should handle audio playback', async ({ page }) => {
    // Mock audio context
    await page.addInitScript(() => {
      window.Audio = class MockAudio {
        play() {
          return Promise.resolve();
        }
        pause() {}
        addEventListener() {}
        removeEventListener() {}
      };
    });

    // Send message that should trigger audio response
    await page.fill('[data-testid="text-input"]', 'Habla conmigo');
    await page.click('[data-testid="send-button"]');

    // Check for audio controls
    await expect(page.locator('[data-testid="audio-controls"]')).toBeVisible({
      timeout: 3000,
    });

    // Test audio controls
    await page.click('[data-testid="play-audio"]');
    await page.click('[data-testid="pause-audio"]');
  });

  test('should handle session persistence', async ({ page }) => {
    // Start conversation
    await page.fill('[data-testid="text-input"]', 'Mensaje inicial');
    await page.click('[data-testid="send-button"]');

    await page.waitForTimeout(1000);

    // Refresh page
    await page.reload();

    // Should restore conversation
    await expect(page.getByText('Mensaje inicial')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should handle error recovery', async ({ page }) => {
    // Mock temporary error
    let callCount = 0;
    await page.route('/api/v1/enhanced-voice/process', route => {
      callCount++;
      if (callCount === 1) {
        route.abort('failed');
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              response: 'Recuperado exitosamente',
              suggestedActions: [],
              context: { messages: [], emotionalHistory: [], clientProfile: {} },
            },
          }),
        });
      }
    });

    // Try to send message (should fail)
    await page.fill('[data-testid="text-input"]', 'Test error');
    await page.click('[data-testid="send-button"]');

    // Should show error
    await expect(page.getByText(/error/i)).toBeVisible({
      timeout: 3000,
    });

    // Retry should work
    await page.click('[data-testid="retry-button"]');

    // Should succeed
    await expect(page.getByText('Recuperado exitosamente')).toBeVisible({
      timeout: 5000,
    });
  });
});
