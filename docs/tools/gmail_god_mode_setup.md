# 🌌 Gmail God Mode: Setup Guide

**Status**: `READY`
**Est. Time**: 5 Minutes

This guide configures your Gmail to separate **Personal**, **Professional**, and **System** streams using "Multiple Inboxes" and a background automation script.

---

## 🏗️ Phase 1: The Automation Engine (Google Apps Script)

This script acts as the backend logic, analyzing emails 24/7 to tag them correctly.

1.  Open **[script.google.com](https://script.google.com/)**.
2.  Click **"+ New Project"**.
3.  Name it: `Gmail God Mode`.
4.  **Delete** any code in the `Code.gs` file.
5.  **Copy & Paste** the entire content of [`gmail_god_mode_script.js`](./gmail_god_mode_script.js) into the editor.
6.  Click the 💾 **Save** icon.
7.  **Run the Initial Test**:
    - Select `godModeRun` from the dropdown menu (top bar).
    - Click **Run**.
    - **Grant Permissions**: It will ask for permission to access your Gmail. Allow it (it's your own script).
8.  **Set up Automation (Triggers)**:
    - Click the ⏰ **Triggers** icon (clock on the left sidebar).
    - Click **+ Add Trigger** (bottom right).
    - **Function**: `godModeRun`
    - **Event Source**: `Time-driven`
    - **Type**: `Minutes timer` -> `Every 10 minutes` (or `Every hour` if you prefer).
    - Click **Save**.

> ✅ **Result**: Your emails will now be automatically tagged as `🔧 TRABAJO`, `📱 PERSONAL`, or `🔐 SEGURIDAD` shortly after arrival.

---

## 🎨 Phase 2: The Visual Layout (Multiple Inboxes)

Stop using Tabs (Social, Promo). Switch to a dashboard view.

1.  Go to **Gmail Settings** (⚙️) -> **See all settings**.
2.  Go to the **Inbox** tab.
3.  **Inbox type**: Select `Multiple Inboxes`.
4.  **Inbox Sections Config**:

| Section       | Search Query                 | Section Name (Optional)  |
| :------------ | :--------------------------- | :----------------------- |
| **Section 1** | `is:starred`                 | ⭐ Focus / Todo          |
| **Section 2** | `label:🔧-trabajo -is:read`  | 🚀 Professional (Unread) |
| **Section 3** | `label:📱-personal -is:read` | 🏠 Personal (Unread)     |
| **Section 4** | `label:🔐-seguridad`         | 🛡️ Security / Alerts     |

5.  **Maximum page size**: `9` (keeps it compact).
6.  **Multiple Inbox position**: `Right of the inbox` (Recommended for widescreens) or `Above the inbox`.
7.  Click **Save Changes** at the bottom.

---

## 🧹 Phase 3: Zero Inbox Maintenance

The script functions include an `inboxZeroEnforcer` logic (currently inside `cleanupOldNotifications`):

- **7-Day Rule**: If an email is in the Inbox, is **Read**, is NOT **Starred**, and is older than 7 days -> It gets **Archived** automatically.
- **Goal**: Your Main Inbox should only contain _New_ or _Unprocessed_ items. Once you read it, if you don't star it or reply, it disappears after a week.

---

### Troubleshooting

- **Script Error?** Check the Executions tab in Apps Script for logs.
- **Not Labeling?** The regex keywords in `CONFIG` at the top of the script might need your specific terms. Add client names or specific subjects there.
