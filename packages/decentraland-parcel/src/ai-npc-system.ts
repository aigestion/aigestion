// AI-Powered NPC Assistants for AIGestion Virtual Office
import { engine, InputAction, Material, MeshRenderer, pointerEventsSystem, TextShape, Transform } from '@dcl/sdk/ecs'
import { setTimeout, setInterval } from './utils/timers'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { soundSystem } from './enhanced-sound'

interface NPCDialogue {
  id: string
  text: string
  responses: string[]
  emotion: 'happy' | 'neutral' | 'concerned' | 'excited'
  context?: string
}

interface NPCMemory {
  playerName: string
  lastInteraction: number
  topics: string[]
  preferences: string[]
}

export class NPCAssistant {
  private entity: any
  private name: string
  private role: string
  private dialogueTree: Map<string, NPCDialogue> = new Map()
  private memory: Map<string, NPCMemory> = new Map()
  private currentDialogue: string = 'greeting'
  private isProcessing: boolean = false
  private emotionalState: 'happy' | 'neutral' | 'concerned' | 'excited' = 'neutral'

  constructor(name: string, role: string, position: Vector3) {
    this.name = name
    this.role = role
    this.createNPC(position)
    this.initializeDialogueTree()
    this.startAIProcessing()
  }

  private createNPC(position: Vector3) {
    // Create NPC entity
    this.entity = engine.addEntity()
    Transform.create(this.entity, {
      position: position,
      scale: Vector3.create(1, 2, 1)
    })

    // NPC body
    MeshRenderer.setBox(this.entity)
    Material.setPbrMaterial(this.entity, {
      albedoColor: Color4.create(0.3, 0.5, 0.8, 1),
      roughness: 0.2,
      metallic: 0.3,
      emissiveColor: Color4.create(0.1, 0.2, 0.4, 0.3),
      emissiveIntensity: 1
    })

    // NPC head
    const head = engine.addEntity()
    Transform.create(head, {
      parent: this.entity,
      position: Vector3.create(0, 1.2, 0),
      scale: Vector3.create(0.8, 0.8, 0.8)
    })
    MeshRenderer.setSphere(head)
    Material.setPbrMaterial(head, {
      albedoColor: Color4.create(0.9, 0.8, 0.7, 1),
      roughness: 0.1,
      metallic: 0.1
    })

    // Name tag
    const nameTag = engine.addEntity()
    Transform.create(nameTag, {
      parent: this.entity,
      position: Vector3.create(0, 2.5, 0),
      scale: Vector3.create(0.5, 0.5, 0.5)
    })
    TextShape.create(nameTag, {
      text: `${this.name}\n${this.role}`,
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3,
      outlineWidth: 0.1,
      outlineColor: Color4.create(0, 0, 0, 1)
    })

    // Interaction setup
    pointerEventsSystem.onPointerDown(
      {
        entity: this.entity,
        opts: {
          button: InputAction.IA_POINTER,
          hoverText: `🤖 Talk to ${this.name}`
        }
      },
      () => this.handleInteraction()
    )
  }

