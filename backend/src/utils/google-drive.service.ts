import { injectable } from 'inversify';

@injectable()
export class GoogleDriveService {
  async uploadFile(file: any) {
    return { id: 'stub-id', webViewLink: 'http://stub-link' };
  }
}
