import { engine, Material, MeshRenderer, TextShape, Transform } from '@dcl/sdk/ecs';
import { Color4, Vector3 } from '@dcl/sdk/math';
import { telemetryBridge } from './systems/telemetry-bridge';
import { EnhancedSystemStats } from './enhanced-network';

// ── Types ──────────────────────────────────────────────────────────────────────

interface OccupationZone {
  id: string;
  label: string;
  position: { x: number; z: number };
  /** 0-1 — fraction currently occupied */
  occupancy: number;
  entity: ReturnType<typeof engine.addEntity>;
  labelEntity: ReturnType<typeof engine.addEntity>;
}

// ── Daniela AI Integration for Decentraland Metaverse ─────────────────────────

export class DanielaMetaverseIntegration {
  private aiCore: any = null;
  /** Outer holographic ring around the core */
  private holoCoreRing: any = null;
  /** Inner pulsing orb */
  private holoCoreOrb: any = null;

  private npcs: Map<string, any> = new Map();
  private dataStreams: any[] = [];
  private isInitialized = false;

  // Neural Occupation Map
  private occupationZones: OccupationZone[] = [];
  private occupationMapBase: any = null;

  // Telemetry state
  private currentStats: EnhancedSystemStats | null = null;

  async initialize() {
    if (this.isInitialized) return;

    console.log('🧠 Initializing Daniela AI for Metaverse…');

    this.createAICore();
    this.initializeAINPCs();
    this.createDataStreams();
    this.createNeuralOccupationMap();
    this.startAIProcessing();

    // Subscribe to live telemetry
    telemetryBridge.onStats((stats: EnhancedSystemStats) => {
      this.currentStats = stats;
      this._applyTelemetryToMap(stats);
    });

    this.isInitialized = true;
    console.log('✅ Daniela AI Metaverse Integration Ready!');
  }

  // ── AI Core (upgraded: floating holographic core) ─────────────────────────

  private createAICore() {
    // Base platform
    this.aiCore = engine.addEntity();
    Transform.create(this.aiCore, {
      position: Vector3.create(8, 1.5, 8),
      scale: Vector3.create(2.5, 0.15, 2.5),
    });
    MeshRenderer.setBox(this.aiCore);
    Material.setPbrMaterial(this.aiCore, {
      albedoColor: Color4.create(0.1, 0.0, 0.25, 0.95),
      roughness: 0.05,
      metallic: 1.0,
      emissiveColor: Color4.create(0.5, 0.2, 0.9, 1),
      emissiveIntensity: 4,
    });

    // Floating holographic orb (inner core)
    this.holoCoreOrb = engine.addEntity();
    Transform.create(this.holoCoreOrb, {
      position: Vector3.create(8, 3.2, 8),
      scale: Vector3.create(0.8, 0.8, 0.8),
    });
    MeshRenderer.setSphere(this.holoCoreOrb);
    Material.setPbrMaterial(this.holoCoreOrb, {
      albedoColor: Color4.create(0.7, 0.3, 1.0, 0.6),
      roughness: 0.0,
      metallic: 0.8,
      emissiveColor: Color4.create(0.6, 0.2, 1.0, 1),
      emissiveIntensity: 12,
    });

    // Outer rotating ring
    this.holoCoreRing = engine.addEntity();
    Transform.create(this.holoCoreRing, {
      position: Vector3.create(8, 3.2, 8),
      scale: Vector3.create(1.6, 0.12, 1.6),
    });
    MeshRenderer.setBox(this.holoCoreRing);
    Material.setPbrMaterial(this.holoCoreRing, {
      albedoColor: Color4.create(0.3, 0.8, 1.0, 0.3),
      roughness: 0.0,
      metallic: 1.0,
      emissiveColor: Color4.create(0.2, 0.7, 1.0, 1),
      emissiveIntensity: 8,
    });
  }

  // ── NPCs (unchanged) ───────────────────────────────────────────────────────

