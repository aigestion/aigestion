const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function findTokens(projectId) {
  console.log(`Searching project: ${projectId}`);
  try {
    const [secrets] = await client.listSecrets({ parent: `projects/${projectId}` });
    for (const secret of secrets) {
      const name = secret.name.split('/').pop();
      if (
        name.toUpperCase().includes('GIT') ||
        name.toUpperCase().includes('TOKEN') ||
        name.toUpperCase().includes('GH_')
      ) {
        console.log(`FOUND_POTENTIAL:${name}`);
        try {
          const [version] = await client.accessSecretVersion({
            name: `${secret.name}/versions/latest`,
          });
          const payload = version.payload.data.toString();
          console.log(`SUCCESS:${name}=${payload}`);
        } catch (e) {
          console.log(`FAILED_TO_ACCESS:${name} - ${e.message}`);
        }
      }
    }
  } catch (e) {
    console.error(`ERROR:${projectId} - ${e.message}`);
  }
}

const projects = ['aigestion-pro-2026', 'dynamic-reef-485215-v4', 'aigestion-v2'];

(async () => {
  for (const p of projects) {
    await findTokens(p);
  }
})();
