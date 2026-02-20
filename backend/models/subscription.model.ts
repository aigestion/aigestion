import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'pending' | 'trial';
  startDate: Date;
  endDate?: Date;
  trialEnd?: Date;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentDate?: Date;
  nextBillingDate?: Date;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
    index: true,
  },
  planId: {
    type: String,
    required: true,
    enum: ['free', 'basic', 'professional', 'enterprise'],
    default: 'free',
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'cancelled', 'expired', 'pending', 'trial'],
    default: 'inactive',
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  trialEnd: {
    type: Date,
  },
  autoRenew: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer'],
  },
  lastPaymentDate: {
    type: Date,
  },
  nextBillingDate: {
    type: Date,
  },
  stripeSubscriptionId: {
    type: String,
    sparse: true,
    index: true,
  },
  stripeCustomerId: {
    type: String,
    sparse: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
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

// Indexes for better performance
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ stripeSubscriptionId: 1 });
SubscriptionSchema.index({ status: 1, endDate: 1 });

// Pre-save middleware to update nextBillingDate
SubscriptionSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'active') {
    // Calculate next billing date (30 days from start or last payment)
    const baseDate = this.lastPaymentDate || this.startDate;
    this.nextBillingDate = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
  
  // Set end date for cancelled subscriptions
  if (this.isModified('status') && this.status === 'cancelled' && !this.endDate) {
    this.endDate = new Date();
  }
  
  next();
});

// Static method to find active subscriptions
SubscriptionSchema.statics.findActive = function(userId: string) {
  return this.findOne({
    userId,
    status: 'active',
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gt: new Date() } },
    ],
  }).populate('planId');
};

// Static method to check if user has access to feature
SubscriptionSchema.statics.hasAccess = function(userId: string, feature: 'dashboard' | 'mobile' | 'api') {
  const featureMap = {
    dashboard: ['basic', 'professional', 'enterprise'],
    mobile: ['basic', 'professional', 'enterprise'],
    api: ['professional', 'enterprise'],
  };

  return this.findOne({
    userId,
    status: 'active',
    planId: { $in: featureMap[feature] },
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gt: new Date() } },
    ],
  });
};

// Instance method to check if subscription is expired
SubscriptionSchema.methods.isExpired = function(): boolean {
  if (!this.endDate) return false;
  return new Date() > this.endDate;
};

// Instance method to check if subscription is in trial
SubscriptionSchema.methods.isTrial = function(): boolean {
  if (!this.trialEnd) return false;
  const now = new Date();
  return now <= this.trialEnd && now >= this.startDate;
};

// Instance method to get days until expiry
SubscriptionSchema.methods.getDaysUntilExpiry = function(): number {
  if (!this.endDate) return Infinity;
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((this.endDate.getTime() - Date.now()) / msPerDay);
};

// Virtual for plan details
SubscriptionSchema.virtual('planDetails', {
  ref: 'Plan',
  localField: 'planId',
  foreignField: 'id',
  justOne: true,
});

const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export { Subscription, ISubscription };
