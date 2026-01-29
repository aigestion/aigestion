import { c as client, j as jsxRuntimeExports } from "./three-CiiLx6p8.js";
import "./vendor-MmfpvJAE.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "red", fontSize: "30px", padding: "50px", background: "white", minHeight: "100vh" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "DEBUG MODE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Si lees esto, React funciona." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Timestamp: ",
      (/* @__PURE__ */ new Date()).toISOString()
    ] })
  ] })
);
