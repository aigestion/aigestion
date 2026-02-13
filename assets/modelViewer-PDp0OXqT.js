var e;
import {
  A as t,
  a as i,
  R as s,
  C as n,
  L as a,
  N as r,
  b as o,
  c as A,
  F as l,
  S as c,
  d as h,
  B as d,
  e as g,
  I as u,
  f as p,
  g as m,
  h as b,
  T as f,
  i as I,
  k as C,
  l as E,
  M as B,
  V as y,
  m as w,
  P as Q,
  D as v,
  n as x,
  o as S,
  p as R,
  Q as M,
  q as T,
  O as D,
  r as k,
  s as F,
  t as L,
  u as U,
  v as G,
  w as _,
  x as P,
  y as N,
  z as O,
  E as H,
  G as q,
  H as j,
  J as z,
  K,
  U as V,
  W as J,
  X as Y,
  Y as W,
  Z as $,
  _ as X,
  $ as Z,
  a0 as ee,
  a1 as te,
  a2 as ie,
  a3 as se,
  a4 as ne,
  a5 as ae,
  a6 as re,
  a7 as oe,
  a8 as Ae,
  a9 as le,
  aa as ce,
  ab as he,
  ac as de,
  ad as ge,
  ae as ue,
  af as pe,
  ag as me,
  ah as be,
  ai as fe,
  aj as Ie,
  ak as Ce,
  al as Ee,
  am as Be,
  an as ye,
  ao as we,
  ap as Qe,
  aq as ve,
  ar as xe,
  as as Se,
  at as Re,
  au as Me,
  av as Te,
  aw as De,
  ax as ke,
  ay as Fe,
  az as Le,
  aA as Ue,
  aB as Ge,
  aC as _e,
  aD as Pe,
  aE as Ne,
  aF as Oe,
  aG as He,
  aH as qe,
  aI as je,
  aJ as ze,
  aK as Ke,
  aL as Ve,
  aM as Je,
  aN as Ye,
  aO as We,
  aP as $e,
  aQ as Xe,
  aR as Ze,
  aS as et,
  aT as tt,
  aU as it,
  aV as st,
  aW as nt,
  aX as at,
  aY as rt,
  aZ as ot,
  a_ as At,
  a$ as lt,
  b0 as ct,
  b1 as ht,
  b2 as dt,
  b3 as gt,
  b4 as ut,
  b5 as pt,
  b6 as mt,
  b7 as bt,
  b8 as ft,
  b9 as It,
  ba as Ct,
  bb as Et,
  bc as Bt,
  bd as yt,
  be as wt,
  bf as Qt,
  bg as vt,
  bh as xt,
  bi as St,
  bj as Rt,
  bk as Mt,
  bl as Tt,
  bm as Dt,
  bn as kt,
  bo as Ft,
  bp as Lt,
} from './three-D1bd0fYo.js';
const Ut = globalThis,
  Gt =
    Ut.ShadowRoot &&
    (void 0 === Ut.ShadyCSS || Ut.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype,
  _t = Symbol(),
  Pt = new WeakMap();
let Nt = class {
  constructor(e, t, i) {
    if (((this._$cssResult$ = !0), i !== _t))
      throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    ((this.cssText = e), (this.t = t));
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Gt && void 0 === e) {
      const i = void 0 !== t && 1 === t.length;
      (i && (e = Pt.get(t)),
        void 0 === e &&
          ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Pt.set(t, e)));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ot = Gt
    ? e => e
    : e =>
        e instanceof CSSStyleSheet
          ? (e => {
              let t = '';
              for (const i of e.cssRules) t += i.cssText;
              return (e => new Nt('string' == typeof e ? e : e + '', void 0, _t))(t);
            })(e)
          : e,
  {
    is: Ht,
    defineProperty: qt,
    getOwnPropertyDescriptor: jt,
    getOwnPropertyNames: zt,
    getOwnPropertySymbols: Kt,
    getPrototypeOf: Vt,
  } = Object,
  Jt = globalThis,
  Yt = Jt.trustedTypes,
  Wt = Yt ? Yt.emptyScript : '',
  $t = Jt.reactiveElementPolyfillSupport,
  Xt = (e, t) => e,
  Zt = {
    toAttribute(e, t) {
      switch (t) {
        case Boolean:
          e = e ? Wt : null;
          break;
        case Object:
        case Array:
          e = null == e ? e : JSON.stringify(e);
      }
      return e;
    },
    fromAttribute(e, t) {
      let i = e;
      switch (t) {
        case Boolean:
          i = null !== e;
          break;
        case Number:
          i = null === e ? null : Number(e);
          break;
        case Object:
        case Array:
          try {
            i = JSON.parse(e);
          } catch (s) {
            i = null;
          }
      }
      return i;
    },
  },
  ei = (e, t) => !Ht(e, t),
  ti = { attribute: !0, type: String, converter: Zt, reflect: !1, useDefault: !1, hasChanged: ei };
(Symbol.metadata ?? (Symbol.metadata = Symbol('metadata')),
  Jt.litPropertyMetadata ?? (Jt.litPropertyMetadata = new WeakMap()));
let ii = class extends HTMLElement {
  static addInitializer(e) {
    (this._$Ei(), (this.l ?? (this.l = [])).push(e));
  }
  static get observedAttributes() {
    return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
  }
  static createProperty(e, t = ti) {
    if (
      (t.state && (t.attribute = !1),
      this._$Ei(),
      this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0),
      this.elementProperties.set(e, t),
      !t.noAccessor)
    ) {
      const i = Symbol(),
        s = this.getPropertyDescriptor(e, i, t);
      void 0 !== s && qt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: n } = jt(this.prototype, e) ?? {
      get() {
        return this[t];
      },
      set(e) {
        this[t] = e;
      },
    };
    return {
      get: s,
      set(t) {
        const a = null == s ? void 0 : s.call(this);
        (null == n || n.call(this, t), this.requestUpdate(e, a, i));
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ti;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Xt('elementProperties'))) return;
    const e = Vt(this);
    (e.finalize(),
      void 0 !== e.l && (this.l = [...e.l]),
      (this.elementProperties = new Map(e.elementProperties)));
  }
  static finalize() {
    if (this.hasOwnProperty(Xt('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(Xt('properties')))) {
      const e = this.properties,
        t = [...zt(e), ...Kt(e)];
      for (const i of t) this.createProperty(i, e[i]);
    }
    const e = this[Symbol.metadata];
    if (null !== e) {
      const t = litPropertyMetadata.get(e);
      if (void 0 !== t) for (const [e, i] of t) this.elementProperties.set(e, i);
    }
    this._$Eh = new Map();
    for (const [t, i] of this.elementProperties) {
      const e = this._$Eu(t, i);
      void 0 !== e && this._$Eh.set(e, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const e of i) t.unshift(Ot(e));
    } else void 0 !== e && t.push(Ot(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return !1 === i
      ? void 0
      : 'string' == typeof i
        ? i
        : 'string' == typeof e
          ? e.toLowerCase()
          : void 0;
  }
  constructor() {
    (super(),
      (this._$Ep = void 0),
      (this.isUpdatePending = !1),
      (this.hasUpdated = !1),
      (this._$Em = null),
      this._$Ev());
  }
  _$Ev() {
    var e;
    ((this._$ES = new Promise(e => (this.enableUpdating = e))),
      (this._$AL = new Map()),
      this._$E_(),
      this.requestUpdate(),
      null == (e = this.constructor.l) || e.forEach(e => e(this)));
  }
  addController(e) {
    var t;
    ((this._$EO ?? (this._$EO = new Set())).add(e),
      void 0 !== this.renderRoot &&
        this.isConnected &&
        (null == (t = e.hostConnected) || t.call(e)));
  }
  removeController(e) {
    var t;
    null == (t = this._$EO) || t.delete(e);
  }
  _$E_() {
    const e = new Map(),
      t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return (
      ((e, t) => {
        if (Gt) e.adoptedStyleSheets = t.map(e => (e instanceof CSSStyleSheet ? e : e.styleSheet));
        else
          for (const i of t) {
            const t = document.createElement('style'),
              s = Ut.litNonce;
            (void 0 !== s && t.setAttribute('nonce', s),
              (t.textContent = i.cssText),
              e.appendChild(t));
          }
      })(e, this.constructor.elementStyles),
      e
    );
  }
  connectedCallback() {
    var e;
    (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()),
      this.enableUpdating(!0),
      null == (e = this._$EO) ||
        e.forEach(e => {
          var t;
          return null == (t = e.hostConnected) ? void 0 : t.call(e);
        }));
  }
  enableUpdating(e) {}
  disconnectedCallback() {
    var e;
    null == (e = this._$EO) ||
      e.forEach(e => {
        var t;
        return null == (t = e.hostDisconnected) ? void 0 : t.call(e);
      });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var i;
    const s = this.constructor.elementProperties.get(e),
      n = this.constructor._$Eu(e, s);
    if (void 0 !== n && !0 === s.reflect) {
      const a = (
        void 0 !== (null == (i = s.converter) ? void 0 : i.toAttribute) ? s.converter : Zt
      ).toAttribute(t, s.type);
      ((this._$Em = e),
        null == a ? this.removeAttribute(n) : this.setAttribute(n, a),
        (this._$Em = null));
    }
  }
  _$AK(e, t) {
    var i, s;
    const n = this.constructor,
      a = n._$Eh.get(e);
    if (void 0 !== a && this._$Em !== a) {
      const e = n.getPropertyOptions(a),
        r =
          'function' == typeof e.converter
            ? { fromAttribute: e.converter }
            : void 0 !== (null == (i = e.converter) ? void 0 : i.fromAttribute)
              ? e.converter
              : Zt;
      this._$Em = a;
      const o = r.fromAttribute(t, e.type);
      ((this[a] = o ?? (null == (s = this._$Ej) ? void 0 : s.get(a)) ?? o), (this._$Em = null));
    }
  }
  requestUpdate(e, t, i, s = !1, n) {
    var a;
    if (void 0 !== e) {
      const r = this.constructor;
      if (
        (!1 === s && (n = this[e]),
        i ?? (i = r.getPropertyOptions(e)),
        !(
          (i.hasChanged ?? ei)(n, t) ||
          (i.useDefault &&
            i.reflect &&
            n === (null == (a = this._$Ej) ? void 0 : a.get(e)) &&
            !this.hasAttribute(r._$Eu(e, i)))
        ))
      )
        return;
      this.C(e, t, i);
    }
    !1 === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: s, wrapped: n }, a) {
    (i &&
      !(this._$Ej ?? (this._$Ej = new Map())).has(e) &&
      (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== n || void 0 !== a)) ||
      (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)),
      !0 === s && this._$Em !== e && (this._$Eq ?? (this._$Eq = new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return (null != e && (await e), !this.isUpdatePending);
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var e;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if ((this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep)) {
        for (const [e, t] of this._$Ep) this[e] = t;
        this._$Ep = void 0;
      }
      const e = this.constructor.elementProperties;
      if (e.size > 0)
        for (const [t, i] of e) {
          const { wrapped: e } = i,
            s = this[t];
          !0 !== e || this._$AL.has(t) || void 0 === s || this.C(t, void 0, i, s);
        }
    }
    let t = !1;
    const i = this._$AL;
    try {
      ((t = this.shouldUpdate(i)),
        t
          ? (this.willUpdate(i),
            null == (e = this._$EO) ||
              e.forEach(e => {
                var t;
                return null == (t = e.hostUpdate) ? void 0 : t.call(e);
              }),
            this.update(i))
          : this._$EM());
    } catch (s) {
      throw ((t = !1), this._$EM(), s);
    }
    t && this._$AE(i);
  }
  willUpdate(e) {}
  _$AE(e) {
    var t;
    (null == (t = this._$EO) ||
      t.forEach(e => {
        var t;
        return null == (t = e.hostUpdated) ? void 0 : t.call(e);
      }),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(e)),
      this.updated(e));
  }
  _$EM() {
    ((this._$AL = new Map()), (this.isUpdatePending = !1));
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    (this._$Eq && (this._$Eq = this._$Eq.forEach(e => this._$ET(e, this[e]))), this._$EM());
  }
  updated(e) {}
  firstUpdated(e) {}
};
((ii.elementStyles = []),
  (ii.shadowRootOptions = { mode: 'open' }),
  (ii[Xt('elementProperties')] = new Map()),
  (ii[Xt('finalized')] = new Map()),
  null == $t || $t({ ReactiveElement: ii }),
  (Jt.reactiveElementVersions ?? (Jt.reactiveElementVersions = [])).push('2.1.2'));
const si = { attribute: !0, type: String, converter: Zt, reflect: !1, hasChanged: ei },
  ni = (e = si, t, i) => {
    const { kind: s, metadata: n } = i;
    let a = globalThis.litPropertyMetadata.get(n);
    if (
      (void 0 === a && globalThis.litPropertyMetadata.set(n, (a = new Map())),
      'setter' === s && ((e = Object.create(e)).wrapped = !0),
      a.set(i.name, e),
      'accessor' === s)
    ) {
      const { name: s } = i;
      return {
        set(i) {
          const n = t.get.call(this);
          (t.set.call(this, i), this.requestUpdate(s, n, e, !0, i));
        },
        init(t) {
          return (void 0 !== t && this.C(s, void 0, e, t), t);
        },
      };
    }
    if ('setter' === s) {
      const { name: s } = i;
      return function (i) {
        const n = this[s];
        (t.call(this, i), this.requestUpdate(s, n, e, !0, i));
      };
    }
    throw Error('Unsupported decorator location: ' + s);
  };
function ai(e) {
  return (t, i) =>
    'object' == typeof i
      ? ni(e, t, i)
      : ((e, t, i) => {
          const s = t.hasOwnProperty(i);
          return (
            t.constructor.createProperty(i, e),
            s ? Object.getOwnPropertyDescriptor(t, i) : void 0
          );
        })(e, t, i);
}
const ri = globalThis,
  oi = e => e,
  Ai = ri.trustedTypes,
  li = Ai ? Ai.createPolicy('lit-html', { createHTML: e => e }) : void 0,
  ci = '$lit$',
  hi = `lit$${Math.random().toFixed(9).slice(2)}$`,
  di = '?' + hi,
  gi = `<${di}>`,
  ui = document,
  pi = () => ui.createComment(''),
  mi = e => null === e || ('object' != typeof e && 'function' != typeof e),
  bi = Array.isArray,
  fi = '[ \t\n\f\r]',
  Ii = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Ci = /-->/g,
  Ei = />/g,
  Bi = RegExp(`>|${fi}(?:([^\\s"'>=/]+)(${fi}*=${fi}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, 'g'),
  yi = /'/g,
  wi = /"/g,
  Qi = /^(?:script|style|textarea|title)$/i,
  vi = ((Ti = 1), (e, ...t) => ({ _$litType$: Ti, strings: e, values: t })),
  xi = Symbol.for('lit-noChange'),
  Si = Symbol.for('lit-nothing'),
  Ri = new WeakMap(),
  Mi = ui.createTreeWalker(ui, 129);
var Ti;
function Di(e, t) {
  if (!bi(e) || !e.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return void 0 !== li ? li.createHTML(t) : t;
}
let ki = class e {
  constructor({ strings: t, _$litType$: i }, s) {
    let n;
    this.parts = [];
    let a = 0,
      r = 0;
    const o = t.length - 1,
      A = this.parts,
      [l, c] = ((e, t) => {
        const i = e.length - 1,
          s = [];
        let n,
          a = 2 === t ? '<svg>' : 3 === t ? '<math>' : '',
          r = Ii;
        for (let o = 0; o < i; o++) {
          const t = e[o];
          let i,
            A,
            l = -1,
            c = 0;
          for (; c < t.length && ((r.lastIndex = c), (A = r.exec(t)), null !== A); )
            ((c = r.lastIndex),
              r === Ii
                ? '!--' === A[1]
                  ? (r = Ci)
                  : void 0 !== A[1]
                    ? (r = Ei)
                    : void 0 !== A[2]
                      ? (Qi.test(A[2]) && (n = RegExp('</' + A[2], 'g')), (r = Bi))
                      : void 0 !== A[3] && (r = Bi)
                : r === Bi
                  ? '>' === A[0]
                    ? ((r = n ?? Ii), (l = -1))
                    : void 0 === A[1]
                      ? (l = -2)
                      : ((l = r.lastIndex - A[2].length),
                        (i = A[1]),
                        (r = void 0 === A[3] ? Bi : '"' === A[3] ? wi : yi))
                  : r === wi || r === yi
                    ? (r = Bi)
                    : r === Ci || r === Ei
                      ? (r = Ii)
                      : ((r = Bi), (n = void 0)));
          const h = r === Bi && e[o + 1].startsWith('/>') ? ' ' : '';
          a +=
            r === Ii
              ? t + gi
              : l >= 0
                ? (s.push(i), t.slice(0, l) + ci + t.slice(l) + hi + h)
                : t + hi + (-2 === l ? o : h);
        }
        return [Di(e, a + (e[i] || '<?>') + (2 === t ? '</svg>' : 3 === t ? '</math>' : '')), s];
      })(t, i);
    if (
      ((this.el = e.createElement(l, s)), (Mi.currentNode = this.el.content), 2 === i || 3 === i)
    ) {
      const e = this.el.content.firstChild;
      e.replaceWith(...e.childNodes);
    }
    for (; null !== (n = Mi.nextNode()) && A.length < o; ) {
      if (1 === n.nodeType) {
        if (n.hasAttributes())
          for (const e of n.getAttributeNames())
            if (e.endsWith(ci)) {
              const t = c[r++],
                i = n.getAttribute(e).split(hi),
                s = /([.?@])?(.*)/.exec(t);
              (A.push({
                type: 1,
                index: a,
                name: s[2],
                strings: i,
                ctor: '.' === s[1] ? _i : '?' === s[1] ? Pi : '@' === s[1] ? Ni : Gi,
              }),
                n.removeAttribute(e));
            } else e.startsWith(hi) && (A.push({ type: 6, index: a }), n.removeAttribute(e));
        if (Qi.test(n.tagName)) {
          const e = n.textContent.split(hi),
            t = e.length - 1;
          if (t > 0) {
            n.textContent = Ai ? Ai.emptyScript : '';
            for (let i = 0; i < t; i++)
              (n.append(e[i], pi()), Mi.nextNode(), A.push({ type: 2, index: ++a }));
            n.append(e[t], pi());
          }
        }
      } else if (8 === n.nodeType)
        if (n.data === di) A.push({ type: 2, index: a });
        else {
          let e = -1;
          for (; -1 !== (e = n.data.indexOf(hi, e + 1)); )
            (A.push({ type: 7, index: a }), (e += hi.length - 1));
        }
      a++;
    }
  }
  static createElement(e, t) {
    const i = ui.createElement('template');
    return ((i.innerHTML = e), i);
  }
};
function Fi(e, t, i = e, s) {
  var n, a;
  if (t === xi) return t;
  let r = void 0 !== s ? (null == (n = i._$Co) ? void 0 : n[s]) : i._$Cl;
  const o = mi(t) ? void 0 : t._$litDirective$;
  return (
    (null == r ? void 0 : r.constructor) !== o &&
      (null == (a = null == r ? void 0 : r._$AO) || a.call(r, !1),
      void 0 === o ? (r = void 0) : ((r = new o(e)), r._$AT(e, i, s)),
      void 0 !== s ? ((i._$Co ?? (i._$Co = []))[s] = r) : (i._$Cl = r)),
    void 0 !== r && (t = Fi(e, r._$AS(e, t.values), r, s)),
    t
  );
}
class Li {
  constructor(e, t) {
    ((this._$AV = []), (this._$AN = void 0), (this._$AD = e), (this._$AM = t));
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const {
        el: { content: t },
        parts: i,
      } = this._$AD,
      s = ((null == e ? void 0 : e.creationScope) ?? ui).importNode(t, !0);
    Mi.currentNode = s;
    let n = Mi.nextNode(),
      a = 0,
      r = 0,
      o = i[0];
    for (; void 0 !== o; ) {
      if (a === o.index) {
        let t;
        (2 === o.type
          ? (t = new Ui(n, n.nextSibling, this, e))
          : 1 === o.type
            ? (t = new o.ctor(n, o.name, o.strings, this, e))
            : 6 === o.type && (t = new Oi(n, this, e)),
          this._$AV.push(t),
          (o = i[++r]));
      }
      a !== (null == o ? void 0 : o.index) && ((n = Mi.nextNode()), a++);
    }
    return ((Mi.currentNode = ui), s);
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV)
      (void 0 !== i &&
        (void 0 !== i.strings ? (i._$AI(e, i, t), (t += i.strings.length - 2)) : i._$AI(e[t])),
        t++);
  }
}
class Ui {
  get _$AU() {
    var e;
    return (null == (e = this._$AM) ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    ((this.type = 2),
      (this._$AH = Si),
      (this._$AN = void 0),
      (this._$AA = e),
      (this._$AB = t),
      (this._$AM = i),
      (this.options = s),
      (this._$Cv = (null == s ? void 0 : s.isConnected) ?? !0));
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return (void 0 !== t && 11 === (null == e ? void 0 : e.nodeType) && (e = t.parentNode), e);
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    ((e = Fi(this, e, t)),
      mi(e)
        ? e === Si || null == e || '' === e
          ? (this._$AH !== Si && this._$AR(), (this._$AH = Si))
          : e !== this._$AH && e !== xi && this._(e)
        : void 0 !== e._$litType$
          ? this.$(e)
          : void 0 !== e.nodeType
            ? this.T(e)
            : (e => bi(e) || 'function' == typeof (null == e ? void 0 : e[Symbol.iterator]))(e)
              ? this.k(e)
              : this._(e));
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), (this._$AH = this.O(e)));
  }
  _(e) {
    (this._$AH !== Si && mi(this._$AH)
      ? (this._$AA.nextSibling.data = e)
      : this.T(ui.createTextNode(e)),
      (this._$AH = e));
  }
  $(e) {
    var t;
    const { values: i, _$litType$: s } = e,
      n =
        'number' == typeof s
          ? this._$AC(e)
          : (void 0 === s.el && (s.el = ki.createElement(Di(s.h, s.h[0]), this.options)), s);
    if ((null == (t = this._$AH) ? void 0 : t._$AD) === n) this._$AH.p(i);
    else {
      const e = new Li(n, this),
        t = e.u(this.options);
      (e.p(i), this.T(t), (this._$AH = e));
    }
  }
  _$AC(e) {
    let t = Ri.get(e.strings);
    return (void 0 === t && Ri.set(e.strings, (t = new ki(e))), t);
  }
  k(e) {
    bi(this._$AH) || ((this._$AH = []), this._$AR());
    const t = this._$AH;
    let i,
      s = 0;
    for (const n of e)
      (s === t.length
        ? t.push((i = new Ui(this.O(pi()), this.O(pi()), this, this.options)))
        : (i = t[s]),
        i._$AI(n),
        s++);
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), (t.length = s));
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for (null == (i = this._$AP) || i.call(this, !1, !0, t); e !== this._$AB; ) {
      const t = oi(e).nextSibling;
      (oi(e).remove(), (e = t));
    }
  }
  setConnected(e) {
    var t;
    void 0 === this._$AM && ((this._$Cv = e), null == (t = this._$AP) || t.call(this, e));
  }
}
class Gi {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, s, n) {
    ((this.type = 1),
      (this._$AH = Si),
      (this._$AN = void 0),
      (this.element = e),
      (this.name = t),
      (this._$AM = s),
      (this.options = n),
      i.length > 2 || '' !== i[0] || '' !== i[1]
        ? ((this._$AH = Array(i.length - 1).fill(new String())), (this.strings = i))
        : (this._$AH = Si));
  }
  _$AI(e, t = this, i, s) {
    const n = this.strings;
    let a = !1;
    if (void 0 === n)
      ((e = Fi(this, e, t, 0)),
        (a = !mi(e) || (e !== this._$AH && e !== xi)),
        a && (this._$AH = e));
    else {
      const s = e;
      let r, o;
      for (e = n[0], r = 0; r < n.length - 1; r++)
        ((o = Fi(this, s[i + r], t, r)),
          o === xi && (o = this._$AH[r]),
          a || (a = !mi(o) || o !== this._$AH[r]),
          o === Si ? (e = Si) : e !== Si && (e += (o ?? '') + n[r + 1]),
          (this._$AH[r] = o));
    }
    a && !s && this.j(e);
  }
  j(e) {
    e === Si
      ? this.element.removeAttribute(this.name)
      : this.element.setAttribute(this.name, e ?? '');
  }
}
let _i = class extends Gi {
  constructor() {
    (super(...arguments), (this.type = 3));
  }
  j(e) {
    this.element[this.name] = e === Si ? void 0 : e;
  }
};
class Pi extends Gi {
  constructor() {
    (super(...arguments), (this.type = 4));
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== Si);
  }
}
class Ni extends Gi {
  constructor(e, t, i, s, n) {
    (super(e, t, i, s, n), (this.type = 5));
  }
  _$AI(e, t = this) {
    if ((e = Fi(this, e, t, 0) ?? Si) === xi) return;
    const i = this._$AH,
      s =
        (e === Si && i !== Si) ||
        e.capture !== i.capture ||
        e.once !== i.once ||
        e.passive !== i.passive,
      n = e !== Si && (i === Si || s);
    (s && this.element.removeEventListener(this.name, this, i),
      n && this.element.addEventListener(this.name, this, e),
      (this._$AH = e));
  }
  handleEvent(e) {
    var t;
    'function' == typeof this._$AH
      ? this._$AH.call((null == (t = this.options) ? void 0 : t.host) ?? this.element, e)
      : this._$AH.handleEvent(e);
  }
}
class Oi {
  constructor(e, t, i) {
    ((this.element = e),
      (this.type = 6),
      (this._$AN = void 0),
      (this._$AM = t),
      (this.options = i));
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Fi(this, e);
  }
}
const Hi = ri.litHtmlPolyfillSupport;
(null == Hi || Hi(ki, Ui), (ri.litHtmlVersions ?? (ri.litHtmlVersions = [])).push('3.3.2'));
const qi = (e, t, i) => {
    const s = (null == i ? void 0 : i.renderBefore) ?? t;
    let n = s._$litPart$;
    if (void 0 === n) {
      const e = (null == i ? void 0 : i.renderBefore) ?? null;
      s._$litPart$ = n = new Ui(t.insertBefore(pi(), e), e, void 0, i ?? {});
    }
    return (n._$AI(e), n);
  },
  ji = globalThis;
let zi = class extends ii {
  constructor() {
    (super(...arguments), (this.renderOptions = { host: this }), (this._$Do = void 0));
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return ((e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t);
  }
  update(e) {
    const t = this.render();
    (this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(e),
      (this._$Do = qi(t, this.renderRoot, this.renderOptions)));
  }
  connectedCallback() {
    var e;
    (super.connectedCallback(), null == (e = this._$Do) || e.setConnected(!0));
  }
  disconnectedCallback() {
    var e;
    (super.disconnectedCallback(), null == (e = this._$Do) || e.setConnected(!1));
  }
  render() {
    return xi;
  }
};
((zi._$litElement$ = !0),
  (zi.finalized = !0),
  null == (e = ji.litElementHydrateSupport) || e.call(ji, { LitElement: zi }));
const Ki = ji.litElementPolyfillSupport;
(null == Ki || Ki({ LitElement: zi }),
  (ji.litElementVersions ?? (ji.litElementVersions = [])).push('4.2.2'));
const Vi =
    null != navigator.xr && null != self.XRSession && null != navigator.xr.isSessionSupported,
  Ji = Vi && null != self.XRSession.prototype.requestHitTestSource,
  Yi = null != self.ResizeObserver,
  Wi = null != self.IntersectionObserver,
  $i = Ji;
(() => {
  const e = navigator.userAgent || navigator.vendor || self.opera;
  let t = !1;
  (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
    e
  ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      e.substr(0, 4)
    )) &&
    (t = !0);
})();
const Xi = /android/i.test(navigator.userAgent),
  Zi =
    (/iPad|iPhone|iPod/.test(navigator.userAgent) && !self.MSStream) ||
    ('MacIntel' === navigator.platform && navigator.maxTouchPoints > 1),
  es = /firefox/i.test(navigator.userAgent),
  ts = /OculusBrowser/.test(navigator.userAgent),
  is = Xi && !es && !ts,
  ss = Boolean(window.webkit && window.webkit.messageHandlers),
  ns = (() => {
    if (Zi) {
      if (ss)
        return Boolean(/CriOS\/|EdgiOS\/|FxiOS\/|GSA\/|DuckDuckGo\//.test(navigator.userAgent));
      {
        const e = document.createElement('a');
        return Boolean(e.relList && e.relList.supports && e.relList.supports('ar'));
      }
    }
    return !1;
  })(),
  as = e => (e && 'null' !== e ? os(e) : null),
  rs = () => {
    if ($i) return;
    const e = [];
    throw (
      Vi || e.push('WebXR Device API'),
      Ji || e.push('WebXR Hit Test API'),
      new Error(
        `The following APIs are required for AR, but are missing in this browser: ${e.join(', ')}`
      )
    );
  },
  os = e => new URL(e, window.location.toString()).toString(),
  As = (e, t) => {
    let i = null;
    return (...s) => {
      (null != i && self.clearTimeout(i),
        (i = self.setTimeout(() => {
          ((i = null), e(...s));
        }, t)));
    };
  },
  ls = (e, t, i) => Math.max(t, Math.min(i, e)),
  cs = (() => {
    const e = new RegExp('[?&]model-viewer-debug-mode(&|$)');
    return () =>
      (self.ModelViewerElement && self.ModelViewerElement.debugMode) ||
      (self.location && self.location.search && self.location.search.match(e));
  })();
var hs = function (e, t, i, s) {
  var n,
    a = arguments.length,
    r = a < 3 ? t : null === s ? (s = Object.getOwnPropertyDescriptor(t, i)) : s;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
    r = Reflect.decorate(e, t, i, s);
  else
    for (var o = e.length - 1; o >= 0; o--)
      (n = e[o]) && (r = (a < 3 ? n(r) : a > 3 ? n(t, i, r) : n(t, i)) || r);
  return (a > 3 && r && Object.defineProperty(t, i, r), r);
};
const ds = Symbol('currentEnvironmentMap'),
  gs = Symbol('currentBackground'),
  us = Symbol('updateEnvironment'),
  ps = Symbol('cancelEnvironmentUpdate'),
  ms = vi`
<style>
:host {
  display: block;
  position: relative;
  contain: strict;
  width: 300px;
  height: 150px;
}

.container {
  position: relative;
  overflow: hidden;
}

.userInput {
  width: 100%;
  height: 100%;
  display: none;
  position: relative;
  outline-offset: -1px;
  outline-width: 1px;
}

canvas {
  position: absolute;
  display: none;
  pointer-events: none;
  /* NOTE(cdata): Chrome 76 and below apparently have a bug
   * that causes our canvas not to display pixels unless it is
   * on its own render layer
   * @see https://github.com/google/model-viewer/pull/755#issuecomment-536597893
   */
  transform: translateZ(0);
}

.show {
  display: block;
}

/* Adapted from HTML5 Boilerplate
 *
 * @see https://github.com/h5bp/html5-boilerplate/blob/ceb4620c78fc82e13534fc44202a3f168754873f/dist/css/main.css#L122-L133 */
.screen-reader-only {
  border: 0;
  left: 0;
  top: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
  pointer-events: none;
}

.slot {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slot > * {
  pointer-events: initial;
}

.annotation-wrapper ::slotted(*) {
  opacity: var(--max-hotspot-opacity, 1);
  transition: opacity 0.3s;
}

.pointer-tumbling .annotation-wrapper ::slotted(*) {
  pointer-events: none;
}

.annotation-wrapper ::slotted(*) {
  pointer-events: initial;
}

.annotation-wrapper.hide ::slotted(*) {
  opacity: var(--min-hotspot-opacity, 0.25);
}

.slot.poster {
  display: none;
  background-color: inherit;
}

.slot.poster.show {
  display: inherit;
}

.slot.poster > * {
  pointer-events: initial;
}

.slot.poster:not(.show) > * {
  pointer-events: none;
}

#default-poster {
  width: 100%;
  height: 100%;
  /* The default poster is a <button> so we need to set display
   * to prevent it from being affected by text-align: */
  display: block;
  position: absolute;
  border: none;
  padding: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #fff0;
}

#default-progress-bar {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

#default-progress-bar > .bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--progress-bar-height, 5px);
  background-color: var(--progress-bar-color, rgba(0, 0, 0, 0.4));
  transition: transform 0.09s;
  transform-origin: top left;
  transform: scaleX(0);
  overflow: hidden;
}

#default-progress-bar > .bar.hide {
  transition: opacity 0.3s 1s;
  opacity: 0;
}

.centered {
  align-items: center;
  justify-content: center;
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.slot.interaction-prompt {
  display: var(--interaction-prompt-display, flex);
  overflow: hidden;
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.3s;
}

.slot.interaction-prompt.visible {
  opacity: 1;
}

.animated-container {
  will-change: transform, opacity;
  opacity: 0;
  transition: opacity 0.3s;
}

.slot.interaction-prompt > * {
  pointer-events: none;
}

.slot.ar-button {
  -moz-user-select: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  display: var(--ar-button-display, block);
}

.slot.ar-button:not(.enabled) {
  display: none;
}

.fab {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background-color: #fff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);
  border-radius: 100px;
}

.fab > * {
  opacity: 0.87;
}

#default-ar-button {
  position: absolute;
  bottom: 16px;
  right: 16px;
  transform: scale(var(--ar-button-scale, 1));
  transform-origin: bottom right;
}

.slot.pan-target {
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  background-color: transparent;
  opacity: 0;
  transition: opacity 0.3s;
}

#default-pan-target {
  width: 6px;
  height: 6px;
  border-radius: 6px;
  border: 1px solid white;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.8);
}

.slot.default {
  pointer-events: none;
}

.slot.progress-bar {
  pointer-events: none;
}

.slot.exit-webxr-ar-button {
  pointer-events: none;
}

.slot.exit-webxr-ar-button:not(.enabled) {
  display: none;
}

#default-exit-webxr-ar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: env(safe-area-inset-top, 16px);
  right: 16px;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
}

#default-exit-webxr-ar-button > svg {
  fill: #fff;
}
</style>
<div class="container">
  <div class="userInput" tabindex="0" role="img"
      aria-label="3D model">
      <div class="slot canvas">
        <slot name="canvas">
          <canvas></canvas>
        </slot>
      </div>

  </div>

  <!-- NOTE(cdata): We need to wrap slots because browsers without ShadowDOM
        will have their <slot> elements removed by ShadyCSS -->
  <div class="slot poster">
    <slot name="poster">
      <button type="button" id="default-poster" aria-hidden="true" aria-label="Loading 3D model"></button>
    </slot>
  </div>

  <div class="slot ar-button">
    <slot name="ar-button">
      <a id="default-ar-button" part="default-ar-button" class="fab"
          tabindex="2"
          role="button"
          href="javascript:void(0);"
          aria-label="View in your space">
        ${vi`
<svg version="1.1" id="view_x5F_in_x5F_AR_x5F_icon"
	 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px"
	 viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
<rect id="Bounding_Box" x="0" y="0" fill="none" width="24" height="24"/>
<g id="Art_layer">
	<path d="M3,4c0-0.55,0.45-1,1-1h2V1H4C2.35,1,1,2.35,1,4v2h2V4z"/>
	<path d="M20,3c0.55,0,1,0.45,1,1v2h2V4c0-1.65-1.35-3-3-3h-2v2H20z"/>
	<path d="M4,21c-0.55,0-1-0.45-1-1v-2H1v2c0,1.65,1.35,3,3,3h2v-2H4z"/>
	<path d="M20,21c0.55,0,1-0.45,1-1v-2h2v2c0,1.65-1.35,3-3,3h-2v-2H20z"/>
	<g>
		<path d="M18.25,7.6l-5.5-3.18c-0.46-0.27-1.04-0.27-1.5,0L5.75,7.6C5.29,7.87,5,8.36,5,8.9v6.35c0,0.54,0.29,1.03,0.75,1.3
			l5.5,3.18c0.46,0.27,1.04,0.27,1.5,0l5.5-3.18c0.46-0.27,0.75-0.76,0.75-1.3V8.9C19,8.36,18.71,7.87,18.25,7.6z M7,14.96v-4.62
			l4,2.32v4.61L7,14.96z M12,10.93L8,8.61l4-2.31l4,2.31L12,10.93z M13,17.27v-4.61l4-2.32v4.62L13,17.27z"/>
	</g>
</g>
</svg>`}
      </a>
    </slot>
  </div>

  <div class="slot pan-target">
    <slot name="pan-target">
      <div id="default-pan-target">
      </div>
    </slot>
  </div>

  <div class="slot interaction-prompt cover centered">
    <div id="prompt" class="animated-container">
      <slot name="interaction-prompt" aria-hidden="true">
        ${vi`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="36">
    <defs>
        <path id="A" d="M.001.232h24.997V36H.001z" />
    </defs>
    <g transform="translate(-11 -4)" fill="none" fill-rule="evenodd">
        <path fill-opacity="0" fill="#fff" d="M0 0h44v44H0z" />
        <g transform="translate(11 3)">
            <path d="M8.733 11.165c.04-1.108.766-2.027 1.743-2.307a2.54 2.54 0 0 1 .628-.089c.16 0 .314.017.463.044 1.088.2 1.9 1.092 1.9 2.16v8.88h1.26c2.943-1.39 5-4.45 5-8.025a9.01 9.01 0 0 0-1.9-5.56l-.43-.5c-.765-.838-1.683-1.522-2.712-2-1.057-.49-2.226-.77-3.46-.77s-2.4.278-3.46.77c-1.03.478-1.947 1.162-2.71 2l-.43.5a9.01 9.01 0 0 0-1.9 5.56 9.04 9.04 0 0 0 .094 1.305c.03.21.088.41.13.617l.136.624c.083.286.196.56.305.832l.124.333a8.78 8.78 0 0 0 .509.953l.065.122a8.69 8.69 0 0 0 3.521 3.191l1.11.537v-9.178z" fill-opacity=".5" fill="#e4e4e4" />
            <path d="M22.94 26.218l-2.76 7.74c-.172.485-.676.8-1.253.8H12.24c-1.606 0-3.092-.68-3.98-1.82-1.592-2.048-3.647-3.822-6.11-5.27-.095-.055-.15-.137-.152-.23-.004-.1.046-.196.193-.297.56-.393 1.234-.6 1.926-.6a3.43 3.43 0 0 1 .691.069l4.922.994V10.972c0-.663.615-1.203 1.37-1.203s1.373.54 1.373 1.203v9.882h2.953c.273 0 .533.073.757.21l6.257 3.874c.027.017.045.042.07.06.41.296.586.77.426 1.22M4.1 16.614c-.024-.04-.042-.083-.065-.122a8.69 8.69 0 0 1-.509-.953c-.048-.107-.08-.223-.124-.333l-.305-.832c-.058-.202-.09-.416-.136-.624l-.13-.617a9.03 9.03 0 0 1-.094-1.305c0-2.107.714-4.04 1.9-5.56l.43-.5c.764-.84 1.682-1.523 2.71-2 1.058-.49 2.226-.77 3.46-.77s2.402.28 3.46.77c1.03.477 1.947 1.16 2.712 2l.428.5a9 9 0 0 1 1.901 5.559c0 3.577-2.056 6.636-5 8.026h-1.26v-8.882c0-1.067-.822-1.96-1.9-2.16-.15-.028-.304-.044-.463-.044-.22 0-.427.037-.628.09-.977.28-1.703 1.198-1.743 2.306v9.178l-1.11-.537C6.18 19.098 4.96 18 4.1 16.614M22.97 24.09l-6.256-3.874c-.102-.063-.218-.098-.33-.144 2.683-1.8 4.354-4.855 4.354-8.243 0-.486-.037-.964-.104-1.43a9.97 9.97 0 0 0-1.57-4.128l-.295-.408-.066-.092a10.05 10.05 0 0 0-.949-1.078c-.342-.334-.708-.643-1.094-.922-1.155-.834-2.492-1.412-3.94-1.65l-.732-.088-.748-.03a9.29 9.29 0 0 0-1.482.119c-1.447.238-2.786.816-3.94 1.65a9.33 9.33 0 0 0-.813.686 9.59 9.59 0 0 0-.845.877l-.385.437-.36.5-.288.468-.418.778-.04.09c-.593 1.28-.93 2.71-.93 4.222 0 3.832 2.182 7.342 5.56 8.938l1.437.68v4.946L5 25.64a4.44 4.44 0 0 0-.888-.086c-.017 0-.034.003-.05.003-.252.004-.503.033-.75.08a5.08 5.08 0 0 0-.237.056c-.193.046-.382.107-.568.18-.075.03-.15.057-.225.1-.25.114-.494.244-.723.405a1.31 1.31 0 0 0-.566 1.122 1.28 1.28 0 0 0 .645 1.051C4 29.925 5.96 31.614 7.473 33.563a5.06 5.06 0 0 0 .434.491c1.086 1.082 2.656 1.713 4.326 1.715h6.697c.748-.001 1.43-.333 1.858-.872.142-.18.256-.38.336-.602l2.757-7.74c.094-.26.13-.53.112-.794s-.088-.52-.203-.76a2.19 2.19 0 0 0-.821-.91" fill-opacity=".6" fill="#000" />
            <path d="M22.444 24.94l-6.257-3.874a1.45 1.45 0 0 0-.757-.211h-2.953v-9.88c0-.663-.616-1.203-1.373-1.203s-1.37.54-1.37 1.203v16.643l-4.922-.994a3.44 3.44 0 0 0-.692-.069 3.35 3.35 0 0 0-1.925.598c-.147.102-.198.198-.194.298.004.094.058.176.153.23 2.462 1.448 4.517 3.22 6.11 5.27.887 1.14 2.373 1.82 3.98 1.82h6.686c.577 0 1.08-.326 1.253-.8l2.76-7.74c.16-.448-.017-.923-.426-1.22-.025-.02-.043-.043-.07-.06z" fill="#fff" />
            <g transform="translate(0 .769)">
                <mask id="B" fill="#fff">
                    <use xlink:href="#A" />
                </mask>
                <path d="M23.993 24.992a1.96 1.96 0 0 1-.111.794l-2.758 7.74c-.08.22-.194.423-.336.602-.427.54-1.11.87-1.857.872h-6.698c-1.67-.002-3.24-.633-4.326-1.715-.154-.154-.3-.318-.434-.49C5.96 30.846 4 29.157 1.646 27.773c-.385-.225-.626-.618-.645-1.05a1.31 1.31 0 0 1 .566-1.122 4.56 4.56 0 0 1 .723-.405l.225-.1a4.3 4.3 0 0 1 .568-.18l.237-.056c.248-.046.5-.075.75-.08.018 0 .034-.003.05-.003.303-.001.597.027.89.086l3.722.752V20.68l-1.436-.68c-3.377-1.596-5.56-5.106-5.56-8.938 0-1.51.336-2.94.93-4.222.015-.03.025-.06.04-.09.127-.267.268-.525.418-.778.093-.16.186-.316.288-.468.063-.095.133-.186.2-.277L3.773 5c.118-.155.26-.29.385-.437.266-.3.544-.604.845-.877a9.33 9.33 0 0 1 .813-.686C6.97 2.167 8.31 1.59 9.757 1.35a9.27 9.27 0 0 1 1.481-.119 8.82 8.82 0 0 1 .748.031c.247.02.49.05.733.088 1.448.238 2.786.816 3.94 1.65.387.28.752.588 1.094.922a9.94 9.94 0 0 1 .949 1.078l.066.092c.102.133.203.268.295.408a9.97 9.97 0 0 1 1.571 4.128c.066.467.103.945.103 1.43 0 3.388-1.67 6.453-4.353 8.243.11.046.227.08.33.144l6.256 3.874c.37.23.645.55.82.9.115.24.185.498.203.76m.697-1.195c-.265-.55-.677-1.007-1.194-1.326l-5.323-3.297c2.255-2.037 3.564-4.97 3.564-8.114 0-2.19-.637-4.304-1.84-6.114-.126-.188-.26-.37-.4-.552-.645-.848-1.402-1.6-2.252-2.204C15.472.91 13.393.232 11.238.232A10.21 10.21 0 0 0 5.23 2.19c-.848.614-1.606 1.356-2.253 2.205-.136.18-.272.363-.398.55C1.374 6.756.737 8.87.737 11.06c0 4.218 2.407 8.08 6.133 9.842l.863.41v3.092l-2.525-.51c-.356-.07-.717-.106-1.076-.106a5.45 5.45 0 0 0-3.14.996c-.653.46-1.022 1.202-.99 1.983a2.28 2.28 0 0 0 1.138 1.872c2.24 1.318 4.106 2.923 5.543 4.772 1.26 1.62 3.333 2.59 5.55 2.592h6.698c1.42-.001 2.68-.86 3.134-2.138l2.76-7.74c.272-.757.224-1.584-.134-2.325" fill-opacity=".05" fill="#000" mask="url(#B)" />
            </g>
        </g>
    </g>
</svg>`}
      </slot>
    </div>
  </div>

  <div id="finger0" class="animated-container cover">
    <slot name="finger0" aria-hidden="true">
    </slot>
  </div>
  <div id="finger1" class="animated-container cover">
    <slot name="finger1" aria-hidden="true">
    </slot>
  </div>

  <div class="slot default">
    <slot></slot>

    <div class="slot progress-bar">
      <slot name="progress-bar">
        <div id="default-progress-bar" aria-hidden="true">
          <div class="bar" part="default-progress-bar"></div>
        </div>
      </slot>
    </div>

    <div class="slot exit-webxr-ar-button">
      <slot name="exit-webxr-ar-button">
        <a id="default-exit-webxr-ar-button" part="default-exit-webxr-ar-button"
            tabindex="3"
            aria-label="Exit AR"
            aria-hidden="true">
          ${vi`
<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000">
    <!-- NOTE(cdata): This SVG filter is a stop-gap until we can implement
         support for dynamic re-coloring of UI components -->
    <defs>
      <filter id="drop-shadow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
        <feOffset dx="0" dy="0" result="offsetblur"/>
        <feFlood flood-color="#000000"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path filter="url(#drop-shadow)" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
</svg>`}
        </a>
      </slot>
    </div>
  </div>
</div>
<div class="screen-reader-only" role="region" aria-label="Live announcements">
  <span id="status" role="status"></span>
</div>`;
var bs = (function () {
  var e = new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 3, 2, 0, 0, 5, 3, 1, 0, 1, 12, 1, 0, 10,
      22, 2, 12, 0, 65, 0, 65, 0, 65, 0, 252, 10, 0, 0, 11, 7, 0, 65, 0, 253, 15, 26, 11,
    ]),
    t = new Uint8Array([
      32, 0, 65, 2, 1, 106, 34, 33, 3, 128, 11, 4, 13, 64, 6, 253, 10, 7, 15, 116, 127, 5, 8, 12,
      40, 16, 19, 54, 20, 9, 27, 255, 113, 17, 42, 67, 24, 23, 146, 148, 18, 14, 22, 45, 70, 69, 56,
      114, 101, 21, 25, 63, 75, 136, 108, 28, 118, 29, 73, 115,
    ]);
  if ('object' != typeof WebAssembly) return { supported: !1 };
  var i,
    s = WebAssembly.validate(e)
      ? a(
          'b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q:6dkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq:p9sqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk:N8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhlaicefhodnaeTmbadTmbalc;WFbGglcjdalcjd6EhwcbhDinawaeaD9RaDawfae6Egqcsfglc9WGgkci2hxakcethmalcl4cifcd4hPabaDad2fhsakc;ab6hzcbhHincbhOaohAdndninaraA9RaP6meavcj;cbfaOak2fhCaAaPfhocbhidnazmbarao9Rc;Gb6mbcbhlinaCalfhidndndndndnaAalco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklbaoczfhokdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklzaoczfhokdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklaaoczfhokdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaoclfaYpQbfaXc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaocwfaYpQbfaXc:q:yjjbfRbbfhoxekaiaopbbbpkl8Waoczfhokalc;abfhialcjefak0meaihlarao9Rc;Fb0mbkkdnaiak9pmbaici4hlinarao9RcK6miaCaifhXdndndndndnaAaico4fRbbalcoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpkbbxikaXaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaXaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaXaopbbbpkbbaoczfhokalcdfhlaiczfgiak6mbkkaoTmeaohAaOcefgOclSmdxbkkc9:hoxlkdnakTmbavcjdfaHfhiavaHfpbdbhYcbhXinaiavcj;cbfaXfglpblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLalakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEalamfpblbg3cep9Ta3aQp9op9Hp9rg3alaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfhiaXczfgXak6mbkkaHclfgHad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfgDae6mbkkcbc99arao9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk::seHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:wPliuo97eue978Jjjjjbca9Rhiaec98Ghldndnadcl9hmbdnalTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalaeSmeaipxbbbbbbbbbbbbbbbbgqpklbaiabalcdtfgdaeciGglcdtgv;8qbbdnalTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDaqp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkadaiav;8qbbskdnalTmbcbhvabhdinadczfgxaxpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oaoarpmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgval6mbkkalaeSmbaiaeciGgvcitgdfcbcaad9R;8kbaiabalcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oaoarpmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalaeSmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbheabhdinadadpbbbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbadczfhdaeclfgeav6mbkkdnavalSmbaialciGgecdtgdVcbc;abad9R;8kbaiabavcdtfgvad;8qbbdnaeTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepklbkavaiad;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz:Dbb'
        )
      : a(
          'b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q:Odkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq;w8Wqdbk;esezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9Uc;WFbGgocjdaocjd6EhDaicefhocbhqdnindndndnaeaq9nmbaDaeaq9RaqaDfae6Egkcsfglcl4cifcd4hxalc9WGgmTmecbhPawcjdfhsaohzinaraz9Rax6mvarazaxfgo9RcK6mvczhlcbhHinalgic9WfgOawcj;cbffhldndndndndnazaOco4fRbbaHcoG4ciGPlbedibkal9cb83ibalcwf9cb83ibxikalaoRblaoRbbgOco4gAaAciSgAE86bbawcj;cbfaifglcGfaoclfaAfgARbbaOcl4ciGgCaCciSgCE86bbalcVfaAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc7faAaCfgARbbaOciGgOaOciSgOE86bbalctfaAaOfgARbbaoRbegOco4gCaCciSgCE86bbalc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc93faAaCfgARbbaOciGgOaOciSgOE86bbalc94faAaOfgARbbaoRbdgOco4gCaCciSgCE86bbalc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc97faAaCfgARbbaOciGgOaOciSgOE86bbalc98faAaOfgORbbaoRbigoco4gAaAciSgAE86bbalc99faOaAfgORbbaocl4ciGgAaAciSgAE86bbalc9:faOaAfgORbbaocd4ciGgAaAciSgAE86bbalcufaOaAfglRbbaociGgoaociSgoE86bbalaofhoxdkalaoRbwaoRbbgOcl4gAaAcsSgAE86bbawcj;cbfaifglcGfaocwfaAfgARbbaOcsGgOaOcsSgOE86bbalcVfaAaOfgORbbaoRbegAcl4gCaCcsSgCE86bbalc7faOaCfgORbbaAcsGgAaAcsSgAE86bbalctfaOaAfgORbbaoRbdgAcl4gCaCcsSgCE86bbalc91faOaCfgORbbaAcsGgAaAcsSgAE86bbalc4faOaAfgORbbaoRbigAcl4gCaCcsSgCE86bbalc93faOaCfgORbbaAcsGgAaAcsSgAE86bbalc94faOaAfgORbbaoRblgAcl4gCaCcsSgCE86bbalc95faOaCfgORbbaAcsGgAaAcsSgAE86bbalc96faOaAfgORbbaoRbvgAcl4gCaCcsSgCE86bbalc97faOaCfgORbbaAcsGgAaAcsSgAE86bbalc98faOaAfgORbbaoRbogAcl4gCaCcsSgCE86bbalc99faOaCfgORbbaAcsGgAaAcsSgAE86bbalc9:faOaAfgORbbaoRbrgocl4gAaAcsSgAE86bbalcufaOaAfglRbbaocsGgoaocsSgoE86bbalaofhoxekalao8Pbb83bbalcwfaocwf8Pbb83bbaoczfhokdnaiam9pmbaHcdfhHaiczfhlarao9RcL0mekkaiam6mvaoTmvdnakTmbawaPfRbbhHawcj;cbfhlashiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkkascefhsaohzaPcefgPad9hmbxikkcbc99arao9Radcaadca0ESEhoxlkaoaxad2fhCdnakmbadhlinaoTmlarao9Rax6mlaoaxfhoalcufglmbkaChoxekcbhmawcjdfhAinarao9Rax6miawamfRbbhHawcj;cbfhlaAhiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkaAcefhAaoaxfhoamcefgmad9hmbkaChokabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqaombkc9:hoxekc9:hokavcj;ebf8Kjjjjbaok;cseHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;oiliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabaiavcefciGfcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavciGfgkcd7cetfaD87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavcufciGfcetfaD87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohvxekcjjjj94hvkabakcetfav87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklzNbb'
        ),
    n = WebAssembly.instantiate(s, {}).then(function (e) {
      (i = e.instance).exports.__wasm_call_ctors();
    });
  function a(e) {
    for (var i = new Uint8Array(e.length), s = 0; s < e.length; ++s) {
      var n = e.charCodeAt(s);
      i[s] = n > 96 ? n - 97 : n > 64 ? n - 39 : n + 4;
    }
    var a = 0;
    for (s = 0; s < e.length; ++s) i[a++] = i[s] < 60 ? t[i[s]] : 64 * (i[s] - 60) + i[++s];
    return i.buffer.slice(0, a);
  }
  function r(e, t, i, s, n, a, r) {
    var o = e.exports.sbrk,
      A = (s + 3) & -4,
      l = o(A * n),
      c = o(a.length),
      h = new Uint8Array(e.exports.memory.buffer);
    h.set(a, c);
    var d = t(l, s, n, c, a.length);
    if ((0 == d && r && r(l, A, n), i.set(h.subarray(l, l + s * n)), o(l - o(0)), 0 != d))
      throw new Error('Malformed buffer data: ' + d);
  }
  var o = {
      NONE: '',
      OCTAHEDRAL: 'meshopt_decodeFilterOct',
      QUATERNION: 'meshopt_decodeFilterQuat',
      EXPONENTIAL: 'meshopt_decodeFilterExp',
    },
    A = {
      ATTRIBUTES: 'meshopt_decodeVertexBuffer',
      TRIANGLES: 'meshopt_decodeIndexBuffer',
      INDICES: 'meshopt_decodeIndexSequence',
    },
    l = [],
    c = 0;
  function h(e) {
    var t = { object: new Worker(e), pending: 0, requests: {} };
    return (
      (t.object.onmessage = function (e) {
        var i = e.data;
        ((t.pending -= i.count), t.requests[i.id][i.action](i.value), delete t.requests[i.id]);
      }),
      t
    );
  }
  function d(e) {
    var t = e.data;
    if (!t.id) return self.close();
    self.ready.then(function (e) {
      try {
        var i = new Uint8Array(t.count * t.size);
        (r(e, e.exports[t.mode], i, t.count, t.size, t.source, e.exports[t.filter]),
          self.postMessage({ id: t.id, count: t.count, action: 'resolve', value: i }, [i.buffer]));
      } catch (s) {
        self.postMessage({ id: t.id, count: t.count, action: 'reject', value: s });
      }
    });
  }
  return {
    ready: n,
    supported: !0,
    useWorkers: function (e) {
      !(function (e) {
        for (
          var t =
              'self.ready = WebAssembly.instantiate(new Uint8Array([' +
              new Uint8Array(s) +
              ']), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = ' +
              d.name +
              ';' +
              r.toString() +
              d.toString(),
            i = new Blob([t], { type: 'text/javascript' }),
            n = URL.createObjectURL(i),
            a = l.length;
          a < e;
          ++a
        )
          l[a] = h(n);
        for (a = e; a < l.length; ++a) l[a].object.postMessage({});
        ((l.length = e), URL.revokeObjectURL(n));
      })(e);
    },
    decodeVertexBuffer: function (e, t, s, n, a) {
      r(i, i.exports.meshopt_decodeVertexBuffer, e, t, s, n, i.exports[o[a]]);
    },
    decodeIndexBuffer: function (e, t, s, n) {
      r(i, i.exports.meshopt_decodeIndexBuffer, e, t, s, n);
    },
    decodeIndexSequence: function (e, t, s, n) {
      r(i, i.exports.meshopt_decodeIndexSequence, e, t, s, n);
    },
    decodeGltfBuffer: function (e, t, s, n, a, l) {
      r(i, i.exports[A[a]], e, t, s, n, i.exports[o[l]]);
    },
    decodeGltfBufferAsync: function (e, t, s, a, h) {
      return l.length > 0
        ? (function (e, t, i, s, n) {
            for (var a = l[0], r = 1; r < l.length; ++r) l[r].pending < a.pending && (a = l[r]);
            return new Promise(function (r, o) {
              var A = new Uint8Array(i),
                l = ++c;
              ((a.pending += e),
                (a.requests[l] = { resolve: r, reject: o }),
                a.object.postMessage({ id: l, count: e, size: t, source: A, mode: s, filter: n }, [
                  A.buffer,
                ]));
            });
          })(e, t, s, A[a], o[h])
        : n.then(function () {
            var n = new Uint8Array(e * t);
            return (r(i, i.exports[A[a]], n, e, t, s, i.exports[o[h]]), n);
          });
    },
  };
})();
const fs = new WeakMap();
function Is() {
  let e, t;
  function i(e, t, i, s, n, a) {
    const r = i.num_points(),
      o = a.num_components(),
      A = (function (e, t) {
        switch (t) {
          case Float32Array:
            return e.DT_FLOAT32;
          case Int8Array:
            return e.DT_INT8;
          case Int16Array:
            return e.DT_INT16;
          case Int32Array:
            return e.DT_INT32;
          case Uint8Array:
            return e.DT_UINT8;
          case Uint16Array:
            return e.DT_UINT16;
          case Uint32Array:
            return e.DT_UINT32;
        }
      })(e, n),
      l = o * n.BYTES_PER_ELEMENT,
      c = 4 * Math.ceil(l / 4),
      h = c / n.BYTES_PER_ELEMENT,
      d = r * l,
      g = r * c,
      u = e._malloc(d);
    t.GetAttributeDataArrayForAllPoints(i, a, A, d, u);
    const p = new n(e.HEAPF32.buffer, u, d / n.BYTES_PER_ELEMENT);
    let m;
    if (l === c) m = p.slice();
    else {
      m = new n(g / n.BYTES_PER_ELEMENT);
      let e = 0;
      for (let t = 0, i = p.length; t < i; t++) {
        for (let i = 0; i < o; i++) m[e + i] = p[t * o + i];
        e += h;
      }
    }
    return (e._free(u), { name: s, count: r, itemSize: o, array: m, stride: h });
  }
  onmessage = function (s) {
    const n = s.data;
    switch (n.type) {
      case 'init':
        ((e = n.decoderConfig),
          (t = new Promise(function (t) {
            ((e.onModuleLoaded = function (e) {
              t({ draco: e });
            }),
              DracoDecoderModule(e));
          })));
        break;
      case 'decode':
        const s = n.buffer,
          a = n.taskConfig;
        t.then(e => {
          const t = e.draco,
            r = new t.Decoder();
          try {
            const e = (function (e, t, s, n) {
                const a = n.attributeIDs,
                  r = n.attributeTypes;
                let o, A;
                const l = t.GetEncodedGeometryType(s);
                if (l === e.TRIANGULAR_MESH)
                  ((o = new e.Mesh()), (A = t.DecodeArrayToMesh(s, s.byteLength, o)));
                else {
                  if (l !== e.POINT_CLOUD)
                    throw new Error('THREE.DRACOLoader: Unexpected geometry type.');
                  ((o = new e.PointCloud()), (A = t.DecodeArrayToPointCloud(s, s.byteLength, o)));
                }
                if (!A.ok() || 0 === o.ptr)
                  throw new Error('THREE.DRACOLoader: Decoding failed: ' + A.error_msg());
                const c = { index: null, attributes: [] };
                for (const h in a) {
                  const s = self[r[h]];
                  let A, l;
                  if (n.useUniqueIDs) ((l = a[h]), (A = t.GetAttributeByUniqueId(o, l)));
                  else {
                    if (((l = t.GetAttributeId(o, e[a[h]])), -1 === l)) continue;
                    A = t.GetAttribute(o, l);
                  }
                  const d = i(e, t, o, h, s, A);
                  ('color' === h && (d.vertexColorSpace = n.vertexColorSpace),
                    c.attributes.push(d));
                }
                l === e.TRIANGULAR_MESH &&
                  (c.index = (function (e, t, i) {
                    const s = i.num_faces(),
                      n = 3 * s,
                      a = 4 * n,
                      r = e._malloc(a);
                    t.GetTrianglesUInt32Array(i, a, r);
                    const o = new Uint32Array(e.HEAPF32.buffer, r, n).slice();
                    return (e._free(r), { array: o, itemSize: 1 });
                  })(e, t, o));
                return (e.destroy(o), c);
              })(t, r, new Int8Array(s), a),
              o = e.attributes.map(e => e.array.buffer);
            (e.index && o.push(e.index.array.buffer),
              self.postMessage({ type: 'decode', id: n.id, geometry: e }, o));
          } catch (o) {
            (console.error(o), self.postMessage({ type: 'error', id: n.id, error: o.message }));
          } finally {
            t.destroy(r);
          }
        });
    }
  };
}
function Cs(e, t) {
  if (t === f)
    return (
      console.warn(
        'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.'
      ),
      e
    );
  if (t === I || t === C) {
    let i = e.getIndex();
    if (null === i) {
      const t = [],
        s = e.getAttribute('position');
      if (void 0 === s)
        return (
          console.error(
            'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.'
          ),
          e
        );
      for (let e = 0; e < s.count; e++) t.push(e);
      (e.setIndex(t), (i = e.getIndex()));
    }
    const s = i.count - 2,
      n = [];
    if (t === I)
      for (let e = 1; e <= s; e++) (n.push(i.getX(0)), n.push(i.getX(e)), n.push(i.getX(e + 1)));
    else
      for (let e = 0; e < s; e++)
        e % 2 == 0
          ? (n.push(i.getX(e)), n.push(i.getX(e + 1)), n.push(i.getX(e + 2)))
          : (n.push(i.getX(e + 2)), n.push(i.getX(e + 1)), n.push(i.getX(e)));
    n.length / 3 !== s &&
      console.error(
        'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.'
      );
    const a = e.clone();
    return (a.setIndex(n), a.clearGroups(), a);
  }
  return (
    console.error('THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:', t),
    e
  );
}
class Es extends A {
  constructor(e) {
    (super(e),
      (this.dracoLoader = null),
      (this.ktx2Loader = null),
      (this.meshoptDecoder = null),
      (this.pluginCallbacks = []),
      this.register(function (e) {
        return new xs(e);
      }),
      this.register(function (e) {
        return new Ss(e);
      }),
      this.register(function (e) {
        return new Gs(e);
      }),
      this.register(function (e) {
        return new _s(e);
      }),
      this.register(function (e) {
        return new Ps(e);
      }),
      this.register(function (e) {
        return new Ms(e);
      }),
      this.register(function (e) {
        return new Ts(e);
      }),
      this.register(function (e) {
        return new Ds(e);
      }),
      this.register(function (e) {
        return new ks(e);
      }),
      this.register(function (e) {
        return new vs(e);
      }),
      this.register(function (e) {
        return new Fs(e);
      }),
      this.register(function (e) {
        return new Rs(e);
      }),
      this.register(function (e) {
        return new Us(e);
      }),
      this.register(function (e) {
        return new Ls(e);
      }),
      this.register(function (e) {
        return new ws(e);
      }),
      this.register(function (e) {
        return new Ns(e);
      }),
      this.register(function (e) {
        return new Os(e);
      }));
  }
  load(e, t, i, s) {
    const n = this;
    let a;
    if ('' !== this.resourcePath) a = this.resourcePath;
    else if ('' !== this.path) {
      const t = E.extractUrlBase(e);
      a = E.resolveURL(t, this.path);
    } else a = E.extractUrlBase(e);
    this.manager.itemStart(e);
    const r = function (t) {
        (s ? s(t) : console.error(t), n.manager.itemError(e), n.manager.itemEnd(e));
      },
      o = new l(this.manager);
    (o.setPath(this.path),
      o.setResponseType('arraybuffer'),
      o.setRequestHeader(this.requestHeader),
      o.setWithCredentials(this.withCredentials),
      o.load(
        e,
        function (i) {
          try {
            n.parse(
              i,
              a,
              function (i) {
                (t(i), n.manager.itemEnd(e));
              },
              r
            );
          } catch (s) {
            r(s);
          }
        },
        i,
        r
      ));
  }
  setDRACOLoader(e) {
    return ((this.dracoLoader = e), this);
  }
  setKTX2Loader(e) {
    return ((this.ktx2Loader = e), this);
  }
  setMeshoptDecoder(e) {
    return ((this.meshoptDecoder = e), this);
  }
  register(e) {
    return (-1 === this.pluginCallbacks.indexOf(e) && this.pluginCallbacks.push(e), this);
  }
  unregister(e) {
    return (
      -1 !== this.pluginCallbacks.indexOf(e) &&
        this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1),
      this
    );
  }
  parse(e, t, i, s) {
    let n;
    const a = {},
      r = {},
      o = new TextDecoder();
    if ('string' == typeof e) n = JSON.parse(e);
    else if (e instanceof ArrayBuffer) {
      if (o.decode(new Uint8Array(e, 0, 4)) === Hs) {
        try {
          a[ys.KHR_BINARY_GLTF] = new zs(e);
        } catch (l) {
          return void (s && s(l));
        }
        n = JSON.parse(a[ys.KHR_BINARY_GLTF].content);
      } else n = JSON.parse(o.decode(e));
    } else n = e;
    if (void 0 === n.asset || n.asset.version[0] < 2)
      return void (
        s && s(new Error('THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.'))
      );
    const A = new fn(n, {
      path: t || this.resourcePath || '',
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder,
    });
    A.fileLoader.setRequestHeader(this.requestHeader);
    for (let c = 0; c < this.pluginCallbacks.length; c++) {
      const e = this.pluginCallbacks[c](A);
      (e.name || console.error('THREE.GLTFLoader: Invalid plugin found: missing name'),
        (r[e.name] = e),
        (a[e.name] = !0));
    }
    if (n.extensionsUsed)
      for (let c = 0; c < n.extensionsUsed.length; ++c) {
        const e = n.extensionsUsed[c],
          t = n.extensionsRequired || [];
        switch (e) {
          case ys.KHR_MATERIALS_UNLIT:
            a[e] = new Qs();
            break;
          case ys.KHR_DRACO_MESH_COMPRESSION:
            a[e] = new Ks(n, this.dracoLoader);
            break;
          case ys.KHR_TEXTURE_TRANSFORM:
            a[e] = new Vs();
            break;
          case ys.KHR_MESH_QUANTIZATION:
            a[e] = new Js();
            break;
          default:
            t.indexOf(e) >= 0 &&
              void 0 === r[e] &&
              console.warn('THREE.GLTFLoader: Unknown extension "' + e + '".');
        }
      }
    (A.setExtensions(a), A.setPlugins(r), A.parse(i, s));
  }
  parseAsync(e, t) {
    const i = this;
    return new Promise(function (s, n) {
      i.parse(e, t, s, n);
    });
  }
}
function Bs() {
  let e = {};
  return {
    get: function (t) {
      return e[t];
    },
    add: function (t, i) {
      e[t] = i;
    },
    remove: function (t) {
      delete e[t];
    },
    removeAll: function () {
      e = {};
    },
  };
}
const ys = {
  KHR_BINARY_GLTF: 'KHR_binary_glTF',
  KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
  KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
  KHR_MATERIALS_CLEARCOAT: 'KHR_materials_clearcoat',
  KHR_MATERIALS_DISPERSION: 'KHR_materials_dispersion',
  KHR_MATERIALS_IOR: 'KHR_materials_ior',
  KHR_MATERIALS_SHEEN: 'KHR_materials_sheen',
  KHR_MATERIALS_SPECULAR: 'KHR_materials_specular',
  KHR_MATERIALS_TRANSMISSION: 'KHR_materials_transmission',
  KHR_MATERIALS_IRIDESCENCE: 'KHR_materials_iridescence',
  KHR_MATERIALS_ANISOTROPY: 'KHR_materials_anisotropy',
  KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
  KHR_MATERIALS_VOLUME: 'KHR_materials_volume',
  KHR_TEXTURE_BASISU: 'KHR_texture_basisu',
  KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
  KHR_MESH_QUANTIZATION: 'KHR_mesh_quantization',
  KHR_MATERIALS_EMISSIVE_STRENGTH: 'KHR_materials_emissive_strength',
  EXT_MATERIALS_BUMP: 'EXT_materials_bump',
  EXT_TEXTURE_WEBP: 'EXT_texture_webp',
  EXT_TEXTURE_AVIF: 'EXT_texture_avif',
  EXT_MESHOPT_COMPRESSION: 'EXT_meshopt_compression',
  EXT_MESH_GPU_INSTANCING: 'EXT_mesh_gpu_instancing',
};
class ws {
  constructor(e) {
    ((this.parser = e),
      (this.name = ys.KHR_LIGHTS_PUNCTUAL),
      (this.cache = { refs: {}, uses: {} }));
  }
  _markDefs() {
    const e = this.parser,
      t = this.parser.json.nodes || [];
    for (let i = 0, s = t.length; i < s; i++) {
      const s = t[i];
      s.extensions &&
        s.extensions[this.name] &&
        void 0 !== s.extensions[this.name].light &&
        e._addNodeRef(this.cache, s.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser,
      i = 'light:' + e;
    let s = t.cache.get(i);
    if (s) return s;
    const n = t.json,
      a = (((n.extensions && n.extensions[this.name]) || {}).lights || [])[e];
    let r;
    const o = new p(16777215);
    void 0 !== a.color && o.setRGB(a.color[0], a.color[1], a.color[2], h);
    const A = void 0 !== a.range ? a.range : 0;
    switch (a.type) {
      case 'directional':
        ((r = new v(o)), r.target.position.set(0, 0, -1), r.add(r.target));
        break;
      case 'point':
        ((r = new Q(o)), (r.distance = A));
        break;
      case 'spot':
        ((r = new w(o)),
          (r.distance = A),
          (a.spot = a.spot || {}),
          (a.spot.innerConeAngle = void 0 !== a.spot.innerConeAngle ? a.spot.innerConeAngle : 0),
          (a.spot.outerConeAngle =
            void 0 !== a.spot.outerConeAngle ? a.spot.outerConeAngle : Math.PI / 4),
          (r.angle = a.spot.outerConeAngle),
          (r.penumbra = 1 - a.spot.innerConeAngle / a.spot.outerConeAngle),
          r.target.position.set(0, 0, -1),
          r.add(r.target));
        break;
      default:
        throw new Error('THREE.GLTFLoader: Unexpected light type: ' + a.type);
    }
    return (
      r.position.set(0, 0, 0),
      dn(r, a),
      void 0 !== a.intensity && (r.intensity = a.intensity),
      (r.name = t.createUniqueName(a.name || 'light_' + e)),
      (s = Promise.resolve(r)),
      t.cache.add(i, s),
      s
    );
  }
  getDependency(e, t) {
    if ('light' === e) return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this,
      i = this.parser,
      s = i.json.nodes[e],
      n = ((s.extensions && s.extensions[this.name]) || {}).light;
    return void 0 === n
      ? null
      : this._loadLight(n).then(function (e) {
          return i._getNodeRef(t.cache, n, e);
        });
  }
}
let Qs = class {
    constructor() {
      this.name = ys.KHR_MATERIALS_UNLIT;
    }
    getMaterialType() {
      return Y;
    }
    extendParams(e, t, i) {
      const s = [];
      ((e.color = new p(1, 1, 1)), (e.opacity = 1));
      const n = t.pbrMetallicRoughness;
      if (n) {
        if (Array.isArray(n.baseColorFactor)) {
          const t = n.baseColorFactor;
          (e.color.setRGB(t[0], t[1], t[2], h), (e.opacity = t[3]));
        }
        void 0 !== n.baseColorTexture && s.push(i.assignTexture(e, 'map', n.baseColorTexture, c));
      }
      return Promise.all(s);
    }
  },
  vs = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.KHR_MATERIALS_EMISSIVE_STRENGTH));
    }
    extendMaterialParams(e, t) {
      const i = this.parser.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const s = i.extensions[this.name].emissiveStrength;
      return (void 0 !== s && (t.emissiveIntensity = s), Promise.resolve());
    }
  },
  xs = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.KHR_MATERIALS_CLEARCOAT));
    }
    getMaterialType(e) {
      const t = this.parser.json.materials[e];
      return t.extensions && t.extensions[this.name] ? B : null;
    }
    extendMaterialParams(e, t) {
      const i = this.parser,
        s = i.json.materials[e];
      if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
      const n = [],
        a = s.extensions[this.name];
      if (
        (void 0 !== a.clearcoatFactor && (t.clearcoat = a.clearcoatFactor),
        void 0 !== a.clearcoatTexture &&
          n.push(i.assignTexture(t, 'clearcoatMap', a.clearcoatTexture)),
        void 0 !== a.clearcoatRoughnessFactor &&
          (t.clearcoatRoughness = a.clearcoatRoughnessFactor),
        void 0 !== a.clearcoatRoughnessTexture &&
          n.push(i.assignTexture(t, 'clearcoatRoughnessMap', a.clearcoatRoughnessTexture)),
        void 0 !== a.clearcoatNormalTexture &&
          (n.push(i.assignTexture(t, 'clearcoatNormalMap', a.clearcoatNormalTexture)),
          void 0 !== a.clearcoatNormalTexture.scale))
      ) {
        const e = a.clearcoatNormalTexture.scale;
        t.clearcoatNormalScale = new y(e, e);
      }
      return Promise.all(n);
    }
  },
  Ss = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.KHR_MATERIALS_DISPERSION));
    }
    getMaterialType(e) {
      const t = this.parser.json.materials[e];
      return t.extensions && t.extensions[this.name] ? B : null;
    }
    extendMaterialParams(e, t) {
      const i = this.parser.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const s = i.extensions[this.name];
      return ((t.dispersion = void 0 !== s.dispersion ? s.dispersion : 0), Promise.resolve());
    }
  },
  Rs = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.KHR_MATERIALS_IRIDESCENCE));
    }
    getMaterialType(e) {
      const t = this.parser.json.materials[e];
      return t.extensions && t.extensions[this.name] ? B : null;
    }
    extendMaterialParams(e, t) {
      const i = this.parser,
        s = i.json.materials[e];
      if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
      const n = [],
        a = s.extensions[this.name];
      return (
        void 0 !== a.iridescenceFactor && (t.iridescence = a.iridescenceFactor),
        void 0 !== a.iridescenceTexture &&
          n.push(i.assignTexture(t, 'iridescenceMap', a.iridescenceTexture)),
        void 0 !== a.iridescenceIor && (t.iridescenceIOR = a.iridescenceIor),
        void 0 === t.iridescenceThicknessRange && (t.iridescenceThicknessRange = [100, 400]),
        void 0 !== a.iridescenceThicknessMinimum &&
          (t.iridescenceThicknessRange[0] = a.iridescenceThicknessMinimum),
        void 0 !== a.iridescenceThicknessMaximum &&
          (t.iridescenceThicknessRange[1] = a.iridescenceThicknessMaximum),
        void 0 !== a.iridescenceThicknessTexture &&
          n.push(i.assignTexture(t, 'iridescenceThicknessMap', a.iridescenceThicknessTexture)),
        Promise.all(n)
      );
    }
  },
  Ms = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.KHR_MATERIALS_SHEEN));
    }
    getMaterialType(e) {
      const t = this.parser.json.materials[e];
      return t.extensions && t.extensions[this.name] ? B : null;
    }
    extendMaterialParams(e, t) {
      const i = this.parser,
        s = i.json.materials[e];
      if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
      const n = [];
      ((t.sheenColor = new p(0, 0, 0)), (t.sheenRoughness = 0), (t.sheen = 1));
      const a = s.extensions[this.name];
      if (void 0 !== a.sheenColorFactor) {
        const e = a.sheenColorFactor;
        t.sheenColor.setRGB(e[0], e[1], e[2], h);
      }
      return (
        void 0 !== a.sheenRoughnessFactor && (t.sheenRoughness = a.sheenRoughnessFactor),
        void 0 !== a.sheenColorTexture &&
          n.push(i.assignTexture(t, 'sheenColorMap', a.sheenColorTexture, c)),
        void 0 !== a.sheenRoughnessTexture &&
          n.push(i.assignTexture(t, 'sheenRoughnessMap', a.sheenRoughnessTexture)),
        Promise.all(n)
      );
    }
  },
  Ts = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.KHR_MATERIALS_TRANSMISSION));
    }
    getMaterialType(e) {
      const t = this.parser.json.materials[e];
      return t.extensions && t.extensions[this.name] ? B : null;
    }
    extendMaterialParams(e, t) {
      const i = this.parser,
        s = i.json.materials[e];
      if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
      const n = [],
        a = s.extensions[this.name];
      return (
        void 0 !== a.transmissionFactor && (t.transmission = a.transmissionFactor),
        void 0 !== a.transmissionTexture &&
          n.push(i.assignTexture(t, 'transmissionMap', a.transmissionTexture)),
        Promise.all(n)
      );
    }
  },
  Ds = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.KHR_MATERIALS_VOLUME));
    }
    getMaterialType(e) {
      const t = this.parser.json.materials[e];
      return t.extensions && t.extensions[this.name] ? B : null;
    }
    extendMaterialParams(e, t) {
      const i = this.parser,
        s = i.json.materials[e];
      if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
      const n = [],
        a = s.extensions[this.name];
      ((t.thickness = void 0 !== a.thicknessFactor ? a.thicknessFactor : 0),
        void 0 !== a.thicknessTexture &&
          n.push(i.assignTexture(t, 'thicknessMap', a.thicknessTexture)),
        (t.attenuationDistance = a.attenuationDistance || 1 / 0));
      const r = a.attenuationColor || [1, 1, 1];
      return ((t.attenuationColor = new p().setRGB(r[0], r[1], r[2], h)), Promise.all(n));
    }
  },
  ks = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.KHR_MATERIALS_IOR));
    }
    getMaterialType(e) {
      const t = this.parser.json.materials[e];
      return t.extensions && t.extensions[this.name] ? B : null;
    }
    extendMaterialParams(e, t) {
      const i = this.parser.json.materials[e];
      if (!i.extensions || !i.extensions[this.name]) return Promise.resolve();
      const s = i.extensions[this.name];
      return ((t.ior = void 0 !== s.ior ? s.ior : 1.5), Promise.resolve());
    }
  },
  Fs = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.KHR_MATERIALS_SPECULAR));
    }
    getMaterialType(e) {
      const t = this.parser.json.materials[e];
      return t.extensions && t.extensions[this.name] ? B : null;
    }
    extendMaterialParams(e, t) {
      const i = this.parser,
        s = i.json.materials[e];
      if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
      const n = [],
        a = s.extensions[this.name];
      ((t.specularIntensity = void 0 !== a.specularFactor ? a.specularFactor : 1),
        void 0 !== a.specularTexture &&
          n.push(i.assignTexture(t, 'specularIntensityMap', a.specularTexture)));
      const r = a.specularColorFactor || [1, 1, 1];
      return (
        (t.specularColor = new p().setRGB(r[0], r[1], r[2], h)),
        void 0 !== a.specularColorTexture &&
          n.push(i.assignTexture(t, 'specularColorMap', a.specularColorTexture, c)),
        Promise.all(n)
      );
    }
  },
  Ls = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.EXT_MATERIALS_BUMP));
    }
    getMaterialType(e) {
      const t = this.parser.json.materials[e];
      return t.extensions && t.extensions[this.name] ? B : null;
    }
    extendMaterialParams(e, t) {
      const i = this.parser,
        s = i.json.materials[e];
      if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
      const n = [],
        a = s.extensions[this.name];
      return (
        (t.bumpScale = void 0 !== a.bumpFactor ? a.bumpFactor : 1),
        void 0 !== a.bumpTexture && n.push(i.assignTexture(t, 'bumpMap', a.bumpTexture)),
        Promise.all(n)
      );
    }
  },
  Us = class {
    constructor(e) {
      ((this.parser = e), (this.name = ys.KHR_MATERIALS_ANISOTROPY));
    }
    getMaterialType(e) {
      const t = this.parser.json.materials[e];
      return t.extensions && t.extensions[this.name] ? B : null;
    }
    extendMaterialParams(e, t) {
      const i = this.parser,
        s = i.json.materials[e];
      if (!s.extensions || !s.extensions[this.name]) return Promise.resolve();
      const n = [],
        a = s.extensions[this.name];
      return (
        void 0 !== a.anisotropyStrength && (t.anisotropy = a.anisotropyStrength),
        void 0 !== a.anisotropyRotation && (t.anisotropyRotation = a.anisotropyRotation),
        void 0 !== a.anisotropyTexture &&
          n.push(i.assignTexture(t, 'anisotropyMap', a.anisotropyTexture)),
        Promise.all(n)
      );
    }
  };
class Gs {
  constructor(e) {
    ((this.parser = e), (this.name = ys.KHR_TEXTURE_BASISU));
  }
  loadTexture(e) {
    const t = this.parser,
      i = t.json,
      s = i.textures[e];
    if (!s.extensions || !s.extensions[this.name]) return null;
    const n = s.extensions[this.name],
      a = t.options.ktx2Loader;
    if (!a) {
      if (i.extensionsRequired && i.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error(
          'THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures'
        );
      return null;
    }
    return t.loadTextureImage(e, n.source, a);
  }
}
class _s {
  constructor(e) {
    ((this.parser = e), (this.name = ys.EXT_TEXTURE_WEBP));
  }
  loadTexture(e) {
    const t = this.name,
      i = this.parser,
      s = i.json,
      n = s.textures[e];
    if (!n.extensions || !n.extensions[t]) return null;
    const a = n.extensions[t],
      r = s.images[a.source];
    let o = i.textureLoader;
    if (r.uri) {
      const e = i.options.manager.getHandler(r.uri);
      null !== e && (o = e);
    }
    return i.loadTextureImage(e, a.source, o);
  }
}
class Ps {
  constructor(e) {
    ((this.parser = e), (this.name = ys.EXT_TEXTURE_AVIF));
  }
  loadTexture(e) {
    const t = this.name,
      i = this.parser,
      s = i.json,
      n = s.textures[e];
    if (!n.extensions || !n.extensions[t]) return null;
    const a = n.extensions[t],
      r = s.images[a.source];
    let o = i.textureLoader;
    if (r.uri) {
      const e = i.options.manager.getHandler(r.uri);
      null !== e && (o = e);
    }
    return i.loadTextureImage(e, a.source, o);
  }
}
class Ns {
  constructor(e) {
    ((this.name = ys.EXT_MESHOPT_COMPRESSION), (this.parser = e));
  }
  loadBufferView(e) {
    const t = this.parser.json,
      i = t.bufferViews[e];
    if (i.extensions && i.extensions[this.name]) {
      const e = i.extensions[this.name],
        s = this.parser.getDependency('buffer', e.buffer),
        n = this.parser.options.meshoptDecoder;
      if (!n || !n.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error(
            'THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files'
          );
        return null;
      }
      return s.then(function (t) {
        const i = e.byteOffset || 0,
          s = e.byteLength || 0,
          a = e.count,
          r = e.byteStride,
          o = new Uint8Array(t, i, s);
        return n.decodeGltfBufferAsync
          ? n.decodeGltfBufferAsync(a, r, o, e.mode, e.filter).then(function (e) {
              return e.buffer;
            })
          : n.ready.then(function () {
              const t = new ArrayBuffer(a * r);
              return (n.decodeGltfBuffer(new Uint8Array(t), a, r, o, e.mode, e.filter), t);
            });
      });
    }
    return null;
  }
}
let Os = class {
  constructor(e) {
    ((this.name = ys.EXT_MESH_GPU_INSTANCING), (this.parser = e));
  }
  createNodeMesh(e) {
    const t = this.parser.json,
      i = t.nodes[e];
    if (!i.extensions || !i.extensions[this.name] || void 0 === i.mesh) return null;
    const s = t.meshes[i.mesh];
    for (const o of s.primitives)
      if (
        o.mode !== Xs.TRIANGLES &&
        o.mode !== Xs.TRIANGLE_STRIP &&
        o.mode !== Xs.TRIANGLE_FAN &&
        void 0 !== o.mode
      )
        return null;
    const n = i.extensions[this.name].attributes,
      a = [],
      r = {};
    for (const o in n)
      a.push(this.parser.getDependency('accessor', n[o]).then(e => ((r[o] = e), r[o])));
    return a.length < 1
      ? null
      : (a.push(this.parser.createNodeMesh(e)),
        Promise.all(a).then(e => {
          const t = e.pop(),
            i = t.isGroup ? t.children : [t],
            s = e[0].count,
            n = [];
          for (const a of i) {
            const e = new x(),
              t = new S(),
              i = new M(),
              o = new S(1, 1, 1),
              A = new R(a.geometry, a.material, s);
            for (let n = 0; n < s; n++)
              (r.TRANSLATION && t.fromBufferAttribute(r.TRANSLATION, n),
                r.ROTATION && i.fromBufferAttribute(r.ROTATION, n),
                r.SCALE && o.fromBufferAttribute(r.SCALE, n),
                A.setMatrixAt(n, e.compose(t, i, o)));
            for (const s in r)
              if ('_COLOR_0' === s) {
                const e = r[s];
                A.instanceColor = new T(e.array, e.itemSize, e.normalized);
              } else
                'TRANSLATION' !== s &&
                  'ROTATION' !== s &&
                  'SCALE' !== s &&
                  a.geometry.setAttribute(s, r[s]);
            (D.prototype.copy.call(A, a), this.parser.assignFinalMaterial(A), n.push(A));
          }
          return t.isGroup ? (t.clear(), t.add(...n), t) : n[0];
        }));
  }
};
const Hs = 'glTF',
  qs = 1313821514,
  js = 5130562;
class zs {
  constructor(e) {
    ((this.name = ys.KHR_BINARY_GLTF), (this.content = null), (this.body = null));
    const t = new DataView(e, 0, 12),
      i = new TextDecoder();
    if (
      ((this.header = {
        magic: i.decode(new Uint8Array(e.slice(0, 4))),
        version: t.getUint32(4, !0),
        length: t.getUint32(8, !0),
      }),
      this.header.magic !== Hs)
    )
      throw new Error('THREE.GLTFLoader: Unsupported glTF-Binary header.');
    if (this.header.version < 2) throw new Error('THREE.GLTFLoader: Legacy binary file detected.');
    const s = this.header.length - 12,
      n = new DataView(e, 12);
    let a = 0;
    for (; a < s; ) {
      const t = n.getUint32(a, !0);
      a += 4;
      const s = n.getUint32(a, !0);
      if (((a += 4), s === qs)) {
        const s = new Uint8Array(e, 12 + a, t);
        this.content = i.decode(s);
      } else if (s === js) {
        const i = 12 + a;
        this.body = e.slice(i, i + t);
      }
      a += t;
    }
    if (null === this.content) throw new Error('THREE.GLTFLoader: JSON content not found.');
  }
}
class Ks {
  constructor(e, t) {
    if (!t) throw new Error('THREE.GLTFLoader: No DRACOLoader instance provided.');
    ((this.name = ys.KHR_DRACO_MESH_COMPRESSION),
      (this.json = e),
      (this.dracoLoader = t),
      this.dracoLoader.preload());
  }
  decodePrimitive(e, t) {
    const i = this.json,
      s = this.dracoLoader,
      n = e.extensions[this.name].bufferView,
      a = e.extensions[this.name].attributes,
      r = {},
      o = {},
      A = {};
    for (const l in a) {
      const e = nn[l] || l.toLowerCase();
      r[e] = a[l];
    }
    for (const l in e.attributes) {
      const t = nn[l] || l.toLowerCase();
      if (void 0 !== a[l]) {
        const s = i.accessors[e.attributes[l]],
          n = Zs[s.componentType];
        ((A[t] = n.name), (o[t] = !0 === s.normalized));
      }
    }
    return t.getDependency('bufferView', n).then(function (e) {
      return new Promise(function (t, i) {
        s.decodeDracoFile(
          e,
          function (e) {
            for (const t in e.attributes) {
              const i = e.attributes[t],
                s = o[t];
              void 0 !== s && (i.normalized = s);
            }
            t(e);
          },
          r,
          A,
          h,
          i
        );
      });
    });
  }
}
class Vs {
  constructor() {
    this.name = ys.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (void 0 !== t.texCoord && t.texCoord !== e.channel) ||
      void 0 !== t.offset ||
      void 0 !== t.rotation ||
      void 0 !== t.scale
      ? ((e = e.clone()),
        void 0 !== t.texCoord && (e.channel = t.texCoord),
        void 0 !== t.offset && e.offset.fromArray(t.offset),
        void 0 !== t.rotation && (e.rotation = t.rotation),
        void 0 !== t.scale && e.repeat.fromArray(t.scale),
        (e.needsUpdate = !0),
        e)
      : e;
  }
}
class Js {
  constructor() {
    this.name = ys.KHR_MESH_QUANTIZATION;
  }
}
class Ys extends be {
  constructor(e, t, i, s) {
    super(e, t, i, s);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer,
      i = this.sampleValues,
      s = this.valueSize,
      n = e * s * 3 + s;
    for (let a = 0; a !== s; a++) t[a] = i[n + a];
    return t;
  }
  interpolate_(e, t, i, s) {
    const n = this.resultBuffer,
      a = this.sampleValues,
      r = this.valueSize,
      o = 2 * r,
      A = 3 * r,
      l = s - t,
      c = (i - t) / l,
      h = c * c,
      d = h * c,
      g = e * A,
      u = g - A,
      p = -2 * d + 3 * h,
      m = d - h,
      b = 1 - p,
      f = m - h + c;
    for (let I = 0; I !== r; I++) {
      const e = a[u + I + r],
        t = a[u + I + o] * l,
        i = a[g + I + r],
        s = a[g + I] * l;
      n[I] = b * e + f * t + p * i + m * s;
    }
    return n;
  }
}
const Ws = new M();
class $s extends Ys {
  interpolate_(e, t, i, s) {
    const n = super.interpolate_(e, t, i, s);
    return (Ws.fromArray(n).normalize().toArray(n), n);
  }
}
const Xs = {
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6,
  },
  Zs = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array,
  },
  en = { 9728: N, 9729: P, 9984: _, 9985: G, 9986: U, 9987: L },
  tn = { 33071: q, 33648: H, 10497: O },
  sn = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 },
  nn = {
    POSITION: 'position',
    NORMAL: 'normal',
    TANGENT: 'tangent',
    TEXCOORD_0: 'uv',
    TEXCOORD_1: 'uv1',
    TEXCOORD_2: 'uv2',
    TEXCOORD_3: 'uv3',
    COLOR_0: 'color',
    WEIGHTS_0: 'skinWeight',
    JOINTS_0: 'skinIndex',
  },
  an = {
    scale: 'scale',
    translation: 'position',
    rotation: 'quaternion',
    weights: 'morphTargetInfluences',
  },
  rn = { CUBICSPLINE: void 0, LINEAR: he, STEP: ce },
  on = 'OPAQUE',
  An = 'MASK',
  ln = 'BLEND';
function cn(e) {
  return (
    void 0 === e.DefaultMaterial &&
      (e.DefaultMaterial = new V({
        color: 16777215,
        emissive: 0,
        metalness: 1,
        roughness: 1,
        transparent: !1,
        depthTest: !0,
        side: me,
      })),
    e.DefaultMaterial
  );
}
function hn(e, t, i) {
  for (const s in i.extensions)
    void 0 === e[s] &&
      ((t.userData.gltfExtensions = t.userData.gltfExtensions || {}),
      (t.userData.gltfExtensions[s] = i.extensions[s]));
}
function dn(e, t) {
  void 0 !== t.extras &&
    ('object' == typeof t.extras
      ? Object.assign(e.userData, t.extras)
      : console.warn('THREE.GLTFLoader: Ignoring primitive type .extras, ' + t.extras));
}
function gn(e, t) {
  if ((e.updateMorphTargets(), void 0 !== t.weights))
    for (let i = 0, s = t.weights.length; i < s; i++) e.morphTargetInfluences[i] = t.weights[i];
  if (t.extras && Array.isArray(t.extras.targetNames)) {
    const i = t.extras.targetNames;
    if (e.morphTargetInfluences.length === i.length) {
      e.morphTargetDictionary = {};
      for (let t = 0, s = i.length; t < s; t++) e.morphTargetDictionary[i[t]] = t;
    } else console.warn('THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.');
  }
}
function un(e) {
  let t;
  const i = e.extensions && e.extensions[ys.KHR_DRACO_MESH_COMPRESSION];
  if (
    ((t = i
      ? 'draco:' + i.bufferView + ':' + i.indices + ':' + pn(i.attributes)
      : e.indices + ':' + pn(e.attributes) + ':' + e.mode),
    void 0 !== e.targets)
  )
    for (let s = 0, n = e.targets.length; s < n; s++) t += ':' + pn(e.targets[s]);
  return t;
}
function pn(e) {
  let t = '';
  const i = Object.keys(e).sort();
  for (let s = 0, n = i.length; s < n; s++) t += i[s] + ':' + e[i[s]] + ';';
  return t;
}
function mn(e) {
  switch (e) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error('THREE.GLTFLoader: Unsupported normalized accessor component type.');
  }
}
const bn = new x();
class fn {
  constructor(e = {}, t = {}) {
    ((this.json = e),
      (this.extensions = {}),
      (this.plugins = {}),
      (this.options = t),
      (this.cache = new Bs()),
      (this.associations = new Map()),
      (this.primitiveCache = {}),
      (this.nodeCache = {}),
      (this.meshCache = { refs: {}, uses: {} }),
      (this.cameraCache = { refs: {}, uses: {} }),
      (this.lightCache = { refs: {}, uses: {} }),
      (this.sourceCache = {}),
      (this.textureCache = {}),
      (this.nodeNamesUsed = {}));
    let i = !1,
      s = -1,
      n = !1,
      a = -1;
    if ('undefined' != typeof navigator) {
      const e = navigator.userAgent;
      i = !0 === /^((?!chrome|android).)*safari/i.test(e);
      const t = e.match(/Version\/(\d+)/);
      ((s = i && t ? parseInt(t[1], 10) : -1),
        (n = e.indexOf('Firefox') > -1),
        (a = n ? e.match(/Firefox\/([0-9]+)\./)[1] : -1));
    }
    ('undefined' == typeof createImageBitmap || (i && s < 17) || (n && a < 98)
      ? (this.textureLoader = new k(this.options.manager))
      : (this.textureLoader = new F(this.options.manager)),
      this.textureLoader.setCrossOrigin(this.options.crossOrigin),
      this.textureLoader.setRequestHeader(this.options.requestHeader),
      (this.fileLoader = new l(this.options.manager)),
      this.fileLoader.setResponseType('arraybuffer'),
      'use-credentials' === this.options.crossOrigin && this.fileLoader.setWithCredentials(!0));
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const i = this,
      s = this.json,
      n = this.extensions;
    (this.cache.removeAll(),
      (this.nodeCache = {}),
      this._invokeAll(function (e) {
        return e._markDefs && e._markDefs();
      }),
      Promise.all(
        this._invokeAll(function (e) {
          return e.beforeRoot && e.beforeRoot();
        })
      )
        .then(function () {
          return Promise.all([
            i.getDependencies('scene'),
            i.getDependencies('animation'),
            i.getDependencies('camera'),
          ]);
        })
        .then(function (t) {
          const a = {
            scene: t[0][s.scene || 0],
            scenes: t[0],
            animations: t[1],
            cameras: t[2],
            asset: s.asset,
            parser: i,
            userData: {},
          };
          return (
            hn(n, a, s),
            dn(a, s),
            Promise.all(
              i._invokeAll(function (e) {
                return e.afterRoot && e.afterRoot(a);
              })
            ).then(function () {
              for (const e of a.scenes) e.updateMatrixWorld();
              e(a);
            })
          );
        })
        .catch(t));
  }
  _markDefs() {
    const e = this.json.nodes || [],
      t = this.json.skins || [],
      i = this.json.meshes || [];
    for (let s = 0, n = t.length; s < n; s++) {
      const i = t[s].joints;
      for (let t = 0, s = i.length; t < s; t++) e[i[t]].isBone = !0;
    }
    for (let s = 0, n = e.length; s < n; s++) {
      const t = e[s];
      (void 0 !== t.mesh &&
        (this._addNodeRef(this.meshCache, t.mesh),
        void 0 !== t.skin && (i[t.mesh].isSkinnedMesh = !0)),
        void 0 !== t.camera && this._addNodeRef(this.cameraCache, t.camera));
    }
  }
  _addNodeRef(e, t) {
    void 0 !== t && (void 0 === e.refs[t] && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  _getNodeRef(e, t, i) {
    if (e.refs[t] <= 1) return i;
    const s = i.clone(),
      n = (e, t) => {
        const i = this.associations.get(e);
        null != i && this.associations.set(t, i);
        for (const [s, a] of e.children.entries()) n(a, t.children[s]);
      };
    return (n(i, s), (s.name += '_instance_' + e.uses[t]++), s);
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let i = 0; i < t.length; i++) {
      const s = e(t[i]);
      if (s) return s;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const i = [];
    for (let s = 0; s < t.length; s++) {
      const n = e(t[s]);
      n && i.push(n);
    }
    return i;
  }
  getDependency(e, t) {
    const i = e + ':' + t;
    let s = this.cache.get(i);
    if (!s) {
      switch (e) {
        case 'scene':
          s = this.loadScene(t);
          break;
        case 'node':
          s = this._invokeOne(function (e) {
            return e.loadNode && e.loadNode(t);
          });
          break;
        case 'mesh':
          s = this._invokeOne(function (e) {
            return e.loadMesh && e.loadMesh(t);
          });
          break;
        case 'accessor':
          s = this.loadAccessor(t);
          break;
        case 'bufferView':
          s = this._invokeOne(function (e) {
            return e.loadBufferView && e.loadBufferView(t);
          });
          break;
        case 'buffer':
          s = this.loadBuffer(t);
          break;
        case 'material':
          s = this._invokeOne(function (e) {
            return e.loadMaterial && e.loadMaterial(t);
          });
          break;
        case 'texture':
          s = this._invokeOne(function (e) {
            return e.loadTexture && e.loadTexture(t);
          });
          break;
        case 'skin':
          s = this.loadSkin(t);
          break;
        case 'animation':
          s = this._invokeOne(function (e) {
            return e.loadAnimation && e.loadAnimation(t);
          });
          break;
        case 'camera':
          s = this.loadCamera(t);
          break;
        default:
          if (
            ((s = this._invokeOne(function (i) {
              return i != this && i.getDependency && i.getDependency(e, t);
            })),
            !s)
          )
            throw new Error('Unknown type: ' + e);
      }
      this.cache.add(i, s);
    }
    return s;
  }
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const i = this,
        s = this.json[e + ('mesh' === e ? 'es' : 's')] || [];
      ((t = Promise.all(
        s.map(function (t, s) {
          return i.getDependency(e, s);
        })
      )),
        this.cache.add(e, t));
    }
    return t;
  }
  loadBuffer(e) {
    const t = this.json.buffers[e],
      i = this.fileLoader;
    if (t.type && 'arraybuffer' !== t.type)
      throw new Error('THREE.GLTFLoader: ' + t.type + ' buffer type is not supported.');
    if (void 0 === t.uri && 0 === e)
      return Promise.resolve(this.extensions[ys.KHR_BINARY_GLTF].body);
    const s = this.options;
    return new Promise(function (e, n) {
      i.load(E.resolveURL(t.uri, s.path), e, void 0, function () {
        n(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency('buffer', t.buffer).then(function (e) {
      const i = t.byteLength || 0,
        s = t.byteOffset || 0;
      return e.slice(s, s + i);
    });
  }
  loadAccessor(e) {
    const t = this,
      i = this.json,
      s = this.json.accessors[e];
    if (void 0 === s.bufferView && void 0 === s.sparse) {
      const e = sn[s.type],
        t = Zs[s.componentType],
        i = !0 === s.normalized,
        n = new t(s.count * e);
      return Promise.resolve(new g(n, e, i));
    }
    const n = [];
    return (
      void 0 !== s.bufferView
        ? n.push(this.getDependency('bufferView', s.bufferView))
        : n.push(null),
      void 0 !== s.sparse &&
        (n.push(this.getDependency('bufferView', s.sparse.indices.bufferView)),
        n.push(this.getDependency('bufferView', s.sparse.values.bufferView))),
      Promise.all(n).then(function (e) {
        const n = e[0],
          a = sn[s.type],
          r = Zs[s.componentType],
          o = r.BYTES_PER_ELEMENT,
          A = o * a,
          l = s.byteOffset || 0,
          c = void 0 !== s.bufferView ? i.bufferViews[s.bufferView].byteStride : void 0,
          h = !0 === s.normalized;
        let d, p;
        if (c && c !== A) {
          const e = Math.floor(l / c),
            i =
              'InterleavedBuffer:' + s.bufferView + ':' + s.componentType + ':' + e + ':' + s.count;
          let A = t.cache.get(i);
          (A ||
            ((d = new r(n, e * c, (s.count * c) / o)), (A = new u(d, c / o)), t.cache.add(i, A)),
            (p = new b(A, a, (l % c) / o, h)));
        } else
          ((d = null === n ? new r(s.count * a) : new r(n, l, s.count * a)), (p = new g(d, a, h)));
        if (void 0 !== s.sparse) {
          const t = sn.SCALAR,
            i = Zs[s.sparse.indices.componentType],
            o = s.sparse.indices.byteOffset || 0,
            A = s.sparse.values.byteOffset || 0,
            l = new i(e[1], o, s.sparse.count * t),
            c = new r(e[2], A, s.sparse.count * a);
          (null !== n && (p = new g(p.array.slice(), p.itemSize, p.normalized)),
            (p.normalized = !1));
          for (let e = 0, s = l.length; e < s; e++) {
            const t = l[e];
            if (
              (p.setX(t, c[e * a]),
              a >= 2 && p.setY(t, c[e * a + 1]),
              a >= 3 && p.setZ(t, c[e * a + 2]),
              a >= 4 && p.setW(t, c[e * a + 3]),
              a >= 5)
            )
              throw new Error('THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.');
          }
          p.normalized = h;
        }
        return p;
      })
    );
  }
  loadTexture(e) {
    const t = this.json,
      i = this.options,
      s = t.textures[e].source,
      n = t.images[s];
    let a = this.textureLoader;
    if (n.uri) {
      const e = i.manager.getHandler(n.uri);
      null !== e && (a = e);
    }
    return this.loadTextureImage(e, s, a);
  }
  loadTextureImage(e, t, i) {
    const s = this,
      n = this.json,
      a = n.textures[e],
      r = n.images[t],
      o = (r.uri || r.bufferView) + ':' + a.sampler;
    if (this.textureCache[o]) return this.textureCache[o];
    const A = this.loadImageSource(t, i)
      .then(function (t) {
        ((t.flipY = !1),
          (t.name = a.name || r.name || ''),
          '' === t.name &&
            'string' == typeof r.uri &&
            !1 === r.uri.startsWith('data:image/') &&
            (t.name = r.uri));
        const i = (n.samplers || {})[a.sampler] || {};
        return (
          (t.magFilter = en[i.magFilter] || P),
          (t.minFilter = en[i.minFilter] || L),
          (t.wrapS = tn[i.wrapS] || O),
          (t.wrapT = tn[i.wrapT] || O),
          (t.generateMipmaps = !t.isCompressedTexture && t.minFilter !== N && t.minFilter !== P),
          s.associations.set(t, { textures: e }),
          t
        );
      })
      .catch(function () {
        return null;
      });
    return ((this.textureCache[o] = A), A);
  }
  loadImageSource(e, t) {
    const i = this,
      s = this.json,
      n = this.options;
    if (void 0 !== this.sourceCache[e]) return this.sourceCache[e].then(e => e.clone());
    const a = s.images[e],
      r = self.URL || self.webkitURL;
    let o = a.uri || '',
      A = !1;
    if (void 0 !== a.bufferView)
      o = i.getDependency('bufferView', a.bufferView).then(function (e) {
        A = !0;
        const t = new Blob([e], { type: a.mimeType });
        return ((o = r.createObjectURL(t)), o);
      });
    else if (void 0 === a.uri)
      throw new Error('THREE.GLTFLoader: Image ' + e + ' is missing URI and bufferView');
    const l = Promise.resolve(o)
      .then(function (e) {
        return new Promise(function (i, s) {
          let a = i;
          (!0 === t.isImageBitmapLoader &&
            (a = function (e) {
              const t = new de(e);
              ((t.needsUpdate = !0), i(t));
            }),
            t.load(E.resolveURL(e, n.path), a, void 0, s));
        });
      })
      .then(function (e) {
        var t;
        return (
          !0 === A && r.revokeObjectURL(o),
          dn(e, a),
          (e.userData.mimeType =
            a.mimeType ||
            ((t = a.uri).search(/\.jpe?g($|\?)/i) > 0 || 0 === t.search(/^data\:image\/jpeg/)
              ? 'image/jpeg'
              : t.search(/\.webp($|\?)/i) > 0 || 0 === t.search(/^data\:image\/webp/)
                ? 'image/webp'
                : t.search(/\.ktx2($|\?)/i) > 0 || 0 === t.search(/^data\:image\/ktx2/)
                  ? 'image/ktx2'
                  : 'image/png')),
          e
        );
      })
      .catch(function (e) {
        throw (console.error("THREE.GLTFLoader: Couldn't load texture", o), e);
      });
    return ((this.sourceCache[e] = l), l);
  }
  assignTexture(e, t, i, s) {
    const n = this;
    return this.getDependency('texture', i.index).then(function (a) {
      if (!a) return null;
      if (
        (void 0 !== i.texCoord && i.texCoord > 0 && ((a = a.clone()).channel = i.texCoord),
        n.extensions[ys.KHR_TEXTURE_TRANSFORM])
      ) {
        const e = void 0 !== i.extensions ? i.extensions[ys.KHR_TEXTURE_TRANSFORM] : void 0;
        if (e) {
          const t = n.associations.get(a);
          ((a = n.extensions[ys.KHR_TEXTURE_TRANSFORM].extendTexture(a, e)),
            n.associations.set(a, t));
        }
      }
      return (void 0 !== s && (a.colorSpace = s), (e[t] = a), a);
    });
  }
  assignFinalMaterial(e) {
    const t = e.geometry;
    let i = e.material;
    const s = void 0 === t.attributes.tangent,
      n = void 0 !== t.attributes.color,
      a = void 0 === t.attributes.normal;
    if (e.isPoints) {
      const e = 'PointsMaterial:' + i.uuid;
      let t = this.cache.get(e);
      (t ||
        ((t = new j()),
        z.prototype.copy.call(t, i),
        t.color.copy(i.color),
        (t.map = i.map),
        (t.sizeAttenuation = !1),
        this.cache.add(e, t)),
        (i = t));
    } else if (e.isLine) {
      const e = 'LineBasicMaterial:' + i.uuid;
      let t = this.cache.get(e);
      (t ||
        ((t = new K()),
        z.prototype.copy.call(t, i),
        t.color.copy(i.color),
        (t.map = i.map),
        this.cache.add(e, t)),
        (i = t));
    }
    if (s || n || a) {
      let e = 'ClonedMaterial:' + i.uuid + ':';
      (s && (e += 'derivative-tangents:'),
        n && (e += 'vertex-colors:'),
        a && (e += 'flat-shading:'));
      let t = this.cache.get(e);
      (t ||
        ((t = i.clone()),
        n && (t.vertexColors = !0),
        a && (t.flatShading = !0),
        s &&
          (t.normalScale && (t.normalScale.y *= -1),
          t.clearcoatNormalScale && (t.clearcoatNormalScale.y *= -1)),
        this.cache.add(e, t),
        this.associations.set(t, this.associations.get(i))),
        (i = t));
    }
    e.material = i;
  }
  getMaterialType() {
    return V;
  }
  loadMaterial(e) {
    const t = this,
      i = this.json,
      s = this.extensions,
      n = i.materials[e];
    let a;
    const r = {},
      o = [];
    if ((n.extensions || {})[ys.KHR_MATERIALS_UNLIT]) {
      const e = s[ys.KHR_MATERIALS_UNLIT];
      ((a = e.getMaterialType()), o.push(e.extendParams(r, n, t)));
    } else {
      const i = n.pbrMetallicRoughness || {};
      if (((r.color = new p(1, 1, 1)), (r.opacity = 1), Array.isArray(i.baseColorFactor))) {
        const e = i.baseColorFactor;
        (r.color.setRGB(e[0], e[1], e[2], h), (r.opacity = e[3]));
      }
      (void 0 !== i.baseColorTexture && o.push(t.assignTexture(r, 'map', i.baseColorTexture, c)),
        (r.metalness = void 0 !== i.metallicFactor ? i.metallicFactor : 1),
        (r.roughness = void 0 !== i.roughnessFactor ? i.roughnessFactor : 1),
        void 0 !== i.metallicRoughnessTexture &&
          (o.push(t.assignTexture(r, 'metalnessMap', i.metallicRoughnessTexture)),
          o.push(t.assignTexture(r, 'roughnessMap', i.metallicRoughnessTexture))),
        (a = this._invokeOne(function (t) {
          return t.getMaterialType && t.getMaterialType(e);
        })),
        o.push(
          Promise.all(
            this._invokeAll(function (t) {
              return t.extendMaterialParams && t.extendMaterialParams(e, r);
            })
          )
        ));
    }
    !0 === n.doubleSided && (r.side = J);
    const A = n.alphaMode || on;
    if (
      (A === ln
        ? ((r.transparent = !0), (r.depthWrite = !1))
        : ((r.transparent = !1),
          A === An && (r.alphaTest = void 0 !== n.alphaCutoff ? n.alphaCutoff : 0.5)),
      void 0 !== n.normalTexture &&
        a !== Y &&
        (o.push(t.assignTexture(r, 'normalMap', n.normalTexture)),
        (r.normalScale = new y(1, 1)),
        void 0 !== n.normalTexture.scale))
    ) {
      const e = n.normalTexture.scale;
      r.normalScale.set(e, e);
    }
    if (
      (void 0 !== n.occlusionTexture &&
        a !== Y &&
        (o.push(t.assignTexture(r, 'aoMap', n.occlusionTexture)),
        void 0 !== n.occlusionTexture.strength && (r.aoMapIntensity = n.occlusionTexture.strength)),
      void 0 !== n.emissiveFactor && a !== Y)
    ) {
      const e = n.emissiveFactor;
      r.emissive = new p().setRGB(e[0], e[1], e[2], h);
    }
    return (
      void 0 !== n.emissiveTexture &&
        a !== Y &&
        o.push(t.assignTexture(r, 'emissiveMap', n.emissiveTexture, c)),
      Promise.all(o).then(function () {
        const i = new a(r);
        return (
          n.name && (i.name = n.name),
          dn(i, n),
          t.associations.set(i, { materials: e }),
          n.extensions && hn(s, i, n),
          i
        );
      })
    );
  }
  createUniqueName(e) {
    const t = W.sanitizeNodeName(e || '');
    return t in this.nodeNamesUsed
      ? t + '_' + ++this.nodeNamesUsed[t]
      : ((this.nodeNamesUsed[t] = 0), t);
  }
  loadGeometries(e) {
    const t = this,
      i = this.extensions,
      s = this.primitiveCache;
    function n(e) {
      return i[ys.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then(function (i) {
        return In(i, e, t);
      });
    }
    const a = [];
    for (let r = 0, o = e.length; r < o; r++) {
      const i = e[r],
        o = un(i),
        A = s[o];
      if (A) a.push(A.promise);
      else {
        let e;
        ((e =
          i.extensions && i.extensions[ys.KHR_DRACO_MESH_COMPRESSION] ? n(i) : In(new d(), i, t)),
          (s[o] = { primitive: i, promise: e }),
          a.push(e));
      }
    }
    return Promise.all(a);
  }
  loadMesh(e) {
    const t = this,
      i = this.json,
      s = this.extensions,
      n = i.meshes[e],
      a = n.primitives,
      r = [];
    for (let o = 0, A = a.length; o < A; o++) {
      const e =
        void 0 === a[o].material ? cn(this.cache) : this.getDependency('material', a[o].material);
      r.push(e);
    }
    return (
      r.push(t.loadGeometries(a)),
      Promise.all(r).then(function (i) {
        const r = i.slice(0, i.length - 1),
          o = i[i.length - 1],
          A = [];
        for (let c = 0, h = o.length; c < h; c++) {
          const i = o[c],
            l = a[c];
          let h;
          const d = r[c];
          if (
            l.mode === Xs.TRIANGLES ||
            l.mode === Xs.TRIANGLE_STRIP ||
            l.mode === Xs.TRIANGLE_FAN ||
            void 0 === l.mode
          )
            ((h = !0 === n.isSkinnedMesh ? new $(i, d) : new X(i, d)),
              !0 === h.isSkinnedMesh && h.normalizeSkinWeights(),
              l.mode === Xs.TRIANGLE_STRIP
                ? (h.geometry = Cs(h.geometry, C))
                : l.mode === Xs.TRIANGLE_FAN && (h.geometry = Cs(h.geometry, I)));
          else if (l.mode === Xs.LINES) h = new Z(i, d);
          else if (l.mode === Xs.LINE_STRIP) h = new ee(i, d);
          else if (l.mode === Xs.LINE_LOOP) h = new te(i, d);
          else {
            if (l.mode !== Xs.POINTS)
              throw new Error('THREE.GLTFLoader: Primitive mode unsupported: ' + l.mode);
            h = new ie(i, d);
          }
          (Object.keys(h.geometry.morphAttributes).length > 0 && gn(h, n),
            (h.name = t.createUniqueName(n.name || 'mesh_' + e)),
            dn(h, n),
            l.extensions && hn(s, h, l),
            t.assignFinalMaterial(h),
            A.push(h));
        }
        for (let s = 0, n = A.length; s < n; s++)
          t.associations.set(A[s], { meshes: e, primitives: s });
        if (1 === A.length) return (n.extensions && hn(s, A[0], n), A[0]);
        const l = new se();
        (n.extensions && hn(s, l, n), t.associations.set(l, { meshes: e }));
        for (let e = 0, t = A.length; e < t; e++) l.add(A[e]);
        return l;
      })
    );
  }
  loadCamera(e) {
    let t;
    const i = this.json.cameras[e],
      s = i[i.type];
    if (s)
      return (
        'perspective' === i.type
          ? (t = new ne(ae.radToDeg(s.yfov), s.aspectRatio || 1, s.znear || 1, s.zfar || 2e6))
          : 'orthographic' === i.type &&
            (t = new re(-s.xmag, s.xmag, s.ymag, -s.ymag, s.znear, s.zfar)),
        i.name && (t.name = this.createUniqueName(i.name)),
        dn(t, i),
        Promise.resolve(t)
      );
    console.warn('THREE.GLTFLoader: Missing camera parameters.');
  }
  loadSkin(e) {
    const t = this.json.skins[e],
      i = [];
    for (let s = 0, n = t.joints.length; s < n; s++) i.push(this._loadNodeShallow(t.joints[s]));
    return (
      void 0 !== t.inverseBindMatrices
        ? i.push(this.getDependency('accessor', t.inverseBindMatrices))
        : i.push(null),
      Promise.all(i).then(function (e) {
        const i = e.pop(),
          s = e,
          n = [],
          a = [];
        for (let r = 0, o = s.length; r < o; r++) {
          const e = s[r];
          if (e) {
            n.push(e);
            const t = new x();
            (null !== i && t.fromArray(i.array, 16 * r), a.push(t));
          } else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[r]);
        }
        return new oe(n, a);
      })
    );
  }
  loadAnimation(e) {
    const t = this.json,
      i = this,
      s = t.animations[e],
      n = s.name ? s.name : 'animation_' + e,
      a = [],
      r = [],
      o = [],
      A = [],
      l = [];
    for (let c = 0, h = s.channels.length; c < h; c++) {
      const e = s.channels[c],
        t = s.samplers[e.sampler],
        i = e.target,
        n = i.node,
        h = void 0 !== s.parameters ? s.parameters[t.input] : t.input,
        d = void 0 !== s.parameters ? s.parameters[t.output] : t.output;
      void 0 !== i.node &&
        (a.push(this.getDependency('node', n)),
        r.push(this.getDependency('accessor', h)),
        o.push(this.getDependency('accessor', d)),
        A.push(t),
        l.push(i));
    }
    return Promise.all([
      Promise.all(a),
      Promise.all(r),
      Promise.all(o),
      Promise.all(A),
      Promise.all(l),
    ]).then(function (e) {
      const t = e[0],
        a = e[1],
        r = e[2],
        o = e[3],
        A = e[4],
        l = [];
      for (let s = 0, n = t.length; s < n; s++) {
        const e = t[s],
          n = a[s],
          c = r[s],
          h = o[s],
          d = A[s];
        if (void 0 === e) continue;
        e.updateMatrix && e.updateMatrix();
        const g = i._createAnimationTracks(e, n, c, h, d);
        if (g) for (let t = 0; t < g.length; t++) l.push(g[t]);
      }
      const c = new Ae(n, void 0, l);
      return (dn(c, s), c);
    });
  }
  createNodeMesh(e) {
    const t = this.json,
      i = this,
      s = t.nodes[e];
    return void 0 === s.mesh
      ? null
      : i.getDependency('mesh', s.mesh).then(function (e) {
          const t = i._getNodeRef(i.meshCache, s.mesh, e);
          return (
            void 0 !== s.weights &&
              t.traverse(function (e) {
                if (e.isMesh)
                  for (let t = 0, i = s.weights.length; t < i; t++)
                    e.morphTargetInfluences[t] = s.weights[t];
              }),
            t
          );
        });
  }
  loadNode(e) {
    const t = this,
      i = this.json.nodes[e],
      s = t._loadNodeShallow(e),
      n = [],
      a = i.children || [];
    for (let o = 0, A = a.length; o < A; o++) n.push(t.getDependency('node', a[o]));
    const r = void 0 === i.skin ? Promise.resolve(null) : t.getDependency('skin', i.skin);
    return Promise.all([s, Promise.all(n), r]).then(function (e) {
      const t = e[0],
        i = e[1],
        s = e[2];
      null !== s &&
        t.traverse(function (e) {
          e.isSkinnedMesh && e.bind(s, bn);
        });
      for (let n = 0, a = i.length; n < a; n++) t.add(i[n]);
      return t;
    });
  }
  _loadNodeShallow(e) {
    const t = this.json,
      i = this.extensions,
      s = this;
    if (void 0 !== this.nodeCache[e]) return this.nodeCache[e];
    const n = t.nodes[e],
      a = n.name ? s.createUniqueName(n.name) : '',
      r = [],
      o = s._invokeOne(function (t) {
        return t.createNodeMesh && t.createNodeMesh(e);
      });
    return (
      o && r.push(o),
      void 0 !== n.camera &&
        r.push(
          s.getDependency('camera', n.camera).then(function (e) {
            return s._getNodeRef(s.cameraCache, n.camera, e);
          })
        ),
      s
        ._invokeAll(function (t) {
          return t.createNodeAttachment && t.createNodeAttachment(e);
        })
        .forEach(function (e) {
          r.push(e);
        }),
      (this.nodeCache[e] = Promise.all(r).then(function (t) {
        let r;
        if (
          ((r =
            !0 === n.isBone ? new le() : t.length > 1 ? new se() : 1 === t.length ? t[0] : new D()),
          r !== t[0])
        )
          for (let e = 0, i = t.length; e < i; e++) r.add(t[e]);
        if (
          (n.name && ((r.userData.name = n.name), (r.name = a)),
          dn(r, n),
          n.extensions && hn(i, r, n),
          void 0 !== n.matrix)
        ) {
          const e = new x();
          (e.fromArray(n.matrix), r.applyMatrix4(e));
        } else
          (void 0 !== n.translation && r.position.fromArray(n.translation),
            void 0 !== n.rotation && r.quaternion.fromArray(n.rotation),
            void 0 !== n.scale && r.scale.fromArray(n.scale));
        if (s.associations.has(r)) {
          if (void 0 !== n.mesh && s.meshCache.refs[n.mesh] > 1) {
            const e = s.associations.get(r);
            s.associations.set(r, { ...e });
          }
        } else s.associations.set(r, {});
        return ((s.associations.get(r).nodes = e), r);
      })),
      this.nodeCache[e]
    );
  }
  loadScene(e) {
    const t = this.extensions,
      i = this.json.scenes[e],
      s = this,
      n = new se();
    (i.name && (n.name = s.createUniqueName(i.name)), dn(n, i), i.extensions && hn(t, n, i));
    const a = i.nodes || [],
      r = [];
    for (let o = 0, A = a.length; o < A; o++) r.push(s.getDependency('node', a[o]));
    return Promise.all(r).then(function (e) {
      for (let t = 0, i = e.length; t < i; t++) n.add(e[t]);
      return (
        (s.associations = (e => {
          const t = new Map();
          for (const [i, n] of s.associations) (i instanceof z || i instanceof de) && t.set(i, n);
          return (
            e.traverse(e => {
              const i = s.associations.get(e);
              null != i && t.set(e, i);
            }),
            t
          );
        })(n)),
        n
      );
    });
  }
  _createAnimationTracks(e, t, i, s, n) {
    const a = [],
      r = e.name ? e.name : e.uuid,
      o = [];
    let A;
    switch (
      (an[n.path] === an.weights
        ? e.traverse(function (e) {
            e.morphTargetInfluences && o.push(e.name ? e.name : e.uuid);
          })
        : o.push(r),
      an[n.path])
    ) {
      case an.weights:
        A = ue;
        break;
      case an.rotation:
        A = pe;
        break;
      case an.translation:
      case an.scale:
        A = ge;
        break;
      default:
        if (1 === i.itemSize) A = ue;
        else A = ge;
    }
    const l = void 0 !== s.interpolation ? rn[s.interpolation] : he,
      c = this._getArrayFromAccessor(i);
    for (let h = 0, d = o.length; h < d; h++) {
      const e = new A(o[h] + '.' + an[n.path], t.array, c, l);
      ('CUBICSPLINE' === s.interpolation && this._createCubicSplineTrackInterpolant(e), a.push(e));
    }
    return a;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const e = mn(t.constructor),
        i = new Float32Array(t.length);
      for (let s = 0, n = t.length; s < n; s++) i[s] = t[s] * e;
      t = i;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    ((e.createInterpolant = function (e) {
      return new (this instanceof pe ? $s : Ys)(
        this.times,
        this.values,
        this.getValueSize() / 3,
        e
      );
    }),
      (e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0));
  }
}
function In(e, t, i) {
  const s = t.attributes,
    n = [];
  function a(t, s) {
    return i.getDependency('accessor', t).then(function (t) {
      e.setAttribute(s, t);
    });
  }
  for (const r in s) {
    const t = nn[r] || r.toLowerCase();
    t in e.attributes || n.push(a(s[r], t));
  }
  if (void 0 !== t.indices && !e.index) {
    const s = i.getDependency('accessor', t.indices).then(function (t) {
      e.setIndex(t);
    });
    n.push(s);
  }
  return (
    m.workingColorSpace !== h &&
      'COLOR_0' in s &&
      console.warn(
        `THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${m.workingColorSpace}" not supported.`
      ),
    dn(e, t),
    (function (e, t, i) {
      const s = t.attributes,
        n = new fe();
      if (void 0 === s.POSITION) return;
      {
        const e = i.json.accessors[s.POSITION],
          t = e.min,
          a = e.max;
        if (void 0 === t || void 0 === a)
          return void console.warn(
            'THREE.GLTFLoader: Missing min/max properties for accessor POSITION.'
          );
        if ((n.set(new S(t[0], t[1], t[2]), new S(a[0], a[1], a[2])), e.normalized)) {
          const t = mn(Zs[e.componentType]);
          (n.min.multiplyScalar(t), n.max.multiplyScalar(t));
        }
      }
      const a = t.targets;
      if (void 0 !== a) {
        const e = new S(),
          t = new S();
        for (let s = 0, n = a.length; s < n; s++) {
          const n = a[s];
          if (void 0 !== n.POSITION) {
            const s = i.json.accessors[n.POSITION],
              a = s.min,
              r = s.max;
            if (void 0 !== a && void 0 !== r) {
              if (
                (t.setX(Math.max(Math.abs(a[0]), Math.abs(r[0]))),
                t.setY(Math.max(Math.abs(a[1]), Math.abs(r[1]))),
                t.setZ(Math.max(Math.abs(a[2]), Math.abs(r[2]))),
                s.normalized)
              ) {
                const e = mn(Zs[s.componentType]);
                t.multiplyScalar(e);
              }
              e.max(t);
            } else
              console.warn('THREE.GLTFLoader: Missing min/max properties for accessor POSITION.');
          }
        }
        n.expandByVector(e);
      }
      e.boundingBox = n;
      const r = new Ie();
      (n.getCenter(r.center), (r.radius = n.min.distanceTo(n.max) / 2), (e.boundingSphere = r));
    })(e, t, i),
    Promise.all(n).then(function () {
      return void 0 !== t.targets
        ? (function (e, t, i) {
            let s = !1,
              n = !1,
              a = !1;
            for (let l = 0, c = t.length; l < c; l++) {
              const e = t[l];
              if (
                (void 0 !== e.POSITION && (s = !0),
                void 0 !== e.NORMAL && (n = !0),
                void 0 !== e.COLOR_0 && (a = !0),
                s && n && a)
              )
                break;
            }
            if (!s && !n && !a) return Promise.resolve(e);
            const r = [],
              o = [],
              A = [];
            for (let l = 0, c = t.length; l < c; l++) {
              const c = t[l];
              if (s) {
                const t =
                  void 0 !== c.POSITION
                    ? i.getDependency('accessor', c.POSITION)
                    : e.attributes.position;
                r.push(t);
              }
              if (n) {
                const t =
                  void 0 !== c.NORMAL ? i.getDependency('accessor', c.NORMAL) : e.attributes.normal;
                o.push(t);
              }
              if (a) {
                const t =
                  void 0 !== c.COLOR_0
                    ? i.getDependency('accessor', c.COLOR_0)
                    : e.attributes.color;
                A.push(t);
              }
            }
            return Promise.all([Promise.all(r), Promise.all(o), Promise.all(A)]).then(function (t) {
              const i = t[0],
                r = t[1],
                o = t[2];
              return (
                s && (e.morphAttributes.position = i),
                n && (e.morphAttributes.normal = r),
                a && (e.morphAttributes.color = o),
                (e.morphTargetsRelative = !0),
                e
              );
            });
          })(e, t.targets, i)
        : e;
    })
  );
}
class Cn {
  constructor(e = 4) {
    ((this.pool = e),
      (this.queue = []),
      (this.workers = []),
      (this.workersResolve = []),
      (this.workerStatus = 0),
      (this.workerCreator = null));
  }
  _initWorker(e) {
    if (!this.workers[e]) {
      const t = this.workerCreator();
      (t.addEventListener('message', this._onMessage.bind(this, e)), (this.workers[e] = t));
    }
  }
  _getIdleWorker() {
    for (let e = 0; e < this.pool; e++) if (!(this.workerStatus & (1 << e))) return e;
    return -1;
  }
  _onMessage(e, t) {
    const i = this.workersResolve[e];
    if ((i && i(t), this.queue.length)) {
      const { resolve: t, msg: i, transfer: s } = this.queue.shift();
      ((this.workersResolve[e] = t), this.workers[e].postMessage(i, s));
    } else this.workerStatus ^= 1 << e;
  }
  setWorkerCreator(e) {
    this.workerCreator = e;
  }
  setWorkerLimit(e) {
    this.pool = e;
  }
  postMessage(e, t) {
    return new Promise(i => {
      const s = this._getIdleWorker();
      -1 !== s
        ? (this._initWorker(s),
          (this.workerStatus |= 1 << s),
          (this.workersResolve[s] = i),
          this.workers[s].postMessage(e, t))
        : this.queue.push({ resolve: i, msg: e, transfer: t });
    });
  }
  dispose() {
    (this.workers.forEach(e => e.terminate()),
      (this.workersResolve.length = 0),
      (this.workers.length = 0),
      (this.queue.length = 0),
      (this.workerStatus = 0));
  }
}
const En = 9,
  Bn = 15,
  yn = 16,
  wn = 22,
  Qn = 37,
  vn = 43,
  xn = 76,
  Sn = 83,
  Rn = 97,
  Mn = 100,
  Tn = 103,
  Dn = 109,
  kn = 122,
  Fn = 123,
  Ln = 131,
  Un = 132,
  Gn = 133,
  _n = 134,
  Pn = 137,
  Nn = 138,
  On = 139,
  Hn = 140,
  qn = 141,
  jn = 142,
  zn = 145,
  Kn = 146,
  Vn = 148,
  Jn = 152,
  Yn = 153,
  Wn = 154,
  $n = 155,
  Xn = 156,
  Zn = 157,
  ea = 158,
  ta = 165,
  ia = 166,
  sa = 1000054e3,
  na = 1000054001,
  aa = 1000054004,
  ra = 1000054005,
  oa = 1000066e3,
  Aa = 1000066004;
class la {
  constructor(e, t, i, s) {
    ((this._dataView = void 0),
      (this._littleEndian = void 0),
      (this._offset = void 0),
      (this._dataView = new DataView(e.buffer, e.byteOffset + t, i)),
      (this._littleEndian = s),
      (this._offset = 0));
  }
  _nextUint8() {
    const e = this._dataView.getUint8(this._offset);
    return ((this._offset += 1), e);
  }
  _nextUint16() {
    const e = this._dataView.getUint16(this._offset, this._littleEndian);
    return ((this._offset += 2), e);
  }
  _nextUint32() {
    const e = this._dataView.getUint32(this._offset, this._littleEndian);
    return ((this._offset += 4), e);
  }
  _nextUint64() {
    const e =
      this._dataView.getUint32(this._offset, this._littleEndian) +
      2 ** 32 * this._dataView.getUint32(this._offset + 4, this._littleEndian);
    return ((this._offset += 8), e);
  }
  _nextInt32() {
    const e = this._dataView.getInt32(this._offset, this._littleEndian);
    return ((this._offset += 4), e);
  }
  _nextUint8Array(e) {
    const t = new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + this._offset, e);
    return ((this._offset += e), t);
  }
  _skip(e) {
    return ((this._offset += e), this);
  }
  _scan(e, t = 0) {
    const i = this._offset;
    let s = 0;
    for (; this._dataView.getUint8(this._offset) !== t && s < e; ) (s++, this._offset++);
    return (
      s < e && this._offset++,
      new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + i, s)
    );
  }
}
const ca = [171, 75, 84, 88, 32, 50, 48, 187, 13, 10, 26, 10];
function ha(e) {
  return new TextDecoder().decode(e);
}
let da, ga, ua;
const pa = {
  env: {
    emscripten_notify_memory_growth: function (e) {
      ua = new Uint8Array(ga.exports.memory.buffer);
    },
  },
};
class ma {
  init() {
    return (
      da ||
      ((da =
        'undefined' != typeof fetch
          ? fetch('data:application/wasm;base64,' + ba)
              .then(e => e.arrayBuffer())
              .then(e => WebAssembly.instantiate(e, pa))
              .then(this._init)
          : WebAssembly.instantiate(Buffer.from(ba, 'base64'), pa).then(this._init)),
      da)
    );
  }
  _init(e) {
    ((ga = e.instance), pa.env.emscripten_notify_memory_growth(0));
  }
  decode(e, t = 0) {
    if (!ga) throw new Error('ZSTDDecoder: Await .init() before decoding.');
    const i = e.byteLength,
      s = ga.exports.malloc(i);
    (ua.set(e, s), (t = t || Number(ga.exports.ZSTD_findDecompressedSize(s, i))));
    const n = ga.exports.malloc(t),
      a = ga.exports.ZSTD_decompress(n, t, s, i),
      r = ua.slice(n, n + a);
    return (ga.exports.free(s), ga.exports.free(n), r);
  }
}
const ba =
  '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IAMNACAEQQNxBEADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAsMAgsgAkEDTQ0AIAIhBANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIARBfGoiBEEDSw0ACyACQQNxIQILIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8wICAn8BfgJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa0iBUIghiAFhCEFIAMgBGohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAIajYCACADCy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAFajYCACADCx8AIAAgASACKAIEEAg2AgAgARAEGiAAIAJBCGo2AgQLCAAgAGdBH3MLugUBDX8jAEEQayIKJAACfyAEQQNNBEAgCkEANgIMIApBDGogAyAEEAsaIAAgASACIApBDGpBBBAVIgBBbCAAEAMbIAAgACAESxsMAQsgAEEAIAEoAgBBAXRBAmoQECENQVQgAygAACIGQQ9xIgBBCksNABogAiAAQQVqNgIAIAMgBGoiAkF8aiEMIAJBeWohDiACQXtqIRAgAEEGaiELQQQh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ASIDNgLE4AEgACgCvOABIQQgACABNgK84AEgACABIAJqNgK44AEgACABIAQgA2tqNgLA4AELpgEBAX8gACAAKALs4QEQFjYCyOABIABCADcD+OABIABCADcDuOABIABBwOABakIANwMAIABBqNAAaiIBQYyAgOAANgIAIABBADYCmOIBIABCADcDiOEBIABCAzcDgOEBIABBrNABakHgEikCADcCACAAQbTQAWpB6BIoAgA2AgAgACABNgIMIAAgAEGYIGo2AgggACAAQaAwajYCBCAAIABBEGo2AgALYQEBf0G4fyEDAkAgAUEDSQ0AIAIgABAhIgFBA3YiADYCCCACIAFBAXE2AgQgAiABQQF2QQNxIgM2AgACQCADQX9qIgFBAksNAAJAIAFBAWsOAgEAAgtBbA8LIAAhAwsgAwsMACAAIAEgAkEAEC4LiAQCA38CfiADEBYhBCAAQQBBKBAQIQAgBCACSwRAIAQPCyABRQRAQX8PCwJAAkAgA0EBRg0AIAEoAAAiBkGo6r5pRg0AQXYhAyAGQXBxQdDUtMIBRw0BQQghAyACQQhJDQEgAEEAQSgQECEAIAEoAAQhASAAQQE2AhQgACABrTcDAEEADwsgASACIAMQLyIDIAJLDQAgACADNgIYQXIhAyABIARqIgVBf2otAAAiAkEIcQ0AIAJBIHEiBkUEQEFwIQMgBS0AACIFQacBSw0BIAVBB3GtQgEgBUEDdkEKaq2GIgdCA4h+IAd8IQggBEEBaiEECyACQQZ2IQMgAkECdiEFAkAgAkEDcUF/aiICQQJLBEBBACECDAELAkACQAJAIAJBAWsOAgECAAsgASAEai0AACECIARBAWohBAwCCyABIARqLwAAIQIgBEECaiEEDAELIAEgBGooAAAhAiAEQQRqIQQLIAVBAXEhBQJ+AkACQAJAIANBf2oiA0ECTQRAIANBAWsOAgIDAQtCfyAGRQ0DGiABIARqMQAADAMLIAEgBGovAACtQoACfAwCCyABIARqKAAArQwBCyABIARqKQAACyEHIAAgBTYCICAAIAI2AhwgACAHNwMAQQAhAyAAQQA2AhQgACAHIAggBhsiBzcDCCAAIAdCgIAIIAdCgIAIVBs+AhALIAMLWwEBf0G4fyEDIAIQFiICIAFNBH8gACACakF/ai0AACIAQQNxQQJ0QaAeaigC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C0Egak8NAQsgByAHKQNoNwMQIAcgBykDYDcDCCAEIA0gB0EIaiAHQdwAaiAPIA4gESAQEB4hCwwBCyACIARqIQggBCAKEAcgAkERTwRAIARBEGohAgNAIAIgCkEQaiIKEAcgAkEQaiICIAhJDQALCyAIIAlrIQIgByATNgJcIAkgCCAOa0sEQCAJIAggEWtLBEBBbCELDAILIBAgAiAOayICaiIKIANqIBBNBEAgCCAKIAMQDxoMAgsgCCAKQQAgAmsQDyEIIAcgAiADaiIDNgJkIAggAmshCCAOIQILIAlBEE8EQCADIAhqIQMDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALDAELAkAgCUEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgCUECdCIDQcAeaigCAGoiAhAXIAIgA0HgHmooAgBrIQIgBygCZCEDDAELIAggAhAMCyADQQlJDQAgAyAIaiEDIAhBCGoiCCACQQhqIgJrQQ9MBEADQCAIIAIQDCACQQhqIQIgCEEIaiIIIANJDQAMAgALAAsDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALCyAHQRhqEAQaIAsgDCALEAMiAhshDCAEIAQgC2ogAhshBCAFQX9qIgUNAAsgDBADDQFBbCEMIAdBGGoQBEECSQ0BQQAhCANAIAhBA0cEQCAAIAhBAnQiAmpBrNABaiACIAdqKAJENgIAIAhBAWohCAwBCwsgBygCXCEIC0G6fyEMIA8gCGsiACANIARrSw0AIAQEfyAEIAggABALIABqBUEACyABayEMCyAHQfAAaiQAIAwLkRcCFn8FfiMAQdABayIHJAAgByAAKALw4QEiCDYCvAEgASACaiESIAggACgCgOIBaiETAkACQCAFRQRAIAEhAwwBCyAAKALE4AEhESAAKALA4AEhFSAAKAK84AEhDyAAQQE2AozhAUEAIQgDQCAIQQNHBEAgByAIQQJ0IgJqIAAgAmpBrNABaigCADYCVCAIQQFqIQgMAQsLIAcgETYCZCAHIA82AmAgByABIA9rNgJoQWwhECAHQShqIAMgBBAGEAMNASAFQQQgBUEESBshFyAHQTxqIAdBKGogACgCABATIAdBxABqIAdBKGogACgCCBATIAdBzABqIAdB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IAdB0AFqJAAgEAslACAAQgA3AgAgAEEAOwEIIABBADoACyAAIAE2AgwgACACOgAKC7QFAQN/IwBBMGsiBCQAIABB/wFqIgVBfWohBgJAIAMvAQIEQCAEQRhqIAEgAhAGIgIQAw0BIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahASOgAAIAMgBEEIaiAEQRhqEBI6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0FIAEgBEEQaiAEQRhqEBI6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBSABIARBCGogBEEYahASOgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEjoAACABIAJqIABrIQIMAwsgAyAEQRBqIARBGGoQEjoAAiADIARBCGogBEEYahASOgADIANBBGohAwwAAAsACyAEQRhqIAEgAhAGIgIQAw0AIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahAROgAAIAMgBEEIaiAEQRhqEBE6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0EIAEgBEEQaiAEQRhqEBE6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBCABIARBCGogBEEYahAROgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEToAACABIAJqIABrIQIMAgsgAyAEQRBqIARBGGoQEToAAiADIARBCGogBEEYahAROgADIANBBGohAwwAAAsACyAEQTBqJAAgAgtpAQF/An8CQAJAIAJBB00NACABKAAAQbfIwuF+Rw0AIAAgASgABDYCmOIBQWIgAEEQaiABIAIQPiIDEAMNAhogAEKBgICAEDcDiOEBIAAgASADaiACIANrECoMAQsgACABIAIQKgtBAAsLrQMBBn8jAEGAAWsiAyQAQWIhCAJAIAJBCUkNACAAQZjQAGogAUEIaiIEIAJBeGogAEGY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wOABCwutAgIEfwF+IwBBQGoiBCQAAkACQCACQQhJDQAgASgAAEFwcUHQ1LTCAUcNACABIAIQIiEBIABCADcDCCAAQQA2AgQgACABNgIADAELIARBGGogASACEC0iAxADBEAgACADEBoMAQsgAwRAIABBuH8QGgwBCyACIAQoAjAiA2shAiABIANqIQMDQAJAIAAgAyACIARBCGoQLCIFEAMEfyAFBSACIAVBA2oiBU8NAUG4fwsQGgwCCyAGQQFqIQYgAiAFayECIAMgBWohAyAEKAIMRQ0ACyAEKAI4BEAgAkEDTQRAIABBuH8QGgwCCyADQQRqIQMLIAQoAighAiAEKQMYIQcgAEEANgIEIAAgAyABazYCACAAIAIgBmytIAcgB0J/URs3AwgLIARBQGskAAslAQF/IwBBEGsiAiQAIAIgACABEFEgAigCACEAIAJBEGokACAAC30BBH8jAEGQBGsiBCQAIARB/wE2AggCQCAEQRBqIARBCGogBEEMaiABIAIQFSIGEAMEQCAGIQUMAQtBVCEFIAQoAgwiB0EGSw0AIAMgBEEQaiAEKAIIIAcQQSIFEAMNACAAIAEgBmogAiAGayADEDwhBQsgBEGQBGokACAFC4cBAgJ/An5BABAWIQMCQANAIAEgA08EQAJAIAAoAABBcHFB0NS0wgFGBEAgACABECIiAhADRQ0BQn4PCyAAIAEQVSIEQn1WDQMgBCAFfCIFIARUIQJCfiEEIAINAyAAIAEQUiICEAMNAwsgASACayEBIAAgAmohAAwBCwtCfiAFIAEbIQQLIAQLPwIBfwF+IwBBMGsiAiQAAn5CfiACQQhqIAAgARAtDQAaQgAgAigCHEEBRg0AGiACKQMICyEDIAJBMGokACADC40BAQJ/IwBBMGsiASQAAkAgAEUNACAAKAKI4gENACABIABB/OEBaigCADYCKCABIAApAvThATcDICAAEDAgACgCqOIBIQIgASABKAIoNgIYIAEgASkDIDcDECACIAFBEGoQGyAAQQA2AqjiASABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALKgECfyMAQRBrIgAkACAAQQA2AgggAEIANwMAIAAQWCEBIABBEGokACABC4cBAQN/IwBBEGsiAiQAAkAgACgCAEUgACgCBEVzDQAgAiAAKAIINgIIIAIgACkCADcDAAJ/IAIoAgAiAQRAIAIoAghBqOMJIAERBQAMAQtBqOMJECgLIgFFDQAgASAAKQIANwL04QEgAUH84QFqIAAoAgg2AgAgARBZIAEhAwsgAkEQaiQAIAMLywEBAn8jAEEgayIBJAAgAEGBgIDAADYCtOIBIABBADYCiOIBIABBADYC7OEBIABCADcDkOIBIABBADYCpOMJIABBADYC3OIBIABCADcCzOIBIABBADYCvOIBIABBADYCxOABIABCADcCnOIBIABBpOIBakIANwIAIABBrOIBakEANgIAIAFCADcCECABQgA3AhggASABKQMYNwMIIAEgASkDEDcDACABKAIIQQh2QQFxIQIgAEEANgLg4gEgACACNgKM4gEgAUEgaiQAC3YBA38jAEEwayIBJAAgAARAIAEgAEHE0AFqIgIoAgA2AiggASAAKQK80AE3AyAgACgCACEDIAEgAigCADYCGCABIAApArzQATcDECADIAFBEGoQGyABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALzAEBAX8gACABKAK00AE2ApjiASAAIAEoAgQiAjYCwOABIAAgAjYCvOABIAAgAiABKAIIaiICNgK44AEgACACNgLE4AEgASgCuNABBEAgAEKBgICAEDcDiOEBIAAgAUGk0ABqNgIMIAAgAUGUIGo2AgggACABQZwwajYCBCAAIAFBDGo2AgAgAEGs0AFqIAFBqNABaigCADYCACAAQbDQAWogAUGs0AFqKAIANgIAIABBtNABaiABQbDQAWooAgA2AgAPCyAAQgA3A4jhAQs7ACACRQRAQbp/DwsgBEUEQEFsDwsgAiAEEGAEQCAAIAEgAiADIAQgBRBhDwsgACABIAIgAyAEIAUQZQtGAQF/IwBBEGsiBSQAIAVBCGogBBAOAn8gBS0ACQRAIAAgASACIAMgBBAyDAELIAAgASACIAMgBBA0CyEAIAVBEGokACAACzQAIAAgAyAEIAUQNiIFEAMEQCAFDwsgBSAESQR/IAEgAiADIAVqIAQgBWsgABA1BUG4fwsLRgEBfyMAQRBrIgUkACAFQQhqIAQQDgJ/IAUtAAkEQCAAIAEgAiADIAQQYgwBCyAAIAEgAiADIAQQNQshACAFQRBqJAAgAAtZAQF/QQ8hAiABIABJBEAgAUEE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';
m.spaces[c];
const fa = new WeakMap();
let Ia,
  Ca = 0;
class Ea extends A {
  constructor(e) {
    (super(e),
      (this.transcoderPath = ''),
      (this.transcoderBinary = null),
      (this.transcoderPending = null),
      (this.workerPool = new Cn()),
      (this.workerSourceURL = ''),
      (this.workerConfig = null),
      'undefined' != typeof MSC_TRANSCODER &&
        console.warn(
          'THREE.KTX2Loader: Please update to latest "basis_transcoder". "msc_basis_transcoder" is no longer supported in three.js r125+.'
        ));
  }
  setTranscoderPath(e) {
    return ((this.transcoderPath = e), this);
  }
  setWorkerLimit(e) {
    return (this.workerPool.setWorkerLimit(e), this);
  }
  async detectSupportAsync(e) {
    return (
      console.warn(
        'KTX2Loader: "detectSupportAsync()" has been deprecated. Use "detectSupport()" and "await renderer.init();" when creating the renderer.'
      ),
      await e.init(),
      this.detectSupport(e)
    );
  }
  detectSupport(e) {
    return (
      !0 === e.isWebGPURenderer
        ? (this.workerConfig = {
            astcSupported: e.hasFeature('texture-compression-astc'),
            astcHDRSupported: !1,
            etc1Supported: e.hasFeature('texture-compression-etc1'),
            etc2Supported: e.hasFeature('texture-compression-etc2'),
            dxtSupported: e.hasFeature('texture-compression-s3tc'),
            bptcSupported: e.hasFeature('texture-compression-bc'),
            pvrtcSupported: e.hasFeature('texture-compression-pvrtc'),
          })
        : ((this.workerConfig = {
            astcSupported: e.extensions.has('WEBGL_compressed_texture_astc'),
            astcHDRSupported:
              e.extensions.has('WEBGL_compressed_texture_astc') &&
              e.extensions
                .get('WEBGL_compressed_texture_astc')
                .getSupportedProfiles()
                .includes('hdr'),
            etc1Supported: e.extensions.has('WEBGL_compressed_texture_etc1'),
            etc2Supported: e.extensions.has('WEBGL_compressed_texture_etc'),
            dxtSupported: e.extensions.has('WEBGL_compressed_texture_s3tc'),
            bptcSupported: e.extensions.has('EXT_texture_compression_bptc'),
            pvrtcSupported:
              e.extensions.has('WEBGL_compressed_texture_pvrtc') ||
              e.extensions.has('WEBKIT_WEBGL_compressed_texture_pvrtc'),
          }),
          'undefined' != typeof navigator &&
            navigator.platform.indexOf('Linux') >= 0 &&
            navigator.userAgent.indexOf('Firefox') >= 0 &&
            this.workerConfig.astcSupported &&
            this.workerConfig.etc2Supported &&
            this.workerConfig.bptcSupported &&
            this.workerConfig.dxtSupported &&
            ((this.workerConfig.astcSupported = !1), (this.workerConfig.etc2Supported = !1))),
      this
    );
  }
  init() {
    if (!this.transcoderPending) {
      const e = new l(this.manager);
      (e.setPath(this.transcoderPath), e.setWithCredentials(this.withCredentials));
      const t = e.loadAsync('basis_transcoder.js'),
        i = new l(this.manager);
      (i.setPath(this.transcoderPath),
        i.setResponseType('arraybuffer'),
        i.setWithCredentials(this.withCredentials));
      const s = i.loadAsync('basis_transcoder.wasm');
      ((this.transcoderPending = Promise.all([t, s]).then(([e, t]) => {
        const i = Ea.BasisWorker.toString(),
          s = [
            '/* constants */',
            'let _EngineFormat = ' + JSON.stringify(Ea.EngineFormat),
            'let _EngineType = ' + JSON.stringify(Ea.EngineType),
            'let _TranscoderFormat = ' + JSON.stringify(Ea.TranscoderFormat),
            'let _BasisFormat = ' + JSON.stringify(Ea.BasisFormat),
            '/* basis_transcoder.js */',
            e,
            '/* worker */',
            i.substring(i.indexOf('{') + 1, i.lastIndexOf('}')),
          ].join('\n');
        ((this.workerSourceURL = URL.createObjectURL(new Blob([s]))),
          (this.transcoderBinary = t),
          this.workerPool.setWorkerCreator(() => {
            const e = new Worker(this.workerSourceURL),
              t = this.transcoderBinary.slice(0);
            return (
              e.postMessage({ type: 'init', config: this.workerConfig, transcoderBinary: t }, [t]),
              e
            );
          }));
      })),
        Ca > 0 &&
          console.warn(
            'THREE.KTX2Loader: Multiple active KTX2 loaders may cause performance issues. Use a single KTX2Loader instance, or call .dispose() on old instances.'
          ),
        Ca++);
    }
    return this.transcoderPending;
  }
  load(e, t, i, s) {
    if (null === this.workerConfig)
      throw new Error(
        'THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.'
      );
    const n = new l(this.manager);
    (n.setPath(this.path),
      n.setCrossOrigin(this.crossOrigin),
      n.setWithCredentials(this.withCredentials),
      n.setRequestHeader(this.requestHeader),
      n.setResponseType('arraybuffer'),
      n.load(
        e,
        e => {
          this.parse(e, t, s);
        },
        i,
        s
      ));
  }
  parse(e, t, i) {
    if (null === this.workerConfig)
      throw new Error(
        'THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.'
      );
    if (fa.has(e)) {
      return fa.get(e).promise.then(t).catch(i);
    }
    this._createTexture(e)
      .then(e => (t ? t(e) : null))
      .catch(i);
  }
  _createTextureFrom(e, t) {
    const {
      type: i,
      error: s,
      data: { faces: n, width: a, height: r, format: o, type: A, dfdFlags: l },
    } = e;
    if ('error' === i) return Promise.reject(s);
    let c;
    if (6 === t.faceCount) c = new Ce(n, o, A);
    else {
      const e = n[0].mipmaps;
      c = t.layerCount > 1 ? new Ee(e, a, r, t.layerCount, o, A) : new Be(e, a, r, o, A);
    }
    return (
      (c.minFilter = 1 === n[0].mipmaps.length ? P : L),
      (c.magFilter = P),
      (c.generateMipmaps = !1),
      (c.needsUpdate = !0),
      (c.colorSpace = Qa(t)),
      (c.premultiplyAlpha = !!(1 & l)),
      c
    );
  }
  async _createTexture(e, t = {}) {
    const i = (function (e) {
        const t = new Uint8Array(e.buffer, e.byteOffset, ca.length);
        if (
          t[0] !== ca[0] ||
          t[1] !== ca[1] ||
          t[2] !== ca[2] ||
          t[3] !== ca[3] ||
          t[4] !== ca[4] ||
          t[5] !== ca[5] ||
          t[6] !== ca[6] ||
          t[7] !== ca[7] ||
          t[8] !== ca[8] ||
          t[9] !== ca[9] ||
          t[10] !== ca[10] ||
          t[11] !== ca[11]
        )
          throw new Error('Missing KTX 2.0 identifier.');
        const i = {
            vkFormat: 0,
            typeSize: 1,
            pixelWidth: 0,
            pixelHeight: 0,
            pixelDepth: 0,
            layerCount: 0,
            faceCount: 1,
            levelCount: 0,
            supercompressionScheme: 0,
            levels: [],
            dataFormatDescriptor: [
              {
                vendorId: 0,
                descriptorType: 0,
                versionNumber: 2,
                colorModel: 0,
                colorPrimaries: 1,
                transferFunction: 2,
                flags: 0,
                texelBlockDimension: [0, 0, 0, 0],
                bytesPlane: [0, 0, 0, 0, 0, 0, 0, 0],
                samples: [],
              },
            ],
            keyValue: {},
            globalData: null,
          },
          s = 17 * Uint32Array.BYTES_PER_ELEMENT,
          n = new la(e, ca.length, s, !0);
        ((i.vkFormat = n._nextUint32()),
          (i.typeSize = n._nextUint32()),
          (i.pixelWidth = n._nextUint32()),
          (i.pixelHeight = n._nextUint32()),
          (i.pixelDepth = n._nextUint32()),
          (i.layerCount = n._nextUint32()),
          (i.faceCount = n._nextUint32()),
          (i.levelCount = n._nextUint32()),
          (i.supercompressionScheme = n._nextUint32()));
        const a = n._nextUint32(),
          r = n._nextUint32(),
          o = n._nextUint32(),
          A = n._nextUint32(),
          l = n._nextUint64(),
          c = n._nextUint64(),
          h = 3 * Math.max(i.levelCount, 1) * 8,
          d = new la(e, ca.length + s, h, !0);
        for (let G = 0, _ = Math.max(i.levelCount, 1); G < _; G++)
          i.levels.push({
            levelData: new Uint8Array(e.buffer, e.byteOffset + d._nextUint64(), d._nextUint64()),
            uncompressedByteLength: d._nextUint64(),
          });
        const g = new la(e, a, r, !0);
        g._skip(4);
        const u = g._nextUint16(),
          p = g._nextUint16(),
          m = g._nextUint16(),
          b = g._nextUint16(),
          f = {
            vendorId: u,
            descriptorType: p,
            versionNumber: m,
            colorModel: g._nextUint8(),
            colorPrimaries: g._nextUint8(),
            transferFunction: g._nextUint8(),
            flags: g._nextUint8(),
            texelBlockDimension: [g._nextUint8(), g._nextUint8(), g._nextUint8(), g._nextUint8()],
            bytesPlane: [
              g._nextUint8(),
              g._nextUint8(),
              g._nextUint8(),
              g._nextUint8(),
              g._nextUint8(),
              g._nextUint8(),
              g._nextUint8(),
              g._nextUint8(),
            ],
            samples: [],
          },
          I = (b / 4 - 6) / 4;
        for (let G = 0; G < I; G++) {
          const e = {
            bitOffset: g._nextUint16(),
            bitLength: g._nextUint8(),
            channelType: g._nextUint8(),
            samplePosition: [g._nextUint8(), g._nextUint8(), g._nextUint8(), g._nextUint8()],
            sampleLower: Number.NEGATIVE_INFINITY,
            sampleUpper: Number.POSITIVE_INFINITY,
          };
          (64 & e.channelType
            ? ((e.sampleLower = g._nextInt32()), (e.sampleUpper = g._nextInt32()))
            : ((e.sampleLower = g._nextUint32()), (e.sampleUpper = g._nextUint32())),
            (f.samples[G] = e));
        }
        ((i.dataFormatDescriptor.length = 0), i.dataFormatDescriptor.push(f));
        const C = new la(e, o, A, !0);
        for (; C._offset < A; ) {
          const e = C._nextUint32(),
            t = C._scan(e),
            s = ha(t);
          if (((i.keyValue[s] = C._nextUint8Array(e - t.byteLength - 1)), s.match(/^ktx/i))) {
            const e = ha(i.keyValue[s]);
            i.keyValue[s] = e.substring(0, e.lastIndexOf('\0'));
          }
          C._skip(e % 4 ? 4 - (e % 4) : 0);
        }
        if (c <= 0) return i;
        const E = new la(e, l, c, !0),
          B = E._nextUint16(),
          y = E._nextUint16(),
          w = E._nextUint32(),
          Q = E._nextUint32(),
          v = E._nextUint32(),
          x = E._nextUint32(),
          S = [];
        for (let G = 0, _ = Math.max(i.levelCount, 1); G < _; G++)
          S.push({
            imageFlags: E._nextUint32(),
            rgbSliceByteOffset: E._nextUint32(),
            rgbSliceByteLength: E._nextUint32(),
            alphaSliceByteOffset: E._nextUint32(),
            alphaSliceByteLength: E._nextUint32(),
          });
        const R = l + E._offset,
          M = R + w,
          T = M + Q,
          D = T + v,
          k = new Uint8Array(e.buffer, e.byteOffset + R, w),
          F = new Uint8Array(e.buffer, e.byteOffset + M, Q),
          L = new Uint8Array(e.buffer, e.byteOffset + T, v),
          U = new Uint8Array(e.buffer, e.byteOffset + D, x);
        return (
          (i.globalData = {
            endpointCount: B,
            selectorCount: y,
            imageDescs: S,
            endpointsData: k,
            selectorsData: F,
            tablesData: L,
            extendedData: U,
          }),
          i
        );
      })(new Uint8Array(e)),
      s = i.vkFormat === oa && 167 === i.dataFormatDescriptor[0].colorModel;
    if (!(0 === i.vkFormat || (s && !this.workerConfig.astcHDRSupported)))
      return (async function (e) {
        const { vkFormat: t } = e;
        if (void 0 === ya[t]) throw new Error('THREE.KTX2Loader: Unsupported vkFormat: ' + t);
        void 0 === wa[t] && console.warn('THREE.KTX2Loader: Missing ".type" for vkFormat: ' + t);
        let i;
        2 === e.supercompressionScheme &&
          (Ia ||
            (Ia = new Promise(async e => {
              const t = new ma();
              (await t.init(), e(t));
            })),
          (i = await Ia));
        const s = [];
        for (let r = 0; r < e.levels.length; r++) {
          const n = Math.max(1, e.pixelWidth >> r),
            a = Math.max(1, e.pixelHeight >> r),
            o = e.pixelDepth ? Math.max(1, e.pixelDepth >> r) : 0,
            A = e.levels[r];
          let l, c;
          if (0 === e.supercompressionScheme) l = A.levelData;
          else {
            if (2 !== e.supercompressionScheme)
              throw new Error('THREE.KTX2Loader: Unsupported supercompressionScheme.');
            l = i.decode(A.levelData, A.uncompressedByteLength);
          }
          ((c =
            wa[t] === We
              ? new Float32Array(
                  l.buffer,
                  l.byteOffset,
                  l.byteLength / Float32Array.BYTES_PER_ELEMENT
                )
              : wa[t] === Ve
                ? new Uint16Array(
                    l.buffer,
                    l.byteOffset,
                    l.byteLength / Uint16Array.BYTES_PER_ELEMENT
                  )
                : wa[t] === Ye || wa[t] === Je
                  ? new Uint32Array(
                      l.buffer,
                      l.byteOffset,
                      l.byteLength / Uint32Array.BYTES_PER_ELEMENT
                    )
                  : l),
            s.push({ data: c, width: n, height: a, depth: o }));
        }
        const n = 0 === e.levelCount || s.length > 1;
        let a;
        if (Ba.has(ya[t]))
          ((a =
            0 === e.pixelDepth
              ? new $e(s[0].data, e.pixelWidth, e.pixelHeight)
              : new Xe(s[0].data, e.pixelWidth, e.pixelHeight, e.pixelDepth)),
            (a.minFilter = n ? _ : N),
            (a.magFilter = N),
            (a.generateMipmaps = 0 === e.levelCount));
        else {
          if (e.pixelDepth > 0) throw new Error('THREE.KTX2Loader: Unsupported pixelDepth.');
          ((a = new Be(s, e.pixelWidth, e.pixelHeight)),
            (a.minFilter = n ? L : P),
            (a.magFilter = P));
        }
        return (
          (a.mipmaps = s),
          (a.type = wa[t]),
          (a.format = ya[t]),
          (a.colorSpace = Qa(e)),
          (a.needsUpdate = !0),
          Promise.resolve(a)
        );
      })(i);
    const n = t,
      a = this.init()
        .then(() =>
          this.workerPool.postMessage({ type: 'transcode', buffer: e, taskConfig: n }, [e])
        )
        .then(e => this._createTextureFrom(e.data, i));
    return (fa.set(e, { promise: a }), a);
  }
  dispose() {
    (this.workerPool.dispose(),
      this.workerSourceURL && URL.revokeObjectURL(this.workerSourceURL),
      Ca--);
  }
}
((Ea.BasisFormat = { ETC1S: 0, UASTC: 1, UASTC_HDR: 2 }),
  (Ea.TranscoderFormat = {
    ETC1: 0,
    ETC2: 1,
    BC1: 2,
    BC3: 3,
    BC4: 4,
    BC5: 5,
    BC7_M6_OPAQUE_ONLY: 6,
    BC7_M5: 7,
    PVRTC1_4_RGB: 8,
    PVRTC1_4_RGBA: 9,
    ASTC_4x4: 10,
    ATC_RGB: 11,
    ATC_RGBA_INTERPOLATED_ALPHA: 12,
    RGBA32: 13,
    RGB565: 14,
    BGR565: 15,
    RGBA4444: 16,
    BC6H: 22,
    RGB_HALF: 24,
    RGBA_HALF: 25,
  }),
  (Ea.EngineFormat = {
    RGBAFormat: ze,
    RGBA_ASTC_4x4_Format: Le,
    RGB_BPTC_UNSIGNED_Format: it,
    RGBA_BPTC_Format: ve,
    RGBA_ETC2_EAC_Format: Oe,
    RGBA_PVRTC_4BPPV1_Format: Qe,
    RGBA_S3TC_DXT5_Format: tt,
    RGB_ETC1_Format: et,
    RGB_ETC2_Format: Ne,
    RGB_PVRTC_4BPPV1_Format: Ze,
    RGBA_S3TC_DXT1_Format: ke,
  }),
  (Ea.EngineType = { UnsignedByteType: Ke, HalfFloatType: Ve, FloatType: We }),
  (Ea.BasisWorker = function () {
    let e, t, i;
    const s = _EngineFormat,
      n = _EngineType,
      a = _TranscoderFormat,
      r = _BasisFormat;
    self.addEventListener('message', function (s) {
      const a = s.data;
      switch (a.type) {
        case 'init':
          ((e = a.config),
            (o = a.transcoderBinary),
            (t = new Promise(e => {
              ((i = { wasmBinary: o, onRuntimeInitialized: e }), BASIS(i));
            }).then(() => {
              (i.initializeBasis(),
                void 0 === i.KTX2File &&
                  console.warn('THREE.KTX2Loader: Please update Basis Universal transcoder.'));
            })));
          break;
        case 'transcode':
          t.then(() => {
            try {
              const {
                faces: t,
                buffers: s,
                width: o,
                height: h,
                hasAlpha: d,
                format: g,
                type: u,
                dfdFlags: p,
              } = (function (t) {
                const s = new i.KTX2File(new Uint8Array(t));
                function a() {
                  (s.close(), s.delete());
                }
                if (!s.isValid())
                  throw (a(), new Error('THREE.KTX2Loader:\tInvalid or unsupported .ktx2 file'));
                let o;
                if (s.isUASTC()) o = r.UASTC;
                else if (s.isETC1S()) o = r.ETC1S;
                else {
                  if (!s.isHDR()) throw new Error('THREE.KTX2Loader: Unknown Basis encoding');
                  o = r.UASTC_HDR;
                }
                const h = s.getWidth(),
                  d = s.getHeight(),
                  g = s.getLayers() || 1,
                  u = s.getLevels(),
                  p = s.getFaces(),
                  m = s.getHasAlpha(),
                  b = s.getDFDFlags(),
                  {
                    transcoderFormat: f,
                    engineFormat: I,
                    engineType: C,
                  } = (function (t, i, s, n) {
                    const a = A[t];
                    for (let r = 0; r < a.length; r++) {
                      const o = a[r];
                      if (o.if && !e[o.if]) continue;
                      if (!o.basisFormat.includes(t)) continue;
                      if (n && o.transcoderFormat.length < 2) continue;
                      if (o.needsPowerOfTwo && (!l(i) || !l(s))) continue;
                      return {
                        transcoderFormat: o.transcoderFormat[n ? 1 : 0],
                        engineFormat: o.engineFormat[n ? 1 : 0],
                        engineType: o.engineType[0],
                      };
                    }
                    throw new Error('THREE.KTX2Loader: Failed to identify transcoding target.');
                  })(o, h, d, m);
                if (!h || !d || !u) throw (a(), new Error('THREE.KTX2Loader:\tInvalid texture'));
                if (!s.startTranscoding())
                  throw (a(), new Error('THREE.KTX2Loader: .startTranscoding failed'));
                const E = [],
                  B = [];
                for (let e = 0; e < p; e++) {
                  const t = [];
                  for (let i = 0; i < u; i++) {
                    const r = [];
                    let o, A;
                    for (let t = 0; t < g; t++) {
                      const l = s.getImageLevelInfo(i, t, e);
                      (0 !== e ||
                        0 !== i ||
                        0 !== t ||
                        (l.origWidth % 4 == 0 && l.origHeight % 4 == 0) ||
                        console.warn(
                          'THREE.KTX2Loader: ETC1S and UASTC textures should use multiple-of-four dimensions.'
                        ),
                        u > 1
                          ? ((o = l.origWidth), (A = l.origHeight))
                          : ((o = l.width), (A = l.height)));
                      let c = new Uint8Array(s.getImageTranscodedSizeInBytes(i, t, 0, f));
                      const h = s.transcodeImage(c, i, t, e, f, 0, -1, -1);
                      if (
                        (C === n.HalfFloatType &&
                          (c = new Uint16Array(
                            c.buffer,
                            c.byteOffset,
                            c.byteLength / Uint16Array.BYTES_PER_ELEMENT
                          )),
                        !h)
                      )
                        throw (a(), new Error('THREE.KTX2Loader: .transcodeImage failed.'));
                      r.push(c);
                    }
                    const l = c(r);
                    (t.push({ data: l, width: o, height: A }), B.push(l.buffer));
                  }
                  E.push({ mipmaps: t, width: h, height: d, format: I, type: C });
                }
                return (
                  a(),
                  {
                    faces: E,
                    buffers: B,
                    width: h,
                    height: d,
                    hasAlpha: m,
                    dfdFlags: b,
                    format: I,
                    type: C,
                  }
                );
              })(a.buffer);
              self.postMessage(
                {
                  type: 'transcode',
                  id: a.id,
                  data: {
                    faces: t,
                    width: o,
                    height: h,
                    hasAlpha: d,
                    format: g,
                    type: u,
                    dfdFlags: p,
                  },
                },
                s
              );
            } catch (t) {
              (console.error(t), self.postMessage({ type: 'error', id: a.id, error: t.message }));
            }
          });
      }
      var o;
    });
    const o = [
        {
          if: 'astcSupported',
          basisFormat: [r.UASTC],
          transcoderFormat: [a.ASTC_4x4, a.ASTC_4x4],
          engineFormat: [s.RGBA_ASTC_4x4_Format, s.RGBA_ASTC_4x4_Format],
          engineType: [n.UnsignedByteType],
          priorityETC1S: 1 / 0,
          priorityUASTC: 1,
          needsPowerOfTwo: !1,
        },
        {
          if: 'bptcSupported',
          basisFormat: [r.ETC1S, r.UASTC],
          transcoderFormat: [a.BC7_M5, a.BC7_M5],
          engineFormat: [s.RGBA_BPTC_Format, s.RGBA_BPTC_Format],
          engineType: [n.UnsignedByteType],
          priorityETC1S: 3,
          priorityUASTC: 2,
          needsPowerOfTwo: !1,
        },
        {
          if: 'dxtSupported',
          basisFormat: [r.ETC1S, r.UASTC],
          transcoderFormat: [a.BC1, a.BC3],
          engineFormat: [s.RGBA_S3TC_DXT1_Format, s.RGBA_S3TC_DXT5_Format],
          engineType: [n.UnsignedByteType],
          priorityETC1S: 4,
          priorityUASTC: 5,
          needsPowerOfTwo: !1,
        },
        {
          if: 'etc2Supported',
          basisFormat: [r.ETC1S, r.UASTC],
          transcoderFormat: [a.ETC1, a.ETC2],
          engineFormat: [s.RGB_ETC2_Format, s.RGBA_ETC2_EAC_Format],
          engineType: [n.UnsignedByteType],
          priorityETC1S: 1,
          priorityUASTC: 3,
          needsPowerOfTwo: !1,
        },
        {
          if: 'etc1Supported',
          basisFormat: [r.ETC1S, r.UASTC],
          transcoderFormat: [a.ETC1],
          engineFormat: [s.RGB_ETC1_Format],
          engineType: [n.UnsignedByteType],
          priorityETC1S: 2,
          priorityUASTC: 4,
          needsPowerOfTwo: !1,
        },
        {
          if: 'pvrtcSupported',
          basisFormat: [r.ETC1S, r.UASTC],
          transcoderFormat: [a.PVRTC1_4_RGB, a.PVRTC1_4_RGBA],
          engineFormat: [s.RGB_PVRTC_4BPPV1_Format, s.RGBA_PVRTC_4BPPV1_Format],
          engineType: [n.UnsignedByteType],
          priorityETC1S: 5,
          priorityUASTC: 6,
          needsPowerOfTwo: !0,
        },
        {
          if: 'bptcSupported',
          basisFormat: [r.UASTC_HDR],
          transcoderFormat: [a.BC6H],
          engineFormat: [s.RGB_BPTC_UNSIGNED_Format],
          engineType: [n.HalfFloatType],
          priorityHDR: 1,
          needsPowerOfTwo: !1,
        },
        {
          basisFormat: [r.ETC1S, r.UASTC],
          transcoderFormat: [a.RGBA32, a.RGBA32],
          engineFormat: [s.RGBAFormat, s.RGBAFormat],
          engineType: [n.UnsignedByteType, n.UnsignedByteType],
          priorityETC1S: 100,
          priorityUASTC: 100,
          needsPowerOfTwo: !1,
        },
        {
          basisFormat: [r.UASTC_HDR],
          transcoderFormat: [a.RGBA_HALF],
          engineFormat: [s.RGBAFormat],
          engineType: [n.HalfFloatType],
          priorityHDR: 100,
          needsPowerOfTwo: !1,
        },
      ],
      A = {
        [r.ETC1S]: o
          .filter(e => e.basisFormat.includes(r.ETC1S))
          .sort((e, t) => e.priorityETC1S - t.priorityETC1S),
        [r.UASTC]: o
          .filter(e => e.basisFormat.includes(r.UASTC))
          .sort((e, t) => e.priorityUASTC - t.priorityUASTC),
        [r.UASTC_HDR]: o
          .filter(e => e.basisFormat.includes(r.UASTC_HDR))
          .sort((e, t) => e.priorityHDR - t.priorityHDR),
      };
    function l(e) {
      return e <= 2 || (!(e & (e - 1)) && 0 !== e);
    }
    function c(e) {
      if (1 === e.length) return e[0];
      let t = 0;
      for (let n = 0; n < e.length; n++) {
        t += e[n].byteLength;
      }
      const i = new Uint8Array(t);
      let s = 0;
      for (let n = 0; n < e.length; n++) {
        const t = e[n];
        (i.set(t, s), (s += t.byteLength));
      }
      return i;
    }
  }));
const Ba = new Set([ze, He, je, qe]),
  ya = {
    [Dn]: ze,
    [Tn]: je,
    [Mn]: qe,
    [Rn]: ze,
    [Sn]: je,
    [xn]: qe,
    [vn]: ze,
    [Qn]: ze,
    [wn]: je,
    [yn]: je,
    [Bn]: qe,
    [En]: qe,
    [Fn]: He,
    [kn]: He,
    [Jn]: Oe,
    [Vn]: Ne,
    [Yn]: Pe,
    [Wn]: _e,
    [$n]: Ge,
    [Xn]: Ue,
    [oa]: Le,
    [ea]: Le,
    [Zn]: Le,
    [Aa]: Fe,
    [ia]: Fe,
    [ta]: Fe,
    [_n]: ke,
    [Gn]: ke,
    [Un]: De,
    [Ln]: De,
    [Nn]: Te,
    [Pn]: Te,
    [Hn]: Me,
    [On]: Re,
    [jn]: Se,
    [qn]: xe,
    [Kn]: ve,
    [zn]: ve,
    [ra]: Qe,
    [na]: Qe,
    [aa]: we,
    [sa]: we,
  },
  wa = {
    [Dn]: We,
    [Tn]: We,
    [Mn]: We,
    [Rn]: Ve,
    [Sn]: Ve,
    [xn]: Ve,
    [vn]: Ke,
    [Qn]: Ke,
    [wn]: Ke,
    [yn]: Ke,
    [Bn]: Ke,
    [En]: Ke,
    [Fn]: Ye,
    [kn]: Je,
    [Jn]: Ke,
    [Vn]: Ke,
    [Yn]: Ke,
    [Yn]: Ke,
    [$n]: Ke,
    [$n]: Ke,
    [oa]: Ve,
    [ea]: Ke,
    [Zn]: Ke,
    [Aa]: Ve,
    [ia]: Ke,
    [ta]: Ke,
    [_n]: Ke,
    [Gn]: Ke,
    [Un]: Ke,
    [Ln]: Ke,
    [Nn]: Ke,
    [Pn]: Ke,
    [Hn]: Ke,
    [On]: Ke,
    [jn]: Ke,
    [qn]: Ke,
    [Kn]: Ke,
    [zn]: Ke,
    [ra]: Ke,
    [na]: Ke,
    [aa]: Ke,
    [sa]: Ke,
  };
function Qa(e) {
  const t = e.dataFormatDescriptor[0];
  return 1 === t.colorPrimaries
    ? 2 === t.transferFunction
      ? c
      : h
    : 10 === t.colorPrimaries
      ? 2 === t.transferFunction
        ? 'display-p3'
        : 'display-p3-linear'
      : (0 === t.colorPrimaries ||
          console.warn(`THREE.KTX2Loader: Unsupported color primaries, "${t.colorPrimaries}"`),
        ye);
}
var va, xa;
const Sa = Symbol('retainerCount'),
  Ra = Symbol('recentlyUsed'),
  Ma = Symbol('evict'),
  Ta = Symbol('evictionThreshold'),
  Da = Symbol('cache');
class ka {
  constructor(e, t = 5) {
    ((this[va] = new Map()), (this[xa] = []), (this[Da] = e), (this[Ta] = t));
  }
  set evictionThreshold(e) {
    ((this[Ta] = e), this[Ma]());
  }
  get evictionThreshold() {
    return this[Ta];
  }
  get cache() {
    return this[Da];
  }
  retainerCount(e) {
    return this[Sa].get(e) || 0;
  }
  reset() {
    (this[Sa].clear(), (this[Ra] = []));
  }
  retain(e) {
    (this[Sa].has(e) || this[Sa].set(e, 0), this[Sa].set(e, this[Sa].get(e) + 1));
    const t = this[Ra].indexOf(e);
    (-1 !== t && this[Ra].splice(t, 1), this[Ra].unshift(e), this[Ma]());
  }
  release(e) {
    (this[Sa].has(e) && this[Sa].set(e, Math.max(this[Sa].get(e) - 1, 0)), this[Ma]());
  }
  [((va = Sa), (xa = Ra), Ma)]() {
    if (!(this[Ra].length < this[Ta]))
      for (let e = this[Ra].length - 1; e >= this[Ta]; --e) {
        const t = this[Ra][e];
        0 === this[Sa].get(t) && (this[Da].delete(t), this[Ra].splice(e, 1));
      }
  }
}
const Fa = e => {
  const t = new Map();
  for (const i of e.mappings)
    for (const e of i.variants) t.set(e, { material: null, gltfMaterialIndex: i.material });
  return t;
};
class La {
  constructor(e) {
    ((this.parser = e), (this.name = 'KHR_materials_variants'));
  }
  afterRoot(e) {
    const t = this.parser,
      i = t.json;
    if (void 0 === i.extensions || void 0 === i.extensions[this.name]) return null;
    const s = (e => {
      const t = [],
        i = new Set();
      for (const s of e) {
        let e = s,
          n = 0;
        for (; i.has(e); ) e = s + '.' + ++n;
        (i.add(e), t.push(e));
      }
      return t;
    })((i.extensions[this.name].variants || []).map(e => e.name));
    for (const n of e.scenes)
      n.traverse(e => {
        const s = e;
        if (!s.material) return;
        const n = t.associations.get(s);
        if (null == n || null == n.meshes || null == n.primitives) return;
        const a = i.meshes[n.meshes].primitives[n.primitives].extensions;
        a && a[this.name] && (s.userData.variantMaterials = Fa(a[this.name]));
      });
    return ((e.userData.variants = s), Promise.resolve());
  }
}
var Ua, Ga;
de.DEFAULT_ANISOTROPY = 4;
const _a = new Map(),
  Pa = new Map();
let Na;
const Oa = new (class extends A {
  constructor(e) {
    (super(e),
      (this.decoderPath = ''),
      (this.decoderConfig = {}),
      (this.decoderBinary = null),
      (this.decoderPending = null),
      (this.workerLimit = 4),
      (this.workerPool = []),
      (this.workerNextTaskID = 1),
      (this.workerSourceURL = ''),
      (this.defaultAttributeIDs = {
        position: 'POSITION',
        normal: 'NORMAL',
        color: 'COLOR',
        uv: 'TEX_COORD',
      }),
      (this.defaultAttributeTypes = {
        position: 'Float32Array',
        normal: 'Float32Array',
        color: 'Float32Array',
        uv: 'Float32Array',
      }));
  }
  setDecoderPath(e) {
    return ((this.decoderPath = e), this);
  }
  setDecoderConfig(e) {
    return ((this.decoderConfig = e), this);
  }
  setWorkerLimit(e) {
    return ((this.workerLimit = e), this);
  }
  load(e, t, i, s) {
    const n = new l(this.manager);
    (n.setPath(this.path),
      n.setResponseType('arraybuffer'),
      n.setRequestHeader(this.requestHeader),
      n.setWithCredentials(this.withCredentials),
      n.load(
        e,
        e => {
          this.parse(e, t, s);
        },
        i,
        s
      ));
  }
  parse(e, t, i = () => {}) {
    this.decodeDracoFile(e, t, null, null, c, i).catch(i);
  }
  decodeDracoFile(e, t, i, s, n = h, a = () => {}) {
    const r = {
      attributeIDs: i || this.defaultAttributeIDs,
      attributeTypes: s || this.defaultAttributeTypes,
      useUniqueIDs: !!i,
      vertexColorSpace: n,
    };
    return this.decodeGeometry(e, r).then(t).catch(a);
  }
  decodeGeometry(e, t) {
    const i = JSON.stringify(t);
    if (fs.has(e)) {
      const t = fs.get(e);
      if (t.key === i) return t.promise;
      if (0 === e.byteLength)
        throw new Error(
          'THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.'
        );
    }
    let s;
    const n = this.workerNextTaskID++,
      a = e.byteLength,
      r = this._getWorker(n, a)
        .then(
          i => (
            (s = i),
            new Promise((i, a) => {
              ((s._callbacks[n] = { resolve: i, reject: a }),
                s.postMessage({ type: 'decode', id: n, taskConfig: t, buffer: e }, [e]));
            })
          )
        )
        .then(e => this._createGeometry(e.geometry));
    return (
      r
        .catch(() => !0)
        .then(() => {
          s && n && this._releaseTask(s, n);
        }),
      fs.set(e, { key: i, promise: r }),
      r
    );
  }
  _createGeometry(e) {
    const t = new d();
    e.index && t.setIndex(new g(e.index.array, 1));
    for (let i = 0; i < e.attributes.length; i++) {
      const { name: s, array: n, itemSize: a, stride: r, vertexColorSpace: o } = e.attributes[i];
      let A;
      if (a === r) A = new g(n, a);
      else {
        const e = new u(n, r);
        A = new b(e, a, 0);
      }
      ('color' === s &&
        (this._assignVertexColorSpace(A, o), (A.normalized = n instanceof Float32Array == !1)),
        t.setAttribute(s, A));
    }
    return t;
  }
  _assignVertexColorSpace(e, t) {
    if (t !== c) return;
    const i = new p();
    for (let s = 0, n = e.count; s < n; s++)
      (i.fromBufferAttribute(e, s), m.colorSpaceToWorking(i, c), e.setXYZ(s, i.r, i.g, i.b));
  }
  _loadLibrary(e, t) {
    const i = new l(this.manager);
    return (
      i.setPath(this.decoderPath),
      i.setResponseType(t),
      i.setWithCredentials(this.withCredentials),
      new Promise((t, s) => {
        i.load(e, t, void 0, s);
      })
    );
  }
  preload() {
    return (this._initDecoder(), this);
  }
  _initDecoder() {
    if (this.decoderPending) return this.decoderPending;
    const e = 'object' != typeof WebAssembly || 'js' === this.decoderConfig.type,
      t = [];
    return (
      e
        ? t.push(this._loadLibrary('draco_decoder.js', 'text'))
        : (t.push(this._loadLibrary('draco_wasm_wrapper.js', 'text')),
          t.push(this._loadLibrary('draco_decoder.wasm', 'arraybuffer'))),
      (this.decoderPending = Promise.all(t).then(t => {
        const i = t[0];
        e || (this.decoderConfig.wasmBinary = t[1]);
        const s = Is.toString(),
          n = [
            '/* draco decoder */',
            i,
            '',
            '/* worker */',
            s.substring(s.indexOf('{') + 1, s.lastIndexOf('}')),
          ].join('\n');
        this.workerSourceURL = URL.createObjectURL(new Blob([n]));
      })),
      this.decoderPending
    );
  }
  _getWorker(e, t) {
    return this._initDecoder().then(() => {
      if (this.workerPool.length < this.workerLimit) {
        const e = new Worker(this.workerSourceURL);
        ((e._callbacks = {}),
          (e._taskCosts = {}),
          (e._taskLoad = 0),
          e.postMessage({ type: 'init', decoderConfig: this.decoderConfig }),
          (e.onmessage = function (t) {
            const i = t.data;
            switch (i.type) {
              case 'decode':
                e._callbacks[i.id].resolve(i);
                break;
              case 'error':
                e._callbacks[i.id].reject(i);
                break;
              default:
                console.error('THREE.DRACOLoader: Unexpected message, "' + i.type + '"');
            }
          }),
          this.workerPool.push(e));
      } else
        this.workerPool.sort(function (e, t) {
          return e._taskLoad > t._taskLoad ? -1 : 1;
        });
      const i = this.workerPool[this.workerPool.length - 1];
      return ((i._taskCosts[e] = t), (i._taskLoad += t), i);
    });
  }
  _releaseTask(e, t) {
    ((e._taskLoad -= e._taskCosts[t]), delete e._callbacks[t], delete e._taskCosts[t]);
  }
  debug() {
    console.log(
      'Task load: ',
      this.workerPool.map(e => e._taskLoad)
    );
  }
  dispose() {
    for (let e = 0; e < this.workerPool.length; ++e) this.workerPool[e].terminate();
    return (
      (this.workerPool.length = 0),
      '' !== this.workerSourceURL && URL.revokeObjectURL(this.workerSourceURL),
      this
    );
  }
})();
let Ha;
const qa = new Ea();
let ja, za;
const Ka = Symbol('loader'),
  Va = Symbol('evictionPolicy'),
  Ja = Symbol('GLTFInstance');
class Ya extends st {
  static setDRACODecoderLocation(e) {
    ((Na = e), Oa.setDecoderPath(e));
  }
  static getDRACODecoderLocation() {
    return Na;
  }
  static setKTX2TranscoderLocation(e) {
    ((Ha = e), qa.setTranscoderPath(e));
  }
  static getKTX2TranscoderLocation() {
    return Ha;
  }
  static setMeshoptDecoderLocation(e) {
    var t;
    ja !== e &&
      ((ja = e),
      (za = ((t = e),
      new Promise((e, i) => {
        const s = document.createElement('script');
        (document.body.appendChild(s),
          (s.onload = e),
          (s.onerror = i),
          (s.async = !0),
          (s.src = t));
      }))
        .then(() => bs.ready)
        .then(() => bs)));
  }
  static getMeshoptDecoderLocation() {
    return ja;
  }
  static initializeKTX2Loader(e) {
    qa.detectSupport(e);
  }
  static get cache() {
    return _a;
  }
  static clearCache() {
    (_a.forEach((e, t) => {
      this.delete(t);
    }),
      this[Va].reset());
  }
  static has(e) {
    return _a.has(e);
  }
  static async delete(e) {
    if (!this.has(e)) return;
    const t = _a.get(e);
    (Pa.delete(e), _a.delete(e));
    (await t).dispose();
  }
  static hasFinishedLoading(e) {
    return !!Pa.get(e);
  }
  constructor(e) {
    (super(),
      (this[Ga] = new Es().register(e => new La(e))),
      (this[Ja] = e),
      this[Ka].setDRACOLoader(Oa),
      this[Ka].setKTX2Loader(qa));
  }
  get [((Ua = Va), (Ga = Ka), Va)]() {
    return this.constructor[Va];
  }
  async preload(e, t, i = () => {}) {
    if (
      (this[Ka].setWithCredentials(t.withCredentials),
      this.dispatchEvent({ type: 'preload', element: t, src: e }),
      !_a.has(e))
    ) {
      null != za && this[Ka].setMeshoptDecoder(await za);
      const t = ((e, t, i = () => {}) => {
          const s = e => {
            const t = e.loaded / e.total;
            i(Math.max(0, Math.min(1, isFinite(t) ? t : 1)));
          };
          return new Promise((i, n) => {
            t.load(e, i, s, n);
          });
        })(e, this[Ka], e => {
          i(0.8 * e);
        }),
        s = this[Ja],
        n = t
          .then(e => s.prepare(e))
          .then(e => (i(0.9), new s(e)))
          .catch(e => (console.error(e), new s()));
      _a.set(e, n);
    }
    (await _a.get(e), Pa.set(e, !0), i && i(1));
  }
  async load(e, t, i = () => {}) {
    await this.preload(e, t, i);
    const s = await _a.get(e),
      n = await s.clone();
    return (
      this[Va].retain(e),
      (n.dispose = () => {
        this[Va].release(e);
      }),
      n
    );
  }
}
Ya[Ua] = new ka(Ya);
class Wa extends D {
  constructor(e = document.createElement('div')) {
    (super(),
      (this.isCSS2DObject = !0),
      (this.element = e),
      (this.element.style.position = 'absolute'),
      (this.element.style.userSelect = 'none'),
      this.element.setAttribute('draggable', !1),
      (this.center = new y(0.5, 0.5)),
      this.addEventListener('removed', function () {
        this.traverse(function (e) {
          e.element &&
            e.element instanceof e.element.ownerDocument.defaultView.Element &&
            null !== e.element.parentNode &&
            e.element.remove();
        });
      }));
  }
  copy(e, t) {
    return (
      super.copy(e, t),
      (this.element = e.element.cloneNode(!0)),
      (this.center = e.center),
      this
    );
  }
}
const $a = new S(),
  Xa = new x(),
  Za = new x(),
  er = new S(),
  tr = new S();
class ir {
  constructor(e = {}) {
    const t = this;
    let i, s, n, a;
    const r = { objects: new WeakMap() },
      o = void 0 !== e.element ? e.element : document.createElement('div');
    function A(e) {
      e.isCSS2DObject && (e.element.style.display = 'none');
      for (let t = 0, i = e.children.length; t < i; t++) A(e.children[t]);
    }
    function l(e, i, s) {
      if (!1 !== e.visible) {
        if (e.isCSS2DObject) {
          ($a.setFromMatrixPosition(e.matrixWorld), $a.applyMatrix4(Za));
          const A = $a.z >= -1 && $a.z <= 1 && !0 === e.layers.test(s.layers),
            l = e.element;
          ((l.style.display = !0 === A ? '' : 'none'),
            !0 === A &&
              (e.onBeforeRender(t, i, s),
              (l.style.transform =
                'translate(' +
                -100 * e.center.x +
                '%,' +
                -100 * e.center.y +
                '%)translate(' +
                ($a.x * n + n) +
                'px,' +
                (-$a.y * a + a) +
                'px)'),
              l.parentNode !== o && o.appendChild(l),
              e.onAfterRender(t, i, s)));
          const h = { distanceToCameraSquared: c(s, e) };
          r.objects.set(e, h);
        }
        for (let t = 0, n = e.children.length; t < n; t++) l(e.children[t], i, s);
      } else A(e);
    }
    function c(e, t) {
      return (
        er.setFromMatrixPosition(e.matrixWorld),
        tr.setFromMatrixPosition(t.matrixWorld),
        er.distanceToSquared(tr)
      );
    }
    ((o.style.overflow = 'hidden'),
      (this.domElement = o),
      (this.sortObjects = !0),
      (this.getSize = function () {
        return { width: i, height: s };
      }),
      (this.render = function (e, t) {
        (!0 === e.matrixWorldAutoUpdate && e.updateMatrixWorld(),
          null === t.parent && !0 === t.matrixWorldAutoUpdate && t.updateMatrixWorld(),
          Xa.copy(t.matrixWorldInverse),
          Za.multiplyMatrices(t.projectionMatrix, Xa),
          l(e, e, t),
          this.sortObjects &&
            (function (e) {
              const t = (function (e) {
                  const t = [];
                  return (
                    e.traverseVisible(function (e) {
                      e.isCSS2DObject && t.push(e);
                    }),
                    t
                  );
                })(e).sort(function (e, t) {
                  if (e.renderOrder !== t.renderOrder) return t.renderOrder - e.renderOrder;
                  return (
                    r.objects.get(e).distanceToCameraSquared -
                    r.objects.get(t).distanceToCameraSquared
                  );
                }),
                i = t.length;
              for (let s = 0, n = t.length; s < n; s++) t[s].element.style.zIndex = i - s;
            })(e));
      }),
      (this.setSize = function (e, t) {
        ((i = e),
          (s = t),
          (n = i / 2),
          (a = s / 2),
          (o.style.width = e + 'px'),
          (o.style.height = t + 'px'));
      }));
  }
}
function sr(e, t, i) {
  let s = i;
  const n = new S();
  return (
    e.updateWorldMatrix(!0, !0),
    e.traverseVisible(e => {
      const { geometry: i } = e;
      if (void 0 !== i) {
        const { position: a } = i.attributes;
        if (void 0 !== a)
          for (let i = 0, r = a.count; i < r; i++)
            (e.isMesh ? e.getVertexPosition(i, n) : n.fromBufferAttribute(a, i),
              e.isSkinnedMesh || n.applyMatrix4(e.matrixWorld),
              (s = t(s, n)));
      }
    }),
    s
  );
}
const nr = {
  POSITION: [
    'byte',
    'byte normalized',
    'unsigned byte',
    'unsigned byte normalized',
    'short',
    'short normalized',
    'unsigned short',
    'unsigned short normalized',
  ],
  NORMAL: ['byte normalized', 'short normalized'],
  TANGENT: ['byte normalized', 'short normalized'],
  TEXCOORD: [
    'byte',
    'byte normalized',
    'unsigned byte',
    'short',
    'short normalized',
    'unsigned short',
  ],
};
class ar {
  constructor() {
    ((this.textureUtils = null),
      (this.pluginCallbacks = []),
      this.register(function (e) {
        return new _r(e);
      }),
      this.register(function (e) {
        return new Pr(e);
      }),
      this.register(function (e) {
        return new qr(e);
      }),
      this.register(function (e) {
        return new jr(e);
      }),
      this.register(function (e) {
        return new zr(e);
      }),
      this.register(function (e) {
        return new Kr(e);
      }),
      this.register(function (e) {
        return new Nr(e);
      }),
      this.register(function (e) {
        return new Or(e);
      }),
      this.register(function (e) {
        return new Hr(e);
      }),
      this.register(function (e) {
        return new Vr(e);
      }),
      this.register(function (e) {
        return new Jr(e);
      }),
      this.register(function (e) {
        return new Yr(e);
      }),
      this.register(function (e) {
        return new Wr(e);
      }),
      this.register(function (e) {
        return new $r(e);
      }));
  }
  register(e) {
    return (-1 === this.pluginCallbacks.indexOf(e) && this.pluginCallbacks.push(e), this);
  }
  unregister(e) {
    return (
      -1 !== this.pluginCallbacks.indexOf(e) &&
        this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1),
      this
    );
  }
  setTextureUtils(e) {
    return ((this.textureUtils = e), this);
  }
  parse(e, t, i, s) {
    const n = new Gr(),
      a = [];
    for (let r = 0, o = this.pluginCallbacks.length; r < o; r++) a.push(this.pluginCallbacks[r](n));
    (n.setPlugins(a), n.setTextureUtils(this.textureUtils), n.writeAsync(e, t, s).catch(i));
  }
  parseAsync(e, t) {
    const i = this;
    return new Promise(function (s, n) {
      i.parse(e, s, n, t);
    });
  }
}
const rr = 0,
  or = 1,
  Ar = 2,
  lr = 3,
  cr = 4,
  hr = 5120,
  dr = 5121,
  gr = 5122,
  ur = 5123,
  pr = 5124,
  mr = 5125,
  br = 5126,
  fr = 34962,
  Ir = 34963,
  Cr = 9728,
  Er = 9729,
  Br = 9984,
  yr = 9985,
  wr = 9986,
  Qr = 9987,
  vr = 33071,
  xr = 33648,
  Sr = 10497,
  Rr = 'KHR_mesh_quantization',
  Mr = {};
((Mr[N] = Cr),
  (Mr[_] = Br),
  (Mr[U] = wr),
  (Mr[P] = Er),
  (Mr[G] = yr),
  (Mr[L] = Qr),
  (Mr[q] = vr),
  (Mr[O] = Sr),
  (Mr[H] = xr));
const Tr = {
    scale: 'scale',
    position: 'translation',
    quaternion: 'rotation',
    morphTargetInfluences: 'weights',
  },
  Dr = new p();
function kr(e, t) {
  return (
    e.length === t.length &&
    e.every(function (e, i) {
      return e === t[i];
    })
  );
}
function Fr(e) {
  return 4 * Math.ceil(e / 4);
}
function Lr(e, t = 0) {
  const i = Fr(e.byteLength);
  if (i !== e.byteLength) {
    const s = new Uint8Array(i);
    if ((s.set(new Uint8Array(e)), 0 !== t)) for (let n = e.byteLength; n < i; n++) s[n] = t;
    return s.buffer;
  }
  return e;
}
function Ur() {
  return 'undefined' == typeof document && 'undefined' != typeof OffscreenCanvas
    ? new OffscreenCanvas(1, 1)
    : document.createElement('canvas');
}
class Gr {
  constructor() {
    ((this.plugins = []),
      (this.options = {}),
      (this.pending = []),
      (this.buffers = []),
      (this.byteOffset = 0),
      (this.buffers = []),
      (this.nodeMap = new Map()),
      (this.skins = []),
      (this.extensionsUsed = {}),
      (this.extensionsRequired = {}),
      (this.uids = new Map()),
      (this.uid = 0),
      (this.json = { asset: { version: '2.0', generator: 'THREE.GLTFExporter r' + nt } }),
      (this.cache = {
        meshes: new Map(),
        attributes: new Map(),
        attributesNormalized: new Map(),
        materials: new Map(),
        textures: new Map(),
        images: new Map(),
      }),
      (this.textureUtils = null));
  }
  setPlugins(e) {
    this.plugins = e;
  }
  setTextureUtils(e) {
    this.textureUtils = e;
  }
  async writeAsync(e, t, i = {}) {
    ((this.options = Object.assign(
      {
        binary: !1,
        trs: !1,
        onlyVisible: !0,
        maxTextureSize: 1 / 0,
        animations: [],
        includeCustomExtensions: !1,
      },
      i
    )),
      this.options.animations.length > 0 && (this.options.trs = !0),
      await this.processInputAsync(e),
      await Promise.all(this.pending));
    const s = this,
      n = s.buffers,
      a = s.json;
    i = s.options;
    const r = s.extensionsUsed,
      o = s.extensionsRequired,
      A = new Blob(n, { type: 'application/octet-stream' }),
      l = Object.keys(r),
      c = Object.keys(o);
    if (
      (l.length > 0 && (a.extensionsUsed = l),
      c.length > 0 && (a.extensionsRequired = c),
      a.buffers && a.buffers.length > 0 && (a.buffers[0].byteLength = A.size),
      !0 === i.binary)
    ) {
      const e = new FileReader();
      (e.readAsArrayBuffer(A),
        (e.onloadend = function () {
          const i = Lr(e.result),
            s = new DataView(new ArrayBuffer(8));
          (s.setUint32(0, i.byteLength, !0), s.setUint32(4, 5130562, !0));
          const n = Lr(((r = JSON.stringify(a)), new TextEncoder().encode(r).buffer), 32);
          var r;
          const o = new DataView(new ArrayBuffer(8));
          (o.setUint32(0, n.byteLength, !0), o.setUint32(4, 1313821514, !0));
          const A = new ArrayBuffer(12),
            l = new DataView(A);
          (l.setUint32(0, 1179937895, !0), l.setUint32(4, 2, !0));
          const c = 12 + o.byteLength + n.byteLength + s.byteLength + i.byteLength;
          l.setUint32(8, c, !0);
          const h = new Blob([A, o, n, s, i], { type: 'application/octet-stream' }),
            d = new FileReader();
          (d.readAsArrayBuffer(h),
            (d.onloadend = function () {
              t(d.result);
            }));
        }));
    } else if (a.buffers && a.buffers.length > 0) {
      const e = new FileReader();
      (e.readAsDataURL(A),
        (e.onloadend = function () {
          const i = e.result;
          ((a.buffers[0].uri = i), t(a));
        }));
    } else t(a);
  }
  serializeUserData(e, t) {
    if (0 === Object.keys(e.userData).length) return;
    const i = this.options,
      s = this.extensionsUsed;
    try {
      const n = JSON.parse(JSON.stringify(e.userData));
      if (i.includeCustomExtensions && n.gltfExtensions) {
        void 0 === t.extensions && (t.extensions = {});
        for (const e in n.gltfExtensions) ((t.extensions[e] = n.gltfExtensions[e]), (s[e] = !0));
        delete n.gltfExtensions;
      }
      Object.keys(n).length > 0 && (t.extras = n);
    } catch (n) {
      console.warn(
        "THREE.GLTFExporter: userData of '" +
          e.name +
          "' won't be serialized because of JSON.stringify error - " +
          n.message
      );
    }
  }
  getUID(e, t = !1) {
    if (!1 === this.uids.has(e)) {
      const t = new Map();
      (t.set(!0, this.uid++), t.set(!1, this.uid++), this.uids.set(e, t));
    }
    return this.uids.get(e).get(t);
  }
  isNormalizedNormalAttribute(e) {
    if (this.cache.attributesNormalized.has(e)) return !1;
    const t = new S();
    for (let i = 0, s = e.count; i < s; i++)
      if (Math.abs(t.fromBufferAttribute(e, i).length() - 1) > 5e-4) return !1;
    return !0;
  }
  createNormalizedNormalAttribute(e) {
    const t = this.cache;
    if (t.attributesNormalized.has(e)) return t.attributesNormalized.get(e);
    const i = e.clone(),
      s = new S();
    for (let n = 0, a = i.count; n < a; n++)
      (s.fromBufferAttribute(i, n),
        0 === s.x && 0 === s.y && 0 === s.z ? s.setX(1) : s.normalize(),
        i.setXYZ(n, s.x, s.y, s.z));
    return (t.attributesNormalized.set(e, i), i);
  }
  applyTextureTransform(e, t) {
    let i = !1;
    const s = {};
    ((0 === t.offset.x && 0 === t.offset.y) || ((s.offset = t.offset.toArray()), (i = !0)),
      0 !== t.rotation && ((s.rotation = t.rotation), (i = !0)),
      (1 === t.repeat.x && 1 === t.repeat.y) || ((s.scale = t.repeat.toArray()), (i = !0)),
      i &&
        ((e.extensions = e.extensions || {}),
        (e.extensions.KHR_texture_transform = s),
        (this.extensionsUsed.KHR_texture_transform = !0)));
  }
  async buildMetalRoughTextureAsync(e, t) {
    if (e === t) return e;
    function i(e) {
      return e.colorSpace === c
        ? function (e) {
            return e < 0.04045 ? 0.0773993808 * e : Math.pow(0.9478672986 * e + 0.0521327014, 2.4);
          }
        : function (e) {
            return e;
          };
    }
    (e instanceof Be && (e = await this.decompressTextureAsync(e)),
      t instanceof Be && (t = await this.decompressTextureAsync(t)));
    const s = e ? e.image : null,
      n = t ? t.image : null,
      a = Math.max(s ? s.width : 0, n ? n.width : 0),
      r = Math.max(s ? s.height : 0, n ? n.height : 0),
      o = Ur();
    ((o.width = a), (o.height = r));
    const A = o.getContext('2d', { willReadFrequently: !0 });
    ((A.fillStyle = '#00ffff'), A.fillRect(0, 0, a, r));
    const l = A.getImageData(0, 0, a, r);
    if (s) {
      A.drawImage(s, 0, 0, a, r);
      const t = i(e),
        n = A.getImageData(0, 0, a, r).data;
      for (let e = 2; e < n.length; e += 4) l.data[e] = 256 * t(n[e] / 256);
    }
    if (n) {
      A.drawImage(n, 0, 0, a, r);
      const e = i(t),
        s = A.getImageData(0, 0, a, r).data;
      for (let t = 1; t < s.length; t += 4) l.data[t] = 256 * e(s[t] / 256);
    }
    A.putImageData(l, 0, 0);
    const h = (e || t).clone();
    return (
      (h.source = new at(o)),
      (h.colorSpace = ye),
      (h.channel = (e || t).channel),
      e &&
        t &&
        e.channel !== t.channel &&
        console.warn(
          'THREE.GLTFExporter: UV channels for metalnessMap and roughnessMap textures must match.'
        ),
      console.warn('THREE.GLTFExporter: Merged metalnessMap and roughnessMap textures.'),
      h
    );
  }
  async decompressTextureAsync(e, t = 1 / 0) {
    if (null === this.textureUtils)
      throw new Error(
        'THREE.GLTFExporter: setTextureUtils() must be called to process compressed textures.'
      );
    return await this.textureUtils.decompress(e, t);
  }
  processBuffer(e) {
    const t = this.json,
      i = this.buffers;
    return (t.buffers || (t.buffers = [{ byteLength: 0 }]), i.push(e), 0);
  }
  processBufferView(e, t, i, s, n) {
    const a = this.json;
    let r;
    switch ((a.bufferViews || (a.bufferViews = []), t)) {
      case hr:
      case dr:
        r = 1;
        break;
      case gr:
      case ur:
        r = 2;
        break;
      default:
        r = 4;
    }
    let o = e.itemSize * r;
    n === fr && (o = 4 * Math.ceil(o / 4));
    const A = Fr(s * o),
      l = new DataView(new ArrayBuffer(A));
    let c = 0;
    for (let d = i; d < i + s; d++) {
      for (let i = 0; i < e.itemSize; i++) {
        let s;
        (e.itemSize > 4
          ? (s = e.array[d * e.itemSize + i])
          : (0 === i
              ? (s = e.getX(d))
              : 1 === i
                ? (s = e.getY(d))
                : 2 === i
                  ? (s = e.getZ(d))
                  : 3 === i && (s = e.getW(d)),
            !0 === e.normalized && (s = ae.normalize(s, e.array))),
          t === br
            ? l.setFloat32(c, s, !0)
            : t === pr
              ? l.setInt32(c, s, !0)
              : t === mr
                ? l.setUint32(c, s, !0)
                : t === gr
                  ? l.setInt16(c, s, !0)
                  : t === ur
                    ? l.setUint16(c, s, !0)
                    : t === hr
                      ? l.setInt8(c, s)
                      : t === dr && l.setUint8(c, s),
          (c += r));
      }
      c % o !== 0 && (c += o - (c % o));
    }
    const h = { buffer: this.processBuffer(l.buffer), byteOffset: this.byteOffset, byteLength: A };
    (void 0 !== n && (h.target = n),
      n === fr && (h.byteStride = o),
      (this.byteOffset += A),
      a.bufferViews.push(h));
    return { id: a.bufferViews.length - 1, byteLength: 0 };
  }
  processBufferViewImage(e) {
    const t = this,
      i = t.json;
    return (
      i.bufferViews || (i.bufferViews = []),
      new Promise(function (s) {
        const n = new FileReader();
        (n.readAsArrayBuffer(e),
          (n.onloadend = function () {
            const e = Lr(n.result),
              a = {
                buffer: t.processBuffer(e),
                byteOffset: t.byteOffset,
                byteLength: e.byteLength,
              };
            ((t.byteOffset += e.byteLength), s(i.bufferViews.push(a) - 1));
          }));
      })
    );
  }
  processAccessor(e, t, i, s) {
    const n = this.json;
    let a;
    if (e.array.constructor === Float32Array) a = br;
    else if (e.array.constructor === Int32Array) a = pr;
    else if (e.array.constructor === Uint32Array) a = mr;
    else if (e.array.constructor === Int16Array) a = gr;
    else if (e.array.constructor === Uint16Array) a = ur;
    else if (e.array.constructor === Int8Array) a = hr;
    else {
      if (e.array.constructor !== Uint8Array)
        throw new Error(
          'THREE.GLTFExporter: Unsupported bufferAttribute component type: ' +
            e.array.constructor.name
        );
      a = dr;
    }
    if ((void 0 === i && (i = 0), (void 0 !== s && s !== 1 / 0) || (s = e.count), 0 === s))
      return null;
    const r = (function (e, t, i) {
      const s = {
        min: new Array(e.itemSize).fill(Number.POSITIVE_INFINITY),
        max: new Array(e.itemSize).fill(Number.NEGATIVE_INFINITY),
      };
      for (let n = t; n < t + i; n++)
        for (let t = 0; t < e.itemSize; t++) {
          let i;
          (e.itemSize > 4
            ? (i = e.array[n * e.itemSize + t])
            : (0 === t
                ? (i = e.getX(n))
                : 1 === t
                  ? (i = e.getY(n))
                  : 2 === t
                    ? (i = e.getZ(n))
                    : 3 === t && (i = e.getW(n)),
              !0 === e.normalized && (i = ae.normalize(i, e.array))),
            (s.min[t] = Math.min(s.min[t], i)),
            (s.max[t] = Math.max(s.max[t], i)));
        }
      return s;
    })(e, i, s);
    let o;
    void 0 !== t && (o = e === t.index ? Ir : fr);
    const A = this.processBufferView(e, a, i, s, o),
      l = {
        bufferView: A.id,
        byteOffset: A.byteOffset,
        componentType: a,
        count: s,
        max: r.max,
        min: r.min,
        type: { 1: 'SCALAR', 2: 'VEC2', 3: 'VEC3', 4: 'VEC4', 9: 'MAT3', 16: 'MAT4' }[e.itemSize],
      };
    return (
      !0 === e.normalized && (l.normalized = !0),
      n.accessors || (n.accessors = []),
      n.accessors.push(l) - 1
    );
  }
  processImage(e, t, i, s = 'image/png') {
    if (null !== e) {
      const n = this,
        a = n.cache,
        r = n.json,
        o = n.options,
        A = n.pending;
      a.images.has(e) || a.images.set(e, {});
      const l = a.images.get(e),
        c = s + ':flipY/' + i.toString();
      if (void 0 !== l[c]) return l[c];
      r.images || (r.images = []);
      const h = { mimeType: s },
        d = Ur();
      ((d.width = Math.min(e.width, o.maxTextureSize)),
        (d.height = Math.min(e.height, o.maxTextureSize)));
      const g = d.getContext('2d', { willReadFrequently: !0 });
      if ((!0 === i && (g.translate(0, d.height), g.scale(1, -1)), void 0 !== e.data)) {
        (t !== ze && console.error('GLTFExporter: Only RGBAFormat is supported.', t),
          (e.width > o.maxTextureSize || e.height > o.maxTextureSize) &&
            console.warn('GLTFExporter: Image size is bigger than maxTextureSize', e));
        const i = new Uint8ClampedArray(e.height * e.width * 4);
        for (let t = 0; t < i.length; t += 4)
          ((i[t + 0] = e.data[t + 0]),
            (i[t + 1] = e.data[t + 1]),
            (i[t + 2] = e.data[t + 2]),
            (i[t + 3] = e.data[t + 3]));
        g.putImageData(new ImageData(i, e.width, e.height), 0, 0);
      } else {
        if (
          !(
            ('undefined' != typeof HTMLImageElement && e instanceof HTMLImageElement) ||
            ('undefined' != typeof HTMLCanvasElement && e instanceof HTMLCanvasElement) ||
            ('undefined' != typeof ImageBitmap && e instanceof ImageBitmap) ||
            ('undefined' != typeof OffscreenCanvas && e instanceof OffscreenCanvas)
          )
        )
          throw new Error(
            'THREE.GLTFExporter: Invalid image type. Use HTMLImageElement, HTMLCanvasElement, ImageBitmap or OffscreenCanvas.'
          );
        g.drawImage(e, 0, 0, d.width, d.height);
      }
      !0 === o.binary
        ? A.push(
            (function (e, t) {
              if ('undefined' != typeof OffscreenCanvas && e instanceof OffscreenCanvas) {
                let i;
                return (
                  'image/jpeg' === t ? (i = 0.92) : 'image/webp' === t && (i = 0.8),
                  e.convertToBlob({ type: t, quality: i })
                );
              }
              return new Promise(i => e.toBlob(i, t));
            })(d, s)
              .then(e => n.processBufferViewImage(e))
              .then(e => {
                h.bufferView = e;
              })
          )
        : (h.uri = rt.getDataURL(d, s));
      const u = r.images.push(h) - 1;
      return ((l[c] = u), u);
    }
    throw new Error('THREE.GLTFExporter: No valid image data found. Unable to process texture.');
  }
  processSampler(e) {
    const t = this.json;
    t.samplers || (t.samplers = []);
    const i = {
      magFilter: Mr[e.magFilter],
      minFilter: Mr[e.minFilter],
      wrapS: Mr[e.wrapS],
      wrapT: Mr[e.wrapT],
    };
    return t.samplers.push(i) - 1;
  }
  async processTextureAsync(e) {
    const t = this.options,
      i = this.cache,
      s = this.json;
    if (i.textures.has(e)) return i.textures.get(e);
    (s.textures || (s.textures = []),
      e instanceof Be && (e = await this.decompressTextureAsync(e, t.maxTextureSize)));
    let n = e.userData.mimeType;
    'image/webp' === n && (n = 'image/png');
    const a = {
      sampler: this.processSampler(e),
      source: this.processImage(e.image, e.format, e.flipY, n),
    };
    (e.name && (a.name = e.name),
      await this._invokeAllAsync(async function (t) {
        t.writeTexture && (await t.writeTexture(e, a));
      }));
    const r = s.textures.push(a) - 1;
    return (i.textures.set(e, r), r);
  }
  async processMaterialAsync(e) {
    const t = this.cache,
      i = this.json;
    if (t.materials.has(e)) return t.materials.get(e);
    if (e.isShaderMaterial)
      return (console.warn('GLTFExporter: THREE.ShaderMaterial not supported.'), null);
    i.materials || (i.materials = []);
    const s = { pbrMetallicRoughness: {} };
    !0 !== e.isMeshStandardMaterial &&
      !0 !== e.isMeshBasicMaterial &&
      console.warn('GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.');
    const n = e.color.toArray().concat([e.opacity]);
    if (
      (kr(n, [1, 1, 1, 1]) || (s.pbrMetallicRoughness.baseColorFactor = n),
      e.isMeshStandardMaterial
        ? ((s.pbrMetallicRoughness.metallicFactor = e.metalness),
          (s.pbrMetallicRoughness.roughnessFactor = e.roughness))
        : ((s.pbrMetallicRoughness.metallicFactor = 0),
          (s.pbrMetallicRoughness.roughnessFactor = 1)),
      e.metalnessMap || e.roughnessMap)
    ) {
      const t = await this.buildMetalRoughTextureAsync(e.metalnessMap, e.roughnessMap),
        i = { index: await this.processTextureAsync(t), texCoord: t.channel };
      (this.applyTextureTransform(i, t), (s.pbrMetallicRoughness.metallicRoughnessTexture = i));
    }
    if (e.map) {
      const t = { index: await this.processTextureAsync(e.map), texCoord: e.map.channel };
      (this.applyTextureTransform(t, e.map), (s.pbrMetallicRoughness.baseColorTexture = t));
    }
    if (e.emissive) {
      const t = e.emissive;
      if (
        (Math.max(t.r, t.g, t.b) > 0 && (s.emissiveFactor = e.emissive.toArray()), e.emissiveMap)
      ) {
        const t = {
          index: await this.processTextureAsync(e.emissiveMap),
          texCoord: e.emissiveMap.channel,
        };
        (this.applyTextureTransform(t, e.emissiveMap), (s.emissiveTexture = t));
      }
    }
    if (e.normalMap) {
      const t = {
        index: await this.processTextureAsync(e.normalMap),
        texCoord: e.normalMap.channel,
      };
      (e.normalScale && 1 !== e.normalScale.x && (t.scale = e.normalScale.x),
        this.applyTextureTransform(t, e.normalMap),
        (s.normalTexture = t));
    }
    if (e.aoMap) {
      const t = { index: await this.processTextureAsync(e.aoMap), texCoord: e.aoMap.channel };
      (1 !== e.aoMapIntensity && (t.strength = e.aoMapIntensity),
        this.applyTextureTransform(t, e.aoMap),
        (s.occlusionTexture = t));
    }
    (e.transparent
      ? (s.alphaMode = 'BLEND')
      : e.alphaTest > 0 && ((s.alphaMode = 'MASK'), (s.alphaCutoff = e.alphaTest)),
      e.side === J && (s.doubleSided = !0),
      '' !== e.name && (s.name = e.name),
      this.serializeUserData(e, s),
      await this._invokeAllAsync(async function (t) {
        t.writeMaterialAsync && (await t.writeMaterialAsync(e, s));
      }));
    const a = i.materials.push(s) - 1;
    return (t.materials.set(e, a), a);
  }
  async processMeshAsync(e) {
    const t = this.cache,
      i = this.json,
      s = [e.geometry.uuid];
    if (Array.isArray(e.material))
      for (let g = 0, C = e.material.length; g < C; g++) s.push(e.material[g].uuid);
    else s.push(e.material.uuid);
    const n = s.join(':');
    if (t.meshes.has(n)) return t.meshes.get(n);
    const a = e.geometry;
    let r;
    r = e.isLineSegments
      ? or
      : e.isLineLoop
        ? Ar
        : e.isLine
          ? lr
          : e.isPoints
            ? rr
            : e.material.wireframe
              ? or
              : cr;
    const o = {},
      A = {},
      l = [],
      c = [],
      h = {
        uv: 'TEXCOORD_0',
        uv1: 'TEXCOORD_1',
        uv2: 'TEXCOORD_2',
        uv3: 'TEXCOORD_3',
        color: 'COLOR_0',
        skinWeight: 'WEIGHTS_0',
        skinIndex: 'JOINTS_0',
      },
      d = a.getAttribute('normal');
    void 0 === d ||
      this.isNormalizedNormalAttribute(d) ||
      (console.warn(
        'THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one.'
      ),
      a.setAttribute('normal', this.createNormalizedNormalAttribute(d)));
    let u = null;
    for (let C in a.attributes) {
      if ('morph' === C.slice(0, 5)) continue;
      const e = a.attributes[C];
      C = h[C] || C.toUpperCase();
      if (
        (/^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/.test(C) ||
          (C = '_' + C),
        t.attributes.has(this.getUID(e)))
      ) {
        A[C] = t.attributes.get(this.getUID(e));
        continue;
      }
      u = null;
      const i = e.array;
      'JOINTS_0' !== C || i instanceof Uint16Array || i instanceof Uint8Array
        ? (i instanceof Uint32Array || i instanceof Int32Array) &&
          !C.startsWith('_') &&
          (console.warn(`GLTFExporter: Attribute "${C}" converted to type FLOAT.`),
          (u = ar.Utils.toFloat32BufferAttribute(e)))
        : (console.warn('GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.'),
          (u = new g(new Uint16Array(i), e.itemSize, e.normalized)));
      const s = this.processAccessor(u || e, a);
      null !== s &&
        (C.startsWith('_') || this.detectMeshQuantization(C, e),
        (A[C] = s),
        t.attributes.set(this.getUID(e), s));
    }
    if ((void 0 !== d && a.setAttribute('normal', d), 0 === Object.keys(A).length)) return null;
    if (void 0 !== e.morphTargetInfluences && e.morphTargetInfluences.length > 0) {
      const i = [],
        s = [],
        n = {};
      if (void 0 !== e.morphTargetDictionary)
        for (const t in e.morphTargetDictionary) n[e.morphTargetDictionary[t]] = t;
      for (let r = 0; r < e.morphTargetInfluences.length; ++r) {
        const o = {};
        let A = !1;
        for (const e in a.morphAttributes) {
          if ('position' !== e && 'normal' !== e) {
            A ||
              (console.warn('GLTFExporter: Only POSITION and NORMAL morph are supported.'),
              (A = !0));
            continue;
          }
          const i = a.morphAttributes[e][r],
            s = e.toUpperCase(),
            n = a.attributes[e];
          if (t.attributes.has(this.getUID(i, !0))) {
            o[s] = t.attributes.get(this.getUID(i, !0));
            continue;
          }
          const l = i.clone();
          if (!a.morphTargetsRelative)
            for (let e = 0, t = i.count; e < t; e++)
              for (let s = 0; s < i.itemSize; s++)
                (0 === s && l.setX(e, i.getX(e) - n.getX(e)),
                  1 === s && l.setY(e, i.getY(e) - n.getY(e)),
                  2 === s && l.setZ(e, i.getZ(e) - n.getZ(e)),
                  3 === s && l.setW(e, i.getW(e) - n.getW(e)));
          ((o[s] = this.processAccessor(l, a)), t.attributes.set(this.getUID(n, !0), o[s]));
        }
        (c.push(o),
          i.push(e.morphTargetInfluences[r]),
          void 0 !== e.morphTargetDictionary && s.push(n[r]));
      }
      ((o.weights = i), s.length > 0 && ((o.extras = {}), (o.extras.targetNames = s)));
    }
    const p = Array.isArray(e.material);
    if (p && 0 === a.groups.length) return null;
    let m = !1;
    if (p && null === a.index) {
      const e = [];
      for (let t = 0, i = a.attributes.position.count; t < i; t++) e[t] = t;
      (a.setIndex(e), (m = !0));
    }
    const b = p ? e.material : [e.material],
      f = p ? a.groups : [{ materialIndex: 0, start: void 0, count: void 0 }];
    for (let g = 0, C = f.length; g < C; g++) {
      const e = { mode: r, attributes: A };
      if ((this.serializeUserData(a, e), c.length > 0 && (e.targets = c), null !== a.index)) {
        let i = this.getUID(a.index);
        ((void 0 === f[g].start && void 0 === f[g].count) ||
          (i += ':' + f[g].start + ':' + f[g].count),
          t.attributes.has(i)
            ? (e.indices = t.attributes.get(i))
            : ((e.indices = this.processAccessor(a.index, a, f[g].start, f[g].count)),
              t.attributes.set(i, e.indices)),
          null === e.indices && delete e.indices);
      }
      const i = await this.processMaterialAsync(b[f[g].materialIndex]);
      (null !== i && (e.material = i), l.push(e));
    }
    (!0 === m && a.setIndex(null),
      (o.primitives = l),
      i.meshes || (i.meshes = []),
      await this._invokeAllAsync(function (t) {
        t.writeMesh && t.writeMesh(e, o);
      }));
    const I = i.meshes.push(o) - 1;
    return (t.meshes.set(n, I), I);
  }
  detectMeshQuantization(e, t) {
    if (this.extensionsUsed[Rr]) return;
    let i;
    switch (t.array.constructor) {
      case Int8Array:
        i = 'byte';
        break;
      case Uint8Array:
        i = 'unsigned byte';
        break;
      case Int16Array:
        i = 'short';
        break;
      case Uint16Array:
        i = 'unsigned short';
        break;
      default:
        return;
    }
    t.normalized && (i += ' normalized');
    const s = e.split('_', 1)[0];
    nr[s] &&
      nr[s].includes(i) &&
      ((this.extensionsUsed[Rr] = !0), (this.extensionsRequired[Rr] = !0));
  }
  processCamera(e) {
    const t = this.json;
    t.cameras || (t.cameras = []);
    const i = e.isOrthographicCamera,
      s = { type: i ? 'orthographic' : 'perspective' };
    return (
      i
        ? (s.orthographic = {
            xmag: 2 * e.right,
            ymag: 2 * e.top,
            zfar: e.far <= 0 ? 0.001 : e.far,
            znear: e.near < 0 ? 0 : e.near,
          })
        : (s.perspective = {
            aspectRatio: e.aspect,
            yfov: ae.degToRad(e.fov),
            zfar: e.far <= 0 ? 0.001 : e.far,
            znear: e.near < 0 ? 0 : e.near,
          }),
      '' !== e.name && (s.name = e.type),
      t.cameras.push(s) - 1
    );
  }
  processAnimation(e, t) {
    const i = this.json,
      s = this.nodeMap;
    i.animations || (i.animations = []);
    const n = (e = ar.Utils.mergeMorphTargetTracks(e.clone(), t)).tracks,
      a = [],
      r = [];
    for (let A = 0; A < n.length; ++A) {
      const e = n[A],
        i = W.parseTrackName(e.name);
      let o = W.findNode(t, i.nodeName);
      const l = Tr[i.propertyName];
      if (
        ('bones' === i.objectName &&
          (o = !0 === o.isSkinnedMesh ? o.skeleton.getBoneByName(i.objectIndex) : void 0),
        !o || !l)
      ) {
        console.warn('THREE.GLTFExporter: Could not export animation track "%s".', e.name);
        continue;
      }
      const c = 1;
      let h,
        d = e.values.length / e.times.length;
      (l === Tr.morphTargetInfluences && (d /= o.morphTargetInfluences.length),
        !0 === e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline
          ? ((h = 'CUBICSPLINE'), (d /= 3))
          : (h = e.getInterpolation() === ce ? 'STEP' : 'LINEAR'),
        r.push({
          input: this.processAccessor(new g(e.times, c)),
          output: this.processAccessor(new g(e.values, d)),
          interpolation: h,
        }),
        a.push({ sampler: r.length - 1, target: { node: s.get(o), path: l } }));
    }
    const o = { name: e.name || 'clip_' + i.animations.length, samplers: r, channels: a };
    return (this.serializeUserData(e, o), i.animations.push(o), i.animations.length - 1);
  }
  processSkin(e) {
    const t = this.json,
      i = this.nodeMap,
      s = t.nodes[i.get(e)],
      n = e.skeleton;
    if (void 0 === n) return null;
    const a = e.skeleton.bones[0];
    if (void 0 === a) return null;
    const r = [],
      o = new Float32Array(16 * n.bones.length),
      A = new x();
    for (let l = 0; l < n.bones.length; ++l)
      (r.push(i.get(n.bones[l])),
        A.copy(n.boneInverses[l]),
        A.multiply(e.bindMatrix).toArray(o, 16 * l));
    (void 0 === t.skins && (t.skins = []),
      t.skins.push({
        inverseBindMatrices: this.processAccessor(new g(o, 16)),
        joints: r,
        skeleton: i.get(a),
      }));
    return (s.skin = t.skins.length - 1);
  }
  async processNodeAsync(e) {
    const t = this.json,
      i = this.options,
      s = this.nodeMap;
    t.nodes || (t.nodes = []);
    const n = {};
    if (i.trs) {
      const t = e.quaternion.toArray(),
        i = e.position.toArray(),
        s = e.scale.toArray();
      (kr(t, [0, 0, 0, 1]) || (n.rotation = t),
        kr(i, [0, 0, 0]) || (n.translation = i),
        kr(s, [1, 1, 1]) || (n.scale = s));
    } else
      (e.matrixAutoUpdate && e.updateMatrix(),
        !1 === kr(e.matrix.elements, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) &&
          (n.matrix = e.matrix.elements));
    if (
      ('' !== e.name && (n.name = String(e.name)),
      this.serializeUserData(e, n),
      e.isMesh || e.isLine || e.isPoints)
    ) {
      const t = await this.processMeshAsync(e);
      null !== t && (n.mesh = t);
    } else e.isCamera && (n.camera = this.processCamera(e));
    e.isSkinnedMesh && this.skins.push(e);
    const a = t.nodes.push(n) - 1;
    if ((s.set(e, a), e.children.length > 0)) {
      const t = [];
      for (let s = 0, n = e.children.length; s < n; s++) {
        const n = e.children[s];
        if (n.visible || !1 === i.onlyVisible) {
          const e = await this.processNodeAsync(n);
          null !== e && t.push(e);
        }
      }
      t.length > 0 && (n.children = t);
    }
    return (
      await this._invokeAllAsync(function (t) {
        t.writeNode && t.writeNode(e, n);
      }),
      a
    );
  }
  async processSceneAsync(e) {
    const t = this.json,
      i = this.options;
    t.scenes || ((t.scenes = []), (t.scene = 0));
    const s = {};
    ('' !== e.name && (s.name = e.name), t.scenes.push(s));
    const n = [];
    for (let a = 0, r = e.children.length; a < r; a++) {
      const t = e.children[a];
      if (t.visible || !1 === i.onlyVisible) {
        const e = await this.processNodeAsync(t);
        null !== e && n.push(e);
      }
    }
    (n.length > 0 && (s.nodes = n), this.serializeUserData(e, s));
  }
  async processObjectsAsync(e) {
    const t = new ot();
    t.name = 'AuxScene';
    for (let i = 0; i < e.length; i++) t.children.push(e[i]);
    await this.processSceneAsync(t);
  }
  async processInputAsync(e) {
    const t = this.options;
    ((e = e instanceof Array ? e : [e]),
      await this._invokeAllAsync(function (t) {
        t.beforeParse && t.beforeParse(e);
      }));
    const i = [];
    for (let s = 0; s < e.length; s++)
      e[s] instanceof ot ? await this.processSceneAsync(e[s]) : i.push(e[s]);
    i.length > 0 && (await this.processObjectsAsync(i));
    for (let s = 0; s < this.skins.length; ++s) this.processSkin(this.skins[s]);
    for (let s = 0; s < t.animations.length; ++s) this.processAnimation(t.animations[s], e[0]);
    await this._invokeAllAsync(function (t) {
      t.afterParse && t.afterParse(e);
    });
  }
  async _invokeAllAsync(e) {
    for (let t = 0, i = this.plugins.length; t < i; t++) await e(this.plugins[t]);
  }
}
class _r {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_lights_punctual'));
  }
  writeNode(e, t) {
    if (!e.isLight) return;
    if (!e.isDirectionalLight && !e.isPointLight && !e.isSpotLight)
      return void console.warn(
        'THREE.GLTFExporter: Only directional, point, and spot lights are supported.',
        e
      );
    const i = this.writer,
      s = i.json,
      n = i.extensionsUsed,
      a = {};
    (e.name && (a.name = e.name),
      (a.color = e.color.toArray()),
      (a.intensity = e.intensity),
      e.isDirectionalLight
        ? (a.type = 'directional')
        : e.isPointLight
          ? ((a.type = 'point'), e.distance > 0 && (a.range = e.distance))
          : e.isSpotLight &&
            ((a.type = 'spot'),
            e.distance > 0 && (a.range = e.distance),
            (a.spot = {}),
            (a.spot.innerConeAngle = (1 - e.penumbra) * e.angle),
            (a.spot.outerConeAngle = e.angle)),
      void 0 !== e.decay &&
        2 !== e.decay &&
        console.warn(
          'THREE.GLTFExporter: Light decay may be lost. glTF is physically-based, and expects light.decay=2.'
        ),
      !e.target ||
        (e.target.parent === e &&
          0 === e.target.position.x &&
          0 === e.target.position.y &&
          -1 === e.target.position.z) ||
        console.warn(
          'THREE.GLTFExporter: Light direction may be lost. For best results, make light.target a child of the light with position 0,0,-1.'
        ),
      n[this.name] ||
        ((s.extensions = s.extensions || {}),
        (s.extensions[this.name] = { lights: [] }),
        (n[this.name] = !0)));
    const r = s.extensions[this.name].lights;
    (r.push(a),
      (t.extensions = t.extensions || {}),
      (t.extensions[this.name] = { light: r.length - 1 }));
  }
}
class Pr {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_unlit'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshBasicMaterial) return;
    const i = this.writer.extensionsUsed;
    ((t.extensions = t.extensions || {}),
      (t.extensions[this.name] = {}),
      (i[this.name] = !0),
      (t.pbrMetallicRoughness.metallicFactor = 0),
      (t.pbrMetallicRoughness.roughnessFactor = 0.9));
  }
}
class Nr {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_clearcoat'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshPhysicalMaterial || 0 === e.clearcoat) return;
    const i = this.writer,
      s = i.extensionsUsed,
      n = {};
    if (((n.clearcoatFactor = e.clearcoat), e.clearcoatMap)) {
      const t = {
        index: await i.processTextureAsync(e.clearcoatMap),
        texCoord: e.clearcoatMap.channel,
      };
      (i.applyTextureTransform(t, e.clearcoatMap), (n.clearcoatTexture = t));
    }
    if (((n.clearcoatRoughnessFactor = e.clearcoatRoughness), e.clearcoatRoughnessMap)) {
      const t = {
        index: await i.processTextureAsync(e.clearcoatRoughnessMap),
        texCoord: e.clearcoatRoughnessMap.channel,
      };
      (i.applyTextureTransform(t, e.clearcoatRoughnessMap), (n.clearcoatRoughnessTexture = t));
    }
    if (e.clearcoatNormalMap) {
      const t = {
        index: await i.processTextureAsync(e.clearcoatNormalMap),
        texCoord: e.clearcoatNormalMap.channel,
      };
      (1 !== e.clearcoatNormalScale.x && (t.scale = e.clearcoatNormalScale.x),
        i.applyTextureTransform(t, e.clearcoatNormalMap),
        (n.clearcoatNormalTexture = t));
    }
    ((t.extensions = t.extensions || {}), (t.extensions[this.name] = n), (s[this.name] = !0));
  }
}
class Or {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_dispersion'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshPhysicalMaterial || 0 === e.dispersion) return;
    const i = this.writer.extensionsUsed,
      s = {};
    ((s.dispersion = e.dispersion),
      (t.extensions = t.extensions || {}),
      (t.extensions[this.name] = s),
      (i[this.name] = !0));
  }
}
class Hr {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_iridescence'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshPhysicalMaterial || 0 === e.iridescence) return;
    const i = this.writer,
      s = i.extensionsUsed,
      n = {};
    if (((n.iridescenceFactor = e.iridescence), e.iridescenceMap)) {
      const t = {
        index: await i.processTextureAsync(e.iridescenceMap),
        texCoord: e.iridescenceMap.channel,
      };
      (i.applyTextureTransform(t, e.iridescenceMap), (n.iridescenceTexture = t));
    }
    if (
      ((n.iridescenceIor = e.iridescenceIOR),
      (n.iridescenceThicknessMinimum = e.iridescenceThicknessRange[0]),
      (n.iridescenceThicknessMaximum = e.iridescenceThicknessRange[1]),
      e.iridescenceThicknessMap)
    ) {
      const t = {
        index: await i.processTextureAsync(e.iridescenceThicknessMap),
        texCoord: e.iridescenceThicknessMap.channel,
      };
      (i.applyTextureTransform(t, e.iridescenceThicknessMap), (n.iridescenceThicknessTexture = t));
    }
    ((t.extensions = t.extensions || {}), (t.extensions[this.name] = n), (s[this.name] = !0));
  }
}
class qr {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_transmission'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshPhysicalMaterial || 0 === e.transmission) return;
    const i = this.writer,
      s = i.extensionsUsed,
      n = {};
    if (((n.transmissionFactor = e.transmission), e.transmissionMap)) {
      const t = {
        index: await i.processTextureAsync(e.transmissionMap),
        texCoord: e.transmissionMap.channel,
      };
      (i.applyTextureTransform(t, e.transmissionMap), (n.transmissionTexture = t));
    }
    ((t.extensions = t.extensions || {}), (t.extensions[this.name] = n), (s[this.name] = !0));
  }
}
class jr {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_volume'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshPhysicalMaterial || 0 === e.transmission) return;
    const i = this.writer,
      s = i.extensionsUsed,
      n = {};
    if (((n.thicknessFactor = e.thickness), e.thicknessMap)) {
      const t = {
        index: await i.processTextureAsync(e.thicknessMap),
        texCoord: e.thicknessMap.channel,
      };
      (i.applyTextureTransform(t, e.thicknessMap), (n.thicknessTexture = t));
    }
    (e.attenuationDistance !== 1 / 0 && (n.attenuationDistance = e.attenuationDistance),
      (n.attenuationColor = e.attenuationColor.toArray()),
      (t.extensions = t.extensions || {}),
      (t.extensions[this.name] = n),
      (s[this.name] = !0));
  }
}
class zr {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_ior'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshPhysicalMaterial || 1.5 === e.ior) return;
    const i = this.writer.extensionsUsed,
      s = {};
    ((s.ior = e.ior),
      (t.extensions = t.extensions || {}),
      (t.extensions[this.name] = s),
      (i[this.name] = !0));
  }
}
class Kr {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_specular'));
  }
  async writeMaterialAsync(e, t) {
    if (
      !e.isMeshPhysicalMaterial ||
      (1 === e.specularIntensity &&
        e.specularColor.equals(Dr) &&
        !e.specularIntensityMap &&
        !e.specularColorMap)
    )
      return;
    const i = this.writer,
      s = i.extensionsUsed,
      n = {};
    if (e.specularIntensityMap) {
      const t = {
        index: await i.processTextureAsync(e.specularIntensityMap),
        texCoord: e.specularIntensityMap.channel,
      };
      (i.applyTextureTransform(t, e.specularIntensityMap), (n.specularTexture = t));
    }
    if (e.specularColorMap) {
      const t = {
        index: await i.processTextureAsync(e.specularColorMap),
        texCoord: e.specularColorMap.channel,
      };
      (i.applyTextureTransform(t, e.specularColorMap), (n.specularColorTexture = t));
    }
    ((n.specularFactor = e.specularIntensity),
      (n.specularColorFactor = e.specularColor.toArray()),
      (t.extensions = t.extensions || {}),
      (t.extensions[this.name] = n),
      (s[this.name] = !0));
  }
}
class Vr {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_sheen'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshPhysicalMaterial || 0 == e.sheen) return;
    const i = this.writer,
      s = i.extensionsUsed,
      n = {};
    if (e.sheenRoughnessMap) {
      const t = {
        index: await i.processTextureAsync(e.sheenRoughnessMap),
        texCoord: e.sheenRoughnessMap.channel,
      };
      (i.applyTextureTransform(t, e.sheenRoughnessMap), (n.sheenRoughnessTexture = t));
    }
    if (e.sheenColorMap) {
      const t = {
        index: await i.processTextureAsync(e.sheenColorMap),
        texCoord: e.sheenColorMap.channel,
      };
      (i.applyTextureTransform(t, e.sheenColorMap), (n.sheenColorTexture = t));
    }
    ((n.sheenRoughnessFactor = e.sheenRoughness),
      (n.sheenColorFactor = e.sheenColor.toArray()),
      (t.extensions = t.extensions || {}),
      (t.extensions[this.name] = n),
      (s[this.name] = !0));
  }
}
class Jr {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_anisotropy'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshPhysicalMaterial || 0 == e.anisotropy) return;
    const i = this.writer,
      s = i.extensionsUsed,
      n = {};
    if (e.anisotropyMap) {
      const t = { index: await i.processTextureAsync(e.anisotropyMap) };
      (i.applyTextureTransform(t, e.anisotropyMap), (n.anisotropyTexture = t));
    }
    ((n.anisotropyStrength = e.anisotropy),
      (n.anisotropyRotation = e.anisotropyRotation),
      (t.extensions = t.extensions || {}),
      (t.extensions[this.name] = n),
      (s[this.name] = !0));
  }
}
class Yr {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_emissive_strength'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshStandardMaterial || 1 === e.emissiveIntensity) return;
    const i = this.writer.extensionsUsed,
      s = {};
    ((s.emissiveStrength = e.emissiveIntensity),
      (t.extensions = t.extensions || {}),
      (t.extensions[this.name] = s),
      (i[this.name] = !0));
  }
}
class Wr {
  constructor(e) {
    ((this.writer = e), (this.name = 'EXT_materials_bump'));
  }
  async writeMaterialAsync(e, t) {
    if (!e.isMeshStandardMaterial || (1 === e.bumpScale && !e.bumpMap)) return;
    const i = this.writer,
      s = i.extensionsUsed,
      n = {};
    if (e.bumpMap) {
      const t = { index: await i.processTextureAsync(e.bumpMap), texCoord: e.bumpMap.channel };
      (i.applyTextureTransform(t, e.bumpMap), (n.bumpTexture = t));
    }
    ((n.bumpFactor = e.bumpScale),
      (t.extensions = t.extensions || {}),
      (t.extensions[this.name] = n),
      (s[this.name] = !0));
  }
}
class $r {
  constructor(e) {
    ((this.writer = e), (this.name = 'EXT_mesh_gpu_instancing'));
  }
  writeNode(e, t) {
    if (!e.isInstancedMesh) return;
    const i = this.writer,
      s = e,
      n = new Float32Array(3 * s.count),
      a = new Float32Array(4 * s.count),
      r = new Float32Array(3 * s.count),
      o = new x(),
      A = new S(),
      l = new M(),
      c = new S();
    for (let d = 0; d < s.count; d++)
      (s.getMatrixAt(d, o),
        o.decompose(A, l, c),
        A.toArray(n, 3 * d),
        l.toArray(a, 4 * d),
        c.toArray(r, 3 * d));
    const h = {
      TRANSLATION: i.processAccessor(new g(n, 3)),
      ROTATION: i.processAccessor(new g(a, 4)),
      SCALE: i.processAccessor(new g(r, 3)),
    };
    (s.instanceColor && (h._COLOR_0 = i.processAccessor(s.instanceColor)),
      (t.extensions = t.extensions || {}),
      (t.extensions[this.name] = { attributes: h }),
      (i.extensionsUsed[this.name] = !0),
      (i.extensionsRequired[this.name] = !0));
  }
}
ar.Utils = {
  insertKeyframe: function (e, t) {
    const i = 0.001,
      s = e.getValueSize(),
      n = new e.TimeBufferType(e.times.length + 1),
      a = new e.ValueBufferType(e.values.length + s),
      r = e.createInterpolant(new e.ValueBufferType(s));
    let o;
    if (0 === e.times.length) {
      n[0] = t;
      for (let e = 0; e < s; e++) a[e] = 0;
      o = 0;
    } else if (t < e.times[0]) {
      if (Math.abs(e.times[0] - t) < i) return 0;
      ((n[0] = t), n.set(e.times, 1), a.set(r.evaluate(t), 0), a.set(e.values, s), (o = 0));
    } else if (t > e.times[e.times.length - 1]) {
      if (Math.abs(e.times[e.times.length - 1] - t) < i) return e.times.length - 1;
      ((n[n.length - 1] = t),
        n.set(e.times, 0),
        a.set(e.values, 0),
        a.set(r.evaluate(t), e.values.length),
        (o = n.length - 1));
    } else
      for (let A = 0; A < e.times.length; A++) {
        if (Math.abs(e.times[A] - t) < i) return A;
        if (e.times[A] < t && e.times[A + 1] > t) {
          (n.set(e.times.slice(0, A + 1), 0),
            (n[A + 1] = t),
            n.set(e.times.slice(A + 1), A + 2),
            a.set(e.values.slice(0, (A + 1) * s), 0),
            a.set(r.evaluate(t), (A + 1) * s),
            a.set(e.values.slice((A + 1) * s), (A + 2) * s),
            (o = A + 1));
          break;
        }
      }
    return ((e.times = n), (e.values = a), o);
  },
  mergeMorphTargetTracks: function (e, t) {
    const i = [],
      s = {},
      n = e.tracks;
    for (let a = 0; a < n.length; ++a) {
      let e = n[a];
      const r = W.parseTrackName(e.name),
        o = W.findNode(t, r.nodeName);
      if ('morphTargetInfluences' !== r.propertyName || void 0 === r.propertyIndex) {
        i.push(e);
        continue;
      }
      if (
        e.createInterpolant !== e.InterpolantFactoryMethodDiscrete &&
        e.createInterpolant !== e.InterpolantFactoryMethodLinear
      ) {
        if (e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline)
          throw new Error(
            'THREE.GLTFExporter: Cannot merge tracks with glTF CUBICSPLINE interpolation.'
          );
        (console.warn(
          'THREE.GLTFExporter: Morph target interpolation mode not yet supported. Using LINEAR instead.'
        ),
          (e = e.clone()),
          e.setInterpolation(he));
      }
      const A = o.morphTargetInfluences.length,
        l = o.morphTargetDictionary[r.propertyIndex];
      if (void 0 === l)
        throw new Error('THREE.GLTFExporter: Morph target name not found: ' + r.propertyIndex);
      let c;
      if (void 0 === s[o.uuid]) {
        c = e.clone();
        const t = new c.ValueBufferType(A * c.times.length);
        for (let e = 0; e < c.times.length; e++) t[e * A + l] = c.values[e];
        ((c.name = (r.nodeName || '') + '.morphTargetInfluences'),
          (c.values = t),
          (s[o.uuid] = c),
          i.push(c));
        continue;
      }
      const h = e.createInterpolant(new e.ValueBufferType(1));
      c = s[o.uuid];
      for (let t = 0; t < c.times.length; t++) c.values[t * A + l] = h.evaluate(c.times[t]);
      for (let t = 0; t < e.times.length; t++) {
        const i = this.insertKeyframe(c, e.times[t]);
        c.values[i * A + l] = e.values[t];
      }
    }
    return ((e.tracks = i), e);
  },
  toFloat32BufferAttribute: function (e) {
    const t = new g(new Float32Array(e.count * e.itemSize), e.itemSize, !1);
    if (!e.normalized && !e.isInterleavedBufferAttribute) return (t.array.set(e.array), t);
    for (let i = 0, s = e.count; i < s; i++)
      for (let n = 0; n < e.itemSize; n++) t.setComponent(i, n, e.getComponent(i, n));
    return t;
  },
};
const Xr = e =>
    void 0 !== e.material &&
    e.userData &&
    e.userData.variantMaterials &&
    !!Array.from(e.userData.variantMaterials.values()).filter(e => Zr(e.material)),
  Zr = e => e && e.isMaterial && !Array.isArray(e);
class eo {
  constructor(e) {
    ((this.writer = e), (this.name = 'KHR_materials_variants'), (this.variantNames = []));
  }
  beforeParse(e) {
    const t = new Set(),
      i = e => {
        if (!Xr(e)) return;
        const i = e.userData.variantMaterials,
          s = e.userData.variantData;
        for (const [n, a] of s) {
          const e = i.get(a.index);
          e && Zr(e.material) && t.add(n);
        }
      };
    if (Array.isArray(e)) for (const s of e) s.traverse(i);
    else e.traverse(i);
    t.forEach(e => this.variantNames.push(e));
  }
  async writeMesh(e, t) {
    if (!Xr(e)) return;
    const i = e.userData,
      s = i.variantMaterials,
      n = i.variantData,
      a = new Map(),
      r = new Map(),
      o = Array.from(n.values()).sort((e, t) => e.index - t.index);
    for (const [c, h] of o.entries()) r.set(h.index, c);
    for (const c of n.values()) {
      const e = s.get(c.index);
      if (!e || !Zr(e.material)) continue;
      const t = await this.writer.processMaterialAsync(e.material);
      (a.has(t) || a.set(t, { material: t, variants: [] }), a.get(t).variants.push(r.get(c.index)));
    }
    const A = Array.from(a.values())
      .map(e => e.variants.sort((e, t) => e - t) && e)
      .sort((e, t) => e.material - t.material);
    if (0 === A.length) return;
    const l = Zr(i.originalMaterial)
      ? await this.writer.processMaterialAsync(i.originalMaterial)
      : -1;
    for (const c of t.primitives)
      (l >= 0 && (c.material = l),
        (c.extensions = c.extensions || {}),
        (c.extensions[this.name] = { mappings: A }));
  }
  afterParse() {
    if (0 === this.variantNames.length) return;
    const e = this.writer.json;
    e.extensions = e.extensions || {};
    const t = this.variantNames.map(e => ({ name: e }));
    ((e.extensions[this.name] = { variants: t }), (this.writer.extensionsUsed[this.name] = !0));
  }
}
class to {
  constructor(e, t, i, s, n) {
    ((this.xrLight = e),
      (this.renderer = t),
      (this.lightProbe = i),
      (this.xrWebGLBinding = null),
      (this.estimationStartCallback = n),
      (this.frameCallback = this.onXRFrame.bind(this)));
    const a = t.xr.getSession();
    if (s && 'XRWebGLBinding' in window) {
      const i = new lt(16);
      e.environment = i.texture;
      const s = t.getContext();
      switch (a.preferredReflectionFormat) {
        case 'srgba8':
          s.getExtension('EXT_sRGB');
          break;
        case 'rgba16f':
          s.getExtension('OES_texture_half_float');
      }
      ((this.xrWebGLBinding = new XRWebGLBinding(a, s)),
        this.lightProbe.addEventListener('reflectionchange', () => {
          this.updateReflection();
        }));
    }
    a.requestAnimationFrame(this.frameCallback);
  }
  updateReflection() {
    const e = this.renderer.properties.get(this.xrLight.environment);
    if (e) {
      const t = this.xrWebGLBinding.getReflectionCubeMap(this.lightProbe);
      t && ((e.__webglTexture = t), (this.xrLight.environment.needsPMREMUpdate = !0));
    }
  }
  onXRFrame(e, t) {
    if (!this.xrLight) return;
    t.session.requestAnimationFrame(this.frameCallback);
    const i = t.getLightEstimate(this.lightProbe);
    if (i) {
      (this.xrLight.lightProbe.sh.fromArray(i.sphericalHarmonicsCoefficients),
        (this.xrLight.lightProbe.intensity = 1));
      const e = Math.max(
        1,
        Math.max(
          i.primaryLightIntensity.x,
          Math.max(i.primaryLightIntensity.y, i.primaryLightIntensity.z)
        )
      );
      (this.xrLight.directionalLight.color.setRGB(
        i.primaryLightIntensity.x / e,
        i.primaryLightIntensity.y / e,
        i.primaryLightIntensity.z / e
      ),
        (this.xrLight.directionalLight.intensity = e),
        this.xrLight.directionalLight.position.copy(i.primaryLightDirection),
        this.estimationStartCallback &&
          (this.estimationStartCallback(), (this.estimationStartCallback = null)));
    }
  }
  dispose() {
    ((this.xrLight = null),
      (this.renderer = null),
      (this.lightProbe = null),
      (this.xrWebGLBinding = null));
  }
}
class io extends se {
  constructor(e, t = !0) {
    (super(),
      (this.lightProbe = new At()),
      (this.lightProbe.intensity = 0),
      this.add(this.lightProbe),
      (this.directionalLight = new v()),
      (this.directionalLight.intensity = 0),
      this.add(this.directionalLight),
      (this.environment = null));
    let i = null,
      s = !1;
    (e.xr.addEventListener('sessionstart', () => {
      const n = e.xr.getSession();
      'requestLightProbe' in n &&
        n.requestLightProbe({ reflectionFormat: n.preferredReflectionFormat }).then(n => {
          i = new to(this, e, n, t, () => {
            ((s = !0), this.dispatchEvent({ type: 'estimationstart' }));
          });
        });
    }),
      e.xr.addEventListener('sessionend', () => {
        (i && (i.dispose(), (i = null)), s && this.dispatchEvent({ type: 'estimationend' }));
      }),
      (this.dispose = () => {
        (i && (i.dispose(), (i = null)),
          this.remove(this.lightProbe),
          (this.lightProbe = null),
          this.remove(this.directionalLight),
          (this.directionalLight = null),
          (this.environment = null));
      }));
  }
}
class so {
  constructor(e = 50) {
    ((this.velocity = 0), (this.naturalFrequency = 0), this.setDecayTime(e));
  }
  setDecayTime(e) {
    this.naturalFrequency = 1 / Math.max(0.001, e);
  }
  update(e, t, i, s) {
    const n = 2e-4 * this.naturalFrequency;
    if (null == e || 0 === s) return t;
    if (e === t && 0 === this.velocity) return t;
    if (i < 0) return e;
    const a = e - t,
      r = this.velocity + this.naturalFrequency * a,
      o = a + i * r,
      A = Math.exp(-this.naturalFrequency * i),
      l = (r - this.naturalFrequency * o) * A,
      c = -this.naturalFrequency * (l + r * A);
    return Math.abs(l) < n * Math.abs(s) && c * a >= 0
      ? ((this.velocity = 0), t)
      : ((this.velocity = l), t + o * A);
  }
}
const no = 0.2,
  ao = Math.PI / 24,
  ro = new y(),
  oo = (e, t, i) => {
    let s = t > 0 ? (i > 0 ? 0 : -Math.PI / 2) : i > 0 ? Math.PI / 2 : Math.PI;
    for (let n = 0; n <= 12; ++n)
      (e.push(
        t + 0.17 * Math.cos(s),
        i + 0.17 * Math.sin(s),
        0,
        t + no * Math.cos(s),
        i + no * Math.sin(s),
        0
      ),
        (s += ao));
  };
class Ao extends X {
  constructor(e, t) {
    const i = new d(),
      s = [],
      n = [],
      { size: a, boundingBox: r } = e,
      o = a.x / 2,
      A = ('back' === t ? a.y : a.z) / 2;
    (oo(n, o, A), oo(n, -o, A), oo(n, -o, -A), oo(n, o, -A));
    const l = n.length / 3;
    for (let d = 0; d < l - 2; d += 2) s.push(d, d + 1, d + 3, d, d + 3, d + 2);
    const c = l - 2;
    (s.push(c, c + 1, 1, c, 1, 0),
      i.setAttribute('position', new ct(n, 3)),
      i.setIndex(s),
      super(i),
      (this.side = t));
    const h = this.material;
    switch (
      ((h.side = J),
      (h.transparent = !0),
      (h.opacity = 0),
      (this.goalOpacity = 0),
      (this.opacityDamper = new so()),
      (this.hitPlane = new X(new ht(2 * (o + no), 2 * (A + no)))),
      (this.hitPlane.visible = !1),
      (this.hitPlane.material.side = J),
      this.add(this.hitPlane),
      (this.hitBox = new X(new dt(a.x + 0.4, a.y + no, a.z + 0.4))),
      (this.hitBox.visible = !1),
      (this.hitBox.material.side = J),
      this.add(this.hitBox),
      r.getCenter(this.position),
      t)
    ) {
      case 'bottom':
        (this.rotateX(-Math.PI / 2),
          (this.shadowHeight = r.min.y),
          (this.position.y = this.shadowHeight));
        break;
      case 'back':
        ((this.shadowHeight = r.min.z), (this.position.z = this.shadowHeight));
    }
    (e.target.add(this),
      (this.hitBox.position.y = (a.y + no) / 2 + r.min.y),
      e.target.add(this.hitBox),
      (this.offsetHeight = 0));
  }
  getHit(e, t, i) {
    (ro.set(t, -i), (this.hitPlane.visible = !0));
    const s = e.positionAndNormalFromPoint(ro, this.hitPlane);
    return ((this.hitPlane.visible = !1), null == s ? null : s.position);
  }
  getExpandedHit(e, t, i) {
    (this.hitPlane.scale.set(1e3, 1e3, 1e3), this.hitPlane.updateMatrixWorld());
    const s = this.getHit(e, t, i);
    return (this.hitPlane.scale.set(1, 1, 1), s);
  }
  controllerIntersection(e, t) {
    this.hitBox.visible = !0;
    const i = e.hitFromController(t, this.hitBox);
    return ((this.hitBox.visible = !1), i);
  }
  set offsetHeight(e) {
    ((e -= 0.001),
      'back' === this.side
        ? (this.position.z = this.shadowHeight + e)
        : (this.position.y = this.shadowHeight + e));
  }
  get offsetHeight() {
    return 'back' === this.side
      ? this.position.z - this.shadowHeight
      : this.position.y - this.shadowHeight;
  }
  set show(e) {
    this.goalOpacity = e ? 0.75 : 0;
  }
  updateOpacity(e) {
    const t = this.material;
    ((t.opacity = this.opacityDamper.update(t.opacity, this.goalOpacity, e, 1)),
      (this.visible = t.opacity > 0));
  }
  dispose() {
    const { geometry: e, material: t } = this.hitPlane;
    (e.dispose(),
      t.dispose(),
      this.hitBox.geometry.dispose(),
      this.hitBox.material.dispose(),
      this.geometry.dispose(),
      this.material.dispose(),
      this.hitBox.removeFromParent(),
      this.removeFromParent());
  }
}
const lo = (e, t) => ({ type: 'number', number: e, unit: t }),
  co = (() => {
    const e = {};
    return t => {
      const i = t;
      if (i in e) return e[i];
      const s = [];
      let n = 0;
      for (; t; ) {
        if (++n > 1e3) {
          t = '';
          break;
        }
        const e = ho(t),
          i = e.nodes[0];
        if (null == i || 0 === i.terms.length) break;
        (s.push(i), (t = e.remainingInput));
      }
      return (e[i] = s);
    };
  })(),
  ho = (() => {
    const e = /^(\-\-|[a-z\u0240-\uffff])/i,
      t = /^([\*\+\/]|[\-]\s)/i,
      i = /^[\),]/;
    return s => {
      const n = [];
      for (; s.length && ((s = s.trim()), !i.test(s)); )
        if ('(' === s[0]) {
          const { nodes: e, remainingInput: t } = mo(s);
          ((s = t),
            n.push({ type: 'function', name: { type: 'ident', value: 'calc' }, arguments: e }));
        } else if (e.test(s)) {
          const e = go(s),
            t = e.nodes[0];
          if ('(' === (s = e.remainingInput)[0]) {
            const { nodes: e, remainingInput: i } = mo(s);
            (n.push({ type: 'function', name: t, arguments: e }), (s = i));
          } else n.push(t);
        } else if (t.test(s)) (n.push({ type: 'operator', value: s[0] }), (s = s.slice(1)));
        else {
          const { nodes: e, remainingInput: t } = '#' === s[0] ? po(s) : uo(s);
          if (0 === e.length) break;
          (n.push(e[0]), (s = t));
        }
      return { nodes: [{ type: 'expression', terms: n }], remainingInput: s };
    };
  })(),
  go = (() => {
    const e = /[^a-z0-9_\-\u0240-\uffff]/i;
    return t => {
      const i = t.match(e);
      return {
        nodes: [{ type: 'ident', value: null == i ? t : t.substr(0, i.index) }],
        remainingInput: null == i ? '' : t.substr(i.index),
      };
    };
  })(),
  uo = (() => {
    const e = /[\+\-]?(\d+[\.]\d+|\d+|[\.]\d+)([eE][\+\-]?\d+)?/,
      t = /^[a-z%]+/i,
      i = /^(m|mm|cm|rad|deg|[%])$/;
    return s => {
      const n = s.match(e),
        a = null == n ? '0' : n[0],
        r = (s = null == a ? s : s.slice(a.length)).match(t);
      let o = null != r && '' !== r[0] ? r[0] : null;
      const A = null == r ? s : s.slice(o.length);
      return (
        null == o || i.test(o) || (o = null),
        { nodes: [{ type: 'number', number: parseFloat(a) || 0, unit: o }], remainingInput: A }
      );
    };
  })(),
  po = (() => {
    const e = /^[a-f0-9]*/i;
    return t => {
      const i = (t = t.slice(1).trim()).match(e);
      return {
        nodes: null == i ? [] : [{ type: 'hex', value: i[0] }],
        remainingInput: null == i ? t : t.slice(i[0].length),
      };
    };
  })(),
  mo = e => {
    const t = [];
    for (e = e.slice(1).trim(); e.length; ) {
      const i = ho(e);
      if ((t.push(i.nodes[0]), ',' === (e = i.remainingInput.trim())[0])) e = e.slice(1).trim();
      else if (')' === e[0]) {
        e = e.slice(1);
        break;
      }
    }
    return { nodes: t, remainingInput: e };
  },
  bo = Symbol('visitedTypes');
class fo {
  constructor(e) {
    this[bo] = e;
  }
  walk(e, t) {
    const i = e.slice();
    for (; i.length; ) {
      const e = i.shift();
      switch ((this[bo].indexOf(e.type) > -1 && t(e), e.type)) {
        case 'expression':
          i.unshift(...e.terms);
          break;
        case 'function':
          i.unshift(e.name, ...e.arguments);
      }
    }
  }
}
const Io = Object.freeze({ type: 'number', number: 0, unit: null }),
  Co = (e, t = 0) => {
    let { number: i, unit: s } = e;
    if (isFinite(i)) {
      if ('rad' === e.unit || null == e.unit) return e;
    } else ((i = t), (s = 'rad'));
    return {
      type: 'number',
      number: (('deg' === s && null != i ? i : 0) * Math.PI) / 180,
      unit: 'rad',
    };
  },
  Eo = (e, t = 0) => {
    let i,
      { number: s, unit: n } = e;
    if (isFinite(s)) {
      if ('m' === e.unit) return e;
    } else ((s = t), (n = 'm'));
    switch (n) {
      default:
        i = 1;
        break;
      case 'cm':
        i = 0.01;
        break;
      case 'mm':
        i = 0.001;
    }
    return { type: 'number', number: i * s, unit: 'm' };
  },
  Bo = (() => {
    const e = e => e,
      t = { rad: e, deg: Co, m: e, mm: Eo, cm: Eo };
    return (e, i = Io) => {
      isFinite(e.number) || ((e.number = i.number), (e.unit = i.unit));
      const { unit: s } = e;
      if (null == s) return e;
      const n = t[s];
      return null == n ? i : n(e);
    };
  })();
var yo, wo, Qo;
const vo = Symbol('evaluate'),
  xo = Symbol('lastValue');
class So {
  constructor() {
    this[yo] = null;
  }
  static evaluatableFor(e, t = Io) {
    if (e instanceof So) return e;
    if ('number' === e.type) return '%' === e.unit ? new To(e, t) : e;
    switch (e.name.value) {
      case 'calc':
        return new Uo(e, t);
      case 'env':
        return new ko(e);
    }
    return Io;
  }
  static evaluate(e) {
    return e instanceof So ? e.evaluate() : e;
  }
  static isConstant(e) {
    return !(e instanceof So) || e.isConstant;
  }
  static applyIntrinsics(e, t) {
    const { basis: i, keywords: s } = t,
      { auto: n } = s;
    return i.map((t, i) => {
      const a = null == n[i] ? t : n[i];
      let r = e[i] ? e[i] : a;
      if ('ident' === r.type) {
        const e = r.value;
        e in s && (r = s[e][i]);
      }
      return (
        (null != r && 'ident' !== r.type) || (r = a),
        '%' === r.unit
          ? lo((r.number / 100) * t.number, t.unit)
          : ((r = Bo(r, t)), r.unit !== t.unit ? t : r)
      );
    });
  }
  get isConstant() {
    return !1;
  }
  evaluate() {
    return ((this.isConstant && null != this[xo]) || (this[xo] = this[vo]()), this[xo]);
  }
}
yo = xo;
const Ro = Symbol('percentage'),
  Mo = Symbol('basis');
class To extends So {
  constructor(e, t) {
    (super(), (this[Ro] = e), (this[Mo] = t));
  }
  get isConstant() {
    return !0;
  }
  [vo]() {
    return lo((this[Ro].number / 100) * this[Mo].number, this[Mo].unit);
  }
}
const Do = Symbol('identNode');
class ko extends So {
  constructor(e) {
    (super(), (this[wo] = null));
    const t = e.arguments.length ? e.arguments[0].terms[0] : null;
    null != t && 'ident' === t.type && (this[Do] = t);
  }
  get isConstant() {
    return !1;
  }
  [((wo = Do), vo)]() {
    if (null != this[Do] && 'window-scroll-y' === this[Do].value) {
      return {
        type: 'number',
        number:
          window.pageYOffset /
            (Math.max(
              document.body.scrollHeight,
              document.body.offsetHeight,
              document.documentElement.clientHeight,
              document.documentElement.scrollHeight,
              document.documentElement.offsetHeight
            ) -
              window.innerHeight) || 0,
        unit: null,
      };
    }
    return Io;
  }
}
const Fo = /[\*\/]/,
  Lo = Symbol('evaluator');
class Uo extends So {
  constructor(e, t = Io) {
    if ((super(), (this[Qo] = null), 1 !== e.arguments.length)) return;
    const i = e.arguments[0].terms.slice(),
      s = [];
    for (; i.length; ) {
      const e = i.shift();
      if (s.length > 0) {
        const i = s[s.length - 1];
        if ('operator' === i.type && Fo.test(i.value)) {
          const i = s.pop(),
            n = s.pop();
          if (null == n) return;
          s.push(new No(i, So.evaluatableFor(n, t), So.evaluatableFor(e, t)));
          continue;
        }
      }
      s.push('operator' === e.type ? e : So.evaluatableFor(e, t));
    }
    for (; s.length > 2; ) {
      const [e, i, n] = s.splice(0, 3);
      if ('operator' !== i.type) return;
      s.unshift(new No(i, So.evaluatableFor(e, t), So.evaluatableFor(n, t)));
    }
    1 === s.length && (this[Lo] = s[0]);
  }
  get isConstant() {
    return null == this[Lo] || So.isConstant(this[Lo]);
  }
  [((Qo = Lo), vo)]() {
    return null != this[Lo] ? So.evaluate(this[Lo]) : Io;
  }
}
const Go = Symbol('operator'),
  _o = Symbol('left'),
  Po = Symbol('right');
class No extends So {
  constructor(e, t, i) {
    (super(), (this[Go] = e), (this[_o] = t), (this[Po] = i));
  }
  get isConstant() {
    return So.isConstant(this[_o]) && So.isConstant(this[Po]);
  }
  [vo]() {
    const e = Bo(So.evaluate(this[_o])),
      t = Bo(So.evaluate(this[Po])),
      { number: i, unit: s } = e,
      { number: n, unit: a } = t;
    if (null != a && null != s && a != s) return Io;
    const r = s || a;
    let o;
    switch (this[Go].value) {
      case '+':
        o = i + n;
        break;
      case '-':
        o = i - n;
        break;
      case '/':
        o = i / n;
        break;
      case '*':
        o = i * n;
        break;
      default:
        return Io;
    }
    return { type: 'number', number: o, unit: r };
  }
}
const Oo = Symbol('evaluatables'),
  Ho = Symbol('intrinsics');
class qo extends So {
  constructor(e, t) {
    (super(), (this[Ho] = t));
    const i = e[0],
      s = null != i ? i.terms : [];
    this[Oo] = t.basis.map((e, t) => {
      const i = s[t];
      return null == i
        ? { type: 'ident', value: 'auto' }
        : 'ident' === i.type
          ? i
          : So.evaluatableFor(i, e);
    });
  }
  get isConstant() {
    for (const e of this[Oo]) if (!So.isConstant(e)) return !1;
    return !0;
  }
  [vo]() {
    const e = this[Oo].map(e => So.evaluate(e));
    return So.applyIntrinsics(e, this[Ho]).map(e => e.number);
  }
}
var jo, zo, Ko, Vo;
const Jo = Symbol('instances'),
  Yo = Symbol('activateListener'),
  Wo = Symbol('deactivateListener'),
  $o = Symbol('notifyInstances'),
  Xo = Symbol('notify'),
  Zo = Symbol('callback');
class eA {
  static [$o]() {
    for (const e of eA[Jo]) e[Xo]();
  }
  static [((jo = Jo), Yo)]() {
    window.addEventListener('scroll', this[$o], { passive: !0 });
  }
  static [Wo]() {
    window.removeEventListener('scroll', this[$o]);
  }
  constructor(e) {
    this[Zo] = e;
  }
  observe() {
    (0 === eA[Jo].size && eA[Yo](), eA[Jo].add(this));
  }
  disconnect() {
    (eA[Jo].delete(this), 0 === eA[Jo].size && eA[Wo]());
  }
  [Xo]() {
    this[Zo]();
  }
}
eA[jo] = new Set();
const tA = Symbol('computeStyleCallback'),
  iA = Symbol('astWalker'),
  sA = Symbol('dependencies'),
  nA = Symbol('onScroll');
class aA {
  constructor(e) {
    ((this[zo] = {}),
      (this[Ko] = new fo(['function'])),
      (this[Vo] = () => {
        this[tA]({ relatedState: 'window-scroll' });
      }),
      (this[tA] = e));
  }
  observeEffectsFor(e) {
    const t = {},
      i = this[sA];
    this[iA].walk(e, e => {
      const { name: s } = e,
        n = e.arguments[0].terms[0];
      if ('env' === s.value && null != n && 'ident' === n.type && 'window-scroll-y' === n.value)
        if (null == t['window-scroll']) {
          const e = 'window-scroll' in i ? i['window-scroll'] : new eA(this[nA]);
          (e.observe(), delete i['window-scroll'], (t['window-scroll'] = e));
        }
    });
    for (const s in i) {
      i[s].disconnect();
    }
    this[sA] = t;
  }
  dispose() {
    for (const e in this[sA]) {
      this[sA][e].disconnect();
    }
  }
}
((zo = sA), (Ko = iA), (Vo = nA));
const rA = e => {
    const t = e.observeEffects || !1,
      i = e.intrinsics instanceof Function ? e.intrinsics : () => e.intrinsics;
    return (s, n) => {
      const a = s.updated,
        r = s.connectedCallback,
        o = s.disconnectedCallback,
        A = Symbol(`${n}StyleEffector`),
        l = Symbol(`${n}StyleEvaluator`),
        c = Symbol(`${n}UpdateEvaluator`),
        h = Symbol(`${n}EvaluateAndSync`);
      Object.defineProperties(s, {
        [A]: { value: null, writable: !0 },
        [l]: { value: null, writable: !0 },
        [c]: {
          value: function () {
            const e = co(this[n]);
            ((this[l] = new qo(e, i(this))),
              null == this[A] && t && (this[A] = new aA(() => this[h]())),
              null != this[A] && this[A].observeEffectsFor(e));
          },
        },
        [h]: {
          value: function () {
            if (null == this[l]) return;
            const t = this[l].evaluate();
            this[e.updateHandler](t);
          },
        },
        updated: {
          value: function (e) {
            (e.has(n) && (this[c](), this[h]()), a.call(this, e));
          },
        },
        connectedCallback: {
          value: function () {
            (r.call(this), this.requestUpdate(n, this[n]));
          },
        },
        disconnectedCallback: {
          value: function () {
            (o.call(this), null != this[A] && (this[A].dispose(), (this[A] = null)));
          },
        },
      });
    };
  },
  oA = e => (e < 0.5 ? 2 * e * e : (4 - 2 * e) * e - 1),
  AA =
    (e, t, i = oA) =>
    s =>
      e + (t - e) * i(s),
  lA = e => {
    const t = [],
      i = [];
    let s = e.initialValue;
    for (let n = 0; n < e.keyframes.length; ++n) {
      const a = e.keyframes[n],
        { value: r, frames: o } = a,
        A = a.ease || oA,
        l = AA(s, r, A);
      (t.push(l), i.push(o), (s = r));
    }
    return ((e, t) => {
      const i = t.map(((s = 0), e => (s += e)));
      var s;
      return t => {
        ((t = ls(t, 0, 1)), (t *= i[i.length - 1]));
        const s = i.findIndex(e => e >= t),
          n = s < 1 ? 0 : i[s - 1],
          a = i[s];
        return e[s]((t - n) / (a - n));
      };
    })(t, i);
  };
var cA = function (e, t, i, s) {
  var n,
    a = arguments.length,
    r = a < 3 ? t : null === s ? (s = Object.getOwnPropertyDescriptor(t, i)) : s;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
    r = Reflect.decorate(e, t, i, s);
  else
    for (var o = e.length - 1; o >= 0; o--)
      (n = e[o]) && (r = (a < 3 ? n(r) : a > 3 ? n(t, i, r) : n(t, i)) || r);
  return (a > 3 && r && Object.defineProperty(t, i, r), r);
};
const hA = lA({
    initialValue: 0,
    keyframes: [
      { frames: 5, value: -1 },
      { frames: 1, value: -1 },
      { frames: 8, value: 1 },
      { frames: 1, value: 1 },
      { frames: 5, value: 0 },
      { frames: 18, value: 0 },
    ],
  }),
  dA = lA({
    initialValue: 0,
    keyframes: [
      { frames: 1, value: 1 },
      { frames: 5, value: 1 },
      { frames: 1, value: 0 },
      { frames: 6, value: 0 },
    ],
  }),
  gA = '0deg 75deg 105%',
  uA = ['front', 'right', 'back', 'left'],
  pA = ['upper-', '', 'lower-'],
  mA = 'auto',
  bA = 'basic',
  fA = 'wiggle',
  IA = 'none',
  CA = () => ({ basis: [Co(lo(30, 'deg'))], keywords: { auto: [null] } }),
  EA = () => ({ basis: [Co(lo(12, 'deg'))], keywords: { auto: [null] } }),
  BA = (() => {
    const e = co(gA)[0].terms,
      t = Bo(e[0]),
      i = Bo(e[1]);
    return e => {
      const s = e[Wd].idealCameraDistance();
      return { basis: [t, i, lo(s, 'm')], keywords: { auto: [null, null, lo(105, '%')] } };
    };
  })(),
  yA = e => {
    const t = 2.2 * e[Wd].boundingSphere.radius;
    return {
      basis: [lo(-1 / 0, 'rad'), lo(0, 'rad'), lo(t, 'm')],
      keywords: { auto: [null, null, null] },
    };
  },
  wA = e => {
    const t = BA(e),
      i = new qo([], t).evaluate()[2];
    return {
      basis: [lo(1 / 0, 'rad'), lo(Math.PI, 'rad'), lo(i, 'm')],
      keywords: { auto: [null, null, null] },
    };
  },
  QA = e => {
    const t = e[Wd].boundingBox.getCenter(new S());
    return {
      basis: [lo(t.x, 'm'), lo(t.y, 'm'), lo(t.z, 'm')],
      keywords: { auto: [null, null, null] },
    };
  },
  vA = Math.PI / 2,
  xA = Math.PI / 3,
  SA = vA / 2,
  RA = 2 * Math.PI,
  MA = Symbol('controls'),
  TA = Symbol('panElement'),
  DA = Symbol('promptElement'),
  kA = Symbol('promptAnimatedContainer'),
  FA = Symbol('fingerAnimatedContainers'),
  LA = Symbol('deferInteractionPrompt'),
  UA = Symbol('updateAria'),
  GA = Symbol('a11y'),
  _A = Symbol('updateA11y'),
  PA = Symbol('updateCameraForRadius'),
  NA = Symbol('cancelPrompts'),
  OA = Symbol('onChange'),
  HA = Symbol('onPointerChange'),
  qA = Symbol('waitingToPromptUser'),
  jA = Symbol('userHasInteracted'),
  zA = Symbol('promptElementVisibleTime'),
  KA = Symbol('lastPromptOffset'),
  VA = Symbol('cancellationSource'),
  JA = Symbol('lastSpherical'),
  YA = Symbol('jumpCamera'),
  WA = Symbol('initialized'),
  $A = Symbol('maintainThetaPhi'),
  XA = Symbol('syncCameraOrbit'),
  ZA = Symbol('syncFieldOfView'),
  el = Symbol('syncCameraTarget'),
  tl = Symbol('syncMinCameraOrbit'),
  il = Symbol('syncMaxCameraOrbit'),
  sl = Symbol('syncMinFieldOfView'),
  nl = Symbol('syncMaxFieldOfView'),
  al = new y(),
  rl = new S(),
  ol = Object.freeze({
    minimumRadius: 0,
    maximumRadius: 1 / 0,
    minimumPolarAngle: 0,
    maximumPolarAngle: Math.PI,
    minimumAzimuthalAngle: -1 / 0,
    maximumAzimuthalAngle: 1 / 0,
    minimumFieldOfView: 10,
    maximumFieldOfView: 45,
    touchAction: 'none',
  }),
  Al = Math.PI / 8,
  ll = 0.04,
  cl = { USER_INTERACTION: 'user-interaction', NONE: 'none', AUTOMATIC: 'automatic' };
class hl extends st {
  constructor(e, t, i) {
    (super(),
      (this.camera = e),
      (this.element = t),
      (this.scene = i),
      (this.orbitSensitivity = 1),
      (this.zoomSensitivity = 1),
      (this.panSensitivity = 1),
      (this.inputSensitivity = 1),
      (this.changeSource = cl.NONE),
      (this._interactionEnabled = !1),
      (this._disableZoom = !1),
      (this.isUserPointing = !1),
      (this.enablePan = !0),
      (this.enableTap = !0),
      (this.panProjection = new ut()),
      (this.panPerPixel = 0),
      (this.spherical = new gt()),
      (this.goalSpherical = new gt()),
      (this.thetaDamper = new so()),
      (this.phiDamper = new so()),
      (this.radiusDamper = new so()),
      (this.logFov = Math.log(ol.maximumFieldOfView)),
      (this.goalLogFov = this.logFov),
      (this.fovDamper = new so()),
      (this.touchMode = null),
      (this.pointers = []),
      (this.startTime = 0),
      (this.startPointerPosition = { clientX: 0, clientY: 0 }),
      (this.lastSeparation = 0),
      (this.touchDecided = !1),
      (this.onContext = e => {
        if (this.enablePan) e.preventDefault();
        else
          for (const t of this.pointers)
            this.onPointerUp(
              new PointerEvent(
                'pointercancel',
                Object.assign(Object.assign({}, this.startPointerPosition), { pointerId: t.id })
              )
            );
      }),
      (this.touchModeZoom = (e, t) => {
        if (!this._disableZoom) {
          const e = this.twoTouchDistance(this.pointers[0], this.pointers[1]),
            t = (ll * this.zoomSensitivity * (this.lastSeparation - e) * 50) / this.scene.height;
          ((this.lastSeparation = e), this.userAdjustOrbit(0, 0, t));
        }
        this.panPerPixel > 0 && this.movePan(e, t);
      }),
      (this.disableScroll = e => {
        e.preventDefault();
      }),
      (this.touchModeRotate = (e, t) => {
        const { touchAction: i } = this._options;
        if (!this.touchDecided && 'none' !== i) {
          this.touchDecided = !0;
          const s = Math.abs(e),
            n = Math.abs(t);
          if (
            this.changeSource === cl.USER_INTERACTION &&
            (('pan-y' === i && n > s) || ('pan-x' === i && s > n))
          )
            return void (this.touchMode = null);
          this.element.addEventListener('touchmove', this.disableScroll, { passive: !1 });
        }
        this.handleSinglePointerMove(e, t);
      }),
      (this.onPointerDown = e => {
        if (this.pointers.length > 2) return;
        const { element: t } = this;
        0 === this.pointers.length &&
          (t.addEventListener('pointermove', this.onPointerMove),
          t.addEventListener('pointerup', this.onPointerUp),
          (this.touchMode = null),
          (this.touchDecided = !1),
          (this.startPointerPosition.clientX = e.clientX),
          (this.startPointerPosition.clientY = e.clientY),
          (this.startTime = performance.now()));
        try {
          t.setPointerCapture(e.pointerId);
        } catch (i) {}
        (this.pointers.push({ clientX: e.clientX, clientY: e.clientY, id: e.pointerId }),
          (this.isUserPointing = !1),
          'touch' === e.pointerType
            ? ((this.changeSource = e.altKey ? cl.AUTOMATIC : cl.USER_INTERACTION),
              this.onTouchChange(e))
            : ((this.changeSource = cl.USER_INTERACTION), this.onMouseDown(e)),
          this.changeSource === cl.USER_INTERACTION &&
            this.dispatchEvent({ type: 'user-interaction' }));
      }),
      (this.onPointerMove = e => {
        const t = this.pointers.find(t => t.id === e.pointerId);
        if (null == t) return;
        if ('mouse' === e.pointerType && 0 === e.buttons) return void this.onPointerUp(e);
        const i = this.pointers.length,
          s = (e.clientX - t.clientX) / i,
          n = (e.clientY - t.clientY) / i;
        (0 === s && 0 === n) ||
          ((t.clientX = e.clientX),
          (t.clientY = e.clientY),
          'touch' === e.pointerType
            ? ((this.changeSource = e.altKey ? cl.AUTOMATIC : cl.USER_INTERACTION),
              null !== this.touchMode && this.touchMode(s, n))
            : ((this.changeSource = cl.USER_INTERACTION),
              this.panPerPixel > 0 ? this.movePan(s, n) : this.handleSinglePointerMove(s, n)));
      }),
      (this.onPointerUp = e => {
        const { element: t } = this,
          i = this.pointers.findIndex(t => t.id === e.pointerId);
        (-1 !== i && this.pointers.splice(i, 1),
          this.panPerPixel > 0 && !e.altKey && this.resetRadius(),
          0 === this.pointers.length
            ? (t.removeEventListener('pointermove', this.onPointerMove),
              t.removeEventListener('pointerup', this.onPointerUp),
              t.removeEventListener('touchmove', this.disableScroll),
              this.enablePan && this.enableTap && this.recenter(e))
            : null !== this.touchMode && this.onTouchChange(e),
          (this.scene.element[TA].style.opacity = 0),
          (t.style.cursor = 'grab'),
          (this.panPerPixel = 0),
          this.isUserPointing && this.dispatchEvent({ type: 'pointer-change-end' }));
      }),
      (this.onWheel = e => {
        this.changeSource = cl.USER_INTERACTION;
        const t = (e.deltaY * (1 == e.deltaMode ? 18 : 1) * ll * this.zoomSensitivity) / 30;
        (this.userAdjustOrbit(0, 0, t),
          e.preventDefault(),
          this.dispatchEvent({ type: 'user-interaction' }));
      }),
      (this.onKeyDown = e => {
        const { changeSource: t } = this;
        this.changeSource = cl.USER_INTERACTION;
        (e.shiftKey && this.enablePan ? this.panKeyCodeHandler(e) : this.orbitZoomKeyCodeHandler(e))
          ? (e.preventDefault(), this.dispatchEvent({ type: 'user-interaction' }))
          : (this.changeSource = t);
      }),
      (this._options = Object.assign({}, ol)),
      this.setOrbit(0, Math.PI / 2, 1),
      this.setFieldOfView(100),
      this.jumpToGoal());
  }
  get interactionEnabled() {
    return this._interactionEnabled;
  }
  enableInteraction() {
    if (!1 === this._interactionEnabled) {
      const { element: e } = this;
      (e.addEventListener('pointerdown', this.onPointerDown),
        e.addEventListener('pointercancel', this.onPointerUp),
        this._disableZoom || e.addEventListener('wheel', this.onWheel),
        e.addEventListener('keydown', this.onKeyDown),
        e.addEventListener('touchmove', () => {}, { passive: !1 }),
        e.addEventListener('contextmenu', this.onContext),
        (this.element.style.cursor = 'grab'),
        (this._interactionEnabled = !0),
        this.updateTouchActionStyle());
    }
  }
  disableInteraction() {
    if (!0 === this._interactionEnabled) {
      const { element: e } = this;
      (e.removeEventListener('pointerdown', this.onPointerDown),
        e.removeEventListener('pointermove', this.onPointerMove),
        e.removeEventListener('pointerup', this.onPointerUp),
        e.removeEventListener('pointercancel', this.onPointerUp),
        e.removeEventListener('wheel', this.onWheel),
        e.removeEventListener('keydown', this.onKeyDown),
        e.removeEventListener('contextmenu', this.onContext),
        (e.style.cursor = ''),
        (this.touchMode = null),
        (this._interactionEnabled = !1),
        this.updateTouchActionStyle());
    }
  }
  get options() {
    return this._options;
  }
  set disableZoom(e) {
    this._disableZoom != e &&
      ((this._disableZoom = e),
      !0 === e
        ? this.element.removeEventListener('wheel', this.onWheel)
        : this.element.addEventListener('wheel', this.onWheel),
      this.updateTouchActionStyle());
  }
  getCameraSpherical(e = new gt()) {
    return e.copy(this.spherical);
  }
  getFieldOfView() {
    return this.camera.fov;
  }
  applyOptions(e) {
    (Object.assign(this._options, e),
      this.setOrbit(),
      this.setFieldOfView(Math.exp(this.goalLogFov)));
  }
  updateNearFar(e, t) {
    ((this.camera.far = 0 === t ? 2 : t),
      (this.camera.near = Math.max(e, this.camera.far / 1e3)),
      this.camera.updateProjectionMatrix());
  }
  updateAspect(e) {
    ((this.camera.aspect = e), this.camera.updateProjectionMatrix());
  }
  setOrbit(
    e = this.goalSpherical.theta,
    t = this.goalSpherical.phi,
    i = this.goalSpherical.radius
  ) {
    const {
        minimumAzimuthalAngle: s,
        maximumAzimuthalAngle: n,
        minimumPolarAngle: a,
        maximumPolarAngle: r,
        minimumRadius: o,
        maximumRadius: A,
      } = this._options,
      { theta: l, phi: c, radius: h } = this.goalSpherical,
      d = ls(e, s, n);
    isFinite(s) ||
      isFinite(n) ||
      (this.spherical.theta = this.wrapAngle(this.spherical.theta - d) + d);
    const g = ls(t, a, r),
      u = ls(i, o, A);
    return (
      (d !== l || g !== c || u !== h) &&
      !!(isFinite(d) && isFinite(g) && isFinite(u)) &&
      ((this.goalSpherical.theta = d),
      (this.goalSpherical.phi = g),
      (this.goalSpherical.radius = u),
      this.goalSpherical.makeSafe(),
      !0)
    );
  }
  setRadius(e) {
    ((this.goalSpherical.radius = e), this.setOrbit());
  }
  setFieldOfView(e) {
    const { minimumFieldOfView: t, maximumFieldOfView: i } = this._options;
    ((e = ls(e, t, i)), (this.goalLogFov = Math.log(e)));
  }
  setDamperDecayTime(e) {
    (this.thetaDamper.setDecayTime(e),
      this.phiDamper.setDecayTime(e),
      this.radiusDamper.setDecayTime(e),
      this.fovDamper.setDecayTime(e));
  }
  adjustOrbit(e, t, i) {
    const { theta: s, phi: n, radius: a } = this.goalSpherical,
      {
        minimumRadius: r,
        maximumRadius: o,
        minimumFieldOfView: A,
        maximumFieldOfView: l,
      } = this._options,
      c = this.spherical.theta - s,
      h = Math.PI - 0.001,
      d = s - ls(e, -h - c, h - c),
      g = n - t,
      u = 0 === i ? 0 : ((i > 0 ? o : r) - a) / (Math.log(i > 0 ? l : A) - this.goalLogFov),
      p = a + i * (isFinite(u) ? u : 2 * (o - r));
    if ((this.setOrbit(d, g, p), 0 !== i)) {
      const e = this.goalLogFov + i;
      this.setFieldOfView(Math.exp(e));
    }
  }
  jumpToGoal() {
    this.update(0, 1e4);
  }
  update(e, t) {
    if (this.isStationary()) return !1;
    const { maximumPolarAngle: i, maximumRadius: s } = this._options,
      n = this.spherical.theta - this.goalSpherical.theta;
    return (
      Math.abs(n) > Math.PI &&
        !isFinite(this._options.minimumAzimuthalAngle) &&
        !isFinite(this._options.maximumAzimuthalAngle) &&
        (this.spherical.theta -= 2 * Math.sign(n) * Math.PI),
      (this.spherical.theta = this.thetaDamper.update(
        this.spherical.theta,
        this.goalSpherical.theta,
        t,
        Math.PI
      )),
      (this.spherical.phi = this.phiDamper.update(
        this.spherical.phi,
        this.goalSpherical.phi,
        t,
        i
      )),
      (this.spherical.radius = this.radiusDamper.update(
        this.spherical.radius,
        this.goalSpherical.radius,
        t,
        s
      )),
      (this.logFov = this.fovDamper.update(this.logFov, this.goalLogFov, t, 1)),
      this.moveCamera(),
      !0
    );
  }
  updateTouchActionStyle() {
    const { style: e } = this.element;
    if (this._interactionEnabled) {
      const { touchAction: t } = this._options;
      this._disableZoom && 'none' !== t ? (e.touchAction = 'manipulation') : (e.touchAction = t);
    } else e.touchAction = '';
  }
  isStationary() {
    return (
      this.goalSpherical.theta === this.spherical.theta &&
      this.goalSpherical.phi === this.spherical.phi &&
      this.goalSpherical.radius === this.spherical.radius &&
      this.goalLogFov === this.logFov
    );
  }
  moveCamera() {
    (this.spherical.makeSafe(),
      this.camera.position.setFromSpherical(this.spherical),
      this.camera.setRotationFromEuler(
        new pt(this.spherical.phi - Math.PI / 2, this.spherical.theta, 0, 'YXZ')
      ),
      this.camera.fov !== Math.exp(this.logFov) &&
        ((this.camera.fov = Math.exp(this.logFov)), this.camera.updateProjectionMatrix()));
  }
  userAdjustOrbit(e, t, i) {
    this.adjustOrbit(
      e * this.orbitSensitivity * this.inputSensitivity,
      t * this.orbitSensitivity * this.inputSensitivity,
      i * this.inputSensitivity
    );
  }
  wrapAngle(e) {
    const t = (e + Math.PI) / (2 * Math.PI);
    return 2 * (t - Math.floor(t)) * Math.PI - Math.PI;
  }
  pixelLengthToSphericalAngle(e) {
    return (2 * Math.PI * e) / this.scene.height;
  }
  twoTouchDistance(e, t) {
    const { clientX: i, clientY: s } = e,
      { clientX: n, clientY: a } = t,
      r = n - i,
      o = a - s;
    return Math.sqrt(r * r + o * o);
  }
  handleSinglePointerMove(e, t) {
    const i = this.pixelLengthToSphericalAngle(e),
      s = this.pixelLengthToSphericalAngle(t);
    (!1 === this.isUserPointing &&
      ((this.isUserPointing = !0), this.dispatchEvent({ type: 'pointer-change-start' })),
      this.userAdjustOrbit(i, s, 0));
  }
  initializePan() {
    const { theta: e, phi: t } = this.spherical,
      i = e - this.scene.yaw;
    ((this.panPerPixel = (0.018 * this.panSensitivity) / this.scene.height),
      this.panProjection.set(
        -Math.cos(i),
        -Math.cos(t) * Math.sin(i),
        0,
        0,
        Math.sin(t),
        0,
        Math.sin(i),
        -Math.cos(t) * Math.cos(i),
        0
      ));
  }
  movePan(e, t) {
    const { scene: i } = this,
      s = rl.set(e, t, 0).multiplyScalar(this.inputSensitivity),
      n = this.spherical.radius * Math.exp(this.logFov) * this.panPerPixel;
    s.multiplyScalar(n);
    const a = i.getTarget();
    (a.add(s.applyMatrix3(this.panProjection)),
      i.boundingSphere.clampPoint(a, a),
      i.setTarget(a.x, a.y, a.z));
  }
  recenter(e) {
    if (
      performance.now() > this.startTime + 300 ||
      Math.abs(e.clientX - this.startPointerPosition.clientX) > 2 ||
      Math.abs(e.clientY - this.startPointerPosition.clientY) > 2
    )
      return;
    const { scene: t } = this,
      i = t.positionAndNormalFromPoint(t.getNDC(e.clientX, e.clientY));
    if (null == i) {
      const { cameraTarget: e } = t.element;
      ((t.element.cameraTarget = ''), (t.element.cameraTarget = e), this.userAdjustOrbit(0, 0, 1));
    } else
      (t.target.worldToLocal(i.position), t.setTarget(i.position.x, i.position.y, i.position.z));
  }
  resetRadius() {
    const { scene: e } = this,
      t = e.positionAndNormalFromPoint(al.set(0, 0));
    if (null == t) return;
    e.target.worldToLocal(t.position);
    const i = e.getTarget(),
      { theta: s, phi: n } = this.spherical,
      a = s - e.yaw,
      r = rl.set(Math.sin(n) * Math.sin(a), Math.cos(n), Math.sin(n) * Math.cos(a)),
      o = r.dot(t.position.sub(i));
    (i.add(r.multiplyScalar(o)),
      e.setTarget(i.x, i.y, i.z),
      this.setOrbit(void 0, void 0, this.goalSpherical.radius - o));
  }
  onTouchChange(e) {
    if (1 === this.pointers.length) this.touchMode = this.touchModeRotate;
    else {
      if (this._disableZoom)
        return (
          (this.touchMode = null),
          void this.element.removeEventListener('touchmove', this.disableScroll)
        );
      ((this.touchMode = this.touchDecided && null === this.touchMode ? null : this.touchModeZoom),
        (this.touchDecided = !0),
        this.element.addEventListener('touchmove', this.disableScroll, { passive: !1 }),
        (this.lastSeparation = this.twoTouchDistance(this.pointers[0], this.pointers[1])),
        this.enablePan &&
          null != this.touchMode &&
          (this.initializePan(), e.altKey || (this.scene.element[TA].style.opacity = 1)));
    }
  }
  onMouseDown(e) {
    ((this.panPerPixel = 0),
      this.enablePan &&
        (2 === e.button || e.ctrlKey || e.metaKey || e.shiftKey) &&
        (this.initializePan(), (this.scene.element[TA].style.opacity = 1)),
      (this.element.style.cursor = 'grabbing'));
  }
  orbitZoomKeyCodeHandler(e) {
    let t = !0;
    switch (e.key) {
      case 'PageUp':
        this.userAdjustOrbit(0, 0, ll * this.zoomSensitivity);
        break;
      case 'PageDown':
        this.userAdjustOrbit(0, 0, -0.04 * this.zoomSensitivity);
        break;
      case 'ArrowUp':
        this.userAdjustOrbit(0, -Al, 0);
        break;
      case 'ArrowDown':
        this.userAdjustOrbit(0, Al, 0);
        break;
      case 'ArrowLeft':
        this.userAdjustOrbit(-Al, 0, 0);
        break;
      case 'ArrowRight':
        this.userAdjustOrbit(Al, 0, 0);
        break;
      default:
        t = !1;
    }
    return t;
  }
  panKeyCodeHandler(e) {
    this.initializePan();
    let t = !0;
    switch (e.key) {
      case 'ArrowUp':
        this.movePan(0, -10);
        break;
      case 'ArrowDown':
        this.movePan(0, 10);
        break;
      case 'ArrowLeft':
        this.movePan(-10, 0);
        break;
      case 'ArrowRight':
        this.movePan(10, 0);
        break;
      default:
        t = !1;
    }
    return t;
  }
}
const dl = 150,
  gl = 'not-presenting',
  ul = 'session-started',
  pl = 'object-placed',
  ml = 'failed',
  bl = 'tracking',
  fl = 'not-tracking',
  Il = new S(),
  Cl = new M(),
  El = new x(),
  Bl = new S(),
  yl = new ne(45, 1, 0.1, 100),
  wl = new d().setFromPoints([new S(0, 0, 0), new S(0, 0, -1)]),
  Ql = new dt();
class vl extends st {
  constructor(e) {
    (super(),
      (this.renderer = e),
      (this.currentSession = null),
      (this.placeOnWall = !1),
      (this.placementBox = null),
      (this.lastTick = null),
      (this.turntableRotation = null),
      (this.oldShadowIntensity = null),
      (this.frame = null),
      (this.initialHitSource = null),
      (this.transientHitTestSource = null),
      (this.inputSource = null),
      (this._presentedScene = null),
      (this.resolveCleanup = null),
      (this.exitWebXRButtonContainer = null),
      (this.overlay = null),
      (this.xrLight = null),
      (this.xrMode = null),
      (this.controller1 = null),
      (this.controller2 = null),
      (this.selectedController = null),
      (this.tracking = !0),
      (this.frames = 0),
      (this.initialized = !1),
      (this.oldTarget = new S()),
      (this.placementComplete = !1),
      (this.isTranslating = !1),
      (this.isRotating = !1),
      (this.isTwoFingering = !1),
      (this.lastDragPosition = new S()),
      (this.relativeOrientation = new M()),
      (this.scaleLine = new ee(wl)),
      (this.firstRatio = 0),
      (this.lastAngle = 0),
      (this.goalPosition = new S()),
      (this.goalYaw = 0),
      (this.goalScale = 1),
      (this.xDamper = new so()),
      (this.yDamper = new so()),
      (this.zDamper = new so()),
      (this.yawDamper = new so()),
      (this.pitchDamper = new so()),
      (this.rollDamper = new so()),
      (this.scaleDamper = new so()),
      (this.onExitWebXRButtonContainerClick = () => this.stopPresenting()),
      (this.onControllerSelectStart = e => {
        const t = this.presentedScene,
          i = e.target;
        if (null != this.placementBox.controllerIntersection(t, i))
          (null != this.selectedController &&
            ((this.selectedController.userData.line.visible = !1),
            t.canScale &&
              ((this.isTwoFingering = !0),
              (this.firstRatio = this.controllerSeparation() / t.pivot.scale.x),
              (this.scaleLine.visible = !0))),
            i.attach(t.pivot),
            (this.selectedController = i),
            t.setShadowIntensity(0.01));
        else {
          const e = i === this.controller1 ? this.controller2 : this.controller1;
          (this.relativeOrientation
            .copy(i.quaternion)
            .invert()
            .multiply(t.pivot.getWorldQuaternion(Cl)),
            (e.userData.turning = !1),
            (i.userData.turning = !0),
            (i.userData.line.visible = !1));
        }
      }),
      (this.onControllerSelectEnd = e => {
        const t = e.target;
        if (
          ((t.userData.turning = !1),
          (t.userData.line.visible = !0),
          (this.isTwoFingering = !1),
          (this.scaleLine.visible = !1),
          null != this.selectedController && this.selectedController != t)
        )
          return;
        const i = this.presentedScene;
        (i.attach(i.pivot),
          (this.selectedController = null),
          (this.goalYaw = Math.atan2(i.pivot.matrix.elements[8], i.pivot.matrix.elements[10])),
          (this.goalPosition.x = i.pivot.position.x),
          (this.goalPosition.z = i.pivot.position.z));
      }),
      (this.onUpdateScene = () => {
        null != this.placementBox &&
          this.isPresenting &&
          (this.placementBox.dispose(),
          (this.placementBox = new Ao(this.presentedScene, this.placeOnWall ? 'back' : 'bottom')));
      }),
      (this.onSelectStart = e => {
        const t = this.transientHitTestSource;
        if (null == t) return;
        const i = this.frame.getHitTestResultsForTransientInput(t),
          s = this.presentedScene,
          n = this.placementBox;
        if (1 === i.length) {
          this.inputSource = e.inputSource;
          const { axes: t } = this.inputSource.gamepad,
            i = n.getHit(this.presentedScene, t[0], t[1]);
          ((n.show = !0),
            null != i
              ? ((this.isTranslating = !0), this.lastDragPosition.copy(i))
              : !1 === this.placeOnWall && ((this.isRotating = !0), (this.lastAngle = 1.5 * t[0])));
        } else if (2 === i.length) {
          ((n.show = !0), (this.isTwoFingering = !0));
          const { separation: e } = this.fingerPolar(i);
          this.firstRatio = e / s.pivot.scale.x;
        }
      }),
      (this.onSelectEnd = () => {
        ((this.isTranslating = !1),
          (this.isRotating = !1),
          (this.isTwoFingering = !1),
          (this.inputSource = null),
          (this.goalPosition.y += this.placementBox.offsetHeight * this.presentedScene.scale.x),
          (this.placementBox.show = !1));
      }),
      (this.threeRenderer = e.threeRenderer),
      (this.threeRenderer.xr.enabled = !0));
  }
  async resolveARSession() {
    rs();
    const e = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: [],
      optionalFeatures: ['hit-test', 'dom-overlay', 'light-estimation'],
      domOverlay: this.overlay ? { root: this.overlay } : void 0,
    });
    return (
      this.threeRenderer.xr.setReferenceSpaceType('local'),
      await this.threeRenderer.xr.setSession(e),
      (this.threeRenderer.xr.cameraAutoUpdate = !1),
      e
    );
  }
  get presentedScene() {
    return this._presentedScene;
  }
  async supportsPresentation() {
    try {
      return (rs(), await navigator.xr.isSessionSupported('immersive-ar'));
    } catch (e) {
      return (
        console.warn('Request to present in WebXR denied:'),
        console.warn(e),
        console.warn('Falling back to next ar-mode'),
        !1
      );
    }
  }
  async present(e, t = !1) {
    this.isPresenting && console.warn('Cannot present while a model is already presenting');
    let i = new Promise((e, t) => {
      requestAnimationFrame(() => e());
    });
    (e.setHotspotsVisibility(!1),
      e.queueRender(),
      await i,
      (this._presentedScene = e),
      (this.overlay = e.element.shadowRoot.querySelector('div.default')),
      !0 === t &&
        ((this.xrLight = new io(this.threeRenderer)),
        this.xrLight.addEventListener('estimationstart', () => {
          if (!this.isPresenting || null == this.xrLight) return;
          const e = this.presentedScene;
          (e.add(this.xrLight), (e.environment = this.xrLight.environment));
        })));
    const s = await this.resolveARSession();
    s.addEventListener(
      'end',
      () => {
        this.postSessionCleanup();
      },
      { once: !0 }
    );
    const n = e.element.shadowRoot.querySelector('.slot.exit-webxr-ar-button');
    (n.classList.add('enabled'),
      n.addEventListener('click', this.onExitWebXRButtonContainerClick),
      (this.exitWebXRButtonContainer = n));
    const a = await s.requestReferenceSpace('viewer');
    ((this.xrMode = s.interactionMode),
      (this.tracking = !0),
      (this.frames = 0),
      (this.initialized = !1),
      (this.turntableRotation = e.yaw),
      (this.goalYaw = e.yaw),
      (this.goalScale = 1),
      e.setBackground(null),
      (this.oldShadowIntensity = e.shadowIntensity),
      e.setShadowIntensity(0.01),
      this.oldTarget.copy(e.getTarget()),
      e.element.addEventListener('load', this.onUpdateScene));
    const r = (20 * Math.PI) / 180,
      o =
        !0 === this.placeOnWall
          ? void 0
          : new XRRay(new DOMPoint(0, 0, 0), { x: 0, y: -Math.sin(r), z: -Math.cos(r) });
    (s.requestHitTestSource({ space: a, offsetRay: o }).then(e => {
      this.initialHitSource = e;
    }),
      'screen-space' !== this.xrMode &&
        (this.setupControllers(),
        this.xDamper.setDecayTime(dl),
        this.yDamper.setDecayTime(dl),
        this.zDamper.setDecayTime(dl),
        this.yawDamper.setDecayTime(dl),
        this.pitchDamper.setDecayTime(dl),
        this.rollDamper.setDecayTime(dl)),
      (this.currentSession = s),
      (this.placementBox = new Ao(e, this.placeOnWall ? 'back' : 'bottom')),
      (this.placementComplete = !1),
      (this.lastTick = performance.now()),
      this.dispatchEvent({ type: 'status', status: ul }));
  }
  setupControllers() {
    ((this.controller1 = this.threeRenderer.xr.getController(0)),
      this.controller1.addEventListener('selectstart', this.onControllerSelectStart),
      this.controller1.addEventListener('selectend', this.onControllerSelectEnd),
      (this.controller2 = this.threeRenderer.xr.getController(1)),
      this.controller2.addEventListener('selectstart', this.onControllerSelectStart),
      this.controller2.addEventListener('selectend', this.onControllerSelectEnd));
    const e = this.presentedScene;
    if ((e.add(this.controller1), e.add(this.controller2), !this.controller1.userData.line)) {
      const t = new ee(wl);
      ((t.name = 'line'),
        (t.scale.z = 5),
        (this.controller1.userData.turning = !1),
        (this.controller1.userData.line = t),
        this.controller1.add(t),
        (this.controller2.userData.turning = !1));
      const i = t.clone();
      ((this.controller2.userData.line = i),
        this.controller2.add(i),
        (this.scaleLine.name = 'scale line'),
        (this.scaleLine.visible = !1),
        this.controller1.add(this.scaleLine));
      const { size: s } = e,
        n = 0.1 / Math.max(s.x, s.y, s.z),
        a = new X(Ql);
      ((a.name = 'box'),
        a.scale.copy(s).multiplyScalar(n),
        (a.visible = !1),
        (this.controller1.userData.box = a),
        e.add(a));
      const r = a.clone();
      ((this.controller2.userData.box = r), e.add(r));
    }
  }
  hover(e) {
    if ('screen-space' === this.xrMode || this.selectedController == e) return !1;
    const t = this.presentedScene,
      i = this.placementBox.controllerIntersection(t, e);
    return (
      (e.userData.box.visible = (null == i || e.userData.turning) && !this.isTwoFingering),
      (e.userData.line.scale.z = null == i ? 5 : i.distance),
      null != i
    );
  }
  controllerSeparation() {
    return this.controller1.position.distanceTo(this.controller2.position);
  }
  async stopPresenting() {
    if (!this.isPresenting) return;
    const e = new Promise(e => {
      this.resolveCleanup = e;
    });
    try {
      (await this.currentSession.end(), await e);
    } catch (t) {
      (console.warn('Error while trying to end WebXR AR session'),
        console.warn(t),
        this.postSessionCleanup());
    }
  }
  get isPresenting() {
    return null != this.presentedScene;
  }
  get target() {
    return this.oldTarget;
  }
  updateTarget() {
    const e = this.presentedScene;
    if (null != e) {
      const t = e.getTarget();
      (this.oldTarget.copy(t),
        this.placeOnWall ? (t.z = e.boundingBox.min.z) : (t.y = e.boundingBox.min.y),
        e.setTarget(t.x, t.y, t.z));
    }
  }
  postSessionCleanup() {
    const e = this.currentSession;
    null != e &&
      (e.removeEventListener('selectstart', this.onSelectStart),
      e.removeEventListener('selectend', this.onSelectEnd),
      (this.currentSession = null));
    const t = this.presentedScene;
    if (((this._presentedScene = null), null != t)) {
      const { element: e } = t;
      (null != this.xrLight &&
        (t.remove(this.xrLight), this.xrLight.dispose(), (this.xrLight = null)),
        t.add(t.pivot),
        t.pivot.quaternion.set(0, 0, 0, 1),
        t.pivot.position.set(0, 0, 0),
        t.pivot.scale.set(1, 1, 1),
        t.setShadowOffset(0));
      const i = this.turntableRotation;
      null != i && (t.yaw = i);
      const s = this.oldShadowIntensity;
      (null != s && t.setShadowIntensity(s), t.setEnvironmentAndSkybox(e[ds], e[gs]));
      const n = this.oldTarget;
      (t.setTarget(n.x, n.y, n.z),
        (t.xrCamera = null),
        t.element.removeEventListener('load', this.onUpdateScene),
        t.orientHotspots(0));
      const { width: a, height: r } = e.getBoundingClientRect();
      (t.setSize(a, r),
        requestAnimationFrame(() => {
          t.element.dispatchEvent(
            new CustomEvent('camera-change', { detail: { source: cl.NONE } })
          );
        }));
    }
    this.renderer.height = 0;
    const i = this.exitWebXRButtonContainer;
    null != i &&
      (i.classList.remove('enabled'),
      i.removeEventListener('click', this.onExitWebXRButtonContainerClick),
      (this.exitWebXRButtonContainer = null));
    const s = this.transientHitTestSource;
    null != s && (s.cancel(), (this.transientHitTestSource = null));
    const n = this.initialHitSource;
    (null != n && (n.cancel(), (this.initialHitSource = null)),
      null != this.placementBox && (this.placementBox.dispose(), (this.placementBox = null)),
      'screen-space' !== this.xrMode &&
        (null != this.controller1 &&
          ((this.controller1.userData.turning = !1),
          (this.controller1.userData.box.visible = !1),
          (this.controller1.userData.line.visible = !0),
          this.controller1.removeEventListener('selectstart', this.onControllerSelectStart),
          this.controller1.removeEventListener('selectend', this.onControllerSelectEnd),
          this.controller1.removeFromParent(),
          (this.controller1 = null)),
        null != this.controller2 &&
          ((this.controller2.userData.turning = !1),
          (this.controller2.userData.box.visible = !1),
          (this.controller2.userData.line.visible = !0),
          this.controller2.removeEventListener('selectstart', this.onControllerSelectStart),
          this.controller2.removeEventListener('selectend', this.onControllerSelectEnd),
          this.controller2.removeFromParent(),
          (this.controller2 = null)),
        (this.selectedController = null),
        (this.scaleLine.visible = !1)),
      (this.isTranslating = !1),
      (this.isRotating = !1),
      (this.isTwoFingering = !1),
      (this.lastTick = null),
      (this.turntableRotation = null),
      (this.oldShadowIntensity = null),
      (this.frame = null),
      (this.inputSource = null),
      (this.overlay = null),
      null != this.resolveCleanup && this.resolveCleanup(),
      this.dispatchEvent({ type: 'status', status: gl }));
  }
  updateView(e) {
    const t = this.presentedScene,
      i = this.threeRenderer.xr;
    (i.updateCamera(yl), (t.xrCamera = i.getCamera()));
    const { elements: s } = t.getCamera().matrixWorld;
    if (
      (t.orientHotspots(Math.atan2(s[1], s[5])),
      this.initialized || (this.placeInitially(), (this.initialized = !0)),
      e.requestViewportScale && e.recommendedViewportScale)
    ) {
      const t = e.recommendedViewportScale;
      e.requestViewportScale(Math.max(t, 0.25));
    }
    const n = i.getBaseLayer();
    if (null != n) {
      const t =
        n instanceof XRWebGLLayer
          ? n.getViewport(e)
          : i.getBinding().getViewSubImage(n, e).viewport;
      this.threeRenderer.setViewport(t.x, t.y, t.width, t.height);
    }
  }
  placeInitially() {
    const e = this.presentedScene,
      { pivot: t, element: i } = e,
      { position: s } = t,
      n = e.getCamera(),
      { width: a, height: r } = this.overlay.getBoundingClientRect();
    (e.setSize(a, r), n.projectionMatrixInverse.copy(n.projectionMatrix).invert());
    const { theta: o } = i.getCameraOrbit(),
      A = n.getWorldDirection(Il);
    ((e.yaw = Math.atan2(-A.x, -A.z) - o), (this.goalYaw = e.yaw));
    const l = Math.max(1, 2 * e.boundingSphere.radius);
    (s.copy(n.position).add(A.multiplyScalar(l)), this.updateTarget());
    const c = e.getTarget();
    if (
      (s.add(c).sub(this.oldTarget),
      this.goalPosition.copy(s),
      e.setHotspotsVisibility(!0),
      'screen-space' === this.xrMode)
    ) {
      const { session: e } = this.frame;
      (e.addEventListener('selectstart', this.onSelectStart),
        e.addEventListener('selectend', this.onSelectEnd),
        e.requestHitTestSourceForTransientInput({ profile: 'generic-touchscreen' }).then(e => {
          this.transientHitTestSource = e;
        }));
    }
  }
  getTouchLocation() {
    const { axes: e } = this.inputSource.gamepad;
    let t = this.placementBox.getExpandedHit(this.presentedScene, e[0], e[1]);
    return null != t && (Il.copy(t).sub(this.presentedScene.getCamera().position), Il.length() > 10)
      ? null
      : t;
  }
  getHitPoint(e) {
    const t = this.threeRenderer.xr.getReferenceSpace(),
      i = e.getPose(t);
    if (null == i) return null;
    const s = El.fromArray(i.transform.matrix);
    return (
      !0 === this.placeOnWall && (this.goalYaw = Math.atan2(s.elements[4], s.elements[6])),
      s.elements[5] > 0.75 !== this.placeOnWall ? Bl.setFromMatrixPosition(s) : null
    );
  }
  moveToFloor(e) {
    const t = this.initialHitSource;
    if (null == t) return;
    const i = e.getHitTestResults(t);
    if (0 == i.length) return;
    const s = i[0],
      n = this.getHitPoint(s);
    null != n &&
      ((this.placementBox.show = !0),
      this.isTranslating ||
        (this.placeOnWall ? this.goalPosition.copy(n) : (this.goalPosition.y = n.y)),
      t.cancel(),
      (this.initialHitSource = null),
      this.dispatchEvent({ type: 'status', status: pl }));
  }
  fingerPolar(e) {
    const t = e[0].inputSource.gamepad.axes,
      i = e[1].inputSource.gamepad.axes,
      s = i[0] - t[0],
      n = i[1] - t[1],
      a = Math.atan2(n, s);
    let r = this.lastAngle - a;
    return (
      r > Math.PI ? (r -= 2 * Math.PI) : r < -Math.PI && (r += 2 * Math.PI),
      (this.lastAngle = a),
      { separation: Math.sqrt(s * s + n * n), deltaYaw: r }
    );
  }
  setScale(e) {
    const t = e / this.firstRatio;
    this.goalScale = Math.abs(t - 1) < 0.2 ? 1 : t;
  }
  processInput(e) {
    const t = this.transientHitTestSource;
    if (null == t) return;
    if (!this.isTranslating && !this.isTwoFingering && !this.isRotating) return;
    const i = e.getHitTestResultsForTransientInput(t),
      s = this.presentedScene,
      n = s.pivot.scale.x;
    if (this.isTwoFingering)
      if (i.length < 2) this.isTwoFingering = !1;
      else {
        const { separation: e, deltaYaw: t } = this.fingerPolar(i);
        (!1 === this.placeOnWall && (this.goalYaw += t), s.canScale && this.setScale(e));
      }
    else {
      if (2 === i.length) {
        ((this.isTranslating = !1), (this.isRotating = !1), (this.isTwoFingering = !0));
        const { separation: e } = this.fingerPolar(i);
        return void (this.firstRatio = e / n);
      }
      if (this.isRotating) {
        const e = 1.5 * this.inputSource.gamepad.axes[0];
        ((this.goalYaw += e - this.lastAngle), (this.lastAngle = e));
      } else
        this.isTranslating &&
          i.forEach(e => {
            if (e.inputSource !== this.inputSource) return;
            let t = null;
            if (
              (e.results.length > 0 && (t = this.getHitPoint(e.results[0])),
              null == t && (t = this.getTouchLocation()),
              null != t)
            ) {
              if ((this.goalPosition.sub(this.lastDragPosition), !1 === this.placeOnWall)) {
                const e = t.y - this.lastDragPosition.y;
                if (e < 0) {
                  ((this.placementBox.offsetHeight = e / n),
                    this.presentedScene.setShadowOffset(e));
                  const i = Il.copy(s.getCamera().position),
                    a = -e / (i.y - t.y);
                  (i.multiplyScalar(a), t.multiplyScalar(1 - a).add(i));
                }
              }
              (this.goalPosition.add(t), this.lastDragPosition.copy(t));
            }
          });
    }
  }
  moveScene(e) {
    const t = this.presentedScene,
      { pivot: i } = t,
      s = this.placementBox;
    if (
      (s.updateOpacity(e),
      this.controller1 &&
        (this.controller1.userData.turning &&
          (i.quaternion.copy(this.controller1.quaternion).multiply(this.relativeOrientation),
          this.selectedController &&
            this.selectedController === this.controller2 &&
            i.quaternion.premultiply(Cl.copy(this.controller2.quaternion).invert())),
        this.controller1.userData.box.position.copy(this.controller1.position),
        i.getWorldQuaternion(this.controller1.userData.box.quaternion)),
      this.controller2 &&
        (this.controller2.userData.turning &&
          (i.quaternion.copy(this.controller2.quaternion).multiply(this.relativeOrientation),
          this.selectedController &&
            this.selectedController === this.controller1 &&
            i.quaternion.premultiply(Cl.copy(this.controller1.quaternion).invert())),
        this.controller2.userData.box.position.copy(this.controller2.position),
        i.getWorldQuaternion(this.controller2.userData.box.quaternion)),
      this.controller1 && this.controller2 && this.isTwoFingering)
    ) {
      const e = this.controllerSeparation();
      (this.setScale(e),
        (this.scaleLine.scale.z = -e),
        this.scaleLine.lookAt(this.controller2.position));
    }
    const n = t.pivot.scale.x;
    if (this.goalScale !== n) {
      const i = this.scaleDamper.update(n, this.goalScale, e, 1);
      t.pivot.scale.set(i, i, i);
    }
    if (i.parent !== t) return;
    const { position: a } = i,
      r = t.boundingSphere.radius,
      o = this.goalPosition;
    let A = cl.NONE;
    if (!o.equals(a)) {
      A = cl.USER_INTERACTION;
      let { x: i, y: n, z: l } = a;
      if (
        ((i = this.xDamper.update(i, o.x, e, r)),
        (n = this.yDamper.update(n, o.y, e, r)),
        (l = this.zDamper.update(l, o.z, e, r)),
        a.set(i, n, l),
        'screen-space' === this.xrMode && !this.isTranslating)
      ) {
        const e = o.y - n;
        this.placementComplete && !1 === this.placeOnWall
          ? ((s.offsetHeight = e / t.pivot.scale.x), t.setShadowOffset(e))
          : 0 === e && ((this.placementComplete = !0), (s.show = !1), t.setShadowIntensity(0.8));
      }
      'screen-space' !== this.xrMode && o.equals(a) && t.setShadowIntensity(0.8);
    }
    (t.updateTarget(e), Cl.setFromAxisAngle(Il.set(0, 1, 0), this.goalYaw));
    const l = t.pivot.quaternion.angleTo(Cl),
      c = l - this.yawDamper.update(l, 0, e, Math.PI);
    (t.pivot.quaternion.rotateTowards(Cl, c),
      t.element.dispatchEvent(new CustomEvent('camera-change', { detail: { source: A } })));
  }
  onWebXRFrame(e, t) {
    if ('screen-space' !== this.xrMode) {
      const e = this.hover(this.controller1),
        t = this.hover(this.controller2);
      this.placementBox.show = (e || t) && !this.isTwoFingering;
    }
    ((this.frame = t), ++this.frames);
    const i = this.threeRenderer.xr.getReferenceSpace(),
      s = t.getViewerPose(i);
    null == s &&
      !0 === this.tracking &&
      this.frames > 30 &&
      ((this.tracking = !1), this.dispatchEvent({ type: 'tracking', status: fl }));
    const n = this.presentedScene;
    if (null == s || null == n || !n.element.loaded) return void this.threeRenderer.clear();
    !1 === this.tracking &&
      ((this.tracking = !0), this.dispatchEvent({ type: 'tracking', status: bl }));
    let a = !0;
    for (const r of s.views) {
      if ((this.updateView(r), a)) {
        (this.moveToFloor(t), this.processInput(t));
        const i = e - this.lastTick;
        (this.moveScene(i),
          this.renderer.preRender(n, e, i),
          (this.lastTick = e),
          n.renderShadow(this.threeRenderer));
      }
      (this.threeRenderer.render(n, n.getCamera()), (a = !1));
    }
  }
}
function xl(e) {
  const t = new Map(),
    i = new Map(),
    s = e.clone();
  return (
    Sl(e, s, function (e, s) {
      (t.set(s, e), i.set(e, s));
    }),
    s.traverse(function (e) {
      if (!e.isSkinnedMesh) return;
      const s = e,
        n = t.get(e),
        a = n.skeleton.bones;
      ((s.skeleton = n.skeleton.clone()),
        s.bindMatrix.copy(n.bindMatrix),
        (s.skeleton.bones = a.map(function (e) {
          return i.get(e);
        })),
        s.bind(s.skeleton, s.bindMatrix));
    }),
    s
  );
}
function Sl(e, t, i) {
  i(e, t);
  for (let s = 0; s < e.children.length; s++) Sl(e.children[s], t.children[s], i);
}
const Rl = Symbol('prepared'),
  Ml = Symbol('prepare'),
  Tl = Symbol('preparedGLTF'),
  Dl = Symbol('clone');
class kl {
  static prepare(e) {
    if (null == e.scene) throw new Error('Model does not have a scene');
    if (e[Rl]) return e;
    const t = this[Ml](e);
    return ((t[Rl] = !0), t);
  }
  static [Ml](e) {
    const { scene: t } = e,
      i = [t];
    return Object.assign(Object.assign({}, e), { scene: t, scenes: i });
  }
  get parser() {
    return this[Tl].parser;
  }
  get animations() {
    return this[Tl].animations;
  }
  get scene() {
    return this[Tl].scene;
  }
  get scenes() {
    return this[Tl].scenes;
  }
  get cameras() {
    return this[Tl].cameras;
  }
  get asset() {
    return this[Tl].asset;
  }
  get userData() {
    return this[Tl].userData;
  }
  constructor(e) {
    this[Tl] = e;
  }
  clone() {
    return new (0, this.constructor)(this[Dl]());
  }
  dispose() {
    this.scenes.forEach(e => {
      e.traverse(e => {
        const t = e;
        if (!t.material) return;
        ((Array.isArray(t.material) ? t.material : [t.material]).forEach(e => {
          for (const t in e) {
            const i = e[t];
            if (i instanceof de) {
              const e = i.source.data;
              (null != e.close && e.close(), i.dispose());
            }
          }
          e.dispose();
        }),
          t.geometry.dispose());
      });
    });
  }
  [Dl]() {
    const e = this[Tl],
      t = xl(this.scene);
    Fl(t, this.scene);
    const i = [t],
      s = e.userData ? Object.assign({}, e.userData) : {};
    return Object.assign(Object.assign({}, e), { scene: t, scenes: i, userData: s });
  }
}
const Fl = (e, t) => {
    Ll(e, t, (e, t) => {
      (void 0 !== t.userData.variantMaterials &&
        (e.userData.variantMaterials = new Map(t.userData.variantMaterials)),
        void 0 !== t.userData.variantData && (e.userData.variantData = t.userData.variantData),
        void 0 !== t.userData.originalMaterial &&
          (e.userData.originalMaterial = t.userData.originalMaterial));
    });
  },
  Ll = (e, t, i) => {
    i(e, t);
    for (let s = 0; s < e.children.length; s++) Ll(e.children[s], t.children[s], i);
  },
  Ul = Symbol('threeGLTF'),
  Gl = Symbol('gltf'),
  _l = Symbol('gltfElementMap'),
  Pl = Symbol('threeObjectMap'),
  Nl = Symbol('parallelTraverseThreeScene'),
  Ol = Symbol('correlateOriginalThreeGLTF'),
  Hl = Symbol('correlateCloneThreeGLTF');
class ql {
  static from(e, t) {
    return null != t ? this[Hl](e, t) : this[Ol](e);
  }
  static [Ol](e) {
    const t = e.parser.json,
      i = e.parser.associations,
      s = new Map(),
      n = { name: 'Default' },
      a = { index: -1 };
    for (const r of i.keys())
      r instanceof z &&
        null == i.get(r) &&
        (a.index < 0 &&
          (null == t.materials && (t.materials = []),
          (a.index = t.materials.length),
          t.materials.push(n)),
        (r.name = n.name),
        i.set(r, { materials: a.index }));
    for (const [r, o] of i) {
      o && ((r.userData = r.userData || {}), (r.userData.associations = o));
      for (const e in o)
        if (null != e && 'primitives' !== e) {
          const i = e,
            n = (t[i] || [])[o[i]];
          if (null == n) continue;
          let a = s.get(n);
          (null == a && ((a = new Set()), s.set(n, a)), a.add(r));
        }
    }
    return new ql(e, t, i, s);
  }
  static [Hl](e, t) {
    const i = t.threeGLTF,
      s = t.gltf,
      n = JSON.parse(JSON.stringify(s)),
      a = new Map(),
      r = new Map();
    for (let o = 0; o < i.scenes.length; o++)
      this[Nl](i.scenes[o], e.scenes[o], (e, i) => {
        const s = t.threeObjectMap.get(e);
        if (null != s)
          for (const t in s)
            if (null != t && 'primitives' !== t) {
              const e = t,
                o = s[e],
                A = n[e][o],
                l = a.get(i) || {};
              ((l[e] = o), a.set(i, l));
              const c = r.get(A) || new Set();
              (c.add(i), r.set(A, c));
            }
      });
    return new ql(e, n, a, r);
  }
  static [Nl](e, t, i) {
    const s = (e, t) => {
      if ((i(e, t), e.isObject3D)) {
        const n = e,
          a = t;
        if (n.material)
          if (Array.isArray(n.material))
            for (let e = 0; e < n.material.length; ++e) i(n.material[e], a.material[e]);
          else i(n.material, a.material);
        for (let i = 0; i < e.children.length; ++i) s(e.children[i], t.children[i]);
      }
    };
    s(e, t);
  }
  get threeGLTF() {
    return this[Ul];
  }
  get gltf() {
    return this[Gl];
  }
  get gltfElementMap() {
    return this[_l];
  }
  get threeObjectMap() {
    return this[Pl];
  }
  constructor(e, t, i, s) {
    ((this[Ul] = e), (this[Gl] = t), (this[_l] = s), (this[Pl] = i));
  }
}
const jl = Symbol('correlatedSceneGraph');
class zl extends kl {
  static [Ml](e) {
    const t = super[Ml](e);
    null == t[jl] && (t[jl] = ql.from(t));
    const { scene: i } = t,
      s = new Ie(void 0, 1 / 0);
    return (
      i.traverse(e => {
        ((e.renderOrder = 1e3), (e.frustumCulled = !1), e.name || (e.name = e.uuid));
        const i = e;
        if (i.material) {
          const { geometry: e } = i;
          ((i.castShadow = !0),
            i.isSkinnedMesh && ((e.boundingSphere = s), (e.boundingBox = null)));
          const n = i.material;
          if ((!0 === n.isMeshBasicMaterial && (n.toneMapped = !1), (n.shadowSide = me), n.aoMap)) {
            const { gltf: i, threeObjectMap: s } = t[jl],
              a = s.get(n);
            if (null != i.materials && null != a && null != a.materials) {
              const t = i.materials[a.materials];
              t.occlusionTexture &&
                0 === t.occlusionTexture.texCoord &&
                null != e.attributes.uv &&
                e.setAttribute('uv2', e.attributes.uv);
            }
          }
        }
      }),
      t
    );
  }
  get correlatedSceneGraph() {
    return this[Tl][jl];
  }
  [Dl]() {
    const e = super[Dl](),
      t = new Map();
    return (
      e.scene.traverse(e => {
        const i = e;
        if (i.material) {
          const e = i.material;
          if (null != e) {
            if (t.has(e.uuid)) return void (i.material = t.get(e.uuid));
            ((i.material = e.clone()), t.set(e.uuid, i.material));
          }
        }
        const s = e;
        void 0 !== s.target && s.add(s.target);
      }),
      (e[jl] = ql.from(e, this.correlatedSceneGraph)),
      e
    );
  }
}
class Kl extends mt {
  constructor(e) {
    (super(e), (this.type = Ve));
  }
  parse(e) {
    const t = function (e, t) {
        switch (e) {
          case 1:
            throw new Error('THREE.HDRLoader: Read Error: ' + (t || ''));
          case 2:
            throw new Error('THREE.HDRLoader: Write Error: ' + (t || ''));
          case 3:
            throw new Error('THREE.HDRLoader: Bad File Format: ' + (t || ''));
          default:
            throw new Error('THREE.HDRLoader: Memory Error: ' + (t || ''));
        }
      },
      i = function (e, t, i) {
        t = t || 1024;
        let s = e.pos,
          n = -1,
          a = 0,
          r = '',
          o = String.fromCharCode.apply(null, new Uint16Array(e.subarray(s, s + 128)));
        for (; 0 > (n = o.indexOf('\n')) && a < t && s < e.byteLength; )
          ((r += o),
            (a += o.length),
            (s += 128),
            (o += String.fromCharCode.apply(null, new Uint16Array(e.subarray(s, s + 128)))));
        return -1 < n && ((e.pos += a + n + 1), r + o.slice(0, n));
      },
      s = function (e, t, i, s) {
        const n = e[t + 3],
          a = Math.pow(2, n - 128) / 255;
        ((i[s + 0] = e[t + 0] * a),
          (i[s + 1] = e[t + 1] * a),
          (i[s + 2] = e[t + 2] * a),
          (i[s + 3] = 1));
      },
      n = function (e, t, i, s) {
        const n = e[t + 3],
          a = Math.pow(2, n - 128) / 255;
        ((i[s + 0] = bt.toHalfFloat(Math.min(e[t + 0] * a, 65504))),
          (i[s + 1] = bt.toHalfFloat(Math.min(e[t + 1] * a, 65504))),
          (i[s + 2] = bt.toHalfFloat(Math.min(e[t + 2] * a, 65504))),
          (i[s + 3] = bt.toHalfFloat(1)));
      },
      a = new Uint8Array(e);
    a.pos = 0;
    const r = (function (e) {
        const s = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
          n = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
          a = /^\s*FORMAT=(\S+)\s*$/,
          r = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,
          o = {
            valid: 0,
            string: '',
            comments: '',
            programtype: 'RGBE',
            format: '',
            gamma: 1,
            exposure: 1,
            width: 0,
            height: 0,
          };
        let A, l;
        for (
          (e.pos >= e.byteLength || !(A = i(e))) && t(1, 'no header found'),
            (l = A.match(/^#\?(\S+)/)) || t(3, 'bad initial token'),
            o.valid |= 1,
            o.programtype = l[1],
            o.string += A + '\n';
          (A = i(e)), !1 !== A;
        )
          if (((o.string += A + '\n'), '#' !== A.charAt(0))) {
            if (
              ((l = A.match(s)) && (o.gamma = parseFloat(l[1])),
              (l = A.match(n)) && (o.exposure = parseFloat(l[1])),
              (l = A.match(a)) && ((o.valid |= 2), (o.format = l[1])),
              (l = A.match(r)) &&
                ((o.valid |= 4), (o.height = parseInt(l[1], 10)), (o.width = parseInt(l[2], 10))),
              2 & o.valid && 4 & o.valid)
            )
              break;
          } else o.comments += A + '\n';
        return (
          2 & o.valid || t(3, 'missing format specifier'),
          4 & o.valid || t(3, 'missing image size specifier'),
          o
        );
      })(a),
      o = r.width,
      A = r.height,
      l = (function (e, i, s) {
        const n = i;
        if (n < 8 || n > 32767 || 2 !== e[0] || 2 !== e[1] || 128 & e[2]) return new Uint8Array(e);
        n !== ((e[2] << 8) | e[3]) && t(3, 'wrong scanline width');
        const a = new Uint8Array(4 * i * s);
        a.length || t(4, 'unable to allocate buffer space');
        let r = 0,
          o = 0;
        const A = 4 * n,
          l = new Uint8Array(4),
          c = new Uint8Array(A);
        let h = s;
        for (; h > 0 && o < e.byteLength; ) {
          (o + 4 > e.byteLength && t(1),
            (l[0] = e[o++]),
            (l[1] = e[o++]),
            (l[2] = e[o++]),
            (l[3] = e[o++]),
            (2 == l[0] && 2 == l[1] && ((l[2] << 8) | l[3]) == n) ||
              t(3, 'bad rgbe scanline format'));
          let i,
            s = 0;
          for (; s < A && o < e.byteLength; ) {
            i = e[o++];
            const n = i > 128;
            if ((n && (i -= 128), (0 === i || s + i > A) && t(3, 'bad scanline data'), n)) {
              const t = e[o++];
              for (let e = 0; e < i; e++) c[s++] = t;
            } else (c.set(e.subarray(o, o + i), s), (s += i), (o += i));
          }
          const d = n;
          for (let e = 0; e < d; e++) {
            let t = 0;
            ((a[r] = c[e + t]),
              (t += n),
              (a[r + 1] = c[e + t]),
              (t += n),
              (a[r + 2] = c[e + t]),
              (t += n),
              (a[r + 3] = c[e + t]),
              (r += 4));
          }
          h--;
        }
        return a;
      })(a.subarray(a.pos), o, A);
    let c, h, d;
    switch (this.type) {
      case We:
        d = l.length / 4;
        const e = new Float32Array(4 * d);
        for (let i = 0; i < d; i++) s(l, 4 * i, e, 4 * i);
        ((c = e), (h = We));
        break;
      case Ve:
        d = l.length / 4;
        const t = new Uint16Array(4 * d);
        for (let i = 0; i < d; i++) n(l, 4 * i, t, 4 * i);
        ((c = t), (h = Ve));
        break;
      default:
        throw new Error('THREE.HDRLoader: Unsupported type: ' + this.type);
    }
    return {
      width: o,
      height: A,
      data: c,
      header: r.string,
      gamma: r.gamma,
      exposure: r.exposure,
      type: h,
    };
  }
  setDataType(e) {
    return ((this.type = e), this);
  }
  load(e, t, i, s) {
    return super.load(
      e,
      function (e, i) {
        switch (e.type) {
          case We:
          case Ve:
            ((e.colorSpace = h),
              (e.minFilter = P),
              (e.magFilter = P),
              (e.generateMipmaps = !1),
              (e.flipY = !0));
        }
        t && t(e, i);
      },
      i,
      s
    );
  }
}
class Vl extends Kl {
  constructor(e) {
    (console.warn('RGBELoader has been deprecated. Please use HDRLoader instead.'), super(e));
  }
}
const Jl = {
    topLight: { intensity: 500, position: [0.418, 16.199, 0.3] },
    room: { position: [-0.757, 13.219, 0.717], scale: [31.713, 28.305, 28.591] },
    boxes: [
      { position: [-10.906, 2.009, 1.846], rotation: -0.195, scale: [2.328, 7.905, 4.651] },
      { position: [-5.607, -0.754, -0.758], rotation: 0.994, scale: [1.97, 1.534, 3.955] },
      { position: [6.167, 0.857, 7.803], rotation: 0.561, scale: [3.927, 6.285, 3.687] },
      { position: [-2.017, 0.018, 6.124], rotation: 0.333, scale: [2.002, 4.566, 2.064] },
      { position: [2.291, -0.756, -2.621], rotation: -0.286, scale: [1.546, 1.552, 1.496] },
      { position: [-2.193, -0.369, -5.547], rotation: 0.516, scale: [3.875, 3.487, 2.986] },
    ],
    lights: [
      { intensity: 50, position: [-16.116, 14.37, 8.208], scale: [0.1, 2.428, 2.739] },
      { intensity: 50, position: [-16.109, 18.021, -8.207], scale: [0.1, 2.425, 2.751] },
      { intensity: 17, position: [14.904, 12.198, -1.832], scale: [0.15, 4.265, 6.331] },
      { intensity: 43, position: [-0.462, 8.89, 14.52], scale: [4.38, 5.441, 0.088] },
      { intensity: 20, position: [3.235, 11.486, -12.541], scale: [2.5, 2, 0.1] },
      { intensity: 100, position: [0, 20, 0], scale: [1, 0.1, 1] },
    ],
  },
  Yl = {
    topLight: { intensity: 400, position: [0.5, 14, 0.5] },
    room: { position: [0, 13.2, 0], scale: [31.5, 28.5, 31.5] },
    boxes: [
      { position: [-10.906, -1, 1.846], rotation: -0.195, scale: [2.328, 7.905, 4.651] },
      { position: [-5.607, -0.754, -0.758], rotation: 0.994, scale: [1.97, 1.534, 3.955] },
      { position: [6.167, -0.16, 7.803], rotation: 0.561, scale: [3.927, 6.285, 3.687] },
      { position: [-2.017, 0.018, 6.124], rotation: 0.333, scale: [2.002, 4.566, 2.064] },
      { position: [2.291, -0.756, -2.621], rotation: -0.286, scale: [1.546, 1.552, 1.496] },
      { position: [-2.193, -0.369, -5.547], rotation: 0.516, scale: [3.875, 3.487, 2.986] },
    ],
    lights: [
      { intensity: 80, position: [-14, 10, 8], scale: [0.1, 2.5, 2.5] },
      { intensity: 80, position: [-14, 14, -4], scale: [0.1, 2.5, 2.5] },
      { intensity: 23, position: [14, 12, 0], scale: [0.1, 5, 5] },
      { intensity: 16, position: [0, 9, 14], scale: [5, 5, 0.1] },
      { intensity: 80, position: [7, 8, -14], scale: [2.5, 2.5, 0.1] },
      { intensity: 80, position: [-7, 16, -14], scale: [2.5, 2.5, 0.1] },
      { intensity: 1, position: [0, 20, 0], scale: [0.1, 0.1, 0.1] },
    ],
  };
class Wl extends ot {
  constructor(e) {
    (super(), (this.position.y = -3.5));
    const t = new dt();
    t.deleteAttribute('uv');
    const i = new V({ metalness: 0, side: ft }),
      s = new V({ metalness: 0 }),
      n = 'legacy' == e ? Jl : Yl,
      a = new Q(16777215, n.topLight.intensity, 28, 2);
    (a.position.set(...n.topLight.position), this.add(a));
    const r = new X(t, i);
    (r.position.set(...n.room.position), r.scale.set(...n.room.scale), this.add(r));
    for (const o of n.boxes) {
      const e = new X(t, s);
      (e.position.set(...o.position),
        e.rotation.set(0, o.rotation, 0),
        e.scale.set(...o.scale),
        this.add(e));
    }
    for (const o of n.lights) {
      const e = new X(t, this.createAreaLightMaterial(o.intensity));
      (e.position.set(...o.position), e.scale.set(...o.scale), this.add(e));
    }
  }
  createAreaLightMaterial(e) {
    const t = new Y();
    return (t.color.setScalar(e), t);
  }
}
const $l = 20,
  Xl = /\.hdr(\.js)?$/;
class Zl {
  constructor(e) {
    ((this.threeRenderer = e),
      (this.lottieLoaderUrl = ''),
      (this._ldrLoader = null),
      (this._imageLoader = null),
      (this._hdrLoader = null),
      (this._lottieLoader = null),
      (this.generatedEnvironmentMap = null),
      (this.generatedEnvironmentMapAlt = null),
      (this.skyboxCache = new Map()),
      (this.blurMaterial = null),
      (this.blurScene = null));
  }
  ldrLoader(e) {
    return (
      null == this._ldrLoader && (this._ldrLoader = new k()),
      this._ldrLoader.setWithCredentials(e),
      this._ldrLoader
    );
  }
  imageLoader(e) {
    return (
      null == this._imageLoader && (this._imageLoader = new It(this.threeRenderer)),
      this._imageLoader.setWithCredentials(e),
      this._imageLoader
    );
  }
  hdrLoader(e) {
    return (
      null == this._hdrLoader && ((this._hdrLoader = new Vl()), this._hdrLoader.setDataType(Ve)),
      this._hdrLoader.setWithCredentials(e),
      this._hdrLoader
    );
  }
  async getLottieLoader(e) {
    if (null == this._lottieLoader) {
      const { LottieLoader: e } = await import(this.lottieLoaderUrl);
      this._lottieLoader = new e();
    }
    return (this._lottieLoader.setWithCredentials(e), this._lottieLoader);
  }
  async loadImage(e, t) {
    const i = await new Promise((i, s) => this.ldrLoader(t).load(e, i, () => {}, s));
    return ((i.name = e), (i.flipY = !1), i);
  }
  async loadLottie(e, t, i) {
    const s = await this.getLottieLoader(i);
    s.setQuality(t);
    const n = await new Promise((t, i) => s.load(e, t, () => {}, i));
    return ((n.name = e), n);
  }
  async loadEquirect(e, t = !1, i = () => {}) {
    try {
      const s = Xl.test(e),
        n = s ? this.hdrLoader(t) : this.imageLoader(t),
        a = await new Promise((t, s) =>
          n.load(
            e,
            e => {
              const { renderTarget: i } = e;
              if (null != i) {
                const { texture: s } = i;
                (e.dispose(!1), t(s));
              } else t(e);
            },
            e => {
              i((e.loaded / e.total) * 0.9);
            },
            s
          )
        );
      return (i(1), (a.name = e), (a.mapping = Ct), s || (a.colorSpace = c), a);
    } finally {
      i && i(1);
    }
  }
  async generateEnvironmentMapAndSkybox(e = null, t = null, i = () => {}, s = !1) {
    const n = 'legacy' !== t;
    (('legacy' !== t && 'neutral' !== t) || (t = null), (t = as(t)));
    let a,
      r = Promise.resolve(null);
    (e && (r = this.loadEquirectFromUrl(e, s, i)),
      (a = t
        ? this.loadEquirectFromUrl(t, s, i)
        : e
          ? this.loadEquirectFromUrl(e, s, i)
          : n
            ? this.loadGeneratedEnvironmentMapAlt()
            : this.loadGeneratedEnvironmentMap()));
    const [o, A] = await Promise.all([a, r]);
    if (null == o) throw new Error('Failed to load environment map.');
    return { environmentMap: o, skybox: A };
  }
  async loadEquirectFromUrl(e, t, i) {
    if (!this.skyboxCache.has(e)) {
      const s = this.loadEquirect(e, t, i);
      this.skyboxCache.set(e, s);
    }
    return this.skyboxCache.get(e);
  }
  async GenerateEnvironmentMap(e, t) {
    await ((e = 0) => new Promise(t => setTimeout(t, e)))();
    const i = this.threeRenderer,
      s = new lt(256, {
        generateMipmaps: !1,
        type: Ve,
        format: ze,
        colorSpace: h,
        depthBuffer: !0,
      }),
      n = new Et(0.1, 100, s),
      a = n.renderTarget.texture;
    a.name = t;
    const o = i.outputColorSpace,
      A = i.toneMapping;
    return (
      (i.toneMapping = r),
      (i.outputColorSpace = h),
      n.update(i, e),
      this.blurCubemap(s, 0.04),
      (i.toneMapping = A),
      (i.outputColorSpace = o),
      a
    );
  }
  async loadGeneratedEnvironmentMap() {
    return (
      null == this.generatedEnvironmentMap &&
        (this.generatedEnvironmentMap = this.GenerateEnvironmentMap(new Wl('legacy'), 'legacy')),
      this.generatedEnvironmentMap
    );
  }
  async loadGeneratedEnvironmentMapAlt() {
    return (
      null == this.generatedEnvironmentMapAlt &&
        (this.generatedEnvironmentMapAlt = this.GenerateEnvironmentMap(
          new Wl('neutral'),
          'neutral'
        )),
      this.generatedEnvironmentMapAlt
    );
  }
  blurCubemap(e, t) {
    if (null == this.blurMaterial) {
      this.blurMaterial = this.getBlurShader($l);
      const e = new dt(),
        t = new X(e, this.blurMaterial);
      ((this.blurScene = new ot()), this.blurScene.add(t));
    }
    const i = e.clone();
    (this.halfblur(e, i, t, 'latitudinal'), this.halfblur(i, e, t, 'longitudinal'));
  }
  halfblur(e, t, i, s) {
    const n = e.width,
      a = isFinite(i) ? Math.PI / (2 * n) : (2 * Math.PI) / 39,
      r = i / a,
      o = isFinite(i) ? 1 + Math.floor(3 * r) : $l;
    o > $l &&
      console.warn(
        `sigmaRadians, ${i}, is too large and will clip, as it requested ${o} samples when the maximum is set to 20`
      );
    const A = [];
    let l = 0;
    for (let h = 0; h < $l; ++h) {
      const e = h / r,
        t = Math.exp((-e * e) / 2);
      (A.push(t), 0 == h ? (l += t) : h < o && (l += 2 * t));
    }
    for (let h = 0; h < A.length; h++) A[h] = A[h] / l;
    const c = this.blurMaterial.uniforms;
    ((c.envMap.value = e.texture),
      (c.samples.value = o),
      (c.weights.value = A),
      (c.latitudinal.value = 'latitudinal' === s),
      (c.dTheta.value = a));
    new Et(0.1, 100, t).update(this.threeRenderer, this.blurScene);
  }
  getBlurShader(e) {
    const t = new Float32Array(e),
      i = new S(0, 1, 0);
    return new Bt({
      name: 'SphericalGaussianBlur',
      defines: { n: e },
      uniforms: {
        envMap: { value: null },
        samples: { value: 1 },
        weights: { value: t },
        latitudinal: { value: !1 },
        dTheta: { value: 0 },
        poleAxis: { value: i },
      },
      vertexShader:
        '\n      \n      varying vec3 vOutputDirection;\n  \n      void main() {\n  \n        vOutputDirection = vec3( position );\n        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  \n      }\n    ',
      fragmentShader:
        "\n        varying vec3 vOutputDirection;\n  \n        uniform samplerCube envMap;\n        uniform int samples;\n        uniform float weights[ n ];\n        uniform bool latitudinal;\n        uniform float dTheta;\n        uniform vec3 poleAxis;\n  \n        vec3 getSample( float theta, vec3 axis ) {\n  \n          float cosTheta = cos( theta );\n          // Rodrigues' axis-angle rotation\n          vec3 sampleDirection = vOutputDirection * cosTheta\n            + cross( axis, vOutputDirection ) * sin( theta )\n            + axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );\n  \n          return vec3( textureCube( envMap, sampleDirection ) );\n  \n        }\n  \n        void main() {\n  \n          vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );\n  \n          if ( all( equal( axis, vec3( 0.0 ) ) ) ) {\n  \n            axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );\n  \n          }\n  \n          axis = normalize( axis );\n  \n          gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n          gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );\n  \n          for ( int i = 1; i < n; i++ ) {\n  \n            if ( i >= samples ) {\n  \n              break;\n  \n            }\n  \n            float theta = dTheta * float( i );\n            gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );\n            gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );\n  \n          }\n        }\n      ",
      blending: yt,
      depthTest: !1,
      depthWrite: !1,
      side: ft,
    });
  }
  async dispose() {
    for (const [, e] of this.skyboxCache) {
      (await e).dispose();
    }
    (null != this.generatedEnvironmentMap &&
      ((await this.generatedEnvironmentMap).dispose(), (this.generatedEnvironmentMap = null)),
      null != this.generatedEnvironmentMapAlt &&
        ((await this.generatedEnvironmentMapAlt).dispose(),
        (this.generatedEnvironmentMapAlt = null)),
      null != this.blurMaterial && this.blurMaterial.dispose());
  }
}
const ec = [1, 0.79, 0.62, 0.5, 0.4, 0.31, 0.25],
  tc = 'high-performance';
class ic extends st {
  static get singleton() {
    return (
      this._singleton ||
        (this._singleton = new ic({
          powerPreference: (self.ModelViewerElement || {}).powerPreference || tc,
          debug: cs(),
        })),
      this._singleton
    );
  }
  static resetSingleton() {
    const e = this._singleton.dispose();
    for (const t of e) t.disconnectedCallback();
    this._singleton = new ic({
      powerPreference: (self.ModelViewerElement || {}).powerPreference || tc,
      debug: cs(),
    });
    for (const t of e) t.connectedCallback();
  }
  get canRender() {
    return null != this.threeRenderer;
  }
  get scaleFactor() {
    return ec[this.scaleStep];
  }
  set minScale(e) {
    let t = 1;
    for (; t < ec.length && !(ec[t] < e); ) ++t;
    this.lastStep = t - 1;
  }
  constructor(e) {
    (super(),
      (this.loader = new Ya(zl)),
      (this.width = 0),
      (this.height = 0),
      (this.dpr = 1),
      (this.scenes = new Set()),
      (this.multipleScenesVisible = !1),
      (this.lastTick = performance.now()),
      (this.renderedLastFrame = !1),
      (this.scaleStep = 0),
      (this.lastStep = 3),
      (this.avgFrameDuration = 50),
      (this.onWebGLContextLost = e => {
        this.dispatchEvent({ type: 'contextlost', sourceEvent: e });
      }),
      (this.onWebGLContextRestored = () => {
        var e;
        (null === (e = this.textureUtils) || void 0 === e || e.dispose(),
          (this.textureUtils = new Zl(this.threeRenderer)));
        for (const t of this.scenes) t.element[us]();
      }),
      (this.dpr = window.devicePixelRatio),
      (this.canvas3D = document.createElement('canvas')),
      (this.canvas3D.id = 'webgl-canvas'),
      this.canvas3D.classList.add('show'));
    try {
      ((this.threeRenderer = new wt({
        canvas: this.canvas3D,
        alpha: !0,
        antialias: !0,
        powerPreference: e.powerPreference,
        preserveDrawingBuffer: !0,
      })),
        (this.threeRenderer.autoClear = !0),
        this.threeRenderer.setPixelRatio(1),
        (this.threeRenderer.debug = { checkShaderErrors: !!e.debug, onShaderError: null }),
        (this.threeRenderer.toneMapping = o));
    } catch (t) {
      console.warn(t);
    }
    ((this.arRenderer = new vl(this)),
      (this.textureUtils = this.canRender ? new Zl(this.threeRenderer) : null),
      Ya.initializeKTX2Loader(this.threeRenderer),
      this.canvas3D.addEventListener('webglcontextlost', this.onWebGLContextLost),
      this.canvas3D.addEventListener('webglcontextrestored', this.onWebGLContextRestored),
      this.updateRendererSize());
  }
  registerScene(e) {
    (this.scenes.add(e), e.forceRescale());
    const t = new y();
    (this.threeRenderer.getSize(t),
      (e.canvas.width = t.x),
      (e.canvas.height = t.y),
      this.canRender &&
        this.scenes.size > 0 &&
        this.threeRenderer.setAnimationLoop((e, t) => this.render(e, t)));
  }
  unregisterScene(e) {
    (this.scenes.delete(e),
      this.canvas3D.parentElement === e.canvas.parentElement &&
        e.canvas.parentElement.removeChild(this.canvas3D),
      this.canRender && 0 === this.scenes.size && this.threeRenderer.setAnimationLoop(null));
  }
  displayCanvas(e) {
    return e.element.modelIsVisible && !this.multipleScenesVisible ? this.canvas3D : e.element[Yd];
  }
  countVisibleScenes() {
    const { canvas3D: e } = this;
    let t = 0,
      i = null;
    for (const n of this.scenes) {
      const { element: s } = n;
      (s.modelIsVisible && null == n.externalRenderer && ++t,
        e.parentElement === n.canvas.parentElement && (i = n));
    }
    const s = t > 1;
    if (null != i) {
      const t = s && !this.multipleScenesVisible,
        n = !i.element.modelIsVisible;
      if (t || n) {
        const { width: t, height: s } = this.sceneSize(i);
        (this.copyPixels(i, t, s), e.parentElement.removeChild(e));
      }
    }
    this.multipleScenesVisible = s;
  }
  updateRendererSize() {
    var e;
    const t = window.devicePixelRatio;
    if (t !== this.dpr)
      for (const n of this.scenes) {
        const { element: e } = n;
        e[Ud](e.getBoundingClientRect());
      }
    let i = 0,
      s = 0;
    for (const n of this.scenes) ((i = Math.max(i, n.width)), (s = Math.max(s, n.height)));
    if (i !== this.width || s !== this.height || t !== this.dpr) {
      ((this.width = i),
        (this.height = s),
        (this.dpr = t),
        (i = Math.ceil(i * t)),
        (s = Math.ceil(s * t)),
        this.canRender && this.threeRenderer.setSize(i, s, !1));
      for (const t of this.scenes) {
        const { canvas: n } = t;
        ((n.width = i),
          (n.height = s),
          t.forceRescale(),
          null === (e = t.effectRenderer) || void 0 === e || e.setSize(i, s));
      }
    }
  }
  updateRendererScale(e) {
    const t = this.scaleStep;
    ((this.avgFrameDuration += ls(0.2 * (e - this.avgFrameDuration), -5, 5)),
      this.avgFrameDuration > 60
        ? ++this.scaleStep
        : this.avgFrameDuration < 40 && this.scaleStep > 0 && --this.scaleStep,
      (this.scaleStep = Math.min(this.scaleStep, this.lastStep)),
      t !== this.scaleStep && (this.avgFrameDuration = 50));
  }
  shouldRender(e) {
    if (e.shouldRender())
      e.scaleStep != this.scaleStep && ((e.scaleStep = this.scaleStep), this.rescaleCanvas(e));
    else {
      if (0 == e.scaleStep) return !1;
      ((e.scaleStep = 0), this.rescaleCanvas(e));
    }
    return !0;
  }
  rescaleCanvas(e) {
    const t = ec[e.scaleStep],
      i = Math.ceil(this.width / t),
      s = Math.ceil(this.height / t),
      { style: n } = e.canvas;
    ((n.width = `${i}px`),
      (n.height = `${s}px`),
      (this.canvas3D.style.width = `${i}px`),
      (this.canvas3D.style.height = `${s}px`));
    const a = this.dpr * t,
      r =
        t < 1
          ? 'GPU throttling'
          : this.dpr !== window.devicePixelRatio
            ? 'No meta viewport tag'
            : '';
    e.element.dispatchEvent(
      new CustomEvent('render-scale', {
        detail: {
          reportedDpr: window.devicePixelRatio,
          renderedDpr: a,
          minimumDpr: this.dpr * ec[this.lastStep],
          pixelWidth: Math.ceil(e.width * a),
          pixelHeight: Math.ceil(e.height * a),
          reason: r,
        },
      })
    );
  }
  sceneSize(e) {
    const { dpr: t } = this,
      i = ec[e.scaleStep];
    return {
      width: Math.min(Math.ceil(e.width * i * t), this.canvas3D.width),
      height: Math.min(Math.ceil(e.height * i * t), this.canvas3D.height),
    };
  }
  copyPixels(e, t, i) {
    const s = e.context;
    null != s
      ? (s.clearRect(0, 0, t, i),
        s.drawImage(this.canvas3D, 0, 0, t, i, 0, 0, t, i),
        e.canvas.classList.add('show'))
      : console.log('could not acquire 2d context');
  }
  orderedScenes() {
    const e = [];
    for (const t of [!1, !0])
      for (const i of this.scenes) i.element.modelIsVisible === t && e.push(i);
    return e;
  }
  get isPresenting() {
    return this.arRenderer.isPresenting;
  }
  preRender(e, t, i) {
    const { element: s, exposure: n, toneMapping: a } = e;
    s[Xd](t, i);
    const r = 'number' == typeof n && !Number.isNaN(n),
      A = s.environmentImage,
      l = s.skyboxImage,
      c = a === o && ('neutral' === A || 'legacy' === A || (!A && !l));
    this.threeRenderer.toneMappingExposure = (r ? n : 1) * (c ? 1.3 : 1);
  }
  render(e, t) {
    if (null != t) return void this.arRenderer.onWebXRFrame(e, t);
    const i = e - this.lastTick;
    if (((this.lastTick = e), !this.canRender || this.isPresenting)) return;
    (this.countVisibleScenes(),
      this.updateRendererSize(),
      this.renderedLastFrame && (this.updateRendererScale(i), (this.renderedLastFrame = !1)));
    const { canvas3D: s } = this;
    for (const n of this.orderedScenes()) {
      const { element: t } = n;
      if (!t.loaded || (!t.modelIsVisible && n.renderCount > 0)) continue;
      if ((this.preRender(n, e, i), !this.shouldRender(n))) continue;
      if (null != n.externalRenderer) {
        const e = n.getCamera();
        e.updateMatrix();
        const { matrix: t, projectionMatrix: i } = e,
          s = t.elements.slice(),
          a = n.getTarget();
        ((s[12] += a.x),
          (s[13] += a.y),
          (s[14] += a.z),
          n.externalRenderer.render({ viewMatrix: s, projectionMatrix: i.elements }));
        continue;
      }
      if (!t.modelIsVisible && !this.multipleScenesVisible)
        for (const e of this.scenes) e.element.modelIsVisible && e.queueRender();
      const { width: a, height: r } = this.sceneSize(n);
      (n.renderShadow(this.threeRenderer),
        this.threeRenderer.setRenderTarget(null),
        this.threeRenderer.setViewport(0, Math.ceil(this.height * this.dpr) - r, a, r),
        null != n.effectRenderer
          ? n.effectRenderer.render(i)
          : ((this.threeRenderer.autoClear = !0),
            (this.threeRenderer.toneMapping = n.toneMapping),
            this.threeRenderer.render(n, n.camera)),
        this.multipleScenesVisible || (!n.element.modelIsVisible && 0 === n.renderCount)
          ? this.copyPixels(n, a, r)
          : s.parentElement !== n.canvas.parentElement &&
            (n.canvas.parentElement.appendChild(s), n.canvas.classList.remove('show')),
        n.hasRendered(),
        ++n.renderCount,
        (this.renderedLastFrame = !0));
    }
  }
  dispose() {
    (null != this.textureUtils && this.textureUtils.dispose(),
      null != this.threeRenderer && this.threeRenderer.dispose(),
      (this.textureUtils = null),
      (this.threeRenderer = null));
    const e = [];
    for (const t of this.scenes) e.push(t.element);
    return (
      this.canvas3D.removeEventListener('webglcontextlost', this.onWebGLContextLost),
      this.canvas3D.removeEventListener('webglcontextrestored', this.onWebGLContextRestored),
      e
    );
  }
}
const sc = Symbol('correlatedObjects'),
  nc = Symbol('onUpdate');
class ac {
  constructor(e, t) {
    ((this[nc] = e), (this[sc] = t));
  }
}
const rc = new Y(),
  oc = new ht(2, 2);
let Ac = 0;
const lc = Symbol('threeTexture'),
  cc = Symbol('threeTextures');
class hc extends ac {
  get [lc]() {
    var e;
    return null === (e = this[sc]) || void 0 === e ? void 0 : e.values().next().value;
  }
  get [cc]() {
    return this[sc];
  }
  constructor(e, t) {
    (super(e, new Set(t ? [t] : [])),
      this[lc].image.src || (this[lc].image.src = t.name ? t.name : 'adhoc_image' + Ac++),
      this[lc].image.name ||
        (this[lc].image.name =
          t && t.image && t.image.src ? t.image.src.split('/').pop() : 'adhoc_image'));
  }
  get name() {
    return this[lc].image.name || '';
  }
  get uri() {
    return this[lc].image.src;
  }
  get bufferView() {
    return this[lc].image.bufferView;
  }
  get element() {
    const e = this[lc];
    if (e && (e.isCanvasTexture || e.isVideoTexture)) return e.image;
  }
  get animation() {
    const e = this[lc];
    if (e && e.isCanvasTexture && e.animation) return e.animation;
  }
  get type() {
    return null != this.uri ? 'external' : 'embedded';
  }
  set name(e) {
    for (const t of this[cc]) t.image.name = e;
  }
  update() {
    const e = this[lc];
    e && e.isCanvasTexture && !e.animation && ((this[lc].needsUpdate = !0), this[nc]());
  }
  async createThumbnail(e, t) {
    const i = new ot();
    rc.map = this[lc];
    const s = new X(oc, rc);
    i.add(s);
    const n = new re(-1, 1, 1, -1, 0, 1),
      { threeRenderer: a } = ic.singleton,
      r = new Qt(e, t);
    (a.setRenderTarget(r), a.render(i, n), a.setRenderTarget(null));
    const o = new Uint8Array(e * t * 4);
    (a.readRenderTargetPixels(r, 0, 0, e, t, o), (vd.width = e), (vd.height = t));
    const A = vd.getContext('2d'),
      l = A.createImageData(e, t);
    return (
      l.data.set(o),
      A.putImageData(l, 0, 0),
      new Promise(async (e, t) => {
        vd.toBlob(i => {
          if (!i) return t('Failed to capture thumbnail.');
          e(URL.createObjectURL(i));
        }, 'image/png');
      })
    );
  }
}
var dc, gc, uc, pc;
(((gc = dc || (dc = {}))[(gc.Nearest = 9728)] = 'Nearest'),
  (gc[(gc.Linear = 9729)] = 'Linear'),
  (gc[(gc.NearestMipmapNearest = 9984)] = 'NearestMipmapNearest'),
  (gc[(gc.LinearMipmapNearest = 9985)] = 'LinearMipmapNearest'),
  (gc[(gc.NearestMipmapLinear = 9986)] = 'NearestMipmapLinear'),
  (gc[(gc.LinearMipmapLinear = 9987)] = 'LinearMipmapLinear'),
  ((pc = uc || (uc = {}))[(pc.ClampToEdge = 33071)] = 'ClampToEdge'),
  (pc[(pc.MirroredRepeat = 33648)] = 'MirroredRepeat'),
  (pc[(pc.Repeat = 10497)] = 'Repeat'));
const mc = new Map([
    [uc.Repeat, O],
    [uc.ClampToEdge, q],
    [uc.MirroredRepeat, H],
  ]),
  bc = new Map([
    [O, uc.Repeat],
    [q, uc.ClampToEdge],
    [H, uc.MirroredRepeat],
  ]),
  fc = new Map([
    [dc.Nearest, N],
    [dc.Linear, P],
    [dc.NearestMipmapNearest, _],
    [dc.LinearMipmapNearest, G],
    [dc.NearestMipmapLinear, U],
    [dc.LinearMipmapLinear, L],
  ]),
  Ic = new Map([
    [N, dc.Nearest],
    [P, dc.Linear],
    [_, dc.NearestMipmapNearest],
    [G, dc.LinearMipmapNearest],
    [U, dc.NearestMipmapLinear],
    [L, dc.LinearMipmapLinear],
  ]),
  Cc = new Map([
    [dc.Nearest, N],
    [dc.Linear, P],
  ]),
  Ec = new Map([
    [N, dc.Nearest],
    [P, dc.Linear],
  ]),
  Bc = (
    () => e =>
      Ic.has(e)
  )(),
  yc = (
    () => e =>
      Ec.has(e)
  )(),
  wc = (
    () => e =>
      bc.has(e)
  )(),
  Qc = Symbol('threeTexture'),
  vc = Symbol('threeTextures'),
  xc = Symbol('setProperty');
class Sc extends ac {
  get [Qc]() {
    var e;
    return null === (e = this[sc]) || void 0 === e ? void 0 : e.values().next().value;
  }
  get [vc]() {
    return this[sc];
  }
  constructor(e, t) {
    super(e, new Set(t ? [t] : []));
  }
  get name() {
    return this[Qc].name || '';
  }
  get minFilter() {
    return Ic.get(this[Qc].minFilter);
  }
  get magFilter() {
    return Ec.get(this[Qc].magFilter);
  }
  get wrapS() {
    return bc.get(this[Qc].wrapS);
  }
  get wrapT() {
    return bc.get(this[Qc].wrapT);
  }
  get rotation() {
    return this[Qc].rotation;
  }
  get scale() {
    return og(this[Qc].repeat);
  }
  get offset() {
    return og(this[Qc].offset);
  }
  setMinFilter(e) {
    this[xc]('minFilter', fc.get(e));
  }
  setMagFilter(e) {
    this[xc]('magFilter', Cc.get(e));
  }
  setWrapS(e) {
    this[xc]('wrapS', mc.get(e));
  }
  setWrapT(e) {
    this[xc]('wrapT', mc.get(e));
  }
  setRotation(e) {
    (null == e && (e = 0), this[xc]('rotation', e));
  }
  setScale(e) {
    (null == e && (e = { u: 1, v: 1 }), this[xc]('repeat', new y(e.u, e.v)));
  }
  setOffset(e) {
    (null == e && (e = { u: 0, v: 0 }), this[xc]('offset', new y(e.u, e.v)));
  }
  [xc](e, t) {
    if (
      ((e, t) => {
        switch (e) {
          case 'minFilter':
            return Bc(t);
          case 'magFilter':
            return yc(t);
          case 'wrapS':
          case 'wrapT':
            return wc(t);
          case 'rotation':
          case 'repeat':
          case 'offset':
            return !0;
          default:
            throw new Error(`Cannot configure property "${e}" on Sampler`);
        }
      })(e, t)
    )
      for (const i of this[vc]) ((i[e] = t), (i.needsUpdate = !0));
    this[nc]();
  }
}
const Rc = Symbol('image'),
  Mc = Symbol('sampler'),
  Tc = Symbol('threeTexture');
class Dc extends ac {
  get [Tc]() {
    var e;
    return null === (e = this[sc]) || void 0 === e ? void 0 : e.values().next().value;
  }
  constructor(e, t) {
    (super(e, new Set(t ? [t] : [])), (this[Mc] = new Sc(e, t)), (this[Rc] = new hc(e, t)));
  }
  get name() {
    return this[Tc].name || '';
  }
  set name(e) {
    for (const t of this[sc]) t.name = e;
  }
  get sampler() {
    return this[Mc];
  }
  get source() {
    return this[Rc];
  }
}
var kc, Fc, Lc;
const Uc = Symbol('texture'),
  Gc = Symbol('transform'),
  _c = Symbol('materials'),
  Pc = Symbol('usage'),
  Nc = Symbol('onUpdate'),
  Oc = Symbol('activeVideo');
var Hc, qc;
(((qc = Hc || (Hc = {}))[(qc.Base = 0)] = 'Base'),
  (qc[(qc.MetallicRoughness = 1)] = 'MetallicRoughness'),
  (qc[(qc.Normal = 2)] = 'Normal'),
  (qc[(qc.Occlusion = 3)] = 'Occlusion'),
  (qc[(qc.Emissive = 4)] = 'Emissive'),
  (qc[(qc.Clearcoat = 5)] = 'Clearcoat'),
  (qc[(qc.ClearcoatRoughness = 6)] = 'ClearcoatRoughness'),
  (qc[(qc.ClearcoatNormal = 7)] = 'ClearcoatNormal'),
  (qc[(qc.SheenColor = 8)] = 'SheenColor'),
  (qc[(qc.SheenRoughness = 9)] = 'SheenRoughness'),
  (qc[(qc.Transmission = 10)] = 'Transmission'),
  (qc[(qc.Thickness = 11)] = 'Thickness'),
  (qc[(qc.Specular = 12)] = 'Specular'),
  (qc[(qc.SpecularColor = 13)] = 'SpecularColor'),
  (qc[(qc.Iridescence = 14)] = 'Iridescence'),
  (qc[(qc.IridescenceThickness = 15)] = 'IridescenceThickness'),
  (qc[(qc.Anisotropy = 16)] = 'Anisotropy'));
class jc {
  constructor(e, t, i, s) {
    ((this[kc] = null),
      (this[Fc] = { rotation: 0, scale: new y(1, 1), offset: new y(0, 0) }),
      (this[Lc] = !1),
      i &&
        ((this[Gc].rotation = i.rotation),
        this[Gc].scale.copy(i.repeat),
        this[Gc].offset.copy(i.offset),
        (this[Uc] = new Dc(e, i))),
      (this[Nc] = e),
      (this[_c] = s),
      (this[Pc] = t));
  }
  get texture() {
    return this[Uc];
  }
  setTexture(e) {
    var t, i;
    const s = null != e ? e.source[lc] : null,
      n = null === (t = this[Uc]) || void 0 === t ? void 0 : t.source[lc];
    if (
      (null != n && n.isVideoTexture
        ? (this[Oc] = !1)
        : (null === (i = this[Uc]) || void 0 === i ? void 0 : i.source.animation) &&
          this[Uc].source.animation.removeEventListener('enterFrame', this[Nc]),
      (this[Uc] = e),
      null != s && s.isVideoTexture)
    ) {
      const e = s.image;
      if (((this[Oc] = !0), null != e.requestVideoFrameCallback)) {
        const t = () => {
          this[Oc] && (this[Nc](), e.requestVideoFrameCallback(t));
        };
        e.requestVideoFrameCallback(t);
      } else {
        const e = () => {
          this[Oc] && (this[Nc](), requestAnimationFrame(e));
        };
        requestAnimationFrame(e);
      }
    } else
      null != (null == e ? void 0 : e.source.animation) &&
        e.source.animation.addEventListener('enterFrame', this[Nc]);
    let a = c;
    if (this[_c])
      for (const r of this[_c]) {
        switch (this[Pc]) {
          case Hc.Base:
            r.map = s;
            break;
          case Hc.MetallicRoughness:
            ((a = h), (r.metalnessMap = s), (r.roughnessMap = s));
            break;
          case Hc.Normal:
            ((a = h), (r.normalMap = s));
            break;
          case Hc.Occlusion:
            ((a = h), (r.aoMap = s));
            break;
          case Hc.Emissive:
            r.emissiveMap = s;
            break;
          case Hc.Clearcoat:
            r.clearcoatMap = s;
            break;
          case Hc.ClearcoatRoughness:
            r.clearcoatRoughnessMap = s;
            break;
          case Hc.ClearcoatNormal:
            r.clearcoatNormalMap = s;
            break;
          case Hc.SheenColor:
            r.sheenColorMap = s;
            break;
          case Hc.SheenRoughness:
            r.sheenRoughnessMap = s;
            break;
          case Hc.Transmission:
            r.transmissionMap = s;
            break;
          case Hc.Thickness:
            r.thicknessMap = s;
            break;
          case Hc.Specular:
            r.specularIntensityMap = s;
            break;
          case Hc.SpecularColor:
            r.specularColorMap = s;
            break;
          case Hc.Iridescence:
            r.iridescenceMap = s;
            break;
          case Hc.IridescenceThickness:
            r.iridescenceThicknessMap = s;
            break;
          case Hc.Anisotropy:
            r.anisotropyMap = s;
        }
        r.needsUpdate = !0;
      }
    (s &&
      ((s.colorSpace = a),
      (s.rotation = this[Gc].rotation),
      (s.repeat = this[Gc].scale),
      (s.offset = this[Gc].offset)),
      this[Nc]());
  }
}
((kc = Uc), (Fc = Gc), (Lc = Oc));
const zc = Symbol('threeMaterial'),
  Kc = Symbol('threeMaterials'),
  Vc = Symbol('baseColorTexture'),
  Jc = Symbol('metallicRoughnessTexture');
class Yc extends ac {
  get [Kc]() {
    return this[sc];
  }
  get [zc]() {
    var e;
    return null === (e = this[sc]) || void 0 === e ? void 0 : e.values().next().value;
  }
  constructor(e, t) {
    super(e, t);
    const { map: i, metalnessMap: s } = t.values().next().value;
    ((this[Vc] = new jc(e, Hc.Base, i, t)), (this[Jc] = new jc(e, Hc.MetallicRoughness, s, t)));
  }
  get baseColorFactor() {
    const e = [0, 0, 0, this[zc].opacity];
    return (this[zc].color.toArray(e), e);
  }
  get metallicFactor() {
    return this[zc].metalness;
  }
  get roughnessFactor() {
    return this[zc].roughness;
  }
  get baseColorTexture() {
    return this[Vc];
  }
  get metallicRoughnessTexture() {
    return this[Jc];
  }
  setBaseColorFactor(e) {
    const t = new p();
    e instanceof Array ? t.fromArray(e) : t.set(e);
    for (const i of this[Kc])
      (i.color.set(t),
        e instanceof Array && e.length > 3
          ? (i.opacity = e[3])
          : ((e = [0, 0, 0, i.opacity]), t.toArray(e)));
    this[nc]();
  }
  setMetallicFactor(e) {
    for (const t of this[Kc]) t.metalness = e;
    this[nc]();
  }
  setRoughnessFactor(e) {
    for (const t of this[Kc]) t.roughness = e;
    this[nc]();
  }
}
var Wc, $c;
const Xc = Symbol('pbrMetallicRoughness'),
  Zc = Symbol('normalTexture'),
  eh = Symbol('occlusionTexture'),
  th = Symbol('emissiveTexture'),
  ih = Symbol('backingThreeMaterial'),
  sh = Symbol('applyAlphaCutoff'),
  nh = Symbol('getAlphaMode'),
  ah = Symbol('lazyLoadGLTFInfo'),
  rh = Symbol('initialize'),
  oh = Symbol('getLoadedMaterial'),
  Ah = Symbol('ensureMaterialIsLoaded'),
  lh = Symbol('gltfIndex'),
  ch = Symbol('setActive'),
  hh = Symbol('variantIndices'),
  dh = Symbol('isActive'),
  gh = Symbol('modelVariants'),
  uh = Symbol('name'),
  ph = Symbol('pbrTextures');
class mh extends ac {
  get [((Wc = hh), ($c = ph), ih)]() {
    return this[sc].values().next().value;
  }
  constructor(e, t, i, s, n, a, r = void 0) {
    (super(e, n),
      (this[Wc] = new Set()),
      (this[$c] = new Map()),
      (this[lh] = t),
      (this[dh] = i),
      (this[gh] = s),
      (this[uh] = a),
      null == r ? this[rh]() : (this[ah] = r));
  }
  [rh]() {
    const e = this[nc],
      t = this[sc];
    this[Xc] = new Yc(e, t);
    const { normalMap: i, aoMap: s, emissiveMap: n } = t.values().next().value;
    ((this[Zc] = new jc(e, Hc.Normal, i, t)),
      (this[eh] = new jc(e, Hc.Occlusion, s, t)),
      (this[th] = new jc(e, Hc.Emissive, n, t)));
    const a = i => {
      this[ph].set(i, new jc(e, i, null, t));
    };
    (a(Hc.Clearcoat),
      a(Hc.ClearcoatRoughness),
      a(Hc.ClearcoatNormal),
      a(Hc.SheenColor),
      a(Hc.SheenRoughness),
      a(Hc.Transmission),
      a(Hc.Thickness),
      a(Hc.Specular),
      a(Hc.SpecularColor),
      a(Hc.Iridescence),
      a(Hc.IridescenceThickness),
      a(Hc.Anisotropy));
  }
  async [oh]() {
    if (null != this[ah]) {
      const e = await this[ah].doLazyLoad();
      return (this[rh](), (this[ah] = void 0), (this.ensureLoaded = async () => {}), e);
    }
    return null;
  }
  colorFromRgb(e) {
    const t = new p();
    return (e instanceof Array ? t.fromArray(e) : t.set(e), t);
  }
  [Ah]() {
    if (null != this[ah])
      throw new Error(
        `Material "${this.name}" has not been loaded, call 'await\n    myMaterial.ensureLoaded()' before using an unloaded material.`
      );
  }
  async ensureLoaded() {
    await this[oh]();
  }
  get isLoaded() {
    return null == this[ah];
  }
  get isActive() {
    return this[dh];
  }
  [ch](e) {
    this[dh] = e;
  }
  get name() {
    return this[uh] || '';
  }
  set name(e) {
    if (((this[uh] = e), null != this[sc])) for (const t of this[sc]) t.name = e;
  }
  get pbrMetallicRoughness() {
    return (this[Ah](), this[Xc]);
  }
  get normalTexture() {
    return (this[Ah](), this[Zc]);
  }
  get occlusionTexture() {
    return (this[Ah](), this[eh]);
  }
  get emissiveTexture() {
    return (this[Ah](), this[th]);
  }
  get emissiveFactor() {
    return (this[Ah](), this[ih].emissive.toArray());
  }
  get index() {
    return this[lh];
  }
  hasVariant(e) {
    const t = this[gh].get(e);
    return null != t && this[hh].has(t.index);
  }
  setEmissiveFactor(e) {
    this[Ah]();
    const t = this.colorFromRgb(e);
    for (const i of this[sc]) i.emissive.set(t);
    this[nc]();
  }
  [nh]() {
    return this[ih].transparent ? 'BLEND' : this[ih].alphaTest > 0 ? 'MASK' : 'OPAQUE';
  }
  [sh]() {
    this[Ah]();
    for (const e of this[sc])
      ('MASK' === this[nh]() ? null == e.alphaTest && (e.alphaTest = 0.5) : (e.alphaTest = void 0),
        (e.needsUpdate = !0));
  }
  setAlphaCutoff(e) {
    this[Ah]();
    for (const t of this[sc]) ((t.alphaTest = e), (t.needsUpdate = !0));
    (this[sh](), this[nc]());
  }
  getAlphaCutoff() {
    return (this[Ah](), this[ih].alphaTest);
  }
  setDoubleSided(e) {
    this[Ah]();
    for (const t of this[sc]) ((t.side = e ? J : me), (t.needsUpdate = !0));
    this[nc]();
  }
  getDoubleSided() {
    return (this[Ah](), this[ih].side == J);
  }
  setAlphaMode(e) {
    this[Ah]();
    const t = (e, t) => {
      ((e.transparent = t), (e.depthWrite = !t));
    };
    for (const i of this[sc])
      (t(i, 'BLEND' === e), (i.alphaTest = 'MASK' === e ? 0.5 : void 0), (i.needsUpdate = !0));
    this[nc]();
  }
  getAlphaMode() {
    return (this[Ah](), this[nh]());
  }
  get emissiveStrength() {
    return (this[Ah](), this[ih].emissiveIntensity);
  }
  setEmissiveStrength(e) {
    this[Ah]();
    for (const t of this[sc]) t.emissiveIntensity = e;
    this[nc]();
  }
  get clearcoatFactor() {
    return (this[Ah](), this[ih].clearcoat);
  }
  get clearcoatRoughnessFactor() {
    return (this[Ah](), this[ih].clearcoatRoughness);
  }
  get clearcoatTexture() {
    return (this[Ah](), this[ph].get(Hc.Clearcoat));
  }
  get clearcoatRoughnessTexture() {
    return (this[Ah](), this[ph].get(Hc.ClearcoatRoughness));
  }
  get clearcoatNormalTexture() {
    return (this[Ah](), this[ph].get(Hc.ClearcoatNormal));
  }
  get clearcoatNormalScale() {
    return (this[Ah](), this[ih].clearcoatNormalScale.x);
  }
  setClearcoatFactor(e) {
    this[Ah]();
    for (const t of this[sc]) t.clearcoat = e;
    this[nc]();
  }
  setClearcoatRoughnessFactor(e) {
    this[Ah]();
    for (const t of this[sc]) t.clearcoatRoughness = e;
    this[nc]();
  }
  setClearcoatNormalScale(e) {
    this[Ah]();
    for (const t of this[sc]) t.clearcoatNormalScale = new y(e, e);
    this[nc]();
  }
  get ior() {
    return (this[Ah](), this[ih].ior);
  }
  setIor(e) {
    this[Ah]();
    for (const t of this[sc]) t.ior = e;
    this[nc]();
  }
  get sheenColorFactor() {
    return (this[Ah](), this[ih].sheenColor.toArray());
  }
  get sheenColorTexture() {
    return (this[Ah](), this[ph].get(Hc.SheenColor));
  }
  get sheenRoughnessFactor() {
    return (this[Ah](), this[ih].sheenRoughness);
  }
  get sheenRoughnessTexture() {
    return (this[Ah](), this[ph].get(Hc.SheenRoughness));
  }
  setSheenColorFactor(e) {
    this[Ah]();
    const t = this.colorFromRgb(e);
    for (const i of this[sc]) (i.sheenColor.set(t), (i.sheen = 1));
    this[nc]();
  }
  setSheenRoughnessFactor(e) {
    this[Ah]();
    for (const t of this[sc]) ((t.sheenRoughness = e), (t.sheen = 1));
    this[nc]();
  }
  get transmissionFactor() {
    return (this[Ah](), this[ih].transmission);
  }
  get transmissionTexture() {
    return (this[Ah](), this[ph].get(Hc.Transmission));
  }
  setTransmissionFactor(e) {
    this[Ah]();
    for (const t of this[sc]) t.transmission = e;
    this[nc]();
  }
  get thicknessFactor() {
    return (this[Ah](), this[ih].thickness);
  }
  get thicknessTexture() {
    return (this[Ah](), this[ph].get(Hc.Thickness));
  }
  get attenuationDistance() {
    return (this[Ah](), this[ih].attenuationDistance);
  }
  get attenuationColor() {
    return (this[Ah](), this[ih].attenuationColor.toArray());
  }
  setThicknessFactor(e) {
    this[Ah]();
    for (const t of this[sc]) t.thickness = e;
    this[nc]();
  }
  setAttenuationDistance(e) {
    this[Ah]();
    for (const t of this[sc]) t.attenuationDistance = e;
    this[nc]();
  }
  setAttenuationColor(e) {
    this[Ah]();
    const t = this.colorFromRgb(e);
    for (const i of this[sc]) i.attenuationColor.set(t);
    this[nc]();
  }
  get specularFactor() {
    return (this[Ah](), this[ih].specularIntensity);
  }
  get specularTexture() {
    return (this[Ah](), this[ph].get(Hc.Specular));
  }
  get specularColorFactor() {
    return (this[Ah](), this[ih].specularColor.toArray());
  }
  get specularColorTexture() {
    return (this[Ah](), this[ph].get(Hc.SheenColor));
  }
  setSpecularFactor(e) {
    this[Ah]();
    for (const t of this[sc]) t.specularIntensity = e;
    this[nc]();
  }
  setSpecularColorFactor(e) {
    this[Ah]();
    const t = this.colorFromRgb(e);
    for (const i of this[sc]) i.specularColor.set(t);
    this[nc]();
  }
  get iridescenceFactor() {
    return (this[Ah](), this[ih].iridescence);
  }
  get iridescenceTexture() {
    return (this[Ah](), this[ph].get(Hc.Iridescence));
  }
  get iridescenceIor() {
    return (this[Ah](), this[ih].iridescenceIOR);
  }
  get iridescenceThicknessMinimum() {
    return (this[Ah](), this[ih].iridescenceThicknessRange[0]);
  }
  get iridescenceThicknessMaximum() {
    return (this[Ah](), this[ih].iridescenceThicknessRange[1]);
  }
  get iridescenceThicknessTexture() {
    return (this[Ah](), this[ph].get(Hc.IridescenceThickness));
  }
  setIridescenceFactor(e) {
    this[Ah]();
    for (const t of this[sc]) t.iridescence = e;
    this[nc]();
  }
  setIridescenceIor(e) {
    this[Ah]();
    for (const t of this[sc]) t.iridescenceIOR = e;
    this[nc]();
  }
  setIridescenceThicknessMinimum(e) {
    this[Ah]();
    for (const t of this[sc]) t.iridescenceThicknessRange[0] = e;
    this[nc]();
  }
  setIridescenceThicknessMaximum(e) {
    this[Ah]();
    for (const t of this[sc]) t.iridescenceThicknessRange[1] = e;
    this[nc]();
  }
  get anisotropyStrength() {
    return (this[Ah](), this[ih].anisotropy);
  }
  get anisotropyRotation() {
    return (this[Ah](), this[ih].anisotropyRotation);
  }
  get anisotropyTexture() {
    return (this[Ah](), this[ph].get(Hc.Anisotropy));
  }
  setAnisotropyStrength(e) {
    this[Ah]();
    for (const t of this[sc]) t.anisotropy = e;
    this[nc]();
  }
  setAnisotropyRotation(e) {
    this[Ah]();
    for (const t of this[sc]) t.anisotropyRotation = e;
    this[nc]();
  }
}
let bh = class {
  constructor(e) {
    ((this.name = ''), (this.children = new Array()), (this.name = e));
  }
};
class fh extends bh {
  constructor(e, t, i, s) {
    (super(e.name),
      (this.materials = new Map()),
      (this.variantToMaterialMap = new Map()),
      (this.initialMaterialIdx = 0),
      (this.activeMaterialIdx = 0),
      (this.mesh = e));
    const { gltf: n, threeGLTF: a, threeObjectMap: r } = s;
    ((this.parser = a.parser), (this.modelVariants = i), (this.mesh.userData.variantData = i));
    const o = r.get(e.material);
    null != o.materials
      ? (this.initialMaterialIdx = this.activeMaterialIdx = o.materials)
      : console.error(`Primitive (${e.name}) missing initial material reference.`);
    const A = e.userData.associations || {};
    if (null == A.meshes) return void console.error('Mesh is missing primitive index association');
    const l = ((n.meshes || [])[A.meshes].primitives || [])[A.primitives];
    if (null != l) {
      if (null != l.material) this.materials.set(l.material, t[l.material]);
      else {
        const e = t.findIndex(e => 'Default' === e.name);
        e >= 0 ? this.materials.set(e, t[e]) : console.warn('gltfPrimitive has no material!');
      }
      if (l.extensions && l.extensions.KHR_materials_variants) {
        const e = l.extensions.KHR_materials_variants,
          s = a.parser.json.extensions.KHR_materials_variants.variants;
        for (const n of e.mappings) {
          const e = t[n.material];
          this.materials.set(n.material, e);
          for (const t of n.variants) {
            const { name: n } = s[t];
            (this.variantToMaterialMap.set(t, e),
              e[hh].add(t),
              i.has(n) || i.set(n, { name: n, index: t }));
          }
        }
      }
    } else console.error('Mesh primitive definition is missing.');
  }
  async setActiveMaterial(e) {
    const t = this.materials.get(e);
    if (e !== this.activeMaterialIdx) {
      const i = t[sc],
        s = await t[oh]();
      ((this.mesh.material = null != s ? s : i.values().next().value),
        this.parser.assignFinalMaterial(this.mesh),
        i.add(this.mesh.material),
        (this.activeMaterialIdx = e));
    }
    return this.mesh.material;
  }
  getActiveMaterial() {
    return this.materials.get(this.activeMaterialIdx);
  }
  getMaterial(e) {
    return this.materials.get(e);
  }
  async enableVariant(e) {
    if (null == e) return this.setActiveMaterial(this.initialMaterialIdx);
    if (null != this.variantToMaterialMap && this.modelVariants.has(e)) {
      const t = this.modelVariants.get(e);
      return this.enableVariantHelper(t.index);
    }
    return null;
  }
  async enableVariantHelper(e) {
    if (null != this.variantToMaterialMap && null != e) {
      const t = this.variantToMaterialMap.get(e);
      if (null != t) return this.setActiveMaterial(t.index);
    }
    return null;
  }
  async instantiateVariants() {
    if (null != this.variantToMaterialMap)
      for (const e of this.variantToMaterialMap.keys()) {
        const t = this.mesh.userData.variantMaterials.get(e);
        if (null != t.material) continue;
        const i = await this.enableVariantHelper(e);
        null != i && (t.material = i);
      }
  }
  get variantInfo() {
    return this.variantToMaterialMap;
  }
  addVariant(e, t) {
    if (!this.ensureVariantIsUnused(t)) return !1;
    this.modelVariants.has(t) ||
      this.modelVariants.set(t, { name: t, index: this.modelVariants.size });
    const i = this.modelVariants.get(t).index;
    return (
      e[hh].add(i),
      this.variantToMaterialMap.set(i, e),
      this.materials.set(e.index, e),
      this.updateVariantUserData(i, e),
      !0
    );
  }
  deleteVariant(e) {
    if (this.variantInfo.has(e)) {
      this.variantInfo.delete(e);
      const t = this.mesh.userData.variantMaterials;
      null != t && t.delete(e);
    }
  }
  updateVariantUserData(e, t) {
    (t[hh].add(e),
      (this.mesh.userData.variantData = this.modelVariants),
      (this.mesh.userData.variantMaterials = this.mesh.userData.variantMaterials || new Map()));
    this.mesh.userData.variantMaterials.set(e, {
      material: t[sc].values().next().value,
      gltfMaterialIndex: t.index,
    });
  }
  ensureVariantIsUnused(e) {
    const t = this.modelVariants.get(e);
    return (
      null == t ||
      !this.variantInfo.has(t.index) ||
      (console.warn(`Primitive cannot add variant '${e}' for this material, it already exists.`),
      !1)
    );
  }
}
var Ih, Ch, Eh, Bh, yh, wh;
const Qh = Symbol('materials'),
  vh = Symbol('hierarchy'),
  xh = Symbol('roots'),
  Sh = Symbol('primitives'),
  Rh = Symbol('prepareVariantsForExport'),
  Mh = Symbol('switchVariant'),
  Th = Symbol('materialFromPoint'),
  Dh = Symbol('nodeFromPoint'),
  kh = Symbol('nodeFromIndex'),
  Fh = Symbol('variantData'),
  Lh = Symbol('availableVariants'),
  Uh = Symbol('modelOnUpdate'),
  Gh = Symbol('cloneMaterial');
class _h {
  constructor(e, t, i, s) {
    ((this.gltf = e), (this.gltfElementMap = t), (this.mapKey = i), (this.doLazyLoad = s));
  }
}
class Ph {
  constructor(e, t = () => {}) {
    ((this[Ih] = new Array()),
      (this[Ch] = new Array()),
      (this[Eh] = new Array()),
      (this[Bh] = new Array()),
      (this[yh] = () => {}),
      (this[wh] = new Map()),
      (this[Uh] = t));
    const { gltf: i, threeGLTF: s, gltfElementMap: n } = e;
    for (const [o, A] of i.materials.entries()) {
      const e = n.get(A);
      if (null != e) this[Qh].push(new mh(t, o, !0, this[Fh], e, A.name));
      else {
        const e = (i.materials || [])[o],
          a = new Set();
        n.set(e, a);
        const r = async () => {
          const e = await s.parser.getDependency('material', o);
          return (a.add(e), e);
        };
        this[Qh].push(new mh(t, o, !1, this[Fh], a, A.name, new _h(i, n, e, r)));
      }
    }
    const a = new Map(),
      r = new Array();
    for (const o of s.scene.children) r.push(o);
    for (; r.length > 0; ) {
      const t = r.pop();
      let i = null;
      t instanceof X
        ? ((i = new fh(t, this.materials, this[Fh], e)), this[Sh].push(i))
        : (i = new bh(t.name));
      const s = a.get(t);
      (null != s ? s.children.push(i) : this[xh].push(i), this[vh].push(i));
      for (const e of t.children) (r.push(e), a.set(t, i));
    }
  }
  get materials() {
    return this[Qh];
  }
  [((Ih = Qh), (Ch = vh), (Eh = xh), (Bh = Sh), (yh = Uh), (wh = Fh), Lh)]() {
    const e = Array.from(this[Fh].values());
    return (e.sort((e, t) => e.index - t.index), e.map(e => e.name));
  }
  getMaterialByName(e) {
    const t = this[Qh].filter(t => t.name === e);
    return t.length > 0 ? t[0] : null;
  }
  [kh](e, t) {
    const i = this[vh].find(i => {
      if (i instanceof fh) {
        const { meshes: s, primitives: n } = i.mesh.userData.associations;
        if (s == e && n == t) return !0;
      }
      return !1;
    });
    return null == i ? null : i;
  }
  [Dh](e) {
    return this[vh].find(t => {
      if (t instanceof fh) {
        if (t.mesh === e.object) return !0;
      }
      return !1;
    });
  }
  [Th](e) {
    return this[Dh](e).getActiveMaterial();
  }
  async [Mh](e) {
    for (const t of this[Sh]) await t.enableVariant(e);
    for (const t of this.materials) t[ch](!1);
    for (const t of this[Sh]) this.materials[t.getActiveMaterial().index][ch](!0);
  }
  async [Rh]() {
    const e = new Array();
    for (const t of this[Sh]) e.push(t.instantiateVariants());
    await Promise.all(e);
  }
  [Gh](e, t) {
    const i = this.materials[e];
    i.isLoaded ||
      console.error(
        "Cloning an unloaded material,\n           call 'material.ensureLoaded() before cloning the material."
      );
    const s = i[sc],
      n = new Set();
    for (const [r, o] of s.entries()) {
      const e = o.clone();
      ((e.name = t + (s.size > 1 ? '_inst' + r : '')), n.add(e));
    }
    const a = new mh(this[Uh], this[Qh].length, !1, this[Fh], n, t);
    return (this[Qh].push(a), a);
  }
  createMaterialInstanceForVariant(e, t, i, s = !0) {
    let n = null;
    for (const a of this[Sh]) {
      const s = this[Fh].get(i);
      (null != s && a.variantInfo.has(s.index)) ||
        (null != a.getMaterial(e) &&
          (this.hasVariant(i) || this.createVariant(i),
          null == n && (n = this[Gh](e, t)),
          a.addVariant(n, i)));
    }
    if (s && null != n) {
      (n[ch](!0), this.materials[e][ch](!1));
      for (const e of this[Sh]) e.enableVariant(i);
    }
    return n;
  }
  createVariant(e) {
    this[Fh].has(e)
      ? console.warn(`Variant '${e}'' already exists`)
      : this[Fh].set(e, { name: e, index: this[Fh].size });
  }
  hasVariant(e) {
    return this[Fh].has(e);
  }
  setMaterialToVariant(e, t) {
    if (null != this[Lh]().find(e => e === t))
      if (e < 0 || e >= this.materials.length)
        console.error('setMaterialToVariant(): materialIndex is out of bounds.');
      else
        for (const i of this[Sh]) {
          const s = i.getMaterial(e);
          null != s && i.addVariant(s, t);
        }
    else console.warn(`Can't add material to '${t}', the variant does not exist.'`);
  }
  updateVariantName(e, t) {
    const i = this[Fh].get(e);
    null != i && ((i.name = t), this[Fh].set(t, i), this[Fh].delete(e));
  }
  deleteVariant(e) {
    const t = this[Fh].get(e);
    if (null != t) {
      for (const i of this.materials) i.hasVariant(e) && i[hh].delete(t.index);
      for (const e of this[Sh]) e.deleteVariant(t.index);
      this[Fh].delete(e);
    }
  }
}
var Nh = function (e, t, i, s) {
  var n,
    a = arguments.length,
    r = a < 3 ? t : null === s ? (s = Object.getOwnPropertyDescriptor(t, i)) : s;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
    r = Reflect.decorate(e, t, i, s);
  else
    for (var o = e.length - 1; o >= 0; o--)
      (n = e[o]) && (r = (a < 3 ? n(r) : a > 3 ? n(t, i, r) : n(t, i)) || r);
  return (a > 3 && r && Object.defineProperty(t, i, r), r);
};
const Oh = Symbol('currentGLTF'),
  Hh = Symbol('originalGltfJson'),
  qh = Symbol('model'),
  jh = Symbol('getOnUpdateMethod'),
  zh = Symbol('buildTexture');
class Kh extends X {
  constructor() {
    (super(void 0, new Y({ depthWrite: !1 })),
      (this.height = 0),
      (this.radius = 0),
      (this.resolution = 0),
      (this.userData.noHit = !0));
  }
  get map() {
    return this.material.map;
  }
  set map(e) {
    this.material.map = e;
  }
  isUsable() {
    return this.height > 0 && this.radius > 0 && null != this.geometry && null != this.map;
  }
  updateGeometry(e = this.height, t = this.radius, i = 128) {
    (e == this.height && t == this.radius && i == this.resolution) ||
      ((this.height = e),
      (this.radius = t),
      (this.resolution = i),
      e > 0 &&
        t > 0 &&
        (this.geometry.dispose(),
        (this.geometry = (function (e, t, i) {
          const s = new St(t, 2 * i, i);
          s.scale(1, 1, -1);
          const n = s.getAttribute('position'),
            a = new S();
          for (let r = 0; r < n.count; ++r)
            if ((a.fromBufferAttribute(n, r), a.y < 0)) {
              const t = (3 * -e) / 2,
                i = a.y < t ? -e / a.y : 1 - (a.y * a.y) / (3 * t * t);
              (a.multiplyScalar(i), a.toArray(n.array, 3 * r));
            }
          return ((n.needsUpdate = !0), s);
        })(e, t, i))));
  }
}
const Vh = new S(),
  Jh = new S(),
  Yh = new S(),
  Wh = new ut(),
  $h = new Rt(),
  Xh = new M();
class Zh extends Wa {
  constructor(e) {
    (super(document.createElement('div')),
      (this.normal = new S(0, 1, 0)),
      (this.initialized = !1),
      (this.referenceCount = 1),
      (this.pivot = document.createElement('div')),
      (this.slot = document.createElement('slot')),
      this.element.classList.add('annotation-wrapper'),
      (this.slot.name = e.name),
      this.element.appendChild(this.pivot),
      this.pivot.appendChild(this.slot),
      this.updatePosition(e.position),
      this.updateNormal(e.normal),
      (this.surface = e.surface));
  }
  get facingCamera() {
    return !this.element.classList.contains('hide');
  }
  show() {
    (this.facingCamera && this.initialized) || this.updateVisibility(!0);
  }
  hide() {
    (!this.facingCamera && this.initialized) || this.updateVisibility(!1);
  }
  increment() {
    this.referenceCount++;
  }
  decrement() {
    return (this.referenceCount > 0 && --this.referenceCount, 0 === this.referenceCount);
  }
  updatePosition(e) {
    if (null == e) return;
    const t = co(e)[0].terms;
    for (let i = 0; i < 3; ++i) this.position.setComponent(i, Bo(t[i]).number);
    this.updateMatrixWorld();
  }
  updateNormal(e) {
    if (null == e) return;
    const t = co(e)[0].terms;
    for (let i = 0; i < 3; ++i) this.normal.setComponent(i, t[i].number);
  }
  updateSurface() {
    const { mesh: e, tri: t, bary: i } = this;
    if (null == e || null == t || null == i) return;
    (e.getVertexPosition(t.x, Vh),
      e.getVertexPosition(t.y, Jh),
      e.getVertexPosition(t.z, Yh),
      Vh.toArray(Wh.elements, 0),
      Jh.toArray(Wh.elements, 3),
      Yh.toArray(Wh.elements, 6),
      this.position.copy(i).applyMatrix3(Wh));
    const s = this.parent;
    (s.worldToLocal(e.localToWorld(this.position)),
      $h.set(Vh, Jh, Yh),
      $h.getNormal(this.normal).transformDirection(e.matrixWorld));
    const n = s.parent;
    (Xh.setFromAxisAngle(Vh.set(0, 1, 0), -n.rotation.y), this.normal.applyQuaternion(Xh));
  }
  orient(e) {
    this.pivot.style.transform = `rotate(${e}rad)`;
  }
  updateVisibility(e) {
    (this.element.classList.toggle('hide', !e),
      this.slot.assignedNodes().forEach(t => {
        if (t.nodeType !== Node.ELEMENT_NODE) return;
        const i = t,
          s = i.dataset.visibilityAttribute;
        if (null != s) {
          const t = `data-${s}`;
          i.toggleAttribute(t, e);
        }
        i.dispatchEvent(new CustomEvent('hotspot-visibility', { detail: { visible: e } }));
      }),
      (this.initialized = !0));
  }
}
const ed = {
    name: 'HorizontalBlurShader',
    uniforms: { tDiffuse: { value: null }, h: { value: 1 / 512 } },
    vertexShader:
      '\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvUv = uv;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n\t\t}',
    fragmentShader:
      '\n\n\t\tuniform sampler2D tDiffuse;\n\t\tuniform float h;\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvec4 sum = vec4( 0.0 );\n\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;\n\n\t\t\tgl_FragColor = sum;\n\n\t\t}',
  },
  td = {
    name: 'VerticalBlurShader',
    uniforms: { tDiffuse: { value: null }, v: { value: 1 / 512 } },
    vertexShader:
      '\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvUv = uv;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n\t\t}',
    fragmentShader:
      '\n\n\t\tuniform sampler2D tDiffuse;\n\t\tuniform float v;\n\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\n\t\t\tvec4 sum = vec4( 0.0 );\n\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;\n\t\t\tsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;\n\n\t\t\tgl_FragColor = sum;\n\n\t\t}',
  };
function id(e, t, i) {
  return (1 - i) * e + i * t;
}
class sd extends D {
  constructor(e, t, i) {
    (super(),
      (this.camera = new re()),
      (this.renderTarget = null),
      (this.renderTargetBlur = null),
      (this.depthMaterial = new Mt()),
      (this.horizontalBlurMaterial = new Bt(ed)),
      (this.verticalBlurMaterial = new Bt(td)),
      (this.intensity = 0),
      (this.softness = 1),
      (this.boundingBox = new fe()),
      (this.size = new S()),
      (this.maxDimension = 0),
      (this.isAnimated = !1),
      (this.needsUpdate = !1));
    const { camera: s } = this;
    ((s.rotation.x = Math.PI / 2),
      (s.left = -0.5),
      (s.right = 0.5),
      (s.bottom = -0.5),
      (s.top = 0.5),
      this.add(s));
    const n = new ht(),
      a = new Y({ opacity: 1, transparent: !0, side: ft });
    ((this.floor = new X(n, a)),
      (this.floor.userData.noHit = !0),
      s.add(this.floor),
      (this.blurPlane = new X(n)),
      (this.blurPlane.visible = !1),
      s.add(this.blurPlane),
      e.target.add(this),
      (this.depthMaterial.onBeforeCompile = function (e) {
        e.fragmentShader = e.fragmentShader.replace(
          'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
          'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * opacity );'
        );
      }),
      (this.depthMaterial.side = J),
      (this.horizontalBlurMaterial.depthTest = !1),
      (this.verticalBlurMaterial.depthTest = !1),
      this.setScene(e, t, i));
  }
  setScene(e, t, i) {
    const { boundingBox: s, size: n, rotation: a, position: r } = this;
    if (
      ((this.isAnimated = e.animationNames.length > 0),
      this.boundingBox.copy(e.boundingBox),
      this.size.copy(e.size),
      (this.maxDimension = Math.max(n.x, n.y, n.z) * (this.isAnimated ? 2 : 1)),
      this.boundingBox.getCenter(r),
      'back' === i)
    ) {
      const { min: e, max: t } = s;
      (([e.y, e.z] = [e.z, e.y]),
        ([t.y, t.z] = [t.z, t.y]),
        ([n.y, n.z] = [n.z, n.y]),
        (a.x = Math.PI / 2),
        (a.y = Math.PI));
    } else ((a.x = 0), (a.y = 0));
    if (this.isAnimated) {
      const e = s.min.y,
        t = s.max.y;
      ((n.y = this.maxDimension),
        s.expandByVector(n.subScalar(this.maxDimension).multiplyScalar(-0.5)),
        (s.min.y = e),
        (s.max.y = t),
        n.set(this.maxDimension, t - e, this.maxDimension));
    }
    ('bottom' === i ? (r.y = s.min.y) : (r.z = s.min.y), this.setSoftness(t));
  }
  setSoftness(e) {
    this.softness = e;
    const { size: t, camera: i } = this,
      s = this.isAnimated ? 2 : 1,
      n = s * Math.pow(2, 9 - 3 * e);
    this.setMapSize(n);
    const a = t.y / 2,
      r = t.y * s;
    ((i.near = 0),
      (i.far = id(r, a, e)),
      (this.depthMaterial.opacity = 1 / e),
      i.updateProjectionMatrix(),
      this.setIntensity(this.intensity),
      this.setOffset(0));
  }
  setMapSize(e) {
    const { size: t } = this;
    this.isAnimated && (e *= 2);
    const i = Math.floor(t.x > t.z ? e : (e * t.x) / t.z),
      s = Math.floor(t.x > t.z ? (e * t.z) / t.x : e),
      n = 10 + i,
      a = 10 + s;
    if (
      (null == this.renderTarget ||
        (this.renderTarget.width === n && this.renderTarget.height === a) ||
        (this.renderTarget.dispose(),
        (this.renderTarget = null),
        this.renderTargetBlur.dispose(),
        (this.renderTargetBlur = null)),
      null == this.renderTarget)
    ) {
      const e = { format: ze };
      ((this.renderTarget = new Qt(n, a, e)),
        (this.renderTargetBlur = new Qt(n, a, e)),
        (this.floor.material.map = this.renderTarget.texture));
    }
    (this.camera.scale.set(t.x * (1 + 10 / i), t.z * (1 + 10 / s), 1), (this.needsUpdate = !0));
  }
  setIntensity(e) {
    ((this.intensity = e),
      e > 0
        ? ((this.visible = !0),
          (this.floor.visible = !0),
          (this.floor.material.opacity = e * id(0.3, 1, this.softness * this.softness)))
        : ((this.visible = !1), (this.floor.visible = !1)));
  }
  getIntensity() {
    return this.intensity;
  }
  setOffset(e) {
    this.floor.position.z = -e + this.gap();
  }
  gap() {
    return 0.001 * this.maxDimension;
  }
  render(e, t) {
    t.overrideMaterial = this.depthMaterial;
    const i = e.getClearAlpha();
    (e.setClearAlpha(0), (this.floor.visible = !1));
    const s = e.xr.enabled;
    e.xr.enabled = !1;
    const n = e.getRenderTarget();
    (e.setRenderTarget(this.renderTarget),
      e.render(t, this.camera),
      (t.overrideMaterial = null),
      (this.floor.visible = !0),
      this.blurShadow(e),
      (e.xr.enabled = s),
      e.setRenderTarget(n),
      e.setClearAlpha(i));
  }
  blurShadow(e) {
    const {
      camera: t,
      horizontalBlurMaterial: i,
      verticalBlurMaterial: s,
      renderTarget: n,
      renderTargetBlur: a,
      blurPlane: r,
    } = this;
    ((r.visible = !0),
      (r.material = i),
      (i.uniforms.h.value = 1 / this.renderTarget.width),
      (i.uniforms.tDiffuse.value = this.renderTarget.texture),
      e.setRenderTarget(a),
      e.render(r, t),
      (r.material = s),
      (s.uniforms.v.value = 1 / this.renderTarget.height),
      (s.uniforms.tDiffuse.value = this.renderTargetBlur.texture),
      e.setRenderTarget(n),
      e.render(r, t),
      (r.visible = !1));
  }
  dispose() {
    (null != this.renderTarget && this.renderTarget.dispose(),
      null != this.renderTargetBlur && this.renderTargetBlur.dispose(),
      this.depthMaterial.dispose(),
      this.horizontalBlurMaterial.dispose(),
      this.verticalBlurMaterial.dispose(),
      this.floor.material.dispose(),
      this.floor.geometry.dispose(),
      this.blurPlane.geometry.dispose(),
      this.removeFromParent());
  }
}
const nd = new S(),
  ad = new S(),
  rd = new S(),
  od = new Tt(),
  Ad = new S(),
  ld = new y();
class cd extends ot {
  constructor({ canvas: e, element: t, width: i, height: s }) {
    (super(),
      (this.annotationRenderer = new ir()),
      (this.effectRenderer = null),
      (this.schemaElement = document.createElement('script')),
      (this.width = 1),
      (this.height = 1),
      (this.aspect = 1),
      (this.scaleStep = 0),
      (this.renderCount = 0),
      (this.externalRenderer = null),
      (this.appendedAnimations = []),
      (this.markedAnimations = []),
      (this.camera = new ne(45, 1, 0.1, 100)),
      (this.xrCamera = null),
      (this.url = null),
      (this.pivot = new D()),
      (this.target = new D()),
      (this.animationNames = []),
      (this.boundingBox = new fe()),
      (this.boundingSphere = new Ie()),
      (this.size = new S()),
      (this.idealAspect = 0),
      (this.framedFoVDeg = 0),
      (this.shadow = null),
      (this.shadowIntensity = 0),
      (this.shadowSoftness = 1),
      (this.bakedShadows = new Set()),
      (this.exposure = 1),
      (this.toneMapping = o),
      (this.canScale = !0),
      (this.isDirty = !1),
      (this.goalTarget = new S()),
      (this.targetDamperX = new so()),
      (this.targetDamperY = new so()),
      (this.targetDamperZ = new so()),
      (this._currentGLTF = null),
      (this._model = null),
      (this.cancelPendingSourceChange = null),
      (this.animationsByName = new Map()),
      (this.currentAnimationAction = null),
      (this.groundedSkybox = new Kh()),
      (this.name = 'ModelScene'),
      (this.element = t),
      (this.canvas = e),
      (this.camera = new ne(45, 1, 0.1, 100)),
      (this.camera.name = 'MainCamera'),
      this.add(this.pivot),
      (this.pivot.name = 'Pivot'),
      this.pivot.add(this.target),
      this.setSize(i, s),
      (this.target.name = 'Target'),
      (this.mixer = new Dt(this.target)));
    const { domElement: n } = this.annotationRenderer,
      { style: a } = n;
    ((a.display = 'none'),
      (a.pointerEvents = 'none'),
      (a.position = 'absolute'),
      (a.top = '0'),
      this.element.shadowRoot.querySelector('.default').appendChild(n),
      this.schemaElement.setAttribute('type', 'application/ld+json'));
  }
  get context() {
    return this.canvas.getContext('2d');
  }
  getCamera() {
    return null != this.xrCamera ? this.xrCamera : this.camera;
  }
  queueRender() {
    this.isDirty = !0;
  }
  shouldRender() {
    return this.isDirty;
  }
  hasRendered() {
    this.isDirty = !1;
  }
  forceRescale() {
    ((this.scaleStep = -1), this.queueRender());
  }
  async setObject(e) {
    (this.reset(), (this._model = e), this.target.add(e), await this.setupScene());
  }
  async setSource(e, t = () => {}) {
    if (!e || e === this.url) return void t(1);
    if ((this.reset(), (this.url = e), null != this.externalRenderer)) {
      const e = await this.externalRenderer.load(t);
      return (
        (this.boundingSphere.radius = e.framedRadius),
        void (this.idealAspect = e.fieldOfViewAspect)
      );
    }
    let i;
    null != this.cancelPendingSourceChange &&
      (this.cancelPendingSourceChange(), (this.cancelPendingSourceChange = null));
    try {
      i = await new Promise(async (i, s) => {
        this.cancelPendingSourceChange = () => s();
        try {
          i(await this.element[tg].loader.load(e, this.element, t));
        } catch (n) {
          s(n);
        }
      });
    } catch (r) {
      if (null == r) return;
      throw r;
    }
    ((this.cancelPendingSourceChange = null),
      this.reset(),
      (this.url = e),
      (this._currentGLTF = i),
      null != i && ((this._model = i.scene), this.target.add(i.scene)));
    const { animations: s } = i,
      n = new Map(),
      a = [];
    for (const o of s) (n.set(o.name, o), a.push(o.name));
    ((this.animations = s),
      (this.animationsByName = n),
      (this.animationNames = a),
      await this.setupScene());
  }
  async setupScene() {
    (this.applyTransform(),
      this.updateBoundingBox(),
      await this.updateFraming(),
      this.updateShadow(),
      this.setShadowIntensity(this.shadowIntensity),
      this.setGroundedSkybox());
  }
  reset() {
    ((this.url = null),
      (this.renderCount = 0),
      this.queueRender(),
      null != this.shadow && this.shadow.setIntensity(0),
      this.bakedShadows.clear());
    const { _model: e } = this;
    null != e && (e.removeFromParent(), (this._model = null));
    const t = this._currentGLTF;
    (null != t && (t.dispose(), (this._currentGLTF = null)),
      null != this.currentAnimationAction &&
        (this.currentAnimationAction.stop(), (this.currentAnimationAction = null)),
      this.mixer.stopAllAction(),
      this.mixer.uncacheRoot(this));
  }
  dispose() {
    (this.reset(),
      null != this.shadow && (this.shadow.dispose(), (this.shadow = null)),
      (this.element[Oh] = null),
      (this.element[Hh] = null),
      (this.element[qh] = null));
  }
  get currentGLTF() {
    return this._currentGLTF;
  }
  setSize(e, t) {
    if (this.width !== e || this.height !== t) {
      if (
        ((this.width = Math.max(e, 1)),
        (this.height = Math.max(t, 1)),
        this.annotationRenderer.setSize(e, t),
        (this.aspect = this.width / this.height),
        null != this.externalRenderer)
      ) {
        const i = window.devicePixelRatio;
        this.externalRenderer.resize(e * i, t * i);
      }
      this.queueRender();
    }
  }
  markBakedShadow(e) {
    ((e.userData.noHit = !0), this.bakedShadows.add(e));
  }
  unmarkBakedShadow(e) {
    ((e.userData.noHit = !1),
      (e.visible = !0),
      this.bakedShadows.delete(e),
      this.boundingBox.expandByObject(e));
  }
  findBakedShadows(e) {
    const t = new fe();
    e.traverse(e => {
      const i = e;
      if (!i.material) return;
      if (!i.material.transparent) return;
      t.setFromObject(i);
      const s = t.getSize(Ad),
        n = Math.min(s.x, s.y, s.z);
      Math.max(s.x, s.y, s.z) < 100 * n || this.markBakedShadow(i);
    });
  }
  checkBakedShadows() {
    const { min: e, max: t } = this.boundingBox,
      i = new fe();
    this.boundingBox.getSize(this.size);
    for (const s of this.bakedShadows)
      (i.setFromObject(s),
        (i.min.y < e.y + this.size.y / 100 &&
          i.min.x <= e.x &&
          i.max.x >= t.x &&
          i.min.z <= e.z &&
          i.max.z >= t.z) ||
          (i.min.z < e.z + this.size.z / 100 &&
            i.min.x <= e.x &&
            i.max.x >= t.x &&
            i.min.y <= e.y &&
            i.max.y >= t.y) ||
          this.unmarkBakedShadow(s));
  }
  applyTransform() {
    const { model: e } = this;
    if (null == e) return;
    const t = co(this.element.orientation)[0].terms,
      i = Bo(t[0]).number,
      s = Bo(t[1]).number,
      n = Bo(t[2]).number;
    e.quaternion.setFromEuler(new pt(s, n, i, 'YXZ'));
    const a = co(this.element.scale)[0].terms;
    e.scale.set(a[0].number, a[1].number, a[2].number);
  }
  updateBoundingBox() {
    const { model: e } = this;
    if (null == e) return;
    (this.target.remove(e), this.findBakedShadows(e));
    const t = (e, t) => e.expandByPoint(t);
    (this.setBakedShadowVisibility(!1),
      (this.boundingBox = sr(e, t, new fe())),
      this.boundingBox.isEmpty() &&
        (this.setBakedShadowVisibility(!0),
        this.bakedShadows.forEach(e => this.unmarkBakedShadow(e)),
        (this.boundingBox = sr(e, t, new fe()))),
      this.checkBakedShadows(),
      this.setBakedShadowVisibility(),
      this.boundingBox.getSize(this.size),
      this.target.add(e));
  }
  async updateFraming() {
    const { model: e } = this;
    if (null == e) return;
    (this.target.remove(e), this.setBakedShadowVisibility(!1));
    const { center: t } = this.boundingSphere;
    (this.element.requestUpdate('cameraTarget'),
      await this.element.updateComplete,
      t.copy(this.getTarget()));
    this.boundingSphere.radius = Math.sqrt(sr(e, (e, i) => Math.max(e, t.distanceToSquared(i)), 0));
    ((this.idealAspect =
      sr(
        e,
        (e, i) => {
          i.sub(t);
          const s = Math.sqrt(i.x * i.x + i.z * i.z);
          return Math.max(e, s / (this.idealCameraDistance() - Math.abs(i.y)));
        },
        0
      ) / Math.tan(((this.framedFoVDeg / 2) * Math.PI) / 180)),
      this.setBakedShadowVisibility(),
      this.target.add(e));
  }
  setBakedShadowVisibility(e = this.shadowIntensity <= 0) {
    for (const t of this.bakedShadows) t.visible = e;
  }
  idealCameraDistance() {
    const e = ((this.framedFoVDeg / 2) * Math.PI) / 180;
    return this.boundingSphere.radius / Math.sin(e);
  }
  adjustedFoV(e) {
    const t = Math.tan(((e / 2) * Math.PI) / 180) * Math.max(1, this.idealAspect / this.aspect);
    return (2 * Math.atan(t) * 180) / Math.PI;
  }
  getNDC(e, t) {
    if (null != this.xrCamera) ld.set(e / window.screen.width, t / window.screen.height);
    else {
      const i = this.element.getBoundingClientRect();
      ld.set((e - i.x) / this.width, (t - i.y) / this.height);
    }
    return (ld.multiplyScalar(2).subScalar(1), (ld.y *= -1), ld);
  }
  getSize() {
    return { width: this.width, height: this.height };
  }
  setEnvironmentAndSkybox(e, t) {
    this.element[tg].arRenderer.presentedScene !== this &&
      ((this.environment = e), this.setBackground(t), this.queueRender());
  }
  setBackground(e) {
    ((this.groundedSkybox.map = e),
      this.groundedSkybox.isUsable()
        ? (this.target.add(this.groundedSkybox), (this.background = null))
        : (this.target.remove(this.groundedSkybox), (this.background = e)));
  }
  farRadius() {
    return this.boundingSphere.radius * (null != this.groundedSkybox.parent ? 10 : 1);
  }
  setGroundedSkybox() {
    const e = co(this.element.skyboxHeight)[0].terms[0],
      t = Bo(e).number,
      i = 10 * this.boundingSphere.radius;
    (this.groundedSkybox.updateGeometry(t, i),
      (this.groundedSkybox.position.y = t - (this.shadow ? 2 * this.shadow.gap() : 0)),
      this.setBackground(this.groundedSkybox.map));
  }
  setTarget(e, t, i) {
    this.goalTarget.set(-e, -t, -i);
  }
  setTargetDamperDecayTime(e) {
    (this.targetDamperX.setDecayTime(e),
      this.targetDamperY.setDecayTime(e),
      this.targetDamperZ.setDecayTime(e));
  }
  getTarget() {
    return this.goalTarget.clone().multiplyScalar(-1);
  }
  getDynamicTarget() {
    return this.target.position.clone().multiplyScalar(-1);
  }
  jumpToGoal() {
    this.updateTarget(1e4);
  }
  updateTarget(e) {
    const t = this.goalTarget,
      i = this.target.position;
    if (t.equals(i)) return !1;
    {
      const s = this.boundingSphere.radius / 10;
      let { x: n, y: a, z: r } = i;
      return (
        (n = this.targetDamperX.update(n, t.x, e, s)),
        (a = this.targetDamperY.update(a, t.y, e, s)),
        (r = this.targetDamperZ.update(r, t.z, e, s)),
        (this.groundedSkybox.position.x = -n),
        (this.groundedSkybox.position.z = -r),
        this.target.position.set(n, a, r),
        this.target.updateMatrixWorld(),
        this.queueRender(),
        !0
      );
    }
  }
  pointTowards(e, t) {
    const { x: i, z: s } = this.position;
    this.yaw = Math.atan2(e - i, t - s);
  }
  get model() {
    return this._model;
  }
  set yaw(e) {
    ((this.pivot.rotation.y = e), (this.groundedSkybox.rotation.y = -e), this.queueRender());
  }
  get yaw() {
    return this.pivot.rotation.y;
  }
  set animationTime(e) {
    (this.mixer.setTime(e), this.queueShadowRender());
  }
  get animationTime() {
    if (null != this.currentAnimationAction) {
      const e = Math.max(this.currentAnimationAction._loopCount, 0);
      return this.currentAnimationAction.loop !== kt || 1 & ~e
        ? this.currentAnimationAction.time
        : this.duration - this.currentAnimationAction.time;
    }
    return 0;
  }
  set animationTimeScale(e) {
    this.mixer.timeScale = e;
  }
  get animationTimeScale() {
    return this.mixer.timeScale;
  }
  get duration() {
    return null != this.currentAnimationAction && this.currentAnimationAction.getClip()
      ? this.currentAnimationAction.getClip().duration
      : 0;
  }
  get hasActiveAnimation() {
    return null != this.currentAnimationAction;
  }
  playAnimation(e = null, t = 0, i = Ft, s = 1 / 0) {
    if (null == this._currentGLTF) return;
    const { animations: n } = this;
    if (null == n || 0 === n.length) return;
    let a = null;
    if (null != e && ((a = this.animationsByName.get(e)), null == a)) {
      const t = parseInt(e);
      !isNaN(t) && t >= 0 && t < n.length && (a = n[t]);
    }
    null == a && (a = n[0]);
    try {
      const { currentAnimationAction: e } = this,
        n = this.mixer.clipAction(a, this);
      (n.timeScale != this.element.timeScale && (n.timeScale = this.element.timeScale),
        (this.currentAnimationAction = n),
        this.element.paused
          ? this.mixer.stopAllAction()
          : ((n.paused = !1),
            null != e && n !== e
              ? n.crossFadeFrom(e, t, !1)
              : this.animationTimeScale > 0 &&
                this.animationTime == this.duration &&
                (this.animationTime = 0)),
        n.setLoop(i, s),
        (n.enabled = !0),
        (n.clampWhenFinished = !0),
        n.play());
    } catch (r) {
      console.error(r);
    }
  }
  appendAnimation(
    e = '',
    t = Ft,
    i = 1 / 0,
    s = 1,
    n = 1,
    a = !1,
    r = !1,
    o = !0,
    A = null,
    l = !1
  ) {
    if (null == this._currentGLTF || e === this.element.animationName) return;
    const { animations: c } = this;
    if (null == c || 0 === c.length) return;
    let h = null;
    if ((e && (h = this.animationsByName.get(e)), null != h)) {
      ('string' == typeof i
        ? isNaN(i)
          ? ((i = 1 / 0),
            console.warn('Invalid repetitionCount value, repetitionCount is set to Infinity'))
          : (i = Math.max(parseInt(i), 1))
        : 'number' == typeof i && i < 1 && (i = 1),
        1 === i && t !== Lt && (t = Lt),
        'string' == typeof s &&
          (isNaN(s)
            ? ((s = 1), console.warn('Invalid weight value, weight is set to 1'))
            : (s = parseFloat(s))),
        'string' == typeof n &&
          (isNaN(n)
            ? ((n = 1), console.warn('Invalid timeScale value, timeScale is set to 1'))
            : (n = parseFloat(n))),
        'string' == typeof a &&
          ('true' === a.toLowerCase().trim()
            ? (a = !0)
            : 'false' === a.toLowerCase().trim()
              ? (a = !1)
              : isNaN(a)
                ? ((a = !1), console.warn('Invalid fade value, fade is set to false'))
                : (a = parseFloat(a))),
        'string' == typeof r &&
          ('true' === r.toLowerCase().trim()
            ? (r = !0)
            : 'false' === r.toLowerCase().trim()
              ? (r = !1)
              : isNaN(r)
                ? ((r = !1), console.warn('Invalid warp value, warp is set to false'))
                : (r = parseFloat(r))),
        'string' == typeof A && (isNaN(A) || (A = parseFloat(A))));
      try {
        const c = this.mixer.existingAction(h) || this.mixer.clipAction(h, this),
          d = c.timeScale;
        (l &&
          this.appendedAnimations.includes(e) &&
          (this.markedAnimations.map(e => e.name).includes(e) ||
            this.markedAnimations.push({ name: e, loopMode: t, repetitionCount: i })),
          'number' == typeof A && (c.time = Math.min(Math.max(A, 0), h.duration)),
          'boolean' == typeof a && a
            ? c.fadeIn(1.25)
            : 'number' == typeof a
              ? c.fadeIn(Math.max(a, 0))
              : s >= 0 && (c.weight = Math.min(Math.max(s, 0), 1)),
          'boolean' == typeof r && r
            ? c.warp(o ? d : 0, n, 1.25)
            : 'number' == typeof r
              ? c.warp(o ? d : 0, n, Math.max(r, 0))
              : (c.timeScale = n),
          c.isRunning() ||
            (c.time == h.duration && c.stop(),
            c.setLoop(t, i),
            (c.paused = !1),
            (c.enabled = !0),
            (c.clampWhenFinished = !0),
            c.play()),
          this.appendedAnimations.includes(e) || this.element[Wd].appendedAnimations.push(e));
      } catch (d) {
        console.error(d);
      }
    }
  }
  detachAnimation(e = '', t = !0) {
    if (null == this._currentGLTF || e === this.element.animationName) return;
    const { animations: i } = this;
    if (null == i || 0 === i.length) return;
    let s = null;
    if ((e && (s = this.animationsByName.get(e)), null != s)) {
      'string' == typeof t &&
        ('true' === t.toLowerCase().trim()
          ? (t = !0)
          : 'false' === t.toLowerCase().trim()
            ? (t = !1)
            : isNaN(t)
              ? ((t = !0), console.warn('Invalid fade value, fade is set to true'))
              : (t = parseFloat(t)));
      try {
        const i = this.mixer.existingAction(s) || this.mixer.clipAction(s, this);
        'boolean' == typeof t && t
          ? i.fadeOut(1.5)
          : 'number' == typeof t
            ? i.fadeOut(Math.max(t, 0))
            : i.stop();
        const n = this.element[Wd].appendedAnimations.filter(t => t !== e);
        this.element[Wd].appendedAnimations = n;
      } catch (n) {
        console.error(n);
      }
    }
  }
  updateAnimationLoop(e = '', t = Ft, i = 1 / 0) {
    if (null == this._currentGLTF || e === this.element.animationName) return;
    const { animations: s } = this;
    if (null == s || 0 === s.length) return;
    let n = null;
    if ((e && (n = this.animationsByName.get(e)), null != n))
      try {
        const e = this.mixer.existingAction(n) || this.mixer.clipAction(n, this);
        (e.stop(), e.setLoop(t, i), e.play());
      } catch (a) {
        console.error(a);
      }
  }
  stopAnimation() {
    ((this.currentAnimationAction = null), this.mixer.stopAllAction());
  }
  updateAnimation(e) {
    (this.mixer.update(e), this.queueShadowRender());
  }
  subscribeMixerEvent(e, t) {
    this.mixer.addEventListener(e, t);
  }
  updateShadow() {
    const e = this.shadow;
    if (null != e) {
      const t = 'wall' === this.element.arPlacement ? 'back' : 'bottom';
      (e.setScene(this, this.shadowSoftness, t), (e.needsUpdate = !0));
    }
  }
  renderShadow(e) {
    const t = this.shadow;
    null != t && 1 == t.needsUpdate && (t.render(e, this), (t.needsUpdate = !1));
  }
  queueShadowRender() {
    null != this.shadow && (this.shadow.needsUpdate = !0);
  }
  setShadowIntensity(e) {
    if (
      ((this.shadowIntensity = e),
      null != this._currentGLTF &&
        (this.setBakedShadowVisibility(), !(e <= 0 && null == this.shadow)))
    ) {
      if (null == this.shadow) {
        const e = 'wall' === this.element.arPlacement ? 'back' : 'bottom';
        this.shadow = new sd(this, this.shadowSoftness, e);
      }
      this.shadow.setIntensity(e);
    }
  }
  setShadowSoftness(e) {
    this.shadowSoftness = e;
    const t = this.shadow;
    null != t && t.setSoftness(e);
  }
  setShadowOffset(e) {
    const t = this.shadow;
    null != t && t.setOffset(e);
  }
  getHit(e = this) {
    return od.intersectObject(e, !0).find(e => e.object.visible && !e.object.userData.noHit);
  }
  hitFromController(e, t = this) {
    return (od.setFromXRController(e), this.getHit(t));
  }
  hitFromPoint(e, t = this) {
    return (od.setFromCamera(e, this.getCamera()), this.getHit(t));
  }
  positionAndNormalFromPoint(e, t = this) {
    var i;
    const s = this.hitFromPoint(e, t);
    if (null == s) return null;
    return {
      position: s.point,
      normal:
        null != s.face
          ? s.face.normal.clone().applyNormalMatrix(new ut().getNormalMatrix(s.object.matrixWorld))
          : od.ray.direction.clone().multiplyScalar(-1),
      uv: null !== (i = s.uv) && void 0 !== i ? i : null,
    };
  }
  surfaceFromPoint(e, t = this) {
    const i = this.element.model;
    if (null == i) return null;
    const s = this.hitFromPoint(e, t);
    if (null == s || null == s.face) return null;
    const n = i[Dh](s),
      { meshes: a, primitives: r } = n.mesh.userData.associations,
      o = new S(),
      A = new S(),
      l = new S(),
      { a: c, b: h, c: d } = s.face,
      g = s.object;
    (g.getVertexPosition(c, o), g.getVertexPosition(h, A), g.getVertexPosition(d, l));
    const u = new Rt(o, A, l),
      p = new S();
    return (
      u.getBarycoord(g.worldToLocal(s.point), p),
      `${a} ${r} ${c} ${h} ${d} ${p.x.toFixed(3)} ${p.y.toFixed(3)} ${p.z.toFixed(3)}`
    );
  }
  addHotspot(e) {
    (this.target.add(e),
      this.annotationRenderer.domElement.appendChild(e.element),
      this.updateSurfaceHotspot(e));
  }
  removeHotspot(e) {
    this.target.remove(e);
  }
  forHotspots(e) {
    const { children: t } = this.target;
    for (let i = 0, s = t.length; i < s; i++) {
      const s = t[i];
      s instanceof Zh && e(s);
    }
  }
  updateSurfaceHotspot(e) {
    if (null == e.surface || null == this.element.model) return;
    const t = co(e.surface)[0].terms;
    if (8 != t.length) return void console.warn(e.surface + ' does not have exactly 8 numbers.');
    const i = this.element.model[kh](t[0].number, t[1].number);
    if (null == i)
      return void console.warn(
        e.surface + ' does not match a node/primitive in this glTF! Skipping this hotspot.'
      );
    const s = i.mesh.geometry.attributes.position.count,
      n = new S(t[2].number, t[3].number, t[4].number);
    if (n.x >= s || n.y >= s || n.z >= s)
      return void console.warn(
        e.surface + ' vertex indices out of range in this glTF! Skipping this hotspot.'
      );
    const a = new S(t[5].number, t[6].number, t[7].number);
    ((e.mesh = i.mesh), (e.tri = n), (e.bary = a), e.updateSurface());
  }
  animateSurfaceHotspots() {
    this.element.paused ||
      this.forHotspots(e => {
        e.updateSurface();
      });
  }
  updateHotspotsVisibility(e) {
    this.forHotspots(t => {
      (nd.copy(e),
        ad.setFromMatrixPosition(t.matrixWorld),
        nd.sub(ad),
        rd.copy(t.normal).transformDirection(this.target.matrixWorld),
        nd.dot(rd) < 0 ? t.hide() : t.show());
    });
  }
  orientHotspots(e) {
    this.forHotspots(t => {
      t.orient(e);
    });
  }
  setHotspotsVisibility(e) {
    this.forHotspots(t => {
      t.visible = e;
    });
  }
  updateSchema(e) {
    var t;
    const { schemaElement: i, element: s } = this,
      { alt: n, poster: a, iosSrc: r } = s;
    if (null != e) {
      const s = [
        {
          '@type': 'MediaObject',
          contentUrl: e,
          encodingFormat:
            'gltf' ===
            (null === (t = e.split('.').pop()) || void 0 === t ? void 0 : t.toLowerCase())
              ? 'model/gltf+json'
              : 'model/gltf-binary',
        },
      ];
      r && s.push({ '@type': 'MediaObject', contentUrl: r, encodingFormat: 'model/vnd.usdz+zip' });
      const o = {
        '@context': 'http://schema.org/',
        '@type': '3DModel',
        image: null != a ? a : void 0,
        name: null != n ? n : void 0,
        encoding: s,
      };
      ((i.textContent = JSON.stringify(o)), document.head.appendChild(i));
    } else null != i.parentElement && i.parentElement.removeChild(i);
  }
}
class hd extends EventTarget {
  constructor() {
    (super(...arguments), (this.ongoingActivities = new Set()), (this.totalProgress = 0));
  }
  get ongoingActivityCount() {
    return this.ongoingActivities.size;
  }
  beginActivity(e) {
    const t = { progress: 0, completed: !1 };
    return (
      this.ongoingActivities.add(t),
      1 === this.ongoingActivityCount && this.announceTotalProgress(t, 0, e),
      i => {
        let s;
        return (
          (s = Math.max(ls(i, 0, 1), t.progress)),
          s !== t.progress && this.announceTotalProgress(t, s, e),
          t.progress
        );
      }
    );
  }
  announceTotalProgress(e, t, i) {
    let s = 0,
      n = 0;
    1 == t && (e.completed = !0);
    for (const o of this.ongoingActivities) {
      const { progress: e } = o;
      ((s += 1 - e), o.completed && n++);
    }
    const a = e.progress;
    ((e.progress = t), (this.totalProgress += ((t - a) * (1 - this.totalProgress)) / s));
    const r = n === this.ongoingActivityCount ? 1 : this.totalProgress;
    (this.dispatchEvent(new CustomEvent('progress', { detail: { totalProgress: r, reason: i } })),
      n === this.ongoingActivityCount &&
        ((this.totalProgress = 0), this.ongoingActivities.clear()));
  }
}
var dd,
  gd,
  ud,
  pd,
  md,
  bd,
  fd,
  Id,
  Cd,
  Ed,
  Bd,
  yd,
  wd,
  Qd = function (e, t, i, s) {
    var n,
      a = arguments.length,
      r = a < 3 ? t : null === s ? (s = Object.getOwnPropertyDescriptor(t, i)) : s;
    if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
      r = Reflect.decorate(e, t, i, s);
    else
      for (var o = e.length - 1; o >= 0; o--)
        (n = e[o]) && (r = (a < 3 ? n(r) : a > 3 ? n(t, i, r) : n(t, i)) || r);
    return (a > 3 && r && Object.defineProperty(t, i, r), r);
  };
const vd = document.createElement('canvas'),
  xd = Symbol('fallbackResizeHandler'),
  Sd = Symbol('defaultAriaLabel'),
  Rd = Symbol('resizeObserver'),
  Md = Symbol('clearModelTimeout'),
  Td = Symbol('onContextLost'),
  Dd = Symbol('loaded'),
  kd = Symbol('status'),
  Fd = Symbol('onFocus'),
  Ld = Symbol('onBlur'),
  Ud = Symbol('updateSize'),
  Gd = Symbol('intersectionObserver'),
  _d = Symbol('isElementInViewport'),
  Pd = Symbol('announceModelVisibility'),
  Nd = Symbol('ariaLabel'),
  Od = Symbol('altDefaulted'),
  Hd = Symbol('statusElement'),
  qd = Symbol('updateStatus'),
  jd = Symbol('loadedTime'),
  zd = Symbol('updateSource'),
  Kd = Symbol('markLoaded'),
  Vd = Symbol('container'),
  Jd = Symbol('input'),
  Yd = Symbol('canvas'),
  Wd = Symbol('scene'),
  $d = Symbol('needsRender'),
  Xd = Symbol('tick'),
  Zd = Symbol('onModelLoad'),
  eg = Symbol('onResize'),
  tg = Symbol('renderer'),
  ig = Symbol('progressTracker'),
  sg = Symbol('getLoaded'),
  ng = Symbol('getModelIsVisible'),
  ag = Symbol('shouldAttemptPreload'),
  rg = e => ({
    x: e.x,
    y: e.y,
    z: e.z,
    toString() {
      return `${this.x}m ${this.y}m ${this.z}m`;
    },
  }),
  og = e => ({
    u: e.x,
    v: e.y,
    toString() {
      return `${this.u} ${this.v}`;
    },
  });
class Ag extends ii {
  static get is() {
    return 'model-viewer';
  }
  static set modelCacheSize(e) {
    Ya[Va].evictionThreshold = e;
  }
  static get modelCacheSize() {
    return Ya[Va].evictionThreshold;
  }
  static set minimumRenderScale(e) {
    (e > 1 &&
      console.warn('<model-viewer> minimumRenderScale has been clamped to a maximum value of 1.'),
      e <= 0 &&
        console.warn(
          '<model-viewer> minimumRenderScale has been clamped to a minimum value of 0.25.'
        ),
      (ic.singleton.minScale = e));
  }
  static get minimumRenderScale() {
    return ic.singleton.minScale;
  }
  get loaded() {
    return this[sg]();
  }
  get [((dd = _d),
  (gd = Dd),
  (ud = jd),
  (pd = kd),
  (md = Md),
  (bd = xd),
  (fd = Pd),
  (Id = Rd),
  (Cd = Gd),
  (Ed = ig),
  tg)]() {
    return ic.singleton;
  }
  get modelIsVisible() {
    return this[ng]();
  }
  constructor() {
    (super(),
      (this.alt = null),
      (this.src = null),
      (this.withCredentials = !1),
      (this.generateSchema = !1),
      (this[dd] = !1),
      (this[gd] = !1),
      (this[ud] = 0),
      (this[pd] = ''),
      (this[md] = null),
      (this[bd] = As(() => {
        const e = this.getBoundingClientRect();
        this[Ud](e);
      }, 50)),
      (this[fd] = As(e => {
        const t = this.modelIsVisible;
        t !== e &&
          this.dispatchEvent(new CustomEvent('model-visibility', { detail: { visible: t } }));
      }, 0)),
      (this[Id] = null),
      (this[Cd] = null),
      (this[Ed] = new hd()),
      (this[Bd] = () => {
        this[Hd].textContent = this[kd];
      }),
      (this[yd] = () => {
        this[Hd].textContent = '';
      }),
      (this[wd] = e => {
        this.dispatchEvent(
          new CustomEvent('error', {
            detail: { type: 'webglcontextlost', sourceError: e.sourceEvent },
          })
        );
      }),
      this.attachShadow({ mode: 'open' }));
    const e = this.shadowRoot;
    let t, i;
    if (
      ((e => {
        qi(ms, e);
      })(e),
      (this[Vd] = e.querySelector('.container')),
      (this[Jd] = e.querySelector('.userInput')),
      (this[Yd] = e.querySelector('canvas')),
      (this[Hd] = e.querySelector('#status')),
      (this[Sd] = this[Jd].getAttribute('aria-label')),
      this.isConnected)
    ) {
      const e = this.getBoundingClientRect();
      ((t = e.width), (i = e.height));
    } else ((t = 300), (i = 150));
    ((this[Wd] = new cd({ canvas: this[Yd], element: this, width: t, height: i })),
      Promise.resolve().then(() => {
        this[Ud](this.getBoundingClientRect());
      }),
      Yi &&
        (this[Rd] = new ResizeObserver(e => {
          if (!this[tg].isPresenting) for (let t of e) t.target === this && this[Ud](t.contentRect);
        })),
      Wi
        ? (this[Gd] = new IntersectionObserver(
            e => {
              for (let t of e)
                if (t.target === this) {
                  const e = this.modelIsVisible;
                  ((this[_d] = t.isIntersecting),
                    this[Pd](e),
                    this[_d] && !this.loaded && this[zd]());
                }
            },
            { root: null, rootMargin: '0px', threshold: 1e-5 }
          ))
        : (this[_d] = !0));
  }
  connectedCallback() {
    (super.connectedCallback && super.connectedCallback(),
      Yi ? this[Rd].observe(this) : self.addEventListener('resize', this[xd]),
      Wi && this[Gd].observe(this),
      this.addEventListener('focus', this[Fd]),
      this.addEventListener('blur', this[Ld]));
    const e = this[tg];
    (e.addEventListener('contextlost', this[Td]),
      e.registerScene(this[Wd]),
      null != this[Md] &&
        (self.clearTimeout(this[Md]), (this[Md] = null), this.requestUpdate('src', null)));
  }
  disconnectedCallback() {
    (super.disconnectedCallback && super.disconnectedCallback(),
      Yi ? this[Rd].unobserve(this) : self.removeEventListener('resize', this[xd]),
      Wi && this[Gd].unobserve(this),
      this.removeEventListener('focus', this[Fd]),
      this.removeEventListener('blur', this[Ld]));
    const e = this[tg];
    (e.removeEventListener('contextlost', this[Td]),
      e.unregisterScene(this[Wd]),
      (this[Md] = self.setTimeout(() => {
        (this[Wd].dispose(), (this[Md] = null));
      }, 10)));
  }
  updated(e) {
    (super.updated(e),
      e.has('src') &&
        (null == this.src
          ? ((this[Dd] = !1), (this[jd] = 0), this[Wd].reset())
          : this.src !== this[Wd].url && ((this[Dd] = !1), (this[jd] = 0), this[zd]())),
      e.has('alt') && this[Jd].setAttribute('aria-label', this[Nd]),
      e.has('generateSchema') &&
        (this.generateSchema ? this[Wd].updateSchema(this.src) : this[Wd].updateSchema(null)));
  }
  toDataURL(e, t) {
    return this[tg].displayCanvas(this[Wd]).toDataURL(e, t);
  }
  async toBlob(e) {
    const t = e ? e.mimeType : void 0,
      i = e ? e.qualityArgument : void 0,
      s = e ? e.idealAspect : void 0,
      { width: n, height: a, idealAspect: r, aspect: o } = this[Wd],
      { dpr: A, scaleFactor: l } = this[tg];
    let c = n * l * A,
      h = a * l * A,
      d = 0,
      g = 0;
    if (!0 === s)
      if (r > o) {
        const e = h;
        ((h = Math.round(c / r)), (g = (e - h) / 2));
      } else {
        const e = c;
        ((c = Math.round(h * r)), (d = (e - c) / 2));
      }
    ((vd.width = c), (vd.height = h));
    try {
      return new Promise(async (e, s) => {
        (vd.getContext('2d').drawImage(this[tg].displayCanvas(this[Wd]), d, g, c, h, 0, 0, c, h),
          vd.toBlob(
            t => {
              if (!t) return s(new Error('Unable to retrieve canvas blob'));
              e(t);
            },
            t,
            i
          ));
      });
    } finally {
      this[Ud]({ width: n, height: a });
    }
  }
  registerEffectComposer(e) {
    (e.setRenderer(this[tg].threeRenderer),
      e.setMainCamera(this[Wd].getCamera()),
      e.setMainScene(this[Wd]),
      (this[Wd].effectRenderer = e));
  }
  unregisterEffectComposer() {
    this[Wd].effectRenderer = null;
  }
  registerRenderer(e) {
    this[Wd].externalRenderer = e;
  }
  unregisterRenderer() {
    this[Wd].externalRenderer = null;
  }
  get [Nd]() {
    return this[Od];
  }
  get [Od]() {
    return null == this.alt || 'null' === this.alt ? this[Sd] : this.alt;
  }
  [sg]() {
    return this[Dd];
  }
  [ng]() {
    return this.loaded && this[_d];
  }
  [ag]() {
    return !!this.src && this[_d];
  }
  [Ud]({ width: e, height: t }) {
    0 !== e &&
      0 !== t &&
      ((this[Vd].style.width = `${e}px`),
      (this[Vd].style.height = `${t}px`),
      this[eg]({ width: e, height: t }));
  }
  [Xd](e, t) {
    var i;
    null === (i = this[Wd].effectRenderer) || void 0 === i || i.beforeRender(e, t);
  }
  [Kd]() {
    this[Dd] || ((this[Dd] = !0), (this[jd] = performance.now()));
  }
  [$d]() {
    this[Wd].queueRender();
  }
  [Zd]() {}
  [qd](e) {
    this[kd] = e;
    const t = this.getRootNode();
    null != t &&
      t.activeElement === this &&
      this[Hd].textContent != e &&
      (this[Hd].textContent = e);
  }
  [((Bd = Fd), (yd = Ld), eg)](e) {
    this[Wd].setSize(e.width, e.height);
  }
  async [((wd = Td), zd)]() {
    const e = this[Wd];
    if (this.loaded || !this[ag]() || this.src === e.url) return;
    (this.generateSchema && e.updateSchema(this.src), this[qd]('Loading'), e.stopAnimation());
    const t = this[ig].beginActivity('model-load'),
      i = this.src;
    try {
      const s = e.setSource(i, e => t(0.95 * ls(e, 0, 1))),
        n = this[us]();
      (await Promise.all([s, n]),
        this[Kd](),
        this[Zd](),
        this.updateComplete.then(() => {
          this.dispatchEvent(new CustomEvent('before-render'));
        }),
        await new Promise(e => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              (this.dispatchEvent(new CustomEvent('load', { detail: { url: i } })), e());
            });
          });
        }));
    } catch (s) {
      this.dispatchEvent(
        new CustomEvent('error', { detail: { type: 'loadfailure', sourceError: s } })
      );
    } finally {
      t(1);
    }
  }
}
(Qd([ai({ type: String })], Ag.prototype, 'alt', void 0),
  Qd([ai({ type: String })], Ag.prototype, 'src', void 0),
  Qd(
    [ai({ type: Boolean, attribute: 'with-credentials' })],
    Ag.prototype,
    'withCredentials',
    void 0
  ),
  Qd(
    [ai({ type: Boolean, attribute: 'generate-schema' })],
    Ag.prototype,
    'generateSchema',
    void 0
  ));
var lg = function (e, t, i, s) {
  var n,
    a = arguments.length,
    r = a < 3 ? t : null === s ? (s = Object.getOwnPropertyDescriptor(t, i)) : s;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
    r = Reflect.decorate(e, t, i, s);
  else
    for (var o = e.length - 1; o >= 0; o--)
      (n = e[o]) && (r = (a < 3 ? n(r) : a > 3 ? n(t, i, r) : n(t, i)) || r);
  return (a > 3 && r && Object.defineProperty(t, i, r), r);
};
const cg = Symbol('changeAnimation'),
  hg = Symbol('appendAnimation'),
  dg = Symbol('detachAnimation'),
  gg = Symbol('paused'),
  ug = { repetitions: 1 / 0, pingpong: !1 },
  pg = {
    pingpong: !1,
    repetitions: null,
    weight: 1,
    timeScale: 1,
    fade: !1,
    warp: !1,
    relativeWarp: !0,
    time: null,
  },
  mg = { fade: !0 },
  bg = Symbol('hotspotMap'),
  fg = Symbol('mutationCallback'),
  Ig = Symbol('observer'),
  Cg = Symbol('addHotspot'),
  Eg = Symbol('removeHotspot'),
  Bg = new x();
var yg = Uint8Array,
  wg = Uint16Array,
  Qg = Int32Array,
  vg = new yg([
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0,
  ]),
  xg = new yg([
    0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13,
    13, 0, 0,
  ]),
  Sg = new yg([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
  Rg = function (e, t) {
    for (var i = new wg(31), s = 0; s < 31; ++s) i[s] = t += 1 << e[s - 1];
    var n = new Qg(i[30]);
    for (s = 1; s < 30; ++s) for (var a = i[s]; a < i[s + 1]; ++a) n[a] = ((a - i[s]) << 5) | s;
    return { b: i, r: n };
  },
  Mg = Rg(vg, 2),
  Tg = Mg.b,
  Dg = Mg.r;
((Tg[28] = 258), (Dg[258] = 28));
for (var kg = Rg(xg, 0).r, Fg = new wg(32768), Lg = 0; Lg < 32768; ++Lg) {
  var Ug = ((43690 & Lg) >> 1) | ((21845 & Lg) << 1);
  ((Ug = ((61680 & (Ug = ((52428 & Ug) >> 2) | ((13107 & Ug) << 2))) >> 4) | ((3855 & Ug) << 4)),
    (Fg[Lg] = (((65280 & Ug) >> 8) | ((255 & Ug) << 8)) >> 1));
}
var Gg = function (e, t, i) {
    for (var s = e.length, n = 0, a = new wg(t); n < s; ++n) e[n] && ++a[e[n] - 1];
    var r,
      o = new wg(t);
    for (n = 1; n < t; ++n) o[n] = (o[n - 1] + a[n - 1]) << 1;
    if (i) {
      r = new wg(1 << t);
      var A = 15 - t;
      for (n = 0; n < s; ++n)
        if (e[n])
          for (
            var l = (n << 4) | e[n], c = t - e[n], h = o[e[n] - 1]++ << c, d = h | ((1 << c) - 1);
            h <= d;
            ++h
          )
            r[Fg[h] >> A] = l;
    } else for (r = new wg(s), n = 0; n < s; ++n) e[n] && (r[n] = Fg[o[e[n] - 1]++] >> (15 - e[n]));
    return r;
  },
  _g = new yg(288);
for (Lg = 0; Lg < 144; ++Lg) _g[Lg] = 8;
for (Lg = 144; Lg < 256; ++Lg) _g[Lg] = 9;
for (Lg = 256; Lg < 280; ++Lg) _g[Lg] = 7;
for (Lg = 280; Lg < 288; ++Lg) _g[Lg] = 8;
var Pg = new yg(32);
for (Lg = 0; Lg < 32; ++Lg) Pg[Lg] = 5;
var Ng = Gg(_g, 9, 0),
  Og = Gg(Pg, 5, 0),
  Hg = function (e) {
    return ((e + 7) / 8) | 0;
  },
  qg = function (e, t, i) {
    return ((null == i || i > e.length) && (i = e.length), new yg(e.subarray(t, i)));
  },
  jg = [
    'unexpected EOF',
    'invalid block type',
    'invalid length/literal',
    'invalid distance',
    'stream finished',
    'no stream handler',
    ,
    'no callback',
    'invalid UTF-8 data',
    'extra field too long',
    'date not in range 1980-2099',
    'filename too long',
    'stream finishing',
    'invalid zip data',
  ],
  zg = function (e, t, i) {
    var s = new Error(t || jg[e]);
    if (((s.code = e), Error.captureStackTrace && Error.captureStackTrace(s, zg), !i)) throw s;
    return s;
  },
  Kg = function (e, t, i) {
    i <<= 7 & t;
    var s = (t / 8) | 0;
    ((e[s] |= i), (e[s + 1] |= i >> 8));
  },
  Vg = function (e, t, i) {
    i <<= 7 & t;
    var s = (t / 8) | 0;
    ((e[s] |= i), (e[s + 1] |= i >> 8), (e[s + 2] |= i >> 16));
  },
  Jg = function (e, t) {
    for (var i = [], s = 0; s < e.length; ++s) e[s] && i.push({ s: s, f: e[s] });
    var n = i.length,
      a = i.slice();
    if (!n) return { t: tu, l: 0 };
    if (1 == n) {
      var r = new yg(i[0].s + 1);
      return ((r[i[0].s] = 1), { t: r, l: 1 });
    }
    (i.sort(function (e, t) {
      return e.f - t.f;
    }),
      i.push({ s: -1, f: 25001 }));
    var o = i[0],
      A = i[1],
      l = 0,
      c = 1,
      h = 2;
    for (i[0] = { s: -1, f: o.f + A.f, l: o, r: A }; c != n - 1; )
      ((o = i[i[l].f < i[h].f ? l++ : h++]),
        (A = i[l != c && i[l].f < i[h].f ? l++ : h++]),
        (i[c++] = { s: -1, f: o.f + A.f, l: o, r: A }));
    var d = a[0].s;
    for (s = 1; s < n; ++s) a[s].s > d && (d = a[s].s);
    var g = new wg(d + 1),
      u = Yg(i[c - 1], g, 0);
    if (u > t) {
      s = 0;
      var p = 0,
        m = u - t,
        b = 1 << m;
      for (
        a.sort(function (e, t) {
          return g[t.s] - g[e.s] || e.f - t.f;
        });
        s < n;
        ++s
      ) {
        var f = a[s].s;
        if (!(g[f] > t)) break;
        ((p += b - (1 << (u - g[f]))), (g[f] = t));
      }
      for (p >>= m; p > 0; ) {
        var I = a[s].s;
        g[I] < t ? (p -= 1 << (t - g[I]++ - 1)) : ++s;
      }
      for (; s >= 0 && p; --s) {
        var C = a[s].s;
        g[C] == t && (--g[C], ++p);
      }
      u = t;
    }
    return { t: new yg(g), l: u };
  },
  Yg = function (e, t, i) {
    return -1 == e.s ? Math.max(Yg(e.l, t, i + 1), Yg(e.r, t, i + 1)) : (t[e.s] = i);
  },
  Wg = function (e) {
    for (var t = e.length; t && !e[--t]; );
    for (
      var i = new wg(++t),
        s = 0,
        n = e[0],
        a = 1,
        r = function (e) {
          i[s++] = e;
        },
        o = 1;
      o <= t;
      ++o
    )
      if (e[o] == n && o != t) ++a;
      else {
        if (!n && a > 2) {
          for (; a > 138; a -= 138) r(32754);
          a > 2 && (r(a > 10 ? ((a - 11) << 5) | 28690 : ((a - 3) << 5) | 12305), (a = 0));
        } else if (a > 3) {
          for (r(n), --a; a > 6; a -= 6) r(8304);
          a > 2 && (r(((a - 3) << 5) | 8208), (a = 0));
        }
        for (; a--; ) r(n);
        ((a = 1), (n = e[o]));
      }
    return { c: i.subarray(0, s), n: t };
  },
  $g = function (e, t) {
    for (var i = 0, s = 0; s < t.length; ++s) i += e[s] * t[s];
    return i;
  },
  Xg = function (e, t, i) {
    var s = i.length,
      n = Hg(t + 2);
    ((e[n] = 255 & s), (e[n + 1] = s >> 8), (e[n + 2] = 255 ^ e[n]), (e[n + 3] = 255 ^ e[n + 1]));
    for (var a = 0; a < s; ++a) e[n + a + 4] = i[a];
    return 8 * (n + 4 + s);
  },
  Zg = function (e, t, i, s, n, a, r, o, A, l, c) {
    (Kg(t, c++, i), ++n[256]);
    for (
      var h = Jg(n, 15),
        d = h.t,
        g = h.l,
        u = Jg(a, 15),
        p = u.t,
        m = u.l,
        b = Wg(d),
        f = b.c,
        I = b.n,
        C = Wg(p),
        E = C.c,
        B = C.n,
        y = new wg(19),
        w = 0;
      w < f.length;
      ++w
    )
      ++y[31 & f[w]];
    for (w = 0; w < E.length; ++w) ++y[31 & E[w]];
    for (var Q = Jg(y, 7), v = Q.t, x = Q.l, S = 19; S > 4 && !v[Sg[S - 1]]; --S);
    var R,
      M,
      T,
      D,
      k = (l + 5) << 3,
      F = $g(n, _g) + $g(a, Pg) + r,
      L = $g(n, d) + $g(a, p) + r + 14 + 3 * S + $g(y, v) + 2 * y[16] + 3 * y[17] + 7 * y[18];
    if (A >= 0 && k <= F && k <= L) return Xg(t, c, e.subarray(A, A + l));
    if ((Kg(t, c, 1 + (L < F)), (c += 2), L < F)) {
      ((R = Gg(d, g, 0)), (M = d), (T = Gg(p, m, 0)), (D = p));
      var U = Gg(v, x, 0);
      (Kg(t, c, I - 257), Kg(t, c + 5, B - 1), Kg(t, c + 10, S - 4), (c += 14));
      for (w = 0; w < S; ++w) Kg(t, c + 3 * w, v[Sg[w]]);
      c += 3 * S;
      for (var G = [f, E], _ = 0; _ < 2; ++_) {
        var P = G[_];
        for (w = 0; w < P.length; ++w) {
          var N = 31 & P[w];
          (Kg(t, c, U[N]), (c += v[N]), N > 15 && (Kg(t, c, (P[w] >> 5) & 127), (c += P[w] >> 12)));
        }
      }
    } else ((R = Ng), (M = _g), (T = Og), (D = Pg));
    for (w = 0; w < o; ++w) {
      var O = s[w];
      if (O > 255) {
        (Vg(t, c, R[(N = (O >> 18) & 31) + 257]),
          (c += M[N + 257]),
          N > 7 && (Kg(t, c, (O >> 23) & 31), (c += vg[N])));
        var H = 31 & O;
        (Vg(t, c, T[H]), (c += D[H]), H > 3 && (Vg(t, c, (O >> 5) & 8191), (c += xg[H])));
      } else (Vg(t, c, R[O]), (c += M[O]));
    }
    return (Vg(t, c, R[256]), c + M[256]);
  },
  eu = new Qg([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]),
  tu = new yg(0),
  iu = (function () {
    for (var e = new Int32Array(256), t = 0; t < 256; ++t) {
      for (var i = t, s = 9; --s; ) i = (1 & i && -306674912) ^ (i >>> 1);
      e[t] = i;
    }
    return e;
  })(),
  su = function () {
    var e = -1;
    return {
      p: function (t) {
        for (var i = e, s = 0; s < t.length; ++s) i = iu[(255 & i) ^ t[s]] ^ (i >>> 8);
        e = i;
      },
      d: function () {
        return ~e;
      },
    };
  },
  nu = function (e, t, i, s, n) {
    if (!n && ((n = { l: 1 }), t.dictionary)) {
      var a = t.dictionary.subarray(-32768),
        r = new yg(a.length + e.length);
      (r.set(a), r.set(e, a.length), (e = r), (n.w = a.length));
    }
    return (function (e, t, i, s, n, a) {
      var r = a.z || e.length,
        o = new yg(s + r + 5 * (1 + Math.ceil(r / 7e3)) + n),
        A = o.subarray(s, o.length - n),
        l = a.l,
        c = 7 & (a.r || 0);
      if (t) {
        c && (A[0] = a.r >> 3);
        for (
          var h = eu[t - 1],
            d = h >> 13,
            g = 8191 & h,
            u = (1 << i) - 1,
            p = a.p || new wg(32768),
            m = a.h || new wg(u + 1),
            b = Math.ceil(i / 3),
            f = 2 * b,
            I = function (t) {
              return (e[t] ^ (e[t + 1] << b) ^ (e[t + 2] << f)) & u;
            },
            C = new Qg(25e3),
            E = new wg(288),
            B = new wg(32),
            y = 0,
            w = 0,
            Q = a.i || 0,
            v = 0,
            x = a.w || 0,
            S = 0;
          Q + 2 < r;
          ++Q
        ) {
          var R = I(Q),
            M = 32767 & Q,
            T = m[R];
          if (((p[M] = T), (m[R] = M), x <= Q)) {
            var D = r - Q;
            if ((y > 7e3 || v > 24576) && (D > 423 || !l)) {
              ((c = Zg(e, A, 0, C, E, B, w, v, S, Q - S, c)), (v = y = w = 0), (S = Q));
              for (var k = 0; k < 286; ++k) E[k] = 0;
              for (k = 0; k < 30; ++k) B[k] = 0;
            }
            var F = 2,
              L = 0,
              U = g,
              G = (M - T) & 32767;
            if (D > 2 && R == I(Q - G))
              for (
                var _ = Math.min(d, D) - 1, P = Math.min(32767, Q), N = Math.min(258, D);
                G <= P && --U && M != T;
              ) {
                if (e[Q + F] == e[Q + F - G]) {
                  for (var O = 0; O < N && e[Q + O] == e[Q + O - G]; ++O);
                  if (O > F) {
                    if (((F = O), (L = G), O > _)) break;
                    var H = Math.min(G, O - 2),
                      q = 0;
                    for (k = 0; k < H; ++k) {
                      var j = (Q - G + k) & 32767,
                        z = (j - p[j]) & 32767;
                      z > q && ((q = z), (T = j));
                    }
                  }
                }
                G += ((M = T) - (T = p[M])) & 32767;
              }
            if (L) {
              C[v++] = 268435456 | (Dg[F] << 18) | kg[L];
              var K = 31 & Dg[F],
                V = 31 & kg[L];
              ((w += vg[K] + xg[V]), ++E[257 + K], ++B[V], (x = Q + F), ++y);
            } else ((C[v++] = e[Q]), ++E[e[Q]]);
          }
        }
        for (Q = Math.max(Q, x); Q < r; ++Q) ((C[v++] = e[Q]), ++E[e[Q]]);
        ((c = Zg(e, A, l, C, E, B, w, v, S, Q - S, c)),
          l ||
            ((a.r = (7 & c) | (A[(c / 8) | 0] << 3)),
            (c -= 7),
            (a.h = m),
            (a.p = p),
            (a.i = Q),
            (a.w = x)));
      } else {
        for (Q = a.w || 0; Q < r + l; Q += 65535) {
          var J = Q + 65535;
          (J >= r && ((A[(c / 8) | 0] = l), (J = r)), (c = Xg(A, c + 1, e.subarray(Q, J))));
        }
        a.i = r;
      }
      return qg(o, 0, s + Hg(c) + n);
    })(
      e,
      null == t.level ? 6 : t.level,
      null == t.mem
        ? n.l
          ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(e.length))))
          : 20
        : 12 + t.mem,
      i,
      s,
      n
    );
  },
  au = function (e, t) {
    var i = {};
    for (var s in e) i[s] = e[s];
    for (var s in t) i[s] = t[s];
    return i;
  },
  ru = function (e, t, i) {
    for (; i; ++t) ((e[t] = i), (i >>>= 8));
  };
function ou(e, t) {
  return nu(e, t || {}, 0, 0);
}
var Au = function (e, t, i, s) {
    for (var n in e) {
      var a = e[n],
        r = t + n,
        o = s;
      (Array.isArray(a) && ((o = au(s, a[1])), (a = a[0])),
        a instanceof yg ? (i[r] = [a, o]) : ((i[(r += '/')] = [new yg(0), o]), Au(a, r, i, s)));
    }
  },
  lu = 'undefined' != typeof TextEncoder && new TextEncoder(),
  cu = 'undefined' != typeof TextDecoder && new TextDecoder();
try {
  cu.decode(tu, { stream: !0 });
} catch (Qp) {}
function hu(e, t) {
  if (lu) return lu.encode(e);
  for (
    var i = e.length,
      s = new yg(e.length + (e.length >> 1)),
      n = 0,
      a = function (e) {
        s[n++] = e;
      },
      r = 0;
    r < i;
    ++r
  ) {
    if (n + 5 > s.length) {
      var o = new yg(n + 8 + ((i - r) << 1));
      (o.set(s), (s = o));
    }
    var A = e.charCodeAt(r);
    A < 128 || t
      ? a(A)
      : A < 2048
        ? (a(192 | (A >> 6)), a(128 | (63 & A)))
        : A > 55295 && A < 57344
          ? (a(240 | ((A = (65536 + (1047552 & A)) | (1023 & e.charCodeAt(++r))) >> 18)),
            a(128 | ((A >> 12) & 63)),
            a(128 | ((A >> 6) & 63)),
            a(128 | (63 & A)))
          : (a(224 | (A >> 12)), a(128 | ((A >> 6) & 63)), a(128 | (63 & A)));
  }
  return qg(s, 0, n);
}
var du = function (e) {
    var t = 0;
    if (e)
      for (var i in e) {
        var s = e[i].length;
        (s > 65535 && zg(9), (t += s + 4));
      }
    return t;
  },
  gu = function (e, t, i, s, n, a, r, o) {
    var A = s.length,
      l = i.extra,
      c = o && o.length,
      h = du(l);
    (ru(e, t, null != r ? 33639248 : 67324752),
      (t += 4),
      null != r && ((e[t++] = 20), (e[t++] = i.os)),
      (e[t] = 20),
      (t += 2),
      (e[t++] = (i.flag << 1) | (a < 0 && 8)),
      (e[t++] = n && 8),
      (e[t++] = 255 & i.compression),
      (e[t++] = i.compression >> 8));
    var d = new Date(null == i.mtime ? Date.now() : i.mtime),
      g = d.getFullYear() - 1980;
    if (
      ((g < 0 || g > 119) && zg(10),
      ru(
        e,
        t,
        (g << 25) |
          ((d.getMonth() + 1) << 21) |
          (d.getDate() << 16) |
          (d.getHours() << 11) |
          (d.getMinutes() << 5) |
          (d.getSeconds() >> 1)
      ),
      (t += 4),
      -1 != a && (ru(e, t, i.crc), ru(e, t + 4, a < 0 ? -a - 2 : a), ru(e, t + 8, i.size)),
      ru(e, t + 12, A),
      ru(e, t + 14, h),
      (t += 16),
      null != r && (ru(e, t, c), ru(e, t + 6, i.attrs), ru(e, t + 10, r), (t += 14)),
      e.set(s, t),
      (t += A),
      h)
    )
      for (var u in l) {
        var p = l[u],
          m = p.length;
        (ru(e, t, +u), ru(e, t + 2, m), e.set(p, t + 4), (t += 4 + m));
      }
    return (c && (e.set(o, t), (t += c)), t);
  };
function uu(e, t) {
  t || (t = {});
  var i = {},
    s = [];
  Au(e, '', i, t);
  var n = 0,
    a = 0;
  for (var r in i) {
    var o = i[r],
      A = o[0],
      l = o[1],
      c = 0 == l.level ? 0 : 8,
      h = (y = hu(r)).length,
      d = l.comment,
      g = d && hu(d),
      u = g && g.length,
      p = du(l.extra);
    h > 65535 && zg(11);
    var m = c ? ou(A, l) : A,
      b = m.length,
      f = su();
    (f.p(A),
      s.push(
        au(l, {
          size: A.length,
          crc: f.d(),
          c: m,
          f: y,
          m: g,
          u: h != r.length || (g && d.length != u),
          o: n,
          compression: c,
        })
      ),
      (n += 30 + h + p + b),
      (a += 76 + 2 * (h + p) + (u || 0) + b));
  }
  for (var I = new yg(a + 22), C = n, E = a - n, B = 0; B < s.length; ++B) {
    var y = s[B];
    gu(I, y.o, y, y.f, y.u, y.c.length);
    var w = 30 + y.f.length + du(y.extra);
    (I.set(y.c, y.o + w),
      gu(I, n, y, y.f, y.u, y.c.length, y.o, y.m),
      (n += 16 + w + (y.m ? y.m.length : 0)));
  }
  return (
    (function (e, t, i, s, n) {
      (ru(e, t, 101010256), ru(e, t + 8, i), ru(e, t + 10, i), ru(e, t + 12, s), ru(e, t + 16, n));
    })(I, n, s.length, E, C),
    I
  );
}
class pu {
  constructor(e, t = '', i = [], s = []) {
    ((this.name = e),
      (this.type = t),
      (this.metadata = i),
      (this.properties = s),
      (this.children = []));
  }
  addMetadata(e, t) {
    this.metadata.push({ key: e, value: t });
  }
  addProperty(e, t = []) {
    this.properties.push({ property: e, metadata: t });
  }
  addChild(e) {
    this.children.push(e);
  }
  toString(e = 0) {
    const t = '\t'.repeat(e),
      i = this.metadata.map(e => {
        const i = e.key,
          s = e.value;
        if (Array.isArray(s)) {
          const e = [];
          return (
            e.push(`${i} = {`),
            s.forEach(i => {
              e.push(`${t}\t\t${i}`);
            }),
            e.push(`${t}\t}`),
            e.join('\n')
          );
        }
        return `${i} = ${s}`;
      }),
      s = i.length ? ` (\n${i.map(e => `${t}\t${e}`).join('\n')}\n${t})` : '',
      n = this.properties.map(e => {
        const i = e.property,
          s = e.metadata.length
            ? ` (\n${e.metadata.map(e => `${t}\t\t${e}`).join('\n')}\n${t}\t)`
            : '';
        return `${t}\t${i}${s}`;
      }),
      a = this.children.map(t => t.toString(e + 1)),
      r = [];
    if ((n.length > 0 && r.push(...n), a.length > 0)) {
      n.length > 0 && r.push('');
      for (let e = 0; e < a.length; e++) (r.push(a[e]), e < a.length - 1 && r.push(''));
    }
    const o = r.join('\n'),
      A = this.type ? this.type + ' ' : '';
    return `${t}def ${A}"${this.name}"${s}\n${t}{\n${o}\n${t}}`;
  }
}
class mu {
  constructor() {
    this.textureUtils = null;
  }
  setTextureUtils(e) {
    this.textureUtils = e;
  }
  parse(e, t, i, s) {
    this.parseAsync(e, s).then(t).catch(i);
  }
  async parseAsync(e, t = {}) {
    t = Object.assign(
      {
        ar: { anchoring: { type: 'plane' }, planeAnchoring: { alignment: 'horizontal' } },
        includeAnchoringProperties: !0,
        onlyVisible: !0,
        quickLookCompatible: !1,
        maxTextureSize: 1024,
      },
      t
    );
    const i = new Set(),
      s = {},
      n = 'model.usda';
    s[n] = null;
    const a = new pu('Root', 'Xform'),
      r = new pu('Scenes', 'Scope');
    (r.addMetadata('kind', '"sceneLibrary"'), a.addChild(r));
    const o = 'Scene',
      A = new pu(o, 'Xform');
    let l;
    (A.addMetadata('customData', [
      'bool preliminary_collidesWithEnvironment = 0',
      `string sceneName = "${o}"`,
    ]),
      A.addMetadata('sceneName', `"${o}"`),
      t.includeAnchoringProperties &&
        (A.addProperty(`token preliminary:anchoring:type = "${t.ar.anchoring.type}"`),
        A.addProperty(
          `token preliminary:planeAnchoring:alignment = "${t.ar.planeAnchoring.alignment}"`
        )),
      r.addChild(A));
    const c = {},
      h = {};
    Eu(e, A, c, i, s, t);
    const d = (function (e, t, i = !1) {
      const s = new pu('Materials');
      for (const n in e) {
        const a = e[n];
        s.addChild(Ru(a, t, i));
      }
      return s;
    })(c, h, t.quickLookCompatible);
    ((l = Cu() + '\n' + a.toString() + '\n\n' + d.toString()), (s[n] = hu(l)), (l = null));
    for (const u in h) {
      let e = h[u];
      if (!0 === e.isCompressedTexture) {
        if (null === this.textureUtils)
          throw new Error(
            'THREE.USDZExporter: setTextureUtils() must be called to process compressed textures.'
          );
        e = await this.textureUtils.decompress(e);
      }
      const i = fu(e.image, e.flipY, t.maxTextureSize),
        n = await new Promise(e => i.toBlob(e, 'image/png', 1));
      s[`textures/Texture_${u}.png`] = new Uint8Array(await n.arrayBuffer());
    }
    let g = 0;
    for (const u in s) {
      const e = s[u];
      g += 34 + u.length;
      const t = 63 & g;
      if (4 !== t) {
        const i = new Uint8Array(64 - t);
        s[u] = [e, { extra: { 12345: i } }];
      }
      g = e.length;
    }
    return uu(s, { level: 0 });
  }
}
function bu(e, t) {
  let i = e.name;
  return (
    (i = i.replace(/[^A-Za-z0-9_]/g, '')),
    /^[0-9]/.test(i) && (i = '_' + i),
    '' === i && (i = e.isCamera ? 'Camera' : 'Object'),
    t.has(i) && (i = i + '_' + e.id),
    t.add(i),
    i
  );
}
function fu(e, t, i) {
  if (
    ('undefined' != typeof HTMLImageElement && e instanceof HTMLImageElement) ||
    ('undefined' != typeof HTMLCanvasElement && e instanceof HTMLCanvasElement) ||
    ('undefined' != typeof OffscreenCanvas && e instanceof OffscreenCanvas) ||
    ('undefined' != typeof ImageBitmap && e instanceof ImageBitmap)
  ) {
    const s = i / Math.max(e.width, e.height),
      n = document.createElement('canvas');
    ((n.width = e.width * Math.min(1, s)), (n.height = e.height * Math.min(1, s)));
    const a = n.getContext('2d');
    return (
      !0 === t && (a.translate(0, n.height), a.scale(1, -1)),
      a.drawImage(e, 0, 0, n.width, n.height),
      n
    );
  }
  throw new Error('THREE.USDZExporter: No valid image data found. Unable to process texture.');
}
const Iu = 7;
function Cu() {
  return '#usda 1.0\n(\n\tcustomLayerData = {\n\t\tstring creator = "Three.js USDZExporter"\n\t}\n\tdefaultPrim = "Root"\n\tmetersPerUnit = 1\n\tupAxis = "Y"\n)\n';
}
function Eu(e, t, i, s, n, a) {
  for (let r = 0, o = e.children.length; r < o; r++) {
    const o = e.children[r];
    if (!1 === o.visible && !0 === a.onlyVisible) continue;
    let A;
    if (o.isMesh) {
      const e = o.geometry,
        t = o.material;
      if (t.isMeshStandardMaterial) {
        const a = 'geometries/Geometry_' + e.id + '.usda';
        if (!(a in n)) {
          const t = vu(e);
          n[a] = hu(Cu() + '\n' + t.toString());
        }
        (t.uuid in i || (i[t.uuid] = t), (A = yu(o, e, i[t.uuid], s)));
      } else
        console.warn(
          'THREE.USDZExporter: Unsupported material type (USDZ only supports MeshStandardMaterial)',
          o
        );
    } else A = o.isCamera ? Du(o, s) : Bu(o, s);
    A && (t.addChild(A), Eu(o, A, i, s, n, a));
  }
}
function Bu(e, t) {
  const i = bu(e, t),
    s = wu(e.matrix);
  e.matrix.determinant() < 0 &&
    console.warn('THREE.USDZExporter: USDZ does not support negative scales', e);
  const n = new pu(i, 'Xform');
  return (
    n.addProperty(`matrix4d xformOp:transform = ${s}`),
    n.addProperty('uniform token[] xformOpOrder = ["xformOp:transform"]'),
    n
  );
}
function yu(e, t, i, s) {
  const n = Bu(e, s);
  return (
    n.addMetadata('prepend references', `@./geometries/Geometry_${t.id}.usda@</Geometry>`),
    n.addMetadata('prepend apiSchemas', '["MaterialBindingAPI"]'),
    n.addProperty(`rel material:binding = </Materials/Material_${i.id}>`),
    n
  );
}
function wu(e) {
  const t = e.elements;
  return `( ${Qu(t, 0)}, ${Qu(t, 4)}, ${Qu(t, 8)}, ${Qu(t, 12)} )`;
}
function Qu(e, t) {
  return `(${e[t + 0]}, ${e[t + 1]}, ${e[t + 2]}, ${e[t + 3]})`;
}
function vu(e) {
  const t = new pu('Geometry'),
    i = (function (e) {
      const t = 'Geometry',
        i = e.attributes,
        s = i.position.count,
        n = new pu(t, 'Mesh');
      (n.addProperty(
        `int[] faceVertexCounts = [${(function (e) {
          const t = null !== e.index ? e.index.count : e.attributes.position.count;
          return Array(t / 3)
            .fill(3)
            .join(', ');
        })(e)}]`
      ),
        n.addProperty(
          `int[] faceVertexIndices = [${(function (e) {
            const t = e.index,
              i = [];
            if (null !== t) for (let s = 0; s < t.count; s++) i.push(t.getX(s));
            else {
              const t = e.attributes.position.count;
              for (let e = 0; e < t; e++) i.push(e);
            }
            return i.join(', ');
          })(e)}]`
        ),
        n.addProperty(`normal3f[] normals = [${xu(i.normal, s)}]`, ['interpolation = "vertex"']),
        n.addProperty(`point3f[] points = [${xu(i.position, s)}]`));
      for (let r = 0; r < 4; r++) {
        const e = r > 0 ? r : '',
          t = i['uv' + e];
        void 0 !== t &&
          n.addProperty(`texCoord2f[] primvars:st${e} = [${Su(t)}]`, ['interpolation = "vertex"']);
      }
      const a = i.color;
      void 0 !== a &&
        n.addProperty(`color3f[] primvars:displayColor = [${xu(a, s)}]`, [
          'interpolation = "vertex"',
        ]);
      return (n.addProperty('uniform token subdivisionScheme = "none"'), n);
    })(e);
  return (t.addChild(i), t);
}
function xu(e, t) {
  if (void 0 === e)
    return (console.warn('USDZExporter: Normals missing.'), Array(t).fill('(0, 0, 0)').join(', '));
  const i = [];
  for (let s = 0; s < e.count; s++) {
    const t = e.getX(s),
      n = e.getY(s),
      a = e.getZ(s);
    i.push(`(${t.toPrecision(Iu)}, ${n.toPrecision(Iu)}, ${a.toPrecision(Iu)})`);
  }
  return i.join(', ');
}
function Su(e) {
  const t = [];
  for (let i = 0; i < e.count; i++) {
    const s = e.getX(i),
      n = e.getY(i);
    t.push(`(${s.toPrecision(Iu)}, ${1 - n.toPrecision(Iu)})`);
  }
  return t.join(', ');
}
function Ru(e, t, i = !1) {
  const s = new pu(`Material_${e.id}`, 'Material');
  function n(s, n, a) {
    const r = s.source.id + '_' + s.flipY;
    t[r] = s;
    const o = s.channel > 0 ? 'st' + s.channel : 'st',
      A = { 1e3: 'repeat', 1001: 'clamp', 1002: 'mirror' },
      l = s.repeat.clone(),
      c = s.offset.clone(),
      h = s.rotation,
      d = Math.sin(h),
      g = Math.cos(h);
    ((c.y = 1 - c.y - l.y),
      i
        ? ((c.x = c.x / l.x), (c.y = c.y / l.y), (c.x += d / l.x), (c.y += g - 1))
        : ((c.x += d * l.x), (c.y += (1 - g) * l.y)));
    const u = new pu(`PrimvarReader_${n}`, 'Shader');
    (u.addProperty('uniform token info:id = "UsdPrimvarReader_float2"'),
      u.addProperty('float2 inputs:fallback = (0.0, 0.0)'),
      u.addProperty(`string inputs:varname = "${o}"`),
      u.addProperty('float2 outputs:result'));
    const p = new pu(`Transform2d_${n}`, 'Shader');
    (p.addProperty('uniform token info:id = "UsdTransform2d"'),
      p.addProperty(
        `float2 inputs:in.connect = </Materials/Material_${e.id}/PrimvarReader_${n}.outputs:result>`
      ),
      p.addProperty(`float inputs:rotation = ${(h * (180 / Math.PI)).toFixed(Iu)}`),
      p.addProperty(`float2 inputs:scale = ${Tu(l)}`),
      p.addProperty(`float2 inputs:translation = ${Tu(c)}`),
      p.addProperty('float2 outputs:result'));
    const m = new pu(`Texture_${s.id}_${n}`, 'Shader');
    return (
      m.addProperty('uniform token info:id = "UsdUVTexture"'),
      m.addProperty(`asset inputs:file = @textures/Texture_${r}.png@`),
      m.addProperty(
        `float2 inputs:st.connect = </Materials/Material_${e.id}/Transform2d_${n}.outputs:result>`
      ),
      void 0 !== a &&
        m.addProperty(
          `float4 inputs:scale = ${(function (e) {
            return `(${e.r}, ${e.g}, ${e.b}, 1.0)`;
          })(a)}`
        ),
      'normal' === n &&
        (m.addProperty('float4 inputs:scale = (2, 2, 2, 1)'),
        m.addProperty('float4 inputs:bias = (-1, -1, -1, 0)')),
      m.addProperty(`token inputs:sourceColorSpace = "${s.colorSpace === ye ? 'raw' : 'sRGB'}"`),
      m.addProperty(`token inputs:wrapS = "${A[s.wrapS]}"`),
      m.addProperty(`token inputs:wrapT = "${A[s.wrapT]}"`),
      m.addProperty('float outputs:r'),
      m.addProperty('float outputs:g'),
      m.addProperty('float outputs:b'),
      m.addProperty('float3 outputs:rgb'),
      (e.transparent || e.alphaTest > 0) && m.addProperty('float outputs:a'),
      [u, p, m]
    );
  }
  e.side === J &&
    console.warn('THREE.USDZExporter: USDZ does not support double sided materials', e);
  const a = new pu('PreviewSurface', 'Shader');
  if ((a.addProperty('uniform token info:id = "UsdPreviewSurface"'), null !== e.map)) {
    (a.addProperty(
      `color3f inputs:diffuseColor.connect = </Materials/Material_${e.id}/Texture_${e.map.id}_diffuse.outputs:rgb>`
    ),
      e.transparent
        ? a.addProperty(
            `float inputs:opacity.connect = </Materials/Material_${e.id}/Texture_${e.map.id}_diffuse.outputs:a>`
          )
        : e.alphaTest > 0 &&
          (a.addProperty(
            `float inputs:opacity.connect = </Materials/Material_${e.id}/Texture_${e.map.id}_diffuse.outputs:a>`
          ),
          a.addProperty(`float inputs:opacityThreshold = ${e.alphaTest}`)));
    n(e.map, 'diffuse', e.color).forEach(e => s.addChild(e));
  } else a.addProperty(`color3f inputs:diffuseColor = ${Mu(e.color)}`);
  if (null !== e.emissiveMap) {
    a.addProperty(
      `color3f inputs:emissiveColor.connect = </Materials/Material_${e.id}/Texture_${e.emissiveMap.id}_emissive.outputs:rgb>`
    );
    const t = new p(
      e.emissive.r * e.emissiveIntensity,
      e.emissive.g * e.emissiveIntensity,
      e.emissive.b * e.emissiveIntensity
    );
    n(e.emissiveMap, 'emissive', t).forEach(e => s.addChild(e));
  } else
    e.emissive.getHex() > 0 && a.addProperty(`color3f inputs:emissiveColor = ${Mu(e.emissive)}`);
  if (null !== e.normalMap) {
    a.addProperty(
      `normal3f inputs:normal.connect = </Materials/Material_${e.id}/Texture_${e.normalMap.id}_normal.outputs:rgb>`
    );
    n(e.normalMap, 'normal').forEach(e => s.addChild(e));
  }
  if (null !== e.aoMap) {
    a.addProperty(
      `float inputs:occlusion.connect = </Materials/Material_${e.id}/Texture_${e.aoMap.id}_occlusion.outputs:r>`
    );
    const t = new p(e.aoMapIntensity, e.aoMapIntensity, e.aoMapIntensity);
    n(e.aoMap, 'occlusion', t).forEach(e => s.addChild(e));
  }
  if (null !== e.roughnessMap) {
    a.addProperty(
      `float inputs:roughness.connect = </Materials/Material_${e.id}/Texture_${e.roughnessMap.id}_roughness.outputs:g>`
    );
    const t = new p(e.roughness, e.roughness, e.roughness);
    n(e.roughnessMap, 'roughness', t).forEach(e => s.addChild(e));
  } else a.addProperty(`float inputs:roughness = ${e.roughness}`);
  if (null !== e.metalnessMap) {
    a.addProperty(
      `float inputs:metallic.connect = </Materials/Material_${e.id}/Texture_${e.metalnessMap.id}_metallic.outputs:b>`
    );
    const t = new p(e.metalness, e.metalness, e.metalness);
    n(e.metalnessMap, 'metallic', t).forEach(e => s.addChild(e));
  } else a.addProperty(`float inputs:metallic = ${e.metalness}`);
  if (null !== e.alphaMap) {
    (a.addProperty(
      `float inputs:opacity.connect = </Materials/Material_${e.id}/Texture_${e.alphaMap.id}_opacity.outputs:r>`
    ),
      a.addProperty('float inputs:opacityThreshold = 0.0001'));
    n(e.alphaMap, 'opacity').forEach(e => s.addChild(e));
  } else a.addProperty(`float inputs:opacity = ${e.opacity}`);
  if (e.isMeshPhysicalMaterial) {
    if (null !== e.clearcoatMap) {
      a.addProperty(
        `float inputs:clearcoat.connect = </Materials/Material_${e.id}/Texture_${e.clearcoatMap.id}_clearcoat.outputs:r>`
      );
      const t = new p(e.clearcoat, e.clearcoat, e.clearcoat);
      n(e.clearcoatMap, 'clearcoat', t).forEach(e => s.addChild(e));
    } else a.addProperty(`float inputs:clearcoat = ${e.clearcoat}`);
    if (null !== e.clearcoatRoughnessMap) {
      a.addProperty(
        `float inputs:clearcoatRoughness.connect = </Materials/Material_${e.id}/Texture_${e.clearcoatRoughnessMap.id}_clearcoatRoughness.outputs:g>`
      );
      const t = new p(e.clearcoatRoughness, e.clearcoatRoughness, e.clearcoatRoughness);
      n(e.clearcoatRoughnessMap, 'clearcoatRoughness', t).forEach(e => s.addChild(e));
    } else a.addProperty(`float inputs:clearcoatRoughness = ${e.clearcoatRoughness}`);
    a.addProperty(`float inputs:ior = ${e.ior}`);
  }
  return (
    a.addProperty('int inputs:useSpecularWorkflow = 0'),
    a.addProperty('token outputs:surface'),
    s.addChild(a),
    s.addProperty(
      `token outputs:surface.connect = </Materials/Material_${e.id}/PreviewSurface.outputs:surface>`
    ),
    s
  );
}
function Mu(e) {
  return `(${e.r}, ${e.g}, ${e.b})`;
}
function Tu(e) {
  return `(${e.x}, ${e.y})`;
}
function Du(e, t) {
  const i = bu(e, t),
    s = wu(e.matrix);
  e.matrix.determinant() < 0 &&
    console.warn('THREE.USDZExporter: USDZ does not support negative scales', e);
  const n = new pu(i, 'Camera');
  (n.addProperty(`matrix4d xformOp:transform = ${s}`),
    n.addProperty('uniform token[] xformOpOrder = ["xformOp:transform"]'));
  const a = e.isOrthographicCamera ? 'orthographic' : 'perspective';
  n.addProperty(`token projection = "${a}"`);
  const r = `(${e.near.toPrecision(Iu)}, ${e.far.toPrecision(Iu)})`;
  let o, A;
  if (
    (n.addProperty(`float2 clippingRange = ${r}`),
    (o = e.isOrthographicCamera
      ? (10 * (Math.abs(e.left) + Math.abs(e.right))).toPrecision(Iu)
      : e.getFilmWidth().toPrecision(Iu)),
    n.addProperty(`float horizontalAperture = ${o}`),
    (A = e.isOrthographicCamera
      ? (10 * (Math.abs(e.top) + Math.abs(e.bottom))).toPrecision(Iu)
      : e.getFilmHeight().toPrecision(Iu)),
    n.addProperty(`float verticalAperture = ${A}`),
    e.isPerspectiveCamera)
  ) {
    const t = e.getFocalLength().toPrecision(Iu);
    n.addProperty(`float focalLength = ${t}`);
    const i = e.focus.toPrecision(Iu);
    n.addProperty(`float focusDistance = ${i}`);
  }
  return n;
}
var ku = function (e, t, i, s) {
  var n,
    a = arguments.length,
    r = a < 3 ? t : null === s ? (s = Object.getOwnPropertyDescriptor(t, i)) : s;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
    r = Reflect.decorate(e, t, i, s);
  else
    for (var o = e.length - 1; o >= 0; o--)
      (n = e[o]) && (r = (a < 3 ? n(r) : a > 3 ? n(t, i, r) : n(t, i)) || r);
  return (a > 3 && r && Object.defineProperty(t, i, r), r);
};
let Fu = !1,
  Lu = !1;
const Uu = '#model-viewer-no-ar-fallback',
  Gu =
    ((_u = ['quick-look', 'scene-viewer', 'webxr', 'none']),
    e => {
      try {
        const t = co(e),
          i = (t.length ? t[0].terms : [])
            .filter(e => e && 'ident' === e.type)
            .map(e => e.value)
            .filter(e => _u.indexOf(e) > -1);
        return new Set(i);
      } catch (t) {}
      return new Set();
    });
var _u;
const Pu = 'quick-look',
  Nu = 'scene-viewer',
  Ou = 'webxr',
  Hu = 'none',
  qu = Symbol('arButtonContainer'),
  ju = Symbol('enterARWithWebXR'),
  zu = Symbol('openSceneViewer'),
  Ku = Symbol('openIOSARQuickLook'),
  Vu = Symbol('canActivateAR'),
  Ju = Symbol('arMode'),
  Yu = Symbol('arModes'),
  Wu = Symbol('arAnchor'),
  $u = Symbol('preload'),
  Xu = Symbol('onARButtonContainerClick'),
  Zu = Symbol('onARStatus'),
  ep = Symbol('onARTracking'),
  tp = Symbol('onARTap'),
  ip = Symbol('selectARMode'),
  sp = Symbol('triggerLoad');
var np = function (e, t, i, s) {
  var n,
    a = arguments.length,
    r = a < 3 ? t : null === s ? (s = Object.getOwnPropertyDescriptor(t, i)) : s;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
    r = Reflect.decorate(e, t, i, s);
  else
    for (var o = e.length - 1; o >= 0; o--)
      (n = e[o]) && (r = (a < 3 ? n(r) : a > 3 ? n(t, i, r) : n(t, i)) || r);
  return (a > 3 && r && Object.defineProperty(t, i, r), r);
};
const ap = 'auto',
  rp = 'auto',
  op = 'eager',
  Ap = Symbol('defaultProgressBarElement'),
  lp = Symbol('posterContainerElement'),
  cp = Symbol('defaultPosterElement'),
  hp = Symbol('shouldDismissPoster'),
  dp = Symbol('hidePoster'),
  gp = Symbol('modelIsRevealed'),
  up = Symbol('updateProgressBar'),
  pp = Symbol('ariaLabelCallToAction'),
  mp = Symbol('onProgress');
var bp = function (e, t, i, s) {
  var n,
    a = arguments.length,
    r = a < 3 ? t : null === s ? (s = Object.getOwnPropertyDescriptor(t, i)) : s;
  if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
    r = Reflect.decorate(e, t, i, s);
  else
    for (var o = e.length - 1; o >= 0; o--)
      (n = e[o]) && (r = (a < 3 ? n(r) : a > 3 ? n(t, i, r) : n(t, i)) || r);
  return (a > 3 && r && Object.defineProperty(t, i, r), r);
};
const fp = Math.PI / 32,
  Ip = { basis: [Co(lo(fp, 'rad'))], keywords: { auto: [null] } },
  Cp = Symbol('autoRotateStartTime'),
  Ep = Symbol('radiansPerSecond'),
  Bp = Symbol('syncRotationRate'),
  yp = Symbol('onCameraChange'),
  wp = (e => {
    var t, i, s;
    class n extends e {
      constructor() {
        (super(...arguments),
          (this[t] = new Map()),
          (this[i] = e => {
            e.forEach(e => {
              (e instanceof MutationRecord && 'childList' !== e.type) ||
                (e.addedNodes.forEach(e => {
                  this[Cg](e);
                }),
                e.removedNodes.forEach(e => {
                  this[Eg](e);
                }),
                this[$d]());
            });
          }),
          (this[s] = new MutationObserver(this[fg])));
      }
      connectedCallback() {
        super.connectedCallback();
        for (let t = 0; t < this.children.length; ++t) this[Cg](this.children[t]);
        const { ShadyDOM: e } = self;
        null == e
          ? this[Ig].observe(this, { childList: !0 })
          : (this[Ig] = e.observeChildren(this, this[fg]));
      }
      disconnectedCallback() {
        super.disconnectedCallback();
        const { ShadyDOM: e } = self;
        null == e ? this[Ig].disconnect() : e.unobserveChildren(this[Ig]);
      }
      [((t = bg), (i = fg), (s = Ig), Zd)]() {
        super[Zd]();
        const e = this[Wd];
        e.forHotspots(t => {
          e.updateSurfaceHotspot(t);
        });
      }
      [Xd](e, t) {
        super[Xd](e, t);
        const i = this[Wd],
          { annotationRenderer: s } = i,
          n = i.getCamera();
        i.shouldRender() &&
          (i.animateSurfaceHotspots(),
          i.updateHotspotsVisibility(n.position),
          (s.domElement.style.display = ''),
          s.render(i, n));
      }
      updateHotspot(e) {
        const t = this[bg].get(e.name);
        null != t &&
          (t.updatePosition(e.position),
          t.updateNormal(e.normal),
          (t.surface = e.surface),
          this[Wd].updateSurfaceHotspot(t),
          this[$d]());
      }
      queryHotspot(e) {
        const t = this[bg].get(e);
        if (null == t) return null;
        const i = rg(t.position),
          s = rg(t.normal),
          n = t.facingCamera,
          a = this[Wd],
          r = a.getCamera(),
          o = new S();
        (o.setFromMatrixPosition(t.matrixWorld), o.project(r));
        const A = a.width / 2,
          l = a.height / 2;
        ((o.x = o.x * A + A), (o.y = -o.y * l + l));
        const c = rg(new S(o.x, o.y, o.z));
        return Number.isFinite(c.x) && Number.isFinite(c.y)
          ? { position: i, normal: s, canvasPosition: c, facingCamera: n }
          : null;
      }
      positionAndNormalFromPoint(e, t) {
        const i = this[Wd],
          s = i.getNDC(e, t),
          n = i.positionAndNormalFromPoint(s);
        if (null == n) return null;
        Bg.copy(i.target.matrixWorld).invert();
        const a = rg(n.position.applyMatrix4(Bg)),
          r = rg(n.normal.transformDirection(Bg));
        let o = null;
        return (null != n.uv && (o = og(n.uv)), { position: a, normal: r, uv: o });
      }
      surfaceFromPoint(e, t) {
        const i = this[Wd],
          s = i.getNDC(e, t);
        return i.surfaceFromPoint(s);
      }
      [Cg](e) {
        if (!(e instanceof HTMLElement && 0 === e.slot.indexOf('hotspot'))) return;
        let t = this[bg].get(e.slot);
        (null != t
          ? t.increment()
          : ((t = new Zh({
              name: e.slot,
              position: e.dataset.position,
              normal: e.dataset.normal,
              surface: e.dataset.surface,
            })),
            this[bg].set(e.slot, t),
            this[Wd].addHotspot(t)),
          this[Wd].queueRender());
      }
      [Eg](e) {
        if (!(e instanceof HTMLElement)) return;
        const t = this[bg].get(e.slot);
        t &&
          (t.decrement() && (this[Wd].removeHotspot(t), this[bg].delete(e.slot)),
          this[Wd].queueRender());
      }
    }
    return n;
  })(
    (e => {
      var t, i, s;
      class n extends e {
        constructor() {
          (super(...arguments),
            (this[t] = void 0),
            (this[i] = null),
            (this[s] = null),
            (this.variantName = null),
            (this.orientation = '0 0 0'),
            (this.scale = '1 1 1'));
        }
        get model() {
          return this[qh];
        }
        get availableVariants() {
          return this.model ? this.model[Lh]() : [];
        }
        get originalGltfJson() {
          return this[Hh];
        }
        [((t = qh), (i = Oh), (s = Hh), jh)]() {
          return () => {
            this[$d]();
          };
        }
        [zh](e) {
          return ((e.colorSpace = c), (e.wrapS = O), (e.wrapT = O), new Dc(this[jh](), e));
        }
        async createTexture(e, t = 'image/png') {
          const { textureUtils: i } = this[tg],
            s = await i.loadImage(e, this.withCredentials);
          return ((s.userData.mimeType = t), this[zh](s));
        }
        async createLottieTexture(e, t = 1) {
          const { textureUtils: i } = this[tg],
            s = await i.loadLottie(e, t, this.withCredentials);
          return this[zh](s);
        }
        createVideoTexture(e) {
          const t = document.createElement('video');
          ((t.crossOrigin = this.withCredentials ? 'use-credentials' : 'anonymous'),
            (t.src = e),
            (t.muted = !0),
            (t.playsInline = !0),
            (t.loop = !0),
            t.play());
          const i = new vt(t);
          return this[zh](i);
        }
        createCanvasTexture() {
          const e = document.createElement('canvas'),
            t = new xt(e);
          return this[zh](t);
        }
        async updated(e) {
          if ((super.updated(e), e.has('variantName'))) {
            const e = this[ig].beginActivity('variant-update');
            e(0.1);
            const t = this[qh],
              { variantName: i } = this;
            (null != t &&
              (await t[Mh](i), this[$d](), this.dispatchEvent(new CustomEvent('variant-applied'))),
              e(1));
          }
          if (e.has('orientation') || e.has('scale')) {
            if (!this.loaded) return;
            const e = this[Wd];
            (e.applyTransform(),
              e.updateBoundingBox(),
              e.updateShadow(),
              this[tg].arRenderer.onUpdateScene(),
              this[$d]());
          }
        }
        [Zd]() {
          super[Zd]();
          const { currentGLTF: e } = this[Wd];
          if (null != e) {
            const { correlatedSceneGraph: t } = e;
            (null != t &&
              e !== this[Oh] &&
              ((this[qh] = new Ph(t, this[jh]())), (this[Hh] = JSON.parse(JSON.stringify(t.gltf)))),
              'variants' in e.userData && this.requestUpdate('variantName'));
          }
          this[Oh] = e;
        }
        async exportScene(e) {
          const t = this[Wd];
          return new Promise(async (i, s) => {
            const n = {
              binary: !0,
              onlyVisible: !0,
              maxTextureSize: 1 / 0,
              includeCustomExtensions: !1,
              forceIndices: !1,
            };
            (Object.assign(n, e), (n.animations = t.animations), (n.truncateDrawRange = !0));
            const a = t.shadow;
            let r = !1;
            (null != a && ((r = a.visible), (a.visible = !1)), await this[qh][Rh]());
            (new ar()
              .register(e => new eo(e))
              .parse(
                t.model,
                e =>
                  i(
                    new Blob([n.binary ? e : JSON.stringify(e)], {
                      type: n.binary ? 'application/octet-stream' : 'application/json',
                    })
                  ),
                () => s('glTF export failed'),
                n
              ),
              null != a && (a.visible = r));
          });
        }
        materialFromPoint(e, t) {
          const i = this[qh];
          if (null == i) return null;
          const s = this[Wd],
            n = s.getNDC(e, t),
            a = s.hitFromPoint(n);
          return null == a || null == a.face ? null : i[Th](a);
        }
      }
      return (
        Nh([ai({ type: String, attribute: 'variant-name' })], n.prototype, 'variantName', void 0),
        Nh([ai({ type: String, attribute: 'orientation' })], n.prototype, 'orientation', void 0),
        Nh([ai({ type: String, attribute: 'scale' })], n.prototype, 'scale', void 0),
        n
      );
    })(
      (e => {
        var t, i, s;
        class n extends e {
          constructor() {
            (super(...arguments),
              (this.autoRotate = !1),
              (this.autoRotateDelay = 3e3),
              (this.rotationPerSecond = 'auto'),
              (this[t] = performance.now()),
              (this[i] = 0),
              (this[s] = e => {
                this.autoRotate &&
                  'user-interaction' === e.detail.source &&
                  (this[Cp] = performance.now());
              }));
          }
          connectedCallback() {
            (super.connectedCallback(),
              this.addEventListener('camera-change', this[yp]),
              (this[Cp] = performance.now()));
          }
          disconnectedCallback() {
            (super.disconnectedCallback(),
              this.removeEventListener('camera-change', this[yp]),
              (this[Cp] = performance.now()));
          }
          updated(e) {
            (super.updated(e), e.has('autoRotate') && (this[Cp] = performance.now()));
          }
          [((t = Cp), (i = Ep), Bp)](e) {
            this[Ep] = e[0];
          }
          [Xd](e, t) {
            if ((super[Xd](e, t), !this.autoRotate || !this[ng]() || this[tg].isPresenting)) return;
            const i = Math.min(t, e - this[Cp] - this.autoRotateDelay);
            i > 0 && (this[Wd].yaw = this.turntableRotation + this[Ep] * i * 0.001);
          }
          get turntableRotation() {
            return this[Wd].yaw;
          }
          resetTurntableRotation(e = 0) {
            this[Wd].yaw = e;
          }
        }
        return (
          (s = yp),
          bp([ai({ type: Boolean, attribute: 'auto-rotate' })], n.prototype, 'autoRotate', void 0),
          bp(
            [ai({ type: Number, attribute: 'auto-rotate-delay' })],
            n.prototype,
            'autoRotateDelay',
            void 0
          ),
          bp(
            [
              rA({ intrinsics: Ip, updateHandler: Bp }),
              ai({ type: String, attribute: 'rotation-per-second' }),
            ],
            n.prototype,
            'rotationPerSecond',
            void 0
          ),
          n
        );
      })(
        (e => {
          var A, l, c;
          class h extends e {
            constructor() {
              (super(...arguments),
                (this.environmentImage = null),
                (this.skyboxImage = null),
                (this.shadowIntensity = 0),
                (this.shadowSoftness = 1),
                (this.exposure = 1),
                (this.toneMapping = 'auto'),
                (this.skyboxHeight = '0'),
                (this[A] = null),
                (this[l] = null),
                (this[c] = null));
            }
            updated(e) {
              (super.updated(e),
                e.has('shadowIntensity') &&
                  (this[Wd].setShadowIntensity(0.5 * this.shadowIntensity), this[$d]()),
                e.has('shadowSoftness') &&
                  (this[Wd].setShadowSoftness(this.shadowSoftness), this[$d]()),
                e.has('exposure') && ((this[Wd].exposure = this.exposure), this[$d]()),
                e.has('toneMapping') &&
                  ((this[Wd].toneMapping =
                    'aces' === this.toneMapping
                      ? t
                      : 'agx' === this.toneMapping
                        ? i
                        : 'reinhard' === this.toneMapping
                          ? s
                          : 'cineon' === this.toneMapping
                            ? n
                            : 'linear' === this.toneMapping
                              ? a
                              : 'none' === this.toneMapping
                                ? r
                                : o),
                  this[$d]()),
                (e.has('environmentImage') || e.has('skyboxImage')) && this[ag]() && this[us](),
                e.has('skyboxHeight') && (this[Wd].setGroundedSkybox(), this[$d]()));
            }
            hasBakedShadow() {
              return this[Wd].bakedShadows.size > 0;
            }
            async [((A = ds), (l = gs), (c = ps), us)]() {
              const { skyboxImage: e, environmentImage: t } = this;
              null != this[ps] && (this[ps](), (this[ps] = null));
              const { textureUtils: i } = this[tg];
              if (null == i) return;
              const s = this[ig].beginActivity('environment-update');
              try {
                const { environmentMap: n, skybox: a } = await i.generateEnvironmentMapAndSkybox(
                  as(e),
                  t,
                  e => s(ls(e, 0, 1)),
                  this.withCredentials
                );
                (this[ds] !== n &&
                  ((this[ds] = n), this.dispatchEvent(new CustomEvent('environment-change'))),
                  (this[gs] = null != a ? (a.name === n.name ? n : a) : null),
                  this[Wd].setEnvironmentAndSkybox(this[ds], this[gs]));
              } catch (n) {
                if (n instanceof Error) throw (this[Wd].setEnvironmentAndSkybox(null, null), n);
              } finally {
                s(1);
              }
            }
          }
          return (
            hs(
              [ai({ type: String, attribute: 'environment-image' })],
              h.prototype,
              'environmentImage',
              void 0
            ),
            hs(
              [ai({ type: String, attribute: 'skybox-image' })],
              h.prototype,
              'skyboxImage',
              void 0
            ),
            hs(
              [ai({ type: Number, attribute: 'shadow-intensity' })],
              h.prototype,
              'shadowIntensity',
              void 0
            ),
            hs(
              [ai({ type: Number, attribute: 'shadow-softness' })],
              h.prototype,
              'shadowSoftness',
              void 0
            ),
            hs([ai({ type: Number })], h.prototype, 'exposure', void 0),
            hs(
              [ai({ type: String, attribute: 'tone-mapping' })],
              h.prototype,
              'toneMapping',
              void 0
            ),
            hs(
              [ai({ type: String, attribute: 'skybox-height' })],
              h.prototype,
              'skyboxHeight',
              void 0
            ),
            h
          );
        })(
          (e => {
            var t, i, s, n, a, r, o, A, l, c, h, d, g, u, p, m, b, f;
            class I extends e {
              constructor() {
                (super(...arguments),
                  (this.cameraControls = !1),
                  (this.cameraOrbit = gA),
                  (this.cameraTarget = 'auto auto auto'),
                  (this.fieldOfView = 'auto'),
                  (this.minCameraOrbit = 'auto'),
                  (this.maxCameraOrbit = 'auto'),
                  (this.minFieldOfView = 'auto'),
                  (this.maxFieldOfView = 'auto'),
                  (this.interactionPromptThreshold = 3e3),
                  (this.interactionPrompt = mA),
                  (this.interactionPromptStyle = fA),
                  (this.orbitSensitivity = 1),
                  (this.zoomSensitivity = 1),
                  (this.panSensitivity = 1),
                  (this.touchAction = IA),
                  (this.disableZoom = !1),
                  (this.disablePan = !1),
                  (this.disableTap = !1),
                  (this.interpolationDecay = 50),
                  (this.a11y = null),
                  (this[t] = this.shadowRoot.querySelector('.interaction-prompt')),
                  (this[i] = this.shadowRoot.querySelector('#prompt')),
                  (this[s] = [
                    this.shadowRoot.querySelector('#finger0'),
                    this.shadowRoot.querySelector('#finger1'),
                  ]),
                  (this[n] = this.shadowRoot.querySelector('.pan-target')),
                  (this[a] = 0),
                  (this[r] = 1 / 0),
                  (this[o] = !1),
                  (this[A] = !1),
                  (this[l] = cl.AUTOMATIC),
                  (this[c] = new hl(this[Wd].camera, this[Jd], this[Wd])),
                  (this[h] = new gt()),
                  (this[d] = !1),
                  (this[g] = !1),
                  (this[u] = !1),
                  (this[p] = {}),
                  (this[m] = () => {
                    const e = this[MA].changeSource;
                    ((this[VA] = e), e === cl.USER_INTERACTION && ((this[jA] = !0), this[LA]()));
                  }),
                  (this[b] = () => {
                    (this[UA](), this[$d]());
                    const e = this[MA].changeSource;
                    this.dispatchEvent(new CustomEvent('camera-change', { detail: { source: e } }));
                  }),
                  (this[f] = e => {
                    this[Vd].classList.toggle(
                      'pointer-tumbling',
                      'pointer-change-start' === e.type
                    );
                  }));
              }
              get inputSensitivity() {
                return this[MA].inputSensitivity;
              }
              set inputSensitivity(e) {
                this[MA].inputSensitivity = e;
              }
              getCameraOrbit() {
                const { theta: e, phi: t, radius: i } = this[JA];
                return {
                  theta: e,
                  phi: t,
                  radius: i,
                  toString() {
                    return `${this.theta}rad ${this.phi}rad ${this.radius}m`;
                  },
                };
              }
              getCameraTarget() {
                return rg(
                  this[tg].isPresenting ? this[tg].arRenderer.target : this[Wd].getDynamicTarget()
                );
              }
              getFieldOfView() {
                return this[MA].getFieldOfView();
              }
              getMinimumFieldOfView() {
                return this[MA].options.minimumFieldOfView;
              }
              getMaximumFieldOfView() {
                return this[MA].options.maximumFieldOfView;
              }
              getIdealAspect() {
                return this[Wd].idealAspect;
              }
              jumpCameraToGoal() {
                ((this[YA] = !0), this.requestUpdate(YA, !1));
              }
              resetInteractionPrompt() {
                ((this[KA] = 0),
                  (this[zA] = 1 / 0),
                  (this[jA] = !1),
                  (this[qA] = this.interactionPrompt === mA && this.cameraControls));
              }
              zoom(e) {
                const t = new WheelEvent('wheel', { deltaY: -30 * e });
                this[Jd].dispatchEvent(t);
              }
              connectedCallback() {
                (super.connectedCallback(),
                  this[MA].addEventListener('user-interaction', this[NA]),
                  this[MA].addEventListener('pointer-change-start', this[HA]),
                  this[MA].addEventListener('pointer-change-end', this[HA]));
              }
              disconnectedCallback() {
                (super.disconnectedCallback(),
                  this[MA].removeEventListener('user-interaction', this[NA]),
                  this[MA].removeEventListener('pointer-change-start', this[HA]),
                  this[MA].removeEventListener('pointer-change-end', this[HA]));
              }
              updated(e) {
                super.updated(e);
                const t = this[MA],
                  i = this[Wd];
                if (
                  (e.has('cameraControls') &&
                    (this.cameraControls
                      ? (t.enableInteraction(), this.interactionPrompt === mA && (this[qA] = !0))
                      : (t.disableInteraction(), this[LA]()),
                    this[Jd].setAttribute('aria-label', this[Nd])),
                  e.has('disableZoom') && (t.disableZoom = this.disableZoom),
                  e.has('disablePan') && (t.enablePan = !this.disablePan),
                  e.has('disableTap') && (t.enableTap = !this.disableTap),
                  (e.has('interactionPrompt') || e.has('cameraControls') || e.has('src')) &&
                    (this.interactionPrompt === mA && this.cameraControls && !this[jA]
                      ? (this[qA] = !0)
                      : this[LA]()),
                  e.has('interactionPromptStyle') &&
                    (this[kA].style.opacity = this.interactionPromptStyle == bA ? '1' : '0'),
                  e.has('touchAction'))
                ) {
                  const e = this.touchAction;
                  (t.applyOptions({ touchAction: e }), t.updateTouchActionStyle());
                }
                (e.has('orbitSensitivity') && (t.orbitSensitivity = this.orbitSensitivity),
                  e.has('zoomSensitivity') && (t.zoomSensitivity = this.zoomSensitivity),
                  e.has('panSensitivity') && (t.panSensitivity = this.panSensitivity),
                  e.has('interpolationDecay') &&
                    (t.setDamperDecayTime(this.interpolationDecay),
                    i.setTargetDamperDecayTime(this.interpolationDecay)),
                  e.has('a11y') && this[_A](),
                  !0 === this[YA] &&
                    Promise.resolve().then(() => {
                      (t.jumpToGoal(), i.jumpToGoal(), this[OA](), (this[YA] = !1));
                    }));
              }
              async updateFraming() {
                const e = this[Wd],
                  t = e.adjustedFoV(e.framedFoVDeg);
                await e.updateFraming();
                const i = e.adjustedFoV(e.framedFoVDeg),
                  s = this[MA].getFieldOfView() / t;
                (this[MA].setFieldOfView(i * s),
                  (this[$A] = !0),
                  this.requestUpdate('maxFieldOfView'),
                  this.requestUpdate('fieldOfView'),
                  this.requestUpdate('minCameraOrbit'),
                  this.requestUpdate('maxCameraOrbit'),
                  this.requestUpdate('cameraOrbit'),
                  await this.updateComplete);
              }
              interact(e, t, i) {
                const s = this[Jd],
                  n = this[FA];
                if ('1' === n[0].style.opacity)
                  return void console.warn(
                    'interact() failed because an existing interaction is running.'
                  );
                const a = new Array();
                a.push({ x: lA(t.x), y: lA(t.y) });
                const r = [{ x: a[0].x(0), y: a[0].y(0) }];
                null != i &&
                  (a.push({ x: lA(i.x), y: lA(i.y) }), r.push({ x: a[1].x(0), y: a[1].y(0) }));
                let o = performance.now();
                const { width: A, height: l } = this[Wd],
                  c = this.getBoundingClientRect(),
                  h = e => {
                    for (const [t, i] of r.entries()) {
                      const { style: a } = n[t];
                      ((a.transform = `translateX(${A * i.x}px) translateY(${l * i.y}px)`),
                        'pointerdown' === e
                          ? (a.opacity = '1')
                          : 'pointerup' === e && (a.opacity = '0'));
                      const r = {
                        pointerId: t - 5678,
                        pointerType: 'touch',
                        target: s,
                        clientX: A * i.x + c.x,
                        clientY: l * i.y + c.y,
                        altKey: !0,
                      };
                      s.dispatchEvent(new PointerEvent(e, r));
                    }
                  },
                  d = () => {
                    const t = this[VA];
                    if (t !== cl.AUTOMATIC || !s.isConnected) {
                      for (const e of this[FA]) e.style.opacity = '0';
                      return (
                        h('pointercancel'),
                        this.dispatchEvent(
                          new CustomEvent('interact-stopped', { detail: { source: t } })
                        ),
                        void document.removeEventListener('visibilitychange', g)
                      );
                    }
                    const i = Math.min(1, (performance.now() - o) / e);
                    for (const [e, s] of r.entries()) ((s.x = a[e].x(i)), (s.y = a[e].y(i)));
                    (h('pointermove'),
                      i < 1
                        ? requestAnimationFrame(d)
                        : (h('pointerup'),
                          this.dispatchEvent(
                            new CustomEvent('interact-stopped', {
                              detail: { source: cl.AUTOMATIC },
                            })
                          ),
                          document.removeEventListener('visibilitychange', g)));
                  },
                  g = () => {
                    let e = 0;
                    'hidden' === document.visibilityState
                      ? (e = performance.now() - o)
                      : (o = performance.now() - e);
                  };
                (document.addEventListener('visibilitychange', g),
                  h('pointerdown'),
                  (this[VA] = cl.AUTOMATIC),
                  requestAnimationFrame(d));
              }
              [((t = DA),
              (i = kA),
              (s = FA),
              (n = TA),
              (a = KA),
              (r = zA),
              (o = jA),
              (A = qA),
              (l = VA),
              (c = MA),
              (h = JA),
              (d = YA),
              (g = WA),
              (u = $A),
              (p = GA),
              ZA)](e) {
                const t = this[MA],
                  i = this[Wd];
                ((i.framedFoVDeg = (180 * e[0]) / Math.PI),
                  (t.changeSource = cl.NONE),
                  t.setFieldOfView(i.adjustedFoV(i.framedFoVDeg)),
                  this[NA]());
              }
              [XA](e) {
                const t = this[MA];
                if (this[$A]) {
                  const { theta: t, phi: i } = this.getCameraOrbit();
                  ((e[0] = t), (e[1] = i), (this[$A] = !1));
                }
                ((t.changeSource = cl.NONE), t.setOrbit(e[0], e[1], e[2]), this[NA]());
              }
              [tl](e) {
                (this[MA].applyOptions({
                  minimumAzimuthalAngle: e[0],
                  minimumPolarAngle: e[1],
                  minimumRadius: e[2],
                }),
                  this.jumpCameraToGoal());
              }
              [il](e) {
                (this[MA].applyOptions({
                  maximumAzimuthalAngle: e[0],
                  maximumPolarAngle: e[1],
                  maximumRadius: e[2],
                }),
                  this[PA](e[2]),
                  this.jumpCameraToGoal());
              }
              [sl](e) {
                (this[MA].applyOptions({ minimumFieldOfView: (180 * e[0]) / Math.PI }),
                  this.jumpCameraToGoal());
              }
              [nl](e) {
                const t = this[Wd].adjustedFoV((180 * e[0]) / Math.PI);
                (this[MA].applyOptions({ maximumFieldOfView: t }), this.jumpCameraToGoal());
              }
              [el](e) {
                const [t, i, s] = e;
                (this[tg].arRenderer.isPresenting || this[Wd].setTarget(t, i, s),
                  (this[MA].changeSource = cl.NONE),
                  this[tg].arRenderer.updateTarget(),
                  this[NA]());
              }
              [Xd](e, t) {
                if ((super[Xd](e, t), this[tg].isPresenting || !this[ng]())) return;
                const i = this[MA],
                  s = this[Wd],
                  n = performance.now();
                if (
                  (this[qA] &&
                    this.loaded &&
                    n > this[jd] + this.interactionPromptThreshold &&
                    ((this[qA] = !1), (this[zA] = n), this[DA].classList.add('visible')),
                  isFinite(this[zA]) && this.interactionPromptStyle === fA)
                ) {
                  const e = ((n - this[zA]) / 5e3) % 1,
                    t = hA(e),
                    a = dA(e);
                  if (((this[kA].style.opacity = `${a}`), t !== this[KA])) {
                    const e = t * s.width * 0.05,
                      n = ((t - this[KA]) * Math.PI) / 16;
                    ((this[kA].style.transform = `translateX(${e}px)`),
                      (i.changeSource = cl.AUTOMATIC),
                      i.adjustOrbit(n, 0, 0),
                      (this[KA] = t));
                  }
                }
                const a = i.update(e, t),
                  r = s.updateTarget(t);
                (a || r) && this[OA]();
              }
              [LA]() {
                ((this[qA] = !1), this[DA].classList.remove('visible'), (this[zA] = 1 / 0));
              }
              [PA](e) {
                const t = Math.max(this[Wd].farRadius(), e),
                  i = Math.abs(2 * t);
                this[MA].updateNearFar(0, i);
              }
              [UA]() {
                const { theta: e, phi: t } = this[MA].getCameraSpherical(this[JA]),
                  i = (4 + Math.floor(((e % RA) + SA) / vA)) % 4,
                  s = Math.floor(t / xA),
                  n = `${pA[s]}${uA[i]}`,
                  a = n;
                a in this[GA] ? this[qd](this[GA][a]) : this[qd](`View from stage ${n}`);
              }
              get [Nd]() {
                let e = '. Use mouse, touch or arrow keys to move.';
                return (
                  'interaction-prompt' in this[GA] && (e = `. ${this[GA]['interaction-prompt']}`),
                  super[Nd].replace(/\.$/, '') + (this.cameraControls ? e : '')
                );
              }
              async [eg](e) {
                const t = this[MA],
                  i = this[Wd],
                  s = i.adjustedFoV(i.framedFoVDeg);
                super[eg](e);
                const n = i.adjustedFoV(i.framedFoVDeg) / s,
                  a = t.getFieldOfView() * (isFinite(n) ? n : 1);
                (t.updateAspect(this[Wd].aspect),
                  this.requestUpdate('maxFieldOfView', this.maxFieldOfView),
                  await this.updateComplete,
                  this[MA].setFieldOfView(a),
                  this.jumpCameraToGoal());
              }
              [Zd]() {
                (super[Zd](),
                  this[WA] ? (this[$A] = !0) : (this[WA] = !0),
                  this.requestUpdate('maxFieldOfView', this.maxFieldOfView),
                  this.requestUpdate('fieldOfView', this.fieldOfView),
                  this.requestUpdate('minCameraOrbit', this.minCameraOrbit),
                  this.requestUpdate('maxCameraOrbit', this.maxCameraOrbit),
                  this.requestUpdate('cameraOrbit', this.cameraOrbit),
                  this.requestUpdate('cameraTarget', this.cameraTarget),
                  this.jumpCameraToGoal());
              }
              [((m = NA), (b = OA), (f = HA), _A)]() {
                if ('string' == typeof this.a11y)
                  if (this.a11y.startsWith('{'))
                    try {
                      this[GA] = JSON.parse(this.a11y);
                    } catch (e) {
                      console.warn('Error parsing a11y JSON:', e);
                    }
                  else
                    this.a11y.length > 0
                      ? console.warn(
                          'Error not supported format, should be a JSON string:',
                          this.a11y
                        )
                      : (this[GA] = {});
                else
                  'object' == typeof this.a11y && null != this.a11y
                    ? (this[GA] = Object.assign({}, this.a11y))
                    : (this[GA] = {});
                this[Jd].setAttribute('aria-label', this[Nd]);
              }
            }
            return (
              cA(
                [ai({ type: Boolean, attribute: 'camera-controls' })],
                I.prototype,
                'cameraControls',
                void 0
              ),
              cA(
                [
                  rA({ intrinsics: BA, observeEffects: !0, updateHandler: XA }),
                  ai({ type: String, attribute: 'camera-orbit', hasChanged: () => !0 }),
                ],
                I.prototype,
                'cameraOrbit',
                void 0
              ),
              cA(
                [
                  rA({ intrinsics: QA, observeEffects: !0, updateHandler: el }),
                  ai({ type: String, attribute: 'camera-target', hasChanged: () => !0 }),
                ],
                I.prototype,
                'cameraTarget',
                void 0
              ),
              cA(
                [
                  rA({ intrinsics: CA, observeEffects: !0, updateHandler: ZA }),
                  ai({ type: String, attribute: 'field-of-view', hasChanged: () => !0 }),
                ],
                I.prototype,
                'fieldOfView',
                void 0
              ),
              cA(
                [
                  rA({ intrinsics: yA, updateHandler: tl }),
                  ai({ type: String, attribute: 'min-camera-orbit', hasChanged: () => !0 }),
                ],
                I.prototype,
                'minCameraOrbit',
                void 0
              ),
              cA(
                [
                  rA({ intrinsics: wA, updateHandler: il }),
                  ai({ type: String, attribute: 'max-camera-orbit', hasChanged: () => !0 }),
                ],
                I.prototype,
                'maxCameraOrbit',
                void 0
              ),
              cA(
                [
                  rA({ intrinsics: EA, updateHandler: sl }),
                  ai({ type: String, attribute: 'min-field-of-view', hasChanged: () => !0 }),
                ],
                I.prototype,
                'minFieldOfView',
                void 0
              ),
              cA(
                [
                  rA({ intrinsics: CA, updateHandler: nl }),
                  ai({ type: String, attribute: 'max-field-of-view', hasChanged: () => !0 }),
                ],
                I.prototype,
                'maxFieldOfView',
                void 0
              ),
              cA(
                [ai({ type: Number, attribute: 'interaction-prompt-threshold' })],
                I.prototype,
                'interactionPromptThreshold',
                void 0
              ),
              cA(
                [ai({ type: String, attribute: 'interaction-prompt' })],
                I.prototype,
                'interactionPrompt',
                void 0
              ),
              cA(
                [ai({ type: String, attribute: 'interaction-prompt-style' })],
                I.prototype,
                'interactionPromptStyle',
                void 0
              ),
              cA(
                [ai({ type: Number, attribute: 'orbit-sensitivity' })],
                I.prototype,
                'orbitSensitivity',
                void 0
              ),
              cA(
                [ai({ type: Number, attribute: 'zoom-sensitivity' })],
                I.prototype,
                'zoomSensitivity',
                void 0
              ),
              cA(
                [ai({ type: Number, attribute: 'pan-sensitivity' })],
                I.prototype,
                'panSensitivity',
                void 0
              ),
              cA(
                [ai({ type: String, attribute: 'touch-action' })],
                I.prototype,
                'touchAction',
                void 0
              ),
              cA(
                [ai({ type: Boolean, attribute: 'disable-zoom' })],
                I.prototype,
                'disableZoom',
                void 0
              ),
              cA(
                [ai({ type: Boolean, attribute: 'disable-pan' })],
                I.prototype,
                'disablePan',
                void 0
              ),
              cA(
                [ai({ type: Boolean, attribute: 'disable-tap' })],
                I.prototype,
                'disableTap',
                void 0
              ),
              cA(
                [ai({ type: Number, attribute: 'interpolation-decay' })],
                I.prototype,
                'interpolationDecay',
                void 0
              ),
              cA([ai()], I.prototype, 'a11y', void 0),
              I
            );
          })(
            (e => {
              var t, i, s, n, a, r, o, A, l, c;
              class h extends e {
                constructor() {
                  (super(...arguments),
                    (this.ar = !1),
                    (this.arScale = 'auto'),
                    (this.arUsdzMaxTextureSize = 'auto'),
                    (this.arPlacement = 'floor'),
                    (this.arModes = 'webxr scene-viewer quick-look'),
                    (this.iosSrc = null),
                    (this.xrEnvironment = !1),
                    (this[t] = !1),
                    (this[i] = this.shadowRoot.querySelector('.ar-button')),
                    (this[s] = document.createElement('a')),
                    (this[n] = new Set()),
                    (this[a] = Hu),
                    (this[r] = !1),
                    (this[o] = e => {
                      (e.preventDefault(), this.activateAR());
                    }),
                    (this[A] = ({ status: e }) => {
                      (e !== gl && this[tg].arRenderer.presentedScene !== this[Wd]) ||
                        (this.setAttribute('ar-status', e),
                        this.dispatchEvent(new CustomEvent('ar-status', { detail: { status: e } })),
                        e === gl
                          ? this.removeAttribute('ar-tracking')
                          : e === ul && this.setAttribute('ar-tracking', bl));
                    }),
                    (this[l] = ({ status: e }) => {
                      (this.setAttribute('ar-tracking', e),
                        this.dispatchEvent(
                          new CustomEvent('ar-tracking', { detail: { status: e } })
                        ));
                    }),
                    (this[c] = e => {
                      '_apple_ar_quicklook_button_tapped' == e.data &&
                        this.dispatchEvent(new CustomEvent('quick-look-button-tapped'));
                    }));
                }
                get canActivateAR() {
                  return this[Ju] !== Hu;
                }
                connectedCallback() {
                  (super.connectedCallback(),
                    this[tg].arRenderer.addEventListener('status', this[Zu]),
                    this.setAttribute('ar-status', gl),
                    this[tg].arRenderer.addEventListener('tracking', this[ep]),
                    this[Wu].addEventListener('message', this[tp]));
                }
                disconnectedCallback() {
                  (super.disconnectedCallback(),
                    this[tg].arRenderer.removeEventListener('status', this[Zu]),
                    this[tg].arRenderer.removeEventListener('tracking', this[ep]),
                    this[Wu].removeEventListener('message', this[tp]));
                }
                update(e) {
                  (super.update(e),
                    e.has('arScale') && (this[Wd].canScale = 'fixed' !== this.arScale),
                    e.has('arPlacement') && (this[Wd].updateShadow(), this[$d]()),
                    e.has('arModes') && (this[Yu] = Gu(this.arModes)),
                    (e.has('ar') ||
                      e.has('arModes') ||
                      e.has('src') ||
                      e.has('iosSrc') ||
                      e.has('arUsdzMaxTextureSize')) &&
                      this[ip]());
                }
                async activateAR() {
                  switch (this[Ju]) {
                    case Pu:
                      await this[Ku]();
                      break;
                    case Ou:
                      await this[ju]();
                      break;
                    case Nu:
                      this[zu]();
                      break;
                    default:
                      console.warn(
                        'No AR Mode can be activated. This is probably due to missing configuration or device capabilities'
                      );
                  }
                }
                async [((t = Vu),
                (i = qu),
                (s = Wu),
                (n = Yu),
                (a = Ju),
                (r = $u),
                (o = Xu),
                (A = Zu),
                (l = ep),
                (c = tp),
                ip)]() {
                  var e;
                  let t = Hu;
                  if (this.ar) {
                    if (null != this.src)
                      for (const i of this[Yu]) {
                        if (
                          'webxr' === i &&
                          $i &&
                          !Fu &&
                          (await this[tg].arRenderer.supportsPresentation())
                        ) {
                          t = Ou;
                          break;
                        }
                        if (
                          'scene-viewer' === i &&
                          !Lu &&
                          (is ||
                            (navigator.userAgentData &&
                              navigator.userAgentData.getHighEntropyValues &&
                              (null ===
                                (e = (
                                  await navigator.userAgentData.getHighEntropyValues(['formFactor'])
                                ).formFactor) || void 0 === e
                                ? void 0
                                : e.includes('XR'))))
                        ) {
                          t = Nu;
                          break;
                        }
                        if ('quick-look' === i && ns) {
                          t = Pu;
                          break;
                        }
                      }
                    t === Hu && null != this.iosSrc && ns && (t = Pu);
                  }
                  if (t !== Hu)
                    (this[qu].classList.add('enabled'),
                      this[qu].addEventListener('click', this[Xu]));
                  else if (this[qu].classList.contains('enabled')) {
                    (this[qu].removeEventListener('click', this[Xu]),
                      this[qu].classList.remove('enabled'));
                    const e = ml;
                    (this.setAttribute('ar-status', e),
                      this.dispatchEvent(new CustomEvent('ar-status', { detail: { status: e } })));
                  }
                  this[Ju] = t;
                }
                async [ju]() {
                  (console.log('Attempting to present in AR with WebXR...'), await this[sp]());
                  try {
                    this[qu].removeEventListener('click', this[Xu]);
                    const { arRenderer: e } = this[tg];
                    ((e.placeOnWall = 'wall' === this.arPlacement),
                      await e.present(this[Wd], this.xrEnvironment));
                  } catch (e) {
                    (console.warn('Error while trying to present in AR with WebXR'),
                      console.error(e),
                      await this[tg].arRenderer.stopPresenting(),
                      (Fu = !0),
                      console.warn('Falling back to next ar-mode'),
                      await this[ip](),
                      this.activateAR());
                  } finally {
                    this[ip]();
                  }
                }
                async [sp]() {
                  this.loaded ||
                    ((this[$u] = !0),
                    this[zd](),
                    await ((e, t, i = null) =>
                      new Promise(s => {
                        e.addEventListener(t, function n(a) {
                          (i && !i(a)) || (s(a), e.removeEventListener(t, n));
                        });
                      }))(this, 'load'),
                    (this[$u] = !1));
                }
                [ag]() {
                  return super[ag]() || this[$u];
                }
                [zu]() {
                  const e = self.location.toString(),
                    t = new URL(e),
                    i = new URL(this.src, e);
                  i.hash && (i.hash = '');
                  const s = new URLSearchParams(i.search);
                  if (
                    ((t.hash = Uu),
                    s.set('mode', 'ar_preferred'),
                    s.has('disable_occlusion') || s.set('disable_occlusion', 'true'),
                    'fixed' === this.arScale && s.set('resizable', 'false'),
                    'wall' === this.arPlacement && s.set('enable_vertical_placement', 'true'),
                    s.has('sound'))
                  ) {
                    const t = new URL(s.get('sound'), e);
                    s.set('sound', t.toString());
                  }
                  if (s.has('link')) {
                    const t = new URL(s.get('link'), e);
                    s.set('link', t.toString());
                  }
                  const n = `intent://arvr.google.com/scene-viewer/1.2?${s.toString() + '&file=' + encodeURIComponent(i.toString())}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(t.toString())};end;`;
                  (self.addEventListener(
                    'hashchange',
                    () => {
                      self.location.hash === Uu &&
                        ((Lu = !0),
                        self.history.back(),
                        console.warn('Error while trying to present in AR with Scene Viewer'),
                        console.warn('Falling back to next ar-mode'),
                        this[ip]());
                    },
                    { once: !0 }
                  ),
                    this[Wu].setAttribute('href', n),
                    console.log('Attempting to present in AR with Scene Viewer...'),
                    this[Wu].click());
                }
                async [Ku]() {
                  const e = !this.iosSrc;
                  this[qu].classList.remove('enabled');
                  const t = e ? await this.prepareUSDZ() : this.iosSrc,
                    i = new URL(t, self.location.toString());
                  if (e) {
                    const e = self.location.toString(),
                      t = new URL(e),
                      s = new URL(this.src, t);
                    s.hash && (i.hash = s.hash);
                  }
                  'fixed' === this.arScale &&
                    (i.hash && (i.hash += '&'), (i.hash += 'allowsContentScaling=0'));
                  const s = this[Wu];
                  s.setAttribute('rel', 'ar');
                  const n = document.createElement('img');
                  (s.appendChild(n),
                    s.setAttribute('href', i.toString()),
                    e && s.setAttribute('download', 'model.usdz'),
                    (s.style.display = 'none'),
                    s.isConnected || this.shadowRoot.appendChild(s),
                    console.log('Attempting to present in AR with Quick Look...'),
                    s.click(),
                    s.removeChild(n),
                    e && URL.revokeObjectURL(t),
                    this[qu].classList.add('enabled'));
                }
                async prepareUSDZ() {
                  const e = this[ig].beginActivity('usdz-conversion');
                  await this[sp]();
                  const { model: t, shadow: i, target: s } = this[Wd];
                  if (null == t) return '';
                  let n = !1;
                  (null != i && ((n = i.visible), (i.visible = !1)), e(0.2));
                  const a = new mu();
                  (s.remove(t), t.position.copy(s.position), t.updateWorldMatrix(!1, !0));
                  const r = await a.parseAsync(t, {
                    maxTextureSize: isNaN(this.arUsdzMaxTextureSize)
                      ? 1 / 0
                      : Math.max(parseInt(this.arUsdzMaxTextureSize), 16),
                  });
                  (t.position.set(0, 0, 0), s.add(t));
                  const o = new Blob([r], { type: 'model/vnd.usdz+zip' }),
                    A = URL.createObjectURL(o);
                  return (e(1), null != i && (i.visible = n), A);
                }
              }
              return (
                ku([ai({ type: Boolean, attribute: 'ar' })], h.prototype, 'ar', void 0),
                ku([ai({ type: String, attribute: 'ar-scale' })], h.prototype, 'arScale', void 0),
                ku(
                  [ai({ type: String, attribute: 'ar-usdz-max-texture-size' })],
                  h.prototype,
                  'arUsdzMaxTextureSize',
                  void 0
                ),
                ku(
                  [ai({ type: String, attribute: 'ar-placement' })],
                  h.prototype,
                  'arPlacement',
                  void 0
                ),
                ku([ai({ type: String, attribute: 'ar-modes' })], h.prototype, 'arModes', void 0),
                ku([ai({ type: String, attribute: 'ios-src' })], h.prototype, 'iosSrc', void 0),
                ku(
                  [ai({ type: Boolean, attribute: 'xr-environment' })],
                  h.prototype,
                  'xrEnvironment',
                  void 0
                ),
                h
              );
            })(
              (e => {
                var t, i, s, n, a, r, o, A;
                class l extends e {
                  static set dracoDecoderLocation(e) {
                    Ya.setDRACODecoderLocation(e);
                  }
                  static get dracoDecoderLocation() {
                    return Ya.getDRACODecoderLocation();
                  }
                  static set ktx2TranscoderLocation(e) {
                    Ya.setKTX2TranscoderLocation(e);
                  }
                  static get ktx2TranscoderLocation() {
                    return Ya.getKTX2TranscoderLocation();
                  }
                  static set meshoptDecoderLocation(e) {
                    Ya.setMeshoptDecoderLocation(e);
                  }
                  static get meshoptDecoderLocation() {
                    return Ya.getMeshoptDecoderLocation();
                  }
                  static set lottieLoaderLocation(e) {
                    ic.singleton.textureUtils.lottieLoaderUrl = e;
                  }
                  static get lottieLoaderLocation() {
                    return ic.singleton.textureUtils.lottieLoaderUrl;
                  }
                  static mapURLs(e) {
                    ic.singleton.loader[Ka].manager.setURLModifier(e);
                  }
                  dismissPoster() {
                    this.loaded ? this[dp]() : ((this[hp] = !0), this[zd]());
                  }
                  showPoster() {
                    const e = this[lp];
                    if (e.classList.contains('show')) return;
                    (e.classList.add('show'), this[Jd].classList.remove('show'));
                    const t = this[cp];
                    (t.removeAttribute('tabindex'), t.removeAttribute('aria-hidden'));
                    const i = this.modelIsVisible;
                    ((this[gp] = !1), this[Pd](i));
                  }
                  getDimensions() {
                    return rg(this[Wd].size);
                  }
                  getBoundingBoxCenter() {
                    return rg(this[Wd].boundingBox.getCenter(new S()));
                  }
                  constructor(...e) {
                    (super(...e),
                      (this.poster = null),
                      (this.reveal = ap),
                      (this.loading = rp),
                      (this[t] = !1),
                      (this[i] = !1),
                      (this[s] = this.shadowRoot.querySelector('.slot.poster')),
                      (this[n] = this.shadowRoot.querySelector('#default-poster')),
                      (this[a] = this.shadowRoot.querySelector('#default-progress-bar > .bar')),
                      (this[r] = this[cp].getAttribute('aria-label')),
                      (this[o] = ((e, t) => {
                        let i = null;
                        const s = (...s) => {
                          null == i && (e(...s), (i = self.setTimeout(() => (i = null), t)));
                        };
                        return (
                          (s.flush = () => {
                            null != i && (self.clearTimeout(i), (i = null));
                          }),
                          s
                        );
                      })(e => {
                        const t = this[Ap].parentNode;
                        requestAnimationFrame(() => {
                          ((this[Ap].style.transform = `scaleX(${e})`),
                            0 === e && (t.removeChild(this[Ap]), t.appendChild(this[Ap])),
                            this[Ap].classList.toggle('hide', 1 === e));
                        });
                      }, 100)),
                      (this[A] = e => {
                        const t = e.detail.totalProgress,
                          i = e.detail.reason;
                        (1 === t &&
                          (this[up].flush(),
                          this.loaded && (this[hp] || this.reveal === ap) && this[dp]()),
                          this[up](t),
                          this.dispatchEvent(
                            new CustomEvent('progress', { detail: { totalProgress: t, reason: i } })
                          ));
                      }));
                    const l = self.ModelViewerElement || {},
                      c =
                        l.dracoDecoderLocation ||
                        'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';
                    Ya.setDRACODecoderLocation(c);
                    const h =
                      l.ktx2TranscoderLocation ||
                      'https://www.gstatic.com/basis-universal/versioned/2021-04-15-ba1c3e4/';
                    (Ya.setKTX2TranscoderLocation(h),
                      l.meshoptDecoderLocation &&
                        Ya.setMeshoptDecoderLocation(l.meshoptDecoderLocation));
                    const d =
                      l.lottieLoaderLocation ||
                      'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/loaders/LottieLoader.js';
                    ic.singleton.textureUtils.lottieLoaderUrl = d;
                  }
                  connectedCallback() {
                    (super.connectedCallback(),
                      this.loaded || this.showPoster(),
                      this[ig].addEventListener('progress', this[mp]));
                  }
                  disconnectedCallback() {
                    (super.disconnectedCallback(),
                      this[ig].removeEventListener('progress', this[mp]));
                  }
                  async updated(e) {
                    (super.updated(e),
                      e.has('poster') &&
                        null != this.poster &&
                        (this[cp].style.backgroundImage = `url(${this.poster})`),
                      e.has('alt') && this[cp].setAttribute('aria-label', this[Od]),
                      (e.has('reveal') || e.has('loading')) && this[zd]());
                  }
                  [((t = gp),
                  (i = hp),
                  (s = lp),
                  (n = cp),
                  (a = Ap),
                  (r = pp),
                  (o = up),
                  (A = mp),
                  ag)]() {
                    return (
                      !!this.src &&
                      (this[hp] || this.loading === op || (this.reveal === ap && this[_d]))
                    );
                  }
                  [dp]() {
                    this[hp] = !1;
                    const e = this[lp];
                    if (!e.classList.contains('show')) return;
                    (e.classList.remove('show'), this[Jd].classList.add('show'));
                    const t = this.modelIsVisible;
                    ((this[gp] = !0), this[Pd](t));
                    const i = this.getRootNode();
                    i && i.activeElement === this && this[Jd].focus();
                    const s = this[cp];
                    (s.setAttribute('aria-hidden', 'true'),
                      (s.tabIndex = -1),
                      this.dispatchEvent(new CustomEvent('poster-dismissed')));
                  }
                  [ng]() {
                    return super[ng]() && this[gp];
                  }
                }
                return (
                  np([ai({ type: String })], l.prototype, 'poster', void 0),
                  np([ai({ type: String })], l.prototype, 'reveal', void 0),
                  np([ai({ type: String })], l.prototype, 'loading', void 0),
                  l
                );
              })(
                (e => {
                  var t;
                  class i extends e {
                    constructor(...e) {
                      (super(e),
                        (this.autoplay = !1),
                        (this.animationName = void 0),
                        (this.animationCrossfadeDuration = 300),
                        (this[t] = !0),
                        this[Wd].subscribeMixerEvent('loop', e => {
                          const t = e.action._loopCount,
                            i = e.action._clip.name,
                            s = e.action._clip.uuid,
                            n = this[Wd].markedAnimations.find(e => e.name === i);
                          if (n) {
                            this[Wd].updateAnimationLoop(n.name, n.loopMode, n.repetitionCount);
                            const e = this[Wd].markedAnimations.filter(e => e.name !== i);
                            this[Wd].markedAnimations = e;
                          }
                          this.dispatchEvent(
                            new CustomEvent('loop', { detail: { count: t, name: i, uuid: s } })
                          );
                        }),
                        this[Wd].subscribeMixerEvent('finished', e => {
                          if (this[Wd].appendedAnimations.includes(e.action._clip.name)) {
                            const t = this[Wd].appendedAnimations.filter(
                              t => t !== e.action._clip.name
                            );
                            this[Wd].appendedAnimations = t;
                          } else this[gg] = !0;
                          this.dispatchEvent(new CustomEvent('finished'));
                        }));
                    }
                    get availableAnimations() {
                      return this.loaded ? this[Wd].animationNames : [];
                    }
                    get duration() {
                      return this[Wd].duration;
                    }
                    get paused() {
                      return this[gg];
                    }
                    get currentTime() {
                      return this[Wd].animationTime;
                    }
                    get appendedAnimations() {
                      return this[Wd].appendedAnimations;
                    }
                    set currentTime(e) {
                      ((this[Wd].animationTime = e), this[$d]());
                    }
                    get timeScale() {
                      return this[Wd].animationTimeScale;
                    }
                    set timeScale(e) {
                      this[Wd].animationTimeScale = e;
                    }
                    pause() {
                      this[gg] || ((this[gg] = !0), this.dispatchEvent(new CustomEvent('pause')));
                    }
                    play(e) {
                      this.availableAnimations.length > 0 &&
                        ((this[gg] = !1), this[cg](e), this.dispatchEvent(new CustomEvent('play')));
                    }
                    appendAnimation(e, t) {
                      this.availableAnimations.length > 0 &&
                        ((this[gg] = !1),
                        this[hg](e, t),
                        this.dispatchEvent(new CustomEvent('append-animation')));
                    }
                    detachAnimation(e, t) {
                      this.availableAnimations.length > 0 &&
                        ((this[gg] = !1),
                        this[dg](e, t),
                        this.dispatchEvent(new CustomEvent('detach-animation')));
                    }
                    [((t = gg), Zd)]() {
                      (super[Zd](),
                        (this[gg] = !0),
                        null != this.animationName && this[cg](),
                        this.autoplay && this.play());
                    }
                    [Xd](e, t) {
                      (super[Xd](e, t),
                        this[gg] ||
                          (!this[ng]() && !this[tg].isPresenting) ||
                          (this[Wd].updateAnimation(t / 1e3), this[$d]()));
                    }
                    updated(e) {
                      (super.updated(e),
                        e.has('autoplay') && this.autoplay && this.play(),
                        e.has('animationName') && this[cg]());
                    }
                    [cg](e = ug) {
                      var t;
                      const i = null !== (t = e.repetitions) && void 0 !== t ? t : 1 / 0,
                        s = e.pingpong ? kt : 1 === i ? Lt : Ft;
                      (this[Wd].playAnimation(
                        this.animationName,
                        this.animationCrossfadeDuration / 1e3,
                        s,
                        i
                      ),
                        this[gg] && (this[Wd].updateAnimation(0), this[$d]()));
                    }
                    [hg](e = '', t = pg) {
                      var i;
                      const s = null !== (i = t.repetitions) && void 0 !== i ? i : 1 / 0,
                        n = t.pingpong ? kt : 1 === s ? Lt : Ft,
                        a = !!t.repetitions || 'pingpong' in t;
                      (this[Wd].appendAnimation(
                        e || this.animationName,
                        n,
                        s,
                        t.weight,
                        t.timeScale,
                        t.fade,
                        t.warp,
                        t.relativeWarp,
                        t.time,
                        a
                      ),
                        this[gg] && (this[Wd].updateAnimation(0), this[$d]()));
                    }
                    [dg](e = '', t = mg) {
                      (this[Wd].detachAnimation(e || this.animationName, t.fade),
                        this[gg] && (this[Wd].updateAnimation(0), this[$d]()));
                    }
                  }
                  return (
                    lg([ai({ type: Boolean })], i.prototype, 'autoplay', void 0),
                    lg(
                      [ai({ type: String, attribute: 'animation-name' })],
                      i.prototype,
                      'animationName',
                      void 0
                    ),
                    lg(
                      [ai({ type: Number, attribute: 'animation-crossfade-duration' })],
                      i.prototype,
                      'animationCrossfadeDuration',
                      void 0
                    ),
                    i
                  );
                })(Ag)
              )
            )
          )
        )
      )
    )
  );
customElements.define('model-viewer', wp);
