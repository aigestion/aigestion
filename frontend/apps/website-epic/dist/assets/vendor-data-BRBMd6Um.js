var e,
  t,
  s,
  r,
  n,
  i,
  a,
  o,
  c,
  l,
  h,
  u,
  d,
  p,
  f,
  g,
  y,
  m,
  w,
  v,
  b,
  _,
  k,
  S,
  T,
  E,
  O,
  R,
  A,
  P,
  j,
  I,
  $,
  C,
  x,
  N,
  U,
  D,
  q,
  L,
  B,
  M,
  K,
  W,
  F,
  H = e => {
    throw TypeError(e);
  },
  G = (e, t, s) => t.has(e) || H('Cannot ' + s),
  J = (e, t, s) => (G(e, t, 'read from private field'), s ? s.call(e) : t.get(e)),
  V = (e, t, s) =>
    t.has(e)
      ? H('Cannot add the same private member more than once')
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, s),
  z = (e, t, s, r) => (G(e, t, 'write to private field'), r ? r.call(e, s) : t.set(e, s), s),
  Q = (e, t, s) => (G(e, t, 'access private method'), s),
  Y = (e, t, s, r) => ({
    set _(r) {
      z(e, t, r, s);
    },
    get _() {
      return J(e, t, r);
    },
  });
import { r as X } from './vendor-react-DzSuaLpV.js';
import { j as Z } from './vendor-3d-BTgeB28l.js';
function ee(e, t) {
  var s = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (s[r] = e[r]);
  if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
    var n = 0;
    for (r = Object.getOwnPropertySymbols(e); n < r.length; n++)
      t.indexOf(r[n]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[n]) &&
        (s[r[n]] = e[r[n]]);
  }
  return s;
}
function te(e, t, s, r) {
  return new (s || (s = Promise))(function (n, i) {
    function a(e) {
      try {
        c(r.next(e));
      } catch (t) {
        i(t);
      }
    }
    function o(e) {
      try {
        c(r.throw(e));
      } catch (t) {
        i(t);
      }
    }
    function c(e) {
      var t;
      e.done
        ? n(e.value)
        : ((t = e.value),
          t instanceof s
            ? t
            : new s(function (e) {
                e(t);
              })).then(a, o);
    }
    c((r = r.apply(e, t || [])).next());
  });
}
'function' == typeof SuppressedError && SuppressedError;
class se extends Error {
  constructor(e, t = 'FunctionsError', s) {
    (super(e), (this.name = t), (this.context = s));
  }
}
class re extends se {
  constructor(e) {
    super('Failed to send a request to the Edge Function', 'FunctionsFetchError', e);
  }
}
class ne extends se {
  constructor(e) {
    super('Relay Error invoking the Edge Function', 'FunctionsRelayError', e);
  }
}
class ie extends se {
  constructor(e) {
    super('Edge Function returned a non-2xx status code', 'FunctionsHttpError', e);
  }
}
var ae, oe;
(((oe = ae || (ae = {})).Any = 'any'),
  (oe.ApNortheast1 = 'ap-northeast-1'),
  (oe.ApNortheast2 = 'ap-northeast-2'),
  (oe.ApSouth1 = 'ap-south-1'),
  (oe.ApSoutheast1 = 'ap-southeast-1'),
  (oe.ApSoutheast2 = 'ap-southeast-2'),
  (oe.CaCentral1 = 'ca-central-1'),
  (oe.EuCentral1 = 'eu-central-1'),
  (oe.EuWest1 = 'eu-west-1'),
  (oe.EuWest2 = 'eu-west-2'),
  (oe.EuWest3 = 'eu-west-3'),
  (oe.SaEast1 = 'sa-east-1'),
  (oe.UsEast1 = 'us-east-1'),
  (oe.UsWest1 = 'us-west-1'),
  (oe.UsWest2 = 'us-west-2'));
