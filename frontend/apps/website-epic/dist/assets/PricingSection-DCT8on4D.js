import { j as e } from './vendor-3d-BTgeB28l.js';
import { r as a } from './vendor-react-DzSuaLpV.js';
import { m as i, A as t } from './vendor-motion-I6wcTx_q.js';
import { o as s, C as r, p as n, H as o } from './vendor-ui-DAuP2EEx.js';
const l = {
    familias: {
      title: 'N\xdaCLEO FAMILIAR',
      description:
        'Inteligencia soberana para la gesti\xf3n dom\xe9stica, seguridad personal y coordinaci\xf3n familiar.',
      icon: e.jsx(o, { className: 'w-8 h-8' }),
      color: 'from-nexus-cyan to-blue-500',
      accent: 'nexus-cyan',
      plans: [
        {
          name: 'Nexus Home',
          price: '\u20ac29/mes',
          features: [
            'Dom\xf3tica Aut\xf3noma',
            'Control con Daniela AI',
            'Privacidad Estricta Local',
          ],
        },
        {
          name: 'Guardian Family',
          price: '\u20ac59/mes',
          features: ['Seguridad Perimetral IA', 'Asistente Educativo', 'Coordinaci\xf3n de Salud'],
        },
        {
          name: 'Sovereign Clan',
          price: '\u20ac129/mes',
          features: ['Nube Privada Familiar', 'Gobernanza Digital', 'Soporte Concierge'],
        },
      ],
    },
    empresas: {
      title: 'ENTORNO EMPRESARIAL',
      description:
        'Sistemas avanzados de automatizaci\xf3n industrial y orquestaci\xf3n de inteligencia para negocios.',
      icon: e.jsx(n, { className: 'w-8 h-8' }),
      color: 'from-nexus-violet to-fuchsia-600',
      accent: 'nexus-violet',
      plans: [
        {
          name: 'Enterprise Core',
          price: 'Desde \u20ac490/mes',
          features: ['Automatizaci\xf3n de Procesos', 'Panel de Control Nexus', 'Soporte 24/7'],
        },
        {
          name: 'Strategic Pulse',
          price: 'Desde \u20ac1.490/mes',
          features: [
            'IA Aplicada por \xc1rea',
            'Integraci\xf3n CRM/ERP',
            'Anal\xedtica Predictiva',
          ],
        },
        {
          name: 'God Mode Sovereign',
          price: 'Cotizaci\xf3n',
          features: ['Modelos Propietarios', 'Nube Soberana', 'Ingenier\xeda Dedicada'],
        },
      ],
    },
  },
  c = () => {
    const [n, o] = a.useState('empresas');
    return e.jsxs('section', {
      id: 'pricing',
      className: 'py-32 bg-black relative overflow-hidden',
      children: [
        e.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-bottom from-nexus-cyan/5 via-transparent to-transparent',
        }),
        e.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 relative z-10',
          children: [
            e.jsxs(i.div, {
              className: 'text-center mb-24',
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: !0 },
              children: [
                e.jsxs('h2', {
                  className:
                    'text-4xl md:text-6xl font-orbitron font-black text-white mb-6 uppercase tracking-tighter',
                  children: [
                    'SELECCIONE SU ',
                    e.jsx('span', { className: 'kinetic-text italic', children: 'DOMINIO' }),
                  ],
                }),
                e.jsx('p', {
                  className: 'text-nexus-silver/60 max-w-2xl mx-auto text-lg',
                  children:
                    'Arquitecturas de inteligencia dise\xf1adas para escalar con su ecosistema, ya sea personal o institucional.',
                }),
              ],
            }),
            e.jsx('div', {
              className: 'grid md:grid-cols-2 gap-8 mb-16',
              children: ['familias', 'empresas'].map(a =>
                e.jsxs(
                  i.button,
                  {
                    onClick: () => o(a),
                    className:
                      'relative p-10 rounded-3xl border transition-all duration-500 text-left overflow-hidden group ' +
                      (n === a
                        ? 'border-white/20 bg-white/5'
                        : 'border-white/5 bg-transparent grayscale opacity-50 hover:opacity-80'),
                    children: [
                      e.jsxs('div', {
                        className: 'flex items-center gap-6 mb-4 relative z-10',
                        children: [
                          e.jsx('div', {
                            className: `p-4 rounded-2xl bg-linear-to-br ${l[a].color} text-white shadow-lg shadow-white/5`,
                            children: l[a].icon,
                          }),
                          e.jsxs('div', {
                            children: [
                              e.jsx('h3', {
                                className:
                                  'text-2xl font-orbitron font-bold text-white tracking-widest uppercase',
                                children: l[a].title,
                              }),
                              e.jsx('div', {
                                className: `h-1 w-12 mt-2 bg-linear-to-r ${l[a].color}`,
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsx('p', {
                        className: 'text-nexus-silver/40 text-sm leading-relaxed relative z-10',
                        children: l[a].description,
                      }),
                    ],
                  },
                  a
                )
              ),
            }),
            e.jsx(t, {
              mode: 'wait',
              children: e.jsx(
                i.div,
                {
                  initial: { opacity: 0, x: 20 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: -20 },
                  transition: { duration: 0.5, ease: 'circOut' },
                  className: 'grid lg:grid-cols-3 gap-8',
                  children: l[n].plans.map((a, t) =>
                    e.jsx(
                      'div',
                      {
                        className: 'flex flex-col group',
                        children: e.jsxs('div', {
                          className:
                            'premium-glass p-8 rounded-3xl h-full border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col',
                          children: [
                            e.jsxs('div', {
                              className: 'mb-8',
                              children: [
                                e.jsx('h4', {
                                  className:
                                    'font-orbitron text-[10px] tracking-[0.4em] text-nexus-silver/40 mb-4 uppercase',
                                  children: a.name,
                                }),
                                e.jsx('div', {
                                  className: 'text-4xl font-black text-white mb-2 tracking-tight',
                                  children: a.price,
                                }),
                                e.jsx('div', {
                                  className:
                                    'w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4',
                                  children: e.jsx(i.div, {
                                    initial: { width: 0 },
                                    animate: { width: 33 * (t + 1) + '%' },
                                    className: `h-full bg-linear-to-r ${l[n].color}`,
                                  }),
                                }),
                              ],
                            }),
                            e.jsx('ul', {
                              className: 'space-y-4 mb-10 grow',
                              children: a.features.map(a =>
                                e.jsxs(
                                  'li',
                                  {
                                    className:
                                      'flex items-start gap-3 text-sm text-nexus-silver/60 group-hover:text-nexus-silver transition-colors',
                                    children: [
                                      e.jsx(s, {
                                        className:
                                          'w-4 h-4 mt-0.5 shrink-0 text-white/20 group-hover:text-nexus-cyan-glow',
                                      }),
                                      e.jsx('span', { children: a }),
                                    ],
                                  },
                                  a
                                )
                              ),
                            }),
                            e.jsxs('button', {
                              className:
                                'w-full mt-8 py-4 rounded-xl border border-white/10 hover:border-white/30 text-[10px] tracking-[0.4em] uppercase font-bold transition-all hover:bg-white/5 flex items-center justify-center gap-2 group/btn',
                              children: [
                                'Adquirir Protocolo',
                                e.jsx(r, {
                                  className:
                                    'w-3 h-3 group-hover/btn:translate-x-1 transition-transform',
                                }),
                              ],
                            }),
                          ],
                        }),
                      },
                      a.name
                    )
                  ),
                },
                n
              ),
            }),
          ],
        }),
      ],
    });
  };
export { c as PricingSection };
