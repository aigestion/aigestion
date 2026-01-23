// AR Overlay Integration for Mobile Devices
import { engine, InputAction, Material, MeshRenderer, pointerEventsSystem, Transform } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { soundSystem } from './enhanced-sound'

interface ARDevice {
  id: string
  name: string
  type: 'smartphone' | 'tablet' | 'ar_glasses'
  isConnected: boolean
  position: Vector3
  rotation: Quaternion
  camera: ARCamera
  capabilities: ARCapabilities
}

interface ARCamera {
  fov: number
  aspectRatio: number
  nearPlane: number
  farPlane: number
  trackingMode: 'world' | 'face' | 'image'
}

interface ARCapabilities {
  supportsPlaneDetection: boolean
  supportsImageTracking: boolean
  supportsFaceTracking: boolean
  supportsOcclusion: boolean
  supportsLightEstimation: boolean
  maxAnchors: number
}

interface AROverlay {
  id: string
  type: 'ui' | '3d_model' | 'text' | 'video' | 'data'
  content: any
  position: Vector3
  rotation: Quaternion
  scale: Vector3
  anchorType: 'world' | 'face' | 'image' | 'plane'
  anchorId?: string
  isVisible: boolean
  isInteractive: boolean
}

interface ARAnchor {
  id: string
  type: 'plane' | 'image' | 'face' | 'world'
  position: Vector3
  rotation: Quaternion
  confidence: number
  trackingState: 'tracking' | 'limited' | 'not_tracking'
}

interface ARSession {
  id: string
  device: ARDevice
  isActive: boolean
  anchors: Map<string, ARAnchor>
  overlays: Map<string, AROverlay>
  trackingQuality: 'high' | 'medium' | 'low'
  planeDetection: boolean
  lightEstimation: boolean
}

export class ARIntegrationSystem {
  private devices: Map<string, ARDevice> = new Map()
  private sessions: Map<string, ARSession> = new Map()
  private overlays: Map<string, AROverlay> = new Map()
  private currentSession: ARSession | null = null
  private arUI: any
  private isInitialized: boolean = false
  private arEngine: any
  private trackingSystem: any
  private renderingSystem: any

  constructor() {
    this.initializeAREngine()
    this.initializeTrackingSystem()
    this.initializeRenderingSystem()
  }

  // Initialize AR system
  initialize() {
    console.log('📱 AR Integration System Initializing...')

    this.setupARDevices()
    this.createARUI()
    this.startAREngine()
    this.setupARInteractions()

    this.isInitialized = true
    console.log('📱 AR Integration System Ready!')
  }

  // Initialize AR engine
  private initializeAREngine() {
    this.arEngine = {
      isSupported: true,
      isInitialized: false,
      session: null,

      initialize: () => {
        console.log('🔧 Initializing AR engine...')
        this.arEngine.isInitialized = true
      },

      startSession: (device: ARDevice) => {
        console.log(`🚀 Starting AR session on ${device.name}`)
        return {
          id: `session_${Date.now()}`,
          device: device,
          isActive: true
        }
      },

      stopSession: (sessionId: string) => {
        console.log(`🛑 Stopping AR session: ${sessionId}`)
      }
    }
  }

  // Initialize tracking system
  private initializeTrackingSystem() {
    this.trackingSystem = {
      isTracking: false,
      trackingQuality: 'high',
      detectedAnchors: [],

      startTracking: () => {
        console.log('🎯 Starting AR tracking...')
        this.trackingSystem.isTracking = true
      },

      stopTracking: () => {
        console.log('🛑 Stopping AR tracking...')
        this.trackingSystem.isTracking = false
      },

      detectPlanes: () => {
        // Simulate plane detection
        return [
          {
            id: 'plane_floor',
            type: 'horizontal',
            position: Vector3.create(0, 0, 0),
            size: Vector3.create(10, 0, 10)
          },
          {
            id: 'plane_wall',
            type: 'vertical',
            position: Vector3.create(0, 2, -5),
            size: Vector3.create(10, 4, 0)
          }
        ]
      },

      detectImages: () => {
        // Simulate image tracking
        return [
          {
            id: 'image_logo',
            position: Vector3.create(2, 1, 0),
            confidence: 0.95
          }
        ]
      }
    }
  }

