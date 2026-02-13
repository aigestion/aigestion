---
description: Generate frontend API client from OpenAPI spec.
---

# Generate API Client

## 1. Download Spec

- [ ] Fetch swagger.json from running backend.

```bash
curl http://localhost:4000/api-json > swagger.json
```

## 2. Run Generator

- [ ] specific generator command (e.g., openapi-generator-cli).

```bash
npx @openapitools/openapi-generator-cli generate -i swagger.json -g typescript-axios -o frontend/libs/api-client
```
