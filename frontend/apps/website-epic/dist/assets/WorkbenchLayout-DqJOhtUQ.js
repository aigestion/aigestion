import { j as e } from './vendor-3d-BTgeB28l.js';
import { r, b as s, u as a } from './vendor-react-DzSuaLpV.js';
import { m as t, A as l } from './vendor-motion-I6wcTx_q.js';
import {
  a4 as i,
  N as o,
  a5 as n,
  a6 as c,
  a7 as d,
  J as x,
  a8 as p,
  a9 as h,
  aa as u,
  o as b,
  K as m,
  ab as g,
  ac as f,
} from './vendor-ui-DAuP2EEx.js';
import { Dashboard as v } from './Dashboard-Sq5Wbxao.js';
import './useDanielaVoice-DGiZ24v-.js';
const j = r.createContext(void 0),
  y = ({ children: s }) => {
    const [a, t] = r.useState('dashboard'),
      [l, i] = r.useState(!0),
      o = () => i(e => !e);
    return e.jsx(j.Provider, {
      value: {
        activeActivity: a,
        setActiveActivity: e => {
          a === e ? o() : (t(e), i(!0));
        },
        isSidebarOpen: l,
        toggleSidebar: o,
        setSidebarOpen: i,
      },
      children: s,
    });
  },
  w = () => {
    const e = r.useContext(j);
    if (!e) throw new Error('useWorkbench must be used within a WorkbenchProvider');
    return e;
  },
  N = ({ activityBar: r, sideBar: s, mainArea: a, bottomPanel: i, statusBar: o }) => {
    const { isSidebarOpen: n } = w();
    return e.jsxs('div', {
      className:
        'flex flex-col h-screen w-screen overflow-hidden bg-[#050505] text-white selection:bg-cyan-500/30 font-sans',
      children: [
        e.jsxs('div', {
          className: 'fixed inset-0 pointer-events-none z-0 overflow-hidden',
          children: [
            e.jsx('div', {
              className:
                'absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen opacity-50',
            }),
            e.jsx('div', {
              className:
                'absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/10 blur-[150px] rounded-full mix-blend-screen opacity-50',
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'flex flex-1 overflow-hidden z-10 backdrop-blur-[1px]',
          children: [
            e.jsx('aside', {
              className:
                'w-[60px] flex-shrink-0 border-r border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl z-30 flex flex-col justify-between shadow-[4px_0_30px_rgba(0,0,0,0.5)]',
              children: r,
            }),
            e.jsx(t.aside, {
              initial: !1,
              animate: { width: n ? 300 : 0, opacity: n ? 1 : 0 },
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              className:
                'flex-shrink-0 border-r border-white/5 bg-[#0e0e0e]/80 backdrop-blur-md overflow-hidden relative',
              children: e.jsxs('div', {
                className: 'w-[300px] h-full relative',
                children: [
                  e.jsx('div', {
                    className:
                      'absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-50',
                  }),
                  s,
                ],
              }),
            }),
            e.jsxs('main', {
              className: 'flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden relative',
              children: [
                e.jsx('div', {
                  className:
                    'flex-1 overflow-hidden relative rounded-tl-xl border-t border-l border-white/5 bg-[#121212]/60 backdrop-blur-sm shadow-inner mx-1 mt-1 transition-all',
                  children: a,
                }),
                e.jsx(l, {
                  children:
                    i &&
                    e.jsx(t.div, {
                      initial: { height: 0 },
                      animate: { height: 200 },
                      exit: { height: 0 },
                      className: 'h-[200px] border-t border-white/10 bg-[#1e1e1e]',
                      children: i,
                    }),
                }),
              ],
            }),
          ],
        }),
        e.jsx('footer', {
          className:
            'h-[24px] bg-[#007acc]/90 backdrop-blur-md text-white text-[10px] flex items-center px-3 select-none z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] justify-between border-t border-white/10',
          children: o,
        }),
      ],
    });
  },
  k = () => {
    const { activeActivity: r, setActiveActivity: s } = w(),
      a = [
        { id: 'dashboard', icon: i, label: 'Dashboard' },
        { id: 'search', icon: o, label: 'Search' },
        { id: 'ai', icon: n, label: 'Daniela AI' },
        { id: 'files', icon: c, label: 'Projects' },
      ];
    return e.jsxs('div', {
      className: 'flex flex-col items-center py-4 h-full justify-between w-full',
      children: [
        e.jsx('div', {
          className: 'flex flex-col items-center gap-6 w-full',
          children: a.map(a => {
            const t = a.icon,
              l = r === a.id;
            return e.jsxs(
              'button',
              {
                onClick: () => s(a.id),
                title: a.label,
                className: `relative group p-2 transition-all duration-300 w-full flex justify-center\n                 ${l ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}\n               `,
                children: [
                  l &&
                    e.jsxs(e.Fragment, {
                      children: [
                        e.jsx('div', {
                          className:
                            'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[24px] bg-cyan-400 rounded-r-full shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]',
                        }),
                        e.jsx('div', { className: 'absolute inset-0 bg-cyan-400/5 blur-lg' }),
                      ],
                    }),
                  e.jsx(t, {
                    size: 26,
                    strokeWidth: l ? 2 : 1.5,
                    className:
                      'transition-transform duration-300 ' +
                      (l
                        ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                        : 'group-hover:scale-105'),
                  }),
                ],
              },
              a.id
            );
          }),
        }),
        e.jsx('div', {
          className: 'flex flex-col items-center gap-6 w-full pb-4',
          children: e.jsxs('button', {
            onClick: () => s('settings'),
            title: 'Settings',
            className:
              'p-2 transition-colors relative ' +
              ('settings' === r
                ? 'text-purple-400'
                : 'text-gray-500 hover:text-white hover:rotate-90 duration-500'),
            children: [
              'settings' === r &&
                e.jsx('div', { className: 'absolute inset-0 bg-purple-500/10 blur-xl' }),
              e.jsx(d, {
                size: 24,
                strokeWidth: 1.5,
                className: 'settings' === r ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : '',
              }),
            ],
          }),
        }),
      ],
    });
  },
  _ = () =>
    e.jsxs('div', {
      className: 'flex flex-col h-full bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]',
      children: [
        e.jsxs('div', {
          className: 'p-3 border-b border-white/5 flex items-center gap-2 bg-white/5',
          children: [
            e.jsx(x, { size: 14, className: 'text-purple-400' }),
            e.jsx('span', {
              className: 'text-xs font-bold tracking-wider text-purple-100 uppercase',
              children: 'Daniela AI Assistant',
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'flex-1 overflow-y-auto p-4 space-y-4',
          children: [
            e.jsxs('div', {
              className: 'flex gap-3',
              children: [
                e.jsx('div', {
                  className:
                    'w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0 border border-purple-500/30',
                  children: e.jsx('span', {
                    className: 'text-[10px] font-bold text-purple-300',
                    children: 'AI',
                  }),
                }),
                e.jsx('div', {
                  className:
                    'bg-white/5 p-3 rounded-tr-xl rounded-b-xl border border-white/10 text-sm text-gray-300 leading-relaxed max-w-[90%] shadow-lg backdrop-blur-sm',
                  children: e.jsx('p', {
                    children:
                      "Hello! I'm integrated into your workbench. I can help you analyze metrics, refactor code, or manage deployment tasks. What's on your mind?",
                  }),
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'flex gap-3 flex-row-reverse',
              children: [
                e.jsx('div', {
                  className:
                    'w-6 h-6 rounded-full bg-cyan-600/20 flex items-center justify-center shrink-0 border border-cyan-500/30',
                  children: e.jsx('span', {
                    className: 'text-[10px] font-bold text-cyan-300',
                    children: 'ME',
                  }),
                }),
                e.jsx('div', {
                  className:
                    'bg-cyan-500/10 p-3 rounded-tl-xl rounded-b-xl border border-cyan-500/20 text-sm text-cyan-100 leading-relaxed shadow-[0_0_15px_rgba(6,182,212,0.1)]',
                  children: e.jsx('p', { children: 'Analyze the current bundle size for me.' }),
                }),
              ],
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'p-3 border-t border-white/10 bg-[#151515]',
          children: [
            e.jsxs('div', {
              className: 'relative',
              children: [
                e.jsx('input', {
                  type: 'text',
                  placeholder: 'Ask Daniela...',
                  className:
                    'w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-900/50 transition-all shadow-inner text-gray-200',
                }),
                e.jsxs('div', {
                  className: 'absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1',
                  children: [
                    e.jsx('button', {
                      className:
                        'p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors',
                      children: e.jsx(p, { size: 14 }),
                    }),
                    e.jsx('button', {
                      className:
                        'p-1.5 hover:bg-purple-500/20 rounded text-purple-400 hover:text-purple-200 transition-colors',
                      children: e.jsx(h, { size: 14 }),
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'text-[10px] text-gray-600 mt-2 flex justify-center gap-3',
              children: [
                e.jsx('span', {
                  className: 'cursor-pointer hover:text-purple-400 transition-colors',
                  children: 'Generate Component',
                }),
                e.jsx('span', {
                  className: 'cursor-pointer hover:text-purple-400 transition-colors',
                  children: 'Fix Bugs',
                }),
                e.jsxs('span', {
                  className: 'cursor-pointer hover:text-purple-400 transition-colors',
                  children: [' ', 'Explain Code'],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  A = () => {
    const { activeActivity: r } = w(),
      t = s(),
      l = a();
    return e.jsxs('div', {
      className: 'h-full flex flex-col font-sans',
      children: [
        e.jsx('div', {
          className:
            'h-[40px] flex items-center px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200/50 select-none border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent shadow-sm',
          children: r,
        }),
        e.jsxs('div', {
          className:
            'flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent',
          children: [
            'dashboard' === r &&
              e.jsxs('div', {
                className: 'text-sm',
                children: [
                  e.jsx('div', {
                    className:
                      'px-4 py-3 text-[10px] font-bold text-gray-500 uppercase opacity-70 tracking-widest',
                    children: 'Main Views',
                  }),
                  e.jsx('ul', {
                    className: 'space-y-1 px-2',
                    children: [
                      { label: 'Overview', path: '/dashboard' },
                      { label: 'Analytics', path: '/dashboard/admin' },
                      { label: 'Client View', path: '/dashboard/client' },
                      { label: 'Billing', path: '/dashboard/billing' },
                    ].map(r => {
                      const s = l.pathname === r.path;
                      return e.jsxs(
                        'li',
                        {
                          onClick: () => t(r.path),
                          className:
                            'cursor-pointer p-2 rounded-md transition-all duration-200 flex items-center gap-3 group border border-transparent \n                      ' +
                            (s
                              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                              : 'text-gray-400 hover:bg-cyan-500/5 hover:text-cyan-200'),
                          children: [
                            e.jsx('div', {
                              className:
                                'w-1.5 h-1.5 rounded-full transition-colors shadow-[0_0_5px_rgba(6,182,212,0)] group-hover:shadow-[0_0_8px_rgba(6,182,212,0.5)]\n                      ' +
                                (s
                                  ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                                  : 'bg-cyan-500/20 group-hover:bg-cyan-400'),
                            }),
                            r.label,
                          ],
                        },
                        r.label
                      );
                    }),
                  }),
                ],
              }),
            'ai' === r &&
              e.jsx('div', { className: 'h-full flex flex-col', children: e.jsx(_, {}) }),
            'search' === r &&
              e.jsx('div', {
                className: 'flex flex-col gap-2 p-3',
                children: e.jsxs('div', {
                  className: 'relative group',
                  children: [
                    e.jsx('input', {
                      type: 'text',
                      placeholder: 'Search anything...',
                      className:
                        'w-full bg-[#181818] border border-[#303030] text-gray-200 text-xs p-2.5 pl-3 rounded-md focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-900/50 placeholder:text-gray-600 transition-all shadow-inner group-hover:bg-[#1f1f1f]',
                    }),
                    e.jsx('div', {
                      className:
                        'absolute right-2 top-2.5 text-[10px] text-gray-600 bg-[#222] px-1.5 rounded border border-[#333] opacity-70',
                      children: 'Ctrl+F',
                    }),
                  ],
                }),
              }),
          ],
        }),
      ],
    });
  },
  z = ({ user: r, onLogout: s }) => {
    const { activeActivity: a } = w();
    return e.jsx('div', {
      className: 'w-full h-full overflow-hidden bg-transparent',
      children: e.jsx('div', {
        className: 'h-full w-full overflow-y-auto custom-scrollbar',
        children: (() => {
          switch (a) {
            case 'dashboard':
            default:
              return e.jsx(v, { user: r, onLogout: s });
            case 'search':
              return e.jsxs('div', {
                className: 'flex flex-col items-center justify-center h-full text-gray-500',
                children: [
                  e.jsx('div', {
                    className: 'text-2xl font-light mb-2',
                    children: 'Global Search',
                  }),
                  e.jsx('p', { children: 'Search results will appear here' }),
                ],
              });
            case 'settings':
              return e.jsxs('div', {
                className: 'p-10 text-white font-sans bg-[#050505] min-h-full',
                children: [
                  e.jsx('h1', {
                    className:
                      'text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500',
                    children: 'Settings',
                  }),
                  e.jsxs('div', {
                    className: 'grid gap-6 max-w-xl',
                    children: [
                      e.jsxs('div', {
                        className:
                          'bg-[#111] p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group',
                        children: [
                          e.jsx('div', {
                            className:
                              'absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity',
                          }),
                          e.jsx('label', {
                            className: 'block text-sm font-bold mb-3 text-gray-300',
                            children: 'Theme Preference',
                          }),
                          e.jsxs('select', {
                            className:
                              'w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-cyan-500/50 outline-none text-gray-300 backdrop-blur-sm',
                            children: [
                              e.jsx('option', { children: 'Cyberpunk Dark (Default)' }),
                              e.jsx('option', { children: 'Nebula Blue' }),
                              e.jsx('option', { children: 'Matrix Green' }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className:
                          'bg-[#111] p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group',
                        children: [
                          e.jsx('div', {
                            className:
                              'absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity',
                          }),
                          e.jsx('label', {
                            className: 'block text-sm font-bold mb-3 text-gray-300',
                            children: 'Daniela Personality',
                          }),
                          e.jsxs('select', {
                            className:
                              'w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500/50 outline-none text-gray-300 backdrop-blur-sm',
                            children: [
                              e.jsx('option', { children: 'Professional (Technical)' }),
                              e.jsx('option', { children: 'Casual (Friendly)' }),
                              e.jsx('option', { children: 'Creative (Brainstorming)' }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              });
          }
        })(),
      }),
    });
  },
  C = () =>
    e.jsxs(e.Fragment, {
      children: [
        e.jsxs('div', {
          className: 'flex items-center gap-4',
          children: [
            e.jsxs('div', {
              className:
                'flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors group',
              children: [
                e.jsx(u, {
                  size: 12,
                  className: 'text-cyan-400 group-hover:drop-shadow-[0_0_5px_cyan]',
                }),
                e.jsx('span', {
                  className: 'font-semibold text-gray-300 group-hover:text-white',
                  children: 'main',
                }),
              ],
            }),
            e.jsxs('div', {
              className:
                'flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors',
              children: [
                e.jsx(b, { size: 12, className: 'text-gray-400' }),
                e.jsx('span', {
                  className: 'text-gray-400 text-[10px]',
                  children: 'Todo Perfecto',
                }),
              ],
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'flex items-center gap-4',
          children: [
            e.jsxs('div', {
              className:
                'flex items-center gap-2 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors',
              children: [
                e.jsx('span', { className: 'text-gray-500', children: 'Ln 14, Col 32' }),
                e.jsx('span', { className: 'text-gray-500', children: 'UTF-8' }),
                e.jsx('span', {
                  className: 'text-cyan-600 font-bold text-[10px]',
                  children: 'TSX',
                }),
              ],
            }),
            e.jsxs('div', {
              className:
                'flex items-center gap-1.5 hover:bg-purple-500/10 px-2 py-0.5 rounded cursor-pointer transition-colors group',
              children: [
                e.jsx(m, { size: 12, className: 'text-purple-400 animate-pulse' }),
                e.jsx('div', {
                  className: 'w-12 h-4 relative overflow-hidden hidden md:block',
                  children: e.jsxs(t.svg, {
                    viewBox: '0 0 100 20',
                    className: 'absolute inset-0 w-full h-full text-purple-400/30',
                    children: [
                      e.jsx(t.path, {
                        d: 'M 0,10 L 20,10 L 25,2 L 30,18 L 35,10 L 100,10',
                        fill: 'none',
                        stroke: 'currentColor',
                        strokeWidth: '1',
                        animate: { x: [0, -100] },
                        transition: { duration: 2, repeat: 1 / 0, ease: 'linear' },
                      }),
                      e.jsx(t.path, {
                        d: 'M 100,10 L 120,10 L 125,2 L 130,18 L 135,10 L 200,10',
                        fill: 'none',
                        stroke: 'currentColor',
                        strokeWidth: '1',
                        animate: { x: [0, -100] },
                        transition: { duration: 2, repeat: 1 / 0, ease: 'linear' },
                      }),
                    ],
                  }),
                }),
                e.jsx('span', {
                  className: 'text-purple-300 group-hover:text-purple-200 transition-colors',
                  children: 'Cerebro: Muy bien',
                }),
              ],
            }),
            e.jsxs('div', {
              className:
                'flex items-center gap-1.5 hover:bg-green-500/10 px-2 py-0.5 rounded cursor-pointer transition-colors',
              children: [
                e.jsx(g, { size: 12, className: 'text-green-400' }),
                e.jsx('span', { className: 'text-green-300', children: 'Conectado' }),
              ],
            }),
            e.jsx(f, { size: 12, className: 'text-gray-400 hover:text-white cursor-pointer' }),
          ],
        }),
      ],
    }),
  L = ({ user: r, onLogout: s }) =>
    e.jsx(y, {
      children: e.jsx(N, {
        activityBar: e.jsx(k, {}),
        sideBar: e.jsx(A, {}),
        mainArea: e.jsx(z, { user: r, onLogout: s }),
        statusBar: e.jsx(C, {}),
      }),
    });
export { L as WorkbenchLayout };
