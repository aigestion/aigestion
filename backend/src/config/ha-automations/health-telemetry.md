# 🏥 Health Sensor Feed — Google Health Connect + n8n

## Overview
Daily health data from Google Health Connect → n8n → Nexus device-telemetry endpoint.
Daniela uses this data to personalize her responses (e.g., "Llevas 3000 pasos, ¡sal a caminar!").

## 1. Tasker Profile: Daily Health Sync

```
Profile: Health Telemetry Sync
  Time: Every day at 21:00

Enter Task: Send Health Data
  A1. Java Function
      # Read Google Health Connect data via Tasker plugin
      # Requires Health Connect permissions
  A2. HTTP Request
      Method: POST
      URL: https://YOUR_N8N_URL/webhook/health-telemetry
      Headers: Content-Type: application/json
      Body: {
        "type": "health",
        "steps": %health_steps,
        "heart_rate": %health_hr,
        "sleep_hours": %health_sleep,
        "calories": %health_calories,
        "timestamp": "%TIMES"
      }
  A3. Flash: "🏥 Health data synced to NEXUS"
```

## 2. n8n Workflow

```yaml
Webhook Node:
  Path: /health-telemetry

HTTP Request Node:
  URL: https://YOUR_NEXUS_API/api/v1/system/device-telemetry
  Method: POST
  Headers:
    x-api-key: {{$env.NEXUS_API_KEY}}
  Body (JSON):
    type: "health"
    steps: "={{$json.steps}}"
    heart_rate: "={{$json.heart_rate}}"
    sleep_hours: "={{$json.sleep_hours}}"
    calories: "={{$json.calories}}"
    timestamp: "={{$json.timestamp}}"
```

## 3. Alternative: HA + Health Connect API

If using Home Assistant with the `google_health` integration:

```yaml
automation:
  - alias: "Daily Health Telemetry"
    trigger:
      - platform: time
        at: "21:00:00"
    action:
      - service: rest_command.nexus_health_telemetry
        data:
          type: "health"
          steps: "{{ states('sensor.pixel_8_steps') }}"
          heart_rate: "{{ states('sensor.pixel_8_heart_rate') }}"
          sleep_hours: "{{ states('sensor.pixel_8_sleep') }}"
```

## Nexus Endpoint
Reuses `POST /api/v1/system/device-telemetry` with `type: "health"`.
Data stored in `DeviceStateStore.healthState` and injected into Daniela's prompt.
