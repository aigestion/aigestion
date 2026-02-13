---
description: Find unused exported functions and classes to cleanup code.
---

# Find Unused Exports

## 1. Run TS-Prune

- [ ] Run ts-prune analysis.
      // turbo

```bash
npx ts-prune -p tsconfig.json | grep -v "used in module"
```

## 2. Review

- [ ] Manually verify if the exports are public APIs or actually dead code.
