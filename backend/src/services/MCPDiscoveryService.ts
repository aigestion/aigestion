import { injectable, inject } from 'inversify';
import { MCPServer, IMCPServer } from '../models/MCPServer';
import { logger } from '../utils/logger';

@injectable()
export class MCPDiscoveryService {
  constructor() {
    logger.info('🛰️ MCP Discovery Service active: Tracking global capability hub');
  }

  public async registerServer(data: Partial<IMCPServer>) {
    try {
      const server = new MCPServer(data);
      await server.save();
      logger.info(`[MCP] Discovered new capability node: ${server.name}`);
      return server;
    } catch (error) {
      logger.error('[MCP] Failed to register server:', error);
      throw error;
    }
  }

  public async getDirectory(filters: any = {}) {
    return await MCPServer.find(filters).sort({ reputation: -1 });
  }

  public async activateServer(id: string) {
    logger.info(`🚨 [MCP] ACTIVATING capability node: ${id}`);
    const server = await MCPServer.findByIdAndUpdate(id, { status: 'ACTIVE' }, { new: true });
    return !!server;
  }

  public async syncCapabilities(id: string) {
    // In a real implementation this would perform an MCP 'listTools' call
    logger.info(`[MCP] Syncing capabilities for node: ${id}`);
    const server = await MCPServer.findById(id);
    if (!server) return null;

    server.lastPing = new Date();
    await server.save();
    return server;
  }

  public async revokeServer(id: string) {
    logger.warn(`🚫 [MCP] REVOKING capability node: ${id}`);
    const server = await MCPServer.findByIdAndUpdate(id, { status: 'REVOKED' });
    return !!server;
  }
}
