import { engine, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs';
import { Color4, Vector3 } from '@dcl/sdk/math';
import { danielaMetaverse } from './daniela-integration';

// Optimized main function for AIGestion Virtual Office
export function main() {
  console.log('🚀 Starting AIGestion Virtual Office - God Mode...');

  // Create enhanced architecture with Daniela AI integration
  createGodModeArchitecture();

  // Initialize core systems
  initializeCoreSystems();

  // Start real-time updates
  startRealTimeUpdates();

  console.log('✅ AIGestion Virtual Office - God Mode Initialized!');
}

// Create God Mode Architecture with Daniela AI
function createGodModeArchitecture() {
  // Enhanced Holographic Floor
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

  // Quantum Glass Walls
  createQuantumWalls();

  // Daniela AI Integration Center
  createDanielaAICenter();

  // Enhanced Lighting System
  createEnhancedLighting();
}

function createQuantumWalls() {
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

  // Left Glass Wall
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

  // Right Glass Wall
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
}

function createDanielaAICenter() {
  // Central AI Core Platform
  const aiCore = engine.addEntity();
  Transform.create(aiCore, {
    position: Vector3.create(8, 1, 8),
    scale: Vector3.create(3, 0.5, 3),
  });
  MeshRenderer.setBox(aiCore);
  Material.setPbrMaterial(aiCore, {
    albedoColor: Color4.create(0.2, 0.1, 0.4, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: Color4.create(0.6, 0.3, 1, 0.6),
    emissiveIntensity: 5,
  });

  // Floating AI Orbs
  for (let i = 0; i < 5; i++) {
    const orb = engine.addEntity();
    Transform.create(orb, {
      position: Vector3.create(6 + i * 1.5, 2 + Math.sin(i) * 0.5, 6 + Math.cos(i) * 1.5),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    MeshRenderer.setBox(orb);
    Material.setPbrMaterial(orb, {
      albedoColor: Color4.create(0.8, 0.3, 1, 0.7),
      roughness: 0.0,
      metallic: 0.8,
      emissiveColor: Color4.create(0.8, 0.3, 1, 1),
      emissiveIntensity: 8,
    });
  }

  // Interactive Dashboard Wall
  const dashboard = engine.addEntity();
  Transform.create(dashboard, {
    position: Vector3.create(8, 4, 2),
    scale: Vector3.create(8, 4, 0.1),
  });
  MeshRenderer.setBox(dashboard);
  Material.setPbrMaterial(dashboard, {
    albedoColor: Color4.create(0, 0, 0, 0.9),
    roughness: 0.1,
    metallic: 0.8,
    emissiveColor: Color4.create(0.2, 0.8, 1, 0.4),
    emissiveIntensity: 3,
  });
}

function createEnhancedLighting() {
  // Neon Ceiling Lights
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
}

function initializeCoreSystems() {
  // Initialize particle system
  createOptimizedParticles();

  // Initialize data streams
  createDataStreams();

  // Initialize interactive elements
  createInteractiveElements();

  // Initialize Daniela AI Integration
  danielaMetaverse.initialize();
}

function createOptimizedParticles() {
  const particleCount = 20; // Reduced for performance

  for (let i = 0; i < particleCount; i++) {
    const particle = engine.addEntity();
    Transform.create(particle, {
      position: Vector3.create(Math.random() * 16, Math.random() * 4 + 1, Math.random() * 16),
      scale: Vector3.create(0.1, 0.1, 0.1),
    });
    MeshRenderer.setBox(particle);
    Material.setPbrMaterial(particle, {
      albedoColor: Color4.create(0, 1, 0.8, 0.6),
      roughness: 0.0,
      metallic: 0.5,
      emissiveColor: Color4.create(0, 1, 0.8, 1),
      emissiveIntensity: 3,
    });
  }
}

function createDataStreams() {
  // Vertical data streams
  for (let i = 0; i < 3; i++) {
    const dataStream = engine.addEntity();
    Transform.create(dataStream, {
      position: Vector3.create(4 + i * 3, 3, 2),
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
}

function createInteractiveElements() {
  // Welcome Panel
  const welcomePanel = engine.addEntity();
  Transform.create(welcomePanel, {
    position: Vector3.create(8, 2, 12),
    scale: Vector3.create(4, 2, 0.1),
  });
  MeshRenderer.setBox(welcomePanel);
  Material.setPbrMaterial(welcomePanel, {
    albedoColor: Color4.create(0.1, 0.1, 0.2, 0.9),
    roughness: 0.2,
    metallic: 0.7,
    emissiveColor: Color4.create(0.3, 0.1, 0.5, 0.3),
    emissiveIntensity: 2,
  });
}

function startRealTimeUpdates() {
  // Optimized update system
  let updateCount = 0;

  engine.addSystem(() => {
    updateCount++;

    // Update particles every 10 frames
    if (updateCount % 10 === 0) {
      updateParticles();
    }

    // Update data streams every 5 frames
    if (updateCount % 5 === 0) {
      updateDataStreams();
    }
  });
}

function updateParticles() {
  // Simple particle animation
  const t = Date.now() / 1000;

  // This would be implemented with proper entity tracking
  // For now, keeping it simple to avoid performance issues
}

function updateDataStreams() {
  // Simple data stream animation
  const t = Date.now() / 1000;

  // This would be implemented with proper entity tracking
  // For now, keeping it simple to avoid performance issues
}
