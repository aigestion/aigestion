const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function listSecrets(projectId) {
  try {
    const [secrets] = await client.listSecrets({
      parent: `projects/${projectId}`,
    });
    console.log(`--- Secrets in ${projectId} ---`);
    for (const secret of secrets) {
      console.log(`SECRET:${secret.name}`);
      try {
        const [version] = await client.accessSecretVersion({
          name: `${secret.name}/versions/latest`,
        });
        const payload = version.payload.data.toString();
        console.log(`VALUE:${payload}`);
      } catch (err) {
        console.log(`VALUE: [HIDDEN or ERROR: ${err.message}]`);
      }
    }
  } catch (e) {
    console.error(`Failed to list secrets for ${projectId}: ${e.message}`);
  }
}

const projects = ['aigestion-v2', 'aigestion-net', 'aigestion-sovereign-2026'];

(async () => {
  for (const p of projects) {
    await listSecrets(p);
  }
})();
