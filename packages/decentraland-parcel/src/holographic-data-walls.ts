```typescript
// Holographic Data Visualization Walls for AIGestion Virtual Office
import { engine, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { setTimeout, setInterval } from './utils/timers'
import { Color3, Color4, Vector3 } from '@dcl/sdk/math'

interface DataPoint {
  label: string
  value: number
  color: Color3
  timestamp: number
}

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap'
  title: string
  data: DataPoint[]
  maxDataPoints: number
  updateInterval: number
}

export class HolographicDataWall {
  private entity: any
  private charts: Map<string, ChartConfig> = new Map()
  private visualElements: any[] = []
  private animationTime: number = 0
  private isActive: boolean = true

  constructor(position: Vector3, scale: Vector3) {
    this.createWall(position, scale)
    this.startAnimation()
  }

  private createWall(position: Vector3, scale: Vector3) {
    // Main wall structure
    this.entity = engine.addEntity()
    Transform.create(this.entity, {
      position: position,
      scale: scale
    })
    MeshRenderer.setBox(this.entity)
    Material.setPbrMaterial(this.entity, {
      albedoColor: Color4.create(0.05, 0.05, 0.1, 0.9),
      roughness: 0.1,
      metallic: 0.8,
      emissiveColor: Color4.create(0.1, 0.1, 0.3, 0.5),
      emissiveIntensity: 2
    })

    // Create grid overlay
    this.createGridOverlay()

    // Create title
    this.createTitle()
  }

  private createGridOverlay() {
    const gridSize = 10
    const gridSpacing = 1.6

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const gridCell = engine.addEntity()
        Transform.create(gridCell, {
          parent: this.entity,
          position: Vector3.create(
            -7.5 + x * gridSpacing,
            -3.5 + y * gridSpacing,
            0.1
          ),
          scale: Vector3.create(1.5, 1.5, 0.05)
        })
        MeshRenderer.setBox(gridCell)
        Material.setPbrMaterial(gridCell, {
          albedoColor: Color4.create(0.2, 0.3, 0.5, 0.3),
          emissiveColor: Color4.create(0.1, 0.2, 0.4, 0.5),
          emissiveIntensity: 1
        })
        this.visualElements.push(gridCell)
      }
    }
  }

  private createTitle() {
    const titleEntity = engine.addEntity()
    Transform.create(titleEntity, {
      parent: this.entity,
      position: Vector3.create(0, 4.5, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(titleEntity, {
      text: '📊 HOLOGRAPHIC DATA VISUALIZATION',
      textColor: Color4.create(0.5, 0.8, 1, 1),
      fontSize: 4,
      textAlign: 3,
      outlineWidth: 0.1,
      outlineColor: Color4.create(0, 0, 0, 1)
    })
    this.visualElements.push(titleEntity)
  }

  // Add a new chart to the wall
  public addChart(id: string, config: ChartConfig) {
    this.charts.set(id, config)
    this.renderChart(id)

    // Start real-time updates
    if (config.updateInterval > 0) {
      setInterval(() => {
        this.updateChart(id)
      }, config.updateInterval)
    }
  }

  private renderChart(chartId: string) {
    const chart = this.charts.get(chartId)
    if (!chart) return

    switch (chart.type) {
      case 'bar':
        this.renderBarChart(chartId, chart)
        break
      case 'line':
        this.renderLineChart(chartId, chart)
        break
      case 'pie':
        this.renderPieChart(chartId, chart)
        break
      case 'scatter':
        this.renderScatterChart(chartId, chart)
        break
      case 'heatmap':
        this.renderHeatmap(chartId, chart)
        break
    }
  }

  private renderBarChart(chartId: string, config: ChartConfig) {
    const barWidth = 1.2
    const maxHeight = 3
    const spacing = 1.5
    const startX = -6

    config.data.forEach((point, index) => {
      const bar = engine.addEntity()
      const height = (point.value / 100) * maxHeight

      Transform.create(bar, {
        parent: this.entity,
        position: Vector3.create(
          startX + index * spacing,
          -2 + height / 2,
          0.2
        ),
        scale: Vector3.create(barWidth, height, 0.3)
      })
      MeshRenderer.setBox(bar)
      Material.setPbrMaterial(bar, {
        albedoColor: Color4.create(point.color.r, point.color.g, point.color.b, 0.8),
        emissiveColor: Color4.create(point.color.r, point.color.g, point.color.b, 0.6),
        emissiveIntensity: 2
      })

      // Add label
      const label = engine.addEntity()
      Transform.create(label, {
        parent: this.entity,
        position: Vector3.create(
          startX + index * spacing,
          -3.5,
          0.3
        ),
        scale: Vector3.create(0.2, 0.2, 0.2)
      })
      TextShape.create(label, {
        text: point.label,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      })

      this.visualElements.push(bar, label)
    })
  }

  private renderLineChart(chartId: string, config: ChartConfig) {
    const points: Vector3[] = []
    const spacing = 1.2
    const startX = -6

    config.data.forEach((point, index) => {
      const x = startX + index * spacing
      const y = -2 + (point.value / 100) * 3
      points.push(Vector3.create(x, y, 0.2))

      // Create data point
      const dataPoint = engine.addEntity()
      Transform.create(dataPoint, {
        parent: this.entity,
        position: Vector3.create(x, y, 0.2),
        scale: Vector3.create(0.2, 0.2, 0.2)
      })
      MeshRenderer.setSphere(dataPoint)
      Material.setPbrMaterial(dataPoint, {
        albedoColor: Color4.create(point.color.r, point.color.g, point.color.b, 1),
        emissiveColor: Color4.create(point.color.r, point.color.g, point.color.b, 0.8),
        emissiveIntensity: 3
      })
      this.visualElements.push(dataPoint)
    })

    // Create connecting lines
    for (let i = 0; i < points.length - 1; i++) {
      const line = engine.addEntity()
      const start = points[i]
      const end = points[i + 1]
      const distance = Vector3.distance(start, end)
      const midpoint = Vector3.lerp(start, end, 0.5)

      Transform.create(line, {
        parent: this.entity,
        position: Vector3.create(midpoint.x, midpoint.y, 0.15),
        scale: Vector3.create(0.05, distance, 0.1)
      })

      MeshRenderer.setBox(line)
      Material.setPbrMaterial(line, {
        albedoColor: Color4.create(0.5, 0.8, 1, 0.8),
        emissiveColor: Color4.create(0.5, 0.8, 1, 0.6),
        emissiveIntensity: 2
      })
      this.visualElements.push(line)
    }
  }

  private renderPieChart(chartId: string, config: ChartConfig) {
    const total = config.data.reduce((sum, point) => sum + point.value, 0)
    let currentAngle = 0

    config.data.forEach((point, index) => {
      const percentage = point.value / total
      const angle = percentage * 360

      // Create pie slice (simplified as box)
      const slice = engine.addEntity()
      Transform.create(slice, {
        parent: this.entity,
        position: Vector3.create(
          Math.cos(currentAngle * Math.PI / 180) * 2,
          Math.sin(currentAngle * Math.PI / 180) * 2,
          0.2
        ),
        scale: Vector3.create(1.5, 1.5, 0.3)
      })
      MeshRenderer.setBox(slice)
      Material.setPbrMaterial(slice, {
        albedoColor: Color4.create(point.color.r, point.color.g, point.color.b, 0.8),
        emissiveColor: Color4.create(point.color.r, point.color.g, point.color.b, 0.6),
        emissiveIntensity: 2
      })
      this.visualElements.push(slice)

      currentAngle += angle
    })
  }

  private renderScatterChart(chartId: string, config: ChartConfig) {
    config.data.forEach((point, index) => {
      const scatterPoint = engine.addEntity()
      Transform.create(scatterPoint, {
        parent: this.entity,
        position: Vector3.create(
          -6 + (index / config.data.length) * 12,
          -2 + (point.value / 100) * 3,
          0.2
        ),
        scale: Vector3.create(0.3, 0.3, 0.3)
      })
      MeshRenderer.setSphere(scatterPoint)
      Material.setPbrMaterial(scatterPoint, {
        albedoColor: Color4.create(point.color.r, point.color.g, point.color.b, 0.9),
        emissiveColor: Color4.create(point.color.r, point.color.g, point.color.b, 0.7),
        emissiveIntensity: 3
      })
      this.visualElements.push(scatterPoint)
    })
  }

  private renderHeatmap(chartId: string, config: ChartConfig) {
    const gridSize = 8
    const cellSize = 1.5

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const dataIndex = (x * gridSize + y) % config.data.length
        const point = config.data[dataIndex]

        const heatCell = engine.addEntity()
        Transform.create(heatCell, {
          parent: this.entity,
          position: Vector3.create(
            -6 + x * cellSize,
            -2 + y * cellSize,
            0.2
          ),
          scale: Vector3.create(cellSize * 0.8, cellSize * 0.8, 0.2)
        })
        MeshRenderer.setBox(heatCell)

        const intensity = point.value / 100
        Material.setPbrMaterial(heatCell, {
          albedoColor: Color4.create(
            point.color.r * intensity,
            point.color.g * intensity,
            point.color.b * intensity,
            0.8
          ),
          emissiveColor: Color4.create(
            point.color.r * intensity,
            point.color.g * intensity,
            point.color.b * intensity,
            0.6
          ),
          emissiveIntensity: intensity * 3
        })
        this.visualElements.push(heatCell)
      }
    }
  }

  private updateChart(chartId: string) {
    const chart = this.charts.get(chartId)
    if (!chart) return

    // Add new data point
    const newPoint: DataPoint = {
      label: 'T' + (Date.now() % 1000),
      value: Math.random() * 100,
      color: Color3.create(Math.random(), Math.random(), Math.random()),
      timestamp: Date.now()
    }

    chart.data.push(newPoint)

    // Limit data points
    if (chart.data.length > chart.maxDataPoints) {
      chart.data.shift()
    }

    // Clear and re-render
    this.clearChart(chartId)
    this.renderChart(chartId)
  }

  private clearChart(chartId: string) {
    // Remove visual elements for this chart
    // In a real implementation, we'd track which elements belong to which chart
    const elementsToRemove = this.visualElements.splice(20) // Keep basic structure
    elementsToRemove.forEach(element => {
      engine.removeEntity(element)
    })
  }

  private startAnimation() {
    engine.addSystem(() => {
      if (!this.isActive) return

      this.animationTime += 0.016

      // Animate grid cells
      this.visualElements.forEach((element, index) => {
        if (index % 3 === 0) { // Animate every 3rd element
          const material = Material.getMutable(element)
          if (material && material.$case === 'pbr') {
            const pulse = Math.sin(this.animationTime * 2 + index * 0.1) * 0.3 + 0.7
            material.pbr.emissiveIntensity = pulse * 2
          }
        }
      })
    })
  }

  // Real-time data streaming
  public startDataStream(chartId: string, dataSource: () => DataPoint) {
    setInterval(() => {
      const chart = this.charts.get(chartId)
      if (chart) {
        const newDataPoint = dataSource()
        chart.data.push(newDataPoint)

        if (chart.data.length > chart.maxDataPoints) {
          chart.data.shift()
        }

        this.clearChart(chartId)
        this.renderChart(chartId)
      }
    }, 1000)
  }

  // Interactive features
  public setInteractive(enabled: boolean) {
    this.isActive = enabled
  }

  // Cleanup
  public cleanup() {
    this.visualElements.forEach(element => {
      engine.removeEntity(element)
    })
    this.visualElements = []
    this.charts.clear()
  }
}

// Data Visualization Manager
export class DataVisualizationManager {
  private walls: Map<string, HolographicDataWall> = new Map()

  createWall(id: string, position: Vector3, scale: Vector3): HolographicDataWall {
    const wall = new HolographicDataWall(position, scale)
    this.walls.set(id, wall)
    return wall
  }

  getWall(id: string): HolographicDataWall | undefined {
    return this.walls.get(id)
  }

  // Pre-configured data sources
  static createSystemStatusData(): DataPoint[] {
    return [
      { label: 'CPU', value: 65, color: Color3.create(0.2, 0.8, 0.2), timestamp: Date.now() },
      { label: 'Memory', value: 78, color: Color3.create(0.8, 0.6, 0.2), timestamp: Date.now() },
      { label: 'Network', value: 45, color: Color3.create(0.2, 0.6, 0.8), timestamp: Date.now() },
      { label: 'Storage', value: 32, color: Color3.create(0.8, 0.2, 0.6), timestamp: Date.now() },
      { label: 'Quantum', value: 89, color: Color3.create(0.6, 0.2, 0.8), timestamp: Date.now() }
    ]
  }

  static createRealtimeDataSource(): () => DataPoint {
    let counter = 0
    return () => ({
      label: 'Data' + (counter++),
      value: Math.random() * 100,
      color: Color3.create(Math.random(), Math.random(), Math.random()),
      timestamp: Date.now()
    })
  }

  cleanup() {
    this.walls.forEach(wall => wall.cleanup())
    this.walls.clear()
  }
}

// Export singleton instance
export const dataVizManager = new DataVisualizationManager()
