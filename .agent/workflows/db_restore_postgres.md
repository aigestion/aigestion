---
description: Restore Postgres database from local SQL file.
---

# Restore Postgres

## 1. Drop/Create

- [ ] Drop and recreate DB (Dangerous).
      // turbo

```bash
docker-compose exec -u postgres postgres dropdb aigestion_db
docker-compose exec -u postgres postgres createdb aigestion_db
```

## 2. Psql Import

- [ ] Import dump.

```bash
cat backups/postgres/dump.sql | docker-compose exec -T -u postgres postgres psql aigestion_db
```
