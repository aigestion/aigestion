import mongoose, { Schema } from 'mongoose';
import { getCache, setCache } from '../../cache/redis';
import { logger } from '../../utils/logger';
import crypto from 'node:crypto';

interface CacheOptions {
  ttl?: number;
  key?: string;
  forceUpdate?: boolean;
}

declare module 'mongoose' {
  // @ts-ignore - Signature mismatch in recent Mongoose versions is handled by runtime checks
  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType, QueryOp = 'find'> {
    cache(options?: CacheOptions): this;
    useCache: boolean;
    cacheOptions: CacheOptions;
  }
}

// Auto-apply to Query prototype immediately on module load
if (!(mongoose.Query.prototype as any).cache) {
  (mongoose.Query.prototype as any).cache = function (this: any, options: CacheOptions = {}) {
    this.useCache = true;
    this.cacheOptions = options;
    return this;
  };
}

/**
 * [GOD LEVEL] Mongoose Redis Cache Plugin
 * Automatically integrates Redis L2 caching into Mongoose queries.
 */
export function mongooseCachePlugin(schema: Schema) {
  // Add cache method to schema query for chainability
  (schema.query as any).cache = function (this: any, options: CacheOptions = {}) {
    this.useCache = true;
    this.cacheOptions = options;
    return this;
  };

  const exec = mongoose.Query.prototype.exec;

  mongoose.Query.prototype.exec = async function (this: any) {
    if (!this.useCache) {
      return exec.apply(this, arguments as any);
    }

    const { ttl = 3600, forceUpdate = false } = this.cacheOptions;

    // Generate unique cache key based on query, collection, and options
    const queryObj = this.getQuery();
    const collectionName = this.model.collection.name;
    const cacheKey =
      this.cacheOptions.key ||
      `mongo:${collectionName}:${crypto
        .createHash('sha256')
        .update(JSON.stringify(queryObj) + JSON.stringify(this.getOptions()))
        .digest('hex')}`;

    if (!forceUpdate) {
      try {
        const cachedValue = await getCache(cacheKey);
        if (cachedValue) {
          logger.debug(`[MongooseCache] Cache HIT for key: ${cacheKey}`);

          // If query is lean, return plain objects from cache
          if (this._mongooseOptions.lean) {
            return cachedValue;
          }

          // Rehydrate the results into Mongoose documents
          const model = this.model;
          return Array.isArray(cachedValue)
            ? cachedValue.map(d => new model(d))
            : new model(cachedValue);
        }
      } catch (err) {
        logger.error(`[MongooseCache] Recovery failed for key ${cacheKey}:`, err);
      }
    }

    // Cache miss or force update
    const result = await exec.apply(this, arguments as any);

    if (result) {
      try {
        await setCache(cacheKey, result, ttl);
        logger.debug(`[MongooseCache] Cache SET for key: ${cacheKey}`);
      } catch (err) {
        logger.error(`[MongooseCache] Persistence failed for key ${cacheKey}:`, err);
      }
    }

    return result;
  };
}
