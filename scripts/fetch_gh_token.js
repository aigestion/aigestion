const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function accessSecretVersion(projectId, secretName) {
  const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
  try {
    const [version] = await client.accessSecretVersion({ name });
    const payload = version.payload.data.toString();
    if (payload) {
        console.log(`SUCCESS:${secretName}=${payload}`);
        return true;
    }
  } catch(e) {
    // console.error(`Failed to fetch ${secretName} from ${projectId}: ${e.message}`);
  }
  return false;
}

const projects = ['aigestion-pro-2026', 'dynamic-reef-485215-v4'];
const secrets = ['GITHUB_TOKEN', 'GITHUB_PERSONAL_ACCESS_TOKEN', 'GH_TOKEN'];

(async () => {
    console.log("Attempting to fetch secrets...");
    for (const p of projects) {
        for (const s of secrets) {
            if (await accessSecretVersion(p, s)) {
               // Keep going to find all potential matches
            }
        }
    }
})();
