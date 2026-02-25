# n8n Required Credentials & Environment Variables

This list covers all credentials required to run the automated workflows generated so far (01-45).
Configure these in your n8n **Credentials** section or as **Environment Variables** (where `{{$env["VAR"]}}` is used).

## 🔑 Core Integrations

| Service        | Environment Variable                                      | Usage                                                          |
| -------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| **OpenAI**     | `OPENAI_API_KEY`                                          | Generators, Analyzers (Workflows 15, 21, 23, 24, 26, 27, 30)   |
| **Slack**      | `SLACK_BOT_TOKEN`                                         | Notifications (Almost all workflows)                           |
| **Discord**    | `DISCORD_WEBHOOK_URL`                                     | Deploy Notifications (Workflow 04)                             |
| **AWS S3**     | `AWS_ACCESS_KEY_ID`<br>`AWS_SECRET_ACCESS_KEY`            | Archives, Backups, Assets (Workflows 21, 22, 32, 40)           |
| **PostgreSQL** | `DB_CONNECTION_STRING`<br>`DB_HOST`, `DB_USER`, `DB_PASS` | Analytics, Database Ops (Workflows 14, 16, 32, 35, 36, 37, 43) |

## 🛠️ SaaS Integrations

| Service        | Environment Variable                     | Usage                                        |
| :------------- | :--------------------------------------- | :------------------------------------------- |
| **Linear**     | `LINEAR_API_KEY`<br>`LINEAR_TEAM_ID`     | Issue Tracking (Workflow 05)                 |
| **HubSpot**    | `HUBSPOT_API_KEY`                        | CRM Updates (Workflows 13, 20, 23)           |
| **Salesforce** | `SALESFORCE_CONSUMER_KEY`                | Sales Sync (Workflow 11)                     |
| **Notion**     | `NOTION_API_KEY`<br>`NOTION_DB_ID`       | Notes, Knowledge Base (Workflows 17, 28, 42) |
| **Airtable**   | `AIRTABLE_API_KEY`<br>`AIRTABLE_BASE_ID` | Bug Tracking (Workflow 45)                   |
| **Jira**       | `JIRA_API_TOKEN`<br>`JIRA_EMAIL`         | Issue Creation (Workflow 12, 45)             |
| **Google**     | `GOOGLE_SHEETS_ID`                       | Data Sync (Workflows 11, 18, 19, 27, 35)     |

## n8n & System Credentials Checklist

This document tracks all credentials required for the Antigravity workflows.
**Status:** Validated against root `.env`.

| Service           | Variable / Credential Name | Status                 | Location / Notes                                                                          |
| :---------------- | :------------------------- | :--------------------- | :---------------------------------------------------------------------------------------- |
| **OpenAI**        | `OPENAI_API_KEY`           | ✅ **Secured**         | Root `.env`. Used via n8n Credential `openAiApi`.                                       |
| **Stripe**        | `STRIPE_SECRET_KEY`        | ✅ **Secured**         | Root `.env`. Workflow uses placeholder `STRIPE_KEY` - needs alias.                      |
| **Stripe**        | `STRIPE_PUBLISHABLE_KEY`   | ✅ **Secured**         | Root `.env`.                                                                            |
| **Slack**         | `SLACK_BOT_TOKEN`          | ⚠️ **Partial**         | `SLACK_WEBHOOK_URL` is in root `.env`, but Bot Token is needed.                                |
| **NewsAPI**       | `NEWS_API_KEY`             | ❌ **Missing**         | Required for Workflow 30 (News Aggregator).                                               |
| **Twitter**       | `TWITTER_BEARER_TOKEN`     | ❌ **Missing**         | Required for Workflow 19 & 78.                                                            |
| **Intercom**      | `INTERCOM_API_KEY`         | ❌ **Missing**         | Required for Workflow 73. Placeholder `INTERCOM_KEY` used.                                |
| **Notion**        | `NOTION_API_KEY`           | ✅ **Secured**         | Root `.env`.                                                                            |
| **Notion**        | `NOTION_DATABASE_ID`       | ❌ **Missing**         | Required for syncing (Workflow 85).                                                       |
| **Google Sheets** | `GOOGLE_SHEETS_ID`         | ❌ **Missing**         | Multiple workflows use `INFLUENCER_SHEET_ID` etc. placeholders.                           |
| **Twilio**        | `TWILIO_AUTH_TOKEN`        | ✅ **Secured**         | Root `.env`.                                                                            |
| **HubSpot**       | `HUBSPOT_API_KEY`          | ❌ **Missing**         | Required for CRM workflows.                                                               |
| **Linear**        | `LINEAR_API_KEY`           | ❌ **Missing**         | Required for Issue Sync (Workflow 05).                                                    |
| **Pinecone**      | `PINECONE_API_KEY`         | ⚠️ **Action Required** | Added to .env (value empty). User confirmed existence (GCoud?). Required for Workflow 28. |

## 🛠 Action Required

The following specific keys need to be added to your `.env` or n8n Credentials:

- `NEWS_API_KEY`
- `LINEAR_API_KEY` (for Linear Sync)
- `PINECONE_API_KEY` (for Vector DB)
- Specific IDs: `NOTION_DATABASE_ID`, `INFLUENCER_SHEET_ID`, `VIDEO_SCRIPTS_DOC_ID`

## 🔐 Security Note

All "Secured" keys are currently loaded from the root `.env` file. Ensure this file is never committed to git.
For Production, we recommend moving these to Google Secret Manager. 3. For OAuth services (Google Sheets, Slack, Hubspot), authenticate directly in the n8n UI under **Credentials**.
