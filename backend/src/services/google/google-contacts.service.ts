import { google } from 'googleapis';
import { injectable } from 'inversify';
import { logger } from '../../utils/logger';

/**
 * GOOGLE CONTACTS SERVICE — People API Integration
 * Manage contacts, segments, and groups.
 */
@injectable()
export class GoogleContactsService {
  private people: any | null = null;
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/user.emails.read',
  ];
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initializeClient();
  }

  private async initializeClient() {
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        const auth = new google.auth.GoogleAuth({
          scopes: this.SCOPES,
          clientOptions: { subject: process.env.GMAIL_DELEGATED_USER },
        });
        const authClient = await auth.getClient();
        this.people = google.people({ version: 'v1', auth: authClient as any });
        logger.info('[GoogleContacts] ✅ Initialized via Service Account');
      } else {
        logger.warn('[GoogleContacts] No credentials found — service inactive');
      }
    } catch (error: any) {
      logger.error(`[GoogleContacts] Init failure: ${error.message}`);
    }
  }

  private async getClient(): Promise<any> {
    if (this.initPromise) await this.initPromise;
    if (!this.people) throw new Error('Google Contacts client not initialized');
    return this.people;
  }

  /**
   * Lists connections (contacts).
   */
  async listContacts(pageSize = 100) {
    const client = await this.getClient();
    const response = await client.people.connections.list({
      resourceName: 'people/me',
      pageSize,
      personFields: 'names,emailAddresses,phoneNumbers,organizations,metadata',
    });
    return response.data.connections || [];
  }

  /**
   * Searches for contacts.
   */
  async searchContacts(query: string) {
    const client = await this.getClient();
    const response = await client.people.searchContacts({
      query,
      readMask: 'names,emailAddresses,phoneNumbers',
    });
    return response.data.results || [];
  }

  /**
   * Creates a new contact.
   */
  async createContact(contact: {
    givenName: string;
    familyName?: string;
    email?: string;
    phone?: string;
  }) {
    const client = await this.getClient();
    const response = await client.people.createContact({
      requestBody: {
        names: [{ givenName: contact.givenName, familyName: contact.familyName }],
        emailAddresses: contact.email ? [{ value: contact.email }] : [],
        phoneNumbers: contact.phone ? [{ value: contact.phone }] : [],
      },
    });
    logger.info(`[GoogleContacts] 👤 Contact created: ${contact.givenName}`);
    return response.data;
  }

  /**
   * Deletes a contact.
   */
  async deleteContact(resourceName: string) {
    const client = await this.getClient();
    await client.people.deleteContact({ resourceName });
    logger.info(`[GoogleContacts] 🗑️ Contact deleted: ${resourceName}`);
  }

  /**
   * Lists contact groups.
   */
  async listContactGroups() {
    const client = await this.getClient();
    const response = await client.contactGroups.list();
    return response.data.contactGroups || [];
  }
}
