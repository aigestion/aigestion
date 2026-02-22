# 🔄 N8N Workflow Templates for Pixel Sensor Integration

> **Location:** Import these into N8N at `http://localhost:5678`
> **Webhook Base URL:** `http://n8n:5678/webhook/`

---

## 1. 🌅 Morning Briefing (`/webhook/morning-briefing`)

**Trigger:** HA automation detects wake-up (`pixel_wake_up`)

**Flow:**
```
Webhook → Get Sensor Snapshot → AI Summary → Push Notification
```

**Steps:**
1. **Webhook Node** — Receives `{ trigger: "morning_briefing", timestamp }`
2. **HTTP Request** — `GET http://aigestion-backend:5000/api/v1/iot/pixel-sensors/daily-stats`
3. **HTTP Request** — Fetch calendar events (Google Calendar API)
4. **Code Node** — Compose briefing message
5. **HTTP Request** — `POST http://aigestion-backend:5000/api/v1/ai/generate` with prompt
6. **Notification** — Push to Pixel via HA notify service

---

## 2. 🏃 Fitness Summary (`/webhook/fitness-summary`)

**Trigger:** Nightly at 21:00 or manual

**Flow:**
```
Cron/Webhook → Get History → Calculate Stats → Log → Notify
```

**Steps:**
1. **Cron/Webhook Node** — Triggers at 21:00 daily
2. **HTTP Request** — `GET http://aigestion-backend:5000/api/v1/iot/pixel-sensors/history?minutes=1440`
3. **Code Node** — Calculate: total steps, active time, distance estimate
4. **HTTP Request** — Log to MongoDB via Nexus API
5. **Notification** — Summary push to Pixel

---

## 3. 📍 Location Intelligence (`/webhook/zone-transition`)

**Trigger:** HA zone enter/leave events

**Flow:**
```
Webhook → Classify Zone → Update Context → Trigger Actions
```

**Steps:**
1. **Webhook Node** — Receives `{ zone, direction, previous, timestamp }`
2. **Switch Node** — Route by zone type (home/office/custom)
3. **Code Node** — Calculate time-in-zone, commute duration
4. **HTTP Request** — Update Nexus context
5. **IF Node** — Check patterns (late arrival, unusually long commute)
6. **Notification** — Alert if anomalies detected

---

## 4. 🔋 Battery Intelligence (`/webhook/battery-alert`)

**Trigger:** Battery drops below threshold

**Flow:**
```
Webhook → Analyze Pattern → Predict → Alert
```

**Steps:**
1. **Webhook Node** — Receives `{ level, state, temperature }`
2. **HTTP Request** — Get battery history from Nexus
3. **Code Node** — Predict time-to-empty based on history trend
4. **Switch Node** — Severity routing (warning < 20%, critical < 10%)
5. **Notification** — Context-aware alert with tips

---

## 5. 📞 Call Context (`/webhook/incoming-call`)

**Trigger:** Pixel detects incoming call

**Flow:**
```
Webhook → Lookup Contact → Get Context → Prepare Brief
```

**Steps:**
1. **Webhook Node** — Receives `{ phoneState, context }`
2. **HTTP Request** — Search contact in Nexus CRM
3. **Code Node** — Compile recent interactions, notes
4. **Notification** — Silent card with caller context

---

## 6. 🔄 Sensor Event Router (`/webhook/sensor-event`)

**Trigger:** Any sensor change from HA

**Flow:**
```
Webhook → Classify → Route → Process
```

**Steps:**
1. **Webhook Node** — Receives `{ event_type, entity_id, new_state, old_state }`
2. **Switch Node** — Route by event_type
3. **Code Node** — Significance scoring
4. **IF Node** — Only process high-significance events
5. **HTTP Request** — Forward to relevant Nexus service

---

## Environment Variables

Add to N8N container in `docker-compose.yml`:

```yaml
environment:
  - NEXUS_API_URL=http://aigestion-backend:5000/api/v1
  - HA_URL=http://homeassistant:8123
  - HA_TOKEN=${HA_TOKEN}
```
