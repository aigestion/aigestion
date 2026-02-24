# Meta Platform — Setup Guide (God Mode)

> AIGestion Nexus • Graph API v21.0 • Facebook + Instagram + WhatsApp

---

## 1. Create Meta App

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps/)
2. Click **"Create App"** → Choose **"Business"** type
3. Fill in:
   - **App Name**: `AIGestion Nexus`
   - **App Contact Email**: your professional email
   - **Business Portfolio**: Select your professional business (NOT personal)
4. Copy **App ID** and **App Secret** from Settings > Basic

```env
META_APP_ID=<your-app-id>
META_APP_SECRET=<your-app-secret>
```

---

## 2. Add Products to App

In your Meta App Dashboard, add these products:

### Facebook Login
- Settings → Valid OAuth Redirect URIs: `https://aigestion.net/api/auth/facebook/callback`
- Permissions: `pages_manage_posts`, `pages_read_engagement`, `pages_read_user_content`

### Instagram Basic Display → Instagram Graph API
- Permissions: `instagram_basic`, `instagram_content_publish`, `instagram_manage_comments`

### WhatsApp Business
- Getting Started → note your **Phone Number ID** and **Permanent Token**

---

## 3. Facebook Page Setup

1. You need a **Facebook Page** (create one if you don't have it for the business)
2. In your Meta App → Facebook Login, generate a **Page Access Token**:
   - Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   - Select your App
   - Select your Page
   - Add permissions: `pages_manage_posts`, `pages_read_engagement`
   - Click **"Generate Access Token"**
3. **Exchange for Long-Lived Token** (60 days):
   ```
   GET https://graph.facebook.com/v21.0/oauth/access_token
     ?grant_type=fb_exchange_token
     &client_id={META_APP_ID}
     &client_secret={META_APP_SECRET}
     &fb_exchange_token={SHORT_LIVED_TOKEN}
   ```
4. Get your Page ID from the Page's "About" section or via API

```env
FACEBOOK_PAGE_ID=<your-page-id>
FACEBOOK_PAGE_ACCESS_TOKEN=<long-lived-page-token>
```

---

## 4. Instagram Business Setup

1. Your Instagram account must be a **Business** or **Creator** account
2. It must be **connected to your Facebook Page**:
   - Instagram → Settings → Account → Switch to Professional
   - Facebook Page → Settings → Instagram → Connect Account
3. Get your Instagram Business Account ID:
   ```
   GET https://graph.facebook.com/v21.0/{FACEBOOK_PAGE_ID}
     ?fields=instagram_business_account
     &access_token={FACEBOOK_PAGE_ACCESS_TOKEN}
   ```
4. The response contains `instagram_business_account.id` — that's your Account ID

```env
INSTAGRAM_ACCESS_TOKEN=<same-as-page-token-or-user-token>
INSTAGRAM_BUSINESS_ID=<from-page-settings>
INSTAGRAM_BUSINESS_ACCOUNT_ID=<from-api-response>
```

---

## 5. WhatsApp Business Setup

1. In your Meta App → WhatsApp → Getting Started
2. Add your phone number or use the test number
3. Copy the **Permanent Token** and **Phone Number ID**
4. Set up webhook (optional for receiving messages):
   - Webhook URL: `https://aigestion.net/api/webhooks/whatsapp`
   - Verify Token: `aigestion_whatsapp_verify_2026`

```env
WHATSAPP_TOKEN=<permanent-token>
WHATSAPP_BUSINESS_PHONE_ID=<phone-number-id>
WHATSAPP_VERIFY_TOKEN=aigestion_whatsapp_verify_2026
```

---

## 6. API Endpoints

Once configured, these endpoints are available at `/api/v1/social/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/facebook/publish` | Post to Facebook Page |
| GET | `/facebook/stats` | Page insights |
| POST | `/instagram/publish` | Publish photo to Instagram |
| POST | `/instagram/dm` | Send Instagram DM |
| POST | `/whatsapp/send` | Send WhatsApp message |
| POST | `/whatsapp/template` | Send template message |
| GET | `/meta/status` | Check all Meta connections |
| GET | `/meta/verify` | Verify API connectivity |

---

## 7. Verify Setup

```bash
# Check configuration status
curl http://localhost:4000/api/v1/social/meta/status

# Verify live connections
curl http://localhost:4000/api/v1/social/meta/verify
```

---

## Required Permissions Summary

| Platform | Permissions |
|----------|------------|
| Facebook | `pages_manage_posts`, `pages_read_engagement`, `pages_read_user_content` |
| Instagram | `instagram_basic`, `instagram_content_publish`, `instagram_manage_comments` |
| WhatsApp | `whatsapp_business_messaging`, `whatsapp_business_management` |
