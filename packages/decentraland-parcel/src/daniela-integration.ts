import { engine, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs';
import { Color4, Vector3 } from '@dcl/sdk/math';

// Daniela AI Integration for Decentraland Metaverse
export class DanielaMetaverseIntegration {
  private aiCore: any = null;
  private npcs: Map<string, any> = new Map();
  private dataStreams: any[] = [];
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    console.log('🧠 Initializing Daniela AI for Metaverse...');

    // Create AI Core Platform
    this.createAICore();

    // Initialize AI NPCs
    this.initializeAINPCs();

    // Create Data Streams
    this.createDataStreams();

    // Start AI Processing
    this.startAIProcessing();

    this.isInitialized = true;
    console.log('✅ Daniela AI Metaverse Integration Ready!');
  }

  private createAICore() {
    // Central AI Processing Core
    this.aiCore = engine.addEntity();
    Transform.create(this.aiCore, {
      position: Vector3.create(8, 2, 8),
      scale: Vector3.create(4, 0.5, 4),
    });
    MeshRenderer.setBox(this.aiCore);
    Material.setPbrMaterial(this.aiCore, {
      albedoColor: Color4.create(0.2, 0.1, 0.4, 0.8),
      roughness: 0.1,
      metallic: 0.9,
      emissiveColor: Color4.create(0.6, 0.3, 1, 0.6),
      emissiveIntensity: 5,
    });
  }

  private initializeAINPCs() {
    // Create Daniela AI Assistant NPC
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

    // Create System Admin NPC
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

  private createDataStreams() {
    // Create visual data streams connecting to AI
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

      this.dataStreams.push({
        entity: stream,
        type: 'ai-data',
        angle: angle,
        radius: radius,
      });
    }
  }

  private startAIProcessing() {
    let processingTime = 0;

    engine.addSystem(() => {
      processingTime += 0.016; // ~60fps

      // Animate data streams
      this.animateDataStreams(processingTime);

      // Pulse AI Core
      this.pulseAICore(processingTime);

      // Update NPCs
      this.updateNPCs(processingTime);
    });
  }

  private animateDataStreams(time: number) {
    this.dataStreams.forEach((stream, index) => {
      const transform = Transform.getMutable(stream.entity);

      // Floating motion
      transform.position.y = 2 + Math.sin(time * 2 + index) * 0.5;

      // Rotation around AI core
      const newAngle = stream.angle + time * 0.5;
      transform.position.x = 8 + Math.cos(newAngle) * stream.radius;
      transform.position.z = 8 + Math.sin(newAngle) * stream.radius;

      // Pulsing effect
      const scale = 0.1 + Math.sin(time * 4 + index) * 0.05;
      transform.scale.x = scale;
      transform.scale.z = scale;
    });
  }

  private pulseAICore(time: number) {
    const transform = Transform.getMutable(this.aiCore);

    // Gentle floating
    transform.position.y = 2 + Math.sin(time) * 0.2;

    // Pulsing glow effect would be handled by emissive intensity
    // This is simulated by the material's emissiveIntensity
  }

  private updateNPCs(time: number) {
    this.npcs.forEach((npc, name) => {
      const transform = Transform.getMutable(npc.entity);

      // Gentle swaying motion
      transform.rotation.y = Math.sin(time * 0.5) * 0.1;

      // Subtle position changes
      if (name === 'daniela') {
        transform.position.z = 10 + Math.sin(time * 0.3) * 0.2;
      }
    });
  }

  // Public API for external interaction
  public async processUserQuery(query: string, userId: string): Promise<string> {
    // Simulate AI processing
    console.log(`🧠 Processing query from ${userId}: ${query}`);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate response based on query type
    const responses = {
      analytics:
        'Basado en los datos del sistema, he detectado un aumento del 23% en la eficiencia operativa esta semana.',
      status: 'Todos los sistemas operativos. Daniela IA está funcionando al 98% de capacidad.',
      help: 'Soy Daniela, tu asistente de IA en el metaverso. Puedo ayudarte con análisis, predicciones y optimización del sistema.',
      default:
        'Entendido tu consulta. Como IA de AIGestion, estoy aquí para optimizar tus procesos y proporcionar insights estratégicos.',
    };

    const queryLower = query.toLowerCase();
    let response = responses.default;

    if (queryLower.includes('anal') || queryLower.includes('métrica')) {
      response = responses.analytics;
    } else if (queryLower.includes('estado') || queryLower.includes('status')) {
      response = responses.status;
    } else if (queryLower.includes('ayuda') || queryLower.includes('help')) {
      response = responses.help;
    }

    return response;
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
    };
  }

  public cleanup() {
    // Clean up all entities
    engine.removeEntity(this.aiCore);

    this.npcs.forEach(npc => {
      engine.removeEntity(npc.entity);
    });
    this.npcs.clear();

    this.dataStreams.forEach(stream => {
      engine.removeEntity(stream.entity);
    });
    this.dataStreams.length = 0;

    this.isInitialized = false;
  }
}

// Export singleton instance
export const danielaMetaverse = new DanielaMetaverseIntegration();
