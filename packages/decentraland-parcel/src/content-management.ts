// Dynamic Content Management System for AIGestion Virtual Office
import {
  engine,
  InputAction,
  Material,
  MeshRenderer,
  pointerEventsSystem,
  Transform,
} from '@dcl/sdk/ecs';
import { Color4, Vector3 } from '@dcl/sdk/math';
import { soundSystem } from './enhanced-sound';

interface ContentItem {
  id: string;
  title: string;
  type:
    | 'document'
    | 'image'
    | 'video'
    | 'audio'
    | '3d_model'
    | 'presentation'
    | 'dataset'
    | 'widget';
  category: string;
  tags: string[];
  metadata: ContentMetadata;
  content: any;
  permissions: ContentPermissions;
  createdAt: number;
  updatedAt: number;
  version: number;
  status: 'draft' | 'published' | 'archived' | 'deleted';
}

interface ContentMetadata {
  author: string;
  description: string;
  size: number;
  format: string;
  duration?: number;
  dimensions?: { width: number; height: number };
  thumbnail?: string;
  preview?: string;
  language: string;
  accessibility: AccessibilityFeatures;
}

interface ContentPermissions {
  canView: string[];
  canEdit: string[];
  canDelete: string[];
  canShare: boolean;
  isPublic: boolean;
}

interface AccessibilityFeatures {
  hasCaptions: boolean;
  hasAudioDescription: boolean;
  hasTranscript: boolean;
  hasAltText: boolean;
  language: string;
}

interface ContentCollection {
  id: string;
  name: string;
  description: string;
  items: string[];
  layout: 'grid' | 'list' | 'carousel' | 'masonry';
  filters: ContentFilter[];
  sortBy: 'title' | 'date' | 'author' | 'popularity';
  sortOrder: 'asc' | 'desc';
  isPublic: boolean;
}

interface ContentFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: any;
}

interface ContentTemplate {
  id: string;
  name: string;
  type: ContentItem['type'];
  structure: any;
  fields: TemplateField[];
  isDefault: boolean;
}

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'file' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: ValidationRule[];
}

interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'range';
  value: any;
  message: string;
}

export class ContentManagementSystem {
  private content: Map<string, ContentItem> = new Map();
  private collections: Map<string, ContentCollection> = new Map();
  private templates: Map<string, ContentTemplate> = new Map();
  private contentUI: any;
  private isInitialized: boolean = false;
  private currentCollection: ContentCollection | null = null;
  private searchIndex: Map<string, string[]> = new Map();
  private analyticsEngine: any;
  private versionControl: any;

  constructor() {
    this.initializeAnalyticsEngine();
    this.initializeVersionControl();
  }

  // Initialize content management system
  initialize() {
    console.log('📚 Dynamic Content Management System Initializing...');

    this.setupContentTemplates();
    this.createContentUI();
    this.createDefaultCollections();
    this.initializeSearchIndex();
    this.startContentEngine();

    this.isInitialized = true;
    console.log('📚 Dynamic Content Management System Ready!');
  }

  // Initialize analytics engine
  private initializeAnalyticsEngine() {
    this.analyticsEngine = {
      track: (event: string, data: any) => {
        console.log(`📊 Analytics: ${event}`, data);
      },

      getMetrics: (contentId: string) => {
        return {
          views: Math.floor(Math.random() * 1000),
          downloads: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          averageRating: (Math.random() * 2 + 3).toFixed(1),
          timeSpent: Math.floor(Math.random() * 300),
        };
      },
    };
  }

  // Initialize version control
  private initializeVersionControl() {
    this.versionControl = {
      createVersion: (contentId: string, changes: any) => {
        console.log(`📝 Creating version for content: ${contentId}`);
        return {
          id: `v_${Date.now()}`,
          contentId: contentId,
          changes: changes,
          timestamp: Date.now(),
          author: 'system',
        };
      },

      getVersionHistory: (contentId: string) => {
        return [
          {
            id: 'v_1',
            contentId: contentId,
            changes: 'Initial version',
            timestamp: Date.now() - 86400000,
            author: 'creator',
          },
        ];
      },
    };
  }

