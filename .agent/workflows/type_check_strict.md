---
description: Run strict type checking across the frontend and backend to catch errors early.
---

# Type Check Strict Workflow

## 1. Type Check Frontend
- [ ] Run tsc on frontend apps.
// turbo
```bash
pnpm --filter frontend-dashboard run type-check
```

## 2. Type Check Backend
- [ ] Run tsc on backend service.
// turbo
```bash
pnpm --filter backend exec tsc --noEmit
```

## 3. Type Check Shared Libs
- [ ] Run tsc on shared libraries.
// turbo
```bash
pnpm --filter shared-* exec tsc --noEmit
```
