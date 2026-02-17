const { google } = require('googleapis');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load .env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

async function testDrive() {
  console.log('--- Google Drive Diagnostic ---');
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  console.log('Key Path:', keyPath);

  if (!keyPath || !fs.existsSync(keyPath)) {
    console.error('❌ Service account key file not found at:', keyPath);
    return;
  }

  try {
    const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    console.log('Project ID in Key:', keyFile.project_id);
    console.log('Client Email:', keyFile.client_email);

    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const client = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: client });

    console.log('Attempting to list files (v3)...');
    const res = await drive.files.list({
      pageSize: 5,
      fields: 'files(id, name)',
    });

    console.log('✅ Connection Successful!');
    console.log('Recent Files:', res.data.files);
  } catch (error) {
    console.error('❌ Connection Failed!');
    console.error('Error Name:', error.name);
    console.log('Error Message:', error.message);
    if (error.response) {
      console.log('Response Status:', error.response.status);
      console.log('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testDrive();
