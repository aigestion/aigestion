// Real-time Collaboration Whiteboard System for AIGestion Virtual Office
import {
  engine,
  InputAction,
  Material,
  MeshRenderer,
  pointerEventsSystem,
  TextShape,
  Transform,
} from '@dcl/sdk/ecs';
import { Color3, Color4, Quaternion, Vector3 } from '@dcl/sdk/math';
import { soundSystem } from './enhanced-sound';

interface WhiteboardDrawing {
  id: string;
  userId: string;
  type: 'line' | 'circle' | 'rectangle' | 'text' | 'arrow' | 'freehand';
  points: Vector3[];
  color: Color3;
  strokeWidth: number;
  timestamp: number;
  isShared: boolean;
}

interface WhiteboardSession {
  id: string;
  name: string;
  participants: string[];
  drawings: WhiteboardDrawing[];
  isActive: boolean;
  createdAt: number;
  lastModified: number;
}

interface DrawingTool {
  type: 'pen' | 'eraser' | 'text' | 'shape' | 'selection';
  color: Color3;
  strokeWidth: number;
  isActive: boolean;
}

interface WhiteboardUser {
  id: string;
  name: string;
  color: Color3;
  cursor: Vector3;
  isDrawing: boolean;
  currentTool: DrawingTool;
}

export class CollaborationWhiteboardSystem {
  private sessions: Map<string, WhiteboardSession> = new Map();
  private currentSession: WhiteboardSession | null = null;
  private users: Map<string, WhiteboardUser> = new Map();
  private drawingTools: Map<string, DrawingTool> = new Map();
  private whiteboardEntity: any;
  private toolbarEntity: any;
  private drawingEntities: Map<string, any[]> = new Map();
  private isInitialized: boolean = false;
  private currentUser: WhiteboardUser;
  private isDrawing: boolean = false;
  private currentDrawing: WhiteboardDrawing | null = null;
  private drawingHistory: WhiteboardDrawing[] = [];

  constructor() {
    this.currentUser = {
      id: 'user_main',
      name: 'Main User',
      color: Color3.create(0.2, 0.6, 1),
      cursor: Vector3.create(0, 0, 0),
      isDrawing: false,
      currentTool: this.createDefaultTool(),
    };
  }

  // Initialize whiteboard system
  initialize() {
    console.log('🎨 Collaboration Whiteboard System Initializing...');

    this.setupDrawingTools();
    this.createWhiteboard();
    this.createToolbar();
    this.startDrawingEngine();
    this.createDefaultSession();

    this.isInitialized = true;
    console.log('🎨 Collaboration Whiteboard System Ready!');
  }

  // Setup drawing tools
  private setupDrawingTools() {
    this.drawingTools.set('pen', {
      type: 'pen',
      color: Color3.create(0, 0, 0),
      strokeWidth: 2,
      isActive: true,
    });

    this.drawingTools.set('eraser', {
      type: 'eraser',
      color: Color3.create(1, 1, 1),
      strokeWidth: 10,
      isActive: false,
    });

    this.drawingTools.set('text', {
      type: 'text',
      color: Color3.create(0, 0, 0),
      strokeWidth: 1,
      isActive: false,
    });

    this.drawingTools.set('shape', {
      type: 'shape',
      color: Color3.create(0.2, 0.6, 1),
      strokeWidth: 2,
      isActive: false,
    });

    this.drawingTools.set('selection', {
      type: 'selection',
      color: Color3.create(0.8, 0.8, 0.8),
      strokeWidth: 1,
      isActive: false,
    });
  }

  // Create default tool
  private createDefaultTool(): DrawingTool {
    return {
      type: 'pen',
      color: Color3.create(0, 0, 0),
      strokeWidth: 2,
      isActive: true,
    };
  }

  // Create whiteboard surface
  private createWhiteboard() {
    this.whiteboardEntity = engine.addEntity();
    Transform.create(this.whiteboardEntity, {
      position: Vector3.create(8, 3, 2),
      scale: Vector3.create(6, 4, 0.1),
    });
    MeshRenderer.setBox(this.whiteboardEntity);
    Material.setPbrMaterial(this.whiteboardEntity, {
      albedoColor: Color4.create(1, 1, 1, 1),
      roughness: 0.1,
      metallic: 0.0,
    });

    // Add whiteboard border
    this.createWhiteboardBorder();

    // Setup whiteboard interaction
    this.setupWhiteboardInteraction();
  }

