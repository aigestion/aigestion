import { injectable } from 'inversify';
import { logger } from '../utils/logger';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface MetaverseEvent {
  id: string;
  title: string;
  type: 'meeting' | 'event' | 'tour';
  startTime: string;
  attendees: number;
}

@injectable()
export class MetaverseService {
  private readonly parcelCoordinates: string = '-51,114';

  /**
   * Manages virtual office presence and event scheduling.
   */
  async getStatus(): Promise<any> {
    try {
      logger.info('[MetaverseService] Checking virtual office status...');

      const activeEvents: MetaverseEvent[] = [
        {
          id: '1',
          title: 'Daily Sync - virtual',
          type: 'meeting',
          startTime: new Date().toISOString(),
          attendees: 5,
        },
      ];

      return {
        offline: false,
        coordinates: this.parcelCoordinates,
        parcelOwner: 'AIGestion Nexus',
        activeEvents,
        metaverse: 'Decentraland',
        visitUrl: `https://play.decentraland.org/?position=${this.parcelCoordinates}`,
      };
    } catch (error) {
      logger.error('[MetaverseService] Failed to get status:', error);
      throw error;
    }
  }

  /**
   * Schedules a new event in the virtual office.
   */
  async scheduleEvent(event: Omit<MetaverseEvent, 'id'>): Promise<string> {
    logger.info(`[MetaverseService] Scheduling event: ${event.title}`);
    return Math.random().toString(36).substring(2, 11);
  }

  /**
   * Triggers a request for a new 3D asset generation via the Forge Orchestrator.
   */
  async requestObjectForge(id: string, name: string, description: string): Promise<boolean> {
    try {
      logger.warn({ id, name }, '[MetaverseService] 🚀 Triggering 3D Forge Request');

      const requestDir = path.join(process.cwd(), 'models', 'forge_requests');
      await fs.mkdir(requestDir, { recursive: true });

      const requestPath = path.join(requestDir, `${id}.json`);
      const requestData = {
        id,
        name,
        description,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      await fs.writeFile(requestPath, JSON.stringify(requestData, null, 2));
      logger.info(`[MetaverseService] ✅ Forge Request saved: ${requestPath}`);

      return true;
    } catch (error) {
      logger.error('[MetaverseService] ❌ Failed to create Forge Request:', error);
      return false;
    }
  }

  /**
   * Executes the Forge Orchestrator script for a specific task.
   */
  async executeForgeTask(id: string): Promise<{ success: boolean; output: string }> {
    try {
      logger.info({ id }, '[MetaverseService] 🛠️ Executing 3D Forge Orchestrator...');

      const scriptPath = path.join(process.cwd(), '..', 'scripts', 'forge_v2_orchestrator.py');
      const venvPath = path.join(process.cwd(), '..', '.venv', 'Scripts', 'python.exe');

      // Command: .venv/Scripts/python.exe scripts/forge_v2_orchestrator.py --id <id>
      const { stdout, stderr } = await execAsync(`"${venvPath}" "${scriptPath}" --id ${id}`, {
        cwd: path.join(process.cwd(), '..'),
      });

      if (stderr && !stdout) {
        logger.error({ stderr }, '[MetaverseService] ❌ Forge Orchestrator failed');
        return { success: false, output: stderr };
      }

      logger.info({ stdout }, '[MetaverseService] ✨ Forge Orchestrator completed');
      return { success: true, output: stdout };
    } catch (error: any) {
      logger.error({ error: error.message }, '[MetaverseService] ❌ Forge Execution Error');
      return { success: false, output: error.message };
    }
  }
}
