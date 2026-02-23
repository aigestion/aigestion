import { google } from 'googleapis';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { DanielaAIService } from '../daniela-ai.service';
import { logger } from '../../utils/logger';
import { getCache, setCache } from '../../cache/redis';

const CACHE_TTL = 300; // 5 minutes

/**
 * GOOGLE SHEETS SERVICE — God Level Data Engine
 * Full spreadsheet control: read, write, append, create, format.
 * Powers automated reporting, data pipelines, and dashboard exports.
 */
@injectable()
export class GoogleSheetsService {
  private sheets: any | null = null;
  private readonly SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
  private initPromise: Promise<void> | null = null;

  constructor(@inject(TYPES.DanielaAIService) private daniela: DanielaAIService) {
    this.initPromise = this.initializeClient();
  }

  private async initializeClient() {
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        const auth = new google.auth.GoogleAuth({ scopes: this.SCOPES });
        const authClient = await auth.getClient();
        this.sheets = google.sheets({ version: 'v4', auth: authClient as any });
        logger.info('[GoogleSheets] ✅ Initialized via Service Account');
        return;
      }

      if (process.env.GOOGLE_SHEETS_API_KEY) {
        this.sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_SHEETS_API_KEY });
        logger.info('[GoogleSheets] ⚠️ Initialized via API Key (read-only)');
        return;
      }

      logger.warn('[GoogleSheets] No credentials found — service inactive');
    } catch (error: any) {
      logger.error(`[GoogleSheets] Init failure: ${error.message}`);
    }
  }

  private async getClient(): Promise<any> {
    if (this.initPromise) await this.initPromise;
    if (!this.sheets) throw new Error('Google Sheets client not initialized');
    return this.sheets;
  }

  // ─────────────────────────────────────────────────────────────
  // READ OPERATIONS
  // ─────────────────────────────────────────────────────────────

  /**
   * Reads values from a spreadsheet range.
   */
  async readRange(spreadsheetId: string, range: string): Promise<any[][]> {
    const cacheKey = `sheets:${spreadsheetId}:${range}`;
    const cached = await getCache<string>(cacheKey);
    if (cached) return JSON.parse(cached);

    const client = await this.getClient();
    const response = await client.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values || [];
    await setCache(cacheKey, JSON.stringify(values), CACHE_TTL);
    return values;
  }

  /**
   * Reads multiple ranges in a single request.
   */
  async readMultipleRanges(
    spreadsheetId: string,
    ranges: string[],
  ): Promise<Record<string, any[][]>> {
    const client = await this.getClient();
    const response = await client.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges,
    });

    const result: Record<string, any[][]> = {};
    for (const valueRange of response.data.valueRanges || []) {
      if (valueRange.range) {
        result[valueRange.range] = valueRange.values || [];
      }
    }
    return result;
  }

  /**
   * Gets spreadsheet metadata (title, sheets, properties).
   */
  async getSpreadsheetInfo(spreadsheetId: string): Promise<{
    title: string;
    sheets: Array<{ id: number; title: string; rowCount: number; columnCount: number }>;
    locale: string;
  }> {
    const client = await this.getClient();
    const response = await client.spreadsheets.get({
      spreadsheetId,
      fields: 'properties,sheets.properties',
    });

    return {
      title: response.data.properties?.title || '',
      sheets: (response.data.sheets || []).map((s: any) => ({
        id: s.properties?.sheetId || 0,
        title: s.properties?.title || '',
        rowCount: s.properties?.gridProperties?.rowCount || 0,
        columnCount: s.properties?.gridProperties?.columnCount || 0,
      })),
      locale: response.data.properties?.locale || 'en_US',
    };
  }

  // ─────────────────────────────────────────────────────────────
  // WRITE OPERATIONS
  // ─────────────────────────────────────────────────────────────

  /**
   * Writes values to a range.
   */
  async writeRange(
    spreadsheetId: string,
    range: string,
    values: any[][],
    inputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED',
  ): Promise<{ updatedCells: number; updatedRows: number }> {
    const client = await this.getClient();
    const response = await client.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: inputOption,
      requestBody: { values },
    });

    logger.info(`[GoogleSheets] ✏️ Updated ${response.data.updatedCells} cells in ${range}`);
    return {
      updatedCells: response.data.updatedCells || 0,
      updatedRows: response.data.updatedRows || 0,
    };
  }

  /**
   * Appends rows to the end of a sheet.
   */
  async appendRows(
    spreadsheetId: string,
    range: string,
    values: any[][],
    inputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED',
  ): Promise<{ updatedCells: number; updatedRange: string }> {
    const client = await this.getClient();
    const response = await client.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: inputOption,
      requestBody: { values },
    });

    logger.info(`[GoogleSheets] ➕ Appended ${values.length} rows to ${range}`);
    return {
      updatedCells: response.data.updates?.updatedCells || 0,
      updatedRange: response.data.updates?.updatedRange || range,
    };
  }

  /**
   * Clears a range.
   */
  async clearRange(spreadsheetId: string, range: string): Promise<void> {
    const client = await this.getClient();
    await client.spreadsheets.values.clear({
      spreadsheetId,
      range,
      requestBody: {},
    });
    logger.info(`[GoogleSheets] 🗑️ Cleared range: ${range}`);
  }

  // ─────────────────────────────────────────────────────────────
  // GOD MODE — SPREADSHEET CREATION & AUTOMATION
  // ─────────────────────────────────────────────────────────────

  /**
   * Creates a new spreadsheet.
   */
  async createSpreadsheet(
    title: string,
    sheetNames: string[] = ['Sheet1'],
  ): Promise<{
    spreadsheetId: string;
    url: string;
  }> {
    const client = await this.getClient();
    const response = await client.spreadsheets.create({
      requestBody: {
        properties: { title },
        sheets: sheetNames.map(name => ({
          properties: { title: name },
        })),
      },
    });

    const id = response.data.spreadsheetId!;
    logger.info(`[GoogleSheets] 📊 Spreadsheet created: ${id} (${title})`);
    return {
      spreadsheetId: id,
      url: `https://docs.google.com/spreadsheets/d/${id}`,
    };
  }

  /**
   * Adds a new sheet (tab) to an existing spreadsheet.
   */
  async addSheet(spreadsheetId: string, title: string): Promise<{ sheetId: number }> {
    const client = await this.getClient();
    const response = await client.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title } } }],
      },
    });

    const sheetId = response.data.replies?.[0]?.addSheet?.properties?.sheetId || 0;
    logger.info(`[GoogleSheets] ➕ Sheet "${title}" added to ${spreadsheetId}`);
    return { sheetId };
  }

  /**
   * Exports a data array as a new spreadsheet report.
   * Convenience method for automated reporting.
   */
  async generateReport(
    title: string,
    headers: string[],
    data: any[][],
  ): Promise<{ spreadsheetId: string; url: string; rows: number }> {
    const result = await this.createSpreadsheet(title, ['Report']);
    await this.writeRange(result.spreadsheetId, 'Report!A1', [headers, ...data]);

    logger.info(`[GoogleSheets] 📈 Report generated: ${title} (${data.length} rows)`);
    return {
      ...result,
      rows: data.length,
    };
  }

  /**
   * Performs AI cognitive analysis on sheet data.
   */
  async analyzeSheet(spreadsheetId: string, range: string = 'Sheet1!A:Z'): Promise<any> {
    try {
      const data = await this.readRange(spreadsheetId, range);
      if (data.length === 0) return { message: 'No data found' };

      const headers = data[0];
      const rows = data.slice(1);
      const records = rows.map((row: any[]) =>
        Object.fromEntries(headers.map((h: any, i: number) => [h, row[i]])),
      );

      logger.info(`[GoogleSheets] 🧠 Starting AI analysis for ${spreadsheetId}`);

      const analysisResult = await this.daniela.processMessage(
        0,
        JSON.stringify(records),
        'sheet-analysis',
        'system',
        'user',
      );

      return {
        totalRows: rows.length,
        totalColumns: headers.length,
        insights: analysisResult,
        summary: {
          dataPoints: rows.length,
          timestamp: new Date(),
        },
      };
    } catch (error: any) {
      logger.error(`[GoogleSheets] Analysis failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Adds a chart to a spreadsheet.
   */
  async addChart(spreadsheetId: string, chartData: any) {
    const client = await this.getClient();
    const request = {
      spreadsheetId,
      resource: {
        requests: [
          {
            addChart: {
              chart: {
                spec: {
                  title: chartData.title,
                  basicChart: {
                    chartType: chartData.type,
                    series: chartData.series,
                    axis: chartData.axis,
                  },
                },
              },
            },
          },
        ],
      },
    };

    return await client.spreadsheets.batchUpdate(request);
  }
}
