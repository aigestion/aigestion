# 🛰️ Mission Operations: God Mode Runbook

> Operational status, deployment pipelines, and maintenance protocols for AIGestion.

## Operations Guide

# AIGestion Nexus: Master Operations & Infrastructure Guide

The authoritative reference for system management, security hardening, and operational recovery for the AIGestion ecosystem (Nexus V1/V2).

---

## 1. Environment Standards (God-Mode Optimized)

The project utilizes an 20-section `.env` structure to ensure maximum clarity and service integration.

### 1.1 Core Configuration Blocks

1. **Server & Runtime**: `NODE_ENV`, `PORT`, `FRONTEND_URL`, `BASE_URL`.
2. **Security & Auth**: `JWT_SECRET`, `SESSION_SECRET`, `API_KEY`, `N8N_JWT_TOKEN`.
3. **Rate Limiting**: `RATE_LIMIT_...` (Global, Auth, and AI specific).
4. **Databases & Queues**: MongoDB, Redis, PostgreSQL (SQLite), RabbitMQ.
5. **AI Engine (ML)**: `MODEL_PATH`, `DEFAULT_MODEL`, `ONNX_ENABLED`, `ENABLE_RETRAINING`, `IA_ENGINE_URL` (Sovereign Swarm Bridge).
6. **AI Providers**: OpenAI, Anthropic, Gemini, DeepSeek, HuggingFace, Tavily, Runway.
7. **GCP Services**: `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS`, Vertex AI/Search, Document AI.
8. **Communications**: Twilio, WhatsApp, Telegram, Mailjet.
9. **Integrations & Social**: Stripe, PayPal, Figma, Notion, YouTube, **Social Media (Meta, X, LinkedIn, TikTok)**.
10. **Monitoring & Logging**: OTEL, Datadog (API Token), Sentry, Prometheus.
11. **Deployment**: Railway, AWS (Access Keys), Docker Compose, GitHub Repo URL.
12. **Tooling**: `MCP_SERVER_URL`, `MCP_API_KEY`, Figma/Stripe/PayPal/Firebase MCP servers.
13. **Ownership**: `NEXUS_OWNER_NAME`, `NEXUS_OWNER_DNI`, `NEXUS_ADMIN_ROLE=ROOT_OPERATOR_GOD_LEVEL`.
14. **Feature Flags**: Premium subscriptions, usage billing, advanced analytics.
15. **Credentials (Secrets)**: Centralized block for sensitive IDs/Tokens.
16. **Design & Prototyping**: `FIGMA_ACCESS_TOKEN`, `FIGMA_FILE_KEY`.
17. **Payments Hub**: `STRIPE_...`, `PAYPAL_...` (v2 Unified Hub).
18. **Web3 & Blockchain**: `METAMASK_PASSWORD`, `SAFEPAL_WALLET_ADDRESS`, `SAFEPAL_MNEMONIC`.
19. **Data Intelligence**: RSS news feeds for Economy, Crypto, Geopolitics, and AI.
20. **Advanced Capabilities**: `ELEVENLABS_API_KEY`, `VAPI_PUBLIC_KEY`, `PINECONE_API_KEY`, `GOOGLE_MAPS_API_KEY`, `BROWSERLESS_API_KEY`.

## 2. Security & IP Protection Hardening

### 2.1 Intellectual Property (IP) Defense

- **Owner**: Alejandro Manuel Alfonso Fernández (DNI: 28921591B).
- **Notarization**: Use `manifest_generator.py` for SHA-256 auditing (`INTELLECTUAL_PROPERTY_MANIFEST.md`).
- **Watermarking**: Critical components contain Auth Signatures (e.g., `NEXUS-GOD-LEVEL-UI-CORE-v1.0`).

### 2.2 System Hardening (Zero Trust)

- **Identity**: Tokens bound to `User-Agent`. Instant revocation via `tokenVersion`.
- **RTR**: Refresh Token Rotation with family-based reuse detection.
- **Infrastructure**: Nginx HSTS, CSP, and `rawBody` signature verification for webhooks.

### 2.3 Secret Management

- **Git Hygiene**: Persistent removal of secrets from history via `git-filter-repo`. `git rm --cached .env` if accidentally tracked.
- **Verification**: Zero hardcoded secrets; all keys verified via Zod.

