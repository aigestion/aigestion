import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { RagService } from './rag.service';
import { JulesGem } from './gems/JulesGem';
import { logger } from '../utils/logger';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

@injectable()
export class SovereignCodeRepairService {
  constructor(
    @inject(TYPES.RagService) private readonly rag: RagService,
    @inject(JulesGem) private readonly jules: JulesGem,
  ) {
    logger.info('🛠️  SovereignCodeRepairService (Auto-Patch Engine) online');
  }

  /**
   * Main entry point for autonomous code repair
   */
  public async conductAutomatedRepair(incident: {
    diagnosis: string;
    logs: string;
    targetComponent?: string;
  }): Promise<{ success: boolean; fixDetails?: string; error?: string }> {
    logger.warn('[CodeRepair] Initiating automated code repair mission...');

    try {
      // 1. Context Discovery: Find the relevant file/code using RAG
      const searchBox = incident.targetComponent || incident.diagnosis;
      logger.info(`[CodeRepair] Searching for context: ${searchBox}`);
      const context = await this.rag.getProjectContext(searchBox);

      if (!context || context.length < 50) {
        throw new Error('Insufficient context found via RAG to proceed with safe patching.');
      }

      // 2. AI Fix Generation: Use JulesGem to propose the fix
      logger.info('[CodeRepair] Dispatching Jules for code surgery...');
      const repairProposal = await this.jules.ask(
        `INCIDENTE DETECTADO:\n${incident.diagnosis}\n\nLOGS:\n${incident.logs}\n\nCONTEXTO DE CÓDIGO:\n${context}\n\n` +
        `TU TAREA: Proporciona un parche (diff o código completo del archivo) que resuelva el problema siguiendo los estándares de Google.\n` +
        `RESPONDE EN JSON:\n{\n "filePath": "path/to/file.ts",\n "originalCode": "string",\n "fixedCode": "string",\n "explanation": "string"\n}`,
        { temperature: 0.1 }
      );

      const cleanJson = repairProposal.replace(/```json|```/g, '').trim();
      const patch = JSON.parse(cleanJson);

      // 3. Safety Check: Verify file path is within project
      const fullPath = path.resolve(process.cwd(), patch.filePath);
      if (!fullPath.startsWith(process.cwd())) {
        throw new Error('Path traversal attempt detected in AI proposal!');
      }

      // 4. Apply Fix (Sovereign Application)
      logger.warn(`[CodeRepair] Applying patch to ${patch.filePath}...`);
      await this.applyPatchSafely(fullPath, patch.fixedCode);

      // 5. Verification: Build check
      logger.info('[CodeRepair] Verifying stability (npm run build)...');
      const verification = await this.verifyBuild();

      if (!verification) {
        logger.error('[CodeRepair] Build FAILED after patch. Rolling back...');
        await this.applyPatchSafely(fullPath, patch.originalCode); // Rollback
        return { success: false, error: 'Build verification failed. Changes reverted.' };
      }

      logger.info('[CodeRepair] 🏆 Autonomous repair successful and verified.');
      return { 
        success: true, 
        fixDetails: `Patched ${patch.filePath}: ${patch.explanation}` 
      };

    } catch (error: any) {
      logger.error('[CodeRepair] Mission failure:', error);
      return { success: false, error: error.message };
    }
  }

  private async applyPatchSafely(filePath: string, content: string): Promise<void> {
    // Create backup
    const backupPath = `${filePath}.bak_${Date.now()}`;
    try {
      await fs.copyFile(filePath, backupPath);
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (err) {
      logger.error(`[CodeRepair] Failed to write file ${filePath}:`, err);
      throw err;
    }
  }

  private async verifyBuild(): Promise<boolean> {
    try {
      // Running a fast check - specifically common for TypeScript projects
      // In a real monorepo this would be more targeted
      await execAsync('npx tsc --noEmit', { timeout: 60000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}
