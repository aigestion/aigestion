import { Q as e, a as s } from './index.js';
import {
  j as i,
  m as t,
  J as a,
  K as l,
  F as r,
  N as d,
  O as c,
  c as n,
  Z as o,
  y as x,
} from './ui.js';
import { r as m, a as h } from './vendor.js';
import { a as p } from './three.js';
import { B as u } from './router.js';
const j = () => {
    const [e, s] = m.useState(!1),
      [h, p] = m.useState(1),
      [u, j] = m.useState(0);
    return i.jsxs('div', {
      className: 'p-6 space-y-6',
      children: [
        i.jsxs(t.div, {
          initial: { y: -20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          className: 'flex items-center justify-between',
          children: [
            i.jsx('h1', {
              className: 'text-4xl font-bold text-white',
              children: '🎪 Parque de Juegos Demo',
            }),
            i.jsxs('div', {
              className: 'flex items-center space-x-4',
              children: [
                i.jsxs('div', {
                  className: 'text-white',
                  children: [
                    i.jsx('span', { className: 'text-sm', children: 'Puntuación: ' }),
                    i.jsx('span', { className: 'text-2xl font-bold text-yellow-400', children: u }),
                  ],
                }),
                i.jsx('button', {
                  onClick: () => s(!e),
                  className: 'p-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors',
                  children: e
                    ? i.jsx(a, { className: 'w-5 h-5 text-white' })
                    : i.jsx(l, { className: 'w-5 h-5 text-white' }),
                }),
              ],
            }),
          ],
        }),
        i.jsxs('div', {
          className: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
          children: [
            i.jsxs(t.div, {
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
              children: [
                i.jsxs('h2', {
                  className: 'text-xl font-semibold text-white mb-4 flex items-center',
                  children: [
                    i.jsx(r, { className: 'w-5 h-5 mr-2 text-orange-400' }),
                    'Niveles de Dificultad',
                  ],
                }),
                i.jsx('div', {
                  className: 'space-y-3',
                  children: [
                    {
                      id: 1,
                      name: '🎮 Nivel 1: Exploración Básica',
                      description: 'Descubre las funciones principales',
                      unlocked: !0,
                    },
                    {
                      id: 2,
                      name: '🚀 Nivel 2: Velocidad y Rendimiento',
                      description: 'Optimiza tu experiencia',
                      unlocked: !0,
                    },
                    {
                      id: 3,
                      name: '🎯 Nivel 3: Precisión y Control',
                      description: 'Domina las herramientas avanzadas',
                      unlocked: !1,
                    },
                    {
                      id: 4,
                      name: '⭐ Nivel 4: Experto Maestro',
                      description: 'Conviértete en un profesional',
                      unlocked: !1,
                    },
                  ].map((e, s) =>
                    i.jsx(
                      t.div,
                      {
                        initial: { x: -20, opacity: 0 },
                        animate: { x: 0, opacity: 1 },
                        transition: { delay: 0.1 * s },
                        onClick: () => e.unlocked && p(e.id),
                        className:
                          'p-4 rounded-lg border cursor-pointer transition-all ' +
                          (e.unlocked
                            ? h === e.id
                              ? 'bg-orange-500/30 border-orange-500'
                              : 'bg-white/10 border-white/30 hover:bg-white/20'
                            : 'bg-gray-500/20 border-gray-500/50 cursor-not-allowed opacity-50'),
                        children: i.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            i.jsxs('div', {
                              children: [
                                i.jsx('h3', {
                                  className:
                                    'font-semibold ' +
                                    (e.unlocked ? 'text-white' : 'text-gray-400'),
                                  children: e.name,
                                }),
                                i.jsx('p', {
                                  className:
                                    'text-sm ' + (e.unlocked ? 'text-white/70' : 'text-gray-500'),
                                  children: e.description,
                                }),
                              ],
                            }),
                            i.jsx('div', {
                              className: 'text-2xl ' + (e.unlocked ? '' : 'opacity-50'),
                              children: e.unlocked ? '🎮' : '🔒',
                            }),
                          ],
                        }),
                      },
                      e.id
                    )
                  ),
                }),
              ],
            }),
            i.jsxs(t.div, {
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
              children: [
                i.jsxs('h2', {
                  className: 'text-xl font-semibold text-white mb-4 flex items-center',
                  children: [
                    i.jsx(d, { className: 'w-5 h-5 mr-2 text-purple-400' }),
                    'Juegos Disponibles',
                  ],
                }),
                i.jsx('div', {
                  className: 'space-y-3',
                  children: [
                    {
                      id: 1,
                      name: '🧠 Memory IA',
                      description: 'Memoriza patrones de IA',
                      difficulty: 'Fácil',
                      players: '1,234',
                    },
                    {
                      id: 2,
                      name: '⚡ Speed Code',
                      description: 'Programación rápida',
                      difficulty: 'Medio',
                      players: '892',
                    },
                    {
                      id: 3,
                      name: '🎯 Target Practice',
                      description: 'Práctica de precisión',
                      difficulty: 'Difícil',
                      players: '567',
                    },
                    {
                      id: 4,
                      name: '🏆 Championship',
                      description: 'Torneo semanal',
                      difficulty: 'Extremo',
                      players: '234',
                    },
                  ].map((e, s) =>
                    i.jsx(
                      t.div,
                      {
                        initial: { x: 20, opacity: 0 },
                        animate: { x: 0, opacity: 1 },
                        transition: { delay: 0.1 * s },
                        className:
                          'p-4 bg-white/10 rounded-lg border border-white/30 hover:bg-white/20 cursor-pointer transition-all',
                        children: i.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            i.jsxs('div', {
                              children: [
                                i.jsx('h3', {
                                  className: 'font-semibold text-white',
                                  children: e.name,
                                }),
                                i.jsx('p', {
                                  className: 'text-sm text-white/70',
                                  children: e.description,
                                }),
                                i.jsxs('div', {
                                  className: 'flex items-center space-x-4 mt-2',
                                  children: [
                                    i.jsx('span', {
                                      className:
                                        'text-xs px-2 py-1 rounded ' +
                                        ('Fácil' === e.difficulty
                                          ? 'bg-green-500/30 text-green-400'
                                          : 'Medio' === e.difficulty
                                            ? 'bg-yellow-500/30 text-yellow-400'
                                            : 'Difícil' === e.difficulty
                                              ? 'bg-orange-500/30 text-orange-400'
                                              : 'bg-red-500/30 text-red-400'),
                                      children: e.difficulty,
                                    }),
                                    i.jsxs('span', {
                                      className: 'text-xs text-white/50',
                                      children: ['👥 ', e.players, ' jugadores'],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            i.jsx('button', {
                              className:
                                'p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors',
                              children: i.jsx(l, { className: 'w-4 h-4 text-white' }),
                            }),
                          ],
                        }),
                      },
                      e.id
                    )
                  ),
                }),
              ],
            }),
          ],
        }),
        i.jsxs(t.div, {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
          children: [
            i.jsxs('h2', {
              className: 'text-xl font-semibold text-white mb-4 flex items-center',
              children: [
                i.jsx(c, { className: 'w-5 h-5 mr-2 text-yellow-400' }),
                'Logros y Trofeos',
              ],
            }),
            i.jsx('div', {
              className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
              children: [
                {
                  id: 1,
                  title: '🌟 Primer Juego',
                  description: 'Juega tu primera partida',
                  progress: 100,
                  unlocked: !0,
                },
                {
                  id: 2,
                  title: '🚀 Velocista',
                  description: 'Completa en menos de 1 minuto',
                  progress: 75,
                  unlocked: !1,
                },
                {
                  id: 3,
                  title: '🎯 Precisión',
                  description: '100% de aciertos',
                  progress: 45,
                  unlocked: !1,
                },
                {
                  id: 4,
                  title: '🏆 Campeón',
                  description: 'Gana 10 partidas seguidas',
                  progress: 20,
                  unlocked: !1,
                },
              ].map((e, s) =>
                i.jsx(
                  t.div,
                  {
                    initial: { scale: 0.8, opacity: 0 },
                    animate: { scale: 1, opacity: 1 },
                    transition: { delay: 0.1 * s },
                    className:
                      'p-4 rounded-lg border ' +
                      (e.unlocked
                        ? 'bg-yellow-500/20 border-yellow-500/50'
                        : 'bg-gray-500/20 border-gray-500/50'),
                    children: i.jsxs('div', {
                      className: 'text-center',
                      children: [
                        i.jsx('div', {
                          className: 'text-3xl mb-2 ' + (e.unlocked ? '' : 'opacity-50'),
                          children: e.unlocked ? '🏆' : '🔒',
                        }),
                        i.jsx('h3', {
                          className:
                            'font-semibold text-sm ' +
                            (e.unlocked ? 'text-white' : 'text-gray-400'),
                          children: e.title,
                        }),
                        i.jsx('p', {
                          className: 'text-xs text-white/70 mt-1',
                          children: e.description,
                        }),
                        i.jsxs('div', {
                          className: 'mt-2',
                          children: [
                            i.jsx('div', {
                              className: 'w-full bg-gray-700 rounded-full h-2',
                              children: i.jsx('div', {
                                className:
                                  'h-2 rounded-full transition-all ' +
                                  (e.unlocked ? 'bg-yellow-400' : 'bg-gray-500'),
                                style: { width: `${e.progress}%` },
                              }),
                            }),
                            i.jsxs('p', {
                              className: 'text-xs text-white/50 mt-1',
                              children: [e.progress, '%'],
                            }),
                          ],
                        }),
                      ],
                    }),
                  },
                  e.id
                )
              ),
            }),
          ],
        }),
        i.jsxs(t.div, {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          className: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
          children: [
            i.jsxs('div', {
              className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
              children: [
                i.jsxs('h3', {
                  className: 'text-lg font-semibold text-white mb-4 flex items-center',
                  children: [
                    i.jsx(n, { className: 'w-5 h-5 mr-2 text-pink-400' }),
                    'Estadísticas de Juego',
                  ],
                }),
                i.jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    i.jsxs('div', {
                      className: 'flex justify-between text-white/70',
                      children: [
                        i.jsx('span', { children: 'Partidas jugadas' }),
                        i.jsx('span', { className: 'text-pink-400', children: '47' }),
                      ],
                    }),
                    i.jsxs('div', {
                      className: 'flex justify-between text-white/70',
                      children: [
                        i.jsx('span', { children: 'Victorias' }),
                        i.jsx('span', { className: 'text-green-400', children: '32' }),
                      ],
                    }),
                    i.jsxs('div', {
                      className: 'flex justify-between text-white/70',
                      children: [
                        i.jsx('span', { children: 'Tiempo total' }),
                        i.jsx('span', { className: 'text-blue-400', children: '12h 34m' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            i.jsxs('div', {
              className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
              children: [
                i.jsxs('h3', {
                  className: 'text-lg font-semibold text-white mb-4 flex items-center',
                  children: [
                    i.jsx(o, { className: 'w-5 h-5 mr-2 text-yellow-400' }),
                    'Power-ups Activos',
                  ],
                }),
                i.jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    i.jsxs('div', {
                      className: 'p-2 bg-yellow-500/20 rounded border border-yellow-500/50',
                      children: [
                        i.jsx('p', {
                          className: 'text-white font-medium',
                          children: '⚡ Doble Velocidad',
                        }),
                        i.jsx('p', {
                          className: 'text-white/70 text-sm',
                          children: 'Activo • 5 min restantes',
                        }),
                      ],
                    }),
                    i.jsxs('div', {
                      className: 'p-2 bg-blue-500/20 rounded border border-blue-500/50',
                      children: [
                        i.jsx('p', {
                          className: 'text-white font-medium',
                          children: '🛡️ Escudo Protector',
                        }),
                        i.jsx('p', {
                          className: 'text-white/70 text-sm',
                          children: 'Activo • 3 usos',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            i.jsxs('div', {
              className: 'bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20',
              children: [
                i.jsxs('h3', {
                  className: 'text-lg font-semibold text-white mb-4 flex items-center',
                  children: [
                    i.jsx(x, { className: 'w-5 h-5 mr-2 text-purple-400' }),
                    'Ranking Global',
                  ],
                }),
                i.jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    i.jsxs('div', {
                      className: 'flex justify-between text-white/70',
                      children: [
                        i.jsx('span', { children: 'Tu posición' }),
                        i.jsx('span', { className: 'text-purple-400', children: '#127' }),
                      ],
                    }),
                    i.jsxs('div', {
                      className: 'flex justify-between text-white/70',
                      children: [
                        i.jsx('span', { children: 'Jugadores totales' }),
                        i.jsx('span', { className: 'text-white', children: '10,234' }),
                      ],
                    }),
                    i.jsxs('div', {
                      className: 'flex justify-between text-white/70',
                      children: [
                        i.jsx('span', { children: 'Top 1%' }),
                        i.jsx('span', { className: 'text-yellow-400', children: '🔥' }),
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
  },
  b = new e({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: !1 } } });
p(document.getElementById('demo-root')).render(
  i.jsx(h.StrictMode, {
    children: i.jsx(s, { client: b, children: i.jsx(u, { children: i.jsx(j, {}) }) }),
  })
);