---

## 3. Deployment & Infrastructure Recovery

### 3.1 Git Orchestration

- **Official Repository**: `https://github.com/noepab/aigestion.git`
- **PAT-based Auth**: `https://<TOKEN>@github.com/noepab/aigestion.git`.
- **Sync**: Use `git remote set-url origin https://<GITHUB_API_TOKEN>@...` to maintain connectivity.
- **Note**: Ensure `GITHUB_API_TOKEN` and `GITHUB_REPO_URL` are preserved in `.env` during mass configuration cleanups.

### 3.2 Recovery Patterns

- **BuildKit Deadlock**: Use `$env:DOCKER_BUILDKIT=0` if logs hang.
- **Docker Networking**: Use `alpine/socat` to bridge local backend (5000) to Docker containers.
- **Redis Stabilization**: Purge `dist/__mocks__/redis.js` to clear zombie mocks.
- **TypeScript Fixes**: Remove `DOM` lib from backend `tsconfig.json` to resolve Express type collisions.
- **Docker Compose Versioning**: The `version` attribute (e.g., `version: '3.8'`) is obsolete in modern Docker Compose V2. If warnings appear, remove it from the root of the file.

---

## 4. Credential Discovery Mission (Jan 17, 2026)

Verified CLI patterns for retrieving missing environment values:

### 4.1 Google Cloud / Cloud Run

- **Verified Services (Jan 2026)**:
  - Project ID: `aigestion-v2` (Active in gcloud).
  - Backend Service: `aigestion-app` in `europe-west1`.
  - Frontend Service: `aigestion-frontend` in `europe-west1`.
- **Credential Mismatch**: Service account key `infra/keys/gcp_service_account.json` refers to project `aigestion-v1-848dd`, while active services are in `aigestion-v2`. Verify cross-project IAM if connectivity fails.
- **Secret Manager**: Confirmed 0 secrets stored in the `aigestion-v2` project. Credentials are provided via local `.env`.
- **API Enablement**: Patterns for social integrations (YouTube, Maps) use `gcloud services enable` within the active project context.

### 4.2 Frontend Monorepo Structure

- **Root**: `frontend/`
- **Active Apps**:
  - `frontend/apps/dashboard`: Primary AI dashboard.
  - `frontend/apps/landingpage`: Marketing site.
  - `frontend/apps/landing-host`: Host application for landing pages.
  - `frontend/apps/experimental-client`: Testing area.
- **Service Check**: Verify `firebase-admin` in `node_modules`. Config typically resides in `apps/dashboard/src`.
- **Integrations List (Pending Credentials)**:
  - **Figma (Active)**: `FIGMA_ACCESS_TOKEN`, `FIGMA_FILE_KEY`, `FIGMA_DASHBOARDS_FILE_KEY` (Configured Jan 17, 2026).
  - **YouTube (Active)**: `YOUTUBE_API_KEY`, `YOUTUBE_PERSONAL_CHANNEL_ID` (CLI Provisioning complete Jan 18, 2026).
  - **Notion (Active)**: `NOTION_API_KEY`, `NOTION_DATABASE_ID` (Full connection & robust resource discovery active Jan 18, 2026).
  - **Stripe**: `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
  - **PayPal**: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE`
  - **Firebase**: `FIREBASE_API_KEY`, `FIREBASE_APP_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (Sovereign Integration).
  - **Social Media (Meta, X, LinkedIn, TikTok)**: Placeholders added Jan 17, 2026. Required for automated posting/analytics.
  - **Web3 Expansion (MetaMask & SafePal)**: `METAMASK_PASSWORD` (Stored), `SAFEPAL_PASSWORD`, `SAFEPAL_MNEMONIC`.
  - **Data Feeds**: RSS Sources for Economy, Crypto, Geopolitics, and AI integrated Jan 17, 2026.
  - **Advanced Capabilities (Voice, RAG, Geo)**:
    - **Status (Jan 18, 2026)**: Google Maps automated onboarding integrated via `scripts/setup_gcp_maps.ps1`.
    - **Keys**: `ELEVENLABS_API_KEY`, `VAPI_PUBLIC_KEY`, `PINECONE_API_KEY`, `GOOGLE_MAPS_API_KEY`, `BROWSERLESS_API_KEY`.
  - **Sovereign Swarm (`aig-ia-engine`)**: Python FASTAPI bridge on `IA_ENGINE_URL` (Default: `http://localhost:5000`). Required for `trigger_swarm` tool functionality.
  - **GitHub App (Manual Recovery Required)**: `GITHUB_APP_ID` and `GITHUB_WEBHOOK_SECRET`.