class ce {
  constructor(e, { headers: t = {}, customFetch: s, region: r = ae.Any } = {}) {
    ((this.url = e),
      (this.headers = t),
      (this.region = r),
      (this.fetch = (e => (e ? (...t) => e(...t) : (...e) => fetch(...e)))(s)));
  }
  setAuth(e) {
    this.headers.Authorization = `Bearer ${e}`;
  }
  invoke(e) {
    return te(this, arguments, void 0, function* (e, t = {}) {
      var s;
      let r, n;
      try {
        const { headers: i, method: a, body: o, signal: c, timeout: l } = t;
        let h = {},
          { region: u } = t;
        u || (u = this.region);
        const d = new URL(`${this.url}/${e}`);
        let p;
        (u && 'any' !== u && ((h['x-region'] = u), d.searchParams.set('forceFunctionRegion', u)),
          o && ((i && !Object.prototype.hasOwnProperty.call(i, 'Content-Type')) || !i)
            ? ('undefined' != typeof Blob && o instanceof Blob) || o instanceof ArrayBuffer
              ? ((h['Content-Type'] = 'application/octet-stream'), (p = o))
              : 'string' == typeof o
                ? ((h['Content-Type'] = 'text/plain'), (p = o))
                : 'undefined' != typeof FormData && o instanceof FormData
                  ? (p = o)
                  : ((h['Content-Type'] = 'application/json'), (p = JSON.stringify(o)))
            : (p =
                !o ||
                'string' == typeof o ||
                ('undefined' != typeof Blob && o instanceof Blob) ||
                o instanceof ArrayBuffer ||
                ('undefined' != typeof FormData && o instanceof FormData)
                  ? o
                  : JSON.stringify(o)));
        let f = c;
        l &&
          ((n = new AbortController()),
          (r = setTimeout(() => n.abort(), l)),
          c ? ((f = n.signal), c.addEventListener('abort', () => n.abort())) : (f = n.signal));
        const g = yield this.fetch(d.toString(), {
            method: a || 'POST',
            headers: Object.assign(Object.assign(Object.assign({}, h), this.headers), i),
            body: p,
            signal: f,
          }).catch(e => {
            throw new re(e);
          }),
          y = g.headers.get('x-relay-error');
        if (y && 'true' === y) throw new ne(g);
        if (!g.ok) throw new ie(g);
        let m,
          w = (null !== (s = g.headers.get('Content-Type')) && void 0 !== s ? s : 'text/plain')
            .split(';')[0]
            .trim();
        return (
          (m =
            'application/json' === w
              ? yield g.json()
              : 'application/octet-stream' === w || 'application/pdf' === w
                ? yield g.blob()
                : 'text/event-stream' === w
                  ? g
                  : 'multipart/form-data' === w
                    ? yield g.formData()
                    : yield g.text()),
          { data: m, error: null, response: g }
        );
      } catch (i) {
        return {
          data: null,
          error: i,
          response: i instanceof ie || i instanceof ne ? i.context : void 0,
        };
      } finally {
        r && clearTimeout(r);
      }
    });
  }
}
var le = class extends Error {
    constructor(e) {
      (super(e.message),
        (this.name = 'PostgrestError'),
        (this.details = e.details),
        (this.hint = e.hint),
        (this.code = e.code));
    }
  },
  he = class {
    constructor(e) {
      var t, s;
      ((this.shouldThrowOnError = !1),
        (this.method = e.method),
        (this.url = e.url),
        (this.headers = new Headers(e.headers)),
        (this.schema = e.schema),
        (this.body = e.body),
        (this.shouldThrowOnError = null !== (t = e.shouldThrowOnError) && void 0 !== t && t),
        (this.signal = e.signal),
        (this.isMaybeSingle = null !== (s = e.isMaybeSingle) && void 0 !== s && s),
        e.fetch ? (this.fetch = e.fetch) : (this.fetch = fetch));
    }
    throwOnError() {
      return ((this.shouldThrowOnError = !0), this);
    }
    setHeader(e, t) {
      return ((this.headers = new Headers(this.headers)), this.headers.set(e, t), this);
    }
    then(e, t) {
      var s = this;
      (void 0 === this.schema ||
        (['GET', 'HEAD'].includes(this.method)
          ? this.headers.set('Accept-Profile', this.schema)
          : this.headers.set('Content-Profile', this.schema)),
        'GET' !== this.method &&
          'HEAD' !== this.method &&
          this.headers.set('Content-Type', 'application/json'));
      let r = (0, this.fetch)(this.url.toString(), {
        method: this.method,
        headers: this.headers,
        body: JSON.stringify(this.body),
        signal: this.signal,
      }).then(async e => {
        let t = null,
          r = null,
          n = null,
          i = e.status,
          a = e.statusText;
        if (e.ok) {
          var o, c;
          if ('HEAD' !== s.method) {
            var l;
            const t = await e.text();
            '' === t ||
              (r =
                'text/csv' === s.headers.get('Accept') ||
                (s.headers.get('Accept') &&
                  (null === (l = s.headers.get('Accept')) || void 0 === l
                    ? void 0
                    : l.includes('application/vnd.pgrst.plan+text')))
                  ? t
                  : JSON.parse(t));
          }
          const h =
              null === (o = s.headers.get('Prefer')) || void 0 === o
                ? void 0
                : o.match(/count=(exact|planned|estimated)/),
            u =
              null === (c = e.headers.get('content-range')) || void 0 === c ? void 0 : c.split('/');
          (h && u && u.length > 1 && (n = parseInt(u[1])),
            s.isMaybeSingle &&
              'GET' === s.method &&
              Array.isArray(r) &&
              (r.length > 1
                ? ((t = {
                    code: 'PGRST116',
                    details: `Results contain ${r.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                    hint: null,
                    message: 'JSON object requested, multiple (or no) rows returned',
                  }),
                  (r = null),
                  (n = null),
                  (i = 406),
                  (a = 'Not Acceptable'))
                : (r = 1 === r.length ? r[0] : null)));
        } else {
          var h;
          const n = await e.text();
          try {
            ((t = JSON.parse(n)),
              Array.isArray(t) &&
                404 === e.status &&
                ((r = []), (t = null), (i = 200), (a = 'OK')));
          } catch (u) {
            404 === e.status && '' === n ? ((i = 204), (a = 'No Content')) : (t = { message: n });
          }
          if (
            (t &&
              s.isMaybeSingle &&
              (null == t || null === (h = t.details) || void 0 === h
                ? void 0
                : h.includes('0 rows')) &&
              ((t = null), (i = 200), (a = 'OK')),
            t && s.shouldThrowOnError)
          )
            throw new le(t);
        }
        return { error: t, data: r, count: n, status: i, statusText: a };
      });
      return (
        this.shouldThrowOnError ||
          (r = r.catch(e => {
            var t;
            let s = '';
            const r = null == e ? void 0 : e.cause;
            if (r) {
              var n, i, a, o;
              const t = null !== (n = null == r ? void 0 : r.message) && void 0 !== n ? n : '',
                c = null !== (i = null == r ? void 0 : r.code) && void 0 !== i ? i : '';
              ((s = `${null !== (a = null == e ? void 0 : e.name) && void 0 !== a ? a : 'FetchError'}: ${null == e ? void 0 : e.message}`),
                (s += `\n\nCaused by: ${null !== (o = null == r ? void 0 : r.name) && void 0 !== o ? o : 'Error'}: ${t}`),
                c && (s += ` (${c})`),
                (null == r ? void 0 : r.stack) && (s += `\n${r.stack}`));
            } else {
              var c;
              s = null !== (c = null == e ? void 0 : e.stack) && void 0 !== c ? c : '';
            }
            return {
              error: {
                message: `${null !== (t = null == e ? void 0 : e.name) && void 0 !== t ? t : 'FetchError'}: ${null == e ? void 0 : e.message}`,
                details: s,
                hint: '',
                code: '',
              },
              data: null,
              count: null,
              status: 0,
              statusText: '',
            };
          })),
        r.then(e, t)
      );
    }
    returns() {
      return this;
    }
    overrideTypes() {
      return this;
    }
  },
  ue = class extends he {
    select(e) {
      let t = !1;
      const s = (null != e ? e : '*')
        .split('')
        .map(e => (/\s/.test(e) && !t ? '' : ('"' === e && (t = !t), e)))
        .join('');
      return (
        this.url.searchParams.set('select', s),
        this.headers.append('Prefer', 'return=representation'),
        this
      );
    }
    order(e, { ascending: t = !0, nullsFirst: s, foreignTable: r, referencedTable: n = r } = {}) {
      const i = n ? `${n}.order` : 'order',
        a = this.url.searchParams.get(i);
      return (
        this.url.searchParams.set(
          i,
          `${a ? `${a},` : ''}${e}.${t ? 'asc' : 'desc'}${void 0 === s ? '' : s ? '.nullsfirst' : '.nullslast'}`
        ),
        this
      );
    }
    limit(e, { foreignTable: t, referencedTable: s = t } = {}) {
      const r = void 0 === s ? 'limit' : `${s}.limit`;
      return (this.url.searchParams.set(r, `${e}`), this);
    }
    range(e, t, { foreignTable: s, referencedTable: r = s } = {}) {
      const n = void 0 === r ? 'offset' : `${r}.offset`,
        i = void 0 === r ? 'limit' : `${r}.limit`;
      return (
        this.url.searchParams.set(n, `${e}`),
        this.url.searchParams.set(i, '' + (t - e + 1)),
        this
      );
    }
    abortSignal(e) {
      return ((this.signal = e), this);
    }
    single() {
      return (this.headers.set('Accept', 'application/vnd.pgrst.object+json'), this);
    }
    maybeSingle() {
      return (
        'GET' === this.method
          ? this.headers.set('Accept', 'application/json')
          : this.headers.set('Accept', 'application/vnd.pgrst.object+json'),
        (this.isMaybeSingle = !0),
        this
      );
    }
    csv() {
      return (this.headers.set('Accept', 'text/csv'), this);
    }
    geojson() {
      return (this.headers.set('Accept', 'application/geo+json'), this);
    }
    explain({
      analyze: e = !1,
      verbose: t = !1,
      settings: s = !1,
      buffers: r = !1,
      wal: n = !1,
      format: i = 'text',
    } = {}) {
      var a;
      const o = [
          e ? 'analyze' : null,
          t ? 'verbose' : null,
          s ? 'settings' : null,
          r ? 'buffers' : null,
          n ? 'wal' : null,
        ]
          .filter(Boolean)
          .join('|'),
        c = null !== (a = this.headers.get('Accept')) && void 0 !== a ? a : 'application/json';
      return (
        this.headers.set('Accept', `application/vnd.pgrst.plan+${i}; for="${c}"; options=${o};`),
        this
      );
    }
    rollback() {
      return (this.headers.append('Prefer', 'tx=rollback'), this);
    }
    returns() {
      return this;
    }
    maxAffected(e) {
      return (
        this.headers.append('Prefer', 'handling=strict'),
        this.headers.append('Prefer', `max-affected=${e}`),
        this
      );
    }
  };
const de = new RegExp('[,()]');
var pe = class extends ue {
    eq(e, t) {
      return (this.url.searchParams.append(e, `eq.${t}`), this);
    }
    neq(e, t) {
      return (this.url.searchParams.append(e, `neq.${t}`), this);
    }
    gt(e, t) {
      return (this.url.searchParams.append(e, `gt.${t}`), this);
    }
    gte(e, t) {
      return (this.url.searchParams.append(e, `gte.${t}`), this);
    }
    lt(e, t) {
      return (this.url.searchParams.append(e, `lt.${t}`), this);
    }
    lte(e, t) {
      return (this.url.searchParams.append(e, `lte.${t}`), this);
    }
    like(e, t) {
      return (this.url.searchParams.append(e, `like.${t}`), this);
    }
    likeAllOf(e, t) {
      return (this.url.searchParams.append(e, `like(all).{${t.join(',')}}`), this);
    }
    likeAnyOf(e, t) {
      return (this.url.searchParams.append(e, `like(any).{${t.join(',')}}`), this);
    }
    ilike(e, t) {
      return (this.url.searchParams.append(e, `ilike.${t}`), this);
    }
    ilikeAllOf(e, t) {
      return (this.url.searchParams.append(e, `ilike(all).{${t.join(',')}}`), this);
    }
    ilikeAnyOf(e, t) {
      return (this.url.searchParams.append(e, `ilike(any).{${t.join(',')}}`), this);
    }
    regexMatch(e, t) {
      return (this.url.searchParams.append(e, `match.${t}`), this);
    }
    regexIMatch(e, t) {
      return (this.url.searchParams.append(e, `imatch.${t}`), this);
    }
    is(e, t) {
      return (this.url.searchParams.append(e, `is.${t}`), this);
    }
    isDistinct(e, t) {
      return (this.url.searchParams.append(e, `isdistinct.${t}`), this);
    }
    in(e, t) {
      const s = Array.from(new Set(t))
        .map(e => ('string' == typeof e && de.test(e) ? `"${e}"` : `${e}`))
        .join(',');
      return (this.url.searchParams.append(e, `in.(${s})`), this);
    }
    notIn(e, t) {
      const s = Array.from(new Set(t))
        .map(e => ('string' == typeof e && de.test(e) ? `"${e}"` : `${e}`))
        .join(',');
      return (this.url.searchParams.append(e, `not.in.(${s})`), this);
    }
    contains(e, t) {
      return (
        'string' == typeof t
          ? this.url.searchParams.append(e, `cs.${t}`)
          : Array.isArray(t)
            ? this.url.searchParams.append(e, `cs.{${t.join(',')}}`)
            : this.url.searchParams.append(e, `cs.${JSON.stringify(t)}`),
        this
      );
    }
    containedBy(e, t) {
      return (
        'string' == typeof t
          ? this.url.searchParams.append(e, `cd.${t}`)
          : Array.isArray(t)
            ? this.url.searchParams.append(e, `cd.{${t.join(',')}}`)
            : this.url.searchParams.append(e, `cd.${JSON.stringify(t)}`),
        this
      );
    }
    rangeGt(e, t) {
      return (this.url.searchParams.append(e, `sr.${t}`), this);
    }
    rangeGte(e, t) {
      return (this.url.searchParams.append(e, `nxl.${t}`), this);
    }
    rangeLt(e, t) {
      return (this.url.searchParams.append(e, `sl.${t}`), this);
    }
    rangeLte(e, t) {
      return (this.url.searchParams.append(e, `nxr.${t}`), this);
    }
    rangeAdjacent(e, t) {
      return (this.url.searchParams.append(e, `adj.${t}`), this);
    }
    overlaps(e, t) {
      return (
        'string' == typeof t
          ? this.url.searchParams.append(e, `ov.${t}`)
          : this.url.searchParams.append(e, `ov.{${t.join(',')}}`),
        this
      );
    }
    textSearch(e, t, { config: s, type: r } = {}) {
      let n = '';
      'plain' === r ? (n = 'pl') : 'phrase' === r ? (n = 'ph') : 'websearch' === r && (n = 'w');
      const i = void 0 === s ? '' : `(${s})`;
      return (this.url.searchParams.append(e, `${n}fts${i}.${t}`), this);
    }
    match(e) {
      return (
        Object.entries(e).forEach(([e, t]) => {
          this.url.searchParams.append(e, `eq.${t}`);
        }),
        this
      );
    }
    not(e, t, s) {
      return (this.url.searchParams.append(e, `not.${t}.${s}`), this);
    }
    or(e, { foreignTable: t, referencedTable: s = t } = {}) {
      const r = s ? `${s}.or` : 'or';
      return (this.url.searchParams.append(r, `(${e})`), this);
    }
    filter(e, t, s) {
      return (this.url.searchParams.append(e, `${t}.${s}`), this);
    }
  },
  fe = class {
    constructor(e, { headers: t = {}, schema: s, fetch: r }) {
      ((this.url = e), (this.headers = new Headers(t)), (this.schema = s), (this.fetch = r));
    }
    cloneRequestState() {
      return { url: new URL(this.url.toString()), headers: new Headers(this.headers) };
    }
    select(e, t) {
      const { head: s = !1, count: r } = null != t ? t : {},
        n = s ? 'HEAD' : 'GET';
      let i = !1;
      const a = (null != e ? e : '*')
          .split('')
          .map(e => (/\s/.test(e) && !i ? '' : ('"' === e && (i = !i), e)))
          .join(''),
        { url: o, headers: c } = this.cloneRequestState();
      return (
        o.searchParams.set('select', a),
        r && c.append('Prefer', `count=${r}`),
        new pe({ method: n, url: o, headers: c, schema: this.schema, fetch: this.fetch })
      );
    }
    insert(e, { count: t, defaultToNull: s = !0 } = {}) {
      var r;
      const { url: n, headers: i } = this.cloneRequestState();
      if (
        (t && i.append('Prefer', `count=${t}`),
        s || i.append('Prefer', 'missing=default'),
        Array.isArray(e))
      ) {
        const t = e.reduce((e, t) => e.concat(Object.keys(t)), []);
        if (t.length > 0) {
          const e = [...new Set(t)].map(e => `"${e}"`);
          n.searchParams.set('columns', e.join(','));
        }
      }
      return new pe({
        method: 'POST',
        url: n,
        headers: i,
        schema: this.schema,
        body: e,
        fetch: null !== (r = this.fetch) && void 0 !== r ? r : fetch,
      });
    }
    upsert(e, { onConflict: t, ignoreDuplicates: s = !1, count: r, defaultToNull: n = !0 } = {}) {
      var i;
      const { url: a, headers: o } = this.cloneRequestState();
      if (
        (o.append('Prefer', `resolution=${s ? 'ignore' : 'merge'}-duplicates`),
        void 0 !== t && a.searchParams.set('on_conflict', t),
        r && o.append('Prefer', `count=${r}`),
        n || o.append('Prefer', 'missing=default'),
        Array.isArray(e))
      ) {
        const t = e.reduce((e, t) => e.concat(Object.keys(t)), []);
        if (t.length > 0) {
          const e = [...new Set(t)].map(e => `"${e}"`);
          a.searchParams.set('columns', e.join(','));
        }
      }
      return new pe({
        method: 'POST',
        url: a,
        headers: o,
        schema: this.schema,
        body: e,
        fetch: null !== (i = this.fetch) && void 0 !== i ? i : fetch,
      });
    }
    update(e, { count: t } = {}) {
      var s;
      const { url: r, headers: n } = this.cloneRequestState();
      return (
        t && n.append('Prefer', `count=${t}`),
        new pe({
          method: 'PATCH',
          url: r,
          headers: n,
          schema: this.schema,
          body: e,
          fetch: null !== (s = this.fetch) && void 0 !== s ? s : fetch,
        })
      );
    }
    delete({ count: e } = {}) {
      var t;
      const { url: s, headers: r } = this.cloneRequestState();
      return (
        e && r.append('Prefer', `count=${e}`),
        new pe({
          method: 'DELETE',
          url: s,
          headers: r,
          schema: this.schema,
          fetch: null !== (t = this.fetch) && void 0 !== t ? t : fetch,
        })
      );
    }
  },
  ge = class e {
    constructor(e, { headers: t = {}, schema: s, fetch: r } = {}) {
      ((this.url = e), (this.headers = new Headers(t)), (this.schemaName = s), (this.fetch = r));
    }
    from(e) {
      if (!e || 'string' != typeof e || '' === e.trim())
        throw new Error('Invalid relation name: relation must be a non-empty string.');
      return new fe(new URL(`${this.url}/${e}`), {
        headers: new Headers(this.headers),
        schema: this.schemaName,
        fetch: this.fetch,
      });
    }
    schema(t) {
      return new e(this.url, { headers: this.headers, schema: t, fetch: this.fetch });
    }
    rpc(e, t = {}, { head: s = !1, get: r = !1, count: n } = {}) {
      var i;
      let a;
      const o = new URL(`${this.url}/rpc/${e}`);
      let c;
      const l = e => null !== e && 'object' == typeof e && (!Array.isArray(e) || e.some(l)),
        h = s && Object.values(t).some(l);
      h
        ? ((a = 'POST'), (c = t))
        : s || r
          ? ((a = s ? 'HEAD' : 'GET'),
            Object.entries(t)
              .filter(([e, t]) => void 0 !== t)
              .map(([e, t]) => [e, Array.isArray(t) ? `{${t.join(',')}}` : `${t}`])
              .forEach(([e, t]) => {
                o.searchParams.append(e, t);
              }))
          : ((a = 'POST'), (c = t));
      const u = new Headers(this.headers);
      return (
        h
          ? u.set('Prefer', n ? `count=${n},return=minimal` : 'return=minimal')
          : n && u.set('Prefer', `count=${n}`),
        new pe({
          method: a,
          url: o,
          headers: u,
          schema: this.schemaName,
          body: c,
          fetch: null !== (i = this.fetch) && void 0 !== i ? i : fetch,
        })
      );
    }
  };
class ye {
  constructor() {}
  static detectEnvironment() {
    var e;
    if ('undefined' != typeof WebSocket) return { type: 'native', constructor: WebSocket };
    if ('undefined' != typeof globalThis && void 0 !== globalThis.WebSocket)
      return { type: 'native', constructor: globalThis.WebSocket };
    if ('undefined' != typeof window && void 0 !== window.WebSocket)
      return { type: 'native', constructor: window.WebSocket };
    if (
      'undefined' != typeof globalThis &&
      void 0 !== globalThis.WebSocketPair &&
      void 0 === globalThis.WebSocket
    )
      return {
        type: 'cloudflare',
        error:
          'Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.',
        workaround:
          'Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime.',
      };
    if (
      ('undefined' != typeof globalThis && globalThis.EdgeRuntime) ||
      ('undefined' != typeof navigator &&
        (null === (e = navigator.userAgent) || void 0 === e ? void 0 : e.includes('Vercel-Edge')))
    )
      return {
        type: 'unsupported',
        error:
          'Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.',
        workaround:
          'Use serverless functions or a different deployment target for WebSocket functionality.',
      };
    const t = globalThis.process;
    if (t) {
      const e = t.versions;
      if (e && e.node) {
        const t = e.node,
          s = parseInt(t.replace(/^v/, '').split('.')[0]);
        return s >= 22
          ? void 0 !== globalThis.WebSocket
            ? { type: 'native', constructor: globalThis.WebSocket }
            : {
                type: 'unsupported',
                error: `Node.js ${s} detected but native WebSocket not found.`,
                workaround: 'Provide a WebSocket implementation via the transport option.',
              }
          : {
              type: 'unsupported',
              error: `Node.js ${s} detected without native WebSocket support.`,
              workaround:
                'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })',
            };
      }
    }
    return {
      type: 'unsupported',
      error: 'Unknown JavaScript runtime without WebSocket support.',
      workaround:
        "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation.",
    };
  }
  static getWebSocketConstructor() {
    const e = this.detectEnvironment();
    if (e.constructor) return e.constructor;
    let t = e.error || 'WebSocket not supported in this environment.';
    throw (e.workaround && (t += `\n\nSuggested solution: ${e.workaround}`), new Error(t));
  }
  static createWebSocket(e, t) {
    return new (this.getWebSocketConstructor())(e, t);
  }
  static isWebSocketSupported() {
    try {
      const e = this.detectEnvironment();
      return 'native' === e.type || 'ws' === e.type;
    } catch (e) {
      return !1;
    }
  }
}
const me = '2.0.0',
  we = me,
  ve = 1e4;
var be, _e, ke, Se, Te, Ee, Oe, Re, Ae, Pe, je;
(((_e = be || (be = {}))[(_e.connecting = 0)] = 'connecting'),
  (_e[(_e.open = 1)] = 'open'),
  (_e[(_e.closing = 2)] = 'closing'),
  (_e[(_e.closed = 3)] = 'closed'),
  ((Se = ke || (ke = {})).closed = 'closed'),
  (Se.errored = 'errored'),
  (Se.joined = 'joined'),
  (Se.joining = 'joining'),
  (Se.leaving = 'leaving'),
  ((Ee = Te || (Te = {})).close = 'phx_close'),
  (Ee.error = 'phx_error'),
  (Ee.join = 'phx_join'),
  (Ee.reply = 'phx_reply'),
  (Ee.leave = 'phx_leave'),
  (Ee.access_token = 'access_token'),
  ((Oe || (Oe = {})).websocket = 'websocket'),
  ((Ae = Re || (Re = {})).Connecting = 'connecting'),
  (Ae.Open = 'open'),
  (Ae.Closing = 'closing'),
  (Ae.Closed = 'closed'));
class Ie {
  constructor(e) {
    ((this.HEADER_LENGTH = 1),
      (this.USER_BROADCAST_PUSH_META_LENGTH = 6),
      (this.KINDS = { userBroadcastPush: 3, userBroadcast: 4 }),
      (this.BINARY_ENCODING = 0),
      (this.JSON_ENCODING = 1),
      (this.BROADCAST_EVENT = 'broadcast'),
      (this.allowedMetadataKeys = []),
      (this.allowedMetadataKeys = null != e ? e : []));
  }
  encode(e, t) {
    if (
      e.event === this.BROADCAST_EVENT &&
      !(e.payload instanceof ArrayBuffer) &&
      'string' == typeof e.payload.event
    )
      return t(this._binaryEncodeUserBroadcastPush(e));
    let s = [e.join_ref, e.ref, e.topic, e.event, e.payload];
    return t(JSON.stringify(s));
  }
  _binaryEncodeUserBroadcastPush(e) {
    var t;
    return this._isArrayBuffer(null === (t = e.payload) || void 0 === t ? void 0 : t.payload)
      ? this._encodeBinaryUserBroadcastPush(e)
      : this._encodeJsonUserBroadcastPush(e);
  }
  _encodeBinaryUserBroadcastPush(e) {
    var t, s;
    const r =
      null !== (s = null === (t = e.payload) || void 0 === t ? void 0 : t.payload) && void 0 !== s
        ? s
        : new ArrayBuffer(0);
    return this._encodeUserBroadcastPush(e, this.BINARY_ENCODING, r);
  }
  _encodeJsonUserBroadcastPush(e) {
    var t, s;
    const r =
        null !== (s = null === (t = e.payload) || void 0 === t ? void 0 : t.payload) && void 0 !== s
          ? s
          : {},
      n = new TextEncoder().encode(JSON.stringify(r)).buffer;
    return this._encodeUserBroadcastPush(e, this.JSON_ENCODING, n);
  }
  _encodeUserBroadcastPush(e, t, s) {
    var r, n;
    const i = e.topic,
      a = null !== (r = e.ref) && void 0 !== r ? r : '',
      o = null !== (n = e.join_ref) && void 0 !== n ? n : '',
      c = e.payload.event,
      l = this.allowedMetadataKeys ? this._pick(e.payload, this.allowedMetadataKeys) : {},
      h = 0 === Object.keys(l).length ? '' : JSON.stringify(l);
    if (o.length > 255) throw new Error(`joinRef length ${o.length} exceeds maximum of 255`);
    if (a.length > 255) throw new Error(`ref length ${a.length} exceeds maximum of 255`);
    if (i.length > 255) throw new Error(`topic length ${i.length} exceeds maximum of 255`);
    if (c.length > 255) throw new Error(`userEvent length ${c.length} exceeds maximum of 255`);
    if (h.length > 255) throw new Error(`metadata length ${h.length} exceeds maximum of 255`);
    const u =
        this.USER_BROADCAST_PUSH_META_LENGTH + o.length + a.length + i.length + c.length + h.length,
      d = new ArrayBuffer(this.HEADER_LENGTH + u);
    let p = new DataView(d),
      f = 0;
    (p.setUint8(f++, this.KINDS.userBroadcastPush),
      p.setUint8(f++, o.length),
      p.setUint8(f++, a.length),
      p.setUint8(f++, i.length),
      p.setUint8(f++, c.length),
      p.setUint8(f++, h.length),
      p.setUint8(f++, t),
      Array.from(o, e => p.setUint8(f++, e.charCodeAt(0))),
      Array.from(a, e => p.setUint8(f++, e.charCodeAt(0))),
      Array.from(i, e => p.setUint8(f++, e.charCodeAt(0))),
      Array.from(c, e => p.setUint8(f++, e.charCodeAt(0))),
      Array.from(h, e => p.setUint8(f++, e.charCodeAt(0))));
    var g = new Uint8Array(d.byteLength + s.byteLength);
    return (g.set(new Uint8Array(d), 0), g.set(new Uint8Array(s), d.byteLength), g.buffer);
  }
  decode(e, t) {
    if (this._isArrayBuffer(e)) {
      return t(this._binaryDecode(e));
    }
    if ('string' == typeof e) {
      const s = JSON.parse(e),
        [r, n, i, a, o] = s;
      return t({ join_ref: r, ref: n, topic: i, event: a, payload: o });
    }
    return t({});
  }
  _binaryDecode(e) {
    const t = new DataView(e),
      s = t.getUint8(0),
      r = new TextDecoder();
    if (s === this.KINDS.userBroadcast) return this._decodeUserBroadcast(e, t, r);
  }
  _decodeUserBroadcast(e, t, s) {
    const r = t.getUint8(1),
      n = t.getUint8(2),
      i = t.getUint8(3),
      a = t.getUint8(4);
    let o = this.HEADER_LENGTH + 4;
    const c = s.decode(e.slice(o, o + r));
    o += r;
    const l = s.decode(e.slice(o, o + n));
    o += n;
    const h = s.decode(e.slice(o, o + i));
    o += i;
    const u = e.slice(o, e.byteLength),
      d = a === this.JSON_ENCODING ? JSON.parse(s.decode(u)) : u,
      p = { type: this.BROADCAST_EVENT, event: l, payload: d };
    return (
      i > 0 && (p.meta = JSON.parse(h)),
      { join_ref: null, ref: null, topic: c, event: this.BROADCAST_EVENT, payload: p }
    );
  }
  _isArrayBuffer(e) {
    var t;
    return (
      e instanceof ArrayBuffer ||
      'ArrayBuffer' ===
        (null === (t = null == e ? void 0 : e.constructor) || void 0 === t ? void 0 : t.name)
    );
  }
  _pick(e, t) {
    return e && 'object' == typeof e
      ? Object.fromEntries(Object.entries(e).filter(([e]) => t.includes(e)))
      : {};
  }
}
class $e {
  constructor(e, t) {
    ((this.callback = e),
      (this.timerCalc = t),
      (this.timer = void 0),
      (this.tries = 0),
      (this.callback = e),
      (this.timerCalc = t));
  }
  reset() {
    ((this.tries = 0), clearTimeout(this.timer), (this.timer = void 0));
  }
  scheduleTimeout() {
    (clearTimeout(this.timer),
      (this.timer = setTimeout(
        () => {
          ((this.tries = this.tries + 1), this.callback());
        },
        this.timerCalc(this.tries + 1)
      )));
  }
}
(((je = Pe || (Pe = {})).abstime = 'abstime'),
  (je.bool = 'bool'),
  (je.date = 'date'),
  (je.daterange = 'daterange'),
  (je.float4 = 'float4'),
  (je.float8 = 'float8'),
  (je.int2 = 'int2'),
  (je.int4 = 'int4'),
  (je.int4range = 'int4range'),
  (je.int8 = 'int8'),
  (je.int8range = 'int8range'),
  (je.json = 'json'),
  (je.jsonb = 'jsonb'),
  (je.money = 'money'),
  (je.numeric = 'numeric'),
  (je.oid = 'oid'),
  (je.reltime = 'reltime'),
  (je.text = 'text'),
  (je.time = 'time'),
  (je.timestamp = 'timestamp'),
  (je.timestamptz = 'timestamptz'),
  (je.timetz = 'timetz'),
  (je.tsrange = 'tsrange'),
  (je.tstzrange = 'tstzrange'));
const Ce = (e, t, s = {}) => {
    var r;
    const n = null !== (r = s.skipTypes) && void 0 !== r ? r : [];
    return t ? Object.keys(t).reduce((s, r) => ((s[r] = xe(r, e, t, n)), s), {}) : {};
  },
  xe = (e, t, s, r) => {
    const n = t.find(t => t.name === e),
      i = null == n ? void 0 : n.type,
      a = s[e];
    return i && !r.includes(i) ? Ne(i, a) : Ue(a);
  },
  Ne = (e, t) => {
    if ('_' === e.charAt(0)) {
      const s = e.slice(1, e.length);
      return Be(t, s);
    }
    switch (e) {
      case Pe.bool:
        return De(t);
      case Pe.float4:
      case Pe.float8:
      case Pe.int2:
      case Pe.int4:
      case Pe.int8:
      case Pe.numeric:
      case Pe.oid:
        return qe(t);
      case Pe.json:
      case Pe.jsonb:
        return Le(t);
      case Pe.timestamp:
        return Me(t);
      case Pe.abstime:
      case Pe.date:
      case Pe.daterange:
      case Pe.int4range:
      case Pe.int8range:
      case Pe.money:
      case Pe.reltime:
      case Pe.text:
      case Pe.time:
      case Pe.timestamptz:
      case Pe.timetz:
      case Pe.tsrange:
      case Pe.tstzrange:
      default:
        return Ue(t);
    }
  },
  Ue = e => e,
  De = e => {
    switch (e) {
      case 't':
        return !0;
      case 'f':
        return !1;
      default:
        return e;
    }
  },
  qe = e => {
    if ('string' == typeof e) {
      const t = parseFloat(e);
      if (!Number.isNaN(t)) return t;
    }
    return e;
  },
  Le = e => {
    if ('string' == typeof e)
      try {
        return JSON.parse(e);
      } catch (t) {
        return e;
      }
    return e;
  },
  Be = (e, t) => {
    if ('string' != typeof e) return e;
    const s = e.length - 1,
      r = e[s];
    if ('{' === e[0] && '}' === r) {
      let r;
      const i = e.slice(1, s);
      try {
        r = JSON.parse('[' + i + ']');
      } catch (n) {
        r = i ? i.split(',') : [];
      }
      return r.map(e => Ne(t, e));
    }
    return e;
  },
  Me = e => ('string' == typeof e ? e.replace(' ', 'T') : e),
  Ke = e => {
    const t = new URL(e);
    return (
      (t.protocol = t.protocol.replace(/^ws/i, 'http')),
      (t.pathname = t.pathname
        .replace(/\/+$/, '')
        .replace(/\/socket\/websocket$/i, '')
        .replace(/\/socket$/i, '')
        .replace(/\/websocket$/i, '')),
      '' === t.pathname || '/' === t.pathname
        ? (t.pathname = '/api/broadcast')
        : (t.pathname = t.pathname + '/api/broadcast'),
      t.href
    );
  };
class We {
  constructor(e, t, s = {}, r = 1e4) {
    ((this.channel = e),
      (this.event = t),
      (this.payload = s),
      (this.timeout = r),
      (this.sent = !1),
      (this.timeoutTimer = void 0),
      (this.ref = ''),
      (this.receivedResp = null),
      (this.recHooks = []),
      (this.refEvent = null));
  }
  resend(e) {
    ((this.timeout = e),
      this._cancelRefEvent(),
      (this.ref = ''),
      (this.refEvent = null),
      (this.receivedResp = null),
      (this.sent = !1),
      this.send());
  }
  send() {
    this._hasReceived('timeout') ||
      (this.startTimeout(),
      (this.sent = !0),
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload,
        ref: this.ref,
        join_ref: this.channel._joinRef(),
      }));
  }
  updatePayload(e) {
    this.payload = Object.assign(Object.assign({}, this.payload), e);
  }
  receive(e, t) {
    var s;
    return (
      this._hasReceived(e) &&
        t(null === (s = this.receivedResp) || void 0 === s ? void 0 : s.response),
      this.recHooks.push({ status: e, callback: t }),
      this
    );
  }
  startTimeout() {
    if (this.timeoutTimer) return;
    ((this.ref = this.channel.socket._makeRef()),
      (this.refEvent = this.channel._replyEventName(this.ref)));
    (this.channel._on(this.refEvent, {}, e => {
      (this._cancelRefEvent(),
        this._cancelTimeout(),
        (this.receivedResp = e),
        this._matchReceive(e));
    }),
      (this.timeoutTimer = setTimeout(() => {
        this.trigger('timeout', {});
      }, this.timeout)));
  }
  trigger(e, t) {
    this.refEvent && this.channel._trigger(this.refEvent, { status: e, response: t });
  }
  destroy() {
    (this._cancelRefEvent(), this._cancelTimeout());
  }
  _cancelRefEvent() {
    this.refEvent && this.channel._off(this.refEvent, {});
  }
  _cancelTimeout() {
    (clearTimeout(this.timeoutTimer), (this.timeoutTimer = void 0));
  }
  _matchReceive({ status: e, response: t }) {
    this.recHooks.filter(t => t.status === e).forEach(e => e.callback(t));
  }
  _hasReceived(e) {
    return this.receivedResp && this.receivedResp.status === e;
  }
}
var Fe, He, Ge, Je, Ve, ze, Qe, Ye;
(((He = Fe || (Fe = {})).SYNC = 'sync'), (He.JOIN = 'join'), (He.LEAVE = 'leave'));
class Xe {
  constructor(e, t) {
    ((this.channel = e),
      (this.state = {}),
      (this.pendingDiffs = []),
      (this.joinRef = null),
      (this.enabled = !1),
      (this.caller = { onJoin: () => {}, onLeave: () => {}, onSync: () => {} }));
    const s = (null == t ? void 0 : t.events) || { state: 'presence_state', diff: 'presence_diff' };
    (this.channel._on(s.state, {}, e => {
      const { onJoin: t, onLeave: s, onSync: r } = this.caller;
      ((this.joinRef = this.channel._joinRef()),
        (this.state = Xe.syncState(this.state, e, t, s)),
        this.pendingDiffs.forEach(e => {
          this.state = Xe.syncDiff(this.state, e, t, s);
        }),
        (this.pendingDiffs = []),
        r());
    }),
      this.channel._on(s.diff, {}, e => {
        const { onJoin: t, onLeave: s, onSync: r } = this.caller;
        this.inPendingSyncState()
          ? this.pendingDiffs.push(e)
          : ((this.state = Xe.syncDiff(this.state, e, t, s)), r());
      }),
      this.onJoin((e, t, s) => {
        this.channel._trigger('presence', {
          event: 'join',
          key: e,
          currentPresences: t,
          newPresences: s,
        });
      }),
      this.onLeave((e, t, s) => {
        this.channel._trigger('presence', {
          event: 'leave',
          key: e,
          currentPresences: t,
          leftPresences: s,
        });
      }),
      this.onSync(() => {
        this.channel._trigger('presence', { event: 'sync' });
      }));
  }
  static syncState(e, t, s, r) {
    const n = this.cloneDeep(e),
      i = this.transformState(t),
      a = {},
      o = {};
    return (
      this.map(n, (e, t) => {
        i[e] || (o[e] = t);
      }),
      this.map(i, (e, t) => {
        const s = n[e];
        if (s) {
          const r = t.map(e => e.presence_ref),
            n = s.map(e => e.presence_ref),
            i = t.filter(e => n.indexOf(e.presence_ref) < 0),
            c = s.filter(e => r.indexOf(e.presence_ref) < 0);
          (i.length > 0 && (a[e] = i), c.length > 0 && (o[e] = c));
        } else a[e] = t;
      }),
      this.syncDiff(n, { joins: a, leaves: o }, s, r)
    );
  }
  static syncDiff(e, t, s, r) {
    const { joins: n, leaves: i } = {
      joins: this.transformState(t.joins),
      leaves: this.transformState(t.leaves),
    };
    return (
      s || (s = () => {}),
      r || (r = () => {}),
      this.map(n, (t, r) => {
        var n;
        const i = null !== (n = e[t]) && void 0 !== n ? n : [];
        if (((e[t] = this.cloneDeep(r)), i.length > 0)) {
          const s = e[t].map(e => e.presence_ref),
            r = i.filter(e => s.indexOf(e.presence_ref) < 0);
          e[t].unshift(...r);
        }
        s(t, i, r);
      }),
      this.map(i, (t, s) => {
        let n = e[t];
        if (!n) return;
        const i = s.map(e => e.presence_ref);
        ((n = n.filter(e => i.indexOf(e.presence_ref) < 0)),
          (e[t] = n),
          r(t, n, s),
          0 === n.length && delete e[t]);
      }),
      e
    );
  }
  static map(e, t) {
    return Object.getOwnPropertyNames(e).map(s => t(s, e[s]));
  }
  static transformState(e) {
    return (
      (e = this.cloneDeep(e)),
      Object.getOwnPropertyNames(e).reduce((t, s) => {
        const r = e[s];
        return (
          (t[s] =
            'metas' in r
              ? r.metas.map(
                  e => ((e.presence_ref = e.phx_ref), delete e.phx_ref, delete e.phx_ref_prev, e)
                )
              : r),
          t
        );
      }, {})
    );
  }
  static cloneDeep(e) {
    return JSON.parse(JSON.stringify(e));
  }
  onJoin(e) {
    this.caller.onJoin = e;
  }
  onLeave(e) {
    this.caller.onLeave = e;
  }
  onSync(e) {
    this.caller.onSync = e;
  }
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel._joinRef();
  }
}
(((Je = Ge || (Ge = {})).ALL = '*'),
  (Je.INSERT = 'INSERT'),
  (Je.UPDATE = 'UPDATE'),
  (Je.DELETE = 'DELETE'),
  ((ze = Ve || (Ve = {})).BROADCAST = 'broadcast'),
  (ze.PRESENCE = 'presence'),
  (ze.POSTGRES_CHANGES = 'postgres_changes'),
  (ze.SYSTEM = 'system'),
  ((Ye = Qe || (Qe = {})).SUBSCRIBED = 'SUBSCRIBED'),
  (Ye.TIMED_OUT = 'TIMED_OUT'),
  (Ye.CLOSED = 'CLOSED'),
  (Ye.CHANNEL_ERROR = 'CHANNEL_ERROR'));
class Ze {
  constructor(e, t = { config: {} }, s) {
    var r, n;
    if (
      ((this.topic = e),
      (this.params = t),
      (this.socket = s),
      (this.bindings = {}),
      (this.state = ke.closed),
      (this.joinedOnce = !1),
      (this.pushBuffer = []),
      (this.subTopic = e.replace(/^realtime:/i, '')),
      (this.params.config = Object.assign(
        { broadcast: { ack: !1, self: !1 }, presence: { key: '', enabled: !1 }, private: !1 },
        t.config
      )),
      (this.timeout = this.socket.timeout),
      (this.joinPush = new We(this, Te.join, this.params, this.timeout)),
      (this.rejoinTimer = new $e(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs)),
      this.joinPush.receive('ok', () => {
        ((this.state = ke.joined),
          this.rejoinTimer.reset(),
          this.pushBuffer.forEach(e => e.send()),
          (this.pushBuffer = []));
      }),
      this._onClose(() => {
        (this.rejoinTimer.reset(),
          this.socket.log('channel', `close ${this.topic} ${this._joinRef()}`),
          (this.state = ke.closed),
          this.socket._remove(this));
      }),
      this._onError(e => {
        this._isLeaving() ||
          this._isClosed() ||
          (this.socket.log('channel', `error ${this.topic}`, e),
          (this.state = ke.errored),
          this.rejoinTimer.scheduleTimeout());
      }),
      this.joinPush.receive('timeout', () => {
        this._isJoining() &&
          (this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout),
          (this.state = ke.errored),
          this.rejoinTimer.scheduleTimeout());
      }),
      this.joinPush.receive('error', e => {
        this._isLeaving() ||
          this._isClosed() ||
          (this.socket.log('channel', `error ${this.topic}`, e),
          (this.state = ke.errored),
          this.rejoinTimer.scheduleTimeout());
      }),
      this._on(Te.reply, {}, (e, t) => {
        this._trigger(this._replyEventName(t), e);
      }),
      (this.presence = new Xe(this)),
      (this.broadcastEndpointURL = Ke(this.socket.endPoint)),
      (this.private = this.params.config.private || !1),
      !this.private &&
        (null === (n = null === (r = this.params.config) || void 0 === r ? void 0 : r.broadcast) ||
        void 0 === n
          ? void 0
          : n.replay))
    )
      throw `tried to use replay on public channel '${this.topic}'. It must be a private channel.`;
  }
  subscribe(e, t = this.timeout) {
    var s, r, n;
    if ((this.socket.isConnected() || this.socket.connect(), this.state == ke.closed)) {
      const {
          config: { broadcast: i, presence: a, private: o },
        } = this.params,
        c =
          null !==
            (r =
              null === (s = this.bindings.postgres_changes) || void 0 === s
                ? void 0
                : s.map(e => e.filter)) && void 0 !== r
            ? r
            : [],
        l =
          (!!this.bindings[Ve.PRESENCE] && this.bindings[Ve.PRESENCE].length > 0) ||
          !0 === (null === (n = this.params.config.presence) || void 0 === n ? void 0 : n.enabled),
        h = {},
        u = {
          broadcast: i,
          presence: Object.assign(Object.assign({}, a), { enabled: l }),
          postgres_changes: c,
          private: o,
        };
      (this.socket.accessTokenValue && (h.access_token = this.socket.accessTokenValue),
        this._onError(t => (null == e ? void 0 : e(Qe.CHANNEL_ERROR, t))),
        this._onClose(() => (null == e ? void 0 : e(Qe.CLOSED))),
        this.updateJoinPayload(Object.assign({ config: u }, h)),
        (this.joinedOnce = !0),
        this._rejoin(t),
        this.joinPush
          .receive('ok', async ({ postgres_changes: t }) => {
            var s;
            if ((this.socket._isManualToken() || this.socket.setAuth(), void 0 !== t)) {
              const r = this.bindings.postgres_changes,
                n = null !== (s = null == r ? void 0 : r.length) && void 0 !== s ? s : 0,
                i = [];
              for (let s = 0; s < n; s++) {
                const n = r[s],
                  {
                    filter: { event: a, schema: o, table: c, filter: l },
                  } = n,
                  h = t && t[s];
                if (
                  !(
                    h &&
                    h.event === a &&
                    Ze.isFilterValueEqual(h.schema, o) &&
                    Ze.isFilterValueEqual(h.table, c) &&
                    Ze.isFilterValueEqual(h.filter, l)
                  )
                )
                  return (
                    this.unsubscribe(),
                    (this.state = ke.errored),
                    void (
                      null == e ||
                      e(
                        Qe.CHANNEL_ERROR,
                        new Error(
                          'mismatch between server and client bindings for postgres changes'
                        )
                      )
                    )
                  );
                i.push(Object.assign(Object.assign({}, n), { id: h.id }));
              }
              return ((this.bindings.postgres_changes = i), void (e && e(Qe.SUBSCRIBED)));
            }
            null == e || e(Qe.SUBSCRIBED);
          })
          .receive('error', t => {
            ((this.state = ke.errored),
              null == e ||
                e(
                  Qe.CHANNEL_ERROR,
                  new Error(JSON.stringify(Object.values(t).join(', ') || 'error'))
                ));
          })
          .receive('timeout', () => {
            null == e || e(Qe.TIMED_OUT);
          }));
    }
    return this;
  }
  presenceState() {
    return this.presence.state;
  }
  async track(e, t = {}) {
    return await this.send(
      { type: 'presence', event: 'track', payload: e },
      t.timeout || this.timeout
    );
  }
  async untrack(e = {}) {
    return await this.send({ type: 'presence', event: 'untrack' }, e);
  }
  on(e, t, s) {
    return (
      this.state === ke.joined &&
        e === Ve.PRESENCE &&
        (this.socket.log(
          'channel',
          `resubscribe to ${this.topic} due to change in presence callbacks on joined channel`
        ),
        this.unsubscribe().then(async () => await this.subscribe())),
      this._on(e, t, s)
    );
  }
  async httpSend(e, t, s = {}) {
    var r;
    if (null == t) return Promise.reject('Payload is required for httpSend()');
    const n = {
      apikey: this.socket.apiKey ? this.socket.apiKey : '',
      'Content-Type': 'application/json',
    };
    this.socket.accessTokenValue && (n.Authorization = `Bearer ${this.socket.accessTokenValue}`);
    const i = {
        method: 'POST',
        headers: n,
        body: JSON.stringify({
          messages: [{ topic: this.subTopic, event: e, payload: t, private: this.private }],
        }),
      },
      a = await this._fetchWithTimeout(
        this.broadcastEndpointURL,
        i,
        null !== (r = s.timeout) && void 0 !== r ? r : this.timeout
      );
    if (202 === a.status) return { success: !0 };
    let o = a.statusText;
    try {
      const e = await a.json();
      o = e.error || e.message || o;
    } catch (c) {}
    return Promise.reject(new Error(o));
  }
  async send(e, t = {}) {
    var s, r;
    if (this._canPush() || 'broadcast' !== e.type)
      return new Promise(s => {
        var r, n, i;
        const a = this._push(e.type, e, t.timeout || this.timeout);
        ('broadcast' !== e.type ||
          (null ===
            (i =
              null === (n = null === (r = this.params) || void 0 === r ? void 0 : r.config) ||
              void 0 === n
                ? void 0
                : n.broadcast) || void 0 === i
            ? void 0
            : i.ack) ||
          s('ok'),
          a.receive('ok', () => s('ok')),
          a.receive('error', () => s('error')),
          a.receive('timeout', () => s('timed out')));
      });
    {
      const { event: i, payload: a } = e,
        o = {
          apikey: this.socket.apiKey ? this.socket.apiKey : '',
          'Content-Type': 'application/json',
        };
      this.socket.accessTokenValue && (o.Authorization = `Bearer ${this.socket.accessTokenValue}`);
      const c = {
        method: 'POST',
        headers: o,
        body: JSON.stringify({
          messages: [{ topic: this.subTopic, event: i, payload: a, private: this.private }],
        }),
      };
      try {
        const e = await this._fetchWithTimeout(
          this.broadcastEndpointURL,
          c,
          null !== (s = t.timeout) && void 0 !== s ? s : this.timeout
        );
        return (
          await (null === (r = e.body) || void 0 === r ? void 0 : r.cancel()),
          e.ok ? 'ok' : 'error'
        );
      } catch (n) {
        return 'AbortError' === n.name ? 'timed out' : 'error';
      }
    }
  }
  updateJoinPayload(e) {
    this.joinPush.updatePayload(e);
  }
  unsubscribe(e = this.timeout) {
    this.state = ke.leaving;
    const t = () => {
      (this.socket.log('channel', `leave ${this.topic}`),
        this._trigger(Te.close, 'leave', this._joinRef()));
    };
    this.joinPush.destroy();
    let s = null;
    return new Promise(r => {
      ((s = new We(this, Te.leave, {}, e)),
        s
          .receive('ok', () => {
            (t(), r('ok'));
          })
          .receive('timeout', () => {
            (t(), r('timed out'));
          })
          .receive('error', () => {
            r('error');
          }),
        s.send(),
        this._canPush() || s.trigger('ok', {}));
    }).finally(() => {
      null == s || s.destroy();
    });
  }
  teardown() {
    (this.pushBuffer.forEach(e => e.destroy()),
      (this.pushBuffer = []),
      this.rejoinTimer.reset(),
      this.joinPush.destroy(),
      (this.state = ke.closed),
      (this.bindings = {}));
  }
  async _fetchWithTimeout(e, t, s) {
    const r = new AbortController(),
      n = setTimeout(() => r.abort(), s),
      i = await this.socket.fetch(e, Object.assign(Object.assign({}, t), { signal: r.signal }));
    return (clearTimeout(n), i);
  }
  _push(e, t, s = this.timeout) {
    if (!this.joinedOnce)
      throw `tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    let r = new We(this, e, t, s);
    return (this._canPush() ? r.send() : this._addToPushBuffer(r), r);
  }
  _addToPushBuffer(e) {
    if ((e.startTimeout(), this.pushBuffer.push(e), this.pushBuffer.length > 100)) {
      const e = this.pushBuffer.shift();
      e &&
        (e.destroy(),
        this.socket.log('channel', `discarded push due to buffer overflow: ${e.event}`, e.payload));
    }
  }
  _onMessage(e, t, s) {
    return t;
  }
  _isMember(e) {
    return this.topic === e;
  }
  _joinRef() {
    return this.joinPush.ref;
  }
  _trigger(e, t, s) {
    var r, n;
    const i = e.toLocaleLowerCase(),
      { close: a, error: o, leave: c, join: l } = Te;
    if (s && [a, o, c, l].indexOf(i) >= 0 && s !== this._joinRef()) return;
    let h = this._onMessage(i, t, s);
    if (t && !h)
      throw 'channel onMessage callbacks must return the payload, modified or unmodified';
    ['insert', 'update', 'delete'].includes(i)
      ? null === (r = this.bindings.postgres_changes) ||
        void 0 === r ||
        r
          .filter(e => {
            var t, s, r;
            return (
              '*' === (null === (t = e.filter) || void 0 === t ? void 0 : t.event) ||
              (null === (r = null === (s = e.filter) || void 0 === s ? void 0 : s.event) ||
              void 0 === r
                ? void 0
                : r.toLocaleLowerCase()) === i
            );
          })
          .map(e => e.callback(h, s))
      : null === (n = this.bindings[i]) ||
        void 0 === n ||
        n
          .filter(e => {
            var s, r, n, a, o, c;
            if (['broadcast', 'presence', 'postgres_changes'].includes(i)) {
              if ('id' in e) {
                const i = e.id,
                  a = null === (s = e.filter) || void 0 === s ? void 0 : s.event;
                return (
                  i &&
                  (null === (r = t.ids) || void 0 === r ? void 0 : r.includes(i)) &&
                  ('*' === a ||
                    (null == a ? void 0 : a.toLocaleLowerCase()) ===
                      (null === (n = t.data) || void 0 === n ? void 0 : n.type.toLocaleLowerCase()))
                );
              }
              {
                const s =
                  null ===
                    (o =
                      null === (a = null == e ? void 0 : e.filter) || void 0 === a
                        ? void 0
                        : a.event) || void 0 === o
                    ? void 0
                    : o.toLocaleLowerCase();
                return (
                  '*' === s ||
                  s ===
                    (null === (c = null == t ? void 0 : t.event) || void 0 === c
                      ? void 0
                      : c.toLocaleLowerCase())
                );
              }
            }
            return e.type.toLocaleLowerCase() === i;
          })
          .map(e => {
            if ('object' == typeof h && 'ids' in h) {
              const e = h.data,
                { schema: t, table: s, commit_timestamp: r, type: n, errors: i } = e,
                a = {
                  schema: t,
                  table: s,
                  commit_timestamp: r,
                  eventType: n,
                  new: {},
                  old: {},
                  errors: i,
                };
              h = Object.assign(Object.assign({}, a), this._getPayloadRecords(e));
            }
            e.callback(h, s);
          });
  }
  _isClosed() {
    return this.state === ke.closed;
  }
  _isJoined() {
    return this.state === ke.joined;
  }
  _isJoining() {
    return this.state === ke.joining;
  }
  _isLeaving() {
    return this.state === ke.leaving;
  }
  _replyEventName(e) {
    return `chan_reply_${e}`;
  }
  _on(e, t, s) {
    const r = e.toLocaleLowerCase(),
      n = { type: r, filter: t, callback: s };
    return (this.bindings[r] ? this.bindings[r].push(n) : (this.bindings[r] = [n]), this);
  }
  _off(e, t) {
    const s = e.toLocaleLowerCase();
    return (
      this.bindings[s] &&
        (this.bindings[s] = this.bindings[s].filter(e => {
          var r;
          return !(
            (null === (r = e.type) || void 0 === r ? void 0 : r.toLocaleLowerCase()) === s &&
            Ze.isEqual(e.filter, t)
          );
        })),
      this
    );
  }
  static isEqual(e, t) {
    if (Object.keys(e).length !== Object.keys(t).length) return !1;
    for (const s in e) if (e[s] !== t[s]) return !1;
    return !0;
  }
  static isFilterValueEqual(e, t) {
    return (null != e ? e : void 0) === (null != t ? t : void 0);
  }
  _rejoinUntilConnected() {
    (this.rejoinTimer.scheduleTimeout(), this.socket.isConnected() && this._rejoin());
  }
  _onClose(e) {
    this._on(Te.close, {}, e);
  }
  _onError(e) {
    this._on(Te.error, {}, t => e(t));
  }
  _canPush() {
    return this.socket.isConnected() && this._isJoined();
  }
  _rejoin(e = this.timeout) {
    this._isLeaving() ||
      (this.socket._leaveOpenTopic(this.topic), (this.state = ke.joining), this.joinPush.resend(e));
  }
  _getPayloadRecords(e) {
    const t = { new: {}, old: {} };
    return (
      ('INSERT' !== e.type && 'UPDATE' !== e.type) || (t.new = Ce(e.columns, e.record)),
      ('UPDATE' !== e.type && 'DELETE' !== e.type) || (t.old = Ce(e.columns, e.old_record)),
      t
    );
  }
}
const et = () => {},
  tt = 25e3,
  st = 10,
  rt = 100,
  nt = [1e3, 2e3, 5e3, 1e4];
class it {
  constructor(e, t) {
    var s;
    if (
      ((this.accessTokenValue = null),
      (this.apiKey = null),
      (this._manuallySetToken = !1),
      (this.channels = new Array()),
      (this.endPoint = ''),
      (this.httpEndpoint = ''),
      (this.headers = {}),
      (this.params = {}),
      (this.timeout = ve),
      (this.transport = null),
      (this.heartbeatIntervalMs = tt),
      (this.heartbeatTimer = void 0),
      (this.pendingHeartbeatRef = null),
      (this.heartbeatCallback = et),
      (this.ref = 0),
      (this.reconnectTimer = null),
      (this.vsn = we),
      (this.logger = et),
      (this.conn = null),
      (this.sendBuffer = []),
      (this.serializer = new Ie()),
      (this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] }),
      (this.accessToken = null),
      (this._connectionState = 'disconnected'),
      (this._wasManualDisconnect = !1),
      (this._authPromise = null),
      (this._heartbeatSentAt = null),
      (this._resolveFetch = e => (e ? (...t) => e(...t) : (...e) => fetch(...e))),
      !(null === (s = null == t ? void 0 : t.params) || void 0 === s ? void 0 : s.apikey))
    )
      throw new Error('API key is required to connect to Realtime');
    ((this.apiKey = t.params.apikey),
      (this.endPoint = `${e}/${Oe.websocket}`),
      (this.httpEndpoint = Ke(e)),
      this._initializeOptions(t),
      this._setupReconnectionTimer(),
      (this.fetch = this._resolveFetch(null == t ? void 0 : t.fetch)));
  }
  connect() {
    if (
      !(this.isConnecting() || this.isDisconnecting() || (null !== this.conn && this.isConnected()))
    ) {
      if (
        (this._setConnectionState('connecting'),
        this.accessToken && !this._authPromise && this._setAuthSafely('connect'),
        this.transport)
      )
        this.conn = new this.transport(this.endpointURL());
      else
        try {
          this.conn = ye.createWebSocket(this.endpointURL());
        } catch (e) {
          this._setConnectionState('disconnected');
          const t = e.message;
          if (t.includes('Node.js'))
            throw new Error(
              `${t}\n\nTo use Realtime in Node.js, you need to provide a WebSocket implementation:\n\nOption 1: Use Node.js 22+ which has native WebSocket support\nOption 2: Install and provide the "ws" package:\n\n  npm install ws\n\n  import ws from "ws"\n  const client = new RealtimeClient(url, {\n    ...options,\n    transport: ws\n  })`
            );
          throw new Error(`WebSocket not available: ${t}`);
        }
      this._setupConnectionHandlers();
    }
  }
  endpointURL() {
    return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: this.vsn }));
  }
  disconnect(e, t) {
    if (!this.isDisconnecting())
      if ((this._setConnectionState('disconnecting', !0), this.conn)) {
        const s = setTimeout(() => {
          this._setConnectionState('disconnected');
        }, 100);
        ((this.conn.onclose = () => {
          (clearTimeout(s), this._setConnectionState('disconnected'));
        }),
          'function' == typeof this.conn.close &&
            (e ? this.conn.close(e, null != t ? t : '') : this.conn.close()),
          this._teardownConnection());
      } else this._setConnectionState('disconnected');
  }
  getChannels() {
    return this.channels;
  }
  async removeChannel(e) {
    const t = await e.unsubscribe();
    return (0 === this.channels.length && this.disconnect(), t);
  }
  async removeAllChannels() {
    const e = await Promise.all(this.channels.map(e => e.unsubscribe()));
    return ((this.channels = []), this.disconnect(), e);
  }
  log(e, t, s) {
    this.logger(e, t, s);
  }
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case be.connecting:
        return Re.Connecting;
      case be.open:
        return Re.Open;
      case be.closing:
        return Re.Closing;
      default:
        return Re.Closed;
    }
  }
  isConnected() {
    return this.connectionState() === Re.Open;
  }
  isConnecting() {
    return 'connecting' === this._connectionState;
  }
  isDisconnecting() {
    return 'disconnecting' === this._connectionState;
  }
  channel(e, t = { config: {} }) {
    const s = `realtime:${e}`,
      r = this.getChannels().find(e => e.topic === s);
    if (r) return r;
    {
      const s = new Ze(`realtime:${e}`, t, this);
      return (this.channels.push(s), s);
    }
  }
  push(e) {
    const { topic: t, event: s, payload: r, ref: n } = e,
      i = () => {
        this.encode(e, e => {
          var t;
          null === (t = this.conn) || void 0 === t || t.send(e);
        });
      };
    (this.log('push', `${t} ${s} (${n})`, r), this.isConnected() ? i() : this.sendBuffer.push(i));
  }
  async setAuth(e = null) {
    this._authPromise = this._performAuth(e);
    try {
      await this._authPromise;
    } finally {
      this._authPromise = null;
    }
  }
  _isManualToken() {
    return this._manuallySetToken;
  }
  async sendHeartbeat() {
    var e;
    if (this.isConnected()) {
      if (this.pendingHeartbeatRef) {
        ((this.pendingHeartbeatRef = null),
          (this._heartbeatSentAt = null),
          this.log('transport', 'heartbeat timeout. Attempting to re-establish connection'));
        try {
          this.heartbeatCallback('timeout');
        } catch (t) {
          this.log('error', 'error in heartbeat callback', t);
        }
        return (
          (this._wasManualDisconnect = !1),
          null === (e = this.conn) || void 0 === e || e.close(1e3, 'heartbeat timeout'),
          void setTimeout(() => {
            var e;
            this.isConnected() ||
              null === (e = this.reconnectTimer) ||
              void 0 === e ||
              e.scheduleTimeout();
          }, rt)
        );
      }
      ((this._heartbeatSentAt = Date.now()),
        (this.pendingHeartbeatRef = this._makeRef()),
        this.push({
          topic: 'phoenix',
          event: 'heartbeat',
          payload: {},
          ref: this.pendingHeartbeatRef,
        }));
      try {
        this.heartbeatCallback('sent');
      } catch (t) {
        this.log('error', 'error in heartbeat callback', t);
      }
      this._setAuthSafely('heartbeat');
    } else
      try {
        this.heartbeatCallback('disconnected');
      } catch (t) {
        this.log('error', 'error in heartbeat callback', t);
      }
  }
  onHeartbeat(e) {
    this.heartbeatCallback = e;
  }
  flushSendBuffer() {
    this.isConnected() &&
      this.sendBuffer.length > 0 &&
      (this.sendBuffer.forEach(e => e()), (this.sendBuffer = []));
  }
  _makeRef() {
    let e = this.ref + 1;
    return (e === this.ref ? (this.ref = 0) : (this.ref = e), this.ref.toString());
  }
  _leaveOpenTopic(e) {
    let t = this.channels.find(t => t.topic === e && (t._isJoined() || t._isJoining()));
    t && (this.log('transport', `leaving duplicate topic "${e}"`), t.unsubscribe());
  }
  _remove(e) {
    this.channels = this.channels.filter(t => t.topic !== e.topic);
  }
  _onConnMessage(e) {
    this.decode(e.data, e => {
      if (
        'phoenix' === e.topic &&
        'phx_reply' === e.event &&
        e.ref &&
        e.ref === this.pendingHeartbeatRef
      ) {
        const t = this._heartbeatSentAt ? Date.now() - this._heartbeatSentAt : void 0;
        try {
          this.heartbeatCallback('ok' === e.payload.status ? 'ok' : 'error', t);
        } catch (o) {
          this.log('error', 'error in heartbeat callback', o);
        }
        ((this._heartbeatSentAt = null), (this.pendingHeartbeatRef = null));
      }
      const { topic: t, event: s, payload: r, ref: n } = e,
        i = n ? `(${n})` : '',
        a = r.status || '';
      (this.log('receive', `${a} ${t} ${s} ${i}`.trim(), r),
        this.channels.filter(e => e._isMember(t)).forEach(e => e._trigger(s, r, n)),
        this._triggerStateCallbacks('message', e));
    });
  }
  _clearTimer(e) {
    var t;
    'heartbeat' === e && this.heartbeatTimer
      ? (clearInterval(this.heartbeatTimer), (this.heartbeatTimer = void 0))
      : 'reconnect' === e && (null === (t = this.reconnectTimer) || void 0 === t || t.reset());
  }
  _clearAllTimers() {
    (this._clearTimer('heartbeat'), this._clearTimer('reconnect'));
  }
  _setupConnectionHandlers() {
    this.conn &&
      ('binaryType' in this.conn && (this.conn.binaryType = 'arraybuffer'),
      (this.conn.onopen = () => this._onConnOpen()),
      (this.conn.onerror = e => this._onConnError(e)),
      (this.conn.onmessage = e => this._onConnMessage(e)),
      (this.conn.onclose = e => this._onConnClose(e)),
      this.conn.readyState === be.open && this._onConnOpen());
  }
  _teardownConnection() {
    if (this.conn) {
      if (this.conn.readyState === be.open || this.conn.readyState === be.connecting)
        try {
          this.conn.close();
        } catch (e) {
          this.log('error', 'Error closing connection', e);
        }
      ((this.conn.onopen = null),
        (this.conn.onerror = null),
        (this.conn.onmessage = null),
        (this.conn.onclose = null),
        (this.conn = null));
    }
    (this._clearAllTimers(), this._terminateWorker(), this.channels.forEach(e => e.teardown()));
  }
  _onConnOpen() {
    (this._setConnectionState('connected'),
      this.log('transport', `connected to ${this.endpointURL()}`));
    ((
      this._authPromise ||
      (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve())
    )
      .then(() => {
        this.flushSendBuffer();
      })
      .catch(e => {
        (this.log('error', 'error waiting for auth on connect', e), this.flushSendBuffer());
      }),
      this._clearTimer('reconnect'),
      this.worker ? this.workerRef || this._startWorkerHeartbeat() : this._startHeartbeat(),
      this._triggerStateCallbacks('open'));
  }
  _startHeartbeat() {
    (this.heartbeatTimer && clearInterval(this.heartbeatTimer),
      (this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs)));
  }
  _startWorkerHeartbeat() {
    this.workerUrl
      ? this.log('worker', `starting worker for from ${this.workerUrl}`)
      : this.log('worker', 'starting default worker');
    const e = this._workerObjectUrl(this.workerUrl);
    ((this.workerRef = new Worker(e)),
      (this.workerRef.onerror = e => {
        (this.log('worker', 'worker error', e.message), this._terminateWorker());
      }),
      (this.workerRef.onmessage = e => {
        'keepAlive' === e.data.event && this.sendHeartbeat();
      }),
      this.workerRef.postMessage({ event: 'start', interval: this.heartbeatIntervalMs }));
  }
  _terminateWorker() {
    this.workerRef &&
      (this.log('worker', 'terminating worker'),
      this.workerRef.terminate(),
      (this.workerRef = void 0));
  }
  _onConnClose(e) {
    var t;
    (this._setConnectionState('disconnected'),
      this.log('transport', 'close', e),
      this._triggerChanError(),
      this._clearTimer('heartbeat'),
      this._wasManualDisconnect ||
        null === (t = this.reconnectTimer) ||
        void 0 === t ||
        t.scheduleTimeout(),
      this._triggerStateCallbacks('close', e));
  }
  _onConnError(e) {
    (this._setConnectionState('disconnected'),
      this.log('transport', `${e}`),
      this._triggerChanError(),
      this._triggerStateCallbacks('error', e));
    try {
      this.heartbeatCallback('error');
    } catch (t) {
      this.log('error', 'error in heartbeat callback', t);
    }
  }
  _triggerChanError() {
    this.channels.forEach(e => e._trigger(Te.error));
  }
  _appendParams(e, t) {
    if (0 === Object.keys(t).length) return e;
    const s = e.match(/\?/) ? '&' : '?';
    return `${e}${s}${new URLSearchParams(t)}`;
  }
  _workerObjectUrl(e) {
    let t;
    if (e) t = e;
    else {
      const e = new Blob(
        [
          '\n  addEventListener("message", (e) => {\n    if (e.data.event === "start") {\n      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);\n    }\n  });',
        ],
        { type: 'application/javascript' }
      );
      t = URL.createObjectURL(e);
    }
    return t;
  }
  _setConnectionState(e, t = !1) {
    ((this._connectionState = e),
      'connecting' === e
        ? (this._wasManualDisconnect = !1)
        : 'disconnecting' === e && (this._wasManualDisconnect = t));
  }
  async _performAuth(e = null) {
    let t,
      s = !1;
    if (e) ((t = e), (s = !0));
    else if (this.accessToken)
      try {
        t = await this.accessToken();
      } catch (r) {
        (this.log('error', 'Error fetching access token from callback', r),
          (t = this.accessTokenValue));
      }
    else t = this.accessTokenValue;
    (s ? (this._manuallySetToken = !0) : this.accessToken && (this._manuallySetToken = !1),
      this.accessTokenValue != t &&
        ((this.accessTokenValue = t),
        this.channels.forEach(e => {
          const s = { access_token: t, version: 'realtime-js/2.93.3' };
          (t && e.updateJoinPayload(s),
            e.joinedOnce && e._isJoined() && e._push(Te.access_token, { access_token: t }));
        })));
  }
  async _waitForAuthIfNeeded() {
    this._authPromise && (await this._authPromise);
  }
  _setAuthSafely(e = 'general') {
    this._isManualToken() ||
      this.setAuth().catch(t => {
        this.log('error', `Error setting auth in ${e}`, t);
      });
  }
  _triggerStateCallbacks(e, t) {
    try {
      this.stateChangeCallbacks[e].forEach(s => {
        try {
          s(t);
        } catch (r) {
          this.log('error', `error in ${e} callback`, r);
        }
      });
    } catch (s) {
      this.log('error', `error triggering ${e} callbacks`, s);
    }
  }
  _setupReconnectionTimer() {
    this.reconnectTimer = new $e(async () => {
      setTimeout(async () => {
        (await this._waitForAuthIfNeeded(), this.isConnected() || this.connect());
      }, st);
    }, this.reconnectAfterMs);
  }
  _initializeOptions(e) {
    var t, s, r, n, i, a, o, c, l, h, u, d;
    switch (
      ((this.transport =
        null !== (t = null == e ? void 0 : e.transport) && void 0 !== t ? t : null),
      (this.timeout = null !== (s = null == e ? void 0 : e.timeout) && void 0 !== s ? s : ve),
      (this.heartbeatIntervalMs =
        null !== (r = null == e ? void 0 : e.heartbeatIntervalMs) && void 0 !== r ? r : tt),
      (this.worker = null !== (n = null == e ? void 0 : e.worker) && void 0 !== n && n),
      (this.accessToken =
        null !== (i = null == e ? void 0 : e.accessToken) && void 0 !== i ? i : null),
      (this.heartbeatCallback =
        null !== (a = null == e ? void 0 : e.heartbeatCallback) && void 0 !== a ? a : et),
      (this.vsn = null !== (o = null == e ? void 0 : e.vsn) && void 0 !== o ? o : we),
      (null == e ? void 0 : e.params) && (this.params = e.params),
      (null == e ? void 0 : e.logger) && (this.logger = e.logger),
      ((null == e ? void 0 : e.logLevel) || (null == e ? void 0 : e.log_level)) &&
        ((this.logLevel = e.logLevel || e.log_level),
        (this.params = Object.assign(Object.assign({}, this.params), {
          log_level: this.logLevel,
        }))),
      (this.reconnectAfterMs =
        null !== (c = null == e ? void 0 : e.reconnectAfterMs) && void 0 !== c
          ? c
          : e => nt[e - 1] || 1e4),
      this.vsn)
    ) {
      case '1.0.0':
        ((this.encode =
          null !== (l = null == e ? void 0 : e.encode) && void 0 !== l
            ? l
            : (e, t) => t(JSON.stringify(e))),
          (this.decode =
            null !== (h = null == e ? void 0 : e.decode) && void 0 !== h
              ? h
              : (e, t) => t(JSON.parse(e))));
        break;
      case me:
        ((this.encode =
          null !== (u = null == e ? void 0 : e.encode) && void 0 !== u
            ? u
            : this.serializer.encode.bind(this.serializer)),
          (this.decode =
            null !== (d = null == e ? void 0 : e.decode) && void 0 !== d
              ? d
              : this.serializer.decode.bind(this.serializer)));
        break;
      default:
        throw new Error(`Unsupported serializer version: ${this.vsn}`);
    }
    if (this.worker) {
      if ('undefined' != typeof window && !window.Worker)
        throw new Error('Web Worker is not supported');
      this.workerUrl = null == e ? void 0 : e.workerUrl;
    }
  }
}
var at = class extends Error {
  constructor(e, t) {
    (super(e),
      (this.name = 'IcebergError'),
      (this.status = t.status),
      (this.icebergType = t.icebergType),
      (this.icebergCode = t.icebergCode),
      (this.details = t.details),
      (this.isCommitStateUnknown =
        'CommitStateUnknownException' === t.icebergType ||
        ([500, 502, 504].includes(t.status) && !0 === t.icebergType?.includes('CommitState'))));
  }
  isNotFound() {
    return 404 === this.status;
  }
  isConflict() {
    return 409 === this.status;
  }
  isAuthenticationTimeout() {
    return 419 === this.status;
  }
};
function ot(e) {
  const t = e.fetchImpl ?? globalThis.fetch;
  return {
    async request({ method: s, path: r, query: n, body: i, headers: a }) {
      const o = (function (e, t, s) {
          const r = new URL(t, e);
          if (s) for (const [n, i] of Object.entries(s)) void 0 !== i && r.searchParams.set(n, i);
          return r.toString();
        })(e.baseUrl, r, n),
        c = await (async function (e) {
          return e && 'none' !== e.type
            ? 'bearer' === e.type
              ? { Authorization: `Bearer ${e.token}` }
              : 'header' === e.type
                ? { [e.name]: e.value }
                : 'custom' === e.type
                  ? await e.getHeaders()
                  : {}
            : {};
        })(e.auth),
        l = await t(o, {
          method: s,
          headers: { ...(i ? { 'Content-Type': 'application/json' } : {}), ...c, ...a },
          body: i ? JSON.stringify(i) : void 0,
        }),
        h = await l.text(),
        u = (l.headers.get('content-type') || '').includes('application/json'),
        d = u && h ? JSON.parse(h) : h;
      if (!l.ok) {
        const e = u ? d : void 0,
          t = e?.error;
        throw new at(t?.message ?? `Request failed with status ${l.status}`, {
          status: l.status,
          icebergType: t?.type,
          icebergCode: t?.code,
          details: e,
        });
      }
      return { status: l.status, headers: l.headers, data: d };
    },
  };
}
function ct(e) {
  return e.join('\x1f');
}
var lt = class {
  constructor(e, t = '') {
    ((this.client = e), (this.prefix = t));
  }
  async listNamespaces(e) {
    const t = e ? { parent: ct(e.namespace) } : void 0;
    return (
      await this.client.request({ method: 'GET', path: `${this.prefix}/namespaces`, query: t })
    ).data.namespaces.map(e => ({ namespace: e }));
  }
  async createNamespace(e, t) {
    const s = { namespace: e.namespace, properties: t?.properties };
    return (
      await this.client.request({ method: 'POST', path: `${this.prefix}/namespaces`, body: s })
    ).data;
  }
  async dropNamespace(e) {
    await this.client.request({
      method: 'DELETE',
      path: `${this.prefix}/namespaces/${ct(e.namespace)}`,
    });
  }
  async loadNamespaceMetadata(e) {
    return {
      properties: (
        await this.client.request({
          method: 'GET',
          path: `${this.prefix}/namespaces/${ct(e.namespace)}`,
        })
      ).data.properties,
    };
  }
  async namespaceExists(e) {
    try {
      return (
        await this.client.request({
          method: 'HEAD',
          path: `${this.prefix}/namespaces/${ct(e.namespace)}`,
        }),
        !0
      );
    } catch (t) {
      if (t instanceof at && 404 === t.status) return !1;
      throw t;
    }
  }
  async createNamespaceIfNotExists(e, t) {
    try {
      return await this.createNamespace(e, t);
    } catch (s) {
      if (s instanceof at && 409 === s.status) return;
      throw s;
    }
  }
};
function ht(e) {
  return e.join('\x1f');
}
var ut = class {
    constructor(e, t = '', s) {
      ((this.client = e), (this.prefix = t), (this.accessDelegation = s));
    }
    async listTables(e) {
      return (
        await this.client.request({
          method: 'GET',
          path: `${this.prefix}/namespaces/${ht(e.namespace)}/tables`,
        })
      ).data.identifiers;
    }
    async createTable(e, t) {
      const s = {};
      this.accessDelegation && (s['X-Iceberg-Access-Delegation'] = this.accessDelegation);
      return (
        await this.client.request({
          method: 'POST',
          path: `${this.prefix}/namespaces/${ht(e.namespace)}/tables`,
          body: t,
          headers: s,
        })
      ).data.metadata;
    }
    async updateTable(e, t) {
      const s = await this.client.request({
        method: 'POST',
        path: `${this.prefix}/namespaces/${ht(e.namespace)}/tables/${e.name}`,
        body: t,
      });
      return { 'metadata-location': s.data['metadata-location'], metadata: s.data.metadata };
    }
    async dropTable(e, t) {
      await this.client.request({
        method: 'DELETE',
        path: `${this.prefix}/namespaces/${ht(e.namespace)}/tables/${e.name}`,
        query: { purgeRequested: String(t?.purge ?? !1) },
      });
    }
    async loadTable(e) {
      const t = {};
      this.accessDelegation && (t['X-Iceberg-Access-Delegation'] = this.accessDelegation);
      return (
        await this.client.request({
          method: 'GET',
          path: `${this.prefix}/namespaces/${ht(e.namespace)}/tables/${e.name}`,
          headers: t,
        })
      ).data.metadata;
    }
    async tableExists(e) {
      const t = {};
      this.accessDelegation && (t['X-Iceberg-Access-Delegation'] = this.accessDelegation);
      try {
        return (
          await this.client.request({
            method: 'HEAD',
            path: `${this.prefix}/namespaces/${ht(e.namespace)}/tables/${e.name}`,
            headers: t,
          }),
          !0
        );
      } catch (s) {
        if (s instanceof at && 404 === s.status) return !1;
        throw s;
      }
    }
    async createTableIfNotExists(e, t) {
      try {
        return await this.createTable(e, t);
      } catch (s) {
        if (s instanceof at && 409 === s.status)
          return await this.loadTable({ namespace: e.namespace, name: t.name });
        throw s;
      }
    }
  },
  dt = class {
    constructor(e) {
      let t = 'v1';
      e.catalogName && (t += `/${e.catalogName}`);
      const s = e.baseUrl.endsWith('/') ? e.baseUrl : `${e.baseUrl}/`;
      ((this.client = ot({ baseUrl: s, auth: e.auth, fetchImpl: e.fetch })),
        (this.accessDelegation = e.accessDelegation?.join(',')),
        (this.namespaceOps = new lt(this.client, t)),
        (this.tableOps = new ut(this.client, t, this.accessDelegation)));
    }
    async listNamespaces(e) {
      return this.namespaceOps.listNamespaces(e);
    }
    async createNamespace(e, t) {
      return this.namespaceOps.createNamespace(e, t);
    }
    async dropNamespace(e) {
      await this.namespaceOps.dropNamespace(e);
    }
    async loadNamespaceMetadata(e) {
      return this.namespaceOps.loadNamespaceMetadata(e);
    }
    async listTables(e) {
      return this.tableOps.listTables(e);
    }
    async createTable(e, t) {
      return this.tableOps.createTable(e, t);
    }
    async updateTable(e, t) {
      return this.tableOps.updateTable(e, t);
    }
    async dropTable(e, t) {
      await this.tableOps.dropTable(e, t);
    }
    async loadTable(e) {
      return this.tableOps.loadTable(e);
    }
    async namespaceExists(e) {
      return this.namespaceOps.namespaceExists(e);
    }
    async tableExists(e) {
      return this.tableOps.tableExists(e);
    }
    async createNamespaceIfNotExists(e, t) {
      return this.namespaceOps.createNamespaceIfNotExists(e, t);
    }
    async createTableIfNotExists(e, t) {
      return this.tableOps.createTableIfNotExists(e, t);
    }
  },
  pt = class extends Error {
    constructor(e, t = 'storage', s, r) {
      (super(e),
        (this.__isStorageError = !0),
        (this.namespace = t),
        (this.name = 'vectors' === t ? 'StorageVectorsError' : 'StorageError'),
        (this.status = s),
        (this.statusCode = r));
    }
  };
