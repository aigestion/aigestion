import { engine } from '@dcl/sdk/ecs';
import {
  fetchEnhancedSystemStats,
  runSystemDiagnostics,
  EnhancedSystemStats,
} from '../enhanced-network';
import { updateSystemStatus, updateAlert } from '../enhanced-interactables';

/**
 * TelemetryBridge (Phase 7) — synchronizes data from the network simulation to the in-world UI.
 * Uses engine.addSystem delta-time accumulation instead of setInterval for DCL SDK 7 compliance.
 */
export class TelemetryBridge {
  private static instance: TelemetryBridge;
  private isRunning: boolean = false;

  // Tick accumulators
  private statTimer = 0;
  private diagTimer = 0;
  private readonly STAT_INTERVAL = 5; // seconds
  private readonly DIAG_INTERVAL = 15; // seconds

  // Latest snapshot
  private _latestStats: EnhancedSystemStats | null = null;

  // Downstream listeners (e.g. Daniela NPC react to live data)
  private _listeners: Array<(stats: EnhancedSystemStats) => void> = [];

  private constructor() {}

  public static getInstance(): TelemetryBridge {
    if (!TelemetryBridge.instance) {
      TelemetryBridge.instance = new TelemetryBridge();
    }
    return TelemetryBridge.instance;
  }

  /** Latest fetched stats (null before first tick). */
  get latestStats(): EnhancedSystemStats | null {
    return this._latestStats;
  }

  /** Subscribe to every stats update. */
  public onStats(fn: (stats: EnhancedSystemStats) => void) {
    this._listeners.push(fn);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('📡 TelemetryBridge starting (Phase 7)…');

    // Sync system: accumulate delta time and fire async fetches on schedule
    engine.addSystem((dt: number) => {
      this.statTimer += dt;
      this.diagTimer += dt;

      if (this.statTimer >= this.STAT_INTERVAL) {
        this.statTimer = 0;
        this._syncStats();
      }

      if (this.diagTimer >= this.DIAG_INTERVAL) {
        this.diagTimer = 0;
        this._syncDiagnostics();
      }
    });
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private _syncStats() {
    fetchEnhancedSystemStats()
      .then(stats => {
        this._latestStats = stats;

        const isHealthy = stats.systemHealth === 'OPTIMAL';
        const label = `NEXUS [${stats.activeUsers} usr | ${stats.networkLatency}ms | CPU ${stats.cpuLoad}%]`;
        updateSystemStatus(label, isHealthy);

        if (stats.quantumCoreStatus === 'OVERLOAD') {
          updateAlert('CRITICAL: QUANTUM CORE OVERLOAD', 'CRITICAL');
        } else if (stats.systemHealth === 'WARNING') {
          updateAlert(`System health degraded — CPU ${stats.cpuLoad}%`, 'WARNING');
        } else if (stats.systemHealth === 'OPTIMAL') {
          updateAlert('All systems nominal ✅', 'INFO');
        }

        // Notify downstream (Daniela NPC, Neural Map, etc.)
        for (const fn of this._listeners) {
          fn(stats);
        }
      })
      .catch(err => console.error('[TelemetryBridge] Stats sync error:', err));
  }

  private _syncDiagnostics() {
    runSystemDiagnostics()
      .then(diag => {
        if (diag.overall !== 'HEALTHY') {
          const worstComponent = Object.entries(diag.components).find(([, v]) => v === 'FAIL');
          const msg = worstComponent
            ? `${worstComponent[0].toUpperCase()} FAIL`
            : `Diagnostics: ${diag.overall}`;
          updateAlert(msg, diag.overall === 'CRITICAL' ? 'CRITICAL' : 'WARNING');
        }
      })
      .catch(err => console.error('[TelemetryBridge] Diagnostics sync error:', err));
  }
}

export const telemetryBridge = TelemetryBridge.getInstance();
