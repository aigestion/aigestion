// Advanced Lighting System for AIGestion Virtual Office (DCL Compatible)
import { engine, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Color3, Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

export class AdvancedLightingSystem {
  private lights: Map<string, any> = new Map()
  private timeOfDay: number = 0
  private shadowCasters: any[] = []
  private volumetricLights: any[] = []

  // Initialize advanced lighting
  initialize() {
    console.log('💡 Advanced Lighting System Initializing...')

    this.createGlobalIllumination()
    this.createDynamicShadows()
    this.createVolumetricLighting()
    this.createHDRSystem()
    this.startDayNightCycle()

    console.log('💡 Advanced Lighting System Ready!')
  }

  // Create global illumination system
  private createGlobalIllumination() {
    // Create simulated sunlight with emissive materials
    const sunLight = engine.addEntity()
    Transform.create(sunLight, {
      position: Vector3.create(8, 20, 8),
      scale: Vector3.create(2, 2, 2)
    })
    MeshRenderer.setBox(sunLight)
    Material.setPbrMaterial(sunLight, {
      albedoColor: Color4.create(1, 0.95, 0.8, 0.8),
      emissiveColor: Color4.create(1, 0.95, 0.8, 1),
      emissiveIntensity: 2
    })

    this.lights.set('sun', sunLight)

    // Ambient light simulation with large emissive sphere
    const ambientLight = engine.addEntity()
    Transform.create(ambientLight, {
      position: Vector3.create(8, 15, 8),
      scale: Vector3.create(30, 30, 30)
    })
    MeshRenderer.setSphere(ambientLight)
    Material.setPbrMaterial(ambientLight, {
      albedoColor: Color4.create(0.4, 0.45, 0.5, 0.1),
      emissiveColor: Color4.create(0.4, 0.45, 0.5, 0.3),
      emissiveIntensity: 0.5
    })

    this.lights.set('ambient', ambientLight)
  }

  // Create dynamic shadow system
  private createDynamicShadows() {
    // Create shadow casters for major objects
    const shadowCasterPositions = [
      { pos: Vector3.create(8, 0, 8), scale: Vector3.create(16, 0.1, 16) }, // Floor
      { pos: Vector3.create(8, 3, 15.9), scale: Vector3.create(16, 6, 0.2) }, // Back wall
      { pos: Vector3.create(2, 3, 0.5), scale: Vector3.create(1.2, 6, 1.2) }, // Pillar 1
      { pos: Vector3.create(14, 3, 0.5), scale: Vector3.create(1.2, 6, 1.2) }  // Pillar 2
    ]

    shadowCasterPositions.forEach((config, index) => {
      const shadowCaster = engine.addEntity()
      Transform.create(shadowCaster, {
        position: config.pos,
        scale: config.scale
      })
      MeshRenderer.setBox(shadowCaster)

      // Shadow material with proper DCL properties
      Material.setPbrMaterial(shadowCaster, {
        alphaTest: 0.01,
        castShadows: true,
        receiveShadows: true
      })

      this.shadowCasters.push(shadowCaster)
    })
  }

  // Create volumetric lighting effects
  private createVolumetricLighting() {
    // Create volumetric light beams
    const beamPositions = [
      Vector3.create(2, 6, 2),
      Vector3.create(14, 6, 2),
      Vector3.create(8, 6, 8),
      Vector3.create(2, 6, 14),
      Vector3.create(14, 6, 14)
    ]

    beamPositions.forEach((pos, index) => {
      const volumetricLight = engine.addEntity()
      Transform.create(volumetricLight, {
        position: pos,
        scale: Vector3.create(0.3, 8, 0.3)
      })
      MeshRenderer.setBox(volumetricLight)

      // Volumetric material with glow
      Material.setPbrMaterial(volumetricLight, {
        albedoColor: Color4.create(0.8, 0.9, 1, 0.3),
        emissiveColor: Color4.create(0.6, 0.7, 1, 0.8),
        emissiveIntensity: 5,
        alphaTest: 0.01
      })

      this.volumetricLights.push(volumetricLight)
    })
  }

  // Create HDR tone mapping system
  private createHDRSystem() {
    // Create HDR exposure zones
    const exposureZones = [
      { pos: Vector3.create(8, 2, 8), intensity: 1.0, color: Color3.create(1, 1, 1) }, // Center
      { pos: Vector3.create(2, 2, 2), intensity: 0.8, color: Color3.create(0.8, 0.9, 1) }, // Corner 1
      { pos: Vector3.create(14, 2, 2), intensity: 0.8, color: Color3.create(0.8, 0.9, 1) }, // Corner 2
      { pos: Vector3.create(2, 2, 14), intensity: 0.8, color: Color3.create(0.8, 0.9, 1) }, // Corner 3
      { pos: Vector3.create(14, 2, 14), intensity: 0.8, color: Color3.create(0.8, 0.9, 1) }  // Corner 4
    ]

    exposureZones.forEach((zone, index) => {
      const exposureLight = engine.addEntity()
      Transform.create(exposureLight, {
        position: zone.pos,
        scale: Vector3.create(4, 4, 4)
      })
      MeshRenderer.setSphere(exposureLight)

      Material.setPbrMaterial(exposureLight, {
        albedoColor: Color4.create(zone.color.r, zone.color.g, zone.color.b, 0.2),
        emissiveColor: Color4.create(zone.color.r, zone.color.g, zone.color.b, 0.6),
        emissiveIntensity: zone.intensity
      })

      this.lights.set(`exposure_${index}`, exposureLight)
    })
  }

  // Start day/night cycle
  private startDayNightCycle() {
    // Update lighting every 100ms for smooth transitions
    engine.addSystem(() => {
      this.timeOfDay += 0.001
      this.updateDayNightCycle()
      this.updateVolumetricLights()
    })
  }

  // Update day/night cycle lighting
  private updateDayNightCycle() {
    const sunLight = this.lights.get('sun')
    const ambientLight = this.lights.get('ambient')

    if (sunLight && ambientLight) {
      // Calculate sun position based on time
      const sunAngle = this.timeOfDay * Math.PI * 2
      const sunHeight = Math.sin(sunAngle)
      const sunIntensity = Math.max(0, sunHeight)

      // Update sun position
      const sunTransform = Transform.getMutable(sunLight)
      sunTransform.rotation = Quaternion.fromEulerDegrees(
        sunAngle * 180 / Math.PI - 90,
        0,
        0
      )

      // Update sun material
      const sunMaterial = Material.getMutable(sunLight)
      if (sunMaterial && sunMaterial.$case === 'pbr') {
        sunMaterial.pbr.emissiveIntensity = sunIntensity * 2

        // Update sun color based on time
        if (sunIntensity > 0.5) {
          // Day time - warm white
          sunMaterial.pbr.albedoColor = Color4.create(1, 0.95, 0.8, 0.8)
          sunMaterial.pbr.emissiveColor = Color4.create(1, 0.95, 0.8, 1)
        } else if (sunIntensity > 0.1) {
          // Sunrise/sunset - orange
          sunMaterial.pbr.albedoColor = Color4.create(1, 0.7, 0.4, 0.8)
          sunMaterial.pbr.emissiveColor = Color4.create(1, 0.7, 0.4, 1)
        } else {
          // Night - cool blue
          sunMaterial.pbr.albedoColor = Color4.create(0.2, 0.3, 0.6, 0.8)
          sunMaterial.pbr.emissiveColor = Color4.create(0.2, 0.3, 0.6, 1)
        }
      }

      // Update ambient light
      const ambientMaterial = Material.getMutable(ambientLight)
      if (ambientMaterial && ambientMaterial.$case === 'pbr') {
        ambientMaterial.pbr.emissiveIntensity = 0.3 + sunIntensity * 0.2

        if (sunIntensity < 0.1) {
          ambientMaterial.pbr.albedoColor = Color4.create(0.1, 0.15, 0.3, 0.1)
          ambientMaterial.pbr.emissiveColor = Color4.create(0.1, 0.15, 0.3, 0.3)
        } else {
          ambientMaterial.pbr.albedoColor = Color4.create(0.4, 0.45, 0.5, 0.1)
          ambientMaterial.pbr.emissiveColor = Color4.create(0.4, 0.45, 0.5, 0.3)
        }
      }
    }
  }

  // Update volumetric lights with pulsing effect
  private updateVolumetricLights() {
    this.volumetricLights.forEach((light, index) => {
      const time = this.timeOfDay * 2 + index * 0.5
      const pulse = Math.sin(time) * 0.3 + 0.7

      // Update material glow
      const material = Material.getMutable(light)
      if (material && material.$case === 'pbr') {
        material.pbr.emissiveIntensity = pulse * 5
      }
    })
  }

  // Create dynamic spotlight for events
  createEventSpotlight(position: Vector3, color: Color3 = Color3.create(1, 1, 1)) {
    const spotlight = engine.addEntity()
    Transform.create(spotlight, {
      position: Vector3.create(position.x, position.y + 5, position.z),
      rotation: Quaternion.fromEulerDegrees(90, 0, 0),
      scale: Vector3.create(2, 8, 2)
    })
    MeshRenderer.setCylinder(spotlight)

    Material.setPbrMaterial(spotlight, {
      albedoColor: Color4.create(color.r, color.g, color.b, 0.3),
      emissiveColor: Color4.create(color.r, color.g, color.b, 0.8),
      emissiveIntensity: 3
    })

    // Auto-remove after 5 seconds
    setTimeout(() => {
      engine.removeEntity(spotlight)
    }, 5000)

    return spotlight
  }

  // Create emergency lighting
  createEmergencyLighting() {
    const emergencyPositions = [
      Vector3.create(1, 4, 1),
      Vector3.create(15, 4, 1),
      Vector3.create(1, 4, 15),
      Vector3.create(15, 4, 15)
    ]

    emergencyPositions.forEach(pos => {
      const emergencyLight = engine.addEntity()
      Transform.create(emergencyLight, {
        position: pos,
        scale: Vector3.create(1, 1, 1)
      })
      MeshRenderer.setBox(emergencyLight)

      Material.setPbrMaterial(emergencyLight, {
        albedoColor: Color4.create(1, 0.2, 0.2, 0.8),
        emissiveColor: Color4.create(1, 0.2, 0.2, 1),
        emissiveIntensity: 4
      })

      // Pulsing emergency effect
      engine.addSystem(() => {
        const time = Date.now() / 200
        const pulse = Math.sin(time) > 0 ? 1 : 0.2
        const material = Material.getMutable(emergencyLight)
        if (material && material.$case === 'pbr') {
          material.pbr.emissiveIntensity = pulse * 4
        }
      })
    })
  }

  // Cleanup lighting system
  cleanup() {
    this.lights.forEach(light => {
      engine.removeEntity(light)
    })
    this.shadowCasters.forEach(caster => {
      engine.removeEntity(caster)
    })
    this.volumetricLights.forEach(light => {
      engine.removeEntity(light)
    })

    this.lights.clear()
    this.shadowCasters = []
    this.volumetricLights = []
  }
}

// Export singleton instance
export const lightingSystem = new AdvancedLightingSystem()
