import { j as e } from './vendor-3d-BTgeB28l.js';
import { r as s, d as t } from './vendor-react-DzSuaLpV.js';
import { u as i } from './useDanielaVoice-DGiZ24v-.js';
import { m as a, A as n } from './vendor-motion-I6wcTx_q.js';
import {
  ad as l,
  a8 as r,
  a9 as o,
  X as c,
  M as d,
  Y as x,
  _ as m,
  B as h,
  ae as u,
  a7 as b,
  af as p,
  ag as j,
  ah as f,
} from './vendor-ui-DAuP2EEx.js';
const g = '/api',
  v = async () => {
    try {
      const e = await fetch(`${g}/system/health`);
      if (!e.ok) throw new Error(`HTTP error! status: ${e.status}`);
      return await e.json();
    } catch (e) {
      throw e;
    }
  },
  w = () => {
    const [t, n] = s.useState([
        { role: 'ai', text: 'Hola, soy Daniela. \xbfEn qu\xe9 puedo ayudarte hoy?' },
      ]),
      [c, d] = s.useState(''),
      { isListening: x, transcript: m, isSpeaking: h, toggleListening: u, speak: b } = i(),
      p = s.useRef(null);
    (s.useEffect(() => {
      m && d(m);
    }, [m]),
      s.useEffect(() => {
        p.current?.scrollIntoView({ behavior: 'smooth' });
      }, [t]));
    const j = () => {
      c.trim() &&
        (n(e => [...e, { role: 'user', text: c }]),
        d(''),
        setTimeout(() => {
          const e = [
              'Entendido. Estoy procesando esa solicitud.',
              'He actualizado los par\xe1metros del sistema seg\xfan tus indicaciones.',
              'Analizando los datos... Aqu\xed tienes el reporte.',
              'Excelente elecci\xf3n. Procediendo con la ejecuci\xf3n.',
              'Sistemas nominales. \xbfDeseas algo m\xe1s?',
            ],
            s = e[Math.floor(Math.random() * e.length)];
          (n(e => [...e, { role: 'ai', text: s }]), b(s));
        }, 1e3));
    };
    return e.jsxs('div', {
      className:
        'flex flex-col h-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden',
      children: [
        e.jsxs('div', {
          className: 'p-4 border-b border-white/5 flex justify-between items-center bg-black/20',
          children: [
            e.jsxs('div', {
              className: 'flex items-center gap-3',
              children: [
                e.jsxs('div', {
                  className: 'relative',
                  children: [
                    e.jsx('div', {
                      className:
                        'w-10 h-10 rounded-full overflow-hidden border-2 border-nexus-cyan',
                      children: e.jsx('img', {
                        src: '/images/daniela-avatar.jpg',
                        alt: 'Daniela',
                        className: 'w-full h-full object-cover',
                        onError: e =>
                          (e.currentTarget.src =
                            'https://ui-avatars.com/api/?name=Daniela+AI&background=00f5ff&color=fff'),
                      }),
                    }),
                    e.jsx('div', {
                      className:
                        'absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black',
                    }),
                  ],
                }),
                e.jsxs('div', {
                  children: [
                    e.jsx('h3', {
                      className: 'text-white font-bold text-sm',
                      children: 'Daniela AI',
                    }),
                    e.jsx('p', {
                      className: 'text-nexus-cyan text-xs font-mono',
                      children: 'ONLINE // V2.4',
                    }),
                  ],
                }),
              ],
            }),
            e.jsx('div', {
              className: 'flex gap-2',
              children:
                h &&
                e.jsxs('div', {
                  className: 'flex gap-1 h-3 items-end',
                  children: [
                    e.jsx(a.div, {
                      className: 'w-1 bg-nexus-cyan',
                      animate: { height: [4, 12, 4] },
                      transition: { repeat: 1 / 0, duration: 0.5 },
                    }),
                    e.jsx(a.div, {
                      className: 'w-1 bg-nexus-cyan',
                      animate: { height: [6, 10, 2] },
                      transition: { repeat: 1 / 0, duration: 0.4 },
                    }),
                    e.jsx(a.div, {
                      className: 'w-1 bg-nexus-cyan',
                      animate: { height: [2, 8, 3] },
                      transition: { repeat: 1 / 0, duration: 0.6 },
                    }),
                  ],
                }),
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'flex-1 overflow-y-auto p-4 space-y-4',
          children: [
            t.map((s, t) =>
              e.jsx(
                a.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  className: 'flex ' + ('user' === s.role ? 'justify-end' : 'justify-start'),
                  children: e.jsx('div', {
                    className:
                      'max-w-[80%] p-3 rounded-2xl text-sm ' +
                      ('user' === s.role
                        ? 'bg-nexus-violet/20 text-white rounded-tr-sm border border-nexus-violet/30'
                        : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'),
                    children: s.text,
                  }),
                },
                t
              )
            ),
            e.jsx('div', { ref: p }),
          ],
        }),
        e.jsx('div', {
          className: 'p-4 border-t border-white/5 bg-black/20',
          children: e.jsxs('div', {
            className: 'relative flex items-center gap-2',
            children: [
              e.jsx('button', {
                onClick: u,
                className:
                  'p-3 rounded-full transition-all ' +
                  (x
                    ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/50'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'),
                children: x ? e.jsx(l, { size: 20 }) : e.jsx(r, { size: 20 }),
              }),
              e.jsx('input', {
                type: 'text',
                value: c,
                onChange: e => d(e.target.value),
                onKeyDown: e => 'Enter' === e.key && j(),
                placeholder: 'Escribe un mensaje...',
                className:
                  'flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white text-sm focus:outline-none focus:border-nexus-cyan/50 placeholder-gray-500',
              }),
              e.jsx('button', {
                onClick: j,
                className:
                  'p-3 bg-nexus-cyan text-black rounded-full hover:bg-cyan-400 transition-colors',
                children: e.jsx(o, { size: 18 }),
              }),
            ],
          }),
        }),
      ],
    });
  },
  N = ({ user: i, onLogout: l }) => {
    const [r, o] = s.useState('daniela'),
      [g, N] = s.useState(!1),
      [y, k] = s.useState(null),
      [E, A] = s.useState('checking');
    t.useEffect(() => {
      const e = async () => {
        try {
          const e = await v();
          (k(e), A('connected'));
        } catch (e) {
          A('error');
        }
      };
      e();
      const s = setInterval(e, 3e4);
      return () => clearInterval(s);
    }, []);
    const {
        status: S,
        messages: C,
        emotionalAnalysis: D,
        suggestedActions: z,
        isProcessing: I,
      } = (() => {
        const [e, t] = s.useState('idle'),
          [i, a] = s.useState([]),
          [n, l] = s.useState(null),
          [r, o] = s.useState([]),
          [c, d] = s.useState(!1),
          [x, m] = s.useState(!1),
          [h, u] = s.useState(null),
          b = { emotion: 'neutral', confidence: 0.85, sentiment: 'positive' },
          p = [
            {
              id: '1',
              text: 'Ver dashboard principal',
              type: 'navigation',
              priority: 'high',
              context: 'main',
            },
            {
              id: '2',
              text: 'Analizar m\xe9tricas',
              type: 'analysis',
              priority: 'medium',
              context: 'analytics',
            },
            {
              id: '3',
              text: 'Contactar soporte',
              type: 'support',
              priority: 'low',
              context: 'help',
            },
          ];
        s.useEffect(() => {
          (t('connecting'),
            setTimeout(() => {
              (t('active'), l(b), o(p));
            }, 1e3));
        }, []);
        const j = s.useCallback(async () => {
            c ||
              (d(!0),
              u(null),
              setTimeout(() => {
                const e = {
                  id: Date.now().toString(),
                  role: 'user',
                  content: 'Hola Daniela, \xbfc\xf3mo est\xe1s?',
                  timestamp: new Date(),
                  emotionalAnalysis: b,
                };
                (a(s => [...s, e]),
                  setTimeout(() => {
                    const e = {
                      id: (Date.now() + 1).toString(),
                      role: 'assistant',
                      content:
                        '\xa1Hola! Estoy perfectamente, gracias por preguntar. \xbfEn qu\xe9 puedo ayudarte hoy?',
                      timestamp: new Date(),
                      emotionalAnalysis: b,
                    };
                    (a(s => [...s, e]), d(!1));
                  }, 1500));
              }, 2e3));
          }, [c]),
          f = s.useCallback(() => {
            c && d(!1);
          }, [c]),
          g = s.useCallback(
            async e => {
              if (x) return;
              (m(!0), u(null));
              const s = {
                id: Date.now().toString(),
                role: 'user',
                content: e,
                timestamp: new Date(),
                emotionalAnalysis: b,
              };
              (a(e => [...e, s]),
                setTimeout(() => {
                  const e = [
                      'Entendido. Estoy procesando tu solicitud.',
                      'He analizado tu peti\xf3n. Aqu\xed est\xe1 la respuesta.',
                      'Interesante. D\xe9jame generar un reporte para ti.',
                      'Perfecto. Ejecutando la acci\xf3n solicitada.',
                      'Comprendido. \xbfHay algo m\xe1s en lo que pueda ayudarte?',
                    ],
                    s = {
                      id: (Date.now() + 1).toString(),
                      role: 'assistant',
                      content: e[Math.floor(Math.random() * e.length)],
                      timestamp: new Date(),
                      emotionalAnalysis: b,
                    };
                  (a(e => [...e, s]), m(!1));
                }, 1e3));
            },
            [x]
          ),
          v = s.useCallback(() => {
            (a([]), u(null));
          }, []);
        return {
          status: e,
          messages: i,
          emotionalAnalysis: n,
          suggestedActions: r,
          isRecording: c,
          isProcessing: x,
          error: h,
          startRecording: j,
          stopRecording: f,
          sendTextMessage: g,
          clearConversation: v,
        };
      })(i.email),
      T = [
        { id: 'daniela', label: 'Daniela AI', icon: h, color: 'from-nexus-cyan to-nexus-violet' },
        { id: 'analytics', label: 'Analytics', icon: u, color: 'from-green-500 to-emerald-600' },
        { id: 'settings', label: 'Configuraci\xf3n', icon: b, color: 'from-orange-500 to-red-600' },
      ],
      P = {
        free: 'text-nexus-silver',
        premium: 'text-nexus-violet',
        enterprise: 'text-nexus-gold',
      };
    return e.jsxs('div', {
      className: 'min-h-screen bg-nexus-obsidian text-white',
      children: [
        e.jsx('div', {
          className: 'lg:hidden fixed top-4 left-4 z-50',
          children: e.jsx('button', {
            onClick: () => N(!g),
            className: 'p-2 rounded-lg bg-white/5 backdrop-blur-3xl border border-white/10',
            children: g ? e.jsx(c, { className: 'w-5 h-5' }) : e.jsx(d, { className: 'w-5 h-5' }),
          }),
        }),
        e.jsx(n, {
          children: e.jsxs(e.Fragment, {
            children: [
              g &&
                e.jsx(a.div, {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  onClick: () => N(!1),
                  className: 'lg:hidden fixed inset-0 bg-black/50 z-40',
                }),
              e.jsxs(a.aside, {
                initial: { x: -300 },
                animate: { x: 0 },
                exit: { x: -300 },
                transition: { type: 'spring', damping: 25 },
                className:
                  'fixed lg:relative z-50 w-72 h-screen bg-nexus-obsidian-deep border-r border-white/10 ' +
                  (g ? 'block' : 'hidden lg:block'),
                children: [
                  e.jsx('div', {
                    className: 'p-6 border-b border-white/10',
                    children: e.jsxs('div', {
                      className: 'flex items-center gap-4',
                      children: [
                        e.jsx('div', {
                          className:
                            'w-12 h-12 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center',
                          children: e.jsx(x, { className: 'w-6 h-6 text-white' }),
                        }),
                        e.jsxs('div', {
                          children: [
                            e.jsx('h3', {
                              className: 'font-semibold text-white',
                              children: i.name,
                            }),
                            e.jsx('p', {
                              className: 'text-sm text-nexus-silver',
                              children: i.email,
                            }),
                            e.jsxs('div', {
                              className: 'flex items-center gap-2 mt-1',
                              children: [
                                e.jsx(m, { className: 'w-3 h-3 text-nexus-cyan' }),
                                e.jsx('span', {
                                  className: `text-xs font-medium ${P[i.subscription]}`,
                                  children: i.subscription.toUpperCase(),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  e.jsx('nav', {
                    className: 'p-4',
                    children: e.jsx('div', {
                      className: 'space-y-2',
                      children: T.map(s => {
                        const t = s.icon;
                        return e.jsxs(
                          'button',
                          {
                            onClick: () => {
                              (o(s.id), N(!1));
                            },
                            className:
                              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ' +
                              (r === s.id
                                ? `bg-linear-to-r ${s.color} text-white shadow-lg`
                                : 'text-nexus-silver hover:bg-white/5 hover:text-white'),
                            children: [
                              e.jsx(t, { className: 'w-5 h-5' }),
                              e.jsx('span', { className: 'font-medium', children: s.label }),
                            ],
                          },
                          s.id
                        );
                      }),
                    }),
                  }),
                  e.jsx('div', {
                    className: 'p-4 border-t border-white/10',
                    children: e.jsxs('div', {
                      className: 'space-y-4',
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            e.jsx('span', {
                              className: 'text-nexus-silver text-sm',
                              children: 'Conversaciones',
                            }),
                            e.jsx('span', {
                              className: 'text-white font-semibold',
                              children: C.length,
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            e.jsx('span', {
                              className: 'text-nexus-silver text-sm',
                              children: 'Estado',
                            }),
                            e.jsx('span', {
                              className:
                                'text-sm font-medium ' +
                                (I
                                  ? 'text-yellow-400'
                                  : 'active' === S
                                    ? 'text-green-400'
                                    : 'error' === S
                                      ? 'text-red-400'
                                      : 'text-nexus-silver'),
                              children: I
                                ? 'Procesando'
                                : 'active' === S
                                  ? 'Activo'
                                  : 'error' === S
                                    ? 'Error'
                                    : 'Inactivo',
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            e.jsx('span', {
                              className: 'text-nexus-silver text-sm',
                              children: 'Suscripci\xf3n',
                            }),
                            e.jsx('span', {
                              className: `text-xs font-medium ${P[i.subscription]}`,
                              children: i.subscription,
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  e.jsx('div', {
                    className: 'absolute bottom-0 left-0 right-0 p-4 border-t border-white/10',
                    children: e.jsxs('button', {
                      onClick: l,
                      className:
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-nexus-silver hover:bg-white/5 hover:text-white transition-all',
                      children: [
                        e.jsx(p, { className: 'w-5 h-5' }),
                        e.jsx('span', { children: 'Cerrar Sesi\xf3n' }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        e.jsxs('div', {
          className: 'lg:ml-72 min-h-screen',
          children: [
            e.jsx('header', {
              className: 'bg-nexus-obsidian-deep border-b border-white/10 px-6 py-4',
              children: e.jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  e.jsxs('div', {
                    children: [
                      e.jsx('h1', {
                        className: 'text-2xl font-orbitron font-bold text-white',
                        children: T.find(e => e.id === r)?.label,
                      }),
                      e.jsxs('p', {
                        className: 'text-nexus-silver text-sm mt-1',
                        children: [
                          'daniela' === r && 'Tu asistente de IA emocional',
                          'analytics' === r && 'M\xe9tricas y an\xe1lisis de uso',
                          'settings' === r && 'Configuraci\xf3n de tu cuenta',
                        ],
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'flex items-center gap-4',
                    children: [
                      e.jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          e.jsx('div', {
                            className:
                              'w-2 h-2 rounded-full ' +
                              (I
                                ? 'bg-yellow-400 animate-pulse'
                                : 'active' === S
                                  ? 'bg-green-400'
                                  : 'error' === S
                                    ? 'bg-red-400'
                                    : 'bg-nexus-silver'),
                          }),
                          e.jsx('span', {
                            className: 'text-sm text-nexus-silver hidden sm:block',
                            children: I
                              ? 'Procesando...'
                              : 'active' === S
                                ? 'Daniela Activa'
                                : 'error' === S
                                  ? 'Error'
                                  : 'Inactivo',
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'flex items-center gap-2 border-l border-white/10 pl-4',
                        children: [
                          e.jsx('div', {
                            className:
                              'w-2 h-2 rounded-full ' +
                              ('connected' === E
                                ? 'bg-emerald-400'
                                : 'error' === E
                                  ? 'bg-red-400'
                                  : 'bg-blue-400 animate-pulse'),
                          }),
                          e.jsx('span', {
                            className: 'text-sm text-nexus-silver hidden sm:block',
                            children:
                              'connected' === E
                                ? 'System Online'
                                : 'error' === E
                                  ? 'Offline'
                                  : 'Syncing...',
                          }),
                          y?.data?.version &&
                            e.jsxs('span', {
                              className: 'text-[10px] text-white/20',
                              children: ['v', y.data.version],
                            }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'hidden sm:flex items-center gap-3',
                        children: [
                          e.jsx('div', {
                            className:
                              'w-8 h-8 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center',
                            children: e.jsx(x, { className: 'w-4 h-4 text-white' }),
                          }),
                          e.jsxs('div', {
                            className: 'text-right',
                            children: [
                              e.jsx('p', {
                                className: 'text-sm font-medium text-white',
                                children: i.name,
                              }),
                              e.jsx('p', {
                                className: 'text-xs text-nexus-silver',
                                children: i.subscription,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
            e.jsx('main', {
              className: 'p-6',
              children: e.jsxs(n, {
                mode: 'wait',
                children: [
                  'daniela' === r &&
                    e.jsx(
                      a.div,
                      {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.3 },
                        children: e.jsx(w, {}),
                      },
                      'daniela'
                    ),
                  'analytics' === r &&
                    e.jsxs(
                      a.div,
                      {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.3 },
                        className: 'space-y-6',
                        children: [
                          e.jsxs('div', {
                            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
                            children: [
                              e.jsxs('div', {
                                className:
                                  'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                                children: [
                                  e.jsxs('div', {
                                    className: 'flex items-center justify-between mb-4',
                                    children: [
                                      e.jsx('h3', {
                                        className: 'text-lg font-semibold text-white',
                                        children: 'Conversaciones',
                                      }),
                                      e.jsx(j, { className: 'w-5 h-5 text-nexus-cyan' }),
                                    ],
                                  }),
                                  e.jsx('div', {
                                    className: 'text-3xl font-bold text-white',
                                    children: C.length,
                                  }),
                                  e.jsx('p', {
                                    className: 'text-nexus-silver text-sm',
                                    children: 'Total este mes',
                                  }),
                                ],
                              }),
                              e.jsxs('div', {
                                className:
                                  'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                                children: [
                                  e.jsxs('div', {
                                    className: 'flex items-center justify-between mb-4',
                                    children: [
                                      e.jsx('h3', {
                                        className: 'text-lg font-semibold text-white',
                                        children: 'Estado Emocional',
                                      }),
                                      e.jsx(f, { className: 'w-5 h-5 text-green-400' }),
                                    ],
                                  }),
                                  e.jsx('div', {
                                    className: 'text-3xl font-bold text-white',
                                    children: D?.emotion?.toUpperCase() || 'NEUTRAL',
                                  }),
                                  e.jsxs('p', {
                                    className: 'text-nexus-silver text-sm',
                                    children: [
                                      'Confianza: ',
                                      D?.confidence ? `${Math.round(100 * D.confidence)}%` : 'N/A',
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs('div', {
                                className:
                                  'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                                children: [
                                  e.jsxs('div', {
                                    className: 'flex items-center justify-between mb-4',
                                    children: [
                                      e.jsx('h3', {
                                        className: 'text-lg font-semibold text-white',
                                        children: 'Sugerencias',
                                      }),
                                      e.jsx(h, { className: 'w-5 h-5 text-nexus-violet' }),
                                    ],
                                  }),
                                  e.jsx('div', {
                                    className: 'text-3xl font-bold text-white',
                                    children: z.length,
                                  }),
                                  e.jsx('p', {
                                    className: 'text-nexus-silver text-sm',
                                    children: 'Acciones disponibles',
                                  }),
                                ],
                              }),
                              e.jsxs('div', {
                                className:
                                  'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                                children: [
                                  e.jsxs('div', {
                                    className: 'flex items-center justify-between mb-4',
                                    children: [
                                      e.jsx('h3', {
                                        className: 'text-lg font-semibold text-white',
                                        children: 'Suscripci\xf3n',
                                      }),
                                      e.jsx(m, { className: 'w-5 h-5 text-nexus-gold' }),
                                    ],
                                  }),
                                  e.jsx('div', {
                                    className: 'text-3xl font-bold text-white uppercase',
                                    children: i.subscription,
                                  }),
                                  e.jsx('p', {
                                    className: 'text-nexus-silver text-sm',
                                    children: 'Plan actual',
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs('div', {
                            className:
                              'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                            children: [
                              e.jsx('h3', {
                                className: 'text-xl font-semibold text-white mb-6',
                                children: 'Actividad Reciente',
                              }),
                              e.jsx('div', {
                                className:
                                  'h-64 flex items-center justify-center text-nexus-silver',
                                children: e.jsxs('div', {
                                  className: 'text-center',
                                  children: [
                                    e.jsx(u, { className: 'w-12 h-12 mx-auto mb-4 opacity-50' }),
                                    e.jsx('p', {
                                      children: 'Gr\xe1ficos de actividad pr\xf3ximamente',
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                        ],
                      },
                      'analytics'
                    ),
                  'settings' === r &&
                    e.jsxs(
                      a.div,
                      {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.3 },
                        className: 'space-y-6',
                        children: [
                          e.jsxs('div', {
                            className:
                              'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                            children: [
                              e.jsx('h3', {
                                className: 'text-xl font-semibold text-white mb-6',
                                children: 'Configuraci\xf3n de Cuenta',
                              }),
                              e.jsxs('div', {
                                className: 'space-y-6',
                                children: [
                                  e.jsxs('div', {
                                    children: [
                                      e.jsx('label', {
                                        className:
                                          'block text-sm font-medium text-nexus-silver mb-2',
                                        children: 'Nombre',
                                      }),
                                      e.jsx('input', {
                                        type: 'text',
                                        defaultValue: i.name,
                                        className:
                                          'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50',
                                      }),
                                    ],
                                  }),
                                  e.jsxs('div', {
                                    children: [
                                      e.jsx('label', {
                                        className:
                                          'block text-sm font-medium text-nexus-silver mb-2',
                                        children: 'Email',
                                      }),
                                      e.jsx('input', {
                                        type: 'email',
                                        defaultValue: i.email,
                                        disabled: !0,
                                        className:
                                          'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-nexus-silver cursor-not-allowed',
                                      }),
                                    ],
                                  }),
                                  e.jsxs('div', {
                                    children: [
                                      e.jsx('label', {
                                        className:
                                          'block text-sm font-medium text-nexus-silver mb-2',
                                        children: 'Suscripci\xf3n Actual',
                                      }),
                                      e.jsx('div', {
                                        className:
                                          'p-4 bg-white/5 border border-white/10 rounded-lg',
                                        children: e.jsxs('div', {
                                          className: 'flex items-center justify-between',
                                          children: [
                                            e.jsx('span', {
                                              className: 'text-white font-medium',
                                              children: i.subscription,
                                            }),
                                            e.jsx('button', {
                                              className:
                                                'px-4 py-2 bg-linear-to-r from-nexus-cyan to-nexus-violet text-white rounded-lg text-sm font-medium hover:from-nexus-cyan/80 hover:to-nexus-violet/80 transition-all',
                                              children: 'Actualizar',
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs('div', {
                            className:
                              'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                            children: [
                              e.jsx('h3', {
                                className: 'text-xl font-semibold text-white mb-6',
                                children: 'Preferencias de Daniela',
                              }),
                              e.jsxs('div', {
                                className: 'space-y-6',
                                children: [
                                  e.jsxs('div', {
                                    children: [
                                      e.jsx('label', {
                                        className:
                                          'block text-sm font-medium text-nexus-silver mb-2',
                                        children: 'Voz de Daniela',
                                      }),
                                      e.jsxs('select', {
                                        className:
                                          'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50',
                                        children: [
                                          e.jsx('option', { children: 'Bella (Default)' }),
                                          e.jsx('option', { children: 'Adam' }),
                                          e.jsx('option', { children: 'Domi' }),
                                          e.jsx('option', { children: 'Elli' }),
                                          e.jsx('option', { children: 'Emily' }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs('div', {
                                    children: [
                                      e.jsx('label', {
                                        className:
                                          'block text-sm font-medium text-nexus-silver mb-2',
                                        children: 'Idioma',
                                      }),
                                      e.jsxs('select', {
                                        className:
                                          'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50',
                                        children: [
                                          e.jsx('option', { children: 'Espa\xf1ol' }),
                                          e.jsx('option', { children: 'English' }),
                                          e.jsx('option', { children: 'Portugu\xeas' }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsx('div', {
                                    children: e.jsxs('label', {
                                      className:
                                        'flex items-center gap-2 text-sm font-medium text-nexus-silver mb-2',
                                      children: [
                                        e.jsx('input', {
                                          type: 'checkbox',
                                          defaultChecked: !0,
                                          className:
                                            'rounded border-white/10 bg-white/5 text-nexus-cyan',
                                        }),
                                        'Notificaciones por email',
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      },
                      'settings'
                    ),
                ],
              }),
            }),
          ],
        }),
      ],
    });
  };
export { N as Dashboard };
