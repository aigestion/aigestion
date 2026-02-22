// Gesture Recognition System for Hands-Free Control
import {
  engine,
  InputAction,
  Material,
  MeshRenderer,
  pointerEventsSystem,
  TextShape,
  Transform,
} from '@dcl/sdk/ecs';
import { setTimeout, setInterval } from './utils/timers';
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math';
import { soundSystem } from './enhanced-sound';

interface Gesture {
  id: string;
  name: string;
  type:
    | 'swipe'
    | 'circle'
    | 'push'
    | 'pull'
    | 'wave'
    | 'point'
    | 'thumbs_up'
    | 'thumbs_down'
    | 'pinch'
    | 'spread';
  confidence: number;
  isActive: boolean;
  startPoint: Vector3;
  endPoint: Vector3;
  duration: number;
  path: Vector3[];
}

interface HandTracking {
  isActive: boolean;
  leftHand: HandData | null;
  rightHand: HandData | null;
  lastUpdate: number;
}

interface HandData {
  position: Vector3;
  rotation: Quaternion;
  fingers: FingerData[];
  confidence: number;
}

interface FingerData {
  id: string;
  position: Vector3;
  isExtended: boolean;
  confidence: number;
}

interface GestureAction {
  gestureType: string;
  action: string;
  parameters: any;
  enabled: boolean;
}

export class GestureRecognitionSystem {
  private gestures: Map<string, Gesture> = new Map();
  private handTracking: HandTracking;
  private gestureActions: Map<string, GestureAction> = new Map();
  private gestureUI: any;
  private gestureTrails: Map<string, any[]> = new Map();
  private isInitialized: boolean = false;
  private gestureHistory: Gesture[] = [];
  private maxHistoryLength: number = 10;

  constructor() {
    this.handTracking = {
      isActive: false,
      leftHand: null,
      rightHand: null,
      lastUpdate: Date.now(),
    };
  }

  // Initialize gesture recognition system
  initialize() {
    console.log('👋 Gesture Recognition System Initializing...');

    this.setupGestureActions();
    this.createGestureUI();
    this.startHandTracking();
    this.startGestureRecognition();

    this.isInitialized = true;
    console.log('👋 Gesture Recognition System Ready!');
  }

  // Setup gesture actions
  private setupGestureActions() {
    // Navigation gestures
    this.addGestureAction('swipe_left', 'navigate', { direction: 'left' }, true);
    this.addGestureAction('swipe_right', 'navigate', { direction: 'right' }, true);
    this.addGestureAction('swipe_up', 'navigate', { direction: 'up' }, true);
    this.addGestureAction('swipe_down', 'navigate', { direction: 'down' }, true);

    // Control gestures
    this.addGestureAction('push', 'push_object', { force: 1.0 }, true);
    this.addGestureAction('pull', 'pull_object', { force: 1.0 }, true);
    this.addGestureAction('point', 'select_target', { mode: 'single' }, true);
    this.addGestureAction('pinch', 'zoom', { scale: 1.0 }, true);
    this.addGestureAction('spread', 'zoom', { scale: 2.0 }, true);

    // UI gestures
    this.addGestureAction('wave', 'toggle_menu', {}, true);
    this.addGestureAction('thumbs_up', 'confirm', {}, true);
    this.addGestureAction('thumbs_down', 'cancel', {}, true);
    this.addGestureAction('circle', 'rotate', { angle: 360 }, true);

    // System gestures
    this.addGestureAction('double_swipe', 'switch_scene', {}, true);
    this.addGestureAction('hold', 'open_settings', {}, true);
  }

  // Add gesture action
  private addGestureAction(gestureType: string, action: string, parameters: any, enabled: boolean) {
    const gestureAction: GestureAction = {
      gestureType: gestureType,
      action: action,
      parameters: parameters,
      enabled: enabled,
    };

    this.gestureActions.set(gestureType + '_' + action, gestureAction);
  }

  // Create gesture UI
  private createGestureUI() {
    this.gestureUI = engine.addEntity();
    Transform.create(this.gestureUI, {
      position: Vector3.create(8, 5, 8),
      scale: Vector3.create(3, 1, 0.1),
    });
    MeshRenderer.setBox(this.gestureUI);
    Material.setPbrMaterial(this.gestureUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2,
    });