---

## 5. Diagnostics & Troubleshooting

Comprehensive registry for debugging common failures across the ecosystem.

### 5.1 Backend & AI Engine Failures

- **Express 4 Async Ghost**: Wrap async handlers in `catchAsync` to prevent 404 masking.
- **Engine Connectivity (Port 8000)**: Verify `aig-ia-engine` is running and `IA_ENGINE_URL` is correct. Check `/health`.
- **Python Module Resolution**: Ensure `PYTHONPATH` allows absolute imports or refactor to relative imports in `app/`.
- **Redis Sync**: Confirm consistency of `REDIS_URL` across Node.js and Python environments.

### 5.2 Frontend & Build Traps

- **`process is not defined`**: Use `import.meta.env.VITE_VAR` instead of `process.env` in client code.
- **Node Memory Limits**: Use `NODE_OPTIONS="--max-old-space-size=4096"` for heavy builds (`tsc`).

### 5.3 Infrastructure Forensics

- **Docker 500 Errors**: Restart Docker Desktop or WSL if `_ping` fails.
- **Git Index Locked**: Force-kill `git.exe` and delete `.git/index.lock`.
- **Secret Purging**: Use `git-filter-repo` to remove accidentally committed keys from history.
- **False Successful Builds**: `docker-compose up -d` may log "DONE" for certain layers but exit with `Exit code: 1` if the final image build fails. Always check the exit code of `docker-compose` commands.
- **Build Failures as "Not Running"**: If `docker-health-check.sh` reports services as "Not running", it often indicates an image build failure during the `up -d` phase rather than a runtime crash, especially if `docker logs [service]` shows no output. Verify logs via `docker-compose logs --no-color [service]` to capture interleaved build errors.
- **Health Check False Negatives (Naming Mismatches)**: `docker-health-check.sh` may report services as "Not running" if `COMPOSE_PROJECT_NAME` is set (e.g., to `aigestion`), causing containers to be named `aigestion-backend` instead of `backend`. If `docker-compose ps` shows services are "Up" but the script fails, verify that the script's grep patterns match the actual container names.
- **Proxy/Bridge Containers (socat)**: In some "God Mode" configurations, the `backend` service may use the `alpine/socat` image to bridge traffic between the Docker network and the host (e.g., `socat tcp-listen:5000...`). This is intentional for Sovereign Bridge architectures where local services (like specialized AI agents) need to interact with the Dockerized platform. **Diagnostic Note**: These containers will not show application logs (FastAPI/Node output) via `docker logs`; they typically show only the `socat` start banner or nothing if successful. Verify via `docker-compose ps` (Status: Up) and checking connectivity on the target port.
- **Missing Service Dockerfiles (Build Failure)**: If `docker-compose build` fails with obscure Go stack traces (e.g., `github.com/moby/buildkit...ReadEntrypoint`), it often indicates that a service defined in `docker-compose.yml` is missing its `Dockerfile` in the specified `build` context.
  - **Fix**: Verify each service's subdirectory has a valid `Dockerfile` (see `artifacts/infra/docker_standards.md`).
  - **Frontend Note**: The `frontend/` directory may require a `Dockerfile` even if it uses a monorepo structure (pnpm). Ensure the build context points to the correct root or application subdirectory.
- **BuildKit Solver/Bake Crashes (Exit Code 1)**: If the build fails with `Exit code: 1` and a stack trace referencing `moby/buildkit/solver`, but all Dockerfiles are present:
  - **Cause**: Often caused by oversized build contexts (missing `.dockerignore`), corrupted cache, or unhandled exceptions in `RUN` commands where BuildKit fails to stream the error before crashing.
  - **Fix**: Run `docker-compose build --no-cache` or check `.dockerignore` to ensure `node_modules`, `.git`, and large data assets are excluded.
