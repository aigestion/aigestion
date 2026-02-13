import { NextFunction, Request, Response } from 'express';
import { TwoFactorService } from '../services/two-factor.service';
import { logger } from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    twoFactorEnabled?: boolean;
  };

  session?: {
    twoFactorVerified?: boolean;
    twoFactorVerifiedAt?: Date;
    [key: string]: any;
  };
}

/**
 * Middleware to enforce two-factor authentication
 */
export class TwoFactorMiddleware {
  private twoFactorService: TwoFactorService;

  constructor() {
    this.twoFactorService = new TwoFactorService();
  }

  /**
   * Check if user has 2FA enabled
   */
  public requireTwoFactor = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      const isTwoFactorEnabled = await this.twoFactorService.isTwoFactorEnabled(req.user.id);

      if (!isTwoFactorEnabled) {
        return res.status(403).json({
          success: false,
          error: 'Two-factor authentication is not enabled',
          code: 'TWO_FACTOR_NOT_ENABLED',
        });
      }

      // Check if 2FA verification has been completed in this session
      const sessionVerified = req.session?.twoFactorVerified;
      if (!sessionVerified) {
        return res.status(403).json({
          success: false,
          error: 'Two-factor authentication required',
          code: 'TWO_FACTOR_REQUIRED',
          data: {
            userId: req.user.id,
            email: req.user.email,
          },
        });
      }

      next();
    } catch (error) {
      logger.error('Error in 2FA middleware:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * Optional 2FA - proceed if 2FA is not enabled
   */
  public optionalTwoFactor = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user || !req.user.id) {
        return next();
      }

      const isTwoFactorEnabled = await this.twoFactorService.isTwoFactorEnabled(req.user.id);

      if (!isTwoFactorEnabled) {
        return next();
      }

      // Check if 2FA verification has been completed in this session
      const sessionVerified = req.session?.twoFactorVerified;
      if (!sessionVerified) {
        return res.status(403).json({
          success: false,
          error: 'Two-factor authentication required',
          code: 'TWO_FACTOR_REQUIRED',
          data: {
            userId: req.user.id,
            email: req.user.email,
          },
        });
      }

      next();
    } catch (error) {
      logger.error('Error in optional 2FA middleware:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * Verify 2FA token and mark session as verified
   */
  public verifyTwoFactor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { method, code } = req.body;
      const userId = req.user?.id;

      if (!userId || !method || !code) {
        return res.status(400).json({
          success: false,
          error: 'userId, method, and code are required',
        });
      }

      let isValid = false;

      switch (method) {
        case 'totp':
          isValid = await this.twoFactorService.verifyTOTPToken(userId, code);
          break;
        case 'backup':
          isValid = await this.twoFactorService.verifyBackupCode(userId, code);
          break;
        case 'sms':
        case 'email':
          isValid = await this.twoFactorService.verifyCode(userId, method, code);
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid method. Must be totp, backup, sms, or email',
          });
      }

      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid verification code',
          code: 'INVALID_2FA_CODE',
        });
      }

      // Mark session as 2FA verified
      if (req.session) {
        req.session.twoFactorVerified = true;
        req.session.twoFactorVerifiedAt = new Date();
      }

      logger.info('2FA verification successful', { userId, method });

      res.json({
        success: true,
        message: 'Two-factor authentication verified successfully',
      });
    } catch (error) {
      logger.error('Error verifying 2FA:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify two-factor authentication',
      });
    }
  };

  /**
   * Send 2FA verification code
   */
  public sendTwoFactorCode = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { method, destination } = req.body;
      const userId = req.user?.id;
      const userEmail = req.user?.email;

      if (!userId || !method) {
        return res.status(400).json({
          success: false,
          error: 'userId and method are required',
        });
      }

      let success = false;

      switch (method) {
        case 'sms':
          if (!destination) {
            return res.status(400).json({
              success: false,
              error: 'Phone number is required for SMS verification',
            });
          }
          success = await this.twoFactorService.sendSMSCode(userId, destination);
          break;
        case 'email':
          const email = destination || userEmail;
          if (!email) {
            return res.status(400).json({
              success: false,
              error: 'Email address is required for email verification',
            });
          }
          success = await this.twoFactorService.sendEmailCode(userId, email);
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid method. Must be sms or email',
          });
      }

      if (!success) {
        return res.status(500).json({
          success: false,
          error: 'Failed to send verification code',
        });
      }

      logger.info('2FA code sent', { userId, method, destination });

      res.json({
        success: true,
        message: 'Verification code sent successfully',
      });
    } catch (error) {
      logger.error('Error sending 2FA code:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send verification code',
      });
    }
  };

  /**
   * Clear 2FA verification from session
   */
  public clearTwoFactorVerification = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (req.session) {
        delete req.session.twoFactorVerified;
        delete req.session.twoFactorVerifiedAt;
      }

      res.json({
        success: true,
        message: 'Two-factor verification cleared',
      });
    } catch (error) {
      logger.error('Error clearing 2FA verification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear two-factor verification',
      });
    }
  };

  /**
   * Check 2FA verification status
   */
  public checkTwoFactorStatus = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const sessionVerified = req.session?.twoFactorVerified;
      const verifiedAt = req.session?.twoFactorVerifiedAt;

      res.json({
        success: true,
        data: {
          userId,
          verified: !!sessionVerified,
          verifiedAt: verifiedAt || null,
        },
      });
    } catch (error) {
      logger.error('Error checking 2FA status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check two-factor status',
      });
    }
  };
}

// Export singleton instance
export const twoFactorMiddleware = new TwoFactorMiddleware();

// Export convenience methods
export const requireTwoFactor = twoFactorMiddleware.requireTwoFactor;
export const optionalTwoFactor = twoFactorMiddleware.optionalTwoFactor;
export const verifyTwoFactor = twoFactorMiddleware.verifyTwoFactor;
export const sendTwoFactorCode = twoFactorMiddleware.sendTwoFactorCode;
export const clearTwoFactorVerification = twoFactorMiddleware.clearTwoFactorVerification;
export const checkTwoFactorStatus = twoFactorMiddleware.checkTwoFactorStatus;
