---
description: Restore Redis data from backup.
---

# Restore Redis

## 1. Stop Redis

- [ ] Stop the container.
      // turbo

```bash
docker-compose stop redis
```

## 2. Replace Dump

- [ ] Copy backup file back to volume path.

```bash
# Needs volume mount access or temporary container
# docker run --rm -v aigestion_redis_data:/data -v $(pwd)/backups:/backups ubuntu cp /backups/dump.rdb /data/dump.rdb
```

## 3. Start

- [ ] Start Redis.
      // turbo

```bash
docker-compose start redis
```
