import {
  engine,
  Entity,
  InputAction,
  Material,
  MeshRenderer,
  pointerEventsSystem,
  TextShape,
  Transform,
} from '@dcl/sdk/ecs';
import { Color4, Vector3 } from '@dcl/sdk/math';
import { soundSystem } from './enhanced-sound';

let bodyTextEntity: Entity;
let systemStatusEntity: Entity;
let alertSystemEntity: Entity;

// ── Security Terminal state ────────────────────────────────────────────────────
let scanInProgress = false;
let scanTimer = 0;
let scanPhase = 0;
const SCAN_PHASES = [
  { delay: 0,    status: '🔍 INITIATING SECURITY SCAN…', alert: { msg: 'Scan started — standby', type: 'INFO' as const } },
  { delay: 1.5,  status: '🔍 SCANNING PERIMETER LAYER…', alert: { msg: 'Layer 1/3 scanning', type: 'INFO' as const } },
  { delay: 3.0,  status: '🔍 ANALYZING QUANTUM STREAM…', alert: { msg: 'Layer 2/3 deep analysis', type: 'WARNING' as const } },
  { delay: 4.5,  status: '🔍 CROSS-CHECKING SIGNATURES…', alert: { msg: 'Layer 3/3 signature verify', type: 'INFO' as const } },
];

