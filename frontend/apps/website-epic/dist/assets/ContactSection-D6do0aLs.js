import { j as e } from './vendor-3d-BTgeB28l.js';
import { u as s } from './main-B5DH-ZW_.js';
import { r as a } from './vendor-react-DzSuaLpV.js';
import { m as t } from './vendor-motion-I6wcTx_q.js';
import { G as n } from './GlitchText-B2uVSyOl.js';
import './vendor-ui-DAuP2EEx.js';
import './vendor-data-BRBMd6Um.js';
const r = ({
    title: s = 'INICIAR CONEXI\xd3N',
    description: n = 'Completa el protocolo para establecer comunicaci\xf3n con el Nexus.',
    onSubmit: r,
    variant: i = 'glass',
    className: l = '',
  }) => {
    const [o, c] = a.useState(!1),
      [d, x] = a.useState(!1),
      [m, u] = a.useState({ name: '', email: '', subject: '', message: '' }),
      h =
        'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-nexus-violet transition-all font-orbitron text-sm',
      b = 'block text-xs font-orbitron font-bold text-nexus-cyan mb-2 tracking-wider uppercase';
    return d
      ? e.jsx('div', {
          className: `p-12 text-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md ${l}`,
          children: e.jsxs(t.div, {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            className: 'flex flex-col items-center gap-6',
            children: [
              e.jsx('div', {
                className:
                  'w-20 h-20 bg-nexus-cyan/20 rounded-full flex items-center justify-center border border-nexus-cyan box-shadow-glow',
                children: e.jsx('span', {
                  className: 'text-4xl text-nexus-cyan',
                  children: '\u2713',
                }),
              }),
              e.jsx('h3', {
                className: 'text-2xl font-orbitron font-black text-white uppercase tracking-widest',
                children: 'Protocolo Completado',
              }),
              e.jsx('p', {
                className: 'text-gray-400',
                children:
                  'Tu mensaje ha sido transmitido a trav\xe9s de la red neural. Contactaremos en breve.',
              }),
              e.jsx('button', {
                onClick: () => x(!1),
                className:
                  'px-6 py-3 border border-nexus-cyan/50 text-nexus-cyan font-orbitron font-bold rounded hover:bg-nexus-cyan/10 transition-colors uppercase tracking-widest text-xs',
                children: 'Nueva Conexi\xf3n',
              }),
            ],
          }),
        })
      : e.jsxs('div', {
          className: `p-8 md:p-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md ${l}`,
          children: [
            e.jsxs('div', {
              className: 'mb-10 text-center',
              children: [
                e.jsx('h3', {
                  className:
                    'text-2xl font-orbitron font-black text-white uppercase tracking-widest mb-4',
                  children: s,
                }),
                e.jsx('p', { className: 'text-gray-400 text-sm max-w-md mx-auto', children: n }),
              ],
            }),
            e.jsxs('form', {
              onSubmit: async e => {
                (e.preventDefault(), c(!0));
                try {
                  (await r(m), x(!0));
                } catch (s) {
                } finally {
                  c(!1);
                }
              },
              className: 'space-y-6',
              children: [
                e.jsxs('div', {
                  className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
                  children: [
                    e.jsxs('div', {
                      children: [
                        e.jsx('label', { className: b, children: 'Identificaci\xf3n' }),
                        e.jsx('input', {
                          type: 'text',
                          placeholder: 'Introduce tu nombre',
                          required: !0,
                          className: h,
                          value: m.name,
                          onChange: e => u({ ...m, name: e.target.value }),
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      children: [
                        e.jsx('label', { className: b, children: 'Direcci\xf3n Neural' }),
                        e.jsx('input', {
                          type: 'email',
                          placeholder: 'tu@email.com',
                          required: !0,
                          className: h,
                          value: m.email,
                          onChange: e => u({ ...m, email: e.target.value }),
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsxs('div', {
                  children: [
                    e.jsx('label', { className: b, children: 'M\xf3dulo' }),
                    e.jsx('input', {
                      type: 'text',
                      placeholder: 'Asunto de la comunicaci\xf3n',
                      required: !0,
                      className: h,
                      value: m.subject,
                      onChange: e => u({ ...m, subject: e.target.value }),
                    }),
                  ],
                }),
                e.jsxs('div', {
                  children: [
                    e.jsx('label', { className: b, children: 'Mensaje de Datos' }),
                    e.jsx('textarea', {
                      required: !0,
                      rows: 4,
                      className: h,
                      placeholder: 'Tu mensaje...',
                      value: m.message,
                      onChange: e => u({ ...m, message: e.target.value }),
                    }),
                  ],
                }),
                e.jsx('button', {
                  type: 'submit',
                  className:
                    'w-full h-14 bg-gradient-to-r from-nexus-violet to-nexus-cyan text-white font-orbitron font-bold text-lg tracking-widest uppercase rounded-lg hover:shadow-[0_0_20px_rgba(138,43,226,0.5)] transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed',
                  disabled: o,
                  children: o ? 'TRANSMITIENDO...' : 'EJECUTAR TRANSMISI\xd3N',
                }),
              ],
            }),
          ],
        });
  },
  i = () => {
    const { playHover: a, playSuccess: i } = s();
    return e.jsxs('section', {
      id: 'contact',
      className:
        'relative py-32 bg-gradient-to-b from-black via-nexus-obsidian to-black overflow-hidden',
      children: [
        e.jsxs('div', {
          className: 'absolute inset-0',
          children: [
            e.jsx('div', {
              className:
                'absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(138,43,226,0.1),transparent_60%)]',
            }),
            e.jsx('div', {
              className:
                'absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,245,255,0.1),transparent_60%)]',
            }),
            [...Array(8)].map((s, a) =>
              e.jsx(
                t.div,
                {
                  className: 'absolute w-2 h-2 bg-nexus-cyan rounded-full opacity-30',
                  style: { left: 100 * Math.random() + '%', top: 100 * Math.random() + '%' },
                  animate: { opacity: [0.3, 0.8, 0.3], scale: [1, 2, 1], y: [0, -100, 0] },
                  transition: {
                    duration: 4 + 3 * Math.random(),
                    repeat: 1 / 0,
                    delay: 2 * Math.random(),
                  },
                },
                a
              )
            ),
          ],
        }),
        e.jsxs('div', {
          className: 'relative z-10 max-w-7xl mx-auto px-6',
          children: [
            e.jsxs(t.div, {
              className: 'text-center mb-20',
              initial: { opacity: 0, y: 50 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.8 },
              viewport: { once: !0 },
              children: [
                e.jsxs('h2', {
                  className: 'text-5xl md:text-7xl font-orbitron font-black text-white mb-6',
                  children: [
                    'CONECTA CON EL',
                    e.jsx('span', {
                      className: 'block text-nexus-cyan text-glow',
                      children: e.jsx(n, { text: 'FUTURO HOY' }),
                    }),
                  ],
                }),
                e.jsx('p', {
                  className: 'text-xl text-gray-300 max-w-3xl mx-auto',
                  children: 'Da el primer paso hacia la transformaci\xf3n digital cu\xe1ntica',
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'grid lg:grid-cols-2 gap-16',
              children: [
                e.jsx(t.div, {
                  initial: { opacity: 0, x: -50 },
                  whileInView: { opacity: 1, x: 0 },
                  transition: { duration: 0.8 },
                  viewport: { once: !0 },
                  children: e.jsx(r, {
                    title: 'INICIA TU TRANSFORMACI\xd3N',
                    description:
                      'Establece el protocolo de conexi\xf3n con el Nexus para integrar IA soberana en tu ecosistema.',
                    variant: 'glass',
                    onSubmit: async e => {
                      i();
                    },
                  }),
                }),
                e.jsxs(t.div, {
                  className: 'space-y-8',
                  initial: { opacity: 0, x: 50 },
                  whileInView: { opacity: 1, x: 0 },
                  transition: { duration: 0.8, delay: 0.2 },
                  viewport: { once: !0 },
                  children: [
                    e.jsxs('div', {
                      className:
                        'p-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl',
                      children: [
                        e.jsx('h3', {
                          className: 'text-2xl font-orbitron font-bold text-white mb-6',
                          children: 'Contacto R\xe1pido',
                        }),
                        e.jsxs('div', {
                          className: 'space-y-6',
                          children: [
                            e.jsxs(t.div, {
                              className: 'flex items-center gap-4',
                              whileHover: { x: 5 },
                              onMouseEnter: a,
                              children: [
                                e.jsx('div', {
                                  className:
                                    'w-12 h-12 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg flex items-center justify-center',
                                  children: e.jsx('span', {
                                    className: 'text-xl',
                                    children: '\ud83d\udce7',
                                  }),
                                }),
                                e.jsxs('div', {
                                  children: [
                                    e.jsx('div', {
                                      className: 'text-white font-medium',
                                      children: 'Email',
                                    }),
                                    e.jsx('div', {
                                      className: 'text-nexus-cyan',
                                      children: 'contact@aigestion.net',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs(t.div, {
                              className: 'flex items-center gap-4',
                              whileHover: { x: 5 },
                              onMouseEnter: a,
                              children: [
                                e.jsx('div', {
                                  className:
                                    'w-12 h-12 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg flex items-center justify-center',
                                  children: e.jsx('span', {
                                    className: 'text-xl',
                                    children: '\ud83d\udcf1',
                                  }),
                                }),
                                e.jsxs('div', {
                                  children: [
                                    e.jsx('div', {
                                      className: 'text-white font-medium',
                                      children: 'WhatsApp',
                                    }),
                                    e.jsx('div', {
                                      className: 'text-nexus-cyan',
                                      children: '+34 600 000 000',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs(t.div, {
                              className: 'flex items-center gap-4',
                              whileHover: { x: 5 },
                              onMouseEnter: a,
                              children: [
                                e.jsx('div', {
                                  className:
                                    'w-12 h-12 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg flex items-center justify-center',
                                  children: e.jsx('span', {
                                    className: 'text-xl',
                                    children: '\ud83d\udccd',
                                  }),
                                }),
                                e.jsxs('div', {
                                  children: [
                                    e.jsx('div', {
                                      className: 'text-white font-medium',
                                      children: 'Sede Global',
                                    }),
                                    e.jsx('div', {
                                      className: 'text-nexus-cyan',
                                      children: 'Madrid, Espa\xf1a & NYC, USA',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className:
                        'p-8 bg-white/5 border border-nexus-cyan/30 backdrop-blur-sm rounded-2xl',
                      children: [
                        e.jsx('h3', {
                          className: 'text-2xl font-orbitron font-bold text-white mb-6',
                          children: 'Horario de Atenci\xf3n',
                        }),
                        e.jsxs('div', {
                          className: 'space-y-4',
                          children: [
                            e.jsxs('div', {
                              className: 'flex justify-between items-center',
                              children: [
                                e.jsx('span', {
                                  className: 'text-gray-300',
                                  children: 'Lunes - Viernes',
                                }),
                                e.jsx('span', {
                                  className: 'text-nexus-cyan font-medium',
                                  children: '9:00 - 18:00 CET',
                                }),
                              ],
                            }),
                            e.jsxs('div', {
                              className: 'flex justify-between items-center',
                              children: [
                                e.jsx('span', {
                                  className: 'text-gray-300',
                                  children: 'S\xe1bados',
                                }),
                                e.jsx('span', {
                                  className: 'text-nexus-cyan font-medium',
                                  children: '10:00 - 14:00 CET',
                                }),
                              ],
                            }),
                            e.jsxs('div', {
                              className: 'flex justify-between items-center',
                              children: [
                                e.jsx('span', {
                                  className: 'text-gray-300',
                                  children: 'Soporte 24/7',
                                }),
                                e.jsx('span', {
                                  className: 'text-green-400 font-medium',
                                  children: 'SIEMPRE ACTIVO',
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className:
                        'p-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl',
                      children: [
                        e.jsx('h3', {
                          className: 'text-2xl font-orbitron font-bold text-white mb-6',
                          children: 'Conecta con Nosotros',
                        }),
                        e.jsx('div', {
                          className: 'grid grid-cols-2 gap-4',
                          children: [
                            {
                              name: 'LinkedIn',
                              icon: '\ud83d\udcbc',
                              color: 'from-blue-500 to-blue-700',
                            },
                            {
                              name: 'Twitter',
                              icon: '\ud83d\udc26',
                              color: 'from-sky-400 to-sky-600',
                            },
                            {
                              name: 'GitHub',
                              icon: '\ud83d\udc19',
                              color: 'from-gray-600 to-gray-800',
                            },
                            {
                              name: 'YouTube',
                              icon: '\ud83d\udcfa',
                              color: 'from-red-500 to-red-700',
                            },
                          ].map(s =>
                            e.jsxs(
                              t.button,
                              {
                                className: `p-4 bg-gradient-to-br ${s.color} rounded-xl text-white font-medium hover:scale-105 transition-transform`,
                                whileHover: { scale: 1.05 },
                                whileTap: { scale: 0.95 },
                                onMouseEnter: a,
                                children: [
                                  e.jsx('div', { className: 'text-2xl mb-1', children: s.icon }),
                                  e.jsx('div', { className: 'text-sm', children: s.name }),
                                ],
                              },
                              s.name
                            )
                          ),
                        }),
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
export { i as ContactSection };