  // Create whiteboard border
  private createWhiteboardBorder() {
    const border = engine.addEntity();
    Transform.create(border, {
      parent: this.whiteboardEntity,
      position: Vector3.create(0, 0, -0.05),
      scale: Vector3.create(6.1, 4.1, 0.05),
    });
    MeshRenderer.setBox(border);
    Material.setPbrMaterial(border, {
      albedoColor: Color4.create(0.2, 0.2, 0.2, 1),
      roughness: 0.3,
      metallic: 0.8,
    });
  }

  // Setup whiteboard interaction
  private setupWhiteboardInteraction() {
    pointerEventsSystem.onPointerDown(
      {
        entity: this.whiteboardEntity,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Start Drawing' },
      },
      e => this.startDrawing(e)
    );

    pointerEventsSystem.onPointerUp(
      {
        entity: this.whiteboardEntity,
        opts: { button: InputAction.IA_POINTER },
      },
      () => this.stopDrawing()
    );

    /* 
    pointerEventsSystem.onPointerMove(
      {
        entity: this.whiteboardEntity,
        opts: { button: InputAction.IA_POINTER },
      },
      e => this.continueDrawing(e)
    );
    */
  }

  // Create toolbar
  private createToolbar() {
    this.toolbarEntity = engine.addEntity();
    Transform.create(this.toolbarEntity, {
      position: Vector3.create(8, 5, 2),
      scale: Vector3.create(4, 0.8, 0.1),
    });
    MeshRenderer.setBox(this.toolbarEntity);
    Material.setPbrMaterial(this.toolbarEntity, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2,
    });

    // Create tool buttons
    this.createToolButtons();

    // Create color palette
    this.createColorPalette();

