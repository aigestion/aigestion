---
description: Run bundle analysis to find large dependencies.
---

# Analyze Bundle Size

## 1. Build with Stats

- [ ] Run build command with analyze flag (requires `vite-bundle-visualizer` or similar setup).
      // turbo

```bash
cd frontend/apps/dashboard
npx vite-bundle-visualizer
```

## 2. Review Report

- [ ] Open the generated HTML report (usually `stats.html`).
- [ ] Identify large libraries that can be lazy-loaded or replaced.
