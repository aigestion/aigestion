// Emotion Detection and Adaptive Responses for AIGestion Virtual Office
import {
  engine,
  InputAction,
  Material,
  MeshRenderer,
  pointerEventsSystem,
  Transform,
} from '@dcl/sdk/ecs';
import { Color3, Color4, Vector3 } from '@dcl/sdk/math';
import { soundSystem } from './enhanced-sound';

interface EmotionData {
  id: string;
  userId: string;
  timestamp: number;
  primaryEmotion: EmotionType;
  secondaryEmotion?: EmotionType;
  confidence: number;
  intensity: number;
  triggers: string[];
  context: EmotionContext;
  physiological: PhysiologicalData;
}

type EmotionType =
  | 'joy'
  | 'sadness'
  | 'anger'
  | 'fear'
  | 'surprise'
  | 'disgust'
  | 'neutral'
  | 'excitement'
  | 'calm'
  | 'stress'
  | 'focus'
  | 'confusion';

interface EmotionContext {
  activity: string;
  location: string;
  participants: string[];
  environment: string;
  timeOfDay: string;
}

interface PhysiologicalData {
  heartRate: number;
  voiceTone: number;
  facialExpression: number;
  bodyLanguage: number;
  responseTime: number;
}

interface AdaptiveResponse {
  id: string;
  emotionTrigger: EmotionType;
  responseType: 'environmental' | 'audio' | 'visual' | 'interaction' | 'system';
  action: AdaptiveAction;
  priority: number;
  conditions: ResponseCondition[];
}

interface AdaptiveAction {
  type: string;
  parameters: Map<string, any>;
  duration: number;
  intensity: number;
}

interface ResponseCondition {
  parameter: string;
  operator: 'greater' | 'less' | 'equals' | 'between';
  value: any;
}

interface EmotionProfile {
  userId: string;
  baselineEmotions: Map<EmotionType, number>;
  personalityTraits: PersonalityTrait[];
  preferences: EmotionPreferences;
  history: EmotionData[];
  adaptationLevel: number;
}

interface PersonalityTrait {
  trait: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  value: number;
}

interface EmotionPreferences {
  lightingPreference: 'warm' | 'cool' | 'neutral' | 'adaptive';
  musicPreference: string[];
  colorPreference: Color3[];
  interactionStyle: 'direct' | 'subtle' | 'minimal';
  privacyLevel: 'high' | 'medium' | 'low';
}

export class EmotionDetectionSystem {
  private emotionProfiles: Map<string, EmotionProfile> = new Map();
  private currentEmotions: Map<string, EmotionData> = new Map();
  private adaptiveResponses: Map<string, AdaptiveResponse> = new Map();
  private emotionUI: any;
  private isInitialized: boolean = false;
  private detectionSensitivity: number = 0.7;
  private adaptationThreshold: number = 0.8;
  private emotionHistory: EmotionData[] = [];
  private maxHistoryLength: number = 100;

  constructor() {
    this.setupAdaptiveResponses();
  }

  // Initialize emotion detection system
  initialize() {
    console.log('😊 Emotion Detection System Initializing...');

    this.createEmotionUI();
    this.createDefaultProfiles();
    this.startEmotionEngine();
    this.initializeSensors();

    this.isInitialized = true;
    console.log('😊 Emotion Detection System Ready!');
  }

