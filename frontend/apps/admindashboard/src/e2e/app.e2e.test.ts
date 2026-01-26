import { test, expect, beforeAll, afterAll, beforeEach } from '@playwright/test';

describe('AIGestion E2E Tests', () => {
  let page: any;

  beforeAll(async () => {
    // Setup browser context
    const { chromium } = require('playwright');
    const browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await page.close();
  });

  beforeEach(async () => {
    await page.goto('http://localhost:5173');
  });

  describe('Authentication Flow', () => {
    test('User can login with valid credentials', async () => {
      // Navigate to login page
      await page.click('[data-testid="login-button"]');

      // Fill login form
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');

      // Submit form
      await page.click('[data-testid="login-submit"]');

      // Verify successful login
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-email"]')).toHaveText('test@example.com');
    });

    test('User cannot login with invalid credentials', async () => {
      await page.click('[data-testid="login-button"]');

      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');

      await page.click('[data-testid="login-submit"]');

      // Verify error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toHaveText(/invalid credentials/i);
    });

    test('User can logout', async () => {
      // First login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="login-submit"]');

      // Then logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');

      // Verify logout
      await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
    });
  });

  describe('Dashboard Navigation', () => {
    beforeEach(async () => {
      // Login before each test
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="login-submit"]');
    });

    test('Dashboard loads correctly', async () => {
      await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible();
    });

    test('Navigation menu works', async () => {
      // Test navigation items
      await page.click('[data-testid="nav-conversations"]');
      await expect(page.locator('[data-testid="conversations-page"]')).toBeVisible();

      await page.click('[data-testid="nav-settings"]');
      await expect(page.locator('[data-testid="settings-page"]')).toBeVisible();

      await page.click('[data-testid="nav-dashboard"]');
      await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
    });

    test('User profile page loads', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="profile-link"]');

      await expect(page.locator('[data-testid="profile-page"]')).toBeVisible();
      await expect(page.locator('[data-testid="profile-form"]')).toBeVisible();
    });
  });

  describe('Conversation Management', () => {
    beforeEach(async () => {
      // Login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="login-submit"]');

      // Navigate to conversations
      await page.click('[data-testid="nav-conversations"]');
    });

    test('User can create new conversation', async () => {
      await page.click('[data-testid="new-conversation"]');

      // Fill conversation details
      await page.fill('[data-testid="conversation-title"]', 'Test Conversation');
      await page.selectOption('[data-testid="conversation-type"]', 'chat');

      await page.click('[data-testid="create-conversation"]');

      // Verify conversation created
      await expect(page.locator('[data-testid="conversation-list"]')).toContainText('Test Conversation');
    });

    test('User can send messages in conversation', async () => {
      // Create conversation first
      await page.click('[data-testid="new-conversation"]');
      await page.fill('[data-testid="conversation-title"]', 'Message Test');
      await page.click('[data-testid="create-conversation"]');

      // Send message
      await page.fill('[data-testid="message-input"]', 'Hello, this is a test message!');
      await page.click('[data-testid="send-message"]');

      // Verify message appears
      await expect(page.locator('[data-testid="message-list"]')).toContainText('Hello, this is a test message!');
    });

    test('User can search conversations', async () => {
      // Create multiple conversations
      for (let i = 0; i < 3; i++) {
        await page.click('[data-testid="new-conversation"]');
        await page.fill('[data-testid="conversation-title"]', `Test Conversation ${i}`);
        await page.click('[data-testid="create-conversation"]');
        await page.click('[data-testid="nav-conversations"]'); // Go back
      }

      // Search
      await page.fill('[data-testid="search-input"]', 'Test Conversation 1');

      // Verify search results
      await expect(page.locator('[data-testid="conversation-list"]')).toContainText('Test Conversation 1');
      await expect(page.locator('[data-testid="conversation-list"]')).not.toContainText('Test Conversation 2');
    });
  });

  describe('AI Chat Interface', () => {
    beforeEach(async () => {
      // Login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="login-submit"]');

      // Navigate to AI chat
      await page.click('[data-testid="nav-ai-chat"]');
    });

    test('AI chat interface loads', async () => {
      await expect(page.locator('[data-testid="ai-chat"]')).toBeVisible();
      await expect(page.locator('[data-testid="chat-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="model-selector"]')).toBeVisible();
    });

    test('User can send message to AI', async () => {
      await page.fill('[data-testid="chat-input"]', 'What is the capital of France?');
      await page.click('[data-testid="send-message"]');

      // Wait for AI response
      await page.waitForSelector('[data-testid="ai-response"]');

      // Verify response contains relevant information
      await expect(page.locator('[data-testid="ai-response"]')).toContainText('Paris');
    });

    test('User can change AI model', async () => {
      await page.selectOption('[data-testid="model-selector"]', 'gpt-4');

      // Verify model changed
      await expect(page.locator('[data-testid="current-model"]')).toHaveText('GPT-4');

      // Send message to test new model
      await page.fill('[data-testid="chat-input"]', 'Hello!');
      await page.click('[data-testid="send-message"]');

      await page.waitForSelector('[data-testid="ai-response"]');
    });

    test('Voice input works', async () => {
      // Mock voice input
      await page.click('[data-testid="voice-input"]');

      // Verify voice recording UI appears
      await expect(page.locator('[data-testid="voice-recording"]')).toBeVisible();

      // Stop recording
      await page.click('[data-testid="stop-recording"]');

      // Verify transcription appears
      await expect(page.locator('[data-testid="transcription"]')).toBeVisible();
    });
  });

  describe('Settings and Preferences', () => {
    beforeEach(async () => {
      // Login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="login-submit"]');

      // Navigate to settings
      await page.click('[data-testid="nav-settings"]');
    });

    test('User can update profile information', async () => {
      await page.click('[data-testid="profile-tab"]');

      await page.fill('[data-testid="name-input"]', 'Updated Name');
      await page.fill('[data-testid="bio-input"]', 'This is my updated bio');

      await page.click('[data-testid="save-profile"]');

      // Verify success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toHaveText(/profile updated/i);
    });

    test('User can change theme', async () => {
      await page.click('[data-testid="appearance-tab"]');

      await page.selectOption('[data-testid="theme-selector"]', 'dark');

      // Verify theme changed
      await expect(page.locator('body')).toHaveClass(/dark/);
    });

    test('User can manage notifications', async () => {
      await page.click('[data-testid="notifications-tab"]');

      await page.check('[data-testid="email-notifications"]');
      await page.uncheck('[data-testid="push-notifications"]');

      await page.click('[data-testid="save-notifications"]');

      // Verify success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });
  });

  describe('Responsive Design', () => {
    test('Mobile view works correctly', async () => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone size

      // Login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="login-submit"]');

      // Verify mobile navigation
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

      // Test mobile menu toggle
      await page.click('[data-testid="mobile-menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
    });

    test('Tablet view works correctly', async () => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad size

      // Login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="login-submit"]');

      // Verify tablet layout
      await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
      await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
    });
  });

  describe('Performance Tests', () => {
    test('Page load performance', async () => {
      const startTime = Date.now();

      await page.goto('http://localhost:5173');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('Large conversation list performance', async () => {
      // Login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="login-submit"]');

      // Navigate to conversations
      await page.click('[data-testid="nav-conversations"]');

      // Simulate large list (this would be mocked in real tests)
      const startTime = Date.now();

      // Scroll through list
      await page.evaluate(() => {
        const list = document.querySelector('[data-testid="conversation-list"]');
        if (list) {
          list.scrollTop = list.scrollHeight;
        }
      });

      const scrollTime = Date.now() - startTime;

      // Scrolling should be smooth (< 500ms)
      expect(scrollTime).toBeLessThan(500);
    });
  });

  describe('Accessibility Tests', () => {
    test('Keyboard navigation works', async () => {
      // Login using keyboard
      await page.keyboard.press('Tab'); // Focus login button
      await page.keyboard.press('Enter');

      await page.keyboard.press('Tab'); // Focus email input
      await page.keyboard.type('test@example.com');

      await page.keyboard.press('Tab'); // Focus password input
      await page.keyboard.type('testpassword123');

      await page.keyboard.press('Tab'); // Focus submit button
      await page.keyboard.press('Enter');

      // Verify login successful
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    test('Screen reader compatibility', async () => {
      // Check for proper ARIA labels
      await page.goto('http://localhost:5173');

      const loginButton = page.locator('[data-testid="login-button"]');
      await expect(loginButton).toHaveAttribute('aria-label');

      // Check for proper heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('Network error handling', async () => {
      // Mock network failure
      await page.route('/api/v1/**', route => route.abort());

      // Try to login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'testpassword123');
      await page.click('[data-testid="login-submit"]');

      // Verify error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toHaveText(/network error/i);
    });

    test('Form validation errors', async () => {
      await page.click('[data-testid="login-button"]');

      // Try to submit empty form
      await page.click('[data-testid="login-submit"]');

      // Verify validation errors
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    });
  });
});
