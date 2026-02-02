import crypto from 'crypto';
import { injectable } from 'inversify';
import type { RedisClientType } from 'redis';
import qrcode from 'qrcode';
import { authenticator } from 'otplib';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';

interface TOTPSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  manualEntryKey: string;
}

interface TwoFactorVerification {
  userId: string;
  method: 'totp' | 'sms' | 'email' | 'backup';
  code: string;
  expiresAt: Date;
  attempts: number;
}

interface BackupCode {
  code: string;
  used: boolean;
  usedAt?: Date;
  createdAt: Date;
}

@injectable()
export class TwoFactorService {
  private readonly redis: RedisClientType;
  private readonly codeExpiry = 5 * 60 * 1000; // 5 minutes
  private readonly maxAttempts = 3;
  private readonly backupCodeCount = 10;

  constructor() {
    this.redis = getRedisClient();
  }

  /**
   * Generate TOTP secret and QR code for user
   */
  public async generateTOTPSecret(userId: string, email: string): Promise<TOTPSetup> {
    try {
      // Generate secret
      const secret = authenticator.generateSecret();
      const otpauthUrl = authenticator.keyuri(email, 'AIGestion NEXUS V1', secret);

      // Generate QR code
      const qrCodeUrl = await this.generateQrCode(otpauthUrl);

      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      // Store in Redis
      await this.redis.setEx(
        `2fa:totp:${userId}`,
        24 * 60 * 60, // 24 hours
        JSON.stringify({
          secret: secret,
          backupCodes: backupCodes.map(code => ({
            code,
            used: false,
            createdAt: new Date(),
          })),
        }),
      );

      logger.info('TOTP secret generated', { userId, email });

      return {
        secret: secret,
        qrCode: qrCodeUrl,
        backupCodes,
        manualEntryKey: secret,
      };
    } catch (error) {
      logger.error('Error generating TOTP secret:', { userId, error });
      throw new Error('Failed to generate TOTP secret');
    }
  }

  /**
   * Generate QR code from an otpauth URL
   */
  public async generateQrCode(otpauthUrl: string): Promise<string> {
    return qrcode.toDataURL(otpauthUrl);
  }

  /**
   * Verify token against secret (stateless)
   */
  public verifyToken(secret: string, token: string): boolean {
    try {
      return authenticator.check(token, secret);
    } catch (error) {
      logger.error('Error verifying token:', error);
      return false;
    }
  }

  /**
   * Verify TOTP token
   */
  public async verifyTOTPToken(userId: string, token: string): Promise<boolean> {
    try {
      const storedData = await this.redis.get(`2fa:totp:${userId}`);
      if (!storedData) {
        return false;
      }

      const { secret } = JSON.parse(storedData);

      const verified = authenticator.check(token, secret);

      if (verified) {
        logger.info('TOTP token verified successfully', { userId });
      } else {
        logger.warn('TOTP token verification failed', { userId });
      }

      return verified;
    } catch (error) {
      logger.error('Error verifying TOTP token:', { userId, error });
      return false;
    }
  }

