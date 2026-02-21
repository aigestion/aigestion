# 📸 Photo → RAG Pipeline — Tasker + n8n Setup

## Overview
Photos captured on Pixel 8 are auto-analyzed by Gemini Vision and archived into ChromaDB for Daniela's memory.

## Flow
```
Pixel 8 Camera → Tasker File Monitor → n8n Webhook → Nexus /photo-ingest → Gemini Vision → ChromaDB
```

## 1. Tasker Profile: Photo File Monitor

```
Profile: Photo RAG Capture
  Event: File Modified
    Dir: DCIM/Camera
    Pattern: *.jpg;*.png;*.webp

Enter Task: Upload to n8n
  A1. HTTP Request
      Method: POST
      URL: https://YOUR_N8N_URL/webhook/photo-ingest
      Headers: Content-Type: application/json
      Body: {
        "imageUrl": "https://YOUR_CLOUD_STORAGE/%EVTPRM2",
        "source": "pixel_8_camera",
        "tags": ["auto_capture"],
        "timestamp": "%TIMES"
      }
  A2. Flash: "📸 Photo sent to NEXUS RAG"
```

> **Note:** You need to first upload the photo to a cloud storage (GCS, Firebase Storage) 
> and pass the public URL. Use a Tasker task to upload via `rclone` or Firebase SDK.

## 2. n8n Workflow Node

```yaml
Webhook Node:
  Method: POST
  Path: /photo-ingest

HTTP Request Node:
  Method: POST
  URL: https://YOUR_NEXUS_API/api/v1/photo-ingest
  Headers:
    x-api-key: {{$env.NEXUS_API_KEY}}
  Body (JSON):
    imageUrl: "={{$json.imageUrl}}"
    source: "={{$json.source}}"
    tags: "={{$json.tags}}"
```

## 3. Nexus Backend Endpoint

`POST /api/v1/photo-ingest`

Accepts: `{ imageUrl, source?, tags?, prompt? }`

Returns: `{ ingested: true, description: "...", filename: "photo_xxx.md", tags: [...] }`

## Environment
- `HA_TOKEN` — Not required for this pipeline
- Cloud storage credentials for photo upload
