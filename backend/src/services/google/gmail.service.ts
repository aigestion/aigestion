import { google, gmail_v1 } from 'googleapis';
import { injectable } from 'inversify';
import { logger } from '../../utils/logger';
import { getCache, setCache } from '../../cache/redis';

const CACHE_TTL = 120; // 2 minutes

/**
 * GMAIL SERVICE — God Level Email Intelligence
 * Full inbox control: read, send, search, label, draft, thread analysis.
 * Designed for Gemini-powered email triage and smart replies.
 */
@injectable()
export class GmailService {
  private gmail: gmail_v1.Gmail | null = null;
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.labels',
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
          clientOptions: {
            subject: process.env.GMAIL_DELEGATED_USER, // Domain-wide delegation
          },
        });
        const authClient = await auth.getClient();
        this.gmail = google.gmail({ version: 'v1', auth: authClient as any });
        logger.info('[Gmail] ✅ Initialized via Service Account (delegated)');
        return;
      }

      logger.warn('[Gmail] No credentials found — service inactive');
    } catch (error: any) {
      logger.error(`[Gmail] Init failure: ${error.message}`);
    }
  }

  private async getClient(): Promise<gmail_v1.Gmail> {
    if (this.initPromise) await this.initPromise;
    if (!this.gmail) throw new Error('Gmail client not initialized');
    return this.gmail;
  }

  // ─────────────────────────────────────────────────────────────
  // INBOX OPERATIONS
  // ─────────────────────────────────────────────────────────────

  /**
   * Lists messages from the inbox.
   */
  async listMessages(options: {
    query?: string;
    maxResults?: number;
    labelIds?: string[];
    pageToken?: string;
  } = {}): Promise<{
    messages: Array<{ id: string; threadId: string; snippet?: string }>;
    nextPageToken?: string;
    resultSizeEstimate: number;
  }> {
    const client = await this.getClient();
    const response = await client.users.messages.list({
      userId: 'me',
      q: options.query,
      maxResults: options.maxResults || 20,
      labelIds: options.labelIds,
      pageToken: options.pageToken,
    });

    const messages = response.data.messages || [];
    return {
      messages: messages.map(m => ({ id: m.id!, threadId: m.threadId! })),
      nextPageToken: response.data.nextPageToken || undefined,
      resultSizeEstimate: response.data.resultSizeEstimate || 0,
    };
  }

  /**
   * Gets a full message with parsed headers and body.
   */
  async getMessage(messageId: string): Promise<{
    id: string;
    threadId: string;
    from: string;
    to: string;
    subject: string;
    date: string;
    snippet: string;
    body: string;
    labels: string[];
  }> {
    const client = await this.getClient();
    const response = await client.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    const msg = response.data;
    const headers = msg.payload?.headers || [];
    const getHeader = (name: string) => headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

    return {
      id: msg.id!,
      threadId: msg.threadId!,
      from: getHeader('From'),
      to: getHeader('To'),
      subject: getHeader('Subject'),
      date: getHeader('Date'),
      snippet: msg.snippet || '',
      body: this.extractBody(msg.payload),
      labels: msg.labelIds || [],
    };
  }

  /**
   * Searches messages with Gmail query syntax.
   */
  async searchMessages(query: string, maxResults = 10): Promise<Array<{
    id: string;
    threadId: string;
    from: string;
    subject: string;
    snippet: string;
    date: string;
  }>> {
    const { messages } = await this.listMessages({ query, maxResults });
    const detailed = await Promise.all(
      messages.slice(0, maxResults).map(m => this.getMessage(m.id)),
    );
    return detailed.map(m => ({
      id: m.id,
      threadId: m.threadId,
      from: m.from,
      subject: m.subject,
      snippet: m.snippet,
      date: m.date,
    }));
  }

  // ─────────────────────────────────────────────────────────────
  // SEND & DRAFT
  // ─────────────────────────────────────────────────────────────

  /**
   * Sends an email.
   */
  async sendEmail(options: {
    to: string;
    subject: string;
    body: string;
    cc?: string;
    bcc?: string;
    isHtml?: boolean;
    replyToMessageId?: string;
    threadId?: string;
  }): Promise<{ id: string; threadId: string }> {
    const client = await this.getClient();
    const contentType = options.isHtml ? 'text/html' : 'text/plain';

    let headers = [
      `To: ${options.to}`,
      `Subject: ${options.subject}`,
      `Content-Type: ${contentType}; charset=utf-8`,
    ];
    if (options.cc) headers.push(`Cc: ${options.cc}`);
    if (options.bcc) headers.push(`Bcc: ${options.bcc}`);
    if (options.replyToMessageId) {
      headers.push(`In-Reply-To: ${options.replyToMessageId}`);
      headers.push(`References: ${options.replyToMessageId}`);
    }

    const raw = Buffer.from(
      headers.join('\r\n') + '\r\n\r\n' + options.body,
    ).toString('base64url');

    const response = await client.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
        threadId: options.threadId,
      },
    });

    logger.info(`[Gmail] ✉️ Email sent to ${options.to}: ${response.data.id}`);
    return { id: response.data.id!, threadId: response.data.threadId! };
  }

  /**
   * Creates a draft email.
   */
  async createDraft(options: {
    to: string;
    subject: string;
    body: string;
    isHtml?: boolean;
  }): Promise<{ draftId: string }> {
    const client = await this.getClient();
    const contentType = options.isHtml ? 'text/html' : 'text/plain';
    const raw = Buffer.from(
      `To: ${options.to}\r\nSubject: ${options.subject}\r\nContent-Type: ${contentType}; charset=utf-8\r\n\r\n${options.body}`,
    ).toString('base64url');

    const response = await client.users.drafts.create({
      userId: 'me',
      requestBody: { message: { raw } },
    });

    logger.info(`[Gmail] 📝 Draft created: ${response.data.id}`);
    return { draftId: response.data.id! };
  }

  // ─────────────────────────────────────────────────────────────
  // LABEL MANAGEMENT
  // ─────────────────────────────────────────────────────────────

  /**
   * Lists all labels.
   */
  async listLabels(): Promise<Array<{ id: string; name: string; type: string }>> {
    const client = await this.getClient();
    const response = await client.users.labels.list({ userId: 'me' });
    return (response.data.labels || []).map(l => ({
      id: l.id!,
      name: l.name!,
      type: l.type || 'user',
    }));
  }

  /**
   * Applies labels to a message.
   */
  async applyLabels(messageId: string, labelIds: string[]): Promise<void> {
    const client = await this.getClient();
    await client.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: { addLabelIds: labelIds },
    });
    logger.info(`[Gmail] 🏷️ Labels applied to ${messageId}: ${labelIds.join(', ')}`);
  }

  /**
   * Marks a message as read.
   */
  async markAsRead(messageId: string): Promise<void> {
    const client = await this.getClient();
    await client.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: { removeLabelIds: ['UNREAD'] },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // GOD MODE — INBOX INTELLIGENCE
  // ─────────────────────────────────────────────────────────────

  /**
   * Gets inbox summary with counts by category.
   */
  async getInboxSummary(): Promise<{
    total: number;
    unread: number;
    starred: number;
    important: number;
  }> {
    const cacheKey = 'gmail:inbox_summary';
    const cached = await getCache(cacheKey);
    if (cached) return JSON.parse(cached);

    const client = await this.getClient();
    const [inbox, unread, starred, important] = await Promise.all([
      client.users.messages.list({ userId: 'me', labelIds: ['INBOX'], maxResults: 1 }),
      client.users.messages.list({ userId: 'me', labelIds: ['UNREAD'], maxResults: 1 }),
      client.users.messages.list({ userId: 'me', labelIds: ['STARRED'], maxResults: 1 }),
      client.users.messages.list({ userId: 'me', labelIds: ['IMPORTANT'], maxResults: 1 }),
    ]);

    const summary = {
      total: inbox.data.resultSizeEstimate || 0,
      unread: unread.data.resultSizeEstimate || 0,
      starred: starred.data.resultSizeEstimate || 0,
      important: important.data.resultSizeEstimate || 0,
    };

    await setCache(cacheKey, JSON.stringify(summary), CACHE_TTL);
    return summary;
  }

  // ─────────────────────────────────────────────────────────────
  // INTERNAL UTILITIES
  // ─────────────────────────────────────────────────────────────

  private extractBody(payload: any): string {
    if (!payload) return '';

    // Direct body
    if (payload.body?.data) {
      return Buffer.from(payload.body.data, 'base64').toString('utf-8');
    }

    // Multipart — prefer text/plain, fallback to text/html
    if (payload.parts) {
      const textPart = payload.parts.find((p: any) => p.mimeType === 'text/plain');
      if (textPart?.body?.data) {
        return Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
      const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html');
      if (htmlPart?.body?.data) {
        return Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
      }
      // Recursive for nested multipart
      for (const part of payload.parts) {
        const nested = this.extractBody(part);
        if (nested) return nested;
      }
    }

    return '';
  }
}