  // Setup content templates
  private setupContentTemplates() {
    // Document template
    const documentTemplate: ContentTemplate = {
      id: 'template_document',
      name: 'Document',
      type: 'document',
      structure: {
        sections: ['title', 'content', 'attachments'],
        layout: 'standard',
      },
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'text',
          required: true,
          validation: [
            { type: 'required', value: true, message: 'Title is required' },
            { type: 'minLength', value: 3, message: 'Title must be at least 3 characters' },
          ],
        },
        {
          id: 'content',
          name: 'Content',
          type: 'text',
          required: true,
          validation: [{ type: 'required', value: true, message: 'Content is required' }],
        },
        {
          id: 'category',
          name: 'Category',
          type: 'select',
          required: true,
          options: ['Report', 'Proposal', 'Manual', 'Guide', 'Other'],
        },
      ],
      isDefault: true,
    };

    // Presentation template
    const presentationTemplate: ContentTemplate = {
      id: 'template_presentation',
      name: 'Presentation',
      type: 'presentation',
      structure: {
        slides: ['title', 'content', 'media'],
        layout: 'slides',
      },
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'text',
          required: true,
        },
        {
          id: 'slides',
          name: 'Slides',
          type: 'multiselect',
          required: true,
          options: ['Title Slide', 'Content Slide', 'Image Slide', 'Chart Slide'],
        },
      ],
      isDefault: false,
    };

    // Dataset template
    const datasetTemplate: ContentTemplate = {
      id: 'template_dataset',
      name: 'Dataset',
      type: 'dataset',
      structure: {
        schema: ['columns', 'types', 'constraints'],
        format: 'structured',
      },
      fields: [
        {
          id: 'name',
          name: 'Dataset Name',
          type: 'text',
          required: true,
        },
        {
          id: 'format',
          name: 'Format',
          type: 'select',
          required: true,
          options: ['CSV', 'JSON', 'XML', 'Parquet'],
        },
        {
          id: 'size',
          name: 'Size (MB)',
          type: 'number',
          required: true,
        },
      ],
      isDefault: false,
    };

    this.templates.set(documentTemplate.id, documentTemplate);
    this.templates.set(presentationTemplate.id, presentationTemplate);
    this.templates.set(datasetTemplate.id, datasetTemplate);

    console.log('📋 Content templates configured');
  }

  // Create content UI
  private createContentUI() {
    this.contentUI = engine.addEntity();
    Transform.create(this.contentUI, {
      position: Vector3.create(8, 3, 14),
      scale: Vector3.create(4, 4, 0.1),
    });
    MeshRenderer.setBox(this.contentUI);
    Material.setPbrMaterial(this.contentUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2,
    });

    // Create title
    const title = engine.addEntity();
    Transform.create(title, {
      parent: this.contentUI,
      position: Vector3.create(0, 1.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(title, {
      text: '📚 CONTENT MANAGEMENT',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3,
    });

    // Create content browser
    this.createContentBrowser();

    // Create content editor
    this.createContentEditor();

    // Create collection manager
    this.createCollectionManager();

    // Create analytics panel
    this.createAnalyticsPanel();
  }

  // Create content browser
  private createContentBrowser() {
    const browser = engine.addEntity();
    Transform.create(browser, {
      parent: this.contentUI,
      position: Vector3.create(0, 1.0, 0.1),
      scale: Vector3.create(0.9, 0.4, 0.1),
    });
    MeshRenderer.setBox(browser);
    Material.setPbrMaterial(browser, {
      albedoColor: Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1,
    });

    const browserText = engine.addEntity();
    Transform.create(browserText, {
      parent: browser,
      position: Vector3.create(0, 0.1, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(browserText, {
      text: '📂 Content Browser',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3,
    });

    // Browser controls
    this.createBrowserControls();
  }

  // Create browser controls
  private createBrowserControls() {
    const controls = [
      { id: 'search', icon: '🔍', name: 'Search' },
      { id: 'filter', icon: '🔽', name: 'Filter' },
      { id: 'sort', icon: '↕️', name: 'Sort' },
      { id: 'new', icon: '➕', name: 'New Content' },
    ];

    let xOffset = -0.6;

    controls.forEach(control => {
      const button = engine.addEntity();
      Transform.create(button, {
        parent: this.contentUI,
        position: Vector3.create(xOffset, 0.6, 0.1),
        scale: Vector3.create(0.2, 0.2, 0.1),
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
        () => this.handleBrowserControl(control.id)
      );

      xOffset += 0.4;
    });
  }

  // Create content editor
  private createContentEditor() {
    const editor = engine.addEntity();
    Transform.create(editor, {
      parent: this.contentUI,
      position: Vector3.create(0, 0.1, 0.1),
      scale: Vector3.create(0.9, 0.4, 0.1),
    });
    MeshRenderer.setBox(editor);
    Material.setPbrMaterial(editor, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1,
    });

    const editorText = engine.addEntity();
    Transform.create(editorText, {
      parent: editor,
      position: Vector3.create(0, 0.1, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(editorText, {
      text: '✏️ Content Editor',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3,
    });
  }

  // Create collection manager
  private createCollectionManager() {
    const manager = engine.addEntity();
    Transform.create(manager, {
      parent: this.contentUI,
      position: Vector3.create(0, -0.4, 0.1),
      scale: Vector3.create(0.9, 0.3, 0.1),
    });
    MeshRenderer.setBox(manager);
    Material.setPbrMaterial(manager, {
      albedoColor: Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1,
    });

    const managerText = engine.addEntity();
    Transform.create(managerText, {
      parent: manager,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(managerText, {
      text: '📁 Collections',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3,
    });
  }

  // Create analytics panel
  private createAnalyticsPanel() {
    const analytics = engine.addEntity();
    Transform.create(analytics, {
      parent: this.contentUI,
      position: Vector3.create(0, -0.9, 0.1),
      scale: Vector3.create(0.9, 0.3, 0.1),
    });
    MeshRenderer.setBox(analytics);
    Material.setPbrMaterial(analytics, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1,
    });

    const analyticsText = engine.addEntity();
    Transform.create(analyticsText, {
      parent: analytics,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3),
    });
    TextShape.create(analyticsText, {
      text: '📊 Analytics',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3,
    });
  }

  // Create default collections
  private createDefaultCollections() {
    // Documents collection
    const documentsCollection: ContentCollection = {
      id: 'collection_documents',
      name: 'Documents',
      description: 'All documents and text files',
      items: [],
      layout: 'grid',
      filters: [{ field: 'type', operator: 'equals', value: 'document' }],
      sortBy: 'date',
      sortOrder: 'desc',
      isPublic: true,
    };

    // Media collection
    const mediaCollection: ContentCollection = {
      id: 'collection_media',
      name: 'Media',
      description: 'Images, videos, and audio files',
      items: [],
      layout: 'masonry',
      filters: [{ field: 'type', operator: 'contains', value: 'image' }],
      sortBy: 'title',
      sortOrder: 'asc',
      isPublic: true,
    };

    // Presentations collection
    const presentationsCollection: ContentCollection = {
      id: 'collection_presentations',
      name: 'Presentations',
      description: 'Slides and presentations',
      items: [],
      layout: 'carousel',
      filters: [{ field: 'type', operator: 'equals', value: 'presentation' }],
      sortBy: 'date',
      sortOrder: 'desc',
      isPublic: false,
    };

    this.collections.set(documentsCollection.id, documentsCollection);
    this.collections.set(mediaCollection.id, mediaCollection);
    this.collections.set(presentationsCollection.id, presentationsCollection);

    this.currentCollection = documentsCollection;

    console.log('📁 Default collections created');
  }

  // Initialize search index
  private initializeSearchIndex() {
    console.log('🔍 Initializing search index...');

    // Pre-populate with sample content
    this.createSampleContent();
  }

  // Create sample content
  private createSampleContent() {
    const sampleContent: ContentItem[] = [
      {
        id: 'content_1',
        title: 'Q4 Financial Report',
        type: 'document',
        category: 'Report',
        tags: ['finance', 'quarterly', '2024'],
        metadata: {
          author: 'Finance Team',
          description: 'Quarterly financial report for Q4 2024',
          size: 2048000,
          format: 'PDF',
          language: 'en',
          accessibility: {
            hasCaptions: false,
            hasAudioDescription: false,
            hasTranscript: true,
            hasAltText: true,
            language: 'en',
          },
        },
        content: { url: '/files/q4_report.pdf' },
        permissions: {
          canView: ['all'],
          canEdit: ['finance_team'],
          canDelete: ['finance_manager'],
          canShare: true,
          isPublic: false,
        },
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 3600000,
        version: 2,
        status: 'published',
      },
      {
        id: 'content_2',
        title: 'Product Launch Presentation',
        type: 'presentation',
        category: 'Marketing',
        tags: ['product', 'launch', 'marketing'],
        metadata: {
          author: 'Marketing Team',
          description: 'New product launch presentation',
          size: 5120000,
          format: 'PPTX',
          duration: 1800,
          language: 'en',
          accessibility: {
            hasCaptions: true,
            hasAudioDescription: false,
            hasTranscript: true,
            hasAltText: true,
            language: 'en',
          },
        },
        content: { url: '/files/product_launch.pptx' },
        permissions: {
          canView: ['all'],
          canEdit: ['marketing_team'],
          canDelete: ['marketing_manager'],
          canShare: true,
          isPublic: true,
        },
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 7200000,
        version: 3,
        status: 'published',
      },
      {
        id: 'content_3',
        title: 'Customer Analytics Dataset',
        type: 'dataset',
        category: 'Analytics',
        tags: ['customer', 'analytics', 'data'],
        metadata: {
          author: 'Data Team',
          description: 'Customer behavior analytics dataset',
          size: 10240000,
          format: 'CSV',
          language: 'en',
          accessibility: {
            hasCaptions: false,
            hasAudioDescription: false,
            hasTranscript: false,
            hasAltText: true,
            language: 'en',
          },
        },
        content: { url: '/data/customer_analytics.csv' },
        permissions: {
          canView: ['data_team', 'analysts'],
          canEdit: ['data_team'],
          canDelete: ['data_manager'],
          canShare: false,
          isPublic: false,
        },
        createdAt: Date.now() - 259200000,
        updatedAt: Date.now() - 86400000,
        version: 1,
        status: 'published',
      },
    ];

    sampleContent.forEach(item => {
      this.content.set(item.id, item);
      this.updateSearchIndex(item);
    });

    console.log('📄 Sample content created');
  }

  // Update search index
  private updateSearchIndex(item: ContentItem) {
    const searchableText = [
      item.title,
      item.description,
      item.category,
      ...item.tags,
      item.metadata.author,
    ]
      .join(' ')
      .toLowerCase();

    this.searchIndex.set(item.id, searchableText.split(' '));
  }

  // Start content engine
  private startContentEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return;

      this.updateContentMetrics();
      this.processContentUpdates();
      this.optimizeSearchIndex();
    });
  }

  // Handle browser control
  private handleBrowserControl(controlId: string) {
    switch (controlId) {
      case 'search':
        this.openSearchDialog();
        break;
      case 'filter':
        this.openFilterDialog();
        break;
      case 'sort':
        this.toggleSortOrder();
        break;
      case 'new':
        this.openContentCreator();
        break;
    }

    soundSystem.playInteractionSound('click');
  }

  // Open search dialog
  private openSearchDialog() {
    console.log('🔍 Opening search dialog...');
    // In real implementation, this would open a search UI
  }

  // Open filter dialog
  private openFilterDialog() {
    console.log('🔽 Opening filter dialog...');
    // In real implementation, this would open a filter UI
  }

  // Toggle sort order
  private toggleSortOrder() {
    if (!this.currentCollection) return;

    this.currentCollection.sortOrder = this.currentCollection.sortOrder === 'asc' ? 'desc' : 'asc';
    console.log(`🔄 Sort order: ${this.currentCollection.sortOrder}`);
  }

  // Open content creator
  private openContentCreator() {
    console.log('➕ Opening content creator...');
    // In real implementation, this would open a content creation UI
  }

  // Create content
  public createContent(templateId: string, data: any): ContentItem {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const content: ContentItem = {
      id: `content_${Date.now()}`,
      title: data.title || 'Untitled',
      type: template.type,
      category: data.category || 'General',
      tags: data.tags || [],
      metadata: {
        author: data.author || 'Unknown',
        description: data.description || '',
        size: 0,
        format: template.type,
        language: data.language || 'en',
        accessibility: {
          hasCaptions: false,
          hasAudioDescription: false,
          hasTranscript: false,
          hasAltText: false,
          language: data.language || 'en',
        },
      },
      content: data.content || {},
      permissions: {
        canView: data.canView || ['all'],
        canEdit: data.canEdit || [data.author || 'Unknown'],
        canDelete: data.canDelete || [data.author || 'Unknown'],
        canShare: data.canShare !== undefined ? data.canShare : true,
        isPublic: data.isPublic !== undefined ? data.isPublic : false,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      status: 'draft',
    };

    this.content.set(content.id, content);
    this.updateSearchIndex(content);

    // Track analytics
    this.analyticsEngine.track('content_created', {
      contentId: content.id,
      type: content.type,
      author: content.metadata.author,
    });

    console.log(`📝 Created content: ${content.title}`);
    return content;
  }

  // Update content
  public updateContent(contentId: string, updates: any): ContentItem | null {
    const content = this.content.get(contentId);
    if (!content) return null;

    // Create version
    const version = this.versionControl.createVersion(contentId, updates);

    // Update content
    Object.assign(content, updates);
    content.updatedAt = Date.now();
    content.version += 1;

    this.updateSearchIndex(content);

    // Track analytics
    this.analyticsEngine.track('content_updated', {
      contentId: contentId,
      version: content.version,
    });

    console.log(`✏️ Updated content: ${content.title}`);
    return content;
  }

  // Delete content
  public deleteContent(contentId: string): boolean {
    const content = this.content.get(contentId);
    if (!content) return false;

    content.status = 'deleted';
    this.searchIndex.delete(contentId);

    // Track analytics
    this.analyticsEngine.track('content_deleted', {
      contentId: contentId,
      type: content.type,
    });

    console.log(`🗑️ Deleted content: ${content.title}`);
    return true;
  }

  // Search content
  public searchContent(query: string): ContentItem[] {
    const terms = query.toLowerCase().split(' ');
    const results: ContentItem[] = [];

    this.content.forEach((content, id) => {
      if (content.status === 'deleted') return;

      const indexTerms = this.searchIndex.get(id) || [];
      const score = this.calculateSearchScore(terms, indexTerms);

      if (score > 0) {
        results.push(content);
      }
    });

    return results.sort((a, b) => {
      const scoreA = this.calculateSearchScore(terms, this.searchIndex.get(a.id) || []);
      const scoreB = this.calculateSearchScore(terms, this.searchIndex.get(b.id) || []);
      return scoreB - scoreA;
    });
  }

  // Calculate search score
  private calculateSearchScore(queryTerms: string[], indexTerms: string[]): number {
    let score = 0;
    queryTerms.forEach(term => {
      if (indexTerms.includes(term)) {
        score += 1;
      }
    });
    return score;
  }

  // Get content by collection
  public getContentByCollection(collectionId: string): ContentItem[] {
    const collection = this.collections.get(collectionId);
    if (!collection) return [];

    let results = Array.from(this.content.values()).filter(content => {
      if (content.status === 'deleted') return false;

      // Apply filters
      return collection.filters.every(filter => {
        const fieldValue = this.getFieldValue(content, filter.field);
        return this.applyFilter(fieldValue, filter.operator, filter.value);
      });
    });

    // Apply sorting
    results.sort((a, b) => {
      const aValue = this.getFieldValue(a, collection.sortBy);
      const bValue = this.getFieldValue(b, collection.sortBy);

      if (collection.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return results;
  }

  // Get field value
  private getFieldValue(content: ContentItem, field: string): any {
    switch (field) {
      case 'title':
        return content.title;
      case 'date':
        return content.createdAt;
      case 'author':
        return content.metadata.author;
      case 'type':
        return content.type;
      case 'popularity':
        return this.analyticsEngine.getMetrics(content.id).views;
      default:
        return '';
    }
  }

  // Apply filter
  private applyFilter(value: any, operator: string, filterValue: any): boolean {
    switch (operator) {
      case 'equals':
        return value === filterValue;
      case 'contains':
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      case 'greater':
        return value > filterValue;
      case 'less':
        return value < filterValue;
      case 'between':
        return value >= filterValue[0] && value <= filterValue[1];
      default:
        return false;
    }
  }

  // Update content metrics
  private updateContentMetrics() {
    this.content.forEach((content, id) => {
      const metrics = this.analyticsEngine.getMetrics(id);
      // Update UI with metrics
    });
  }

  // Process content updates
  private processContentUpdates() {
    // Handle real-time updates
    // Sync with external systems
  }

  // Optimize search index
  private optimizeSearchIndex() {
    // Periodically optimize search index for performance
  }

  // Get content
  public getContent(contentId: string): ContentItem | undefined {
    return this.content.get(contentId);
  }

  // Get all content
  public getAllContent(): ContentItem[] {
    return Array.from(this.content.values()).filter(content => content.status !== 'deleted');
  }

  // Get collections
  public getCollections(): ContentCollection[] {
    return Array.from(this.collections.values());
  }

  // Get templates
  public getTemplates(): ContentTemplate[] {
    return Array.from(this.templates.values());
  }

  // Get content metrics
  public getContentMetrics(contentId: string): any {
    return this.analyticsEngine.getMetrics(contentId);
  }

  // Cleanup system
  public cleanup() {
    this.content.clear();
    this.collections.clear();
    this.templates.clear();
    this.searchIndex.clear();

    if (this.contentUI) {
      engine.removeEntity(this.contentUI);
    }

    this.isInitialized = false;
  }
}

// Export singleton instance
export const contentManagementSystem = new ContentManagementSystem();