    const title = engine.addEntity();
    Transform.create(title, {
      parent: this.gestureUI,
      position: Vector3.create(0, 0.3, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(title, {
      text: '👋 GESTURE CONTROL ACTIVE',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3,
    });

    // Gesture indicators
    this.createGestureIndicators();
  }

  // Create gesture indicators
  private createGestureIndicators() {
    const indicatorPositions = [
      { x: -1, y: -0.2, gesture: '👆' },
      { x: -0.5, y: -0.2, gesture: '🤚' },
      { x: 0, y: -0.2, gesture: '👌' },
      { x: 0.5, y: -0.2, gesture: '👋' },
      { x: 1, y: -0.2, gesture: '👍' },
    ];

    indicatorPositions.forEach(pos => {
      const indicator = engine.addEntity();
      Transform.create(indicator, {
        parent: this.gestureUI,
        position: Vector3.create(pos.x, pos.y, 0.1),
        scale: Vector3.create(0.2, 0.2, 0.1),
      });
      MeshRenderer.setBox(indicator);
      Material.setPbrMaterial(indicator, {
        albedoColor: Color4.create(0.2, 0.8, 0.2, 1),
        emissiveColor: Color4.create(0.2, 0.8, 0.2, 0.5),
        emissiveIntensity: 1,
      });

      const gestureText = engine.addEntity();
      Transform.create(gestureText, {
        parent: indicator,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5),
      });
      TextShape.create(gestureText, {
        text: pos.gesture,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3,
      });
    });
  }

  // Start hand tracking simulation
  private startHandTracking() {
    this.handTracking.isActive = true;

    // Simulate hand tracking data
    engine.addSystem(() => {
      if (!this.isInitialized || !this.handTracking.isActive) return;

      this.updateHandTracking();
    });
  }

  // Update hand tracking
  private updateHandTracking() {
    const time = Date.now() / 1000;

    // Simulate right hand position
    this.handTracking.rightHand = {
      position: Vector3.create(
        8 + Math.sin(time * 0.5) * 2,
        2 + Math.cos(time * 0.3) * 0.5,
        8 + Math.cos(time * 0.4) * 2
      ),
      rotation: Quaternion.fromEulerDegrees(
        Math.sin(time * 0.2) * 20,
        Math.cos(time * 0.3) * 30,
        Math.sin(time * 0.4) * 10
      ),
      fingers: this.simulateFingers(time),
      confidence: 0.9,
    };

    // Simulate left hand position
    this.handTracking.leftHand = {
      position: Vector3.create(
        8 + Math.cos(time * 0.4) * 1.5,
        2 + Math.sin(time * 0.5) * 0.3,
        8 + Math.sin(time * 0.3) * 1.5
      ),
      rotation: Quaternion.fromEulerDegrees(
        Math.cos(time * 0.3) * 15,
        Math.sin(time * 0.4) * 25,
        Math.cos(time * 0.2) * 8
      ),
      fingers: this.simulateFingers(time + Math.PI),
      confidence: 0.85,
    };

    this.handTracking.lastUpdate = Date.now();
  }

  // Simulate finger data
  private simulateFingers(time: number): FingerData[] {
    return [
      {
        id: 'thumb',
        position: Vector3.create(0.1, 0.1, 0.05),
        isExtended: Math.sin(time * 2) > 0,
        confidence: 0.9,
      },
      {
        id: 'index',
        position: Vector3.create(0.15, 0.15, 0.1),
        isExtended: Math.sin(time * 3) > -0.5,
        confidence: 0.95,
      },
      {
        id: 'middle',
        position: Vector3.create(0.1, 0.2, 0.08),
        isExtended: Math.sin(time * 2.5) > -0.3,
        confidence: 0.9,
      },
      {
        id: 'ring',
        position: Vector3.create(0.05, 0.18, 0.06),
        isExtended: Math.sin(time * 2.2) > -0.2,
        confidence: 0.85,
      },
      {
        id: 'pinky',
        position: Vector3.create(0, 0.15, 0.04),
        isExtended: Math.sin(time * 2.8) > -0.1,
        confidence: 0.8,
      },
    ];
  }

  // Start gesture recognition
  private startGestureRecognition() {
    engine.addSystem(() => {
      if (!this.isInitialized) return;

      this.detectGestures();
      this.updateGestureTrails();
    });
  }

  // Detect gestures
  private detectGestures() {
    if (!this.handTracking.rightHand) return;

    const hand = this.handTracking.rightHand;
    const currentTime = Date.now();

    // Detect different gestures based on hand position and finger configuration
    this.detectSwipeGesture(hand, currentTime);
    this.detectCircleGesture(hand, currentTime);
    this.detectPinchGesture(hand, currentTime);
    this.detectWaveGesture(hand, currentTime);
    this.detectPointGesture(hand, currentTime);
    this.detectThumbsGesture(hand, currentTime);
  }

  // Detect swipe gesture
  private detectSwipeGesture(hand: HandData, currentTime: number) {
    // Simple swipe detection based on hand movement
    const gestureId = 'swipe';
    let existingGesture = this.gestures.get(gestureId);

    if (!existingGesture) {
      existingGesture = {
        id: gestureId,
        name: 'Swipe',
        type: 'swipe',
        confidence: 0,
        isActive: false,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position],
      };
      this.gestures.set(gestureId, existingGesture);
    }

    // Update gesture path
    existingGesture.path.push(hand.position);
    existingGesture.endPoint = hand.position;
    existingGesture.duration = currentTime - (existingGesture.duration || currentTime);

    // Check if swipe is complete
    const distance = Vector3.distance(existingGesture.startPoint, existingGesture.endPoint);
    if (distance > 1.0 && existingGesture.duration > 500) {
      existingGesture.isActive = true;
      existingGesture.confidence = Math.min(1.0, distance / 2.0);

      this.onGestureDetected(existingGesture);
      this.gestures.delete(gestureId);
    }
  }

