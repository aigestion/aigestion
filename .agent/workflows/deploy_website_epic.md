---
description: Build and deploy the website-epic application to Cloud Run
---

# Deploy Website Epic

This workflow builds the `website-epic` frontend and deploys it to Google Cloud Run under the `aigestion-sovereign-2026` project.

## 1. Build Production Bundle

- [ ] Build the frontend app using pnpm.
      // turbo

```bash
cd frontend/apps/website-epic
pnpm build
```

## 2. Docker Cloud Build

- [ ] Build and push Docker image using Google Cloud Build (Artifact Injection Method).

```bash
cd frontend/apps/website-epic
# Use the specialized deployment Dockerfile that consumes pre-built assets
gcloud builds submit --tag gcr.io/aigestion-sovereign-2026/website-epic:latest --dockerfile Dockerfile.deploy .
```

*Note: Ensure `cloudbuild.yaml` or the command points to `Dockerfile.deploy`.*

## 3. Deploy to Cloud Run

- [ ] Deploy the image to Cloud Run with public access.

```bash
gcloud run deploy website-epic --image gcr.io/aigestion-sovereign-2026/website-epic:latest --platform managed --region us-central1 --allow-unauthenticated --project aigestion-sovereign-2026
```
