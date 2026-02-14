import { r as t } from './vendor.js';
var e = { exports: {} },
  n = {},
  i = t,
  s = Symbol.for('react.element'),
  o = Symbol.for('react.fragment'),
  r = Object.prototype.hasOwnProperty,
  a = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  l = { key: !0, ref: !0, __self: !0, __source: !0 };
function c(t, e, n) {
  var i,
    o = {},
    c = null,
    h = null;
  for (i in (void 0 !== n && (c = '' + n),
  void 0 !== e.key && (c = '' + e.key),
  void 0 !== e.ref && (h = e.ref),
  e))
    r.call(e, i) && !l.hasOwnProperty(i) && (o[i] = e[i]);
  if (t && t.defaultProps) for (i in (e = t.defaultProps)) void 0 === o[i] && (o[i] = e[i]);
  return { $$typeof: s, type: t, key: c, ref: h, props: o, _owner: a.current };
}
((n.Fragment = o), (n.jsx = c), (n.jsxs = c), (e.exports = n));
var h = e.exports;
const u = t.createContext({});
function d(e) {
  const n = t.useRef(null);
  return (null === n.current && (n.current = e()), n.current);
}
const p = 'undefined' != typeof window,
  m = p ? t.useLayoutEffect : t.useEffect,
  f = t.createContext(null);
