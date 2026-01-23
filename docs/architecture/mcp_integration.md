# MCP Server Configuration & Status

**Status Check Date**: 2026-01-20

## Active Servers

| Server Name           | Status                  | Details                                                                    | Must Check Method |
| :-------------------- | :---------------------- | :------------------------------------------------------------------------- | :---------------- |
| **notion-mcp-server** | 🟢 **Operational**       | Successfully retrieved connected users.                                    | `get_users`       |
| **cloudrun**          | 🟡 **Connected (Empty)** | Connected but listing no projects. Verify `gcloud` context or permissions. | `list_projects`   |
| **github-mcp-server** | 🟢 **Operational**       | Configured with User Provided Token. Verification pending restart.         | `get_me`          |
| **vercel**            | 🔵 **Added**             | Configured with token from `.env.local`.                                   | -                 |
| **aigestion-local**   | 🔵 **Added**             | Direct workspace integration enabled.                                      | -                 |
| **fetch**             | 🔵 **Added**             | Standard fetch capability added.                                           | -                 |
| **workflow**          | 🔵 **Added**             | Custom workflow automation enabled.                                        | -                 |
| **stripe**            | 🔵 **Added**             | Payment management integration (Test Mode).                                | -                 |
| **paypal**            | 🔵 **Added**             | Transaction management integration.                                        | -                 |
| **figma**             | 🔵 **Added**             | Design collaboration and asset access.                                     | -                 |
| **twilio**            | 🔵 **Added**             | SMS and Voice communication services.                                      | -                 |
| **huggingface**       | 🔵 **Added**             | Access to specialized AI models and datasets.                              | -                 |
| **tavily**            | 🔵 **Added**             | Real-time AI-optimized search.                                             | -                 |
| **aws**               | 🔵 **Added**             | Cloud resource management (EC2, S3, etc.).                                 | -                 |
| **railway**           | 🔵 **Added**             | Deployment platform management.                                            | -                 |
| **datadog**           | 🔵 **Added**             | Monitoring and observability services.                                     | -                 |


## Available Credentials & Recommendations

Based on the audit of the environment (`.env`, `.gemini`, `.windsurf`), the following additional servers can be configured:

### 1. Vercel

- **Credential Found**: `VERCEL_OIDC_TOKEN` in `.env.local`.
- **Recommendation**: Add `vercel-mcp-server` to the configuration using this token.

### 2. Google Cloud / Vertex AI

- **Credential Found**: OAuth Token in `C:\Users\Alejandro\.gemini\oauth_creds.json`.
- **Recommendation**: Ensure the active `cloudrun` server uses these credentials, or add a `google-cloud-mcp` server if available for broader GCP access.

### 3. AIGestion Integration (Local)

- **Source Found**: `.windsurf/aigestion-mcp-server.js`
- **Description**: Custom server wrapping the project's Backend API (MongoDB, Redis, AI).
- **Recommendation**: Enable this local server to give the AI direct access to the application database and logic.
- **Config**:

  ```json
  {
    "name": "aigestion-local",
    "command": "node",
    "args": ["C:\\Users\\Alejandro\\AIGestion\\.windsurf\\aigestion-mcp-server.js"],
    "env": {
      "MONGODB_URI": "${MONGODB_URI}",
      "REDIS_URL": "${REDIS_URL}"
    }
  }
  ```

### 4. Custom Workflow Managers

- **Found**: `.windsurf/workflow-server.js`, `.windsurf/custom-rules-server.js`.
- **Recommendation**: Evaluate for specific workflow automation needs.