- **Package Manager Drift (Frontend Failure)**: If the frontend build fails or the container crashes with "module not found" despite a successful build.
  - **Cause**: Using `npm ci` or `npm install` in a directory with a `pnpm-lock.yaml`. This is common when generic Dockerfiles are applied to the AIGestion pnpm monorepo.
  - **Fix**: Migrate the Dockerfile to use `pnpm` as per `artifacts/infra/docker_standards.md`.
- **Permission Denial in CLI Automation**: If `gcloud services enable` or IAM commands fail with "Not found or permission denied".
  - **Cause**: The active service account (e.g., `aigestion-automation@...`) often lacks the `Service Usage Admin` or `Project Owner/Editor` roles required to enable new APIs or modify IAM policies.
  - **Fix**: Run the script using a human account with Owner permissions (e.g., `gcloud auth login`) or grant the Service Usage Admin role to the automation service account.
- **Extreme ML Build Latency**: `pip install` for `ml-service` can take 25-50+ minutes.
  - **Diagnostic**: Look for `torch` (~900MB) and massive `nvidia-*` packages. Even on CPU-optimized paths, libraries like `chromadb` or `sentence-transformers` pull a massive suite: `nvidia-cublas-cu12` (~594MB), `nvidia-cudnn-cu12` (~707MB), `nvidia-nccl-cu12` (~322MB), `nvidia-cusparse-cu12` (~288MB), `nvidia-cusparselt-cu12` (~287MB), `nvidia-cusolver-cu12` (~267MB), `triton` (~170MB), `nvidia-cufft-cu12` (~193MB), `nvidia-nvshmem-cu12` (~125MB), `nvidia-curand-cu12` (~63MB), `nvidia-nvjitlink-cu12` (~39MB), `nvidia-cuda-nvrtc-cu12` (~88MB), and others, totaling **4.2GB+** of downloads.
  - **Fix**: Monitor network activity in Docker Desktop or via `docker-compose logs -f`. Ensure the `--index-url https://download.pytorch.org/whl/cpu` is present in `requirements.txt` to minimize the base `torch` footprint. Note that during these massive transfers, the build may become **unresponsive to termination signals** (SIGINT/SIGTERM); avoid force-killing the daemon and allow the layer to complete to prevent cache corruption.
- **Intermediate Image Visibility**: During a multi-gigabyte build, `docker images` will **not** show the new image ID or tag until the final `DONE` state is reached.
  - **Diagnostic**: If `docker-compose build` is running but `docker images` shows no update, the build is likely still committed to a large `pip install` or `RUN` layer that has not yet been snapshotted.
- **False-Positive Build Success (Log vs Exit Code)**: `docker-compose build` may output `Service Built` but terminate with **Exit Code: 1**.
  - **Diagnostic**: Check the very end of the build log. If you see `Built` followed immediately by a non-zero exit code, the image may be corrupted, untagged, or the build cache resolution failed.
  - **Verification**: Run `docker images` to see if the image was actually tagged correctly. If `docker-compose ps` does not list the service after a successful-looking build, it indicates the image was not registered in the project manifest.
  - **Fix**: Prune build cache (`docker builder prune`) and retry with `--no-cache`. Verify host disk space and memory, as large image exports (4.2GB+) frequently fail during the final compression stage if resources are constrained.
