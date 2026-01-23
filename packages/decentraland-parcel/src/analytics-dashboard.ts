// Advanced Analytics Dashboard for AIGestion Virtual Office
import { engine, InputAction, Material, MeshRenderer, pointerEventsSystem, Transform } from '@dcl/sdk/ecs'
import { Color3, Color4, Vector3 } from '@dcl/sdk/math'
import { soundSystem } from './enhanced-sound'

interface AnalyticsData {
  id: string
  timestamp: number
  category: AnalyticsCategory
  metrics: Map<string, number>
  dimensions: Map<string, string>
  events: AnalyticsEvent[]
  kpis: KPIData[]
}

interface AnalyticsEvent {
  id: string
  name: string
  category: string
  timestamp: number
  userId: string
  sessionId: string
  properties: Map<string, any>
  value?: number
}

interface KPIData {
  id: string
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
  status: 'good' | 'warning' | 'critical'
}

interface DashboardWidget {
  id: string
  type: WidgetType
  title: string
  position: Vector3
  size: Vector3
  dataSource: string
  refreshInterval: number
  config: WidgetConfig
  isVisible: boolean
}

type WidgetType = 'chart' | 'metric' | 'table' | 'heatmap' | 'gauge' | 'funnel' | 'realtime' | 'comparison'
type AnalyticsCategory = 'user_behavior' | 'system_performance' | 'business_metrics' | 'engagement' | 'conversion' | 'retention'

interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'area'
  timeRange?: 'hour' | 'day' | 'week' | 'month'
  filters?: Map<string, any>
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min'
  colors?: Color3[]
  showLegend?: boolean
  showGrid?: boolean
}

interface Report {
  id: string
  name: string
  description: string
  category: AnalyticsCategory
  widgets: string[]
  schedule: ReportSchedule
  recipients: string[]
  format: 'pdf' | 'html' | 'json' | 'csv'
  isTemplate: boolean
}

interface ReportSchedule {
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  enabled: boolean
  nextRun: number
  timezone: string
}

export class AnalyticsDashboardSystem {
  private analyticsData: Map<string, AnalyticsData> = new Map()
  private widgets: Map<string, DashboardWidget> = new Map()
  private reports: Map<string, Report> = new Map()
  private dashboardUI: any
  private isInitialized: boolean = false
  private realTimeData: AnalyticsEvent[] = []
  private maxRealTimeEvents: number = 1000
  private dataRetentionDays: number = 30
  private refreshInterval: number = 5000 // 5 seconds

  constructor() {
    this.initializeDataSources()
  }

  // Initialize analytics dashboard system
  initialize() {
    console.log('📊 Analytics Dashboard System Initializing...')

    this.createDashboardUI()
    this.createDefaultWidgets()
    this.createDefaultReports()
    this.startAnalyticsEngine()
    this.generateSampleData()

    this.isInitialized = true
    console.log('📊 Analytics Dashboard System Ready!')
  }

  // Initialize data sources
  private initializeDataSources() {
    console.log('📡 Initializing analytics data sources...')
    // In real implementation, this would connect to actual data sources
  }

  // Create dashboard UI
  private createDashboardUI() {
    this.dashboardUI = engine.addEntity()
    Transform.create(this.dashboardUI, {
      position: Vector3.create(8, 4, 2),
      scale: Vector3.create(6, 4, 0.1)
    })
    MeshRenderer.setBox(this.dashboardUI)
    Material.setPbrMaterial(this.dashboardUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    })

