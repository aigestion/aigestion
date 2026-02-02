import { google } from 'googleapis';
import { injectable } from 'inversify';

/**
 * Gmail Service
 * Integración completa con Gmail API para AIGestion
 */
@injectable()
export class GmailService {
  private gmail: any;
  private auth: any;

  async initialize() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.send'
      ]
    });
    this.gmail = google.gmail({ version: 'v1', auth: this.auth });
  }

  async getUnreadEmails(maxResults = 10) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
        maxResults
      });
      return response.data.messages || [];
    } catch (error) {
      console.error('Error fetching unread emails:', error);
      throw error;
    }
  }

  async getEmail(messageId: string) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching email:', error);
      throw error;
    }
  }

  async parseEmail(message: any) {
    try {
      const headers = message.payload.headers;
      const from = headers.find((h: any) => h.name === 'From').value;
      const subject = headers.find((h: any) => h.name === 'Subject').value;
      const body = this.decodeBody(message.payload);

      return {
        id: message.id,
        from,
        subject,
        body,
        timestamp: new Date(parseInt(message.internalDate))
      };
    } catch (error) {
      console.error('Error parsing email:', error);
      throw error;
    }
  }

  async sendEmail(to: string, subject: string, body: string) {
    try {
      const message = this.createMessage(to, subject, body);
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: message }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async labelEmail(messageId: string, labelId: string) {
    try {
      return await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          addLabelIds: [labelId]
        }
      });
    } catch (error) {
      console.error('Error labeling email:', error);
      throw error;
    }
  }

  async archiveEmail(messageId: string) {
    try {
      return await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          removeLabelIds: ['INBOX']
        }
      });
    } catch (error) {
      console.error('Error archiving email:', error);
      throw error;
    }
  }

  private decodeBody(payload: any): string {
    try {
      if (payload.parts) {
        return payload.parts
          .map((part: any) => this.decodeBody(part))
          .join('\n');
      } else if (payload.body?.data) {
        const data = payload.body.data
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        return Buffer.from(data, 'base64').toString('utf-8');
      }
      return '';
    } catch (error) {
      console.error('Error decoding body:', error);
      return '';
    }
  }

  private createMessage(to: string, subject: string, body: string): string {
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      '',
      body
    ].join('\n');

    return Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}
