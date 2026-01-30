import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { buildResponse } from '../common/response-builder';
import { TYPES } from '../types';
import { DevicePostureService } from '../services/device-posture.service';
import { AppError } from '../utils/errors';
import { User } from '../models/User';

@injectable()
export class DevicePostureController {
  constructor(
    @inject(TYPES.DevicePostureService)
    private devicePostureService: DevicePostureService
  ) {}

  /**
   * List trusted devices for the current user
   */
  public getMyDevices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const user = await User.findById(req.user.id).select('trustedDevices');
      if (!user) throw new AppError('User not found', 404);

      res.status(200).json(buildResponse(user.trustedDevices, 200, (req as any).requestId));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Register a new device as trusted
   */
  public registerDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const { deviceId, name, deviceInfo } = req.body;
      if (!deviceId) throw new AppError('Device ID is required', 400);

      await this.devicePostureService.registerDevice(req.user.id, {
        deviceId,
        name: name || 'New Device',
        deviceInfo: deviceInfo || {}
      });

      res.status(201).json(buildResponse({ message: 'Device registered successfully' }, 201, (req as any).requestId));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Manual posture check for a device
   */
  public verifyCurrentDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const deviceId = req.headers['x-device-id'] as string;
      if (!deviceId) throw new AppError('Device ID header (x-device-id) missing', 400);

      const check = await this.devicePostureService.verifyDevice(req.user.id, {
        deviceId,
        os: req.headers['x-os'] as string || 'unknown',
        browser: req.headers['user-agent'] || 'unknown'
      });

      res.status(200).json(buildResponse(check, 200, (req as any).requestId));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Remove a trusted device
   */
  public revokeDevice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) throw new AppError('Unauthorized', 401);

      const { deviceId } = req.params;
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { trustedDevices: { deviceId } }
      });

      res.status(200).json(buildResponse({ message: 'Device revoked' }, 200, (req as any).requestId));
    } catch (error) {
      next(error);
    }
  };
}
