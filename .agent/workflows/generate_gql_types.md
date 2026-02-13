---
description: Regenerate TypeScript types from GraphQL schema definitions.
---

# Generate GraphQL Types

## 1. Introspect Schema

- [ ] Fetch latest schema from backend.
      // turbo

```bash
cd frontend/apps/dashboard
npm run codegen:introspect
```

## 2. Generate Types

- [ ] Run codegen to update TypeScript interfaces.
      // turbo

```bash
npm run codegen:generate
```
