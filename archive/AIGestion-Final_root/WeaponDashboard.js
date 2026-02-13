import { j as e, w as s } from './ui.js';
import { r as t } from './vendor.js';
const a = () => {
  const [a, r] = t.useState(!1),
    [l, n] = t.useState({ cpu: 12, memory: 45 }),
    [c, d] = t.useState(null);
  return (
    t.useEffect(() => {
      try {
        const e = setInterval(() => {
          n(e => ({
            cpu: Math.floor(30 * Math.random()) + 10,
            memory: Math.floor(20 * Math.random()) + 40,
          }));
        }, 2e3);
        return () => clearInterval(e);
      } catch (e) {
        d(e.message);
      }
    }, []),
    c
      ? e.jsxs('div', { className: 'p-10 bg-black text-red-500', children: ['Error Crítico: ', c] })
      : e.jsxs('div', {
          className:
            'weapon-dashboard min-h-screen p-4 bg-nexus-obsidian-deep text-white overflow-hidden relative',
          children: [
            e.jsx('header', {
              className: 'flex justify-between items-start mb-8 z-10 relative',
              children: e.jsxs('div', {
                children: [
                  e.jsx('h1', {
                    className: 'text-3xl font-bold text-nexus-cyan animate-pulse',
                    children: 'GOD MODE ACTIVE',
                  }),
                  e.jsx('p', {
                    className: 'text-xs text-gray-400',
                    children: 'System Stable // v3.0',
                  }),
                ],
              }),
            }),
            e.jsxs('div', {
              className: 'grid grid-cols-1 gap-4',
              children: [
                e.jsxs('div', {
                  className: 'bg-white/10 p-6 rounded-xl border border-white/10',
                  children: [
                    e.jsxs('h2', {
                      className: 'text-xl mb-4 flex items-center gap-2',
                      children: [
                        e.jsx(s, { className: 'w-6 h-6 text-green-400' }),
                        'SYSTEM STATUS',
                      ],
                    }),
                    e.jsxs('div', {
                      className: 'flex justify-around',
                      children: [
                        e.jsxs('div', {
                          className: 'text-center',
                          children: [
                            e.jsxs('div', {
                              className: 'text-2xl font-bold text-nexus-cyan',
                              children: [l.cpu, '%'],
                            }),
                            e.jsx('div', {
                              className: 'text-[10px] uppercase',
                              children: 'CPU Load',
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'text-center',
                          children: [
                            e.jsxs('div', {
                              className: 'text-2xl font-bold text-nexus-violet',
                              children: [l.memory, 'GB'],
                            }),
                            e.jsx('div', {
                              className: 'text-[10px] uppercase',
                              children: 'Memory',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsx('button', {
                  className:
                    'bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan p-4 rounded-xl font-bold tracking-widest hover:bg-nexus-cyan hover:text-black transition-all',
                  children: 'DANIELA CORE',
                }),
                e.jsx('button', {
                  className:
                    'bg-nexus-violet/20 text-nexus-violet border border-nexus-violet p-4 rounded-xl font-bold tracking-widest hover:bg-nexus-violet hover:text-black transition-all',
                  children: 'ADMIN ACCESS',
                }),
                e.jsx('button', {
                  onClick: () => globalThis.location.reload(),
                  className: 'mt-8 text-xs text-gray-500 underline',
                  children: 'Reload Shell',
                }),
              ],
            }),
          ],
        })
  );
};
export { a as default };
