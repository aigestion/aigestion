// src/services/contact-registry.service.ts
import { injectable } from 'inversify';
import { logger } from '../utils/logger';

/**
 * 🌌 [GOD MODE] Contact Registry Service
 * Sovereign phone book for Daniela's Call Bridge.
 * Maps natural language names/aliases to phone numbers for voice-initiated calling.
 *
 * Phase 1: In-memory registry seeded with owner contacts.
 * Phase 2: MongoDB persistence via collection 'sovereign_contacts'.
 */

export interface SovereignContact {
  name: string;
  aliases: string[];
  phone: string;
  relationship: string;
  priority: 'critical' | 'high' | 'normal';
}

@injectable()
export class ContactRegistryService {
  private contacts: SovereignContact[] = [];

  constructor() {
    this.seedOwnerContacts();
    logger.info(`[ContactRegistry] 🌌 Sovereign Contact Registry initialized with ${this.contacts.length} contacts`);
  }

  /**
   * Seed the registry with the owner's personal contacts.
   * 🔒 These are God-Mode only contacts, never exposed to public API.
   *
   * TODO: Replace placeholder numbers with real numbers.
   * The owner should update these directly or via a secure God Mode endpoint.
   */
  private seedOwnerContacts(): void {
    this.contacts = [
      {
        name: 'Mamá',
        aliases: ['mama', 'mamá', 'madre', 'mami', 'mom'],
        phone: '+34600000001', // TODO: Replace with real number
        relationship: 'family',
        priority: 'critical',
      },
      {
        name: 'Papá',
        aliases: ['papa', 'papá', 'padre', 'papi', 'dad'],
        phone: '+34600000002', // TODO: Replace with real number
        relationship: 'family',
        priority: 'critical',
      },
      {
        name: 'Alejandro',
        aliases: ['ale', 'alejandro', 'yo mismo', 'mi número'],
        phone: '+34600000003', // TODO: Replace with real number
        relationship: 'self',
        priority: 'critical',
      },
    ];
  }

  /**
   * Find a contact by fuzzy name matching.
   * Searches name and aliases case-insensitively.
   */
  findByName(query: string): SovereignContact | null {
    const normalized = query.toLowerCase().trim();

    // Exact alias match first
    const exactMatch = this.contacts.find(
      c =>
        c.name.toLowerCase() === normalized ||
        c.aliases.some(a => a === normalized),
    );
    if (exactMatch) return exactMatch;

    // Partial match (name contains query or alias contains query)
    const partialMatch = this.contacts.find(
      c =>
        c.name.toLowerCase().includes(normalized) ||
        c.aliases.some(a => a.includes(normalized)),
    );
    if (partialMatch) return partialMatch;

    // Reverse partial (query contains alias)
    const reverseMatch = this.contacts.find(
      c =>
        normalized.includes(c.name.toLowerCase()) ||
        c.aliases.some(a => normalized.includes(a)),
    );

    return reverseMatch || null;
  }

  /**
   * Add a new contact to the registry.
   */
  addContact(contact: SovereignContact): void {
    // Avoid duplicates
    const existing = this.findByName(contact.name);
    if (existing) {
      logger.warn(`[ContactRegistry] Contact "${contact.name}" already exists, updating.`);
      Object.assign(existing, contact);
      return;
    }

    this.contacts.push(contact);
    logger.info(`[ContactRegistry] ✅ Added sovereign contact: ${contact.name}`);
  }

  /**
   * List all contacts (God Mode only).
   */
  listContacts(): SovereignContact[] {
    return [...this.contacts];
  }

  /**
   * Remove a contact by name.
   */
  removeContact(name: string): boolean {
    const idx = this.contacts.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
    if (idx >= 0) {
      this.contacts.splice(idx, 1);
      logger.info(`[ContactRegistry] Removed contact: ${name}`);
      return true;
    }
    return false;
  }

  /**
   * Extract contact name from a natural language message.
   * E.g., "llama a mamá" → "mamá", "marca el número de papá" → "papá"
   */
  extractContactFromMessage(message: string): string | null {
    const patterns = [
      /(?:llama|llamar|marca|telefonea|ring|contacta|comunica)\s+(?:a|al|con|el número de|número de)?\s*(.+)/i,
      /(?:manda|envía|enviar|manda un|envía un)\s+(?:mensaje|sms|whatsapp)\s+(?:a|al|para)?\s*(.+)/i,
      /(?:escribe|escribir)\s+(?:a|al|para)\s+(.+)/i,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match?.[1]) {
        // Clean up the extracted name
        return match[1]
          .replace(/[.,!?;:]$/, '')
          .replace(/\s+por favor$/i, '')
          .replace(/\s+porfa$/i, '')
          .trim();
      }
    }

    return null;
  }
}