export function createEnhancedInteractables() {
  // --- Enhanced Main Dashboard ---
  const mainDashboard = engine.addEntity();
  Transform.create(mainDashboard, {
    position: Vector3.create(8, 3, 15.5),
    scale: Vector3.create(8, 4, 0.2),
  });
  MeshRenderer.setBox(mainDashboard);
  Material.setPbrMaterial(mainDashboard, {
    albedoColor: Color4.create(0, 0, 0, 0.95),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: Color4.create(0.1, 0.3, 0.6, 0.3),
    emissiveIntensity: 2,
  });

  // Enhanced Title with glow effect
  const titleText = engine.addEntity();
  Transform.create(titleText, {
    parent: mainDashboard,
    position: Vector3.create(0, 0.4, -0.8),
    scale: Vector3.create(0.125, 0.25, 1),
  });
  TextShape.create(titleText, {
    text: '⚡ AIGESTION NEXUS HQ ⚡',
    textColor: Color4.create(0.8, 0.5, 1, 1),
    fontSize: 6,
    textAlign: 3,
    outlineWidth: 0.1,
    outlineColor: Color4.create(0.5, 0.2, 0.8, 1),
  });

  // Dynamic System Status Display
  systemStatusEntity = engine.addEntity();
  Transform.create(systemStatusEntity, {
    parent: mainDashboard,
    position: Vector3.create(0, -0.1, -0.8),
    scale: Vector3.create(0.125, 0.25, 1),
  });
  TextShape.create(systemStatusEntity, {
    text: '🔥 SYSTEMS ONLINE 🔥\n⚡ Quantum Core: ACTIVE\n🌐 Network: OPTIMAL\n🛡️ Security: ENHANCED',
    textColor: Color4.create(0, 1, 0.8, 1),
    fontSize: 3,
    textAlign: 3,
  });

  // Alert System Display
  alertSystemEntity = engine.addEntity();
  Transform.create(alertSystemEntity, {
    parent: mainDashboard,
    position: Vector3.create(0, -0.5, -0.8),
    scale: Vector3.create(0.125, 0.25, 1),
  });
  TextShape.create(alertSystemEntity, {
    text: '📡 Real-time Monitoring Active...',
    textColor: Color4.create(1, 1, 0, 1),
    fontSize: 2.5,
    textAlign: 3,
  });

  // --- Interactive Control Panels ---

  // Quantum Control Panel
  const quantumPanel = engine.addEntity();
  Transform.create(quantumPanel, {
    position: Vector3.create(2, 1.5, 10),
    scale: Vector3.create(2, 2, 0.3),
  });
  MeshRenderer.setBox(quantumPanel);
  Material.setPbrMaterial(quantumPanel, {
    albedoColor: Color4.create(0.2, 0.1, 0.4, 0.9),
    roughness: 0.2,
    metallic: 0.8,
    emissiveColor: Color4.create(0.6, 0.3, 1, 0.5),
    emissiveIntensity: 3,
  });

  const quantumLabel = engine.addEntity();
  Transform.create(quantumLabel, {
    parent: quantumPanel,
    position: Vector3.create(0, 0.3, -0.6),
    scale: Vector3.create(0.5, 0.5, 1),
  });
  TextShape.create(quantumLabel, {
    text: 'QUANTUM\nCORE',
    textColor: Color4.create(0.8, 0.5, 1, 1),
    fontSize: 4,
    textAlign: 3,
  });

  // Network Control Panel
  const networkPanel = engine.addEntity();
  Transform.create(networkPanel, {
    position: Vector3.create(14, 1.5, 10),
    scale: Vector3.create(2, 2, 0.3),
  });
  MeshRenderer.setBox(networkPanel);
  Material.setPbrMaterial(networkPanel, {
    albedoColor: Color4.create(0.1, 0.3, 0.6, 0.9),
    roughness: 0.2,
    metallic: 0.8,
    emissiveColor: Color4.create(0.2, 0.6, 1, 0.5),
    emissiveIntensity: 3,
  });

  const networkLabel = engine.addEntity();
  Transform.create(networkLabel, {
    parent: networkPanel,
    position: Vector3.create(0, 0.3, -0.6),
    scale: Vector3.create(0.5, 0.5, 1),
  });
  TextShape.create(networkLabel, {
    text: 'NETWORK\nHUB',
    textColor: Color4.create(0.5, 0.8, 1, 1),
    fontSize: 4,
    textAlign: 3,
  });

  // --- Enhanced Interactive Elements ---

  // Master Control Sphere
  const masterControl = engine.addEntity();
  Transform.create(masterControl, {
    position: Vector3.create(8, 2, 8),
    scale: Vector3.create(1.5, 1.5, 1.5),
  });
  MeshRenderer.setBox(masterControl);
  Material.setPbrMaterial(masterControl, {
    albedoColor: Color4.create(1, 0.8, 0.2, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: Color4.create(1, 0.8, 0.2, 1),
    emissiveIntensity: 8,
  });

  // Add interaction to master control with sound
  pointerEventsSystem.onPointerDown(
    {
      entity: masterControl,
      opts: { button: InputAction.IA_POINTER, hoverText: '🎮 MASTER CONTROL SYSTEM' },
    },
    () => {
      console.log('🎮 Master Control Activated - Quantum Systems Online');
      soundSystem.playInteractionSound('powerup');
      updateSystemStatus('QUANTUM_MODE', true);
    }
  );

  // Quantum Control Interaction with sound
  pointerEventsSystem.onPointerDown(
    {
      entity: quantumPanel,
      opts: { button: InputAction.IA_POINTER, hoverText: '⚡ Activate Quantum Core' },
    },
    () => {
      console.log('⚡ Quantum Core Activation Sequence');
      soundSystem.playInteractionSound('powerup');
      updateSystemStatus('QUANTUM_CORE', true);
    }
  );

  // Network Control Interaction with sound
  pointerEventsSystem.onPointerDown(
    {
      entity: networkPanel,
      opts: { button: InputAction.IA_POINTER, hoverText: '🌐 Network Diagnostics' },
    },
    () => {
      console.log('🌐 Network Diagnostics Running');
      soundSystem.playInteractionSound('click');
      updateSystemStatus('NETWORK_SCAN', true);
    }
  );

  // --- Floating Data Orbs ---
  for (let i = 0; i < 5; i++) {
    const dataOrb = engine.addEntity();
    Transform.create(dataOrb, {
      position: Vector3.create(3 + i * 1.5, 3.5, 5 + i * 0.5),
      scale: Vector3.create(0.5, 0.5, 0.5),
    });
    MeshRenderer.setBox(dataOrb);
    Material.setPbrMaterial(dataOrb, {
      albedoColor: Color4.create(0, 1, 0.8, 0.7),
      roughness: 0.0,
      metallic: 0.8,
      emissiveColor: Color4.create(0, 1, 0.8, 1),
      emissiveIntensity: 5,
    });

    pointerEventsSystem.onPointerDown(
      {
        entity: dataOrb,
        opts: { button: InputAction.IA_POINTER, hoverText: `📊 Data Node ${i + 1}` },
      },
      () => {
        console.log(`📊 Accessing Data Node ${i + 1}`);
        updateSystemStatus(`DATA_NODE_${i + 1}`, true);
      }
    );
  }

  // --- Security Terminal ---
  const securityTerminal = engine.addEntity();
  Transform.create(securityTerminal, {
    position: Vector3.create(8, 1, 2),
    scale: Vector3.create(3, 2, 0.5),
  });
  MeshRenderer.setBox(securityTerminal);
  Material.setPbrMaterial(securityTerminal, {
    albedoColor: Color4.create(0.1, 0.2, 0.3, 0.9),
    roughness: 0.3,
    metallic: 0.7,
    emissiveColor: Color4.create(0.2, 0.4, 0.6, 0.4),
    emissiveIntensity: 2,
  });

  const securityLabel = engine.addEntity();
  Transform.create(securityLabel, {
    parent: securityTerminal,
    position: Vector3.create(0, 0.2, -0.6),
    scale: Vector3.create(0.33, 0.5, 1),
  });
  TextShape.create(securityLabel, {
    text: '🛡️ SECURITY\nTERMINAL',
    textColor: Color4.create(0.5, 0.8, 1, 1),
    fontSize: 3,
    textAlign: 3,
  });

  pointerEventsSystem.onPointerDown(
    {
      entity: securityTerminal,
      opts: { button: InputAction.IA_POINTER, hoverText: '🛡️ Run Security Scan' },
    },
    () => {
      if (scanInProgress) {
        console.log('🛡️ Scan already in progress…');
        return;
      }
      console.log('🛡️ Security Scan Initiated');
      soundSystem.playInteractionSound('click');
      startSecurityScan();
    }
  );

  // Wire the scan step-timer system
  engine.addSystem((dt: number) => {
    if (!scanInProgress) return;
    scanTimer += dt;
    // Advance phases
    if (scanPhase < SCAN_PHASES.length && scanTimer >= SCAN_PHASES[scanPhase].delay) {
      const phase = SCAN_PHASES[scanPhase];
      updateSystemStatus(phase.status, true);
      updateAlert(phase.alert.msg, phase.alert.type);
      scanPhase++;
    }
    // Final resolution at t+6 s
    if (scanTimer >= 6.0) {
      scanInProgress = false;
      scanTimer = 0;
      scanPhase = 0;
      const breach = Math.random() > 0.85;
      if (breach) {
        updateSystemStatus('🚨 SECURITY BREACH DETECTED', false);
        updateAlert('BREACH: Anomaly in quantum stream!', 'CRITICAL');
      } else {
        updateSystemStatus('✅ SCAN COMPLETE — SECURE', true);
        updateAlert('Security scan complete — NO threats found ✅', 'INFO');
      }
    }
  });

  // --- Energy Crystals ---
  for (let i = 0; i < 3; i++) {
    const energyCrystal = engine.addEntity();
    Transform.create(energyCrystal, {
      position: Vector3.create(4 + i * 4, 1, 14),
      scale: Vector3.create(0.8, 1.2, 0.8),
    });
    MeshRenderer.setBox(energyCrystal);
    Material.setPbrMaterial(energyCrystal, {
      albedoColor: Color4.create(0.8, 0.2, 1, 0.8),
      roughness: 0.1,
      metallic: 0.9,
      emissiveColor: Color4.create(0.8, 0.2, 1, 1),
      emissiveIntensity: 6,
    });

    pointerEventsSystem.onPointerDown(
      {
        entity: energyCrystal,
        opts: { button: InputAction.IA_POINTER, hoverText: `💎 Energy Crystal ${i + 1}` },
      },
      () => {
        console.log(`💎 Energy Crystal ${i + 1} Activated`);
        updateSystemStatus(`ENERGY_BOOST_${i + 1}`, true);
      }
    );
  }
}

// ── Security Scan ─────────────────────────────────────────────────────────────

function startSecurityScan() {
  scanInProgress = true;
  scanTimer = 0;
  scanPhase = 0;
  updateSystemStatus('🛡️ SCAN INITIALIZING…', true);
  updateAlert('Security scan started…', 'INFO');
}

export function updateSystemStatus(system: string, active: boolean) {
  if (!systemStatusEntity) return;

  const status = active ? '✅ ACTIVE' : '⚠️ INACTIVE';
  const color = active ? Color4.create(0, 1, 0.5, 1) : Color4.create(1, 0.5, 0, 1);

  TextShape.getMutable(systemStatusEntity).text =
    `🔥 SYSTEMS ONLINE 🔥\n` +
    `⚡ Quantum Core: ${status}\n` +
    `🌐 Network: OPTIMAL\n` +
    `🛡️ Security: ENHANCED\n` +
    `📡 Last Action: ${system}`;

  TextShape.getMutable(systemStatusEntity).textColor = color;
}

export function updateAlert(message: string, alertType: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO') {
  if (!alertSystemEntity) return;

  const colors = {
    INFO: Color4.create(0, 1, 1, 1),
    WARNING: Color4.create(1, 1, 0, 1),
    CRITICAL: Color4.create(1, 0, 0, 1),
  };

  const icons = {
    INFO: '📡',
    WARNING: '⚠️',
    CRITICAL: '🚨',
  };

  TextShape.getMutable(alertSystemEntity).text = `${icons[alertType]} ${message}`;
  TextShape.getMutable(alertSystemEntity).textColor = colors[alertType];
}
