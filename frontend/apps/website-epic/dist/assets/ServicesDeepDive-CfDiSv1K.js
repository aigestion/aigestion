import { j as e } from './vendor-3d-BTgeB28l.js';
import { m as a } from './vendor-motion-I6wcTx_q.js';
import { B as t, W as i, k as s, m as o, n, G as r } from './vendor-ui-DAuP2EEx.js';
import './vendor-react-DzSuaLpV.js';
const l = [
    {
      title: 'Arquitectura IA Soberana',
      description:
        'Dise\xf1amos el n\xfacleo inteligente que gobierna procesos cr\xedticos con control total de datos y modelos.',
      icon: t,
      bullets: [
        'Modelos privados y gobernanza',
        'Orquestaci\xf3n multi-agente',
        'Auditor\xeda y explicabilidad',
      ],
    },
    {
      title: 'Automatizaci\xf3n Operativa',
      description:
        'Flujos inteligentes que reducen tiempos, eliminan errores y conectan equipos en tiempo real.',
      icon: i,
      bullets: ['RPA + IA contextual', 'Integraci\xf3n con ERP/CRM', 'SLA y monitoreo continuo'],
    },
    {
      title: 'Seguridad y Cumplimiento',
      description:
        'Capas de seguridad, trazabilidad y cumplimiento regulatorio por industria y pa\xeds.',
      icon: s,
      bullets: ['Zero-trust IA', 'Data lineage y retenci\xf3n', 'Cumplimiento sectorial'],
    },
    {
      title: 'Inteligencia Comercial',
      description:
        'Dashboards y anal\xedtica predictiva para ventas, finanzas y operaciones estrat\xe9gicas.',
      icon: o,
      bullets: ['KPIs accionables', 'Forecasting y alertas', 'Simuladores ROI'],
    },
    {
      title: 'Integraciones Extremo a Extremo',
      description: 'Conectamos tu ecosistema digital sin fricci\xf3n con APIs y conectores listos.',
      icon: n,
      bullets: ['Conectores empresariales', 'APIs seguras', 'Eventos en tiempo real'],
    },
    {
      title: 'Capacitaci\xf3n & Change Management',
      description:
        'Alineamos al equipo para adopci\xf3n r\xe1pida y sostenible con formaci\xf3n por roles.',
      icon: r,
      bullets: ['Academia AIGestion', 'Playbooks por gremio', 'Soporte premium'],
    },
  ],
  c = () =>
    e.jsxs('section', {
      id: 'services',
      className: 'relative py-32 bg-black overflow-hidden',
      children: [
        e.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-top from-nexus-violet/10 via-transparent to-transparent',
        }),
        e.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 relative z-10',
          children: [
            e.jsxs(a.div, {
              className: 'text-center mb-16',
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.8 },
              viewport: { once: !0 },
              children: [
                e.jsxs('h2', {
                  className: 'text-5xl md:text-7xl font-orbitron font-black text-white mb-4',
                  children: [
                    'SERVICIOS ',
                    e.jsx('span', {
                      className: 'text-nexus-cyan text-glow',
                      children: 'INTEGRALES',
                    }),
                  ],
                }),
                e.jsx('p', {
                  className: 'text-lg text-nexus-silver/70 max-w-3xl mx-auto',
                  children:
                    'AIGestion entrega una plataforma completa: estrategia, tecnolog\xeda, automatizaci\xf3n y adopci\xf3n. Cada m\xf3dulo est\xe1 dise\xf1ado para resultados medibles y escalables.',
                }),
              ],
            }),
            e.jsx('div', {
              className: 'grid md:grid-cols-2 xl:grid-cols-3 gap-8',
              children: l.map((t, i) =>
                e.jsxs(
                  a.div,
                  {
                    className:
                      'relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden',
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: 0.05 * i },
                    viewport: { once: !0 },
                    children: [
                      e.jsx('div', {
                        className:
                          'absolute inset-0 bg-gradient-to-br from-nexus-violet/10 via-transparent to-nexus-cyan/10 opacity-50',
                      }),
                      e.jsxs('div', {
                        className: 'relative z-10 space-y-4',
                        children: [
                          e.jsx('div', {
                            className:
                              'w-12 h-12 rounded-2xl bg-nexus-violet/10 border border-nexus-violet/30 flex items-center justify-center',
                            children: e.jsx(t.icon, { className: 'w-6 h-6 text-nexus-cyan-glow' }),
                          }),
                          e.jsx('h3', {
                            className: 'text-xl font-orbitron text-white font-bold',
                            children: t.title,
                          }),
                          e.jsx('p', {
                            className: 'text-sm text-nexus-silver/70 leading-relaxed',
                            children: t.description,
                          }),
                          e.jsx('ul', {
                            className: 'space-y-2 text-xs text-nexus-silver/60',
                            children: t.bullets.map(a =>
                              e.jsxs(
                                'li',
                                {
                                  className: 'flex items-center gap-2',
                                  children: [
                                    e.jsx('span', {
                                      className: 'h-1.5 w-1.5 rounded-full bg-nexus-cyan',
                                    }),
                                    a,
                                  ],
                                },
                                a
                              )
                            ),
                          }),
                        ],
                      }),
                    ],
                  },
                  t.title
                )
              ),
            }),
          ],
        }),
      ],
    });
export { c as ServicesDeepDive };
