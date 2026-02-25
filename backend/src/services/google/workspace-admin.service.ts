import { google } from 'googleapis';
import { injectable } from 'inversify';
import { logger } from '../../utils/logger';

/**
 * WORKSPACE ADMIN SERVICE
 * Centralized administration for Google Workspace via Admin SDK.
 * Requires Domain-Wide Delegation.
 */
@injectable()
export class WorkspaceAdminService {
  private admin: any | null = null;
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/admin.directory.user.readonly',
    'https://www.googleapis.com/auth/admin.directory.group.readonly',
    'https://www.googleapis.com/auth/admin.directory.orgunit.readonly',
  ];
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initializeClient();
  }

  private async initializeClient() {
    try {
      const keyFile =
        process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      const subject = process.env.WORKSPACE_ADMIN_EMAIL || process.env.GMAIL_DELEGATED_USER;

      if (keyFile) {
        // Use JWT client directly for more robust DWD and key handling
        const auth = new google.auth.JWT({
          keyFile: keyFile.includes('{') ? undefined : keyFile,
          key: keyFile.includes('{') ? JSON.parse(keyFile).private_key : undefined,
          email: keyFile.includes('{') ? JSON.parse(keyFile).client_email : undefined,
          scopes: this.SCOPES,
          subject: subject,
        });
        this.admin = google.admin({ version: 'directory_v1', auth });
        logger.info('[WorkspaceAdmin] ✅ Initialized via Admin SDK (JWT/DWD)');
        return;
      }
      logger.warn('[WorkspaceAdmin] No credentials found — service inactive');
    } catch (error: any) {
      logger.error(`[WorkspaceAdmin] Init failure: ${error.message}`);
    }
  }

  private async getClient(): Promise<any> {
    if (this.initPromise) await this.initPromise;
    if (!this.admin) throw new Error('Workspace Admin client not initialized');
    return this.admin;
  }

  /**
   * Audits users in the domain for security posture.
   */
  async auditUsers() {
    const client = await this.getClient();
    const response = await client.users.list({
      customer: 'my_customer',
      maxResults: 100,
      orderBy: 'email',
    });

    const users = response.data.users || [];
    logger.info(`[WorkspaceAdmin] Audited ${users.length} users.`);
    return users.map((u: any) => ({
      email: u.primaryEmail,
      isAdmin: u.isAdmin,
      isDelegatedAdmin: u.isDelegatedAdmin,
      lastLoginTime: u.lastLoginTime,
      creationTime: u.creationTime,
      agp_status: u.suspended ? 'SUSPENDED' : 'ACTIVE',
    }));
  }

  /**
   * Lists Organizational Units (OUs).
   */
  async listOrganizationalUnits() {
    const client = await this.getClient();
    const response = await client.orgunits.list({
      customerId: 'my_customer',
    });
    return response.data.organizationUnits || [];
  }

  /**
   * Checks if a user has 2FA enabled (requires specific scopes/permissions).
   */
  async checkUserSecurity(userEmail: string) {
    const client = await this.getClient();
    const response = await client.users.get({ userKey: userEmail });
    return {
      isEnrolledIn2Sv: response.data.isEnrolledIn2Sv,
      isEnforcedIn2Sv: response.data.isEnforcedIn2Sv,
    };
  }
}
