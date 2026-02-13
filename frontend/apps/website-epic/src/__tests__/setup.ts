import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { vi } from 'vitest';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
global.scrollTo = vi.fn();

// Mock getComputedStyle
global.getComputedStyle = vi.fn().mockReturnValue({
  getPropertyValue: () => '',
});

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock canvas
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({ data: new Array(4) })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock navigator
Object.defineProperty(globalThis, 'navigator', {
  value: {
    ...globalThis.navigator,
    serviceWorker: {
      ready: Promise.resolve({
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        postMessage: vi.fn(),
      }),
    },
    share: vi.fn(),
    clipboard: {
      writeText: vi.fn(),
      readText: vi.fn(),
    },
  },
  writable: true,
});

// Mock window resize
Object.defineProperty(globalThis, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(globalThis, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock fetch
global.fetch = vi.fn();

// Mock WebSocket
global.WebSocket = vi.fn().mockImplementation(() => ({
  close: vi.fn(),
  send: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

// Mock performance
global.performance = {
  ...global.performance,
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(() => []),
  getEntriesByType: vi.fn(() => []),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  now: vi.fn(() => Date.now()),
} as Performance;

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn(clearTimeout);

// Mock crypto
Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: vi.fn(() => new Uint32Array(1)),
    subtle: {
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      sign: vi.fn(),
      verify: vi.fn(),
    },
  },
  writable: true,
});

// Mock WebRTC
global.RTCPeerConnection = vi.fn().mockImplementation(() => ({
  createOffer: vi.fn(),
  createAnswer: vi.fn(),
  setLocalDescription: vi.fn(),
  setRemoteDescription: vi.fn(),
  addIceCandidate: vi.fn(),
  createDataChannel: vi.fn(),
  close: vi.fn(),
}));

// Mock Web Audio API
global.AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn(),
  createGainNode: vi.fn(),
  createAnalyser: vi.fn(),
  decodeAudioData: vi.fn(),
  resume: vi.fn(),
  suspend: vi.fn(),
}));

// Mock MediaDevices
global.navigator.mediaDevices = {
  getUserMedia: vi.fn(() =>
    Promise.resolve({
      getTracks: () => [{ stop: vi.fn() }],
    })
  ),
  enumerateDevices: vi.fn(() => Promise.resolve([])),
};

// Mock Screen Orientation
global.screen.orientation = {
  angle: 0,
  type: 'portrait-primary',
  lock: vi.fn(),
  unlock: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Mock Pointer Events
global.PointerEvent = vi.fn().mockImplementation((type, eventInitDict) => ({
  ...eventInitDict,
  type,
  pointerId: 1,
  width: 1,
  height: 1,
  pressure: 0.5,
  tangentialPressure: 0,
  tiltX: 0,
  tiltY: 0,
  twist: 0,
  isPrimary: true,
}));

// Mock Touch Events
global.TouchEvent = vi.fn().mockImplementation((type, eventInitDict) => ({
  ...eventInitDict,
  type,
  touches: [],
  changedTouches: [],
  targetTouches: [],
}));

// Mock Vibration API
global.navigator.vibrate = vi.fn();

// Mock Notification API
global.Notification = vi.fn().mockImplementation((title, options) => ({
  title,
  ...options,
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

global.Notification.requestPermission = vi.fn(() => Promise.resolve('granted'));

// Mock Service Worker
global.ServiceWorker = vi.fn().mockImplementation(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  postMessage: vi.fn(),
}));

global.ServiceWorkerRegistration = vi.fn().mockImplementation(() => ({
  installing: null,
  waiting: null,
  active: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  update: vi.fn(),
  unregister: vi.fn(),
  sync: {
    register: vi.fn(),
    getTags: vi.fn(),
  },
  pushManager: {
    subscribe: vi.fn(),
    getSubscription: vi.fn(),
    permissionState: vi.fn(() => Promise.resolve('granted')),
  },
}));

// Mock IndexedDB
const indexedDBMock = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
  cmp: vi.fn(),
};

global.indexedDB = indexedDBMock;

// Mock Web Share API
global.navigator.share = vi.fn().mockImplementation(() => Promise.resolve());

// Mock Clipboard API
global.navigator.clipboard = {
  writeText: vi.fn(() => Promise.resolve()),
  readText: vi.fn(() => Promise.resolve('')),
  write: vi.fn(() => Promise.resolve()),
  read: vi.fn(() => Promise.resolve()),
};

// Mock File and Blob
global.File = vi.fn().mockImplementation((content, name, options) => ({
  name,
  size: content?.length || 0,
  type: options?.type || '',
  lastModified: Date.now(),
  slice: vi.fn(),
}));

global.Blob = vi.fn().mockImplementation((content, options) => ({
  size: content?.length || 0,
  type: options?.type || '',
  slice: vi.fn(),
}));

// Mock URL
global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = vi.fn();

// Mock Image
global.Image = vi.fn().mockImplementation(() => ({
  src: '',
  onload: null,
  onerror: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

// Mock HTMLVideoElement
Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  value: vi.fn(() => Promise.resolve()),
  writable: true,
});

Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
  value: vi.fn(),
  writable: true,
});

// Mock HTMLAudioElement
Object.defineProperty(HTMLAudioElement.prototype, 'play', {
  value: vi.fn(() => Promise.resolve()),
  writable: true,
});

Object.defineProperty(HTMLAudioElement.prototype, 'pause', {
  value: vi.fn(),
  writable: true,
});

// Mock console methods to avoid noise in tests
global.console = {
  ...global.console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};

// Setup cleanup
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});
