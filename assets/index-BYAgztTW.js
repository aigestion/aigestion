var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _provider, _providerCalled, _a, _focused, _cleanup, _setup, _b, _online, _cleanup2, _setup2, _c, _gcTimeout, _d, _initialState, _revertState, _cache, _client, _retryer, _defaultOptions, _abortSignalConsumed, _Query_instances, dispatch_fn, _e, _client2, _observers, _mutationCache, _retryer2, _Mutation_instances, dispatch_fn2, _f, _mutations, _scopes, _mutationId, _g, _queries, _h, _queryCache, _mutationCache2, _defaultOptions2, _queryDefaults, _mutationDefaults, _mountCount, _unsubscribeFocus, _unsubscribeOnline, _i;
import { j as jsxRuntimeExports, c as client } from "./three-DMhNvM7d.js";
import { r as reactExports, R as React, c as commonjsGlobal, b as React$1 } from "./vendor-BeDY2M0C.js";
import { m as motion, A as AnimatePresence, u as useMotionValue, a as useSpring, b as useScroll, c as useTransform, d as useMotionTemplate } from "./framer-TOZY-Io2.js";
import { L as Lock, C as ChevronRight, X, M as Menu, S as Scan, a as SquareDashed, B as Box, I as Info, b as Maximize2, R as Radio, c as Battery, d as Cpu, P as PanelsTopLeft, Z as Zap, e as Monitor, f as ShieldCheck, F as FingerprintPattern, g as ScanLine, h as LayoutDashboard, i as Search, j as Bot, k as FolderGit2, l as Settings, m as Sparkles, n as Mic, o as Send, p as CircleStop, U as User, q as Shield, r as Brain, s as ChartColumn, t as LogOut, u as MessageSquare, T as TrendingUp, G as GitBranch, v as CircleCheck, A as Activity, W as Wifi, w as Bell, x as CircleX, y as TriangleAlert, z as CircleCheckBig, D as Mail, E as EyeOff, H as Eye, J as CircleAlert, K as Users, N as Camera, O as ArrowRight, Q as LoaderCircle } from "./lucide-BiBEXhC1.js";
import "@google/model-viewer";
import { c as createClient } from "./supabase-9RWb9FSD.js";
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
/**
 * @remix-run/router v1.23.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window2, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window2.location;
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$2({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window2.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends$2({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  return matchRoutesImpl(routes, locationArg, basename);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i], decoded);
  }
  return matches;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    let route = meta.route;
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
const ABSOLUTE_URL_REGEX$1 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX$1.test(url);
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    if (isAbsoluteUrl(toPathname)) {
      pathname = toPathname;
    } else {
      if (toPathname.includes("//")) {
        let oldPathname = toPathname;
        toPathname = toPathname.replace(/\/\/+/g, "/");
        warning(false, "Pathnames cannot have embedded double slashes - normalizing " + (oldPathname + " -> " + toPathname));
      }
      if (toPathname.startsWith("/")) {
        pathname = resolvePathname(toPathname.substring(1), "/");
      } else {
        pathname = resolvePathname(toPathname, fromPathname);
      }
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map((match) => match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends$2({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);
/**
 * React Router v6.30.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
const DataRouterContext = /* @__PURE__ */ reactExports.createContext(null);
const DataRouterStateContext = /* @__PURE__ */ reactExports.createContext(null);
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
const RouteContext = /* @__PURE__ */ reactExports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
const RouteErrorContext = /* @__PURE__ */ reactExports.createContext(null);
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator
  } = reactExports.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return reactExports.useContext(LocationContext).location;
}
function useIsomorphicLayoutEffect(cb) {
  let isStatic = reactExports.useContext(NavigationContext).static;
  if (!isStatic) {
    reactExports.useLayoutEffect(cb);
  }
}
function useNavigate() {
  let {
    isDataRoute
  } = reactExports.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
  }, [basename, navigator, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  return reactExports.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator
  } = reactExports.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = reactExports.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterState, future);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ reactExports.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /* @__PURE__ */ reactExports.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /* @__PURE__ */ reactExports.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ reactExports.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _future;
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m) => m.route.id && (errors == null ? void 0 : errors[m.route.id]) !== void 0);
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors: errors2
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce("route-fallback");
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ reactExports.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ reactExports.createElement(RenderedRoute, {
        match,
        routeContext: {
          outlet,
          matches: matches2,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ reactExports.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches2,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /* @__PURE__ */ function(DataRouterHook2) {
  DataRouterHook2["UseBlocker"] = "useBlocker";
  DataRouterHook2["UseRevalidator"] = "useRevalidator";
  DataRouterHook2["UseNavigateStable"] = "useNavigate";
  return DataRouterHook2;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /* @__PURE__ */ function(DataRouterStateHook2) {
  DataRouterStateHook2["UseBlocker"] = "useBlocker";
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook2["UseRouteId"] = "useRouteId";
  return DataRouterStateHook2;
}(DataRouterStateHook$1 || {});
function useDataRouterContext(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = reactExports.useContext(DataRouterStateContext);
  !state ? invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = reactExports.useContext(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteError() {
  var _state$errors;
  let error = reactExports.useContext(RouteErrorContext);
  let state = useDataRouterState();
  let routeId = useCurrentRouteId();
  if (error !== void 0) {
    return error;
  }
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext(DataRouterHook$1.UseNavigateStable);
  let id = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id
      }, options));
    }
  }, [router, id]);
  return navigate;
}
const alreadyWarned$1 = {};
function warningOnce(key, cond, message) {
  if (!alreadyWarned$1[key]) {
    alreadyWarned$1[key] = true;
  }
}
function logV6DeprecationWarnings(renderFuture, routerFuture) {
  if ((renderFuture == null ? void 0 : renderFuture.v7_startTransition) === void 0) ;
  if ((renderFuture == null ? void 0 : renderFuture.v7_relativeSplatPath) === void 0 && true) ;
}
function Navigate(_ref4) {
  let {
    to,
    replace: replace2,
    state,
    relative
  } = _ref4;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    future,
    static: isStatic
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let navigate = useNavigate();
  let path = resolveTo(to, getResolveToMatches(matches, future.v7_relativeSplatPath), locationPathname, relative === "path");
  let jsonPath = JSON.stringify(path);
  reactExports.useEffect(() => navigate(JSON.parse(jsonPath), {
    replace: replace2,
    state,
    relative
  }), [navigate, jsonPath, relative, replace2, state]);
  return null;
}
function Route(_props) {
  invariant(false);
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator,
    static: staticProp,
    future: _extends$1({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
new Promise(() => {
});
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  reactExports.Children.forEach(children, (element, index) => {
    if (!/* @__PURE__ */ reactExports.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === reactExports.Fragment) {
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ? invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}
/**
 * React Router DOM v6.30.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"];
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
const START_TRANSITION = "startTransition";
const startTransitionImpl = React[START_TRANSITION];
function BrowserRouter(_ref4) {
  let {
    basename,
    children,
    future,
    window: window2
  } = _ref4;
  let historyRef = reactExports.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({
      window: window2,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = reactExports.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = reactExports.useCallback((newState) => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  reactExports.useLayoutEffect(() => history.listen(setState), [history, setState]);
  reactExports.useEffect(() => logV6DeprecationWarnings(future), [future]);
  return /* @__PURE__ */ reactExports.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future
  });
}
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const Link = /* @__PURE__ */ reactExports.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace: replace2,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition
  } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = reactExports.useContext(NavigationContext);
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    absoluteHref = to;
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
      }
    }
  }
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace: replace2,
    state,
    target,
    preventScrollReset,
    relative,
    viewTransition
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ reactExports.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target
    }))
  );
});
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return reactExports.useCallback((event) => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace: replace2,
        state,
        preventScrollReset,
        relative,
        viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, viewTransition]);
}
const AnimatedMeshGradient = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 -z-50 overflow-hidden pointer-events-none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: {
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
          x: [0, 100, 0],
          y: [0, -50, 0]
        },
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        },
        className: "absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-nexus-violet/5 blur-[120px] rounded-full"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: {
          scale: [1.2, 1, 1.2],
          rotate: [0, -30, 0],
          x: [0, -100, 0],
          y: [0, 50, 0]
        },
        transition: {
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        },
        className: "absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-nexus-cyan/5 blur-[100px] rounded-full"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-nexus-obsidian/40 backdrop-blur-[20px]" })
  ] });
};
var howler = {};
/*!
 *  howler.js v2.2.4
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */
(function(exports$1) {
  (function() {
    var HowlerGlobal2 = function() {
      this.init();
    };
    HowlerGlobal2.prototype = {
      /**
       * Initialize the global Howler object.
       * @return {Howler}
       */
      init: function() {
        var self = this || Howler2;
        self._counter = 1e3;
        self._html5AudioPool = [];
        self.html5PoolSize = 10;
        self._codecs = {};
        self._howls = [];
        self._muted = false;
        self._volume = 1;
        self._canPlayEvent = "canplaythrough";
        self._navigator = typeof window !== "undefined" && window.navigator ? window.navigator : null;
        self.masterGain = null;
        self.noAudio = false;
        self.usingWebAudio = true;
        self.autoSuspend = true;
        self.ctx = null;
        self.autoUnlock = true;
        self._setup();
        return self;
      },
      /**
       * Get/set the global volume for all sounds.
       * @param  {Float} vol Volume from 0.0 to 1.0.
       * @return {Howler/Float}     Returns self or current volume.
       */
      volume: function(vol) {
        var self = this || Howler2;
        vol = parseFloat(vol);
        if (!self.ctx) {
          setupAudioContext();
        }
        if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
          self._volume = vol;
          if (self._muted) {
            return self;
          }
          if (self.usingWebAudio) {
            self.masterGain.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
          }
          for (var i = 0; i < self._howls.length; i++) {
            if (!self._howls[i]._webAudio) {
              var ids = self._howls[i]._getSoundIds();
              for (var j = 0; j < ids.length; j++) {
                var sound = self._howls[i]._soundById(ids[j]);
                if (sound && sound._node) {
                  sound._node.volume = sound._volume * vol;
                }
              }
            }
          }
          return self;
        }
        return self._volume;
      },
      /**
       * Handle muting and unmuting globally.
       * @param  {Boolean} muted Is muted or not.
       */
      mute: function(muted) {
        var self = this || Howler2;
        if (!self.ctx) {
          setupAudioContext();
        }
        self._muted = muted;
        if (self.usingWebAudio) {
          self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler2.ctx.currentTime);
        }
        for (var i = 0; i < self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            var ids = self._howls[i]._getSoundIds();
            for (var j = 0; j < ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);
              if (sound && sound._node) {
                sound._node.muted = muted ? true : sound._muted;
              }
            }
          }
        }
        return self;
      },
      /**
       * Handle stopping all sounds globally.
       */
      stop: function() {
        var self = this || Howler2;
        for (var i = 0; i < self._howls.length; i++) {
          self._howls[i].stop();
        }
        return self;
      },
      /**
       * Unload and destroy all currently loaded Howl objects.
       * @return {Howler}
       */
      unload: function() {
        var self = this || Howler2;
        for (var i = self._howls.length - 1; i >= 0; i--) {
          self._howls[i].unload();
        }
        if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== "undefined") {
          self.ctx.close();
          self.ctx = null;
          setupAudioContext();
        }
        return self;
      },
      /**
       * Check for codec support of specific extension.
       * @param  {String} ext Audio file extention.
       * @return {Boolean}
       */
      codecs: function(ext) {
        return (this || Howler2)._codecs[ext.replace(/^x-/, "")];
      },
      /**
       * Setup various state values for global tracking.
       * @return {Howler}
       */
      _setup: function() {
        var self = this || Howler2;
        self.state = self.ctx ? self.ctx.state || "suspended" : "suspended";
        self._autoSuspend();
        if (!self.usingWebAudio) {
          if (typeof Audio !== "undefined") {
            try {
              var test = new Audio();
              if (typeof test.oncanplaythrough === "undefined") {
                self._canPlayEvent = "canplay";
              }
            } catch (e) {
              self.noAudio = true;
            }
          } else {
            self.noAudio = true;
          }
        }
        try {
          var test = new Audio();
          if (test.muted) {
            self.noAudio = true;
          }
        } catch (e) {
        }
        if (!self.noAudio) {
          self._setupCodecs();
        }
        return self;
      },
      /**
       * Check for browser support for various codecs and cache the results.
       * @return {Howler}
       */
      _setupCodecs: function() {
        var self = this || Howler2;
        var audioTest = null;
        try {
          audioTest = typeof Audio !== "undefined" ? new Audio() : null;
        } catch (err) {
          return self;
        }
        if (!audioTest || typeof audioTest.canPlayType !== "function") {
          return self;
        }
        var mpegTest = audioTest.canPlayType("audio/mpeg;").replace(/^no$/, "");
        var ua = self._navigator ? self._navigator.userAgent : "";
        var checkOpera = ua.match(/OPR\/(\d+)/g);
        var isOldOpera = checkOpera && parseInt(checkOpera[0].split("/")[1], 10) < 33;
        var checkSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
        var safariVersion = ua.match(/Version\/(.*?) /);
        var isOldSafari = checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15;
        self._codecs = {
          mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType("audio/mp3;").replace(/^no$/, ""))),
          mpeg: !!mpegTest,
          opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
          ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
          oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
          wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType("audio/wav")).replace(/^no$/, ""),
          aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
          caf: !!audioTest.canPlayType("audio/x-caf;").replace(/^no$/, ""),
          m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
          m4b: !!(audioTest.canPlayType("audio/x-m4b;") || audioTest.canPlayType("audio/m4b;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
          mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
          weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
          webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
          dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
          flac: !!(audioTest.canPlayType("audio/x-flac;") || audioTest.canPlayType("audio/flac;")).replace(/^no$/, "")
        };
        return self;
      },
      /**
       * Some browsers/devices will only allow audio to be played after a user interaction.
       * Attempt to automatically unlock audio on the first user interaction.
       * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
       * @return {Howler}
       */
      _unlockAudio: function() {
        var self = this || Howler2;
        if (self._audioUnlocked || !self.ctx) {
          return;
        }
        self._audioUnlocked = false;
        self.autoUnlock = false;
        if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
          self._mobileUnloaded = true;
          self.unload();
        }
        self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);
        var unlock = function(e) {
          while (self._html5AudioPool.length < self.html5PoolSize) {
            try {
              var audioNode = new Audio();
              audioNode._unlocked = true;
              self._releaseHtml5Audio(audioNode);
            } catch (e2) {
              self.noAudio = true;
              break;
            }
          }
          for (var i = 0; i < self._howls.length; i++) {
            if (!self._howls[i]._webAudio) {
              var ids = self._howls[i]._getSoundIds();
              for (var j = 0; j < ids.length; j++) {
                var sound = self._howls[i]._soundById(ids[j]);
                if (sound && sound._node && !sound._node._unlocked) {
                  sound._node._unlocked = true;
                  sound._node.load();
                }
              }
            }
          }
          self._autoResume();
          var source = self.ctx.createBufferSource();
          source.buffer = self._scratchBuffer;
          source.connect(self.ctx.destination);
          if (typeof source.start === "undefined") {
            source.noteOn(0);
          } else {
            source.start(0);
          }
          if (typeof self.ctx.resume === "function") {
            self.ctx.resume();
          }
          source.onended = function() {
            source.disconnect(0);
            self._audioUnlocked = true;
            document.removeEventListener("touchstart", unlock, true);
            document.removeEventListener("touchend", unlock, true);
            document.removeEventListener("click", unlock, true);
            document.removeEventListener("keydown", unlock, true);
            for (var i2 = 0; i2 < self._howls.length; i2++) {
              self._howls[i2]._emit("unlock");
            }
          };
        };
        document.addEventListener("touchstart", unlock, true);
        document.addEventListener("touchend", unlock, true);
        document.addEventListener("click", unlock, true);
        document.addEventListener("keydown", unlock, true);
        return self;
      },
      /**
       * Get an unlocked HTML5 Audio object from the pool. If none are left,
       * return a new Audio object and throw a warning.
       * @return {Audio} HTML5 Audio object.
       */
      _obtainHtml5Audio: function() {
        var self = this || Howler2;
        if (self._html5AudioPool.length) {
          return self._html5AudioPool.pop();
        }
        var testPlay = new Audio().play();
        if (testPlay && typeof Promise !== "undefined" && (testPlay instanceof Promise || typeof testPlay.then === "function")) {
          testPlay.catch(function() {
            console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
          });
        }
        return new Audio();
      },
      /**
       * Return an activated HTML5 Audio object to the pool.
       * @return {Howler}
       */
      _releaseHtml5Audio: function(audio) {
        var self = this || Howler2;
        if (audio._unlocked) {
          self._html5AudioPool.push(audio);
        }
        return self;
      },
      /**
       * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
       * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
       * @return {Howler}
       */
      _autoSuspend: function() {
        var self = this;
        if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === "undefined" || !Howler2.usingWebAudio) {
          return;
        }
        for (var i = 0; i < self._howls.length; i++) {
          if (self._howls[i]._webAudio) {
            for (var j = 0; j < self._howls[i]._sounds.length; j++) {
              if (!self._howls[i]._sounds[j]._paused) {
                return self;
              }
            }
          }
        }
        if (self._suspendTimer) {
          clearTimeout(self._suspendTimer);
        }
        self._suspendTimer = setTimeout(function() {
          if (!self.autoSuspend) {
            return;
          }
          self._suspendTimer = null;
          self.state = "suspending";
          var handleSuspension = function() {
            self.state = "suspended";
            if (self._resumeAfterSuspend) {
              delete self._resumeAfterSuspend;
              self._autoResume();
            }
          };
          self.ctx.suspend().then(handleSuspension, handleSuspension);
        }, 3e4);
        return self;
      },
      /**
       * Automatically resume the Web Audio AudioContext when a new sound is played.
       * @return {Howler}
       */
      _autoResume: function() {
        var self = this;
        if (!self.ctx || typeof self.ctx.resume === "undefined" || !Howler2.usingWebAudio) {
          return;
        }
        if (self.state === "running" && self.ctx.state !== "interrupted" && self._suspendTimer) {
          clearTimeout(self._suspendTimer);
          self._suspendTimer = null;
        } else if (self.state === "suspended" || self.state === "running" && self.ctx.state === "interrupted") {
          self.ctx.resume().then(function() {
            self.state = "running";
            for (var i = 0; i < self._howls.length; i++) {
              self._howls[i]._emit("resume");
            }
          });
          if (self._suspendTimer) {
            clearTimeout(self._suspendTimer);
            self._suspendTimer = null;
          }
        } else if (self.state === "suspending") {
          self._resumeAfterSuspend = true;
        }
        return self;
      }
    };
    var Howler2 = new HowlerGlobal2();
    var Howl2 = function(o) {
      var self = this;
      if (!o.src || o.src.length === 0) {
        console.error("An array of source files must be passed with any new Howl.");
        return;
      }
      self.init(o);
    };
    Howl2.prototype = {
      /**
       * Initialize a new Howl group object.
       * @param  {Object} o Passed in properties for this group.
       * @return {Howl}
       */
      init: function(o) {
        var self = this;
        if (!Howler2.ctx) {
          setupAudioContext();
        }
        self._autoplay = o.autoplay || false;
        self._format = typeof o.format !== "string" ? o.format : [o.format];
        self._html5 = o.html5 || false;
        self._muted = o.mute || false;
        self._loop = o.loop || false;
        self._pool = o.pool || 5;
        self._preload = typeof o.preload === "boolean" || o.preload === "metadata" ? o.preload : true;
        self._rate = o.rate || 1;
        self._sprite = o.sprite || {};
        self._src = typeof o.src !== "string" ? o.src : [o.src];
        self._volume = o.volume !== void 0 ? o.volume : 1;
        self._xhr = {
          method: o.xhr && o.xhr.method ? o.xhr.method : "GET",
          headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
          withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false
        };
        self._duration = 0;
        self._state = "unloaded";
        self._sounds = [];
        self._endTimers = {};
        self._queue = [];
        self._playLock = false;
        self._onend = o.onend ? [{ fn: o.onend }] : [];
        self._onfade = o.onfade ? [{ fn: o.onfade }] : [];
        self._onload = o.onload ? [{ fn: o.onload }] : [];
        self._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
        self._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
        self._onpause = o.onpause ? [{ fn: o.onpause }] : [];
        self._onplay = o.onplay ? [{ fn: o.onplay }] : [];
        self._onstop = o.onstop ? [{ fn: o.onstop }] : [];
        self._onmute = o.onmute ? [{ fn: o.onmute }] : [];
        self._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
        self._onrate = o.onrate ? [{ fn: o.onrate }] : [];
        self._onseek = o.onseek ? [{ fn: o.onseek }] : [];
        self._onunlock = o.onunlock ? [{ fn: o.onunlock }] : [];
        self._onresume = [];
        self._webAudio = Howler2.usingWebAudio && !self._html5;
        if (typeof Howler2.ctx !== "undefined" && Howler2.ctx && Howler2.autoUnlock) {
          Howler2._unlockAudio();
        }
        Howler2._howls.push(self);
        if (self._autoplay) {
          self._queue.push({
            event: "play",
            action: function() {
              self.play();
            }
          });
        }
        if (self._preload && self._preload !== "none") {
          self.load();
        }
        return self;
      },
      /**
       * Load the audio file.
       * @return {Howler}
       */
      load: function() {
        var self = this;
        var url = null;
        if (Howler2.noAudio) {
          self._emit("loaderror", null, "No audio support.");
          return;
        }
        if (typeof self._src === "string") {
          self._src = [self._src];
        }
        for (var i = 0; i < self._src.length; i++) {
          var ext, str;
          if (self._format && self._format[i]) {
            ext = self._format[i];
          } else {
            str = self._src[i];
            if (typeof str !== "string") {
              self._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
              continue;
            }
            ext = /^data:audio\/([^;,]+);/i.exec(str);
            if (!ext) {
              ext = /\.([^.]+)$/.exec(str.split("?", 1)[0]);
            }
            if (ext) {
              ext = ext[1].toLowerCase();
            }
          }
          if (!ext) {
            console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
          }
          if (ext && Howler2.codecs(ext)) {
            url = self._src[i];
            break;
          }
        }
        if (!url) {
          self._emit("loaderror", null, "No codec support for selected audio sources.");
          return;
        }
        self._src = url;
        self._state = "loading";
        if (window.location.protocol === "https:" && url.slice(0, 5) === "http:") {
          self._html5 = true;
          self._webAudio = false;
        }
        new Sound2(self);
        if (self._webAudio) {
          loadBuffer(self);
        }
        return self;
      },
      /**
       * Play a sound or resume previous playback.
       * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
       * @param  {Boolean} internal Internal Use: true prevents event firing.
       * @return {Number}          Sound ID.
       */
      play: function(sprite, internal) {
        var self = this;
        var id = null;
        if (typeof sprite === "number") {
          id = sprite;
          sprite = null;
        } else if (typeof sprite === "string" && self._state === "loaded" && !self._sprite[sprite]) {
          return null;
        } else if (typeof sprite === "undefined") {
          sprite = "__default";
          if (!self._playLock) {
            var num = 0;
            for (var i = 0; i < self._sounds.length; i++) {
              if (self._sounds[i]._paused && !self._sounds[i]._ended) {
                num++;
                id = self._sounds[i]._id;
              }
            }
            if (num === 1) {
              sprite = null;
            } else {
              id = null;
            }
          }
        }
        var sound = id ? self._soundById(id) : self._inactiveSound();
        if (!sound) {
          return null;
        }
        if (id && !sprite) {
          sprite = sound._sprite || "__default";
        }
        if (self._state !== "loaded") {
          sound._sprite = sprite;
          sound._ended = false;
          var soundId = sound._id;
          self._queue.push({
            event: "play",
            action: function() {
              self.play(soundId);
            }
          });
          return soundId;
        }
        if (id && !sound._paused) {
          if (!internal) {
            self._loadQueue("play");
          }
          return sound._id;
        }
        if (self._webAudio) {
          Howler2._autoResume();
        }
        var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1e3);
        var duration = Math.max(0, (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3 - seek);
        var timeout = duration * 1e3 / Math.abs(sound._rate);
        var start = self._sprite[sprite][0] / 1e3;
        var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3;
        sound._sprite = sprite;
        sound._ended = false;
        var setParams = function() {
          sound._paused = false;
          sound._seek = seek;
          sound._start = start;
          sound._stop = stop;
          sound._loop = !!(sound._loop || self._sprite[sprite][2]);
        };
        if (seek >= stop) {
          self._ended(sound);
          return;
        }
        var node = sound._node;
        if (self._webAudio) {
          var playWebAudio = function() {
            self._playLock = false;
            setParams();
            self._refreshBuffer(sound);
            var vol = sound._muted || self._muted ? 0 : sound._volume;
            node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
            sound._playStart = Howler2.ctx.currentTime;
            if (typeof node.bufferSource.start === "undefined") {
              sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
            } else {
              sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
            }
            if (timeout !== Infinity) {
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            }
            if (!internal) {
              setTimeout(function() {
                self._emit("play", sound._id);
                self._loadQueue();
              }, 0);
            }
          };
          if (Howler2.state === "running" && Howler2.ctx.state !== "interrupted") {
            playWebAudio();
          } else {
            self._playLock = true;
            self.once("resume", playWebAudio);
            self._clearTimer(sound._id);
          }
        } else {
          var playHtml5 = function() {
            node.currentTime = seek;
            node.muted = sound._muted || self._muted || Howler2._muted || node.muted;
            node.volume = sound._volume * Howler2.volume();
            node.playbackRate = sound._rate;
            try {
              var play = node.play();
              if (play && typeof Promise !== "undefined" && (play instanceof Promise || typeof play.then === "function")) {
                self._playLock = true;
                setParams();
                play.then(function() {
                  self._playLock = false;
                  node._unlocked = true;
                  if (!internal) {
                    self._emit("play", sound._id);
                  } else {
                    self._loadQueue();
                  }
                }).catch(function() {
                  self._playLock = false;
                  self._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                  sound._ended = true;
                  sound._paused = true;
                });
              } else if (!internal) {
                self._playLock = false;
                setParams();
                self._emit("play", sound._id);
              }
              node.playbackRate = sound._rate;
              if (node.paused) {
                self._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                return;
              }
              if (sprite !== "__default" || sound._loop) {
                self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
              } else {
                self._endTimers[sound._id] = function() {
                  self._ended(sound);
                  node.removeEventListener("ended", self._endTimers[sound._id], false);
                };
                node.addEventListener("ended", self._endTimers[sound._id], false);
              }
            } catch (err) {
              self._emit("playerror", sound._id, err);
            }
          };
          if (node.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA") {
            node.src = self._src;
            node.load();
          }
          var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler2._navigator.isCocoonJS;
          if (node.readyState >= 3 || loadedNoReadyState) {
            playHtml5();
          } else {
            self._playLock = true;
            self._state = "loading";
            var listener = function() {
              self._state = "loaded";
              playHtml5();
              node.removeEventListener(Howler2._canPlayEvent, listener, false);
            };
            node.addEventListener(Howler2._canPlayEvent, listener, false);
            self._clearTimer(sound._id);
          }
        }
        return sound._id;
      },
      /**
       * Pause playback and save current position.
       * @param  {Number} id The sound ID (empty to pause all in group).
       * @return {Howl}
       */
      pause: function(id) {
        var self = this;
        if (self._state !== "loaded" || self._playLock) {
          self._queue.push({
            event: "pause",
            action: function() {
              self.pause(id);
            }
          });
          return self;
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          self._clearTimer(ids[i]);
          var sound = self._soundById(ids[i]);
          if (sound && !sound._paused) {
            sound._seek = self.seek(ids[i]);
            sound._rateSeek = 0;
            sound._paused = true;
            self._stopFade(ids[i]);
            if (sound._node) {
              if (self._webAudio) {
                if (!sound._node.bufferSource) {
                  continue;
                }
                if (typeof sound._node.bufferSource.stop === "undefined") {
                  sound._node.bufferSource.noteOff(0);
                } else {
                  sound._node.bufferSource.stop(0);
                }
                self._cleanBuffer(sound._node);
              } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                sound._node.pause();
              }
            }
          }
          if (!arguments[1]) {
            self._emit("pause", sound ? sound._id : null);
          }
        }
        return self;
      },
      /**
       * Stop playback and reset to start.
       * @param  {Number} id The sound ID (empty to stop all in group).
       * @param  {Boolean} internal Internal Use: true prevents event firing.
       * @return {Howl}
       */
      stop: function(id, internal) {
        var self = this;
        if (self._state !== "loaded" || self._playLock) {
          self._queue.push({
            event: "stop",
            action: function() {
              self.stop(id);
            }
          });
          return self;
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          self._clearTimer(ids[i]);
          var sound = self._soundById(ids[i]);
          if (sound) {
            sound._seek = sound._start || 0;
            sound._rateSeek = 0;
            sound._paused = true;
            sound._ended = true;
            self._stopFade(ids[i]);
            if (sound._node) {
              if (self._webAudio) {
                if (sound._node.bufferSource) {
                  if (typeof sound._node.bufferSource.stop === "undefined") {
                    sound._node.bufferSource.noteOff(0);
                  } else {
                    sound._node.bufferSource.stop(0);
                  }
                  self._cleanBuffer(sound._node);
                }
              } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                sound._node.currentTime = sound._start || 0;
                sound._node.pause();
                if (sound._node.duration === Infinity) {
                  self._clearSound(sound._node);
                }
              }
            }
            if (!internal) {
              self._emit("stop", sound._id);
            }
          }
        }
        return self;
      },
      /**
       * Mute/unmute a single sound or all sounds in this Howl group.
       * @param  {Boolean} muted Set to true to mute and false to unmute.
       * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
       * @return {Howl}
       */
      mute: function(muted, id) {
        var self = this;
        if (self._state !== "loaded" || self._playLock) {
          self._queue.push({
            event: "mute",
            action: function() {
              self.mute(muted, id);
            }
          });
          return self;
        }
        if (typeof id === "undefined") {
          if (typeof muted === "boolean") {
            self._muted = muted;
          } else {
            return self._muted;
          }
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self._soundById(ids[i]);
          if (sound) {
            sound._muted = muted;
            if (sound._interval) {
              self._stopFade(sound._id);
            }
            if (self._webAudio && sound._node) {
              sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler2.ctx.currentTime);
            } else if (sound._node) {
              sound._node.muted = Howler2._muted ? true : muted;
            }
            self._emit("mute", sound._id);
          }
        }
        return self;
      },
      /**
       * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
       *   volume() -> Returns the group's volume value.
       *   volume(id) -> Returns the sound id's current volume.
       *   volume(vol) -> Sets the volume of all sounds in this Howl group.
       *   volume(vol, id) -> Sets the volume of passed sound id.
       * @return {Howl/Number} Returns self or current volume.
       */
      volume: function() {
        var self = this;
        var args = arguments;
        var vol, id;
        if (args.length === 0) {
          return self._volume;
        } else if (args.length === 1 || args.length === 2 && typeof args[1] === "undefined") {
          var ids = self._getSoundIds();
          var index = ids.indexOf(args[0]);
          if (index >= 0) {
            id = parseInt(args[0], 10);
          } else {
            vol = parseFloat(args[0]);
          }
        } else if (args.length >= 2) {
          vol = parseFloat(args[0]);
          id = parseInt(args[1], 10);
        }
        var sound;
        if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
          if (self._state !== "loaded" || self._playLock) {
            self._queue.push({
              event: "volume",
              action: function() {
                self.volume.apply(self, args);
              }
            });
            return self;
          }
          if (typeof id === "undefined") {
            self._volume = vol;
          }
          id = self._getSoundIds(id);
          for (var i = 0; i < id.length; i++) {
            sound = self._soundById(id[i]);
            if (sound) {
              sound._volume = vol;
              if (!args[2]) {
                self._stopFade(id[i]);
              }
              if (self._webAudio && sound._node && !sound._muted) {
                sound._node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
              } else if (sound._node && !sound._muted) {
                sound._node.volume = vol * Howler2.volume();
              }
              self._emit("volume", sound._id);
            }
          }
        } else {
          sound = id ? self._soundById(id) : self._sounds[0];
          return sound ? sound._volume : 0;
        }
        return self;
      },
      /**
       * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
       * @param  {Number} from The value to fade from (0.0 to 1.0).
       * @param  {Number} to   The volume to fade to (0.0 to 1.0).
       * @param  {Number} len  Time in milliseconds to fade.
       * @param  {Number} id   The sound id (omit to fade all sounds).
       * @return {Howl}
       */
      fade: function(from, to, len, id) {
        var self = this;
        if (self._state !== "loaded" || self._playLock) {
          self._queue.push({
            event: "fade",
            action: function() {
              self.fade(from, to, len, id);
            }
          });
          return self;
        }
        from = Math.min(Math.max(0, parseFloat(from)), 1);
        to = Math.min(Math.max(0, parseFloat(to)), 1);
        len = parseFloat(len);
        self.volume(from, id);
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self._soundById(ids[i]);
          if (sound) {
            if (!id) {
              self._stopFade(ids[i]);
            }
            if (self._webAudio && !sound._muted) {
              var currentTime = Howler2.ctx.currentTime;
              var end = currentTime + len / 1e3;
              sound._volume = from;
              sound._node.gain.setValueAtTime(from, currentTime);
              sound._node.gain.linearRampToValueAtTime(to, end);
            }
            self._startFadeInterval(sound, from, to, len, ids[i], typeof id === "undefined");
          }
        }
        return self;
      },
      /**
       * Starts the internal interval to fade a sound.
       * @param  {Object} sound Reference to sound to fade.
       * @param  {Number} from The value to fade from (0.0 to 1.0).
       * @param  {Number} to   The volume to fade to (0.0 to 1.0).
       * @param  {Number} len  Time in milliseconds to fade.
       * @param  {Number} id   The sound id to fade.
       * @param  {Boolean} isGroup   If true, set the volume on the group.
       */
      _startFadeInterval: function(sound, from, to, len, id, isGroup) {
        var self = this;
        var vol = from;
        var diff = to - from;
        var steps = Math.abs(diff / 0.01);
        var stepLen = Math.max(4, steps > 0 ? len / steps : len);
        var lastTick = Date.now();
        sound._fadeTo = to;
        sound._interval = setInterval(function() {
          var tick = (Date.now() - lastTick) / len;
          lastTick = Date.now();
          vol += diff * tick;
          vol = Math.round(vol * 100) / 100;
          if (diff < 0) {
            vol = Math.max(to, vol);
          } else {
            vol = Math.min(to, vol);
          }
          if (self._webAudio) {
            sound._volume = vol;
          } else {
            self.volume(vol, sound._id, true);
          }
          if (isGroup) {
            self._volume = vol;
          }
          if (to < from && vol <= to || to > from && vol >= to) {
            clearInterval(sound._interval);
            sound._interval = null;
            sound._fadeTo = null;
            self.volume(to, sound._id);
            self._emit("fade", sound._id);
          }
        }, stepLen);
      },
      /**
       * Internal method that stops the currently playing fade when
       * a new fade starts, volume is changed or the sound is stopped.
       * @param  {Number} id The sound id.
       * @return {Howl}
       */
      _stopFade: function(id) {
        var self = this;
        var sound = self._soundById(id);
        if (sound && sound._interval) {
          if (self._webAudio) {
            sound._node.gain.cancelScheduledValues(Howler2.ctx.currentTime);
          }
          clearInterval(sound._interval);
          sound._interval = null;
          self.volume(sound._fadeTo, id);
          sound._fadeTo = null;
          self._emit("fade", id);
        }
        return self;
      },
      /**
       * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
       *   loop() -> Returns the group's loop value.
       *   loop(id) -> Returns the sound id's loop value.
       *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
       *   loop(loop, id) -> Sets the loop value of passed sound id.
       * @return {Howl/Boolean} Returns self or current loop value.
       */
      loop: function() {
        var self = this;
        var args = arguments;
        var loop, id, sound;
        if (args.length === 0) {
          return self._loop;
        } else if (args.length === 1) {
          if (typeof args[0] === "boolean") {
            loop = args[0];
            self._loop = loop;
          } else {
            sound = self._soundById(parseInt(args[0], 10));
            return sound ? sound._loop : false;
          }
        } else if (args.length === 2) {
          loop = args[0];
          id = parseInt(args[1], 10);
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          sound = self._soundById(ids[i]);
          if (sound) {
            sound._loop = loop;
            if (self._webAudio && sound._node && sound._node.bufferSource) {
              sound._node.bufferSource.loop = loop;
              if (loop) {
                sound._node.bufferSource.loopStart = sound._start || 0;
                sound._node.bufferSource.loopEnd = sound._stop;
                if (self.playing(ids[i])) {
                  self.pause(ids[i], true);
                  self.play(ids[i], true);
                }
              }
            }
          }
        }
        return self;
      },
      /**
       * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
       *   rate() -> Returns the first sound node's current playback rate.
       *   rate(id) -> Returns the sound id's current playback rate.
       *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
       *   rate(rate, id) -> Sets the playback rate of passed sound id.
       * @return {Howl/Number} Returns self or the current playback rate.
       */
      rate: function() {
        var self = this;
        var args = arguments;
        var rate, id;
        if (args.length === 0) {
          id = self._sounds[0]._id;
        } else if (args.length === 1) {
          var ids = self._getSoundIds();
          var index = ids.indexOf(args[0]);
          if (index >= 0) {
            id = parseInt(args[0], 10);
          } else {
            rate = parseFloat(args[0]);
          }
        } else if (args.length === 2) {
          rate = parseFloat(args[0]);
          id = parseInt(args[1], 10);
        }
        var sound;
        if (typeof rate === "number") {
          if (self._state !== "loaded" || self._playLock) {
            self._queue.push({
              event: "rate",
              action: function() {
                self.rate.apply(self, args);
              }
            });
            return self;
          }
          if (typeof id === "undefined") {
            self._rate = rate;
          }
          id = self._getSoundIds(id);
          for (var i = 0; i < id.length; i++) {
            sound = self._soundById(id[i]);
            if (sound) {
              if (self.playing(id[i])) {
                sound._rateSeek = self.seek(id[i]);
                sound._playStart = self._webAudio ? Howler2.ctx.currentTime : sound._playStart;
              }
              sound._rate = rate;
              if (self._webAudio && sound._node && sound._node.bufferSource) {
                sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler2.ctx.currentTime);
              } else if (sound._node) {
                sound._node.playbackRate = rate;
              }
              var seek = self.seek(id[i]);
              var duration = (self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1e3 - seek;
              var timeout = duration * 1e3 / Math.abs(sound._rate);
              if (self._endTimers[id[i]] || !sound._paused) {
                self._clearTimer(id[i]);
                self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
              }
              self._emit("rate", sound._id);
            }
          }
        } else {
          sound = self._soundById(id);
          return sound ? sound._rate : self._rate;
        }
        return self;
      },
      /**
       * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
       *   seek() -> Returns the first sound node's current seek position.
       *   seek(id) -> Returns the sound id's current seek position.
       *   seek(seek) -> Sets the seek position of the first sound node.
       *   seek(seek, id) -> Sets the seek position of passed sound id.
       * @return {Howl/Number} Returns self or the current seek position.
       */
      seek: function() {
        var self = this;
        var args = arguments;
        var seek, id;
        if (args.length === 0) {
          if (self._sounds.length) {
            id = self._sounds[0]._id;
          }
        } else if (args.length === 1) {
          var ids = self._getSoundIds();
          var index = ids.indexOf(args[0]);
          if (index >= 0) {
            id = parseInt(args[0], 10);
          } else if (self._sounds.length) {
            id = self._sounds[0]._id;
            seek = parseFloat(args[0]);
          }
        } else if (args.length === 2) {
          seek = parseFloat(args[0]);
          id = parseInt(args[1], 10);
        }
        if (typeof id === "undefined") {
          return 0;
        }
        if (typeof seek === "number" && (self._state !== "loaded" || self._playLock)) {
          self._queue.push({
            event: "seek",
            action: function() {
              self.seek.apply(self, args);
            }
          });
          return self;
        }
        var sound = self._soundById(id);
        if (sound) {
          if (typeof seek === "number" && seek >= 0) {
            var playing = self.playing(id);
            if (playing) {
              self.pause(id, true);
            }
            sound._seek = seek;
            sound._ended = false;
            self._clearTimer(id);
            if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
              sound._node.currentTime = seek;
            }
            var seekAndEmit = function() {
              if (playing) {
                self.play(id, true);
              }
              self._emit("seek", id);
            };
            if (playing && !self._webAudio) {
              var emitSeek = function() {
                if (!self._playLock) {
                  seekAndEmit();
                } else {
                  setTimeout(emitSeek, 0);
                }
              };
              setTimeout(emitSeek, 0);
            } else {
              seekAndEmit();
            }
          } else {
            if (self._webAudio) {
              var realTime = self.playing(id) ? Howler2.ctx.currentTime - sound._playStart : 0;
              var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
              return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
            } else {
              return sound._node.currentTime;
            }
          }
        }
        return self;
      },
      /**
       * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
       * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
       * @return {Boolean} True if playing and false if not.
       */
      playing: function(id) {
        var self = this;
        if (typeof id === "number") {
          var sound = self._soundById(id);
          return sound ? !sound._paused : false;
        }
        for (var i = 0; i < self._sounds.length; i++) {
          if (!self._sounds[i]._paused) {
            return true;
          }
        }
        return false;
      },
      /**
       * Get the duration of this sound. Passing a sound id will return the sprite duration.
       * @param  {Number} id The sound id to check. If none is passed, return full source duration.
       * @return {Number} Audio duration in seconds.
       */
      duration: function(id) {
        var self = this;
        var duration = self._duration;
        var sound = self._soundById(id);
        if (sound) {
          duration = self._sprite[sound._sprite][1] / 1e3;
        }
        return duration;
      },
      /**
       * Returns the current loaded state of this Howl.
       * @return {String} 'unloaded', 'loading', 'loaded'
       */
      state: function() {
        return this._state;
      },
      /**
       * Unload and destroy the current Howl object.
       * This will immediately stop all sound instances attached to this group.
       */
      unload: function() {
        var self = this;
        var sounds = self._sounds;
        for (var i = 0; i < sounds.length; i++) {
          if (!sounds[i]._paused) {
            self.stop(sounds[i]._id);
          }
          if (!self._webAudio) {
            self._clearSound(sounds[i]._node);
            sounds[i]._node.removeEventListener("error", sounds[i]._errorFn, false);
            sounds[i]._node.removeEventListener(Howler2._canPlayEvent, sounds[i]._loadFn, false);
            sounds[i]._node.removeEventListener("ended", sounds[i]._endFn, false);
            Howler2._releaseHtml5Audio(sounds[i]._node);
          }
          delete sounds[i]._node;
          self._clearTimer(sounds[i]._id);
        }
        var index = Howler2._howls.indexOf(self);
        if (index >= 0) {
          Howler2._howls.splice(index, 1);
        }
        var remCache = true;
        for (i = 0; i < Howler2._howls.length; i++) {
          if (Howler2._howls[i]._src === self._src || self._src.indexOf(Howler2._howls[i]._src) >= 0) {
            remCache = false;
            break;
          }
        }
        if (cache && remCache) {
          delete cache[self._src];
        }
        Howler2.noAudio = false;
        self._state = "unloaded";
        self._sounds = [];
        self = null;
        return null;
      },
      /**
       * Listen to a custom event.
       * @param  {String}   event Event name.
       * @param  {Function} fn    Listener to call.
       * @param  {Number}   id    (optional) Only listen to events for this sound.
       * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
       * @return {Howl}
       */
      on: function(event, fn, id, once) {
        var self = this;
        var events = self["_on" + event];
        if (typeof fn === "function") {
          events.push(once ? { id, fn, once } : { id, fn });
        }
        return self;
      },
      /**
       * Remove a custom event. Call without parameters to remove all events.
       * @param  {String}   event Event name.
       * @param  {Function} fn    Listener to remove. Leave empty to remove all.
       * @param  {Number}   id    (optional) Only remove events for this sound.
       * @return {Howl}
       */
      off: function(event, fn, id) {
        var self = this;
        var events = self["_on" + event];
        var i = 0;
        if (typeof fn === "number") {
          id = fn;
          fn = null;
        }
        if (fn || id) {
          for (i = 0; i < events.length; i++) {
            var isId = id === events[i].id;
            if (fn === events[i].fn && isId || !fn && isId) {
              events.splice(i, 1);
              break;
            }
          }
        } else if (event) {
          self["_on" + event] = [];
        } else {
          var keys = Object.keys(self);
          for (i = 0; i < keys.length; i++) {
            if (keys[i].indexOf("_on") === 0 && Array.isArray(self[keys[i]])) {
              self[keys[i]] = [];
            }
          }
        }
        return self;
      },
      /**
       * Listen to a custom event and remove it once fired.
       * @param  {String}   event Event name.
       * @param  {Function} fn    Listener to call.
       * @param  {Number}   id    (optional) Only listen to events for this sound.
       * @return {Howl}
       */
      once: function(event, fn, id) {
        var self = this;
        self.on(event, fn, id, 1);
        return self;
      },
      /**
       * Emit all events of a specific type and pass the sound id.
       * @param  {String} event Event name.
       * @param  {Number} id    Sound ID.
       * @param  {Number} msg   Message to go with event.
       * @return {Howl}
       */
      _emit: function(event, id, msg) {
        var self = this;
        var events = self["_on" + event];
        for (var i = events.length - 1; i >= 0; i--) {
          if (!events[i].id || events[i].id === id || event === "load") {
            setTimeout((function(fn) {
              fn.call(this, id, msg);
            }).bind(self, events[i].fn), 0);
            if (events[i].once) {
              self.off(event, events[i].fn, events[i].id);
            }
          }
        }
        self._loadQueue(event);
        return self;
      },
      /**
       * Queue of actions initiated before the sound has loaded.
       * These will be called in sequence, with the next only firing
       * after the previous has finished executing (even if async like play).
       * @return {Howl}
       */
      _loadQueue: function(event) {
        var self = this;
        if (self._queue.length > 0) {
          var task = self._queue[0];
          if (task.event === event) {
            self._queue.shift();
            self._loadQueue();
          }
          if (!event) {
            task.action();
          }
        }
        return self;
      },
      /**
       * Fired when playback ends at the end of the duration.
       * @param  {Sound} sound The sound object to work with.
       * @return {Howl}
       */
      _ended: function(sound) {
        var self = this;
        var sprite = sound._sprite;
        if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
          setTimeout(self._ended.bind(self, sound), 100);
          return self;
        }
        var loop = !!(sound._loop || self._sprite[sprite][2]);
        self._emit("end", sound._id);
        if (!self._webAudio && loop) {
          self.stop(sound._id, true).play(sound._id);
        }
        if (self._webAudio && loop) {
          self._emit("play", sound._id);
          sound._seek = sound._start || 0;
          sound._rateSeek = 0;
          sound._playStart = Howler2.ctx.currentTime;
          var timeout = (sound._stop - sound._start) * 1e3 / Math.abs(sound._rate);
          self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
        }
        if (self._webAudio && !loop) {
          sound._paused = true;
          sound._ended = true;
          sound._seek = sound._start || 0;
          sound._rateSeek = 0;
          self._clearTimer(sound._id);
          self._cleanBuffer(sound._node);
          Howler2._autoSuspend();
        }
        if (!self._webAudio && !loop) {
          self.stop(sound._id, true);
        }
        return self;
      },
      /**
       * Clear the end timer for a sound playback.
       * @param  {Number} id The sound ID.
       * @return {Howl}
       */
      _clearTimer: function(id) {
        var self = this;
        if (self._endTimers[id]) {
          if (typeof self._endTimers[id] !== "function") {
            clearTimeout(self._endTimers[id]);
          } else {
            var sound = self._soundById(id);
            if (sound && sound._node) {
              sound._node.removeEventListener("ended", self._endTimers[id], false);
            }
          }
          delete self._endTimers[id];
        }
        return self;
      },
      /**
       * Return the sound identified by this ID, or return null.
       * @param  {Number} id Sound ID
       * @return {Object}    Sound object or null.
       */
      _soundById: function(id) {
        var self = this;
        for (var i = 0; i < self._sounds.length; i++) {
          if (id === self._sounds[i]._id) {
            return self._sounds[i];
          }
        }
        return null;
      },
      /**
       * Return an inactive sound from the pool or create a new one.
       * @return {Sound} Sound playback object.
       */
      _inactiveSound: function() {
        var self = this;
        self._drain();
        for (var i = 0; i < self._sounds.length; i++) {
          if (self._sounds[i]._ended) {
            return self._sounds[i].reset();
          }
        }
        return new Sound2(self);
      },
      /**
       * Drain excess inactive sounds from the pool.
       */
      _drain: function() {
        var self = this;
        var limit = self._pool;
        var cnt = 0;
        var i = 0;
        if (self._sounds.length < limit) {
          return;
        }
        for (i = 0; i < self._sounds.length; i++) {
          if (self._sounds[i]._ended) {
            cnt++;
          }
        }
        for (i = self._sounds.length - 1; i >= 0; i--) {
          if (cnt <= limit) {
            return;
          }
          if (self._sounds[i]._ended) {
            if (self._webAudio && self._sounds[i]._node) {
              self._sounds[i]._node.disconnect(0);
            }
            self._sounds.splice(i, 1);
            cnt--;
          }
        }
      },
      /**
       * Get all ID's from the sounds pool.
       * @param  {Number} id Only return one ID if one is passed.
       * @return {Array}    Array of IDs.
       */
      _getSoundIds: function(id) {
        var self = this;
        if (typeof id === "undefined") {
          var ids = [];
          for (var i = 0; i < self._sounds.length; i++) {
            ids.push(self._sounds[i]._id);
          }
          return ids;
        } else {
          return [id];
        }
      },
      /**
       * Load the sound back into the buffer source.
       * @param  {Sound} sound The sound object to work with.
       * @return {Howl}
       */
      _refreshBuffer: function(sound) {
        var self = this;
        sound._node.bufferSource = Howler2.ctx.createBufferSource();
        sound._node.bufferSource.buffer = cache[self._src];
        if (sound._panner) {
          sound._node.bufferSource.connect(sound._panner);
        } else {
          sound._node.bufferSource.connect(sound._node);
        }
        sound._node.bufferSource.loop = sound._loop;
        if (sound._loop) {
          sound._node.bufferSource.loopStart = sound._start || 0;
          sound._node.bufferSource.loopEnd = sound._stop || 0;
        }
        sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler2.ctx.currentTime);
        return self;
      },
      /**
       * Prevent memory leaks by cleaning up the buffer source after playback.
       * @param  {Object} node Sound's audio node containing the buffer source.
       * @return {Howl}
       */
      _cleanBuffer: function(node) {
        var self = this;
        var isIOS = Howler2._navigator && Howler2._navigator.vendor.indexOf("Apple") >= 0;
        if (!node.bufferSource) {
          return self;
        }
        if (Howler2._scratchBuffer && node.bufferSource) {
          node.bufferSource.onended = null;
          node.bufferSource.disconnect(0);
          if (isIOS) {
            try {
              node.bufferSource.buffer = Howler2._scratchBuffer;
            } catch (e) {
            }
          }
        }
        node.bufferSource = null;
        return self;
      },
      /**
       * Set the source to a 0-second silence to stop any downloading (except in IE).
       * @param  {Object} node Audio node to clear.
       */
      _clearSound: function(node) {
        var checkIE = /MSIE |Trident\//.test(Howler2._navigator && Howler2._navigator.userAgent);
        if (!checkIE) {
          node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
        }
      }
    };
    var Sound2 = function(howl) {
      this._parent = howl;
      this.init();
    };
    Sound2.prototype = {
      /**
       * Initialize a new Sound object.
       * @return {Sound}
       */
      init: function() {
        var self = this;
        var parent = self._parent;
        self._muted = parent._muted;
        self._loop = parent._loop;
        self._volume = parent._volume;
        self._rate = parent._rate;
        self._seek = 0;
        self._paused = true;
        self._ended = true;
        self._sprite = "__default";
        self._id = ++Howler2._counter;
        parent._sounds.push(self);
        self.create();
        return self;
      },
      /**
       * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
       * @return {Sound}
       */
      create: function() {
        var self = this;
        var parent = self._parent;
        var volume = Howler2._muted || self._muted || self._parent._muted ? 0 : self._volume;
        if (parent._webAudio) {
          self._node = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
          self._node.gain.setValueAtTime(volume, Howler2.ctx.currentTime);
          self._node.paused = true;
          self._node.connect(Howler2.masterGain);
        } else if (!Howler2.noAudio) {
          self._node = Howler2._obtainHtml5Audio();
          self._errorFn = self._errorListener.bind(self);
          self._node.addEventListener("error", self._errorFn, false);
          self._loadFn = self._loadListener.bind(self);
          self._node.addEventListener(Howler2._canPlayEvent, self._loadFn, false);
          self._endFn = self._endListener.bind(self);
          self._node.addEventListener("ended", self._endFn, false);
          self._node.src = parent._src;
          self._node.preload = parent._preload === true ? "auto" : parent._preload;
          self._node.volume = volume * Howler2.volume();
          self._node.load();
        }
        return self;
      },
      /**
       * Reset the parameters of this sound to the original state (for recycle).
       * @return {Sound}
       */
      reset: function() {
        var self = this;
        var parent = self._parent;
        self._muted = parent._muted;
        self._loop = parent._loop;
        self._volume = parent._volume;
        self._rate = parent._rate;
        self._seek = 0;
        self._rateSeek = 0;
        self._paused = true;
        self._ended = true;
        self._sprite = "__default";
        self._id = ++Howler2._counter;
        return self;
      },
      /**
       * HTML5 Audio error listener callback.
       */
      _errorListener: function() {
        var self = this;
        self._parent._emit("loaderror", self._id, self._node.error ? self._node.error.code : 0);
        self._node.removeEventListener("error", self._errorFn, false);
      },
      /**
       * HTML5 Audio canplaythrough listener callback.
       */
      _loadListener: function() {
        var self = this;
        var parent = self._parent;
        parent._duration = Math.ceil(self._node.duration * 10) / 10;
        if (Object.keys(parent._sprite).length === 0) {
          parent._sprite = { __default: [0, parent._duration * 1e3] };
        }
        if (parent._state !== "loaded") {
          parent._state = "loaded";
          parent._emit("load");
          parent._loadQueue();
        }
        self._node.removeEventListener(Howler2._canPlayEvent, self._loadFn, false);
      },
      /**
       * HTML5 Audio ended listener callback.
       */
      _endListener: function() {
        var self = this;
        var parent = self._parent;
        if (parent._duration === Infinity) {
          parent._duration = Math.ceil(self._node.duration * 10) / 10;
          if (parent._sprite.__default[1] === Infinity) {
            parent._sprite.__default[1] = parent._duration * 1e3;
          }
          parent._ended(self);
        }
        self._node.removeEventListener("ended", self._endFn, false);
      }
    };
    var cache = {};
    var loadBuffer = function(self) {
      var url = self._src;
      if (cache[url]) {
        self._duration = cache[url].duration;
        loadSound(self);
        return;
      }
      if (/^data:[^;]+;base64,/.test(url)) {
        var data = atob(url.split(",")[1]);
        var dataView = new Uint8Array(data.length);
        for (var i = 0; i < data.length; ++i) {
          dataView[i] = data.charCodeAt(i);
        }
        decodeAudioData(dataView.buffer, self);
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open(self._xhr.method, url, true);
        xhr.withCredentials = self._xhr.withCredentials;
        xhr.responseType = "arraybuffer";
        if (self._xhr.headers) {
          Object.keys(self._xhr.headers).forEach(function(key) {
            xhr.setRequestHeader(key, self._xhr.headers[key]);
          });
        }
        xhr.onload = function() {
          var code = (xhr.status + "")[0];
          if (code !== "0" && code !== "2" && code !== "3") {
            self._emit("loaderror", null, "Failed loading audio file with status: " + xhr.status + ".");
            return;
          }
          decodeAudioData(xhr.response, self);
        };
        xhr.onerror = function() {
          if (self._webAudio) {
            self._html5 = true;
            self._webAudio = false;
            self._sounds = [];
            delete cache[url];
            self.load();
          }
        };
        safeXhrSend(xhr);
      }
    };
    var safeXhrSend = function(xhr) {
      try {
        xhr.send();
      } catch (e) {
        xhr.onerror();
      }
    };
    var decodeAudioData = function(arraybuffer, self) {
      var error = function() {
        self._emit("loaderror", null, "Decoding audio data failed.");
      };
      var success = function(buffer) {
        if (buffer && self._sounds.length > 0) {
          cache[self._src] = buffer;
          loadSound(self, buffer);
        } else {
          error();
        }
      };
      if (typeof Promise !== "undefined" && Howler2.ctx.decodeAudioData.length === 1) {
        Howler2.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
      } else {
        Howler2.ctx.decodeAudioData(arraybuffer, success, error);
      }
    };
    var loadSound = function(self, buffer) {
      if (buffer && !self._duration) {
        self._duration = buffer.duration;
      }
      if (Object.keys(self._sprite).length === 0) {
        self._sprite = { __default: [0, self._duration * 1e3] };
      }
      if (self._state !== "loaded") {
        self._state = "loaded";
        self._emit("load");
        self._loadQueue();
      }
    };
    var setupAudioContext = function() {
      if (!Howler2.usingWebAudio) {
        return;
      }
      try {
        if (typeof AudioContext !== "undefined") {
          Howler2.ctx = new AudioContext();
        } else if (typeof webkitAudioContext !== "undefined") {
          Howler2.ctx = new webkitAudioContext();
        } else {
          Howler2.usingWebAudio = false;
        }
      } catch (e) {
        Howler2.usingWebAudio = false;
      }
      if (!Howler2.ctx) {
        Howler2.usingWebAudio = false;
      }
      var iOS = /iP(hone|od|ad)/.test(Howler2._navigator && Howler2._navigator.platform);
      var appVersion = Howler2._navigator && Howler2._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      var version = appVersion ? parseInt(appVersion[1], 10) : null;
      if (iOS && version && version < 9) {
        var safari = /safari/.test(Howler2._navigator && Howler2._navigator.userAgent.toLowerCase());
        if (Howler2._navigator && !safari) {
          Howler2.usingWebAudio = false;
        }
      }
      if (Howler2.usingWebAudio) {
        Howler2.masterGain = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
        Howler2.masterGain.gain.setValueAtTime(Howler2._muted ? 0 : Howler2._volume, Howler2.ctx.currentTime);
        Howler2.masterGain.connect(Howler2.ctx.destination);
      }
      Howler2._setup();
    };
    {
      exports$1.Howler = Howler2;
      exports$1.Howl = Howl2;
    }
    if (typeof commonjsGlobal !== "undefined") {
      commonjsGlobal.HowlerGlobal = HowlerGlobal2;
      commonjsGlobal.Howler = Howler2;
      commonjsGlobal.Howl = Howl2;
      commonjsGlobal.Sound = Sound2;
    } else if (typeof window !== "undefined") {
      window.HowlerGlobal = HowlerGlobal2;
      window.Howler = Howler2;
      window.Howl = Howl2;
      window.Sound = Sound2;
    }
  })();
  /*!
   *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
   *  
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   */
  (function() {
    HowlerGlobal.prototype._pos = [0, 0, 0];
    HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
    HowlerGlobal.prototype.stereo = function(pan) {
      var self = this;
      if (!self.ctx || !self.ctx.listener) {
        return self;
      }
      for (var i = self._howls.length - 1; i >= 0; i--) {
        self._howls[i].stereo(pan);
      }
      return self;
    };
    HowlerGlobal.prototype.pos = function(x, y, z) {
      var self = this;
      if (!self.ctx || !self.ctx.listener) {
        return self;
      }
      y = typeof y !== "number" ? self._pos[1] : y;
      z = typeof z !== "number" ? self._pos[2] : z;
      if (typeof x === "number") {
        self._pos = [x, y, z];
        if (typeof self.ctx.listener.positionX !== "undefined") {
          self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
          self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
          self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
        } else {
          self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
        }
      } else {
        return self._pos;
      }
      return self;
    };
    HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
      var self = this;
      if (!self.ctx || !self.ctx.listener) {
        return self;
      }
      var or = self._orientation;
      y = typeof y !== "number" ? or[1] : y;
      z = typeof z !== "number" ? or[2] : z;
      xUp = typeof xUp !== "number" ? or[3] : xUp;
      yUp = typeof yUp !== "number" ? or[4] : yUp;
      zUp = typeof zUp !== "number" ? or[5] : zUp;
      if (typeof x === "number") {
        self._orientation = [x, y, z, xUp, yUp, zUp];
        if (typeof self.ctx.listener.forwardX !== "undefined") {
          self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
          self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
          self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
          self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
          self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
          self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
        } else {
          self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
        }
      } else {
        return or;
      }
      return self;
    };
    Howl.prototype.init = /* @__PURE__ */ function(_super) {
      return function(o) {
        var self = this;
        self._orientation = o.orientation || [1, 0, 0];
        self._stereo = o.stereo || null;
        self._pos = o.pos || null;
        self._pannerAttr = {
          coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : 360,
          coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : 360,
          coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : 0,
          distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : "inverse",
          maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : 1e4,
          panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : "HRTF",
          refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : 1,
          rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : 1
        };
        self._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
        self._onpos = o.onpos ? [{ fn: o.onpos }] : [];
        self._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];
        return _super.call(this, o);
      };
    }(Howl.prototype.init);
    Howl.prototype.stereo = function(pan, id) {
      var self = this;
      if (!self._webAudio) {
        return self;
      }
      if (self._state !== "loaded") {
        self._queue.push({
          event: "stereo",
          action: function() {
            self.stereo(pan, id);
          }
        });
        return self;
      }
      var pannerType = typeof Howler.ctx.createStereoPanner === "undefined" ? "spatial" : "stereo";
      if (typeof id === "undefined") {
        if (typeof pan === "number") {
          self._stereo = pan;
          self._pos = [pan, 0, 0];
        } else {
          return self._stereo;
        }
      }
      var ids = self._getSoundIds(id);
      for (var i = 0; i < ids.length; i++) {
        var sound = self._soundById(ids[i]);
        if (sound) {
          if (typeof pan === "number") {
            sound._stereo = pan;
            sound._pos = [pan, 0, 0];
            if (sound._node) {
              sound._pannerAttr.panningModel = "equalpower";
              if (!sound._panner || !sound._panner.pan) {
                setupPanner(sound, pannerType);
              }
              if (pannerType === "spatial") {
                if (typeof sound._panner.positionX !== "undefined") {
                  sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                  sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                  sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
                } else {
                  sound._panner.setPosition(pan, 0, 0);
                }
              } else {
                sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
              }
            }
            self._emit("stereo", sound._id);
          } else {
            return sound._stereo;
          }
        }
      }
      return self;
    };
    Howl.prototype.pos = function(x, y, z, id) {
      var self = this;
      if (!self._webAudio) {
        return self;
      }
      if (self._state !== "loaded") {
        self._queue.push({
          event: "pos",
          action: function() {
            self.pos(x, y, z, id);
          }
        });
        return self;
      }
      y = typeof y !== "number" ? 0 : y;
      z = typeof z !== "number" ? -0.5 : z;
      if (typeof id === "undefined") {
        if (typeof x === "number") {
          self._pos = [x, y, z];
        } else {
          return self._pos;
        }
      }
      var ids = self._getSoundIds(id);
      for (var i = 0; i < ids.length; i++) {
        var sound = self._soundById(ids[i]);
        if (sound) {
          if (typeof x === "number") {
            sound._pos = [x, y, z];
            if (sound._node) {
              if (!sound._panner || sound._panner.pan) {
                setupPanner(sound, "spatial");
              }
              if (typeof sound._panner.positionX !== "undefined") {
                sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
                sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
                sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
              } else {
                sound._panner.setPosition(x, y, z);
              }
            }
            self._emit("pos", sound._id);
          } else {
            return sound._pos;
          }
        }
      }
      return self;
    };
    Howl.prototype.orientation = function(x, y, z, id) {
      var self = this;
      if (!self._webAudio) {
        return self;
      }
      if (self._state !== "loaded") {
        self._queue.push({
          event: "orientation",
          action: function() {
            self.orientation(x, y, z, id);
          }
        });
        return self;
      }
      y = typeof y !== "number" ? self._orientation[1] : y;
      z = typeof z !== "number" ? self._orientation[2] : z;
      if (typeof id === "undefined") {
        if (typeof x === "number") {
          self._orientation = [x, y, z];
        } else {
          return self._orientation;
        }
      }
      var ids = self._getSoundIds(id);
      for (var i = 0; i < ids.length; i++) {
        var sound = self._soundById(ids[i]);
        if (sound) {
          if (typeof x === "number") {
            sound._orientation = [x, y, z];
            if (sound._node) {
              if (!sound._panner) {
                if (!sound._pos) {
                  sound._pos = self._pos || [0, 0, -0.5];
                }
                setupPanner(sound, "spatial");
              }
              if (typeof sound._panner.orientationX !== "undefined") {
                sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
                sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
                sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
              } else {
                sound._panner.setOrientation(x, y, z);
              }
            }
            self._emit("orientation", sound._id);
          } else {
            return sound._orientation;
          }
        }
      }
      return self;
    };
    Howl.prototype.pannerAttr = function() {
      var self = this;
      var args = arguments;
      var o, id, sound;
      if (!self._webAudio) {
        return self;
      }
      if (args.length === 0) {
        return self._pannerAttr;
      } else if (args.length === 1) {
        if (typeof args[0] === "object") {
          o = args[0];
          if (typeof id === "undefined") {
            if (!o.pannerAttr) {
              o.pannerAttr = {
                coneInnerAngle: o.coneInnerAngle,
                coneOuterAngle: o.coneOuterAngle,
                coneOuterGain: o.coneOuterGain,
                distanceModel: o.distanceModel,
                maxDistance: o.maxDistance,
                refDistance: o.refDistance,
                rolloffFactor: o.rolloffFactor,
                panningModel: o.panningModel
              };
            }
            self._pannerAttr = {
              coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== "undefined" ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
              coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== "undefined" ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
              coneOuterGain: typeof o.pannerAttr.coneOuterGain !== "undefined" ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
              distanceModel: typeof o.pannerAttr.distanceModel !== "undefined" ? o.pannerAttr.distanceModel : self._distanceModel,
              maxDistance: typeof o.pannerAttr.maxDistance !== "undefined" ? o.pannerAttr.maxDistance : self._maxDistance,
              refDistance: typeof o.pannerAttr.refDistance !== "undefined" ? o.pannerAttr.refDistance : self._refDistance,
              rolloffFactor: typeof o.pannerAttr.rolloffFactor !== "undefined" ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
              panningModel: typeof o.pannerAttr.panningModel !== "undefined" ? o.pannerAttr.panningModel : self._panningModel
            };
          }
        } else {
          sound = self._soundById(parseInt(args[0], 10));
          return sound ? sound._pannerAttr : self._pannerAttr;
        }
      } else if (args.length === 2) {
        o = args[0];
        id = parseInt(args[1], 10);
      }
      var ids = self._getSoundIds(id);
      for (var i = 0; i < ids.length; i++) {
        sound = self._soundById(ids[i]);
        if (sound) {
          var pa = sound._pannerAttr;
          pa = {
            coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : pa.coneInnerAngle,
            coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : pa.coneOuterAngle,
            coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : pa.coneOuterGain,
            distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : pa.distanceModel,
            maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : pa.maxDistance,
            refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : pa.refDistance,
            rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : pa.rolloffFactor,
            panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : pa.panningModel
          };
          var panner = sound._panner;
          if (!panner) {
            if (!sound._pos) {
              sound._pos = self._pos || [0, 0, -0.5];
            }
            setupPanner(sound, "spatial");
            panner = sound._panner;
          }
          panner.coneInnerAngle = pa.coneInnerAngle;
          panner.coneOuterAngle = pa.coneOuterAngle;
          panner.coneOuterGain = pa.coneOuterGain;
          panner.distanceModel = pa.distanceModel;
          panner.maxDistance = pa.maxDistance;
          panner.refDistance = pa.refDistance;
          panner.rolloffFactor = pa.rolloffFactor;
          panner.panningModel = pa.panningModel;
        }
      }
      return self;
    };
    Sound.prototype.init = /* @__PURE__ */ function(_super) {
      return function() {
        var self = this;
        var parent = self._parent;
        self._orientation = parent._orientation;
        self._stereo = parent._stereo;
        self._pos = parent._pos;
        self._pannerAttr = parent._pannerAttr;
        _super.call(this);
        if (self._stereo) {
          parent.stereo(self._stereo);
        } else if (self._pos) {
          parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
        }
      };
    }(Sound.prototype.init);
    Sound.prototype.reset = /* @__PURE__ */ function(_super) {
      return function() {
        var self = this;
        var parent = self._parent;
        self._orientation = parent._orientation;
        self._stereo = parent._stereo;
        self._pos = parent._pos;
        self._pannerAttr = parent._pannerAttr;
        if (self._stereo) {
          parent.stereo(self._stereo);
        } else if (self._pos) {
          parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
        } else if (self._panner) {
          self._panner.disconnect(0);
          self._panner = void 0;
          parent._refreshBuffer(self);
        }
        return _super.call(this);
      };
    }(Sound.prototype.reset);
    var setupPanner = function(sound, type) {
      type = type || "spatial";
      if (type === "spatial") {
        sound._panner = Howler.ctx.createPanner();
        sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
        sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
        sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
        sound._panner.distanceModel = sound._pannerAttr.distanceModel;
        sound._panner.maxDistance = sound._pannerAttr.maxDistance;
        sound._panner.refDistance = sound._pannerAttr.refDistance;
        sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
        sound._panner.panningModel = sound._pannerAttr.panningModel;
        if (typeof sound._panner.positionX !== "undefined") {
          sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
          sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
          sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
        } else {
          sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
        }
        if (typeof sound._panner.orientationX !== "undefined") {
          sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
          sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
          sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
        } else {
          sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
        }
      } else {
        sound._panner = Howler.ctx.createStereoPanner();
        sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
      }
      sound._panner.connect(sound._node);
      if (!sound._paused) {
        sound._parent.pause(sound._id, true).play(sound._id, true);
      }
    };
  })();
})(howler);
const SoundContext = reactExports.createContext(void 0);
const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = reactExports.useState(() => {
    const saved = localStorage.getItem("nexus-audio-muted");
    return saved ? JSON.parse(saved) : false;
  });
  const [volume, setVolume] = reactExports.useState(() => {
    const saved = localStorage.getItem("nexus-audio-volume");
    return saved ? JSON.parse(saved) : 0.5;
  });
  reactExports.useEffect(() => {
    localStorage.setItem("nexus-audio-muted", JSON.stringify(isMuted));
  }, [isMuted]);
  reactExports.useEffect(() => {
    localStorage.setItem("nexus-audio-volume", JSON.stringify(volume));
  }, [volume]);
  const toggleMute = reactExports.useCallback(() => setIsMuted((prev) => !prev), []);
  const setGlobalVolume = reactExports.useCallback((val) => setVolume(val), []);
  const playSfx = reactExports.useCallback(
    (sound) => {
      if (isMuted) return;
      console.log(`[SoundContext] Playing: ${sound}`);
    },
    [isMuted]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SoundContext.Provider, { value: { isMuted, volume, toggleMute, setGlobalVolume, playSfx }, children });
};
const useSoundContext = () => {
  const context = reactExports.useContext(SoundContext);
  if (!context) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
};
const SOUND_URLS = {
  tick: "/website-epic/sounds/hover_glass.mp3",
  thud: "/website-epic/sounds/click_activate.mp3",
  glass: "/website-epic/sounds/success_chime.mp3",
  whoosh: "/website-epic/sounds/menu_open.mp3",
  pop: "/website-epic/sounds/data_pulse.mp3",
  error: "/website-epic/sounds/error_buzzer.mp3",
  toggle: "/website-epic/sounds/menu_open.mp3"
};
const useHowl = (src, options) => {
  const howlRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    howlRef.current = new howler.Howl({
      src: [src],
      preload: true,
      volume: options.volume
    });
    return () => {
      var _a2;
      (_a2 = howlRef.current) == null ? void 0 : _a2.unload();
    };
  }, [src]);
  reactExports.useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(options.volume);
    }
  }, [options.volume]);
  const play = reactExports.useCallback(() => {
    if (options.soundEnabled && howlRef.current) {
      howlRef.current.play();
    }
  }, [options.soundEnabled]);
  return [play];
};
const useSoundEffects = () => {
  const { isMuted, volume } = useSoundContext();
  const [playTick] = useHowl(SOUND_URLS.tick, { volume: volume * 0.2, soundEnabled: !isMuted });
  const [playThud] = useHowl(SOUND_URLS.thud, { volume: volume * 0.4, soundEnabled: !isMuted });
  const [playSuccess] = useHowl(SOUND_URLS.glass, { volume: volume * 0.3, soundEnabled: !isMuted });
  const [playWhoosh] = useHowl(SOUND_URLS.whoosh, {
    volume: volume * 0.15,
    soundEnabled: !isMuted
  });
  const [playPop] = useHowl(SOUND_URLS.pop, { volume: volume * 0.25, soundEnabled: !isMuted });
  const [playError] = useHowl(SOUND_URLS.error, { volume: volume * 0.4, soundEnabled: !isMuted });
  const [playToggle] = useHowl(SOUND_URLS.toggle, { volume: volume * 0.2, soundEnabled: !isMuted });
  return {
    playHover: playTick,
    playClick: playThud,
    playSuccess,
    playWhoosh,
    playPop,
    playError,
    playToggle
  };
};
const CommandTerminal = () => {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const { playWhoosh, playPop } = useSoundEffects();
  const [input, setInput] = reactExports.useState("");
  const [history, setHistory] = reactExports.useState(["SISTEMA OPERATIVO AIGESTION v2.6", "Consola de comandos autorizada.", 'Escribe "help" para ver opciones.']);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "`") {
        if (!isOpen) playWhoosh();
        else playPop();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        var _a2;
        return (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
      }, 100);
    }
  }, [isOpen]);
  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    const response = [`> ${input}`];
    switch (cmd) {
      case "help":
        response.push("COMANDOS DISPONIBLES:", "- help: Muestra esta ayuda", "- clear: Limpia la terminal", "- daniela: Estado del núcleo de voz", "- exit: Cierra la terminal", "- status: Estado de los nodos globales");
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "daniela":
        response.push("DANIELA AI: ESTADO OPTIMAL", "Latencia: 12ms", "Sentimiento: Neutral/Analítico");
        break;
      case "status":
        response.push("NODOS ACTIVOS: 142", "Carga de Red: 24%", "Sincronización: 100%");
        break;
      case "exit":
        setIsOpen(false);
        break;
      default:
        response.push(`Error: Comando "${cmd}" no reconocido.`);
    }
    setHistory((prev) => [...prev, ...response]);
    setInput("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      className: "fixed inset-x-0 top-0 z-[100] p-4 font-mono",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto premium-glass border-nexus-cyan/30 bg-black/95 rounded-b-2xl overflow-hidden shadow-[0_0_50px_rgba(0,245,255,0.2)] relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanline pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-nexus-cyan/5 px-4 py-2 border-b border-nexus-cyan/20 flex justify-between items-center text-[10px] font-orbitron tracking-[0.2em] text-nexus-cyan", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", children: "●" }),
            "AIGESTION_TERMINAL_v2.6 // SECURE_SHELL"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.5)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)]" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 overflow-y-auto p-6 font-mono text-xs space-y-2 scrollbar-hide", children: history.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: line.startsWith(">") ? "text-nexus-cyan-glow" : "text-nexus-silver", children: line }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCommand, className: "p-4 bg-white/5 border-t border-white/5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-nexus-cyan-glow font-mono", children: "$" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              type: "text",
              value: input,
              onChange: (e) => setInput(e.target.value),
              className: "bg-transparent border-none outline-none flex-1 font-mono text-nexus-cyan-glow",
              placeholder: "Escribe un comando..."
            }
          )
        ] })
      ] })
    }
  ) });
};
const CyberpunkGrid = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 -z-40 pointer-events-none overflow-hidden opacity-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0",
        style: {
          backgroundImage: `
            linear-gradient(to right, rgba(0, 245, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at 50% 50%, black, transparent 80%)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute bottom-0 left-0 right-0 h-[40%] origin-bottom [transform:rotateX(60deg)]",
        style: {
          backgroundImage: `
            linear-gradient(to right, rgba(138, 43, 226, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(138, 43, 226, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px"
        }
      }
    )
  ] });
};
const MagneticWrapper = ({ children, className = "" }) => {
  const ref = reactExports.useRef(null);
  const [position, setPosition] = reactExports.useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    var _a2;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ((_a2 = ref.current) == null ? void 0 : _a2.getBoundingClientRect()) || {
      height: 0,
      width: 0,
      left: 0,
      top: 0
    };
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.5, y: middleY * 0.5 });
  };
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  const { x, y } = position;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      ref,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      animate: { x, y },
      transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 },
      className: `magnetic-wrap ${className}`,
      children
    }
  );
};
const getBasePath = () => {
  return "/website-epic/sounds";
};
const SOUND_ASSETS = {
  hover_glass: { src: `${getBasePath()}/hover_glass.mp3`, volume: 0.1 },
  click_activate: { src: `${getBasePath()}/click_activate.mp3`, volume: 0.3 },
  menu_open: { src: `${getBasePath()}/menu_open.mp3`, volume: 0.2 },
  success_chime: { src: `${getBasePath()}/success_chime.mp3`, volume: 0.2 },
  error_buzzer: { src: `${getBasePath()}/error_buzzer.mp3`, volume: 0.2 },
  nexus_hum: { src: `${getBasePath()}/nexus_hum.mp3`, volume: 0.05, loop: true },
  wuaw_subtle: { src: `${getBasePath()}/wuaw_subtle.mp3`, volume: 0.15 },
  data_pulse: { src: `${getBasePath()}/data_pulse.mp3`, volume: 0.1 }
};
const _AudioService = class _AudioService {
  constructor() {
    __publicField(this, "sounds", /* @__PURE__ */ new Map());
    __publicField(this, "isMuted", false);
    __publicField(this, "ambienceId", null);
    const savedMute = localStorage.getItem("aigestion_mute");
    if (savedMute) {
      this.isMuted = JSON.parse(savedMute);
      howler.Howler.mute(this.isMuted);
    }
    this.loadSound("hover_glass");
    this.loadSound("click_activate");
  }
  static getInstance() {
    if (!_AudioService.instance) {
      _AudioService.instance = new _AudioService();
    }
    return _AudioService.instance;
  }
  loadSound(type) {
    if (this.sounds.has(type)) {
      return this.sounds.get(type);
    }
    const asset = SOUND_ASSETS[type];
    const sound = new howler.Howl({
      src: [asset.src],
      volume: asset.volume,
      loop: asset.loop,
      preload: true,
      onloaderror: (_id, _err) => {
      }
    });
    this.sounds.set(type, sound);
    return sound;
  }
  play(type) {
    if (this.isMuted && type !== "nexus_hum") {
      return;
    }
    const sound = this.loadSound(type);
    sound.play();
  }
  startAmbience() {
    if (this.isMuted || this.ambienceId) {
      return;
    }
    const sound = this.loadSound("nexus_hum");
    if (!sound.playing()) {
      this.ambienceId = sound.play();
      sound.fade(0, SOUND_ASSETS.nexus_hum.volume, 2e3, this.ambienceId);
    }
  }
  stopAmbience() {
    const sound = this.sounds.get("nexus_hum");
    if (sound && this.ambienceId) {
      sound.fade(sound.volume(), 0, 2e3, this.ambienceId);
      setTimeout(() => {
        sound.stop();
        this.ambienceId = null;
      }, 2e3);
    }
  }
  toggleMute() {
    this.isMuted = !this.isMuted;
    howler.Howler.mute(this.isMuted);
    localStorage.setItem("aigestion_mute", JSON.stringify(this.isMuted));
    if (this.isMuted) {
      this.stopAmbience();
    }
    return this.isMuted;
  }
  getMutedState() {
    return this.isMuted;
  }
};
__publicField(_AudioService, "instance");
let AudioService = _AudioService;
const audioService$1 = AudioService.getInstance();
const SoundControl = () => {
  const [isMuted, setIsMuted] = reactExports.useState(audioService$1.getMutedState());
  const toggleSound = () => {
    const newState = audioService$1.toggleMute();
    setIsMuted(newState);
    if (!newState) {
      audioService$1.play("success_chime");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: toggleSound,
      className: "p-2 text-white/50 hover:text-nexus-cyan transition-colors",
      title: isMuted ? "Unmute Sound" : "Mute Sound",
      children: isMuted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" }) })
    }
  );
};
const Navigation = () => {
  const { playHover, playClick, playWhoosh } = useSoundEffects();
  const [isScrolled, setIsScrolled] = reactExports.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = reactExports.useState(false);
  const location = useLocation();
  reactExports.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navItems = [
    { label: "Hablar con Daniela", path: "/daniela" },
    { label: "Ver en 3D", path: "#viture-xr", isHash: true },
    { label: "Ver mi Oficina", path: "/virtual-office" },
    { label: "Probar el Panel", path: "/demo" }
  ];
  const handleLinkClick = (path, isHash) => {
    playClick();
    setIsMobileMenuOpen(false);
    if (isHash) {
      const element = document.querySelector(path);
      element == null ? void 0 : element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.nav,
    {
      initial: { y: -100 },
      animate: { y: 0 },
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      className: `fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-6"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/",
              onClick: () => handleLinkClick("/"),
              onMouseEnter: playHover,
              className: "group flex items-center gap-0 relative",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-10 h-10 mr-3 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-nexus-violet/50 blur-lg rounded-full opacity-50 group-hover:opacity-100 transition-opacity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: "/website-epic/images/brand/logo.png",
                      alt: "Logo",
                      className: "w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(138,43,226,0.5)]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-center h-10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-orbitron font-black text-xl tracking-[0.1em] leading-none text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-nexus-cyan group-hover:to-nexus-violet transition-all duration-300", children: [
                    "AIGESTION",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-nexus-cyan-glow", children: ".NET" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-mono text-nexus-silver/50 tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1", children: "CONTROL MAESTRO" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:flex items-center gap-8", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.path,
              onClick: (e) => {
                if (item.isHash) {
                  e.preventDefault();
                  handleLinkClick(item.path, true);
                } else {
                  handleLinkClick(item.path);
                }
              },
              onMouseEnter: playHover,
              className: `relative font-orbitron text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 hover:text-white ${location.pathname === item.path ? "text-nexus-cyan" : "text-nexus-silver/70"}`,
              children: [
                item.label,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-1 left-0 w-0 h-[2px] bg-nexus-cyan transition-all duration-300 group-hover:w-full" })
              ]
            },
            item.label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SoundControl, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MagneticWrapper, { strength: 20, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/login",
                onMouseEnter: () => {
                  playHover();
                  playWhoosh();
                },
                onClick: playClick,
                className: "hidden sm:flex group relative items-center gap-3 px-6 py-2.5 overflow-hidden rounded-full bg-white/5 border border-white/10 hover:border-nexus-violet/50 transition-all duration-300",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-nexus-violet/20 via-nexus-cyan/20 to-nexus-violet/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Lock,
                    {
                      size: 14,
                      className: "text-nexus-violet-glow group-hover:text-white transition-colors"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative font-orbitron text-[10px] font-bold tracking-[0.2em] uppercase text-white group-hover:text-shadow-glow", children: "ENTRAR" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ChevronRight,
                    {
                      size: 14,
                      className: "text-nexus-silver/50 group-hover:text-white group-hover:translate-x-1 transition-all"
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "lg:hidden p-2 text-white hover:text-nexus-cyan transition-colors",
                onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
                children: isMobileMenuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 24 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isMobileMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            className: "lg:hidden bg-nexus-obsidian/95 backdrop-blur-xl border-b border-white/10 overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col p-6 gap-4", children: [
              navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: item.path,
                  onClick: (e) => {
                    if (item.isHash) {
                      e.preventDefault();
                      handleLinkClick(item.path, true);
                    } else {
                      handleLinkClick(item.path);
                    }
                  },
                  className: "font-orbitron text-sm font-bold tracking-widest text-nexus-silver hover:text-white hover:pl-2 transition-all border-b border-white/5 pb-4",
                  children: item.label
                },
                item.label
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/login",
                  onClick: () => handleLinkClick("/login"),
                  className: "btn-primary mt-4 w-full justify-center",
                  children: "ENTRAR"
                }
              )
            ] })
          }
        ) })
      ]
    }
  );
};
const NeuralParticles = () => {
  const particles = Array.from({ length: 20 });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 -z-30 pointer-events-none overflow-hidden", children: particles.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "absolute w-1 h-1 bg-nexus-cyan/20 rounded-full",
      initial: {
        x: Math.random() * 100 + "%",
        y: Math.random() * 100 + "%",
        scale: Math.random() * 0.5 + 0.5
      },
      animate: {
        y: ["-10%", "110%"],
        opacity: [0, 0.5, 0],
        x: [null, (Math.random() - 0.5) * 50 + "%"]
      },
      transition: {
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 10
      }
    },
    `particle-${i}`
  )) });
};
const NexusCursor = () => {
  const [isHovering, setIsHovering] = reactExports.useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  reactExports.useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a") || target.classList.contains("interactive")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.body.classList.add("custom-cursor");
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.classList.remove("custom-cursor");
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "fixed top-0 left-0 w-8 h-8 rounded-full border border-nexus-cyan pointer-events-none z-[9999] mix-blend-difference",
        style: {
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovering ? 1.5 : 1
        },
        animate: {
          borderColor: isHovering ? "var(--color-nexus-violet)" : "var(--color-nexus-cyan)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "fixed top-0 left-0 w-2 h-2 bg-nexus-cyan rounded-full pointer-events-none z-[9999] mix-blend-difference",
        style: {
          x: cursorX,
          // No spring for the dot, for prompt feedback
          y: cursorY,
          translateX: 12,
          // Center inside the circle
          translateY: 12
        },
        animate: {
          backgroundColor: isHovering ? "var(--color-nexus-violet)" : "var(--color-nexus-cyan)"
        }
      }
    )
  ] });
};
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 1e-3
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-nexus-violet via-nexus-cyan to-nexus-violet origin-left z-[100]",
      style: { scaleX }
    }
  );
};
const audioService = {
  play: (type) => {
    console.log(`[AudioService] Playing: ${type} (silent mode)`);
  },
  startAmbience: () => {
    console.log("[AudioService] Ambience started (silent mode)");
  },
  stopAmbience: () => {
    console.log("[AudioService] Ambience stopped (silent mode)");
  },
  toggleMute: () => {
    console.log("[AudioService] Mute toggled (silent mode)");
    return false;
  },
  getMutedState: () => false
};
const useSound = () => {
  const play = reactExports.useCallback((type) => {
    try {
      audioService.play(type);
    } catch (error) {
    }
  }, []);
  const playHover = reactExports.useCallback(() => play("hover_glass"), [play]);
  const playClick = reactExports.useCallback(() => play("click_activate"), [play]);
  const playWuaw = reactExports.useCallback(() => play("wuaw_subtle"), [play]);
  const playPulse = reactExports.useCallback(() => play("data_pulse"), [play]);
  return {
    play,
    playHover,
    playClick,
    playWuaw,
    playPulse
  };
};
const SpatialPresentation = ({ modelUrl, posterUrl, title }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "spatial-container flex flex-col items-center justify-center p-4 bg-nexus-obsidian/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-orbitron text-glow mb-4", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "model-viewer-wrapper w-full aspect-square relative rounded-2xl overflow-hidden bg-black/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "model-viewer",
      {
        src: modelUrl,
        poster: posterUrl,
        alt: title,
        ar: true,
        "ar-modes": "webxr scene-viewer quick-look",
        "camera-controls": true,
        "auto-rotate": true,
        "shadow-intensity": "1",
        style: { width: "100%", height: "100%", backgroundColor: "transparent" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { slot: "ar-button", className: "absolute bottom-4 right-4 bg-nexus-violet px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🚀 VER EN AR" }) })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "viture-info mt-6 p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-nexus-silver text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Optimizado para ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Viture One XR" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-60 text-xs mt-1", children: "HFOV 43° | Proyección Espacial Activa" })
    ] })
  ] });
};
const AR_ASSETS = [
  {
    id: "core-server",
    name: "Nexus Nucleus v1",
    description: "El corazón de AIGestion. Procesamiento neuronal distribuido de alto rendimiento.",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    // Placeholder for actual assets
    posterUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.png",
    category: "HARDWARE"
  },
  {
    id: "drone",
    name: "AIG Sentinel Drone",
    description: "Vigilancia y mantenimiento automatizado en entornos XR.",
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    posterUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.png",
    category: "INFRASTRUCTURE"
  },
  {
    id: "satellite",
    name: "Neural Satellite",
    description: "Nodo orbital para la sincronización global de inteligencia soberana.",
    modelUrl: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
    posterUrl: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.png",
    category: "ORBITAL"
  }
];
const ARProjectionLab = () => {
  const [selectedAsset, setSelectedAsset] = reactExports.useState(AR_ASSETS[0]);
  const [isScanning, setIsScanning] = reactExports.useState(false);
  const handleProjection = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex flex-col lg:flex-row gap-12 items-center lg:items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full lg:w-2/3 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !isScanning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        className: "relative aspect-video rounded-3xl overflow-hidden glass-morphism border border-white/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SpatialPresentation,
            {
              modelUrl: selectedAsset.modelUrl,
              posterUrl: selectedAsset.posterUrl,
              title: selectedAsset.name
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-6 left-6 flex flex-col gap-2 pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-cyan-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full self-start", children: "ASSET READY" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]", children: [
              "ID: ",
              selectedAsset.id.toUpperCase()
            ] })
          ] })
        ]
      },
      selectedAsset.id
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "relative aspect-video rounded-3xl overflow-hidden glass-morphism border border-cyan-400/30 flex flex-col items-center justify-center bg-cyan-400/5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "w-32 h-32 border-2 border-cyan-400/40 rounded-full",
                animate: { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] },
                transition: { duration: 2, repeat: Infinity }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Scan, { className: "w-12 h-12 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-cyan-400 font-orbitron tracking-[0.4em] text-xs", children: "CALIBRANDO ESPACIO REAL..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "absolute left-0 right-0 h-1 bg-cyan-400/50 shadow-[0_0_15px_#00f5ff]",
              animate: { top: ["0%", "100%", "0%"] },
              transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
            }
          )
        ]
      },
      "scanning"
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-1/3 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquareDashed, { className: "w-6 h-6 text-cyan-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-orbitron font-bold text-white uppercase tracking-tighter", children: "LABORATORIO DE PROYECCIÓN" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver/70 text-sm leading-relaxed", children: "Selecciona un activo de la infraestructura Nexus y proyéctalo en tu entorno físico para análisis detallado." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: AR_ASSETS.map((asset) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setSelectedAsset(asset),
          className: `p-4 rounded-2xl border transition-all flex items-start gap-4 text-left group
                ${selectedAsset.id === asset.id ? "bg-cyan-400/10 border-cyan-400/50 shadow-[0_0_20px_rgba(0,245,255,0.1)]" : "bg-white/5 border-white/10 hover:border-white/30"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 rounded-xl transition-colors ${selectedAsset.id === asset.id ? "bg-cyan-400 text-black" : "bg-white/5 text-white/50 group-hover:text-white"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-white mb-1", children: asset.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-white/40 uppercase tracking-widest", children: asset.category })
            ] })
          ]
        },
        asset.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-morphism p-6 rounded-3xl border border-white/10 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-cyan-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider", children: "Detalles del Activo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-nexus-silver/90 leading-relaxed italic", children: [
          '"',
          selectedAsset.description,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-white/40 uppercase mb-1", children: "Escala" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-white text-glow", children: "1:1 REAL" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-white/40 uppercase mb-1", children: "Tracking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-white text-glow", children: "SPATIAL+" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.button,
        {
          onClick: handleProjection,
          disabled: isScanning,
          className: "w-full py-6 rounded-full glass-morphism border border-cyan-400/50 text-cyan-400 font-orbitron font-bold tracking-[0.2em] flex items-center justify-center gap-3 group hover:bg-cyan-400 hover:text-black transition-all",
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-5 h-5 group-hover:scale-125 transition-transform" }),
            isScanning ? "DIAGNOSTICANDO..." : "PROYECTAR EN MI MAPA"
          ]
        }
      )
    ] })
  ] });
};
const HUDCornerIndicator = ({ position, label, value, icon }) => {
  const classes = {
    "top-left": "top-8 left-8 border-t-2 border-l-2",
    "top-right": "top-8 right-8 border-t-2 border-r-2 text-right",
    "bottom-left": "bottom-8 left-8 border-b-2 border-l-2",
    "bottom-right": "bottom-8 right-8 border-b-2 border-r-2 text-right"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `fixed p-4 border-cyan-400/40 z-50 pointer-events-none transition-all duration-500 scale-90 md:scale-100 ${classes[position]}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1 text-cyan-400/60 font-orbitron text-[10px] tracking-[0.2em] uppercase", children: [
          position.includes("left") ? icon : null,
          label,
          position.includes("right") ? icon : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyan-400 font-mono text-sm font-bold tracking-widest bg-cyan-400/5 px-2 py-1 rounded", children: value })
      ]
    }
  );
};
const BootSequence = ({ onComplete }) => {
  const [stage, setStage] = reactExports.useState(0);
  const stages = [
    { text: "SCANNING RETINA...", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, { className: "w-8 h-8" }) },
    { text: "CONNECTING NEURAL LINK...", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-8 h-8" }) },
    { text: "CALIBRATING VITURE OPTICS...", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "w-8 h-8" }) },
    { text: "SYNC COMPLETE. WELCOME TO NEXUS.", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-8 h-8" }) }
  ];
  reactExports.useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        clearInterval(timer);
        setTimeout(onComplete, 1e3);
        return prev;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [onComplete]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute -inset-12 border-2 border-cyan-500/20 rounded-full",
            animate: { rotate: 360, scale: [1, 1.1, 1] },
            transition: { duration: 4, repeat: Infinity, ease: "linear" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "absolute -inset-8 border-2 border-purple-500/20 rounded-full",
            animate: { rotate: -360, scale: [1, 1.05, 1] },
            transition: { duration: 6, repeat: Infinity, ease: "linear" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            className: "relative z-10 p-12 glass-morphism rounded-full border border-cyan-500/30 text-cyan-400 flex flex-col items-center gap-6",
            children: [
              stages[stage].icon,
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-orbitron tracking-[0.3em] text-xs font-bold text-center max-w-[200px]", children: stages[stage].text }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-1 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  className: "h-full bg-cyan-400",
                  initial: { width: 0 },
                  animate: { width: "100%" },
                  transition: { duration: 1.2, ease: "linear" }
                }
              ) })
            ]
          },
          stage
        )
      ] })
    }
  );
};
const VitureXRExperience = () => {
  const [isXRActive, setIsXRActive] = reactExports.useState(false);
  const [isBooting, setIsBooting] = reactExports.useState(false);
  const [activeMode, setActiveMode] = reactExports.useState("experiences");
  const [currentExperience, setCurrentExperience] = reactExports.useState(0);
  const [immersionLevel, setImmersionLevel] = reactExports.useState(0);
  const containerRef = reactExports.useRef(null);
  const { playHover, playClick, playWuaw, playPulse, play } = useSound();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const experiences = [
    {
      id: "quantum-leap",
      title: "SALTO CUÁNTICO",
      subtitle: "Antes: 2D → Después: 11D",
      description: "Experimenta la computación cuántica en 11 dimensiones. Ve los datos fluyendo como ríos de luz interactivos.",
      beforeIcon: "📱",
      afterIcon: "🌌",
      color: "from-purple-600 to-violet-800",
      particles: 100,
      badge: "EXPERIMENTAL"
    },
    {
      id: "neural-interface",
      title: "INTERFAZ NEURAL",
      subtitle: "Antes: Teclado → Después: Mente",
      description: "Conecta directamente con tu cerebro. Controla sistemas con el poder de tus pensamientos y biometría activa.",
      beforeIcon: "⌨️",
      afterIcon: "🧠",
      color: "from-cyan-600 to-blue-800",
      particles: 150,
      badge: "SYNC ACTIVE"
    },
    {
      id: "metaverse-office",
      title: "OFICINA METAVERSO",
      subtitle: "Antes: Cubículo → Después: Infinito",
      description: "Tu oficina ahora es el universo entero. Reuniones en galaxias lejanas con colaboración holográfica.",
      beforeIcon: "🏢",
      afterIcon: "🪐",
      color: "from-green-600 to-emerald-800",
      particles: 200,
      badge: "WORKSPACE"
    },
    {
      id: "war-room",
      title: "WAR ROOM ESTRATÉGICO",
      subtitle: "Antes: Excel → Después: Campo de Batalla Digital",
      description: "Visualiza tu empresa como un organismo vivo. Toma decisiones en tiempo real con mapas tácticos globales.",
      beforeIcon: "📊",
      afterIcon: "🗺️",
      color: "from-red-600 to-orange-800",
      particles: 250,
      badge: "TACTICAL"
    }
  ];
  const handleMouseMove = reactExports.useCallback(
    (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 40;
      const y = (clientY / innerHeight - 0.5) * 40;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );
  reactExports.useEffect(() => {
    if (isXRActive) {
      const interval = setInterval(() => {
        setImmersionLevel((prev) => prev < 100 ? prev + 1 : 100);
      }, 30);
      play("nexus_hum");
      return () => {
        clearInterval(interval);
      };
    } else {
      setImmersionLevel(0);
    }
  }, [isXRActive, play]);
  const handleXREnter = () => {
    playWuaw();
    setIsBooting(true);
  };
  const finishBoot = () => {
    var _a2;
    setIsBooting(false);
    setIsXRActive(true);
    playPulse();
    if ((_a2 = containerRef.current) == null ? void 0 : _a2.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => console.log("Fullscreen failed"));
    }
    document.body.style.cursor = "none";
    document.body.classList.add("xr-active");
  };
  const handleXRExit = () => {
    playClick();
    setIsXRActive(false);
    setImmersionLevel(0);
    document.body.style.cursor = "auto";
    document.body.classList.remove("xr-active");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };
  const currentExp = experiences[currentExperience];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "viture-xr",
      className: "relative min-h-screen overflow-hidden bg-black selection:bg-cyan-500/30",
      onMouseMove: isXRActive ? handleMouseMove : void 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isBooting && /* @__PURE__ */ jsxRuntimeExports.jsx(BootSequence, { onComplete: finishBoot }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-cyan-900/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", children: [...Array(currentExp.particles)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: `absolute w-1 h-1 bg-gradient-to-r ${currentExp.color} rounded-full blur-[1px]`,
              style: {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              },
              animate: {
                z: [0, 100, 0],
                y: [0, -400],
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0]
              },
              transition: {
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5
              }
            },
            i
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "absolute inset-x-[-10%] inset-y-[-10%] z-[-1] opacity-20 pointer-events-none",
              style: { x: springX, y: springY },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-[url('/images/nexus/grid.svg')] bg-repeat opacity-30" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, className: "relative z-10 min-h-screen flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isXRActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HUDCornerIndicator,
              {
                position: "top-left",
                label: "Signal",
                value: "SIGNAL: 98% AC",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-3 h-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HUDCornerIndicator,
              {
                position: "top-right",
                label: "Retina",
                value: "ID: ALEX-01-GOD",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-3 h-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HUDCornerIndicator,
              {
                position: "bottom-left",
                label: "Power",
                value: "CELL: 84% CRYO",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Battery, { className: "w-3 h-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HUDCornerIndicator,
              {
                position: "bottom-right",
                label: "Core",
                value: "TEMP: 32°C KELV",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-3 h-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed top-12 left-1/2 -translate-x-1/2 flex gap-4 z-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    playClick();
                    setActiveMode("experiences");
                  },
                  className: `px-6 py-2 rounded-full font-orbitron text-[10px] tracking-[0.2em] transition-all border ${activeMode === "experiences" ? "bg-cyan-400 text-black border-cyan-400" : "bg-black/50 text-cyan-400 border-cyan-400/30"}`,
                  children: "EXPERIENCIAS"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    playClick();
                    setActiveMode("ar_projection");
                  },
                  className: `px-6 py-2 rounded-full font-orbitron text-[10px] tracking-[0.2em] transition-all border ${activeMode === "ar_projection" ? "bg-purple-600 text-white border-purple-600" : "bg-black/50 text-purple-400 border-purple-600/30"}`,
                  children: "PROYECCIÓN AR"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 glass-morphism border border-white/20 rounded-full font-orbitron text-[10px] tracking-[0.4em] text-white/40 uppercase z-50 pointer-events-none",
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 20 },
                children: activeMode === "experiences" ? `PROCESADOR NEURAL ACTIVO // MODO XR NIVEL ${immersionLevel}` : "LABORATORIO DE PROYECCIÓN ACTIVO // MAPEO ESPACIAL"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: `flex-1 flex flex-col items-center justify-center p-6 w-full max-w-7xl transition-all duration-1000 ${isXRActive ? "scale-95" : "scale-100"}`,
              style: { x: isXRActive ? springX : 0, y: isXRActive ? springY : 0 },
              children: !isXRActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    className: "inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 shadow-[0_0_20px_rgba(138,43,226,0.2)] border border-purple-400/30 rounded-full mb-8",
                    initial: { scale: 0.8 },
                    animate: { scale: 1 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-orbitron text-[10px] font-bold tracking-[0.2em] uppercase", children: "Viture Pro XR Ready" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-6xl md:text-9xl font-orbitron font-black text-white mb-6 leading-none", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40", children: "EXPERIENCIA" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-[length:200%_auto] animate-gradient-flow", children: "VITURE XR" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-nexus-silver/60 mb-12 max-w-2xl mx-auto font-light leading-relaxed italic", children: '"No es solo ver el futuro; es vivir dentro de él con la precisión de 11 dimensiones."' }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.button,
                  {
                    onClick: handleXREnter,
                    className: "group relative px-12 py-6 glass-morphism rounded-full text-white font-bold text-xl overflow-hidden border border-white/20 transition-all hover:border-cyan-400/50",
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    onMouseEnter: playHover,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative z-10 flex items-center gap-4 tracking-[0.1em]", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-6 h-6 text-cyan-400" }),
                        "ENTRAR EN LA MATRIZ"
                      ] })
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: activeMode === "experiences" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    className: "relative aspect-video rounded-3xl overflow-hidden glass-morphism border border-white/10 group",
                    initial: { opacity: 0, x: -50 },
                    animate: { opacity: 1, x: 0 },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `absolute inset-0 bg-gradient-to-br ${currentExp.color} opacity-40 mix-blend-overlay`
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center p-12", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.div,
                          {
                            className: "text-8xl mb-8",
                            animate: { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] },
                            transition: { duration: 4, repeat: Infinity },
                            children: currentExp.afterIcon
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-cyan-400 tracking-[0.5em] uppercase mb-4 block", children: currentExp.badge }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-4xl font-orbitron font-bold text-white mb-2", children: currentExp.title }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver/80 italic", children: currentExp.subtitle })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.div,
                        {
                          className: "absolute left-0 right-0 h-1 bg-cyan-400/50 blur-[2px] z-20",
                          animate: { top: ["0%", "100%"] },
                          transition: { duration: 3, repeat: Infinity, ease: "linear" }
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-12", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: experiences.map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          playClick();
                          setCurrentExperience(idx);
                        },
                        className: `w-3 h-3 rounded-full transition-all duration-500 ${currentExperience === idx ? "bg-cyan-400 w-12" : "bg-white/20 hover:bg-white/40"}`
                      },
                      idx
                    )) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h3",
                      {
                        className: `text-4xl md:text-6xl font-orbitron font-black bg-gradient-to-r ${currentExp.color} bg-clip-text text-transparent`,
                        children: currentExp.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver/90 text-xl font-light leading-relaxed", children: currentExp.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-6", children: [
                    {
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PanelsTopLeft, { className: "w-5 h-5" }),
                      label: "Holografía",
                      val: "Activa"
                    },
                    { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5" }), label: "Latencia", val: "0.1ms" },
                    {
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "w-5 h-5" }),
                      label: "Resolución",
                      val: "8K Spatial"
                    },
                    {
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5" }),
                      label: "Seguridad",
                      val: "E2E Quantum"
                    }
                  ].map((feat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "glass-morphism p-4 rounded-2xl border border-white/5 flex items-center gap-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-cyan-400", children: feat.icon }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-white/40 uppercase tracking-tighter", children: feat.label }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-white tracking-widest", children: feat.val })
                        ] })
                      ]
                    },
                    i
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.button,
                    {
                      onClick: handleXRExit,
                      className: "px-8 py-4 border border-red-500/30 text-red-500 rounded-full font-orbitron text-xs font-bold tracking-[0.2em] hover:bg-red-500/10 transition-colors",
                      children: "TERMINAR SESIÓN XR"
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ARProjectionLab, {}) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isXRActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "fixed inset-0 pointer-events-none z-40",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-radial-at-center from-transparent via-transparent to-black/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-10 mix-blend-screen bg-gradient-to-r from-red-500/10 via-green-500/10 to-blue-500/10" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[url('/images/nexus/scanlines.svg')] opacity-[0.03] pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 border border-cyan-400/50 rounded-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-400/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-400/50" })
              ] })
            ]
          }
        ) })
      ]
    }
  );
};
const WorkbenchContext = reactExports.createContext(void 0);
const WorkbenchProvider = ({ children }) => {
  const [activeActivity, setActiveActivity] = reactExports.useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = reactExports.useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleActivityChange = (id) => {
    if (activeActivity === id) {
      toggleSidebar();
    } else {
      setActiveActivity(id);
      setSidebarOpen(true);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    WorkbenchContext.Provider,
    {
      value: {
        activeActivity,
        setActiveActivity: handleActivityChange,
        isSidebarOpen,
        toggleSidebar,
        setSidebarOpen
      },
      children
    }
  );
};
const useWorkbench = () => {
  const context = reactExports.useContext(WorkbenchContext);
  if (!context) {
    throw new Error("useWorkbench must be used within a WorkbenchProvider");
  }
  return context;
};
const WorkbenchShell = ({
  activityBar,
  sideBar,
  mainArea,
  bottomPanel,
  statusBar
}) => {
  const { isSidebarOpen } = useWorkbench();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-screen w-screen overflow-hidden bg-[#050505] text-white selection:bg-cyan-500/30 font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 pointer-events-none z-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen opacity-50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/10 blur-[150px] rounded-full mix-blend-screen opacity-50" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden z-10 backdrop-blur-[1px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "w-[60px] flex-shrink-0 border-r border-white/5 bg-[#0a0a0a]/90 backdrop-blur-xl z-30 flex flex-col justify-between shadow-[4px_0_30px_rgba(0,0,0,0.5)]", children: activityBar }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.aside,
        {
          initial: false,
          animate: { width: isSidebarOpen ? 300 : 0, opacity: isSidebarOpen ? 1 : 0 },
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          className: "flex-shrink-0 border-r border-white/5 bg-[#0e0e0e]/80 backdrop-blur-md overflow-hidden relative",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[300px] h-full relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-50" }),
            sideBar
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden relative rounded-tl-xl border-t border-l border-white/5 bg-[#121212]/60 backdrop-blur-sm shadow-inner mx-1 mt-1 transition-all", children: mainArea }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: bottomPanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0 },
            animate: { height: 200 },
            exit: { height: 0 },
            className: "h-[200px] border-t border-white/10 bg-[#1e1e1e]",
            children: bottomPanel
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "h-[24px] bg-[#007acc]/90 backdrop-blur-md text-white text-[10px] flex items-center px-3 select-none z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] justify-between border-t border-white/10", children: statusBar })
  ] });
};
const ActivityBar = () => {
  const { activeActivity, setActiveActivity } = useWorkbench();
  const activities = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "search", icon: Search, label: "Search" },
    { id: "ai", icon: Bot, label: "Daniela AI" },
    { id: "files", icon: FolderGit2, label: "Projects" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-4 h-full justify-between w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-6 w-full", children: activities.map((item) => {
      const Icon = item.icon;
      const isActive = activeActivity === item.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveActivity(item.id),
          title: item.label,
          className: `relative group p-2 transition-all duration-300 w-full flex justify-center
                 ${isActive ? "text-cyan-400" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}
               `,
          children: [
            isActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[24px] bg-cyan-400 rounded-r-full shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-cyan-400/5 blur-lg" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Icon,
              {
                size: 26,
                strokeWidth: isActive ? 2 : 1.5,
                className: `transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" : "group-hover:scale-105"}`
              }
            )
          ]
        },
        item.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-6 w-full pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setActiveActivity("settings"),
        title: "Settings",
        className: `p-2 transition-colors relative ${activeActivity === "settings" ? "text-purple-400" : "text-gray-500 hover:text-white hover:rotate-90 duration-500"}`,
        children: [
          activeActivity === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-purple-500/10 blur-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Settings,
            {
              size: 24,
              strokeWidth: 1.5,
              className: activeActivity === "settings" ? "drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" : ""
            }
          )
        ]
      }
    ) })
  ] });
};
const DanielaPanel = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-white/5 flex items-center gap-2 bg-white/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 14, className: "text-purple-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold tracking-wider text-purple-100 uppercase", children: "Daniela AI Assistant" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0 border border-purple-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-purple-300", children: "AI" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/5 p-3 rounded-tr-xl rounded-b-xl border border-white/10 text-sm text-gray-300 leading-relaxed max-w-[90%] shadow-lg backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Hello! I'm integrated into your workbench. I can help you analyze metrics, refactor code, or manage deployment tasks. What's on your mind?" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-row-reverse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-cyan-600/20 flex items-center justify-center shrink-0 border border-cyan-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-cyan-300", children: "ME" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-cyan-500/10 p-3 rounded-tl-xl rounded-b-xl border border-cyan-500/20 text-sm text-cyan-100 leading-relaxed shadow-[0_0_15px_rgba(6,182,212,0.1)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Analyze the current bundle size for me." }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-t border-white/10 bg-[#151515]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Ask Daniela...",
            className: "w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-900/50 transition-all shadow-inner text-gray-200"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-1.5 hover:bg-purple-500/20 rounded text-purple-400 hover:text-purple-200 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14 }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-gray-600 mt-2 flex justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-pointer hover:text-purple-400 transition-colors", children: "Generate Component" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-pointer hover:text-purple-400 transition-colors", children: "Fix Bugs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "cursor-pointer hover:text-purple-400 transition-colors", children: [
          " ",
          "Explain Code"
        ] })
      ] })
    ] })
  ] });
};
const SideBar = () => {
  const { activeActivity } = useWorkbench();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col font-sans", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[40px] flex items-center px-4 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200/50 select-none border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent shadow-sm", children: activeActivity }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent", children: [
      activeActivity === "dashboard" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-[10px] font-bold text-gray-500 uppercase opacity-70 tracking-widest", children: "Main Views" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 px-2", children: ["Overview", "Analytics", "Real-time", "System Health"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "cursor-pointer hover:bg-cyan-500/10 hover:text-cyan-300 text-gray-400 p-2 rounded-md transition-all duration-200 flex items-center gap-3 group border border-transparent hover:border-cyan-500/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-cyan-500/20 group-hover:bg-cyan-400 transition-colors shadow-[0_0_5px_rgba(6,182,212,0)] group-hover:shadow-[0_0_8px_rgba(6,182,212,0.5)]" }),
              item
            ]
          },
          item
        )) })
      ] }),
      activeActivity === "ai" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DanielaPanel, {}) }),
      activeActivity === "search" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search anything...",
            className: "w-full bg-[#181818] border border-[#303030] text-gray-200 text-xs p-2.5 pl-3 rounded-md focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-900/50 placeholder:text-gray-600 transition-all shadow-inner group-hover:bg-[#1f1f1f]"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-2 top-2.5 text-[10px] text-gray-600 bg-[#222] px-1.5 rounded border border-[#333] opacity-70", children: "Ctrl+F" })
      ] }) })
    ] })
  ] });
};
const useEnhancedVoiceAssistant = (_options) => {
  const [status, setStatus] = reactExports.useState("idle");
  const [messages, setMessages] = reactExports.useState([]);
  const [emotionalAnalysis, setEmotionalAnalysis] = reactExports.useState(null);
  const [suggestedActions, setSuggestedActions] = reactExports.useState([]);
  const [isRecording, setIsRecording] = reactExports.useState(false);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const mockEmotionalAnalysis = {
    emotion: "neutral",
    confidence: 0.85,
    sentiment: "positive"
  };
  const mockSuggestedActions = [
    { id: "1", text: "Ver dashboard principal", type: "navigation", priority: "high", context: "main" },
    { id: "2", text: "Analizar métricas", type: "analysis", priority: "medium", context: "analytics" },
    { id: "3", text: "Contactar soporte", type: "support", priority: "low", context: "help" }
  ];
  reactExports.useEffect(() => {
    setStatus("connecting");
    setTimeout(() => {
      setStatus("active");
      setEmotionalAnalysis(mockEmotionalAnalysis);
      setSuggestedActions(mockSuggestedActions);
    }, 1e3);
  }, []);
  const startRecording = reactExports.useCallback(async () => {
    if (isRecording) return;
    setIsRecording(true);
    setError(null);
    setTimeout(() => {
      const mockMessage = {
        id: Date.now().toString(),
        role: "user",
        content: "Hola Daniela, ¿cómo estás?",
        timestamp: /* @__PURE__ */ new Date(),
        emotionalAnalysis: mockEmotionalAnalysis
      };
      setMessages((prev) => [...prev, mockMessage]);
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "¡Hola! Estoy perfectamente, gracias por preguntar. ¿En qué puedo ayudarte hoy?",
          timestamp: /* @__PURE__ */ new Date(),
          emotionalAnalysis: mockEmotionalAnalysis
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsRecording(false);
      }, 1500);
    }, 2e3);
  }, [isRecording]);
  const stopRecording = reactExports.useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);
  }, [isRecording]);
  const sendTextMessage = reactExports.useCallback(async (text) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: /* @__PURE__ */ new Date(),
      emotionalAnalysis: mockEmotionalAnalysis
    };
    setMessages((prev) => [...prev, userMessage]);
    setTimeout(() => {
      const responses = [
        "Entendido. Estoy procesando tu solicitud.",
        "He analizado tu petión. Aquí está la respuesta.",
        "Interesante. Déjame generar un reporte para ti.",
        "Perfecto. Ejecutando la acción solicitada.",
        "Comprendido. ¿Hay algo más en lo que pueda ayudarte?"
      ];
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: /* @__PURE__ */ new Date(),
        emotionalAnalysis: mockEmotionalAnalysis
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1e3);
  }, [isProcessing]);
  const clearConversation = reactExports.useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);
  return {
    status,
    messages,
    emotionalAnalysis,
    suggestedActions,
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    sendTextMessage,
    clearConversation
  };
};
const useDanielaVoice = () => {
  const [isListening, setIsListening] = reactExports.useState(false);
  const [transcript, setTranscript] = reactExports.useState("");
  const [isSpeaking, setIsSpeaking] = reactExports.useState(false);
  const toggleListening = reactExports.useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening]);
  const startListening = () => {
    setIsListening(true);
    const { webkitSpeechRecognition } = window;
    if (!webkitSpeechRecognition) return;
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const results = event.results;
      const transcript2 = results[results.length - 1][0].transcript;
      setTranscript(transcript2);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  };
  const stopListening = () => {
    setIsListening(false);
  };
  const speak = (text) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 1;
    utterance.pitch = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find((v) => v.name.includes("Female") || v.name.includes("Google Español"));
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };
  return { isListening, transcript, isSpeaking, toggleListening, speak };
};
const DanielaConversationPanel = () => {
  const [messages, setMessages] = reactExports.useState([
    { role: "ai", text: "Hola, soy Daniela. ¿En qué puedo ayudarte hoy?" }
  ]);
  const [input, setInput] = reactExports.useState("");
  const { isListening, transcript, isSpeaking, toggleListening, speak } = useDanielaVoice();
  const messagesEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);
  reactExports.useEffect(() => {
    var _a2;
    (_a2 = messagesEndRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      const responses = [
        "Entendido. Estoy procesando esa solicitud.",
        "He actualizado los parámetros del sistema según tus indicaciones.",
        "Analizando los datos... Aquí tienes el reporte.",
        "Excelente elección. Procediendo con la ejecución.",
        "Sistemas nominales. ¿Deseas algo más?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { role: "ai", text: randomResponse }]);
      speak(randomResponse);
    }, 1e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-white/5 flex justify-between items-center bg-black/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full overflow-hidden border-2 border-nexus-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/website-epic/images/daniela-avatar.jpg",
              alt: "Daniela",
              className: "w-full h-full object-cover",
              onError: (e) => e.currentTarget.src = "https://ui-avatars.com/api/?name=Daniela+AI&background=00f5ff&color=fff"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-bold text-sm", children: "Daniela AI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-cyan text-xs font-mono", children: "ONLINE // V2.4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: isSpeaking && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 h-3 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "w-1 bg-nexus-cyan",
            animate: { height: [4, 12, 4] },
            transition: { repeat: Infinity, duration: 0.5 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "w-1 bg-nexus-cyan",
            animate: { height: [6, 10, 2] },
            transition: { repeat: Infinity, duration: 0.4 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "w-1 bg-nexus-cyan",
            animate: { height: [2, 8, 3] },
            transition: { repeat: Infinity, duration: 0.6 }
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
      messages.map((msg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-nexus-violet/20 text-white rounded-tr-sm border border-nexus-violet/30" : "bg-white/10 text-gray-200 rounded-tl-sm border border-white/5"}`,
              children: msg.text
            }
          )
        },
        idx
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-white/5 bg-black/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: toggleListening,
          className: `p-3 rounded-full transition-all ${isListening ? "bg-red-500/20 text-red-400 animate-pulse border border-red-500/50" : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"}`,
          children: isListening ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleStop, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleSend(),
          placeholder: "Escribe un mensaje...",
          className: "flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-white text-sm focus:outline-none focus:border-nexus-cyan/50 placeholder-gray-500"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: handleSend,
          className: "p-3 bg-nexus-cyan text-black rounded-full hover:bg-cyan-400 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 18 })
        }
      )
    ] }) })
  ] });
};
const Dashboard = ({ user, onLogout }) => {
  var _a2, _b2;
  const [activeTab, setActiveTab] = reactExports.useState("daniela");
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  const {
    status,
    messages,
    emotionalAnalysis,
    suggestedActions,
    isProcessing
  } = useEnhancedVoiceAssistant({
    userId: user.email
  });
  const menuItems = [
    {
      id: "daniela",
      label: "Daniela AI",
      icon: Brain,
      color: "from-nexus-cyan to-nexus-violet"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: ChartColumn,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "settings",
      label: "Configuración",
      icon: Settings,
      color: "from-orange-500 to-red-600"
    }
  ];
  const subscriptionColors = {
    free: "text-nexus-silver",
    premium: "text-nexus-violet",
    enterprise: "text-nexus-gold"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-nexus-obsidian text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden fixed top-4 left-4 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setSidebarOpen(!sidebarOpen),
        className: "p-2 rounded-lg bg-white/5 backdrop-blur-3xl border border-white/10",
        children: sidebarOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setSidebarOpen(false),
          className: "lg:hidden fixed inset-0 bg-black/50 z-40"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.aside,
        {
          initial: { x: -300 },
          animate: { x: 0 },
          exit: { x: -300 },
          transition: { type: "spring", damping: 25 },
          className: `fixed lg:relative z-50 w-72 h-screen bg-nexus-obsidian-deep border-r border-white/10 ${sidebarOpen ? "block" : "hidden lg:block"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-6 h-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-white", children: user.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-nexus-silver", children: user.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3 text-nexus-cyan" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${subscriptionColors[user.subscription]}`, children: user.subscription.toUpperCase() })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: menuItems.map((item) => {
              const Icon = item.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  },
                  className: `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? `bg-linear-to-r ${item.color} text-white shadow-lg` : "text-nexus-silver hover:bg-white/5 hover:text-white"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: item.label })
                  ]
                },
                item.id
              );
            }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-nexus-silver text-sm", children: "Conversaciones" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-semibold", children: messages.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-nexus-silver text-sm", children: "Estado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-medium ${isProcessing ? "text-yellow-400" : status === "active" ? "text-green-400" : status === "error" ? "text-red-400" : "text-nexus-silver"}`, children: isProcessing ? "Procesando" : status === "active" ? "Activo" : status === "error" ? "Error" : "Inactivo" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-nexus-silver text-sm", children: "Suscripción" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${subscriptionColors[user.subscription]}`, children: user.subscription })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4 border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: onLogout,
                className: "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-nexus-silver hover:bg-white/5 hover:text-white transition-all",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-5 h-5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cerrar Sesión" })
                ]
              }
            ) })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:ml-72 min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-nexus-obsidian-deep border-b border-white/10 px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-orbitron font-bold text-white", children: (_a2 = menuItems.find((item) => item.id === activeTab)) == null ? void 0 : _a2.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-nexus-silver text-sm mt-1", children: [
            activeTab === "daniela" && "Tu asistente de IA emocional",
            activeTab === "analytics" && "Métricas y análisis de uso",
            activeTab === "settings" && "Configuración de tu cuenta"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${isProcessing ? "bg-yellow-400 animate-pulse" : status === "active" ? "bg-green-400" : status === "error" ? "bg-red-400" : "bg-nexus-silver"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-nexus-silver hidden sm:block", children: isProcessing ? "Procesando..." : status === "active" ? "Daniela Activa" : status === "error" ? "Error" : "Inactivo" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white", children: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-nexus-silver", children: user.subscription })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
        activeTab === "daniela" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.3 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(DanielaConversationPanel, {})
          },
          "daniela"
        ),
        activeTab === "analytics" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.3 },
            className: "space-y-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Conversaciones" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-5 h-5 text-nexus-cyan" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-white", children: messages.length }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver text-sm", children: "Total este mes" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Estado Emocional" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-green-400" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-white", children: ((_b2 = emotionalAnalysis == null ? void 0 : emotionalAnalysis.emotion) == null ? void 0 : _b2.toUpperCase()) || "NEUTRAL" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-nexus-silver text-sm", children: [
                    "Confianza: ",
                    (emotionalAnalysis == null ? void 0 : emotionalAnalysis.confidence) ? `${Math.round(emotionalAnalysis.confidence * 100)}%` : "N/A"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Sugerencias" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-5 h-5 text-nexus-violet" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-white", children: suggestedActions.length }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver text-sm", children: "Acciones disponibles" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-white", children: "Suscripción" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-nexus-gold" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-white uppercase", children: user.subscription }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver text-sm", children: "Plan actual" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-white mb-6", children: "Actividad Reciente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 flex items-center justify-center text-nexus-silver", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Gráficos de actividad próximamente" })
                ] }) })
              ] })
            ]
          },
          "analytics"
        ),
        activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.3 },
            className: "space-y-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-white mb-6", children: "Configuración de Cuenta" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-nexus-silver mb-2", children: "Nombre" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "text",
                        defaultValue: user.name,
                        className: "w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-nexus-silver mb-2", children: "Email" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "email",
                        defaultValue: user.email,
                        disabled: true,
                        className: "w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-nexus-silver cursor-not-allowed"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-nexus-silver mb-2", children: "Suscripción Actual" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-white/5 border border-white/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-medium", children: user.subscription }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "px-4 py-2 bg-linear-to-r from-nexus-cyan to-nexus-violet text-white rounded-lg text-sm font-medium hover:from-nexus-cyan/80 hover:to-nexus-violet/80 transition-all", children: "Actualizar" })
                    ] }) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-white mb-6", children: "Preferencias de Daniela" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-nexus-silver mb-2", children: "Voz de Daniela" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Bella (Default)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Adam" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Domi" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Elli" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Emily" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-nexus-silver mb-2", children: "Idioma" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-nexus-cyan/50", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Español" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "English" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Português" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm font-medium text-nexus-silver mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        defaultChecked: true,
                        className: "rounded border-white/10 bg-white/5 text-nexus-cyan"
                      }
                    ),
                    "Notificaciones por email"
                  ] }) })
                ] })
              ] })
            ]
          },
          "settings"
        )
      ] }) })
    ] })
  ] });
};
const WorkspaceArea = ({ user, onLogout }) => {
  const { activeActivity } = useWorkbench();
  const renderContent = () => {
    switch (activeActivity) {
      case "dashboard":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, { user, onLogout });
      case "search":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-gray-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-light mb-2", children: "Global Search" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Search results will appear here" })
        ] });
      case "settings":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-10 text-white font-sans bg-[#050505] min-h-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500", children: "Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 max-w-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#111] p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold mb-3 text-gray-300", children: "Theme Preference" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-cyan-500/50 outline-none text-gray-300 backdrop-blur-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Cyberpunk Dark (Default)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Nebula Blue" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Matrix Green" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#111] p-6 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-bold mb-3 text-gray-300", children: "Daniela Personality" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500/50 outline-none text-gray-300 backdrop-blur-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Professional (Technical)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Casual (Friendly)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Creative (Brainstorming)" })
              ] })
            ] })
          ] })
        ] });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, { user, onLogout });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full overflow-hidden bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full overflow-y-auto custom-scrollbar", children: renderContent() }) });
};
const StatusBar = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GitBranch, { size: 12, className: "text-cyan-400 group-hover:drop-shadow-[0_0_5px_cyan]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-300 group-hover:text-white", children: "main" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12, className: "text-gray-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 text-[10px]", children: "Todo Perfecto" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Ln 14, Col 32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "UTF-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-cyan-600 font-bold text-[10px]", children: "TSX" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 hover:bg-purple-500/10 px-2 py-0.5 rounded cursor-pointer transition-colors group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 12, className: "text-purple-400 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-4 relative overflow-hidden hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.svg,
          {
            viewBox: "0 0 100 20",
            className: "absolute inset-0 w-full h-full text-purple-400/30",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.path,
                {
                  d: "M 0,10 L 20,10 L 25,2 L 30,18 L 35,10 L 100,10",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "1",
                  animate: { x: [0, -100] },
                  transition: { duration: 2, repeat: Infinity, ease: "linear" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.path,
                {
                  d: "M 100,10 L 120,10 L 125,2 L 130,18 L 135,10 L 200,10",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "1",
                  animate: { x: [0, -100] },
                  transition: { duration: 2, repeat: Infinity, ease: "linear" }
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-300 group-hover:text-purple-200 transition-colors", children: "Cerebro: Muy bien" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 hover:bg-green-500/10 px-2 py-0.5 rounded cursor-pointer transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 12, className: "text-green-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-300", children: "Conectado" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 12, className: "text-gray-400 hover:text-white cursor-pointer" })
    ] })
  ] });
};
const WorkbenchLayout = ({ user, onLogout }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WorkbenchProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    WorkbenchShell,
    {
      activityBar: /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityBar, {}),
      sideBar: /* @__PURE__ */ jsxRuntimeExports.jsx(SideBar, {}),
      mainArea: /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceArea, { user, onLogout }),
      statusBar: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBar, {})
    }
  ) });
};
const useCursorGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useTransform(mouseX, (x) => x - 8);
  const cursorY = useTransform(mouseY, (y) => y - 8);
  const glowX = useTransform(mouseX, (x) => x - 20);
  const glowY = useTransform(mouseY, (y) => y - 20);
  reactExports.useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);
  return { cursorX, cursorY, glowX, glowY };
};
const CursorGlow = () => {
  const { cursorX, cursorY, glowX, glowY } = useCursorGlow();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "fixed w-4 h-4 bg-nexus-cyan rounded-full pointer-events-none z-50 mix-blend-screen",
        style: {
          x: cursorX,
          y: cursorY,
          boxShadow: "0 0 10px rgba(0, 245, 255, 0.8), 0 0 20px rgba(0, 245, 255, 0.4)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "fixed w-16 h-16 rounded-full pointer-events-none z-40 mix-blend-screen",
        style: {
          x: glowX,
          y: glowY,
          background: "radial-gradient(circle, rgba(0, 245, 255, 0.2) 0%, transparent 70%)",
          filter: "blur(20px)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        * {
          cursor: none;
        }
        input, textarea, button, a {
          cursor: none;
        }
      ` })
  ] });
};
const MeshGradientBG = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };
  reactExports.useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [mouseX, mouseY]);
  const gradient = useMotionTemplate`radial-gradient(
    circle at ${mouseX}px ${mouseY}px,
    rgba(138, 43, 226, 0.3) 0%,
    rgba(0, 245, 255, 0.1) 25%,
    rgba(255, 215, 0, 0.05) 50%,
    transparent 100%
  )`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      onMouseMove: handleMouseMove,
      style: { backgroundImage: gradient },
      className: "fixed inset-0 z-0 transition-opacity duration-300 pointer-events-none",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-nexus-violet/5 via-transparent to-nexus-obsidian" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-nexus-cyan/5 via-transparent to-nexus-obsidian" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: {
              x: [0, 50, 0],
              y: [0, 30, 0]
            },
            transition: {
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror"
            },
            className: "absolute top-20 -left-40 w-80 h-80 bg-gradient-to-r from-nexus-violet/20 to-transparent rounded-full blur-3xl"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: {
              x: [0, -50, 0],
              y: [0, -30, 0]
            },
            transition: {
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror",
              delay: 1
            },
            className: "absolute bottom-20 -right-40 w-80 h-80 bg-gradient-to-l from-nexus-cyan/20 to-transparent rounded-full blur-3xl"
          }
        )
      ]
    }
  );
};
const GodModeNotification = ({
  title,
  message,
  type = "info",
  onClose
}) => {
  const icons = {
    info: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "text-nexus-cyan", size: 20 }),
    success: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "text-green-400", size: 20 }),
    warning: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "text-yellow-400", size: 20 }),
    error: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "text-red-400", size: 20 })
  };
  const borders = {
    info: "border-nexus-cyan/30",
    success: "border-green-500/30",
    warning: "border-yellow-500/30",
    error: "border-red-500/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 100, scale: 0.9 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 50, scale: 0.95, filter: "blur(10px)" },
      className: `pointer-events-auto min-w-[320px] max-w-md premium-glass p-1 border ${borders[type]} rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-4 flex gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: icons[type] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-grow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-orbitron text-xs font-bold text-white tracking-widest uppercase mb-1 drop-shadow-glow", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver/70 text-sm leading-relaxed", children: message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              className: "flex-shrink-0 text-white/20 hover:text-white transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { width: "100%" },
            animate: { width: "0%" },
            transition: { duration: 5, ease: "linear" },
            className: `h-[2px] bg-gradient-to-r ${type === "info" ? "from-nexus-cyan to-nexus-violet" : "from-current to-transparent opacity-50"}`
          }
        )
      ]
    }
  );
};
const NotificationContext = reactExports.createContext(void 0);
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = reactExports.useState([]);
  const { playPop } = useSoundEffects();
  const notify = reactExports.useCallback(
    (title, message, type = "info") => {
      const id = Math.random().toString(36).substr(2, 9);
      playPop();
      setNotifications((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5e3);
    },
    [playPop]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(NotificationContext.Provider, { value: { notify }, children: [
    children,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: notifications.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      GodModeNotification,
      {
        title: n.title,
        message: n.message,
        type: n.type,
        onClose: () => setNotifications((prev) => prev.filter((item) => item.id !== n.id))
      },
      n.id
    )) }) })
  ] });
};
const useNotification = () => {
  const context = reactExports.useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within a NotificationProvider");
  return context;
};
const Login$1 = ({ onLogin, loading, error }) => {
  const [formData, setFormData] = reactExports.useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [fieldErrors, setFieldErrors] = reactExports.useState({});
  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email inválido";
    }
    if (!formData.password) {
      errors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onLogin(formData.email, formData.password);
    } catch (error2) {
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: void 0 }));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-nexus-obsidian flex items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "w-full max-w-md",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 0.8 },
              animate: { scale: 1 },
              transition: { duration: 0.5, delay: 0.2 },
              className: "w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-nexus-cyan to-nexus-violet flex items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-white", children: "DA" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-orbitron font-black text-white mb-2", children: "Bienvenido a Daniela" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver/60 text-sm", children: "Tu asistente de IA emocional está lista para ayudarte" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 bg-nexus-obsidian/40 backdrop-blur-xl border border-white/10 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-orbitron text-nexus-cyan", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-3 h-5 w-5 text-nexus-silver/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "email",
                  name: "email",
                  value: formData.email,
                  onChange: handleInputChange,
                  placeholder: "tu@email.com",
                  disabled: loading,
                  className: "w-full pl-10 pr-4 py-2 bg-nexus-obsidian/60 border border-white/10 rounded-lg text-white placeholder-nexus-silver/40 focus:outline-none focus:border-nexus-cyan disabled:opacity-50"
                }
              )
            ] }),
            fieldErrors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-sm", children: fieldErrors.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-orbitron text-nexus-cyan", children: "Contraseña" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-3 h-5 w-5 text-nexus-silver/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: showPassword ? "text" : "password",
                  name: "password",
                  value: formData.password,
                  onChange: handleInputChange,
                  placeholder: "••••••••••",
                  disabled: loading,
                  className: "w-full pl-10 pr-10 py-2 bg-nexus-obsidian/60 border border-white/10 rounded-lg text-white placeholder-nexus-silver/40 focus:outline-none focus:border-nexus-cyan disabled:opacity-50"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  className: "absolute right-3 top-3 text-nexus-silver/40 hover:text-nexus-silver/60 disabled:opacity-50",
                  disabled: loading,
                  children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5" })
                }
              )
            ] }),
            fieldErrors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-sm", children: fieldErrors.password })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: -10 },
              animate: { opacity: 1, y: 0 },
              className: "bg-red-500/10 border border-red-500/20 rounded-lg p-3",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-red-400 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 mr-2" }),
                error
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: loading,
              className: "w-full py-2 px-4 bg-nexus-violet text-white font-orbitron tracking-widest rounded-lg hover:bg-nexus-violet/80 disabled:opacity-50 transition-colors",
              children: loading ? "Iniciando sesión..." : "Iniciar Sesión"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-nexus-cyan hover:text-nexus-cyan/80 text-sm transition-colors disabled:opacity-50",
                disabled: loading,
                children: "¿Olvidaste tu contraseña?"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-nexus-silver/40 text-sm", children: [
              "¿Nuevo usuario?",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "text-nexus-violet hover:text-nexus-violet/80 text-sm transition-colors disabled:opacity-50",
                  disabled: loading,
                  children: "Regístrate gratis"
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.5, delay: 0.5 },
            className: "mt-8 text-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-nexus-silver/40 text-xs", children: [
              "Al iniciar sesión, aceptas nuestros",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-nexus-cyan hover:text-nexus-cyan/80 underline", children: "términos y condiciones" })
            ] })
          }
        )
      ]
    }
  ) });
};
const Login = ({ onLogin, isAuthenticated }) => {
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const handleLoginSubmit = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };
  if (isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard", replace: true });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-nexus-obsidian flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Login$1,
    {
      onLogin: handleLoginSubmit,
      loading,
      error
    }
  ) });
};
const GlitchText = ({ text, className = "" }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative inline-block ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10", children: text }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0 left-0 -z-10 text-nexus-cyan opacity-50 animate-pulse translate-x-[2px]", children: text }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0 left-0 -z-10 text-nexus-violet opacity-50 animate-pulse -translate-x-[2px]", children: text })
  ] });
};
const VirtualOfficePreview = () => {
  const { playHover, playClick, playWhoosh } = useSoundEffects();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);
  const zones = [
    {
      title: "Sala de Reuniones",
      description: "Un lugar donde puedes hablar con otras personas como si estuvieras allí mismo. Ideal para charlar y compartir ideas.",
      icon: Users,
      color: "from-blue-500/20 to-cyan-500/20",
      border: "group-hover:neon-glow-cyan"
    },
    {
      title: "Exposición de Inventos",
      description: "Mira nuestros proyectos y productos en 3D. Puedes moverlos y verlos desde todos los ángulos.",
      icon: Sparkles,
      color: "from-purple-500/20 to-pink-500/20",
      border: "group-hover:neon-glow-violet"
    },
    {
      title: "Tu Mesa de Trabajo",
      description: "Un espacio tranquilo donde tienes toda la información de tu negocio siempre a mano.",
      icon: Monitor,
      color: "from-green-500/20 to-emerald-500/20",
      border: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
    },
    {
      title: "Fotos con IA",
      description: "Usa nuestra tecnología para crear imágenes increíbles de tu oficina o productos al instante.",
      icon: Camera,
      color: "from-orange-500/20 to-yellow-500/20",
      border: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
    }
  ];
  const MouseTiltCard = ({
    children,
    className = ""
  }) => {
    const ref = reactExports.useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    };
    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        ref,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        onMouseEnter: () => playHover(),
        style: {
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        },
        className,
        children
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-nexus-obsidian pt-32 pb-24 px-6 relative overflow-hidden perspective-1000", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50 mix-blend-overlay" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        style: { y: y1 },
        className: "absolute inset-0 bg-radial-at-top from-nexus-violet/10 via-transparent to-transparent pointer-events-none"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-nexus-cyan/5 blur-[120px] rounded-full pointer-events-none animate-pulse-glow" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.header,
        {
          style: { opacity: opacityHero },
          initial: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
          animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
          transition: { duration: 0.8, ease: "circOut" },
          className: "text-center mb-20",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-nexus-silver to-white mb-6 animate-pulse-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GlitchText, { text: "TU OFICINA DEL FUTURO" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-nexus-silver/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-nexus-cyan-glow", children: "●" }),
              " Antes de entrar, queremos que sepas que vas a viajar a un mundo virtual. Es como un videojuego, pero hecho para que tu empresa sea la mejor del mundo."
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-20", children: zones.map((zone, i) => {
        const Icon = zone.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(MouseTiltCard, { className: "perspective-1000", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { delay: i * 0.1, type: "spring" },
            className: `relative z-10 h-full p-8 rounded-[2rem] bg-gradient-to-br ${zone.color} border border-white/5 backdrop-blur-sm group transition-all duration-300 ${zone.border}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 items-start transform-style-3d group-hover:translate-z-10 transition-transform", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-black/40 rounded-2xl border border-white/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-8 h-8 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-orbitron font-bold mb-3 text-white group-hover:text-glow-cyan transition-all", children: zone.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver/80 text-sm leading-relaxed font-light", children: zone.description })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" })
            ]
          }
        ) }, zone.title);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.section,
        {
          initial: { opacity: 0, y: 50 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "premium-glass p-12 rounded-[3rem] text-center border-white/10 relative overflow-hidden group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-nexus-violet/20 via-transparent to-nexus-cyan/20 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-[100%] top-0 block h-[200%] w-[10px] -rotate-[20deg] bg-white/20 blur-[5px] animate-[shine_5s_infinite_linear]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-orbitron font-bold mb-6 text-white relative z-10", children: "¿Estás listo para el viaje?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver/70 mb-10 max-w-xl mx-auto relative z-10", children: "Haz clic en el botón de abajo y te llevaremos directamente a tu sede oficial. Solo necesitas tu ratón para moverte y explorar." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MagneticWrapper, { strength: 50, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/virtual-office/go",
                onMouseEnter: () => playHover(),
                onMouseDown: () => playClick(),
                onClick: () => playWhoosh(),
                className: "relative z-10 btn-enterprise px-12 py-5 rounded-full text-lg font-orbitron font-black tracking-widest inline-flex items-center gap-4 hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(138,43,226,0.5)] group-hover:shadow-[0_0_80px_rgba(0,245,255,0.5)]",
                children: [
                  "ENTRAR AHORA ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-6 h-6 animate-pulse" })
                ]
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex justify-center gap-8 opacity-40 text-[10px] uppercase tracking-[0.3em] font-mono", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
                " Conexión Segura"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75" }),
                " Modo Inmersivo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150" }),
                " ",
                "100% Gratis"
              ] })
            ] })
          ]
        }
      )
    ] })
  ] });
};
const WeaponDashboard = () => {
  const [spatialMode, setSpatialMode] = reactExports.useState(false);
  const [sysStatus, setSysStatus] = reactExports.useState({ cpu: 12, memory: 45 });
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    try {
      const interval = setInterval(() => {
        setSysStatus((prev) => ({
          cpu: Math.floor(Math.random() * 30) + 10,
          memory: Math.floor(Math.random() * 20) + 40
        }));
      }, 2e3);
      return () => clearInterval(interval);
    } catch (e) {
      setError(e.message);
    }
  }, []);
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-10 bg-black text-red-500", children: [
      "Error Crítico: ",
      error
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `weapon-dashboard min-h-screen p-4 bg-nexus-obsidian-deep text-white overflow-hidden relative`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex justify-between items-start mb-8 z-10 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-nexus-cyan animate-pulse", children: "GOD MODE ACTIVE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "System Stable // v3.0" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 p-6 rounded-xl border border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-6 h-6 text-green-400" }),
          "SYSTEM STATUS"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-around", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-nexus-cyan", children: [
              sysStatus.cpu,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase", children: "CPU Load" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-nexus-violet", children: [
              sysStatus.memory,
              "GB"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase", children: "Memory" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan p-4 rounded-xl font-bold tracking-widest hover:bg-nexus-cyan hover:text-black transition-all", children: "DANIELA CORE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-nexus-violet/20 text-nexus-violet border border-nexus-violet p-4 rounded-xl font-bold tracking-widest hover:bg-nexus-violet hover:text-black transition-all", children: "ADMIN ACCESS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => window.location.reload(),
          className: "mt-8 text-xs text-gray-500 underline",
          children: "Reload Shell"
        }
      )
    ] })
  ] });
};
const LoadingFallback = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[400px] bg-nexus-obsidian-deep flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-nexus-cyan-glow font-orbitron tracking-[0.5em] text-xs animate-pulse", children: "LOADING..." }) });
const Footer = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "py-32 bg-nexus-obsidian-deep border-t border-white/5 relative overflow-hidden", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-radial-at-bottom from-nexus-violet/5 via-transparent to-transparent pointer-events-none" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16 relative z-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/website-epic/images/brand/logo.png",
              alt: "AIGestion",
              className: "h-10 mb-8 filter brightness-110 drop-shadow-[0_0_10px_rgba(138,43,226,0.3)]"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-nexus-silver/50 text-lg max-w-sm mb-12 font-light leading-relaxed italic", children: [
            '"Arquitectura de Inteligencia Soberana. ',
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            'El núcleo neuronal para las empresas del mañana."'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-nexus-silver/20 font-mono uppercase tracking-[0.4em] mt-12", children: "© 2026 AIGestion.net | God Level AI Restored v2.1 (Fixes Applied)" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-orbitron text-xs text-nexus-cyan-glow mb-8 uppercase tracking-[0.3em] font-bold", children: "Ecosistema" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-6 text-[10px] text-nexus-silver/40 font-orbitron tracking-widest uppercase", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300", children: "Casos de Uso" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300", children: "Daniela AI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300", children: "Nodos Globales" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-orbitron text-xs text-nexus-violet-glow mb-8 uppercase tracking-[0.3em] font-bold", children: "Metaverso" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-6 text-[10px] text-nexus-silver/40 font-orbitron tracking-widest uppercase", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300", children: "Sedes Decentraland" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300", children: "Virtual Office" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "hover:text-white transition-colors cursor-pointer hover:translate-x-1 duration-300 text-nexus-cyan-glow font-bold", children: "Acceso Terminal" })
      ] })
    ] })
  ] })
] });
const AppContent = ({
  loading,
  isAuthenticated,
  currentUser,
  handleLogin,
  handleLogout
}) => {
  const { notify } = useNotification();
  const location = useLocation();
  reactExports.useEffect(() => {
    if (!document.startViewTransition) return;
    document.startViewTransition(() => {
    });
  }, [location.pathname]);
  reactExports.useEffect(() => {
    if (!loading) {
      notify("SISTEMA ACTIVADO", "Protocolos Antigravity God Mode Online", "success");
    }
  }, [loading, notify]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-nexus-obsidian min-h-screen text-white font-sans selection:bg-nexus-violet selection:text-white relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MeshGradientBG, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CursorGlow, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollProgress, {}),
    !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, {}) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/login",
          element: !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(Login, { onLogin: handleLogin, isAuthenticated }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/dashboard",
          element: isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(WorkbenchLayout, { user: currentUser, onLogout: handleLogout }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/",
          element: !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HeroSection,
              {
                title: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  "AIGESTION",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-nexus-cyan font-light", children: ".NET" })
                ] }),
                subtitle: "Arquitectura de Inteligencia Soberana",
                description: "El núcleo neuronal para las empresas del mañana. Sincronización absoluta entre inteligencia artificial, IoT y logística global.",
                videoSrc: "/website-epic/videos/cinematic/space-intro.mp4",
                ctas: [
                  {
                    label: "AUTORIZAR ACCESO",
                    onClick: () => window.location.href = "#contact"
                  },
                  { label: "VER ECOSISTEMA", onClick: () => {
                  }, variant: "outline" }
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClientShowcase, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DanielaShowcase, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(NexusAndroid, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(EnhancedROI, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DecentralandOffice, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContactSection, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(VitureXRExperience, {})
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/lab",
          element: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-32 pb-20 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-orbitron text-white text-center", children: "Lab Section" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/weapon", element: /* @__PURE__ */ jsxRuntimeExports.jsx(WeaponDashboard, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/admin",
          element: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-nexus-obsidian flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-orbitron text-nexus-violet-glow mb-4", children: "Admin Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver/60 mb-8", children: "Panel de administración avanzada" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://admin.aigestion.net",
                className: "btn-enterprise px-8 py-3 rounded-full",
                children: "Acceder al Admin Dashboard"
              }
            )
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/client",
          element: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-nexus-obsidian flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-orbitron text-nexus-cyan-glow mb-4", children: "Client Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver/60 mb-8", children: "Portal exclusivo para clientes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://client.aigestion.net",
                className: "btn-enterprise px-8 py-3 rounded-full",
                children: "Acceder al Client Dashboard"
              }
            )
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Route,
        {
          path: "/demo",
          element: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-nexus-obsidian flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-orbitron text-nexus-gold mb-4", children: "Demo Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-nexus-silver/60 mb-8", children: "Experiencia interactiva de demostración" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://demo.aigestion.net",
                className: "btn-enterprise px-8 py-3 rounded-full",
                children: "Acceder al Demo Dashboard"
              }
            )
          ] }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/daniela", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DanielaDemo, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/daniela/demo", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DanielaDemo, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/virtual-office", element: /* @__PURE__ */ jsxRuntimeExports.jsx(VirtualOfficePreview, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/virtual-office/go", element: /* @__PURE__ */ jsxRuntimeExports.jsx(DecentralandOffice, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CommandTerminal, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CommandPalette, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DanielaOmniWidget, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NexusCursor, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedMeshGradient, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CyberpunkGrid, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NeuralParticles, {})
  ] });
};
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}
const CLASS_PART_SEPARATOR = "-";
const createClassGroupUtils = (config) => {
  const classMap = createClassMap(config);
  const {
    conflictingClassGroups,
    conflictingClassGroupModifiers
  } = config;
  const getClassGroupId = (className) => {
    const classParts = className.split(CLASS_PART_SEPARATOR);
    if (classParts[0] === "" && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  };
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    const conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
    }
    return conflicts;
  };
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
};
const getGroupRecursive = (classParts, classPartObject) => {
  var _a2;
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  const currentClassPart = classParts[0];
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return void 0;
  }
  const classRest = classParts.join(CLASS_PART_SEPARATOR);
  return (_a2 = classPartObject.validators.find(({
    validator
  }) => validator(classRest))) == null ? void 0 : _a2.classGroupId;
};
const arbitraryPropertyRegex = /^\[(.+)\]$/;
const getGroupIdForArbitraryProperty = (className) => {
  if (arbitraryPropertyRegex.test(className)) {
    const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    const property = arbitraryPropertyClassName == null ? void 0 : arbitraryPropertyClassName.substring(0, arbitraryPropertyClassName.indexOf(":"));
    if (property) {
      return "arbitrary.." + property;
    }
  }
};
const createClassMap = (config) => {
  const {
    theme,
    prefix
  } = config;
  const classMap = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
  prefixedClassGroupEntries.forEach(([classGroupId, classGroup]) => {
    processClassesRecursively(classGroup, classMap, classGroupId, theme);
  });
  return classMap;
};
const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  classGroup.forEach((classDefinition) => {
    if (typeof classDefinition === "string") {
      const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === "function") {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(([key, classGroup2]) => {
      processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme);
    });
  });
};
const getPart = (classPartObject, path) => {
  let currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
};
const isThemeGetter = (func) => func.isThemeGetter;
const getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
  if (!prefix) {
    return classGroupEntries;
  }
  return classGroupEntries.map(([classGroupId, classGroup]) => {
    const prefixedClassGroup = classGroup.map((classDefinition) => {
      if (typeof classDefinition === "string") {
        return prefix + classDefinition;
      }
      if (typeof classDefinition === "object") {
        return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]));
      }
      return classDefinition;
    });
    return [classGroupId, prefixedClassGroup];
  });
};
const createLruCache = (maxCacheSize) => {
  if (maxCacheSize < 1) {
    return {
      get: () => void 0,
      set: () => {
      }
    };
  }
  let cacheSize = 0;
  let cache = /* @__PURE__ */ new Map();
  let previousCache = /* @__PURE__ */ new Map();
  const update = (key, value) => {
    cache.set(key, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = /* @__PURE__ */ new Map();
    }
  };
  return {
    get(key) {
      let value = cache.get(key);
      if (value !== void 0) {
        return value;
      }
      if ((value = previousCache.get(key)) !== void 0) {
        update(key, value);
        return value;
      }
    },
    set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value);
      } else {
        update(key, value);
      }
    }
  };
};
const IMPORTANT_MODIFIER = "!";
const createParseClassName = (config) => {
  const {
    separator,
    experimentalParseClassName
  } = config;
  const isSeparatorSingleCharacter = separator.length === 1;
  const firstSeparatorCharacter = separator[0];
  const separatorLength = separator.length;
  const parseClassName = (className) => {
    const modifiers = [];
    let bracketDepth = 0;
    let modifierStart = 0;
    let postfixModifierPosition;
    for (let index = 0; index < className.length; index++) {
      let currentCharacter = className[index];
      if (bracketDepth === 0) {
        if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + separatorLength;
          continue;
        }
        if (currentCharacter === "/") {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === "[") {
        bracketDepth++;
      } else if (currentCharacter === "]") {
        bracketDepth--;
      }
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
    const baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
    const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    };
  };
  if (experimentalParseClassName) {
    return (className) => experimentalParseClassName({
      className,
      parseClassName
    });
  }
  return parseClassName;
};
const sortModifiers = (modifiers) => {
  if (modifiers.length <= 1) {
    return modifiers;
  }
  const sortedModifiers = [];
  let unsortedModifiers = [];
  modifiers.forEach((modifier) => {
    const isArbitraryVariant = modifier[0] === "[";
    if (isArbitraryVariant) {
      sortedModifiers.push(...unsortedModifiers.sort(), modifier);
      unsortedModifiers = [];
    } else {
      unsortedModifiers.push(modifier);
    }
  });
  sortedModifiers.push(...unsortedModifiers.sort());
  return sortedModifiers;
};
const createConfigUtils = (config) => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  ...createClassGroupUtils(config)
});
const SPLIT_CLASSES_REGEX = /\s+/;
const mergeClassList = (classList, configUtils) => {
  const {
    parseClassName,
    getClassGroupId,
    getConflictingClassGroupIds
  } = configUtils;
  const classGroupsInConflict = [];
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
  let result = "";
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index];
    const {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    } = parseClassName(originalClassName);
    let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
    let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      hasPostfixModifier = false;
    }
    const variantModifier = sortModifiers(modifiers).join(":");
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    const classId = modifierId + classGroupId;
    if (classGroupsInConflict.includes(classId)) {
      continue;
    }
    classGroupsInConflict.push(classId);
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i];
      classGroupsInConflict.push(modifierId + group);
    }
    result = originalClassName + (result.length > 0 ? " " + result : result);
  }
  return result;
};
function twJoin() {
  let index = 0;
  let argument;
  let resolvedValue;
  let string = "";
  while (index < arguments.length) {
    if (argument = arguments[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
}
const toValue = (mix) => {
  if (typeof mix === "string") {
    return mix;
  }
  let resolvedValue;
  let string = "";
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
  let configUtils;
  let cacheGet;
  let cacheSet;
  let functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    const cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    const result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}
const fromTheme = (key) => {
  const themeGetter = (theme) => theme[key] || [];
  themeGetter.isThemeGetter = true;
  return themeGetter;
};
const arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
const fractionRegex = /^\d+\/\d+$/;
const stringLengths = /* @__PURE__ */ new Set(["px", "full", "screen"]);
const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/;
const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
const isLength = (value) => isNumber(value) || stringLengths.has(value) || fractionRegex.test(value);
const isArbitraryLength = (value) => getIsArbitraryValue(value, "length", isLengthOnly);
const isNumber = (value) => Boolean(value) && !Number.isNaN(Number(value));
const isArbitraryNumber = (value) => getIsArbitraryValue(value, "number", isNumber);
const isInteger = (value) => Boolean(value) && Number.isInteger(Number(value));
const isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
const isArbitraryValue = (value) => arbitraryValueRegex.test(value);
const isTshirtSize = (value) => tshirtUnitRegex.test(value);
const sizeLabels = /* @__PURE__ */ new Set(["length", "size", "percentage"]);
const isArbitrarySize = (value) => getIsArbitraryValue(value, sizeLabels, isNever);
const isArbitraryPosition = (value) => getIsArbitraryValue(value, "position", isNever);
const imageLabels = /* @__PURE__ */ new Set(["image", "url"]);
const isArbitraryImage = (value) => getIsArbitraryValue(value, imageLabels, isImage);
const isArbitraryShadow = (value) => getIsArbitraryValue(value, "", isShadow);
const isAny = () => true;
const getIsArbitraryValue = (value, label, testValue) => {
  const result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return typeof label === "string" ? result[1] === label : label.has(result[1]);
    }
    return testValue(result[2]);
  }
  return false;
};
const isLengthOnly = (value) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
);
const isNever = () => false;
const isShadow = (value) => shadowRegex.test(value);
const isImage = (value) => imageRegex.test(value);
const getDefaultConfig = () => {
  const colors = fromTheme("colors");
  const spacing = fromTheme("spacing");
  const blur = fromTheme("blur");
  const brightness = fromTheme("brightness");
  const borderColor = fromTheme("borderColor");
  const borderRadius = fromTheme("borderRadius");
  const borderSpacing = fromTheme("borderSpacing");
  const borderWidth = fromTheme("borderWidth");
  const contrast = fromTheme("contrast");
  const grayscale = fromTheme("grayscale");
  const hueRotate = fromTheme("hueRotate");
  const invert = fromTheme("invert");
  const gap = fromTheme("gap");
  const gradientColorStops = fromTheme("gradientColorStops");
  const gradientColorStopPositions = fromTheme("gradientColorStopPositions");
  const inset = fromTheme("inset");
  const margin = fromTheme("margin");
  const opacity = fromTheme("opacity");
  const padding = fromTheme("padding");
  const saturate = fromTheme("saturate");
  const scale = fromTheme("scale");
  const sepia = fromTheme("sepia");
  const skew = fromTheme("skew");
  const space = fromTheme("space");
  const translate = fromTheme("translate");
  const getOverscroll = () => ["auto", "contain", "none"];
  const getOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
  const getSpacingWithAutoAndArbitrary = () => ["auto", isArbitraryValue, spacing];
  const getSpacingWithArbitrary = () => [isArbitraryValue, spacing];
  const getLengthWithEmptyAndArbitrary = () => ["", isLength, isArbitraryLength];
  const getNumberWithAutoAndArbitrary = () => ["auto", isNumber, isArbitraryValue];
  const getPositions = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"];
  const getLineStyles = () => ["solid", "dashed", "dotted", "double", "none"];
  const getBlendModes = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
  const getAlign = () => ["start", "end", "center", "between", "around", "evenly", "stretch"];
  const getZeroAndEmpty = () => ["", "0", isArbitraryValue];
  const getBreaks = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
  const getNumberAndArbitrary = () => [isNumber, isArbitraryValue];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [isAny],
      spacing: [isLength, isArbitraryLength],
      blur: ["none", "", isTshirtSize, isArbitraryValue],
      brightness: getNumberAndArbitrary(),
      borderColor: [colors],
      borderRadius: ["none", "", "full", isTshirtSize, isArbitraryValue],
      borderSpacing: getSpacingWithArbitrary(),
      borderWidth: getLengthWithEmptyAndArbitrary(),
      contrast: getNumberAndArbitrary(),
      grayscale: getZeroAndEmpty(),
      hueRotate: getNumberAndArbitrary(),
      invert: getZeroAndEmpty(),
      gap: getSpacingWithArbitrary(),
      gradientColorStops: [colors],
      gradientColorStopPositions: [isPercent, isArbitraryLength],
      inset: getSpacingWithAutoAndArbitrary(),
      margin: getSpacingWithAutoAndArbitrary(),
      opacity: getNumberAndArbitrary(),
      padding: getSpacingWithArbitrary(),
      saturate: getNumberAndArbitrary(),
      scale: getNumberAndArbitrary(),
      sepia: getZeroAndEmpty(),
      skew: getNumberAndArbitrary(),
      space: getSpacingWithArbitrary(),
      translate: getSpacingWithArbitrary()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", isArbitraryValue]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isTshirtSize]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": getBreaks()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": getBreaks()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...getPositions(), isArbitraryValue]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: getOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": getOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": getOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: getOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": getOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": getOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [inset]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [inset]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [inset]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [inset]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [inset]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [inset]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [inset]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [inset]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [inset]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", isInteger, isArbitraryValue]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: getSpacingWithAutoAndArbitrary()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: getZeroAndEmpty()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: getZeroAndEmpty()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", isInteger, isArbitraryValue]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [isAny]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [isAny]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [gap]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [gap]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [gap]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...getAlign()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...getAlign(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...getAlign(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [padding]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [padding]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [padding]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [padding]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [padding]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [padding]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [padding]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [padding]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [padding]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [margin]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [margin]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [margin]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [margin]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [margin]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [margin]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [margin]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [margin]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [margin]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [space]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [space]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", isArbitraryValue, spacing]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [isArbitraryValue, spacing, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [isArbitraryValue, spacing, "none", "full", "min", "max", "fit", "prose", {
          screen: [isTshirtSize]
        }, isTshirtSize]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [isArbitraryValue, spacing, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [isArbitraryValue, spacing, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", isTshirtSize, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", isArbitraryNumber]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [isAny]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", isNumber, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", isLength, isArbitraryValue]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", isArbitraryValue]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [colors]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [opacity]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [colors]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [opacity]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...getLineStyles(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", isLength, isArbitraryLength]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", isLength, isArbitraryValue]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [colors]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: getSpacingWithArbitrary()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", isArbitraryValue]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [opacity]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...getPositions(), isArbitraryPosition]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", isArbitrarySize]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, isArbitraryImage]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [colors]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [gradientColorStops]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [borderRadius]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [borderRadius]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [borderRadius]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [borderRadius]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [borderRadius]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [borderRadius]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [borderRadius]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [borderRadius]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [borderRadius]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [borderRadius]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [borderRadius]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [borderRadius]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [borderRadius]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [borderRadius]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [borderRadius]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [borderWidth]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [borderWidth]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [borderWidth]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [borderWidth]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [borderWidth]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [borderWidth]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [borderWidth]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [borderWidth]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [borderWidth]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [opacity]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...getLineStyles(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [borderWidth]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [borderWidth]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [opacity]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: getLineStyles()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [borderColor]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [borderColor]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [borderColor]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [borderColor]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [borderColor]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [borderColor]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [borderColor]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [borderColor]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [borderColor]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [borderColor]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...getLineStyles()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [isLength, isArbitraryValue]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [isLength, isArbitraryLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [colors]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: getLengthWithEmptyAndArbitrary()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [colors]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [opacity]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [isLength, isArbitraryLength]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [colors]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", isTshirtSize, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [isAny]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [opacity]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...getBlendModes(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": getBlendModes()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [blur]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [brightness]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [contrast]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", isTshirtSize, isArbitraryValue]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [grayscale]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [hueRotate]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [invert]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [saturate]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [sepia]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [blur]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [brightness]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [contrast]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [grayscale]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [hueRotate]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [invert]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [opacity]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [saturate]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [sepia]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [borderSpacing]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [borderSpacing]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [borderSpacing]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", isArbitraryValue]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: getNumberAndArbitrary()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: getNumberAndArbitrary()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", isArbitraryValue]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [scale]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [scale]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [scale]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [isInteger, isArbitraryValue]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [translate]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [translate]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [skew]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [skew]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", isArbitraryValue]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", colors]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryValue]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [colors]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", isArbitraryValue]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [colors, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [isLength, isArbitraryLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [colors, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
};
const twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Button = reactExports.forwardRef(
  ({
    className,
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    iconPosition = "left",
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = [
      "inline-flex items-center justify-center",
      "font-medium rounded-lg",
      "transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed"
    ];
    const variantClasses = {
      primary: [
        "bg-blue-600 text-white hover:bg-blue-700",
        "focus:ring-blue-500",
        "dark:bg-blue-500 dark:hover:bg-blue-600"
      ],
      secondary: [
        "bg-gray-600 text-white hover:bg-gray-700",
        "focus:ring-gray-500",
        "dark:bg-gray-700 dark:hover:bg-gray-600"
      ],
      outline: [
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        "focus:ring-blue-500",
        "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      ],
      ghost: [
        "text-gray-700 hover:bg-gray-100",
        "focus:ring-gray-500",
        "dark:text-gray-300 dark:hover:bg-gray-800"
      ],
      destructive: [
        "bg-red-600 text-white hover:bg-red-700",
        "focus:ring-red-500",
        "dark:bg-red-500 dark:hover:bg-red-600"
      ]
    };
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
      xl: "px-8 py-4 text-xl"
    };
    const classes = cn(
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[size],
      className
    );
    const renderIcon = () => {
      if (loading) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" });
      }
      return icon;
    };
    const renderContent = () => {
      if (icon && iconPosition === "right") {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          children,
          renderIcon() && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: renderIcon() })
        ] });
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        renderIcon() && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: renderIcon() }),
        children
      ] });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        ref,
        className: classes,
        disabled: disabled || loading,
        ...props,
        children: renderContent()
      }
    );
  }
);
Button.displayName = "Button";
class ErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    __publicField(this, "handleReset", () => {
      this.setState({ hasError: false, error: void 0, errorInfo: void 0 });
    });
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    var _a2, _b2;
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    (_b2 = (_a2 = this.props).onError) == null ? void 0 : _b2.call(_a2, error, errorInfo);
    {
      console.warn("Error logging service not configured");
    }
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            className: "w-8 h-8 text-red-600 dark:text-red-400",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              }
            )
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: "Oops! Something went wrong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: "We're sorry, but something unexpected happened. Our team has been notified." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: this.handleReset, className: "w-full", children: "Try Again" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => window.location.reload(),
              className: "w-full",
              children: "Reload Page"
            }
          )
        ] }),
        false
      ] }) });
    }
    return this.props.children;
  }
}
const NexusContext = reactExports.createContext(void 0);
const NexusProvider = ({ children }) => {
  const [godMode, setGodMode] = reactExports.useState(true);
  const [reduceMotion, setReduceMotion] = reactExports.useState(false);
  const { playSuccess } = useSoundEffects();
  reactExports.useEffect(() => {
    if (godMode) {
      document.body.classList.add("nexus-god-mode");
    } else {
      document.body.classList.remove("nexus-god-mode");
    }
  }, [godMode]);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      playSuccess();
    }, 1e3);
    return () => clearTimeout(timer);
  }, []);
  const toggleReduceMotion = () => setReduceMotion((prev) => !prev);
  const value = React$1.useMemo(
    () => ({
      godMode,
      setGodMode,
      reduceMotion,
      toggleReduceMotion
    }),
    [godMode, reduceMotion]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(NexusContext.Provider, { value, children });
};
const supabaseUrl = "https://jhvtjyfmgncrrbzqpbkt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpodnRqeWZtZ25jcnJienFwYmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4ODIwNjksImV4cCI6MjA4NDQ1ODA2OX0.biJUe_dP1CScwXD7RqqR-5p74cwuOZOkawODtoO5evU";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const ADMIN_EMAILS = ["admin@aigestion.net", "nemisanalex@gmail.com"];
const ADMIN_REDIRECT_URL = "https://admin.aigestion.net";
function useAuth() {
  const [state, setState] = reactExports.useState({
    session: null,
    user: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
    isMobileApp: false
  });
  const checkMobileApp = reactExports.useCallback(() => {
    return window.location.hostname === "localhost" || window.location.protocol.includes("capacitor") || window.location.protocol === "file:" || window.location.port === "";
  }, []);
  const createAuthUser = reactExports.useCallback((user) => {
    const metadata = user.user_metadata || {};
    return {
      email: user.email,
      name: metadata.name || user.email.split("@")[0],
      subscription: metadata.subscription || "free",
      role: metadata.role || "client",
      avatar: metadata.avatar
    };
  }, []);
  const checkAdminRedirect = reactExports.useCallback(
    (user) => {
      const isAdminUser = ADMIN_EMAILS.includes(user.email) || user.role === "admin";
      const isMobile = checkMobileApp();
      if (isAdminUser && !isMobile) {
        window.location.href = ADMIN_REDIRECT_URL;
        return true;
      }
      return false;
    },
    [checkMobileApp]
  );
  const handleSessionChange = reactExports.useCallback(
    async (session) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        if (session == null ? void 0 : session.user) {
          const authUser = createAuthUser(session.user);
          if (checkAdminRedirect(authUser)) {
            return;
          }
          setState({
            session,
            user: authUser,
            loading: false,
            isAuthenticated: true,
            isAdmin: ADMIN_EMAILS.includes(authUser.email) || authUser.role === "admin",
            isMobileApp: checkMobileApp()
          });
        } else {
          setState({
            session: null,
            user: null,
            loading: false,
            isAuthenticated: false,
            isAdmin: false,
            isMobileApp: checkMobileApp()
          });
        }
      } catch (error) {
        console.error("Session handling error:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          isAuthenticated: false,
          user: null,
          session: null
        }));
      }
    },
    [createAuthUser, checkAdminRedirect, checkMobileApp]
  );
  const login = reactExports.useCallback(async (email, password) => {
    var _a2;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        throw error;
      }
      if ((_a2 = data.session) == null ? void 0 : _a2.user) {
        await handleSessionChange(data.session);
      }
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  }, [handleSessionChange]);
  const logout = reactExports.useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await supabase.auth.signOut();
      await handleSessionChange(null);
    } catch (error) {
      console.error("Logout error:", error);
      setState({
        session: null,
        user: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
        isMobileApp: checkMobileApp()
      });
    }
  }, [handleSessionChange, checkMobileApp]);
  const refreshSession = reactExports.useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        throw error;
      }
      await handleSessionChange(data.session);
    } catch (error) {
      console.error("Session refresh error:", error);
      await handleSessionChange(null);
    }
  }, [handleSessionChange]);
  const updateUser = reactExports.useCallback(async (updates) => {
    if (!state.user || !state.session) {
      throw new Error("No authenticated user");
    }
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });
      if (error) {
        throw error;
      }
      await refreshSession();
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  }, [state.user, state.session, refreshSession]);
  reactExports.useEffect(() => {
    if (!supabase) {
      console.warn("Supabase not configured; using demo mode");
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => handleSessionChange(session)).catch((error) => {
      console.error("Initial session error:", error);
      setState((prev) => ({ ...prev, loading: false }));
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session);
    });
    return () => subscription.unsubscribe();
  }, [handleSessionChange]);
  return {
    ...state,
    login,
    logout,
    refreshSession,
    updateUser
  };
}
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
};
var defaultTimeoutProvider = {
  // We need the wrapper function syntax below instead of direct references to
  // global setTimeout etc.
  //
  // BAD: `setTimeout: setTimeout`
  // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
  //
  // If we use direct references here, then anything that wants to spy on or
  // replace the global setTimeout (like tests) won't work since we'll already
  // have a hard reference to the original implementation at the time when this
  // file was imported.
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId),
  setInterval: (callback, delay) => setInterval(callback, delay),
  clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = (_a = class {
  constructor() {
    // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
    // type at app boot; and if we leave that type, then any new timer provider
    // would need to support ReturnType<typeof setTimeout>, which is infeasible.
    //
    // We settle for type safety for the TimeoutProvider type, and accept that
    // this class is unsafe internally to allow for extension.
    __privateAdd(this, _provider, defaultTimeoutProvider);
    __privateAdd(this, _providerCalled, false);
  }
  setTimeoutProvider(provider) {
    __privateSet(this, _provider, provider);
  }
  setTimeout(callback, delay) {
    return __privateGet(this, _provider).setTimeout(callback, delay);
  }
  clearTimeout(timeoutId) {
    __privateGet(this, _provider).clearTimeout(timeoutId);
  }
  setInterval(callback, delay) {
    return __privateGet(this, _provider).setInterval(callback, delay);
  }
  clearInterval(intervalId) {
    __privateGet(this, _provider).clearInterval(intervalId);
  }
}, _provider = new WeakMap(), _providerCalled = new WeakMap(), _a);
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
  setTimeout(callback, 0);
}
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
  return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveEnabled(enabled, query) {
  return typeof enabled === "function" ? enabled(query) : enabled;
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (status && mutation.state.status !== status) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = (options == null ? void 0 : options.queryKeyHashFn) || hashKey;
  return hashFn(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(
    queryKey,
    (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val
  );
}
function partialMatchKey(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
  }
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
  if (a === b) {
    return a;
  }
  if (depth > 500) return b;
  const array = isPlainArray(a) && isPlainArray(b);
  if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
  const aItems = array ? a : Object.keys(a);
  const aSize = aItems.length;
  const bItems = array ? b : Object.keys(b);
  const bSize = bItems.length;
  const copy = array ? new Array(bSize) : {};
  let equalItems = 0;
  for (let i = 0; i < bSize; i++) {
    const key = array ? i : bItems[i];
    const aItem = a[key];
    const bItem = b[key];
    if (aItem === bItem) {
      copy[key] = aItem;
      if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
      continue;
    }
    if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
      copy[key] = bItem;
      continue;
    }
    const v = replaceEqualDeep(aItem, bItem, depth + 1);
    copy[key] = v;
    if (v === aItem) equalItems++;
  }
  return aSize === bSize && equalItems === aSize ? a : copy;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (ctor === void 0) {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
  return new Promise((resolve) => {
    timeoutManager.setTimeout(resolve, timeout);
  });
}
function replaceData(prevData, data, options) {
  if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
  if (!options.queryFn && (fetchOptions == null ? void 0 : fetchOptions.initialPromise)) {
    return () => fetchOptions.initialPromise;
  }
  if (!options.queryFn || options.queryFn === skipToken) {
    return () => Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
  }
  return options.queryFn;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
  let consumed = false;
  let signal;
  Object.defineProperty(object, "signal", {
    enumerable: true,
    get: () => {
      signal ?? (signal = getSignal());
      if (consumed) {
        return signal;
      }
      consumed = true;
      if (signal.aborted) {
        onCancelled();
      } else {
        signal.addEventListener("abort", onCancelled, { once: true });
      }
      return signal;
    }
  });
  return object;
}
var FocusManager = (_b = class extends Subscribable {
  constructor() {
    super();
    __privateAdd(this, _focused);
    __privateAdd(this, _cleanup);
    __privateAdd(this, _setup);
    __privateSet(this, _setup, (onFocus) => {
      if (!isServer && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
        };
      }
      return;
    });
  }
  onSubscribe() {
    if (!__privateGet(this, _cleanup)) {
      this.setEventListener(__privateGet(this, _setup));
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _cleanup)) == null ? void 0 : _a2.call(this);
      __privateSet(this, _cleanup, void 0);
    }
  }
  setEventListener(setup) {
    var _a2;
    __privateSet(this, _setup, setup);
    (_a2 = __privateGet(this, _cleanup)) == null ? void 0 : _a2.call(this);
    __privateSet(this, _cleanup, setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    }));
  }
  setFocused(focused) {
    const changed = __privateGet(this, _focused) !== focused;
    if (changed) {
      __privateSet(this, _focused, focused);
      this.onFocus();
    }
  }
  onFocus() {
    const isFocused = this.isFocused();
    this.listeners.forEach((listener) => {
      listener(isFocused);
    });
  }
  isFocused() {
    var _a2;
    if (typeof __privateGet(this, _focused) === "boolean") {
      return __privateGet(this, _focused);
    }
    return ((_a2 = globalThis.document) == null ? void 0 : _a2.visibilityState) !== "hidden";
  }
}, _focused = new WeakMap(), _cleanup = new WeakMap(), _setup = new WeakMap(), _b);
var focusManager = new FocusManager();
function pendingThenable() {
  let resolve;
  let reject;
  const thenable = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  thenable.status = "pending";
  thenable.catch(() => {
  });
  function finalize(data) {
    Object.assign(thenable, data);
    delete thenable.resolve;
    delete thenable.reject;
  }
  thenable.resolve = (value) => {
    finalize({
      status: "fulfilled",
      value
    });
    resolve(value);
  };
  thenable.reject = (reason) => {
    finalize({
      status: "rejected",
      reason
    });
    reject(reason);
  };
  return thenable;
}
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  let scheduleFn = defaultScheduler;
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleFn(() => {
        notifyFn(callback);
      });
    }
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleFn(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  return {
    batch: (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    },
    /**
     * All calls to the wrapped function will be batched.
     */
    batchCalls: (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    },
    schedule,
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    setNotifyFunction: (fn) => {
      notifyFn = fn;
    },
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    setBatchNotifyFunction: (fn) => {
      batchNotifyFn = fn;
    },
    setScheduler: (fn) => {
      scheduleFn = fn;
    }
  };
}
var notifyManager = createNotifyManager();
var OnlineManager = (_c = class extends Subscribable {
  constructor() {
    super();
    __privateAdd(this, _online, true);
    __privateAdd(this, _cleanup2);
    __privateAdd(this, _setup2);
    __privateSet(this, _setup2, (onOnline) => {
      if (!isServer && window.addEventListener) {
        const onlineListener = () => onOnline(true);
        const offlineListener = () => onOnline(false);
        window.addEventListener("online", onlineListener, false);
        window.addEventListener("offline", offlineListener, false);
        return () => {
          window.removeEventListener("online", onlineListener);
          window.removeEventListener("offline", offlineListener);
        };
      }
      return;
    });
  }
  onSubscribe() {
    if (!__privateGet(this, _cleanup2)) {
      this.setEventListener(__privateGet(this, _setup2));
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _cleanup2)) == null ? void 0 : _a2.call(this);
      __privateSet(this, _cleanup2, void 0);
    }
  }
  setEventListener(setup) {
    var _a2;
    __privateSet(this, _setup2, setup);
    (_a2 = __privateGet(this, _cleanup2)) == null ? void 0 : _a2.call(this);
    __privateSet(this, _cleanup2, setup(this.setOnline.bind(this)));
  }
  setOnline(online) {
    const changed = __privateGet(this, _online) !== online;
    if (changed) {
      __privateSet(this, _online, online);
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  isOnline() {
    return __privateGet(this, _online);
  }
}, _online = new WeakMap(), _cleanup2 = new WeakMap(), _setup2 = new WeakMap(), _c);
var onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
  constructor(options) {
    super("CancelledError");
    this.revert = options == null ? void 0 : options.revert;
    this.silent = options == null ? void 0 : options.silent;
  }
};
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let continueFn;
  const thenable = pendingThenable();
  const isResolved = () => thenable.status !== "pending";
  const cancel = (cancelOptions) => {
    var _a2;
    if (!isResolved()) {
      const error = new CancelledError(cancelOptions);
      reject(error);
      (_a2 = config.onCancel) == null ? void 0 : _a2.call(config, error);
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
  const canStart = () => canFetch(config.networkMode) && config.canRun();
  const resolve = (value) => {
    if (!isResolved()) {
      continueFn == null ? void 0 : continueFn();
      thenable.resolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved()) {
      continueFn == null ? void 0 : continueFn();
      thenable.reject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      var _a2;
      continueFn = (value) => {
        if (isResolved() || canContinue()) {
          continueResolve(value);
        }
      };
      (_a2 = config.onPause) == null ? void 0 : _a2.call(config);
    }).then(() => {
      var _a2;
      continueFn = void 0;
      if (!isResolved()) {
        (_a2 = config.onContinue) == null ? void 0 : _a2.call(config);
      }
    });
  };
  const run = () => {
    if (isResolved()) {
      return;
    }
    let promiseOrValue;
    const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
    try {
      promiseOrValue = initialPromise ?? config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      var _a2;
      if (isResolved()) {
        return;
      }
      const retry = config.retry ?? (isServer ? 0 : 3);
      const retryDelay = config.retryDelay ?? defaultRetryDelay;
      const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      (_a2 = config.onFail) == null ? void 0 : _a2.call(config, failureCount, error);
      sleep(delay).then(() => {
        return canContinue() ? void 0 : pause();
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  };
  return {
    promise: thenable,
    status: () => thenable.status,
    cancel,
    continue: () => {
      continueFn == null ? void 0 : continueFn();
      return thenable;
    },
    cancelRetry,
    continueRetry,
    canStart,
    start: () => {
      if (canStart()) {
        run();
      } else {
        pause().then(run);
      }
      return thenable;
    }
  };
}
var Removable = (_d = class {
  constructor() {
    __privateAdd(this, _gcTimeout);
  }
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.gcTime)) {
      __privateSet(this, _gcTimeout, timeoutManager.setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime));
    }
  }
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (isServer ? Infinity : 5 * 60 * 1e3)
    );
  }
  clearGcTimeout() {
    if (__privateGet(this, _gcTimeout)) {
      timeoutManager.clearTimeout(__privateGet(this, _gcTimeout));
      __privateSet(this, _gcTimeout, void 0);
    }
  }
}, _gcTimeout = new WeakMap(), _d);
var Query = (_e = class extends Removable {
  constructor(config) {
    super();
    __privateAdd(this, _Query_instances);
    __privateAdd(this, _initialState);
    __privateAdd(this, _revertState);
    __privateAdd(this, _cache);
    __privateAdd(this, _client);
    __privateAdd(this, _retryer);
    __privateAdd(this, _defaultOptions);
    __privateAdd(this, _abortSignalConsumed);
    __privateSet(this, _abortSignalConsumed, false);
    __privateSet(this, _defaultOptions, config.defaultOptions);
    this.setOptions(config.options);
    this.observers = [];
    __privateSet(this, _client, config.client);
    __privateSet(this, _cache, __privateGet(this, _client).getQueryCache());
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    __privateSet(this, _initialState, getDefaultState$1(this.options));
    this.state = config.state ?? __privateGet(this, _initialState);
    this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  get promise() {
    var _a2;
    return (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.promise;
  }
  setOptions(options) {
    this.options = { ...__privateGet(this, _defaultOptions), ...options };
    this.updateGcTime(this.options.gcTime);
    if (this.state && this.state.data === void 0) {
      const defaultState = getDefaultState$1(this.options);
      if (defaultState.data !== void 0) {
        this.setState(
          successState(defaultState.data, defaultState.dataUpdatedAt)
        );
        __privateSet(this, _initialState, defaultState);
      }
    }
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      __privateGet(this, _cache).remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    __privateMethod(this, _Query_instances, dispatch_fn).call(this, {
      data,
      type: "success",
      dataUpdatedAt: options == null ? void 0 : options.updatedAt,
      manual: options == null ? void 0 : options.manual
    });
    return data;
  }
  setState(state, setStateOptions) {
    __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "setState", state, setStateOptions });
  }
  cancel(options) {
    var _a2, _b2;
    const promise = (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.promise;
    (_b2 = __privateGet(this, _retryer)) == null ? void 0 : _b2.cancel(options);
    return promise ? promise.then(noop).catch(noop) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  reset() {
    this.destroy();
    this.setState(__privateGet(this, _initialState));
  }
  isActive() {
    return this.observers.some(
      (observer) => resolveEnabled(observer.options.enabled, this) !== false
    );
  }
  isDisabled() {
    if (this.getObserversCount() > 0) {
      return !this.isActive();
    }
    return this.options.queryFn === skipToken || this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
  }
  isStatic() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => resolveStaleTime(observer.options.staleTime, this) === "static"
      );
    }
    return false;
  }
  isStale() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => observer.getCurrentResult().isStale
      );
    }
    return this.state.data === void 0 || this.state.isInvalidated;
  }
  isStaleByTime(staleTime = 0) {
    if (this.state.data === void 0) {
      return true;
    }
    if (staleTime === "static") {
      return false;
    }
    if (this.state.isInvalidated) {
      return true;
    }
    return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    var _a2;
    const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
    observer == null ? void 0 : observer.refetch({ cancelRefetch: false });
    (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.continue();
  }
  onOnline() {
    var _a2;
    const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
    observer == null ? void 0 : observer.refetch({ cancelRefetch: false });
    (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.continue();
  }
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      __privateGet(this, _cache).notify({ type: "observerAdded", query: this, observer });
    }
  }
  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x) => x !== observer);
      if (!this.observers.length) {
        if (__privateGet(this, _retryer)) {
          if (__privateGet(this, _abortSignalConsumed)) {
            __privateGet(this, _retryer).cancel({ revert: true });
          } else {
            __privateGet(this, _retryer).cancelRetry();
          }
        }
        this.scheduleGc();
      }
      __privateGet(this, _cache).notify({ type: "observerRemoved", query: this, observer });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "invalidate" });
    }
  }
  async fetch(options, fetchOptions) {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j, _k, _l;
    if (this.state.fetchStatus !== "idle" && // If the promise in the retryer is already rejected, we have to definitely
    // re-start the fetch; there is a chance that the query is still in a
    // pending state when that happens
    ((_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.status()) !== "rejected") {
      if (this.state.data !== void 0 && (fetchOptions == null ? void 0 : fetchOptions.cancelRefetch)) {
        this.cancel({ silent: true });
      } else if (__privateGet(this, _retryer)) {
        __privateGet(this, _retryer).continueRetry();
        return __privateGet(this, _retryer).promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.observers.find((x) => x.options.queryFn);
      if (observer) {
        this.setOptions(observer.options);
      }
    }
    const abortController = new AbortController();
    const addSignalProperty = (object) => {
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          __privateSet(this, _abortSignalConsumed, true);
          return abortController.signal;
        }
      });
    };
    const fetchFn = () => {
      const queryFn = ensureQueryFn(this.options, fetchOptions);
      const createQueryFnContext = () => {
        const queryFnContext2 = {
          client: __privateGet(this, _client),
          queryKey: this.queryKey,
          meta: this.meta
        };
        addSignalProperty(queryFnContext2);
        return queryFnContext2;
      };
      const queryFnContext = createQueryFnContext();
      __privateSet(this, _abortSignalConsumed, false);
      if (this.options.persister) {
        return this.options.persister(
          queryFn,
          queryFnContext,
          this
        );
      }
      return queryFn(queryFnContext);
    };
    const createFetchContext = () => {
      const context2 = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        client: __privateGet(this, _client),
        state: this.state,
        fetchFn
      };
      addSignalProperty(context2);
      return context2;
    };
    const context = createFetchContext();
    (_b2 = this.options.behavior) == null ? void 0 : _b2.onFetch(context, this);
    __privateSet(this, _revertState, this.state);
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== ((_c2 = context.fetchOptions) == null ? void 0 : _c2.meta)) {
      __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "fetch", meta: (_d2 = context.fetchOptions) == null ? void 0 : _d2.meta });
    }
    __privateSet(this, _retryer, createRetryer({
      initialPromise: fetchOptions == null ? void 0 : fetchOptions.initialPromise,
      fn: context.fetchFn,
      onCancel: (error) => {
        if (error instanceof CancelledError && error.revert) {
          this.setState({
            ...__privateGet(this, _revertState),
            fetchStatus: "idle"
          });
        }
        abortController.abort();
      },
      onFail: (failureCount, error) => {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "failed", failureCount, error });
      },
      onPause: () => {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "pause" });
      },
      onContinue: () => {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "continue" });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode,
      canRun: () => true
    }));
    try {
      const data = await __privateGet(this, _retryer).start();
      if (data === void 0) {
        if (false) ;
        throw new Error(`${this.queryHash} data is undefined`);
      }
      this.setData(data);
      (_f2 = (_e2 = __privateGet(this, _cache).config).onSuccess) == null ? void 0 : _f2.call(_e2, data, this);
      (_h2 = (_g2 = __privateGet(this, _cache).config).onSettled) == null ? void 0 : _h2.call(
        _g2,
        data,
        this.state.error,
        this
      );
      return data;
    } catch (error) {
      if (error instanceof CancelledError) {
        if (error.silent) {
          return __privateGet(this, _retryer).promise;
        } else if (error.revert) {
          if (this.state.data === void 0) {
            throw error;
          }
          return this.state.data;
        }
      }
      __privateMethod(this, _Query_instances, dispatch_fn).call(this, {
        type: "error",
        error
      });
      (_j = (_i2 = __privateGet(this, _cache).config).onError) == null ? void 0 : _j.call(
        _i2,
        error,
        this
      );
      (_l = (_k = __privateGet(this, _cache).config).onSettled) == null ? void 0 : _l.call(
        _k,
        this.state.data,
        error,
        this
      );
      throw error;
    } finally {
      this.scheduleGc();
    }
  }
}, _initialState = new WeakMap(), _revertState = new WeakMap(), _cache = new WeakMap(), _client = new WeakMap(), _retryer = new WeakMap(), _defaultOptions = new WeakMap(), _abortSignalConsumed = new WeakMap(), _Query_instances = new WeakSet(), dispatch_fn = function(action) {
  const reducer = (state) => {
    switch (action.type) {
      case "failed":
        return {
          ...state,
          fetchFailureCount: action.failureCount,
          fetchFailureReason: action.error
        };
      case "pause":
        return {
          ...state,
          fetchStatus: "paused"
        };
      case "continue":
        return {
          ...state,
          fetchStatus: "fetching"
        };
      case "fetch":
        return {
          ...state,
          ...fetchState(state.data, this.options),
          fetchMeta: action.meta ?? null
        };
      case "success":
        const newState = {
          ...state,
          ...successState(action.data, action.dataUpdatedAt),
          dataUpdateCount: state.dataUpdateCount + 1,
          ...!action.manual && {
            fetchStatus: "idle",
            fetchFailureCount: 0,
            fetchFailureReason: null
          }
        };
        __privateSet(this, _revertState, action.manual ? newState : void 0);
        return newState;
      case "error":
        const error = action.error;
        return {
          ...state,
          error,
          errorUpdateCount: state.errorUpdateCount + 1,
          errorUpdatedAt: Date.now(),
          fetchFailureCount: state.fetchFailureCount + 1,
          fetchFailureReason: error,
          fetchStatus: "idle",
          status: "error",
          // flag existing data as invalidated if we get a background error
          // note that "no data" always means stale so we can set unconditionally here
          isInvalidated: true
        };
      case "invalidate":
        return {
          ...state,
          isInvalidated: true
        };
      case "setState":
        return {
          ...state,
          ...action.state
        };
    }
  };
  this.state = reducer(this.state);
  notifyManager.batch(() => {
    this.observers.forEach((observer) => {
      observer.onQueryUpdate();
    });
    __privateGet(this, _cache).notify({ query: this, type: "updated", action });
  });
}, _e);
function fetchState(data, options) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
    ...data === void 0 && {
      error: null,
      status: "pending"
    }
  };
}
function successState(data, dataUpdatedAt) {
  return {
    data,
    dataUpdatedAt: dataUpdatedAt ?? Date.now(),
    error: null,
    isInvalidated: false,
    status: "success"
  };
}
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = data !== void 0;
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle"
  };
}
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      var _a2, _b2, _c2, _d2, _e2;
      const options = context.options;
      const direction = (_c2 = (_b2 = (_a2 = context.fetchOptions) == null ? void 0 : _a2.meta) == null ? void 0 : _b2.fetchMore) == null ? void 0 : _c2.direction;
      const oldPages = ((_d2 = context.state.data) == null ? void 0 : _d2.pages) || [];
      const oldPageParams = ((_e2 = context.state.data) == null ? void 0 : _e2.pageParams) || [];
      let result = { pages: [], pageParams: [] };
      let currentPage = 0;
      const fetchFn = async () => {
        let cancelled = false;
        const addSignalProperty = (object) => {
          addConsumeAwareSignal(
            object,
            () => context.signal,
            () => cancelled = true
          );
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject();
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const createQueryFnContext = () => {
            const queryFnContext2 = {
              client: context.client,
              queryKey: context.queryKey,
              pageParam: param,
              direction: previous ? "backward" : "forward",
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext2);
            return queryFnContext2;
          };
          const queryFnContext = createQueryFnContext();
          const page = await queryFn(queryFnContext);
          const { maxPages } = context.options;
          const addTo = previous ? addToStart : addToEnd;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          const remainingPages = pages ?? oldPages.length;
          do {
            const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
            if (currentPage > 0 && param == null) {
              break;
            }
            result = await fetchPage(result, param);
            currentPage++;
          } while (currentPage < remainingPages);
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          var _a3, _b3;
          return (_b3 = (_a3 = context.options).persister) == null ? void 0 : _b3.call(
            _a3,
            fetchFn,
            {
              client: context.client,
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  ) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
  var _a2;
  return pages.length > 0 ? (_a2 = options.getPreviousPageParam) == null ? void 0 : _a2.call(options, pages[0], pages, pageParams[0], pageParams) : void 0;
}
var Mutation = (_f = class extends Removable {
  constructor(config) {
    super();
    __privateAdd(this, _Mutation_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _observers);
    __privateAdd(this, _mutationCache);
    __privateAdd(this, _retryer2);
    __privateSet(this, _client2, config.client);
    this.mutationId = config.mutationId;
    __privateSet(this, _mutationCache, config.mutationCache);
    __privateSet(this, _observers, []);
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = options;
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(observer) {
    if (!__privateGet(this, _observers).includes(observer)) {
      __privateGet(this, _observers).push(observer);
      this.clearGcTimeout();
      __privateGet(this, _mutationCache).notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    __privateSet(this, _observers, __privateGet(this, _observers).filter((x) => x !== observer));
    this.scheduleGc();
    __privateGet(this, _mutationCache).notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!__privateGet(this, _observers).length) {
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        __privateGet(this, _mutationCache).remove(this);
      }
    }
  }
  continue() {
    var _a2;
    return ((_a2 = __privateGet(this, _retryer2)) == null ? void 0 : _a2.continue()) ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j, _k, _l, _m, _n, _o, _p, _q, _r;
    const onContinue = () => {
      __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "continue" });
    };
    const mutationFnContext = {
      client: __privateGet(this, _client2),
      meta: this.options.meta,
      mutationKey: this.options.mutationKey
    };
    __privateSet(this, _retryer2, createRetryer({
      fn: () => {
        if (!this.options.mutationFn) {
          return Promise.reject(new Error("No mutationFn found"));
        }
        return this.options.mutationFn(variables, mutationFnContext);
      },
      onFail: (failureCount, error) => {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "failed", failureCount, error });
      },
      onPause: () => {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "pause" });
      },
      onContinue,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => __privateGet(this, _mutationCache).canRun(this)
    }));
    const restored = this.state.status === "pending";
    const isPaused = !__privateGet(this, _retryer2).canStart();
    try {
      if (restored) {
        onContinue();
      } else {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "pending", variables, isPaused });
        if (__privateGet(this, _mutationCache).config.onMutate) {
          await __privateGet(this, _mutationCache).config.onMutate(
            variables,
            this,
            mutationFnContext
          );
        }
        const context = await ((_b2 = (_a2 = this.options).onMutate) == null ? void 0 : _b2.call(
          _a2,
          variables,
          mutationFnContext
        ));
        if (context !== this.state.context) {
          __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, {
            type: "pending",
            context,
            variables,
            isPaused
          });
        }
      }
      const data = await __privateGet(this, _retryer2).start();
      await ((_d2 = (_c2 = __privateGet(this, _mutationCache).config).onSuccess) == null ? void 0 : _d2.call(
        _c2,
        data,
        variables,
        this.state.context,
        this,
        mutationFnContext
      ));
      await ((_f2 = (_e2 = this.options).onSuccess) == null ? void 0 : _f2.call(
        _e2,
        data,
        variables,
        this.state.context,
        mutationFnContext
      ));
      await ((_h2 = (_g2 = __privateGet(this, _mutationCache).config).onSettled) == null ? void 0 : _h2.call(
        _g2,
        data,
        null,
        this.state.variables,
        this.state.context,
        this,
        mutationFnContext
      ));
      await ((_j = (_i2 = this.options).onSettled) == null ? void 0 : _j.call(
        _i2,
        data,
        null,
        variables,
        this.state.context,
        mutationFnContext
      ));
      __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "success", data });
      return data;
    } catch (error) {
      try {
        await ((_l = (_k = __privateGet(this, _mutationCache).config).onError) == null ? void 0 : _l.call(
          _k,
          error,
          variables,
          this.state.context,
          this,
          mutationFnContext
        ));
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await ((_n = (_m = this.options).onError) == null ? void 0 : _n.call(
          _m,
          error,
          variables,
          this.state.context,
          mutationFnContext
        ));
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await ((_p = (_o = __privateGet(this, _mutationCache).config).onSettled) == null ? void 0 : _p.call(
          _o,
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this,
          mutationFnContext
        ));
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await ((_r = (_q = this.options).onSettled) == null ? void 0 : _r.call(
          _q,
          void 0,
          error,
          variables,
          this.state.context,
          mutationFnContext
        ));
      } catch (e) {
        void Promise.reject(e);
      }
      __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "error", error });
      throw error;
    } finally {
      __privateGet(this, _mutationCache).runNext(this);
    }
  }
}, _client2 = new WeakMap(), _observers = new WeakMap(), _mutationCache = new WeakMap(), _retryer2 = new WeakMap(), _Mutation_instances = new WeakSet(), dispatch_fn2 = function(action) {
  const reducer = (state) => {
    switch (action.type) {
      case "failed":
        return {
          ...state,
          failureCount: action.failureCount,
          failureReason: action.error
        };
      case "pause":
        return {
          ...state,
          isPaused: true
        };
      case "continue":
        return {
          ...state,
          isPaused: false
        };
      case "pending":
        return {
          ...state,
          context: action.context,
          data: void 0,
          failureCount: 0,
          failureReason: null,
          error: null,
          isPaused: action.isPaused,
          status: "pending",
          variables: action.variables,
          submittedAt: Date.now()
        };
      case "success":
        return {
          ...state,
          data: action.data,
          failureCount: 0,
          failureReason: null,
          error: null,
          status: "success",
          isPaused: false
        };
      case "error":
        return {
          ...state,
          data: void 0,
          error: action.error,
          failureCount: state.failureCount + 1,
          failureReason: action.error,
          isPaused: false,
          status: "error"
        };
    }
  };
  this.state = reducer(this.state);
  notifyManager.batch(() => {
    __privateGet(this, _observers).forEach((observer) => {
      observer.onMutationUpdate(action);
    });
    __privateGet(this, _mutationCache).notify({
      mutation: this,
      type: "updated",
      action
    });
  });
}, _f);
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}
var MutationCache = (_g = class extends Subscribable {
  constructor(config = {}) {
    super();
    __privateAdd(this, _mutations);
    __privateAdd(this, _scopes);
    __privateAdd(this, _mutationId);
    this.config = config;
    __privateSet(this, _mutations, /* @__PURE__ */ new Set());
    __privateSet(this, _scopes, /* @__PURE__ */ new Map());
    __privateSet(this, _mutationId, 0);
  }
  build(client2, options, state) {
    const mutation = new Mutation({
      client: client2,
      mutationCache: this,
      mutationId: ++__privateWrapper(this, _mutationId)._,
      options: client2.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    __privateGet(this, _mutations).add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = __privateGet(this, _scopes).get(scope);
      if (scopedMutations) {
        scopedMutations.push(mutation);
      } else {
        __privateGet(this, _scopes).set(scope, [mutation]);
      }
    }
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    if (__privateGet(this, _mutations).delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = __privateGet(this, _scopes).get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index = scopedMutations.indexOf(mutation);
            if (index !== -1) {
              scopedMutations.splice(index, 1);
            }
          } else if (scopedMutations[0] === mutation) {
            __privateGet(this, _scopes).delete(scope);
          }
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const mutationsWithSameScope = __privateGet(this, _scopes).get(scope);
      const firstPendingMutation = mutationsWithSameScope == null ? void 0 : mutationsWithSameScope.find(
        (m) => m.state.status === "pending"
      );
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else {
      return true;
    }
  }
  runNext(mutation) {
    var _a2;
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const foundMutation = (_a2 = __privateGet(this, _scopes).get(scope)) == null ? void 0 : _a2.find((m) => m !== mutation && m.state.isPaused);
      return (foundMutation == null ? void 0 : foundMutation.continue()) ?? Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  clear() {
    notifyManager.batch(() => {
      __privateGet(this, _mutations).forEach((mutation) => {
        this.notify({ type: "removed", mutation });
      });
      __privateGet(this, _mutations).clear();
      __privateGet(this, _scopes).clear();
    });
  }
  getAll() {
    return Array.from(__privateGet(this, _mutations));
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop))
      )
    );
  }
}, _mutations = new WeakMap(), _scopes = new WeakMap(), _mutationId = new WeakMap(), _g);
function scopeFor(mutation) {
  var _a2;
  return (_a2 = mutation.options.scope) == null ? void 0 : _a2.id;
}
var QueryCache = (_h = class extends Subscribable {
  constructor(config = {}) {
    super();
    __privateAdd(this, _queries);
    this.config = config;
    __privateSet(this, _queries, /* @__PURE__ */ new Map());
  }
  build(client2, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client: client2,
        queryKey,
        queryHash,
        options: client2.defaultQueryOptions(options),
        state,
        defaultOptions: client2.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!__privateGet(this, _queries).has(query.queryHash)) {
      __privateGet(this, _queries).set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = __privateGet(this, _queries).get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        __privateGet(this, _queries).delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return __privateGet(this, _queries).get(queryHash);
  }
  getAll() {
    return [...__privateGet(this, _queries).values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
}, _queries = new WeakMap(), _h);
var QueryClient = (_i = class {
  constructor(config = {}) {
    __privateAdd(this, _queryCache);
    __privateAdd(this, _mutationCache2);
    __privateAdd(this, _defaultOptions2);
    __privateAdd(this, _queryDefaults);
    __privateAdd(this, _mutationDefaults);
    __privateAdd(this, _mountCount);
    __privateAdd(this, _unsubscribeFocus);
    __privateAdd(this, _unsubscribeOnline);
    __privateSet(this, _queryCache, config.queryCache || new QueryCache());
    __privateSet(this, _mutationCache2, config.mutationCache || new MutationCache());
    __privateSet(this, _defaultOptions2, config.defaultOptions || {});
    __privateSet(this, _queryDefaults, /* @__PURE__ */ new Map());
    __privateSet(this, _mutationDefaults, /* @__PURE__ */ new Map());
    __privateSet(this, _mountCount, 0);
  }
  mount() {
    __privateWrapper(this, _mountCount)._++;
    if (__privateGet(this, _mountCount) !== 1) return;
    __privateSet(this, _unsubscribeFocus, focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        __privateGet(this, _queryCache).onFocus();
      }
    }));
    __privateSet(this, _unsubscribeOnline, onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        __privateGet(this, _queryCache).onOnline();
      }
    }));
  }
  unmount() {
    var _a2, _b2;
    __privateWrapper(this, _mountCount)._--;
    if (__privateGet(this, _mountCount) !== 0) return;
    (_a2 = __privateGet(this, _unsubscribeFocus)) == null ? void 0 : _a2.call(this);
    __privateSet(this, _unsubscribeFocus, void 0);
    (_b2 = __privateGet(this, _unsubscribeOnline)) == null ? void 0 : _b2.call(this);
    __privateSet(this, _unsubscribeOnline, void 0);
  }
  isFetching(filters) {
    return __privateGet(this, _queryCache).findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return __privateGet(this, _mutationCache2).findAll({ ...filters, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(queryKey) {
    var _a2;
    const options = this.defaultQueryOptions({ queryKey });
    return (_a2 = __privateGet(this, _queryCache).get(options.queryHash)) == null ? void 0 : _a2.state.data;
  }
  ensureQueryData(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    const query = __privateGet(this, _queryCache).build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) {
      return this.fetchQuery(options);
    }
    if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
      void this.prefetchQuery(defaultedOptions);
    }
    return Promise.resolve(cachedData);
  }
  getQueriesData(filters) {
    return __privateGet(this, _queryCache).findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = __privateGet(this, _queryCache).get(
      defaultedOptions.queryHash
    );
    const prevData = query == null ? void 0 : query.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return __privateGet(this, _queryCache).build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => __privateGet(this, _queryCache).findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    var _a2;
    const options = this.defaultQueryOptions({ queryKey });
    return (_a2 = __privateGet(this, _queryCache).get(
      options.queryHash
    )) == null ? void 0 : _a2.state;
  }
  removeQueries(filters) {
    const queryCache = __privateGet(this, _queryCache);
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = __privateGet(this, _queryCache);
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(
        {
          type: "active",
          ...filters
        },
        options
      );
    });
  }
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = notifyManager.batch(
      () => __privateGet(this, _queryCache).findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(noop).catch(noop);
  }
  invalidateQueries(filters, options = {}) {
    return notifyManager.batch(() => {
      __privateGet(this, _queryCache).findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if ((filters == null ? void 0 : filters.refetchType) === "none") {
        return Promise.resolve();
      }
      return this.refetchQueries(
        {
          ...filters,
          type: (filters == null ? void 0 : filters.refetchType) ?? (filters == null ? void 0 : filters.type) ?? "active"
        },
        options
      );
    });
  }
  refetchQueries(filters, options = {}) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(
      () => __privateGet(this, _queryCache).findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(noop);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = __privateGet(this, _queryCache).build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop).catch(noop);
  }
  fetchInfiniteQuery(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop).catch(noop);
  }
  ensureInfiniteQueryData(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.ensureQueryData(options);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return __privateGet(this, _mutationCache2).resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return __privateGet(this, _queryCache);
  }
  getMutationCache() {
    return __privateGet(this, _mutationCache2);
  }
  getDefaultOptions() {
    return __privateGet(this, _defaultOptions2);
  }
  setDefaultOptions(options) {
    __privateSet(this, _defaultOptions2, options);
  }
  setQueryDefaults(queryKey, options) {
    __privateGet(this, _queryDefaults).set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults = [...__privateGet(this, _queryDefaults).values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    __privateGet(this, _mutationDefaults).set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults = [...__privateGet(this, _mutationDefaults).values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...__privateGet(this, _defaultOptions2).queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options == null ? void 0 : options._defaulted) {
      return options;
    }
    return {
      ...__privateGet(this, _defaultOptions2).mutations,
      ...(options == null ? void 0 : options.mutationKey) && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    __privateGet(this, _queryCache).clear();
    __privateGet(this, _mutationCache2).clear();
  }
}, _queryCache = new WeakMap(), _mutationCache2 = new WeakMap(), _defaultOptions2 = new WeakMap(), _queryDefaults = new WeakMap(), _mutationDefaults = new WeakMap(), _mountCount = new WeakMap(), _unsubscribeFocus = new WeakMap(), _unsubscribeOnline = new WeakMap(), _i);
var QueryClientContext = reactExports.createContext(
  void 0
);
var QueryClientProvider = ({
  client: client2,
  children
}) => {
  reactExports.useEffect(() => {
    client2.mount();
    return () => {
      client2.unmount();
    };
  }, [client2]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, { value: client2, children });
};
function QueryProvider({ children }) {
  const [queryClient] = reactExports.useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1e3 * 60 * 5,
          // 5 minutes
          retry: (failureCount, error) => {
            if (error && typeof error === "object" && "status" in error) {
              const status = error.status;
              if (status >= 400 && status < 500) {
                return false;
              }
            }
            return failureCount < 3;
          },
          refetchOnWindowFocus: false,
          refetchOnReconnect: true
        },
        mutations: {
          retry: 1
        }
      }
    })
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    children,
    false
  ] });
}
function App() {
  const { loading, isAuthenticated, currentUser, login, logout } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SoundProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(NexusProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AppContent,
    {
      loading,
      isAuthenticated,
      currentUser,
      handleLogin: login,
      handleLogout: logout
    }
  ) }) }) }) }) }) });
}
const AppContext = reactExports.createContext(void 0);
const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const value = {
    isLoading,
    setIsLoading,
    error,
    setError
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppContext.Provider, { value, children });
};
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React$1.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
);