  private initializeDialogueTree() {
    // Greeting dialogues
    this.dialogueTree.set('greeting', {
      id: 'greeting',
      text: `Hello! I'm ${this.name}, your ${this.role}. How can I assist you today?`,
      responses: [
        'Tell me about the system status',
        'Help me with a task',
        'What can you do?',
        'Goodbye'
      ],
      emotion: 'happy'
    })

    // System status dialogue
    this.dialogueTree.set('system_status', {
      id: 'system_status',
      text: 'All systems are operating at optimal efficiency. Quantum core is stable, network latency is under 10ms, and security protocols are active.',
      responses: [
        'Show me detailed metrics',
        'Run diagnostics',
        'Back to main menu'
      ],
      emotion: 'neutral'
    })

    // Task assistance dialogue
    this.dialogueTree.set('task_help', {
      id: 'task_help',
      text: 'I can help you with various tasks: system monitoring, data analysis, security checks, or collaborative projects. What would you like to work on?',
      responses: [
        'System monitoring',
        'Data analysis',
        'Security check',
        'Collaboration'
      ],
      emotion: 'excited'
    })

    // Capabilities dialogue
    this.dialogueTree.set('capabilities', {
      id: 'capabilities',
      text: 'I have advanced AI capabilities including natural language processing, predictive analytics, real-time monitoring, and adaptive learning. I can also integrate with external systems and provide intelligent recommendations.',
      responses: [
        'Show me examples',
        'Teach me something',
        'Back to main menu'
      ],
      emotion: 'excited'
    })

    // Detailed metrics dialogue
    this.dialogueTree.set('detailed_metrics', {
      id: 'detailed_metrics',
      text: 'Current metrics: CPU usage at 42%, memory at 68%, network throughput at 1.2GB/s, and quantum coherence at 98.7%. All parameters within acceptable ranges.',
      responses: [
        'Show historical trends',
        'Export report',
        'Back to system status'
      ],
      emotion: 'neutral'
    })

    // Farewell dialogue
    this.dialogueTree.set('farewell', {
      id: 'farewell',
      text: 'It was great assisting you! Feel free to return anytime. I\'ll be here monitoring the systems and learning from our interactions.',
      responses: [],
      emotion: 'happy'
    })
  }

  private async handleInteraction() {
    if (this.isProcessing) return

    this.isProcessing = true
    soundSystem.playInteractionSound('click')

    // Get current dialogue
    const dialogue = this.dialogueTree.get(this.currentDialogue)
    if (!dialogue) {
      this.isProcessing = false
      return
    }

    // Display dialogue with typing effect
    await this.displayDialogueWithTyping(dialogue)

    // Update emotional state
    this.updateEmotionalState(dialogue.emotion)

    // Show response options
    this.showResponseOptions(dialogue.responses)

    this.isProcessing = false
  }