function ft(e) {
  return 'object' == typeof e && null !== e && '__isStorageError' in e;
}
var gt = class extends pt {
    constructor(e, t, s, r = 'storage') {
      (super(e, r, t, s),
        (this.name = 'vectors' === r ? 'StorageVectorsApiError' : 'StorageApiError'),
        (this.status = t),
        (this.statusCode = s));
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        statusCode: this.statusCode,
      };
    }
  },
  yt = class extends pt {
    constructor(e, t, s = 'storage') {
      (super(e, s),
        (this.name = 'vectors' === s ? 'StorageVectorsUnknownError' : 'StorageUnknownError'),
        (this.originalError = t));
    }
  };
const mt = e => {
  if (Array.isArray(e)) return e.map(e => mt(e));
  if ('function' == typeof e || e !== Object(e)) return e;
  const t = {};
  return (
    Object.entries(e).forEach(([e, s]) => {
      const r = e.replace(/([-_][a-z])/gi, e => e.toUpperCase().replace(/[-_]/g, ''));
      t[r] = mt(s);
    }),
    t
  );
};
function wt(e) {
  return (wt =
    'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
      ? function (e) {
          return typeof e;
        }
      : function (e) {
          return e &&
            'function' == typeof Symbol &&
            e.constructor === Symbol &&
            e !== Symbol.prototype
            ? 'symbol'
            : typeof e;
        })(e);
}
function vt(e) {
  var t = (function (e, t) {
    if ('object' != wt(e) || !e) return e;
    var s = e[Symbol.toPrimitive];
    if (void 0 !== s) {
      var r = s.call(e, t);
      if ('object' != wt(r)) return r;
      throw new TypeError('@@toPrimitive must return a primitive value.');
    }
    return ('string' === t ? String : Number)(e);
  })(e, 'string');
  return 'symbol' == wt(t) ? t : t + '';
}
function bt(e, t, s) {
  return (
    (t = vt(t)) in e
      ? Object.defineProperty(e, t, { value: s, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = s),
    e
  );
}
function _t(e, t) {
  var s = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    (t &&
      (r = r.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable;
      })),
      s.push.apply(s, r));
  }
  return s;
}
function kt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var s = null != arguments[t] ? arguments[t] : {};
    t % 2
      ? _t(Object(s), !0).forEach(function (t) {
          bt(e, t, s[t]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(s))
        : _t(Object(s)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(s, t));
          });
  }
  return e;
}
const St = e => {
    var t;
    return (
      e.msg ||
      e.message ||
      e.error_description ||
      ('string' == typeof e.error
        ? e.error
        : null === (t = e.error) || void 0 === t
          ? void 0
          : t.message) ||
      JSON.stringify(e)
    );
  },
  Tt = (e, t, s, r) => {
    const n = { method: e, headers: (null == t ? void 0 : t.headers) || {} };
    return 'GET' !== e && 'HEAD' !== e && r
      ? ((e => {
          if ('object' != typeof e || null === e) return !1;
          const t = Object.getPrototypeOf(e);
          return !(
            (null !== t && t !== Object.prototype && null !== Object.getPrototypeOf(t)) ||
            Symbol.toStringTag in e ||
            Symbol.iterator in e
          );
        })(r)
          ? ((n.headers = kt(
              { 'Content-Type': 'application/json' },
              null == t ? void 0 : t.headers
            )),
            (n.body = JSON.stringify(r)))
          : (n.body = r),
        (null == t ? void 0 : t.duplex) && (n.duplex = t.duplex),
        kt(kt({}, n), s))
      : kt(kt({}, n), s);
  };
async function Et(e, t, s, r, n, i, a) {
  return new Promise((o, c) => {
    e(s, Tt(t, r, n, i))
      .then(e => {
        if (!e.ok) throw e;
        if (null == r ? void 0 : r.noResolveJson) return e;
        if ('vectors' === a) {
          const t = e.headers.get('content-type');
          if ('0' === e.headers.get('content-length') || 204 === e.status) return {};
          if (!t || !t.includes('application/json')) return {};
        }
        return e.json();
      })
      .then(e => o(e))
      .catch(e =>
        (async (e, t, s, r) => {
          if (
            e &&
            'object' == typeof e &&
            'status' in e &&
            'ok' in e &&
            'number' == typeof e.status &&
            !(null == s ? void 0 : s.noResolveJson)
          ) {
            const s = e,
              n = s.status || 500;
            if ('function' == typeof s.json)
              s.json()
                .then(e => {
                  const s =
                    (null == e ? void 0 : e.statusCode) || (null == e ? void 0 : e.code) || n + '';
                  t(new gt(St(e), n, s, r));
                })
                .catch(() => {
                  if ('vectors' === r) {
                    const e = n + '';
                    t(new gt(s.statusText || `HTTP ${n} error`, n, e, r));
                  } else {
                    const e = n + '';
                    t(new gt(s.statusText || `HTTP ${n} error`, n, e, r));
                  }
                });
            else {
              const e = n + '';
              t(new gt(s.statusText || `HTTP ${n} error`, n, e, r));
            }
          } else t(new yt(St(e), e, r));
        })(e, c, r, a)
      );
  });
}
function Ot(e = 'storage') {
  return {
    get: async (t, s, r, n) => Et(t, 'GET', s, r, n, void 0, e),
    post: async (t, s, r, n, i) => Et(t, 'POST', s, n, i, r, e),
    put: async (t, s, r, n, i) => Et(t, 'PUT', s, n, i, r, e),
    head: async (t, s, r, n) =>
      Et(t, 'HEAD', s, kt(kt({}, r), {}, { noResolveJson: !0 }), n, void 0, e),
    remove: async (t, s, r, n, i) => Et(t, 'DELETE', s, n, i, r, e),
  };
}
const Rt = Ot('storage'),
  { get: At, post: Pt, put: jt, head: It, remove: $t } = Rt,
  Ct = Ot('vectors');
var xt = class {
    constructor(e, t = {}, s, r = 'storage') {
      var n;
      ((this.shouldThrowOnError = !1),
        (this.url = e),
        (this.headers = t),
        (this.fetch = (n = s) ? (...e) => n(...e) : (...e) => fetch(...e)),
        (this.namespace = r));
    }
    throwOnError() {
      return ((this.shouldThrowOnError = !0), this);
    }
    async handleOperation(e) {
      try {
        return { data: await e(), error: null };
      } catch (t) {
        if (this.shouldThrowOnError) throw t;
        if (ft(t)) return { data: null, error: t };
        throw t;
      }
    }
  },
  Nt = class {
    constructor(e, t) {
      ((this.downloadFn = e), (this.shouldThrowOnError = t));
    }
    then(e, t) {
      return this.execute().then(e, t);
    }
    async execute() {
      try {
        return { data: (await this.downloadFn()).body, error: null };
      } catch (e) {
        if (this.shouldThrowOnError) throw e;
        if (ft(e)) return { data: null, error: e };
        throw e;
      }
    }
  };
let Ut;
Ut = Symbol.toStringTag;
var Dt = class {
  constructor(e, t) {
    ((this.downloadFn = e),
      (this.shouldThrowOnError = t),
      (this[Ut] = 'BlobDownloadBuilder'),
      (this.promise = null));
  }
  asStream() {
    return new Nt(this.downloadFn, this.shouldThrowOnError);
  }
  then(e, t) {
    return this.getPromise().then(e, t);
  }
  catch(e) {
    return this.getPromise().catch(e);
  }
  finally(e) {
    return this.getPromise().finally(e);
  }
  getPromise() {
    return (this.promise || (this.promise = this.execute()), this.promise);
  }
  async execute() {
    try {
      return { data: await (await this.downloadFn()).blob(), error: null };
    } catch (e) {
      if (this.shouldThrowOnError) throw e;
      if (ft(e)) return { data: null, error: e };
      throw e;
    }
  }
};
const qt = { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } },
  Lt = { cacheControl: '3600', contentType: 'text/plain;charset=UTF-8', upsert: !1 };