function y(t, e) {
  -1 === t.indexOf(e) && t.push(e);
}
function g(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
const v = (t, e, n) => (n > e ? e : n < t ? t : n);
const x = {},
  w = t => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
function k(t) {
  return 'object' == typeof t && null !== t;
}
const T = t => /^0[^.\s]+$/u.test(t);
function M(t) {
  let e;
  return () => (void 0 === e && (e = t()), e);
}
const S = t => t,
  P = (t, e) => n => e(t(n)),
  b = (...t) => t.reduce(P),
  E = (t, e, n) => {
    const i = e - t;
    return 0 === i ? 1 : (n - t) / i;
  };
class A {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return (y(this.subscriptions, t), () => g(this.subscriptions, t));
  }
  notify(t, e, n) {
    const i = this.subscriptions.length;
    if (i)
      if (1 === i) this.subscriptions[0](t, e, n);
      else
        for (let s = 0; s < i; s++) {
          const i = this.subscriptions[s];
          i && i(t, e, n);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const C = t => 1e3 * t,
  V = t => t / 1e3;
function L(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const D = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t;
function R(t, e, n, i) {
  if (t === e && n === i) return S;
  const s = e =>
    (function (t, e, n, i, s) {
      let o,
        r,
        a = 0;
      do {
        ((r = e + (n - e) / 2), (o = D(r, i, s) - t), o > 0 ? (n = r) : (e = r));
      } while (Math.abs(o) > 1e-7 && ++a < 12);
      return r;
    })(e, 0, 1, t, n);
  return t => (0 === t || 1 === t ? t : D(s(t), e, i));
}
const j = t => e => (e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2),
  B = t => e => 1 - t(1 - e),
  F = R(0.33, 1.53, 0.69, 0.99),
  O = B(F),
  I = j(O),
  z = t => ((t *= 2) < 1 ? 0.5 * O(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1)))),
  U = t => 1 - Math.sin(Math.acos(t)),
  W = B(U),
  N = j(U),
  H = R(0.42, 0, 1, 1),
  $ = R(0, 0, 0.58, 1),
  q = R(0.42, 0, 0.58, 1),
  X = t => Array.isArray(t) && 'number' == typeof t[0],
  Y = {
    linear: S,
    easeIn: H,
    easeInOut: q,
    easeOut: $,
    circIn: U,
    circInOut: N,
    circOut: W,
    backIn: O,
    backInOut: I,
    backOut: F,
    anticipate: z,
  },
  K = t => {
    if (X(t)) {
      t.length;
      const [e, n, i, s] = t;
      return R(e, n, i, s);
    }
    return 'string' == typeof t ? Y[t] : t;
  },
  G = [
    'setup',
    'read',
    'resolveKeyframes',
    'preUpdate',
    'update',
    'preRender',
    'render',
    'postRender',
  ];
function _(t, e) {
  let n = !1,
    i = !0;
  const s = { delta: 0, timestamp: 0, isProcessing: !1 },
    o = () => (n = !0),
    r = G.reduce(
      (t, e) => (
        (t[e] = (function (t) {
          let e = new Set(),
            n = new Set(),
            i = !1,
            s = !1;
          const o = new WeakSet();
          let r = { delta: 0, timestamp: 0, isProcessing: !1 };
          function a(e) {
            (o.has(e) && (l.schedule(e), t()), e(r));
          }
          const l = {
            schedule: (t, s = !1, r = !1) => {
              const a = r && i ? e : n;
              return (s && o.add(t), a.has(t) || a.add(t), t);
            },
            cancel: t => {
              (n.delete(t), o.delete(t));
            },
            process: t => {
              ((r = t),
                i
                  ? (s = !0)
                  : ((i = !0),
                    ([e, n] = [n, e]),
                    e.forEach(a),
                    e.clear(),
                    (i = !1),
                    s && ((s = !1), l.process(t))));
            },
          };
          return l;
        })(o)),
        t
      ),
      {}
    ),
    {
      setup: a,
      read: l,
      resolveKeyframes: c,
      preUpdate: h,
      update: u,
      preRender: d,
      render: p,
      postRender: m,
    } = r,
    f = () => {
      const o = x.useManualTiming ? s.timestamp : performance.now();
      ((n = !1),
        x.useManualTiming || (s.delta = i ? 1e3 / 60 : Math.max(Math.min(o - s.timestamp, 40), 1)),
        (s.timestamp = o),
        (s.isProcessing = !0),
        a.process(s),
        l.process(s),
        c.process(s),
        h.process(s),
        u.process(s),
        d.process(s),
        p.process(s),
        m.process(s),
        (s.isProcessing = !1),
        n && e && ((i = !1), t(f)));
    };
  return {
    schedule: G.reduce((e, o) => {
      const a = r[o];
      return (
        (e[o] = (e, o = !1, r = !1) => (
          n || ((n = !0), (i = !0), s.isProcessing || t(f)),
          a.schedule(e, o, r)
        )),
        e
      );
    }, {}),
    cancel: t => {
      for (let e = 0; e < G.length; e++) r[G[e]].cancel(t);
    },
    state: s,
    steps: r,
  };
}
const {
  schedule: Z,
  cancel: J,
  state: Q,
  steps: tt,
} = _('undefined' != typeof requestAnimationFrame ? requestAnimationFrame : S, !0);
let et;
function nt() {
  et = void 0;
}
const it = {
    now: () => (
      void 0 === et &&
        it.set(Q.isProcessing || x.useManualTiming ? Q.timestamp : performance.now()),
      et
    ),
    set: t => {
      ((et = t), queueMicrotask(nt));
    },
  },
  st = t => e => 'string' == typeof e && e.startsWith(t),
  ot = st('--'),
  rt = st('var(--'),
  at = t => !!rt(t) && lt.test(t.split('/*')[0].trim()),
  lt = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function ct(t) {
  return 'string' == typeof t && t.split('/*')[0].includes('var(--');
}
const ht = { test: t => 'number' == typeof t, parse: parseFloat, transform: t => t },
  ut = { ...ht, transform: t => v(0, 1, t) },
  dt = { ...ht, default: 1 },
  pt = t => Math.round(1e5 * t) / 1e5,
  mt = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
const ft =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  yt = (t, e) => n =>
    Boolean(
      ('string' == typeof n && ft.test(n) && n.startsWith(t)) ||
      (e &&
        !(function (t) {
          return null == t;
        })(n) &&
        Object.prototype.hasOwnProperty.call(n, e))
    ),
  gt = (t, e, n) => i => {
    if ('string' != typeof i) return i;
    const [s, o, r, a] = i.match(mt);
    return {
      [t]: parseFloat(s),
      [e]: parseFloat(o),
      [n]: parseFloat(r),
      alpha: void 0 !== a ? parseFloat(a) : 1,
    };
  },
  vt = { ...ht, transform: t => Math.round((t => v(0, 255, t))(t)) },
  xt = {
    test: yt('rgb', 'red'),
    parse: gt('red', 'green', 'blue'),
    transform: ({ red: t, green: e, blue: n, alpha: i = 1 }) =>
      'rgba(' +
      vt.transform(t) +
      ', ' +
      vt.transform(e) +
      ', ' +
      vt.transform(n) +
      ', ' +
      pt(ut.transform(i)) +
      ')',
  };
const wt = {
    test: yt('#'),
    parse: function (t) {
      let e = '',
        n = '',
        i = '',
        s = '';
      return (
        t.length > 5
          ? ((e = t.substring(1, 3)),
            (n = t.substring(3, 5)),
            (i = t.substring(5, 7)),
            (s = t.substring(7, 9)))
          : ((e = t.substring(1, 2)),
            (n = t.substring(2, 3)),
            (i = t.substring(3, 4)),
            (s = t.substring(4, 5)),
            (e += e),
            (n += n),
            (i += i),
            (s += s)),
        {
          red: parseInt(e, 16),
          green: parseInt(n, 16),
          blue: parseInt(i, 16),
          alpha: s ? parseInt(s, 16) / 255 : 1,
        }
      );
    },
    transform: xt.transform,
  },
  kt = t => ({
    test: e => 'string' == typeof e && e.endsWith(t) && 1 === e.split(' ').length,
    parse: parseFloat,
    transform: e => `${e}${t}`,
  }),
  Tt = kt('deg'),
  Mt = kt('%'),
  St = kt('px'),
  Pt = kt('vh'),
  bt = kt('vw'),
  Et = (() => ({ ...Mt, parse: t => Mt.parse(t) / 100, transform: t => Mt.transform(100 * t) }))(),
  At = {
    test: yt('hsl', 'hue'),
    parse: gt('hue', 'saturation', 'lightness'),
    transform: ({ hue: t, saturation: e, lightness: n, alpha: i = 1 }) =>
      'hsla(' +
      Math.round(t) +
      ', ' +
      Mt.transform(pt(e)) +
      ', ' +
      Mt.transform(pt(n)) +
      ', ' +
      pt(ut.transform(i)) +
      ')',
  },
  Ct = {
    test: t => xt.test(t) || wt.test(t) || At.test(t),
    parse: t => (xt.test(t) ? xt.parse(t) : At.test(t) ? At.parse(t) : wt.parse(t)),
    transform: t =>
      'string' == typeof t ? t : t.hasOwnProperty('red') ? xt.transform(t) : At.transform(t),
    getAnimatableNone: t => {
      const e = Ct.parse(t);
      return ((e.alpha = 0), Ct.transform(e));
    },
  },
  Vt =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
const Lt = 'number',
  Dt = 'color',
  Rt =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function jt(t) {
  const e = t.toString(),
    n = [],
    i = { color: [], number: [], var: [] },
    s = [];
  let o = 0;
  const r = e
    .replace(
      Rt,
      t => (
        Ct.test(t)
          ? (i.color.push(o), s.push(Dt), n.push(Ct.parse(t)))
          : t.startsWith('var(')
            ? (i.var.push(o), s.push('var'), n.push(t))
            : (i.number.push(o), s.push(Lt), n.push(parseFloat(t))),
        ++o,
        '${}'
      )
    )
    .split('${}');
  return { values: n, split: r, indexes: i, types: s };
}
function Bt(t) {
  return jt(t).values;
}
function Ft(t) {
  const { split: e, types: n } = jt(t),
    i = e.length;
  return t => {
    let s = '';
    for (let o = 0; o < i; o++)
      if (((s += e[o]), void 0 !== t[o])) {
        const e = n[o];
        s += e === Lt ? pt(t[o]) : e === Dt ? Ct.transform(t[o]) : t[o];
      }
    return s;
  };
}
const Ot = t => ('number' == typeof t ? 0 : Ct.test(t) ? Ct.getAnimatableNone(t) : t);
const It = {
  test: function (t) {
    return (
      isNaN(t) &&
      'string' == typeof t &&
      (t.match(mt)?.length || 0) + (t.match(Vt)?.length || 0) > 0
    );
  },
  parse: Bt,
  createTransformer: Ft,
  getAnimatableNone: function (t) {
    const e = Bt(t);
    return Ft(t)(e.map(Ot));
  },
};
function zt(t, e, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6 ? t + 6 * (e - t) * n : n < 0.5 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t
  );
}
function Ut(t, e) {
  return n => (n > 0 ? e : t);
}
const Wt = (t, e, n) => t + (e - t) * n,
  Nt = (t, e, n) => {
    const i = t * t,
      s = n * (e * e - i) + i;
    return s < 0 ? 0 : Math.sqrt(s);
  },
  Ht = [wt, xt, At];
function $t(t) {
  const e = ((n = t), Ht.find(t => t.test(n)));
  var n;
  if (!e) return !1;
  let i = e.parse(t);
  return (
    e === At &&
      (i = (function ({ hue: t, saturation: e, lightness: n, alpha: i }) {
        ((t /= 360), (n /= 100));
        let s = 0,
          o = 0,
          r = 0;
        if ((e /= 100)) {
          const i = n < 0.5 ? n * (1 + e) : n + e - n * e,
            a = 2 * n - i;
          ((s = zt(a, i, t + 1 / 3)), (o = zt(a, i, t)), (r = zt(a, i, t - 1 / 3)));
        } else s = o = r = n;
        return {
          red: Math.round(255 * s),
          green: Math.round(255 * o),
          blue: Math.round(255 * r),
          alpha: i,
        };
      })(i)),
    i
  );
}
const qt = (t, e) => {
    const n = $t(t),
      i = $t(e);
    if (!n || !i) return Ut(t, e);
    const s = { ...n };
    return t => (
      (s.red = Nt(n.red, i.red, t)),
      (s.green = Nt(n.green, i.green, t)),
      (s.blue = Nt(n.blue, i.blue, t)),
      (s.alpha = Wt(n.alpha, i.alpha, t)),
      xt.transform(s)
    );
  },
  Xt = new Set(['none', 'hidden']);
function Yt(t, e) {
  return n => Wt(t, e, n);
}
function Kt(t) {
  return 'number' == typeof t
    ? Yt
    : 'string' == typeof t
      ? at(t)
        ? Ut
        : Ct.test(t)
          ? qt
          : Zt
      : Array.isArray(t)
        ? Gt
        : 'object' == typeof t
          ? Ct.test(t)
            ? qt
            : _t
          : Ut;
}
function Gt(t, e) {
  const n = [...t],
    i = n.length,
    s = t.map((t, n) => Kt(t)(t, e[n]));
  return t => {
    for (let e = 0; e < i; e++) n[e] = s[e](t);
    return n;
  };
}
function _t(t, e) {
  const n = { ...t, ...e },
    i = {};
  for (const s in n) void 0 !== t[s] && void 0 !== e[s] && (i[s] = Kt(t[s])(t[s], e[s]));
  return t => {
    for (const e in i) n[e] = i[e](t);
    return n;
  };
}
const Zt = (t, e) => {
  const n = It.createTransformer(e),
    i = jt(t),
    s = jt(e);
  return i.indexes.var.length === s.indexes.var.length &&
    i.indexes.color.length === s.indexes.color.length &&
    i.indexes.number.length >= s.indexes.number.length
    ? (Xt.has(t) && !s.values.length) || (Xt.has(e) && !i.values.length)
      ? (function (t, e) {
          return Xt.has(t) ? n => (n <= 0 ? t : e) : n => (n >= 1 ? e : t);
        })(t, e)
      : b(
          Gt(
            (function (t, e) {
              const n = [],
                i = { color: 0, var: 0, number: 0 };
              for (let s = 0; s < e.values.length; s++) {
                const o = e.types[s],
                  r = t.indexes[o][i[o]],
                  a = t.values[r] ?? 0;
                ((n[s] = a), i[o]++);
              }
              return n;
            })(i, s),
            s.values
          ),
          n
        )
    : Ut(t, e);
};
function Jt(t, e, n) {
  if ('number' == typeof t && 'number' == typeof e && 'number' == typeof n) return Wt(t, e, n);
  return Kt(t)(t, e);
}
const Qt = t => {
    const e = ({ timestamp: e }) => t(e);
    return {
      start: (t = !0) => Z.update(e, t),
      stop: () => J(e),
      now: () => (Q.isProcessing ? Q.timestamp : it.now()),
    };
  },
  te = (t, e, n = 10) => {
    let i = '';
    const s = Math.max(Math.round(e / n), 2);
    for (let o = 0; o < s; o++) i += Math.round(1e4 * t(o / (s - 1))) / 1e4 + ', ';
    return `linear(${i.substring(0, i.length - 2)})`;
  },
  ee = 2e4;
function ne(t) {
  let e = 0;
  let n = t.next(e);
  for (; !n.done && e < ee; ) ((e += 50), (n = t.next(e)));
  return e >= ee ? 1 / 0 : e;
}
function ie(t, e, n) {
  const i = Math.max(e - 5, 0);
  return L(n - t(i), e - i);
}
const se = 100,
  oe = 10,
  re = 1,
  ae = 0,
  le = 800,
  ce = 0.3,
  he = 0.3,
  ue = { granular: 0.01, default: 2 },
  de = { granular: 0.005, default: 0.5 },
  pe = 0.01,
  me = 10,
  fe = 0.05,
  ye = 1,
  ge = 0.001;
function ve({ duration: t = le, bounce: e = ce, velocity: n = ae, mass: i = re }) {
  let s,
    o,
    r = 1 - e;
  ((r = v(fe, ye, r)),
    (t = v(pe, me, V(t))),
    r < 1
      ? ((s = e => {
          const i = e * r,
            s = i * t,
            o = i - n,
            a = we(e, r),
            l = Math.exp(-s);
          return ge - (o / a) * l;
        }),
        (o = e => {
          const i = e * r * t,
            o = i * n + n,
            a = Math.pow(r, 2) * Math.pow(e, 2) * t,
            l = Math.exp(-i),
            c = we(Math.pow(e, 2), r);
          return ((-s(e) + ge > 0 ? -1 : 1) * ((o - a) * l)) / c;
        }))
      : ((s = e => Math.exp(-e * t) * ((e - n) * t + 1) - 0.001),
        (o = e => Math.exp(-e * t) * (t * t * (n - e)))));
  const a = (function (t, e, n) {
    let i = n;
    for (let s = 1; s < xe; s++) i -= t(i) / e(i);
    return i;
  })(s, o, 5 / t);
  if (((t = C(t)), isNaN(a))) return { stiffness: se, damping: oe, duration: t };
  {
    const e = Math.pow(a, 2) * i;
    return { stiffness: e, damping: 2 * r * Math.sqrt(i * e), duration: t };
  }
}
const xe = 12;
function we(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const ke = ['duration', 'bounce'],
  Te = ['stiffness', 'damping', 'mass'];
function Me(t, e) {
  return e.some(e => void 0 !== t[e]);
}
function Se(t = he, e = ce) {
  const n = 'object' != typeof t ? { visualDuration: t, keyframes: [0, 1], bounce: e } : t;
  let { restSpeed: i, restDelta: s } = n;
  const o = n.keyframes[0],
    r = n.keyframes[n.keyframes.length - 1],
    a = { done: !1, value: o },
    {
      stiffness: l,
      damping: c,
      mass: h,
      duration: u,
      velocity: d,
      isResolvedFromDuration: p,
    } = (function (t) {
      let e = {
        velocity: ae,
        stiffness: se,
        damping: oe,
        mass: re,
        isResolvedFromDuration: !1,
        ...t,
      };
      if (!Me(t, Te) && Me(t, ke))
        if (t.visualDuration) {
          const n = t.visualDuration,
            i = (2 * Math.PI) / (1.2 * n),
            s = i * i,
            o = 2 * v(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(s);
          e = { ...e, mass: re, stiffness: s, damping: o };
        } else {
          const n = ve(t);
          ((e = { ...e, ...n, mass: re }), (e.isResolvedFromDuration = !0));
        }
      return e;
    })({ ...n, velocity: -V(n.velocity || 0) }),
    m = d || 0,
    f = c / (2 * Math.sqrt(l * h)),
    y = r - o,
    g = V(Math.sqrt(l / h)),
    x = Math.abs(y) < 5;
  let w;
  if ((i || (i = x ? ue.granular : ue.default), s || (s = x ? de.granular : de.default), f < 1)) {
    const t = we(g, f);
    w = e => {
      const n = Math.exp(-f * g * e);
      return r - n * (((m + f * g * y) / t) * Math.sin(t * e) + y * Math.cos(t * e));
    };
  } else if (1 === f) w = t => r - Math.exp(-g * t) * (y + (m + g * y) * t);
  else {
    const t = g * Math.sqrt(f * f - 1);
    w = e => {
      const n = Math.exp(-f * g * e),
        i = Math.min(t * e, 300);
      return r - (n * ((m + f * g * y) * Math.sinh(i) + t * y * Math.cosh(i))) / t;
    };
  }
  const k = {
    calculatedDuration: (p && u) || null,
    next: t => {
      const e = w(t);
      if (p) a.done = t >= u;
      else {
        let n = 0 === t ? m : 0;
        f < 1 && (n = 0 === t ? C(m) : ie(w, t, e));
        const o = Math.abs(n) <= i,
          l = Math.abs(r - e) <= s;
        a.done = o && l;
      }
      return ((a.value = a.done ? r : e), a);
    },
    toString: () => {
      const t = Math.min(ne(k), ee),
        e = te(e => k.next(t * e).value, t, 30);
      return t + 'ms ' + e;
    },
    toTransition: () => {},
  };
  return k;
}
function Pe({
  keyframes: t,
  velocity: e = 0,
  power: n = 0.8,
  timeConstant: i = 325,
  bounceDamping: s = 10,
  bounceStiffness: o = 500,
  modifyTarget: r,
  min: a,
  max: l,
  restDelta: c = 0.5,
  restSpeed: h,
}) {
  const u = t[0],
    d = { done: !1, value: u },
    p = t => (void 0 === a ? l : void 0 === l || Math.abs(a - t) < Math.abs(l - t) ? a : l);
  let m = n * e;
  const f = u + m,
    y = void 0 === r ? f : r(f);
  y !== f && (m = y - u);
  const g = t => -m * Math.exp(-t / i),
    v = t => y + g(t),
    x = t => {
      const e = g(t),
        n = v(t);
      ((d.done = Math.abs(e) <= c), (d.value = d.done ? y : n));
    };
  let w, k;
  const T = t => {
    var e;
    ((e = d.value), (void 0 !== a && e < a) || (void 0 !== l && e > l)) &&
      ((w = t),
      (k = Se({
        keyframes: [d.value, p(d.value)],
        velocity: ie(v, t, d.value),
        damping: s,
        stiffness: o,
        restDelta: c,
        restSpeed: h,
      })));
  };
  return (
    T(0),
    {
      calculatedDuration: null,
      next: t => {
        let e = !1;
        return (
          k || void 0 !== w || ((e = !0), x(t), T(t)),
          void 0 !== w && t >= w ? k.next(t - w) : (!e && x(t), d)
        );
      },
    }
  );
}
function be(t, e, { clamp: n = !0, ease: i, mixer: s } = {}) {
  const o = t.length;
  if ((e.length, 1 === o)) return () => e[0];
  if (2 === o && e[0] === e[1]) return () => e[1];
  const r = t[0] === t[1];
  t[0] > t[o - 1] && ((t = [...t].reverse()), (e = [...e].reverse()));
  const a = (function (t, e, n) {
      const i = [],
        s = n || x.mix || Jt,
        o = t.length - 1;
      for (let r = 0; r < o; r++) {
        let n = s(t[r], t[r + 1]);
        if (e) {
          const t = Array.isArray(e) ? e[r] || S : e;
          n = b(t, n);
        }
        i.push(n);
      }
      return i;
    })(e, i, s),
    l = a.length,
    c = n => {
      if (r && n < t[0]) return e[0];
      let i = 0;
      if (l > 1) for (; i < t.length - 2 && !(n < t[i + 1]); i++);
      const s = E(t[i], t[i + 1], n);
      return a[i](s);
    };
  return n ? e => c(v(t[0], t[o - 1], e)) : c;
}
function Ee(t) {
  const e = [0];
  return (
    (function (t, e) {
      const n = t[t.length - 1];
      for (let i = 1; i <= e; i++) {
        const s = E(0, e, i);
        t.push(Wt(n, 1, s));
      }
    })(e, t.length - 1),
    e
  );
}
function Ae({ duration: t = 300, keyframes: e, times: n, ease: i = 'easeInOut' }) {
  const s = (t => Array.isArray(t) && 'number' != typeof t[0])(i) ? i.map(K) : K(i),
    o = { done: !1, value: e[0] },
    r = (function (t, e) {
      return t.map(t => t * e);
    })(n && n.length === e.length ? n : Ee(e), t),
    a = be(r, e, {
      ease: Array.isArray(s) ? s : ((l = e), (c = s), l.map(() => c || q).splice(0, l.length - 1)),
    });
  var l, c;
  return { calculatedDuration: t, next: e => ((o.value = a(e)), (o.done = e >= t), o) };
}
Se.applyToOptions = t => {
  const e = (function (t, e = 100, n) {
    const i = n({ ...t, keyframes: [0, e] }),
      s = Math.min(ne(i), ee);
    return { type: 'keyframes', ease: t => i.next(s * t).value / e, duration: V(s) };
  })(t, 100, Se);
  return ((t.ease = e.ease), (t.duration = C(e.duration)), (t.type = 'keyframes'), t);
};
const Ce = t => null !== t;
function Ve(t, { repeat: e, repeatType: n = 'loop' }, i, s = 1) {
  const o = t.filter(Ce),
    r = s < 0 || (e && 'loop' !== n && e % 2 == 1) ? 0 : o.length - 1;
  return r && void 0 !== i ? i : o[r];
}
const Le = { decay: Pe, inertia: Pe, tween: Ae, keyframes: Ae, spring: Se };
function De(t) {
  'string' == typeof t.type && (t.type = Le[t.type]);
}
class Re {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise(t => {
      this.resolve = t;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  then(t, e) {
    return this.finished.then(t, e);
  }
}
const je = t => t / 100;
class Be extends Re {
  constructor(t) {
    (super(),
      (this.state = 'idle'),
      (this.startTime = null),
      (this.isStopped = !1),
      (this.currentTime = 0),
      (this.holdTime = null),
      (this.playbackSpeed = 1),
      (this.stop = () => {
        const { motionValue: t } = this.options;
        (t && t.updatedAt !== it.now() && this.tick(it.now()),
          (this.isStopped = !0),
          'idle' !== this.state && (this.teardown(), this.options.onStop?.()));
      }),
      (this.options = t),
      this.initAnimation(),
      this.play(),
      !1 === t.autoplay && this.pause());
  }
  initAnimation() {
    const { options: t } = this;
    De(t);
    const { type: e = Ae, repeat: n = 0, repeatDelay: i = 0, repeatType: s, velocity: o = 0 } = t;
    let { keyframes: r } = t;
    const a = e || Ae;
    a !== Ae &&
      'number' != typeof r[0] &&
      ((this.mixKeyframes = b(je, Jt(r[0], r[1]))), (r = [0, 100]));
    const l = a({ ...t, keyframes: r });
    ('mirror' === s &&
      (this.mirroredGenerator = a({ ...t, keyframes: [...r].reverse(), velocity: -o })),
      null === l.calculatedDuration && (l.calculatedDuration = ne(l)));
    const { calculatedDuration: c } = l;
    ((this.calculatedDuration = c),
      (this.resolvedDuration = c + i),
      (this.totalDuration = this.resolvedDuration * (n + 1) - i),
      (this.generator = l));
  }
  updateTime(t) {
    const e = Math.round(t - this.startTime) * this.playbackSpeed;
    null !== this.holdTime ? (this.currentTime = this.holdTime) : (this.currentTime = e);
  }
  tick(t, e = !1) {
    const {
      generator: n,
      totalDuration: i,
      mixKeyframes: s,
      mirroredGenerator: o,
      resolvedDuration: r,
      calculatedDuration: a,
    } = this;
    if (null === this.startTime) return n.next(0);
    const {
      delay: l = 0,
      keyframes: c,
      repeat: h,
      repeatType: u,
      repeatDelay: d,
      type: p,
      onUpdate: m,
      finalKeyframe: f,
    } = this.options;
    (this.speed > 0
      ? (this.startTime = Math.min(this.startTime, t))
      : this.speed < 0 && (this.startTime = Math.min(t - i / this.speed, this.startTime)),
      e ? (this.currentTime = t) : this.updateTime(t));
    const y = this.currentTime - l * (this.playbackSpeed >= 0 ? 1 : -1),
      g = this.playbackSpeed >= 0 ? y < 0 : y > i;
    ((this.currentTime = Math.max(y, 0)),
      'finished' === this.state && null === this.holdTime && (this.currentTime = i));
    let x = this.currentTime,
      w = n;
    if (h) {
      const t = Math.min(this.currentTime, i) / r;
      let e = Math.floor(t),
        n = t % 1;
      (!n && t >= 1 && (n = 1), 1 === n && e--, (e = Math.min(e, h + 1)));
      (Boolean(e % 2) &&
        ('reverse' === u ? ((n = 1 - n), d && (n -= d / r)) : 'mirror' === u && (w = o)),
        (x = v(0, 1, n) * r));
    }
    const k = g ? { done: !1, value: c[0] } : w.next(x);
    s && (k.value = s(k.value));
    let { done: T } = k;
    g ||
      null === a ||
      (T = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
    const M =
      null === this.holdTime && ('finished' === this.state || ('running' === this.state && T));
    return (
      M && p !== Pe && (k.value = Ve(c, this.options, f, this.speed)),
      m && m(k.value),
      M && this.finish(),
      k
    );
  }
  then(t, e) {
    return this.finished.then(t, e);
  }
  get duration() {
    return V(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: t = 0 } = this.options || {};
    return this.duration + V(t);
  }
  get time() {
    return V(this.currentTime);
  }
  set time(t) {
    ((t = C(t)),
      (this.currentTime = t),
      null === this.startTime || null !== this.holdTime || 0 === this.playbackSpeed
        ? (this.holdTime = t)
        : this.driver && (this.startTime = this.driver.now() - t / this.playbackSpeed),
      this.driver?.start(!1));
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    this.updateTime(it.now());
    const e = this.playbackSpeed !== t;
    ((this.playbackSpeed = t), e && (this.time = V(this.currentTime)));
  }
  play() {
    if (this.isStopped) return;
    const { driver: t = Qt, startTime: e } = this.options;
    (this.driver || (this.driver = t(t => this.tick(t))), this.options.onPlay?.());
    const n = this.driver.now();
    ('finished' === this.state
      ? (this.updateFinished(), (this.startTime = n))
      : null !== this.holdTime
        ? (this.startTime = n - this.holdTime)
        : this.startTime || (this.startTime = e ?? n),
      'finished' === this.state && this.speed < 0 && (this.startTime += this.calculatedDuration),
      (this.holdTime = null),
      (this.state = 'running'),
      this.driver.start());
  }
  pause() {
    ((this.state = 'paused'), this.updateTime(it.now()), (this.holdTime = this.currentTime));
  }
  complete() {
    ('running' !== this.state && this.play(), (this.state = 'finished'), (this.holdTime = null));
  }
  finish() {
    (this.notifyFinished(),
      this.teardown(),
      (this.state = 'finished'),
      this.options.onComplete?.());
  }
  cancel() {
    ((this.holdTime = null),
      (this.startTime = 0),
      this.tick(0),
      this.teardown(),
      this.options.onCancel?.());
  }
  teardown() {
    ((this.state = 'idle'), this.stopDriver(), (this.startTime = this.holdTime = null));
  }
  stopDriver() {
    this.driver && (this.driver.stop(), (this.driver = void 0));
  }
  sample(t) {
    return ((this.startTime = 0), this.tick(t, !0));
  }
  attachTimeline(t) {
    return (
      this.options.allowFlatten &&
        ((this.options.type = 'keyframes'), (this.options.ease = 'linear'), this.initAnimation()),
      this.driver?.stop(),
      t.observe(this)
    );
  }
}
const Fe = t => (180 * t) / Math.PI,
  Oe = t => {
    const e = Fe(Math.atan2(t[1], t[0]));
    return ze(e);
  },
  Ie = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: t => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
    rotate: Oe,
    rotateZ: Oe,
    skewX: t => Fe(Math.atan(t[1])),
    skewY: t => Fe(Math.atan(t[2])),
    skew: t => (Math.abs(t[1]) + Math.abs(t[2])) / 2,
  },
  ze = t => ((t %= 360) < 0 && (t += 360), t),
  Ue = t => Math.sqrt(t[0] * t[0] + t[1] * t[1]),
  We = t => Math.sqrt(t[4] * t[4] + t[5] * t[5]),
  Ne = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: Ue,
    scaleY: We,
    scale: t => (Ue(t) + We(t)) / 2,
    rotateX: t => ze(Fe(Math.atan2(t[6], t[5]))),
    rotateY: t => ze(Fe(Math.atan2(-t[2], t[0]))),
    rotateZ: Oe,
    rotate: Oe,
    skewX: t => Fe(Math.atan(t[4])),
    skewY: t => Fe(Math.atan(t[1])),
    skew: t => (Math.abs(t[1]) + Math.abs(t[4])) / 2,
  };
function He(t) {
  return t.includes('scale') ? 1 : 0;
}
function $e(t, e) {
  if (!t || 'none' === t) return He(e);
  const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let i, s;
  if (n) ((i = Ne), (s = n));
  else {
    const e = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    ((i = Ie), (s = e));
  }
  if (!s) return He(e);
  const o = i[e],
    r = s[1].split(',').map(qe);
  return 'function' == typeof o ? o(r) : r[o];
}
function qe(t) {
  return parseFloat(t.trim());
}
const Xe = [
    'transformPerspective',
    'x',
    'y',
    'z',
    'translateX',
    'translateY',
    'translateZ',
    'scale',
    'scaleX',
    'scaleY',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'skew',
    'skewX',
    'skewY',
  ],
  Ye = (() => new Set(Xe))(),
  Ke = t => t === ht || t === St,
  Ge = new Set(['x', 'y', 'z']),
  _e = Xe.filter(t => !Ge.has(t));
const Ze = {
  width: ({ x: t }, { paddingLeft: e = '0', paddingRight: n = '0' }) =>
    t.max - t.min - parseFloat(e) - parseFloat(n),
  height: ({ y: t }, { paddingTop: e = '0', paddingBottom: n = '0' }) =>
    t.max - t.min - parseFloat(e) - parseFloat(n),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  x: (t, { transform: e }) => $e(e, 'x'),
  y: (t, { transform: e }) => $e(e, 'y'),
};
((Ze.translateX = Ze.x), (Ze.translateY = Ze.y));
const Je = new Set();
let Qe = !1,
  tn = !1,
  en = !1;
function nn() {
  if (tn) {
    const t = Array.from(Je).filter(t => t.needsMeasurement),
      e = new Set(t.map(t => t.element)),
      n = new Map();
    (e.forEach(t => {
      const e = (function (t) {
        const e = [];
        return (
          _e.forEach(n => {
            const i = t.getValue(n);
            void 0 !== i && (e.push([n, i.get()]), i.set(n.startsWith('scale') ? 1 : 0));
          }),
          e
        );
      })(t);
      e.length && (n.set(t, e), t.render());
    }),
      t.forEach(t => t.measureInitialState()),
      e.forEach(t => {
        t.render();
        const e = n.get(t);
        e &&
          e.forEach(([e, n]) => {
            t.getValue(e)?.set(n);
          });
      }),
      t.forEach(t => t.measureEndState()),
      t.forEach(t => {
        void 0 !== t.suspendedScrollY && window.scrollTo(0, t.suspendedScrollY);
      }));
  }
  ((tn = !1), (Qe = !1), Je.forEach(t => t.complete(en)), Je.clear());
}
function sn() {
  Je.forEach(t => {
    (t.readKeyframes(), t.needsMeasurement && (tn = !0));
  });
}
class on {
  constructor(t, e, n, i, s, o = !1) {
    ((this.state = 'pending'),
      (this.isAsync = !1),
      (this.needsMeasurement = !1),
      (this.unresolvedKeyframes = [...t]),
      (this.onComplete = e),
      (this.name = n),
      (this.motionValue = i),
      (this.element = s),
      (this.isAsync = o));
  }
  scheduleResolve() {
    ((this.state = 'scheduled'),
      this.isAsync
        ? (Je.add(this), Qe || ((Qe = !0), Z.read(sn), Z.resolveKeyframes(nn)))
        : (this.readKeyframes(), this.complete()));
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: e, element: n, motionValue: i } = this;
    if (null === t[0]) {
      const s = i?.get(),
        o = t[t.length - 1];
      if (void 0 !== s) t[0] = s;
      else if (n && e) {
        const i = n.readValue(e, o);
        null != i && (t[0] = i);
      }
      (void 0 === t[0] && (t[0] = o), i && void 0 === s && i.set(t[0]));
    }
    !(function (t) {
      for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1]);
    })(t);
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete(t = !1) {
    ((this.state = 'complete'),
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t),
      Je.delete(this));
  }
  cancel() {
    'scheduled' === this.state && (Je.delete(this), (this.state = 'pending'));
  }
  resume() {
    'pending' === this.state && this.scheduleResolve();
  }
}
const rn = M(() => void 0 !== window.ScrollTimeline),
  an = {};
function ln(t, e) {
  const n = M(t);
  return () => an[e] ?? n();
}
const cn = ln(() => {
    try {
      document.createElement('div').animate({ opacity: 0 }, { easing: 'linear(0, 1)' });
    } catch (t) {
      return !1;
    }
    return !0;
  }, 'linearEasing'),
  hn = ([t, e, n, i]) => `cubic-bezier(${t}, ${e}, ${n}, ${i})`,
  un = {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    circIn: hn([0, 0.65, 0.55, 1]),
    circOut: hn([0.55, 0, 1, 0.45]),
    backIn: hn([0.31, 0.01, 0.66, -0.59]),
    backOut: hn([0.33, 1.53, 0.69, 0.99]),
  };
function dn(t, e) {
  return t
    ? 'function' == typeof t
      ? cn()
        ? te(t, e)
        : 'ease-out'
      : X(t)
        ? hn(t)
        : Array.isArray(t)
          ? t.map(t => dn(t, e) || un.easeOut)
          : un[t]
    : void 0;
}
function pn(
  t,
  e,
  n,
  {
    delay: i = 0,
    duration: s = 300,
    repeat: o = 0,
    repeatType: r = 'loop',
    ease: a = 'easeOut',
    times: l,
  } = {},
  c = void 0
) {
  const h = { [e]: n };
  l && (h.offset = l);
  const u = dn(a, s);
  Array.isArray(u) && (h.easing = u);
  const d = {
    delay: i,
    duration: s,
    easing: Array.isArray(u) ? 'linear' : u,
    fill: 'both',
    iterations: o + 1,
    direction: 'reverse' === r ? 'alternate' : 'normal',
  };
  c && (d.pseudoElement = c);
  return t.animate(h, d);
}
function mn(t) {
  return 'function' == typeof t && 'applyToOptions' in t;
}
class fn extends Re {
  constructor(t) {
    if (
      (super(),
      (this.finishedTime = null),
      (this.isStopped = !1),
      (this.manualStartTime = null),
      !t)
    )
      return;
    const {
      element: e,
      name: n,
      keyframes: i,
      pseudoElement: s,
      allowFlatten: o = !1,
      finalKeyframe: r,
      onComplete: a,
    } = t;
    ((this.isPseudoElement = Boolean(s)), (this.allowFlatten = o), (this.options = t), t.type);
    const l = (function ({ type: t, ...e }) {
      return mn(t) && cn()
        ? t.applyToOptions(e)
        : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = 'easeOut'), e);
    })(t);
    ((this.animation = pn(e, n, i, l, s)),
      !1 === l.autoplay && this.animation.pause(),
      (this.animation.onfinish = () => {
        if (((this.finishedTime = this.time), !s)) {
          const t = Ve(i, this.options, r, this.speed);
          (this.updateMotionValue
            ? this.updateMotionValue(t)
            : (function (t, e, n) {
                (t => t.startsWith('--'))(e) ? t.style.setProperty(e, n) : (t.style[e] = n);
              })(e, n, t),
            this.animation.cancel());
        }
        (a?.(), this.notifyFinished());
      }));
  }
  play() {
    this.isStopped ||
      ((this.manualStartTime = null),
      this.animation.play(),
      'finished' === this.state && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch (t) {}
  }
  stop() {
    if (this.isStopped) return;
    this.isStopped = !0;
    const { state: t } = this;
    'idle' !== t &&
      'finished' !== t &&
      (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(),
      this.isPseudoElement || this.cancel());
  }
  commitStyles() {
    this.isPseudoElement || this.animation.commitStyles?.();
  }
  get duration() {
    const t = this.animation.effect?.getComputedTiming?.().duration || 0;
    return V(Number(t));
  }
  get iterationDuration() {
    const { delay: t = 0 } = this.options || {};
    return this.duration + V(t);
  }
  get time() {
    return V(Number(this.animation.currentTime) || 0);
  }
  set time(t) {
    ((this.manualStartTime = null),
      (this.finishedTime = null),
      (this.animation.currentTime = C(t)));
  }
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(t) {
    (t < 0 && (this.finishedTime = null), (this.animation.playbackRate = t));
  }
  get state() {
    return null !== this.finishedTime ? 'finished' : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(t) {
    this.manualStartTime = this.animation.startTime = t;
  }
  attachTimeline({ timeline: t, observe: e }) {
    return (
      this.allowFlatten && this.animation.effect?.updateTiming({ easing: 'linear' }),
      (this.animation.onfinish = null),
      t && rn() ? ((this.animation.timeline = t), S) : e(this)
    );
  }
}
const yn = { anticipate: z, backInOut: I, circInOut: N };
function gn(t) {
  'string' == typeof t.ease && t.ease in yn && (t.ease = yn[t.ease]);
}
class vn extends fn {
  constructor(t) {
    (gn(t),
      De(t),
      super(t),
      void 0 !== t.startTime && (this.startTime = t.startTime),
      (this.options = t));
  }
  updateMotionValue(t) {
    const { motionValue: e, onUpdate: n, onComplete: i, element: s, ...o } = this.options;
    if (!e) return;
    if (void 0 !== t) return void e.set(t);
    const r = new Be({ ...o, autoplay: !1 }),
      a = Math.max(10, it.now() - this.startTime),
      l = v(0, 10, a - 10);
    (e.setWithVelocity(r.sample(Math.max(0, a - l)).value, r.sample(a).value, l), r.stop());
  }
}
const xn = (t, e) =>
  'zIndex' !== e &&
  (!('number' != typeof t && !Array.isArray(t)) ||
    !('string' != typeof t || (!It.test(t) && '0' !== t) || t.startsWith('url(')));
function wn(t) {
  ((t.duration = 0), (t.type = 'keyframes'));
}
const kn = new Set(['opacity', 'clipPath', 'filter', 'transform']),
  Tn = M(() => Object.hasOwnProperty.call(Element.prototype, 'animate'));
class Mn extends Re {
  constructor({
    autoplay: t = !0,
    delay: e = 0,
    type: n = 'keyframes',
    repeat: i = 0,
    repeatDelay: s = 0,
    repeatType: o = 'loop',
    keyframes: r,
    name: a,
    motionValue: l,
    element: c,
    ...h
  }) {
    (super(),
      (this.stop = () => {
        (this._animation && (this._animation.stop(), this.stopTimeline?.()),
          this.keyframeResolver?.cancel());
      }),
      (this.createdAt = it.now()));
    const u = {
        autoplay: t,
        delay: e,
        type: n,
        repeat: i,
        repeatDelay: s,
        repeatType: o,
        name: a,
        motionValue: l,
        element: c,
        ...h,
      },
      d = c?.KeyframeResolver || on;
    ((this.keyframeResolver = new d(
      r,
      (t, e, n) => this.onKeyframesResolved(t, e, u, !n),
      a,
      l,
      c
    )),
      this.keyframeResolver?.scheduleResolve());
  }
  onKeyframesResolved(t, e, n, i) {
    this.keyframeResolver = void 0;
    const { name: s, type: o, velocity: r, delay: a, isHandoff: l, onUpdate: c } = n;
    ((this.resolvedAt = it.now()),
      (function (t, e, n, i) {
        const s = t[0];
        if (null === s) return !1;
        if ('display' === e || 'visibility' === e) return !0;
        const o = t[t.length - 1],
          r = xn(s, e),
          a = xn(o, e);
        return (
          !(!r || !a) &&
          ((function (t) {
            const e = t[0];
            if (1 === t.length) return !0;
            for (let n = 0; n < t.length; n++) if (t[n] !== e) return !0;
          })(t) ||
            (('spring' === n || mn(n)) && i))
        );
      })(t, s, o, r) ||
        ((!x.instantAnimations && a) || c?.(Ve(t, n, e)),
        (t[0] = t[t.length - 1]),
        wn(n),
        (n.repeat = 0)));
    const h = {
        startTime: i
          ? this.resolvedAt && this.resolvedAt - this.createdAt > 40
            ? this.resolvedAt
            : this.createdAt
          : void 0,
        finalKeyframe: e,
        ...n,
        keyframes: t,
      },
      u =
        !l &&
        (function (t) {
          const { motionValue: e, name: n, repeatDelay: i, repeatType: s, damping: o, type: r } = t,
            a = e?.owner?.current;
          if (!(a instanceof HTMLElement)) return !1;
          const { onUpdate: l, transformTemplate: c } = e.owner.getProps();
          return (
            Tn() &&
            n &&
            kn.has(n) &&
            ('transform' !== n || !c) &&
            !l &&
            !i &&
            'mirror' !== s &&
            0 !== o &&
            'inertia' !== r
          );
        })(h)
          ? new vn({ ...h, element: h.motionValue.owner.current })
          : new Be(h);
    (u.finished.then(() => this.notifyFinished()).catch(S),
      this.pendingTimeline &&
        ((this.stopTimeline = u.attachTimeline(this.pendingTimeline)),
        (this.pendingTimeline = void 0)),
      (this._animation = u));
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(t, e) {
    return this.finished.finally(t).then(() => {});
  }
  get animation() {
    return (
      this._animation || (this.keyframeResolver?.resume(), (en = !0), sn(), nn(), (en = !1)),
      this._animation
    );
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(t) {
    this.animation.time = t;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(t) {
    this.animation.speed = t;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(t) {
    return (
      this._animation
        ? (this.stopTimeline = this.animation.attachTimeline(t))
        : (this.pendingTimeline = t),
      () => this.stop()
    );
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    (this._animation && this.animation.cancel(), this.keyframeResolver?.cancel());
  }
}
const Sn = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function Pn(t, e, n = 1) {
  const [i, s] = (function (t) {
    const e = Sn.exec(t);
    if (!e) return [,];
    const [, n, i, s] = e;
    return [`--${n ?? i}`, s];
  })(t);
  if (!i) return;
  const o = window.getComputedStyle(e).getPropertyValue(i);
  if (o) {
    const t = o.trim();
    return w(t) ? parseFloat(t) : t;
  }
  return at(s) ? Pn(s, e, n + 1) : s;
}
function bn(t, e) {
  return t?.[e] ?? t?.default ?? t;
}
const En = { type: 'spring', stiffness: 500, damping: 25, restSpeed: 10 },
  An = { type: 'keyframes', duration: 0.8 },
  Cn = { type: 'keyframes', ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  Vn = (t, { keyframes: e }) =>
    e.length > 2
      ? An
      : Ye.has(t)
        ? t.startsWith('scale')
          ? {
              type: 'spring',
              stiffness: 550,
              damping: 0 === e[1] ? 2 * Math.sqrt(550) : 30,
              restSpeed: 10,
            }
          : En
        : Cn;
const Ln = t => null !== t;
function Dn(t, e, n, i = 0, s = 1) {
  const o = Array.from(t)
      .sort((t, e) => t.sortNodePosition(e))
      .indexOf(e),
    r = t.size,
    a = (r - 1) * i;
  return 'function' == typeof n ? n(o, r) : 1 === s ? o * i : a - o * i;
}
const Rn =
    (t, e, n, i = {}, s, o) =>
    r => {
      const a = bn(i, t) || {},
        l = a.delay || i.delay || 0;
      let { elapsed: c = 0 } = i;
      c -= C(l);
      const h = {
        keyframes: Array.isArray(n) ? n : [null, n],
        ease: 'easeOut',
        velocity: e.getVelocity(),
        ...a,
        delay: -c,
        onUpdate: t => {
          (e.set(t), a.onUpdate && a.onUpdate(t));
        },
        onComplete: () => {
          (r(), a.onComplete && a.onComplete());
        },
        name: t,
        motionValue: e,
        element: o ? void 0 : s,
      };
      ((function ({
        when: t,
        delay: e,
        delayChildren: n,
        staggerChildren: i,
        staggerDirection: s,
        repeat: o,
        repeatType: r,
        repeatDelay: a,
        from: l,
        elapsed: c,
        ...h
      }) {
        return !!Object.keys(h).length;
      })(a) || Object.assign(h, Vn(t, h)),
        h.duration && (h.duration = C(h.duration)),
        h.repeatDelay && (h.repeatDelay = C(h.repeatDelay)),
        void 0 !== h.from && (h.keyframes[0] = h.from));
      let u = !1;
      if (
        ((!1 === h.type || (0 === h.duration && !h.repeatDelay)) &&
          (wn(h), 0 === h.delay && (u = !0)),
        (x.instantAnimations || x.skipAnimations) && ((u = !0), wn(h), (h.delay = 0)),
        (h.allowFlatten = !a.type && !a.ease),
        u && !o && void 0 !== e.get())
      ) {
        const t = (function (t, { repeat: e, repeatType: n = 'loop' }) {
          const i = t.filter(Ln);
          return i[e && 'loop' !== n && e % 2 == 1 ? 0 : i.length - 1];
        })(h.keyframes, a);
        if (void 0 !== t)
          return void Z.update(() => {
            (h.onUpdate(t), h.onComplete());
          });
      }
      return a.isSync ? new Be(h) : new Mn(h);
    },
  jn = new Set(['width', 'height', 'top', 'left', 'right', 'bottom', ...Xe]),
  Bn = { current: void 0 };
class Fn {
  constructor(t, e = {}) {
    ((this.canTrackVelocity = null),
      (this.events = {}),
      (this.updateAndNotify = t => {
        const e = it.now();
        if (
          (this.updatedAt !== e && this.setPrevFrameValue(),
          (this.prev = this.current),
          this.setCurrent(t),
          this.current !== this.prev && (this.events.change?.notify(this.current), this.dependents))
        )
          for (const n of this.dependents) n.dirty();
      }),
      (this.hasAnimated = !1),
      this.setCurrent(t),
      (this.owner = e.owner));
  }
  setCurrent(t) {
    var e;
    ((this.current = t),
      (this.updatedAt = it.now()),
      null === this.canTrackVelocity &&
        void 0 !== t &&
        (this.canTrackVelocity = ((e = this.current), !isNaN(parseFloat(e)))));
  }
  setPrevFrameValue(t = this.current) {
    ((this.prevFrameValue = t), (this.prevUpdatedAt = this.updatedAt));
  }
  onChange(t) {
    return this.on('change', t);
  }
  on(t, e) {
    this.events[t] || (this.events[t] = new A());
    const n = this.events[t].add(e);
    return 'change' === t
      ? () => {
          (n(),
            Z.read(() => {
              this.events.change.getSize() || this.stop();
            }));
        }
      : n;
  }
  clearListeners() {
    for (const t in this.events) this.events[t].clear();
  }
  attach(t, e) {
    ((this.passiveEffect = t), (this.stopPassiveEffect = e));
  }
  set(t) {
    this.passiveEffect ? this.passiveEffect(t, this.updateAndNotify) : this.updateAndNotify(t);
  }
  setWithVelocity(t, e, n) {
    (this.set(e),
      (this.prev = void 0),
      (this.prevFrameValue = t),
      (this.prevUpdatedAt = this.updatedAt - n));
  }
  jump(t, e = !0) {
    (this.updateAndNotify(t),
      (this.prev = t),
      (this.prevUpdatedAt = this.prevFrameValue = void 0),
      e && this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(t) {
    (this.dependents || (this.dependents = new Set()), this.dependents.add(t));
  }
  removeDependent(t) {
    this.dependents && this.dependents.delete(t);
  }
  get() {
    return (Bn.current && Bn.current.push(this), this.current);
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    const t = it.now();
    if (!this.canTrackVelocity || void 0 === this.prevFrameValue || t - this.updatedAt > 30)
      return 0;
    const e = Math.min(this.updatedAt - this.prevUpdatedAt, 30);
    return L(parseFloat(this.current) - parseFloat(this.prevFrameValue), e);
  }
  start(t) {
    return (
      this.stop(),
      new Promise(e => {
        ((this.hasAnimated = !0),
          (this.animation = t(e)),
          this.events.animationStart && this.events.animationStart.notify());
      }).then(() => {
        (this.events.animationComplete && this.events.animationComplete.notify(),
          this.clearAnimation());
      })
    );
  }
  stop() {
    (this.animation &&
      (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()),
      this.clearAnimation());
  }
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  destroy() {
    (this.dependents?.clear(),
      this.events.destroy?.notify(),
      this.clearListeners(),
      this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
}
function On(t, e) {
  return new Fn(t, e);
}
function In(t) {
  const e = [{}, {}];
  return (
    t?.values.forEach((t, n) => {
      ((e[0][n] = t.get()), (e[1][n] = t.getVelocity()));
    }),
    e
  );
}
function zn(t, e, n, i) {
  if ('function' == typeof e) {
    const [s, o] = In(i);
    e = e(void 0 !== n ? n : t.custom, s, o);
  }
  if (('string' == typeof e && (e = t.variants && t.variants[e]), 'function' == typeof e)) {
    const [s, o] = In(i);
    e = e(void 0 !== n ? n : t.custom, s, o);
  }
  return e;
}
function Un(t, e, n) {
  const i = t.getProps();
  return zn(i, e, void 0 !== n ? n : i.custom, t);
}
const Wn = t => Array.isArray(t);
function Nn(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, On(n));
}
function Hn(t) {
  return Wn(t) ? t[t.length - 1] || 0 : t;
}
const $n = t => Boolean(t && t.getVelocity);
function qn(t, e) {
  const n = t.getValue('willChange');
  if (((i = n), Boolean($n(i) && i.add))) return n.add(e);
  if (!n && x.WillChange) {
    const n = new x.WillChange('auto');
    (t.addValue('willChange', n), n.add(e));
  }
  var i;
}
function Xn(t) {
  return t.replace(/([A-Z])/g, t => `-${t.toLowerCase()}`);
}
const Yn = 'data-' + Xn('framerAppearId');
function Kn(t) {
  return t.props[Yn];
}
function Gn({ protectedKeys: t, needsAnimating: e }, n) {
  const i = t.hasOwnProperty(n) && !0 !== e[n];
  return ((e[n] = !1), i);
}
function _n(t, e, { delay: n = 0, transitionOverride: i, type: s } = {}) {
  let { transition: o = t.getDefaultTransition(), transitionEnd: r, ...a } = e;
  i && (o = i);
  const l = [],
    c = s && t.animationState && t.animationState.getState()[s];
  for (const h in a) {
    const e = t.getValue(h, t.latestValues[h] ?? null),
      i = a[h];
    if (void 0 === i || (c && Gn(c, h))) continue;
    const s = { delay: n, ...bn(o || {}, h) },
      r = e.get();
    if (void 0 !== r && !e.isAnimating && !Array.isArray(i) && i === r && !s.velocity) continue;
    let u = !1;
    if (window.MotionHandoffAnimation) {
      const e = Kn(t);
      if (e) {
        const t = window.MotionHandoffAnimation(e, h, Z);
        null !== t && ((s.startTime = t), (u = !0));
      }
    }
    (qn(t, h), e.start(Rn(h, e, i, t.shouldReduceMotion && jn.has(h) ? { type: !1 } : s, t, u)));
    const d = e.animation;
    d && l.push(d);
  }
  return (
    r &&
      Promise.all(l).then(() => {
        Z.update(() => {
          r &&
            (function (t, e) {
              const n = Un(t, e);
              let { transitionEnd: i = {}, transition: s = {}, ...o } = n || {};
              o = { ...o, ...i };
              for (const r in o) Nn(t, r, Hn(o[r]));
            })(t, r);
        });
      }),
    l
  );
}
function Zn(t, e, n = {}) {
  const i = Un(t, e, 'exit' === n.type ? t.presenceContext?.custom : void 0);
  let { transition: s = t.getDefaultTransition() || {} } = i || {};
  n.transitionOverride && (s = n.transitionOverride);
  const o = i ? () => Promise.all(_n(t, i, n)) : () => Promise.resolve(),
    r =
      t.variantChildren && t.variantChildren.size
        ? (i = 0) => {
            const { delayChildren: o = 0, staggerChildren: r, staggerDirection: a } = s;
            return (function (t, e, n = 0, i = 0, s = 0, o = 1, r) {
              const a = [];
              for (const l of t.variantChildren)
                (l.notify('AnimationStart', e),
                  a.push(
                    Zn(l, e, {
                      ...r,
                      delay:
                        n + ('function' == typeof i ? 0 : i) + Dn(t.variantChildren, l, i, s, o),
                    }).then(() => l.notify('AnimationComplete', e))
                  ));
              return Promise.all(a);
            })(t, e, i, o, r, a, n);
          }
        : () => Promise.resolve(),
    { when: a } = s;
  if (a) {
    const [t, e] = 'beforeChildren' === a ? [o, r] : [r, o];
    return t().then(() => e());
  }
  return Promise.all([o(), r(n.delay)]);
}
const Jn = t => e => e.test(t),
  Qn = [ht, St, Mt, Tt, bt, Pt, { test: t => 'auto' === t, parse: t => t }],
  ti = t => Qn.find(Jn(t));
function ei(t) {
  return 'number' == typeof t ? 0 === t : null === t || 'none' === t || '0' === t || T(t);
}
const ni = new Set(['brightness', 'contrast', 'saturate', 'opacity']);
function ii(t) {
  const [e, n] = t.slice(0, -1).split('(');
  if ('drop-shadow' === e) return t;
  const [i] = n.match(mt) || [];
  if (!i) return t;
  const s = n.replace(i, '');
  let o = ni.has(e) ? 1 : 0;
  return (i !== n && (o *= 100), e + '(' + o + s + ')');
}
const si = /\b([a-z-]*)\(.*?\)/gu,
  oi = {
    ...It,
    getAnimatableNone: t => {
      const e = t.match(si);
      return e ? e.map(ii).join(' ') : t;
    },
  },
  ri = { ...ht, transform: Math.round },
  ai = {
    borderWidth: St,
    borderTopWidth: St,
    borderRightWidth: St,
    borderBottomWidth: St,
    borderLeftWidth: St,
    borderRadius: St,
    radius: St,
    borderTopLeftRadius: St,
    borderTopRightRadius: St,
    borderBottomRightRadius: St,
    borderBottomLeftRadius: St,
    width: St,
    maxWidth: St,
    height: St,
    maxHeight: St,
    top: St,
    right: St,
    bottom: St,
    left: St,
    inset: St,
    insetBlock: St,
    insetBlockStart: St,
    insetBlockEnd: St,
    insetInline: St,
    insetInlineStart: St,
    insetInlineEnd: St,
    padding: St,
    paddingTop: St,
    paddingRight: St,
    paddingBottom: St,
    paddingLeft: St,
    paddingBlock: St,
    paddingBlockStart: St,
    paddingBlockEnd: St,
    paddingInline: St,
    paddingInlineStart: St,
    paddingInlineEnd: St,
    margin: St,
    marginTop: St,
    marginRight: St,
    marginBottom: St,
    marginLeft: St,
    marginBlock: St,
    marginBlockStart: St,
    marginBlockEnd: St,
    marginInline: St,
    marginInlineStart: St,
    marginInlineEnd: St,
    backgroundPositionX: St,
    backgroundPositionY: St,
    ...{
      rotate: Tt,
      rotateX: Tt,
      rotateY: Tt,
      rotateZ: Tt,
      scale: dt,
      scaleX: dt,
      scaleY: dt,
      scaleZ: dt,
      skew: Tt,
      skewX: Tt,
      skewY: Tt,
      distance: St,
      translateX: St,
      translateY: St,
      translateZ: St,
      x: St,
      y: St,
      z: St,
      perspective: St,
      transformPerspective: St,
      opacity: ut,
      originX: Et,
      originY: Et,
      originZ: St,
    },
    zIndex: ri,
    fillOpacity: ut,
    strokeOpacity: ut,
    numOctaves: ri,
  },
  li = {
    ...ai,
    color: Ct,
    backgroundColor: Ct,
    outlineColor: Ct,
    fill: Ct,
    stroke: Ct,
    borderColor: Ct,
    borderTopColor: Ct,
    borderRightColor: Ct,
    borderBottomColor: Ct,
    borderLeftColor: Ct,
    filter: oi,
    WebkitFilter: oi,
  },
  ci = t => li[t];
function hi(t, e) {
  let n = ci(t);
  return (n !== oi && (n = It), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0);
}
const ui = new Set(['auto', 'none', '0']);
class di extends on {
  constructor(t, e, n, i, s) {
    super(t, e, n, i, s, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: e, name: n } = this;
    if (!e || !e.current) return;
    super.readKeyframes();
    for (let a = 0; a < t.length; a++) {
      let n = t[a];
      if ('string' == typeof n && ((n = n.trim()), at(n))) {
        const i = Pn(n, e.current);
        (void 0 !== i && (t[a] = i), a === t.length - 1 && (this.finalKeyframe = n));
      }
    }
    if ((this.resolveNoneKeyframes(), !jn.has(n) || 2 !== t.length)) return;
    const [i, s] = t,
      o = ti(i),
      r = ti(s);
    if (ct(i) !== ct(s) && Ze[n]) this.needsMeasurement = !0;
    else if (o !== r)
      if (Ke(o) && Ke(r))
        for (let a = 0; a < t.length; a++) {
          const e = t[a];
          'string' == typeof e && (t[a] = parseFloat(e));
        }
      else Ze[n] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: e } = this,
      n = [];
    for (let i = 0; i < t.length; i++) (null === t[i] || ei(t[i])) && n.push(i);
    n.length &&
      (function (t, e, n) {
        let i,
          s = 0;
        for (; s < t.length && !i; ) {
          const e = t[s];
          ('string' == typeof e && !ui.has(e) && jt(e).values.length && (i = t[s]), s++);
        }
        if (i && n) for (const o of e) t[o] = hi(n, i);
      })(t, n, e);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: e, name: n } = this;
    if (!t || !t.current) return;
    ('height' === n && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = Ze[n](t.measureViewportBox(), window.getComputedStyle(t.current))),
      (e[0] = this.measuredOrigin));
    const i = e[e.length - 1];
    void 0 !== i && t.getValue(n, i).jump(i, !1);
  }
  measureEndState() {
    const { element: t, name: e, unresolvedKeyframes: n } = this;
    if (!t || !t.current) return;
    const i = t.getValue(e);
    i && i.jump(this.measuredOrigin, !1);
    const s = n.length - 1,
      o = n[s];
    ((n[s] = Ze[e](t.measureViewportBox(), window.getComputedStyle(t.current))),
      null !== o && void 0 === this.finalKeyframe && (this.finalKeyframe = o),
      this.removedTransforms?.length &&
        this.removedTransforms.forEach(([e, n]) => {
          t.getValue(e).set(n);
        }),
      this.resolveNoneKeyframes());
  }
}
function pi(t, e, n) {
  if (t instanceof EventTarget) return [t];
  if ('string' == typeof t) {
    const e = document.querySelectorAll(t);
    return e ? Array.from(e) : [];
  }
  return Array.from(t);
}
const mi = (t, e) => (e && 'number' == typeof t ? e.transform(t) : t);
function fi(t) {
  return k(t) && 'offsetHeight' in t;
}
const { schedule: yi } = _(queueMicrotask, !1),
  gi = { x: !1, y: !1 };
function vi() {
  return gi.x || gi.y;
}
function xi(t, e) {
  const n = pi(t),
    i = new AbortController();
  return [n, { passive: !0, ...e, signal: i.signal }, () => i.abort()];
}
function wi(t) {
  return !('touch' === t.pointerType || vi());
}
const ki = (t, e) => !!e && (t === e || ki(t, e.parentElement)),
  Ti = t =>
    'mouse' === t.pointerType ? 'number' != typeof t.button || t.button <= 0 : !1 !== t.isPrimary,
  Mi = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']);
function Si(t) {
  return Mi.has(t.tagName) || !0 === t.isContentEditable;
}
const Pi = new WeakSet();
function bi(t) {
  return e => {
    'Enter' === e.key && t(e);
  };
}
function Ei(t, e) {
  t.dispatchEvent(new PointerEvent('pointer' + e, { isPrimary: !0, bubbles: !0 }));
}
function Ai(t) {
  return Ti(t) && !vi();
}
function Ci(t, e, n = {}) {
  const [i, s, o] = xi(t, n),
    r = t => {
      const i = t.currentTarget;
      if (!Ai(t)) return;
      Pi.add(i);
      const o = e(i, t),
        r = (t, e) => {
          (window.removeEventListener('pointerup', a),
            window.removeEventListener('pointercancel', l),
            Pi.has(i) && Pi.delete(i),
            Ai(t) && 'function' == typeof o && o(t, { success: e }));
        },
        a = t => {
          r(t, i === window || i === document || n.useGlobalTarget || ki(i, t.target));
        },
        l = t => {
          r(t, !1);
        };
      (window.addEventListener('pointerup', a, s), window.addEventListener('pointercancel', l, s));
    };
  return (
    i.forEach(t => {
      ((n.useGlobalTarget ? window : t).addEventListener('pointerdown', r, s),
        fi(t) &&
          (t.addEventListener('focus', t =>
            ((t, e) => {
              const n = t.currentTarget;
              if (!n) return;
              const i = bi(() => {
                if (Pi.has(n)) return;
                Ei(n, 'down');
                const t = bi(() => {
                  Ei(n, 'up');
                });
                (n.addEventListener('keyup', t, e),
                  n.addEventListener('blur', () => Ei(n, 'cancel'), e));
              });
              (n.addEventListener('keydown', i, e),
                n.addEventListener('blur', () => n.removeEventListener('keydown', i), e));
            })(t, s)
          ),
          Si(t) || t.hasAttribute('tabindex') || (t.tabIndex = 0)));
    }),
    o
  );
}
function Vi(t) {
  return k(t) && 'ownerSVGElement' in t;
}
const Li = new WeakMap();
let Di;
const Ri = (t, e, n) => (i, s) =>
    s && s[0] ? s[0][t + 'Size'] : Vi(i) && 'getBBox' in i ? i.getBBox()[e] : i[n],
  ji = Ri('inline', 'width', 'offsetWidth'),
  Bi = Ri('block', 'height', 'offsetHeight');
function Fi({ target: t, borderBoxSize: e }) {
  Li.get(t)?.forEach(n => {
    n(t, {
      get width() {
        return ji(t, e);
      },
      get height() {
        return Bi(t, e);
      },
    });
  });
}
function Oi(t) {
  t.forEach(Fi);
}
function Ii(t, e) {
  Di || ('undefined' != typeof ResizeObserver && (Di = new ResizeObserver(Oi)));
  const n = pi(t);
  return (
    n.forEach(t => {
      let n = Li.get(t);
      (n || ((n = new Set()), Li.set(t, n)), n.add(e), Di?.observe(t));
    }),
    () => {
      n.forEach(t => {
        const n = Li.get(t);
        (n?.delete(e), n?.size || Di?.unobserve(t));
      });
    }
  );
}
const zi = new Set();
let Ui;
function Wi(t) {
  return (
    zi.add(t),
    Ui ||
      ((Ui = () => {
        const t = {
          get width() {
            return window.innerWidth;
          },
          get height() {
            return window.innerHeight;
          },
        };
        zi.forEach(e => e(t));
      }),
      window.addEventListener('resize', Ui)),
    () => {
      (zi.delete(t),
        zi.size ||
          'function' != typeof Ui ||
          (window.removeEventListener('resize', Ui), (Ui = void 0)));
    }
  );
}
function Ni(t, e) {
  let n;
  const i = () => {
    const { currentTime: i } = e,
      s = (null === i ? 0 : i.value) / 100;
    (n !== s && t(s), (n = s));
  };
  return (Z.preUpdate(i, !0), () => J(i));
}
function Hi(t, e, n) {
  const i = t.get();
  let s,
    o = null,
    r = i;
  const a = 'string' == typeof i ? i.replace(/[\d.-]/g, '') : void 0,
    l = () => {
      o && (o.stop(), (o = null));
    };
  if (
    (t.attach((e, i) => {
      ((r = e),
        (s = t => i($i(t, a))),
        Z.postRender(() => {
          (l(),
            (o = new Be({
              keyframes: [qi(t.get()), qi(r)],
              velocity: t.getVelocity(),
              type: 'spring',
              restDelta: 0.001,
              restSpeed: 0.01,
              ...n,
              onUpdate: s,
            })),
            t.events.animationStart?.notify(),
            o?.then(() => {
              t.events.animationComplete?.notify();
            }));
        }));
    }, l),
    $n(e))
  ) {
    const n = e.on('change', e => t.set($i(e, a))),
      i = t.on('destroy', n);
    return () => {
      (n(), i());
    };
  }
  return l;
}
function $i(t, e) {
  return e ? t + e : t;
}
function qi(t) {
  return 'number' == typeof t ? t : parseFloat(t);
}
const Xi = [...Qn, Ct, It],
  Yi = () => ({ x: { min: 0, max: 0 }, y: { min: 0, max: 0 } }),
  Ki = { current: null },
  Gi = { current: !1 },
  _i = 'undefined' != typeof window;
const Zi = new WeakMap();
function Ji(t) {
  return null !== t && 'object' == typeof t && 'function' == typeof t.start;
}
function Qi(t) {
  return 'string' == typeof t || Array.isArray(t);
}
const ts = ['animate', 'whileInView', 'whileFocus', 'whileHover', 'whileTap', 'whileDrag', 'exit'],
  es = ['initial', ...ts];
function ns(t) {
  return Ji(t.animate) || es.some(e => Qi(t[e]));
}
function is(t) {
  return Boolean(ns(t) || t.variants);
}
const ss = [
  'AnimationStart',
  'AnimationComplete',
  'Update',
  'BeforeLayoutMeasure',
  'LayoutMeasure',
  'LayoutAnimationStart',
  'LayoutAnimationComplete',
];
let os = {};
function rs(t) {
  os = t;
}
class as {
  scrapeMotionValuesFromProps(t, e, n) {
    return {};
  }
  constructor(
    {
      parent: t,
      props: e,
      presenceContext: n,
      reducedMotionConfig: i,
      blockInitialAnimation: s,
      visualState: o,
    },
    r = {}
  ) {
    ((this.current = null),
      (this.children = new Set()),
      (this.isVariantNode = !1),
      (this.isControllingVariants = !1),
      (this.shouldReduceMotion = null),
      (this.values = new Map()),
      (this.KeyframeResolver = on),
      (this.features = {}),
      (this.valueSubscriptions = new Map()),
      (this.prevMotionValues = {}),
      (this.events = {}),
      (this.propEventSubscriptions = {}),
      (this.notifyUpdate = () => this.notify('Update', this.latestValues)),
      (this.render = () => {
        this.current &&
          (this.triggerBuild(),
          this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
      }),
      (this.renderScheduledAt = 0),
      (this.scheduleRender = () => {
        const t = it.now();
        this.renderScheduledAt < t && ((this.renderScheduledAt = t), Z.render(this.render, !1, !0));
      }));
    const { latestValues: a, renderState: l } = o;
    ((this.latestValues = a),
      (this.baseTarget = { ...a }),
      (this.initialValues = e.initial ? { ...a } : {}),
      (this.renderState = l),
      (this.parent = t),
      (this.props = e),
      (this.presenceContext = n),
      (this.depth = t ? t.depth + 1 : 0),
      (this.reducedMotionConfig = i),
      (this.options = r),
      (this.blockInitialAnimation = Boolean(s)),
      (this.isControllingVariants = ns(e)),
      (this.isVariantNode = is(e)),
      this.isVariantNode && (this.variantChildren = new Set()),
      (this.manuallyAnimateOnMount = Boolean(t && t.current)));
    const { willChange: c, ...h } = this.scrapeMotionValuesFromProps(e, {}, this);
    for (const u in h) {
      const t = h[u];
      void 0 !== a[u] && $n(t) && t.set(a[u]);
    }
  }
  mount(t) {
    ((this.current = t),
      Zi.set(t, this),
      this.projection && !this.projection.instance && this.projection.mount(t),
      this.parent &&
        this.isVariantNode &&
        !this.isControllingVariants &&
        (this.removeFromVariantTree = this.parent.addVariantChild(this)),
      this.values.forEach((t, e) => this.bindToMotionValue(e, t)),
      'never' === this.reducedMotionConfig
        ? (this.shouldReduceMotion = !1)
        : 'always' === this.reducedMotionConfig
          ? (this.shouldReduceMotion = !0)
          : (Gi.current ||
              (function () {
                if (((Gi.current = !0), _i))
                  if (window.matchMedia) {
                    const t = window.matchMedia('(prefers-reduced-motion)'),
                      e = () => (Ki.current = t.matches);
                    (t.addEventListener('change', e), e());
                  } else Ki.current = !1;
              })(),
            (this.shouldReduceMotion = Ki.current)),
      this.parent?.addChild(this),
      this.update(this.props, this.presenceContext));
  }
  unmount() {
    (this.projection && this.projection.unmount(),
      J(this.notifyUpdate),
      J(this.render),
      this.valueSubscriptions.forEach(t => t()),
      this.valueSubscriptions.clear(),
      this.removeFromVariantTree && this.removeFromVariantTree(),
      this.parent?.removeChild(this));
    for (const t in this.events) this.events[t].clear();
    for (const t in this.features) {
      const e = this.features[t];
      e && (e.unmount(), (e.isMounted = !1));
    }
    this.current = null;
  }
  addChild(t) {
    (this.children.add(t),
      this.enteringChildren ?? (this.enteringChildren = new Set()),
      this.enteringChildren.add(t));
  }
  removeChild(t) {
    (this.children.delete(t), this.enteringChildren && this.enteringChildren.delete(t));
  }
  bindToMotionValue(t, e) {
    this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)();
    const n = Ye.has(t);
    n && this.onBindTransform && this.onBindTransform();
    const i = e.on('change', e => {
      ((this.latestValues[t] = e),
        this.props.onUpdate && Z.preRender(this.notifyUpdate),
        n && this.projection && (this.projection.isTransformDirty = !0),
        this.scheduleRender());
    });
    let s;
    ('undefined' != typeof window &&
      window.MotionCheckAppearSync &&
      (s = window.MotionCheckAppearSync(this, t, e)),
      this.valueSubscriptions.set(t, () => {
        (i(), s && s(), e.owner && e.stop());
      }));
  }
  sortNodePosition(t) {
    return this.current && this.sortInstanceNodePosition && this.type === t.type
      ? this.sortInstanceNodePosition(this.current, t.current)
      : 0;
  }
  updateFeatures() {
    let t = 'animation';
    for (t in os) {
      const e = os[t];
      if (!e) continue;
      const { isEnabled: n, Feature: i } = e;
      if (
        (!this.features[t] && i && n(this.props) && (this.features[t] = new i(this)),
        this.features[t])
      ) {
        const e = this.features[t];
        e.isMounted ? e.update() : (e.mount(), (e.isMounted = !0));
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
    return this.current
      ? this.measureInstanceViewportBox(this.current, this.props)
      : { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
  }
  getStaticValue(t) {
    return this.latestValues[t];
  }
  setStaticValue(t, e) {
    this.latestValues[t] = e;
  }
  update(t, e) {
    ((t.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
      (this.prevProps = this.props),
      (this.props = t),
      (this.prevPresenceContext = this.presenceContext),
      (this.presenceContext = e));
    for (let n = 0; n < ss.length; n++) {
      const e = ss[n];
      this.propEventSubscriptions[e] &&
        (this.propEventSubscriptions[e](), delete this.propEventSubscriptions[e]);
      const i = t['on' + e];
      i && (this.propEventSubscriptions[e] = this.on(e, i));
    }
    ((this.prevMotionValues = (function (t, e, n) {
      for (const i in e) {
        const s = e[i],
          o = n[i];
        if ($n(s)) t.addValue(i, s);
        else if ($n(o)) t.addValue(i, On(s, { owner: t }));
        else if (o !== s)
          if (t.hasValue(i)) {
            const e = t.getValue(i);
            !0 === e.liveStyle ? e.jump(s) : e.hasAnimated || e.set(s);
          } else {
            const e = t.getStaticValue(i);
            t.addValue(i, On(void 0 !== e ? e : s, { owner: t }));
          }
      }
      for (const i in n) void 0 === e[i] && t.removeValue(i);
      return e;
    })(
      this,
      this.scrapeMotionValuesFromProps(t, this.prevProps || {}, this),
      this.prevMotionValues
    )),
      this.handleChildMotionValue && this.handleChildMotionValue());
  }
  getProps() {
    return this.props;
  }
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0;
  }
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  addVariantChild(t) {
    const e = this.getClosestVariantNode();
    if (e)
      return (e.variantChildren && e.variantChildren.add(t), () => e.variantChildren.delete(t));
  }
  addValue(t, e) {
    const n = this.values.get(t);
    e !== n &&
      (n && this.removeValue(t),
      this.bindToMotionValue(t, e),
      this.values.set(t, e),
      (this.latestValues[t] = e.get()));
  }
  removeValue(t) {
    this.values.delete(t);
    const e = this.valueSubscriptions.get(t);
    (e && (e(), this.valueSubscriptions.delete(t)),
      delete this.latestValues[t],
      this.removeValueFromRenderState(t, this.renderState));
  }
  hasValue(t) {
    return this.values.has(t);
  }
  getValue(t, e) {
    if (this.props.values && this.props.values[t]) return this.props.values[t];
    let n = this.values.get(t);
    return (
      void 0 === n &&
        void 0 !== e &&
        ((n = On(null === e ? void 0 : e, { owner: this })), this.addValue(t, n)),
      n
    );
  }
  readValue(t, e) {
    let n =
      void 0 === this.latestValues[t] && this.current
        ? (this.getBaseTargetFromProps(this.props, t) ??
          this.readValueFromInstance(this.current, t, this.options))
        : this.latestValues[t];
    var i;
    return (
      null != n &&
        ('string' == typeof n && (w(n) || T(n))
          ? (n = parseFloat(n))
          : ((i = n), !Xi.find(Jn(i)) && It.test(e) && (n = hi(t, e))),
        this.setBaseTarget(t, $n(n) ? n.get() : n)),
      $n(n) ? n.get() : n
    );
  }
  setBaseTarget(t, e) {
    this.baseTarget[t] = e;
  }
  getBaseTarget(t) {
    const { initial: e } = this.props;
    let n;
    if ('string' == typeof e || 'object' == typeof e) {
      const i = zn(this.props, e, this.presenceContext?.custom);
      i && (n = i[t]);
    }
    if (e && void 0 !== n) return n;
    const i = this.getBaseTargetFromProps(this.props, t);
    return void 0 === i || $n(i)
      ? void 0 !== this.initialValues[t] && void 0 === n
        ? void 0
        : this.baseTarget[t]
      : i;
  }
  on(t, e) {
    return (this.events[t] || (this.events[t] = new A()), this.events[t].add(e));
  }
  notify(t, ...e) {
    this.events[t] && this.events[t].notify(...e);
  }
  scheduleRenderMicrotask() {
    yi.render(this.render);
  }
}
class ls {
  constructor(t) {
    ((this.isMounted = !1), (this.node = t));
  }
  update() {}
}
class cs extends as {
  constructor() {
    (super(...arguments), (this.KeyframeResolver = di));
  }
  sortInstanceNodePosition(t, e) {
    return 2 & t.compareDocumentPosition(e) ? 1 : -1;
  }
  getBaseTargetFromProps(t, e) {
    const n = t.style;
    return n ? n[e] : void 0;
  }
  removeValueFromRenderState(t, { vars: e, style: n }) {
    (delete e[t], delete n[t]);
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: t } = this.props;
    $n(t) &&
      (this.childSubscription = t.on('change', t => {
        this.current && (this.current.textContent = `${t}`);
      }));
  }
}
function hs({ top: t, left: e, right: n, bottom: i }) {
  return { x: { min: e, max: n }, y: { min: t, max: i } };
}
function us(t) {
  return void 0 === t || 1 === t;
}
function ds({ scale: t, scaleX: e, scaleY: n }) {
  return !us(t) || !us(e) || !us(n);
}
function ps(t) {
  return ds(t) || ms(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function ms(t) {
  return fs(t.x) || fs(t.y);
}
function fs(t) {
  return t && '0%' !== t;
}
function ys(t, e, n) {
  return n + e * (t - n);
}
function gs(t, e, n, i, s) {
  return (void 0 !== s && (t = ys(t, s, i)), ys(t, n, i) + e);
}
function vs(t, e = 0, n = 1, i, s) {
  ((t.min = gs(t.min, e, n, i, s)), (t.max = gs(t.max, e, n, i, s)));
}
function xs(t, { x: e, y: n }) {
  (vs(t.x, e.translate, e.scale, e.originPoint), vs(t.y, n.translate, n.scale, n.originPoint));
}
const ws = 0.999999999999,
  ks = 1.0000000000001;
function Ts(t, e) {
  ((t.min = t.min + e), (t.max = t.max + e));
}
function Ms(t, e, n, i, s = 0.5) {
  vs(t, e, n, Wt(t.min, t.max, s), i);
}
function Ss(t, e) {
  (Ms(t.x, e.x, e.scaleX, e.scale, e.originX), Ms(t.y, e.y, e.scaleY, e.scale, e.originY));
}
function Ps(t, e) {
  return hs(
    (function (t, e) {
      if (!e) return t;
      const n = e({ x: t.left, y: t.top }),
        i = e({ x: t.right, y: t.bottom });
      return { top: n.y, left: n.x, bottom: i.y, right: i.x };
    })(t.getBoundingClientRect(), e)
  );
}
const bs = {
    x: 'translateX',
    y: 'translateY',
    z: 'translateZ',
    transformPerspective: 'perspective',
  },
  Es = Xe.length;
function As(t, e, n) {
  const { style: i, vars: s, transformOrigin: o } = t;
  let r = !1,
    a = !1;
  for (const l in e) {
    const t = e[l];
    if (Ye.has(l)) r = !0;
    else if (ot(l)) s[l] = t;
    else {
      const e = mi(t, ai[l]);
      l.startsWith('origin') ? ((a = !0), (o[l] = e)) : (i[l] = e);
    }
  }
  if (
    (e.transform ||
      (r || n
        ? (i.transform = (function (t, e, n) {
            let i = '',
              s = !0;
            for (let o = 0; o < Es; o++) {
              const r = Xe[o],
                a = t[r];
              if (void 0 === a) continue;
              let l = !0;
              if (
                ((l =
                  'number' == typeof a
                    ? a === (r.startsWith('scale') ? 1 : 0)
                    : 0 === parseFloat(a)),
                !l || n)
              ) {
                const t = mi(a, ai[r]);
                (l || ((s = !1), (i += `${bs[r] || r}(${t}) `)), n && (e[r] = t));
              }
            }
            return ((i = i.trim()), n ? (i = n(e, s ? '' : i)) : s && (i = 'none'), i);
          })(e, t.transform, n))
        : i.transform && (i.transform = 'none')),
    a)
  ) {
    const { originX: t = '50%', originY: e = '50%', originZ: n = 0 } = o;
    i.transformOrigin = `${t} ${e} ${n}`;
  }
}
function Cs(t, { style: e, vars: n }, i, s) {
  const o = t.style;
  let r;
  for (r in e) o[r] = e[r];
  for (r in (s?.applyProjectionStyles(o, i), n)) o.setProperty(r, n[r]);
}
function Vs(t, e) {
  return e.max === e.min ? 0 : (t / (e.max - e.min)) * 100;
}
const Ls = {
    correct: (t, e) => {
      if (!e.target) return t;
      if ('string' == typeof t) {
        if (!St.test(t)) return t;
        t = parseFloat(t);
      }
      return `${Vs(t, e.target.x)}% ${Vs(t, e.target.y)}%`;
    },
  },
  Ds = {
    correct: (t, { treeScale: e, projectionDelta: n }) => {
      const i = t,
        s = It.parse(t);
      if (s.length > 5) return i;
      const o = It.createTransformer(t),
        r = 'number' != typeof s[0] ? 1 : 0,
        a = n.x.scale * e.x,
        l = n.y.scale * e.y;
      ((s[0 + r] /= a), (s[1 + r] /= l));
      const c = Wt(a, l, 0.5);
      return (
        'number' == typeof s[2 + r] && (s[2 + r] /= c),
        'number' == typeof s[3 + r] && (s[3 + r] /= c),
        o(s)
      );
    },
  },
  Rs = {
    borderRadius: {
      ...Ls,
      applyTo: [
        'borderTopLeftRadius',
        'borderTopRightRadius',
        'borderBottomLeftRadius',
        'borderBottomRightRadius',
      ],
    },
    borderTopLeftRadius: Ls,
    borderTopRightRadius: Ls,
    borderBottomLeftRadius: Ls,
    borderBottomRightRadius: Ls,
    boxShadow: Ds,
  };
function js(t, { layout: e, layoutId: n }) {
  return (
    Ye.has(t) || t.startsWith('origin') || ((e || void 0 !== n) && (!!Rs[t] || 'opacity' === t))
  );
}
function Bs(t, e, n) {
  const i = t.style,
    s = e?.style,
    o = {};
  if (!i) return o;
  for (const r in i)
    ($n(i[r]) || (s && $n(s[r])) || js(r, t) || void 0 !== n?.getValue(r)?.liveStyle) &&
      (o[r] = i[r]);
  return o;
}
class Fs extends cs {
  constructor() {
    (super(...arguments), (this.type = 'html'), (this.renderInstance = Cs));
  }
  readValueFromInstance(t, e) {
    if (Ye.has(e))
      return this.projection?.isProjecting
        ? He(e)
        : ((t, e) => {
            const { transform: n = 'none' } = getComputedStyle(t);
            return $e(n, e);
          })(t, e);
    {
      const i = ((n = t), window.getComputedStyle(n)),
        s = (ot(e) ? i.getPropertyValue(e) : i[e]) || 0;
      return 'string' == typeof s ? s.trim() : s;
    }
    var n;
  }
  measureInstanceViewportBox(t, { transformPagePoint: e }) {
    return Ps(t, e);
  }
  build(t, e, n) {
    As(t, e, n.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, e, n) {
    return Bs(t, e, n);
  }
}
const Os = { offset: 'stroke-dashoffset', array: 'stroke-dasharray' },
  Is = { offset: 'strokeDashoffset', array: 'strokeDasharray' };
const zs = ['offsetDistance', 'offsetPath', 'offsetRotate', 'offsetAnchor'];
function Us(
  t,
  { attrX: e, attrY: n, attrScale: i, pathLength: s, pathSpacing: o = 1, pathOffset: r = 0, ...a },
  l,
  c,
  h
) {
  if ((As(t, a, c), l)) return void (t.style.viewBox && (t.attrs.viewBox = t.style.viewBox));
  ((t.attrs = t.style), (t.style = {}));
  const { attrs: u, style: d } = t;
  (u.transform && ((d.transform = u.transform), delete u.transform),
    (d.transform || u.transformOrigin) &&
      ((d.transformOrigin = u.transformOrigin ?? '50% 50%'), delete u.transformOrigin),
    d.transform && ((d.transformBox = h?.transformBox ?? 'fill-box'), delete u.transformBox));
  for (const p of zs) void 0 !== u[p] && ((d[p] = u[p]), delete u[p]);
  (void 0 !== e && (u.x = e),
    void 0 !== n && (u.y = n),
    void 0 !== i && (u.scale = i),
    void 0 !== s &&
      (function (t, e, n = 1, i = 0, s = !0) {
        t.pathLength = 1;
        const o = s ? Os : Is;
        t[o.offset] = St.transform(-i);
        const r = St.transform(e),
          a = St.transform(n);
        t[o.array] = `${r} ${a}`;
      })(u, s, o, r, !1));
}
const Ws = new Set([
    'baseFrequency',
    'diffuseConstant',
    'kernelMatrix',
    'kernelUnitLength',
    'keySplines',
    'keyTimes',
    'limitingConeAngle',
    'markerHeight',
    'markerWidth',
    'numOctaves',
    'targetX',
    'targetY',
    'surfaceScale',
    'specularConstant',
    'specularExponent',
    'stdDeviation',
    'tableValues',
    'viewBox',
    'gradientTransform',
    'pathLength',
    'startOffset',
    'textLength',
    'lengthAdjust',
  ]),
  Ns = t => 'string' == typeof t && 'svg' === t.toLowerCase();
function Hs(t, e, n) {
  const i = Bs(t, e, n);
  for (const s in t)
    if ($n(t[s]) || $n(e[s])) {
      i[-1 !== Xe.indexOf(s) ? 'attr' + s.charAt(0).toUpperCase() + s.substring(1) : s] = t[s];
    }
  return i;
}
class $s extends cs {
  constructor() {
    (super(...arguments),
      (this.type = 'svg'),
      (this.isSVGTag = !1),
      (this.measureInstanceViewportBox = Yi));
  }
  getBaseTargetFromProps(t, e) {
    return t[e];
  }
  readValueFromInstance(t, e) {
    if (Ye.has(e)) {
      const t = ci(e);
      return (t && t.default) || 0;
    }
    return ((e = Ws.has(e) ? e : Xn(e)), t.getAttribute(e));
  }
  scrapeMotionValuesFromProps(t, e, n) {
    return Hs(t, e, n);
  }
  build(t, e, n) {
    Us(t, e, this.isSVGTag, n.transformTemplate, n.style);
  }
  renderInstance(t, e, n, i) {
    !(function (t, e, n, i) {
      Cs(t, e, void 0, i);
      for (const s in e.attrs) t.setAttribute(Ws.has(s) ? s : Xn(s), e.attrs[s]);
    })(t, e, 0, i);
  }
  mount(t) {
    ((this.isSVGTag = Ns(t.tagName)), super.mount(t));
  }
}
const qs = es.length;
function Xs(t) {
  if (!t) return;
  if (!t.isControllingVariants) {
    const e = (t.parent && Xs(t.parent)) || {};
    return (void 0 !== t.props.initial && (e.initial = t.props.initial), e);
  }
  const e = {};
  for (let n = 0; n < qs; n++) {
    const i = es[n],
      s = t.props[i];
    (Qi(s) || !1 === s) && (e[i] = s);
  }
  return e;
}
function Ys(t, e) {
  if (!Array.isArray(e)) return !1;
  const n = e.length;
  if (n !== t.length) return !1;
  for (let i = 0; i < n; i++) if (e[i] !== t[i]) return !1;
  return !0;
}
const Ks = [...ts].reverse(),
  Gs = ts.length;
function _s(t) {
  return e =>
    Promise.all(
      e.map(({ animation: e, options: n }) =>
        (function (t, e, n = {}) {
          let i;
          if ((t.notify('AnimationStart', e), Array.isArray(e))) {
            const s = e.map(e => Zn(t, e, n));
            i = Promise.all(s);
          } else if ('string' == typeof e) i = Zn(t, e, n);
          else {
            const s = 'function' == typeof e ? Un(t, e, n.custom) : e;
            i = Promise.all(_n(t, s, n));
          }
          return i.then(() => {
            t.notify('AnimationComplete', e);
          });
        })(t, e, n)
      )
    );
}
function Zs(t) {
  let e = _s(t),
    n = to(),
    i = !0;
  const s = e => (n, i) => {
    const s = Un(t, i, 'exit' === e ? t.presenceContext?.custom : void 0);
    if (s) {
      const { transition: t, transitionEnd: e, ...i } = s;
      n = { ...n, ...i, ...e };
    }
    return n;
  };
  function o(o) {
    const { props: r } = t,
      a = Xs(t.parent) || {},
      l = [],
      c = new Set();
    let h = {},
      u = 1 / 0;
    for (let e = 0; e < Gs; e++) {
      const d = Ks[e],
        p = n[d],
        m = void 0 !== r[d] ? r[d] : a[d],
        f = Qi(m),
        y = d === o ? p.isActive : null;
      !1 === y && (u = e);
      let g = m === a[d] && m !== r[d] && f;
      if (
        (g && i && t.manuallyAnimateOnMount && (g = !1),
        (p.protectedKeys = { ...h }),
        (!p.isActive && null === y) || (!m && !p.prevProp) || Ji(m) || 'boolean' == typeof m)
      )
        continue;
      const v = Js(p.prevProp, m);
      let x = v || (d === o && p.isActive && !g && f) || (e > u && f),
        w = !1;
      const k = Array.isArray(m) ? m : [m];
      let T = k.reduce(s(d), {});
      !1 === y && (T = {});
      const { prevResolvedValues: M = {} } = p,
        S = { ...M, ...T },
        P = e => {
          ((x = !0), c.has(e) && ((w = !0), c.delete(e)), (p.needsAnimating[e] = !0));
          const n = t.getValue(e);
          n && (n.liveStyle = !1);
        };
      for (const t in S) {
        const e = T[t],
          n = M[t];
        if (h.hasOwnProperty(t)) continue;
        let i = !1;
        ((i = Wn(e) && Wn(n) ? !Ys(e, n) : e !== n),
          i
            ? null != e
              ? P(t)
              : c.add(t)
            : void 0 !== e && c.has(t)
              ? P(t)
              : (p.protectedKeys[t] = !0));
      }
      ((p.prevProp = m),
        (p.prevResolvedValues = T),
        p.isActive && (h = { ...h, ...T }),
        i && t.blockInitialAnimation && (x = !1));
      const b = g && v;
      x &&
        (!b || w) &&
        l.push(
          ...k.map(e => {
            const n = { type: d };
            if ('string' == typeof e && i && !b && t.manuallyAnimateOnMount && t.parent) {
              const { parent: i } = t,
                s = Un(i, e);
              if (i.enteringChildren && s) {
                const { delayChildren: e } = s.transition || {};
                n.delay = Dn(i.enteringChildren, t, e);
              }
            }
            return { animation: e, options: n };
          })
        );
    }
    if (c.size) {
      const e = {};
      if ('boolean' != typeof r.initial) {
        const n = Un(t, Array.isArray(r.initial) ? r.initial[0] : r.initial);
        n && n.transition && (e.transition = n.transition);
      }
      (c.forEach(n => {
        const i = t.getBaseTarget(n),
          s = t.getValue(n);
        (s && (s.liveStyle = !0), (e[n] = i ?? null));
      }),
        l.push({ animation: e }));
    }
    let d = Boolean(l.length);
    return (
      !i || (!1 !== r.initial && r.initial !== r.animate) || t.manuallyAnimateOnMount || (d = !1),
      (i = !1),
      d ? e(l) : Promise.resolve()
    );
  }
  return {
    animateChanges: o,
    setActive: function (e, i) {
      if (n[e].isActive === i) return Promise.resolve();
      (t.variantChildren?.forEach(t => t.animationState?.setActive(e, i)), (n[e].isActive = i));
      const s = o(e);
      for (const t in n) n[t].protectedKeys = {};
      return s;
    },
    setAnimateFunction: function (n) {
      e = n(t);
    },
    getState: () => n,
    reset: () => {
      n = to();
    },
  };
}
function Js(t, e) {
  return 'string' == typeof e ? e !== t : !!Array.isArray(e) && !Ys(e, t);
}
function Qs(t = !1) {
  return { isActive: t, protectedKeys: {}, needsAnimating: {}, prevResolvedValues: {} };
}
function to() {
  return {
    animate: Qs(!0),
    whileInView: Qs(),
    whileHover: Qs(),
    whileTap: Qs(),
    whileDrag: Qs(),
    whileFocus: Qs(),
    exit: Qs(),
  };
}
function eo(t) {
  return t.max - t.min;
}
function no(t, e, n, i = 0.5) {
  ((t.origin = i),
    (t.originPoint = Wt(e.min, e.max, t.origin)),
    (t.scale = eo(n) / eo(e)),
    (t.translate = Wt(n.min, n.max, t.origin) - t.originPoint),
    ((t.scale >= 0.9999 && t.scale <= 1.0001) || isNaN(t.scale)) && (t.scale = 1),
    ((t.translate >= -0.01 && t.translate <= 0.01) || isNaN(t.translate)) && (t.translate = 0));
}
function io(t, e, n, i) {
  (no(t.x, e.x, n.x, i ? i.originX : void 0), no(t.y, e.y, n.y, i ? i.originY : void 0));
}
function so(t, e, n) {
  ((t.min = n.min + e.min), (t.max = t.min + eo(e)));
}
function oo(t, e, n) {
  ((t.min = e.min - n.min), (t.max = t.min + eo(e)));
}
function ro(t, e, n) {
  (oo(t.x, e.x, n.x), oo(t.y, e.y, n.y));
}
function ao(t, e, n, i, s) {
  return ((t = ys((t -= e), 1 / n, i)), void 0 !== s && (t = ys(t, 1 / s, i)), t);
}
function lo(t, e, [n, i, s], o, r) {
  !(function (t, e = 0, n = 1, i = 0.5, s, o = t, r = t) {
    Mt.test(e) && ((e = parseFloat(e)), (e = Wt(r.min, r.max, e / 100) - r.min));
    if ('number' != typeof e) return;
    let a = Wt(o.min, o.max, i);
    (t === o && (a -= e), (t.min = ao(t.min, e, n, a, s)), (t.max = ao(t.max, e, n, a, s)));
  })(t, e[n], e[i], e[s], e.scale, o, r);
}
const co = ['x', 'scaleX', 'originX'],
  ho = ['y', 'scaleY', 'originY'];
function uo(t, e, n, i) {
  (lo(t.x, e, co, n ? n.x : void 0, i ? i.x : void 0),
    lo(t.y, e, ho, n ? n.y : void 0, i ? i.y : void 0));
}
function po(t, e) {
  ((t.min = e.min), (t.max = e.max));
}
function mo(t, e) {
  (po(t.x, e.x), po(t.y, e.y));
}
function fo(t, e) {
  ((t.translate = e.translate),
    (t.scale = e.scale),
    (t.originPoint = e.originPoint),
    (t.origin = e.origin));
}
function yo(t) {
  return 0 === t.translate && 1 === t.scale;
}
function go(t) {
  return yo(t.x) && yo(t.y);
}
function vo(t, e) {
  return t.min === e.min && t.max === e.max;
}
function xo(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function wo(t, e) {
  return xo(t.x, e.x) && xo(t.y, e.y);
}
function ko(t) {
  return eo(t.x) / eo(t.y);
}
function To(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
function Mo(t) {
  return [t('x'), t('y')];
}
const So = ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'],
  Po = So.length,
  bo = t => ('string' == typeof t ? parseFloat(t) : t),
  Eo = t => 'number' == typeof t || St.test(t);
function Ao(t, e) {
  return void 0 !== t[e] ? t[e] : t.borderRadius;
}
const Co = Lo(0, 0.5, W),
  Vo = Lo(0.5, 0.95, S);
function Lo(t, e, n) {
  return i => (i < t ? 0 : i > e ? 1 : n(E(t, e, i)));
}
function Do(t, e, n, i = { passive: !0 }) {
  return (t.addEventListener(e, n, i), () => t.removeEventListener(e, n));
}
function Ro(t) {
  return $n(t) ? t.get() : t;
}
const jo = (t, e) => t.depth - e.depth;
class Bo {
  constructor() {
    ((this.children = []), (this.isDirty = !1));
  }
  add(t) {
    (y(this.children, t), (this.isDirty = !0));
  }
  remove(t) {
    (g(this.children, t), (this.isDirty = !0));
  }
  forEach(t) {
    (this.isDirty && this.children.sort(jo), (this.isDirty = !1), this.children.forEach(t));
  }
}
class Fo {
  constructor() {
    this.members = [];
  }
  add(t) {
    (y(this.members, t), t.scheduleRender());
  }
  remove(t) {
    if ((g(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead)) {
      const t = this.members[this.members.length - 1];
      t && this.promote(t);
    }
  }
  relegate(t) {
    const e = this.members.findIndex(e => t === e);
    if (0 === e) return !1;
    let n;
    for (let i = e; i >= 0; i--) {
      const t = this.members[i];
      if (!1 !== t.isPresent) {
        n = t;
        break;
      }
    }
    return !!n && (this.promote(n), !0);
  }
  promote(t, e) {
    const n = this.lead;
    if (t !== n && ((this.prevLead = n), (this.lead = t), t.show(), n)) {
      (n.instance && n.scheduleRender(),
        t.scheduleRender(),
        (t.resumeFrom = n),
        e && (t.resumeFrom.preserveOpacity = !0),
        n.snapshot &&
          ((t.snapshot = n.snapshot),
          (t.snapshot.latestValues = n.animationValues || n.latestValues)),
        t.root && t.root.isUpdating && (t.isLayoutDirty = !0));
      const { crossfade: i } = t.options;
      !1 === i && n.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach(t => {
      const { options: e, resumingFrom: n } = t;
      (e.onExitComplete && e.onExitComplete(),
        n && n.options.onExitComplete && n.options.onExitComplete());
    });
  }
  scheduleRender() {
    this.members.forEach(t => {
      t.instance && t.scheduleRender(!1);
    });
  }
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
const Oo = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 },
  Io = ['', 'X', 'Y', 'Z'];
let zo = 0;
function Uo(t, e, n, i) {
  const { latestValues: s } = e;
  s[t] && ((n[t] = s[t]), e.setStaticValue(t, 0), i && (i[t] = 0));
}
function Wo(t) {
  if (((t.hasCheckedOptimisedAppear = !0), t.root === t)) return;
  const { visualElement: e } = t.options;
  if (!e) return;
  const n = Kn(e);
  if (window.MotionHasOptimisedAnimation(n, 'transform')) {
    const { layout: e, layoutId: i } = t.options;
    window.MotionCancelOptimisedAnimation(n, 'transform', Z, !(e || i));
  }
  const { parent: i } = t;
  i && !i.hasCheckedOptimisedAppear && Wo(i);
}
function No({
  attachResizeListener: t,
  defaultParent: e,
  measureScroll: n,
  checkIsScrollRoot: i,
  resetTransform: s,
}) {
  return class {
    constructor(t = {}, n = e?.()) {
      ((this.id = zo++),
        (this.animationId = 0),
        (this.animationCommitId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.hasCheckedOptimisedAppear = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.layoutVersion = 0),
        (this.updateScheduled = !1),
        (this.scheduleUpdate = () => this.update()),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
        }),
        (this.updateProjection = () => {
          ((this.projectionUpdateScheduled = !1),
            this.nodes.forEach(qo),
            this.nodes.forEach(Jo),
            this.nodes.forEach(Qo),
            this.nodes.forEach(Xo));
        }),
        (this.resolvedRelativeTargetAt = 0),
        (this.linkedParentVersion = 0),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = t),
        (this.root = n ? n.root || n : this),
        (this.path = n ? [...n.path, n] : []),
        (this.parent = n),
        (this.depth = n ? n.depth + 1 : 0));
      for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Bo());
    }
    addEventListener(t, e) {
      return (
        this.eventHandlers.has(t) || this.eventHandlers.set(t, new A()),
        this.eventHandlers.get(t).add(e)
      );
    }
    notifyListeners(t, ...e) {
      const n = this.eventHandlers.get(t);
      n && n.notify(...e);
    }
    hasListeners(t) {
      return this.eventHandlers.has(t);
    }
    mount(e) {
      if (this.instance) return;
      var n;
      ((this.isSVG = Vi(e) && !(Vi((n = e)) && 'svg' === n.tagName)), (this.instance = e));
      const { layoutId: i, layout: s, visualElement: o } = this.options;
      if (
        (o && !o.current && o.mount(e),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        this.root.hasTreeAnimated && (s || i) && (this.isLayoutDirty = !0),
        t)
      ) {
        let n,
          i = 0;
        const s = () => (this.root.updateBlockedByResize = !1);
        (Z.read(() => {
          i = window.innerWidth;
        }),
          t(e, () => {
            const t = window.innerWidth;
            t !== i &&
              ((i = t),
              (this.root.updateBlockedByResize = !0),
              n && n(),
              (n = (function (t, e) {
                const n = it.now(),
                  i = ({ timestamp: s }) => {
                    const o = s - n;
                    o >= e && (J(i), t(o - e));
                  };
                return (Z.setup(i, !0), () => J(i));
              })(s, 250)),
              Oo.hasAnimatedSinceResize &&
                ((Oo.hasAnimatedSinceResize = !1), this.nodes.forEach(Zo)));
          }));
      }
      (i && this.root.registerSharedNode(i, this),
        !1 !== this.options.animate &&
          o &&
          (i || s) &&
          this.addEventListener(
            'didUpdate',
            ({ delta: t, hasLayoutChanged: e, hasRelativeLayoutChanged: n, layout: i }) => {
              if (this.isTreeAnimationBlocked())
                return ((this.target = void 0), void (this.relativeTarget = void 0));
              const s = this.options.transition || o.getDefaultTransition() || or,
                { onLayoutAnimationStart: r, onLayoutAnimationComplete: a } = o.getProps(),
                l = !this.targetLayout || !wo(this.targetLayout, i),
                c = !e && n;
              if (
                this.options.layoutRoot ||
                this.resumeFrom ||
                c ||
                (e && (l || !this.currentAnimation))
              ) {
                this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0));
                const e = { ...bn(s, 'layout'), onPlay: r, onComplete: a };
                ((o.shouldReduceMotion || this.options.layoutRoot) &&
                  ((e.delay = 0), (e.type = !1)),
                  this.startAnimation(e),
                  this.setAnimationOrigin(t, c));
              } else
                (e || Zo(this),
                  this.isLead() && this.options.onExitComplete && this.options.onExitComplete());
              this.targetLayout = i;
            }
          ));
    }
    unmount() {
      (this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this));
      const t = this.getStack();
      (t && t.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        this.eventHandlers.clear(),
        J(this.updateProjection));
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || (this.parent && this.parent.isTreeAnimationBlocked()) || !1;
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0), this.nodes && this.nodes.forEach(tr), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: t } = this.options;
      return t && t.getProps().transformTemplate;
    }
    willUpdate(t = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked()))
        return void (this.options.onExitComplete && this.options.onExitComplete());
      if (
        (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Wo(this),
        !this.root.isUpdating && this.root.startUpdate(),
        this.isLayoutDirty)
      )
        return;
      this.isLayoutDirty = !0;
      for (let s = 0; s < this.path.length; s++) {
        const t = this.path[s];
        ((t.shouldResetTransform = !0),
          t.updateScroll('snapshot'),
          t.options.layoutRoot && t.willUpdate(!1));
      }
      const { layoutId: e, layout: n } = this.options;
      if (void 0 === e && !n) return;
      const i = this.getTransformTemplate();
      ((this.prevTransformTemplateValue = i ? i(this.latestValues, '') : void 0),
        this.updateSnapshot(),
        t && this.notifyListeners('willUpdate'));
    }
    update() {
      this.updateScheduled = !1;
      if (this.isUpdateBlocked())
        return (this.unblockUpdate(), this.clearAllSnapshots(), void this.nodes.forEach(Ko));
      if (this.animationId <= this.animationCommitId) return void this.nodes.forEach(Go);
      ((this.animationCommitId = this.animationId),
        this.isUpdating
          ? ((this.isUpdating = !1),
            this.nodes.forEach(_o),
            this.nodes.forEach(Ho),
            this.nodes.forEach($o))
          : this.nodes.forEach(Go),
        this.clearAllSnapshots());
      const t = it.now();
      ((Q.delta = v(0, 1e3 / 60, t - Q.timestamp)),
        (Q.timestamp = t),
        (Q.isProcessing = !0),
        tt.update.process(Q),
        tt.preRender.process(Q),
        tt.render.process(Q),
        (Q.isProcessing = !1));
    }
    didUpdate() {
      this.updateScheduled || ((this.updateScheduled = !0), yi.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      (this.nodes.forEach(Yo), this.sharedNodes.forEach(er));
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0), Z.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Z.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      !this.snapshot &&
        this.instance &&
        ((this.snapshot = this.measure()),
        !this.snapshot ||
          eo(this.snapshot.measuredBox.x) ||
          eo(this.snapshot.measuredBox.y) ||
          (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance) return;
      if (
        (this.updateScroll(),
        !((this.options.alwaysMeasureLayout && this.isLead()) || this.isLayoutDirty))
      )
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let n = 0; n < this.path.length; n++) {
          this.path[n].updateScroll();
        }
      const t = this.layout;
      ((this.layout = this.measure(!1)),
        this.layoutVersion++,
        (this.layoutCorrected = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } }),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners('measure', this.layout.layoutBox));
      const { visualElement: e } = this.options;
      e && e.notify('LayoutMeasure', this.layout.layoutBox, t ? t.layoutBox : void 0);
    }
    updateScroll(t = 'measure') {
      let e = Boolean(this.options.layoutScroll && this.instance);
      if (
        (this.scroll &&
          this.scroll.animationId === this.root.animationId &&
          this.scroll.phase === t &&
          (e = !1),
        e && this.instance)
      ) {
        const e = i(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: t,
          isRoot: e,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : e,
        };
      }
    }
    resetTransform() {
      if (!s) return;
      const t = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
        e = this.projectionDelta && !go(this.projectionDelta),
        n = this.getTransformTemplate(),
        i = n ? n(this.latestValues, '') : void 0,
        o = i !== this.prevTransformTemplateValue;
      t &&
        this.instance &&
        (e || ps(this.latestValues) || o) &&
        (s(this.instance, i), (this.shouldResetTransform = !1), this.scheduleRender());
    }
    measure(t = !0) {
      const e = this.measurePageBox();
      let n = this.removeElementScroll(e);
      var i;
      return (
        t && (n = this.removeTransform(n)),
        lr((i = n).x),
        lr(i.y),
        {
          animationId: this.root.animationId,
          measuredBox: e,
          layoutBox: n,
          latestValues: {},
          source: this.id,
        }
      );
    }
    measurePageBox() {
      const { visualElement: t } = this.options;
      if (!t) return { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
      const e = t.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(hr))) {
        const { scroll: t } = this.root;
        t && (Ts(e.x, t.offset.x), Ts(e.y, t.offset.y));
      }
      return e;
    }
    removeElementScroll(t) {
      const e = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
      if ((mo(e, t), this.scroll?.wasRoot)) return e;
      for (let n = 0; n < this.path.length; n++) {
        const i = this.path[n],
          { scroll: s, options: o } = i;
        i !== this.root &&
          s &&
          o.layoutScroll &&
          (s.wasRoot && mo(e, t), Ts(e.x, s.offset.x), Ts(e.y, s.offset.y));
      }
      return e;
    }
    applyTransform(t, e = !1) {
      const n = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
      mo(n, t);
      for (let i = 0; i < this.path.length; i++) {
        const t = this.path[i];
        (!e &&
          t.options.layoutScroll &&
          t.scroll &&
          t !== t.root &&
          Ss(n, { x: -t.scroll.offset.x, y: -t.scroll.offset.y }),
          ps(t.latestValues) && Ss(n, t.latestValues));
      }
      return (ps(this.latestValues) && Ss(n, this.latestValues), n);
    }
    removeTransform(t) {
      const e = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
      mo(e, t);
      for (let n = 0; n < this.path.length; n++) {
        const t = this.path[n];
        if (!t.instance) continue;
        if (!ps(t.latestValues)) continue;
        ds(t.latestValues) && t.updateSnapshot();
        const i = Yi();
        (mo(i, t.measurePageBox()),
          uo(e, t.latestValues, t.snapshot ? t.snapshot.layoutBox : void 0, i));
      }
      return (ps(this.latestValues) && uo(e, this.latestValues), e);
    }
    setTargetDelta(t) {
      ((this.targetDelta = t), this.root.scheduleUpdateProjection(), (this.isProjectionDirty = !0));
    }
    setOptions(t) {
      this.options = { ...this.options, ...t, crossfade: void 0 === t.crossfade || t.crossfade };
    }
    clearMeasurements() {
      ((this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1));
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== Q.timestamp &&
        this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(t = !1) {
      const e = this.getLead();
      (this.isProjectionDirty || (this.isProjectionDirty = e.isProjectionDirty),
        this.isTransformDirty || (this.isTransformDirty = e.isTransformDirty),
        this.isSharedProjectionDirty || (this.isSharedProjectionDirty = e.isSharedProjectionDirty));
      const n = Boolean(this.resumingFrom) || this !== e;
      if (
        !(
          t ||
          (n && this.isSharedProjectionDirty) ||
          this.isProjectionDirty ||
          this.parent?.isProjectionDirty ||
          this.attemptToResolveRelativeTarget ||
          this.root.updateBlockedByResize
        )
      )
        return;
      const { layout: i, layoutId: s } = this.options;
      if (!this.layout || (!i && !s)) return;
      this.resolvedRelativeTargetAt = Q.timestamp;
      const o = this.getClosestProjectingParent();
      var r, a, l;
      (o &&
        this.linkedParentVersion !== o.layoutVersion &&
        !o.options.layoutRoot &&
        this.removeRelativeTarget(),
      this.targetDelta ||
        this.relativeTarget ||
        (o && o.layout
          ? this.createRelativeTarget(o, this.layout.layoutBox, o.layout.layoutBox)
          : this.removeRelativeTarget()),
      this.relativeTarget || this.targetDelta) &&
        (this.target ||
          ((this.target = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } }),
          (this.targetWithTransforms = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } })),
        this.relativeTarget &&
        this.relativeTargetOrigin &&
        this.relativeParent &&
        this.relativeParent.target
          ? (this.forceRelativeParentToResolveTarget(),
            (r = this.target),
            (a = this.relativeTarget),
            (l = this.relativeParent.target),
            so(r.x, a.x, l.x),
            so(r.y, a.y, l.y))
          : this.targetDelta
            ? (this.resumingFrom
                ? (this.target = this.applyTransform(this.layout.layoutBox))
                : mo(this.target, this.layout.layoutBox),
              xs(this.target, this.targetDelta))
            : mo(this.target, this.layout.layoutBox),
        this.attemptToResolveRelativeTarget &&
          ((this.attemptToResolveRelativeTarget = !1),
          o &&
          Boolean(o.resumingFrom) === Boolean(this.resumingFrom) &&
          !o.options.layoutScroll &&
          o.target &&
          1 !== this.animationProgress
            ? this.createRelativeTarget(o, this.target, o.target)
            : (this.relativeParent = this.relativeTarget = void 0)));
    }
    getClosestProjectingParent() {
      if (this.parent && !ds(this.parent.latestValues) && !ms(this.parent.latestValues))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return Boolean(
        (this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout
      );
    }
    createRelativeTarget(t, e, n) {
      ((this.relativeParent = t),
        (this.linkedParentVersion = t.layoutVersion),
        this.forceRelativeParentToResolveTarget(),
        (this.relativeTarget = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } }),
        (this.relativeTargetOrigin = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } }),
        ro(this.relativeTargetOrigin, e, n),
        mo(this.relativeTarget, this.relativeTargetOrigin));
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const t = this.getLead(),
        e = Boolean(this.resumingFrom) || this !== t;
      let n = !0;
      if (
        ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1),
        e && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1),
        this.resolvedRelativeTargetAt === Q.timestamp && (n = !1),
        n)
      )
        return;
      const { layout: i, layoutId: s } = this.options;
      if (
        ((this.isTreeAnimating = Boolean(
          (this.parent && this.parent.isTreeAnimating) ||
          this.currentAnimation ||
          this.pendingAnimation
        )),
        this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || (!i && !s))
      )
        return;
      mo(this.layoutCorrected, this.layout.layoutBox);
      const o = this.treeScale.x,
        r = this.treeScale.y;
      (!(function (t, e, n, i = !1) {
        const s = n.length;
        if (!s) return;
        let o, r;
        e.x = e.y = 1;
        for (let a = 0; a < s; a++) {
          ((o = n[a]), (r = o.projectionDelta));
          const { visualElement: s } = o.options;
          (s && s.props.style && 'contents' === s.props.style.display) ||
            (i &&
              o.options.layoutScroll &&
              o.scroll &&
              o !== o.root &&
              Ss(t, { x: -o.scroll.offset.x, y: -o.scroll.offset.y }),
            r && ((e.x *= r.x.scale), (e.y *= r.y.scale), xs(t, r)),
            i && ps(o.latestValues) && Ss(t, o.latestValues));
        }
        (e.x < ks && e.x > ws && (e.x = 1), e.y < ks && e.y > ws && (e.y = 1));
      })(this.layoutCorrected, this.treeScale, this.path, e),
        !t.layout ||
          t.target ||
          (1 === this.treeScale.x && 1 === this.treeScale.y) ||
          ((t.target = t.layout.layoutBox),
          (t.targetWithTransforms = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } })));
      const { target: a } = t;
      a
        ? (this.projectionDelta && this.prevProjectionDelta
            ? (fo(this.prevProjectionDelta.x, this.projectionDelta.x),
              fo(this.prevProjectionDelta.y, this.projectionDelta.y))
            : this.createProjectionDeltas(),
          io(this.projectionDelta, this.layoutCorrected, a, this.latestValues),
          (this.treeScale.x === o &&
            this.treeScale.y === r &&
            To(this.projectionDelta.x, this.prevProjectionDelta.x) &&
            To(this.projectionDelta.y, this.prevProjectionDelta.y)) ||
            ((this.hasProjected = !0),
            this.scheduleRender(),
            this.notifyListeners('projectionUpdate', a)))
        : this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(t = !0) {
      if ((this.options.visualElement?.scheduleRender(), t)) {
        const t = this.getStack();
        t && t.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      ((this.prevProjectionDelta = {
        x: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
        y: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
      }),
        (this.projectionDelta = {
          x: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
          y: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
        }),
        (this.projectionDeltaWithTransform = {
          x: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
          y: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
        }));
    }
    setAnimationOrigin(t, e = !1) {
      const n = this.snapshot,
        i = n ? n.latestValues : {},
        s = { ...this.latestValues },
        o = {
          x: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
          y: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
        };
      ((this.relativeParent && this.relativeParent.options.layoutRoot) ||
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !e));
      const r = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } },
        a = (n ? n.source : void 0) !== (this.layout ? this.layout.source : void 0),
        l = this.getStack(),
        c = !l || l.members.length <= 1,
        h = Boolean(a && !c && !0 === this.options.crossfade && !this.path.some(sr));
      let u;
      ((this.animationProgress = 0),
        (this.mixTargetDelta = e => {
          const n = e / 1e3;
          var l, d, p, m, f, y;
          (nr(o.x, t.x, n),
            nr(o.y, t.y, n),
            this.setTargetDelta(o),
            this.relativeTarget &&
              this.relativeTargetOrigin &&
              this.layout &&
              this.relativeParent &&
              this.relativeParent.layout &&
              (ro(r, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
              (p = this.relativeTarget),
              (m = this.relativeTargetOrigin),
              (f = r),
              (y = n),
              ir(p.x, m.x, f.x, y),
              ir(p.y, m.y, f.y, y),
              u &&
                ((l = this.relativeTarget), (d = u), vo(l.x, d.x) && vo(l.y, d.y)) &&
                (this.isProjectionDirty = !1),
              u || (u = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } }),
              mo(u, this.relativeTarget)),
            a &&
              ((this.animationValues = s),
              (function (t, e, n, i, s, o) {
                s
                  ? ((t.opacity = Wt(0, n.opacity ?? 1, Co(i))),
                    (t.opacityExit = Wt(e.opacity ?? 1, 0, Vo(i))))
                  : o && (t.opacity = Wt(e.opacity ?? 1, n.opacity ?? 1, i));
                for (let r = 0; r < Po; r++) {
                  const s = `border${So[r]}Radius`;
                  let o = Ao(e, s),
                    a = Ao(n, s);
                  (void 0 === o && void 0 === a) ||
                    (o || (o = 0),
                    a || (a = 0),
                    0 === o || 0 === a || Eo(o) === Eo(a)
                      ? ((t[s] = Math.max(Wt(bo(o), bo(a), i), 0)),
                        (Mt.test(a) || Mt.test(o)) && (t[s] += '%'))
                      : (t[s] = a));
                }
                (e.rotate || n.rotate) && (t.rotate = Wt(e.rotate || 0, n.rotate || 0, i));
              })(s, i, this.latestValues, n, h, c)),
            this.root.scheduleUpdateProjection(),
            this.scheduleRender(),
            (this.animationProgress = n));
        }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0));
    }
    startAnimation(t) {
      (this.notifyListeners('animationStart'),
        this.currentAnimation?.stop(),
        this.resumingFrom?.currentAnimation?.stop(),
        this.pendingAnimation && (J(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = Z.update(() => {
          ((Oo.hasAnimatedSinceResize = !0),
            this.motionValue || (this.motionValue = On(0)),
            (this.currentAnimation = (function (t, e, n) {
              const i = $n(t) ? t : On(t);
              return (i.start(Rn('', i, e, n)), i.animation);
            })(this.motionValue, [0, 1e3], {
              ...t,
              velocity: 0,
              isSync: !0,
              onUpdate: e => {
                (this.mixTargetDelta(e), t.onUpdate && t.onUpdate(e));
              },
              onStop: () => {},
              onComplete: () => {
                (t.onComplete && t.onComplete(), this.completeAnimation());
              },
            })),
            this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0));
        })));
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0));
      const t = this.getStack();
      (t && t.exitAnimationComplete(),
        (this.resumingFrom = this.currentAnimation = this.animationValues = void 0),
        this.notifyListeners('animationComplete'));
    }
    finishAnimation() {
      (this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta(1e3), this.currentAnimation.stop()),
        this.completeAnimation());
    }
    applyTransformsToTarget() {
      const t = this.getLead();
      let { targetWithTransforms: e, target: n, layout: i, latestValues: s } = t;
      if (e && n && i) {
        if (
          this !== t &&
          this.layout &&
          i &&
          cr(this.options.animationType, this.layout.layoutBox, i.layoutBox)
        ) {
          n = this.target || { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
          const e = eo(this.layout.layoutBox.x);
          ((n.x.min = t.target.x.min), (n.x.max = n.x.min + e));
          const i = eo(this.layout.layoutBox.y);
          ((n.y.min = t.target.y.min), (n.y.max = n.y.min + i));
        }
        (mo(e, n), Ss(e, s), io(this.projectionDeltaWithTransform, this.layoutCorrected, e, s));
      }
    }
    registerSharedNode(t, e) {
      this.sharedNodes.has(t) || this.sharedNodes.set(t, new Fo());
      this.sharedNodes.get(t).add(e);
      const n = e.options.initialPromotionConfig;
      e.promote({
        transition: n ? n.transition : void 0,
        preserveFollowOpacity:
          n && n.shouldPreserveFollowOpacity ? n.shouldPreserveFollowOpacity(e) : void 0,
      });
    }
    isLead() {
      const t = this.getStack();
      return !t || t.lead === this;
    }
    getLead() {
      const { layoutId: t } = this.options;
      return (t && this.getStack()?.lead) || this;
    }
    getPrevLead() {
      const { layoutId: t } = this.options;
      return t ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId: t } = this.options;
      if (t) return this.root.sharedNodes.get(t);
    }
    promote({ needsReset: t, transition: e, preserveFollowOpacity: n } = {}) {
      const i = this.getStack();
      (i && i.promote(this, n),
        t && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        e && this.setOptions({ transition: e }));
    }
    relegate() {
      const t = this.getStack();
      return !!t && t.relegate(this);
    }
    resetSkewAndRotation() {
      const { visualElement: t } = this.options;
      if (!t) return;
      let e = !1;
      const { latestValues: n } = t;
      if (
        ((n.z || n.rotate || n.rotateX || n.rotateY || n.rotateZ || n.skewX || n.skewY) && (e = !0),
        !e)
      )
        return;
      const i = {};
      n.z && Uo('z', t, i, this.animationValues);
      for (let s = 0; s < Io.length; s++)
        (Uo(`rotate${Io[s]}`, t, i, this.animationValues),
          Uo(`skew${Io[s]}`, t, i, this.animationValues));
      t.render();
      for (const s in i)
        (t.setStaticValue(s, i[s]), this.animationValues && (this.animationValues[s] = i[s]));
      t.scheduleRender();
    }
    applyProjectionStyles(t, e) {
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) return void (t.visibility = 'hidden');
      const n = this.getTransformTemplate();
      if (this.needsReset)
        return (
          (this.needsReset = !1),
          (t.visibility = ''),
          (t.opacity = ''),
          (t.pointerEvents = Ro(e?.pointerEvents) || ''),
          void (t.transform = n ? n(this.latestValues, '') : 'none')
        );
      const i = this.getLead();
      if (!this.projectionDelta || !this.layout || !i.target)
        return (
          this.options.layoutId &&
            ((t.opacity = void 0 !== this.latestValues.opacity ? this.latestValues.opacity : 1),
            (t.pointerEvents = Ro(e?.pointerEvents) || '')),
          void (
            this.hasProjected &&
            !ps(this.latestValues) &&
            ((t.transform = n ? n({}, '') : 'none'), (this.hasProjected = !1))
          )
        );
      t.visibility = '';
      const s = i.animationValues || i.latestValues;
      this.applyTransformsToTarget();
      let o = (function (t, e, n) {
        let i = '';
        const s = t.x.translate / e.x,
          o = t.y.translate / e.y,
          r = n?.z || 0;
        if (
          ((s || o || r) && (i = `translate3d(${s}px, ${o}px, ${r}px) `),
          (1 === e.x && 1 === e.y) || (i += `scale(${1 / e.x}, ${1 / e.y}) `),
          n)
        ) {
          const {
            transformPerspective: t,
            rotate: e,
            rotateX: s,
            rotateY: o,
            skewX: r,
            skewY: a,
          } = n;
          (t && (i = `perspective(${t}px) ${i}`),
            e && (i += `rotate(${e}deg) `),
            s && (i += `rotateX(${s}deg) `),
            o && (i += `rotateY(${o}deg) `),
            r && (i += `skewX(${r}deg) `),
            a && (i += `skewY(${a}deg) `));
        }
        const a = t.x.scale * e.x,
          l = t.y.scale * e.y;
        return ((1 === a && 1 === l) || (i += `scale(${a}, ${l})`), i || 'none');
      })(this.projectionDeltaWithTransform, this.treeScale, s);
      (n && (o = n(s, o)), (t.transform = o));
      const { x: r, y: a } = this.projectionDelta;
      ((t.transformOrigin = `${100 * r.origin}% ${100 * a.origin}% 0`),
        i.animationValues
          ? (t.opacity =
              i === this
                ? (s.opacity ?? this.latestValues.opacity ?? 1)
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : s.opacityExit)
          : (t.opacity =
              i === this
                ? void 0 !== s.opacity
                  ? s.opacity
                  : ''
                : void 0 !== s.opacityExit
                  ? s.opacityExit
                  : 0));
      for (const l in Rs) {
        if (void 0 === s[l]) continue;
        const { correct: e, applyTo: n, isCSSVariable: r } = Rs[l],
          a = 'none' === o ? s[l] : e(s[l], i);
        if (n) {
          const e = n.length;
          for (let i = 0; i < e; i++) t[n[i]] = a;
        } else r ? (this.options.visualElement.renderState.vars[l] = a) : (t[l] = a);
      }
      this.options.layoutId && (t.pointerEvents = i === this ? Ro(e?.pointerEvents) || '' : 'none');
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      (this.root.nodes.forEach(t => t.currentAnimation?.stop()),
        this.root.nodes.forEach(Ko),
        this.root.sharedNodes.clear());
    }
  };
}
function Ho(t) {
  t.updateLayout();
}
function $o(t) {
  const e = t.resumeFrom?.snapshot || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners('didUpdate')) {
    const { layoutBox: n, measuredBox: i } = t.layout,
      { animationType: s } = t.options,
      o = e.source !== t.layout.source;
    'size' === s
      ? Mo(t => {
          const i = o ? e.measuredBox[t] : e.layoutBox[t],
            s = eo(i);
          ((i.min = n[t].min), (i.max = i.min + s));
        })
      : cr(s, e.layoutBox, n) &&
        Mo(i => {
          const s = o ? e.measuredBox[i] : e.layoutBox[i],
            r = eo(n[i]);
          ((s.max = s.min + r),
            t.relativeTarget &&
              !t.currentAnimation &&
              ((t.isProjectionDirty = !0),
              (t.relativeTarget[i].max = t.relativeTarget[i].min + r)));
        });
    const r = {
      x: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
      y: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
    };
    io(r, n, e.layoutBox);
    const a = {
      x: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
      y: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
    };
    o ? io(a, t.applyTransform(i, !0), e.measuredBox) : io(a, n, e.layoutBox);
    const l = !go(r);
    let c = !1;
    if (!t.resumeFrom) {
      const i = t.getClosestProjectingParent();
      if (i && !i.resumeFrom) {
        const { snapshot: s, layout: o } = i;
        if (s && o) {
          const r = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
          ro(r, e.layoutBox, s.layoutBox);
          const a = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
          (ro(a, n, o.layoutBox),
            wo(r, a) || (c = !0),
            i.options.layoutRoot &&
              ((t.relativeTarget = a), (t.relativeTargetOrigin = r), (t.relativeParent = i)));
        }
      }
    }
    t.notifyListeners('didUpdate', {
      layout: n,
      snapshot: e,
      delta: a,
      layoutDelta: r,
      hasLayoutChanged: l,
      hasRelativeLayoutChanged: c,
    });
  } else if (t.isLead()) {
    const { onExitComplete: e } = t.options;
    e && e();
  }
  t.options.transition = void 0;
}
function qo(t) {
  t.parent &&
    (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty),
    t.isSharedProjectionDirty ||
      (t.isSharedProjectionDirty = Boolean(
        t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty
      )),
    t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function Xo(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function Yo(t) {
  t.clearSnapshot();
}
function Ko(t) {
  t.clearMeasurements();
}
function Go(t) {
  t.isLayoutDirty = !1;
}
function _o(t) {
  const { visualElement: e } = t.options;
  (e && e.getProps().onBeforeLayoutMeasure && e.notify('BeforeLayoutMeasure'), t.resetTransform());
}
function Zo(t) {
  (t.finishAnimation(),
    (t.targetDelta = t.relativeTarget = t.target = void 0),
    (t.isProjectionDirty = !0));
}
function Jo(t) {
  t.resolveTargetDelta();
}
function Qo(t) {
  t.calcProjection();
}
function tr(t) {
  t.resetSkewAndRotation();
}
function er(t) {
  t.removeLeadSnapshot();
}
function nr(t, e, n) {
  ((t.translate = Wt(e.translate, 0, n)),
    (t.scale = Wt(e.scale, 1, n)),
    (t.origin = e.origin),
    (t.originPoint = e.originPoint));
}
function ir(t, e, n, i) {
  ((t.min = Wt(e.min, n.min, i)), (t.max = Wt(e.max, n.max, i)));
}
function sr(t) {
  return t.animationValues && void 0 !== t.animationValues.opacityExit;
}
const or = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  rr = t =>
    'undefined' != typeof navigator &&
    navigator.userAgent &&
    navigator.userAgent.toLowerCase().includes(t),
  ar = rr('applewebkit/') && !rr('chrome/') ? Math.round : S;
function lr(t) {
  ((t.min = ar(t.min)), (t.max = ar(t.max)));
}
function cr(t, e, n) {
  return (
    'position' === t ||
    ('preserve-aspect' === t && ((i = ko(e)), (s = ko(n)), (o = 0.2), !(Math.abs(i - s) <= o)))
  );
  var i, s, o;
}
function hr(t) {
  return t !== t.root && t.scroll?.wasRoot;
}
const ur = No({
    attachResizeListener: (t, e) => Do(t, 'resize', e),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body.scrollLeft,
      y: document.documentElement.scrollTop || document.body.scrollTop,
    }),
    checkIsScrollRoot: () => !0,
  }),
  dr = { current: void 0 },
  pr = No({
    measureScroll: t => ({ x: t.scrollLeft, y: t.scrollTop }),
    defaultParent: () => {
      if (!dr.current) {
        const t = new ur({});
        (t.mount(window), t.setOptions({ layoutScroll: !0 }), (dr.current = t));
      }
      return dr.current;
    },
    resetTransform: (t, e) => {
      t.style.transform = void 0 !== e ? e : 'none';
    },
    checkIsScrollRoot: t => Boolean('fixed' === window.getComputedStyle(t).position),
  }),
  mr = t.createContext({ transformPagePoint: t => t, isStatic: !1, reducedMotion: 'never' });
