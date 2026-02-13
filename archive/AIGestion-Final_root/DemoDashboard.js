import { j as e, Z as s, y as i, R as a, K as t } from './ui.js';
import { C as l, a as r, b as n, c, D as o, B as d } from './Card.js';
import './vendor.js';
import './main.js';
import './index.js';
import './three.js';
import './router.js';
function m() {
  return e.jsx('div', {
    className: 'min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-6',
    children: e.jsxs('div', {
      className: 'max-w-7xl mx-auto',
      children: [
        e.jsxs('div', {
          className: 'mb-8 text-center',
          children: [
            e.jsx('h1', {
              className: 'text-5xl font-bold text-white mb-3 animate-pulse',
              children: '🎪 Parque de Juegos Mágico IA',
            }),
            e.jsx('p', {
              className: 'text-pink-200 text-lg',
              children:
                '¡Bienvenido al lugar más divertido! Aquí juegas con la IA como si fuera un videojuego. 🎮✨',
            }),
          ],
        }),
        e.jsx('div', {
          className: 'mb-8',
          children: e.jsxs(l, {
            className: 'bg-white/10 backdrop-blur-md border-pink-500/20 shadow-2xl',
            children: [
              e.jsxs(r, {
                children: [
                  e.jsx(n, {
                    className: 'text-white flex items-center gap-2 text-xl',
                    children: '🌟 Daniela IA - La Super Estrella Inteligente',
                  }),
                  e.jsx('p', {
                    className: 'text-pink-200 text-sm',
                    children:
                      '¡Habla con ella! Es como tener una amiga genio que sabe todo. 💬🧠✨',
                  }),
                ],
              }),
              e.jsx(c, {
                children: e.jsx(o, {
                  config: {
                    variant: 'full',
                    context: 'demo',
                    voice: {
                      enabled: !0,
                      provider: 'vapi',
                      voiceId: 'EXAVITQu4vr4xnSDxMaL',
                      autoStart: !0,
                    },
                    personality: { mode: 'professional', language: 'es', name: 'Daniela Demo' },
                    features: { memory: !0, analytics: !0, multiUser: !1, realTime: !0 },
                  },
                  className: 'min-h-[500px]',
                }),
              }),
            ],
          }),
        }),
        e.jsxs('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
          children: [
            e.jsxs(l, {
              className:
                'bg-white/10 backdrop-blur-md border-pink-500/20 hover:scale-105 transition-transform',
              children: [
                e.jsxs(r, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    e.jsx(n, {
                      className: 'text-sm font-medium text-pink-200',
                      children: '🗣️ Voz Mágica',
                    }),
                    e.jsx(s, { className: 'h-6 w-6 text-yellow-400 animate-bounce' }),
                  ],
                }),
                e.jsxs(c, {
                  children: [
                    e.jsx('div', {
                      className: 'text-3xl font-bold text-yellow-400',
                      children: '🟢 Activa',
                    }),
                    e.jsx('p', {
                      className: 'text-xs text-pink-300',
                      children: '✨ Habla y escucha en tiempo real',
                    }),
                    e.jsx('div', {
                      className: 'mt-2 text-xs text-yellow-400',
                      children: '🎤 Como un micrófono mágico',
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs(l, {
              className:
                'bg-white/10 backdrop-blur-md border-pink-500/20 hover:scale-105 transition-transform',
              children: [
                e.jsxs(r, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    e.jsx(n, {
                      className: 'text-sm font-medium text-pink-200',
                      children: '🧠 Cerebro IA',
                    }),
                    e.jsx(i, { className: 'h-6 w-6 text-purple-400 animate-pulse' }),
                  ],
                }),
                e.jsxs(c, {
                  children: [
                    e.jsx('div', {
                      className: 'text-3xl font-bold text-purple-400',
                      children: 'GPT-4',
                    }),
                    e.jsx('p', {
                      className: 'text-xs text-pink-300',
                      children: '🎓 El más inteligente de todos',
                    }),
                    e.jsx('div', {
                      className: 'mt-2 text-xs text-purple-400',
                      children: '🏆 Como tener un Einstein en tu PC',
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs(l, {
              className:
                'bg-white/10 backdrop-blur-md border-pink-500/20 hover:scale-105 transition-transform',
              children: [
                e.jsxs(r, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    e.jsx(n, {
                      className: 'text-sm font-medium text-pink-200',
                      children: '⚡ Velocidad Flash',
                    }),
                    e.jsx(a, { className: 'h-6 w-6 text-green-400 animate-bounce' }),
                  ],
                }),
                e.jsxs(c, {
                  children: [
                    e.jsx('div', {
                      className: 'text-3xl font-bold text-green-400',
                      children: '<1s',
                    }),
                    e.jsx('p', {
                      className: 'text-xs text-pink-300',
                      children: '🏃‍♂️ Más rápido que Flash',
                    }),
                    e.jsx('div', {
                      className: 'mt-2 text-xs text-green-400',
                      children: '💨 Respuesta instantánea',
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs(l, {
              className:
                'bg-white/10 backdrop-blur-md border-pink-500/20 hover:scale-105 transition-transform',
              children: [
                e.jsxs(r, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    e.jsx(n, {
                      className: 'text-sm font-medium text-pink-200',
                      children: '🌍 Mundo Global',
                    }),
                    e.jsx(t, { className: 'h-6 w-6 text-blue-400 animate-pulse' }),
                  ],
                }),
                e.jsxs(c, {
                  children: [
                    e.jsx('div', { className: 'text-3xl font-bold text-blue-400', children: '5+' }),
                    e.jsx('p', {
                      className: 'text-xs text-pink-300',
                      children: '🗺️ Habla todos los idiomas',
                    }),
                    e.jsx('div', {
                      className: 'mt-2 text-xs text-blue-400',
                      children: '🌐 Como un traductor universal',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8',
          children: [
            e.jsxs(l, {
              className: 'bg-white/10 backdrop-blur-md border-pink-500/20',
              children: [
                e.jsxs(r, {
                  children: [
                    e.jsx(n, {
                      className: 'text-white text-lg',
                      children: '🕹️ Misiones Divertidas',
                    }),
                    e.jsx('p', {
                      className: 'text-pink-200 text-sm',
                      children: 'Elige un nivel y juega con Daniela IA',
                    }),
                  ],
                }),
                e.jsx(c, {
                  className: 'space-y-4',
                  children: [
                    {
                      title: '🌱 Nivel Fácil: Ayuda de Negocio',
                      description: 'Preguntas fáciles sobre negocios',
                      prompt: '¿Cómo gano más dinero con mi empresa?',
                      difficulty: '🟢 Fácil',
                      emoji: '🌱',
                    },
                    {
                      title: '⚡ Nivel Medio: Estrategia Pro',
                      description: 'Consejos para hacer crecer tu negocio',
                      prompt: 'Dame 3 ideas para digitalizar mi empresa',
                      difficulty: '🟡 Medio',
                      emoji: '⚡',
                    },
                    {
                      title: '🔥 Nivel Difícil: Resolver Problemas',
                      description: 'Problemas complicados con soluciones geniales',
                      prompt: 'Mi equipo no produce, ¿qué hago?',
                      difficulty: '🟠 Difícil',
                      emoji: '🔥',
                    },
                    {
                      title: '🏆 Nivel Experto: Futuro IA',
                      description: 'Lo más nuevo y avanzado en inteligencia artificial',
                      prompt: '¿Cómo será el mundo en 10 años con IA?',
                      difficulty: '🔴 Experto',
                      emoji: '🏆',
                    },
                  ].map((s, i) =>
                    e.jsxs(
                      'div',
                      {
                        className:
                          'p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all hover:scale-105 cursor-pointer',
                        children: [
                          e.jsxs('div', {
                            className: 'flex items-center justify-between mb-2',
                            children: [
                              e.jsxs('h3', {
                                className: 'text-white font-medium text-sm flex items-center gap-2',
                                children: [
                                  e.jsx('span', { className: 'text-lg', children: s.emoji }),
                                  s.title,
                                ],
                              }),
                              e.jsx(d, {
                                variant: 'outline',
                                className: 'text-xs',
                                children: s.difficulty,
                              }),
                            ],
                          }),
                          e.jsx('p', {
                            className: 'text-pink-200 text-sm mb-2',
                            children: s.description,
                          }),
                          e.jsxs('div', {
                            className: 'text-xs text-pink-300 font-mono bg-black/20 p-2 rounded',
                            children: ['💬 Di: "', s.prompt, '"'],
                          }),
                        ],
                      },
                      i
                    )
                  ),
                }),
              ],
            }),
            e.jsxs(l, {
              className: 'bg-white/10 backdrop-blur-md border-pink-500/20',
              children: [
                e.jsxs(r, {
                  children: [
                    e.jsx(n, {
                      className: 'text-white text-lg',
                      children: '🎯 Galería de Súper Poderes',
                    }),
                    e.jsx('p', {
                      className: 'text-pink-200 text-sm',
                      children: 'Mira todas las cosas increíbles que puede hacer Daniela',
                    }),
                  ],
                }),
                e.jsx(c, {
                  children: e.jsx('div', {
                    className: 'space-y-6',
                    children: [
                      {
                        capability: '🧠 Entiende Todo lo que Dices',
                        description: 'Como si leyera tu mente, entiende perfectamente',
                        demo: 'Habla con ella como con un amigo',
                        emoji: '🧠',
                      },
                      {
                        capability: '🔮 Adivina el Futuro',
                        description: 'Predice lo que pasará con datos mágicos',
                        demo: 'Pregúntale qué pasará en tu negocio',
                        emoji: '🔮',
                      },
                      {
                        capability: '✍️ Escribe como Poeta',
                        description: 'Crea textos bonitos y profesionales',
                        demo: 'Pídele que escriba un email o historia',
                        emoji: '✍️',
                      },
                      {
                        capability: '🎓 Resuelve Acertijos',
                        description: 'Piensa como un detective para resolver problemas',
                        demo: 'Dale un problema complicado y verás magia',
                        emoji: '🎓',
                      },
                      {
                        capability: '💬 Recuerda Todo',
                        description: 'Nunca olvida lo que hablan, como un elefante',
                        demo: 'Mantén conversaciones largas y ella recordará todo',
                        emoji: '💬',
                      },
                      {
                        capability: '🌍 Está en Todas Partes',
                        description: 'Funciona en tu compu, celular y tablet',
                        demo: 'Prueba Daniela en diferentes aparatos',
                        emoji: '🌍',
                      },
                    ].map((s, i) =>
                      e.jsxs(
                        'div',
                        {
                          className:
                            'border-l-4 border-pink-400 pl-4 hover:bg-white/5 p-2 rounded transition-colors',
                          children: [
                            e.jsxs('h4', {
                              className: 'text-white font-medium mb-1 flex items-center gap-2',
                              children: [
                                e.jsx('span', { className: 'text-lg', children: s.emoji }),
                                s.capability,
                              ],
                            }),
                            e.jsx('p', {
                              className: 'text-pink-200 text-sm mb-2',
                              children: s.description,
                            }),
                            e.jsxs('p', {
                              className: 'text-pink-300 text-xs',
                              children: ['🎮 ', s.demo],
                            }),
                          ],
                        },
                        i
                      )
                    ),
                  }),
                }),
              ],
            }),
          ],
        }),
        e.jsxs(l, {
          className: 'bg-white/10 backdrop-blur-md border-pink-500/20',
          children: [
            e.jsxs(r, {
              children: [
                e.jsx(n, {
                  className: 'text-white text-lg',
                  children: '📊 Tablero de Puntuaciones en Vivo',
                }),
                e.jsx('p', {
                  className: 'text-pink-200 text-sm',
                  children: 'Mira cómo rinde Daniela IA en tiempo real',
                }),
              ],
            }),
            e.jsx(c, {
              children: e.jsxs('div', {
                className: 'grid grid-cols-1 md:grid-cols-3 gap-6',
                children: [
                  e.jsxs('div', {
                    className: 'text-center',
                    children: [
                      e.jsx('div', {
                        className: 'text-5xl font-bold text-green-400 mb-2 animate-pulse',
                        children: '99.9%',
                      }),
                      e.jsx('div', {
                        className: 'text-pink-200 mb-1 font-medium',
                        children: '⏰ Tiempo Activo',
                      }),
                      e.jsx('div', {
                        className: 'w-full bg-white/20 rounded-full h-3',
                        children: e.jsx('div', {
                          className: 'bg-green-400 h-3 rounded-full animate-pulse',
                          style: { width: '99.9%' },
                        }),
                      }),
                      e.jsx('div', {
                        className: 'text-xs text-green-400 mt-1',
                        children: '🟢 Siempre despierta',
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'text-center',
                    children: [
                      e.jsx('div', {
                        className: 'text-5xl font-bold text-blue-400 mb-2 animate-pulse',
                        children: '847ms',
                      }),
                      e.jsx('div', {
                        className: 'text-pink-200 mb-1 font-medium',
                        children: '⚡ Velocidad de Respuesta',
                      }),
                      e.jsx('div', {
                        className: 'w-full bg-white/20 rounded-full h-3',
                        children: e.jsx('div', {
                          className: 'bg-blue-400 h-3 rounded-full animate-pulse',
                          style: { width: '85%' },
                        }),
                      }),
                      e.jsx('div', {
                        className: 'text-xs text-blue-400 mt-1',
                        children: '🚀 Súper rápida',
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'text-center',
                    children: [
                      e.jsx('div', {
                        className: 'text-5xl font-bold text-purple-400 mb-2 animate-pulse',
                        children: '12.5K',
                      }),
                      e.jsx('div', {
                        className: 'text-pink-200 mb-1 font-medium',
                        children: '💬 Conversaciones Hoy',
                      }),
                      e.jsx('div', {
                        className: 'w-full bg-white/20 rounded-full h-3',
                        children: e.jsx('div', {
                          className: 'bg-purple-400 h-3 rounded-full animate-pulse',
                          style: { width: '65%' },
                        }),
                      }),
                      e.jsx('div', {
                        className: 'text-xs text-purple-400 mt-1',
                        children: '🔥 Muy popular',
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
        e.jsx(l, {
          className:
            'bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-md border-pink-500/20 mt-6',
          children: e.jsxs(c, {
            className: 'p-6',
            children: [
              e.jsx('h3', {
                className: 'text-white text-lg font-bold mb-4',
                children: '🎮 Tips para ser el Mejor Jugador',
              }),
              e.jsxs('div', {
                className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm',
                children: [
                  e.jsxs('div', {
                    className: 'text-pink-200',
                    children: [
                      e.jsx('span', {
                        className: 'text-pink-400 font-bold text-lg',
                        children: '🎯',
                      }),
                      ' Haz preguntas específicas para mejores respuestas',
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'text-purple-200',
                    children: [
                      e.jsx('span', {
                        className: 'text-purple-400 font-bold text-lg',
                        children: '🗣️',
                      }),
                      ' Usa la voz para una experiencia más divertida',
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'text-blue-200',
                    children: [
                      e.jsx('span', {
                        className: 'text-blue-400 font-bold text-lg',
                        children: '🎪',
                      }),
                      ' Prueba todos los niveles para descubrir sorpresas',
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  });
}
export { m as DemoDashboard };
