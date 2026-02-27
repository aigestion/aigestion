import { injectable, inject } from 'inversify';
import { Mission } from '../models/Mission';
import { SocketService } from './socket.service';
import { TYPES } from '../types';
import { logger } from '../utils/logger';

@injectable()
export class MissionWatcherService {
  constructor(@inject(TYPES.SocketService) private readonly socketService: SocketService) {}

  /**
   * 📡 Start watching Mission collection changes
   */
  public initWatcher(): void {
    logger.info('[MissionWatcherService] Initializing MongoDB Change Stream for Missions...');

    const changeStream = Mission.watch();

    changeStream.on('change', change => {
      try {
        if (change.operationType === 'insert') {
          const mission = change.fullDocument;
          this.socketService.emitToUser(mission.userId, 'mission:created', mission);
          logger.debug({ missionId: mission._id }, '[MissionWatcher] New mission detected');
        }

        if (change.operationType === 'update') {
          const missionId = change.documentKey._id.toString();
          const updatedFields = change.updateDescription.updatedFields;

          // Notify the mission room for granular updates
          this.socketService.emitMissionUpdate(missionId, {
            id: missionId,
            ...updatedFields,
          });

          logger.debug({ missionId }, '[MissionWatcher] Mission updated');
        }
      } catch (err) {
        logger.error(err, '[MissionWatcherService] Error processing change stream');
      }
    });

    changeStream.on('error', err => {
      logger.error(err, '[MissionWatcherService] Change Stream CRITICAL ERROR');
      // Potential reconnection logic here if needed, but Mongoose usually handles it
    });
  }
}
