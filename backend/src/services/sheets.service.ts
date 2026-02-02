import { google } from 'googleapis';
import { injectable, inject } from 'inversify';
import { DanielaAIService } from './daniela-ai.service';

/**
 * Google Sheets Service
 * Integración con Google Sheets para análisis y reportes automáticos
 */
@injectable()
export class SheetsService {
  private sheets: any;
  private auth: any;

  constructor(
    @inject(DanielaAIService) private daniela: DanielaAIService
  ) {}

  async initialize() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly'
      ]
    });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async readData(spreadsheetId: string, range: string = 'Sheet1!A:Z') {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range
      });
      return response.data.values || [];
    } catch (error) {
      console.error('Error reading sheet data:', error);
      throw error;
    }
  }

  async writeData(spreadsheetId: string, range: string, values: any[]) {
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
      });
      return response.data;
    } catch (error) {
      console.error('Error writing sheet data:', error);
      throw error;
    }
  }

  async appendData(spreadsheetId: string, range: string, values: any[]) {
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
      });
      return response.data;
    } catch (error) {
      console.error('Error appending sheet data:', error);
      throw error;
    }
  }

  async analyzeSheet(spreadsheetId: string, range: string = 'Sheet1!A:Z') {
    try {
      const data = await this.readData(spreadsheetId, range);

      // Convertir a formato estructura
      const headers = data[0];
      const rows = data.slice(1);
      const records = rows.map((row: any[]) =>
        Object.fromEntries(headers.map((h, i) => [h, row[i]]))
      );

      // Usar Daniela AI para análisis
      const analysis = {
        totalRows: rows.length,
        totalColumns: headers.length,
        insights: await this.daniela.analyzeContent(JSON.stringify(records)),
        summary: {
          dataPoints: rows.length,
          timestamp: new Date()
        }
      };

      return analysis;
    } catch (error) {
      console.error('Error analyzing sheet:', error);
      throw error;
    }
  }

  async createReport(spreadsheetId: string) {
    try {
      const analysis = await this.analyzeSheet(spreadsheetId);

      const report = [
        ['Generated Report'],
        [''],
        ['Timestamp', new Date().toISOString()],
        ['Total Rows', analysis.totalRows],
        ['Total Columns', analysis.totalColumns],
        [''],
        ['Analysis', analysis.insights],
        ['']
      ];

      await this.appendData(
        spreadsheetId,
        'Sheet1!A100:B110',
        report
      );

      return {
        status: 'success',
        report: analysis,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async addChart(spreadsheetId: string, chartData: any) {
    try {
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
                      axis: chartData.axis
                    }
                  }
                }
              }
            }
          ]
        }
      };

      return await this.sheets.spreadsheets.batchUpdate(request);
    } catch (error) {
      console.error('Error adding chart:', error);
      throw error;
    }
  }

  async autoFormatData(spreadsheetId: string, range: string) {
    try {
      const request = {
        spreadsheetId,
        resource: {
          requests: [
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId: 0,
                  dimension: 'COLUMNS'
                }
              }
            }
          ]
        }
      };

      return await this.sheets.spreadsheets.batchUpdate(request);
    } catch (error) {
      console.error('Error auto-formatting:', error);
      throw error;
    }
  }
}
