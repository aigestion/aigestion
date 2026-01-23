// Responsive UI System with Touch Gestures for AIGestion Virtual Office
import { engine, InputAction, Material, MeshRenderer, pointerEventsSystem, TextShape, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { soundSystem } from './enhanced-sound'

interface UIComponent {
  id: string
  entity: any
  type: 'button' | 'panel' | 'slider' | 'toggle' | 'input'
  position: Vector3
  size: Vector3
  visible: boolean
  interactive: boolean
  gestureHandlers: Map<string, Function>
}

interface GestureData {
  type: 'tap' | 'swipe' | 'pinch' | 'rotate' | 'longPress'
  startPosition: Vector3
  currentPosition: Vector3
  startTime: number
  duration: number
  velocity: Vector3
  distance: number
}

interface TouchPoint {
  id: number
  position: Vector3
  timestamp: number
  pressure: number
}

export class ResponsiveUISystem {
  private components: Map<string, UIComponent> = new Map()
  private touchPoints: Map<number, TouchPoint> = new Map()
  private activeGestures: Map<string, GestureData> = new Map()
  private gestureThresholds = {
    tap: { maxDuration: 300, maxDistance: 0.1 },
    longPress: { minDuration: 500, maxDistance: 0.1 },
    swipe: { minVelocity: 0.5, minDistance: 0.5 },
    pinch: { minScale: 0.8, maxScale: 1.2 },
    rotate: { minAngle: 15 }
  }
  private isInitialized: boolean = false

  // Initialize the UI system
  initialize() {
    console.log('📱 Responsive UI System Initializing...')

    this.createMainUI()
    this.setupGestureRecognition()
    this.startAnimationLoop()

    this.isInitialized = true
    console.log('📱 Responsive UI System Ready!')
  }

  // Create main UI interface
  private createMainUI() {
    // Create floating control panel
    this.createFloatingPanel()

    // Create gesture tutorial
    this.createGestureTutorial()

    // Create responsive buttons
    this.createResponsiveButtons()

    // Create touch feedback system
    this.createTouchFeedback()
  }

  // Create floating control panel
  private createFloatingPanel() {
    const panel = engine.addEntity()
    Transform.create(panel, {
      position: Vector3.create(8, 3, 2),
      scale: Vector3.create(4, 2, 0.1)
    })
    MeshRenderer.setBox(panel)
    Material.setPbrMaterial(panel, {
      albedoColor: Color4.create(0.1, 0.1, 0.2, 0.9),
      roughness: 0.2,
      metallic: 0.8,
      emissiveColor: Color4.create(0.2, 0.3, 0.6, 0.5),
      emissiveIntensity: 2
    })

    // Panel title
    const title = engine.addEntity()
    Transform.create(title, {
      parent: panel,
      position: Vector3.create(0, 0.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(title, {
      text: '🎮 CONTROL PANEL',
      textColor: Color4.create(0.8, 0.8, 1, 1),
      fontSize: 3,
      textAlign: 3
    })

    // Add gesture handlers for panel
    this.addComponent('mainPanel', {
      id: 'mainPanel',
      entity: panel,
      type: 'panel',
      position: Vector3.create(8, 3, 2),
      size: Vector3.create(4, 2, 0.1),
      visible: true,
      interactive: true,
      gestureHandlers: new Map([
        ['drag', this.handlePanelDrag.bind(this)],
        ['pinch', this.handlePanelPinch.bind(this)],
        ['doubleTap', this.handlePanelDoubleTap.bind(this)]
      ])
    })
  }

  // Create gesture tutorial
  private createGestureTutorial() {
    const tutorial = engine.addEntity()
    Transform.create(tutorial, {
      position: Vector3.create(14, 4, 2),
      scale: Vector3.create(2, 3, 0.1)
    })
    MeshRenderer.setBox(tutorial)
    Material.setPbrMaterial(tutorial, {
      albedoColor: Color4.create(0.2, 0.1, 0.3, 0.8),
      emissiveColor: Color4.create(0.4, 0.2, 0.6, 0.4),
      emissiveIntensity: 1
    })

    const tutorialText = engine.addEntity()
    Transform.create(tutorialText, {
      parent: tutorial,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.2, 0.2, 0.2)
    })
    TextShape.create(tutorialText, {
      text: '👆 TAP\n🤚 SWIPE\n🤏 PINCH\n🔄 ROTATE\n⏰ LONG PRESS',
      textColor: Color4.create(1, 1, 0.8, 1),
      fontSize: 2,
      textAlign: 3
    })

    this.addComponent('gestureTutorial', {
      id: 'gestureTutorial',
      entity: tutorial,
      type: 'panel',
      position: Vector3.create(14, 4, 2),
      size: Vector3.create(2, 3, 0.1),
      visible: true,
      interactive: true,
      gestureHandlers: new Map([
        ['tap', this.handleTutorialTap.bind(this)]
      ])
    })
  }

  // Create responsive buttons
  private createResponsiveButtons() {
    const buttonConfigs = [
      { id: 'btnLights', label: '💡', pos: Vector3.create(2, 1.5, 2), color: Color4.create(1, 0.8, 0.2, 1) },
      { id: 'btnSound', label: '🔊', pos: Vector3.create(3, 1.5, 2), color: Color4.create(0.2, 0.8, 1, 1) },
      { id: 'btnData', label: '📊', pos: Vector3.create(4, 1.5, 2), color: Color4.create(0.8, 0.2, 1, 1) },
      { id: 'btnNPC', label: '🤖', pos: Vector3.create(5, 1.5, 2), color: Color4.create(0.2, 1, 0.8, 1) }
    ]

    buttonConfigs.forEach(config => {
      const button = engine.addEntity()
      Transform.create(button, {
        position: config.pos,
        scale: Vector3.create(0.4, 0.4, 0.1)
      })
      MeshRenderer.setBox(button)
      Material.setPbrMaterial(button, {
        albedoColor: config.color,
        roughness: 0.1,
        metallic: 0.9,
        emissiveColor: config.color,
        emissiveIntensity: 2
      })

      const buttonText = engine.addEntity()
      Transform.create(buttonText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5)
      })
      TextShape.create(buttonText, {
        text: config.label,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 4,
        textAlign: 3
      })

      this.addComponent(config.id, {
        id: config.id,
        entity: button,
        type: 'button',
        position: config.pos,
        size: Vector3.create(0.4, 0.4, 0.1),
        visible: true,
        interactive: true,
        gestureHandlers: new Map([
          ['tap', () => this.handleButtonTap(config.id)],
          ['longPress', () => this.handleButtonLongPress(config.id)],
          ['swipe', (direction: Vector3) => this.handleButtonSwipe(config.id, direction)]
        ])
      })
    })
  }

  // Create touch feedback system
  private createTouchFeedback() {
    // Create ripple effect entity
    const rippleEffect = engine.addEntity()
    Transform.create(rippleEffect, {
      position: Vector3.create(0, -10, 0), // Hidden initially
      scale: Vector3.create(0.1, 0.1, 0.1)
    })
    MeshRenderer.setSphere(rippleEffect)
    Material.setPbrMaterial(rippleEffect, {
      albedoColor: Color4.create(0.5, 0.8, 1, 0.6),
      emissiveColor: Color4.create(0.5, 0.8, 1, 0.8),
      emissiveIntensity: 3
    })

    this.addComponent('touchFeedback', {
      id: 'touchFeedback',
      entity: rippleEffect,
      type: 'panel',
      position: Vector3.create(0, -10, 0),
      size: Vector3.create(0.1, 0.1, 0.1),
      visible: false,
      interactive: false,
      gestureHandlers: new Map()
    })
  }

  // Setup gesture recognition system
  private setupGestureRecognition() {
    // Track pointer events for gesture recognition
    pointerEventsSystem.onPointerDown(
      { entity: engine.RootEntity, opts: { button: InputAction.IA_POINTER } },
      (e) => this.handleTouchStart(e)
    )

    pointerEventsSystem.onPointerUp(
      { entity: engine.RootEntity, opts: { button: InputAction.IA_POINTER } },
      (e) => this.handleTouchEnd(e)
    )

    // Add hover detection for interactive components
    engine.addSystem(() => {
      this.updateHoverStates()
    })
  }

  // Handle touch start
  private handleTouchStart(event: any) {
    const touchPoint: TouchPoint = {
      id: Date.now(),
      position: Vector3.create(event.hit.hitPoint.x, event.hit.hitPoint.y, event.hit.hitPoint.z),
      timestamp: Date.now(),
      pressure: 1.0
    }

    this.touchPoints.set(touchPoint.id, touchPoint)

    // Start potential gestures
    this.startGestureDetection(touchPoint)

    // Show immediate feedback
    this.showTouchFeedback(touchPoint.position)
  }

  // Handle touch end
  private handleTouchEnd(event: any) {
    const touchPoint = Array.from(this.touchPoints.values()).pop()
    if (!touchPoint) return

    const endPosition = Vector3.create(event.hit.hitPoint.x, event.hit.hitPoint.y, event.hit.hitPoint.z)
    const duration = Date.now() - touchPoint.timestamp
    const distance = Vector3.distance(touchPoint.position, endPosition)

    // Detect and trigger gestures
    this.detectAndTriggerGesture(touchPoint, endPosition, duration, distance)

    // Clean up
    this.touchPoints.delete(touchPoint.id)
    this.hideTouchFeedback()
  }

  // Start gesture detection
  private startGestureDetection(touchPoint: TouchPoint) {
    // Start long press timer
    setTimeout(() => {
      if (this.touchPoints.has(touchPoint.id)) {
        this.triggerGesture('longPress', touchPoint.position, touchPoint.position, Date.now() - touchPoint.timestamp, 0)
      }
    }, this.gestureThresholds.longPress.minDuration)
  }

  // Detect and trigger gestures
  private detectAndTriggerGesture(startPoint: TouchPoint, endPosition: Vector3, duration: number, distance: number) {
    // Tap detection
    if (duration <= this.gestureThresholds.tap.maxDuration && distance <= this.gestureThresholds.tap.maxDistance) {
      this.triggerGesture('tap', startPoint.position, endPosition, duration, distance)
      return
    }

    // Swipe detection
    const velocity = distance / duration * 1000
    if (velocity >= this.gestureThresholds.swipe.minVelocity && distance >= this.gestureThresholds.swipe.minDistance) {
      const direction = Vector3.subtract(endPosition, startPoint.position).normalize()
      this.triggerGesture('swipe', startPoint.position, endPosition, duration, distance, direction)
      return
    }

    // Long press detection (handled by timer)
    if (duration >= this.gestureThresholds.longPress.minDuration && distance <= this.gestureThresholds.longPress.maxDistance) {
      this.triggerGesture('longPress', startPoint.position, endPosition, duration, distance)
    }
  }

  // Trigger gesture on components
  private triggerGesture(type: string, startPos: Vector3, endPos: Vector3, duration: number, distance: number, direction?: Vector3) {
    this.components.forEach((component) => {
      if (!component.interactive || !component.visible) return

      // Check if gesture is within component bounds
      if (this.isPointInComponent(endPos, component)) {
        const handler = component.gestureHandlers.get(type)
        if (handler) {
          soundSystem.playInteractionSound('click')
          if (direction) {
            handler(direction)
          } else {
            handler()
          }
        }
      }
    })
  }

  // Check if point is within component bounds
  private isPointInComponent(point: Vector3, component: UIComponent): boolean {
    const halfSize = Vector3.scale(component.size, 0.5)
    const minBounds = Vector3.subtract(component.position, halfSize)
    const maxBounds = Vector3.add(component.position, halfSize)

    return point.x >= minBounds.x && point.x <= maxBounds.x &&
      point.y >= minBounds.y && point.y <= maxBounds.y &&
      point.z >= minBounds.z && point.z <= maxBounds.z
  }

  // Show touch feedback
  private showTouchFeedback(position: Vector3) {
    const feedback = this.components.get('touchFeedback')
    if (feedback) {
      const transform = Transform.getMutable(feedback.entity)
      transform.position = position
      transform.scale = Vector3.create(0.1, 0.1, 0.1)

      // Animate ripple
      this.animateRipple(feedback.entity)
    }
  }

  // Hide touch feedback
  private hideTouchFeedback() {
    const feedback = this.components.get('touchFeedback')
    if (feedback) {
      const transform = Transform.getMutable(feedback.entity)
      transform.position = Vector3.create(0, -10, 0) // Hide off-screen
    }
  }

  // Animate ripple effect
  private animateRipple(entity: any) {
    let scale = 0.1
    let opacity = 1.0

    const animate = () => {
      scale += 0.02
      opacity -= 0.02

      const transform = Transform.getMutable(entity)
      transform.scale = Vector3.create(scale, scale, scale)

      const material = Material.getMutable(entity)
      if (material && material.$case === 'pbr') {
        material.pbr.albedoColor = Color4.create(0.5, 0.8, 1, opacity)
      }

      if (opacity > 0) {
        setTimeout(animate, 16)
      }
    }

    animate()
  }

  // Gesture handlers
  private handlePanelDrag() {
    console.log('🎮 Panel dragged')
    // Implement panel dragging logic
  }

  private handlePanelPinch() {
    console.log('🎮 Panel pinched')
    // Implement panel scaling logic
  }

  private handlePanelDoubleTap() {
    console.log('🎮 Panel double-tapped')
    // Implement panel reset logic
  }

  private handleTutorialTap() {
    console.log('📚 Tutorial tapped')
    // Show detailed gesture instructions
  }

  private handleButtonTap(buttonId: string) {
    console.log(`🔘 Button ${buttonId} tapped`)

    switch (buttonId) {
      case 'btnLights':
        this.toggleLights()
        break
      case 'btnSound':
        this.toggleSound()
        break
      case 'btnData':
        this.toggleDataVisualization()
        break
      case 'btnNPC':
        this.toggleNPCs()
        break
    }
  }

  private handleButtonLongPress(buttonId: string) {
    console.log(`⏰ Button ${buttonId} long-pressed`)
    // Show advanced options for button
  }

  private handleButtonSwipe(buttonId: string, direction: Vector3) {
    console.log(`👆 Button ${buttonId} swiped ${direction}`)
    // Handle swipe gestures on buttons
  }

  // Control functions
  private toggleLights() {
    // Toggle lighting system
    console.log('💡 Lights toggled')
  }

  private toggleSound() {
    // Toggle sound system
    console.log('🔊 Sound toggled')
  }

  private toggleDataVisualization() {
    // Toggle data visualization
    console.log('📊 Data visualization toggled')
  }

  private toggleNPCs() {
    // Toggle NPC system
    console.log('🤖 NPCs toggled')
  }

  // Update hover states
  private updateHoverStates() {
    this.components.forEach((component) => {
      if (!component.interactive || !component.visible) return

      // Check for hover state and update appearance
      const material = Material.getMutable(component.entity)
      if (material && material.$case === 'pbr') {
        // Add hover glow effect
        const time = Date.now() / 1000
        const pulse = Math.sin(time * 3) * 0.1 + 0.9
        material.pbr.emissiveIntensity = pulse * 2
      }
    })
  }

  // Start animation loop
  private startAnimationLoop() {
    engine.addSystem(() => {
      if (!this.isInitialized) return

      // Update UI animations
      this.updateUIAnimations()
    })
  }

  // Update UI animations
  private updateUIAnimations() {
    this.components.forEach((component) => {
      if (!component.visible) return

      // Add subtle floating animation to interactive elements
      if (component.interactive) {
        const time = Date.now() / 1000
        const transform = Transform.getMutable(component.entity)
        const floatOffset = Math.sin(time + component.position.x) * 0.02
        transform.position.y = component.position.y + floatOffset
      }
    })
  }

  // Add component to system
  private addComponent(id: string, component: UIComponent) {
    this.components.set(id, component)
  }

  // Get component by ID
  public getComponent(id: string): UIComponent | undefined {
    return this.components.get(id)
  }

  // Show/hide component
  public setComponentVisibility(id: string, visible: boolean) {
    const component = this.components.get(id)
    if (component) {
      component.visible = visible
      const transform = Transform.getMutable(component.entity)
      if (visible) {
        transform.scale = component.size
      } else {
        transform.scale = Vector3.create(0, 0, 0)
      }
    }
  }

  // Cleanup system
  public cleanup() {
    this.components.forEach(component => {
      engine.removeEntity(component.entity)
    })
    this.components.clear()
    this.touchPoints.clear()
    this.activeGestures.clear()
    this.isInitialized = false
  }
}

// Export singleton instance
export const uiSystem = new ResponsiveUISystem()
