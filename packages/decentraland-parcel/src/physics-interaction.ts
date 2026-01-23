// Physics-Based Object Interactions for AIGestion Virtual Office
import { engine, InputAction, Material, MeshRenderer, pointerEventsSystem, Transform } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { soundSystem } from './enhanced-sound'

interface PhysicsObject {
  id: string
  type: 'rigid_body' | 'soft_body' | 'static' | 'kinematic'
  mass: number
  velocity: Vector3
  acceleration: Vector3
  angularVelocity: Vector3
  angularAcceleration: Vector3
  position: Vector3
  rotation: Quaternion
  scale: Vector3
  restitution: number // bounciness (0-1)
  friction: number // friction coefficient (0-1)
  damping: number // air resistance (0-1)
  gravityScale: number // gravity multiplier
  isGrounded: boolean
  isColliding: boolean
  collisionLayer: number
  collisionMask: number
}

interface PhysicsMaterial {
  id: string
  name: string
  density: number
  restitution: number
  friction: number
  durability: number
  soundProfile: SoundProfile
}

interface SoundProfile {
  impactSound: string
  frictionSound: string
  breakSound: string
  volume: number
  pitch: number
}

interface ForceField {
  id: string
  type: 'gravity' | 'magnetic' | 'electric' | 'wind' | 'explosion'
  position: Vector3
  radius: number
  strength: number
  direction: Vector3
  isActive: boolean
  affectedObjects: string[]
}

interface Constraint {
  id: string
  type: 'fixed' | 'hinge' | 'spring' | 'slider' | 'ball_socket'
  objectA: string
  objectB?: string
  positionA: Vector3
  positionB?: Vector3
  limits?: ConstraintLimits
  strength: number
  damping: number
}

interface ConstraintLimits {
  minRotation?: Vector3
  maxRotation?: Vector3
  minDistance?: number
  maxDistance?: number
}

interface Collision {
  id: string
  objectA: string
  objectB: string
  contactPoint: Vector3
  contactNormal: Vector3
  impulse: number
  timestamp: number
}

export class PhysicsInteractionSystem {
  private objects: Map<string, PhysicsObject> = new Map()
  private materials: Map<string, PhysicsMaterial> = new Map()
  private forceFields: Map<string, ForceField> = new Map()
  private constraints: Map<string, Constraint> = new Map()
  private collisions: Map<string, Collision> = new Map()
  private physicsUI: any
  private isInitialized: boolean = false
  private gravity: Vector3 = Vector3.create(0, -9.81, 0)
  private timeStep: number = 1 / 60
  private maxSubSteps: number = 4
  private collisionMatrix: boolean[][] = []

  constructor() {
    this.initializeCollisionMatrix()
  }

  // Initialize physics system
  initialize() {
    console.log('⚛️ Physics Interaction System Initializing...')

    this.setupPhysicsMaterials()
    this.createPhysicsUI()
    this.createPhysicsObjects()
    this.startPhysicsEngine()

    this.isInitialized = true
    console.log('⚛️ Physics Interaction System Ready!')
  }

  // Initialize collision matrix
  private initializeCollisionMatrix() {
    // 8 layers for different object types
    for (let i = 0; i < 8; i++) {
      this.collisionMatrix[i] = []
      for (let j = 0; j < 8; j++) {
        this.collisionMatrix[i][j] = true // Default: all layers collide
      }
    }
  }