function fr(t, e) {
  if ('function' == typeof t) return t(e);
  null != t && (t.current = e);
}
function yr(...e) {
  return t.useCallback(
    (function (...t) {
      return e => {
        let n = !1;
        const i = t.map(t => {
          const i = fr(t, e);
          return (n || 'function' != typeof i || (n = !0), i);
        });
        if (n)
          return () => {
            for (let e = 0; e < i.length; e++) {
              const n = i[e];
              'function' == typeof n ? n() : fr(t[e], null);
            }
          };
      };
    })(...e),
    e
  );
}
class gr extends t.Component {
  getSnapshotBeforeUpdate(t) {
    const e = this.props.childRef.current;
    if (e && t.isPresent && !this.props.isPresent) {
      const t = e.offsetParent,
        n = (fi(t) && t.offsetWidth) || 0,
        i = this.props.sizeRef.current;
      ((i.height = e.offsetHeight || 0),
        (i.width = e.offsetWidth || 0),
        (i.top = e.offsetTop),
        (i.left = e.offsetLeft),
        (i.right = n - i.width - i.left));
    }
    return null;
  }
  componentDidUpdate() {}
  render() {
    return this.props.children;
  }
}
function vr({ children: e, isPresent: n, anchorX: i, root: s }) {
  const o = t.useId(),
    r = t.useRef(null),
    a = t.useRef({ width: 0, height: 0, top: 0, left: 0, right: 0 }),
    { nonce: l } = t.useContext(mr),
    c = e.props?.ref ?? e?.ref,
    u = yr(r, c);
  return (
    t.useInsertionEffect(() => {
      const { width: t, height: e, top: c, left: h, right: u } = a.current;
      if (n || !r.current || !t || !e) return;
      const d = 'left' === i ? `left: ${h}` : `right: ${u}`;
      r.current.dataset.motionPopId = o;
      const p = document.createElement('style');
      l && (p.nonce = l);
      const m = s ?? document.head;
      return (
        m.appendChild(p),
        p.sheet &&
          p.sheet.insertRule(
            `\n          [data-motion-pop-id="${o}"] {\n            position: absolute !important;\n            width: ${t}px !important;\n            height: ${e}px !important;\n            ${d}px !important;\n            top: ${c}px !important;\n          }\n        `
          ),
        () => {
          m.contains(p) && m.removeChild(p);
        }
      );
    }, [n]),
    h.jsx(gr, { isPresent: n, childRef: r, sizeRef: a, children: t.cloneElement(e, { ref: u }) })
  );
}
const xr = ({
  children: e,
  initial: n,
  isPresent: i,
  onExitComplete: s,
  custom: o,
  presenceAffectsLayout: r,
  mode: a,
  anchorX: l,
  root: c,
}) => {
  const u = d(wr),
    p = t.useId();
  let m = !0,
    y = t.useMemo(
      () => (
        (m = !1),
        {
          id: p,
          initial: n,
          isPresent: i,
          custom: o,
          onExitComplete: t => {
            u.set(t, !0);
            for (const e of u.values()) if (!e) return;
            s && s();
          },
          register: t => (u.set(t, !1), () => u.delete(t)),
        }
      ),
      [i, u, s]
    );
  return (
    r && m && (y = { ...y }),
    t.useMemo(() => {
      u.forEach((t, e) => u.set(e, !1));
    }, [i]),
    t.useEffect(() => {
      !i && !u.size && s && s();
    }, [i]),
    'popLayout' === a && (e = h.jsx(vr, { isPresent: i, anchorX: l, root: c, children: e })),
    h.jsx(f.Provider, { value: y, children: e })
  );
};
function wr() {
  return new Map();
}
function kr(e = !0) {
  const n = t.useContext(f);
  if (null === n) return [!0, null];
  const { isPresent: i, onExitComplete: s, register: o } = n,
    r = t.useId();
  t.useEffect(() => {
    if (e) return o(r);
  }, [e]);
  const a = t.useCallback(() => e && s && s(r), [r, s, e]);
  return !i && s ? [!1, a] : [!0];
}
const Tr = t => t.key || '';
function Mr(e) {
  const n = [];
  return (
    t.Children.forEach(e, e => {
      t.isValidElement(e) && n.push(e);
    }),
    n
  );
}
const Sr = ({
    children: e,
    custom: n,
    initial: i = !0,
    onExitComplete: s,
    presenceAffectsLayout: o = !0,
    mode: r = 'sync',
    propagate: a = !1,
    anchorX: l = 'left',
    root: c,
  }) => {
    const [p, f] = kr(a),
      y = t.useMemo(() => Mr(e), [e]),
      g = a && !p ? [] : y.map(Tr),
      v = t.useRef(!0),
      x = t.useRef(y),
      w = d(() => new Map()),
      k = t.useRef(new Set()),
      [T, M] = t.useState(y),
      [S, P] = t.useState(y);
    m(() => {
      ((v.current = !1), (x.current = y));
      for (let t = 0; t < S.length; t++) {
        const e = Tr(S[t]);
        g.includes(e) ? (w.delete(e), k.current.delete(e)) : !0 !== w.get(e) && w.set(e, !1);
      }
    }, [S, g.length, g.join('-')]);
    const b = [];
    if (y !== T) {
      let t = [...y];
      for (let e = 0; e < S.length; e++) {
        const n = S[e],
          i = Tr(n);
        g.includes(i) || (t.splice(e, 0, n), b.push(n));
      }
      return ('wait' === r && b.length && (t = b), P(Mr(t)), M(y), null);
    }
    const { forceRender: E } = t.useContext(u);
    return h.jsx(h.Fragment, {
      children: S.map(t => {
        const e = Tr(t),
          u = !(a && !p) && (y === S || g.includes(e));
        return h.jsx(
          xr,
          {
            isPresent: u,
            initial: !(v.current && !i) && void 0,
            custom: n,
            presenceAffectsLayout: o,
            mode: r,
            root: c,
            onExitComplete: u
              ? void 0
              : () => {
                  if (k.current.has(e)) return;
                  if ((k.current.add(e), !w.has(e))) return;
                  w.set(e, !0);
                  let t = !0;
                  (w.forEach(e => {
                    e || (t = !1);
                  }),
                    t && (E?.(), P(x.current), a && f?.(), s && s()));
                },
            anchorX: l,
            children: t,
          },
          e
        );
      }),
    });
  },
  Pr = t.createContext({ strict: !1 }),
  br = {
    animation: [
      'animate',
      'variants',
      'whileHover',
      'whileTap',
      'exit',
      'whileInView',
      'whileFocus',
      'whileDrag',
    ],
    exit: ['exit'],
    drag: ['drag', 'dragControls'],
    focus: ['whileFocus'],
    hover: ['whileHover', 'onHoverStart', 'onHoverEnd'],
    tap: ['whileTap', 'onTap', 'onTapStart', 'onTapCancel'],
    pan: ['onPan', 'onPanStart', 'onPanSessionStart', 'onPanEnd'],
    inView: ['whileInView', 'onViewportEnter', 'onViewportLeave'],
    layout: ['layout', 'layoutId'],
  };
