// Cross-Platform Synchronization for AIGestion Virtual Office
import { engine, InputAction, Material, MeshRenderer, pointerEventsSystem, Transform } from '@dcl/sdk/ecs'
import { setTimeout, setInterval } from './utils/timers'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { soundSystem } from './enhanced-sound'

interface SyncSession {
  id: string
  name: string
  platform: Platform
  status: 'active' | 'inactive' | 'syncing' | 'error'
  participants: SyncParticipant[]
  lastSync: number
  syncInterval: number
  dataSync: DataSync
  conflictResolution: ConflictResolution
}

interface SyncParticipant {
  id: string
  name: string
  platform: Platform
  role: 'host' | 'participant' | 'observer'
  permissions: SyncPermissions
  status: 'online' | 'offline' | 'away'
  lastSeen: number
}

interface DataSync {
  entities: Map<string, SyncEntity>
  settings: Map<string, SyncSetting>
  events: SyncEvent[]
  conflicts: SyncConflict[]
  version: number
}

interface SyncEntity {
  id: string
  type: 'position' | 'rotation' | 'scale' | 'material' | 'animation' | 'custom'
  data: any
  timestamp: number
  author: string
  version: number
  conflicts: string[]
}

interface SyncSetting {
  key: string
  value: any
  type: 'boolean' | 'number' | 'string' | 'object'
  timestamp: number
  author: string
  priority: number
}

interface SyncEvent {
  id: string
  type: 'create' | 'update' | 'delete' | 'move' | 'interact'
  target: string
  data: any
  timestamp: number
  author: string
  platform: Platform
}

interface SyncConflict {
  id: string
  type: 'data' | 'version' | 'permission'
  entity: string
  changes: ConflictChange[]
  timestamp: number
  status: 'pending' | 'resolved' | 'ignored'
}

interface ConflictChange {
  author: string
  platform: Platform
  data: any
  timestamp: number
}

interface ConflictResolution {
  strategy: 'last_write_wins' | 'first_write_wins' | 'merge' | 'manual' | 'voting'
  autoResolve: boolean
  timeout: number
}

interface SyncPermissions {
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  canInvite: boolean
  canKick: boolean
  canChangeSettings: boolean
}

type Platform = 'web' | 'mobile' | 'desktop' | 'vr' | 'ar' | 'console'

interface SyncNetwork {
  id: string
  type: 'websocket' | 'webrtc' | 'http' | 'bluetooth'
  isConnected: boolean
  latency: number
  bandwidth: number
  reliability: number
}

export class CrossPlatformSyncSystem {
  private sessions: Map<string, SyncSession> = new Map()
  private currentSession: SyncSession | null = null
  private networks: Map<string, SyncNetwork> = new Map()
  private syncUI: any
  private isInitialized: boolean = false
  private syncQueue: SyncEvent[] = []
  private maxQueueSize: number = 1000
  private syncInterval: number = 100 // 100ms
  private lastSyncTime: number = 0
  private conflictResolver: any

  constructor() {
    this.initializeNetworks()
    this.setupConflictResolver()
  }

  // Initialize cross-platform sync system
  initialize() {
    console.log('🔄 Cross-Platform Sync System Initializing...')

    this.createSyncUI()
    this.startSyncEngine()
    this.createDefaultSession()

    this.isInitialized = true
    console.log('🔄 Cross-Platform Sync System Ready!')
  }

  // Initialize networks
  private initializeNetworks() {
    // WebSocket network
    this.networks.set('websocket', {
      id: 'network_websocket',
      type: 'websocket',
      isConnected: false,
      latency: 50,
      bandwidth: 1000,
      reliability: 0.95
    })

    // WebRTC network
    this.networks.set('webrtc', {
      id: 'network_webrtc',
      type: 'webrtc',
      isConnected: false,
      latency: 20,
      bandwidth: 5000,
      reliability: 0.98
    })

    // HTTP network
    this.networks.set('http', {
      id: 'network_http',
      type: 'http',
      isConnected: true,
      latency: 200,
      bandwidth: 2000,
      reliability: 0.99
    })

    console.log('🌐 Sync networks initialized')
  }

