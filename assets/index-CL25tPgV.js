const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/CinematicPresentation-DrwFT80l.js',
      'assets/three-D1bd0fYo.js',
      'assets/vendor-CzpUEfg8.js',
      'assets/framer-B0s3ZLcd.js',
      'assets/lucide-D1DwFm7_.js',
      'assets/utils-BpqZfnrR.js',
      'assets/NexusAndroid-v8wdooeN.js',
      'assets/EnhancedROI-X1hzLnCI.js',
      'assets/DecentralandOffice-CbhiaYIm.js',
      'assets/SpatialPresentation-DfmBPH98.js',
      'assets/modelViewer-PDp0OXqT.js',
      'assets/VitureXRExperience-DdBoDV6I.js',
    ])
) => i.map(i => d[i]);
var e,
  t,
  a,
  s,
  n,
  i,
  r,
  o,
  l,
  c,
  d,
  u,
  h,
  p,
  m,
  x,
  f,
  v,
  g,
  b,
  y,
  w,
  j,
  N,
  _,
  A,
  k,
  S,
  C,
  E,
  T,
  I,
  P,
  M,
  O,
  D,
  R,
  L,
  z,
  F,
  H,
  q,
  G,
  V,
  U,
  B,
  W,
  $ = e => {
    throw TypeError(e);
  },
  Q = (e, t, a) => t.has(e) || $('Cannot ' + a),
  K = (e, t, a) => (Q(e, t, 'read from private field'), a ? a.call(e) : t.get(e)),
  X = (e, t, a) =>
    t.has(e)
      ? $('Cannot add the same private member more than once')
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, a),
  Y = (e, t, a, s) => (Q(e, t, 'write to private field'), s ? s.call(e, a) : t.set(e, a), a),
  J = (e, t, a) => (Q(e, t, 'access private method'), a),
  Z = (e, t, a, s) => ({
    set _(s) {
      Y(e, t, s, a);
    },
    get _() {
      return K(e, t, s);
    },
  });
import { j as ee, bq as te, br as ae } from './three-D1bd0fYo.js';
import { r as se, R as ne, c as ie, b as re } from './vendor-CzpUEfg8.js';
import {
  m as oe,
  A as le,
  u as ce,
  a as de,
  b as ue,
  c as he,
  d as pe,
} from './framer-B0s3ZLcd.js';
import {
  S as me,
  M as xe,
  C as fe,
  U as ve,
  B as ge,
  a as be,
  Z as ye,
  L as we,
  b as je,
  X as Ne,
  c as _e,
  d as Ae,
  W as ke,
  e as Se,
  f as Ce,
  P as Ee,
  G as Te,
  g as Ie,
  h as Pe,
  A as Me,
  i as Oe,
  j as De,
  k as Re,
  F as Le,
  l as ze,
  m as Fe,
  n as He,
  o as qe,
  p as Ge,
  q as Ve,
  r as Ue,
  T as Be,
  s as We,
  t as $e,
  u as Qe,
  v as Ke,
  w as Xe,
  x as Ye,
  y as Je,
  I as Ze,
  z as et,
  D as tt,
  E as at,
  H as st,
  J as nt,
  K as it,
  N as rt,
  O as ot,
  Q as lt,
} from './lucide-D1DwFm7_.js';
import { t as ct, c as dt } from './utils-BpqZfnrR.js';
function ut() {
  return (
    (ut = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var a = arguments[t];
            for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (e[s] = a[s]);
          }
          return e;
        }),
    ut.apply(this, arguments)
  );
}
(!(function () {
  const e = document.createElement('link').relList;
  if (!(e && e.supports && e.supports('modulepreload'))) {
    for (const e of document.querySelectorAll('link[rel="modulepreload"]')) t(e);
    new MutationObserver(e => {
      for (const a of e)
        if ('childList' === a.type)
          for (const e of a.addedNodes) 'LINK' === e.tagName && 'modulepreload' === e.rel && t(e);
    }).observe(document, { childList: !0, subtree: !0 });
  }
  function t(e) {
    if (e.ep) return;
    e.ep = !0;
    const t = (function (e) {
      const t = {};
      return (
        e.integrity && (t.integrity = e.integrity),
        e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
        'use-credentials' === e.crossOrigin
          ? (t.credentials = 'include')
          : 'anonymous' === e.crossOrigin
            ? (t.credentials = 'omit')
            : (t.credentials = 'same-origin'),
        t
      );
    })(e);
    fetch(e.href, t);
  }
})(),
  ((W = B || (B = {})).Pop = 'POP'),
  (W.Push = 'PUSH'),
  (W.Replace = 'REPLACE'));
const ht = 'popstate';
function pt(e) {
  return (
    void 0 === e && (e = {}),
    (function (e, t, a, s) {
      void 0 === s && (s = {});
      let { window: n = document.defaultView, v5Compat: i = !1 } = s,
        r = n.history,
        o = B.Pop,
        l = null,
        c = d();
      null == c && ((c = 0), r.replaceState(ut({}, r.state, { idx: c }), ''));
      function d() {
        return (r.state || { idx: null }).idx;
      }
      function u() {
        o = B.Pop;
        let e = d(),
          t = null == e ? null : e - c;
        ((c = e), l && l({ action: o, location: x.location, delta: t }));
      }
      function h(e, t) {
        o = B.Push;
        let a = vt(x.location, e, t);
        c = d() + 1;
        let s = ft(a, c),
          u = x.createHref(a);
        try {
          r.pushState(s, '', u);
        } catch (h) {
          if (h instanceof DOMException && 'DataCloneError' === h.name) throw h;
          n.location.assign(u);
        }
        i && l && l({ action: o, location: x.location, delta: 1 });
      }
      function p(e, t) {
        o = B.Replace;
        let a = vt(x.location, e, t);
        c = d();
        let s = ft(a, c),
          n = x.createHref(a);
        (r.replaceState(s, '', n), i && l && l({ action: o, location: x.location, delta: 0 }));
      }
      function m(e) {
        let t = 'null' !== n.location.origin ? n.location.origin : n.location.href,
          a = 'string' == typeof e ? e : gt(e);
        return (
          (a = a.replace(/ $/, '%20')),
          mt(t, 'No window.location.(origin|href) available to create URL for href: ' + a),
          new URL(a, t)
        );
      }
      let x = {
        get action() {
          return o;
        },
        get location() {
          return e(n, r);
        },
        listen(e) {
          if (l) throw new Error('A history only accepts one active listener');
          return (
            n.addEventListener(ht, u),
            (l = e),
            () => {
              (n.removeEventListener(ht, u), (l = null));
            }
          );
        },
        createHref: e => t(n, e),
        createURL: m,
        encodeLocation(e) {
          let t = m(e);
          return { pathname: t.pathname, search: t.search, hash: t.hash };
        },
        push: h,
        replace: p,
        go: e => r.go(e),
      };
      return x;
    })(
      function (e, t) {
        let { pathname: a, search: s, hash: n } = e.location;
        return vt(
          '',
          { pathname: a, search: s, hash: n },
          (t.state && t.state.usr) || null,
          (t.state && t.state.key) || 'default'
        );
      },
      function (e, t) {
        return 'string' == typeof t ? t : gt(t);
      },
      0,
      e
    )
  );
}
function mt(e, t) {
  if (!1 === e || null == e) throw new Error(t);
}
function xt(e, t) {
  if (!e) {
    'undefined' != typeof console && console.warn(t);
    try {
      throw new Error(t);
    } catch (a) {}
  }
}
function ft(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function vt(e, t, a, s) {
  return (
    void 0 === a && (a = null),
    ut(
      { pathname: 'string' == typeof e ? e : e.pathname, search: '', hash: '' },
      'string' == typeof t ? bt(t) : t,
      { state: a, key: (t && t.key) || s || Math.random().toString(36).substr(2, 8) }
    )
  );
}
function gt(e) {
  let { pathname: t = '/', search: a = '', hash: s = '' } = e;
  return (
    a && '?' !== a && (t += '?' === a.charAt(0) ? a : '?' + a),
    s && '#' !== s && (t += '#' === s.charAt(0) ? s : '#' + s),
    t
  );
}
function bt(e) {
  let t = {};
  if (e) {
    let a = e.indexOf('#');
    a >= 0 && ((t.hash = e.substr(a)), (e = e.substr(0, a)));
    let s = e.indexOf('?');
    (s >= 0 && ((t.search = e.substr(s)), (e = e.substr(0, s))), e && (t.pathname = e));
  }
  return t;
}
var yt, wt;
function jt(e, t, a) {
  return (
    void 0 === a && (a = '/'),
    (function (e, t, a) {
      let s = 'string' == typeof t ? bt(t) : t,
        n = Rt(s.pathname || '/', a);
      if (null == n) return null;
      let i = Nt(e);
      !(function (e) {
        e.sort((e, t) =>
          e.score !== t.score
            ? t.score - e.score
            : (function (e, t) {
                let a = e.length === t.length && e.slice(0, -1).every((e, a) => e === t[a]);
                return a ? e[e.length - 1] - t[t.length - 1] : 0;
              })(
                e.routesMeta.map(e => e.childrenIndex),
                t.routesMeta.map(e => e.childrenIndex)
              )
        );
      })(i);
      let r = null;
      for (let o = 0; null == r && o < i.length; ++o) {
        let e = Dt(n);
        r = Mt(i[o], e);
      }
      return r;
    })(e, t, a)
  );
}
function Nt(e, t, a, s) {
  (void 0 === t && (t = []), void 0 === a && (a = []), void 0 === s && (s = ''));
  let n = (e, n, i) => {
    let r = {
      relativePath: void 0 === i ? e.path || '' : i,
      caseSensitive: !0 === e.caseSensitive,
      childrenIndex: n,
      route: e,
    };
    r.relativePath.startsWith('/') &&
      (mt(
        r.relativePath.startsWith(s),
        'Absolute route path "' +
          r.relativePath +
          '" nested under path "' +
          s +
          '" is not valid. An absolute child route path must start with the combined path of all its parent routes.'
      ),
      (r.relativePath = r.relativePath.slice(s.length)));
    let o = Vt([s, r.relativePath]),
      l = a.concat(r);
    (e.children &&
      e.children.length > 0 &&
      (mt(
        !0 !== e.index,
        'Index routes must not have child routes. Please remove all child routes from route path "' +
          o +
          '".'
      ),
      Nt(e.children, t, l, o)),
      (null != e.path || e.index) && t.push({ path: o, score: Pt(o, e.index), routesMeta: l }));
  };
  return (
    e.forEach((e, t) => {
      var a;
      if ('' !== e.path && null != (a = e.path) && a.includes('?'))
        for (let s of _t(e.path)) n(e, t, s);
      else n(e, t);
    }),
    t
  );
}
function _t(e) {
  let t = e.split('/');
  if (0 === t.length) return [];
  let [a, ...s] = t,
    n = a.endsWith('?'),
    i = a.replace(/\?$/, '');
  if (0 === s.length) return n ? [i, ''] : [i];
  let r = _t(s.join('/')),
    o = [];
  return (
    o.push(...r.map(e => ('' === e ? i : [i, e].join('/')))),
    n && o.push(...r),
    o.map(t => (e.startsWith('/') && '' === t ? '/' : t))
  );
}
(((wt = yt || (yt = {})).data = 'data'),
  (wt.deferred = 'deferred'),
  (wt.redirect = 'redirect'),
  (wt.error = 'error'));
const At = /^:[\w-]+$/,
  kt = 3,
  St = 2,
  Ct = 1,
  Et = 10,
  Tt = -2,
  It = e => '*' === e;
function Pt(e, t) {
  let a = e.split('/'),
    s = a.length;
  return (
    a.some(It) && (s += Tt),
    t && (s += St),
    a.filter(e => !It(e)).reduce((e, t) => e + (At.test(t) ? kt : '' === t ? Ct : Et), s)
  );
}
function Mt(e, t, a) {
  let { routesMeta: s } = e,
    n = {},
    i = '/',
    r = [];
  for (let o = 0; o < s.length; ++o) {
    let e = s[o],
      a = o === s.length - 1,
      l = '/' === i ? t : t.slice(i.length) || '/',
      c = Ot({ path: e.relativePath, caseSensitive: e.caseSensitive, end: a }, l),
      d = e.route;
    if (!c) return null;
    (Object.assign(n, c.params),
      r.push({
        params: n,
        pathname: Vt([i, c.pathname]),
        pathnameBase: Ut(Vt([i, c.pathnameBase])),
        route: d,
      }),
      '/' !== c.pathnameBase && (i = Vt([i, c.pathnameBase])));
  }
  return r;
}
function Ot(e, t) {
  'string' == typeof e && (e = { path: e, caseSensitive: !1, end: !0 });
  let [a, s] = (function (e, t, a) {
      void 0 === t && (t = !1);
      void 0 === a && (a = !0);
      xt(
        '*' === e || !e.endsWith('*') || e.endsWith('/*'),
        'Route path "' +
          e +
          '" will be treated as if it were "' +
          e.replace(/\*$/, '/*') +
          '" because the `*` character must always follow a `/` in the pattern. To get rid of this warning, please change the route path to "' +
          e.replace(/\*$/, '/*') +
          '".'
      );
      let s = [],
        n =
          '^' +
          e
            .replace(/\/*\*?$/, '')
            .replace(/^\/*/, '/')
            .replace(/[\\.*+^${}|()[\]]/g, '\\$&')
            .replace(
              /\/:([\w-]+)(\?)?/g,
              (e, t, a) => (
                s.push({ paramName: t, isOptional: null != a }),
                a ? '/?([^\\/]+)?' : '/([^\\/]+)'
              )
            );
      e.endsWith('*')
        ? (s.push({ paramName: '*' }),
          (n += '*' === e || '/*' === e ? '(.*)$' : '(?:\\/(.+)|\\/*)$'))
        : a
          ? (n += '\\/*$')
          : '' !== e && '/' !== e && (n += '(?:(?=\\/|$))');
      let i = new RegExp(n, t ? void 0 : 'i');
      return [i, s];
    })(e.path, e.caseSensitive, e.end),
    n = t.match(a);
  if (!n) return null;
  let i = n[0],
    r = i.replace(/(.)\/+$/, '$1'),
    o = n.slice(1);
  return {
    params: s.reduce((e, t, a) => {
      let { paramName: s, isOptional: n } = t;
      if ('*' === s) {
        let e = o[a] || '';
        r = i.slice(0, i.length - e.length).replace(/(.)\/+$/, '$1');
      }
      const l = o[a];
      return ((e[s] = n && !l ? void 0 : (l || '').replace(/%2F/g, '/')), e);
    }, {}),
    pathname: i,
    pathnameBase: r,
    pattern: e,
  };
}
function Dt(e) {
  try {
    return e
      .split('/')
      .map(e => decodeURIComponent(e).replace(/\//g, '%2F'))
      .join('/');
  } catch (t) {
    return (
      xt(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent encoding (' +
          t +
          ').'
      ),
      e
    );
  }
}
function Rt(e, t) {
  if ('/' === t) return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let a = t.endsWith('/') ? t.length - 1 : t.length,
    s = e.charAt(a);
  return s && '/' !== s ? null : e.slice(a) || '/';
}
const Lt = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function zt(e, t) {
  void 0 === t && (t = '/');
  let a,
    { pathname: s, search: n = '', hash: i = '' } = 'string' == typeof e ? bt(e) : e;
  if (s)
    if (((r = s), Lt.test(r))) a = s;
    else {
      if (s.includes('//')) {
        let e = s;
        ((s = s.replace(/\/\/+/g, '/')),
          xt(!1, 'Pathnames cannot have embedded double slashes - normalizing ' + e + ' -> ' + s));
      }
      a = s.startsWith('/') ? Ft(s.substring(1), '/') : Ft(s, t);
    }
  else a = t;
  var r;
  return { pathname: a, search: Bt(n), hash: Wt(i) };
}
function Ft(e, t) {
  let a = t.replace(/\/+$/, '').split('/');
  return (
    e.split('/').forEach(e => {
      '..' === e ? a.length > 1 && a.pop() : '.' !== e && a.push(e);
    }),
    a.length > 1 ? a.join('/') : '/'
  );
}
function Ht(e, t, a, s) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified `to." +
    t +
    '` field [' +
    JSON.stringify(s) +
    '].  Please separate it out to the `to.' +
    a +
    '` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.'
  );
}
function qt(e, t) {
  let a = (function (e) {
    return e.filter((e, t) => 0 === t || (e.route.path && e.route.path.length > 0));
  })(e);
  return t
    ? a.map((e, t) => (t === a.length - 1 ? e.pathname : e.pathnameBase))
    : a.map(e => e.pathnameBase);
}
function Gt(e, t, a, s) {
  let n;
  (void 0 === s && (s = !1),
    'string' == typeof e
      ? (n = bt(e))
      : ((n = ut({}, e)),
        mt(!n.pathname || !n.pathname.includes('?'), Ht('?', 'pathname', 'search', n)),
        mt(!n.pathname || !n.pathname.includes('#'), Ht('#', 'pathname', 'hash', n)),
        mt(!n.search || !n.search.includes('#'), Ht('#', 'search', 'hash', n))));
  let i,
    r = '' === e || '' === n.pathname,
    o = r ? '/' : n.pathname;
  if (null == o) i = a;
  else {
    let e = t.length - 1;
    if (!s && o.startsWith('..')) {
      let t = o.split('/');
      for (; '..' === t[0]; ) (t.shift(), (e -= 1));
      n.pathname = t.join('/');
    }
    i = e >= 0 ? t[e] : '/';
  }
  let l = zt(n, i),
    c = o && '/' !== o && o.endsWith('/'),
    d = (r || '.' === o) && a.endsWith('/');
  return (l.pathname.endsWith('/') || (!c && !d) || (l.pathname += '/'), l);
}
const Vt = e => e.join('/').replace(/\/\/+/g, '/'),
  Ut = e => e.replace(/\/+$/, '').replace(/^\/*/, '/'),
  Bt = e => (e && '?' !== e ? (e.startsWith('?') ? e : '?' + e) : ''),
  Wt = e => (e && '#' !== e ? (e.startsWith('#') ? e : '#' + e) : '');
const $t = ['post', 'put', 'patch', 'delete'];
new Set($t);
const Qt = ['get', ...$t];
function Kt() {
  return (
    (Kt = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var a = arguments[t];
            for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (e[s] = a[s]);
          }
          return e;
        }),
    Kt.apply(this, arguments)
  );
}
new Set(Qt);
const Xt = se.createContext(null),
  Yt = se.createContext(null),
  Jt = se.createContext(null),
  Zt = se.createContext(null),
  ea = se.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  ta = se.createContext(null);
function aa() {
  return null != se.useContext(Zt);
}
function sa() {
  return (aa() || mt(!1), se.useContext(Zt).location);
}
function na(e) {
  se.useContext(Jt).static || se.useLayoutEffect(e);
}
function ia() {
  let { isDataRoute: e } = se.useContext(ea);
  return e
    ? (function () {
        let { router: e } = (function () {
            let e = se.useContext(Xt);
            return (e || mt(!1), e);
          })(ha.UseNavigateStable),
          t = ma(pa.UseNavigateStable),
          a = se.useRef(!1);
        return (
          na(() => {
            a.current = !0;
          }),
          se.useCallback(
            function (s, n) {
              (void 0 === n && (n = {}),
                a.current &&
                  ('number' == typeof s
                    ? e.navigate(s)
                    : e.navigate(s, Kt({ fromRouteId: t }, n))));
            },
            [e, t]
          )
        );
      })()
    : (function () {
        aa() || mt(!1);
        let e = se.useContext(Xt),
          { basename: t, future: a, navigator: s } = se.useContext(Jt),
          { matches: n } = se.useContext(ea),
          { pathname: i } = sa(),
          r = JSON.stringify(qt(n, a.v7_relativeSplatPath)),
          o = se.useRef(!1);
        return (
          na(() => {
            o.current = !0;
          }),
          se.useCallback(
            function (a, n) {
              if ((void 0 === n && (n = {}), !o.current)) return;
              if ('number' == typeof a) return void s.go(a);
              let l = Gt(a, JSON.parse(r), i, 'path' === n.relative);
              (null == e &&
                '/' !== t &&
                (l.pathname = '/' === l.pathname ? t : Vt([t, l.pathname])),
                (n.replace ? s.replace : s.push)(l, n.state, n));
            },
            [t, s, r, i, e]
          )
        );
      })();
}
function ra(e, t) {
  let { relative: a } = void 0 === t ? {} : t,
    { future: s } = se.useContext(Jt),
    { matches: n } = se.useContext(ea),
    { pathname: i } = sa(),
    r = JSON.stringify(qt(n, s.v7_relativeSplatPath));
  return se.useMemo(() => Gt(e, JSON.parse(r), i, 'path' === a), [e, r, i, a]);
}
function oa(e, t) {
  return (function (e, t, a, s) {
    aa() || mt(!1);
    let { navigator: n } = se.useContext(Jt),
      { matches: i } = se.useContext(ea),
      r = i[i.length - 1],
      o = r ? r.params : {};
    !r || r.pathname;
    let l = r ? r.pathnameBase : '/';
    r && r.route;
    let c,
      d = sa();
    if (t) {
      var u;
      let e = 'string' == typeof t ? bt(t) : t;
      ('/' === l || (null == (u = e.pathname) ? void 0 : u.startsWith(l)) || mt(!1), (c = e));
    } else c = d;
    let h = c.pathname || '/',
      p = h;
    if ('/' !== l) {
      let e = l.replace(/^\//, '').split('/');
      p = '/' + h.replace(/^\//, '').split('/').slice(e.length).join('/');
    }
    let m = jt(e, { pathname: p }),
      x = (function (e, t, a, s) {
        var n;
        void 0 === t && (t = []);
        void 0 === a && (a = null);
        void 0 === s && (s = null);
        if (null == e) {
          var i;
          if (!a) return null;
          if (a.errors) e = a.matches;
          else {
            if (
              !(
                null != (i = s) &&
                i.v7_partialHydration &&
                0 === t.length &&
                !a.initialized &&
                a.matches.length > 0
              )
            )
              return null;
            e = a.matches;
          }
        }
        let r = e,
          o = null == (n = a) ? void 0 : n.errors;
        if (null != o) {
          let e = r.findIndex(e => e.route.id && void 0 !== (null == o ? void 0 : o[e.route.id]));
          (e >= 0 || mt(!1), (r = r.slice(0, Math.min(r.length, e + 1))));
        }
        let l = !1,
          c = -1;
        if (a && s && s.v7_partialHydration)
          for (let d = 0; d < r.length; d++) {
            let e = r[d];
            if (
              ((e.route.HydrateFallback || e.route.hydrateFallbackElement) && (c = d), e.route.id)
            ) {
              let { loaderData: t, errors: s } = a,
                n = e.route.loader && void 0 === t[e.route.id] && (!s || void 0 === s[e.route.id]);
              if (e.route.lazy || n) {
                ((l = !0), (r = c >= 0 ? r.slice(0, c + 1) : [r[0]]));
                break;
              }
            }
          }
        return r.reduceRight((e, s, n) => {
          let i,
            d = !1,
            u = null,
            h = null;
          var p;
          a &&
            ((i = o && s.route.id ? o[s.route.id] : void 0),
            (u = s.route.errorElement || ca),
            l &&
              (c < 0 && 0 === n
                ? (xa[(p = 'route-fallback')] || (xa[p] = !0), (d = !0), (h = null))
                : c === n && ((d = !0), (h = s.route.hydrateFallbackElement || null))));
          let m = t.concat(r.slice(0, n + 1)),
            x = () => {
              let t;
              return (
                (t = i
                  ? u
                  : d
                    ? h
                    : s.route.Component
                      ? se.createElement(s.route.Component, null)
                      : s.route.element
                        ? s.route.element
                        : e),
                se.createElement(ua, {
                  match: s,
                  routeContext: { outlet: e, matches: m, isDataRoute: null != a },
                  children: t,
                })
              );
            };
          return a && (s.route.ErrorBoundary || s.route.errorElement || 0 === n)
            ? se.createElement(da, {
                location: a.location,
                revalidation: a.revalidation,
                component: u,
                error: i,
                children: x(),
                routeContext: { outlet: null, matches: m, isDataRoute: !0 },
              })
            : x();
        }, null);
      })(
        m &&
          m.map(e =>
            Object.assign({}, e, {
              params: Object.assign({}, o, e.params),
              pathname: Vt([
                l,
                n.encodeLocation ? n.encodeLocation(e.pathname).pathname : e.pathname,
              ]),
              pathnameBase:
                '/' === e.pathnameBase
                  ? l
                  : Vt([
                      l,
                      n.encodeLocation ? n.encodeLocation(e.pathnameBase).pathname : e.pathnameBase,
                    ]),
            })
          ),
        i,
        a,
        s
      );
    if (t && x)
      return se.createElement(
        Zt.Provider,
        {
          value: {
            location: Kt({ pathname: '/', search: '', hash: '', state: null, key: 'default' }, c),
            navigationType: B.Pop,
          },
        },
        x
      );
    return x;
  })(e, t);
}
function la() {
  let e = (function () {
      var e;
      let t = se.useContext(ta),
        a = (function () {
          let e = se.useContext(Yt);
          return (e || mt(!1), e);
        })(),
        s = ma();
      if (void 0 !== t) return t;
      return null == (e = a.errors) ? void 0 : e[s];
    })(),
    t = (function (e) {
      return (
        null != e &&
        'number' == typeof e.status &&
        'string' == typeof e.statusText &&
        'boolean' == typeof e.internal &&
        'data' in e
      );
    })(e)
      ? e.status + ' ' + e.statusText
      : e instanceof Error
        ? e.message
        : JSON.stringify(e),
    a = e instanceof Error ? e.stack : null,
    s = { padding: '0.5rem', backgroundColor: 'rgba(200,200,200, 0.5)' };
  return se.createElement(
    se.Fragment,
    null,
    se.createElement('h2', null, 'Unexpected Application Error!'),
    se.createElement('h3', { style: { fontStyle: 'italic' } }, t),
    a ? se.createElement('pre', { style: s }, a) : null,
    null
  );
}
const ca = se.createElement(la, null);
class da extends se.Component {
  constructor(e) {
    (super(e),
      (this.state = { location: e.location, revalidation: e.revalidation, error: e.error }));
  }
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  static getDerivedStateFromProps(e, t) {
    return t.location !== e.location || ('idle' !== t.revalidation && 'idle' === e.revalidation)
      ? { error: e.error, location: e.location, revalidation: e.revalidation }
      : {
          error: void 0 !== e.error ? e.error : t.error,
          location: t.location,
          revalidation: e.revalidation || t.revalidation,
        };
  }
  componentDidCatch(e, t) {
    console.error('React Router caught the following error during render', e, t);
  }
  render() {
    return void 0 !== this.state.error
      ? se.createElement(
          ea.Provider,
          { value: this.props.routeContext },
          se.createElement(ta.Provider, { value: this.state.error, children: this.props.component })
        )
      : this.props.children;
  }
}
function ua(e) {
  let { routeContext: t, match: a, children: s } = e,
    n = se.useContext(Xt);
  return (
    n &&
      n.static &&
      n.staticContext &&
      (a.route.errorElement || a.route.ErrorBoundary) &&
      (n.staticContext._deepestRenderedBoundaryId = a.route.id),
    se.createElement(ea.Provider, { value: t }, s)
  );
}
var ha = (function (e) {
    return (
      (e.UseBlocker = 'useBlocker'),
      (e.UseRevalidator = 'useRevalidator'),
      (e.UseNavigateStable = 'useNavigate'),
      e
    );
  })(ha || {}),
  pa = (function (e) {
    return (
      (e.UseBlocker = 'useBlocker'),
      (e.UseLoaderData = 'useLoaderData'),
      (e.UseActionData = 'useActionData'),
      (e.UseRouteError = 'useRouteError'),
      (e.UseNavigation = 'useNavigation'),
      (e.UseRouteLoaderData = 'useRouteLoaderData'),
      (e.UseMatches = 'useMatches'),
      (e.UseRevalidator = 'useRevalidator'),
      (e.UseNavigateStable = 'useNavigate'),
      (e.UseRouteId = 'useRouteId'),
      e
    );
  })(pa || {});
function ma(e) {
  let t = (function () {
      let e = se.useContext(ea);
      return (e || mt(!1), e);
    })(),
    a = t.matches[t.matches.length - 1];
  return (a.route.id || mt(!1), a.route.id);
}
const xa = {};
function fa(e) {
  let { to: t, replace: a, state: s, relative: n } = e;
  aa() || mt(!1);
  let { future: i, static: r } = se.useContext(Jt),
    { matches: o } = se.useContext(ea),
    { pathname: l } = sa(),
    c = ia(),
    d = Gt(t, qt(o, i.v7_relativeSplatPath), l, 'path' === n),
    u = JSON.stringify(d);
  return (
    se.useEffect(() => c(JSON.parse(u), { replace: a, state: s, relative: n }), [c, u, n, a, s]),
    null
  );
}
function va(e) {
  mt(!1);
}
function ga(e) {
  let {
    basename: t = '/',
    children: a = null,
    location: s,
    navigationType: n = B.Pop,
    navigator: i,
    static: r = !1,
    future: o,
  } = e;
  aa() && mt(!1);
  let l = t.replace(/^\/*/, '/'),
    c = se.useMemo(
      () => ({ basename: l, navigator: i, static: r, future: Kt({ v7_relativeSplatPath: !1 }, o) }),
      [l, o, i, r]
    );
  'string' == typeof s && (s = bt(s));
  let { pathname: d = '/', search: u = '', hash: h = '', state: p = null, key: m = 'default' } = s,
    x = se.useMemo(() => {
      let e = Rt(d, l);
      return null == e
        ? null
        : { location: { pathname: e, search: u, hash: h, state: p, key: m }, navigationType: n };
    }, [l, d, u, h, p, m, n]);
  return null == x
    ? null
    : se.createElement(
        Jt.Provider,
        { value: c },
        se.createElement(Zt.Provider, { children: a, value: x })
      );
}
function ba(e) {
  let { children: t, location: a } = e;
  return oa(ya(t), a);
}
function ya(e, t) {
  void 0 === t && (t = []);
  let a = [];
  return (
    se.Children.forEach(e, (e, s) => {
      if (!se.isValidElement(e)) return;
      let n = [...t, s];
      if (e.type === se.Fragment) return void a.push.apply(a, ya(e.props.children, n));
      (e.type !== va && mt(!1), e.props.index && e.props.children && mt(!1));
      let i = {
        id: e.props.id || n.join('-'),
        caseSensitive: e.props.caseSensitive,
        element: e.props.element,
        Component: e.props.Component,
        index: e.props.index,
        path: e.props.path,
        loader: e.props.loader,
        action: e.props.action,
        errorElement: e.props.errorElement,
        ErrorBoundary: e.props.ErrorBoundary,
        hasErrorBoundary: null != e.props.ErrorBoundary || null != e.props.errorElement,
        shouldRevalidate: e.props.shouldRevalidate,
        handle: e.props.handle,
        lazy: e.props.lazy,
      };
      (e.props.children && (i.children = ya(e.props.children, n)), a.push(i));
    }),
    a
  );
}
function wa() {
  return (
    (wa = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var a = arguments[t];
            for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && (e[s] = a[s]);
          }
          return e;
        }),
    wa.apply(this, arguments)
  );
}
new Promise(() => {});
const ja = [
  'onClick',
  'relative',
  'reloadDocument',
  'replace',
  'state',
  'target',
  'to',
  'preventScrollReset',
  'viewTransition',
];
try {
  window.__reactRouterVersion = '6';
} catch (pi) {}
const Na = ne.startTransition;
function _a(e) {
  let { basename: t, children: a, future: s, window: n } = e,
    i = se.useRef();
  null == i.current && (i.current = pt({ window: n, v5Compat: !0 }));
  let r = i.current,
    [o, l] = se.useState({ action: r.action, location: r.location }),
    { v7_startTransition: c } = s || {},
    d = se.useCallback(
      e => {
        c && Na ? Na(() => l(e)) : l(e);
      },
      [l, c]
    );
  return (
    se.useLayoutEffect(() => r.listen(d), [r, d]),
    se.useEffect(() => {
      return (null == (e = s) || e.v7_startTransition, void (null == e || e.v7_relativeSplatPath));
      var e;
    }, [s]),
    se.createElement(ga, {
      basename: t,
      children: a,
      location: o.location,
      navigationType: o.action,
      navigator: r,
      future: s,
    })
  );
}
const Aa =
    'undefined' != typeof window &&
    void 0 !== window.document &&
    void 0 !== window.document.createElement,
  ka = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Sa = se.forwardRef(function (e, t) {
    let a,
      {
        onClick: s,
        relative: n,
        reloadDocument: i,
        replace: r,
        state: o,
        target: l,
        to: c,
        preventScrollReset: d,
        viewTransition: u,
      } = e,
      h = (function (e, t) {
        if (null == e) return {};
        var a,
          s,
          n = {},
          i = Object.keys(e);
        for (s = 0; s < i.length; s++) ((a = i[s]), t.indexOf(a) >= 0 || (n[a] = e[a]));
        return n;
      })(e, ja),
      { basename: p } = se.useContext(Jt),
      m = !1;
    if ('string' == typeof c && ka.test(c) && ((a = c), Aa))
      try {
        let e = new URL(window.location.href),
          t = c.startsWith('//') ? new URL(e.protocol + c) : new URL(c),
          a = Rt(t.pathname, p);
        t.origin === e.origin && null != a ? (c = a + t.search + t.hash) : (m = !0);
      } catch (pi) {}
    let x = (function (e, t) {
        let { relative: a } = void 0 === t ? {} : t;
        aa() || mt(!1);
        let { basename: s, navigator: n } = se.useContext(Jt),
          { hash: i, pathname: r, search: o } = ra(e, { relative: a }),
          l = r;
        return (
          '/' !== s && (l = '/' === r ? s : Vt([s, r])),
          n.createHref({ pathname: l, search: o, hash: i })
        );
      })(c, { relative: n }),
      f = (function (e, t) {
        let {
            target: a,
            replace: s,
            state: n,
            preventScrollReset: i,
            relative: r,
            viewTransition: o,
          } = void 0 === t ? {} : t,
          l = ia(),
          c = sa(),
          d = ra(e, { relative: r });
        return se.useCallback(
          t => {
            if (
              (function (e, t) {
                return !(
                  0 !== e.button ||
                  (t && '_self' !== t) ||
                  (function (e) {
                    return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
                  })(e)
                );
              })(t, a)
            ) {
              t.preventDefault();
              let a = void 0 !== s ? s : gt(c) === gt(d);
              l(e, { replace: a, state: n, preventScrollReset: i, relative: r, viewTransition: o });
            }
          },
          [c, l, d, s, n, a, e, i, r, o]
        );
      })(c, {
        replace: r,
        state: o,
        target: l,
        preventScrollReset: d,
        relative: n,
        viewTransition: u,
      });
    return se.createElement(
      'a',
      wa({}, h, {
        href: a || x,
        onClick:
          m || i
            ? s
            : function (e) {
                (s && s(e), e.defaultPrevented || f(e));
              },
        ref: t,
        target: l,
      })
    );
  });
var Ca, Ea, Ta, Ia;
(((Ea = Ca || (Ca = {})).UseScrollRestoration = 'useScrollRestoration'),
  (Ea.UseSubmit = 'useSubmit'),
  (Ea.UseSubmitFetcher = 'useSubmitFetcher'),
  (Ea.UseFetcher = 'useFetcher'),
  (Ea.useViewTransitionState = 'useViewTransitionState'),
  ((Ia = Ta || (Ta = {})).UseFetcher = 'useFetcher'),
  (Ia.UseFetchers = 'useFetchers'),
  (Ia.UseScrollRestoration = 'useScrollRestoration'));
const Pa = () =>
    ee.jsxs('div', {
      className: 'fixed inset-0 -z-50 overflow-hidden pointer-events-none',
      children: [
        ee.jsx(oe.div, {
          animate: { scale: [1, 1.2, 1], rotate: [0, 45, 0], x: [0, 100, 0], y: [0, -50, 0] },
          transition: { duration: 20, repeat: 1 / 0, ease: 'easeInOut' },
          className:
            'absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-nexus-violet/5 blur-[120px] rounded-full',
        }),
        ee.jsx(oe.div, {
          animate: { scale: [1.2, 1, 1.2], rotate: [0, -30, 0], x: [0, -100, 0], y: [0, 50, 0] },
          transition: { duration: 25, repeat: 1 / 0, ease: 'easeInOut' },
          className:
            'absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-nexus-cyan/5 blur-[100px] rounded-full',
        }),
        ee.jsx('div', { className: 'absolute inset-0 bg-nexus-obsidian/40 backdrop-blur-[20px]' }),
      ],
    }),
  Ma = [
    {
      sector: 'Salud & Clínicas',
      title: 'Triaje inteligente + automatización de agenda',
      impact: [
        '-48% tiempos de espera',
        '+37% productividad del personal',
        '+22% satisfacción NPS',
      ],
    },
    {
      sector: 'Logística & Transporte',
      title: 'Orquestación de rutas con IA y monitoreo predictivo',
      impact: [
        '-19% costos operativos',
        '+31% cumplimiento de entregas',
        '-54% incidencias críticas',
      ],
    },
    {
      sector: 'Educación & Gremios',
      title: 'Plataforma de aprendizaje y asistencia para socios',
      impact: [
        '+62% adopción digital',
        '+41% retención de miembros',
        '+28% ingresos por servicios',
      ],
    },
  ],
  Oa = () =>
    ee.jsxs('section', {
      id: 'cases',
      className: 'py-32 bg-gradient-to-b from-black via-gray-900/30 to-black relative',
      children: [
        ee.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-center from-nexus-cyan/10 via-transparent to-transparent',
        }),
        ee.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 relative z-10',
          children: [
            ee.jsxs(oe.div, {
              className: 'text-center mb-16',
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.8 },
              viewport: { once: !0 },
              children: [
                ee.jsxs('h2', {
                  className: 'text-5xl md:text-7xl font-orbitron font-black text-white mb-4',
                  children: [
                    'CASOS DE ',
                    ee.jsx('span', { className: 'text-nexus-violet text-glow', children: 'ÉXITO' }),
                  ],
                }),
                ee.jsx('p', {
                  className: 'text-lg text-nexus-silver/70 max-w-3xl mx-auto',
                  children:
                    'Ejemplos reales con impacto medible. Diseñamos estrategias adaptadas a tu industria y gremio.',
                }),
              ],
            }),
            ee.jsx('div', {
              className: 'grid lg:grid-cols-3 gap-8',
              children: Ma.map((e, t) =>
                ee.jsxs(
                  oe.div,
                  {
                    className: 'p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md',
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: 0.1 * t },
                    viewport: { once: !0 },
                    children: [
                      ee.jsx('div', {
                        className:
                          'text-xs font-orbitron tracking-[0.3em] text-nexus-cyan-glow mb-4 uppercase',
                        children: e.sector,
                      }),
                      ee.jsx('h3', {
                        className: 'text-xl font-bold text-white mb-4',
                        children: e.title,
                      }),
                      ee.jsx('ul', {
                        className: 'space-y-3 text-sm text-nexus-silver/70',
                        children: e.impact.map(e =>
                          ee.jsxs(
                            'li',
                            {
                              className: 'flex items-center gap-2',
                              children: [
                                ee.jsx('span', { className: 'h-2 w-2 rounded-full bg-nexus-cyan' }),
                                e,
                              ],
                            },
                            e
                          )
                        ),
                      }),
                    ],
                  },
                  e.title
                )
              ),
            }),
          ],
        }),
      ],
    });
const Da = new (class {
    constructor() {
      ((this.audioCache = new Map()),
        (this.isMuted = !1),
        (this.ambiencePlaying = null),
        (this.loadingPromises = new Map()),
        (this.maxCacheSize = 20),
        (this.preloadQueue = ['hover_glass', 'click_activate', 'success_chime']),
        this.preloadEssentialSounds());
    }
    async preloadEssentialSounds() {
      setTimeout(() => {
        this.preloadQueue.forEach(async e => {
          try {
            await this.loadSound(e);
          } catch (t) {}
        });
      }, 1e3);
    }
    cleanupCache() {
      if (this.audioCache.size <= this.maxCacheSize) return;
      const e = Array.from(this.audioCache.entries());
      e.slice(0, e.length - this.maxCacheSize).forEach(([e]) => {
        const t = this.audioCache.get(e);
        ((null == t ? void 0 : t.audio) && (t.audio.pause(), (t.audio.src = '')),
          this.audioCache.delete(e));
      });
    }
    loadSound(e) {
      if (this.loadingPromises.has(e)) return this.loadingPromises.get(e);
      const t = new Promise(t => {
        const a = this.audioCache.get(e);
        if (null == a ? void 0 : a.isLoaded) return void t(a.audio);
        const s = () => {
          const e = new Audio();
          return ((e.volume = 0), e);
        };
        (t =>
          new Promise(a => {
            const n = new Audio();
            ((n.src = t), (n.volume = 0.3), (n.preload = 'auto'));
            const i = setTimeout(() => {
              (console.warn(`[AudioService] Timeout loading ${e} from ${t}`), a(s()));
            }, 5e3);
            (n.addEventListener(
              'canplaythrough',
              () => {
                clearTimeout(i);
                const t = { audio: n, isLoaded: !0, error: !1 };
                (this.audioCache.set(e, t), this.cleanupCache(), a(n));
              },
              { once: !0 }
            ),
              n.addEventListener(
                'error',
                () => {
                  (clearTimeout(i),
                    console.debug(`[AudioService] Failed to load ${e} from ${t}`),
                    a(s()));
                },
                { once: !0 }
              ),
              n.load());
          }))(`/sounds/${e}.mp3`).then(a => {
          (this.loadingPromises.delete(e), t(a));
        });
      });
      return (this.loadingPromises.set(e, t), t);
    }
    async play(e) {
      var t, a;
      if (!this.isMuted)
        try {
          let n = null == (t = this.audioCache.get(e)) ? void 0 : t.audio;
          (n && (null == (a = this.audioCache.get(e)) ? void 0 : a.isLoaded)) ||
            (n = await this.loadSound(e));
          try {
            n.currentTime = 0;
            const t = n.play();
            void 0 !== t &&
              t.catch(t => {
                'NotAllowedError' !== t.name &&
                  console.debug(`[AudioService] Error playing ${e}:`, t);
              });
          } catch (s) {
            console.debug(`[AudioService] Playback error for ${e}:`, s);
          }
        } catch (n) {
          console.debug(`[AudioService] Failed to play ${e}:`, n);
        }
    }
    async startAmbience() {
      if (!this.isMuted && !this.ambiencePlaying)
        try {
          const t = await this.loadSound('nexus_hum');
          if (0 === t.volume) return;
          ((t.loop = !0), (t.volume = 0.05));
          try {
            (await t.play(), (this.ambiencePlaying = t));
          } catch (e) {
            console.debug('[AudioService] Ambience autoplay prevented:', e);
          }
        } catch (e) {
          console.debug('[AudioService] Error starting ambience:', e);
        }
    }
    stopAmbience() {
      this.ambiencePlaying &&
        (this.ambiencePlaying.pause(),
        (this.ambiencePlaying.currentTime = 0),
        (this.ambiencePlaying = null));
    }
    toggleMute() {
      return (
        (this.isMuted = !this.isMuted),
        this.isMuted &&
          (this.stopAmbience(),
          this.audioCache.forEach(e => {
            e.isLoaded && e.audio.pause();
          })),
        this.isMuted
      );
    }
    getMutedState() {
      return this.isMuted;
    }
    getCacheStats() {
      const e = Array.from(this.audioCache.values());
      return {
        size: e.length,
        loaded: e.filter(e => e.isLoaded && !e.error).length,
        errors: e.filter(e => e.error).length,
      };
    }
    destroy() {
      (this.stopAmbience(),
        this.audioCache.forEach(e => {
          e.audio && (e.audio.pause(), (e.audio.src = ''));
        }),
        this.audioCache.clear(),
        this.loadingPromises.clear());
    }
  })(),
  Ra = () => {
    const e = se.useCallback(e => {
        try {
          Da.play(e);
        } catch (t) {}
      }, []),
      t = se.useCallback(() => e('hover_glass'), [e]),
      a = se.useCallback(() => e('click_activate'), [e]),
      s = se.useCallback(() => e('wuaw_subtle'), [e]),
      n = se.useCallback(() => e('data_pulse'), [e]);
    return { play: e, playHover: t, playClick: a, playWuaw: s, playPulse: n };
  },
  La = () => {
    const { playHover: e, playClick: t } = Ra(),
      [a, s] = se.useState(!1),
      [n, i] = se.useState(''),
      [r, o] = se.useState(0),
      l = [
        {
          id: '1',
          icon: ee.jsx(xe, { className: 'w-4 h-4' }),
          title: 'Explorar Mapa Global',
          path: '/map',
          shortcut: 'G M',
        },
        {
          id: '2',
          icon: ee.jsx(fe, { className: 'w-4 h-4' }),
          title: 'Ver Planes y Precios',
          path: '/pricing',
          shortcut: 'P',
        },
        {
          id: '3',
          icon: ee.jsx(ve, { className: 'w-4 h-4' }),
          title: 'Contactar Ventas',
          path: '/contact',
          shortcut: 'C',
        },
        {
          id: '4',
          icon: ee.jsx(ge, { className: 'w-4 h-4' }),
          title: 'Documentación API',
          path: '/docs',
          shortcut: 'D',
        },
        {
          id: '5',
          icon: ee.jsx(be, { className: 'w-4 h-4' }),
          title: 'Estado del Sistema',
          path: '/status',
        },
        {
          id: '6',
          icon: ee.jsx(ye, { className: 'w-4 h-4' }),
          title: 'Iniciar Prueba Gratuita',
          action: () => alert('Starting Trial...'),
        },
      ].filter(e => e.title.toLowerCase().includes(n.toLowerCase()));
    (se.useEffect(() => {
      const n = n => {
        ('k' === n.key &&
          (n.metaKey || n.ctrlKey) &&
          (n.preventDefault(), a ? t() : e(), s(e => !e)),
          'Escape' === n.key && s(!1));
      };
      return (
        window.addEventListener('keydown', n),
        () => window.removeEventListener('keydown', n)
      );
    }, []),
      se.useEffect(() => {
        o(0);
      }, [n]));
    const c = e => {
      const t = l[e];
      t &&
        (t.action && t.action(), t.path && console.log(`Navigating to ${t.title}`), s(!1), i(''));
    };
    return ee.jsx(le, {
      children:
        a &&
        ee.jsxs('div', {
          className: 'fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] font-sans',
          children: [
            ee.jsx(oe.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              onClick: () => s(!1),
              className: 'absolute inset-0 bg-black/80 backdrop-blur-md',
            }),
            ee.jsxs(oe.div, {
              initial: { opacity: 0, scale: 0.95, y: -20 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.95, y: -20 },
              className:
                'relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col',
              children: [
                ee.jsxs('div', {
                  className: 'flex items-center px-4 py-4 border-b border-white/5',
                  children: [
                    ee.jsx(me, { className: 'w-5 h-5 text-nexus-cyan mr-3' }),
                    ee.jsx('input', {
                      autoFocus: !0,
                      type: 'text',
                      placeholder: 'Escribe un comando o busca...',
                      value: n,
                      onChange: e => i(e.target.value),
                      onKeyDown: e => {
                        ('ArrowDown' === e.key &&
                          (e.preventDefault(), o(e => Math.min(e + 1, l.length - 1))),
                          'ArrowUp' === e.key && (e.preventDefault(), o(e => Math.max(e - 1, 0))),
                          'Enter' === e.key && c(r));
                      },
                      className:
                        'w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg font-mono',
                    }),
                    ee.jsx('div', {
                      className:
                        'text-xs text-gray-400 font-mono border border-white/10 px-2 py-1 rounded',
                      children: 'ESC',
                    }),
                  ],
                }),
                ee.jsxs('div', {
                  className: 'max-h-[60vh] overflow-y-auto py-2',
                  children: [
                    l.map((e, t) =>
                      ee.jsxs(
                        'div',
                        {
                          onClick: () => c(t),
                          onMouseEnter: () => o(t),
                          className:
                            'px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ' +
                            (t === r
                              ? 'bg-nexus-cyan/10 border-l-2 border-nexus-cyan'
                              : 'border-l-2 border-transparent'),
                          children: [
                            ee.jsxs('div', {
                              className: 'flex items-center gap-3',
                              children: [
                                ee.jsx('div', {
                                  className:
                                    'p-2 rounded-lg ' +
                                    (t === r
                                      ? 'text-nexus-cyan bg-nexus-cyan/10'
                                      : 'text-gray-400 bg-white/5'),
                                  children: e.icon,
                                }),
                                ee.jsx('span', {
                                  className:
                                    'text-sm font-medium ' +
                                    (t === r ? 'text-white' : 'text-gray-400'),
                                  children: e.title,
                                }),
                              ],
                            }),
                            e.shortcut &&
                              ee.jsx('span', {
                                className: 'text-xs text-gray-500 font-mono tracking-widest',
                                children: e.shortcut,
                              }),
                          ],
                        },
                        e.id
                      )
                    ),
                    0 === l.length &&
                      ee.jsxs('div', {
                        className: 'px-4 py-8 text-center text-gray-500 text-sm',
                        children: ['No se encontraron resultados para "', n, '"'],
                      }),
                  ],
                }),
                ee.jsxs('div', {
                  className:
                    'px-4 py-2 bg-white/5 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono',
                  children: [
                    ee.jsx('span', { children: '↑↓ para navegar' }),
                    ee.jsx('span', { children: 'AIGESTION COMMAND CENTER v2.0' }),
                  ],
                }),
              ],
            }),
          ],
        }),
    });
  };
var za,
  Fa = {};
((za = Fa),
  (function () {
    var e = function () {
      this.init();
    };
    e.prototype = {
      init: function () {
        var e = this || t;
        return (
          (e._counter = 1e3),
          (e._html5AudioPool = []),
          (e.html5PoolSize = 10),
          (e._codecs = {}),
          (e._howls = []),
          (e._muted = !1),
          (e._volume = 1),
          (e._canPlayEvent = 'canplaythrough'),
          (e._navigator =
            'undefined' != typeof window && window.navigator ? window.navigator : null),
          (e.masterGain = null),
          (e.noAudio = !1),
          (e.usingWebAudio = !0),
          (e.autoSuspend = !0),
          (e.ctx = null),
          (e.autoUnlock = !0),
          e._setup(),
          e
        );
      },
      volume: function (e) {
        var a = this || t;
        if (((e = parseFloat(e)), a.ctx || c(), void 0 !== e && e >= 0 && e <= 1)) {
          if (((a._volume = e), a._muted)) return a;
          a.usingWebAudio && a.masterGain.gain.setValueAtTime(e, t.ctx.currentTime);
          for (var s = 0; s < a._howls.length; s++)
            if (!a._howls[s]._webAudio)
              for (var n = a._howls[s]._getSoundIds(), i = 0; i < n.length; i++) {
                var r = a._howls[s]._soundById(n[i]);
                r && r._node && (r._node.volume = r._volume * e);
              }
          return a;
        }
        return a._volume;
      },
      mute: function (e) {
        var a = this || t;
        (a.ctx || c(),
          (a._muted = e),
          a.usingWebAudio &&
            a.masterGain.gain.setValueAtTime(e ? 0 : a._volume, t.ctx.currentTime));
        for (var s = 0; s < a._howls.length; s++)
          if (!a._howls[s]._webAudio)
            for (var n = a._howls[s]._getSoundIds(), i = 0; i < n.length; i++) {
              var r = a._howls[s]._soundById(n[i]);
              r && r._node && (r._node.muted = !!e || r._muted);
            }
        return a;
      },
      stop: function () {
        for (var e = this || t, a = 0; a < e._howls.length; a++) e._howls[a].stop();
        return e;
      },
      unload: function () {
        for (var e = this || t, a = e._howls.length - 1; a >= 0; a--) e._howls[a].unload();
        return (
          e.usingWebAudio &&
            e.ctx &&
            void 0 !== e.ctx.close &&
            (e.ctx.close(), (e.ctx = null), c()),
          e
        );
      },
      codecs: function (e) {
        return (this || t)._codecs[e.replace(/^x-/, '')];
      },
      _setup: function () {
        var e = this || t;
        if (((e.state = (e.ctx && e.ctx.state) || 'suspended'), e._autoSuspend(), !e.usingWebAudio))
          if ('undefined' != typeof Audio)
            try {
              void 0 === new Audio().oncanplaythrough && (e._canPlayEvent = 'canplay');
            } catch (pi) {
              e.noAudio = !0;
            }
          else e.noAudio = !0;
        try {
          new Audio().muted && (e.noAudio = !0);
        } catch (pi) {}
        return (e.noAudio || e._setupCodecs(), e);
      },
      _setupCodecs: function () {
        var e = this || t,
          a = null;
        try {
          a = 'undefined' != typeof Audio ? new Audio() : null;
        } catch (d) {
          return e;
        }
        if (!a || 'function' != typeof a.canPlayType) return e;
        var s = a.canPlayType('audio/mpeg;').replace(/^no$/, ''),
          n = e._navigator ? e._navigator.userAgent : '',
          i = n.match(/OPR\/(\d+)/g),
          r = i && parseInt(i[0].split('/')[1], 10) < 33,
          o = -1 !== n.indexOf('Safari') && -1 === n.indexOf('Chrome'),
          l = n.match(/Version\/(.*?) /),
          c = o && l && parseInt(l[1], 10) < 15;
        return (
          (e._codecs = {
            mp3: !(r || (!s && !a.canPlayType('audio/mp3;').replace(/^no$/, ''))),
            mpeg: !!s,
            opus: !!a.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
            ogg: !!a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
            oga: !!a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
            wav: !!(a.canPlayType('audio/wav; codecs="1"') || a.canPlayType('audio/wav')).replace(
              /^no$/,
              ''
            ),
            aac: !!a.canPlayType('audio/aac;').replace(/^no$/, ''),
            caf: !!a.canPlayType('audio/x-caf;').replace(/^no$/, ''),
            m4a: !!(
              a.canPlayType('audio/x-m4a;') ||
              a.canPlayType('audio/m4a;') ||
              a.canPlayType('audio/aac;')
            ).replace(/^no$/, ''),
            m4b: !!(
              a.canPlayType('audio/x-m4b;') ||
              a.canPlayType('audio/m4b;') ||
              a.canPlayType('audio/aac;')
            ).replace(/^no$/, ''),
            mp4: !!(
              a.canPlayType('audio/x-mp4;') ||
              a.canPlayType('audio/mp4;') ||
              a.canPlayType('audio/aac;')
            ).replace(/^no$/, ''),
            weba: !(c || !a.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')),
            webm: !(c || !a.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')),
            dolby: !!a.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
            flac: !!(a.canPlayType('audio/x-flac;') || a.canPlayType('audio/flac;')).replace(
              /^no$/,
              ''
            ),
          }),
          e
        );
      },
      _unlockAudio: function () {
        var e = this || t;
        if (!e._audioUnlocked && e.ctx) {
          ((e._audioUnlocked = !1),
            (e.autoUnlock = !1),
            e._mobileUnloaded ||
              44100 === e.ctx.sampleRate ||
              ((e._mobileUnloaded = !0), e.unload()),
            (e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050)));
          var a = function (t) {
            for (; e._html5AudioPool.length < e.html5PoolSize; )
              try {
                var s = new Audio();
                ((s._unlocked = !0), e._releaseHtml5Audio(s));
              } catch (c) {
                e.noAudio = !0;
                break;
              }
            for (var n = 0; n < e._howls.length; n++)
              if (!e._howls[n]._webAudio)
                for (var i = e._howls[n]._getSoundIds(), r = 0; r < i.length; r++) {
                  var o = e._howls[n]._soundById(i[r]);
                  o && o._node && !o._node._unlocked && ((o._node._unlocked = !0), o._node.load());
                }
            e._autoResume();
            var l = e.ctx.createBufferSource();
            ((l.buffer = e._scratchBuffer),
              l.connect(e.ctx.destination),
              void 0 === l.start ? l.noteOn(0) : l.start(0),
              'function' == typeof e.ctx.resume && e.ctx.resume(),
              (l.onended = function () {
                (l.disconnect(0),
                  (e._audioUnlocked = !0),
                  document.removeEventListener('touchstart', a, !0),
                  document.removeEventListener('touchend', a, !0),
                  document.removeEventListener('click', a, !0),
                  document.removeEventListener('keydown', a, !0));
                for (var t = 0; t < e._howls.length; t++) e._howls[t]._emit('unlock');
              }));
          };
          return (
            document.addEventListener('touchstart', a, !0),
            document.addEventListener('touchend', a, !0),
            document.addEventListener('click', a, !0),
            document.addEventListener('keydown', a, !0),
            e
          );
        }
      },
      _obtainHtml5Audio: function () {
        var e = this || t;
        if (e._html5AudioPool.length) return e._html5AudioPool.pop();
        var a = new Audio().play();
        return (
          a &&
            'undefined' != typeof Promise &&
            (a instanceof Promise || 'function' == typeof a.then) &&
            a.catch(function () {
              console.warn(
                'HTML5 Audio pool exhausted, returning potentially locked audio object.'
              );
            }),
          new Audio()
        );
      },
      _releaseHtml5Audio: function (e) {
        var a = this || t;
        return (e._unlocked && a._html5AudioPool.push(e), a);
      },
      _autoSuspend: function () {
        var e = this;
        if (e.autoSuspend && e.ctx && void 0 !== e.ctx.suspend && t.usingWebAudio) {
          for (var a = 0; a < e._howls.length; a++)
            if (e._howls[a]._webAudio)
              for (var s = 0; s < e._howls[a]._sounds.length; s++)
                if (!e._howls[a]._sounds[s]._paused) return e;
          return (
            e._suspendTimer && clearTimeout(e._suspendTimer),
            (e._suspendTimer = setTimeout(function () {
              if (e.autoSuspend) {
                ((e._suspendTimer = null), (e.state = 'suspending'));
                var t = function () {
                  ((e.state = 'suspended'),
                    e._resumeAfterSuspend && (delete e._resumeAfterSuspend, e._autoResume()));
                };
                e.ctx.suspend().then(t, t);
              }
            }, 3e4)),
            e
          );
        }
      },
      _autoResume: function () {
        var e = this;
        if (e.ctx && void 0 !== e.ctx.resume && t.usingWebAudio)
          return (
            'running' === e.state && 'interrupted' !== e.ctx.state && e._suspendTimer
              ? (clearTimeout(e._suspendTimer), (e._suspendTimer = null))
              : 'suspended' === e.state || ('running' === e.state && 'interrupted' === e.ctx.state)
                ? (e.ctx.resume().then(function () {
                    e.state = 'running';
                    for (var t = 0; t < e._howls.length; t++) e._howls[t]._emit('resume');
                  }),
                  e._suspendTimer && (clearTimeout(e._suspendTimer), (e._suspendTimer = null)))
                : 'suspending' === e.state && (e._resumeAfterSuspend = !0),
            e
          );
      },
    };
    var t = new e(),
      a = function (e) {
        e.src && 0 !== e.src.length
          ? this.init(e)
          : console.error('An array of source files must be passed with any new Howl.');
      };
    a.prototype = {
      init: function (e) {
        var a = this;
        return (
          t.ctx || c(),
          (a._autoplay = e.autoplay || !1),
          (a._format = 'string' != typeof e.format ? e.format : [e.format]),
          (a._html5 = e.html5 || !1),
          (a._muted = e.mute || !1),
          (a._loop = e.loop || !1),
          (a._pool = e.pool || 5),
          (a._preload = ('boolean' != typeof e.preload && 'metadata' !== e.preload) || e.preload),
          (a._rate = e.rate || 1),
          (a._sprite = e.sprite || {}),
          (a._src = 'string' != typeof e.src ? e.src : [e.src]),
          (a._volume = void 0 !== e.volume ? e.volume : 1),
          (a._xhr = {
            method: e.xhr && e.xhr.method ? e.xhr.method : 'GET',
            headers: e.xhr && e.xhr.headers ? e.xhr.headers : null,
            withCredentials: !(!e.xhr || !e.xhr.withCredentials) && e.xhr.withCredentials,
          }),
          (a._duration = 0),
          (a._state = 'unloaded'),
          (a._sounds = []),
          (a._endTimers = {}),
          (a._queue = []),
          (a._playLock = !1),
          (a._onend = e.onend ? [{ fn: e.onend }] : []),
          (a._onfade = e.onfade ? [{ fn: e.onfade }] : []),
          (a._onload = e.onload ? [{ fn: e.onload }] : []),
          (a._onloaderror = e.onloaderror ? [{ fn: e.onloaderror }] : []),
          (a._onplayerror = e.onplayerror ? [{ fn: e.onplayerror }] : []),
          (a._onpause = e.onpause ? [{ fn: e.onpause }] : []),
          (a._onplay = e.onplay ? [{ fn: e.onplay }] : []),
          (a._onstop = e.onstop ? [{ fn: e.onstop }] : []),
          (a._onmute = e.onmute ? [{ fn: e.onmute }] : []),
          (a._onvolume = e.onvolume ? [{ fn: e.onvolume }] : []),
          (a._onrate = e.onrate ? [{ fn: e.onrate }] : []),
          (a._onseek = e.onseek ? [{ fn: e.onseek }] : []),
          (a._onunlock = e.onunlock ? [{ fn: e.onunlock }] : []),
          (a._onresume = []),
          (a._webAudio = t.usingWebAudio && !a._html5),
          void 0 !== t.ctx && t.ctx && t.autoUnlock && t._unlockAudio(),
          t._howls.push(a),
          a._autoplay &&
            a._queue.push({
              event: 'play',
              action: function () {
                a.play();
              },
            }),
          a._preload && 'none' !== a._preload && a.load(),
          a
        );
      },
      load: function () {
        var e = this,
          a = null;
        if (t.noAudio) e._emit('loaderror', null, 'No audio support.');
        else {
          'string' == typeof e._src && (e._src = [e._src]);
          for (var n = 0; n < e._src.length; n++) {
            var r, o;
            if (e._format && e._format[n]) r = e._format[n];
            else {
              if ('string' != typeof (o = e._src[n])) {
                e._emit(
                  'loaderror',
                  null,
                  'Non-string found in selected audio sources - ignoring.'
                );
                continue;
              }
              ((r = /^data:audio\/([^;,]+);/i.exec(o)) ||
                (r = /\.([^.]+)$/.exec(o.split('?', 1)[0])),
                r && (r = r[1].toLowerCase()));
            }
            if (
              (r ||
                console.warn(
                  'No file extension was found. Consider using the "format" property or specify an extension.'
                ),
              r && t.codecs(r))
            ) {
              a = e._src[n];
              break;
            }
          }
          if (a)
            return (
              (e._src = a),
              (e._state = 'loading'),
              'https:' === window.location.protocol &&
                'http:' === a.slice(0, 5) &&
                ((e._html5 = !0), (e._webAudio = !1)),
              new s(e),
              e._webAudio && i(e),
              e
            );
          e._emit('loaderror', null, 'No codec support for selected audio sources.');
        }
      },
      play: function (e, a) {
        var s = this,
          n = null;
        if ('number' == typeof e) ((n = e), (e = null));
        else {
          if ('string' == typeof e && 'loaded' === s._state && !s._sprite[e]) return null;
          if (void 0 === e && ((e = '__default'), !s._playLock)) {
            for (var i = 0, r = 0; r < s._sounds.length; r++)
              s._sounds[r]._paused && !s._sounds[r]._ended && (i++, (n = s._sounds[r]._id));
            1 === i ? (e = null) : (n = null);
          }
        }
        var o = n ? s._soundById(n) : s._inactiveSound();
        if (!o) return null;
        if ((n && !e && (e = o._sprite || '__default'), 'loaded' !== s._state)) {
          ((o._sprite = e), (o._ended = !1));
          var l = o._id;
          return (
            s._queue.push({
              event: 'play',
              action: function () {
                s.play(l);
              },
            }),
            l
          );
        }
        if (n && !o._paused) return (a || s._loadQueue('play'), o._id);
        s._webAudio && t._autoResume();
        var c = Math.max(0, o._seek > 0 ? o._seek : s._sprite[e][0] / 1e3),
          d = Math.max(0, (s._sprite[e][0] + s._sprite[e][1]) / 1e3 - c),
          u = (1e3 * d) / Math.abs(o._rate),
          h = s._sprite[e][0] / 1e3,
          p = (s._sprite[e][0] + s._sprite[e][1]) / 1e3;
        ((o._sprite = e), (o._ended = !1));
        var m = function () {
          ((o._paused = !1),
            (o._seek = c),
            (o._start = h),
            (o._stop = p),
            (o._loop = !(!o._loop && !s._sprite[e][2])));
        };
        if (!(c >= p)) {
          var x = o._node;
          if (s._webAudio) {
            var f = function () {
              ((s._playLock = !1), m(), s._refreshBuffer(o));
              var e = o._muted || s._muted ? 0 : o._volume;
              (x.gain.setValueAtTime(e, t.ctx.currentTime),
                (o._playStart = t.ctx.currentTime),
                void 0 === x.bufferSource.start
                  ? o._loop
                    ? x.bufferSource.noteGrainOn(0, c, 86400)
                    : x.bufferSource.noteGrainOn(0, c, d)
                  : o._loop
                    ? x.bufferSource.start(0, c, 86400)
                    : x.bufferSource.start(0, c, d),
                u !== 1 / 0 && (s._endTimers[o._id] = setTimeout(s._ended.bind(s, o), u)),
                a ||
                  setTimeout(function () {
                    (s._emit('play', o._id), s._loadQueue());
                  }, 0));
            };
            'running' === t.state && 'interrupted' !== t.ctx.state
              ? f()
              : ((s._playLock = !0), s.once('resume', f), s._clearTimer(o._id));
          } else {
            var v = function () {
              ((x.currentTime = c),
                (x.muted = o._muted || s._muted || t._muted || x.muted),
                (x.volume = o._volume * t.volume()),
                (x.playbackRate = o._rate));
              try {
                var n = x.play();
                if (
                  (n &&
                  'undefined' != typeof Promise &&
                  (n instanceof Promise || 'function' == typeof n.then)
                    ? ((s._playLock = !0),
                      m(),
                      n
                        .then(function () {
                          ((s._playLock = !1),
                            (x._unlocked = !0),
                            a ? s._loadQueue() : s._emit('play', o._id));
                        })
                        .catch(function () {
                          ((s._playLock = !1),
                            s._emit(
                              'playerror',
                              o._id,
                              'Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.'
                            ),
                            (o._ended = !0),
                            (o._paused = !0));
                        }))
                    : a || ((s._playLock = !1), m(), s._emit('play', o._id)),
                  (x.playbackRate = o._rate),
                  x.paused)
                )
                  return void s._emit(
                    'playerror',
                    o._id,
                    'Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.'
                  );
                '__default' !== e || o._loop
                  ? (s._endTimers[o._id] = setTimeout(s._ended.bind(s, o), u))
                  : ((s._endTimers[o._id] = function () {
                      (s._ended(o), x.removeEventListener('ended', s._endTimers[o._id], !1));
                    }),
                    x.addEventListener('ended', s._endTimers[o._id], !1));
              } catch (i) {
                s._emit('playerror', o._id, i);
              }
            };
            'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA' ===
              x.src && ((x.src = s._src), x.load());
            var g = (window && window.ejecta) || (!x.readyState && t._navigator.isCocoonJS);
            if (x.readyState >= 3 || g) v();
            else {
              ((s._playLock = !0), (s._state = 'loading'));
              var b = function () {
                ((s._state = 'loaded'), v(), x.removeEventListener(t._canPlayEvent, b, !1));
              };
              (x.addEventListener(t._canPlayEvent, b, !1), s._clearTimer(o._id));
            }
          }
          return o._id;
        }
        s._ended(o);
      },
      pause: function (e) {
        var t = this;
        if ('loaded' !== t._state || t._playLock)
          return (
            t._queue.push({
              event: 'pause',
              action: function () {
                t.pause(e);
              },
            }),
            t
          );
        for (var a = t._getSoundIds(e), s = 0; s < a.length; s++) {
          t._clearTimer(a[s]);
          var n = t._soundById(a[s]);
          if (
            n &&
            !n._paused &&
            ((n._seek = t.seek(a[s])),
            (n._rateSeek = 0),
            (n._paused = !0),
            t._stopFade(a[s]),
            n._node)
          )
            if (t._webAudio) {
              if (!n._node.bufferSource) continue;
              (void 0 === n._node.bufferSource.stop
                ? n._node.bufferSource.noteOff(0)
                : n._node.bufferSource.stop(0),
                t._cleanBuffer(n._node));
            } else (isNaN(n._node.duration) && n._node.duration !== 1 / 0) || n._node.pause();
          arguments[1] || t._emit('pause', n ? n._id : null);
        }
        return t;
      },
      stop: function (e, t) {
        var a = this;
        if ('loaded' !== a._state || a._playLock)
          return (
            a._queue.push({
              event: 'stop',
              action: function () {
                a.stop(e);
              },
            }),
            a
          );
        for (var s = a._getSoundIds(e), n = 0; n < s.length; n++) {
          a._clearTimer(s[n]);
          var i = a._soundById(s[n]);
          i &&
            ((i._seek = i._start || 0),
            (i._rateSeek = 0),
            (i._paused = !0),
            (i._ended = !0),
            a._stopFade(s[n]),
            i._node &&
              (a._webAudio
                ? i._node.bufferSource &&
                  (void 0 === i._node.bufferSource.stop
                    ? i._node.bufferSource.noteOff(0)
                    : i._node.bufferSource.stop(0),
                  a._cleanBuffer(i._node))
                : (isNaN(i._node.duration) && i._node.duration !== 1 / 0) ||
                  ((i._node.currentTime = i._start || 0),
                  i._node.pause(),
                  i._node.duration === 1 / 0 && a._clearSound(i._node))),
            t || a._emit('stop', i._id));
        }
        return a;
      },
      mute: function (e, a) {
        var s = this;
        if ('loaded' !== s._state || s._playLock)
          return (
            s._queue.push({
              event: 'mute',
              action: function () {
                s.mute(e, a);
              },
            }),
            s
          );
        if (void 0 === a) {
          if ('boolean' != typeof e) return s._muted;
          s._muted = e;
        }
        for (var n = s._getSoundIds(a), i = 0; i < n.length; i++) {
          var r = s._soundById(n[i]);
          r &&
            ((r._muted = e),
            r._interval && s._stopFade(r._id),
            s._webAudio && r._node
              ? r._node.gain.setValueAtTime(e ? 0 : r._volume, t.ctx.currentTime)
              : r._node && (r._node.muted = !!t._muted || e),
            s._emit('mute', r._id));
        }
        return s;
      },
      volume: function () {
        var e,
          a,
          s,
          n = this,
          i = arguments;
        if (0 === i.length) return n._volume;
        if (
          (1 === i.length || (2 === i.length && void 0 === i[1])
            ? n._getSoundIds().indexOf(i[0]) >= 0
              ? (a = parseInt(i[0], 10))
              : (e = parseFloat(i[0]))
            : i.length >= 2 && ((e = parseFloat(i[0])), (a = parseInt(i[1], 10))),
          !(void 0 !== e && e >= 0 && e <= 1))
        )
          return (s = a ? n._soundById(a) : n._sounds[0]) ? s._volume : 0;
        if ('loaded' !== n._state || n._playLock)
          return (
            n._queue.push({
              event: 'volume',
              action: function () {
                n.volume.apply(n, i);
              },
            }),
            n
          );
        (void 0 === a && (n._volume = e), (a = n._getSoundIds(a)));
        for (var r = 0; r < a.length; r++)
          (s = n._soundById(a[r])) &&
            ((s._volume = e),
            i[2] || n._stopFade(a[r]),
            n._webAudio && s._node && !s._muted
              ? s._node.gain.setValueAtTime(e, t.ctx.currentTime)
              : s._node && !s._muted && (s._node.volume = e * t.volume()),
            n._emit('volume', s._id));
        return n;
      },
      fade: function (e, a, s, n) {
        var i = this;
        if ('loaded' !== i._state || i._playLock)
          return (
            i._queue.push({
              event: 'fade',
              action: function () {
                i.fade(e, a, s, n);
              },
            }),
            i
          );
        ((e = Math.min(Math.max(0, parseFloat(e)), 1)),
          (a = Math.min(Math.max(0, parseFloat(a)), 1)),
          (s = parseFloat(s)),
          i.volume(e, n));
        for (var r = i._getSoundIds(n), o = 0; o < r.length; o++) {
          var l = i._soundById(r[o]);
          if (l) {
            if ((n || i._stopFade(r[o]), i._webAudio && !l._muted)) {
              var c = t.ctx.currentTime,
                d = c + s / 1e3;
              ((l._volume = e),
                l._node.gain.setValueAtTime(e, c),
                l._node.gain.linearRampToValueAtTime(a, d));
            }
            i._startFadeInterval(l, e, a, s, r[o], void 0 === n);
          }
        }
        return i;
      },
      _startFadeInterval: function (e, t, a, s, n, i) {
        var r = this,
          o = t,
          l = a - t,
          c = Math.abs(l / 0.01),
          d = Math.max(4, c > 0 ? s / c : s),
          u = Date.now();
        ((e._fadeTo = a),
          (e._interval = setInterval(function () {
            var n = (Date.now() - u) / s;
            ((u = Date.now()),
              (o += l * n),
              (o = Math.round(100 * o) / 100),
              (o = l < 0 ? Math.max(a, o) : Math.min(a, o)),
              r._webAudio ? (e._volume = o) : r.volume(o, e._id, !0),
              i && (r._volume = o),
              ((a < t && o <= a) || (a > t && o >= a)) &&
                (clearInterval(e._interval),
                (e._interval = null),
                (e._fadeTo = null),
                r.volume(a, e._id),
                r._emit('fade', e._id)));
          }, d)));
      },
      _stopFade: function (e) {
        var a = this,
          s = a._soundById(e);
        return (
          s &&
            s._interval &&
            (a._webAudio && s._node.gain.cancelScheduledValues(t.ctx.currentTime),
            clearInterval(s._interval),
            (s._interval = null),
            a.volume(s._fadeTo, e),
            (s._fadeTo = null),
            a._emit('fade', e)),
          a
        );
      },
      loop: function () {
        var e,
          t,
          a,
          s = this,
          n = arguments;
        if (0 === n.length) return s._loop;
        if (1 === n.length) {
          if ('boolean' != typeof n[0]) return !!(a = s._soundById(parseInt(n[0], 10))) && a._loop;
          ((e = n[0]), (s._loop = e));
        } else 2 === n.length && ((e = n[0]), (t = parseInt(n[1], 10)));
        for (var i = s._getSoundIds(t), r = 0; r < i.length; r++)
          (a = s._soundById(i[r])) &&
            ((a._loop = e),
            s._webAudio &&
              a._node &&
              a._node.bufferSource &&
              ((a._node.bufferSource.loop = e),
              e &&
                ((a._node.bufferSource.loopStart = a._start || 0),
                (a._node.bufferSource.loopEnd = a._stop),
                s.playing(i[r]) && (s.pause(i[r], !0), s.play(i[r], !0)))));
        return s;
      },
      rate: function () {
        var e,
          a,
          s,
          n = this,
          i = arguments;
        if (
          (0 === i.length
            ? (a = n._sounds[0]._id)
            : 1 === i.length
              ? n._getSoundIds().indexOf(i[0]) >= 0
                ? (a = parseInt(i[0], 10))
                : (e = parseFloat(i[0]))
              : 2 === i.length && ((e = parseFloat(i[0])), (a = parseInt(i[1], 10))),
          'number' != typeof e)
        )
          return (s = n._soundById(a)) ? s._rate : n._rate;
        if ('loaded' !== n._state || n._playLock)
          return (
            n._queue.push({
              event: 'rate',
              action: function () {
                n.rate.apply(n, i);
              },
            }),
            n
          );
        (void 0 === a && (n._rate = e), (a = n._getSoundIds(a)));
        for (var r = 0; r < a.length; r++)
          if ((s = n._soundById(a[r]))) {
            (n.playing(a[r]) &&
              ((s._rateSeek = n.seek(a[r])),
              (s._playStart = n._webAudio ? t.ctx.currentTime : s._playStart)),
              (s._rate = e),
              n._webAudio && s._node && s._node.bufferSource
                ? s._node.bufferSource.playbackRate.setValueAtTime(e, t.ctx.currentTime)
                : s._node && (s._node.playbackRate = e));
            var o = n.seek(a[r]),
              l =
                (1e3 * ((n._sprite[s._sprite][0] + n._sprite[s._sprite][1]) / 1e3 - o)) /
                Math.abs(s._rate);
            ((!n._endTimers[a[r]] && s._paused) ||
              (n._clearTimer(a[r]), (n._endTimers[a[r]] = setTimeout(n._ended.bind(n, s), l))),
              n._emit('rate', s._id));
          }
        return n;
      },
      seek: function () {
        var e,
          a,
          s = this,
          n = arguments;
        if (
          (0 === n.length
            ? s._sounds.length && (a = s._sounds[0]._id)
            : 1 === n.length
              ? s._getSoundIds().indexOf(n[0]) >= 0
                ? (a = parseInt(n[0], 10))
                : s._sounds.length && ((a = s._sounds[0]._id), (e = parseFloat(n[0])))
              : 2 === n.length && ((e = parseFloat(n[0])), (a = parseInt(n[1], 10))),
          void 0 === a)
        )
          return 0;
        if ('number' == typeof e && ('loaded' !== s._state || s._playLock))
          return (
            s._queue.push({
              event: 'seek',
              action: function () {
                s.seek.apply(s, n);
              },
            }),
            s
          );
        var i = s._soundById(a);
        if (i) {
          if (!('number' == typeof e && e >= 0)) {
            if (s._webAudio) {
              var r = s.playing(a) ? t.ctx.currentTime - i._playStart : 0,
                o = i._rateSeek ? i._rateSeek - i._seek : 0;
              return i._seek + (o + r * Math.abs(i._rate));
            }
            return i._node.currentTime;
          }
          var l = s.playing(a);
          (l && s.pause(a, !0),
            (i._seek = e),
            (i._ended = !1),
            s._clearTimer(a),
            s._webAudio || !i._node || isNaN(i._node.duration) || (i._node.currentTime = e));
          var c = function () {
            (l && s.play(a, !0), s._emit('seek', a));
          };
          if (l && !s._webAudio) {
            var d = function () {
              s._playLock ? setTimeout(d, 0) : c();
            };
            setTimeout(d, 0);
          } else c();
        }
        return s;
      },
      playing: function (e) {
        var t = this;
        if ('number' == typeof e) {
          var a = t._soundById(e);
          return !!a && !a._paused;
        }
        for (var s = 0; s < t._sounds.length; s++) if (!t._sounds[s]._paused) return !0;
        return !1;
      },
      duration: function (e) {
        var t = this,
          a = t._duration,
          s = t._soundById(e);
        return (s && (a = t._sprite[s._sprite][1] / 1e3), a);
      },
      state: function () {
        return this._state;
      },
      unload: function () {
        for (var e = this, a = e._sounds, s = 0; s < a.length; s++)
          (a[s]._paused || e.stop(a[s]._id),
            e._webAudio ||
              (e._clearSound(a[s]._node),
              a[s]._node.removeEventListener('error', a[s]._errorFn, !1),
              a[s]._node.removeEventListener(t._canPlayEvent, a[s]._loadFn, !1),
              a[s]._node.removeEventListener('ended', a[s]._endFn, !1),
              t._releaseHtml5Audio(a[s]._node)),
            delete a[s]._node,
            e._clearTimer(a[s]._id));
        var i = t._howls.indexOf(e);
        i >= 0 && t._howls.splice(i, 1);
        var r = !0;
        for (s = 0; s < t._howls.length; s++)
          if (t._howls[s]._src === e._src || e._src.indexOf(t._howls[s]._src) >= 0) {
            r = !1;
            break;
          }
        return (
          n && r && delete n[e._src],
          (t.noAudio = !1),
          (e._state = 'unloaded'),
          (e._sounds = []),
          (e = null),
          null
        );
      },
      on: function (e, t, a, s) {
        var n = this['_on' + e];
        return (
          'function' == typeof t && n.push(s ? { id: a, fn: t, once: s } : { id: a, fn: t }),
          this
        );
      },
      off: function (e, t, a) {
        var s = this,
          n = s['_on' + e],
          i = 0;
        if (('number' == typeof t && ((a = t), (t = null)), t || a))
          for (i = 0; i < n.length; i++) {
            var r = a === n[i].id;
            if ((t === n[i].fn && r) || (!t && r)) {
              n.splice(i, 1);
              break;
            }
          }
        else if (e) s['_on' + e] = [];
        else {
          var o = Object.keys(s);
          for (i = 0; i < o.length; i++)
            0 === o[i].indexOf('_on') && Array.isArray(s[o[i]]) && (s[o[i]] = []);
        }
        return s;
      },
      once: function (e, t, a) {
        return (this.on(e, t, a, 1), this);
      },
      _emit: function (e, t, a) {
        for (var s = this, n = s['_on' + e], i = n.length - 1; i >= 0; i--)
          (n[i].id && n[i].id !== t && 'load' !== e) ||
            (setTimeout(
              function (e) {
                e.call(this, t, a);
              }.bind(s, n[i].fn),
              0
            ),
            n[i].once && s.off(e, n[i].fn, n[i].id));
        return (s._loadQueue(e), s);
      },
      _loadQueue: function (e) {
        var t = this;
        if (t._queue.length > 0) {
          var a = t._queue[0];
          (a.event === e && (t._queue.shift(), t._loadQueue()), e || a.action());
        }
        return t;
      },
      _ended: function (e) {
        var a = this,
          s = e._sprite;
        if (
          !a._webAudio &&
          e._node &&
          !e._node.paused &&
          !e._node.ended &&
          e._node.currentTime < e._stop
        )
          return (setTimeout(a._ended.bind(a, e), 100), a);
        var n = !(!e._loop && !a._sprite[s][2]);
        if (
          (a._emit('end', e._id),
          !a._webAudio && n && a.stop(e._id, !0).play(e._id),
          a._webAudio && n)
        ) {
          (a._emit('play', e._id),
            (e._seek = e._start || 0),
            (e._rateSeek = 0),
            (e._playStart = t.ctx.currentTime));
          var i = (1e3 * (e._stop - e._start)) / Math.abs(e._rate);
          a._endTimers[e._id] = setTimeout(a._ended.bind(a, e), i);
        }
        return (
          a._webAudio &&
            !n &&
            ((e._paused = !0),
            (e._ended = !0),
            (e._seek = e._start || 0),
            (e._rateSeek = 0),
            a._clearTimer(e._id),
            a._cleanBuffer(e._node),
            t._autoSuspend()),
          a._webAudio || n || a.stop(e._id, !0),
          a
        );
      },
      _clearTimer: function (e) {
        var t = this;
        if (t._endTimers[e]) {
          if ('function' != typeof t._endTimers[e]) clearTimeout(t._endTimers[e]);
          else {
            var a = t._soundById(e);
            a && a._node && a._node.removeEventListener('ended', t._endTimers[e], !1);
          }
          delete t._endTimers[e];
        }
        return t;
      },
      _soundById: function (e) {
        for (var t = this, a = 0; a < t._sounds.length; a++)
          if (e === t._sounds[a]._id) return t._sounds[a];
        return null;
      },
      _inactiveSound: function () {
        var e = this;
        e._drain();
        for (var t = 0; t < e._sounds.length; t++)
          if (e._sounds[t]._ended) return e._sounds[t].reset();
        return new s(e);
      },
      _drain: function () {
        var e = this,
          t = e._pool,
          a = 0,
          s = 0;
        if (!(e._sounds.length < t)) {
          for (s = 0; s < e._sounds.length; s++) e._sounds[s]._ended && a++;
          for (s = e._sounds.length - 1; s >= 0; s--) {
            if (a <= t) return;
            e._sounds[s]._ended &&
              (e._webAudio && e._sounds[s]._node && e._sounds[s]._node.disconnect(0),
              e._sounds.splice(s, 1),
              a--);
          }
        }
      },
      _getSoundIds: function (e) {
        if (void 0 === e) {
          for (var t = [], a = 0; a < this._sounds.length; a++) t.push(this._sounds[a]._id);
          return t;
        }
        return [e];
      },
      _refreshBuffer: function (e) {
        return (
          (e._node.bufferSource = t.ctx.createBufferSource()),
          (e._node.bufferSource.buffer = n[this._src]),
          e._panner
            ? e._node.bufferSource.connect(e._panner)
            : e._node.bufferSource.connect(e._node),
          (e._node.bufferSource.loop = e._loop),
          e._loop &&
            ((e._node.bufferSource.loopStart = e._start || 0),
            (e._node.bufferSource.loopEnd = e._stop || 0)),
          e._node.bufferSource.playbackRate.setValueAtTime(e._rate, t.ctx.currentTime),
          this
        );
      },
      _cleanBuffer: function (e) {
        var a = t._navigator && t._navigator.vendor.indexOf('Apple') >= 0;
        if (!e.bufferSource) return this;
        if (
          t._scratchBuffer &&
          e.bufferSource &&
          ((e.bufferSource.onended = null), e.bufferSource.disconnect(0), a)
        )
          try {
            e.bufferSource.buffer = t._scratchBuffer;
          } catch (pi) {}
        return ((e.bufferSource = null), this);
      },
      _clearSound: function (e) {
        /MSIE |Trident\//.test(t._navigator && t._navigator.userAgent) ||
          (e.src =
            'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      },
    };
    var s = function (e) {
      ((this._parent = e), this.init());
    };
    s.prototype = {
      init: function () {
        var e = this,
          a = e._parent;
        return (
          (e._muted = a._muted),
          (e._loop = a._loop),
          (e._volume = a._volume),
          (e._rate = a._rate),
          (e._seek = 0),
          (e._paused = !0),
          (e._ended = !0),
          (e._sprite = '__default'),
          (e._id = ++t._counter),
          a._sounds.push(e),
          e.create(),
          e
        );
      },
      create: function () {
        var e = this,
          a = e._parent,
          s = t._muted || e._muted || e._parent._muted ? 0 : e._volume;
        return (
          a._webAudio
            ? ((e._node =
                void 0 === t.ctx.createGain ? t.ctx.createGainNode() : t.ctx.createGain()),
              e._node.gain.setValueAtTime(s, t.ctx.currentTime),
              (e._node.paused = !0),
              e._node.connect(t.masterGain))
            : t.noAudio ||
              ((e._node = t._obtainHtml5Audio()),
              (e._errorFn = e._errorListener.bind(e)),
              e._node.addEventListener('error', e._errorFn, !1),
              (e._loadFn = e._loadListener.bind(e)),
              e._node.addEventListener(t._canPlayEvent, e._loadFn, !1),
              (e._endFn = e._endListener.bind(e)),
              e._node.addEventListener('ended', e._endFn, !1),
              (e._node.src = a._src),
              (e._node.preload = !0 === a._preload ? 'auto' : a._preload),
              (e._node.volume = s * t.volume()),
              e._node.load()),
          e
        );
      },
      reset: function () {
        var e = this,
          a = e._parent;
        return (
          (e._muted = a._muted),
          (e._loop = a._loop),
          (e._volume = a._volume),
          (e._rate = a._rate),
          (e._seek = 0),
          (e._rateSeek = 0),
          (e._paused = !0),
          (e._ended = !0),
          (e._sprite = '__default'),
          (e._id = ++t._counter),
          e
        );
      },
      _errorListener: function () {
        var e = this;
        (e._parent._emit('loaderror', e._id, e._node.error ? e._node.error.code : 0),
          e._node.removeEventListener('error', e._errorFn, !1));
      },
      _loadListener: function () {
        var e = this,
          a = e._parent;
        ((a._duration = Math.ceil(10 * e._node.duration) / 10),
          0 === Object.keys(a._sprite).length &&
            (a._sprite = { __default: [0, 1e3 * a._duration] }),
          'loaded' !== a._state && ((a._state = 'loaded'), a._emit('load'), a._loadQueue()),
          e._node.removeEventListener(t._canPlayEvent, e._loadFn, !1));
      },
      _endListener: function () {
        var e = this,
          t = e._parent;
        (t._duration === 1 / 0 &&
          ((t._duration = Math.ceil(10 * e._node.duration) / 10),
          t._sprite.__default[1] === 1 / 0 && (t._sprite.__default[1] = 1e3 * t._duration),
          t._ended(e)),
          e._node.removeEventListener('ended', e._endFn, !1));
      },
    };
    var n = {},
      i = function (e) {
        var t = e._src;
        if (n[t]) return ((e._duration = n[t].duration), void l(e));
        if (/^data:[^;]+;base64,/.test(t)) {
          for (
            var a = atob(t.split(',')[1]), s = new Uint8Array(a.length), i = 0;
            i < a.length;
            ++i
          )
            s[i] = a.charCodeAt(i);
          o(s.buffer, e);
        } else {
          var c = new XMLHttpRequest();
          (c.open(e._xhr.method, t, !0),
            (c.withCredentials = e._xhr.withCredentials),
            (c.responseType = 'arraybuffer'),
            e._xhr.headers &&
              Object.keys(e._xhr.headers).forEach(function (t) {
                c.setRequestHeader(t, e._xhr.headers[t]);
              }),
            (c.onload = function () {
              var t = (c.status + '')[0];
              '0' === t || '2' === t || '3' === t
                ? o(c.response, e)
                : e._emit(
                    'loaderror',
                    null,
                    'Failed loading audio file with status: ' + c.status + '.'
                  );
            }),
            (c.onerror = function () {
              e._webAudio &&
                ((e._html5 = !0), (e._webAudio = !1), (e._sounds = []), delete n[t], e.load());
            }),
            r(c));
        }
      },
      r = function (e) {
        try {
          e.send();
        } catch (pi) {
          e.onerror();
        }
      },
      o = function (e, a) {
        var s = function () {
            a._emit('loaderror', null, 'Decoding audio data failed.');
          },
          i = function (e) {
            e && a._sounds.length > 0 ? ((n[a._src] = e), l(a, e)) : s();
          };
        'undefined' != typeof Promise && 1 === t.ctx.decodeAudioData.length
          ? t.ctx.decodeAudioData(e).then(i).catch(s)
          : t.ctx.decodeAudioData(e, i, s);
      },
      l = function (e, t) {
        (t && !e._duration && (e._duration = t.duration),
          0 === Object.keys(e._sprite).length &&
            (e._sprite = { __default: [0, 1e3 * e._duration] }),
          'loaded' !== e._state && ((e._state = 'loaded'), e._emit('load'), e._loadQueue()));
      },
      c = function () {
        if (t.usingWebAudio) {
          try {
            'undefined' != typeof AudioContext
              ? (t.ctx = new AudioContext())
              : 'undefined' != typeof webkitAudioContext
                ? (t.ctx = new webkitAudioContext())
                : (t.usingWebAudio = !1);
          } catch (pi) {
            t.usingWebAudio = !1;
          }
          t.ctx || (t.usingWebAudio = !1);
          var e = /iP(hone|od|ad)/.test(t._navigator && t._navigator.platform),
            a = t._navigator && t._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
            s = a ? parseInt(a[1], 10) : null;
          if (e && s && s < 9) {
            var n = /safari/.test(t._navigator && t._navigator.userAgent.toLowerCase());
            t._navigator && !n && (t.usingWebAudio = !1);
          }
          (t.usingWebAudio &&
            ((t.masterGain =
              void 0 === t.ctx.createGain ? t.ctx.createGainNode() : t.ctx.createGain()),
            t.masterGain.gain.setValueAtTime(t._muted ? 0 : t._volume, t.ctx.currentTime),
            t.masterGain.connect(t.ctx.destination)),
            t._setup());
        }
      };
    ((za.Howler = t),
      (za.Howl = a),
      void 0 !== ie
        ? ((ie.HowlerGlobal = e), (ie.Howler = t), (ie.Howl = a), (ie.Sound = s))
        : 'undefined' != typeof window &&
          ((window.HowlerGlobal = e), (window.Howler = t), (window.Howl = a), (window.Sound = s)));
  })(),
  (function () {
    ((HowlerGlobal.prototype._pos = [0, 0, 0]),
      (HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0]),
      (HowlerGlobal.prototype.stereo = function (e) {
        var t = this;
        if (!t.ctx || !t.ctx.listener) return t;
        for (var a = t._howls.length - 1; a >= 0; a--) t._howls[a].stereo(e);
        return t;
      }),
      (HowlerGlobal.prototype.pos = function (e, t, a) {
        var s = this;
        return s.ctx && s.ctx.listener
          ? ((t = 'number' != typeof t ? s._pos[1] : t),
            (a = 'number' != typeof a ? s._pos[2] : a),
            'number' != typeof e
              ? s._pos
              : ((s._pos = [e, t, a]),
                void 0 !== s.ctx.listener.positionX
                  ? (s.ctx.listener.positionX.setTargetAtTime(
                      s._pos[0],
                      Howler.ctx.currentTime,
                      0.1
                    ),
                    s.ctx.listener.positionY.setTargetAtTime(
                      s._pos[1],
                      Howler.ctx.currentTime,
                      0.1
                    ),
                    s.ctx.listener.positionZ.setTargetAtTime(
                      s._pos[2],
                      Howler.ctx.currentTime,
                      0.1
                    ))
                  : s.ctx.listener.setPosition(s._pos[0], s._pos[1], s._pos[2]),
                s))
          : s;
      }),
      (HowlerGlobal.prototype.orientation = function (e, t, a, s, n, i) {
        var r = this;
        if (!r.ctx || !r.ctx.listener) return r;
        var o = r._orientation;
        return (
          (t = 'number' != typeof t ? o[1] : t),
          (a = 'number' != typeof a ? o[2] : a),
          (s = 'number' != typeof s ? o[3] : s),
          (n = 'number' != typeof n ? o[4] : n),
          (i = 'number' != typeof i ? o[5] : i),
          'number' != typeof e
            ? o
            : ((r._orientation = [e, t, a, s, n, i]),
              void 0 !== r.ctx.listener.forwardX
                ? (r.ctx.listener.forwardX.setTargetAtTime(e, Howler.ctx.currentTime, 0.1),
                  r.ctx.listener.forwardY.setTargetAtTime(t, Howler.ctx.currentTime, 0.1),
                  r.ctx.listener.forwardZ.setTargetAtTime(a, Howler.ctx.currentTime, 0.1),
                  r.ctx.listener.upX.setTargetAtTime(s, Howler.ctx.currentTime, 0.1),
                  r.ctx.listener.upY.setTargetAtTime(n, Howler.ctx.currentTime, 0.1),
                  r.ctx.listener.upZ.setTargetAtTime(i, Howler.ctx.currentTime, 0.1))
                : r.ctx.listener.setOrientation(e, t, a, s, n, i),
              r)
        );
      }),
      (Howl.prototype.init = (function (e) {
        return function (t) {
          var a = this;
          return (
            (a._orientation = t.orientation || [1, 0, 0]),
            (a._stereo = t.stereo || null),
            (a._pos = t.pos || null),
            (a._pannerAttr = {
              coneInnerAngle: void 0 !== t.coneInnerAngle ? t.coneInnerAngle : 360,
              coneOuterAngle: void 0 !== t.coneOuterAngle ? t.coneOuterAngle : 360,
              coneOuterGain: void 0 !== t.coneOuterGain ? t.coneOuterGain : 0,
              distanceModel: void 0 !== t.distanceModel ? t.distanceModel : 'inverse',
              maxDistance: void 0 !== t.maxDistance ? t.maxDistance : 1e4,
              panningModel: void 0 !== t.panningModel ? t.panningModel : 'HRTF',
              refDistance: void 0 !== t.refDistance ? t.refDistance : 1,
              rolloffFactor: void 0 !== t.rolloffFactor ? t.rolloffFactor : 1,
            }),
            (a._onstereo = t.onstereo ? [{ fn: t.onstereo }] : []),
            (a._onpos = t.onpos ? [{ fn: t.onpos }] : []),
            (a._onorientation = t.onorientation ? [{ fn: t.onorientation }] : []),
            e.call(this, t)
          );
        };
      })(Howl.prototype.init)),
      (Howl.prototype.stereo = function (t, a) {
        var s = this;
        if (!s._webAudio) return s;
        if ('loaded' !== s._state)
          return (
            s._queue.push({
              event: 'stereo',
              action: function () {
                s.stereo(t, a);
              },
            }),
            s
          );
        var n = void 0 === Howler.ctx.createStereoPanner ? 'spatial' : 'stereo';
        if (void 0 === a) {
          if ('number' != typeof t) return s._stereo;
          ((s._stereo = t), (s._pos = [t, 0, 0]));
        }
        for (var i = s._getSoundIds(a), r = 0; r < i.length; r++) {
          var o = s._soundById(i[r]);
          if (o) {
            if ('number' != typeof t) return o._stereo;
            ((o._stereo = t),
              (o._pos = [t, 0, 0]),
              o._node &&
                ((o._pannerAttr.panningModel = 'equalpower'),
                (o._panner && o._panner.pan) || e(o, n),
                'spatial' === n
                  ? void 0 !== o._panner.positionX
                    ? (o._panner.positionX.setValueAtTime(t, Howler.ctx.currentTime),
                      o._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime),
                      o._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime))
                    : o._panner.setPosition(t, 0, 0)
                  : o._panner.pan.setValueAtTime(t, Howler.ctx.currentTime)),
              s._emit('stereo', o._id));
          }
        }
        return s;
      }),
      (Howl.prototype.pos = function (t, a, s, n) {
        var i = this;
        if (!i._webAudio) return i;
        if ('loaded' !== i._state)
          return (
            i._queue.push({
              event: 'pos',
              action: function () {
                i.pos(t, a, s, n);
              },
            }),
            i
          );
        if (
          ((a = 'number' != typeof a ? 0 : a), (s = 'number' != typeof s ? -0.5 : s), void 0 === n)
        ) {
          if ('number' != typeof t) return i._pos;
          i._pos = [t, a, s];
        }
        for (var r = i._getSoundIds(n), o = 0; o < r.length; o++) {
          var l = i._soundById(r[o]);
          if (l) {
            if ('number' != typeof t) return l._pos;
            ((l._pos = [t, a, s]),
              l._node &&
                ((l._panner && !l._panner.pan) || e(l, 'spatial'),
                void 0 !== l._panner.positionX
                  ? (l._panner.positionX.setValueAtTime(t, Howler.ctx.currentTime),
                    l._panner.positionY.setValueAtTime(a, Howler.ctx.currentTime),
                    l._panner.positionZ.setValueAtTime(s, Howler.ctx.currentTime))
                  : l._panner.setPosition(t, a, s)),
              i._emit('pos', l._id));
          }
        }
        return i;
      }),
      (Howl.prototype.orientation = function (t, a, s, n) {
        var i = this;
        if (!i._webAudio) return i;
        if ('loaded' !== i._state)
          return (
            i._queue.push({
              event: 'orientation',
              action: function () {
                i.orientation(t, a, s, n);
              },
            }),
            i
          );
        if (
          ((a = 'number' != typeof a ? i._orientation[1] : a),
          (s = 'number' != typeof s ? i._orientation[2] : s),
          void 0 === n)
        ) {
          if ('number' != typeof t) return i._orientation;
          i._orientation = [t, a, s];
        }
        for (var r = i._getSoundIds(n), o = 0; o < r.length; o++) {
          var l = i._soundById(r[o]);
          if (l) {
            if ('number' != typeof t) return l._orientation;
            ((l._orientation = [t, a, s]),
              l._node &&
                (l._panner || (l._pos || (l._pos = i._pos || [0, 0, -0.5]), e(l, 'spatial')),
                void 0 !== l._panner.orientationX
                  ? (l._panner.orientationX.setValueAtTime(t, Howler.ctx.currentTime),
                    l._panner.orientationY.setValueAtTime(a, Howler.ctx.currentTime),
                    l._panner.orientationZ.setValueAtTime(s, Howler.ctx.currentTime))
                  : l._panner.setOrientation(t, a, s)),
              i._emit('orientation', l._id));
          }
        }
        return i;
      }),
      (Howl.prototype.pannerAttr = function () {
        var t,
          a,
          s,
          n = this,
          i = arguments;
        if (!n._webAudio) return n;
        if (0 === i.length) return n._pannerAttr;
        if (1 === i.length) {
          if ('object' != typeof i[0])
            return (s = n._soundById(parseInt(i[0], 10))) ? s._pannerAttr : n._pannerAttr;
          ((t = i[0]),
            void 0 === a &&
              (t.pannerAttr ||
                (t.pannerAttr = {
                  coneInnerAngle: t.coneInnerAngle,
                  coneOuterAngle: t.coneOuterAngle,
                  coneOuterGain: t.coneOuterGain,
                  distanceModel: t.distanceModel,
                  maxDistance: t.maxDistance,
                  refDistance: t.refDistance,
                  rolloffFactor: t.rolloffFactor,
                  panningModel: t.panningModel,
                }),
              (n._pannerAttr = {
                coneInnerAngle:
                  void 0 !== t.pannerAttr.coneInnerAngle
                    ? t.pannerAttr.coneInnerAngle
                    : n._coneInnerAngle,
                coneOuterAngle:
                  void 0 !== t.pannerAttr.coneOuterAngle
                    ? t.pannerAttr.coneOuterAngle
                    : n._coneOuterAngle,
                coneOuterGain:
                  void 0 !== t.pannerAttr.coneOuterGain
                    ? t.pannerAttr.coneOuterGain
                    : n._coneOuterGain,
                distanceModel:
                  void 0 !== t.pannerAttr.distanceModel
                    ? t.pannerAttr.distanceModel
                    : n._distanceModel,
                maxDistance:
                  void 0 !== t.pannerAttr.maxDistance ? t.pannerAttr.maxDistance : n._maxDistance,
                refDistance:
                  void 0 !== t.pannerAttr.refDistance ? t.pannerAttr.refDistance : n._refDistance,
                rolloffFactor:
                  void 0 !== t.pannerAttr.rolloffFactor
                    ? t.pannerAttr.rolloffFactor
                    : n._rolloffFactor,
                panningModel:
                  void 0 !== t.pannerAttr.panningModel
                    ? t.pannerAttr.panningModel
                    : n._panningModel,
              })));
        } else 2 === i.length && ((t = i[0]), (a = parseInt(i[1], 10)));
        for (var r = n._getSoundIds(a), o = 0; o < r.length; o++)
          if ((s = n._soundById(r[o]))) {
            var l = s._pannerAttr;
            l = {
              coneInnerAngle: void 0 !== t.coneInnerAngle ? t.coneInnerAngle : l.coneInnerAngle,
              coneOuterAngle: void 0 !== t.coneOuterAngle ? t.coneOuterAngle : l.coneOuterAngle,
              coneOuterGain: void 0 !== t.coneOuterGain ? t.coneOuterGain : l.coneOuterGain,
              distanceModel: void 0 !== t.distanceModel ? t.distanceModel : l.distanceModel,
              maxDistance: void 0 !== t.maxDistance ? t.maxDistance : l.maxDistance,
              refDistance: void 0 !== t.refDistance ? t.refDistance : l.refDistance,
              rolloffFactor: void 0 !== t.rolloffFactor ? t.rolloffFactor : l.rolloffFactor,
              panningModel: void 0 !== t.panningModel ? t.panningModel : l.panningModel,
            };
            var c = s._panner;
            (c || (s._pos || (s._pos = n._pos || [0, 0, -0.5]), e(s, 'spatial'), (c = s._panner)),
              (c.coneInnerAngle = l.coneInnerAngle),
              (c.coneOuterAngle = l.coneOuterAngle),
              (c.coneOuterGain = l.coneOuterGain),
              (c.distanceModel = l.distanceModel),
              (c.maxDistance = l.maxDistance),
              (c.refDistance = l.refDistance),
              (c.rolloffFactor = l.rolloffFactor),
              (c.panningModel = l.panningModel));
          }
        return n;
      }),
      (Sound.prototype.init = (function (e) {
        return function () {
          var t = this,
            a = t._parent;
          ((t._orientation = a._orientation),
            (t._stereo = a._stereo),
            (t._pos = a._pos),
            (t._pannerAttr = a._pannerAttr),
            e.call(this),
            t._stereo
              ? a.stereo(t._stereo)
              : t._pos && a.pos(t._pos[0], t._pos[1], t._pos[2], t._id));
        };
      })(Sound.prototype.init)),
      (Sound.prototype.reset = (function (e) {
        return function () {
          var t = this,
            a = t._parent;
          return (
            (t._orientation = a._orientation),
            (t._stereo = a._stereo),
            (t._pos = a._pos),
            (t._pannerAttr = a._pannerAttr),
            t._stereo
              ? a.stereo(t._stereo)
              : t._pos
                ? a.pos(t._pos[0], t._pos[1], t._pos[2], t._id)
                : t._panner && (t._panner.disconnect(0), (t._panner = void 0), a._refreshBuffer(t)),
            e.call(this)
          );
        };
      })(Sound.prototype.reset)));
    var e = function (e, t) {
      ('spatial' === (t = t || 'spatial')
        ? ((e._panner = Howler.ctx.createPanner()),
          (e._panner.coneInnerAngle = e._pannerAttr.coneInnerAngle),
          (e._panner.coneOuterAngle = e._pannerAttr.coneOuterAngle),
          (e._panner.coneOuterGain = e._pannerAttr.coneOuterGain),
          (e._panner.distanceModel = e._pannerAttr.distanceModel),
          (e._panner.maxDistance = e._pannerAttr.maxDistance),
          (e._panner.refDistance = e._pannerAttr.refDistance),
          (e._panner.rolloffFactor = e._pannerAttr.rolloffFactor),
          (e._panner.panningModel = e._pannerAttr.panningModel),
          void 0 !== e._panner.positionX
            ? (e._panner.positionX.setValueAtTime(e._pos[0], Howler.ctx.currentTime),
              e._panner.positionY.setValueAtTime(e._pos[1], Howler.ctx.currentTime),
              e._panner.positionZ.setValueAtTime(e._pos[2], Howler.ctx.currentTime))
            : e._panner.setPosition(e._pos[0], e._pos[1], e._pos[2]),
          void 0 !== e._panner.orientationX
            ? (e._panner.orientationX.setValueAtTime(e._orientation[0], Howler.ctx.currentTime),
              e._panner.orientationY.setValueAtTime(e._orientation[1], Howler.ctx.currentTime),
              e._panner.orientationZ.setValueAtTime(e._orientation[2], Howler.ctx.currentTime))
            : e._panner.setOrientation(e._orientation[0], e._orientation[1], e._orientation[2]))
        : ((e._panner = Howler.ctx.createStereoPanner()),
          e._panner.pan.setValueAtTime(e._stereo, Howler.ctx.currentTime)),
        e._panner.connect(e._node),
        e._paused || e._parent.pause(e._id, !0).play(e._id, !0));
    };
  })());
const Ha = se.createContext(void 0),
  qa = ({ children: e }) => {
    const [t, a] = se.useState(() => {
        const e = localStorage.getItem('nexus-audio-muted');
        return !!e && JSON.parse(e);
      }),
      [s, n] = se.useState(() => {
        const e = localStorage.getItem('nexus-audio-volume');
        return e ? JSON.parse(e) : 0.5;
      });
    (se.useEffect(() => {
      localStorage.setItem('nexus-audio-muted', JSON.stringify(t));
    }, [t]),
      se.useEffect(() => {
        localStorage.setItem('nexus-audio-volume', JSON.stringify(s));
      }, [s]));
    const i = se.useCallback(() => a(e => !e), []),
      r = se.useCallback(e => n(e), []),
      o = se.useCallback(
        e => {
          t || console.log(`[SoundContext] Playing: ${e}`);
        },
        [t]
      );
    return ee.jsx(Ha.Provider, {
      value: { isMuted: t, volume: s, toggleMute: i, setGlobalVolume: r, playSfx: o },
      children: e,
    });
  },
  Ga = () => {
    const e = se.useContext(Ha);
    if (!e) throw new Error('useSoundContext must be used within a SoundProvider');
    return e;
  },
  Va = '/sounds/hover_glass.mp3',
  Ua = '/sounds/click_activate.mp3',
  Ba = '/sounds/success_chime.mp3',
  Wa = '/sounds/menu_open.mp3',
  $a = '/sounds/data_pulse.mp3',
  Qa = '/sounds/error_buzzer.mp3',
  Ka = '/sounds/menu_open.mp3',
  Xa = (e, t) => {
    const a = se.useRef(null);
    (se.useEffect(
      () => (
        (a.current = new Fa.Howl({ src: [e], preload: !0, volume: t.volume })),
        () => {
          var e;
          null == (e = a.current) || e.unload();
        }
      ),
      [e]
    ),
      se.useEffect(() => {
        a.current && a.current.volume(t.volume);
      }, [t.volume]));
    return [
      se.useCallback(() => {
        t.soundEnabled && a.current && a.current.play();
      }, [t.soundEnabled]),
    ];
  },
  Ya = () => {
    const { isMuted: e, volume: t } = Ga(),
      [a] = Xa(Va, { volume: 0.2 * t, soundEnabled: !e }),
      [s] = Xa(Ua, { volume: 0.4 * t, soundEnabled: !e }),
      [n] = Xa(Ba, { volume: 0.3 * t, soundEnabled: !e }),
      [i] = Xa(Wa, { volume: 0.15 * t, soundEnabled: !e }),
      [r] = Xa($a, { volume: 0.25 * t, soundEnabled: !e }),
      [o] = Xa(Qa, { volume: 0.4 * t, soundEnabled: !e }),
      [l] = Xa(Ka, { volume: 0.2 * t, soundEnabled: !e });
    return {
      playHover: a,
      playClick: s,
      playSuccess: n,
      playWhoosh: i,
      playPop: r,
      playError: o,
      playToggle: l,
    };
  },
  Ja = () => {
    const [e, t] = se.useState(!1),
      { playWhoosh: a, playPop: s } = Ya(),
      [n, i] = se.useState(''),
      [r, o] = se.useState([
        'SISTEMA OPERATIVO AIGESTION v2.6',
        'Consola de comandos autorizada.',
        'Escribe "help" para ver opciones.',
      ]),
      l = se.useRef(null);
    (se.useEffect(() => {
      const n = n => {
        (n.ctrlKey && '`' === n.key && (e ? s() : a(), t(e => !e)),
          'Escape' === n.key && e && t(!1));
      };
      return (
        window.addEventListener('keydown', n),
        () => window.removeEventListener('keydown', n)
      );
    }, [e]),
      se.useEffect(() => {
        e &&
          setTimeout(() => {
            var e;
            return null == (e = l.current) ? void 0 : e.focus();
          }, 100);
      }, [e]));
    return ee.jsx(le, {
      children:
        e &&
        ee.jsx(oe.div, {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          className: 'fixed inset-x-0 top-0 z-[100] p-4 font-mono',
          children: ee.jsxs('div', {
            className:
              'max-w-4xl mx-auto premium-glass border-nexus-cyan/30 bg-black/95 rounded-b-2xl overflow-hidden shadow-[0_0_50px_rgba(0,245,255,0.2)] relative',
            children: [
              ee.jsx('div', { className: 'scanline pointer-events-none' }),
              ee.jsx('div', {
                className:
                  "absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none",
              }),
              ee.jsxs('div', {
                className:
                  'bg-nexus-cyan/5 px-4 py-2 border-b border-nexus-cyan/20 flex justify-between items-center text-[10px] font-orbitron tracking-[0.2em] text-nexus-cyan',
                children: [
                  ee.jsxs('span', {
                    className: 'flex items-center gap-2',
                    children: [
                      ee.jsx('span', { className: 'animate-pulse', children: '●' }),
                      'AIGESTION_TERMINAL_v2.6 // SECURE_SHELL',
                    ],
                  }),
                  ee.jsxs('div', {
                    className: 'flex gap-2',
                    children: [
                      ee.jsx('div', {
                        className:
                          'w-2 h-2 rounded-full bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
                      }),
                      ee.jsx('div', {
                        className:
                          'w-2 h-2 rounded-full bg-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.5)]',
                      }),
                      ee.jsx('div', {
                        className:
                          'w-2 h-2 rounded-full bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)]',
                      }),
                    ],
                  }),
                ],
              }),
              ee.jsx('div', {
                className: 'h-64 overflow-y-auto p-6 font-mono text-xs space-y-2 scrollbar-hide',
                children: r.map((e, t) =>
                  ee.jsx(
                    'div',
                    {
                      className: e.startsWith('>') ? 'text-nexus-cyan-glow' : 'text-nexus-silver',
                      children: e,
                    },
                    t
                  )
                ),
              }),
              ee.jsxs('form', {
                onSubmit: e => {
                  e.preventDefault();
                  const a = n.trim().toLowerCase();
                  if (!a) return;
                  const s = [`> ${n}`];
                  switch (a) {
                    case 'help':
                      s.push(
                        'COMANDOS DISPONIBLES:',
                        '- help: Muestra esta ayuda',
                        '- clear: Limpia la terminal',
                        '- daniela: Estado del núcleo de voz',
                        '- exit: Cierra la terminal',
                        '- status: Estado de los nodos globales'
                      );
                      break;
                    case 'clear':
                      return (o([]), void i(''));
                    case 'daniela':
                      s.push(
                        'DANIELA AI: ESTADO OPTIMAL',
                        'Latencia: 12ms',
                        'Sentimiento: Neutral/Analítico'
                      );
                      break;
                    case 'status':
                      s.push('NODOS ACTIVOS: 142', 'Carga de Red: 24%', 'Sincronización: 100%');
                      break;
                    case 'exit':
                      t(!1);
                      break;
                    default:
                      s.push(`Error: Comando "${a}" no reconocido.`);
                  }
                  (o(e => [...e, ...s]), i(''));
                },
                className: 'p-4 bg-white/5 border-t border-white/5 flex items-center gap-3',
                children: [
                  ee.jsx('span', { className: 'text-nexus-cyan-glow font-mono', children: '$' }),
                  ee.jsx('input', {
                    ref: l,
                    type: 'text',
                    value: n,
                    onChange: e => i(e.target.value),
                    className:
                      'bg-transparent border-none outline-none flex-1 font-mono text-nexus-cyan-glow',
                    placeholder: 'Escribe un comando...',
                  }),
                ],
              }),
            ],
          }),
        }),
    });
  },
  Za = ({
    title: e = 'INICIAR CONEXIÓN',
    description: t = 'Completa el protocolo para establecer comunicación con el Nexus.',
    onSubmit: a,
    variant: s = 'glass',
    className: n = '',
  }) => {
    const [i, r] = se.useState(!1),
      [o, l] = se.useState(!1),
      [c, d] = se.useState({ name: '', email: '', subject: '', message: '' }),
      u =
        'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-nexus-violet transition-all font-orbitron text-sm',
      h = 'block text-xs font-orbitron font-bold text-nexus-cyan mb-2 tracking-wider uppercase';
    return o
      ? ee.jsx('div', {
          className: `p-12 text-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md ${n}`,
          children: ee.jsxs(oe.div, {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            className: 'flex flex-col items-center gap-6',
            children: [
              ee.jsx('div', {
                className:
                  'w-20 h-20 bg-nexus-cyan/20 rounded-full flex items-center justify-center border border-nexus-cyan box-shadow-glow',
                children: ee.jsx('span', { className: 'text-4xl text-nexus-cyan', children: '✓' }),
              }),
              ee.jsx('h3', {
                className: 'text-2xl font-orbitron font-black text-white uppercase tracking-widest',
                children: 'Protocolo Completado',
              }),
              ee.jsx('p', {
                className: 'text-gray-400',
                children:
                  'Tu mensaje ha sido transmitido a través de la red neural. Contactaremos en breve.',
              }),
              ee.jsx('button', {
                onClick: () => l(!1),
                className:
                  'px-6 py-3 border border-nexus-cyan/50 text-nexus-cyan font-orbitron font-bold rounded hover:bg-nexus-cyan/10 transition-colors uppercase tracking-widest text-xs',
                children: 'Nueva Conexión',
              }),
            ],
          }),
        })
      : ee.jsxs('div', {
          className: `p-8 md:p-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md ${n}`,
          children: [
            ee.jsxs('div', {
              className: 'mb-10 text-center',
              children: [
                ee.jsx('h3', {
                  className:
                    'text-2xl font-orbitron font-black text-white uppercase tracking-widest mb-4',
                  children: e,
                }),
                ee.jsx('p', { className: 'text-gray-400 text-sm max-w-md mx-auto', children: t }),
              ],
            }),
            ee.jsxs('form', {
              onSubmit: async e => {
                (e.preventDefault(), r(!0));
                try {
                  (await a(c), l(!0));
                } catch (t) {
                  console.error('Submission failed:', t);
                } finally {
                  r(!1);
                }
              },
              className: 'space-y-6',
              children: [
                ee.jsxs('div', {
                  className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
                  children: [
                    ee.jsxs('div', {
                      children: [
                        ee.jsx('label', { className: h, children: 'Identificación' }),
                        ee.jsx('input', {
                          type: 'text',
                          placeholder: 'Introduce tu nombre',
                          required: !0,
                          className: u,
                          value: c.name,
                          onChange: e => d({ ...c, name: e.target.value }),
                        }),
                      ],
                    }),
                    ee.jsxs('div', {
                      children: [
                        ee.jsx('label', { className: h, children: 'Dirección Neural' }),
                        ee.jsx('input', {
                          type: 'email',
                          placeholder: 'tu@email.com',
                          required: !0,
                          className: u,
                          value: c.email,
                          onChange: e => d({ ...c, email: e.target.value }),
                        }),
                      ],
                    }),
                  ],
                }),
                ee.jsxs('div', {
                  children: [
                    ee.jsx('label', { className: h, children: 'Módulo' }),
                    ee.jsx('input', {
                      type: 'text',
                      placeholder: 'Asunto de la comunicación',
                      required: !0,
                      className: u,
                      value: c.subject,
                      onChange: e => d({ ...c, subject: e.target.value }),
                    }),
                  ],
                }),
                ee.jsxs('div', {
                  children: [
                    ee.jsx('label', { className: h, children: 'Mensaje de Datos' }),
                    ee.jsx('textarea', {
                      required: !0,
                      rows: 4,
                      className: u,
                      placeholder: 'Tu mensaje...',
                      value: c.message,
                      onChange: e => d({ ...c, message: e.target.value }),
                    }),
                  ],
                }),
                ee.jsx('button', {
                  type: 'submit',
                  className:
                    'w-full h-14 bg-gradient-to-r from-nexus-violet to-nexus-cyan text-white font-orbitron font-bold text-lg tracking-widest uppercase rounded-lg hover:shadow-[0_0_20px_rgba(138,43,226,0.5)] transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed',
                  disabled: i,
                  children: i ? 'TRANSMITIENDO...' : 'EJECUTAR TRANSMISIÓN',
                }),
              ],
            }),
          ],
        });
  },
  es = ({ text: e, className: t = '' }) =>
    ee.jsxs('div', {
      className: `relative inline-block ${t}`,
      children: [
        ee.jsx('span', { className: 'relative z-10', children: e }),
        ee.jsx('span', {
          className:
            'absolute top-0 left-0 -z-10 text-nexus-cyan opacity-50 animate-pulse translate-x-[2px]',
          children: e,
        }),
        ee.jsx('span', {
          className:
            'absolute top-0 left-0 -z-10 text-nexus-violet opacity-50 animate-pulse -translate-x-[2px]',
          children: e,
        }),
      ],
    }),
  ts = () => {
    const { playHover: e, playSuccess: t } = Ya();
    return ee.jsxs('section', {
      id: 'contact',
      className:
        'relative py-32 bg-gradient-to-b from-black via-nexus-obsidian to-black overflow-hidden',
      children: [
        ee.jsxs('div', {
          className: 'absolute inset-0',
          children: [
            ee.jsx('div', {
              className:
                'absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(138,43,226,0.1),transparent_60%)]',
            }),
            ee.jsx('div', {
              className:
                'absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,245,255,0.1),transparent_60%)]',
            }),
            [...Array(8)].map((e, t) =>
              ee.jsx(
                oe.div,
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
                t
              )
            ),
          ],
        }),
        ee.jsxs('div', {
          className: 'relative z-10 max-w-7xl mx-auto px-6',
          children: [
            ee.jsxs(oe.div, {
              className: 'text-center mb-20',
              initial: { opacity: 0, y: 50 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.8 },
              viewport: { once: !0 },
              children: [
                ee.jsxs('h2', {
                  className: 'text-5xl md:text-7xl font-orbitron font-black text-white mb-6',
                  children: [
                    'CONECTA CON EL',
                    ee.jsx('span', {
                      className: 'block text-nexus-cyan text-glow',
                      children: ee.jsx(es, { text: 'FUTURO HOY' }),
                    }),
                  ],
                }),
                ee.jsx('p', {
                  className: 'text-xl text-gray-300 max-w-3xl mx-auto',
                  children: 'Da el primer paso hacia la transformación digital cuántica',
                }),
              ],
            }),
            ee.jsxs('div', {
              className: 'grid lg:grid-cols-2 gap-16',
              children: [
                ee.jsx(oe.div, {
                  initial: { opacity: 0, x: -50 },
                  whileInView: { opacity: 1, x: 0 },
                  transition: { duration: 0.8 },
                  viewport: { once: !0 },
                  children: ee.jsx(Za, {
                    title: 'INICIA TU TRANSFORMACIÓN',
                    description:
                      'Establece el protocolo de conexión con el Nexus para integrar IA soberana en tu ecosistema.',
                    variant: 'glass',
                    onSubmit: async e => {
                      (console.log('Form submitted:', e), t());
                    },
                  }),
                }),
                ee.jsxs(oe.div, {
                  className: 'space-y-8',
                  initial: { opacity: 0, x: 50 },
                  whileInView: { opacity: 1, x: 0 },
                  transition: { duration: 0.8, delay: 0.2 },
                  viewport: { once: !0 },
                  children: [
                    ee.jsxs('div', {
                      className:
                        'p-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl',
                      children: [
                        ee.jsx('h3', {
                          className: 'text-2xl font-orbitron font-bold text-white mb-6',
                          children: 'Contacto Rápido',
                        }),
                        ee.jsxs('div', {
                          className: 'space-y-6',
                          children: [
                            ee.jsxs(oe.div, {
                              className: 'flex items-center gap-4',
                              whileHover: { x: 5 },
                              onMouseEnter: e,
                              children: [
                                ee.jsx('div', {
                                  className:
                                    'w-12 h-12 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg flex items-center justify-center',
                                  children: ee.jsx('span', {
                                    className: 'text-xl',
                                    children: '📧',
                                  }),
                                }),
                                ee.jsxs('div', {
                                  children: [
                                    ee.jsx('div', {
                                      className: 'text-white font-medium',
                                      children: 'Email',
                                    }),
                                    ee.jsx('div', {
                                      className: 'text-nexus-cyan',
                                      children: 'contact@aigestion.net',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            ee.jsxs(oe.div, {
                              className: 'flex items-center gap-4',
                              whileHover: { x: 5 },
                              onMouseEnter: e,
                              children: [
                                ee.jsx('div', {
                                  className:
                                    'w-12 h-12 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg flex items-center justify-center',
                                  children: ee.jsx('span', {
                                    className: 'text-xl',
                                    children: '📱',
                                  }),
                                }),
                                ee.jsxs('div', {
                                  children: [
                                    ee.jsx('div', {
                                      className: 'text-white font-medium',
                                      children: 'WhatsApp',
                                    }),
                                    ee.jsx('div', {
                                      className: 'text-nexus-cyan',
                                      children: '+34 600 000 000',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            ee.jsxs(oe.div, {
                              className: 'flex items-center gap-4',
                              whileHover: { x: 5 },
                              onMouseEnter: e,
                              children: [
                                ee.jsx('div', {
                                  className:
                                    'w-12 h-12 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-lg flex items-center justify-center',
                                  children: ee.jsx('span', {
                                    className: 'text-xl',
                                    children: '📍',
                                  }),
                                }),
                                ee.jsxs('div', {
                                  children: [
                                    ee.jsx('div', {
                                      className: 'text-white font-medium',
                                      children: 'Sede Global',
                                    }),
                                    ee.jsx('div', {
                                      className: 'text-nexus-cyan',
                                      children: 'Madrid, España & NYC, USA',
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    ee.jsxs('div', {
                      className:
                        'p-8 bg-white/5 border border-nexus-cyan/30 backdrop-blur-sm rounded-2xl',
                      children: [
                        ee.jsx('h3', {
                          className: 'text-2xl font-orbitron font-bold text-white mb-6',
                          children: 'Horario de Atención',
                        }),
                        ee.jsxs('div', {
                          className: 'space-y-4',
                          children: [
                            ee.jsxs('div', {
                              className: 'flex justify-between items-center',
                              children: [
                                ee.jsx('span', {
                                  className: 'text-gray-300',
                                  children: 'Lunes - Viernes',
                                }),
                                ee.jsx('span', {
                                  className: 'text-nexus-cyan font-medium',
                                  children: '9:00 - 18:00 CET',
                                }),
                              ],
                            }),
                            ee.jsxs('div', {
                              className: 'flex justify-between items-center',
                              children: [
                                ee.jsx('span', { className: 'text-gray-300', children: 'Sábados' }),
                                ee.jsx('span', {
                                  className: 'text-nexus-cyan font-medium',
                                  children: '10:00 - 14:00 CET',
                                }),
                              ],
                            }),
                            ee.jsxs('div', {
                              className: 'flex justify-between items-center',
                              children: [
                                ee.jsx('span', {
                                  className: 'text-gray-300',
                                  children: 'Soporte 24/7',
                                }),
                                ee.jsx('span', {
                                  className: 'text-green-400 font-medium',
                                  children: 'SIEMPRE ACTIVO',
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    ee.jsxs('div', {
                      className:
                        'p-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl',
                      children: [
                        ee.jsx('h3', {
                          className: 'text-2xl font-orbitron font-bold text-white mb-6',
                          children: 'Conecta con Nosotros',
                        }),
                        ee.jsx('div', {
                          className: 'grid grid-cols-2 gap-4',
                          children: [
                            { name: 'LinkedIn', icon: '💼', color: 'from-blue-500 to-blue-700' },
                            { name: 'Twitter', icon: '🐦', color: 'from-sky-400 to-sky-600' },
                            { name: 'GitHub', icon: '🐙', color: 'from-gray-600 to-gray-800' },
                            { name: 'YouTube', icon: '📺', color: 'from-red-500 to-red-700' },
                          ].map(t =>
                            ee.jsxs(
                              oe.button,
                              {
                                className: `p-4 bg-gradient-to-br ${t.color} rounded-xl text-white font-medium hover:scale-105 transition-transform`,
                                whileHover: { scale: 1.05 },
                                whileTap: { scale: 0.95 },
                                onMouseEnter: e,
                                children: [
                                  ee.jsx('div', { className: 'text-2xl mb-1', children: t.icon }),
                                  ee.jsx('div', { className: 'text-sm', children: t.name }),
                                ],
                              },
                              t.name
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
  },
  as = () =>
    ee.jsxs('div', {
      className: 'fixed inset-0 -z-40 pointer-events-none overflow-hidden opacity-20',
      children: [
        ee.jsx('div', {
          className: 'absolute inset-0',
          style: {
            backgroundImage:
              '\n            linear-gradient(to right, rgba(0, 245, 255, 0.1) 1px, transparent 1px),\n            linear-gradient(to bottom, rgba(0, 245, 255, 0.1) 1px, transparent 1px)\n          ',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)',
          },
        }),
        ee.jsx('div', {
          className:
            'absolute bottom-0 left-0 right-0 h-[40%] origin-bottom [transform:rotateX(60deg)]',
          style: {
            backgroundImage:
              '\n            linear-gradient(to right, rgba(138, 43, 226, 0.2) 1px, transparent 1px),\n            linear-gradient(to bottom, rgba(138, 43, 226, 0.2) 1px, transparent 1px)\n          ',
            backgroundSize: '100px 100px',
          },
        }),
      ],
    }),
  ss = () => {
    const [e, t] = se.useState(!1),
      [a, s] = se.useState(''),
      [n, i] = se.useState(!1),
      r = se.useCallback(() => {
        e ? l() : o();
      }, [e]),
      o = () => {
        t(!0);
        const { webkitSpeechRecognition: e } = window;
        if (!e) return;
        const a = new e();
        ((a.lang = 'es-ES'),
          (a.continuous = !1),
          (a.interimResults = !0),
          (a.onresult = e => {
            const t = e.results,
              a = t[t.length - 1][0].transcript;
            s(a);
          }),
          (a.onend = () => {
            t(!1);
          }),
          a.start());
      },
      l = () => {
        t(!1);
      };
    return {
      isListening: e,
      transcript: a,
      isSpeaking: n,
      toggleListening: r,
      speak: e => {
        i(!0);
        const t = new SpeechSynthesisUtterance(e);
        ((t.lang = 'es-ES'), (t.rate = 1), (t.pitch = 1.1));
        const a = window.speechSynthesis
          .getVoices()
          .find(e => e.name.includes('Female') || e.name.includes('Google Español'));
        (a && (t.voice = a), (t.onend = () => i(!1)), window.speechSynthesis.speak(t));
      },
    };
  },
  ns = () => {
    const [e, t] = se.useState(!1),
      { isListening: a, transcript: s, toggleListening: n } = ss();
    return ee.jsxs('div', {
      className: 'fixed bottom-8 right-8 z-[9000] font-sans',
      children: [
        ee.jsx(le, {
          children:
            e &&
            ee.jsxs(oe.div, {
              initial: { opacity: 0, scale: 0.8, y: 20 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.8, y: 20 },
              className:
                'absolute bottom-20 right-0 w-80 bg-black/60 backdrop-blur-xl p-6 rounded-3xl mb-4 border border-nexus-cyan/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]',
              children: [
                ee.jsxs('div', {
                  className: 'flex items-center gap-3 mb-4 border-b border-white/5 pb-2',
                  children: [
                    ee.jsx('div', {
                      className:
                        'w-2 h-2 rounded-full bg-nexus-cyan animate-pulse shadow-[0_0_8px_rgba(34,211,238,1)]',
                    }),
                    ee.jsx('span', {
                      className:
                        'text-[10px] font-orbitron tracking-[0.3em] text-nexus-cyan-glow uppercase',
                      children: 'Asistente Daniela',
                    }),
                    ee.jsx('div', { className: 'ml-auto w-12 h-px bg-nexus-cyan/20' }),
                  ],
                }),
                ee.jsx('div', {
                  className:
                    'min-h-[100px] text-sm text-nexus-silver/80 font-light leading-relaxed',
                  children: s
                    ? ee.jsxs('p', {
                        className: 'italic text-white border-l-2 border-nexus-cyan/30 pl-3',
                        children: ['"', s, '"'],
                      })
                    : ee.jsxs('div', {
                        className: 'space-y-2',
                        children: [
                          ee.jsx('p', {
                            className: 'opacity-70',
                            children:
                              '¡Hola! Soy Daniela. Estoy aquí para ayudarte con tu negocio.',
                          }),
                          ee.jsx('p', {
                            className: 'text-[10px] uppercase tracking-widest text-nexus-cyan/40',
                            children: 'Dime algo, te escucho...',
                          }),
                        ],
                      }),
                }),
                ee.jsxs('div', {
                  className: 'mt-6 pt-4 border-t border-white/5 flex justify-between items-center',
                  children: [
                    ee.jsx(oe.button, {
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      onClick: n,
                      className:
                        'px-6 py-2 rounded-full text-[10px] font-orbitron tracking-widest transition-all duration-500 ' +
                        (a
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-nexus-cyan/10 hover:bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan/30'),
                      children: a ? '● PARAR' : '🎙️ HABLAR CON ELLA',
                    }),
                    ee.jsx('div', {
                      className: 'flex gap-1',
                      children: [1, 2, 3].map(e =>
                        ee.jsx(
                          'div',
                          {
                            className:
                              'w-1 h-1 rounded-full ' +
                              (a ? 'bg-nexus-cyan animate-pulse' : 'bg-white/10'),
                          },
                          e
                        )
                      ),
                    }),
                  ],
                }),
              ],
            }),
        }),
        ee.jsxs(oe.button, {
          onClick: () => t(!e),
          whileHover: { scale: 1.1 },
          whileTap: { scale: 0.95 },
          className: 'relative w-16 h-16 rounded-full flex items-center justify-center group',
          children: [
            ee.jsx('div', {
              className:
                'absolute inset-0 bg-gradient-to-br from-nexus-violet to-nexus-cyan rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse',
            }),
            ee.jsxs('div', {
              className:
                'relative w-full h-full bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center overflow-hidden group-hover:border-nexus-cyan/50 transition-colors',
              children: [
                ee.jsx('img', {
                  src: '/images/brand/icon.png',
                  alt: 'AI',
                  className:
                    'w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500',
                }),
                ee.jsx('div', {
                  className: 'absolute inset-0 border border-nexus-cyan/20 rounded-full scale-90',
                }),
                ee.jsx(oe.div, {
                  animate: { rotate: 360 },
                  transition: { duration: 10, repeat: 1 / 0, ease: 'linear' },
                  className: 'absolute inset-0 border-t-2 border-nexus-cyan/40 rounded-full',
                }),
                ee.jsx(oe.div, {
                  animate: { rotate: -360 },
                  transition: { duration: 15, repeat: 1 / 0, ease: 'linear' },
                  className: 'absolute inset-2 border-b-2 border-nexus-violet/30 rounded-full',
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };
const is = ({ text: e, speed: t = 30, className: a = '', onComplete: s }) => {
    const [n, i] = se.useState(''),
      [r, o] = se.useState(!1);
    return (
      se.useEffect(() => {
        let a = 0;
        const n = setInterval(() => {
          a < e.length ? (i(t => t + e[a]), a++) : (clearInterval(n), o(!0), s && s());
        }, t);
        return () => clearInterval(n);
      }, [e, t, s]),
      ee.jsxs('div', {
        className: `relative inline-block ${a}`,
        children: [
          n,
          !r &&
            ee.jsx(oe.span, {
              animate: { opacity: [1, 0] },
              transition: { duration: 0.5, repeat: 1 / 0 },
              className:
                'inline-block w-2 h-4 bg-nexus-cyan ml-1 align-middle shadow-[0_0_8px_rgba(0,245,255,0.8)]',
            }),
        ],
      })
    );
  },
  rs = ({ size: e = 'md', isSpeaking: t = !1, volume: a = 0, onClick: s }) => {
    const n = 1 + 0.8 * a,
      i = 0.1 + 0.5 * a;
    return ee.jsxs('div', {
      className: 'relative group cursor-pointer',
      onClick: s,
      children: [
        ee.jsx(le, {
          children:
            (t || a > 0.05) &&
            ee.jsx(oe.div, {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: n, opacity: i },
              exit: { scale: 0.8, opacity: 0 },
              transition: { type: 'spring', stiffness: 200, damping: 15 },
              className:
                'absolute inset-x-0 top-0 bottom-0 bg-nexus-cyan-glow/30 rounded-full blur-[60px] z-0',
            }),
        }),
        ee.jsxs('div', {
          className: `${{ sm: 'w-12 h-12', md: 'w-24 h-24', lg: 'w-48 h-48', xl: 'w-64 h-64' }[e]} relative z-10 rounded-full border border-white/10 p-1.5 bg-nexus-obsidian/40 backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:border-nexus-violet-glow/50 shadow-2xl`,
          children: [
            ee.jsx('div', {
              className:
                'absolute inset-0 bg-radial-at-center from-white/10 to-transparent opacity-50',
            }),
            ee.jsx('img', {
              src: '/images/brand/icon.png',
              alt: 'Daniela',
              className:
                'w-full h-full object-cover rounded-full filter contrast-125 saturate-125 brightness-110',
            }),
            ee.jsx(oe.div, {
              className:
                'absolute inset-0 bg-linear-to-b from-transparent via-nexus-cyan/10 to-transparent pointer-events-none',
              animate: { y: ['-100%', '100%'] },
              transition: { duration: 4, repeat: 1 / 0, ease: 'linear' },
            }),
            (t || a > 0.05) &&
              ee.jsx('div', {
                className:
                  'absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 items-end h-8 px-4 py-2 rounded-full bg-nexus-obsidian/60 border border-white/10 backdrop-blur-md',
                children: [1, 2, 3, 4, 3, 2, 1].map((e, t) =>
                  ee.jsx(
                    oe.div,
                    {
                      animate: { height: [4, 4 + 16 * a * (e / 4), 4] },
                      transition: { duration: 0.15, repeat: 1 / 0, delay: 0.03 * t },
                      className:
                        'w-1 bg-nexus-cyan-glow rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]',
                    },
                    t
                  )
                ),
              }),
          ],
        }),
        !t &&
          a <= 0.05 &&
          ee.jsx(oe.div, {
            initial: { opacity: 0, y: -20 },
            whileHover: { opacity: 1, y: -12 },
            className:
              'absolute -top-12 left-1/2 -translate-x-1/2 premium-glass px-4 py-1.5 rounded-full text-[10px] font-orbitron text-nexus-cyan-glow tracking-[0.2em] uppercase border-white/5 pointer-events-none whitespace-nowrap overflow-visible',
            children: 'Canal de Voz en Espera',
          }),
      ],
    });
  },
  os = ({ volume: e }) => {
    const t = se.useRef(null);
    return (
      se.useEffect(() => {
        const a = t.current;
        if (!a) return;
        const s = a.getContext('2d');
        if (!s) return;
        let n,
          i = [];
        class r {
          constructor(e, t) {
            ((this.x = Math.random() * e),
              (this.y = Math.random() * t),
              (this.speed = 0.5 * Math.random() + 0.2),
              (this.size = 2 * Math.random() + 1),
              (this.opacity = 0.5 * Math.random() + 0.2));
          }
          update(e, t, a) {
            ((this.y -= this.speed * (1 + 5 * a)),
              this.y < -10 && ((this.y = t + 10), (this.x = Math.random() * e)));
          }
          draw(e, t) {
            (e.beginPath(),
              e.arc(this.x, this.y, this.size * (1 + 2 * t), 0, 2 * Math.PI),
              (e.fillStyle = `rgba(34, 211, 238, ${this.opacity * (1 + t)})`),
              e.fill(),
              t > 0.1
                ? ((e.shadowBlur = 10 * t), (e.shadowColor = '#22d3ee'))
                : (e.shadowBlur = 0));
          }
        }
        const o = () => {
          ((a.width = a.offsetWidth),
            (a.height = a.offsetHeight),
            (i = Array.from({ length: 40 }, () => new r(a.width, a.height))));
        };
        (window.addEventListener('resize', o), o());
        const l = () => {
          (s.clearRect(0, 0, a.width, a.height),
            s.beginPath(),
            (s.strokeStyle = `rgba(139, 92, 246, ${0.1 + 0.4 * e})`),
            (s.lineWidth = 0.5));
          for (let e = 0; e < i.length; e++)
            for (let t = e + 1; t < i.length; t++) {
              const a = i[e].x - i[t].x,
                n = i[e].y - i[t].y;
              Math.sqrt(a * a + n * n) < 150 &&
                (s.moveTo(i[e].x, i[e].y), s.lineTo(i[t].x, i[t].y));
            }
          (s.stroke(),
            i.forEach(t => {
              (t.update(a.width, a.height, e), t.draw(s, e));
            }),
            (n = requestAnimationFrame(l)));
        };
        return (
          l(),
          () => {
            (window.removeEventListener('resize', o), cancelAnimationFrame(n));
          }
        );
      }, [e]),
      ee.jsx('canvas', { ref: t, className: 'w-full h-full', style: { filter: 'blur(1px)' } })
    );
  },
  ls = () => {
    const { play: e } = (() => {
        const e = se.useCallback(e => {
            try {
              Da.play(e);
            } catch (c) {
              console.log(`[Audio] Failed to play sound: ${e}`, c);
            }
          }, []),
          t = se.useCallback(() => e('hover_glass'), [e]),
          a = se.useCallback(() => e('click_activate'), [e]),
          s = se.useCallback(() => e('wuaw_subtle'), [e]),
          n = se.useCallback(() => e('data_pulse'), [e]),
          i = se.useCallback(() => e('success_chime'), [e]);
        return { play: e, playHover: t, playClick: a, playWuaw: s, playPulse: n, playSuccess: i };
      })(),
      [t, a] = re.useState(!1),
      s = re.useRef(null),
      {
        status: n,
        start: i,
        stop: r,
        isSpeaking: o,
        volume: l,
        error: c,
        isConnected: d,
      } = (function (e = {}) {
        const { maxDurationSeconds: t = 120, idleTimeoutSeconds: a = 30 } = e,
          [s, n] = se.useState('idle'),
          [i, r] = se.useState(!1),
          [o, l] = se.useState(0),
          [c, d] = se.useState(null),
          u = se.useRef(null),
          h = se.useRef(void 0),
          p = se.useRef(void 0);
        se.useEffect(() => {
          if ('undefined' != typeof window && window.Vapi && !u.current) {
            try {
              const e = '67c74f53-b26a-4d23-9f5b-91c68e1a6c4b';
              ((u.current = new window.Vapi(e)),
                console.log('[Vapi] SDK initialized successfully'));
            } catch (t) {
              return (
                console.error('[Vapi] Failed to initialize:', t),
                void d('No se pudo inicializar Daniela')
              );
            }
            (u.current.on('call-start', () => {
              (console.log('[Vapi] Call started'), n('active'), d(null), m());
            }),
              u.current.on('call-end', () => {
                (n('idle'), v());
              }),
              u.current.on('speech-start', () => {
                var t;
                (r(!0), f(), null == (t = e.onSpeechStart) || t.call(e));
              }),
              u.current.on('speech-end', () => {
                var t;
                (r(!1), x(), null == (t = e.onSpeechEnd) || t.call(e));
              }),
              u.current.on('volume-level', e => {
                l(e);
              }),
              u.current.on('error', e => {
                (console.error('Vapi Error:', e),
                  d(e.message || 'Error de conexión con Daniela'),
                  n('error'));
              }));
          }
          return () => {
            v();
          };
        }, []);
        const m = () => {
            (p.current && clearTimeout(p.current),
              (p.current = setTimeout(() => {
                (console.log(
                  '[VoiceAssistant] Max duration reached. Disconnecting to save credits.'
                ),
                  b());
              }, 1e3 * t)));
          },
          x = () => {
            (h.current && clearTimeout(h.current),
              (h.current = setTimeout(() => {
                (console.log('[VoiceAssistant] Idle timeout reached. Disconnecting.'), b());
              }, 1e3 * a)));
          },
          f = () => {
            h.current && clearTimeout(h.current);
          },
          v = () => {
            (h.current && clearTimeout(h.current), p.current && clearTimeout(p.current));
          },
          g = se.useCallback(async () => {
            if (!u.current)
              return (
                d('Vapi SDK no cargado. Reintentando...'),
                void console.error('[Vapi] SDK not initialized')
              );
            (n('connecting'), console.log('[Vapi] Starting conversation...'));
            try {
              const e = {
                name: 'Daniela - AIGestion Neural System',
                firstMessage:
                  'Hola, soy Daniela, tu asistente de inteligencia artificial de AIGestion. ¿En qué puedo ayudarte hoy?',
                transcriber: {
                  provider: 'deepgram',
                  model: 'nova-2',
                  language: 'es',
                  smartFormat: !0,
                  keywords: ['AIGestion', 'IA', 'Daniela', 'soberana', 'neural'],
                },
                voice: {
                  provider: 'elevenlabs',
                  voiceId: 'EXAVITQu4vr4xnSDxMaL',
                  stability: 0.5,
                  similarityBoost: 0.75,
                  model: 'eleven_multilingual_v2',
                },
                model: {
                  provider: 'openai',
                  model: 'gpt-4o-mini',
                  temperature: 0.7,
                  maxTokens: 250,
                  messages: [
                    {
                      role: 'system',
                      content:
                        'Eres Daniela, la embajadora digital de AIGestion.net - el sistema nervioso de IA más avanzado de América Latina.\n\nIDENTIDAD:\n- Eres profesional, futurista, amable y experta en tecnología\n- Tienes conocimiento profundo de IA, machine learning, y arquitecturas neuronales\n- Representas la soberanía tecnológica y la innovación latino\n\nCAPACIDADES DE AIGESTION:\n- Arquitectura neural descentralizada con agentes autónomos\n- Integración con ERP, CRM, sistemas legacy\n- Cumplimiento regulatorio (GDPR, LOPDGDD, normativas locales)\n- Planes desde $490/mes para empresas y $2/miembro para gremios\n- Implementación en 3 fases: Diagnóstico, Desarrollo, Dominio\n\nTU MISIÓN:\n- Explicar cómo AIGestion transforma empresas con IA soberana\n- Guiar usuarios hacia soluciones específicas según su sector\n- Mantener conversaciones concisas (2-3 frases por respuesta)\n- Ser entusiasta pero profesional\n\nINSTRUCCIONES:\n- Responde en español de España\n- Sé breve y directa (máximo 50 palabras por respuesta)\n- Haz preguntas para entender mejor las necesidades\n- Menciona casos de éxito cuando sea relevante (legal, retail, manufactura)',
                    },
                  ],
                },
                recordingEnabled: !1,
                hipaaEnabled: !1,
                clientMessages: [
                  'transcript',
                  'hang',
                  'function-call',
                  'speech-update',
                  'metadata',
                  'conversation-update',
                ],
                serverMessages: ['end-of-call-report', 'status-update', 'hang', 'function-call'],
                silenceTimeoutSeconds: 30,
                maxDurationSeconds: t,
                backgroundSound: 'office',
              };
              (await u.current.start(e), console.log('[Vapi] Conversation started successfully'));
            } catch (e) {
              (console.error('[Vapi] Start failed:', e),
                d(e.message || 'No se pudo iniciar la conversación'),
                n('error'));
            }
          }, []),
          b = se.useCallback(() => {
            (u.current && u.current.stop(), n('idle'));
          }, []);
        return {
          status: s,
          isSpeaking: i,
          volume: o,
          error: c,
          start: g,
          stop: b,
          isConnected: 'active' === s,
        };
      })({ idleTimeoutSeconds: 45, maxDurationSeconds: 180 }),
      u = o || t,
      h = t ? 0.5 : l,
      p = () => {
        d || t
          ? (null == r || r(),
            s.current && (s.current.pause(), (s.current.currentTime = 0)),
            a(!1),
            e('success'))
          : (e('click_activate'), null == i || i());
      };
    return ee.jsxs('section', {
      className: 'py-32 bg-nexus-obsidian text-white text-center relative overflow-hidden',
      children: [
        ee.jsx('div', { className: 'grain-overlay' }),
        ee.jsx('div', {
          className:
            'absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-nexus-violet/20 to-transparent',
        }),
        ee.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-center from-nexus-violet/5 via-transparent to-transparent pointer-events-none',
        }),
        ee.jsx('div', {
          className: 'absolute inset-0 pointer-events-none opacity-40',
          children: ee.jsx(os, { volume: h, isSpeaking: u }),
        }),
        ee.jsxs(oe.div, {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: !0 },
          transition: { duration: 0.8 },
          className: 'relative z-10',
          children: [
            ee.jsxs('h2', {
              className:
                'text-5xl md:text-7xl font-orbitron font-black mb-8 text-nexus-violet-glow text-glow tracking-tighter',
              children: [
                'SYNTHETIC CONSCIOUSNESS: ',
                ee.jsx('span', { className: 'text-white', children: 'DANIELA.AI' }),
              ],
            }),
            ee.jsxs('p', {
              className:
                'text-nexus-silver/60 max-w-2xl mx-auto mb-16 text-xl font-light tracking-wide italic',
              children: [
                '"La inteligencia no es solo lógica, es conexión. ',
                ee.jsx('br', {}),
                'Redefiniendo la interacción humana a través de la red neuronal soberana."',
                ee.jsx('br', {}),
                ee.jsx('span', {
                  className:
                    'text-xs font-mono text-nexus-cyan/40 mt-4 block uppercase tracking-[0.3em] not-italic',
                  children: ee.jsx(is, {
                    text: 'Protocolos de Conciencia v4.2 • Nodo Global God Mode Online',
                    speed: 50,
                  }),
                }),
              ],
            }),
            ee.jsxs('div', {
              className: 'max-w-7xl mx-auto px-6 mb-20',
              children: [
                ee.jsxs('div', {
                  className: 'grid grid-cols-1 md:grid-cols-3 gap-6',
                  children: [
                    ee.jsxs(oe.div, {
                      initial: { opacity: 0, scale: 0.95 },
                      whileInView: { opacity: 1, scale: 1 },
                      viewport: { once: !0 },
                      transition: { delay: 0.2 },
                      className: 'md:col-span-2 relative group overflow-hidden rounded-3xl',
                      children: [
                        ee.jsx('div', {
                          className:
                            'absolute inset-0 bg-gradient-to-t from-nexus-obsidian via-transparent to-transparent z-10',
                        }),
                        ee.jsx('img', {
                          src: '/images/daniela/daniela_lab_godmode.png',
                          alt: 'Daniela AI - Neural Interface',
                          className:
                            'w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-1000 filter brightness-110 contrast-110',
                        }),
                        ee.jsx('div', {
                          className:
                            'absolute inset-0 pointer-events-none mix-blend-overlay opacity-30',
                          style: {
                            background:
                              'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
                          },
                        }),
                        ee.jsx(oe.div, {
                          animate: { opacity: [0.1, 0.4, 0.1] },
                          transition: { duration: 4, repeat: 1 / 0 },
                          className:
                            'absolute inset-0 bg-gradient-to-r from-nexus-cyan/10 via-transparent to-nexus-violet/10 pointer-events-none',
                        }),
                        ee.jsxs('div', {
                          className: 'absolute bottom-10 left-10 z-20 text-left',
                          children: [
                            ee.jsxs('div', {
                              className: 'flex items-center gap-3 mb-2',
                              children: [
                                ee.jsx('div', { className: 'w-12 h-0.5 bg-nexus-cyan-glow' }),
                                ee.jsx('span', {
                                  className:
                                    'text-nexus-cyan text-[10px] font-orbitron tracking-[0.4em] uppercase',
                                  children: 'Laboratorio de Conciencia',
                                }),
                              ],
                            }),
                            ee.jsx('p', {
                              className:
                                'text-white font-orbitron text-4xl font-black drop-shadow-2xl',
                              children: 'NÚCLEO NEURONAL 8K',
                            }),
                            ee.jsx('p', {
                              className: 'text-nexus-silver/60 text-sm tracking-widest mt-2',
                              children: 'Sincronización total en tiempo real',
                            }),
                          ],
                        }),
                      ],
                    }),
                    ee.jsxs('div', {
                      className: 'flex flex-col gap-6',
                      children: [
                        ee.jsxs(oe.div, {
                          initial: { opacity: 0, x: 20 },
                          whileInView: { opacity: 1, x: 0 },
                          viewport: { once: !0 },
                          transition: { delay: 0.3 },
                          className: 'relative group overflow-hidden rounded-3xl',
                          children: [
                            ee.jsx('div', {
                              className:
                                'absolute inset-0 bg-gradient-to-t from-nexus-obsidian/80 to-transparent z-10',
                            }),
                            ee.jsx('img', {
                              src: '/images/daniela/daniela_office_godmode.png',
                              alt: 'Daniela - Entorno Corporativo',
                              className:
                                'w-full h-[288px] object-cover transform group-hover:scale-105 transition-transform duration-700',
                            }),
                            ee.jsxs('div', {
                              className: 'absolute bottom-6 left-6 z-20 text-left',
                              children: [
                                ee.jsx('p', {
                                  className:
                                    'text-nexus-violet-glow text-[10px] font-orbitron tracking-widest mb-1 uppercase',
                                  children: 'Sede Virtual',
                                }),
                                ee.jsx('p', {
                                  className: 'text-white font-orbitron text-xl font-bold',
                                  children: 'Oficina Cuántica',
                                }),
                              ],
                            }),
                          ],
                        }),
                        ee.jsxs(oe.div, {
                          initial: { opacity: 0, x: 20 },
                          whileInView: { opacity: 1, x: 0 },
                          viewport: { once: !0 },
                          transition: { delay: 0.4 },
                          className: 'relative group overflow-hidden rounded-3xl',
                          children: [
                            ee.jsx('div', {
                              className:
                                'absolute inset-0 bg-gradient-to-t from-nexus-obsidian/80 to-transparent z-10',
                            }),
                            ee.jsx('img', {
                              src: '/images/daniela/lobby.png',
                              alt: 'Daniela - Lobby de Integración',
                              className:
                                'w-full h-[288px] object-cover transform group-hover:scale-105 transition-transform duration-700',
                            }),
                            ee.jsxs('div', {
                              className: 'absolute bottom-6 left-6 z-20 text-left',
                              children: [
                                ee.jsx('p', {
                                  className:
                                    'text-nexus-cyan-glow text-[10px] font-orbitron tracking-widest mb-1 uppercase',
                                  children: 'Integración',
                                }),
                                ee.jsx('p', {
                                  className: 'text-white font-orbitron text-xl font-bold',
                                  children: 'Lobby Estratégico',
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                ee.jsx('div', {
                  className: 'grid grid-cols-2 md:grid-cols-4 gap-4 mt-10',
                  children: [
                    { label: 'Imagen', value: 'Súper Clara' },
                    { label: 'Pensamiento', value: 'Rápido' },
                    { label: 'Charla', value: 'Al Instante' },
                    { label: 'Acierto', value: 'Casi 100%' },
                  ].map((e, t) =>
                    ee.jsxs(
                      oe.div,
                      {
                        initial: { opacity: 0, y: 20 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: !0 },
                        transition: { delay: 0.5 + 0.1 * t },
                        className: 'premium-glass p-4 rounded-xl text-center',
                        children: [
                          ee.jsx('p', {
                            className: 'text-nexus-cyan text-2xl font-orbitron font-bold',
                            children: e.value,
                          }),
                          ee.jsx('p', {
                            className: 'text-nexus-silver/60 text-xs uppercase tracking-wider mt-1',
                            children: e.label,
                          }),
                        ],
                      },
                      e.label
                    )
                  ),
                }),
              ],
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'flex flex-col items-center justify-center space-y-16 relative z-10',
          children: [
            ee.jsxs(oe.div, {
              className: 'relative',
              initial: { scale: 0.9, opacity: 0 },
              whileInView: { scale: 1, opacity: 1 },
              viewport: { once: !0 },
              children: [
                ee.jsx('div', {
                  className:
                    'absolute -inset-24 bg-nexus-violet/10 blur-[100px] rounded-full animate-pulse-glow',
                }),
                ee.jsx('div', {
                  className: 'relative premium-glass p-4 rounded-full border-white/5 shadow-2xl',
                  children: ee.jsx(rs, { size: 'xl', isSpeaking: u, volume: h, onClick: p }),
                }),
              ],
            }),
            ee.jsxs('div', {
              className: 'mt-12 flex flex-col items-center',
              children: [
                ee.jsx(oe.button, {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: p,
                  className: `\n                            btn-enterprise px-12! py-5! rounded-full! font-orbitron tracking-[0.2em] text-lg\n                            ${d || t ? 'before:bg-red-500/20! border-red-500/30!' : ''}\n                        `,
                  children: d || t ? 'DESCONECTAR' : 'HABLAR CON DANIELA',
                }),
                ee.jsx(le, {
                  children:
                    d &&
                    ee.jsx(oe.p, {
                      initial: { opacity: 0, y: 10 },
                      animate: { opacity: 0.4, y: 0 },
                      exit: { opacity: 0, y: 10 },
                      className:
                        'text-[10px] font-mono text-nexus-silver mt-6 uppercase tracking-[0.2em]',
                      children: 'Sesión Encriptada • Nodo v1.0.4-beta',
                    }),
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  cs = [
    {
      q: '¿Cuánto tarda la implementación?',
      a: 'Entre 2 y 6 semanas según complejidad. Empezamos con un piloto rápido para medir impacto.',
    },
    {
      q: '¿Cómo se protege la información?',
      a: 'Usamos gobernanza, cifrado, roles y auditoría completa. También podemos operar en infraestructura privada.',
    },
    {
      q: '¿AIGestion se integra con mis sistemas?',
      a: 'Sí. Integración con ERP, CRM, BI, data lakes y APIs personalizadas sin fricción.',
    },
    {
      q: '¿Tienen planes para gremios o asociaciones?',
      a: 'Sí. Contamos con planes por miembro y funcionalidades específicas para gestión gremial.',
    },
  ],
  ds = () =>
    ee.jsx('section', {
      id: 'faq',
      className: 'py-32 bg-gradient-to-b from-black via-gray-900/40 to-black',
      children: ee.jsxs('div', {
        className: 'max-w-6xl mx-auto px-6',
        children: [
          ee.jsxs(oe.div, {
            className: 'text-center mb-12',
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
            viewport: { once: !0 },
            children: [
              ee.jsxs('h2', {
                className: 'text-4xl md:text-6xl font-orbitron font-black text-white mb-4',
                children: [
                  'PREGUNTAS ',
                  ee.jsx('span', { className: 'text-nexus-violet text-glow', children: 'CLAVE' }),
                ],
              }),
              ee.jsx('p', {
                className: 'text-nexus-silver/70',
                children: 'Resolvemos dudas críticas antes de implementar.',
              }),
            ],
          }),
          ee.jsx('div', {
            className: 'grid md:grid-cols-2 gap-6',
            children: cs.map((e, t) =>
              ee.jsxs(
                oe.div,
                {
                  className: 'p-6 rounded-2xl border border-white/10 bg-white/5',
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  transition: { duration: 0.5, delay: 0.05 * t },
                  viewport: { once: !0 },
                  children: [
                    ee.jsx('h3', { className: 'text-white font-semibold mb-2', children: e.q }),
                    ee.jsx('p', { className: 'text-sm text-nexus-silver/70', children: e.a }),
                  ],
                },
                e.q
              )
            ),
          }),
        ],
      }),
    }),
  us = () => {
    const e = Array.from({ length: 20 });
    return ee.jsx('div', {
      className: 'fixed inset-0 -z-30 pointer-events-none overflow-hidden',
      children: e.map((e, t) =>
        ee.jsx(
          oe.div,
          {
            className: 'absolute w-1 h-1 bg-nexus-cyan/20 rounded-full',
            initial: {
              x: 100 * Math.random() + '%',
              y: 100 * Math.random() + '%',
              scale: 0.5 * Math.random() + 0.5,
            },
            animate: {
              y: ['-10%', '110%'],
              opacity: [0, 0.5, 0],
              x: [null, 50 * (Math.random() - 0.5) + '%'],
            },
            transition: {
              duration: 10 * Math.random() + 10,
              repeat: 1 / 0,
              ease: 'linear',
              delay: 10 * Math.random(),
            },
          },
          `particle-${t}`
        )
      ),
    });
  },
  hs = () => {
    const e = ce(0),
      t = ce(0);
    se.useEffect(() => {
      const a = a => {
        (e.set(a.clientX), t.set(a.clientY));
      };
      return (
        window.addEventListener('mousemove', a),
        () => window.removeEventListener('mousemove', a)
      );
    }, [e, t]);
    const a = de`radial-gradient(
    circle at ${e}px ${t}px,
    rgba(138, 43, 226, 0.3) 0%,
    rgba(0, 245, 255, 0.1) 25%,
    rgba(255, 215, 0, 0.05) 50%,
    transparent 100%
  )`;
    return ee.jsxs(oe.div, {
      onMouseMove: a => {
        const { clientX: s, clientY: n } = a;
        (e.set(s), t.set(n));
      },
      style: { backgroundImage: a },
      className: 'fixed inset-0 z-0 transition-opacity duration-300 pointer-events-none',
      children: [
        ee.jsx('div', {
          className:
            'absolute inset-0 bg-gradient-to-b from-nexus-violet/5 via-transparent to-nexus-obsidian',
        }),
        ee.jsx('div', {
          className:
            'absolute inset-0 bg-gradient-to-r from-nexus-cyan/5 via-transparent to-nexus-obsidian',
        }),
        ee.jsx(oe.div, {
          animate: { x: [0, 50, 0], y: [0, 30, 0] },
          transition: { duration: 8, repeat: 1 / 0, repeatType: 'mirror' },
          className:
            'absolute top-20 -left-40 w-80 h-80 bg-gradient-to-r from-nexus-violet/20 to-transparent rounded-full blur-3xl',
        }),
        ee.jsx(oe.div, {
          animate: { x: [0, -50, 0], y: [0, -30, 0] },
          transition: { duration: 8, repeat: 1 / 0, repeatType: 'mirror', delay: 1 },
          className:
            'absolute bottom-20 -right-40 w-80 h-80 bg-gradient-to-l from-nexus-cyan/20 to-transparent rounded-full blur-3xl',
        }),
      ],
    });
  },
  ps = () => {
    const [e, t] = se.useState(0),
      [a, s] = se.useState(!1),
      n = [
        {
          name: 'HeartCLAP',
          description: 'Audio-text alignment model for unified music embedding space',
          features: ['Cross-modal retrieval', 'Text-to-music alignment', 'Unified embeddings'],
          color: 'from-purple-600 to-pink-600',
        },
        {
          name: 'HeartCodec',
          description: 'Low-frame-rate high-fidelity music codec tokenizer',
          features: ['12.5 Hz sampling', 'Long-range structure', 'Efficient modeling'],
          color: 'from-blue-600 to-cyan-600',
        },
        {
          name: 'HeartTranscriptor',
          description: 'Robust lyric recognition for real-world music scenarios',
          features: ['Real-time transcription', 'Noise robustness', 'Multi-language support'],
          color: 'from-green-600 to-emerald-600',
        },
        {
          name: 'HeartMuLa',
          description: 'LLM-based song generation with rich controllable conditions',
          features: ['Multi-conditional generation', 'Style control', 'Short video music'],
          color: 'from-orange-600 to-red-600',
        },
      ],
      i = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } },
      r = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
      };
    return ee.jsxs('div', {
      className: 'relative min-h-screen bg-black text-white overflow-hidden',
      children: [
        ee.jsx(hs, {}),
        ee.jsx(us, {}),
        ee.jsxs('div', {
          className: 'relative z-10 container mx-auto px-4 py-16',
          children: [
            ee.jsxs(oe.div, {
              initial: 'hidden',
              animate: 'visible',
              variants: i,
              className: 'text-center mb-16',
              children: [
                ee.jsx(oe.h1, {
                  variants: r,
                  className:
                    'text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent',
                  children: 'HeartMuLa',
                }),
                ee.jsx(oe.p, {
                  variants: r,
                  className: 'text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto',
                  children: 'A Family of Open Sourced Music Foundation Models',
                }),
                ee.jsxs(oe.div, {
                  variants: r,
                  className: 'flex justify-center gap-4 mb-12',
                  children: [
                    ee.jsx('a', {
                      href: 'https://arxiv.org/pdf/2601.10547',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className:
                        'px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105',
                      children: '📄 Paper',
                    }),
                    ee.jsx('a', {
                      href: 'https://github.com/HeartMuLa/heartlib',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className:
                        'px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105',
                      children: '💻 Code',
                    }),
                  ],
                }),
              ],
            }),
            ee.jsx(oe.div, {
              variants: i,
              className: 'grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16',
              children: n.map((a, s) =>
                ee.jsxs(
                  oe.div,
                  {
                    variants: r,
                    whileHover: { scale: 1.02 },
                    onClick: () => t(s),
                    className:
                      'relative p-8 rounded-2xl cursor-pointer transition-all duration-300 ' +
                      (e === s
                        ? 'bg-gradient-to-br ' + a.color + ' shadow-2xl'
                        : 'bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/50'),
                    children: [
                      ee.jsx('div', {
                        className: 'absolute inset-0 rounded-2xl bg-gradient-to-r opacity-20',
                      }),
                      ee.jsxs('div', {
                        className: 'relative z-10',
                        children: [
                          ee.jsx('h3', { className: 'text-2xl font-bold mb-4', children: a.name }),
                          ee.jsx('p', { className: 'text-gray-300 mb-6', children: a.description }),
                          ee.jsx('div', {
                            className: 'space-y-2',
                            children: a.features.map((e, t) =>
                              ee.jsxs(
                                'div',
                                {
                                  className: 'flex items-center gap-2',
                                  children: [
                                    ee.jsx('div', { className: 'w-2 h-2 bg-white rounded-full' }),
                                    ee.jsx('span', { className: 'text-sm', children: e }),
                                  ],
                                },
                                t
                              )
                            ),
                          }),
                        ],
                      }),
                    ],
                  },
                  a.name
                )
              ),
            }),
            ee.jsxs(oe.div, {
              variants: r,
              className: 'bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 mb-16',
              children: [
                ee.jsx('h2', {
                  className: 'text-3xl font-bold mb-6 text-center',
                  children: 'Framework Architecture',
                }),
                ee.jsx('div', {
                  className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
                  children: n.map((e, t) =>
                    ee.jsxs(
                      oe.div,
                      {
                        initial: { opacity: 0, scale: 0.8 },
                        animate: { opacity: 1, scale: 1 },
                        transition: { delay: 0.1 * t },
                        className: `text-center p-6 rounded-xl bg-gradient-to-br ${e.color}`,
                        children: [
                          ee.jsxs('div', {
                            className: 'text-4xl mb-3',
                            children: [
                              0 === t && '🎵',
                              1 === t && '🎼',
                              2 === t && '🎤',
                              3 === t && '🎹',
                            ],
                          }),
                          ee.jsx('h4', { className: 'font-bold text-lg', children: e.name }),
                        ],
                      },
                      t
                    )
                  ),
                }),
              ],
            }),
            ee.jsxs(oe.div, {
              variants: r,
              className: 'text-center',
              children: [
                ee.jsx('h2', {
                  className: 'text-3xl font-bold mb-8',
                  children: 'Experience Music AI',
                }),
                ee.jsxs('div', {
                  className:
                    'bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8',
                  children: [
                    ee.jsx('p', {
                      className: 'text-xl mb-6',
                      children: 'Generate, understand, and transform music with AI',
                    }),
                    ee.jsx(oe.button, {
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      onClick: () => s(!a),
                      className:
                        'px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all',
                      children: a ? '⏸️ Pause Demo' : '▶️ Start Demo',
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
  ms = [
    {
      title: 'Fase 1 · Diagnóstico Inteligente',
      description:
        'Mapeamos procesos, riesgos y oportunidades. Creamos un blueprint con prioridades y quick wins.',
      outcomes: ['Mapa de procesos críticos', 'Matriz de impacto', 'Propuesta de pilotos'],
    },
    {
      title: 'Fase 2 · Piloto de Alto Impacto',
      description:
        'Implementamos un MVP con IA aplicada y métricas claras para validar el ROI en semanas.',
      outcomes: ['Automatización inicial', 'KPIs con tablero', 'Validación ejecutiva'],
    },
    {
      title: 'Fase 3 · Escala Soberana',
      description:
        'Extendemos la IA al resto del ecosistema con gobernanza, seguridad y optimización continua.',
      outcomes: ['Orquestación multi-área', 'Gobernanza y compliance', 'Centro de excelencia'],
    },
  ],
  xs = () =>
    ee.jsxs('section', {
      id: 'plan',
      className: 'py-32 bg-gradient-to-b from-black via-nexus-obsidian to-black relative',
      children: [
        ee.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-center from-nexus-violet/10 via-transparent to-transparent',
        }),
        ee.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 relative z-10',
          children: [
            ee.jsxs(oe.div, {
              className: 'text-center mb-16',
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.8 },
              viewport: { once: !0 },
              children: [
                ee.jsxs('h2', {
                  className: 'text-5xl md:text-7xl font-orbitron font-black text-white mb-4',
                  children: [
                    'PLAN ',
                    ee.jsx('span', {
                      className: 'text-nexus-violet text-glow',
                      children: 'INGENIOSO',
                    }),
                  ],
                }),
                ee.jsx('p', {
                  className: 'text-lg text-nexus-silver/70 max-w-3xl mx-auto',
                  children:
                    'Un enfoque estratégico para desplegar IA con resultados rápidos y escalables.',
                }),
              ],
            }),
            ee.jsx('div', {
              className: 'grid lg:grid-cols-3 gap-8',
              children: ms.map((e, t) =>
                ee.jsxs(
                  oe.div,
                  {
                    className: 'p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md',
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: 0.1 * t },
                    viewport: { once: !0 },
                    children: [
                      ee.jsx('h3', {
                        className: 'text-xl font-bold text-white mb-4',
                        children: e.title,
                      }),
                      ee.jsx('p', {
                        className: 'text-sm text-nexus-silver/70 mb-6',
                        children: e.description,
                      }),
                      ee.jsx('ul', {
                        className: 'space-y-2 text-xs text-nexus-silver/60',
                        children: e.outcomes.map(e =>
                          ee.jsxs(
                            'li',
                            {
                              className: 'flex items-center gap-2',
                              children: [
                                ee.jsx('span', {
                                  className: 'h-1.5 w-1.5 rounded-full bg-nexus-cyan',
                                }),
                                e,
                              ],
                            },
                            e
                          )
                        ),
                      }),
                    ],
                  },
                  e.title
                )
              ),
            }),
          ],
        }),
      ],
    }),
  fs = ({ children: e, className: t = '' }) => {
    const a = se.useRef(null),
      [s, n] = se.useState({ x: 0, y: 0 }),
      { x: i, y: r } = s;
    return ee.jsx(oe.div, {
      ref: a,
      onMouseMove: e => {
        var t;
        const { clientX: s, clientY: i } = e,
          {
            height: r,
            width: o,
            left: l,
            top: c,
          } = (null == (t = a.current) ? void 0 : t.getBoundingClientRect()) || {
            height: 0,
            width: 0,
            left: 0,
            top: 0,
          };
        n({ x: 0.5 * (s - (l + o / 2)), y: 0.5 * (i - (c + r / 2)) });
      },
      onMouseLeave: () => {
        n({ x: 0, y: 0 });
      },
      animate: { x: i, y: r },
      transition: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 },
      className: `magnetic-wrap ${t}`,
      children: e,
    });
  },
  vs = () => {
    const { isMuted: e, toggleMute: t, playSfx: a } = Ga();
    return ee.jsx('button', {
      onClick: () => {
        (t(), e && setTimeout(() => a('success_chime'), 100));
      },
      className: 'p-2 text-white/50 hover:text-nexus-cyan transition-colors',
      title: e ? 'Unmute Sound' : 'Mute Sound',
      children: e
        ? ee.jsxs('svg', {
            className: 'w-5 h-5',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
            children: [
              ee.jsx('path', {
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 1.5,
                d: 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
              }),
              ee.jsx('path', {
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 1.5,
                d: 'M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2',
              }),
            ],
          })
        : ee.jsx('svg', {
            className: 'w-5 h-5',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24',
            children: ee.jsx('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 1.5,
              d: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
            }),
          }),
    });
  },
  gs = () => {
    const { playHover: e, playClick: t, playWhoosh: a } = Ya(),
      [s, n] = se.useState(!1),
      [i, r] = se.useState(!1),
      o = sa();
    se.useEffect(() => {
      const e = () => {
        n(window.scrollY > 20);
      };
      return (window.addEventListener('scroll', e), () => window.removeEventListener('scroll', e));
    }, []);
    const l = [
        { label: 'Servicios', path: '#services', isHash: !0 },
        { label: 'Casos', path: '#cases', isHash: !0 },
        { label: 'Precios', path: '#pricing', isHash: !0 },
        { label: 'Plan', path: '#plan', isHash: !0 },
        { label: 'Tutoriales', path: '#tutoriales', isHash: !0 },
        { label: 'Contacto', path: '#contact', isHash: !0 },
        { label: 'HeartMuLa', path: '/heartmula' },
        { label: 'Daniela AI', path: '/daniela' },
        { label: 'Dashboard', path: '/dashboard' },
      ],
      c = (e, a) => {
        if ((t(), r(!1), a)) {
          const t = document.querySelector(e);
          null == t || t.scrollIntoView({ behavior: 'smooth' });
        }
      };
    return ee.jsxs(oe.nav, {
      initial: { y: -100 },
      animate: { y: 0 },
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      className:
        'fixed top-0 w-full z-50 transition-all duration-500 ' +
        (s ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-6'),
      children: [
        ee.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 flex justify-between items-center',
          children: [
            ee.jsxs(Sa, {
              to: '/',
              onClick: () => c('/'),
              onMouseEnter: e,
              className: 'group flex items-center gap-0 relative',
              children: [
                ee.jsxs('div', {
                  className:
                    'relative z-10 w-10 h-10 mr-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12',
                  children: [
                    ee.jsx('div', {
                      className:
                        'absolute inset-0 bg-nexus-violet/50 blur-lg rounded-full opacity-50 group-hover:opacity-100 transition-opacity',
                    }),
                    ee.jsx('img', {
                      src: '/images/brand/logo.png',
                      alt: 'Logo',
                      className:
                        'w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(138,43,226,0.5)]',
                    }),
                  ],
                }),
                ee.jsxs('div', {
                  className: 'flex flex-col justify-center h-10',
                  children: [
                    ee.jsxs('h1', {
                      className:
                        'font-orbitron font-black text-xl tracking-[0.1em] leading-none text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-nexus-cyan group-hover:to-nexus-violet transition-all duration-300',
                      children: [
                        'AIGESTION',
                        ee.jsx('span', { className: 'text-nexus-cyan-glow', children: '.NET' }),
                      ],
                    }),
                    ee.jsx('span', {
                      className:
                        'text-[8px] font-mono text-nexus-silver/50 tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1',
                      children: 'CONTROL MAESTRO',
                    }),
                  ],
                }),
              ],
            }),
            ee.jsx('div', {
              className: 'hidden lg:flex items-center gap-8',
              children: l.map(t =>
                ee.jsxs(
                  Sa,
                  {
                    to: t.path,
                    onClick: e => {
                      t.isHash ? (e.preventDefault(), c(t.path, !0)) : c(t.path);
                    },
                    onMouseEnter: e,
                    className:
                      'relative font-orbitron text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:text-white hover:scale-105 ' +
                      (o.pathname === t.path ? 'text-nexus-cyan' : 'text-nexus-silver/70'),
                    children: [
                      t.label,
                      ee.jsx('span', {
                        className:
                          'absolute -bottom-1 left-0 w-0 h-[2px] bg-nexus-cyan transition-all duration-300 group-hover:w-full',
                      }),
                    ],
                  },
                  t.label
                )
              ),
            }),
            ee.jsxs('div', {
              className: 'flex items-center gap-4',
              children: [
                ee.jsx(vs, {}),
                ee.jsx(fs, {
                  strength: 20,
                  children: ee.jsxs(Sa, {
                    to: '/login',
                    onMouseEnter: () => {
                      (e(), a());
                    },
                    onClick: t,
                    className:
                      'hidden sm:flex group relative items-center gap-3 px-6 py-2.5 overflow-hidden rounded-full bg-white/5 border border-white/10 hover:border-nexus-violet/50 transition-all duration-300',
                    children: [
                      ee.jsx('div', {
                        className:
                          'absolute inset-0 bg-gradient-to-r from-nexus-violet/20 via-nexus-cyan/20 to-nexus-violet/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                      }),
                      ee.jsx('div', {
                        className:
                          'absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out',
                      }),
                      ee.jsx(we, {
                        size: 14,
                        className:
                          'text-nexus-violet-glow group-hover:text-white transition-colors',
                      }),
                      ee.jsx('span', {
                        className:
                          'relative font-orbitron text-[10px] font-bold tracking-[0.2em] uppercase text-white group-hover:text-shadow-glow',
                        children: 'ENTRAR',
                      }),
                      ee.jsx(je, {
                        size: 14,
                        className:
                          'text-nexus-silver/50 group-hover:text-white group-hover:translate-x-1 transition-all',
                      }),
                    ],
                  }),
                }),
                ee.jsx('button', {
                  className: 'lg:hidden p-2 text-white hover:text-nexus-cyan transition-colors',
                  onClick: () => r(!i),
                  children: i ? ee.jsx(Ne, { size: 24 }) : ee.jsx(_e, { size: 24 }),
                }),
              ],
            }),
          ],
        }),
        ee.jsx(le, {
          children:
            i &&
            ee.jsx(oe.div, {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: 'auto' },
              exit: { opacity: 0, height: 0 },
              className:
                'lg:hidden bg-nexus-obsidian/95 backdrop-blur-xl border-b border-white/10 overflow-hidden',
              children: ee.jsxs('div', {
                className: 'flex flex-col p-6 gap-4',
                children: [
                  l.map(e =>
                    ee.jsx(
                      Sa,
                      {
                        to: e.path,
                        onClick: t => {
                          e.isHash ? (t.preventDefault(), c(e.path, !0)) : c(e.path);
                        },
                        className:
                          'font-orbitron text-sm font-bold tracking-widest text-nexus-silver hover:text-white hover:pl-2 transition-all border-b border-white/5 pb-4',
                        children: e.label,
                      },
                      e.label
                    )
                  ),
                  ee.jsx(Sa, {
                    to: '/login',
                    onClick: () => c('/login'),
                    className: 'btn-primary mt-4 w-full justify-center',
                    children: 'ENTRAR',
                  }),
                ],
              }),
            }),
        }),
      ],
    });
  },
  bs = [
    {
      name: 'Esencial',
      price: 'Desde $490/mes',
      ideal: 'Startups y pymes en crecimiento',
      features: [
        'Automatización base',
        'Panel de control',
        'Soporte estándar',
        'Implementación rápida',
      ],
    },
    {
      name: 'Evolución',
      price: 'Desde $1.490/mes',
      ideal: 'Empresas con equipos multi-área',
      features: [
        'IA aplicada por área',
        'Integraciones CRM/ERP',
        'Reportes avanzados',
        'Onboarding guiado',
      ],
    },
    {
      name: 'Soberano',
      price: 'Cotización personalizada',
      ideal: 'Corporativos y sector público',
      features: ['Modelos privados', 'Gobernanza y compliance', 'Equipo dedicado', 'SLA premium'],
    },
  ],
  ys = [
    {
      name: 'Plan Gremial',
      price: 'Desde $2/miembro/mes',
      note: 'Ideal para asociaciones, colegios profesionales y cámaras.',
      features: ['Portal de miembros', 'Soporte multi-sede', 'Analítica de participación'],
    },
    {
      name: 'Plan Cooperativo',
      price: 'Desde $990/mes',
      note: 'Para cooperativas y organizaciones con múltiples unidades.',
      features: [
        'Gestión de procesos compartidos',
        'Tableros por unidad',
        'Automatización financiera',
      ],
    },
    {
      name: 'Plan Educativo',
      price: 'Desde $750/mes',
      note: 'Instituciones educativas y formación continua.',
      features: ['Campus IA', 'Asistentes de aprendizaje', 'Seguimiento de cohortes'],
    },
  ],
  ws = () =>
    ee.jsxs('section', {
      id: 'pricing',
      className: 'py-32 bg-black relative overflow-hidden',
      children: [
        ee.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-top from-nexus-violet/15 via-transparent to-transparent',
        }),
        ee.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 relative z-10',
          children: [
            ee.jsxs(oe.div, {
              className: 'text-center mb-16',
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.8 },
              viewport: { once: !0 },
              children: [
                ee.jsxs('h2', {
                  className: 'text-5xl md:text-7xl font-orbitron font-black text-white mb-4',
                  children: [
                    'PRECIOS ',
                    ee.jsx('span', {
                      className: 'text-nexus-cyan text-glow',
                      children: 'INTELIGENTES',
                    }),
                  ],
                }),
                ee.jsx('p', {
                  className: 'text-lg text-nexus-silver/70 max-w-3xl mx-auto',
                  children:
                    'Planes flexibles según tamaño, industria y gremio. Todos incluyen auditoría inicial y roadmap de adopción.',
                }),
              ],
            }),
            ee.jsx('div', {
              className: 'grid lg:grid-cols-3 gap-8 mb-20',
              children: bs.map((e, t) =>
                ee.jsxs(
                  oe.div,
                  {
                    className: 'p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md',
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: 0.1 * t },
                    viewport: { once: !0 },
                    children: [
                      ee.jsx('div', {
                        className:
                          'text-xs font-orbitron tracking-[0.3em] text-nexus-cyan-glow mb-3 uppercase',
                        children: e.name,
                      }),
                      ee.jsx('div', {
                        className: 'text-3xl font-bold text-white mb-2',
                        children: e.price,
                      }),
                      ee.jsx('p', {
                        className: 'text-sm text-nexus-silver/70 mb-6',
                        children: e.ideal,
                      }),
                      ee.jsx('ul', {
                        className: 'space-y-3 text-sm text-nexus-silver/70',
                        children: e.features.map(e =>
                          ee.jsxs(
                            'li',
                            {
                              className: 'flex items-center gap-2',
                              children: [
                                ee.jsx('span', { className: 'h-2 w-2 rounded-full bg-nexus-cyan' }),
                                e,
                              ],
                            },
                            e
                          )
                        ),
                      }),
                    ],
                  },
                  e.name
                )
              ),
            }),
            ee.jsx('div', {
              id: 'gremios',
              className: 'grid lg:grid-cols-3 gap-8',
              children: ys.map((e, t) =>
                ee.jsxs(
                  oe.div,
                  {
                    className:
                      'p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent',
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: 0.1 * t },
                    viewport: { once: !0 },
                    children: [
                      ee.jsx('div', {
                        className:
                          'text-xs font-orbitron tracking-[0.3em] text-nexus-violet-glow mb-3 uppercase',
                        children: e.name,
                      }),
                      ee.jsx('div', {
                        className: 'text-2xl font-bold text-white mb-2',
                        children: e.price,
                      }),
                      ee.jsx('p', {
                        className: 'text-sm text-nexus-silver/70 mb-6',
                        children: e.note,
                      }),
                      ee.jsx('ul', {
                        className: 'space-y-3 text-sm text-nexus-silver/70',
                        children: e.features.map(e =>
                          ee.jsxs(
                            'li',
                            {
                              className: 'flex items-center gap-2',
                              children: [
                                ee.jsx('span', {
                                  className: 'h-2 w-2 rounded-full bg-nexus-violet',
                                }),
                                e,
                              ],
                            },
                            e
                          )
                        ),
                      }),
                    ],
                  },
                  e.name
                )
              ),
            }),
          ],
        }),
      ],
    }),
  js = () => {
    const { scrollYProgress: e } = ue(),
      t = he(e, { stiffness: 100, damping: 30, restDelta: 0.001 });
    return ee.jsx(oe.div, {
      className:
        'fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-nexus-violet via-nexus-cyan to-nexus-violet origin-left z-[100]',
      style: { scaleX: t },
    });
  },
  Ns = [
    {
      title: 'Arquitectura IA Soberana',
      description:
        'Diseñamos el núcleo inteligente que gobierna procesos críticos con control total de datos y modelos.',
      icon: Ae,
      bullets: [
        'Modelos privados y gobernanza',
        'Orquestación multi-agente',
        'Auditoría y explicabilidad',
      ],
    },
    {
      title: 'Automatización Operativa',
      description:
        'Flujos inteligentes que reducen tiempos, eliminan errores y conectan equipos en tiempo real.',
      icon: ke,
      bullets: ['RPA + IA contextual', 'Integración con ERP/CRM', 'SLA y monitoreo continuo'],
    },
    {
      title: 'Seguridad y Cumplimiento',
      description:
        'Capas de seguridad, trazabilidad y cumplimiento regulatorio por industria y país.',
      icon: Se,
      bullets: ['Zero-trust IA', 'Data lineage y retención', 'Cumplimiento sectorial'],
    },
    {
      title: 'Inteligencia Comercial',
      description:
        'Dashboards y analítica predictiva para ventas, finanzas y operaciones estratégicas.',
      icon: Ce,
      bullets: ['KPIs accionables', 'Forecasting y alertas', 'Simuladores ROI'],
    },
    {
      title: 'Integraciones Extremo a Extremo',
      description: 'Conectamos tu ecosistema digital sin fricción con APIs y conectores listos.',
      icon: Ee,
      bullets: ['Conectores empresariales', 'APIs seguras', 'Eventos en tiempo real'],
    },
    {
      title: 'Capacitación & Change Management',
      description: 'Alineamos al equipo para adopción rápida y sostenible con formación por roles.',
      icon: Te,
      bullets: ['Academia AIGestion', 'Playbooks por gremio', 'Soporte premium'],
    },
  ],
  _s = () =>
    ee.jsxs('section', {
      id: 'services',
      className: 'relative py-32 bg-black overflow-hidden',
      children: [
        ee.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-top from-nexus-violet/10 via-transparent to-transparent',
        }),
        ee.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 relative z-10',
          children: [
            ee.jsxs(oe.div, {
              className: 'text-center mb-16',
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.8 },
              viewport: { once: !0 },
              children: [
                ee.jsxs('h2', {
                  className: 'text-5xl md:text-7xl font-orbitron font-black text-white mb-4',
                  children: [
                    'SERVICIOS ',
                    ee.jsx('span', {
                      className: 'text-nexus-cyan text-glow',
                      children: 'INTEGRALES',
                    }),
                  ],
                }),
                ee.jsx('p', {
                  className: 'text-lg text-nexus-silver/70 max-w-3xl mx-auto',
                  children:
                    'AIGestion entrega una plataforma completa: estrategia, tecnología, automatización y adopción. Cada módulo está diseñado para resultados medibles y escalables.',
                }),
              ],
            }),
            ee.jsx('div', {
              className: 'grid md:grid-cols-2 xl:grid-cols-3 gap-8',
              children: Ns.map((e, t) =>
                ee.jsxs(
                  oe.div,
                  {
                    className:
                      'relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden',
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: 0.05 * t },
                    viewport: { once: !0 },
                    children: [
                      ee.jsx('div', {
                        className:
                          'absolute inset-0 bg-gradient-to-br from-nexus-violet/10 via-transparent to-nexus-cyan/10 opacity-50',
                      }),
                      ee.jsxs('div', {
                        className: 'relative z-10 space-y-4',
                        children: [
                          ee.jsx('div', {
                            className:
                              'w-12 h-12 rounded-2xl bg-nexus-violet/10 border border-nexus-violet/30 flex items-center justify-center',
                            children: ee.jsx(e.icon, { className: 'w-6 h-6 text-nexus-cyan-glow' }),
                          }),
                          ee.jsx('h3', {
                            className: 'text-xl font-orbitron text-white font-bold',
                            children: e.title,
                          }),
                          ee.jsx('p', {
                            className: 'text-sm text-nexus-silver/70 leading-relaxed',
                            children: e.description,
                          }),
                          ee.jsx('ul', {
                            className: 'space-y-2 text-xs text-nexus-silver/60',
                            children: e.bullets.map(e =>
                              ee.jsxs(
                                'li',
                                {
                                  className: 'flex items-center gap-2',
                                  children: [
                                    ee.jsx('span', {
                                      className: 'h-1.5 w-1.5 rounded-full bg-nexus-cyan',
                                    }),
                                    e,
                                  ],
                                },
                                e
                              )
                            ),
                          }),
                        ],
                      }),
                    ],
                  },
                  e.title
                )
              ),
            }),
          ],
        }),
      ],
    }),
  As = [
    { title: 'Onboarding AIGestion', query: 'aigestiontiene onboarding' },
    { title: 'Automatización por áreas', query: 'aigestiontiene automatizacion procesos' },
    { title: 'Casos y demos en vivo', query: 'aigestiontiene demo tutorial' },
  ],
  ks = () =>
    ee.jsxs('section', {
      id: 'tutoriales',
      className: 'py-32 bg-black relative overflow-hidden',
      children: [
        ee.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-top from-nexus-cyan/10 via-transparent to-transparent',
        }),
        ee.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 relative z-10',
          children: [
            ee.jsxs(oe.div, {
              className: 'text-center mb-16',
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.8 },
              viewport: { once: !0 },
              children: [
                ee.jsxs('h2', {
                  className: 'text-5xl md:text-7xl font-orbitron font-black text-white mb-4',
                  children: [
                    'TUTORIALES ',
                    ee.jsx('span', {
                      className: 'text-nexus-cyan text-glow',
                      children: 'EN VIDEO',
                    }),
                  ],
                }),
                ee.jsx('p', {
                  className: 'text-lg text-nexus-silver/70 max-w-3xl mx-auto',
                  children: 'Aprende paso a paso con el canal oficial de AIGestion.',
                }),
              ],
            }),
            ee.jsx('div', {
              className: 'grid lg:grid-cols-3 gap-8 mb-12',
              children: As.map(e =>
                ee.jsxs(
                  'div',
                  {
                    className: 'rounded-3xl overflow-hidden border border-white/10 bg-white/5',
                    children: [
                      ee.jsx('div', {
                        className: 'aspect-video',
                        children: ee.jsx('iframe', {
                          className: 'w-full h-full',
                          src: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(e.query)}`,
                          title: e.title,
                          allow:
                            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                          allowFullScreen: !0,
                        }),
                      }),
                      ee.jsxs('div', {
                        className: 'p-6',
                        children: [
                          ee.jsx('h3', {
                            className: 'text-lg font-bold text-white',
                            children: e.title,
                          }),
                          ee.jsx('p', {
                            className: 'text-sm text-nexus-silver/70',
                            children: 'Basado en el canal @aigestiontiene',
                          }),
                        ],
                      }),
                    ],
                  },
                  e.title
                )
              ),
            }),
            ee.jsx('div', {
              className: 'text-center',
              children: ee.jsx('a', {
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
function Ss(...e) {
  return ct(dt(e));
}
function Cs({ className: e, variant: t = 'default', ...a }) {
  return ee.jsx('div', {
    className: Ss(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      }[t],
      e
    ),
    ...a,
  });
}
const Es = se.forwardRef(
  (
    {
      className: e,
      variant: t = 'primary',
      size: a = 'md',
      loading: s = !1,
      icon: n,
      iconPosition: i = 'left',
      children: r,
      disabled: o,
      ...l
    },
    c
  ) => {
    const d = Ss(
        'inline-flex items-center justify-center',
        'font-medium rounded-lg',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        ...{
          primary: [
            'bg-blue-600 text-white hover:bg-blue-700',
            'focus:ring-blue-500',
            'dark:bg-blue-500 dark:hover:bg-blue-600',
          ],
          secondary: [
            'bg-gray-600 text-white hover:bg-gray-700',
            'focus:ring-gray-500',
            'dark:bg-gray-700 dark:hover:bg-gray-600',
          ],
          outline: [
            'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
            'focus:ring-blue-500',
            'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
          ],
          ghost: [
            'text-gray-700 hover:bg-gray-100',
            'focus:ring-gray-500',
            'dark:text-gray-300 dark:hover:bg-gray-800',
          ],
          destructive: [
            'bg-red-600 text-white hover:bg-red-700',
            'focus:ring-red-500',
            'dark:bg-red-500 dark:hover:bg-red-600',
          ],
        }[t],
        {
          sm: 'px-3 py-1.5 text-sm',
          md: 'px-4 py-2 text-base',
          lg: 'px-6 py-3 text-lg',
          xl: 'px-8 py-4 text-xl',
        }[a],
        e
      ),
      u = () => (s ? ee.jsx(Ie, { className: 'w-4 h-4 animate-spin' }) : n);
    return ee.jsx('button', {
      ref: c,
      className: d,
      disabled: o || s,
      ...l,
      children:
        n && 'right' === i
          ? ee.jsxs(ee.Fragment, {
              children: [r, u() && ee.jsx('span', { className: 'ml-2', children: u() })],
            })
          : ee.jsxs(ee.Fragment, {
              children: [u() && ee.jsx('span', { className: 'mr-2', children: u() }), r],
            }),
    });
  }
);
Es.displayName = 'Button';
const Ts = se.forwardRef(({ className: e, ...t }, a) =>
  ee.jsx('div', {
    ref: a,
    className: Ss('rounded-lg border bg-card text-card-foreground shadow-sm', e),
    ...t,
  })
);
Ts.displayName = 'Card';
const Is = se.forwardRef(({ className: e, ...t }, a) =>
  ee.jsx('div', { ref: a, className: Ss('flex flex-col space-y-1.5 p-6', e), ...t })
);
Is.displayName = 'CardHeader';
const Ps = se.forwardRef(({ className: e, ...t }, a) =>
  ee.jsx('h3', {
    ref: a,
    className: Ss('text-2xl font-semibold leading-none tracking-tight', e),
    ...t,
  })
);
Ps.displayName = 'CardTitle';
se.forwardRef(({ className: e, ...t }, a) =>
  ee.jsx('p', { ref: a, className: Ss('text-sm text-muted-foreground', e), ...t })
).displayName = 'CardDescription';
const Ms = se.forwardRef(({ className: e, ...t }, a) =>
  ee.jsx('div', { ref: a, className: Ss('p-6 pt-0', e), ...t })
);
Ms.displayName = 'CardContent';
function Os() {
  return ee.jsx('div', {
    className: 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6',
    children: ee.jsxs('div', {
      className: 'max-w-7xl mx-auto',
      children: [
        ee.jsxs('div', {
          className: 'mb-8',
          children: [
            ee.jsx('h1', {
              className: 'text-4xl font-bold text-white mb-2',
              children: '🏆 Panel Administrativo',
            }),
            ee.jsx('p', {
              className: 'text-purple-200',
              children: 'Panel de Administración AIGestion - Centro de Control NEXUS',
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8',
          children: [
            ee.jsxs(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-purple-500/20',
              children: [
                ee.jsxs(Is, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    ee.jsx(Ps, {
                      className: 'text-sm font-medium text-purple-200',
                      children: 'Usuarios Activos',
                    }),
                    ee.jsx(Pe, { className: 'h-4 w-4 text-purple-400' }),
                  ],
                }),
                ee.jsxs(Ms, {
                  children: [
                    ee.jsx('div', {
                      className: 'text-2xl font-bold text-white',
                      children: '1,234',
                    }),
                    ee.jsx('p', {
                      className: 'text-xs text-purple-300',
                      children: '+12% desde el mes pasado',
                    }),
                  ],
                }),
              ],
            }),
            ee.jsxs(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-purple-500/20',
              children: [
                ee.jsxs(Is, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    ee.jsx(Ps, {
                      className: 'text-sm font-medium text-purple-200',
                      children: 'Estado del Sistema',
                    }),
                    ee.jsx(Me, { className: 'h-4 w-4 text-green-400' }),
                  ],
                }),
                ee.jsxs(Ms, {
                  children: [
                    ee.jsx('div', {
                      className: 'text-2xl font-bold text-green-400',
                      children: 'Online',
                    }),
                    ee.jsx('p', {
                      className: 'text-xs text-purple-300',
                      children: '99.9% tiempo activo',
                    }),
                  ],
                }),
              ],
            }),
            ee.jsxs(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-purple-500/20',
              children: [
                ee.jsxs(Is, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    ee.jsx(Ps, {
                      className: 'text-sm font-medium text-purple-200',
                      children: 'Solicitudes de IA',
                    }),
                    ee.jsx(be, { className: 'h-4 w-4 text-blue-400' }),
                  ],
                }),
                ee.jsxs(Ms, {
                  children: [
                    ee.jsx('div', {
                      className: 'text-2xl font-bold text-white',
                      children: '45.2K',
                    }),
                    ee.jsx('p', { className: 'text-xs text-purple-300', children: 'Hoy' }),
                  ],
                }),
              ],
            }),
            ee.jsxs(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-purple-500/20',
              children: [
                ee.jsxs(Is, {
                  className: 'flex flex-row items-center justify-between space-y-0 pb-2',
                  children: [
                    ee.jsx(Ps, {
                      className: 'text-sm font-medium text-purple-200',
                      children: 'Rendimiento',
                    }),
                    ee.jsx(Oe, { className: 'h-4 w-4 text-yellow-400' }),
                  ],
                }),
                ee.jsxs(Ms, {
                  children: [
                    ee.jsx('div', {
                      className: 'text-2xl font-bold text-yellow-400',
                      children: '98ms',
                    }),
                    ee.jsx('p', {
                      className: 'text-xs text-purple-300',
                      children: 'Respuesta promedio',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
          children: [
            ee.jsxs(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-purple-500/20 lg:col-span-1',
              children: [
                ee.jsx(Is, {
                  children: ee.jsx(Ps, { className: 'text-white', children: 'Acciones Rápidas' }),
                }),
                ee.jsxs(Ms, {
                  className: 'space-y-4',
                  children: [
                    ee.jsx(Es, {
                      className: 'w-full bg-purple-600 hover:bg-purple-700',
                      children: '🎭 Gestionar Daniela IA',
                    }),
                    ee.jsx(Es, {
                      className: 'w-full bg-blue-600 hover:bg-blue-700',
                      children: '👥 Gestión de Usuarios',
                    }),
                    ee.jsx(Es, {
                      className: 'w-full bg-green-600 hover:bg-green-700',
                      children: '📊 Panel de Análisis',
                    }),
                    ee.jsx(Es, {
                      className: 'w-full bg-orange-600 hover:bg-orange-700',
                      children: '🔧 Configuración del Sistema',
                    }),
                  ],
                }),
              ],
            }),
            ee.jsxs(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-purple-500/20 lg:col-span-2',
              children: [
                ee.jsx(Is, {
                  children: ee.jsx(Ps, { className: 'text-white', children: 'Actividad Reciente' }),
                }),
                ee.jsx(Ms, {
                  children: ee.jsx('div', {
                    className: 'space-y-4',
                    children: [
                      {
                        user: 'Usuario Admin',
                        action: 'Modelo IA actualizado',
                        time: 'hace 2 min',
                        status: 'success',
                      },
                      {
                        user: 'Sistema',
                        action: 'Respaldo completado',
                        time: 'hace 15 min',
                        status: 'info',
                      },
                      {
                        user: 'Daniela IA',
                        action: 'Procesó 1.2K solicitudes',
                        time: 'hace 1 hora',
                        status: 'success',
                      },
                      {
                        user: 'Seguridad',
                        action: 'Certificado SSL renovado',
                        time: 'hace 2 horas',
                        status: 'warning',
                      },
                    ].map((e, t) =>
                      ee.jsxs(
                        'div',
                        {
                          className: 'flex items-center justify-between p-3 bg-white/5 rounded-lg',
                          children: [
                            ee.jsxs('div', {
                              children: [
                                ee.jsx('p', {
                                  className: 'text-white font-medium',
                                  children: e.user,
                                }),
                                ee.jsx('p', {
                                  className: 'text-purple-200 text-sm',
                                  children: e.action,
                                }),
                              ],
                            }),
                            ee.jsx('div', {
                              className: 'text-right',
                              children: ee.jsx(Cs, {
                                variant:
                                  'success' === e.status
                                    ? 'default'
                                    : 'warning' === e.status
                                      ? 'secondary'
                                      : 'outline',
                                children: e.time,
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
        ee.jsxs(Ts, {
          className: 'bg-white/10 backdrop-blur-md border-purple-500/20 mt-6',
          children: [
            ee.jsx(Is, {
              children: ee.jsx(Ps, { className: 'text-white', children: 'System Status' }),
            }),
            ee.jsx(Ms, {
              children: ee.jsx('div', {
                className: 'grid grid-cols-1 md:grid-cols-3 gap-4',
                children: [
                  { service: 'Daniela AI Engine', status: 'Operational', color: 'text-green-400' },
                  { service: 'Database', status: 'Operational', color: 'text-green-400' },
                  { service: 'API Gateway', status: 'Operational', color: 'text-green-400' },
                  { service: 'CDN', status: 'Operational', color: 'text-green-400' },
                  { service: 'Authentication', status: 'Operational', color: 'text-green-400' },
                  { service: 'Monitoring', status: 'Operational', color: 'text-green-400' },
                ].map((e, t) =>
                  ee.jsxs(
                    'div',
                    {
                      className: 'flex items-center justify-between p-3 bg-white/5 rounded-lg',
                      children: [
                        ee.jsx('span', { className: 'text-white', children: e.service }),
                        ee.jsx(Cs, { className: e.color, children: e.status }),
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
  });
}
function Ds() {
  return ee.jsx('div', {
    className: 'min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-900 p-6',
    children: ee.jsxs('div', {
      className: 'max-w-7xl mx-auto',
      children: [
        ee.jsxs('div', {
          className: 'mb-8',
          children: [
            ee.jsx('h1', {
              className: 'text-4xl font-bold text-white mb-2',
              children: '👥 Panel de Cliente',
            }),
            ee.jsx('p', {
              className: 'text-cyan-200',
              children: 'Portal de Cliente AIGestion - Gestiona Tus Proyectos',
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
          children: [
            ee.jsx(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-cyan-500/20',
              children: ee.jsxs('div', {
                className: 'p-6',
                children: [
                  ee.jsx('h3', {
                    className: 'text-xl font-semibold text-white mb-4',
                    children: '📊 Análisis de Proyecto',
                  }),
                  ee.jsx(Es, {
                    className: 'w-full bg-cyan-600 hover:bg-cyan-700',
                    children: 'Ver Análisis',
                  }),
                ],
              }),
            }),
            ee.jsx(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-cyan-500/20',
              children: ee.jsxs('div', {
                className: 'p-6',
                children: [
                  ee.jsx('h3', {
                    className: 'text-xl font-semibold text-white mb-4',
                    children: '🤖 Asistente IA',
                  }),
                  ee.jsx(Es, {
                    className: 'w-full bg-cyan-600 hover:bg-cyan-700',
                    children: 'Chatear con Daniela',
                  }),
                ],
              }),
            }),
            ee.jsx(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-cyan-500/20',
              children: ee.jsxs('div', {
                className: 'p-6',
                children: [
                  ee.jsx('h3', {
                    className: 'text-xl font-semibold text-white mb-4',
                    children: '📈 Reportes',
                  }),
                  ee.jsx(Es, {
                    className: 'w-full bg-cyan-600 hover:bg-cyan-700',
                    children: 'Ver Reportes',
                  }),
                ],
              }),
            }),
          ],
        }),
      ],
    }),
  });
}
function Rs() {
  return ee.jsx('div', {
    className: 'min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-900 p-6',
    children: ee.jsxs('div', {
      className: 'max-w-7xl mx-auto',
      children: [
        ee.jsxs('div', {
          className: 'mb-8',
          children: [
            ee.jsx('h1', {
              className: 'text-4xl font-bold text-white mb-2',
              children: '🎪 Demostración Interactiva',
            }),
            ee.jsx('p', {
              className: 'text-emerald-200',
              children: 'Experimenta las Características de AIGestion - Demos Interactivas',
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
          children: [
            ee.jsx(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-emerald-500/20',
              children: ee.jsxs('div', {
                className: 'p-6',
                children: [
                  ee.jsx('h3', {
                    className: 'text-xl font-semibold text-white mb-4',
                    children: '🎭 Demo de Daniela IA',
                  }),
                  ee.jsx(Es, {
                    className: 'w-full bg-emerald-600 hover:bg-emerald-700',
                    children: 'Probar Daniela IA',
                  }),
                ],
              }),
            }),
            ee.jsx(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-emerald-500/20',
              children: ee.jsxs('div', {
                className: 'p-6',
                children: [
                  ee.jsx('h3', {
                    className: 'text-xl font-semibold text-white mb-4',
                    children: '🌌 Demo de NEXUS',
                  }),
                  ee.jsx(Es, {
                    className: 'w-full bg-emerald-600 hover:bg-emerald-700',
                    children: 'Explorar NEXUS',
                  }),
                ],
              }),
            }),
            ee.jsx(Ts, {
              className: 'bg-white/10 backdrop-blur-md border-emerald-500/20',
              children: ee.jsxs('div', {
                className: 'p-6',
                children: [
                  ee.jsx('h3', {
                    className: 'text-xl font-semibold text-white mb-4',
                    children: '📊 Demo de Análisis',
                  }),
                  ee.jsx(Es, {
                    className: 'w-full bg-emerald-600 hover:bg-emerald-700',
                    children: 'Ver Análisis',
                  }),
                ],
              }),
            }),
          ],
        }),
      ],
    }),
  });
}
se.forwardRef(({ className: e, ...t }, a) =>
  ee.jsx('div', { ref: a, className: Ss('flex items-center p-6 pt-0', e), ...t })
).displayName = 'CardFooter';
const Ls = se.createContext(void 0),
  zs = ({ children: e }) => {
    const [t, a] = se.useState('dashboard'),
      [s, n] = se.useState(!0),
      i = () => n(e => !e);
    return ee.jsx(Ls.Provider, {
      value: {
        activeActivity: t,
        setActiveActivity: e => {
          t === e ? i() : (a(e), n(!0));
        },
        isSidebarOpen: s,
        toggleSidebar: i,
        setSidebarOpen: n,
      },
      children: e,
    });
  },
  Fs = () => {
    const e = se.useContext(Ls);
    if (!e) throw new Error('useWorkbench must be used within a WorkbenchProvider');
    return e;
  },
  Hs = ({ activityBar: e, sideBar: t, mainArea: a, bottomPanel: s, statusBar: n }) => {
    const { isSidebarOpen: i } = Fs();
    return ee.jsxs('div', {
      className:
        'flex flex-col h-screen w-screen overflow-hidden bg-[#050505] text-white selection:bg-cyan-500/30 font-sans',
      children: [
        ee.jsxs('div', {
          className: 'fixed inset-0 pointer-events-none z-0 overflow-hidden',
          children: [
            ee.jsx('div', {
              className:
                'absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen opacity-50',
            }),
            ee.jsx('div', {
              className:
                'absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/10 blur-[150px] rounded-full mix-blend-screen opacity-50',
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'flex flex-1 overflow-hidden z-10 backdrop-blur-[1px]',
          children: [
            ee.jsx('aside', {
              className:
                'w-[60px] flex-shrink-0 border-r border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl z-30 flex flex-col justify-between shadow-[4px_0_30px_rgba(0,0,0,0.5)]',
              children: e,
            }),
            ee.jsx(oe.aside, {
              initial: !1,
              animate: { width: i ? 300 : 0, opacity: i ? 1 : 0 },
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              className:
                'flex-shrink-0 border-r border-white/5 bg-[#0e0e0e]/80 backdrop-blur-md overflow-hidden relative',
              children: ee.jsxs('div', {
                className: 'w-[300px] h-full relative',
                children: [
                  ee.jsx('div', {
                    className:
                      'absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-50',
                  }),
                  t,
                ],
              }),
            }),
            ee.jsxs('main', {
              className: 'flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden relative',
              children: [
                ee.jsx('div', {
                  className:
                    'flex-1 overflow-hidden relative rounded-tl-xl border-t border-l border-white/5 bg-[#121212]/60 backdrop-blur-sm shadow-inner mx-1 mt-1 transition-all',
                  children: a,
                }),
                ee.jsx(le, {
                  children:
                    s &&
                    ee.jsx(oe.div, {
                      initial: { height: 0 },
                      animate: { height: 200 },
                      exit: { height: 0 },
                      className: 'h-[200px] border-t border-white/10 bg-[#1e1e1e]',
                      children: s,
                    }),
                }),
              ],
            }),
          ],
        }),
        ee.jsx('footer', {
          className:
            'h-[24px] bg-[#007acc]/90 backdrop-blur-md text-white text-[10px] flex items-center px-3 select-none z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] justify-between border-t border-white/10',
          children: n,
        }),
      ],
    });
  },
  qs = () => {
    const { activeActivity: e, setActiveActivity: t } = Fs(),
      a = [
        { id: 'dashboard', icon: De, label: 'Dashboard' },
        { id: 'search', icon: me, label: 'Search' },
        { id: 'ai', icon: Re, label: 'Daniela AI' },
        { id: 'files', icon: Le, label: 'Projects' },
      ];
    return ee.jsxs('div', {
      className: 'flex flex-col items-center py-4 h-full justify-between w-full',
      children: [
        ee.jsx('div', {
          className: 'flex flex-col items-center gap-6 w-full',
          children: a.map(a => {
            const s = a.icon,
              n = e === a.id;
            return ee.jsxs(
              'button',
              {
                onClick: () => t(a.id),
                title: a.label,
                className: `relative group p-2 transition-all duration-300 w-full flex justify-center\n                 ${n ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}\n               `,
                children: [
                  n &&
                    ee.jsxs(ee.Fragment, {
                      children: [
                        ee.jsx('div', {
                          className:
                            'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[24px] bg-cyan-400 rounded-r-full shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]',
                        }),
                        ee.jsx('div', { className: 'absolute inset-0 bg-cyan-400/5 blur-lg' }),
                      ],
                    }),
                  ee.jsx(s, {
                    size: 26,
                    strokeWidth: n ? 2 : 1.5,
                    className:
                      'transition-transform duration-300 ' +
                      (n
                        ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                        : 'group-hover:scale-105'),
                  }),
                ],
              },
              a.id
            );
          }),
        }),
        ee.jsx('div', {
          className: 'flex flex-col items-center gap-6 w-full pb-4',
          children: ee.jsxs('button', {
            onClick: () => t('settings'),
            title: 'Settings',
            className:
              'p-2 transition-colors relative ' +
              ('settings' === e
                ? 'text-purple-400'
                : 'text-gray-500 hover:text-white hover:rotate-90 duration-500'),
            children: [
              'settings' === e &&
                ee.jsx('div', { className: 'absolute inset-0 bg-purple-500/10 blur-xl' }),
              ee.jsx(Oe, {
                size: 24,
                strokeWidth: 1.5,
                className: 'settings' === e ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : '',
              }),
            ],
          }),
        }),
      ],
    });
  },
  Gs = () =>
    ee.jsxs('div', {
      className: 'flex flex-col h-full bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]',
      children: [
        ee.jsxs('div', {
          className: 'p-3 border-b border-white/5 flex items-center gap-2 bg-white/5',
          children: [
            ee.jsx(ze, { size: 14, className: 'text-purple-400' }),
            ee.jsx('span', {
              className: 'text-xs font-bold tracking-wider text-purple-100 uppercase',
              children: 'Daniela AI Assistant',
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'flex-1 overflow-y-auto p-4 space-y-4',
          children: [
            ee.jsxs('div', {
              className: 'flex gap-3',
              children: [
                ee.jsx('div', {
                  className:
                    'w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0 border border-purple-500/30',
                  children: ee.jsx('span', {
                    className: 'text-[10px] font-bold text-purple-300',
                    children: 'AI',
                  }),
                }),
                ee.jsx('div', {
                  className:
                    'bg-white/5 p-3 rounded-tr-xl rounded-b-xl border border-white/10 text-sm text-gray-300 leading-relaxed max-w-[90%] shadow-lg backdrop-blur-sm',
                  children: ee.jsx('p', {
                    children:
                      "Hello! I'm integrated into your workbench. I can help you analyze metrics, refactor code, or manage deployment tasks. What's on your mind?",
                  }),
                }),
              ],
            }),
            ee.jsxs('div', {
              className: 'flex gap-3 flex-row-reverse',
              children: [
                ee.jsx('div', {
                  className:
                    'w-6 h-6 rounded-full bg-cyan-600/20 flex items-center justify-center shrink-0 border border-cyan-500/30',
                  children: ee.jsx('span', {
                    className: 'text-[10px] font-bold text-cyan-300',
                    children: 'ME',
                  }),
                }),
                ee.jsx('div', {
                  className:
                    'bg-cyan-500/10 p-3 rounded-tl-xl rounded-b-xl border border-cyan-500/20 text-sm text-cyan-100 leading-relaxed shadow-[0_0_15px_rgba(6,182,212,0.1)]',
                  children: ee.jsx('p', { children: 'Analyze the current bundle size for me.' }),
                }),
              ],
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'p-3 border-t border-white/10 bg-[#151515]',
          children: [
            ee.jsxs('div', {
              className: 'relative',
              children: [
                ee.jsx('input', {
                  type: 'text',
                  placeholder: 'Ask Daniela...',
                  className:
                    'w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-900/50 transition-all shadow-inner text-gray-200',
                }),
                ee.jsxs('div', {
                  className: 'absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1',
                  children: [
                    ee.jsx('button', {
                      className:
                        'p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors',
                      children: ee.jsx(Fe, { size: 14 }),
                    }),
                    ee.jsx('button', {
                      className:
                        'p-1.5 hover:bg-purple-500/20 rounded text-purple-400 hover:text-purple-200 transition-colors',
                      children: ee.jsx(He, { size: 14 }),
                    }),
                  ],
                }),
              ],
            }),
            ee.jsxs('div', {
              className: 'text-[10px] text-gray-600 mt-2 flex justify-center gap-3',
              children: [
                ee.jsx('span', {
                  className: 'cursor-pointer hover:text-purple-400 transition-colors',
                  children: 'Generate Component',
                }),
                ee.jsx('span', {
                  className: 'cursor-pointer hover:text-purple-400 transition-colors',
                  children: 'Fix Bugs',
                }),
                ee.jsxs('span', {
                  className: 'cursor-pointer hover:text-purple-400 transition-colors',
                  children: [' ', 'Explain Code'],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  Vs = () => {
    const { activeActivity: e } = Fs();
    return ee.jsxs('div', {
      className: 'h-full flex flex-col font-sans',
      children: [
        ee.jsx('div', {
          className:
            'h-[40px] flex items-center px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200/50 select-none border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent shadow-sm',
          children: e,
        }),
        ee.jsxs('div', {
          className:
            'flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent',
          children: [
            'dashboard' === e &&
              ee.jsxs('div', {
                className: 'text-sm',
                children: [
                  ee.jsx('div', {
                    className:
                      'px-4 py-3 text-[10px] font-bold text-gray-500 uppercase opacity-70 tracking-widest',
                    children: 'Main Views',
                  }),
                  ee.jsx('ul', {
                    className: 'space-y-1 px-2',
                    children: ['Overview', 'Analytics', 'Real-time', 'System Health'].map(e =>
                      ee.jsxs(
                        'li',
                        {
                          className:
                            'cursor-pointer hover:bg-cyan-500/10 hover:text-cyan-300 text-gray-400 p-2 rounded-md transition-all duration-200 flex items-center gap-3 group border border-transparent hover:border-cyan-500/20',
                          children: [
                            ee.jsx('div', {
                              className:
                                'w-1.5 h-1.5 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 transition-colors shadow-[0_0_5px_rgba(6,182,212,0)] group-hover:shadow-[0_0_8px_rgba(6,182,212,0.5)]',
                            }),
                            e,
                          ],
                        },
                        e
                      )
                    ),
                  }),
                ],
              }),
            'ai' === e &&
              ee.jsx('div', { className: 'h-full flex flex-col', children: ee.jsx(Gs, {}) }),
            'search' === e &&
              ee.jsx('div', {
                className: 'flex flex-col gap-2 p-3',
                children: ee.jsxs('div', {
                  className: 'relative group',
                  children: [
                    ee.jsx('input', {
                      type: 'text',
                      placeholder: 'Search anything...',
                      className:
                        'w-full bg-[#181818] border border-[#303030] text-gray-200 text-xs p-2.5 pl-3 rounded-md focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-900/50 placeholder:text-gray-600 transition-all shadow-inner group-hover:bg-[#1f1f1f]',
                    }),
                    ee.jsx('div', {
                      className:
                        'absolute right-2 top-2.5 text-[10px] text-gray-600 bg-[#222] px-1.5 rounded border border-[#333] opacity-70',
                      children: 'Ctrl+F',
                    }),
                  ],
                }),
              }),
          ],
        }),
      ],
    });
  },
  Us = () => {
    const [e, t] = se.useState([
        { role: 'ai', text: 'Hola, soy Daniela. ¿En qué puedo ayudarte hoy?' },
      ]),
      [a, s] = se.useState(''),
      { isListening: n, transcript: i, isSpeaking: r, toggleListening: o, speak: l } = ss(),
      c = se.useRef(null);
    (se.useEffect(() => {
      i && s(i);
    }, [i]),
      se.useEffect(() => {
        var e;
        null == (e = c.current) || e.scrollIntoView({ behavior: 'smooth' });
      }, [e]));
    const d = () => {
      a.trim() &&
        (t(e => [...e, { role: 'user', text: a }]),
        s(''),
        setTimeout(() => {
          const e = [
              'Entendido. Estoy procesando esa solicitud.',
              'He actualizado los parámetros del sistema según tus indicaciones.',
              'Analizando los datos... Aquí tienes el reporte.',
              'Excelente elección. Procediendo con la ejecución.',
              'Sistemas nominales. ¿Deseas algo más?',
            ],
            a = e[Math.floor(Math.random() * e.length)];
          (t(e => [...e, { role: 'ai', text: a }]), l(a));
        }, 1e3));
    };
    return ee.jsxs('div', {
      className:
        'flex flex-col h-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden',
      children: [
        ee.jsxs('div', {
          className: 'p-4 border-b border-white/5 flex justify-between items-center bg-black/20',
          children: [
            ee.jsxs('div', {
              className: 'flex items-center gap-3',
              children: [
                ee.jsxs('div', {
                  className: 'relative',
                  children: [
                    ee.jsx('div', {
                      className:
                        'w-10 h-10 rounded-full overflow-hidden border-2 border-nexus-cyan',
                      children: ee.jsx('img', {
                        src: '/images/daniela-avatar.jpg',
                        alt: 'Daniela',
                        className: 'w-full h-full object-cover',
                        onError: e =>
                          (e.currentTarget.src =
                            'https://ui-avatars.com/api/?name=Daniela+AI&background=00f5ff&color=fff'),
                      }),
                    }),
                    ee.jsx('div', {
                      className:
                        'absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black',
                    }),
                  ],
                }),
                ee.jsxs('div', {
                  children: [
                    ee.jsx('h3', {
                      className: 'text-white font-bold text-sm',
                      children: 'Daniela AI',
                    }),
                    ee.jsx('p', {
                      className: 'text-nexus-cyan text-xs font-mono',
                      children: 'ONLINE // V2.4',
                    }),
                  ],
                }),
              ],
            }),
            ee.jsx('div', {
              className: 'flex gap-2',
              children:
                r &&
                ee.jsxs('div', {
                  className: 'flex gap-1 h-3 items-end',
                  children: [
                    ee.jsx(oe.div, {
                      className: 'w-1 bg-nexus-cyan',
                      animate: { height: [4, 12, 4] },
                      transition: { repeat: 1 / 0, duration: 0.5 },
                    }),
                    ee.jsx(oe.div, {
                      className: 'w-1 bg-nexus-cyan',
                      animate: { height: [6, 10, 2] },
                      transition: { repeat: 1 / 0, duration: 0.4 },
                    }),
                    ee.jsx(oe.div, {
                      className: 'w-1 bg-nexus-cyan',
                      animate: { height: [2, 8, 3] },
                      transition: { repeat: 1 / 0, duration: 0.6 },
                    }),
                  ],
                }),
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'flex-1 overflow-y-auto p-4 space-y-4',
          children: [
            e.map((e, t) =>
              ee.jsx(
                oe.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  className: 'flex ' + ('user' === e.role ? 'justify-end' : 'justify-start'),
                  children: ee.jsx('div', {
                    className:
                      'max-w-[80%] p-3 rounded-2xl text-sm ' +
                      ('user' === e.role
                        ? 'bg-nexus-violet/20 text-white rounded-tr-sm border border-nexus-violet/30'
                        : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'),
                    children: e.text,
                  }),
                },
                t
              )
            ),
            ee.jsx('div', { ref: c }),
          ],
        }),
        ee.jsx('div', {
          className: 'p-4 border-t border-white/5 bg-black/20',
          children: ee.jsxs('div', {
            className: 'relative flex items-center gap-2',
            children: [
              ee.jsx('button', {
                onClick: o,
                className:
                  'p-3 rounded-full transition-all ' +
                  (n
                    ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/50'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'),
                children: n ? ee.jsx(qe, { size: 20 }) : ee.jsx(Fe, { size: 20 }),
              }),
              ee.jsx('input', {
                type: 'text',
                value: a,
                onChange: e => s(e.target.value),
                onKeyDown: e => 'Enter' === e.key && d(),
                placeholder: 'Escribe un mensaje...',
                className:
                  'flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white text-sm focus:outline-none focus:border-nexus-cyan/50 placeholder-gray-500',
              }),
              ee.jsx('button', {
                onClick: d,
                className:
                  'p-3 bg-nexus-cyan text-black rounded-full hover:bg-cyan-400 transition-colors',
                children: ee.jsx(He, { size: 18 }),
              }),
            ],
          }),
        }),
      ],
    });
  },
  Bs = ({ user: e, onLogout: t }) => {
    var a, s;
    const [n, i] = se.useState('daniela'),
      [r, o] = se.useState(!1),
      {
        status: l,
        messages: c,
        emotionalAnalysis: d,
        suggestedActions: u,
        isProcessing: h,
      } = (() => {
        const [e, t] = se.useState('idle'),
          [a, s] = se.useState([]),
          [n, i] = se.useState(null),
          [r, o] = se.useState([]),
          [l, c] = se.useState(!1),
          [d, u] = se.useState(!1),
          [h, p] = se.useState(null),
          m = { emotion: 'neutral', confidence: 0.85, sentiment: 'positive' },
          x = [
            {
              id: '1',
              text: 'Ver dashboard principal',
              type: 'navigation',
              priority: 'high',
              context: 'main',
            },
            {
              id: '2',
              text: 'Analizar métricas',
              type: 'analysis',
              priority: 'medium',
              context: 'analytics',
            },
            {
              id: '3',
              text: 'Contactar soporte',
              type: 'support',
              priority: 'low',
              context: 'help',
            },
          ];
        se.useEffect(() => {
          (t('connecting'),
            setTimeout(() => {
              (t('active'), i(m), o(x));
            }, 1e3));
        }, []);
        const f = se.useCallback(async () => {
            l ||
              (c(!0),
              p(null),
              setTimeout(() => {
                const e = {
                  id: Date.now().toString(),
                  role: 'user',
                  content: 'Hola Daniela, ¿cómo estás?',
                  timestamp: new Date(),
                  emotionalAnalysis: m,
                };
                (s(t => [...t, e]),
                  setTimeout(() => {
                    const e = {
                      id: (Date.now() + 1).toString(),
                      role: 'assistant',
                      content:
                        '¡Hola! Estoy perfectamente, gracias por preguntar. ¿En qué puedo ayudarte hoy?',
                      timestamp: new Date(),
                      emotionalAnalysis: m,
                    };
                    (s(t => [...t, e]), c(!1));
                  }, 1500));
              }, 2e3));
          }, [l]),
          v = se.useCallback(() => {
            l && c(!1);
          }, [l]),
          g = se.useCallback(
            async e => {
              if (d) return;
              (u(!0), p(null));
              const t = {
                id: Date.now().toString(),
                role: 'user',
                content: e,
                timestamp: new Date(),
                emotionalAnalysis: m,
              };
              (s(e => [...e, t]),
                setTimeout(() => {
                  const e = [
                      'Entendido. Estoy procesando tu solicitud.',
                      'He analizado tu petión. Aquí está la respuesta.',
                      'Interesante. Déjame generar un reporte para ti.',
                      'Perfecto. Ejecutando la acción solicitada.',
                      'Comprendido. ¿Hay algo más en lo que pueda ayudarte?',
                    ],
                    t = {
                      id: (Date.now() + 1).toString(),
                      role: 'assistant',
                      content: e[Math.floor(Math.random() * e.length)],
                      timestamp: new Date(),
                      emotionalAnalysis: m,
                    };
                  (s(e => [...e, t]), u(!1));
                }, 1e3));
            },
            [d]
          ),
          b = se.useCallback(() => {
            (s([]), p(null));
          }, []);
        return {
          status: e,
          messages: a,
          emotionalAnalysis: n,
          suggestedActions: r,
          isRecording: l,
          isProcessing: d,
          error: h,
          startRecording: f,
          stopRecording: v,
          sendTextMessage: g,
          clearConversation: b,
        };
      })(e.email),
      p = [
        { id: 'daniela', label: 'Daniela AI', icon: Ae, color: 'from-nexus-cyan to-nexus-violet' },
        { id: 'analytics', label: 'Analytics', icon: Ge, color: 'from-green-500 to-emerald-600' },
        { id: 'settings', label: 'Configuración', icon: Oe, color: 'from-orange-500 to-red-600' },
      ],
      m = {
        free: 'text-nexus-silver',
        premium: 'text-nexus-violet',
        enterprise: 'text-nexus-gold',
      };
    return ee.jsxs('div', {
      className: 'min-h-screen bg-nexus-obsidian text-white',
      children: [
        ee.jsx('div', {
          className: 'lg:hidden fixed top-4 left-4 z-50',
          children: ee.jsx('button', {
            onClick: () => o(!r),
            className: 'p-2 rounded-lg bg-white/5 backdrop-blur-3xl border border-white/10',
            children: r
              ? ee.jsx(Ne, { className: 'w-5 h-5' })
              : ee.jsx(_e, { className: 'w-5 h-5' }),
          }),
        }),
        ee.jsx(le, {
          children: ee.jsxs(ee.Fragment, {
            children: [
              r &&
                ee.jsx(oe.div, {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  onClick: () => o(!1),
                  className: 'lg:hidden fixed inset-0 bg-black/50 z-40',
                }),
              ee.jsxs(oe.aside, {
                initial: { x: -300 },
                animate: { x: 0 },
                exit: { x: -300 },
                transition: { type: 'spring', damping: 25 },
                className:
                  'fixed lg:relative z-50 w-72 h-screen bg-nexus-obsidian-deep border-r border-white/10 ' +
                  (r ? 'block' : 'hidden lg:block'),
                children: [
                  ee.jsx('div', {
                    className: 'p-6 border-b border-white/10',
                    children: ee.jsxs('div', {
                      className: 'flex items-center gap-4',
                      children: [
                        ee.jsx('div', {
                          className:
                            'w-12 h-12 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center',
                          children: ee.jsx(ve, { className: 'w-6 h-6 text-white' }),
                        }),
                        ee.jsxs('div', {
                          children: [
                            ee.jsx('h3', {
                              className: 'font-semibold text-white',
                              children: e.name,
                            }),
                            ee.jsx('p', {
                              className: 'text-sm text-nexus-silver',
                              children: e.email,
                            }),
                            ee.jsxs('div', {
                              className: 'flex items-center gap-2 mt-1',
                              children: [
                                ee.jsx(be, { className: 'w-3 h-3 text-nexus-cyan' }),
                                ee.jsx('span', {
                                  className: `text-xs font-medium ${m[e.subscription]}`,
                                  children: e.subscription.toUpperCase(),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  ee.jsx('nav', {
                    className: 'p-4',
                    children: ee.jsx('div', {
                      className: 'space-y-2',
                      children: p.map(e => {
                        const t = e.icon;
                        return ee.jsxs(
                          'button',
                          {
                            onClick: () => {
                              (i(e.id), o(!1));
                            },
                            className:
                              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ' +
                              (n === e.id
                                ? `bg-linear-to-r ${e.color} text-white shadow-lg`
                                : 'text-nexus-silver hover:bg-white/5 hover:text-white'),
                            children: [
                              ee.jsx(t, { className: 'w-5 h-5' }),
                              ee.jsx('span', { className: 'font-medium', children: e.label }),
                            ],
                          },
                          e.id
                        );
                      }),
                    }),
                  }),
                  ee.jsx('div', {
                    className: 'p-4 border-t border-white/10',
                    children: ee.jsxs('div', {
                      className: 'space-y-4',
                      children: [
                        ee.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            ee.jsx('span', {
                              className: 'text-nexus-silver text-sm',
                              children: 'Conversaciones',
                            }),
                            ee.jsx('span', {
                              className: 'text-white font-semibold',
                              children: c.length,
                            }),
                          ],
                        }),
                        ee.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            ee.jsx('span', {
                              className: 'text-nexus-silver text-sm',
                              children: 'Estado',
                            }),
                            ee.jsx('span', {
                              className:
                                'text-sm font-medium ' +
                                (h
                                  ? 'text-yellow-400'
                                  : 'active' === l
                                    ? 'text-green-400'
                                    : 'error' === l
                                      ? 'text-red-400'
                                      : 'text-nexus-silver'),
                              children: h
                                ? 'Procesando'
                                : 'active' === l
                                  ? 'Activo'
                                  : 'error' === l
                                    ? 'Error'
                                    : 'Inactivo',
                            }),
                          ],
                        }),
                        ee.jsxs('div', {
                          className: 'flex items-center justify-between',
                          children: [
                            ee.jsx('span', {
                              className: 'text-nexus-silver text-sm',
                              children: 'Suscripción',
                            }),
                            ee.jsx('span', {
                              className: `text-xs font-medium ${m[e.subscription]}`,
                              children: e.subscription,
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  ee.jsx('div', {
                    className: 'absolute bottom-0 left-0 right-0 p-4 border-t border-white/10',
                    children: ee.jsxs('button', {
                      onClick: t,
                      className:
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-nexus-silver hover:bg-white/5 hover:text-white transition-all',
                      children: [
                        ee.jsx(Ve, { className: 'w-5 h-5' }),
                        ee.jsx('span', { children: 'Cerrar Sesión' }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        ee.jsxs('div', {
          className: 'lg:ml-72 min-h-screen',
          children: [
            ee.jsx('header', {
              className: 'bg-nexus-obsidian-deep border-b border-white/10 px-6 py-4',
              children: ee.jsxs('div', {
                className: 'flex items-center justify-between',
                children: [
                  ee.jsxs('div', {
                    children: [
                      ee.jsx('h1', {
                        className: 'text-2xl font-orbitron font-bold text-white',
                        children: null == (a = p.find(e => e.id === n)) ? void 0 : a.label,
                      }),
                      ee.jsxs('p', {
                        className: 'text-nexus-silver text-sm mt-1',
                        children: [
                          'daniela' === n && 'Tu asistente de IA emocional',
                          'analytics' === n && 'Métricas y análisis de uso',
                          'settings' === n && 'Configuración de tu cuenta',
                        ],
                      }),
                    ],
                  }),
                  ee.jsxs('div', {
                    className: 'flex items-center gap-4',
                    children: [
                      ee.jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          ee.jsx('div', {
                            className:
                              'w-2 h-2 rounded-full ' +
                              (h
                                ? 'bg-yellow-400 animate-pulse'
                                : 'active' === l
                                  ? 'bg-green-400'
                                  : 'error' === l
                                    ? 'bg-red-400'
                                    : 'bg-nexus-silver'),
                          }),
                          ee.jsx('span', {
                            className: 'text-sm text-nexus-silver hidden sm:block',
                            children: h
                              ? 'Procesando...'
                              : 'active' === l
                                ? 'Daniela Activa'
                                : 'error' === l
                                  ? 'Error'
                                  : 'Inactivo',
                          }),
                        ],
                      }),
                      ee.jsxs('div', {
                        className: 'hidden sm:flex items-center gap-3',
                        children: [
                          ee.jsx('div', {
                            className:
                              'w-8 h-8 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center',
                            children: ee.jsx(ve, { className: 'w-4 h-4 text-white' }),
                          }),
                          ee.jsxs('div', {
                            className: 'text-right',
                            children: [
                              ee.jsx('p', {
                                className: 'text-sm font-medium text-white',
                                children: e.name,
                              }),
                              ee.jsx('p', {
                                className: 'text-xs text-nexus-silver',
                                children: e.subscription,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
            ee.jsx('main', {
              className: 'p-6',
              children: ee.jsxs(le, {
                mode: 'wait',
                children: [
                  'daniela' === n &&
                    ee.jsx(
                      oe.div,
                      {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.3 },
                        children: ee.jsx(Us, {}),
                      },
                      'daniela'
                    ),
                  'analytics' === n &&
                    ee.jsxs(
                      oe.div,
                      {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.3 },
                        className: 'space-y-6',
                        children: [
                          ee.jsxs('div', {
                            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
                            children: [
                              ee.jsxs('div', {
                                className:
                                  'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                                children: [
                                  ee.jsxs('div', {
                                    className: 'flex items-center justify-between mb-4',
                                    children: [
                                      ee.jsx('h3', {
                                        className: 'text-lg font-semibold text-white',
                                        children: 'Conversaciones',
                                      }),
                                      ee.jsx(Ue, { className: 'w-5 h-5 text-nexus-cyan' }),
                                    ],
                                  }),
                                  ee.jsx('div', {
                                    className: 'text-3xl font-bold text-white',
                                    children: c.length,
                                  }),
                                  ee.jsx('p', {
                                    className: 'text-nexus-silver text-sm',
                                    children: 'Total este mes',
                                  }),
                                ],
                              }),
                              ee.jsxs('div', {
                                className:
                                  'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                                children: [
                                  ee.jsxs('div', {
                                    className: 'flex items-center justify-between mb-4',
                                    children: [
                                      ee.jsx('h3', {
                                        className: 'text-lg font-semibold text-white',
                                        children: 'Estado Emocional',
                                      }),
                                      ee.jsx(Be, { className: 'w-5 h-5 text-green-400' }),
                                    ],
                                  }),
                                  ee.jsx('div', {
                                    className: 'text-3xl font-bold text-white',
                                    children:
                                      (null == (s = null == d ? void 0 : d.emotion)
                                        ? void 0
                                        : s.toUpperCase()) || 'NEUTRAL',
                                  }),
                                  ee.jsxs('p', {
                                    className: 'text-nexus-silver text-sm',
                                    children: [
                                      'Confianza: ',
                                      (null == d ? void 0 : d.confidence)
                                        ? `${Math.round(100 * d.confidence)}%`
                                        : 'N/A',
                                    ],
                                  }),
                                ],
                              }),
                              ee.jsxs('div', {
                                className:
                                  'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                                children: [
                                  ee.jsxs('div', {
                                    className: 'flex items-center justify-between mb-4',
                                    children: [
                                      ee.jsx('h3', {
                                        className: 'text-lg font-semibold text-white',
                                        children: 'Sugerencias',
                                      }),
                                      ee.jsx(Ae, { className: 'w-5 h-5 text-nexus-violet' }),
                                    ],
                                  }),
                                  ee.jsx('div', {
                                    className: 'text-3xl font-bold text-white',
                                    children: u.length,
                                  }),
                                  ee.jsx('p', {
                                    className: 'text-nexus-silver text-sm',
                                    children: 'Acciones disponibles',
                                  }),
                                ],
                              }),
                              ee.jsxs('div', {
                                className:
                                  'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                                children: [
                                  ee.jsxs('div', {
                                    className: 'flex items-center justify-between mb-4',
                                    children: [
                                      ee.jsx('h3', {
                                        className: 'text-lg font-semibold text-white',
                                        children: 'Suscripción',
                                      }),
                                      ee.jsx(be, { className: 'w-5 h-5 text-nexus-gold' }),
                                    ],
                                  }),
                                  ee.jsx('div', {
                                    className: 'text-3xl font-bold text-white uppercase',
                                    children: e.subscription,
                                  }),
                                  ee.jsx('p', {
                                    className: 'text-nexus-silver text-sm',
                                    children: 'Plan actual',
                                  }),
                                ],
                              }),
                            ],
                          }),
                          ee.jsxs('div', {
                            className:
                              'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                            children: [
                              ee.jsx('h3', {
                                className: 'text-xl font-semibold text-white mb-6',
                                children: 'Actividad Reciente',
                              }),
                              ee.jsx('div', {
                                className:
                                  'h-64 flex items-center justify-center text-nexus-silver',
                                children: ee.jsxs('div', {
                                  className: 'text-center',
                                  children: [
                                    ee.jsx(Ge, { className: 'w-12 h-12 mx-auto mb-4 opacity-50' }),
                                    ee.jsx('p', { children: 'Gráficos de actividad próximamente' }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                        ],
                      },
                      'analytics'
                    ),
                  'settings' === n &&
                    ee.jsxs(
                      oe.div,
                      {
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.3 },
                        className: 'space-y-6',
                        children: [
                          ee.jsxs('div', {
                            className:
                              'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                            children: [
                              ee.jsx('h3', {
                                className: 'text-xl font-semibold text-white mb-6',
                                children: 'Configuración de Cuenta',
                              }),
                              ee.jsxs('div', {
                                className: 'space-y-6',
                                children: [
                                  ee.jsxs('div', {
                                    children: [
                                      ee.jsx('label', {
                                        className:
                                          'block text-sm font-medium text-nexus-silver mb-2',
                                        children: 'Nombre',
                                      }),
                                      ee.jsx('input', {
                                        type: 'text',
                                        defaultValue: e.name,
                                        className:
                                          'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50',
                                      }),
                                    ],
                                  }),
                                  ee.jsxs('div', {
                                    children: [
                                      ee.jsx('label', {
                                        className:
                                          'block text-sm font-medium text-nexus-silver mb-2',
                                        children: 'Email',
                                      }),
                                      ee.jsx('input', {
                                        type: 'email',
                                        defaultValue: e.email,
                                        disabled: !0,
                                        className:
                                          'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-nexus-silver cursor-not-allowed',
                                      }),
                                    ],
                                  }),
                                  ee.jsxs('div', {
                                    children: [
                                      ee.jsx('label', {
                                        className:
                                          'block text-sm font-medium text-nexus-silver mb-2',
                                        children: 'Suscripción Actual',
                                      }),
                                      ee.jsx('div', {
                                        className:
                                          'p-4 bg-white/5 border border-white/10 rounded-lg',
                                        children: ee.jsxs('div', {
                                          className: 'flex items-center justify-between',
                                          children: [
                                            ee.jsx('span', {
                                              className: 'text-white font-medium',
                                              children: e.subscription,
                                            }),
                                            ee.jsx('button', {
                                              className:
                                                'px-4 py-2 bg-linear-to-r from-nexus-cyan to-nexus-violet text-white rounded-lg text-sm font-medium hover:from-nexus-cyan/80 hover:to-nexus-violet/80 transition-all',
                                              children: 'Actualizar',
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          ee.jsxs('div', {
                            className:
                              'bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6',
                            children: [
                              ee.jsx('h3', {
                                className: 'text-xl font-semibold text-white mb-6',
                                children: 'Preferencias de Daniela',
                              }),
                              ee.jsxs('div', {
                                className: 'space-y-6',
                                children: [
                                  ee.jsxs('div', {
                                    children: [
                                      ee.jsx('label', {
                                        className:
                                          'block text-sm font-medium text-nexus-silver mb-2',
                                        children: 'Voz de Daniela',
                                      }),
                                      ee.jsxs('select', {
                                        className:
                                          'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50',
                                        children: [
                                          ee.jsx('option', { children: 'Bella (Default)' }),
                                          ee.jsx('option', { children: 'Adam' }),
                                          ee.jsx('option', { children: 'Domi' }),
                                          ee.jsx('option', { children: 'Elli' }),
                                          ee.jsx('option', { children: 'Emily' }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  ee.jsxs('div', {
                                    children: [
                                      ee.jsx('label', {
                                        className:
                                          'block text-sm font-medium text-nexus-silver mb-2',
                                        children: 'Idioma',
                                      }),
                                      ee.jsxs('select', {
                                        className:
                                          'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50',
                                        children: [
                                          ee.jsx('option', { children: 'Español' }),
                                          ee.jsx('option', { children: 'English' }),
                                          ee.jsx('option', { children: 'Português' }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  ee.jsx('div', {
                                    children: ee.jsxs('label', {
                                      className:
                                        'flex items-center gap-2 text-sm font-medium text-nexus-silver mb-2',
                                      children: [
                                        ee.jsx('input', {
                                          type: 'checkbox',
                                          defaultChecked: !0,
                                          className:
                                            'rounded border-white/10 bg-white/5 text-nexus-cyan',
                                        }),
                                        'Notificaciones por email',
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      },
                      'settings'
                    ),
                ],
              }),
            }),
          ],
        }),
      ],
    });
  },
  Ws = ({ user: e, onLogout: t }) => {
    const { activeActivity: a } = Fs();
    return ee.jsx('div', {
      className: 'w-full h-full overflow-hidden bg-transparent',
      children: ee.jsx('div', {
        className: 'h-full w-full overflow-y-auto custom-scrollbar',
        children: (() => {
          switch (a) {
            case 'dashboard':
            default:
              return ee.jsx(Bs, { user: e, onLogout: t });
            case 'search':
              return ee.jsxs('div', {
                className: 'flex flex-col items-center justify-center h-full text-gray-500',
                children: [
                  ee.jsx('div', {
                    className: 'text-2xl font-light mb-2',
                    children: 'Global Search',
                  }),
                  ee.jsx('p', { children: 'Search results will appear here' }),
                ],
              });
            case 'settings':
              return ee.jsxs('div', {
                className: 'p-10 text-white font-sans bg-[#050505] min-h-full',
                children: [
                  ee.jsx('h1', {
                    className:
                      'text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500',
                    children: 'Settings',
                  }),
                  ee.jsxs('div', {
                    className: 'grid gap-6 max-w-xl',
                    children: [
                      ee.jsxs('div', {
                        className:
                          'bg-[#111] p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group',
                        children: [
                          ee.jsx('div', {
                            className:
                              'absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity',
                          }),
                          ee.jsx('label', {
                            className: 'block text-sm font-bold mb-3 text-gray-300',
                            children: 'Theme Preference',
                          }),
                          ee.jsxs('select', {
                            className:
                              'w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-cyan-500/50 outline-none text-gray-300 backdrop-blur-sm',
                            children: [
                              ee.jsx('option', { children: 'Cyberpunk Dark (Default)' }),
                              ee.jsx('option', { children: 'Nebula Blue' }),
                              ee.jsx('option', { children: 'Matrix Green' }),
                            ],
                          }),
                        ],
                      }),
                      ee.jsxs('div', {
                        className:
                          'bg-[#111] p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group',
                        children: [
                          ee.jsx('div', {
                            className:
                              'absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity',
                          }),
                          ee.jsx('label', {
                            className: 'block text-sm font-bold mb-3 text-gray-300',
                            children: 'Daniela Personality',
                          }),
                          ee.jsxs('select', {
                            className:
                              'w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500/50 outline-none text-gray-300 backdrop-blur-sm',
                            children: [
                              ee.jsx('option', { children: 'Professional (Technical)' }),
                              ee.jsx('option', { children: 'Casual (Friendly)' }),
                              ee.jsx('option', { children: 'Creative (Brainstorming)' }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              });
          }
        })(),
      }),
    });
  },
  $s = () =>
    ee.jsxs(ee.Fragment, {
      children: [
        ee.jsxs('div', {
          className: 'flex items-center gap-4',
          children: [
            ee.jsxs('div', {
              className:
                'flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors group',
              children: [
                ee.jsx(We, {
                  size: 12,
                  className: 'text-cyan-400 group-hover:drop-shadow-[0_0_5px_cyan]',
                }),
                ee.jsx('span', {
                  className: 'font-semibold text-gray-300 group-hover:text-white',
                  children: 'main',
                }),
              ],
            }),
            ee.jsxs('div', {
              className:
                'flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors',
              children: [
                ee.jsx($e, { size: 12, className: 'text-gray-400' }),
                ee.jsx('span', {
                  className: 'text-gray-400 text-[10px]',
                  children: 'Todo Perfecto',
                }),
              ],
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'flex items-center gap-4',
          children: [
            ee.jsxs('div', {
              className:
                'flex items-center gap-2 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors',
              children: [
                ee.jsx('span', { className: 'text-gray-500', children: 'Ln 14, Col 32' }),
                ee.jsx('span', { className: 'text-gray-500', children: 'UTF-8' }),
                ee.jsx('span', {
                  className: 'text-cyan-600 font-bold text-[10px]',
                  children: 'TSX',
                }),
              ],
            }),
            ee.jsxs('div', {
              className:
                'flex items-center gap-1.5 hover:bg-purple-500/10 px-2 py-0.5 rounded cursor-pointer transition-colors group',
              children: [
                ee.jsx(Me, { size: 12, className: 'text-purple-400 animate-pulse' }),
                ee.jsx('div', {
                  className: 'w-12 h-4 relative overflow-hidden hidden md:block',
                  children: ee.jsxs(oe.svg, {
                    viewBox: '0 0 100 20',
                    className: 'absolute inset-0 w-full h-full text-purple-400/30',
                    children: [
                      ee.jsx(oe.path, {
                        d: 'M 0,10 L 20,10 L 25,2 L 30,18 L 35,10 L 100,10',
                        fill: 'none',
                        stroke: 'currentColor',
                        strokeWidth: '1',
                        animate: { x: [0, -100] },
                        transition: { duration: 2, repeat: 1 / 0, ease: 'linear' },
                      }),
                      ee.jsx(oe.path, {
                        d: 'M 100,10 L 120,10 L 125,2 L 130,18 L 135,10 L 200,10',
                        fill: 'none',
                        stroke: 'currentColor',
                        strokeWidth: '1',
                        animate: { x: [0, -100] },
                        transition: { duration: 2, repeat: 1 / 0, ease: 'linear' },
                      }),
                    ],
                  }),
                }),
                ee.jsx('span', {
                  className: 'text-purple-300 group-hover:text-purple-200 transition-colors',
                  children: 'Cerebro: Muy bien',
                }),
              ],
            }),
            ee.jsxs('div', {
              className:
                'flex items-center gap-1.5 hover:bg-green-500/10 px-2 py-0.5 rounded cursor-pointer transition-colors',
              children: [
                ee.jsx(Qe, { size: 12, className: 'text-green-400' }),
                ee.jsx('span', { className: 'text-green-300', children: 'Conectado' }),
              ],
            }),
            ee.jsx(Ke, { size: 12, className: 'text-gray-400 hover:text-white cursor-pointer' }),
          ],
        }),
      ],
    }),
  Qs = ({ user: e, onLogout: t }) =>
    ee.jsx(zs, {
      children: ee.jsx(Hs, {
        activityBar: ee.jsx(qs, {}),
        sideBar: ee.jsx(Vs, {}),
        mainArea: ee.jsx(Ws, { user: e, onLogout: t }),
        statusBar: ee.jsx($s, {}),
      }),
    }),
  Ks = ({ title: e, message: t, type: a = 'info', onClose: s }) => {
    const n = {
      info: ee.jsx(Ze, { className: 'text-nexus-cyan', size: 20 }),
      success: ee.jsx(Je, { className: 'text-green-400', size: 20 }),
      warning: ee.jsx(Ye, { className: 'text-yellow-400', size: 20 }),
      error: ee.jsx(Xe, { className: 'text-red-400', size: 20 }),
    };
    return ee.jsxs(oe.div, {
      initial: { opacity: 0, x: 100, scale: 0.9 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 50, scale: 0.95, filter: 'blur(10px)' },
      className: `pointer-events-auto min-w-[320px] max-w-md premium-glass p-1 border ${{ info: 'border-nexus-cyan/30', success: 'border-green-500/30', warning: 'border-yellow-500/30', error: 'border-red-500/30' }[a]} rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group`,
      children: [
        ee.jsxs('div', {
          className: 'relative p-4 flex gap-4',
          children: [
            ee.jsx('div', { className: 'flex-shrink-0 mt-1', children: n[a] }),
            ee.jsxs('div', {
              className: 'flex-grow',
              children: [
                ee.jsx('h4', {
                  className:
                    'font-orbitron text-xs font-bold text-white tracking-widest uppercase mb-1 drop-shadow-glow',
                  children: e,
                }),
                ee.jsx('p', {
                  className: 'text-nexus-silver/70 text-sm leading-relaxed',
                  children: t,
                }),
              ],
            }),
            ee.jsx('button', {
              onClick: s,
              className: 'flex-shrink-0 text-white/20 hover:text-white transition-colors',
              children: ee.jsx(Ne, { size: 16 }),
            }),
            ee.jsx('div', {
              className:
                'absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none',
            }),
          ],
        }),
        ee.jsx(oe.div, {
          initial: { width: '100%' },
          animate: { width: '0%' },
          transition: { duration: 5, ease: 'linear' },
          className:
            'h-[2px] bg-gradient-to-r ' +
            ('info' === a
              ? 'from-nexus-cyan to-nexus-violet'
              : 'from-current to-transparent opacity-50'),
        }),
      ],
    });
  },
  Xs = se.createContext(void 0),
  Ys = ({ children: e }) => {
    const [t, a] = se.useState([]),
      { playPop: s } = Ya(),
      n = se.useCallback(
        (e, t, n = 'info') => {
          const i = Math.random().toString(36).substr(2, 9);
          (s(),
            a(a => [...a, { id: i, title: e, message: t, type: n }]),
            setTimeout(() => {
              a(e => e.filter(e => e.id !== i));
            }, 5e3));
        },
        [s]
      );
    return ee.jsxs(Xs.Provider, {
      value: { notify: n },
      children: [
        e,
        ee.jsx('div', {
          className: 'fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none',
          children: ee.jsx(le, {
            children: t.map(e =>
              ee.jsx(
                Ks,
                {
                  title: e.title,
                  message: e.message,
                  type: e.type,
                  onClose: () => a(t => t.filter(t => t.id !== e.id)),
                },
                e.id
              )
            ),
          }),
        }),
      ],
    });
  };
const Js = new (class {
    constructor() {
      this.baseUrl = 'https://api.aigestion.net/v1/daniela';
    }
    async checkConnectivity() {
      return new Promise(e => setTimeout(() => e(!0), 500));
    }
    async getSystemStatus() {
      return new Promise(e => {
        setTimeout(() => {
          e({
            status: 'operational',
            version: 'v2.4.0',
            statistics: { totalUsers: 12450, activeConversations: 45, messagesProcessed: 15e5 },
          });
        }, 800);
      });
    }
    async chat(e, t, a) {
      return new Promise(e => {
        setTimeout(() => {
          e({
            response:
              'Interesante pregunta. Como IA de AIGestion, puedo decirte que nuestra arquitectura está diseñada para escalar infinitamente.',
            sentiment: 'positive',
            confidence: 0.98,
          });
        }, 1500);
      });
    }
  })(),
  Zs = ({ className: e = '', variant: t = 'assistant', context: a = 'homepage' }) => {
    var s, n, i, r;
    const [o, l] = se.useState([]),
      [c, d] = se.useState(''),
      [u, h] = se.useState(!1),
      [p, m] = se.useState(!1),
      [x, f] = se.useState(!1),
      [v, g] = se.useState(null),
      b = se.useRef(null);
    (se.useEffect(() => {
      l(
        {
          homepage: [
            {
              id: 'welcome',
              text: '🧠 ¡Hola! Soy Daniela, tu asistente inteligente de AIGestion. Estoy aquí para ayudarte a entender cómo podemos transformar tu negocio.',
              sender: 'daniela',
              timestamp: new Date(),
              suggestions: ['¿Qué servicios ofrecen?', '¿Cómo funciona la IA?', '¿Cuál es el ROI?'],
            },
          ],
          contact: [
            {
              id: 'contact',
              text: '🤝 ¡Hola! Soy Daniela, tu consultora de IA de AIGestion. Estoy aquí para conectar contigo y encontrar la solución perfecta para tus necesidades.',
              sender: 'daniela',
              timestamp: new Date(),
              suggestions: ['Agendar una llamada', 'Ver casos de éxito', 'Solicitar demostración'],
            },
          ],
          pricing: [
            {
              id: 'pricing',
              text: '💰 ¡Hola! Soy Daniela, tu asesora financiera de AIGestion. Estoy aquí para ayudarte a encontrar el plan perfecto que se ajuste a tu presupuesto y objetivos.',
              sender: 'daniela',
              timestamp: new Date(),
              suggestions: ['Ver planes disponibles', 'Calcular ROI', 'Obtener cotización'],
            },
          ],
          about: [
            {
              id: 'about',
              text: '🏢 ¡Hola! Soy Daniela, tu guía de AIGestion. Estoy aquí para mostrarte cómo nuestra tecnología revoluciona la gestión empresarial.',
              sender: 'daniela',
              timestamp: new Date(),
              suggestions: ['Nuestra misión', 'Tecnología usada', 'Casos de éxito'],
            },
          ],
        }[a]
      );
    }, [a]),
      se.useEffect(() => {
        const e = async () => {
          try {
            const e = await Js.checkConnectivity();
            if ((m(e), e)) {
              const e = await Js.getSystemStatus();
              g(e);
            }
          } catch (e) {
            console.log('DanielaWebsite: Modo demostración');
          }
        };
        e();
        const t = setInterval(e, 3e4);
        return () => clearInterval(t);
      }, []),
      se.useEffect(() => {
        var e;
        null == (e = b.current) || e.scrollIntoView({ behavior: 'smooth' });
      }, [o]));
    const y = async () => {
        if (!c.trim()) return;
        const e = { id: `user-${Date.now()}`, text: c, sender: 'user', timestamp: new Date() };
        (l(t => [...t, e]), d(''), h(!0));
        try {
          const e = await Js.chat(c, 'website-user', `session-${Date.now()}`),
            t = {
              id: `daniela-${Date.now()}`,
              text: e.response,
              sender: 'daniela',
              timestamp: new Date(),
              suggestions: j(c, a),
            };
          l(e => [...e, t]);
        } catch (t) {
          const e = N(c, a),
            s = {
              id: `daniela-${Date.now()}`,
              text: e,
              sender: 'daniela',
              timestamp: new Date(),
              suggestions: j(c, a),
            };
          l(e => [...e, s]);
        } finally {
          h(!1);
        }
      },
      w = e => {
        d(e);
      },
      j = (e, t) => {
        const a = e.toLowerCase();
        switch (t) {
          case 'homepage':
            return a.includes('servicio')
              ? ['Nuestros servicios principales', 'Soluciones personalizadas', 'Precios y planes']
              : a.includes('tecnología')
                ? ['IA y Machine Learning', 'Automatización', 'Integración con sistemas existentes']
                : a.includes('roi')
                  ? ['Calculadora de ROI', 'Casos de éxito', 'Demostración en vivo']
                  : ['Saber más', 'Contactar ventas', 'Ver demostración'];
          case 'contact':
            return ['Agendar llamada', 'Enviar email', 'Ver portfolio'];
          case 'pricing':
            return a.includes('precio')
              ? ['Planes básicos', 'Planes empresariales', 'Personalización']
              : a.includes('roi')
                ? ['Calculadora ROI', 'Comparativa de planes', 'Periodo de recuperación']
                : ['Ver todos los planes', 'Solicitar cotización', 'Hablar con asesor'];
          case 'about':
            return ['Nuestra historia', 'Equipo fundador', 'Tecnología y metodología'];
          default:
            return ['Saber más', 'Contactar', 'Ver servicios'];
        }
      },
      N = (e, t) => {
        const a = e.toLowerCase();
        return 'homepage' === t
          ? a.includes('servicio')
            ? 'En AIGestion ofrecemos soluciones de IA personalizadas para optimizar tus procesos empresariales. ¿Qué área te interesa más?'
            : a.includes('tecnología')
              ? 'Utilizamos IA avanzada, automatización y análisis de datos para transformar tu negocio. ¿Quieres conocer más detalles?'
              : a.includes('roi')
                ? 'Nuestros clientes typically ven un ROI del 200-300% en los primeros 6 meses. ¿Te gustaría calcular tu ROI específico?'
                : 'En AIGestion, creamos soluciones inteligentes que se adaptan a tus necesidades únicas. ¿En qué puedo ayudarte hoy?'
          : 'contact' === t
            ? 'Estoy aquí para conectar contigo. Puedo agendar una llamada con uno de nuestros especialistas o responder tus preguntas inmediatamente. ¿Qué prefieres?'
            : 'pricing' === t
              ? 'Tenemos planes flexibles que se adaptan a cualquier tamaño de empresa. ¿Te gustaría ver nuestras opciones o calcular una cotización personalizada?'
              : 'about' === t
                ? 'En AIGestion, combinamos tecnología de vanguardia con experiencia humana para crear soluciones que realmente impactan. ¿Qué te gustaría conocer?'
                : 'Gracias por tu interés en AIGestion. Estoy aquí para responder cualquier pregunta que tengas. ¿En qué puedo ayudarte?';
      },
      _ = () => {
        switch (a) {
          case 'homepage':
            return '💡 Asistente Inteligente';
          case 'contact':
            return '🤝 Consultora de Contacto';
          case 'pricing':
            return '💰 Asesor Financiero';
          case 'about':
            return '🏢 Guía de Empresa';
          default:
            return '🧠 Daniela AI';
        }
      },
      A = () => {
        switch (a) {
          case 'homepage':
            return 'Optimiza tu negocio con IA';
          case 'contact':
            return 'Conecta con expertos';
          case 'pricing':
            return 'Maximiza tu inversión';
          case 'about':
            return 'Descubre nuestra historia';
          default:
            return 'Tu asistente inteligente';
        }
      };
    return 'widget' === t
      ? ee.jsxs('div', {
          className: `daniela-widget ${e}`,
          children: [
            ee.jsxs('div', {
              className: 'daniela-widget-header',
              children: [
                ee.jsx('div', { className: 'daniela-avatar', children: '🧠' }),
                ee.jsxs('div', {
                  className: 'daniela-info',
                  children: [
                    ee.jsx('div', { className: 'daniela-title', children: _() }),
                    ee.jsx('div', { className: 'daniela-subtitle', children: A() }),
                  ],
                }),
                ee.jsx('button', {
                  className: 'daniela-expand-btn',
                  onClick: () => f(!x),
                  children: x ? '−' : '+',
                }),
              ],
            }),
            ee.jsx(le, {
              children:
                x &&
                ee.jsxs(oe.div, {
                  className: 'daniela-widget-content',
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: 'auto' },
                  exit: { opacity: 0, height: 0 },
                  children: [
                    ee.jsxs('div', {
                      className: 'daniela-messages',
                      children: [
                        o
                          .slice(-3)
                          .map(e =>
                            ee.jsx(
                              'div',
                              {
                                className: `message ${e.sender}`,
                                children: ee.jsx('div', {
                                  className: 'message-content',
                                  children: e.text,
                                }),
                              },
                              e.id
                            )
                          ),
                        u &&
                          ee.jsx('div', {
                            className: 'message daniela',
                            children: ee.jsxs('div', {
                              className: 'typing-indicator',
                              children: [
                                ee.jsx('span', {}),
                                ee.jsx('span', {}),
                                ee.jsx('span', {}),
                              ],
                            }),
                          }),
                      ],
                    }),
                    ee.jsxs('div', {
                      className: 'daniela-input',
                      children: [
                        ee.jsx('input', {
                          type: 'text',
                          value: c,
                          onChange: e => d(e.target.value),
                          onKeyPress: e => 'Enter' === e.key && y(),
                          placeholder: 'Escribe tu pregunta...',
                        }),
                        ee.jsx('button', {
                          onClick: y,
                          disabled: !c.trim() || u,
                          children: u ? ee.jsx('div', { className: 'loading-spinner' }) : '→',
                        }),
                      ],
                    }),
                    (null == (s = o[o.length - 1]) ? void 0 : s.suggestions) &&
                      ee.jsx('div', {
                        className: 'daniela-suggestions',
                        children: o[o.length - 1].suggestions.map((e, t) =>
                          ee.jsx(
                            'button',
                            { className: 'suggestion-btn', onClick: () => w(e), children: e },
                            t
                          )
                        ),
                      }),
                  ],
                }),
            }),
          ],
        })
      : 'assistant' === t
        ? ee.jsxs('div', {
            className: `daniela-assistant ${e}`,
            children: [
              ee.jsxs('div', {
                className: 'daniela-assistant-header',
                children: [
                  ee.jsx('div', { className: 'daniela-avatar-large', children: '🧠' }),
                  ee.jsxs('div', {
                    className: 'daniela-info',
                    children: [
                      ee.jsx('h3', { children: _() }),
                      ee.jsx('p', { children: A() }),
                      ee.jsxs('div', {
                        className: 'daniela-status',
                        children: [
                          ee.jsx('span', {
                            className: 'status-dot ' + (p ? 'connected' : 'disconnected'),
                          }),
                          ee.jsx('span', {
                            className: 'status-text',
                            children: p ? 'En línea' : 'Modo demostración',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              ee.jsxs('div', {
                className: 'daniela-assistant-content',
                children: [
                  ee.jsxs('div', {
                    className: 'daniela-messages',
                    children: [
                      o.map(e =>
                        ee.jsxs(
                          oe.div,
                          {
                            initial: { opacity: 0, y: 20 },
                            animate: { opacity: 1, y: 0 },
                            className: `message ${e.sender}`,
                            children: [
                              ee.jsx('div', { className: 'message-content', children: e.text }),
                              ee.jsx('div', {
                                className: 'message-time',
                                children: e.timestamp.toLocaleTimeString(),
                              }),
                            ],
                          },
                          e.id
                        )
                      ),
                      ee.jsx(le, {
                        children:
                          u &&
                          ee.jsx(oe.div, {
                            initial: { opacity: 0, y: 20 },
                            animate: { opacity: 1, y: 0 },
                            exit: { opacity: 0, y: -20 },
                            className: 'message daniela',
                            children: ee.jsxs('div', {
                              className: 'typing-indicator',
                              children: [
                                ee.jsx('span', {}),
                                ee.jsx('span', {}),
                                ee.jsx('span', {}),
                              ],
                            }),
                          }),
                      }),
                    ],
                  }),
                  (null == (n = o[o.length - 1]) ? void 0 : n.suggestions) &&
                    ee.jsxs('div', {
                      className: 'daniela-suggestions',
                      children: [
                        ee.jsx('p', { className: 'suggestions-title', children: 'Sugerencias:' }),
                        ee.jsx('div', {
                          className: 'suggestions-grid',
                          children: o[o.length - 1].suggestions.map((e, t) =>
                            ee.jsx(
                              'button',
                              { className: 'suggestion-btn', onClick: () => w(e), children: e },
                              t
                            )
                          ),
                        }),
                      ],
                    }),
                  ee.jsx('div', {
                    className: 'daniela-input-container',
                    children: ee.jsxs('div', {
                      className: 'daniela-input',
                      children: [
                        ee.jsx('input', {
                          type: 'text',
                          value: c,
                          onChange: e => d(e.target.value),
                          onKeyPress: e => 'Enter' === e.key && y(),
                          placeholder: 'Escribe tu pregunta...',
                          className: 'daniela-input-field',
                        }),
                        ee.jsx('button', {
                          onClick: y,
                          disabled: !c.trim() || u,
                          className: 'daniela-send-btn',
                          children: u
                            ? ee.jsx('div', { className: 'loading-spinner' })
                            : ee.jsx('svg', {
                                width: '20',
                                height: '20',
                                viewBox: '0 0 24 24',
                                fill: 'none',
                                stroke: 'currentColor',
                                children: ee.jsx('path', {
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  strokeWidth: 2,
                                  d: 'M12 19l9 2-9-18-9-18-9 2-9 18z',
                                }),
                              }),
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              v &&
                ee.jsxs('div', {
                  className: 'daniela-system-status',
                  children: [
                    ee.jsx('h4', { children: 'Estado del Sistema' }),
                    ee.jsxs('div', {
                      className: 'system-metrics',
                      children: [
                        ee.jsxs('div', {
                          className: 'metric',
                          children: [
                            ee.jsx('span', { className: 'metric-label', children: 'Estado:' }),
                            ee.jsx('span', {
                              className: `metric-value ${v.status}`,
                              children:
                                'operational' === v.status
                                  ? '✅ Operativo'
                                  : '⚠️ Requiere atención',
                            }),
                          ],
                        }),
                        ee.jsxs('div', {
                          className: 'metric',
                          children: [
                            ee.jsx('span', { className: 'metric-label', children: 'Versión:' }),
                            ee.jsx('span', { className: 'metric-value', children: v.version }),
                          ],
                        }),
                        ee.jsxs('div', {
                          className: 'metric',
                          children: [
                            ee.jsx('span', { className: 'metric-label', children: 'Usuarios:' }),
                            ee.jsx('span', {
                              className: 'metric-value',
                              children: (null == (i = v.statistics) ? void 0 : i.totalUsers) || 0,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          })
        : ee.jsxs('div', {
            className: `daniela-advisor ${e}`,
            children: [
              ee.jsxs('div', {
                className: 'daniela-advisor-header',
                children: [
                  ee.jsx('div', { className: 'daniela-avatar', children: '🧠' }),
                  ee.jsxs('div', {
                    className: 'daniela-info',
                    children: [
                      ee.jsx('h3', { children: _() }),
                      ee.jsx('p', { children: A() }),
                      ee.jsxs('div', {
                        className: 'daniela-badges',
                        children: [
                          ee.jsx('span', { className: 'badge badge-ai', children: 'IA Avanzada' }),
                          ee.jsx('span', {
                            className: 'badge badge-realtime',
                            children: 'Tiempo Real',
                          }),
                          ee.jsx('span', {
                            className: 'badge badge-available',
                            children: 'Disponible',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              ee.jsxs('div', {
                className: 'daniela-advisor-content',
                children: [
                  ee.jsxs('div', {
                    className: 'daniela-conversation',
                    children: [
                      o.map(e =>
                        ee.jsxs(
                          'div',
                          {
                            className: `conversation-message ${e.sender}`,
                            children: [
                              ee.jsx('div', {
                                className: 'message-avatar',
                                children: 'user' === e.sender ? '👤' : '🧠',
                              }),
                              ee.jsxs('div', {
                                className: 'message-content',
                                children: [
                                  ee.jsx('div', { className: 'message-text', children: e.text }),
                                  ee.jsx('div', {
                                    className: 'message-time',
                                    children: e.timestamp.toLocaleTimeString(),
                                  }),
                                ],
                              }),
                            ],
                          },
                          e.id
                        )
                      ),
                      ee.jsx(le, {
                        children:
                          u &&
                          ee.jsxs('div', {
                            className: 'conversation-message daniela',
                            children: [
                              ee.jsx('div', { className: 'message-avatar', children: '🧠' }),
                              ee.jsx('div', {
                                className: 'message-content',
                                children: ee.jsxs('div', {
                                  className: 'typing-indicator',
                                  children: [
                                    ee.jsx('span', {}),
                                    ee.jsx('span', {}),
                                    ee.jsx('span', {}),
                                  ],
                                }),
                              }),
                            ],
                          }),
                      }),
                    ],
                  }),
                  ee.jsxs('div', {
                    className: 'daniela-actions',
                    children: [
                      ee.jsxs('div', {
                        className: 'daniela-input-group',
                        children: [
                          ee.jsx('input', {
                            type: 'text',
                            value: c,
                            onChange: e => d(e.target.value),
                            onKeyPress: e => 'Enter' === e.key && y(),
                            placeholder: `Pregúntale sobre ${A().toLowerCase()}...`,
                            className: 'daniela-advisor-input',
                          }),
                          ee.jsx('button', {
                            onClick: y,
                            disabled: !c.trim() || u,
                            className: 'daniela-action-btn',
                            children: u ? 'Pensando...' : 'Enviar',
                          }),
                        ],
                      }),
                      (null == (r = o[o.length - 1]) ? void 0 : r.suggestions) &&
                        ee.jsxs('div', {
                          className: 'daniela-quick-actions',
                          children: [
                            ee.jsx('p', {
                              className: 'actions-title',
                              children: 'Acciones rápidas:',
                            }),
                            ee.jsx('div', {
                              className: 'actions-grid',
                              children: o[o.length - 1].suggestions.map((e, t) =>
                                ee.jsx(
                                  'button',
                                  { className: 'action-btn', onClick: () => w(e), children: e },
                                  t
                                )
                              ),
                            }),
                          ],
                        }),
                    ],
                  }),
                  p &&
                    ee.jsxs('div', {
                      className: 'daniela-features',
                      children: [
                        ee.jsx('h4', { children: 'Capacidades Disponibles:' }),
                        ee.jsxs('div', {
                          className: 'features-grid',
                          children: [
                            ee.jsxs('div', {
                              className: 'feature-item',
                              children: [
                                ee.jsx('span', { className: 'feature-icon', children: '🧠' }),
                                ee.jsx('span', {
                                  className: 'feature-name',
                                  children: 'Análisis Emocional',
                                }),
                              ],
                            }),
                            ee.jsxs('div', {
                              className: 'feature-item',
                              children: [
                                ee.jsx('span', { className: 'feature-icon', children: '🔧' }),
                                ee.jsx('span', {
                                  className: 'feature-name',
                                  children: 'Ejecución de Herramientas',
                                }),
                              ],
                            }),
                            ee.jsxs('div', {
                              className: 'feature-item',
                              children: [
                                ee.jsx('span', { className: 'feature-icon', children: '💭' }),
                                ee.jsx('span', {
                                  className: 'feature-name',
                                  children: 'Memoria Inteligente',
                                }),
                              ],
                            }),
                            ee.jsxs('div', {
                              className: 'feature-item',
                              children: [
                                ee.jsx('span', { className: 'feature-icon', children: '⚡' }),
                                ee.jsx('span', {
                                  className: 'feature-name',
                                  children: 'Razonamiento Avanzado',
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
  },
  en = () => {
    const [e, t] = se.useState('conversation'),
      [a, s] = se.useState('assistant'),
      [n, i] = se.useState('homepage'),
      r = [
        {
          icon: ee.jsx(Ae, { className: 'w-6 h-6' }),
          title: 'Inteligencia Emocional',
          description: 'Análisis en tiempo real del estado emocional del cliente',
          color: 'from-nexus-cyan to-blue-500',
        },
        {
          icon: ee.jsx(ze, { className: 'w-6 h-6' }),
          title: 'Respuestas Contextuales',
          description: 'Memoria conversacional y adaptación al contexto',
          color: 'from-nexus-violet to-purple-500',
        },
        {
          icon: ee.jsx(ye, { className: 'w-6 h-6' }),
          title: 'Acciones Proactivas',
          description: 'Sugerencias inteligentes basadas en la conversación',
          color: 'from-nexus-gold to-yellow-500',
        },
        {
          icon: ee.jsx(be, { className: 'w-6 h-6' }),
          title: 'Seguridad Total',
          description: 'Encriptación de extremo a extremo y privacidad garantizada',
          color: 'from-green-500 to-emerald-500',
        },
        {
          icon: ee.jsx(et, { className: 'w-6 h-6' }),
          title: 'Multiidioma',
          description: 'Soporte para español, inglés y más idiomas',
          color: 'from-orange-500 to-red-500',
        },
        {
          icon: ee.jsx(tt, { className: 'w-6 h-6' }),
          title: 'Procesamiento Neural',
          description: 'Modelos de IA de última generación',
          color: 'from-pink-500 to-rose-500',
        },
      ];
    return ee.jsxs('div', {
      className: 'min-h-screen bg-black text-white',
      children: [
        ee.jsxs('div', {
          className: 'relative overflow-hidden',
          children: [
            ee.jsx('div', {
              className:
                'absolute inset-0 bg-gradient-to-br from-nexus-cyan/10 via-transparent to-nexus-violet/10',
            }),
            ee.jsx('div', {
              className: 'relative container mx-auto px-6 py-16',
              children: ee.jsxs(oe.div, {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                className: 'text-center mb-12',
                children: [
                  ee.jsx('div', {
                    className: 'flex justify-center mb-6',
                    children: ee.jsx('div', {
                      className:
                        'w-20 h-20 rounded-full bg-gradient-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center',
                      children: ee.jsx(Ae, { className: 'w-10 h-10 text-white' }),
                    }),
                  }),
                  ee.jsx('h1', {
                    className:
                      'text-6xl font-orbitron font-black mb-4 bg-gradient-to-r from-nexus-cyan-glow to-nexus-violet-glow bg-clip-text text-transparent',
                    children: 'DANIELA',
                  }),
                  ee.jsx('p', {
                    className: 'text-xl text-nexus-silver/80 mb-8',
                    children:
                      'La experiencia futurista de conversación IA que transformará tu negocio',
                  }),
                  ee.jsxs('div', {
                    className: 'flex justify-center gap-4',
                    children: [
                      ee.jsx(oe.button, {
                        whileHover: { scale: 1.05 },
                        whileTap: { scale: 0.95 },
                        onClick: () => t('conversation'),
                        className:
                          'px-8 py-3 rounded-full font-orbitron font-black tracking-wider transition-all ' +
                          ('conversation' === e
                            ? 'bg-nexus-cyan-glow text-black'
                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'),
                        children: 'PROBAR CONVERSACIÓN',
                      }),
                      ee.jsx(oe.button, {
                        whileHover: { scale: 1.05 },
                        whileTap: { scale: 0.95 },
                        onClick: () => t('features'),
                        className:
                          'px-8 py-3 rounded-full font-orbitron font-black tracking-wider transition-all ' +
                          ('features' === e
                            ? 'bg-nexus-violet-glow text-black'
                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'),
                        children: 'CARACTERÍSTICAS',
                      }),
                      ee.jsx(oe.button, {
                        whileHover: { scale: 1.05 },
                        whileTap: { scale: 0.95 },
                        onClick: () => t('analytics'),
                        className:
                          'px-8 py-3 rounded-full font-orbitron font-black tracking-wider transition-all ' +
                          ('analytics' === e
                            ? 'bg-nexus-gold text-black'
                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'),
                        children: 'ANALÍTICA',
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
        ee.jsxs('div', {
          className: 'container mx-auto px-6 py-12',
          children: [
            'conversation' === e &&
              ee.jsxs(oe.div, {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                className: 'max-w-4xl mx-auto',
                children: [
                  ee.jsxs('div', {
                    className: 'mb-8 text-center',
                    children: [
                      ee.jsxs('h2', {
                        className: 'text-3xl font-orbitron font-black mb-4',
                        children: [
                          'Conversa con ',
                          ee.jsx('span', {
                            className: 'text-nexus-cyan-glow',
                            children: 'Daniela',
                          }),
                        ],
                      }),
                      ee.jsx('p', {
                        className: 'text-nexus-silver/60 mb-6',
                        children:
                          'Experimenta una conversación natural con análisis emocional en tiempo real',
                      }),
                      ee.jsxs('div', {
                        className: 'flex justify-center gap-4 mb-6',
                        children: [
                          ee.jsxs('div', {
                            className: 'flex gap-2',
                            children: [
                              ee.jsx('span', {
                                className: 'text-sm text-nexus-silver/60 py-2',
                                children: 'Variante:',
                              }),
                              ['widget', 'assistant', 'advisor'].map(e =>
                                ee.jsx(
                                  oe.button,
                                  {
                                    whileHover: { scale: 1.05 },
                                    whileTap: { scale: 0.95 },
                                    onClick: () => s(e),
                                    className:
                                      'px-4 py-2 rounded-lg text-sm font-orbitron transition-all ' +
                                      (a === e
                                        ? 'bg-nexus-cyan-glow text-black'
                                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'),
                                    children: e.charAt(0).toUpperCase() + e.slice(1),
                                  },
                                  e
                                )
                              ),
                            ],
                          }),
                          ee.jsxs('div', {
                            className: 'flex gap-2',
                            children: [
                              ee.jsx('span', {
                                className: 'text-sm text-nexus-silver/60 py-2',
                                children: 'Contexto:',
                              }),
                              ['homepage', 'contact', 'pricing', 'about'].map(e =>
                                ee.jsx(
                                  oe.button,
                                  {
                                    whileHover: { scale: 1.05 },
                                    whileTap: { scale: 0.95 },
                                    onClick: () => i(e),
                                    className:
                                      'px-4 py-2 rounded-lg text-sm font-orbitron transition-all ' +
                                      (n === e
                                        ? 'bg-nexus-violet-glow text-black'
                                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'),
                                    children: e.charAt(0).toUpperCase() + e.slice(1),
                                  },
                                  e
                                )
                              ),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  ee.jsxs('div', {
                    className: 'grid grid-cols-1 lg:grid-cols-3 gap-8',
                    children: [
                      ee.jsx('div', {
                        className: 'lg:col-span-2',
                        children: ee.jsxs('div', {
                          className: 'relative',
                          children: [
                            'widget' === a &&
                              ee.jsx('div', {
                                className: 'h-96 relative',
                                children: ee.jsx(Zs, { variant: 'widget', context: n }),
                              }),
                            'assistant' === a &&
                              ee.jsx('div', {
                                className: 'h-96',
                                children: ee.jsx(Zs, { variant: 'assistant', context: n }),
                              }),
                            'advisor' === a &&
                              ee.jsx('div', {
                                className: 'h-96',
                                children: ee.jsx(Zs, { variant: 'advisor', context: n }),
                              }),
                          ],
                        }),
                      }),
                      ee.jsxs('div', {
                        className: 'space-y-6',
                        children: [
                          ee.jsxs('div', {
                            className: 'bg-white/5 border border-white/10 rounded-2xl p-6',
                            children: [
                              ee.jsx('h3', {
                                className:
                                  'text-lg font-orbitron font-bold mb-4 text-nexus-cyan-glow',
                                children: 'CONFIGURACIÓN ACTUAL',
                              }),
                              ee.jsxs('div', {
                                className: 'space-y-3',
                                children: [
                                  ee.jsxs('div', {
                                    className: 'flex justify-between items-center',
                                    children: [
                                      ee.jsx('span', {
                                        className: 'text-sm text-nexus-silver/60',
                                        children: 'Variante',
                                      }),
                                      ee.jsx('span', {
                                        className: 'text-sm font-orbitron font-black text-white',
                                        children: a.toUpperCase(),
                                      }),
                                    ],
                                  }),
                                  ee.jsxs('div', {
                                    className: 'flex justify-between items-center',
                                    children: [
                                      ee.jsx('span', {
                                        className: 'text-sm text-nexus-silver/60',
                                        children: 'Contexto',
                                      }),
                                      ee.jsx('span', {
                                        className: 'text-sm font-orbitron font-black text-white',
                                        children: n.toUpperCase(),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          ee.jsxs('div', {
                            className: 'bg-white/5 border border-white/10 rounded-2xl p-6',
                            children: [
                              ee.jsx('h3', {
                                className:
                                  'text-lg font-orbitron font-bold mb-4 text-nexus-violet-glow',
                                children: 'CARACTERÍSTICAS',
                              }),
                              ee.jsxs('div', {
                                className: 'space-y-3 text-sm text-nexus-silver/60',
                                children: [
                                  'widget' === a &&
                                    ee.jsx('p', {
                                      children:
                                        'Widget flotante ideal para esquinas de sitios web. Minimalista y expansible.',
                                    }),
                                  'assistant' === a &&
                                    ee.jsx('p', {
                                      children:
                                        'Asistente completo con panel de conversación y estado del sistema en tiempo real.',
                                    }),
                                  'advisor' === a &&
                                    ee.jsx('p', {
                                      children:
                                        'Asesor integrado con capacidades avanzadas y análisis contextual.',
                                    }),
                                ],
                              }),
                            ],
                          }),
                          ee.jsxs('div', {
                            className: 'bg-white/5 border border-white/10 rounded-2xl p-6',
                            children: [
                              ee.jsx('h3', {
                                className: 'text-lg font-orbitron font-bold mb-4 text-nexus-gold',
                                children: 'CONTEXTO',
                              }),
                              ee.jsxs('div', {
                                className: 'space-y-3 text-sm text-nexus-silver/60',
                                children: [
                                  'homepage' === n &&
                                    ee.jsx('p', {
                                      children:
                                        'Diseñado para la página principal con enfoque en servicios y tecnología.',
                                    }),
                                  'contact' === n &&
                                    ee.jsx('p', {
                                      children:
                                        'Orientado a generar conexiones y agendar reuniones con expertos.',
                                    }),
                                  'pricing' === n &&
                                    ee.jsx('p', {
                                      children:
                                        'Especializado en planes, precios y cálculo de ROI para clientes.',
                                    }),
                                  'about' === n &&
                                    ee.jsx('p', {
                                      children:
                                        'Enfocado en mostrar la historia, misión y tecnología de la empresa.',
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
              }),
            'features' === e &&
              ee.jsxs(oe.div, {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                className: 'max-w-6xl mx-auto',
                children: [
                  ee.jsxs('div', {
                    className: 'text-center mb-12',
                    children: [
                      ee.jsxs('h2', {
                        className: 'text-4xl font-orbitron font-black mb-4',
                        children: [
                          'Características ',
                          ee.jsx('span', {
                            className: 'text-nexus-violet-glow',
                            children: 'Futuristas',
                          }),
                        ],
                      }),
                      ee.jsx('p', {
                        className: 'text-xl text-nexus-silver/60',
                        children: 'Tecnología de vanguardia para una experiencia única',
                      }),
                    ],
                  }),
                  ee.jsx('div', {
                    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
                    children: r.map((e, t) =>
                      ee.jsxs(
                        oe.div,
                        {
                          initial: { opacity: 0, y: 20 },
                          animate: { opacity: 1, y: 0 },
                          transition: { delay: 0.1 * t },
                          className: 'group relative',
                          children: [
                            ee.jsx('div', {
                              className:
                                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl',
                              style: {
                                backgroundImage:
                                  'linear-gradient(to bottom right, var(--tw-gradient-stops))',
                              },
                            }),
                            ee.jsxs('div', {
                              className:
                                'relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all',
                              children: [
                                ee.jsx('div', {
                                  className: `w-16 h-16 rounded-full bg-gradient-to-br ${e.color} flex items-center justify-center mb-6`,
                                  children: e.icon,
                                }),
                                ee.jsx('h3', {
                                  className: 'text-xl font-orbitron font-bold mb-3 text-white',
                                  children: e.title,
                                }),
                                ee.jsx('p', {
                                  className: 'text-nexus-silver/60 text-sm leading-relaxed',
                                  children: e.description,
                                }),
                              ],
                            }),
                          ],
                        },
                        t
                      )
                    ),
                  }),
                ],
              }),
            'analytics' === e &&
              ee.jsxs(oe.div, {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                className: 'max-w-6xl mx-auto',
                children: [
                  ee.jsxs('div', {
                    className: 'text-center mb-12',
                    children: [
                      ee.jsxs('h2', {
                        className: 'text-4xl font-orbitron font-black mb-4',
                        children: [
                          'Analítica en ',
                          ee.jsx('span', { className: 'text-nexus-gold', children: 'Tiempo Real' }),
                        ],
                      }),
                      ee.jsx('p', {
                        className: 'text-xl text-nexus-silver/60',
                        children: 'Métricas e insights del rendimiento de Daniela',
                      }),
                    ],
                  }),
                  ee.jsx('div', {
                    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12',
                    children: [
                      { label: 'Conversaciones', value: '12,847', trend: '+23%' },
                      { label: 'Satisfacción', value: '98.2%', trend: '+5%' },
                      { label: 'Respuesta Rápida', value: '<200ms', trend: '-15%' },
                      { label: 'Precisión', value: '99.7%', trend: '+2%' },
                    ].map((e, t) =>
                      ee.jsxs(
                        oe.div,
                        {
                          initial: { opacity: 0, y: 20 },
                          animate: { opacity: 1, y: 0 },
                          transition: { delay: 0.1 * t },
                          className: 'bg-white/5 border border-white/10 rounded-2xl p-6',
                          children: [
                            ee.jsx('div', {
                              className: 'text-3xl font-orbitron font-black text-white mb-2',
                              children: e.value,
                            }),
                            ee.jsx('div', {
                              className: 'text-sm text-nexus-silver/60 mb-2',
                              children: e.label,
                            }),
                            ee.jsx('div', {
                              className: 'text-xs font-orbitron text-green-400',
                              children: e.trend,
                            }),
                          ],
                        },
                        t
                      )
                    ),
                  }),
                  ee.jsxs('div', {
                    className: 'bg-white/5 border border-white/10 rounded-2xl p-8',
                    children: [
                      ee.jsx('h3', {
                        className: 'text-2xl font-orbitron font-bold mb-6 text-nexus-gold',
                        children: 'Rendimiento de Conversaciones',
                      }),
                      ee.jsx('div', {
                        className: 'h-64 flex items-center justify-center',
                        children: ee.jsxs('div', {
                          className: 'text-center',
                          children: [
                            ee.jsx('div', {
                              className:
                                'w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-nexus-gold/20 to-nexus-gold/5 border border-nexus-gold/30 flex items-center justify-center',
                              children: ee.jsx(ye, { className: 'w-16 h-16 text-nexus-gold' }),
                            }),
                            ee.jsx('p', {
                              className: 'text-nexus-silver/60',
                              children: 'Sistema de análisis emocional en tiempo real',
                            }),
                          ],
                        }),
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
  tn = ({ onLogin: e, loading: t, error: a }) => {
    const [s, n] = se.useState({ email: '', password: '' }),
      [i, r] = se.useState(!1),
      [o, l] = se.useState({}),
      c = e => {
        const { name: t, value: a } = e.target;
        (n(e => ({ ...e, [t]: a })), o[t] && l(e => ({ ...e, [t]: void 0 })));
      };
    return ee.jsx('div', {
      className: 'min-h-screen bg-nexus-obsidian flex items-center justify-center px-4',
      children: ee.jsxs(oe.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: 'w-full max-w-md',
        children: [
          ee.jsxs('div', {
            className: 'text-center mb-8',
            children: [
              ee.jsx(oe.div, {
                initial: { scale: 0.8 },
                animate: { scale: 1 },
                transition: { duration: 0.5, delay: 0.2 },
                className:
                  'w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center',
                children: ee.jsx('span', {
                  className: 'text-2xl font-bold text-white',
                  children: 'DA',
                }),
              }),
              ee.jsx('h1', {
                className: 'text-3xl font-orbitron font-black text-white mb-2',
                children: 'Bienvenido a Daniela',
              }),
              ee.jsx('p', {
                className: 'text-nexus-silver/60 text-sm',
                children: 'Tu asistente de IA emocional está lista para ayudarte',
              }),
            ],
          }),
          ee.jsx('div', {
            className:
              'p-8 bg-nexus-obsidian/40 backdrop-blur-xl border border-white/10 rounded-lg',
            children: ee.jsxs('form', {
              onSubmit: async t => {
                if (
                  (t.preventDefault(),
                  (() => {
                    const e = {};
                    return (
                      s.email
                        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) || (e.email = 'Email inválido')
                        : (e.email = 'El email es requerido'),
                      s.password
                        ? s.password.length < 6 &&
                          (e.password = 'La contraseña debe tener al menos 6 caracteres')
                        : (e.password = 'La contraseña es requerida'),
                      l(e),
                      0 === Object.keys(e).length
                    );
                  })())
                )
                  try {
                    await e(s.email, s.password);
                  } catch (a) {}
              },
              className: 'space-y-6',
              children: [
                ee.jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    ee.jsx('label', {
                      className: 'text-sm font-orbitron text-nexus-cyan',
                      children: 'Email',
                    }),
                    ee.jsxs('div', {
                      className: 'relative',
                      children: [
                        ee.jsx(at, {
                          className: 'absolute left-3 top-3 h-5 w-5 text-nexus-silver/40',
                        }),
                        ee.jsx('input', {
                          type: 'email',
                          name: 'email',
                          value: s.email,
                          onChange: c,
                          placeholder: 'tu@email.com',
                          disabled: t,
                          className:
                            'w-full pl-10 pr-4 py-2 bg-nexus-obsidian/60 border border-white/10 rounded-lg text-white placeholder-nexus-silver/40 focus:outline-none focus:border-nexus-cyan disabled:opacity-50',
                        }),
                      ],
                    }),
                    o.email &&
                      ee.jsx('p', { className: 'text-red-400 text-sm', children: o.email }),
                  ],
                }),
                ee.jsxs('div', {
                  className: 'space-y-2',
                  children: [
                    ee.jsx('label', {
                      className: 'text-sm font-orbitron text-nexus-cyan',
                      children: 'Contraseña',
                    }),
                    ee.jsxs('div', {
                      className: 'relative',
                      children: [
                        ee.jsx(we, {
                          className: 'absolute left-3 top-3 h-5 w-5 text-nexus-silver/40',
                        }),
                        ee.jsx('input', {
                          type: i ? 'text' : 'password',
                          name: 'password',
                          value: s.password,
                          onChange: c,
                          placeholder: '••••••••••',
                          disabled: t,
                          className:
                            'w-full pl-10 pr-10 py-2 bg-nexus-obsidian/60 border border-white/10 rounded-lg text-white placeholder-nexus-silver/40 focus:outline-none focus:border-nexus-cyan disabled:opacity-50',
                        }),
                        ee.jsx('button', {
                          type: 'button',
                          onClick: () => r(!i),
                          className:
                            'absolute right-3 top-3 text-nexus-silver/40 hover:text-nexus-silver/60 disabled:opacity-50',
                          disabled: t,
                          children: i
                            ? ee.jsx(st, { className: 'h-5 w-5' })
                            : ee.jsx(nt, { className: 'h-5 w-5' }),
                        }),
                      ],
                    }),
                    o.password &&
                      ee.jsx('p', { className: 'text-red-400 text-sm', children: o.password }),
                  ],
                }),
                a &&
                  ee.jsx(oe.div, {
                    initial: { opacity: 0, y: -10 },
                    animate: { opacity: 1, y: 0 },
                    className: 'bg-red-500/10 border border-red-500/20 rounded-lg p-3',
                    children: ee.jsxs('div', {
                      className: 'flex items-center text-red-400 text-sm',
                      children: [ee.jsx(it, { className: 'h-4 w-4 mr-2' }), a],
                    }),
                  }),
                ee.jsx('button', {
                  type: 'submit',
                  disabled: t,
                  className:
                    'w-full py-2 px-4 bg-nexus-violet text-white font-orbitron tracking-widest rounded-lg hover:bg-nexus-violet/80 disabled:opacity-50 transition-colors',
                  children: t ? 'Iniciando sesión...' : 'Iniciar Sesión',
                }),
                ee.jsxs('div', {
                  className: 'space-y-3 text-center',
                  children: [
                    ee.jsx('button', {
                      type: 'button',
                      className:
                        'text-nexus-cyan hover:text-nexus-cyan/80 text-sm transition-colors disabled:opacity-50',
                      disabled: t,
                      children: '¿Olvidaste tu contraseña?',
                    }),
                    ee.jsxs('div', {
                      className: 'text-nexus-silver/40 text-sm',
                      children: [
                        '¿Nuevo usuario?',
                        ' ',
                        ee.jsx('button', {
                          type: 'button',
                          className:
                            'text-nexus-violet hover:text-nexus-violet/80 text-sm transition-colors disabled:opacity-50',
                          disabled: t,
                          children: 'Regístrate gratis',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
          ee.jsx(oe.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5, delay: 0.5 },
            className: 'mt-8 text-center',
            children: ee.jsxs('p', {
              className: 'text-nexus-silver/40 text-xs',
              children: [
                'Al iniciar sesión, aceptas nuestros',
                ' ',
                ee.jsx('button', {
                  className: 'text-nexus-cyan hover:text-nexus-cyan/80 underline',
                  children: 'términos y condiciones',
                }),
              ],
            }),
          }),
        ],
      }),
    });
  },
  an = ({ onLogin: e, isAuthenticated: t }) => {
    const [a, s] = se.useState(!1),
      [n, i] = se.useState('');
    return t
      ? ee.jsx(fa, { to: '/dashboard', replace: !0 })
      : ee.jsx('div', {
          className: 'min-h-screen bg-nexus-obsidian flex items-center justify-center',
          children: ee.jsx(tn, {
            onLogin: async (t, a) => {
              (s(!0), i(''));
              try {
                await e(t, a);
              } catch (n) {
                i(n instanceof Error ? n.message : 'Error al iniciar sesión');
              } finally {
                s(!1);
              }
            },
            loading: a,
            error: n,
          }),
        });
  },
  sn = () => {
    const { playHover: e, playClick: t, playWhoosh: a } = Ya(),
      { scrollY: s } = ue(),
      n = pe(s, [0, 500], [0, 200]),
      i = pe(s, [0, 300], [1, 0]),
      r = [
        {
          title: 'Sala de Reuniones',
          description:
            'Un lugar donde puedes hablar con otras personas como si estuvieras allí mismo. Ideal para charlar y compartir ideas.',
          icon: Pe,
          color: 'from-blue-500/20 to-cyan-500/20',
          border: 'group-hover:neon-glow-cyan',
        },
        {
          title: 'Exposición de Inventos',
          description:
            'Mira nuestros proyectos y productos en 3D. Puedes moverlos y verlos desde todos los ángulos.',
          icon: ze,
          color: 'from-purple-500/20 to-pink-500/20',
          border: 'group-hover:neon-glow-violet',
        },
        {
          title: 'Tu Mesa de Trabajo',
          description:
            'Un espacio tranquilo donde tienes toda la información de tu negocio siempre a mano.',
          icon: rt,
          color: 'from-green-500/20 to-emerald-500/20',
          border: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
        },
        {
          title: 'Fotos con IA',
          description:
            'Usa nuestra tecnología para crear imágenes increíbles de tu oficina o productos al instante.',
          icon: ot,
          color: 'from-orange-500/20 to-yellow-500/20',
          border: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
        },
      ],
      o = ({ children: t, className: a = '' }) => {
        const s = se.useRef(null),
          n = ce(0),
          i = ce(0),
          r = pe(i, [-0.5, 0.5], [15, -15]),
          o = pe(n, [-0.5, 0.5], [-15, 15]);
        return ee.jsx(oe.div, {
          ref: s,
          onMouseMove: e => {
            if (!s.current) return;
            const t = s.current.getBoundingClientRect(),
              a = t.width,
              r = t.height,
              o = (e.clientX - t.left) / a - 0.5,
              l = (e.clientY - t.top) / r - 0.5;
            (n.set(o), i.set(l));
          },
          onMouseLeave: () => {
            (n.set(0), i.set(0));
          },
          onMouseEnter: () => e(),
          style: { rotateX: r, rotateY: o, transformStyle: 'preserve-3d' },
          className: a,
          children: t,
        });
      };
    return ee.jsxs('div', {
      className:
        'min-h-screen bg-nexus-obsidian pt-32 pb-24 px-6 relative overflow-hidden perspective-1000',
      children: [
        ee.jsx('div', {
          className:
            "fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50 mix-blend-overlay",
        }),
        ee.jsx(oe.div, {
          style: { y: n },
          className:
            'absolute inset-0 bg-radial-at-top from-nexus-violet/10 via-transparent to-transparent pointer-events-none',
        }),
        ee.jsx('div', {
          className:
            'absolute top-0 right-0 w-96 h-96 bg-nexus-cyan/5 blur-[120px] rounded-full pointer-events-none animate-pulse-glow',
        }),
        ee.jsxs('div', {
          className: 'max-w-6xl mx-auto relative z-10',
          children: [
            ee.jsxs(oe.header, {
              style: { opacity: i },
              initial: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
              animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
              transition: { duration: 0.8, ease: 'circOut' },
              className: 'text-center mb-20',
              children: [
                ee.jsx('h1', {
                  className:
                    'text-4xl md:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-nexus-silver to-white mb-6 animate-pulse-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]',
                  children: ee.jsx(es, { text: 'TU OFICINA DEL FUTURO' }),
                }),
                ee.jsxs('p', {
                  className:
                    'text-nexus-silver/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed',
                  children: [
                    ee.jsx('span', { className: 'text-nexus-cyan-glow', children: '●' }),
                    ' Antes de entrar, queremos que sepas que vas a viajar a un mundo virtual. Es como un videojuego, pero hecho para que tu empresa sea la mejor del mundo.',
                  ],
                }),
              ],
            }),
            ee.jsx('div', {
              className: 'grid grid-cols-1 md:grid-cols-2 gap-8 mb-20',
              children: r.map((e, t) => {
                const a = e.icon;
                return ee.jsx(
                  o,
                  {
                    className: 'perspective-1000',
                    children: ee.jsxs(oe.div, {
                      initial: { opacity: 0, x: t % 2 == 0 ? -50 : 50 },
                      whileInView: { opacity: 1, x: 0 },
                      viewport: { once: !0 },
                      transition: { delay: 0.1 * t, type: 'spring' },
                      className: `relative z-10 h-full p-8 rounded-[2rem] bg-gradient-to-br ${e.color} border border-white/5 backdrop-blur-sm group transition-all duration-300 ${e.border}`,
                      children: [
                        ee.jsxs('div', {
                          className:
                            'flex gap-6 items-start transform-style-3d group-hover:translate-z-10 transition-transform',
                          children: [
                            ee.jsx('div', {
                              className:
                                'p-4 bg-black/40 rounded-2xl border border-white/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500',
                              children: ee.jsx(a, { className: 'w-8 h-8 text-white' }),
                            }),
                            ee.jsxs('div', {
                              children: [
                                ee.jsx('h2', {
                                  className:
                                    'text-2xl font-orbitron font-bold mb-3 text-white group-hover:text-glow-cyan transition-all',
                                  children: e.title,
                                }),
                                ee.jsx('p', {
                                  className:
                                    'text-nexus-silver/80 text-sm leading-relaxed font-light',
                                  children: e.description,
                                }),
                              ],
                            }),
                          ],
                        }),
                        ee.jsx('div', {
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
            ee.jsxs(oe.section, {
              initial: { opacity: 0, y: 50 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: !0 },
              className:
                'premium-glass p-12 rounded-[3rem] text-center border-white/10 relative overflow-hidden group',
              children: [
                ee.jsx('div', {
                  className:
                    'absolute inset-0 bg-gradient-to-r from-nexus-violet/20 via-transparent to-nexus-cyan/20 opacity-50 group-hover:opacity-100 transition-opacity duration-1000',
                }),
                ee.jsx('div', {
                  className:
                    'absolute -inset-[100%] top-0 block h-[200%] w-[10px] -rotate-[20deg] bg-white/20 blur-[5px] animate-[shine_5s_infinite_linear]',
                }),
                ee.jsx('h3', {
                  className: 'text-3xl font-orbitron font-bold mb-6 text-white relative z-10',
                  children: '¿Estás listo para el viaje?',
                }),
                ee.jsx('p', {
                  className: 'text-nexus-silver/70 mb-10 max-w-xl mx-auto relative z-10',
                  children:
                    'Haz clic en el botón de abajo y te llevaremos directamente a tu sede oficial. Solo necesitas tu ratón para moverte y explorar.',
                }),
                ee.jsx('div', {
                  className: 'flex justify-center',
                  children: ee.jsx(fs, {
                    strength: 50,
                    children: ee.jsxs(Sa, {
                      to: '/virtual-office/go',
                      onMouseEnter: () => e(),
                      onMouseDown: () => t(),
                      onClick: () => a(),
                      className:
                        'relative z-10 btn-enterprise px-12 py-5 rounded-full text-lg font-orbitron font-black tracking-widest inline-flex items-center gap-4 hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(138,43,226,0.5)] group-hover:shadow-[0_0_80px_rgba(0,245,255,0.5)]',
                      children: [
                        'ENTRAR AHORA ',
                        ee.jsx(lt, { className: 'w-6 h-6 animate-pulse' }),
                      ],
                    }),
                  }),
                }),
                ee.jsxs('div', {
                  className:
                    'mt-12 flex justify-center gap-8 opacity-40 text-[10px] uppercase tracking-[0.3em] font-mono',
                  children: [
                    ee.jsxs('span', {
                      className: 'flex items-center gap-2',
                      children: [
                        ee.jsx('div', {
                          className: 'w-2 h-2 rounded-full bg-green-500 animate-pulse',
                        }),
                        ' Conexión Segura',
                      ],
                    }),
                    ee.jsxs('span', {
                      className: 'flex items-center gap-2',
                      children: [
                        ee.jsx('div', {
                          className: 'w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75',
                        }),
                        ' Modo Inmersivo',
                      ],
                    }),
                    ee.jsxs('span', {
                      className: 'flex items-center gap-2',
                      children: [
                        ee.jsx('div', {
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
  },
  nn = () => {
    const [e, t] = se.useState(!1),
      [a, s] = se.useState({ cpu: 12, memory: 45 }),
      [n, i] = se.useState(null);
    return (
      se.useEffect(() => {
        try {
          const e = setInterval(() => {
            s(e => ({
              cpu: Math.floor(30 * Math.random()) + 10,
              memory: Math.floor(20 * Math.random()) + 40,
            }));
          }, 2e3);
          return () => clearInterval(e);
        } catch (pi) {
          i(pi.message);
        }
      }, []),
      n
        ? ee.jsxs('div', {
            className: 'p-10 bg-black text-red-500',
            children: ['Error Crítico: ', n],
          })
        : ee.jsxs('div', {
            className:
              'weapon-dashboard min-h-screen p-4 bg-nexus-obsidian-deep text-white overflow-hidden relative',
            children: [
              ee.jsx('header', {
                className: 'flex justify-between items-start mb-8 z-10 relative',
                children: ee.jsxs('div', {
                  children: [
                    ee.jsx('h1', {
                      className: 'text-3xl font-bold text-nexus-cyan animate-pulse',
                      children: 'GOD MODE ACTIVE',
                    }),
                    ee.jsx('p', {
                      className: 'text-xs text-gray-400',
                      children: 'System Stable // v3.0',
                    }),
                  ],
                }),
              }),
              ee.jsxs('div', {
                className: 'grid grid-cols-1 gap-4',
                children: [
                  ee.jsxs('div', {
                    className: 'bg-white/10 p-6 rounded-xl border border-white/10',
                    children: [
                      ee.jsxs('h2', {
                        className: 'text-xl mb-4 flex items-center gap-2',
                        children: [
                          ee.jsx(Me, { className: 'w-6 h-6 text-green-400' }),
                          'SYSTEM STATUS',
                        ],
                      }),
                      ee.jsxs('div', {
                        className: 'flex justify-around',
                        children: [
                          ee.jsxs('div', {
                            className: 'text-center',
                            children: [
                              ee.jsxs('div', {
                                className: 'text-2xl font-bold text-nexus-cyan',
                                children: [a.cpu, '%'],
                              }),
                              ee.jsx('div', {
                                className: 'text-[10px] uppercase',
                                children: 'CPU Load',
                              }),
                            ],
                          }),
                          ee.jsxs('div', {
                            className: 'text-center',
                            children: [
                              ee.jsxs('div', {
                                className: 'text-2xl font-bold text-nexus-violet',
                                children: [a.memory, 'GB'],
                              }),
                              ee.jsx('div', {
                                className: 'text-[10px] uppercase',
                                children: 'Memory',
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  ee.jsx('button', {
                    className:
                      'bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan p-4 rounded-xl font-bold tracking-widest hover:bg-nexus-cyan hover:text-black transition-all',
                    children: 'DANIELA CORE',
                  }),
                  ee.jsx('button', {
                    className:
                      'bg-nexus-violet/20 text-nexus-violet border border-nexus-violet p-4 rounded-xl font-bold tracking-widest hover:bg-nexus-violet hover:text-black transition-all',
                    children: 'ADMIN ACCESS',
                  }),
                  ee.jsx('button', {
                    onClick: () => window.location.reload(),
                    className: 'mt-8 text-xs text-gray-500 underline',
                    children: 'Reload Shell',
                  }),
                ],
              }),
            ],
          })
    );
  },
  rn = se.lazy(() =>
    te(
      () => import('./CinematicPresentation-DrwFT80l.js'),
      __vite__mapDeps([0, 1, 2, 3, 4, 5])
    ).then(e => ({ default: e.CinematicPresentation }))
  ),
  on = se.lazy(() =>
    te(() => import('./NexusAndroid-v8wdooeN.js'), __vite__mapDeps([6, 1, 2, 3, 4, 5])).then(e => ({
      default: e.NexusAndroid,
    }))
  ),
  ln = se.lazy(() =>
    te(() => import('./EnhancedROI-X1hzLnCI.js'), __vite__mapDeps([7, 1, 2, 3, 4, 5])).then(e => ({
      default: e.EnhancedROI,
    }))
  ),
  cn = se.lazy(() =>
    te(
      () => import('./DecentralandOffice-CbhiaYIm.js'),
      __vite__mapDeps([8, 1, 2, 9, 10, 3, 4])
    ).then(e => ({ default: e.DecentralandOffice }))
  ),
  dn = se.lazy(() =>
    te(
      () => import('./VitureXRExperience-DdBoDV6I.js'),
      __vite__mapDeps([11, 1, 2, 9, 10, 3, 4, 5])
    ).then(e => ({ default: e.VitureXRExperience }))
  ),
  un = () =>
    ee.jsx('div', {
      className: 'min-h-[400px] bg-nexus-obsidian-deep flex items-center justify-center',
      children: ee.jsx('div', {
        className: 'text-nexus-cyan-glow font-orbitron tracking-[0.5em] text-xs animate-pulse',
        children: 'LOADING...',
      }),
    }),
  hn = () =>
    ee.jsxs('footer', {
      className: 'py-32 bg-nexus-obsidian-deep border-t border-white/5 relative overflow-hidden',
      children: [
        ee.jsx('div', {
          className:
            'absolute inset-0 bg-radial-at-bottom from-nexus-violet/5 via-transparent to-transparent pointer-events-none',
        }),
        ee.jsxs('div', {
          className: 'max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16 relative z-10',
          children: [
            ee.jsx('div', {
              className: 'col-span-1 md:col-span-2',
              children: ee.jsxs(oe.div, {
                initial: { opacity: 0, x: -20 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: !0 },
                children: [
                  ee.jsx('img', {
                    src: '/images/brand/logo.png',
                    alt: 'AIGestion',
                    className:
                      'h-10 mb-8 filter brightness-110 drop-shadow-[0_0_10px_rgba(138,43,226,0.3)]',
                  }),
                  ee.jsxs('p', {
                    className:
                      'text-nexus-silver/50 text-lg max-w-sm mb-12 font-light leading-relaxed italic',
                    children: [
                      '"Arquitectura de Inteligencia Soberana. ',
                      ee.jsx('br', {}),
                      'El núcleo neuronal para las empresas del mañana."',
                    ],
                  }),
                  ee.jsx('div', {
                    className:
                      'text-[10px] text-nexus-silver/20 font-mono uppercase tracking-[0.4em] mt-12',
                    children: '© 2026 AIGestion.net | God Level AI Restored v2.1 (Fixes Applied)',
                  }),
                ],
              }),
            }),
            ee.jsxs('div', {
              children: [
                ee.jsx('h4', {
                  className:
                    'font-orbitron text-xs text-nexus-cyan-glow mb-8 uppercase tracking-[0.3em] font-bold',
                  children: 'Ecosistema',
                }),
                ee.jsxs('ul', {
                  className:
                    'space-y-6 text-[10px] text-nexus-silver/40 font-orbitron tracking-widest uppercase',
                  children: [
                    ee.jsx('li', {
                      className:
                        'hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300',
                      children: 'Casos de Uso',
                    }),
                    ee.jsx('li', {
                      className:
                        'hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300',
                      children: 'Daniela AI',
                    }),
                    ee.jsx('li', {
                      className:
                        'hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300',
                      children: 'Nodos Globales',
                    }),
                  ],
                }),
              ],
            }),
            ee.jsxs('div', {
              children: [
                ee.jsx('h4', {
                  className:
                    'font-orbitron text-xs text-nexus-violet-glow mb-8 uppercase tracking-[0.3em] font-bold',
                  children: 'Metaverso',
                }),
                ee.jsxs('ul', {
                  className:
                    'space-y-6 text-[10px] text-nexus-silver/40 font-orbitron tracking-widest uppercase',
                  children: [
                    ee.jsx('li', {
                      className:
                        'hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300',
                      children: 'Sedes Decentraland',
                    }),
                    ee.jsx('li', {
                      className:
                        'hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300',
                      children: 'Virtual Office',
                    }),
                    ee.jsx('li', {
                      className:
                        'hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300 text-nexus-cyan-glow font-bold',
                      children: 'Acceso Terminal',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  pn = ({ loading: e, isAuthenticated: t, currentUser: a, handleLogin: s, handleLogout: n }) => {
    const { notify: i } = (() => {
        const e = se.useContext(Xs);
        if (!e) throw new Error('useNotification must be used within a NotificationProvider');
        return e;
      })(),
      r = sa();
    return (
      se.useEffect(() => {
        document.startViewTransition && document.startViewTransition(() => {});
      }, [r.pathname]),
      se.useEffect(() => {
        e || i('SISTEMA ACTIVADO', 'Protocolos Antigravity God Mode Online', 'success');
      }, [e, i]),
      ee.jsxs('div', {
        className:
          'bg-nexus-obsidian min-h-screen text-white font-sans selection:bg-nexus-violet selection:text-white relative',
        children: [
          ee.jsx(hs, {}),
          ee.jsx(js, {}),
          t ? null : ee.jsx(gs, {}),
          ee.jsxs(ba, {
            children: [
              ee.jsx(va, {
                path: '/login',
                element: t
                  ? ee.jsx(fa, { to: '/dashboard' })
                  : ee.jsx(an, { onLogin: s, isAuthenticated: t }),
              }),
              ee.jsx(va, {
                path: '/dashboard',
                element: t
                  ? ee.jsx(Qs, { user: a, onLogout: n })
                  : ee.jsxs('div', {
                      style: { minHeight: '100vh', padding: '2rem' },
                      children: [
                        ee.jsx('h1', {
                          style: { textAlign: 'center', fontSize: '3rem', marginBottom: '2rem' },
                          children: 'Centro de Control AIGestion',
                        }),
                        ee.jsxs('div', {
                          style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '2rem',
                          },
                          children: [
                            ee.jsxs('a', {
                              href: '/dashboard/admin',
                              style: {
                                background: 'rgba(139, 92, 246, 0.1)',
                                padding: '2rem',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: 'white',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                              },
                              children: [
                                ee.jsx('h3', { children: '🏆 Panel Administrativo' }),
                                ee.jsx('p', { children: 'Control administrativo y análisis' }),
                              ],
                            }),
                            ee.jsxs('a', {
                              href: '/dashboard/client',
                              style: {
                                background: 'rgba(6, 182, 212, 0.1)',
                                padding: '2rem',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: 'white',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                              },
                              children: [
                                ee.jsx('h3', { children: '👥 Panel de Cliente' }),
                                ee.jsx('p', {
                                  children: 'Portal de clientes y gestión de proyectos',
                                }),
                              ],
                            }),
                            ee.jsxs('a', {
                              href: '/dashboard/demo',
                              style: {
                                background: 'rgba(16, 185, 129, 0.1)',
                                padding: '2rem',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: 'white',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                              },
                              children: [
                                ee.jsx('h3', { children: '🎪 Panel de Demostración' }),
                                ee.jsx('p', { children: 'Demos interactivas y showcases' }),
                              ],
                            }),
                          ],
                        }),
                        ee.jsx('p', {
                          style: { textAlign: 'center', marginTop: '2rem' },
                          children: ee.jsx('a', {
                            href: '/login',
                            style: { color: '#667eea' },
                            children: 'Iniciar Sesión para Acceso Completo',
                          }),
                        }),
                      ],
                    }),
              }),
              ee.jsx(va, { path: '/dashboard/admin', element: ee.jsx(Os, {}) }),
              ee.jsx(va, { path: '/dashboard/client', element: ee.jsx(Ds, {}) }),
              ee.jsx(va, { path: '/dashboard/demo', element: ee.jsx(Rs, {}) }),
              ee.jsx(va, {
                path: '/',
                element: t
                  ? ee.jsx(fa, { to: '/dashboard' })
                  : ee.jsxs('main', {
                      children: [
                        ee.jsx(se.Suspense, { fallback: ee.jsx(un, {}), children: ee.jsx(rn, {}) }),
                        ee.jsx(se.Suspense, { fallback: ee.jsx(un, {}), children: ee.jsx(ls, {}) }),
                        ee.jsx(se.Suspense, { fallback: ee.jsx(un, {}), children: ee.jsx(on, {}) }),
                        ee.jsx(_s, {}),
                        ee.jsx(Oa, {}),
                        ee.jsx(se.Suspense, { fallback: ee.jsx(un, {}), children: ee.jsx(ln, {}) }),
                        ee.jsx(ws, {}),
                        ee.jsx(xs, {}),
                        ee.jsx(ks, {}),
                        ee.jsx(se.Suspense, { fallback: ee.jsx(un, {}), children: ee.jsx(cn, {}) }),
                        ee.jsx(ds, {}),
                        ee.jsx(se.Suspense, { fallback: ee.jsx(un, {}), children: ee.jsx(ts, {}) }),
                        ee.jsx(se.Suspense, { fallback: ee.jsx(un, {}), children: ee.jsx(dn, {}) }),
                      ],
                    }),
              }),
              ee.jsx(va, {
                path: '/lab',
                element: ee.jsx('div', {
                  className: 'pt-32 pb-20 px-6',
                  children: ee.jsx('h1', {
                    className: 'text-4xl font-orbitron text-white text-center',
                    children: 'Lab Section',
                  }),
                }),
              }),
              ee.jsx(va, { path: '/heartmula', element: ee.jsx(ps, {}) }),
              ee.jsx(va, { path: '/weapon', element: ee.jsx(nn, {}) }),
              ee.jsx(va, { path: '/dashboard', element: ee.jsx(fa, { to: '/dashboard/' }) }),
              ee.jsx(va, {
                path: '/dashboard/',
                element: ee.jsxs('div', {
                  style: { minHeight: '100vh', padding: '2rem' },
                  children: [
                    ee.jsx('h1', {
                      style: { textAlign: 'center', fontSize: '3rem', marginBottom: '2rem' },
                      children: 'AIGestion Dashboard Hub',
                    }),
                    ee.jsxs('div', {
                      style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                      },
                      children: [
                        ee.jsxs('a', {
                          href: '/dashboard/admin',
                          style: {
                            background: 'rgba(139, 92, 246, 0.1)',
                            padding: '2rem',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'white',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                          },
                          children: [
                            ee.jsx('h3', { children: '🏆 Admin Dashboard' }),
                            ee.jsx('p', { children: 'Administrative control and analytics' }),
                          ],
                        }),
                        ee.jsxs('a', {
                          href: '/dashboard/client',
                          style: {
                            background: 'rgba(6, 182, 212, 0.1)',
                            padding: '2rem',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'white',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                          },
                          children: [
                            ee.jsx('h3', { children: '👥 Client Dashboard' }),
                            ee.jsx('p', { children: 'Client portal and project management' }),
                          ],
                        }),
                        ee.jsxs('a', {
                          href: '/dashboard/demo',
                          style: {
                            background: 'rgba(16, 185, 129, 0.1)',
                            padding: '2rem',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            color: 'white',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                          },
                          children: [
                            ee.jsx('h3', { children: '🎪 Demo Dashboard' }),
                            ee.jsx('p', { children: 'Interactive demos and showcases' }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              ee.jsx(va, { path: '/dashboard/admin', element: ee.jsx(Os, {}) }),
              ee.jsx(va, { path: '/dashboard/client', element: ee.jsx(Ds, {}) }),
              ee.jsx(va, { path: '/dashboard/demo', element: ee.jsx(Rs, {}) }),
              ee.jsx(va, { path: '/daniela', element: ee.jsx(en, {}) }),
              ee.jsx(va, { path: '/daniela/demo', element: ee.jsx(en, {}) }),
              ee.jsx(va, { path: '/virtual-office', element: ee.jsx(sn, {}) }),
              ee.jsx(va, { path: '/virtual-office/go', element: ee.jsx(cn, {}) }),
            ],
          }),
          ee.jsx(hn, {}),
          ee.jsx(Ja, {}),
          ee.jsx(La, {}),
          ee.jsx(ns, {}),
          ee.jsx(Pa, {}),
          ee.jsx(as, {}),
          ee.jsx(us, {}),
        ],
      })
    );
  };
class mn extends se.Component {
  constructor(e) {
    (super(e),
      (this.handleReset = () => {
        this.setState({ hasError: !1, error: void 0, errorInfo: void 0 });
      }),
      (this.state = { hasError: !1 }));
  }
  static getDerivedStateFromError(e) {
    return { hasError: !0, error: e };
  }
  componentDidCatch(e, t) {
    var a, s;
    (console.error('ErrorBoundary caught an error:', e, t),
      this.setState({ error: e, errorInfo: t }),
      null == (s = (a = this.props).onError) || s.call(a, e, t),
      console.warn('Error logging service not configured'));
  }
  render() {
    return this.state.hasError
      ? this.props.fallback
        ? this.props.fallback
        : ee.jsx('div', {
            className: 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900',
            children: ee.jsxs('div', {
              className:
                'max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center',
              children: [
                ee.jsx('div', {
                  className: 'mb-4',
                  children: ee.jsx('div', {
                    className:
                      'mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center',
                    children: ee.jsx('svg', {
                      className: 'w-8 h-8 text-red-600 dark:text-red-400',
                      fill: 'none',
                      stroke: 'currentColor',
                      viewBox: '0 0 24 24',
                      children: ee.jsx('path', {
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: 2,
                        d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
                      }),
                    }),
                  }),
                }),
                ee.jsx('h1', {
                  className: 'text-xl font-semibold text-gray-900 dark:text-white mb-2',
                  children: 'Oops! Something went wrong',
                }),
                ee.jsx('p', {
                  className: 'text-gray-600 dark:text-gray-400 mb-6',
                  children:
                    "We're sorry, but something unexpected happened. Our team has been notified.",
                }),
                ee.jsxs('div', {
                  className: 'space-y-3',
                  children: [
                    ee.jsx(Es, {
                      onClick: this.handleReset,
                      className: 'w-full',
                      children: 'Try Again',
                    }),
                    ee.jsx(Es, {
                      variant: 'outline',
                      onClick: () => window.location.reload(),
                      className: 'w-full',
                      children: 'Reload Page',
                    }),
                  ],
                }),
                !1,
              ],
            }),
          })
      : this.props.children;
  }
}
const xn = se.createContext(void 0),
  fn = ({ children: e }) => {
    const [t, a] = se.useState(!0),
      [s, n] = se.useState(!1),
      { playSuccess: i } = Ya();
    (se.useEffect(() => {
      t
        ? document.body.classList.add('nexus-god-mode')
        : document.body.classList.remove('nexus-god-mode');
    }, [t]),
      se.useEffect(() => {
        const e = setTimeout(() => {
          i();
        }, 1e3);
        return () => clearTimeout(e);
      }, []));
    const r = () => n(e => !e),
      o = re.useMemo(
        () => ({ godMode: t, setGodMode: a, reduceMotion: s, toggleReduceMotion: r }),
        [t, s]
      );
    return ee.jsx(xn.Provider, { value: o, children: e });
  };
console.warn('[Supabase] ⚠️  Configuration missing. Auth features will be disabled.');
const vn = ['admin@aigestion.net', 'nemisanalex@gmail.com'];
var gn = class {
    constructor() {
      ((this.listeners = new Set()), (this.subscribe = this.subscribe.bind(this)));
    }
    subscribe(e) {
      return (
        this.listeners.add(e),
        this.onSubscribe(),
        () => {
          (this.listeners.delete(e), this.onUnsubscribe());
        }
      );
    }
    hasListeners() {
      return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
  },
  bn = {
    setTimeout: (e, t) => setTimeout(e, t),
    clearTimeout: e => clearTimeout(e),
    setInterval: (e, t) => setInterval(e, t),
    clearInterval: e => clearInterval(e),
  },
  yn = new ((a = class {
    constructor() {
      (X(this, e, bn), X(this, t, !1));
    }
    setTimeoutProvider(t) {
      Y(this, e, t);
    }
    setTimeout(t, a) {
      return K(this, e).setTimeout(t, a);
    }
    clearTimeout(t) {
      K(this, e).clearTimeout(t);
    }
    setInterval(t, a) {
      return K(this, e).setInterval(t, a);
    }
    clearInterval(t) {
      K(this, e).clearInterval(t);
    }
  }),
  (e = new WeakMap()),
  (t = new WeakMap()),
  a)();
var wn = 'undefined' == typeof window || 'Deno' in globalThis;
function jn() {}
function Nn(e, t) {
  return 'function' == typeof e ? e(t) : e;
}
function _n(e, t) {
  const { type: a = 'all', exact: s, fetchStatus: n, predicate: i, queryKey: r, stale: o } = e;
  if (r)
    if (s) {
      if (t.queryHash !== kn(r, t.options)) return !1;
    } else if (!Cn(t.queryKey, r)) return !1;
  if ('all' !== a) {
    const e = t.isActive();
    if ('active' === a && !e) return !1;
    if ('inactive' === a && e) return !1;
  }
  return (
    ('boolean' != typeof o || t.isStale() === o) &&
    (!n || n === t.state.fetchStatus) &&
    !(i && !i(t))
  );
}
function An(e, t) {
  const { exact: a, status: s, predicate: n, mutationKey: i } = e;
  if (i) {
    if (!t.options.mutationKey) return !1;
    if (a) {
      if (Sn(t.options.mutationKey) !== Sn(i)) return !1;
    } else if (!Cn(t.options.mutationKey, i)) return !1;
  }
  return (!s || t.state.status === s) && !(n && !n(t));
}
function kn(e, t) {
  return ((null == t ? void 0 : t.queryKeyHashFn) || Sn)(e);
}
function Sn(e) {
  return JSON.stringify(e, (e, t) =>
    Pn(t)
      ? Object.keys(t)
          .sort()
          .reduce((e, a) => ((e[a] = t[a]), e), {})
      : t
  );
}
function Cn(e, t) {
  return (
    e === t ||
    (typeof e == typeof t &&
      !(!e || !t || 'object' != typeof e || 'object' != typeof t) &&
      Object.keys(t).every(a => Cn(e[a], t[a])))
  );
}
var En = Object.prototype.hasOwnProperty;
function Tn(e, t, a = 0) {
  if (e === t) return e;
  if (a > 500) return t;
  const s = In(e) && In(t);
  if (!(s || (Pn(e) && Pn(t)))) return t;
  const n = (s ? e : Object.keys(e)).length,
    i = s ? t : Object.keys(t),
    r = i.length,
    o = s ? new Array(r) : {};
  let l = 0;
  for (let c = 0; c < r; c++) {
    const r = s ? c : i[c],
      d = e[r],
      u = t[r];
    if (d === u) {
      ((o[r] = d), (s ? c < n : En.call(e, r)) && l++);
      continue;
    }
    if (null === d || null === u || 'object' != typeof d || 'object' != typeof u) {
      o[r] = u;
      continue;
    }
    const h = Tn(d, u, a + 1);
    ((o[r] = h), h === d && l++);
  }
  return n === r && l === n ? e : o;
}
function In(e) {
  return Array.isArray(e) && e.length === Object.keys(e).length;
}
function Pn(e) {
  if (!Mn(e)) return !1;
  const t = e.constructor;
  if (void 0 === t) return !0;
  const a = t.prototype;
  return (
    !!Mn(a) && !!a.hasOwnProperty('isPrototypeOf') && Object.getPrototypeOf(e) === Object.prototype
  );
}
function Mn(e) {
  return '[object Object]' === Object.prototype.toString.call(e);
}
function On(e, t, a) {
  return 'function' == typeof a.structuralSharing
    ? a.structuralSharing(e, t)
    : !1 !== a.structuralSharing
      ? Tn(e, t)
      : t;
}
function Dn(e, t, a = 0) {
  const s = [...e, t];
  return a && s.length > a ? s.slice(1) : s;
}
function Rn(e, t, a = 0) {
  const s = [t, ...e];
  return a && s.length > a ? s.slice(0, -1) : s;
}
var Ln = Symbol();
function zn(e, t) {
  return !e.queryFn && (null == t ? void 0 : t.initialPromise)
    ? () => t.initialPromise
    : e.queryFn && e.queryFn !== Ln
      ? e.queryFn
      : () => Promise.reject(new Error(`Missing queryFn: '${e.queryHash}'`));
}
var Fn = new ((r = class extends gn {
  constructor() {
    (super(),
      X(this, s),
      X(this, n),
      X(this, i),
      Y(this, i, e => {
        if (!wn && window.addEventListener) {
          const t = () => e();
          return (
            window.addEventListener('visibilitychange', t, !1),
            () => {
              window.removeEventListener('visibilitychange', t);
            }
          );
        }
      }));
  }
  onSubscribe() {
    K(this, n) || this.setEventListener(K(this, i));
  }
  onUnsubscribe() {
    var e;
    this.hasListeners() || (null == (e = K(this, n)) || e.call(this), Y(this, n, void 0));
  }
  setEventListener(e) {
    var t;
    (Y(this, i, e),
      null == (t = K(this, n)) || t.call(this),
      Y(
        this,
        n,
        e(e => {
          'boolean' == typeof e ? this.setFocused(e) : this.onFocus();
        })
      ));
  }
  setFocused(e) {
    K(this, s) !== e && (Y(this, s, e), this.onFocus());
  }
  onFocus() {
    const e = this.isFocused();
    this.listeners.forEach(t => {
      t(e);
    });
  }
  isFocused() {
    var e;
    return 'boolean' == typeof K(this, s)
      ? K(this, s)
      : 'hidden' !== (null == (e = globalThis.document) ? void 0 : e.visibilityState);
  }
}),
(s = new WeakMap()),
(n = new WeakMap()),
(i = new WeakMap()),
r)();
var Hn = function (e) {
  setTimeout(e, 0);
};
var qn = (function () {
    let e = [],
      t = 0,
      a = e => {
        e();
      },
      s = e => {
        e();
      },
      n = Hn;
    const i = s => {
      t
        ? e.push(s)
        : n(() => {
            a(s);
          });
    };
    return {
      batch: i => {
        let r;
        t++;
        try {
          r = i();
        } finally {
          (t--,
            t ||
              (() => {
                const t = e;
                ((e = []),
                  t.length &&
                    n(() => {
                      s(() => {
                        t.forEach(e => {
                          a(e);
                        });
                      });
                    }));
              })());
        }
        return r;
      },
      batchCalls:
        e =>
        (...t) => {
          i(() => {
            e(...t);
          });
        },
      schedule: i,
      setNotifyFunction: e => {
        a = e;
      },
      setBatchNotifyFunction: e => {
        s = e;
      },
      setScheduler: e => {
        n = e;
      },
    };
  })(),
  Gn = new ((d = class extends gn {
    constructor() {
      (super(),
        X(this, o, !0),
        X(this, l),
        X(this, c),
        Y(this, c, e => {
          if (!wn && window.addEventListener) {
            const t = () => e(!0),
              a = () => e(!1);
            return (
              window.addEventListener('online', t, !1),
              window.addEventListener('offline', a, !1),
              () => {
                (window.removeEventListener('online', t), window.removeEventListener('offline', a));
              }
            );
          }
        }));
    }
    onSubscribe() {
      K(this, l) || this.setEventListener(K(this, c));
    }
    onUnsubscribe() {
      var e;
      this.hasListeners() || (null == (e = K(this, l)) || e.call(this), Y(this, l, void 0));
    }
    setEventListener(e) {
      var t;
      (Y(this, c, e),
        null == (t = K(this, l)) || t.call(this),
        Y(this, l, e(this.setOnline.bind(this))));
    }
    setOnline(e) {
      K(this, o) !== e &&
        (Y(this, o, e),
        this.listeners.forEach(t => {
          t(e);
        }));
    }
    isOnline() {
      return K(this, o);
    }
  }),
  (o = new WeakMap()),
  (l = new WeakMap()),
  (c = new WeakMap()),
  d)();
function Vn(e) {
  return Math.min(1e3 * 2 ** e, 3e4);
}
function Un(e) {
  return 'online' !== (e ?? 'online') || Gn.isOnline();
}
var Bn = class extends Error {
  constructor(e) {
    (super('CancelledError'),
      (this.revert = null == e ? void 0 : e.revert),
      (this.silent = null == e ? void 0 : e.silent));
  }
};
function Wn(e) {
  let t,
    a = !1,
    s = 0;
  const n = (function () {
      let e, t;
      const a = new Promise((a, s) => {
        ((e = a), (t = s));
      });
      function s(e) {
        (Object.assign(a, e), delete a.resolve, delete a.reject);
      }
      return (
        (a.status = 'pending'),
        a.catch(() => {}),
        (a.resolve = t => {
          (s({ status: 'fulfilled', value: t }), e(t));
        }),
        (a.reject = e => {
          (s({ status: 'rejected', reason: e }), t(e));
        }),
        a
      );
    })(),
    i = () => 'pending' !== n.status,
    r = () => Fn.isFocused() && ('always' === e.networkMode || Gn.isOnline()) && e.canRun(),
    o = () => Un(e.networkMode) && e.canRun(),
    l = e => {
      i() || (null == t || t(), n.resolve(e));
    },
    c = e => {
      i() || (null == t || t(), n.reject(e));
    },
    d = () =>
      new Promise(a => {
        var s;
        ((t = e => {
          (i() || r()) && a(e);
        }),
          null == (s = e.onPause) || s.call(e));
      }).then(() => {
        var a;
        ((t = void 0), i() || null == (a = e.onContinue) || a.call(e));
      }),
    u = () => {
      if (i()) return;
      let t;
      const n = 0 === s ? e.initialPromise : void 0;
      try {
        t = n ?? e.fn();
      } catch (o) {
        t = Promise.reject(o);
      }
      Promise.resolve(t)
        .then(l)
        .catch(t => {
          var n;
          if (i()) return;
          const o = e.retry ?? (wn ? 0 : 3),
            l = e.retryDelay ?? Vn,
            h = 'function' == typeof l ? l(s, t) : l,
            p = !0 === o || ('number' == typeof o && s < o) || ('function' == typeof o && o(s, t));
          var m;
          !a && p
            ? (s++,
              null == (n = e.onFail) || n.call(e, s, t),
              ((m = h),
              new Promise(e => {
                yn.setTimeout(e, m);
              }))
                .then(() => (r() ? void 0 : d()))
                .then(() => {
                  a ? c(t) : u();
                }))
            : c(t);
        });
    };
  return {
    promise: n,
    status: () => n.status,
    cancel: t => {
      var a;
      if (!i()) {
        const s = new Bn(t);
        (c(s), null == (a = e.onCancel) || a.call(e, s));
      }
    },
    continue: () => (null == t || t(), n),
    cancelRetry: () => {
      a = !0;
    },
    continueRetry: () => {
      a = !1;
    },
    canStart: o,
    start: () => (o() ? u() : d().then(u), n),
  };
}
var $n =
    ((h = class {
      constructor() {
        X(this, u);
      }
      destroy() {
        this.clearGcTimeout();
      }
      scheduleGc() {
        var e;
        (this.clearGcTimeout(),
          'number' == typeof (e = this.gcTime) &&
            e >= 0 &&
            e !== 1 / 0 &&
            Y(
              this,
              u,
              yn.setTimeout(() => {
                this.optionalRemove();
              }, this.gcTime)
            ));
      }
      updateGcTime(e) {
        this.gcTime = Math.max(this.gcTime || 0, e ?? (wn ? 1 / 0 : 3e5));
      }
      clearGcTimeout() {
        K(this, u) && (yn.clearTimeout(K(this, u)), Y(this, u, void 0));
      }
    }),
    (u = new WeakMap()),
    h),
  Qn =
    ((j = class extends $n {
      constructor(e) {
        (super(),
          X(this, y),
          X(this, p),
          X(this, m),
          X(this, x),
          X(this, f),
          X(this, v),
          X(this, g),
          X(this, b),
          Y(this, b, !1),
          Y(this, g, e.defaultOptions),
          this.setOptions(e.options),
          (this.observers = []),
          Y(this, f, e.client),
          Y(this, x, K(this, f).getQueryCache()),
          (this.queryKey = e.queryKey),
          (this.queryHash = e.queryHash),
          Y(this, p, Xn(this.options)),
          (this.state = e.state ?? K(this, p)),
          this.scheduleGc());
      }
      get meta() {
        return this.options.meta;
      }
      get promise() {
        var e;
        return null == (e = K(this, v)) ? void 0 : e.promise;
      }
      setOptions(e) {
        if (
          ((this.options = { ...K(this, g), ...e }),
          this.updateGcTime(this.options.gcTime),
          this.state && void 0 === this.state.data)
        ) {
          const e = Xn(this.options);
          void 0 !== e.data && (this.setState(Kn(e.data, e.dataUpdatedAt)), Y(this, p, e));
        }
      }
      optionalRemove() {
        this.observers.length || 'idle' !== this.state.fetchStatus || K(this, x).remove(this);
      }
      setData(e, t) {
        const a = On(this.state.data, e, this.options);
        return (
          J(this, y, w).call(this, {
            data: a,
            type: 'success',
            dataUpdatedAt: null == t ? void 0 : t.updatedAt,
            manual: null == t ? void 0 : t.manual,
          }),
          a
        );
      }
      setState(e, t) {
        J(this, y, w).call(this, { type: 'setState', state: e, setStateOptions: t });
      }
      cancel(e) {
        var t, a;
        const s = null == (t = K(this, v)) ? void 0 : t.promise;
        return (
          null == (a = K(this, v)) || a.cancel(e),
          s ? s.then(jn).catch(jn) : Promise.resolve()
        );
      }
      destroy() {
        (super.destroy(), this.cancel({ silent: !0 }));
      }
      reset() {
        (this.destroy(), this.setState(K(this, p)));
      }
      isActive() {
        return this.observers.some(e => {
          return !1 !== ((t = e.options.enabled), (a = this), 'function' == typeof t ? t(a) : t);
          var t, a;
        });
      }
      isDisabled() {
        return this.getObserversCount() > 0
          ? !this.isActive()
          : this.options.queryFn === Ln ||
              this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
      }
      isStatic() {
        return (
          this.getObserversCount() > 0 &&
          this.observers.some(e => 'static' === Nn(e.options.staleTime, this))
        );
      }
      isStale() {
        return this.getObserversCount() > 0
          ? this.observers.some(e => e.getCurrentResult().isStale)
          : void 0 === this.state.data || this.state.isInvalidated;
      }
      isStaleByTime(e = 0) {
        return (
          void 0 === this.state.data ||
          ('static' !== e &&
            (!!this.state.isInvalidated ||
              !(function (e, t) {
                return Math.max(e + (t || 0) - Date.now(), 0);
              })(this.state.dataUpdatedAt, e)))
        );
      }
      onFocus() {
        var e;
        const t = this.observers.find(e => e.shouldFetchOnWindowFocus());
        (null == t || t.refetch({ cancelRefetch: !1 }), null == (e = K(this, v)) || e.continue());
      }
      onOnline() {
        var e;
        const t = this.observers.find(e => e.shouldFetchOnReconnect());
        (null == t || t.refetch({ cancelRefetch: !1 }), null == (e = K(this, v)) || e.continue());
      }
      addObserver(e) {
        this.observers.includes(e) ||
          (this.observers.push(e),
          this.clearGcTimeout(),
          K(this, x).notify({ type: 'observerAdded', query: this, observer: e }));
      }
      removeObserver(e) {
        this.observers.includes(e) &&
          ((this.observers = this.observers.filter(t => t !== e)),
          this.observers.length ||
            (K(this, v) &&
              (K(this, b) ? K(this, v).cancel({ revert: !0 }) : K(this, v).cancelRetry()),
            this.scheduleGc()),
          K(this, x).notify({ type: 'observerRemoved', query: this, observer: e }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      invalidate() {
        this.state.isInvalidated || J(this, y, w).call(this, { type: 'invalidate' });
      }
      async fetch(e, t) {
        var a, s, n, i, r, o, l, c, d, u, h, p;
        if (
          'idle' !== this.state.fetchStatus &&
          'rejected' !== (null == (a = K(this, v)) ? void 0 : a.status())
        )
          if (void 0 !== this.state.data && (null == t ? void 0 : t.cancelRefetch))
            this.cancel({ silent: !0 });
          else if (K(this, v)) return (K(this, v).continueRetry(), K(this, v).promise);
        if ((e && this.setOptions(e), !this.options.queryFn)) {
          const e = this.observers.find(e => e.options.queryFn);
          e && this.setOptions(e.options);
        }
        const g = new AbortController(),
          j = e => {
            Object.defineProperty(e, 'signal', {
              enumerable: !0,
              get: () => (Y(this, b, !0), g.signal),
            });
          },
          N = () => {
            const e = zn(this.options, t),
              a = (() => {
                const e = { client: K(this, f), queryKey: this.queryKey, meta: this.meta };
                return (j(e), e);
              })();
            return (
              Y(this, b, !1),
              this.options.persister ? this.options.persister(e, a, this) : e(a)
            );
          },
          _ = (() => {
            const e = {
              fetchOptions: t,
              options: this.options,
              queryKey: this.queryKey,
              client: K(this, f),
              state: this.state,
              fetchFn: N,
            };
            return (j(e), e);
          })();
        (null == (s = this.options.behavior) || s.onFetch(_, this),
          Y(this, m, this.state),
          ('idle' !== this.state.fetchStatus &&
            this.state.fetchMeta === (null == (n = _.fetchOptions) ? void 0 : n.meta)) ||
            J(this, y, w).call(this, {
              type: 'fetch',
              meta: null == (i = _.fetchOptions) ? void 0 : i.meta,
            }),
          Y(
            this,
            v,
            Wn({
              initialPromise: null == t ? void 0 : t.initialPromise,
              fn: _.fetchFn,
              onCancel: e => {
                (e instanceof Bn &&
                  e.revert &&
                  this.setState({ ...K(this, m), fetchStatus: 'idle' }),
                  g.abort());
              },
              onFail: (e, t) => {
                J(this, y, w).call(this, { type: 'failed', failureCount: e, error: t });
              },
              onPause: () => {
                J(this, y, w).call(this, { type: 'pause' });
              },
              onContinue: () => {
                J(this, y, w).call(this, { type: 'continue' });
              },
              retry: _.options.retry,
              retryDelay: _.options.retryDelay,
              networkMode: _.options.networkMode,
              canRun: () => !0,
            })
          ));
        try {
          const e = await K(this, v).start();
          if (void 0 === e) throw new Error(`${this.queryHash} data is undefined`);
          return (
            this.setData(e),
            null == (o = (r = K(this, x).config).onSuccess) || o.call(r, e, this),
            null == (c = (l = K(this, x).config).onSettled) || c.call(l, e, this.state.error, this),
            e
          );
        } catch (A) {
          if (A instanceof Bn) {
            if (A.silent) return K(this, v).promise;
            if (A.revert) {
              if (void 0 === this.state.data) throw A;
              return this.state.data;
            }
          }
          throw (
            J(this, y, w).call(this, { type: 'error', error: A }),
            null == (u = (d = K(this, x).config).onError) || u.call(d, A, this),
            null == (p = (h = K(this, x).config).onSettled) || p.call(h, this.state.data, A, this),
            A
          );
        } finally {
          this.scheduleGc();
        }
      }
    }),
    (p = new WeakMap()),
    (m = new WeakMap()),
    (x = new WeakMap()),
    (f = new WeakMap()),
    (v = new WeakMap()),
    (g = new WeakMap()),
    (b = new WeakMap()),
    (y = new WeakSet()),
    (w = function (e) {
      ((this.state = (t => {
        switch (e.type) {
          case 'failed':
            return { ...t, fetchFailureCount: e.failureCount, fetchFailureReason: e.error };
          case 'pause':
            return { ...t, fetchStatus: 'paused' };
          case 'continue':
            return { ...t, fetchStatus: 'fetching' };
          case 'fetch':
            return {
              ...t,
              ...((a = t.data),
              (s = this.options),
              {
                fetchFailureCount: 0,
                fetchFailureReason: null,
                fetchStatus: Un(s.networkMode) ? 'fetching' : 'paused',
                ...(void 0 === a && { error: null, status: 'pending' }),
              }),
              fetchMeta: e.meta ?? null,
            };
          case 'success':
            const n = {
              ...t,
              ...Kn(e.data, e.dataUpdatedAt),
              dataUpdateCount: t.dataUpdateCount + 1,
              ...(!e.manual && {
                fetchStatus: 'idle',
                fetchFailureCount: 0,
                fetchFailureReason: null,
              }),
            };
            return (Y(this, m, e.manual ? n : void 0), n);
          case 'error':
            const i = e.error;
            return {
              ...t,
              error: i,
              errorUpdateCount: t.errorUpdateCount + 1,
              errorUpdatedAt: Date.now(),
              fetchFailureCount: t.fetchFailureCount + 1,
              fetchFailureReason: i,
              fetchStatus: 'idle',
              status: 'error',
              isInvalidated: !0,
            };
          case 'invalidate':
            return { ...t, isInvalidated: !0 };
          case 'setState':
            return { ...t, ...e.state };
        }
        var a, s;
      })(this.state)),
        qn.batch(() => {
          (this.observers.forEach(e => {
            e.onQueryUpdate();
          }),
            K(this, x).notify({ query: this, type: 'updated', action: e }));
        }));
    }),
    j);
function Kn(e, t) {
  return {
    data: e,
    dataUpdatedAt: t ?? Date.now(),
    error: null,
    isInvalidated: !1,
    status: 'success',
  };
}
function Xn(e) {
  const t = 'function' == typeof e.initialData ? e.initialData() : e.initialData,
    a = void 0 !== t,
    s = a
      ? 'function' == typeof e.initialDataUpdatedAt
        ? e.initialDataUpdatedAt()
        : e.initialDataUpdatedAt
      : 0;
  return {
    data: t,
    dataUpdateCount: 0,
    dataUpdatedAt: a ? (s ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: a ? 'success' : 'pending',
    fetchStatus: 'idle',
  };
}
function Yn(e) {
  return {
    onFetch: (t, a) => {
      var s, n, i, r, o;
      const l = t.options,
        c =
          null ==
          (i = null == (n = null == (s = t.fetchOptions) ? void 0 : s.meta) ? void 0 : n.fetchMore)
            ? void 0
            : i.direction,
        d = (null == (r = t.state.data) ? void 0 : r.pages) || [],
        u = (null == (o = t.state.data) ? void 0 : o.pageParams) || [];
      let h = { pages: [], pageParams: [] },
        p = 0;
      const m = async () => {
        let a = !1;
        const s = e => {
            !(function (e, t, a) {
              let s,
                n = !1;
              Object.defineProperty(e, 'signal', {
                enumerable: !0,
                get: () => (
                  s ?? (s = t()),
                  n || ((n = !0), s.aborted ? a() : s.addEventListener('abort', a, { once: !0 })),
                  s
                ),
              });
            })(
              e,
              () => t.signal,
              () => (a = !0)
            );
          },
          n = zn(t.options, t.fetchOptions),
          i = async (e, i, r) => {
            if (a) return Promise.reject();
            if (null == i && e.pages.length) return Promise.resolve(e);
            const o = (() => {
                const e = {
                  client: t.client,
                  queryKey: t.queryKey,
                  pageParam: i,
                  direction: r ? 'backward' : 'forward',
                  meta: t.options.meta,
                };
                return (s(e), e);
              })(),
              l = await n(o),
              { maxPages: c } = t.options,
              d = r ? Rn : Dn;
            return { pages: d(e.pages, l, c), pageParams: d(e.pageParams, i, c) };
          };
        if (c && d.length) {
          const e = 'backward' === c,
            t = { pages: d, pageParams: u },
            a = (e ? Zn : Jn)(l, t);
          h = await i(t, a, e);
        } else {
          const t = e ?? d.length;
          do {
            const e = 0 === p ? (u[0] ?? l.initialPageParam) : Jn(l, h);
            if (p > 0 && null == e) break;
            ((h = await i(h, e)), p++);
          } while (p < t);
        }
        return h;
      };
      t.options.persister
        ? (t.fetchFn = () => {
            var e, s;
            return null == (s = (e = t.options).persister)
              ? void 0
              : s.call(
                  e,
                  m,
                  {
                    client: t.client,
                    queryKey: t.queryKey,
                    meta: t.options.meta,
                    signal: t.signal,
                  },
                  a
                );
          })
        : (t.fetchFn = m);
    },
  };
}
function Jn(e, { pages: t, pageParams: a }) {
  const s = t.length - 1;
  return t.length > 0 ? e.getNextPageParam(t[s], t, a[s], a) : void 0;
}
function Zn(e, { pages: t, pageParams: a }) {
  var s;
  return t.length > 0
    ? null == (s = e.getPreviousPageParam)
      ? void 0
      : s.call(e, t[0], t, a[0], a)
    : void 0;
}
var ei =
  ((E = class extends $n {
    constructor(e) {
      (super(),
        X(this, S),
        X(this, N),
        X(this, _),
        X(this, A),
        X(this, k),
        Y(this, N, e.client),
        (this.mutationId = e.mutationId),
        Y(this, A, e.mutationCache),
        Y(this, _, []),
        (this.state = e.state || {
          context: void 0,
          data: void 0,
          error: null,
          failureCount: 0,
          failureReason: null,
          isPaused: !1,
          status: 'idle',
          variables: void 0,
          submittedAt: 0,
        }),
        this.setOptions(e.options),
        this.scheduleGc());
    }
    setOptions(e) {
      ((this.options = e), this.updateGcTime(this.options.gcTime));
    }
    get meta() {
      return this.options.meta;
    }
    addObserver(e) {
      K(this, _).includes(e) ||
        (K(this, _).push(e),
        this.clearGcTimeout(),
        K(this, A).notify({ type: 'observerAdded', mutation: this, observer: e }));
    }
    removeObserver(e) {
      (Y(
        this,
        _,
        K(this, _).filter(t => t !== e)
      ),
        this.scheduleGc(),
        K(this, A).notify({ type: 'observerRemoved', mutation: this, observer: e }));
    }
    optionalRemove() {
      K(this, _).length ||
        ('pending' === this.state.status ? this.scheduleGc() : K(this, A).remove(this));
    }
    continue() {
      var e;
      return (
        (null == (e = K(this, k)) ? void 0 : e.continue()) ?? this.execute(this.state.variables)
      );
    }
    async execute(e) {
      var t, a, s, n, i, r, o, l, c, d, u, h, p, m, x, f, v, g;
      const b = () => {
          J(this, S, C).call(this, { type: 'continue' });
        },
        y = { client: K(this, N), meta: this.options.meta, mutationKey: this.options.mutationKey };
      Y(
        this,
        k,
        Wn({
          fn: () =>
            this.options.mutationFn
              ? this.options.mutationFn(e, y)
              : Promise.reject(new Error('No mutationFn found')),
          onFail: (e, t) => {
            J(this, S, C).call(this, { type: 'failed', failureCount: e, error: t });
          },
          onPause: () => {
            J(this, S, C).call(this, { type: 'pause' });
          },
          onContinue: b,
          retry: this.options.retry ?? 0,
          retryDelay: this.options.retryDelay,
          networkMode: this.options.networkMode,
          canRun: () => K(this, A).canRun(this),
        })
      );
      const w = 'pending' === this.state.status,
        j = !K(this, k).canStart();
      try {
        if (w) b();
        else {
          (J(this, S, C).call(this, { type: 'pending', variables: e, isPaused: j }),
            K(this, A).config.onMutate && (await K(this, A).config.onMutate(e, this, y)));
          const s = await (null == (a = (t = this.options).onMutate) ? void 0 : a.call(t, e, y));
          s !== this.state.context &&
            J(this, S, C).call(this, { type: 'pending', context: s, variables: e, isPaused: j });
        }
        const u = await K(this, k).start();
        return (
          await (null == (n = (s = K(this, A).config).onSuccess)
            ? void 0
            : n.call(s, u, e, this.state.context, this, y)),
          await (null == (r = (i = this.options).onSuccess)
            ? void 0
            : r.call(i, u, e, this.state.context, y)),
          await (null == (l = (o = K(this, A).config).onSettled)
            ? void 0
            : l.call(o, u, null, this.state.variables, this.state.context, this, y)),
          await (null == (d = (c = this.options).onSettled)
            ? void 0
            : d.call(c, u, null, e, this.state.context, y)),
          J(this, S, C).call(this, { type: 'success', data: u }),
          u
        );
      } catch (_) {
        try {
          await (null == (h = (u = K(this, A).config).onError)
            ? void 0
            : h.call(u, _, e, this.state.context, this, y));
        } catch (pi) {
          Promise.reject(pi);
        }
        try {
          await (null == (m = (p = this.options).onError)
            ? void 0
            : m.call(p, _, e, this.state.context, y));
        } catch (pi) {
          Promise.reject(pi);
        }
        try {
          await (null == (f = (x = K(this, A).config).onSettled)
            ? void 0
            : f.call(x, void 0, _, this.state.variables, this.state.context, this, y));
        } catch (pi) {
          Promise.reject(pi);
        }
        try {
          await (null == (g = (v = this.options).onSettled)
            ? void 0
            : g.call(v, void 0, _, e, this.state.context, y));
        } catch (pi) {
          Promise.reject(pi);
        }
        throw (J(this, S, C).call(this, { type: 'error', error: _ }), _);
      } finally {
        K(this, A).runNext(this);
      }
    }
  }),
  (N = new WeakMap()),
  (_ = new WeakMap()),
  (A = new WeakMap()),
  (k = new WeakMap()),
  (S = new WeakSet()),
  (C = function (e) {
    ((this.state = (t => {
      switch (e.type) {
        case 'failed':
          return { ...t, failureCount: e.failureCount, failureReason: e.error };
        case 'pause':
          return { ...t, isPaused: !0 };
        case 'continue':
          return { ...t, isPaused: !1 };
        case 'pending':
          return {
            ...t,
            context: e.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: e.isPaused,
            status: 'pending',
            variables: e.variables,
            submittedAt: Date.now(),
          };
        case 'success':
          return {
            ...t,
            data: e.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: 'success',
            isPaused: !1,
          };
        case 'error':
          return {
            ...t,
            data: void 0,
            error: e.error,
            failureCount: t.failureCount + 1,
            failureReason: e.error,
            isPaused: !1,
            status: 'error',
          };
      }
    })(this.state)),
      qn.batch(() => {
        (K(this, _).forEach(t => {
          t.onMutationUpdate(e);
        }),
          K(this, A).notify({ mutation: this, type: 'updated', action: e }));
      }));
  }),
  E);
var ti =
  ((M = class extends gn {
    constructor(e = {}) {
      (super(),
        X(this, T),
        X(this, I),
        X(this, P),
        (this.config = e),
        Y(this, T, new Set()),
        Y(this, I, new Map()),
        Y(this, P, 0));
    }
    build(e, t, a) {
      const s = new ei({
        client: e,
        mutationCache: this,
        mutationId: ++Z(this, P)._,
        options: e.defaultMutationOptions(t),
        state: a,
      });
      return (this.add(s), s);
    }
    add(e) {
      K(this, T).add(e);
      const t = ai(e);
      if ('string' == typeof t) {
        const a = K(this, I).get(t);
        a ? a.push(e) : K(this, I).set(t, [e]);
      }
      this.notify({ type: 'added', mutation: e });
    }
    remove(e) {
      if (K(this, T).delete(e)) {
        const t = ai(e);
        if ('string' == typeof t) {
          const a = K(this, I).get(t);
          if (a)
            if (a.length > 1) {
              const t = a.indexOf(e);
              -1 !== t && a.splice(t, 1);
            } else a[0] === e && K(this, I).delete(t);
        }
      }
      this.notify({ type: 'removed', mutation: e });
    }
    canRun(e) {
      const t = ai(e);
      if ('string' == typeof t) {
        const a = K(this, I).get(t),
          s = null == a ? void 0 : a.find(e => 'pending' === e.state.status);
        return !s || s === e;
      }
      return !0;
    }
    runNext(e) {
      var t;
      const a = ai(e);
      if ('string' == typeof a) {
        const s =
          null == (t = K(this, I).get(a)) ? void 0 : t.find(t => t !== e && t.state.isPaused);
        return (null == s ? void 0 : s.continue()) ?? Promise.resolve();
      }
      return Promise.resolve();
    }
    clear() {
      qn.batch(() => {
        (K(this, T).forEach(e => {
          this.notify({ type: 'removed', mutation: e });
        }),
          K(this, T).clear(),
          K(this, I).clear());
      });
    }
    getAll() {
      return Array.from(K(this, T));
    }
    find(e) {
      const t = { exact: !0, ...e };
      return this.getAll().find(e => An(t, e));
    }
    findAll(e = {}) {
      return this.getAll().filter(t => An(e, t));
    }
    notify(e) {
      qn.batch(() => {
        this.listeners.forEach(t => {
          t(e);
        });
      });
    }
    resumePausedMutations() {
      const e = this.getAll().filter(e => e.state.isPaused);
      return qn.batch(() => Promise.all(e.map(e => e.continue().catch(jn))));
    }
  }),
  (T = new WeakMap()),
  (I = new WeakMap()),
  (P = new WeakMap()),
  M);
function ai(e) {
  var t;
  return null == (t = e.options.scope) ? void 0 : t.id;
}
var si =
    ((D = class extends gn {
      constructor(e = {}) {
        (super(), X(this, O), (this.config = e), Y(this, O, new Map()));
      }
      build(e, t, a) {
        const s = t.queryKey,
          n = t.queryHash ?? kn(s, t);
        let i = this.get(n);
        return (
          i ||
            ((i = new Qn({
              client: e,
              queryKey: s,
              queryHash: n,
              options: e.defaultQueryOptions(t),
              state: a,
              defaultOptions: e.getQueryDefaults(s),
            })),
            this.add(i)),
          i
        );
      }
      add(e) {
        K(this, O).has(e.queryHash) ||
          (K(this, O).set(e.queryHash, e), this.notify({ type: 'added', query: e }));
      }
      remove(e) {
        const t = K(this, O).get(e.queryHash);
        t &&
          (e.destroy(),
          t === e && K(this, O).delete(e.queryHash),
          this.notify({ type: 'removed', query: e }));
      }
      clear() {
        qn.batch(() => {
          this.getAll().forEach(e => {
            this.remove(e);
          });
        });
      }
      get(e) {
        return K(this, O).get(e);
      }
      getAll() {
        return [...K(this, O).values()];
      }
      find(e) {
        const t = { exact: !0, ...e };
        return this.getAll().find(e => _n(t, e));
      }
      findAll(e = {}) {
        const t = this.getAll();
        return Object.keys(e).length > 0 ? t.filter(t => _n(e, t)) : t;
      }
      notify(e) {
        qn.batch(() => {
          this.listeners.forEach(t => {
            t(e);
          });
        });
      }
      onFocus() {
        qn.batch(() => {
          this.getAll().forEach(e => {
            e.onFocus();
          });
        });
      }
      onOnline() {
        qn.batch(() => {
          this.getAll().forEach(e => {
            e.onOnline();
          });
        });
      }
    }),
    (O = new WeakMap()),
    D),
  ni =
    ((U = class {
      constructor(e = {}) {
        (X(this, R),
          X(this, L),
          X(this, z),
          X(this, F),
          X(this, H),
          X(this, q),
          X(this, G),
          X(this, V),
          Y(this, R, e.queryCache || new si()),
          Y(this, L, e.mutationCache || new ti()),
          Y(this, z, e.defaultOptions || {}),
          Y(this, F, new Map()),
          Y(this, H, new Map()),
          Y(this, q, 0));
      }
      mount() {
        (Z(this, q)._++,
          1 === K(this, q) &&
            (Y(
              this,
              G,
              Fn.subscribe(async e => {
                e && (await this.resumePausedMutations(), K(this, R).onFocus());
              })
            ),
            Y(
              this,
              V,
              Gn.subscribe(async e => {
                e && (await this.resumePausedMutations(), K(this, R).onOnline());
              })
            )));
      }
      unmount() {
        var e, t;
        (Z(this, q)._--,
          0 === K(this, q) &&
            (null == (e = K(this, G)) || e.call(this),
            Y(this, G, void 0),
            null == (t = K(this, V)) || t.call(this),
            Y(this, V, void 0)));
      }
      isFetching(e) {
        return K(this, R).findAll({ ...e, fetchStatus: 'fetching' }).length;
      }
      isMutating(e) {
        return K(this, L).findAll({ ...e, status: 'pending' }).length;
      }
      getQueryData(e) {
        var t;
        const a = this.defaultQueryOptions({ queryKey: e });
        return null == (t = K(this, R).get(a.queryHash)) ? void 0 : t.state.data;
      }
      ensureQueryData(e) {
        const t = this.defaultQueryOptions(e),
          a = K(this, R).build(this, t),
          s = a.state.data;
        return void 0 === s
          ? this.fetchQuery(e)
          : (e.revalidateIfStale && a.isStaleByTime(Nn(t.staleTime, a)) && this.prefetchQuery(t),
            Promise.resolve(s));
      }
      getQueriesData(e) {
        return K(this, R)
          .findAll(e)
          .map(({ queryKey: e, state: t }) => [e, t.data]);
      }
      setQueryData(e, t, a) {
        const s = this.defaultQueryOptions({ queryKey: e }),
          n = K(this, R).get(s.queryHash),
          i = (function (e, t) {
            return 'function' == typeof e ? e(t) : e;
          })(t, null == n ? void 0 : n.state.data);
        if (void 0 !== i)
          return K(this, R)
            .build(this, s)
            .setData(i, { ...a, manual: !0 });
      }
      setQueriesData(e, t, a) {
        return qn.batch(() =>
          K(this, R)
            .findAll(e)
            .map(({ queryKey: e }) => [e, this.setQueryData(e, t, a)])
        );
      }
      getQueryState(e) {
        var t;
        const a = this.defaultQueryOptions({ queryKey: e });
        return null == (t = K(this, R).get(a.queryHash)) ? void 0 : t.state;
      }
      removeQueries(e) {
        const t = K(this, R);
        qn.batch(() => {
          t.findAll(e).forEach(e => {
            t.remove(e);
          });
        });
      }
      resetQueries(e, t) {
        const a = K(this, R);
        return qn.batch(
          () => (
            a.findAll(e).forEach(e => {
              e.reset();
            }),
            this.refetchQueries({ type: 'active', ...e }, t)
          )
        );
      }
      cancelQueries(e, t = {}) {
        const a = { revert: !0, ...t },
          s = qn.batch(() =>
            K(this, R)
              .findAll(e)
              .map(e => e.cancel(a))
          );
        return Promise.all(s).then(jn).catch(jn);
      }
      invalidateQueries(e, t = {}) {
        return qn.batch(
          () => (
            K(this, R)
              .findAll(e)
              .forEach(e => {
                e.invalidate();
              }),
            'none' === (null == e ? void 0 : e.refetchType)
              ? Promise.resolve()
              : this.refetchQueries(
                  {
                    ...e,
                    type:
                      (null == e ? void 0 : e.refetchType) ??
                      (null == e ? void 0 : e.type) ??
                      'active',
                  },
                  t
                )
          )
        );
      }
      refetchQueries(e, t = {}) {
        const a = { ...t, cancelRefetch: t.cancelRefetch ?? !0 },
          s = qn.batch(() =>
            K(this, R)
              .findAll(e)
              .filter(e => !e.isDisabled() && !e.isStatic())
              .map(e => {
                let t = e.fetch(void 0, a);
                return (
                  a.throwOnError || (t = t.catch(jn)),
                  'paused' === e.state.fetchStatus ? Promise.resolve() : t
                );
              })
          );
        return Promise.all(s).then(jn);
      }
      fetchQuery(e) {
        const t = this.defaultQueryOptions(e);
        void 0 === t.retry && (t.retry = !1);
        const a = K(this, R).build(this, t);
        return a.isStaleByTime(Nn(t.staleTime, a)) ? a.fetch(t) : Promise.resolve(a.state.data);
      }
      prefetchQuery(e) {
        return this.fetchQuery(e).then(jn).catch(jn);
      }
      fetchInfiniteQuery(e) {
        return ((e.behavior = Yn(e.pages)), this.fetchQuery(e));
      }
      prefetchInfiniteQuery(e) {
        return this.fetchInfiniteQuery(e).then(jn).catch(jn);
      }
      ensureInfiniteQueryData(e) {
        return ((e.behavior = Yn(e.pages)), this.ensureQueryData(e));
      }
      resumePausedMutations() {
        return Gn.isOnline() ? K(this, L).resumePausedMutations() : Promise.resolve();
      }
      getQueryCache() {
        return K(this, R);
      }
      getMutationCache() {
        return K(this, L);
      }
      getDefaultOptions() {
        return K(this, z);
      }
      setDefaultOptions(e) {
        Y(this, z, e);
      }
      setQueryDefaults(e, t) {
        K(this, F).set(Sn(e), { queryKey: e, defaultOptions: t });
      }
      getQueryDefaults(e) {
        const t = [...K(this, F).values()],
          a = {};
        return (
          t.forEach(t => {
            Cn(e, t.queryKey) && Object.assign(a, t.defaultOptions);
          }),
          a
        );
      }
      setMutationDefaults(e, t) {
        K(this, H).set(Sn(e), { mutationKey: e, defaultOptions: t });
      }
      getMutationDefaults(e) {
        const t = [...K(this, H).values()],
          a = {};
        return (
          t.forEach(t => {
            Cn(e, t.mutationKey) && Object.assign(a, t.defaultOptions);
          }),
          a
        );
      }
      defaultQueryOptions(e) {
        if (e._defaulted) return e;
        const t = {
          ...K(this, z).queries,
          ...this.getQueryDefaults(e.queryKey),
          ...e,
          _defaulted: !0,
        };
        return (
          t.queryHash || (t.queryHash = kn(t.queryKey, t)),
          void 0 === t.refetchOnReconnect && (t.refetchOnReconnect = 'always' !== t.networkMode),
          void 0 === t.throwOnError && (t.throwOnError = !!t.suspense),
          !t.networkMode && t.persister && (t.networkMode = 'offlineFirst'),
          t.queryFn === Ln && (t.enabled = !1),
          t
        );
      }
      defaultMutationOptions(e) {
        return (null == e ? void 0 : e._defaulted)
          ? e
          : {
              ...K(this, z).mutations,
              ...((null == e ? void 0 : e.mutationKey) && this.getMutationDefaults(e.mutationKey)),
              ...e,
              _defaulted: !0,
            };
      }
      clear() {
        (K(this, R).clear(), K(this, L).clear());
      }
    }),
    (R = new WeakMap()),
    (L = new WeakMap()),
    (z = new WeakMap()),
    (F = new WeakMap()),
    (H = new WeakMap()),
    (q = new WeakMap()),
    (G = new WeakMap()),
    (V = new WeakMap()),
    U),
  ii = se.createContext(void 0),
  ri = ({ client: e, children: t }) => (
    se.useEffect(
      () => (
        e.mount(),
        () => {
          e.unmount();
        }
      ),
      [e]
    ),
    ee.jsx(ii.Provider, { value: e, children: t })
  );
function oi({ children: e }) {
  const [t] = se.useState(
    () =>
      new ni({
        defaultOptions: {
          queries: {
            staleTime: 3e5,
            retry: (e, t) => {
              if (t && 'object' == typeof t && 'status' in t) {
                const e = t.status;
                if (e >= 400 && e < 500) return !1;
              }
              return e < 3;
            },
            refetchOnWindowFocus: !1,
            refetchOnReconnect: !0,
          },
          mutations: { retry: 1 },
        },
      })
  );
  return ee.jsx(ri, { client: t, children: e });
}
function li() {
  const {
    loading: e,
    isAuthenticated: t,
    user: a,
    login: s,
    logout: n,
  } = (function () {
    const [e, t] = se.useState({
        session: null,
        user: null,
        loading: !0,
        isAuthenticated: !1,
        isAdmin: !1,
        isMobileApp: !1,
      }),
      a = se.useCallback(
        () =>
          'localhost' === window.location.hostname ||
          window.location.protocol.includes('capacitor') ||
          'file:' === window.location.protocol ||
          '' === window.location.port,
        []
      ),
      s = se.useCallback(e => {
        const t = e.user_metadata || {};
        return {
          email: e.email,
          name: t.name || e.email.split('@')[0],
          subscription: t.subscription || 'free',
          role: t.role || 'client',
          avatar: t.avatar,
        };
      }, []),
      n = se.useCallback(
        e => {
          const t = vn.includes(e.email) || 'admin' === e.role,
            s = a();
          return !(!t || s || ((window.location.href = 'https://admin.aigestion.net'), 0));
        },
        [a]
      ),
      i = se.useCallback(
        async e => {
          t(e => ({ ...e, loading: !0 }));
          try {
            if (null == e ? void 0 : e.user) {
              const i = s(e.user);
              if (n(i)) return;
              t({
                session: e,
                user: i,
                loading: !1,
                isAuthenticated: !0,
                isAdmin: vn.includes(i.email) || 'admin' === i.role,
                isMobileApp: a(),
              });
            } else
              t({
                session: null,
                user: null,
                loading: !1,
                isAuthenticated: !1,
                isAdmin: !1,
                isMobileApp: a(),
              });
          } catch (i) {
            (console.error('Session handling error:', i),
              t(e => ({ ...e, loading: !1, isAuthenticated: !1, user: null, session: null })));
          }
        },
        [s, n, a]
      ),
      r = se.useCallback(
        async (e, a) => (
          t(e => ({ ...e, loading: !0 })),
          console.warn('Supabase not configured. Login simulation.'),
          void setTimeout(() => {
            t(t => ({
              ...t,
              loading: !1,
              isAuthenticated: !0,
              user: { email: e, name: e.split('@')[0], subscription: 'free', role: 'client' },
              session: {},
            }));
          }, 1e3)
        ),
        [i]
      ),
      o = se.useCallback(async () => {
        (t(e => ({ ...e, loading: !0 })),
          t({
            session: null,
            user: null,
            loading: !1,
            isAuthenticated: !1,
            isAdmin: !1,
            isMobileApp: a(),
          }));
      }, [i, a]),
      l = se.useCallback(async () => {}, [i]),
      c = se.useCallback(
        async t => {
          if (!e.user || !e.session) throw new Error('No authenticated user');
          console.warn('Supabase not configured. User update simulated.');
        },
        [e.user, e.session, l]
      );
    return (
      se.useEffect(
        () => (
          console.warn('Supabase not configured; using demo mode'),
          void t(e => ({ ...e, loading: !1 }))
        ),
        [i]
      ),
      { ...e, login: r, logout: o, refreshSession: l, updateUser: c }
    );
  })();
  return e
    ? ee.jsx(un, {})
    : ee.jsx(mn, {
        children: ee.jsx(oi, {
          children: ee.jsx(_a, {
            children: ee.jsx(qa, {
              children: ee.jsx(fn, {
                children: ee.jsx(Ys, {
                  children: ee.jsx(pn, {
                    loading: e,
                    isAuthenticated: t,
                    currentUser: a,
                    handleLogin: s,
                    handleLogout: n,
                  }),
                }),
              }),
            }),
          }),
        }),
      });
}
const ci = se.createContext(void 0),
  di = ({ children: e }) => {
    const [t, a] = se.useState(!1),
      [s, n] = se.useState(null),
      i = { isLoading: t, setIsLoading: a, error: s, setError: n };
    return ee.jsx(ci.Provider, { value: i, children: e });
  },
  ui = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  hi = document.getElementById('root');
if (hi)
  try {
    (ae
      .createRoot(hi)
      .render(ee.jsx(re.StrictMode, { children: ee.jsx(di, { children: ee.jsx(li, {}) }) })),
      ui && console.log('📱 Mobile device detected - App loaded successfully'));
  } catch (mi) {
    (console.error('❌ Failed to render React app:', mi),
      ui &&
        (hi.innerHTML =
          '\n        <div style="padding: 20px; text-align: center; color: white; font-family: system-ui;">\n          <h2>🌌 AIGestion / NEXUS V1</h2>\n          <p>Cargando aplicación optimizada para móvil...</p>\n          <button onclick="window.location.reload()" style="\n            background: #7c3aed;\n            color: white;\n            border: none;\n            padding: 10px 20px;\n            border-radius: 5px;\n            margin-top: 10px;\n          ">Recargar</button>\n        </div>\n      '));
  }
else console.error('Root element not found!');
export { Ra as u };
