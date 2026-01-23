---
description: Tail and formatted logs from the backend service.
---

# Monitor Backend Logs

## 1. Docker Logs
- [ ] Follow logs from the backend container.
// turbo
```bash
docker-compose logs -f --tail=100 backend
```

## 2. Filter Error
- [ ] Show only errors.
```bash
docker-compose logs --tail=100 backend | grep "ERROR"
```
