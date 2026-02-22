import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { logger } from '../../utils/logger';
import { NeuralHomeBridge } from '../google/neural-home.service';

/**
 * 📱 PIXEL SENSOR SERVICE
 * Receives, caches, and analyzes sensor data from the Pixel 8 via HA Companion App.
 * Bridges physical-world telemetry into the Nexus Intelligence layer.
 */

export interface PixelSensorSnapshot {
  // Core identifiers
  deviceId: string;
  timestamp: string;

  // Location
  latitude?: number;
  longitude?: number;
  locationAccuracy?: number;
  geocodedLocation?: string;
  zone?: string; // 'home' | 'office' | 'away'

  // Battery
  batteryLevel?: number;
  batteryState?: 'charging' | 'discharging' | 'full' | 'not_charging';
  batteryTemperature?: number;

  // Activity & Motion
  detectedActivity?: 'still' | 'walking' | 'running' | 'in_vehicle' | 'on_bicycle' | 'unknown';
  stepCount?: number;

  // Connectivity
  wifiConnection?: string;
  wifiSignalStrength?: number;
  bluetoothDevices?: string[];

  // Device State
  ringerMode?: 'normal' | 'vibrate' | 'silent';
  screenOn?: boolean;
  lightLevel?: number; // lux
  lastUsedApp?: string;
  phoneState?: 'idle' | 'ringing' | 'offhook';

  // Storage
  internalStorageFree?: number; // MB
  internalStorageTotal?: number; // MB
}

export interface PixelContextLevel {
  level: 'idle' | 'active' | 'focused' | 'mobile' | 'resting';
  confidence: number;
  zone: string;
  summary: string;
}

export interface SensorTransition {
  type: string;
  from: string;
  to: string;
  timestamp: string;
  significance: 'low' | 'medium' | 'high';
}

@injectable()
export class PixelSensorService {
  private currentSnapshot: PixelSensorSnapshot | null = null;
  private previousSnapshot: PixelSensorSnapshot | null = null;
  private snapshotHistory: PixelSensorSnapshot[] = [];
  private readonly MAX_HISTORY = 1440; // 24h at 1 snapshot/min

  constructor(
    @inject(TYPES.NeuralHomeBridge) private homeBridge: NeuralHomeBridge,
  ) {
    logger.info('[PixelSensor] 📱 Sovereign Pixel Sensor Service initialized');
  }

  /**
   * Receives a new sensor snapshot from the Pixel 8.
   * Detects transitions and ingests significant events into RAG.
   */
  async ingestSnapshot(snapshot: PixelSensorSnapshot): Promise<{
    ingested: boolean;
    contextLevel: PixelContextLevel;
    transitions: SensorTransition[];
  }> {
    this.previousSnapshot = this.currentSnapshot;
    this.currentSnapshot = {
      ...snapshot,
      timestamp: snapshot.timestamp || new Date().toISOString(),
    };

    // Store in history (ring buffer)
    this.snapshotHistory.push(this.currentSnapshot);
    if (this.snapshotHistory.length > this.MAX_HISTORY) {
      this.snapshotHistory.shift();
    }

    // Detect transitions
    const transitions = this.detectTransitions();

    // Calculate context level
    const contextLevel = this.calculateContextLevel(this.currentSnapshot);

    // Ingest significant transitions to RAG
    for (const transition of transitions) {
      if (transition.significance === 'high') {
        await this.homeBridge.ingestIoTEvent(
          `pixel_transition_${transition.type}`,
          'pixel_sensor',
          {
            ...transition,
            contextLevel: contextLevel.level,
            snapshot: this.sanitizeForLog(this.currentSnapshot),
          },
        );
      }
    }

    logger.info(
      {
        context: contextLevel.level,
        zone: contextLevel.zone,
        transitions: transitions.length,
      },
      '[PixelSensor] Snapshot ingested',
    );

    return { ingested: true, contextLevel, transitions };
  }

