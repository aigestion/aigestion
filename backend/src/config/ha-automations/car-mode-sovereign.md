# 🚗 Car Mode Sovereign — Tasker + HA Setup

## Overview
When Pixel 8 connects to car Bluetooth, automatically:
1. Enable DND (Priority Only)
2. Start Daniela voice session (Vapi)
3. Notify Nexus of car mode activation
4. Switch Daniela to ultra-concise mode

## 1. Tasker Profile: Bluetooth Car Trigger

```
Profile: Car Mode Sovereign
  State: BT Connected
    Name: YOUR_CAR_BT_NAME   # e.g., "Renault R-Link", "BMW iDrive"
    Address: AA:BB:CC:DD:EE:FF  # Optional: specific MAC address

Enter Task: Activate God Car Mode
  A1. Do Not Disturb
      Mode: Priority Only
  A2. HTTP Request
      Method: POST
      URL: https://YOUR_N8N_URL/webhook/car-mode
      Headers: Content-Type: application/json
      Body: {
        "event": "car_mode_on",
        "device": "pixel_8",
        "bluetooth": "%BTDEV",
        "timestamp": "%TIMES"
      }
  A3. Wait: 3 seconds
  A4. Open URL: nexus://daniela/voice  # Deep link to Daniela voice mode
  A5. Flash: "🚗 Car Mode Sovereign ACTIVADO"
  A6. Say: "Daniela lista en modo coche"

Exit Task: Deactivate Car Mode
  A1. Do Not Disturb
      Mode: All
  A2. HTTP Request
      Method: POST
      URL: https://YOUR_N8N_URL/webhook/car-mode
      Body: { "event": "car_mode_off", "device": "pixel_8" }
  A3. Flash: "🚗 Car Mode desactivado"
```

## 2. n8n Webhook → Nexus Telemetry

```yaml
Webhook Node:
  Path: /car-mode

HTTP Request Node:
  URL: https://YOUR_NEXUS_API/api/v1/system/device-telemetry
  Method: POST
  Body:
    device: "pixel_8"
    car_mode: "={{$json.event === 'car_mode_on'}}"
    bluetooth_connected: ["={{$json.bluetooth}}"]
    location: "En coche"
    timestamp: "={{$json.timestamp}}"
```

## 3. HA Automation (optional car-linked scenes)

```yaml
automation:
  - alias: "Sovereign Car Mode Scene"
    trigger:
      - platform: webhook
        webhook_id: car_mode_sovereign
    action:
      - choose:
          - conditions:
              - condition: template
                value_template: "{{ trigger.json.event == 'car_mode_on' }}"
            sequence:
              - service: light.turn_off
                target:
                  entity_id: light.office_lights
              - service: climate.set_temperature
                data:
                  entity_id: climate.home
                  temperature: 19
```

## Daniela Behavior in Car Mode
When `car_mode: true` in DeviceStateStore:
- System prompt directive #9 activates: "sé extremadamente concisa"
- Responses shortened to 1-2 sentences
- Voice-first interaction prioritized
