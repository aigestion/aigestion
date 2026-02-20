import mongoose, { Document, Schema } from 'mongoose';

export interface IProposal extends Document {
  type: 'TREASURY' | 'SCALING' | 'SECURITY' | 'GOVERNANCE';
  description: string;
  confidenceScore: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED' | 'VETOED';
  metadata: Record<string, any>;
  expiresAt: Date;
  executedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProposalSchema: Schema = new Schema(
  {
    type: { type: String, required: true, enum: ['TREASURY', 'SCALING', 'SECURITY', 'GOVERNANCE'] },
    description: { type: String, required: true },
    confidenceScore: { type: Number, required: true, min: 0, max: 1 },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'EXECUTED', 'VETOED'],
      default: 'PENDING',
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    expiresAt: { type: Date, required: true },
    executedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

ProposalSchema.index({ status: 1, expiresAt: 1 });
ProposalSchema.index({ type: 1 });

export const Proposal = mongoose.model<IProposal>('Proposal', ProposalSchema);
