---
description: Check if required ports are already in use.
---

# Check Port Availability

## 1. Check Standard Ports
- [ ] Check ports 3000, 4000, 5432, 6379.
// turbo
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :4000
netstat -ano | findstr :5432
netstat -ano | findstr :6379
```
