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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  main: () => main
});
module.exports = __toCommonJS(index_exports);
var import_ecs2 = require("@dcl/sdk/ecs");
var import_math2 = require("@dcl/sdk/math");

// src/daniela-integration.ts
var import_ecs = require("@dcl/sdk/ecs");
var import_math = require("@dcl/sdk/math");
var DanielaMetaverseIntegration = class {
  constructor() {
    this.aiCore = null;
    this.npcs = /* @__PURE__ */ new Map();
    this.dataStreams = [];
    this.isInitialized = false;
  }
  async initialize() {
    if (this.isInitialized) return;
    console.log("\u{1F9E0} Initializing Daniela AI for Metaverse...");
    this.createAICore();
    this.initializeAINPCs();
    this.createDataStreams();
    this.startAIProcessing();
    this.isInitialized = true;
    console.log("\u2705 Daniela AI Metaverse Integration Ready!");
  }
  createAICore() {
    this.aiCore = import_ecs.engine.addEntity();
    import_ecs.Transform.create(this.aiCore, {
      position: import_math.Vector3.create(8, 2, 8),
      scale: import_math.Vector3.create(4, 0.5, 4)
    });
    import_ecs.MeshRenderer.setBox(this.aiCore);
    import_ecs.Material.setPbrMaterial(this.aiCore, {
      albedoColor: import_math.Color4.create(0.2, 0.1, 0.4, 0.8),
      roughness: 0.1,
      metallic: 0.9,
      emissiveColor: import_math.Color4.create(0.6, 0.3, 1, 0.6),
      emissiveIntensity: 5
    });
  }
  initializeAINPCs() {
    const danielaNPC = import_ecs.engine.addEntity();
    import_ecs.Transform.create(danielaNPC, {
      position: import_math.Vector3.create(8, 1, 10),
      scale: import_math.Vector3.create(0.8, 1.8, 0.8)
    });
    import_ecs.MeshRenderer.setBox(danielaNPC);
    import_ecs.Material.setPbrMaterial(danielaNPC, {
      albedoColor: import_math.Color4.create(0.8, 0.3, 1, 0.9),
      roughness: 0.2,
      metallic: 0.7,
      emissiveColor: import_math.Color4.create(0.8, 0.3, 1, 0.8),
      emissiveIntensity: 4
    });
    this.npcs.set("daniela", {
      entity: danielaNPC,
      personality: "strategic",
      role: "AI Assistant",
      status: "active"
    });
    const adminNPC = import_ecs.engine.addEntity();
    import_ecs.Transform.create(adminNPC, {
      position: import_math.Vector3.create(4, 1, 8),
      scale: import_math.Vector3.create(0.8, 1.8, 0.8)
    });
    import_ecs.MeshRenderer.setBox(adminNPC);
    import_ecs.Material.setPbrMaterial(adminNPC, {
      albedoColor: import_math.Color4.create(0.3, 0.8, 1, 0.9),
      roughness: 0.2,
      metallic: 0.7,
      emissiveColor: import_math.Color4.create(0.3, 0.8, 1, 0.8),
      emissiveIntensity: 4
    });
    this.npcs.set("admin", {
      entity: adminNPC,
      personality: "professional",
      role: "System Administrator",
      status: "active"
    });
  }
  createDataStreams() {
    for (let i = 0; i < 8; i++) {
      const stream = import_ecs.engine.addEntity();
      const angle = i / 8 * Math.PI * 2;
      const radius = 3;
      import_ecs.Transform.create(stream, {
        position: import_math.Vector3.create(
          8 + Math.cos(angle) * radius,
          2 + Math.random() * 2,
          8 + Math.sin(angle) * radius
        ),
        scale: import_math.Vector3.create(0.1, 4, 0.1)
      });
      import_ecs.MeshRenderer.setBox(stream);
      import_ecs.Material.setPbrMaterial(stream, {
        albedoColor: import_math.Color4.create(0, 1, 0.8, 0.6),
        roughness: 0,
        metallic: 0.5,
        emissiveColor: import_math.Color4.create(0, 1, 0.8, 1),
        emissiveIntensity: 4
      });
      this.dataStreams.push({
        entity: stream,
        type: "ai-data",
        angle,
        radius
      });
    }
  }
  startAIProcessing() {
    let processingTime = 0;
    import_ecs.engine.addSystem(() => {
      processingTime += 0.016;
      this.animateDataStreams(processingTime);
      this.pulseAICore(processingTime);
      this.updateNPCs(processingTime);
    });
  }
  animateDataStreams(time) {
    this.dataStreams.forEach((stream, index) => {
      const transform = import_ecs.Transform.getMutable(stream.entity);
      transform.position.y = 2 + Math.sin(time * 2 + index) * 0.5;
      const newAngle = stream.angle + time * 0.5;
      transform.position.x = 8 + Math.cos(newAngle) * stream.radius;
      transform.position.z = 8 + Math.sin(newAngle) * stream.radius;
      const scale = 0.1 + Math.sin(time * 4 + index) * 0.05;
      transform.scale.x = scale;
      transform.scale.z = scale;
    });
  }
  pulseAICore(time) {
    const transform = import_ecs.Transform.getMutable(this.aiCore);
    transform.position.y = 2 + Math.sin(time) * 0.2;
  }
  updateNPCs(time) {
    this.npcs.forEach((npc, name) => {
      const transform = import_ecs.Transform.getMutable(npc.entity);
      transform.rotation.y = Math.sin(time * 0.5) * 0.1;
      if (name === "daniela") {
        transform.position.z = 10 + Math.sin(time * 0.3) * 0.2;
      }
    });
  }
  // Public API for external interaction
  async processUserQuery(query, userId) {
    console.log(`\u{1F9E0} Processing query from ${userId}: ${query}`);
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    const responses = {
      "analytics": "Basado en los datos del sistema, he detectado un aumento del 23% en la eficiencia operativa esta semana.",
      "status": "Todos los sistemas operativos. Daniela IA est\xE1 funcionando al 98% de capacidad.",
      "help": "Soy Daniela, tu asistente de IA en el metaverso. Puedo ayudarte con an\xE1lisis, predicciones y optimizaci\xF3n del sistema.",
      "default": "Entendido tu consulta. Como IA de AIGestion, estoy aqu\xED para optimizar tus procesos y proporcionar insights estrat\xE9gicos."
    };
    const queryLower = query.toLowerCase();
    let response = responses.default;
    if (queryLower.includes("anal") || queryLower.includes("m\xE9trica")) {
      response = responses.analytics;
    } else if (queryLower.includes("estado") || queryLower.includes("status")) {
      response = responses.status;
    } else if (queryLower.includes("ayuda") || queryLower.includes("help")) {
      response = responses.help;
    }
    return response;
  }
  getSystemStatus() {
    return {
      aiCore: "active",
      npcs: Array.from(this.npcs.entries()).map(([name, npc]) => ({
        name,
        role: npc.role,
        status: npc.status,
        personality: npc.personality
      })),
      dataStreams: this.dataStreams.length,
      processing: "real-time",
      integration: "daniela-ai-connected"
    };
  }
  cleanup() {
    import_ecs.engine.removeEntity(this.aiCore);
    this.npcs.forEach((npc) => {
      import_ecs.engine.removeEntity(npc.entity);
    });
    this.npcs.clear();
    this.dataStreams.forEach((stream) => {
      import_ecs.engine.removeEntity(stream.entity);
    });
    this.dataStreams.length = 0;
    this.isInitialized = false;
  }
};
var danielaMetaverse = new DanielaMetaverseIntegration();

