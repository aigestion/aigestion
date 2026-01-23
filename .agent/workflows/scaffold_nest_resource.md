---
description: Scaffolds a new NestJS resource (Module, Controller, Service) in the backend.
---

# Scaffold Backend Resource

## 1. Input Required
- **Resource Name**: (e.g., `audit-logs`)

## 2. Generate Files
- [ ] Run NestJS CLI to generate resource.
// turbo
```bash
cd backend
npx nest g resource [Resource Name] --no-spec
```

## 3. Register Module
- [ ] Ensure the new module is imported in `app.module.ts`.

## 4. DTOs
- [ ] Create `dto/create-[base].dto.ts` and `dto/update-[base].dto.ts`.
