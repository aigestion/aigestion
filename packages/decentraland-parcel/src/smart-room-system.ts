// Smart Room Automation with IoT Integration for AIGestion Virtual Office
import {
  engine,
  InputAction,
  Material,
  MeshRenderer,
  pointerEventsSystem,
  TextShape,
  Transform,
} from '@dcl/sdk/ecs';
import { Color4, Vector3 } from '@dcl/sdk/math';
import { soundSystem } from './enhanced-sound';

interface IoTDevice {
  id: string;
  name: string;
  type: 'light' | 'temperature' | 'security' | 'entertainment' | 'productivity' | 'energy';
  status: 'online' | 'offline' | 'error';
  value: number | boolean | string;
  position: Vector3;
  automationRules: AutomationRule[];
  lastUpdate: number;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: Trigger;
  actions: Action[];
  enabled: boolean;
  priority: number;
}

interface Trigger {
  type: 'time' | 'device' | 'motion' | 'voice' | 'schedule';
  conditions: TriggerCondition[];
}

interface TriggerCondition {
  deviceId: string;
  property: string;
  operator: 'equals' | 'greater' | 'less' | 'between';
  value: any;
}

interface Action {
  type: 'setDevice' | 'notify' | 'scene' | 'automation';
  target: string;
  parameters: any;
}

interface SmartScene {
  id: string;
  name: string;
  description: string;
  devices: string[];
  settings: Map<string, any>;
  icon: string;
}

export class SmartRoomSystem {
  private devices: Map<string, IoTDevice> = new Map();
  private automationRules: Map<string, AutomationRule> = new Map();
  private smartScenes: Map<string, SmartScene> = new Map();
  private controlPanel: any;
  private isInitialized: boolean = false;
  private currentScene: string = 'default';
  private energyUsage: number = 0;

  // Initialize smart room system
  initialize() {
    console.log('🏠 Smart Room System Initializing...');

    this.createIoTDevices();
    this.createAutomationRules();
    this.createSmartScenes();
    this.createControlPanel();
    this.startAutomationEngine();

    this.isInitialized = true;
    console.log('🏠 Smart Room System Ready!');
  }

  // Create IoT devices
  private createIoTDevices() {
    // Smart Lights
    this.createDevice('light_main', 'Main Light', 'light', Vector3.create(8, 4, 8));
    this.createDevice('light_desk', 'Desk Light', 'light', Vector3.create(4, 2.5, 4));
    this.createDevice('light_meeting', 'Meeting Room Light', 'light', Vector3.create(12, 2.5, 12));

    // Temperature Control
    this.createDevice('temp_main', 'Thermostat', 'temperature', Vector3.create(8, 3, 2));

    // Security System
    this.createDevice('security_main', 'Security System', 'security', Vector3.create(1, 2, 8));
    this.createDevice('camera_entrance', 'Entrance Camera', 'security', Vector3.create(8, 3, 15));

    // Entertainment
    this.createDevice(
      'entertainment_display',
      'Smart Display',
      'entertainment',
      Vector3.create(8, 3, 0.5)
    );
    this.createDevice(
      'entertainment_audio',
      'Audio System',
      'entertainment',
      Vector3.create(14, 2, 8)
    );

    // Productivity
    this.createDevice('productivity_focus', 'Focus Mode', 'productivity', Vector3.create(4, 3, 12));
    this.createDevice('productivity_timer', 'Work Timer', 'productivity', Vector3.create(12, 3, 4));

    // Energy Management
    this.createDevice('energy_monitor', 'Energy Monitor', 'energy', Vector3.create(2, 3, 2));
    this.createDevice('energy_solar', 'Solar Panels', 'energy', Vector3.create(14, 5, 14));
  }