var Bt = class extends xt {
  constructor(e, t = {}, s, r) {
    (super(e, t, r, 'storage'), (this.bucketId = s));
  }
  async uploadOrUpdate(e, t, s, r) {
    var n = this;
    return n.handleOperation(async () => {
      let i;
      const a = kt(kt({}, Lt), r);
      let o = kt(kt({}, n.headers), 'POST' === e && { 'x-upsert': String(a.upsert) });
      const c = a.metadata;
      ('undefined' != typeof Blob && s instanceof Blob
        ? ((i = new FormData()),
          i.append('cacheControl', a.cacheControl),
          c && i.append('metadata', n.encodeMetadata(c)),
          i.append('', s))
        : 'undefined' != typeof FormData && s instanceof FormData
          ? ((i = s),
            i.has('cacheControl') || i.append('cacheControl', a.cacheControl),
            c && !i.has('metadata') && i.append('metadata', n.encodeMetadata(c)))
          : ((i = s),
            (o['cache-control'] = `max-age=${a.cacheControl}`),
            (o['content-type'] = a.contentType),
            c && (o['x-metadata'] = n.toBase64(n.encodeMetadata(c))),
            (('undefined' != typeof ReadableStream && i instanceof ReadableStream) ||
              (i && 'object' == typeof i && 'pipe' in i && 'function' == typeof i.pipe)) &&
              !a.duplex &&
              (a.duplex = 'half')),
        (null == r ? void 0 : r.headers) && (o = kt(kt({}, o), r.headers)));
      const l = n._removeEmptyFolders(t),
        h = n._getFinalPath(l),
        u = await ('PUT' == e ? jt : Pt)(
          n.fetch,
          `${n.url}/object/${h}`,
          i,
          kt({ headers: o }, (null == a ? void 0 : a.duplex) ? { duplex: a.duplex } : {})
        );
      return { path: l, id: u.Id, fullPath: u.Key };
    });
  }
  async upload(e, t, s) {
    return this.uploadOrUpdate('POST', e, t, s);
  }
  async uploadToSignedUrl(e, t, s, r) {
    var n = this;
    const i = n._removeEmptyFolders(e),
      a = n._getFinalPath(i),
      o = new URL(n.url + `/object/upload/sign/${a}`);
    return (
      o.searchParams.set('token', t),
      n.handleOperation(async () => {
        let e;
        const t = kt({ upsert: Lt.upsert }, r),
          a = kt(kt({}, n.headers), { 'x-upsert': String(t.upsert) });
        return (
          'undefined' != typeof Blob && s instanceof Blob
            ? ((e = new FormData()), e.append('cacheControl', t.cacheControl), e.append('', s))
            : 'undefined' != typeof FormData && s instanceof FormData
              ? ((e = s), e.append('cacheControl', t.cacheControl))
              : ((e = s),
                (a['cache-control'] = `max-age=${t.cacheControl}`),
                (a['content-type'] = t.contentType)),
          { path: i, fullPath: (await jt(n.fetch, o.toString(), e, { headers: a })).Key }
        );
      })
    );
  }
  async createSignedUploadUrl(e, t) {
    var s = this;
    return s.handleOperation(async () => {
      let r = s._getFinalPath(e);
      const n = kt({}, s.headers);
      (null == t ? void 0 : t.upsert) && (n['x-upsert'] = 'true');
      const i = await Pt(s.fetch, `${s.url}/object/upload/sign/${r}`, {}, { headers: n }),
        a = new URL(s.url + i.url),
        o = a.searchParams.get('token');
      if (!o) throw new pt('No token returned by API');
      return { signedUrl: a.toString(), path: e, token: o };
    });
  }
  async update(e, t, s) {
    return this.uploadOrUpdate('PUT', e, t, s);
  }
  async move(e, t, s) {
    var r = this;
    return r.handleOperation(
      async () =>
        await Pt(
          r.fetch,
          `${r.url}/object/move`,
          {
            bucketId: r.bucketId,
            sourceKey: e,
            destinationKey: t,
            destinationBucket: null == s ? void 0 : s.destinationBucket,
          },
          { headers: r.headers }
        )
    );
  }
  async copy(e, t, s) {
    var r = this;
    return r.handleOperation(async () => ({
      path: (
        await Pt(
          r.fetch,
          `${r.url}/object/copy`,
          {
            bucketId: r.bucketId,
            sourceKey: e,
            destinationKey: t,
            destinationBucket: null == s ? void 0 : s.destinationBucket,
          },
          { headers: r.headers }
        )
      ).Key,
    }));
  }
  async createSignedUrl(e, t, s) {
    var r = this;
    return r.handleOperation(async () => {
      let n = r._getFinalPath(e),
        i = await Pt(
          r.fetch,
          `${r.url}/object/sign/${n}`,
          kt(
            { expiresIn: t },
            (null == s ? void 0 : s.transform) ? { transform: s.transform } : {}
          ),
          { headers: r.headers }
        );
      const a = (null == s ? void 0 : s.download)
        ? `&download=${!0 === s.download ? '' : s.download}`
        : '';
      return { signedUrl: encodeURI(`${r.url}${i.signedURL}${a}`) };
    });
  }
  async createSignedUrls(e, t, s) {
    var r = this;
    return r.handleOperation(async () => {
      const n = await Pt(
          r.fetch,
          `${r.url}/object/sign/${r.bucketId}`,
          { expiresIn: t, paths: e },
          { headers: r.headers }
        ),
        i = (null == s ? void 0 : s.download)
          ? `&download=${!0 === s.download ? '' : s.download}`
          : '';
      return n.map(e =>
        kt(
          kt({}, e),
          {},
          { signedUrl: e.signedURL ? encodeURI(`${r.url}${e.signedURL}${i}`) : null }
        )
      );
    });
  }
  download(e, t) {
    const s =
        void 0 !== (null == t ? void 0 : t.transform) ? 'render/image/authenticated' : 'object',
      r = this.transformOptsToQueryString((null == t ? void 0 : t.transform) || {}),
      n = r ? `?${r}` : '',
      i = this._getFinalPath(e);
    return new Dt(
      () =>
        At(this.fetch, `${this.url}/${s}/${i}${n}`, { headers: this.headers, noResolveJson: !0 }),
      this.shouldThrowOnError
    );
  }
  async info(e) {
    var t = this;
    const s = t._getFinalPath(e);
    return t.handleOperation(async () =>
      mt(await At(t.fetch, `${t.url}/object/info/${s}`, { headers: t.headers }))
    );
  }
  async exists(e) {
    var t = this;
    const s = t._getFinalPath(e);
    try {
      return (
        await It(t.fetch, `${t.url}/object/${s}`, { headers: t.headers }),
        { data: !0, error: null }
      );
    } catch (r) {
      if (t.shouldThrowOnError) throw r;
      if (ft(r) && r instanceof yt) {
        const e = r.originalError;
        if ([400, 404].includes(null == e ? void 0 : e.status)) return { data: !1, error: r };
      }
      throw r;
    }
  }
  getPublicUrl(e, t) {
    const s = this._getFinalPath(e),
      r = [],
      n = (null == t ? void 0 : t.download)
        ? `download=${!0 === t.download ? '' : t.download}`
        : '';
    '' !== n && r.push(n);
    const i = void 0 !== (null == t ? void 0 : t.transform) ? 'render/image' : 'object',
      a = this.transformOptsToQueryString((null == t ? void 0 : t.transform) || {});
    '' !== a && r.push(a);
    let o = r.join('&');
    return (
      '' !== o && (o = `?${o}`),
      { data: { publicUrl: encodeURI(`${this.url}/${i}/public/${s}${o}`) } }
    );
  }
  async remove(e) {
    var t = this;
    return t.handleOperation(
      async () =>
        await $t(t.fetch, `${t.url}/object/${t.bucketId}`, { prefixes: e }, { headers: t.headers })
    );
  }
  async list(e, t, s) {
    var r = this;
    return r.handleOperation(async () => {
      const n = kt(kt(kt({}, qt), t), {}, { prefix: e || '' });
      return await Pt(r.fetch, `${r.url}/object/list/${r.bucketId}`, n, { headers: r.headers }, s);
    });
  }
  async listV2(e, t) {
    var s = this;
    return s.handleOperation(async () => {
      const r = kt({}, e);
      return await Pt(
        s.fetch,
        `${s.url}/object/list-v2/${s.bucketId}`,
        r,
        { headers: s.headers },
        t
      );
    });
  }
  encodeMetadata(e) {
    return JSON.stringify(e);
  }
  toBase64(e) {
    return 'undefined' != typeof Buffer ? Buffer.from(e).toString('base64') : btoa(e);
  }
  _getFinalPath(e) {
    return `${this.bucketId}/${e.replace(/^\/+/, '')}`;
  }
  _removeEmptyFolders(e) {
    return e.replace(/^\/|\/$/g, '').replace(/\/+/g, '/');
  }
  transformOptsToQueryString(e) {
    const t = [];
    return (
      e.width && t.push(`width=${e.width}`),
      e.height && t.push(`height=${e.height}`),
      e.resize && t.push(`resize=${e.resize}`),
      e.format && t.push(`format=${e.format}`),
      e.quality && t.push(`quality=${e.quality}`),
      t.join('&')
    );
  }
};
const Mt = { 'X-Client-Info': 'storage-js/2.93.3' };
var Kt = class extends xt {
    constructor(e, t = {}, s, r) {
      const n = new URL(e);
      (null == r ? void 0 : r.useNewHostname) &&
        /supabase\.(co|in|red)$/.test(n.hostname) &&
        !n.hostname.includes('storage.supabase.') &&
        (n.hostname = n.hostname.replace('supabase.', 'storage.supabase.'));
      super(n.href.replace(/\/$/, ''), kt(kt({}, Mt), t), s, 'storage');
    }
    async listBuckets(e) {
      var t = this;
      return t.handleOperation(async () => {
        const s = t.listBucketOptionsToQueryString(e);
        return await At(t.fetch, `${t.url}/bucket${s}`, { headers: t.headers });
      });
    }
    async getBucket(e) {
      var t = this;
      return t.handleOperation(
        async () => await At(t.fetch, `${t.url}/bucket/${e}`, { headers: t.headers })
      );
    }
    async createBucket(e, t = { public: !1 }) {
      var s = this;
      return s.handleOperation(
        async () =>
          await Pt(
            s.fetch,
            `${s.url}/bucket`,
            {
              id: e,
              name: e,
              type: t.type,
              public: t.public,
              file_size_limit: t.fileSizeLimit,
              allowed_mime_types: t.allowedMimeTypes,
            },
            { headers: s.headers }
          )
      );
    }
    async updateBucket(e, t) {
      var s = this;
      return s.handleOperation(
        async () =>
          await jt(
            s.fetch,
            `${s.url}/bucket/${e}`,
            {
              id: e,
              name: e,
              public: t.public,
              file_size_limit: t.fileSizeLimit,
              allowed_mime_types: t.allowedMimeTypes,
            },
            { headers: s.headers }
          )
      );
    }
    async emptyBucket(e) {
      var t = this;
      return t.handleOperation(
        async () => await Pt(t.fetch, `${t.url}/bucket/${e}/empty`, {}, { headers: t.headers })
      );
    }
    async deleteBucket(e) {
      var t = this;
      return t.handleOperation(
        async () => await $t(t.fetch, `${t.url}/bucket/${e}`, {}, { headers: t.headers })
      );
    }
    listBucketOptionsToQueryString(e) {
      const t = {};
      return (
        e &&
          ('limit' in e && (t.limit = String(e.limit)),
          'offset' in e && (t.offset = String(e.offset)),
          e.search && (t.search = e.search),
          e.sortColumn && (t.sortColumn = e.sortColumn),
          e.sortOrder && (t.sortOrder = e.sortOrder)),
        Object.keys(t).length > 0 ? '?' + new URLSearchParams(t).toString() : ''
      );
    }
  },
  Wt = class extends xt {
    constructor(e, t = {}, s) {
      super(e.replace(/\/$/, ''), kt(kt({}, Mt), t), s, 'storage');
    }
    async createBucket(e) {
      var t = this;
      return t.handleOperation(
        async () => await Pt(t.fetch, `${t.url}/bucket`, { name: e }, { headers: t.headers })
      );
    }
    async listBuckets(e) {
      var t = this;
      return t.handleOperation(async () => {
        const s = new URLSearchParams();
        (void 0 !== (null == e ? void 0 : e.limit) && s.set('limit', e.limit.toString()),
          void 0 !== (null == e ? void 0 : e.offset) && s.set('offset', e.offset.toString()),
          (null == e ? void 0 : e.sortColumn) && s.set('sortColumn', e.sortColumn),
          (null == e ? void 0 : e.sortOrder) && s.set('sortOrder', e.sortOrder),
          (null == e ? void 0 : e.search) && s.set('search', e.search));
        const r = s.toString(),
          n = r ? `${t.url}/bucket?${r}` : `${t.url}/bucket`;
        return await At(t.fetch, n, { headers: t.headers });
      });
    }
    async deleteBucket(e) {
      var t = this;
      return t.handleOperation(
        async () => await $t(t.fetch, `${t.url}/bucket/${e}`, {}, { headers: t.headers })
      );
    }
    from(e) {
      var t = this;
      if (
        !(e =>
          !(!e || 'string' != typeof e) &&
          !(0 === e.length || e.length > 100) &&
          e.trim() === e &&
          !e.includes('/') &&
          !e.includes('\\') &&
          /^[\w!.\*'() &$@=;:+,?-]+$/.test(e))(e)
      )
        throw new pt(
          'Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.'
        );
      const s = new dt({
          baseUrl: this.url,
          catalogName: e,
          auth: { type: 'custom', getHeaders: async () => t.headers },
          fetch: this.fetch,
        }),
        r = this.shouldThrowOnError;
      return new Proxy(s, {
        get(e, t) {
          const s = e[t];
          return 'function' != typeof s
            ? s
            : async (...t) => {
                try {
                  return { data: await s.apply(e, t), error: null };
                } catch (n) {
                  if (r) throw n;
                  return { data: null, error: n };
                }
              };
        },
      });
    }
  },
  Ft = class extends xt {
    constructor(e, t = {}, s) {
      super(
        e.replace(/\/$/, ''),
        kt(kt({}, Mt), {}, { 'Content-Type': 'application/json' }, t),
        s,
        'vectors'
      );
    }
    async createIndex(e) {
      var t = this;
      return t.handleOperation(
        async () =>
          (await Ct.post(t.fetch, `${t.url}/CreateIndex`, e, { headers: t.headers })) || {}
      );
    }
    async getIndex(e, t) {
      var s = this;
      return s.handleOperation(
        async () =>
          await Ct.post(
            s.fetch,
            `${s.url}/GetIndex`,
            { vectorBucketName: e, indexName: t },
            { headers: s.headers }
          )
      );
    }
    async listIndexes(e) {
      var t = this;
      return t.handleOperation(
        async () => await Ct.post(t.fetch, `${t.url}/ListIndexes`, e, { headers: t.headers })
      );
    }
    async deleteIndex(e, t) {
      var s = this;
      return s.handleOperation(
        async () =>
          (await Ct.post(
            s.fetch,
            `${s.url}/DeleteIndex`,
            { vectorBucketName: e, indexName: t },
            { headers: s.headers }
          )) || {}
      );
    }
  },
  Ht = class extends xt {
    constructor(e, t = {}, s) {
      super(
        e.replace(/\/$/, ''),
        kt(kt({}, Mt), {}, { 'Content-Type': 'application/json' }, t),
        s,
        'vectors'
      );
    }
    async putVectors(e) {
      var t = this;
      if (e.vectors.length < 1 || e.vectors.length > 500)
        throw new Error('Vector batch size must be between 1 and 500 items');
      return t.handleOperation(
        async () => (await Ct.post(t.fetch, `${t.url}/PutVectors`, e, { headers: t.headers })) || {}
      );
    }
    async getVectors(e) {
      var t = this;
      return t.handleOperation(
        async () => await Ct.post(t.fetch, `${t.url}/GetVectors`, e, { headers: t.headers })
      );
    }
    async listVectors(e) {
      var t = this;
      if (void 0 !== e.segmentCount) {
        if (e.segmentCount < 1 || e.segmentCount > 16)
          throw new Error('segmentCount must be between 1 and 16');
        if (void 0 !== e.segmentIndex && (e.segmentIndex < 0 || e.segmentIndex >= e.segmentCount))
          throw new Error('segmentIndex must be between 0 and ' + (e.segmentCount - 1));
      }
      return t.handleOperation(
        async () => await Ct.post(t.fetch, `${t.url}/ListVectors`, e, { headers: t.headers })
      );
    }
    async queryVectors(e) {
      var t = this;
      return t.handleOperation(
        async () => await Ct.post(t.fetch, `${t.url}/QueryVectors`, e, { headers: t.headers })
      );
    }
    async deleteVectors(e) {
      var t = this;
      if (e.keys.length < 1 || e.keys.length > 500)
        throw new Error('Keys batch size must be between 1 and 500 items');
      return t.handleOperation(
        async () =>
          (await Ct.post(t.fetch, `${t.url}/DeleteVectors`, e, { headers: t.headers })) || {}
      );
    }
  },
  Gt = class extends xt {
    constructor(e, t = {}, s) {
      super(
        e.replace(/\/$/, ''),
        kt(kt({}, Mt), {}, { 'Content-Type': 'application/json' }, t),
        s,
        'vectors'
      );
    }
    async createBucket(e) {
      var t = this;
      return t.handleOperation(
        async () =>
          (await Ct.post(
            t.fetch,
            `${t.url}/CreateVectorBucket`,
            { vectorBucketName: e },
            { headers: t.headers }
          )) || {}
      );
    }
    async getBucket(e) {
      var t = this;
      return t.handleOperation(
        async () =>
          await Ct.post(
            t.fetch,
            `${t.url}/GetVectorBucket`,
            { vectorBucketName: e },
            { headers: t.headers }
          )
      );
    }
    async listBuckets(e = {}) {
      var t = this;
      return t.handleOperation(
        async () => await Ct.post(t.fetch, `${t.url}/ListVectorBuckets`, e, { headers: t.headers })
      );
    }
    async deleteBucket(e) {
      var t = this;
      return t.handleOperation(
        async () =>
          (await Ct.post(
            t.fetch,
            `${t.url}/DeleteVectorBucket`,
            { vectorBucketName: e },
            { headers: t.headers }
          )) || {}
      );
    }
  },
  Jt = class extends Gt {
    constructor(e, t = {}) {
      super(e, t.headers || {}, t.fetch);
    }
    from(e) {
      return new Vt(this.url, this.headers, e, this.fetch);
    }
    async createBucket(e) {
      return (() => super.createBucket)().call(this, e);
    }
    async getBucket(e) {
      return (() => super.getBucket)().call(this, e);
    }
    async listBuckets(e = {}) {
      return (() => super.listBuckets)().call(this, e);
    }
    async deleteBucket(e) {
      return (() => super.deleteBucket)().call(this, e);
    }
  },
  Vt = class extends Ft {
    constructor(e, t, s, r) {
      (super(e, t, r), (this.vectorBucketName = s));
    }
    async createIndex(e) {
      return (() => super.createIndex)().call(
        this,
        kt(kt({}, e), {}, { vectorBucketName: this.vectorBucketName })
      );
    }
    async listIndexes(e = {}) {
      return (() => super.listIndexes)().call(
        this,
        kt(kt({}, e), {}, { vectorBucketName: this.vectorBucketName })
      );
    }
    async getIndex(e) {
      return (() => super.getIndex)().call(this, this.vectorBucketName, e);
    }
    async deleteIndex(e) {
      return (() => super.deleteIndex)().call(this, this.vectorBucketName, e);
    }
    index(e) {
      return new zt(this.url, this.headers, this.vectorBucketName, e, this.fetch);
    }
  },
  zt = class extends Ht {
    constructor(e, t, s, r, n) {
      (super(e, t, n), (this.vectorBucketName = s), (this.indexName = r));
    }
    async putVectors(e) {
      var t = this;
      return (() => super.putVectors)().call(
        t,
        kt(kt({}, e), {}, { vectorBucketName: t.vectorBucketName, indexName: t.indexName })
      );
    }
    async getVectors(e) {
      var t = this;
      return (() => super.getVectors)().call(
        t,
        kt(kt({}, e), {}, { vectorBucketName: t.vectorBucketName, indexName: t.indexName })
      );
    }
    async listVectors(e = {}) {
      var t = this;
      return (() => super.listVectors)().call(
        t,
        kt(kt({}, e), {}, { vectorBucketName: t.vectorBucketName, indexName: t.indexName })
      );
    }
    async queryVectors(e) {
      var t = this;
      return (() => super.queryVectors)().call(
        t,
        kt(kt({}, e), {}, { vectorBucketName: t.vectorBucketName, indexName: t.indexName })
      );
    }
    async deleteVectors(e) {
      var t = this;
      return (() => super.deleteVectors)().call(
        t,
        kt(kt({}, e), {}, { vectorBucketName: t.vectorBucketName, indexName: t.indexName })
      );
    }
  },
  Qt = class extends Kt {
    constructor(e, t = {}, s, r) {
      super(e, t, s, r);
    }
    from(e) {
      return new Bt(this.url, this.headers, e, this.fetch);
    }
    get vectors() {
      return new Jt(this.url + '/vector', { headers: this.headers, fetch: this.fetch });
    }
    get analytics() {
      return new Wt(this.url + '/iceberg', this.headers, this.fetch);
    }
  };
const Yt = '2.93.3',
  Xt = 3e4,
  Zt = 9e4,
  es = { 'X-Client-Info': `gotrue-js/${Yt}` },
  ts = 'X-Supabase-Api-Version',
  ss = { timestamp: Date.parse('2024-01-01T00:00:00.0Z'), name: '2024-01-01' },
  rs = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
class ns extends Error {
  constructor(e, t, s) {
    (super(e),
      (this.__isAuthError = !0),
      (this.name = 'AuthError'),
      (this.status = t),
      (this.code = s));
  }
}
function is(e) {
  return 'object' == typeof e && null !== e && '__isAuthError' in e;
}
class as extends ns {
  constructor(e, t, s) {
    (super(e, t, s), (this.name = 'AuthApiError'), (this.status = t), (this.code = s));
  }
}
class os extends ns {
  constructor(e, t) {
    (super(e), (this.name = 'AuthUnknownError'), (this.originalError = t));
  }
}
class cs extends ns {
  constructor(e, t, s, r) {
    (super(e, s, r), (this.name = t), (this.status = s));
  }
}
class ls extends cs {
  constructor() {
    super('Auth session missing!', 'AuthSessionMissingError', 400, void 0);
  }
}
function hs(e) {
  return is(e) && 'AuthSessionMissingError' === e.name;
}
class us extends cs {
  constructor() {
    super('Auth session or user missing', 'AuthInvalidTokenResponseError', 500, void 0);
  }
}
class ds extends cs {
  constructor(e) {
    super(e, 'AuthInvalidCredentialsError', 400, void 0);
  }
}
class ps extends cs {
  constructor(e, t = null) {
    (super(e, 'AuthImplicitGrantRedirectError', 500, void 0),
      (this.details = null),
      (this.details = t));
  }
  toJSON() {
    return { name: this.name, message: this.message, status: this.status, details: this.details };
  }
}
class fs extends cs {
  constructor(e, t = null) {
    (super(e, 'AuthPKCEGrantCodeExchangeError', 500, void 0),
      (this.details = null),
      (this.details = t));
  }
  toJSON() {
    return { name: this.name, message: this.message, status: this.status, details: this.details };
  }
}
class gs extends cs {
  constructor() {
    super(
      'PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.',
      'AuthPKCECodeVerifierMissingError',
      400,
      'pkce_code_verifier_not_found'
    );
  }
}
class ys extends cs {
  constructor(e, t) {
    super(e, 'AuthRetryableFetchError', t, void 0);
  }
}
function ms(e) {
  return is(e) && 'AuthRetryableFetchError' === e.name;
}
class ws extends cs {
  constructor(e, t, s) {
    (super(e, 'AuthWeakPasswordError', t, 'weak_password'), (this.reasons = s));
  }
}
class vs extends cs {
  constructor(e) {
    super(e, 'AuthInvalidJwtError', 400, 'invalid_jwt');
  }
}
const bs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split(''),
  _s = ' \t\n\r='.split(''),
  ks = (() => {
    const e = new Array(128);
    for (let t = 0; t < e.length; t += 1) e[t] = -1;
    for (let t = 0; t < _s.length; t += 1) e[_s[t].charCodeAt(0)] = -2;
    for (let t = 0; t < bs.length; t += 1) e[bs[t].charCodeAt(0)] = t;
    return e;
  })();
function Ss(e, t, s) {
  if (null !== e)
    for (t.queue = (t.queue << 8) | e, t.queuedBits += 8; t.queuedBits >= 6; ) {
      const e = (t.queue >> (t.queuedBits - 6)) & 63;
      (s(bs[e]), (t.queuedBits -= 6));
    }
  else if (t.queuedBits > 0)
    for (t.queue = t.queue << (6 - t.queuedBits), t.queuedBits = 6; t.queuedBits >= 6; ) {
      const e = (t.queue >> (t.queuedBits - 6)) & 63;
      (s(bs[e]), (t.queuedBits -= 6));
    }
}
function Ts(e, t, s) {
  const r = ks[e];
  if (!(r > -1)) {
    if (-2 === r) return;
    throw new Error(`Invalid Base64-URL character "${String.fromCharCode(e)}"`);
  }
  for (t.queue = (t.queue << 6) | r, t.queuedBits += 6; t.queuedBits >= 8; )
    (s((t.queue >> (t.queuedBits - 8)) & 255), (t.queuedBits -= 8));
}
function Es(e) {
  const t = [],
    s = e => {
      t.push(String.fromCodePoint(e));
    },
    r = { utf8seq: 0, codepoint: 0 },
    n = { queue: 0, queuedBits: 0 },
    i = e => {
      !(function (e, t, s) {
        if (0 === t.utf8seq) {
          if (e <= 127) return void s(e);
          for (let s = 1; s < 6; s += 1)
            if (!((e >> (7 - s)) & 1)) {
              t.utf8seq = s;
              break;
            }
          if (2 === t.utf8seq) t.codepoint = 31 & e;
          else if (3 === t.utf8seq) t.codepoint = 15 & e;
          else {
            if (4 !== t.utf8seq) throw new Error('Invalid UTF-8 sequence');
            t.codepoint = 7 & e;
          }
          t.utf8seq -= 1;
        } else if (t.utf8seq > 0) {
          if (e <= 127) throw new Error('Invalid UTF-8 sequence');
          ((t.codepoint = (t.codepoint << 6) | (63 & e)),
            (t.utf8seq -= 1),
            0 === t.utf8seq && s(t.codepoint));
        }
      })(e, r, s);
    };
  for (let a = 0; a < e.length; a += 1) Ts(e.charCodeAt(a), n, i);
  return t.join('');
}
function Os(e, t) {
  if (!(e <= 127)) {
    if (e <= 2047) return (t(192 | (e >> 6)), void t(128 | (63 & e)));
    if (e <= 65535) return (t(224 | (e >> 12)), t(128 | ((e >> 6) & 63)), void t(128 | (63 & e)));
    if (e <= 1114111)
      return (
        t(240 | (e >> 18)),
        t(128 | ((e >> 12) & 63)),
        t(128 | ((e >> 6) & 63)),
        void t(128 | (63 & e))
      );
    throw new Error(`Unrecognized Unicode codepoint: ${e.toString(16)}`);
  }
  t(e);
}
function Rs(e) {
  const t = [],
    s = { queue: 0, queuedBits: 0 },
    r = e => {
      t.push(e);
    };
  for (let n = 0; n < e.length; n += 1) Ts(e.charCodeAt(n), s, r);
  return new Uint8Array(t);
}
function As(e) {
  const t = [];
  return (
    (function (e, t) {
      for (let s = 0; s < e.length; s += 1) {
        let r = e.charCodeAt(s);
        if (r > 55295 && r <= 56319) {
          const t = (1024 * (r - 55296)) & 65535;
          ((r = 65536 + (((e.charCodeAt(s + 1) - 56320) & 65535) | t)), (s += 1));
        }
        Os(r, t);
      }
    })(e, e => t.push(e)),
    new Uint8Array(t)
  );
}
function Ps(e) {
  const t = [],
    s = { queue: 0, queuedBits: 0 },
    r = e => {
      t.push(e);
    };
  return (e.forEach(e => Ss(e, s, r)), Ss(null, s, r), t.join(''));
}
const js = () => 'undefined' != typeof window && 'undefined' != typeof document,
  Is = { tested: !1, writable: !1 },
  $s = () => {
    if (!js()) return !1;
    try {
      if ('object' != typeof globalThis.localStorage) return !1;
    } catch (t) {
      return !1;
    }
    if (Is.tested) return Is.writable;
    const e = `lswt-${Math.random()}${Math.random()}`;
    try {
      (globalThis.localStorage.setItem(e, e),
        globalThis.localStorage.removeItem(e),
        (Is.tested = !0),
        (Is.writable = !0));
    } catch (t) {
      ((Is.tested = !0), (Is.writable = !1));
    }
    return Is.writable;
  };
const Cs = e => (e ? (...t) => e(...t) : (...e) => fetch(...e)),
  xs = async (e, t, s) => {
    await e.setItem(t, JSON.stringify(s));
  },
  Ns = async (e, t) => {
    const s = await e.getItem(t);
    if (!s) return null;
    try {
      return JSON.parse(s);
    } catch (r) {
      return s;
    }
  },
  Us = async (e, t) => {
    await e.removeItem(t);
  };
class Ds {
  constructor() {
    this.promise = new Ds.promiseConstructor((e, t) => {
      ((this.resolve = e), (this.reject = t));
    });
  }
}
function qs(e) {
  const t = e.split('.');
  if (3 !== t.length) throw new vs('Invalid JWT structure');
  for (let s = 0; s < t.length; s++)
    if (!rs.test(t[s])) throw new vs('JWT not in base64url format');
  return {
    header: JSON.parse(Es(t[0])),
    payload: JSON.parse(Es(t[1])),
    signature: Rs(t[2]),
    raw: { header: t[0], payload: t[1] },
  };
}
function Ls(e) {
  return ('0' + e.toString(16)).substr(-2);
}
async function Bs(e) {
  if (
    !('undefined' != typeof crypto && void 0 !== crypto.subtle && 'undefined' != typeof TextEncoder)
  )
    return e;
  const t = await (async function (e) {
    const t = new TextEncoder().encode(e),
      s = await crypto.subtle.digest('SHA-256', t),
      r = new Uint8Array(s);
    return Array.from(r)
      .map(e => String.fromCharCode(e))
      .join('');
  })(e);
  return btoa(t).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function Ms(e, t, s = !1) {
  const r = (function () {
    const e = new Uint32Array(56);
    if ('undefined' == typeof crypto) {
      const e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~',
        t = e.length;
      let s = '';
      for (let r = 0; r < 56; r++) s += e.charAt(Math.floor(Math.random() * t));
      return s;
    }
    return (crypto.getRandomValues(e), Array.from(e, Ls).join(''));
  })();
  let n = r;
  (s && (n += '/PASSWORD_RECOVERY'), await xs(e, `${t}-code-verifier`, n));
  const i = await Bs(r);
  return [i, r === i ? 'plain' : 's256'];
}
Ds.promiseConstructor = Promise;
const Ks = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
const Ws = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function Fs(e) {
  if (!Ws.test(e)) throw new Error('@supabase/auth-js: Expected parameter to be UUID but is not');
}
function Hs() {
  return new Proxy(
    {},
    {
      get: (e, t) => {
        if ('__isUserNotAvailableProxy' === t) return !0;
        if ('symbol' == typeof t) {
          const e = t.toString();
          if (
            'Symbol(Symbol.toPrimitive)' === e ||
            'Symbol(Symbol.toStringTag)' === e ||
            'Symbol(util.inspect.custom)' === e
          )
            return;
        }
        throw new Error(
          `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t}" property of the session object is not supported. Please use getUser() instead.`
        );
      },
      set: (e, t) => {
        throw new Error(
          `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`
        );
      },
      deleteProperty: (e, t) => {
        throw new Error(
          `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`
        );
      },
    }
  );
}
function Gs(e) {
  return JSON.parse(JSON.stringify(e));
}
const Js = e => e.msg || e.message || e.error_description || e.error || JSON.stringify(e),
  Vs = [502, 503, 504];
async function zs(e) {
  var t, s;
  if (
    !(
      'object' == typeof (s = e) &&
      null !== s &&
      'status' in s &&
      'ok' in s &&
      'json' in s &&
      'function' == typeof s.json
    )
  )
    throw new ys(Js(e), 0);
  if (Vs.includes(e.status)) throw new ys(Js(e), e.status);
  let r, n;
  try {
    r = await e.json();
  } catch (a) {
    throw new os(Js(a), a);
  }
  const i = (function (e) {
    const t = e.headers.get(ts);
    if (!t) return null;
    if (!t.match(Ks)) return null;
    try {
      return new Date(`${t}T00:00:00.0Z`);
    } catch (a) {
      return null;
    }
  })(e);
  if (
    (i && i.getTime() >= ss.timestamp && 'object' == typeof r && r && 'string' == typeof r.code
      ? (n = r.code)
      : 'object' == typeof r && r && 'string' == typeof r.error_code && (n = r.error_code),
    n)
  ) {
    if ('weak_password' === n)
      throw new ws(
        Js(r),
        e.status,
        (null === (t = r.weak_password) || void 0 === t ? void 0 : t.reasons) || []
      );
    if ('session_not_found' === n) throw new ls();
  } else if (
    'object' == typeof r &&
    r &&
    'object' == typeof r.weak_password &&
    r.weak_password &&
    Array.isArray(r.weak_password.reasons) &&
    r.weak_password.reasons.length &&
    r.weak_password.reasons.reduce((e, t) => e && 'string' == typeof t, !0)
  )
    throw new ws(Js(r), e.status, r.weak_password.reasons);
  throw new as(Js(r), e.status || 500, n);
}
async function Qs(e, t, s, r) {
  var n;
  const i = Object.assign({}, null == r ? void 0 : r.headers);
  (i[ts] || (i[ts] = ss.name),
    (null == r ? void 0 : r.jwt) && (i.Authorization = `Bearer ${r.jwt}`));
  const a = null !== (n = null == r ? void 0 : r.query) && void 0 !== n ? n : {};
  (null == r ? void 0 : r.redirectTo) && (a.redirect_to = r.redirectTo);
  const o = Object.keys(a).length ? '?' + new URLSearchParams(a).toString() : '',
    c = await (async function (e, t, s, r, n, i) {
      const a = ((e, t, s, r) => {
        const n = { method: e, headers: (null == t ? void 0 : t.headers) || {} };
        return 'GET' === e
          ? n
          : ((n.headers = Object.assign(
              { 'Content-Type': 'application/json;charset=UTF-8' },
              null == t ? void 0 : t.headers
            )),
            (n.body = JSON.stringify(r)),
            Object.assign(Object.assign({}, n), s));
      })(t, r, n, i);
      let o;
      try {
        o = await e(s, Object.assign({}, a));
      } catch (c) {
        throw new ys(Js(c), 0);
      }
      o.ok || (await zs(o));
      if (null == r ? void 0 : r.noResolveJson) return o;
      try {
        return await o.json();
      } catch (c) {
        await zs(c);
      }
    })(
      e,
      t,
      s + o,
      { headers: i, noResolveJson: null == r ? void 0 : r.noResolveJson },
      {},
      null == r ? void 0 : r.body
    );
  return (null == r ? void 0 : r.xform)
    ? null == r
      ? void 0
      : r.xform(c)
    : { data: Object.assign({}, c), error: null };
}
function Ys(e) {
  var t;
  let s = null;
  var r;
  (function (e) {
    return e.access_token && e.refresh_token && e.expires_in;
  })(e) &&
    ((s = Object.assign({}, e)),
    e.expires_at || (s.expires_at = ((r = e.expires_in), Math.round(Date.now() / 1e3) + r)));
  return { data: { session: s, user: null !== (t = e.user) && void 0 !== t ? t : e }, error: null };
}
function Xs(e) {
  const t = Ys(e);
  return (
    !t.error &&
      e.weak_password &&
      'object' == typeof e.weak_password &&
      Array.isArray(e.weak_password.reasons) &&
      e.weak_password.reasons.length &&
      e.weak_password.message &&
      'string' == typeof e.weak_password.message &&
      e.weak_password.reasons.reduce((e, t) => e && 'string' == typeof t, !0) &&
      (t.data.weak_password = e.weak_password),
    t
  );
}
function Zs(e) {
  var t;
  return { data: { user: null !== (t = e.user) && void 0 !== t ? t : e }, error: null };
}
function er(e) {
  return { data: e, error: null };
}
function tr(e) {
  const { action_link: t, email_otp: s, hashed_token: r, redirect_to: n, verification_type: i } = e,
    a = ee(e, ['action_link', 'email_otp', 'hashed_token', 'redirect_to', 'verification_type']);
  return {
    data: {
      properties: {
        action_link: t,
        email_otp: s,
        hashed_token: r,
        redirect_to: n,
        verification_type: i,
      },
      user: Object.assign({}, a),
    },
    error: null,
  };
}
function sr(e) {
  return e;
}
const rr = ['global', 'local', 'others'];
class nr {
  constructor({ url: e = '', headers: t = {}, fetch: s }) {
    ((this.url = e),
      (this.headers = t),
      (this.fetch = Cs(s)),
      (this.mfa = {
        listFactors: this._listFactors.bind(this),
        deleteFactor: this._deleteFactor.bind(this),
      }),
      (this.oauth = {
        listClients: this._listOAuthClients.bind(this),
        createClient: this._createOAuthClient.bind(this),
        getClient: this._getOAuthClient.bind(this),
        updateClient: this._updateOAuthClient.bind(this),
        deleteClient: this._deleteOAuthClient.bind(this),
        regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this),
      }));
  }
  async signOut(e, t = rr[0]) {
    if (rr.indexOf(t) < 0)
      throw new Error(`@supabase/auth-js: Parameter scope must be one of ${rr.join(', ')}`);
    try {
      return (
        await Qs(this.fetch, 'POST', `${this.url}/logout?scope=${t}`, {
          headers: this.headers,
          jwt: e,
          noResolveJson: !0,
        }),
        { data: null, error: null }
      );
    } catch (s) {
      if (is(s)) return { data: null, error: s };
      throw s;
    }
  }
  async inviteUserByEmail(e, t = {}) {
    try {
      return await Qs(this.fetch, 'POST', `${this.url}/invite`, {
        body: { email: e, data: t.data },
        headers: this.headers,
        redirectTo: t.redirectTo,
        xform: Zs,
      });
    } catch (s) {
      if (is(s)) return { data: { user: null }, error: s };
      throw s;
    }
  }
  async generateLink(e) {
    try {
      const { options: t } = e,
        s = ee(e, ['options']),
        r = Object.assign(Object.assign({}, s), t);
      return (
        'newEmail' in s && ((r.new_email = null == s ? void 0 : s.newEmail), delete r.newEmail),
        await Qs(this.fetch, 'POST', `${this.url}/admin/generate_link`, {
          body: r,
          headers: this.headers,
          xform: tr,
          redirectTo: null == t ? void 0 : t.redirectTo,
        })
      );
    } catch (t) {
      if (is(t)) return { data: { properties: null, user: null }, error: t };
      throw t;
    }
  }
  async createUser(e) {
    try {
      return await Qs(this.fetch, 'POST', `${this.url}/admin/users`, {
        body: e,
        headers: this.headers,
        xform: Zs,
      });
    } catch (t) {
      if (is(t)) return { data: { user: null }, error: t };
      throw t;
    }
  }
  async listUsers(e) {
    var t, s, r, n, i, a, o;
    try {
      const c = { nextPage: null, lastPage: 0, total: 0 },
        l = await Qs(this.fetch, 'GET', `${this.url}/admin/users`, {
          headers: this.headers,
          noResolveJson: !0,
          query: {
            page:
              null !==
                (s =
                  null === (t = null == e ? void 0 : e.page) || void 0 === t
                    ? void 0
                    : t.toString()) && void 0 !== s
                ? s
                : '',
            per_page:
              null !==
                (n =
                  null === (r = null == e ? void 0 : e.perPage) || void 0 === r
                    ? void 0
                    : r.toString()) && void 0 !== n
                ? n
                : '',
          },
          xform: sr,
        });
      if (l.error) throw l.error;
      const h = await l.json(),
        u = null !== (i = l.headers.get('x-total-count')) && void 0 !== i ? i : 0,
        d =
          null !==
            (o = null === (a = l.headers.get('link')) || void 0 === a ? void 0 : a.split(',')) &&
          void 0 !== o
            ? o
            : [];
      return (
        d.length > 0 &&
          (d.forEach(e => {
            const t = parseInt(e.split(';')[0].split('=')[1].substring(0, 1)),
              s = JSON.parse(e.split(';')[1].split('=')[1]);
            c[`${s}Page`] = t;
          }),
          (c.total = parseInt(u))),
        { data: Object.assign(Object.assign({}, h), c), error: null }
      );
    } catch (c) {
      if (is(c)) return { data: { users: [] }, error: c };
      throw c;
    }
  }
  async getUserById(e) {
    Fs(e);
    try {
      return await Qs(this.fetch, 'GET', `${this.url}/admin/users/${e}`, {
        headers: this.headers,
        xform: Zs,
      });
    } catch (t) {
      if (is(t)) return { data: { user: null }, error: t };
      throw t;
    }
  }
  async updateUserById(e, t) {
    Fs(e);
    try {
      return await Qs(this.fetch, 'PUT', `${this.url}/admin/users/${e}`, {
        body: t,
        headers: this.headers,
        xform: Zs,
      });
    } catch (s) {
      if (is(s)) return { data: { user: null }, error: s };
      throw s;
    }
  }
  async deleteUser(e, t = !1) {
    Fs(e);
    try {
      return await Qs(this.fetch, 'DELETE', `${this.url}/admin/users/${e}`, {
        headers: this.headers,
        body: { should_soft_delete: t },
        xform: Zs,
      });
    } catch (s) {
      if (is(s)) return { data: { user: null }, error: s };
      throw s;
    }
  }
  async _listFactors(e) {
    Fs(e.userId);
    try {
      const { data: t, error: s } = await Qs(
        this.fetch,
        'GET',
        `${this.url}/admin/users/${e.userId}/factors`,
        { headers: this.headers, xform: e => ({ data: { factors: e }, error: null }) }
      );
      return { data: t, error: s };
    } catch (t) {
      if (is(t)) return { data: null, error: t };
      throw t;
    }
  }
  async _deleteFactor(e) {
    (Fs(e.userId), Fs(e.id));
    try {
      return {
        data: await Qs(
          this.fetch,
          'DELETE',
          `${this.url}/admin/users/${e.userId}/factors/${e.id}`,
          { headers: this.headers }
        ),
        error: null,
      };
    } catch (t) {
      if (is(t)) return { data: null, error: t };
      throw t;
    }
  }
  async _listOAuthClients(e) {
    var t, s, r, n, i, a, o;
    try {
      const c = { nextPage: null, lastPage: 0, total: 0 },
        l = await Qs(this.fetch, 'GET', `${this.url}/admin/oauth/clients`, {
          headers: this.headers,
          noResolveJson: !0,
          query: {
            page:
              null !==
                (s =
                  null === (t = null == e ? void 0 : e.page) || void 0 === t
                    ? void 0
                    : t.toString()) && void 0 !== s
                ? s
                : '',
            per_page:
              null !==
                (n =
                  null === (r = null == e ? void 0 : e.perPage) || void 0 === r
                    ? void 0
                    : r.toString()) && void 0 !== n
                ? n
                : '',
          },
          xform: sr,
        });
      if (l.error) throw l.error;
      const h = await l.json(),
        u = null !== (i = l.headers.get('x-total-count')) && void 0 !== i ? i : 0,
        d =
          null !==
            (o = null === (a = l.headers.get('link')) || void 0 === a ? void 0 : a.split(',')) &&
          void 0 !== o
            ? o
            : [];
      return (
        d.length > 0 &&
          (d.forEach(e => {
            const t = parseInt(e.split(';')[0].split('=')[1].substring(0, 1)),
              s = JSON.parse(e.split(';')[1].split('=')[1]);
            c[`${s}Page`] = t;
          }),
          (c.total = parseInt(u))),
        { data: Object.assign(Object.assign({}, h), c), error: null }
      );
    } catch (c) {
      if (is(c)) return { data: { clients: [] }, error: c };
      throw c;
    }
  }
  async _createOAuthClient(e) {
    try {
      return await Qs(this.fetch, 'POST', `${this.url}/admin/oauth/clients`, {
        body: e,
        headers: this.headers,
        xform: e => ({ data: e, error: null }),
      });
    } catch (t) {
      if (is(t)) return { data: null, error: t };
      throw t;
    }
  }
  async _getOAuthClient(e) {
    try {
      return await Qs(this.fetch, 'GET', `${this.url}/admin/oauth/clients/${e}`, {
        headers: this.headers,
        xform: e => ({ data: e, error: null }),
      });
    } catch (t) {
      if (is(t)) return { data: null, error: t };
      throw t;
    }
  }
  async _updateOAuthClient(e, t) {
    try {
      return await Qs(this.fetch, 'PUT', `${this.url}/admin/oauth/clients/${e}`, {
        body: t,
        headers: this.headers,
        xform: e => ({ data: e, error: null }),
      });
    } catch (s) {
      if (is(s)) return { data: null, error: s };
      throw s;
    }
  }
  async _deleteOAuthClient(e) {
    try {
      return (
        await Qs(this.fetch, 'DELETE', `${this.url}/admin/oauth/clients/${e}`, {
          headers: this.headers,
          noResolveJson: !0,
        }),
        { data: null, error: null }
      );
    } catch (t) {
      if (is(t)) return { data: null, error: t };
      throw t;
    }
  }
  async _regenerateOAuthClientSecret(e) {
    try {
      return await Qs(
        this.fetch,
        'POST',
        `${this.url}/admin/oauth/clients/${e}/regenerate_secret`,
        { headers: this.headers, xform: e => ({ data: e, error: null }) }
      );
    } catch (t) {
      if (is(t)) return { data: null, error: t };
      throw t;
    }
  }
}
function ir(e = {}) {
  return {
    getItem: t => e[t] || null,
    setItem: (t, s) => {
      e[t] = s;
    },
    removeItem: t => {
      delete e[t];
    },
  };
}
const ar = !!(
  globalThis &&
  $s() &&
  globalThis.localStorage &&
  'true' === globalThis.localStorage.getItem('supabase.gotrue-js.locks.debug')
);
class or extends Error {
  constructor(e) {
    (super(e), (this.isAcquireTimeout = !0));
  }
}
class cr extends or {}
async function lr(e, t, s) {
  const r = new globalThis.AbortController();
  return (
    t > 0 &&
      setTimeout(() => {
        r.abort();
      }, t),
    await Promise.resolve().then(() =>
      globalThis.navigator.locks.request(
        e,
        0 === t ? { mode: 'exclusive', ifAvailable: !0 } : { mode: 'exclusive', signal: r.signal },
        async r => {
          if (!r) {
            if (0 === t)
              throw new cr(
                `Acquiring an exclusive Navigator LockManager lock "${e}" immediately failed`
              );
            if (ar)
              try {
                await globalThis.navigator.locks.query();
              } catch (n) {}
            return await s();
          }
          try {
            return await s();
          } finally {
          }
        }
      )
    )
  );
}
function hr(e) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(e))
    throw new Error(`@supabase/auth-js: Address "${e}" is invalid.`);
  return e.toLowerCase();
}
function ur(e) {
  const t = new TextEncoder().encode(e);
  return '0x' + Array.from(t, e => e.toString(16).padStart(2, '0')).join('');
}
class dr extends Error {
  constructor({ message: e, code: t, cause: s, name: r }) {
    var n;
    (super(e, { cause: s }),
      (this.__isWebAuthnError = !0),
      (this.name =
        null !== (n = null != r ? r : s instanceof Error ? s.name : void 0) && void 0 !== n
          ? n
          : 'Unknown Error'),
      (this.code = t));
  }
}
class pr extends dr {
  constructor(e, t) {
    (super({ code: 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY', cause: t, message: e }),
      (this.name = 'WebAuthnUnknownError'),
      (this.originalError = t));
  }
}
function fr({ error: e, options: t }) {
  var s, r, n;
  const { publicKey: i } = t;
  if (!i) throw Error('options was missing required publicKey property');
  if ('AbortError' === e.name) {
    if (t.signal instanceof AbortSignal)
      return new dr({
        message: 'Registration ceremony was sent an abort signal',
        code: 'ERROR_CEREMONY_ABORTED',
        cause: e,
      });
  } else if ('ConstraintError' === e.name) {
    if (
      !0 ===
      (null === (s = i.authenticatorSelection) || void 0 === s ? void 0 : s.requireResidentKey)
    )
      return new dr({
        message:
          'Discoverable credentials were required but no available authenticator supported it',
        code: 'ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT',
        cause: e,
      });
    if (
      'conditional' === t.mediation &&
      'required' ===
        (null === (r = i.authenticatorSelection) || void 0 === r ? void 0 : r.userVerification)
    )
      return new dr({
        message:
          'User verification was required during automatic registration but it could not be performed',
        code: 'ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE',
        cause: e,
      });
    if (
      'required' ===
      (null === (n = i.authenticatorSelection) || void 0 === n ? void 0 : n.userVerification)
    )
      return new dr({
        message: 'User verification was required but no available authenticator supported it',
        code: 'ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT',
        cause: e,
      });
  } else {
    if ('InvalidStateError' === e.name)
      return new dr({
        message: 'The authenticator was previously registered',
        code: 'ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED',
        cause: e,
      });
    if ('NotAllowedError' === e.name)
      return new dr({ message: e.message, code: 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY', cause: e });
    if ('NotSupportedError' === e.name) {
      return 0 === i.pubKeyCredParams.filter(e => 'public-key' === e.type).length
        ? new dr({
            message: 'No entry in pubKeyCredParams was of type "public-key"',
            code: 'ERROR_MALFORMED_PUBKEYCREDPARAMS',
            cause: e,
          })
        : new dr({
            message:
              'No available authenticator supported any of the specified pubKeyCredParams algorithms',
            code: 'ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG',
            cause: e,
          });
    }
    if ('SecurityError' === e.name) {
      const t = window.location.hostname;
      if (!_r(t))
        return new dr({
          message: `${window.location.hostname} is an invalid domain`,
          code: 'ERROR_INVALID_DOMAIN',
          cause: e,
        });
      if (i.rp.id !== t)
        return new dr({
          message: `The RP ID "${i.rp.id}" is invalid for this domain`,
          code: 'ERROR_INVALID_RP_ID',
          cause: e,
        });
    } else if ('TypeError' === e.name) {
      if (i.user.id.byteLength < 1 || i.user.id.byteLength > 64)
        return new dr({
          message: 'User ID was not between 1 and 64 characters',
          code: 'ERROR_INVALID_USER_ID_LENGTH',
          cause: e,
        });
    } else if ('UnknownError' === e.name)
      return new dr({
        message:
          'The authenticator was unable to process the specified options, or could not create a new credential',
        code: 'ERROR_AUTHENTICATOR_GENERAL_ERROR',
        cause: e,
      });
  }
  return new dr({
    message: 'a Non-Webauthn related error has occurred',
    code: 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY',
    cause: e,
  });
}
function gr({ error: e, options: t }) {
  const { publicKey: s } = t;
  if (!s) throw Error('options was missing required publicKey property');
  if ('AbortError' === e.name) {
    if (t.signal instanceof AbortSignal)
      return new dr({
        message: 'Authentication ceremony was sent an abort signal',
        code: 'ERROR_CEREMONY_ABORTED',
        cause: e,
      });
  } else {
    if ('NotAllowedError' === e.name)
      return new dr({ message: e.message, code: 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY', cause: e });
    if ('SecurityError' === e.name) {
      const t = window.location.hostname;
      if (!_r(t))
        return new dr({
          message: `${window.location.hostname} is an invalid domain`,
          code: 'ERROR_INVALID_DOMAIN',
          cause: e,
        });
      if (s.rpId !== t)
        return new dr({
          message: `The RP ID "${s.rpId}" is invalid for this domain`,
          code: 'ERROR_INVALID_RP_ID',
          cause: e,
        });
    } else if ('UnknownError' === e.name)
      return new dr({
        message:
          'The authenticator was unable to process the specified options, or could not create a new assertion signature',
        code: 'ERROR_AUTHENTICATOR_GENERAL_ERROR',
        cause: e,
      });
  }
  return new dr({
    message: 'a Non-Webauthn related error has occurred',
    code: 'ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY',
    cause: e,
  });
}
const yr = new (class {
  createNewAbortSignal() {
    if (this.controller) {
      const e = new Error('Cancelling existing WebAuthn API call for new one');
      ((e.name = 'AbortError'), this.controller.abort(e));
    }
    const e = new AbortController();
    return ((this.controller = e), e.signal);
  }
  cancelCeremony() {
    if (this.controller) {
      const e = new Error('Manually cancelling existing WebAuthn API call');
      ((e.name = 'AbortError'), this.controller.abort(e), (this.controller = void 0));
    }
  }
})();
function mr(e) {
  if (!e) throw new Error('Credential creation options are required');
  if (
    'undefined' != typeof PublicKeyCredential &&
    'parseCreationOptionsFromJSON' in PublicKeyCredential &&
    'function' == typeof PublicKeyCredential.parseCreationOptionsFromJSON
  )
    return PublicKeyCredential.parseCreationOptionsFromJSON(e);
  const { challenge: t, user: s, excludeCredentials: r } = e,
    n = ee(e, ['challenge', 'user', 'excludeCredentials']),
    i = Rs(t).buffer,
    a = Object.assign(Object.assign({}, s), { id: Rs(s.id).buffer }),
    o = Object.assign(Object.assign({}, n), { challenge: i, user: a });
  if (r && r.length > 0) {
    o.excludeCredentials = new Array(r.length);
    for (let e = 0; e < r.length; e++) {
      const t = r[e];
      o.excludeCredentials[e] = Object.assign(Object.assign({}, t), {
        id: Rs(t.id).buffer,
        type: t.type || 'public-key',
        transports: t.transports,
      });
    }
  }
  return o;
}
function wr(e) {
  if (!e) throw new Error('Credential request options are required');
  if (
    'undefined' != typeof PublicKeyCredential &&
    'parseRequestOptionsFromJSON' in PublicKeyCredential &&
    'function' == typeof PublicKeyCredential.parseRequestOptionsFromJSON
  )
    return PublicKeyCredential.parseRequestOptionsFromJSON(e);
  const { challenge: t, allowCredentials: s } = e,
    r = ee(e, ['challenge', 'allowCredentials']),
    n = Rs(t).buffer,
    i = Object.assign(Object.assign({}, r), { challenge: n });
  if (s && s.length > 0) {
    i.allowCredentials = new Array(s.length);
    for (let e = 0; e < s.length; e++) {
      const t = s[e];
      i.allowCredentials[e] = Object.assign(Object.assign({}, t), {
        id: Rs(t.id).buffer,
        type: t.type || 'public-key',
        transports: t.transports,
      });
    }
  }
  return i;
}
function vr(e) {
  var t;
  if ('toJSON' in e && 'function' == typeof e.toJSON) return e.toJSON();
  const s = e;
  return {
    id: e.id,
    rawId: e.id,
    response: {
      attestationObject: Ps(new Uint8Array(e.response.attestationObject)),
      clientDataJSON: Ps(new Uint8Array(e.response.clientDataJSON)),
    },
    type: 'public-key',
    clientExtensionResults: e.getClientExtensionResults(),
    authenticatorAttachment: null !== (t = s.authenticatorAttachment) && void 0 !== t ? t : void 0,
  };
}
function br(e) {
  var t;
  if ('toJSON' in e && 'function' == typeof e.toJSON) return e.toJSON();
  const s = e,
    r = e.getClientExtensionResults(),
    n = e.response;
  return {
    id: e.id,
    rawId: e.id,
    response: {
      authenticatorData: Ps(new Uint8Array(n.authenticatorData)),
      clientDataJSON: Ps(new Uint8Array(n.clientDataJSON)),
      signature: Ps(new Uint8Array(n.signature)),
      userHandle: n.userHandle ? Ps(new Uint8Array(n.userHandle)) : void 0,
    },
    type: 'public-key',
    clientExtensionResults: r,
    authenticatorAttachment: null !== (t = s.authenticatorAttachment) && void 0 !== t ? t : void 0,
  };
}
function _r(e) {
  return 'localhost' === e || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e);
}
function kr() {
  var e, t;
  return !!(
    js() &&
    'PublicKeyCredential' in window &&
    window.PublicKeyCredential &&
    'credentials' in navigator &&
    'function' ==
      typeof (null ===
        (e = null === navigator || void 0 === navigator ? void 0 : navigator.credentials) ||
      void 0 === e
        ? void 0
        : e.create) &&
    'function' ==
      typeof (null ===
        (t = null === navigator || void 0 === navigator ? void 0 : navigator.credentials) ||
      void 0 === t
        ? void 0
        : t.get)
  );
}
const Sr = {
    hints: ['security-key'],
    authenticatorSelection: {
      authenticatorAttachment: 'cross-platform',
      requireResidentKey: !1,
      userVerification: 'preferred',
      residentKey: 'discouraged',
    },
    attestation: 'direct',
  },
  Tr = { userVerification: 'preferred', hints: ['security-key'], attestation: 'direct' };
function Er(...e) {
  const t = e => null !== e && 'object' == typeof e && !Array.isArray(e),
    s = e => e instanceof ArrayBuffer || ArrayBuffer.isView(e),
    r = {};
  for (const n of e)
    if (n)
      for (const e in n) {
        const i = n[e];
        if (void 0 !== i)
          if (Array.isArray(i)) r[e] = i;
          else if (s(i)) r[e] = i;
          else if (t(i)) {
            const s = r[e];
            t(s) ? (r[e] = Er(s, i)) : (r[e] = Er(i));
          } else r[e] = i;
      }
  return r;
}
class Or {
  constructor(e) {
    ((this.client = e),
      (this.enroll = this._enroll.bind(this)),
      (this.challenge = this._challenge.bind(this)),
      (this.verify = this._verify.bind(this)),
      (this.authenticate = this._authenticate.bind(this)),
      (this.register = this._register.bind(this)));
  }
  async _enroll(e) {
    return this.client.mfa.enroll(Object.assign(Object.assign({}, e), { factorType: 'webauthn' }));
  }
  async _challenge({ factorId: e, webauthn: t, friendlyName: s, signal: r }, n) {
    var i;
    try {
      const { data: a, error: o } = await this.client.mfa.challenge({ factorId: e, webauthn: t });
      if (!a) return { data: null, error: o };
      const c = null != r ? r : yr.createNewAbortSignal();
      if ('create' === a.webauthn.type) {
        const { user: e } = a.webauthn.credential_options.publicKey;
        if (!e.name) {
          const t = s;
          if (t) e.name = `${e.id}:${t}`;
          else {
            const t = (await this.client.getUser()).data.user,
              s =
                (null === (i = null == t ? void 0 : t.user_metadata) || void 0 === i
                  ? void 0
                  : i.name) ||
                (null == t ? void 0 : t.email) ||
                (null == t ? void 0 : t.id) ||
                'User';
            e.name = `${e.id}:${s}`;
          }
        }
        e.displayName || (e.displayName = e.name);
      }
      switch (a.webauthn.type) {
        case 'create': {
          const t = (function (e, t) {
              return Er(Sr, e, t || {});
            })(a.webauthn.credential_options.publicKey, null == n ? void 0 : n.create),
            { data: s, error: r } = await (async function (e) {
              try {
                const t = await navigator.credentials.create(e);
                return t
                  ? t instanceof PublicKeyCredential
                    ? { data: t, error: null }
                    : {
                        data: null,
                        error: new pr('Browser returned unexpected credential type', t),
                      }
                  : { data: null, error: new pr('Empty credential response', t) };
              } catch (t) {
                return { data: null, error: fr({ error: t, options: e }) };
              }
            })({ publicKey: t, signal: c });
          return s
            ? {
                data: {
                  factorId: e,
                  challengeId: a.id,
                  webauthn: { type: a.webauthn.type, credential_response: s },
                },
                error: null,
              }
            : { data: null, error: r };
        }
        case 'request': {
          const t = (function (e, t) {
              return Er(Tr, e, t || {});
            })(a.webauthn.credential_options.publicKey, null == n ? void 0 : n.request),
            { data: s, error: r } = await (async function (e) {
              try {
                const t = await navigator.credentials.get(e);
                return t
                  ? t instanceof PublicKeyCredential
                    ? { data: t, error: null }
                    : {
                        data: null,
                        error: new pr('Browser returned unexpected credential type', t),
                      }
                  : { data: null, error: new pr('Empty credential response', t) };
              } catch (t) {
                return { data: null, error: gr({ error: t, options: e }) };
              }
            })(
              Object.assign(Object.assign({}, a.webauthn.credential_options), {
                publicKey: t,
                signal: c,
              })
            );
          return s
            ? {
                data: {
                  factorId: e,
                  challengeId: a.id,
                  webauthn: { type: a.webauthn.type, credential_response: s },
                },
                error: null,
              }
            : { data: null, error: r };
        }
      }
    } catch (a) {
      return is(a)
        ? { data: null, error: a }
        : { data: null, error: new os('Unexpected error in challenge', a) };
    }
  }
  async _verify({ challengeId: e, factorId: t, webauthn: s }) {
    return this.client.mfa.verify({ factorId: t, challengeId: e, webauthn: s });
  }
  async _authenticate(
    {
      factorId: e,
      webauthn: {
        rpId: t = 'undefined' != typeof window ? window.location.hostname : void 0,
        rpOrigins: s = 'undefined' != typeof window ? [window.location.origin] : void 0,
        signal: r,
      } = {},
    },
    n
  ) {
    if (!t) return { data: null, error: new ns('rpId is required for WebAuthn authentication') };
    try {
      if (!kr()) return { data: null, error: new os('Browser does not support WebAuthn', null) };
      const { data: i, error: a } = await this.challenge(
        { factorId: e, webauthn: { rpId: t, rpOrigins: s }, signal: r },
        { request: n }
      );
      if (!i) return { data: null, error: a };
      const { webauthn: o } = i;
      return this._verify({
        factorId: e,
        challengeId: i.challengeId,
        webauthn: {
          type: o.type,
          rpId: t,
          rpOrigins: s,
          credential_response: o.credential_response,
        },
      });
    } catch (i) {
      return is(i)
        ? { data: null, error: i }
        : { data: null, error: new os('Unexpected error in authenticate', i) };
    }
  }
  async _register(
    {
      friendlyName: e,
      webauthn: {
        rpId: t = 'undefined' != typeof window ? window.location.hostname : void 0,
        rpOrigins: s = 'undefined' != typeof window ? [window.location.origin] : void 0,
        signal: r,
      } = {},
    },
    n
  ) {
    if (!t) return { data: null, error: new ns('rpId is required for WebAuthn registration') };
    try {
      if (!kr()) return { data: null, error: new os('Browser does not support WebAuthn', null) };
      const { data: i, error: a } = await this._enroll({ friendlyName: e });
      if (!i)
        return (
          await this.client.mfa
            .listFactors()
            .then(t => {
              var s;
              return null === (s = t.data) || void 0 === s
                ? void 0
                : s.all.find(
                    t =>
                      'webauthn' === t.factor_type &&
                      t.friendly_name === e &&
                      'unverified' !== t.status
                  );
            })
            .then(e =>
              e ? this.client.mfa.unenroll({ factorId: null == e ? void 0 : e.id }) : void 0
            ),
          { data: null, error: a }
        );
      const { data: o, error: c } = await this._challenge(
        {
          factorId: i.id,
          friendlyName: i.friendly_name,
          webauthn: { rpId: t, rpOrigins: s },
          signal: r,
        },
        { create: n }
      );
      return o
        ? this._verify({
            factorId: i.id,
            challengeId: o.challengeId,
            webauthn: {
              rpId: t,
              rpOrigins: s,
              type: o.webauthn.type,
              credential_response: o.webauthn.credential_response,
            },
          })
        : { data: null, error: c };
    } catch (i) {
      return is(i)
        ? { data: null, error: i }
        : { data: null, error: new os('Unexpected error in register', i) };
    }
  }
}
!(function () {
  if ('object' != typeof globalThis)
    try {
      (Object.defineProperty(Object.prototype, '__magic__', {
        get: function () {
          return this;
        },
        configurable: !0,
      }),
        (__magic__.globalThis = __magic__),
        delete Object.prototype.__magic__);
    } catch (e) {
      'undefined' != typeof self && (self.globalThis = self);
    }
})();
const Rr = {
  url: 'http://localhost:9999',
  storageKey: 'supabase.auth.token',
  autoRefreshToken: !0,
  persistSession: !0,
  detectSessionInUrl: !0,
  headers: es,
  flowType: 'implicit',
  debug: !1,
  hasCustomAuthorizationHeader: !1,
  throwOnError: !1,
  lockAcquireTimeout: 1e4,
};
async function Ar(e, t, s) {
  return await s();
}
const Pr = {};
class jr {
  get jwks() {
    var e, t;
    return null !== (t = null === (e = Pr[this.storageKey]) || void 0 === e ? void 0 : e.jwks) &&
      void 0 !== t
      ? t
      : { keys: [] };
  }
  set jwks(e) {
    Pr[this.storageKey] = Object.assign(Object.assign({}, Pr[this.storageKey]), { jwks: e });
  }
  get jwks_cached_at() {
    var e, t;
    return null !==
      (t = null === (e = Pr[this.storageKey]) || void 0 === e ? void 0 : e.cachedAt) && void 0 !== t
      ? t
      : Number.MIN_SAFE_INTEGER;
  }
  set jwks_cached_at(e) {
    Pr[this.storageKey] = Object.assign(Object.assign({}, Pr[this.storageKey]), { cachedAt: e });
  }
  constructor(e) {
    var t, s, r;
    ((this.userStorage = null),
      (this.memoryStorage = null),
      (this.stateChangeEmitters = new Map()),
      (this.autoRefreshTicker = null),
      (this.autoRefreshTickTimeout = null),
      (this.visibilityChangedCallback = null),
      (this.refreshingDeferred = null),
      (this.initializePromise = null),
      (this.detectSessionInUrl = !0),
      (this.hasCustomAuthorizationHeader = !1),
      (this.suppressGetSessionWarning = !1),
      (this.lockAcquired = !1),
      (this.pendingInLock = []),
      (this.broadcastChannel = null),
      (this.logger = console.log));
    const n = Object.assign(Object.assign({}, Rr), e);
    if (
      ((this.storageKey = n.storageKey),
      (this.instanceID = null !== (t = jr.nextInstanceID[this.storageKey]) && void 0 !== t ? t : 0),
      (jr.nextInstanceID[this.storageKey] = this.instanceID + 1),
      (this.logDebugMessages = !!n.debug),
      'function' == typeof n.debug && (this.logger = n.debug),
      this.instanceID > 0 && js())
    ) {
      this._logPrefix();
      this.logDebugMessages;
    }
    if (
      ((this.persistSession = n.persistSession),
      (this.autoRefreshToken = n.autoRefreshToken),
      (this.admin = new nr({ url: n.url, headers: n.headers, fetch: n.fetch })),
      (this.url = n.url),
      (this.headers = n.headers),
      (this.fetch = Cs(n.fetch)),
      (this.lock = n.lock || Ar),
      (this.detectSessionInUrl = n.detectSessionInUrl),
      (this.flowType = n.flowType),
      (this.hasCustomAuthorizationHeader = n.hasCustomAuthorizationHeader),
      (this.throwOnError = n.throwOnError),
      (this.lockAcquireTimeout = n.lockAcquireTimeout),
      n.lock
        ? (this.lock = n.lock)
        : this.persistSession &&
            js() &&
            (null ===
              (s = null === globalThis || void 0 === globalThis ? void 0 : globalThis.navigator) ||
            void 0 === s
              ? void 0
              : s.locks)
          ? (this.lock = lr)
          : (this.lock = Ar),
      this.jwks || ((this.jwks = { keys: [] }), (this.jwks_cached_at = Number.MIN_SAFE_INTEGER)),
      (this.mfa = {
        verify: this._verify.bind(this),
        enroll: this._enroll.bind(this),
        unenroll: this._unenroll.bind(this),
        challenge: this._challenge.bind(this),
        listFactors: this._listFactors.bind(this),
        challengeAndVerify: this._challengeAndVerify.bind(this),
        getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this),
        webauthn: new Or(this),
      }),
      (this.oauth = {
        getAuthorizationDetails: this._getAuthorizationDetails.bind(this),
        approveAuthorization: this._approveAuthorization.bind(this),
        denyAuthorization: this._denyAuthorization.bind(this),
        listGrants: this._listOAuthGrants.bind(this),
        revokeGrant: this._revokeOAuthGrant.bind(this),
      }),
      this.persistSession
        ? (n.storage
            ? (this.storage = n.storage)
            : $s()
              ? (this.storage = globalThis.localStorage)
              : ((this.memoryStorage = {}), (this.storage = ir(this.memoryStorage))),
          n.userStorage && (this.userStorage = n.userStorage))
        : ((this.memoryStorage = {}), (this.storage = ir(this.memoryStorage))),
      js() && globalThis.BroadcastChannel && this.persistSession && this.storageKey)
    ) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
      } catch (i) {}
      null === (r = this.broadcastChannel) ||
        void 0 === r ||
        r.addEventListener('message', async e => {
          this._debug('received broadcast notification from other tab or client', e);
          try {
            await this._notifyAllSubscribers(e.data.event, e.data.session, !1);
          } catch (t) {
            this._debug('#broadcastChannel', 'error', t);
          }
        });
    }
    this.initialize().catch(e => {
      this._debug('#initialize()', 'error', e);
    });
  }
  isThrowOnErrorEnabled() {
    return this.throwOnError;
  }
  _returnResult(e) {
    if (this.throwOnError && e && e.error) throw e.error;
    return e;
  }
  _logPrefix() {
    return `GoTrueClient@${this.storageKey}:${this.instanceID} (${Yt}) ${new Date().toISOString()}`;
  }
  _debug(...e) {
    return (this.logDebugMessages && this.logger(this._logPrefix(), ...e), this);
  }
  async initialize() {
    return (
      this.initializePromise ||
        (this.initializePromise = (async () =>
          await this._acquireLock(
            this.lockAcquireTimeout,
            async () => await this._initialize()
          ))()),
      await this.initializePromise
    );
  }
  async _initialize() {
    var e;
    try {
      let t = {},
        s = 'none';
      if (
        (js() &&
          ((t = (function (e) {
            const t = {},
              s = new URL(e);
            if (s.hash && '#' === s.hash[0])
              try {
                new URLSearchParams(s.hash.substring(1)).forEach((e, s) => {
                  t[s] = e;
                });
              } catch (r) {}
            return (
              s.searchParams.forEach((e, s) => {
                t[s] = e;
              }),
              t
            );
          })(window.location.href)),
          this._isImplicitGrantCallback(t)
            ? (s = 'implicit')
            : (await this._isPKCECallback(t)) && (s = 'pkce')),
        js() && this.detectSessionInUrl && 'none' !== s)
      ) {
        const { data: r, error: n } = await this._getSessionFromURL(t, s);
        if (n) {
          if (
            (this._debug('#_initialize()', 'error detecting session from URL', n),
            (function (e) {
              return is(e) && 'AuthImplicitGrantRedirectError' === e.name;
            })(n))
          ) {
            const t = null === (e = n.details) || void 0 === e ? void 0 : e.code;
            if (
              'identity_already_exists' === t ||
              'identity_not_found' === t ||
              'single_identity_not_deletable' === t
            )
              return { error: n };
          }
          return { error: n };
        }
        const { session: i, redirectType: a } = r;
        return (
          this._debug('#_initialize()', 'detected session in URL', i, 'redirect type', a),
          await this._saveSession(i),
          setTimeout(async () => {
            'recovery' === a
              ? await this._notifyAllSubscribers('PASSWORD_RECOVERY', i)
              : await this._notifyAllSubscribers('SIGNED_IN', i);
          }, 0),
          { error: null }
        );
      }
      return (await this._recoverAndRefresh(), { error: null });
    } catch (t) {
      return is(t)
        ? this._returnResult({ error: t })
        : this._returnResult({ error: new os('Unexpected error during initialization', t) });
    } finally {
      (await this._handleVisibilityChange(), this._debug('#_initialize()', 'end'));
    }
  }
  async signInAnonymously(e) {
    var t, s, r;
    try {
      const n = await Qs(this.fetch, 'POST', `${this.url}/signup`, {
          headers: this.headers,
          body: {
            data:
              null !==
                (s =
                  null === (t = null == e ? void 0 : e.options) || void 0 === t
                    ? void 0
                    : t.data) && void 0 !== s
                ? s
                : {},
            gotrue_meta_security: {
              captcha_token:
                null === (r = null == e ? void 0 : e.options) || void 0 === r
                  ? void 0
                  : r.captchaToken,
            },
          },
          xform: Ys,
        }),
        { data: i, error: a } = n;
      if (a || !i) return this._returnResult({ data: { user: null, session: null }, error: a });
      const o = i.session,
        c = i.user;
      return (
        i.session &&
          (await this._saveSession(i.session), await this._notifyAllSubscribers('SIGNED_IN', o)),
        this._returnResult({ data: { user: c, session: o }, error: null })
      );
    } catch (n) {
      if (is(n)) return this._returnResult({ data: { user: null, session: null }, error: n });
      throw n;
    }
  }
  async signUp(e) {
    var t, s, r;
    try {
      let n;
      if ('email' in e) {
        const { email: s, password: r, options: i } = e;
        let a = null,
          o = null;
        ('pkce' === this.flowType && ([a, o] = await Ms(this.storage, this.storageKey)),
          (n = await Qs(this.fetch, 'POST', `${this.url}/signup`, {
            headers: this.headers,
            redirectTo: null == i ? void 0 : i.emailRedirectTo,
            body: {
              email: s,
              password: r,
              data: null !== (t = null == i ? void 0 : i.data) && void 0 !== t ? t : {},
              gotrue_meta_security: { captcha_token: null == i ? void 0 : i.captchaToken },
              code_challenge: a,
              code_challenge_method: o,
            },
            xform: Ys,
          })));
      } else {
        if (!('phone' in e))
          throw new ds('You must provide either an email or phone number and a password');
        {
          const { phone: t, password: i, options: a } = e;
          n = await Qs(this.fetch, 'POST', `${this.url}/signup`, {
            headers: this.headers,
            body: {
              phone: t,
              password: i,
              data: null !== (s = null == a ? void 0 : a.data) && void 0 !== s ? s : {},
              channel: null !== (r = null == a ? void 0 : a.channel) && void 0 !== r ? r : 'sms',
              gotrue_meta_security: { captcha_token: null == a ? void 0 : a.captchaToken },
            },
            xform: Ys,
          });
        }
      }
      const { data: i, error: a } = n;
      if (a || !i)
        return (
          await Us(this.storage, `${this.storageKey}-code-verifier`),
          this._returnResult({ data: { user: null, session: null }, error: a })
        );
      const o = i.session,
        c = i.user;
      return (
        i.session &&
          (await this._saveSession(i.session), await this._notifyAllSubscribers('SIGNED_IN', o)),
        this._returnResult({ data: { user: c, session: o }, error: null })
      );
    } catch (n) {
      if ((await Us(this.storage, `${this.storageKey}-code-verifier`), is(n)))
        return this._returnResult({ data: { user: null, session: null }, error: n });
      throw n;
    }
  }
  async signInWithPassword(e) {
    try {
      let t;
      if ('email' in e) {
        const { email: s, password: r, options: n } = e;
        t = await Qs(this.fetch, 'POST', `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            email: s,
            password: r,
            gotrue_meta_security: { captcha_token: null == n ? void 0 : n.captchaToken },
          },
          xform: Xs,
        });
      } else {
        if (!('phone' in e))
          throw new ds('You must provide either an email or phone number and a password');
        {
          const { phone: s, password: r, options: n } = e;
          t = await Qs(this.fetch, 'POST', `${this.url}/token?grant_type=password`, {
            headers: this.headers,
            body: {
              phone: s,
              password: r,
              gotrue_meta_security: { captcha_token: null == n ? void 0 : n.captchaToken },
            },
            xform: Xs,
          });
        }
      }
      const { data: s, error: r } = t;
      if (r) return this._returnResult({ data: { user: null, session: null }, error: r });
      if (!s || !s.session || !s.user) {
        const e = new us();
        return this._returnResult({ data: { user: null, session: null }, error: e });
      }
      return (
        s.session &&
          (await this._saveSession(s.session),
          await this._notifyAllSubscribers('SIGNED_IN', s.session)),
        this._returnResult({
          data: Object.assign(
            { user: s.user, session: s.session },
            s.weak_password ? { weakPassword: s.weak_password } : null
          ),
          error: r,
        })
      );
    } catch (t) {
      if (is(t)) return this._returnResult({ data: { user: null, session: null }, error: t });
      throw t;
    }
  }
  async signInWithOAuth(e) {
    var t, s, r, n;
    return await this._handleProviderSignIn(e.provider, {
      redirectTo: null === (t = e.options) || void 0 === t ? void 0 : t.redirectTo,
      scopes: null === (s = e.options) || void 0 === s ? void 0 : s.scopes,
      queryParams: null === (r = e.options) || void 0 === r ? void 0 : r.queryParams,
      skipBrowserRedirect:
        null === (n = e.options) || void 0 === n ? void 0 : n.skipBrowserRedirect,
    });
  }
  async exchangeCodeForSession(e) {
    return (
      await this.initializePromise,
      this._acquireLock(this.lockAcquireTimeout, async () => this._exchangeCodeForSession(e))
    );
  }
  async signInWithWeb3(e) {
    const { chain: t } = e;
    switch (t) {
      case 'ethereum':
        return await this.signInWithEthereum(e);
      case 'solana':
        return await this.signInWithSolana(e);
      default:
        throw new Error(`@supabase/auth-js: Unsupported chain "${t}"`);
    }
  }
  async signInWithEthereum(e) {
    var t, s, r, n, i, a, o, c, l, h, u;
    let d, p;
    if ('message' in e) ((d = e.message), (p = e.signature));
    else {
      const { chain: h, wallet: u, statement: f, options: g } = e;
      let y;
      if (js())
        if ('object' == typeof u) y = u;
        else {
          const e = window;
          if (
            !('ethereum' in e) ||
            'object' != typeof e.ethereum ||
            !('request' in e.ethereum) ||
            'function' != typeof e.ethereum.request
          )
            throw new Error(
              "@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead."
            );
          y = e.ethereum;
        }
      else {
        if ('object' != typeof u || !(null == g ? void 0 : g.url))
          throw new Error(
            '@supabase/auth-js: Both wallet and url must be specified in non-browser environments.'
          );
        y = u;
      }
      const m = new URL(
          null !== (t = null == g ? void 0 : g.url) && void 0 !== t ? t : window.location.href
        ),
        w = await y
          .request({ method: 'eth_requestAccounts' })
          .then(e => e)
          .catch(() => {
            throw new Error(
              '@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid'
            );
          });
      if (!w || 0 === w.length)
        throw new Error(
          '@supabase/auth-js: No accounts available. Please ensure the wallet is connected.'
        );
      const v = hr(w[0]);
      let b =
        null === (s = null == g ? void 0 : g.signInWithEthereum) || void 0 === s
          ? void 0
          : s.chainId;
      if (!b) {
        const e = await y.request({ method: 'eth_chainId' });
        b = parseInt(e, 16);
      }
      ((d = (function (e) {
        var t;
        const {
          chainId: s,
          domain: r,
          expirationTime: n,
          issuedAt: i = new Date(),
          nonce: a,
          notBefore: o,
          requestId: c,
          resources: l,
          scheme: h,
          uri: u,
          version: d,
        } = e;
        if (!Number.isInteger(s))
          throw new Error(
            `@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${s}`
          );
        if (!r)
          throw new Error(
            '@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.'
          );
        if (a && a.length < 8)
          throw new Error(
            `@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a}`
          );
        if (!u)
          throw new Error(
            '@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.'
          );
        if ('1' !== d)
          throw new Error(
            `@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d}`
          );
        if (null === (t = e.statement) || void 0 === t ? void 0 : t.includes('\n'))
          throw new Error(
            `@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e.statement}`
          );
        const p = `${h ? `${h}://${r}` : r} wants you to sign in with your Ethereum account:\n${hr(e.address)}\n\n${e.statement ? `${e.statement}\n` : ''}`;
        let f = `URI: ${u}\nVersion: ${d}\nChain ID: ${s}${a ? `\nNonce: ${a}` : ''}\nIssued At: ${i.toISOString()}`;
        if (
          (n && (f += `\nExpiration Time: ${n.toISOString()}`),
          o && (f += `\nNot Before: ${o.toISOString()}`),
          c && (f += `\nRequest ID: ${c}`),
          l)
        ) {
          let e = '\nResources:';
          for (const t of l) {
            if (!t || 'string' != typeof t)
              throw new Error(
                `@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t}`
              );
            e += `\n- ${t}`;
          }
          f += e;
        }
        return `${p}\n${f}`;
      })({
        domain: m.host,
        address: v,
        statement: f,
        uri: m.href,
        version: '1',
        chainId: b,
        nonce:
          null === (r = null == g ? void 0 : g.signInWithEthereum) || void 0 === r
            ? void 0
            : r.nonce,
        issuedAt:
          null !==
            (i =
              null === (n = null == g ? void 0 : g.signInWithEthereum) || void 0 === n
                ? void 0
                : n.issuedAt) && void 0 !== i
            ? i
            : new Date(),
        expirationTime:
          null === (a = null == g ? void 0 : g.signInWithEthereum) || void 0 === a
            ? void 0
            : a.expirationTime,
        notBefore:
          null === (o = null == g ? void 0 : g.signInWithEthereum) || void 0 === o
            ? void 0
            : o.notBefore,
        requestId:
          null === (c = null == g ? void 0 : g.signInWithEthereum) || void 0 === c
            ? void 0
            : c.requestId,
        resources:
          null === (l = null == g ? void 0 : g.signInWithEthereum) || void 0 === l
            ? void 0
            : l.resources,
      })),
        (p = await y.request({ method: 'personal_sign', params: [ur(d), v] })));
    }
    try {
      const { data: t, error: s } = await Qs(
        this.fetch,
        'POST',
        `${this.url}/token?grant_type=web3`,
        {
          headers: this.headers,
          body: Object.assign(
            { chain: 'ethereum', message: d, signature: p },
            (null === (h = e.options) || void 0 === h ? void 0 : h.captchaToken)
              ? {
                  gotrue_meta_security: {
                    captcha_token:
                      null === (u = e.options) || void 0 === u ? void 0 : u.captchaToken,
                  },
                }
              : null
          ),
          xform: Ys,
        }
      );
      if (s) throw s;
      if (!t || !t.session || !t.user) {
        const e = new us();
        return this._returnResult({ data: { user: null, session: null }, error: e });
      }
      return (
        t.session &&
          (await this._saveSession(t.session),
          await this._notifyAllSubscribers('SIGNED_IN', t.session)),
        this._returnResult({ data: Object.assign({}, t), error: s })
      );
    } catch (f) {
      if (is(f)) return this._returnResult({ data: { user: null, session: null }, error: f });
      throw f;
    }
  }
  async signInWithSolana(e) {
    var t, s, r, n, i, a, o, c, l, h, u, d;
    let p, f;
    if ('message' in e) ((p = e.message), (f = e.signature));
    else {
      const { chain: u, wallet: d, statement: g, options: y } = e;
      let m;
      if (js())
        if ('object' == typeof d) m = d;
        else {
          const e = window;
          if (
            !('solana' in e) ||
            'object' != typeof e.solana ||
            !(
              ('signIn' in e.solana && 'function' == typeof e.solana.signIn) ||
              ('signMessage' in e.solana && 'function' == typeof e.solana.signMessage)
            )
          )
            throw new Error(
              "@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead."
            );
          m = e.solana;
        }
      else {
        if ('object' != typeof d || !(null == y ? void 0 : y.url))
          throw new Error(
            '@supabase/auth-js: Both wallet and url must be specified in non-browser environments.'
          );
        m = d;
      }
      const w = new URL(
        null !== (t = null == y ? void 0 : y.url) && void 0 !== t ? t : window.location.href
      );
      if ('signIn' in m && m.signIn) {
        const e = await m.signIn(
          Object.assign(
            Object.assign(
              Object.assign(
                { issuedAt: new Date().toISOString() },
                null == y ? void 0 : y.signInWithSolana
              ),
              { version: '1', domain: w.host, uri: w.href }
            ),
            g ? { statement: g } : null
          )
        );
        let t;
        if (Array.isArray(e) && e[0] && 'object' == typeof e[0]) t = e[0];
        else {
          if (!(e && 'object' == typeof e && 'signedMessage' in e && 'signature' in e))
            throw new Error(
              '@supabase/auth-js: Wallet method signIn() returned unrecognized value'
            );
          t = e;
        }
        if (
          !(
            'signedMessage' in t &&
            'signature' in t &&
            ('string' == typeof t.signedMessage || t.signedMessage instanceof Uint8Array) &&
            t.signature instanceof Uint8Array
          )
        )
          throw new Error(
            '@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields'
          );
        ((p =
          'string' == typeof t.signedMessage
            ? t.signedMessage
            : new TextDecoder().decode(t.signedMessage)),
          (f = t.signature));
      } else {
        if (
          !(
            'signMessage' in m &&
            'function' == typeof m.signMessage &&
            'publicKey' in m &&
            'object' == typeof m &&
            m.publicKey &&
            'toBase58' in m.publicKey &&
            'function' == typeof m.publicKey.toBase58
          )
        )
          throw new Error(
            '@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API'
          );
        p = [
          `${w.host} wants you to sign in with your Solana account:`,
          m.publicKey.toBase58(),
          ...(g ? ['', g, ''] : ['']),
          'Version: 1',
          `URI: ${w.href}`,
          `Issued At: ${null !== (r = null === (s = null == y ? void 0 : y.signInWithSolana) || void 0 === s ? void 0 : s.issuedAt) && void 0 !== r ? r : new Date().toISOString()}`,
          ...((
            null === (n = null == y ? void 0 : y.signInWithSolana) || void 0 === n
              ? void 0
              : n.notBefore
          )
            ? [`Not Before: ${y.signInWithSolana.notBefore}`]
            : []),
          ...((
            null === (i = null == y ? void 0 : y.signInWithSolana) || void 0 === i
              ? void 0
              : i.expirationTime
          )
            ? [`Expiration Time: ${y.signInWithSolana.expirationTime}`]
            : []),
          ...((
            null === (a = null == y ? void 0 : y.signInWithSolana) || void 0 === a
              ? void 0
              : a.chainId
          )
            ? [`Chain ID: ${y.signInWithSolana.chainId}`]
            : []),
          ...((
            null === (o = null == y ? void 0 : y.signInWithSolana) || void 0 === o
              ? void 0
              : o.nonce
          )
            ? [`Nonce: ${y.signInWithSolana.nonce}`]
            : []),
          ...((
            null === (c = null == y ? void 0 : y.signInWithSolana) || void 0 === c
              ? void 0
              : c.requestId
          )
            ? [`Request ID: ${y.signInWithSolana.requestId}`]
            : []),
          ...((
            null ===
              (h =
                null === (l = null == y ? void 0 : y.signInWithSolana) || void 0 === l
                  ? void 0
                  : l.resources) || void 0 === h
              ? void 0
              : h.length
          )
            ? ['Resources', ...y.signInWithSolana.resources.map(e => `- ${e}`)]
            : []),
        ].join('\n');
        const e = await m.signMessage(new TextEncoder().encode(p), 'utf8');
        if (!(e && e instanceof Uint8Array))
          throw new Error(
            '@supabase/auth-js: Wallet signMessage() API returned an recognized value'
          );
        f = e;
      }
    }
    try {
      const { data: t, error: s } = await Qs(
        this.fetch,
        'POST',
        `${this.url}/token?grant_type=web3`,
        {
          headers: this.headers,
          body: Object.assign(
            { chain: 'solana', message: p, signature: Ps(f) },
            (null === (u = e.options) || void 0 === u ? void 0 : u.captchaToken)
              ? {
                  gotrue_meta_security: {
                    captcha_token:
                      null === (d = e.options) || void 0 === d ? void 0 : d.captchaToken,
                  },
                }
              : null
          ),
          xform: Ys,
        }
      );
      if (s) throw s;
      if (!t || !t.session || !t.user) {
        const e = new us();
        return this._returnResult({ data: { user: null, session: null }, error: e });
      }
      return (
        t.session &&
          (await this._saveSession(t.session),
          await this._notifyAllSubscribers('SIGNED_IN', t.session)),
        this._returnResult({ data: Object.assign({}, t), error: s })
      );
    } catch (g) {
      if (is(g)) return this._returnResult({ data: { user: null, session: null }, error: g });
      throw g;
    }
  }
  async _exchangeCodeForSession(e) {
    const t = await Ns(this.storage, `${this.storageKey}-code-verifier`),
      [s, r] = (null != t ? t : '').split('/');
    try {
      if (!s && 'pkce' === this.flowType) throw new gs();
      const { data: t, error: n } = await Qs(
        this.fetch,
        'POST',
        `${this.url}/token?grant_type=pkce`,
        { headers: this.headers, body: { auth_code: e, code_verifier: s }, xform: Ys }
      );
      if ((await Us(this.storage, `${this.storageKey}-code-verifier`), n)) throw n;
      if (!t || !t.session || !t.user) {
        const e = new us();
        return this._returnResult({
          data: { user: null, session: null, redirectType: null },
          error: e,
        });
      }
      return (
        t.session &&
          (await this._saveSession(t.session),
          await this._notifyAllSubscribers('SIGNED_IN', t.session)),
        this._returnResult({
          data: Object.assign(Object.assign({}, t), { redirectType: null != r ? r : null }),
          error: n,
        })
      );
    } catch (n) {
      if ((await Us(this.storage, `${this.storageKey}-code-verifier`), is(n)))
        return this._returnResult({
          data: { user: null, session: null, redirectType: null },
          error: n,
        });
      throw n;
    }
  }
  async signInWithIdToken(e) {
    try {
      const { options: t, provider: s, token: r, access_token: n, nonce: i } = e,
        a = await Qs(this.fetch, 'POST', `${this.url}/token?grant_type=id_token`, {
          headers: this.headers,
          body: {
            provider: s,
            id_token: r,
            access_token: n,
            nonce: i,
            gotrue_meta_security: { captcha_token: null == t ? void 0 : t.captchaToken },
          },
          xform: Ys,
        }),
        { data: o, error: c } = a;
      if (c) return this._returnResult({ data: { user: null, session: null }, error: c });
      if (!o || !o.session || !o.user) {
        const e = new us();
        return this._returnResult({ data: { user: null, session: null }, error: e });
      }
      return (
        o.session &&
          (await this._saveSession(o.session),
          await this._notifyAllSubscribers('SIGNED_IN', o.session)),
        this._returnResult({ data: o, error: c })
      );
    } catch (t) {
      if (is(t)) return this._returnResult({ data: { user: null, session: null }, error: t });
      throw t;
    }
  }
  async signInWithOtp(e) {
    var t, s, r, n, i;
    try {
      if ('email' in e) {
        const { email: r, options: n } = e;
        let i = null,
          a = null;
        'pkce' === this.flowType && ([i, a] = await Ms(this.storage, this.storageKey));
        const { error: o } = await Qs(this.fetch, 'POST', `${this.url}/otp`, {
          headers: this.headers,
          body: {
            email: r,
            data: null !== (t = null == n ? void 0 : n.data) && void 0 !== t ? t : {},
            create_user:
              null === (s = null == n ? void 0 : n.shouldCreateUser) || void 0 === s || s,
            gotrue_meta_security: { captcha_token: null == n ? void 0 : n.captchaToken },
            code_challenge: i,
            code_challenge_method: a,
          },
          redirectTo: null == n ? void 0 : n.emailRedirectTo,
        });
        return this._returnResult({ data: { user: null, session: null }, error: o });
      }
      if ('phone' in e) {
        const { phone: t, options: s } = e,
          { data: a, error: o } = await Qs(this.fetch, 'POST', `${this.url}/otp`, {
            headers: this.headers,
            body: {
              phone: t,
              data: null !== (r = null == s ? void 0 : s.data) && void 0 !== r ? r : {},
              create_user:
                null === (n = null == s ? void 0 : s.shouldCreateUser) || void 0 === n || n,
              gotrue_meta_security: { captcha_token: null == s ? void 0 : s.captchaToken },
              channel: null !== (i = null == s ? void 0 : s.channel) && void 0 !== i ? i : 'sms',
            },
          });
        return this._returnResult({
          data: { user: null, session: null, messageId: null == a ? void 0 : a.message_id },
          error: o,
        });
      }
      throw new ds('You must provide either an email or phone number.');
    } catch (a) {
      if ((await Us(this.storage, `${this.storageKey}-code-verifier`), is(a)))
        return this._returnResult({ data: { user: null, session: null }, error: a });
      throw a;
    }
  }
  async verifyOtp(e) {
    var t, s;
    try {
      let r, n;
      'options' in e &&
        ((r = null === (t = e.options) || void 0 === t ? void 0 : t.redirectTo),
        (n = null === (s = e.options) || void 0 === s ? void 0 : s.captchaToken));
      const { data: i, error: a } = await Qs(this.fetch, 'POST', `${this.url}/verify`, {
        headers: this.headers,
        body: Object.assign(Object.assign({}, e), { gotrue_meta_security: { captcha_token: n } }),
        redirectTo: r,
        xform: Ys,
      });
      if (a) throw a;
      if (!i) {
        throw new Error('An error occurred on token verification.');
      }
      const o = i.session,
        c = i.user;
      return (
        (null == o ? void 0 : o.access_token) &&
          (await this._saveSession(o),
          await this._notifyAllSubscribers(
            'recovery' == e.type ? 'PASSWORD_RECOVERY' : 'SIGNED_IN',
            o
          )),
        this._returnResult({ data: { user: c, session: o }, error: null })
      );
    } catch (r) {
      if (is(r)) return this._returnResult({ data: { user: null, session: null }, error: r });
      throw r;
    }
  }
  async signInWithSSO(e) {
    var t, s, r, n, i;
    try {
      let a = null,
        o = null;
      'pkce' === this.flowType && ([a, o] = await Ms(this.storage, this.storageKey));
      const c = await Qs(this.fetch, 'POST', `${this.url}/sso`, {
        body: Object.assign(
          Object.assign(
            Object.assign(
              Object.assign(
                Object.assign({}, 'providerId' in e ? { provider_id: e.providerId } : null),
                'domain' in e ? { domain: e.domain } : null
              ),
              {
                redirect_to:
                  null !== (s = null === (t = e.options) || void 0 === t ? void 0 : t.redirectTo) &&
                  void 0 !== s
                    ? s
                    : void 0,
              }
            ),
            (
              null === (r = null == e ? void 0 : e.options) || void 0 === r
                ? void 0
                : r.captchaToken
            )
              ? { gotrue_meta_security: { captcha_token: e.options.captchaToken } }
              : null
          ),
          { skip_http_redirect: !0, code_challenge: a, code_challenge_method: o }
        ),
        headers: this.headers,
        xform: er,
      });
      return (
        (null === (n = c.data) || void 0 === n ? void 0 : n.url) &&
          js() &&
          !(null === (i = e.options) || void 0 === i ? void 0 : i.skipBrowserRedirect) &&
          window.location.assign(c.data.url),
        this._returnResult(c)
      );
    } catch (a) {
      if ((await Us(this.storage, `${this.storageKey}-code-verifier`), is(a)))
        return this._returnResult({ data: null, error: a });
      throw a;
    }
  }
  async reauthenticate() {
    return (
      await this.initializePromise,
      await this._acquireLock(this.lockAcquireTimeout, async () => await this._reauthenticate())
    );
  }
  async _reauthenticate() {
    try {
      return await this._useSession(async e => {
        const {
          data: { session: t },
          error: s,
        } = e;
        if (s) throw s;
        if (!t) throw new ls();
        const { error: r } = await Qs(this.fetch, 'GET', `${this.url}/reauthenticate`, {
          headers: this.headers,
          jwt: t.access_token,
        });
        return this._returnResult({ data: { user: null, session: null }, error: r });
      });
    } catch (e) {
      if (is(e)) return this._returnResult({ data: { user: null, session: null }, error: e });
      throw e;
    }
  }
  async resend(e) {
    try {
      const t = `${this.url}/resend`;
      if ('email' in e) {
        const { email: s, type: r, options: n } = e,
          { error: i } = await Qs(this.fetch, 'POST', t, {
            headers: this.headers,
            body: {
              email: s,
              type: r,
              gotrue_meta_security: { captcha_token: null == n ? void 0 : n.captchaToken },
            },
            redirectTo: null == n ? void 0 : n.emailRedirectTo,
          });
        return this._returnResult({ data: { user: null, session: null }, error: i });
      }
      if ('phone' in e) {
        const { phone: s, type: r, options: n } = e,
          { data: i, error: a } = await Qs(this.fetch, 'POST', t, {
            headers: this.headers,
            body: {
              phone: s,
              type: r,
              gotrue_meta_security: { captcha_token: null == n ? void 0 : n.captchaToken },
            },
          });
        return this._returnResult({
          data: { user: null, session: null, messageId: null == i ? void 0 : i.message_id },
          error: a,
        });
      }
      throw new ds('You must provide either an email or phone number and a type');
    } catch (t) {
      if (is(t)) return this._returnResult({ data: { user: null, session: null }, error: t });
      throw t;
    }
  }
  async getSession() {
    await this.initializePromise;
    return await this._acquireLock(this.lockAcquireTimeout, async () =>
      this._useSession(async e => e)
    );
  }
  async _acquireLock(e, t) {
    this._debug('#_acquireLock', 'begin', e);
    try {
      if (this.lockAcquired) {
        const e = this.pendingInLock.length
            ? this.pendingInLock[this.pendingInLock.length - 1]
            : Promise.resolve(),
          s = (async () => (await e, await t()))();
        return (
          this.pendingInLock.push(
            (async () => {
              try {
                await s;
              } catch (e) {}
            })()
          ),
          s
        );
      }
      return await this.lock(`lock:${this.storageKey}`, e, async () => {
        this._debug('#_acquireLock', 'lock acquired for storage key', this.storageKey);
        try {
          this.lockAcquired = !0;
          const e = t();
          for (
            this.pendingInLock.push(
              (async () => {
                try {
                  await e;
                } catch (t) {}
              })()
            ),
              await e;
            this.pendingInLock.length;
          ) {
            const e = [...this.pendingInLock];
            (await Promise.all(e), this.pendingInLock.splice(0, e.length));
          }
          return await e;
        } finally {
          (this._debug('#_acquireLock', 'lock released for storage key', this.storageKey),
            (this.lockAcquired = !1));
        }
      });
    } finally {
      this._debug('#_acquireLock', 'end');
    }
  }
  async _useSession(e) {
    this._debug('#_useSession', 'begin');
    try {
      const t = await this.__loadSession();
      return await e(t);
    } finally {
      this._debug('#_useSession', 'end');
    }
  }
  async __loadSession() {
    (this._debug('#__loadSession()', 'begin'),
      this.lockAcquired ||
        this._debug('#__loadSession()', 'used outside of an acquired lock!', new Error().stack));
    try {
      let e = null;
      const t = await Ns(this.storage, this.storageKey);
      if (
        (this._debug('#getSession()', 'session from storage', t),
        null !== t &&
          (this._isValidSession(t)
            ? (e = t)
            : (this._debug('#getSession()', 'session from storage is not valid'),
              await this._removeSession())),
        !e)
      )
        return { data: { session: null }, error: null };
      const s = !!e.expires_at && 1e3 * e.expires_at - Date.now() < Zt;
      if (
        (this._debug(
          '#__loadSession()',
          `session has${s ? '' : ' not'} expired`,
          'expires_at',
          e.expires_at
        ),
        !s)
      ) {
        if (this.userStorage) {
          const t = await Ns(this.userStorage, this.storageKey + '-user');
          (null == t ? void 0 : t.user) ? (e.user = t.user) : (e.user = Hs());
        }
        if (this.storage.isServer && e.user && !e.user.__isUserNotAvailableProxy) {
          const t = { value: this.suppressGetSessionWarning };
          ((e.user = (function (e, t) {
            return new Proxy(e, {
              get: (e, s, r) => {
                if ('__isInsecureUserWarningProxy' === s) return !0;
                if ('symbol' == typeof s) {
                  const t = s.toString();
                  if (
                    'Symbol(Symbol.toPrimitive)' === t ||
                    'Symbol(Symbol.toStringTag)' === t ||
                    'Symbol(util.inspect.custom)' === t ||
                    'Symbol(nodejs.util.inspect.custom)' === t
                  )
                    return Reflect.get(e, s, r);
                }
                return (t.value || 'string' != typeof s || (t.value = !0), Reflect.get(e, s, r));
              },
            });
          })(e.user, t)),
            t.value && (this.suppressGetSessionWarning = !0));
        }
        return { data: { session: e }, error: null };
      }
      const { data: r, error: n } = await this._callRefreshToken(e.refresh_token);
      return n
        ? this._returnResult({ data: { session: null }, error: n })
        : this._returnResult({ data: { session: r }, error: null });
    } finally {
      this._debug('#__loadSession()', 'end');
    }
  }
  async getUser(e) {
    if (e) return await this._getUser(e);
    await this.initializePromise;
    const t = await this._acquireLock(this.lockAcquireTimeout, async () => await this._getUser());
    return (t.data.user && (this.suppressGetSessionWarning = !0), t);
  }
  async _getUser(e) {
    try {
      return e
        ? await Qs(this.fetch, 'GET', `${this.url}/user`, {
            headers: this.headers,
            jwt: e,
            xform: Zs,
          })
        : await this._useSession(async e => {
            var t, s, r;
            const { data: n, error: i } = e;
            if (i) throw i;
            return (null === (t = n.session) || void 0 === t ? void 0 : t.access_token) ||
              this.hasCustomAuthorizationHeader
              ? await Qs(this.fetch, 'GET', `${this.url}/user`, {
                  headers: this.headers,
                  jwt:
                    null !==
                      (r = null === (s = n.session) || void 0 === s ? void 0 : s.access_token) &&
                    void 0 !== r
                      ? r
                      : void 0,
                  xform: Zs,
                })
              : { data: { user: null }, error: new ls() };
          });
    } catch (t) {
      if (is(t))
        return (
          hs(t) &&
            (await this._removeSession(),
            await Us(this.storage, `${this.storageKey}-code-verifier`)),
          this._returnResult({ data: { user: null }, error: t })
        );
      throw t;
    }
  }
  async updateUser(e, t = {}) {
    return (
      await this.initializePromise,
      await this._acquireLock(this.lockAcquireTimeout, async () => await this._updateUser(e, t))
    );
  }
  async _updateUser(e, t = {}) {
    try {
      return await this._useSession(async s => {
        const { data: r, error: n } = s;
        if (n) throw n;
        if (!r.session) throw new ls();
        const i = r.session;
        let a = null,
          o = null;
        'pkce' === this.flowType &&
          null != e.email &&
          ([a, o] = await Ms(this.storage, this.storageKey));
        const { data: c, error: l } = await Qs(this.fetch, 'PUT', `${this.url}/user`, {
          headers: this.headers,
          redirectTo: null == t ? void 0 : t.emailRedirectTo,
          body: Object.assign(Object.assign({}, e), {
            code_challenge: a,
            code_challenge_method: o,
          }),
          jwt: i.access_token,
          xform: Zs,
        });
        if (l) throw l;
        return (
          (i.user = c.user),
          await this._saveSession(i),
          await this._notifyAllSubscribers('USER_UPDATED', i),
          this._returnResult({ data: { user: i.user }, error: null })
        );
      });
    } catch (s) {
      if ((await Us(this.storage, `${this.storageKey}-code-verifier`), is(s)))
        return this._returnResult({ data: { user: null }, error: s });
      throw s;
    }
  }
  async setSession(e) {
    return (
      await this.initializePromise,
      await this._acquireLock(this.lockAcquireTimeout, async () => await this._setSession(e))
    );
  }
  async _setSession(e) {
    try {
      if (!e.access_token || !e.refresh_token) throw new ls();
      const t = Date.now() / 1e3;
      let s = t,
        r = !0,
        n = null;
      const { payload: i } = qs(e.access_token);
      if ((i.exp && ((s = i.exp), (r = s <= t)), r)) {
        const { data: t, error: s } = await this._callRefreshToken(e.refresh_token);
        if (s) return this._returnResult({ data: { user: null, session: null }, error: s });
        if (!t) return { data: { user: null, session: null }, error: null };
        n = t;
      } else {
        const { data: r, error: i } = await this._getUser(e.access_token);
        if (i) return this._returnResult({ data: { user: null, session: null }, error: i });
        ((n = {
          access_token: e.access_token,
          refresh_token: e.refresh_token,
          user: r.user,
          token_type: 'bearer',
          expires_in: s - t,
          expires_at: s,
        }),
          await this._saveSession(n),
          await this._notifyAllSubscribers('SIGNED_IN', n));
      }
      return this._returnResult({ data: { user: n.user, session: n }, error: null });
    } catch (t) {
      if (is(t)) return this._returnResult({ data: { session: null, user: null }, error: t });
      throw t;
    }
  }
  async refreshSession(e) {
    return (
      await this.initializePromise,
      await this._acquireLock(this.lockAcquireTimeout, async () => await this._refreshSession(e))
    );
  }
  async _refreshSession(e) {
    try {
      return await this._useSession(async t => {
        var s;
        if (!e) {
          const { data: r, error: n } = t;
          if (n) throw n;
          e = null !== (s = r.session) && void 0 !== s ? s : void 0;
        }
        if (!(null == e ? void 0 : e.refresh_token)) throw new ls();
        const { data: r, error: n } = await this._callRefreshToken(e.refresh_token);
        return n
          ? this._returnResult({ data: { user: null, session: null }, error: n })
          : r
            ? this._returnResult({ data: { user: r.user, session: r }, error: null })
            : this._returnResult({ data: { user: null, session: null }, error: null });
      });
    } catch (t) {
      if (is(t)) return this._returnResult({ data: { user: null, session: null }, error: t });
      throw t;
    }
  }
  async _getSessionFromURL(e, t) {
    try {
      if (!js()) throw new ps('No browser detected.');
      if (e.error || e.error_description || e.error_code)
        throw new ps(e.error_description || 'Error in URL with unspecified error_description', {
          error: e.error || 'unspecified_error',
          code: e.error_code || 'unspecified_code',
        });
      switch (t) {
        case 'implicit':
          if ('pkce' === this.flowType) throw new fs('Not a valid PKCE flow url.');
          break;
        case 'pkce':
          if ('implicit' === this.flowType) throw new ps('Not a valid implicit grant flow url.');
      }
      if ('pkce' === t) {
        if ((this._debug('#_initialize()', 'begin', 'is PKCE flow', !0), !e.code))
          throw new fs('No code detected.');
        const { data: t, error: s } = await this._exchangeCodeForSession(e.code);
        if (s) throw s;
        const r = new URL(window.location.href);
        return (
          r.searchParams.delete('code'),
          window.history.replaceState(window.history.state, '', r.toString()),
          { data: { session: t.session, redirectType: null }, error: null }
        );
      }
      const {
        provider_token: s,
        provider_refresh_token: r,
        access_token: n,
        refresh_token: i,
        expires_in: a,
        expires_at: o,
        token_type: c,
      } = e;
      if (!(n && a && i && c)) throw new ps('No session defined in URL');
      const l = Math.round(Date.now() / 1e3),
        h = parseInt(a);
      let u = l + h;
      o && (u = parseInt(o));
      const { data: d, error: p } = await this._getUser(n);
      if (p) throw p;
      const f = {
        provider_token: s,
        provider_refresh_token: r,
        access_token: n,
        expires_in: h,
        expires_at: u,
        refresh_token: i,
        token_type: c,
        user: d.user,
      };
      return (
        (window.location.hash = ''),
        this._debug('#_getSessionFromURL()', 'clearing window.location.hash'),
        this._returnResult({ data: { session: f, redirectType: e.type }, error: null })
      );
    } catch (s) {
      if (is(s))
        return this._returnResult({ data: { session: null, redirectType: null }, error: s });
      throw s;
    }
  }
  _isImplicitGrantCallback(e) {
    return 'function' == typeof this.detectSessionInUrl
      ? this.detectSessionInUrl(new URL(window.location.href), e)
      : Boolean(e.access_token || e.error_description);
  }
  async _isPKCECallback(e) {
    const t = await Ns(this.storage, `${this.storageKey}-code-verifier`);
    return !(!e.code || !t);
  }
  async signOut(e = { scope: 'global' }) {
    return (
      await this.initializePromise,
      await this._acquireLock(this.lockAcquireTimeout, async () => await this._signOut(e))
    );
  }
  async _signOut({ scope: e } = { scope: 'global' }) {
    return await this._useSession(async t => {
      var s;
      const { data: r, error: n } = t;
      if (n && !hs(n)) return this._returnResult({ error: n });
      const i = null === (s = r.session) || void 0 === s ? void 0 : s.access_token;
      if (i) {
        const { error: t } = await this.admin.signOut(i, e);
        if (
          t &&
          (!(function (e) {
            return is(e) && 'AuthApiError' === e.name;
          })(t) ||
            (404 !== t.status && 401 !== t.status && 403 !== t.status)) &&
          !hs(t)
        )
          return this._returnResult({ error: t });
      }
      return (
        'others' !== e &&
          (await this._removeSession(), await Us(this.storage, `${this.storageKey}-code-verifier`)),
        this._returnResult({ error: null })
      );
    });
  }
  onAuthStateChange(e) {
    const t = Symbol('auth-callback'),
      s = {
        id: t,
        callback: e,
        unsubscribe: () => {
          (this._debug('#unsubscribe()', 'state change callback with id removed', t),
            this.stateChangeEmitters.delete(t));
        },
      };
    return (
      this._debug('#onAuthStateChange()', 'registered callback with id', t),
      this.stateChangeEmitters.set(t, s),
      (async () => {
        (await this.initializePromise,
          await this._acquireLock(this.lockAcquireTimeout, async () => {
            this._emitInitialSession(t);
          }));
      })(),
      { data: { subscription: s } }
    );
  }
  async _emitInitialSession(e) {
    return await this._useSession(async t => {
      var s, r;
      try {
        const {
          data: { session: r },
          error: n,
        } = t;
        if (n) throw n;
        (await (null === (s = this.stateChangeEmitters.get(e)) || void 0 === s
          ? void 0
          : s.callback('INITIAL_SESSION', r)),
          this._debug('INITIAL_SESSION', 'callback id', e, 'session', r));
      } catch (n) {
        (await (null === (r = this.stateChangeEmitters.get(e)) || void 0 === r
          ? void 0
          : r.callback('INITIAL_SESSION', null)),
          this._debug('INITIAL_SESSION', 'callback id', e, 'error', n));
      }
    });
  }
  async resetPasswordForEmail(e, t = {}) {
    let s = null,
      r = null;
    'pkce' === this.flowType && ([s, r] = await Ms(this.storage, this.storageKey, !0));
    try {
      return await Qs(this.fetch, 'POST', `${this.url}/recover`, {
        body: {
          email: e,
          code_challenge: s,
          code_challenge_method: r,
          gotrue_meta_security: { captcha_token: t.captchaToken },
        },
        headers: this.headers,
        redirectTo: t.redirectTo,
      });
    } catch (n) {
      if ((await Us(this.storage, `${this.storageKey}-code-verifier`), is(n)))
        return this._returnResult({ data: null, error: n });
      throw n;
    }
  }
  async getUserIdentities() {
    var e;
    try {
      const { data: t, error: s } = await this.getUser();
      if (s) throw s;
      return this._returnResult({
        data: { identities: null !== (e = t.user.identities) && void 0 !== e ? e : [] },
        error: null,
      });
    } catch (t) {
      if (is(t)) return this._returnResult({ data: null, error: t });
      throw t;
    }
  }
  async linkIdentity(e) {
    return 'token' in e ? this.linkIdentityIdToken(e) : this.linkIdentityOAuth(e);
  }
  async linkIdentityOAuth(e) {
    var t;
    try {
      const { data: s, error: r } = await this._useSession(async t => {
        var s, r, n, i, a;
        const { data: o, error: c } = t;
        if (c) throw c;
        const l = await this._getUrlForProvider(
          `${this.url}/user/identities/authorize`,
          e.provider,
          {
            redirectTo: null === (s = e.options) || void 0 === s ? void 0 : s.redirectTo,
            scopes: null === (r = e.options) || void 0 === r ? void 0 : r.scopes,
            queryParams: null === (n = e.options) || void 0 === n ? void 0 : n.queryParams,
            skipBrowserRedirect: !0,
          }
        );
        return await Qs(this.fetch, 'GET', l, {
          headers: this.headers,
          jwt:
            null !== (a = null === (i = o.session) || void 0 === i ? void 0 : i.access_token) &&
            void 0 !== a
              ? a
              : void 0,
        });
      });
      if (r) throw r;
      return (
        js() &&
          !(null === (t = e.options) || void 0 === t ? void 0 : t.skipBrowserRedirect) &&
          window.location.assign(null == s ? void 0 : s.url),
        this._returnResult({
          data: { provider: e.provider, url: null == s ? void 0 : s.url },
          error: null,
        })
      );
    } catch (s) {
      if (is(s)) return this._returnResult({ data: { provider: e.provider, url: null }, error: s });
      throw s;
    }
  }
  async linkIdentityIdToken(e) {
    return await this._useSession(async t => {
      var s;
      try {
        const {
          error: r,
          data: { session: n },
        } = t;
        if (r) throw r;
        const { options: i, provider: a, token: o, access_token: c, nonce: l } = e,
          h = await Qs(this.fetch, 'POST', `${this.url}/token?grant_type=id_token`, {
            headers: this.headers,
            jwt: null !== (s = null == n ? void 0 : n.access_token) && void 0 !== s ? s : void 0,
            body: {
              provider: a,
              id_token: o,
              access_token: c,
              nonce: l,
              link_identity: !0,
              gotrue_meta_security: { captcha_token: null == i ? void 0 : i.captchaToken },
            },
            xform: Ys,
          }),
          { data: u, error: d } = h;
        return d
          ? this._returnResult({ data: { user: null, session: null }, error: d })
          : u && u.session && u.user
            ? (u.session &&
                (await this._saveSession(u.session),
                await this._notifyAllSubscribers('USER_UPDATED', u.session)),
              this._returnResult({ data: u, error: d }))
            : this._returnResult({ data: { user: null, session: null }, error: new us() });
      } catch (r) {
        if ((await Us(this.storage, `${this.storageKey}-code-verifier`), is(r)))
          return this._returnResult({ data: { user: null, session: null }, error: r });
        throw r;
      }
    });
  }
  async unlinkIdentity(e) {
    try {
      return await this._useSession(async t => {
        var s, r;
        const { data: n, error: i } = t;
        if (i) throw i;
        return await Qs(this.fetch, 'DELETE', `${this.url}/user/identities/${e.identity_id}`, {
          headers: this.headers,
          jwt:
            null !== (r = null === (s = n.session) || void 0 === s ? void 0 : s.access_token) &&
            void 0 !== r
              ? r
              : void 0,
        });
      });
    } catch (t) {
      if (is(t)) return this._returnResult({ data: null, error: t });
      throw t;
    }
  }
  async _refreshAccessToken(e) {
    const t = `#_refreshAccessToken(${e.substring(0, 5)}...)`;
    this._debug(t, 'begin');
    try {
      const n = Date.now();
      return await ((s = async s => (
        s > 0 &&
          (await (async function (e) {
            return await new Promise(t => {
              setTimeout(() => t(null), e);
            });
          })(200 * Math.pow(2, s - 1))),
        this._debug(t, 'refreshing attempt', s),
        await Qs(this.fetch, 'POST', `${this.url}/token?grant_type=refresh_token`, {
          body: { refresh_token: e },
          headers: this.headers,
          xform: Ys,
        })
      )),
      (r = (e, t) => {
        const s = 200 * Math.pow(2, e);
        return t && ms(t) && Date.now() + s - n < Xt;
      }),
      new Promise((e, t) => {
        (async () => {
          for (let i = 0; i < 1 / 0; i++)
            try {
              const t = await s(i);
              if (!r(i, null, t)) return void e(t);
            } catch (n) {
              if (!r(i, n)) return void t(n);
            }
        })();
      }));
    } catch (n) {
      if ((this._debug(t, 'error', n), is(n)))
        return this._returnResult({ data: { session: null, user: null }, error: n });
      throw n;
    } finally {
      this._debug(t, 'end');
    }
    var s, r;
  }
  _isValidSession(e) {
    return (
      'object' == typeof e &&
      null !== e &&
      'access_token' in e &&
      'refresh_token' in e &&
      'expires_at' in e
    );
  }
  async _handleProviderSignIn(e, t) {
    const s = await this._getUrlForProvider(`${this.url}/authorize`, e, {
      redirectTo: t.redirectTo,
      scopes: t.scopes,
      queryParams: t.queryParams,
    });
    return (
      this._debug('#_handleProviderSignIn()', 'provider', e, 'options', t, 'url', s),
      js() && !t.skipBrowserRedirect && window.location.assign(s),
      { data: { provider: e, url: s }, error: null }
    );
  }
  async _recoverAndRefresh() {
    var e, t;
    const s = '#_recoverAndRefresh()';
    this._debug(s, 'begin');
    try {
      const n = await Ns(this.storage, this.storageKey);
      if (n && this.userStorage) {
        let t = await Ns(this.userStorage, this.storageKey + '-user');
        (this.storage.isServer ||
          !Object.is(this.storage, this.userStorage) ||
          t ||
          ((t = { user: n.user }), await xs(this.userStorage, this.storageKey + '-user', t)),
          (n.user = null !== (e = null == t ? void 0 : t.user) && void 0 !== e ? e : Hs()));
      } else if (n && !n.user && !n.user) {
        const e = await Ns(this.storage, this.storageKey + '-user');
        e && (null == e ? void 0 : e.user)
          ? ((n.user = e.user),
            await Us(this.storage, this.storageKey + '-user'),
            await xs(this.storage, this.storageKey, n))
          : (n.user = Hs());
      }
      if ((this._debug(s, 'session from storage', n), !this._isValidSession(n)))
        return (
          this._debug(s, 'session is not valid'),
          void (null !== n && (await this._removeSession()))
        );
      const i = 1e3 * (null !== (t = n.expires_at) && void 0 !== t ? t : 1 / 0) - Date.now() < Zt;
      if ((this._debug(s, `session has${i ? '' : ' not'} expired with margin of 90000s`), i)) {
        if (this.autoRefreshToken && n.refresh_token) {
          const { error: e } = await this._callRefreshToken(n.refresh_token);
          e &&
            (ms(e) ||
              (this._debug(s, 'refresh failed with a non-retryable error, removing the session', e),
              await this._removeSession()));
        }
      } else if (n.user && !0 === n.user.__isUserNotAvailableProxy)
        try {
          const { data: e, error: t } = await this._getUser(n.access_token);
          !t && (null == e ? void 0 : e.user)
            ? ((n.user = e.user),
              await this._saveSession(n),
              await this._notifyAllSubscribers('SIGNED_IN', n))
            : this._debug(s, 'could not get user data, skipping SIGNED_IN notification');
        } catch (r) {
          this._debug(s, 'error getting user data, skipping SIGNED_IN notification', r);
        }
      else await this._notifyAllSubscribers('SIGNED_IN', n);
    } catch (n) {
      return void this._debug(s, 'error', n);
    } finally {
      this._debug(s, 'end');
    }
  }
  async _callRefreshToken(e) {
    var t, s;
    if (!e) throw new ls();
    if (this.refreshingDeferred) return this.refreshingDeferred.promise;
    const r = `#_callRefreshToken(${e.substring(0, 5)}...)`;
    this._debug(r, 'begin');
    try {
      this.refreshingDeferred = new Ds();
      const { data: t, error: s } = await this._refreshAccessToken(e);
      if (s) throw s;
      if (!t.session) throw new ls();
      (await this._saveSession(t.session),
        await this._notifyAllSubscribers('TOKEN_REFRESHED', t.session));
      const r = { data: t.session, error: null };
      return (this.refreshingDeferred.resolve(r), r);
    } catch (n) {
      if ((this._debug(r, 'error', n), is(n))) {
        const e = { data: null, error: n };
        return (
          ms(n) || (await this._removeSession()),
          null === (t = this.refreshingDeferred) || void 0 === t || t.resolve(e),
          e
        );
      }
      throw (null === (s = this.refreshingDeferred) || void 0 === s || s.reject(n), n);
    } finally {
      ((this.refreshingDeferred = null), this._debug(r, 'end'));
    }
  }
  async _notifyAllSubscribers(e, t, s = !0) {
    const r = `#_notifyAllSubscribers(${e})`;
    this._debug(r, 'begin', t, `broadcast = ${s}`);
    try {
      this.broadcastChannel && s && this.broadcastChannel.postMessage({ event: e, session: t });
      const r = [],
        n = Array.from(this.stateChangeEmitters.values()).map(async s => {
          try {
            await s.callback(e, t);
          } catch (n) {
            r.push(n);
          }
        });
      if ((await Promise.all(n), r.length > 0)) {
        for (let e = 0; e < r.length; e += 1);
        throw r[0];
      }
    } finally {
      this._debug(r, 'end');
    }
  }
  async _saveSession(e) {
    (this._debug('#_saveSession()', e),
      (this.suppressGetSessionWarning = !0),
      await Us(this.storage, `${this.storageKey}-code-verifier`));
    const t = Object.assign({}, e),
      s = t.user && !0 === t.user.__isUserNotAvailableProxy;
    if (this.userStorage) {
      !s && t.user && (await xs(this.userStorage, this.storageKey + '-user', { user: t.user }));
      const e = Object.assign({}, t);
      delete e.user;
      const r = Gs(e);
      await xs(this.storage, this.storageKey, r);
    } else {
      const e = Gs(t);
      await xs(this.storage, this.storageKey, e);
    }
  }
  async _removeSession() {
    (this._debug('#_removeSession()'),
      (this.suppressGetSessionWarning = !1),
      await Us(this.storage, this.storageKey),
      await Us(this.storage, this.storageKey + '-code-verifier'),
      await Us(this.storage, this.storageKey + '-user'),
      this.userStorage && (await Us(this.userStorage, this.storageKey + '-user')),
      await this._notifyAllSubscribers('SIGNED_OUT', null));
  }
  _removeVisibilityChangedCallback() {
    this._debug('#_removeVisibilityChangedCallback()');
    const e = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      e &&
        js() &&
        (null === window || void 0 === window ? void 0 : window.removeEventListener) &&
        window.removeEventListener('visibilitychange', e);
    } catch (t) {}
  }
  async _startAutoRefresh() {
    (await this._stopAutoRefresh(), this._debug('#_startAutoRefresh()'));
    const e = setInterval(() => this._autoRefreshTokenTick(), Xt);
    ((this.autoRefreshTicker = e),
      e && 'object' == typeof e && 'function' == typeof e.unref
        ? e.unref()
        : 'undefined' != typeof Deno && 'function' == typeof Deno.unrefTimer && Deno.unrefTimer(e));
    const t = setTimeout(async () => {
      (await this.initializePromise, await this._autoRefreshTokenTick());
    }, 0);
    ((this.autoRefreshTickTimeout = t),
      t && 'object' == typeof t && 'function' == typeof t.unref
        ? t.unref()
        : 'undefined' != typeof Deno && 'function' == typeof Deno.unrefTimer && Deno.unrefTimer(t));
  }
  async _stopAutoRefresh() {
    this._debug('#_stopAutoRefresh()');
    const e = this.autoRefreshTicker;
    ((this.autoRefreshTicker = null), e && clearInterval(e));
    const t = this.autoRefreshTickTimeout;
    ((this.autoRefreshTickTimeout = null), t && clearTimeout(t));
  }
  async startAutoRefresh() {
    (this._removeVisibilityChangedCallback(), await this._startAutoRefresh());
  }
  async stopAutoRefresh() {
    (this._removeVisibilityChangedCallback(), await this._stopAutoRefresh());
  }
  async _autoRefreshTokenTick() {
    this._debug('#_autoRefreshTokenTick()', 'begin');
    try {
      await this._acquireLock(0, async () => {
        try {
          const t = Date.now();
          try {
            return await this._useSession(async e => {
              const {
                data: { session: s },
              } = e;
              if (!s || !s.refresh_token || !s.expires_at)
                return void this._debug('#_autoRefreshTokenTick()', 'no session');
              const r = Math.floor((1e3 * s.expires_at - t) / Xt);
              (this._debug(
                '#_autoRefreshTokenTick()',
                `access token expires in ${r} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`
              ),
                r <= 3 && (await this._callRefreshToken(s.refresh_token)));
            });
          } catch (e) {}
        } finally {
          this._debug('#_autoRefreshTokenTick()', 'end');
        }
      });
    } catch (e) {
      if (!(e.isAcquireTimeout || e instanceof or)) throw e;
      this._debug('auto refresh token tick lock not available');
    }
  }
  async _handleVisibilityChange() {
    if (
      (this._debug('#_handleVisibilityChange()'),
      !js() || !(null === window || void 0 === window ? void 0 : window.addEventListener))
    )
      return (this.autoRefreshToken && this.startAutoRefresh(), !1);
    try {
      ((this.visibilityChangedCallback = async () => {
        try {
          await this._onVisibilityChanged(!1);
        } catch (e) {
          this._debug('#visibilityChangedCallback', 'error', e);
        }
      }),
        null === window ||
          void 0 === window ||
          window.addEventListener('visibilitychange', this.visibilityChangedCallback),
        await this._onVisibilityChanged(!0));
    } catch (e) {}
  }
  async _onVisibilityChanged(e) {
    const t = `#_onVisibilityChanged(${e})`;
    (this._debug(t, 'visibilityState', document.visibilityState),
      'visible' === document.visibilityState
        ? (this.autoRefreshToken && this._startAutoRefresh(),
          e ||
            (await this.initializePromise,
            await this._acquireLock(this.lockAcquireTimeout, async () => {
              'visible' === document.visibilityState
                ? await this._recoverAndRefresh()
                : this._debug(
                    t,
                    'acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting'
                  );
            })))
        : 'hidden' === document.visibilityState &&
          this.autoRefreshToken &&
          this._stopAutoRefresh());
  }
  async _getUrlForProvider(e, t, s) {
    const r = [`provider=${encodeURIComponent(t)}`];
    if (
      ((null == s ? void 0 : s.redirectTo) &&
        r.push(`redirect_to=${encodeURIComponent(s.redirectTo)}`),
      (null == s ? void 0 : s.scopes) && r.push(`scopes=${encodeURIComponent(s.scopes)}`),
      'pkce' === this.flowType)
    ) {
      const [e, t] = await Ms(this.storage, this.storageKey),
        s = new URLSearchParams({
          code_challenge: `${encodeURIComponent(e)}`,
          code_challenge_method: `${encodeURIComponent(t)}`,
        });
      r.push(s.toString());
    }
    if (null == s ? void 0 : s.queryParams) {
      const e = new URLSearchParams(s.queryParams);
      r.push(e.toString());
    }
    return (
      (null == s ? void 0 : s.skipBrowserRedirect) &&
        r.push(`skip_http_redirect=${s.skipBrowserRedirect}`),
      `${e}?${r.join('&')}`
    );
  }
  async _unenroll(e) {
    try {
      return await this._useSession(async t => {
        var s;
        const { data: r, error: n } = t;
        return n
          ? this._returnResult({ data: null, error: n })
          : await Qs(this.fetch, 'DELETE', `${this.url}/factors/${e.factorId}`, {
              headers: this.headers,
              jwt:
                null === (s = null == r ? void 0 : r.session) || void 0 === s
                  ? void 0
                  : s.access_token,
            });
      });
    } catch (t) {
      if (is(t)) return this._returnResult({ data: null, error: t });
      throw t;
    }
  }
  async _enroll(e) {
    try {
      return await this._useSession(async t => {
        var s, r;
        const { data: n, error: i } = t;
        if (i) return this._returnResult({ data: null, error: i });
        const a = Object.assign(
            { friendly_name: e.friendlyName, factor_type: e.factorType },
            'phone' === e.factorType
              ? { phone: e.phone }
              : 'totp' === e.factorType
                ? { issuer: e.issuer }
                : {}
          ),
          { data: o, error: c } = await Qs(this.fetch, 'POST', `${this.url}/factors`, {
            body: a,
            headers: this.headers,
            jwt:
              null === (s = null == n ? void 0 : n.session) || void 0 === s
                ? void 0
                : s.access_token,
          });
        return c
          ? this._returnResult({ data: null, error: c })
          : ('totp' === e.factorType &&
              'totp' === o.type &&
              (null === (r = null == o ? void 0 : o.totp) || void 0 === r ? void 0 : r.qr_code) &&
              (o.totp.qr_code = `data:image/svg+xml;utf-8,${o.totp.qr_code}`),
            this._returnResult({ data: o, error: null }));
      });
    } catch (t) {
      if (is(t)) return this._returnResult({ data: null, error: t });
      throw t;
    }
  }
  async _verify(e) {
    return this._acquireLock(this.lockAcquireTimeout, async () => {
      try {
        return await this._useSession(async t => {
          var s;
          const { data: r, error: n } = t;
          if (n) return this._returnResult({ data: null, error: n });
          const i = Object.assign(
              { challenge_id: e.challengeId },
              'webauthn' in e
                ? {
                    webauthn: Object.assign(Object.assign({}, e.webauthn), {
                      credential_response:
                        'create' === e.webauthn.type
                          ? vr(e.webauthn.credential_response)
                          : br(e.webauthn.credential_response),
                    }),
                  }
                : { code: e.code }
            ),
            { data: a, error: o } = await Qs(
              this.fetch,
              'POST',
              `${this.url}/factors/${e.factorId}/verify`,
              {
                body: i,
                headers: this.headers,
                jwt:
                  null === (s = null == r ? void 0 : r.session) || void 0 === s
                    ? void 0
                    : s.access_token,
              }
            );
          return o
            ? this._returnResult({ data: null, error: o })
            : (await this._saveSession(
                Object.assign({ expires_at: Math.round(Date.now() / 1e3) + a.expires_in }, a)
              ),
              await this._notifyAllSubscribers('MFA_CHALLENGE_VERIFIED', a),
              this._returnResult({ data: a, error: o }));
        });
      } catch (t) {
        if (is(t)) return this._returnResult({ data: null, error: t });
        throw t;
      }
    });
  }
  async _challenge(e) {
    return this._acquireLock(this.lockAcquireTimeout, async () => {
      try {
        return await this._useSession(async t => {
          var s;
          const { data: r, error: n } = t;
          if (n) return this._returnResult({ data: null, error: n });
          const i = await Qs(this.fetch, 'POST', `${this.url}/factors/${e.factorId}/challenge`, {
            body: e,
            headers: this.headers,
            jwt:
              null === (s = null == r ? void 0 : r.session) || void 0 === s
                ? void 0
                : s.access_token,
          });
          if (i.error) return i;
          const { data: a } = i;
          if ('webauthn' !== a.type) return { data: a, error: null };
          switch (a.webauthn.type) {
            case 'create':
              return {
                data: Object.assign(Object.assign({}, a), {
                  webauthn: Object.assign(Object.assign({}, a.webauthn), {
                    credential_options: Object.assign(
                      Object.assign({}, a.webauthn.credential_options),
                      { publicKey: mr(a.webauthn.credential_options.publicKey) }
                    ),
                  }),
                }),
                error: null,
              };
            case 'request':
              return {
                data: Object.assign(Object.assign({}, a), {
                  webauthn: Object.assign(Object.assign({}, a.webauthn), {
                    credential_options: Object.assign(
                      Object.assign({}, a.webauthn.credential_options),
                      { publicKey: wr(a.webauthn.credential_options.publicKey) }
                    ),
                  }),
                }),
                error: null,
              };
          }
        });
      } catch (t) {
        if (is(t)) return this._returnResult({ data: null, error: t });
        throw t;
      }
    });
  }
  async _challengeAndVerify(e) {
    const { data: t, error: s } = await this._challenge({ factorId: e.factorId });
    return s
      ? this._returnResult({ data: null, error: s })
      : await this._verify({ factorId: e.factorId, challengeId: t.id, code: e.code });
  }
  async _listFactors() {
    var e;
    const {
      data: { user: t },
      error: s,
    } = await this.getUser();
    if (s) return { data: null, error: s };
    const r = { all: [], phone: [], totp: [], webauthn: [] };
    for (const n of null !== (e = null == t ? void 0 : t.factors) && void 0 !== e ? e : [])
      (r.all.push(n), 'verified' === n.status && r[n.factor_type].push(n));
    return { data: r, error: null };
  }
  async _getAuthenticatorAssuranceLevel(e) {
    var t, s, r, n;
    if (e)
      try {
        const { payload: r } = qs(e);
        let n = null;
        r.aal && (n = r.aal);
        let i = n;
        const {
          data: { user: a },
          error: o,
        } = await this.getUser(e);
        if (o) return this._returnResult({ data: null, error: o });
        (null !==
          (s =
            null === (t = null == a ? void 0 : a.factors) || void 0 === t
              ? void 0
              : t.filter(e => 'verified' === e.status)) && void 0 !== s
          ? s
          : []
        ).length > 0 && (i = 'aal2');
        return {
          data: { currentLevel: n, nextLevel: i, currentAuthenticationMethods: r.amr || [] },
          error: null,
        };
      } catch (h) {
        if (is(h)) return this._returnResult({ data: null, error: h });
        throw h;
      }
    const {
      data: { session: i },
      error: a,
    } = await this.getSession();
    if (a) return this._returnResult({ data: null, error: a });
    if (!i)
      return {
        data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
        error: null,
      };
    const { payload: o } = qs(i.access_token);
    let c = null;
    o.aal && (c = o.aal);
    let l = c;
    (null !==
      (n =
        null === (r = i.user.factors) || void 0 === r
          ? void 0
          : r.filter(e => 'verified' === e.status)) && void 0 !== n
      ? n
      : []
    ).length > 0 && (l = 'aal2');
    return {
      data: { currentLevel: c, nextLevel: l, currentAuthenticationMethods: o.amr || [] },
      error: null,
    };
  }
  async _getAuthorizationDetails(e) {
    try {
      return await this._useSession(async t => {
        const {
          data: { session: s },
          error: r,
        } = t;
        return r
          ? this._returnResult({ data: null, error: r })
          : s
            ? await Qs(this.fetch, 'GET', `${this.url}/oauth/authorizations/${e}`, {
                headers: this.headers,
                jwt: s.access_token,
                xform: e => ({ data: e, error: null }),
              })
            : this._returnResult({ data: null, error: new ls() });
      });
    } catch (t) {
      if (is(t)) return this._returnResult({ data: null, error: t });
      throw t;
    }
  }
  async _approveAuthorization(e, t) {
    try {
      return await this._useSession(async s => {
        const {
          data: { session: r },
          error: n,
        } = s;
        if (n) return this._returnResult({ data: null, error: n });
        if (!r) return this._returnResult({ data: null, error: new ls() });
        const i = await Qs(this.fetch, 'POST', `${this.url}/oauth/authorizations/${e}/consent`, {
          headers: this.headers,
          jwt: r.access_token,
          body: { action: 'approve' },
          xform: e => ({ data: e, error: null }),
        });
        return (
          i.data &&
            i.data.redirect_url &&
            js() &&
            !(null == t ? void 0 : t.skipBrowserRedirect) &&
            window.location.assign(i.data.redirect_url),
          i
        );
      });
    } catch (s) {
      if (is(s)) return this._returnResult({ data: null, error: s });
      throw s;
    }
  }
  async _denyAuthorization(e, t) {
    try {
      return await this._useSession(async s => {
        const {
          data: { session: r },
          error: n,
        } = s;
        if (n) return this._returnResult({ data: null, error: n });
        if (!r) return this._returnResult({ data: null, error: new ls() });
        const i = await Qs(this.fetch, 'POST', `${this.url}/oauth/authorizations/${e}/consent`, {
          headers: this.headers,
          jwt: r.access_token,
          body: { action: 'deny' },
          xform: e => ({ data: e, error: null }),
        });
        return (
          i.data &&
            i.data.redirect_url &&
            js() &&
            !(null == t ? void 0 : t.skipBrowserRedirect) &&
            window.location.assign(i.data.redirect_url),
          i
        );
      });
    } catch (s) {
      if (is(s)) return this._returnResult({ data: null, error: s });
      throw s;
    }
  }
  async _listOAuthGrants() {
    try {
      return await this._useSession(async e => {
        const {
          data: { session: t },
          error: s,
        } = e;
        return s
          ? this._returnResult({ data: null, error: s })
          : t
            ? await Qs(this.fetch, 'GET', `${this.url}/user/oauth/grants`, {
                headers: this.headers,
                jwt: t.access_token,
                xform: e => ({ data: e, error: null }),
              })
            : this._returnResult({ data: null, error: new ls() });
      });
    } catch (e) {
      if (is(e)) return this._returnResult({ data: null, error: e });
      throw e;
    }
  }
  async _revokeOAuthGrant(e) {
    try {
      return await this._useSession(async t => {
        const {
          data: { session: s },
          error: r,
        } = t;
        return r
          ? this._returnResult({ data: null, error: r })
          : s
            ? (await Qs(this.fetch, 'DELETE', `${this.url}/user/oauth/grants`, {
                headers: this.headers,
                jwt: s.access_token,
                query: { client_id: e.clientId },
                noResolveJson: !0,
              }),
              { data: {}, error: null })
            : this._returnResult({ data: null, error: new ls() });
      });
    } catch (t) {
      if (is(t)) return this._returnResult({ data: null, error: t });
      throw t;
    }
  }
  async fetchJwk(e, t = { keys: [] }) {
    let s = t.keys.find(t => t.kid === e);
    if (s) return s;
    const r = Date.now();
    if (((s = this.jwks.keys.find(t => t.kid === e)), s && this.jwks_cached_at + 6e5 > r)) return s;
    const { data: n, error: i } = await Qs(this.fetch, 'GET', `${this.url}/.well-known/jwks.json`, {
      headers: this.headers,
    });
    if (i) throw i;
    return n.keys && 0 !== n.keys.length
      ? ((this.jwks = n), (this.jwks_cached_at = r), (s = n.keys.find(t => t.kid === e)), s || null)
      : null;
  }
  async getClaims(e, t = {}) {
    try {
      let s = e;
      if (!s) {
        const { data: e, error: t } = await this.getSession();
        if (t || !e.session) return this._returnResult({ data: null, error: t });
        s = e.session.access_token;
      }
      const {
        header: r,
        payload: n,
        signature: i,
        raw: { header: a, payload: o },
      } = qs(s);
      (null == t ? void 0 : t.allowExpired) ||
        (function (e) {
          if (!e) throw new Error('Missing exp claim');
          if (e <= Math.floor(Date.now() / 1e3)) throw new Error('JWT has expired');
        })(n.exp);
      const c =
        r.alg &&
        !r.alg.startsWith('HS') &&
        r.kid &&
        'crypto' in globalThis &&
        'subtle' in globalThis.crypto
          ? await this.fetchJwk(
              r.kid,
              (null == t ? void 0 : t.keys) ? { keys: t.keys } : null == t ? void 0 : t.jwks
            )
          : null;
      if (!c) {
        const { error: e } = await this.getUser(s);
        if (e) throw e;
        return { data: { claims: n, header: r, signature: i }, error: null };
      }
      const l = (function (e) {
          switch (e) {
            case 'RS256':
              return { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } };
            case 'ES256':
              return { name: 'ECDSA', namedCurve: 'P-256', hash: { name: 'SHA-256' } };
            default:
              throw new Error('Invalid alg claim');
          }
        })(r.alg),
        h = await crypto.subtle.importKey('jwk', c, l, !0, ['verify']);
      if (!(await crypto.subtle.verify(l, h, i, As(`${a}.${o}`))))
        throw new vs('Invalid JWT signature');
      return { data: { claims: n, header: r, signature: i }, error: null };
    } catch (s) {
      if (is(s)) return this._returnResult({ data: null, error: s });
      throw s;
    }
  }
}
jr.nextInstanceID = {};
const Ir = jr;
let $r = '';
$r =
  'undefined' != typeof Deno
    ? 'deno'
    : 'undefined' != typeof document
      ? 'web'
      : 'undefined' != typeof navigator && 'ReactNative' === navigator.product
        ? 'react-native'
        : 'node';
