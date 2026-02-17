// Voice Command System with AI Processing for AIGestion Virtual Office
import {
  engine,
  InputAction,
  Material,
  MeshRenderer,
  pointerEventsSystem,
  Transform,
} from '@dcl/sdk/ecs';
import { setTimeout, setInterval } from './utils/timers';
import { Color4, Vector3 } from '@dcl/sdk/math';
import { soundSystem } from './enhanced-sound';

interface VoiceCommand {
  id: string;
  phrase: string;
  intent: string;
  entities: Map<string, any>;
  confidence: number;
  timestamp: number;
  isProcessed: boolean;
}

interface Intent {
  name: string;
  parameters: Map<string, any>;
  action: string;
}

interface VoiceAssistant {
  id: string;
  name: string;
  personality: 'professional' | 'friendly' | 'technical' | 'casual';
  voice: string;
  language: string;
  isActive: boolean;
  processingState: 'idle' | 'listening' | 'processing' | 'responding';
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  alternatives: string[];
  isFinal: boolean;
}

interface AIResponse {
  text: string;
  confidence: number;
  actions: string[];
  emotion: string;
  timestamp: number;
}

export class VoiceCommandSystem {
  private voiceAssistant: VoiceAssistant;
  private commands: Map<string, VoiceCommand> = new Map();
  private intents: Map<string, Intent> = new Map();
  private commandHistory: VoiceCommand[] = [];
  private voiceUI: any;
  private isInitialized: boolean = false;
  private isListening: boolean = false;
  private currentTranscript: string = '';
  private recognitionEngine: any;
  private aiProcessor: any;
  private voiceSynthesizer: any;

  constructor() {
    this.voiceAssistant = {
      id: 'assistant_nexus',
      name: 'Nexus',
      personality: 'professional',
      voice: 'female',
      language: 'es-ES',
      isActive: true,
      processingState: 'idle',
    };
  }

  // Initialize voice command system
  initialize() {
    console.log('🎤 Voice Command System Initializing...');

    this.setupIntents();
    this.createVoiceUI();
    this.initializeSpeechRecognition();
    this.initializeAIProcessor();
    this.initializeVoiceSynthesis();
    this.startVoiceEngine();

    this.isInitialized = true;
    console.log('🎤 Voice Command System Ready!');
  }

  // Setup voice intents
  private setupIntents() {
    // System control intents
    this.intents.set('toggle_lights', {
      name: 'toggle_lights',
      parameters: new Map([
        ['location', 'string'],
        ['action', 'string'],
      ]),
      action: 'control_lighting',
    });

    this.intents.set('adjust_temperature', {
      name: 'adjust_temperature',
      parameters: new Map([
        ['temperature', 'number'],
        ['unit', 'string'],
      ]),
      action: 'control_climate',
    });

    this.intents.set('start_meeting', {
      name: 'start_meeting',
      parameters: new Map([
        ['participants', 'array'],
        ['topic', 'string'],
      ]),
      action: 'initiate_meeting',
    });

    // Navigation intents
    this.intents.set('navigate_to', {
      name: 'navigate_to',
      parameters: new Map([
        ['destination', 'string'],
        ['mode', 'string'],
      ]),
      action: 'navigate',
    });

    this.intents.set('show_dashboard', {
      name: 'show_dashboard',
      parameters: new Map([
        ['type', 'string'],
        ['data', 'string'],
      ]),
      action: 'display_dashboard',
    });

    // Communication intents
    this.intents.set('send_message', {
      name: 'send_message',
      parameters: new Map([
        ['recipient', 'string'],
        ['message', 'string'],
      ]),
      action: 'communicate',
    });

    this.intents.set('schedule_event', {
      name: 'schedule_event',
      parameters: new Map([
        ['title', 'string'],
        ['time', 'string'],
        ['duration', 'string'],
      ]),
      action: 'create_calendar_event',
    });

    // Information intents
    this.intents.set('get_status', {
      name: 'get_status',
      parameters: new Map([
        ['system', 'string'],
        ['metric', 'string'],
      ]),
      action: 'query_status',
    });

    this.intents.set('analyze_data', {
      name: 'analyze_data',
      parameters: new Map([
        ['dataset', 'string'],
        ['analysis_type', 'string'],
      ]),
      action: 'perform_analysis',
    });

    // Security intents
    this.intents.set('lock_system', {
      name: 'lock_system',
      parameters: new Map([
        ['level', 'string'],
        ['duration', 'string'],
      ]),
      action: 'secure_system',
    });

    this.intents.set('emergency_stop', {
      name: 'emergency_stop',
      parameters: new Map([
        ['system', 'string'],
        ['reason', 'string'],
      ]),
      action: 'emergency_shutdown',
    });
  }

