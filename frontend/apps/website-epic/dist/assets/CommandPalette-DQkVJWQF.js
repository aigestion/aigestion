import { j as e } from './vendor-3d-BTgeB28l.js';
import { u as t } from './useSound-azmCqhWP.js';
import { r as a } from './vendor-react-DzSuaLpV.js';
import { A as s, m as r } from './vendor-motion-I6wcTx_q.js';
import { N as n, O as o, Q as i, Y as c, q as l, _ as d, Z as x } from './vendor-ui-DAuP2EEx.js';
import './main-B5DH-ZW_.js';
import './vendor-data-BRBMd6Um.js';
const m = () => {
  const { playHover: m, playClick: p } = t(),
    [h, u] = a.useState(!1),
    [y, w] = a.useState(''),
    [f, j] = a.useState(0),
    v = [
      {
        id: '1',
        icon: e.jsx(o, { className: 'w-4 h-4' }),
        title: 'Explorar Mapa Global',
        path: '/map',
        shortcut: 'G M',
      },
      {
        id: '2',
        icon: e.jsx(i, { className: 'w-4 h-4' }),
        title: 'Ver Planes y Precios',
        path: '/pricing',
        shortcut: 'P',
      },
      {
        id: '3',
        icon: e.jsx(c, { className: 'w-4 h-4' }),
        title: 'Contactar Ventas',
        path: '/contact',
        shortcut: 'C',
      },
      {
        id: '4',
        icon: e.jsx(l, { className: 'w-4 h-4' }),
        title: 'Documentaci\xf3n API',
        path: '/docs',
        shortcut: 'D',
      },
      {
        id: '5',
        icon: e.jsx(d, { className: 'w-4 h-4' }),
        title: 'Estado del Sistema',
        path: '/status',
      },
      {
        id: '6',
        icon: e.jsx(x, { className: 'w-4 h-4' }),
        title: 'Iniciar Prueba Gratuita',
        action: () => alert('Starting Trial...'),
      },
    ].filter(e => e.title.toLowerCase().includes(y.toLowerCase()));
  (a.useEffect(() => {
    const e = e => {
      ('k' === e.key && (e.metaKey || e.ctrlKey) && (e.preventDefault(), h ? p() : m(), u(e => !e)),
        'Escape' === e.key && u(!1));
    };
    return (window.addEventListener('keydown', e), () => window.removeEventListener('keydown', e));
  }, []),
    a.useEffect(() => {
      j(0);
    }, [y]));
  const b = e => {
    const t = v[e];
    t && (t.action && t.action(), t.path, u(!1), w(''));
  };
  return e.jsx(s, {
    children:
      h &&
      e.jsxs('div', {
        className: 'fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] font-sans',
        children: [
          e.jsx(r.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            onClick: () => u(!1),
            className: 'absolute inset-0 bg-black/80 backdrop-blur-md',
          }),
          e.jsxs(r.div, {
            initial: { opacity: 0, scale: 0.95, y: -20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: -20 },
            className:
              'relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col',
            children: [
              e.jsxs('div', {
                className: 'flex items-center px-4 py-4 border-b border-white/5',
                children: [
                  e.jsx(n, { className: 'w-5 h-5 text-nexus-cyan mr-3' }),
                  e.jsx('input', {
                    autoFocus: !0,
                    type: 'text',
                    placeholder: 'Escribe un comando o busca...',
                    value: y,
                    onChange: e => w(e.target.value),
                    onKeyDown: e => {
                      ('ArrowDown' === e.key &&
                        (e.preventDefault(), j(e => Math.min(e + 1, v.length - 1))),
                        'ArrowUp' === e.key && (e.preventDefault(), j(e => Math.max(e - 1, 0))),
                        'Enter' === e.key && b(f));
                    },
                    className:
                      'w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg font-mono',
                  }),
                  e.jsx('div', {
                    className:
                      'text-xs text-gray-400 font-mono border border-white/10 px-2 py-1 rounded',
                    children: 'ESC',
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'max-h-[60vh] overflow-y-auto py-2',
                children: [
                  v.map((t, a) =>
                    e.jsxs(
                      'div',
                      {
                        onClick: () => b(a),
                        onMouseEnter: () => j(a),
                        className:
                          'px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ' +
                          (a === f
                            ? 'bg-nexus-cyan/10 border-l-2 border-nexus-cyan'
                            : 'border-l-2 border-transparent'),
                        children: [
                          e.jsxs('div', {
                            className: 'flex items-center gap-3',
                            children: [
                              e.jsx('div', {
                                className:
                                  'p-2 rounded-lg ' +
                                  (a === f
                                    ? 'text-nexus-cyan bg-nexus-cyan/10'
                                    : 'text-gray-400 bg-white/5'),
                                children: t.icon,
                              }),
                              e.jsx('span', {
                                className:
                                  'text-sm font-medium ' +
                                  (a === f ? 'text-white' : 'text-gray-400'),
                                children: t.title,
                              }),
                            ],
                          }),
                          t.shortcut &&
                            e.jsx('span', {
                              className: 'text-xs text-gray-500 font-mono tracking-widest',
                              children: t.shortcut,
                            }),
                        ],
                      },
                      t.id
                    )
                  ),
                  0 === v.length &&
                    e.jsxs('div', {
                      className: 'px-4 py-8 text-center text-gray-500 text-sm',
                      children: ['No se encontraron resultados para "', y, '"'],
                    }),
                ],
              }),
              e.jsxs('div', {
                className:
                  'px-4 py-2 bg-white/5 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono',
                children: [
                  e.jsx('span', { children: '\u2191\u2193 para navegar' }),
                  e.jsx('span', { children: 'AIGESTION COMMAND CENTER v2.0' }),
                ],
              }),
            ],
          }),
        ],
      }),
  });
};
export { m as CommandPalette };
