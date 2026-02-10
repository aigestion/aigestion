import mongoose, { Document, Schema } from 'mongoose';

export enum MissionStatus {
  PENDING = 'pending',
  PLANNING = 'planning',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface IMission extends Document {
  id: string;
  objective: string;
  userId: string;
  status: MissionStatus;
  plan?: string;
  result?: string;
  isEncrypted: boolean;
  vaultIV?: string;
  vaultTag?: string;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const missionSchema = new Schema<IMission>(
  {
    objective: {
      type: String,
      required: [true, 'Objective is required'],
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(MissionStatus),
      default: MissionStatus.PENDING,
    },
    plan: {
      type: String,
    },
    result: {
      type: String,
    },
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    vaultIV: {
      type: String,
    },
    vaultTag: {
      type: String,
    },
    error: {
      type: String,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const Mission = mongoose.model<IMission>('Mission', missionSchema);

export { Mission };