  // Initialize rendering system
  private initializeRenderingSystem() {
    this.renderingSystem = {
      isRendering: false,
      frameRate: 60,
      resolution: { width: 1920, height: 1080 },

      startRendering: () => {
        console.log('🎨 Starting AR rendering...')
        this.renderingSystem.isRendering = true
      },

      stopRendering: () => {
        console.log('🛑 Stopping AR rendering...')
        this.renderingSystem.isRendering = false
      },

      renderFrame: (overlays: AROverlay[]) => {
        // Simulate rendering
        overlays.forEach(overlay => {
          if (overlay.isVisible) {
            console.log(`🎨 Rendering overlay: ${overlay.type}`)
          }
        })
      }
    }
  }

  // Setup AR devices
  private setupARDevices() {
    // Smartphone device
    const smartphone: ARDevice = {
      id: 'device_smartphone',
      name: 'Smartphone AR',
      type: 'smartphone',
      isConnected: false,
      position: Vector3.create(0, 0, 0),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      camera: {
        fov: 60,
        aspectRatio: 16 / 9,
        nearPlane: 0.1,
        farPlane: 100,
        trackingMode: 'world'
      },
      capabilities: {
        supportsPlaneDetection: true,
        supportsImageTracking: true,
        supportsFaceTracking: false,
        supportsOcclusion: true,
        supportsLightEstimation: true,
        maxAnchors: 20
      }
    }

    // Tablet device
    const tablet: ARDevice = {
      id: 'device_tablet',
      name: 'Tablet AR',
      type: 'tablet',
      isConnected: false,
      position: Vector3.create(0, 0, 0),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      camera: {
        fov: 45,
        aspectRatio: 4 / 3,
        nearPlane: 0.1,
        farPlane: 100,
        trackingMode: 'world'
      },
      capabilities: {
        supportsPlaneDetection: true,
        supportsImageTracking: true,
        supportsFaceTracking: false,
        supportsOcclusion: true,
        supportsLightEstimation: true,
        maxAnchors: 30
      }
    }

    // AR Glasses device
    const arGlasses: ARDevice = {
      id: 'device_ar_glasses',
      name: 'AR Glasses',
      type: 'ar_glasses',
      isConnected: false,
      position: Vector3.create(0, 0, 0),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      camera: {
        fov: 50,
        aspectRatio: 16 / 9,
        nearPlane: 0.05,
        farPlane: 50,
        trackingMode: 'world'
      },
      capabilities: {
        supportsPlaneDetection: true,
        supportsImageTracking: true,
        supportsFaceTracking: true,
        supportsOcclusion: true,
        supportsLightEstimation: true,
        maxAnchors: 50
      }
    }

    this.devices.set(smartphone.id, smartphone)
    this.devices.set(tablet.id, tablet)
    this.devices.set(arGlasses.id, arGlasses)

    console.log('📱 AR devices configured')
  }

  // Create AR UI
  private createARUI() {
    this.arUI = engine.addEntity()
    Transform.create(this.arUI, {
      position: Vector3.create(14, 3, 8),
      scale: Vector3.create(3, 4, 0.1)
    })
    MeshRenderer.setBox(this.arUI)
    Material.setPbrMaterial(this.arUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    })

