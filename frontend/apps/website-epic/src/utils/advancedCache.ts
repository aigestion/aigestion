// ============================================
// ADVANCED CACHE API
// Sistema de cache inteligente con múltiples estrategias
// ============================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
}

export interface CacheConfig {
  maxSize?: number; // Maximum cache size in bytes
  maxEntries?: number; // Maximum number of entries
  defaultTTL?: number; // Default TTL in milliseconds
  strategy?: 'lru' | 'lfu' | 'ttl' | 'adaptive';
  compressionEnabled?: boolean;
  encryptionEnabled?: boolean;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  currentSize: number;
  currentEntries: number;
  hitRate: number;
  averageAccessTime: number;
}

// ============================================
// ADVANCED CACHE CLASS
// Cache con múltiples estrategias y optimizaciones
// ============================================

export class AdvancedCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: Required<CacheConfig>;
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    evictions: 0,
    currentSize: 0,
    currentEntries: 0,
    hitRate: 0,
    averageAccessTime: 0,
  };
  private accessTimes: number[] = [];

  constructor(config: CacheConfig = {}) {
    this.config = {
      maxSize: 50 * 1024 * 1024, // 50MB
      maxEntries: 1000,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      strategy: 'lru',
      compressionEnabled: false,
      encryptionEnabled: false,
      ...config,
    };
  }

  // ============================================
  // CORE CACHE OPERATIONS
  // ============================================

  async set(key: string, data: T, ttl?: number): Promise<void> {
    const startTime = performance.now();
    
    try {
      const serializedData = await this.serialize(data);
      const size = this.calculateSize(serializedData);
      
      // Check if we need to evict entries
      await this.ensureCapacity(size);
      
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTTL,
        accessCount: 0,
        lastAccessed: Date.now(),
        size,
      };
      
      this.cache.set(key, entry);
      this.updateMetrics('set', size);
      
      // Auto-cleanup expired entries
      this.scheduleCleanup();
      
    } catch (error) {
      console.error('Cache set error:', error);
      throw error;
    } finally {
      this.recordAccessTime(performance.now() - startTime);
    }
  }

  async get(key: string): Promise<T | null> {
    const startTime = performance.now();
    
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.updateMetrics('miss');
        return null;
      }
      
      // Check TTL
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.updateMetrics('miss');
        return null;
      }
      
      // Update access metadata
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      
      this.updateMetrics('hit');
      return entry.data;
      
    } catch (error) {
      console.error('Cache get error:', error);
      this.updateMetrics('miss');
      return null;
    } finally {
      this.recordAccessTime(performance.now() - startTime);
    }
  }

  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateMetrics('delete');
    }
    return deleted;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.resetMetrics();
  }

  // ============================================
  // ADVANCED FEATURES
  // ============================================

  async getWithFallback(key: string, fallback: () => Promise<T>, ttl?: number): Promise<T> {
    let data = await this.get(key);
    
    if (data === null) {
      data = await fallback();
      await this.set(key, data, ttl);
    }
    
    return data;
  }

  async getMultiple(keys: string[]): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();
    
    await Promise.all(
      keys.map(async (key) => {
        const value = await this.get(key);
        results.set(key, value);
      })
    );
    
    return results;
  }

  async setMultiple(entries: Map<string, T>, ttl?: number): Promise<void> {
    await Promise.all(
      Array.from(entries.entries()).map(([key, data]) => 
        this.set(key, data, ttl)
      )
    );
  }

  // ============================================
  // CACHE STRATEGIES
  // ============================================

  private async ensureCapacity(requiredSize: number): Promise<void> {
    const currentSize = this.getCurrentSize();
    const availableSpace = this.config.maxSize - currentSize;
    
    if (requiredSize <= availableSpace) {
      return;
    }
    
    switch (this.config.strategy) {
      case 'lru':
        await this.evictLRU(requiredSize - availableSpace);
        break;
      case 'lfu':
        await this.evictLFU(requiredSize - availableSpace);
        break;
      case 'ttl':
        await this.evictExpired();
        break;
      case 'adaptive':
        await this.evictAdaptive(requiredSize - availableSpace);
        break;
    }
  }

  private async evictLRU(requiredSize: number): Promise<void> {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
    
    let freedSpace = 0;
    for (const [key, entry] of entries) {
      this.cache.delete(key);
      freedSpace += entry.size;
      this.updateMetrics('eviction');
      
      if (freedSpace >= requiredSize) {
        break;
      }
    }
  }

  private async evictLFU(requiredSize: number): Promise<void> {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.accessCount - b.accessCount);
    
    let freedSpace = 0;
    for (const [key, entry] of entries) {
      this.cache.delete(key);
      freedSpace += entry.size;
      this.updateMetrics('eviction');
      
      if (freedSpace >= requiredSize) {
        break;
      }
    }
  }

  private async evictExpired(): Promise<void> {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }
    
    for (const key of expiredKeys) {
      this.cache.delete(key);
      this.updateMetrics('eviction');
    }
  }

  private async evictAdaptive(requiredSize: number): Promise<void> {
    // Adaptive strategy combining LRU, LFU, and size considerations
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      entry,
      score: this.calculateAdaptiveScore(entry),
    }));
    
    entries.sort((a, b) => a.score - b.score);
    
    let freedSpace = 0;
    for (const { key, entry } of entries) {
      this.cache.delete(key);
      freedSpace += entry.size;
      this.updateMetrics('eviction');
      
      if (freedSpace >= requiredSize) {
        break;
      }
    }
  }

  private calculateAdaptiveScore(entry: CacheEntry<T>): number {
    const now = Date.now();
    const age = now - entry.timestamp;
    const timeSinceAccess = now - entry.lastAccessed;
    const accessFrequency = entry.accessCount / (age / 1000); // accesses per second
    
    // Lower score = higher eviction priority
    return (
      timeSinceAccess * 0.4 +  // Recent access penalty
      (1 / accessFrequency) * 0.3 +  // Low frequency penalty
      entry.size * 0.3  // Large size penalty
    );
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private getCurrentSize(): number {
    return Array.from(this.cache.values())
      .reduce((total, entry) => total + entry.size, 0);
  }

  private calculateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size;
  }

  private async serialize(data: T): Promise<any> {
    let serialized = data;
    
    if (this.config.compressionEnabled) {
      serialized = await this.compress(serialized);
    }
    
    if (this.config.encryptionEnabled) {
      serialized = await this.encrypt(serialized);
    }
    
    return serialized;
  }

  private async deserialize(serialized: any): Promise<T> {
    let data = serialized;
    
    if (this.config.encryptionEnabled) {
      data = await this.decrypt(data);
    }
    
    if (this.config.compressionEnabled) {
      data = await this.decompress(data);
    }
    
    return data;
  }

  private async compress(data: any): Promise<any> {
    // Simple compression simulation
    return JSON.stringify(data);
  }

  private async decompress(data: any): Promise<any> {
    return JSON.parse(data);
  }

  private async encrypt(data: any): Promise<any> {
    // Simple encryption simulation
    return data;
  }

  private async decrypt(data: any): Promise<any> {
    return data;
  }

  // ============================================
  // METRICS AND MONITORING
  // ============================================

  private updateMetrics(operation: 'hit' | 'miss' | 'set' | 'delete' | 'eviction', size?: number): void {
    switch (operation) {
      case 'hit':
        this.metrics.hits++;
        break;
      case 'miss':
        this.metrics.misses++;
        break;
      case 'set':
        this.metrics.sets++;
        if (size) this.metrics.currentSize += size;
        break;
      case 'delete':
        this.metrics.deletes++;
        break;
      case 'eviction':
        this.metrics.evictions++;
        break;
    }
    
    this.metrics.currentEntries = this.cache.size;
    this.metrics.currentSize = this.getCurrentSize();
    this.metrics.hitRate = this.metrics.hits / (this.metrics.hits + this.metrics.misses) || 0;
  }

  private recordAccessTime(time: number): void {
    this.accessTimes.push(time);
    
    // Keep only last 100 access times
    if (this.accessTimes.length > 100) {
      this.accessTimes.shift();
    }
    
    this.metrics.averageAccessTime = this.accessTimes.reduce((sum, t) => sum + t, 0) / this.accessTimes.length;
  }

  private resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      evictions: 0,
      currentSize: 0,
      currentEntries: 0,
      hitRate: 0,
      averageAccessTime: 0,
    };
    this.accessTimes = [];
  }

  private scheduleCleanup(): void {
    // Schedule cleanup in next tick
    setTimeout(() => this.evictExpired(), 0);
  }

  // ============================================
  // PUBLIC API
  // ============================================

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  getSize(): number {
    return this.getCurrentSize();
  }

  getEntryCount(): number {
    return this.cache.size;
  }

  // ============================================
  // PERSISTENCE
  // ============================================

  async persist(key: string): Promise<void> {
    const entries = Array.from(this.cache.entries());
    const serialized = JSON.stringify(entries);
    
    try {
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Cache persistence error:', error);
      throw error;
    }
  }

  async restore(key: string): Promise<void> {
    try {
      const serialized = localStorage.getItem(key);
      if (!serialized) return;
      
      const entries = JSON.parse(serialized) as [string, CacheEntry<T>][];
      
      for (const [cacheKey, entry] of entries) {
        if (!this.isExpired(entry)) {
          this.cache.set(cacheKey, entry);
        }
      }
      
      this.updateMetrics('restore');
    } catch (error) {
      console.error('Cache restoration error:', error);
      throw error;
    }
  }
}

