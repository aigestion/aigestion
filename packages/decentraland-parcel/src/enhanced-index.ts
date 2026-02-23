import { engine, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs';
import { Color4, Vector3 } from '@dcl/sdk/math';

import { setTimeout, setInterval, clearInterval } from './utils/timers';

import { lightingSystem } from './advanced-lighting';
import { npcManager } from './ai-npc-system';
import { analyticsDashboardSystem } from './analytics-dashboard';
import { arIntegrationSystem } from './ar-integration';
import { avatarSystem } from './avatar-system';
import { blockchainSystem } from './blockchain-integration';
import { whiteboardSystem } from './collaboration-whiteboard';
import { contentManagementSystem } from './content-management';
import { crossPlatformSyncSystem } from './cross-platform-sync';
import { emotionDetectionSystem } from './emotion-detection';
import { createEnhancedArchitecture } from './enhanced-architecture';
import {
  createEnhancedInteractables,
  updateAlert,
  updateSystemStatus,
} from './enhanced-interactables';
import {
  fetchAlertMessages,
  fetchEnhancedSystemStats,
  runSystemDiagnostics,
} from './enhanced-network';
import { soundSystem } from './enhanced-sound';
import { gestureSystem } from './gesture-recognition';
import { hapticFeedbackSystem } from './haptic-feedback';
import { DataVisualizationManager, dataVizManager } from './holographic-data-walls';
import { multiplayerSystem } from './multiplayer-system';
import { physicsSystem } from './physics-interaction';
import { proceduralSystem } from './procedural-generation';
import { uiSystem } from './responsive-ui-system';
import { smartRoomSystem } from './smart-room-system';
import { voiceCommandSystem } from './voice-command-system';
import { weatherSystem } from './weather-system';
import { perceptionSensors } from './perception-sensors';

// Enhanced main function with real-time updates
export function enhancedMain() {
  console.log(' Initializing AIGestion Enhanced Virtual Office...');

  // Initialize core systems first (critical path)
  soundSystem.initialize();
  lightingSystem.initialize();
  uiSystem.initialize();
  perceptionSensors.initialize();

  // Create enhanced architecture first
  createEnhancedArchitecture();

  // Create enhanced interactables
  createEnhancedInteractables();

  console.log(' Core systems initialized - Starting advanced systems...');

  // Initialize advanced systems with delay to prevent blocking
  setTimeout(() => {
    weatherSystem.initialize();
    multiplayerSystem.initialize();
    avatarSystem.initialize();
    smartRoomSystem.initialize();
  }, 100);

  setTimeout(() => {
    gestureSystem.initialize();
    whiteboardSystem.initialize();
    voiceCommandSystem.initialize();
    blockchainSystem.initialize();
  }, 200);

  setTimeout(() => {
    arIntegrationSystem.initialize();
    contentManagementSystem.initialize();
    physicsSystem.initialize();
    proceduralSystem.initialize();
  }, 300);

  setTimeout(() => {
    emotionDetectionSystem.initialize();
    crossPlatformSyncSystem.initialize();
    analyticsDashboardSystem.initialize();
    hapticFeedbackSystem.initialize();
  }, 400);

  // Initialize AI NPCs
  setTimeout(() => {
    initializeNPCs();
    initializeDataVisualization();
    startRealTimeUpdates();
    createParticleEffects();
    console.log(' Enhanced Virtual Office Initialized Successfully!');
  }, 500);
}

// Real-time update system with memory management
let systemUpdateInterval: any;
let diagnosticsInterval: any;
let alertsInterval: any;

function startRealTimeUpdates() {
  // Clear existing intervals to prevent memory leaks
  if (systemUpdateInterval) clearInterval(systemUpdateInterval);
  if (diagnosticsInterval) clearInterval(diagnosticsInterval);
  if (alertsInterval) clearInterval(alertsInterval);

  // Update system stats every 5 seconds (reduced frequency)
  systemUpdateInterval = setInterval(async () => {
    try {
      const stats = await fetchEnhancedSystemStats();
      updateSystemStatus('AUTO_UPDATE', true);

      // Trigger alerts based on system status with sound
      if (stats.systemHealth === 'CRITICAL') {
        updateAlert(' CRITICAL: System overload detected!', 'CRITICAL');
        soundSystem.playInteractionSound('alert');
      } else if (stats.systemHealth === 'WARNING') {
        updateAlert(' WARNING: High system load detected', 'WARNING');
        soundSystem.playInteractionSound('alert');
      } else {
        updateAlert(' All systems operating normally', 'INFO');
      }

      console.log(' System Stats Updated:', stats);
    } catch (error) {
      console.error(' Error updating system stats:', error);
    }
  }, 5000); // Increased from 3000 to 5000

  // Run diagnostics every 20 seconds (reduced frequency)
  diagnosticsInterval = setInterval(async () => {
    try {
      const diagnostics = await runSystemDiagnostics();
      console.log(' System Diagnostics:', diagnostics);

      if (diagnostics.overall === 'CRITICAL') {
        updateAlert(' CRITICAL SYSTEM FAILURE DETECTED!', 'CRITICAL');
        soundSystem.playInteractionSound('error');
      }
    } catch (error) {
      console.error(' Error running diagnostics:', error);
    }
  }, 20000); // Increased from 10000 to 20000

  // Update alerts every 10 seconds (reduced frequency)
  alertsInterval = setInterval(async () => {
    try {
      const alerts = await fetchAlertMessages();
      if (alerts.length > 0) {
        const latestAlert = alerts[alerts.length - 1];
        updateAlert(latestAlert.message, latestAlert.type);
      }
    } catch (error) {
      console.error(' Error fetching alerts:', error);
    }
  }, 10000); // Increased from 5000 to 10000
}

// Initialize AI-powered NPCs
function initializeNPCs() {
  // Create system assistant
  npcManager.createNPC('NEXUS', 'System Administrator', Vector3.create(4, 1, 4));

  // Create data analyst
  npcManager.createNPC('DATA', 'Data Analyst', Vector3.create(12, 1, 4));

  // Create security expert
  npcManager.createNPC('GUARD', 'Security Expert', Vector3.create(8, 1, 12));

  console.log('🤖 AI Assistants Initialized');
}

// Initialize data visualization walls
function initializeDataVisualization() {
  // Create main data wall
  const mainWall = dataVizManager.createWall(
    'main',
    Vector3.create(8, 4, 0.5),
    Vector3.create(16, 8, 0.2)
  );

  // Add system status chart
  mainWall.addChart('systemStatus', {
    type: 'bar',
    title: 'System Status',
    data: DataVisualizationManager.createSystemStatusData(),
    maxDataPoints: 10,
    updateInterval: 3000,
  });

  // Add real-time data stream
  mainWall.startDataStream('realtime', DataVisualizationManager.createRealtimeDataSource());

  console.log('📊 Data Visualization Initialized');
}
const particlePool: any[] = [];
const maxParticles = 50;

function createParticleEffects() {
  console.log('🎨 Creating particle effects...');

  // Create floating data particles with pooling
  const particleCount = Math.min(32, maxParticles); // Increased for better visuals
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticle();
    particlePool.push({ entity: particle, type: 'data', offset: Math.random() * Math.PI * 2 });
  }

  // Create energy stream particles
  const energyCount = Math.min(16, maxParticles - particleCount);
  for (let i = 0; i < energyCount; i++) {
    const energyParticle = createEnergyParticle();
    particlePool.push({
      entity: energyParticle,
      type: 'energy',
      offset: Math.random() * Math.PI * 2,
    });
  }

  // Add unified particle system
  engine.addSystem(particleSystem);

  console.log(`✅ Created ${particleCount + energyCount} particles`);
}