const Cr = { headers: { 'X-Client-Info': `supabase-js-${$r}/2.93.3` } },
  xr = { schema: 'public' },
  Nr = { autoRefreshToken: !0, persistSession: !0, detectSessionInUrl: !0, flowType: 'implicit' },
  Ur = {};
function Dr(e) {
  return (Dr =
    'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
      ? function (e) {
          return typeof e;
        }
      : function (e) {
          return e &&
            'function' == typeof Symbol &&
            e.constructor === Symbol &&
            e !== Symbol.prototype
            ? 'symbol'
            : typeof e;
        })(e);
}
function qr(e) {
  var t = (function (e, t) {
    if ('object' != Dr(e) || !e) return e;
    var s = e[Symbol.toPrimitive];
    if (void 0 !== s) {
      var r = s.call(e, t);
      if ('object' != Dr(r)) return r;
      throw new TypeError('@@toPrimitive must return a primitive value.');
    }
    return ('string' === t ? String : Number)(e);
  })(e, 'string');
  return 'symbol' == Dr(t) ? t : t + '';
}
function Lr(e, t, s) {
  return (
    (t = qr(t)) in e
      ? Object.defineProperty(e, t, { value: s, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = s),
    e
  );
}
function Br(e, t) {
  var s = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    (t &&
      (r = r.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable;
      })),
      s.push.apply(s, r));
  }
  return s;
}
function Mr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var s = null != arguments[t] ? arguments[t] : {};
    t % 2
      ? Br(Object(s), !0).forEach(function (t) {
          Lr(e, t, s[t]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(s))
        : Br(Object(s)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(s, t));
          });
  }
  return e;
}
const Kr = (e, t, s) => {
  const r = (e => (e ? (...t) => e(...t) : (...e) => fetch(...e)))(s),
    n = Headers;
  return async (s, i) => {
    var a;
    const o = null !== (a = await t()) && void 0 !== a ? a : e;
    let c = new n(null == i ? void 0 : i.headers);
    return (
      c.has('apikey') || c.set('apikey', e),
      c.has('Authorization') || c.set('Authorization', `Bearer ${o}`),
      r(s, Mr(Mr({}, i), {}, { headers: c }))
    );
  };
};
var Wr = class extends Ir {
    constructor(e) {
      super(e);
    }
  },
  Fr = class {
    constructor(e, t, s) {
      var r, n;
      ((this.supabaseUrl = e), (this.supabaseKey = t));
      const i = (function (e) {
        const t = null == e ? void 0 : e.trim();
        if (!t) throw new Error('supabaseUrl is required.');
        if (!t.match(/^https?:\/\//i))
          throw new Error('Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.');
        try {
          return new URL((s = t).endsWith('/') ? s : s + '/');
        } catch (r) {
          throw Error('Invalid supabaseUrl: Provided URL is malformed.');
        }
        var s;
      })(e);
      if (!t) throw new Error('supabaseKey is required.');
      ((this.realtimeUrl = new URL('realtime/v1', i)),
        (this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace('http', 'ws')),
        (this.authUrl = new URL('auth/v1', i)),
        (this.storageUrl = new URL('storage/v1', i)),
        (this.functionsUrl = new URL('functions/v1', i)));
      const a = `sb-${i.hostname.split('.')[0]}-auth-token`,
        o = (function (e, t) {
          var s, r;
          const { db: n, auth: i, realtime: a, global: o } = e,
            { db: c, auth: l, realtime: h, global: u } = t,
            d = {
              db: Mr(Mr({}, c), n),
              auth: Mr(Mr({}, l), i),
              realtime: Mr(Mr({}, h), a),
              storage: {},
              global: Mr(
                Mr(Mr({}, u), o),
                {},
                {
                  headers: Mr(
                    Mr({}, null !== (s = null == u ? void 0 : u.headers) && void 0 !== s ? s : {}),
                    null !== (r = null == o ? void 0 : o.headers) && void 0 !== r ? r : {}
                  ),
                }
              ),
              accessToken: async () => '',
            };
          return (e.accessToken ? (d.accessToken = e.accessToken) : delete d.accessToken, d);
        })(null != s ? s : {}, {
          db: xr,
          realtime: Ur,
          auth: Mr(Mr({}, Nr), {}, { storageKey: a }),
          global: Cr,
        });
      var c;
      ((this.storageKey = null !== (r = o.auth.storageKey) && void 0 !== r ? r : ''),
      (this.headers = null !== (n = o.global.headers) && void 0 !== n ? n : {}),
      o.accessToken)
        ? ((this.accessToken = o.accessToken),
          (this.auth = new Proxy(
            {},
            {
              get: (e, t) => {
                throw new Error(
                  `@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t)} is not possible`
                );
              },
            }
          )))
        : (this.auth = this._initSupabaseAuthClient(
            null !== (c = o.auth) && void 0 !== c ? c : {},
            this.headers,
            o.global.fetch
          ));
      ((this.fetch = Kr(t, this._getAccessToken.bind(this), o.global.fetch)),
        (this.realtime = this._initRealtimeClient(
          Mr({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, o.realtime)
        )),
        this.accessToken &&
          Promise.resolve(this.accessToken())
            .then(e => this.realtime.setAuth(e))
            .catch(e => {}),
        (this.rest = new ge(new URL('rest/v1', i).href, {
          headers: this.headers,
          schema: o.db.schema,
          fetch: this.fetch,
        })),
        (this.storage = new Qt(
          this.storageUrl.href,
          this.headers,
          this.fetch,
          null == s ? void 0 : s.storage
        )),
        o.accessToken || this._listenForAuthEvents());
    }
    get functions() {
      return new ce(this.functionsUrl.href, { headers: this.headers, customFetch: this.fetch });
    }
    from(e) {
      return this.rest.from(e);
    }
    schema(e) {
      return this.rest.schema(e);
    }
    rpc(e, t = {}, s = { head: !1, get: !1, count: void 0 }) {
      return this.rest.rpc(e, t, s);
    }
    channel(e, t = { config: {} }) {
      return this.realtime.channel(e, t);
    }
    getChannels() {
      return this.realtime.getChannels();
    }
    removeChannel(e) {
      return this.realtime.removeChannel(e);
    }
    removeAllChannels() {
      return this.realtime.removeAllChannels();
    }
    async _getAccessToken() {
      var e,
        t,
        s = this;
      if (s.accessToken) return await s.accessToken();
      const { data: r } = await s.auth.getSession();
      return null !== (e = null === (t = r.session) || void 0 === t ? void 0 : t.access_token) &&
        void 0 !== e
        ? e
        : s.supabaseKey;
    }
    _initSupabaseAuthClient(
      {
        autoRefreshToken: e,
        persistSession: t,
        detectSessionInUrl: s,
        storage: r,
        userStorage: n,
        storageKey: i,
        flowType: a,
        lock: o,
        debug: c,
        throwOnError: l,
      },
      h,
      u
    ) {
      const d = { Authorization: `Bearer ${this.supabaseKey}`, apikey: `${this.supabaseKey}` };
      return new Wr({
        url: this.authUrl.href,
        headers: Mr(Mr({}, d), h),
        storageKey: i,
        autoRefreshToken: e,
        persistSession: t,
        detectSessionInUrl: s,
        storage: r,
        userStorage: n,
        flowType: a,
        lock: o,
        debug: c,
        throwOnError: l,
        fetch: u,
        hasCustomAuthorizationHeader: Object.keys(this.headers).some(
          e => 'authorization' === e.toLowerCase()
        ),
      });
    }
    _initRealtimeClient(e) {
      return new it(
        this.realtimeUrl.href,
        Mr(
          Mr({}, e),
          {},
          { params: Mr(Mr({}, { apikey: this.supabaseKey }), null == e ? void 0 : e.params) }
        )
      );
    }
    _listenForAuthEvents() {
      return this.auth.onAuthStateChange((e, t) => {
        this._handleTokenChanged(e, 'CLIENT', null == t ? void 0 : t.access_token);
      });
    }
    _handleTokenChanged(e, t, s) {
      ('TOKEN_REFRESHED' !== e && 'SIGNED_IN' !== e) || this.changedAccessToken === s
        ? 'SIGNED_OUT' === e &&
          (this.realtime.setAuth(),
          'STORAGE' == t && this.auth.signOut(),
          (this.changedAccessToken = void 0))
        : ((this.changedAccessToken = s), this.realtime.setAuth(s));
    }
  };
const Hr = (e, t, s) => new Fr(e, t, s);
!(function () {
  if ('undefined' != typeof window) return !1;
  const e = globalThis.process;
  if (!e) return !1;
  const t = e.version;
  if (null == t) return !1;
  const s = t.match(/^v(\d+)\./);
  !!s && parseInt(s[1], 10);
})();
var Gr = class {
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
  Jr = {
    setTimeout: (e, t) => setTimeout(e, t),
    clearTimeout: e => clearTimeout(e),
    setInterval: (e, t) => setInterval(e, t),
    clearInterval: e => clearInterval(e),
  },
  Vr = new ((s = class {
    constructor() {
      (V(this, e, Jr), V(this, t, !1));
    }
    setTimeoutProvider(t) {
      z(this, e, t);
    }
    setTimeout(t, s) {
      return J(this, e).setTimeout(t, s);
    }
    clearTimeout(t) {
      J(this, e).clearTimeout(t);
    }
    setInterval(t, s) {
      return J(this, e).setInterval(t, s);
    }
    clearInterval(t) {
      J(this, e).clearInterval(t);
    }
  }),
  (e = new WeakMap()),
  (t = new WeakMap()),
  s)();
var zr = 'undefined' == typeof window || 'Deno' in globalThis;
function Qr() {}
function Yr(e, t) {
  return 'function' == typeof e ? e(t) : e;
}
function Xr(e, t) {
  const { type: s = 'all', exact: r, fetchStatus: n, predicate: i, queryKey: a, stale: o } = e;
  if (a)
    if (r) {
      if (t.queryHash !== en(a, t.options)) return !1;
    } else if (!sn(t.queryKey, a)) return !1;
  if ('all' !== s) {
    const e = t.isActive();
    if ('active' === s && !e) return !1;
    if ('inactive' === s && e) return !1;
  }
  return (
    ('boolean' != typeof o || t.isStale() === o) &&
    (!n || n === t.state.fetchStatus) &&
    !(i && !i(t))
  );
}
function Zr(e, t) {
  const { exact: s, status: r, predicate: n, mutationKey: i } = e;
  if (i) {
    if (!t.options.mutationKey) return !1;
    if (s) {
      if (tn(t.options.mutationKey) !== tn(i)) return !1;
    } else if (!sn(t.options.mutationKey, i)) return !1;
  }
  return (!r || t.state.status === r) && !(n && !n(t));
}
function en(e, t) {
  return (t?.queryKeyHashFn || tn)(e);
}
function tn(e) {
  return JSON.stringify(e, (e, t) =>
    on(t)
      ? Object.keys(t)
          .sort()
          .reduce((e, s) => ((e[s] = t[s]), e), {})
      : t
  );
}
function sn(e, t) {
  return (
    e === t ||
    (typeof e == typeof t &&
      !(!e || !t || 'object' != typeof e || 'object' != typeof t) &&
      Object.keys(t).every(s => sn(e[s], t[s])))
  );
}
var rn = Object.prototype.hasOwnProperty;
function nn(e, t, s = 0) {
  if (e === t) return e;
  if (s > 500) return t;
  const r = an(e) && an(t);
  if (!(r || (on(e) && on(t)))) return t;
  const n = (r ? e : Object.keys(e)).length,
    i = r ? t : Object.keys(t),
    a = i.length,
    o = r ? new Array(a) : {};
  let c = 0;
  for (let l = 0; l < a; l++) {
    const a = r ? l : i[l],
      h = e[a],
      u = t[a];
    if (h === u) {
      ((o[a] = h), (r ? l < n : rn.call(e, a)) && c++);
      continue;
    }
    if (null === h || null === u || 'object' != typeof h || 'object' != typeof u) {
      o[a] = u;
      continue;
    }
    const d = nn(h, u, s + 1);
    ((o[a] = d), d === h && c++);
  }
  return n === a && c === n ? e : o;
}
function an(e) {
  return Array.isArray(e) && e.length === Object.keys(e).length;
}
function on(e) {
  if (!cn(e)) return !1;
  const t = e.constructor;
  if (void 0 === t) return !0;
  const s = t.prototype;
  return (
    !!cn(s) && !!s.hasOwnProperty('isPrototypeOf') && Object.getPrototypeOf(e) === Object.prototype
  );
}
function cn(e) {
  return '[object Object]' === Object.prototype.toString.call(e);
}
function ln(e, t, s) {
  return 'function' == typeof s.structuralSharing
    ? s.structuralSharing(e, t)
    : !1 !== s.structuralSharing
      ? nn(e, t)
      : t;
}
function hn(e, t, s = 0) {
  const r = [...e, t];
  return s && r.length > s ? r.slice(1) : r;
}
function un(e, t, s = 0) {
  const r = [t, ...e];
  return s && r.length > s ? r.slice(0, -1) : r;
}
var dn = Symbol();
function pn(e, t) {
  return !e.queryFn && t?.initialPromise
    ? () => t.initialPromise
    : e.queryFn && e.queryFn !== dn
      ? e.queryFn
      : () => Promise.reject(new Error(`Missing queryFn: '${e.queryHash}'`));
}
var fn = new ((a = class extends Gr {
  constructor() {
    (super(),
      V(this, r),
      V(this, n),
      V(this, i),
      z(this, i, e => {
        if (!zr && window.addEventListener) {
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
    J(this, n) || this.setEventListener(J(this, i));
  }
  onUnsubscribe() {
    var e;
    this.hasListeners() || (null == (e = J(this, n)) || e.call(this), z(this, n, void 0));
  }
  setEventListener(e) {
    var t;
    (z(this, i, e),
      null == (t = J(this, n)) || t.call(this),
      z(
        this,
        n,
        e(e => {
          'boolean' == typeof e ? this.setFocused(e) : this.onFocus();
        })
      ));
  }
  setFocused(e) {
    J(this, r) !== e && (z(this, r, e), this.onFocus());
  }
  onFocus() {
    const e = this.isFocused();
    this.listeners.forEach(t => {
      t(e);
    });
  }
  isFocused() {
    return 'boolean' == typeof J(this, r)
      ? J(this, r)
      : 'hidden' !== globalThis.document?.visibilityState;
  }
}),
(r = new WeakMap()),
(n = new WeakMap()),
(i = new WeakMap()),
a)();
var gn = function (e) {
  setTimeout(e, 0);
};
var yn = (function () {
    let e = [],
      t = 0,
      s = e => {
        e();
      },
      r = e => {
        e();
      },
      n = gn;
    const i = r => {
      t
        ? e.push(r)
        : n(() => {
            s(r);
          });
    };
    return {
      batch: i => {
        let a;
        t++;
        try {
          a = i();
        } finally {
          (t--,
            t ||
              (() => {
                const t = e;
                ((e = []),
                  t.length &&
                    n(() => {
                      r(() => {
                        t.forEach(e => {
                          s(e);
                        });
                      });
                    }));
              })());
        }
        return a;
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
        s = e;
      },
      setBatchNotifyFunction: e => {
        r = e;
      },
      setScheduler: e => {
        n = e;
      },
    };
  })(),
  mn = new ((h = class extends Gr {
    constructor() {
      (super(),
        V(this, o, !0),
        V(this, c),
        V(this, l),
        z(this, l, e => {
          if (!zr && window.addEventListener) {
            const t = () => e(!0),
              s = () => e(!1);
            return (
              window.addEventListener('online', t, !1),
              window.addEventListener('offline', s, !1),
              () => {
                (window.removeEventListener('online', t), window.removeEventListener('offline', s));
              }
            );
          }
        }));
    }
    onSubscribe() {
      J(this, c) || this.setEventListener(J(this, l));
    }
    onUnsubscribe() {
      var e;
      this.hasListeners() || (null == (e = J(this, c)) || e.call(this), z(this, c, void 0));
    }
    setEventListener(e) {
      var t;
      (z(this, l, e),
        null == (t = J(this, c)) || t.call(this),
        z(this, c, e(this.setOnline.bind(this))));
    }
    setOnline(e) {
      J(this, o) !== e &&
        (z(this, o, e),
        this.listeners.forEach(t => {
          t(e);
        }));
    }
    isOnline() {
      return J(this, o);
    }
  }),
  (o = new WeakMap()),
  (c = new WeakMap()),
  (l = new WeakMap()),
  h)();
function wn(e) {
  return Math.min(1e3 * 2 ** e, 3e4);
}
function vn(e) {
  return 'online' !== (e ?? 'online') || mn.isOnline();
}
var bn = class extends Error {
  constructor(e) {
    (super('CancelledError'), (this.revert = e?.revert), (this.silent = e?.silent));
  }
};
function _n(e) {
  let t,
    s = !1,
    r = 0;
  const n = (function () {
      let e, t;
      const s = new Promise((s, r) => {
        ((e = s), (t = r));
      });
      function r(e) {
        (Object.assign(s, e), delete s.resolve, delete s.reject);
      }
      return (
        (s.status = 'pending'),
        s.catch(() => {}),
        (s.resolve = t => {
          (r({ status: 'fulfilled', value: t }), e(t));
        }),
        (s.reject = e => {
          (r({ status: 'rejected', reason: e }), t(e));
        }),
        s
      );
    })(),
    i = () => 'pending' !== n.status,
    a = () => fn.isFocused() && ('always' === e.networkMode || mn.isOnline()) && e.canRun(),
    o = () => vn(e.networkMode) && e.canRun(),
    c = e => {
      i() || (t?.(), n.resolve(e));
    },
    l = e => {
      i() || (t?.(), n.reject(e));
    },
    h = () =>
      new Promise(s => {
        ((t = e => {
          (i() || a()) && s(e);
        }),
          e.onPause?.());
      }).then(() => {
        ((t = void 0), i() || e.onContinue?.());
      }),
    u = () => {
      if (i()) return;
      let t;
      const n = 0 === r ? e.initialPromise : void 0;
      try {
        t = n ?? e.fn();
      } catch (o) {
        t = Promise.reject(o);
      }
      Promise.resolve(t)
        .then(c)
        .catch(t => {
          if (i()) return;
          const n = e.retry ?? (zr ? 0 : 3),
            o = e.retryDelay ?? wn,
            c = 'function' == typeof o ? o(r, t) : o,
            d = !0 === n || ('number' == typeof n && r < n) || ('function' == typeof n && n(r, t));
          var p;
          !s && d
            ? (r++,
              e.onFail?.(r, t),
              ((p = c),
              new Promise(e => {
                Vr.setTimeout(e, p);
              }))
                .then(() => (a() ? void 0 : h()))
                .then(() => {
                  s ? l(t) : u();
                }))
            : l(t);
        });
    };
  return {
    promise: n,
    status: () => n.status,
    cancel: t => {
      if (!i()) {
        const s = new bn(t);
        (l(s), e.onCancel?.(s));
      }
    },
    continue: () => (t?.(), n),
    cancelRetry: () => {
      s = !0;
    },
    continueRetry: () => {
      s = !1;
    },
    canStart: o,
    start: () => (o() ? u() : h().then(u), n),
  };
}
var kn =
    ((d = class {
      constructor() {
        V(this, u);
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
            z(
              this,
              u,
              Vr.setTimeout(() => {
                this.optionalRemove();
              }, this.gcTime)
            ));
      }
      updateGcTime(e) {
        this.gcTime = Math.max(this.gcTime || 0, e ?? (zr ? 1 / 0 : 3e5));
      }
      clearGcTimeout() {
        J(this, u) && (Vr.clearTimeout(J(this, u)), z(this, u, void 0));
      }
    }),
    (u = new WeakMap()),
    d),
  Sn =
    ((k = class extends kn {
      constructor(e) {
        (super(),
          V(this, b),
          V(this, p),
          V(this, f),
          V(this, g),
          V(this, y),
          V(this, m),
          V(this, w),
          V(this, v),
          z(this, v, !1),
          z(this, w, e.defaultOptions),
          this.setOptions(e.options),
          (this.observers = []),
          z(this, y, e.client),
          z(this, g, J(this, y).getQueryCache()),
          (this.queryKey = e.queryKey),
          (this.queryHash = e.queryHash),
          z(this, p, En(this.options)),
          (this.state = e.state ?? J(this, p)),
          this.scheduleGc());
      }
      get meta() {
        return this.options.meta;
      }
      get promise() {
        return J(this, m)?.promise;
      }
      setOptions(e) {
        if (
          ((this.options = { ...J(this, w), ...e }),
          this.updateGcTime(this.options.gcTime),
          this.state && void 0 === this.state.data)
        ) {
          const e = En(this.options);
          void 0 !== e.data && (this.setState(Tn(e.data, e.dataUpdatedAt)), z(this, p, e));
        }
      }
      optionalRemove() {
        this.observers.length || 'idle' !== this.state.fetchStatus || J(this, g).remove(this);
      }
      setData(e, t) {
        const s = ln(this.state.data, e, this.options);
        return (
          Q(this, b, _).call(this, {
            data: s,
            type: 'success',
            dataUpdatedAt: t?.updatedAt,
            manual: t?.manual,
          }),
          s
        );
      }
      setState(e, t) {
        Q(this, b, _).call(this, { type: 'setState', state: e, setStateOptions: t });
      }
      cancel(e) {
        const t = J(this, m)?.promise;
        return (J(this, m)?.cancel(e), t ? t.then(Qr).catch(Qr) : Promise.resolve());
      }
      destroy() {
        (super.destroy(), this.cancel({ silent: !0 }));
      }
      reset() {
        (this.destroy(), this.setState(J(this, p)));
      }
      isActive() {
        return this.observers.some(e => {
          return !1 !== ((t = e.options.enabled), (s = this), 'function' == typeof t ? t(s) : t);
          var t, s;
        });
      }
      isDisabled() {
        return this.getObserversCount() > 0
          ? !this.isActive()
          : this.options.queryFn === dn ||
              this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
      }
      isStatic() {
        return (
          this.getObserversCount() > 0 &&
          this.observers.some(e => 'static' === Yr(e.options.staleTime, this))
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
        const e = this.observers.find(e => e.shouldFetchOnWindowFocus());
        (e?.refetch({ cancelRefetch: !1 }), J(this, m)?.continue());
      }
      onOnline() {
        const e = this.observers.find(e => e.shouldFetchOnReconnect());
        (e?.refetch({ cancelRefetch: !1 }), J(this, m)?.continue());
      }
      addObserver(e) {
        this.observers.includes(e) ||
          (this.observers.push(e),
          this.clearGcTimeout(),
          J(this, g).notify({ type: 'observerAdded', query: this, observer: e }));
      }
      removeObserver(e) {
        this.observers.includes(e) &&
          ((this.observers = this.observers.filter(t => t !== e)),
          this.observers.length ||
            (J(this, m) &&
              (J(this, v) ? J(this, m).cancel({ revert: !0 }) : J(this, m).cancelRetry()),
            this.scheduleGc()),
          J(this, g).notify({ type: 'observerRemoved', query: this, observer: e }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      invalidate() {
        this.state.isInvalidated || Q(this, b, _).call(this, { type: 'invalidate' });
      }
      async fetch(e, t) {
        if ('idle' !== this.state.fetchStatus && 'rejected' !== J(this, m)?.status())
          if (void 0 !== this.state.data && t?.cancelRefetch) this.cancel({ silent: !0 });
          else if (J(this, m)) return (J(this, m).continueRetry(), J(this, m).promise);
        if ((e && this.setOptions(e), !this.options.queryFn)) {
          const e = this.observers.find(e => e.options.queryFn);
          e && this.setOptions(e.options);
        }
        const s = new AbortController(),
          r = e => {
            Object.defineProperty(e, 'signal', {
              enumerable: !0,
              get: () => (z(this, v, !0), s.signal),
            });
          },
          n = () => {
            const e = pn(this.options, t),
              s = (() => {
                const e = { client: J(this, y), queryKey: this.queryKey, meta: this.meta };
                return (r(e), e);
              })();
            return (
              z(this, v, !1),
              this.options.persister ? this.options.persister(e, s, this) : e(s)
            );
          },
          i = (() => {
            const e = {
              fetchOptions: t,
              options: this.options,
              queryKey: this.queryKey,
              client: J(this, y),
              state: this.state,
              fetchFn: n,
            };
            return (r(e), e);
          })();
        (this.options.behavior?.onFetch(i, this),
          z(this, f, this.state),
          ('idle' !== this.state.fetchStatus && this.state.fetchMeta === i.fetchOptions?.meta) ||
            Q(this, b, _).call(this, { type: 'fetch', meta: i.fetchOptions?.meta }),
          z(
            this,
            m,
            _n({
              initialPromise: t?.initialPromise,
              fn: i.fetchFn,
              onCancel: e => {
                (e instanceof bn &&
                  e.revert &&
                  this.setState({ ...J(this, f), fetchStatus: 'idle' }),
                  s.abort());
              },
              onFail: (e, t) => {
                Q(this, b, _).call(this, { type: 'failed', failureCount: e, error: t });
              },
              onPause: () => {
                Q(this, b, _).call(this, { type: 'pause' });
              },
              onContinue: () => {
                Q(this, b, _).call(this, { type: 'continue' });
              },
              retry: i.options.retry,
              retryDelay: i.options.retryDelay,
              networkMode: i.options.networkMode,
              canRun: () => !0,
            })
          ));
        try {
          const e = await J(this, m).start();
          if (void 0 === e) throw new Error(`${this.queryHash} data is undefined`);
          return (
            this.setData(e),
            J(this, g).config.onSuccess?.(e, this),
            J(this, g).config.onSettled?.(e, this.state.error, this),
            e
          );
        } catch (a) {
          if (a instanceof bn) {
            if (a.silent) return J(this, m).promise;
            if (a.revert) {
              if (void 0 === this.state.data) throw a;
              return this.state.data;
            }
          }
          throw (
            Q(this, b, _).call(this, { type: 'error', error: a }),
            J(this, g).config.onError?.(a, this),
            J(this, g).config.onSettled?.(this.state.data, a, this),
            a
          );
        } finally {
          this.scheduleGc();
        }
      }
    }),
    (p = new WeakMap()),
    (f = new WeakMap()),
    (g = new WeakMap()),
    (y = new WeakMap()),
    (m = new WeakMap()),
    (w = new WeakMap()),
    (v = new WeakMap()),
    (b = new WeakSet()),
    (_ = function (e) {
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
              ...((s = t.data),
              (r = this.options),
              {
                fetchFailureCount: 0,
                fetchFailureReason: null,
                fetchStatus: vn(r.networkMode) ? 'fetching' : 'paused',
                ...(void 0 === s && { error: null, status: 'pending' }),
              }),
              fetchMeta: e.meta ?? null,
            };
          case 'success':
            const n = {
              ...t,
              ...Tn(e.data, e.dataUpdatedAt),
              dataUpdateCount: t.dataUpdateCount + 1,
              ...(!e.manual && {
                fetchStatus: 'idle',
                fetchFailureCount: 0,
                fetchFailureReason: null,
              }),
            };
            return (z(this, f, e.manual ? n : void 0), n);
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
        var s, r;
      })(this.state)),
        yn.batch(() => {
          (this.observers.forEach(e => {
            e.onQueryUpdate();
          }),
            J(this, g).notify({ query: this, type: 'updated', action: e }));
        }));
    }),
    k);
function Tn(e, t) {
  return {
    data: e,
    dataUpdatedAt: t ?? Date.now(),
    error: null,
    isInvalidated: !1,
    status: 'success',
  };
}
function En(e) {
  const t = 'function' == typeof e.initialData ? e.initialData() : e.initialData,
    s = void 0 !== t,
    r = s
      ? 'function' == typeof e.initialDataUpdatedAt
        ? e.initialDataUpdatedAt()
        : e.initialDataUpdatedAt
      : 0;
  return {
    data: t,
    dataUpdateCount: 0,
    dataUpdatedAt: s ? (r ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: s ? 'success' : 'pending',
    fetchStatus: 'idle',
  };
}
function On(e) {
  return {
    onFetch: (t, s) => {
      const r = t.options,
        n = t.fetchOptions?.meta?.fetchMore?.direction,
        i = t.state.data?.pages || [],
        a = t.state.data?.pageParams || [];
      let o = { pages: [], pageParams: [] },
        c = 0;
      const l = async () => {
        let s = !1;
        const l = e => {
            !(function (e, t, s) {
              let r,
                n = !1;
              Object.defineProperty(e, 'signal', {
                enumerable: !0,
                get: () => (
                  r ?? (r = t()),
                  n || ((n = !0), r.aborted ? s() : r.addEventListener('abort', s, { once: !0 })),
                  r
                ),
              });
            })(
              e,
              () => t.signal,
              () => (s = !0)
            );
          },
          h = pn(t.options, t.fetchOptions),
          u = async (e, r, n) => {
            if (s) return Promise.reject();
            if (null == r && e.pages.length) return Promise.resolve(e);
            const i = (() => {
                const e = {
                  client: t.client,
                  queryKey: t.queryKey,
                  pageParam: r,
                  direction: n ? 'backward' : 'forward',
                  meta: t.options.meta,
                };
                return (l(e), e);
              })(),
              a = await h(i),
              { maxPages: o } = t.options,
              c = n ? un : hn;
            return { pages: c(e.pages, a, o), pageParams: c(e.pageParams, r, o) };
          };
        if (n && i.length) {
          const e = 'backward' === n,
            t = { pages: i, pageParams: a },
            s = (e ? An : Rn)(r, t);
          o = await u(t, s, e);
        } else {
          const t = e ?? i.length;
          do {
            const e = 0 === c ? (a[0] ?? r.initialPageParam) : Rn(r, o);
            if (c > 0 && null == e) break;
            ((o = await u(o, e)), c++);
          } while (c < t);
        }
        return o;
      };
      t.options.persister
        ? (t.fetchFn = () =>
            t.options.persister?.(
              l,
              { client: t.client, queryKey: t.queryKey, meta: t.options.meta, signal: t.signal },
              s
            ))
        : (t.fetchFn = l);
    },
  };
}
function Rn(e, { pages: t, pageParams: s }) {
  const r = t.length - 1;
  return t.length > 0 ? e.getNextPageParam(t[r], t, s[r], s) : void 0;
}
function An(e, { pages: t, pageParams: s }) {
  return t.length > 0 ? e.getPreviousPageParam?.(t[0], t, s[0], s) : void 0;
}
var Pn =
  ((P = class extends kn {
    constructor(e) {
      (super(),
        V(this, R),
        V(this, S),
        V(this, T),
        V(this, E),
        V(this, O),
        z(this, S, e.client),
        (this.mutationId = e.mutationId),
        z(this, E, e.mutationCache),
        z(this, T, []),
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
      J(this, T).includes(e) ||
        (J(this, T).push(e),
        this.clearGcTimeout(),
        J(this, E).notify({ type: 'observerAdded', mutation: this, observer: e }));
    }
    removeObserver(e) {
      (z(
        this,
        T,
        J(this, T).filter(t => t !== e)
      ),
        this.scheduleGc(),
        J(this, E).notify({ type: 'observerRemoved', mutation: this, observer: e }));
    }
    optionalRemove() {
      J(this, T).length ||
        ('pending' === this.state.status ? this.scheduleGc() : J(this, E).remove(this));
    }
    continue() {
      return J(this, O)?.continue() ?? this.execute(this.state.variables);
    }
    async execute(e) {
      const t = () => {
          Q(this, R, A).call(this, { type: 'continue' });
        },
        s = { client: J(this, S), meta: this.options.meta, mutationKey: this.options.mutationKey };
      z(
        this,
        O,
        _n({
          fn: () =>
            this.options.mutationFn
              ? this.options.mutationFn(e, s)
              : Promise.reject(new Error('No mutationFn found')),
          onFail: (e, t) => {
            Q(this, R, A).call(this, { type: 'failed', failureCount: e, error: t });
          },
          onPause: () => {
            Q(this, R, A).call(this, { type: 'pause' });
          },
          onContinue: t,
          retry: this.options.retry ?? 0,
          retryDelay: this.options.retryDelay,
          networkMode: this.options.networkMode,
          canRun: () => J(this, E).canRun(this),
        })
      );
      const r = 'pending' === this.state.status,
        n = !J(this, O).canStart();
      try {
        if (r) t();
        else {
          (Q(this, R, A).call(this, { type: 'pending', variables: e, isPaused: n }),
            J(this, E).config.onMutate && (await J(this, E).config.onMutate(e, this, s)));
          const t = await this.options.onMutate?.(e, s);
          t !== this.state.context &&
            Q(this, R, A).call(this, { type: 'pending', context: t, variables: e, isPaused: n });
        }
        const i = await J(this, O).start();
        return (
          await J(this, E).config.onSuccess?.(i, e, this.state.context, this, s),
          await this.options.onSuccess?.(i, e, this.state.context, s),
          await J(this, E).config.onSettled?.(
            i,
            null,
            this.state.variables,
            this.state.context,
            this,
            s
          ),
          await this.options.onSettled?.(i, null, e, this.state.context, s),
          Q(this, R, A).call(this, { type: 'success', data: i }),
          i
        );
      } catch (i) {
        try {
          await J(this, E).config.onError?.(i, e, this.state.context, this, s);
        } catch (a) {
          Promise.reject(a);
        }
        try {
          await this.options.onError?.(i, e, this.state.context, s);
        } catch (a) {
          Promise.reject(a);
        }
        try {
          await J(this, E).config.onSettled?.(
            void 0,
            i,
            this.state.variables,
            this.state.context,
            this,
            s
          );
        } catch (a) {
          Promise.reject(a);
        }
        try {
          await this.options.onSettled?.(void 0, i, e, this.state.context, s);
        } catch (a) {
          Promise.reject(a);
        }
        throw (Q(this, R, A).call(this, { type: 'error', error: i }), i);
      } finally {
        J(this, E).runNext(this);
      }
    }
  }),
  (S = new WeakMap()),
  (T = new WeakMap()),
  (E = new WeakMap()),
  (O = new WeakMap()),
  (R = new WeakSet()),
  (A = function (e) {
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
      yn.batch(() => {
        (J(this, T).forEach(t => {
          t.onMutationUpdate(e);
        }),
          J(this, E).notify({ mutation: this, type: 'updated', action: e }));
      }));
  }),
  P);
var jn =
  ((C = class extends Gr {
    constructor(e = {}) {
      (super(),
        V(this, j),
        V(this, I),
        V(this, $),
        (this.config = e),
        z(this, j, new Set()),
        z(this, I, new Map()),
        z(this, $, 0));
    }
    build(e, t, s) {
      const r = new Pn({
        client: e,
        mutationCache: this,
        mutationId: ++Y(this, $)._,
        options: e.defaultMutationOptions(t),
        state: s,
      });
      return (this.add(r), r);
    }
    add(e) {
      J(this, j).add(e);
      const t = In(e);
      if ('string' == typeof t) {
        const s = J(this, I).get(t);
        s ? s.push(e) : J(this, I).set(t, [e]);
      }
      this.notify({ type: 'added', mutation: e });
    }
    remove(e) {
      if (J(this, j).delete(e)) {
        const t = In(e);
        if ('string' == typeof t) {
          const s = J(this, I).get(t);
          if (s)
            if (s.length > 1) {
              const t = s.indexOf(e);
              -1 !== t && s.splice(t, 1);
            } else s[0] === e && J(this, I).delete(t);
        }
      }
      this.notify({ type: 'removed', mutation: e });
    }
    canRun(e) {
      const t = In(e);
      if ('string' == typeof t) {
        const s = J(this, I).get(t),
          r = s?.find(e => 'pending' === e.state.status);
        return !r || r === e;
      }
      return !0;
    }
    runNext(e) {
      const t = In(e);
      if ('string' == typeof t) {
        const s = J(this, I)
          .get(t)
          ?.find(t => t !== e && t.state.isPaused);
        return s?.continue() ?? Promise.resolve();
      }
      return Promise.resolve();
    }
    clear() {
      yn.batch(() => {
        (J(this, j).forEach(e => {
          this.notify({ type: 'removed', mutation: e });
        }),
          J(this, j).clear(),
          J(this, I).clear());
      });
    }
    getAll() {
      return Array.from(J(this, j));
    }
    find(e) {
      const t = { exact: !0, ...e };
      return this.getAll().find(e => Zr(t, e));
    }
    findAll(e = {}) {
      return this.getAll().filter(t => Zr(e, t));
    }
    notify(e) {
      yn.batch(() => {
        this.listeners.forEach(t => {
          t(e);
        });
      });
    }
    resumePausedMutations() {
      const e = this.getAll().filter(e => e.state.isPaused);
      return yn.batch(() => Promise.all(e.map(e => e.continue().catch(Qr))));
    }
  }),
  (j = new WeakMap()),
  (I = new WeakMap()),
  ($ = new WeakMap()),
  C);
function In(e) {
  return e.options.scope?.id;
}
var $n =
    ((N = class extends Gr {
      constructor(e = {}) {
        (super(), V(this, x), (this.config = e), z(this, x, new Map()));
      }
      build(e, t, s) {
        const r = t.queryKey,
          n = t.queryHash ?? en(r, t);
        let i = this.get(n);
        return (
          i ||
            ((i = new Sn({
              client: e,
              queryKey: r,
              queryHash: n,
              options: e.defaultQueryOptions(t),
              state: s,
              defaultOptions: e.getQueryDefaults(r),
            })),
            this.add(i)),
          i
        );
      }
      add(e) {
        J(this, x).has(e.queryHash) ||
          (J(this, x).set(e.queryHash, e), this.notify({ type: 'added', query: e }));
      }
      remove(e) {
        const t = J(this, x).get(e.queryHash);
        t &&
          (e.destroy(),
          t === e && J(this, x).delete(e.queryHash),
          this.notify({ type: 'removed', query: e }));
      }
      clear() {
        yn.batch(() => {
          this.getAll().forEach(e => {
            this.remove(e);
          });
        });
      }
      get(e) {
        return J(this, x).get(e);
      }
      getAll() {
        return [...J(this, x).values()];
      }
      find(e) {
        const t = { exact: !0, ...e };
        return this.getAll().find(e => Xr(t, e));
      }
      findAll(e = {}) {
        const t = this.getAll();
        return Object.keys(e).length > 0 ? t.filter(t => Xr(e, t)) : t;
      }
      notify(e) {
        yn.batch(() => {
          this.listeners.forEach(t => {
            t(e);
          });
        });
      }
      onFocus() {
        yn.batch(() => {
          this.getAll().forEach(e => {
            e.onFocus();
          });
        });
      }
      onOnline() {
        yn.batch(() => {
          this.getAll().forEach(e => {
            e.onOnline();
          });
        });
      }
    }),
    (x = new WeakMap()),
    N),
  Cn =
    ((F = class {
      constructor(e = {}) {
        (V(this, U),
          V(this, D),
          V(this, q),
          V(this, L),
          V(this, B),
          V(this, M),
          V(this, K),
          V(this, W),
          z(this, U, e.queryCache || new $n()),
          z(this, D, e.mutationCache || new jn()),
          z(this, q, e.defaultOptions || {}),
          z(this, L, new Map()),
          z(this, B, new Map()),
          z(this, M, 0));
      }
      mount() {
        (Y(this, M)._++,
          1 === J(this, M) &&
            (z(
              this,
              K,
              fn.subscribe(async e => {
                e && (await this.resumePausedMutations(), J(this, U).onFocus());
              })
            ),
            z(
              this,
              W,
              mn.subscribe(async e => {
                e && (await this.resumePausedMutations(), J(this, U).onOnline());
              })
            )));
      }
      unmount() {
        var e, t;
        (Y(this, M)._--,
          0 === J(this, M) &&
            (null == (e = J(this, K)) || e.call(this),
            z(this, K, void 0),
            null == (t = J(this, W)) || t.call(this),
            z(this, W, void 0)));
      }
      isFetching(e) {
        return J(this, U).findAll({ ...e, fetchStatus: 'fetching' }).length;
      }
      isMutating(e) {
        return J(this, D).findAll({ ...e, status: 'pending' }).length;
      }
      getQueryData(e) {
        const t = this.defaultQueryOptions({ queryKey: e });
        return J(this, U).get(t.queryHash)?.state.data;
      }
      ensureQueryData(e) {
        const t = this.defaultQueryOptions(e),
          s = J(this, U).build(this, t),
          r = s.state.data;
        return void 0 === r
          ? this.fetchQuery(e)
          : (e.revalidateIfStale && s.isStaleByTime(Yr(t.staleTime, s)) && this.prefetchQuery(t),
            Promise.resolve(r));
      }
      getQueriesData(e) {
        return J(this, U)
          .findAll(e)
          .map(({ queryKey: e, state: t }) => [e, t.data]);
      }
      setQueryData(e, t, s) {
        const r = this.defaultQueryOptions({ queryKey: e }),
          n = J(this, U).get(r.queryHash),
          i = n?.state.data,
          a = (function (e, t) {
            return 'function' == typeof e ? e(t) : e;
          })(t, i);
        if (void 0 !== a)
          return J(this, U)
            .build(this, r)
            .setData(a, { ...s, manual: !0 });
      }
      setQueriesData(e, t, s) {
        return yn.batch(() =>
          J(this, U)
            .findAll(e)
            .map(({ queryKey: e }) => [e, this.setQueryData(e, t, s)])
        );
      }
      getQueryState(e) {
        const t = this.defaultQueryOptions({ queryKey: e });
        return J(this, U).get(t.queryHash)?.state;
      }
      removeQueries(e) {
        const t = J(this, U);
        yn.batch(() => {
          t.findAll(e).forEach(e => {
            t.remove(e);
          });
        });
      }
      resetQueries(e, t) {
        const s = J(this, U);
        return yn.batch(
          () => (
            s.findAll(e).forEach(e => {
              e.reset();
            }),
            this.refetchQueries({ type: 'active', ...e }, t)
          )
        );
      }
      cancelQueries(e, t = {}) {
        const s = { revert: !0, ...t },
          r = yn.batch(() =>
            J(this, U)
              .findAll(e)
              .map(e => e.cancel(s))
          );
        return Promise.all(r).then(Qr).catch(Qr);
      }
      invalidateQueries(e, t = {}) {
        return yn.batch(
          () => (
            J(this, U)
              .findAll(e)
              .forEach(e => {
                e.invalidate();
              }),
            'none' === e?.refetchType
              ? Promise.resolve()
              : this.refetchQueries({ ...e, type: e?.refetchType ?? e?.type ?? 'active' }, t)
          )
        );
      }
      refetchQueries(e, t = {}) {
        const s = { ...t, cancelRefetch: t.cancelRefetch ?? !0 },
          r = yn.batch(() =>
            J(this, U)
              .findAll(e)
              .filter(e => !e.isDisabled() && !e.isStatic())
              .map(e => {
                let t = e.fetch(void 0, s);
                return (
                  s.throwOnError || (t = t.catch(Qr)),
                  'paused' === e.state.fetchStatus ? Promise.resolve() : t
                );
              })
          );
        return Promise.all(r).then(Qr);
      }
      fetchQuery(e) {
        const t = this.defaultQueryOptions(e);
        void 0 === t.retry && (t.retry = !1);
        const s = J(this, U).build(this, t);
        return s.isStaleByTime(Yr(t.staleTime, s)) ? s.fetch(t) : Promise.resolve(s.state.data);
      }
      prefetchQuery(e) {
        return this.fetchQuery(e).then(Qr).catch(Qr);
      }
      fetchInfiniteQuery(e) {
        return ((e.behavior = On(e.pages)), this.fetchQuery(e));
      }
      prefetchInfiniteQuery(e) {
        return this.fetchInfiniteQuery(e).then(Qr).catch(Qr);
      }
      ensureInfiniteQueryData(e) {
        return ((e.behavior = On(e.pages)), this.ensureQueryData(e));
      }
      resumePausedMutations() {
        return mn.isOnline() ? J(this, D).resumePausedMutations() : Promise.resolve();
      }
      getQueryCache() {
        return J(this, U);
      }
      getMutationCache() {
        return J(this, D);
      }
      getDefaultOptions() {
        return J(this, q);
      }
      setDefaultOptions(e) {
        z(this, q, e);
      }
      setQueryDefaults(e, t) {
        J(this, L).set(tn(e), { queryKey: e, defaultOptions: t });
      }
      getQueryDefaults(e) {
        const t = [...J(this, L).values()],
          s = {};
        return (
          t.forEach(t => {
            sn(e, t.queryKey) && Object.assign(s, t.defaultOptions);
          }),
          s
        );
      }
      setMutationDefaults(e, t) {
        J(this, B).set(tn(e), { mutationKey: e, defaultOptions: t });
      }
      getMutationDefaults(e) {
        const t = [...J(this, B).values()],
          s = {};
        return (
          t.forEach(t => {
            sn(e, t.mutationKey) && Object.assign(s, t.defaultOptions);
          }),
          s
        );
      }
      defaultQueryOptions(e) {
        if (e._defaulted) return e;
        const t = {
          ...J(this, q).queries,
          ...this.getQueryDefaults(e.queryKey),
          ...e,
          _defaulted: !0,
        };
        return (
          t.queryHash || (t.queryHash = en(t.queryKey, t)),
          void 0 === t.refetchOnReconnect && (t.refetchOnReconnect = 'always' !== t.networkMode),
          void 0 === t.throwOnError && (t.throwOnError = !!t.suspense),
          !t.networkMode && t.persister && (t.networkMode = 'offlineFirst'),
          t.queryFn === dn && (t.enabled = !1),
          t
        );
      }
      defaultMutationOptions(e) {
        return e?._defaulted
          ? e
          : {
              ...J(this, q).mutations,
              ...(e?.mutationKey && this.getMutationDefaults(e.mutationKey)),
              ...e,
              _defaulted: !0,
            };
      }
      clear() {
        (J(this, U).clear(), J(this, D).clear());
      }
    }),
    (U = new WeakMap()),
    (D = new WeakMap()),
    (q = new WeakMap()),
    (L = new WeakMap()),
    (B = new WeakMap()),
    (M = new WeakMap()),
    (K = new WeakMap()),
    (W = new WeakMap()),
    F),
  xn = X.createContext(void 0),
  Nn = ({ client: e, children: t }) => (
    X.useEffect(
      () => (
        e.mount(),
        () => {
          e.unmount();
        }
      ),
      [e]
    ),
    Z.jsx(xn.Provider, { value: e, children: t })
  );
export { Cn as Q, Nn as a, Hr as c };
