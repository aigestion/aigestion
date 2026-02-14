import { injectable } from 'inversify';

@injectable()
export class NotebookInsightService {
  async generateInsightNotebook(topic: string, context: any) {
    return { topic, message: 'Insight generated via stub', notebookUrl: 'http://localhost/notebook' };
  }
}
