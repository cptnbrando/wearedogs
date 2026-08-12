/**
 * Potato polyfills — the hand-rolled replacement for @vitejs/plugin-legacy's
 * 54 KB core-js bundle.
 *
 * The build targets Chromium 63 (see POTATO_JS_TARGET in vite.config.js):
 * the oldest engine that can load module scripts with dynamic import(),
 * which is what Samsung Tizen 5.0 (2019) TVs ship. oxc down-compiles all
 * newer *syntax* natively at build time; what it cannot invent are missing
 * *built-ins*, so everything Chromium 63 lacks that this app, the Svelte 5
 * runtime, or vendored libraries actually call is filled in here — guarded,
 * non-enumerable, and only when the native version is absent.
 *
 * Loaded as its own module entry in index.html, before main.js, so these
 * exist before any vendor module-level code runs. Anything older than
 * Chromium 61 never reaches this file — index.html routes it to /lite/.
 *
 * Deliberately NOT polyfilled (same as the old core-js setup, so no
 * regression): Intl.DisplayNames / Intl.Segmenter (language panel degrades),
 * navigator.clipboard (components feature-check it), and WASM-era APIs the
 * heavy panels (Wiretap, OCR) need — those apps are beyond a potato anyway.
 */

/* eslint-disable no-extend-native */

/** Non-enumerable prototype/namespace patch; skips anything already native. */
function define(target, name, value) {
  if (name in target) return;
  Object.defineProperty(target, name, {
    value: value,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

// --- globalThis (Chrome 71) — must come first, later shims hang off it ----
if (typeof globalThis === 'undefined') {
  define(window, 'globalThis', window);
}

// --- queueMicrotask (Chrome 71) — Svelte 5's task scheduler calls this ----
define(globalThis, 'queueMicrotask', function queueMicrotask(callback) {
  Promise.resolve().then(callback).catch(function (error) {
    setTimeout(function () { throw error; }, 0);
  });
});

// --- Object statics ------------------------------------------------------
define(Object, 'fromEntries', function fromEntries(entries) {
  const result = {};
  for (const entry of entries) result[entry[0]] = entry[1];
  return result;
});

define(Object, 'hasOwn', function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(Object(object), key);
});

// --- Array.prototype (flat/flatMap 69, at 92, findLast/findLastIndex 97) --
define(Array.prototype, 'flat', function flat(depth) {
  const levels = depth === undefined ? 1 : Math.floor(depth);
  const result = [];
  for (const item of this) {
    if (Array.isArray(item) && levels > 0) {
      result.push.apply(result, item.flat(levels - 1));
    } else {
      result.push(item);
    }
  }
  return result;
});

define(Array.prototype, 'flatMap', function flatMap(callback, thisArg) {
  return this.map(callback, thisArg).flat(1);
});

/** Shared by Array.prototype.at and String.prototype.at. */
function atIndex(subject, index) {
  const n = Math.trunc(index) || 0;
  const i = n < 0 ? subject.length + n : n;
  if (i < 0 || i >= subject.length) return undefined;
  return subject[i];
}

define(Array.prototype, 'at', function at(index) { return atIndex(this, index); });
define(String.prototype, 'at', function at(index) { return atIndex(this, index); });

define(Array.prototype, 'findLast', function findLast(predicate, thisArg) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (predicate.call(thisArg, this[i], i, this)) return this[i];
  }
  return undefined;
});

define(Array.prototype, 'findLastIndex', function findLastIndex(predicate, thisArg) {
  for (let i = this.length - 1; i >= 0; i--) {
    if (predicate.call(thisArg, this[i], i, this)) return i;
  }
  return -1;
});

// --- String.prototype (trimStart/End 66, matchAll 73, replaceAll 85) ------
define(String.prototype, 'trimStart', function trimStart() {
  return this.replace(/^\s+/, '');
});

define(String.prototype, 'trimEnd', function trimEnd() {
  return this.replace(/\s+$/, '');
});

define(String.prototype, 'matchAll', function matchAll(pattern) {
  const re = new RegExp(pattern.source, pattern.flags.indexOf('g') === -1 ? pattern.flags + 'g' : pattern.flags);
  const subject = String(this);
  const matches = [];
  let match;
  while ((match = re.exec(subject)) !== null) {
    matches.push(match);
    if (match[0] === '') re.lastIndex += 1; // zero-width match: don't spin forever
  }
  return matches[Symbol.iterator]();
});

define(String.prototype, 'replaceAll', function replaceAll(search, replacement) {
  if (search instanceof RegExp) return this.replace(search, replacement);
  // Function replacers need per-occurrence calls; split/join only handles strings.
  if (typeof replacement === 'function') {
    return this.replace(
      new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      replacement,
    );
  }
  return this.split(String(search)).join(String(replacement));
});

// --- Promise statics (allSettled 76, any 85) ------------------------------
define(Promise, 'allSettled', function allSettled(promises) {
  const wrapped = Array.from(promises, function (p) {
    return Promise.resolve(p).then(
      function (value) { return { status: 'fulfilled', value: value }; },
      function (reason) { return { status: 'rejected', reason: reason }; },
    );
  });
  return Promise.all(wrapped);
});

define(Promise, 'any', function any(promises) {
  return new Promise(function (resolve, reject) {
    const errors = [];
    let pending = 0;
    let settled = false;
    Array.from(promises).forEach(function (p, i) {
      pending++;
      Promise.resolve(p).then(
        function (value) {
          if (settled) return;
          settled = true;
          resolve(value);
        },
        function (reason) {
          errors[i] = reason;
          if (--pending === 0 && !settled) {
            const error = new Error('All promises were rejected');
            error.name = 'AggregateError';
            error.errors = errors;
            reject(error);
          }
        },
      );
    });
    if (pending === 0) {
      const error = new Error('All promises were rejected');
      error.name = 'AggregateError';
      error.errors = [];
      reject(error);
    }
  });
});

