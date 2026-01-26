// Multiplayer Collaboration System for AIGestion Virtual Office
import { engine, InputAction, Material, MeshRenderer, pointerEventsSystem, TextShape, Transform } from '@dcl/sdk/ecs'
import { setTimeout, setInterval } from './utils/timers'
import { Color3, Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { soundSystem } from './enhanced-sound'

interface Player {
  id: string
  name: string
  position: Vector3
  rotation: Quaternion
  avatar: any
  isActive: boolean
  lastUpdate: number
  color: Color3
}

interface CollaborationSession {
  id: string
  name: string
  hostId: string
  participants: string[]
  startTime: number
  isActive: boolean
  sharedObjects: Map<string, any>
}

interface SharedObject {
  id: string
  type: 'whiteboard' | 'document' | 'model' | 'note'
  position: Vector3
  content: any
  ownerId: string
  collaborators: string[]
  isLocked: boolean
}

interface VoiceChannel {
  id: string
  name: string
  participants: string[]
  isSpatial: boolean
  maxParticipants: number
}

export class MultiplayerSystem {
  private localPlayer: Player
  private remotePlayers: Map<string, Player> = new Map()
  private activeSession: CollaborationSession | null = null
  private sharedObjects: Map<string, SharedObject> = new Map()
  private voiceChannels: Map<string, VoiceChannel> = new Map()
  private isInitialized: boolean = false
  private connectionStatus: 'connected' | 'connecting' | 'disconnected' = 'disconnected'

  constructor() {
    this.localPlayer = {
      id: this.generatePlayerId(),
      name: 'Player',
      position: Vector3.create(8, 1, 8),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      avatar: null,
      isActive: true,
      lastUpdate: Date.now(),
      color: Color3.create(Math.random(), Math.random(), Math.random())
    }
  }

  // Initialize multiplayer system
  async initialize() {
    console.log('🌐 Multiplayer System Initializing...')

    this.createLocalPlayer()
    this.setupVoiceChat()
    this.createCollaborationTools()
    this.startNetworkSync()

    await this.connectToServer()

    this.isInitialized = true
    console.log('🌐 Multiplayer System Ready!')
  }

  // Create local player avatar
  private createLocalPlayer() {
    const avatar = engine.addEntity()
    Transform.create(avatar, {
      position: this.localPlayer.position,
      scale: Vector3.create(1, 2, 1)
    })
    MeshRenderer.setBox(avatar)
    Material.setPbrMaterial(avatar, {
      albedoColor: Color4.create(
        this.localPlayer.color.r,
        this.localPlayer.color.g,
        this.localPlayer.color.b,
        1
      ),
      roughness: 0.2,
      metallic: 0.3,
      emissiveColor: Color4.create(
        this.localPlayer.color.r * 0.3,
        this.localPlayer.color.g * 0.3,
        this.localPlayer.color.b * 0.3,
        0.5
      ),
      emissiveIntensity: 1
    })

    // Player name tag
    const nameTag = engine.addEntity()
    Transform.create(nameTag, {
      parent: avatar,
      position: Vector3.create(0, 2.5, 0),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(nameTag, {
      text: this.localPlayer.name,
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3
    })

    this.localPlayer.avatar = avatar
  }

  // Setup voice chat system
  private setupVoiceChat() {
    // Create main voice channel
    const mainChannel: VoiceChannel = {
      id: 'main',
      name: 'Main Channel',
      participants: [this.localPlayer.id],
      isSpatial: true,
      maxParticipants: 10
    }

    this.voiceChannels.set('main', mainChannel)

    // Create voice channel UI
    this.createVoiceChannelUI()
  }

  // Create voice channel UI
  private createVoiceChannelUI() {
    const voicePanel = engine.addEntity()
    Transform.create(voicePanel, {
      position: Vector3.create(1, 3, 8),
      scale: Vector3.create(1.5, 2, 0.1)
    })
    MeshRenderer.setBox(voicePanel)
    Material.setPbrMaterial(voicePanel, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    })

    const voiceTitle = engine.addEntity()
    Transform.create(voiceTitle, {
      parent: voicePanel,
      position: Vector3.create(0, 0.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(voiceTitle, {
      text: '🎤 VOICE CHAT',
      textColor: Color4.create(0.8, 0.8, 1, 1),
      fontSize: 2,
      textAlign: 3
    })

    // Mute button
    const muteButton = engine.addEntity()
    Transform.create(muteButton, {
      parent: voicePanel,
      position: Vector3.create(0, -0.2, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.1)
    })
    MeshRenderer.setBox(muteButton)
    Material.setPbrMaterial(muteButton, {
      albedoColor: Color4.create(0.2, 0.8, 0.2, 1),
      emissiveColor: Color4.create(0.2, 0.8, 0.2, 0.8),
      emissiveIntensity: 2
    })

    const muteText = engine.addEntity()
    Transform.create(muteText, {
      parent: muteButton,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.5, 0.5, 0.5)
    })
    TextShape.create(muteText, {
      text: '🔊',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3
    })

    pointerEventsSystem.onPointerDown(
      {
        entity: muteButton,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Toggle Mute' }
      },
      () => this.toggleMute()
    )
  }

  // Create collaboration tools
  private createCollaborationTools() {
    this.createSharedWhiteboard()
    this.createDocumentSharing()
    this.createCollaborationPanel()
  }

  // Create shared whiteboard
  private createSharedWhiteboard() {
    const whiteboard = engine.addEntity()
    Transform.create(whiteboard, {
      position: Vector3.create(8, 3, 12),
      scale: Vector3.create(6, 4, 0.2)
    })
    MeshRenderer.setBox(whiteboard)
    Material.setPbrMaterial(whiteboard, {
      albedoColor: Color4.create(1, 1, 1, 1),
      roughness: 0.1,
      metallic: 0.1
    })

    const sharedObject: SharedObject = {
      id: 'main-whiteboard',
      type: 'whiteboard',
      position: Vector3.create(8, 3, 12),
      content: { drawings: [], text: [] },
      ownerId: this.localPlayer.id,
      collaborators: [],
      isLocked: false
    }

    this.sharedObjects.set('main-whiteboard', sharedObject)
  }

  // Create document sharing system
  private createDocumentSharing() {
    const docSharePanel = engine.addEntity()
    Transform.create(docSharePanel, {
      position: Vector3.create(14, 3, 8),
      scale: Vector3.create(2, 3, 0.1)
    })
    MeshRenderer.setBox(docSharePanel)
    Material.setPbrMaterial(docSharePanel, {
      albedoColor: Color4.create(0.1, 0.3, 0.6, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    })

    const docTitle = engine.addEntity()
    Transform.create(docTitle, {
      parent: docSharePanel,
      position: Vector3.create(0, 1.2, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(docTitle, {
      text: '📄 DOCUMENTS',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    })
  }

  // Create collaboration panel
  private createCollaborationPanel() {
    const collabPanel = engine.addEntity()
    Transform.create(collabPanel, {
      position: Vector3.create(2, 3, 8),
      scale: Vector3.create(2, 3, 0.1)
    })
    MeshRenderer.setBox(collabPanel)
    Material.setPbrMaterial(collabPanel, {
      albedoColor: Color4.create(0.2, 0.1, 0.4, 0.9),
      emissiveColor: Color4.create(0.4, 0.2, 0.8, 0.5),
      emissiveIntensity: 2
    })

    const collabTitle = engine.addEntity()
    Transform.create(collabTitle, {
      parent: collabPanel,
      position: Vector3.create(0, 1.2, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(collabTitle, {
      text: '🤝 COLLABORATE',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    })

    // Start session button
    const startSessionBtn = engine.addEntity()
    Transform.create(startSessionBtn, {
      parent: collabPanel,
      position: Vector3.create(0, 0.3, 0.1),
      scale: Vector3.create(0.4, 0.2, 0.1)
    })
    MeshRenderer.setBox(startSessionBtn)
    Material.setPbrMaterial(startSessionBtn, {
      albedoColor: Color4.create(0.2, 0.8, 0.2, 1),
      emissiveColor: Color4.create(0.2, 0.8, 0.2, 0.8),
      emissiveIntensity: 2
    })

    const sessionText = engine.addEntity()
    Transform.create(sessionText, {
      parent: startSessionBtn,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.5, 0.5, 0.5)
    })
    TextShape.create(sessionText, {
      text: 'START',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    })

    pointerEventsSystem.onPointerDown(
      {
        entity: startSessionBtn,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Start Collaboration Session' }
      },
      () => this.startCollaborationSession()
    )
  }

  // Start network synchronization
  private startNetworkSync() {
    engine.addSystem(() => {
      if (!this.isInitialized) return

      this.syncPlayerPositions()
      this.syncSharedObjects()
      this.updateVoiceChat()
    })
  }

  // Connect to server
  private async connectToServer(): Promise<void> {
    this.connectionStatus = 'connecting'
    console.log('🔌 Connecting to multiplayer server...')

    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 2000))

    this.connectionStatus = 'connected'
    console.log('✅ Connected to multiplayer server')

    // Simulate other players joining
    setTimeout(() => {
      this.simulatePlayerJoin('Alice', Color3.create(1, 0.5, 0.5))
    }, 3000)

    setTimeout(() => {
      this.simulatePlayerJoin('Bob', Color3.create(0.5, 1, 0.5))
    }, 5000)
  }

  // Simulate player joining
  private simulatePlayerJoin(name: string, color: Color3) {
    const player: Player = {
      id: this.generatePlayerId(),
      name: name,
      position: Vector3.create(
        Math.random() * 14 + 1,
        1,
        Math.random() * 14 + 1
      ),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      avatar: null,
      isActive: true,
      lastUpdate: Date.now(),
      color: color
    }

    this.createRemotePlayer(player)
    this.remotePlayers.set(player.id, player)

    console.log(`👋 ${name} joined the session`)
    soundSystem.playInteractionSound('click')
  }

  // Create remote player avatar
  private createRemotePlayer(player: Player) {
    const avatar = engine.addEntity()
    Transform.create(avatar, {
      position: player.position,
      scale: Vector3.create(1, 2, 1)
    })
    MeshRenderer.setBox(avatar)
    Material.setPbrMaterial(avatar, {
      albedoColor: Color4.create(player.color.r, player.color.g, player.color.b, 1),
      roughness: 0.2,
      metallic: 0.3,
      emissiveColor: Color4.create(
        player.color.r * 0.3,
        player.color.g * 0.3,
        player.color.b * 0.3,
        0.5
      ),
      emissiveIntensity: 1
    })

    // Player name tag
    const nameTag = engine.addEntity()
    Transform.create(nameTag, {
      parent: avatar,
      position: Vector3.create(0, 2.5, 0),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(nameTag, {
      text: player.name,
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3
    })

    player.avatar = avatar
  }

  // Sync player positions
  private syncPlayerPositions() {
    // Update local player position (would sync with server)
    if (this.localPlayer.avatar) {
      const transform = Transform.getMutable(this.localPlayer.avatar)
      this.localPlayer.position = transform.position
      this.localPlayer.lastUpdate = Date.now()
    }

    // Update remote players (would receive from server)
    this.remotePlayers.forEach(player => {
      if (player.avatar && player.isActive) {
        // Simulate movement
        if (Math.random() > 0.98) {
          const newPos = Vector3.create(
            player.position.x + (Math.random() - 0.5) * 0.5,
            player.position.y,
            player.position.z + (Math.random() - 0.5) * 0.5
          )

          const transform = Transform.getMutable(player.avatar)
          transform.position = newPos
          player.position = newPos
          player.lastUpdate = Date.now()
        }
      }
    })
  }

  // Sync shared objects
  private syncSharedObjects() {
    // Sync whiteboard content
    const whiteboard = this.sharedObjects.get('main-whiteboard')
    if (whiteboard && Math.random() > 0.99) {
      // Simulate remote drawing
      console.log('🎨 Remote whiteboard update received')
    }
  }

  // Update voice chat
  private updateVoiceChat() {
    // Update voice chat participants
    const mainChannel = this.voiceChannels.get('main')
    if (mainChannel) {
      // Add remote players to voice channel
      this.remotePlayers.forEach(player => {
        if (!mainChannel.participants.includes(player.id)) {
          mainChannel.participants.push(player.id)
        }
      })
    }
  }

  // Start collaboration session
  private startCollaborationSession() {
    const session: CollaborationSession = {
      id: this.generateSessionId(),
      name: `Session ${Date.now()}`,
      hostId: this.localPlayer.id,
      participants: [this.localPlayer.id],
      startTime: Date.now(),
      isActive: true,
      sharedObjects: new Map()
    }

    this.activeSession = session
    console.log(`🤝 Started collaboration session: ${session.name}`)
    soundSystem.playInteractionSound('powerup')
  }

  // Toggle mute
  private toggleMute() {
    console.log('🔇 Toggle mute')
    soundSystem.playInteractionSound('click')
    // Implement actual mute functionality
  }

  // Share object with collaborators
  public shareObject(objectId: string, collaborators: string[]) {
    const obj = this.sharedObjects.get(objectId)
    if (obj) {
      obj.collaborators = collaborators
      console.log(`📤 Shared object ${objectId} with ${collaborators.length} collaborators`)
    }
  }

  // Join voice channel
  public joinVoiceChannel(channelId: string) {
    const channel = this.voiceChannels.get(channelId)
    if (channel && channel.participants.length < channel.maxParticipants) {
      channel.participants.push(this.localPlayer.id)
      console.log(`🎤 Joined voice channel: ${channel.name}`)
    }
  }

  // Leave voice channel
  public leaveVoiceChannel(channelId: string) {
    const channel = this.voiceChannels.get(channelId)
    if (channel) {
      channel.participants = channel.participants.filter(id => id !== this.localPlayer.id)
      console.log(`🔇 Left voice channel: ${channel.name}`)
    }
  }

  // Send message to chat
  public sendChatMessage(message: string) {
    console.log(`💬 ${this.localPlayer.name}: ${message}`)
    // Broadcast to other players
  }

  // Get all connected players
  public getConnectedPlayers(): Player[] {
    const players = [this.localPlayer]
    this.remotePlayers.forEach(player => {
      if (player.isActive) {
        players.push(player)
      }
    })
    return players
  }

  // Get active session
  public getActiveSession(): CollaborationSession | null {
    return this.activeSession
  }

  // Utility functions
  private generatePlayerId(): string {
    return 'player_' + Math.random().toString(36).substr(2, 9)
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9)
  }

  // Cleanup system
  public cleanup() {
    // Remove local player
    if (this.localPlayer.avatar) {
      engine.removeEntity(this.localPlayer.avatar)
    }

    // Remove remote players
    this.remotePlayers.forEach(player => {
      if (player.avatar) {
        engine.removeEntity(player.avatar)
      }
    })
    this.remotePlayers.clear()

    // Remove shared objects
    this.sharedObjects.forEach(obj => {
      // Remove object entities
    })
    this.sharedObjects.clear()

    this.voiceChannels.clear()
    this.activeSession = null
    this.isInitialized = false
    this.connectionStatus = 'disconnected'
  }
}

// Export singleton instance
export const multiplayerSystem = new MultiplayerSystem()
