---
description: Detect circular dependencies in the codebase using Madge.
---

# Check Circular Dependencies

## 1. Run Madge

- [ ] Execute Madge on source files.
      // turbo

```bash
npx madge --circular --extensions ts,tsx ./backend/src ./frontend/apps/dashboard/src
```

## 2. Generate Image (Optional)

- [ ] Generate a visual graph of dependencies (requires Graphviz).

```bash
npx madge --image dependency-graph.svg ./backend/src
```