// ============================================
// CACHE FACTORY
// Fábrica para instancias de cache preconfiguradas
// ============================================

export class CacheFactory {
  private static instances = new Map<string, AdvancedCache>();

  static getInstance(name: string, config?: CacheConfig): AdvancedCache {
    if (!this.instances.has(name)) {
      this.instances.set(name, new AdvancedCache(config));
    }
    return this.instances.get(name)!;
  }

  static createAPICache(): AdvancedCache {
    return this.getInstance('api', {
      maxSize: 10 * 1024 * 1024, // 10MB
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      strategy: 'adaptive',
      compressionEnabled: true,
    });
  }

  static createImageCache(): AdvancedCache {
    return this.getInstance('images', {
      maxSize: 100 * 1024 * 1024, // 100MB
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      strategy: 'lru',
      compressionEnabled: true,
    });
  }

  static createSessionCache(): AdvancedCache {
    return this.getInstance('session', {
      maxSize: 5 * 1024 * 1024, // 5MB
      defaultTTL: 30 * 60 * 1000, // 30 minutes
      strategy: 'ttl',
      compressionEnabled: false,
    });
  }

  static createComponentCache(): AdvancedCache {
    return this.getInstance('components', {
      maxSize: 20 * 1024 * 1024, // 20MB
      defaultTTL: 10 * 60 * 1000, // 10 minutes
      strategy: 'lfu',
      compressionEnabled: true,
    });
  }
}

