/**
 * 🌌 SOVEREIGN LOGGER
 * Sistema de trazabilidad de alto nivel para el Nexus de AIGestion.
 */

const COLORS = {
  INFO: '#3b82f6',
  SUCCESS: '#10b981',
  WARN: '#f59e0b',
  ERROR: '#ef4444',
  SOVEREIGN: '#8b5cf6',
};

const format = (label: string, color: string) => [
  `%c ⚡ AIGESTION %c ${label.toUpperCase()} %c`,
  'background: #000; color: #fff; font-weight: bold; border-radius: 4px 0 0 4px; padding: 2px 6px;',
  `background: ${color}; color: #000; font-weight: bold; border-radius: 0 4px 4px 0; padding: 2px 6px;`,
  'background: transparent; color: inherit;',
];

export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(...format('info', COLORS.INFO), message, ...args);
  },
  success: (message: string, ...args: any[]) => {
    console.log(...format('success', COLORS.SUCCESS), message, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(...format('warn', COLORS.WARN), message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(...format('error', COLORS.ERROR), message, ...args);
  },
  sovereign: (message: string, ...args: any[]) => {
    console.log(...format('sovereign', COLORS.SOVEREIGN), `👑 ${message}`, ...args);
  },
  nexus: (phase: string, component: string) => {
    console.log(
      `%c 🌌 NEXUS %c PHASE ${phase} %c ${component} `,
      'background: #8b5cf6; color: #fff; font-weight: bold; border-radius: 4px; padding: 2px 6px;',
      'background: #fff; color: #000; font-weight: bold; border-radius: 4px; padding: 2px 6px; margin-left: 4px;',
      'color: #8b5cf6; font-weight: light; font-family: monospace;'
    );
  },
};
