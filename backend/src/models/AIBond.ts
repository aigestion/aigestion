import mongoose, { Document, Schema } from 'mongoose';

export interface IAIBond extends Document {
  userId: string;
  purchaseAmount: number; // Real USD paid
  creditBalance: number;  // Available credits (purchaseAmount / discount)
  initialValue: number;   // Total value at purchase
  discountRate: number;   // e.g., 0.20 for 20%
  tier: 'silver' | 'gold' | 'sovereign';
  status: 'active' | 'depleted' | 'expired';
  expiryDate?: Date;
  timestamp: Date;
}

const aiBondSchema = new Schema<IAIBond>(
  {
    userId: { type: String, required: true, index: true },
    purchaseAmount: { type: Number, required: true },
    creditBalance: { type: Number, required: true },
    initialValue: { type: Number, required: true },
    discountRate: { type: Number, required: true },
    tier: { type: String, enum: ['silver', 'gold', 'sovereign'], default: 'silver' },
    status: { type: String, enum: ['active', 'depleted', 'expired'], default: 'active' },
    expiryDate: { type: Date },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const AIBond = mongoose.model<IAIBond>('AIBond', aiBondSchema);
