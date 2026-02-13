import {
  f as e,
  aj as t,
  j as a,
  m as s,
  t as r,
  c as o,
  ak as i,
  al as n,
  am as l,
  u as c,
} from './ui.js';
import { r as d } from './vendor.js';
import { L as p } from './router.js';
import { e as m, G as u, M as x } from './main.js';
import './index.js';
import './three.js';
const h = () => {
  const { playHover: h, playClick: g, playWhoosh: v } = m(),
    { scrollY: b } = e(),
    f = t(b, [0, 500], [0, 200]),
    j = t(b, [0, 300], [1, 0]),
    y = [
      {
        title: 'Sala de Reuniones',
        description:
          'Un lugar donde puedes hablar con otras personas como si estuvieras allí mismo. Ideal para charlar y compartir ideas.',
        icon: r,
        color: 'from-blue-500/20 to-cyan-500/20',
        border: 'group-hover:neon-glow-cyan',
      },
      {
        title: 'Exposición de Inventos',
        description:
          'Mira nuestros proyectos y productos en 3D. Puedes moverlos y verlos desde todos los ángulos.',
        icon: o,
        color: 'from-purple-500/20 to-pink-500/20',
        border: 'group-hover:neon-glow-violet',
      },
      {
        title: 'Tu Mesa de Trabajo',
        description:
          'Un espacio tranquilo donde tienes toda la información de tu negocio siempre a mano.',
        icon: i,
        color: 'from-green-500/20 to-emerald-500/20',
        border: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      },
      {
        title: 'Fotos con IA',
        description:
          'Usa nuestra tecnología para crear imágenes increíbles de tu oficina o productos al instante.',
        icon: n,
        color: 'from-orange-500/20 to-yellow-500/20',
        border: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
      },
    ],
    w = ({ children: e, className: r = '' }) => {
      const o = d.useRef(null),
        i = c(0),
        n = c(0),
        l = t(n, [-0.5, 0.5], [15, -15]),
        p = t(i, [-0.5, 0.5], [-15, 15]);
      return a.jsx(s.div, {
        ref: o,
        onMouseMove: e => {
          if (!o.current) return;
          const t = o.current.getBoundingClientRect(),
            a = t.width,
            s = t.height,
            r = (e.clientX - t.left) / a - 0.5,
            l = (e.clientY - t.top) / s - 0.5;
          (i.set(r), n.set(l));
        },
        onMouseLeave: () => {
          (i.set(0), n.set(0));
        },
        onMouseEnter: () => h(),
        style: { rotateX: l, rotateY: p, transformStyle: 'preserve-3d' },
        className: r,
        children: e,
      });
    };
  return a.jsxs('div', {
    className:
      'min-h-screen bg-nexus-obsidian pt-32 pb-24 px-6 relative overflow-hidden perspective-1000',
    children: [
      a.jsx('div', {
        className:
          "fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50 mix-blend-overlay",
      }),
      a.jsx(s.div, {
        style: { y: f },
        className:
          'absolute inset-0 bg-radial-at-top from-nexus-violet/10 via-transparent to-transparent pointer-events-none',
      }),
      a.jsx('div', {
        className:
          'absolute top-0 right-0 w-96 h-96 bg-nexus-cyan/5 blur-[120px] rounded-full pointer-events-none animate-pulse-glow',
      }),
      a.jsxs('div', {
        className: 'max-w-6xl mx-auto relative z-10',
        children: [
          a.jsxs(s.header, {
            style: { opacity: j },
            initial: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
            animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
            transition: { duration: 0.8, ease: 'circOut' },
            className: 'text-center mb-20',
            children: [
              a.jsx('h1', {
                className:
                  'text-4xl md:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-nexus-silver to-white mb-6 animate-pulse-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]',
                children: a.jsx(u, { text: 'TU OFICINA DEL FUTURO' }),
              }),
              a.jsxs('p', {
                className:
                  'text-nexus-silver/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed',
                children: [
                  a.jsx('span', { className: 'text-nexus-cyan-glow', children: '●' }),
                  ' Antes de entrar, queremos que sepas que vas a viajar a un mundo virtual. Es como un videojuego, pero hecho para que tu empresa sea la mejor del mundo.',
                ],
              }),
            ],
          }),
          a.jsx('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-8 mb-20',
            children: y.map((e, t) => {
              const r = e.icon;
              return a.jsx(
                w,
                {
                  className: 'perspective-1000',
                  children: a.jsxs(s.div, {
                    initial: { opacity: 0, x: t % 2 == 0 ? -50 : 50 },
                    whileInView: { opacity: 1, x: 0 },
                    viewport: { once: !0 },
                    transition: { delay: 0.1 * t, type: 'spring' },
                    className: `relative z-10 h-full p-8 rounded-[2rem] bg-gradient-to-br ${e.color} border border-white/5 backdrop-blur-sm group transition-all duration-300 ${e.border}`,
                    children: [
                      a.jsxs('div', {
                        className:
                          'flex gap-6 items-start transform-style-3d group-hover:translate-z-10 transition-transform',
                        children: [
                          a.jsx('div', {
                            className:
                              'p-4 bg-black/40 rounded-2xl border border-white/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500',
                            children: a.jsx(r, { className: 'w-8 h-8 text-white' }),
                          }),
                          a.jsxs('div', {
                            children: [
                              a.jsx('h2', {
                                className:
                                  'text-2xl font-orbitron font-bold mb-3 text-white group-hover:text-glow-cyan transition-all',
                                children: e.title,
                              }),
                              a.jsx('p', {
                                className:
                                  'text-nexus-silver/80 text-sm leading-relaxed font-light',
                                children: e.description,
                              }),
                            ],
                          }),
                        ],
                      }),
                      a.jsx('div', {
                        className:
                          'absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none',
                      }),
                    ],
                  }),
                },
                e.title
              );
            }),
          }),
          a.jsxs(s.section, {
            initial: { opacity: 0, y: 50 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: !0 },
            className:
              'premium-glass p-12 rounded-[3rem] text-center border-white/10 relative overflow-hidden group',
            children: [
              a.jsx('div', {
                className:
                  'absolute inset-0 bg-gradient-to-r from-nexus-violet/20 via-transparent to-nexus-cyan/20 opacity-50 group-hover:opacity-100 transition-opacity duration-1000',
              }),
              a.jsx('div', {
                className:
                  'absolute -inset-[100%] top-0 block h-[200%] w-[10px] -rotate-[20deg] bg-white/20 blur-[5px] animate-[shine_5s_infinite_linear]',
              }),
              a.jsx('h3', {
                className: 'text-3xl font-orbitron font-bold mb-6 text-white relative z-10',
                children: '¿Estás listo para el viaje?',
              }),
              a.jsx('p', {
                className: 'text-nexus-silver/70 mb-10 max-w-xl mx-auto relative z-10',
                children:
                  'Haz clic en el botón de abajo y te llevaremos directamente a tu sede oficial. Solo necesitas tu ratón para moverte y explorar.',
              }),
              a.jsx('div', {
                className: 'flex justify-center',
                children: a.jsx(x, {
                  strength: 50,
                  children: a.jsxs(p, {
                    to: '/virtual-office/go',
                    onMouseEnter: () => h(),
                    onMouseDown: () => g(),
                    onClick: () => v(),
                    className:
                      'relative z-10 btn-enterprise px-12 py-5 rounded-full text-lg font-orbitron font-black tracking-widest inline-flex items-center gap-4 hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(138,43,226,0.5)] group-hover:shadow-[0_0_80px_rgba(0,245,255,0.5)]',
                    children: ['ENTRAR AHORA ', a.jsx(l, { className: 'w-6 h-6 animate-pulse' })],
                  }),
                }),
              }),
              a.jsxs('div', {
                className:
                  'mt-12 flex justify-center gap-8 opacity-40 text-[10px] uppercase tracking-[0.3em] font-mono',
                children: [
                  a.jsxs('span', {
                    className: 'flex items-center gap-2',
                    children: [
                      a.jsx('div', {
                        className: 'w-2 h-2 rounded-full bg-green-500 animate-pulse',
                      }),
                      ' Conexión Segura',
                    ],
                  }),
                  a.jsxs('span', {
                    className: 'flex items-center gap-2',
                    children: [
                      a.jsx('div', {
                        className: 'w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75',
                      }),
                      ' Modo Inmersivo',
                    ],
                  }),
                  a.jsxs('span', {
                    className: 'flex items-center gap-2',
                    children: [
                      a.jsx('div', {
                        className: 'w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150',
                      }),
                      ' ',
                      '100% Gratis',
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
export { h as default };
