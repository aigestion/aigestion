import { Request, Response, Router } from 'express';
import { TwoFactorService } from '../services/two-factor.service';
import { logger } from '../utils/logger';

const router = Router();
const twoFactorService = new TwoFactorService();

/**
 * Two-Factor Authentication Routes
 */

// Generate TOTP secret and QR code
router.post('/totp/generate', async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        error: 'userId and email are required',
      });
    }

    const totpSetup = await twoFactorService.generateTOTPSecret(userId, email);

    res.json({
      success: true,
      data: totpSetup,
    });
  } catch (error) {
    logger.error('Error generating TOTP secret:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate TOTP secret',
    });
  }
});

// Verify TOTP token
router.post('/totp/verify', async (req: Request, res: Response) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        success: false,
        error: 'userId and token are required',
      });
    }

    const isValid = await twoFactorService.verifyTOTPToken(userId, token);

    res.json({
      success: true,
      data: { valid: isValid },
    });
  } catch (error) {
    logger.error('Error verifying TOTP token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify TOTP token',
    });
  }
});

// Verify backup code
router.post('/backup/verify', async (req: Request, res: Response) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        error: 'userId and code are required',
      });
    }

    const isValid = await twoFactorService.verifyBackupCode(userId, code);

    res.json({
      success: true,
      data: { valid: isValid },
    });
  } catch (error) {
    logger.error('Error verifying backup code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify backup code',
    });
  }
});

// Send SMS verification code
router.post('/sms/send', async (req: Request, res: Response) => {
  try {
    const { userId, phoneNumber } = req.body;

    if (!userId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'userId and phoneNumber are required',
      });
    }

    const success = await twoFactorService.sendSMSCode(userId, phoneNumber);

    res.json({
      success: true,
      data: { sent: success },
    });
  } catch (error) {
    logger.error('Error sending SMS code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send SMS code',
    });
  }
});

// Send email verification code
router.post('/email/send', async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        error: 'userId and email are required',
      });
    }

    const success = await twoFactorService.sendEmailCode(userId, email);

    res.json({
      success: true,
      data: { sent: success },
    });
  } catch (error) {
    logger.error('Error sending email code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email code',
    });
  }
});

// Verify SMS/Email code
router.post('/code/verify', async (req: Request, res: Response) => {
  try {
    const { userId, method, code } = req.body;

    if (!userId || !method || !code) {
      return res.status(400).json({
        success: false,
        error: 'userId, method, and code are required',
      });
    }

    if (!['sms', 'email'].includes(method)) {
      return res.status(400).json({
        success: false,
        error: 'method must be sms or email',
      });
    }

    const isValid = await twoFactorService.verifyCode(userId, method, code);

    res.json({
      success: true,
      data: { valid: isValid },
    });
  } catch (error) {
    logger.error('Error verifying code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify code',
    });
  }
});

// Enable 2FA for user
router.post('/enable', async (req: Request, res: Response) => {
  try {
    const { userId, method, details } = req.body;

    if (!userId || !method) {
      return res.status(400).json({
        success: false,
        error: 'userId and method are required',
      });
    }

    if (!['totp', 'sms', 'email'].includes(method)) {
      return res.status(400).json({
        success: false,
        error: 'method must be totp, sms, or email',
      });
    }

    const success = await twoFactorService.enableTwoFactor(userId, method, details);

    res.json({
      success: true,
      data: { enabled: success },
    });
  } catch (error) {
    logger.error('Error enabling 2FA:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enable 2FA',
    });
  }
});

// Disable 2FA for user
router.post('/disable', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      });
    }

    const success = await twoFactorService.disableTwoFactor(userId);

    res.json({
      success: true,
      data: { disabled: success },
    });
  } catch (error) {
    logger.error('Error disabling 2FA:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to disable 2FA',
    });
  }
});

// Check if 2FA is enabled for user
router.get('/status/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params as any;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      });
    }

    const isEnabled = await twoFactorService.isTwoFactorEnabled(userId);

    res.json({
      success: true,
      data: { enabled: isEnabled },
    });
  } catch (error) {
    logger.error('Error checking 2FA status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check 2FA status',
    });
  }
});

// Get user's 2FA settings
router.get('/settings/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params as any;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      });
    }

    const settings = await twoFactorService.getTwoFactorSettings(userId);

    if (!settings) {
      return res.status(404).json({
        success: false,
        error: '2FA settings not found',
      });
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    logger.error('Error getting 2FA settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get 2FA settings',
    });
  }
});

// Regenerate backup codes
router.post('/backup/regenerate', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
      });
    }

    const backupCodes = await twoFactorService.regenerateBackupCodes(userId);

    res.json({
      success: true,
      data: { backupCodes },
    });
  } catch (error) {
    logger.error('Error regenerating backup codes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate backup codes',
    });
  }
});

// Get 2FA statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await twoFactorService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error getting 2FA stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get 2FA stats',
    });
  }
});

// Cleanup expired codes (admin endpoint)
router.post('/cleanup', async (req: Request, res: Response) => {
  try {
    await twoFactorService.cleanupExpiredCodes();

    res.json({
      success: true,
      message: 'Expired codes cleaned up successfully',
    });
  } catch (error) {
    logger.error('Error cleaning up expired codes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup expired codes',
    });
  }
});

export default router;
