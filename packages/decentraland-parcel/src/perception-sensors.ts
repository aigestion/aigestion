import {
  engine,
  Transform,
  MeshRenderer,
  Material,
  Entity,
  pointerEventsSystem,
  InputAction,
} from '@dcl/sdk/ecs';
import { Vector3, Color4, Quaternion } from '@dcl/sdk/math';
import { updateSystemStatus } from './enhanced-interactables';
import { reportPresence } from './enhanced-network';

// Zones of interest
type Zone = {
  id: string;
  center: Vector3;
  size: Vector3;
  entity: Entity;
  isOccupied: boolean;
};

class PerceptionSensors {
  private zones: Zone[] = [];
  private lastUpdate = 0;

  initialize() {
    console.log('👁️ Perception Sensors: initializing spatial awareness...');

    // Define Sovereign Core Sensor Zone
    this.createZone('sovereign_core', Vector3.create(8, 2, 8), Vector3.create(6, 4, 6));

    // Define Entrance Sensor Zone
    this.createZone('entrance', Vector3.create(8, 2, 1), Vector3.create(4, 4, 2));

    // Monitor player position
    engine.addSystem(dt => {
      this.lastUpdate += dt;
      if (this.lastUpdate >= 1.0) {
        // Check every second
        this.lastUpdate = 0;
        this.updatePresence();
      }
    });
  }

  private createZone(id: string, center: Vector3, size: Vector3) {
    const entity = engine.addEntity();
    Transform.create(entity, {
      position: center,
      scale: size,
    });

    // Debug visualization (barely visible)
    MeshRenderer.setBox(entity);
    Material.setPbrMaterial(entity, {
      albedoColor: Color4.create(0, 1, 0, 0.05),
      emissiveColor: Color4.create(0, 1, 0.1, 0.1),
      emissiveIntensity: 0.5,
    });

    this.zones.push({ id, center, size, entity, isOccupied: false });
  }

  private updatePresence() {
    const playerTransform = Transform.getOrNull(engine.PlayerEntity);
    if (!playerTransform) return;

    const pos = playerTransform.position;

    for (const zone of this.zones) {
      const inX = Math.abs(pos.x - zone.center.x) < zone.size.x / 2;
      const inZ = Math.abs(pos.z - zone.center.z) < zone.size.z / 2;
      const inY =
        pos.y > zone.center.y - zone.size.y / 2 && pos.y < zone.center.y + zone.size.y / 2;

      const occupied = inX && inY && inZ;

      if (occupied !== zone.isOccupied) {
        zone.isOccupied = occupied;
        this.onPresenceChange(zone.id, occupied);
      }
    }
  }

  private onPresenceChange(zoneId: string, occupied: boolean) {
    console.log(`📡 Perception Event: Zone ${zoneId} -> ${occupied ? 'OCCUPIED' : 'VACANT'}`);

    // Visual feedback in scene
    updateSystemStatus(`META_PRESENCE_${zoneId.toUpperCase()}`, occupied);

    // Actual backend sync
    reportPresence(zoneId, occupied);
  }
}

export const perceptionSensors = new PerceptionSensors();
