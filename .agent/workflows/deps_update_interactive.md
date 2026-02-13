---
description: Interactively check and update project dependencies.
---

# Update Dependencies Workflow

## 1. Check Outdated

- [ ] Run `npm outdated` or `pnpm outdated` to see available updates.
      // turbo

```bash
npm outdated
```

## 2. Review Critical Updates

- [ ] Identify **Security** updates (use `npm audit` if needed).
- [ ] Identify **Major** version changes (breaking changes).

## 3. Update

- [ ] Update specific packages: `npm install [package]@[version]`
- [ ] **Do not** update everything blindly unless you are brave.

## 4. Test

- [ ] Run `npm run test` after updating to ensure no regressions.
