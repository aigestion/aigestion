---
description: Run End-to-End tests using Cypress/Playwright.
---

# Run E2E Tests

## 1. Start Environment

- [ ] Ensure backend and frontend are running.
      // turbo

```bash
docker-compose up -d
```

## 2. Run Tests Headless

- [ ] Run Cypress in CI mode.
      // turbo

```bash
cd frontend/apps/dashboard
npx cypress run
```

## 3. Open Interactive Mode (Optional)

- [ ] Open Cypress UI.

```bash
npx cypress open
```