  // Detect circle gesture
  private detectCircleGesture(hand: HandData, currentTime: number) {
    const gestureId = 'circle';
    let existingGesture = this.gestures.get(gestureId);

    if (!existingGesture) {
      existingGesture = {
        id: gestureId,
        name: 'Circle',
        type: 'circle',
        confidence: 0,
        isActive: false,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position],
      };
      this.gestures.set(gestureId, existingGesture);
    }

    existingGesture.path.push(hand.position);
    existingGesture.duration = currentTime - (existingGesture.duration || currentTime);

    // Check if path forms a circle
    if (existingGesture.path.length > 20) {
      const isCircle = this.isCircularPath(existingGesture.path);
      if (isCircle) {
        existingGesture.isActive = true;
        existingGesture.confidence = 0.8;

        this.onGestureDetected(existingGesture);
        this.gestures.delete(gestureId);
      }
    }
  }

  // Detect pinch gesture
  private detectPinchGesture(hand: HandData, currentTime: number) {
    const thumbExtended = hand.fingers.find(f => f.id === 'thumb')?.isExtended;
    const indexExtended = hand.fingers.find(f => f.id === 'index')?.isExtended;

    if (thumbExtended && indexExtended) {
      const thumb = hand.fingers.find(f => f.id === 'thumb');
      const index = hand.fingers.find(f => f.id === 'index');

      if (thumb && index) {
        const distance = Vector3.distance(thumb.position, index.position);

        if (distance < 0.05) {
          const gesture: Gesture = {
            id: 'pinch',
            name: 'Pinch',
            type: 'pinch',
            confidence: 0.9,
            isActive: true,
            startPoint: hand.position,
            endPoint: hand.position,
            duration: 0,
            path: [hand.position],
          };

          this.onGestureDetected(gesture);
        }
      }
    }
  }

  // Detect wave gesture
  private detectWaveGesture(hand: HandData, currentTime: number) {
    const gestureId = 'wave';
    let existingGesture = this.gestures.get(gestureId);

    if (!existingGesture) {
      existingGesture = {
        id: gestureId,
        name: 'Wave',
        type: 'wave',
        confidence: 0,
        isActive: false,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position],
      };
      this.gestures.set(gestureId, existingGesture);
    }

    existingGesture.path.push(hand.position);
    existingGesture.duration = currentTime - (existingGesture.duration || currentTime);

    // Check for waving motion (alternating left-right movement)
    if (existingGesture.path.length > 10) {
      const isWaving = this.isWavingMotion(existingGesture.path);
      if (isWaving) {
        existingGesture.isActive = true;
        existingGesture.confidence = 0.7;

        this.onGestureDetected(existingGesture);
        this.gestures.delete(gestureId);
      }
    }
  }

  // Detect point gesture
  private detectPointGesture(hand: HandData, currentTime: number) {
    const indexExtended = hand.fingers.find(f => f.id === 'index')?.isExtended;
    const otherFingersExtended = hand.fingers.filter(f => f.id !== 'index').some(f => f.isExtended);

    if (indexExtended && !otherFingersExtended) {
      const gesture: Gesture = {
        id: 'point',
        name: 'Point',
        type: 'point',
        confidence: 0.85,
        isActive: true,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position],
      };

      this.onGestureDetected(gesture);
    }
  }

  // Detect thumbs up/down gesture
  private detectThumbsGesture(hand: HandData, currentTime: number) {
    const thumbExtended = hand.fingers.find(f => f.id === 'thumb')?.isExtended;
    const otherFingersExtended = hand.fingers.filter(f => f.id !== 'thumb').some(f => f.isExtended);

    if (thumbExtended && !otherFingersExtended) {
      const gesture: Gesture = {
        id: 'thumbs_up',
        name: 'Thumbs Up',
        type: 'thumbs_up',
        confidence: 0.9,
        isActive: true,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position],
      };

      this.onGestureDetected(gesture);
    }
  }

  // Check if path is circular
  private isCircularPath(path: Vector3[]): boolean {
    if (path.length < 10) return false;

    const center = Vector3.lerp(path[0], path[path.length - 1], 0.5);
    const radius = Vector3.distance(path[0], center);

    // Check if all points are roughly at the same distance from center
    let isCircular = true;
    for (let i = 1; i < path.length; i++) {
      const distance = Vector3.distance(path[i], center);
      if (Math.abs(distance - radius) > radius * 0.3) {
        isCircular = false;
        break;
      }
    }

    return isCircular;
  }

  // Check for waving motion
  private isWavingMotion(path: Vector3[]): boolean {
    if (path.length < 10) return false;

    let directionChanges = 0;
    let lastDirection = 0;

    for (let i = 1; i < path.length; i++) {
      const direction = path[i].x - path[i - 1].x;
      if (Math.sign(direction) !== Math.sign(lastDirection) && lastDirection !== 0) {
        directionChanges++;
      }
      lastDirection = direction;
    }

    return directionChanges >= 3;
  }

  // Handle detected gesture
  private onGestureDetected(gesture: Gesture) {
    console.log(
      '👋 Gesture detected: ' +
        gesture.name +
        ' (confidence: ' +
        gesture.confidence.toFixed(2) +
        ')'
    );

    // Add to history
    this.gestureHistory.push(gesture);
    if (this.gestureHistory.length > this.maxHistoryLength) {
      this.gestureHistory.shift();
    }

    // Find and execute action
    this.gestureActions.forEach((action, key) => {
      if (action.enabled && key.startsWith(gesture.type)) {
        this.executeGestureAction(action);
      }
    });

    // Play feedback sound
    soundSystem.playInteractionSound('click');

    // Create visual feedback
    this.createGestureFeedback(gesture);
  }

  // Execute gesture action
  private executeGestureAction(action: GestureAction) {
    console.log('🎯 Executing action: ' + action.action + ' with parameters:', action.parameters);

    switch (action.action) {
      case 'navigate':
        console.log(`🧭 Navigating ${action.parameters.direction}`);
        break;
      case 'push_object':
        console.log(`💪 Pushing object with force: ${action.parameters.force}`);
        break;
      case 'pull_object':
        console.log(`🎯 Pulling object with force: ${action.parameters.force}`);
        break;
      case 'select_target':
        console.log(`👆 Selecting target in ${action.parameters.mode} mode`);
        break;
      case 'zoom':
        console.log(`🔍 Zooming to scale: ${action.parameters.scale}`);
        break;
      case 'toggle_menu':
        console.log(`📋 Toggling menu`);
        break;
      case 'confirm':
        console.log(`✅ Confirming action`);
        break;
      case 'cancel':
        console.log(`❌ Canceling action`);
        break;
      case 'rotate':
        console.log(`🔄 Rotating by ${action.parameters.angle} degrees`);
        break;
      case 'switch_scene':
        console.log(`🎬 Switching scene`);
        break;
      case 'open_settings':
        console.log(`⚙️ Opening settings`);
        break;
    }
  }

  // Create gesture feedback
  private createGestureFeedback(gesture: Gesture) {
    const feedback = engine.addEntity();
    Transform.create(feedback, {
      position: gesture.endPoint,
      scale: Vector3.create(0.2, 0.2, 0.2),
    });
    MeshRenderer.setSphere(feedback);
    Material.setPbrMaterial(feedback, {
      albedoColor: Color4.create(0.2, 0.8, 1, 0.8),
      emissiveColor: Color4.create(0.2, 0.8, 1, 1),
      emissiveIntensity: 3,
    });

    // Animate and remove feedback
    this.animateGestureFeedback(feedback);
  }

  // Animate gesture feedback
  private animateGestureFeedback(feedback: any) {
    let scale = 0.2;
    let opacity = 1.0;

    const animate = () => {
      scale += 0.02;
      opacity -= 0.02;

      const transform = Transform.getMutable(feedback);
      transform.scale = Vector3.create(scale, scale, scale);

      const material = Material.get(feedback);
      Material.setPbrMaterial(feedback, {
        ...material,
        albedoColor: Color4.create(0.2, 0.8, 1, opacity),
      });

      if (opacity > 0) {
        setTimeout(animate, 16);
      } else {
        engine.removeEntity(feedback);
      }
    };

    animate();
  }

  // Update gesture trails
  private updateGestureTrails() {
    if (!this.handTracking.rightHand) return;

    const hand = this.handTracking.rightHand;
    const trailId = 'right_hand';

    if (!this.gestureTrails.has(trailId)) {
      this.gestureTrails.set(trailId, []);
    }

    const trail = this.gestureTrails.get(trailId)!;

    // Add current position to trail
    const trailPoint = engine.addEntity();
    Transform.create(trailPoint, {
      position: hand.position,
      scale: Vector3.create(0.05, 0.05, 0.05),
    });
    MeshRenderer.setSphere(trailPoint);
    Material.setPbrMaterial(trailPoint, {
      albedoColor: Color4.create(0.5, 0.8, 1, 0.6),
      emissiveColor: Color4.create(0.5, 0.8, 1, 0.8),
      emissiveIntensity: 2,
    });

    trail.push(trailPoint);

    // Limit trail length
    if (trail.length > 20) {
      const oldPoint = trail.shift();
      engine.removeEntity(oldPoint);
    }

    // Fade trail
    trail.forEach((point, index) => {
      const opacity = (index / trail.length) * 0.6;
      const material = Material.get(point);
      Material.setPbrMaterial(point, {
        ...material,
        albedoColor: Color4.create(0.5, 0.8, 1, opacity),
      });
    });
  }

  // Enable/disable gesture recognition
  public setGestureRecognition(enabled: boolean) {
    this.handTracking.isActive = enabled;
    console.log(`👋 Gesture recognition ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Get gesture history
  public getGestureHistory(): Gesture[] {
    return [...this.gestureHistory];
  }

  // Get current hand tracking data
  public getHandTracking(): HandTracking {
    return { ...this.handTracking };
  }

  // Enable/disable gesture action
  public setGestureAction(gestureType: string, action: string, enabled: boolean) {
    const key = `${gestureType}_${action}`;
    const gestureAction = this.gestureActions.get(key);
    if (gestureAction) {
      gestureAction.enabled = enabled;
      console.log(`👋 Gesture action ${key} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  // Cleanup system
  public cleanup() {
    // Clear gesture trails
    this.gestureTrails.forEach(trail => {
      trail.forEach(point => engine.removeEntity(point));
    });
    this.gestureTrails.clear();

    // Clear gestures
    this.gestures.clear();
    this.gestureHistory = [];

    // Remove UI
    if (this.gestureUI) {
      engine.removeEntity(this.gestureUI);
    }

    this.gestureActions.clear();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const gestureSystem = new GestureRecognitionSystem();
