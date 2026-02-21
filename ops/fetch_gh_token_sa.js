const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const path = require('path');

const keyPath = path.resolve(__dirname, '../infra/keys/gcp_service_account.json');
const client = new SecretManagerServiceClient({
  keyFilename: keyPath,
});

async function accessSecretVersion(projectId, secretName) {
  const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
  try {
    const [version] = await client.accessSecretVersion({ name });
    const payload = version.payload.data.toString();
    console.log(`SUCCESS:${secretName}=${payload}`);
    return true;
  } catch (e) {
    console.log(`ERROR:${projectId}/${secretName}: ${e.message}`);
  }
  return false;
}

const projects = ['aigestion-v1-848dd', 'aigestion-sovereign-2026', 'dynamic-reef-485215-v4'];
const secrets = ['GITHUB_TOKEN', 'GITHUB_PERSONAL_ACCESS_TOKEN', 'GH_TOKEN', 'GITHUB_API_TOKEN'];

(async () => {
  console.log('Starting fetch with correct project IDs...');
  for (const p of projects) {
    for (const s of secrets) {
      await accessSecretVersion(p, s);
    }
  }
})();
