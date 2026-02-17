const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function testGSM() {
  console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
  console.log('Credentials Path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

  try {
    const client = new SecretManagerServiceClient();
    const [secrets] = await client.listSecrets({
      parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}`,
    });
    console.log('Secrets found:', secrets.length);
    secrets.forEach(s => console.log(' -', s.name));
  } catch (err) {
    console.error('GSM Test Failed:', err.message);
  }
}

testGSM();
