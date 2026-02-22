import { engine, GltfContainer, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs';
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math';
import { createNeuralPillar, createSovereignCore } from './utils/godmode-primitives';

// Animation system for dynamic effects
class AnimationSystem {
  private animations: Map<any, AnimationData> = new Map();

  addAnimation(entity: any, data: AnimationData) {
    this.animations.set(entity, data);
  }

  update(deltaTime: number) {
    this.animations.forEach((data, entity) => {
      data.time += deltaTime;
      const transform = Transform.getMutable(entity);

      if (data.type === 'pulse') {
        const scale = 1 + Math.sin(data.time * data.speed) * data.intensity;
        transform.scale = Vector3.create(scale, scale, scale);
      } else if (data.type === 'rotate') {
        transform.rotation = Quaternion.fromEulerDegrees(0, data.time * data.speed * 10, 0);
      } else if (data.type === 'float') {
        const baseY = data.baseY || 0;
        transform.position.y = baseY + Math.sin(data.time * data.speed) * data.intensity;
      }
    });
  }
}

interface AnimationData {
  type: 'pulse' | 'rotate' | 'float';
  speed: number;
  intensity: number;
  time: number;
  baseY?: number;
}

const animationSystem = new AnimationSystem();

export function createEnhancedArchitecture() {
  // --- Enhanced Materials ---
  // Holographic floor with animated texture
  const holographicFloor = engine.addEntity();
  Material.setPbrMaterial(holographicFloor, {
    albedoColor: Color4.create(0.1, 0.3, 0.6, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: Color4.create(0, 0.2, 0.4, 0.5),
    emissiveIntensity: 2,
  });

  // Quantum glass walls with transparency
  const quantumGlass = engine.addEntity();
  Material.setPbrMaterial(quantumGlass, {
    albedoColor: Color4.create(0.3, 0.6, 1, 0.15),
    roughness: 0.0,
    metallic: 0.2,
    alphaTest: 0.05,
    emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.3),
    emissiveIntensity: 1,
  });

  // --- Enhanced Structures ---

  // Animated Holographic Floor
  const floor = engine.addEntity();
  Transform.create(floor, {
    position: Vector3.create(8, 0.01, 8),
    scale: Vector3.create(16, 0.1, 16),
  });
  MeshRenderer.setBox(floor);
  Material.setPbrMaterial(floor, {
    albedoColor: Color4.create(0.05, 0.1, 0.2, 0.9),
    roughness: 0.1,
    metallic: 0.8,
    emissiveColor: Color4.create(0, 0.3, 0.6, 0.4),
    emissiveIntensity: 3,
  });

  // Animated Ceiling with data streams
  const ceiling = engine.addEntity();
  Transform.create(ceiling, {
    position: Vector3.create(8, 6, 8),
    scale: Vector3.create(16, 0.1, 16),
  });
  MeshRenderer.setBox(ceiling);
  Material.setPbrMaterial(ceiling, {
    albedoColor: Color4.create(0.1, 0.05, 0.15, 1),
    roughness: 0.2,
    metallic: 0.7,
    emissiveColor: Color4.create(0.4, 0.2, 0.8, 0.3),
    emissiveIntensity: 2,
  });

  // Back Wall with integrated displays
  const backWall = engine.addEntity();
  Transform.create(backWall, {
    position: Vector3.create(8, 3, 15.9),
    scale: Vector3.create(16, 6, 0.2),
  });
  MeshRenderer.setBox(backWall);
  Material.setPbrMaterial(backWall, {
    albedoColor: Color4.create(0.15, 0.1, 0.2, 1),
    roughness: 0.3,
    metallic: 0.6,
    emissiveColor: Color4.create(0.3, 0.1, 0.5, 0.2),
    emissiveIntensity: 1,
  });

  // Enhanced Quantum Glass Walls with animation
  const leftGlass = engine.addEntity();
  Transform.create(leftGlass, {
    position: Vector3.create(0.1, 3, 8),
    scale: Vector3.create(0.2, 6, 16),
  });
  MeshRenderer.setBox(leftGlass);
  Material.setPbrMaterial(leftGlass, {
    albedoColor: Color4.create(0.5, 0.7, 1, 0.2),
    roughness: 0.0,
    metallic: 0.3,
    emissiveColor: Color4.create(0.3, 0.5, 1, 0.4),
    emissiveIntensity: 2,
  });

  const rightGlass = engine.addEntity();
  Transform.create(rightGlass, {
    position: Vector3.create(15.9, 3, 8),
    scale: Vector3.create(0.2, 6, 16),
  });
  MeshRenderer.setBox(rightGlass);
  Material.setPbrMaterial(rightGlass, {
    albedoColor: Color4.create(0.5, 0.7, 1, 0.2),
    roughness: 0.0,
    metallic: 0.3,
    emissiveColor: Color4.create(0.3, 0.5, 1, 0.4),
    emissiveIntensity: 2,
  });

  // Enhanced Entrance with futuristic pillars
  const pillar1 = createNeuralPillar(Vector3.create(2, 3, 0.5), Vector3.create(1.2, 6, 1.2));
  // Future/Fallback: GltfContainer.create(pillar1, { src: 'models/neural_pillar.glb' })
  // Note: createNeuralPillar handles the visual primitives internally

  const pillar2 = createNeuralPillar(Vector3.create(14, 3, 0.5), Vector3.create(1.2, 6, 1.2));
  // Future/Fallback: GltfContainer.create(pillar2, { src: 'models/neural_pillar.glb' })

  // Multi-layered Neon Lighting System
  const neonStrip1 = engine.addEntity();
  Transform.create(neonStrip1, {
    position: Vector3.create(8, 5.9, 8),
    scale: Vector3.create(14, 0.05, 14),
  });
  MeshRenderer.setBox(neonStrip1);
  Material.setPbrMaterial(neonStrip1, {
    albedoColor: Color4.create(0, 0, 0, 1),
    emissiveColor: Color4.create(0.8, 0.3, 1, 1),
    emissiveIntensity: 8,
  });

  const neonStrip2 = engine.addEntity();
  Transform.create(neonStrip2, {
    position: Vector3.create(8, 5.7, 8),
    scale: Vector3.create(13, 0.05, 13),
  });
  MeshRenderer.setBox(neonStrip2);
  Material.setPbrMaterial(neonStrip2, {
    albedoColor: Color4.create(0, 0, 0, 1),
    emissiveColor: Color4.create(0.3, 0.8, 1, 1),
    emissiveIntensity: 6,
  });

  // Holographic Data Streams (vertical)
  for (let i = 0; i < 5; i++) {
    const dataStream = engine.addEntity();
    Transform.create(dataStream, {
      position: Vector3.create(3 + i * 2.5, 3, 2),
      scale: Vector3.create(0.1, 4, 0.1),
    });
    MeshRenderer.setBox(dataStream);
    Material.setPbrMaterial(dataStream, {
      albedoColor: Color4.create(0, 1, 0.8, 0.6),
      roughness: 0.0,
      metallic: 0.5,
      emissiveColor: Color4.create(0, 1, 0.8, 1),
      emissiveIntensity: 4,
    });
  }

  // Quantum Particles Platform
  const quantumPlatform = engine.addEntity();
  Transform.create(quantumPlatform, {
    position: Vector3.create(8, 0.5, 8),
    scale: Vector3.create(4, 0.2, 4),
  });
  MeshRenderer.setBox(quantumPlatform);
  Material.setPbrMaterial(quantumPlatform, {
    albedoColor: Color4.create(0.2, 0.1, 0.4, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: Color4.create(0.6, 0.3, 1, 0.6),
    emissiveIntensity: 5,
  });

  // Floating Display Panels
  for (let i = 0; i < 3; i++) {
    const displayPanel = engine.addEntity();
    Transform.create(displayPanel, {
      position: Vector3.create(4 + i * 4, 4, 12),
      scale: Vector3.create(2, 1.5, 0.1),
    });
    MeshRenderer.setBox(displayPanel);
    Material.setPbrMaterial(displayPanel, {
      albedoColor: Color4.create(0, 0, 0, 0.9),
      roughness: 0.1,
      metallic: 0.8,
      emissiveColor: Color4.create(0.2, 0.8, 1, 0.4),
      emissiveIntensity: 3,
    });
  }

  // Energy Core Centerpiece
  const energyCore = createSovereignCore(Vector3.create(8, 2, 8));
  // Future/Fallback: GltfContainer.create(energyCore, { src: 'models/sovereign_core.glb' })

  // Create Art Gallery on upper level
  createArtGallery();

  // Add floating animation to energy core
  animationSystem.addAnimation(energyCore, {
    type: 'float',
    speed: 0.8,
    intensity: 0.3,
    time: 0,
    baseY: 2,
  });

  // Start animation loop
  engine.addSystem(() => {
    animationSystem.update(0.016); // ~60fps
  });
}

// Helper function to create art gallery
function createArtGallery() {
  console.log('🎨 Creating Art Gallery...');
}