    // Create title
    const title = engine.addEntity()
    Transform.create(title, {
      parent: this.arUI,
      position: Vector3.create(0, 1.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(title, {
      text: '📱 AR OVERLAY SYSTEM',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    })

    // Create device selection
    this.createDeviceSelection()

    // Create session controls
    this.createSessionControls()

    // Create overlay controls
    this.createOverlayControls()

    // Create status display
    this.createStatusDisplay()
  }

  // Create device selection
  private createDeviceSelection() {
    const deviceSection = engine.addEntity()
    Transform.create(deviceSection, {
      parent: this.arUI,
      position: Vector3.create(0, 1.2, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1)
    })
    MeshRenderer.setBox(deviceSection)
    Material.setPbrMaterial(deviceSection, {
      albedoColor: Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    })

    const deviceText = engine.addEntity()
    Transform.create(deviceText, {
      parent: deviceSection,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(deviceText, {
      text: '📱 Select Device',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    })

    // Device buttons
    let xOffset = -0.6
    this.devices.forEach((device, id) => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.arUI,
        position: Vector3.create(xOffset, 0.8, 0.1),
        scale: Vector3.create(0.2, 0.2, 0.1)
      })
      MeshRenderer.setBox(button)
      Material.setPbrMaterial(button, {
        albedoColor: device.isConnected ? Color4.create(0.2, 0.8, 0.2, 1) : Color4.create(0.8, 0.2, 0.2, 1),
        emissiveColor: device.isConnected ? Color4.create(0.2, 0.8, 0.2, 0.5) : Color4.create(0.8, 0.2, 0.2, 0.5),
        emissiveIntensity: 2
      })

      const buttonText = engine.addEntity()
      Transform.create(buttonText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5)
      })
      TextShape.create(buttonText, {
        text: device.type === 'smartphone' ? '📱' : device.type === 'tablet' ? '📱' : '🥽',
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      })

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: device.name }
        },
        () => this.connectDevice(id)
      )

      xOffset += 0.6
    })
  }

  // Create session controls
  private createSessionControls() {
    const controls = [
      { id: 'start', icon: '▶️', name: 'Start Session' },
      { id: 'stop', icon: '⏹️', name: 'Stop Session' },
      { id: 'reset', icon: '🔄', name: 'Reset Tracking' }
    ]

    let xOffset = -0.8

    controls.forEach(control => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.arUI,
        position: Vector3.create(xOffset, 0.4, 0.1),
        scale: Vector3.create(0.25, 0.25, 0.1)
      })
      MeshRenderer.setBox(button)
      Material.setPbrMaterial(button, {
        albedoColor: Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      })

      const buttonText = engine.addEntity()
      Transform.create(buttonText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5)
      })
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      })

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleSessionControl(control.id)
      )

      xOffset += 0.8
    })
  }

  // Create overlay controls
  private createOverlayControls() {
    const overlayTypes = [
      { id: 'ui', icon: '🖼️', name: 'UI Overlay' },
      { id: '3d', icon: '🎮', name: '3D Model' },
      { id: 'text', icon: '📝', name: 'Text' },
      { id: 'data', icon: '📊', name: 'Data' }
    ]

    let xOffset = -0.9

    overlayTypes.forEach(type => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.arUI,
        position: Vector3.create(xOffset, 0, 0.1),
        scale: Vector3.create(0.2, 0.2, 0.1)
      })
      MeshRenderer.setBox(button)
      Material.setPbrMaterial(button, {
        albedoColor: Color4.create(0.6, 0.3, 0.8, 1),
        emissiveColor: Color4.create(0.6, 0.3, 0.8, 0.5),
        emissiveIntensity: 2
      })

      const buttonText = engine.addEntity()
      Transform.create(buttonText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5)
      })
      TextShape.create(buttonText, {
        text: type.icon,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      })

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: type.name }
        },
        () => this.createOverlay(type.id)
      )

      xOffset += 0.6
    })
  }

  // Create status display
  private createStatusDisplay() {
    const statusDisplay = engine.addEntity()
    Transform.create(statusDisplay, {
      parent: this.arUI,
      position: Vector3.create(0, -0.4, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1)
    })
    MeshRenderer.setBox(statusDisplay)
    Material.setPbrMaterial(statusDisplay, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    })

    const statusText = engine.addEntity()
    Transform.create(statusText, {
      parent: statusDisplay,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(statusText, {
      text: '📊 Status: Ready',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    })
  }

  // Start AR engine
  private startAREngine() {
    this.arEngine.initialize()
    this.trackingSystem.startTracking()
    this.renderingSystem.startRendering()

    engine.addSystem(() => {
      if (!this.isInitialized) return

      this.updateARSession()
      this.processOverlays()
      this.updateTracking()
    })
  }

  // Setup AR interactions
  private setupARInteractions() {
    // Handle device connections
    // Handle overlay interactions
    // Handle tracking events
  }

  // Connect device
  public connectDevice(deviceId: string) {
    const device = this.devices.get(deviceId)
    if (!device) return

    device.isConnected = true
    console.log(`📱 Connected to ${device.name}`)

    // Start AR session
    this.startARSession(device)

    soundSystem.playInteractionSound('powerup')
  }

  // Disconnect device
  public disconnectDevice(deviceId: string) {
    const device = this.devices.get(deviceId)
    if (!device) return

    device.isConnected = false
    console.log(`📱 Disconnected from ${device.name}`)

    // Stop AR session
    if (this.currentSession && this.currentSession.device.id === deviceId) {
      this.stopARSession()
    }

    soundSystem.playInteractionSound('click')
  }

  // Start AR session
  private startARSession(device: ARDevice) {
    const sessionData = this.arEngine.startSession(device)

    const session: ARSession = {
      id: sessionData.id,
      device: device,
      isActive: true,
      anchors: new Map(),
      overlays: new Map(),
      trackingQuality: 'high',
      planeDetection: true,
      lightEstimation: true
    }

    this.sessions.set(session.id, session)
    this.currentSession = session

    console.log(`🚀 AR session started: ${session.id}`)

    // Start detecting anchors
    this.startAnchorDetection()
  }

  // Stop AR session
  private stopARSession() {
    if (!this.currentSession) return

    this.arEngine.stopSession(this.currentSession.id)
    this.sessions.delete(this.currentSession.id)
    this.currentSession = null

    console.log('🛑 AR session stopped')
  }

  // Start anchor detection
  private startAnchorDetection() {
    if (!this.currentSession) return

    // Detect planes
    if (this.currentSession.device.capabilities.supportsPlaneDetection) {
      const planes = this.trackingSystem.detectPlanes()
      planes.forEach(plane => {
        const anchor: ARAnchor = {
          id: plane.id,
          type: 'plane',
          position: plane.position,
          rotation: Quaternion.fromEulerDegrees(0, 0, 0),
          confidence: 0.9,
          trackingState: 'tracking'
        }
        this.currentSession!.anchors.set(anchor.id, anchor)
      })
    }

    // Detect images
    if (this.currentSession.device.capabilities.supportsImageTracking) {
      const images = this.trackingSystem.detectImages()
      images.forEach(image => {
        const anchor: ARAnchor = {
          id: image.id,
          type: 'image',
          position: image.position,
          rotation: Quaternion.fromEulerDegrees(0, 0, 0),
          confidence: image.confidence,
          trackingState: 'tracking'
        }
        this.currentSession!.anchors.set(anchor.id, anchor)
      })
    }
  }

  // Handle session control
  private handleSessionControl(controlId: string) {
    switch (controlId) {
      case 'start':
        if (this.currentSession) {
          console.log('🚀 Session already active')
        } else {
          // Start with first available device
          const firstDevice = Array.from(this.devices.values())[0]
          if (firstDevice) {
            this.connectDevice(firstDevice.id)
          }
        }
        break
      case 'stop':
        this.stopARSession()
        break
      case 'reset':
        this.resetTracking()
        break
    }

    soundSystem.playInteractionSound('click')
  }

  // Create overlay
  private createOverlay(type: string) {
    if (!this.currentSession) {
      console.log('❌ No active AR session')
      return
    }

    const overlay: AROverlay = {
      id: `overlay_${Date.now()}`,
      type: type as AROverlay['type'],
      content: this.generateOverlayContent(type),
      position: Vector3.create(
        Math.random() * 4 - 2,
        Math.random() * 2 + 1,
        Math.random() * 2 - 1
      ),
      rotation: Quaternion.fromEulerDegrees(0, Math.random() * 360, 0),
      scale: Vector3.create(1, 1, 1),
      anchorType: 'world',
      isVisible: true,
      isInteractive: true
    }

    this.overlays.set(overlay.id, overlay)
    this.currentSession.overlays.set(overlay.id, overlay)

    console.log(`🎨 Created ${type} overlay: ${overlay.id}`)
    soundSystem.playInteractionSound('click')
  }

  // Generate overlay content
  private generateOverlayContent(type: string): any {
    switch (type) {
      case 'ui':
        return {
          title: 'AR UI Panel',
          elements: ['Button', 'Slider', 'Text'],
          layout: 'vertical'
        }
      case '3d':
        return {
          model: 'cube',
          material: 'metallic',
          animations: ['rotate', 'pulse']
        }
      case 'text':
        return {
          text: 'Hello AR World!',
          fontSize: 24,
          color: '#FFFFFF',
          font: 'Arial'
        }
      case 'data':
        return {
          chartType: 'bar',
          data: [10, 20, 30, 40, 50],
          labels: ['A', 'B', 'C', 'D', 'E']
        }
      default:
        return {}
    }
  }

  // Update AR session
  private updateARSession() {
    if (!this.currentSession) return

    // Update tracking quality
    const time = Date.now() / 1000
    const quality = Math.sin(time * 0.5) > 0 ? 'high' : 'medium'
    this.currentSession.trackingQuality = quality

    // Update device position (simulate movement)
    const device = this.currentSession.device
    device.position = Vector3.create(
      Math.sin(time * 0.3) * 0.5,
      Math.cos(time * 0.2) * 0.2,
      Math.sin(time * 0.4) * 0.3
    )
  }

  // Process overlays
  private processOverlays() {
    if (!this.currentSession) return

    // Render all overlays
    const overlays = Array.from(this.currentSession.overlays.values())
    this.renderingSystem.renderFrame(overlays)

    // Update overlay positions
    overlays.forEach(overlay => {
      if (overlay.isVisible) {
        // Add subtle animation
        const time = Date.now() / 1000
        overlay.position.y += Math.sin(time * 2 + parseInt(overlay.id)) * 0.001
      }
    })
  }

  // Update tracking
  private updateTracking() {
    if (!this.currentSession) return

    // Update anchor tracking states
    this.currentSession.anchors.forEach(anchor => {
      // Simulate tracking quality changes
      if (Math.random() < 0.01) {
        anchor.trackingState = anchor.trackingState === 'tracking' ? 'limited' : 'tracking'
      }
    })

    // Detect new anchors occasionally
    if (Math.random() < 0.005) {
      this.startAnchorDetection()
    }
  }

  // Reset tracking
  private resetTracking() {
    if (!this.currentSession) return

    console.log('🔄 Resetting AR tracking...')

    // Clear all anchors
    this.currentSession.anchors.clear()

    // Restart detection
    this.startAnchorDetection()

    soundSystem.playInteractionSound('powerup')
  }

  // Get current session
  public getCurrentSession(): ARSession | null {
    return this.currentSession
  }

  // Get all devices
  public getDevices(): ARDevice[] {
    return Array.from(this.devices.values())
  }

  // Get connected devices
  public getConnectedDevices(): ARDevice[] {
    return Array.from(this.devices.values()).filter(device => device.isConnected)
  }

  // Get overlays
  public getOverlays(): AROverlay[] {
    return Array.from(this.overlays.values())
  }

  // Update overlay visibility
  public setOverlayVisibility(overlayId: string, isVisible: boolean) {
    const overlay = this.overlays.get(overlayId)
    if (overlay) {
      overlay.isVisible = isVisible
      console.log(`👁️ Overlay ${overlayId} ${isVisible ? 'shown' : 'hidden'}`)
    }
  }

  // Update overlay position
  public updateOverlayPosition(overlayId: string, position: Vector3) {
    const overlay = this.overlays.get(overlayId)
    if (overlay) {
      overlay.position = position
      console.log(`📍 Moved overlay ${overlayId} to position`)
    }
  }

  // Remove overlay
  public removeOverlay(overlayId: string) {
    const overlay = this.overlays.get(overlayId)
    if (overlay) {
      this.overlays.delete(overlayId)
      if (this.currentSession) {
        this.currentSession.overlays.delete(overlayId)
      }
      console.log(`🗑️ Removed overlay: ${overlayId}`)
    }
  }

  // Cleanup system
  public cleanup() {
    this.stopARSession()

    this.devices.clear()
    this.sessions.clear()
    this.overlays.clear()

    if (this.arUI) {
      engine.removeEntity(this.arUI)
    }

    this.trackingSystem.stopTracking()
    this.renderingSystem.stopRendering()

    this.isInitialized = false
  }
}

// Export singleton instance
export const arIntegrationSystem = new ARIntegrationSystem()