  // Setup physics materials
  private setupPhysicsMaterials() {
    // Metal material
    const metal: PhysicsMaterial = {
      id: 'material_metal',
      name: 'Metal',
      density: 7850,
      restitution: 0.3,
      friction: 0.7,
      durability: 100,
      soundProfile: {
        impactSound: 'metal_impact',
        frictionSound: 'metal_scrape',
        breakSound: 'metal_break',
        volume: 0.8,
        pitch: 1.0
      }
    }

    // Wood material
    const wood: PhysicsMaterial = {
      id: 'material_wood',
      name: 'Wood',
      density: 700,
      restitution: 0.4,
      friction: 0.6,
      durability: 50,
      soundProfile: {
        impactSound: 'wood_impact',
        frictionSound: 'wood_scrape',
        breakSound: 'wood_break',
        volume: 0.6,
        pitch: 0.9
      }
    }

    // Glass material
    const glass: PhysicsMaterial = {
      id: 'material_glass',
      name: 'Glass',
      density: 2500,
      restitution: 0.1,
      friction: 0.3,
      durability: 20,
      soundProfile: {
        impactSound: 'glass_impact',
        frictionSound: 'glass_scrape',
        breakSound: 'glass_break',
        volume: 0.9,
        pitch: 1.2
      }
    }

    // Rubber material
    const rubber: PhysicsMaterial = {
      id: 'material_rubber',
      name: 'Rubber',
      density: 1500,
      restitution: 0.8,
      friction: 0.9,
      durability: 80,
      soundProfile: {
        impactSound: 'rubber_impact',
        frictionSound: 'rubber_scrape',
        breakSound: 'rubber_break',
        volume: 0.5,
        pitch: 0.8
      }
    }

    this.materials.set(metal.id, metal)
    this.materials.set(wood.id, wood)
    this.materials.set(glass.id, glass)
    this.materials.set(rubber.id, rubber)

    console.log('🔧 Physics materials configured')
  }

  // Create physics UI
  private createPhysicsUI() {
    this.physicsUI = engine.addEntity()
    Transform.create(this.physicsUI, {
      position: Vector3.create(2, 3, 8),
      scale: Vector3.create(3, 4, 0.1)
    })
    MeshRenderer.setBox(this.physicsUI)
    Material.setPbrMaterial(this.physicsUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    })

    // Create title
    const title = engine.addEntity()
    Transform.create(title, {
      parent: this.physicsUI,
      position: Vector3.create(0, 1.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(title, {
      text: '⚛️ PHYSICS INTERACTION',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    })

    // Create object controls
    this.createObjectControls()

    // Create force field controls
    this.createForceFieldControls()

    // Create constraint controls
    this.createConstraintControls()

    // Create physics stats
    this.createPhysicsStats()
  }

  // Create object controls
  private createObjectControls() {
    const controls = [
      { id: 'spawn_ball', icon: '⚪', name: 'Spawn Ball' },
      { id: 'spawn_box', icon: '⬜', name: 'Spawn Box' },
      { id: 'spawn_cylinder', icon: '🥤', name: 'Spawn Cylinder' },
      { id: 'clear_all', icon: '🗑️', name: 'Clear All' }
    ]

    let xOffset = -0.9

    controls.forEach(control => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.physicsUI,
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
        () => this.handleObjectControl(control.id)
      )

      xOffset += 0.6
    })
  }