let Er = !1;
function Ar() {
  return (
    (function () {
      if (Er) return;
      const t = {};
      for (const e in br) t[e] = { isEnabled: t => br[e].some(e => !!t[e]) };
      (rs(t), (Er = !0));
    })(),
    os
  );
}
const Cr = new Set([
  'animate',
  'exit',
  'variants',
  'initial',
  'style',
  'values',
  'variants',
  'transition',
  'transformTemplate',
  'custom',
  'inherit',
  'onBeforeLayoutMeasure',
  'onAnimationStart',
  'onAnimationComplete',
  'onUpdate',
  'onDragStart',
  'onDrag',
  'onDragEnd',
  'onMeasureDragConstraints',
  'onDirectionLock',
  'onDragTransitionEnd',
  '_dragX',
  '_dragY',
  'onHoverStart',
  'onHoverEnd',
  'onViewportEnter',
  'onViewportLeave',
  'globalTapTarget',
  'ignoreStrict',
  'viewport',
]);
function Vr(t) {
  return (
    t.startsWith('while') ||
    (t.startsWith('drag') && 'draggable' !== t) ||
    t.startsWith('layout') ||
    t.startsWith('onTap') ||
    t.startsWith('onPan') ||
    t.startsWith('onLayout') ||
    Cr.has(t)
  );
}
let Lr = t => !Vr(t);
try {
  'function' == typeof (Dr = require('@emotion/is-prop-valid').default) &&
    (Lr = t => (t.startsWith('on') ? !Vr(t) : Dr(t)));
} catch {}
var Dr;
const Rr = t.createContext({});
function jr(e) {
  const { initial: n, animate: i } = (function (t, e) {
    if (ns(t)) {
      const { initial: e, animate: n } = t;
      return { initial: !1 === e || Qi(e) ? e : void 0, animate: Qi(n) ? n : void 0 };
    }
    return !1 !== t.inherit ? e : {};
  })(e, t.useContext(Rr));
  return t.useMemo(() => ({ initial: n, animate: i }), [Br(n), Br(i)]);
}
function Br(t) {
  return Array.isArray(t) ? t.join(' ') : t;
}
const Fr = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
function Or(t, e, n) {
  for (const i in e) $n(e[i]) || js(i, n) || (t[i] = e[i]);
}
function Ir(e, n) {
  const i = {};
  return (
    Or(i, e.style || {}, e),
    Object.assign(
      i,
      (function ({ transformTemplate: e }, n) {
        return t.useMemo(() => {
          const t = { style: {}, transform: {}, transformOrigin: {}, vars: {} };
          return (As(t, n, e), Object.assign({}, t.vars, t.style));
        }, [n]);
      })(e, n)
    ),
    i
  );
}
function zr(t, e) {
  const n = {},
    i = Ir(t, e);
  return (
    t.drag &&
      !1 !== t.dragListener &&
      ((n.draggable = !1),
      (i.userSelect = i.WebkitUserSelect = i.WebkitTouchCallout = 'none'),
      (i.touchAction = !0 === t.drag ? 'none' : 'pan-' + ('x' === t.drag ? 'y' : 'x'))),
    void 0 === t.tabIndex && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0),
    (n.style = i),
    n
  );
}
const Ur = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {}, attrs: {} });
function Wr(e, n, i, s) {
  const o = t.useMemo(() => {
    const t = { style: {}, transform: {}, transformOrigin: {}, vars: {}, attrs: {} };
    return (Us(t, n, Ns(s), e.transformTemplate, e.style), { ...t.attrs, style: { ...t.style } });
  }, [n]);
  if (e.style) {
    const t = {};
    (Or(t, e.style, e), (o.style = { ...t, ...o.style }));
  }
  return o;
}
const Nr = [
  'animate',
  'circle',
  'defs',
  'desc',
  'ellipse',
  'g',
  'image',
  'line',
  'filter',
  'marker',
  'mask',
  'metadata',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'rect',
  'stop',
  'switch',
  'symbol',
  'svg',
  'text',
  'tspan',
  'use',
  'view',
];
function Hr(t) {
  return 'string' == typeof t && !t.includes('-') && !!(Nr.indexOf(t) > -1 || /[A-Z]/u.test(t));
}
function $r(e, n, i, { latestValues: s }, o, r = !1, a) {
  const l = ((a ?? Hr(e)) ? Wr : zr)(n, s, o, e),
    c = (function (t, e, n) {
      const i = {};
      for (const s in t)
        ('values' === s && 'object' == typeof t.values) ||
          ((Lr(s) ||
            (!0 === n && Vr(s)) ||
            (!e && !Vr(s)) ||
            (t.draggable && s.startsWith('onDrag'))) &&
            (i[s] = t[s]));
      return i;
    })(n, 'string' == typeof e, r),
    h = e !== t.Fragment ? { ...c, ...l, ref: i } : {},
    { children: u } = n,
    d = t.useMemo(() => ($n(u) ? u.get() : u), [u]);
  return t.createElement(e, { ...h, children: d });
}
function qr(t, e, n, i) {
  const s = {},
    o = i(t, {});
  for (const d in o) s[d] = Ro(o[d]);
  let { initial: r, animate: a } = t;
  const l = ns(t),
    c = is(t);
  e &&
    c &&
    !l &&
    !1 !== t.inherit &&
    (void 0 === r && (r = e.initial), void 0 === a && (a = e.animate));
  let h = !!n && !1 === n.initial;
  h = h || !1 === r;
  const u = h ? a : r;
  if (u && 'boolean' != typeof u && !Ji(u)) {
    const e = Array.isArray(u) ? u : [u];
    for (let n = 0; n < e.length; n++) {
      const i = zn(t, e[n]);
      if (i) {
        const { transitionEnd: t, transition: e, ...n } = i;
        for (const i in n) {
          let t = n[i];
          if (Array.isArray(t)) {
            t = t[h ? t.length - 1 : 0];
          }
          null !== t && (s[i] = t);
        }
        for (const i in t) s[i] = t[i];
      }
    }
  }
  return s;
}
const Xr = e => (n, i) => {
    const s = t.useContext(Rr),
      o = t.useContext(f),
      r = () =>
        (function ({ scrapeMotionValuesFromProps: t, createRenderState: e }, n, i, s) {
          return { latestValues: qr(n, i, s, t), renderState: e() };
        })(e, n, s, o);
    return i ? r() : d(r);
  },
  Yr = Xr({ scrapeMotionValuesFromProps: Bs, createRenderState: Fr }),
  Kr = Xr({ scrapeMotionValuesFromProps: Hs, createRenderState: Ur }),
  Gr = Symbol.for('motionComponentSymbol');
