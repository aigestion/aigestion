// Customizable Avatar System for AIGestion Virtual Office
import {
  engine,
  InputAction,
  Material,
  MeshRenderer,
  pointerEventsSystem,
  TextShape,
  Transform,
} from '@dcl/sdk/ecs';
import { Color3, Color4, Quaternion, Vector3 } from '@dcl/sdk/math';
import { soundSystem } from './enhanced-sound';

interface AvatarCustomization {
  id: string;
  name: string;
  bodyType: 'humanoid' | 'robot' | 'cyborg' | 'energy';
  primaryColor: Color3;
  secondaryColor: Color3;
  accessories: string[];
  animations: string[];
  effects: AvatarEffect[];
  scale: Vector3;
  position: Vector3;
}

interface AvatarEffect {
  type: 'glow' | 'particles' | 'trail' | 'hologram';
  intensity: number;
  color: Color3;
  enabled: boolean;
}

interface AvatarPreset {
  id: string;
  name: string;
  customization: AvatarCustomization;
  thumbnail: string;
  category: 'professional' | 'casual' | 'futuristic' | 'artistic';
}

interface AnimationState {
  currentAnimation: string;
  isPlaying: boolean;
  speed: number;
  loop: boolean;
}

export class AvatarSystem {
  private currentAvatar: AvatarCustomization;
  private avatarEntity: any;
  private avatarParts: Map<string, any> = new Map();
  private presets: Map<string, AvatarPreset> = new Map();
  private animationState: AnimationState;
  private customizationUI: any;
  private isInitialized: boolean = false;

  constructor() {
    this.currentAvatar = this.createDefaultAvatar();
    this.animationState = {
      currentAnimation: 'idle',
      isPlaying: true,
      speed: 1.0,
      loop: true,
    };
  }

  // Initialize avatar system
  initialize() {
    console.log('👤 Avatar System Initializing...');

    this.loadAvatarPresets();
    this.createAvatar();
    this.createCustomizationUI();
    this.setupAvatarAnimations();

    this.isInitialized = true;
    console.log('👤 Avatar System Ready!');
  }

  // Create default avatar
  private createDefaultAvatar(): AvatarCustomization {
    return {
      id: 'default',
      name: 'Default Avatar',
      bodyType: 'humanoid',
      primaryColor: Color3.create(0.3, 0.5, 0.8),
      secondaryColor: Color3.create(0.8, 0.6, 0.2),
      accessories: [],
      animations: ['idle', 'walk', 'wave', 'dance'],
      effects: [],
      scale: Vector3.create(1, 2, 1),
      position: Vector3.create(8, 1, 8),
    };
  }

