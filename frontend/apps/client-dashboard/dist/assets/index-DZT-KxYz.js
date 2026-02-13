import {
  j as e,
  m as i,
  S as N,
  A as j,
  C as v,
  B as b,
  T as k,
  U as C,
  a as P,
  b as S,
  Z as A,
  d as R,
} from './ui-CVxAYDKV.js';
import { b as E, a as m } from './vendor-DjL-6nTd.js';
import { Q as L, a as T } from './state-fSQkC2wF.js';
import { R as O, a as x, B as $ } from './router-Co20_e4D.js';
import {
  R as B,
  L as D,
  C as F,
  X as I,
  Y as M,
  T as H,
  a as K,
  b as f,
} from './charts-aZ4A3xvc.js';
(function () {
  const c = document.createElement('link').relList;
  if (c && c.supports && c.supports('modulepreload')) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s);
  new MutationObserver(s => {
    for (const a of s)
      if (a.type === 'childList')
        for (const d of a.addedNodes) d.tagName === 'LINK' && d.rel === 'modulepreload' && n(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function l(s) {
    const a = {};
    return (
      s.integrity && (a.integrity = s.integrity),
      s.referrerPolicy && (a.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === 'use-credentials'
        ? (a.credentials = 'include')
        : s.crossOrigin === 'anonymous'
          ? (a.credentials = 'omit')
          : (a.credentials = 'same-origin'),
      a
    );
  }
  function n(s) {
    if (s.ep) return;
    s.ep = !0;
    const a = l(s);
    fetch(s.href, a);
  }
})();
var w,
  y = E;
((w = y.createRoot), y.hydrateRoot);
const g = '/api',
  U = {
    getSystemHealth: async () => {
      try {
        const t = await fetch(`${g}/system/health`);
        if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
        return await t.json();
      } catch (t) {
        throw (console.error('Error fetching system health:', t), t);
      }
    },
    getSystemDiagnostic: async () => {
      try {
        const t = await fetch(`${g}/system/diagnostic`);
        if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
        return await t.json();
      } catch (t) {
        throw (console.error('Error fetching system diagnostics:', t), t);
      }
    },
  },
  h = () => {
    var p;
    const [t, c] = m.useState(null),
      [l, n] = m.useState('checking');
    m.useEffect(() => {
      const r = async () => {
        try {
          const u = await U.getSystemHealth();
          (c(u), n('connected'));
        } catch {
          n('error');
        }
      };
      r();
      const o = setInterval(r, 3e4);
      return () => clearInterval(o);
    }, []);
    const s = [
        { title: 'Proyectos Activos', value: '8', icon: b, color: 'text-emerald-400' },
        { title: 'Tasa de Éxito', value: '94.2%', icon: k, color: 'text-blue-400' },
        { title: 'Clientes Satisfechos', value: '156', icon: C, color: 'text-purple-400' },
        { title: 'Logros Conseguidos', value: '23', icon: P, color: 'text-orange-400' },
      ],
      a = [
        { name: 'Ene', completado: 65, objetivo: 80 },
        { name: 'Feb', completado: 78, objetivo: 85 },
        { name: 'Mar', completado: 82, objetivo: 90 },
        { name: 'Abr', completado: 91, objetivo: 95 },
        { name: 'May', completado: 88, objetivo: 92 },
        { name: 'Jun', completado: 95, objetivo: 98 },
      ],
      d = [
        { title: '🚀 Primer Proyecto', description: 'Completado con éxito', unlocked: !0 },
        { title: '⭐ Cliente Feliz', description: '5 estrellas de satisfacción', unlocked: !0 },
        { title: '🎯 Meta Mensual', description: 'Alcanzado el objetivo', unlocked: !0 },
        { title: '💎 Experto Nivel 5', description: 'En progreso...', unlocked: !1 },
      ];
    return e.jsxs('div', {
      className: 'p-6 space-y-6',
      children: [
        e.jsxs(i.div, {
          initial: { y: -20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          className: 'flex items-center justify-between',
          children: [
            e.jsx('h1', {
              className: 'text-4xl font-bold text-white',
              children: '💎 Base Personal',
            }),
            e.jsx('div', {
              className: 'flex space-x-4',
              children: e.jsx('button', {
                className: 'p-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors',
                children: e.jsx(N, { className: 'w-5 h-5 text-white' }),
              }),
            }),
          ],
        }),
        e.jsxs(i.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: 'flex items-center space-x-2 mb-4',
          children: [
            e.jsx('div', {
              className: `px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${l === 'connected' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : l === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`,
              children:
                l === 'connected'
                  ? e.jsxs(e.Fragment, {
                      children: [
                        e.jsx(j, { className: 'w-3 h-3' }),
                        e.jsx('span', { children: 'System Online' }),
                      ],
                    })
                  : l === 'error'
                    ? e.jsxs(e.Fragment, {
                        children: [
                          e.jsx(v, { className: 'w-3 h-3' }),
                          e.jsx('span', { children: 'System Offline' }),
                        ],
                      })
                    : e.jsxs(e.Fragment, {
                        children: [
                          e.jsx(j, { className: 'w-3 h-3 animate-pulse' }),
                          e.jsx('span', { children: 'Connecting...' }),
                        ],
                      }),
            }),
            ((p = t == null ? void 0 : t.data) == null ? void 0 : p.version) &&
              e.jsxs('span', {
                className: 'text-xs text-white/30',
                children: ['v', t.data.version],
              }),
          ],
        }),
        e.jsx('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
          children: s.map((r, o) =>
            e.jsx(
              i.div,
              {
                initial: { y: 20, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                transition: { delay: o * 0.1 },
                className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
                children: e.jsxs('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    e.jsxs('div', {
                      children: [
                        e.jsx('p', { className: 'text-white/70 text-sm', children: r.title }),
                        e.jsx('p', {
                          className: 'text-2xl font-bold text-white',
                          children: r.value,
                        }),
                      ],
                    }),
                    e.jsx(r.icon, { className: `w-8 h-8 ${r.color}` }),
                  ],
                }),
              },
              o
            )
          ),
        }),
        e.jsxs('div', {
          className: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
          children: [
            e.jsxs(i.div, {
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
              children: [
                e.jsx('h2', {
                  className: 'text-xl font-semibold text-white mb-4',
                  children: '📈 Progreso de Proyectos',
                }),
                e.jsx(B, {
                  width: '100%',
                  height: 300,
                  children: e.jsxs(D, {
                    data: a,
                    children: [
                      e.jsx(F, { strokeDasharray: '3 3', stroke: '#ffffff20' }),
                      e.jsx(I, { dataKey: 'name', stroke: '#ffffff' }),
                      e.jsx(M, { stroke: '#ffffff' }),
                      e.jsx(H, { contentStyle: { backgroundColor: '#1f2937', border: 'none' } }),
                      e.jsx(K, {}),
                      e.jsx(f, {
                        type: 'monotone',
                        dataKey: 'completado',
                        stroke: '#10b981',
                        strokeWidth: 2,
                      }),
                      e.jsx(f, {
                        type: 'monotone',
                        dataKey: 'objetivo',
                        stroke: '#3b82f6',
                        strokeWidth: 2,
                        strokeDasharray: '5 5',
                      }),
                    ],
                  }),
                }),
              ],
            }),
            e.jsxs(i.div, {
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
              children: [
                e.jsx('h2', {
                  className: 'text-xl font-semibold text-white mb-4',
                  children: '🏆 Logros y Trofeos',
                }),
                e.jsx('div', {
                  className: 'space-y-3',
                  children: d.map((r, o) =>
                    e.jsx(
                      i.div,
                      {
                        initial: { x: -20, opacity: 0 },
                        animate: { x: 0, opacity: 1 },
                        transition: { delay: o * 0.1 },
                        className: `p-3 rounded-lg border ${r.unlocked ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-gray-500/20 border-gray-500/50'}`,
                        children: e.jsxs('div', {
                          className: 'flex items-center space-x-3',
                          children: [
                            e.jsx('div', {
                              className: `text-2xl ${r.unlocked ? '' : 'opacity-50'}`,
                              children: r.unlocked
                                ? e.jsx(S, { className: 'w-6 h-6 text-emerald-400' })
                                : '🔒',
                            }),
                            e.jsxs('div', {
                              className: 'flex-1',
                              children: [
                                e.jsx('h3', {
                                  className: `font-semibold ${r.unlocked ? 'text-white' : 'text-gray-400'}`,
                                  children: r.title,
                                }),
                                e.jsx('p', {
                                  className: `text-sm ${r.unlocked ? 'text-white/70' : 'text-gray-500'}`,
                                  children: r.description,
                                }),
                              ],
                            }),
                          ],
                        }),
                      },
                      o
                    )
                  ),
                }),
              ],
            }),
          ],
        }),
        e.jsxs(i.div, {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          className: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
          children: [
            e.jsxs('div', {
              className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
              children: [
                e.jsxs('h3', {
                  className: 'text-lg font-semibold text-white mb-4 flex items-center',
                  children: [
                    e.jsx(b, { className: 'w-5 h-5 mr-2 text-emerald-400' }),
                    'Proyectos Recientes',
                  ],
                }),
                e.jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    e.jsxs('div', {
                      className: 'p-2 bg-emerald-500/20 rounded border border-emerald-500/50',
                      children: [
                        e.jsx('p', {
                          className: 'text-white font-medium',
                          children: 'Dashboard Analytics',
                        }),
                        e.jsx('p', {
                          className: 'text-white/70 text-sm',
                          children: 'Completado • 100%',
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className: 'p-2 bg-blue-500/20 rounded border border-blue-500/50',
                      children: [
                        e.jsx('p', {
                          className: 'text-white font-medium',
                          children: 'API Integration',
                        }),
                        e.jsx('p', {
                          className: 'text-white/70 text-sm',
                          children: 'En progreso • 75%',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
              children: [
                e.jsxs('h3', {
                  className: 'text-lg font-semibold text-white mb-4 flex items-center',
                  children: [
                    e.jsx(A, { className: 'w-5 h-5 mr-2 text-yellow-400' }),
                    'Actividad Reciente',
                  ],
                }),
                e.jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    e.jsxs('div', {
                      className: 'flex justify-between text-white/70',
                      children: [
                        e.jsx('span', { children: 'Último login' }),
                        e.jsx('span', { className: 'text-emerald-400', children: 'Hace 2h' }),
                      ],
                    }),
                    e.jsxs('div', {
                      className: 'flex justify-between text-white/70',
                      children: [
                        e.jsx('span', { children: 'Proyectos actualizados' }),
                        e.jsx('span', { className: 'text-blue-400', children: '3' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
              children: [
                e.jsxs('h3', {
                  className: 'text-lg font-semibold text-white mb-4 flex items-center',
                  children: [
                    e.jsx(R, { className: 'w-5 h-5 mr-2 text-purple-400' }),
                    'Métricas de Crecimiento',
                  ],
                }),
                e.jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    e.jsxs('div', {
                      className: 'flex justify-between text-white/70',
                      children: [
                        e.jsx('span', { children: 'Proyectos este mes' }),
                        e.jsx('span', { className: 'text-emerald-400', children: '+2' }),
                      ],
                    }),
                    e.jsxs('div', {
                      className: 'flex justify-between text-white/70',
                      children: [
                        e.jsx('span', { children: 'Satisfacción cliente' }),
                        e.jsx('span', { className: 'text-purple-400', children: '+5%' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };
function q() {
  return e.jsx(i.div, {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
    className: 'min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900',
    children: e.jsxs(O, {
      children: [
        e.jsx(x, { path: '/', element: e.jsx(h, {}) }),
        e.jsx(x, { path: '/dashboard', element: e.jsx(h, {}) }),
        e.jsx(x, { path: '*', element: e.jsx(h, {}) }),
      ],
    }),
  });
}
const z = new L({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: !1 } } });
w(document.getElementById('root')).render(
  e.jsx(m.StrictMode, {
    children: e.jsx(T, { client: z, children: e.jsx($, { children: e.jsx(q, {}) }) }),
  })
);
//# sourceMappingURL=index-DZT-KxYz.js.map
