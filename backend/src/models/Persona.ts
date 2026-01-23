import mongoose, { Document, Schema } from 'mongoose';

export interface IPersona extends Document {
  id: string;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  systemPrompt: string;
  voiceSettings: {
    provider: string; // e.g., 'elevenlabs', 'openai'
    voiceId: string;
    settings?: Record<string, any>; // Provider specific settings (stability, similarity_boost, etc.)
  };
  price: number; // 0 for free
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PersonaSchema: Schema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    systemPrompt: { type: String, required: true },
    voiceSettings: {
      provider: { type: String, required: true },
      voiceId: { type: String, required: true },
      settings: { type: Schema.Types.Mixed },
    },
    price: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Indexes for search and marketplace filtering
PersonaSchema.index({ name: 'text', description: 'text', tags: 'text' });
PersonaSchema.index({ isPublic: 1, createdAt: -1 });
PersonaSchema.index({ ownerId: 1 });

export const Persona = mongoose.model<IPersona>('Persona', PersonaSchema);