- **Absolute Import Shadowing & Redundant Nesting (ModuleNotFoundError)**: If a Python service fails with `ModuleNotFoundError: No module named 'app'` despite the file being present.
  - **Diagnostic**: Check the traceback. If it shows `/app/app/main.py` but you are running `python app/main.py`, the interpreter adds the inner `app` folder to `sys.path[0]`. This causes absolute imports starting with `app.` (e.g., `from app.rag import ...`) to fail because `app` is interpreted as the current module context, not a child package.
  - **Fix A (Package-Centric)**: Maintain the structure (`COPY app/ ./app`) and execute the entry point as a module from the parent directory: `CMD ["python", "-m", "app.main"]`. This correctly initializes the package hierarchy for absolute imports.
  - **Fix B (Workdir-Flat)**: Flatten the structure in Docker (`COPY app/ .`) and update the source code to use root-level imports (e.g., `from rag import ...` instead of `from app.rag ...`). Additionally, ensure string-based module references (e.g., `uvicorn.run("main:app", ...)`) are updated to remove the package prefix. Execute directly via `python main.py`. This is often necessary if the project was originally structured as a flat script rather than a formal package.
  - **Diagnostic (Process SpawnProcess-1)**: If the error `ModuleNotFoundError: No module named 'app'` appears specifically within a `SpawnProcess` stack trace while `reload=True` is active, it indicates that the master process successfully imported the module, but the child process (reloader) is using a different import path (likely the stale string-based reference in `uvicorn.run`).
  - **Diagnostic (Unreflected Changes)**: If the error persists after you've updated the code on the host, verify that the service in `docker-compose.yml` has a volume mapping for the source code. If no volume exists, the container is running a stale version of the code and MUST be rebuilt (`docker-compose build ml-service`) for changes to take effect. **Verification**: Run `docker exec <container_name> cat <path_to_file>` (e.g., `docker exec aigestion-ml-service-1 cat /app/main.py`) to confirm the code inside the container matches your host-side fix.
  - **Diagnostic (Service Port Mismatch)**: If a service appears to be running in logs (e.g., `Uvicorn running on http://0.0.0.0:8000`) but connections to `localhost:5000` fail.
    - **Cause**: The `docker-compose.yml` maps a different port (e.g., `5000:5000`) than the one the application is actually listening on internally (e.g., `8000`).
    - **Fix**: Align the `ports` section in `docker-compose.yml` (e.g., `- "5000:8000"`) or update the application entrypoint (e.g., `uvicorn.run(..., port=5000)`).
  - **Diagnostic (Startup Connection Refused / Empty Reply)**: If `curl` to the exposed port returns `Connection refused` or `Empty reply from server` immediately after a successful build/up.
    - **Cause**: The container is running, but the application is still initializing (e.g., loading `Torch` models or `SentenceTransformer` into memory). "Empty reply" specifically suggests the TCP connection was accepted but the application layer (Uvicorn/FastAPI) closed it because the event loop was busy or the startup sequence hadn't finished.
    - **Verification**: Run `docker logs -f <container_name>` and wait for the following markers:
      - **Log Marker**: `Initializing RAG Engine...` followed by `RAG Engine Initialized.` and `Application startup complete.`
      - **Health Response**: `{"status":"online","service":"AIGestion NeuroCore (RAG)"}`
    - **Timing**: This can take 30-90 seconds depending on CPU and IO throughput.
  - **Diagnostic (MQTT Config Failure)**: If the `mqtt` service is stuck in a restart loop or logs `Error: Unable to open config file /mosquitto/config/mosquitto.conf`.
    - **Cause**: The `mosquitto.conf` file is missing on the host or the volume mapping in `docker-compose.yml` is incorrect/broken.
    - **Fix**: Ensure the host file path (e.g., `./config/mosquitto.conf`) exists and is correctly mounted to `/mosquitto/config/mosquitto.conf` in the container.

### 5.5 Docker Environment Desync & Ghost Containers

- **The Desync Trap**: A state where the HOST file is correct, but the CONTAINER file remains stale despite a build command.
- **Cause**: This happens if `docker-compose up -d --build` fails silently or if multiple project environments (`COMPOSE_PROJECT_NAME`) are active, leading the developer to update one set of files while monitoring the logs of another.
- **Truth Test**: Always rely on `docker exec <container> cat <file>` as the definitive evidence of what the service is actually running.
- **Remediation**:
    1. Force a full reset: `docker-compose down`.
    2. Prune build cache: `docker builder prune -f`.
    3. Rebuild with no cache: `docker-compose build --no-cache <service>`.
    4. Verify volumes in `docker-compose.yml` match the `WORKDIR` defined in the `Dockerfile`.

- **Syntax Pitfall**: Do not use `--no-cache` with `docker-compose up -d --build`. This will fail with `unknown flag: --no-cache`. You must run `docker-compose build --no-cache <service>` separately before running `up`.

