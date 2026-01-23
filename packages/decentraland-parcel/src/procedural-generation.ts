// Procedural Generation for Infinite Spaces (Simplified)
import { engine, InputAction, Material, MeshRenderer, pointerEventsSystem, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { soundSystem } from './enhanced-sound'

interface ProceduralChunk {
  id: string
  position: Vector3
  biome: 'office' | 'tech' | 'nature' | 'abstract'
  structures: any[]
  entities: any[]
  isLoaded: boolean
}

export class ProceduralGenerationSystem {
  private chunks: Map<string, ProceduralChunk> = new Map()
  private generationUI: any
  private isInitialized: boolean = false
  private chunkSize: number = 32
  private renderDistance: number = 2

  initialize() {
    console.log('🌍 Procedural Generation System Initializing...')

    this.createGenerationUI()
    this.startGenerationEngine()
    this.generateInitialChunks()

    this.isInitialized = true
    console.log('🌍 Procedural Generation System Ready!')
  }

  private createGenerationUI() {
    this.generationUI = engine.addEntity()
    Transform.create(this.generationUI, {
      position: Vector3.create(14, 3, 8),
      scale: Vector3.create(3, 2, 0.1)
    })
    MeshRenderer.setBox(this.generationUI)
    Material.setPbrMaterial(this.generationUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    })

    const title = engine.addEntity()
    Transform.create(title, {
      parent: this.generationUI,
      position: Vector3.create(0, 0.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(title, {
      text: '🌍 INFINITE WORLD',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    })

    const controls = [
      { id: 'generate', icon: '🎲', name: 'Generate' },
      { id: 'expand', icon: '➕', name: 'Expand' },
      { id: 'reset', icon: '🗑️', name: 'Reset' }
    ]

    let xOffset = -0.6
    controls.forEach(control => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.generationUI,
        position: Vector3.create(xOffset, 0, 0.1),
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
        { entity: button, opts: { button: InputAction.IA_POINTER, hoverText: control.name } },
        () => this.handleControl(control.id)
      )

      xOffset += 0.6
    })
  }

  private handleControl(controlId: string) {
    switch (controlId) {
      case 'generate':
        this.generateNewChunk()
        break
      case 'expand':
        this.expandWorld()
        break
      case 'reset':
        this.resetWorld()
        break
    }
    soundSystem.playInteractionSound('click')
  }

  private startGenerationEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return
      this.updateChunks()
    })
  }

  private generateInitialChunks() {
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        this.generateChunk(x, z)
      }
    }
  }

  private generateChunk(x: number, z: number) {
    const chunkId = `chunk_${x}_${z}`
    const biomes: ProceduralChunk['biome'][] = ['office', 'tech', 'nature', 'abstract']
    const biome = biomes[Math.floor(Math.random() * biomes.length)]

    const chunk: ProceduralChunk = {
      id: chunkId,
      position: Vector3.create(x * this.chunkSize, 0, z * this.chunkSize),
      biome: biome,
      structures: [],
      entities: [],
      isLoaded: false
    }

    this.chunks.set(chunkId, chunk)
    this.generateChunkContent(chunk)
    console.log(`🌍 Generated chunk ${chunkId} (${biome})`)
    return chunk
  }

  private generateChunkContent(chunk: ProceduralChunk) {
    // Generate structures based on biome
    const structureCount = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < structureCount; i++) {
      const structure = {
        id: `struct_${chunk.id}_${i}`,
        type: chunk.biome === 'office' ? 'building' : 'decoration',
        position: Vector3.create(
          chunk.position.x + Math.random() * this.chunkSize,
          2,
          chunk.position.z + Math.random() * this.chunkSize
        )
      }
      chunk.structures.push(structure)
    }

    // Generate entities
    const entityCount = Math.floor(Math.random() * 5) + 2
    for (let i = 0; i < entityCount; i++) {
      const entity = {
        id: `entity_${chunk.id}_${i}`,
        type: chunk.biome === 'nature' ? 'plant' : 'object',
        position: Vector3.create(
          chunk.position.x + Math.random() * this.chunkSize,
          1,
          chunk.position.z + Math.random() * this.chunkSize
        )
      }
      chunk.entities.push(entity)
    }
  }

  private updateChunks() {
    this.chunks.forEach(chunk => {
      if (!chunk.isLoaded) {
        this.loadChunk(chunk)
      }
    })
  }

  private loadChunk(chunk: ProceduralChunk) {
    // Create terrain
    const terrain = engine.addEntity()
    Transform.create(terrain, {
      position: chunk.position,
      scale: Vector3.create(this.chunkSize, 0.1, this.chunkSize)
    })
    MeshRenderer.setBox(terrain)

    const biomeColor = this.getBiomeColor(chunk.biome)
    Material.setPbrMaterial(terrain, {
      albedoColor: biomeColor,
      roughness: 0.8,
      metallic: 0.1
    })

    // Create structures
    chunk.structures.forEach(structure => {
      const structEntity = engine.addEntity()
      Transform.create(structEntity, {
        position: structure.position,
        scale: Vector3.create(2, 4, 2)
      })
      MeshRenderer.setBox(structEntity)
      Material.setPbrMaterial(structEntity, {
        albedoColor: Color4.create(0.7, 0.7, 0.7, 1),
        roughness: 0.3,
        metallic: 0.5
      })
    })

    // Create entities
    chunk.entities.forEach(entity => {
      const entityEntity = engine.addEntity()
      Transform.create(entityEntity, {
        position: entity.position,
        scale: Vector3.create(0.5, 1, 0.5)
      })
      MeshRenderer.setSphere(entityEntity)
      Material.setPbrMaterial(entityEntity, {
        albedoColor: Color4.create(0.2, 0.8, 0.2, 1),
        roughness: 0.5,
        metallic: 0.1
      })
    })

    chunk.isLoaded = true
  }

  private getBiomeColor(biome: ProceduralChunk['biome']): Color4 {
    switch (biome) {
      case 'office': return Color4.create(0.6, 0.6, 0.7, 1)
      case 'tech': return Color4.create(0.2, 0.4, 0.8, 1)
      case 'nature': return Color4.create(0.2, 0.8, 0.2, 1)
      case 'abstract': return Color4.create(0.8, 0.2, 0.8, 1)
      default: return Color4.create(0.5, 0.5, 0.5, 1)
    }
  }

  private generateNewChunk() {
    const x = Math.floor(Math.random() * 10) - 5
    const z = Math.floor(Math.random() * 10) - 5
    this.generateChunk(x, z)
    soundSystem.playInteractionSound('powerup')
  }

  private expandWorld() {
    for (let i = 0; i < 4; i++) {
      const x = Math.floor(Math.random() * 20) - 10
      const z = Math.floor(Math.random() * 20) - 10
      this.generateChunk(x, z)
    }
    soundSystem.playInteractionSound('powerup')
  }

  private resetWorld() {
    this.chunks.forEach(chunk => {
      chunk.isLoaded = false
    })
    this.chunks.clear()
    this.generateInitialChunks()
    soundSystem.playInteractionSound('click')
  }

  public getChunks(): ProceduralChunk[] {
    return Array.from(this.chunks.values())
  }

  public cleanup() {
    this.chunks.clear()
    if (this.generationUI) {
      engine.removeEntity(this.generationUI)
    }
    this.isInitialized = false
  }
}

export const proceduralSystem = new ProceduralGenerationSystem()