// ============================================
// REACT HOOKS
// Hooks para usar el cache en componentes React
// ============================================

import { useEffect, useState, useCallback } from 'react';

export function useCache<T>(
  cacheName: string,
  config?: CacheConfig
): {
  get: (key: string) => Promise<T | null>;
  set: (key: string, data: T, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<boolean>;
  clear: () => Promise<void>;
  metrics: CacheMetrics;
} {
  const [cache] = useState(() => new AdvancedCache<T>(config));
  const [metrics, setMetrics] = useState<CacheMetrics>(cache.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(cache.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [cache]);

  return {
    get: useCallback((key: string) => cache.get(key), [cache]),
    set: useCallback((key: string, data: T, ttl?: number) => cache.set(key, data, ttl), [cache]),
    delete: useCallback((key: string) => cache.delete(key), [cache]),
    clear: useCallback(() => cache.clear(), [cache]),
    metrics,
  };
}

export function useCachedData<T>(
  cacheName: string,
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number;
    staleWhileRevalidate?: boolean;
    revalidateOnFocus?: boolean;
  }
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const cache = CacheFactory.getInstance(cacheName);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try cache first
      const cachedData = await cache.get(key);
      
      if (cachedData && options?.staleWhileRevalidate) {
        setData(cachedData);
      }
      
      // Fetch fresh data
      const freshData = await fetcher();
      await cache.set(key, freshData, options?.ttl);
      setData(freshData);
      
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [cache, key, fetcher, options?.ttl, options?.staleWhileRevalidate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (options?.revalidateOnFocus) {
      const handleFocus = () => fetchData();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [fetchData, options?.revalidateOnFocus]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// ============================================
// INITIALIZATION
// ============================================

export function initializeAdvancedCache(): void {
  // Initialize default cache instances
  CacheFactory.createAPICache();
  CacheFactory.createImageCache();
  CacheFactory.createSessionCache();
  CacheFactory.createComponentCache();
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Advanced Cache System Initialized');
  }
}

// Auto-initialization
initializeAdvancedCache();