    // Create session controls
    this.createSessionControls();
  }

  // Create tool buttons
  private createToolButtons() {
    const tools = [
      { id: 'pen', icon: '✏️', name: 'Pen' },
      { id: 'eraser', icon: '🧹', name: 'Eraser' },
      { id: 'text', icon: '📝', name: 'Text' },
      { id: 'shape', icon: '⭕', name: 'Shape' },
      { id: 'selection', icon: '👆', name: 'Select' },
    ];

    let xOffset = -1.5;

    tools.forEach(tool => {
      const button = engine.addEntity();
      Transform.create(button, {
        parent: this.toolbarEntity,
        position: Vector3.create(xOffset, 0, 0.1),
        scale: Vector3.create(0.3, 0.3, 0.1),
      });
      MeshRenderer.setBox(button);
      Material.setPbrMaterial(button, {
        albedoColor: Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2,
      });

      const buttonText = engine.addEntity();
      Transform.create(buttonText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5),
      });
      TextShape.create(buttonText, {
        text: tool.icon,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3,
      });

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: tool.name },
        },
        () => this.selectTool(tool.id)
      );

      xOffset += 0.8;
    });
  }

  // Create color palette
  private createColorPalette() {
    const colors = [
      Color3.create(0, 0, 0), // Black
      Color3.create(1, 0, 0), // Red
      Color3.create(0, 1, 0), // Green
      Color3.create(0, 0, 1), // Blue
      Color3.create(1, 1, 0), // Yellow
      Color3.create(1, 0, 1), // Magenta
      Color3.create(0, 1, 1), // Cyan
      Color3.create(0.5, 0.5, 0.5), // Gray
    ];

    let xOffset = -1.5;

    colors.forEach((color, index) => {
      const colorButton = engine.addEntity();
      Transform.create(colorButton, {
        parent: this.toolbarEntity,
        position: Vector3.create(xOffset, -0.3, 0.1),
        scale: Vector3.create(0.15, 0.15, 0.1),
      });
      MeshRenderer.setBox(colorButton);
      Material.setPbrMaterial(colorButton, {
        albedoColor: Color4.create(color.r, color.g, color.b, 1),
        roughness: 0.2,
        metallic: 0.1,
      });

      pointerEventsSystem.onPointerDown(
        {
          entity: colorButton,
          opts: { button: InputAction.IA_POINTER, hoverText: `Select Color ${index + 1}` },
        },
        () => this.selectColor(color)
      );

      xOffset += 0.4;
    });
  }

  // Create session controls
  private createSessionControls() {
    const controls = [
      { id: 'new', icon: '🆕', name: 'New Session' },
      { id: 'save', icon: '💾', name: 'Save' },
      { id: 'share', icon: '🔗', name: 'Share' },
      { id: 'clear', icon: '🗑️', name: 'Clear' },
    ];

    let xOffset = 1.5;

    controls.forEach(control => {
      const button = engine.addEntity();
      Transform.create(button, {
        parent: this.toolbarEntity,
        position: Vector3.create(xOffset, 0, 0.1),
        scale: Vector3.create(0.3, 0.3, 0.1),
      });
      MeshRenderer.setBox(button);
      Material.setPbrMaterial(button, {
        albedoColor: Color4.create(0.8, 0.4, 0.2, 1),
        emissiveColor: Color4.create(0.8, 0.4, 0.2, 0.5),
        emissiveIntensity: 2,
      });

      const buttonText = engine.addEntity();
      Transform.create(buttonText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5),
      });
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3,
      });

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name },
        },
        () => this.handleSessionControl(control.id)
      );

      xOffset += 0.8;
    });
  }

  // Start drawing engine
  private startDrawingEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return;

      this.updateDrawingEntities();
      this.syncWithRemoteUsers();
    });
  }

  // Create default session
  private createDefaultSession() {
    const session: WhiteboardSession = {
      id: 'session_default',
      name: 'Default Whiteboard',
      participants: [this.currentUser.id],
      drawings: [],
      isActive: true,
      createdAt: Date.now(),
      lastModified: Date.now(),
    };

    this.sessions.set(session.id, session);
    this.currentSession = session;
    this.users.set(this.currentUser.id, this.currentUser);

    console.log('🎨 Default whiteboard session created');
  }

  // Start drawing
  private startDrawing(event: any) {
    if (!this.currentSession) return;

    const point = this.getDrawingPoint(event);
    if (!point) return;

    this.isDrawing = true;
    this.currentUser.isDrawing = true;

    const drawing: WhiteboardDrawing = {
      id: `drawing_${Date.now()}`,
      userId: this.currentUser.id,
      type: this.currentUser.currentTool.type === 'eraser' ? 'freehand' : 'line',
      points: [point],
      color: this.currentUser.currentTool.color,
      strokeWidth: this.currentUser.currentTool.strokeWidth,
      timestamp: Date.now(),
      isShared: true,
    };

    this.currentDrawing = drawing;
    this.drawingHistory.push(drawing);

    soundSystem.playInteractionSound('click');
  }

  // Continue drawing
  private continueDrawing(event: any) {
    if (!this.isDrawing || !this.currentDrawing) return;

    const point = this.getDrawingPoint(event);
    if (!point) return;

    this.currentDrawing.points.push(point);
    this.renderDrawing(this.currentDrawing);
  }

  // Stop drawing
  private stopDrawing() {
    if (!this.isDrawing || !this.currentDrawing) return;

    this.isDrawing = false;
    this.currentUser.isDrawing = false;

    const session = this.currentSession;
    if (this.currentDrawing.points.length > 1 && session) {
      session.drawings.push(this.currentDrawing);
      session.lastModified = Date.now();

      // Share with other users
      this.shareDrawing(this.currentDrawing);
    }

    this.currentDrawing = null;
    soundSystem.playInteractionSound('click');
  }

  // Get drawing point from event
  private getDrawingPoint(event: any): Vector3 | null {
    if (!event.hit || !this.whiteboardEntity) return null;

    const localPoint = Vector3.create(
      event.hit.hitPoint.x - Transform.get(this.whiteboardEntity).position.x,
      event.hit.hitPoint.y - Transform.get(this.whiteboardEntity).position.y,
      0.05
    );

    return localPoint;
  }

  // Render drawing
  private renderDrawing(drawing: WhiteboardDrawing) {
    if (!this.drawingEntities.has(drawing.id)) {
      this.drawingEntities.set(drawing.id, []);
    }

    const entities = this.drawingEntities.get(drawing.id)!;

    // Clear previous entities for this drawing
    entities.forEach(entity => engine.removeEntity(entity));
    entities.length = 0;

    switch (drawing.type) {
      case 'line':
      case 'freehand':
        this.renderFreehandDrawing(drawing, entities);
        break;
      case 'circle':
        this.renderCircleDrawing(drawing, entities);
        break;
      case 'rectangle':
        this.renderRectangleDrawing(drawing, entities);
        break;
      case 'arrow':
        this.renderArrowDrawing(drawing, entities);
        break;
    }
  }

  // Render freehand drawing
  private renderFreehandDrawing(drawing: WhiteboardDrawing, entities: any[]) {
    for (let i = 0; i < drawing.points.length - 1; i++) {
      const start = drawing.points[i];
      const end = drawing.points[i + 1];

      const line = engine.addEntity();
      Transform.create(line, {
        parent: this.whiteboardEntity,
        position: Vector3.create((start.x + end.x) / 2, (start.y + end.y) / 2, 0.05),
        scale: Vector3.create(Vector3.distance(start, end), drawing.strokeWidth * 0.01, 0.01),
        rotation: Quaternion.fromEulerDegrees(
          0,
          0,
          (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI
        ),
      });

      MeshRenderer.setBox(line);
      Material.setPbrMaterial(line, {
        albedoColor: Color4.create(drawing.color.r, drawing.color.g, drawing.color.b, 1),
        roughness: 0.1,
        metallic: 0.0,
      });

      entities.push(line);
    }
  }

  // Render circle drawing
  private renderCircleDrawing(drawing: WhiteboardDrawing, entities: any[]) {
    if (drawing.points.length < 2) return;

    const center = drawing.points[0];
    const radius = Vector3.distance(center, drawing.points[1]);

    const circle = engine.addEntity();
    Transform.create(circle, {
      parent: this.whiteboardEntity,
      position: Vector3.create(center.x, center.y, 0.05),
      scale: Vector3.create(radius * 2, radius * 2, 0.01),
    });

    MeshRenderer.setBox(circle);
    Material.setPbrMaterial(circle, {
      albedoColor: Color4.create(drawing.color.r, drawing.color.g, drawing.color.b, 1),
      roughness: 0.1,
      metallic: 0.0,
    });

    entities.push(circle);
  }

  // Render rectangle drawing
  private renderRectangleDrawing(drawing: WhiteboardDrawing, entities: any[]) {
    if (drawing.points.length < 2) return;

    const start = drawing.points[0];
    const end = drawing.points[1];

    const rectangle = engine.addEntity();
    Transform.create(rectangle, {
      parent: this.whiteboardEntity,
      position: Vector3.create((start.x + end.x) / 2, (start.y + end.y) / 2, 0.05),
      scale: Vector3.create(Math.abs(end.x - start.x), Math.abs(end.y - start.y), 0.01),
    });

    MeshRenderer.setBox(rectangle);
    Material.setPbrMaterial(rectangle, {
      albedoColor: Color4.create(drawing.color.r, drawing.color.g, drawing.color.b, 1),
      roughness: 0.1,
      metallic: 0.0,
    });

    entities.push(rectangle);
  }

  // Render arrow drawing
  private renderArrowDrawing(drawing: WhiteboardDrawing, entities: any[]) {
    if (drawing.points.length < 2) return;

    const start = drawing.points[0];
    const end = drawing.points[1];

    // Render arrow line
    this.renderFreehandDrawing(drawing, entities);

    // Render arrow head
    const arrowHead = engine.addEntity();
    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    Transform.create(arrowHead, {
      parent: this.whiteboardEntity,
      position: Vector3.create(end.x, end.y, 0.05),
      scale: Vector3.create(0.1, 0.1, 0.01),
      rotation: Quaternion.fromEulerDegrees(0, 0, (angle * 180) / Math.PI),
    });

    MeshRenderer.setBox(arrowHead);
    Material.setPbrMaterial(arrowHead, {
      albedoColor: Color4.create(drawing.color.r, drawing.color.g, drawing.color.b, 1),
      roughness: 0.1,
      metallic: 0.0,
    });

    entities.push(arrowHead);
  }

  // Update drawing entities
  private updateDrawingEntities() {
    // Update cursor position
    this.updateCursorPosition();

    // Update drawing animations
    this.updateDrawingAnimations();
  }

  // Update cursor position
  private updateCursorPosition() {
    // Simulate cursor movement
    const time = Date.now() / 1000;
    this.currentUser.cursor = Vector3.create(
      Math.sin(time * 0.5) * 2,
      Math.cos(time * 0.3) * 1.5,
      0.05
    );
  }

  // Update drawing animations
  private updateDrawingAnimations() {
    // Add subtle animations to drawings
    this.drawingEntities.forEach((entities, drawingId) => {
      entities.forEach((entity, index) => {
        const time = Date.now() / 1000;
        const transform = Transform.getMutable(entity);

        // Add subtle pulsing effect
        const scale = transform.scale;
        const pulse = 1 + Math.sin(time * 2 + index * 0.1) * 0.02;
        transform.scale = Vector3.create(scale.x * pulse, scale.y * pulse, scale.z);
      });
    });
  }

  // Sync with remote users
  private syncWithRemoteUsers() {
    // Simulate remote user activity
    if (Math.random() < 0.01) {
      this.simulateRemoteUserDrawing();
    }
  }

  // Simulate remote user drawing
  private simulateRemoteUserDrawing() {
    const remoteUser: WhiteboardUser = {
      id: 'user_remote',
      name: 'Remote User',
      color: Color3.create(1, 0.5, 0),
      cursor: Vector3.create(Math.random() * 4 - 2, Math.random() * 2 - 1, 0.05),
      isDrawing: true,
      currentTool: this.createDefaultTool(),
    };

    const drawing: WhiteboardDrawing = {
      id: `drawing_remote_${Date.now()}`,
      userId: remoteUser.id,
      type: 'freehand',
      points: [
        remoteUser.cursor,
        Vector3.create(
          remoteUser.cursor.x + Math.random() * 0.5,
          remoteUser.cursor.y + Math.random() * 0.5,
          0.05
        ),
      ],
      color: remoteUser.color,
      strokeWidth: 2,
      timestamp: Date.now(),
      isShared: true,
    };

    if (this.currentSession) {
      this.currentSession.drawings.push(drawing);
      this.renderDrawing(drawing);
    }
  }

  // Select tool
  private selectTool(toolId: string) {
    const tool = this.drawingTools.get(toolId);
    if (!tool) return;

    // Deactivate all tools
    this.drawingTools.forEach(t => (t.isActive = false));

    // Activate selected tool
    tool.isActive = true;
    this.currentUser.currentTool = tool;

    console.log(`🎨 Selected tool: ${toolId}`);
    soundSystem.playInteractionSound('click');
  }

  // Select color
  private selectColor(color: Color3) {
    this.currentUser.currentTool.color = color;
    console.log(`🎨 Selected color: RGB(${color.r}, ${color.g}, ${color.b})`);
    soundSystem.playInteractionSound('click');
  }

  // Handle session control
  private handleSessionControl(controlId: string) {
    switch (controlId) {
      case 'new':
        this.createNewSession();
        break;
      case 'save':
        this.saveSession();
        break;
      case 'share':
        this.shareSession();
        break;
      case 'clear':
        this.clearWhiteboard();
        break;
    }

    soundSystem.playInteractionSound('click');
  }

  // Create new session
  private createNewSession() {
    const session: WhiteboardSession = {
      id: `session_${Date.now()}`,
      name: `Whiteboard ${this.sessions.size + 1}`,
      participants: [this.currentUser.id],
      drawings: [],
      isActive: true,
      createdAt: Date.now(),
      lastModified: Date.now(),
    };

    this.sessions.set(session.id, session);
    this.currentSession = session;

    // Clear whiteboard
    this.clearWhiteboard();

    console.log(`🎨 Created new session: ${session.name}`);
  }

  // Save session
  private saveSession() {
    if (!this.currentSession) return;

    console.log(`💾 Saving session: ${this.currentSession.name}`);
    console.log(`📊 Drawings: ${this.currentSession.drawings.length}`);
    console.log(`👥 Participants: ${this.currentSession.participants.length}`);

    // In real implementation, this would save to backend
    soundSystem.playInteractionSound('powerup');
  }

  // Share session
  private shareSession() {
    if (!this.currentSession) return;

    console.log(`🔗 Sharing session: ${this.currentSession.name}`);
    console.log(`🔗 Share link: https://aigestion.dev/whiteboard/${this.currentSession.id}`);

    // In real implementation, this would generate shareable link
    soundSystem.playInteractionSound('powerup');
  }

  // Clear whiteboard
  private clearWhiteboard() {
    if (!this.currentSession) return;

    // Remove all drawing entities
    this.drawingEntities.forEach(entities => {
      entities.forEach(entity => engine.removeEntity(entity));
    });
    this.drawingEntities.clear();

    // Clear session drawings
    this.currentSession.drawings = [];
    this.currentSession.lastModified = Date.now();

    console.log('🗑️ Whiteboard cleared');
    soundSystem.playInteractionSound('click');
  }

  // Share drawing with other users
  private shareDrawing(drawing: WhiteboardDrawing) {
    console.log(`📤 Sharing drawing: ${drawing.id}`);

    // In real implementation, this would send to other users via WebSocket
  }

  // Join session
  public joinSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    this.currentSession = session;
    session.participants.push(this.currentUser.id);
    session.lastModified = Date.now();

    // Render existing drawings
    session.drawings.forEach(drawing => this.renderDrawing(drawing));

    console.log(`🎨 Joined session: ${session.name}`);
  }

  // Leave session
  public leaveSession() {
    if (!this.currentSession) return;

    const index = this.currentSession.participants.indexOf(this.currentUser.id);
    if (index > -1) {
      this.currentSession.participants.splice(index, 1);
    }

    console.log(`🎨 Left session: ${this.currentSession.name}`);
    this.currentSession = null;
  }

  // Get current session
  public getCurrentSession(): WhiteboardSession | null {
    return this.currentSession;
  }

  // Get all sessions
  public getSessions(): WhiteboardSession[] {
    return Array.from(this.sessions.values());
  }

  // Get drawing history
  public getDrawingHistory(): WhiteboardDrawing[] {
    return [...this.drawingHistory];
  }

  // Add user to session
  public addUserToSession(userId: string, userName: string) {
    const user: WhiteboardUser = {
      id: userId,
      name: userName,
      color: Color3.create(Math.random(), Math.random(), Math.random()),
      cursor: Vector3.create(0, 0, 0),
      isDrawing: false,
      currentTool: this.createDefaultTool(),
    };

    this.users.set(userId, user);

    if (this.currentSession) {
      this.currentSession.participants.push(userId);
      this.currentSession.lastModified = Date.now();
    }

    console.log(`👤 User ${userName} joined the session`);
  }

  // Remove user from session
  public removeUserFromSession(userId: string) {
    const user = this.users.get(userId);
    if (!user) return;

    this.users.delete(userId);

    if (this.currentSession) {
      const index = this.currentSession.participants.indexOf(userId);
      if (index > -1) {
        this.currentSession.participants.splice(index, 1);
        this.currentSession.lastModified = Date.now();
      }
    }

    console.log(`👤 User ${user.name} left the session`);
  }

  // Cleanup system
  public cleanup() {
    // Clear all drawing entities
    this.drawingEntities.forEach(entities => {
      entities.forEach(entity => engine.removeEntity(entity));
    });
    this.drawingEntities.clear();

    // Clear sessions
    this.sessions.clear();
    this.users.clear();
    this.drawingTools.clear();
    this.drawingHistory = [];

    // Remove entities
    if (this.whiteboardEntity) {
      engine.removeEntity(this.whiteboardEntity);
    }
    if (this.toolbarEntity) {
      engine.removeEntity(this.toolbarEntity);
    }

    this.isInitialized = false;
  }
}

// Export singleton instance
export const whiteboardSystem = new CollaborationWhiteboardSystem();