function _r(e, n, i) {
  const s = t.useRef(i);
  t.useInsertionEffect(() => {
    s.current = i;
  });
  const o = t.useRef(null);
  return t.useCallback(
    t => {
      (t && e.onMount?.(t), n && (t ? n.mount(t) : n.unmount()));
      const i = s.current;
      if ('function' == typeof i)
        if (t) {
          const e = i(t);
          'function' == typeof e && (o.current = e);
        } else o.current ? (o.current(), (o.current = null)) : i(t);
      else i && (i.current = t);
    },
    [n]
  );
}
const Zr = t.createContext({});
function Jr(t) {
  return t && 'object' == typeof t && Object.prototype.hasOwnProperty.call(t, 'current');
}
function Qr(e, n, i, s, o, r) {
  const { visualElement: a } = t.useContext(Rr),
    l = t.useContext(Pr),
    c = t.useContext(f),
    h = t.useContext(mr).reducedMotion,
    u = t.useRef(null);
  ((s = s || l.renderer),
    !u.current &&
      s &&
      (u.current = s(e, {
        visualState: n,
        parent: a,
        props: i,
        presenceContext: c,
        blockInitialAnimation: !!c && !1 === c.initial,
        reducedMotionConfig: h,
        isSVG: r,
      })));
  const d = u.current,
    p = t.useContext(Zr);
  !d ||
    d.projection ||
    !o ||
    ('html' !== d.type && 'svg' !== d.type) ||
    (function (t, e, n, i) {
      const {
        layoutId: s,
        layout: o,
        drag: r,
        dragConstraints: a,
        layoutScroll: l,
        layoutRoot: c,
        layoutCrossfade: h,
      } = e;
      ((t.projection = new n(t.latestValues, e['data-framer-portal-id'] ? void 0 : ta(t.parent))),
        t.projection.setOptions({
          layoutId: s,
          layout: o,
          alwaysMeasureLayout: Boolean(r) || (a && Jr(a)),
          visualElement: t,
          animationType: 'string' == typeof o ? o : 'both',
          initialPromotionConfig: i,
          crossfade: h,
          layoutScroll: l,
          layoutRoot: c,
        }));
    })(u.current, i, o, p);
  const y = t.useRef(!1);
  t.useInsertionEffect(() => {
    d && y.current && d.update(i, c);
  });
  const g = i[Yn],
    v = t.useRef(
      Boolean(g) && !window.MotionHandoffIsComplete?.(g) && window.MotionHasOptimisedAnimation?.(g)
    );
  return (
    m(() => {
      d &&
        ((y.current = !0),
        (window.MotionIsMounted = !0),
        d.updateFeatures(),
        d.scheduleRenderMicrotask(),
        v.current && d.animationState && d.animationState.animateChanges());
    }),
    t.useEffect(() => {
      d &&
        (!v.current && d.animationState && d.animationState.animateChanges(),
        v.current &&
          (queueMicrotask(() => {
            window.MotionHandoffMarkAsComplete?.(g);
          }),
          (v.current = !1)),
        (d.enteringChildren = void 0));
    }),
    d
  );
}
function ta(t) {
  if (t) return !1 !== t.options.allowProjection ? t.projection : ta(t.parent);
}
function ea(e, { forwardMotionProps: n = !1, type: i } = {}, s, o) {
  s &&
    (function (t) {
      const e = Ar();
      for (const n in t) e[n] = { ...e[n], ...t[n] };
      rs(e);
    })(s);
  const r = i ? 'svg' === i : Hr(e),
    a = r ? Kr : Yr;
  function l(i, s) {
    let l;
    const c = { ...t.useContext(mr), ...i, layoutId: na(i) },
      { isStatic: u } = c,
      d = jr(i),
      m = a(i, u);
    if (!u && p) {
      t.useContext(Pr).strict;
      const n = (function (t) {
        const e = Ar(),
          { drag: n, layout: i } = e;
        if (!n && !i) return {};
        const s = { ...n, ...i };
        return {
          MeasureLayout: n?.isEnabled(t) || i?.isEnabled(t) ? s.MeasureLayout : void 0,
          ProjectionNode: s.ProjectionNode,
        };
      })(c);
      ((l = n.MeasureLayout), (d.visualElement = Qr(e, m, c, o, n.ProjectionNode, r)));
    }
    return h.jsxs(Rr.Provider, {
      value: d,
      children: [
        l && d.visualElement ? h.jsx(l, { visualElement: d.visualElement, ...c }) : null,
        $r(e, i, _r(m, d.visualElement, s), m, u, n, r),
      ],
    });
  }
  l.displayName = `motion.${'string' == typeof e ? e : `create(${e.displayName ?? e.name ?? ''})`}`;
  const c = t.forwardRef(l);
  return ((c[Gr] = e), c);
}
function na({ layoutId: e }) {
  const n = t.useContext(u).id;
  return n && void 0 !== e ? n + '-' + e : e;
}
function ia(t, e) {
  if ('undefined' == typeof Proxy) return ea;
  const n = new Map(),
    i = (n, i) => ea(n, i, t, e);
  return new Proxy((t, e) => i(t, e), {
    get: (s, o) => ('create' === o ? i : (n.has(o) || n.set(o, ea(o, void 0, t, e)), n.get(o))),
  });
}
const sa = (e, n) =>
  (n.isSVG ?? Hr(e)) ? new $s(n) : new Fs(n, { allowProjection: e !== t.Fragment });
