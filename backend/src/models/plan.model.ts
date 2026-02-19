import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  maxProjects: number;
  maxUsers: number;
  hasDashboardAccess: boolean;
  hasMobileAccess: boolean;
  hasAPIAccess: boolean;
  hasPrioritySupport: boolean;
  stripePriceId?: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    enum: ['free', 'basic', 'professional', 'enterprise'],
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'MXN'],
  },
  interval: {
    type: String,
    required: true,
    default: 'month',
    enum: ['month', 'year'],
  },
  features: [{
    type: String,
    required: true,
  }],
  maxProjects: {
    type: Number,
    required: true,
    min: 0,
  },
  maxUsers: {
    type: Number,
    required: true,
    min: 0,
  },
  hasDashboardAccess: {
    type: Boolean,
    required: true,
    default: false,
  },
  hasMobileAccess: {
    type: Boolean,
    required: true,
    default: false,
  },
  hasAPIAccess: {
    type: Boolean,
    required: true,
    default: false,
  },
  hasPrioritySupport: {
    type: Boolean,
    required: true,
    default: false,
  },
  stripePriceId: {
    type: String,
    sparse: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  sortOrder: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

// Indexes
PlanSchema.index({ id: 1 });
PlanSchema.index({ isActive: 1, sortOrder: 1 });
PlanSchema.index({ price: 1 });

// Static method to get active plans
PlanSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ sortOrder: 1, price: 1 });
};

// Static method to get plan by ID
PlanSchema.statics.findByIdentifier = function(id: string) {
  return this.findOne({ id, isActive: true });
};

// Static method to initialize default plans
PlanSchema.statics.initializeDefaultPlans = async function() {
  const existingPlans = await this.countDocuments();
  
  if (existingPlans > 0) {
    console.log('[Plan] Default plans already exist');
    return;
  }

  const defaultPlans = [
    {
      id: 'free',
      name: 'Gratis',
      description: 'Plan gratuito con funciones básicas',
      price: 0,
      currency: 'USD',
      interval: 'month',
      features: [
        'Hasta 3 proyectos',
        '1 usuario',
        'Soporte básico',
        'Dashboard limitado',
      ],
      maxProjects: 3,
      maxUsers: 1,
      hasDashboardAccess: false,
      hasMobileAccess: false,
      hasAPIAccess: false,
      hasPrioritySupport: false,
      sortOrder: 1,
    },
    {
      id: 'basic',
      name: 'Básico',
      description: 'Perfecto para pequeños equipos y proyectos',
      price: 29.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Hasta 10 proyectos',
        '3 usuarios',
        'Dashboard completo',
        'App móvil',
        'Soporte por email',
      ],
      maxProjects: 10,
      maxUsers: 3,
      hasDashboardAccess: true,
      hasMobileAccess: true,
      hasAPIAccess: false,
      hasPrioritySupport: false,
      sortOrder: 2,
    },
    {
      id: 'professional',
      name: 'Profesional',
      description: 'Ideal para empresas en crecimiento',
      price: 79.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Proyectos ilimitados',
        '10 usuarios',
        'Dashboard avanzado',
        'App móvil premium',
        'API completa',
        'Soporte prioritario',
      ],
      maxProjects: Infinity,
      maxUsers: 10,
      hasDashboardAccess: true,
      hasMobileAccess: true,
      hasAPIAccess: true,
      hasPrioritySupport: true,
      sortOrder: 3,
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      description: 'Solución completa para grandes empresas',
      price: 199.99,
      currency: 'USD',
      interval: 'month',
      features: [
        'Todo ilimitado',
        'Usuarios ilimitados',
        'Dashboard personalizado',
        'App móvil white-label',
        'API dedicada',
        'Soporte 24/7',
        'SLA garantizado',
      ],
      maxProjects: Infinity,
      maxUsers: Infinity,
      hasDashboardAccess: true,
      hasMobileAccess: true,
      hasAPIAccess: true,
      hasPrioritySupport: true,
      sortOrder: 4,
    },
  ];

  try {
    await this.insertMany(defaultPlans);
    console.log('[Plan] Default plans initialized successfully');
  } catch (error) {
    console.error('[Plan] Error initializing default plans:', error);
  }
};

// Instance method to check if plan has feature
PlanSchema.methods.hasFeature = function(feature: string): boolean {
  return this.features.includes(feature);
};

// Instance method to get feature list with icons
PlanSchema.methods.getFeaturesWithIcons = function(): Array<{name: string, icon: string}> {
  const iconMap: Record<string, string> = {
    'Dashboard': 'bar-chart',
    'App móvil': 'smartphone',
    'API': 'code',
    'Soporte': 'headphones',
    'Usuarios': 'users',
    'Proyectos': 'folder',
    'Personalizado': 'settings',
    'White-label': 'package',
    'SLA': 'shield',
  };

  return this.features.map(feature => ({
    name: feature,
    icon: iconMap[feature] || 'check',
  }));
};

const Plan = mongoose.model<IPlan>('Plan', PlanSchema);

export { Plan, IPlan };
