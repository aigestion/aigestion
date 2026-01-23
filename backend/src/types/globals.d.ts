/**
 * Global type shims for backend environment.
 * These are required because some shared or legacy code references browser types
 * that are not available in the Node.js environment without the DOM library.
 */

declare global {
  // Shimming MediaStream as any for backend WebRTC signaling/proxying
  type MediaStream = any;
}

export {};
