// Haptic Feedback System for AIGestion Virtual Office
import { engine, InputAction, Material, MeshRenderer, pointerEventsSystem, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { soundSystem } from './enhanced-sound'

interface HapticDevice {
  id: string
  name: string
  type: 'controller' | 'glove' | 'vest' | 'chair' | 'floor' | 'touchscreen'
  isConnected: boolean
  capabilities: HapticCapabilities
  intensity: number
  batteryLevel: number
}

interface HapticCapabilities {
  supportsVibration: boolean
  supportsForceFeedback: boolean
  supportsTemperature: boolean
  supportsTexture: boolean
  maxIntensity: number
  responseTime: number
  channels: number
}

interface HapticPattern {
  id: string
  name: string
  type: PatternType
  duration: number
  intensity: number
  waveforms: HapticWaveform[]
  loops: boolean
  fadeIn: number
  fadeOut: number
}

type PatternType = 'click' | 'impact' | 'texture' | 'pulse' | 'wave' | 'custom' | 'continuous'

interface HapticWaveform {
  channel: number
  frequency: number
  amplitude: number
  duration: number
  waveform: 'sine' | 'square' | 'triangle' | 'sawtooth' | 'noise'
  phase: number
}

interface HapticEvent {
  id: string
  type: HapticEventType
  source: string
  position: Vector3
  intensity: number
  pattern?: string
  timestamp: number
  processed: boolean
}

type HapticEventType = 'touch' | 'collision' | 'interaction' | 'notification' | 'feedback' | 'alert' | 'ambient'

interface HapticZone {
  id: string
  name: string
  position: Vector3
  size: Vector3
  sensitivity: number
  devices: string[]
  isActive: boolean
  effects: HapticEffect[]
}

interface HapticEffect {
  type: 'vibration' | 'heat' | 'cool' | 'texture' | 'pressure'
  intensity: number
  duration: number
  pattern?: string
}

export class HapticFeedbackSystem {
  private devices: Map<string, HapticDevice> = new Map()
  private patterns: Map<string, HapticPattern> = new Map()
  private zones: Map<string, HapticZone> = new Map()
  private hapticUI: any
  private isInitialized: boolean = false
  private activeEvents: Map<string, HapticEvent> = new Map()
  private globalIntensity: number = 0.8
  private isSystemEnabled: boolean = true
  private hapticEngine: any

  constructor() {
    this.initializeHapticEngine()
  }

  // Initialize haptic feedback system
  initialize() {
    console.log('🎯 Haptic Feedback System Initializing...')

    this.setupHapticDevices()
    this.createHapticPatterns()
    this.createHapticZones()
    this.createHapticUI()
    this.startHapticEngine()

    this.isInitialized = true
    console.log('🎯 Haptic Feedback System Ready!')
  }

  // Initialize haptic engine
  private initializeHapticEngine() {
    this.hapticEngine = {
      playPattern: (device: HapticDevice, pattern: HapticPattern, intensity: number) => {
        console.log(`📳 Playing pattern ${pattern.name} on ${device.name}`)

        // Simulate haptic playback
        const effectiveIntensity = Math.min(intensity * device.intensity * this.globalIntensity, device.capabilities.maxIntensity)

        return {
          success: true,
          duration: pattern.duration,
          intensity: effectiveIntensity
        }
      },

      stopPattern: (device: HapticDevice, patternId: string) => {
        console.log(`🛑 Stopping pattern ${patternId} on ${device.name}`)
        return { success: true }
      },

      playWaveform: (device: HapticDevice, waveform: HapticWaveform, intensity: number) => {
        console.log(`🌊 Playing waveform on ${device.name}`)
        return { success: true }
      },

      setIntensity: (device: HapticDevice, intensity: number) => {
        device.intensity = Math.max(0, Math.min(1, intensity))
        return { success: true }
      }
    }
  }

  // Setup haptic devices
  private setupHapticDevices() {
    // VR Controller
    const vrController: HapticDevice = {
      id: 'device_vr_controller',
      name: 'VR Controller',
      type: 'controller',
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: true,
        supportsTemperature: false,
        supportsTexture: true,
        maxIntensity: 1.0,
        responseTime: 10,
        channels: 2
      },
      intensity: 0.8,
      batteryLevel: 0.85
    }

    // Haptic Glove
    const hapticGlove: HapticDevice = {
      id: 'device_haptic_glove',
      name: 'Haptic Glove',
      type: 'glove',
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: true,
        supportsTemperature: true,
        supportsTexture: true,
        maxIntensity: 0.9,
        responseTime: 15,
        channels: 5
      },
      intensity: 0.7,
      batteryLevel: 0.6
    }

    // Haptic Vest
    const hapticVest: HapticDevice = {
      id: 'device_haptic_vest',
      name: 'Haptic Vest',
      type: 'vest',
      isConnected: false,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: false,
        supportsTemperature: true,
        supportsTexture: false,
        maxIntensity: 1.0,
        responseTime: 25,
        channels: 8
      },
      intensity: 0.6,
      batteryLevel: 0.4
    }

    // Haptic Chair
    const hapticChair: HapticDevice = {
      id: 'device_haptic_chair',
      name: 'Haptic Chair',
      type: 'chair',
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: true,
        supportsTemperature: true,
        supportsTexture: false,
        maxIntensity: 0.8,
        responseTime: 30,
        channels: 4
      },
      intensity: 0.5,
      batteryLevel: 0.9
    }

    // Touchscreen
    const touchscreen: HapticDevice = {
      id: 'device_touchscreen',
      name: 'Touchscreen',
      type: 'touchscreen',
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: false,
        supportsTemperature: false,
        supportsTexture: true,
        maxIntensity: 0.7,
        responseTime: 5,
        channels: 1
      },
      intensity: 0.6,
      batteryLevel: 1.0
    }

    this.devices.set(vrController.id, vrController)
    this.devices.set(hapticGlove.id, hapticGlove)
    this.devices.set(hapticVest.id, hapticVest)
    this.devices.set(hapticChair.id, hapticChair)
    this.devices.set(touchscreen.id, touchscreen)

    console.log('📱 Haptic devices configured')
  }

  // Create haptic patterns
  private createHapticPatterns() {
    // Click pattern
    const clickPattern: HapticPattern = {
      id: 'pattern_click',
      name: 'Click',
      type: 'click',
      duration: 100,
      intensity: 0.6,
      waveforms: [
        {
          channel: 0,
          frequency: 200,
          amplitude: 0.8,
          duration: 50,
          waveform: 'sine',
          phase: 0
        }
      ],
      loops: false,
      fadeIn: 0,
      fadeOut: 20
    }

    // Impact pattern
    const impactPattern: HapticPattern = {
      id: 'pattern_impact',
      name: 'Impact',
      type: 'impact',
      duration: 200,
      intensity: 0.9,
      waveforms: [
        {
          channel: 0,
          frequency: 100,
          amplitude: 1.0,
          duration: 100,
          waveform: 'square',
          phase: 0
        },
        {
          channel: 1,
          frequency: 50,
          amplitude: 0.6,
          duration: 150,
          waveform: 'sine',
          phase: 0
        }
      ],
      loops: false,
      fadeIn: 0,
      fadeOut: 50
    }

    // Pulse pattern
    const pulsePattern: HapticPattern = {
      id: 'pattern_pulse',
      name: 'Pulse',
      type: 'pulse',
      duration: 500,
      intensity: 0.7,
      waveforms: [
        {
          channel: 0,
          frequency: 80,
          amplitude: 0.8,
          duration: 250,
          waveform: 'sine',
          phase: 0
        }
      ],
      loops: true,
      fadeIn: 50,
      fadeOut: 50
    }

    // Texture pattern
    const texturePattern: HapticPattern = {
      id: 'pattern_texture',
      name: 'Texture',
      type: 'texture',
      duration: 1000,
      intensity: 0.4,
      waveforms: [
        {
          channel: 0,
          frequency: 150,
          amplitude: 0.5,
          duration: 100,
          waveform: 'noise',
          phase: 0
        },
        {
          channel: 1,
          frequency: 200,
          amplitude: 0.3,
          duration: 100,
          waveform: 'noise',
          phase: Math.PI
        }
      ],
      loops: true,
      fadeIn: 100,
      fadeOut: 100
    }

    // Ambient pattern
    const ambientPattern: HapticPattern = {
      id: 'pattern_ambient',
      name: 'Ambient',
      type: 'ambient',
      duration: 0,
      intensity: 0.2,
      waveforms: [
        {
          channel: 0,
          frequency: 30,
          amplitude: 0.3,
          duration: 1000,
          waveform: 'sine',
          phase: 0
        }
      ],
      loops: true,
      fadeIn: 500,
      fadeOut: 500
    }

    this.patterns.set(clickPattern.id, clickPattern)
    this.patterns.set(impactPattern.id, impactPattern)
    this.patterns.set(pulsePattern.id, pulsePattern)
    this.patterns.set(texturePattern.id, texturePattern)
    this.patterns.set(ambientPattern.id, ambientPattern)

    console.log('🎵 Haptic patterns created')
  }

  // Create haptic zones
  private createHapticZones() {
    // Desktop zone
    const desktopZone: HapticZone = {
      id: 'zone_desktop',
      name: 'Desktop',
      position: Vector3.create(8, 1, 8),
      size: Vector3.create(3, 1, 3),
      sensitivity: 0.8,
      devices: ['device_haptic_chair'],
      isActive: true,
      effects: [
        {
          type: 'vibration',
          intensity: 0.3,
          duration: 200,
          pattern: 'pattern_ambient'
        }
      ]
    }

    // Interaction zone
    const interactionZone: HapticZone = {
      id: 'zone_interaction',
      name: 'Interaction Area',
      position: Vector3.create(8, 2, 8),
      size: Vector3.create(2, 2, 2),
      sensitivity: 1.0,
      devices: ['device_vr_controller', 'device_haptic_glove'],
      isActive: true,
      effects: []
    }

    // Floor zone
    const floorZone: HapticZone = {
      id: 'zone_floor',
      name: 'Floor',
      position: Vector3.create(8, 0, 8),
      size: Vector3.create(10, 0.1, 10),
      sensitivity: 0.5,
      devices: ['device_haptic_vest'],
      isActive: false,
      effects: []
    }

    this.zones.set(desktopZone.id, desktopZone)
    this.zones.set(interactionZone.id, interactionZone)
    this.zones.set(floorZone.id, floorZone)

    console.log('🗺️ Haptic zones created')
  }

  // Create haptic UI
  private createHapticUI() {
    this.hapticUI = engine.addEntity()
    Transform.create(this.hapticUI, {
      position: Vector3.create(14, 3, 2),
      scale: Vector3.create(3, 4, 0.1)
    })
    MeshRenderer.setBox(this.hapticUI)
    Material.setPbrMaterial(this.hapticUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    })

    const title = engine.addEntity()
    Transform.create(title, {
      parent: this.hapticUI,
      position: Vector3.create(0, 1.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(title, {
      text: '🎯 HAPTIC FEEDBACK',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    })

    // Create device indicators
    this.createDeviceIndicators()

    // Create pattern controls
    this.createPatternControls()

    // Create intensity controls
    this.createIntensityControls()

    // Create zone controls
    this.createZoneControls()
  }

  // Create device indicators
  private createDeviceIndicators() {
    const devices = Array.from(this.devices.values())
    let xOffset = -1.2

    devices.forEach(device => {
      const indicator = engine.addEntity()
      Transform.create(indicator, {
        parent: this.hapticUI,
        position: Vector3.create(xOffset, 1.2, 0.1),
        scale: Vector3.create(0.2, 0.2, 0.1)
      })
      MeshRenderer.setBox(indicator)
      Material.setPbrMaterial(indicator, {
        albedoColor: device.isConnected ? Color4.create(0.2, 0.8, 0.2, 1) : Color4.create(0.8, 0.2, 0.2, 1),
        emissiveColor: device.isConnected ? Color4.create(0.2, 0.8, 0.2, 0.5) : Color4.create(0.8, 0.2, 0.2, 0.5),
        emissiveIntensity: device.isConnected ? 2 : 0.5
      })

      const deviceText = engine.addEntity()
      Transform.create(deviceText, {
        parent: indicator,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5)
      })
      TextShape.create(deviceText, {
        text: this.getDeviceIcon(device.type),
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      })

      pointerEventsSystem.onPointerDown(
        {
          entity: indicator,
          opts: { button: InputAction.IA_POINTER, hoverText: device.name }
        },
        () => this.toggleDevice(device.id)
      )

      xOffset += 0.4
    })
  }

  // Create pattern controls
  private createPatternControls() {
    const patterns = ['click', 'impact', 'pulse', 'texture', 'ambient']
    let xOffset = -1.0

    patterns.forEach(pattern => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.hapticUI,
        position: Vector3.create(xOffset, 0.6, 0.1),
        scale: Vector3.create(0.2, 0.2, 0.1)
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
        text: this.getPatternIcon(pattern),
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      })

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: `Play ${pattern}` }
        },
        () => this.playPattern(pattern)
      )

      xOffset += 0.4
    })
  }

  // Create intensity controls
  private createIntensityControls() {
    const intensitySlider = engine.addEntity()
    Transform.create(intensitySlider, {
      parent: this.hapticUI,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(2, 0.2, 0.1)
    })
    MeshRenderer.setBox(intensitySlider)
    Material.setPbrMaterial(intensitySlider, {
      albedoColor: Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    })

    const intensityText = engine.addEntity()
    Transform.create(intensityText, {
      parent: intensitySlider,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(intensityText, {
      text: `🔊 Intensity: ${(this.globalIntensity * 100).toFixed(0)}%`,
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    })

    pointerEventsSystem.onPointerDown(
      {
        entity: intensitySlider,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Adjust Intensity' }
      },
      () => this.adjustIntensity()
    )
  }

  // Create zone controls
  private createZoneControls() {
    const zones = Array.from(this.zones.values())
    let xOffset = -0.8

    zones.forEach(zone => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.hapticUI,
        position: Vector3.create(xOffset, -0.4, 0.1),
        scale: Vector3.create(0.2, 0.2, 0.1)
      })
      MeshRenderer.setBox(button)
      Material.setPbrMaterial(button, {
        albedoColor: zone.isActive ? Color4.create(0.2, 0.8, 0.2, 1) : Color4.create(0.8, 0.2, 0.2, 1),
        emissiveColor: zone.isActive ? Color4.create(0.2, 0.8, 0.2, 0.5) : Color4.create(0.8, 0.2, 0.2, 0.5),
        emissiveIntensity: zone.isActive ? 2 : 0.5
      })

      const zoneText = engine.addEntity()
      Transform.create(zoneText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5)
      })
      TextShape.create(zoneText, {
        text: zone.name,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 1.2,
        textAlign: 3
      })

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: `Toggle ${zone.name}` }
        },
        () => this.toggleZone(zone.id)
      )

      xOffset += 0.6
    })
  }

  // Get device icon
  private getDeviceIcon(type: HapticDevice['type']): string {
    switch (type) {
      case 'controller': return '🎮'
      case 'glove': return '🧤'
      case 'vest': return '🦺'
      case 'chair': return '🪑'
      case 'touchscreen': return '📱'
      default: return '📱'
    }
  }

  // Get pattern icon
  private getPatternIcon(pattern: string): string {
    switch (pattern) {
      case 'click': return '👆'
      case 'impact': return '💥'
      case 'pulse': return '💗'
      case 'texture': return '🌊'
      case 'ambient': return '🌊'
      default: return '📳'
    }
  }

  // Start haptic engine
  private startHapticEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return

      this.processHapticEvents()
      this.updateDeviceStatus()
      this.updateZoneEffects()
    })
  }

  // Process haptic events
  private processHapticEvents() {
    this.activeEvents.forEach((event, id) => {
      if (event.processed) return

      // Find affected zone
      const zone = this.findZone(event.position)
      if (!zone || !zone.isActive) return

      // Find suitable devices
      const devices = this.findDevicesForZone(zone)
      if (devices.length === 0) return

      // Apply haptic feedback
      this.applyHapticFeedback(event, zone, devices)

      event.processed = true
    })

    // Clean up processed events
    this.activeEvents.forEach((event, id) => {
      if (event.processed && Date.now() - event.timestamp > 5000) {
        this.activeEvents.delete(id)
      }
    })
  }

  // Find zone for position
  private findZone(position: Vector3): HapticZone | null {
    for (const zone of this.zones.values()) {
      const distance = Vector3.distance(position, zone.position)
      if (distance <= Math.max(zone.size.x, zone.size.y, zone.size.z) / 2) {
        return zone
      }
    }
    return null
  }

  // Find devices for zone
  private findDevicesForZone(zone: HapticZone): HapticDevice[] {
    return Array.from(this.devices.values()).filter(device =>
      device.isConnected && zone.devices.includes(device.id)
    )
  }

  // Apply haptic feedback
  private applyHapticFeedback(event: HapticEvent, zone: HapticZone, devices: HapticDevice[]) {
    const intensity = event.intensity * zone.sensitivity * this.globalIntensity

    devices.forEach(device => {
      if (event.pattern) {
        const pattern = this.patterns.get(event.pattern)
        if (pattern) {
          this.hapticEngine.playPattern(device, pattern, intensity)
        }
      } else {
        // Use default pattern based on event type
        const defaultPattern = this.getDefaultPattern(event.type)
        if (defaultPattern) {
          this.hapticEngine.playPattern(device, defaultPattern, intensity)
        }
      }
    })
  }

  // Get default pattern
  private getDefaultPattern(eventType: HapticEventType): HapticPattern | null {
    switch (eventType) {
      case 'touch':
      case 'interaction':
        return this.patterns.get('pattern_click')
      case 'collision':
        return this.patterns.get('pattern_impact')
      case 'feedback':
        return this.patterns.get('pattern_pulse')
      case 'alert':
        return this.patterns.get('pattern_pulse')
      case 'ambient':
        return this.patterns.get('pattern_ambient')
      default:
        return null
    }
  }

  // Update device status
  private updateDeviceStatus() {
    // Simulate battery level changes
    this.devices.forEach((device, id) => {
      if (Math.random() < 0.001) {
        device.batteryLevel = Math.max(0, device.batteryLevel - 0.01)

        if (device.batteryLevel < 0.1) {
          device.isConnected = false
          console.log(`🔋 Device ${device.name} battery low`)
        }
      }
    })
  }

  // Update zone effects
  private updateZoneEffects() {
    this.zones.forEach(zone => {
      if (zone.isActive && zone.effects.length > 0) {
        zone.effects.forEach(effect => {
          if (effect.type === 'vibration' && effect.pattern) {
            const devices = this.findDevicesForZone(zone)
            devices.forEach(device => {
              const pattern = this.patterns.get(effect.pattern)
              if (pattern) {
                this.hapticEngine.playPattern(device, pattern, effect.intensity)
              }
            })
          }
        })
      }
    })
  }

  // Trigger haptic event
  public triggerHapticEvent(event: HapticEvent) {
    if (!this.isSystemEnabled) return

    event.id = `event_${Date.now()}_${Math.random()}`
    event.timestamp = Date.now()
    event.processed = false

    this.activeEvents.set(event.id, event)
    console.log(`🎯 Triggered haptic event: ${event.type}`)
  }

  // Play pattern
  public playPattern(patternId: string, intensity?: number) {
    const pattern = this.patterns.get(patternId)
    if (!pattern) return

    const effectiveIntensity = intensity || pattern.intensity

    // Play on all connected devices
    this.devices.forEach(device => {
      if (device.isConnected) {
        this.hapticEngine.playPattern(device, pattern, effectiveIntensity)
      }
    })

    console.log(`🎵 Playing pattern: ${pattern.name}`)
    soundSystem.playInteractionSound('click')
  }

  // Stop pattern
  public stopPattern(patternId: string) {
    this.devices.forEach(device => {
      if (device.isConnected) {
        this.hapticEngine.stopPattern(device, patternId)
      }
    })

    console.log(`🛑 Stopped pattern: ${patternId}`)
  }

  // Toggle device
  public toggleDevice(deviceId: string) {
    const device = this.devices.get(deviceId)
    if (!device) return

    device.isConnected = !device.isConnected
    console.log(`${device.isConnected ? '🔗' : '🔌'} Device ${device.name} ${device.isConnected ? 'connected' : 'disconnected'}`)
    soundSystem.playInteractionSound('click')
  }

  // Toggle zone
  public toggleZone(zoneId: string) {
    const zone = this.zones.get(zoneId)
    if (!zone) return

    zone.isActive = !zone.isActive
    console.log(`${zone.isActive ? '✅' : '❌'} Zone ${zone.name} ${zone.isActive ? 'activated' : 'deactivated'}`)
    soundSystem.playInteractionSound('click')
  }

  // Adjust intensity
  public adjustIntensity() {
    // Cycle through intensity levels
    const levels = [0.2, 0.4, 0.6, 0.8, 1.0]
    const currentIndex = levels.indexOf(this.globalIntensity)
    const nextIndex = (currentIndex + 1) % levels.length
    this.globalIntensity = levels[nextIndex]

    console.log(`🔊 Global intensity set to: ${(this.globalIntensity * 100).toFixed(0)}%`)
    soundSystem.playInteractionSound('click')
  }

  // Set global intensity
  public setGlobalIntensity(intensity: number) {
    this.globalIntensity = Math.max(0, Math.min(1, intensity))
    console.log(`🔊 Global intensity set to: ${(this.globalIntensity * 100).toFixed(0)}%`)
  }

  // Enable/disable system
  public setSystemEnabled(enabled: boolean) {
    this.isSystemEnabled = enabled
    console.log(`🎯 Haptic system ${enabled ? 'enabled' : 'disabled'}`)

    if (!enabled) {
      // Stop all active patterns
      this.devices.forEach(device => {
        if (device.isConnected) {
          this.patterns.forEach(pattern => {
            this.hapticEngine.stopPattern(device, pattern.id)
          })
        }
      })
    }
  }

  // Get connected devices
  public getConnectedDevices(): HapticDevice[] {
    return Array.from(this.devices.values()).filter(device => device.isConnected)
  }

  // Get all devices
  public getAllDevices(): HapticDevice[] {
    return Array.from(this.devices.values())
  }

  // Get active zones
  public getActiveZones(): HapticZone[] {
    return Array.from(this.zones.values()).filter(zone => zone.isActive)
  }

  // Get available patterns
  public getAvailablePatterns(): HapticPattern[] {
    return Array.from(this.patterns.values())
  }

  // Create custom pattern
  public createCustomPattern(pattern: Omit<HapticPattern, 'id'>): HapticPattern {
    const newPattern: HapticPattern = {
      ...pattern,
      id: `pattern_custom_${Date.now()}_${Math.random()}`
    }

    this.patterns.set(newPattern.id, newPattern)
    console.log(`🎵 Created custom pattern: ${newPattern.name}`)
    return newPattern
  }

  // Create custom zone
  public createCustomZone(zone: Omit<HapticZone, 'id'>): HapticZone {
    const newZone: HapticZone = {
      ...zone,
      id: `zone_custom_${Date.now()}_${Math.random()}`
    }

    this.zones.set(newZone.id, newZone)
    console.log(`🗺️ Created custom zone: ${newZone.name}`)
    return newZone
  }

  // Get system statistics
  public getSystemStatistics(): any {
    return {
      totalDevices: this.devices.size,
      connectedDevices: this.getConnectedDevices().length,
      totalPatterns: this.patterns.size,
      totalZones: this.zones.size,
      activeZones: this.getActiveZones().length,
      activeEvents: this.activeEvents.size,
      globalIntensity: this.globalIntensity,
      systemEnabled: this.isSystemEnabled
    }
  }

  // Cleanup system
  public cleanup() {
    this.devices.clear()
    this.patterns.clear()
    this.zones.clear()
    this.activeEvents.clear()

    if (this.hapticUI) {
      engine.removeEntity(this.hapticUI)
    }

    this.isInitialized = false
  }
}

// Export singleton instance
export const hapticFeedbackSystem = new HapticFeedbackSystem()
