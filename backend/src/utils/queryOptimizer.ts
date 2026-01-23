import { Model } from 'mongoose';
import { logger } from './logger';

/**
 * Apply indexes to Mongoose models
 */
export async function applyIndexes(models: Record<string, Model<any>>) {
  const results: Record<string, boolean> = {};

  for (const [name, model] of Object.entries(models)) {
    try {
      // Mongoose models have ensureIndexes (deprecated) or createIndexes
      const ensureIndexes = (model as any).ensureIndexes || model.createIndexes;

      if (typeof ensureIndexes === 'function') {
        await ensureIndexes.call(model);
        logger.info(`Indexes applied for model: ${name}`);
        results[name] = true;
      } else {
        logger.warn(`Model ${name} does not have ensureIndexes or createIndexes method`);
        results[name] = false;
      }
    } catch (error) {
      logger.error(error, `Failed to apply indexes for model: ${name}`);
      results[name] = false;
    }
  }

  return results;
}