  // Setup conflict resolver
  private setupConflictResolver() {
    this.conflictResolver = {
      resolve: (conflict: SyncConflict, strategy: ConflictResolution['strategy']) => {
        console.log(`🔧 Resolving conflict ${conflict.id} with strategy: ${strategy}`)

        switch (strategy) {
          case 'last_write_wins':
            return conflict.changes[conflict.changes.length - 1]
          case 'first_write_wins':
            return conflict.changes[0]
          case 'merge':
            return this.mergeChanges(conflict.changes)
          case 'manual':
            return null // Requires manual intervention
          case 'voting':
            return this.resolveByVoting(conflict.changes)
          default:
            return conflict.changes[conflict.changes.length - 1]
        }
      },

      merge: (changes: ConflictChange[]) => {
        // Simple merge implementation
        const merged = { ...changes[0].data }
        for (let i = 1; i < changes.length; i++) {
          Object.assign(merged, changes[i].data)
        }
        return merged
      },

      resolveByVoting: (changes: ConflictChange[]) => {
        // Simulate voting
        const votes = new Map<string, number>()
        changes.forEach(change => {
          votes.set(change.author, Math.random())
        })

        let maxVotes = 0
        let winner = changes[0]

        votes.forEach((votes, author) => {
          if (votes > maxVotes) {
            maxVotes = votes
            winner = changes.find(c => c.author === author) || changes[0]
          }
        })

        return winner
      }
    }
  }

  // Create sync UI
  private createSyncUI() {
    this.syncUI = engine.addEntity()
    Transform.create(this.syncUI, {
      position: Vector3.create(2, 3, 8),
      scale: Vector3.create(3, 4, 0.1)
    })
    MeshRenderer.setBox(this.syncUI)
    Material.setPbrMaterial(this.syncUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    })

    const title = engine.addEntity()
    Transform.create(title, {
      parent: this.syncUI,
      position: Vector3.create(0, 1.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(title, {
      text: '🔄 CROSS-PLATFORM SYNC',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    })

    // Create session controls
    this.createSessionControls()

    // Create platform indicators
    this.createPlatformIndicators()

    // Create sync status
    this.createSyncStatus()

    // Create conflict display
    this.createConflictDisplay()
  }

  // Create session controls
  private createSessionControls() {
    const controls = [
      { id: 'create_session', icon: '➕', name: 'Create Session' },
      { id: 'join_session', icon: '🔗', name: 'Join Session' },
      { id: 'sync_now', icon: '🔄', name: 'Sync Now' },
      { id: 'leave_session', icon: '🚪', name: 'Leave Session' }
    ]

    let xOffset = -0.9

    controls.forEach(control => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.syncUI,
        position: Vector3.create(xOffset, 1.2, 0.1),
        scale: Vector3.create(0.3, 0.3, 0.1)
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

      xOffset += 0.6
    })
  }

  // Create platform indicators
  private createPlatformIndicators() {
    const platforms: Platform[] = ['web', 'mobile', 'desktop', 'vr', 'ar', 'console']
    let xOffset = -1.2

    platforms.forEach(platform => {
      const indicator = engine.addEntity()
      Transform.create(indicator, {
        parent: this.syncUI,
        position: Vector3.create(xOffset, 0.6, 0.1),
        scale: Vector3.create(0.2, 0.2, 0.1)
      })
      MeshRenderer.setBox(indicator)
      Material.setPbrMaterial(indicator, {
        albedoColor: this.getPlatformColor(platform),
        emissiveColor: this.getPlatformColor(platform),
        emissiveIntensity: 0.5
      })

      const platformText = engine.addEntity()
      Transform.create(platformText, {
        parent: indicator,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5)
      })
      TextShape.create(platformText, {
        text: this.getPlatformIcon(platform),
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      })

      pointerEventsSystem.onPointerDown(
        {
          entity: indicator,
          opts: { button: InputAction.IA_POINTER, hoverText: platform }
        },
        () => this.connectPlatform(platform)
      )

      xOffset += 0.4
    })
  }

