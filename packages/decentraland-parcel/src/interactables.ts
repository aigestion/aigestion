import { Entity, InputAction, Material, MeshRenderer, TextShape, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'

let bodyTextEntity: Entity

export function createInteractables() {
    // Main Info Board
    const infoBoard = engine.addEntity()
    Transform.create(infoBoard, {
        position: Vector3.create(8, 2.5, 15.5),
        scale: Vector3.create(6, 3, 0.1)
    })
    MeshRenderer.setBox(infoBoard)
    Material.setPbrMaterial(infoBoard, {
        albedoColor: Color4.Black(),
        roughness: 0.2,
        metallic: 0.8
    })

    const titleText = engine.addEntity()
    Transform.create(titleText, {
        parent: infoBoard,
        position: Vector3.create(0, 0.3, -0.6), // Relative to parent
        scale: Vector3.create(0.16, 0.33, 1) // Inverse parent scale compensation
    })
    TextShape.create(titleText, {
        text: "AIGestion HQ",
        textColor: Color4.create(0.8, 0.5, 1, 1),
        fontSize: 5,
        textAlign: 3 // Center
    })

    // Dynamic Body Text
    bodyTextEntity = engine.addEntity()
    Transform.create(bodyTextEntity, {
        parent: infoBoard,
        position: Vector3.create(0, -0.2, -0.6),
        scale: Vector3.create(0.16, 0.33, 1)
    })
    TextShape.create(bodyTextEntity, {
        text: "Initializing System Link...",
        textColor: Color4.White(),
        fontSize: 3,
        textAlign: 3
    })

    // Interactive Cube (Simulated Link)
    const linkCube = engine.addEntity()
    Transform.create(linkCube, {
        position: Vector3.create(12, 1, 12),
        scale: Vector3.create(1, 1, 1)
    })
    MeshRenderer.setBox(linkCube)
    Material.setPbrMaterial(linkCube, {
        albedoColor: Color4.Red(),
        emissiveColor: Color4.Red(),
        emissiveIntensity: 1
    })

    // Add interaction
    pointerEventsSystem.onPointerDown(
        {
            entity: linkCube,
            opts: { button: InputAction.IA_POINTER, hoverText: 'Access Dashboard' }
        },
        () => {
            console.log("Opening dashboard link logic would go here")
        }
    )
}

export function updateDashboard(stats: { activeUsers: number, systemHealth: string, cpuLoad: number }) {
    if (!bodyTextEntity) return

    const color = stats.systemHealth === 'OPTIMAL' ? Color4.Green() : Color4.Yellow()

    TextShape.getMutable(bodyTextEntity).text =
        `Active Users: ${stats.activeUsers}\n` +
        `System Status: ${stats.systemHealth}\n` +
        `CPU Load: ${stats.cpuLoad}%`

    TextShape.getMutable(bodyTextEntity).textColor = color
}
