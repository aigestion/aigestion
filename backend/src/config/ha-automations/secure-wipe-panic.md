# 🆘 Secure Wipe Panic Button — Tasker Widget

> 1-tap emergency wipe of sensitive app data + cache on your Pixel 8.
> Optional n8n notification after wipe completes.

---

## What Gets Wiped

| Category | Targets | Method |
| Category | Targets | Method |
| 🔒 Auth Tokens | Browser cookies, app sessions | Clear app data |
| 💬 Chat History | Telegram, WhatsApp local DB | Clear app cache + data |
| 📁 Downloads | Recent sensitive downloads | Delete files |
| 🗂️ Clipboard | Clipboard history | Clear clipboard manager |
| 📸 Recent Photos | Last 24h camera photos | Move to `.trash` |
| 🌐 Browser | Chrome history, tabs, cookies | Clear app data |

---

## Tasker Task: Secure Wipe Panic

```text
Task: Secure Wipe Panic
  
  # ── Step 1: Confirmation ────────────────────────
  A1: Variable Query [
    Title: 🆘 NEXUS Secure Wipe
    Text: Escribe "WIPE" para confirmar
    Variable: %confirm
  ]
  
  A2: Stop [ If %confirm != WIPE ]
  
  # ── Step 2: Vibrate Warning ─────────────────────
  A3: Vibrate Pattern [ Pattern: 0,200,100,200,100,500 ]
  
  # ── Step 3: Clear App Data ──────────────────────
  A4: Shell [
    Command: pm clear com.android.chrome
    Use Root: Off
    Timeout: 5
  ]
  
  A5: Shell [
    Command: pm clear org.telegram.messenger
    Use Root: Off
    Timeout: 5
  ]
  
  # Note: WhatsApp can't be cleared without root without breaking it.
  # Instead, clear only the cache:
  A6: Shell [
    Command: pm clear --cache-only com.whatsapp
    Use Root: Off
    Timeout: 5
  ]
  
  # ── Step 4: Delete Sensitive Files ──────────────
  A7: Shell [
    Command: rm -rf /sdcard/Download/*.pdf /sdcard/Download/*.doc* /sdcard/Download/*.xls*
    Use Root: Off
    Timeout: 10
  ]
  
  A8: Shell [
    Command: rm -rf /sdcard/Download/*.key /sdcard/Download/*.pem /sdcard/Download/*.env
    Use Root: Off
    Timeout: 5
  ]
  
  # ── Step 5: Clear Clipboard ─────────────────────
  A9: Set Clipboard [ Text: ]
  
  # ── Step 6: Move Recent Photos (last 24h) ──────
  A10: Shell [
    Command: |
      mkdir -p /sdcard/.trash
      find /sdcard/DCIM/Camera -maxdepth 1 -mtime -1 -name "*.jpg" -o -name "*.png" | while read f; do mv "$f" /sdcard/.trash/; done
    Use Root: Off
    Timeout: 15
  ]
  
  # ── Step 7: Notify n8n ──────────────────────────
  A11: HTTP Request [
    Method: POST
    URL: http://n8n.local:5678/webhook/nexus-emergency
    Headers: Content-Type:application/json
    Body: {
      "event": "secure_wipe_executed",
      "device": "pixel_8",
      "timestamp": "%TIMES",
      "items_wiped": ["chrome", "telegram_cache", "whatsapp_cache", "downloads", "clipboard", "recent_photos"]
    }
    Timeout: 5
  ]
  
  # ── Step 8: Confirmation ────────────────────────
  A12: Flash [
    Text: 🆘 Wipe completado. Datos sensibles eliminados.
    Long: true
  ]
  
  A13: Vibrate Pattern [ Pattern: 0,100,50,100 ]
```

---

## Tasker Widget Setup

1. **Long-press** home screen → Widgets → Tasker → Task Shortcut
2. Select task: **Secure Wipe Panic**
3. Set icon: 🆘 (or custom red skull icon)
4. Place in a hidden folder or secure page

---

## NFC Integration

This task is also triggered by the **Emergency NFC tag** (see `nfc-god-tags.md`).

---

## Customization

### Add/Remove Apps from Wipe List

Edit steps A4-A6 to add more apps:

```text
# Signal
pm clear org.thoughtcrime.securesms

# Firefox
pm clear org.mozilla.firefox

# ProtonMail
pm clear --cache-only ch.protonmail.android
```

### Keep Photos but Clear EXIF

Instead of moving photos, strip metadata:

```bash
# Requires exiftool (via Termux)
exiftool -all= /sdcard/DCIM/Camera/*.jpg
```

---

## Security Notes

> [!CAUTION]
> This task runs **without root**. Some apps (WhatsApp, banking apps)
> cannot have their data fully cleared without root access.
> For those, only cache is cleared.
>
> [!WARNING]
> The confirmation dialog (`Variable Query`) is critical.
> Without it, an accidental NFC tap could wipe your data.
>
> [!TIP]
> For maximum security, add a secondary PIN check:
> ```text
> A1b: Input Dialog [ Title:PIN | Text:Enter 4-digit PIN ]
> A1c: Stop [ If %input != 1234 ]
> ```
