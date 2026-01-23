import { engine, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { lightingSystem } from './advanced-lighting'
import { npcManager } from './ai-npc-system'
import { analyticsDashboardSystem } from './analytics-dashboard'
import { arIntegrationSystem } from './ar-integration'
import { avatarSystem } from './avatar-system'
import { blockchainSystem } from './blockchain-integration'
import { whiteboardSystem } from './collaboration-whiteboard'
import { contentManagementSystem } from './content-management'
import { crossPlatformSyncSystem } from './cross-platform-sync'
import { emotionDetectionSystem } from './emotion-detection'
import { createEnhancedArchitecture } from './enhanced-architecture'
import { createEnhancedInteractables, updateAlert, updateSystemStatus } from './enhanced-interactables'
import { fetchAlertMessages, fetchEnhancedSystemStats, runSystemDiagnostics } from './enhanced-network'
import { soundSystem } from './enhanced-sound'
import { gestureSystem } from './gesture-recognition'
import { hapticFeedbackSystem } from './haptic-feedback'
import { DataVisualizationManager, dataVizManager } from './holographic-data-walls'
import { multiplayerSystem } from './multiplayer-system'
import { physicsSystem } from './physics-interaction'
import { proceduralSystem } from './procedural-generation'
import { uiSystem } from './responsive-ui-system'
import { smartRoomSystem } from './smart-room-system'
import { voiceCommandSystem } from './voice-command-system'
import { weatherSystem } from './weather-system'

// Enhanced main function with real-time updates
export function enhancedMain() {
  console.log(" Initializing AIGestion Enhanced Virtual Office...")

  // Initialize core systems first (critical path)
  soundSystem.initialize()
  lightingSystem.initialize()
  uiSystem.initialize()

  // Create enhanced architecture first
  createEnhancedArchitecture()

  // Create enhanced interactables
  createEnhancedInteractables()

  console.log(" Core systems initialized - Starting advanced systems...")

  // Initialize advanced systems with delay to prevent blocking
  setTimeout(() => {
    weatherSystem.initialize()
    multiplayerSystem.initialize()
    avatarSystem.initialize()
    smartRoomSystem.initialize()
  }, 100)

  setTimeout(() => {
    gestureSystem.initialize()
    whiteboardSystem.initialize()
    voiceCommandSystem.initialize()
    blockchainSystem.initialize()
  }, 200)

  setTimeout(() => {
    arIntegrationSystem.initialize()
    contentManagementSystem.initialize()
    physicsSystem.initialize()
    proceduralSystem.initialize()
  }, 300)

  setTimeout(() => {
    emotionDetectionSystem.initialize()
    crossPlatformSyncSystem.initialize()
    analyticsDashboardSystem.initialize()
    hapticFeedbackSystem.initialize()
  }, 400)

  // Initialize AI NPCs
  setTimeout(() => {
    initializeNPCs()
    initializeDataVisualization()
    startRealTimeUpdates()
    createParticleEffects()
    console.log(" Enhanced Virtual Office Initialized Successfully!")
  }, 500)
}

// Real-time update system with memory management
let systemUpdateInterval: NodeJS.Timeout
let diagnosticsInterval: NodeJS.Timeout
let alertsInterval: NodeJS.Timeout

function startRealTimeUpdates() {
  // Clear existing intervals to prevent memory leaks
  if (systemUpdateInterval) clearInterval(systemUpdateInterval)
  if (diagnosticsInterval) clearInterval(diagnosticsInterval)
  if (alertsInterval) clearInterval(alertsInterval)

  // Update system stats every 5 seconds (reduced frequency)
  systemUpdateInterval = setInterval(async () => {
    try {
      const stats = await fetchEnhancedSystemStats()
      updateSystemStatus("AUTO_UPDATE", true)

      // Trigger alerts based on system status with sound
      if (stats.systemHealth === 'CRITICAL') {
        updateAlert(" CRITICAL: System overload detected!", 'CRITICAL')
        soundSystem.playInteractionSound('alert')
      } else if (stats.systemHealth === 'WARNING') {
        updateAlert(" WARNING: High system load detected", 'WARNING')
        soundSystem.playInteractionSound('alert')
      } else {
        updateAlert(" All systems operating normally", 'INFO')
      }

      console.log(" System Stats Updated:", stats)
    } catch (error) {
      console.error(" Error updating system stats:", error)
    }
  }, 5000) // Increased from 3000 to 5000

  // Run diagnostics every 20 seconds (reduced frequency)
  diagnosticsInterval = setInterval(async () => {
    try {
      const diagnostics = await runSystemDiagnostics()
      console.log(" System Diagnostics:", diagnostics)

      if (diagnostics.overall === 'CRITICAL') {
        updateAlert(" CRITICAL SYSTEM FAILURE DETECTED!", 'CRITICAL')
        soundSystem.playInteractionSound('error')
      }
    } catch (error) {
      console.error(" Error running diagnostics:", error)
    }
  }, 20000) // Increased from 10000 to 20000

  // Update alerts every 10 seconds (reduced frequency)
  alertsInterval = setInterval(async () => {
    try {
      const alerts = await fetchAlertMessages()
      if (alerts.length > 0) {
        const latestAlert = alerts[alerts.length - 1]
        updateAlert(latestAlert.message, latestAlert.type)
      }
    } catch (error) {
      console.error(" Error fetching alerts:", error)
    }
  }, 10000) // Increased from 5000 to 10000
}

// Initialize AI-powered NPCs
function initializeNPCs() {
  // Create system assistant
  npcManager.createNPC(
    'NEXUS',
    'System Administrator',
    Vector3.create(4, 1, 4)
  )

  // Create data analyst
  npcManager.createNPC(
    'DATA',
    'Data Analyst',
    Vector3.create(12, 1, 4)
  )

  // Create security expert
  npcManager.createNPC(
    'GUARD',
    'Security Expert',
    Vector3.create(8, 1, 12)
  )

  console.log('🤖 AI Assistants Initialized')
}

// Initialize data visualization walls
function initializeDataVisualization() {
  // Create main data wall
  const mainWall = dataVizManager.createWall(
    'main',
    Vector3.create(8, 4, 0.5),
    Vector3.create(16, 8, 0.2)
  )

  // Add system status chart
  mainWall.addChart('systemStatus', {
    type: 'bar',
    title: 'System Status',
    data: DataVisualizationManager.createSystemStatusData(),
    maxDataPoints: 10,
    updateInterval: 3000
  })

  // Add real-time data stream
  mainWall.startDataStream('realtime', DataVisualizationManager.createRealtimeDataSource())

  console.log('📊 Data Visualization Initialized')
}
const particlePool: any[] = []
const maxParticles = 50

function createParticleEffects() {
  console.log('🎨 Creating particle effects...')

  // Create floating data particles with pooling - REDUCED COUNT
  const particleCount = Math.min(10, maxParticles) // Reduced from 20 to 10
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticle()
    animateParticle(particle)
    particlePool.push(particle)
  }

  // Create energy stream particles - REDUCED COUNT
  const energyCount = Math.min(5, maxParticles - particleCount) // Reduced from 15 to 5
  for (let i = 0; i < energyCount; i++) {
    const energyParticle = createEnergyParticle()
    animateEnergyParticle(energyParticle)
    particlePool.push(energyParticle)
  }

  console.log(`✅ Created ${particleCount + energyCount} particles`)
}