  // Create individual device
  private createDevice(id: string, name: string, type: IoTDevice['type'], position: Vector3) {
    const device = engine.addEntity();
    Transform.create(device, {
      position: position,
      scale: Vector3.create(0.3, 0.3, 0.3),
    });

    let deviceColor: Color4;
    let deviceIcon: string;

    switch (type) {
      case 'light':
        deviceColor = Color4.create(1, 0.8, 0.2, 1);
        deviceIcon = '💡';
        MeshRenderer.setSphere(device);
        break;
      case 'temperature':
        deviceColor = Color4.create(0.2, 0.8, 1, 1);
        deviceIcon = '🌡️';
        MeshRenderer.setBox(device);
        break;
      case 'security':
        deviceColor = Color4.create(0.8, 0.2, 0.2, 1);
        deviceIcon = '🛡️';
        MeshRenderer.setBox(device);
        break;
      case 'entertainment':
        deviceColor = Color4.create(0.8, 0.2, 0.8, 1);
        deviceIcon = '🎮';
        MeshRenderer.setBox(device);
        break;
      case 'productivity':
        deviceColor = Color4.create(0.2, 0.8, 0.2, 1);
        deviceIcon = '⚡';
        MeshRenderer.setBox(device);
        break;
      case 'energy':
        deviceColor = Color4.create(1, 0.6, 0.2, 1);
        deviceIcon = '⚡';
        MeshRenderer.setBox(device);
        break;
      default:
        deviceColor = Color4.create(0.5, 0.5, 0.5, 1);
        deviceIcon = '📱';
        MeshRenderer.setBox(device);
    }

    Material.setPbrMaterial(device, {
      albedoColor: deviceColor,
      roughness: 0.2,
      metallic: 0.8,
      emissiveColor: Color4.create(
        deviceColor.r * 0.5,
        deviceColor.g * 0.5,
        deviceColor.b * 0.5,
        0.5
      ),
      emissiveIntensity: 1,
    });

    // Device label
    const label = engine.addEntity();
    Transform.create(label, {
      parent: device,
      position: Vector3.create(0, 0.3, 0),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(label, {
      text: deviceIcon,
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3,
    });

    // Status indicator
    const statusIndicator = engine.addEntity();
    Transform.create(statusIndicator, {
      parent: device,
      position: Vector3.create(0, -0.2, 0),
      scale: Vector3.create(0.1, 0.1, 0.1),
    });
    MeshRenderer.setSphere(statusIndicator);
    Material.setPbrMaterial(statusIndicator, {
      albedoColor: Color4.create(0, 1, 0, 1),
      emissiveColor: Color4.create(0, 1, 0, 1),
      emissiveIntensity: 2,
    });

    const iotDevice: IoTDevice = {
      id: id,
      name: name,
      type: type,
      status: 'online',
      value: type === 'light' ? false : type === 'temperature' ? 22 : 0,
      position: position,
      automationRules: [],
      lastUpdate: Date.now(),
    };

    this.devices.set(id, iotDevice);

    // Add interaction
    pointerEventsSystem.onPointerDown(
      {
        entity: device,
        opts: { button: InputAction.IA_POINTER, hoverText: `Control ${name}` },
      },
      () => this.handleDeviceInteraction(id)
    );
  }

  // Create automation rules
  private createAutomationRules() {
    // Morning routine
    this.createAutomationRule(
      'morning_routine',
      'Morning Routine',
      {
        type: 'time',
        conditions: [{ deviceId: 'temp_main', property: 'hour', operator: 'equals', value: 8 }],
      },
      [
        { type: 'setDevice', target: 'light_main', parameters: { value: true } },
        { type: 'setDevice', target: 'temp_main', parameters: { value: 22 } },
        {
          type: 'setDevice',
          target: 'entertainment_audio',
          parameters: { value: 'morning_playlist' },
        },
      ]
    );

    // Energy saving
    this.createAutomationRule(
      'energy_saving',
      'Energy Saving',
      {
        type: 'device',
        conditions: [
          { deviceId: 'energy_monitor', property: 'usage', operator: 'greater', value: 80 },
        ],
      },
      [
        { type: 'setDevice', target: 'light_main', parameters: { value: false } },
        { type: 'setDevice', target: 'light_desk', parameters: { value: false } },
        { type: 'notify', target: 'user', parameters: { message: 'High energy usage detected' } },
      ]
    );

    // Security activation
    this.createAutomationRule(
      'security_night',
      'Night Security',
      {
        type: 'time',
        conditions: [{ deviceId: 'temp_main', property: 'hour', operator: 'greater', value: 22 }],
      },
      [
        { type: 'setDevice', target: 'security_main', parameters: { value: 'armed' } },
        { type: 'setDevice', target: 'camera_entrance', parameters: { value: 'recording' } },
      ]
    );

    // Focus mode
    this.createAutomationRule(
      'focus_mode',
      'Focus Mode',
      {
        type: 'device',
        conditions: [
          { deviceId: 'productivity_focus', property: 'active', operator: 'equals', value: true },
        ],
      },
      [
        { type: 'setDevice', target: 'entertainment_audio', parameters: { value: false } },
        { type: 'setDevice', target: 'light_desk', parameters: { value: true, brightness: 0.8 } },
        { type: 'notify', target: 'user', parameters: { message: 'Focus mode activated' } },
      ]
    );
  }

  // Create automation rule
  private createAutomationRule(id: string, name: string, trigger: Trigger, actions: Action[]) {
    const rule: AutomationRule = {
      id: id,
      name: name,
      trigger: trigger,
      actions: actions,
      enabled: true,
      priority: 1,
    };

    this.automationRules.set(id, rule);
  }

  // Create smart scenes
  private createSmartScenes() {
    // Work Mode
    this.createSmartScene(
      'work_mode',
      'Work Mode',
      'Optimized for productivity',
      ['light_main', 'light_desk', 'productivity_timer'],
      new Map([
        ['light_main', { value: true, brightness: 0.9 }],
        ['light_desk', { value: true, brightness: 0.8 }],
        ['temp_main', { value: 21 }],
        ['productivity_timer', { value: true, duration: 25 }],
      ]),
      '💼'
    );

    // Meeting Mode
    this.createSmartScene(
      'meeting_mode',
      'Meeting Mode',
      'Optimized for collaboration',
      ['light_main', 'light_meeting', 'entertainment_display'],
      new Map([
        ['light_main', { value: true, brightness: 0.7 }],
        ['light_meeting', { value: true, brightness: 0.8 }],
        ['entertainment_display', { value: 'presentation_mode' }],
        ['temp_main', { value: 22 }],
      ]),
      '🤝'
    );

    // Relax Mode
    this.createSmartScene(
      'relax_mode',
      'Relax Mode',
      'Optimized for comfort',
      ['entertainment_audio', 'light_main'],
      new Map([
        ['light_main', { value: true, brightness: 0.3, color: 'warm' }],
        ['entertainment_audio', { value: 'relax_playlist' }],
        ['temp_main', { value: 23 }],
      ]),
      '🌙'
    );

    // Energy Saver
    this.createSmartScene(
      'energy_saver',
      'Energy Saver',
      'Minimize energy consumption',
      ['light_main', 'light_desk', 'entertainment_display'],
      new Map([
        ['light_main', { value: false }],
        ['light_desk', { value: false }],
        ['entertainment_display', { value: false }],
        ['temp_main', { value: 20 }],
      ]),
      '🌱'
    );
  }

  // Create smart scene
  private createSmartScene(
    id: string,
    name: string,
    description: string,
    devices: string[],
    settings: Map<string, any>,
    icon: string
  ) {
    const scene: SmartScene = {
      id: id,
      name: name,
      description: description,
      devices: devices,
      settings: settings,
      icon: icon,
    };

    this.smartScenes.set(id, scene);
  }

  // Create control panel
  private createControlPanel() {
    this.controlPanel = engine.addEntity();
    Transform.create(this.controlPanel, {
      position: Vector3.create(8, 3, 14),
      scale: Vector3.create(4, 3, 0.1),
    });
    MeshRenderer.setBox(this.controlPanel);
    Material.setPbrMaterial(this.controlPanel, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2,
    });

    const title = engine.addEntity();
    Transform.create(title, {
      parent: this.controlPanel,
      position: Vector3.create(0, 1.2, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(title, {
      text: '🏠 SMART ROOM CONTROL',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3,
    });

    // Scene buttons
    this.createSceneButtons();

    // Device status display
    this.createDeviceStatusDisplay();

    // Energy monitor
    this.createEnergyMonitor();
  }

  // Create scene buttons
  private createSceneButtons() {
    let xOffset = -1.2;

    this.smartScenes.forEach((scene, id) => {
      const button = engine.addEntity();
      Transform.create(button, {
        parent: this.controlPanel,
        position: Vector3.create(xOffset, 0.5, 0.1),
        scale: Vector3.create(0.5, 0.3, 0.1),
      });
      MeshRenderer.setBox(button);
      Material.setPbrMaterial(button, {
        albedoColor: Color4.create(0.2, 0.6, 0.8, 1),
        emissiveColor: Color4.create(0.2, 0.6, 0.8, 0.5),
        emissiveIntensity: 2,
      });

      const buttonText = engine.addEntity();
      Transform.create(buttonText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5),
      });
      TextShape.create(buttonText, {
        text: `${scene.icon} ${scene.name}`,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 1.5,
        textAlign: 3,
      });

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: `Activate ${scene.name}` },
        },
        () => this.activateScene(id)
      );

      xOffset += 0.8;
    });
  }

  // Create device status display
  private createDeviceStatusDisplay() {
    const statusDisplay = engine.addEntity();
    Transform.create(statusDisplay, {
      parent: this.controlPanel,
      position: Vector3.create(0, -0.3, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1),
    });
    MeshRenderer.setBox(statusDisplay);
    Material.setPbrMaterial(statusDisplay, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1,
    });

    this.updateDeviceStatusDisplay();
  }

  // Create energy monitor
  private createEnergyMonitor() {
    const energyDisplay = engine.addEntity();
    Transform.create(energyDisplay, {
      parent: this.controlPanel,
      position: Vector3.create(0, -0.8, 0.1),
      scale: Vector3.create(0.8, 0.2, 0.1),
    });
    MeshRenderer.setBox(energyDisplay);
    Material.setPbrMaterial(energyDisplay, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1,
    });

    this.updateEnergyDisplay();
  }

  // Start automation engine
  private startAutomationEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return;

      this.updateDeviceValues();
      this.checkAutomationRules();
      this.updateDisplays();
    });
  }

  // Update device values
  private updateDeviceValues() {
    this.devices.forEach(device => {
      // Simulate device value changes
      switch (device.type) {
        case 'temperature':
          device.value = 20 + Math.sin(Date.now() / 10000) * 3;
          break;
        case 'energy':
          device.value = Math.random() * 100;
          break;
        case 'security':
          device.value = Math.random() > 0.95 ? 'alert' : 'normal';
          break;
      }

      device.lastUpdate = Date.now();
    });

    // Calculate total energy usage
    this.energyUsage = Array.from(this.devices.values())
      .filter(d => d.type === 'energy')
      .reduce((sum, d) => sum + (d.value as number), 0);
  }

  // Check automation rules
  private checkAutomationRules() {
    this.automationRules.forEach(rule => {
      if (!rule.enabled) return;

      if (this.evaluateTrigger(rule.trigger)) {
        this.executeActions(rule.actions);
      }
    });
  }

  // Evaluate trigger conditions
  private evaluateTrigger(trigger: Trigger): boolean {
    const hour = new Date().getHours();

    switch (trigger.type) {
      case 'time':
        return trigger.conditions.some(condition => {
          if (condition.property === 'hour') {
            switch (condition.operator) {
              case 'equals':
                return hour === condition.value;
              case 'greater':
                return hour > condition.value;
              case 'less':
                return hour < condition.value;
              default:
                return false;
            }
          }
          return false;
        });

      case 'device':
        return trigger.conditions.every(condition => {
          const device = this.devices.get(condition.deviceId);
          if (!device) return false;

          switch (condition.operator) {
            case 'equals':
              return device.value === condition.value;
            case 'greater':
              return (device.value as number) > condition.value;
            case 'less':
              return (device.value as number) < condition.value;
            default:
              return false;
          }
        });

      default:
        return false;
    }
  }

  // Execute automation actions
  private executeActions(actions: Action[]) {
    actions.forEach(action => {
      switch (action.type) {
        case 'setDevice':
          this.setDeviceValue(action.target, action.parameters);
          break;
        case 'notify':
          console.log(`🔔 Notification: ${action.parameters.message}`);
          soundSystem.playInteractionSound('alert');
          break;
        case 'scene':
          this.activateScene(action.target);
          break;
      }
    });
  }

  // Set device value
  private setDeviceValue(deviceId: string, parameters: any) {
    const device = this.devices.get(deviceId);
    if (device) {
      device.value = parameters.value || parameters;
      device.lastUpdate = Date.now();
      console.log(`🔧 Set ${device.name} to: ${device.value}`);
    }
  }

  // Handle device interaction
  private handleDeviceInteraction(deviceId: string) {
    const device = this.devices.get(deviceId);
    if (!device) return;

    console.log(`🔧 Interacting with ${device.name}`);
    soundSystem.playInteractionSound('click');

    // Toggle device state
    if (typeof device.value === 'boolean') {
      device.value = !device.value;
    } else if (device.type === 'light') {
      device.value = !device.value;
    }

    // Update visual feedback
    this.updateDeviceVisual(deviceId);
  }

  // Update device visual
  private updateDeviceVisual(deviceId: string) {
    const device = this.devices.get(deviceId);
    if (!device) return;

    // Update device entity appearance based on state
    let deviceEntity: any = null;
    for (const [entity] of engine.getEntitiesWith(Transform)) {
      const transform = Transform.get(entity);
      if (Vector3.distance(transform.position, device.position) < 0.1) {
        deviceEntity = entity;
        break;
      }
    }

    if (deviceEntity) {
      Material.setPbrMaterial(deviceEntity, {
        emissiveIntensity: device.value === true ? 3 : 1,
      });
    }
  }

  // Activate scene
  public activateScene(sceneId: string) {
    const scene = this.smartScenes.get(sceneId);
    if (!scene) return;

    console.log(`🎬 Activating scene: ${scene.name}`);
    soundSystem.playInteractionSound('powerup');

    this.currentScene = sceneId;

    // Apply scene settings
    scene.settings.forEach((settings, deviceId) => {
      this.setDeviceValue(deviceId, settings);
    });
  }

  // Update displays
  private updateDisplays() {
    this.updateDeviceStatusDisplay();
    this.updateEnergyDisplay();
  }

  // Update device status display
  private updateDeviceStatusDisplay() {
    // Update status text with current device states
    const onlineDevices = Array.from(this.devices.values()).filter(
      d => d.status === 'online'
    ).length;
    const totalDevices = this.devices.size;

    console.log(`📊 Device Status: ${onlineDevices}/${totalDevices} online`);
  }

  // Update energy display
  private updateEnergyDisplay() {
    console.log(`⚡ Energy Usage: ${this.energyUsage.toFixed(1)}%`);
  }

  // Get current scene
  public getCurrentScene(): string {
    return this.currentScene;
  }

  // Get all devices
  public getDevices(): IoTDevice[] {
    return Array.from(this.devices.values());
  }

  // Get device by ID
  public getDevice(deviceId: string): IoTDevice | undefined {
    return this.devices.get(deviceId);
  }

  // Add new device
  public addDevice(device: IoTDevice) {
    this.devices.set(device.id, device);
    console.log(`📱 Added device: ${device.name}`);
  }

  // Remove device
  public removeDevice(deviceId: string) {
    const device = this.devices.get(deviceId);
    if (device) {
      this.devices.delete(deviceId);
      console.log(`🗑️ Removed device: ${device.name}`);
    }
  }

  // Get energy usage
  public getEnergyUsage(): number {
    return this.energyUsage;
  }

  // Cleanup system
  public cleanup() {
    this.devices.clear();
    this.automationRules.clear();
    this.smartScenes.clear();

    if (this.controlPanel) {
      engine.removeEntity(this.controlPanel);
    }

    this.isInitialized = false;
  }
}

// Export singleton instance
export const smartRoomSystem = new SmartRoomSystem();
