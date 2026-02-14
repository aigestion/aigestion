import { injectable } from 'inversify';

@injectable()
export class GoogleSheetsService {
  async appendRow(spreadsheetId: string, range: string, values: any[]) {
    return { updates: { updatedRows: 1 } };
  }
}
