import { j as e } from './vendor-3d-BTgeB28l.js';
import { r as t } from './vendor-react-DzSuaLpV.js';
import { u as a } from './useSound-azmCqhWP.js';
import { m as i, A as s } from './vendor-motion-I6wcTx_q.js';
import './main-B5DH-ZW_.js';
import './vendor-ui-DAuP2EEx.js';
import './vendor-data-BRBMd6Um.js';
const n = () => {
  const [n, r] = t.useState('medium'),
    [l, o] = t.useState('technology'),
    [c, d] = t.useState(0),
    [x, m] = t.useState(!1),
    { playHover: u, playClick: p } = a(),
    h = [
      { id: 'small', label: 'Peque\xf1a', employees: '1-50', multiplier: 1.2 },
      { id: 'medium', label: 'Mediana', employees: '51-500', multiplier: 2.5 },
      { id: 'large', label: 'Grande', employees: '501-5000', multiplier: 4.8 },
      { id: 'enterprise', label: 'Empresarial', employees: '5000+', multiplier: 8.2 },
    ],
    b = [
      { id: 'technology', label: 'Tecnolog\xeda', baseROI: 450, icon: '\ud83d\udcbb' },
      { id: 'finance', label: 'Finanzas', baseROI: 380, icon: '\ud83d\udcb0' },
      { id: 'healthcare', label: 'Salud', baseROI: 320, icon: '\ud83c\udfe5' },
      { id: 'retail', label: 'Retail', baseROI: 290, icon: '\ud83d\udecd\ufe0f' },
      { id: 'manufacturing', label: 'Manufactura', baseROI: 410, icon: '\ud83c\udfed' },
      { id: 'logistics', label: 'Log\xedstica', baseROI: 360, icon: '\ud83d\ude9a' },
    ];
  t.useEffect(() => {
    g();
  }, [n, l]);
  const g = () => {
      (m(!0),
        setTimeout(() => {
          const e = h.find(e => e.id === n),
            t = b.find(e => e.id === l);
          if (e && t) {
            const a = Math.round(t.baseROI * e.multiplier);
            d(a);
          }
          m(!1);
        }, 1500));
    },
    v = 1e3 * c;
  return e.jsxs('section', {
    id: 'roi',
    className: 'relative py-32 bg-nexus-obsidian overflow-hidden',
    children: [
      e.jsx('div', { className: 'grain-overlay' }),
      e.jsxs('div', {
        className: 'absolute inset-0',
        children: [
          e.jsx('div', {
            className:
              'absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-cyan/20 to-transparent',
          }),
          e.jsx('div', {
            className:
              'absolute inset-0 bg-radial-at-center from-nexus-violet/5 via-transparent to-transparent pointer-events-none',
          }),
          e.jsxs('svg', {
            className: 'absolute inset-0 w-full h-full opacity-20',
            children: [
              e.jsxs('defs', {
                children: [
                  e.jsxs('linearGradient', {
                    id: 'chartGradient',
                    x1: '0%',
                    y1: '0%',
                    x2: '100%',
                    y2: '100%',
                    children: [
                      e.jsx('stop', { offset: '0%', stopColor: '#8A2BE2' }),
                      e.jsx('stop', { offset: '100%', stopColor: '#00F5FF' }),
                    ],
                  }),
                  e.jsxs('filter', {
                    id: 'glow',
                    children: [
                      e.jsx('feGaussianBlur', { stdDeviation: '5', result: 'coloredBlur' }),
                      e.jsxs('feMerge', {
                        children: [
                          e.jsx('feMergeNode', { in: 'coloredBlur' }),
                          e.jsx('feMergeNode', { in: 'SourceGraphic' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              [...Array(8)].map((t, a) =>
                e.jsx(
                  i.path,
                  {
                    d: `M${15 * a} 100 Q${15 * a + 7.5} ${70 - 15 * a} ${15 * a + 15} 0`,
                    stroke: 'url(#chartGradient)',
                    strokeWidth: '1',
                    fill: 'none',
                    filter: 'url(#glow)',
                    initial: { pathLength: 0, opacity: 0 },
                    animate: { pathLength: 1, opacity: [0, 1, 0.5] },
                    transition: { duration: 3, delay: 0.4 * a, repeat: 1 / 0, repeatDelay: 2 },
                  },
                  a
                )
              ),
            ],
          }),
          e.jsx('div', {
            className: 'absolute inset-0',
            children: [...Array(15)].map((t, a) =>
              e.jsx(
                i.div,
                {
                  className: 'absolute w-1 h-1 bg-nexus-cyan/40 rounded-full',
                  style: { left: 100 * Math.random() + '%', top: 100 * Math.random() + '%' },
                  animate: { y: [0, -100, 0], opacity: [0, 0.6, 0], scale: [0, 1.5, 0] },
                  transition: {
                    duration: 4 + 4 * Math.random(),
                    repeat: 1 / 0,
                    delay: 2 * Math.random(),
                  },
                },
                a
              )
            ),
          }),
        ],
      }),
      e.jsxs('div', {
        className: 'relative z-10 max-w-7xl mx-auto px-6',
        children: [
          e.jsxs(i.div, {
            className: 'text-center mb-24',
            initial: { opacity: 0, y: 50 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
            viewport: { once: !0 },
            children: [
              e.jsxs('div', {
                className: 'flex items-center justify-center gap-4 mb-4',
                children: [
                  e.jsx('div', { className: 'w-12 h-0.5 bg-nexus-violet-glow' }),
                  e.jsx('span', {
                    className:
                      'text-nexus-violet-glow text-xs font-orbitron tracking-[0.5em] uppercase',
                    children: 'Sovereign Financial Node',
                  }),
                  e.jsx('div', { className: 'w-12 h-0.5 bg-nexus-violet-glow' }),
                ],
              }),
              e.jsxs('h2', {
                className:
                  'text-5xl md:text-8xl font-orbitron font-black text-white mb-6 tracking-tighter',
                children: [
                  'STRATEGIC ',
                  e.jsx('span', { className: 'text-glow text-nexus-cyan', children: 'ROI HUB' }),
                ],
              }),
              e.jsxs('p', {
                className:
                  'text-xl text-nexus-silver/60 max-w-3xl mx-auto font-light leading-relaxed italic',
                children: [
                  '"La inversi\xf3n no es un gasto cuando el retorno es exponencial. ',
                  e.jsx('br', {}),
                  'Visualiza el impacto real de la inteligencia soberana en tu ecosistema."',
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'grid lg:grid-cols-12 gap-8 mb-20',
            children: [
              e.jsxs(i.div, {
                className: 'lg:col-span-5 space-y-8',
                initial: { opacity: 0, x: -30 },
                whileInView: { opacity: 1, x: 0 },
                transition: { duration: 0.8 },
                viewport: { once: !0 },
                children: [
                  e.jsxs('div', {
                    className:
                      'premium-glass p-8 rounded-[2.5rem] border-white/5 bg-white/2 backdrop-blur-xl',
                    children: [
                      e.jsx('h3', {
                        className:
                          'text-xl font-orbitron font-bold text-white mb-8 border-l-4 border-nexus-cyan pl-4',
                        children: 'DIMENSI\xd3N EMPRESARIAL',
                      }),
                      e.jsx('div', {
                        className: 'grid grid-cols-2 gap-4',
                        children: h.map(t =>
                          e.jsxs(
                            i.button,
                            {
                              onClick: () => {
                                (p(), r(t.id));
                              },
                              className:
                                'relative p-5 rounded-2xl border transition-all duration-300 ' +
                                (n === t.id
                                  ? 'border-nexus-cyan bg-nexus-cyan/10 ring-4 ring-nexus-cyan/20'
                                  : 'border-white/10 hover:border-white/20 bg-black/20'),
                              whileHover: { scale: 1.02 },
                              whileTap: { scale: 0.98 },
                              onMouseEnter: u,
                              children: [
                                e.jsx('div', {
                                  className:
                                    'text-sm font-orbitron font-bold mb-1 ' +
                                    (n === t.id ? 'text-nexus-cyan' : 'text-white'),
                                  children: t.label.toUpperCase(),
                                }),
                                e.jsxs('div', {
                                  className: 'text-[10px] text-gray-500 font-mono tracking-widest',
                                  children: [t.employees, ' NODOS'],
                                }),
                                n === t.id &&
                                  e.jsx(i.div, {
                                    layoutId: 'activeSize',
                                    className:
                                      'absolute inset-0 border-2 border-nexus-cyan rounded-2xl pointer-events-none',
                                    transition: { type: 'spring', bounce: 0.2, duration: 0.6 },
                                  }),
                              ],
                            },
                            t.id
                          )
                        ),
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className:
                      'premium-glass p-8 rounded-[2.5rem] border-white/5 bg-white/2 backdrop-blur-xl',
                    children: [
                      e.jsx('h3', {
                        className:
                          'text-xl font-orbitron font-bold text-white mb-8 border-l-4 border-nexus-violet pl-4',
                        children: 'SECTOR ANAL\xcdTICO',
                      }),
                      e.jsx('div', {
                        className: 'grid grid-cols-3 gap-3',
                        children: b.map(t =>
                          e.jsxs(
                            i.button,
                            {
                              onClick: () => {
                                (p(), o(t.id));
                              },
                              className:
                                'flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ' +
                                (l === t.id
                                  ? 'border-nexus-violet bg-nexus-violet/10 shadow-[0_0_20px_rgba(138,43,226,0.2)]'
                                  : 'border-white/5 hover:border-white/10'),
                              whileHover: { scale: 1.05 },
                              onMouseEnter: u,
                              children: [
                                e.jsx('span', { className: 'text-2xl mb-2', children: t.icon }),
                                e.jsx('span', {
                                  className:
                                    'text-[10px] font-orbitron font-bold text-gray-300 tracking-tighter truncate w-full text-center',
                                  children: t.label.toUpperCase(),
                                }),
                              ],
                            },
                            t.id
                          )
                        ),
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx(i.div, {
                className: 'lg:col-span-7 space-y-8',
                initial: { opacity: 0, x: 30 },
                whileInView: { opacity: 1, x: 0 },
                transition: { duration: 0.8, delay: 0.2 },
                viewport: { once: !0 },
                children: e.jsxs('div', {
                  className:
                    'premium-glass p-10 rounded-[3rem] border-nexus-cyan/20 bg-gradient-to-br from-nexus-cyan/5 to-transparent relative overflow-hidden h-full flex flex-col justify-center',
                  children: [
                    e.jsx('div', {
                      className: 'absolute top-0 right-0 p-8',
                      children: e.jsx('div', {
                        className:
                          'w-16 h-16 border-2 border-nexus-cyan/20 rounded-full flex items-center justify-center animate-spin-slow',
                        children: e.jsx('div', {
                          className:
                            'w-10 h-10 border-2 border-nexus-violet/30 rounded-full flex items-center justify-center animate-reverse-spin',
                          children: e.jsx('div', {
                            className:
                              'w-4 h-4 bg-nexus-cyan shadow-[0_0_15px_rgba(0,245,255,1)] rounded-full',
                          }),
                        }),
                      }),
                    }),
                    e.jsx('h4', {
                      className:
                        'text-nexus-cyan text-xs font-orbitron tracking-[0.4em] mb-8 uppercase text-left pl-2',
                      children: 'Quantum Projection Outcome',
                    }),
                    e.jsx(s, {
                      mode: 'wait',
                      children: x
                        ? e.jsxs(
                            i.div,
                            {
                              className: 'py-20 flex flex-col items-center justify-center',
                              initial: { opacity: 0 },
                              animate: { opacity: 1 },
                              exit: { opacity: 0 },
                              children: [
                                e.jsx('div', {
                                  className:
                                    'text-8xl font-orbitron font-black text-white/5 blur-sm animate-pulse',
                                  children: '000.0%',
                                }),
                                e.jsx('p', {
                                  className:
                                    'text-nexus-cyan font-mono text-[10px] mt-4 tracking-[0.8em] animate-pulse uppercase',
                                  children: 'Synchronizing Data Streams...',
                                }),
                              ],
                            },
                            'calculating'
                          )
                        : e.jsxs(
                            i.div,
                            {
                              className: 'relative py-12',
                              initial: { opacity: 0, scale: 0.9 },
                              animate: { opacity: 1, scale: 1 },
                              transition: { type: 'spring', damping: 20 },
                              children: [
                                e.jsxs('div', {
                                  className:
                                    'text-8xl md:text-[10rem] font-orbitron font-black text-white leading-none tracking-tighter',
                                  children: [
                                    e.jsx(i.span, {
                                      initial: { opacity: 0 },
                                      animate: { opacity: 1 },
                                      className:
                                        'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]',
                                      children: c,
                                    }),
                                    e.jsx('span', {
                                      className:
                                        'text-nexus-cyan text-glow text-6xl md:text-8xl relative -top-8',
                                      children: '%',
                                    }),
                                  ],
                                }),
                                e.jsxs('div', {
                                  className:
                                    'flex items-center justify-between mt-8 border-t border-white/10 pt-8',
                                  children: [
                                    e.jsxs('div', {
                                      className: 'text-left',
                                      children: [
                                        e.jsx('p', {
                                          className:
                                            'text-nexus-silver/40 text-xs font-orbitron tracking-widest uppercase mb-1',
                                          children: 'Impacto Financiero Bruto',
                                        }),
                                        e.jsxs('div', {
                                          className: 'text-4xl text-white font-orbitron font-black',
                                          children: [
                                            ((y = v),
                                            new Intl.NumberFormat('es-ES', {
                                              style: 'currency',
                                              currency: 'EUR',
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 0,
                                            }).format(y)),
                                            ' ',
                                            e.jsx('span', {
                                              className: 'text-lg text-nexus-cyan/60',
                                              children: '/A\xd1O',
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    e.jsxs('div', {
                                      className: 'text-right',
                                      children: [
                                        e.jsx('p', {
                                          className:
                                            'text-nexus-silver/40 text-xs font-orbitron tracking-widest uppercase mb-1',
                                          children: 'Efficiency Ratio',
                                        }),
                                        e.jsx('div', {
                                          className:
                                            'text-2xl text-nexus-violet-glow font-orbitron font-bold',
                                          children: '12:1 ROI',
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            },
                            'result'
                          ),
                    }),
                  ],
                }),
              }),
            ],
          }),
          e.jsx('div', {
            className: 'grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20',
            children: [
              {
                category: 'Automatizaci\xf3n',
                value: 45,
                description: 'Reducci\xf3n de tareas manuales',
              },
              { category: 'Eficiencia', value: 67, description: 'Aumento de productividad' },
              { category: 'Costos', value: -38, description: 'Reducci\xf3n de gastos operativos' },
              { category: 'Innovaci\xf3n', value: 89, description: 'Capacidad de innovaci\xf3n' },
              {
                category: 'Satisfacci\xf3n',
                value: 72,
                description: 'Mejora en satisfacci\xf3n del cliente',
              },
              { category: 'Velocidad', value: 156, description: 'Aceleraci\xf3n de procesos' },
            ].map((t, a) =>
              e.jsxs(
                i.div,
                {
                  className: 'premium-glass p-6 rounded-3xl border-white/5 text-center group',
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  transition: { delay: 0.1 * a },
                  viewport: { once: !0 },
                  whileHover: { y: -10, backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                  children: [
                    e.jsxs('div', {
                      className:
                        'text-3xl font-orbitron font-black mb-2 ' +
                        (t.value > 0 ? 'text-nexus-cyan' : 'text-nexus-violet-glow'),
                      children: [t.value > 0 ? '+' : '', t.value, '%'],
                    }),
                    e.jsx('div', {
                      className:
                        'text-[10px] font-orbitron text-white font-bold tracking-widest mb-1 uppercase',
                      children: t.category,
                    }),
                    e.jsx('div', {
                      className:
                        'text-[8px] text-gray-500 uppercase leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                      children: t.description,
                    }),
                  ],
                },
                t.category
              )
            ),
          }),
          e.jsx(i.div, {
            className: 'text-center',
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: 0.4 },
            viewport: { once: !0 },
            children: e.jsxs('div', {
              className: 'inline-block relative group',
              children: [
                e.jsx('div', {
                  className:
                    'absolute -inset-1 bg-gradient-to-r from-nexus-violet to-nexus-cyan rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200',
                }),
                e.jsxs('div', {
                  className:
                    'relative premium-glass px-16 py-12 rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden',
                  children: [
                    e.jsx('div', {
                      className:
                        'absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-violet via-white to-nexus-cyan',
                    }),
                    e.jsxs('h3', {
                      className:
                        'text-4xl font-orbitron font-black text-white mb-6 tracking-tighter',
                      children: [
                        'ELEVACI\xd3N EMPRESARIAL ',
                        e.jsx('span', {
                          className: 'text-nexus-cyan text-glow',
                          children: 'INMEDIATA',
                        }),
                      ],
                    }),
                    e.jsx('p', {
                      className:
                        'text-nexus-silver/60 mb-10 max-w-lg mx-auto text-lg leading-relaxed',
                      children:
                        'Nuestros algoritmos est\xe1n listos para fusionarse con tu estructura actual. Activa tu nodo de inteligencia hoy.',
                    }),
                    e.jsx('button', {
                      className:
                        'btn-enterprise px-12 py-6 text-xl font-orbitron font-black tracking-widest rounded-full hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all duration-300',
                      children: 'INICIAR DESPLIEGUE',
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
  var y;
};
export { n as EnhancedROI };
