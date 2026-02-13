if (!self.define) {
  let e,
    s = {};
  const i = (i, n) => (
    (i = new URL(i + '.js', n).href),
    s[i] ||
      new Promise(s => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = i), (e.onload = s), document.head.appendChild(e));
        } else ((e = i), importScripts(i), s());
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, r) => {
    const t = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[t]) return;
    let c = {};
    const o = e => i(e, t),
      d = { module: { uri: t }, exports: c, require: o };
    s[t] = Promise.all(n.map(e => d[e] || o(e))).then(e => (r(...e), c));
  };
}
define(['./workbox-b20fbdff'], function (e) {
  'use strict';
  (self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: 'registerSW.js', revision: '1872c500de691dce40960bb85481de07' },
        { url: 'index.html', revision: 'dcf8e00c303e5a6a3420f36bcc33caaa' },
        { url: 'assets/index-DcgrITQB.js', revision: null },
        { url: 'assets/index-D5OdD4dw.css', revision: null },
        { url: 'manifest.webmanifest', revision: '3909c9cc833aa6411d39f29229c3d6c8' },
      ],
      {}
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL('index.html'))));
});
