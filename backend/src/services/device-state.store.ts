import { injectable } from 'inversify';
import { logger } from '../utils/logger';

/**
 * 🌌 DEVICE STATE STORE
 * In-memory singleton for the latest Pixel 8 physical state.
 * Fed by device-telemetry endpoint, consumed by Daniela's system prompt.
 */

export interface DeviceState {
  device: string;
  battery_level: number;
  battery_state?: string;
  location?: string;           // human-readable (e.g., "Casa", "Oficina", "En movimiento")
  coords?: { lat: number; lng: number };
  wifi_connected?: boolean;
  wifi_ssid?: string;
  bluetooth_connected?: string[];
  car_mode?: boolean;
  timestamp: string;
}

export interface HealthState {
  steps?: number;
  heart_rate?: number;
  sleep_hours?: number;
  calories?: number;
  last_workout?: string;
  timestamp: string;
}

@injectable()
export class DeviceStateStore {
  private deviceState: DeviceState | null = null;
  private healthState: HealthState | null = null;

  /** Update device telemetry (location, battery, connectivity) */
  updateDeviceState(state: DeviceState): void {
    this.deviceState = { ...state, timestamp: state.timestamp || new Date().toISOString() };
    logger.info(`[DeviceState] Updated: ${state.location || 'unknown'} | 🔋${state.battery_level}%`);
  }

  /** Update health telemetry (steps, heart rate, sleep) */
  updateHealthState(state: HealthState): void {
    this.healthState = { ...state, timestamp: state.timestamp || new Date().toISOString() };
    logger.info(`[DeviceState] Health updated: ${state.steps || 0} steps`);
  }

  /** Get current device state */
  getDeviceState(): DeviceState | null {
    return this.deviceState;
  }

  /** Get current health state */
  getHealthState(): HealthState | null {
    return this.healthState;
  }

  /**
   * Build a context string for injection into Daniela's system prompt.
   * Returns null if no state is available.
   */
  buildContextBlock(): string | null {
    if (!this.deviceState && !this.healthState) return null;

    const lines: string[] = ['[CONTEXTO FÍSICO DEL USUARIO]'];

    if (this.deviceState) {
      const d = this.deviceState;
      const age = Math.round((Date.now() - new Date(d.timestamp).getTime()) / 60000);
      lines.push(`- Ubicación: ${d.location || 'Desconocida'}`);
      lines.push(`- Batería: ${d.battery_level}%${d.battery_state ? ` (${d.battery_state})` : ''}`);
      if (d.wifi_connected) lines.push(`- WiFi: ${d.wifi_ssid || 'Conectado'}`);
      if (d.car_mode) lines.push(`- 🚗 Modo Coche ACTIVO`);
      if (d.bluetooth_connected?.length) lines.push(`- Bluetooth: ${d.bluetooth_connected.join(', ')}`);
      lines.push(`- Actualizado hace ${age} min`);
    }

    if (this.healthState) {
      const h = this.healthState;
      if (h.steps) lines.push(`- Pasos hoy: ${h.steps.toLocaleString()}`);
      if (h.heart_rate) lines.push(`- Ritmo cardíaco: ${h.heart_rate} bpm`);
      if (h.sleep_hours) lines.push(`- Sueño: ${h.sleep_hours}h`);
    }

    return lines.join('\n');
  }
}
