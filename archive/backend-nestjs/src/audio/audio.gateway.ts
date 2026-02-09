import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AgentService } from '../agent/agent.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'audio',
})
export class AudioGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(AudioGateway.name);
  private activeSessions: Map<string, any> = new Map();

  constructor(
    private configService: ConfigService,
    private agentService: AgentService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('🎙️ Audio Gateway Initialized (Vapi.ai Ready)');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.activeSessions.delete(client.id);
  }

  @SubscribeMessage('stream-audio')
  async handleStreamAudio(@MessageBody() data: Buffer | any, @ConnectedSocket() client: Socket) {
    // In a real Vapi integration, we receive text or specific Vapi payloads
    // For this migration, we assume the client sends a text query or raw audio we transcribe
    // Let's assume 'data' contains { query: string } for the "Thinking Loop" test
    
    const session = this.activeSessions.get(client.id);
    if (session) {
      try {
        const query = data.query || "Describe the current state of the system.";
        
        // Call the Sovereign Agent
        const response = await this.agentService.processQuery(client.id, query);
        
        // Respond to Voice Interface
        client.emit('audio-processing', { status: 'speaking', text: response });
      } catch (error) {
        client.emit('error', { message: 'Agent processing failed' });
      }
    }
  }

  @SubscribeMessage('start-session')
  async handleStartSession(@ConnectedSocket() client: Socket) {
    this.logger.log(`Starting Vapi Voice Session for: ${client.id}`);
    
    // Simulate Vapi Session Creation
    const vapiPublic = this.configService.get<string>('VAPI_PUBLIC_KEY') || 'mock-key';
    const sessionId = `vapi-${Date.now()}`;
    
    this.activeSessions.set(client.id, { sessionId, startTime: Date.now() });
    
    return { 
      event: 'session-ready', 
      data: { 
        sessionId, 
        provider: 'vapi',
        publicKey: vapiPublic 
      } 
    };
  }
}