  // Create force field controls
  private createForceFieldControls() {
    const controls = [
      { id: 'gravity_field', icon: '🌍', name: 'Gravity Field' },
      { id: 'magnetic_field', icon: '🧲', name: 'Magnetic Field' },
      { id: 'wind_field', icon: '💨', name: 'Wind Field' },
      { id: 'explosion', icon: '💥', name: 'Explosion' }
    ]

    let xOffset = -0.9

    controls.forEach(control => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.physicsUI,
        position: Vector3.create(xOffset, 0.6, 0.1),
        scale: Vector3.create(0.3, 0.3, 0.1)
      })
      MeshRenderer.setBox(button)
      Material.setPbrMaterial(button, {
        albedoColor: Color4.create(0.8, 0.3, 0.3, 1),
        emissiveColor: Color4.create(0.8, 0.3, 0.3, 0.5),
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
        () => this.handleForceFieldControl(control.id)
      )

      xOffset += 0.6
    })
  }

  // Create constraint controls
  private createConstraintControls() {
    const controls = [
      { id: 'spring_constraint', icon: '🌀', name: 'Spring' },
      { id: 'hinge_constraint', icon: '🚪', name: 'Hinge' },
      { id: 'fixed_constraint', icon: '🔒', name: 'Fixed' }
    ]

    let xOffset = -0.6

    controls.forEach(control => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.physicsUI,
        position: Vector3.create(xOffset, 0, 0.1),
        scale: Vector3.create(0.3, 0.3, 0.1)
      })
      MeshRenderer.setBox(button)
      Material.setPbrMaterial(button, {
        albedoColor: Color4.create(0.3, 0.8, 0.3, 1),
        emissiveColor: Color4.create(0.3, 0.8, 0.3, 0.5),
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
        () => this.handleConstraintControl(control.id)
      )

      xOffset += 0.6
    })
  }

  // Create physics stats
  private createPhysicsStats() {
    const statsDisplay = engine.addEntity()
    Transform.create(statsDisplay, {
      parent: this.physicsUI,
      position: Vector3.create(0, -0.6, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1)
    })
    MeshRenderer.setBox(statsDisplay)
    Material.setPbrMaterial(statsDisplay, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    })

    const statsText = engine.addEntity()
    Transform.create(statsText, {
      parent: statsDisplay,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(statsText, {
      text: '📊 Objects: 0 | Collisions: 0',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    })
  }

  // Create physics objects
  private createPhysicsObjects() {
    // Create ground plane
    this.createGroundPlane()

    // Create some initial objects
    this.createInitialObjects()
  }

  // Create ground plane
  private createGroundPlane() {
    const ground: PhysicsObject = {
      id: 'ground_plane',
      type: 'static',
      mass: 0,
      velocity: Vector3.create(0, 0, 0),
      acceleration: Vector3.create(0, 0, 0),
      angularVelocity: Vector3.create(0, 0, 0),
      angularAcceleration: Vector3.create(0, 0, 0),
      position: Vector3.create(8, 0, 8),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      scale: Vector3.create(20, 0.1, 20),
      restitution: 0.5,
      friction: 0.8,
      damping: 0.1,
      gravityScale: 0,
      isGrounded: true,
      isColliding: false,
      collisionLayer: 0,
      collisionMask: 255
    }

    this.objects.set(ground.id, ground)
    this.createPhysicsEntity(ground, 'material_metal')
  }

  // Create initial objects
  private createInitialObjects() {
    // Create a few sample objects
    for (let i = 0; i < 3; i++) {
      this.spawnPhysicsObject('ball', Vector3.create(
        6 + i * 2,
        3 + i,
        6 + i
      ))
    }
  }

  // Create physics entity
  private createPhysicsObject(obj: PhysicsObject, materialId: string) {
    const entity = engine.addEntity()
    Transform.create(entity, {
      position: obj.position,
      scale: obj.scale,
      rotation: obj.rotation
    })

    const material = this.materials.get(materialId)
    if (!material) return

    // Set mesh based on object type
    if (obj.id.includes('ball')) {
      MeshRenderer.setSphere(entity)
    } else if (obj.id.includes('box')) {
      MeshRenderer.setBox(entity)
    } else if (obj.id.includes('cylinder')) {
      MeshRenderer.setCylinder(entity, 1, 1, 1, 1, 1)
    } else {
      MeshRenderer.setBox(entity)
    }

    // Set material properties
    const color = this.getMaterialColor(materialId)
    Material.setPbrMaterial(entity, {
      albedoColor: color,
      roughness: 1 - material.friction,
      metallic: material.restitution,
      emissiveColor: Color4.create(0, 0, 0, 0),
      emissiveIntensity: 0
    })

    // Add interaction
    pointerEventsSystem.onPointerDown(
      {
        entity: entity,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Interact' }
      },
      () => this.interactWithObject(obj.id)
    )

    return entity
  }

  // Get material color
  private getMaterialColor(materialId: string): Color4 {
    switch (materialId) {
      case 'material_metal':
        return Color4.create(0.7, 0.7, 0.8, 1)
      case 'material_wood':
        return Color4.create(0.6, 0.4, 0.2, 1)
      case 'material_glass':
        return Color4.create(0.8, 0.9, 1, 0.7)
      case 'material_rubber':
        return Color4.create(0.2, 0.2, 0.2, 1)
      default:
        return Color4.create(0.5, 0.5, 0.5, 1)
    }
  }

  // Start physics engine
  private startPhysicsEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return

      this.simulatePhysics()
      this.detectCollisions()
      this.applyForceFields()
      this.updateConstraints()
      this.updatePhysicsStats()
    })
  }

  // Simulate physics
  private simulatePhysics() {
    const dt = this.timeStep

    this.objects.forEach((obj, id) => {
      if (obj.type === 'static') return

      // Apply gravity
      const gravity = Vector3.scale(this.gravity, obj.gravityScale)
      obj.acceleration = Vector3.add(obj.acceleration, gravity)

      // Update velocity
      obj.velocity = Vector3.add(obj.velocity, Vector3.scale(obj.acceleration, dt))

      // Apply damping
      obj.velocity = Vector3.scale(obj.velocity, 1 - obj.damping * dt)
      obj.angularVelocity = Vector3.scale(obj.angularVelocity, 1 - obj.damping * dt)

      // Update position
      obj.position = Vector3.add(obj.position, Vector3.scale(obj.velocity, dt))

      // Update rotation
      const angularDelta = Vector3.scale(obj.angularVelocity, dt)
      obj.rotation = Quaternion.multiply(
        obj.rotation,
        Quaternion.fromEulerDegrees(angularDelta.x, angularDelta.y, angularDelta.z)
      )

      // Reset acceleration
      obj.acceleration = Vector3.create(0, 0, 0)
      obj.angularAcceleration = Vector3.create(0, 0, 0)

      // Check ground collision
      this.checkGroundCollision(obj)

      // Update entity transform
      this.updateEntityTransform(id)
    })
  }

  // Check ground collision
  private checkGroundCollision(obj: PhysicsObject) {
    if (obj.position.y <= obj.scale.y / 2) {
      obj.position.y = obj.scale.y / 2

      if (obj.velocity.y < 0) {
        obj.velocity.y = -obj.velocity.y * obj.restitution

        // Apply friction
        obj.velocity.x *= (1 - obj.friction * 0.1)
        obj.velocity.z *= (1 - obj.friction * 0.1)

        // Play impact sound
        if (Math.abs(obj.velocity.y) > 0.5) {
          soundSystem.playInteractionSound('impact')
        }
      }

      obj.isGrounded = true
    } else {
      obj.isGrounded = false
    }
  }

  // Update entity transform
  private updateEntityTransform(objectId: string) {
    const obj = this.objects.get(objectId)
    if (!obj) return

    // Find the entity and update its transform
    // In a real implementation, we'd track entity references
  }

  // Detect collisions
  private detectCollisions() {
    const objectArray = Array.from(this.objects.values())

    for (let i = 0; i < objectArray.length; i++) {
      for (let j = i + 1; j < objectArray.length; j++) {
        const objA = objectArray[i]
        const objB = objectArray[j]

        if (this.shouldCollide(objA, objB)) {
          const collision = this.checkCollision(objA, objB)
          if (collision) {
            this.resolveCollision(collision)
          }
        }
      }
    }
  }

  // Check if objects should collide
  private shouldCollide(objA: PhysicsObject, objB: PhysicsObject): boolean {
    return (objA.collisionMask & (1 << objB.collisionLayer)) !== 0 &&
      (objB.collisionMask & (1 << objA.collisionLayer)) !== 0
  }

  // Check collision between two objects
  private checkCollision(objA: PhysicsObject, objB: PhysicsObject): Collision | null {
    // Simple sphere-sphere collision detection
    const distance = Vector3.distance(objA.position, objB.position)
    const minDistance = (objA.scale.x + objB.scale.x) / 2

    if (distance < minDistance) {
      const collision: Collision = {
        id: `collision_${Date.now()}_${Math.random()}`,
        objectA: objA.id,
        objectB: objB.id,
        contactPoint: Vector3.lerp(objA.position, objB.position, 0.5),
        contactNormal: Vector3.normalize(Vector3.subtract(objB.position, objA.position)),
        impulse: minDistance - distance,
        timestamp: Date.now()
      }

      return collision
    }

    return null
  }

  // Resolve collision
  private resolveCollision(collision: Collision) {
    const objA = this.objects.get(collision.objectA)
    const objB = this.objects.get(collision.objectB)

    if (!objA || !objB) return

    // Separate objects
    const separation = Vector3.scale(collision.contactNormal, collision.impulse / 2)

    if (objA.type !== 'static') {
      objA.position = Vector3.subtract(objA.position, separation)
    }

    if (objB.type !== 'static') {
      objB.position = Vector3.add(objB.position, separation)
    }

    // Calculate relative velocity
    const relativeVelocity = Vector3.subtract(objB.velocity, objA.velocity)
    const velocityAlongNormal = Vector3.dot(relativeVelocity, collision.contactNormal)

    // Don't resolve if velocities are separating
    if (velocityAlongNormal > 0) return

    // Calculate restitution
    const restitution = Math.min(objA.restitution, objB.restitution)

    // Calculate impulse scalar
    const impulseScalar = -(1 + restitution) * velocityAlongNormal
    const impulse = Vector3.scale(collision.contactNormal, impulseScalar)

    // Apply impulse
    if (objA.type !== 'static') {
      objA.velocity = Vector3.subtract(objA.velocity, impulse)
    }

    if (objB.type !== 'static') {
      objB.velocity = Vector3.add(objB.velocity, impulse)
    }

    // Store collision
    this.collisions.set(collision.id, collision)

    // Play collision sound
    soundSystem.playInteractionSound('collision')
  }

  // Apply force fields
  private applyForceFields() {
    this.forceFields.forEach((field, id) => {
      if (!field.isActive) return

      this.objects.forEach((obj, objectId) => {
        if (field.affectedObjects.includes(objectId)) {
          this.applyForceField(obj, field)
        }
      })
    })
  }

  // Apply force field to object
  private applyForceField(obj: PhysicsObject, field: ForceField) {
    const distance = Vector3.distance(obj.position, field.position)

    if (distance <= field.radius) {
      const force = Vector3.scale(field.direction, field.strength)
      const falloff = 1 - (distance / field.radius)
      const finalForce = Vector3.scale(force, falloff)

      obj.acceleration = Vector3.add(obj.acceleration, finalForce)
    }
  }

  // Update constraints
  private updateConstraints() {
    this.constraints.forEach((constraint, id) => {
      this.applyConstraint(constraint)
    })
  }

  // Apply constraint
  private applyConstraint(constraint: Constraint) {
    const objA = this.objects.get(constraint.objectA)
    const objB = constraint.objectB ? this.objects.get(constraint.objectB) : null

    if (!objA) return

    switch (constraint.type) {
      case 'spring':
        if (objB) {
          this.applySpringConstraint(objA, objB, constraint)
        }
        break
      case 'hinge':
        if (objB) {
          this.applyHingeConstraint(objA, objB, constraint)
        }
        break
      case 'fixed':
        if (objB) {
          this.applyFixedConstraint(objA, objB, constraint)
        }
        break
    }
  }

  // Apply spring constraint
  private applySpringConstraint(objA: PhysicsObject, objB: PhysicsObject, constraint: Constraint) {
    const distance = Vector3.distance(objA.position, objB.position)
    const restLength = constraint.minDistance || 2
    const displacement = distance - restLength

    if (Math.abs(displacement) > 0.01) {
      const direction = Vector3.normalize(Vector3.subtract(objB.position, objA.position))
      const force = Vector3.scale(direction, displacement * constraint.strength)

      objA.acceleration = Vector3.add(objA.acceleration, force)
      objB.acceleration = Vector3.subtract(objB.acceleration, force)
    }
  }

  // Apply hinge constraint
  private applyHingeConstraint(objA: PhysicsObject, objB: PhysicsObject, constraint: Constraint) {
    // Simplified hinge implementation
    const targetPos = Vector3.add(objB.position, constraint.positionB)
    const direction = Vector3.subtract(targetPos, objA.position)

    objA.position = Vector3.add(targetPos, Vector3.scale(direction, -0.5))
    objB.position = Vector3.add(targetPos, Vector3.scale(direction, 0.5))
  }

  // Apply fixed constraint
  private applyFixedConstraint(objA: PhysicsObject, objB: PhysicsObject, constraint: Constraint) {
    // Keep objects at fixed relative positions
    const targetPos = Vector3.add(objB.position, constraint.positionB)
    objA.position = targetPos
    objA.velocity = Vector3.create(0, 0, 0)
  }

  // Update physics stats
  private updatePhysicsStats() {
    const objectCount = this.objects.size
    const collisionCount = this.collisions.size

    // Update UI with stats
    // In real implementation, this would update the text display
    console.log(`📊 Objects: ${objectCount} | Collisions: ${collisionCount}`)
  }

  // Handle object control
  private handleObjectControl(controlId: string) {
    switch (controlId) {
      case 'spawn_ball':
        this.spawnPhysicsObject('ball', Vector3.create(8, 5, 8))
        break
      case 'spawn_box':
        this.spawnPhysicsObject('box', Vector3.create(8, 5, 8))
        break
      case 'spawn_cylinder':
        this.spawnPhysicsObject('cylinder', Vector3.create(8, 5, 8))
        break
      case 'clear_all':
        this.clearAllObjects()
        break
    }

    soundSystem.playInteractionSound('click')
  }

  // Handle force field control
  private handleForceFieldControl(controlId: string) {
    switch (controlId) {
      case 'gravity_field':
        this.createForceField('gravity')
        break
      case 'magnetic_field':
        this.createForceField('magnetic')
        break
      case 'wind_field':
        this.createForceField('wind')
        break
      case 'explosion':
        this.createExplosion()
        break
    }

    soundSystem.playInteractionSound('powerup')
  }

  // Handle constraint control
  private handleConstraintControl(controlId: string) {
    switch (controlId) {
      case 'spring_constraint':
        this.createSpringConstraint()
        break
      case 'hinge_constraint':
        this.createHingeConstraint()
        break
      case 'fixed_constraint':
        this.createFixedConstraint()
        break
    }

    soundSystem.playInteractionSound('click')
  }

  // Spawn physics object
  public spawnPhysicsObject(type: string, position: Vector3) {
    const obj: PhysicsObject = {
      id: `${type}_${Date.now()}_${Math.random()}`,
      type: 'rigid_body',
      mass: 1,
      velocity: Vector3.create(
        (Math.random() - 0.5) * 2,
        0,
        (Math.random() - 0.5) * 2
      ),
      acceleration: Vector3.create(0, 0, 0),
      angularVelocity: Vector3.create(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      angularAcceleration: Vector3.create(0, 0, 0),
      position: position,
      rotation: Quaternion.fromEulerDegrees(
        Math.random() * 360,
        Math.random() * 360,
        Math.random() * 360
      ),
      scale: Vector3.create(0.5, 0.5, 0.5),
      restitution: 0.6,
      friction: 0.5,
      damping: 0.1,
      gravityScale: 1,
      isGrounded: false,
      isColliding: false,
      collisionLayer: 1,
      collisionMask: 255
    }

    this.objects.set(obj.id, obj)
    this.createPhysicsObject(obj, 'material_rubber')

    console.log(`🎾 Spawned ${type}: ${obj.id}`)
  }

  // Create force field
  public createForceField(type: ForceField['type']) {
    const field: ForceField = {
      id: `field_${type}_${Date.now()}`,
      type: type,
      position: Vector3.create(8, 2, 8),
      radius: 5,
      strength: 10,
      direction: Vector3.create(0, 1, 0),
      isActive: true,
      affectedObjects: Array.from(this.objects.keys()).filter(id => id !== 'ground_plane')
    }

    this.forceFields.set(field.id, field)

    console.log(`⚡ Created ${type} force field: ${field.id}`)
  }

  // Create explosion
  public createExplosion() {
    const explosionPos = Vector3.create(8, 2, 8)
    const explosionForce = 20
    const explosionRadius = 8

    this.objects.forEach((obj, id) => {
      if (obj.type === 'static') return

      const distance = Vector3.distance(obj.position, explosionPos)
      if (distance <= explosionRadius) {
        const direction = Vector3.normalize(Vector3.subtract(obj.position, explosionPos))
        const force = Vector3.scale(direction, explosionForce * (1 - distance / explosionRadius))

        obj.velocity = Vector3.add(obj.velocity, force)
      }
    })

    soundSystem.playInteractionSound('explosion')
    console.log('💥 Explosion created!')
  }

  // Create spring constraint
  public createSpringConstraint() {
    const objectIds = Array.from(this.objects.keys()).filter(id => id !== 'ground_plane')
    if (objectIds.length < 2) return

    const constraint: Constraint = {
      id: `constraint_spring_${Date.now()}`,
      type: 'spring',
      objectA: objectIds[0],
      objectB: objectIds[1],
      positionA: Vector3.create(0, 0, 0),
      positionB: Vector3.create(0, 0, 0),
      minDistance: 2,
      strength: 5,
      damping: 0.5
    }

    this.constraints.set(constraint.id, constraint)
    console.log(`🌀 Created spring constraint: ${constraint.id}`)
  }

  // Create hinge constraint
  public createHingeConstraint() {
    const objectIds = Array.from(this.objects.keys()).filter(id => id !== 'ground_plane')
    if (objectIds.length < 2) return

    const constraint: Constraint = {
      id: `constraint_hinge_${Date.now()}`,
      type: 'hinge',
      objectA: objectIds[0],
      objectB: objectIds[1],
      positionA: Vector3.create(0, 0, 0),
      positionB: Vector3.create(1, 0, 0),
      limits: {
        minRotation: Vector3.create(-45, 0, 0),
        maxRotation: Vector3.create(45, 0, 0)
      },
      strength: 10,
      damping: 0.5
    }

    this.constraints.set(constraint.id, constraint)
    console.log(`🚪 Created hinge constraint: ${constraint.id}`)
  }

  // Create fixed constraint
  public createFixedConstraint() {
    const objectIds = Array.from(this.objects.keys()).filter(id => id !== 'ground_plane')
    if (objectIds.length < 2) return

    const constraint: Constraint = {
      id: `constraint_fixed_${Date.now()}`,
      type: 'fixed',
      objectA: objectIds[0],
      objectB: objectIds[1],
      positionA: Vector3.create(0, 0, 0),
      positionB: Vector3.create(0, 0, 0),
      strength: 100,
      damping: 1
    }

    this.constraints.set(constraint.id, constraint)
    console.log(`🔒 Created fixed constraint: ${constraint.id}`)
  }

  // Interact with object
  private interactWithObject(objectId: string) {
    const obj = this.objects.get(objectId)
    if (!obj || obj.type === 'static') return

    // Apply random impulse
    const impulse = Vector3.create(
      (Math.random() - 0.5) * 10,
      Math.random() * 10,
      (Math.random() - 0.5) * 10
    )

    obj.velocity = Vector3.add(obj.velocity, impulse)

    soundSystem.playInteractionSound('impact')
    console.log(`👊 Applied impulse to ${objectId}`)
  }

  // Clear all objects
  public clearAllObjects() {
    this.objects.forEach((obj, id) => {
      if (id !== 'ground_plane') {
        this.objects.delete(id)
      }
    })

    this.forceFields.clear()
    this.constraints.clear()
    this.collisions.clear()

    console.log('🗑️ Cleared all physics objects')
    soundSystem.playInteractionSound('click')
  }

  // Get physics objects
  public getObjects(): PhysicsObject[] {
    return Array.from(this.objects.values())
  }

  // Get force fields
  public getForceFields(): ForceField[] {
    return Array.from(this.forceFields.values())
  }

  // Get constraints
  public getConstraints(): Constraint[] {
    return Array.from(this.constraints.values())
  }

  // Set gravity
  public setGravity(gravity: Vector3) {
    this.gravity = gravity
    console.log(`🌍 Gravity set to: (${gravity.x}, ${gravity.y}, ${gravity.z})`)
  }

  // Cleanup system
  public cleanup() {
    this.objects.clear()
    this.materials.clear()
    this.forceFields.clear()
    this.constraints.clear()
    this.collisions.clear()

    if (this.physicsUI) {
      engine.removeEntity(this.physicsUI)
    }

    this.isInitialized = false
  }
}

// Export singleton instance
export const physicsSystem = new PhysicsInteractionSystem()
