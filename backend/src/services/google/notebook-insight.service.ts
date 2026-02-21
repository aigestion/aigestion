import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { Gemini2Service } from '../gemini-2.service';
import { BigQueryService } from './bigquery.service';
import { logger } from '../../utils/logger';

/**
 * NOTEBOOK INSIGHT SERVICE
 * Orchestrates deep data analysis via Google Colab / Notebook generation.
 */
@injectable()
export class NotebookInsightService {
  constructor(
    @inject(TYPES.Gemini2Service) private readonly gemini: Gemini2Service,
    @inject(TYPES.BigQueryService) private readonly bq: BigQueryService,
  ) {}

  /**
   * Generates a Python Notebook script based on raw data trends.
   */
  async generateInsightNotebook(topic: string, dataSummary: any) {
    logger.info(`[NotebookInsight] Generating research notebook for: ${topic}`);

    const prompt = `
      [MODO DIOS: ACTIVADO]
      Genera un script de Python PROFESIONAL Y EJECUTABLE para un Jupyter Notebook/Colab para analizar los siguientes datos de tendencia:
      ${JSON.stringify(dataSummary)}

      REQUISITOS OBLIGATORIOS (GOOGLE STANDARDS):
      1. **Análisis Profundo**: Usa pandas, matplotlib/seaborn y scikit-learn.
      2. **Simulación Predictiva**: Implementa un modelo (Regresión, Random Forest o LSTM) para proyectar el futuro.
      3. **Sabiduría Soberana**: Incluye celdas de markdown con comentarios estratégicos en ESPAÑOL (Estilo Ejecutivo/Autoritario).
      4. **Visualización Premium**: Gráficos de alta resolución (dpi=300), paletas de colores modernas.
      5. **Robustez**: Manejo de errores y limpieza de datos automática.

      Tu salida debe ser ÚNICAMENTE el código Python, listo para copiar y pegar en una celda de código.
    `;

    try {
      // Use Gemini 2.0 Pro for maximum reasoning capability
      const notebookCode = await this.gemini.generateText(prompt, {
        model: 'gemini-2.5-pro',
        temperature: 0.2, // Precision
        systemInstruction: `Eres NotebookGem, el Científico de Datos Supremo del Nexus. Tu código es perfecto, tus insights son ley.`,
      });

      await this.bq.trackEvent('WisdomEngine', 'NotebookGenerated', {
        topic,
        timestamp: new Date().toISOString(),
      });

      return {
        topic,
        code: notebookCode,
        status: 'ready_for_execution',
        message: 'Notebook generado con éxito. Listo para despliegue en Colab Enterprise.',
      };
    } catch (error) {
      logger.error('[NotebookInsight] Notebook generation failed', error);
      throw error;
    }
  }

  async createWisdomReport(notebookResult: any) {
    logger.info('[NotebookInsight] Synthesizing wisdom from notebook results...');

    // Synthesize a strategic report based on the code/analysis
    const analysis = await this.gemini.generateText(
      `Analiza este código de notebook y extrae 3 insights estratégicos de "Nivel Dios" para la dirección ejecutiva:\n\n${notebookResult.code}`,
      { model: 'gemini-2.0-flash' },
    );

    return { wisdom: analysis };
  }
}
