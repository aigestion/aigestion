"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/enhanced-index.ts
var enhanced_index_exports = {};
__export(enhanced_index_exports, {
  cleanupEnhancedScene: () => cleanupEnhancedScene,
  enhancedMain: () => enhancedMain
});
module.exports = __toCommonJS(enhanced_index_exports);
var import_ecs27 = require("@dcl/sdk/ecs");
var import_math25 = require("@dcl/sdk/math");

// src/utils/timers.ts
var import_ecs = require("@dcl/sdk/ecs");
var timers = /* @__PURE__ */ new Map();
var timerIdCounter = 0;
import_ecs.engine.addSystem((dt) => {
  for (const [id, timer] of timers.entries()) {
    timer.time -= dt;
    if (timer.time <= 0) {
      timer.callback();
      if (timer.loop) {
        timer.time = timer.originalTime;
      } else {
        timers.delete(id);
      }
    }
  }
});
function setTimeout(callback, ms) {
  const id = ++timerIdCounter;
  timers.set(id, {
    callback,
    time: ms / 1e3,
    loop: false,
    originalTime: ms / 1e3
  });
  return id;
}
function setInterval(callback, ms) {
  const id = ++timerIdCounter;
  timers.set(id, {
    callback,
    time: ms / 1e3,
    loop: true,
    originalTime: ms / 1e3
  });
  return id;
}
function clearInterval(id) {
  if (id !== void 0) {
    timers.delete(id);
  }
}

// src/advanced-lighting.ts
var import_ecs2 = require("@dcl/sdk/ecs");
var import_math = require("@dcl/sdk/math");
var AdvancedLightingSystem = class {
  constructor() {
    this.lights = /* @__PURE__ */ new Map();
    this.timeOfDay = 0;
    this.shadowCasters = [];
    this.volumetricLights = [];
  }
  // Initialize advanced lighting
  initialize() {
    console.log("\u{1F4A1} Advanced Lighting System Initializing...");
    this.createGlobalIllumination();
    this.createDynamicShadows();
    this.createVolumetricLighting();
    this.createHDRSystem();
    this.startDayNightCycle();
    console.log("\u{1F4A1} Advanced Lighting System Ready!");
  }
  // Create global illumination system
  createGlobalIllumination() {
    const sunLight = import_ecs2.engine.addEntity();
    import_ecs2.Transform.create(sunLight, {
      position: import_math.Vector3.create(8, 20, 8),
      scale: import_math.Vector3.create(2, 2, 2)
    });
    import_ecs2.MeshRenderer.setBox(sunLight);
    import_ecs2.Material.setPbrMaterial(sunLight, {
      albedoColor: import_math.Color4.create(1, 0.95, 0.8, 0.8),
      emissiveColor: import_math.Color4.create(1, 0.95, 0.8, 1),
      emissiveIntensity: 2
    });
    this.lights.set("sun", sunLight);
    const ambientLight = import_ecs2.engine.addEntity();
    import_ecs2.Transform.create(ambientLight, {
      position: import_math.Vector3.create(8, 15, 8),
      scale: import_math.Vector3.create(30, 30, 30)
    });
    import_ecs2.MeshRenderer.setSphere(ambientLight);
    import_ecs2.Material.setPbrMaterial(ambientLight, {
      albedoColor: import_math.Color4.create(0.4, 0.45, 0.5, 0.1),
      emissiveColor: import_math.Color4.create(0.4, 0.45, 0.5, 0.3),
      emissiveIntensity: 0.5
    });
    this.lights.set("ambient", ambientLight);
  }
  // Create dynamic shadow system
  createDynamicShadows() {
    const shadowCasterPositions = [
      { pos: import_math.Vector3.create(8, 0, 8), scale: import_math.Vector3.create(16, 0.1, 16) },
      // Floor
      { pos: import_math.Vector3.create(8, 3, 15.9), scale: import_math.Vector3.create(16, 6, 0.2) },
      // Back wall
      { pos: import_math.Vector3.create(2, 3, 0.5), scale: import_math.Vector3.create(1.2, 6, 1.2) },
      // Pillar 1
      { pos: import_math.Vector3.create(14, 3, 0.5), scale: import_math.Vector3.create(1.2, 6, 1.2) }
      // Pillar 2
    ];
    shadowCasterPositions.forEach((config, index) => {
      const shadowCaster = import_ecs2.engine.addEntity();
      import_ecs2.Transform.create(shadowCaster, {
        position: config.pos,
        scale: config.scale
      });
      import_ecs2.MeshRenderer.setBox(shadowCaster);
      import_ecs2.Material.setPbrMaterial(shadowCaster, {
        alphaTest: 0.01
      });
      this.shadowCasters.push(shadowCaster);
    });
  }
  // Create volumetric lighting effects
  createVolumetricLighting() {
    const beamPositions = [
      import_math.Vector3.create(2, 6, 2),
      import_math.Vector3.create(14, 6, 2),
      import_math.Vector3.create(8, 6, 8),
      import_math.Vector3.create(2, 6, 14),
      import_math.Vector3.create(14, 6, 14)
    ];
    beamPositions.forEach((pos, index) => {
      const volumetricLight = import_ecs2.engine.addEntity();
      import_ecs2.Transform.create(volumetricLight, {
        position: pos,
        scale: import_math.Vector3.create(0.3, 8, 0.3)
      });
      import_ecs2.MeshRenderer.setBox(volumetricLight);
      import_ecs2.Material.setPbrMaterial(volumetricLight, {
        albedoColor: import_math.Color4.create(0.8, 0.9, 1, 0.3),
        emissiveColor: import_math.Color4.create(0.6, 0.7, 1, 0.8),
        emissiveIntensity: 5,
        alphaTest: 0.01
      });
      this.volumetricLights.push(volumetricLight);
    });
  }
  // Create HDR tone mapping system
  createHDRSystem() {
    const exposureZones = [
      { pos: import_math.Vector3.create(8, 2, 8), intensity: 1, color: import_math.Color3.create(1, 1, 1) },
      // Center
      { pos: import_math.Vector3.create(2, 2, 2), intensity: 0.8, color: import_math.Color3.create(0.8, 0.9, 1) },
      // Corner 1
      { pos: import_math.Vector3.create(14, 2, 2), intensity: 0.8, color: import_math.Color3.create(0.8, 0.9, 1) },
      // Corner 2
      { pos: import_math.Vector3.create(2, 2, 14), intensity: 0.8, color: import_math.Color3.create(0.8, 0.9, 1) },
      // Corner 3
      { pos: import_math.Vector3.create(14, 2, 14), intensity: 0.8, color: import_math.Color3.create(0.8, 0.9, 1) }
      // Corner 4
    ];
    exposureZones.forEach((zone, index) => {
      const exposureLight = import_ecs2.engine.addEntity();
      import_ecs2.Transform.create(exposureLight, {
        position: zone.pos,
        scale: import_math.Vector3.create(4, 4, 4)
      });
      import_ecs2.MeshRenderer.setSphere(exposureLight);
      import_ecs2.Material.setPbrMaterial(exposureLight, {
        albedoColor: import_math.Color4.create(zone.color.r, zone.color.g, zone.color.b, 0.2),
        emissiveColor: import_math.Color4.create(zone.color.r, zone.color.g, zone.color.b, 0.6),
        emissiveIntensity: zone.intensity
      });
      this.lights.set(`exposure_${index}`, exposureLight);
    });
  }
  // Start day/night cycle
  startDayNightCycle() {
    import_ecs2.engine.addSystem(() => {
      this.timeOfDay += 1e-3;
      this.updateDayNightCycle();
      this.updateVolumetricLights();
    });
  }
  // Update day/night cycle lighting
  updateDayNightCycle() {
    const sunLight = this.lights.get("sun");
    const ambientLight = this.lights.get("ambient");
    if (sunLight && ambientLight) {
      const sunAngle = this.timeOfDay * Math.PI * 2;
      const sunHeight = Math.sin(sunAngle);
      const sunIntensity = Math.max(0, sunHeight);
      const sunTransform = import_ecs2.Transform.getMutable(sunLight);
      sunTransform.rotation = import_math.Quaternion.fromEulerDegrees(sunAngle * 180 / Math.PI - 90, 0, 0);
      const sunMaterial = import_ecs2.Material.get(sunLight);
      let sunAlbedo = import_math.Color4.create(1, 0.95, 0.8, 0.8);
      let sunEmissive = import_math.Color4.create(1, 0.95, 0.8, 1);
      if (sunIntensity > 0.5) {
      } else if (sunIntensity > 0.1) {
        sunAlbedo = import_math.Color4.create(1, 0.7, 0.4, 0.8);
        sunEmissive = import_math.Color4.create(1, 0.7, 0.4, 1);
      } else {
        sunAlbedo = import_math.Color4.create(0.2, 0.3, 0.6, 0.8);
        sunEmissive = import_math.Color4.create(0.2, 0.3, 0.6, 1);
      }
      import_ecs2.Material.setPbrMaterial(sunLight, {
        ...sunMaterial,
        albedoColor: sunAlbedo,
        emissiveColor: sunEmissive,
        emissiveIntensity: sunIntensity * 2
      });
      const ambientMaterial = import_ecs2.Material.get(ambientLight);
      let ambientAlbedo = import_math.Color4.create(0.4, 0.45, 0.5, 0.1);
      let ambientEmissive = import_math.Color4.create(0.4, 0.45, 0.5, 0.3);
      if (sunIntensity < 0.1) {
        ambientAlbedo = import_math.Color4.create(0.1, 0.15, 0.3, 0.1);
        ambientEmissive = import_math.Color4.create(0.1, 0.15, 0.3, 0.3);
      }
      import_ecs2.Material.setPbrMaterial(ambientLight, {
        ...ambientMaterial,
        albedoColor: ambientAlbedo,
        emissiveColor: ambientEmissive,
        emissiveIntensity: 0.3 + sunIntensity * 0.2
      });
    }
  }
  // Update volumetric lights with pulsing effect
  updateVolumetricLights() {
    this.volumetricLights.forEach((light, index) => {
      const time = this.timeOfDay * 2 + index * 0.5;
      const pulse = Math.sin(time) * 0.3 + 0.7;
      const material = import_ecs2.Material.get(light);
      import_ecs2.Material.setPbrMaterial(light, {
        ...material,
        emissiveIntensity: pulse * 5
      });
    });
  }
  // Create dynamic spotlight for events
  createEventSpotlight(position, color = import_math.Color3.create(1, 1, 1)) {
    const spotlight = import_ecs2.engine.addEntity();
    import_ecs2.Transform.create(spotlight, {
      position: import_math.Vector3.create(position.x, position.y + 5, position.z),
      rotation: import_math.Quaternion.fromEulerDegrees(90, 0, 0),
      scale: import_math.Vector3.create(2, 8, 2)
    });
    import_ecs2.MeshRenderer.setCylinder(spotlight);
    import_ecs2.Material.setPbrMaterial(spotlight, {
      albedoColor: import_math.Color4.create(color.r, color.g, color.b, 0.3),
      emissiveColor: import_math.Color4.create(color.r, color.g, color.b, 0.8),
      emissiveIntensity: 3
    });
    setTimeout(() => {
      import_ecs2.engine.removeEntity(spotlight);
    }, 5e3);
    return spotlight;
  }
  // Create emergency lighting
  createEmergencyLighting() {
    const emergencyPositions = [
      import_math.Vector3.create(1, 4, 1),
      import_math.Vector3.create(15, 4, 1),
      import_math.Vector3.create(1, 4, 15),
      import_math.Vector3.create(15, 4, 15)
    ];
    emergencyPositions.forEach((pos) => {
      const emergencyLight = import_ecs2.engine.addEntity();
      import_ecs2.Transform.create(emergencyLight, {
        position: pos,
        scale: import_math.Vector3.create(1, 1, 1)
      });
      import_ecs2.MeshRenderer.setBox(emergencyLight);
      import_ecs2.Material.setPbrMaterial(emergencyLight, {
        albedoColor: import_math.Color4.create(1, 0.2, 0.2, 0.8),
        emissiveColor: import_math.Color4.create(1, 0.2, 0.2, 1),
        emissiveIntensity: 4
      });
      import_ecs2.engine.addSystem(() => {
        const time = Date.now() / 200;
        const pulse = Math.sin(time) > 0 ? 1 : 0.2;
        const material = import_ecs2.Material.get(emergencyLight);
        import_ecs2.Material.setPbrMaterial(emergencyLight, {
          ...material,
          emissiveIntensity: pulse * 4
        });
      });
    });
  }
  // Cleanup lighting system
  cleanup() {
    this.lights.forEach((light) => {
      import_ecs2.engine.removeEntity(light);
    });
    this.shadowCasters.forEach((caster) => {
      import_ecs2.engine.removeEntity(caster);
    });
    this.volumetricLights.forEach((light) => {
      import_ecs2.engine.removeEntity(light);
    });
    this.lights.clear();
    this.shadowCasters = [];
    this.volumetricLights = [];
  }
};
var lightingSystem = new AdvancedLightingSystem();

// src/ai-npc-system.ts
var import_ecs4 = require("@dcl/sdk/ecs");
var import_math2 = require("@dcl/sdk/math");

// src/enhanced-sound.ts
var import_ecs3 = require("@dcl/sdk/ecs");
var SoundSystem = class {
  constructor() {
    this.audioSources = /* @__PURE__ */ new Map();
    this.masterVolume = 0.5;
  }
  // Initialize sound system
  initialize() {
    console.log("\u{1F50A} Sound System Initializing...");
    this.createAmbientSound();
    this.createInteractionSounds();
    console.log("\u{1F50A} Sound System Ready!");
  }
  // Create ambient background sound
  createAmbientSound() {
    const ambientSource = import_ecs3.engine.addEntity();
    import_ecs3.AudioSource.create(ambientSource, {
      playing: true,
      loop: true,
      volume: this.masterVolume * 0.3,
      audioClipUrl: "sounds/ambient-quantum.mp3"
    });
    this.audioSources.set("ambient", ambientSource);
  }
  // Create interaction sound effects
  createInteractionSounds() {
    const clickSource = import_ecs3.engine.addEntity();
    import_ecs3.AudioSource.create(clickSource, {
      playing: false,
      loop: false,
      volume: this.masterVolume * 0.8,
      audioClipUrl: "sounds/interface-click.mp3"
    });
    this.audioSources.set("click", clickSource);
    const alertSource = import_ecs3.engine.addEntity();
    import_ecs3.AudioSource.create(alertSource, {
      playing: false,
      loop: false,
      volume: this.masterVolume * 0.9,
      audioClipUrl: "sounds/alert-chime.mp3"
    });
    this.audioSources.set("alert", alertSource);
    const powerUpSource = import_ecs3.engine.addEntity();
    import_ecs3.AudioSource.create(powerUpSource, {
      playing: false,
      loop: false,
      volume: this.masterVolume * 0.7,
      audioClipUrl: "sounds/power-up.mp3"
    });
    this.audioSources.set("powerup", powerUpSource);
  }
  // Play specific sound
  playSound(soundName) {
    const source = this.audioSources.get(soundName);
    if (source) {
      const audioSource = import_ecs3.AudioSource.getMutable(source);
      audioSource.playing = true;
      if (!audioSource.loop) {
        setTimeout(() => {
          audioSource.playing = false;
        }, 1e3);
      }
    }
  }
  // Stop specific sound
  stopSound(soundName) {
    const source = this.audioSources.get(soundName);
    if (source) {
      import_ecs3.AudioSource.getMutable(source).playing = false;
    }
  }
  // Set master volume
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.audioSources.forEach((source, name) => {
      const audioSource = import_ecs3.AudioSource.getMutable(source);
      if (name === "ambient") {
        audioSource.volume = this.masterVolume * 0.3;
      } else {
        audioSource.volume = this.masterVolume * 0.8;
      }
    });
  }
  // Play interaction sound based on type
  playInteractionSound(type) {
    switch (type) {
      case "click":
        this.playSound("click");
        break;
      case "alert":
        this.playSound("alert");
        break;
      case "powerup":
        this.playSound("powerup");
        break;
      case "error":
        this.playSound("alert");
        break;
    }
  }
  // Cleanup sound system
  cleanup() {
    this.audioSources.forEach((source) => {
      import_ecs3.engine.removeEntity(source);
    });
    this.audioSources.clear();
  }
};
var soundSystem = new SoundSystem();

// src/ai-npc-system.ts
var NPCAssistant = class {
  constructor(name, role, position) {
    this.dialogueTree = /* @__PURE__ */ new Map();
    this.memory = /* @__PURE__ */ new Map();
    this.currentDialogue = "greeting";
    this.isProcessing = false;
    this.emotionalState = "neutral";
    this.name = name;
    this.role = role;
    this.createNPC(position);
    this.initializeDialogueTree();
    this.startAIProcessing();
  }
  createNPC(position) {
    this.entity = import_ecs4.engine.addEntity();
    import_ecs4.Transform.create(this.entity, {
      position,
      scale: import_math2.Vector3.create(1, 2, 1)
    });
    import_ecs4.MeshRenderer.setBox(this.entity);
    import_ecs4.Material.setPbrMaterial(this.entity, {
      albedoColor: import_math2.Color4.create(0.3, 0.5, 0.8, 1),
      roughness: 0.2,
      metallic: 0.3,
      emissiveColor: import_math2.Color4.create(0.1, 0.2, 0.4, 0.3),
      emissiveIntensity: 1
    });
    const head = import_ecs4.engine.addEntity();
    import_ecs4.Transform.create(head, {
      parent: this.entity,
      position: import_math2.Vector3.create(0, 1.2, 0),
      scale: import_math2.Vector3.create(0.8, 0.8, 0.8)
    });
    import_ecs4.MeshRenderer.setSphere(head);
    import_ecs4.Material.setPbrMaterial(head, {
      albedoColor: import_math2.Color4.create(0.9, 0.8, 0.7, 1),
      roughness: 0.1,
      metallic: 0.1
    });
    const nameTag = import_ecs4.engine.addEntity();
    import_ecs4.Transform.create(nameTag, {
      parent: this.entity,
      position: import_math2.Vector3.create(0, 2.5, 0),
      scale: import_math2.Vector3.create(0.5, 0.5, 0.5)
    });
    import_ecs4.TextShape.create(nameTag, {
      text: `${this.name}
${this.role}`,
      textColor: import_math2.Color4.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3,
      outlineWidth: 0.1,
      outlineColor: import_math2.Color4.create(0, 0, 0, 1)
    });
    import_ecs4.pointerEventsSystem.onPointerDown(
      {
        entity: this.entity,
        opts: {
          button: import_ecs4.InputAction.IA_POINTER,
          hoverText: `\u{1F916} Talk to ${this.name}`
        }
      },
      () => this.handleInteraction()
    );
  }
  initializeDialogueTree() {
    this.dialogueTree.set("greeting", {
      id: "greeting",
      text: `Saludos, Operador. Soy ${this.name}, tu ${this.role}. Mi n\xFAcleo cognitivo est\xE1 alineado con Daniela Sovereign. \xBFQu\xE9 par\xE1metros del Nexus deseas supervisar?`,
      responses: [
        "Estado del Sistema (Protocolo Soberano)",
        "Asistencia en Tareas Cr\xEDticas",
        "Capacidades de Inteligencia Neural",
        "Cerrar Sesi\xF3n"
      ],
      emotion: "happy"
    });
    this.dialogueTree.set("system_status", {
      id: "system_status",
      text: "Todos los sistemas operan bajo par\xE1metros nominales. El n\xFAcleo cu\xE1ntico est\xE1 estable al 98.7%. Protocolos de defensa activa nivel God Mode: ON.",
      responses: ["M\xE9tricas Detalladas", "Ejecutar Diagn\xF3stico Global", "Volver al Men\xFA"],
      emotion: "neutral"
    });
    this.dialogueTree.set("task_help", {
      id: "task_help",
      text: "Puedo optimizar flujos de trabajo, realizar an\xE1lisis predictivos y gestionar hilos de ejecuci\xF3n en el monorepo. \xBFCu\xE1l es tu objetivo prioritario?",
      responses: ["Monitoreo en Tiempo Real", "An\xE1lisis de Datos Nexus", "Auditor\xEDa de Seguridad"],
      emotion: "excited"
    });
    this.dialogueTree.set("capabilities", {
      id: "capabilities",
      text: "Mi arquitectura permite el procesamiento de lenguaje natural soberano, an\xE1lisis de redes neurales y orquestaci\xF3n de swarms. Estoy conectada directamente al Vault de Daniela.",
      responses: ["Mostrar Ejemplos", "Lecci\xF3n de Ingenier\xEDa Social", "Volver al Men\xFA"],
      emotion: "excited"
    });
    this.dialogueTree.set("detailed_metrics", {
      id: "detailed_metrics",
      text: "Current metrics: CPU usage at 42%, memory at 68%, network throughput at 1.2GB/s, and quantum coherence at 98.7%. All parameters within acceptable ranges.",
      responses: ["Show historical trends", "Export report", "Back to system status"],
      emotion: "neutral"
    });
    this.dialogueTree.set("farewell", {
      id: "farewell",
      text: "It was great assisting you! Feel free to return anytime. I'll be here monitoring the systems and learning from our interactions.",
      responses: [],
      emotion: "happy"
    });
  }
  async handleInteraction() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    soundSystem.playInteractionSound("click");
    const dialogue = this.dialogueTree.get(this.currentDialogue);
    if (!dialogue) {
      this.isProcessing = false;
      return;
    }
    await this.displayDialogueWithTyping(dialogue);
    this.updateEmotionalState(dialogue.emotion);
    this.showResponseOptions(dialogue.responses);
    this.isProcessing = false;
  }
  async displayDialogueWithTyping(dialogue) {
    const dialogueEntity = import_ecs4.engine.addEntity();
    import_ecs4.Transform.create(dialogueEntity, {
      position: import_math2.Vector3.create(8, 4, 8),
      scale: import_math2.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs4.TextShape.create(dialogueEntity, {
      text: "",
      textColor: import_math2.Color4.create(1, 1, 1, 1),
      fontSize: 4,
      textAlign: 3,
      outlineWidth: 0.1,
      outlineColor: import_math2.Color4.create(0, 0, 0, 1)
    });
    const fullText = `${this.name}: ${dialogue.text}`;
    let currentText = "";
    for (let i = 0; i <= fullText.length; i++) {
      currentText = fullText.substring(0, i);
      import_ecs4.TextShape.getMutable(dialogueEntity).text = currentText;
      await new Promise((resolve) => setTimeout(() => resolve(void 0), 50));
    }
    setTimeout(() => {
      import_ecs4.engine.removeEntity(dialogueEntity);
    }, 5e3);
  }
  showResponseOptions(responses) {
    responses.forEach((response, index) => {
      const responseEntity = import_ecs4.engine.addEntity();
      import_ecs4.Transform.create(responseEntity, {
        position: import_math2.Vector3.create(4 + index * 2, 3, 10),
        scale: import_math2.Vector3.create(0.2, 0.2, 0.2)
      });
      import_ecs4.TextShape.create(responseEntity, {
        text: `${index + 1}. ${response}`,
        textColor: import_math2.Color4.create(0.8, 0.8, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs4.pointerEventsSystem.onPointerDown(
        {
          entity: responseEntity,
          opts: {
            button: import_ecs4.InputAction.IA_POINTER,
            hoverText: response
          }
        },
        () => {
          this.handleResponse(index);
          import_ecs4.engine.removeEntity(responseEntity);
        }
      );
    });
  }
  handleResponse(responseIndex) {
    const dialogue = this.dialogueTree.get(this.currentDialogue);
    if (!dialogue || responseIndex >= dialogue.responses.length) return;
    const response = dialogue.responses[responseIndex];
    switch (response) {
      case "Estado del Sistema (Protocolo Soberano)":
      case "M\xE9tricas Detalladas":
        this.currentDialogue = "system_status";
        break;
      case "Asistencia en Tareas Cr\xEDticas":
        this.currentDialogue = "task_help";
        break;
      case "Capacidades de Inteligencia Neural":
        this.currentDialogue = "capabilities";
        break;
      case "Cerrar Sesi\xF3n":
        this.currentDialogue = "farewell";
        break;
      default:
        this.currentDialogue = "greeting";
    }
    setTimeout(() => {
      this.handleInteraction();
    }, 1e3);
  }
  updateEmotionalState(emotion) {
    this.emotionalState = emotion;
    const material = import_ecs4.Material.get(this.entity);
    let emissiveColor = import_math2.Color4.create(0.1, 0.2, 0.4, 0.3);
    let emissiveIntensity = 1;
    switch (emotion) {
      case "happy":
        emissiveColor = import_math2.Color4.create(0.2, 0.8, 0.2, 0.5);
        emissiveIntensity = 2;
        break;
      case "excited":
        emissiveColor = import_math2.Color4.create(1, 0.8, 0.2, 0.5);
        emissiveIntensity = 3;
        break;
      case "concerned":
        emissiveColor = import_math2.Color4.create(0.8, 0.2, 0.2, 0.5);
        emissiveIntensity = 1.5;
        break;
    }
    import_ecs4.Material.setPbrMaterial(this.entity, {
      ...material,
      emissiveColor,
      emissiveIntensity
    });
  }
  startAIProcessing() {
    import_ecs4.engine.addSystem(() => {
      if (Math.random() > 0.98) {
        const material = import_ecs4.Material.get(this.entity);
        import_ecs4.Material.setPbrMaterial(this.entity, {
          ...material,
          emissiveIntensity: 1 + Math.random() * 0.5
        });
      }
    });
  }
  // Advanced AI methods
  async processNaturalLanguage(input) {
    await new Promise((resolve) => setTimeout(() => resolve(void 0), 1e3));
    if (input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
      return `Hello! I'm ${this.name}. How can I help you today?`;
    } else if (input.toLowerCase().includes("status")) {
      return "All systems are operational. Would you like detailed metrics?";
    } else if (input.toLowerCase().includes("help")) {
      return "I can assist with system monitoring, data analysis, and security checks. What do you need?";
    } else {
      return "I understand you need assistance. Let me help you with that.";
    }
  }
  learnFromInteraction(playerId, topic) {
    if (!this.memory.has(playerId)) {
      this.memory.set(playerId, {
        playerName: playerId,
        lastInteraction: Date.now(),
        topics: [],
        preferences: []
      });
    }
    const playerMemory = this.memory.get(playerId);
    playerMemory.topics.push(topic);
    playerMemory.lastInteraction = Date.now();
  }
  getPersonalizedResponse(playerId) {
    const playerMemory = this.memory.get(playerId);
    if (!playerMemory) {
      return "Nice to meet you! I'm here to help with any questions or tasks.";
    }
    const timeSinceLastInteraction = Date.now() - playerMemory.lastInteraction;
    if (timeSinceLastInteraction < 6e4) {
      return "Welcome back! Is there anything else I can help you with?";
    } else {
      return `It's been a while! Last time we discussed ${playerMemory.topics[playerMemory.topics.length - 1]}. How can I assist you today?`;
    }
  }
  cleanup() {
    if (this.entity) {
      import_ecs4.engine.removeEntity(this.entity);
    }
  }
};
var NPCManager = class {
  constructor() {
    this.npcs = /* @__PURE__ */ new Map();
  }
  createNPC(name, role, position) {
    const npc = new NPCAssistant(name, role, position);
    this.npcs.set(name, npc);
    return npc;
  }
  getNPC(name) {
    return this.npcs.get(name);
  }
  getAllNPCs() {
    return Array.from(this.npcs.values());
  }
  cleanup() {
    this.npcs.forEach((npc) => npc.cleanup());
    this.npcs.clear();
  }
};
var npcManager = new NPCManager();

// src/analytics-dashboard.ts
var import_ecs5 = require("@dcl/sdk/ecs");
var import_math3 = require("@dcl/sdk/math");
var AnalyticsDashboardSystem = class {
  // 5 seconds
  constructor() {
    this.analyticsData = /* @__PURE__ */ new Map();
    this.widgets = /* @__PURE__ */ new Map();
    this.reports = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.realTimeData = [];
    this.maxRealTimeEvents = 1e3;
    this.dataRetentionDays = 30;
    this.refreshInterval = 5e3;
    this.initializeDataSources();
  }
  // Initialize analytics dashboard system
  initialize() {
    console.log("\u{1F4CA} Analytics Dashboard System Initializing...");
    this.createDashboardUI();
    this.createDefaultWidgets();
    this.createDefaultReports();
    this.startAnalyticsEngine();
    this.generateSampleData();
    this.isInitialized = true;
    console.log("\u{1F4CA} Analytics Dashboard System Ready!");
  }
  // Initialize data sources
  initializeDataSources() {
    console.log("\u{1F4E1} Initializing analytics data sources...");
  }
  // Create dashboard UI
  createDashboardUI() {
    this.dashboardUI = import_ecs5.engine.addEntity();
    import_ecs5.Transform.create(this.dashboardUI, {
      position: import_math3.Vector3.create(8, 4, 2),
      scale: import_math3.Vector3.create(6, 4, 0.1)
    });
    import_ecs5.MeshRenderer.setBox(this.dashboardUI);
    import_ecs5.Material.setPbrMaterial(this.dashboardUI, {
      albedoColor: import_math3.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math3.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs5.engine.addEntity();
    import_ecs5.Transform.create(title, {
      parent: this.dashboardUI,
      position: import_math3.Vector3.create(0, 1.7, 0.1),
      scale: import_math3.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs5.TextShape.create(title, {
      text: "\u{1F4CA} ANALYTICS DASHBOARD",
      textColor: import_math3.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createWidgetContainers();
    this.createControlPanel();
    this.createStatusBar();
  }
  // Create widget containers
  createWidgetContainers() {
    const mainChart = import_ecs5.engine.addEntity();
    import_ecs5.Transform.create(mainChart, {
      parent: this.dashboardUI,
      position: import_math3.Vector3.create(-1.5, 0.5, 0.1),
      scale: import_math3.Vector3.create(2.5, 1.5, 0.1)
    });
    import_ecs5.MeshRenderer.setBox(mainChart);
    import_ecs5.Material.setPbrMaterial(mainChart, {
      albedoColor: import_math3.Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: import_math3.Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const kpiArea = import_ecs5.engine.addEntity();
    import_ecs5.Transform.create(kpiArea, {
      parent: this.dashboardUI,
      position: import_math3.Vector3.create(1.5, 0.5, 0.1),
      scale: import_math3.Vector3.create(2.5, 1.5, 0.1)
    });
    import_ecs5.MeshRenderer.setBox(kpiArea);
    import_ecs5.Material.setPbrMaterial(kpiArea, {
      albedoColor: import_math3.Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: import_math3.Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const realtimeArea = import_ecs5.engine.addEntity();
    import_ecs5.Transform.create(realtimeArea, {
      parent: this.dashboardUI,
      position: import_math3.Vector3.create(0, -0.8, 0.1),
      scale: import_math3.Vector3.create(5, 0.8, 0.1)
    });
    import_ecs5.MeshRenderer.setBox(realtimeArea);
    import_ecs5.Material.setPbrMaterial(realtimeArea, {
      albedoColor: import_math3.Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: import_math3.Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
  }
  // Create control panel
  createControlPanel() {
    const controls = [
      { id: "refresh", icon: "\u{1F504}", name: "Refresh Data" },
      { id: "export", icon: "\u{1F4E4}", name: "Export Report" },
      { id: "settings", icon: "\u2699\uFE0F", name: "Settings" },
      { id: "fullscreen", icon: "\u{1F50D}", name: "Fullscreen" }
    ];
    let xOffset = -1.5;
    controls.forEach((control) => {
      const button = import_ecs5.engine.addEntity();
      import_ecs5.Transform.create(button, {
        parent: this.dashboardUI,
        position: import_math3.Vector3.create(xOffset, -1.5, 0.1),
        scale: import_math3.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs5.MeshRenderer.setBox(button);
      import_ecs5.Material.setPbrMaterial(button, {
        albedoColor: import_math3.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math3.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs5.engine.addEntity();
      import_ecs5.Transform.create(buttonText, {
        parent: button,
        position: import_math3.Vector3.create(0, 0, 0.1),
        scale: import_math3.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs5.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math3.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs5.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs5.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleControl(control.id)
      );
      xOffset += 0.8;
    });
  }
  // Create status bar
  createStatusBar() {
    const statusBar = import_ecs5.engine.addEntity();
    import_ecs5.Transform.create(statusBar, {
      parent: this.dashboardUI,
      position: import_math3.Vector3.create(0, -1.9, 0.1),
      scale: import_math3.Vector3.create(5.5, 0.2, 0.1)
    });
    import_ecs5.MeshRenderer.setBox(statusBar);
    import_ecs5.Material.setPbrMaterial(statusBar, {
      albedoColor: import_math3.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math3.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const statusText = import_ecs5.engine.addEntity();
    import_ecs5.Transform.create(statusText, {
      parent: statusBar,
      position: import_math3.Vector3.create(0, 0, 0.1),
      scale: import_math3.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs5.TextShape.create(statusText, {
      text: "\u{1F4CA} Last Update: Just Now | Events: 0",
      textColor: import_math3.Color4.create(1, 1, 1, 1),
      fontSize: 1.2,
      textAlign: 3
    });
  }
  // Create default widgets
  createDefaultWidgets() {
    const userActivityChart = {
      id: "widget_user_activity",
      type: "chart",
      title: "User Activity",
      position: import_math3.Vector3.create(-1.5, 0.5, 0.1),
      size: import_math3.Vector3.create(2.5, 1.5, 0.1),
      dataSource: "user_behavior",
      refreshInterval: 1e4,
      config: {
        chartType: "line",
        timeRange: "day",
        aggregation: "count",
        colors: [import_math3.Color3.create(0.2, 0.6, 1), import_math3.Color3.create(1, 0.6, 0.2)],
        showLegend: true,
        showGrid: true
      },
      isVisible: true
    };
    const systemPerformanceGauge = {
      id: "widget_system_performance",
      type: "gauge",
      title: "System Performance",
      position: import_math3.Vector3.create(1.5, 0.8, 0.1),
      size: import_math3.Vector3.create(1, 0.6, 0.1),
      dataSource: "system_performance",
      refreshInterval: 5e3,
      config: {
        timeRange: "hour",
        aggregation: "avg"
      },
      isVisible: true
    };
    const businessMetrics = {
      id: "widget_business_metrics",
      type: "metric",
      title: "Business Metrics",
      position: import_math3.Vector3.create(1.5, 0.2, 0.1),
      size: import_math3.Vector3.create(2.5, 0.6, 0.1),
      dataSource: "business_metrics",
      refreshInterval: 15e3,
      config: {
        timeRange: "week",
        aggregation: "sum"
      },
      isVisible: true
    };
    const realtimeEvents = {
      id: "widget_realtime_events",
      type: "realtime",
      title: "Real-time Events",
      position: import_math3.Vector3.create(0, -0.8, 0.1),
      size: import_math3.Vector3.create(5, 0.8, 0.1),
      dataSource: "realtime",
      refreshInterval: 1e3,
      config: {
        timeRange: "hour"
      },
      isVisible: true
    };
    this.widgets.set(userActivityChart.id, userActivityChart);
    this.widgets.set(systemPerformanceGauge.id, systemPerformanceGauge);
    this.widgets.set(businessMetrics.id, businessMetrics);
    this.widgets.set(realtimeEvents.id, realtimeEvents);
    console.log("\u{1F4C8} Default widgets created");
  }
  // Create default reports
  createDefaultReports() {
    const dailyReport = {
      id: "report_daily_performance",
      name: "Daily Performance Report",
      description: "Comprehensive daily performance metrics",
      category: "system_performance",
      widgets: ["widget_user_activity", "widget_system_performance"],
      schedule: {
        frequency: "daily",
        enabled: true,
        nextRun: Date.now() + 864e5,
        // Tomorrow
        timezone: "UTC"
      },
      recipients: ["admin@aigestion.com"],
      format: "pdf",
      isTemplate: false
    };
    const weeklyReport = {
      id: "report_weekly_business",
      name: "Weekly Business Report",
      description: "Weekly business metrics and KPIs",
      category: "business_metrics",
      widgets: ["widget_business_metrics"],
      schedule: {
        frequency: "weekly",
        enabled: true,
        nextRun: Date.now() + 6048e5,
        // Next week
        timezone: "UTC"
      },
      recipients: ["management@aigestion.com"],
      format: "html",
      isTemplate: false
    };
    this.reports.set(dailyReport.id, dailyReport);
    this.reports.set(weeklyReport.id, weeklyReport);
    console.log("\u{1F4CB} Default reports created");
  }
  // Start analytics engine
  startAnalyticsEngine() {
    import_ecs5.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateRealTimeData();
      this.refreshWidgets();
      this.processReports();
      this.cleanupOldData();
    });
  }
  // Generate sample data
  generateSampleData() {
    const categories = [
      "user_behavior",
      "system_performance",
      "business_metrics",
      "engagement"
    ];
    categories.forEach((category) => {
      const data = {
        id: `data_${category}_${Date.now()}`,
        timestamp: Date.now(),
        category,
        metrics: this.generateMetrics(category),
        dimensions: /* @__PURE__ */ new Map([
          ["platform", "web"],
          ["version", "1.0.0"],
          ["environment", "production"]
        ]),
        events: [],
        kpis: this.generateKPIs(category)
      };
      this.analyticsData.set(data.id, data);
    });
    for (let i = 0; i < 50; i++) {
      const event = {
        id: `event_${Date.now()}_${i}`,
        name: this.getRandomEventName(),
        category: this.getRandomEventCategory(),
        timestamp: Date.now() - Math.random() * 36e5,
        // Last hour
        userId: `user_${Math.floor(Math.random() * 100)}`,
        sessionId: `session_${Math.floor(Math.random() * 20)}`,
        properties: /* @__PURE__ */ new Map([
          ["action", this.getRandomAction()],
          ["page", this.getRandomPage()],
          ["duration", Math.floor(Math.random() * 300)]
        ]),
        value: Math.random() * 100
      };
      this.realTimeData.push(event);
    }
    console.log("\u{1F4CA} Sample analytics data generated");
  }
  // Generate metrics
  generateMetrics(category) {
    const metrics = /* @__PURE__ */ new Map();
    switch (category) {
      case "user_behavior":
        metrics.set("active_users", Math.floor(Math.random() * 1e3) + 500);
        metrics.set("page_views", Math.floor(Math.random() * 1e4) + 5e3);
        metrics.set("session_duration", Math.random() * 600 + 120);
        metrics.set("bounce_rate", Math.random() * 0.5 + 0.2);
        break;
      case "system_performance":
        metrics.set("cpu_usage", Math.random() * 80 + 10);
        metrics.set("memory_usage", Math.random() * 70 + 20);
        metrics.set("response_time", Math.random() * 500 + 100);
        metrics.set("error_rate", Math.random() * 5);
        break;
      case "business_metrics":
        metrics.set("revenue", Math.random() * 1e4 + 5e3);
        metrics.set("conversion_rate", Math.random() * 0.1 + 0.02);
        metrics.set("customer_acquisition", Math.floor(Math.random() * 100) + 50);
        metrics.set("retention_rate", Math.random() * 0.3 + 0.6);
        break;
      case "engagement":
        metrics.set("interaction_rate", Math.random() * 0.8 + 0.1);
        metrics.set("social_shares", Math.floor(Math.random() * 500) + 100);
        metrics.set("comments", Math.floor(Math.random() * 200) + 50);
        metrics.set("likes", Math.floor(Math.random() * 1e3) + 200);
        break;
    }
    return metrics;
  }
  // Generate KPIs
  generateKPIs(category) {
    const kpis = [];
    switch (category) {
      case "user_behavior":
        kpis.push({
          id: "kpi_daily_active_users",
          name: "Daily Active Users",
          value: Math.floor(Math.random() * 1e3) + 500,
          target: 1500,
          unit: "users",
          trend: Math.random() > 0.5 ? "up" : "down",
          change: (Math.random() - 0.5) * 20,
          status: "good"
        });
        break;
      case "system_performance":
        kpis.push({
          id: "kpi_uptime",
          name: "System Uptime",
          value: 99.5 + Math.random() * 0.5,
          target: 99.9,
          unit: "%",
          trend: "stable",
          change: 0.1,
          status: "good"
        });
        break;
      case "business_metrics":
        kpis.push({
          id: "kpi_monthly_revenue",
          name: "Monthly Revenue",
          value: Math.floor(Math.random() * 5e4) + 1e5,
          target: 2e5,
          unit: "$",
          trend: Math.random() > 0.3 ? "up" : "down",
          change: (Math.random() - 0.5) * 15,
          status: Math.random() > 0.2 ? "good" : "warning"
        });
        break;
    }
    return kpis;
  }
  // Get random event name
  getRandomEventName() {
    const events = [
      "page_view",
      "button_click",
      "form_submit",
      "video_play",
      "download",
      "login",
      "logout",
      "search",
      "filter",
      "sort",
      "share",
      "comment",
      "purchase",
      "add_to_cart",
      "checkout",
      "sign_up",
      "subscribe"
    ];
    return events[Math.floor(Math.random() * events.length)];
  }
  // Get random event category
  getRandomEventCategory() {
    const categories = ["navigation", "interaction", "conversion", "engagement", "error"];
    return categories[Math.floor(Math.random() * categories.length)];
  }
  // Get random action
  getRandomAction() {
    const actions = ["click", "hover", "scroll", "swipe", "tap", "drag", "drop"];
    return actions[Math.floor(Math.random() * actions.length)];
  }
  // Get random page
  getRandomPage() {
    const pages = [
      "/dashboard",
      "/profile",
      "/settings",
      "/analytics",
      "/reports",
      "/products",
      "/services",
      "/about",
      "/contact",
      "/help"
    ];
    return pages[Math.floor(Math.random() * pages.length)];
  }
  // Update real-time data
  updateRealTimeData() {
    if (Math.random() < 0.1) {
      const event = {
        id: `event_realtime_${Date.now()}_${Math.random()}`,
        name: this.getRandomEventName(),
        category: this.getRandomEventCategory(),
        timestamp: Date.now(),
        userId: `user_${Math.floor(Math.random() * 100)}`,
        sessionId: `session_${Math.floor(Math.random() * 20)}`,
        properties: /* @__PURE__ */ new Map([
          ["action", this.getRandomAction()],
          ["page", this.getRandomPage()]
        ]),
        value: Math.random() * 100
      };
      this.realTimeData.push(event);
      if (this.realTimeData.length > this.maxRealTimeEvents) {
        this.realTimeData = this.realTimeData.slice(-this.maxRealTimeEvents);
      }
    }
  }
  // Refresh widgets
  refreshWidgets() {
    this.widgets.forEach((widget, id) => {
      if (Date.now() - widget.refreshInterval < 0) return;
      this.updateWidgetData(widget);
    });
  }
  // Update widget data
  updateWidgetData(widget) {
    switch (widget.type) {
      case "chart":
        this.updateChartData(widget);
        break;
      case "gauge":
        this.updateGaugeData(widget);
        break;
      case "metric":
        this.updateMetricData(widget);
        break;
      case "realtime":
        this.updateRealtimeData(widget);
        break;
    }
  }
  // Update chart data
  updateChartData(widget) {
    console.log(`\u{1F4C8} Updating chart widget: ${widget.title}`);
  }
  // Update gauge data
  updateGaugeData(widget) {
    console.log(`\u{1F3AF} Updating gauge widget: ${widget.title}`);
  }
  // Update metric data
  updateMetricData(widget) {
    console.log(`\u{1F4CA} Updating metric widget: ${widget.title}`);
  }
  // Update real-time data widget
  updateRealtimeData(widget) {
    console.log(`\u26A1 Updating real-time widget: ${widget.title}`);
  }
  // Process reports
  processReports() {
    const now = Date.now();
    this.reports.forEach((report, id) => {
      if (report.schedule.enabled && now >= report.schedule.nextRun) {
        this.generateReport(report);
        report.schedule.nextRun = this.calculateNextRun(report.schedule);
      }
    });
  }
  // Generate report
  generateReport(report) {
    console.log(`\u{1F4CB} Generating report: ${report.name}`);
    const reportData = {
      reportId: report.id,
      reportName: report.name,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      widgets: report.widgets.map((widgetId) => {
        const widget = this.widgets.get(widgetId);
        return widget ? {
          id: widget.id,
          title: widget.title,
          data: this.getWidgetData(widget)
        } : null;
      }).filter(Boolean)
    };
    report.recipients.forEach((recipient) => {
      console.log(`\u{1F4E7} Sending report to: ${recipient}`);
    });
    soundSystem.playInteractionSound("powerup");
  }
  // Get widget data
  getWidgetData(widget) {
    const data = Array.from(this.analyticsData.values()).filter((d) => d.category === widget.dataSource).map((d) => ({
      timestamp: d.timestamp,
      metrics: Object.fromEntries(d.metrics),
      kpis: d.kpis
    }));
    return data;
  }
  // Calculate next run time
  calculateNextRun(schedule) {
    const now = Date.now();
    let nextRun = now;
    switch (schedule.frequency) {
      case "hourly":
        nextRun = now + 36e5;
        break;
      case "daily":
        nextRun = now + 864e5;
        break;
      case "weekly":
        nextRun = now + 6048e5;
        break;
      case "monthly":
        nextRun = now + 2592e6;
        break;
    }
    return nextRun;
  }
  // Clean up old data
  cleanupOldData() {
    const cutoffTime = Date.now() - this.dataRetentionDays * 24 * 60 * 60 * 1e3;
    this.analyticsData.forEach((data, id) => {
      if (data.timestamp < cutoffTime) {
        this.analyticsData.delete(id);
      }
    });
    this.realTimeData = this.realTimeData.filter((event) => event.timestamp > cutoffTime);
  }
  // Handle control
  handleControl(controlId) {
    switch (controlId) {
      case "refresh":
        this.refreshAllWidgets();
        break;
      case "export":
        this.exportData();
        break;
      case "settings":
        this.openSettings();
        break;
      case "fullscreen":
        this.toggleFullscreen();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Refresh all widgets
  refreshAllWidgets() {
    console.log("\u{1F504} Refreshing all widgets...");
    this.widgets.forEach((widget) => {
      this.updateWidgetData(widget);
    });
    soundSystem.playInteractionSound("powerup");
  }
  // Export data
  exportData() {
    console.log("\u{1F4E4} Exporting analytics data...");
    const exportData = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      analyticsData: Array.from(this.analyticsData.values()),
      widgets: Array.from(this.widgets.values()),
      realTimeEvents: this.realTimeData.slice(-100)
      // Last 100 events
    };
    console.log("\u{1F4CA} Data exported successfully");
    soundSystem.playInteractionSound("powerup");
  }
  // Open settings
  openSettings() {
    console.log("\u2699\uFE0F Opening analytics settings...");
    soundSystem.playInteractionSound("click");
  }
  // Toggle fullscreen
  toggleFullscreen() {
    console.log("\u{1F50D} Toggling fullscreen mode...");
    soundSystem.playInteractionSound("click");
  }
  // Track event
  trackEvent(event) {
    this.realTimeData.push(event);
    if (this.realTimeData.length > this.maxRealTimeEvents) {
      this.realTimeData = this.realTimeData.slice(-this.maxRealTimeEvents);
    }
    console.log(`\u{1F4CA} Tracked event: ${event.name}`);
  }
  // Get analytics data
  getAnalyticsData(category) {
    const data = Array.from(this.analyticsData.values());
    return category ? data.filter((d) => d.category === category) : data;
  }
  // Get real-time events
  getRealTimeEvents(limit) {
    return limit ? this.realTimeData.slice(-limit) : this.realTimeData;
  }
  // Get widgets
  getWidgets() {
    return Array.from(this.widgets.values());
  }
  // Get reports
  getReports() {
    return Array.from(this.reports.values());
  }
  // Add widget
  addWidget(widget) {
    this.widgets.set(widget.id, widget);
    console.log(`\u{1F4C8} Added widget: ${widget.title}`);
  }
  // Remove widget
  removeWidget(widgetId) {
    this.widgets.delete(widgetId);
    console.log(`\u{1F5D1}\uFE0F Removed widget: ${widgetId}`);
  }
  // Create custom report
  createReport(report) {
    const newReport = {
      ...report,
      id: `report_${Date.now()}_${Math.random()}`
    };
    this.reports.set(newReport.id, newReport);
    console.log(`\u{1F4CB} Created report: ${newReport.name}`);
    return newReport;
  }
  // Set data retention
  setDataRetentionDays(days) {
    this.dataRetentionDays = Math.max(1, days);
    console.log(`\u{1F4C5} Data retention set to: ${days} days`);
  }
  // Get system statistics
  getSystemStatistics() {
    return {
      totalAnalyticsData: this.analyticsData.size,
      totalWidgets: this.widgets.size,
      totalReports: this.reports.size,
      realTimeEvents: this.realTimeData.length,
      dataRetentionDays: this.dataRetentionDays,
      maxRealTimeEvents: this.maxRealTimeEvents,
      refreshInterval: this.refreshInterval
    };
  }
  // Cleanup system
  cleanup() {
    this.analyticsData.clear();
    this.widgets.clear();
    this.reports.clear();
    this.realTimeData = [];
    if (this.dashboardUI) {
      import_ecs5.engine.removeEntity(this.dashboardUI);
    }
    this.isInitialized = false;
  }
};
var analyticsDashboardSystem = new AnalyticsDashboardSystem();

// src/ar-integration.ts
var import_ecs6 = require("@dcl/sdk/ecs");
var import_math4 = require("@dcl/sdk/math");
var ARIntegrationSystem = class {
  constructor() {
    this.devices = /* @__PURE__ */ new Map();
    this.sessions = /* @__PURE__ */ new Map();
    this.overlays = /* @__PURE__ */ new Map();
    this.currentSession = null;
    this.isInitialized = false;
    this.initializeAREngine();
    this.initializeTrackingSystem();
    this.initializeRenderingSystem();
  }
  // Initialize AR system
  initialize() {
    console.log("\u{1F4F1} AR Integration System Initializing...");
    this.setupARDevices();
    this.createARUI();
    this.startAREngine();
    this.setupARInteractions();
    this.isInitialized = true;
    console.log("\u{1F4F1} AR Integration System Ready!");
  }
  // Initialize AR engine
  initializeAREngine() {
    this.arEngine = {
      isSupported: true,
      isInitialized: false,
      session: null,
      initialize: () => {
        console.log("\u{1F527} Initializing AR engine...");
        this.arEngine.isInitialized = true;
      },
      startSession: (device) => {
        console.log(`\u{1F680} Starting AR session on ${device.name}`);
        return {
          id: `session_${Date.now()}`,
          device,
          isActive: true
        };
      },
      stopSession: (sessionId) => {
        console.log(`\u{1F6D1} Stopping AR session: ${sessionId}`);
      }
    };
  }
  // Initialize tracking system
  initializeTrackingSystem() {
    this.trackingSystem = {
      isTracking: false,
      trackingQuality: "high",
      detectedAnchors: [],
      startTracking: () => {
        console.log("\u{1F3AF} Starting AR tracking...");
        this.trackingSystem.isTracking = true;
      },
      stopTracking: () => {
        console.log("\u{1F6D1} Stopping AR tracking...");
        this.trackingSystem.isTracking = false;
      },
      detectPlanes: () => {
        return [
          {
            id: "plane_floor",
            type: "horizontal",
            position: import_math4.Vector3.create(0, 0, 0),
            size: import_math4.Vector3.create(10, 0, 10)
          },
          {
            id: "plane_wall",
            type: "vertical",
            position: import_math4.Vector3.create(0, 2, -5),
            size: import_math4.Vector3.create(10, 4, 0)
          }
        ];
      },
      detectImages: () => {
        return [
          {
            id: "image_logo",
            position: import_math4.Vector3.create(2, 1, 0),
            confidence: 0.95
          }
        ];
      }
    };
  }
  // Initialize rendering system
  initializeRenderingSystem() {
    this.renderingSystem = {
      isRendering: false,
      frameRate: 60,
      resolution: { width: 1920, height: 1080 },
      startRendering: () => {
        console.log("\u{1F3A8} Starting AR rendering...");
        this.renderingSystem.isRendering = true;
      },
      stopRendering: () => {
        console.log("\u{1F6D1} Stopping AR rendering...");
        this.renderingSystem.isRendering = false;
      },
      renderFrame: (overlays) => {
        overlays.forEach((overlay) => {
          if (overlay.isVisible) {
            console.log(`\u{1F3A8} Rendering overlay: ${overlay.type}`);
          }
        });
      }
    };
  }
  // Setup AR devices
  setupARDevices() {
    const smartphone = {
      id: "device_smartphone",
      name: "Smartphone AR",
      type: "smartphone",
      isConnected: false,
      position: import_math4.Vector3.create(0, 0, 0),
      rotation: import_math4.Quaternion.fromEulerDegrees(0, 0, 0),
      camera: {
        fov: 60,
        aspectRatio: 16 / 9,
        nearPlane: 0.1,
        farPlane: 100,
        trackingMode: "world"
      },
      capabilities: {
        supportsPlaneDetection: true,
        supportsImageTracking: true,
        supportsFaceTracking: false,
        supportsOcclusion: true,
        supportsLightEstimation: true,
        maxAnchors: 20
      }
    };
    const tablet = {
      id: "device_tablet",
      name: "Tablet AR",
      type: "tablet",
      isConnected: false,
      position: import_math4.Vector3.create(0, 0, 0),
      rotation: import_math4.Quaternion.fromEulerDegrees(0, 0, 0),
      camera: {
        fov: 45,
        aspectRatio: 4 / 3,
        nearPlane: 0.1,
        farPlane: 100,
        trackingMode: "world"
      },
      capabilities: {
        supportsPlaneDetection: true,
        supportsImageTracking: true,
        supportsFaceTracking: false,
        supportsOcclusion: true,
        supportsLightEstimation: true,
        maxAnchors: 30
      }
    };
    const arGlasses = {
      id: "device_ar_glasses",
      name: "AR Glasses",
      type: "ar_glasses",
      isConnected: false,
      position: import_math4.Vector3.create(0, 0, 0),
      rotation: import_math4.Quaternion.fromEulerDegrees(0, 0, 0),
      camera: {
        fov: 50,
        aspectRatio: 16 / 9,
        nearPlane: 0.05,
        farPlane: 50,
        trackingMode: "world"
      },
      capabilities: {
        supportsPlaneDetection: true,
        supportsImageTracking: true,
        supportsFaceTracking: true,
        supportsOcclusion: true,
        supportsLightEstimation: true,
        maxAnchors: 50
      }
    };
    this.devices.set(smartphone.id, smartphone);
    this.devices.set(tablet.id, tablet);
    this.devices.set(arGlasses.id, arGlasses);
    console.log("\u{1F4F1} AR devices configured");
  }
  // Create AR UI
  createARUI() {
    this.arUI = import_ecs6.engine.addEntity();
    import_ecs6.Transform.create(this.arUI, {
      position: import_math4.Vector3.create(14, 3, 8),
      scale: import_math4.Vector3.create(3, 4, 0.1)
    });
    import_ecs6.MeshRenderer.setBox(this.arUI);
    import_ecs6.Material.setPbrMaterial(this.arUI, {
      albedoColor: import_math4.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math4.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs6.engine.addEntity();
    import_ecs6.Transform.create(title, {
      parent: this.arUI,
      position: import_math4.Vector3.create(0, 1.7, 0.1),
      scale: import_math4.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs6.TextShape.create(title, {
      text: "\u{1F4F1} AR OVERLAY SYSTEM",
      textColor: import_math4.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createDeviceSelection();
    this.createSessionControls();
    this.createOverlayControls();
    this.createStatusDisplay();
  }
  // Create device selection
  createDeviceSelection() {
    const deviceSection = import_ecs6.engine.addEntity();
    import_ecs6.Transform.create(deviceSection, {
      parent: this.arUI,
      position: import_math4.Vector3.create(0, 1.2, 0.1),
      scale: import_math4.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs6.MeshRenderer.setBox(deviceSection);
    import_ecs6.Material.setPbrMaterial(deviceSection, {
      albedoColor: import_math4.Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: import_math4.Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const deviceText = import_ecs6.engine.addEntity();
    import_ecs6.Transform.create(deviceText, {
      parent: deviceSection,
      position: import_math4.Vector3.create(0, 0, 0.1),
      scale: import_math4.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs6.TextShape.create(deviceText, {
      text: "\u{1F4F1} Select Device",
      textColor: import_math4.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
    let xOffset = -0.6;
    this.devices.forEach((device, id) => {
      const button = import_ecs6.engine.addEntity();
      import_ecs6.Transform.create(button, {
        parent: this.arUI,
        position: import_math4.Vector3.create(xOffset, 0.8, 0.1),
        scale: import_math4.Vector3.create(0.2, 0.2, 0.1)
      });
      import_ecs6.MeshRenderer.setBox(button);
      import_ecs6.Material.setPbrMaterial(button, {
        albedoColor: device.isConnected ? import_math4.Color4.create(0.2, 0.8, 0.2, 1) : import_math4.Color4.create(0.8, 0.2, 0.2, 1),
        emissiveColor: device.isConnected ? import_math4.Color4.create(0.2, 0.8, 0.2, 0.5) : import_math4.Color4.create(0.8, 0.2, 0.2, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs6.engine.addEntity();
      import_ecs6.Transform.create(buttonText, {
        parent: button,
        position: import_math4.Vector3.create(0, 0, 0.1),
        scale: import_math4.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs6.TextShape.create(buttonText, {
        text: device.type === "smartphone" ? "\u{1F4F1}" : device.type === "tablet" ? "\u{1F4F1}" : "\u{1F97D}",
        textColor: import_math4.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs6.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs6.InputAction.IA_POINTER, hoverText: device.name }
        },
        () => this.connectDevice(id)
      );
      xOffset += 0.6;
    });
  }
  // Create session controls
  createSessionControls() {
    const controls = [
      { id: "start", icon: "\u25B6\uFE0F", name: "Start Session" },
      { id: "stop", icon: "\u23F9\uFE0F", name: "Stop Session" },
      { id: "reset", icon: "\u{1F504}", name: "Reset Tracking" }
    ];
    let xOffset = -0.8;
    controls.forEach((control) => {
      const button = import_ecs6.engine.addEntity();
      import_ecs6.Transform.create(button, {
        parent: this.arUI,
        position: import_math4.Vector3.create(xOffset, 0.4, 0.1),
        scale: import_math4.Vector3.create(0.25, 0.25, 0.1)
      });
      import_ecs6.MeshRenderer.setBox(button);
      import_ecs6.Material.setPbrMaterial(button, {
        albedoColor: import_math4.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math4.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs6.engine.addEntity();
      import_ecs6.Transform.create(buttonText, {
        parent: button,
        position: import_math4.Vector3.create(0, 0, 0.1),
        scale: import_math4.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs6.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math4.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs6.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs6.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleSessionControl(control.id)
      );
      xOffset += 0.8;
    });
  }
  // Create overlay controls
  createOverlayControls() {
    const overlayTypes = [
      { id: "ui", icon: "\u{1F5BC}\uFE0F", name: "UI Overlay" },
      { id: "3d", icon: "\u{1F3AE}", name: "3D Model" },
      { id: "text", icon: "\u{1F4DD}", name: "Text" },
      { id: "data", icon: "\u{1F4CA}", name: "Data" }
    ];
    let xOffset = -0.9;
    overlayTypes.forEach((type) => {
      const button = import_ecs6.engine.addEntity();
      import_ecs6.Transform.create(button, {
        parent: this.arUI,
        position: import_math4.Vector3.create(xOffset, 0, 0.1),
        scale: import_math4.Vector3.create(0.2, 0.2, 0.1)
      });
      import_ecs6.MeshRenderer.setBox(button);
      import_ecs6.Material.setPbrMaterial(button, {
        albedoColor: import_math4.Color4.create(0.6, 0.3, 0.8, 1),
        emissiveColor: import_math4.Color4.create(0.6, 0.3, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs6.engine.addEntity();
      import_ecs6.Transform.create(buttonText, {
        parent: button,
        position: import_math4.Vector3.create(0, 0, 0.1),
        scale: import_math4.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs6.TextShape.create(buttonText, {
        text: type.icon,
        textColor: import_math4.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs6.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs6.InputAction.IA_POINTER, hoverText: type.name }
        },
        () => this.createOverlay(type.id)
      );
      xOffset += 0.6;
    });
  }
  // Create status display
  createStatusDisplay() {
    const statusDisplay = import_ecs6.engine.addEntity();
    import_ecs6.Transform.create(statusDisplay, {
      parent: this.arUI,
      position: import_math4.Vector3.create(0, -0.4, 0.1),
      scale: import_math4.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs6.MeshRenderer.setBox(statusDisplay);
    import_ecs6.Material.setPbrMaterial(statusDisplay, {
      albedoColor: import_math4.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math4.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const statusText = import_ecs6.engine.addEntity();
    import_ecs6.Transform.create(statusText, {
      parent: statusDisplay,
      position: import_math4.Vector3.create(0, 0, 0.1),
      scale: import_math4.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs6.TextShape.create(statusText, {
      text: "\u{1F4CA} Status: Ready",
      textColor: import_math4.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Start AR engine
  startAREngine() {
    this.arEngine.initialize();
    this.trackingSystem.startTracking();
    this.renderingSystem.startRendering();
    import_ecs6.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateARSession();
      this.processOverlays();
      this.updateTracking();
    });
  }
  // Setup AR interactions
  setupARInteractions() {
  }
  // Connect device
  connectDevice(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device) return;
    device.isConnected = true;
    console.log(`\u{1F4F1} Connected to ${device.name}`);
    this.startARSession(device);
    soundSystem.playInteractionSound("powerup");
  }
  // Disconnect device
  disconnectDevice(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device) return;
    device.isConnected = false;
    console.log(`\u{1F4F1} Disconnected from ${device.name}`);
    if (this.currentSession && this.currentSession.device.id === deviceId) {
      this.stopARSession();
    }
    soundSystem.playInteractionSound("click");
  }
  // Start AR session
  startARSession(device) {
    const sessionData = this.arEngine.startSession(device);
    const session = {
      id: sessionData.id,
      device,
      isActive: true,
      anchors: /* @__PURE__ */ new Map(),
      overlays: /* @__PURE__ */ new Map(),
      trackingQuality: "high",
      planeDetection: true,
      lightEstimation: true
    };
    this.sessions.set(session.id, session);
    this.currentSession = session;
    console.log(`\u{1F680} AR session started: ${session.id}`);
    this.startAnchorDetection();
  }
  // Stop AR session
  stopARSession() {
    if (!this.currentSession) return;
    this.arEngine.stopSession(this.currentSession.id);
    this.sessions.delete(this.currentSession.id);
    this.currentSession = null;
    console.log("\u{1F6D1} AR session stopped");
  }
  // Start anchor detection
  startAnchorDetection() {
    if (!this.currentSession) return;
    if (this.currentSession.device.capabilities.supportsPlaneDetection) {
      const planes = this.trackingSystem.detectPlanes();
      planes.forEach((plane) => {
        const anchor = {
          id: plane.id,
          type: "plane",
          position: plane.position,
          rotation: import_math4.Quaternion.fromEulerDegrees(0, 0, 0),
          confidence: 0.9,
          trackingState: "tracking"
        };
        this.currentSession.anchors.set(anchor.id, anchor);
      });
    }
    if (this.currentSession.device.capabilities.supportsImageTracking) {
      const images = this.trackingSystem.detectImages();
      images.forEach((image) => {
        const anchor = {
          id: image.id,
          type: "image",
          position: image.position,
          rotation: import_math4.Quaternion.fromEulerDegrees(0, 0, 0),
          confidence: image.confidence,
          trackingState: "tracking"
        };
        this.currentSession.anchors.set(anchor.id, anchor);
      });
    }
  }
  // Handle session control
  handleSessionControl(controlId) {
    switch (controlId) {
      case "start":
        if (this.currentSession) {
          console.log("\u{1F680} Session already active");
        } else {
          const firstDevice = Array.from(this.devices.values())[0];
          if (firstDevice) {
            this.connectDevice(firstDevice.id);
          }
        }
        break;
      case "stop":
        this.stopARSession();
        break;
      case "reset":
        this.resetTracking();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Create overlay
  createOverlay(type) {
    if (!this.currentSession) {
      console.log("\u274C No active AR session");
      return;
    }
    const overlay = {
      id: `overlay_${Date.now()}`,
      type,
      content: this.generateOverlayContent(type),
      position: import_math4.Vector3.create(Math.random() * 4 - 2, Math.random() * 2 + 1, Math.random() * 2 - 1),
      rotation: import_math4.Quaternion.fromEulerDegrees(0, Math.random() * 360, 0),
      scale: import_math4.Vector3.create(1, 1, 1),
      anchorType: "world",
      isVisible: true,
      isInteractive: true
    };
    this.overlays.set(overlay.id, overlay);
    this.currentSession.overlays.set(overlay.id, overlay);
    console.log(`\u{1F3A8} Created ${type} overlay: ${overlay.id}`);
    soundSystem.playInteractionSound("click");
  }
  // Generate overlay content
  generateOverlayContent(type) {
    switch (type) {
      case "ui":
        return {
          title: "AR UI Panel",
          elements: ["Button", "Slider", "Text"],
          layout: "vertical"
        };
      case "3d":
        return {
          model: "cube",
          material: "metallic",
          animations: ["rotate", "pulse"]
        };
      case "text":
        return {
          text: "Hello AR World!",
          fontSize: 24,
          color: "#FFFFFF",
          font: "Arial"
        };
      case "data":
        return {
          chartType: "bar",
          data: [10, 20, 30, 40, 50],
          labels: ["A", "B", "C", "D", "E"]
        };
      default:
        return {};
    }
  }
  // Update AR session
  updateARSession() {
    if (!this.currentSession) return;
    const time = Date.now() / 1e3;
    const quality = Math.sin(time * 0.5) > 0 ? "high" : "medium";
    this.currentSession.trackingQuality = quality;
    const device = this.currentSession.device;
    device.position = import_math4.Vector3.create(
      Math.sin(time * 0.3) * 0.5,
      Math.cos(time * 0.2) * 0.2,
      Math.sin(time * 0.4) * 0.3
    );
  }
  // Process overlays
  processOverlays() {
    if (!this.currentSession) return;
    const overlays = Array.from(this.currentSession.overlays.values());
    this.renderingSystem.renderFrame(overlays);
    overlays.forEach((overlay) => {
      if (overlay.isVisible) {
        const time = Date.now() / 1e3;
        const newY = overlay.position.y + Math.sin(time * 2 + parseInt(overlay.id)) * 1e-3;
        overlay.position = import_math4.Vector3.create(overlay.position.x, newY, overlay.position.z);
      }
    });
  }
  // Update tracking
  updateTracking() {
    if (!this.currentSession) return;
    this.currentSession.anchors.forEach((anchor) => {
      if (Math.random() < 0.01) {
        anchor.trackingState = anchor.trackingState === "tracking" ? "limited" : "tracking";
      }
    });
    if (Math.random() < 5e-3) {
      this.startAnchorDetection();
    }
  }
  // Reset tracking
  resetTracking() {
    if (!this.currentSession) return;
    console.log("\u{1F504} Resetting AR tracking...");
    this.currentSession.anchors.clear();
    this.startAnchorDetection();
    soundSystem.playInteractionSound("powerup");
  }
  // Get current session
  getCurrentSession() {
    return this.currentSession;
  }
  // Get all devices
  getDevices() {
    return Array.from(this.devices.values());
  }
  // Get connected devices
  getConnectedDevices() {
    return Array.from(this.devices.values()).filter((device) => device.isConnected);
  }
  // Get overlays
  getOverlays() {
    return Array.from(this.overlays.values());
  }
  // Update overlay visibility
  setOverlayVisibility(overlayId, isVisible) {
    const overlay = this.overlays.get(overlayId);
    if (overlay) {
      overlay.isVisible = isVisible;
      console.log(`\u{1F441}\uFE0F Overlay ${overlayId} ${isVisible ? "shown" : "hidden"}`);
    }
  }
  // Update overlay position
  updateOverlayPosition(overlayId, position) {
    const overlay = this.overlays.get(overlayId);
    if (overlay) {
      overlay.position = position;
      console.log(`\u{1F4CD} Moved overlay ${overlayId} to position`);
    }
  }
  // Remove overlay
  removeOverlay(overlayId) {
    const overlay = this.overlays.get(overlayId);
    if (overlay) {
      this.overlays.delete(overlayId);
      if (this.currentSession) {
        this.currentSession.overlays.delete(overlayId);
      }
      console.log(`\u{1F5D1}\uFE0F Removed overlay: ${overlayId}`);
    }
  }
  // Cleanup system
  cleanup() {
    this.stopARSession();
    this.devices.clear();
    this.sessions.clear();
    this.overlays.clear();
    if (this.arUI) {
      import_ecs6.engine.removeEntity(this.arUI);
    }
    this.trackingSystem.stopTracking();
    this.renderingSystem.stopRendering();
    this.isInitialized = false;
  }
};
var arIntegrationSystem = new ARIntegrationSystem();

// src/avatar-system.ts
var import_ecs7 = require("@dcl/sdk/ecs");
var import_math5 = require("@dcl/sdk/math");
var AvatarSystem = class {
  constructor() {
    this.avatarParts = /* @__PURE__ */ new Map();
    this.presets = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.currentAvatar = this.createDefaultAvatar();
    this.animationState = {
      currentAnimation: "idle",
      isPlaying: true,
      speed: 1,
      loop: true
    };
  }
  // Initialize avatar system
  initialize() {
    console.log("\u{1F464} Avatar System Initializing...");
    this.loadAvatarPresets();
    this.createAvatar();
    this.createCustomizationUI();
    this.setupAvatarAnimations();
    this.isInitialized = true;
    console.log("\u{1F464} Avatar System Ready!");
  }
  // Create default avatar
  createDefaultAvatar() {
    return {
      id: "default",
      name: "Default Avatar",
      bodyType: "humanoid",
      primaryColor: import_math5.Color3.create(0.3, 0.5, 0.8),
      secondaryColor: import_math5.Color3.create(0.8, 0.6, 0.2),
      accessories: [],
      animations: ["idle", "walk", "wave", "dance"],
      effects: [],
      scale: import_math5.Vector3.create(1, 2, 1),
      position: import_math5.Vector3.create(8, 1, 8)
    };
  }
  // Load avatar presets
  loadAvatarPresets() {
    const presets = [
      {
        id: "professional",
        name: "Professional",
        category: "professional",
        thumbnail: "\u{1F454}",
        customization: {
          id: "professional",
          name: "Professional Avatar",
          bodyType: "humanoid",
          primaryColor: import_math5.Color3.create(0.2, 0.3, 0.6),
          secondaryColor: import_math5.Color3.create(0.8, 0.8, 0.8),
          accessories: ["tie", "briefcase"],
          animations: ["idle", "walk", "type", "present"],
          effects: [],
          scale: import_math5.Vector3.create(1, 2, 1),
          position: import_math5.Vector3.create(8, 1, 8)
        }
      },
      {
        id: "cyberpunk",
        name: "Cyberpunk",
        category: "futuristic",
        thumbnail: "\u{1F916}",
        customization: {
          id: "cyberpunk",
          name: "Cyberpunk Avatar",
          bodyType: "cyborg",
          primaryColor: import_math5.Color3.create(0.8, 0.2, 0.8),
          secondaryColor: import_math5.Color3.create(0.2, 0.8, 0.8),
          accessories: ["helmet", "armor", "glowing-eyes"],
          animations: ["idle", "walk", "hack", "transform"],
          effects: [
            { type: "glow", intensity: 0.8, color: import_math5.Color3.create(0.8, 0.2, 0.8), enabled: true },
            {
              type: "particles",
              intensity: 0.5,
              color: import_math5.Color3.create(0.2, 0.8, 0.8),
              enabled: true
            }
          ],
          scale: import_math5.Vector3.create(1.1, 2.1, 1.1),
          position: import_math5.Vector3.create(8, 1, 8)
        }
      },
      {
        id: "energy",
        name: "Energy Being",
        category: "futuristic",
        thumbnail: "\u2728",
        customization: {
          id: "energy",
          name: "Energy Being",
          bodyType: "energy",
          primaryColor: import_math5.Color3.create(0.8, 0.8, 1),
          secondaryColor: import_math5.Color3.create(1, 0.8, 0.8),
          accessories: ["energy-orbs"],
          animations: ["idle", "float", "pulse", "teleport"],
          effects: [
            { type: "glow", intensity: 1, color: import_math5.Color3.create(0.8, 0.8, 1), enabled: true },
            { type: "particles", intensity: 0.8, color: import_math5.Color3.create(1, 0.8, 0.8), enabled: true },
            { type: "hologram", intensity: 0.6, color: import_math5.Color3.create(0.8, 1, 0.8), enabled: true }
          ],
          scale: import_math5.Vector3.create(0.9, 2.2, 0.9),
          position: import_math5.Vector3.create(8, 1, 8)
        }
      },
      {
        id: "artist",
        name: "Artist",
        category: "artistic",
        thumbnail: "\u{1F3A8}",
        customization: {
          id: "artist",
          name: "Artist Avatar",
          bodyType: "humanoid",
          primaryColor: import_math5.Color3.create(0.8, 0.4, 0.2),
          secondaryColor: import_math5.Color3.create(0.2, 0.8, 0.4),
          accessories: ["beret", "palette"],
          animations: ["idle", "walk", "paint", "dance"],
          effects: [
            {
              type: "particles",
              intensity: 0.3,
              color: import_math5.Color3.create(0.8, 0.4, 0.2),
              enabled: true
            }
          ],
          scale: import_math5.Vector3.create(1, 2, 1),
          position: import_math5.Vector3.create(8, 1, 8)
        }
      }
    ];
    presets.forEach((preset) => {
      this.presets.set(preset.id, preset);
    });
  }
  // Create avatar entity
  createAvatar() {
    this.avatarEntity = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(this.avatarEntity, {
      position: this.currentAvatar.position,
      scale: this.currentAvatar.scale,
      rotation: import_math5.Quaternion.fromEulerDegrees(0, 0, 0)
    });
    this.createAvatarBody();
    this.createAvatarAccessories();
    this.applyAvatarEffects();
  }
  // Create avatar body based on type
  createAvatarBody() {
    const body = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(body, {
      parent: this.avatarEntity,
      position: import_math5.Vector3.create(0, 0, 0),
      scale: import_math5.Vector3.create(0.8, 1.6, 0.4)
    });
    switch (this.currentAvatar.bodyType) {
      case "humanoid":
        import_ecs7.MeshRenderer.setBox(body);
        import_ecs7.Material.setPbrMaterial(body, {
          albedoColor: import_math5.Color4.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          roughness: 0.3,
          metallic: 0.1
        });
        break;
      case "robot":
        import_ecs7.MeshRenderer.setBox(body);
        import_ecs7.Material.setPbrMaterial(body, {
          albedoColor: import_math5.Color4.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          roughness: 0.1,
          metallic: 0.9,
          emissiveColor: import_math5.Color4.create(
            this.currentAvatar.primaryColor.r * 0.3,
            this.currentAvatar.primaryColor.g * 0.3,
            this.currentAvatar.primaryColor.b * 0.3,
            0.5
          ),
          emissiveIntensity: 2
        });
        break;
      case "cyborg":
        import_ecs7.MeshRenderer.setBox(body);
        import_ecs7.Material.setPbrMaterial(body, {
          albedoColor: import_math5.Color4.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          roughness: 0.2,
          metallic: 0.7,
          emissiveColor: import_math5.Color4.create(
            this.currentAvatar.secondaryColor.r * 0.5,
            this.currentAvatar.secondaryColor.g * 0.5,
            this.currentAvatar.secondaryColor.b * 0.5,
            0.6
          ),
          emissiveIntensity: 3
        });
        break;
      case "energy":
        import_ecs7.MeshRenderer.setSphere(body);
        import_ecs7.Material.setPbrMaterial(body, {
          albedoColor: import_math5.Color4.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            0.6
          ),
          roughness: 0,
          metallic: 1,
          emissiveColor: import_math5.Color4.create(
            this.currentAvatar.primaryColor.r,
            this.currentAvatar.primaryColor.g,
            this.currentAvatar.primaryColor.b,
            1
          ),
          emissiveIntensity: 5
        });
        break;
    }
    this.avatarParts.set("body", body);
    this.createAvatarHead();
  }
  // Create avatar head
  createAvatarHead() {
    const head = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(head, {
      parent: this.avatarEntity,
      position: import_math5.Vector3.create(0, 1.2, 0),
      scale: import_math5.Vector3.create(0.4, 0.4, 0.4)
    });
    if (this.currentAvatar.bodyType === "energy") {
      import_ecs7.MeshRenderer.setSphere(head);
    } else {
      import_ecs7.MeshRenderer.setBox(head);
    }
    import_ecs7.Material.setPbrMaterial(head, {
      albedoColor: import_math5.Color4.create(
        this.currentAvatar.secondaryColor.r,
        this.currentAvatar.secondaryColor.g,
        this.currentAvatar.secondaryColor.b,
        1
      ),
      roughness: 0.2,
      metallic: 0.1
    });
    this.avatarParts.set("head", head);
  }
  // Create avatar accessories
  createAvatarAccessories() {
    this.currentAvatar.accessories.forEach((accessory) => {
      this.createAccessory(accessory);
    });
  }
  // Create individual accessory
  createAccessory(accessory) {
    const accessoryEntity = import_ecs7.engine.addEntity();
    switch (accessory) {
      case "tie":
        import_ecs7.Transform.create(accessoryEntity, {
          parent: this.avatarEntity,
          position: import_math5.Vector3.create(0, 0.2, 0.21),
          scale: import_math5.Vector3.create(0.1, 0.8, 0.05)
        });
        import_ecs7.MeshRenderer.setBox(accessoryEntity);
        import_ecs7.Material.setPbrMaterial(accessoryEntity, {
          albedoColor: import_math5.Color4.create(0.8, 0.2, 0.2, 1),
          roughness: 0.1,
          metallic: 0.1
        });
        break;
      case "helmet":
        import_ecs7.Transform.create(accessoryEntity, {
          parent: this.avatarEntity,
          position: import_math5.Vector3.create(0, 1.6, 0),
          scale: import_math5.Vector3.create(0.5, 0.3, 0.5)
        });
        import_ecs7.MeshRenderer.setBox(accessoryEntity);
        import_ecs7.Material.setPbrMaterial(accessoryEntity, {
          albedoColor: import_math5.Color4.create(0.3, 0.3, 0.3, 1),
          roughness: 0.1,
          metallic: 0.9,
          emissiveColor: import_math5.Color4.create(0.2, 0.2, 0.8, 0.5),
          emissiveIntensity: 2
        });
        break;
      case "energy-orbs":
        for (let i = 0; i < 3; i++) {
          const orb = import_ecs7.engine.addEntity();
          import_ecs7.Transform.create(orb, {
            parent: this.avatarEntity,
            position: import_math5.Vector3.create(
              Math.cos(i * 120 * Math.PI / 180) * 0.8,
              1 + Math.sin(i * 120 * Math.PI / 180) * 0.3,
              Math.sin(i * 120 * Math.PI / 180) * 0.8
            ),
            scale: import_math5.Vector3.create(0.1, 0.1, 0.1)
          });
          import_ecs7.MeshRenderer.setSphere(orb);
          import_ecs7.Material.setPbrMaterial(orb, {
            albedoColor: import_math5.Color4.create(1, 0.8, 0.2, 0.8),
            emissiveColor: import_math5.Color4.create(1, 0.8, 0.2, 1),
            emissiveIntensity: 4
          });
          this.avatarParts.set(`orb_${i}`, orb);
        }
        break;
      case "beret":
        import_ecs7.Transform.create(accessoryEntity, {
          parent: this.avatarEntity,
          position: import_math5.Vector3.create(0, 1.45, 0),
          scale: import_math5.Vector3.create(0.5, 0.1, 0.5)
        });
        import_ecs7.MeshRenderer.setBox(accessoryEntity);
        import_ecs7.Material.setPbrMaterial(accessoryEntity, {
          albedoColor: import_math5.Color4.create(0.8, 0.2, 0.2, 1),
          roughness: 0.3,
          metallic: 0.1
        });
        break;
    }
    this.avatarParts.set(accessory, accessoryEntity);
  }
  // Apply avatar effects
  applyAvatarEffects() {
    this.currentAvatar.effects.forEach((effect) => {
      if (effect.enabled) {
        this.createEffect(effect);
      }
    });
  }
  // Create individual effect
  createEffect(effect) {
    switch (effect.type) {
      case "glow":
        this.createGlowEffect(effect);
        break;
      case "particles":
        this.createParticleEffect(effect);
        break;
      case "hologram":
        this.createHologramEffect(effect);
        break;
    }
  }
  // Create glow effect
  createGlowEffect(effect) {
    const glow = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(glow, {
      parent: this.avatarEntity,
      position: import_math5.Vector3.create(0, 1, 0),
      scale: import_math5.Vector3.create(1.5, 2.5, 1.5)
    });
    import_ecs7.MeshRenderer.setSphere(glow);
    import_ecs7.Material.setPbrMaterial(glow, {
      albedoColor: import_math5.Color4.create(effect.color.r, effect.color.g, effect.color.b, 0.3),
      emissiveColor: import_math5.Color4.create(effect.color.r, effect.color.g, effect.color.b, 0.8),
      emissiveIntensity: effect.intensity * 3
    });
    this.avatarParts.set("glow", glow);
  }
  // Create particle effect
  createParticleEffect(effect) {
    for (let i = 0; i < 20; i++) {
      const particle = import_ecs7.engine.addEntity();
      import_ecs7.Transform.create(particle, {
        parent: this.avatarEntity,
        position: import_math5.Vector3.create(
          (Math.random() - 0.5) * 2,
          Math.random() * 2,
          (Math.random() - 0.5) * 2
        ),
        scale: import_math5.Vector3.create(0.05, 0.05, 0.05)
      });
      import_ecs7.MeshRenderer.setSphere(particle);
      import_ecs7.Material.setPbrMaterial(particle, {
        albedoColor: import_math5.Color4.create(effect.color.r, effect.color.g, effect.color.b, 0.8),
        emissiveColor: import_math5.Color4.create(effect.color.r, effect.color.g, effect.color.b, 1),
        emissiveIntensity: effect.intensity * 2
      });
      this.avatarParts.set(`particle_${i}`, particle);
    }
  }
  // Create hologram effect
  createHologramEffect(effect) {
    const hologram = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(hologram, {
      parent: this.avatarEntity,
      position: import_math5.Vector3.create(0, 0, 0),
      scale: import_math5.Vector3.create(1.1, 2.1, 1.1)
    });
    import_ecs7.MeshRenderer.setBox(hologram);
    import_ecs7.Material.setPbrMaterial(hologram, {
      albedoColor: import_math5.Color4.create(effect.color.r, effect.color.g, effect.color.b, 0.2),
      emissiveColor: import_math5.Color4.create(effect.color.r, effect.color.g, effect.color.b, 0.6),
      emissiveIntensity: effect.intensity * 2
    });
    this.avatarParts.set("hologram", hologram);
  }
  // Create customization UI
  createCustomizationUI() {
    const uiPanel = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(uiPanel, {
      position: import_math5.Vector3.create(14, 3, 8),
      scale: import_math5.Vector3.create(3, 4, 0.1)
    });
    import_ecs7.MeshRenderer.setBox(uiPanel);
    import_ecs7.Material.setPbrMaterial(uiPanel, {
      albedoColor: import_math5.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math5.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(title, {
      parent: uiPanel,
      position: import_math5.Vector3.create(0, 1.7, 0.1),
      scale: import_math5.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs7.TextShape.create(title, {
      text: "\u{1F464} AVATAR CUSTOMIZE",
      textColor: import_math5.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createPresetButtons(uiPanel);
    this.createColorCustomization(uiPanel);
    this.createEffectToggles(uiPanel);
    this.customizationUI = uiPanel;
  }
  // Create preset buttons
  createPresetButtons(parent) {
    let yOffset = 1.2;
    this.presets.forEach((preset, index) => {
      const button = import_ecs7.engine.addEntity();
      import_ecs7.Transform.create(button, {
        parent,
        position: import_math5.Vector3.create(0, yOffset, 0.1),
        scale: import_math5.Vector3.create(0.4, 0.3, 0.1)
      });
      import_ecs7.MeshRenderer.setBox(button);
      import_ecs7.Material.setPbrMaterial(button, {
        albedoColor: import_math5.Color4.create(0.2, 0.6, 0.8, 1),
        emissiveColor: import_math5.Color4.create(0.2, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs7.engine.addEntity();
      import_ecs7.Transform.create(buttonText, {
        parent: button,
        position: import_math5.Vector3.create(0, 0, 0.1),
        scale: import_math5.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs7.TextShape.create(buttonText, {
        text: `${preset.thumbnail} ${preset.name}`,
        textColor: import_math5.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs7.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs7.InputAction.IA_POINTER, hoverText: `Select ${preset.name}` }
        },
        () => this.applyPreset(preset.id)
      );
      yOffset -= 0.4;
    });
  }
  // Create color customization
  createColorCustomization(parent) {
    const colorPanel = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(colorPanel, {
      parent,
      position: import_math5.Vector3.create(0, -0.5, 0.1),
      scale: import_math5.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs7.MeshRenderer.setBox(colorPanel);
    import_ecs7.Material.setPbrMaterial(colorPanel, {
      albedoColor: import_math5.Color4.create(0.3, 0.3, 0.3, 0.8),
      emissiveColor: import_math5.Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const colorText = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(colorText, {
      parent: colorPanel,
      position: import_math5.Vector3.create(0, 0, 0.1),
      scale: import_math5.Vector3.create(0.5, 0.5, 0.5)
    });
    import_ecs7.TextShape.create(colorText, {
      text: "\u{1F3A8} COLORS",
      textColor: import_math5.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create effect toggles
  createEffectToggles(parent) {
    const effectPanel = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(effectPanel, {
      parent,
      position: import_math5.Vector3.create(0, -1.2, 0.1),
      scale: import_math5.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs7.MeshRenderer.setBox(effectPanel);
    import_ecs7.Material.setPbrMaterial(effectPanel, {
      albedoColor: import_math5.Color4.create(0.3, 0.3, 0.3, 0.8),
      emissiveColor: import_math5.Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const effectText = import_ecs7.engine.addEntity();
    import_ecs7.Transform.create(effectText, {
      parent: effectPanel,
      position: import_math5.Vector3.create(0, 0, 0.1),
      scale: import_math5.Vector3.create(0.5, 0.5, 0.5)
    });
    import_ecs7.TextShape.create(effectText, {
      text: "\u2728 EFFECTS",
      textColor: import_math5.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Setup avatar animations
  setupAvatarAnimations() {
    import_ecs7.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateAnimations();
      this.updateEffects();
    });
  }
  // Update animations
  updateAnimations() {
    if (!this.animationState.isPlaying) return;
    const time = Date.now() / 1e3;
    const body = this.avatarParts.get("body");
    if (body) {
      switch (this.animationState.currentAnimation) {
        case "idle":
          const idleBob = Math.sin(time * 2) * 0.02;
          const transform = import_ecs7.Transform.getMutable(body);
          transform.position.y = idleBob;
          break;
        case "walk":
          const walkBob = Math.abs(Math.sin(time * 4)) * 0.05;
          const walkTransform = import_ecs7.Transform.getMutable(body);
          walkTransform.position.y = walkBob;
          walkTransform.rotation = import_math5.Quaternion.fromEulerDegrees(Math.sin(time * 4) * 5, 0, 0);
          break;
        case "dance":
          const danceTransform = import_ecs7.Transform.getMutable(body);
          danceTransform.rotation = import_math5.Quaternion.fromEulerDegrees(
            Math.sin(time * 3) * 10,
            Math.cos(time * 2) * 15,
            Math.sin(time * 4) * 5
          );
          break;
        case "float":
          const floatTransform = import_ecs7.Transform.getMutable(body);
          floatTransform.position.y = Math.sin(time * 1.5) * 0.1;
          break;
      }
    }
  }
  // Update effects
  updateEffects() {
    this.avatarParts.forEach((part, key) => {
      if (key.startsWith("particle_")) {
        const time = Date.now() / 1e3;
        const transform = import_ecs7.Transform.getMutable(part);
        transform.position.y += Math.sin(time + parseInt(key.split("_")[1])) * 0.01;
      }
      if (key.startsWith("orb_")) {
        const time = Date.now() / 1e3;
        const index = parseInt(key.split("_")[1]);
        const radius = 0.8 + Math.sin(time * 2 + index * 120 * Math.PI / 180) * 0.2;
        const transform = import_ecs7.Transform.getMutable(part);
        transform.position.x = Math.cos(time + index * 120 * Math.PI / 180) * radius;
        transform.position.z = Math.sin(time + index * 120 * Math.PI / 180) * radius;
      }
    });
  }
  // Apply preset
  applyPreset(presetId) {
    const preset = this.presets.get(presetId);
    if (!preset) return;
    console.log(`\u{1F464} Applying preset: ${preset.name}`);
    soundSystem.playInteractionSound("powerup");
    this.clearCurrentAvatar();
    this.currentAvatar = { ...preset.customization };
    this.createAvatar();
  }
  // Clear current avatar
  clearCurrentAvatar() {
    this.avatarParts.forEach((part) => {
      import_ecs7.engine.removeEntity(part);
    });
    this.avatarParts.clear();
  }
  // Play animation
  playAnimation(animationName) {
    if (this.currentAvatar.animations.includes(animationName)) {
      this.animationState.currentAnimation = animationName;
      this.animationState.isPlaying = true;
      console.log(`\u{1F3AC} Playing animation: ${animationName}`);
    }
  }
  // Stop animation
  stopAnimation() {
    this.animationState.isPlaying = false;
  }
  // Get current avatar customization
  getCurrentAvatar() {
    return { ...this.currentAvatar };
  }
  // Get available presets
  getAvailablePresets() {
    return Array.from(this.presets.values());
  }
  // Customize avatar colors
  customizeColors(primaryColor, secondaryColor) {
    this.currentAvatar.primaryColor = primaryColor;
    this.currentAvatar.secondaryColor = secondaryColor;
    const body = this.avatarParts.get("body");
    if (body) {
      const material = import_ecs7.Material.get(body);
      import_ecs7.Material.setPbrMaterial(body, {
        ...material,
        albedoColor: import_math5.Color4.create(primaryColor.r, primaryColor.g, primaryColor.b, 1)
      });
    }
    const head = this.avatarParts.get("head");
    if (head) {
      const material = import_ecs7.Material.get(head);
      import_ecs7.Material.setPbrMaterial(head, {
        ...material,
        albedoColor: import_math5.Color4.create(secondaryColor.r, secondaryColor.g, secondaryColor.b, 1)
      });
    }
  }
  // Add accessory
  addAccessory(accessory) {
    if (!this.currentAvatar.accessories.includes(accessory)) {
      this.currentAvatar.accessories.push(accessory);
      this.createAccessory(accessory);
      soundSystem.playInteractionSound("click");
    }
  }
  // Remove accessory
  removeAccessory(accessory) {
    const index = this.currentAvatar.accessories.indexOf(accessory);
    if (index > -1) {
      this.currentAvatar.accessories.splice(index, 1);
      const part = this.avatarParts.get(accessory);
      if (part) {
        import_ecs7.engine.removeEntity(part);
        this.avatarParts.delete(accessory);
      }
      soundSystem.playInteractionSound("click");
    }
  }
  // Toggle effect
  toggleEffect(effectType) {
    const effect = this.currentAvatar.effects.find((e) => e.type === effectType);
    if (effect) {
      effect.enabled = !effect.enabled;
      if (effect.enabled) {
        this.createEffect(effect);
      } else {
        this.avatarParts.forEach((part, key) => {
          if (key.startsWith(effectType)) {
            import_ecs7.engine.removeEntity(part);
            this.avatarParts.delete(key);
          }
        });
      }
      soundSystem.playInteractionSound("click");
    }
  }
  // Cleanup system
  cleanup() {
    this.clearCurrentAvatar();
    if (this.avatarEntity) {
      import_ecs7.engine.removeEntity(this.avatarEntity);
    }
    if (this.customizationUI) {
      import_ecs7.engine.removeEntity(this.customizationUI);
    }
    this.presets.clear();
    this.isInitialized = false;
  }
};
var avatarSystem = new AvatarSystem();

// src/blockchain-integration.ts
var import_ecs8 = require("@dcl/sdk/ecs");
var import_math6 = require("@dcl/sdk/math");
var BlockchainIntegrationSystem = class {
  constructor() {
    this.wallets = /* @__PURE__ */ new Map();
    this.assets = /* @__PURE__ */ new Map();
    this.transactions = /* @__PURE__ */ new Map();
    this.contracts = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.currentWallet = null;
    this.supportedChains = ["ethereum", "polygon", "arbitrum", "optimism"];
    this.gasPrices = /* @__PURE__ */ new Map();
    this.initializeGasPrices();
  }
  // Initialize blockchain system
  initialize() {
    console.log("\u26D3\uFE0F Blockchain Integration System Initializing...");
    this.setupSmartContracts();
    this.createBlockchainUI();
    this.createDefaultWallet();
    this.initializeBlockchainConnection();
    this.startBlockchainEngine();
    this.isInitialized = true;
    console.log("\u26D3\uFE0F Blockchain Integration System Ready!");
  }
  // Initialize gas prices
  initializeGasPrices() {
    this.gasPrices.set("ethereum", 20);
    this.gasPrices.set("polygon", 30);
    this.gasPrices.set("arbitrum", 0.1);
    this.gasPrices.set("optimism", 0.1);
  }
  // Setup smart contracts
  setupSmartContracts() {
    this.contracts.set("asset_registry", {
      id: "asset_registry",
      name: "Asset Registry",
      address: "0x1234567890123456789012345678901234567890",
      abi: [],
      functions: /* @__PURE__ */ new Map([
        [
          "mintAsset",
          {
            name: "mintAsset",
            inputs: [
              { name: "to", type: "address" },
              { name: "uri", type: "string" }
            ],
            outputs: [{ name: "tokenId", type: "uint256" }],
            isPayable: false,
            isView: false
          }
        ],
        [
          "transferAsset",
          {
            name: "transferAsset",
            inputs: [
              { name: "from", type: "address" },
              { name: "to", type: "address" },
              { name: "tokenId", type: "uint256" }
            ],
            outputs: [],
            isPayable: false,
            isView: false
          }
        ]
      ]),
      isActive: true
    });
    this.contracts.set("certificate", {
      id: "certificate",
      name: "Certificate Registry",
      address: "0x2345678901234567890123456789012345678901",
      abi: [],
      functions: /* @__PURE__ */ new Map([
        [
          "issueCertificate",
          {
            name: "issueCertificate",
            inputs: [
              { name: "recipient", type: "address" },
              { name: "metadata", type: "string" }
            ],
            outputs: [{ name: "certificateId", type: "uint256" }],
            isPayable: false,
            isView: false
          }
        ],
        [
          "verifyCertificate",
          {
            name: "verifyCertificate",
            inputs: [{ name: "certificateId", type: "uint256" }],
            outputs: [{ name: "isValid", type: "bool" }],
            isPayable: false,
            isView: true
          }
        ]
      ]),
      isActive: true
    });
    this.contracts.set("badge", {
      id: "badge",
      name: "Achievement Badges",
      address: "0x3456789012345678901234567890123456789012",
      abi: [],
      functions: /* @__PURE__ */ new Map([
        [
          "awardBadge",
          {
            name: "awardBadge",
            inputs: [
              { name: "user", type: "address" },
              { name: "badgeType", type: "uint256" }
            ],
            outputs: [],
            isPayable: false,
            isView: false
          }
        ],
        [
          "getUserBadges",
          {
            name: "getUserBadges",
            inputs: [{ name: "user", type: "address" }],
            outputs: [{ name: "badgeIds", type: "uint256[]" }],
            isPayable: false,
            isView: true
          }
        ]
      ]),
      isActive: true
    });
  }
  // Create blockchain UI
  createBlockchainUI() {
    this.blockchainUI = import_ecs8.engine.addEntity();
    import_ecs8.Transform.create(this.blockchainUI, {
      position: import_math6.Vector3.create(2, 3, 8),
      scale: import_math6.Vector3.create(3, 4, 0.1)
    });
    import_ecs8.MeshRenderer.setBox(this.blockchainUI);
    import_ecs8.Material.setPbrMaterial(this.blockchainUI, {
      albedoColor: import_math6.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math6.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs8.engine.addEntity();
    import_ecs8.Transform.create(title, {
      parent: this.blockchainUI,
      position: import_math6.Vector3.create(0, 1.7, 0.1),
      scale: import_math6.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs8.TextShape.create(title, {
      text: "\u26D3\uFE0F BLOCKCHAIN ASSETS",
      textColor: import_math6.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createWalletSection();
    this.createAssetsSection();
    this.createTransactionsSection();
    this.createBlockchainControls();
  }
  // Create wallet section
  createWalletSection() {
    const walletSection = import_ecs8.engine.addEntity();
    import_ecs8.Transform.create(walletSection, {
      parent: this.blockchainUI,
      position: import_math6.Vector3.create(0, 1.2, 0.1),
      scale: import_math6.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs8.MeshRenderer.setBox(walletSection);
    import_ecs8.Material.setPbrMaterial(walletSection, {
      albedoColor: import_math6.Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: import_math6.Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const walletText = import_ecs8.engine.addEntity();
    import_ecs8.Transform.create(walletText, {
      parent: walletSection,
      position: import_math6.Vector3.create(0, 0, 0.1),
      scale: import_math6.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs8.TextShape.create(walletText, {
      text: "\u{1F45B} WALLET: Not Connected",
      textColor: import_math6.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create assets section
  createAssetsSection() {
    const assetsSection = import_ecs8.engine.addEntity();
    import_ecs8.Transform.create(assetsSection, {
      parent: this.blockchainUI,
      position: import_math6.Vector3.create(0, 0.5, 0.1),
      scale: import_math6.Vector3.create(0.8, 0.4, 0.1)
    });
    import_ecs8.MeshRenderer.setBox(assetsSection);
    import_ecs8.Material.setPbrMaterial(assetsSection, {
      albedoColor: import_math6.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math6.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const assetsText = import_ecs8.engine.addEntity();
    import_ecs8.Transform.create(assetsText, {
      parent: assetsSection,
      position: import_math6.Vector3.create(0, 0.1, 0.1),
      scale: import_math6.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs8.TextShape.create(assetsText, {
      text: "\u{1F3A8} ASSETS: 0",
      textColor: import_math6.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create transactions section
  createTransactionsSection() {
    const transactionsSection = import_ecs8.engine.addEntity();
    import_ecs8.Transform.create(transactionsSection, {
      parent: this.blockchainUI,
      position: import_math6.Vector3.create(0, -0.2, 0.1),
      scale: import_math6.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs8.MeshRenderer.setBox(transactionsSection);
    import_ecs8.Material.setPbrMaterial(transactionsSection, {
      albedoColor: import_math6.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math6.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const transactionsText = import_ecs8.engine.addEntity();
    import_ecs8.Transform.create(transactionsText, {
      parent: transactionsSection,
      position: import_math6.Vector3.create(0, 0, 0.1),
      scale: import_math6.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs8.TextShape.create(transactionsText, {
      text: "\u{1F4CA} TRANSACTIONS: 0",
      textColor: import_math6.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create blockchain controls
  createBlockchainControls() {
    const controls = [
      { id: "connect", icon: "\u{1F517}", name: "Connect Wallet" },
      { id: "mint", icon: "\u{1F3A8}", name: "Mint Asset" },
      { id: "transfer", icon: "\u{1F4B8}", name: "Transfer" },
      { id: "verify", icon: "\u2705", name: "Verify" }
    ];
    let xOffset = -0.9;
    controls.forEach((control) => {
      const button = import_ecs8.engine.addEntity();
      import_ecs8.Transform.create(button, {
        parent: this.blockchainUI,
        position: import_math6.Vector3.create(xOffset, -0.7, 0.1),
        scale: import_math6.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs8.MeshRenderer.setBox(button);
      import_ecs8.Material.setPbrMaterial(button, {
        albedoColor: import_math6.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math6.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs8.engine.addEntity();
      import_ecs8.Transform.create(buttonText, {
        parent: button,
        position: import_math6.Vector3.create(0, 0, 0.1),
        scale: import_math6.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs8.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math6.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs8.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs8.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleBlockchainControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  // Create default wallet
  createDefaultWallet() {
    const wallet = {
      id: "wallet_default",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      chain: "ethereum",
      balance: /* @__PURE__ */ new Map([
        ["ETH", 2.5],
        ["USDC", 1e3],
        ["AIG", 500]
      ]),
      assets: [],
      isConnected: false,
      permissions: ["read", "write", "admin"]
    };
    this.wallets.set(wallet.id, wallet);
    console.log("\u{1F45B} Default wallet created");
  }
  // Initialize blockchain connection
  initializeBlockchainConnection() {
    console.log("\u{1F517} Initializing blockchain connections...");
    this.supportedChains.forEach((chain) => {
      console.log(`\u{1F4E1} Connected to ${chain}`);
    });
  }
  // Start blockchain engine
  startBlockchainEngine() {
    import_ecs8.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateBlockchainUI();
      this.simulateBlockchainActivity();
      this.updateGasPrices();
    });
  }
  // Handle blockchain control
  handleBlockchainControl(controlId) {
    switch (controlId) {
      case "connect":
        this.connectWallet();
        break;
      case "mint":
        this.mintAsset();
        break;
      case "transfer":
        this.transferAsset();
        break;
      case "verify":
        this.verifyAsset();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Connect wallet
  connectWallet() {
    if (this.currentWallet && this.currentWallet.isConnected) {
      console.log("\u{1F45B} Wallet already connected");
      return;
    }
    const wallet = this.wallets.get("wallet_default");
    if (!wallet) return;
    wallet.isConnected = true;
    this.currentWallet = wallet;
    console.log("\u{1F517} Wallet connected successfully");
    console.log(`\u{1F4CD} Address: ${wallet.address}`);
    console.log(`\u26D3\uFE0F Chain: ${wallet.chain}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Disconnect wallet
  disconnectWallet() {
    if (!this.currentWallet) return;
    this.currentWallet.isConnected = false;
    console.log("\u{1F50C} Wallet disconnected");
    soundSystem.playInteractionSound("click");
  }
  // Mint asset
  mintAsset() {
    if (!this.currentWallet || !this.currentWallet.isConnected) {
      console.log("\u274C Please connect wallet first");
      return;
    }
    const asset = {
      id: `asset_${Date.now()}`,
      name: `AIG Asset #${this.assets.size + 1}`,
      type: "nft",
      blockchain: this.currentWallet.chain,
      contractAddress: this.contracts.get("asset_registry")?.address || "",
      tokenId: (this.assets.size + 1).toString(),
      owner: this.currentWallet.address,
      metadata: {
        description: "AIGestion Virtual Office Asset",
        image: "ipfs://QmHash...",
        attributes: /* @__PURE__ */ new Map([
          ["created_by", "AIGestion"],
          ["office_space", "virtual"],
          ["utility", "productivity"]
        ]),
        rarity: "rare",
        category: "office",
        creator: "AIGestion",
        royalties: 2.5
      },
      value: 0.1,
      currency: "ETH",
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    };
    this.assets.set(asset.id, asset);
    this.currentWallet.assets.push(asset);
    const transaction = {
      id: `tx_${Date.now()}`,
      type: "mint",
      from: "0x0000000000000000000000000000000000000000",
      to: this.currentWallet.address,
      asset,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet.chain) || 20,
      status: "confirmed",
      timestamp: Date.now(),
      blockNumber: 12345678
    };
    this.transactions.set(transaction.id, transaction);
    console.log(`\u{1F3A8} Minted new asset: ${asset.name}`);
    console.log(`\u{1F194} Token ID: ${asset.tokenId}`);
    console.log(`\u{1F4B0} Value: ${asset.value} ${asset.currency}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Transfer asset
  transferAsset() {
    if (!this.currentWallet || !this.currentWallet.isConnected) {
      console.log("\u274C Please connect wallet first");
      return;
    }
    if (this.currentWallet.assets.length === 0) {
      console.log("\u274C No assets to transfer");
      return;
    }
    const asset = this.currentWallet.assets[0];
    const recipient = "0x1234567890123456789012345678901234567890";
    const transaction = {
      id: `tx_${Date.now()}`,
      type: "transfer",
      from: this.currentWallet.address,
      to: recipient,
      asset,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet.chain) || 20,
      status: "pending",
      timestamp: Date.now()
    };
    this.transactions.set(transaction.id, transaction);
    asset.owner = recipient;
    asset.lastTransferred = Date.now();
    const index = this.currentWallet.assets.indexOf(asset);
    if (index > -1) {
      this.currentWallet.assets.splice(index, 1);
    }
    console.log(`\u{1F4B8} Transferred ${asset.name} to ${recipient}`);
    setTimeout(() => {
      transaction.status = "confirmed";
      transaction.blockNumber = 12345679;
      console.log(`\u2705 Transaction confirmed: ${transaction.id}`);
    }, 3e3);
    soundSystem.playInteractionSound("click");
  }
  // Verify asset
  verifyAsset() {
    if (this.assets.size === 0) {
      console.log("\u274C No assets to verify");
      return;
    }
    const asset = Array.from(this.assets.values())[0];
    console.log(`\u{1F50D} Verifying asset: ${asset.name}`);
    console.log(`\u{1F194} Token ID: ${asset.tokenId}`);
    console.log(`\u26D3\uFE0F Blockchain: ${asset.blockchain}`);
    console.log(`\u2705 Verification: ${asset.isVerified ? "VALID" : "INVALID"}`);
    console.log(`\u{1F464} Owner: ${asset.owner}`);
    console.log(`\u{1F4C5} Created: ${new Date(asset.createdAt).toLocaleString()}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Issue certificate
  issueCertificate(recipient, metadata) {
    const certificate = {
      id: `cert_${Date.now()}`,
      name: `Certificate #${this.assets.size + 1}`,
      type: "certificate",
      blockchain: this.currentWallet?.chain || "ethereum",
      contractAddress: this.contracts.get("certificate")?.address || "",
      tokenId: (this.assets.size + 1).toString(),
      owner: recipient,
      metadata: {
        description: "AIGestion Achievement Certificate",
        image: "ipfs://QmCertHash...",
        attributes: /* @__PURE__ */ new Map([
          ["type", "achievement"],
          ["issuer", "AIGestion"],
          ["metadata", metadata]
        ]),
        rarity: "uncommon",
        category: "certificate",
        creator: "AIGestion",
        royalties: 0
      },
      value: 0,
      currency: "ETH",
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    };
    this.assets.set(certificate.id, certificate);
    const transaction = {
      id: `tx_${Date.now()}`,
      type: "mint",
      from: "0x0000000000000000000000000000000000000000",
      to: recipient,
      asset: certificate,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet?.chain || "ethereum") || 20,
      status: "confirmed",
      timestamp: Date.now(),
      blockNumber: 12345680
    };
    this.transactions.set(transaction.id, transaction);
    console.log(`\u{1F4DC} Issued certificate to ${recipient}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Award badge
  awardBadge(user, badgeType) {
    const badge = {
      id: `badge_${Date.now()}`,
      name: `${badgeType} Badge`,
      type: "badge",
      blockchain: this.currentWallet?.chain || "ethereum",
      contractAddress: this.contracts.get("badge")?.address || "",
      tokenId: (this.assets.size + 1).toString(),
      owner: user,
      metadata: {
        description: `${badgeType} Achievement Badge`,
        image: "ipfs://QmBadgeHash...",
        attributes: /* @__PURE__ */ new Map([
          ["type", badgeType],
          ["issuer", "AIGestion"],
          ["achievement_level", "gold"]
        ]),
        rarity: "rare",
        category: "badge",
        creator: "AIGestion",
        royalties: 0
      },
      value: 0,
      currency: "ETH",
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    };
    this.assets.set(badge.id, badge);
    const transaction = {
      id: `tx_${Date.now()}`,
      type: "mint",
      from: "0x0000000000000000000000000000000000000000",
      to: user,
      asset: badge,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet?.chain || "ethereum") || 20,
      status: "confirmed",
      timestamp: Date.now(),
      blockNumber: 12345681
    };
    this.transactions.set(transaction.id, transaction);
    console.log(`\u{1F3C6} Awarded ${badgeType} badge to ${user}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Update blockchain UI
  updateBlockchainUI() {
  }
  // Simulate blockchain activity
  simulateBlockchainActivity() {
    if (Math.random() < 0.01) {
      this.simulateIncomingTransaction();
    }
  }
  // Simulate incoming transaction
  simulateIncomingTransaction() {
    if (!this.currentWallet || !this.currentWallet.isConnected) return;
    const assetTypes = ["nft", "badge", "certificate"];
    const randomType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
    const asset = {
      id: `asset_${Date.now()}`,
      name: `Received ${randomType}`,
      type: randomType,
      blockchain: this.currentWallet.chain,
      contractAddress: this.contracts.get("asset_registry")?.address || "",
      tokenId: Math.floor(Math.random() * 1e4).toString(),
      owner: this.currentWallet.address,
      metadata: {
        description: "Received asset",
        image: "ipfs://QmReceivedHash...",
        attributes: /* @__PURE__ */ new Map([
          ["received", "true"],
          ["sender", "0xSenderAddress"]
        ]),
        rarity: "common",
        category: randomType,
        creator: "Unknown",
        royalties: 0
      },
      value: Math.random() * 0.5,
      currency: "ETH",
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    };
    this.assets.set(asset.id, asset);
    this.currentWallet.assets.push(asset);
    const transaction = {
      id: `tx_${Date.now()}`,
      type: "transfer",
      from: "0xSenderAddress",
      to: this.currentWallet.address,
      asset,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet.chain) || 20,
      status: "confirmed",
      timestamp: Date.now(),
      blockNumber: 12345682
    };
    this.transactions.set(transaction.id, transaction);
    console.log(`\u{1F4E5} Received new asset: ${asset.name}`);
  }
  // Update gas prices
  updateGasPrices() {
    this.gasPrices.forEach((price, chain) => {
      const fluctuation = (Math.random() - 0.5) * 0.1;
      const newPrice = Math.max(0.01, price + fluctuation);
      this.gasPrices.set(chain, newPrice);
    });
  }
  // Get current wallet
  getCurrentWallet() {
    return this.currentWallet;
  }
  // Get all assets
  getAssets() {
    return Array.from(this.assets.values());
  }
  // Get transactions
  getTransactions() {
    return Array.from(this.transactions.values());
  }
  // Get gas price
  getGasPrice(chain) {
    return this.gasPrices.get(chain) || 20;
  }
  // Get supported chains
  getSupportedChains() {
    return [...this.supportedChains];
  }
  // Switch chain
  switchChain(chain) {
    if (!this.supportedChains.includes(chain)) {
      console.log(`\u274C Chain ${chain} not supported`);
      return;
    }
    if (this.currentWallet) {
      this.currentWallet.chain = chain;
      console.log(`\u26D3\uFE0F Switched to ${chain}`);
      soundSystem.playInteractionSound("click");
    }
  }
  // Get contract
  getContract(contractId) {
    return this.contracts.get(contractId);
  }
  // Call contract function
  async callContract(contractId, functionName, parameters) {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      throw new Error(`Contract ${contractId} not found`);
    }
    const func = contract.functions.get(functionName);
    if (!func) {
      throw new Error(`Function ${functionName} not found in contract ${contractId}`);
    }
    console.log(`\u{1F4DE} Calling ${contractId}.${functionName} with parameters:`, parameters);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`\u2705 Contract call completed`);
        resolve({ success: true, result: "mock_result" });
      }, 1e3);
    });
  }
  // Cleanup system
  cleanup() {
    this.wallets = /* @__PURE__ */ new Map();
    this.assets = /* @__PURE__ */ new Map();
    this.transactions = /* @__PURE__ */ new Map();
    this.contracts = /* @__PURE__ */ new Map();
    if (this.blockchainUI) {
      import_ecs8.engine.removeEntity(this.blockchainUI);
    }
    this.currentWallet = null;
    this.isInitialized = false;
  }
};
var blockchainSystem = new BlockchainIntegrationSystem();

// src/collaboration-whiteboard.ts
var import_ecs9 = require("@dcl/sdk/ecs");
var import_math7 = require("@dcl/sdk/math");
var CollaborationWhiteboardSystem = class {
  constructor() {
    this.sessions = /* @__PURE__ */ new Map();
    this.currentSession = null;
    this.users = /* @__PURE__ */ new Map();
    this.drawingTools = /* @__PURE__ */ new Map();
    this.drawingEntities = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.isDrawing = false;
    this.currentDrawing = null;
    this.drawingHistory = [];
    this.currentUser = {
      id: "user_main",
      name: "Main User",
      color: import_math7.Color3.create(0.2, 0.6, 1),
      cursor: import_math7.Vector3.create(0, 0, 0),
      isDrawing: false,
      currentTool: this.createDefaultTool()
    };
  }
  // Initialize whiteboard system
  initialize() {
    console.log("\u{1F3A8} Collaboration Whiteboard System Initializing...");
    this.setupDrawingTools();
    this.createWhiteboard();
    this.createToolbar();
    this.startDrawingEngine();
    this.createDefaultSession();
    this.isInitialized = true;
    console.log("\u{1F3A8} Collaboration Whiteboard System Ready!");
  }
  // Setup drawing tools
  setupDrawingTools() {
    this.drawingTools.set("pen", {
      type: "pen",
      color: import_math7.Color3.create(0, 0, 0),
      strokeWidth: 2,
      isActive: true
    });
    this.drawingTools.set("eraser", {
      type: "eraser",
      color: import_math7.Color3.create(1, 1, 1),
      strokeWidth: 10,
      isActive: false
    });
    this.drawingTools.set("text", {
      type: "text",
      color: import_math7.Color3.create(0, 0, 0),
      strokeWidth: 1,
      isActive: false
    });
    this.drawingTools.set("shape", {
      type: "shape",
      color: import_math7.Color3.create(0.2, 0.6, 1),
      strokeWidth: 2,
      isActive: false
    });
    this.drawingTools.set("selection", {
      type: "selection",
      color: import_math7.Color3.create(0.8, 0.8, 0.8),
      strokeWidth: 1,
      isActive: false
    });
  }
  // Create default tool
  createDefaultTool() {
    return {
      type: "pen",
      color: import_math7.Color3.create(0, 0, 0),
      strokeWidth: 2,
      isActive: true
    };
  }
  // Create whiteboard surface
  createWhiteboard() {
    this.whiteboardEntity = import_ecs9.engine.addEntity();
    import_ecs9.Transform.create(this.whiteboardEntity, {
      position: import_math7.Vector3.create(8, 3, 2),
      scale: import_math7.Vector3.create(6, 4, 0.1)
    });
    import_ecs9.MeshRenderer.setBox(this.whiteboardEntity);
    import_ecs9.Material.setPbrMaterial(this.whiteboardEntity, {
      albedoColor: import_math7.Color4.create(1, 1, 1, 1),
      roughness: 0.1,
      metallic: 0
    });
    this.createWhiteboardBorder();
    this.setupWhiteboardInteraction();
  }
  // Create whiteboard border
  createWhiteboardBorder() {
    const border = import_ecs9.engine.addEntity();
    import_ecs9.Transform.create(border, {
      parent: this.whiteboardEntity,
      position: import_math7.Vector3.create(0, 0, -0.05),
      scale: import_math7.Vector3.create(6.1, 4.1, 0.05)
    });
    import_ecs9.MeshRenderer.setBox(border);
    import_ecs9.Material.setPbrMaterial(border, {
      albedoColor: import_math7.Color4.create(0.2, 0.2, 0.2, 1),
      roughness: 0.3,
      metallic: 0.8
    });
  }
  // Setup whiteboard interaction
  setupWhiteboardInteraction() {
    import_ecs9.pointerEventsSystem.onPointerDown(
      {
        entity: this.whiteboardEntity,
        opts: { button: import_ecs9.InputAction.IA_POINTER, hoverText: "Start Drawing" }
      },
      (e) => this.startDrawing(e)
    );
    import_ecs9.pointerEventsSystem.onPointerUp(
      {
        entity: this.whiteboardEntity,
        opts: { button: import_ecs9.InputAction.IA_POINTER }
      },
      () => this.stopDrawing()
    );
  }
  // Create toolbar
  createToolbar() {
    this.toolbarEntity = import_ecs9.engine.addEntity();
    import_ecs9.Transform.create(this.toolbarEntity, {
      position: import_math7.Vector3.create(8, 5, 2),
      scale: import_math7.Vector3.create(4, 0.8, 0.1)
    });
    import_ecs9.MeshRenderer.setBox(this.toolbarEntity);
    import_ecs9.Material.setPbrMaterial(this.toolbarEntity, {
      albedoColor: import_math7.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math7.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    this.createToolButtons();
    this.createColorPalette();
    this.createSessionControls();
  }
  // Create tool buttons
  createToolButtons() {
    const tools = [
      { id: "pen", icon: "\u270F\uFE0F", name: "Pen" },
      { id: "eraser", icon: "\u{1F9F9}", name: "Eraser" },
      { id: "text", icon: "\u{1F4DD}", name: "Text" },
      { id: "shape", icon: "\u2B55", name: "Shape" },
      { id: "selection", icon: "\u{1F446}", name: "Select" }
    ];
    let xOffset = -1.5;
    tools.forEach((tool) => {
      const button = import_ecs9.engine.addEntity();
      import_ecs9.Transform.create(button, {
        parent: this.toolbarEntity,
        position: import_math7.Vector3.create(xOffset, 0, 0.1),
        scale: import_math7.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs9.MeshRenderer.setBox(button);
      import_ecs9.Material.setPbrMaterial(button, {
        albedoColor: import_math7.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math7.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs9.engine.addEntity();
      import_ecs9.Transform.create(buttonText, {
        parent: button,
        position: import_math7.Vector3.create(0, 0, 0.1),
        scale: import_math7.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs9.TextShape.create(buttonText, {
        text: tool.icon,
        textColor: import_math7.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs9.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs9.InputAction.IA_POINTER, hoverText: tool.name }
        },
        () => this.selectTool(tool.id)
      );
      xOffset += 0.8;
    });
  }
  // Create color palette
  createColorPalette() {
    const colors = [
      import_math7.Color3.create(0, 0, 0),
      // Black
      import_math7.Color3.create(1, 0, 0),
      // Red
      import_math7.Color3.create(0, 1, 0),
      // Green
      import_math7.Color3.create(0, 0, 1),
      // Blue
      import_math7.Color3.create(1, 1, 0),
      // Yellow
      import_math7.Color3.create(1, 0, 1),
      // Magenta
      import_math7.Color3.create(0, 1, 1),
      // Cyan
      import_math7.Color3.create(0.5, 0.5, 0.5)
      // Gray
    ];
    let xOffset = -1.5;
    colors.forEach((color, index) => {
      const colorButton = import_ecs9.engine.addEntity();
      import_ecs9.Transform.create(colorButton, {
        parent: this.toolbarEntity,
        position: import_math7.Vector3.create(xOffset, -0.3, 0.1),
        scale: import_math7.Vector3.create(0.15, 0.15, 0.1)
      });
      import_ecs9.MeshRenderer.setBox(colorButton);
      import_ecs9.Material.setPbrMaterial(colorButton, {
        albedoColor: import_math7.Color4.create(color.r, color.g, color.b, 1),
        roughness: 0.2,
        metallic: 0.1
      });
      import_ecs9.pointerEventsSystem.onPointerDown(
        {
          entity: colorButton,
          opts: { button: import_ecs9.InputAction.IA_POINTER, hoverText: `Select Color ${index + 1}` }
        },
        () => this.selectColor(color)
      );
      xOffset += 0.4;
    });
  }
  // Create session controls
  createSessionControls() {
    const controls = [
      { id: "new", icon: "\u{1F195}", name: "New Session" },
      { id: "save", icon: "\u{1F4BE}", name: "Save" },
      { id: "share", icon: "\u{1F517}", name: "Share" },
      { id: "clear", icon: "\u{1F5D1}\uFE0F", name: "Clear" }
    ];
    let xOffset = 1.5;
    controls.forEach((control) => {
      const button = import_ecs9.engine.addEntity();
      import_ecs9.Transform.create(button, {
        parent: this.toolbarEntity,
        position: import_math7.Vector3.create(xOffset, 0, 0.1),
        scale: import_math7.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs9.MeshRenderer.setBox(button);
      import_ecs9.Material.setPbrMaterial(button, {
        albedoColor: import_math7.Color4.create(0.8, 0.4, 0.2, 1),
        emissiveColor: import_math7.Color4.create(0.8, 0.4, 0.2, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs9.engine.addEntity();
      import_ecs9.Transform.create(buttonText, {
        parent: button,
        position: import_math7.Vector3.create(0, 0, 0.1),
        scale: import_math7.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs9.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math7.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs9.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs9.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleSessionControl(control.id)
      );
      xOffset += 0.8;
    });
  }
  // Start drawing engine
  startDrawingEngine() {
    import_ecs9.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateDrawingEntities();
      this.syncWithRemoteUsers();
    });
  }
  // Create default session
  createDefaultSession() {
    const session = {
      id: "session_default",
      name: "Default Whiteboard",
      participants: [this.currentUser.id],
      drawings: [],
      isActive: true,
      createdAt: Date.now(),
      lastModified: Date.now()
    };
    this.sessions.set(session.id, session);
    this.currentSession = session;
    this.users.set(this.currentUser.id, this.currentUser);
    console.log("\u{1F3A8} Default whiteboard session created");
  }
  // Start drawing
  startDrawing(event) {
    if (!this.currentSession) return;
    const point = this.getDrawingPoint(event);
    if (!point) return;
    this.isDrawing = true;
    this.currentUser.isDrawing = true;
    const drawing = {
      id: `drawing_${Date.now()}`,
      userId: this.currentUser.id,
      type: this.currentUser.currentTool.type === "eraser" ? "freehand" : "line",
      points: [point],
      color: this.currentUser.currentTool.color,
      strokeWidth: this.currentUser.currentTool.strokeWidth,
      timestamp: Date.now(),
      isShared: true
    };
    this.currentDrawing = drawing;
    this.drawingHistory.push(drawing);
    soundSystem.playInteractionSound("click");
  }
  // Continue drawing
  continueDrawing(event) {
    if (!this.isDrawing || !this.currentDrawing) return;
    const point = this.getDrawingPoint(event);
    if (!point) return;
    this.currentDrawing.points.push(point);
    this.renderDrawing(this.currentDrawing);
  }
  // Stop drawing
  stopDrawing() {
    if (!this.isDrawing || !this.currentDrawing) return;
    this.isDrawing = false;
    this.currentUser.isDrawing = false;
    const session = this.currentSession;
    if (this.currentDrawing.points.length > 1 && session) {
      session.drawings.push(this.currentDrawing);
      session.lastModified = Date.now();
      this.shareDrawing(this.currentDrawing);
    }
    this.currentDrawing = null;
    soundSystem.playInteractionSound("click");
  }
  // Get drawing point from event
  getDrawingPoint(event) {
    if (!event.hit || !this.whiteboardEntity) return null;
    const localPoint = import_math7.Vector3.create(
      event.hit.hitPoint.x - import_ecs9.Transform.get(this.whiteboardEntity).position.x,
      event.hit.hitPoint.y - import_ecs9.Transform.get(this.whiteboardEntity).position.y,
      0.05
    );
    return localPoint;
  }
  // Render drawing
  renderDrawing(drawing) {
    if (!this.drawingEntities.has(drawing.id)) {
      this.drawingEntities.set(drawing.id, []);
    }
    const entities = this.drawingEntities.get(drawing.id);
    entities.forEach((entity) => import_ecs9.engine.removeEntity(entity));
    entities.length = 0;
    switch (drawing.type) {
      case "line":
      case "freehand":
        this.renderFreehandDrawing(drawing, entities);
        break;
      case "circle":
        this.renderCircleDrawing(drawing, entities);
        break;
      case "rectangle":
        this.renderRectangleDrawing(drawing, entities);
        break;
      case "arrow":
        this.renderArrowDrawing(drawing, entities);
        break;
    }
  }
  // Render freehand drawing
  renderFreehandDrawing(drawing, entities) {
    for (let i = 0; i < drawing.points.length - 1; i++) {
      const start = drawing.points[i];
      const end = drawing.points[i + 1];
      const line = import_ecs9.engine.addEntity();
      import_ecs9.Transform.create(line, {
        parent: this.whiteboardEntity,
        position: import_math7.Vector3.create((start.x + end.x) / 2, (start.y + end.y) / 2, 0.05),
        scale: import_math7.Vector3.create(import_math7.Vector3.distance(start, end), drawing.strokeWidth * 0.01, 0.01),
        rotation: import_math7.Quaternion.fromEulerDegrees(
          0,
          0,
          Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI
        )
      });
      import_ecs9.MeshRenderer.setBox(line);
      import_ecs9.Material.setPbrMaterial(line, {
        albedoColor: import_math7.Color4.create(drawing.color.r, drawing.color.g, drawing.color.b, 1),
        roughness: 0.1,
        metallic: 0
      });
      entities.push(line);
    }
  }
  // Render circle drawing
  renderCircleDrawing(drawing, entities) {
    if (drawing.points.length < 2) return;
    const center = drawing.points[0];
    const radius = import_math7.Vector3.distance(center, drawing.points[1]);
    const circle = import_ecs9.engine.addEntity();
    import_ecs9.Transform.create(circle, {
      parent: this.whiteboardEntity,
      position: import_math7.Vector3.create(center.x, center.y, 0.05),
      scale: import_math7.Vector3.create(radius * 2, radius * 2, 0.01)
    });
    import_ecs9.MeshRenderer.setBox(circle);
    import_ecs9.Material.setPbrMaterial(circle, {
      albedoColor: import_math7.Color4.create(drawing.color.r, drawing.color.g, drawing.color.b, 1),
      roughness: 0.1,
      metallic: 0
    });
    entities.push(circle);
  }
  // Render rectangle drawing
  renderRectangleDrawing(drawing, entities) {
    if (drawing.points.length < 2) return;
    const start = drawing.points[0];
    const end = drawing.points[1];
    const rectangle = import_ecs9.engine.addEntity();
    import_ecs9.Transform.create(rectangle, {
      parent: this.whiteboardEntity,
      position: import_math7.Vector3.create((start.x + end.x) / 2, (start.y + end.y) / 2, 0.05),
      scale: import_math7.Vector3.create(Math.abs(end.x - start.x), Math.abs(end.y - start.y), 0.01)
    });
    import_ecs9.MeshRenderer.setBox(rectangle);
    import_ecs9.Material.setPbrMaterial(rectangle, {
      albedoColor: import_math7.Color4.create(drawing.color.r, drawing.color.g, drawing.color.b, 1),
      roughness: 0.1,
      metallic: 0
    });
    entities.push(rectangle);
  }
  // Render arrow drawing
  renderArrowDrawing(drawing, entities) {
    if (drawing.points.length < 2) return;
    const start = drawing.points[0];
    const end = drawing.points[1];
    this.renderFreehandDrawing(drawing, entities);
    const arrowHead = import_ecs9.engine.addEntity();
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    import_ecs9.Transform.create(arrowHead, {
      parent: this.whiteboardEntity,
      position: import_math7.Vector3.create(end.x, end.y, 0.05),
      scale: import_math7.Vector3.create(0.1, 0.1, 0.01),
      rotation: import_math7.Quaternion.fromEulerDegrees(0, 0, angle * 180 / Math.PI)
    });
    import_ecs9.MeshRenderer.setBox(arrowHead);
    import_ecs9.Material.setPbrMaterial(arrowHead, {
      albedoColor: import_math7.Color4.create(drawing.color.r, drawing.color.g, drawing.color.b, 1),
      roughness: 0.1,
      metallic: 0
    });
    entities.push(arrowHead);
  }
  // Update drawing entities
  updateDrawingEntities() {
    this.updateCursorPosition();
    this.updateDrawingAnimations();
  }
  // Update cursor position
  updateCursorPosition() {
    const time = Date.now() / 1e3;
    this.currentUser.cursor = import_math7.Vector3.create(
      Math.sin(time * 0.5) * 2,
      Math.cos(time * 0.3) * 1.5,
      0.05
    );
  }
  // Update drawing animations
  updateDrawingAnimations() {
    this.drawingEntities.forEach((entities, drawingId) => {
      entities.forEach((entity, index) => {
        const time = Date.now() / 1e3;
        const transform = import_ecs9.Transform.getMutable(entity);
        const scale = transform.scale;
        const pulse = 1 + Math.sin(time * 2 + index * 0.1) * 0.02;
        transform.scale = import_math7.Vector3.create(scale.x * pulse, scale.y * pulse, scale.z);
      });
    });
  }
  // Sync with remote users
  syncWithRemoteUsers() {
    if (Math.random() < 0.01) {
      this.simulateRemoteUserDrawing();
    }
  }
  // Simulate remote user drawing
  simulateRemoteUserDrawing() {
    const remoteUser = {
      id: "user_remote",
      name: "Remote User",
      color: import_math7.Color3.create(1, 0.5, 0),
      cursor: import_math7.Vector3.create(Math.random() * 4 - 2, Math.random() * 2 - 1, 0.05),
      isDrawing: true,
      currentTool: this.createDefaultTool()
    };
    const drawing = {
      id: `drawing_remote_${Date.now()}`,
      userId: remoteUser.id,
      type: "freehand",
      points: [
        remoteUser.cursor,
        import_math7.Vector3.create(
          remoteUser.cursor.x + Math.random() * 0.5,
          remoteUser.cursor.y + Math.random() * 0.5,
          0.05
        )
      ],
      color: remoteUser.color,
      strokeWidth: 2,
      timestamp: Date.now(),
      isShared: true
    };
    if (this.currentSession) {
      this.currentSession.drawings.push(drawing);
      this.renderDrawing(drawing);
    }
  }
  // Select tool
  selectTool(toolId) {
    const tool = this.drawingTools.get(toolId);
    if (!tool) return;
    this.drawingTools.forEach((t) => t.isActive = false);
    tool.isActive = true;
    this.currentUser.currentTool = tool;
    console.log(`\u{1F3A8} Selected tool: ${toolId}`);
    soundSystem.playInteractionSound("click");
  }
  // Select color
  selectColor(color) {
    this.currentUser.currentTool.color = color;
    console.log(`\u{1F3A8} Selected color: RGB(${color.r}, ${color.g}, ${color.b})`);
    soundSystem.playInteractionSound("click");
  }
  // Handle session control
  handleSessionControl(controlId) {
    switch (controlId) {
      case "new":
        this.createNewSession();
        break;
      case "save":
        this.saveSession();
        break;
      case "share":
        this.shareSession();
        break;
      case "clear":
        this.clearWhiteboard();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Create new session
  createNewSession() {
    const session = {
      id: `session_${Date.now()}`,
      name: `Whiteboard ${this.sessions.size + 1}`,
      participants: [this.currentUser.id],
      drawings: [],
      isActive: true,
      createdAt: Date.now(),
      lastModified: Date.now()
    };
    this.sessions.set(session.id, session);
    this.currentSession = session;
    this.clearWhiteboard();
    console.log(`\u{1F3A8} Created new session: ${session.name}`);
  }
  // Save session
  saveSession() {
    if (!this.currentSession) return;
    console.log(`\u{1F4BE} Saving session: ${this.currentSession.name}`);
    console.log(`\u{1F4CA} Drawings: ${this.currentSession.drawings.length}`);
    console.log(`\u{1F465} Participants: ${this.currentSession.participants.length}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Share session
  shareSession() {
    if (!this.currentSession) return;
    console.log(`\u{1F517} Sharing session: ${this.currentSession.name}`);
    console.log(`\u{1F517} Share link: https://aigestion.dev/whiteboard/${this.currentSession.id}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Clear whiteboard
  clearWhiteboard() {
    if (!this.currentSession) return;
    this.drawingEntities.forEach((entities) => {
      entities.forEach((entity) => import_ecs9.engine.removeEntity(entity));
    });
    this.drawingEntities.clear();
    this.currentSession.drawings = [];
    this.currentSession.lastModified = Date.now();
    console.log("\u{1F5D1}\uFE0F Whiteboard cleared");
    soundSystem.playInteractionSound("click");
  }
  // Share drawing with other users
  shareDrawing(drawing) {
    console.log(`\u{1F4E4} Sharing drawing: ${drawing.id}`);
  }
  // Join session
  joinSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    this.currentSession = session;
    session.participants.push(this.currentUser.id);
    session.lastModified = Date.now();
    session.drawings.forEach((drawing) => this.renderDrawing(drawing));
    console.log(`\u{1F3A8} Joined session: ${session.name}`);
  }
  // Leave session
  leaveSession() {
    if (!this.currentSession) return;
    const index = this.currentSession.participants.indexOf(this.currentUser.id);
    if (index > -1) {
      this.currentSession.participants.splice(index, 1);
    }
    console.log(`\u{1F3A8} Left session: ${this.currentSession.name}`);
    this.currentSession = null;
  }
  // Get current session
  getCurrentSession() {
    return this.currentSession;
  }
  // Get all sessions
  getSessions() {
    return Array.from(this.sessions.values());
  }
  // Get drawing history
  getDrawingHistory() {
    return [...this.drawingHistory];
  }
  // Add user to session
  addUserToSession(userId, userName) {
    const user = {
      id: userId,
      name: userName,
      color: import_math7.Color3.create(Math.random(), Math.random(), Math.random()),
      cursor: import_math7.Vector3.create(0, 0, 0),
      isDrawing: false,
      currentTool: this.createDefaultTool()
    };
    this.users.set(userId, user);
    if (this.currentSession) {
      this.currentSession.participants.push(userId);
      this.currentSession.lastModified = Date.now();
    }
    console.log(`\u{1F464} User ${userName} joined the session`);
  }
  // Remove user from session
  removeUserFromSession(userId) {
    const user = this.users.get(userId);
    if (!user) return;
    this.users.delete(userId);
    if (this.currentSession) {
      const index = this.currentSession.participants.indexOf(userId);
      if (index > -1) {
        this.currentSession.participants.splice(index, 1);
        this.currentSession.lastModified = Date.now();
      }
    }
    console.log(`\u{1F464} User ${user.name} left the session`);
  }
  // Cleanup system
  cleanup() {
    this.drawingEntities.forEach((entities) => {
      entities.forEach((entity) => import_ecs9.engine.removeEntity(entity));
    });
    this.drawingEntities.clear();
    this.sessions.clear();
    this.users.clear();
    this.drawingTools.clear();
    this.drawingHistory = [];
    if (this.whiteboardEntity) {
      import_ecs9.engine.removeEntity(this.whiteboardEntity);
    }
    if (this.toolbarEntity) {
      import_ecs9.engine.removeEntity(this.toolbarEntity);
    }
    this.isInitialized = false;
  }
};
var whiteboardSystem = new CollaborationWhiteboardSystem();

// src/content-management.ts
var import_ecs10 = require("@dcl/sdk/ecs");
var import_math8 = require("@dcl/sdk/math");
var ContentManagementSystem = class {
  constructor() {
    this.content = /* @__PURE__ */ new Map();
    this.collections = /* @__PURE__ */ new Map();
    this.templates = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.currentCollection = null;
    this.searchIndex = /* @__PURE__ */ new Map();
    this.initializeAnalyticsEngine();
    this.initializeVersionControl();
  }
  // Initialize content management system
  initialize() {
    console.log("\u{1F4DA} Dynamic Content Management System Initializing...");
    this.setupContentTemplates();
    this.createContentUI();
    this.createDefaultCollections();
    this.initializeSearchIndex();
    this.startContentEngine();
    this.isInitialized = true;
    console.log("\u{1F4DA} Dynamic Content Management System Ready!");
  }
  // Initialize analytics engine
  initializeAnalyticsEngine() {
    this.analyticsEngine = {
      track: (event, data) => {
        console.log(`\u{1F4CA} Analytics: ${event}`, data);
      },
      getMetrics: (contentId) => {
        return {
          views: Math.floor(Math.random() * 1e3),
          downloads: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          averageRating: (Math.random() * 2 + 3).toFixed(1),
          timeSpent: Math.floor(Math.random() * 300)
        };
      }
    };
  }
  // Initialize version control
  initializeVersionControl() {
    this.versionControl = {
      createVersion: (contentId, changes) => {
        console.log(`\u{1F4DD} Creating version for content: ${contentId}`);
        return {
          id: `v_${Date.now()}`,
          contentId,
          changes,
          timestamp: Date.now(),
          author: "system"
        };
      },
      getVersionHistory: (contentId) => {
        return [
          {
            id: "v_1",
            contentId,
            changes: "Initial version",
            timestamp: Date.now() - 864e5,
            author: "creator"
          }
        ];
      }
    };
  }
  // Setup content templates
  setupContentTemplates() {
    const documentTemplate = {
      id: "template_document",
      name: "Document",
      type: "document",
      structure: {
        sections: ["title", "content", "attachments"],
        layout: "standard"
      },
      fields: [
        {
          id: "title",
          name: "Title",
          type: "text",
          required: true,
          validation: [
            { type: "required", value: true, message: "Title is required" },
            { type: "minLength", value: 3, message: "Title must be at least 3 characters" }
          ]
        },
        {
          id: "content",
          name: "Content",
          type: "text",
          required: true,
          validation: [{ type: "required", value: true, message: "Content is required" }]
        },
        {
          id: "category",
          name: "Category",
          type: "select",
          required: true,
          options: ["Report", "Proposal", "Manual", "Guide", "Other"]
        }
      ],
      isDefault: true
    };
    const presentationTemplate = {
      id: "template_presentation",
      name: "Presentation",
      type: "presentation",
      structure: {
        slides: ["title", "content", "media"],
        layout: "slides"
      },
      fields: [
        {
          id: "title",
          name: "Title",
          type: "text",
          required: true
        },
        {
          id: "slides",
          name: "Slides",
          type: "multiselect",
          required: true,
          options: ["Title Slide", "Content Slide", "Image Slide", "Chart Slide"]
        }
      ],
      isDefault: false
    };
    const datasetTemplate = {
      id: "template_dataset",
      name: "Dataset",
      type: "dataset",
      structure: {
        schema: ["columns", "types", "constraints"],
        format: "structured"
      },
      fields: [
        {
          id: "name",
          name: "Dataset Name",
          type: "text",
          required: true
        },
        {
          id: "format",
          name: "Format",
          type: "select",
          required: true,
          options: ["CSV", "JSON", "XML", "Parquet"]
        },
        {
          id: "size",
          name: "Size (MB)",
          type: "number",
          required: true
        }
      ],
      isDefault: false
    };
    this.templates.set(documentTemplate.id, documentTemplate);
    this.templates.set(presentationTemplate.id, presentationTemplate);
    this.templates.set(datasetTemplate.id, datasetTemplate);
    console.log("\u{1F4CB} Content templates configured");
  }
  // Create content UI
  createContentUI() {
    this.contentUI = import_ecs10.engine.addEntity();
    import_ecs10.Transform.create(this.contentUI, {
      position: import_math8.Vector3.create(8, 3, 14),
      scale: import_math8.Vector3.create(4, 4, 0.1)
    });
    import_ecs10.MeshRenderer.setBox(this.contentUI);
    import_ecs10.Material.setPbrMaterial(this.contentUI, {
      albedoColor: import_math8.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math8.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs10.engine.addEntity();
    import_ecs10.Transform.create(title, {
      parent: this.contentUI,
      position: import_math8.Vector3.create(0, 1.7, 0.1),
      scale: import_math8.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs10.TextShape.create(title, {
      text: "\u{1F4DA} CONTENT MANAGEMENT",
      textColor: import_math8.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createContentBrowser();
    this.createContentEditor();
    this.createCollectionManager();
    this.createAnalyticsPanel();
  }
  // Create content browser
  createContentBrowser() {
    const browser = import_ecs10.engine.addEntity();
    import_ecs10.Transform.create(browser, {
      parent: this.contentUI,
      position: import_math8.Vector3.create(0, 1, 0.1),
      scale: import_math8.Vector3.create(0.9, 0.4, 0.1)
    });
    import_ecs10.MeshRenderer.setBox(browser);
    import_ecs10.Material.setPbrMaterial(browser, {
      albedoColor: import_math8.Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: import_math8.Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const browserText = import_ecs10.engine.addEntity();
    import_ecs10.Transform.create(browserText, {
      parent: browser,
      position: import_math8.Vector3.create(0, 0.1, 0.1),
      scale: import_math8.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs10.TextShape.create(browserText, {
      text: "\u{1F4C2} Content Browser",
      textColor: import_math8.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
    this.createBrowserControls();
  }
  // Create browser controls
  createBrowserControls() {
    const controls = [
      { id: "search", icon: "\u{1F50D}", name: "Search" },
      { id: "filter", icon: "\u{1F53D}", name: "Filter" },
      { id: "sort", icon: "\u2195\uFE0F", name: "Sort" },
      { id: "new", icon: "\u2795", name: "New Content" }
    ];
    let xOffset = -0.6;
    controls.forEach((control) => {
      const button = import_ecs10.engine.addEntity();
      import_ecs10.Transform.create(button, {
        parent: this.contentUI,
        position: import_math8.Vector3.create(xOffset, 0.6, 0.1),
        scale: import_math8.Vector3.create(0.2, 0.2, 0.1)
      });
      import_ecs10.MeshRenderer.setBox(button);
      import_ecs10.Material.setPbrMaterial(button, {
        albedoColor: import_math8.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math8.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs10.engine.addEntity();
      import_ecs10.Transform.create(buttonText, {
        parent: button,
        position: import_math8.Vector3.create(0, 0, 0.1),
        scale: import_math8.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs10.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math8.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs10.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs10.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleBrowserControl(control.id)
      );
      xOffset += 0.4;
    });
  }
  // Create content editor
  createContentEditor() {
    const editor = import_ecs10.engine.addEntity();
    import_ecs10.Transform.create(editor, {
      parent: this.contentUI,
      position: import_math8.Vector3.create(0, 0.1, 0.1),
      scale: import_math8.Vector3.create(0.9, 0.4, 0.1)
    });
    import_ecs10.MeshRenderer.setBox(editor);
    import_ecs10.Material.setPbrMaterial(editor, {
      albedoColor: import_math8.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math8.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const editorText = import_ecs10.engine.addEntity();
    import_ecs10.Transform.create(editorText, {
      parent: editor,
      position: import_math8.Vector3.create(0, 0.1, 0.1),
      scale: import_math8.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs10.TextShape.create(editorText, {
      text: "\u270F\uFE0F Content Editor",
      textColor: import_math8.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create collection manager
  createCollectionManager() {
    const manager = import_ecs10.engine.addEntity();
    import_ecs10.Transform.create(manager, {
      parent: this.contentUI,
      position: import_math8.Vector3.create(0, -0.4, 0.1),
      scale: import_math8.Vector3.create(0.9, 0.3, 0.1)
    });
    import_ecs10.MeshRenderer.setBox(manager);
    import_ecs10.Material.setPbrMaterial(manager, {
      albedoColor: import_math8.Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: import_math8.Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const managerText = import_ecs10.engine.addEntity();
    import_ecs10.Transform.create(managerText, {
      parent: manager,
      position: import_math8.Vector3.create(0, 0, 0.1),
      scale: import_math8.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs10.TextShape.create(managerText, {
      text: "\u{1F4C1} Collections",
      textColor: import_math8.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create analytics panel
  createAnalyticsPanel() {
    const analytics = import_ecs10.engine.addEntity();
    import_ecs10.Transform.create(analytics, {
      parent: this.contentUI,
      position: import_math8.Vector3.create(0, -0.9, 0.1),
      scale: import_math8.Vector3.create(0.9, 0.3, 0.1)
    });
    import_ecs10.MeshRenderer.setBox(analytics);
    import_ecs10.Material.setPbrMaterial(analytics, {
      albedoColor: import_math8.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math8.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const analyticsText = import_ecs10.engine.addEntity();
    import_ecs10.Transform.create(analyticsText, {
      parent: analytics,
      position: import_math8.Vector3.create(0, 0, 0.1),
      scale: import_math8.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs10.TextShape.create(analyticsText, {
      text: "\u{1F4CA} Analytics",
      textColor: import_math8.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create default collections
  createDefaultCollections() {
    const documentsCollection = {
      id: "collection_documents",
      name: "Documents",
      description: "All documents and text files",
      items: [],
      layout: "grid",
      filters: [{ field: "type", operator: "equals", value: "document" }],
      sortBy: "date",
      sortOrder: "desc",
      isPublic: true
    };
    const mediaCollection = {
      id: "collection_media",
      name: "Media",
      description: "Images, videos, and audio files",
      items: [],
      layout: "masonry",
      filters: [{ field: "type", operator: "contains", value: "image" }],
      sortBy: "title",
      sortOrder: "asc",
      isPublic: true
    };
    const presentationsCollection = {
      id: "collection_presentations",
      name: "Presentations",
      description: "Slides and presentations",
      items: [],
      layout: "carousel",
      filters: [{ field: "type", operator: "equals", value: "presentation" }],
      sortBy: "date",
      sortOrder: "desc",
      isPublic: false
    };
    this.collections.set(documentsCollection.id, documentsCollection);
    this.collections.set(mediaCollection.id, mediaCollection);
    this.collections.set(presentationsCollection.id, presentationsCollection);
    this.currentCollection = documentsCollection;
    console.log("\u{1F4C1} Default collections created");
  }
  // Initialize search index
  initializeSearchIndex() {
    console.log("\u{1F50D} Initializing search index...");
    this.createSampleContent();
  }
  // Create sample content
  createSampleContent() {
    const sampleContent = [
      {
        id: "content_1",
        title: "Q4 Financial Report",
        type: "document",
        category: "Report",
        tags: ["finance", "quarterly", "2024"],
        metadata: {
          author: "Finance Team",
          description: "Quarterly financial report for Q4 2024",
          size: 2048e3,
          format: "PDF",
          language: "en",
          accessibility: {
            hasCaptions: false,
            hasAudioDescription: false,
            hasTranscript: true,
            hasAltText: true,
            language: "en"
          }
        },
        content: { url: "/files/q4_report.pdf" },
        permissions: {
          canView: ["all"],
          canEdit: ["finance_team"],
          canDelete: ["finance_manager"],
          canShare: true,
          isPublic: false
        },
        createdAt: Date.now() - 864e5,
        updatedAt: Date.now() - 36e5,
        version: 2,
        status: "published"
      },
      {
        id: "content_2",
        title: "Product Launch Presentation",
        type: "presentation",
        category: "Marketing",
        tags: ["product", "launch", "marketing"],
        metadata: {
          author: "Marketing Team",
          description: "New product launch presentation",
          size: 512e4,
          format: "PPTX",
          duration: 1800,
          language: "en",
          accessibility: {
            hasCaptions: true,
            hasAudioDescription: false,
            hasTranscript: true,
            hasAltText: true,
            language: "en"
          }
        },
        content: { url: "/files/product_launch.pptx" },
        permissions: {
          canView: ["all"],
          canEdit: ["marketing_team"],
          canDelete: ["marketing_manager"],
          canShare: true,
          isPublic: true
        },
        createdAt: Date.now() - 1728e5,
        updatedAt: Date.now() - 72e5,
        version: 3,
        status: "published"
      },
      {
        id: "content_3",
        title: "Customer Analytics Dataset",
        type: "dataset",
        category: "Analytics",
        tags: ["customer", "analytics", "data"],
        metadata: {
          author: "Data Team",
          description: "Customer behavior analytics dataset",
          size: 1024e4,
          format: "CSV",
          language: "en",
          accessibility: {
            hasCaptions: false,
            hasAudioDescription: false,
            hasTranscript: false,
            hasAltText: true,
            language: "en"
          }
        },
        content: { url: "/data/customer_analytics.csv" },
        permissions: {
          canView: ["data_team", "analysts"],
          canEdit: ["data_team"],
          canDelete: ["data_manager"],
          canShare: false,
          isPublic: false
        },
        createdAt: Date.now() - 2592e5,
        updatedAt: Date.now() - 864e5,
        version: 1,
        status: "published"
      }
    ];
    sampleContent.forEach((item) => {
      this.content.set(item.id, item);
      this.updateSearchIndex(item);
    });
    console.log("\u{1F4C4} Sample content created");
  }
  // Update search index
  updateSearchIndex(item) {
    const searchableText = [
      item.title,
      item.metadata.description,
      item.category,
      ...item.tags,
      item.metadata.author
    ].join(" ").toLowerCase();
    this.searchIndex.set(item.id, searchableText.split(" "));
  }
  // Start content engine
  startContentEngine() {
    import_ecs10.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateContentMetrics();
      this.processContentUpdates();
      this.optimizeSearchIndex();
    });
  }
  // Handle browser control
  handleBrowserControl(controlId) {
    switch (controlId) {
      case "search":
        this.openSearchDialog();
        break;
      case "filter":
        this.openFilterDialog();
        break;
      case "sort":
        this.toggleSortOrder();
        break;
      case "new":
        this.openContentCreator();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Open search dialog
  openSearchDialog() {
    console.log("\u{1F50D} Opening search dialog...");
  }
  // Open filter dialog
  openFilterDialog() {
    console.log("\u{1F53D} Opening filter dialog...");
  }
  // Toggle sort order
  toggleSortOrder() {
    if (!this.currentCollection) return;
    this.currentCollection.sortOrder = this.currentCollection.sortOrder === "asc" ? "desc" : "asc";
    console.log(`\u{1F504} Sort order: ${this.currentCollection.sortOrder}`);
  }
  // Open content creator
  openContentCreator() {
    console.log("\u2795 Opening content creator...");
  }
  // Create content
  createContent(templateId, data) {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    const content = {
      id: `content_${Date.now()}`,
      title: data.title || "Untitled",
      type: template.type,
      category: data.category || "General",
      tags: data.tags || [],
      metadata: {
        author: data.author || "Unknown",
        description: data.description || "",
        size: 0,
        format: template.type,
        language: data.language || "en",
        accessibility: {
          hasCaptions: false,
          hasAudioDescription: false,
          hasTranscript: false,
          hasAltText: false,
          language: data.language || "en"
        }
      },
      content: data.content || {},
      permissions: {
        canView: data.canView || ["all"],
        canEdit: data.canEdit || [data.author || "Unknown"],
        canDelete: data.canDelete || [data.author || "Unknown"],
        canShare: data.canShare !== void 0 ? data.canShare : true,
        isPublic: data.isPublic !== void 0 ? data.isPublic : false
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      status: "draft"
    };
    this.content.set(content.id, content);
    this.updateSearchIndex(content);
    this.analyticsEngine.track("content_created", {
      contentId: content.id,
      type: content.type,
      author: content.metadata.author
    });
    console.log(`\u{1F4DD} Created content: ${content.title}`);
    return content;
  }
  // Update content
  updateContent(contentId, updates) {
    const content = this.content.get(contentId);
    if (!content) return null;
    const version = this.versionControl.createVersion(contentId, updates);
    Object.assign(content, updates);
    content.updatedAt = Date.now();
    content.version += 1;
    this.updateSearchIndex(content);
    this.analyticsEngine.track("content_updated", {
      contentId,
      version: content.version
    });
    console.log(`\u270F\uFE0F Updated content: ${content.title}`);
    return content;
  }
  // Delete content
  deleteContent(contentId) {
    const content = this.content.get(contentId);
    if (!content) return false;
    content.status = "deleted";
    this.searchIndex.delete(contentId);
    this.analyticsEngine.track("content_deleted", {
      contentId,
      type: content.type
    });
    console.log(`\u{1F5D1}\uFE0F Deleted content: ${content.title}`);
    return true;
  }
  // Search content
  searchContent(query) {
    const terms = query.toLowerCase().split(" ");
    const results = [];
    this.content.forEach((content, id) => {
      if (content.status === "deleted") return;
      const indexTerms = this.searchIndex.get(id) || [];
      const score = this.calculateSearchScore(terms, indexTerms);
      if (score > 0) {
        results.push(content);
      }
    });
    return results.sort((a, b) => {
      const scoreA = this.calculateSearchScore(terms, this.searchIndex.get(a.id) || []);
      const scoreB = this.calculateSearchScore(terms, this.searchIndex.get(b.id) || []);
      return scoreB - scoreA;
    });
  }
  // Calculate search score
  calculateSearchScore(queryTerms, indexTerms) {
    let score = 0;
    queryTerms.forEach((term) => {
      if (indexTerms.includes(term)) {
        score += 1;
      }
    });
    return score;
  }
  // Get content by collection
  getContentByCollection(collectionId) {
    const collection = this.collections.get(collectionId);
    if (!collection) return [];
    let results = Array.from(this.content.values()).filter((content) => {
      if (content.status === "deleted") return false;
      return collection.filters.every((filter) => {
        const fieldValue = this.getFieldValue(content, filter.field);
        return this.applyFilter(fieldValue, filter.operator, filter.value);
      });
    });
    results.sort((a, b) => {
      const aValue = this.getFieldValue(a, collection.sortBy);
      const bValue = this.getFieldValue(b, collection.sortBy);
      if (collection.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    return results;
  }
  // Get field value
  getFieldValue(content, field) {
    switch (field) {
      case "title":
        return content.title;
      case "date":
        return content.createdAt;
      case "author":
        return content.metadata.author;
      case "type":
        return content.type;
      case "popularity":
        return this.analyticsEngine.getMetrics(content.id).views;
      default:
        return "";
    }
  }
  // Apply filter
  applyFilter(value, operator, filterValue) {
    switch (operator) {
      case "equals":
        return value === filterValue;
      case "contains":
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      case "greater":
        return value > filterValue;
      case "less":
        return value < filterValue;
      case "between":
        return value >= filterValue[0] && value <= filterValue[1];
      default:
        return false;
    }
  }
  // Update content metrics
  updateContentMetrics() {
    this.content.forEach((content, id) => {
      const metrics = this.analyticsEngine.getMetrics(id);
    });
  }
  // Process content updates
  processContentUpdates() {
  }
  // Optimize search index
  optimizeSearchIndex() {
  }
  // Get content
  getContent(contentId) {
    return this.content.get(contentId);
  }
  // Get all content
  getAllContent() {
    return Array.from(this.content.values()).filter((content) => content.status !== "deleted");
  }
  // Get collections
  getCollections() {
    return Array.from(this.collections.values());
  }
  // Get templates
  getTemplates() {
    return Array.from(this.templates.values());
  }
  // Get content metrics
  getContentMetrics(contentId) {
    return this.analyticsEngine.getMetrics(contentId);
  }
  // Cleanup system
  cleanup() {
    this.content.clear();
    this.collections.clear();
    this.templates.clear();
    this.searchIndex.clear();
    if (this.contentUI) {
      import_ecs10.engine.removeEntity(this.contentUI);
    }
    this.isInitialized = false;
  }
};
var contentManagementSystem = new ContentManagementSystem();

// src/cross-platform-sync.ts
var import_ecs11 = require("@dcl/sdk/ecs");
var import_math9 = require("@dcl/sdk/math");
var CrossPlatformSyncSystem = class {
  constructor() {
    this.sessions = /* @__PURE__ */ new Map();
    this.currentSession = null;
    this.networks = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.syncQueue = [];
    this.maxQueueSize = 1e3;
    this.syncInterval = 100;
    // 100ms
    this.lastSyncTime = 0;
    this.initializeNetworks();
    this.setupConflictResolver();
  }
  // Initialize cross-platform sync system
  initialize() {
    console.log("\u{1F504} Cross-Platform Sync System Initializing...");
    this.createSyncUI();
    this.startSyncEngine();
    this.createDefaultSession();
    this.isInitialized = true;
    console.log("\u{1F504} Cross-Platform Sync System Ready!");
  }
  // Initialize networks
  initializeNetworks() {
    this.networks.set("websocket", {
      id: "network_websocket",
      type: "websocket",
      isConnected: false,
      latency: 50,
      bandwidth: 1e3,
      reliability: 0.95
    });
    this.networks.set("webrtc", {
      id: "network_webrtc",
      type: "webrtc",
      isConnected: false,
      latency: 20,
      bandwidth: 5e3,
      reliability: 0.98
    });
    this.networks.set("http", {
      id: "network_http",
      type: "http",
      isConnected: true,
      latency: 200,
      bandwidth: 2e3,
      reliability: 0.99
    });
    console.log("\u{1F310} Sync networks initialized");
  }
  // Setup conflict resolver
  setupConflictResolver() {
    this.conflictResolver = {
      resolve: (conflict, strategy) => {
        console.log(`\u{1F527} Resolving conflict ${conflict.id} with strategy: ${strategy}`);
        switch (strategy) {
          case "last_write_wins":
            return conflict.changes[conflict.changes.length - 1];
          case "first_write_wins":
            return conflict.changes[0];
          case "merge":
            return this.conflictResolver.merge(conflict.changes);
          case "manual":
            return null;
          // Requires manual intervention
          case "voting":
            return this.conflictResolver.resolveByVoting(conflict.changes);
          default:
            return conflict.changes[conflict.changes.length - 1];
        }
      },
      merge: (changes) => {
        const merged = { ...changes[0].data };
        for (let i = 1; i < changes.length; i++) {
          Object.assign(merged, changes[i].data);
        }
        return merged;
      },
      resolveByVoting: (changes) => {
        const votes = /* @__PURE__ */ new Map();
        changes.forEach((change) => {
          votes.set(change.author, Math.random());
        });
        let maxVotes = 0;
        let winner = changes[0];
        votes.forEach((votes2, author) => {
          if (votes2 > maxVotes) {
            maxVotes = votes2;
            winner = changes.find((c) => c.author === author) || changes[0];
          }
        });
        return winner;
      }
    };
  }
  // Create sync UI
  createSyncUI() {
    this.syncUI = import_ecs11.engine.addEntity();
    import_ecs11.Transform.create(this.syncUI, {
      position: import_math9.Vector3.create(2, 3, 8),
      scale: import_math9.Vector3.create(3, 4, 0.1)
    });
    import_ecs11.MeshRenderer.setBox(this.syncUI);
    import_ecs11.Material.setPbrMaterial(this.syncUI, {
      albedoColor: import_math9.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math9.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs11.engine.addEntity();
    import_ecs11.Transform.create(title, {
      parent: this.syncUI,
      position: import_math9.Vector3.create(0, 1.7, 0.1),
      scale: import_math9.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs11.TextShape.create(title, {
      text: "\u{1F504} CROSS-PLATFORM SYNC",
      textColor: import_math9.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createSessionControls();
    this.createPlatformIndicators();
    this.createSyncStatus();
    this.createConflictDisplay();
  }
  // Create session controls
  createSessionControls() {
    const controls = [
      { id: "create_session", icon: "\u2795", name: "Create Session" },
      { id: "join_session", icon: "\u{1F517}", name: "Join Session" },
      { id: "sync_now", icon: "\u{1F504}", name: "Sync Now" },
      { id: "leave_session", icon: "\u{1F6AA}", name: "Leave Session" }
    ];
    let xOffset = -0.9;
    controls.forEach((control) => {
      const button = import_ecs11.engine.addEntity();
      import_ecs11.Transform.create(button, {
        parent: this.syncUI,
        position: import_math9.Vector3.create(xOffset, 1.2, 0.1),
        scale: import_math9.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs11.MeshRenderer.setBox(button);
      import_ecs11.Material.setPbrMaterial(button, {
        albedoColor: import_math9.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math9.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs11.engine.addEntity();
      import_ecs11.Transform.create(buttonText, {
        parent: button,
        position: import_math9.Vector3.create(0, 0, 0.1),
        scale: import_math9.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs11.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math9.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs11.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs11.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleSessionControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  // Create platform indicators
  createPlatformIndicators() {
    const platforms = ["web", "mobile", "desktop", "vr", "ar", "console"];
    let xOffset = -1.2;
    platforms.forEach((platform) => {
      const indicator = import_ecs11.engine.addEntity();
      import_ecs11.Transform.create(indicator, {
        parent: this.syncUI,
        position: import_math9.Vector3.create(xOffset, 0.6, 0.1),
        scale: import_math9.Vector3.create(0.2, 0.2, 0.1)
      });
      import_ecs11.MeshRenderer.setBox(indicator);
      import_ecs11.Material.setPbrMaterial(indicator, {
        albedoColor: this.getPlatformColor(platform),
        emissiveColor: this.getPlatformColor(platform),
        emissiveIntensity: 0.5
      });
      const platformText = import_ecs11.engine.addEntity();
      import_ecs11.Transform.create(platformText, {
        parent: indicator,
        position: import_math9.Vector3.create(0, 0, 0.1),
        scale: import_math9.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs11.TextShape.create(platformText, {
        text: this.getPlatformIcon(platform),
        textColor: import_math9.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs11.pointerEventsSystem.onPointerDown(
        {
          entity: indicator,
          opts: { button: import_ecs11.InputAction.IA_POINTER, hoverText: platform }
        },
        () => this.connectPlatform(platform)
      );
      xOffset += 0.4;
    });
  }
  // Create sync status
  createSyncStatus() {
    const statusDisplay = import_ecs11.engine.addEntity();
    import_ecs11.Transform.create(statusDisplay, {
      parent: this.syncUI,
      position: import_math9.Vector3.create(0, 0, 0.1),
      scale: import_math9.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs11.MeshRenderer.setBox(statusDisplay);
    import_ecs11.Material.setPbrMaterial(statusDisplay, {
      albedoColor: import_math9.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math9.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const statusText = import_ecs11.engine.addEntity();
    import_ecs11.Transform.create(statusText, {
      parent: statusDisplay,
      position: import_math9.Vector3.create(0, 0, 0.1),
      scale: import_math9.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs11.TextShape.create(statusText, {
      text: "\u{1F4CA} Status: Ready",
      textColor: import_math9.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create conflict display
  createConflictDisplay() {
    const conflictDisplay = import_ecs11.engine.addEntity();
    import_ecs11.Transform.create(conflictDisplay, {
      parent: this.syncUI,
      position: import_math9.Vector3.create(0, -0.6, 0.1),
      scale: import_math9.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs11.MeshRenderer.setBox(conflictDisplay);
    import_ecs11.Material.setPbrMaterial(conflictDisplay, {
      albedoColor: import_math9.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math9.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const conflictText = import_ecs11.engine.addEntity();
    import_ecs11.Transform.create(conflictText, {
      parent: conflictDisplay,
      position: import_math9.Vector3.create(0, 0, 0.1),
      scale: import_math9.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs11.TextShape.create(conflictText, {
      text: "\u26A0\uFE0F Conflicts: 0",
      textColor: import_math9.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Get platform color
  getPlatformColor(platform) {
    switch (platform) {
      case "web":
        return import_math9.Color4.create(0.2, 0.6, 1, 1);
      case "mobile":
        return import_math9.Color4.create(0.8, 0.4, 0.2, 1);
      case "desktop":
        return import_math9.Color4.create(0.2, 0.8, 0.4, 1);
      case "vr":
        return import_math9.Color4.create(0.8, 0.2, 0.8, 1);
      case "ar":
        return import_math9.Color4.create(0.2, 0.8, 0.8, 1);
      case "console":
        return import_math9.Color4.create(0.8, 0.8, 0.2, 1);
      default:
        return import_math9.Color4.create(0.5, 0.5, 0.5, 1);
    }
  }
  // Get platform icon
  getPlatformIcon(platform) {
    switch (platform) {
      case "web":
        return "\u{1F310}";
      case "mobile":
        return "\u{1F4F1}";
      case "desktop":
        return "\u{1F5A5}\uFE0F";
      case "vr":
        return "\u{1F97D}";
      case "ar":
        return "\u{1F4F7}";
      case "console":
        return "\u{1F3AE}";
      default:
        return "\u2753";
    }
  }
  // Start sync engine
  startSyncEngine() {
    import_ecs11.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.processSyncQueue();
      this.checkConnections();
      this.detectConflicts();
      this.updateSyncStatus();
    });
  }
  // Create default session
  createDefaultSession() {
    const session = {
      id: "session_default",
      name: "Default Sync Session",
      platform: "web",
      status: "active",
      participants: [
        {
          id: "user_main",
          name: "Main User",
          platform: "web",
          role: "host",
          permissions: {
            canRead: true,
            canWrite: true,
            canDelete: true,
            canInvite: true,
            canKick: true,
            canChangeSettings: true
          },
          status: "online",
          lastSeen: Date.now()
        }
      ],
      lastSync: Date.now(),
      syncInterval: 100,
      dataSync: {
        entities: /* @__PURE__ */ new Map(),
        settings: /* @__PURE__ */ new Map(),
        events: [],
        conflicts: [],
        version: 1
      },
      conflictResolution: {
        strategy: "last_write_wins",
        autoResolve: true,
        timeout: 5e3
      }
    };
    this.sessions.set(session.id, session);
    this.currentSession = session;
    console.log("\u{1F504} Default sync session created");
  }
  // Handle session control
  handleSessionControl(controlId) {
    switch (controlId) {
      case "create_session":
        this.createSession();
        break;
      case "join_session":
        this.joinSession();
        break;
      case "sync_now":
        this.forceSync();
        break;
      case "leave_session":
        this.leaveSession();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Create session
  createSession() {
    const sessionId = `session_${Date.now()}`;
    const session = {
      id: sessionId,
      name: `Sync Session ${this.sessions.size + 1}`,
      platform: "web",
      status: "active",
      participants: [
        {
          id: "user_main",
          name: "Main User",
          platform: "web",
          role: "host",
          permissions: {
            canRead: true,
            canWrite: true,
            canDelete: true,
            canInvite: true,
            canKick: true,
            canChangeSettings: true
          },
          status: "online",
          lastSeen: Date.now()
        }
      ],
      lastSync: Date.now(),
      syncInterval: 100,
      dataSync: {
        entities: /* @__PURE__ */ new Map(),
        settings: /* @__PURE__ */ new Map(),
        events: [],
        conflicts: [],
        version: 1
      },
      conflictResolution: {
        strategy: "last_write_wins",
        autoResolve: true,
        timeout: 5e3
      }
    };
    this.sessions.set(sessionId, session);
    this.currentSession = session;
    console.log(`\u2795 Created session: ${session.name}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Join session
  joinSession() {
    console.log("\u{1F517} Joining session...");
    soundSystem.playInteractionSound("click");
  }
  // Force sync
  forceSync() {
    if (!this.currentSession) return;
    console.log("\u{1F504} Forcing sync...");
    this.currentSession.status = "syncing";
    setTimeout(() => {
      this.currentSession.status = "active";
      this.currentSession.lastSync = Date.now();
      console.log("\u2705 Sync completed");
    }, 1e3);
    soundSystem.playInteractionSound("powerup");
  }
  // Leave session
  leaveSession() {
    if (!this.currentSession) return;
    console.log(`\u{1F6AA} Leaving session: ${this.currentSession.name}`);
    this.currentSession = null;
    soundSystem.playInteractionSound("click");
  }
  // Connect platform
  connectPlatform(platform) {
    const network = this.networks.get(platform === "web" ? "websocket" : "webrtc");
    if (!network) return;
    network.isConnected = true;
    console.log(`\u{1F517} Connected to ${platform} platform`);
    soundSystem.playInteractionSound("powerup");
  }
  // Disconnect platform
  disconnectPlatform(platform) {
    const network = this.networks.get(platform === "web" ? "websocket" : "webrtc");
    if (!network) return;
    network.isConnected = false;
    console.log(`\u{1F50C} Disconnected from ${platform} platform`);
    soundSystem.playInteractionSound("click");
  }
  // Process sync queue
  processSyncQueue() {
    if (this.syncQueue.length === 0) return;
    const now = Date.now();
    if (now - this.lastSyncTime < this.syncInterval) return;
    const eventsToProcess = this.syncQueue.splice(0, 10);
    eventsToProcess.forEach((event) => {
      this.processSyncEvent(event);
    });
    this.lastSyncTime = now;
  }
  // Process sync event
  processSyncEvent(event) {
    if (!this.currentSession) return;
    console.log(`\u{1F4E4} Processing sync event: ${event.type} for ${event.target}`);
    this.currentSession.dataSync.events.push(event);
    if (this.currentSession.dataSync.events.length > 1e3) {
      this.currentSession.dataSync.events = this.currentSession.dataSync.events.slice(-500);
    }
    switch (event.type) {
      case "create":
        this.handleCreateEvent(event);
        break;
      case "update":
        this.handleUpdateEvent(event);
        break;
      case "delete":
        this.handleDeleteEvent(event);
        break;
      case "move":
        this.handleMoveEvent(event);
        break;
      case "interact":
        this.handleInteractEvent(event);
        break;
    }
  }
  // Handle create event
  handleCreateEvent(event) {
    const entity = {
      id: event.target,
      type: "custom",
      data: event.data,
      timestamp: event.timestamp,
      author: event.author,
      version: 1,
      conflicts: []
    };
    if (this.currentSession) {
      this.currentSession.dataSync.entities.set(event.target, entity);
    }
  }
  // Handle update event
  handleUpdateEvent(event) {
    if (!this.currentSession) return;
    const entity = this.currentSession.dataSync.entities.get(event.target);
    if (entity) {
      if (entity.author !== event.author && entity.timestamp > event.timestamp - 1e3) {
        this.createConflict(entity, event);
      } else {
        entity.data = event.data;
        entity.timestamp = event.timestamp;
        entity.author = event.author;
        entity.version++;
      }
    }
  }
  // Handle delete event
  handleDeleteEvent(event) {
    if (this.currentSession) {
      this.currentSession.dataSync.entities.delete(event.target);
    }
  }
  // Handle move event
  handleMoveEvent(event) {
    if (!this.currentSession) return;
    const entity = this.currentSession.dataSync.entities.get(event.target);
    if (entity && entity.type === "position") {
      entity.data = event.data;
      entity.timestamp = event.timestamp;
    }
  }
  // Handle interact event
  handleInteractEvent(event) {
    console.log`🎯 Interaction event: ${event.target} by ${event.author}`;
  }
  // Create conflict
  createConflict(entity, event) {
    const conflict = {
      id: `conflict_${Date.now()}_${Math.random()}`,
      type: "data",
      entity: entity.id,
      changes: [
        {
          author: entity.author,
          platform: this.currentSession.platform,
          data: entity.data,
          timestamp: entity.timestamp
        },
        {
          author: event.author,
          platform: event.platform,
          data: event.data,
          timestamp: event.timestamp
        }
      ],
      timestamp: Date.now(),
      status: "pending"
    };
    if (this.currentSession) {
      this.currentSession.dataSync.conflicts.push(conflict);
      if (this.currentSession.conflictResolution.autoResolve) {
        this.resolveConflict(conflict);
      }
    }
  }
  // Resolve conflict
  resolveConflict(conflict) {
    if (!this.currentSession) return;
    const resolution = this.conflictResolver.resolve(
      conflict,
      this.currentSession.conflictResolution.strategy
    );
    if (resolution) {
      const entity = this.currentSession.dataSync.entities.get(conflict.entity);
      if (entity) {
        entity.data = resolution.data;
        entity.author = resolution.author;
        entity.timestamp = resolution.timestamp;
        entity.version++;
      }
      conflict.status = "resolved";
      console.log(`\u2705 Resolved conflict ${conflict.id}`);
    } else {
      conflict.status = "ignored";
      console.log(`\u26A0\uFE0F Ignored conflict ${conflict.id}`);
    }
  }
  // Check connections
  checkConnections() {
    this.networks.forEach((network, id) => {
      if (Math.random() < 0.01) {
        network.latency = 20 + Math.random() * 100;
        network.bandwidth = 1e3 + Math.random() * 4e3;
        network.reliability = 0.9 + Math.random() * 0.09;
      }
    });
  }
  // Detect conflicts
  detectConflicts() {
    if (!this.currentSession) return;
    const now = Date.now();
    this.currentSession.dataSync.conflicts = this.currentSession.dataSync.conflicts.filter(
      (conflict) => {
        return now - conflict.timestamp < 3e4;
      }
    );
  }
  // Update sync status
  updateSyncStatus() {
    if (!this.currentSession) return;
    const totalEntities = this.currentSession.dataSync.entities.size;
    const pendingConflicts = this.currentSession.dataSync.conflicts.filter(
      (c) => c.status === "pending"
    ).length;
    const queueSize = this.syncQueue.length;
    console.log(
      `\u{1F4CA} Sync Status: ${this.currentSession.status} | Entities: ${totalEntities} | Conflicts: ${pendingConflicts} | Queue: ${queueSize}`
    );
  }
  // Queue sync event
  queueSyncEvent(event) {
    if (this.syncQueue.length >= this.maxQueueSize) {
      this.syncQueue.shift();
    }
    this.syncQueue.push(event);
  }
  // Get current session
  getCurrentSession() {
    return this.currentSession;
  }
  // Get all sessions
  getSessions() {
    return Array.from(this.sessions.values());
  }
  // Get network status
  getNetworkStatus() {
    return new Map(this.networks);
  }
  // Get sync statistics
  getSyncStatistics() {
    if (!this.currentSession) return null;
    return {
      sessionId: this.currentSession.id,
      status: this.currentSession.status,
      participants: this.currentSession.participants.length,
      entities: this.currentSession.dataSync.entities.size,
      events: this.currentSession.dataSync.events.length,
      conflicts: this.currentSession.dataSync.conflicts.length,
      lastSync: this.currentSession.lastSync,
      queueSize: this.syncQueue.length
    };
  }
  // Set conflict resolution strategy
  setConflictResolutionStrategy(strategy) {
    if (this.currentSession) {
      this.currentSession.conflictResolution.strategy = strategy;
      console.log(`\u{1F527} Conflict resolution strategy set to: ${strategy}`);
    }
  }
  // Enable/disable auto-resolve
  setAutoResolve(enabled) {
    if (this.currentSession) {
      this.currentSession.conflictResolution.autoResolve = enabled;
      console.log(`\u{1F916} Auto-resolve ${enabled ? "enabled" : "disabled"}`);
    }
  }
  // Cleanup system
  cleanup() {
    this.sessions.clear();
    this.networks.clear();
    this.syncQueue = [];
    if (this.syncUI) {
      import_ecs11.engine.removeEntity(this.syncUI);
    }
    this.isInitialized = false;
  }
};
var crossPlatformSyncSystem = new CrossPlatformSyncSystem();

// src/emotion-detection.ts
var import_ecs12 = require("@dcl/sdk/ecs");
var import_math10 = require("@dcl/sdk/math");
var EmotionDetectionSystem = class {
  constructor() {
    this.emotionProfiles = /* @__PURE__ */ new Map();
    this.currentEmotions = /* @__PURE__ */ new Map();
    this.adaptiveResponses = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.detectionSensitivity = 0.7;
    this.adaptationThreshold = 0.8;
    this.emotionHistory = [];
    this.maxHistoryLength = 100;
    this.setupAdaptiveResponses();
  }
  // Initialize emotion detection system
  initialize() {
    console.log("\u{1F60A} Emotion Detection System Initializing...");
    this.createEmotionUI();
    this.createDefaultProfiles();
    this.startEmotionEngine();
    this.initializeSensors();
    this.isInitialized = true;
    console.log("\u{1F60A} Emotion Detection System Ready!");
  }
  // Setup adaptive responses
  setupAdaptiveResponses() {
    this.adaptiveResponses.set("joy_bright", {
      id: "joy_bright",
      emotionTrigger: "joy",
      responseType: "environmental",
      action: {
        type: "adjust_lighting",
        parameters: /* @__PURE__ */ new Map([
          ["brightness", 1.2],
          ["color", "warm"],
          ["duration", 5e3]
        ]),
        duration: 5e3,
        intensity: 0.8
      },
      priority: 1,
      conditions: [{ parameter: "intensity", operator: "greater", value: 0.6 }]
    });
    this.adaptiveResponses.set("joy_music", {
      id: "joy_music",
      emotionTrigger: "joy",
      responseType: "audio",
      action: {
        type: "play_music",
        parameters: /* @__PURE__ */ new Map([
          ["hue", 240],
          ["saturation", 0.8],
          ["intensity", 0.5]
        ]),
        duration: 3e3,
        intensity: 0.7
      },
      priority: 2,
      conditions: []
    });
    this.adaptiveResponses.set("stress_calm", {
      id: "stress_calm",
      emotionTrigger: "stress",
      responseType: "environmental",
      action: {
        type: "adjust_lighting",
        parameters: /* @__PURE__ */ new Map([
          ["frequency", 0.8],
          ["color", "calm"],
          ["pattern", "pulsing"]
        ]),
        duration: 1e4,
        intensity: 0.9
      },
      priority: 1,
      conditions: [{ parameter: "intensity", operator: "greater", value: 0.5 }]
    });
    this.adaptiveResponses.set("stress_breathing", {
      id: "stress_breathing",
      emotionTrigger: "stress",
      responseType: "visual",
      action: {
        type: "breathing_guide",
        parameters: /* @__PURE__ */ new Map([
          ["rate", 0.2],
          ["duration", 5e3]
        ]),
        duration: 5e3,
        intensity: 0.8
      },
      priority: 2,
      conditions: []
    });
    this.adaptiveResponses.set("focus_minimize", {
      id: "focus_minimize",
      emotionTrigger: "focus",
      responseType: "environmental",
      action: {
        type: "minimize_distractions",
        parameters: /* @__PURE__ */ new Map([
          ["ui_opacity", 0.3],
          ["notifications", false],
          ["duration", 15e3]
        ]),
        duration: 15e3,
        intensity: 0.9
      },
      priority: 1,
      conditions: [{ parameter: "intensity", operator: "greater", value: 0.7 }]
    });
    this.adaptiveResponses.set("sadness_comfort", {
      id: "sadness_comfort",
      emotionTrigger: "sadness",
      responseType: "audio",
      action: {
        type: "play_music",
        parameters: /* @__PURE__ */ new Map([
          ["genre", "comforting"],
          ["volume", 0.4],
          ["duration", 8e3]
        ]),
        duration: 8e3,
        intensity: 0.6
      },
      priority: 1,
      conditions: []
    });
    this.adaptiveResponses.set("anger_cool", {
      id: "anger_cool",
      emotionTrigger: "anger",
      responseType: "environmental",
      action: {
        type: "adjust_temperature",
        parameters: /* @__PURE__ */ new Map([
          ["temperature", 20],
          ["duration", 1e4]
        ]),
        duration: 1e4,
        intensity: 0.8
      },
      priority: 1,
      conditions: [{ parameter: "intensity", operator: "greater", value: 0.6 }]
    });
    console.log("\u{1F3AD} Adaptive responses configured");
  }
  // Create emotion UI
  createEmotionUI() {
    this.emotionUI = import_ecs12.engine.addEntity();
    import_ecs12.Transform.create(this.emotionUI, {
      position: import_math10.Vector3.create(8, 4, 14),
      scale: import_math10.Vector3.create(3, 3, 0.1)
    });
    import_ecs12.MeshRenderer.setBox(this.emotionUI);
    import_ecs12.Material.setPbrMaterial(this.emotionUI, {
      albedoColor: import_math10.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math10.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs12.engine.addEntity();
    import_ecs12.Transform.create(title, {
      parent: this.emotionUI,
      position: import_math10.Vector3.create(0, 1.2, 0.1),
      scale: import_math10.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs12.TextShape.create(title, {
      text: "\u{1F60A} EMOTION DETECTION",
      textColor: import_math10.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createEmotionIndicators();
    this.createResponseControls();
    this.createProfileDisplay();
  }
  // Create emotion indicators
  createEmotionIndicators() {
    const emotions = ["joy", "stress", "focus", "sadness", "anger", "calm"];
    let xOffset = -1.2;
    emotions.forEach((emotion) => {
      const indicator = import_ecs12.engine.addEntity();
      import_ecs12.Transform.create(indicator, {
        parent: this.emotionUI,
        position: import_math10.Vector3.create(xOffset, 0.6, 0.1),
        scale: import_math10.Vector3.create(0.2, 0.2, 0.1)
      });
      import_ecs12.MeshRenderer.setBox(indicator);
      import_ecs12.Material.setPbrMaterial(indicator, {
        albedoColor: this.getEmotionColor(emotion),
        emissiveColor: this.getEmotionColor(emotion),
        emissiveIntensity: 0.5
      });
      const emotionText = import_ecs12.engine.addEntity();
      import_ecs12.Transform.create(emotionText, {
        parent: indicator,
        position: import_math10.Vector3.create(0, 0, 0.1),
        scale: import_math10.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs12.TextShape.create(emotionText, {
        text: this.getEmotionIcon(emotion),
        textColor: import_math10.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs12.pointerEventsSystem.onPointerDown(
        {
          entity: indicator,
          opts: { button: import_ecs12.InputAction.IA_POINTER, hoverText: `Simulate ${emotion}` }
        },
        () => this.simulateEmotion(emotion)
      );
      xOffset += 0.4;
    });
  }
  // Create response controls
  createResponseControls() {
    const controls = [
      { id: "enable_adaptation", icon: "\u{1F504}", name: "Enable Adaptation" },
      { id: "disable_adaptation", icon: "\u23F8\uFE0F", name: "Disable Adaptation" },
      { id: "calibrate", icon: "\u2699\uFE0F", name: "Calibrate" }
    ];
    let xOffset = -0.8;
    controls.forEach((control) => {
      const button = import_ecs12.engine.addEntity();
      import_ecs12.Transform.create(button, {
        parent: this.emotionUI,
        position: import_math10.Vector3.create(xOffset, 0.2, 0.1),
        scale: import_math10.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs12.MeshRenderer.setBox(button);
      import_ecs12.Material.setPbrMaterial(button, {
        albedoColor: import_math10.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math10.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs12.engine.addEntity();
      import_ecs12.Transform.create(buttonText, {
        parent: button,
        position: import_math10.Vector3.create(0, 0, 0.1),
        scale: import_math10.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs12.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math10.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs12.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs12.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleResponseControl(control.id)
      );
      xOffset += 0.8;
    });
  }
  // Create profile display
  createProfileDisplay() {
    const profileDisplay = import_ecs12.engine.addEntity();
    import_ecs12.Transform.create(profileDisplay, {
      parent: this.emotionUI,
      position: import_math10.Vector3.create(0, -0.4, 0.1),
      scale: import_math10.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs12.MeshRenderer.setBox(profileDisplay);
    import_ecs12.Material.setPbrMaterial(profileDisplay, {
      albedoColor: import_math10.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math10.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const profileText = import_ecs12.engine.addEntity();
    import_ecs12.Transform.create(profileText, {
      parent: profileDisplay,
      position: import_math10.Vector3.create(0, 0, 0.1),
      scale: import_math10.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs12.TextShape.create(profileText, {
      text: "\u{1F464} Profile: Active",
      textColor: import_math10.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Get emotion color
  getEmotionColor(emotion) {
    switch (emotion) {
      case "joy":
        return import_math10.Color4.create(1, 0.8, 0.2, 1);
      case "stress":
        return import_math10.Color4.create(0.8, 0.2, 0.2, 1);
      case "focus":
        return import_math10.Color4.create(0.2, 0.8, 0.8, 1);
      case "sadness":
        return import_math10.Color4.create(0.2, 0.4, 0.8, 1);
      case "anger":
        return import_math10.Color4.create(0.8, 0.2, 0.2, 1);
      case "calm":
        return import_math10.Color4.create(0.2, 0.8, 0.4, 1);
      default:
        return import_math10.Color4.create(0.5, 0.5, 0.5, 1);
    }
  }
  // Get emotion icon
  getEmotionIcon(emotion) {
    switch (emotion) {
      case "joy":
        return "\u{1F60A}";
      case "stress":
        return "\u{1F630}";
      case "focus":
        return "\u{1F3AF}";
      case "sadness":
        return "\u{1F622}";
      case "anger":
        return "\u{1F620}";
      case "calm":
        return "\u{1F60C}";
      default:
        return "\u{1F610}";
    }
  }
  // Create default profiles
  createDefaultProfiles() {
    const defaultProfile = {
      userId: "user_default",
      baselineEmotions: /* @__PURE__ */ new Map([
        ["joy", 0.3],
        ["stress", 0.2],
        ["focus", 0.4],
        ["sadness", 0.1],
        ["anger", 0.1],
        ["calm", 0.5],
        ["neutral", 0.6]
      ]),
      personalityTraits: [
        { trait: "openness", value: 0.7 },
        { trait: "conscientiousness", value: 0.8 },
        { trait: "extraversion", value: 0.6 },
        { trait: "agreeableness", value: 0.7 },
        { trait: "neuroticism", value: 0.3 }
      ],
      preferences: {
        lightingPreference: "adaptive",
        musicPreference: ["ambient", "classical"],
        colorPreference: [import_math10.Color3.create(0.2, 0.4, 0.8), import_math10.Color3.create(0.8, 0.6, 0.2)],
        interactionStyle: "subtle",
        privacyLevel: "medium"
      },
      history: [],
      adaptationLevel: 0.5
    };
    this.emotionProfiles.set(defaultProfile.userId, defaultProfile);
    console.log("\u{1F464} Default emotion profile created");
  }
  // Start emotion engine
  startEmotionEngine() {
    import_ecs12.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.detectEmotions();
      this.processAdaptiveResponses();
      this.updateEmotionHistory();
    });
  }
  // Initialize sensors
  initializeSensors() {
    console.log("\u{1F4E1} Initializing emotion sensors...");
  }
  // Detect emotions
  detectEmotions() {
    if (Math.random() < 0.02) {
      const emotions = ["joy", "stress", "focus", "calm", "sadness", "anger"];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      this.detectEmotion("user_default", randomEmotion, Math.random() * 0.5 + 0.5);
    }
  }
  // Detect emotion
  detectEmotion(userId, emotion, intensity) {
    const profile = this.emotionProfiles.get(userId);
    if (!profile) return;
    const emotionData = {
      id: `emotion_${Date.now()}_${Math.random()}`,
      userId,
      timestamp: Date.now(),
      primaryEmotion: emotion,
      confidence: Math.random() * 0.3 + 0.7,
      intensity,
      triggers: this.identifyTriggers(emotion),
      context: {
        activity: "working",
        location: "office",
        participants: ["user"],
        environment: "virtual_office",
        timeOfDay: (/* @__PURE__ */ new Date()).getHours() < 12 ? "morning" : "afternoon"
      },
      physiological: {
        heartRate: 60 + Math.random() * 40,
        voiceTone: Math.random(),
        facialExpression: Math.random(),
        bodyLanguage: Math.random(),
        responseTime: Math.random() * 1e3 + 200
      }
    };
    this.currentEmotions.set(userId, emotionData);
    this.emotionHistory.push(emotionData);
    if (this.emotionHistory.length > this.maxHistoryLength) {
      this.emotionHistory.shift();
    }
    profile.history.push(emotionData);
    this.adaptProfile(userId, emotionData);
    console.log(`\u{1F60A} Detected emotion: ${emotion} (intensity: ${intensity.toFixed(2)})`);
  }
  // Identify triggers
  identifyTriggers(emotion) {
    const triggers = [];
    switch (emotion) {
      case "joy":
        triggers.push("achievement", "social_interaction", "success");
        break;
      case "stress":
        triggers.push("deadline", "complexity", "interruption");
        break;
      case "focus":
        triggers.push("task_engagement", "goal_orientation");
        break;
      case "sadness":
        triggers.push("setback", "isolation", "failure");
        break;
      case "anger":
        triggers.push("frustration", "obstacle", "conflict");
        break;
      case "calm":
        triggers.push("meditation", "completion", "satisfaction");
        break;
    }
    return triggers;
  }
  // Adapt profile
  adaptProfile(userId, emotionData) {
    const profile = this.emotionProfiles.get(userId);
    if (!profile) return;
    const currentBaseline = profile.baselineEmotions.get(emotionData.primaryEmotion) || 0;
    const newBaseline = currentBaseline * 0.9 + emotionData.intensity * 0.1;
    profile.baselineEmotions.set(emotionData.primaryEmotion, newBaseline);
    profile.adaptationLevel = Math.min(1, profile.adaptationLevel + 0.01);
    console.log(
      `\u{1F4C8} Adapted profile for ${userId} (adaptation level: ${profile.adaptationLevel.toFixed(2)})`
    );
  }
  // Process adaptive responses
  processAdaptiveResponses() {
    this.currentEmotions.forEach((emotionData, userId) => {
      const profile = this.emotionProfiles.get(userId);
      if (!profile) return;
      if (emotionData.intensity > this.adaptationThreshold) {
        this.triggerAdaptiveResponse(emotionData, profile);
      }
    });
  }
  // Trigger adaptive response
  triggerAdaptiveResponse(emotionData, profile) {
    const responseType = this.getBestResponseType(emotionData, profile);
    const responseKey = `${emotionData.primaryEmotion}_${responseType}`;
    for (const [key, response] of this.adaptiveResponses.entries()) {
      if (response.emotionTrigger === emotionData.primaryEmotion) {
        const conditionsMet = response.conditions.every((condition) => {
          const value = emotionData.intensity;
          switch (condition.operator) {
            case "greater":
              return value > condition.value;
            case "less":
              return value < condition.value;
            case "equals":
              return value === condition.value;
            case "between":
              if (Array.isArray(condition.value) && condition.value.length === 2) {
                return value >= condition.value[0] && value <= condition.value[1];
              }
              return false;
            default:
              return false;
          }
        });
        if (conditionsMet) {
          this.executeAdaptiveResponse(response, emotionData);
          return;
        }
      }
    }
  }
  // Get best response type
  getBestResponseType(emotionData, profile) {
    switch (profile.preferences.interactionStyle) {
      case "direct":
        return "environmental";
      case "subtle":
        return "audio";
      case "minimal":
        return "visual";
      default:
        return "environmental";
    }
  }
  // Execute adaptive response
  executeAdaptiveResponse(response, emotionData) {
    console.log(`\u{1F3AD} Executing adaptive response: ${response.action.type}`);
    switch (response.action.type) {
      case "adjust_lighting":
        this.adjustLighting(response.action.parameters);
        break;
      case "play_music":
        this.playMusic(response.action.parameters);
        break;
      case "breathing_guide":
        this.showBreathingGuide(response.action.parameters);
        break;
      case "minimize_distractions":
        this.minimizeDistractions(response.action.parameters);
        break;
      case "adjust_temperature":
        this.adjustTemperature(response.action.parameters);
        break;
    }
    soundSystem.playInteractionSound("powerup");
  }
  // Adjust lighting
  adjustLighting(parameters) {
    const brightness = parameters.get("brightness");
    const color = parameters.get("color");
    const duration = parameters.get("duration");
    console.log(
      `\u{1F4A1} Adjusting lighting: brightness=${brightness}, color=${color}, duration=${duration}ms`
    );
  }
  // Play music
  playMusic(parameters) {
    const genre = parameters.get("genre");
    const volume = parameters.get("volume");
    const duration = parameters.get("duration");
    console.log(`\u{1F3B5} Playing music: genre=${genre}, volume=${volume}, duration=${duration}ms`);
  }
  // Show breathing guide
  showBreathingGuide(parameters) {
    const rate = parameters.get("rate");
    const duration = parameters.get("duration");
    console.log(`\u{1FAC1} Showing breathing guide: rate=${rate}, duration=${duration}ms`);
  }
  // Minimize distractions
  minimizeDistractions(parameters) {
    const uiOpacity = parameters.get("ui_opacity");
    const notifications = parameters.get("notifications");
    const duration = parameters.get("duration");
    console.log(
      `\u{1F507} Minimizing distractions: ui_opacity=${uiOpacity}, notifications=${notifications}`
    );
  }
  // Adjust temperature
  adjustTemperature(parameters) {
    const temperature = parameters.get("temperature");
    const duration = parameters.get("duration");
    console.log(`\u{1F321}\uFE0F Adjusting temperature: ${temperature}\xB0C for ${duration}ms`);
  }
  // Update emotion history
  updateEmotionHistory() {
    const now = Date.now();
    this.currentEmotions.forEach((emotion, userId) => {
      if (now - emotion.timestamp > 3e4) {
        this.currentEmotions.delete(userId);
      }
    });
  }
  // Handle response control
  handleResponseControl(controlId) {
    switch (controlId) {
      case "enable_adaptation":
        this.adaptationThreshold = 0.5;
        console.log("\u{1F504} Emotion adaptation enabled");
        break;
      case "disable_adaptation":
        this.adaptationThreshold = 1;
        console.log("\u23F8\uFE0F Emotion adaptation disabled");
        break;
      case "calibrate":
        this.calibrateSystem();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Simulate emotion
  simulateEmotion(emotion) {
    const intensity = Math.random() * 0.5 + 0.5;
    this.detectEmotion("user_default", emotion, intensity);
    soundSystem.playInteractionSound("click");
  }
  // Calibrate system
  calibrateSystem() {
    console.log("\u2699\uFE0F Calibrating emotion detection system...");
    this.adaptationThreshold = 0.8;
    this.currentEmotions.clear();
    this.detectionSensitivity = 0.7;
    console.log("\u2705 Calibration complete");
    soundSystem.playInteractionSound("powerup");
  }
  // Get current emotion
  getCurrentEmotion(userId) {
    return this.currentEmotions.get(userId);
  }
  // Get emotion profile
  getEmotionProfile(userId) {
    return this.emotionProfiles.get(userId);
  }
  // Get emotion history
  getEmotionHistory() {
    return [...this.emotionHistory];
  }
  // Set detection sensitivity
  setDetectionSensitivity(sensitivity) {
    this.detectionSensitivity = Math.max(0, Math.min(1, sensitivity));
    console.log(`\u{1F4E1} Detection sensitivity set to: ${this.detectionSensitivity}`);
  }
  // Set adaptation threshold
  setAdaptationThreshold(threshold) {
    this.adaptationThreshold = Math.max(0, Math.min(1, threshold));
    console.log(`\u{1F3AD} Adaptation threshold set to: ${this.adaptationThreshold}`);
  }
  // Create custom profile
  createProfile(userId, preferences) {
    const profile = {
      userId,
      baselineEmotions: /* @__PURE__ */ new Map([
        ["joy", 0.3],
        ["stress", 0.2],
        ["focus", 0.4],
        ["sadness", 0.1],
        ["anger", 0.1],
        ["calm", 0.5],
        ["neutral", 0.6]
      ]),
      personalityTraits: [
        { trait: "openness", value: 0.5 },
        { trait: "conscientiousness", value: 0.5 },
        { trait: "extraversion", value: 0.5 },
        { trait: "agreeableness", value: 0.5 },
        { trait: "neuroticism", value: 0.5 }
      ],
      preferences: {
        lightingPreference: "adaptive",
        musicPreference: ["ambient"],
        colorPreference: [import_math10.Color3.create(0.5, 0.5, 0.5)],
        interactionStyle: "subtle",
        privacyLevel: "medium",
        ...preferences
      },
      history: [],
      adaptationLevel: 0.3
    };
    this.emotionProfiles.set(userId, profile);
    console.log(`\u{1F464} Created emotion profile for ${userId}`);
    return profile;
  }
  // Cleanup system
  cleanup() {
    this.emotionProfiles.clear();
    this.currentEmotions.clear();
    this.adaptiveResponses.clear();
    this.emotionHistory = [];
    if (this.emotionUI) {
      import_ecs12.engine.removeEntity(this.emotionUI);
    }
    this.isInitialized = false;
  }
};
var emotionDetectionSystem = new EmotionDetectionSystem();

// src/enhanced-architecture.ts
var import_ecs14 = require("@dcl/sdk/ecs");
var import_math12 = require("@dcl/sdk/math");

// src/utils/godmode-primitives.ts
var import_ecs13 = require("@dcl/sdk/ecs");
var import_math11 = require("@dcl/sdk/math");
function createNeuralPillar(position, scale) {
  const root = import_ecs13.engine.addEntity();
  import_ecs13.Transform.create(root, { position, scale });
  const core = import_ecs13.engine.addEntity();
  import_ecs13.Transform.create(core, {
    parent: root,
    scale: import_math11.Vector3.create(0.8, 1, 0.8)
  });
  import_ecs13.MeshRenderer.setBox(core);
  import_ecs13.Material.setPbrMaterial(core, {
    albedoColor: import_math11.Color4.create(0.1, 0.2, 0.4, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: import_math11.Color4.create(0.1, 0.3, 0.6, 1),
    emissiveIntensity: 2
  });
  for (let i = 0; i < 4; i++) {
    const angle = i * 90 * (Math.PI / 180);
    const panel = import_ecs13.engine.addEntity();
    import_ecs13.Transform.create(panel, {
      parent: root,
      position: import_math11.Vector3.create(Math.cos(angle) * 0.6, 0, Math.sin(angle) * 0.6),
      rotation: import_math11.Quaternion.fromEulerDegrees(0, i * 90, 0),
      scale: import_math11.Vector3.create(0.1, 1, 0.5)
    });
    import_ecs13.MeshRenderer.setBox(panel);
    import_ecs13.Material.setPbrMaterial(panel, {
      albedoColor: import_math11.Color4.create(0.3, 0.6, 1, 0.4),
      roughness: 0,
      metallic: 0.5,
      emissiveColor: import_math11.Color4.create(0, 0.8, 1, 0.5),
      emissiveIntensity: 5
    });
  }
  for (let i = 0; i < 3; i++) {
    const ring = import_ecs13.engine.addEntity();
    import_ecs13.Transform.create(ring, {
      parent: root,
      position: import_math11.Vector3.create(0, (i - 1) * 0.4, 0),
      scale: import_math11.Vector3.create(1.1, 0.05, 1.1)
    });
    import_ecs13.MeshRenderer.setBox(ring);
    import_ecs13.Material.setPbrMaterial(ring, {
      albedoColor: import_math11.Color4.create(1, 1, 1, 1),
      emissiveColor: import_math11.Color4.create(0.5, 0.8, 1, 1),
      emissiveIntensity: 10
    });
  }
  return root;
}
function createSovereignCore(position) {
  const root = import_ecs13.engine.addEntity();
  import_ecs13.Transform.create(root, { position });
  const orb = import_ecs13.engine.addEntity();
  import_ecs13.Transform.create(orb, {
    parent: root,
    scale: import_math11.Vector3.create(0.8, 0.8, 0.8)
  });
  import_ecs13.MeshRenderer.setSphere(orb);
  import_ecs13.Material.setPbrMaterial(orb, {
    albedoColor: import_math11.Color4.create(1, 1, 1, 1),
    emissiveColor: import_math11.Color4.create(1, 0.8, 0.2, 1),
    emissiveIntensity: 15
  });
  const shell = import_ecs13.engine.addEntity();
  import_ecs13.Transform.create(shell, {
    parent: root,
    scale: import_math11.Vector3.create(1.2, 1.2, 1.2)
  });
  import_ecs13.MeshRenderer.setSphere(shell);
  import_ecs13.Material.setPbrMaterial(shell, {
    albedoColor: import_math11.Color4.create(0.6, 0.3, 1, 0.2),
    emissiveColor: import_math11.Color4.create(0.6, 0.3, 1, 0.5),
    emissiveIntensity: 5
  });
  return root;
}

// src/enhanced-architecture.ts
var AnimationSystem = class {
  constructor() {
    this.animations = /* @__PURE__ */ new Map();
  }
  addAnimation(entity, data) {
    this.animations.set(entity, data);
  }
  update(deltaTime) {
    this.animations.forEach((data, entity) => {
      data.time += deltaTime;
      const transform = import_ecs14.Transform.getMutable(entity);
      if (data.type === "pulse") {
        const scale = 1 + Math.sin(data.time * data.speed) * data.intensity;
        transform.scale = import_math12.Vector3.create(scale, scale, scale);
      } else if (data.type === "rotate") {
        transform.rotation = import_math12.Quaternion.fromEulerDegrees(0, data.time * data.speed * 10, 0);
      } else if (data.type === "float") {
        const baseY = data.baseY || 0;
        transform.position.y = baseY + Math.sin(data.time * data.speed) * data.intensity;
      }
    });
  }
};
var animationSystem = new AnimationSystem();
function createEnhancedArchitecture() {
  const holographicFloor = import_ecs14.engine.addEntity();
  import_ecs14.Material.setPbrMaterial(holographicFloor, {
    albedoColor: import_math12.Color4.create(0.1, 0.3, 0.6, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: import_math12.Color4.create(0, 0.2, 0.4, 0.5),
    emissiveIntensity: 2
  });
  const quantumGlass = import_ecs14.engine.addEntity();
  import_ecs14.Material.setPbrMaterial(quantumGlass, {
    albedoColor: import_math12.Color4.create(0.3, 0.6, 1, 0.15),
    roughness: 0,
    metallic: 0.2,
    alphaTest: 0.05,
    emissiveColor: import_math12.Color4.create(0.2, 0.4, 0.8, 0.3),
    emissiveIntensity: 1
  });
  const floor = import_ecs14.engine.addEntity();
  import_ecs14.Transform.create(floor, {
    position: import_math12.Vector3.create(8, 0.01, 8),
    scale: import_math12.Vector3.create(16, 0.1, 16)
  });
  import_ecs14.MeshRenderer.setBox(floor);
  import_ecs14.Material.setPbrMaterial(floor, {
    albedoColor: import_math12.Color4.create(0.05, 0.1, 0.2, 0.9),
    roughness: 0.1,
    metallic: 0.8,
    emissiveColor: import_math12.Color4.create(0, 0.3, 0.6, 0.4),
    emissiveIntensity: 3
  });
  const ceiling = import_ecs14.engine.addEntity();
  import_ecs14.Transform.create(ceiling, {
    position: import_math12.Vector3.create(8, 6, 8),
    scale: import_math12.Vector3.create(16, 0.1, 16)
  });
  import_ecs14.MeshRenderer.setBox(ceiling);
  import_ecs14.Material.setPbrMaterial(ceiling, {
    albedoColor: import_math12.Color4.create(0.1, 0.05, 0.15, 1),
    roughness: 0.2,
    metallic: 0.7,
    emissiveColor: import_math12.Color4.create(0.4, 0.2, 0.8, 0.3),
    emissiveIntensity: 2
  });
  const backWall = import_ecs14.engine.addEntity();
  import_ecs14.Transform.create(backWall, {
    position: import_math12.Vector3.create(8, 3, 15.9),
    scale: import_math12.Vector3.create(16, 6, 0.2)
  });
  import_ecs14.MeshRenderer.setBox(backWall);
  import_ecs14.Material.setPbrMaterial(backWall, {
    albedoColor: import_math12.Color4.create(0.15, 0.1, 0.2, 1),
    roughness: 0.3,
    metallic: 0.6,
    emissiveColor: import_math12.Color4.create(0.3, 0.1, 0.5, 0.2),
    emissiveIntensity: 1
  });
  const leftGlass = import_ecs14.engine.addEntity();
  import_ecs14.Transform.create(leftGlass, {
    position: import_math12.Vector3.create(0.1, 3, 8),
    scale: import_math12.Vector3.create(0.2, 6, 16)
  });
  import_ecs14.MeshRenderer.setBox(leftGlass);
  import_ecs14.Material.setPbrMaterial(leftGlass, {
    albedoColor: import_math12.Color4.create(0.5, 0.7, 1, 0.2),
    roughness: 0,
    metallic: 0.3,
    emissiveColor: import_math12.Color4.create(0.3, 0.5, 1, 0.4),
    emissiveIntensity: 2
  });
  const rightGlass = import_ecs14.engine.addEntity();
  import_ecs14.Transform.create(rightGlass, {
    position: import_math12.Vector3.create(15.9, 3, 8),
    scale: import_math12.Vector3.create(0.2, 6, 16)
  });
  import_ecs14.MeshRenderer.setBox(rightGlass);
  import_ecs14.Material.setPbrMaterial(rightGlass, {
    albedoColor: import_math12.Color4.create(0.5, 0.7, 1, 0.2),
    roughness: 0,
    metallic: 0.3,
    emissiveColor: import_math12.Color4.create(0.3, 0.5, 1, 0.4),
    emissiveIntensity: 2
  });
  const pillar1 = createNeuralPillar(import_math12.Vector3.create(2, 3, 0.5), import_math12.Vector3.create(1.2, 6, 1.2));
  const pillar2 = createNeuralPillar(import_math12.Vector3.create(14, 3, 0.5), import_math12.Vector3.create(1.2, 6, 1.2));
  const neonStrip1 = import_ecs14.engine.addEntity();
  import_ecs14.Transform.create(neonStrip1, {
    position: import_math12.Vector3.create(8, 5.9, 8),
    scale: import_math12.Vector3.create(14, 0.05, 14)
  });
  import_ecs14.MeshRenderer.setBox(neonStrip1);
  import_ecs14.Material.setPbrMaterial(neonStrip1, {
    albedoColor: import_math12.Color4.create(0, 0, 0, 1),
    emissiveColor: import_math12.Color4.create(0.8, 0.3, 1, 1),
    emissiveIntensity: 8
  });
  const neonStrip2 = import_ecs14.engine.addEntity();
  import_ecs14.Transform.create(neonStrip2, {
    position: import_math12.Vector3.create(8, 5.7, 8),
    scale: import_math12.Vector3.create(13, 0.05, 13)
  });
  import_ecs14.MeshRenderer.setBox(neonStrip2);
  import_ecs14.Material.setPbrMaterial(neonStrip2, {
    albedoColor: import_math12.Color4.create(0, 0, 0, 1),
    emissiveColor: import_math12.Color4.create(0.3, 0.8, 1, 1),
    emissiveIntensity: 6
  });
  for (let i = 0; i < 5; i++) {
    const dataStream = import_ecs14.engine.addEntity();
    import_ecs14.Transform.create(dataStream, {
      position: import_math12.Vector3.create(3 + i * 2.5, 3, 2),
      scale: import_math12.Vector3.create(0.1, 4, 0.1)
    });
    import_ecs14.MeshRenderer.setBox(dataStream);
    import_ecs14.Material.setPbrMaterial(dataStream, {
      albedoColor: import_math12.Color4.create(0, 1, 0.8, 0.6),
      roughness: 0,
      metallic: 0.5,
      emissiveColor: import_math12.Color4.create(0, 1, 0.8, 1),
      emissiveIntensity: 4
    });
  }
  const quantumPlatform = import_ecs14.engine.addEntity();
  import_ecs14.Transform.create(quantumPlatform, {
    position: import_math12.Vector3.create(8, 0.5, 8),
    scale: import_math12.Vector3.create(4, 0.2, 4)
  });
  import_ecs14.MeshRenderer.setBox(quantumPlatform);
  import_ecs14.Material.setPbrMaterial(quantumPlatform, {
    albedoColor: import_math12.Color4.create(0.2, 0.1, 0.4, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: import_math12.Color4.create(0.6, 0.3, 1, 0.6),
    emissiveIntensity: 5
  });
  for (let i = 0; i < 3; i++) {
    const displayPanel = import_ecs14.engine.addEntity();
    import_ecs14.Transform.create(displayPanel, {
      position: import_math12.Vector3.create(4 + i * 4, 4, 12),
      scale: import_math12.Vector3.create(2, 1.5, 0.1)
    });
    import_ecs14.MeshRenderer.setBox(displayPanel);
    import_ecs14.Material.setPbrMaterial(displayPanel, {
      albedoColor: import_math12.Color4.create(0, 0, 0, 0.9),
      roughness: 0.1,
      metallic: 0.8,
      emissiveColor: import_math12.Color4.create(0.2, 0.8, 1, 0.4),
      emissiveIntensity: 3
    });
  }
  const energyCore = createSovereignCore(import_math12.Vector3.create(8, 2, 8));
  createArtGallery();
  animationSystem.addAnimation(energyCore, {
    type: "float",
    speed: 0.8,
    intensity: 0.3,
    time: 0,
    baseY: 2
  });
  import_ecs14.engine.addSystem(() => {
    animationSystem.update(0.016);
  });
}
function createArtGallery() {
  console.log("\u{1F3A8} Creating Art Gallery...");
}

// src/enhanced-interactables.ts
var import_ecs15 = require("@dcl/sdk/ecs");
var import_math13 = require("@dcl/sdk/math");
var systemStatusEntity;
var alertSystemEntity;
function createEnhancedInteractables() {
  const mainDashboard = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(mainDashboard, {
    position: import_math13.Vector3.create(8, 3, 15.5),
    scale: import_math13.Vector3.create(8, 4, 0.2)
  });
  import_ecs15.MeshRenderer.setBox(mainDashboard);
  import_ecs15.Material.setPbrMaterial(mainDashboard, {
    albedoColor: import_math13.Color4.create(0, 0, 0, 0.95),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: import_math13.Color4.create(0.1, 0.3, 0.6, 0.3),
    emissiveIntensity: 2
  });
  const titleText = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(titleText, {
    parent: mainDashboard,
    position: import_math13.Vector3.create(0, 0.4, -0.8),
    scale: import_math13.Vector3.create(0.125, 0.25, 1)
  });
  import_ecs15.TextShape.create(titleText, {
    text: "\u26A1 AIGESTION NEXUS HQ \u26A1",
    textColor: import_math13.Color4.create(0.8, 0.5, 1, 1),
    fontSize: 6,
    textAlign: 3,
    outlineWidth: 0.1,
    outlineColor: import_math13.Color4.create(0.5, 0.2, 0.8, 1)
  });
  systemStatusEntity = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(systemStatusEntity, {
    parent: mainDashboard,
    position: import_math13.Vector3.create(0, -0.1, -0.8),
    scale: import_math13.Vector3.create(0.125, 0.25, 1)
  });
  import_ecs15.TextShape.create(systemStatusEntity, {
    text: "\u{1F525} SYSTEMS ONLINE \u{1F525}\n\u26A1 Quantum Core: ACTIVE\n\u{1F310} Network: OPTIMAL\n\u{1F6E1}\uFE0F Security: ENHANCED",
    textColor: import_math13.Color4.create(0, 1, 0.8, 1),
    fontSize: 3,
    textAlign: 3
  });
  alertSystemEntity = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(alertSystemEntity, {
    parent: mainDashboard,
    position: import_math13.Vector3.create(0, -0.5, -0.8),
    scale: import_math13.Vector3.create(0.125, 0.25, 1)
  });
  import_ecs15.TextShape.create(alertSystemEntity, {
    text: "\u{1F4E1} Real-time Monitoring Active...",
    textColor: import_math13.Color4.create(1, 1, 0, 1),
    fontSize: 2.5,
    textAlign: 3
  });
  const quantumPanel = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(quantumPanel, {
    position: import_math13.Vector3.create(2, 1.5, 10),
    scale: import_math13.Vector3.create(2, 2, 0.3)
  });
  import_ecs15.MeshRenderer.setBox(quantumPanel);
  import_ecs15.Material.setPbrMaterial(quantumPanel, {
    albedoColor: import_math13.Color4.create(0.2, 0.1, 0.4, 0.9),
    roughness: 0.2,
    metallic: 0.8,
    emissiveColor: import_math13.Color4.create(0.6, 0.3, 1, 0.5),
    emissiveIntensity: 3
  });
  const quantumLabel = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(quantumLabel, {
    parent: quantumPanel,
    position: import_math13.Vector3.create(0, 0.3, -0.6),
    scale: import_math13.Vector3.create(0.5, 0.5, 1)
  });
  import_ecs15.TextShape.create(quantumLabel, {
    text: "QUANTUM\nCORE",
    textColor: import_math13.Color4.create(0.8, 0.5, 1, 1),
    fontSize: 4,
    textAlign: 3
  });
  const networkPanel = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(networkPanel, {
    position: import_math13.Vector3.create(14, 1.5, 10),
    scale: import_math13.Vector3.create(2, 2, 0.3)
  });
  import_ecs15.MeshRenderer.setBox(networkPanel);
  import_ecs15.Material.setPbrMaterial(networkPanel, {
    albedoColor: import_math13.Color4.create(0.1, 0.3, 0.6, 0.9),
    roughness: 0.2,
    metallic: 0.8,
    emissiveColor: import_math13.Color4.create(0.2, 0.6, 1, 0.5),
    emissiveIntensity: 3
  });
  const networkLabel = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(networkLabel, {
    parent: networkPanel,
    position: import_math13.Vector3.create(0, 0.3, -0.6),
    scale: import_math13.Vector3.create(0.5, 0.5, 1)
  });
  import_ecs15.TextShape.create(networkLabel, {
    text: "NETWORK\nHUB",
    textColor: import_math13.Color4.create(0.5, 0.8, 1, 1),
    fontSize: 4,
    textAlign: 3
  });
  const masterControl = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(masterControl, {
    position: import_math13.Vector3.create(8, 2, 8),
    scale: import_math13.Vector3.create(1.5, 1.5, 1.5)
  });
  import_ecs15.MeshRenderer.setBox(masterControl);
  import_ecs15.Material.setPbrMaterial(masterControl, {
    albedoColor: import_math13.Color4.create(1, 0.8, 0.2, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: import_math13.Color4.create(1, 0.8, 0.2, 1),
    emissiveIntensity: 8
  });
  import_ecs15.pointerEventsSystem.onPointerDown(
    {
      entity: masterControl,
      opts: { button: import_ecs15.InputAction.IA_POINTER, hoverText: "\u{1F3AE} MASTER CONTROL SYSTEM" }
    },
    () => {
      console.log("\u{1F3AE} Master Control Activated - Quantum Systems Online");
      soundSystem.playInteractionSound("powerup");
      updateSystemStatus("QUANTUM_MODE", true);
    }
  );
  import_ecs15.pointerEventsSystem.onPointerDown(
    {
      entity: quantumPanel,
      opts: { button: import_ecs15.InputAction.IA_POINTER, hoverText: "\u26A1 Activate Quantum Core" }
    },
    () => {
      console.log("\u26A1 Quantum Core Activation Sequence");
      soundSystem.playInteractionSound("powerup");
      updateSystemStatus("QUANTUM_CORE", true);
    }
  );
  import_ecs15.pointerEventsSystem.onPointerDown(
    {
      entity: networkPanel,
      opts: { button: import_ecs15.InputAction.IA_POINTER, hoverText: "\u{1F310} Network Diagnostics" }
    },
    () => {
      console.log("\u{1F310} Network Diagnostics Running");
      soundSystem.playInteractionSound("click");
      updateSystemStatus("NETWORK_SCAN", true);
    }
  );
  for (let i = 0; i < 5; i++) {
    const dataOrb = import_ecs15.engine.addEntity();
    import_ecs15.Transform.create(dataOrb, {
      position: import_math13.Vector3.create(3 + i * 1.5, 3.5, 5 + i * 0.5),
      scale: import_math13.Vector3.create(0.5, 0.5, 0.5)
    });
    import_ecs15.MeshRenderer.setBox(dataOrb);
    import_ecs15.Material.setPbrMaterial(dataOrb, {
      albedoColor: import_math13.Color4.create(0, 1, 0.8, 0.7),
      roughness: 0,
      metallic: 0.8,
      emissiveColor: import_math13.Color4.create(0, 1, 0.8, 1),
      emissiveIntensity: 5
    });
    import_ecs15.pointerEventsSystem.onPointerDown(
      {
        entity: dataOrb,
        opts: { button: import_ecs15.InputAction.IA_POINTER, hoverText: `\u{1F4CA} Data Node ${i + 1}` }
      },
      () => {
        console.log(`\u{1F4CA} Accessing Data Node ${i + 1}`);
        updateSystemStatus(`DATA_NODE_${i + 1}`, true);
      }
    );
  }
  const securityTerminal = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(securityTerminal, {
    position: import_math13.Vector3.create(8, 1, 2),
    scale: import_math13.Vector3.create(3, 2, 0.5)
  });
  import_ecs15.MeshRenderer.setBox(securityTerminal);
  import_ecs15.Material.setPbrMaterial(securityTerminal, {
    albedoColor: import_math13.Color4.create(0.1, 0.2, 0.3, 0.9),
    roughness: 0.3,
    metallic: 0.7,
    emissiveColor: import_math13.Color4.create(0.2, 0.4, 0.6, 0.4),
    emissiveIntensity: 2
  });
  const securityLabel = import_ecs15.engine.addEntity();
  import_ecs15.Transform.create(securityLabel, {
    parent: securityTerminal,
    position: import_math13.Vector3.create(0, 0.2, -0.6),
    scale: import_math13.Vector3.create(0.33, 0.5, 1)
  });
  import_ecs15.TextShape.create(securityLabel, {
    text: "\u{1F6E1}\uFE0F SECURITY\nTERMINAL",
    textColor: import_math13.Color4.create(0.5, 0.8, 1, 1),
    fontSize: 3,
    textAlign: 3
  });
  import_ecs15.pointerEventsSystem.onPointerDown(
    {
      entity: securityTerminal,
      opts: { button: import_ecs15.InputAction.IA_POINTER, hoverText: "\u{1F6E1}\uFE0F Access Security Systems" }
    },
    () => {
      console.log("\u{1F6E1}\uFE0F Security Systems Accessed");
      updateSystemStatus("SECURITY_BREACH", false);
    }
  );
  for (let i = 0; i < 3; i++) {
    const energyCrystal = import_ecs15.engine.addEntity();
    import_ecs15.Transform.create(energyCrystal, {
      position: import_math13.Vector3.create(4 + i * 4, 1, 14),
      scale: import_math13.Vector3.create(0.8, 1.2, 0.8)
    });
    import_ecs15.MeshRenderer.setBox(energyCrystal);
    import_ecs15.Material.setPbrMaterial(energyCrystal, {
      albedoColor: import_math13.Color4.create(0.8, 0.2, 1, 0.8),
      roughness: 0.1,
      metallic: 0.9,
      emissiveColor: import_math13.Color4.create(0.8, 0.2, 1, 1),
      emissiveIntensity: 6
    });
    import_ecs15.pointerEventsSystem.onPointerDown(
      {
        entity: energyCrystal,
        opts: { button: import_ecs15.InputAction.IA_POINTER, hoverText: `\u{1F48E} Energy Crystal ${i + 1}` }
      },
      () => {
        console.log(`\u{1F48E} Energy Crystal ${i + 1} Activated`);
        updateSystemStatus(`ENERGY_BOOST_${i + 1}`, true);
      }
    );
  }
}
function updateSystemStatus(system, active) {
  if (!systemStatusEntity) return;
  const status = active ? "\u2705 ACTIVE" : "\u26A0\uFE0F INACTIVE";
  const color = active ? import_math13.Color4.create(0, 1, 0.5, 1) : import_math13.Color4.create(1, 0.5, 0, 1);
  import_ecs15.TextShape.getMutable(systemStatusEntity).text = `\u{1F525} SYSTEMS ONLINE \u{1F525}
\u26A1 Quantum Core: ${status}
\u{1F310} Network: OPTIMAL
\u{1F6E1}\uFE0F Security: ENHANCED
\u{1F4E1} Last Action: ${system}`;
  import_ecs15.TextShape.getMutable(systemStatusEntity).textColor = color;
}
function updateAlert(message, alertType = "INFO") {
  if (!alertSystemEntity) return;
  const colors = {
    INFO: import_math13.Color4.create(0, 1, 1, 1),
    WARNING: import_math13.Color4.create(1, 1, 0, 1),
    CRITICAL: import_math13.Color4.create(1, 0, 0, 1)
  };
  const icons = {
    INFO: "\u{1F4E1}",
    WARNING: "\u26A0\uFE0F",
    CRITICAL: "\u{1F6A8}"
  };
  import_ecs15.TextShape.getMutable(alertSystemEntity).text = `${icons[alertType]} ${message}`;
  import_ecs15.TextShape.getMutable(alertSystemEntity).textColor = colors[alertType];
}

// src/enhanced-network.ts
var BACKEND_URL = "http://localhost:5000";
var API_KEY = "nexus_sovereign_dev_key_2026";
async function fetchEnhancedSystemStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const cpuLoad = Math.floor(Math.random() * 40) + 30;
      const systemHealth = cpuLoad > 60 ? "CRITICAL" : cpuLoad > 45 ? "WARNING" : "OPTIMAL";
      resolve({
        activeUsers: Math.floor(Math.random() * 800) + 1500,
        systemHealth,
        cpuLoad,
        quantumCoreStatus: Math.random() > 0.95 ? "OVERLOAD" : Math.random() > 0.1 ? "ONLINE" : "OFFLINE",
        networkLatency: Math.floor(Math.random() * 50) + 10,
        securityLevel: Math.random() > 0.98 ? "COMPROMISED" : Math.random() > 0.3 ? "ENHANCED" : "STANDARD",
        energyReserves: Math.floor(Math.random() * 60) + 40,
        dataStreamActive: Math.random() > 0.2,
        lastUpdate: (/* @__PURE__ */ new Date()).toLocaleTimeString()
      });
    }, 300);
  });
}
async function fetchAlertMessages() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alerts = [
        {
          id: "ALERT_001",
          message: "Quantum core synchronization complete",
          type: "INFO",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          priority: 1
        },
        {
          id: "ALERT_002",
          message: "Network latency optimization in progress",
          type: "INFO",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          priority: 2
        }
      ];
      if (Math.random() > 0.8) {
        alerts.push({
          id: "ALERT_003",
          message: "Unusual activity detected in security perimeter",
          type: "WARNING",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          priority: 5
        });
      }
      resolve(alerts);
    }, 150);
  });
}
async function reportPresence(zoneId, occupied) {
  console.log(`[Network] Reporting presence change: ${zoneId} -> ${occupied}`);
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/iot/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
      },
      body: JSON.stringify({
        event: occupied ? "meta_presence_enter" : "meta_presence_exit",
        source: "decentraland-parcel",
        data: {
          zone: zoneId,
          timestamp: Date.now(),
          platform: "decentraland"
        }
      })
    });
    return response.status === 200;
  } catch (error) {
    console.warn(`[Network] Presence sync failed (expected in isolated local): ${error}`);
    return false;
  }
}
async function runSystemDiagnostics() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const components = {
        quantumCore: Math.random() > 0.9 ? "FAIL" : Math.random() > 0.3 ? "OK" : "WARNING",
        network: Math.random() > 0.95 ? "FAIL" : Math.random() > 0.2 ? "OK" : "WARNING",
        security: Math.random() > 0.98 ? "FAIL" : Math.random() > 0.1 ? "OK" : "WARNING",
        energy: Math.random() > 0.85 ? "FAIL" : Math.random() > 0.4 ? "OK" : "WARNING"
      };
      const failCount = Object.values(components).filter((status) => status === "FAIL").length;
      const warningCount = Object.values(components).filter((status) => status === "WARNING").length;
      let overall = "HEALTHY";
      if (failCount > 0) overall = "CRITICAL";
      else if (warningCount > 1) overall = "WARNING";
      resolve({ overall, components });
    }, 1200);
  });
}

// src/gesture-recognition.ts
var import_ecs16 = require("@dcl/sdk/ecs");
var import_math14 = require("@dcl/sdk/math");
var GestureRecognitionSystem = class {
  constructor() {
    this.gestures = /* @__PURE__ */ new Map();
    this.gestureActions = /* @__PURE__ */ new Map();
    this.gestureTrails = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.gestureHistory = [];
    this.maxHistoryLength = 10;
    this.handTracking = {
      isActive: false,
      leftHand: null,
      rightHand: null,
      lastUpdate: Date.now()
    };
  }
  // Initialize gesture recognition system
  initialize() {
    console.log("\u{1F44B} Gesture Recognition System Initializing...");
    this.setupGestureActions();
    this.createGestureUI();
    this.startHandTracking();
    this.startGestureRecognition();
    this.isInitialized = true;
    console.log("\u{1F44B} Gesture Recognition System Ready!");
  }
  // Setup gesture actions
  setupGestureActions() {
    this.addGestureAction("swipe_left", "navigate", { direction: "left" }, true);
    this.addGestureAction("swipe_right", "navigate", { direction: "right" }, true);
    this.addGestureAction("swipe_up", "navigate", { direction: "up" }, true);
    this.addGestureAction("swipe_down", "navigate", { direction: "down" }, true);
    this.addGestureAction("push", "push_object", { force: 1 }, true);
    this.addGestureAction("pull", "pull_object", { force: 1 }, true);
    this.addGestureAction("point", "select_target", { mode: "single" }, true);
    this.addGestureAction("pinch", "zoom", { scale: 1 }, true);
    this.addGestureAction("spread", "zoom", { scale: 2 }, true);
    this.addGestureAction("wave", "toggle_menu", {}, true);
    this.addGestureAction("thumbs_up", "confirm", {}, true);
    this.addGestureAction("thumbs_down", "cancel", {}, true);
    this.addGestureAction("circle", "rotate", { angle: 360 }, true);
    this.addGestureAction("double_swipe", "switch_scene", {}, true);
    this.addGestureAction("hold", "open_settings", {}, true);
  }
  // Add gesture action
  addGestureAction(gestureType, action, parameters, enabled) {
    const gestureAction = {
      gestureType,
      action,
      parameters,
      enabled
    };
    this.gestureActions.set(gestureType + "_" + action, gestureAction);
  }
  // Create gesture UI
  createGestureUI() {
    this.gestureUI = import_ecs16.engine.addEntity();
    import_ecs16.Transform.create(this.gestureUI, {
      position: import_math14.Vector3.create(8, 5, 8),
      scale: import_math14.Vector3.create(3, 1, 0.1)
    });
    import_ecs16.MeshRenderer.setBox(this.gestureUI);
    import_ecs16.Material.setPbrMaterial(this.gestureUI, {
      albedoColor: import_math14.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math14.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs16.engine.addEntity();
    import_ecs16.Transform.create(title, {
      parent: this.gestureUI,
      position: import_math14.Vector3.create(0, 0.3, 0.1),
      scale: import_math14.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs16.TextShape.create(title, {
      text: "\u{1F44B} GESTURE CONTROL ACTIVE",
      textColor: import_math14.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createGestureIndicators();
  }
  // Create gesture indicators
  createGestureIndicators() {
    const indicatorPositions = [
      { x: -1, y: -0.2, gesture: "\u{1F446}" },
      { x: -0.5, y: -0.2, gesture: "\u{1F91A}" },
      { x: 0, y: -0.2, gesture: "\u{1F44C}" },
      { x: 0.5, y: -0.2, gesture: "\u{1F44B}" },
      { x: 1, y: -0.2, gesture: "\u{1F44D}" }
    ];
    indicatorPositions.forEach((pos) => {
      const indicator = import_ecs16.engine.addEntity();
      import_ecs16.Transform.create(indicator, {
        parent: this.gestureUI,
        position: import_math14.Vector3.create(pos.x, pos.y, 0.1),
        scale: import_math14.Vector3.create(0.2, 0.2, 0.1)
      });
      import_ecs16.MeshRenderer.setBox(indicator);
      import_ecs16.Material.setPbrMaterial(indicator, {
        albedoColor: import_math14.Color4.create(0.2, 0.8, 0.2, 1),
        emissiveColor: import_math14.Color4.create(0.2, 0.8, 0.2, 0.5),
        emissiveIntensity: 1
      });
      const gestureText = import_ecs16.engine.addEntity();
      import_ecs16.Transform.create(gestureText, {
        parent: indicator,
        position: import_math14.Vector3.create(0, 0, 0.1),
        scale: import_math14.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs16.TextShape.create(gestureText, {
        text: pos.gesture,
        textColor: import_math14.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
    });
  }
  // Start hand tracking simulation
  startHandTracking() {
    this.handTracking.isActive = true;
    import_ecs16.engine.addSystem(() => {
      if (!this.isInitialized || !this.handTracking.isActive) return;
      this.updateHandTracking();
    });
  }
  // Update hand tracking
  updateHandTracking() {
    const time = Date.now() / 1e3;
    this.handTracking.rightHand = {
      position: import_math14.Vector3.create(
        8 + Math.sin(time * 0.5) * 2,
        2 + Math.cos(time * 0.3) * 0.5,
        8 + Math.cos(time * 0.4) * 2
      ),
      rotation: import_math14.Quaternion.fromEulerDegrees(
        Math.sin(time * 0.2) * 20,
        Math.cos(time * 0.3) * 30,
        Math.sin(time * 0.4) * 10
      ),
      fingers: this.simulateFingers(time),
      confidence: 0.9
    };
    this.handTracking.leftHand = {
      position: import_math14.Vector3.create(
        8 + Math.cos(time * 0.4) * 1.5,
        2 + Math.sin(time * 0.5) * 0.3,
        8 + Math.sin(time * 0.3) * 1.5
      ),
      rotation: import_math14.Quaternion.fromEulerDegrees(
        Math.cos(time * 0.3) * 15,
        Math.sin(time * 0.4) * 25,
        Math.cos(time * 0.2) * 8
      ),
      fingers: this.simulateFingers(time + Math.PI),
      confidence: 0.85
    };
    this.handTracking.lastUpdate = Date.now();
  }
  // Simulate finger data
  simulateFingers(time) {
    return [
      {
        id: "thumb",
        position: import_math14.Vector3.create(0.1, 0.1, 0.05),
        isExtended: Math.sin(time * 2) > 0,
        confidence: 0.9
      },
      {
        id: "index",
        position: import_math14.Vector3.create(0.15, 0.15, 0.1),
        isExtended: Math.sin(time * 3) > -0.5,
        confidence: 0.95
      },
      {
        id: "middle",
        position: import_math14.Vector3.create(0.1, 0.2, 0.08),
        isExtended: Math.sin(time * 2.5) > -0.3,
        confidence: 0.9
      },
      {
        id: "ring",
        position: import_math14.Vector3.create(0.05, 0.18, 0.06),
        isExtended: Math.sin(time * 2.2) > -0.2,
        confidence: 0.85
      },
      {
        id: "pinky",
        position: import_math14.Vector3.create(0, 0.15, 0.04),
        isExtended: Math.sin(time * 2.8) > -0.1,
        confidence: 0.8
      }
    ];
  }
  // Start gesture recognition
  startGestureRecognition() {
    import_ecs16.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.detectGestures();
      this.updateGestureTrails();
    });
  }
  // Detect gestures
  detectGestures() {
    if (!this.handTracking.rightHand) return;
    const hand = this.handTracking.rightHand;
    const currentTime = Date.now();
    this.detectSwipeGesture(hand, currentTime);
    this.detectCircleGesture(hand, currentTime);
    this.detectPinchGesture(hand, currentTime);
    this.detectWaveGesture(hand, currentTime);
    this.detectPointGesture(hand, currentTime);
    this.detectThumbsGesture(hand, currentTime);
  }
  // Detect swipe gesture
  detectSwipeGesture(hand, currentTime) {
    const gestureId = "swipe";
    let existingGesture = this.gestures.get(gestureId);
    if (!existingGesture) {
      existingGesture = {
        id: gestureId,
        name: "Swipe",
        type: "swipe",
        confidence: 0,
        isActive: false,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position]
      };
      this.gestures.set(gestureId, existingGesture);
    }
    existingGesture.path.push(hand.position);
    existingGesture.endPoint = hand.position;
    existingGesture.duration = currentTime - (existingGesture.duration || currentTime);
    const distance = import_math14.Vector3.distance(existingGesture.startPoint, existingGesture.endPoint);
    if (distance > 1 && existingGesture.duration > 500) {
      existingGesture.isActive = true;
      existingGesture.confidence = Math.min(1, distance / 2);
      this.onGestureDetected(existingGesture);
      this.gestures.delete(gestureId);
    }
  }
  // Detect circle gesture
  detectCircleGesture(hand, currentTime) {
    const gestureId = "circle";
    let existingGesture = this.gestures.get(gestureId);
    if (!existingGesture) {
      existingGesture = {
        id: gestureId,
        name: "Circle",
        type: "circle",
        confidence: 0,
        isActive: false,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position]
      };
      this.gestures.set(gestureId, existingGesture);
    }
    existingGesture.path.push(hand.position);
    existingGesture.duration = currentTime - (existingGesture.duration || currentTime);
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
  detectPinchGesture(hand, currentTime) {
    const thumbExtended = hand.fingers.find((f) => f.id === "thumb")?.isExtended;
    const indexExtended = hand.fingers.find((f) => f.id === "index")?.isExtended;
    if (thumbExtended && indexExtended) {
      const thumb = hand.fingers.find((f) => f.id === "thumb");
      const index = hand.fingers.find((f) => f.id === "index");
      if (thumb && index) {
        const distance = import_math14.Vector3.distance(thumb.position, index.position);
        if (distance < 0.05) {
          const gesture = {
            id: "pinch",
            name: "Pinch",
            type: "pinch",
            confidence: 0.9,
            isActive: true,
            startPoint: hand.position,
            endPoint: hand.position,
            duration: 0,
            path: [hand.position]
          };
          this.onGestureDetected(gesture);
        }
      }
    }
  }
  // Detect wave gesture
  detectWaveGesture(hand, currentTime) {
    const gestureId = "wave";
    let existingGesture = this.gestures.get(gestureId);
    if (!existingGesture) {
      existingGesture = {
        id: gestureId,
        name: "Wave",
        type: "wave",
        confidence: 0,
        isActive: false,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position]
      };
      this.gestures.set(gestureId, existingGesture);
    }
    existingGesture.path.push(hand.position);
    existingGesture.duration = currentTime - (existingGesture.duration || currentTime);
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
  detectPointGesture(hand, currentTime) {
    const indexExtended = hand.fingers.find((f) => f.id === "index")?.isExtended;
    const otherFingersExtended = hand.fingers.filter((f) => f.id !== "index").some((f) => f.isExtended);
    if (indexExtended && !otherFingersExtended) {
      const gesture = {
        id: "point",
        name: "Point",
        type: "point",
        confidence: 0.85,
        isActive: true,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position]
      };
      this.onGestureDetected(gesture);
    }
  }
  // Detect thumbs up/down gesture
  detectThumbsGesture(hand, currentTime) {
    const thumbExtended = hand.fingers.find((f) => f.id === "thumb")?.isExtended;
    const otherFingersExtended = hand.fingers.filter((f) => f.id !== "thumb").some((f) => f.isExtended);
    if (thumbExtended && !otherFingersExtended) {
      const gesture = {
        id: "thumbs_up",
        name: "Thumbs Up",
        type: "thumbs_up",
        confidence: 0.9,
        isActive: true,
        startPoint: hand.position,
        endPoint: hand.position,
        duration: 0,
        path: [hand.position]
      };
      this.onGestureDetected(gesture);
    }
  }
  // Check if path is circular
  isCircularPath(path) {
    if (path.length < 10) return false;
    const center = import_math14.Vector3.lerp(path[0], path[path.length - 1], 0.5);
    const radius = import_math14.Vector3.distance(path[0], center);
    let isCircular = true;
    for (let i = 1; i < path.length; i++) {
      const distance = import_math14.Vector3.distance(path[i], center);
      if (Math.abs(distance - radius) > radius * 0.3) {
        isCircular = false;
        break;
      }
    }
    return isCircular;
  }
  // Check for waving motion
  isWavingMotion(path) {
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
  onGestureDetected(gesture) {
    console.log(
      "\u{1F44B} Gesture detected: " + gesture.name + " (confidence: " + gesture.confidence.toFixed(2) + ")"
    );
    this.gestureHistory.push(gesture);
    if (this.gestureHistory.length > this.maxHistoryLength) {
      this.gestureHistory.shift();
    }
    this.gestureActions.forEach((action, key) => {
      if (action.enabled && key.startsWith(gesture.type)) {
        this.executeGestureAction(action);
      }
    });
    soundSystem.playInteractionSound("click");
    this.createGestureFeedback(gesture);
  }
  // Execute gesture action
  executeGestureAction(action) {
    console.log("\u{1F3AF} Executing action: " + action.action + " with parameters:", action.parameters);
    switch (action.action) {
      case "navigate":
        console.log(`\u{1F9ED} Navigating ${action.parameters.direction}`);
        break;
      case "push_object":
        console.log(`\u{1F4AA} Pushing object with force: ${action.parameters.force}`);
        break;
      case "pull_object":
        console.log(`\u{1F3AF} Pulling object with force: ${action.parameters.force}`);
        break;
      case "select_target":
        console.log(`\u{1F446} Selecting target in ${action.parameters.mode} mode`);
        break;
      case "zoom":
        console.log(`\u{1F50D} Zooming to scale: ${action.parameters.scale}`);
        break;
      case "toggle_menu":
        console.log(`\u{1F4CB} Toggling menu`);
        break;
      case "confirm":
        console.log(`\u2705 Confirming action`);
        break;
      case "cancel":
        console.log(`\u274C Canceling action`);
        break;
      case "rotate":
        console.log(`\u{1F504} Rotating by ${action.parameters.angle} degrees`);
        break;
      case "switch_scene":
        console.log(`\u{1F3AC} Switching scene`);
        break;
      case "open_settings":
        console.log(`\u2699\uFE0F Opening settings`);
        break;
    }
  }
  // Create gesture feedback
  createGestureFeedback(gesture) {
    const feedback = import_ecs16.engine.addEntity();
    import_ecs16.Transform.create(feedback, {
      position: gesture.endPoint,
      scale: import_math14.Vector3.create(0.2, 0.2, 0.2)
    });
    import_ecs16.MeshRenderer.setSphere(feedback);
    import_ecs16.Material.setPbrMaterial(feedback, {
      albedoColor: import_math14.Color4.create(0.2, 0.8, 1, 0.8),
      emissiveColor: import_math14.Color4.create(0.2, 0.8, 1, 1),
      emissiveIntensity: 3
    });
    this.animateGestureFeedback(feedback);
  }
  // Animate gesture feedback
  animateGestureFeedback(feedback) {
    let scale = 0.2;
    let opacity = 1;
    const animate = () => {
      scale += 0.02;
      opacity -= 0.02;
      const transform = import_ecs16.Transform.getMutable(feedback);
      transform.scale = import_math14.Vector3.create(scale, scale, scale);
      const material = import_ecs16.Material.get(feedback);
      import_ecs16.Material.setPbrMaterial(feedback, {
        ...material,
        albedoColor: import_math14.Color4.create(0.2, 0.8, 1, opacity)
      });
      if (opacity > 0) {
        setTimeout(animate, 16);
      } else {
        import_ecs16.engine.removeEntity(feedback);
      }
    };
    animate();
  }
  // Update gesture trails
  updateGestureTrails() {
    if (!this.handTracking.rightHand) return;
    const hand = this.handTracking.rightHand;
    const trailId = "right_hand";
    if (!this.gestureTrails.has(trailId)) {
      this.gestureTrails.set(trailId, []);
    }
    const trail = this.gestureTrails.get(trailId);
    const trailPoint = import_ecs16.engine.addEntity();
    import_ecs16.Transform.create(trailPoint, {
      position: hand.position,
      scale: import_math14.Vector3.create(0.05, 0.05, 0.05)
    });
    import_ecs16.MeshRenderer.setSphere(trailPoint);
    import_ecs16.Material.setPbrMaterial(trailPoint, {
      albedoColor: import_math14.Color4.create(0.5, 0.8, 1, 0.6),
      emissiveColor: import_math14.Color4.create(0.5, 0.8, 1, 0.8),
      emissiveIntensity: 2
    });
    trail.push(trailPoint);
    if (trail.length > 20) {
      const oldPoint = trail.shift();
      import_ecs16.engine.removeEntity(oldPoint);
    }
    trail.forEach((point, index) => {
      const opacity = index / trail.length * 0.6;
      const material = import_ecs16.Material.get(point);
      import_ecs16.Material.setPbrMaterial(point, {
        ...material,
        albedoColor: import_math14.Color4.create(0.5, 0.8, 1, opacity)
      });
    });
  }
  // Enable/disable gesture recognition
  setGestureRecognition(enabled) {
    this.handTracking.isActive = enabled;
    console.log(`\u{1F44B} Gesture recognition ${enabled ? "enabled" : "disabled"}`);
  }
  // Get gesture history
  getGestureHistory() {
    return [...this.gestureHistory];
  }
  // Get current hand tracking data
  getHandTracking() {
    return { ...this.handTracking };
  }
  // Enable/disable gesture action
  setGestureAction(gestureType, action, enabled) {
    const key = `${gestureType}_${action}`;
    const gestureAction = this.gestureActions.get(key);
    if (gestureAction) {
      gestureAction.enabled = enabled;
      console.log(`\u{1F44B} Gesture action ${key} ${enabled ? "enabled" : "disabled"}`);
    }
  }
  // Cleanup system
  cleanup() {
    this.gestureTrails.forEach((trail) => {
      trail.forEach((point) => import_ecs16.engine.removeEntity(point));
    });
    this.gestureTrails.clear();
    this.gestures.clear();
    this.gestureHistory = [];
    if (this.gestureUI) {
      import_ecs16.engine.removeEntity(this.gestureUI);
    }
    this.gestureActions.clear();
    this.isInitialized = false;
  }
};
var gestureSystem = new GestureRecognitionSystem();

// src/haptic-feedback.ts
var import_ecs17 = require("@dcl/sdk/ecs");
var import_math15 = require("@dcl/sdk/math");
var HapticFeedbackSystem = class {
  constructor() {
    this.devices = /* @__PURE__ */ new Map();
    this.patterns = /* @__PURE__ */ new Map();
    this.zones = /* @__PURE__ */ new Map();
    this.activeEvents = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.globalIntensity = 0.6;
    this.isSystemEnabled = true;
    this.hapticEngine = {
      playPattern: (device, pattern, intensity) => {
        console.log(
          `\u{1F4F3} Playing ${pattern.name} on ${device.name} at ${intensity.toFixed(2)} intensity`
        );
      },
      stopPattern: (device, patternId) => {
        console.log(`\u{1F4F4} Stopping pattern ${patternId} on ${device.name}`);
      }
    };
  }
  // Initialize haptic system
  initialize() {
    console.log("\u{1F4F1} Haptic Feedback System Initializing...");
    this.setupHapticDevices();
    this.createHapticPatterns();
    this.createHapticZones();
    this.createHapticUI();
    this.startHapticEngine();
    this.isInitialized = true;
    console.log("\u{1F4F1} Haptic Feedback System Ready!");
  }
  // Setup haptic devices
  setupHapticDevices() {
    const vrController = {
      id: "device_vr_controller",
      name: "VR Controller",
      type: "controller",
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: false,
        supportsTemperature: false,
        supportsTexture: false,
        maxIntensity: 1,
        responseTime: 10,
        channels: 1
      },
      intensity: 0.8,
      batteryLevel: 0.85
    };
    const hapticGlove = {
      id: "device_haptic_glove",
      name: "Haptic Glove",
      type: "glove",
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: true,
        supportsTemperature: false,
        supportsTexture: true,
        maxIntensity: 0.9,
        responseTime: 15,
        channels: 5
      },
      intensity: 0.7,
      batteryLevel: 0.75
    };
    const hapticVest = {
      id: "device_haptic_vest",
      name: "Haptic Vest",
      type: "vest",
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: false,
        supportsTemperature: false,
        supportsTexture: false,
        maxIntensity: 0.7,
        responseTime: 25,
        channels: 8
      },
      intensity: 0.6,
      batteryLevel: 0.4
    };
    const hapticChair = {
      id: "device_haptic_chair",
      name: "Haptic Chair",
      type: "chair",
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: true,
        supportsTemperature: true,
        supportsTexture: false,
        maxIntensity: 0.8,
        responseTime: 30,
        channels: 4
      },
      intensity: 0.5,
      batteryLevel: 0.9
    };
    const touchscreen = {
      id: "device_touchscreen",
      name: "Touchscreen",
      type: "touchscreen",
      isConnected: true,
      capabilities: {
        supportsVibration: true,
        supportsForceFeedback: false,
        supportsTemperature: false,
        supportsTexture: true,
        maxIntensity: 0.7,
        responseTime: 5,
        channels: 1
      },
      intensity: 0.6,
      batteryLevel: 1
    };
    this.devices.set(vrController.id, vrController);
    this.devices.set(hapticGlove.id, hapticGlove);
    this.devices.set(hapticVest.id, hapticVest);
    this.devices.set(hapticChair.id, hapticChair);
    this.devices.set(touchscreen.id, touchscreen);
    console.log("\u{1F4F1} Haptic devices configured");
  }
  // Create haptic patterns
  createHapticPatterns() {
    const clickPattern = {
      id: "pattern_click",
      name: "Click",
      type: "click",
      duration: 100,
      intensity: 0.6,
      waveforms: [
        {
          channel: 0,
          frequency: 200,
          amplitude: 0.8,
          duration: 50,
          waveform: "sine",
          phase: 0
        }
      ],
      loops: false,
      fadeIn: 0,
      fadeOut: 20
    };
    const impactPattern = {
      id: "pattern_impact",
      name: "Impact",
      type: "impact",
      duration: 200,
      intensity: 0.9,
      waveforms: [
        {
          channel: 0,
          frequency: 100,
          amplitude: 1,
          duration: 100,
          waveform: "square",
          phase: 0
        },
        {
          channel: 1,
          frequency: 50,
          amplitude: 0.6,
          duration: 150,
          waveform: "sine",
          phase: 0
        }
      ],
      loops: false,
      fadeIn: 0,
      fadeOut: 50
    };
    const pulsePattern = {
      id: "pattern_pulse",
      name: "Pulse",
      type: "pulse",
      duration: 500,
      intensity: 0.7,
      waveforms: [
        {
          channel: 0,
          frequency: 80,
          amplitude: 0.8,
          duration: 250,
          waveform: "sine",
          phase: 0
        }
      ],
      loops: true,
      fadeIn: 50,
      fadeOut: 50
    };
    const texturePattern = {
      id: "pattern_texture",
      name: "Texture",
      type: "texture",
      duration: 1e3,
      intensity: 0.4,
      waveforms: [
        {
          channel: 0,
          frequency: 150,
          amplitude: 0.5,
          duration: 100,
          waveform: "noise",
          phase: 0
        },
        {
          channel: 1,
          frequency: 200,
          amplitude: 0.3,
          duration: 100,
          waveform: "noise",
          phase: Math.PI
        }
      ],
      loops: true,
      fadeIn: 100,
      fadeOut: 100
    };
    const ambientPattern = {
      id: "pattern_ambient",
      name: "Ambient",
      type: "ambient",
      duration: 0,
      intensity: 0.2,
      waveforms: [
        {
          channel: 0,
          frequency: 30,
          amplitude: 0.3,
          duration: 1e3,
          waveform: "sine",
          phase: 0
        }
      ],
      loops: true,
      fadeIn: 500,
      fadeOut: 500
    };
    this.patterns.set(clickPattern.id, clickPattern);
    this.patterns.set(impactPattern.id, impactPattern);
    this.patterns.set(pulsePattern.id, pulsePattern);
    this.patterns.set(texturePattern.id, texturePattern);
    this.patterns.set(ambientPattern.id, ambientPattern);
    console.log("\u{1F3B5} Haptic patterns created");
  }
  // Create haptic zones
  createHapticZones() {
    const desktopZone = {
      id: "zone_desktop",
      name: "Desktop",
      position: import_math15.Vector3.create(8, 1, 8),
      size: import_math15.Vector3.create(3, 1, 3),
      sensitivity: 0.8,
      devices: ["device_haptic_chair"],
      isActive: true,
      effects: [
        {
          type: "vibration",
          intensity: 0.3,
          duration: 200,
          pattern: "pattern_ambient"
        }
      ]
    };
    const interactionZone = {
      id: "zone_interaction",
      name: "Interaction Area",
      position: import_math15.Vector3.create(8, 2, 8),
      size: import_math15.Vector3.create(2, 2, 2),
      sensitivity: 1,
      devices: ["device_vr_controller", "device_haptic_glove"],
      isActive: true,
      effects: []
    };
    const floorZone = {
      id: "zone_floor",
      name: "Floor",
      position: import_math15.Vector3.create(8, 0, 8),
      size: import_math15.Vector3.create(10, 0.1, 10),
      sensitivity: 0.5,
      devices: ["device_haptic_vest"],
      isActive: false,
      effects: []
    };
    this.zones.set(desktopZone.id, desktopZone);
    this.zones.set(interactionZone.id, interactionZone);
    this.zones.set(floorZone.id, floorZone);
    console.log("\u{1F5FA}\uFE0F Haptic zones created");
  }
  // Create haptic UI
  createHapticUI() {
    this.hapticUI = import_ecs17.engine.addEntity();
    import_ecs17.Transform.create(this.hapticUI, {
      position: import_math15.Vector3.create(14, 3, 2),
      scale: import_math15.Vector3.create(3, 4, 0.1)
    });
    import_ecs17.MeshRenderer.setBox(this.hapticUI);
    import_ecs17.Material.setPbrMaterial(this.hapticUI, {
      albedoColor: import_math15.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math15.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs17.engine.addEntity();
    import_ecs17.Transform.create(title, {
      parent: this.hapticUI,
      position: import_math15.Vector3.create(0, 1.7, 0.1),
      scale: import_math15.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs17.TextShape.create(title, {
      text: "\u{1F3AF} HAPTIC FEEDBACK",
      textColor: import_math15.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createDeviceIndicators();
    this.createPatternControls();
    this.createIntensityControls();
    this.createZoneControls();
  }
  // Create device indicators
  createDeviceIndicators() {
    const devices = Array.from(this.devices.values());
    let xOffset = -1.2;
    devices.forEach((device) => {
      const indicator = import_ecs17.engine.addEntity();
      import_ecs17.Transform.create(indicator, {
        parent: this.hapticUI,
        position: import_math15.Vector3.create(xOffset, 1.2, 0.1),
        scale: import_math15.Vector3.create(0.2, 0.2, 0.1)
      });
      import_ecs17.MeshRenderer.setBox(indicator);
      import_ecs17.Material.setPbrMaterial(indicator, {
        albedoColor: device.isConnected ? import_math15.Color4.create(0.2, 0.8, 0.2, 1) : import_math15.Color4.create(0.8, 0.2, 0.2, 1),
        emissiveColor: device.isConnected ? import_math15.Color4.create(0.2, 0.8, 0.2, 0.5) : import_math15.Color4.create(0.8, 0.2, 0.2, 0.5),
        emissiveIntensity: device.isConnected ? 2 : 0.5
      });
      const deviceText = import_ecs17.engine.addEntity();
      import_ecs17.Transform.create(deviceText, {
        parent: indicator,
        position: import_math15.Vector3.create(0, 0, 0.1),
        scale: import_math15.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs17.TextShape.create(deviceText, {
        text: this.getDeviceIcon(device.type),
        textColor: import_math15.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs17.pointerEventsSystem.onPointerDown(
        {
          entity: indicator,
          opts: { button: import_ecs17.InputAction.IA_POINTER, hoverText: device.name }
        },
        () => this.toggleDevice(device.id)
      );
      xOffset += 0.4;
    });
  }
  // Create pattern controls
  createPatternControls() {
    const patterns = ["click", "impact", "pulse", "texture", "ambient"];
    let xOffset = -1;
    patterns.forEach((pattern) => {
      const button = import_ecs17.engine.addEntity();
      import_ecs17.Transform.create(button, {
        parent: this.hapticUI,
        position: import_math15.Vector3.create(xOffset, 0.6, 0.1),
        scale: import_math15.Vector3.create(0.2, 0.2, 0.1)
      });
      import_ecs17.MeshRenderer.setBox(button);
      import_ecs17.Material.setPbrMaterial(button, {
        albedoColor: import_math15.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math15.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs17.engine.addEntity();
      import_ecs17.Transform.create(buttonText, {
        parent: button,
        position: import_math15.Vector3.create(0, 0, 0.1),
        scale: import_math15.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs17.TextShape.create(buttonText, {
        text: this.getPatternIcon(pattern),
        textColor: import_math15.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs17.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs17.InputAction.IA_POINTER, hoverText: `Play ${pattern}` }
        },
        () => this.playPattern(pattern)
      );
      xOffset += 0.4;
    });
  }
  // Create intensity controls
  createIntensityControls() {
    const intensitySlider = import_ecs17.engine.addEntity();
    import_ecs17.Transform.create(intensitySlider, {
      parent: this.hapticUI,
      position: import_math15.Vector3.create(0, 0, 0.1),
      scale: import_math15.Vector3.create(2, 0.2, 0.1)
    });
    import_ecs17.MeshRenderer.setBox(intensitySlider);
    import_ecs17.Material.setPbrMaterial(intensitySlider, {
      albedoColor: import_math15.Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: import_math15.Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    });
    const intensityText = import_ecs17.engine.addEntity();
    import_ecs17.Transform.create(intensityText, {
      parent: intensitySlider,
      position: import_math15.Vector3.create(0, 0, 0.1),
      scale: import_math15.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs17.TextShape.create(intensityText, {
      text: `\u{1F50A} Intensity: ${(this.globalIntensity * 100).toFixed(0)}%`,
      textColor: import_math15.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
    import_ecs17.pointerEventsSystem.onPointerDown(
      {
        entity: intensitySlider,
        opts: { button: import_ecs17.InputAction.IA_POINTER, hoverText: "Adjust Intensity" }
      },
      () => this.adjustIntensity()
    );
  }
  // Create zone controls
  createZoneControls() {
    const zones = Array.from(this.zones.values());
    let xOffset = -0.8;
    zones.forEach((zone) => {
      const button = import_ecs17.engine.addEntity();
      import_ecs17.Transform.create(button, {
        parent: this.hapticUI,
        position: import_math15.Vector3.create(xOffset, -0.4, 0.1),
        scale: import_math15.Vector3.create(0.2, 0.2, 0.1)
      });
      import_ecs17.MeshRenderer.setBox(button);
      import_ecs17.Material.setPbrMaterial(button, {
        albedoColor: zone.isActive ? import_math15.Color4.create(0.2, 0.8, 0.2, 1) : import_math15.Color4.create(0.8, 0.2, 0.2, 1),
        emissiveColor: zone.isActive ? import_math15.Color4.create(0.2, 0.8, 0.2, 0.5) : import_math15.Color4.create(0.8, 0.2, 0.2, 0.5),
        emissiveIntensity: zone.isActive ? 2 : 0.5
      });
      const zoneText = import_ecs17.engine.addEntity();
      import_ecs17.Transform.create(zoneText, {
        parent: button,
        position: import_math15.Vector3.create(0, 0, 0.1),
        scale: import_math15.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs17.TextShape.create(zoneText, {
        text: zone.name,
        textColor: import_math15.Color4.create(1, 1, 1, 1),
        fontSize: 1.2,
        textAlign: 3
      });
      import_ecs17.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs17.InputAction.IA_POINTER, hoverText: `Toggle ${zone.name}` }
        },
        () => this.toggleZone(zone.id)
      );
      xOffset += 0.6;
    });
  }
  // Get device icon
  getDeviceIcon(type) {
    switch (type) {
      case "controller":
        return "\u{1F3AE}";
      case "glove":
        return "\u{1F9E4}";
      case "vest":
        return "\u{1F9BA}";
      case "chair":
        return "\u{1FA91}";
      case "touchscreen":
        return "\u{1F4F1}";
      default:
        return "\u{1F4F1}";
    }
  }
  // Get pattern icon
  getPatternIcon(pattern) {
    switch (pattern) {
      case "click":
        return "\u{1F446}";
      case "impact":
        return "\u{1F4A5}";
      case "pulse":
        return "\u{1F497}";
      case "texture":
        return "\u{1F30A}";
      case "ambient":
        return "\u{1F30A}";
      default:
        return "\u{1F4F3}";
    }
  }
  // Start haptic engine
  startHapticEngine() {
    import_ecs17.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.processHapticEvents();
      this.updateDeviceStatus();
      this.updateZoneEffects();
    });
  }
  // Process haptic events
  processHapticEvents() {
    this.activeEvents.forEach((event, id) => {
      if (event.processed) return;
      const zone = this.findZone(event.position);
      if (!zone || !zone.isActive) return;
      const devices = this.findDevicesForZone(zone);
      if (devices.length === 0) return;
      this.applyHapticFeedback(event, zone, devices);
      event.processed = true;
    });
    const now = Date.now();
    this.activeEvents.forEach((event, id) => {
      if (event.processed && now - event.timestamp > 5e3) {
        this.activeEvents.delete(id);
      }
    });
  }
  // Find zone for position
  findZone(position) {
    for (const zone of this.zones.values()) {
      const distance = import_math15.Vector3.distance(position, zone.position);
      if (distance <= Math.max(zone.size.x, zone.size.y, zone.size.z) / 2) {
        return zone;
      }
    }
    return null;
  }
  // Find devices for zone
  findDevicesForZone(zone) {
    return Array.from(this.devices.values()).filter(
      (device) => device.isConnected && zone.devices.includes(device.id)
    );
  }
  // Apply haptic feedback
  applyHapticFeedback(event, zone, devices) {
    const intensity = event.intensity * zone.sensitivity * this.globalIntensity;
    devices.forEach((device) => {
      if (event.pattern) {
        const pattern = this.patterns.get(event.pattern);
        if (pattern) {
          this.hapticEngine.playPattern(device, pattern, intensity);
        }
      } else {
        const defaultPattern = this.getDefaultPattern(event.type);
        if (defaultPattern) {
          this.hapticEngine.playPattern(device, defaultPattern, intensity);
        }
      }
    });
  }
  // Get default pattern
  getDefaultPattern(eventType) {
    switch (eventType) {
      case "touch":
      case "interaction":
        return this.patterns.get("pattern_click") || null;
      case "collision":
        return this.patterns.get("pattern_impact") || null;
      case "feedback":
      case "alert":
        return this.patterns.get("pattern_pulse") || null;
      case "ambient":
        return this.patterns.get("pattern_ambient") || null;
      default:
        return null;
    }
  }
  // Update device status
  updateDeviceStatus() {
    this.devices.forEach((device, id) => {
      if (Math.random() < 1e-3) {
        device.batteryLevel = Math.max(0, device.batteryLevel - 0.01);
        if (device.batteryLevel < 0.1) {
          device.isConnected = false;
          console.log(`\u{1F50B} Device ${device.name} battery low`);
        }
      }
    });
  }
  // Update zone effects
  updateZoneEffects() {
    this.zones.forEach((zone) => {
      if (zone.isActive && zone.effects.length > 0) {
        zone.effects.forEach((effect) => {
          if (effect.type === "vibration" && effect.pattern) {
            const devices = this.findDevicesForZone(zone);
            devices.forEach((device) => {
              const patternId = effect.pattern;
              const pattern = this.patterns.get(patternId);
              if (pattern) {
                this.hapticEngine.playPattern(device, pattern, effect.intensity);
              }
            });
          }
        });
      }
    });
  }
  // Trigger haptic event
  triggerHapticEvent(event) {
    if (!this.isSystemEnabled) return;
    event.id = `event_${Date.now()}_${Math.random()}`;
    event.timestamp = Date.now();
    event.processed = false;
    this.activeEvents.set(event.id, event);
    console.log(`\u{1F3AF} Triggered haptic event: ${event.type}`);
  }
  // Play pattern
  playPattern(patternId, intensity) {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return;
    const effectiveIntensity = intensity || pattern.intensity;
    this.devices.forEach((device) => {
      if (device.isConnected) {
        this.hapticEngine.playPattern(device, pattern, effectiveIntensity);
      }
    });
    console.log(`\u{1F3B5} Playing pattern: ${pattern.name}`);
    soundSystem.playInteractionSound("click");
  }
  // Stop pattern
  stopPattern(patternId) {
    this.devices.forEach((device) => {
      if (device.isConnected) {
        this.hapticEngine.stopPattern(device, patternId);
      }
    });
    console.log(`\u{1F6D1} Stopped pattern: ${patternId}`);
  }
  // Toggle device
  toggleDevice(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device) return;
    device.isConnected = !device.isConnected;
    console.log(
      `${device.isConnected ? "\u{1F517}" : "\u{1F50C}"} Device ${device.name} ${device.isConnected ? "connected" : "disconnected"}`
    );
    soundSystem.playInteractionSound("click");
  }
  // Toggle zone
  toggleZone(zoneId) {
    const zone = this.zones.get(zoneId);
    if (!zone) return;
    zone.isActive = !zone.isActive;
    console.log(
      `${zone.isActive ? "\u2705" : "\u274C"} Zone ${zone.name} ${zone.isActive ? "activated" : "deactivated"}`
    );
    soundSystem.playInteractionSound("click");
  }
  // Adjust intensity
  adjustIntensity() {
    const levels = [0.2, 0.4, 0.6, 0.8, 1];
    const currentIndex = levels.indexOf(this.globalIntensity);
    const nextIndex = (currentIndex + 1) % levels.length;
    this.globalIntensity = levels[nextIndex];
    console.log(`\u{1F50A} Global intensity set to: ${(this.globalIntensity * 100).toFixed(0)}%`);
    soundSystem.playInteractionSound("click");
  }
  // Set global intensity
  setGlobalIntensity(intensity) {
    this.globalIntensity = Math.max(0, Math.min(1, intensity));
    console.log(`\u{1F50A} Global intensity set to: ${(this.globalIntensity * 100).toFixed(0)}%`);
  }
  // Enable/disable system
  setSystemEnabled(enabled) {
    this.isSystemEnabled = enabled;
    console.log(`\u{1F3AF} Haptic system ${enabled ? "enabled" : "disabled"}`);
    if (!enabled) {
      this.devices.forEach((device) => {
        if (device.isConnected) {
          this.patterns.forEach((pattern) => {
            this.hapticEngine.stopPattern(device, pattern.id);
          });
        }
      });
    }
  }
  // Get connected devices
  getConnectedDevices() {
    return Array.from(this.devices.values()).filter((device) => device.isConnected);
  }
  // Get all devices
  getAllDevices() {
    return Array.from(this.devices.values());
  }
  // Get active zones
  getActiveZones() {
    return Array.from(this.zones.values()).filter((zone) => zone.isActive);
  }
  // Get available patterns
  getAvailablePatterns() {
    return Array.from(this.patterns.values());
  }
  // Create custom pattern
  createCustomPattern(pattern) {
    const newPattern = {
      ...pattern,
      id: `pattern_custom_${Date.now()}_${Math.random()}`
    };
    this.patterns.set(newPattern.id, newPattern);
    console.log(`\u{1F3B5} Created custom pattern: ${newPattern.name}`);
    return newPattern;
  }
  // Create custom zone
  createCustomZone(zone) {
    const newZone = {
      ...zone,
      id: `zone_custom_${Date.now()}_${Math.random()}`
    };
    this.zones.set(newZone.id, newZone);
    console.log(`\u{1F5FA}\uFE0F Created custom zone: ${newZone.name}`);
    return newZone;
  }
  // Get system statistics
  getSystemStatistics() {
    return {
      totalDevices: this.devices.size,
      connectedDevices: this.getConnectedDevices().length,
      totalPatterns: this.patterns.size,
      totalZones: this.zones.size,
      activeZones: this.getActiveZones().length,
      activeEvents: this.activeEvents.size,
      globalIntensity: this.globalIntensity,
      systemEnabled: this.isSystemEnabled
    };
  }
  // Cleanup system
  cleanup() {
    this.devices.clear();
    this.patterns.clear();
    this.zones.clear();
    this.activeEvents.clear();
    if (this.hapticUI) {
      import_ecs17.engine.removeEntity(this.hapticUI);
    }
    this.isInitialized = false;
  }
};
var hapticFeedbackSystem = new HapticFeedbackSystem();

// src/holographic-data-walls.ts
var import_ecs18 = require("@dcl/sdk/ecs");
var import_math16 = require("@dcl/sdk/math");
var HolographicDataWall = class {
  constructor(position, scale) {
    this.charts = /* @__PURE__ */ new Map();
    this.visualElements = [];
    this.animationTime = 0;
    this.isActive = true;
    this.createWall(position, scale);
    this.startAnimation();
  }
  createWall(position, scale) {
    this.entity = import_ecs18.engine.addEntity();
    import_ecs18.Transform.create(this.entity, {
      position,
      scale
    });
    import_ecs18.MeshRenderer.setBox(this.entity);
    import_ecs18.Material.setPbrMaterial(this.entity, {
      albedoColor: import_math16.Color4.create(0.05, 0.05, 0.1, 0.9),
      roughness: 0.1,
      metallic: 0.8,
      emissiveColor: import_math16.Color4.create(0.1, 0.1, 0.3, 0.5),
      emissiveIntensity: 2
    });
    this.createGridOverlay();
    this.createTitle();
  }
  createGridOverlay() {
    const gridSize = 10;
    const gridSpacing = 1.6;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const gridCell = import_ecs18.engine.addEntity();
        import_ecs18.Transform.create(gridCell, {
          parent: this.entity,
          position: import_math16.Vector3.create(-7.5 + x * gridSpacing, -3.5 + y * gridSpacing, 0.1),
          scale: import_math16.Vector3.create(1.5, 1.5, 0.05)
        });
        import_ecs18.MeshRenderer.setBox(gridCell);
        import_ecs18.Material.setPbrMaterial(gridCell, {
          albedoColor: import_math16.Color4.create(0.2, 0.3, 0.5, 0.3),
          emissiveColor: import_math16.Color4.create(0.1, 0.2, 0.4, 0.5),
          emissiveIntensity: 1
        });
        this.visualElements.push(gridCell);
      }
    }
  }
  createTitle() {
    const titleEntity = import_ecs18.engine.addEntity();
    import_ecs18.Transform.create(titleEntity, {
      parent: this.entity,
      position: import_math16.Vector3.create(0, 4.5, 0.1),
      scale: import_math16.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs18.TextShape.create(titleEntity, {
      text: "\u{1F4CA} HOLOGRAPHIC DATA VISUALIZATION",
      textColor: import_math16.Color4.create(0.5, 0.8, 1, 1),
      fontSize: 4,
      textAlign: 3,
      outlineWidth: 0.1,
      outlineColor: import_math16.Color4.create(0, 0, 0, 1)
    });
    this.visualElements.push(titleEntity);
  }
  // Add a new chart to the wall
  addChart(id, config) {
    this.charts.set(id, config);
    this.renderChart(id);
    if (config.updateInterval > 0) {
      setInterval(() => {
        this.updateChart(id);
      }, config.updateInterval);
    }
  }
  renderChart(chartId) {
    const chart = this.charts.get(chartId);
    if (!chart) return;
    switch (chart.type) {
      case "bar":
        this.renderBarChart(chartId, chart);
        break;
      case "line":
        this.renderLineChart(chartId, chart);
        break;
      case "pie":
        this.renderPieChart(chartId, chart);
        break;
      case "scatter":
        this.renderScatterChart(chartId, chart);
        break;
      case "heatmap":
        this.renderHeatmap(chartId, chart);
        break;
    }
  }
  renderBarChart(chartId, config) {
    const barWidth = 1.2;
    const maxHeight = 3;
    const spacing = 1.5;
    const startX = -6;
    config.data.forEach((point, index) => {
      const bar = import_ecs18.engine.addEntity();
      const height = point.value / 100 * maxHeight;
      import_ecs18.Transform.create(bar, {
        parent: this.entity,
        position: import_math16.Vector3.create(startX + index * spacing, -2 + height / 2, 0.2),
        scale: import_math16.Vector3.create(barWidth, height, 0.3)
      });
      import_ecs18.MeshRenderer.setBox(bar);
      import_ecs18.Material.setPbrMaterial(bar, {
        albedoColor: import_math16.Color4.create(point.color.r, point.color.g, point.color.b, 0.8),
        emissiveColor: import_math16.Color4.create(point.color.r, point.color.g, point.color.b, 0.6),
        emissiveIntensity: 2
      });
      const label = import_ecs18.engine.addEntity();
      import_ecs18.Transform.create(label, {
        parent: this.entity,
        position: import_math16.Vector3.create(startX + index * spacing, -3.5, 0.3),
        scale: import_math16.Vector3.create(0.2, 0.2, 0.2)
      });
      import_ecs18.TextShape.create(label, {
        text: point.label,
        textColor: import_math16.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      this.visualElements.push(bar, label);
    });
  }
  renderLineChart(chartId, config) {
    const points = [];
    const spacing = 1.2;
    const startX = -6;
    config.data.forEach((point, index) => {
      const x = startX + index * spacing;
      const y = -2 + point.value / 100 * 3;
      points.push(import_math16.Vector3.create(x, y, 0.2));
      const dataPoint = import_ecs18.engine.addEntity();
      import_ecs18.Transform.create(dataPoint, {
        parent: this.entity,
        position: import_math16.Vector3.create(x, y, 0.2),
        scale: import_math16.Vector3.create(0.2, 0.2, 0.2)
      });
      import_ecs18.MeshRenderer.setSphere(dataPoint);
      import_ecs18.Material.setPbrMaterial(dataPoint, {
        albedoColor: import_math16.Color4.create(point.color.r, point.color.g, point.color.b, 1),
        emissiveColor: import_math16.Color4.create(point.color.r, point.color.g, point.color.b, 0.8),
        emissiveIntensity: 3
      });
      this.visualElements.push(dataPoint);
    });
    for (let i = 0; i < points.length - 1; i++) {
      const line = import_ecs18.engine.addEntity();
      const start = points[i];
      const end = points[i + 1];
      const distance = import_math16.Vector3.distance(start, end);
      const midpoint = import_math16.Vector3.lerp(start, end, 0.5);
      import_ecs18.Transform.create(line, {
        parent: this.entity,
        position: import_math16.Vector3.create(midpoint.x, midpoint.y, 0.15),
        scale: import_math16.Vector3.create(0.05, distance, 0.1)
      });
      import_ecs18.MeshRenderer.setBox(line);
      import_ecs18.Material.setPbrMaterial(line, {
        albedoColor: import_math16.Color4.create(0.5, 0.8, 1, 0.8),
        emissiveColor: import_math16.Color4.create(0.5, 0.8, 1, 0.6),
        emissiveIntensity: 2
      });
      this.visualElements.push(line);
    }
  }
  renderPieChart(chartId, config) {
    const total = config.data.reduce((sum, point) => sum + point.value, 0);
    let currentAngle = 0;
    config.data.forEach((point, index) => {
      const percentage = point.value / total;
      const angle = percentage * 360;
      const slice = import_ecs18.engine.addEntity();
      import_ecs18.Transform.create(slice, {
        parent: this.entity,
        position: import_math16.Vector3.create(
          Math.cos(currentAngle * Math.PI / 180) * 2,
          Math.sin(currentAngle * Math.PI / 180) * 2,
          0.2
        ),
        scale: import_math16.Vector3.create(1.5, 1.5, 0.3)
      });
      import_ecs18.MeshRenderer.setBox(slice);
      import_ecs18.Material.setPbrMaterial(slice, {
        albedoColor: import_math16.Color4.create(point.color.r, point.color.g, point.color.b, 0.8),
        emissiveColor: import_math16.Color4.create(point.color.r, point.color.g, point.color.b, 0.6),
        emissiveIntensity: 2
      });
      this.visualElements.push(slice);
      currentAngle += angle;
    });
  }
  renderScatterChart(chartId, config) {
    config.data.forEach((point, index) => {
      const scatterPoint = import_ecs18.engine.addEntity();
      import_ecs18.Transform.create(scatterPoint, {
        parent: this.entity,
        position: import_math16.Vector3.create(
          -6 + index / config.data.length * 12,
          -2 + point.value / 100 * 3,
          0.2
        ),
        scale: import_math16.Vector3.create(0.3, 0.3, 0.3)
      });
      import_ecs18.MeshRenderer.setSphere(scatterPoint);
      import_ecs18.Material.setPbrMaterial(scatterPoint, {
        albedoColor: import_math16.Color4.create(point.color.r, point.color.g, point.color.b, 0.9),
        emissiveColor: import_math16.Color4.create(point.color.r, point.color.g, point.color.b, 0.7),
        emissiveIntensity: 3
      });
      this.visualElements.push(scatterPoint);
    });
  }
  renderHeatmap(chartId, config) {
    const gridSize = 8;
    const cellSize = 1.5;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const dataIndex = (x * gridSize + y) % config.data.length;
        const point = config.data[dataIndex];
        const heatCell = import_ecs18.engine.addEntity();
        import_ecs18.Transform.create(heatCell, {
          parent: this.entity,
          position: import_math16.Vector3.create(-6 + x * cellSize, -2 + y * cellSize, 0.2),
          scale: import_math16.Vector3.create(cellSize * 0.8, cellSize * 0.8, 0.2)
        });
        import_ecs18.MeshRenderer.setBox(heatCell);
        const intensity = point.value / 100;
        import_ecs18.Material.setPbrMaterial(heatCell, {
          albedoColor: import_math16.Color4.create(
            point.color.r * intensity,
            point.color.g * intensity,
            point.color.b * intensity,
            0.8
          ),
          emissiveColor: import_math16.Color4.create(
            point.color.r * intensity,
            point.color.g * intensity,
            point.color.b * intensity,
            0.6
          ),
          emissiveIntensity: intensity * 3
        });
        this.visualElements.push(heatCell);
      }
    }
  }
  updateChart(chartId) {
    const chart = this.charts.get(chartId);
    if (!chart) return;
    const newPoint = {
      label: "T" + Date.now() % 1e3,
      value: Math.random() * 100,
      color: import_math16.Color3.create(Math.random(), Math.random(), Math.random()),
      timestamp: Date.now()
    };
    chart.data.push(newPoint);
    if (chart.data.length > chart.maxDataPoints) {
      chart.data.shift();
    }
    this.clearChart(chartId);
    this.renderChart(chartId);
  }
  clearChart(chartId) {
    const elementsToRemove = this.visualElements.splice(20);
    elementsToRemove.forEach((element) => {
      import_ecs18.engine.removeEntity(element);
    });
  }
  startAnimation() {
    import_ecs18.engine.addSystem(() => {
      if (!this.isActive) return;
      this.animationTime += 0.016;
      this.visualElements.forEach((element, index) => {
        if (index % 3 === 0) {
          const material = import_ecs18.Material.get(element);
          const pulse = Math.sin(this.animationTime * 2 + index * 0.1) * 0.3 + 0.7;
          import_ecs18.Material.setPbrMaterial(element, {
            ...material,
            emissiveIntensity: pulse * 2
          });
        }
      });
    });
  }
  // Real-time data streaming
  startDataStream(chartId, dataSource) {
    setInterval(() => {
      const chart = this.charts.get(chartId);
      if (chart) {
        const newDataPoint = dataSource();
        chart.data.push(newDataPoint);
        if (chart.data.length > chart.maxDataPoints) {
          chart.data.shift();
        }
        this.clearChart(chartId);
        this.renderChart(chartId);
      }
    }, 1e3);
  }
  // Interactive features
  setInteractive(enabled) {
    this.isActive = enabled;
  }
  // Cleanup
  cleanup() {
    this.visualElements.forEach((element) => {
      import_ecs18.engine.removeEntity(element);
    });
    this.visualElements = [];
    this.charts.clear();
  }
};
var DataVisualizationManager = class {
  constructor() {
    this.walls = /* @__PURE__ */ new Map();
  }
  createWall(id, position, scale) {
    const wall = new HolographicDataWall(position, scale);
    this.walls.set(id, wall);
    return wall;
  }
  getWall(id) {
    return this.walls.get(id);
  }
  // Pre-configured data sources
  static createSystemStatusData() {
    return [
      { label: "CPU", value: 65, color: import_math16.Color3.create(0.2, 0.8, 0.2), timestamp: Date.now() },
      { label: "Memory", value: 78, color: import_math16.Color3.create(0.8, 0.6, 0.2), timestamp: Date.now() },
      { label: "Network", value: 45, color: import_math16.Color3.create(0.2, 0.6, 0.8), timestamp: Date.now() },
      { label: "Storage", value: 32, color: import_math16.Color3.create(0.8, 0.2, 0.6), timestamp: Date.now() },
      { label: "Quantum", value: 89, color: import_math16.Color3.create(0.6, 0.2, 0.8), timestamp: Date.now() }
    ];
  }
  static createRealtimeDataSource() {
    let counter = 0;
    return () => ({
      label: "Data" + counter++,
      value: Math.random() * 100,
      color: import_math16.Color3.create(Math.random(), Math.random(), Math.random()),
      timestamp: Date.now()
    });
  }
  cleanup() {
    this.walls.forEach((wall) => wall.cleanup());
    this.walls.clear();
  }
};
var dataVizManager = new DataVisualizationManager();

// src/multiplayer-system.ts
var import_ecs19 = require("@dcl/sdk/ecs");
var import_math17 = require("@dcl/sdk/math");
var MultiplayerSystem = class {
  constructor() {
    this.remotePlayers = /* @__PURE__ */ new Map();
    this.activeSession = null;
    this.sharedObjects = /* @__PURE__ */ new Map();
    this.voiceChannels = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.connectionStatus = "disconnected";
    this.localPlayer = {
      id: this.generatePlayerId(),
      name: "Player",
      position: import_math17.Vector3.create(8, 1, 8),
      rotation: import_math17.Quaternion.fromEulerDegrees(0, 0, 0),
      avatar: null,
      isActive: true,
      lastUpdate: Date.now(),
      color: import_math17.Color3.create(Math.random(), Math.random(), Math.random())
    };
  }
  // Initialize multiplayer system
  async initialize() {
    console.log("\u{1F310} Multiplayer System Initializing...");
    this.createLocalPlayer();
    this.setupVoiceChat();
    this.createCollaborationTools();
    this.startNetworkSync();
    await this.connectToServer();
    this.isInitialized = true;
    console.log("\u{1F310} Multiplayer System Ready!");
  }
  // Create local player avatar
  createLocalPlayer() {
    const avatar = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(avatar, {
      position: this.localPlayer.position,
      scale: import_math17.Vector3.create(1, 2, 1)
    });
    import_ecs19.MeshRenderer.setBox(avatar);
    import_ecs19.Material.setPbrMaterial(avatar, {
      albedoColor: import_math17.Color4.create(
        this.localPlayer.color.r,
        this.localPlayer.color.g,
        this.localPlayer.color.b,
        1
      ),
      roughness: 0.2,
      metallic: 0.3,
      emissiveColor: import_math17.Color4.create(
        this.localPlayer.color.r * 0.3,
        this.localPlayer.color.g * 0.3,
        this.localPlayer.color.b * 0.3,
        0.5
      ),
      emissiveIntensity: 1
    });
    const nameTag = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(nameTag, {
      parent: avatar,
      position: import_math17.Vector3.create(0, 2.5, 0),
      scale: import_math17.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs19.TextShape.create(nameTag, {
      text: this.localPlayer.name,
      textColor: import_math17.Color4.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3
    });
    this.localPlayer.avatar = avatar;
  }
  // Setup voice chat system
  setupVoiceChat() {
    const mainChannel = {
      id: "main",
      name: "Main Channel",
      participants: [this.localPlayer.id],
      isSpatial: true,
      maxParticipants: 10
    };
    this.voiceChannels.set("main", mainChannel);
    this.createVoiceChannelUI();
  }
  // Create voice channel UI
  createVoiceChannelUI() {
    const voicePanel = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(voicePanel, {
      position: import_math17.Vector3.create(1, 3, 8),
      scale: import_math17.Vector3.create(1.5, 2, 0.1)
    });
    import_ecs19.MeshRenderer.setBox(voicePanel);
    import_ecs19.Material.setPbrMaterial(voicePanel, {
      albedoColor: import_math17.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math17.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const voiceTitle = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(voiceTitle, {
      parent: voicePanel,
      position: import_math17.Vector3.create(0, 0.7, 0.1),
      scale: import_math17.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs19.TextShape.create(voiceTitle, {
      text: "\u{1F3A4} VOICE CHAT",
      textColor: import_math17.Color4.create(0.8, 0.8, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    const muteButton = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(muteButton, {
      parent: voicePanel,
      position: import_math17.Vector3.create(0, -0.2, 0.1),
      scale: import_math17.Vector3.create(0.3, 0.3, 0.1)
    });
    import_ecs19.MeshRenderer.setBox(muteButton);
    import_ecs19.Material.setPbrMaterial(muteButton, {
      albedoColor: import_math17.Color4.create(0.2, 0.8, 0.2, 1),
      emissiveColor: import_math17.Color4.create(0.2, 0.8, 0.2, 0.8),
      emissiveIntensity: 2
    });
    const muteText = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(muteText, {
      parent: muteButton,
      position: import_math17.Vector3.create(0, 0, 0.1),
      scale: import_math17.Vector3.create(0.5, 0.5, 0.5)
    });
    import_ecs19.TextShape.create(muteText, {
      text: "\u{1F50A}",
      textColor: import_math17.Color4.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3
    });
    import_ecs19.pointerEventsSystem.onPointerDown(
      {
        entity: muteButton,
        opts: { button: import_ecs19.InputAction.IA_POINTER, hoverText: "Toggle Mute" }
      },
      () => this.toggleMute()
    );
  }
  // Create collaboration tools
  createCollaborationTools() {
    this.createSharedWhiteboard();
    this.createDocumentSharing();
    this.createCollaborationPanel();
  }
  // Create shared whiteboard
  createSharedWhiteboard() {
    const whiteboard = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(whiteboard, {
      position: import_math17.Vector3.create(8, 3, 12),
      scale: import_math17.Vector3.create(6, 4, 0.2)
    });
    import_ecs19.MeshRenderer.setBox(whiteboard);
    import_ecs19.Material.setPbrMaterial(whiteboard, {
      albedoColor: import_math17.Color4.create(1, 1, 1, 1),
      roughness: 0.1,
      metallic: 0.1
    });
    const sharedObject = {
      id: "main-whiteboard",
      type: "whiteboard",
      position: import_math17.Vector3.create(8, 3, 12),
      content: { drawings: [], text: [] },
      ownerId: this.localPlayer.id,
      collaborators: [],
      isLocked: false
    };
    this.sharedObjects.set("main-whiteboard", sharedObject);
  }
  // Create document sharing system
  createDocumentSharing() {
    const docSharePanel = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(docSharePanel, {
      position: import_math17.Vector3.create(14, 3, 8),
      scale: import_math17.Vector3.create(2, 3, 0.1)
    });
    import_ecs19.MeshRenderer.setBox(docSharePanel);
    import_ecs19.Material.setPbrMaterial(docSharePanel, {
      albedoColor: import_math17.Color4.create(0.1, 0.3, 0.6, 0.9),
      emissiveColor: import_math17.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const docTitle = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(docTitle, {
      parent: docSharePanel,
      position: import_math17.Vector3.create(0, 1.2, 0.1),
      scale: import_math17.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs19.TextShape.create(docTitle, {
      text: "\u{1F4C4} DOCUMENTS",
      textColor: import_math17.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
  }
  // Create collaboration panel
  createCollaborationPanel() {
    const collabPanel = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(collabPanel, {
      position: import_math17.Vector3.create(2, 3, 8),
      scale: import_math17.Vector3.create(2, 3, 0.1)
    });
    import_ecs19.MeshRenderer.setBox(collabPanel);
    import_ecs19.Material.setPbrMaterial(collabPanel, {
      albedoColor: import_math17.Color4.create(0.2, 0.1, 0.4, 0.9),
      emissiveColor: import_math17.Color4.create(0.4, 0.2, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const collabTitle = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(collabTitle, {
      parent: collabPanel,
      position: import_math17.Vector3.create(0, 1.2, 0.1),
      scale: import_math17.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs19.TextShape.create(collabTitle, {
      text: "\u{1F91D} COLLABORATE",
      textColor: import_math17.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    const startSessionBtn = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(startSessionBtn, {
      parent: collabPanel,
      position: import_math17.Vector3.create(0, 0.3, 0.1),
      scale: import_math17.Vector3.create(0.4, 0.2, 0.1)
    });
    import_ecs19.MeshRenderer.setBox(startSessionBtn);
    import_ecs19.Material.setPbrMaterial(startSessionBtn, {
      albedoColor: import_math17.Color4.create(0.2, 0.8, 0.2, 1),
      emissiveColor: import_math17.Color4.create(0.2, 0.8, 0.2, 0.8),
      emissiveIntensity: 2
    });
    const sessionText = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(sessionText, {
      parent: startSessionBtn,
      position: import_math17.Vector3.create(0, 0, 0.1),
      scale: import_math17.Vector3.create(0.5, 0.5, 0.5)
    });
    import_ecs19.TextShape.create(sessionText, {
      text: "START",
      textColor: import_math17.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    import_ecs19.pointerEventsSystem.onPointerDown(
      {
        entity: startSessionBtn,
        opts: { button: import_ecs19.InputAction.IA_POINTER, hoverText: "Start Collaboration Session" }
      },
      () => this.startCollaborationSession()
    );
  }
  // Start network synchronization
  startNetworkSync() {
    import_ecs19.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.syncPlayerPositions();
      this.syncSharedObjects();
      this.updateVoiceChat();
    });
  }
  // Connect to server
  async connectToServer() {
    this.connectionStatus = "connecting";
    console.log("\u{1F50C} Connecting to multiplayer server...");
    await new Promise((resolve) => setTimeout(() => resolve(), 2e3));
    this.connectionStatus = "connected";
    console.log("\u2705 Connected to multiplayer server");
    setTimeout(() => {
      this.simulatePlayerJoin("Alice", import_math17.Color3.create(1, 0.5, 0.5));
    }, 3e3);
    setTimeout(() => {
      this.simulatePlayerJoin("Bob", import_math17.Color3.create(0.5, 1, 0.5));
    }, 5e3);
  }
  // Simulate player joining
  simulatePlayerJoin(name, color) {
    const player = {
      id: this.generatePlayerId(),
      name,
      position: import_math17.Vector3.create(Math.random() * 14 + 1, 1, Math.random() * 14 + 1),
      rotation: import_math17.Quaternion.fromEulerDegrees(0, 0, 0),
      avatar: null,
      isActive: true,
      lastUpdate: Date.now(),
      color
    };
    this.createRemotePlayer(player);
    this.remotePlayers.set(player.id, player);
    console.log(`\u{1F44B} ${name} joined the session`);
    soundSystem.playInteractionSound("click");
  }
  // Create remote player avatar
  createRemotePlayer(player) {
    const avatar = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(avatar, {
      position: player.position,
      scale: import_math17.Vector3.create(1, 2, 1)
    });
    import_ecs19.MeshRenderer.setBox(avatar);
    import_ecs19.Material.setPbrMaterial(avatar, {
      albedoColor: import_math17.Color4.create(player.color.r, player.color.g, player.color.b, 1),
      roughness: 0.2,
      metallic: 0.3,
      emissiveColor: import_math17.Color4.create(
        player.color.r * 0.3,
        player.color.g * 0.3,
        player.color.b * 0.3,
        0.5
      ),
      emissiveIntensity: 1
    });
    const nameTag = import_ecs19.engine.addEntity();
    import_ecs19.Transform.create(nameTag, {
      parent: avatar,
      position: import_math17.Vector3.create(0, 2.5, 0),
      scale: import_math17.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs19.TextShape.create(nameTag, {
      text: player.name,
      textColor: import_math17.Color4.create(1, 1, 1, 1),
      fontSize: 3,
      textAlign: 3
    });
    player.avatar = avatar;
  }
  // Sync player positions
  syncPlayerPositions() {
    if (this.localPlayer.avatar) {
      const transform = import_ecs19.Transform.getMutable(this.localPlayer.avatar);
      this.localPlayer.position = transform.position;
      this.localPlayer.lastUpdate = Date.now();
    }
    this.remotePlayers.forEach((player) => {
      if (player.avatar && player.isActive) {
        if (Math.random() > 0.98) {
          const newPos = import_math17.Vector3.create(
            player.position.x + (Math.random() - 0.5) * 0.5,
            player.position.y,
            player.position.z + (Math.random() - 0.5) * 0.5
          );
          const transform = import_ecs19.Transform.getMutable(player.avatar);
          transform.position = newPos;
          player.position = newPos;
          player.lastUpdate = Date.now();
        }
      }
    });
  }
  // Sync shared objects
  syncSharedObjects() {
    const whiteboard = this.sharedObjects.get("main-whiteboard");
    if (whiteboard && Math.random() > 0.99) {
      console.log("\u{1F3A8} Remote whiteboard update received");
    }
  }
  // Update voice chat
  updateVoiceChat() {
    const mainChannel = this.voiceChannels.get("main");
    if (mainChannel) {
      this.remotePlayers.forEach((player) => {
        if (!mainChannel.participants.includes(player.id)) {
          mainChannel.participants.push(player.id);
        }
      });
    }
  }
  // Start collaboration session
  startCollaborationSession() {
    const session = {
      id: this.generateSessionId(),
      name: `Session ${Date.now()}`,
      hostId: this.localPlayer.id,
      participants: [this.localPlayer.id],
      startTime: Date.now(),
      isActive: true,
      sharedObjects: /* @__PURE__ */ new Map()
    };
    this.activeSession = session;
    console.log(`\u{1F91D} Started collaboration session: ${session.name}`);
    soundSystem.playInteractionSound("powerup");
  }
  // Toggle mute
  toggleMute() {
    console.log("\u{1F507} Toggle mute");
    soundSystem.playInteractionSound("click");
  }
  // Share object with collaborators
  shareObject(objectId, collaborators) {
    const obj = this.sharedObjects.get(objectId);
    if (obj) {
      obj.collaborators = collaborators;
      console.log(`\u{1F4E4} Shared object ${objectId} with ${collaborators.length} collaborators`);
    }
  }
  // Join voice channel
  joinVoiceChannel(channelId) {
    const channel = this.voiceChannels.get(channelId);
    if (channel && channel.participants.length < channel.maxParticipants) {
      channel.participants.push(this.localPlayer.id);
      console.log(`\u{1F3A4} Joined voice channel: ${channel.name}`);
    }
  }
  // Leave voice channel
  leaveVoiceChannel(channelId) {
    const channel = this.voiceChannels.get(channelId);
    if (channel) {
      channel.participants = channel.participants.filter((id) => id !== this.localPlayer.id);
      console.log(`\u{1F507} Left voice channel: ${channel.name}`);
    }
  }
  // Send message to chat
  sendChatMessage(message) {
    console.log(`\u{1F4AC} ${this.localPlayer.name}: ${message}`);
  }
  // Get all connected players
  getConnectedPlayers() {
    const players = [this.localPlayer];
    this.remotePlayers.forEach((player) => {
      if (player.isActive) {
        players.push(player);
      }
    });
    return players;
  }
  // Get active session
  getActiveSession() {
    return this.activeSession;
  }
  // Utility functions
  generatePlayerId() {
    return "player_" + Math.random().toString(36).substr(2, 9);
  }
  generateSessionId() {
    return "session_" + Math.random().toString(36).substr(2, 9);
  }
  // Cleanup system
  cleanup() {
    if (this.localPlayer.avatar) {
      import_ecs19.engine.removeEntity(this.localPlayer.avatar);
    }
    this.remotePlayers.forEach((player) => {
      if (player.avatar) {
        import_ecs19.engine.removeEntity(player.avatar);
      }
    });
    this.remotePlayers.clear();
    this.sharedObjects.forEach((obj) => {
    });
    this.sharedObjects.clear();
    this.voiceChannels.clear();
    this.activeSession = null;
    this.isInitialized = false;
    this.connectionStatus = "disconnected";
  }
};
var multiplayerSystem = new MultiplayerSystem();

// src/physics-interaction.ts
var import_ecs20 = require("@dcl/sdk/ecs");
var import_math18 = require("@dcl/sdk/math");
var PhysicsInteractionSystem = class {
  constructor() {
    this.objects = /* @__PURE__ */ new Map();
    this.materials = /* @__PURE__ */ new Map();
    this.forceFields = /* @__PURE__ */ new Map();
    this.constraints = /* @__PURE__ */ new Map();
    this.collisions = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.gravity = import_math18.Vector3.create(0, -9.81, 0);
    this.timeStep = 1 / 60;
    this.maxSubSteps = 4;
    this.collisionMatrix = [];
    this.initializeCollisionMatrix();
  }
  // Initialize physics system
  initialize() {
    console.log("\u269B\uFE0F Physics Interaction System Initializing...");
    this.setupPhysicsMaterials();
    this.createPhysicsUI();
    this.createPhysicsObjects();
    this.startPhysicsEngine();
    this.isInitialized = true;
    console.log("\u269B\uFE0F Physics Interaction System Ready!");
  }
  // Initialize collision matrix
  initializeCollisionMatrix() {
    for (let i = 0; i < 8; i++) {
      this.collisionMatrix[i] = [];
      for (let j = 0; j < 8; j++) {
        this.collisionMatrix[i][j] = true;
      }
    }
  }
  // Setup physics materials
  setupPhysicsMaterials() {
    const metal = {
      id: "material_metal",
      name: "Metal",
      density: 7850,
      restitution: 0.3,
      friction: 0.7,
      durability: 100,
      soundProfile: {
        impactSound: "metal_impact",
        frictionSound: "metal_scrape",
        breakSound: "metal_break",
        volume: 0.8,
        pitch: 1
      }
    };
    const wood = {
      id: "material_wood",
      name: "Wood",
      density: 700,
      restitution: 0.4,
      friction: 0.6,
      durability: 50,
      soundProfile: {
        impactSound: "wood_impact",
        frictionSound: "wood_scrape",
        breakSound: "wood_break",
        volume: 0.6,
        pitch: 0.9
      }
    };
    const glass = {
      id: "material_glass",
      name: "Glass",
      density: 2500,
      restitution: 0.1,
      friction: 0.3,
      durability: 20,
      soundProfile: {
        impactSound: "glass_impact",
        frictionSound: "glass_scrape",
        breakSound: "glass_break",
        volume: 0.9,
        pitch: 1.2
      }
    };
    const rubber = {
      id: "material_rubber",
      name: "Rubber",
      density: 1500,
      restitution: 0.8,
      friction: 0.9,
      durability: 80,
      soundProfile: {
        impactSound: "rubber_impact",
        frictionSound: "rubber_scrape",
        breakSound: "rubber_break",
        volume: 0.5,
        pitch: 0.8
      }
    };
    this.materials.set(metal.id, metal);
    this.materials.set(wood.id, wood);
    this.materials.set(glass.id, glass);
    this.materials.set(rubber.id, rubber);
    console.log("\u{1F527} Physics materials configured");
  }
  // Create physics UI
  createPhysicsUI() {
    this.physicsUI = import_ecs20.engine.addEntity();
    import_ecs20.Transform.create(this.physicsUI, {
      position: import_math18.Vector3.create(2, 3, 8),
      scale: import_math18.Vector3.create(3, 4, 0.1)
    });
    import_ecs20.MeshRenderer.setBox(this.physicsUI);
    import_ecs20.Material.setPbrMaterial(this.physicsUI, {
      albedoColor: import_math18.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math18.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs20.engine.addEntity();
    import_ecs20.Transform.create(title, {
      parent: this.physicsUI,
      position: import_math18.Vector3.create(0, 1.7, 0.1),
      scale: import_math18.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs20.TextShape.create(title, {
      text: "PHYSICS INTERACTION",
      textColor: import_math18.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createObjectControls();
    this.createForceFieldControls();
    this.createConstraintControls();
    this.createPhysicsStats();
  }
  // Create object controls
  createObjectControls() {
    const controls = [
      { id: "spawn_ball", icon: "Spawn Ball", name: "Spawn Ball" },
      { id: "spawn_box", icon: "Spawn Box", name: "Spawn Box" },
      { id: "spawn_cylinder", icon: "Spawn Cylinder", name: "Spawn Cylinder" },
      { id: "clear_all", icon: "Clear All", name: "Clear All" }
    ];
    let xOffset = -0.9;
    controls.forEach((control) => {
      const button = import_ecs20.engine.addEntity();
      import_ecs20.Transform.create(button, {
        parent: this.physicsUI,
        position: import_math18.Vector3.create(xOffset, 1.2, 0.1),
        scale: import_math18.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs20.MeshRenderer.setBox(button);
      import_ecs20.Material.setPbrMaterial(button, {
        albedoColor: import_math18.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math18.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs20.engine.addEntity();
      import_ecs20.Transform.create(buttonText, {
        parent: button,
        position: import_math18.Vector3.create(0, 0, 0.1),
        scale: import_math18.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs20.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math18.Color4.create(1, 1, 1, 1),
        fontSize: 1,
        textAlign: 3
      });
      import_ecs20.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs20.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleObjectControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  // Create force field controls
  createForceFieldControls() {
    const controls = [
      { id: "gravity_field", icon: "Gravity", name: "Gravity Field" },
      { id: "magnetic_field", icon: "Magnetic", name: "Magnetic Field" },
      { id: "wind_field", icon: "Wind", name: "Wind Field" },
      { id: "explosion", icon: "Explosion", name: "Explosion" }
    ];
    let xOffset = -0.9;
    controls.forEach((control) => {
      const button = import_ecs20.engine.addEntity();
      import_ecs20.Transform.create(button, {
        parent: this.physicsUI,
        position: import_math18.Vector3.create(xOffset, 0.6, 0.1),
        scale: import_math18.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs20.MeshRenderer.setBox(button);
      import_ecs20.Material.setPbrMaterial(button, {
        albedoColor: import_math18.Color4.create(0.8, 0.3, 0.3, 1),
        emissiveColor: import_math18.Color4.create(0.8, 0.3, 0.3, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs20.engine.addEntity();
      import_ecs20.Transform.create(buttonText, {
        parent: button,
        position: import_math18.Vector3.create(0, 0, 0.1),
        scale: import_math18.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs20.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math18.Color4.create(1, 1, 1, 1),
        fontSize: 1,
        textAlign: 3
      });
      import_ecs20.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs20.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleForceFieldControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  // Create constraint controls
  createConstraintControls() {
    const controls = [
      { id: "spring_constraint", icon: "Spring", name: "Spring" },
      { id: "hinge_constraint", icon: "Hinge", name: "Hinge" },
      { id: "fixed_constraint", icon: "Fixed", name: "Fixed" }
    ];
    let xOffset = -0.6;
    controls.forEach((control) => {
      const button = import_ecs20.engine.addEntity();
      import_ecs20.Transform.create(button, {
        parent: this.physicsUI,
        position: import_math18.Vector3.create(xOffset, 0, 0.1),
        scale: import_math18.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs20.MeshRenderer.setBox(button);
      import_ecs20.Material.setPbrMaterial(button, {
        albedoColor: import_math18.Color4.create(0.3, 0.8, 0.3, 1),
        emissiveColor: import_math18.Color4.create(0.3, 0.8, 0.3, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs20.engine.addEntity();
      import_ecs20.Transform.create(buttonText, {
        parent: button,
        position: import_math18.Vector3.create(0, 0, 0.1),
        scale: import_math18.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs20.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math18.Color4.create(1, 1, 1, 1),
        fontSize: 1,
        textAlign: 3
      });
      import_ecs20.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs20.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleConstraintControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  // Create physics stats
  createPhysicsStats() {
    const statsDisplay = import_ecs20.engine.addEntity();
    import_ecs20.Transform.create(statsDisplay, {
      parent: this.physicsUI,
      position: import_math18.Vector3.create(0, -0.6, 0.1),
      scale: import_math18.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs20.MeshRenderer.setBox(statsDisplay);
    import_ecs20.Material.setPbrMaterial(statsDisplay, {
      albedoColor: import_math18.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math18.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const statsText = import_ecs20.engine.addEntity();
    import_ecs20.Transform.create(statsText, {
      parent: statsDisplay,
      position: import_math18.Vector3.create(0, 0, 0.1),
      scale: import_math18.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs20.TextShape.create(statsText, {
      text: "Objects: 0 | Collisions: 0",
      textColor: import_math18.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create physics objects
  createPhysicsObjects() {
    this.createGroundPlane();
    this.createInitialObjects();
  }
  // Create ground plane
  createGroundPlane() {
    const ground = {
      id: "ground_plane",
      type: "static",
      mass: 0,
      velocity: import_math18.Vector3.create(0, 0, 0),
      acceleration: import_math18.Vector3.create(0, 0, 0),
      angularVelocity: import_math18.Vector3.create(0, 0, 0),
      angularAcceleration: import_math18.Vector3.create(0, 0, 0),
      position: import_math18.Vector3.create(8, 0, 8),
      rotation: import_math18.Quaternion.fromEulerDegrees(0, 0, 0),
      scale: import_math18.Vector3.create(20, 0.1, 20),
      restitution: 0.5,
      friction: 0.8,
      damping: 0.1,
      gravityScale: 0,
      isGrounded: true,
      isColliding: false,
      collisionLayer: 0,
      collisionMask: 255
    };
    this.objects.set(ground.id, ground);
    this.createPhysicsObject(ground, "material_metal");
  }
  // Create initial objects
  createInitialObjects() {
    for (let i = 0; i < 3; i++) {
      this.spawnPhysicsObject("ball", import_math18.Vector3.create(6 + i * 2, 3 + i, 6 + i));
    }
  }
  // Create physics object
  createPhysicsObject(obj, materialId) {
    const entity = import_ecs20.engine.addEntity();
    import_ecs20.Transform.create(entity, {
      position: obj.position,
      scale: obj.scale,
      rotation: obj.rotation
    });
    const material = this.materials.get(materialId);
    if (!material) return;
    if (obj.id.includes("ball")) {
      import_ecs20.MeshRenderer.setSphere(entity);
    } else if (obj.id.includes("box")) {
      import_ecs20.MeshRenderer.setBox(entity);
    } else if (obj.id.includes("cylinder")) {
      import_ecs20.MeshRenderer.setCylinder(entity, 0.5, 0.5);
    } else {
      import_ecs20.MeshRenderer.setBox(entity);
    }
    const color = this.getMaterialColor(materialId);
    import_ecs20.Material.setPbrMaterial(entity, {
      albedoColor: color,
      roughness: 1 - material.friction,
      metallic: material.restitution,
      emissiveColor: import_math18.Color4.create(0, 0, 0, 0),
      emissiveIntensity: 0
    });
    import_ecs20.pointerEventsSystem.onPointerDown(
      {
        entity,
        opts: { button: import_ecs20.InputAction.IA_POINTER, hoverText: "Interact" }
      },
      () => this.interactWithObject(obj.id)
    );
    return entity;
  }
  // Get material color
  getMaterialColor(materialId) {
    switch (materialId) {
      case "material_metal":
        return import_math18.Color4.create(0.7, 0.7, 0.8, 1);
      case "material_wood":
        return import_math18.Color4.create(0.6, 0.4, 0.2, 1);
      case "material_glass":
        return import_math18.Color4.create(0.8, 0.9, 1, 0.7);
      case "material_rubber":
        return import_math18.Color4.create(0.2, 0.2, 0.2, 1);
      default:
        return import_math18.Color4.create(0.5, 0.5, 0.5, 1);
    }
  }
  // Start physics engine
  startPhysicsEngine() {
    import_ecs20.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.simulatePhysics();
      this.detectCollisions();
      this.applyForceFields();
      this.updateConstraints();
      this.updatePhysicsStats();
    });
  }
  // Simulate physics
  simulatePhysics() {
    const dt = this.timeStep;
    this.objects.forEach((obj, id) => {
      if (obj.type === "static") return;
      const gravity = import_math18.Vector3.scale(this.gravity, obj.gravityScale);
      obj.acceleration = import_math18.Vector3.add(obj.acceleration, gravity);
      obj.velocity = import_math18.Vector3.add(obj.velocity, import_math18.Vector3.scale(obj.acceleration, dt));
      obj.velocity = import_math18.Vector3.scale(obj.velocity, 1 - obj.damping * dt);
      obj.angularVelocity = import_math18.Vector3.scale(obj.angularVelocity, 1 - obj.damping * dt);
      obj.position = import_math18.Vector3.add(obj.position, import_math18.Vector3.scale(obj.velocity, dt));
      const angularDelta = import_math18.Vector3.scale(obj.angularVelocity, dt);
      obj.rotation = import_math18.Quaternion.multiply(
        obj.rotation,
        import_math18.Quaternion.fromEulerDegrees(angularDelta.x, angularDelta.y, angularDelta.z)
      );
      obj.acceleration = import_math18.Vector3.create(0, 0, 0);
      obj.angularAcceleration = import_math18.Vector3.create(0, 0, 0);
      this.checkGroundCollision(obj);
      this.updateEntityTransform(id);
    });
  }
  // Check ground collision
  checkGroundCollision(obj) {
    if (obj.position.y <= obj.scale.y / 2) {
      obj.position = import_math18.Vector3.create(obj.position.x, obj.scale.y / 2, obj.position.z);
      if (obj.velocity.y < 0) {
        obj.velocity = import_math18.Vector3.create(obj.velocity.x, -obj.velocity.y * obj.restitution, obj.velocity.z);
        obj.velocity = import_math18.Vector3.create(
          obj.velocity.x * (1 - obj.friction * 0.1),
          obj.velocity.y,
          obj.velocity.z * (1 - obj.friction * 0.1)
        );
        if (Math.abs(obj.velocity.y) > 0.5) {
          soundSystem.playInteractionSound("click");
        }
      }
      obj.isGrounded = true;
    } else {
      obj.isGrounded = false;
    }
  }
  // Update entity transform
  updateEntityTransform(objectId) {
    const obj = this.objects.get(objectId);
    if (!obj) return;
  }
  // Detect collisions
  detectCollisions() {
    const objectArray = Array.from(this.objects.values());
    for (let i = 0; i < objectArray.length; i++) {
      for (let j = i + 1; j < objectArray.length; j++) {
        const objA = objectArray[i];
        const objB = objectArray[j];
        if (this.shouldCollide(objA, objB)) {
          const collision = this.checkCollision(objA, objB);
          if (collision) {
            this.resolveCollision(collision);
          }
        }
      }
    }
  }
  // Check if objects should collide
  shouldCollide(objA, objB) {
    return (objA.collisionMask & 1 << objB.collisionLayer) !== 0 && (objB.collisionMask & 1 << objA.collisionLayer) !== 0;
  }
  // Check collision between two objects
  checkCollision(objA, objB) {
    const distance = import_math18.Vector3.distance(objA.position, objB.position);
    const minDistance = (objA.scale.x + objB.scale.x) / 2;
    if (distance < minDistance) {
      const collision = {
        id: `collision_${Date.now()}_${Math.random()}`,
        objectA: objA.id,
        objectB: objB.id,
        contactPoint: import_math18.Vector3.lerp(objA.position, objB.position, 0.5),
        contactNormal: import_math18.Vector3.normalize(import_math18.Vector3.subtract(objB.position, objA.position)),
        impulse: minDistance - distance,
        timestamp: Date.now()
      };
      return collision;
    }
    return null;
  }
  // Resolve collision
  resolveCollision(collision) {
    const objA = this.objects.get(collision.objectA);
    const objB = this.objects.get(collision.objectB);
    if (!objA || !objB) return;
    const separation = import_math18.Vector3.scale(collision.contactNormal, collision.impulse / 2);
    if (objA.type !== "static") {
      objA.position = import_math18.Vector3.subtract(objA.position, separation);
    }
    if (objB.type !== "static") {
      objB.position = import_math18.Vector3.add(objB.position, separation);
    }
    const relativeVelocity = import_math18.Vector3.subtract(objB.velocity, objA.velocity);
    const velocityAlongNormal = import_math18.Vector3.dot(relativeVelocity, collision.contactNormal);
    if (velocityAlongNormal > 0) return;
    const restitution = Math.min(objA.restitution, objB.restitution);
    const impulseScalar = -(1 + restitution) * velocityAlongNormal;
    const impulse = import_math18.Vector3.scale(collision.contactNormal, impulseScalar);
    if (objA.type !== "static") {
      objA.velocity = import_math18.Vector3.subtract(objA.velocity, impulse);
    }
    if (objB.type !== "static") {
      objB.velocity = import_math18.Vector3.add(objB.velocity, impulse);
    }
    this.collisions.set(collision.id, collision);
    soundSystem.playInteractionSound("click");
  }
  // Apply force fields
  applyForceFields() {
    this.forceFields.forEach((field, id) => {
      if (!field.isActive) return;
      this.objects.forEach((obj, objectId) => {
        if (field.affectedObjects.includes(objectId)) {
          this.applyForceField(obj, field);
        }
      });
    });
  }
  // Apply force field to object
  applyForceField(obj, field) {
    const distance = import_math18.Vector3.distance(obj.position, field.position);
    if (distance <= field.radius) {
      const force = import_math18.Vector3.scale(field.direction, field.strength);
      const falloff = 1 - distance / field.radius;
      const finalForce = import_math18.Vector3.scale(force, falloff);
      obj.acceleration = import_math18.Vector3.add(obj.acceleration, finalForce);
    }
  }
  // Update constraints
  updateConstraints() {
    this.constraints.forEach((constraint, id) => {
      this.applyConstraint(constraint);
    });
  }
  // Apply constraint
  applyConstraint(constraint) {
    const objA = this.objects.get(constraint.objectA);
    const objB = constraint.objectB ? this.objects.get(constraint.objectB) : null;
    if (!objA) return;
    switch (constraint.type) {
      case "spring":
        if (objB) {
          this.applySpringConstraint(objA, objB, constraint);
        }
        break;
      case "hinge":
        if (objB) {
          this.applyHingeConstraint(objA, objB, constraint);
        }
        break;
      case "fixed":
        if (objB) {
          this.applyFixedConstraint(objA, objB, constraint);
        }
        break;
    }
  }
  // Apply spring constraint
  applySpringConstraint(objA, objB, constraint) {
    const distance = import_math18.Vector3.distance(objA.position, objB.position);
    const restLength = constraint.limits && constraint.limits.minDistance || 2;
    const displacement = distance - restLength;
    if (Math.abs(displacement) > 0.01) {
      const direction = import_math18.Vector3.normalize(import_math18.Vector3.subtract(objB.position, objA.position));
      const force = import_math18.Vector3.scale(direction, displacement * constraint.strength);
      objA.acceleration = import_math18.Vector3.add(objA.acceleration, force);
      objB.acceleration = import_math18.Vector3.subtract(objB.acceleration, force);
    }
  }
  // Apply hinge constraint
  applyHingeConstraint(objA, objB, constraint) {
    const targetPos = import_math18.Vector3.add(objB.position, constraint.positionB || import_math18.Vector3.Zero());
    const direction = import_math18.Vector3.subtract(targetPos, objA.position);
    objA.position = import_math18.Vector3.add(targetPos, import_math18.Vector3.scale(direction, -0.5));
    objB.position = import_math18.Vector3.add(targetPos, import_math18.Vector3.scale(direction, 0.5));
  }
  // Apply fixed constraint
  applyFixedConstraint(objA, objB, constraint) {
    const targetPos = import_math18.Vector3.add(objB.position, constraint.positionB || import_math18.Vector3.Zero());
    objA.position = targetPos;
    objA.velocity = import_math18.Vector3.create(0, 0, 0);
  }
  // Update physics stats
  updatePhysicsStats() {
    const objectCount = this.objects.size;
    const collisionCount = this.collisions.size;
    console.log(`Objects: ${objectCount} | Collisions: ${collisionCount}`);
  }
  // Handle object control
  handleObjectControl(controlId) {
    switch (controlId) {
      case "spawn_ball":
        this.spawnPhysicsObject("ball", import_math18.Vector3.create(8, 5, 8));
        break;
      case "spawn_box":
        this.spawnPhysicsObject("box", import_math18.Vector3.create(8, 5, 8));
        break;
      case "spawn_cylinder":
        this.spawnPhysicsObject("cylinder", import_math18.Vector3.create(8, 5, 8));
        break;
      case "clear_all":
        this.clearAllObjects();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Handle force field control
  handleForceFieldControl(controlId) {
    switch (controlId) {
      case "gravity_field":
        this.createForceField("gravity");
        break;
      case "magnetic_field":
        this.createForceField("magnetic");
        break;
      case "wind_field":
        this.createForceField("wind");
        break;
      case "explosion":
        this.createExplosion();
        break;
    }
    soundSystem.playInteractionSound("powerup");
  }
  // Handle constraint control
  handleConstraintControl(controlId) {
    switch (controlId) {
      case "spring_constraint":
        this.createSpringConstraint();
        break;
      case "hinge_constraint":
        this.createHingeConstraint();
        break;
      case "fixed_constraint":
        this.createFixedConstraint();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Spawn physics object
  spawnPhysicsObject(type, position) {
    const obj = {
      id: `${type}_${Date.now()}_${Math.random()}`,
      type: "rigid_body",
      mass: 1,
      velocity: import_math18.Vector3.create((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2),
      acceleration: import_math18.Vector3.create(0, 0, 0),
      angularVelocity: import_math18.Vector3.create(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      angularAcceleration: import_math18.Vector3.create(0, 0, 0),
      position,
      rotation: import_math18.Quaternion.fromEulerDegrees(
        Math.random() * 360,
        Math.random() * 360,
        Math.random() * 360
      ),
      scale: import_math18.Vector3.create(0.5, 0.5, 0.5),
      restitution: 0.6,
      friction: 0.5,
      damping: 0.1,
      gravityScale: 1,
      isGrounded: false,
      isColliding: false,
      collisionLayer: 1,
      collisionMask: 255
    };
    this.objects.set(obj.id, obj);
    this.createPhysicsObject(obj, "material_rubber");
    console.log(`Spawned ${type}: ${obj.id}`);
  }
  // Create force field
  createForceField(type) {
    const field = {
      id: `field_${type}_${Date.now()}`,
      type,
      position: import_math18.Vector3.create(8, 2, 8),
      radius: 5,
      strength: 10,
      direction: import_math18.Vector3.create(0, 1, 0),
      isActive: true,
      affectedObjects: Array.from(this.objects.keys()).filter((id) => id !== "ground_plane")
    };
    this.forceFields.set(field.id, field);
    console.log(`Created ${type} force field: ${field.id}`);
  }
  // Create explosion
  createExplosion() {
    const explosionPos = import_math18.Vector3.create(8, 2, 8);
    const explosionForce = 20;
    const explosionRadius = 8;
    this.objects.forEach((obj, id) => {
      if (obj.type === "static") return;
      const distance = import_math18.Vector3.distance(obj.position, explosionPos);
      if (distance <= explosionRadius) {
        const direction = import_math18.Vector3.normalize(import_math18.Vector3.subtract(obj.position, explosionPos));
        const force = import_math18.Vector3.scale(direction, explosionForce * (1 - distance / explosionRadius));
        obj.velocity = import_math18.Vector3.add(obj.velocity, force);
      }
    });
    soundSystem.playInteractionSound("alert");
    console.log("Explosion created!");
  }
  // Create spring constraint
  createSpringConstraint() {
    const objectIds = Array.from(this.objects.keys()).filter((id) => id !== "ground_plane");
    if (objectIds.length < 2) return;
    const constraint = {
      id: `constraint_spring_${Date.now()}`,
      type: "spring",
      objectA: objectIds[0],
      objectB: objectIds[1],
      positionA: import_math18.Vector3.create(0, 0, 0),
      positionB: import_math18.Vector3.create(0, 0, 0),
      limits: {
        minDistance: 2
      },
      strength: 5,
      damping: 0.5
    };
    this.constraints.set(constraint.id, constraint);
    console.log(`Created spring constraint: ${constraint.id}`);
  }
  // Create hinge constraint
  createHingeConstraint() {
    const objectIds = Array.from(this.objects.keys()).filter((id) => id !== "ground_plane");
    if (objectIds.length < 2) return;
    const constraint = {
      id: `constraint_hinge_${Date.now()}`,
      type: "hinge",
      objectA: objectIds[0],
      objectB: objectIds[1],
      positionA: import_math18.Vector3.create(0, 0, 0),
      positionB: import_math18.Vector3.create(1, 0, 0),
      limits: {
        minRotation: import_math18.Vector3.create(-45, 0, 0),
        maxRotation: import_math18.Vector3.create(45, 0, 0)
      },
      strength: 10,
      damping: 0.5
    };
    this.constraints.set(constraint.id, constraint);
    console.log(`Created hinge constraint: ${constraint.id}`);
  }
  // Create fixed constraint
  createFixedConstraint() {
    const objectIds = Array.from(this.objects.keys()).filter((id) => id !== "ground_plane");
    if (objectIds.length < 2) return;
    const constraint = {
      id: `constraint_fixed_${Date.now()}`,
      type: "fixed",
      objectA: objectIds[0],
      objectB: objectIds[1],
      positionA: import_math18.Vector3.create(0, 0, 0),
      positionB: import_math18.Vector3.create(0, 0, 0),
      strength: 100,
      damping: 1
    };
    this.constraints.set(constraint.id, constraint);
    console.log(`Created fixed constraint: ${constraint.id}`);
  }
  // Interact with object
  interactWithObject(objectId) {
    const obj = this.objects.get(objectId);
    if (!obj || obj.type === "static") return;
    const impulse = import_math18.Vector3.create(
      (Math.random() - 0.5) * 10,
      Math.random() * 10,
      (Math.random() - 0.5) * 10
    );
    obj.velocity = import_math18.Vector3.add(obj.velocity, impulse);
    soundSystem.playInteractionSound("click");
  }
  // Clear all objects
  clearAllObjects() {
    this.objects.forEach((obj, id) => {
      if (id !== "ground_plane") {
        this.objects.delete(id);
      }
    });
    this.forceFields.clear();
    this.constraints.clear();
    this.collisions.clear();
    console.log("Cleared all physics objects");
    soundSystem.playInteractionSound("click");
  }
  // Get physics objects
  getObjects() {
    return Array.from(this.objects.values());
  }
  // Get force fields
  getForceFields() {
    return Array.from(this.forceFields.values());
  }
  // Get constraints
  getConstraints() {
    return Array.from(this.constraints.values());
  }
  // Set gravity
  setGravity(gravity) {
    this.gravity = gravity;
    console.log(`Gravity set to: (${gravity.x}, ${gravity.y}, ${gravity.z})`);
  }
  // Cleanup system
  cleanup() {
    this.objects.clear();
    this.materials.clear();
    this.forceFields.clear();
    this.constraints.clear();
    this.collisions.clear();
    if (this.physicsUI) {
      import_ecs20.engine.removeEntity(this.physicsUI);
    }
    this.isInitialized = false;
  }
};
var physicsSystem = new PhysicsInteractionSystem();

// src/procedural-generation.ts
var import_ecs21 = require("@dcl/sdk/ecs");
var import_math19 = require("@dcl/sdk/math");
var ProceduralGenerationSystem = class {
  constructor() {
    this.chunks = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.chunkSize = 32;
    this.renderDistance = 2;
  }
  initialize() {
    console.log("\u{1F30D} Procedural Generation System Initializing...");
    this.createGenerationUI();
    this.startGenerationEngine();
    this.generateInitialChunks();
    this.isInitialized = true;
    console.log("\u{1F30D} Procedural Generation System Ready!");
  }
  createGenerationUI() {
    this.generationUI = import_ecs21.engine.addEntity();
    import_ecs21.Transform.create(this.generationUI, {
      position: import_math19.Vector3.create(14, 3, 8),
      scale: import_math19.Vector3.create(3, 2, 0.1)
    });
    import_ecs21.MeshRenderer.setBox(this.generationUI);
    import_ecs21.Material.setPbrMaterial(this.generationUI, {
      albedoColor: import_math19.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math19.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs21.engine.addEntity();
    import_ecs21.Transform.create(title, {
      parent: this.generationUI,
      position: import_math19.Vector3.create(0, 0.7, 0.1),
      scale: import_math19.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs21.TextShape.create(title, {
      text: "\u{1F30D} INFINITE WORLD",
      textColor: import_math19.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    const controls = [
      { id: "generate", icon: "\u{1F3B2}", name: "Generate" },
      { id: "expand", icon: "\u2795", name: "Expand" },
      { id: "reset", icon: "\u{1F5D1}\uFE0F", name: "Reset" }
    ];
    let xOffset = -0.6;
    controls.forEach((control) => {
      const button = import_ecs21.engine.addEntity();
      import_ecs21.Transform.create(button, {
        parent: this.generationUI,
        position: import_math19.Vector3.create(xOffset, 0, 0.1),
        scale: import_math19.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs21.MeshRenderer.setBox(button);
      import_ecs21.Material.setPbrMaterial(button, {
        albedoColor: import_math19.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math19.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs21.engine.addEntity();
      import_ecs21.Transform.create(buttonText, {
        parent: button,
        position: import_math19.Vector3.create(0, 0, 0.1),
        scale: import_math19.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs21.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math19.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs21.pointerEventsSystem.onPointerDown(
        { entity: button, opts: { button: import_ecs21.InputAction.IA_POINTER, hoverText: control.name } },
        () => this.handleControl(control.id)
      );
      xOffset += 0.6;
    });
  }
  handleControl(controlId) {
    switch (controlId) {
      case "generate":
        this.generateNewChunk();
        break;
      case "expand":
        this.expandWorld();
        break;
      case "reset":
        this.resetWorld();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  startGenerationEngine() {
    import_ecs21.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateChunks();
    });
  }
  generateInitialChunks() {
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        this.generateChunk(x, z);
      }
    }
  }
  generateChunk(x, z) {
    const chunkId = `chunk_${x}_${z}`;
    const biomes = ["office", "tech", "nature", "abstract"];
    const biome = biomes[Math.floor(Math.random() * biomes.length)];
    const chunk = {
      id: chunkId,
      position: import_math19.Vector3.create(x * this.chunkSize, 0, z * this.chunkSize),
      biome,
      structures: [],
      entities: [],
      isLoaded: false
    };
    this.chunks.set(chunkId, chunk);
    this.generateChunkContent(chunk);
    console.log(`\u{1F30D} Generated chunk ${chunkId} (${biome})`);
    return chunk;
  }
  generateChunkContent(chunk) {
    const structureCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < structureCount; i++) {
      const structure = {
        id: `struct_${chunk.id}_${i}`,
        type: chunk.biome === "office" ? "building" : "decoration",
        position: import_math19.Vector3.create(
          chunk.position.x + Math.random() * this.chunkSize,
          2,
          chunk.position.z + Math.random() * this.chunkSize
        )
      };
      chunk.structures.push(structure);
    }
    const entityCount = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < entityCount; i++) {
      const entity = {
        id: `entity_${chunk.id}_${i}`,
        type: chunk.biome === "nature" ? "plant" : "object",
        position: import_math19.Vector3.create(
          chunk.position.x + Math.random() * this.chunkSize,
          1,
          chunk.position.z + Math.random() * this.chunkSize
        )
      };
      chunk.entities.push(entity);
    }
  }
  updateChunks() {
    this.chunks.forEach((chunk) => {
      if (!chunk.isLoaded) {
        this.loadChunk(chunk);
      }
    });
  }
  loadChunk(chunk) {
    const terrain = import_ecs21.engine.addEntity();
    import_ecs21.Transform.create(terrain, {
      position: chunk.position,
      scale: import_math19.Vector3.create(this.chunkSize, 0.1, this.chunkSize)
    });
    import_ecs21.MeshRenderer.setBox(terrain);
    const biomeColor = this.getBiomeColor(chunk.biome);
    import_ecs21.Material.setPbrMaterial(terrain, {
      albedoColor: biomeColor,
      roughness: 0.8,
      metallic: 0.1
    });
    chunk.structures.forEach((structure) => {
      const structEntity = import_ecs21.engine.addEntity();
      import_ecs21.Transform.create(structEntity, {
        position: structure.position,
        scale: import_math19.Vector3.create(2, 4, 2)
      });
      import_ecs21.MeshRenderer.setBox(structEntity);
      import_ecs21.Material.setPbrMaterial(structEntity, {
        albedoColor: import_math19.Color4.create(0.7, 0.7, 0.7, 1),
        roughness: 0.3,
        metallic: 0.5
      });
    });
    chunk.entities.forEach((entity) => {
      const entityEntity = import_ecs21.engine.addEntity();
      import_ecs21.Transform.create(entityEntity, {
        position: entity.position,
        scale: import_math19.Vector3.create(0.5, 1, 0.5)
      });
      import_ecs21.MeshRenderer.setSphere(entityEntity);
      import_ecs21.Material.setPbrMaterial(entityEntity, {
        albedoColor: import_math19.Color4.create(0.2, 0.8, 0.2, 1),
        roughness: 0.5,
        metallic: 0.1
      });
    });
    chunk.isLoaded = true;
  }
  getBiomeColor(biome) {
    switch (biome) {
      case "office":
        return import_math19.Color4.create(0.6, 0.6, 0.7, 1);
      case "tech":
        return import_math19.Color4.create(0.2, 0.4, 0.8, 1);
      case "nature":
        return import_math19.Color4.create(0.2, 0.8, 0.2, 1);
      case "abstract":
        return import_math19.Color4.create(0.8, 0.2, 0.8, 1);
      default:
        return import_math19.Color4.create(0.5, 0.5, 0.5, 1);
    }
  }
  generateNewChunk() {
    const x = Math.floor(Math.random() * 10) - 5;
    const z = Math.floor(Math.random() * 10) - 5;
    this.generateChunk(x, z);
    soundSystem.playInteractionSound("powerup");
  }
  expandWorld() {
    for (let i = 0; i < 4; i++) {
      const x = Math.floor(Math.random() * 20) - 10;
      const z = Math.floor(Math.random() * 20) - 10;
      this.generateChunk(x, z);
    }
    soundSystem.playInteractionSound("powerup");
  }
  resetWorld() {
    this.chunks.forEach((chunk) => {
      chunk.isLoaded = false;
    });
    this.chunks.clear();
    this.generateInitialChunks();
    soundSystem.playInteractionSound("click");
  }
  getChunks() {
    return Array.from(this.chunks.values());
  }
  cleanup() {
    this.chunks.clear();
    if (this.generationUI) {
      import_ecs21.engine.removeEntity(this.generationUI);
    }
    this.isInitialized = false;
  }
};
var proceduralSystem = new ProceduralGenerationSystem();

// src/responsive-ui-system.ts
var import_ecs22 = require("@dcl/sdk/ecs");
var import_math20 = require("@dcl/sdk/math");
var ResponsiveUISystem = class {
  constructor() {
    this.components = /* @__PURE__ */ new Map();
    this.touchPoints = /* @__PURE__ */ new Map();
    this.activeGestures = /* @__PURE__ */ new Map();
    this.gestureThresholds = {
      tap: { maxDuration: 300, maxDistance: 0.1 },
      longPress: { minDuration: 500, maxDistance: 0.1 },
      swipe: { minVelocity: 0.5, minDistance: 0.5 },
      pinch: { minScale: 0.8, maxScale: 1.2 },
      rotate: { minAngle: 15 }
    };
    this.isInitialized = false;
  }
  // Initialize the UI system
  initialize() {
    console.log("\u{1F4F1} Responsive UI System Initializing...");
    this.createMainUI();
    this.setupGestureRecognition();
    this.startAnimationLoop();
    this.isInitialized = true;
    console.log("\u{1F4F1} Responsive UI System Ready!");
  }
  // Create main UI interface
  createMainUI() {
    this.createFloatingPanel();
    this.createGestureTutorial();
    this.createResponsiveButtons();
    this.createTouchFeedback();
  }
  // Create floating control panel
  createFloatingPanel() {
    const panel = import_ecs22.engine.addEntity();
    import_ecs22.Transform.create(panel, {
      position: import_math20.Vector3.create(8, 3, 2),
      scale: import_math20.Vector3.create(4, 2, 0.1)
    });
    import_ecs22.MeshRenderer.setBox(panel);
    import_ecs22.Material.setPbrMaterial(panel, {
      albedoColor: import_math20.Color4.create(0.1, 0.1, 0.2, 0.9),
      roughness: 0.2,
      metallic: 0.8,
      emissiveColor: import_math20.Color4.create(0.2, 0.3, 0.6, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs22.engine.addEntity();
    import_ecs22.Transform.create(title, {
      parent: panel,
      position: import_math20.Vector3.create(0, 0.7, 0.1),
      scale: import_math20.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs22.TextShape.create(title, {
      text: "\u{1F3AE} CONTROL PANEL",
      textColor: import_math20.Color4.create(0.8, 0.8, 1, 1),
      fontSize: 3,
      textAlign: 3
    });
    this.addComponent("mainPanel", {
      id: "mainPanel",
      entity: panel,
      type: "panel",
      position: import_math20.Vector3.create(8, 3, 2),
      size: import_math20.Vector3.create(4, 2, 0.1),
      visible: true,
      interactive: true,
      gestureHandlers: /* @__PURE__ */ new Map([
        ["drag", this.handlePanelDrag.bind(this)],
        ["pinch", this.handlePanelPinch.bind(this)],
        ["doubleTap", this.handlePanelDoubleTap.bind(this)]
      ])
    });
  }
  // Create gesture tutorial
  createGestureTutorial() {
    const tutorial = import_ecs22.engine.addEntity();
    import_ecs22.Transform.create(tutorial, {
      position: import_math20.Vector3.create(14, 4, 2),
      scale: import_math20.Vector3.create(2, 3, 0.1)
    });
    import_ecs22.MeshRenderer.setBox(tutorial);
    import_ecs22.Material.setPbrMaterial(tutorial, {
      albedoColor: import_math20.Color4.create(0.2, 0.1, 0.3, 0.8),
      emissiveColor: import_math20.Color4.create(0.4, 0.2, 0.6, 0.4),
      emissiveIntensity: 1
    });
    const tutorialText = import_ecs22.engine.addEntity();
    import_ecs22.Transform.create(tutorialText, {
      parent: tutorial,
      position: import_math20.Vector3.create(0, 0, 0.1),
      scale: import_math20.Vector3.create(0.2, 0.2, 0.2)
    });
    import_ecs22.TextShape.create(tutorialText, {
      text: "\u{1F446} TAP\n\u{1F91A} SWIPE\n\u{1F90F} PINCH\n\u{1F504} ROTATE\n\u23F0 LONG PRESS",
      textColor: import_math20.Color4.create(1, 1, 0.8, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.addComponent("gestureTutorial", {
      id: "gestureTutorial",
      entity: tutorial,
      type: "panel",
      position: import_math20.Vector3.create(14, 4, 2),
      size: import_math20.Vector3.create(2, 3, 0.1),
      visible: true,
      interactive: true,
      gestureHandlers: /* @__PURE__ */ new Map([["tap", this.handleTutorialTap.bind(this)]])
    });
  }
  // Create responsive buttons
  createResponsiveButtons() {
    const buttonConfigs = [
      {
        id: "btnLights",
        label: "\u{1F4A1}",
        pos: import_math20.Vector3.create(2, 1.5, 2),
        color: import_math20.Color4.create(1, 0.8, 0.2, 1)
      },
      {
        id: "btnSound",
        label: "\u{1F50A}",
        pos: import_math20.Vector3.create(3, 1.5, 2),
        color: import_math20.Color4.create(0.2, 0.8, 1, 1)
      },
      {
        id: "btnData",
        label: "\u{1F4CA}",
        pos: import_math20.Vector3.create(4, 1.5, 2),
        color: import_math20.Color4.create(0.8, 0.2, 1, 1)
      },
      {
        id: "btnNPC",
        label: "\u{1F916}",
        pos: import_math20.Vector3.create(5, 1.5, 2),
        color: import_math20.Color4.create(0.2, 1, 0.8, 1)
      }
    ];
    buttonConfigs.forEach((config) => {
      const button = import_ecs22.engine.addEntity();
      import_ecs22.Transform.create(button, {
        position: config.pos,
        scale: import_math20.Vector3.create(0.4, 0.4, 0.1)
      });
      import_ecs22.MeshRenderer.setBox(button);
      import_ecs22.Material.setPbrMaterial(button, {
        albedoColor: config.color,
        roughness: 0.1,
        metallic: 0.9,
        emissiveColor: config.color,
        emissiveIntensity: 2
      });
      const buttonText = import_ecs22.engine.addEntity();
      import_ecs22.Transform.create(buttonText, {
        parent: button,
        position: import_math20.Vector3.create(0, 0, 0.1),
        scale: import_math20.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs22.TextShape.create(buttonText, {
        text: config.label,
        textColor: import_math20.Color4.create(1, 1, 1, 1),
        fontSize: 4,
        textAlign: 3
      });
      this.addComponent(config.id, {
        id: config.id,
        entity: button,
        type: "button",
        position: config.pos,
        size: import_math20.Vector3.create(0.4, 0.4, 0.1),
        visible: true,
        interactive: true,
        gestureHandlers: /* @__PURE__ */ new Map([
          ["tap", () => this.handleButtonTap(config.id)],
          ["longPress", () => this.handleButtonLongPress(config.id)],
          ["swipe", (direction) => this.handleButtonSwipe(config.id, direction)]
        ])
      });
    });
  }
  // Create touch feedback system
  createTouchFeedback() {
    const rippleEffect = import_ecs22.engine.addEntity();
    import_ecs22.Transform.create(rippleEffect, {
      position: import_math20.Vector3.create(0, -10, 0),
      // Hidden initially
      scale: import_math20.Vector3.create(0.1, 0.1, 0.1)
    });
    import_ecs22.MeshRenderer.setSphere(rippleEffect);
    import_ecs22.Material.setPbrMaterial(rippleEffect, {
      albedoColor: import_math20.Color4.create(0.5, 0.8, 1, 0.6),
      emissiveColor: import_math20.Color4.create(0.5, 0.8, 1, 0.8),
      emissiveIntensity: 3
    });
    this.addComponent("touchFeedback", {
      id: "touchFeedback",
      entity: rippleEffect,
      type: "panel",
      position: import_math20.Vector3.create(0, -10, 0),
      size: import_math20.Vector3.create(0.1, 0.1, 0.1),
      visible: false,
      interactive: false,
      gestureHandlers: /* @__PURE__ */ new Map()
    });
  }
  // Setup gesture recognition system
  setupGestureRecognition() {
    import_ecs22.pointerEventsSystem.onPointerDown(
      { entity: import_ecs22.engine.RootEntity, opts: { button: import_ecs22.InputAction.IA_POINTER } },
      (e) => this.handleTouchStart(e)
    );
    import_ecs22.pointerEventsSystem.onPointerUp(
      { entity: import_ecs22.engine.RootEntity, opts: { button: import_ecs22.InputAction.IA_POINTER } },
      (e) => this.handleTouchEnd(e)
    );
    import_ecs22.engine.addSystem(() => {
      this.updateHoverStates();
    });
  }
  // Handle touch start
  handleTouchStart(event) {
    const touchPoint = {
      id: Date.now(),
      position: import_math20.Vector3.create(event.hit.hitPoint.x, event.hit.hitPoint.y, event.hit.hitPoint.z),
      timestamp: Date.now(),
      pressure: 1
    };
    this.touchPoints.set(touchPoint.id, touchPoint);
    this.startGestureDetection(touchPoint);
    this.showTouchFeedback(touchPoint.position);
  }
  // Handle touch end
  handleTouchEnd(event) {
    const touchPoint = Array.from(this.touchPoints.values()).pop();
    if (!touchPoint) return;
    const endPosition = import_math20.Vector3.create(
      event.hit.hitPoint.x,
      event.hit.hitPoint.y,
      event.hit.hitPoint.z
    );
    const duration = Date.now() - touchPoint.timestamp;
    const distance = import_math20.Vector3.distance(touchPoint.position, endPosition);
    this.detectAndTriggerGesture(touchPoint, endPosition, duration, distance);
    this.touchPoints.delete(touchPoint.id);
    this.hideTouchFeedback();
  }
  // Start gesture detection
  startGestureDetection(touchPoint) {
    setTimeout(() => {
      if (this.touchPoints.has(touchPoint.id)) {
        this.triggerGesture(
          "longPress",
          touchPoint.position,
          touchPoint.position,
          Date.now() - touchPoint.timestamp,
          0
        );
      }
    }, this.gestureThresholds.longPress.minDuration);
  }
  // Detect and trigger gestures
  detectAndTriggerGesture(startPoint, endPosition, duration, distance) {
    if (duration <= this.gestureThresholds.tap.maxDuration && distance <= this.gestureThresholds.tap.maxDistance) {
      this.triggerGesture("tap", startPoint.position, endPosition, duration, distance);
      return;
    }
    const velocity = distance / duration * 1e3;
    if (velocity >= this.gestureThresholds.swipe.minVelocity && distance >= this.gestureThresholds.swipe.minDistance) {
      const direction = import_math20.Vector3.normalize(import_math20.Vector3.subtract(endPosition, startPoint.position));
      this.triggerGesture("swipe", startPoint.position, endPosition, duration, distance, direction);
      return;
    }
    if (duration >= this.gestureThresholds.longPress.minDuration && distance <= this.gestureThresholds.longPress.maxDistance) {
      this.triggerGesture("longPress", startPoint.position, endPosition, duration, distance);
    }
  }
  // Trigger gesture on components
  triggerGesture(type, startPos, endPos, duration, distance, direction) {
    this.components.forEach((component) => {
      if (!component.interactive || !component.visible) return;
      if (this.isPointInComponent(endPos, component)) {
        const handler = component.gestureHandlers.get(type);
        if (handler) {
          soundSystem.playInteractionSound("click");
          if (direction) {
            handler(direction);
          } else {
            handler();
          }
        }
      }
    });
  }
  // Check if point is within component bounds
  isPointInComponent(point, component) {
    const halfSize = import_math20.Vector3.scale(component.size, 0.5);
    const minBounds = import_math20.Vector3.subtract(component.position, halfSize);
    const maxBounds = import_math20.Vector3.add(component.position, halfSize);
    return point.x >= minBounds.x && point.x <= maxBounds.x && point.y >= minBounds.y && point.y <= maxBounds.y && point.z >= minBounds.z && point.z <= maxBounds.z;
  }
  // Show touch feedback
  showTouchFeedback(position) {
    const feedback = this.components.get("touchFeedback");
    if (feedback) {
      const transform = import_ecs22.Transform.getMutable(feedback.entity);
      transform.position = position;
      transform.scale = import_math20.Vector3.create(0.1, 0.1, 0.1);
      this.animateRipple(feedback.entity);
    }
  }
  // Hide touch feedback
  hideTouchFeedback() {
    const feedback = this.components.get("touchFeedback");
    if (feedback) {
      const transform = import_ecs22.Transform.getMutable(feedback.entity);
      transform.position = import_math20.Vector3.create(0, -10, 0);
    }
  }
  // Animate ripple effect
  animateRipple(entity) {
    let scale = 0.1;
    let opacity = 1;
    const animate = () => {
      scale += 0.02;
      opacity -= 0.02;
      const transform = import_ecs22.Transform.getMutable(entity);
      transform.scale = import_math20.Vector3.create(scale, scale, scale);
      import_ecs22.Material.setPbrMaterial(entity, {
        albedoColor: import_math20.Color4.create(0.5, 0.8, 1, opacity),
        emissiveColor: import_math20.Color4.create(0.5, 0.8, 1, opacity),
        emissiveIntensity: 3
      });
      if (opacity > 0) {
        setTimeout(animate, 16);
      }
    };
    animate();
  }
  // Gesture handlers
  handlePanelDrag() {
    console.log("\u{1F3AE} Panel dragged");
  }
  handlePanelPinch() {
    console.log("\u{1F3AE} Panel pinched");
  }
  handlePanelDoubleTap() {
    console.log("\u{1F3AE} Panel double-tapped");
  }
  handleTutorialTap() {
    console.log("\u{1F4DA} Tutorial tapped");
  }
  handleButtonTap(buttonId) {
    console.log(`\u{1F518} Button ${buttonId} tapped`);
    switch (buttonId) {
      case "btnLights":
        this.toggleLights();
        break;
      case "btnSound":
        this.toggleSound();
        break;
      case "btnData":
        this.toggleDataVisualization();
        break;
      case "btnNPC":
        this.toggleNPCs();
        break;
    }
  }
  handleButtonLongPress(buttonId) {
    console.log(`\u23F0 Button ${buttonId} long-pressed`);
  }
  handleButtonSwipe(buttonId, direction) {
    console.log(`\u{1F446} Button ${buttonId} swiped ${direction}`);
  }
  // Control functions
  toggleLights() {
    console.log("\u{1F4A1} Lights toggled");
  }
  toggleSound() {
    console.log("\u{1F50A} Sound toggled");
  }
  toggleDataVisualization() {
    console.log("\u{1F4CA} Data visualization toggled");
  }
  toggleNPCs() {
    console.log("\u{1F916} NPCs toggled");
  }
  // Update hover states
  updateHoverStates() {
    this.components.forEach((component) => {
      if (!component.interactive || !component.visible) return;
      const time = Date.now() / 1e3;
      const pulse = Math.sin(time * 3) * 0.1 + 0.9;
      import_ecs22.Material.setPbrMaterial(component.entity, {
        emissiveIntensity: pulse * 2
      });
    });
  }
  // Start animation loop
  startAnimationLoop() {
    import_ecs22.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateUIAnimations();
    });
  }
  // Update UI animations
  updateUIAnimations() {
    this.components.forEach((component) => {
      if (!component.visible) return;
      if (component.interactive) {
        const time = Date.now() / 1e3;
        const transform = import_ecs22.Transform.getMutable(component.entity);
        const floatOffset = Math.sin(time + component.position.x) * 0.02;
        transform.position.y = component.position.y + floatOffset;
      }
    });
  }
  // Add component to system
  addComponent(id, component) {
    this.components.set(id, component);
  }
  // Get component by ID
  getComponent(id) {
    return this.components.get(id);
  }
  // Show/hide component
  setComponentVisibility(id, visible) {
    const component = this.components.get(id);
    if (component) {
      component.visible = visible;
      const transform = import_ecs22.Transform.getMutable(component.entity);
      if (visible) {
        transform.scale = component.size;
      } else {
        transform.scale = import_math20.Vector3.create(0, 0, 0);
      }
    }
  }
  // Cleanup system
  cleanup() {
    this.components.forEach((component) => {
      import_ecs22.engine.removeEntity(component.entity);
    });
    this.components.clear();
    this.touchPoints.clear();
    this.activeGestures.clear();
    this.isInitialized = false;
  }
};
var uiSystem = new ResponsiveUISystem();

// src/smart-room-system.ts
var import_ecs23 = require("@dcl/sdk/ecs");
var import_math21 = require("@dcl/sdk/math");
var SmartRoomSystem = class {
  constructor() {
    this.devices = /* @__PURE__ */ new Map();
    this.automationRules = /* @__PURE__ */ new Map();
    this.smartScenes = /* @__PURE__ */ new Map();
    this.isInitialized = false;
    this.currentScene = "default";
    this.energyUsage = 0;
  }
  // Initialize smart room system
  initialize() {
    console.log("\u{1F3E0} Smart Room System Initializing...");
    this.createIoTDevices();
    this.createAutomationRules();
    this.createSmartScenes();
    this.createControlPanel();
    this.startAutomationEngine();
    this.isInitialized = true;
    console.log("\u{1F3E0} Smart Room System Ready!");
  }
  // Create IoT devices
  createIoTDevices() {
    this.createDevice("light_main", "Main Light", "light", import_math21.Vector3.create(8, 4, 8));
    this.createDevice("light_desk", "Desk Light", "light", import_math21.Vector3.create(4, 2.5, 4));
    this.createDevice("light_meeting", "Meeting Room Light", "light", import_math21.Vector3.create(12, 2.5, 12));
    this.createDevice("temp_main", "Thermostat", "temperature", import_math21.Vector3.create(8, 3, 2));
    this.createDevice("security_main", "Security System", "security", import_math21.Vector3.create(1, 2, 8));
    this.createDevice("camera_entrance", "Entrance Camera", "security", import_math21.Vector3.create(8, 3, 15));
    this.createDevice(
      "entertainment_display",
      "Smart Display",
      "entertainment",
      import_math21.Vector3.create(8, 3, 0.5)
    );
    this.createDevice(
      "entertainment_audio",
      "Audio System",
      "entertainment",
      import_math21.Vector3.create(14, 2, 8)
    );
    this.createDevice("productivity_focus", "Focus Mode", "productivity", import_math21.Vector3.create(4, 3, 12));
    this.createDevice("productivity_timer", "Work Timer", "productivity", import_math21.Vector3.create(12, 3, 4));
    this.createDevice("energy_monitor", "Energy Monitor", "energy", import_math21.Vector3.create(2, 3, 2));
    this.createDevice("energy_solar", "Solar Panels", "energy", import_math21.Vector3.create(14, 5, 14));
  }
  // Create individual device
  createDevice(id, name, type, position) {
    const device = import_ecs23.engine.addEntity();
    import_ecs23.Transform.create(device, {
      position,
      scale: import_math21.Vector3.create(0.3, 0.3, 0.3)
    });
    let deviceColor;
    let deviceIcon;
    switch (type) {
      case "light":
        deviceColor = import_math21.Color4.create(1, 0.8, 0.2, 1);
        deviceIcon = "\u{1F4A1}";
        import_ecs23.MeshRenderer.setSphere(device);
        break;
      case "temperature":
        deviceColor = import_math21.Color4.create(0.2, 0.8, 1, 1);
        deviceIcon = "\u{1F321}\uFE0F";
        import_ecs23.MeshRenderer.setBox(device);
        break;
      case "security":
        deviceColor = import_math21.Color4.create(0.8, 0.2, 0.2, 1);
        deviceIcon = "\u{1F6E1}\uFE0F";
        import_ecs23.MeshRenderer.setBox(device);
        break;
      case "entertainment":
        deviceColor = import_math21.Color4.create(0.8, 0.2, 0.8, 1);
        deviceIcon = "\u{1F3AE}";
        import_ecs23.MeshRenderer.setBox(device);
        break;
      case "productivity":
        deviceColor = import_math21.Color4.create(0.2, 0.8, 0.2, 1);
        deviceIcon = "\u26A1";
        import_ecs23.MeshRenderer.setBox(device);
        break;
      case "energy":
        deviceColor = import_math21.Color4.create(1, 0.6, 0.2, 1);
        deviceIcon = "\u26A1";
        import_ecs23.MeshRenderer.setBox(device);
        break;
      default:
        deviceColor = import_math21.Color4.create(0.5, 0.5, 0.5, 1);
        deviceIcon = "\u{1F4F1}";
        import_ecs23.MeshRenderer.setBox(device);
    }
    import_ecs23.Material.setPbrMaterial(device, {
      albedoColor: deviceColor,
      roughness: 0.2,
      metallic: 0.8,
      emissiveColor: import_math21.Color4.create(
        deviceColor.r * 0.5,
        deviceColor.g * 0.5,
        deviceColor.b * 0.5,
        0.5
      ),
      emissiveIntensity: 1
    });
    const label = import_ecs23.engine.addEntity();
    import_ecs23.Transform.create(label, {
      parent: device,
      position: import_math21.Vector3.create(0, 0.3, 0),
      scale: import_math21.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs23.TextShape.create(label, {
      text: deviceIcon,
      textColor: import_math21.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    const statusIndicator = import_ecs23.engine.addEntity();
    import_ecs23.Transform.create(statusIndicator, {
      parent: device,
      position: import_math21.Vector3.create(0, -0.2, 0),
      scale: import_math21.Vector3.create(0.1, 0.1, 0.1)
    });
    import_ecs23.MeshRenderer.setSphere(statusIndicator);
    import_ecs23.Material.setPbrMaterial(statusIndicator, {
      albedoColor: import_math21.Color4.create(0, 1, 0, 1),
      emissiveColor: import_math21.Color4.create(0, 1, 0, 1),
      emissiveIntensity: 2
    });
    const iotDevice = {
      id,
      name,
      type,
      status: "online",
      value: type === "light" ? false : type === "temperature" ? 22 : 0,
      position,
      automationRules: [],
      lastUpdate: Date.now()
    };
    this.devices.set(id, iotDevice);
    import_ecs23.pointerEventsSystem.onPointerDown(
      {
        entity: device,
        opts: { button: import_ecs23.InputAction.IA_POINTER, hoverText: `Control ${name}` }
      },
      () => this.handleDeviceInteraction(id)
    );
  }
  // Create automation rules
  createAutomationRules() {
    this.createAutomationRule(
      "morning_routine",
      "Morning Routine",
      {
        type: "time",
        conditions: [{ deviceId: "temp_main", property: "hour", operator: "equals", value: 8 }]
      },
      [
        { type: "setDevice", target: "light_main", parameters: { value: true } },
        { type: "setDevice", target: "temp_main", parameters: { value: 22 } },
        {
          type: "setDevice",
          target: "entertainment_audio",
          parameters: { value: "morning_playlist" }
        }
      ]
    );
    this.createAutomationRule(
      "energy_saving",
      "Energy Saving",
      {
        type: "device",
        conditions: [
          { deviceId: "energy_monitor", property: "usage", operator: "greater", value: 80 }
        ]
      },
      [
        { type: "setDevice", target: "light_main", parameters: { value: false } },
        { type: "setDevice", target: "light_desk", parameters: { value: false } },
        { type: "notify", target: "user", parameters: { message: "High energy usage detected" } }
      ]
    );
    this.createAutomationRule(
      "security_night",
      "Night Security",
      {
        type: "time",
        conditions: [{ deviceId: "temp_main", property: "hour", operator: "greater", value: 22 }]
      },
      [
        { type: "setDevice", target: "security_main", parameters: { value: "armed" } },
        { type: "setDevice", target: "camera_entrance", parameters: { value: "recording" } }
      ]
    );
    this.createAutomationRule(
      "focus_mode",
      "Focus Mode",
      {
        type: "device",
        conditions: [
          { deviceId: "productivity_focus", property: "active", operator: "equals", value: true }
        ]
      },
      [
        { type: "setDevice", target: "entertainment_audio", parameters: { value: false } },
        { type: "setDevice", target: "light_desk", parameters: { value: true, brightness: 0.8 } },
        { type: "notify", target: "user", parameters: { message: "Focus mode activated" } }
      ]
    );
  }
  // Create automation rule
  createAutomationRule(id, name, trigger, actions) {
    const rule = {
      id,
      name,
      trigger,
      actions,
      enabled: true,
      priority: 1
    };
    this.automationRules.set(id, rule);
  }
  // Create smart scenes
  createSmartScenes() {
    this.createSmartScene(
      "work_mode",
      "Work Mode",
      "Optimized for productivity",
      ["light_main", "light_desk", "productivity_timer"],
      /* @__PURE__ */ new Map([
        ["light_main", { value: true, brightness: 0.9 }],
        ["light_desk", { value: true, brightness: 0.8 }],
        ["temp_main", { value: 21 }],
        ["productivity_timer", { value: true, duration: 25 }]
      ]),
      "\u{1F4BC}"
    );
    this.createSmartScene(
      "meeting_mode",
      "Meeting Mode",
      "Optimized for collaboration",
      ["light_main", "light_meeting", "entertainment_display"],
      /* @__PURE__ */ new Map([
        ["light_main", { value: true, brightness: 0.7 }],
        ["light_meeting", { value: true, brightness: 0.8 }],
        ["entertainment_display", { value: "presentation_mode" }],
        ["temp_main", { value: 22 }]
      ]),
      "\u{1F91D}"
    );
    this.createSmartScene(
      "relax_mode",
      "Relax Mode",
      "Optimized for comfort",
      ["entertainment_audio", "light_main"],
      /* @__PURE__ */ new Map([
        ["light_main", { value: true, brightness: 0.3, color: "warm" }],
        ["entertainment_audio", { value: "relax_playlist" }],
        ["temp_main", { value: 23 }]
      ]),
      "\u{1F319}"
    );
    this.createSmartScene(
      "energy_saver",
      "Energy Saver",
      "Minimize energy consumption",
      ["light_main", "light_desk", "entertainment_display"],
      /* @__PURE__ */ new Map([
        ["light_main", { value: false }],
        ["light_desk", { value: false }],
        ["entertainment_display", { value: false }],
        ["temp_main", { value: 20 }]
      ]),
      "\u{1F331}"
    );
  }
  // Create smart scene
  createSmartScene(id, name, description, devices, settings, icon) {
    const scene = {
      id,
      name,
      description,
      devices,
      settings,
      icon
    };
    this.smartScenes.set(id, scene);
  }
  // Create control panel
  createControlPanel() {
    this.controlPanel = import_ecs23.engine.addEntity();
    import_ecs23.Transform.create(this.controlPanel, {
      position: import_math21.Vector3.create(8, 3, 14),
      scale: import_math21.Vector3.create(4, 3, 0.1)
    });
    import_ecs23.MeshRenderer.setBox(this.controlPanel);
    import_ecs23.Material.setPbrMaterial(this.controlPanel, {
      albedoColor: import_math21.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math21.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs23.engine.addEntity();
    import_ecs23.Transform.create(title, {
      parent: this.controlPanel,
      position: import_math21.Vector3.create(0, 1.2, 0.1),
      scale: import_math21.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs23.TextShape.create(title, {
      text: "\u{1F3E0} SMART ROOM CONTROL",
      textColor: import_math21.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createSceneButtons();
    this.createDeviceStatusDisplay();
    this.createEnergyMonitor();
  }
  // Create scene buttons
  createSceneButtons() {
    let xOffset = -1.2;
    this.smartScenes.forEach((scene, id) => {
      const button = import_ecs23.engine.addEntity();
      import_ecs23.Transform.create(button, {
        parent: this.controlPanel,
        position: import_math21.Vector3.create(xOffset, 0.5, 0.1),
        scale: import_math21.Vector3.create(0.5, 0.3, 0.1)
      });
      import_ecs23.MeshRenderer.setBox(button);
      import_ecs23.Material.setPbrMaterial(button, {
        albedoColor: import_math21.Color4.create(0.2, 0.6, 0.8, 1),
        emissiveColor: import_math21.Color4.create(0.2, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs23.engine.addEntity();
      import_ecs23.Transform.create(buttonText, {
        parent: button,
        position: import_math21.Vector3.create(0, 0, 0.1),
        scale: import_math21.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs23.TextShape.create(buttonText, {
        text: `${scene.icon} ${scene.name}`,
        textColor: import_math21.Color4.create(1, 1, 1, 1),
        fontSize: 1.5,
        textAlign: 3
      });
      import_ecs23.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs23.InputAction.IA_POINTER, hoverText: `Activate ${scene.name}` }
        },
        () => this.activateScene(id)
      );
      xOffset += 0.8;
    });
  }
  // Create device status display
  createDeviceStatusDisplay() {
    const statusDisplay = import_ecs23.engine.addEntity();
    import_ecs23.Transform.create(statusDisplay, {
      parent: this.controlPanel,
      position: import_math21.Vector3.create(0, -0.3, 0.1),
      scale: import_math21.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs23.MeshRenderer.setBox(statusDisplay);
    import_ecs23.Material.setPbrMaterial(statusDisplay, {
      albedoColor: import_math21.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math21.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    this.updateDeviceStatusDisplay();
  }
  // Create energy monitor
  createEnergyMonitor() {
    const energyDisplay = import_ecs23.engine.addEntity();
    import_ecs23.Transform.create(energyDisplay, {
      parent: this.controlPanel,
      position: import_math21.Vector3.create(0, -0.8, 0.1),
      scale: import_math21.Vector3.create(0.8, 0.2, 0.1)
    });
    import_ecs23.MeshRenderer.setBox(energyDisplay);
    import_ecs23.Material.setPbrMaterial(energyDisplay, {
      albedoColor: import_math21.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math21.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    this.updateEnergyDisplay();
  }
  // Start automation engine
  startAutomationEngine() {
    import_ecs23.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateDeviceValues();
      this.checkAutomationRules();
      this.updateDisplays();
    });
  }
  // Update device values
  updateDeviceValues() {
    this.devices.forEach((device) => {
      switch (device.type) {
        case "temperature":
          device.value = 20 + Math.sin(Date.now() / 1e4) * 3;
          break;
        case "energy":
          device.value = Math.random() * 100;
          break;
        case "security":
          device.value = Math.random() > 0.95 ? "alert" : "normal";
          break;
      }
      device.lastUpdate = Date.now();
    });
    this.energyUsage = Array.from(this.devices.values()).filter((d) => d.type === "energy").reduce((sum, d) => sum + d.value, 0);
  }
  // Check automation rules
  checkAutomationRules() {
    this.automationRules.forEach((rule) => {
      if (!rule.enabled) return;
      if (this.evaluateTrigger(rule.trigger)) {
        this.executeActions(rule.actions);
      }
    });
  }
  // Evaluate trigger conditions
  evaluateTrigger(trigger) {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    switch (trigger.type) {
      case "time":
        return trigger.conditions.some((condition) => {
          if (condition.property === "hour") {
            switch (condition.operator) {
              case "equals":
                return hour === condition.value;
              case "greater":
                return hour > condition.value;
              case "less":
                return hour < condition.value;
              default:
                return false;
            }
          }
          return false;
        });
      case "device":
        return trigger.conditions.every((condition) => {
          const device = this.devices.get(condition.deviceId);
          if (!device) return false;
          switch (condition.operator) {
            case "equals":
              return device.value === condition.value;
            case "greater":
              return device.value > condition.value;
            case "less":
              return device.value < condition.value;
            default:
              return false;
          }
        });
      default:
        return false;
    }
  }
  // Execute automation actions
  executeActions(actions) {
    actions.forEach((action) => {
      switch (action.type) {
        case "setDevice":
          this.setDeviceValue(action.target, action.parameters);
          break;
        case "notify":
          console.log(`\u{1F514} Notification: ${action.parameters.message}`);
          soundSystem.playInteractionSound("alert");
          break;
        case "scene":
          this.activateScene(action.target);
          break;
      }
    });
  }
  // Set device value
  setDeviceValue(deviceId, parameters) {
    const device = this.devices.get(deviceId);
    if (device) {
      device.value = parameters.value || parameters;
      device.lastUpdate = Date.now();
      console.log(`\u{1F527} Set ${device.name} to: ${device.value}`);
    }
  }
  // Handle device interaction
  handleDeviceInteraction(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device) return;
    console.log(`\u{1F527} Interacting with ${device.name}`);
    soundSystem.playInteractionSound("click");
    if (typeof device.value === "boolean") {
      device.value = !device.value;
    } else if (device.type === "light") {
      device.value = !device.value;
    }
    this.updateDeviceVisual(deviceId);
  }
  // Update device visual
  updateDeviceVisual(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device) return;
    let deviceEntity = null;
    for (const [entity] of import_ecs23.engine.getEntitiesWith(import_ecs23.Transform)) {
      const transform = import_ecs23.Transform.get(entity);
      if (import_math21.Vector3.distance(transform.position, device.position) < 0.1) {
        deviceEntity = entity;
        break;
      }
    }
    if (deviceEntity) {
      import_ecs23.Material.setPbrMaterial(deviceEntity, {
        emissiveIntensity: device.value === true ? 3 : 1
      });
    }
  }
  // Activate scene
  activateScene(sceneId) {
    const scene = this.smartScenes.get(sceneId);
    if (!scene) return;
    console.log(`\u{1F3AC} Activating scene: ${scene.name}`);
    soundSystem.playInteractionSound("powerup");
    this.currentScene = sceneId;
    scene.settings.forEach((settings, deviceId) => {
      this.setDeviceValue(deviceId, settings);
    });
  }
  // Update displays
  updateDisplays() {
    this.updateDeviceStatusDisplay();
    this.updateEnergyDisplay();
  }
  // Update device status display
  updateDeviceStatusDisplay() {
    const onlineDevices = Array.from(this.devices.values()).filter(
      (d) => d.status === "online"
    ).length;
    const totalDevices = this.devices.size;
    console.log(`\u{1F4CA} Device Status: ${onlineDevices}/${totalDevices} online`);
  }
  // Update energy display
  updateEnergyDisplay() {
    console.log(`\u26A1 Energy Usage: ${this.energyUsage.toFixed(1)}%`);
  }
  // Get current scene
  getCurrentScene() {
    return this.currentScene;
  }
  // Get all devices
  getDevices() {
    return Array.from(this.devices.values());
  }
  // Get device by ID
  getDevice(deviceId) {
    return this.devices.get(deviceId);
  }
  // Add new device
  addDevice(device) {
    this.devices.set(device.id, device);
    console.log(`\u{1F4F1} Added device: ${device.name}`);
  }
  // Remove device
  removeDevice(deviceId) {
    const device = this.devices.get(deviceId);
    if (device) {
      this.devices.delete(deviceId);
      console.log(`\u{1F5D1}\uFE0F Removed device: ${device.name}`);
    }
  }
  // Get energy usage
  getEnergyUsage() {
    return this.energyUsage;
  }
  // Cleanup system
  cleanup() {
    this.devices.clear();
    this.automationRules.clear();
    this.smartScenes.clear();
    if (this.controlPanel) {
      import_ecs23.engine.removeEntity(this.controlPanel);
    }
    this.isInitialized = false;
  }
};
var smartRoomSystem = new SmartRoomSystem();

// src/voice-command-system.ts
var import_ecs24 = require("@dcl/sdk/ecs");
var import_math22 = require("@dcl/sdk/math");
var VoiceCommandSystem = class {
  constructor() {
    this.commands = /* @__PURE__ */ new Map();
    this.intents = /* @__PURE__ */ new Map();
    this.commandHistory = [];
    this.isInitialized = false;
    this.isListening = false;
    this.currentTranscript = "";
    this.voiceAssistant = {
      id: "assistant_nexus",
      name: "Nexus",
      personality: "professional",
      voice: "female",
      language: "es-ES",
      isActive: true,
      processingState: "idle"
    };
  }
  // Initialize voice command system
  initialize() {
    console.log("\u{1F3A4} Voice Command System Initializing...");
    this.setupIntents();
    this.createVoiceUI();
    this.initializeSpeechRecognition();
    this.initializeAIProcessor();
    this.initializeVoiceSynthesis();
    this.startVoiceEngine();
    this.isInitialized = true;
    console.log("\u{1F3A4} Voice Command System Ready!");
  }
  // Setup voice intents
  setupIntents() {
    this.intents.set("toggle_lights", {
      name: "toggle_lights",
      parameters: /* @__PURE__ */ new Map([
        ["location", "string"],
        ["action", "string"]
      ]),
      action: "control_lighting"
    });
    this.intents.set("adjust_temperature", {
      name: "adjust_temperature",
      parameters: /* @__PURE__ */ new Map([
        ["temperature", "number"],
        ["unit", "string"]
      ]),
      action: "control_climate"
    });
    this.intents.set("start_meeting", {
      name: "start_meeting",
      parameters: /* @__PURE__ */ new Map([
        ["participants", "array"],
        ["topic", "string"]
      ]),
      action: "initiate_meeting"
    });
    this.intents.set("navigate_to", {
      name: "navigate_to",
      parameters: /* @__PURE__ */ new Map([
        ["destination", "string"],
        ["mode", "string"]
      ]),
      action: "navigate"
    });
    this.intents.set("show_dashboard", {
      name: "show_dashboard",
      parameters: /* @__PURE__ */ new Map([
        ["type", "string"],
        ["data", "string"]
      ]),
      action: "display_dashboard"
    });
    this.intents.set("send_message", {
      name: "send_message",
      parameters: /* @__PURE__ */ new Map([
        ["recipient", "string"],
        ["message", "string"]
      ]),
      action: "communicate"
    });
    this.intents.set("schedule_event", {
      name: "schedule_event",
      parameters: /* @__PURE__ */ new Map([
        ["title", "string"],
        ["time", "string"],
        ["duration", "string"]
      ]),
      action: "create_calendar_event"
    });
    this.intents.set("get_status", {
      name: "get_status",
      parameters: /* @__PURE__ */ new Map([
        ["system", "string"],
        ["metric", "string"]
      ]),
      action: "query_status"
    });
    this.intents.set("analyze_data", {
      name: "analyze_data",
      parameters: /* @__PURE__ */ new Map([
        ["dataset", "string"],
        ["analysis_type", "string"]
      ]),
      action: "perform_analysis"
    });
    this.intents.set("lock_system", {
      name: "lock_system",
      parameters: /* @__PURE__ */ new Map([
        ["level", "string"],
        ["duration", "string"]
      ]),
      action: "secure_system"
    });
    this.intents.set("emergency_stop", {
      name: "emergency_stop",
      parameters: /* @__PURE__ */ new Map([
        ["system", "string"],
        ["reason", "string"]
      ]),
      action: "emergency_shutdown"
    });
  }
  // Create voice UI
  createVoiceUI() {
    this.voiceUI = import_ecs24.engine.addEntity();
    import_ecs24.Transform.create(this.voiceUI, {
      position: import_math22.Vector3.create(8, 4, 14),
      scale: import_math22.Vector3.create(3, 2, 0.1)
    });
    import_ecs24.MeshRenderer.setBox(this.voiceUI);
    import_ecs24.Material.setPbrMaterial(this.voiceUI, {
      albedoColor: import_math22.Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: import_math22.Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    });
    const title = import_ecs24.engine.addEntity();
    import_ecs24.Transform.create(title, {
      parent: this.voiceUI,
      position: import_math22.Vector3.create(0, 0.7, 0.1),
      scale: import_math22.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs24.TextShape.create(title, {
      text: "\u{1F49C} ASISTENTE DE VOZ (NEXUS)",
      textColor: import_math22.Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    });
    this.createStatusIndicator();
    this.createTranscriptDisplay();
    this.createVoiceControls();
  }
  // Create status indicator
  createStatusIndicator() {
    const statusIndicator = import_ecs24.engine.addEntity();
    import_ecs24.Transform.create(statusIndicator, {
      parent: this.voiceUI,
      position: import_math22.Vector3.create(0, 0.3, 0.1),
      scale: import_math22.Vector3.create(0.2, 0.2, 0.1)
    });
    import_ecs24.MeshRenderer.setBox(statusIndicator);
    import_ecs24.Material.setPbrMaterial(statusIndicator, {
      albedoColor: import_math22.Color4.create(0.2, 0.8, 0.2, 1),
      emissiveColor: import_math22.Color4.create(0.2, 0.8, 0.2, 0.8),
      emissiveIntensity: 2
    });
    this.animateStatusIndicator(statusIndicator);
  }
  // Animate status indicator
  animateStatusIndicator(indicator) {
    import_ecs24.engine.addSystem(() => {
      if (!this.isInitialized) return;
      const time = Date.now() / 1e3;
      if (indicator) {
        switch (this.voiceAssistant.processingState) {
          case "idle":
            import_ecs24.Material.setPbrMaterial(indicator, {
              albedoColor: import_math22.Color4.create(0.2, 0.8, 0.2, 1),
              emissiveIntensity: 1,
              emissiveColor: import_math22.Color4.create(0.2, 0.8, 0.2, 1)
            });
            break;
          case "listening":
            const pulse = Math.sin(time * 3) * 0.5 + 0.5;
            import_ecs24.Material.setPbrMaterial(indicator, {
              albedoColor: import_math22.Color4.create(1, 0.8, 0.2, 1),
              emissiveIntensity: 2 + pulse * 2,
              emissiveColor: import_math22.Color4.create(1, 0.8, 0.2, 1)
            });
            break;
          case "processing":
            import_ecs24.Material.setPbrMaterial(indicator, {
              albedoColor: import_math22.Color4.create(0.2, 0.2, 1, 1),
              emissiveIntensity: 3,
              emissiveColor: import_math22.Color4.create(0.2, 0.2, 1, 1)
            });
            break;
          case "responding":
            import_ecs24.Material.setPbrMaterial(indicator, {
              albedoColor: import_math22.Color4.create(0.8, 0.2, 0.8, 1),
              emissiveIntensity: 2,
              emissiveColor: import_math22.Color4.create(0.8, 0.2, 0.8, 1)
            });
            break;
        }
      }
    });
  }
  // Create transcript display
  createTranscriptDisplay() {
    const transcriptDisplay = import_ecs24.engine.addEntity();
    import_ecs24.Transform.create(transcriptDisplay, {
      parent: this.voiceUI,
      position: import_math22.Vector3.create(0, -0.1, 0.1),
      scale: import_math22.Vector3.create(0.8, 0.3, 0.1)
    });
    import_ecs24.MeshRenderer.setBox(transcriptDisplay);
    import_ecs24.Material.setPbrMaterial(transcriptDisplay, {
      albedoColor: import_math22.Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: import_math22.Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    });
    const transcriptText = import_ecs24.engine.addEntity();
    import_ecs24.Transform.create(transcriptText, {
      parent: transcriptDisplay,
      position: import_math22.Vector3.create(0, 0, 0.1),
      scale: import_math22.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs24.TextShape.create(transcriptText, {
      text: 'Di "Hola Nexus" para comenzar...',
      textColor: import_math22.Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    });
  }
  // Create voice controls
  createVoiceControls() {
    const controls = [
      { id: "listen", icon: "\u{1F3A4}", name: "Escuchar" },
      { id: "stop", icon: "\u23F9\uFE0F", name: "Detener" },
      { id: "settings", icon: "\u2699\uFE0F", name: "Ajustes de Voz" }
    ];
    let xOffset = -0.8;
    controls.forEach((control) => {
      const button = import_ecs24.engine.addEntity();
      import_ecs24.Transform.create(button, {
        parent: this.voiceUI,
        position: import_math22.Vector3.create(xOffset, -0.6, 0.1),
        scale: import_math22.Vector3.create(0.3, 0.3, 0.1)
      });
      import_ecs24.MeshRenderer.setBox(button);
      import_ecs24.Material.setPbrMaterial(button, {
        albedoColor: import_math22.Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: import_math22.Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      });
      const buttonText = import_ecs24.engine.addEntity();
      import_ecs24.Transform.create(buttonText, {
        parent: button,
        position: import_math22.Vector3.create(0, 0, 0.1),
        scale: import_math22.Vector3.create(0.5, 0.5, 0.5)
      });
      import_ecs24.TextShape.create(buttonText, {
        text: control.icon,
        textColor: import_math22.Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      });
      import_ecs24.pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: import_ecs24.InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleVoiceControl(control.id)
      );
      xOffset += 0.8;
    });
  }
  // Initialize speech recognition
  initializeSpeechRecognition() {
    this.recognitionEngine = {
      isListening: false,
      continuous: true,
      interimResults: true,
      lang: "es-ES",
      start: () => {
        this.recognitionEngine.isListening = true;
        this.voiceAssistant.processingState = "listening";
        console.log("\u{1F3A4} Speech recognition started");
      },
      stop: () => {
        this.recognitionEngine.isListening = false;
        this.voiceAssistant.processingState = "idle";
        console.log("\u{1F3A4} Speech recognition stopped");
      },
      onresult: null,
      onerror: null,
      onend: null
    };
    this.recognitionEngine.onresult = (event) => this.handleSpeechResult(event);
    this.recognitionEngine.onerror = (event) => this.handleSpeechError(event);
    this.recognitionEngine.onend = () => this.handleSpeechEnd();
  }
  // Initialize AI processor
  initializeAIProcessor() {
    this.aiProcessor = {
      processIntent: (transcript) => this.processIntentWithAI(transcript),
      generateResponse: (intent, entities) => this.generateAIResponse(intent, entities),
      confidence: 0.85
    };
  }
  // Initialize voice synthesis
  initializeVoiceSynthesis() {
    this.voiceSynthesizer = {
      speak: (text) => this.synthesizeSpeech(text),
      cancel: () => this.stopSpeech(),
      voice: this.voiceAssistant.voice,
      rate: 1,
      pitch: 1,
      volume: 1
    };
  }
  // Start voice engine
  startVoiceEngine() {
    import_ecs24.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateVoiceUI();
      this.simulateVoiceInput();
    });
  }
  // Handle voice control
  handleVoiceControl(controlId) {
    switch (controlId) {
      case "listen":
        this.startListening();
        break;
      case "stop":
        this.stopListening();
        break;
      case "settings":
        this.openVoiceSettings();
        break;
    }
    soundSystem.playInteractionSound("click");
  }
  // Start listening
  startListening() {
    if (this.recognitionEngine.isListening) return;
    this.recognitionEngine.start();
    this.isListening = true;
    this.voiceAssistant.processingState = "listening";
    console.log("\u{1F3A4} Started listening for voice commands...");
    soundSystem.playInteractionSound("powerup");
  }
  // Stop listening
  stopListening() {
    if (!this.recognitionEngine.isListening) return;
    this.recognitionEngine.stop();
    this.isListening = false;
    this.voiceAssistant.processingState = "idle";
    console.log("\u{1F3A4} Stopped listening");
    soundSystem.playInteractionSound("click");
  }
  // Handle speech result
  handleSpeechResult(event) {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript.toLowerCase().trim();
    this.currentTranscript = transcript;
    if (result.isFinal) {
      this.processVoiceCommand(transcript);
    }
  }
  // Handle speech error
  handleSpeechError(event) {
    console.error("\u{1F3A4} Speech recognition error:", event.error);
    this.voiceAssistant.processingState = "idle";
    this.isListening = false;
  }
  // Handle speech end
  handleSpeechEnd() {
    this.voiceAssistant.processingState = "idle";
    this.isListening = false;
  }
  // Process voice command
  processVoiceCommand(transcript) {
    console.log(`\u{1F3A4} Processing command: "${transcript}"`);
    this.voiceAssistant.processingState = "processing";
    const intentResult = this.aiProcessor.processIntent(transcript);
    if (intentResult.confidence > 0.7) {
      this.executeVoiceCommand(intentResult.intent, intentResult.entities);
    } else {
      this.handleUnknownCommand(transcript);
    }
  }
  // Process intent with AI
  processIntentWithAI(transcript) {
    const intents = [
      {
        keywords: ["turn on", "switch on", "activate"],
        intent: "toggle_lights",
        entities: /* @__PURE__ */ new Map([["action", "on"]])
      },
      {
        keywords: ["turn off", "switch off", "deactivate"],
        intent: "toggle_lights",
        entities: /* @__PURE__ */ new Map([["action", "off"]])
      },
      {
        keywords: ["temperature", "set temp", "adjust temp"],
        intent: "adjust_temperature",
        entities: /* @__PURE__ */ new Map([["temperature", 22]])
      },
      {
        keywords: ["meeting", "start meeting", "schedule meeting"],
        intent: "start_meeting",
        entities: /* @__PURE__ */ new Map()
      },
      { keywords: ["navigate", "go to", "take me to"], intent: "navigate_to", entities: /* @__PURE__ */ new Map() },
      {
        keywords: ["dashboard", "show dashboard", "display"],
        intent: "show_dashboard",
        entities: /* @__PURE__ */ new Map()
      },
      {
        keywords: ["status", "check status", "system status"],
        intent: "get_status",
        entities: /* @__PURE__ */ new Map()
      },
      { keywords: ["lock", "secure", "lock down"], intent: "lock_system", entities: /* @__PURE__ */ new Map() },
      {
        keywords: ["emergency", "stop", "emergency stop"],
        intent: "emergency_stop",
        entities: /* @__PURE__ */ new Map()
      }
    ];
    for (const intentData of intents) {
      for (const keyword of intentData.keywords) {
        if (transcript.includes(keyword)) {
          return {
            intent: intentData.intent,
            entities: intentData.entities,
            confidence: 0.9
          };
        }
      }
    }
    return {
      intent: "unknown",
      entities: /* @__PURE__ */ new Map(),
      confidence: 0.1
    };
  }
  // Execute voice command
  executeVoiceCommand(intent, entities) {
    console.log(`\u{1F3AF} Executing intent: ${intent}`);
    const command = {
      id: `cmd_${Date.now()}`,
      phrase: this.currentTranscript,
      intent,
      entities,
      confidence: 0.9,
      timestamp: Date.now(),
      isProcessed: false
    };
    this.commands.set(command.id, command);
    this.commandHistory.push(command);
    switch (intent) {
      case "toggle_lights":
        this.executeLightControl(entities);
        break;
      case "adjust_temperature":
        this.executeTemperatureControl(entities);
        break;
      case "start_meeting":
        this.executeMeetingStart(entities);
        break;
      case "navigate_to":
        this.executeNavigation(entities);
        break;
      case "show_dashboard":
        this.executeDashboardDisplay(entities);
        break;
      case "get_status":
        this.executeStatusQuery(entities);
        break;
      case "lock_system":
        this.executeSystemLock(entities);
        break;
      case "emergency_stop":
        this.executeEmergencyStop(entities);
        break;
    }
    command.isProcessed = true;
    this.voiceAssistant.processingState = "responding";
    const response = this.aiProcessor.generateResponse(intent, entities);
    this.speakResponse(response.text);
    setTimeout(() => {
      this.voiceAssistant.processingState = "idle";
    }, 2e3);
  }
  // Execute light control
  executeLightControl(entities) {
    const action = entities.get("action");
    console.log(`\u{1F4A1} ${action === "on" ? "Turning on" : "Turning off"} lights`);
    soundSystem.playInteractionSound("powerup");
  }
  // Execute temperature control
  executeTemperatureControl(entities) {
    const temperature = entities.get("temperature");
    console.log(`\u{1F321}\uFE0F Setting temperature to ${temperature}\xB0C`);
    soundSystem.playInteractionSound("click");
  }
  // Execute meeting start
  executeMeetingStart(entities) {
    console.log("\u{1F91D} Starting meeting session");
    soundSystem.playInteractionSound("powerup");
  }
  // Execute navigation
  executeNavigation(entities) {
    console.log("\u{1F9ED} Navigating to destination");
    soundSystem.playInteractionSound("click");
  }
  // Execute dashboard display
  executeDashboardDisplay(entities) {
    console.log("\u{1F4CA} Displaying dashboard");
    soundSystem.playInteractionSound("powerup");
  }
  // Execute status query
  executeStatusQuery(entities) {
    console.log("\u{1F4C8} Querying system status");
    soundSystem.playInteractionSound("click");
  }
  // Execute system lock
  executeSystemLock(entities) {
    console.log("\u{1F512} Locking system");
    soundSystem.playInteractionSound("alert");
  }
  // Execute emergency stop
  executeEmergencyStop(entities) {
    console.log("\u{1F6A8} EMERGENCY STOP ACTIVATED");
    soundSystem.playInteractionSound("error");
  }
  // Handle unknown command
  handleUnknownCommand(transcript) {
    console.log(`\u2753 Unknown command: "${transcript}"`);
    const response = this.aiProcessor.generateResponse("unknown", /* @__PURE__ */ new Map());
    this.speakResponse(response.text);
    this.voiceAssistant.processingState = "idle";
  }
  // Generate AI response
  generateAIResponse(intent, entities) {
    const responses = {
      toggle_lights: {
        text: "I've adjusted the lighting for you.",
        confidence: 0.9,
        actions: ["light_control"],
        emotion: "helpful"
      },
      adjust_temperature: {
        text: "Temperature settings updated successfully.",
        confidence: 0.9,
        actions: ["climate_control"],
        emotion: "efficient"
      },
      start_meeting: {
        text: "I'm setting up your meeting room now.",
        confidence: 0.9,
        actions: ["meeting_setup"],
        emotion: "professional"
      },
      navigate_to: {
        text: "Taking you to your destination.",
        confidence: 0.9,
        actions: ["navigation"],
        emotion: "helpful"
      },
      show_dashboard: {
        text: "Displaying the dashboard you requested.",
        confidence: 0.9,
        actions: ["dashboard_display"],
        emotion: "informative"
      },
      get_status: {
        text: "All systems are operating normally.",
        confidence: 0.9,
        actions: ["status_report"],
        emotion: "confident"
      },
      lock_system: {
        text: "System security protocols activated.",
        confidence: 0.9,
        actions: ["security_lock"],
        emotion: "serious"
      },
      emergency_stop: {
        text: "Procedimientos de emergencia iniciados inmediatamente.",
        confidence: 1,
        actions: ["emergency_shutdown"],
        emotion: "urgent"
      },
      unknown: {
        text: "No estoy segura de entenderte. \xBFPodr\xEDas repetirlo?",
        confidence: 0.3,
        actions: [],
        emotion: "confused"
      }
    };
    return responses[intent] || responses.unknown;
  }
  // Synthesize speech
  synthesizeSpeech(text) {
    console.log(`\u{1F50A} Speaking: "${text}"`);
    this.voiceAssistant.processingState = "responding";
    setTimeout(() => {
      this.voiceAssistant.processingState = "idle";
    }, 2e3);
  }
  // Stop speech
  stopSpeech() {
    console.log("\u{1F50A} Speech stopped");
    this.voiceAssistant.processingState = "idle";
  }
  // Speak response
  speakResponse(text) {
    this.voiceSynthesizer.speak(text);
  }
  // Update voice UI
  updateVoiceUI() {
  }
  // Simulate voice input
  simulateVoiceInput() {
    if (Math.random() < 5e-3) {
      const sampleCommands = [
        "turn on the lights",
        "set temperature to 22 degrees",
        "show me the dashboard",
        "what's the system status",
        "start a meeting"
      ];
      const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
      this.processVoiceCommand(randomCommand);
    }
  }
  // Open voice settings
  openVoiceSettings() {
    console.log("\u2699\uFE0F Opening voice settings");
    soundSystem.playInteractionSound("click");
  }
  // Get command history
  getCommandHistory() {
    return [...this.commandHistory];
  }
  // Get voice assistant info
  getVoiceAssistant() {
    return { ...this.voiceAssistant };
  }
  // Set voice assistant personality
  setPersonality(personality) {
    this.voiceAssistant.personality = personality;
    console.log(`\u{1F3A4} Voice personality set to: ${personality}`);
  }
  // Set voice language
  setLanguage(language) {
    this.voiceAssistant.language = language;
    this.recognitionEngine.lang = language;
    console.log(`\u{1F3A4} Voice language set to: ${language}`);
  }
  // Enable/disable voice assistant
  setVoiceAssistantEnabled(enabled) {
    this.voiceAssistant.isActive = enabled;
    if (!enabled) {
      this.stopListening();
    }
    console.log(`\u{1F3A4} Voice assistant ${enabled ? "enabled" : "disabled"}`);
  }
  // Cleanup system
  cleanup() {
    this.stopListening();
    this.commands.clear();
    this.intents.clear();
    this.commandHistory = [];
    if (this.voiceUI) {
      import_ecs24.engine.removeEntity(this.voiceUI);
    }
    this.isInitialized = false;
  }
};
var voiceCommandSystem = new VoiceCommandSystem();

// src/weather-system.ts
var import_ecs25 = require("@dcl/sdk/ecs");
var import_math23 = require("@dcl/sdk/math");
var WeatherSystem = class {
  // 1 real second = 1 game minute
  constructor() {
    this.celestialBodies = /* @__PURE__ */ new Map();
    this.weatherEffects = [];
    this.isInitialized = false;
    this.timeScale = 60;
    this.currentState = {
      type: "clear",
      intensity: 0.3,
      temperature: 22,
      humidity: 45,
      windSpeed: 5,
      windDirection: import_math23.Vector3.create(1, 0, 0)
    };
    this.currentTime = {
      hour: 12,
      minute: 0,
      dayProgress: 0.5
    };
  }
  // Initialize weather system
  initialize() {
    console.log("Weather System Initializing...");
    this.createSkyDome();
    this.createCelestialBodies();
    this.createWeatherEffects();
    this.startWeatherSimulation();
    this.startDayNightCycle();
    this.isInitialized = true;
    console.log("Weather System Ready!");
  }
  // Create sky dome
  createSkyDome() {
    this.skyDome = import_ecs25.engine.addEntity();
    import_ecs25.Transform.create(this.skyDome, {
      position: import_math23.Vector3.create(8, 50, 8),
      scale: import_math23.Vector3.create(100, 100, 100)
    });
    import_ecs25.MeshRenderer.setSphere(this.skyDome);
    this.updateSkyColor();
  }
  // Create sun and moon
  createCelestialBodies() {
    const sun = import_ecs25.engine.addEntity();
    import_ecs25.Transform.create(sun, {
      position: import_math23.Vector3.create(8, 30, 8),
      scale: import_math23.Vector3.create(3, 3, 3)
    });
    import_ecs25.MeshRenderer.setSphere(sun);
    import_ecs25.Material.setPbrMaterial(sun, {
      albedoColor: import_math23.Color4.create(1, 0.95, 0.8, 1),
      emissiveColor: import_math23.Color4.create(1, 0.9, 0.6, 1),
      emissiveIntensity: 5
    });
    this.celestialBodies.set("sun", {
      entity: sun,
      type: "sun",
      basePosition: import_math23.Vector3.create(8, 30, 8),
      orbitRadius: 40,
      orbitSpeed: 0.1,
      currentAngle: 0
    });
    const moon = import_ecs25.engine.addEntity();
    import_ecs25.Transform.create(moon, {
      position: import_math23.Vector3.create(8, 30, 8),
      scale: import_math23.Vector3.create(2, 2, 2)
    });
    import_ecs25.MeshRenderer.setSphere(moon);
    import_ecs25.Material.setPbrMaterial(moon, {
      albedoColor: import_math23.Color4.create(0.9, 0.9, 1, 1),
      emissiveColor: import_math23.Color4.create(0.6, 0.6, 0.8, 0.8),
      emissiveIntensity: 2
    });
    this.celestialBodies.set("moon", {
      entity: moon,
      type: "moon",
      basePosition: import_math23.Vector3.create(8, 30, 8),
      orbitRadius: 40,
      orbitSpeed: 0.1,
      currentAngle: 180
    });
  }
  // Create weather effects
  createWeatherEffects() {
    this.createRainEffect();
    this.createCloudSystem();
    this.createFogEffect();
    this.createSnowEffect();
  }
  // Create rain effect
  createRainEffect() {
    for (let i = 0; i < 100; i++) {
      const rainDrop = import_ecs25.engine.addEntity();
      import_ecs25.Transform.create(rainDrop, {
        position: import_math23.Vector3.create(Math.random() * 16, Math.random() * 20 + 10, Math.random() * 16),
        scale: import_math23.Vector3.create(0.02, 0.2, 0.02)
      });
      import_ecs25.MeshRenderer.setBox(rainDrop);
      import_ecs25.Material.setPbrMaterial(rainDrop, {
        albedoColor: import_math23.Color4.create(0.6, 0.7, 0.9, 0.7),
        emissiveColor: import_math23.Color4.create(0.4, 0.5, 0.8, 0.5),
        emissiveIntensity: 1
      });
      this.weatherEffects.push({
        entity: rainDrop,
        type: "rain",
        velocity: import_math23.Vector3.create(0, -8, 0)
      });
    }
  }
  // Create cloud system
  createCloudSystem() {
    for (let i = 0; i < 20; i++) {
      const cloud = import_ecs25.engine.addEntity();
      import_ecs25.Transform.create(cloud, {
        position: import_math23.Vector3.create(Math.random() * 16, Math.random() * 10 + 15, Math.random() * 16),
        scale: import_math23.Vector3.create(
          Math.random() * 3 + 2,
          Math.random() * 1 + 0.5,
          Math.random() * 3 + 2
        )
      });
      import_ecs25.MeshRenderer.setBox(cloud);
      import_ecs25.Material.setPbrMaterial(cloud, {
        albedoColor: import_math23.Color4.create(0.9, 0.9, 0.9, 0.8),
        roughness: 0.8,
        metallic: 0.1
      });
      this.weatherEffects.push({
        entity: cloud,
        type: "cloud",
        velocity: import_math23.Vector3.create((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5)
      });
    }
  }
  // Create fog effect
  createFogEffect() {
    const fogVolume = import_ecs25.engine.addEntity();
    import_ecs25.Transform.create(fogVolume, {
      position: import_math23.Vector3.create(8, 2, 8),
      scale: import_math23.Vector3.create(20, 4, 20)
    });
    import_ecs25.MeshRenderer.setBox(fogVolume);
    import_ecs25.Material.setPbrMaterial(fogVolume, {
      albedoColor: import_math23.Color4.create(0.8, 0.8, 0.85, 0.3),
      emissiveColor: import_math23.Color4.create(0.7, 0.7, 0.75, 0.2),
      emissiveIntensity: 0.5
    });
    this.weatherEffects.push({
      entity: fogVolume,
      type: "fog",
      velocity: import_math23.Vector3.create(0, 0, 0)
    });
  }
  // Create snow effect
  createSnowEffect() {
    for (let i = 0; i < 50; i++) {
      const snowFlake = import_ecs25.engine.addEntity();
      import_ecs25.Transform.create(snowFlake, {
        position: import_math23.Vector3.create(Math.random() * 16, Math.random() * 20 + 10, Math.random() * 16),
        scale: import_math23.Vector3.create(0.1, 0.1, 0.1)
      });
      import_ecs25.MeshRenderer.setSphere(snowFlake);
      import_ecs25.Material.setPbrMaterial(snowFlake, {
        albedoColor: import_math23.Color4.create(1, 1, 1, 0.9),
        emissiveColor: import_math23.Color4.create(0.8, 0.8, 1, 0.6),
        emissiveIntensity: 1
      });
      this.weatherEffects.push({
        entity: snowFlake,
        type: "snow",
        velocity: import_math23.Vector3.create((Math.random() - 0.5) * 0.5, -1, (Math.random() - 0.5) * 0.5)
      });
    }
  }
  // Start weather simulation
  startWeatherSimulation() {
    import_ecs25.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateWeatherEffects();
      this.simulateWeatherChanges();
    });
  }
  // Start day/night cycle
  startDayNightCycle() {
    import_ecs25.engine.addSystem(() => {
      if (!this.isInitialized) return;
      this.updateTimeOfDay();
      this.updateCelestialBodies();
      this.updateSkyColor();
    });
  }
  // Update time of day
  updateTimeOfDay() {
    this.currentTime.minute += 1 / 60;
    if (this.currentTime.minute >= 60) {
      this.currentTime.minute = 0;
      this.currentTime.hour++;
      if (this.currentTime.hour >= 24) {
        this.currentTime.hour = 0;
      }
    }
    this.currentTime.dayProgress = (this.currentTime.hour * 60 + this.currentTime.minute) / 1440;
  }
  // Update celestial bodies positions
  updateCelestialBodies() {
    this.celestialBodies.forEach((body) => {
      const angle = (this.currentTime.dayProgress * 360 - 90) * Math.PI / 180;
      const x = body.basePosition.x + Math.cos(angle) * body.orbitRadius;
      const y = body.basePosition.y + Math.sin(angle) * body.orbitRadius;
      const z = body.basePosition.z;
      const transform = import_ecs25.Transform.getMutable(body.entity);
      transform.position = import_math23.Vector3.create(x, y, z);
      const isVisible = y > body.basePosition.y;
      transform.scale = isVisible ? import_math23.Vector3.create(
        body.type === "sun" ? 3 : 2,
        body.type === "sun" ? 3 : 2,
        body.type === "sun" ? 3 : 2
      ) : import_math23.Vector3.create(0, 0, 0);
    });
  }
  // Update sky color based on time and weather
  updateSkyColor() {
    let skyColor;
    const hour = this.currentTime.hour;
    if (hour >= 6 && hour < 12) {
      const progress = (hour - 6) / 6;
      skyColor = import_math23.Color4.lerp(
        import_math23.Color4.create(0.8, 0.6, 0.4, 1),
        // Dawn
        import_math23.Color4.create(0.5, 0.7, 1, 1),
        // Day
        progress
      );
    } else if (hour >= 12 && hour < 18) {
      skyColor = import_math23.Color4.create(0.5, 0.7, 1, 1);
    } else if (hour >= 18 && hour < 21) {
      const progress = (hour - 18) / 3;
      skyColor = import_math23.Color4.lerp(
        import_math23.Color4.create(0.5, 0.7, 1, 1),
        // Day
        import_math23.Color4.create(0.2, 0.3, 0.6, 1),
        // Dusk
        progress
      );
    } else {
      skyColor = import_math23.Color4.create(0.05, 0.05, 0.2, 1);
    }
    skyColor = this.applyWeatherToSkyColor(skyColor);
    if (this.skyDome) {
      import_ecs25.Material.setPbrMaterial(this.skyDome, {
        albedoColor: skyColor,
        emissiveColor: import_math23.Color4.create(skyColor.r * 0.3, skyColor.g * 0.3, skyColor.b * 0.3, 1),
        emissiveIntensity: 1
      });
    }
  }
  // Apply weather effects to sky color
  applyWeatherToSkyColor(baseColor) {
    switch (this.currentState.type) {
      case "cloudy":
        return import_math23.Color4.lerp(
          baseColor,
          import_math23.Color4.create(0.6, 0.6, 0.6, 1),
          this.currentState.intensity * 0.7
        );
      case "rainy":
      case "stormy":
        return import_math23.Color4.lerp(
          baseColor,
          import_math23.Color4.create(0.3, 0.3, 0.4, 1),
          this.currentState.intensity * 0.8
        );
      case "foggy":
        return import_math23.Color4.lerp(
          baseColor,
          import_math23.Color4.create(0.7, 0.7, 0.75, 1),
          this.currentState.intensity * 0.6
        );
      default:
        return baseColor;
    }
  }
  // Update weather effects
  updateWeatherEffects() {
    this.weatherEffects.forEach((effect) => {
      const transform = import_ecs25.Transform.getMutable(effect.entity);
      transform.position = import_math23.Vector3.add(transform.position, import_math23.Vector3.scale(effect.velocity, 0.016));
      if (effect.type === "rain" || effect.type === "snow") {
        if (transform.position.y < 0) {
          transform.position.y = 30;
          transform.position.x = Math.random() * 16;
          transform.position.z = Math.random() * 16;
        }
      } else if (effect.type === "cloud") {
        if (transform.position.x > 20) transform.position.x = -4;
        if (transform.position.x < -4) transform.position.x = 20;
        if (transform.position.z > 20) transform.position.z = -4;
        if (transform.position.z < -4) transform.position.z = 20;
      }
      const shouldBeVisible = this.isEffectVisible(effect.type);
      transform.scale = shouldBeVisible ? import_math23.Vector3.create(1, 1, 1) : import_math23.Vector3.create(0, 0, 0);
    });
  }
  // Check if effect should be visible
  isEffectVisible(effectType) {
    switch (effectType) {
      case "rain":
        return this.currentState.type === "rainy" || this.currentState.type === "stormy";
      case "cloud":
        return this.currentState.type === "cloudy" || this.currentState.type === "rainy" || this.currentState.type === "stormy";
      case "fog":
        return this.currentState.type === "foggy";
      case "snow":
        return this.currentState.type === "snowy";
      default:
        return false;
    }
  }
  // Simulate weather changes
  simulateWeatherChanges() {
    if (Math.random() > 0.9995) {
      this.changeWeather();
    }
  }
  // Change weather
  changeWeather(newWeather) {
    if (newWeather) {
      this.currentState = { ...this.currentState, ...newWeather };
    } else {
      const weatherTypes = ["clear", "cloudy", "rainy", "stormy", "foggy"];
      this.currentState.type = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      this.currentState.intensity = Math.random() * 0.8 + 0.2;
      this.currentState.temperature = 15 + Math.random() * 20;
      this.currentState.humidity = 30 + Math.random() * 60;
      this.currentState.windSpeed = Math.random() * 15;
    }
    console.log(
      `Weather changed to: ${this.currentState.type} (intensity: ${this.currentState.intensity.toFixed(2)})`
    );
  }
  // Get current weather state
  getCurrentWeather() {
    return { ...this.currentState };
  }
  // Get current time
  getCurrentTime() {
    return { ...this.currentTime };
  }
  // Set time of day
  setTimeOfDay(hour, minute = 0) {
    this.currentTime.hour = Math.max(0, Math.min(23, hour));
    this.currentTime.minute = Math.max(0, Math.min(59, minute));
    this.currentTime.dayProgress = (this.currentTime.hour * 60 + this.currentTime.minute) / 1440;
  }
  // Set time scale
  setTimeScale(scale) {
    this.timeScale = Math.max(0.1, Math.min(1e3, scale));
  }
  // Get weather forecast
  getForecast() {
    const forecast = [];
    const baseWeather = { ...this.currentState };
    for (let i = 1; i <= 24; i++) {
      const hour = (this.currentTime.hour + i) % 24;
      let weatherType;
      if (hour >= 6 && hour < 12) {
        weatherType = Math.random() > 0.7 ? "cloudy" : "clear";
      } else if (hour >= 12 && hour < 18) {
        weatherType = Math.random() > 0.8 ? "rainy" : "clear";
      } else {
        weatherType = Math.random() > 0.6 ? "clear" : "cloudy";
      }
      forecast.push({
        ...baseWeather,
        type: weatherType,
        intensity: Math.random() * 0.8 + 0.2,
        temperature: baseWeather.temperature + (Math.random() - 0.5) * 10
      });
    }
    return forecast;
  }
  // Cleanup system
  cleanup() {
    this.celestialBodies.forEach((body) => {
      import_ecs25.engine.removeEntity(body.entity);
    });
    this.celestialBodies.clear();
    this.weatherEffects.forEach((effect) => {
      import_ecs25.engine.removeEntity(effect.entity);
    });
    this.weatherEffects = [];
    if (this.skyDome) {
      import_ecs25.engine.removeEntity(this.skyDome);
    }
    this.isInitialized = false;
  }
};
var weatherSystem = new WeatherSystem();

// src/perception-sensors.ts
var import_ecs26 = require("@dcl/sdk/ecs");
var import_math24 = require("@dcl/sdk/math");
var PerceptionSensors = class {
  constructor() {
    this.zones = [];
    this.lastUpdate = 0;
  }
  initialize() {
    console.log("\u{1F441}\uFE0F Perception Sensors: initializing spatial awareness...");
    this.createZone("sovereign_core", import_math24.Vector3.create(8, 2, 8), import_math24.Vector3.create(6, 4, 6));
    this.createZone("entrance", import_math24.Vector3.create(8, 2, 1), import_math24.Vector3.create(4, 4, 2));
    import_ecs26.engine.addSystem((dt) => {
      this.lastUpdate += dt;
      if (this.lastUpdate >= 1) {
        this.lastUpdate = 0;
        this.updatePresence();
      }
    });
  }
  createZone(id, center, size) {
    const entity = import_ecs26.engine.addEntity();
    import_ecs26.Transform.create(entity, {
      position: center,
      scale: size
    });
    import_ecs26.MeshRenderer.setBox(entity);
    import_ecs26.Material.setPbrMaterial(entity, {
      albedoColor: import_math24.Color4.create(0, 1, 0, 0.05),
      emissiveColor: import_math24.Color4.create(0, 1, 0.1, 0.1),
      emissiveIntensity: 0.5
    });
    this.zones.push({ id, center, size, entity, isOccupied: false });
  }
  updatePresence() {
    const playerTransform = import_ecs26.Transform.getOrNull(import_ecs26.engine.PlayerEntity);
    if (!playerTransform) return;
    const pos = playerTransform.position;
    for (const zone of this.zones) {
      const inX = Math.abs(pos.x - zone.center.x) < zone.size.x / 2;
      const inZ = Math.abs(pos.z - zone.center.z) < zone.size.z / 2;
      const inY = pos.y > zone.center.y - zone.size.y / 2 && pos.y < zone.center.y + zone.size.y / 2;
      const occupied = inX && inY && inZ;
      if (occupied !== zone.isOccupied) {
        zone.isOccupied = occupied;
        this.onPresenceChange(zone.id, occupied);
      }
    }
  }
  onPresenceChange(zoneId, occupied) {
    console.log(`\u{1F4E1} Perception Event: Zone ${zoneId} -> ${occupied ? "OCCUPIED" : "VACANT"}`);
    updateSystemStatus(`META_PRESENCE_${zoneId.toUpperCase()}`, occupied);
    reportPresence(zoneId, occupied);
  }
};
var perceptionSensors = new PerceptionSensors();

// src/enhanced-index.ts
function enhancedMain() {
  console.log(" Initializing AIGestion Enhanced Virtual Office...");
  soundSystem.initialize();
  lightingSystem.initialize();
  uiSystem.initialize();
  perceptionSensors.initialize();
  createEnhancedArchitecture();
  createEnhancedInteractables();
  console.log(" Core systems initialized - Starting advanced systems...");
  setTimeout(() => {
    weatherSystem.initialize();
    multiplayerSystem.initialize();
    avatarSystem.initialize();
    smartRoomSystem.initialize();
  }, 100);
  setTimeout(() => {
    gestureSystem.initialize();
    whiteboardSystem.initialize();
    voiceCommandSystem.initialize();
    blockchainSystem.initialize();
  }, 200);
  setTimeout(() => {
    arIntegrationSystem.initialize();
    contentManagementSystem.initialize();
    physicsSystem.initialize();
    proceduralSystem.initialize();
  }, 300);
  setTimeout(() => {
    emotionDetectionSystem.initialize();
    crossPlatformSyncSystem.initialize();
    analyticsDashboardSystem.initialize();
    hapticFeedbackSystem.initialize();
  }, 400);
  setTimeout(() => {
    initializeNPCs();
    initializeDataVisualization();
    startRealTimeUpdates();
    createParticleEffects();
    console.log(" Enhanced Virtual Office Initialized Successfully!");
  }, 500);
}
var systemUpdateInterval;
var diagnosticsInterval;
var alertsInterval;
function startRealTimeUpdates() {
  if (systemUpdateInterval) clearInterval(systemUpdateInterval);
  if (diagnosticsInterval) clearInterval(diagnosticsInterval);
  if (alertsInterval) clearInterval(alertsInterval);
  systemUpdateInterval = setInterval(async () => {
    try {
      const stats = await fetchEnhancedSystemStats();
      updateSystemStatus("AUTO_UPDATE", true);
      if (stats.systemHealth === "CRITICAL") {
        updateAlert(" CRITICAL: System overload detected!", "CRITICAL");
        soundSystem.playInteractionSound("alert");
      } else if (stats.systemHealth === "WARNING") {
        updateAlert(" WARNING: High system load detected", "WARNING");
        soundSystem.playInteractionSound("alert");
      } else {
        updateAlert(" All systems operating normally", "INFO");
      }
      console.log(" System Stats Updated:", stats);
    } catch (error) {
      console.error(" Error updating system stats:", error);
    }
  }, 5e3);
  diagnosticsInterval = setInterval(async () => {
    try {
      const diagnostics = await runSystemDiagnostics();
      console.log(" System Diagnostics:", diagnostics);
      if (diagnostics.overall === "CRITICAL") {
        updateAlert(" CRITICAL SYSTEM FAILURE DETECTED!", "CRITICAL");
        soundSystem.playInteractionSound("error");
      }
    } catch (error) {
      console.error(" Error running diagnostics:", error);
    }
  }, 2e4);
  alertsInterval = setInterval(async () => {
    try {
      const alerts = await fetchAlertMessages();
      if (alerts.length > 0) {
        const latestAlert = alerts[alerts.length - 1];
        updateAlert(latestAlert.message, latestAlert.type);
      }
    } catch (error) {
      console.error(" Error fetching alerts:", error);
    }
  }, 1e4);
}
function initializeNPCs() {
  npcManager.createNPC("NEXUS", "System Administrator", import_math25.Vector3.create(4, 1, 4));
  npcManager.createNPC("DATA", "Data Analyst", import_math25.Vector3.create(12, 1, 4));
  npcManager.createNPC("GUARD", "Security Expert", import_math25.Vector3.create(8, 1, 12));
  console.log("\u{1F916} AI Assistants Initialized");
}
function initializeDataVisualization() {
  const mainWall = dataVizManager.createWall(
    "main",
    import_math25.Vector3.create(8, 4, 0.5),
    import_math25.Vector3.create(16, 8, 0.2)
  );
  mainWall.addChart("systemStatus", {
    type: "bar",
    title: "System Status",
    data: DataVisualizationManager.createSystemStatusData(),
    maxDataPoints: 10,
    updateInterval: 3e3
  });
  mainWall.startDataStream("realtime", DataVisualizationManager.createRealtimeDataSource());
  console.log("\u{1F4CA} Data Visualization Initialized");
}
var particlePool = [];
var maxParticles = 50;
function createParticleEffects() {
  console.log("\u{1F3A8} Creating particle effects...");
  const particleCount = Math.min(32, maxParticles);
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticle();
    particlePool.push({ entity: particle, type: "data", offset: Math.random() * Math.PI * 2 });
  }
  const energyCount = Math.min(16, maxParticles - particleCount);
  for (let i = 0; i < energyCount; i++) {
    const energyParticle = createEnergyParticle();
    particlePool.push({
      entity: energyParticle,
      type: "energy",
      offset: Math.random() * Math.PI * 2
    });
  }
  import_ecs27.engine.addSystem(particleSystem);
  console.log(`\u2705 Created ${particleCount + energyCount} particles`);
}
function particleSystem(dt) {
  const t = Date.now() / 1e3;
  for (const p of particlePool) {
    const transform = import_ecs27.Transform.getMutable(p.entity);
    if (p.type === "data") {
      transform.position.y += Math.sin(t + p.offset) * dt * 0.5;
      transform.rotation = { x: 0, y: (t * 20 + p.offset * 10) % 360, z: 0, w: 1 };
    } else if (p.type === "energy") {
      transform.position.y += dt * 1.5;
      if (transform.position.y > 10) transform.position.y = 2;
      const radius = 1;
      transform.position.x += Math.cos(t * 2 + p.offset) * dt;
      transform.position.z += Math.sin(t * 2 + p.offset) * dt;
    }
  }
}
function createParticle() {
  const particle = import_ecs27.engine.addEntity();
  import_ecs27.Transform.create(particle, {
    position: import_math25.Vector3.create(Math.random() * 16, Math.random() * 4 + 1, Math.random() * 16),
    scale: import_math25.Vector3.create(0.1, 0.1, 0.1)
  });
  import_ecs27.MeshRenderer.setBox(particle);
  import_ecs27.Material.setPbrMaterial(particle, {
    albedoColor: import_math25.Color4.create(0, 1, 0.8, 0.6),
    roughness: 0,
    metallic: 0.5,
    emissiveColor: import_math25.Color4.create(0, 1, 0.8, 1),
    emissiveIntensity: 3
  });
  return particle;
}
function createEnergyParticle() {
  const energyParticle = import_ecs27.engine.addEntity();
  import_ecs27.Transform.create(energyParticle, {
    position: import_math25.Vector3.create(
      8 + (Math.random() - 0.5) * 4,
      2 + Math.random() * 2,
      8 + (Math.random() - 0.5) * 4
    ),
    scale: import_math25.Vector3.create(0.15, 0.15, 0.15)
  });
  import_ecs27.MeshRenderer.setBox(energyParticle);
  import_ecs27.Material.setPbrMaterial(energyParticle, {
    albedoColor: import_math25.Color4.create(1, 0.8, 0.2, 0.7),
    roughness: 0.1,
    metallic: 0.8,
    emissiveColor: import_math25.Color4.create(1, 0.8, 0.2, 1),
    emissiveIntensity: 5
  });
  return energyParticle;
}
function cleanupEnhancedScene() {
  if (systemUpdateInterval) clearInterval(systemUpdateInterval);
  if (diagnosticsInterval) clearInterval(diagnosticsInterval);
  if (alertsInterval) clearInterval(alertsInterval);
  particlePool.forEach((particle) => {
    import_ecs27.engine.removeEntity(particle);
  });
  particlePool.length = 0;
  soundSystem.cleanup();
  lightingSystem.cleanup();
  npcManager.cleanup();
  dataVizManager.cleanup();
  uiSystem.cleanup();
  weatherSystem.cleanup();
  multiplayerSystem.cleanup();
  avatarSystem.cleanup();
  smartRoomSystem.cleanup();
  gestureSystem.cleanup();
  whiteboardSystem.cleanup();
  voiceCommandSystem.cleanup();
  blockchainSystem.cleanup();
  arIntegrationSystem.cleanup();
  contentManagementSystem.cleanup();
  physicsSystem.cleanup();
  proceduralSystem.cleanup();
  emotionDetectionSystem.cleanup();
  crossPlatformSyncSystem.cleanup();
  analyticsDashboardSystem.cleanup();
  hapticFeedbackSystem.cleanup();
}
enhancedMain();
