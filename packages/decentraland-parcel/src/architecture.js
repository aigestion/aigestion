import { engine, Transform, MeshRenderer, Material } from '@dcl/sdk/ecs';
import { Vector3, Color4 } from '@dcl/sdk/math';
export function createArchitecture() {
  // --- Materials ---
  // Dark floor material
  const floorMaterial = engine.addEntity();
  Material.setPbrMaterial(floorMaterial, {
    albedoColor: Color4.create(0.1, 0.1, 0.12, 1),
    roughness: 0.1,
    metallic: 0.5,
  });
  // Glass material for walls
  const glassMaterial = engine.addEntity();
  Material.setPbrMaterial(glassMaterial, {
    albedoColor: Color4.create(0.2, 0.4, 0.8, 0.3),
    roughness: 0.1,
    metallic: 0.0,
    alphaTest: 0.1,
  });
  // --- Structures ---
  // Floor
  const floor = engine.addEntity();
  Transform.create(floor, {
    position: Vector3.create(8, 0.01, 8),
    scale: Vector3.create(16, 0.1, 16),
  });
  MeshRenderer.setBox(floor);
  Material.setPbrMaterial(floor, {
    albedoColor: Color4.create(0.05, 0.05, 0.05, 1),
    roughness: 0.2,
    metallic: 0.1,
  });
  // Ceiling
  const ceiling = engine.addEntity();
  Transform.create(ceiling, {
    position: Vector3.create(8, 6, 8),
    scale: Vector3.create(16, 0.1, 16),
  });
  MeshRenderer.setBox(ceiling);
  // Back Wall
  const backWall = engine.addEntity();
  Transform.create(backWall, {
    position: Vector3.create(8, 3, 15.9),
    scale: Vector3.create(16, 6, 0.2),
  });
  MeshRenderer.setBox(backWall);
  Material.setPbrMaterial(backWall, {
    albedoColor: Color4.create(0.1, 0.1, 0.15, 1),
    roughness: 0.5,
    metallic: 0.5,
  });
  // Side Glass Walls
  const leftGlass = engine.addEntity();
  Transform.create(leftGlass, {
    position: Vector3.create(0.1, 3, 8),
    scale: Vector3.create(0.2, 6, 16),
  });
  MeshRenderer.setBox(leftGlass);
  Material.setPbrMaterial(leftGlass, {
    albedoColor: Color4.create(0.7, 0.8, 1, 0.2),
    roughness: 0.0,
    metallic: 0.1,
  });
  const rightGlass = engine.addEntity();
  Transform.create(rightGlass, {
    position: Vector3.create(15.9, 3, 8),
    scale: Vector3.create(0.2, 6, 16),
  });
  MeshRenderer.setBox(rightGlass);
  Material.setPbrMaterial(rightGlass, {
    albedoColor: Color4.create(0.7, 0.8, 1, 0.2),
    roughness: 0.0,
    metallic: 0.1,
  });
  // Front Pillars (Open entry)
  const pillar1 = engine.addEntity();
  Transform.create(pillar1, {
    position: Vector3.create(2, 3, 0.5),
    scale: Vector3.create(1, 6, 1),
  });
  MeshRenderer.setBox(pillar1);
  const pillar2 = engine.addEntity();
  Transform.create(pillar2, {
    position: Vector3.create(14, 3, 0.5),
    scale: Vector3.create(1, 6, 1),
  });
  MeshRenderer.setBox(pillar2);
  // Neon Lights (Emissive cubes)
  const neonStrip = engine.addEntity();
  Transform.create(neonStrip, {
    position: Vector3.create(8, 5.8, 8),
    scale: Vector3.create(14, 0.1, 14),
  });
  MeshRenderer.setBox(neonStrip);
  Material.setPbrMaterial(neonStrip, {
    albedoColor: Color4.create(0, 0, 0, 1),
    emissiveColor: Color4.create(0.5, 0.2, 0.9, 1),
    emissiveIntensity: 5,
  });
}
//# sourceMappingURL=architecture.js.map
