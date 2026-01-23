import { io } from 'socket.io-client';

/**
 * Global Socket Instance for AIGestion Nexus.
 * Connects to the backend to facilitate the "Neural Heartbeat".
 */
const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('%c[Nexus Socket] Frecuencia establecida con el núcleo neural.', 'color: #00f5ff; font-weight: bold;');
});

socket.on('disconnect', () => {
  console.warn('[Nexus Socket] Conexión perdida. Intentando re-sincronizar...');
});