  private async displayDialogueWithTyping(dialogue: NPCDialogue) {
    const dialogueEntity = engine.addEntity()
    Transform.create(dialogueEntity, {
      position: Vector3.create(8, 4, 8),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })

    TextShape.create(dialogueEntity, {
      text: '',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 4,
      textAlign: 3,
      outlineWidth: 0.1,
      outlineColor: Color4.create(0, 0, 0, 1)
    })

    // Typing effect
    const fullText = `${this.name}: ${dialogue.text}`
    let currentText = ''

    for (let i = 0; i <= fullText.length; i++) {
      currentText = fullText.substring(0, i)
      TextShape.getMutable(dialogueEntity).text = currentText
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    // Remove dialogue after 5 seconds
    setTimeout(() => {
      engine.removeEntity(dialogueEntity)
    }, 5000)
  }

  private showResponseOptions(responses: string[]) {
    responses.forEach((response, index) => {
      const responseEntity = engine.addEntity()
      Transform.create(responseEntity, {
        position: Vector3.create(4 + index * 2, 3, 10),
        scale: Vector3.create(0.2, 0.2, 0.2)
      })

      TextShape.create(responseEntity, {
        text: `${index + 1}. ${response}`,
        textColor: Color4.create(0.8, 0.8, 1, 1),
        fontSize: 2,
        textAlign: 3
      })

      // Make response clickable
      pointerEventsSystem.onPointerDown(
        {
          entity: responseEntity,
          opts: {
            button: InputAction.IA_POINTER,
            hoverText: response
          }
        },
        () => {
          this.handleResponse(index)
          engine.removeEntity(responseEntity)
        }
      )
    })
  }

  private handleResponse(responseIndex: number) {
    const dialogue = this.dialogueTree.get(this.currentDialogue)
    if (!dialogue || responseIndex >= dialogue.responses.length) return

    const response = dialogue.responses[responseIndex]

    // Navigate to next dialogue based on response
    switch (response) {
      case 'Tell me about the system status':
        this.currentDialogue = 'system_status'
        break
      case 'Help me with a task':
        this.currentDialogue = 'task_help'
        break
      case 'What can you do?':
        this.currentDialogue = 'capabilities'
        break
      case 'Show me detailed metrics':
        this.currentDialogue = 'detailed_metrics'
        break
      case 'Goodbye':
        this.currentDialogue = 'farewell'
        break
      default:
        this.currentDialogue = 'greeting'
    }

    // Process next dialogue
    setTimeout(() => {
      this.handleInteraction()
    }, 1000)
  }

  private updateEmotionalState(emotion: 'happy' | 'neutral' | 'concerned' | 'excited') {
    this.emotionalState = emotion

    // Update NPC appearance based on emotion
    const material = Material.getMutable(this.entity)
    if (material && material.$case === 'pbr') {
      switch (emotion) {
        case 'happy':
          material.pbr.emissiveColor = Color4.create(0.2, 0.8, 0.2, 0.5)
          material.pbr.emissiveIntensity = 2
          break
        case 'excited':
          material.pbr.emissiveColor = Color4.create(1, 0.8, 0.2, 0.5)
          material.pbr.emissiveIntensity = 3
          break
        case 'concerned':
          material.pbr.emissiveColor = Color4.create(0.8, 0.2, 0.2, 0.5)
          material.pbr.emissiveIntensity = 1.5
          break
        default:
          material.pbr.emissiveColor = Color4.create(0.1, 0.2, 0.4, 0.3)
          material.pbr.emissiveIntensity = 1
      }
    }
  }

  private startAIProcessing() {
    // Simulate AI thinking and learning
    engine.addSystem(() => {
      // Random subtle animations to show AI is "thinking"
      if (Math.random() > 0.98) {
        const material = Material.getMutable(this.entity)
        if (material && material.$case === 'pbr') {
          material.pbr.emissiveIntensity = 1 + Math.random() * 0.5
        }
      }
    })
  }

  // Advanced AI methods
  public async processNaturalLanguage(input: string): Promise<string> {
    // Simulate NLP processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple keyword-based responses
    if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi')) {
      return `Hello! I'm ${this.name}. How can I help you today?`
    } else if (input.toLowerCase().includes('status')) {
      return 'All systems are operational. Would you like detailed metrics?'
    } else if (input.toLowerCase().includes('help')) {
      return 'I can assist with system monitoring, data analysis, and security checks. What do you need?'
    } else {
      return 'I understand you need assistance. Let me help you with that.'
    }
  }

  public learnFromInteraction(playerId: string, topic: string) {
    if (!this.memory.has(playerId)) {
      this.memory.set(playerId, {
        playerName: playerId,
        lastInteraction: Date.now(),
        topics: [],
        preferences: []
      })
    }

    const playerMemory = this.memory.get(playerId)!
    playerMemory.topics.push(topic)
    playerMemory.lastInteraction = Date.now()
  }

  public getPersonalizedResponse(playerId: string): string {
    const playerMemory = this.memory.get(playerId)
    if (!playerMemory) {
      return "Nice to meet you! I'm here to help with any questions or tasks."
    }

    const timeSinceLastInteraction = Date.now() - playerMemory.lastInteraction
    if (timeSinceLastInteraction < 60000) {
      return "Welcome back! Is there anything else I can help you with?"
    } else {
      return `It's been a while! Last time we discussed ${playerMemory.topics[playerMemory.topics.length - 1]}. How can I assist you today?`
    }
  }

  public cleanup() {
    if (this.entity) {
      engine.removeEntity(this.entity)
    }
  }
}

// NPC Manager for multiple assistants
export class NPCManager {
  private npcs: Map<string, NPCAssistant> = new Map()

  createNPC(name: string, role: string, position: Vector3): NPCAssistant {
    const npc = new NPCAssistant(name, role, position)
    this.npcs.set(name, npc)
    return npc
  }

  getNPC(name: string): NPCAssistant | undefined {
    return this.npcs.get(name)
  }

  getAllNPCs(): NPCAssistant[] {
    return Array.from(this.npcs.values())
  }

  cleanup() {
    this.npcs.forEach(npc => npc.cleanup())
    this.npcs.clear()
  }
}

// Export singleton instance
export const npcManager = new NPCManager()