  /**
   * Verify backup code
   */
  public async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    try {
      const storedData = await this.redis.get(`2fa:totp:${userId}`);
      if (!storedData) {
        return false;
      }

      const { backupCodes } = JSON.parse(storedData);

      // Find matching unused backup code
      const backupCode = backupCodes.find((bc: BackupCode) => bc.code === code && !bc.used);

      if (!backupCode) {
        logger.warn('Invalid or already used backup code', { userId });
        return false;
      }

      // Mark backup code as used
      backupCode.used = true;
      backupCode.usedAt = new Date();

      // Update stored data
      await this.redis.setEx(
        `2fa:totp:${userId}`,
        24 * 60 * 60,
        JSON.stringify({
          secret: JSON.parse(storedData).secret,
          backupCodes,
        }),
      );

      logger.info('Backup code used successfully', { userId });
      return true;
    } catch (error) {
      logger.error('Error verifying backup code:', { userId, error });
      return false;
    }
  }

  /**
   * Send SMS verification code
   */
  public async sendSMSCode(userId: string, phoneNumber: string): Promise<boolean> {
    try {
      const code = this.generateVerificationCode();

      // Store verification data
      const verificationData: TwoFactorVerification = {
        userId,
        method: 'sms',
        code,
        expiresAt: new Date(Date.now() + this.codeExpiry),
        attempts: 0,
      };

      await this.redis.setEx(
        `2fa:sms:${userId}`,
        this.codeExpiry / 1000,
        JSON.stringify(verificationData),
      );

      // Send SMS (integrate with your SMS service)
      const success = await this.sendSMS(phoneNumber, code);

      if (success) {
        logger.info('SMS verification code sent', { userId, phoneNumber });
      } else {
        logger.error('Failed to send SMS verification code', { userId, phoneNumber });
      }

      return success;
    } catch (error) {
      logger.error('Error sending SMS code:', { userId, error });
      return false;
    }
  }

  /**
   * Send email verification code
   */
  public async sendEmailCode(userId: string, email: string): Promise<boolean> {
    try {
      const code = this.generateVerificationCode();

      // Store verification data
      const verificationData: TwoFactorVerification = {
        userId,
        method: 'email',
        code,
        expiresAt: new Date(Date.now() + this.codeExpiry),
        attempts: 0,
      };

      await this.redis.setEx(
        `2fa:email:${userId}`,
        this.codeExpiry / 1000,
        JSON.stringify(verificationData),
      );

      // Send email (integrate with your email service)
      const success = await this.sendEmail(email, code);

      if (success) {
        logger.info('Email verification code sent', { userId, email });
      } else {
        logger.error('Failed to send email verification code', { userId, email });
      }

      return success;
    } catch (error) {
      logger.error('Error sending email code:', { userId, error });
      return false;
    }
  }

  /**
   * Verify SMS/Email code
   */
  public async verifyCode(userId: string, method: 'sms' | 'email', code: string): Promise<boolean> {
    try {
      const key = `2fa:${method}:${userId}`;
      const storedData = await this.redis.get(key);

      if (!storedData) {
        return false;
      }

      const verificationData: TwoFactorVerification = JSON.parse(storedData);

      // Check if expired
      if (new Date() > verificationData.expiresAt) {
        await this.redis.del(key);
        return false;
      }

      // Check attempts
      if (verificationData.attempts >= this.maxAttempts) {
        await this.redis.del(key);
        logger.warn('Too many verification attempts', { userId, method });
        return false;
      }

      // Verify code
      const isValid = verificationData.code === code;

      if (!isValid) {
        verificationData.attempts++;
        await this.redis.setEx(
          key,
          Math.ceil((verificationData.expiresAt.getTime() - Date.now()) / 1000),
          JSON.stringify(verificationData),
        );

        logger.warn('Invalid verification code', {
          userId,
          method,
          attempts: verificationData.attempts,
        });
        return false;
      }

      // Remove verification data after successful verification
      await this.redis.del(key);

      logger.info('Verification code verified successfully', { userId, method });
      return true;
    } catch (error) {
      logger.error('Error verifying code:', { userId, method, error });
      return false;
    }
  }

  /**
   * Enable 2FA for user
   */
  public async enableTwoFactor(
    userId: string,
    method: 'totp' | 'sms' | 'email',
    details?: any,
  ): Promise<boolean> {
    try {
      const twoFactorData = {
        enabled: true,
        method,
        details: details || {},
        enabledAt: new Date(),
        lastUsed: new Date(),
      };

      await this.redis.setEx(
        `2fa:user:${userId}`,
        365 * 24 * 60 * 60, // 1 year
        JSON.stringify(twoFactorData),
      );

      logger.info('2FA enabled for user', { userId, method });
      return true;
    } catch (error) {
      logger.error('Error enabling 2FA:', { userId, method, error });
      return false;
    }
  }

  /**
   * Disable 2FA for user
   */
  public async disableTwoFactor(userId: string): Promise<boolean> {
    try {
      await this.redis.del(`2fa:user:${userId}`);
      await this.redis.del(`2fa:totp:${userId}`);

      logger.info('2FA disabled for user', { userId });
      return true;
    } catch (error) {
      logger.error('Error disabling 2FA:', { userId, error });
      return false;
    }
  }

  /**
   * Check if 2FA is enabled for user
   */
  public async isTwoFactorEnabled(userId: string): Promise<boolean> {
    try {
      const data = await this.redis.get(`2fa:user:${userId}`);
      return data ? JSON.parse(data).enabled : false;
    } catch (error) {
      logger.error('Error checking 2FA status:', { userId, error });
      return false;
    }
  }

  /**
   * Get user's 2FA settings
   */
  public async getTwoFactorSettings(userId: string): Promise<any> {
    try {
      const userData = await this.redis.get(`2fa:user:${userId}`);
      const totpData = await this.redis.get(`2fa:totp:${userId}`);

      if (!userData) {
        return null;
      }

      const userSettings = JSON.parse(userData);

      if (totpData && userSettings.method === 'totp') {
        const { backupCodes } = JSON.parse(totpData);
        userSettings.backupCodes = backupCodes.filter((bc: BackupCode) => !bc.used).length;
      }

      return userSettings;
    } catch (error) {
      logger.error('Error getting 2FA settings:', { userId, error });
      return null;
    }
  }

  /**
   * Regenerate backup codes
   */
  public async regenerateBackupCodes(userId: string): Promise<string[]> {
    try {
      const storedData = await this.redis.get(`2fa:totp:${userId}`);
      if (!storedData) {
        throw new Error('TOTP not set up for user');
      }

      const { secret } = JSON.parse(storedData);
      const newBackupCodes = this.generateBackupCodes();

      // Update stored data
      await this.redis.setEx(
        `2fa:totp:${userId}`,
        24 * 60 * 60,
        JSON.stringify({
          secret,
          backupCodes: newBackupCodes.map(code => ({
            code,
            used: false,
            createdAt: new Date(),
          })),
        }),
      );

      logger.info('Backup codes regenerated', { userId });
      return newBackupCodes;
    } catch (error) {
      logger.error('Error regenerating backup codes:', { userId, error });
      throw error;
    }
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < this.backupCodeCount; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  /**
   * Generate verification code
   */
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send SMS (placeholder - integrate with your SMS service)
   */
  private async sendSMS(phoneNumber: string, code: string): Promise<boolean> {
    try {
      // Integrate with your SMS service (Twilio, AWS SNS, etc.)
      // For now, just log the code
      logger.info('SMS code (for development):', { phoneNumber, code });

      // Example with Twilio:
      /*
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      await client.messages.create({
        body: `Your AIGestion verification code is: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      */

      return true;
    } catch (error) {
      logger.error('Error sending SMS:', { phoneNumber, error });
      return false;
    }
  }

  /**
   * Send email (placeholder - integrate with your email service)
   */
  private async sendEmail(email: string, code: string): Promise<boolean> {
    try {
      // Integrate with your email service (Nodemailer, SendGrid, etc.)
      // For now, just log the code
      logger.info('Email code (for development):', { email, code });

      // Example with Nodemailer:
      /*
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'AIGestion Verification Code',
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <strong>${code}</strong></p>`
      });
      */

      return true;
    } catch (error) {
      logger.error('Error sending email:', { email, error });
      return false;
    }
  }

  /**
   * Cleanup expired verification codes
   */
  public async cleanupExpiredCodes(): Promise<void> {
    try {
      const smsKeys = await this.redis.keys('2fa:sms:*');
      const emailKeys = await this.redis.keys('2fa:email:*');

      for (const key of [...smsKeys, ...emailKeys]) {
        const data = await this.redis.get(key);
        if (data) {
          const verificationData: TwoFactorVerification = JSON.parse(data);
          if (new Date() > verificationData.expiresAt) {
            await this.redis.del(key);
          }
        }
      }

      logger.info('Expired verification codes cleaned up');
    } catch (error) {
      logger.error('Error cleaning up expired codes:', error);
    }
  }

  /**
   * Get 2FA statistics
   */
  public async getStats(): Promise<{
    totalUsers: number;
    enabledUsers: number;
    methodDistribution: { [key: string]: number };
    recentVerifications: number;
  }> {
    try {
      const userKeys = await this.redis.keys('2fa:user:*');
      const totalUsers = userKeys.length;

      let enabledUsers = 0;
      const methodDistribution: { [key: string]: number } = {};

      for (const key of userKeys) {
        const data = await this.redis.get(key);
        if (data) {
          const settings = JSON.parse(data);
          if (settings.enabled) {
            enabledUsers++;
            methodDistribution[settings.method] = (methodDistribution[settings.method] || 0) + 1;
          }
        }
      }

      // Count recent verifications (last hour)
      const recentKeys = await this.redis.keys('2fa:*');
      const recentVerifications = recentKeys.filter(
        key => key.includes('sms:') || key.includes('email:'),
      ).length;

      return {
        totalUsers,
        enabledUsers,
        methodDistribution,
        recentVerifications,
      };
    } catch (error) {
      logger.error('Error getting 2FA stats:', error);
      return {
        totalUsers: 0,
        enabledUsers: 0,
        methodDistribution: {},
        recentVerifications: 0,
      };
    }
  }
}
