import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { google } from 'googleapis';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testAuth() {
  console.log('--- Auth Logic Check ---');
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  console.log(`Env GOOGLE_APPLICATION_CREDENTIALS: ${credPath}`);

  if (credPath && fs.existsSync(credPath)) {
    console.log('✅ File exists at path.');
    const content = fs.readFileSync(credPath, 'utf8');
    const json = JSON.parse(content);
    console.log(`✅ JSON parsed. Client Email: ${json.client_email}`);

    try {
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/admin.directory.user.readonly'],
        clientOptions: {
          subject: 'admin@aigestion.net'
        }
      });
      console.log('Attempting to get client...');
      await auth.getClient();
      console.log('✅ Client obtained successfully!');
    } catch (e: any) {
      console.error(`❌ getClient failed: ${e.message}`);
      if (e.stack) console.error(e.stack);
    }
  } else {
    console.error('❌ File does NOT exist at path.');
  }
}

testAuth();