function createParticle() {
  const particle = engine.addEntity()
  Transform.create(particle, {
    position: Vector3.create(
      Math.random() * 16,
      Math.random() * 4 + 1,
      Math.random() * 16
    ),
    scale: Vector3.create(0.1, 0.1, 0.1)
  })
  MeshRenderer.setBox(particle)
  Material.setPbrMaterial(particle, {
    albedoColor: Color4.create(0, 1, 0.8, 0.6),
    roughness: 0.0,
    metallic: 0.5,
    emissiveColor: Color4.create(0, 1, 0.8, 1),
    emissiveIntensity: 3
  })
  return particle
}

function createEnergyParticle() {
  const energyParticle = engine.addEntity()
  Transform.create(energyParticle, {
    position: Vector3.create(
      8 + (Math.random() - 0.5) * 4,
      2 + Math.random() * 2,
      8 + (Math.random() - 0.5) * 4
    ),
    scale: Vector3.create(0.15, 0.15, 0.15)
  })
  MeshRenderer.setBox(energyParticle)
  Material.setPbrMaterial(energyParticle, {
    albedoColor: Color4.create(1, 0.8, 0.2, 0.7),
    roughness: 0.1,
    metallic: 0.8,
    emissiveColor: Color4.create(1, 0.8, 0.2, 1),
    emissiveIntensity: 5
  })
  return energyParticle
}

// Simple particle animation with pooling optimization - DISABLED FOR PERFORMANCE
function animateParticle(particle: any) {
  // DISABLED - Too many animations causing performance issues
  console.log('⚠️ Particle animation disabled for performance')
  return
}

// Energy particle animation with pooling optimization - DISABLED FOR PERFORMANCE
function animateEnergyParticle(particle: any) {
  // DISABLED - Too many animations causing performance issues
  console.log('⚠️ Energy particle animation disabled for performance')
  return
}

// Cleanup function to prevent memory leaks
export function cleanupEnhancedScene() {
  if (systemUpdateInterval) clearInterval(systemUpdateInterval)
  if (diagnosticsInterval) clearInterval(diagnosticsInterval)
  if (alertsInterval) clearInterval(alertsInterval)

  // Clean up particle pool
  particlePool.forEach(particle => {
    engine.removeEntity(particle)
  })
  particlePool.length = 0

  // Clean up all systems
  soundSystem.cleanup()
  lightingSystem.cleanup()
  npcManager.cleanup()
  dataVizManager.cleanup()
  uiSystem.cleanup()
  weatherSystem.cleanup()
  multiplayerSystem.cleanup()
  avatarSystem.cleanup()
  smartRoomSystem.cleanup()
  gestureSystem.cleanup()
  whiteboardSystem.cleanup()
  voiceCommandSystem.cleanup()
  blockchainSystem.cleanup()
  arIntegrationSystem.cleanup()
  contentManagementSystem.cleanup()
  physicsSystem.cleanup()
  proceduralSystem.cleanup()
  emotionDetectionSystem.cleanup()
  crossPlatformSyncSystem.cleanup()
  analyticsDashboardSystem.cleanup()
  hapticFeedbackSystem.cleanup()
}

// Initialize the enhanced scene
enhancedMain()