- **Diagnostic (Container Lifecycle Stasis)**: If a service was rebuilt (`docker-compose build`) but `docker ps` shows it has been "Up X hours" (stale) instead of "Up X seconds" (fresh).
  - **Cause**: `docker-compose up -d` might skip recreation if it detects no changes in the `docker-compose.yml` config for that service, even if the underlying image was rebuilt.
  - **Fix**: Use `docker-compose up -d --force-recreate <service>` to guarantee the old container is replaced by the new image.

- **Diagnostic (Orphan Containers Warning)**: If `docker-compose` warns about "Found orphan containers (...) for this project."
  - **Cause**: Containers exist in the project namespace that are no longer defined in the current `docker-compose.yml` (e.g., a service was renamed, removed, or commented out).
  - **Impact**: Orphan containers may still be running and consuming resources (ports, memory) even if they aren't part of the current active stack. This can lead to port conflicts (e.g., an orphan MQTT container holding port 1883).
  - **Fix**: Run `docker-compose up -d --remove-orphans` to purge them, or manually stop them via `docker stop <name>`.

### 5.6 Orphan Container Stasis & Restart Loops

A specific failure mode occurs when orphan containers (services removed from `docker-compose.yml`) are left running but depend on files/configs that no longer exist on the host.

- **Diagnostic**: `docker ps` shows containers with names like `aigestion-mqtt` or `aigestion-n8n-1` constantly restarting (Status: Restarting (1) X seconds ago).
- **Cause**: These orphans attempts to load a config (e.g., `/mosquitto/config/mosquitto.conf`) which is missing because the project structure changed or the volume mapping was removed.
- **Remediation**:
    1. Identify orphans: `docker compose ps --orphans`.
    2. Purge specifically: `docker rm -f <orphan_name>`.
    3. Global purge: `docker compose up -d --remove-orphans`.
- **Note**: Some orphans (like `homeassistant` or `cadvisor`) may be stable and should be left alone if they are part of a separate orchestration layer. Only purge those in restart loops or causing port conflicts.

### 5.4 Infrastructure Health Check Script

A specialized bash script exists to verify the health of all Docker services and their internal connectivity.

- **Location**: `scripts/docker-health-check.sh`
- **Usage**:

  ```bash
  # Check dev environment
  bash scripts/docker-health-check.sh dev

  # Check prod environment
  bash scripts/docker-health-check.sh prod
  ```

- **Tests**: Validates container status, MongoDB ping, RabbitMQ status, Redis ping, and App `/health` endpoint.

---

## 6. Deep Review & Readiness Checklist

Standard protocol for performing a deep review of the AIGestion ecosystem and ensuring continuity between development phases.

### 6.1 Readiness Checklist

- **God-Mode Validation**: Run `scripts/validate_env_godmode.js` to ensure all 20 blocks of `.env` are syntactically correct.
- **Secret Discovery**: Verify if any `your-` placeholders in Section 20 (Maps, Weather, Browserless) should be provisioned via `gcloud` or manual keys.
- **Sovereign Bridge**: Verify the Python Swarm Engine is responsive at `IA_ENGINE_URL` (Port 5000).
- **Redis Sync**: Check that both the Node.js backend and Python engine can reach the same Redis instance.
- **Pathing Resolution**: Verify absolute vs relative import patterns for the AI Engine to avoid `ModuleNotFoundError`.
- **Service Health**: Verify `/health` endpoints. Use `scripts/docker-health-check.sh [dev|prod]` for a full container audit.

### 6.2 Execution Workflow

1. **Sync**: Pull latest changes and force-sync with `origin/main`.
2. **Diagnose**: Run manual diagnostics from the Troubleshooting Guide.
3. **Document**: Record any drifts or regressions in an implementation plan before making changes.
4. **Verify**: Always include automated test results in the final status report.

---

*Last Updated: Jan 20, 2026 (Consolidated Deep Review Standard).*


## Build Recovery

# Frontend Build & Type Recovery Patterns (Jan 2026)

This document records recurring patterns for resolving build and type-checking failures in the AIGestion Nexus monorepo (pnpm).

## 1. Missing Module Declarations in Shared Packages

When adding new visual components to `frontend/shared` (e.g., using `lucide-react` or `recharts`), the modules must be explicitly installed in the `shared` package context, even if they exist in the `apps/dashboard` context.

**Symptom**:

