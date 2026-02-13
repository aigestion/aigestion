---
description: Backup Redis data to local file.
---

# Backup Redis

## 1. Save

- [ ] Trigger Redis SAVE command.
      // turbo

```bash
docker-compose exec redis redis-cli SAVE
```

## 2. Copy Dump

- [ ] Copy dump.rdb to backups folder.
      // turbo

```bash
mkdir -p backups/redis
docker cp aigestion-redis-1:/data/dump.rdb ./backups/redis/dump-$(date +%F).rdb
```
