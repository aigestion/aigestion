import { injectable, inject } from 'inversify';
import { IUserRepository } from '../infrastructure/repository/UserRepository';
import { TYPES } from '../types';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export interface DevicePostureData {
  deviceId: string;
  os: string;
  browser: string;
  isManaged?: boolean;
  hasSecuritySoftware?: boolean;
}

@injectable()
export class DevicePostureService {
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  /**
   * Verify if a device is trusted and compliant
   */
  async verifyDevice(
    userId: string,
    postureData: DevicePostureData,
  ): Promise<{
    isTrusted: boolean;
    isCompliant: boolean;
    reason?: string;
  }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { isTrusted: false, isCompliant: false, reason: 'User not found' };
    }

    const device = user.trustedDevices.find(d => d.deviceId === postureData.deviceId);

    if (!device) {
      return { isTrusted: false, isCompliant: false, reason: 'Device not registered' };
    }

    // Basic compliance check (extendable)
    let isCompliant = true;
    const reasons: string[] = [];

    if (postureData.isManaged === false && user.role === 'god') {
      isCompliant = false;
      reasons.push('Unmanaged device not allowed for GOD role');
    }

    // Update last check
    // Since BaseRepository.update is simple, we might need a custom method in UserRepository for array filters,
    // or use User model directly for now to unblock.
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'trustedDevices.$[elem].lastPostureCheck': new Date(),
          'trustedDevices.$[elem].isCompliant': isCompliant,
        },
      },
      {
        arrayFilters: [{ 'elem.deviceId': postureData.deviceId }],
      },
    );

    return {
      isTrusted: true,
      isCompliant,
      reason: reasons.join(', '),
    };
  }

  /**
   * Register a new trusted device for a user
   */
  async registerDevice(
    userId: string,
    deviceData: {
      deviceId: string;
      name: string;
      deviceInfo: any;
    },
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const exists = user.trustedDevices.some(d => d.deviceId === deviceData.deviceId);
    if (exists) return;

    const newDevice = {
      deviceId: deviceData.deviceId,
      name: deviceData.name,
      lastPostureCheck: new Date(),
      isCompliant: true,
      deviceInfo: deviceData.deviceInfo,
    };

    await this.userRepository.update(userId, {
      $push: { trustedDevices: newDevice },
    } as any);

    logger.info(`New device registered for user ${userId}: ${deviceData.name}`);
  }
}