  // Create voice UI
  private createVoiceUI() {
    this.voiceUI = engine.addEntity();
    Transform.create(this.voiceUI, {
      position: Vector3.create(8, 4, 14),
      scale: Vector3.create(3, 2, 0.1),
    });
    MeshRenderer.setBox(this.voiceUI);
    Material.setPbrMaterial(this.voiceUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2,
    });

    // Create title
    const title = engine.addEntity();
    Transform.create(title, {
      parent: this.voiceUI,
      position: Vector3.create(0, 0.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(title, {
      text: '💜 ASISTENTE DE VOZ (NEXUS)',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3,
    });

    // Create status indicator
    this.createStatusIndicator();

    // Create transcript display
    this.createTranscriptDisplay();

    // Create control buttons
    this.createVoiceControls();
  }

  // Create status indicator
  private createStatusIndicator() {
    const statusIndicator = engine.addEntity();
    Transform.create(statusIndicator, {
      parent: this.voiceUI,
      position: Vector3.create(0, 0.3, 0.1),
      scale: Vector3.create(0.2, 0.2, 0.1),
    });
    MeshRenderer.setBox(statusIndicator);
    Material.setPbrMaterial(statusIndicator, {
      albedoColor: Color4.create(0.2, 0.8, 0.2, 1),
      emissiveColor: Color4.create(0.2, 0.8, 0.2, 0.8),
      emissiveIntensity: 2,
    });

    // Animate status indicator
    this.animateStatusIndicator(statusIndicator);
  }

  // Animate status indicator
  private animateStatusIndicator(indicator: any) {
    engine.addSystem(() => {
      if (!this.isInitialized) return;

      const time = Date.now() / 1000;
      const material = Material.getMutable(indicator);

      if (material && material.$case === 'pbr') {
        switch (this.voiceAssistant.processingState) {
          case 'idle':
            material.pbr.albedoColor = Color4.create(0.2, 0.8, 0.2, 1);
            material.pbr.emissiveIntensity = 1;
            break;
          case 'listening':
            const pulse = Math.sin(time * 3) * 0.5 + 0.5;
            material.pbr.albedoColor = Color4.create(1, 0.8, 0.2, 1);
            material.pbr.emissiveIntensity = 2 + pulse * 2;
            break;
          case 'processing':
            material.pbr.albedoColor = Color4.create(0.2, 0.2, 1, 1);
            material.pbr.emissiveIntensity = 3;
            break;
          case 'responding':
            material.pbr.albedoColor = Color4.create(0.8, 0.2, 0.8, 1);
            material.pbr.emissiveIntensity = 2;
            break;
        }
      }
    });
  }

  // Create transcript display
  private createTranscriptDisplay() {
    const transcriptDisplay = engine.addEntity();
    Transform.create(transcriptDisplay, {
      parent: this.voiceUI,
      position: Vector3.create(0, -0.1, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1),
    });
    MeshRenderer.setBox(transcriptDisplay);
    Material.setPbrMaterial(transcriptDisplay, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1,
    });

    const transcriptText = engine.addEntity();
    Transform.create(transcriptText, {
      parent: transcriptDisplay,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(transcriptText, {
      text: 'Di "Hola Nexus" para comenzar...',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3,
    });
  }

  // Create voice controls
  private createVoiceControls() {
    const controls = [
      { id: 'listen', icon: '🎤', name: 'Escuchar' },
      { id: 'stop', icon: '⏹️', name: 'Detener' },
      { id: 'settings', icon: '⚙️', name: 'Ajustes de Voz' },
    ];

    let xOffset = -0.8;

    controls.forEach(control => {
      const button = engine.addEntity();
      Transform.create(button, {
        parent: this.voiceUI,
        position: Vector3.create(xOffset, -0.6, 0.1),
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
        () => this.handleVoiceControl(control.id)
      );

      xOffset += 0.8;
    });
  }

  // Initialize speech recognition
  private initializeSpeechRecognition() {
    // Simulate speech recognition engine
    this.recognitionEngine = {
      isListening: false,
      continuous: true,
      interimResults: true,
      lang: 'es-ES',

      start: () => {
        this.recognitionEngine.isListening = true;
        this.voiceAssistant.processingState = 'listening';
        console.log('🎤 Speech recognition started');
      },

      stop: () => {
        this.recognitionEngine.isListening = false;
        this.voiceAssistant.processingState = 'idle';
        console.log('🎤 Speech recognition stopped');
      },

      onresult: null,
      onerror: null,
      onend: null,
    };

    // Setup event handlers
    this.recognitionEngine.onresult = (event: any) => this.handleSpeechResult(event);
    this.recognitionEngine.onerror = (event: any) => this.handleSpeechError(event);
    this.recognitionEngine.onend = () => this.handleSpeechEnd();
  }

  // Initialize AI processor
  private initializeAIProcessor() {
    // Simulate AI processing engine
    this.aiProcessor = {
      processIntent: (transcript: string) => this.processIntentWithAI(transcript),
      generateResponse: (intent: string, entities: Map<string, any>) =>
        this.generateAIResponse(intent, entities),
      confidence: 0.85,
    };
  }

  // Initialize voice synthesis
  private initializeVoiceSynthesis() {
    // Simulate voice synthesis engine
    this.voiceSynthesizer = {
      speak: (text: string) => this.synthesizeSpeech(text),
      cancel: () => this.stopSpeech(),
      voice: this.voiceAssistant.voice,
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
    };
  }

  // Start voice engine
  private startVoiceEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return;

      this.updateVoiceUI();
      this.simulateVoiceInput();
    });
  }

  // Handle voice control
  private handleVoiceControl(controlId: string) {
    switch (controlId) {
      case 'listen':
        this.startListening();
        break;
      case 'stop':
        this.stopListening();
        break;
      case 'settings':
        this.openVoiceSettings();
        break;
    }

    soundSystem.playInteractionSound('click');
  }

  // Start listening
  public startListening() {
    if (this.recognitionEngine.isListening) return;

    this.recognitionEngine.start();
    this.isListening = true;
    this.voiceAssistant.processingState = 'listening';

    console.log('🎤 Started listening for voice commands...');
    soundSystem.playInteractionSound('powerup');
  }

  // Stop listening
  public stopListening() {
    if (!this.recognitionEngine.isListening) return;

    this.recognitionEngine.stop();
    this.isListening = false;
    this.voiceAssistant.processingState = 'idle';

    console.log('🎤 Stopped listening');
    soundSystem.playInteractionSound('click');
  }

  // Handle speech result
  private handleSpeechResult(event: any) {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript.toLowerCase().trim();

    this.currentTranscript = transcript;

    if (result.isFinal) {
      this.processVoiceCommand(transcript);
    }
  }

  // Handle speech error
  private handleSpeechError(event: any) {
    console.error('🎤 Speech recognition error:', event.error);
    this.voiceAssistant.processingState = 'idle';
    this.isListening = false;
  }

  // Handle speech end
  private handleSpeechEnd() {
    this.voiceAssistant.processingState = 'idle';
    this.isListening = false;
  }

  // Process voice command
  private processVoiceCommand(transcript: string) {
    console.log(`🎤 Processing command: "${transcript}"`);

    this.voiceAssistant.processingState = 'processing';

    // Process with AI
    const intentResult = this.aiProcessor.processIntent(transcript);

    if (intentResult.confidence > 0.7) {
      this.executeVoiceCommand(intentResult.intent, intentResult.entities);
    } else {
      this.handleUnknownCommand(transcript);
    }
  }

  // Process intent with AI
  private processIntentWithAI(transcript: string): any {
    // Simulate AI intent processing
    const intents = [
      {
        keywords: ['turn on', 'switch on', 'activate'],
        intent: 'toggle_lights',
        entities: new Map([['action', 'on']]),
      },
      {
        keywords: ['turn off', 'switch off', 'deactivate'],
        intent: 'toggle_lights',
        entities: new Map([['action', 'off']]),
      },
      {
        keywords: ['temperature', 'set temp', 'adjust temp'],
        intent: 'adjust_temperature',
        entities: new Map([['temperature', 22]]),
      },
      {
        keywords: ['meeting', 'start meeting', 'schedule meeting'],
        intent: 'start_meeting',
        entities: new Map(),
      },
      { keywords: ['navigate', 'go to', 'take me to'], intent: 'navigate_to', entities: new Map() },
      {
        keywords: ['dashboard', 'show dashboard', 'display'],
        intent: 'show_dashboard',
        entities: new Map(),
      },
      {
        keywords: ['status', 'check status', 'system status'],
        intent: 'get_status',
        entities: new Map(),
      },
      { keywords: ['lock', 'secure', 'lock down'], intent: 'lock_system', entities: new Map() },
      {
        keywords: ['emergency', 'stop', 'emergency stop'],
        intent: 'emergency_stop',
        entities: new Map(),
      },
    ];

    for (const intentData of intents) {
      for (const keyword of intentData.keywords) {
        if (transcript.includes(keyword)) {
          return {
            intent: intentData.intent,
            entities: intentData.entities,
            confidence: 0.9,
          };
        }
      }
    }

    return {
      intent: 'unknown',
      entities: new Map(),
      confidence: 0.1,
    };
  }

  // Execute voice command
  private executeVoiceCommand(intent: string, entities: Map<string, any>) {
    console.log(`🎯 Executing intent: ${intent}`);

    const command: VoiceCommand = {
      id: `cmd_${Date.now()}`,
      phrase: this.currentTranscript,
      intent: intent,
      entities: entities,
      confidence: 0.9,
      timestamp: Date.now(),
      isProcessed: false,
    };

    this.commands.set(command.id, command);
    this.commandHistory.push(command);

    // Execute based on intent
    switch (intent) {
      case 'toggle_lights':
        this.executeLightControl(entities);
        break;
      case 'adjust_temperature':
        this.executeTemperatureControl(entities);
        break;
      case 'start_meeting':
        this.executeMeetingStart(entities);
        break;
      case 'navigate_to':
        this.executeNavigation(entities);
        break;
      case 'show_dashboard':
        this.executeDashboardDisplay(entities);
        break;
      case 'get_status':
        this.executeStatusQuery(entities);
        break;
      case 'lock_system':
        this.executeSystemLock(entities);
        break;
      case 'emergency_stop':
        this.executeEmergencyStop(entities);
        break;
    }

    command.isProcessed = true;
    this.voiceAssistant.processingState = 'responding';

    // Generate AI response
    const response = this.aiProcessor.generateResponse(intent, entities);
    this.speakResponse(response.text);

    setTimeout(() => {
      this.voiceAssistant.processingState = 'idle';
    }, 2000);
  }

  // Execute light control
  private executeLightControl(entities: Map<string, any>) {
    const action = entities.get('action');
    console.log(`💡 ${action === 'on' ? 'Turning on' : 'Turning off'} lights`);

    // In real implementation, this would control smart lights
    soundSystem.playInteractionSound('powerup');
  }

  // Execute temperature control
  private executeTemperatureControl(entities: Map<string, any>) {
    const temperature = entities.get('temperature');
    console.log(`🌡️ Setting temperature to ${temperature}°C`);

    // In real implementation, this would control HVAC system
    soundSystem.playInteractionSound('click');
  }

  // Execute meeting start
  private executeMeetingStart(entities: Map<string, any>) {
    console.log('🤝 Starting meeting session');

    // In real implementation, this would initiate video conference
    soundSystem.playInteractionSound('powerup');
  }

  // Execute navigation
  private executeNavigation(entities: Map<string, any>) {
    console.log('🧭 Navigating to destination');

    // In real implementation, this would move user to location
    soundSystem.playInteractionSound('click');
  }

  // Execute dashboard display
  private executeDashboardDisplay(entities: Map<string, any>) {
    console.log('📊 Displaying dashboard');

    // In real implementation, this would show relevant dashboard
    soundSystem.playInteractionSound('powerup');
  }

  // Execute status query
  private executeStatusQuery(entities: Map<string, any>) {
    console.log('📈 Querying system status');

    // In real implementation, this would retrieve system status
    soundSystem.playInteractionSound('click');
  }

  // Execute system lock
  private executeSystemLock(entities: Map<string, any>) {
    console.log('🔒 Locking system');

    // In real implementation, this would secure the system
    soundSystem.playInteractionSound('alert');
  }

  // Execute emergency stop
  private executeEmergencyStop(entities: Map<string, any>) {
    console.log('🚨 EMERGENCY STOP ACTIVATED');

    // In real implementation, this would emergency shutdown systems
    soundSystem.playInteractionSound('error');
  }

  // Handle unknown command
  private handleUnknownCommand(transcript: string) {
    console.log(`❓ Unknown command: "${transcript}"`);

    const response = this.aiProcessor.generateResponse('unknown', new Map());
    this.speakResponse(response.text);

    this.voiceAssistant.processingState = 'idle';
  }

  // Generate AI response
  private generateAIResponse(intent: string, entities: Map<string, any>): AIResponse {
    const responses = {
      toggle_lights: {
        text: "I've adjusted the lighting for you.",
        confidence: 0.9,
        actions: ['light_control'],
        emotion: 'helpful',
      },
      adjust_temperature: {
        text: 'Temperature settings updated successfully.',
        confidence: 0.9,
        actions: ['climate_control'],
        emotion: 'efficient',
      },
      start_meeting: {
        text: "I'm setting up your meeting room now.",
        confidence: 0.9,
        actions: ['meeting_setup'],
        emotion: 'professional',
      },
      navigate_to: {
        text: 'Taking you to your destination.',
        confidence: 0.9,
        actions: ['navigation'],
        emotion: 'helpful',
      },
      show_dashboard: {
        text: 'Displaying the dashboard you requested.',
        confidence: 0.9,
        actions: ['dashboard_display'],
        emotion: 'informative',
      },
      get_status: {
        text: 'All systems are operating normally.',
        confidence: 0.9,
        actions: ['status_report'],
        emotion: 'confident',
      },
      lock_system: {
        text: 'System security protocols activated.',
        confidence: 0.9,
        actions: ['security_lock'],
        emotion: 'serious',
      },
      emergency_stop: {
        text: 'Procedimientos de emergencia iniciados inmediatamente.',
        confidence: 1.0,
        actions: ['emergency_shutdown'],
        emotion: 'urgent',
      },
      unknown: {
        text: 'No estoy segura de entenderte. ¿Podrías repetirlo?',
        confidence: 0.3,
        actions: [],
        emotion: 'confused',
      },
    };

    return responses[intent] || responses.unknown;
  }

  // Synthesize speech
  private synthesizeSpeech(text: string) {
    console.log(`🔊 Speaking: "${text}"`);

    // In real implementation, this would use text-to-speech
    // For now, we'll just log the response
    this.voiceAssistant.processingState = 'responding';

    setTimeout(() => {
      this.voiceAssistant.processingState = 'idle';
    }, 2000);
  }

  // Stop speech
  private stopSpeech() {
    console.log('🔊 Speech stopped');
    this.voiceAssistant.processingState = 'idle';
  }

  // Speak response
  private speakResponse(text: string) {
    this.voiceSynthesizer.speak(text);
  }

  // Update voice UI
  private updateVoiceUI() {
    // Update transcript display with current input
    // This would update the UI in real implementation
  }

  // Simulate voice input
  private simulateVoiceInput() {
    // Simulate random voice commands for testing
    if (Math.random() < 0.005) {
      const sampleCommands = [
        'turn on the lights',
        'set temperature to 22 degrees',
        'show me the dashboard',
        "what's the system status",
        'start a meeting',
      ];

      const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
      this.processVoiceCommand(randomCommand);
    }
  }

  // Open voice settings
  private openVoiceSettings() {
    console.log('⚙️ Opening voice settings');

    // In real implementation, this would open settings panel
    soundSystem.playInteractionSound('click');
  }

  // Get command history
  public getCommandHistory(): VoiceCommand[] {
    return [...this.commandHistory];
  }

  // Get voice assistant info
  public getVoiceAssistant(): VoiceAssistant {
    return { ...this.voiceAssistant };
  }

  // Set voice assistant personality
  public setPersonality(personality: VoiceAssistant['personality']) {
    this.voiceAssistant.personality = personality;
    console.log(`🎤 Voice personality set to: ${personality}`);
  }

  // Set voice language
  public setLanguage(language: string) {
    this.voiceAssistant.language = language;
    this.recognitionEngine.lang = language;
    console.log(`🎤 Voice language set to: ${language}`);
  }

  // Enable/disable voice assistant
  public setVoiceAssistantEnabled(enabled: boolean) {
    this.voiceAssistant.isActive = enabled;
    if (!enabled) {
      this.stopListening();
    }
    console.log(`🎤 Voice assistant ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Cleanup system
  public cleanup() {
    this.stopListening();

    this.commands.clear();
    this.intents.clear();
    this.commandHistory = [];

    if (this.voiceUI) {
      engine.removeEntity(this.voiceUI);
    }

    this.isInitialized = false;
  }
}

// Export singleton instance
export const voiceCommandSystem = new VoiceCommandSystem();