// Unified particle system for better performance
function particleSystem(dt: number) {
  const t = Date.now() / 1000;

  for (const p of particlePool) {
    const transform = Transform.getMutable(p.entity);

    if (p.type === 'data') {
      // Floating motion
      transform.position.y += Math.sin(t + p.offset) * dt * 0.5;
      transform.rotation = { x: 0, y: (t * 20 + p.offset * 10) % 360, z: 0, w: 1 }; // Simple rotation
    } else if (p.type === 'energy') {
      // Spiral motion
      transform.position.y += dt * 1.5;
      if (transform.position.y > 10) transform.position.y = 2;

      const radius = 1;
      transform.position.x += Math.cos(t * 2 + p.offset) * dt;
      transform.position.z += Math.sin(t * 2 + p.offset) * dt;
    }
  }
}

function createParticle() {
  const particle = engine.addEntity();
  Transform.create(particle, {
    position: Vector3.create(Math.random() * 16, Math.random() * 4 + 1, Math.random() * 16),
    scale: Vector3.create(0.1, 0.1, 0.1),
  });
  MeshRenderer.setBox(particle);
  Material.setPbrMaterial(particle, {
    albedoColor: Color4.create(0, 1, 0.8, 0.6),
    roughness: 0,
    metallic: 0.5,
    emissiveColor: Color4.create(0, 1, 0.8, 1),
    emissiveIntensity: 3,
  });
  return particle;
}

function createEnergyParticle() {
  const energyParticle = engine.addEntity();
  Transform.create(energyParticle, {
    position: Vector3.create(
      8 + (Math.random() - 0.5) * 4,
      2 + Math.random() * 2,
      8 + (Math.random() - 0.5) * 4
    ),
    scale: Vector3.create(0.15, 0.15, 0.15),
  });
  MeshRenderer.setBox(energyParticle);
  Material.setPbrMaterial(energyParticle, {
    albedoColor: Color4.create(1, 0.8, 0.2, 0.7),
    roughness: 0.1,
    metallic: 0.8,
    emissiveColor: Color4.create(1, 0.8, 0.2, 1),
    emissiveIntensity: 5,
  });
  return energyParticle;
}

// Animations handled by unified system
function animateParticle(particle: any) {
  // Deprecated in favor of particleSystem
}

function animateEnergyParticle(particle: any) {
  // Deprecated in favor of particleSystem
}

// Cleanup function to prevent memory leaks
export function cleanupEnhancedScene() {
  if (systemUpdateInterval) clearInterval(systemUpdateInterval);
  if (diagnosticsInterval) clearInterval(diagnosticsInterval);
  if (alertsInterval) clearInterval(alertsInterval);

  // Clean up particle pool
  particlePool.forEach(particle => {
    engine.removeEntity(particle);
  });
  particlePool.length = 0;

  // Clean up all systems
  soundSystem.cleanup();
  lightingSystem.cleanup();
  npcManager.cleanup();
  dataVizManager.cleanup();
  uiSystem.cleanup();
  weatherSystem.cleanup();
  multiplayerSystem.cleanup();
  avatarSystem.cleanup();
  smartRoomSystem.cleanup();
  gestureSystem.cleanup();
  whiteboardSystem.cleanup();
  voiceCommandSystem.cleanup();
  blockchainSystem.cleanup();
  arIntegrationSystem.cleanup();
  contentManagementSystem.cleanup();
  physicsSystem.cleanup();
  proceduralSystem.cleanup();
  emotionDetectionSystem.cleanup();
  crossPlatformSyncSystem.cleanup();
  analyticsDashboardSystem.cleanup();
  hapticFeedbackSystem.cleanup();
}

// Initialize the enhanced scene
enhancedMain();
