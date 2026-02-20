import mongoose, { Schema, Document } from 'mongoose';

export interface IMCPServer extends Document {
  name: string;
  url: string;
  type: 'JSON-RPC' | 'SSE' | 'STDIO';
  status: 'PENDING' | 'ACTIVE' | 'REVOKED' | 'OFFLINE';
  capabilities: {
    tools: Array<{
      name: string;
      description: string;
      inputSchema: any;
    }>;
    resources: Array<{
      uri: string;
      name: string;
      mimeType: string;
    }>;
  };
  reputation: number;
  lastPing: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const MCPServerSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['JSON-RPC', 'SSE', 'STDIO'], default: 'SSE' },
    status: { type: String, enum: ['PENDING', 'ACTIVE', 'REVOKED', 'OFFLINE'], default: 'PENDING' },
    capabilities: {
      tools: [{ name: String, description: String, inputSchema: Object }],
      resources: [{ uri: String, name: String, mimeType: String }],
    },
    reputation: { type: Number, default: 100 },
    lastPing: { type: Date, default: Date.now },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

export const MCPServer = mongoose.model<IMCPServer>('MCPServer', MCPServerSchema);