  private initializeAINPCs() {
    const danielaNPC = engine.addEntity();
    Transform.create(danielaNPC, {
      position: Vector3.create(8, 1, 10),
      scale: Vector3.create(0.8, 1.8, 0.8),
    });
    MeshRenderer.setBox(danielaNPC);
    Material.setPbrMaterial(danielaNPC, {
      albedoColor: Color4.create(0.8, 0.3, 1, 0.9),
      roughness: 0.2,
      metallic: 0.7,
      emissiveColor: Color4.create(0.8, 0.3, 1, 0.8),
      emissiveIntensity: 4,
    });
    this.npcs.set('daniela', {
      entity: danielaNPC,
      personality: 'strategic',
      role: 'AI Assistant',
      status: 'active',
    });

    const adminNPC = engine.addEntity();
    Transform.create(adminNPC, {
      position: Vector3.create(4, 1, 8),
      scale: Vector3.create(0.8, 1.8, 0.8),
    });
    MeshRenderer.setBox(adminNPC);
    Material.setPbrMaterial(adminNPC, {
      albedoColor: Color4.create(0.3, 0.8, 1, 0.9),
      roughness: 0.2,
      metallic: 0.7,
      emissiveColor: Color4.create(0.3, 0.8, 1, 0.8),
      emissiveIntensity: 4,
    });
    this.npcs.set('admin', {
      entity: adminNPC,
      personality: 'professional',
      role: 'System Administrator',
      status: 'active',
    });
  }

  // ── Data Streams ───────────────────────────────────────────────────────────

  private createDataStreams() {
    for (let i = 0; i < 8; i++) {
      const stream = engine.addEntity();
      const angle = (i / 8) * Math.PI * 2;
      const radius = 3;
      Transform.create(stream, {
        position: Vector3.create(
          8 + Math.cos(angle) * radius,
          2 + Math.random() * 2,
          8 + Math.sin(angle) * radius
        ),
        scale: Vector3.create(0.1, 4, 0.1),
      });
      MeshRenderer.setBox(stream);
      Material.setPbrMaterial(stream, {
        albedoColor: Color4.create(0, 1, 0.8, 0.6),
        roughness: 0.0,
        metallic: 0.5,
        emissiveColor: Color4.create(0, 1, 0.8, 1),
        emissiveIntensity: 4,
      });
      this.dataStreams.push({ entity: stream, type: 'ai-data', angle, radius });
    }
  }

  // ── Neural Occupation Map ──────────────────────────────────────────────────

