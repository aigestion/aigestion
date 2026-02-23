import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../types';
import { GoogleSheetsService } from '../services/google/google-sheets.service';
import { DanielaAIService } from '../services/daniela-ai.service';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function verifyUnifiedSheets() {
  console.log('🚀 Starting Unified Sheets Verification...');

  const container = new Container();

  // Dummy bindings for dependencies
  container.bind(TYPES.DanielaAIService).to(DanielaAIService).inSingletonScope();
  container.bind(TYPES.GoogleSheetsService).to(GoogleSheetsService).inSingletonScope();

  const sheetsService = container.get<GoogleSheetsService>(TYPES.GoogleSheetsService);

  try {
    const title = `Verification Report - ${new Date().toISOString()}`;
    console.log(`Creating spreadsheet: ${title}`);

    const spreadsheet = await sheetsService.createSpreadsheet(title);
    const spreadsheetId = spreadsheet.spreadsheetId!;
    console.log(`✅ Created: ${spreadsheetId}`);

    const testData = [
      ['Header 1', 'Header 2', 'Header 3'],
      ['Data A1', 'Data B1', '100'],
      ['Data A2', 'Data B2', '200'],
    ];

    console.log('Writing test data...');
    await sheetsService.writeRange(spreadsheetId, 'Sheet1!A1', testData);
    console.log('✅ Data written');

    console.log('Running AI Analysis...');
    const analysis = await sheetsService.analyzeSheet(spreadsheetId, 'Sheet1!A1:C3');
    console.log('✅ AI Analysis Result:', JSON.stringify(analysis, null, 2));

    console.log('\n✨ Verification Successful!');
  } catch (error) {
    console.error('❌ Verification Failed:', error);
  }
}

verifyUnifiedSheets();
