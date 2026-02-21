# 🌌 God Mode Voice Widget — Tasker Setup Guide
# Feature 2: Floating Daniela overlay on Pixel 8

## Overview

A persistent floating button on your Pixel 8 that activates Daniela voice
anywhere — home screen, apps, lock screen. Tap → speak → Daniela responds.

---

## Prerequisites

- **Tasker** (Play Store, ~$3.49)
- **Floating Apps Free** or **Overlays** (for the floating button scene)
- Backend URL accessible (e.g. `https://aigestion.net`)
- Your JWT token from the AIGestion login

---

## Step 1: Create the Tasker Scene (Floating Button)

1. Open Tasker → **Scenes** tab → ➕ Add Scene
2. Name it: `Daniela Voice Widget`
3. Add element: **Button**
   - Position: Bottom-right (x=85%, y=70%)
   - Size: 60dp × 60dp
   - Background color: `#9333EA` (purple)
   - Icon: Microphone (Unicode: 🎙️)
   - Tap action: `Perform Task` → `Daniela Voice Send`

---

## Step 2: Create Task — "Daniela Voice Send"

```
Task: Daniela Voice Send
───────────────────────
1. Get Voice           (recognize speech, store in %daniela_input)
   Language: es-ES
   Timeout: 10s

2. HTTP Request
   Method: POST
   URL: https://aigestion.net/api/v1/daniela/message
   Headers: Authorization: Bearer %your_jwt_token
            Content-Type: application/json
   Body: {"message": "%daniela_input"}
   Output Variable: %daniela_response_raw

3. JSON Extract
   Source Variable: %daniela_response_raw
   Target Variable: %daniela_reply
   Path: $.data.response

4. Say (Text to Speech)
   Text: %daniela_reply
   Engine: Google TTS
   Language: es-ES
   Speed: 1.0

5. Flash (optional toast)
   Text: 💜 %daniela_reply (first 80 chars)
```

---

## Step 3: Create Profile — Show Scene Always

```
Profile: Daniela Overlay
────────────────────────
Trigger: State → Display → Display On (to show when screen is on)
Task Enter: Show Scene "Daniela Voice Widget"
  Display As: Overlay (Above everything)
  Position: Bottom-right
Task Exit: Hide Scene "Daniela Voice Widget"
```

---

## Step 4: Call Shortcut (Voice Call via Daniela)

For quick calls: long-press the widget → extended menu

```
Task: Daniela Quick Call
────────────────────────
1. Get Voice           (e.g. "llama a papá y dile que estoy ocupado")
   Store in %daniela_call_cmd

2. HTTP Request POST
   URL: https://aigestion.net/api/v1/daniela/message
   Body: {"message": "%daniela_call_cmd"}
   (Daniela will detect 'call' intent automatically)
```

---

## Step 5: Push Notification Deeplink

When HA sends a voice_call push, Tasker intercepts via intent:

```
Profile: NEXUS Voice Call Handler
───────────────────────────────────
Trigger: Event → Intent Received
   Action: com.google.android.c2dm.intent.RECEIVE
   Extra: daniela_audio_url ~ .*

Task:
1. Variable Set %audio_url = %daniela_audio_url (from intent extra)
2. HTTP Get %audio_url → save to /sdcard/Tasker/daniela_call.mp3
3. Wait 2s (let call connect)
4. Media Play /sdcard/Tasker/daniela_call.mp3
   Stream: Voice Call (stream 0)
```

---

## Environment Variables to Update in Tasker

| Variable | Value |
|----------|-------|
| `%your_jwt_token` | Your AIGestion bearer token (from localStorage in browser) |
| `%nexus_url` | `https://aigestion.net` |

> **Tip:** Store sensitive vars in Tasker's **Preferences → Variables** with encryption enabled.
