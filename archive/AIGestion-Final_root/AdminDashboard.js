import { j as e, t as s, w as t, h as a, Z as r } from './ui.js';
import { C as l, a as i, b as c, c as n, D as o, B as d } from './Card.js';
import './vendor.js';
import { B as x } from './main.js';
import './index.js';
import './three.js';
import './router.js';
function m() {
  return e.jsx('div', {
    className: 'min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6',
    children: e.jsxs('div', {
      className: 'max-w-7xl mx-auto',
      children: [
        e.jsxs('div', {
          className: 'mb-8 text-center',
          children: [
            e.jsx('h1', {
              className: 'text-5xl font-bold text-white mb-3 animate-pulse',
              children: '🚀 Panel del Súper Administrador',
            }),
            e.jsx('p', {
              className: 'text-blue-200 text-lg',
              children:
                '¡Bienvenido al Centro de Control! Aquí manejas todo como un verdadero héroe tecnológico. 🦸‍♂️',
            }),
          ],
        }),
        e.jsx('div', {
          className: 'mb-8',
          children: e.jsxs(l, {
            className: 'bg-white/10 backdrop-blur-md border-purple-500/20 shadow-2xl',
            children: [
              e.jsxs(i, {
                children: [
                  e.jsx(c, {
                    className: 'text-white flex items-center gap-2 text-xl',
                    children: '🧠 Daniela IA - Tu Asistente Mágica',
                  }),
                  e.jsx('p', {
                    className: 'text-blue-200 text-sm',
                    children: '¡Pregúntale lo que sea! Ella sabe todo sobre el sistema. 🪄',
                  }),
                ],
              }),
              e.jsx(n, {
                children: e.jsx(o, {
                  config: {
                    variant: 'assistant',
                    context: 'admin',
                    voice: {
                      enabled: !0,
                      provider: 'vapi',
                      voiceId: 'EXAVITQu4vr4xnSDxMaL',
                      autoStart: !1,
                    },
                    personality: { mode: 'strategic', language: 'es', name: 'Daniela Admin' },
                    features: { memory: !0, analytics: !0, multiUser: !0, realTime: !0 },
                  },
                  className: 'min-h-[400px]',
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
                'bg-white/10 backdrop-blur-md border-purple-500/20 hover:scale-105 transition-transform',
              children: [
                e.jsxs(i, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    e.jsx(c, {
                      className: 'text-sm font-medium text-purple-200',
                      children: '👥 Usuarios Activos',
                    }),
                    e.jsx(s, { className: 'h-6 w-6 text-purple-400 animate-bounce' }),
                  ],
                }),
                e.jsxs(n, {
                  children: [
                    e.jsx('div', { className: 'text-3xl font-bold text-white', children: '1,234' }),
                    e.jsx('p', {
                      className: 'text-xs text-purple-300',
                      children: '📈 +12% más que el mes pasado',
                    }),
                    e.jsx('div', {
                      className: 'mt-2 text-xs text-green-400',
                      children: '✨ ¡Todo va súper bien!',
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs(l, {
              className:
                'bg-white/10 backdrop-blur-md border-green-500/20 hover:scale-105 transition-transform',
              children: [
                e.jsxs(i, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    e.jsx(c, {
                      className: 'text-sm font-medium text-green-200',
                      children: '🟢 Estado del Sistema',
                    }),
                    e.jsx(t, { className: 'h-6 w-6 text-green-400 animate-pulse' }),
                  ],
                }),
                e.jsxs(n, {
                  children: [
                    e.jsx('div', {
                      className: 'text-3xl font-bold text-green-400',
                      children: '🟢 Online',
                    }),
                    e.jsx('p', {
                      className: 'text-xs text-green-300',
                      children: '⚡ Funcionando 99.9% del tiempo',
                    }),
                    e.jsx('div', {
                      className: 'mt-2 text-xs text-green-400',
                      children: '🚀 Más rápido que un rayo',
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs(l, {
              className:
                'bg-white/10 backdrop-blur-md border-blue-500/20 hover:scale-105 transition-transform',
              children: [
                e.jsxs(i, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    e.jsx(c, {
                      className: 'text-sm font-medium text-blue-200',
                      children: '🤖 Peticiones a la IA',
                    }),
                    e.jsx(a, { className: 'h-6 w-6 text-blue-400 animate-pulse' }),
                  ],
                }),
                e.jsxs(n, {
                  children: [
                    e.jsx('div', { className: 'text-3xl font-bold text-white', children: '45.2K' }),
                    e.jsx('p', { className: 'text-xs text-blue-300', children: '📅 Solo hoy' }),
                    e.jsx('div', {
                      className: 'mt-2 text-xs text-blue-400',
                      children: '🧠 La IA está súper ocupada',
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs(l, {
              className:
                'bg-white/10 backdrop-blur-md border-yellow-500/20 hover:scale-105 transition-transform',
              children: [
                e.jsxs(i, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    e.jsx(c, {
                      className: 'text-sm font-medium text-yellow-200',
                      children: '⚡ Velocidad',
                    }),
                    e.jsx(r, { className: 'h-6 w-6 text-yellow-400 animate-bounce' }),
                  ],
                }),
                e.jsxs(n, {
                  children: [
                    e.jsx('div', {
                      className: 'text-3xl font-bold text-yellow-400',
                      children: '98ms',
                    }),
                    e.jsx('p', {
                      className: 'text-xs text-yellow-300',
                      children: '🏃‍♂️ Tiempo de respuesta',
                    }),
                    e.jsx('div', {
                      className: 'mt-2 text-xs text-yellow-400',
                      children: '⚡ Más rápido que Flash',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
          children: [
            e.jsxs(l, {
              className: 'bg-white/10 backdrop-blur-md border-purple-500/20 lg:col-span-1',
              children: [
                e.jsxs(i, {
                  children: [
                    e.jsx(c, { className: 'text-white text-lg', children: '🎮 Botones Mágicos' }),
                    e.jsx('p', {
                      className: 'text-purple-200 text-sm',
                      children: 'Haz clic en los botones para hacer cosas increíbles',
                    }),
                  ],
                }),
                e.jsxs(n, {
                  className: 'space-y-4',
                  children: [
                    e.jsx(x, {
                      className:
                        'w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-sm hover:scale-105 transition-transform',
                      children: '🧠 Configurar Daniela IA',
                    }),
                    e.jsx(x, {
                      className:
                        'w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm hover:scale-105 transition-transform',
                      children: '👥 Gestionar Usuarios',
                    }),
                    e.jsx(x, {
                      className:
                        'w-full bg-green-600 hover:bg-green-700 text-white py-3 text-sm hover:scale-105 transition-transform',
                      children: '📊 Ver Estadísticas',
                    }),
                    e.jsx(x, {
                      className:
                        'w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-sm hover:scale-105 transition-transform',
                      children: '🔧 Ajustes del Sistema',
                    }),
                    e.jsx(x, {
                      className:
                        'w-full bg-red-600 hover:bg-red-700 text-white py-3 text-sm hover:scale-105 transition-transform',
                      children: '🛡️ Seguridad y Protección',
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs(l, {
              className: 'bg-white/10 backdrop-blur-md border-purple-500/20 lg:col-span-2',
              children: [
                e.jsxs(i, {
                  children: [
                    e.jsx(c, {
                      className: 'text-white text-lg',
                      children: '📜 Libro de Aventuras Recientes',
                    }),
                    e.jsx('p', {
                      className: 'text-purple-200 text-sm',
                      children: 'Aquí ves todo lo que ha pasado últimamente',
                    }),
                  ],
                }),
                e.jsx(n, {
                  children: e.jsx('div', {
                    className: 'space-y-4',
                    children: [
                      {
                        user: '🦸‍♂️ Super Admin',
                        action: '🧠 Actualizó el cerebro de Daniela IA',
                        time: '⏰ hace 2 min',
                        status: 'success',
                      },
                      {
                        user: '🤖 Sistema Automático',
                        action: '💾 Hizo una copia de seguridad',
                        time: '⏰ hace 15 min',
                        status: 'info',
                      },
                      {
                        user: '🧠 Daniela IA',
                        action: '📊 Procesó 1,200 peticiones',
                        time: '⏰ hace 1 hora',
                        status: 'success',
                      },
                      {
                        user: '🛡️ Guardián de Seguridad',
                        action: '🔐 Renovó el escudo SSL',
                        time: '⏰ hace 2 horas',
                        status: 'warning',
                      },
                    ].map((s, t) =>
                      e.jsxs(
                        'div',
                        {
                          className:
                            'flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors',
                          children: [
                            e.jsxs('div', {
                              className: 'flex-1',
                              children: [
                                e.jsx('p', {
                                  className: 'text-white font-medium text-sm',
                                  children: s.user,
                                }),
                                e.jsx('p', {
                                  className: 'text-purple-200 text-sm',
                                  children: s.action,
                                }),
                              ],
                            }),
                            e.jsx('div', {
                              className: 'text-right',
                              children: e.jsx(d, {
                                variant:
                                  'success' === s.status
                                    ? 'default'
                                    : 'warning' === s.status
                                      ? 'secondary'
                                      : 'outline',
                                className: 'text-xs',
                                children: s.time,
                              }),
                            }),
                          ],
                        },
                        t
                      )
                    ),
                  }),
                }),
              ],
            }),
          ],
        }),
        e.jsxs(l, {
          className: 'bg-white/10 backdrop-blur-md border-purple-500/20 mt-6',
          children: [
            e.jsxs(i, {
              children: [
                e.jsx(c, {
                  className: 'text-white text-lg',
                  children: '🏥 Centro de Salud del Sistema',
                }),
                e.jsx('p', {
                  className: 'text-purple-200 text-sm',
                  children: 'Revisamos que todo esté perfectamente sano',
                }),
              ],
            }),
            e.jsx(n, {
              children: e.jsx('div', {
                className: 'grid grid-cols-1 md:grid-cols-3 gap-4',
                children: [
                  {
                    service: '🧠 Cerebro de Daniela IA',
                    status: '🟢 Súper Saludable',
                    color: 'text-green-400',
                  },
                  {
                    service: '💾 Base de Datos',
                    status: '🟢 Funcionando Perfecto',
                    color: 'text-green-400',
                  },
                  {
                    service: '🌐 Puerta de Internet (API)',
                    status: '🟢 Todo Bien',
                    color: 'text-green-400',
                  },
                  {
                    service: '🚀 Red de Entrega (CDN)',
                    status: '🟢 A toda velocidad',
                    color: 'text-green-400',
                  },
                  {
                    service: '🔐 Guardián de Acceso',
                    status: '🟢 Protegiendo todo',
                    color: 'text-green-400',
                  },
                  {
                    service: '📡 Sistema de Vigilancia',
                    status: '🟢 Atento a todo',
                    color: 'text-green-400',
                  },
                ].map((s, t) =>
                  e.jsxs(
                    'div',
                    {
                      className:
                        'flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors',
                      children: [
                        e.jsx('span', { className: 'text-white text-sm', children: s.service }),
                        e.jsx(d, { className: `${s.color} text-xs`, children: s.status }),
                      ],
                    },
                    t
                  )
                ),
              }),
            }),
          ],
        }),
        e.jsx(l, {
          className:
            'bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md border-purple-500/20 mt-6',
          children: e.jsxs(n, {
            className: 'p-6',
            children: [
              e.jsx('h3', {
                className: 'text-white text-lg font-bold mb-3',
                children: '💡 Tips para ser el Mejor Admin',
              }),
              e.jsxs('div', {
                className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm',
                children: [
                  e.jsxs('div', {
                    className: 'text-purple-200',
                    children: [
                      e.jsx('span', { className: 'text-purple-400 font-bold', children: '1.' }),
                      ' Revisa las estadísticas cada día para ver cómo crece todo',
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'text-blue-200',
                    children: [
                      e.jsx('span', { className: 'text-blue-400 font-bold', children: '2.' }),
                      ' Habla con Daniela IA si necesitas ayuda con algo complicado',
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'text-green-200',
                    children: [
                      e.jsx('span', { className: 'text-green-400 font-bold', children: '3.' }),
                      ' Mantén todo actualizado para que el sistema esté siempre rápido',
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
export { m as AdminDashboard };
