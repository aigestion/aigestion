import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { logger } from '../../utils/logger';
import { FirebaseService } from './firebase.service';

export interface Mission {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'failed';
  progress: number;
  logs: string[];
}

/**
 * AUTONOMOUS MISSION SERVICE
 * Manages long-running, background tasks orchestrated by the Swarm.
 */
@injectable()
export class AutonomousMissionService {
  private activeMissions: Map<string, Mission> = new Map();

  constructor(
    @inject(TYPES.FirebaseService) private readonly firebase: FirebaseService
  ) {}

  /**
   * Starts a new sovereign mission.
   */
  async startMission(name: string, userId: string): Promise<string> {
    const id = `mission_${Date.now()}`;
    const mission: Mission = {
      id,
      name,
      status: 'active',
      progress: 0,
      logs: [`Mission ${name} initiated by system.`]
    };

    this.activeMissions.set(id, mission);
    logger.info(`[MissionControl] New mission started: ${name} (${id})`);

    // Notify via Firebase for real-time frontend tracking
    await this.firebase.pushAlert(userId, {
        type: 'MISSION_STARTED',
        missionId: id,
        name
    });

    return id;
  }

  /**
   * Updates mission progress.
   */
  async updateMission(id: string, progress: number, log: string) {
    const mission = this.activeMissions.get(id);
    if (!mission) return;

    mission.progress = progress;
    mission.logs.push(log);
    
    if (progress >= 100) {
        mission.status = 'completed';
        logger.info(`[MissionControl] Mission ${id} COMPLETED.`);
    }

    // Sync with Firebase for the Neural Dashboard visualization
    // Placeholder for actual Firestore sync
  }

  getMissionStatus(id: string): Mission | undefined {
    return this.activeMissions.get(id);
  }
}