  /**
   * Returns the latest sensor snapshot (for HA REST sensor pull).
   */
  getLatestSnapshot(): {
    snapshot: PixelSensorSnapshot | null;
    context_level: string;
    zone: string;
    summary: string;
  } {
    if (!this.currentSnapshot) {
      return {
        snapshot: null,
        context_level: 'unknown',
        zone: 'unknown',
        summary: 'No sensor data received yet',
      };
    }

    const context = this.calculateContextLevel(this.currentSnapshot);
    return {
      snapshot: this.currentSnapshot,
      context_level: context.level,
      zone: context.zone,
      summary: context.summary,
    };
  }

  /**
   * Returns sensor history for the last N minutes.
   */
  getHistory(minutes: number = 60): PixelSensorSnapshot[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000).toISOString();
    return this.snapshotHistory.filter((s) => s.timestamp >= cutoff);
  }

  /**
   * Gets daily stats summary.
   */
  getDailyStats(): {
    totalSteps: number;
    zonesVisited: string[];
    averageBattery: number;
    dominantActivity: string;
    screenOnTime: number; // count of readings where screen was on
    totalReadings: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const todaySnapshots = this.snapshotHistory.filter((s) =>
      s.timestamp.startsWith(today),
    );

    if (todaySnapshots.length === 0) {
      return {
        totalSteps: 0,
        zonesVisited: [],
        averageBattery: 0,
        dominantActivity: 'unknown',
        screenOnTime: 0,
        totalReadings: 0,
      };
    }

    // Steps: take max (it's cumulative)
    const stepCounts = todaySnapshots
      .map((s) => s.stepCount || 0)
      .filter((v) => v > 0);
    const totalSteps = stepCounts.length > 0 ? Math.max(...stepCounts) : 0;

    // Zones
    const zones = new Set(todaySnapshots.map((s) => s.zone).filter(Boolean));

    // Battery average
    const batteryLevels = todaySnapshots
      .map((s) => s.batteryLevel)
      .filter((v): v is number => v !== undefined);
    const averageBattery =
      batteryLevels.length > 0
        ? batteryLevels.reduce((a, b) => a + b, 0) / batteryLevels.length
        : 0;

    // Dominant activity
    const activityCounts: Record<string, number> = {};
    todaySnapshots.forEach((s) => {
      const act = s.detectedActivity || 'unknown';
      activityCounts[act] = (activityCounts[act] || 0) + 1;
    });
    const dominantActivity = Object.entries(activityCounts).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0] || 'unknown';

    // Screen on
    const screenOnTime = todaySnapshots.filter((s) => s.screenOn).length;

    return {
      totalSteps,
      zonesVisited: Array.from(zones) as string[],
      averageBattery: Math.round(averageBattery),
      dominantActivity,
      screenOnTime,
      totalReadings: todaySnapshots.length,
    };
  }

  /**
   * Detects state transitions between current and previous snapshots.
   */
  private detectTransitions(): SensorTransition[] {
    if (!this.previousSnapshot || !this.currentSnapshot) return [];

    const transitions: SensorTransition[] = [];
    const now = this.currentSnapshot.timestamp;

    // Zone transition (arrived/left)
    if (
      this.previousSnapshot.zone !== this.currentSnapshot.zone &&
      this.currentSnapshot.zone
    ) {
      transitions.push({
        type: 'zone_change',
        from: this.previousSnapshot.zone || 'unknown',
        to: this.currentSnapshot.zone,
        timestamp: now,
        significance: 'high',
      });
    }

    // Activity transition
    if (
      this.previousSnapshot.detectedActivity !==
        this.currentSnapshot.detectedActivity &&
      this.currentSnapshot.detectedActivity
    ) {
      transitions.push({
        type: 'activity_change',
        from: this.previousSnapshot.detectedActivity || 'unknown',
        to: this.currentSnapshot.detectedActivity,
        timestamp: now,
        significance:
          this.currentSnapshot.detectedActivity === 'in_vehicle'
            ? 'high'
            : 'medium',
      });
    }

    // Battery critical
    if (
      this.currentSnapshot.batteryLevel !== undefined &&
      this.currentSnapshot.batteryLevel <= 15 &&
      (this.previousSnapshot.batteryLevel === undefined ||
        this.previousSnapshot.batteryLevel > 15)
    ) {
      transitions.push({
        type: 'battery_critical',
        from: String(this.previousSnapshot.batteryLevel || '?'),
        to: String(this.currentSnapshot.batteryLevel),
        timestamp: now,
        significance: 'high',
      });
    }

    // Charging state change
    if (
      this.previousSnapshot.batteryState !== this.currentSnapshot.batteryState &&
      this.currentSnapshot.batteryState
    ) {
      transitions.push({
        type: 'charging_change',
        from: this.previousSnapshot.batteryState || 'unknown',
        to: this.currentSnapshot.batteryState,
        timestamp: now,
        significance: 'medium',
      });
    }

    // WiFi change (network switch)
    if (
      this.previousSnapshot.wifiConnection !==
        this.currentSnapshot.wifiConnection &&
      this.currentSnapshot.wifiConnection
    ) {
      transitions.push({
        type: 'wifi_change',
        from: this.previousSnapshot.wifiConnection || 'disconnected',
        to: this.currentSnapshot.wifiConnection,
        timestamp: now,
        significance: 'medium',
      });
    }

    // Screen state change
    if (
      this.previousSnapshot.screenOn !== this.currentSnapshot.screenOn &&
      this.currentSnapshot.screenOn !== undefined
    ) {
      transitions.push({
        type: 'screen_change',
        from: this.previousSnapshot.screenOn ? 'on' : 'off',
        to: this.currentSnapshot.screenOn ? 'on' : 'off',
        timestamp: now,
        significance: 'low',
      });
    }

    // Phone state change (call incoming)
    if (
      this.previousSnapshot.phoneState !== this.currentSnapshot.phoneState &&
      this.currentSnapshot.phoneState === 'ringing'
    ) {
      transitions.push({
        type: 'incoming_call',
        from: this.previousSnapshot.phoneState || 'idle',
        to: 'ringing',
        timestamp: now,
        significance: 'high',
      });
    }

    return transitions;
  }

  /**
   * Calculates the current context level based on combined sensor data.
   */
  private calculateContextLevel(
    snapshot: PixelSensorSnapshot,
  ): PixelContextLevel {
    const zone = snapshot.zone || 'away';
    let level: PixelContextLevel['level'] = 'idle';
    let confidence = 0.5;
    let summary = '';

    // Resting: night time + screen off + still + home
    if (
      !snapshot.screenOn &&
      snapshot.detectedActivity === 'still' &&
      zone === 'home'
    ) {
      const hour = new Date().getHours();
      if (hour >= 22 || hour < 7) {
        level = 'resting';
        confidence = 0.9;
        summary = '💤 Descansando en casa';
      } else {
        level = 'idle';
        confidence = 0.7;
        summary = '🏠 En casa, inactivo';
      }
    }
    // Mobile: in_vehicle or on_bicycle
    else if (
      snapshot.detectedActivity === 'in_vehicle' ||
      snapshot.detectedActivity === 'on_bicycle'
    ) {
      level = 'mobile';
      confidence = 0.85;
      summary = `🚗 En movimiento (${snapshot.detectedActivity === 'in_vehicle' ? 'vehículo' : 'bicicleta'})`;
    }
    // Active: walking/running
    else if (
      snapshot.detectedActivity === 'walking' ||
      snapshot.detectedActivity === 'running'
    ) {
      level = 'active';
      confidence = 0.8;
      summary = `🏃 ${snapshot.detectedActivity === 'running' ? 'Corriendo' : 'Caminando'}${zone !== 'away' ? ` en ${zone}` : ''}`;
    }
    // Focused: at office + screen on
    else if (zone === 'office' && snapshot.screenOn) {
      level = 'focused';
      confidence = 0.75;
      summary = '💼 Trabajando en la oficina';
    }
    // Default
    else {
      level = snapshot.screenOn ? 'active' : 'idle';
      confidence = 0.5;
      summary = snapshot.screenOn
        ? `📱 Usando el teléfono${zone !== 'away' ? ` en ${zone}` : ''}`
        : `😴 Inactivo${zone !== 'away' ? ` en ${zone}` : ''}`;
    }

    return { level, confidence, zone, summary };
  }

  /**
   * Sanitizes snapshot for logging (removes sensitive GPS coords).
   */
  private sanitizeForLog(
    snapshot: PixelSensorSnapshot,
  ): Partial<PixelSensorSnapshot> {
    const { latitude, longitude, ...safe } = snapshot;
    return safe;
  }
}