let oa = 0;
const ra = {
  animation: {
    Feature: class extends ls {
      constructor(t) {
        (super(t), t.animationState || (t.animationState = Zs(t)));
      }
      updateAnimationControlsSubscription() {
        const { animate: t } = this.node.getProps();
        Ji(t) && (this.unmountControls = t.subscribe(this.node));
      }
      mount() {
        this.updateAnimationControlsSubscription();
      }
      update() {
        const { animate: t } = this.node.getProps(),
          { animate: e } = this.node.prevProps || {};
        t !== e && this.updateAnimationControlsSubscription();
      }
      unmount() {
        (this.node.animationState.reset(), this.unmountControls?.());
      }
    },
  },
  exit: {
    Feature: class extends ls {
      constructor() {
        (super(...arguments), (this.id = oa++));
      }
      update() {
        if (!this.node.presenceContext) return;
        const { isPresent: t, onExitComplete: e } = this.node.presenceContext,
          { isPresent: n } = this.node.prevPresenceContext || {};
        if (!this.node.animationState || t === n) return;
        const i = this.node.animationState.setActive('exit', !t);
        e &&
          !t &&
          i.then(() => {
            e(this.id);
          });
      }
      mount() {
        const { register: t, onExitComplete: e } = this.node.presenceContext || {};
        (e && e(this.id), t && (this.unmount = t(this.id)));
      }
      unmount() {}
    },
  },
};
function aa(t) {
  return { point: { x: t.pageX, y: t.pageY } };
}
function la(t, e, n, i) {
  return Do(
    t,
    e,
    (
      t => e =>
        Ti(e) && t(e, aa(e))
    )(n),
    i
  );
}
const ca = ({ current: t }) => (t ? t.ownerDocument.defaultView : null),
  ha = (t, e) => Math.abs(t - e);
