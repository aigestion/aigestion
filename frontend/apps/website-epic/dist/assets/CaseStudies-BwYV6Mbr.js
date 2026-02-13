import { j as e } from './vendor-3d-BTgeB28l.js';
import { m as t } from './vendor-motion-I6wcTx_q.js';
import './vendor-react-DzSuaLpV.js';
const a = [
    {
      sector: 'Salud & Cl\xednicas',
      title: 'Triaje inteligente + automatizaci\xf3n de agenda',
      impact: [
        '-48% tiempos de espera',
        '+37% productividad del personal',
        '+22% satisfacci\xf3n NPS',
      ],
    },
    {
      sector: 'Log\xedstica & Transporte',
      title: 'Orquestaci\xf3n de rutas con IA y monitoreo predictivo',
      impact: [
        '-19% costos operativos',
        '+31% cumplimiento de entregas',
        '-54% incidencias cr\xedticas',
      ],
    },
    {
      sector: 'Educaci\xf3n & Gremios',
      title: 'Plataforma de aprendizaje y asistencia para socios',
      impact: [
        '+62% adopci\xf3n digital',
        '+41% retenci\xf3n de miembros',
        '+28% ingresos por servicios',
      ],
    },
  ],
  i = () =>
    e.jsxs('section', {
      id: 'cases',
      className: 'py-32 bg-gradient-to-b from-black via-gray-900/30 to-black relative',
      children: [
        e.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-center from-nexus-cyan/10 via-transparent to-transparent',
        }),
        e.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 relative z-10',
          children: [
            e.jsxs(t.div, {
              className: 'text-center mb-16',
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.8 },
              viewport: { once: !0 },
              children: [
                e.jsxs('h2', {
                  className: 'text-5xl md:text-7xl font-orbitron font-black text-white mb-4',
                  children: [
                    'CASOS DE ',
                    e.jsx('span', {
                      className: 'text-nexus-violet text-glow',
                      children: '\xc9XITO',
                    }),
                  ],
                }),
                e.jsx('p', {
                  className: 'text-lg text-nexus-silver/70 max-w-3xl mx-auto',
                  children:
                    'Ejemplos reales con impacto medible. Dise\xf1amos estrategias adaptadas a tu industria y gremio.',
                }),
              ],
            }),
            e.jsx('div', {
              className: 'grid lg:grid-cols-3 gap-8',
              children: a.map((a, i) =>
                e.jsxs(
                  t.div,
                  {
                    className: 'p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md',
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: 0.1 * i },
                    viewport: { once: !0 },
                    children: [
                      e.jsx('div', {
                        className:
                          'text-xs font-orbitron tracking-[0.3em] text-nexus-cyan-glow mb-4 uppercase',
                        children: a.sector,
                      }),
                      e.jsx('h3', {
                        className: 'text-xl font-bold text-white mb-4',
                        children: a.title,
                      }),
                      e.jsx('ul', {
                        className: 'space-y-3 text-sm text-nexus-silver/70',
                        children: a.impact.map(t =>
                          e.jsxs(
                            'li',
                            {
                              className: 'flex items-center gap-2',
                              children: [
                                e.jsx('span', { className: 'h-2 w-2 rounded-full bg-nexus-cyan' }),
                                t,
                              ],
                            },
                            t
                          )
                        ),
                      }),
                    ],
                  },
                  a.title
                )
              ),
            }),
          ],
        }),
      ],
    });
export { i as CaseStudies };
