import { engine, Transform, MeshRenderer, Material } from '@dcl/sdk/ecs'
import { Vector3, Color4 } from '@dcl/sdk/math'
import { createArchitecture } from './architecture'
import { createInteractables } from './interactables'

// Initialize scene components
export function main() {
    // DEBUG CUBE
    const debugCube = engine.addEntity()
    Transform.create(debugCube, {
        position: Vector3.create(8, 2, 8),
        scale: Vector3.create(2, 2, 2)
    })
    MeshRenderer.setBox(debugCube)
    Material.setPbrMaterial(debugCube, { albedoColor: Color4.Red() })

    createArchitecture()
    createInteractables()
}

main()
