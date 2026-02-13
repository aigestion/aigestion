import { j as e, r as s, m as a, ah as t, ai as r, C as i } from './ui.js';
import { r as n } from './vendor.js';
import { d as c } from './main.js';
import './index.js';
import './three.js';
import './router.js';
const l = 'http://localhost:5000/api/v1';
const o = new (class {
    async getHeaders() {
      return { 'Content-Type': 'application/json' };
    }
    async getBillingSnapshot() {
      const e = await this.getHeaders(),
        s = await fetch(`${l}/billing/snapshot`, { method: 'GET', headers: e });
      if (!s.ok) throw new Error('Failed to fetch billing snapshot');
      return s.json();
    }
    async createCheckoutSession(e) {
      const s = await this.getHeaders(),
        a = await fetch(`${l}/billing/checkout`, {
          method: 'POST',
          headers: s,
          body: JSON.stringify({ priceId: e }),
        });
      if (!a.ok) {
        const e = await a.json().catch(() => ({}));
        throw new Error(e.message || 'Failed to create checkout session');
      }
      return a.json();
    }
    async createPortalSession() {
      const e = await this.getHeaders(),
        s = await fetch(`${l}/billing/portal`, { method: 'POST', headers: e });
      if (!s.ok) {
        const e = await s.json().catch(() => ({}));
        throw new Error(e.message || 'Failed to create portal session');
      }
      return s.json();
    }
  })(),
  d = [
    {
      name: 'Esencial',
      priceId: 'price_1QjKIJNHiQCSTOYx5Z...PLACHOLDER',
      price: '$490',
      frequency: '/mes',
      description: 'Startups y pymes en crecimiento',
      features: [
        'Automatización base',
        'Panel de control',
        'Soporte estándar',
        'Implementación rápida',
      ],
    },
    {
      name: 'Evolución',
      priceId: 'price_1QjKIJNHiQCSTOYx...PLACEHOLDER',
      price: '$1,490',
      frequency: '/mes',
      description: 'Empresas con equipos multi-área',
      features: [
        'IA aplicada por área',
        'Integraciones CRM/ERP',
        'Reportes avanzados',
        'Onboarding guiado',
      ],
      popular: !0,
    },
    {
      name: 'Soberano',
      priceId: '',
      price: 'Cotización',
      frequency: '',
      description: 'Corporativos y sector público',
      features: ['Modelos privados', 'Gobernanza y compliance', 'Equipo dedicado', 'SLA premium'],
    },
  ],
  x = () => {
    const [l, x] = n.useState(!0),
      [p, h] = n.useState(null),
      [m, u] = n.useState(null),
      { notify: b } = c();
    n.useEffect(() => {
      f();
    }, []);
    const f = async () => {
      try {
        const e = await o.getBillingSnapshot();
        u(e);
      } catch (e) {
        b('Error', 'No se pudo cargar la información de facturación.', 'error');
      } finally {
        x(!1);
      }
    };
    return l
      ? e.jsx('div', {
          className: 'min-h-screen bg-nexus-obsidian pt-24 flex items-center justify-center',
          children: e.jsx(s, { className: 'w-12 h-12 text-nexus-cyan animate-spin' }),
        })
      : e.jsx('div', {
          className: 'min-h-screen bg-nexus-obsidian pt-24 pb-12 px-6',
          children: e.jsxs('div', {
            className: 'max-w-7xl mx-auto',
            children: [
              e.jsxs(a.div, {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                className: 'mb-12',
                children: [
                  e.jsxs('h1', {
                    className: 'text-4xl font-orbitron font-bold text-white mb-4',
                    children: [
                      'Facturación y ',
                      e.jsx('span', {
                        className: 'text-nexus-cyan text-glow',
                        children: 'Suscripción',
                      }),
                    ],
                  }),
                  e.jsx('p', {
                    className: 'text-nexus-silver/70',
                    children: 'Gestiona tu plan, método de pago e historial de facturación.',
                  }),
                ],
              }),
              e.jsx(a.div, {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                className:
                  'bg-white/5 border border-white/10 rounded-2xl p-8 mb-16 backdrop-blur-sm',
                children: e.jsxs('div', {
                  className:
                    'flex flex-col md:flex-row items-start md:items-center justify-between gap-6',
                  children: [
                    e.jsxs('div', {
                      children: [
                        e.jsxs('h2', {
                          className: 'text-xl font-bold text-white mb-2 flex items-center gap-3',
                          children: [
                            'Estado de Suscripción',
                            m?.hasActiveSubscription
                              ? e.jsx('span', {
                                  className:
                                    'bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30',
                                  children: 'ACTIVO',
                                })
                              : e.jsx('span', {
                                  className:
                                    'bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500/30',
                                  children: 'INACTIVO',
                                }),
                          ],
                        }),
                        m?.subscription
                          ? e.jsxs('p', {
                              className: 'text-nexus-silver',
                              children: [
                                'Plan actual:',
                                ' ',
                                e.jsx('span', {
                                  className: 'text-white font-semibold',
                                  children:
                                    'month' === m.subscription.plan.interval ? 'Mensual' : 'Anual',
                                }),
                                ' ',
                                '• Renueva el',
                                ' ',
                                new Date(
                                  1e3 * m.subscription.current_period_end
                                ).toLocaleDateString(),
                              ],
                            })
                          : e.jsx('p', {
                              className: 'text-nexus-silver',
                              children: 'No tienes una suscripción activa actualmente.',
                            }),
                      ],
                    }),
                    m?.hasActiveSubscription &&
                      e.jsxs('button', {
                        onClick: async () => {
                          h('portal');
                          try {
                            const { url: e } = await o.createPortalSession();
                            window.location.href = e;
                          } catch (e) {
                            (b(
                              'Error',
                              e.message || 'Error al abrir el portal de facturación.',
                              'error'
                            ),
                              h(null));
                          }
                        },
                        disabled: 'portal' === p,
                        className:
                          'flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all border border-white/10 disabled:opacity-50',
                        children: [
                          'portal' === p
                            ? e.jsx(s, { className: 'w-5 h-5 animate-spin' })
                            : e.jsx(t, { className: 'w-5 h-5' }),
                          'Gestionar en Stripe',
                        ],
                      }),
                  ],
                }),
              }),
              !m?.hasActiveSubscription &&
                e.jsx('div', {
                  className: 'grid lg:grid-cols-3 gap-8 mb-16',
                  children: d.map((t, n) =>
                    e.jsxs(
                      a.div,
                      {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: 0.1 * n },
                        className:
                          'relative p-8 rounded-3xl border backdrop-blur-md flex flex-col ' +
                          (t.popular
                            ? 'border-nexus-cyan/50 bg-nexus-cyan/5 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                            : 'border-white/10 bg-white/5'),
                        children: [
                          t.popular &&
                            e.jsx('div', {
                              className:
                                'absolute -top-4 left-1/2 -translate-x-1/2 bg-nexus-cyan text-black font-bold text-xs px-4 py-1 rounded-full tracking-wider uppercase',
                              children: 'Más Popular',
                            }),
                          e.jsxs('div', {
                            className: 'mb-6',
                            children: [
                              e.jsx('h3', {
                                className:
                                  'text-nexus-cyan font-orbitron tracking-widest text-sm uppercase mb-2',
                                children: t.name,
                              }),
                              e.jsxs('div', {
                                className: 'flex items-baseline gap-1',
                                children: [
                                  e.jsx('span', {
                                    className: 'text-4xl font-bold text-white',
                                    children: t.price,
                                  }),
                                  e.jsx('span', {
                                    className: 'text-nexus-silver/70 text-sm',
                                    children: t.frequency,
                                  }),
                                ],
                              }),
                              e.jsx('p', {
                                className: 'text-sm text-nexus-silver mt-4',
                                children: t.description,
                              }),
                            ],
                          }),
                          e.jsx('ul', {
                            className: 'space-y-4 mb-8 flex-1',
                            children: t.features.map(s =>
                              e.jsxs(
                                'li',
                                {
                                  className: 'flex items-start gap-3 text-sm text-nexus-silver/90',
                                  children: [
                                    e.jsx(r, { className: 'w-5 h-5 text-nexus-cyan shrink-0' }),
                                    s,
                                  ],
                                },
                                s
                              )
                            ),
                          }),
                          e.jsx('button', {
                            onClick: () =>
                              (async e => {
                                if (e) {
                                  h(e);
                                  try {
                                    const { url: s } = await o.createCheckoutSession(e);
                                    window.location.href = s;
                                  } catch (s) {
                                    (b(
                                      'Error',
                                      s.message || 'Error al iniciar el checkout.',
                                      'error'
                                    ),
                                      h(null));
                                  }
                                } else
                                  b(
                                    'Contactar Ventas',
                                    'Para el plan Soberano, por favor contáctanos directamente.',
                                    'info'
                                  );
                              })(t.priceId),
                            disabled: p === t.priceId,
                            className: `w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${t.popular ? 'bg-nexus-cyan text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-white text-black hover:bg-white/90'} disabled:opacity-50`,
                            children:
                              p === t.priceId
                                ? e.jsx(s, { className: 'w-5 h-5 animate-spin' })
                                : e.jsxs(e.Fragment, {
                                    children: [
                                      t.priceId ? 'Comenzar Ahora' : 'Contactar Ventas',
                                      t.priceId && e.jsx(i, { className: 'w-4 h-4' }),
                                    ],
                                  }),
                          }),
                        ],
                      },
                      t.name
                    )
                  ),
                }),
              m?.invoices &&
                m.invoices.length > 0 &&
                e.jsxs('div', {
                  className: 'mt-12',
                  children: [
                    e.jsx('h3', {
                      className: 'text-2xl font-orbitron font-bold text-white mb-6',
                      children: 'Historial de Pagos',
                    }),
                    e.jsx('div', {
                      className: 'bg-white/5 border border-white/10 rounded-2xl overflow-hidden',
                      children: e.jsxs('table', {
                        className: 'w-full text-left',
                        children: [
                          e.jsx('thead', {
                            className:
                              'bg-white/5 text-nexus-silver text-sm uppercase tracking-wider',
                            children: e.jsxs('tr', {
                              children: [
                                e.jsx('th', { className: 'p-6 font-normal', children: 'Fecha' }),
                                e.jsx('th', { className: 'p-6 font-normal', children: 'Monto' }),
                                e.jsx('th', { className: 'p-6 font-normal', children: 'Estado' }),
                                e.jsx('th', {
                                  className: 'p-6 font-normal text-right',
                                  children: 'Factura',
                                }),
                              ],
                            }),
                          }),
                          e.jsx('tbody', {
                            className: 'divide-y divide-white/5',
                            children: m.invoices.map(s =>
                              e.jsxs(
                                'tr',
                                {
                                  className: 'hover:bg-white/5 transition-colors',
                                  children: [
                                    e.jsx('td', {
                                      className: 'p-6 text-white',
                                      children: new Date(1e3 * s.created).toLocaleDateString(),
                                    }),
                                    e.jsxs('td', {
                                      className: 'p-6 text-white font-mono',
                                      children: [
                                        '$',
                                        (s.amount_paid / 100).toFixed(2),
                                        ' ',
                                        s.currency.toUpperCase(),
                                      ],
                                    }),
                                    e.jsx('td', {
                                      className: 'p-6',
                                      children: e.jsx('span', {
                                        className:
                                          'bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 capitalize',
                                        children: s.status,
                                      }),
                                    }),
                                    e.jsx('td', {
                                      className: 'p-6 text-right',
                                      children: e.jsxs('a', {
                                        href: s.pdf_url,
                                        target: '_blank',
                                        rel: 'noreferrer',
                                        className:
                                          'text-nexus-cyan hover:underline text-sm inline-flex items-center gap-1',
                                        children: [
                                          'Descargar ',
                                          e.jsx(t, { className: 'w-3 h-3' }),
                                        ],
                                      }),
                                    }),
                                  ],
                                },
                                s.id
                              )
                            ),
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
            ],
          }),
        });
  };
export { x as BillingDashboard };
