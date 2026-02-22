import { engine } from '@dcl/sdk/ecs';
import { fetchEnhancedSystemStats, runSystemDiagnostics, AlertMessage } from '../enhanced-network';
import { updateSystemStatus, updateAlert } from '../enhanced-interactables';

/**
 * TelemetryBridge synchronizes data from the network simulation to the in-world UI.
 */
export class TelemetryBridge {
  private static instance: TelemetryBridge;
  private isRunning: boolean = false;

  private constructor() {}

  public static getInstance(): TelemetryBridge {
    if (!TelemetryBridge.instance) {
      TelemetryBridge.instance = new TelemetryBridge();
    }
    return TelemetryBridge.instance;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('📡 Telemetry Bridge Starting...');

    // Main sync system
    engine.addSystem(async (dt: number) => {
      // Logic for periodic syncing is actually better handled by intervals in DCL SDK 7
      // because systems run every frame and we don't want to spam network calls.
    });

    this.initSyncIntervals();
  }

  private initSyncIntervals() {
    // Sync System Stats every 5 seconds
    setInterval(async () => {
      try {
        const stats = await fetchEnhancedSystemStats();
        updateSystemStatus(`TELEMETRY_SYNC_${Date.now()}`, stats.systemHealth === 'OPTIMAL');
        
        if (stats.quantumCoreStatus === 'OVERLOAD') {
          updateAlert('CRITICAL: QUANTUM CORE OVERLOAD', 'CRITICAL');
        }
      } catch (err) {
        console.error('Telemetry Sync Error:', err);
      }
    }, 5000);

    // Sync Diagnostics every 15 seconds
    setInterval(async () => {
      try {
        const diag = await runSystemDiagnostics();
        if (diag.overall !== 'HEALTHY') {
          updateAlert(`System Warning: ${diag.overall}`, 'WARNING');
        }
      } catch (err) {
        console.error('Diagnostic Sync Error:', err);
      }
    }, 15000);
  }
}

export const telemetryBridge = TelemetryBridge.getInstance();
