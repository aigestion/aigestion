---
description: Deep clean the project (remove node_modules, dist, build artifacts) to fix weird caching issues.
---

# Project Deep Clean Workflow

## 1. Stop Running Processes
- [ ] Stop all running servers/terminals.
- [ ] Stop Docker containers: `docker-compose down`

## 2. Remove Artifacts
- [ ] Delete `node_modules` in root and all packages.
- [ ] Delete `dist` / `build` folders.
- [ ] Delete `.turbo` cache folders.
- [ ] Delete `.next` folders.
// turbo
```bash
Get-ChildItem -Path . -Include node_modules,dist,build,.turbo,.next -Recurse -Directory | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
```

## 3. Reinstall
- [ ] Run `pnpm install` / `npm install`.
- [ ] Run `npm run build` to verify clean state.