// src/index.ts
function main() {
  console.log("\u{1F680} Starting AIGestion Virtual Office - God Mode...");
  createGodModeArchitecture();
  initializeCoreSystems();
  startRealTimeUpdates();
  console.log("\u2705 AIGestion Virtual Office - God Mode Initialized!");
}
function createGodModeArchitecture() {
  const floor = import_ecs2.engine.addEntity();
  import_ecs2.Transform.create(floor, {
    position: import_math2.Vector3.create(8, 0.01, 8),
    scale: import_math2.Vector3.create(16, 0.1, 16)
  });
  import_ecs2.MeshRenderer.setBox(floor);
  import_ecs2.Material.setPbrMaterial(floor, {
    albedoColor: import_math2.Color4.create(0.05, 0.1, 0.2, 0.9),
    roughness: 0.1,
    metallic: 0.8,
    emissiveColor: import_math2.Color4.create(0, 0.3, 0.6, 0.4),
    emissiveIntensity: 3
  });
  createQuantumWalls();
  createDanielaAICenter();
  createEnhancedLighting();
}
function createQuantumWalls() {
  const backWall = import_ecs2.engine.addEntity();
  import_ecs2.Transform.create(backWall, {
    position: import_math2.Vector3.create(8, 3, 15.9),
    scale: import_math2.Vector3.create(16, 6, 0.2)
  });
  import_ecs2.MeshRenderer.setBox(backWall);
  import_ecs2.Material.setPbrMaterial(backWall, {
    albedoColor: import_math2.Color4.create(0.15, 0.1, 0.2, 1),
    roughness: 0.3,
    metallic: 0.6,
    emissiveColor: import_math2.Color4.create(0.3, 0.1, 0.5, 0.2),
    emissiveIntensity: 1
  });
  const leftGlass = import_ecs2.engine.addEntity();
  import_ecs2.Transform.create(leftGlass, {
    position: import_math2.Vector3.create(0.1, 3, 8),
    scale: import_math2.Vector3.create(0.2, 6, 16)
  });
  import_ecs2.MeshRenderer.setBox(leftGlass);
  import_ecs2.Material.setPbrMaterial(leftGlass, {
    albedoColor: import_math2.Color4.create(0.5, 0.7, 1, 0.2),
    roughness: 0,
    metallic: 0.3,
    emissiveColor: import_math2.Color4.create(0.3, 0.5, 1, 0.4),
    emissiveIntensity: 2
  });
  const rightGlass = import_ecs2.engine.addEntity();
  import_ecs2.Transform.create(rightGlass, {
    position: import_math2.Vector3.create(15.9, 3, 8),
    scale: import_math2.Vector3.create(0.2, 6, 16)
  });
  import_ecs2.MeshRenderer.setBox(rightGlass);
  import_ecs2.Material.setPbrMaterial(rightGlass, {
    albedoColor: import_math2.Color4.create(0.5, 0.7, 1, 0.2),
    roughness: 0,
    metallic: 0.3,
    emissiveColor: import_math2.Color4.create(0.3, 0.5, 1, 0.4),
    emissiveIntensity: 2
  });
}
function createDanielaAICenter() {
  const aiCore = import_ecs2.engine.addEntity();
  import_ecs2.Transform.create(aiCore, {
    position: import_math2.Vector3.create(8, 1, 8),
    scale: import_math2.Vector3.create(3, 0.5, 3)
  });
  import_ecs2.MeshRenderer.setBox(aiCore);
  import_ecs2.Material.setPbrMaterial(aiCore, {
    albedoColor: import_math2.Color4.create(0.2, 0.1, 0.4, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: import_math2.Color4.create(0.6, 0.3, 1, 0.6),
    emissiveIntensity: 5
  });
  for (let i = 0; i < 5; i++) {
    const orb = import_ecs2.engine.addEntity();
    import_ecs2.Transform.create(orb, {
      position: import_math2.Vector3.create(6 + i * 1.5, 2 + Math.sin(i) * 0.5, 6 + Math.cos(i) * 1.5),
      scale: import_math2.Vector3.create(0.3, 0.3, 0.3)
    });
    import_ecs2.MeshRenderer.setBox(orb);
    import_ecs2.Material.setPbrMaterial(orb, {
      albedoColor: import_math2.Color4.create(0.8, 0.3, 1, 0.7),
      roughness: 0,
      metallic: 0.8,
      emissiveColor: import_math2.Color4.create(0.8, 0.3, 1, 1),
      emissiveIntensity: 8
    });
  }
  const dashboard = import_ecs2.engine.addEntity();
  import_ecs2.Transform.create(dashboard, {
    position: import_math2.Vector3.create(8, 4, 2),
    scale: import_math2.Vector3.create(8, 4, 0.1)
  });
  import_ecs2.MeshRenderer.setBox(dashboard);
  import_ecs2.Material.setPbrMaterial(dashboard, {
    albedoColor: import_math2.Color4.create(0, 0, 0, 0.9),
    roughness: 0.1,
    metallic: 0.8,
    emissiveColor: import_math2.Color4.create(0.2, 0.8, 1, 0.4),
    emissiveIntensity: 3
  });
}
function createEnhancedLighting() {
  const neonStrip1 = import_ecs2.engine.addEntity();
  import_ecs2.Transform.create(neonStrip1, {
    position: import_math2.Vector3.create(8, 5.9, 8),
    scale: import_math2.Vector3.create(14, 0.05, 14)
  });
  import_ecs2.MeshRenderer.setBox(neonStrip1);
  import_ecs2.Material.setPbrMaterial(neonStrip1, {
    albedoColor: import_math2.Color4.create(0, 0, 0, 1),
    emissiveColor: import_math2.Color4.create(0.8, 0.3, 1, 1),
    emissiveIntensity: 8
  });
  const neonStrip2 = import_ecs2.engine.addEntity();
  import_ecs2.Transform.create(neonStrip2, {
    position: import_math2.Vector3.create(8, 5.7, 8),
    scale: import_math2.Vector3.create(13, 0.05, 13)
  });
  import_ecs2.MeshRenderer.setBox(neonStrip2);
  import_ecs2.Material.setPbrMaterial(neonStrip2, {
    albedoColor: import_math2.Color4.create(0, 0, 0, 1),
    emissiveColor: import_math2.Color4.create(0.3, 0.8, 1, 1),
    emissiveIntensity: 6
  });
}
function initializeCoreSystems() {
  createOptimizedParticles();
  createDataStreams();
  createInteractiveElements();
  danielaMetaverse.initialize();
}
function createOptimizedParticles() {
  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = import_ecs2.engine.addEntity();
    import_ecs2.Transform.create(particle, {
      position: import_math2.Vector3.create(Math.random() * 16, Math.random() * 4 + 1, Math.random() * 16),
      scale: import_math2.Vector3.create(0.1, 0.1, 0.1)
    });
    import_ecs2.MeshRenderer.setBox(particle);
    import_ecs2.Material.setPbrMaterial(particle, {
      albedoColor: import_math2.Color4.create(0, 1, 0.8, 0.6),
      roughness: 0,
      metallic: 0.5,
      emissiveColor: import_math2.Color4.create(0, 1, 0.8, 1),
      emissiveIntensity: 3
    });
  }
}
function createDataStreams() {
  for (let i = 0; i < 3; i++) {
    const dataStream = import_ecs2.engine.addEntity();
    import_ecs2.Transform.create(dataStream, {
      position: import_math2.Vector3.create(4 + i * 3, 3, 2),
      scale: import_math2.Vector3.create(0.1, 4, 0.1)
    });
    import_ecs2.MeshRenderer.setBox(dataStream);
    import_ecs2.Material.setPbrMaterial(dataStream, {
      albedoColor: import_math2.Color4.create(0, 1, 0.8, 0.6),
      roughness: 0,
      metallic: 0.5,
      emissiveColor: import_math2.Color4.create(0, 1, 0.8, 1),
      emissiveIntensity: 4
    });
  }
}
function createInteractiveElements() {
  const welcomePanel = import_ecs2.engine.addEntity();
  import_ecs2.Transform.create(welcomePanel, {
    position: import_math2.Vector3.create(8, 2, 12),
    scale: import_math2.Vector3.create(4, 2, 0.1)
  });
  import_ecs2.MeshRenderer.setBox(welcomePanel);
  import_ecs2.Material.setPbrMaterial(welcomePanel, {
    albedoColor: import_math2.Color4.create(0.1, 0.1, 0.2, 0.9),
    roughness: 0.2,
    metallic: 0.7,
    emissiveColor: import_math2.Color4.create(0.3, 0.1, 0.5, 0.3),
    emissiveIntensity: 2
  });
}
function startRealTimeUpdates() {
  let updateCount = 0;
  import_ecs2.engine.addSystem(() => {
    updateCount++;
    if (updateCount % 10 === 0) {
      updateParticles();
    }
    if (updateCount % 5 === 0) {
      updateDataStreams();
    }
  });
}
function updateParticles() {
  const t = Date.now() / 1e3;
}
function updateDataStreams() {
  const t = Date.now() / 1e3;
}
