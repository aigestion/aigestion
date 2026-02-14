import { engine } from '@dcl/sdk/ecs';

type TimerEntry = {
  callback: () => void;
  time: number;
  loop: boolean;
  originalTime: number;
};

const timers: Map<number, TimerEntry> = new Map();
let timerIdCounter = 0;

engine.addSystem((dt: number) => {
  for (const [id, timer] of timers.entries()) {
    timer.time -= dt;
    if (timer.time <= 0) {
      timer.callback();
      if (timer.loop) {
        timer.time = timer.originalTime;
      } else {
        timers.delete(id);
      }
    }
  }
});

/**
 * Robust setTimeout polyfill for Decentraland SDK v7
 */
export function setTimeout(callback: () => void, ms: number): number {
  const id = ++timerIdCounter;
  timers.set(id, {
    callback,
    time: ms / 1000,
    loop: false,
    originalTime: ms / 1000,
  });
  return id;
}

/**
 * Robust setInterval polyfill for Decentraland SDK v7
 */
export function setInterval(callback: () => void, ms: number): number {
  const id = ++timerIdCounter;
  timers.set(id, {
    callback,
    time: ms / 1000,
    loop: true,
    originalTime: ms / 1000,
  });
  return id;
}

/**
 * Robust clearTimeout polyfill for Decentraland SDK v7
 */
export function clearTimeout(id: number | undefined) {
  if (id !== undefined) {
    timers.delete(id);
  }
}

/**
 * Robust clearInterval polyfill for Decentraland SDK v7
 */
export function clearInterval(id: number | undefined) {
  if (id !== undefined) {
    timers.delete(id);
  }
}
