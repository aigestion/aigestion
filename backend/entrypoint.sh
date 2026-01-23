#!/usr/bin/env bash
set -euo pipefail

# Load secrets from Google Secret Manager (if GCP env vars are set)
if [[ -n "${GOOGLE_CLOUD_PROJECT}" && -z "${SKIP_SECRETS}" ]]; then
  echo "🔐 Loading secrets from Google Secret Manager for project: ${GOOGLE_CLOUD_PROJECT}..."

  # Get access token from Metadata Server (using sed for portable parsing)
  ACCESS_TOKEN=$(curl -s -H "Metadata-Flavor: Google" "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')

  if [[ -z "$ACCESS_TOKEN" ]]; then
    echo "⚠️ Failed to retrieve access token from metadata server. Are we on GCP?"
  else
    # Read keys from .env.example (skipping comments and empty lines)
    # We assume .env.example is copied to the same directory in the container
    ENV_EXAMPLE="./.env.example"
    if [[ ! -f "$ENV_EXAMPLE" ]]; then
      echo "⚠️ $ENV_EXAMPLE not found. Skipping Secret Manager loading."
    else
      SECRETS=$(grep -v '^#' "$ENV_EXAMPLE" | grep -v '^$' | cut -d'=' -f1)

      for secret in $SECRETS; do
        # Only fetch if not already set (allow overrides)
        if [[ -z "${!secret:-}" ]]; then
          # Fetch secret value via REST API
          API_URL="https://secretmanager.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT}/secrets/${secret}/versions/latest:access"
          RESPONSE=$(curl -s -H "Authorization: Bearer ${ACCESS_TOKEN}" "$API_URL")

          # Check if the secret exists and we have access
          if echo "$RESPONSE" | grep -q '"data":'; then
            B64_DATA=$(echo "$RESPONSE" | sed -n 's/.*"data": *"\([^"]*\)".*/\1/p')
            VALUE=$(echo "$B64_DATA" | base64 -d)
            export "$secret"="$VALUE"
            echo "✅ Loaded $secret"
          else
            echo "❓ Secret $secret not found in GSM (or access denied)"
          fi
        fi
      done
    fi
  fi
else
  echo "⚙️ Skipping Secret Manager loading (dev mode or missing GOOGLE_CLOUD_PROJECT)"
fi

# Finally exec the original command (passed from Docker CMD)
exec "$@"
