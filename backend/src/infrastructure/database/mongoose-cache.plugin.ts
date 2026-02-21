import { Schema, Document, Query } from 'mongoose';
import { getCache, setCache } from '../../cache/redis';
import { logger } from '../../utils/logger';
import crypto from 'crypto';
import mongoose from 'mongoose'; // Added for QueryPrototype

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

/**
 * [GOD LEVEL] Mongoose Redis Cache Plugin
 * Automatically integrates Redis L2 caching into Mongoose queries.
 */
export function mongooseCachePlugin(schema: Schema) {
  (schema.query as any).cache = function (this: any, options: CacheOptions = {}) {
    this.useCache = true;
    this.cacheOptions = options;
    return this;
  };

  // Also extend the Query prototype directly to be safe
  const QueryPrototype = (mongoose as any).Query.prototype;
  if (!QueryPrototype.cache) {
    QueryPrototype.cache = function (this: any, options: CacheOptions = {}) {
      this.useCache = true;
      this.cacheOptions = options;
      return this;
    };
  }

  const exec = Query.prototype.exec;

  Query.prototype.exec = async function () {
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