  // Setup adaptive responses
  private setupAdaptiveResponses() {
    // Joy responses
    this.adaptiveResponses.set('joy_bright', {
      id: 'joy_bright',
      emotionTrigger: 'joy',
      responseType: 'environmental',
      action: {
        type: 'adjust_lighting',
        parameters: new Map([
          ['brightness', 1.2],
          ['color', 'warm'],
          ['duration', 5000],
        ]),
        duration: 5000,
        intensity: 0.8,
      },
      priority: 1,
      conditions: [{ parameter: 'intensity', operator: 'greater', value: 0.6 }],
    });

    this.adaptiveResponses.set('joy_music', {
      id: 'joy_music',
      emotionTrigger: 'joy',
      responseType: 'audio',
      action: {
        type: 'play_music',
        parameters: new Map([
          ['genre', 'upbeat'],
          ['volume', 0.6],
          ['duration', 3000],
        ]),
        duration: 3000,
        intensity: 0.7,
      },
      priority: 2,
      conditions: [],
    });

    // Stress responses
    this.adaptiveResponses.set('stress_calm', {
      id: 'stress_calm',
      emotionTrigger: 'stress',
      responseType: 'environmental',
      action: {
        type: 'adjust_lighting',
        parameters: new Map([
          ['brightness', 0.7],
          ['color', 'cool'],
          ['duration', 10000],
        ]),
        duration: 10000,
        intensity: 0.9,
      },
      priority: 1,
      conditions: [{ parameter: 'intensity', operator: 'greater', value: 0.5 }],
    });

    this.adaptiveResponses.set('stress_breathing', {
      id: 'stress_breathing',
      emotionTrigger: 'stress',
      responseType: 'visual',
      action: {
        type: 'breathing_guide',
        parameters: new Map([
          ['rate', 0.2],
          ['duration', 5000],
        ]),
        duration: 5000,
        intensity: 0.8,
      },
      priority: 2,
      conditions: [],
    });

    // Focus responses
    this.adaptiveResponses.set('focus_minimize', {
      id: 'focus_minimize',
      emotionTrigger: 'focus',
      responseType: 'environmental',
      action: {
        type: 'minimize_distractions',
        parameters: new Map([
          ['ui_opacity', 0.3],
          ['notifications', false],
          ['duration', 15000],
        ]),
        duration: 15000,
        intensity: 0.9,
      },
      priority: 1,
      conditions: [{ parameter: 'intensity', operator: 'greater', value: 0.7 }],
    });

    // Sadness responses
    this.adaptiveResponses.set('sadness_comfort', {
      id: 'sadness_comfort',
      emotionTrigger: 'sadness',
      responseType: 'audio',
      action: {
        type: 'play_music',
        parameters: new Map([
          ['genre', 'comforting'],
          ['volume', 0.4],
          ['duration', 8000],
        ]),
        duration: 8000,
        intensity: 0.6,
      },
      priority: 1,
      conditions: [],
    });

    // Anger responses
    this.adaptiveResponses.set('anger_cool', {
      id: 'anger_cool',
      emotionTrigger: 'anger',
      responseType: 'environmental',
      action: {
        type: 'adjust_temperature',
        parameters: new Map([
          ['temperature', 20],
          ['duration', 10000],
        ]),
        duration: 10000,
        intensity: 0.8,
      },
      priority: 1,
      conditions: [{ parameter: 'intensity', operator: 'greater', value: 0.6 }],
    });

    console.log('🎭 Adaptive responses configured');
  }

  // Create emotion UI
  private createEmotionUI() {
    this.emotionUI = engine.addEntity();
    Transform.create(this.emotionUI, {
      position: Vector3.create(8, 4, 14),
      scale: Vector3.create(3, 3, 0.1),
    });
    MeshRenderer.setBox(this.emotionUI);
    Material.setPbrMaterial(this.emotionUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2,
    });