  // Create sync status
  private createSyncStatus() {
    const statusDisplay = engine.addEntity()
    Transform.create(statusDisplay, {
      parent: this.syncUI,
      position: Vector3.create(0, 0, 0.1),
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

  // Create conflict display
  private createConflictDisplay() {
    const conflictDisplay = engine.addEntity()
    Transform.create(conflictDisplay, {
      parent: this.syncUI,
      position: Vector3.create(0, -0.6, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1)
    })
    MeshRenderer.setBox(conflictDisplay)
    Material.setPbrMaterial(conflictDisplay, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    })

    const conflictText = engine.addEntity()
    Transform.create(conflictText, {
      parent: conflictDisplay,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(conflictText, {
      text: '⚠️ Conflicts: 0',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    })
  }

  // Get platform color
  private getPlatformColor(platform: Platform): Color4 {
    switch (platform) {
      case 'web': return Color4.create(0.2, 0.6, 1, 1)
      case 'mobile': return Color4.create(0.8, 0.4, 0.2, 1)
      case 'desktop': return Color4.create(0.2, 0.8, 0.4, 1)
      case 'vr': return Color4.create(0.8, 0.2, 0.8, 1)
      case 'ar': return Color4.create(0.2, 0.8, 0.8, 1)
      case 'console': return Color4.create(0.8, 0.8, 0.2, 1)
      default: return Color4.create(0.5, 0.5, 0.5, 1)
    }
  }

  // Get platform icon
  private getPlatformIcon(platform: Platform): string {
    switch (platform) {
      case 'web': return '🌐'
      case 'mobile': return '📱'
      case 'desktop': return '🖥️'
      case 'vr': return '🥽'
      case 'ar': return '📷'
      case 'console': return '🎮'
      default: return '❓'
    }
  }

  // Start sync engine
  private startSyncEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return

      this.processSyncQueue()
      this.checkConnections()
      this.detectConflicts()
      this.updateSyncStatus()
    })
  }

  // Create default session
  private createDefaultSession() {
    const session: SyncSession = {
      id: 'session_default',
      name: 'Default Sync Session',
      platform: 'web',
      status: 'active',
      participants: [
        {
          id: 'user_main',
          name: 'Main User',
          platform: 'web',
          role: 'host',
          permissions: {
            canRead: true,
            canWrite: true,
            canDelete: true,
            canInvite: true,
            canKick: true,
            canChangeSettings: true
          },
          status: 'online',
          lastSeen: Date.now()
        }
      ],
      lastSync: Date.now(),
      syncInterval: 100,
      dataSync: {
        entities: new Map(),
        settings: new Map(),
        events: [],
        conflicts: [],
        version: 1
      },
      conflictResolution: {
        strategy: 'last_write_wins',
        autoResolve: true,
        timeout: 5000
      }
    }

    this.sessions.set(session.id, session)
    this.currentSession = session

    console.log('🔄 Default sync session created')
  }

  // Handle session control
  private handleSessionControl(controlId: string) {
    switch (controlId) {
      case 'create_session':
        this.createSession()
        break
      case 'join_session':
        this.joinSession()
        break
      case 'sync_now':
        this.forceSync()
        break
      case 'leave_session':
        this.leaveSession()
        break
    }

    soundSystem.playInteractionSound('click')
  }

  // Create session
  public createSession() {
    const sessionId = `session_${Date.now()}`
    const session: SyncSession = {
      id: sessionId,
      name: `Sync Session ${this.sessions.size + 1}`,
      platform: 'web',
      status: 'active',
      participants: [
        {
          id: 'user_main',
          name: 'Main User',
          platform: 'web',
          role: 'host',
          permissions: {
            canRead: true,
            canWrite: true,
            canDelete: true,
            canInvite: true,
            canKick: true,
            canChangeSettings: true
          },
          status: 'online',
          lastSeen: Date.now()
        }
      ],
      lastSync: Date.now(),
      syncInterval: 100,
      dataSync: {
        entities: new Map(),
        settings: new Map(),
        events: [],
        conflicts: [],
        version: 1
      },
      conflictResolution: {
        strategy: 'last_write_wins',
        autoResolve: true,
        timeout: 5000
      }
    }

    this.sessions.set(sessionId, session)
    this.currentSession = session

    console.log(`➕ Created session: ${session.name}`)
    soundSystem.playInteractionSound('powerup')
  }

  // Join session
  public joinSession() {
    console.log('🔗 Joining session...')
    // In real implementation, this would show session list and allow joining
    soundSystem.playInteractionSound('click')
  }

  // Force sync
  public forceSync() {
    if (!this.currentSession) return

    console.log('🔄 Forcing sync...')
    this.currentSession.status = 'syncing'

    // Simulate sync process
    setTimeout(() => {
      this.currentSession!.status = 'active'
      this.currentSession!.lastSync = Date.now()
      console.log('✅ Sync completed')
    }, 1000)

    soundSystem.playInteractionSound('powerup')
  }

  // Leave session
  public leaveSession() {
    if (!this.currentSession) return

    console.log(`🚪 Leaving session: ${this.currentSession.name}`)
    this.currentSession = null
    soundSystem.playInteractionSound('click')
  }

  // Connect platform
  public connectPlatform(platform: Platform) {
    const network = this.networks.get(platform === 'web' ? 'websocket' : 'webrtc')
    if (!network) return

    network.isConnected = true
    console.log(`🔗 Connected to ${platform} platform`)
    soundSystem.playInteractionSound('powerup')
  }

  // Disconnect platform
  public disconnectPlatform(platform: Platform) {
    const network = this.networks.get(platform === 'web' ? 'websocket' : 'webrtc')
    if (!network) return

    network.isConnected = false
    console.log(`🔌 Disconnected from ${platform} platform`)
    soundSystem.playInteractionSound('click')
  }

  // Process sync queue
  private processSyncQueue() {
    if (this.syncQueue.length === 0) return

    const now = Date.now()
    if (now - this.lastSyncTime < this.syncInterval) return

    const eventsToProcess = this.syncQueue.splice(0, 10) // Process 10 events per frame
    eventsToProcess.forEach(event => {
      this.processSyncEvent(event)
    })

    this.lastSyncTime = now
  }

  // Process sync event
  private processSyncEvent(event: SyncEvent) {
    if (!this.currentSession) return

    console.log(`📤 Processing sync event: ${event.type} for ${event.target}`)

    // Add to session events
    this.currentSession.dataSync.events.push(event)

    // Keep only recent events
    if (this.currentSession.dataSync.events.length > 1000) {
      this.currentSession.dataSync.events = this.currentSession.dataSync.events.slice(-500)
    }

    // Apply changes based on event type
    switch (event.type) {
      case 'create':
        this.handleCreateEvent(event)
        break
      case 'update':
        this.handleUpdateEvent(event)
        break
      case 'delete':
        this.handleDeleteEvent(event)
        break
      case 'move':
        this.handleMoveEvent(event)
        break
      case 'interact':
        this.handleInteractEvent(event)
        break
    }
  }

  // Handle create event
  private handleCreateEvent(event: SyncEvent) {
    const entity: SyncEntity = {
      id: event.target,
      type: 'custom',
      data: event.data,
      timestamp: event.timestamp,
      author: event.author,
      version: 1,
      conflicts: []
    }

    if (this.currentSession) {
      this.currentSession.dataSync.entities.set(event.target, entity)
    }
  }

  // Handle update event
  private handleUpdateEvent(event: SyncEvent) {
    if (!this.currentSession) return

    const entity = this.currentSession.dataSync.entities.get(event.target)
    if (entity) {
      // Check for conflicts
      if (entity.author !== event.author && entity.timestamp > event.timestamp - 1000) {
        this.createConflict(entity, event)
      } else {
        entity.data = event.data
        entity.timestamp = event.timestamp
        entity.author = event.author
        entity.version++
      }
    }
  }

  // Handle delete event
  private handleDeleteEvent(event: SyncEvent) {
    if (this.currentSession) {
      this.currentSession.dataSync.entities.delete(event.target)
    }
  }

  // Handle move event
  private handleMoveEvent(event: SyncEvent) {
    if (!this.currentSession) return

    const entity = this.currentSession.dataSync.entities.get(event.target)
    if (entity && entity.type === 'position') {
      entity.data = event.data
      entity.timestamp = event.timestamp
    }
  }

  // Handle interact event
  private handleInteractEvent(event: SyncEvent) {
    console.log`🎯 Interaction event: ${event.target} by ${event.author}`
    // Handle interaction-specific logic
  }

  // Create conflict
  private createConflict(entity: SyncEntity, event: SyncEvent) {
    const conflict: SyncConflict = {
      id: `conflict_${Date.now()}_${Math.random()}`,
      type: 'data',
      entity: entity.id,
      changes: [
        {
          author: entity.author,
          platform: this.currentSession!.platform,
          data: entity.data,
          timestamp: entity.timestamp
        },
        {
          author: event.author,
          platform: event.platform,
          data: event.data,
          timestamp: event.timestamp
        }
      ],
      timestamp: Date.now(),
      status: 'pending'
    }

    if (this.currentSession) {
      this.currentSession.dataSync.conflicts.push(conflict)

      // Auto-resolve if enabled
      if (this.currentSession.conflictResolution.autoResolve) {
        this.resolveConflict(conflict)
      }
    }
  }

  // Resolve conflict
  private resolveConflict(conflict: SyncConflict) {
    if (!this.currentSession) return

    const resolution = this.conflictResolver.resolve(conflict, this.currentSession.conflictResolution.strategy)

    if (resolution) {
      const entity = this.currentSession.dataSync.entities.get(conflict.entity)
      if (entity) {
        entity.data = resolution.data
        entity.author = resolution.author
        entity.timestamp = resolution.timestamp
        entity.version++
      }

      conflict.status = 'resolved'
      console.log(`✅ Resolved conflict ${conflict.id}`)
    } else {
      conflict.status = 'ignored'
      console.log(`⚠️ Ignored conflict ${conflict.id}`)
    }
  }

  // Check connections
  private checkConnections() {
    this.networks.forEach((network, id) => {
      // Simulate connection quality changes
      if (Math.random() < 0.01) {
        network.latency = 20 + Math.random() * 100
        network.bandwidth = 1000 + Math.random() * 4000
        network.reliability = 0.9 + Math.random() * 0.09
      }
    })
  }

  // Detect conflicts
  private detectConflicts() {
    if (!this.currentSession) return

    // Check for stale conflicts
    const now = Date.now()
    this.currentSession.dataSync.conflicts = this.currentSession.dataSync.conflicts.filter(conflict => {
      return now - conflict.timestamp < 30000 // 30 seconds
    })
  }

  // Update sync status
  private updateSyncStatus() {
    if (!this.currentSession) return

    const totalEntities = this.currentSession.dataSync.entities.size
    const pendingConflicts = this.currentSession.dataSync.conflicts.filter(c => c.status === 'pending').length
    const queueSize = this.syncQueue.length

    // Update UI with status
    console.log(`📊 Sync Status: ${this.currentSession.status} | Entities: ${totalEntities} | Conflicts: ${pendingConflicts} | Queue: ${queueSize}`)
  }

  // Queue sync event
  public queueSyncEvent(event: SyncEvent) {
    if (this.syncQueue.length >= this.maxQueueSize) {
      this.syncQueue.shift() // Remove oldest event
    }

    this.syncQueue.push(event)
  }

  // Get current session
  public getCurrentSession(): SyncSession | null {
    return this.currentSession
  }

  // Get all sessions
  public getSessions(): SyncSession[] {
    return Array.from(this.sessions.values())
  }

  // Get network status
  public getNetworkStatus(): Map<string, SyncNetwork> {
    return new Map(this.networks)
  }

  // Get sync statistics
  public getSyncStatistics(): any {
    if (!this.currentSession) return null

    return {
      sessionId: this.currentSession.id,
      status: this.currentSession.status,
      participants: this.currentSession.participants.length,
      entities: this.currentSession.dataSync.entities.size,
      events: this.currentSession.dataSync.events.length,
      conflicts: this.currentSession.dataSync.conflicts.length,
      lastSync: this.currentSession.lastSync,
      queueSize: this.syncQueue.length
    }
  }

  // Set conflict resolution strategy
  public setConflictResolutionStrategy(strategy: ConflictResolution['strategy']) {
    if (this.currentSession) {
      this.currentSession.conflictResolution.strategy = strategy
      console.log(`🔧 Conflict resolution strategy set to: ${strategy}`)
    }
  }

  // Enable/disable auto-resolve
  public setAutoResolve(enabled: boolean) {
    if (this.currentSession) {
      this.currentSession.conflictResolution.autoResolve = enabled
      console.log(`🤖 Auto-resolve ${enabled ? 'enabled' : 'disabled'}`)
    }
  }

  // Cleanup system
  public cleanup() {
    this.sessions.clear()
    this.networks.clear()
    this.syncQueue = []

    if (this.syncUI) {
      engine.removeEntity(this.syncUI)
    }

    this.isInitialized = false
  }
}

// Export singleton instance
export const crossPlatformSyncSystem = new CrossPlatformSyncSystem()