```text
error TS2307: Cannot find module 'lucide-react' or its corresponding type declarations.
error TS2307: Cannot find module 'recharts' or its corresponding type declarations.
```

**Resolution**:

```bash
cd frontend/shared
pnpm install lucide-react recharts
```

## 2. Stub Type Definition Warnings & Conflicts

Pnpm often warns about "stub types" for packages that now provide their own definitions or require manual declarations in a monorepo setup.

### 2.1 The react-window / Virtualized List Crisis

`react-window` provides its own types but sometimes they are not correctly resolved by the TypeScript compiler in a pnpm monorepo environment, especially when used in a `shared` package.

**Symptom**:

```text
error TS7016: Could not find a declaration file for module 'react-window'.
error TS2688: Cannot find type definition file for 'react-window'.
```

**Resolution Protocol**:

1. **Uninstall Stub Types**: Remove `@types/react-window` if it exists as a stub.

   ```bash
   pnpm uninstall @types/react-window
   ```

2. **Local Declaration**: Create a `types.d.ts` in the root (or `src/`) of the affected package.

   ```typescript
   // frontend/shared/types.d.ts
   declare module 'react-window';
   ```

3. **TSConfig Adjustment**: Explicitly include the declaration file in the `include` array of the local `tsconfig.json`.

   ```json
   {
     "include": ["src", "types.d.ts"]
   }
   ```

### 2.2 Local Type Decoupling (The "Ultimate" Fix)

Sometimes `d.ts` declarations are ignored by the compiler if there are complex symbolic links or naming conflicts between stub types and actual package distributions.

**Symptom**: `error TS2709: Cannot use namespace '...' as a type` even after creating a `types.d.ts`.

**Resolution**: Define a minimal, local interface for the problematic types directly in the component file. This bypasses the need for global namespace resolution entirely.

**Example (VirtualList.tsx)**:

```typescript
// Instead of importing from 'react-window'
interface VirtualListRowProps {
  index: number;
  style: React.CSSProperties;
  data?: any;
  isScrolling?: boolean;
}

// Use local interface in component
const Row = ({ index, style }: VirtualListRowProps) => { ... }
```

## 3. Test Environment Type Errors (Jest/Vitest)

Missing globals like `expect`, `describe`, or `it` in component tests.

**Symptom**:

```text
error TS2304: Cannot find name 'expect'.
error TS2582: Cannot find name 'describe'.
```

**Resolution**:

1. **Install Types**: Ensure `@types/jest` is installed in the local package.

   ```bash
   cd frontend/apps/dashboard
   pnpm install -D @types/jest
   ```

2. **Compiler Options**: Add `"jest"` to the `types` array in `tsconfig.json`.

   ```json
   // tsconfig.json
   "compilerOptions": {
     "types": ["node", "jest"]
   }
   ```

## 4. Specialized Dashboards Build Failure (Feb 2026 Recovery)

In the `website-epic` application, specialized dashboards (Admin, Client, Demo) may fail to build if their configurations or entry points are lost or replaced by build artifacts.

**Symptom**: 
```text
error: config file vite.admin.config.ts not found
error: [vite:terser] `^_` is not a supported option
```

**Cause**: 
1. Missing `vite.admin.config.ts`, `vite.client.config.ts`, or `vite.demo.config.ts`.
2. `admin.html`, `client.html`, or `demo.html` replaced by hashed build artifacts.
3. Invalid `terserOptions` in the base Vite configuration (`properties: { '^_' : '' }`).

**Resolution Protocol**:

1. **Restore HTML Templates**: Recreate source HTML files based on `index.html`, ensuring they point to the correct TSX entry point (e.g., `/src/admin-dashboard.tsx`) and use the correct root ID (e.g., `id="admin-root"`).
2. **Configure Multi-Input Build**: Store dashboards in separate output directories to avoid overwriting the main application.
   ```typescript
   // vite.admin.config.ts example
   build: {
     outDir: 'dist/admin',
     rollupOptions: {
       input: { main: resolve(__dirname, 'admin.html') }
     }
   }
   ```
3. **Fix Terser Config**: Ensure `terserOptions.mangle.properties` does not use unsupported property-mangling keys. Use `regex: /^_/` if property mangling is required.

---

*Verified: Feb 2026 System Verification.*


