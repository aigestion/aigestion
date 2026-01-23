---
description: Compress images in the project using local tools.
---

# Optimize Images

## 1. Install Tool
- [ ] Ensure `imagemin-cli` is installed.
```bash
npm install -g imagemin-cli imagemin-mozjpeg imagemin-pngquant
```

## 2. Compress
- [ ] Run compression on assets folder.
```bash
imagemin frontend/apps/dashboard/src/assets/* --out-dir=frontend/apps/dashboard/src/assets/optimized
```
