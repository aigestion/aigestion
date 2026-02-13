import { j as e } from './vendor-3d-BTgeB28l.js';
const a = ({ text: a, className: s = '' }) =>
  e.jsxs('div', {
    className: `relative inline-block ${s}`,
    children: [
      e.jsx('span', { className: 'relative z-10', children: a }),
      e.jsx('span', {
        className:
          'absolute top-0 left-0 -z-10 text-nexus-cyan opacity-50 animate-pulse translate-x-[2px]',
        children: a,
      }),
      e.jsx('span', {
        className:
          'absolute top-0 left-0 -z-10 text-nexus-violet opacity-50 animate-pulse -translate-x-[2px]',
        children: a,
      }),
    ],
  });
export { a as G };
