---
description: Aggressively fix linting and formatting errors across the entire monorepo.
---

# Lint Fix All Workflow

## 1. Run Prettier
- [ ] Format all files using Prettier.
// turbo
```bash
npm run format
```

## 2. Run ESLint Auto-Fix
- [ ] Fix automatic linting errors.
// turbo
```bash
npm run lint:fix
```

## 3. Verify
- [ ] Run standard lint check to see remaining manual errors.
```bash
npm run lint
```
