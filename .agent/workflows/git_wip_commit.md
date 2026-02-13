---
description: Quick 'work in progress' commit to save state without triggering CI.
---

# Git WIP Commit

## 1. Stage All

- [ ] Stage all changes.
      // turbo

```bash
git add .
```

## 2. Commit

- [ ] Commit with WIP prefix (skips some hooks if configured).
      // turbo

```bash
git commit -m "wip: snapshot save point [skip ci]"
```
