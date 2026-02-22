import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('🌌 [SovereignBridge] Connected to Neural Core');
    });

    this.socket.on('disconnect', () => {
      console.log('📡 [SovereignBridge] Disconnected from Neural Core');
    });
  }

  onPulse(callback: (metrics: any) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('pulse', callback);
  }

  onPulseWarning(callback: (metrics: any) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('pulse:warning', callback);
  }

  onSovereignAlert(callback: (alert: any) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('sovereign:alert', callback);
  }

  onMetaPresence(callback: (data: any) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('meta_presence', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
