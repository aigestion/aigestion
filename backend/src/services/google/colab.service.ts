import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { logger } from '../../utils/logger';
import { GoogleDriveService } from './google-drive.service';

/**
 * SOVEREIGN COLAB SERVICE
 * Orchestrates Google Colab flows by generating notebooks and syncing with Drive.
 */
@injectable()
export class ColabService {
  constructor(
    @inject(GoogleDriveService) private drive: GoogleDriveService
  ) {}

  /**
   * Generates a Sovereign Notebook (.ipynb) for a specific data task.
   */
  async createNotebook(title: string, cells: Array<{ type: 'code' | 'markdown', content: string }>): Promise<string> {
    logger.info(`[ColabService] Generating Sovereign Notebook: ${title}`);

    const notebook = {
      cells: cells.map(cell => ({
        cell_type: cell.type,
        metadata: {},
        source: cell.content.split('\n').map(line => line + '\n'),
        outputs: [],
        execution_count: null
      })),
      metadata: {
        kernelspec: {
          display_name: "Python 3",
          language: "python",
          name: "python3"
        },
        language_info: {
          name: "python",
          version: "3.10"
        }
      },
      nbformat: 4,
      nbformat_minor: 0
    };

    const content = JSON.stringify(notebook, null, 2);
    const fileName = `${title.replace(/\s+/g, '_')}_${Date.now()}.ipynb`;

    try {
      // Upload to Drive to make it viable for Colab
      const fileId = await this.drive.uploadFileContent(
        Buffer.from(content),
        fileName,
        'application/x-ipynb+json',
      );
      const colabUrl = `https://colab.research.google.com/drive/${fileId}`;

      logger.info(`[ColabService] Notebook ready at: ${colabUrl}`);
      return colabUrl;
    } catch (error) {
      logger.error('[ColabService] Notebook dispatch failure', error);
      throw error;
    }
  }

  /**
   * Template: Rapid Data Analysis Notebook
   */
  async generateAnalysisNotebook(datasetName: string, dataSummary: string): Promise<string> {
      const cells = [
          { type: 'markdown' as const, content: `# 🌌 AIGestion Nexus - Data Insight: ${datasetName}\nGenerated for Sovereign Analysis.` },
          { type: 'code' as const, content: `import pandas as pd\nimport plotly.express as px\n\n# Contextual Summary:\n# ${dataSummary.replace('\n', ' ')}\n\nprint("Intelligence Hub Ready.")` },
          { type: 'code' as const, content: `# Placeholder for automatic data loading from AIG API\n# response = requests.get('https://api.aigestion.net/data/${datasetName}')` }
      ];
      return this.createNotebook(`Insight_${datasetName}`, cells);
  }
}
