// src/infrastructure/repository/BaseRepository.ts

export interface IEntity {
  id: string;
}

export abstract class BaseRepository<T extends IEntity> {
  /**
   * SOVEREIGN REPOSITORY BASE
   * Supports both in-memory Map for testing/fast-cache and
   * external providers (Mongoose/BigQuery) via overrides.
   */

  abstract create(item: Partial<T>): Promise<T>;
  abstract findAll(limit?: number, offset?: number): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract update(id: string, data: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
}

/**
 * IN-MEMORY REPOSITORY IMPLEMENTATION
 * Default fallback for lightweight entities or unit tests.
 */
export class InMemoryRepository<T extends IEntity> extends BaseRepository<T> {
  protected items = new Map<string, T>();

  async create(item: T): Promise<T> {
    this.items.set(item.id, item);
    return item;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  async findById(id: string): Promise<T | null> {
    return this.items.get(id) ?? null;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data } as T;
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }
}