const ua = new Set(['auto', 'scroll']);
class da {
  constructor(
    t,
    e,
    {
      transformPagePoint: n,
      contextWindow: i = window,
      dragSnapToOrigin: s = !1,
      distanceThreshold: o = 3,
      element: r,
    } = {}
  ) {
    if (
      ((this.startEvent = null),
      (this.lastMoveEvent = null),
      (this.lastMoveEventInfo = null),
      (this.handlers = {}),
      (this.contextWindow = window),
      (this.scrollPositions = new Map()),
      (this.removeScrollListeners = null),
      (this.onElementScroll = t => {
        this.handleScroll(t.target);
      }),
      (this.onWindowScroll = () => {
        this.handleScroll(window);
      }),
      (this.updatePoint = () => {
        if (!this.lastMoveEvent || !this.lastMoveEventInfo) return;
        const t = fa(this.lastMoveEventInfo, this.history),
          e = null !== this.startEvent,
          n =
            (function (t, e) {
              const n = ha(t.x, e.x),
                i = ha(t.y, e.y);
              return Math.sqrt(n ** 2 + i ** 2);
            })(t.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
        if (!e && !n) return;
        const { point: i } = t,
          { timestamp: s } = Q;
        this.history.push({ ...i, timestamp: s });
        const { onStart: o, onMove: r } = this.handlers;
        (e || (o && o(this.lastMoveEvent, t), (this.startEvent = this.lastMoveEvent)),
          r && r(this.lastMoveEvent, t));
      }),
      (this.handlePointerMove = (t, e) => {
        ((this.lastMoveEvent = t),
          (this.lastMoveEventInfo = pa(e, this.transformPagePoint)),
          Z.update(this.updatePoint, !0));
      }),
      (this.handlePointerUp = (t, e) => {
        this.end();
        const { onEnd: n, onSessionEnd: i, resumeAnimation: s } = this.handlers;
        if (
          ((!this.dragSnapToOrigin && this.startEvent) || (s && s()),
          !this.lastMoveEvent || !this.lastMoveEventInfo)
        )
          return;
        const o = fa(
          'pointercancel' === t.type ? this.lastMoveEventInfo : pa(e, this.transformPagePoint),
          this.history
        );
        (this.startEvent && n && n(t, o), i && i(t, o));
      }),
      !Ti(t))
    )
      return;
    ((this.dragSnapToOrigin = s),
      (this.handlers = e),
      (this.transformPagePoint = n),
      (this.distanceThreshold = o),
      (this.contextWindow = i || window));
    const a = pa(aa(t), this.transformPagePoint),
      { point: l } = a,
      { timestamp: c } = Q;
    this.history = [{ ...l, timestamp: c }];
    const { onSessionStart: h } = e;
    (h && h(t, fa(a, this.history)),
      (this.removeListeners = b(
        la(this.contextWindow, 'pointermove', this.handlePointerMove),
        la(this.contextWindow, 'pointerup', this.handlePointerUp),
        la(this.contextWindow, 'pointercancel', this.handlePointerUp)
      )),
      r && this.startScrollTracking(r));
  }
  startScrollTracking(t) {
    let e = t.parentElement;
    for (; e; ) {
      const t = getComputedStyle(e);
      ((ua.has(t.overflowX) || ua.has(t.overflowY)) &&
        this.scrollPositions.set(e, { x: e.scrollLeft, y: e.scrollTop }),
        (e = e.parentElement));
    }
    (this.scrollPositions.set(window, { x: window.scrollX, y: window.scrollY }),
      window.addEventListener('scroll', this.onElementScroll, { capture: !0, passive: !0 }),
      window.addEventListener('scroll', this.onWindowScroll, { passive: !0 }),
      (this.removeScrollListeners = () => {
        (window.removeEventListener('scroll', this.onElementScroll, { capture: !0 }),
          window.removeEventListener('scroll', this.onWindowScroll));
      }));
  }
  handleScroll(t) {
    const e = this.scrollPositions.get(t);
    if (!e) return;
    const n = t === window,
      i = n ? { x: window.scrollX, y: window.scrollY } : { x: t.scrollLeft, y: t.scrollTop },
      s = i.x - e.x,
      o = i.y - e.y;
    (0 === s && 0 === o) ||
      (n
        ? this.lastMoveEventInfo &&
          ((this.lastMoveEventInfo.point.x += s), (this.lastMoveEventInfo.point.y += o))
        : this.history.length > 0 && ((this.history[0].x -= s), (this.history[0].y -= o)),
      this.scrollPositions.set(t, i),
      Z.update(this.updatePoint, !0));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    (this.removeListeners && this.removeListeners(),
      this.removeScrollListeners && this.removeScrollListeners(),
      this.scrollPositions.clear(),
      J(this.updatePoint));
  }
}
function pa(t, e) {
  return e ? { point: e(t.point) } : t;
}
function ma(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function fa({ point: t }, e) {
  return { point: t, delta: ma(t, ga(e)), offset: ma(t, ya(e)), velocity: va(e, 0.1) };
}
function ya(t) {
  return t[0];
}
function ga(t) {
  return t[t.length - 1];
}
function va(t, e) {
  if (t.length < 2) return { x: 0, y: 0 };
  let n = t.length - 1,
    i = null;
  const s = ga(t);
  for (; n >= 0 && ((i = t[n]), !(s.timestamp - i.timestamp > C(e))); ) n--;
  if (!i) return { x: 0, y: 0 };
  const o = V(s.timestamp - i.timestamp);
  if (0 === o) return { x: 0, y: 0 };
  const r = { x: (s.x - i.x) / o, y: (s.y - i.y) / o };
  return (r.x === 1 / 0 && (r.x = 0), r.y === 1 / 0 && (r.y = 0), r);
}
function xa(t, e, n) {
  return {
    min: void 0 !== e ? t.min + e : void 0,
    max: void 0 !== n ? t.max + n - (t.max - t.min) : void 0,
  };
}
function wa(t, e) {
  let n = e.min - t.min,
    i = e.max - t.max;
  return (e.max - e.min < t.max - t.min && ([n, i] = [i, n]), { min: n, max: i });
}
const ka = 0.35;
function Ta(t, e, n) {
  return { min: Ma(t, e), max: Ma(t, n) };
}
function Ma(t, e) {
  return 'number' == typeof t ? t : t[e] || 0;
}
const Sa = new WeakMap();
class Pa {
  constructor(t) {
    ((this.openDragLock = null),
      (this.isDragging = !1),
      (this.currentDirection = null),
      (this.originPoint = { x: 0, y: 0 }),
      (this.constraints = !1),
      (this.hasMutatedConstraints = !1),
      (this.elastic = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } }),
      (this.latestPointerEvent = null),
      (this.latestPanInfo = null),
      (this.visualElement = t));
  }
  start(t, { snapToCursor: e = !1, distanceThreshold: n } = {}) {
    const { presenceContext: i } = this.visualElement;
    if (i && !1 === i.isPresent) return;
    const { dragSnapToOrigin: s } = this.getProps();
    this.panSession = new da(
      t,
      {
        onSessionStart: t => {
          e ? (this.stopAnimation(), this.snapToCursor(aa(t).point)) : this.pauseAnimation();
        },
        onStart: (t, e) => {
          this.stopAnimation();
          const { drag: n, dragPropagation: i, onDragStart: s } = this.getProps();
          if (
            n &&
            !i &&
            (this.openDragLock && this.openDragLock(),
            (this.openDragLock =
              'x' === (o = n) || 'y' === o
                ? gi[o]
                  ? null
                  : ((gi[o] = !0),
                    () => {
                      gi[o] = !1;
                    })
                : gi.x || gi.y
                  ? null
                  : ((gi.x = gi.y = !0),
                    () => {
                      gi.x = gi.y = !1;
                    })),
            !this.openDragLock)
          )
            return;
          var o;
          ((this.latestPointerEvent = t),
            (this.latestPanInfo = e),
            (this.isDragging = !0),
            (this.currentDirection = null),
            this.resolveConstraints(),
            this.visualElement.projection &&
              ((this.visualElement.projection.isAnimationBlocked = !0),
              (this.visualElement.projection.target = void 0)),
            Mo(t => {
              let e = this.getAxisMotionValue(t).get() || 0;
              if (Mt.test(e)) {
                const { projection: n } = this.visualElement;
                if (n && n.layout) {
                  const i = n.layout.layoutBox[t];
                  if (i) {
                    e = eo(i) * (parseFloat(e) / 100);
                  }
                }
              }
              this.originPoint[t] = e;
            }),
            s && Z.postRender(() => s(t, e)),
            qn(this.visualElement, 'transform'));
          const { animationState: r } = this.visualElement;
          r && r.setActive('whileDrag', !0);
        },
        onMove: (t, e) => {
          ((this.latestPointerEvent = t), (this.latestPanInfo = e));
          const {
            dragPropagation: n,
            dragDirectionLock: i,
            onDirectionLock: s,
            onDrag: o,
          } = this.getProps();
          if (!n && !this.openDragLock) return;
          const { offset: r } = e;
          if (i && null === this.currentDirection)
            return (
              (this.currentDirection = (function (t, e = 10) {
                let n = null;
                Math.abs(t.y) > e ? (n = 'y') : Math.abs(t.x) > e && (n = 'x');
                return n;
              })(r)),
              void (null !== this.currentDirection && s && s(this.currentDirection))
            );
          (this.updateAxis('x', e.point, r),
            this.updateAxis('y', e.point, r),
            this.visualElement.render(),
            o && o(t, e));
        },
        onSessionEnd: (t, e) => {
          ((this.latestPointerEvent = t),
            (this.latestPanInfo = e),
            this.stop(t, e),
            (this.latestPointerEvent = null),
            (this.latestPanInfo = null));
        },
        resumeAnimation: () =>
          Mo(
            t =>
              'paused' === this.getAnimationState(t) && this.getAxisMotionValue(t).animation?.play()
          ),
      },
      {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin: s,
        distanceThreshold: n,
        contextWindow: ca(this.visualElement),
        element: this.visualElement.current,
      }
    );
  }
  stop(t, e) {
    const n = t || this.latestPointerEvent,
      i = e || this.latestPanInfo,
      s = this.isDragging;
    if ((this.cancel(), !s || !i || !n)) return;
    const { velocity: o } = i;
    this.startAnimation(o);
    const { onDragEnd: r } = this.getProps();
    r && Z.postRender(() => r(n, i));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: t, animationState: e } = this.visualElement;
    (t && (t.isAnimationBlocked = !1),
      this.panSession && this.panSession.end(),
      (this.panSession = void 0));
    const { dragPropagation: n } = this.getProps();
    (!n && this.openDragLock && (this.openDragLock(), (this.openDragLock = null)),
      e && e.setActive('whileDrag', !1));
  }
  updateAxis(t, e, n) {
    const { drag: i } = this.getProps();
    if (!n || !ba(t, i, this.currentDirection)) return;
    const s = this.getAxisMotionValue(t);
    let o = this.originPoint[t] + n[t];
    (this.constraints &&
      this.constraints[t] &&
      (o = (function (t, { min: e, max: n }, i) {
        return (
          void 0 !== e && t < e
            ? (t = i ? Wt(e, t, i.min) : Math.max(t, e))
            : void 0 !== n && t > n && (t = i ? Wt(n, t, i.max) : Math.min(t, n)),
          t
        );
      })(o, this.constraints[t], this.elastic[t])),
      s.set(o));
  }
  resolveConstraints() {
    const { dragConstraints: t, dragElastic: e } = this.getProps(),
      n =
        this.visualElement.projection && !this.visualElement.projection.layout
          ? this.visualElement.projection.measure(!1)
          : this.visualElement.projection?.layout,
      i = this.constraints;
    (t && Jr(t)
      ? this.constraints || (this.constraints = this.resolveRefConstraints())
      : (this.constraints =
          !(!t || !n) &&
          (function (t, { top: e, left: n, bottom: i, right: s }) {
            return { x: xa(t.x, n, s), y: xa(t.y, e, i) };
          })(n.layoutBox, t)),
      (this.elastic = (function (t = ka) {
        return (
          !1 === t ? (t = 0) : !0 === t && (t = ka),
          { x: Ta(t, 'left', 'right'), y: Ta(t, 'top', 'bottom') }
        );
      })(e)),
      i !== this.constraints &&
        n &&
        this.constraints &&
        !this.hasMutatedConstraints &&
        Mo(t => {
          !1 !== this.constraints &&
            this.getAxisMotionValue(t) &&
            (this.constraints[t] = (function (t, e) {
              const n = {};
              return (
                void 0 !== e.min && (n.min = e.min - t.min),
                void 0 !== e.max && (n.max = e.max - t.min),
                n
              );
            })(n.layoutBox[t], this.constraints[t]));
        }));
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: e } = this.getProps();
    if (!t || !Jr(t)) return !1;
    const n = t.current,
      { projection: i } = this.visualElement;
    if (!i || !i.layout) return !1;
    const s = (function (t, e, n) {
      const i = Ps(t, n),
        { scroll: s } = e;
      return (s && (Ts(i.x, s.offset.x), Ts(i.y, s.offset.y)), i);
    })(n, i.root, this.visualElement.getTransformPagePoint());
    let o = (function (t, e) {
      return { x: wa(t.x, e.x), y: wa(t.y, e.y) };
    })(i.layout.layoutBox, s);
    if (e) {
      const t = e(
        (function ({ x: t, y: e }) {
          return { top: e.min, right: t.max, bottom: e.max, left: t.min };
        })(o)
      );
      ((this.hasMutatedConstraints = !!t), t && (o = hs(t)));
    }
    return o;
  }
  startAnimation(t) {
    const {
        drag: e,
        dragMomentum: n,
        dragElastic: i,
        dragTransition: s,
        dragSnapToOrigin: o,
        onDragTransitionEnd: r,
      } = this.getProps(),
      a = this.constraints || {},
      l = Mo(r => {
        if (!ba(r, e, this.currentDirection)) return;
        let l = (a && a[r]) || {};
        o && (l = { min: 0, max: 0 });
        const c = i ? 200 : 1e6,
          h = i ? 40 : 1e7,
          u = {
            type: 'inertia',
            velocity: n ? t[r] : 0,
            bounceStiffness: c,
            bounceDamping: h,
            timeConstant: 750,
            restDelta: 1,
            restSpeed: 10,
            ...s,
            ...l,
          };
        return this.startAxisValueAnimation(r, u);
      });
    return Promise.all(l).then(r);
  }
  startAxisValueAnimation(t, e) {
    const n = this.getAxisMotionValue(t);
    return (qn(this.visualElement, t), n.start(Rn(t, n, 0, e, this.visualElement, !1)));
  }
  stopAnimation() {
    Mo(t => this.getAxisMotionValue(t).stop());
  }
  pauseAnimation() {
    Mo(t => this.getAxisMotionValue(t).animation?.pause());
  }
  getAnimationState(t) {
    return this.getAxisMotionValue(t).animation?.state;
  }
  getAxisMotionValue(t) {
    const e = `_drag${t.toUpperCase()}`,
      n = this.visualElement.getProps(),
      i = n[e];
    return i || this.visualElement.getValue(t, (n.initial ? n.initial[t] : void 0) || 0);
  }
  snapToCursor(t) {
    Mo(e => {
      const { drag: n } = this.getProps();
      if (!ba(e, n, this.currentDirection)) return;
      const { projection: i } = this.visualElement,
        s = this.getAxisMotionValue(e);
      if (i && i.layout) {
        const { min: n, max: o } = i.layout.layoutBox[e],
          r = s.get() || 0;
        s.set(t[e] - Wt(n, o, 0.5) + r);
      }
    });
  }
  scalePositionWithinConstraints() {
    if (!this.visualElement.current) return;
    const { drag: t, dragConstraints: e } = this.getProps(),
      { projection: n } = this.visualElement;
    if (!Jr(e) || !n || !this.constraints) return;
    this.stopAnimation();
    const i = { x: 0, y: 0 };
    Mo(t => {
      const e = this.getAxisMotionValue(t);
      if (e && !1 !== this.constraints) {
        const n = e.get();
        i[t] = (function (t, e) {
          let n = 0.5;
          const i = eo(t),
            s = eo(e);
          return (
            s > i ? (n = E(e.min, e.max - i, t.min)) : i > s && (n = E(t.min, t.max - s, e.min)),
            v(0, 1, n)
          );
        })({ min: n, max: n }, this.constraints[t]);
      }
    });
    const { transformTemplate: s } = this.visualElement.getProps();
    ((this.visualElement.current.style.transform = s ? s({}, '') : 'none'),
      n.root && n.root.updateScroll(),
      n.updateLayout(),
      this.resolveConstraints(),
      Mo(e => {
        if (!ba(e, t, null)) return;
        const n = this.getAxisMotionValue(e),
          { min: s, max: o } = this.constraints[e];
        n.set(Wt(s, o, i[e]));
      }));
  }
  addListeners() {
    if (!this.visualElement.current) return;
    Sa.set(this.visualElement, this);
    const t = la(this.visualElement.current, 'pointerdown', t => {
        const { drag: e, dragListener: n = !0 } = this.getProps();
        e && n && !Si(t.target) && this.start(t);
      }),
      e = () => {
        const { dragConstraints: t } = this.getProps();
        Jr(t) && t.current && (this.constraints = this.resolveRefConstraints());
      },
      { projection: n } = this.visualElement,
      i = n.addEventListener('measure', e);
    (n && !n.layout && (n.root && n.root.updateScroll(), n.updateLayout()), Z.read(e));
    const s = Do(window, 'resize', () => this.scalePositionWithinConstraints()),
      o = n.addEventListener('didUpdate', ({ delta: t, hasLayoutChanged: e }) => {
        this.isDragging &&
          e &&
          (Mo(e => {
            const n = this.getAxisMotionValue(e);
            n && ((this.originPoint[e] += t[e].translate), n.set(n.get() + t[e].translate));
          }),
          this.visualElement.render());
      });
    return () => {
      (s(), t(), i(), o && o());
    };
  }
  getProps() {
    const t = this.visualElement.getProps(),
      {
        drag: e = !1,
        dragDirectionLock: n = !1,
        dragPropagation: i = !1,
        dragConstraints: s = !1,
        dragElastic: o = ka,
        dragMomentum: r = !0,
      } = t;
    return {
      ...t,
      drag: e,
      dragDirectionLock: n,
      dragPropagation: i,
      dragConstraints: s,
      dragElastic: o,
      dragMomentum: r,
    };
  }
}
function ba(t, e, n) {
  return !((!0 !== e && e !== t) || (null !== n && n !== t));
}
const Ea = t => (e, n) => {
  t && Z.postRender(() => t(e, n));
};
let Aa = !1;
class Ca extends t.Component {
  componentDidMount() {
    const { visualElement: t, layoutGroup: e, switchLayoutGroup: n, layoutId: i } = this.props,
      { projection: s } = t;
    (s &&
      (e.group && e.group.add(s),
      n && n.register && i && n.register(s),
      Aa && s.root.didUpdate(),
      s.addEventListener('animationComplete', () => {
        this.safeToRemove();
      }),
      s.setOptions({ ...s.options, onExitComplete: () => this.safeToRemove() })),
      (Oo.hasEverUpdated = !0));
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: e, visualElement: n, drag: i, isPresent: s } = this.props,
      { projection: o } = n;
    return o
      ? ((o.isPresent = s),
        (Aa = !0),
        i || t.layoutDependency !== e || void 0 === e || t.isPresent !== s
          ? o.willUpdate()
          : this.safeToRemove(),
        t.isPresent !== s &&
          (s
            ? o.promote()
            : o.relegate() ||
              Z.postRender(() => {
                const t = o.getStack();
                (t && t.members.length) || this.safeToRemove();
              })),
        null)
      : null;
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t &&
      (t.root.didUpdate(),
      yi.postRender(() => {
        !t.currentAnimation && t.isLead() && this.safeToRemove();
      }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: e, switchLayoutGroup: n } = this.props,
      { projection: i } = t;
    ((Aa = !0),
      i &&
        (i.scheduleCheckAfterUnmount(),
        e && e.group && e.group.remove(i),
        n && n.deregister && n.deregister(i)));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function Va(e) {
  const [n, i] = kr(),
    s = t.useContext(u);
  return h.jsx(Ca, {
    ...e,
    layoutGroup: s,
    switchLayoutGroup: t.useContext(Zr),
    isPresent: n,
    safeToRemove: i,
  });
}
const La = {
  pan: {
    Feature: class extends ls {
      constructor() {
        (super(...arguments), (this.removePointerDownListener = S));
      }
      onPointerDown(t) {
        this.session = new da(t, this.createPanHandlers(), {
          transformPagePoint: this.node.getTransformPagePoint(),
          contextWindow: ca(this.node),
        });
      }
      createPanHandlers() {
        const { onPanSessionStart: t, onPanStart: e, onPan: n, onPanEnd: i } = this.node.getProps();
        return {
          onSessionStart: Ea(t),
          onStart: Ea(e),
          onMove: n,
          onEnd: (t, e) => {
            (delete this.session, i && Z.postRender(() => i(t, e)));
          },
        };
      }
      mount() {
        this.removePointerDownListener = la(this.node.current, 'pointerdown', t =>
          this.onPointerDown(t)
        );
      }
      update() {
        this.session && this.session.updateHandlers(this.createPanHandlers());
      }
      unmount() {
        (this.removePointerDownListener(), this.session && this.session.end());
      }
    },
  },
  drag: {
    Feature: class extends ls {
      constructor(t) {
        (super(t),
          (this.removeGroupControls = S),
          (this.removeListeners = S),
          (this.controls = new Pa(t)));
      }
      mount() {
        const { dragControls: t } = this.node.getProps();
        (t && (this.removeGroupControls = t.subscribe(this.controls)),
          (this.removeListeners = this.controls.addListeners() || S));
      }
      update() {
        const { dragControls: t } = this.node.getProps(),
          { dragControls: e } = this.node.prevProps || {};
        t !== e &&
          (this.removeGroupControls(),
          t && (this.removeGroupControls = t.subscribe(this.controls)));
      }
      unmount() {
        (this.removeGroupControls(), this.removeListeners());
      }
    },
    ProjectionNode: pr,
    MeasureLayout: Va,
  },
};
function Da(t, e, n) {
  const { props: i } = t;
  t.animationState && i.whileHover && t.animationState.setActive('whileHover', 'Start' === n);
  const s = i['onHover' + n];
  s && Z.postRender(() => s(e, aa(e)));
}
function Ra(t, e, n) {
  const { props: i } = t;
  if (t.current instanceof HTMLButtonElement && t.current.disabled) return;
  t.animationState && i.whileTap && t.animationState.setActive('whileTap', 'Start' === n);
  const s = i['onTap' + ('End' === n ? '' : n)];
  s && Z.postRender(() => s(e, aa(e)));
}
const ja = new WeakMap(),
  Ba = new WeakMap(),
  Fa = t => {
    const e = ja.get(t.target);
    e && e(t);
  },
  Oa = t => {
    t.forEach(Fa);
  };
function Ia(t, e, n) {
  const i = (function ({ root: t, ...e }) {
    const n = t || document;
    Ba.has(n) || Ba.set(n, {});
    const i = Ba.get(n),
      s = JSON.stringify(e);
    return (i[s] || (i[s] = new IntersectionObserver(Oa, { root: t, ...e })), i[s]);
  })(e);
  return (
    ja.set(t, n),
    i.observe(t),
    () => {
      (ja.delete(t), i.unobserve(t));
    }
  );
}
const za = { some: 0, all: 1 };
const Ua = ia(
    {
      ...ra,
      ...{
        inView: {
          Feature: class extends ls {
            constructor() {
              (super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1));
            }
            startObserver() {
              this.unmount();
              const { viewport: t = {} } = this.node.getProps(),
                { root: e, margin: n, amount: i = 'some', once: s } = t,
                o = {
                  root: e ? e.current : void 0,
                  rootMargin: n,
                  threshold: 'number' == typeof i ? i : za[i],
                };
              return Ia(this.node.current, o, t => {
                const { isIntersecting: e } = t;
                if (this.isInView === e) return;
                if (((this.isInView = e), s && !e && this.hasEnteredView)) return;
                (e && (this.hasEnteredView = !0),
                  this.node.animationState && this.node.animationState.setActive('whileInView', e));
                const { onViewportEnter: n, onViewportLeave: i } = this.node.getProps(),
                  o = e ? n : i;
                o && o(t);
              });
            }
            mount() {
              this.startObserver();
            }
            update() {
              if ('undefined' == typeof IntersectionObserver) return;
              const { props: t, prevProps: e } = this.node;
              ['amount', 'margin', 'root'].some(
                (function ({ viewport: t = {} }, { viewport: e = {} } = {}) {
                  return n => t[n] !== e[n];
                })(t, e)
              ) && this.startObserver();
            }
            unmount() {}
          },
        },
        tap: {
          Feature: class extends ls {
            mount() {
              const { current: t } = this.node;
              t &&
                (this.unmount = Ci(
                  t,
                  (t, e) => (
                    Ra(this.node, e, 'Start'),
                    (t, { success: e }) => Ra(this.node, t, e ? 'End' : 'Cancel')
                  ),
                  { useGlobalTarget: this.node.props.globalTapTarget }
                ));
            }
            unmount() {}
          },
        },
        focus: {
          Feature: class extends ls {
            constructor() {
              (super(...arguments), (this.isActive = !1));
            }
            onFocus() {
              let t = !1;
              try {
                t = this.node.current.matches(':focus-visible');
              } catch (e) {
                t = !0;
              }
              t &&
                this.node.animationState &&
                (this.node.animationState.setActive('whileFocus', !0), (this.isActive = !0));
            }
            onBlur() {
              this.isActive &&
                this.node.animationState &&
                (this.node.animationState.setActive('whileFocus', !1), (this.isActive = !1));
            }
            mount() {
              this.unmount = b(
                Do(this.node.current, 'focus', () => this.onFocus()),
                Do(this.node.current, 'blur', () => this.onBlur())
              );
            }
            unmount() {}
          },
        },
        hover: {
          Feature: class extends ls {
            mount() {
              const { current: t } = this.node;
              t &&
                (this.unmount = (function (t, e, n = {}) {
                  const [i, s, o] = xi(t, n),
                    r = t => {
                      if (!wi(t)) return;
                      const { target: n } = t,
                        i = e(n, t);
                      if ('function' != typeof i || !n) return;
                      const o = t => {
                        wi(t) && (i(t), n.removeEventListener('pointerleave', o));
                      };
                      n.addEventListener('pointerleave', o, s);
                    };
                  return (
                    i.forEach(t => {
                      t.addEventListener('pointerenter', r, s);
                    }),
                    o
                  );
                })(t, (t, e) => (Da(this.node, e, 'Start'), t => Da(this.node, t, 'End'))));
            }
            unmount() {}
          },
        },
      },
      ...La,
      ...{ layout: { ProjectionNode: pr, MeasureLayout: Va } },
    },
    sa
  ),
  Wa = { x: { length: 'Width', position: 'Left' }, y: { length: 'Height', position: 'Top' } };
function Na(t, e, n, i) {
  const s = n[e],
    { length: o, position: r } = Wa[e],
    a = s.current,
    l = n.time;
  ((s.current = t[`scroll${r}`]),
    (s.scrollLength = t[`scroll${o}`] - t[`client${o}`]),
    (s.offset.length = 0),
    (s.offset[0] = 0),
    (s.offset[1] = s.scrollLength),
    (s.progress = E(0, s.scrollLength, s.current)));
  const c = i - l;
  s.velocity = c > 50 ? 0 : L(s.current - a, c);
}
const Ha = { start: 0, center: 0.5, end: 1 };
function $a(t, e, n = 0) {
  let i = 0;
  if ((t in Ha && (t = Ha[t]), 'string' == typeof t)) {
    const e = parseFloat(t);
    t.endsWith('px')
      ? (i = e)
      : t.endsWith('%')
        ? (t = e / 100)
        : t.endsWith('vw')
          ? (i = (e / 100) * document.documentElement.clientWidth)
          : t.endsWith('vh')
            ? (i = (e / 100) * document.documentElement.clientHeight)
            : (t = e);
  }
  return ('number' == typeof t && (i = e * t), n + i);
}
const qa = [0, 0];
function Xa(t, e, n, i) {
  let s = Array.isArray(t) ? t : qa,
    o = 0,
    r = 0;
  return (
    'number' == typeof t
      ? (s = [t, t])
      : 'string' == typeof t &&
        (s = (t = t.trim()).includes(' ') ? t.split(' ') : [t, Ha[t] ? t : '0']),
    (o = $a(s[0], n, i)),
    (r = $a(s[1], e)),
    o - r
  );
}
const Ya = {
    All: [
      [0, 0],
      [1, 1],
    ],
  },
  Ka = { x: 0, y: 0 };
function Ga(t, e, n) {
  const { offset: i = Ya.All } = n,
    { target: s = t, axis: o = 'y' } = n,
    r = 'y' === o ? 'height' : 'width',
    a =
      s !== t
        ? (function (t, e) {
            const n = { x: 0, y: 0 };
            let i = t;
            for (; i && i !== e; )
              if (fi(i)) ((n.x += i.offsetLeft), (n.y += i.offsetTop), (i = i.offsetParent));
              else if ('svg' === i.tagName) {
                const t = i.getBoundingClientRect();
                i = i.parentElement;
                const e = i.getBoundingClientRect();
                ((n.x += t.left - e.left), (n.y += t.top - e.top));
              } else {
                if (!(i instanceof SVGGraphicsElement)) break;
                {
                  const { x: t, y: e } = i.getBBox();
                  ((n.x += t), (n.y += e));
                  let s = null,
                    o = i.parentNode;
                  for (; !s; ) ('svg' === o.tagName && (s = o), (o = i.parentNode));
                  i = s;
                }
              }
            return n;
          })(s, t)
        : Ka,
    l =
      s === t
        ? { width: t.scrollWidth, height: t.scrollHeight }
        : (function (t) {
            return 'getBBox' in t && 'svg' !== t.tagName
              ? t.getBBox()
              : { width: t.clientWidth, height: t.clientHeight };
          })(s),
    c = { width: t.clientWidth, height: t.clientHeight };
  e[o].offset.length = 0;
  let h = !e[o].interpolate;
  const u = i.length;
  for (let d = 0; d < u; d++) {
    const t = Xa(i[d], c[r], l[r], a[o]);
    (h || t === e[o].interpolatorOffsets[d] || (h = !0), (e[o].offset[d] = t));
  }
  (h &&
    ((e[o].interpolate = be(e[o].offset, Ee(i), { clamp: !1 })),
    (e[o].interpolatorOffsets = [...e[o].offset])),
    (e[o].progress = v(0, 1, e[o].interpolate(e[o].current))));
}
function _a(t, e, n, i = {}) {
  return {
    measure: e => {
      (!(function (t, e = t, n) {
        if (((n.x.targetOffset = 0), (n.y.targetOffset = 0), e !== t)) {
          let i = e;
          for (; i && i !== t; )
            ((n.x.targetOffset += i.offsetLeft),
              (n.y.targetOffset += i.offsetTop),
              (i = i.offsetParent));
        }
        ((n.x.targetLength = e === t ? e.scrollWidth : e.clientWidth),
          (n.y.targetLength = e === t ? e.scrollHeight : e.clientHeight),
          (n.x.containerLength = t.clientWidth),
          (n.y.containerLength = t.clientHeight));
      })(t, i.target, n),
        (function (t, e, n) {
          (Na(t, 'x', e, n), Na(t, 'y', e, n), (e.time = n));
        })(t, n, e),
        (i.offset || i.target) && Ga(t, n, i));
    },
    notify: () => e(n),
  };
}
const Za = new WeakMap(),
  Ja = new WeakMap(),
  Qa = new WeakMap(),
  tl = t => (t === document.scrollingElement ? window : t);
function el(t, { container: e = document.scrollingElement, ...n } = {}) {
  if (!e) return S;
  let i = Qa.get(e);
  i || ((i = new Set()), Qa.set(e, i));
  const s = _a(
    e,
    t,
    {
      time: 0,
      x: {
        current: 0,
        offset: [],
        progress: 0,
        scrollLength: 0,
        targetOffset: 0,
        targetLength: 0,
        containerLength: 0,
        velocity: 0,
      },
      y: {
        current: 0,
        offset: [],
        progress: 0,
        scrollLength: 0,
        targetOffset: 0,
        targetLength: 0,
        containerLength: 0,
        velocity: 0,
      },
    },
    n
  );
  if ((i.add(s), !Za.has(e))) {
    const t = () => {
        for (const t of i) t.measure(Q.timestamp);
        Z.preUpdate(n);
      },
      n = () => {
        for (const t of i) t.notify();
      },
      s = () => Z.read(t);
    Za.set(e, s);
    const a = tl(e);
    (window.addEventListener('resize', s, { passive: !0 }),
      e !== document.documentElement &&
        Ja.set(e, ((r = s), 'function' == typeof (o = e) ? Wi(o) : Ii(o, r))),
      a.addEventListener('scroll', s, { passive: !0 }),
      s());
  }
  var o, r;
  const a = Za.get(e);
  return (
    Z.read(a, !1, !0),
    () => {
      J(a);
      const t = Qa.get(e);
      if (!t) return;
      if ((t.delete(s), t.size)) return;
      const n = Za.get(e);
      (Za.delete(e),
        n &&
          (tl(e).removeEventListener('scroll', n),
          Ja.get(e)?.(),
          window.removeEventListener('resize', n)));
    }
  );
}
const nl = new Map();
function il({ source: t, container: e, ...n }) {
  const { axis: i } = n;
  t && (e = t);
  const s = nl.get(e) ?? new Map();
  nl.set(e, s);
  const o = n.target ?? 'self',
    r = s.get(o) ?? {},
    a = i + (n.offset ?? []).join(',');
  return (
    r[a] ||
      (r[a] =
        !n.target && rn()
          ? new ScrollTimeline({ source: e, axis: i })
          : (function (t) {
              const e = { value: 0 },
                n = el(n => {
                  e.value = 100 * n[t.axis].progress;
                }, t);
              return { currentTime: e, cancel: n };
            })({ container: e, ...n })),
    r[a]
  );
}
function sl(t, { axis: e = 'y', container: n = document.scrollingElement, ...i } = {}) {
  if (!n) return S;
  const s = { axis: e, container: n, ...i };
  return 'function' == typeof t
    ? (function (t, e) {
        return (function (t) {
          return 2 === t.length;
        })(t)
          ? el(n => {
              t(n[e.axis].progress, n);
            }, e)
          : Ni(t, il(e));
      })(t, s)
    : (function (t, e) {
        const n = il(e);
        return t.attachTimeline({
          timeline: e.target ? void 0 : n,
          observe: t => (
            t.pause(),
            Ni(e => {
              t.time = t.iterationDuration * e;
            }, n)
          ),
        });
      })(t, s);
}
const ol = () => ({
    scrollX: On(0),
    scrollY: On(0),
    scrollXProgress: On(0),
    scrollYProgress: On(0),
  }),
  rl = t => !!t && !t.current;
function al({ container: e, target: n, ...i } = {}) {
  const s = d(ol),
    o = t.useRef(null),
    r = t.useRef(!1),
    a = t.useCallback(
      () => (
        (o.current = sl(
          (t, { x: e, y: n }) => {
            (s.scrollX.set(e.current),
              s.scrollXProgress.set(e.progress),
              s.scrollY.set(n.current),
              s.scrollYProgress.set(n.progress));
          },
          { ...i, container: e?.current || void 0, target: n?.current || void 0 }
        )),
        () => {
          o.current?.();
        }
      ),
      [e, n, JSON.stringify(i.offset)]
    );
  return (
    m(() => ((r.current = !1), rl(e) || rl(n) ? void (r.current = !0) : a()), [a]),
    t.useEffect(() => (r.current ? (rl(e), rl(n), a()) : void 0), [a]),
    s
  );
}
function ll(e) {
  const n = d(() => On(e)),
    { isStatic: i } = t.useContext(mr);
  if (i) {
    const [, i] = t.useState(e);
    t.useEffect(() => n.on('change', i), []);
  }
  return n;
}
function cl(t, e) {
  const n = ll(e()),
    i = () => n.set(e());
  return (
    i(),
    m(() => {
      const e = () => Z.preRender(i, !1, !0),
        n = t.map(t => t.on('change', e));
      return () => {
        (n.forEach(t => t()), J(i));
      };
    }),
    n
  );
}
function hl(t, ...e) {
  const n = t.length;
  return cl(e.filter($n), function () {
    let i = '';
    for (let s = 0; s < n; s++) {
      i += t[s];
      const n = e[s];
      n && (i += $n(n) ? n.get() : n);
    }
    return i;
  });
}
function ul(t, e, n, i) {
  if ('function' == typeof t)
    return (function (t) {
      ((Bn.current = []), t());
      const e = cl(Bn.current, t);
      return ((Bn.current = void 0), e);
    })(t);
  if (void 0 !== n && !Array.isArray(n) && 'function' != typeof e)
    return (function (t, e, n, i) {
      const s = d(() => Object.keys(n)),
        o = d(() => ({}));
      for (const r of s) o[r] = ul(t, e, n[r], i);
      return o;
    })(t, e, n, i);
  const s =
    'function' == typeof e
      ? e
      : (function (...t) {
          const e = !Array.isArray(t[0]),
            n = e ? 0 : -1,
            i = t[0 + n],
            s = be(t[1 + n], t[2 + n], t[3 + n]);
          return e ? s(i) : s;
        })(e, n, i);
  return Array.isArray(t) ? dl(t, s) : dl([t], ([t]) => s(t));
}
function dl(t, e) {
  const n = d(() => []);
  return cl(t, () => {
    n.length = 0;
    const i = t.length;
    for (let e = 0; e < i; e++) n[e] = t[e].get();
    return e(n);
  });
}
function pl(e, n = {}) {
  const { isStatic: i } = t.useContext(mr),
    s = () => ($n(e) ? e.get() : e);
  if (i) return ul(s);
  const o = ll(s());
  return (t.useInsertionEffect(() => Hi(o, e, n), [o, JSON.stringify(n)]), o);
}
const ml = { some: 0, all: 1 };
function fl(e, { root: n, margin: i, amount: s, once: o = !1, initial: r = !1 } = {}) {
  const [a, l] = t.useState(r);
  return (
    t.useEffect(() => {
      if (!e.current || (o && a)) return;
      const t = { root: (n && n.current) || void 0, margin: i, amount: s };
      return (function (t, e, { root: n, margin: i, amount: s = 'some' } = {}) {
        const o = pi(t),
          r = new WeakMap(),
          a = new IntersectionObserver(
            t => {
              t.forEach(t => {
                const n = r.get(t.target);
                if (t.isIntersecting !== Boolean(n))
                  if (t.isIntersecting) {
                    const n = e(t.target, t);
                    'function' == typeof n ? r.set(t.target, n) : a.unobserve(t.target);
                  } else 'function' == typeof n && (n(t), r.delete(t.target));
              });
            },
            { root: n, rootMargin: i, threshold: 'number' == typeof s ? s : ml[s] }
          );
        return (o.forEach(t => a.observe(t)), () => a.disconnect());
      })(e.current, () => (l(!0), o ? void 0 : () => l(!1)), t);
    }, [n, e, i, o, s]),
    a
  );
}
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const yl = (...t) =>
  t
    .filter((t, e, n) => Boolean(t) && '' !== t.trim() && n.indexOf(t) === e)
    .join(' ')
    .trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var gl = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const vl = t.forwardRef(
    (
      {
        color: e = 'currentColor',
        size: n = 24,
        strokeWidth: i = 2,
        absoluteStrokeWidth: s,
        className: o = '',
        children: r,
        iconNode: a,
        ...l
      },
      c
    ) =>
      t.createElement(
        'svg',
        {
          ref: c,
          ...gl,
          width: n,
          height: n,
          stroke: e,
          strokeWidth: s ? (24 * Number(i)) / Number(n) : i,
          className: yl('lucide', o),
          ...l,
        },
        [...a.map(([e, n]) => t.createElement(e, n)), ...(Array.isArray(r) ? r : [r])]
      )
  ),
  xl = (e, n) => {
    const i = t.forwardRef(({ className: i, ...s }, o) => {
      return t.createElement(vl, {
        ref: o,
        iconNode: n,
        className: yl(
          `lucide-${((r = e), r.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())}`,
          i
        ),
        ...s,
      });
      var r;
    });
    return ((i.displayName = `${e}`), i);
  },
  wl = xl('Activity', [
    [
      'path',
      {
        d: 'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2',
        key: '169zse',
      },
    ],
  ]),
  kl = xl('ArrowRight', [
    ['path', { d: 'M5 12h14', key: '1ays0h' }],
    ['path', { d: 'm12 5 7 7-7 7', key: 'xquz4c' }],
  ]),
  Tl = xl('Award', [
    [
      'path',
      {
        d: 'm15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526',
        key: '1yiouv',
      },
    ],
    ['circle', { cx: '12', cy: '8', r: '6', key: '1vp47v' }],
  ]),
  Ml = xl('Bell', [
    ['path', { d: 'M10.268 21a2 2 0 0 0 3.464 0', key: 'vwvbt9' }],
    [
      'path',
      {
        d: 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326',
        key: '11g9vi',
      },
    ],
  ]),
  Sl = xl('Bot', [
    ['path', { d: 'M12 8V4H8', key: 'hb8ula' }],
    ['rect', { width: '16', height: '12', x: '4', y: '8', rx: '2', key: 'enze0r' }],
    ['path', { d: 'M2 14h2', key: 'vft8re' }],
    ['path', { d: 'M20 14h2', key: '4cs60a' }],
    ['path', { d: 'M15 13v2', key: '1xurst' }],
    ['path', { d: 'M9 13v2', key: 'rq6x2g' }],
  ]),
  Pl = xl('Box', [
    [
      'path',
      {
        d: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
        key: 'hh9hay',
      },
    ],
    ['path', { d: 'm3.3 7 8.7 5 8.7-5', key: 'g66t2b' }],
    ['path', { d: 'M12 22V12', key: 'd0xqtd' }],
  ]),
  bl = xl('Brain', [
    [
      'path',
      {
        d: 'M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z',
        key: 'l5xja',
      },
    ],
    [
      'path',
      {
        d: 'M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z',
        key: 'ep3f8r',
      },
    ],
    ['path', { d: 'M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4', key: '1p4c4q' }],
    ['path', { d: 'M17.599 6.5a3 3 0 0 0 .399-1.375', key: 'tmeiqw' }],
    ['path', { d: 'M6.003 5.125A3 3 0 0 0 6.401 6.5', key: '105sqy' }],
    ['path', { d: 'M3.477 10.896a4 4 0 0 1 .585-.396', key: 'ql3yin' }],
    ['path', { d: 'M19.938 10.5a4 4 0 0 1 .585.396', key: '1qfode' }],
    ['path', { d: 'M6 18a4 4 0 0 1-1.967-.516', key: '2e4loj' }],
    ['path', { d: 'M19.967 17.484A4 4 0 0 1 18 18', key: '159ez6' }],
  ]),
  El = xl('Briefcase', [
    ['path', { d: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16', key: 'jecpp' }],
    ['rect', { width: '20', height: '14', x: '2', y: '6', rx: '2', key: 'i6l2r4' }],
  ]),
  Al = xl('Camera', [
    [
      'path',
      {
        d: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z',
        key: '1tc9qg',
      },
    ],
    ['circle', { cx: '12', cy: '13', r: '3', key: '1vg3eu' }],
  ]),
  Cl = xl('ChartColumn', [
    ['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16', key: 'c24i48' }],
    ['path', { d: 'M18 17V9', key: '2bz60n' }],
    ['path', { d: 'M13 17V5', key: '1frdt8' }],
    ['path', { d: 'M8 17v-3', key: '17ska0' }],
  ]),
  Vl = xl('ChartLine', [
    ['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16', key: 'c24i48' }],
    ['path', { d: 'm19 9-5 5-4-4-3 3', key: '2osh9i' }],
  ]),
  Ll = xl('Check', [['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }]]),
  Dl = xl('ChevronRight', [['path', { d: 'm9 18 6-6-6-6', key: 'mthhwq' }]]),
  Rl = xl('CircleAlert', [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['line', { x1: '12', x2: '12', y1: '8', y2: '12', key: '1pkeuh' }],
    ['line', { x1: '12', x2: '12.01', y1: '16', y2: '16', key: '4dfq90' }],
  ]),
  jl = xl('CircleCheckBig', [
    ['path', { d: 'M21.801 10A10 10 0 1 1 17 3.335', key: 'yps3ct' }],
    ['path', { d: 'm9 11 3 3L22 4', key: '1pflzl' }],
  ]),
  Bl = xl('CircleCheck', [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['path', { d: 'm9 12 2 2 4-4', key: 'dzmm74' }],
  ]),
  Fl = xl('CircleStop', [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['rect', { x: '9', y: '9', width: '6', height: '6', rx: '1', key: '1ssd4o' }],
  ]),
  Ol = xl('CircleX', [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['path', { d: 'm15 9-6 6', key: '1uzhvr' }],
    ['path', { d: 'm9 9 6 6', key: 'z0biqf' }],
  ]),
  Il = xl('Cpu', [
    ['rect', { width: '16', height: '16', x: '4', y: '4', rx: '2', key: '14l7u7' }],
    ['rect', { width: '6', height: '6', x: '9', y: '9', rx: '1', key: '5aljv4' }],
    ['path', { d: 'M15 2v2', key: '13l42r' }],
    ['path', { d: 'M15 20v2', key: '15mkzm' }],
    ['path', { d: 'M2 15h2', key: '1gxd5l' }],
    ['path', { d: 'M2 9h2', key: '1bbxkp' }],
    ['path', { d: 'M20 15h2', key: '19e6y8' }],
    ['path', { d: 'M20 9h2', key: '19tzq7' }],
    ['path', { d: 'M9 2v2', key: '165o2o' }],
    ['path', { d: 'M9 20v2', key: 'i2bqo8' }],
  ]),
  zl = xl('CreditCard', [
    ['rect', { width: '20', height: '14', x: '2', y: '5', rx: '2', key: 'ynyp8z' }],
    ['line', { x1: '2', x2: '22', y1: '10', y2: '10', key: '1b3vmo' }],
  ]),
  Ul = xl('Database', [
    ['ellipse', { cx: '12', cy: '5', rx: '9', ry: '3', key: 'msslwz' }],
    ['path', { d: 'M3 5V19A9 3 0 0 0 21 19V5', key: '1wlel7' }],
    ['path', { d: 'M3 12A9 3 0 0 0 21 12', key: 'mv7ke4' }],
  ]),
  Wl = xl('DollarSign', [
    ['line', { x1: '12', x2: '12', y1: '2', y2: '22', key: '7eqyqh' }],
    ['path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', key: '1b0p4s' }],
  ]),
  Nl = xl('ExternalLink', [
    ['path', { d: 'M15 3h6v6', key: '1q9fwt' }],
    ['path', { d: 'M10 14 21 3', key: 'gplh6r' }],
    ['path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6', key: 'a6xqqp' }],
  ]),
  Hl = xl('EyeOff', [
    [
      'path',
      {
        d: 'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49',
        key: 'ct8e1f',
      },
    ],
    ['path', { d: 'M14.084 14.158a3 3 0 0 1-4.242-4.242', key: '151rxh' }],
    [
      'path',
      {
        d: 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143',
        key: '13bj9a',
      },
    ],
    ['path', { d: 'm2 2 20 20', key: '1ooewy' }],
  ]),
  $l = xl('Eye', [
    [
      'path',
      {
        d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
        key: '1nclc0',
      },
    ],
    ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
  ]),
  ql = xl('FolderGit2', [
    [
      'path',
      {
        d: 'M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5',
        key: '1w6njk',
      },
    ],
    ['circle', { cx: '13', cy: '12', r: '2', key: '1j92g6' }],
    ['path', { d: 'M18 19c-2.8 0-5-2.2-5-5v8', key: 'pkpw2h' }],
    ['circle', { cx: '20', cy: '19', r: '2', key: '1obnsp' }],
  ]),
  Xl = xl('Gamepad2', [
    ['line', { x1: '6', x2: '10', y1: '11', y2: '11', key: '1gktln' }],
    ['line', { x1: '8', x2: '8', y1: '9', y2: '13', key: 'qnk9ow' }],
    ['line', { x1: '15', x2: '15.01', y1: '12', y2: '12', key: 'krot7o' }],
    ['line', { x1: '18', x2: '18.01', y1: '10', y2: '10', key: '1lcuu1' }],
    [
      'path',
      {
        d: 'M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z',
        key: 'mfqc10',
      },
    ],
  ]),
  Yl = xl('GitBranch', [
    ['line', { x1: '6', x2: '6', y1: '3', y2: '15', key: '17qcm7' }],
    ['circle', { cx: '18', cy: '6', r: '3', key: '1h7g24' }],
    ['circle', { cx: '6', cy: '18', r: '3', key: 'fqmcym' }],
    ['path', { d: 'M18 9a9 9 0 0 1-9 9', key: 'n2h4wq' }],
  ]),
  Kl = xl('Globe', [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['path', { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', key: '13o1zl' }],
    ['path', { d: 'M2 12h20', key: '9i4pu4' }],
  ]),
  Gl = xl('GraduationCap', [
    [
      'path',
      {
        d: 'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z',
        key: 'j76jl0',
      },
    ],
    ['path', { d: 'M22 10v6', key: '1lu8f3' }],
    ['path', { d: 'M6 12.5V16a6 3 0 0 0 12 0v-3.5', key: '1r8lef' }],
  ]),
  _l = xl('Info', [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['path', { d: 'M12 16v-4', key: '1dtifu' }],
    ['path', { d: 'M12 8h.01', key: 'e9boi3' }],
  ]),
  Zl = xl('LayoutDashboard', [
    ['rect', { width: '7', height: '9', x: '3', y: '3', rx: '1', key: '10lvy0' }],
    ['rect', { width: '7', height: '5', x: '14', y: '3', rx: '1', key: '16une8' }],
    ['rect', { width: '7', height: '9', x: '14', y: '12', rx: '1', key: '1hutg5' }],
    ['rect', { width: '7', height: '5', x: '3', y: '16', rx: '1', key: 'ldoo1y' }],
  ]),
  Jl = xl('LoaderCircle', [['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56', key: '13zald' }]]),
  Ql = xl('Lock', [
    ['rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2', key: '1w4ew1' }],
    ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4', key: 'fwvmzm' }],
  ]),
  tc = xl('LogOut', [
    ['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', key: '1uf3rs' }],
    ['polyline', { points: '16 17 21 12 16 7', key: '1gabdz' }],
    ['line', { x1: '21', x2: '9', y1: '12', y2: '12', key: '1uyos4' }],
  ]),
  ec = xl('Mail', [
    ['rect', { width: '20', height: '16', x: '2', y: '4', rx: '2', key: '18n3k1' }],
    ['path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7', key: '1ocrg3' }],
  ]),
  nc = xl('MapPin', [
    [
      'path',
      {
        d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
        key: '1r0f0z',
      },
    ],
    ['circle', { cx: '12', cy: '10', r: '3', key: 'ilqhr7' }],
  ]),
  ic = xl('Map', [
    [
      'path',
      {
        d: 'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z',
        key: '169xi5',
      },
    ],
    ['path', { d: 'M15 5.764v15', key: '1pn4in' }],
    ['path', { d: 'M9 3.236v15', key: '1uimfh' }],
  ]),
  sc = xl('Maximize2', [
    ['polyline', { points: '15 3 21 3 21 9', key: 'mznyad' }],
    ['polyline', { points: '9 21 3 21 3 15', key: '1avn1i' }],
    ['line', { x1: '21', x2: '14', y1: '3', y2: '10', key: 'ota7mn' }],
    ['line', { x1: '3', x2: '10', y1: '21', y2: '14', key: '1atl0r' }],
  ]),
  oc = xl('Menu', [
    ['line', { x1: '4', x2: '20', y1: '12', y2: '12', key: '1e0a9i' }],
    ['line', { x1: '4', x2: '20', y1: '6', y2: '6', key: '1owob3' }],
    ['line', { x1: '4', x2: '20', y1: '18', y2: '18', key: 'yk5zj1' }],
  ]),
  rc = xl('MessageSquare', [
    ['path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', key: '1lielz' }],
  ]),
  ac = xl('Mic', [
    ['path', { d: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', key: '131961' }],
    ['path', { d: 'M19 10v2a7 7 0 0 1-14 0v-2', key: '1vc78b' }],
    ['line', { x1: '12', x2: '12', y1: '19', y2: '22', key: 'x3vr5v' }],
  ]),
  lc = xl('Monitor', [
    ['rect', { width: '20', height: '14', x: '2', y: '3', rx: '2', key: '48i651' }],
    ['line', { x1: '8', x2: '16', y1: '21', y2: '21', key: '1svkeh' }],
    ['line', { x1: '12', x2: '12', y1: '17', y2: '21', key: 'vw1qmm' }],
  ]),
  cc = xl('Pause', [
    ['rect', { x: '14', y: '4', width: '4', height: '16', rx: '1', key: 'zuxfzm' }],
    ['rect', { x: '6', y: '4', width: '4', height: '16', rx: '1', key: '1okwgv' }],
  ]),
  hc = xl('Play', [['polygon', { points: '6 3 20 12 6 21 6 3', key: '1oa8hb' }]]),
  uc = xl('PlugZap', [
    [
      'path',
      { d: 'M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z', key: 'goz73y' },
    ],
    ['path', { d: 'm2 22 3-3', key: '19mgm9' }],
    ['path', { d: 'M7.5 13.5 10 11', key: '7xgeeb' }],
    ['path', { d: 'M10.5 16.5 13 14', key: '10btkg' }],
    ['path', { d: 'm18 3-4 4h6l-4 4', key: '16psg9' }],
  ]),
  dc = xl('Rocket', [
    [
      'path',
      {
        d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
        key: 'm3kijz',
      },
    ],
    [
      'path',
      {
        d: 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
        key: '1fmvmk',
      },
    ],
    ['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0', key: '1f8sc4' }],
    ['path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5', key: 'qeys4' }],
  ]),
  pc = xl('RotateCw', [
    ['path', { d: 'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8', key: '1p45f6' }],
    ['path', { d: 'M21 3v5h-5', key: '1q7to0' }],
  ]),
  mc = xl('Search', [
    ['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }],
    ['path', { d: 'm21 21-4.3-4.3', key: '1qie3q' }],
  ]),
  fc = xl('Send', [
    [
      'path',
      {
        d: 'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z',
        key: '1ffxy3',
      },
    ],
    ['path', { d: 'm21.854 2.147-10.94 10.939', key: '12cjpa' }],
  ]),
  yc = xl('Settings', [
    [
      'path',
      {
        d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
        key: '1qme2f',
      },
    ],
    ['circle', { cx: '12', cy: '12', r: '3', key: '1v7zrd' }],
  ]),
  gc = xl('ShieldCheck', [
    [
      'path',
      {
        d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
        key: 'oel41y',
      },
    ],
    ['path', { d: 'm9 12 2 2 4-4', key: 'dzmm74' }],
  ]),
  vc = xl('Shield', [
    [
      'path',
      {
        d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
        key: 'oel41y',
      },
    ],
  ]),
  xc = xl('SkipBack', [
    ['polygon', { points: '19 20 9 12 19 4 19 20', key: 'o2sva' }],
    ['line', { x1: '5', x2: '5', y1: '19', y2: '5', key: '1ocqjk' }],
  ]),
  wc = xl('SkipForward', [
    ['polygon', { points: '5 4 15 12 5 20 5 4', key: '16p6eg' }],
    ['line', { x1: '19', x2: '19', y1: '5', y2: '19', key: 'futhcm' }],
  ]),
  kc = xl('Sparkles', [
    [
      'path',
      {
        d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
        key: '4pj2yx',
      },
    ],
    ['path', { d: 'M20 3v4', key: '1olli1' }],
    ['path', { d: 'M22 5h-4', key: '1gvqau' }],
    ['path', { d: 'M4 17v2', key: 'vumght' }],
    ['path', { d: 'M5 18H3', key: 'zchphs' }],
  ]),
  Tc = xl('Star', [
    [
      'path',
      {
        d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
        key: 'r04s7s',
      },
    ],
  ]),
  Mc = xl('Target', [
    ['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
    ['circle', { cx: '12', cy: '12', r: '6', key: '1vlfrh' }],
    ['circle', { cx: '12', cy: '12', r: '2', key: '1c9p78' }],
  ]),
  Sc = xl('TrendingUp', [
    ['polyline', { points: '22 7 13.5 15.5 8.5 10.5 2 17', key: '126l90' }],
    ['polyline', { points: '16 7 22 7 22 13', key: 'kwv8wd' }],
  ]),
  Pc = xl('TriangleAlert', [
    [
      'path',
      {
        d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
        key: 'wmoenq',
      },
    ],
    ['path', { d: 'M12 9v4', key: 'juzpu7' }],
    ['path', { d: 'M12 17h.01', key: 'p32p05' }],
  ]),
  bc = xl('Trophy', [
    ['path', { d: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6', key: '17hqa7' }],
    ['path', { d: 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18', key: 'lmptdp' }],
    ['path', { d: 'M4 22h16', key: '57wxv0' }],
    ['path', { d: 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22', key: '1nw9bq' }],
    ['path', { d: 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22', key: '1np0yb' }],
    ['path', { d: 'M18 2H6v7a6 6 0 0 0 12 0V2Z', key: 'u46fv3' }],
  ]),
  Ec = xl('User', [
    ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', key: '975kel' }],
    ['circle', { cx: '12', cy: '7', r: '4', key: '17ys0d' }],
  ]),
  Ac = xl('Users', [
    ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', key: '1yyitq' }],
    ['circle', { cx: '9', cy: '7', r: '4', key: 'nufk8' }],
    ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87', key: 'kshegd' }],
    ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75', key: '1da9ce' }],
  ]),
  Cc = xl('Volume2', [
    [
      'path',
      {
        d: 'M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z',
        key: 'uqj9uw',
      },
    ],
    ['path', { d: 'M16 9a5 5 0 0 1 0 6', key: '1q6k2b' }],
    ['path', { d: 'M19.364 18.364a9 9 0 0 0 0-12.728', key: 'ijwkga' }],
  ]),
  Vc = xl('Wifi', [
    ['path', { d: 'M12 20h.01', key: 'zekei9' }],
    ['path', { d: 'M2 8.82a15 15 0 0 1 20 0', key: 'dnpr2z' }],
    ['path', { d: 'M5 12.859a10 10 0 0 1 14 0', key: '1x1e6c' }],
    ['path', { d: 'M8.5 16.429a5 5 0 0 1 7 0', key: '1bycff' }],
  ]),
  Lc = xl('Workflow', [
    ['rect', { width: '8', height: '8', x: '3', y: '3', rx: '2', key: 'by2w9f' }],
    ['path', { d: 'M7 11v4a2 2 0 0 0 2 2h4', key: 'xkn7yn' }],
    ['rect', { width: '8', height: '8', x: '13', y: '13', rx: '2', key: '1cgmvn' }],
  ]),
  Dc = xl('X', [
    ['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
    ['path', { d: 'm6 6 12 12', key: 'd8bk6v' }],
  ]),
  Rc = xl('Zap', [
    [
      'path',
      {
        d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
        key: '1xq2db',
      },
    ],
  ]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ export {
  pc as $,
  Sr as A,
  Pl as B,
  zl as C,
  Wl as D,
  Hl as E,
  Mc as F,
  Gl as G,
  Tl as H,
  _l as I,
  cc as J,
  hc as K,
  Ql as L,
  ic as M,
  Xl as N,
  bc as O,
  uc as P,
  wc as Q,
  dc as R,
  mc as S,
  Pc as T,
  Ec as U,
  xc as V,
  Lc as W,
  Dc as X,
  fl as Y,
  Rc as Z,
  Cc as _,
  vc as a,
  sc as a0,
  Kl as a1,
  nc as a2,
  Il as a3,
  rc as a4,
  Zl as a5,
  Sl as a6,
  ql as a7,
  ac as a8,
  fc as a9,
  Yl as aa,
  Bl as ab,
  Vc as ac,
  Ml as ad,
  Fl as ae,
  Cl as af,
  tc as ag,
  Nl as ah,
  Ll as ai,
  ul as aj,
  lc as ak,
  Al as al,
  kl as am,
  hl as b,
  kc as c,
  Dl as d,
  oc as e,
  al as f,
  pl as g,
  bl as h,
  gc as i,
  h as j,
  Vl as k,
  Ol as l,
  Ua as m,
  jl as n,
  ec as o,
  $l as p,
  Rl as q,
  Jl as r,
  yc as s,
  Ac as t,
  ll as u,
  Sc as v,
  wl as w,
  Ul as x,
  Tc as y,
  El as z,
};