  // Load avatar presets
  private loadAvatarPresets() {
    const presets: AvatarPreset[] = [
      {
        id: 'professional',
        name: 'Professional',
        category: 'professional',
        thumbnail: '👔',
        customization: {
          id: 'professional',
          name: 'Professional Avatar',
          bodyType: 'humanoid',
          primaryColor: Color3.create(0.2, 0.3, 0.6),
          secondaryColor: Color3.create(0.8, 0.8, 0.8),
          accessories: ['tie', 'briefcase'],
          animations: ['idle', 'walk', 'type', 'present'],
          effects: [],
          scale: Vector3.create(1, 2, 1),
          position: Vector3.create(8, 1, 8),
        },
      },
      {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        category: 'futuristic',
        thumbnail: '🤖',
        customization: {
          id: 'cyberpunk',
          name: 'Cyberpunk Avatar',
          bodyType: 'cyborg',
          primaryColor: Color3.create(0.8, 0.2, 0.8),
          secondaryColor: Color3.create(0.2, 0.8, 0.8),
          accessories: ['helmet', 'armor', 'glowing-eyes'],
          animations: ['idle', 'walk', 'hack', 'transform'],
          effects: [
            { type: 'glow', intensity: 0.8, color: Color3.create(0.8, 0.2, 0.8), enabled: true },
            {
              type: 'particles',
              intensity: 0.5,
              color: Color3.create(0.2, 0.8, 0.8),
              enabled: true,
            },
          ],
          scale: Vector3.create(1.1, 2.1, 1.1),
          position: Vector3.create(8, 1, 8),
        },
      },
      {
        id: 'energy',
        name: 'Energy Being',
        category: 'futuristic',
        thumbnail: '✨',
        customization: {
          id: 'energy',
          name: 'Energy Being',
          bodyType: 'energy',
          primaryColor: Color3.create(0.8, 0.8, 1),
          secondaryColor: Color3.create(1, 0.8, 0.8),
          accessories: ['energy-orbs'],
          animations: ['idle', 'float', 'pulse', 'teleport'],
          effects: [
            { type: 'glow', intensity: 1.0, color: Color3.create(0.8, 0.8, 1), enabled: true },
            { type: 'particles', intensity: 0.8, color: Color3.create(1, 0.8, 0.8), enabled: true },
            { type: 'hologram', intensity: 0.6, color: Color3.create(0.8, 1, 0.8), enabled: true },
          ],
          scale: Vector3.create(0.9, 2.2, 0.9),
          position: Vector3.create(8, 1, 8),
        },
      },
      {
        id: 'artist',
        name: 'Artist',
        category: 'artistic',
        thumbnail: '🎨',
        customization: {
          id: 'artist',
          name: 'Artist Avatar',
          bodyType: 'humanoid',
          primaryColor: Color3.create(0.8, 0.4, 0.2),
          secondaryColor: Color3.create(0.2, 0.8, 0.4),
          accessories: ['beret', 'palette'],
          animations: ['idle', 'walk', 'paint', 'dance'],
          effects: [
            {
              type: 'particles',
              intensity: 0.3,
              color: Color3.create(0.8, 0.4, 0.2),
              enabled: true,
            },
          ],
          scale: Vector3.create(1, 2, 1),
          position: Vector3.create(8, 1, 8),
        },
      },
    ];

    presets.forEach(preset => {
      this.presets.set(preset.id, preset);
    });
  }

  // Create avatar entity
  private createAvatar() {
    this.avatarEntity = engine.addEntity();
    Transform.create(this.avatarEntity, {
      position: this.currentAvatar.position,
      scale: this.currentAvatar.scale,
      rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    });

    this.createAvatarBody();
    this.createAvatarAccessories();
    this.applyAvatarEffects();
  }

  // Create avatar body based on type
  private createAvatarBody() {
    const body = engine.addEntity();
    Transform.create(body, {
      parent: this.avatarEntity,
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(0.8, 1.6, 0.4),
    });

    switch (this.currentAvatar.bodyType) {
      case 'humanoid':
        MeshRenderer.setBox(body);
        Material.setPbrMaterial(body, {
          albedoColor: Color4.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          roughness: 0.3,
          metallic: 0.1,
        });
        break;

      case 'robot':
        MeshRenderer.setBox(body);
        Material.setPbrMaterial(body, {
          albedoColor: Color4.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          roughness: 0.1,
          metallic: 0.9,
          emissiveColor: Color4.create(
            this.currentAvatar.primaryColor.r * 0.3,
            this.currentAvatar.primaryColor.g * 0.3,
            this.currentAvatar.primaryColor.b * 0.3,
            0.5
          ),
          emissiveIntensity: 2,
        });
        break;

      case 'cyborg':
        MeshRenderer.setBox(body);
        Material.setPbrMaterial(body, {
          albedoColor: Color4.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          roughness: 0.2,
          metallic: 0.7,
          emissiveColor: Color4.create(
            this.currentAvatar.secondaryColor.r * 0.5,
            this.currentAvatar.secondaryColor.g * 0.5,
            this.currentAvatar.secondaryColor.b * 0.5,
            0.6
          ),
          emissiveIntensity: 3,
        });
        break;

      case 'energy':
        MeshRenderer.setSphere(body);
        Material.setPbrMaterial(body, {
          albedoColor: Color4.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            0.6
          ),
          roughness: 0.0,
          metallic: 1.0,
          emissiveColor: Color4.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          emissiveIntensity: 5,
        });
        break;
    }

