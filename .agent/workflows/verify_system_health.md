---
description: Run self-check on all services.
---

# Verify System Health

## 1. Check Endpoints

- [ ] Curl health endpoints.
      // turbo

```bash
curl http://localhost:3000/api/health
curl http://localhost:4000/health
```

## 2. Check Database

- [ ] Connect to DB and run query.
      // turbo

```bash
docker-compose exec postgres psql -U postgres -c "SELECT 1;"
```
