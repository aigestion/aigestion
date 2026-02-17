const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');
const path = require('path');

async function fetchSecrets() {
  const saPath = 'C:/Users/Alejandro/AIGestion/infra/credentials/aigestion-ai-sa.json';
  const projectId = 'aigestion-pro-2026';

  process.env.GOOGLE_APPLICATION_CREDENTIALS = saPath;

  const client = new SecretManagerServiceClient();

  const secretNames = [
    'GEMINI_API_KEY',
    'MONGO_ROOT_PASSWORD',
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'MONGODB_URI',
    'DATABASE_URL',
  ];

  console.log(`--- FETCHING SECRETS FROM PROJECT: ${projectId} ---`);

  for (const name of secretNames) {
    try {
      const [version] = await client.accessSecretVersion({
        name: `projects/${projectId}/secrets/${name}/versions/latest`,
      });
      const payload = version.payload.data.toString();
      console.log(`${name}: ${payload.substring(0, 5)}... (Length: ${payload.length})`);
    } catch (err) {
      console.log(`${name}: NOT FOUND or FAILED (${err.message})`);
    }
  }
}

fetchSecrets();
