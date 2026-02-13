import { j as e } from './vendor-3d-BTgeB28l.js';
import { m as t } from './vendor-motion-I6wcTx_q.js';
import './vendor-react-DzSuaLpV.js';
const a = [
    { title: 'Onboarding AIGestion', query: 'aigestiontiene onboarding' },
    { title: 'Automatizaci\xf3n por \xe1reas', query: 'aigestiontiene automatizacion procesos' },
    { title: 'Casos y demos en vivo', query: 'aigestiontiene demo tutorial' },
  ],
  i = () =>
    e.jsxs('section', {
      id: 'tutoriales',
      className: 'py-32 bg-black relative overflow-hidden',
      children: [
        e.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-top from-nexus-cyan/10 via-transparent to-transparent',
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
                    'TUTORIALES ',
                    e.jsx('span', { className: 'text-nexus-cyan text-glow', children: 'EN VIDEO' }),
                  ],
                }),
                e.jsx('p', {
                  className: 'text-lg text-nexus-silver/70 max-w-3xl mx-auto',
                  children: 'Aprende paso a paso con el canal oficial de AIGestion.',
                }),
              ],
            }),
            e.jsx('div', {
              className: 'grid lg:grid-cols-3 gap-8 mb-12',
              children: a.map(t =>
                e.jsxs(
                  'div',
                  {
                    className: 'rounded-3xl overflow-hidden border border-white/10 bg-white/5',
                    children: [
                      e.jsx('div', {
                        className: 'aspect-video',
                        children: e.jsx('iframe', {
                          className: 'w-full h-full',
                          src: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(t.query)}`,
                          title: t.title,
                          allow:
                            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                          allowFullScreen: !0,
                        }),
                      }),
                      e.jsxs('div', {
                        className: 'p-6',
                        children: [
                          e.jsx('h3', {
                            className: 'text-lg font-bold text-white',
                            children: t.title,
                          }),
                          e.jsx('p', {
                            className: 'text-sm text-nexus-silver/70',
                            children: 'Basado en el canal @aigestiontiene',
                          }),
                        ],
                      }),
                    ],
                  },
                  t.title
                )
              ),
            }),
            e.jsx('div', {
              className: 'text-center',
              children: e.jsx('a', {
                href: 'https://www.youtube.com/@aigestiontiene',
                target: '_blank',
                rel: 'noreferrer',
                className:
                  'inline-flex items-center gap-3 px-8 py-3 rounded-full bg-nexus-cyan/10 border border-nexus-cyan/30 text-nexus-cyan-glow hover:bg-nexus-cyan/20 transition-all font-orbitron text-[10px] tracking-[0.2em] uppercase',
                children: 'Visitar canal AIGestion',
              }),
            }),
          ],
        }),
      ],
    });
export { i as VideoTutorials };