  private createNeuralOccupationMap() {
    // Map base panel — mounted on a back wall so it's visible from the center
    this.occupationMapBase = engine.addEntity();
    Transform.create(this.occupationMapBase, {
      position: Vector3.create(14.8, 2.5, 8),
      scale: Vector3.create(0.15, 4, 7),
    });
    MeshRenderer.setBox(this.occupationMapBase);
    Material.setPbrMaterial(this.occupationMapBase, {
      albedoColor: Color4.create(0.0, 0.05, 0.12, 0.98),
      roughness: 0.15,
      metallic: 0.9,
      emissiveColor: Color4.create(0.05, 0.2, 0.4, 0.4),
      emissiveIntensity: 2,
    });

    // Header label
    const header = engine.addEntity();
    Transform.create(header, {
      parent: this.occupationMapBase,
      position: Vector3.create(-2, 0.42, 0.0),
      scale: Vector3.create(0.5, 0.12, 0.14),
    });
    TextShape.create(header, {
      text: '🗺️ NEURAL OCCUPATION MAP',
      textColor: Color4.create(0.4, 0.8, 1, 1),
      fontSize: 3,
      textAlign: 3,
    });

    // Zone definitions
    const zoneDefs: Array<{ id: string; label: string; x: number; z: number }> = [
      { id: 'LOBBY', label: '🚪 LOBBY', x: -2, z: 2.5 },
      { id: 'AI_LAB', label: '🧠 AI LAB', x: -2, z: 0.5 },
      { id: 'DATA_VAULT', label: '🔐 DATA VAULT', x: -2, z: -1.5 },
      { id: 'CONF_ROOM', label: '🤝 CONF ROOM', x: -2, z: -3.5 },
    ];

    for (const def of zoneDefs) {
      const zoneBar = engine.addEntity();
      Transform.create(zoneBar, {
        parent: this.occupationMapBase,
        position: Vector3.create(def.x + 1.4, 0.0, def.z / 3.5 - 0.05),
        scale: Vector3.create(0.25, 0.07, 0.2),
      });
      MeshRenderer.setBox(zoneBar);
      Material.setPbrMaterial(zoneBar, {
        albedoColor: Color4.create(0, 1, 0.5, 0.9),
        roughness: 0.1,
        metallic: 0.6,
        emissiveColor: Color4.create(0, 0.9, 0.4, 1),
        emissiveIntensity: 3,
      });

      const zoneLbl = engine.addEntity();
      Transform.create(zoneLbl, {
        parent: this.occupationMapBase,
        position: Vector3.create(def.x + 0.3, 0.0, def.z / 3.5 - 0.05),
        scale: Vector3.create(0.45, 0.09, 0.14),
      });
      TextShape.create(zoneLbl, {
        text: `${def.label}\n0%`,
        textColor: Color4.create(0.7, 1, 0.8, 1),
        fontSize: 2,
        textAlign: 3,
      });

      this.occupationZones.push({
        id: def.id,
        label: def.label,
        position: { x: def.x, z: def.z },
        occupancy: 0,
        entity: zoneBar,
        labelEntity: zoneLbl,
      });
    }
  }

  /** Update zone visuals when live telemetry arrives. */
  private _applyTelemetryToMap(stats: EnhancedSystemStats) {
    // Derive synthetic per-zone occupancies from live data
    const total = stats.activeUsers;
    const shares = [0.35, 0.3, 0.2, 0.15]; // lobby/ailab/vault/conf

    this.occupationZones.forEach((zone, i) => {
      const newOcc = Math.min(1, (total * shares[i]) / 10); // normalise to 0-1
      zone.occupancy = newOcc;

      // Color: green → yellow → red
      const r = Math.min(1, newOcc * 2);
      const g = Math.min(1, 2 - newOcc * 2);
      Material.setPbrMaterial(zone.entity as any, {
        albedoColor: Color4.create(r, g, 0.2, 0.9),
        roughness: 0.1,
        metallic: 0.6,
        emissiveColor: Color4.create(r * 0.8, g * 0.8, 0.1, 1),
        emissiveIntensity: 3 + newOcc * 4,
      });

      // Update text label
      const pct = Math.round(newOcc * 100);
      TextShape.getMutable(zone.labelEntity as any).text = `${zone.label}\n${pct}%`;
    });
  }

  // ── Animation systems ──────────────────────────────────────────────────────

  private startAIProcessing() {
    let processingTime = 0;
    engine.addSystem(() => {
      processingTime += 0.016;
      this.animateDataStreams(processingTime);
      this.pulseAICore(processingTime);
      this.updateNPCs(processingTime);
    });
  }

  private animateDataStreams(time: number) {
    this.dataStreams.forEach((stream, index) => {
      const transform = Transform.getMutable(stream.entity);
      transform.position.y = 2 + Math.sin(time * 2 + index) * 0.5;
      const newAngle = stream.angle + time * 0.5;
      transform.position.x = 8 + Math.cos(newAngle) * stream.radius;
      transform.position.z = 8 + Math.sin(newAngle) * stream.radius;
      const scale = 0.1 + Math.sin(time * 4 + index) * 0.05;
      transform.scale.x = scale;
      transform.scale.z = scale;
    });
  }

