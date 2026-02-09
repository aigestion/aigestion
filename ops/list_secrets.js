const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function listSecrets(projectId) {
  try {
    const [secrets] = await client.listSecrets({
      parent: `projects/${projectId}`,
    });
    console.log(`--- Secrets in ${projectId} ---`);
    secrets.forEach(secret => {
      console.log(`SECRET:${secret.name}`);
    });
  } catch (e) {
    console.error(`Failed to list secrets for ${projectId}: ${e.message}`);
  }
}

const projects = ['aigestion-pro-2026', 'dynamic-reef-485215-v4'];

(async () => {
  for (const p of projects) {
    await listSecrets(p);
  }
})();