    this.avatarParts.set('body', body);

    // Create head
    this.createAvatarHead();
  }

  // Create avatar head
  private createAvatarHead() {
    const head = engine.addEntity();
    Transform.create(head, {
      parent: this.avatarEntity,
      position: Vector3.create(0, 1.2, 0),
      scale: Vector3.create(0.4, 0.4, 0.4),
    });

    if (this.currentAvatar.bodyType === 'energy') {
      MeshRenderer.setSphere(head);
    } else {
      MeshRenderer.setBox(head);
    }

    Material.setPbrMaterial(head, {
      albedoColor: Color4.create(
        this.currentAvatar.secondaryColor.r,
        this.currentAvatar.secondaryColor.g,
        this.currentAvatar.secondaryColor.b,
        1
      ),
      roughness: 0.2,
      metallic: 0.1,
    });

    this.avatarParts.set('head', head);
  }

  // Create avatar accessories
  private createAvatarAccessories() {
    this.currentAvatar.accessories.forEach(accessory => {
      this.createAccessory(accessory);
    });
  }

  // Create individual accessory
  private createAccessory(accessory: string) {
    const accessoryEntity = engine.addEntity();

    switch (accessory) {
      case 'tie':
        Transform.create(accessoryEntity, {
          parent: this.avatarEntity,
          position: Vector3.create(0, 0.2, 0.21),
          scale: Vector3.create(0.1, 0.8, 0.05),
        });
        MeshRenderer.setBox(accessoryEntity);
        Material.setPbrMaterial(accessoryEntity, {
          albedoColor: Color4.create(0.8, 0.2, 0.2, 1),
          roughness: 0.1,
          metallic: 0.1,
        });
        break;

      case 'helmet':
        Transform.create(accessoryEntity, {
          parent: this.avatarEntity,
          position: Vector3.create(0, 1.6, 0),
          scale: Vector3.create(0.5, 0.3, 0.5),
        });
        MeshRenderer.setBox(accessoryEntity);
        Material.setPbrMaterial(accessoryEntity, {
          albedoColor: Color4.create(0.3, 0.3, 0.3, 1),
          roughness: 0.1,
          metallic: 0.9,
          emissiveColor: Color4.create(0.2, 0.2, 0.8, 0.5),
          emissiveIntensity: 2,
        });
        break;

      case 'energy-orbs':
        for (let i = 0; i < 3; i++) {
          const orb = engine.addEntity();
          Transform.create(orb, {
            parent: this.avatarEntity,
            position: Vector3.create(
              Math.cos((i * 120 * Math.PI) / 180) * 0.8,
              1 + Math.sin((i * 120 * Math.PI) / 180) * 0.3,
              Math.sin((i * 120 * Math.PI) / 180) * 0.8
            ),
            scale: Vector3.create(0.1, 0.1, 0.1),
          });
          MeshRenderer.setSphere(orb);
          Material.setPbrMaterial(orb, {
            albedoColor: Color4.create(1, 0.8, 0.2, 0.8),
            emissiveColor: Color4.create(1, 0.8, 0.2, 1),
            emissiveIntensity: 4,
          });
          this.avatarParts.set(`orb_${i}`, orb);
        }
        break;

      case 'beret':
        Transform.create(accessoryEntity, {
          parent: this.avatarEntity,
          position: Vector3.create(0, 1.45, 0),
          scale: Vector3.create(0.5, 0.1, 0.5),
        });
        MeshRenderer.setBox(accessoryEntity);
        Material.setPbrMaterial(accessoryEntity, {
          albedoColor: Color4.create(0.8, 0.2, 0.2, 1),
          roughness: 0.3,
          metallic: 0.1,
        });
        break;
    }

    this.avatarParts.set(accessory, accessoryEntity);
  }

  // Apply avatar effects
  private applyAvatarEffects() {
    this.currentAvatar.effects.forEach(effect => {
      if (effect.enabled) {
        this.createEffect(effect);
      }
    });
  }

  // Create individual effect
  private createEffect(effect: AvatarEffect) {
    switch (effect.type) {
      case 'glow':
        this.createGlowEffect(effect);
        break;
      case 'particles':
        this.createParticleEffect(effect);
        break;
      case 'hologram':
        this.createHologramEffect(effect);
        break;
    }
  }

  // Create glow effect
  private createGlowEffect(effect: AvatarEffect) {
    const glow = engine.addEntity();
    Transform.create(glow, {
      parent: this.avatarEntity,
      position: Vector3.create(0, 1, 0),
      scale: Vector3.create(1.5, 2.5, 1.5),
    });
    MeshRenderer.setSphere(glow);
    Material.setPbrMaterial(glow, {
      albedoColor: Color4.create(effect.color.r, effect.color.g, effect.color.b, 0.3),
      emissiveColor: Color4.create(effect.color.r, effect.color.g, effect.color.b, 0.8),
      emissiveIntensity: effect.intensity * 3,
    });
    this.avatarParts.set('glow', glow);
  }

  // Create particle effect
  private createParticleEffect(effect: AvatarEffect) {
    for (let i = 0; i < 20; i++) {
      const particle = engine.addEntity();
      Transform.create(particle, {
        parent: this.avatarEntity,
        position: Vector3.create(
          (Math.random() - 0.5) * 2,
          Math.random() * 2,
          (Math.random() - 0.5) * 2
        ),
        scale: Vector3.create(0.05, 0.05, 0.05),
      });
      MeshRenderer.setSphere(particle);
      Material.setPbrMaterial(particle, {
        albedoColor: Color4.create(effect.color.r, effect.color.g, effect.color.b, 0.8),
        emissiveColor: Color4.create(effect.color.r, effect.color.g, effect.color.b, 1),
        emissiveIntensity: effect.intensity * 2,
      });
      this.avatarParts.set(`particle_${i}`, particle);
    }
  }

  // Create hologram effect
  private createHologramEffect(effect: AvatarEffect) {
    const hologram = engine.addEntity();
    Transform.create(hologram, {
      parent: this.avatarEntity,
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(1.1, 2.1, 1.1),
    });
    MeshRenderer.setBox(hologram);
    Material.setPbrMaterial(hologram, {
      albedoColor: Color4.create(effect.color.r, effect.color.g, effect.color.b, 0.2),
      emissiveColor: Color4.create(effect.color.r, effect.color.g, effect.color.b, 0.6),
      emissiveIntensity: effect.intensity * 2,
    });
    this.avatarParts.set('hologram', hologram);
  }

  // Create customization UI
  private createCustomizationUI() {
    const uiPanel = engine.addEntity();
    Transform.create(uiPanel, {
      position: Vector3.create(14, 3, 8),
      scale: Vector3.create(3, 4, 0.1),
    });
    MeshRenderer.setBox(uiPanel);
    Material.setPbrMaterial(uiPanel, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2,
    });

    const title = engine.addEntity();
    Transform.create(title, {
      parent: uiPanel,
      position: Vector3.create(0, 1.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(title, {
      text: '👤 AVATAR CUSTOMIZE',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3,
    });

    // Create preset buttons
    this.createPresetButtons(uiPanel);

    // Create color customization
    this.createColorCustomization(uiPanel);

    // Create effect toggles
    this.createEffectToggles(uiPanel);

    this.customizationUI = uiPanel;
  }

  // Create preset buttons
  private createPresetButtons(parent: any) {
    let yOffset = 1.2;

    this.presets.forEach((preset, index) => {
      const button = engine.addEntity();
      Transform.create(button, {
        parent: parent,
        position: Vector3.create(0, yOffset, 0.1),
        scale: Vector3.create(0.4, 0.3, 0.1),
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
        text: `${preset.thumbnail} ${preset.name}`,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3,
      });

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: `Select ${preset.name}` },
        },
        () => this.applyPreset(preset.id)
      );

      yOffset -= 0.4;
    });
  }

  // Create color customization
  private createColorCustomization(parent: any) {
    const colorPanel = engine.addEntity();
    Transform.create(colorPanel, {
      parent: parent,
      position: Vector3.create(0, -0.5, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1),
    });
    MeshRenderer.setBox(colorPanel);
    Material.setPbrMaterial(colorPanel, {
      albedoColor: Color4.create(0.3, 0.3, 0.3, 0.8),
      emissiveColor: Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1,
    });

    const colorText = engine.addEntity();
    Transform.create(colorText, {
      parent: colorPanel,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.5, 0.5, 0.5),
    });
    TextShape.create(colorText, {
      text: '🎨 COLORS',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3,
    });
  }

  // Create effect toggles
  private createEffectToggles(parent: any) {
    const effectPanel = engine.addEntity();
    Transform.create(effectPanel, {
      parent: parent,
      position: Vector3.create(0, -1.2, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1),
    });
    MeshRenderer.setBox(effectPanel);
    Material.setPbrMaterial(effectPanel, {
      albedoColor: Color4.create(0.3, 0.3, 0.3, 0.8),
      emissiveColor: Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1,
    });

    const effectText = engine.addEntity();
    Transform.create(effectText, {
      parent: effectPanel,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.5, 0.5, 0.5),
    });
    TextShape.create(effectText, {
      text: '✨ EFFECTS',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3,
    });
  }

  // Setup avatar animations
  private setupAvatarAnimations() {
    engine.addSystem(() => {
      if (!this.isInitialized) return;

      this.updateAnimations();
      this.updateEffects();
    });
  }

  // Update animations
  private updateAnimations() {
    if (!this.animationState.isPlaying) return;

    const time = Date.now() / 1000;
    const body = this.avatarParts.get('body');

    if (body) {
      switch (this.animationState.currentAnimation) {
        case 'idle':
          const idleBob = Math.sin(time * 2) * 0.02;
          const transform = Transform.getMutable(body);
          transform.position.y = idleBob;
          break;

        case 'walk':
          const walkBob = Math.abs(Math.sin(time * 4)) * 0.05;
          const walkTransform = Transform.getMutable(body);
          walkTransform.position.y = walkBob;
          walkTransform.rotation = Quaternion.fromEulerDegrees(Math.sin(time * 4) * 5, 0, 0);
          break;

        case 'dance':
          const danceTransform = Transform.getMutable(body);
          danceTransform.rotation = Quaternion.fromEulerDegrees(
            Math.sin(time * 3) * 10,
            Math.cos(time * 2) * 15,
            Math.sin(time * 4) * 5
          );
          break;

        case 'float':
          const floatTransform = Transform.getMutable(body);
          floatTransform.position.y = Math.sin(time * 1.5) * 0.1;
          break;
      }
    }
  }

  // Update effects
  private updateEffects() {
    this.avatarParts.forEach((part, key) => {
      if (key.startsWith('particle_')) {
        const time = Date.now() / 1000;
        const transform = Transform.getMutable(part);
        transform.position.y += Math.sin(time + parseInt(key.split('_')[1])) * 0.01;
      }

      if (key.startsWith('orb_')) {
        const time = Date.now() / 1000;
        const index = parseInt(key.split('_')[1]);
        const radius = 0.8 + Math.sin(time * 2 + (index * 120 * Math.PI) / 180) * 0.2;
        const transform = Transform.getMutable(part);
        transform.position.x = Math.cos(time + (index * 120 * Math.PI) / 180) * radius;
        transform.position.z = Math.sin(time + (index * 120 * Math.PI) / 180) * radius;
      }
    });
  }

  // Apply preset
  public applyPreset(presetId: string) {
    const preset = this.presets.get(presetId);
    if (!preset) return;

    console.log(`👤 Applying preset: ${preset.name}`);
    soundSystem.playInteractionSound('powerup');

    // Clear current avatar
    this.clearCurrentAvatar();

    // Apply new customization
    this.currentAvatar = { ...preset.customization };
    this.createAvatar();
  }

  // Clear current avatar
  private clearCurrentAvatar() {
    this.avatarParts.forEach(part => {
      engine.removeEntity(part);
    });
    this.avatarParts.clear();
  }

  // Play animation
  public playAnimation(animationName: string) {
    if (this.currentAvatar.animations.includes(animationName)) {
      this.animationState.currentAnimation = animationName;
      this.animationState.isPlaying = true;
      console.log(`🎬 Playing animation: ${animationName}`);
    }
  }

  // Stop animation
  public stopAnimation() {
    this.animationState.isPlaying = false;
  }

  // Get current avatar customization
  public getCurrentAvatar(): AvatarCustomization {
    return { ...this.currentAvatar };
  }

  // Get available presets
  public getAvailablePresets(): AvatarPreset[] {
    return Array.from(this.presets.values());
  }

  // Customize avatar colors
  public customizeColors(primaryColor: Color3, secondaryColor: Color3) {
    this.currentAvatar.primaryColor = primaryColor;
    this.currentAvatar.secondaryColor = secondaryColor;

    // Update avatar materials
    const body = this.avatarParts.get('body');
    if (body) {
      const material = Material.get(body);
      Material.setPbrMaterial(body, {
        ...material,
        albedoColor: Color4.create(primaryColor.r, primaryColor.g, primaryColor.b, 1),
      });
    }

    const head = this.avatarParts.get('head');
    if (head) {
      const material = Material.get(head);
      Material.setPbrMaterial(head, {
        ...material,
        albedoColor: Color4.create(secondaryColor.r, secondaryColor.g, secondaryColor.b, 1),
      });
    }
  }

  // Add accessory
  public addAccessory(accessory: string) {
    if (!this.currentAvatar.accessories.includes(accessory)) {
      this.currentAvatar.accessories.push(accessory);
      this.createAccessory(accessory);
      soundSystem.playInteractionSound('click');
    }
  }

  // Remove accessory
  public removeAccessory(accessory: string) {
    const index = this.currentAvatar.accessories.indexOf(accessory);
    if (index > -1) {
      this.currentAvatar.accessories.splice(index, 1);
      const part = this.avatarParts.get(accessory);
      if (part) {
        engine.removeEntity(part);
        this.avatarParts.delete(accessory);
      }
      soundSystem.playInteractionSound('click');
    }
  }

  // Toggle effect
  public toggleEffect(effectType: string) {
    const effect = this.currentAvatar.effects.find(e => e.type === effectType);
    if (effect) {
      effect.enabled = !effect.enabled;

      if (effect.enabled) {
        this.createEffect(effect);
      } else {
        // Remove effect
        this.avatarParts.forEach((part, key) => {
          if (key.startsWith(effectType)) {
            engine.removeEntity(part);
            this.avatarParts.delete(key);
          }
        });
      }

      soundSystem.playInteractionSound('click');
    }
  }

  // Cleanup system
  public cleanup() {
    this.clearCurrentAvatar();

    if (this.avatarEntity) {
      engine.removeEntity(this.avatarEntity);
    }

    if (this.customizationUI) {
      engine.removeEntity(this.customizationUI);
    }

    this.presets.clear();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const avatarSystem = new AvatarSystem();