  private pulseAICore(time: number) {
    if (!this.aiCore) return;

    // Base platform gentle float
    const base = Transform.getMutable(this.aiCore);
    base.position.y = 1.5 + Math.sin(time * 0.8) * 0.05;

    // Inner orb: bob + pulse scale
    if (this.holoCoreOrb) {
      const orb = Transform.getMutable(this.holoCoreOrb);
      const bobY = 3.2 + Math.sin(time * 1.2) * 0.3;
      orb.position.y = bobY;
      const pulse = 0.8 + Math.sin(time * 2) * 0.15;
      orb.scale.x = pulse;
      orb.scale.y = pulse;
      orb.scale.z = pulse;
    }

    // Ring: slow rotation via position orbit (proxy for rotation since Quaternion.fromEulerDegrees may vary)
    if (this.holoCoreRing) {
      const ring = Transform.getMutable(this.holoCoreRing);
      ring.position.y = 3.2 + Math.sin(time * 1.2) * 0.3;
      const ringScaleOsc = 1.6 + Math.sin(time * 0.6) * 0.18;
      ring.scale.x = ringScaleOsc;
      ring.scale.z = ringScaleOsc;
    }
  }

  private updateNPCs(time: number) {
    this.npcs.forEach((npc, name) => {
      const transform = Transform.getMutable(npc.entity);
      transform.rotation.y = Math.sin(time * 0.5) * 0.1;
      if (name === 'daniela') {
        transform.position.z = 10 + Math.sin(time * 0.3) * 0.2;
      }
    });
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  public async processUserQuery(query: string, userId: string): Promise<string> {
    console.log(`🧠 Processing query from ${userId}: ${query}`);
    await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));

    const responses = {
      analytics:
        'Basado en los datos del sistema, he detectado un aumento del 23% en la eficiencia operativa esta semana.',
      status: 'Todos los sistemas operativos. Daniela IA está funcionando al 98% de capacidad.',
      help: 'Soy Daniela, tu asistente de IA en el metaverso. Puedo ayudarte con análisis, predicciones y optimización del sistema.',
      default:
        'Entendido tu consulta. Como IA de AIGestion, estoy aquí para optimizar tus procesos y proporcionar insights estratégicos.',
    };

    const q = query.toLowerCase();
    if (q.includes('anal') || q.includes('métrica')) return responses.analytics;
    if (q.includes('estado') || q.includes('status')) return responses.status;
    if (q.includes('ayuda') || q.includes('help')) return responses.help;
    return responses.default;
  }

  public getSystemStatus() {
    return {
      aiCore: 'active',
      npcs: Array.from(this.npcs.entries()).map(([name, npc]) => ({
        name,
        role: npc.role,
        status: npc.status,
        personality: npc.personality,
      })),
      dataStreams: this.dataStreams.length,
      processing: 'real-time',
      integration: 'daniela-ai-connected',
      occupationZones: this.occupationZones.map(z => ({
        id: z.id,
        occupancy: z.occupancy,
      })),
      liveStats: this.currentStats
        ? {
            users: this.currentStats.activeUsers,
            health: this.currentStats.systemHealth,
            latency: this.currentStats.networkLatency,
          }
        : null,
    };
  }

  public cleanup() {
    engine.removeEntity(this.aiCore);
    if (this.holoCoreOrb) engine.removeEntity(this.holoCoreOrb);
    if (this.holoCoreRing) engine.removeEntity(this.holoCoreRing);

    this.npcs.forEach(npc => engine.removeEntity(npc.entity));
    this.npcs.clear();

    this.dataStreams.forEach(stream => engine.removeEntity(stream.entity));
    this.dataStreams.length = 0;

    if (this.occupationMapBase) engine.removeEntity(this.occupationMapBase);
    this.occupationZones = [];

    this.isInitialized = false;
  }
}

// Export singleton instance
export const danielaMetaverse = new DanielaMetaverseIntegration();
