---
description: Optimize Google Cloud setup and configure Google Maps API
---

# Google Cloud Optimization Workflow

## 1️⃣ Enable Required APIs
- Open **Google Cloud Console** → **APIs & Services** → **Library**.
- Enable the following APIs (if not already enabled):
  - **Maps JavaScript API**
  - **Geocoding API**
  - **Places API** (optional, for place search)
  - **Cloud Run API**
  - **Cloud Tasks API**
  - **Secret Manager API**
  - **Cloud Monitoring API**
  - **Cloud Logging API**

## 2️⃣ Set Up Billing & Quotas
- Ensure a valid **billing account** is linked to the project.
- Review quota limits for Maps APIs; request higher quota if needed.

## 3️⃣ Secure API Keys with Secret Manager
- In **Secret Manager**, create a secret named `google-maps-api-key` and store the actual key.
- Grant the service account used by your backend (e.g., `cloudrun-service-account@your-project.iam.gserviceaccount.com`) the `Secret Manager Secret Accessor` role.
- Update your `.env` to reference the secret at runtime (e.g., using `GOOGLE_MAPS_API_KEY=$(gcloud secrets versions access latest --secret=google-maps-api-key)`).

## 4️⃣ Restrict the Maps API Key
- In **Credentials** → **API keys**, select the Maps key.
- Set **Application restrictions** to `HTTP referrers (web sites)` for the frontend URL.
- Set **API restrictions** to only the Maps APIs you enabled.
- Enable **IP address restrictions** for server‑side usage.

## 5️⃣ Optimize Cloud Run Deployment
- Use **autoscaling**: set `maxInstances` based on expected load.
- Enable **CPU allocation** only during request handling (`CPU always allocated: false`).
- Set **memory limits** appropriate for your workload (e.g., 512Mi‑1Gi).
- Enable **request logging** and **distributed tracing** via Cloud Logging & Cloud Trace.

## 6️⃣ Configure Cloud Tasks for Background Work
- Create a **Cloud Tasks queue** with appropriate rate limits.
- Use **IAM** to grant the Cloud Run service the `cloudtasks.tasks.create` permission.
- Update your backend to enqueue tasks for heavy operations (e.g., batch geocoding).

## 7️⃣ Monitoring & Alerts
- Set up **Cloud Monitoring dashboards** for:
  - Cloud Run CPU/memory usage.
  - Maps API request count & error rates.
  - Cloud Tasks queue depth.
- Create **alerting policies** for high error rates or quota exhaustion.

## 8️⃣ CI/CD Integration
- Store the placeholder `<GOOGLE_MAPS_API_KEY_PLACEHOLDER>` in `.env.example`.
- In your CI pipeline, inject the real key from Secret Manager before deployment.
- Run `npm run audit:env` after deployment to ensure no secrets leak.

## 9️⃣ Documentation Update
- Add a section in your project README:
  ```markdown
  ## Google Maps API
  - Obtain an API key from the Google Cloud Console.
  - Store it in Secret Manager as `google-maps-api-key`.
  - The key is injected at runtime; do not commit the real key.
  ```

---

**Run this workflow** by following the steps in order. Adjust any values (project ID, service account) to match your environment.
