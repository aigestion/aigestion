---
description: Revert Cloud Run service to previous revision.
---

# Rollback Last Deploy

## 1. List Revisions

- [ ] List recent revisions.

```bash
gcloud run revisions list --service backend-service --region [REGION]
```

## 2. Rollback

- [ ] Update traffic to previous revision.

```bash
gcloud run services update-traffic backend-service --to-revisions=[REVISION_NAME]=100
```