    const title = engine.addEntity();
    Transform.create(title, {
      parent: this.emotionUI,
      position: Vector3.create(0, 1.2, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(title, {
      text: '😊 EMOTION DETECTION',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3,
    });

    // Create emotion indicators
    this.createEmotionIndicators();

    // Create response controls
    this.createResponseControls();

    // Create profile display
    this.createProfileDisplay();
  }

  // Create emotion indicators
  private createEmotionIndicators() {
    const emotions: EmotionType[] = ['joy', 'stress', 'focus', 'sadness', 'anger', 'calm'];
    let xOffset = -1.2;

    emotions.forEach(emotion => {
      const indicator = engine.addEntity();
      Transform.create(indicator, {
        parent: this.emotionUI,
        position: Vector3.create(xOffset, 0.6, 0.1),
        scale: Vector3.create(0.2, 0.2, 0.1),
      });
      MeshRenderer.setBox(indicator);
      Material.setPbrMaterial(indicator, {
        albedoColor: this.getEmotionColor(emotion),
        emissiveColor: this.getEmotionColor(emotion),
        emissiveIntensity: 0.5,
      });

      const emotionText = engine.addEntity();
      Transform.create(emotionText, {
        parent: indicator,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5),
      });
      TextShape.create(emotionText, {
        text: this.getEmotionIcon(emotion),
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3,
      });

      pointerEventsSystem.onPointerDown(
        {
          entity: indicator,
          opts: { button: InputAction.IA_POINTER, hoverText: `Simulate ${emotion}` },
        },
        () => this.simulateEmotion(emotion)
      );

      xOffset += 0.4;
    });
  }

  // Create response controls
  private createResponseControls() {
    const controls = [
      { id: 'enable_adaptation', icon: '🔄', name: 'Enable Adaptation' },
      { id: 'disable_adaptation', icon: '⏸️', name: 'Disable Adaptation' },
      { id: 'calibrate', icon: '⚙️', name: 'Calibrate' },
    ];

    let xOffset = -0.8;

    controls.forEach(control => {
      const button = engine.addEntity();
      Transform.create(button, {
        parent: this.emotionUI,
        position: Vector3.create(xOffset, 0.2, 0.1),
        scale: Vector3.create(0.3, 0.3, 0.1),
      });
      MeshRenderer.setBox(button);
      Material.setPbrMaterial(button, {
        albedoColor: Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2,
      });

      const buttonText = engine.addEntity();
      Transform.create(buttonText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5),
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3,
      });

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name },
        },
        () => this.handleResponseControl(control.id)
      );

      xOffset += 0.8;
    });
  }

  // Create profile display
  private createProfileDisplay() {
    const profileDisplay = engine.addEntity();
    Transform.create(profileDisplay, {
      parent: this.emotionUI,
      position: Vector3.create(0, -0.4, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1),
    });
    MeshRenderer.setBox(profileDisplay);
    Material.setPbrMaterial(profileDisplay, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1,
    });

    const profileText = engine.addEntity();
    Transform.create(profileText, {
      parent: profileDisplay,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(profileText, {
      text: '👤 Profile: Active',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3,
    });
  }

  // Get emotion color
  private getEmotionColor(emotion: EmotionType): Color4 {
    switch (emotion) {
      case 'joy':
        return Color4.create(1, 0.8, 0.2, 1);
      case 'stress':
        return Color4.create(0.8, 0.2, 0.2, 1);
      case 'focus':
        return Color4.create(0.2, 0.8, 0.8, 1);
      case 'sadness':
        return Color4.create(0.2, 0.4, 0.8, 1);
      case 'anger':
        return Color4.create(0.8, 0.2, 0.2, 1);
      case 'calm':
        return Color4.create(0.2, 0.8, 0.4, 1);
      default:
        return Color4.create(0.5, 0.5, 0.5, 1);
    }
  }

  // Get emotion icon
  private getEmotionIcon(emotion: EmotionType): string {
    switch (emotion) {
      case 'joy':
        return '😊';
      case 'stress':
        return '😰';
      case 'focus':
        return '🎯';
      case 'sadness':
        return '😢';
      case 'anger':
        return '😠';
      case 'calm':
        return '😌';
      default:
        return '😐';
    }
  }

  // Create default profiles
  private createDefaultProfiles() {
    const defaultProfile: EmotionProfile = {
      userId: 'user_default',
      baselineEmotions: new Map([
        ['joy', 0.3],
        ['stress', 0.2],
        ['focus', 0.4],
        ['sadness', 0.1],
        ['anger', 0.1],
        ['calm', 0.5],
        ['neutral', 0.6],
      ]),
      personalityTraits: [
        { trait: 'openness', value: 0.7 },
        { trait: 'conscientiousness', value: 0.8 },
        { trait: 'extraversion', value: 0.6 },
        { trait: 'agreeableness', value: 0.7 },
        { trait: 'neuroticism', value: 0.3 },
      ],
      preferences: {
        lightingPreference: 'adaptive',
        musicPreference: ['ambient', 'classical'],
        colorPreference: [Color3.create(0.2, 0.4, 0.8), Color3.create(0.8, 0.6, 0.2)],
        interactionStyle: 'subtle',
        privacyLevel: 'medium',
      },
      history: [],
      adaptationLevel: 0.5,
    };

    this.emotionProfiles.set(defaultProfile.userId, defaultProfile);
    console.log('👤 Default emotion profile created');
  }

  // Start emotion engine
  private startEmotionEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return;

      this.detectEmotions();
      this.processAdaptiveResponses();
      this.updateEmotionHistory();
    });
  }

  // Initialize sensors
  private initializeSensors() {
    console.log('📡 Initializing emotion sensors...');
    // In a real implementation, this would connect to actual sensors
  }

  // Detect emotions
  private detectEmotions() {
    // Simulate emotion detection
    if (Math.random() < 0.02) {
      const emotions: EmotionType[] = ['joy', 'stress', 'focus', 'calm', 'sadness', 'anger'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

      this.detectEmotion('user_default', randomEmotion, Math.random() * 0.5 + 0.5);
    }
  }

  // Detect emotion
  public detectEmotion(userId: string, emotion: EmotionType, intensity: number) {
    const profile = this.emotionProfiles.get(userId);
    if (!profile) return;

    const emotionData: EmotionData = {
      id: `emotion_${Date.now()}_${Math.random()}`,
      userId: userId,
      timestamp: Date.now(),
      primaryEmotion: emotion,
      confidence: Math.random() * 0.3 + 0.7,
      intensity: intensity,
      triggers: this.identifyTriggers(emotion),
      context: {
        activity: 'working',
        location: 'office',
        participants: ['user'],
        environment: 'virtual_office',
        timeOfDay: new Date().getHours() < 12 ? 'morning' : 'afternoon',
      },
      physiological: {
        heartRate: 60 + Math.random() * 40,
        voiceTone: Math.random(),
        facialExpression: Math.random(),
        bodyLanguage: Math.random(),
        responseTime: Math.random() * 1000 + 200,
      },
    };

    this.currentEmotions.set(userId, emotionData);
    this.emotionHistory.push(emotionData);

    if (this.emotionHistory.length > this.maxHistoryLength) {
      this.emotionHistory.shift();
    }

    profile.history.push(emotionData);
    this.adaptProfile(userId, emotionData);

    console.log(`😊 Detected emotion: ${emotion} (intensity: ${intensity.toFixed(2)})`);
  }

  // Identify triggers
  private identifyTriggers(emotion: EmotionType): string[] {
    const triggers: string[] = [];

    switch (emotion) {
      case 'joy':
        triggers.push('achievement', 'social_interaction', 'success');
        break;
      case 'stress':
        triggers.push('deadline', 'complexity', 'interruption');
        break;
      case 'focus':
        triggers.push('task_engagement', 'goal_orientation');
        break;
      case 'sadness':
        triggers.push('setback', 'isolation', 'failure');
        break;
      case 'anger':
        triggers.push('frustration', 'obstacle', 'conflict');
        break;
      case 'calm':
        triggers.push('meditation', 'completion', 'satisfaction');
        break;
    }

    return triggers;
  }

  // Adapt profile
  private adaptProfile(userId: string, emotionData: EmotionData) {
    const profile = this.emotionProfiles.get(userId);
    if (!profile) return;

    // Update baseline emotions
    const currentBaseline = profile.baselineEmotions.get(emotionData.primaryEmotion) || 0;
    const newBaseline = currentBaseline * 0.9 + emotionData.intensity * 0.1;
    profile.baselineEmotions.set(emotionData.primaryEmotion, newBaseline);

    // Update adaptation level
    profile.adaptationLevel = Math.min(1.0, profile.adaptationLevel + 0.01);

    console.log(
      `📈 Adapted profile for ${userId} (adaptation level: ${profile.adaptationLevel.toFixed(2)})`
    );
  }

  // Process adaptive responses
  private processAdaptiveResponses() {
    this.currentEmotions.forEach((emotionData, userId) => {
      const profile = this.emotionProfiles.get(userId);
      if (!profile) return;

      // Check if response should be triggered
      if (emotionData.intensity > this.adaptationThreshold) {
        this.triggerAdaptiveResponse(emotionData, profile);
      }
    });
  }

  // Trigger adaptive response
  private triggerAdaptiveResponse(emotionData: EmotionData, profile: EmotionProfile) {
    const responseKey = `${emotionData.primaryEmotion}_${this.getBestResponseType(emotionData, profile)}`;
    const response = this.adaptiveResponses.get(responseKey);

    if (response) {
      // Check conditions
      const conditionsMet = response.conditions.every(condition => {
        const value = emotionData.intensity;
        switch (condition.operator) {
          case 'greater':
            return value > condition.value;
          case 'less':
            return value < condition.value;
          case 'equals':
            return value === condition.value;
          case 'between':
            return value >= condition.value[0] && value <= condition.value[1];
          default:
            return false;
        }
      });

      if (conditionsMet) {
        this.executeAdaptiveResponse(response, emotionData);
      }
    }
  }

  // Get best response type
  private getBestResponseType(emotionData: EmotionData, profile: EmotionProfile): string {
    // Choose response type based on user preferences and emotion
    switch (profile.preferences.interactionStyle) {
      case 'direct':
        return 'environmental';
      case 'subtle':
        return 'audio';
      case 'minimal':
        return 'visual';
      default:
        return 'environmental';
    }
  }

  // Execute adaptive response
  private executeAdaptiveResponse(response: AdaptiveResponse, emotionData: EmotionData) {
    console.log(`🎭 Executing adaptive response: ${response.action.type}`);

    switch (response.action.type) {
      case 'adjust_lighting':
        this.adjustLighting(response.action.parameters);
        break;
      case 'play_music':
        this.playMusic(response.action.parameters);
        break;
      case 'breathing_guide':
        this.showBreathingGuide(response.action.parameters);
        break;
      case 'minimize_distractions':
        this.minimizeDistractions(response.action.parameters);
        break;
      case 'adjust_temperature':
        this.adjustTemperature(response.action.parameters);
        break;
    }

    soundSystem.playInteractionSound('powerup');
  }

  // Adjust lighting
  private adjustLighting(parameters: Map<string, any>) {
    const brightness = parameters.get('brightness');
    const color = parameters.get('color');
    const duration = parameters.get('duration');

    console.log(
      `💡 Adjusting lighting: brightness=${brightness}, color=${color}, duration=${duration}ms`
    );
    // In real implementation, this would adjust actual lighting
  }

  // Play music
  private playMusic(parameters: Map<string, any>) {
    const genre = parameters.get('genre');
    const volume = parameters.get('volume');
    const duration = parameters.get('duration');

    console.log(`🎵 Playing music: genre=${genre}, volume=${volume}, duration=${duration}ms`);
    // In real implementation, this would play actual music
  }

  // Show breathing guide
  private showBreathingGuide(parameters: Map<string, any>) {
    const rate = parameters.get('rate');
    const duration = parameters.get('duration');

    console.log(`🫁 Showing breathing guide: rate=${rate}, duration=${duration}ms`);
    // In real implementation, this would show visual breathing guide
  }

  // Minimize distractions
  private minimizeDistractions(parameters: Map<string, any>) {
    const uiOpacity = parameters.get('ui_opacity');
    const notifications = parameters.get('notifications');
    const duration = parameters.get('duration');

    console.log(
      `🔇 Minimizing distractions: ui_opacity=${uiOpacity}, notifications=${notifications}`
    );
    // In real implementation, this would adjust UI and notifications
  }

  // Adjust temperature
  private adjustTemperature(parameters: Map<string, any>) {
    const temperature = parameters.get('temperature');
    const duration = parameters.get('duration');

    console.log(`🌡️ Adjusting temperature: ${temperature}°C for ${duration}ms`);
    // In real implementation, this would adjust smart thermostat
  }

  // Update emotion history
  private updateEmotionHistory() {
    // Clean up old emotions
    const now = Date.now();
    this.currentEmotions.forEach((emotion, userId) => {
      if (now - emotion.timestamp > 30000) {
        // 30 seconds
        this.currentEmotions.delete(userId);
      }
    });
  }

  // Handle response control
  private handleResponseControl(controlId: string) {
    switch (controlId) {
      case 'enable_adaptation':
        this.adaptationThreshold = 0.5;
        console.log('🔄 Emotion adaptation enabled');
        break;
      case 'disable_adaptation':
        this.adaptationThreshold = 1.0;
        console.log('⏸️ Emotion adaptation disabled');
        break;
      case 'calibrate':
        this.calibrateSystem();
        break;
    }

    soundSystem.playInteractionSound('click');
  }

  // Simulate emotion
  private simulateEmotion(emotion: EmotionType) {
    const intensity = Math.random() * 0.5 + 0.5;
    this.detectEmotion('user_default', emotion, intensity);
    soundSystem.playInteractionSound('click');
  }

  // Calibrate system
  private calibrateSystem() {
    console.log('⚙️ Calibrating emotion detection system...');

    // Reset adaptation threshold
    this.adaptationThreshold = 0.8;

    // Clear current emotions
    this.currentEmotions.clear();

    // Recalibrate sensitivity
    this.detectionSensitivity = 0.7;

    console.log('✅ Calibration complete');
    soundSystem.playInteractionSound('powerup');
  }

  // Get current emotion
  public getCurrentEmotion(userId: string): EmotionData | undefined {
    return this.currentEmotions.get(userId);
  }

  // Get emotion profile
  public getEmotionProfile(userId: string): EmotionProfile | undefined {
    return this.emotionProfiles.get(userId);
  }

  // Get emotion history
  public getEmotionHistory(): EmotionData[] {
    return [...this.emotionHistory];
  }

  // Set detection sensitivity
  public setDetectionSensitivity(sensitivity: number) {
    this.detectionSensitivity = Math.max(0, Math.min(1, sensitivity));
    console.log(`📡 Detection sensitivity set to: ${this.detectionSensitivity}`);
  }

  // Set adaptation threshold
  public setAdaptationThreshold(threshold: number) {
    this.adaptationThreshold = Math.max(0, Math.min(1, threshold));
    console.log(`🎭 Adaptation threshold set to: ${this.adaptationThreshold}`);
  }

  // Create custom profile
  public createProfile(userId: string, preferences: Partial<EmotionPreferences>): EmotionProfile {
    const profile: EmotionProfile = {
      userId: userId,
      baselineEmotions: new Map([
        ['joy', 0.3],
        ['stress', 0.2],
        ['focus', 0.4],
        ['sadness', 0.1],
        ['anger', 0.1],
        ['calm', 0.5],
        ['neutral', 0.6],
      ]),
      personalityTraits: [
        { trait: 'openness', value: 0.5 },
        { trait: 'conscientiousness', value: 0.5 },
        { trait: 'extraversion', value: 0.5 },
        { trait: 'agreeableness', value: 0.5 },
        { trait: 'neuroticism', value: 0.5 },
      ],
      preferences: {
        lightingPreference: 'adaptive',
        musicPreference: ['ambient'],
        colorPreference: [Color3.create(0.5, 0.5, 0.5)],
        interactionStyle: 'subtle',
        privacyLevel: 'medium',
        ...preferences,
      },
      history: [],
      adaptationLevel: 0.3,
    };

    this.emotionProfiles.set(userId, profile);
    console.log(`👤 Created emotion profile for ${userId}`);
    return profile;
  }

  // Cleanup system
  public cleanup() {
    this.emotionProfiles.clear();
    this.currentEmotions.clear();
    this.adaptiveResponses.clear();
    this.emotionHistory = [];

    if (this.emotionUI) {
      engine.removeEntity(this.emotionUI);
    }

    this.isInitialized = false;
  }
}

// Export singleton instance
export const emotionDetectionSystem = new EmotionDetectionSystem();