// --- structuredClone (Chrome 98) — Svelte 5 uses it in $state.snapshot ----
define(globalThis, 'structuredClone', function structuredClone(value) {
  return deepClone(value, new Map());
});

/**
 * Structured-clone-lite: covers the shapes app state actually holds
 * (JSON-ish data plus Date/Map/Set/typed arrays), cycle-safe. Functions and
 * DOM nodes throw, matching the native algorithm's behavior.
 *
 * @param {*} value
 * @param {Map<object, object>} seen already-cloned objects, for cycles
 */
function deepClone(value, seen) {
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'function') throw new TypeError('structuredClone: functions are not cloneable');
    return value;
  }
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (ArrayBuffer.isView(value)) return new value.constructor(value);
  if (value instanceof ArrayBuffer) return value.slice(0);

  if (Array.isArray(value)) {
    const arr = [];
    seen.set(value, arr);
    for (let i = 0; i < value.length; i++) arr[i] = deepClone(value[i], seen);
    return arr;
  }
  if (value instanceof Map) {
    const map = new Map();
    seen.set(value, map);
    value.forEach(function (v, k) { map.set(deepClone(k, seen), deepClone(v, seen)); });
    return map;
  }
  if (value instanceof Set) {
    const set = new Set();
    seen.set(value, set);
    value.forEach(function (v) { set.add(deepClone(v, seen)); });
    return set;
  }

  const clone = {};
  seen.set(value, clone);
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      clone[key] = deepClone(value[key], seen);
    }
  }
  return clone;
}

// --- DOM: Element.replaceChildren (Chrome 86) -----------------------------
[Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function (proto) {
  define(proto, 'replaceChildren', function replaceChildren() {
    while (this.firstChild) this.removeChild(this.firstChild);
    for (let i = 0; i < arguments.length; i++) this.append(arguments[i]);
  });
});

// --- AbortController (Chrome 66) ------------------------------------------
// Enough for app-side cancellation logic: .signal.aborted flips, 'abort'
// listeners and onabort fire. Chromium 63's fetch() predates the signal
// option and simply ignores it — in-flight requests won't be killed, but
// callers observing the signal behave correctly.
if (typeof AbortController === 'undefined') {
  const SIGNAL_LISTENERS = '__potatoAbortListeners';

  function PotatoAbortSignal() {
    this.aborted = false;
    this.reason = undefined;
    this.onabort = null;
    this[SIGNAL_LISTENERS] = [];
  }
  PotatoAbortSignal.prototype.addEventListener = function (type, listener) {
    if (type === 'abort') this[SIGNAL_LISTENERS].push(listener);
  };
  PotatoAbortSignal.prototype.removeEventListener = function (type, listener) {
    if (type !== 'abort') return;
    const i = this[SIGNAL_LISTENERS].indexOf(listener);
    if (i !== -1) this[SIGNAL_LISTENERS].splice(i, 1);
  };
  PotatoAbortSignal.prototype.throwIfAborted = function () {
    if (!this.aborted) return;
    const error = new Error('The operation was aborted');
    error.name = 'AbortError';
    throw error;
  };

  function PotatoAbortController() {
    this.signal = new PotatoAbortSignal();
  }
  PotatoAbortController.prototype.abort = function (reason) {
    const signal = this.signal;
    if (signal.aborted) return;
    signal.aborted = true;
    signal.reason = reason;
    const event = { type: 'abort', target: signal };
    if (typeof signal.onabort === 'function') signal.onabort(event);
    signal[SIGNAL_LISTENERS].slice().forEach(function (listener) { listener(event); });
  };

  define(globalThis, 'AbortController', PotatoAbortController);
  define(globalThis, 'AbortSignal', PotatoAbortSignal);
}

// --- ResizeObserver (Chrome 64) --------------------------------------------
// Chromium 63 is one version short. Viewport-driven shim: observed elements
// are re-measured on window resize/orientation change and once at observe()
// time — on a TV that's the only way an element ever changes size.
if (typeof ResizeObserver === 'undefined') {
  function PotatoResizeObserver(callback) {
    this._callback = callback;
    this._targets = [];
    const self = this;
    this._handler = function () { self._measure(); };
    window.addEventListener('resize', this._handler);
    window.addEventListener('orientationchange', this._handler);
  }
  PotatoResizeObserver.prototype._measure = function () {
    if (this._targets.length === 0) return;
    const entries = this._targets.map(function (target) {
      return { target: target, contentRect: target.getBoundingClientRect() };
    });
    this._callback(entries, this);
  };
  PotatoResizeObserver.prototype.observe = function (target) {
    if (this._targets.indexOf(target) !== -1) return;
    this._targets.push(target);
    const self = this;
    queueMicrotask(function () { self._measure(); });
  };
  PotatoResizeObserver.prototype.unobserve = function (target) {
    const i = this._targets.indexOf(target);
    if (i !== -1) this._targets.splice(i, 1);
  };
  PotatoResizeObserver.prototype.disconnect = function () {
    this._targets = [];
    window.removeEventListener('resize', this._handler);
    window.removeEventListener('orientationchange', this._handler);
  };

  define(globalThis, 'ResizeObserver', PotatoResizeObserver);
}
