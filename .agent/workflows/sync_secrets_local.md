---
description: Sync/Mock local secrets for development from a secure source (template).
---

# Sync Secrets Local

## 1. Copy Example

- [ ] Copy `.env.example` to `.env`.
      // turbo

```bash
cp .env.example .env
```

## 2. Generate Missing Keys (Mock)

- [ ] Generate random string for secrets if empty.

```bash
# Example logic for manual run
# openssl rand -base64 32
```

## 3. Verify

- [ ] Check if `.env` exists and has values.
