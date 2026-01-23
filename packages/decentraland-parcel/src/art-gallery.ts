import { engine, Material, MeshRenderer, TextShape, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'

export function createArtGallery() {
  // Gallery floor (second level)
  const galleryFloor = engine.addEntity()
  Transform.create(galleryFloor, {
    position: Vector3.create(8, 7, 8),
    scale: Vector3.create(16, 0.1, 16)
  })
  MeshRenderer.setBox(galleryFloor)
  Material.setPbrMaterial(galleryFloor, {
    albedoColor: Color4.create(0.15, 0.1, 0.2, 1),
    roughness: 0.1,
    metallic: 0.7,
    emissiveColor: Color4.create(0.2, 0.1, 0.3, 0.3),
    emissiveIntensity: 2
  })

  // God level ceiling
  const godCeiling = engine.addEntity()
  Transform.create(godCeiling, {
    position: Vector3.create(8, 10, 8),
    scale: Vector3.create(16, 0.1, 16)
  })
  MeshRenderer.setBox(godCeiling)
  Material.setPbrMaterial(godCeiling, {
    albedoColor: Color4.create(0.05, 0.05, 0.1, 1),
    roughness: 0.05,
    metallic: 0.9,
    emissiveColor: Color4.create(0.3, 0.2, 0.6, 0.5),
    emissiveIntensity: 4
  })

  // Art pieces
  createArtPieces()
  createGodLevelSpace()
}

function createArtPieces() {
  const artworks = [
    { pos: Vector3.create(4, 7.5, 8), color: Color4.create(0.8, 0.3, 1, 1), title: "Quantum Dreams" },
    { pos: Vector3.create(8, 7.5, 8), color: Color4.create(0.2, 0.8, 1, 1), title: "Digital Nirvana" },
    { pos: Vector3.create(12, 7.5, 8), color: Color4.create(1, 0.6, 0.2, 1), title: "Cosmic Consciousness" }
  ]

  artworks.forEach((art) => {
    const frame = engine.addEntity()
    Transform.create(frame, {
      position: art.pos,
      scale: Vector3.create(2, 3, 0.2)
    })
    MeshRenderer.setBox(frame)
    Material.setPbrMaterial(frame, {
      albedoColor: art.color,
      roughness: 0.1,
      metallic: 0.2,
      emissiveColor: art.color,
      emissiveIntensity: 3
    })

    const label = engine.addEntity()
    Transform.create(label, {
      position: Vector3.create(art.pos.x, art.pos.y - 2, art.pos.z + 0.2),
      scale: Vector3.create(0.1, 0.1, 0.1)
    })
    TextShape.create(label, {
      text: art.title,
      textColor: Color4.White(),
      fontSize: 2
    })
  })
}

function createGodLevelSpace() {
  // Meditation platform
  const platform = engine.addEntity()
  Transform.create(platform, {
    position: Vector3.create(8, 9.5, 8),
    scale: Vector3.create(6, 0.2, 6)
  })
  MeshRenderer.setBox(platform)
  Material.setPbrMaterial(platform, {
    albedoColor: Color4.create(0.1, 0.05, 0.15, 1),
    roughness: 0.05,
    metallic: 0.8,
    emissiveColor: Color4.create(0.4, 0.2, 0.8, 0.6),
    emissiveIntensity: 5
  })

  // Floating orbs
  for (let i = 0; i < 8; i++) {
    const orb = engine.addEntity()
    Transform.create(orb, {
      position: Vector3.create(
        5 + Math.random() * 6,
        9 + Math.random() * 0.5,
        5 + Math.random() * 6
      ),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    MeshRenderer.setBox(orb)
    Material.setPbrMaterial(orb, {
      albedoColor: Color4.create(1, 1, 1, 0.8),
      roughness: 0.0,
      metallic: 1.0,
      emissiveColor: Color4.create(1, 0.8, 0.3, 1),
      emissiveIntensity: 8
    })
  }

  // God level sign
  const godSign = engine.addEntity()
  Transform.create(godSign, {
    position: Vector3.create(8, 9.8, 11),
    scale: Vector3.create(0.1, 0.1, 0.1)
  })
  TextShape.create(godSign, {
    text: "🌟 GOD LEVEL 🌟\nMeditation Space",
    textColor: Color4.create(1, 0.8, 0.3, 1),
    fontSize: 4
  })
}
