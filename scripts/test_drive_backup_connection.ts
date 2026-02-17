import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { google } from 'googleapis';
import * as fs from 'fs';
import path from 'path';

dotenv.config();

async function testDrive() {
  console.log('--- Google Drive Auth Diagnostic (Env Var) ---');
  console.log('Project ID in .env:', process.env.GOOGLE_CLOUD_PROJECT);
  console.log('Service Account Env Var:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

  try {
    if (
      !process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      !fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    ) {
      throw new Error(
        `Service Account File not found or not set: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`
      );
    }

    console.log('✅ Service Account Configured');

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const authClient = await auth.getClient();
    console.log('✅ Service Account Client obtained');

    const drive = google.drive({ version: 'v3', auth: authClient as any });

    console.log('Attempting to list files (Proof of connectivity)...');
    const res = await drive.files.list({
      pageSize: 1,
      fields: 'files(id, name)',
    });
    console.log('✅ Connection successful. Files found:', res.data.files?.length);
    if (res.data.files && res.data.files.length > 0) {
      console.log('First file:', res.data.files[0].name);
    }
  } catch (error: any) {
    console.error('❌ Diagnostic Failed:');
    if (error.response) {
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Status:', error.response.status);
    } else {
      console.error('Error Message:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

testDrive();
