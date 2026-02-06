#!/usr/bin/env bash
# Deploy artifacts to Microsoft Foundry-style endpoint (HTTP upload)
set -euo pipefail

# Load .env if present
if [ -f .env ]; then
  # shellcheck disable=SC1091
  set -o allexport; source .env; set +o allexport
fi

: "Check required vars"
: ${FOUNDRY_PROJECT_ENDPOINT:?Need to set FOUNDRY_PROJECT_ENDPOINT}
: ${FOUNDRY_MODEL_DEPLOYMENT_NAME:?Need to set FOUNDRY_MODEL_DEPLOYMENT_NAME}
: ${FOUNDRY_API_KEY:?Need to set FOUNDRY_API_KEY}

PACKAGE_PATH=${PACKAGE_PATH:-aigestion-deploy}
ZIP_NAME="deploy-${FOUNDRY_MODEL_DEPLOYMENT_NAME}.zip"

if [ ! -d "$PACKAGE_PATH" ]; then
  echo "Package path '$PACKAGE_PATH' not found. Build your frontend into that folder or set PACKAGE_PATH."
  exit 1
fi

if command -v zip >/dev/null 2>&1; then
  echo "Zipping $PACKAGE_PATH -> $ZIP_NAME"
  zip -r "$ZIP_NAME" "$PACKAGE_PATH" >/dev/null
else
  echo "zip not found. Trying tar.gz"
  TAR_NAME="${ZIP_NAME%.zip}.tar.gz"
  tar -czf "$TAR_NAME" "$PACKAGE_PATH"
  ZIP_NAME="$TAR_NAME"
fi

echo "Uploading $ZIP_NAME to $FOUNDRY_PROJECT_ENDPOINT"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$FOUNDRY_PROJECT_ENDPOINT" \
  -H "Authorization: Bearer $FOUNDRY_API_KEY" \
  -F "deploymentName=$FOUNDRY_MODEL_DEPLOYMENT_NAME" \
  -F "file=@$ZIP_NAME")

if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 300 ]; then
  echo "Deploy accepted (HTTP $HTTP_STATUS). Check Foundry console for status."
  rm -f "$ZIP_NAME"
  exit 0
else
  echo "Deploy failed with HTTP $HTTP_STATUS"
  echo "Response code: $HTTP_STATUS"
  ls -lh "$ZIP_NAME" || true
  exit 2
fi
