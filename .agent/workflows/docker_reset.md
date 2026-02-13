---
description: Stop all containers, remove volumes, and restart fresh.
---

# Docker Reset Workflow

## 1. Stop & Remove

- [ ] Stop all containers and remove orphans.
- [ ] Remove named volumes (WARNING: Database data will be lost).
      // turbo

```bash
docker-compose down --volumes --remove-orphans
```

## 2. Pull Latest

- [ ] Pull latest images for services.
      // turbo

```bash
docker-compose pull
```

## 3. Restart

- [ ] Start services in detached mode.
      // turbo

```bash
docker-compose up -d
```
