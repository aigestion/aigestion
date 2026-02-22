import { engine, Entity, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs';
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math';

/**
 * Creates a high-fidelity 'Neural Pillar' using nested primitives and lighting.
 */
export function createNeuralPillar(position: Vector3, scale: Vector3): Entity {
  const root = engine.addEntity();
  Transform.create(root, { position, scale });

  // Main Core Cylinder (simulated with a thin box)
  const core = engine.addEntity();
  Transform.create(core, {
    parent: root,
    scale: Vector3.create(0.8, 1, 0.8),
  });
  MeshRenderer.setBox(core);
  Material.setPbrMaterial(core, {
    albedoColor: Color4.create(0.1, 0.2, 0.4, 0.8),
    roughness: 0.1,
    metallic: 0.9,
    emissiveColor: Color4.create(0.1, 0.3, 0.6, 1),
    emissiveIntensity: 2,
  });

  // Animated Shell (4 outer panels)
  for (let i = 0; i < 4; i++) {
    const angle = (i * 90) * (Math.PI / 180);
    const panel = engine.addEntity();
    Transform.create(panel, {
      parent: root,
      position: Vector3.create(Math.cos(angle) * 0.6, 0, Math.sin(angle) * 0.6),
      rotation: Quaternion.fromEulerDegrees(0, i * 90, 0),
      scale: Vector3.create(0.1, 1, 0.5),
    });
    MeshRenderer.setBox(panel);
    Material.setPbrMaterial(panel, {
      albedoColor: Color4.create(0.3, 0.6, 1, 0.4),
      roughness: 0.0,
      metallic: 0.5,
      emissiveColor: Color4.create(0, 0.8, 1, 0.5),
      emissiveIntensity: 5,
    });
  }

  // Energy Rings
  for (let i = 0; i < 3; i++) {
    const ring = engine.addEntity();
    Transform.create(ring, {
      parent: root,
      position: Vector3.create(0, (i - 1) * 0.4, 0),
      scale: Vector3.create(1.1, 0.05, 1.1),
    });
    MeshRenderer.setBox(ring);
    Material.setPbrMaterial(ring, {
      albedoColor: Color4.create(1, 1, 1, 1),
      emissiveColor: Color4.create(0.5, 0.8, 1, 1),
      emissiveIntensity: 10,
    });
  }

  return root;
}

/**
 * Creates a pulsing 'Sovereign Core' with orbiting data rings.
 */
export function createSovereignCore(position: Vector3): Entity {
  const root = engine.addEntity();
  Transform.create(root, { position });

  // Central Singular Orb
  const orb = engine.addEntity();
  Transform.create(orb, {
    parent: root,
    scale: Vector3.create(0.8, 0.8, 0.8),
  });
  MeshRenderer.setSphere(orb);
  Material.setPbrMaterial(orb, {
    albedoColor: Color4.create(1, 1, 1, 1),
    emissiveColor: Color4.create(1, 0.8, 0.2, 1),
    emissiveIntensity: 15,
  });

  // Inner Pulse Shell
  const shell = engine.addEntity();
  Transform.create(shell, {
    parent: root,
    scale: Vector3.create(1.2, 1.2, 1.2),
  });
  MeshRenderer.setSphere(shell);
  Material.setPbrMaterial(shell, {
    albedoColor: Color4.create(0.6, 0.3, 1, 0.2),
    emissiveColor: Color4.create(0.6, 0.3, 1, 0.5),
    emissiveIntensity: 5,
  });

  // Logic for rotation and pulsing would be added to a system referencing these entities

  return root;
}
