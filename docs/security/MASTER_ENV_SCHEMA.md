# 🌌 Master Environment Schema Registry (AIGestion)

This document is the **Sovereign Source of Truth** for all environmental variables in the monorepo.

## 🏛️ Standard Blocks

### Block 1: Server & Core
| Variable       | Default               | Description                         |
| -------------- | --------------------- | ----------------------------------- |
| `PORT`         | 5000                  | Backend API Port                    |
| `NODE_ENV`     | development           | `development`, `production`, `test` |
| `FRONTEND_URL` | http://localhost:3000 | URL of the React ecosystem          |

### Block 2: Security & Auth
| Variable             | Required | Description                            |
| -------------------- | -------- | -------------------------------------- |
| `JWT_SECRET`         | 🔒 Yes    | Secret for token signing               |
| `ML_SERVICE_API_KEY` | 🔒 Yes    | Shared secret for NeuroCore auth       |
| `IA_ENGINE_API_KEY`  | 🔒 Yes    | Shared secret for Swarm IA Engine auth |

### Block 3: AI Services (The Standardization)
| Variable         | Replaces               | Description                           |
| ---------------- | ---------------------- | ------------------------------------- |
| `GEMINI_API_KEY` | `GOOGLE_GENAI_API_KEY` | Master Key for Gemini Pro / Vertex AI |

### Block 4: Databases
| Variable       | Standard            |
| -------------- | ------------------- |
| `MONGODB_URI`  | `mongodb+srv://...` |
| `SUPABASE_URL` | `https://...`       |
| `SUPABASE_KEY` | `🔒 Secret`          |

## 🛠️ Maintenance Script
Use `./scripts/sync-env-consistency.ps1` to verify if your local `.env` complies with this schema.
