import { injectable } from 'inversify';
import { Server } from 'socket.io';
import { logger } from '../utils/logger';

@injectable()
export class SocketService {
    private io: Server | null = null;

    /**
     * Initialize the SocketService with the Socket.IO server instance.
     * This is called in server.ts after the server is created.
     */
    public init(server: any): void {
        if (server instanceof Server) {
            this.io = server;
        } else {
            this.io = new Server(server, {
                cors: {
                    origin: '*', // Adjust as needed
                    methods: ['GET', 'POST'],
                    credentials: true,
                },
            });
        }
        logger.info('[SocketService] Initialized successfully');
    }

    public getIO(): Server | null {
        return this.io;
    }

    /**
     * Emit an event to a specific user.
     */
    public emitToUser(userId: string, event: string, data: any): void {
        this.emitToRoom(`user:${userId}`, event, data);
    }

    /**
     * Emit an event to all connected clients.
     */
    public emit(event: string, data: any): void {
        if (!this.io) {
            logger.warn(`[SocketService] Cannot emit event "${event}": io not initialized`);
            return;
        }
        this.io.emit(event, data);
    }

    /**
     * Emit an event to a specific room (e.g., a specific mission room).
     */
    public emitToRoom(room: string, event: string, data: any): void {
        if (!this.io) {
            logger.warn(`[SocketService] Cannot emit to room "${room}": io not initialized`);
            return;
        }
        this.io.to(room).emit(event, data);
        logger.debug(`[SocketService] Emitted "${event}" to room "${room}"`);
    }

    /**
     * Broadcast mission specific updates.
     */
    public emitMissionUpdate(missionId: string, data: any): void {
        this.emitToRoom(`mission:${missionId}`, 'mission:update', data);
    }
}