    const title = engine.addEntity()
    Transform.create(title, {
      parent: this.dashboardUI,
      position: Vector3.create(0, 1.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(title, {
      text: '📊 ANALYTICS DASHBOARD',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    })

    // Create widget containers
    this.createWidgetContainers()

    // Create control panel
    this.createControlPanel()

    // Create status bar
    this.createStatusBar()
  }

  // Create widget containers
  private createWidgetContainers() {
    // Main chart area
    const mainChart = engine.addEntity()
    Transform.create(mainChart, {
      parent: this.dashboardUI,
      position: Vector3.create(-1.5, 0.5, 0.1),
      scale: Vector3.create(2.5, 1.5, 0.1)
    })
    MeshRenderer.setBox(mainChart)
    Material.setPbrMaterial(mainChart, {
      albedoColor: Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    })

    // KPI cards area
    const kpiArea = engine.addEntity()
    Transform.create(kpiArea, {
      parent: this.dashboardUI,
      position: Vector3.create(1.5, 0.5, 0.1),
      scale: Vector3.create(2.5, 1.5, 0.1)
    })
    MeshRenderer.setBox(kpiArea)
    Material.setPbrMaterial(kpiArea, {
      albedoColor: Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    })

    // Real-time metrics
    const realtimeArea = engine.addEntity()
    Transform.create(realtimeArea, {
      parent: this.dashboardUI,
      position: Vector3.create(0, -0.8, 0.1),
      scale: Vector3.create(5, 0.8, 0.1)
    })
    MeshRenderer.setBox(realtimeArea)
    Material.setPbrMaterial(realtimeArea, {
      albedoColor: Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    })
  }

  // Create control panel
  private createControlPanel() {
    const controls = [
      { id: 'refresh', icon: '🔄', name: 'Refresh Data' },
      { id: 'export', icon: '📤', name: 'Export Report' },
      { id: 'settings', icon: '⚙️', name: 'Settings' },
      { id: 'fullscreen', icon: '🔍', name: 'Fullscreen' }
    ]

    let xOffset = -1.5

    controls.forEach(control => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.dashboardUI,
        position: Vector3.create(xOffset, -1.5, 0.1),
        scale: Vector3.create(0.3, 0.3, 0.1)
      })
      MeshRenderer.setBox(button)
      Material.setPbrMaterial(button, {
        albedoColor: Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      })

      const buttonText = engine.addEntity()
      Transform.create(buttonText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5)
      })
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      })

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleControl(control.id)
      )

      xOffset += 0.8
    })
  }

  // Create status bar
  private createStatusBar() {
    const statusBar = engine.addEntity()
    Transform.create(statusBar, {
      parent: this.dashboardUI,
      position: Vector3.create(0, -1.9, 0.1),
      scale: Vector3.create(5.5, 0.2, 0.1)
    })
    MeshRenderer.setBox(statusBar)
    Material.setPbrMaterial(statusBar, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    })

    const statusText = engine.addEntity()
    Transform.create(statusText, {
      parent: statusBar,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(statusText, {
      text: '📊 Last Update: Just Now | Events: 0',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.2,
      textAlign: 3
    })
  }

  // Create default widgets
  private createDefaultWidgets() {
    // User activity chart
    const userActivityChart: DashboardWidget = {
      id: 'widget_user_activity',
      type: 'chart',
      title: 'User Activity',
      position: Vector3.create(-1.5, 0.5, 0.1),
      size: Vector3.create(2.5, 1.5, 0.1),
      dataSource: 'user_behavior',
      refreshInterval: 10000,
      config: {
        chartType: 'line',
        timeRange: 'day',
        aggregation: 'count',
        colors: [Color3.create(0.2, 0.6, 1), Color3.create(1, 0.6, 0.2)],
        showLegend: true,
        showGrid: true
      },
      isVisible: true
    }

    // System performance gauge
    const systemPerformanceGauge: DashboardWidget = {
      id: 'widget_system_performance',
      type: 'gauge',
      title: 'System Performance',
      position: Vector3.create(1.5, 0.8, 0.1),
      size: Vector3.create(1, 0.6, 0.1),
      dataSource: 'system_performance',
      refreshInterval: 5000,
      config: {
        timeRange: 'hour',
        aggregation: 'avg'
      },
      isVisible: true
    }

    // Business metrics
    const businessMetrics: DashboardWidget = {
      id: 'widget_business_metrics',
      type: 'metric',
      title: 'Business Metrics',
      position: Vector3.create(1.5, 0.2, 0.1),
      size: Vector3.create(2.5, 0.6, 0.1),
      dataSource: 'business_metrics',
      refreshInterval: 15000,
      config: {
        timeRange: 'week',
        aggregation: 'sum'
      },
      isVisible: true
    }

    // Real-time events
    const realtimeEvents: DashboardWidget = {
      id: 'widget_realtime_events',
      type: 'realtime',
      title: 'Real-time Events',
      position: Vector3.create(0, -0.8, 0.1),
      size: Vector3.create(5, 0.8, 0.1),
      dataSource: 'realtime',
      refreshInterval: 1000,
      config: {
        timeRange: 'hour'
      },
      isVisible: true
    }

    this.widgets.set(userActivityChart.id, userActivityChart)
    this.widgets.set(systemPerformanceGauge.id, systemPerformanceGauge)
    this.widgets.set(businessMetrics.id, businessMetrics)
    this.widgets.set(realtimeEvents.id, realtimeEvents)

    console.log('📈 Default widgets created')
  }

  // Create default reports
  private createDefaultReports() {
    // Daily performance report
    const dailyReport: Report = {
      id: 'report_daily_performance',
      name: 'Daily Performance Report',
      description: 'Comprehensive daily performance metrics',
      category: 'system_performance',
      widgets: ['widget_user_activity', 'widget_system_performance'],
      schedule: {
        frequency: 'daily',
        enabled: true,
        nextRun: Date.now() + 86400000, // Tomorrow
        timezone: 'UTC'
      },
      recipients: ['admin@aigestion.com'],
      format: 'pdf',
      isTemplate: false
    }

    // Weekly business report
    const weeklyReport: Report = {
      id: 'report_weekly_business',
      name: 'Weekly Business Report',
      description: 'Weekly business metrics and KPIs',
      category: 'business_metrics',
      widgets: ['widget_business_metrics'],
      schedule: {
        frequency: 'weekly',
        enabled: true,
        nextRun: Date.now() + 604800000, // Next week
        timezone: 'UTC'
      },
      recipients: ['management@aigestion.com'],
      format: 'html',
      isTemplate: false
    }

    this.reports.set(dailyReport.id, dailyReport)
    this.reports.set(weeklyReport.id, weeklyReport)

    console.log('📋 Default reports created')
  }

  // Start analytics engine
  private startAnalyticsEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return

      this.updateRealTimeData()
      this.refreshWidgets()
      this.processReports()
      this.cleanupOldData()
    })
  }

  // Generate sample data
  private generateSampleData() {
    // Generate sample analytics data
    const categories: AnalyticsCategory[] = ['user_behavior', 'system_performance', 'business_metrics', 'engagement']

    categories.forEach(category => {
      const data: AnalyticsData = {
        id: `data_${category}_${Date.now()}`,
        timestamp: Date.now(),
        category: category,
        metrics: this.generateMetrics(category),
        dimensions: new Map([
          ['platform', 'web'],
          ['version', '1.0.0'],
          ['environment', 'production']
        ]),
        events: [],
        kpis: this.generateKPIs(category)
      }

      this.analyticsData.set(data.id, data)
    })

    // Generate sample real-time events
    for (let i = 0; i < 50; i++) {
      const event: AnalyticsEvent = {
        id: `event_${Date.now()}_${i}`,
        name: this.getRandomEventName(),
        category: this.getRandomEventCategory(),
        timestamp: Date.now() - Math.random() * 3600000, // Last hour
        userId: `user_${Math.floor(Math.random() * 100)}`,
        sessionId: `session_${Math.floor(Math.random() * 20)}`,
        properties: new Map([
          ['action', this.getRandomAction()],
          ['page', this.getRandomPage()],
          ['duration', Math.floor(Math.random() * 300)]
        ]),
        value: Math.random() * 100
      }

      this.realTimeData.push(event)
    }

    console.log('📊 Sample analytics data generated')
  }

  // Generate metrics
  private generateMetrics(category: AnalyticsCategory): Map<string, number> {
    const metrics = new Map<string, number>()

    switch (category) {
      case 'user_behavior':
        metrics.set('active_users', Math.floor(Math.random() * 1000) + 500)
        metrics.set('page_views', Math.floor(Math.random() * 10000) + 5000)
        metrics.set('session_duration', Math.random() * 600 + 120)
        metrics.set('bounce_rate', Math.random() * 0.5 + 0.2)
        break
      case 'system_performance':
        metrics.set('cpu_usage', Math.random() * 80 + 10)
        metrics.set('memory_usage', Math.random() * 70 + 20)
        metrics.set('response_time', Math.random() * 500 + 100)
        metrics.set('error_rate', Math.random() * 5)
        break
      case 'business_metrics':
        metrics.set('revenue', Math.random() * 10000 + 5000)
        metrics.set('conversion_rate', Math.random() * 0.1 + 0.02)
        metrics.set('customer_acquisition', Math.floor(Math.random() * 100) + 50)
        metrics.set('retention_rate', Math.random() * 0.3 + 0.6)
        break
      case 'engagement':
        metrics.set('interaction_rate', Math.random() * 0.8 + 0.1)
        metrics.set('social_shares', Math.floor(Math.random() * 500) + 100)
        metrics.set('comments', Math.floor(Math.random() * 200) + 50)
        metrics.set('likes', Math.floor(Math.random() * 1000) + 200)
        break
    }

    return metrics
  }

  // Generate KPIs
  private generateKPIs(category: AnalyticsCategory): KPIData[] {
    const kpis: KPIData[] = []

    switch (category) {
      case 'user_behavior':
        kpis.push({
          id: 'kpi_daily_active_users',
          name: 'Daily Active Users',
          value: Math.floor(Math.random() * 1000) + 500,
          target: 1500,
          unit: 'users',
          trend: Math.random() > 0.5 ? 'up' : 'down',
          change: (Math.random() - 0.5) * 20,
          status: 'good'
        })
        break
      case 'system_performance':
        kpis.push({
          id: 'kpi_uptime',
          name: 'System Uptime',
          value: 99.5 + Math.random() * 0.5,
          target: 99.9,
          unit: '%',
          trend: 'stable',
          change: 0.1,
          status: 'good'
        })
        break
      case 'business_metrics':
        kpis.push({
          id: 'kpi_monthly_revenue',
          name: 'Monthly Revenue',
          value: Math.floor(Math.random() * 50000) + 100000,
          target: 200000,
          unit: '$',
          trend: Math.random() > 0.3 ? 'up' : 'down',
          change: (Math.random() - 0.5) * 15,
          status: Math.random() > 0.2 ? 'good' : 'warning'
        })
        break
    }

    return kpis
  }

  // Get random event name
  private getRandomEventName(): string {
    const events = [
      'page_view', 'button_click', 'form_submit', 'video_play', 'download',
      'login', 'logout', 'search', 'filter', 'sort', 'share', 'comment',
      'purchase', 'add_to_cart', 'checkout', 'sign_up', 'subscribe'
    ]
    return events[Math.floor(Math.random() * events.length)]
  }

  // Get random event category
  private getRandomEventCategory(): string {
    const categories = ['navigation', 'interaction', 'conversion', 'engagement', 'error']
    return categories[Math.floor(Math.random() * categories.length)]
  }

  // Get random action
  private getRandomAction(): string {
    const actions = ['click', 'hover', 'scroll', 'swipe', 'tap', 'drag', 'drop']
    return actions[Math.floor(Math.random() * actions.length)]
  }

  // Get random page
  private getRandomPage(): string {
    const pages = [
      '/dashboard', '/profile', '/settings', '/analytics', '/reports',
      '/products', '/services', '/about', '/contact', '/help'
    ]
    return pages[Math.floor(Math.random() * pages.length)]
  }

  // Update real-time data
  private updateRealTimeData() {
    // Simulate new real-time events
    if (Math.random() < 0.1) {
      const event: AnalyticsEvent = {
        id: `event_realtime_${Date.now()}_${Math.random()}`,
        name: this.getRandomEventName(),
        category: this.getRandomEventCategory(),
        timestamp: Date.now(),
        userId: `user_${Math.floor(Math.random() * 100)}`,
        sessionId: `session_${Math.floor(Math.random() * 20)}`,
        properties: new Map([
          ['action', this.getRandomAction()],
          ['page', this.getRandomPage()]
        ]),
        value: Math.random() * 100
      }

      this.realTimeData.push(event)

      // Keep only recent events
      if (this.realTimeData.length > this.maxRealTimeEvents) {
        this.realTimeData = this.realTimeData.slice(-this.maxRealTimeEvents)
      }
    }
  }

  // Refresh widgets
  private refreshWidgets() {
    this.widgets.forEach((widget, id) => {
      if (Date.now() - widget.refreshInterval < 0) return

      this.updateWidgetData(widget)
    })
  }

  // Update widget data
  private updateWidgetData(widget: DashboardWidget) {
    switch (widget.type) {
      case 'chart':
        this.updateChartData(widget)
        break
      case 'gauge':
        this.updateGaugeData(widget)
        break
      case 'metric':
        this.updateMetricData(widget)
        break
      case 'realtime':
        this.updateRealtimeData(widget)
        break
    }
  }

  // Update chart data
  private updateChartData(widget: DashboardWidget) {
    console.log(`📈 Updating chart widget: ${widget.title}`)
    // In real implementation, this would update the actual chart visualization
  }

  // Update gauge data
  private updateGaugeData(widget: DashboardWidget) {
    console.log(`🎯 Updating gauge widget: ${widget.title}`)
    // In real implementation, this would update the actual gauge visualization
  }

  // Update metric data
  private updateMetricData(widget: DashboardWidget) {
    console.log(`📊 Updating metric widget: ${widget.title}`)
    // In real implementation, this would update the actual metric display
  }

  // Update real-time data widget
  private updateRealtimeData(widget: DashboardWidget) {
    console.log(`⚡ Updating real-time widget: ${widget.title}`)
    // In real implementation, this would update the real-time event display
  }

  // Process reports
  private processReports() {
    const now = Date.now()

    this.reports.forEach((report, id) => {
      if (report.schedule.enabled && now >= report.schedule.nextRun) {
        this.generateReport(report)
        report.schedule.nextRun = this.calculateNextRun(report.schedule)
      }
    })
  }

  // Generate report
  private generateReport(report: Report) {
    console.log(`📋 Generating report: ${report.name}`)

    // Collect data from widgets
    const reportData = {
      reportId: report.id,
      reportName: report.name,
      generatedAt: new Date().toISOString(),
      widgets: report.widgets.map(widgetId => {
        const widget = this.widgets.get(widgetId)
        return widget ? {
          id: widget.id,
          title: widget.title,
          data: this.getWidgetData(widget)
        } : null
      }).filter(Boolean)
    }

    // Send to recipients
    report.recipients.forEach(recipient => {
      console.log(`📧 Sending report to: ${recipient}`)
    })

    soundSystem.playInteractionSound('powerup')
  }

  // Get widget data
  private getWidgetData(widget: DashboardWidget): any {
    const data = Array.from(this.analyticsData.values())
      .filter(d => d.category === widget.dataSource)
      .map(d => ({
        timestamp: d.timestamp,
        metrics: Object.fromEntries(d.metrics),
        kpis: d.kpis
      }))

    return data
  }

  // Calculate next run time
  private calculateNextRun(schedule: ReportSchedule): number {
    const now = Date.now()
    let nextRun = now

    switch (schedule.frequency) {
      case 'hourly':
        nextRun = now + 3600000
        break
      case 'daily':
        nextRun = now + 86400000
        break
      case 'weekly':
        nextRun = now + 604800000
        break
      case 'monthly':
        nextRun = now + 2592000000
        break
    }

    return nextRun
  }

  // Clean up old data
  private cleanupOldData() {
    const cutoffTime = Date.now() - (this.dataRetentionDays * 24 * 60 * 60 * 1000)

    // Clean up analytics data
    this.analyticsData.forEach((data, id) => {
      if (data.timestamp < cutoffTime) {
        this.analyticsData.delete(id)
      }
    })

    // Clean up real-time events
    this.realTimeData = this.realTimeData.filter(event => event.timestamp > cutoffTime)
  }

  // Handle control
  private handleControl(controlId: string) {
    switch (controlId) {
      case 'refresh':
        this.refreshAllWidgets()
        break
      case 'export':
        this.exportData()
        break
      case 'settings':
        this.openSettings()
        break
      case 'fullscreen':
        this.toggleFullscreen()
        break
    }

    soundSystem.playInteractionSound('click')
  }

  // Refresh all widgets
  private refreshAllWidgets() {
    console.log('🔄 Refreshing all widgets...')
    this.widgets.forEach(widget => {
      this.updateWidgetData(widget)
    })
    soundSystem.playInteractionSound('powerup')
  }

  // Export data
  private exportData() {
    console.log('📤 Exporting analytics data...')

    const exportData = {
      timestamp: new Date().toISOString(),
      analyticsData: Array.from(this.analyticsData.values()),
      widgets: Array.from(this.widgets.values()),
      realTimeEvents: this.realTimeData.slice(-100) // Last 100 events
    }

    // In real implementation, this would download the data as a file
    console.log('📊 Data exported successfully')
    soundSystem.playInteractionSound('powerup')
  }

  // Open settings
  private openSettings() {
    console.log('⚙️ Opening analytics settings...')
    // In real implementation, this would open a settings panel
    soundSystem.playInteractionSound('click')
  }

  // Toggle fullscreen
  private toggleFullscreen() {
    console.log('🔍 Toggling fullscreen mode...')
    // In real implementation, this would toggle fullscreen display
    soundSystem.playInteractionSound('click')
  }

  // Track event
  public trackEvent(event: AnalyticsEvent) {
    this.realTimeData.push(event)

    // Keep only recent events
    if (this.realTimeData.length > this.maxRealTimeEvents) {
      this.realTimeData = this.realTimeData.slice(-this.maxRealTimeEvents)
    }

    console.log(`📊 Tracked event: ${event.name}`)
  }

  // Get analytics data
  public getAnalyticsData(category?: AnalyticsCategory): AnalyticsData[] {
    const data = Array.from(this.analyticsData.values())
    return category ? data.filter(d => d.category === category) : data
  }

  // Get real-time events
  public getRealTimeEvents(limit?: number): AnalyticsEvent[] {
    return limit ? this.realTimeData.slice(-limit) : this.realTimeData
  }

  // Get widgets
  public getWidgets(): DashboardWidget[] {
    return Array.from(this.widgets.values())
  }

  // Get reports
  public getReports(): Report[] {
    return Array.from(this.reports.values())
  }

  // Add widget
  public addWidget(widget: DashboardWidget) {
    this.widgets.set(widget.id, widget)
    console.log(`📈 Added widget: ${widget.title}`)
  }

  // Remove widget
  public removeWidget(widgetId: string) {
    this.widgets.delete(widgetId)
    console.log(`🗑️ Removed widget: ${widgetId}`)
  }

  // Create custom report
  public createReport(report: Omit<Report, 'id'>): Report {
    const newReport: Report = {
      ...report,
      id: `report_${Date.now()}_${Math.random()}`
    }

    this.reports.set(newReport.id, newReport)
    console.log(`📋 Created report: ${newReport.name}`)
    return newReport
  }

  // Set data retention
  public setDataRetentionDays(days: number) {
    this.dataRetentionDays = Math.max(1, days)
    console.log(`📅 Data retention set to: ${days} days`)
  }

  // Get system statistics
  public getSystemStatistics(): any {
    return {
      totalAnalyticsData: this.analyticsData.size,
      totalWidgets: this.widgets.size,
      totalReports: this.reports.size,
      realTimeEvents: this.realTimeData.length,
      dataRetentionDays: this.dataRetentionDays,
      maxRealTimeEvents: this.maxRealTimeEvents,
      refreshInterval: this.refreshInterval
    }
  }

  // Cleanup system
  public cleanup() {
    this.analyticsData.clear()
    this.widgets.clear()
    this.reports.clear()
    this.realTimeData = []

    if (this.dashboardUI) {
      engine.removeEntity(this.dashboardUI)
    }

    this.isInitialized = false
  }
}

// Export singleton instance
export const analyticsDashboardSystem = new AnalyticsDashboardSystem()
