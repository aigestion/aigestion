---
description: Backup Postgres database to local SQL file.
---

# Backup Postgres

## 1. Dump
- [ ] Run pg_dump via docker.
// turbo
```bash
docker-compose exec -T -u postgres postgres pg_dump aigestion_db > backups/postgres/dump-$(date +%F).sql
```

## 2. Verify
- [ ] Check file size.
```bash
ls -lh backups/postgres
```
