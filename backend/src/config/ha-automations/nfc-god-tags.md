# 🏷️ NFC God Tags — Tasker + n8n Setup Guide

> Tap an NFC tag → your Pixel 8 executes a NEXUS workflow instantly.

---

## Prerequisites

- **Tasker** (Play Store) with AutoNFC or built-in NFC support
- **n8n** running with webhook nodes
- NFC tags (NTAG215 or similar, writable)

---

## Step 1: Write Tag IDs

Use **NFC Tools** app to write a unique URL to each tag:

| Tag Location | URL Written | Purpose |
| Tag Location | URL Written | Purpose |
| 🖥️ Desk | `https://aigestion.net/nfc/dashboard` | Open God Mode Dashboard |
| 🎙️ Bedside | `https://aigestion.net/nfc/daniela` | Start Daniela conversation |
| 📈 Wallet | `https://aigestion.net/nfc/economy` | Economy daily report |
| 🆘 Hidden | `https://aigestion.net/nfc/emergency` | Emergency secure wipe |

---

## Step 2: Tasker Profile (per tag)

### Profile: NFC Tag Event

```text
Profile: NFC God Tag
  Event: NFC Tag
  Variable: %nfc_url matches https://aigestion.net/nfc/*
  
Task: NEXUS NFC Action
  A1: Variable Split [ %nfc_url Splitter:/ ]
  A2: Variable Set [ %action To:%nfc_url5 ]
  
  A3: HTTP Request [
    Method: POST
    URL: http://n8n.local:5678/webhook/nexus-nfc
    Headers: Content-Type:application/json
    Body: {"action": "%action", "timestamp": "%TIMES", "device": "pixel8"}
  ]
  
  A4: If [ %action ~ dashboard ]
    A5: Browse URL [ URL:nexus://dashboard ]
  A4: Else If [ %action ~ daniela ]
    A5: Browse URL [ URL:nexus://daniela ]
  A4: Else If [ %action ~ economy ]
    A5: Browse URL [ URL:nexus://economy ]
  A4: Else If [ %action ~ emergency ]
    A5: Perform Task [ Name:Secure Wipe Panic ]
  A4: End If
  
  A6: Flash [ Text:🌌 NEXUS: %action activated ]
```

---

## Step 3: n8n Webhook Node

Create a webhook at `nexus-nfc` that routes by `action`:

```json
{
  "nodes": [
    {
      "name": "NFC Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "nexus-nfc"
      }
    },
    {
      "name": "Route by Action",
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "dataPropertyName": "action",
        "rules": [
          { "value": "dashboard", "output": 0 },
          { "value": "daniela", "output": 1 },
          { "value": "economy", "output": 2 },
          { "value": "emergency", "output": 3 }
        ]
      }
    }
  ]
}
```

---

## Step 4: Physical Placement

| Tag | Where to Stick It | Why |
| Tag | Where to Stick It | Why |
| Dashboard | Under desk / monitor stand | Morning check-in ritual |
| Daniela | Bedside table | Quick voice session before sleep |
| Economy | Inside wallet / card holder | Market check on the go |
| Emergency | Hidden drawer / safe | Panic button if device is compromised |

---

## Security Notes

> [!WARNING]
> The **Emergency** tag should trigger a confirmation dialog in Tasker before executing wipe.
> Add a `Variable Query` step asking for PIN/confirmation.
>
> [!TIP]
> Use `NFC Tools` to set tags as **read-only** after writing to prevent tampering.
