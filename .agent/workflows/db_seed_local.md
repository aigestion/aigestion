---
description: Seed the local database with dummy data for development.
---

# Database Seed Local

## 1. Reset Data (Optional)
- [ ] Truncate existing tables if needed.
// turbo
```bash
npm run typeorm:schema:drop
npm run typeorm:schema:sync
```

## 2. Run Seeders
- [ ] execute seed script.
// turbo
```bash
cd backend
npm run seed:run
```
