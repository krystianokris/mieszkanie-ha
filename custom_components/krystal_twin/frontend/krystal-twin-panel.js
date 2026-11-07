const yi = (e, t) => e === t, er = Symbol("solid-proxy"), vi = typeof Proxy == "function", Ea = Symbol("solid-track"), xn = {
  equals: yi
};
let At = null, La = Da;
const Ie = 1, wn = 2, Aa = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
}, Wn = {};
var X = null;
let Gn = null, _i = null, se = null, we = null, Re = null, Mn = 0;
function xt(e, t) {
  const r = se, n = X, a = e.length === 0, o = t === void 0 ? n : t, i = a ? Aa : {
    owned: null,
    cleanups: null,
    context: o ? o.context : null,
    owner: o
  }, l = a ? e : () => e(() => pe(() => Nt(i)));
  X = i, se = null;
  try {
    return at(l, !0);
  } finally {
    se = r, X = n;
  }
}
function J(e, t) {
  t = t ? Object.assign({}, xn, t) : xn;
  const r = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, n = (a) => (typeof a == "function" && (a = a(r.value)), ja(r, a));
  return [Na.bind(r), n];
}
function $i(e, t, r) {
  const n = Kt(e, t, !0, Ie);
  kt(n);
}
function W(e, t, r) {
  const n = Kt(e, t, !1, Ie);
  kt(n);
}
function ft(e, t, r) {
  La = Oi;
  const n = Kt(e, t, !1, Ie);
  n.user = !0, Re ? Re.push(n) : kt(n);
}
function K(e, t, r) {
  r = r ? Object.assign({}, xn, r) : xn;
  const n = Kt(e, t, !0, 0);
  return n.observers = null, n.observerSlots = null, n.comparator = r.equals || void 0, kt(n), Na.bind(n);
}
function zi(e) {
  return e && typeof e == "object" && "then" in e;
}
function Si(e, t, r) {
  let n, a, o;
  typeof t == "function" ? (n = e, a = t, o = {}) : (n = !0, a = e, o = t || {});
  let i = null, l = Wn, c = !1, f = "initialValue" in o, g = typeof n == "function" && K(n);
  const p = /* @__PURE__ */ new Set(), [x, b] = (o.storage || J)(o.initialValue), [k, m] = J(void 0), [h, v] = J(void 0, {
    equals: !1
  }), [S, _] = J(f ? "ready" : "unresolved");
  function $(P, w, R, A) {
    return i === P && (i = null, A !== void 0 && (f = !0), (P === l || w === l) && o.onHydrated && queueMicrotask(() => o.onHydrated(A, {
      value: w
    })), l = Wn, C(w, R)), w;
  }
  function C(P, w) {
    at(() => {
      w === void 0 && b(() => P), _(w !== void 0 ? "errored" : f ? "ready" : "unresolved"), m(w);
      for (const R of p.keys()) R.decrement();
      p.clear();
    }, !1);
  }
  function y() {
    const P = Li, w = x(), R = k();
    if (R !== void 0 && !i) throw R;
    return se && se.user, w;
  }
  function z(P = !0) {
    if (P !== !1 && c) return;
    c = !1;
    const w = g ? g() : n;
    if (w == null || w === !1) {
      $(i, pe(x));
      return;
    }
    let R;
    const A = l !== Wn ? l : pe(() => {
      try {
        return a(w, {
          value: x(),
          refetching: P
        });
      } catch (E) {
        R = E;
      }
    });
    if (R !== void 0) {
      $(i, void 0, fn(R), w);
      return;
    } else if (!zi(A))
      return $(i, A, void 0, w), A;
    return i = A, "v" in A ? (A.s === 1 ? $(i, A.v, void 0, w) : $(i, void 0, fn(A.v), w), A) : (c = !0, queueMicrotask(() => c = !1), at(() => {
      _(f ? "refreshing" : "pending"), v();
    }, !1), A.then((E) => $(A, E, void 0, w), (E) => $(A, void 0, fn(E), w)));
  }
  Object.defineProperties(y, {
    state: {
      get: () => S()
    },
    error: {
      get: () => k()
    },
    loading: {
      get() {
        const P = S();
        return P === "pending" || P === "refreshing";
      }
    },
    latest: {
      get() {
        if (!f) return y();
        const P = k();
        if (P && !i) throw P;
        return x();
      }
    }
  });
  let T = X;
  return g ? $i(() => (T = X, z(!1))) : z(!1), [y, {
    refetch: (P) => Pi(T, () => z(P)),
    mutate: b
  }];
}
function pe(e) {
  if (se === null) return e();
  const t = se;
  se = null;
  try {
    return e();
  } finally {
    se = t;
  }
}
function Ra(e) {
  ft(() => pe(e));
}
function Be(e) {
  return X === null || (X.cleanups === null ? X.cleanups = [e] : X.cleanups.push(e)), e;
}
function Ci(e, t) {
  At || (At = Symbol("error")), X = Kt(void 0, void 0, !0), X.context = {
    ...X.context,
    [At]: [t]
  };
  try {
    return e();
  } catch (r) {
    Ut(r);
  } finally {
    X = X.owner;
  }
}
function Ti() {
  return X;
}
function Pi(e, t) {
  const r = X, n = se;
  X = e, se = null;
  try {
    return at(t, !0);
  } catch (a) {
    Ut(a);
  } finally {
    X = r, se = n;
  }
}
const [$g, zg] = /* @__PURE__ */ J(!1);
function Mi(e, t) {
  const r = Symbol("context");
  return {
    id: r,
    Provider: Ni(r),
    defaultValue: e
  };
}
function Ei(e) {
  let t;
  return X && X.context && (t = X.context[e.id]) !== void 0 ? t : e.defaultValue;
}
function Oa(e) {
  const t = K(e), r = K(() => tr(t()));
  return r.toArray = () => {
    const n = r();
    return Array.isArray(n) ? n : n != null ? [n] : [];
  }, r;
}
let Li;
function Na() {
  if (this.sources && this.state)
    if (this.state === Ie) kt(this);
    else {
      const e = we;
      we = null, at(() => yn(this), !1), we = e;
    }
  if (se) {
    const e = this.observers ? this.observers.length : 0;
    se.sources ? (se.sources.push(this), se.sourceSlots.push(e)) : (se.sources = [this], se.sourceSlots = [e]), this.observers ? (this.observers.push(se), this.observerSlots.push(se.sources.length - 1)) : (this.observers = [se], this.observerSlots = [se.sources.length - 1]);
  }
  return this.value;
}
function ja(e, t, r) {
  let n = e.value;
  return (!e.comparator || !e.comparator(n, t)) && (e.value = t, e.observers && e.observers.length && at(() => {
    for (let a = 0; a < e.observers.length; a += 1) {
      const o = e.observers[a], i = Gn && Gn.running;
      i && Gn.disposed.has(o), (i ? !o.tState : !o.state) && (o.pure ? we.push(o) : Re.push(o), o.observers && Wa(o)), i || (o.state = Ie);
    }
    if (we.length > 1e6)
      throw we = [], new Error();
  }, !1)), t;
}
function kt(e) {
  if (!e.fn) return;
  Nt(e);
  const t = Mn;
  Ai(e, e.value, t);
}
function Ai(e, t, r) {
  let n;
  const a = X, o = se;
  se = X = e;
  try {
    n = e.fn(t);
  } catch (i) {
    return e.pure && (e.state = Ie, e.owned && e.owned.forEach(Nt), e.owned = null), e.updatedAt = r + 1, Ut(i);
  } finally {
    se = o, X = a;
  }
  (!e.updatedAt || e.updatedAt <= r) && (e.updatedAt != null && "observers" in e ? ja(e, n) : e.value = n, e.updatedAt = r);
}
function Kt(e, t, r, n = Ie, a) {
  const o = {
    fn: e,
    state: n,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: X,
    context: X ? X.context : null,
    pure: r
  };
  return X === null || X !== Aa && (X.owned ? X.owned.push(o) : X.owned = [o]), o;
}
function kn(e) {
  if (e.state === 0) return;
  if (e.state === wn) return yn(e);
  if (e.suspense && pe(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Mn); )
    e.state && t.push(e);
  for (let r = t.length - 1; r >= 0; r--)
    if (e = t[r], e.state === Ie)
      kt(e);
    else if (e.state === wn) {
      const n = we;
      we = null, at(() => yn(e, t[0]), !1), we = n;
    }
}
function at(e, t) {
  if (we) return e();
  let r = !1;
  t || (we = []), Re ? r = !0 : Re = [], Mn++;
  try {
    const n = e();
    return Ri(r), n;
  } catch (n) {
    r || (Re = null), we = null, Ut(n);
  }
}
function Ri(e) {
  if (we && (Da(we), we = null), e) return;
  const t = Re;
  Re = null, t.length && at(() => La(t), !1);
}
function Da(e) {
  for (let t = 0; t < e.length; t++) kn(e[t]);
}
function Oi(e) {
  let t, r = 0;
  for (t = 0; t < e.length; t++) {
    const n = e[t];
    n.user ? e[r++] = n : kn(n);
  }
  for (t = 0; t < r; t++) kn(e[t]);
}
function yn(e, t) {
  e.state = 0;
  for (let r = 0; r < e.sources.length; r += 1) {
    const n = e.sources[r];
    if (n.sources) {
      const a = n.state;
      a === Ie ? n !== t && (!n.updatedAt || n.updatedAt < Mn) && kn(n) : a === wn && yn(n, t);
    }
  }
}
function Wa(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const r = e.observers[t];
    r.state || (r.state = wn, r.pure ? we.push(r) : Re.push(r), r.observers && Wa(r));
  }
}
function Nt(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const r = e.sources.pop(), n = e.sourceSlots.pop(), a = r.observers;
      if (a && a.length) {
        const o = a.pop(), i = r.observerSlots.pop();
        n < a.length && (o.sourceSlots[i] = n, a[n] = o, r.observerSlots[n] = i);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) Nt(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) Nt(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function fn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function Or(e, t, r) {
  try {
    for (const n of t) n(e);
  } catch (n) {
    Ut(n, r && r.owner || null);
  }
}
function Ut(e, t = X) {
  const r = At && t && t.context && t.context[At], n = fn(e);
  if (!r) throw n;
  Re ? Re.push({
    fn() {
      Or(n, r, t);
    },
    state: Ie
  }) : Or(n, r, t);
}
function tr(e) {
  if (typeof e == "function" && !e.length) return tr(e());
  if (Array.isArray(e)) {
    const t = [];
    for (let r = 0; r < e.length; r++) {
      const n = tr(e[r]);
      Array.isArray(n) ? t.push.apply(t, n) : t.push(n);
    }
    return t;
  }
  return e;
}
function Ni(e, t) {
  return function(n) {
    let a;
    return W(() => a = pe(() => (X.context = {
      ...X.context,
      [e]: n.value
    }, Oa(() => n.children))), void 0), a;
  };
}
const nr = Symbol("fallback");
function vn(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function ji(e, t, r = {}) {
  let n = [], a = [], o = [], i = 0, l = t.length > 1 ? [] : null;
  return Be(() => vn(o)), () => {
    let c = e() || [], f = c.length, g, p;
    return c[Ea], pe(() => {
      let b, k, m, h, v, S, _, $, C;
      if (f === 0)
        i !== 0 && (vn(o), o = [], n = [], a = [], i = 0, l && (l = [])), r.fallback && (n = [nr], a[0] = xt((y) => (o[0] = y, r.fallback())), i = 1);
      else if (i === 0) {
        for (a = new Array(f), p = 0; p < f; p++)
          n[p] = c[p], a[p] = xt(x);
        i = f;
      } else {
        for (m = new Array(f), h = new Array(f), l && (v = new Array(f)), S = 0, _ = Math.min(i, f); S < _ && n[S] === c[S]; S++) ;
        for (_ = i - 1, $ = f - 1; _ >= S && $ >= S && n[_] === c[$]; _--, $--)
          m[$] = a[_], h[$] = o[_], l && (v[$] = l[_]);
        for (b = /* @__PURE__ */ new Map(), k = new Array($ + 1), p = $; p >= S; p--)
          C = c[p], g = b.get(C), k[p] = g === void 0 ? -1 : g, b.set(C, p);
        for (g = S; g <= _; g++)
          C = n[g], p = b.get(C), p !== void 0 && p !== -1 ? (m[p] = a[g], h[p] = o[g], l && (v[p] = l[g]), p = k[p], b.set(C, p)) : o[g]();
        for (p = S; p < f; p++)
          p in m ? (a[p] = m[p], o[p] = h[p], l && (l[p] = v[p], l[p](p))) : a[p] = xt(x);
        a = a.slice(0, i = f), n = c.slice(0);
      }
      return a;
    });
    function x(b) {
      if (o[p] = b, l) {
        const [k, m] = J(p);
        return l[p] = m, t(c[p], k);
      }
      return t(c[p]);
    }
  };
}
function Di(e, t, r = {}) {
  let n = [], a = [], o = [], i = [], l = 0, c;
  return Be(() => vn(o)), () => {
    const f = e() || [], g = f.length;
    return f[Ea], pe(() => {
      if (g === 0)
        return l !== 0 && (vn(o), o = [], n = [], a = [], l = 0, i = []), r.fallback && (n = [nr], a[0] = xt((x) => (o[0] = x, r.fallback())), l = 1), a;
      for (n[0] === nr && (o[0](), o = [], n = [], a = [], l = 0), c = 0; c < g; c++)
        c < n.length && n[c] !== f[c] ? i[c](() => f[c]) : c >= n.length && (a[c] = xt(p));
      for (; c < n.length; c++)
        o[c]();
      return l = i.length = o.length = g, n = f.slice(0), a = a.slice(0, l);
    });
    function p(x) {
      o[c] = x;
      const [b, k] = J(f[c]);
      return i[c] = k, t(b, c);
    }
  };
}
function d(e, t) {
  return pe(() => e(t || {}));
}
function Jt() {
  return !0;
}
const Nr = {
  get(e, t, r) {
    return t === er ? r : e.get(t);
  },
  has(e, t) {
    return t === er ? !0 : e.has(t);
  },
  set: Jt,
  deleteProperty: Jt,
  getOwnPropertyDescriptor(e, t) {
    return {
      configurable: !0,
      enumerable: !0,
      get() {
        return e.get(t);
      },
      set: Jt,
      deleteProperty: Jt
    };
  },
  ownKeys(e) {
    return e.keys();
  }
};
function Wi(e, ...t) {
  if (vi && er in e) {
    const a = new Set(t.length > 1 ? t.flat() : t[0]), o = t.map((i) => new Proxy({
      get(l) {
        return i.includes(l) ? e[l] : void 0;
      },
      has(l) {
        return i.includes(l) && l in e;
      },
      keys() {
        return i.filter((l) => l in e);
      }
    }, Nr));
    return o.push(new Proxy({
      get(i) {
        return a.has(i) ? void 0 : e[i];
      },
      has(i) {
        return a.has(i) ? !1 : i in e;
      },
      keys() {
        return Object.keys(e).filter((i) => !a.has(i));
      }
    }, Nr)), o;
  }
  const r = {}, n = t.map(() => ({}));
  for (const a of Object.getOwnPropertyNames(e)) {
    const o = Object.getOwnPropertyDescriptor(e, a), i = !o.get && !o.set && o.enumerable && o.writable && o.configurable;
    let l = !1, c = 0;
    for (const f of t)
      f.includes(a) && (l = !0, i ? n[c][a] = o.value : Object.defineProperty(n[c], a, o)), ++c;
    l || (i ? r[a] = o.value : Object.defineProperty(r, a, o));
  }
  return [...n, r];
}
const Ga = (e) => `Stale read from <${e}>.`;
function B(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return K(ji(() => e.each, e.children, t || void 0));
}
function Gi(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return K(Di(() => e.each, e.children, t || void 0));
}
function N(e) {
  const t = e.keyed, r = K(() => e.when, void 0, void 0), n = t ? r : K(r, void 0, {
    equals: (a, o) => !a == !o
  });
  return K(() => {
    const a = n();
    if (a) {
      const o = e.children;
      return typeof o == "function" && o.length > 0 ? pe(() => o(t ? a : () => {
        if (!pe(n)) throw Ga("Show");
        return r();
      })) : o;
    }
    return e.fallback;
  }, void 0, void 0);
}
function Ii(e) {
  const t = Oa(() => e.children), r = K(() => {
    const n = t(), a = Array.isArray(n) ? n : [n];
    let o = () => {
    };
    for (let i = 0; i < a.length; i++) {
      const l = i, c = a[i], f = o, g = K(() => f() ? void 0 : c.when, void 0, void 0), p = c.keyed ? g : K(g, void 0, {
        equals: (x, b) => !x == !b
      });
      o = () => f() || (p() ? [l, g, c] : void 0);
    }
    return o;
  });
  return K(() => {
    const n = r()();
    if (!n) return e.fallback;
    const [a, o, i] = n, l = i.children;
    return typeof l == "function" && l.length > 0 ? pe(() => l(i.keyed ? o() : () => {
      if (pe(r)()?.[0] !== a) throw Ga("Match");
      return o();
    })) : l;
  }, void 0, void 0);
}
function te(e) {
  return e;
}
let en;
function Bi(e) {
  let t;
  const [r, n] = J(t, void 0);
  return en || (en = /* @__PURE__ */ new Set()), en.add(n), Be(() => en.delete(n)), K(() => {
    let a;
    if (a = r()) {
      const o = e.fallback;
      return typeof o == "function" && o.length ? pe(() => o(a, () => n())) : o;
    }
    return Ci(() => e.children, n);
  }, void 0, void 0);
}
const Fi = [
  "allowfullscreen",
  "async",
  "alpha",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "adauctionheaders",
  "browsingtopics",
  "credentialless",
  "defaultchecked",
  "defaultmuted",
  "defaultselected",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback",
  "preservespitch",
  "shadowrootclonable",
  "shadowrootcustomelementregistry",
  "shadowrootdelegatesfocus",
  "shadowrootserializable",
  "sharedstoragewritable"
], Hi = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "noValidate",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "adAuctionHeaders",
  "allowFullscreen",
  "browsingTopics",
  "defaultChecked",
  "defaultMuted",
  "defaultSelected",
  "disablePictureInPicture",
  "disableRemotePlayback",
  "preservesPitch",
  "shadowRootClonable",
  "shadowRootCustomElementRegistry",
  "shadowRootDelegatesFocus",
  "shadowRootSerializable",
  "sharedStorageWritable",
  ...Fi
]), Ki = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]), Ui = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
}), Vi = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  novalidate: {
    $: "noValidate",
    FORM: 1
  },
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  },
  adauctionheaders: {
    $: "adAuctionHeaders",
    IFRAME: 1
  },
  allowfullscreen: {
    $: "allowFullscreen",
    IFRAME: 1
  },
  browsingtopics: {
    $: "browsingTopics",
    IMG: 1
  },
  defaultchecked: {
    $: "defaultChecked",
    INPUT: 1
  },
  defaultmuted: {
    $: "defaultMuted",
    AUDIO: 1,
    VIDEO: 1
  },
  defaultselected: {
    $: "defaultSelected",
    OPTION: 1
  },
  disablepictureinpicture: {
    $: "disablePictureInPicture",
    VIDEO: 1
  },
  disableremoteplayback: {
    $: "disableRemotePlayback",
    AUDIO: 1,
    VIDEO: 1
  },
  preservespitch: {
    $: "preservesPitch",
    AUDIO: 1,
    VIDEO: 1
  },
  shadowrootclonable: {
    $: "shadowRootClonable",
    TEMPLATE: 1
  },
  shadowrootdelegatesfocus: {
    $: "shadowRootDelegatesFocus",
    TEMPLATE: 1
  },
  shadowrootserializable: {
    $: "shadowRootSerializable",
    TEMPLATE: 1
  },
  sharedstoragewritable: {
    $: "sharedStorageWritable",
    IFRAME: 1,
    IMG: 1
  }
});
function qi(e, t) {
  const r = Vi[e];
  return typeof r == "object" ? r[t] ? r.$ : void 0 : r;
}
const Yi = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]), Zi = /* @__PURE__ */ new Set([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]), Qi = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
}, F = (e) => K(() => e());
function Xi(e, t, r) {
  let n = r.length, a = t.length, o = n, i = 0, l = 0, c = t[a - 1].nextSibling, f = null;
  for (; i < a || l < o; ) {
    if (t[i] === r[l]) {
      i++, l++;
      continue;
    }
    for (; t[a - 1] === r[o - 1]; )
      a--, o--;
    if (a === i) {
      const g = o < n ? l ? r[l - 1].nextSibling : r[o - l] : c;
      for (; l < o; ) e.insertBefore(r[l++], g);
    } else if (o === l)
      for (; i < a; )
        (!f || !f.has(t[i])) && t[i].remove(), i++;
    else if (t[i] === r[o - 1] && r[l] === t[a - 1]) {
      const g = t[--a].nextSibling;
      e.insertBefore(r[l++], t[i++].nextSibling), e.insertBefore(r[--o], g), t[a] = r[o];
    } else {
      if (!f) {
        f = /* @__PURE__ */ new Map();
        let p = l;
        for (; p < o; ) f.set(r[p], p++);
      }
      const g = f.get(t[i]);
      if (g != null)
        if (l < g && g < o) {
          let p = i, x = 1, b;
          for (; ++p < a && p < o && !((b = f.get(t[p])) == null || b !== g + x); )
            x++;
          if (x > g - l) {
            const k = t[i];
            for (; l < g; ) e.insertBefore(r[l++], k);
          } else e.replaceChild(r[l++], t[i++]);
        } else i++;
      else t[i++].remove();
    }
  }
}
const jr = "_$DX_DELEGATE";
function Ji(e, t, r, n = {}) {
  let a;
  return xt((o) => {
    a = o, t === document ? e() : s(t, e(), t.firstChild ? null : void 0, r);
  }, n.owner), () => {
    a(), t.textContent = "";
  };
}
function u(e, t, r, n) {
  let a;
  const o = () => {
    const l = n ? document.createElementNS("http://www.w3.org/1998/Math/MathML", "template") : document.createElement("template");
    return l.innerHTML = e, r ? l.content.firstChild.firstChild : n ? l.firstChild : l.content.firstChild;
  }, i = t ? () => pe(() => document.importNode(a || (a = o()), !0)) : () => (a || (a = o())).cloneNode(!0);
  return i.cloneNode = i, i;
}
function ot(e, t = window.document) {
  const r = t[jr] || (t[jr] = /* @__PURE__ */ new Set());
  for (let n = 0, a = e.length; n < a; n++) {
    const o = e[n];
    r.has(o) || (r.add(o), t.addEventListener(o, oo));
  }
}
function L(e, t, r) {
  r == null ? e.removeAttribute(t) : e.setAttribute(t, r);
}
function eo(e, t, r, n) {
  n == null ? e.removeAttributeNS(t, r) : e.setAttributeNS(t, r, n);
}
function to(e, t, r) {
  r ? e.setAttribute(t, "") : e.removeAttribute(t);
}
function dt(e, t) {
  t == null ? e.removeAttribute("class") : e.className = t;
}
function le(e, t, r, n) {
  if (n)
    Array.isArray(r) ? (e[`$$${t}`] = r[0], e[`$$${t}Data`] = r[1]) : e[`$$${t}`] = r;
  else if (Array.isArray(r)) {
    const a = r[0];
    e.addEventListener(t, r[0] = (o) => a.call(e, r[1], o));
  } else e.addEventListener(t, r, typeof r != "function" && r);
}
function no(e, t, r = {}) {
  const n = Object.keys(t || {}), a = Object.keys(r);
  let o, i;
  for (o = 0, i = a.length; o < i; o++) {
    const l = a[o];
    !l || l === "undefined" || t[l] || (Dr(e, l, !1), delete r[l]);
  }
  for (o = 0, i = n.length; o < i; o++) {
    const l = n[o], c = !!t[l];
    !l || l === "undefined" || r[l] === c || !c || (Dr(e, l, !0), r[l] = c);
  }
  return r;
}
function $e(e, t, r) {
  if (!t) return r ? L(e, "style") : t;
  const n = e.style;
  if (typeof t == "string") return n.cssText = t;
  typeof r == "string" && (n.cssText = r = void 0), r || (r = {}), t || (t = {});
  let a, o;
  for (o in r)
    t[o] == null && n.removeProperty(o), delete r[o];
  for (o in t)
    a = t[o], a !== r[o] && (n.setProperty(o, a), r[o] = a);
  return r;
}
function H(e, t, r) {
  r != null ? e.style.setProperty(t, r) : e.style.removeProperty(t);
}
function ro(e, t = {}, r, n) {
  const a = {};
  return W(() => a.children = Dt(e, t.children, a.children)), W(() => typeof t.ref == "function" && jt(t.ref, e)), W(() => ao(e, t, r, !0, a, !0)), a;
}
function jt(e, t, r) {
  return pe(() => e(t, r));
}
function s(e, t, r, n) {
  if (r !== void 0 && !n && (n = []), typeof t != "function") return Dt(e, t, n, r);
  W((a) => Dt(e, t(), a, r), n);
}
function ao(e, t, r, n, a = {}, o = !1) {
  t || (t = {});
  for (const i in a)
    if (!(i in t)) {
      if (i === "children") continue;
      a[i] = Wr(e, i, null, a[i], r, o, t);
    }
  for (const i in t) {
    if (i === "children")
      continue;
    const l = t[i];
    a[i] = Wr(e, i, l, a[i], r, o, t);
  }
}
function io(e) {
  return e.toLowerCase().replace(/-([a-z])/g, (t, r) => r.toUpperCase());
}
function Dr(e, t, r) {
  const n = t.trim().split(/\s+/);
  for (let a = 0, o = n.length; a < o; a++) e.classList.toggle(n[a], r);
}
function Wr(e, t, r, n, a, o, i) {
  let l, c, f, g, p;
  if (t === "style") return $e(e, r, n);
  if (t === "classList") return no(e, r, n);
  if (r === n) return n;
  if (t === "ref")
    o || r(e);
  else if (t.slice(0, 3) === "on:") {
    const x = t.slice(3);
    n && e.removeEventListener(x, n, typeof n != "function" && n), r && e.addEventListener(x, r, typeof r != "function" && r);
  } else if (t.slice(0, 10) === "oncapture:") {
    const x = t.slice(10);
    n && e.removeEventListener(x, n, !0), r && e.addEventListener(x, r, !0);
  } else if (t.slice(0, 2) === "on") {
    const x = t.slice(2).toLowerCase(), b = Yi.has(x);
    if (!b && n) {
      const k = Array.isArray(n) ? n[0] : n;
      e.removeEventListener(x, k);
    }
    (b || r) && (le(e, x, r, b), b && ot([x]));
  } else if (t.slice(0, 5) === "attr:")
    L(e, t.slice(5), r);
  else if (t.slice(0, 5) === "bool:")
    to(e, t.slice(5), r);
  else if ((p = t.slice(0, 5) === "prop:") || (f = Ki.has(t)) || !a && ((g = qi(t, e.tagName)) || (c = Hi.has(t))) || (l = e.nodeName.includes("-") || "is" in i))
    p && (t = t.slice(5), c = !0), t === "class" || t === "className" ? dt(e, r) : l && !c && !f ? e[io(t)] = r : e[g || t] = r;
  else {
    const x = a && t.indexOf(":") > -1 && Qi[t.split(":")[0]];
    x ? eo(e, x, t, r) : L(e, Ui[t] || t, r);
  }
  return r;
}
function oo(e) {
  let t = e.target;
  const r = `$$${e.type}`, n = e.target, a = e.currentTarget, o = (c) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: c
  }), i = () => {
    const c = t[r];
    if (c && !t.disabled) {
      const f = t[`${r}Data`];
      if (f !== void 0 ? c.call(t, f, e) : c.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && o(t.host), !0;
  }, l = () => {
    for (; i() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const c = e.composedPath();
    o(c[0]);
    for (let f = 0; f < c.length - 2 && (t = c[f], !!i()); f++) {
      if (t._$host) {
        t = t._$host, l();
        break;
      }
      if (t.parentNode === a)
        break;
    }
  } else l();
  o(n);
}
function Dt(e, t, r, n, a) {
  for (; typeof r == "function"; ) r = r();
  if (t === r) return r;
  const o = typeof t, i = n !== void 0;
  if (e = i && r[0] && r[0].parentNode || e, o === "string" || o === "number") {
    if (o === "number" && (t = t.toString(), t === r))
      return r;
    if (i) {
      let l = r[0];
      l && l.nodeType === 3 ? l.data !== t && (l.data = t) : l = document.createTextNode(t), r = gt(e, r, n, l);
    } else
      r !== "" && typeof r == "string" ? r = e.firstChild.data = t : r = e.textContent = t;
  } else if (t == null || o === "boolean")
    r = gt(e, r, n);
  else {
    if (o === "function")
      return W(() => {
        let l = t();
        for (; typeof l == "function"; ) l = l();
        r = Dt(e, l, r, n);
      }), () => r;
    if (Array.isArray(t)) {
      const l = [], c = r && Array.isArray(r);
      if (rr(l, t, r, a))
        return W(() => r = Dt(e, l, r, n, !0)), () => r;
      if (l.length === 0) {
        if (r = gt(e, r, n), i) return r;
      } else c ? r.length === 0 ? Gr(e, l, n) : Xi(e, r, l) : (r && gt(e), Gr(e, l));
      r = l;
    } else if (t.nodeType) {
      if (Array.isArray(r)) {
        if (i) return r = gt(e, r, n, t);
        gt(e, r, null, t);
      } else r == null || r === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      r = t;
    }
  }
  return r;
}
function rr(e, t, r, n) {
  let a = !1;
  for (let o = 0, i = t.length; o < i; o++) {
    let l = t[o], c = r && r[e.length], f;
    if (!(l == null || l === !0 || l === !1)) if ((f = typeof l) == "object" && l.nodeType)
      e.push(l);
    else if (Array.isArray(l))
      a = rr(e, l, c) || a;
    else if (f === "function")
      if (n) {
        for (; typeof l == "function"; ) l = l();
        a = rr(e, Array.isArray(l) ? l : [l], Array.isArray(c) ? c : [c]) || a;
      } else
        e.push(l), a = !0;
    else {
      const g = String(l);
      c && c.nodeType === 3 && c.data === g ? e.push(c) : e.push(document.createTextNode(g));
    }
  }
  return a;
}
function Gr(e, t, r = null) {
  for (let n = 0, a = t.length; n < a; n++) e.insertBefore(t[n], r);
}
function gt(e, t, r, n) {
  if (r === void 0) return e.textContent = "";
  const a = n || document.createTextNode("");
  if (t.length) {
    let o = !1;
    for (let i = t.length - 1; i >= 0; i--) {
      const l = t[i];
      if (a !== l) {
        const c = l.parentNode === e;
        !o && !i ? c ? e.replaceChild(a, l) : e.insertBefore(a, r) : c && l.remove();
      } else o = !0;
    }
  } else e.insertBefore(a, r);
  return [a];
}
const so = "http://www.w3.org/2000/svg";
function lo(e, t = !1, r = void 0) {
  return t ? document.createElementNS(so, e) : document.createElement(e, {
    is: r
  });
}
function co(e, t) {
  const r = K(e);
  return K(() => {
    const n = r();
    switch (typeof n) {
      case "function":
        return pe(() => n(t));
      case "string":
        const a = Zi.has(n), o = lo(n, a, pe(() => t.is));
        return ro(o, t, a), o;
    }
  });
}
function fo(e) {
  const [, t] = Wi(e, ["component"]);
  return co(() => e.component, t);
}
const Ia = Mi();
function po(e) {
  return d(Ia.Provider, {
    get value() {
      return e.value;
    },
    get children() {
      return e.children;
    }
  });
}
function pt() {
  const e = Ei(Ia);
  if (!e) throw new Error("Krystal context is missing");
  return e;
}
function de() {
  return pt().hass;
}
function En(e) {
  const t = de();
  return K(() => {
    const r = typeof e == "function" ? e() : e;
    return r ? t()?.states[r] : void 0;
  });
}
function ut() {
  const e = de();
  return async (t, r, n) => {
    const a = e();
    if (!a) return !1;
    try {
      return await a.callService(t, r, n), !0;
    } catch (o) {
      return console.warn(`[krystal] ${t}.${r} failed`, o), !1;
    }
  };
}
function Vt() {
  const {
    host: e
  } = pt();
  return (t) => e.dispatchEvent(new CustomEvent("hass-more-info", {
    detail: {
      entityId: t
    },
    bubbles: !0,
    composed: !0
  }));
}
const Ba = /* @__PURE__ */ new Map();
function re(e) {
  return Ba.set(e.type, e), e;
}
function uo(e) {
  return Ba.get(e);
}
function q(e) {
  const t = typeof e == "number" ? e : parseFloat(String(e));
  return Number.isFinite(t) ? t : void 0;
}
function V(e, t, r) {
  return e === void 0 ? "—" : new Intl.NumberFormat(r, {
    minimumFractionDigits: t,
    maximumFractionDigits: t
  }).format(e);
}
function mr(e, t, r) {
  return Math.min(r, Math.max(t, e));
}
function ce(e) {
  return !e || e.state === "unavailable" || e.state === "unknown";
}
function go(e) {
  return e ? String(e.attributes.friendly_name ?? e.entity_id.split(".")[1].replace(/_/g, " ")) : "";
}
function be(e) {
  return e.split(".")[0];
}
function Ce(e) {
  return e.toLowerCase().replace(/ł/g, "l").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
const ho = {
  overview: "Overview",
  home: "Home",
  yourHome: "Your home",
  settings: "Settings",
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
  night: "Good night",
  demo: "Demo",
  lightsOn: "{n}/{m} lights on",
  power: "{v} · power",
  sensorsOk: "Sensors OK",
  sensorsMissing: "Sensors without data: {n}",
  alarms: "Alarms: {n}",
  next5: "Next 5 days",
  roomCount: "{n} on · {m} devices",
  openRoom: "Open room",
  weather: "Weather",
  humidity: "Humidity",
  wind: "Wind",
  target: "Target",
  now: "Now",
  heating: "Heating",
  cooling: "Cooling",
  drying: "Drying",
  fan: "Fan",
  idle: "Idle",
  off: "Off",
  on: "On",
  unavailable: "Unavailable",
  temperature: "Temperature",
  powerLabel: "Power",
  detected: "Detected",
  clear: "OK",
  open: "Open",
  closed: "Closed",
  dry: "Dry",
  present: "Occupied",
  away: "Clear",
  problem: "Problem",
  running: "Running",
  paused: "Paused",
  finished: "Finished",
  ready: "Ready",
  playing: "Playing",
  standby: "Standby",
  tapToggle: "Tap to toggle",
  tapDetails: "Tap for details",
  live: "Live",
  canvas: "Room canvas",
  homeWatch: "Home watch",
  comfort: "Comfort",
  aboutTitle: "Krystal",
  aboutLead: "Stage 2 preview. Pages come from your layout file or are built automatically.",
  version: "Version",
  mode: "Mode",
  language: "Language",
  entities: "Entities",
  layoutSource: "Layout",
  layoutFile: "layout.json",
  layoutAuto: "automatic",
  next: "Coming next",
  next1: "Layouts stored in Home Assistant",
  next2: "Edit mode: drag, resize, pick entities",
  next3: "Focus sheets with full device controls",
  next4: "More hero tiles: laundry, AC, boiler, energy",
  menu: "Menu",
  modeOff: "Off",
  modeHeat: "Heat",
  modeCool: "Cool",
  modeDry: "Dry",
  modeFan: "Fan",
  airExcellent: "Excellent",
  testFailed: "Failed",
  airGood: "Good",
  airModerate: "Moderate",
  airPoor: "Poor",
  airBad: "Bad",
  airVeryBad: "Very bad",
  coClear: "Clear",
  coAlarm: "Alarm",
  modeAuto: "Auto",
  energyNow: "Electricity price now",
  nextRate: "Next from {t}",
  gasPrice: "Gas",
  cheap: "Cheap",
  normal: "Average",
  pricey: "Expensive",
  negative: "Negative price",
  flowGrid: "Grid",
  flowHouse: "Home",
  flowGas: "Gas",
  flowBoiler: "Boiler",
  demandNow: "Demand now",
  slotsKicker: "Cheapest hours",
  slotsTitle: "Electricity prices · next 24 h",
  cheapestHint: "Cheapest {from}–{to} · avg {v} p/kWh — a good time for laundry",
  todayKicker: "Today",
  todayTitle: "Cost and usage",
  elecCost: "Electricity · cost",
  elecUse: "Electricity · usage",
  gasCost: "Gas · cost",
  gasUse: "Gas · usage",
  nowMarker: "Now",
  washer: "Washer",
  dryer: "Dryer",
  timeLeft: "Time left",
  finishAt: "Done at {t}",
  phase: "Phase",
  program: "Program",
  progress: "Progress",
  laundryDone: "Done",
  applianceOff: "Off",
  alarm: "Alarm",
  phReady: "Ready",
  phWash: "Washing",
  phSpin: "Spinning",
  phRinse: "Rinsing",
  phDry: "Drying",
  phSteam: "Steam",
  phWeigh: "Weighing",
  phScheduled: "Scheduled",
  phTumble: "Tumbling",
  phRefresh: "Refresh",
  phHeat: "Heating",
  phCool: "Cooling down",
  phaseN: "Phase {n}",
  laundryChip: "{name} · {m} min",
  fuelTitle: "Fuel",
  fuelKicker: "Fuel prices",
  fuelSubtitle: "Cheapest stations within {r} mi",
  cheapestNearby: "Cheapest nearby",
  diesel: "Diesel (B7)",
  petrol: "Petrol (E10)",
  dieselShort: "Diesel",
  petrolShort: "Petrol",
  stations: "Cheapest stations",
  updatedAt: "Updated {t}",
  noFuel: "No fuel price data yet",
  directions: "Directions",
  mapTitle: "Map",
  nxElectric: "Electric",
  nxWater: "Water",
  nxGas: "Gas",
  nxHome: "Home",
  nxLive: "{n}/{m} live",
  nxPriceNow: "{v} p/kWh now",
  nxYesterday: "yesterday",
  nxToday: "today",
  nxHeating: "heating on",
  nxIdle: "boiler idle",
  styleTitle: "Style",
  styleHeading: "Krystal style",
  styleSubtitle: "One art and icon language for every page. Judge the consistency here first.",
  styleKicker: "Style proposal",
  styleHeroArt: "3D hero art",
  styleHeroHint: "Large objects: photoreal render, graphite and frosted glass, light from top-left, one accent glow per category.",
  styleNew: "new",
  styleGlyphs: "Small glyphs in wells",
  styleGlyphHint: "Chips, buttons and navigation: one rounded line set, always in a recessed well tinted with the category colour.",
  styleSample: "Sample",
  styleDevices: "Devices on and off",
  styleChips: "Sensors in one row",
  styleLamp: "Living room lamp",
  stylePurifier: "Purifier",
  styleSpeaker: "Kitchen speaker",
  styleWindow: "Kitchen window",
  styleLeak: "Washer leak",
  styleMotion: "WC presence",
  styleSmoke: "Smoke alarm",
  sensorsKicker: "Sensors",
  grpSecurity: "Security",
  grpWater: "Water and damp",
  grpAir: "Air",
  grpClimate: "Temperature",
  grpBattery: "Batteries · lowest first",
  f1Next: "Next race",
  f1Days: "days",
  f1Hours: "hours",
  f1Minutes: "min",
  f1Live: "Live",
  f1Session: "Session",
  f1Laps: "Laps",
  f1Air: "Air",
  f1TrackTemp: "Track",
  f1Rain: "Rain",
  f1Wind: "Wind",
  f1Standings: "Classification",
  f1NoLive: "No live F1 data right now"
}, mo = {
  overview: "Przegląd",
  home: "Dom",
  yourHome: "Twój dom",
  settings: "Ustawienia",
  morning: "Dzień dobry",
  afternoon: "Dzień dobry",
  evening: "Dobry wieczór",
  night: "Dobranoc",
  demo: "Demo",
  lightsOn: "{n}/{m} świateł włączonych",
  power: "{v} · pobór",
  sensorsOk: "Czujniki w porządku",
  sensorsMissing: "Czujniki bez danych: {n}",
  alarms: "Alarmy: {n}",
  next5: "Następne 5 dni",
  roomCount: "{n} włączone · {m} urządzeń",
  openRoom: "Otwórz pomieszczenie",
  weather: "Pogoda",
  humidity: "Wilgotność",
  wind: "Wiatr",
  target: "Cel",
  now: "Teraz",
  heating: "Grzanie",
  cooling: "Chłodzenie",
  drying: "Osuszanie",
  fan: "Wentylator",
  idle: "Spoczynek",
  off: "Wyłączone",
  on: "Włączone",
  unavailable: "Niedostępne",
  temperature: "Temperatura",
  powerLabel: "Pobór mocy",
  detected: "Wykryto",
  clear: "W porządku",
  open: "Otwarte",
  closed: "Zamknięte",
  dry: "W porządku",
  present: "Obecność",
  away: "Brak obecności",
  problem: "Problem",
  running: "Pracuje",
  paused: "Wstrzymano",
  finished: "Gotowe",
  ready: "Gotowa",
  playing: "Odtwarza",
  standby: "Czuwanie",
  tapToggle: "Dotknij, aby przełączyć",
  tapDetails: "Dotknij po szczegóły",
  live: "Na żywo",
  canvas: "Room canvas",
  homeWatch: "Dom pod opieką",
  comfort: "Komfort w domu",
  aboutTitle: "Krystal",
  aboutLead: "Podgląd etapu 2. Strony pochodzą z pliku układu albo są budowane automatycznie.",
  version: "Wersja",
  mode: "Tryb",
  language: "Język",
  entities: "Encje",
  layoutSource: "Układ",
  layoutFile: "layout.json",
  layoutAuto: "automatyczny",
  next: "W kolejnych etapach",
  next1: "Układy zapisywane w Home Assistant",
  next2: "Tryb edycji: przeciąganie, rozmiar, wybór encji",
  next3: "Arkusze fokus z pełnym sterowaniem",
  next4: "Kolejne kafelki hero: pralnia, klima, bojler, energia",
  menu: "Menu",
  modeOff: "Wył.",
  modeHeat: "Grzanie",
  modeCool: "Chłodz.",
  modeDry: "Osusz.",
  modeFan: "Wentyl.",
  airExcellent: "Doskonała",
  testFailed: "Błąd",
  airGood: "Dobra",
  airModerate: "Umiarkowana",
  airPoor: "Słaba",
  airBad: "Zła",
  airVeryBad: "Bardzo zła",
  coClear: "Czysto",
  coAlarm: "Alarm",
  modeAuto: "Auto",
  energyNow: "Cena prądu teraz",
  nextRate: "Następna od {t}",
  gasPrice: "Gaz",
  cheap: "Tanio",
  normal: "Średnio",
  pricey: "Drogo",
  negative: "Ujemna cena",
  flowGrid: "Sieć",
  flowHouse: "Dom",
  flowGas: "Gaz",
  flowBoiler: "Kocioł",
  demandNow: "Pobór teraz",
  slotsKicker: "Najtańsze godziny",
  slotsTitle: "Ceny prądu · następne 24 h",
  cheapestHint: "Najtaniej {from}–{to} · śr. {v} p/kWh — dobry czas na pranie",
  todayKicker: "Dziś",
  todayTitle: "Koszt i zużycie",
  elecCost: "Prąd · koszt",
  elecUse: "Prąd · zużycie",
  gasCost: "Gaz · koszt",
  gasUse: "Gaz · zużycie",
  nowMarker: "Teraz",
  washer: "Pralka",
  dryer: "Suszarka",
  timeLeft: "Pozostało",
  finishAt: "Koniec o {t}",
  phase: "Faza",
  program: "Program",
  progress: "Postęp",
  laundryDone: "Gotowe",
  applianceOff: "Wyłączona",
  alarm: "Alarm",
  phReady: "Gotowa",
  phWash: "Pranie",
  phSpin: "Wirowanie",
  phRinse: "Płukanie",
  phDry: "Suszenie",
  phSteam: "Para",
  phWeigh: "Ważenie",
  phScheduled: "Zaplanowane",
  phTumble: "Bębnowanie",
  phRefresh: "Odświeżanie",
  phHeat: "Grzanie",
  phCool: "Chłodzenie",
  phaseN: "Faza {n}",
  laundryChip: "{name} · {m} min",
  fuelTitle: "Paliwo",
  fuelKicker: "Ceny paliw",
  fuelSubtitle: "Najtańsze stacje w promieniu {r} mi",
  cheapestNearby: "Najtaniej w pobliżu",
  diesel: "Diesel (B7)",
  petrol: "Benzyna (E10)",
  dieselShort: "Diesel",
  petrolShort: "Benzyna",
  stations: "Najtańsze stacje",
  updatedAt: "Aktualizacja {t}",
  noFuel: "Brak danych o cenach paliw",
  directions: "Nawiguj",
  mapTitle: "Mapa",
  nxElectric: "Prąd",
  nxWater: "Woda",
  nxGas: "Gaz",
  nxHome: "Dom",
  nxLive: "{n}/{m} na żywo",
  nxPriceNow: "{v} p/kWh teraz",
  nxYesterday: "wczoraj",
  nxToday: "dziś",
  nxHeating: "grzanie włączone",
  nxIdle: "kocioł w spoczynku",
  styleTitle: "Styl",
  styleHeading: "Styl Krystala",
  styleSubtitle: "Jeden język grafik i ikon na wszystkich stronach. Oceń spójność tutaj, zanim przeniosę go dalej.",
  styleKicker: "Propozycja stylu",
  styleHeroArt: "Grafiki 3D (hero)",
  styleHeroHint: "Duże obiekty: fotorealistyczny render, grafit i matowe szkło, światło z lewej góry, jedna poświata w kolorze kategorii.",
  styleNew: "nowe",
  styleGlyphs: "Małe ikony w studzienkach",
  styleGlyphHint: "Chipy, przyciski i nawigacja: jeden zestaw zaokrąglonych ikon liniowych, zawsze we wgłębionej studzience w kolorze kategorii.",
  styleSample: "Przykład",
  styleDevices: "Urządzenia: wł. i wył.",
  styleChips: "Czujniki w jednym rzędzie",
  styleLamp: "Lampa · salon",
  stylePurifier: "Oczyszczacz",
  styleSpeaker: "Głośnik · kuchnia",
  styleWindow: "Okno · kuchnia",
  styleLeak: "Zalanie · pralka",
  styleMotion: "Obecność · WC",
  styleSmoke: "Czujka dymu",
  sensorsKicker: "Czujniki",
  grpSecurity: "Bezpieczeństwo",
  grpWater: "Woda i wilgoć",
  grpAir: "Powietrze",
  grpClimate: "Temperatura",
  grpBattery: "Baterie · najniższe",
  f1Next: "Następny wyścig",
  f1Days: "dni",
  f1Hours: "godz.",
  f1Minutes: "min",
  f1Live: "Na żywo",
  f1Session: "Sesja",
  f1Laps: "Okrążenia",
  f1Air: "Powietrze",
  f1TrackTemp: "Tor",
  f1Rain: "Deszcz",
  f1Wind: "Wiatr",
  f1Standings: "Klasyfikacja",
  f1NoLive: "Brak danych F1 na żywo"
}, bo = {
  overview: "Übersicht",
  home: "Zuhause",
  yourHome: "Dein Zuhause",
  settings: "Einstellungen",
  morning: "Guten Morgen",
  afternoon: "Guten Tag",
  evening: "Guten Abend",
  night: "Gute Nacht",
  demo: "Demo",
  lightsOn: "{n}/{m} Lichter an",
  power: "{v} · Verbrauch",
  sensorsOk: "Sensoren OK",
  sensorsMissing: "Sensoren ohne Daten: {n}",
  alarms: "Alarme: {n}",
  next5: "Nächste 5 Tage",
  roomCount: "{n} an · {m} Geräte",
  openRoom: "Raum öffnen",
  weather: "Wetter",
  humidity: "Luftfeuchte",
  wind: "Wind",
  target: "Ziel",
  now: "Jetzt",
  heating: "Heizen",
  cooling: "Kühlen",
  drying: "Trocknen",
  fan: "Lüfter",
  idle: "Leerlauf",
  off: "Aus",
  on: "An",
  unavailable: "Nicht verfügbar",
  temperature: "Temperatur",
  powerLabel: "Leistung",
  detected: "Erkannt",
  clear: "OK",
  open: "Offen",
  closed: "Geschlossen",
  dry: "Trocken",
  present: "Belegt",
  away: "Frei",
  problem: "Problem",
  running: "Läuft",
  paused: "Pausiert",
  finished: "Fertig",
  ready: "Bereit",
  playing: "Spielt",
  standby: "Standby",
  tapToggle: "Tippen zum Schalten",
  tapDetails: "Tippen für Details",
  live: "Live",
  canvas: "Room canvas",
  homeWatch: "Hausüberwachung",
  comfort: "Komfort",
  aboutTitle: "Krystal",
  aboutLead: "Vorschau Stufe 2. Seiten kommen aus der Layout-Datei oder werden automatisch erstellt.",
  version: "Version",
  mode: "Modus",
  language: "Sprache",
  entities: "Entitäten",
  layoutSource: "Layout",
  layoutFile: "layout.json",
  layoutAuto: "automatisch",
  next: "Als Nächstes",
  next1: "Layouts in Home Assistant gespeichert",
  next2: "Bearbeiten: ziehen, Größe ändern, Entitäten wählen",
  next3: "Fokus-Ansichten mit voller Steuerung",
  next4: "Weitere Kacheln: Wäsche, Klima, Boiler, Energie",
  menu: "Menü",
  modeOff: "Aus",
  modeHeat: "Heizen",
  modeCool: "Kühlen",
  modeDry: "Trocknen",
  modeFan: "Lüften",
  airExcellent: "Ausgezeichnet",
  testFailed: "Fehler",
  airGood: "Gut",
  airModerate: "Mäßig",
  airPoor: "Schwach",
  airBad: "Schlecht",
  airVeryBad: "Sehr schlecht",
  coClear: "Frei",
  coAlarm: "Alarm",
  modeAuto: "Auto",
  energyNow: "Strompreis jetzt",
  nextRate: "Nächster ab {t}",
  gasPrice: "Gas",
  cheap: "Günstig",
  normal: "Mittel",
  pricey: "Teuer",
  negative: "Negativer Preis",
  flowGrid: "Netz",
  flowHouse: "Haus",
  flowGas: "Gas",
  flowBoiler: "Kessel",
  demandNow: "Leistung jetzt",
  slotsKicker: "Günstigste Stunden",
  slotsTitle: "Strompreise · nächste 24 h",
  cheapestHint: "Am günstigsten {from}–{to} · Ø {v} p/kWh — gut zum Waschen",
  todayKicker: "Heute",
  todayTitle: "Kosten und Verbrauch",
  elecCost: "Strom · Kosten",
  elecUse: "Strom · Verbrauch",
  gasCost: "Gas · Kosten",
  gasUse: "Gas · Verbrauch",
  nowMarker: "Jetzt",
  washer: "Waschmaschine",
  dryer: "Trockner",
  timeLeft: "Restzeit",
  finishAt: "Fertig um {t}",
  phase: "Phase",
  program: "Programm",
  progress: "Fortschritt",
  laundryDone: "Fertig",
  applianceOff: "Aus",
  alarm: "Alarm",
  phReady: "Bereit",
  phWash: "Waschen",
  phSpin: "Schleudern",
  phRinse: "Spülen",
  phDry: "Trocknen",
  phSteam: "Dampf",
  phWeigh: "Wiegen",
  phScheduled: "Geplant",
  phTumble: "Knitterschutz",
  phRefresh: "Auffrischen",
  phHeat: "Heizen",
  phCool: "Abkühlen",
  phaseN: "Phase {n}",
  laundryChip: "{name} · {m} min",
  fuelTitle: "Kraftstoff",
  fuelKicker: "Kraftstoffpreise",
  fuelSubtitle: "Günstigste Tankstellen im Umkreis von {r} mi",
  cheapestNearby: "Am günstigsten in der Nähe",
  diesel: "Diesel (B7)",
  petrol: "Benzin (E10)",
  dieselShort: "Diesel",
  petrolShort: "Benzin",
  stations: "Günstigste Tankstellen",
  updatedAt: "Aktualisiert {t}",
  noFuel: "Noch keine Kraftstoffpreise",
  directions: "Route",
  mapTitle: "Karte",
  nxElectric: "Strom",
  nxWater: "Wasser",
  nxGas: "Gas",
  nxHome: "Haus",
  nxLive: "{n}/{m} live",
  nxPriceNow: "{v} p/kWh jetzt",
  nxYesterday: "gestern",
  nxToday: "heute",
  nxHeating: "Heizung an",
  nxIdle: "Kessel im Leerlauf",
  styleTitle: "Stil",
  styleHeading: "Krystal-Stil",
  styleSubtitle: "Eine Bild- und Symbolsprache für alle Seiten. Hier zuerst die Stimmigkeit prüfen.",
  styleKicker: "Stilvorschlag",
  styleHeroArt: "3D-Hero-Grafiken",
  styleHeroHint: "Große Objekte: fotorealistisch, Graphit und Milchglas, Licht von links oben, ein Akzentleuchten pro Kategorie.",
  styleNew: "neu",
  styleGlyphs: "Kleine Symbole in Mulden",
  styleGlyphHint: "Chips, Tasten und Navigation: ein abgerundetes Liniensymbol-Set, immer in einer eingelassenen Mulde in Kategoriefarbe.",
  styleSample: "Beispiel",
  styleDevices: "Geräte an und aus",
  styleChips: "Sensoren in einer Reihe",
  styleLamp: "Lampe · Wohnzimmer",
  stylePurifier: "Luftreiniger",
  styleSpeaker: "Lautsprecher · Küche",
  styleWindow: "Fenster · Küche",
  styleLeak: "Leck · Waschmaschine",
  styleMotion: "Anwesenheit · WC",
  styleSmoke: "Rauchmelder",
  sensorsKicker: "Sensoren",
  grpSecurity: "Sicherheit",
  grpWater: "Wasser und Feuchte",
  grpAir: "Luft",
  grpClimate: "Temperatur",
  grpBattery: "Batterien · niedrigste",
  f1Next: "Nächstes Rennen",
  f1Days: "Tage",
  f1Hours: "Std.",
  f1Minutes: "Min",
  f1Live: "Live",
  f1Session: "Session",
  f1Laps: "Runden",
  f1Air: "Luft",
  f1TrackTemp: "Strecke",
  f1Rain: "Regen",
  f1Wind: "Wind",
  f1Standings: "Wertung",
  f1NoLive: "Gerade keine F1-Livedaten"
}, xo = { en: ho, pl: mo, de: bo }, wo = {
  en: {
    "clear-night": "Clear night",
    cloudy: "Cloudy",
    exceptional: "Exceptional",
    fog: "Fog",
    hail: "Hail",
    lightning: "Lightning",
    "lightning-rainy": "Thunderstorm",
    partlycloudy: "Partly cloudy",
    pouring: "Pouring",
    rainy: "Rain",
    snowy: "Snow",
    "snowy-rainy": "Sleet",
    sunny: "Sunny",
    windy: "Windy",
    "windy-variant": "Windy"
  },
  pl: {
    "clear-night": "Bezchmurna noc",
    cloudy: "Pochmurno",
    exceptional: "Wyjątkowa pogoda",
    fog: "Mgła",
    hail: "Grad",
    lightning: "Wyładowania",
    "lightning-rainy": "Burza",
    partlycloudy: "Częściowe zachmurzenie",
    pouring: "Ulewa",
    rainy: "Deszcz",
    snowy: "Śnieg",
    "snowy-rainy": "Deszcz ze śniegiem",
    sunny: "Słonecznie",
    windy: "Wietrznie",
    "windy-variant": "Wietrznie"
  },
  de: {
    "clear-night": "Klare Nacht",
    cloudy: "Bewölkt",
    exceptional: "Außergewöhnlich",
    fog: "Nebel",
    hail: "Hagel",
    lightning: "Gewitter",
    "lightning-rainy": "Gewitter",
    partlycloudy: "Teilweise bewölkt",
    pouring: "Starkregen",
    rainy: "Regen",
    snowy: "Schnee",
    "snowy-rainy": "Schneeregen",
    sunny: "Sonnig",
    windy: "Windig",
    "windy-variant": "Windig"
  }
}, [ko, yo] = J(), vo = (e) => yo(e);
function _o(e) {
  const r = (new URLSearchParams(location.search).get("lang") ?? ko() ?? e?.language ?? e?.locale?.language ?? navigator.language ?? "en").toLowerCase();
  return r.startsWith("pl") ? "pl" : r.startsWith("de") ? "de" : "en";
}
function $o(e, t, r) {
  let n = xo[e][t] ?? t;
  if (r) for (const [a, o] of Object.entries(r)) n = n.replace(`{${a}}`, String(o));
  return n;
}
function ae() {
  const e = de(), t = K(() => _o(e())), r = ((n, a) => $o(t(), n, a));
  return r.lang = t, r.condition = (n) => n ? wo[t()][n] ?? n : "—", r;
}
const Ln = import.meta.url.slice(0, import.meta.url.lastIndexOf("/") + 1), zo = [
  "dial",
  "bulb",
  "plug",
  "washer",
  "dryer",
  "bolt",
  "bin-blue",
  "bin-black",
  "bin-green",
  "pump-diesel",
  "pump-petrol",
  "purifier",
  "air",
  "humidity",
  "window",
  "door",
  "leak",
  "motion",
  "smoke",
  "speaker",
  "tv",
  "camera",
  "radiator",
  "flame",
  "watermeter",
  "f1",
  "shield",
  "ac",
  "parcel",
  "printer",
  "feeder",
  "litter",
  "battery",
  "network",
  "calendar",
  "thermometer",
  "extractor-fan",
  "floor-lamp",
  "co"
], fe = Object.fromEntries(zo.map((e) => [e, `${Ln}art/soft-${e}.webp`])), ar = {
  light: { accent: "#ffc47a", pl: "Światło", en: "Lighting" },
  climate: { accent: "#5fdbff", pl: "Klimat", en: "Climate" },
  air: { accent: "#7ff0d0", pl: "Powietrze", en: "Air" },
  energy: { accent: "#df75ff", pl: "Prąd", en: "Electricity" },
  water: { accent: "#61ddff", pl: "Woda", en: "Water" },
  gas: { accent: "#ffae62", pl: "Gaz", en: "Gas" },
  security: { accent: "#4be39a", pl: "Bezpieczeństwo", en: "Security" },
  media: { accent: "#6aa8ff", pl: "Media", en: "Media" },
  laundry: { accent: "#8debff", pl: "Pralnia", en: "Laundry" },
  fuel: { accent: "#a8e7c8", pl: "Paliwo", en: "Fuel" },
  f1: { accent: "#ff5a5a", pl: "F1", en: "F1" },
  bins: { accent: "#c3cfdf", pl: "Odpady", en: "Bins" },
  home: { accent: "#c3d5e9", pl: "Dom", en: "Home" },
  pets: { accent: "#ffb98a", pl: "Zwierzęta", en: "Pets" },
  battery: { accent: "#9fe870", pl: "Baterie", en: "Batteries" }
}, br = [
  { key: "bulb", category: "light", pl: "Światło / lampa", en: "Light", glyph: "mdi:lightbulb-outline" },
  { key: "floor-lamp", category: "light", pl: "Lampa podłogowa", en: "Floor lamp", glyph: "mdi:floor-lamp-outline", fresh: !0 },
  { key: "plug", category: "light", pl: "Gniazdko", en: "Smart plug", glyph: "mdi:power-socket-uk" },
  { key: "dial", category: "climate", pl: "Termostat", en: "Thermostat", glyph: "mdi:thermostat" },
  { key: "thermometer", category: "climate", pl: "Termometr", en: "Thermometer", glyph: "mdi:thermometer", fresh: !0 },
  { key: "extractor-fan", category: "air", pl: "Wentylator łazienkowy", en: "Extractor fan", glyph: "mdi:fan", fresh: !0 },
  { key: "radiator", category: "climate", pl: "Grzejnik / głowica", en: "Radiator / TRV", glyph: "mdi:radiator" },
  { key: "ac", category: "climate", pl: "Klimatyzator", en: "Air conditioner", glyph: "mdi:air-conditioner" },
  { key: "purifier", category: "air", pl: "Oczyszczacz", en: "Purifier", glyph: "mdi:air-purifier" },
  { key: "air", category: "air", pl: "Jakość powietrza", en: "Air quality", glyph: "mdi:air-filter", fresh: !0 },
  { key: "humidity", category: "water", pl: "Wilgotność", en: "Humidity", glyph: "mdi:water-percent" },
  { key: "bolt", category: "energy", pl: "Prąd", en: "Electricity", glyph: "mdi:lightning-bolt" },
  { key: "flame", category: "gas", pl: "Gaz / kocioł", en: "Gas / boiler", glyph: "mdi:fire" },
  { key: "watermeter", category: "water", pl: "Licznik wody", en: "Water meter", glyph: "mdi:water" },
  { key: "leak", category: "water", pl: "Czujnik zalania", en: "Leak sensor", glyph: "mdi:water-alert-outline" },
  { key: "window", category: "security", pl: "Okno", en: "Window", glyph: "mdi:window-closed-variant" },
  { key: "door", category: "security", pl: "Drzwi", en: "Door", glyph: "mdi:door" },
  { key: "motion", category: "security", pl: "Ruch / obecność", en: "Motion", glyph: "mdi:motion-sensor" },
  { key: "smoke", category: "security", pl: "Czujnik dymu", en: "Smoke detector", glyph: "mdi:smoke-detector-variant", fresh: !0 },
  { key: "co", category: "security", pl: "Czujnik CO", en: "CO detector", glyph: "mdi:molecule-co", fresh: !0 },
  { key: "shield", category: "security", pl: "Alarm", en: "Alarm", glyph: "mdi:shield-home-outline" },
  { key: "camera", category: "security", pl: "Kamera", en: "Camera", glyph: "mdi:cctv" },
  { key: "speaker", category: "media", pl: "Głośnik", en: "Speaker", glyph: "mdi:speaker" },
  { key: "tv", category: "media", pl: "Telewizor", en: "TV", glyph: "mdi:television" },
  { key: "washer", category: "laundry", pl: "Pralka", en: "Washer", glyph: "mdi:washing-machine" },
  { key: "dryer", category: "laundry", pl: "Suszarka", en: "Dryer", glyph: "mdi:tumble-dryer" },
  { key: "pump-diesel", category: "fuel", pl: "Diesel", en: "Diesel", glyph: "mdi:gas-station" },
  { key: "pump-petrol", category: "fuel", pl: "Benzyna", en: "Petrol", glyph: "mdi:gas-station-outline" },
  { key: "f1", category: "f1", pl: "Bolid F1", en: "F1 car", glyph: "mdi:flag-checkered" },
  { key: "parcel", category: "home", pl: "Paczka", en: "Parcel", glyph: "mdi:package-variant-closed" },
  { key: "printer", category: "home", pl: "Drukarka 3D", en: "3D printer", glyph: "mdi:printer-3d" },
  { key: "network", category: "media", pl: "Sieć / Zigbee", en: "Network / Zigbee", glyph: "mdi:zigbee" },
  { key: "calendar", category: "home", pl: "Kalendarz / wywóz", en: "Calendar / bin day", glyph: "mdi:calendar-month-outline" },
  { key: "feeder", category: "pets", pl: "Karmnik", en: "Pet feeder", glyph: "mdi:food-drumstick-outline" },
  { key: "litter", category: "pets", pl: "Kuweta", en: "Litter box", glyph: "mdi:cat" },
  { key: "battery", category: "battery", pl: "Bateria", en: "Battery", glyph: "mdi:battery-high" },
  { key: "bin-blue", category: "bins", pl: "Kosz · recykling", en: "Recycling bin", glyph: "mdi:recycle" },
  { key: "bin-black", category: "bins", pl: "Kosz · zmieszane", en: "General waste", glyph: "mdi:trash-can-outline" },
  { key: "bin-green", category: "bins", pl: "Kosz · bio", en: "Garden waste", glyph: "mdi:leaf" }
], Fa = new Map(br.map((e) => [e.key, e])), I = (e, t) => t.test(e), In = /(lamp|swiatl|light|led|sufit|ceiling|kinkiet|wall_light)/, pn = /(podlog|floor_lamp|floorlamp|lampa_stojac|stojac)/, Ir = /(wentyl|wyciag|extract|exhaust|bathroom_fan|_fan_|\bfan\b|fan_\d|wiatrak)/, tn = /(purif|oczyszcz|core_\d|vital|levoit|vesync|air_cleaner|winix|dyson)/, So = /(pm2|pm_2|pm1|pm10|pyl|air_quality|jakosc_powietrza|czyste_powietrze|co2|carbon_dioxide|voc|aqi|tvoc)/, ir = /(smoke|dym|gas_detector|detektor_gazu)/, or = /(czad|carbon_monoxide|czujnik_co|_co_co|_co$|alarm_co)/, Br = /(air_?cond|klima|split|aircon|_ac_|\bac\b|\bac$)/, Fr = (e) => I(e, pn) ? "floor-lamp" : "bulb";
function Co(e, t, r, n) {
  const a = be(e), o = String(t?.attributes.device_class ?? ""), i = `${Ce(e)} ${Ce(String(t?.attributes.friendly_name ?? ""))} ${Ce(n ?? "")}`;
  if (a === "climate") {
    const l = t?.attributes.hvac_modes ?? [];
    return I(i, Br) || l.some((c) => c === "cool" || c === "dry" || c === "fan_only") ? "ac" : I(i, /(radiator|trv|grzejnik|kaloryfer|glowic)/) ? "radiator" : "dial";
  }
  if (a === "switch" || a === "input_boolean") {
    if (I(i, /(washing|pralk)/)) return "washer";
    if (I(i, /(suszar|dryer)/)) return "dryer";
    if (I(i, /(litter|kuwet)/)) return "litter";
    if (I(i, /(feeder|karm)/)) return "feeder";
    if (I(i, Br)) return "ac";
    if (I(i, tn)) return "purifier";
    if (I(i, Ir) && !I(i, In)) return "extractor-fan";
  }
  if (r === "purifier" || a === "fan" && I(i, tn)) return "purifier";
  if (r === "fan" || a === "fan") return I(i, tn) ? "purifier" : "extractor-fan";
  if (r === "light" || a === "light") return I(i, pn) ? "floor-lamp" : "bulb";
  if (r === "plug") return I(i, In) || I(i, pn) ? Fr(i) : "plug";
  switch (a) {
    case "switch":
    case "input_boolean":
      return I(i, /(washing|pralk)/) ? "washer" : I(i, /(suszar|dryer)/) ? "dryer" : I(i, /(litter|kuwet)/) ? "litter" : I(i, /(feeder|karm)/) ? "feeder" : I(i, tn) ? "purifier" : I(i, Ir) ? "extractor-fan" : I(i, In) || I(i, pn) || I(i, /(_in_\d|hall|stairs|schody)/) ? Fr(i) : "plug";
    case "water_heater":
      return "flame";
    case "media_player":
      return I(i, /(tv|telewiz|television|streamer|fire_tv|projekt|webos|oled|chromecast|shield|roku|apple_tv)/) ? "tv" : "speaker";
    case "camera":
      return "camera";
    case "alarm_control_panel":
      return "shield";
    case "lock":
      return "door";
    case "cover":
      return I(i, /(garage|brama|gate)/) ? "door" : "window";
    case "calendar":
      return "calendar";
    case "binary_sensor":
      return o === "window" || o === "opening" || I(i, /(okno|window)/) ? "window" : o === "door" || o === "garage_door" || I(i, /(drzwi|door|brama)/) ? "door" : o === "moisture" || I(i, /(wyciek|leak|water_sensor|zalan)/) ? "leak" : o === "carbon_monoxide" || I(i, or) ? "co" : o === "smoke" || o === "gas" || I(i, ir) ? "smoke" : ["motion", "occupancy", "presence"].includes(o) || I(i, /(obecno|presence|occupancy|motion|ruch)/) ? "motion" : o === "battery" ? "battery" : o === "connectivity" ? "network" : I(i, /(suszar|dryer)/) ? "dryer" : I(i, /(washing|pralk)/) ? "washer" : ["safety", "problem", "tamper"].includes(o) ? "shield" : void 0;
  }
  if (o === "battery" || I(i, /(battery|bateri)/)) return "battery";
  if (["pm25", "pm10", "pm1", "carbon_dioxide", "volatile_organic_compounds", "volatile_organic_compounds_parts", "aqi", "nitrogen_dioxide", "ozone"].includes(o))
    return "air";
  if (o === "carbon_monoxide") return "co";
  if (o === "smoke") return "smoke";
  if (o === "humidity") return "humidity";
  if (o === "temperature") return "thermometer";
  if (o === "monetary")
    return I(i, /(_gas_|gaz)/) ? "flame" : I(i, /(water|woda|sewer|scieki)/) ? "watermeter" : I(i, /(fuel|paliw|benzyn|diesel)/) ? "pump-petrol" : "bolt";
  if (I(i, /\bf1_|formula/)) return "f1";
  if (I(i, /(fuel|paliw|benzyn|diesel|_e10|_b7)/)) return I(i, /(diesel|b7)/) ? "pump-diesel" : "pump-petrol";
  if (I(i, /(washing|pralk)/)) return "washer";
  if (I(i, /(suszar|dryer)/)) return "dryer";
  if (I(i, /(litter|kuwet)/)) return "litter";
  if (I(i, /(feeder|karmnik|karmien)/)) return "feeder";
  if (I(i, /(parcel|paczk|package|delivery|dostaw|evri|dpd|royal_mail)/)) return "parcel";
  if (I(i, /(printer|drukark|bambu|nozzle|a1_\d)/)) return "printer";
  if (I(i, /(zigbee|lqi|linkquality|z2m|coordinator)/)) return "network";
  if (I(i, /(\bbin\b|_bin_|bins|waste|kosz(?!t)|odpad|recycl|smieci)/)) return "calendar";
  if (I(i, /(filter|filtr)/)) return "purifier";
  if (I(i, So)) return "air";
  if (I(i, or)) return "co";
  if (I(i, ir)) return "smoke";
  if (I(i, /(temperatur|_temp_|^temp_|termometr)/)) return "thermometer";
  if (I(i, /(humidity|wilgotn)/)) return "humidity";
  if (o === "gas" || I(i, /(_gas_|gaz)/)) return "flame";
  if (o === "water" || I(i, /(water|woda|sewer|scieki|g22xu)/)) return "watermeter";
  if (["power", "energy", "current", "voltage", "power_factor"].includes(o) || I(i, /(octopus|electric|prad|demand|tariff|rate)/))
    return "bolt";
}
function To(e, t) {
  const r = be(e);
  if (r === "select" || r === "number" || r === "text" || r === "button") return !0;
  if (/(machine_status|program_phase|_status$|_state$)/.test(e)) return !1;
  const n = String(t?.attributes.device_class ?? ""), a = String(t?.attributes.unit_of_measurement ?? "");
  return n === "duration" || n === "timestamp" || a === "min" || a === "h" || a === "s" ? !0 : /(remaining|pozostal|czas|_time|program|detergent|softener|zmiekcz|level|poziom|steam|para|prewash|wstepn|energy_estimate|_wh$)/.test(Ce(e));
}
const Po = {
  sensor: "mdi:gauge",
  binary_sensor: "mdi:checkbox-blank-circle-outline",
  select: "mdi:tune-variant",
  number: "mdi:tune-variant",
  switch: "mdi:toggle-switch-outline"
}, Mo = /* @__PURE__ */ new Set(["bulb", "dial", "plug", "purifier"]);
function qt(e, t, r) {
  const n = Co(e, t, r?.kind, r?.name), a = r?.art && fe[r.art] ? r.art : void 0, o = a && !(Mo.has(a) && n && n !== a) ? a : void 0, i = o ?? n, l = i ? Fa.get(i) : void 0, c = l?.category ?? "home", g = (r?.icon && r.icon !== "mdi:circle-outline" ? r.icon : void 0) ?? l?.glyph ?? String(t?.attributes.icon ?? Po[be(e)] ?? "mdi:circle-outline");
  return { art: !o && To(e, t) ? void 0 : i, glyph: g, category: c };
}
const Ke = "#4be39a", tt = "#ffd34d", un = "#ff9f4d", Ue = "#ff5a64", Bn = "#c77dff", Eo = "#a6e35a", Hr = [
  [/^(excellent|very_good|doskonal)/, Ke, "airExcellent"],
  [/^(good|dobr)/, Eo, "airGood"],
  [/^(moderate|fair|medium|umiark)/, tt, "airModerate"],
  [/^(poor|slab|unhealthy_for)/, un, "airPoor"],
  [/^(very_poor|very_bad|bad|unhealthy|hazard|zl)/, Ue, "airBad"]
], St = (e, t, r) => {
  for (const [n, a, o] of t) if (e <= n) return { color: a, word: o };
  return { color: r[0], word: r[1] };
};
function Lo(e, t, r) {
  if (!t) return;
  const n = String(t.attributes.device_class ?? ""), a = String(t.attributes.unit_of_measurement ?? "").toLowerCase(), o = `${Ce(e)} ${Ce(String(t.attributes.friendly_name ?? ""))} ${Ce(r ?? "")}`, i = Number(t.state), l = t.state !== "" && Number.isFinite(i), c = be(e);
  if (c === "sensor" && (n === "battery" || I(o, /(battery|bateri)/) && a === "%") && l)
    return i >= 50 ? { color: Ke } : i >= 20 ? { color: tt } : { color: Ue };
  if (c === "binary_sensor" && (["smoke", "gas", "carbon_monoxide"].includes(n) || I(o, ir) || I(o, or)))
    return t.state === "on" ? { color: Ue, word: "coAlarm" } : t.state === "off" ? { color: Ke, word: "coClear" } : void 0;
  if (c === "sensor") {
    if ((n === "carbon_monoxide" || I(o, /(czujnik_co_co|carbon_monoxide|_co$)/)) && l)
      return St(i, [[9, Ke, "airGood"], [35, tt, "airModerate"]], [Ue, "airBad"]);
    if (n === "carbon_dioxide" || I(o, /co2/))
      return l ? i < 800 ? { color: Ke, word: "airGood" } : i < 1200 ? { color: tt, word: "airModerate" } : { color: Ue, word: "airBad" } : void 0;
    if (n === "pm10" || I(o, /pm10/))
      return l ? St(i, [[54, Ke, "airGood"], [154, tt, "airModerate"], [254, un, "airPoor"], [354, Ue, "airBad"]], [Bn, "airVeryBad"]) : void 0;
    if (n === "pm25" || n === "pm1" || I(o, /(pm2|pm_2|pm1)/))
      return l ? St(i, [[12, Ke, "airGood"], [35, tt, "airModerate"], [55, un, "airPoor"], [150, Ue, "airBad"]], [Bn, "airVeryBad"]) : void 0;
    if (n === "aqi" || I(o, /(aqi|air_quality|jakosc_powietrza)/)) {
      const f = Ce(String(t.state)), g = Hr.find(([p]) => p.test(f));
      if (g) return { color: g[1], word: g[2] };
      if (!l) return;
      if (i >= 1 && i <= 4 && Number.isInteger(i)) {
        const [, p, x] = Hr[i - 1];
        return { color: p, word: x };
      }
      return St(i, [[50, Ke, "airGood"], [100, tt, "airModerate"], [150, un, "airPoor"], [200, Ue, "airBad"]], [Bn, "airVeryBad"]);
    }
    if (n === "volatile_organic_compounds" || n === "volatile_organic_compounds_parts" || I(o, /voc/))
      return l ? St(i, [[300, Ke, "airGood"], [1e3, tt, "airModerate"]], [Ue, "airBad"]) : void 0;
  }
}
function Ao(e, t) {
  const r = e ? Fa.get(e) : void 0;
  return r ? t === "pl" ? r.pl : r.en : void 0;
}
const Ve = 36e5, je = 24 * Ve, gn = [
  ["ANT", "12", "Andrea Kimi", "Antonelli", "mercedes"],
  ["RUS", "63", "George", "Russell", "mercedes"],
  ["HAM", "44", "Lewis", "Hamilton", "ferrari"],
  ["VER", "3", "Max", "Verstappen", "red_bull"],
  ["LEC", "16", "Charles", "Leclerc", "ferrari"],
  ["NOR", "1", "Lando", "Norris", "mclaren"],
  ["PIA", "81", "Oscar", "Piastri", "mclaren"],
  ["HAD", "6", "Isack", "Hadjar", "red_bull"],
  ["LAW", "30", "Liam", "Lawson", "rb"],
  ["GAS", "10", "Pierre", "Gasly", "alpine"],
  ["LIN", "41", "Arvid", "Lindblad", "rb"],
  ["COL", "43", "Franco", "Colapinto", "alpine"],
  ["BEA", "87", "Oliver", "Bearman", "haas"],
  ["HUL", "27", "Nico", "Hülkenberg", "audi"],
  ["BOR", "5", "Gabriel", "Bortoleto", "audi"],
  ["OCO", "31", "Esteban", "Ocon", "haas"],
  ["ALO", "14", "Fernando", "Alonso", "aston_martin"],
  ["SAI", "55", "Carlos", "Sainz", "williams"],
  ["ALB", "23", "Alexander", "Albon", "williams"],
  ["STR", "18", "Lance", "Stroll", "aston_martin"],
  ["BOT", "77", "Valtteri", "Bottas", "cadillac"],
  ["PER", "11", "Sergio", "Pérez", "cadillac"]
], sr = {
  mercedes: "Mercedes",
  ferrari: "Ferrari",
  mclaren: "McLaren",
  red_bull: "Red Bull",
  rb: "RB F1 Team",
  alpine: "Alpine F1 Team",
  haas: "Haas F1 Team",
  audi: "Audi",
  williams: "Williams",
  aston_martin: "Aston Martin",
  cadillac: "Cadillac F1 Team"
}, nn = [
  ["albert_park", "Australian Grand Prix", "au", "Australia", !1],
  ["shanghai", "Chinese Grand Prix", "cn", "China", !0],
  ["suzuka", "Japanese Grand Prix", "jp", "Japan", !1],
  ["bahrain", "Bahrain Grand Prix", "bh", "Bahrain", !1],
  ["jeddah", "Saudi Arabian Grand Prix", "sa", "Saudi Arabia", !1],
  ["miami", "Miami Grand Prix", "us", "USA", !0],
  ["villeneuve", "Canadian Grand Prix", "ca", "Canada", !0],
  ["monaco", "Monaco Grand Prix", "mc", "Monaco", !1],
  ["catalunya", "Barcelona Grand Prix", "es", "Spain", !1],
  ["red_bull_ring", "Austrian Grand Prix", "at", "Austria", !1],
  ["silverstone", "British Grand Prix", "gb", "UK", !0],
  ["spa", "Belgian Grand Prix", "be", "Belgium", !1],
  ["hungaroring", "Hungarian Grand Prix", "hu", "Hungary", !1],
  ["zandvoort", "Dutch Grand Prix", "nl", "Netherlands", !0],
  ["monza", "Italian Grand Prix", "it", "Italy", !1],
  ["madring", "Spanish Grand Prix", "es", "Spain", !1],
  ["baku", "Azerbaijan Grand Prix", "az", "Azerbaijan", !1],
  ["marina_bay", "Singapore Grand Prix", "sg", "Singapore", !0],
  ["americas", "United States Grand Prix", "us", "USA", !1],
  ["rodriguez", "Mexico City Grand Prix", "mx", "Mexico", !1],
  ["interlagos", "Brazilian Grand Prix", "br", "Brazil", !0],
  ["vegas", "Las Vegas Grand Prix", "us", "USA", !1],
  ["losail", "Qatar Grand Prix", "qa", "Qatar", !0],
  ["yas_marina", "Abu Dhabi Grand Prix", "ae", "UAE", !1]
], Me = 19, Ro = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1], Ha = (e) => ({ code: e[0], permanentNumber: e[1], givenName: e[2], familyName: e[3] }), lr = (e) => ({ constructorId: e, name: sr[e] });
function Fn(e) {
  return gn.map((r, n) => ({ g: r, k: (n * 7 + e * 5) % 9 + n * 0.9 })).sort((r, n) => r.k - n.k).map(({ g: r }, n) => ({
    position: String(n + 1),
    number: r[1],
    points: String(Ro[n] ?? 0),
    grid: String((n + e) % 6 + n - 1 > 0 ? (n + e) % 6 + n - 1 : 1),
    laps: n < 19 ? "62" : "48",
    status: n < 19 ? "Finished" : "Retired",
    time: n === 0 ? "1:42:00.785" : n < 19 ? `+${(n * 5.31).toFixed(3)}` : void 0,
    driver: Ha(r),
    constructor: lr(r[4])
  }));
}
function Oo(e) {
  const t = Date.now(), r = t + je + 4 * Ve, n = (m) => new Date(m).toISOString(), a = (m) => r + (m - Me) * 7 * je, [o, i, l, c] = nn[Me - 1], f = nn.map(([m, h, v, S, _], $) => {
    const C = a($ + 1), y = (z) => ({ date: n(C + z).slice(0, 10), time: n(C + z).slice(11, 19) + "Z" });
    return {
      round: String($ + 1),
      season: "2026",
      raceName: h,
      date: n(C).slice(0, 10),
      time: n(C).slice(11, 19) + "Z",
      country_code: v,
      Circuit: { circuitId: m, circuitName: h.replace("Grand Prix", "Circuit"), Location: { country: S } },
      FirstPractice: y(-2 * je),
      Qualifying: y(-je),
      ..._ ? { SprintQualifying: y(-2 * je + 4 * Ve), Sprint: y(-je - 4 * Ve) } : { SecondPractice: y(-2 * je + 4 * Ve), ThirdPractice: y(-je - 4 * Ve) }
    };
  }), g = gn.map((m, h) => ({
    position: String(h + 1),
    positionText: String(h + 1),
    points: String(Math.round(340 * Math.pow(0.83, h))),
    wins: String([8, 3, 1, 2, 1, 2][h] ?? 0),
    Driver: { ...Ha(m), driverId: m[3].toLowerCase(), nationality: "" },
    Constructors: [lr(m[4])]
  })), p = Object.keys(sr).map((m) => ({ id: m, points: g.filter((h) => h.Constructors[0].constructorId === m).reduce((h, v) => h + Number(v.points), 0) })).sort((m, h) => h.points - m.points), x = (m) => Fn(m).slice(0, 3).map((h) => ({
    position: h.position,
    grid: h.grid,
    driver_code: h.driver.code,
    driver_name: `${h.driver.givenName} ${h.driver.familyName}`,
    constructor_id: h.constructor.constructorId,
    constructor_name: h.constructor.name
  })), b = gn.slice(0, 20).map((m, h) => [m, h]), k = ["SOFT", "MEDIUM", "HARD"];
  return [
    e("sensor.f1_demo_next_race", n(r), {
      friendly_name: "F1 · next race",
      device_class: "timestamp",
      season: "2026",
      round: String(Me),
      race_name: i,
      circuit_id: o,
      circuit_name: "Circuit of the Americas",
      circuit_locality: "Austin",
      circuit_country: c,
      circuit_timezone: "America/Chicago",
      country_code: l,
      first_practice_start: n(r - 2 * je - 2 * Ve),
      second_practice_start: n(r - 2 * je + 1.5 * Ve),
      third_practice_start: n(t - 20 * 6e4),
      qualifying_start: n(t + 3.5 * Ve),
      race_start: n(r),
      sprint_qualifying_start: null,
      sprint_start: null,
      races_held_here: 13,
      first_f1_race_here: { season: "2012", date: "2012-11-18" },
      dnf_rate_last_5: 26,
      pole_to_win_conversion_last_5: 40,
      last_year_podium: { season: "2025", date: "2025-10-19", podium: x(3) },
      top_5_driver_wins_here: [
        { driver_code: "HAM", driver_name: "Lewis Hamilton", wins: 5, first_win_season: "2012", last_win_season: "2017" },
        { driver_code: "VER", driver_name: "Max Verstappen", wins: 4, first_win_season: "2021", last_win_season: "2025" },
        { driver_code: "LEC", driver_name: "Charles Leclerc", wins: 1, first_win_season: "2024", last_win_season: "2024" },
        { driver_code: "RAI", driver_name: "Kimi Räikkönen", wins: 1, first_win_season: "2018", last_win_season: "2018" }
      ],
      defending_winner: { season: "2025", driver_code: "VER", driver_name: "Max Verstappen", constructor_id: "red_bull" },
      defending_pole_sitter: { season: "2025", driver_code: "VER", q1: "1:33.207", q2: "1:32.701", q3: "1:32.510" }
    }),
    e("sensor.f1_demo_current_season", String(nn.length), { friendly_name: "F1 · season", season: "2026", races: f }),
    e("sensor.f1_demo_season_results", String(Me - 1), {
      friendly_name: "F1 · season results",
      races: f.slice(0, Me - 1).map((m, h) => ({ round: m.round, race_name: m.raceName, results: Fn(h).slice(0, 3) }))
    }),
    e("sensor.f1_demo_last_race_results", "Verstappen", {
      friendly_name: "F1 · last race",
      round: String(Me - 1),
      race_name: nn[Me - 2][1],
      circuit_name: "Marina Bay Street Circuit",
      race_start: n(a(Me - 1)),
      results: Fn(Me - 2)
    }),
    e("sensor.f1_demo_driver_standings", String(gn.length), {
      friendly_name: "F1 · driver standings",
      season: "2026",
      round: String(Me - 1),
      driver_standings: g
    }),
    e("sensor.f1_demo_constructor_standings", String(p.length), {
      friendly_name: "F1 · constructor standings",
      season: "2026",
      round: String(Me - 1),
      constructor_standings: p.map((m, h) => ({
        position: String(h + 1),
        points: String(m.points),
        wins: String([11, 2, 2, 2][h] ?? 0),
        Constructor: { ...lr(m.id), nationality: "" }
      }))
    }),
    e("sensor.f1_demo_current_session", "Practice 3", {
      friendly_name: "F1 · current session",
      active: !0,
      live_status: "Started",
      name: "Practice 3",
      type: "Practice",
      meeting_name: i,
      meeting_country: "United States"
    }),
    e("sensor.f1_demo_session_status", "live", { friendly_name: "F1 · session status", track_grip: "normal" }),
    e("sensor.f1_demo_track_status", "YELLOW", { friendly_name: "F1 · track status" }),
    e("binary_sensor.f1_demo_safety_car", "off", { friendly_name: "F1 · safety car" }),
    e("binary_sensor.f1_demo_race_week", "on", { friendly_name: "F1 · race week", days_until_next_race: 1 }),
    e("sensor.f1_demo_session_time_remaining", "00:41:12", { friendly_name: "F1 · time remaining" }),
    e("sensor.f1_demo_track_weather", "28.3", {
      friendly_name: "F1 · track weather",
      air_temperature: 28.3,
      track_temperature: 41.8,
      humidity: 44.8,
      rainfall: 0,
      wind_speed: 2.6
    }),
    e("sensor.f1_demo_weather", "27.1", {
      friendly_name: "F1 · race weather",
      current_temperature: 27.1,
      race_temperature: 27.5,
      race_precipitation_probability: 10,
      race_wind_speed: 5.1,
      race_wind_direction: "SE",
      race_weather_icon: "mdi:weather-cloudy"
    }),
    e("sensor.f1_demo_driver_positions", "20", {
      friendly_name: "F1 · driver positions",
      drivers: Object.fromEntries(
        b.map(([m, h]) => [
          m[1],
          {
            identity: { tla: m[0], name: `${m[2]} ${m[3]}`, team: sr[m[4]] },
            timing: { position: h + 1, gap_to_leader: h ? `+${(h * 0.214).toFixed(3)}` : "", interval: h ? `+${(0.08 + h % 4 * 0.061).toFixed(3)}` : "", last_lap: h ? void 0 : "1:36.112" },
            in_pit: h === 13
          }
        ])
      )
    }),
    e("sensor.f1_demo_current_tyres", "20", {
      friendly_name: "F1 · current tyres",
      drivers: Object.fromEntries(b.map(([m, h]) => [m[1], { compound: k[h % 3], tyre_age: h * 3 % 11 }]))
    }),
    e("sensor.f1_demo_race_control", "Yellow in sector 2", {
      friendly_name: "F1 · race control",
      messages: [
        { message: "Green light - pit exit open", flag: "GREEN", utc: n(t - 20 * 6e4) },
        { message: "Car 30 (LAW) time deleted - track limits at turn 19", utc: n(t - 9 * 6e4) },
        { message: "Yellow in track sector 2", flag: "YELLOW", utc: n(t - 2 * 6e4) }
      ]
    })
  ];
}
function ke(e, t, r = {}) {
  const n = (/* @__PURE__ */ new Date()).toISOString();
  return { entity_id: e, state: t, attributes: r, last_changed: n, last_updated: n };
}
const rn = (e, t, r, n = 180) => ke(e, r ? "on" : "off", { friendly_name: t, supported_color_modes: ["brightness"], brightness: r ? n : null }), he = (e, t, r) => ke(e, r ? "on" : "off", { friendly_name: t }), Y = (e, t, r, n, a) => ke(e, String(r), {
  friendly_name: t,
  ...n ? { unit_of_measurement: n } : {},
  ...a ? { device_class: a, state_class: "measurement" } : {}
}), He = (e, t, r, n = "off") => ke(e, n, { friendly_name: t, device_class: r });
function Ct(e, t, r, n, a, o, i = ["off", "heat"]) {
  return ke(e, r, {
    friendly_name: t,
    hvac_modes: i,
    hvac_action: o,
    current_temperature: n,
    temperature: a,
    min_temp: 7,
    max_temp: 30,
    target_temp_step: 0.5
  });
}
function No() {
  return [
    ["rainy", 14, 7],
    ["partlycloudy", 12, 8],
    ["rainy", 16, 7],
    ["cloudy", 16, 11],
    ["partlycloudy", 14, 9]
  ].map(([t, r, n], a) => ({
    datetime: new Date(Date.now() + (a + 1) * 864e5).toISOString(),
    condition: t,
    temperature: r,
    templow: n
  }));
}
function Kr(e, t) {
  const r = /* @__PURE__ */ new Date();
  return r.setHours(0, 0, 0, 0), r.setDate(r.getDate() + e), Array.from({ length: t }, (n, a) => {
    const o = a / 2, i = o < 6 ? 0.11 + 0.02 * Math.sin(o) : 0, l = o >= 6 && o < 16 ? 0.17 - 0.16 * Math.exp(-((o - 13.5) ** 2) / 2.2) : 0, c = o >= 16 && o < 19 ? 0.33 + 0.03 * Math.sin(o * 2) : 0, f = o >= 19 ? 0.21 - (o - 19) * 0.012 : 0, g = Math.round((i + l + c + f + (e ? 0.01 : 0)) * 1e4) / 1e4, p = new Date(r.getTime() + a * 30 * 6e4);
    return { start: p.toISOString(), end: new Date(p.getTime() + 30 * 6e4).toISOString(), value_inc_vat: g, is_capped: !1 };
  });
}
function Ur(e, t = Date.now()) {
  return e.find((r) => Date.parse(String(r.start)) <= t && t < Date.parse(String(r.end)));
}
const an = { label: "Dom", latitude: 51.752, longitude: -1.258, mode: "home" }, jo = [
  { brand: "JET", address: "RIVERSIDE SERVICE STATION, 12, MILL LANE, NORTHGATE, RIVERTON, RV1 2AB", lat: 51.7585, lng: -1.2505, B7: 152.9, E10: 139.9 },
  { brand: "TESCO", address: "MEADOW PARK SHOPPING CENTRE, RIVERTON, RV7 8CD", lat: 51.702, lng: -1.291, B7: 153.9, E10: 137.9 },
  { brand: "ASDA", address: "ORCHARD WAY, HILLCREST, RIVERTON, RV3 4EF", lat: 51.81, lng: -1.19, B7: 154.7, E10: 138.7 },
  { brand: "Shell", address: "STATION ROAD, EASTFIELD, RIVERTON, RV2 9GH", lat: 51.739, lng: -1.142, B7: 156.9, E10: 141.9 },
  { brand: "Esso", address: "LONDON ROAD SERVICE STATION, LONDON ROAD, RIVERTON, RV5 1JK", lat: 51.731, lng: -1.37, B7: 157.9, E10: 140.9 },
  { brand: "MORRISONS", address: "CANAL STREET, WESTBROOK, RIVERTON, RV6 3LM", lat: 51.7592, lng: -1.2489, B7: 155.9, E10: 139.4 },
  { brand: "BP", address: "RING ROAD, SOUTHLEIGH, RIVERTON, RV8 5NP", lat: 51.668, lng: -1.22, B7: 158.9, E10: 142.9 }
], nt = 640, Hn = 26;
function Do() {
  const e = [
    "M0 300 C 160 280, 300 330, 640 290",
    "M310 0 C 300 180, 350 420, 330 640",
    "M0 520 C 200 470, 420 560, 640 500",
    "M90 0 C 140 200, 60 420, 140 640",
    "M520 0 C 480 220, 560 430, 500 640"
  ], t = Array.from({ length: 14 }, (n, a) => {
    const o = 40 + a * 44;
    return `<path d="M0 ${o} L640 ${o + (a % 2 ? 30 : -24)}" /><path d="M${o} 0 L${o + (a % 2 ? -26 : 22)} 640" />`;
  }).join(""), r = `<svg xmlns="http://www.w3.org/2000/svg" width="${nt}" height="${nt}" viewBox="0 0 640 640">
<rect width="640" height="640" fill="#ebe8e1"/>
<g fill="#cfe7c4"><ellipse cx="170" cy="150" rx="90" ry="60"/><ellipse cx="470" cy="430" rx="110" ry="70"/><rect x="380" y="70" width="120" height="80" rx="20"/></g>
<path d="M-20 420 C 120 380, 220 470, 360 420 S 560 330, 660 370" fill="none" stroke="#aad3f4" stroke-width="22"/>
<g fill="none" stroke="#ffffff" stroke-width="3" opacity="0.9">${t}</g>
<g fill="none" stroke="#f6d27a" stroke-width="9" stroke-linecap="round">${e.map((n) => `<path d="${n}"/>`).join("")}</g>
<g fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round">${e.map((n) => `<path d="${n}"/>`).join("")}</g>
</svg>`;
  return `data:image/svg+xml;base64,${btoa(r)}`;
}
function Wo(e) {
  const t = e.home, r = e.stations ?? [];
  if (!t || !r.length) throw new Error("demo map: home and stations are required");
  const n = Math.cos(t.latitude * Math.PI / 180), a = (o, i) => ({
    x: nt / 2 + (i - t.longitude) * 69.17 * n * Hn,
    y: nt / 2 - (o - t.latitude) * 69.17 * Hn
  });
  return {
    width: nt,
    height: nt,
    zoom: 11,
    centre: t,
    home: { x: nt / 2, y: nt / 2 },
    pins: r.map((o) => ({ id: String(o.id), ...a(o.latitude, o.longitude) })),
    radiusPixels: Number(e.radius ?? 10) * Hn,
    image: Do()
  };
}
function Go(e) {
  const t = Math.cos(an.latitude * Math.PI / 180), r = jo.map((n, a) => ({
    id: `demo-${a}`,
    brand: n.brand,
    address: n.address,
    latitude: n.lat,
    longitude: n.lng,
    distance: Math.hypot((n.lat - an.latitude) * 69.17, (n.lng - an.longitude) * 69.17 * t),
    prices: { B7: n.B7, E10: n.E10 },
    price: e === "B7" ? n.B7 : n.E10
  })).sort((n, a) => n.price - a.price).slice(0, 5);
  return {
    fuel: e,
    cheapest: r[0].price,
    priceUnit: "p/L",
    radius: 10,
    centre: an,
    fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
    source: "Demo",
    stations: r
  };
}
function Io() {
  const e = Kr(0, 48), t = Kr(1, 46), r = Ur(e), n = Ur(e, Date.now() + 30 * 6e4) ?? t[0], a = "octopus_energy_electricity_demo_meter", o = "octopus_energy_gas_demo_meter";
  return [
    ke(`sensor.${a}_current_rate`, String(r?.value_inc_vat ?? 0.2), {
      friendly_name: "Prąd · cena teraz",
      unit_of_measurement: "GBP/kWh",
      current_day_average_rate: e.reduce((i, l) => i + Number(l.value_inc_vat), 0) / e.length,
      is_export: !1,
      end: r?.end
    }),
    ke(`sensor.${a}_next_rate`, String(n?.value_inc_vat ?? 0.2), {
      friendly_name: "Prąd · następna cena",
      unit_of_measurement: "GBP/kWh",
      start: n?.start,
      end: n?.end
    }),
    Y(`sensor.${a}_current_accumulative_cost`, "Prąd · koszt dziś", 1.42, "GBP", "monetary"),
    Y(`sensor.${a}_current_accumulative_consumption`, "Prąd · zużycie dziś", 7.84, "kWh", "energy"),
    Y(`sensor.${a}_current_demand`, "Prąd · pobór", 818, "W", "power"),
    ke(`event.${a}_current_day_rates`, (/* @__PURE__ */ new Date()).toISOString(), { friendly_name: "Stawki dziś", rates: e }),
    ke(`event.${a}_next_day_rates`, (/* @__PURE__ */ new Date()).toISOString(), { friendly_name: "Stawki jutro", rates: t }),
    Y(`sensor.${o}_current_rate`, "Gaz · cena", 0.0742, "GBP/kWh"),
    Y(`sensor.${o}_current_accumulative_cost`, "Gaz · koszt dziś", 2.16, "GBP", "monetary"),
    Y(`sensor.${o}_current_accumulative_consumption_kwh`, "Gaz · zużycie dziś", 24.3, "kWh", "energy"),
    Y("sensor.demo_water_meter_yesterday_s_usage", "Woda · wczoraj", 162, "L", "water"),
    Y("sensor.demo_water_meter_yesterday_s_water_cost", "Woda · koszt wczoraj", 0.45, "GBP", "monetary"),
    Y("sensor.pralka_machine_status", "Pralka · status", "running"),
    Y("sensor.pralka_current_program_phase", "Pralka · faza", "4"),
    Y("sensor.pralka_remaining_time_of_selected_program", "Pralka · pozostało", 38, "min", "duration"),
    Y("sensor.pralka_selected_program_total_time", "Pralka · czas programu", 109, "min", "duration"),
    Y("sensor.pralka_selected_program", "Pralka · program", "Bawełna 40°"),
    Y("sensor.suszarka_demo_machine_status", "Suszarka · status", "standby"),
    Y("sensor.suszarka_demo_remaining_time_of_selected_program", "Suszarka · pozostało", 0, "min", "duration"),
    Y("sensor.suszarka_demo_selected_program_total_time", "Suszarka · czas programu", 0, "min", "duration"),
    ke("weather.demo_1", "cloudy", {
      friendly_name: "Forecast Home",
      temperature: 8.1,
      humidity: 80,
      wind_speed: 31,
      temperature_unit: "°C",
      wind_speed_unit: "km/h",
      forecast: No()
    }),
    rn("light.salon_sufit", "Salon · LED sufit", !0, 176),
    he("switch.salon_lampa", "Salon · lampa podłogowa", !1),
    he("switch.salon_meble", "Salon · meble (plug)", !0),
    he("switch.salon_tv", "Salon · światło TV", !1),
    he("switch.salon_sofa", "Salon · światło sofa", !1),
    ke("fan.salon_oczyszczacz", "off", { friendly_name: "Oczyszczacz Salon", percentage: 0 }),
    Y("sensor.salon_temperatura", "Salon · temperatura", 24.2, "°C", "temperature"),
    Y("sensor.salon_wilgotnosc", "Salon · wilgotność", 49, "%", "humidity"),
    Y("sensor.salon_pm25", "Salon · PM2.5", 5, "µg/m³", "pm25"),
    Y("sensor.salon_filtr", "Oczyszczacz · filtr", 71, "%"),
    Ct("climate.salon_termostat", "Termostat · salon", "heat", 23.8, 23.9, "heating"),
    Ct("climate.salon_podloga", "Podłoga · salon", "off", 24.2, 22, "off"),
    he("switch.kuchnia_swiatlo", "Kuchnia · światło", !0),
    he("switch.kuchnia_stol", "Kuchnia · stół + grill", !1),
    he("switch.kuchnia_zlew", "Kuchnia · zlew (plug)", !0),
    he("switch.kuchnia_szafki", "Kuchnia · szafki LED", !1),
    rn("light.kuchnia_led", "Kuchnia · LED", !0, 128),
    Y("sensor.kuchnia_temperatura", "Kuchnia · temperatura", 24.7, "°C", "temperature"),
    Y("sensor.kuchnia_wilgotnosc", "Kuchnia · wilgotność", 44.1, "%", "humidity"),
    Ct("climate.kuchnia_podloga", "Podłoga · kuchnia", "off", 25.1, 22, "off"),
    ke("media_player.kuchnia_glosnik", "playing", {
      friendly_name: "Głośnik · kuchnia",
      media_title: "Nocturne in E-flat",
      media_artist: "Chopin",
      supported_features: 17457
    }),
    ke("media_player.kuchnia_tv", "idle", { friendly_name: "TV · kuchnia", supported_features: 1025 }),
    he("switch.sypialnia_swiatlo", "Sypialnia · światło", !1),
    he("switch.sypialnia_tv", "Sypialnia · TV", !1),
    rn("light.sypialnia_led", "Sypialnia · LED", !1),
    Ct("climate.sypialnia_klima", "Klimatyzacja · sypialnia", "off", 21.4, 22, "off", ["off", "cool", "heat", "auto"]),
    he("switch.dziecko_swiatlo", "Pokój dziecka · światło", !1),
    rn("light.dziecko_led", "Pokój dziecka · LED", !0, 90),
    Y("sensor.dziecko_temperatura", "Pokój dziecka · temperatura", 25.6, "°C", "temperature"),
    Ct("climate.dziecko_termostat", "Termostat · pokój dziecka", "heat", 25.6, 21, "idle"),
    he("switch.lazienka_swiatlo", "Łazienka · światło", !1),
    he("switch.lazienka_wentylator", "Łazienka · wentylator", !1),
    Y("sensor.lazienka_temperatura", "Łazienka · temperatura", 23.1, "°C", "temperature"),
    Y("sensor.lazienka_wilgotnosc", "Łazienka · wilgotność", 61, "%", "humidity"),
    He("binary_sensor.lazienka_obecnosc", "Łazienka · obecność", "occupancy", "on"),
    Y("sensor.pralka_status", "Pralka", "run"),
    Y("sensor.pralka_pozostalo", "Pralka · pozostało", 38, "min"),
    ke("select.pralka_temperatura", "40", { friendly_name: "Pralka · temperatura", options: ["20", "30", "40", "60"] }),
    he("switch.pralka_para", "Pralka · para wodna", !1),
    Y("sensor.pralka_energia", "Pralka · energia", 820, "Wh", "energy"),
    Y("sensor.suszarka_status", "Suszarka", "idle"),
    Y("sensor.suszarka_pozostalo", "Suszarka · pozostało", 0, "min"),
    He("binary_sensor.suszarka_pojemnik", "Suszarka · pojemnik na wodę", "problem"),
    Y("sensor.prad_pobor", "Prąd · pobór", 818, "W", "power"),
    Y("sensor.prad_koszt_dzis", "Prąd · koszt dziś", 2.59, "GBP", "monetary"),
    Y("sensor.prad_zuzycie_dzis", "Prąd · zużycie dziś", 6.578, "kWh", "energy"),
    Y("sensor.prad_cena", "Prąd · cena teraz", 0.245, "GBP/kWh"),
    Y("sensor.gaz_koszt_dzis", "Gaz · koszt dziś", 1.12, "GBP", "monetary"),
    Y("sensor.gaz_zuzycie_dzis", "Gaz · zużycie dziś", 18.2, "kWh", "energy"),
    Y("sensor.woda_wczoraj", "Woda · wczoraj", 162, "L"),
    Y("sensor.paliwo_e10", "Benzyna E10", 1.329, "GBP"),
    He("binary_sensor.wyciek_kuchnia", "Wyciek · kuchnia", "moisture"),
    He("binary_sensor.wyciek_pralka", "Wyciek · pralka", "moisture"),
    He("binary_sensor.wyciek_prysznic", "Wyciek · prysznic", "moisture", "unavailable"),
    He("binary_sensor.czujnik_co", "Czujnik CO", "carbon_monoxide"),
    He("binary_sensor.okno_kuchnia", "Okno · kuchnia", "window"),
    He("binary_sensor.okno_dziecko", "Okno · pokój dziecka", "window", "on"),
    he("switch.korytarz_swiatlo", "Korytarz", !1),
    he("switch.schody_swiatlo", "Schody", !0),
    he("switch.wc_swiatlo", "Światło WC", !1),
    He("binary_sensor.wc_obecnosc", "Obecność · WC", "presence"),
    ...Oo(ke),
    Y("sensor.okno_kuchnia_bateria", "Okno · kuchnia · bateria", 82, "%", "battery"),
    Y("sensor.ruch_wc_bateria", "Obecność · WC · bateria", 14, "%", "battery"),
    Y("sensor.wyciek_pralka_bateria", "Wyciek · pralka · bateria", 50, "%", "battery")
  ];
}
const Bo = [
  { area_id: "salon", name: "Salon" },
  { area_id: "kuchnia", name: "Kuchnia" },
  { area_id: "sypialnia", name: "Sypialnia" }
];
function Fo(e) {
  let t = Object.fromEntries(Io().map((o) => [o.entity_id, o]));
  const r = (o, i) => {
    const l = t[o];
    l && (t = {
      ...t,
      [o]: { ...l, state: i.state ?? l.state, attributes: { ...l.attributes, ...i.attributes }, last_updated: (/* @__PURE__ */ new Date()).toISOString() }
    });
  }, n = (o) => {
    const i = o?.entity_id;
    return Array.isArray(i) ? i.map(String) : i ? [String(i)] : [];
  }, a = () => ({
    states: t,
    language: "pl",
    locale: { language: "pl" },
    user: { name: "Krystian", is_admin: !0 },
    config: { location_name: "Dom", version: "2026.10.2" },
    areas: Object.fromEntries(Bo.map((o) => [o.area_id, o])),
    entities: {},
    devices: {},
    services: { glasshome_fuel: { search: {}, map: {} } },
    connection: {
      sendMessagePromise: async (o) => {
        const i = o.service_data ?? {};
        if (o.domain === "glasshome_fuel" && o.service === "search")
          return { response: Go(String(i.fuel ?? "B7")) };
        if (o.domain === "glasshome_fuel" && o.service === "map")
          return { response: Wo(i) };
        throw new Error(`demo: ${String(o.domain)}.${String(o.service)} is not available`);
      }
    },
    callService: async (o, i, l) => {
      for (const c of n(l)) {
        const f = t[c];
        if (f) {
          if (o === "media_player" && i === "media_play_pause")
            r(c, { state: f.state === "playing" ? "paused" : "playing" });
          else if (i === "toggle" || i === "turn_on" || i === "turn_off") {
            const g = i === "toggle" ? f.state !== "on" : i === "turn_on";
            r(c, {
              state: g ? "on" : "off",
              attributes: o === "light" ? { brightness: g ? f.attributes.brightness ?? 180 : null } : {}
            });
          } else if (o === "climate" && i === "set_temperature")
            r(c, { attributes: { temperature: Number(l?.temperature) } });
          else if (o === "climate" && i === "set_hvac_mode") {
            const g = String(l?.hvac_mode);
            r(c, { state: g, attributes: { hvac_action: g === "off" ? "off" : "idle" } });
          }
        }
      }
      e(a());
    }
  });
  return a();
}
const Ho = ':host{display:block;position:relative;height:100%;min-height:100vh;--k-label: #dce8f5;--k-target: #b3e6ff;--k-value: #f4f8ff;--k-ice: #42bdf83b;--k-ice-border: #68ceff66;--k-frame: 1424px;--k-font: "Geist", "Inter", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif}*{box-sizing:border-box}.k-mount,.k-app{height:100%;min-height:100vh}.k-app{position:relative;overflow:hidden;color:#f4f6fa;font-family:var(--k-font);font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased;background:#0a1324}:host,button,[role=button]{touch-action:manipulation;-webkit-tap-highlight-color:transparent}:host{-webkit-text-size-adjust:100%;text-size-adjust:100%}button{font:inherit;color:inherit;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}button:focus-visible,[role=button]:focus-visible{outline:2px solid #6bd5ff;outline-offset:3px}.k-icon{width:20px;height:20px;flex-shrink:0}ha-icon.k-icon{--mdc-icon-size: 20px;display:inline-flex}.k-loading{position:absolute;inset:0;display:grid;place-items:center;font-size:13px;letter-spacing:.3em;text-transform:uppercase;color:var(--k-label)}.k-wall,.k-wall>*{position:absolute;inset:0;pointer-events:none}.k-wall{overflow:hidden}.k-wall-sky{background:linear-gradient(180deg,#0f1b33,#1d2c4f 38%,#3b3f63 60%,#7d5a63 78%,#19182a);transition:background 2s ease}.k-wall[data-phase=night] .k-wall-sky{background:linear-gradient(180deg,#050a17,#0c1730 42%,#18264a 66%,#2a2c48 80%,#0a0e1c)}.k-wall[data-phase=dawn] .k-wall-sky{background:linear-gradient(180deg,#1a2747,#3d4a74 40%,#8f7088 64%,#d39a78 80%,#2a2638)}.k-wall[data-phase=day] .k-wall-sky{background:linear-gradient(180deg,#1f3a63,#3f6492 42%,#7d9bbb 68%,#a9bccd 82%,#34465c)}.k-wall-stars{bottom:45%;opacity:0;background-image:radial-gradient(1.2px 1.2px at 24px 40px,#ffffffcc,transparent),radial-gradient(1px 1px at 140px 90px,#ffffffa0,transparent),radial-gradient(1.4px 1.4px at 230px 30px,#dff1ffcc,transparent),radial-gradient(1px 1px at 300px 150px,#ffffff90,transparent),radial-gradient(1px 1px at 80px 170px,#ffffff80,transparent);background-size:340px 210px;-webkit-mask-image:linear-gradient(180deg,#000,transparent);mask-image:linear-gradient(180deg,#000,transparent);transition:opacity 2s ease}.k-wall:is([data-phase=night],[data-phase=dusk])[data-weather=clear] .k-wall-stars{opacity:.75}.k-wall-city{top:auto;width:100%;height:64%}.k-wall-city rect{fill:#18223c}.k-wall-city.far{height:70%;filter:blur(4px);opacity:.85}.k-wall-city.near{height:46%;filter:blur(2px)}.k-wall-city.near rect{fill:#0b1222}.k-wall-city rect.w{fill:#ffc47a;opacity:.75}.k-wall-city rect.c{fill:#a8dcff;opacity:.55}.k-wall[data-phase=day] .k-wall-city rect:is(.w,.c){opacity:.12}.k-wall[data-phase=day] .k-wall-city.far rect:not(.w):not(.c){fill:#4a5f7c}.k-wall[data-phase=day] .k-wall-city.near rect:not(.w):not(.c){fill:#26354d}.k-wall-glow{background:radial-gradient(ellipse 70% 38% at 50% 100%,#ff9a5a30,transparent 70%),radial-gradient(ellipse 40% 30% at 85% 88%,#4fb8ff20,transparent 70%),radial-gradient(ellipse 35% 25% at 12% 92%,#ffb36b1c,transparent 70%)}.k-wall-haze{opacity:0;background:linear-gradient(180deg,#8c9bb444 0%,#6a7a9433 35%,transparent 70%);transition:opacity 2s ease}.k-wall:is([data-weather=cloud],[data-weather=rain],[data-weather=snow]) .k-wall-haze{opacity:1}.k-wall-rain{opacity:0;background:linear-gradient(180deg,#9fb6d61a,transparent 60%)}.k-wall[data-weather=rain] .k-wall-rain{opacity:1}.k-wall-photo{opacity:0;background-size:cover;background-position:center;filter:blur(10px) saturate(.85) brightness(.5);transform:scale(1.08);transition:opacity .8s ease}.k-wall-photo.shown{opacity:1}.k-wall-vignette{background:linear-gradient(180deg,#050b1a88 0%,transparent 26%),radial-gradient(ellipse 90% 80% at 50% 40%,transparent 55%,#040914aa 100%)}.k-scroll{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;padding:26px 32px 128px;scrollbar-width:thin;scrollbar-color:#8fa6c055 transparent}.k-app[data-bp=md] .k-scroll{padding:24px 24px 124px}.k-app[data-bp=sm] .k-scroll{padding:14px 12px 112px}.k-hero,.k-grid{max-width:var(--k-frame);margin-inline:auto}.k-grid{--cols: 12;--gap: 16px;display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));grid-auto-rows:70px;grid-auto-flow:row dense;gap:var(--gap)}.k-app[data-bp=md] .k-grid{--cols: 8;--gap: 14px}.k-app[data-bp=sm] .k-grid{--cols: 4;--gap: 12px}.k-cell{min-width:0;min-height:0}.k-tile{position:relative;isolation:isolate;height:100%;width:100%;padding:14px 16px;border-radius:26px;overflow:hidden;color:#f4f6fa;background:radial-gradient(ellipse at 15% 0%,#edf6ff40,transparent 65%),linear-gradient(145deg,#8a9bad70,#5a6f8559 55%,#34495e70);border:1px solid #eff8ff66;backdrop-filter:blur(22px) saturate(115%);-webkit-backdrop-filter:blur(22px) saturate(115%);box-shadow:inset 0 3px 5px #f5faff66,inset 2px 0 5px #cbdff522,inset 0 -4px 7px #0a142c55,0 3px 2px #08142655,0 13px 24px #02091c66;contain:paint}.k-tile:before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;background:radial-gradient(ellipse at 20% -35%,#ffffff30,transparent 70%),linear-gradient(180deg,#ffffff12,transparent 22%)}.k-well{border-radius:14px;background:linear-gradient(145deg,#ffffff0c,#ffffff03 65%);border:1px solid transparent;border-top-color:#10213966;border-left-color:#10213952;border-bottom-color:#edf6ff24;border-right-color:#edf6ff18;box-shadow:inset 1px 1px 2px #07112145,inset -1px -1px 1px #f2f8ff0f}.k-btn{display:inline-grid;place-items:center;border-radius:12px;cursor:pointer;color:#e0efff;background:linear-gradient(145deg,#a5b4c7b8,#647890cc 52%,#394c65e0);border:1px solid #dceafb55;box-shadow:inset 0 2px 3px #f7fbff9c,inset 0 -3px 4px #17253d77,4px 6px 9px #07112188,-2px -2px 5px #d6e6f522;transition:background .15s,box-shadow .15s}@media(hover:hover){.k-btn:hover:not(:disabled){background:linear-gradient(145deg,#b4c2d4c4,#7186a0d4 52%,#42566fe6)}}.k-btn:active:not(:disabled){box-shadow:inset 4px 5px 8px #08132699,inset -2px -2px 5px #d9eaff44}.k-btn:disabled{opacity:.45;cursor:default}.k-icon-btn{width:40px;height:40px;flex-shrink:0}.k-demo{margin-left:8px;padding:2px 7px;border-radius:99px;font-style:normal;letter-spacing:.08em;color:#dff6ff;background:var(--k-ice);border:1px solid var(--k-ice-border)}.k-kicker{display:block;font-size:10px;font-weight:600;line-height:1.3;letter-spacing:.08em;text-transform:uppercase;color:var(--k-label);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-head h3,.k-room-name{margin:3px 0 0;font-size:15px;font-weight:600;letter-spacing:-.02em;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-room-name{font-size:20px}.k-sub{display:block;font-size:12px;line-height:1.35;color:#dce8f5cc}.k-metric{display:flex;flex-direction:column;gap:3px;padding:7px 10px;min-width:0}.k-metric span{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--k-label)}.k-metric strong{font-size:32px;font-weight:450;line-height:1.05;letter-spacing:-.035em;color:var(--k-target)}.k-metric.sm strong{font-size:18px}.k-hero{height:auto;margin-bottom:18px;padding:22px 26px 20px}.k-app[data-bp=sm] .k-hero{padding:16px 16px 14px;border-radius:22px}.k-hero-top{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.k-hero-main{display:flex;align-items:flex-start;gap:14px;min-width:0}.k-hero-kicker{display:block;font-size:10.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent)}.k-hero h1{margin:8px 0 6px;font-size:32px;font-weight:550;letter-spacing:-.035em;line-height:1.1;color:var(--k-value)}.k-hero p{margin:0;max-width:62ch;font-size:14px;line-height:1.45;color:#dce8f5d0}.k-app[data-bp=sm] .k-hero h1{font-size:24px}.k-app[data-bp=sm] .k-hero p{font-size:12.5px}.k-clock{display:flex;flex-direction:column;align-items:flex-end;flex-shrink:0}.k-clock strong{font-size:54px;font-weight:400;letter-spacing:-.045em;line-height:1;color:var(--k-value)}.k-clock span{margin-top:6px;font-size:12px;color:var(--k-label)}.k-clock span:first-letter{text-transform:uppercase}.k-app[data-bp=sm] .k-clock strong{font-size:30px}.k-app[data-bp=sm] .k-clock span{display:none}.k-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.k-pill{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border-radius:14px;font-size:12.5px;color:#e8f1fb;background:linear-gradient(145deg,#ffffff10,#ffffff04 65%);border:1px solid transparent;border-top-color:#10213966;border-left-color:#10213952;border-bottom-color:#edf6ff26;border-right-color:#edf6ff1a;box-shadow:inset 1px 1px 2px #07112145}.k-pill.warn{color:#ffe0a6}.k-pill.warn .k-icon{color:#ffc56b}.k-pill.alert{color:#ffd0d5;border-color:#ff687866}.k-hero-label{display:block;margin:18px 0 8px;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--k-label)}.k-forecast{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.k-app[data-bp=sm] .k-forecast{gap:6px}.k-day{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px 9px;border-radius:16px}.k-day-name{font-size:12px;font-weight:600;color:#e8f1fb}.k-day-name:first-letter{text-transform:uppercase}.k-day-temp b{font-size:16px;font-weight:550;color:var(--k-value)}.k-day-temp small{margin-left:5px;font-size:12px;color:#dce8f5a0}.k-app[data-bp=sm] .k-day-temp small{display:none}.k-wx-art{position:relative;width:118px;height:100px}.k-orb{position:absolute;top:2px;left:8px;width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff6d6,#ffd37a 35%,#f39a3d 75%,#c4652a);box-shadow:0 0 26px #ffb24d55,inset -6px -8px 14px #b8551f88,inset 4px 5px 8px #fff8}.k-orb.moon{background:radial-gradient(circle at 34% 30%,#fff,#e6edf6 38%,#aebbcd 78%,#7d8ca3);box-shadow:0 0 24px #cfe3ff3a,inset -8px -9px 14px #5d6c8288,inset 4px 4px 8px #fffa}.k-cloud,.k-cloud:before,.k-cloud:after{position:absolute;background:radial-gradient(circle at 42% 28%,#fff,#e4ebf2 40%,#b4c1cf 75%,#8796aa)}.k-cloud{isolation:isolate;left:20px;bottom:12px;width:92px;height:38px;border-radius:30px;background:linear-gradient(180deg,#f2f6fa,#cfd9e4 55%,#93a2b5);box-shadow:inset 0 -6px 10px #5b6b8066,0 10px 14px #0a142c66}.k-cloud:before,.k-cloud:after{content:"";border-radius:50%;z-index:-1}.k-cloud:before{width:44px;height:44px;top:-22px;left:12px}.k-cloud:after{width:56px;height:56px;top:-32px;left:34px}.k-cloud.back{left:46px;bottom:36px;transform:scale(.72);transform-origin:right bottom;filter:brightness(.78) saturate(.9);opacity:.9}.k-drops{position:absolute;left:40px;bottom:-8px;display:flex;gap:13px}.k-drops i{width:4px;height:13px;border-radius:4px;background:linear-gradient(#d8f2ff,#3fa9e8);transform:rotate(16deg);box-shadow:0 2px 3px #0005}.k-drops.snow i{width:7px;height:7px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#c8d6e6)}.k-wx-mini{position:relative;display:block;width:44px;height:36px}.k-wx-mini .k-wx-art{position:absolute;top:0;left:0;transform:scale(.36);transform-origin:0 0}.k-ring{position:relative;flex-shrink:0;border-radius:50%;background:radial-gradient(ellipse at 28% 10%,#ffffff23,transparent 48%),linear-gradient(155deg,#273c5c55,#09142988);box-shadow:inset 0 1px 1px #ffffff3a,inset 0 -3px 5px #0005,0 4px 6px #0006}.k-ring svg{position:absolute;inset:0;width:100%;height:100%}.k-ring-track{fill:none;stroke:#0a162a77}.k-ring-fill{fill:none;stroke-linecap:round;filter:drop-shadow(0 0 3px #5fdbff66);transition:stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)}.k-ring[data-tone=warm] .k-ring-fill{filter:drop-shadow(0 0 3px #ffb45a66)}.k-ring-label{position:absolute;inset:0;display:grid;place-items:center;text-align:center}.k-ring-label b{font-size:21px;font-weight:450;letter-spacing:-.03em;color:var(--k-value)}.k-ring-label small{font-size:11px;font-weight:500;color:var(--k-label)}.k-toggle{position:relative;flex-shrink:0;width:42px;height:24px;padding:0;border-radius:99px;cursor:pointer;border:1px solid #dce8f022;background:linear-gradient(180deg,#17233380,#71829540);box-shadow:inset 2px 2px 4px #0005,inset -1px -1px 2px #ffffff20;transition:background .2s,border-color .2s}.k-toggle span{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:linear-gradient(145deg,#e9f1fa,#8ea2b8);box-shadow:inset 0 1px 1px #fff,1px 2px 4px #081d3c88;transition:transform .22s cubic-bezier(.3,.7,.3,1)}.k-toggle.on{background:linear-gradient(145deg,#42bdf866,#3983b555);border-color:var(--k-ice-border)}.k-toggle.on span{transform:translate(18px);background:linear-gradient(145deg,#fcfeff,#91c8e9)}.k-toggle:disabled{opacity:.4;cursor:default}.k-roomcard{display:block;padding:0;text-align:left;cursor:pointer}.k-roomcard:disabled{cursor:default}.k-roomcard-photo,.k-roomcard-ambient,.k-roomcard-shade{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.k-roomcard-photo{z-index:-2;object-fit:cover;filter:saturate(.92)}.k-roomcard-ambient{z-index:-2;background:radial-gradient(ellipse 55% 45% at 72% 26%,hsl(var(--room-hue) 70% 72% / .5),transparent 70%),radial-gradient(ellipse 50% 40% at 18% 70%,hsl(calc(var(--room-hue) + 50) 60% 55% / .35),transparent 70%),radial-gradient(circle at 80% 78%,#ffd59a30,transparent 30%),linear-gradient(160deg,#2c3f5e,#111c32 70%)}.k-roomcard-shade{z-index:-1;background:linear-gradient(0deg,#08111ff0 0%,#08111f99 34%,transparent 72%),linear-gradient(180deg,#08111f66,transparent 32%)}.k-roomcard-icon{position:absolute;top:14px;left:14px;display:grid;place-items:center;width:36px;height:36px;border-radius:12px;color:#f4f8ff;background:linear-gradient(145deg,#a5b4c766,#39506a88);border:1px solid #eff8ff55;box-shadow:inset 0 1px 2px #fff6,0 4px 10px #0006}.k-roomcard-arrow{position:absolute;top:12px;right:16px;font-size:18px;color:#eaf4ff;text-shadow:0 2px 6px #0008}.k-roomcard-copy{position:absolute;left:18px;right:16px;bottom:15px;display:flex;flex-direction:column;gap:4px}.k-roomcard-copy b{font-size:27px;font-weight:650;letter-spacing:-.035em;line-height:1.05;text-shadow:0 2px 12px #000a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-roomcard-metrics{display:flex;gap:10px;font-size:13px;color:#eef5fd}.k-roomcard-copy small{font-size:11.5px;color:#dce8f5c8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-app[data-bp=sm] .k-roomcard-copy{left:14px;right:12px;bottom:12px}.k-app[data-bp=sm] .k-roomcard-copy b{font-size:19px}.k-canvas{display:flex;flex-direction:column;gap:14px;padding:18px 20px 20px}.k-canvas-photo,.k-canvas-shade{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.k-canvas-photo{z-index:-2;object-fit:cover;filter:saturate(.9) blur(1px);transform:scale(1.02)}.k-canvas-shade{z-index:-1;background:linear-gradient(180deg,#0b142430,#0b142488 40%,#0b1424d0)}.k-canvas-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;min-height:104px}.k-canvas-head .k-kicker{font-weight:700;letter-spacing:.16em;color:#ffc391}.k-canvas-head h2{margin:6px 0 4px;font-size:30px;font-weight:650;letter-spacing:-.035em;text-shadow:0 2px 12px #0009}.k-canvas-metrics{display:flex;gap:10px;font-size:13px;color:#eef5fd;text-shadow:0 1px 6px #0009}.k-live{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:99px;font-size:10px;font-weight:700;letter-spacing:.12em;background:#0b1424aa;border:1px solid #eff8ff30}.k-live i{width:7px;height:7px;border-radius:50%;background:#4be39a;box-shadow:0 0 6px #4be39a}.k-canvas-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.k-app[data-bp=sm] .k-canvas-grid{grid-template-columns:1fr}.k-device{display:flex;align-items:center;gap:12px;height:84px;padding:10px 14px 10px 10px;border-radius:18px;cursor:pointer;background:radial-gradient(ellipse at 15% 0%,#edf6ff26,transparent 65%),linear-gradient(145deg,#8a9bad5c,#34495e86);border:1px solid #eff8ff3d;box-shadow:inset 0 2px 3px #f5faff40,inset 0 -3px 5px #0a142c44,0 6px 14px #02091c55;transition:border-color .25s,background .25s,filter .2s}@media(hover:hover){.k-device:hover{border-color:#f2f8ff4d;background-color:#ffffff0a}}.k-device.on{border-color:#ffd8a066;background:radial-gradient(ellipse at 18% 40%,#ffc47a30,transparent 60%),linear-gradient(145deg,#8a9bad55,#34495e70)}.k-device.missing{opacity:.55}.k-device-art{display:grid;place-items:center;width:58px;height:64px;flex-shrink:0}.k-device-art img{width:58px;height:64px;object-fit:contain;filter:drop-shadow(0 6px 5px #0008);transition:filter .4s}.k-device[data-state=on] .k-device-art img{filter:drop-shadow(0 6px 5px #0008) drop-shadow(0 0 10px #ffbd4266)}.k-device-icon{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;color:#e0efff;background:linear-gradient(145deg,#a5b4c7b8,#647890cc 52%,#394c65e0);border:1px solid #dceafb55;box-shadow:inset 0 2px 3px #f7fbff9c,inset 0 -3px 4px #17253d77,3px 5px 8px #07112188}.k-device.on .k-device-icon{color:#effaff;background:linear-gradient(145deg,#63d2ff88,#2f6f9ccc)}.k-device-copy{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.k-device-copy b{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-device-copy small{font-size:11.5px;color:#dce8f5c0}.k-panel{display:flex;flex-direction:column;gap:12px;padding:16px 18px}.k-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;min-height:32px}.k-panel-kicker{display:block;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent)}.k-panel-head h3{margin:3px 0 0;font-size:19px;font-weight:650;letter-spacing:-.025em}.k-panel-icon{display:grid;place-items:center;width:34px;height:34px;flex-shrink:0;border-radius:12px;color:var(--accent);background:linear-gradient(145deg,#ffffff0c,#ffffff03 65%);border:1px solid transparent;border-top-color:#10213966;border-bottom-color:#edf6ff24;box-shadow:inset 1px 1px 2px #07112145}.k-panel-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.k-app[data-bp=md] .k-panel-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.k-item{display:flex;align-items:center;gap:10px;height:64px;padding:8px 12px 8px 8px;min-width:0;border-radius:16px;cursor:pointer;transition:filter .2s}@media(hover:hover){.k-item:hover{background-color:#ffffff0d;border-bottom-color:#edf6ff3a}}.k-item-art{display:grid;place-items:center;width:46px;height:46px;flex-shrink:0}.k-item-art img{width:46px;height:46px;object-fit:contain;filter:drop-shadow(0 4px 4px #0008)}.k-item .k-device-icon{width:38px;height:38px}.k-item .k-device-icon .k-icon{width:18px;height:18px;--mdc-icon-size: 18px}.k-item-copy{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}.k-item-copy small{font-size:10.5px;letter-spacing:.02em;color:var(--k-label);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-item-copy b{font-size:16px;font-weight:500;letter-spacing:-.01em;color:var(--k-value);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-item.alert{border-color:#ff687866}.k-item.alert b{color:#ffd0d5}.k-item.missing b{color:#ffe0a6}.k-climate{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;gap:8px 12px}.k-climate .k-head{grid-column:1 / -1}.k-climate-hero{grid-row:2 / 4;position:relative;min-height:0;display:flex;align-items:center;justify-content:center}.k-climate-hero img{height:100%;max-height:168px;max-width:100%;object-fit:contain;filter:drop-shadow(0 9px 7px #0008);transition:filter .6s}.k-climate[data-action=heating] .k-climate-hero img{filter:hue-rotate(188deg) saturate(1.15) drop-shadow(0 9px 7px #0008) drop-shadow(0 0 10px #ffad5a40)}.k-climate:is([data-action=idle],[data-action=off]) .k-climate-hero img{filter:saturate(.25) brightness(.9) drop-shadow(0 9px 7px #0008)}.k-dial{position:relative;height:100%;max-height:168px;display:flex;justify-content:center}.k-dial img{display:block;width:auto}.k-climate-hero[data-art=ac] .k-dial img,.k-climate-hero[data-art=radiator] .k-dial img{height:78%;margin-top:4%}.k-dial-read{position:absolute;left:64.5%;top:47%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;pointer-events:none}.k-dial-read b{font-size:24px;font-weight:450;letter-spacing:-.03em;color:var(--k-value)}.k-dial-read span{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--k-label)}.k-climate-hero:is([data-art=ac],[data-art=radiator]) .k-dial-read{left:50%;top:auto;bottom:0;transform:translate(-50%);flex-direction:row;align-items:baseline;gap:6px;padding:3px 12px;border-radius:12px;background:linear-gradient(145deg,#0d1a2ecc,#0d1a2e99);box-shadow:inset 0 0 0 1px #edf6ff22,0 4px 10px #02091c66}.k-climate-hero:is([data-art=ac],[data-art=radiator]) .k-dial-read b{font-size:18px}.k-ac{--mode: #8a98aa;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr) auto;max-width:100%;box-sizing:border-box;gap:10px;padding:16px 18px;border-color:color-mix(in srgb,var(--mode) 55%,#eff8ff40);box-shadow:0 0 0 1px color-mix(in srgb,var(--mode) 22%,transparent),0 0 26px color-mix(in srgb,var(--mode) 16%,transparent),0 18px 40px #02091c55;background:radial-gradient(ellipse at 22% 58%,color-mix(in srgb,var(--mode) 20%,transparent),transparent 58%),radial-gradient(ellipse at 15% 0%,#edf6ff40,transparent 65%),linear-gradient(145deg,#8a9bad70,#5a6f8559 55%,#34495e70)}.k-ac.off{border-color:#eff8ff40;box-shadow:0 18px 40px #02091c55;background:radial-gradient(ellipse at 15% 0%,#edf6ff30,transparent 65%),linear-gradient(145deg,#7d8c9d60,#4f627550 55%,#2e3f5160)}.k-ac-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.k-ac>*,.k-ac-body>*,.k-ac-side>*,.k-climate>*,.k-climate .k-side>*{min-width:0}.k-ac-head>div{flex:1 1 auto;min-width:0}.k-ac-gear{flex-shrink:0}.k-ac-head .k-kicker,.k-ac-temps{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-ac-temps,.k-ac-target strong,.k-metric strong,.k-dial-read b{font-variant-numeric:tabular-nums}.k-ac-target strong{min-width:3.2ch}.k-ac-status{height:1.2em;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:2px 0 0;font-size:26px;font-weight:650;letter-spacing:-.03em;color:color-mix(in srgb,var(--mode) 55%,#ffffff);text-shadow:0 0 18px color-mix(in srgb,var(--mode) 45%,transparent)}.k-ac.off .k-ac-status{color:#c9d4e2;text-shadow:none}.k-ac-temps{font-size:13px;color:var(--k-label)}.k-ac-temps i{font-style:normal;margin:0 4px}.k-ac-temps b{font-weight:650;color:color-mix(in srgb,var(--mode) 50%,#ffffff)}.k-ac-gear{display:inline-flex;align-items:center;gap:6px;width:auto;padding:4px 12px 4px 4px;font-size:12px}.k-ac-body{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr);gap:14px;min-height:0}.k-ac-hero{position:relative;display:grid;place-items:center;min-height:0}.k-ac-ring{position:absolute;height:92%;max-width:92%;aspect-ratio:1;border-radius:50%;border:2px solid color-mix(in srgb,var(--mode) 60%,transparent);box-shadow:0 0 22px color-mix(in srgb,var(--mode) 40%,transparent),inset 0 0 22px color-mix(in srgb,var(--mode) 22%,transparent);opacity:.85}.k-ac.active .k-ac-ring{border-width:3px;box-shadow:0 0 28px color-mix(in srgb,var(--mode) 55%,transparent),inset 0 0 26px color-mix(in srgb,var(--mode) 30%,transparent)}.k-ac.off .k-ac-ring{border-color:#8a98aa44;box-shadow:none}.k-ac-hero img{position:absolute;inset:6% 4%;width:92%;height:88%;object-fit:contain;filter:drop-shadow(0 12px 10px #000a) drop-shadow(0 0 16px color-mix(in srgb,var(--mode) 55%,transparent))}.k-ac.off .k-ac-hero img{filter:saturate(.3) brightness(.8) drop-shadow(0 12px 10px #000a)}.k-ac-side{display:flex;flex-direction:column;align-self:start;gap:8px;min-width:0}.k-ac-target{display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto auto;align-items:center;column-gap:10px}.k-ac-target .k-steppers{grid-row:1 / 3;grid-column:2;display:flex;gap:6px}.k-ac-target .k-steppers .k-btn{width:44px;height:44px;font-size:18px}.k-ac-target strong{color:color-mix(in srgb,var(--mode) 45%,#ffffff)}.k-ac-chips{display:flex;flex-wrap:wrap;gap:6px}.k-ac-chip{display:inline-flex;align-items:baseline;gap:5px;padding:4px 10px;border-radius:10px;font-size:12px;color:#e8f1fb;background:linear-gradient(145deg,#ffffff10,#ffffff04);box-shadow:inset 0 0 0 1px #edf6ff1c}.k-ac-chip small{font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--k-label)}.k-ac-modes{display:grid;grid-template-columns:repeat(var(--n, 6),minmax(0,1fr));gap:6px}.k-app[data-bp=sm] .k-ac-modes{grid-template-columns:repeat(3,minmax(0,1fr))}.k-ac-mode{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.k-ac-mode-well{flex-shrink:0}.k-ac-mode{display:flex;align-items:center;gap:7px;height:40px;padding:0 10px 0 4px;border-radius:12px;font:inherit;font-size:12.5px;color:#dce8f5;cursor:pointer;background:linear-gradient(145deg,#ffffff0c,#ffffff03 65%);border:1px solid transparent;border-top-color:#10213966;border-bottom-color:#edf6ff24;box-shadow:inset 1px 1px 2px #07112145}.k-ac-mode-well .k-glyph{--accent: var(--tone)}@media(hover:hover){.k-ac-mode:hover:not(.selected):not(:disabled),.k-ac-option:hover:not(.selected){background-color:#ffffff12;border-bottom-color:#edf6ff3a}}.k-ac-mode.selected{color:#fff;font-weight:650;background:linear-gradient(145deg,color-mix(in srgb,var(--tone) 34%,transparent),color-mix(in srgb,var(--tone) 10%,transparent));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--tone) 70%,transparent),0 0 16px color-mix(in srgb,var(--tone) 30%,transparent)}.k-ac-mode:disabled{opacity:.5;cursor:default}.k-ac-sheet{position:absolute;inset:8px;z-index:3;display:flex;flex-direction:column;gap:8px;padding:12px 14px;border-radius:20px;background:linear-gradient(160deg,#1b2a44f2,#101b30f2);box-shadow:inset 0 0 0 1px #edf6ff26,0 18px 40px #02091c99}.k-ac-sheet>header{display:flex;align-items:center;justify-content:space-between}.k-ac-sheet>header .k-btn{width:auto;padding:0 12px;font-size:12px}.k-ac-sheet-body{display:flex;flex-direction:column;gap:10px;overflow-y:auto;scrollbar-width:thin}.k-ac-options{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px}.k-ac-option{padding:6px 11px;border-radius:10px;font:inherit;font-size:12px;color:#dce8f5;cursor:pointer;background:linear-gradient(145deg,#ffffff10,#ffffff04);border:1px solid #edf6ff1c}.k-ac-option.selected{color:#fff;font-weight:650;border-color:color-mix(in srgb,var(--mode) 75%,transparent);background:linear-gradient(145deg,color-mix(in srgb,var(--mode) 32%,transparent),color-mix(in srgb,var(--mode) 8%,transparent))}.k-ac-extras{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px;margin-top:5px}.k-ac-extra{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;font-size:12.5px}.k-ac-extra select{font:inherit;color:#e8f1fb;background:#0d1a2e;border:1px solid #edf6ff26;border-radius:8px;padding:3px 6px}.k-app[data-bp=sm] .k-ac-body{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto}.k-app[data-bp=sm] .k-ac-hero img{max-height:120px}.k-item[data-level]{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--level) 42%,transparent),inset 1px 1px 2px #07112145,0 0 14px color-mix(in srgb,var(--level) 14%,transparent)}.k-item[data-level] .k-item-art img{filter:drop-shadow(0 4px 4px #0008) drop-shadow(0 0 7px color-mix(in srgb,var(--level) 75%,transparent))}.k-item[data-level] .k-item-art .k-glyph{--accent: var(--level)}.k-level-word{font-style:normal;font-weight:600;color:var(--level)}.k-climate .k-side{display:flex;flex-direction:column;gap:8px;min-width:0}.k-steppers{display:grid;grid-template-columns:1fr 1fr;gap:8px}.k-steppers .k-btn{height:40px;font-size:22px;line-height:1}.k-seg{display:flex;gap:4px;padding:3px;border-radius:12px;background:linear-gradient(145deg,#233b4f40,#70869b20);box-shadow:inset 2px 3px 5px #0b192955,inset -1px -1px 3px #edfbff22}.k-seg button{flex:1;min-width:0;height:26px;padding:0 4px;border-radius:9px;border:1px solid transparent;background:transparent;font-size:11px;color:#dce8f5;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-seg button:has(.k-glyph){display:inline-flex;align-items:center;justify-content:center;gap:5px}.k-seg .k-glyph[data-size=xs]{width:20px;height:20px;border-radius:7px}.k-seg .k-glyph[data-size=xs] .k-icon{width:13px;height:13px;--mdc-icon-size: 13px}.k-seg button.selected{color:#effaff;background:linear-gradient(145deg,var(--k-ice),#3983b52e);border-color:var(--k-ice-border)}.k-sensor{display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:12px 12px 11px}.k-sensor .k-kicker{align-self:stretch}.k-sensor-name{max-width:100%;font-size:11px;color:#dce8f5c0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-sensor .k-ring{width:84px!important;height:84px!important}.k-media{display:flex;flex-direction:column;gap:10px}.k-media-body{display:flex;align-items:center;gap:14px;flex:1;min-height:0;padding:0;border:0;background:none;text-align:left;cursor:pointer}.k-media-art{display:grid;place-items:center;width:88px;height:88px;flex-shrink:0;overflow:hidden;border-radius:18px;color:var(--k-target)}.k-media-art img{width:100%;height:100%;object-fit:cover}.k-media.playing .k-media-art{box-shadow:inset 1px 1px 2px #07112145,0 0 16px #42bdf84a}.k-media-copy{display:flex;flex-direction:column;gap:4px;min-width:0}.k-media-copy b{font-size:18px;font-weight:550;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-media-copy small{font-size:12px;color:#dce8f5c0}.k-media-controls{display:flex;gap:8px}.k-media-controls .k-btn{width:42px;height:36px;font-size:15px}.k-media-controls .k-btn.primary{color:#effaff;background:linear-gradient(145deg,#63d2ffaa,#2f6f9cdd);border-color:var(--k-ice-border)}.k-media-gap{flex:1}.k-about,.k-roadmap{display:flex;flex-direction:column;gap:8px}.k-about .k-sub{margin:0 0 6px;max-width:46ch}.k-facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}.k-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.k-row{display:flex;align-items:center;gap:10px;min-height:38px}.k-thumb{display:grid;place-items:center;width:36px;height:36px;flex-shrink:0;border-radius:11px}.k-row-copy b{font-size:12.5px;font-weight:550}.k-step-no{font-size:13px;font-weight:500;color:var(--k-target)}.k-energy-hero{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.95fr) minmax(0,.62fr);gap:18px;padding:18px 22px}.k-app[data-bp=md] .k-energy-hero{grid-template-columns:minmax(0,1fr) minmax(0,.8fr);grid-template-rows:auto minmax(0,1fr)}.k-app[data-bp=md] .k-nexus{grid-column:1 / -1;grid-row:2}.k-app[data-bp=sm] .k-energy-hero{grid-template-columns:1fr}.k-energy-prices{display:flex;flex-direction:column;gap:8px;min-width:0}.k-energy-big{display:flex;align-items:baseline;gap:8px;margin-top:2px}.k-energy-big b{font-size:64px;font-weight:450;letter-spacing:-.05em;line-height:1;color:var(--k-target)}.k-energy-hero[data-tone=cheap] .k-energy-big b,.k-energy-hero[data-tone=negative] .k-energy-big b{color:#a8f0c8}.k-energy-hero[data-tone=pricey] .k-energy-big b{color:#ffd29a}.k-energy-big span{font-size:15px;color:var(--k-label)}.k-tone-pill{align-self:flex-start;padding:3px 10px;border-radius:99px;font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#dff6ff;background:var(--k-ice);border:1px solid var(--k-ice-border)}.k-energy-hero[data-tone=cheap] .k-tone-pill,.k-energy-hero[data-tone=negative] .k-tone-pill{color:#d9ffe9;background:#3fcf8e33;border-color:#6be3a866}.k-energy-hero[data-tone=pricey] .k-tone-pill{color:#ffe9c8;background:#f29a3c33;border-color:#ffc27466}.k-energy-wells{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:auto}.k-metric.gas strong{color:#ffd29a}.k-nexus{--nx-electric: #df75ff;--nx-water: #61ddff;--nx-gas: #ffae62;display:flex;flex-direction:column;gap:8px;min-width:0;min-height:0;container-type:inline-size}.k-nx-stage{position:relative;flex:1;min-height:200px;display:grid;grid-template-columns:minmax(0,1fr) 76px minmax(0,1fr);column-gap:clamp(64px,15cqw,120px);align-items:stretch}.k-nx-stage.single{grid-template-columns:minmax(0,1fr) 76px}.k-nx-col{position:relative;z-index:2;display:flex;flex-direction:column;gap:12px;min-width:0;min-height:0}.k-nx-col.left{justify-content:center}.k-nx-col.left .k-nx-feed{flex:0 0 auto;height:calc((100% - 12px * (var(--stack, 1) - 1)) / var(--stack, 1))}.k-nx-col.right .k-nx-feed{flex:1 1 0;min-height:0}.k-nx-hub{position:relative;z-index:2;justify-self:center;align-self:center;display:grid;place-items:center;align-content:center;width:76px;height:76px;border-radius:20px;text-align:center;color:#e8f4ff;background:radial-gradient(ellipse at 30% 0%,#edf6ff40,transparent 65%),linear-gradient(145deg,#a5b4c7a0,#5a6f85a8 52%,#34495ec0);border:1px solid #eff8ff66;box-shadow:inset 0 2px 3px #f7fbff80,inset 0 -3px 5px #17253d77,0 8px 18px #02091c77,0 0 0 6px #61ddff10}.k-nx-hub .k-icon{width:22px;height:22px;--mdc-icon-size: 22px;color:var(--nx-water)}.k-nx-hub b{margin-top:2px;font-size:12px;line-height:1.1;text-transform:uppercase;letter-spacing:.08em}.k-nx-hub small{font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:#bcd3e4}.k-nx-feed{position:relative;display:flex;flex-direction:column;justify-content:center;gap:3px;min-width:0;padding:14px 16px;border-radius:16px;overflow:hidden;background:linear-gradient(145deg,#20324acc,#142338d9 65%);border:1px solid transparent;border-top-color:#10213988;border-left-color:#10213970;border-bottom-color:#edf6ff26;border-right-color:#edf6ff1a;box-shadow:inset 1px 1px 2px #07112166,inset -1px -1px 1px #f2f8ff10,0 6px 14px #02091c44}.k-nx-feed small{display:block;padding-right:30px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.k-nx-feed.electric small{color:var(--nx-electric)}.k-nx-feed.water small{color:var(--nx-water)}.k-nx-feed.gas small{color:var(--nx-gas)}.k-nx-feed strong{font-size:28px;font-weight:450;letter-spacing:-.04em;line-height:1.05;color:var(--k-value);white-space:nowrap}.k-nx-feed em{font-style:normal;font-size:11px;line-height:1.25;color:#a9bfd1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-nx-icon{position:absolute;top:12px;right:12px;display:grid;place-items:center;width:28px;height:28px}.k-nx-icon img{width:30px;height:30px;object-fit:contain;filter:hue-rotate(60deg) saturate(1.1) drop-shadow(0 3px 3px #0008)}.k-nx-feed.water .k-nx-icon{color:var(--nx-water)}.k-nx-feed.gas .k-nx-icon{color:#c99a6a}.k-nx-feed.gas.heating .k-nx-icon{color:var(--nx-gas);filter:drop-shadow(0 0 8px #ff9a3c)}.k-nx-wire{--tone: var(--nx-water);position:absolute;z-index:1;height:3px;border-radius:2px;transform-origin:left center;pointer-events:none;background:linear-gradient(90deg,color-mix(in srgb,var(--tone) 85%,transparent),color-mix(in srgb,var(--tone) 30%,transparent));box-shadow:0 0 6px color-mix(in srgb,var(--tone) 45%,transparent)}.k-nx-wire.electric{--tone: var(--nx-electric)}.k-nx-wire.gas{--tone: var(--nx-gas)}.k-nx-wire:before,.k-nx-wire:after{content:"";position:absolute;left:0;pointer-events:none;animation:k-nx-flow var(--dur, 3.6s) linear infinite}.k-nx-wire:before{top:-1px;width:26px;height:5px;margin-left:-22px;border-radius:4px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--tone) 75%,white));filter:blur(1px)}.k-nx-wire:after{top:-3px;width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,var(--tone) 25%,white);box-shadow:0 0 6px 1px var(--tone),0 0 16px 3px color-mix(in srgb,var(--tone) 60%,transparent)}.k-nx-wire.idle{opacity:.45}@keyframes k-nx-flow{0%{left:0;visibility:hidden}6%,92%{visibility:visible}to{left:var(--run, 40px);visibility:hidden}}.k-nx-legend{display:flex;gap:16px;font-size:11px;letter-spacing:.04em;color:#a9bfd1}.k-nx-legend span{display:inline-flex;align-items:center;gap:6px}.k-nx-legend i{width:6px;height:6px;border-radius:50%;background:var(--nx-water);box-shadow:0 0 6px var(--nx-water)}.k-nx-legend .electric i{background:var(--nx-electric);box-shadow:0 0 6px var(--nx-electric)}.k-nx-legend .gas i{background:var(--nx-gas);box-shadow:0 0 6px var(--nx-gas)}.k-app[data-bp=sm] .k-nx-stage{grid-template-columns:1fr;grid-template-rows:auto 64px auto;row-gap:48px}.k-app[data-bp=sm] .k-nx-col.right{flex-direction:row}.k-app[data-bp=sm] .k-nx-col .k-nx-feed{flex:1 1 0;height:auto;min-height:92px}.k-app[data-bp=sm] .k-nx-hub{width:64px;height:64px;border-radius:16px}.k-app[data-bp=sm] .k-nx-feed strong{font-size:20px}@media(prefers-reduced-motion:reduce){.k-nx-wire:before,.k-nx-wire:after{animation:none;left:calc(var(--run, 40px) * .5)}.k-nx-feed.gas.heating .k-nx-icon{animation:none}}.k-energy-ring{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}.k-energy-ring .k-kicker{align-self:stretch;text-align:center}.k-energy-ring .k-ring-label b{font-size:30px}.k-slots{display:flex;flex-direction:column;gap:10px;padding:16px 18px}.k-bars{display:flex;align-items:flex-end;gap:3px;flex:1;min-height:70px;padding:8px 8px 18px;border-radius:16px;background:linear-gradient(145deg,#ffffff08,#ffffff02 65%);border:1px solid transparent;border-top-color:#10213966;border-bottom-color:#edf6ff1e;box-shadow:inset 1px 1px 2px #07112145}.k-bar-col{position:relative;flex:1;height:100%;display:flex;align-items:flex-end;min-width:0}.k-bar-col i{width:100%;border-radius:4px 4px 2px 2px;background:linear-gradient(180deg,#a5b4c799,#64789066);transition:height .6s cubic-bezier(.2,.8,.2,1)}.k-bar-col.best i{background:linear-gradient(180deg,#8debff,#159dec);box-shadow:0 0 8px #42bdf866}.k-bar-col.neg i{background:linear-gradient(180deg,#a8f0c8,#3fcf8e)}.k-bar-col.now i{background:linear-gradient(180deg,#f4f8ff,#a5b4c7);box-shadow:0 0 8px #f4f8ff55}.k-bar-col small{position:absolute;left:0;bottom:-17px;font-size:9.5px;color:var(--k-label);white-space:nowrap}.k-slots-hint{display:flex;align-items:center;gap:8px;margin:0;font-size:13px;color:#dff6ff}.k-slots-hint .k-icon{color:#8debff}.k-energy-today{display:flex;flex-direction:column;gap:12px;padding:16px 18px}.k-today-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.k-app[data-bp=md] .k-today-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.k-today-grid .k-metric strong{font-size:20px}.k-appliance{display:flex;align-items:center;gap:22px;padding:18px 22px;cursor:pointer}.k-app:not([data-bp=lg]) .k-appliance{flex-direction:column;align-items:stretch;gap:12px}.k-appliance-ring{position:relative;flex-shrink:0;width:196px;height:196px;align-self:center;border-radius:50%;background:radial-gradient(ellipse at 28% 10%,#ffffff20,transparent 48%),linear-gradient(155deg,#273c5c55,#09142988);box-shadow:inset 0 1px 1px #ffffff3a,inset 0 -3px 5px #0005,0 6px 10px #0006}.k-appliance-ring svg{position:absolute;inset:0}.k-appliance-fill{fill:none;stroke-linecap:round;filter:drop-shadow(0 0 4px #5fdbff88);transition:stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)}.k-appliance-ring img{position:absolute;left:50%;top:50%;width:128px;height:128px;object-fit:contain;transform:translate(-50%,-50%);filter:saturate(.35) brightness(.8) drop-shadow(0 8px 6px #0008);transition:filter .6s}.k-appliance-glow{position:absolute;inset:34px;border-radius:50%;opacity:0;background:radial-gradient(circle at 50% 55%,#5fdbff66,transparent 62%)}.k-appliance[data-mode=running] .k-appliance-ring img{filter:drop-shadow(0 8px 6px #0008) drop-shadow(0 0 10px #42bdf855)}.k-appliance[data-mode=running] .k-appliance-glow{opacity:1}.k-appliance.dryer[data-mode=running] .k-appliance-glow{background:radial-gradient(circle at 50% 55%,#ffb45a66,transparent 62%)}.k-appliance[data-mode=done] .k-appliance-ring img,.k-appliance[data-mode=paused] .k-appliance-ring img{filter:drop-shadow(0 8px 6px #0008)}.k-appliance[data-mode=done] .k-appliance-fill{filter:drop-shadow(0 0 4px #3fcf8e88)}.k-appliance[data-mode=missing]{opacity:.7}.k-appliance-copy{display:flex;flex-direction:column;gap:6px;min-width:0;flex:1}.k-appliance-copy h3{margin:0;font-size:22px;font-weight:650;letter-spacing:-.03em}.k-appliance[data-mode=running] .k-kicker{color:#8debff}.k-appliance[data-mode=done] .k-kicker{color:#a8f0c8}.k-appliance-big{font-size:52px;font-weight:450;letter-spacing:-.045em;line-height:1;color:var(--k-target)}.k-appliance-big small{font-size:18px;letter-spacing:0;color:var(--k-label)}.k-appliance-big.muted{font-size:34px;color:#dce8f5aa}.k-appliance-finish{font-size:13px;color:#dce8f5d0}.k-appliance-wells{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:6px}.k-appliance-wells .k-metric strong{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-pill.live{color:#dff6ff;border-color:#68ceff55}.k-pill.live .k-icon{color:#8debff;animation:k-pulse 2s ease-in-out infinite}@keyframes k-pulse{50%{color:#8debff70}}.k-fuelcard,.k-stations,.k-fuelmap{display:flex;flex-direction:column;gap:12px;padding:16px 18px}.k-fuelcard.link{cursor:pointer}.k-fuel-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;flex:1;min-height:0}.k-app[data-bp=sm] .k-fuel-pair{grid-template-columns:1fr}.k-fuel-best{display:flex;align-items:center;gap:10px;padding:8px 12px 8px 6px;min-width:0;border-radius:18px}.k-fuel-best img{width:64px;height:92px;object-fit:contain;flex-shrink:0;filter:drop-shadow(0 8px 6px #0008)}.k-fuel-best-copy{display:flex;flex-direction:column;gap:3px;min-width:0}.k-fuel-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#a8e7c8}.k-fuel-best[data-fuel=E10] .k-fuel-label{color:#8debff}.k-fuel-best b{font-size:34px;font-weight:450;letter-spacing:-.04em;line-height:1;color:var(--k-value)}.k-fuel-best b small{font-size:16px;color:var(--k-label)}.k-fuel-where{display:flex;align-items:center;gap:7px;font-size:11.5px;color:#dce8f5c8}.k-fuel-foot{font-size:11px;color:#dce8f5a0}.k-brand{display:inline-grid;place-items:center;flex-shrink:0;min-width:54px;height:32px;padding:0 8px;border-radius:9px;border-bottom:3px solid transparent;font-size:12px;font-weight:800;letter-spacing:.02em;box-shadow:inset 0 1px 1px #ffffff80,0 3px 6px #0006}.k-brand.sm{min-width:34px;height:20px;padding:0 5px;border-radius:6px;border-bottom-width:2px;font-size:9px}.k-fuel-tabs{flex-shrink:0;width:190px}.k-station-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.k-station{display:grid;grid-template-columns:26px auto minmax(0,1fr) 70px 70px 54px 24px;align-items:center;gap:10px;height:62px;padding:0 12px 0 8px;border-radius:16px;color:inherit;text-decoration:none;transition:filter .2s}@media(hover:hover){.k-station:hover{background-color:#ffffff0d}}.k-app[data-bp=sm] .k-station{grid-template-columns:22px auto minmax(0,1fr) 62px 20px}.k-app[data-bp=sm] .k-station-price:not(.active),.k-app[data-bp=sm] .k-station-dist{display:none}.k-station-rank{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;font-size:12px;font-weight:600;color:var(--k-target);background:linear-gradient(145deg,#ffffff0c,#ffffff03);box-shadow:inset 1px 1px 2px #07112166}.k-station li:first-child .k-station-rank,.k-station-list li:first-child .k-station-rank{color:#0a1324;background:linear-gradient(145deg,#bff1ff,#5fdbff)}.k-station-copy{display:flex;flex-direction:column;gap:2px;min-width:0}.k-station-copy b{font-size:14px;font-weight:600}.k-station-copy small{font-size:11px;color:#dce8f5b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-station-price{display:flex;flex-direction:column;align-items:flex-end;gap:1px}.k-station-price small{font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--k-label)}.k-station-price b{font-size:15px;font-weight:500;color:#dce8f5}.k-station-price.active b{font-size:17px;color:#a8f0c8}.k-station-price.petrol.active b{color:#8debff}.k-station-dist{font-size:12px;text-align:right;color:#dce8f5c0}.k-station-go{color:var(--k-target)}.k-radar,.k-mapimg{position:relative;flex:1;min-height:0;overflow:hidden;border-radius:20px}.k-radar{background:radial-gradient(circle at 50% 50%,#42bdf81a,transparent 62%),linear-gradient(145deg,#0e1c33cc,#0a1426e6);box-shadow:inset 1px 1px 3px #07112188,inset -1px -1px 1px #f2f8ff14}.k-radar-ring{position:absolute;left:50%;top:50%;border-radius:50%;border:1px solid #8debff2e;transform:translate(-50%,-50%);aspect-ratio:1}.k-radar-ring.r1{height:31%}.k-radar-ring.r2{height:62%}.k-radar-ring.r3{height:92%;border-color:#8debff55;box-shadow:0 0 18px #42bdf822 inset}.k-radar-scale{position:absolute;left:50%;top:4%;transform:translate(-50%);padding:2px 8px;border-radius:99px;font-size:10px;color:#bfe9ff;background:#0a1426cc}.k-radar-sweep{position:absolute;left:50%;top:50%;height:92%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);background:conic-gradient(from var(--k-sweep),#42bdf833,transparent 18%);animation:k-sweep 6s linear infinite}@keyframes k-sweep{to{--k-sweep: 360deg}}.k-radar-home{position:absolute;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;transform:translate(-50%,-50%);color:#0a1324;background:linear-gradient(145deg,#f4f8ff,#a5b4c7);box-shadow:0 0 0 6px #f4f8ff1f,0 4px 10px #0008}.k-radar-home .k-icon{width:18px;height:18px;--mdc-icon-size: 18px}.k-mapimg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.85) brightness(.85)}.k-pin{position:absolute;display:flex;flex-direction:column;align-items:center;gap:2px;transform:translate(-50%,-100%);text-decoration:none;filter:drop-shadow(0 4px 6px #000a)}.k-pin i{display:grid;place-items:center;width:18px;height:18px;border-radius:50%;font-size:10px;font-style:normal;font-weight:700;color:#0a1324;background:#f4f8ff}.k-mapimg{display:grid;place-items:center;container-type:size;background:linear-gradient(145deg,#0e1c33cc,#0a1426e6);box-shadow:inset 1px 1px 3px #07112188,inset -1px -1px 1px #f2f8ff14}.k-mapimg.loading{background:linear-gradient(110deg,#0e1c33cc 30%,#1b2c47cc,#0e1c33cc 70%);background-size:200% 100%;animation:k-shimmer 1.6s linear infinite}@keyframes k-shimmer{to{background-position:-200% 0}}.k-mapframe{position:absolute;inset:0;overflow:hidden;border-radius:16px}.k-mapframe img{position:absolute;max-width:none;filter:saturate(.8) brightness(.86) contrast(1.05)}.k-mapframe:after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,transparent 55%,#0a142688 100%),linear-gradient(180deg,#0b14241f,#0b142433);box-shadow:inset 0 0 0 1px #eff8ff22}.k-map-radius{position:absolute;z-index:1;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;border:2px solid #42bdf8aa;background:#42bdf812;box-shadow:0 0 18px #42bdf844}.k-mapframe .k-radar-home,.k-radar .k-radar-home{z-index:2}.k-radar{overflow:visible}.k-pin-leaders{position:absolute;left:0;top:0;z-index:2;pointer-events:none;overflow:visible}.k-pin-leaders line{stroke:#0b1a2e;stroke-width:2;stroke-linecap:round;stroke-dasharray:4 3;filter:drop-shadow(0 0 1.5px #ffffffcc)}.k-pin-leaders line.hot{stroke:#1d8fd0;stroke-dasharray:none}.k-pin-dot{position:absolute;z-index:3;display:grid;place-items:center;width:16px;height:16px;border-radius:50%;transform:translate(-50%,-50%);font-size:9px;font-weight:700;color:#0a1324;background:#f4f8ff;box-shadow:0 0 0 2px #0a132499,0 3px 6px #000a;pointer-events:none}.k-pin-dot.best{background:linear-gradient(145deg,#bff1ff,#5fdbff);box-shadow:0 0 0 2px #0a132499,0 0 10px #42bdf8aa}.k-pin{position:absolute;z-index:4;display:inline-flex;flex-direction:row;align-items:center;gap:5px;padding:3px 8px 3px 3px;border-radius:10px;transform:translate(-50%,-50%);text-decoration:none;white-space:nowrap;background:linear-gradient(145deg,#1c2d45ee,#0e1a2df2);border:1px solid #eff8ff40;box-shadow:inset 0 1px 1px #ffffff26,0 4px 10px #000a;filter:none;transition:transform .18s,border-color .18s}.k-pin b{font-size:11px;font-weight:600;color:#f4f8ff}.k-pin.best{z-index:6;border-color:#8debffaa;box-shadow:inset 0 1px 1px #fff3,0 0 0 3px #42bdf833,0 4px 12px #000a}.k-pin.best b{color:#a8f0c8}.k-pin.hot,.k-pin:hover{z-index:7;transform:translate(-50%,-50%) scale(1.14);border-color:#8debff;background:linear-gradient(145deg,#2a4a6cf2,#15304cf5)}.k-pin-dot.hot{box-shadow:0 0 0 3px #8debff,0 3px 6px #000a}.k-station.hot{filter:brightness(1.15);border-color:#68ceff66;box-shadow:inset 1px 1px 2px #07112145,0 0 0 1px #68ceff55}.k-grid:has(.k-station-list>li:nth-child(1):hover) .k-pin[data-rank="1"],.k-grid:has(.k-station-list>li:nth-child(2):hover) .k-pin[data-rank="2"],.k-grid:has(.k-station-list>li:nth-child(3):hover) .k-pin[data-rank="3"],.k-grid:has(.k-station-list>li:nth-child(4):hover) .k-pin[data-rank="4"],.k-grid:has(.k-station-list>li:nth-child(5):hover) .k-pin[data-rank="5"]{z-index:7;transform:translate(-50%,-50%) scale(1.14);border-color:#8debff}.k-style{display:flex;flex-direction:column;gap:10px;padding:16px 18px}.k-style>.k-sub{margin:-4px 0 4px;max-width:90ch}.k-art-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));gap:12px;min-height:0;overflow-y:auto}.k-art-card{display:flex;flex-direction:column;gap:6px;margin:0;min-width:0}.k-art-well{position:relative;display:grid;place-items:center;aspect-ratio:1;border-radius:18px;overflow:hidden}.k-art-well:before{content:"";position:absolute;inset:18%;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 22%,transparent),transparent 70%);pointer-events:none}.k-art-well img{position:relative;width:82%;height:82%;object-fit:contain;filter:drop-shadow(0 8px 8px #000a)}.k-art-card figcaption{display:flex;flex-direction:column;gap:1px;min-width:0}.k-art-card b{font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-art-card small{display:inline-flex;align-items:center;gap:5px;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--accent)}.k-art-card small i{width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 6px var(--accent)}.k-glyph{display:grid;place-items:center;width:40px;height:40px;flex-shrink:0;border-radius:12px;color:var(--accent);background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 16%,transparent),#ffffff03 70%);border:1px solid transparent;border-top-color:#10213966;border-left-color:#10213952;border-bottom-color:color-mix(in srgb,var(--accent) 30%,transparent);border-right-color:#edf6ff18;box-shadow:inset 1px 1px 2px #07112166,0 0 10px color-mix(in srgb,var(--accent) 14%,transparent)}.k-glyph .k-icon{width:20px;height:20px;--mdc-icon-size: 20px}.k-glyph-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:10px}.k-glyph-item{display:flex;flex-direction:column;align-items:center;gap:5px;min-width:0;text-align:center}.k-glyph-item small{max-width:100%;font-size:10px;color:#dce8f5c0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-style-devices,.k-style-chips{display:grid;gap:8px}.k-style-chips{grid-template-columns:repeat(2,minmax(0,1fr))}.k-style-devices .k-device{height:58px;padding:6px 12px 6px 6px}.k-style-devices .k-device-art,.k-style-devices .k-device-art img{width:48px;height:48px}.k-device.off .k-device-art img{filter:saturate(.3) brightness(.72) drop-shadow(0 6px 5px #0008)}.k-style-feeds{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;height:100%}.k-app[data-bp=sm] .k-style-feeds{grid-template-columns:1fr}.k-style-feed{padding-right:84px}.k-style-feed-art{position:absolute;right:10px;top:50%;width:66px;height:66px;object-fit:contain;transform:translateY(-50%);filter:drop-shadow(0 6px 6px #000a)}.k-glyph[data-size=xs]{width:24px;height:24px;border-radius:8px}.k-glyph[data-size=xs] .k-icon{width:14px;height:14px;--mdc-icon-size: 14px}.k-glyph[data-size=sm]{width:32px;height:32px;border-radius:10px}.k-pill{padding:4px 12px 4px 4px}.k-pill .k-glyph .k-icon{color:var(--accent)}.k-item-art .k-glyph{width:44px;height:44px}.k-device-art .k-glyph{width:52px;height:52px;border-radius:16px}[data-state=dim] .k-item-art img,[data-state=dim] .k-device-art img,.k-media-art[data-state=dim] img{filter:saturate(.3) brightness(.72) drop-shadow(0 4px 4px #0008)}[data-state=on] .k-item-art img,[data-state=on] .k-device-art img,.k-media-art[data-state=on] img{filter:drop-shadow(0 4px 4px #0008) drop-shadow(0 0 10px color-mix(in srgb,var(--accent, #ffbd42) 45%,transparent))}[data-state=missing] .k-item-art img,[data-state=missing] .k-device-art img,[data-state=missing] .k-glyph,.k-media-art[data-state=missing] img{filter:grayscale(.85) brightness(.6);opacity:.75}.k-item[data-state=alert]{border-color:#ff687888!important;box-shadow:inset 1px 1px 2px #07112145,0 0 0 1px #ff687844,0 0 14px #ff687822}.k-item[data-state=alert] b{color:#ffd0d5}.k-item[data-state=missing] b{color:#ffe0a6}.k-roomcard-icon{color:#8debff;background:linear-gradient(145deg,#42bdf833,#0e1c33aa);border-color:#8debff55;box-shadow:inset 0 1px 2px #ffffff40,0 0 10px #42bdf833,0 4px 10px #0006}.k-panel-icon{background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 18%,transparent),#ffffff03 70%);border-bottom-color:color-mix(in srgb,var(--accent) 35%,transparent);box-shadow:inset 1px 1px 2px #07112166,0 0 10px color-mix(in srgb,var(--accent) 14%,transparent)}.k-media-device{width:78%!important;height:78%!important;object-fit:contain!important}.k-nx-art{position:absolute;top:8px;right:8px;width:44px;height:44px;object-fit:contain;filter:drop-shadow(0 4px 4px #000a)}.k-nx-feed.gas:not(.heating) .k-nx-art{filter:saturate(.4) brightness(.78) drop-shadow(0 4px 4px #000a)}.k-nx-feed.gas.heating .k-nx-art{filter:drop-shadow(0 4px 4px #000a) drop-shadow(0 0 10px #ffb45a)}.k-nx-feed small{padding-right:48px}.k-f1-hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1.25fr) minmax(170px,.55fr);align-items:center;gap:18px;padding:18px 24px;background:radial-gradient(ellipse at 22% 62%,#ff5a5a26,transparent 58%),radial-gradient(ellipse at 15% 0%,#edf6ff40,transparent 65%),linear-gradient(145deg,#8a9bad70,#5a6f8559 55%,#34495e70)}.k-app[data-bp=md] .k-f1-hero{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)}.k-app[data-bp=md] .k-f1-wx{grid-column:1 / -1;grid-template-columns:repeat(4,minmax(0,1fr))}.k-app[data-bp=md] .k-f1-wx>.k-f1-label{grid-column:1 / -1}.k-app[data-bp=sm] .k-f1-hero{grid-template-columns:1fr;gap:10px;padding:14px 16px}.k-f1-stage{display:grid;place-items:center;min-height:0;height:100%;cursor:pointer}.k-f1-car{width:100%;max-height:300px;object-fit:contain;filter:drop-shadow(0 14px 12px #000a) drop-shadow(0 0 22px #ff5a5a3a)}.k-app[data-bp=sm] .k-f1-car{max-height:150px}.k-f1-copy{display:flex;flex-direction:column;gap:7px;min-width:0}.k-f1-copy h2{display:flex;align-items:center;gap:10px;margin:0;font-size:30px;font-weight:650;letter-spacing:-.035em;line-height:1.1}.k-app[data-bp=sm] .k-f1-copy h2{font-size:23px}.k-f1-flag{width:34px;height:23px;flex-shrink:0;border-radius:5px;object-fit:cover;box-shadow:0 0 0 1px #edf6ff30,0 3px 8px #0007}.k-f1-cc{display:inline-grid;place-items:center;min-width:30px;height:22px;padding:0 5px;flex-shrink:0;border-radius:6px;font-size:10.5px;font-weight:700;letter-spacing:.08em;color:#ffd6d6;background:linear-gradient(145deg,#ff5a5a33,#ff5a5a14);box-shadow:inset 0 0 0 1px #ff8f8f40}.k-f1-label{font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--k-label)}.k-f1-countdown{display:grid;grid-template-columns:repeat(4,minmax(0,84px));gap:8px}.k-f1-countdown strong{color:#ffd6d6;font-variant-numeric:tabular-nums;text-shadow:0 0 14px #ff5a5a55}.k-f1-when{font-size:12px;color:#dce8f5c8}.k-f1-when:first-letter{text-transform:uppercase}.k-f1-livebar{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;padding:5px 12px 5px 9px;border-radius:12px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#ffe1e1;background:linear-gradient(145deg,#ff3b3b40,#ff3b3b1a);box-shadow:inset 0 0 0 1px #ff6b6b66,0 0 18px #ff3b3b33}.k-f1-livebar i{width:8px;height:8px;border-radius:50%;background:#ff4d4d;box-shadow:0 0 10px #ff4d4d;animation:k-f1-pulse 1.4s ease-in-out infinite}@keyframes k-f1-pulse{50%{background:#ff4d4d55;box-shadow:none}}.k-f1-flagpill[data-tone=yellow]{color:#ffe9a6;box-shadow:inset 0 0 0 1px #ffd34d55}.k-f1-flagpill[data-tone=red]{color:#ffc4c4;box-shadow:inset 0 0 0 1px #ff4d4d77}.k-f1-flagpill[data-tone=green] .k-glyph{--accent: #5fe08a}.k-f1-wx{display:grid;gap:7px;align-content:center}.k-f1-fact.k-item{height:52px;padding:6px 10px 6px 6px;cursor:default}.k-f1-fact .k-item-art{width:38px;height:38px}.k-f1-fact .k-item-art .k-glyph{width:36px;height:36px}.k-f1-fact .k-item-copy b{font-size:15px}.k-f1-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;align-content:start}.k-f1-facts.three{grid-template-columns:repeat(3,minmax(0,1fr))}.k-app[data-bp=sm] .k-f1-facts.three{grid-template-columns:1fr}.k-f1-live-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) minmax(0,1fr);gap:14px;min-height:0;flex:1}.k-f1-live.wide .k-f1-live-body,.k-app[data-bp=md] .k-f1-live-body,.k-app[data-bp=sm] .k-f1-live-body{grid-template-columns:1fr}.k-f1-live-status{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;align-content:start}.k-f1-live.wide .k-f1-live-status{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}.k-app[data-bp=md] .k-f1-live-status{grid-template-columns:repeat(4,minmax(0,1fr))}.k-f1-board{grid-column:1 / -1;display:flex;flex-direction:column;justify-content:center;gap:2px;min-height:52px;padding:8px 14px;border-left:4px solid #8fa3b8}.k-f1-live.wide .k-f1-board{grid-column:span 1}.k-f1-board small{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--k-label)}.k-f1-board b{font-size:17px;font-weight:600}.k-f1-board[data-tone=green]{border-left-color:#47d16c}.k-f1-board[data-tone=yellow]{border-left-color:#ffd34d;background:linear-gradient(145deg,#ffd34d24,#ffd34d08)}.k-f1-board[data-tone=red]{border-left-color:#ff4d4d;background:linear-gradient(145deg,#ff4d4d2a,#ff4d4d0a)}.k-f1-hint{align-self:center}.k-f1-board-rows{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:28px;gap:4px 6px;align-content:start}.k-f1-board-rows li{display:grid;grid-template-columns:20px 10px 38px 30px minmax(0,1fr) auto;align-items:center;gap:6px;padding:0 8px 0 4px;border-radius:9px;font-size:12px}.k-f1-board-rows li.pit{box-shadow:inset 0 0 0 1px #61ddff55}.k-f1-board-rows li.out{opacity:.45}.k-f1-board-rows em{font-style:normal;text-align:right;color:#dce8f5d8;font-variant-numeric:tabular-nums}.k-f1-board-rows small{font-size:10px;color:var(--k-label)}.k-f1-tyre{display:inline-flex;align-items:center;gap:2px;font-size:10px;font-weight:700;color:var(--tyre)}.k-f1-tyre:before{content:"";width:9px;height:9px;border-radius:50%;border:2px solid var(--tyre);box-shadow:0 0 6px color-mix(in srgb,var(--tyre) 55%,transparent)}.k-f1-tyre small{color:var(--k-label);font-weight:500}.k-f1-rc{display:flex;flex-direction:column;gap:6px;min-height:0;overflow:hidden}.k-f1-msg{display:flex;flex-direction:column;gap:2px;padding:7px 10px;border-left:3px solid #8fa3b8;font-size:12px;line-height:1.3}.k-f1-msg small{font-size:10px;color:var(--k-label)}.k-f1-msg[data-tone=yellow]{border-left-color:#ffd34d}.k-f1-msg[data-tone=green]{border-left-color:#47d16c}.k-f1-msg[data-tone=red]{border-left-color:#ff4d4d}.k-f1-sessions{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.k-f1-sessions li{display:grid;grid-template-columns:46px minmax(0,1fr) auto;align-items:center;gap:12px;height:50px;padding:0 14px 0 6px;border-radius:14px}.k-f1-code{display:grid;place-items:center;height:36px;border-radius:11px;font-size:12px;font-weight:700;letter-spacing:.06em;color:#ffd6d6;background:linear-gradient(145deg,#ff5a5a2e,#ff5a5a0d);box-shadow:inset 1px 1px 2px #07112166,inset 0 0 0 1px #ff8f8f30}.k-f1-sname{display:flex;flex-direction:column;min-width:0}.k-f1-sname b{font-size:14px;font-weight:600}.k-f1-sname small{font-size:11px;color:var(--k-label)}.k-f1-sname small:first-letter{text-transform:uppercase}.k-f1-sstate{font-size:11px;font-weight:650;letter-spacing:.08em;text-transform:uppercase;color:var(--k-label)}.k-f1-sessions li[data-state=done]{opacity:.55}.k-f1-sessions li[data-state=done] .k-f1-code{color:#dce8f5;background:linear-gradient(145deg,#ffffff10,#ffffff04);box-shadow:inset 1px 1px 2px #07112166}.k-f1-sessions li[data-state=next]{box-shadow:inset 0 0 0 1px #ff8f8f66,0 0 18px #ff5a5a1f}.k-f1-sessions li[data-state=next] .k-f1-sstate{color:#ffd6d6}.k-f1-sessions li[data-state=live]{background:linear-gradient(145deg,#ff3b3b30,#ff3b3b0c);box-shadow:inset 0 0 0 1px #ff6b6b88,0 0 20px #ff3b3b2e}.k-f1-sessions li[data-state=live] .k-f1-sstate{color:#ffe1e1}.k-f1-sessions li[data-state=live] .k-f1-sstate:before{content:"● ";color:#ff4d4d}.k-f1-circuit-body{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:12px;min-height:0;flex:1}.k-app[data-bp=sm] .k-f1-circuit-body{grid-template-columns:1fr}.k-f1-map{display:grid;place-items:center;min-height:0;padding:10px;border-radius:18px}.k-f1-map img{width:100%;height:100%;max-height:230px;object-fit:contain;filter:drop-shadow(0 6px 8px #0009)}.k-f1-circuit .k-f1-facts{grid-template-columns:1fr}.k-app[data-bp=md] .k-f1-circuit .k-f1-facts{grid-template-columns:repeat(2,minmax(0,1fr))}.k-f1-rings{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.k-f1-ring{display:grid;grid-template-columns:52px minmax(0,1fr);grid-template-rows:auto auto;align-items:center;column-gap:10px;padding:6px 10px 6px 6px;border-radius:16px}.k-f1-ring svg{grid-row:span 2;width:52px;height:52px}.k-f1-ring circle{fill:none;stroke-width:6}.k-f1-ring .track{stroke:#0711214d}.k-f1-ring .bar{stroke:#ff5a5a;stroke-linecap:round;filter:drop-shadow(0 0 4px #ff5a5a88)}.k-f1-ring b{align-self:end;font-size:18px;font-weight:550}.k-f1-ring small{align-self:start;font-size:10.5px;color:var(--k-label)}.k-f1-rows{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:5px;min-height:0}.k-f1-rows.scroll{overflow-y:auto;flex:1;padding-right:4px;scrollbar-width:thin}.k-f1-rows li{display:grid;grid-template-columns:26px 12px minmax(0,1.3fr) minmax(0,1fr) 46px 48px 66px;align-items:center;gap:10px;flex-shrink:0;height:38px;padding:0 12px 0 6px;border-radius:12px}.k-f1-rows.teams li{grid-template-columns:26px 12px minmax(0,1fr) 46px 66px}.k-f1-rows.compact li{grid-template-columns:26px 12px minmax(0,1fr) 40px minmax(0,.9fr) 34px;height:34px}.k-f1-history .k-f1-rows.compact li{grid-template-columns:30px 12px minmax(0,1fr) minmax(0,.9fr) 34px}.k-app[data-bp=sm] .k-f1-rows li{grid-template-columns:24px 10px minmax(0,1fr) 40px 54px;gap:8px}.k-app[data-bp=sm] .k-f1-rows li .k-f1-team,.k-app[data-bp=sm] .k-f1-rows li .k-f1-gap{display:none}.k-app[data-bp=sm] .k-f1-rows.teams li{grid-template-columns:24px 10px minmax(0,1fr) 40px 54px}.k-f1-pos{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;font-size:12px;font-weight:650;color:var(--k-target);background:linear-gradient(145deg,#ffffff0c,#ffffff03);box-shadow:inset 1px 1px 2px #07112166}.podium>.k-f1-pos{color:#2a0d0d;background:linear-gradient(145deg,#ffd6d6,#ff7a7a);box-shadow:0 0 10px #ff5a5a55}.k-f1-dot{display:inline-grid;place-items:center;width:10px;height:10px;border-radius:50%;background:var(--team);box-shadow:0 0 8px color-mix(in srgb,var(--team) 70%,transparent),inset 0 1px 1px #fff6}.k-f1-who{display:flex;flex-direction:column;min-width:0;line-height:1.15}.k-f1-who b{font-size:13.5px;font-weight:650;letter-spacing:.02em}.k-f1-who small,.k-f1-team{font-size:11px;color:var(--k-label);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-f1-wins,.k-f1-gap{font-size:11.5px;color:#dce8f5b8;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}.k-f1-rows em{font-style:normal;font-size:15px;font-weight:600;text-align:right;color:#ffd6d6;font-variant-numeric:tabular-nums;white-space:nowrap}.k-f1-rows em small{font-size:10px;font-weight:500;color:var(--k-label)}.k-f1-rows.compact em{font-size:12px}.k-f1-share{display:block;height:4px;margin-top:4px;border-radius:3px;background:#0711214d;overflow:hidden}.k-f1-share i{display:block;height:100%;border-radius:3px;background:var(--team);box-shadow:0 0 8px var(--team)}.k-f1-more{align-self:center;margin-top:auto;padding:7px 16px;border-radius:12px;font:inherit;font-size:12px;color:#ffd6d6;cursor:pointer;background:linear-gradient(145deg,#ffffff14,#ffffff05);border:1px solid #edf6ff26;box-shadow:0 4px 10px #02091c55}@media(hover:hover){.k-f1-more:hover{background:linear-gradient(145deg,#fff2,#ffffff0a)}}.k-f1-podium{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:end;gap:8px}.k-f1-step{display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 8px 9px;border-radius:16px;text-align:center;min-width:0}.k-f1-step[data-pos="1"]{padding-top:18px;background:linear-gradient(160deg,#ff5a5a24,#ff5a5a06 70%);box-shadow:inset 0 0 0 1px #ff8f8f55,0 0 20px #ff5a5a1f}.k-f1-step .k-f1-dot{width:40px;height:40px;font-size:12px;font-weight:750;color:#0b1424;letter-spacing:.02em}.k-f1-step[data-pos="1"] .k-f1-dot{width:48px;height:48px}.k-f1-step b{font-size:13px;font-weight:600;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-f1-step small{font-size:10.5px;color:var(--k-label)}.k-f1-step em{font-style:normal;font-size:11.5px;color:#ffd6d6;font-variant-numeric:tabular-nums}.k-f1-medal{font-size:10px;font-weight:750;letter-spacing:.14em;color:var(--k-label)}.k-f1-step[data-pos="1"] .k-f1-medal{color:#ffd6d6}.k-f1-delta{font-size:10.5px;text-align:center;color:var(--k-label)}.k-f1-delta[data-dir=up]{color:#6fe39a}.k-f1-delta[data-dir=down]{color:#ff8f8f}.k-f1-history .k-f1-facts{margin-top:auto}.k-f1-rounds{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));grid-auto-rows:88px;gap:8px}.k-f1-rounds li{display:flex;flex-direction:column;justify-content:space-between;gap:3px;padding:8px 10px;border-radius:14px;min-width:0}.k-f1-rnd{display:flex;align-items:center;justify-content:space-between;font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--k-label)}.k-f1-rnd i{font-style:normal;font-size:9px;letter-spacing:.08em;padding:1px 6px;border-radius:6px;color:#ffe9a6;background:#ffd34d1f}.k-f1-rname{display:flex;align-items:center;gap:6px;min-width:0}.k-f1-rname .k-f1-flag{width:20px;height:14px;border-radius:3px}.k-f1-rname .k-f1-cc{min-width:24px;height:16px;font-size:9px}.k-f1-rname b{font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.k-f1-rounds small{font-size:10.5px;color:var(--k-label);white-space:nowrap}.k-f1-winner{font-weight:700;color:#e8f1fb}.k-f1-winner:before{content:"";display:inline-block;width:7px;height:7px;margin-right:4px;border-radius:50%;background:var(--team);box-shadow:0 0 6px var(--team)}.k-f1-rounds li[data-state=done]{opacity:.6}.k-f1-rounds li[data-state=next]{opacity:1;background:linear-gradient(160deg,#ff5a5a2a,#ff5a5a08 70%);box-shadow:inset 0 0 0 1px #ff8f8f77,0 0 20px #ff5a5a26}.k-f1-rounds li[data-state=next] .k-f1-rnd{color:#ffd6d6}.k-error{display:flex;flex-direction:column;gap:6px;min-height:70px;border-color:#ff687866}.k-error p{margin:0;font-size:12px;color:#ffd0d5;overflow-wrap:anywhere}.k-fatal{margin:24px;padding:16px;border-radius:16px;white-space:pre-wrap;font:12px/1.5 ui-monospace,Consolas,monospace;color:#ffd0d5;background:#1a1220;border:1px solid #ff687866}.k-dock{position:absolute;left:50%;bottom:16px;z-index:10;display:flex;align-items:center;max-width:calc(100% - 24px);padding:6px;transform:translate(-50%);border-radius:24px;background:radial-gradient(ellipse at 15% 0%,#edf6ff40,transparent 65%),linear-gradient(145deg,#8a9bad88,#5a6f8577 55%,#34495e88);border:1px solid #eff8ff66;backdrop-filter:blur(24px) saturate(120%);-webkit-backdrop-filter:blur(24px) saturate(120%);box-shadow:inset 0 3px 5px #f5faff55,inset 0 -4px 7px #0a142c55,0 14px 30px #02091c88}.k-dock-scroll{display:flex;gap:3px;min-width:0;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none}.k-dock-scroll::-webkit-scrollbar{display:none}.k-dock button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex-shrink:0;min-width:76px;height:54px;padding:0 8px;border-radius:18px;border:1px solid transparent;background:transparent;color:#dce8f5;cursor:pointer;scroll-snap-align:center;transition:background .2s,color .2s}.k-dock button span{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}.k-dock button:hover:not(.selected){background:#ffffff12}.k-dock button.selected{color:#effaff;background:linear-gradient(145deg,var(--k-ice),#3983b52e);border-color:var(--k-ice-border);box-shadow:inset 0 1px 2px #ffffff30}.k-dock-sep{width:1px;height:34px;margin:0 5px;flex-shrink:0;background:#eff8ff38}.k-dock button.k-dock-settings{min-width:48px;width:48px}.k-app[data-bp=sm] .k-dock button{min-width:66px;height:50px}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}', Ko = '.tw-mount{height:100%}.tw-app{--panel-w: 440px;position:relative;height:100%;min-height:100vh;overflow:hidden;color:#f4f6fa;font-family:var(--k-font);-webkit-font-smoothing:antialiased;touch-action:manipulation}.tw-backdrop{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 45%,#0a1630,#050d1f 55%,#020814);transition:background 1.2s ease}.tw-app[data-tod=day] .tw-backdrop{background:radial-gradient(ellipse 70% 60% at 45% 45%,#8d98a8,#77869a 55%,#5d6e84)}.tw-stage{position:absolute;inset:0;overflow:hidden}.tw-scene{position:absolute;transform-origin:0 0;transition:transform .75s cubic-bezier(.2,.8,.2,1)}.tw-base,.tw-night,.tw-lit{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;user-select:none;-webkit-user-select:none;pointer-events:none;-webkit-mask-image:radial-gradient(ellipse 62% 66% at 50% 47%,#000 72%,transparent 100%);mask-image:radial-gradient(ellipse 62% 66% at 50% 47%,#000 72%,transparent 100%)}.tw-night{transition:opacity 4s ease}.tw-lit{opacity:0;transition:opacity .9s ease}.tw-lit.on{opacity:var(--dark, 1)}.tw-daylight.on{opacity:calc(1 - var(--dark, 0))}.tw-daylight{position:absolute;width:16%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;background:radial-gradient(circle,#ffd08a80 0%,#ffc47a38 38%,transparent 70%);mix-blend-mode:screen;opacity:0;transition:opacity .9s ease}.tw-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}.tw-room{fill:transparent;stroke:transparent;stroke-width:1.5;vector-effect:non-scaling-stroke;pointer-events:all;cursor:pointer;transition:fill .3s,stroke .3s}@media(hover:hover){.tw-room:hover{fill:#ffffff0a;stroke:transparent}}.tw-room.selected{fill:#ffffff0d;stroke:transparent;stroke-width:0}.tw-room.heat{fill:var(--heat);fill-opacity:.4;stroke:var(--heat);stroke-opacity:.85}.tw-app[data-mode=heat] .tw-base,.tw-app[data-mode=heat] .tw-night,.tw-app[data-mode=heat] .tw-lit{filter:saturate(.55) brightness(.85)}.tw-flow path{fill:none;stroke-width:2.4;stroke-linecap:round;stroke-dasharray:3 9;vector-effect:non-scaling-stroke;animation:tw-flow 1.1s linear infinite}.tw-flow.heat path{stroke:#ffb066}.tw-flow.cool path{stroke:#9ff0ff}.tw-flow.dry path{stroke:#4fe0c8}.tw-flow.fan path{stroke:#dceaff}@keyframes tw-flow{to{stroke-dashoffset:-24}}.tw-pulse{fill:#ff465533;stroke:#ff5a64;stroke-width:2;vector-effect:non-scaling-stroke;transform-box:fill-box;transform-origin:center;animation:tw-pulse 1.8s ease-out infinite}.tw-pulse.late{animation-delay:.9s}@keyframes tw-pulse{0%{transform:scale(.4);opacity:1}to{transform:scale(2.6);opacity:0}}.tw-layer{position:absolute;inset:0;pointer-events:none}.tw-hot{position:absolute;display:flex;align-items:center;gap:5px;padding:0;border:none;background:none;color:inherit;cursor:pointer;pointer-events:auto;transform:translate(-14px,-50%) scale(calc(1 / var(--zoom, 1)));transform-origin:14px 50%;transition:transform .75s cubic-bezier(.2,.8,.2,1)}.tw-hot-dot{display:grid;place-items:center;width:28px;height:28px;flex-shrink:0;border-radius:50%;color:#dce8f5;background:#0b1526c4;border:1px solid #edf6ff40;box-shadow:0 3px 10px #0008}.tw-hot-dot .k-icon{width:16px;height:16px;--mdc-icon-size: 16px}.tw-zoomed .tw-hot-dot,.tw-app.zoomed .tw-hot-dot{width:34px;height:34px}.tw-hot.light.on .tw-hot-dot{color:#2a1a05;background:radial-gradient(circle at 40% 35%,#fff1cf,#ffc46a);border-color:#ffe3a8;box-shadow:0 0 16px #ffc46aaa,0 3px 10px #0008}.tw-hot.climate.heat .tw-hot-dot{color:#ffd2a3;border-color:#ffae62;box-shadow:0 0 14px #ffae6288}.tw-hot.climate.cool .tw-hot-dot{color:#c9f6ff;border-color:#8debff;box-shadow:0 0 14px #8debff88}.tw-hot.climate.dry .tw-hot-dot,.tw-hot.climate.fan .tw-hot-dot{border-color:#4fe0c8}.tw-hot.media.on .tw-hot-dot,.tw-hot.air.on .tw-hot-dot,.tw-hot.fan.on .tw-hot-dot,.tw-hot.appliance.on .tw-hot-dot{color:#c9f6ff;border-color:#8debff;box-shadow:0 0 12px #61ddff77}.tw-hot.fan.on .k-icon,.tw-hot.appliance.on .k-icon{animation:tw-spin 2.4s linear infinite}@keyframes tw-spin{to{transform:rotate(360deg)}}.tw-hot.warn .tw-hot-dot{color:#2a1a05;background:#ffc46a;border-color:#ffe3a8}.tw-hot.alarm .tw-hot-dot{color:#fff;background:#e5323f;border-color:#ffb0b5;box-shadow:0 0 18px #ff4655}.tw-hot.ok .tw-hot-dot{color:#7ff0b5;border-color:#4be39a88}.tw-app[data-mode=energy] .tw-base,.tw-app[data-mode=energy] .tw-night{filter:brightness(.62) saturate(.6);transition:filter .6s ease}.tw-power{--c: #6fdcff}.tw-wire.light{--c: #ffd27a}.tw-wire.heat{--c: #ffa24d}.tw-wire.cool{--c: #7cc8ff}.tw-wire.appliance{--c: #5fe3ff}.tw-wire.media{--c: #b9a0ff}.tw-wire.air{--c: #7ff0c0}.tw-wire path{fill:none;stroke:var(--c);vector-effect:non-scaling-stroke;stroke-linecap:round}.tw-wire-glow{opacity:.3}.tw-wire-flow{opacity:.95;stroke-dasharray:2.5 25;animation:tw-current 4.2s linear infinite}.tw-wire.measured .tw-wire-flow{opacity:.95;stroke-dasharray:3 18;filter:drop-shadow(0 0 2px var(--c))}.tw-wire.measured .tw-wire-glow{opacity:.22;filter:blur(1.5px)}.tw-wire.picked .tw-wire-glow{opacity:.6}.tw-wire-hit{stroke:transparent!important;stroke-width:32!important;pointer-events:stroke;cursor:pointer;-webkit-tap-highlight-color:transparent}.tw-wire-end{fill:var(--c);opacity:.85;transform-box:fill-box;transform-origin:center;pointer-events:none;animation:tw-consume 4.2s ease-in-out infinite}.tw-wire-endhit{fill:transparent;pointer-events:all;cursor:pointer;-webkit-tap-highlight-color:transparent}.tw-meter-ring{fill:#ffd27a22;stroke:#ffd27a;stroke-width:1.6;vector-effect:non-scaling-stroke}.tw-meter-load{fill:#ffd27a14;stroke:#ffd27a99;stroke-width:1.4;vector-effect:non-scaling-stroke;transition:r 1.2s ease;animation:tw-load 5s ease-in-out infinite}.tw-meter-load.over{stroke:#ffb35c;fill:#ffb35c22}.tw-meter-scale{fill:none;stroke:#ffd27a40;stroke-width:1;stroke-dasharray:2 4;vector-effect:non-scaling-stroke}@keyframes tw-current{to{stroke-dashoffset:-27.5}}@keyframes tw-consume{50%{transform:scale(1.25);opacity:.6}}@keyframes tw-load{50%{opacity:.65}}.tw-powercard{position:absolute;transform:translate(-50%,calc(-100% - 14px));min-width:210px;max-width:260px;padding:12px 14px;border-radius:16px;background:#0c1828f0;border:1px solid #ffffff22;box-shadow:0 12px 30px #0008;color:#e9f3ff;font-size:calc(12px / var(--zoom, 1));pointer-events:auto;z-index:5}.tw-powercard header{display:flex;justify-content:space-between;align-items:start;gap:8px}.tw-powercard header small{display:block;opacity:.6;font-size:.8em;letter-spacing:.04em;text-transform:uppercase}.tw-powercard header b{font-size:1.15em}.tw-powercard header button{background:none;border:0;color:inherit;opacity:.6;cursor:pointer;font-size:1em}.tw-powercard-watts{margin:8px 0 6px;padding:7px 9px;border-radius:10px;background:#ffffff0d;display:grid;gap:2px}.tw-powercard-watts b{font-size:1.05em}.tw-powercard-watts span{opacity:.65;font-size:.85em;line-height:1.35}.tw-powercard-watts.measured b{font-size:1.4em;color:#ffd27a;font-variant-numeric:tabular-nums}.tw-powercard p{margin:4px 0;opacity:.85}.tw-powercard ul{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:3px}.tw-powercard li{display:flex;justify-content:space-between;gap:10px;font-size:.92em}.tw-powercard li em{font-style:normal;opacity:.7}.tw-powercard-since{display:block;margin-top:6px;opacity:.6;line-height:1.35}.tw-powercard-since i{display:block;font-style:normal;margin-top:2px;color:#ffd29e;opacity:.9}.tw-app[data-tod=night] .tw-lit.on{opacity:calc(var(--dark, 1) * .8)}.tw-app[data-tod=night][data-mode=energy] .tw-base,.tw-app[data-tod=night][data-mode=energy] .tw-night{filter:brightness(.7) saturate(.55)}.tw-app[data-tod=night] .tw-wire-flow{opacity:.7;filter:none}.tw-app[data-tod=night] .tw-wire-glow{opacity:.18;filter:none}.tw-app[data-tod=night] .tw-meter{box-shadow:0 6px 16px #0006;border-color:#ffd27a55}.tw-app[data-calm=true] .tw-portal-go,.tw-app[data-calm=true] .tw-wire-flow,.tw-app[data-calm=true] .tw-wire-end,.tw-app[data-calm=true] .tw-meter-load,.tw-app[data-calm=true] .tw-flow path,.tw-app[data-calm=true] .tw-hot.fan.on .k-icon,.tw-app[data-calm=true] .tw-hot.appliance.on .k-icon{animation:none}.tw-app[data-calm=true] .tw-particles i{animation:none;opacity:.8}.tw-meter{position:absolute;transform:translate(16px,-50%);display:grid;grid-template-columns:auto auto;align-items:center;column-gap:6px;padding:6px 10px;border-radius:12px;background:#0d1a2bd9;border:1px solid #ffd27a88;box-shadow:0 0 12px #ffd27a22,0 6px 16px #0006;color:#fff2d6;white-space:nowrap;pointer-events:none;font-size:calc(12px / var(--zoom, 1))}.tw-meter .k-icon,.tw-meter ha-icon{grid-row:1 / 3;color:#ffd27a;--mdc-icon-size: 18px;width:18px;height:18px}.tw-meter b{font-size:1.15em;font-variant-numeric:tabular-nums}.tw-meter small{opacity:.7;font-size:.8em}@media(prefers-reduced-motion:reduce){.tw-wire-flow,.tw-wire-end,.tw-meter-load{animation:none}}.tw-hot.offline .tw-hot-dot{color:#2a1a05;background:#ffbe6e;border-color:#ffe0b0;box-shadow:0 0 #ffbe6e88;animation:tw-offline 2.4s ease-in-out infinite}.tw-hot.offline .tw-chip{color:#ffe0b0;border-color:#ffbe6e88}@keyframes tw-offline{50%{box-shadow:0 0 0 7px #ffbe6e00,0 0 16px #ffbe6e66}}@media(prefers-reduced-motion:reduce){.tw-hot.offline .tw-hot-dot{animation:none}}.tw-chip{padding:3px 8px;border-radius:10px;font-size:11.5px;font-weight:650;white-space:nowrap;color:#f4f8ff;background:#0b1526d9;border:1px solid #edf6ff2e;box-shadow:0 3px 10px #0007;font-variant-numeric:tabular-nums}.tw-chip i{font-style:normal;font-weight:500;color:#c8d6e6}.tw-hot.climate.heat .tw-chip i{color:#ffc58d}.tw-hot.climate.cool .tw-chip i{color:#a8efff}.tw-label{position:absolute;display:flex;align-items:center;gap:6px;transform:translate(-50%,-100%) scale(calc(1 / var(--zoom, 1)));transform-origin:50% 100%;pointer-events:none;white-space:nowrap;transition:transform .75s cubic-bezier(.2,.8,.2,1)}.tw-label b{font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#eaf2ffd9;text-shadow:0 1px 3px #000c,0 0 8px #000a}.tw-app[data-tod=day] .tw-label b{color:#fff;text-shadow:0 1px 3px #000a}.tw-label em{display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:9px;font-style:normal;font-size:11px;font-weight:650;color:#fff;background:#0b1526cc;border:1px solid #edf6ff2a;font-variant-numeric:tabular-nums}.tw-label em:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--heat, #8debff);box-shadow:0 0 6px var(--heat, #8debff)}.tw-label em.lit:before{background:#ffc46a;box-shadow:0 0 6px #ffc46a}.tw-label.heat em{font-size:13px;padding:3px 10px}.tw-screen{position:absolute;width:9%;aspect-ratio:1.6;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;background:radial-gradient(ellipse,#6fc8ff55 0%,#4b8dff22 45%,transparent 70%)}.tw-particles{position:absolute;width:0;height:0;pointer-events:none}.tw-particles i{position:absolute;left:-2px;top:-10px;width:4px;height:4px;border-radius:50%;background:#bff6ff;box-shadow:0 0 6px #8debff;animation:tw-rise 2.6s ease-out infinite}.tw-particles i:nth-child(2){left:6px;animation-delay:.9s}.tw-particles i:nth-child(3){left:-9px;animation-delay:1.7s}@keyframes tw-rise{0%{transform:translateY(0);opacity:.9}to{transform:translateY(-34px);opacity:0}}.tw-motion{position:absolute;width:22px;height:22px;transform:translate(-50%,-50%) scale(calc(1 / var(--zoom, 1)));border-radius:50%;border:2px solid #8debff55;pointer-events:none}.tw-motion.on{border-color:#8debff;box-shadow:0 0 12px #8debff88}.tw-hud{position:absolute;left:0;right:0;top:0;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:16px 24px 28px;pointer-events:none;background:linear-gradient(180deg,#020814cc,#02081400)}.tw-app[data-tod=day] .tw-hud{background:linear-gradient(180deg,#3a4a5fb3,#3a4a5f00)}.tw-hud>*{pointer-events:auto}.tw-hud-brand{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;min-width:0}.tw-hud-kicker{display:block;width:100%;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#8debff}.tw-hud-time{font-size:34px;font-weight:300;letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}.tw-hud-date{font-size:13px;color:#dce8f5cc}.tw-hud-date:first-letter{text-transform:uppercase}.tw-hud-chips{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px}.tw-pill{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 14px 0 11px;border-radius:14px;font-size:13px;color:#eef4fb;background:#0b1526cc;border:1px solid #edf6ff26;box-shadow:0 6px 18px #0006}.tw-pill .k-icon{width:18px;height:18px;--mdc-icon-size: 18px;color:#8debff}.tw-pill small{font-size:12px;color:#c8d6e6}.tw-pill.energy .k-icon{color:#df75ff}.tw-pill.alert{background:#8c1d27e6;border-color:#ff8a92}.tw-pill.alert .k-icon{color:#fff}.tw-pill.warn .k-icon{color:#ffc46a}.tw-pill.subtle{background:#0b152699}.tw-banner{position:absolute;left:50%;bottom:110px;transform:translate(-50%);display:flex;align-items:center;gap:10px;max-width:calc(100% - 32px);padding:10px 18px 10px 14px;border-radius:16px;font-size:13px;color:#fff;cursor:pointer;background:#a8222ef2;border:1px solid #ffa0a7;box-shadow:0 10px 30px #ff2a3a55}.tw-banner .k-icon{width:20px;height:20px}.tw-banner span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#ffe2e4}.tw-modes{position:absolute;left:50%;bottom:18px;transform:translate(-50%);display:flex;gap:6px;padding:6px;border-radius:22px;background:#0b1526de;border:1px solid #edf6ff2a;box-shadow:0 14px 34px #0009;transition:left .5s ease}.tw-mode{display:flex;align-items:center;gap:8px;height:46px;padding:0 18px 0 14px;border-radius:16px;border:1px solid transparent;background:transparent;color:#dce8f5;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}.tw-mode .k-icon{width:18px;height:18px;--mdc-icon-size: 18px}@media(hover:hover){.tw-mode:hover:not(.selected){background:#ffffff10}}.tw-mode.selected{color:#effaff;background:linear-gradient(145deg,#42bdf855,#3983b538);border-color:#8debff66}.tw-panel{position:absolute;right:14px;top:84px;bottom:14px;width:var(--panel-w);display:flex;flex-direction:column;border-radius:26px;background:#0a1324f2;border:1px solid #edf6ff2e;box-shadow:0 24px 60px #000a;overflow:hidden;animation:tw-panel-in .35s cubic-bezier(.2,.8,.2,1)}@keyframes tw-panel-in{0%{transform:translate(24px);opacity:0}}.tw-panel.sheet{inset:40% 0 0;width:auto;border-radius:24px 24px 0 0;background:#0a1324;animation-name:tw-sheet-in}@keyframes tw-sheet-in{0%{transform:translateY(40px);opacity:0}}.tw-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:18px 18px 12px;border-bottom:1px solid #edf6ff14}.tw-panel-head h2{margin:2px 0 6px;font-size:26px;font-weight:650;letter-spacing:-.02em}.tw-panel-meta{display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:#dce8f5d9}.tw-panel-meta span{display:inline-flex;align-items:center;gap:4px}.tw-panel-meta .k-icon{width:15px;height:15px;--mdc-icon-size: 15px;color:#8debff}.tw-panel-actions{display:flex;gap:6px;flex-shrink:0}.tw-action{display:inline-flex;align-items:center;gap:6px;height:40px;padding:0 12px;border-radius:13px;border:1px solid #edf6ff2e;background:#ffffff0d;color:#eef4fb;font-size:12.5px;font-weight:600;cursor:pointer}.tw-action.on{color:#2a1a05;background:linear-gradient(145deg,#ffe0a6,#ffc46a);border-color:#ffe3a8}.tw-action.close{width:40px;justify-content:center;padding:0}.tw-action .k-icon{width:18px;height:18px;--mdc-icon-size: 18px}.tw-panel-alarm{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 14px 0;padding:10px 12px;border-radius:14px;font-size:13px;color:#fff;background:#a8222ee6}.tw-panel-body{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:14px;scrollbar-width:thin}.tw-portal{position:relative;display:block;width:100%;aspect-ratio:16 / 7;margin:0 0 12px;padding:0;border:1px solid #edf6ff2e;border-radius:20px;overflow:hidden;background:#142238;color:#fff;text-align:left;cursor:pointer;box-shadow:0 10px 26px #0007}.tw-portal.small{aspect-ratio:auto;height:74px;border-radius:16px}.tw-portal img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.04);transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}.tw-portal:hover img,.tw-portal:focus-visible img{transform:scale(1.12)}.tw-portal:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,#050b16e0)}.tw-portal.small:after{background:linear-gradient(90deg,#050b16e6 20%,#050b1640)}.tw-portal-text{position:absolute;left:16px;right:64px;bottom:13px;z-index:1;display:flex;flex-direction:column;gap:2px}.tw-portal.small .tw-portal-text{bottom:auto;top:50%;transform:translateY(-50%)}.tw-portal-text b{font-size:17px;font-weight:650;letter-spacing:-.01em;text-shadow:0 2px 10px #000a}.tw-portal-go{position:absolute;right:12px;bottom:12px;z-index:1;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#8debff;color:#04202b;box-shadow:0 0 #8debff88;transition:transform .3s;animation:tw-portal-pulse 2.6s ease-out infinite}.tw-portal.small .tw-portal-go{top:50%;bottom:auto;width:34px;height:34px;margin-top:-17px;animation:none;background:#ffffffe6}.tw-portal:hover .tw-portal-go{transform:translate(3px)}.tw-portal-go .k-icon{width:20px;height:20px;--mdc-icon-size: 20px}@keyframes tw-portal-pulse{70%{box-shadow:0 0 0 12px #8debff00}to{box-shadow:0 0 #8debff00}}.tw-tiles.k-app{position:static;height:auto;min-height:0;overflow:visible;background:transparent}.tw-panel .k-tile{backdrop-filter:none;-webkit-backdrop-filter:none;background:radial-gradient(ellipse at 15% 0%,#edf6ff2a,transparent 65%),linear-gradient(145deg,#4a5d74,#2f4157 55%,#223246)}.tw-panel .k-grid{--cols: 4;--gap: 12px}.tw-panel .k-canvas-head{display:none}.tw-app.phone .tw-hud{padding:12px 14px 22px}.tw-app.phone .tw-hud-time{font-size:26px}.tw-app.phone .tw-hud-kicker{font-size:9px}.tw-app.phone .tw-pill{height:32px;padding:0 10px 0 8px;font-size:12px}.tw-app.phone .tw-modes{left:8px;right:8px;bottom:10px;transform:none;justify-content:space-between}.tw-app.phone .tw-mode{flex:1 1 0;flex-direction:column;justify-content:center;gap:3px;height:50px;padding:0 4px;font-size:10px;min-width:0}.tw-app.phone .tw-mode span{max-width:100%;overflow:hidden;text-overflow:ellipsis}.tw-app.phone .tw-banner{bottom:86px}.tw-app.phone:not(.zoomed) .tw-hot:not(.alarm):not(.warn):not(.appliance){display:none}.tw-app.phone:not(.zoomed) .tw-hot .tw-chip{font-size:10px;padding:2px 6px}.tw-app.phone:not(.zoomed) .tw-label em{display:none}.tw-app.phone .tw-hot-dot{width:24px;height:24px}.tw-app.phone .tw-label b{font-size:9px}.tw-app.phone .tw-label em{font-size:10px;padding:1px 6px}.tw-roomlist{position:absolute;left:12px;right:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:58px;gap:8px;overflow-y:auto;padding-bottom:12px}.tw-roomcard{display:flex;flex-direction:column;justify-content:center;gap:4px;min-width:0;padding:8px 12px;border-radius:16px;border:1px solid #edf6ff26;background:#0b1526d9;color:#eef4fb;text-align:left;cursor:pointer}.tw-roomcard b{font-size:13px;font-weight:650}.tw-roomcard span{display:flex;align-items:center;gap:8px;font-size:12px;color:#c8d6e6}.tw-roomcard em{display:inline-flex;align-items:center;gap:5px;font-style:normal;font-variant-numeric:tabular-nums}.tw-roomcard em:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--heat)}.tw-roomcard .k-icon{width:15px;height:15px;--mdc-icon-size: 15px;color:#ffc46a}.tw-roomcard.alarm{border-color:#ff8a92;background:#5a1520e6}.tw-empty{position:absolute;left:50%;bottom:120px;transform:translate(-50%);display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 18px;border-radius:14px;font-size:13px;background:#0b1526d9}@media(prefers-reduced-motion:reduce){.tw-app *,.tw-app *:before,.tw-app *:after{animation:none!important;transition:none!important}}', Uo = [
  ["nextRace", /^sensor\.f1_(.+_)?next_race$/],
  ["season", /^sensor\.f1_(.+_)?current_season$/],
  ["seasonResults", /^sensor\.f1_(.+_)?season_results$/],
  ["lastRace", /^sensor\.f1_(.+_)?last_race_results$/],
  ["sprintResults", /^sensor\.f1_(.+_)?sprint_results$/],
  ["drivers", /^sensor\.f1_(.+_)?driver_standings$/],
  ["constructors", /^sensor\.f1_(.+_)?constructor_standings$/],
  ["session", /^sensor\.f1_(.+_)?current_session$/],
  ["sessionStatus", /^sensor\.f1_(.+_)?session_status$/],
  ["trackStatus", /^sensor\.f1_(.+_)?track_status$/],
  ["trackWeather", /^sensor\.f1_(.+_)?track_weather$/],
  ["raceWeather", /^sensor\.f1_(.+_)?weather$/, /track_weather$/],
  ["weather", /^weather\.f1_/],
  ["safetyCar", /^binary_sensor\.f1_(.+_)?safety_car$/],
  ["raceWeek", /^binary_sensor\.f1_(.+_)?race_week$/],
  ["lapCount", /^sensor\.f1_(.+_)?race_lap_count$/],
  ["remaining", /^sensor\.f1_(.+_)?session_time_remaining$/],
  ["positions", /^sensor\.f1_(.+_)?driver_positions$/],
  ["driverList", /^sensor\.f1_(.+_)?driver_list$/],
  ["tyres", /^sensor\.f1_(.+_)?current_tyres$/],
  ["pitStops", /^sensor\.f1_(.+_)?pit_stops$/],
  ["raceControl", /^sensor\.f1_(.+_)?race_control$/],
  ["p1", /^sensor\.f1_(.+_)?top_three_p1$/],
  ["p2", /^sensor\.f1_(.+_)?top_three_p2$/],
  ["p3", /^sensor\.f1_(.+_)?top_three_p3$/]
];
function Vo(e, t) {
  const r = Object.keys(e.states).sort(), n = {};
  for (const [a, o, i] of Uo) {
    const l = t?.[a], c = l && e.states[l] ? l : r.find((f) => o.test(f) && !(i && i.test(f)));
    c && (n[a] = c);
  }
  return n.nextRace || n.session || n.drivers ? n : void 0;
}
const Ge = (e) => !!e && !["unavailable", "unknown", "none", ""].includes(String(e.state).toLowerCase());
function We(e, ...t) {
  for (const r of t) {
    let n = e;
    for (const a of r.split(".")) n = n?.[a];
    if (n != null && n !== "") return n;
  }
}
function rt(e) {
  if (!e) return;
  const t = new Date(String(e));
  return Number.isNaN(t.getTime()) ? void 0 : t;
}
const qo = [
  ["first_practice", "FP1", 60],
  ["second_practice", "FP2", 60],
  ["third_practice", "FP3", 60],
  ["sprint_qualifying", "SQ", 45],
  ["sprint", "SPR", 60],
  ["qualifying", "Q", 60],
  ["race", "R", 120]
];
function Ka(e) {
  const t = e?.attributes;
  return t ? qo.flatMap(([r, n, a]) => {
    const o = rt(t[`${r}_start`] ?? t[`${r}_start_utc`]) ?? (n === "R" ? rt(e.state) : void 0);
    return o ? [{ code: n, start: o, end: new Date(o.getTime() + a * 6e4) }] : [];
  }).sort((r, n) => r.start.getTime() - n.start.getTime()) : [];
}
function xr(e) {
  const t = String(e ?? "").toLowerCase();
  if (!t) return;
  if (/sprint.*(quali|shoot)/.test(t)) return "SQ";
  if (/sprint/.test(t)) return "SPR";
  if (/quali/.test(t)) return "Q";
  if (/race|wyścig/.test(t)) return "R";
  const r = t.match(/(practice|trening|fp)\s*(\d)/);
  return r ? `FP${r[2]}` : void 0;
}
const Yo = /* @__PURE__ */ new Set(["live", "started", "suspended", "break", "aborted"]);
function Ua(e, t) {
  const r = String(t?.state ?? "").toLowerCase();
  if (Ge(t) && Yo.has(r)) return !0;
  const n = e?.attributes;
  return Ge(e) && (n?.active === !0 || /started|live/i.test(String(n?.live_status ?? ""))) && !["finished", "finalised", "ended"].includes(r);
}
const Vr = {
  mercedes: "#27f4d2",
  ferrari: "#e8002d",
  mclaren: "#ff8000",
  red_bull: "#3671c6",
  rb: "#6692ff",
  racing_bulls: "#6692ff",
  alpine: "#0093cc",
  haas: "#b6babd",
  audi: "#ff5a36",
  sauber: "#52e252",
  kick_sauber: "#52e252",
  williams: "#64c4ff",
  aston_martin: "#229971",
  cadillac: "#d4b36a"
}, qr = (e) => String(e ?? "").toLowerCase().replace(/\bf1 team\b|\bformula one team\b|\bteam\b/g, "").trim().replace(/[\s-]+/g, "_").replace(/^visa_cash_app_rb$|^rb_f1$|^racing_bulls.*$/, "rb").replace(/^red_bull_racing$/, "red_bull");
function An(e, t, r) {
  const n = String(r ?? "").replace(/^#/, "");
  return /^[0-9a-f]{6}$/i.test(n) ? `#${n}` : Vr[qr(e)] ?? Vr[qr(t)] ?? "#ff5a5a";
}
const Va = {
  albert_park: { km: 5.278, turns: 14, laps: 58 },
  shanghai: { km: 5.451, turns: 16, laps: 56 },
  suzuka: { km: 5.807, turns: 18, laps: 53 },
  bahrain: { km: 5.412, turns: 15, laps: 57 },
  jeddah: { km: 6.174, turns: 27, laps: 50 },
  miami: { km: 5.412, turns: 19, laps: 57 },
  villeneuve: { km: 4.361, turns: 14, laps: 70 },
  monaco: { km: 3.337, turns: 19, laps: 78 },
  catalunya: { km: 4.657, turns: 14, laps: 66 },
  red_bull_ring: { km: 4.318, turns: 10, laps: 71 },
  silverstone: { km: 5.891, turns: 18, laps: 52 },
  spa: { km: 7.004, turns: 19, laps: 44 },
  hungaroring: { km: 4.381, turns: 14, laps: 70 },
  zandvoort: { km: 4.259, turns: 14, laps: 72 },
  monza: { km: 5.793, turns: 11, laps: 53 },
  madring: { km: 5.416, turns: 22, laps: 57 },
  baku: { km: 6.003, turns: 20, laps: 51 },
  marina_bay: { km: 4.94, turns: 19, laps: 62 },
  americas: { km: 5.513, turns: 20, laps: 56 },
  rodriguez: { km: 4.304, turns: 17, laps: 71 },
  interlagos: { km: 4.309, turns: 15, laps: 71 },
  vegas: { km: 6.201, turns: 17, laps: 50 },
  losail: { km: 5.419, turns: 16, laps: 57 },
  yas_marina: { km: 5.281, turns: 16, laps: 58 },
  imola: { km: 4.909, turns: 19, laps: 63 }
}, Zo = (e) => Va[String(e ?? "")], Qo = (e) => String(e ?? "") in Va, Xo = {
  usa: "us",
  "united states": "us",
  uk: "gb",
  "united kingdom": "gb",
  britain: "gb",
  "great britain": "gb",
  italy: "it",
  netherlands: "nl",
  spain: "es",
  azerbaijan: "az",
  bahrain: "bh",
  malaysia: "my",
  singapore: "sg",
  japan: "jp",
  china: "cn",
  australia: "au",
  monaco: "mc",
  canada: "ca",
  austria: "at",
  belgium: "be",
  hungary: "hu",
  mexico: "mx",
  brazil: "br",
  qatar: "qa",
  "saudi arabia": "sa",
  uae: "ae",
  "united arab emirates": "ae",
  france: "fr",
  germany: "de",
  portugal: "pt"
};
function qa(e, t) {
  const r = String(e ?? "").trim().toLowerCase();
  return /^[a-z]{2}$/.test(r) ? r : Xo[String(t ?? "").trim().toLowerCase()];
}
const wr = (e) => e.Constructor ?? (Object.prototype.hasOwnProperty.call(e, "constructor") ? e.constructor : void 0) ?? {}, Se = (e) => {
  const t = Number(e);
  return Number.isFinite(t) ? t : 0;
};
function Jo(e) {
  const t = e?.attributes?.driver_standings;
  return Array.isArray(t) ? t.map((r, n) => {
    const a = r.Driver ?? r.driver ?? {}, o = (r.Constructors ?? r.constructors)?.[0] ?? wr(r), i = a.familyName ?? a.family_name ?? r.name ?? "";
    return {
      pos: Se(r.position ?? n + 1),
      code: String(a.code ?? r.code ?? i.slice(0, 3).toUpperCase()),
      name: [a.givenName, i].filter(Boolean).join(" ") || String(r.name ?? "—"),
      team: o.name ?? r.team,
      color: An(o.constructorId ?? o.constructor_id, o.name ?? r.team, r.team_color),
      points: Se(r.points),
      wins: Se(r.wins)
    };
  }) : [];
}
function es(e) {
  const t = e?.attributes?.constructor_standings;
  return Array.isArray(t) ? t.map((r, n) => {
    const a = wr(r), o = String(a.name ?? r.name ?? "—").replace(/\s+F1 Team$/, "");
    return {
      pos: Se(r.position ?? n + 1),
      code: o.slice(0, 3).toUpperCase(),
      name: o,
      color: An(a.constructorId ?? a.constructor_id, a.name, r.team_color),
      points: Se(r.points),
      wins: Se(r.wins)
    };
  }) : [];
}
function kr(e) {
  return Array.isArray(e) ? e.map((t, r) => {
    const n = t.driver ?? t.Driver ?? {}, a = wr(t);
    return {
      pos: Se(t.position ?? r + 1),
      code: String(n.code ?? t.driver_code ?? "—"),
      name: [n.givenName, n.familyName].filter(Boolean).join(" ") || String(t.driver_name ?? "—"),
      team: a.name ?? t.constructor_name,
      color: An(a.constructorId ?? t.constructor_id, a.name ?? t.constructor_name),
      grid: t.grid !== void 0 ? Se(t.grid) : void 0,
      time: t.time?.time ?? t.Time?.time ?? (typeof t.time == "string" ? t.time : void 0),
      status: t.status,
      points: t.points !== void 0 ? Se(t.points) : void 0
    };
  }) : [];
}
function ts(e, t) {
  const r = e?.attributes?.races;
  if (!Array.isArray(r)) return [];
  const n = /* @__PURE__ */ new Map();
  for (const a of t?.attributes?.races ?? []) {
    const o = kr(a.results).find((i) => i.pos === 1);
    o && n.set(Se(a.round), o);
  }
  return r.map((a, o) => {
    const i = Se(a.round ?? o + 1);
    return {
      round: i,
      name: String(a.raceName ?? a.race_name ?? `R${i}`),
      date: rt(a.time ? `${a.date}T${a.time}` : a.date),
      country: qa(a.country_code, a.Circuit?.Location?.country),
      flag: a.country_flag_url,
      sprint: !!(a.Sprint ?? a.sprint),
      circuit: a.Circuit?.circuitId,
      winner: n.get(i)
    };
  });
}
function cr(e) {
  const t = {};
  for (const [r, n] of Object.entries(e))
    n && typeof n == "object" && !Array.isArray(n) ? Object.assign(t, cr(n), { [r]: n }) : t[r] = n;
  return t;
}
function on(e) {
  const t = /* @__PURE__ */ new Map(), r = e?.attributes;
  if (!r || !Ge(e)) return t;
  for (const n of Object.values(r)) {
    if (Array.isArray(n) && n.length && typeof n[0] == "object") {
      n.forEach((a, o) => {
        const i = cr(a);
        t.set(String(i.racing_number ?? i.driver_number ?? i.number ?? i.RacingNumber ?? o), i);
      });
      break;
    }
    if (n && typeof n == "object" && !Array.isArray(n)) {
      const a = Object.entries(n).filter(([, o]) => o && typeof o == "object");
      if (a.length >= 3) {
        for (const [o, i] of a) t.set(String(i.racing_number ?? o), cr(i));
        break;
      }
    }
  }
  return t;
}
const mt = (e) => e == null || e === "" ? void 0 : String(e);
function ns(e, t) {
  const r = on(t[e.positions ?? ""]);
  if (!r.size) return [];
  const n = on(t[e.driverList ?? ""]), a = on(t[e.tyres ?? ""]), o = on(t[e.pitStops ?? ""]);
  return [...r.entries()].map(([i, l]) => {
    const c = { ...n.get(i), ...l }, f = a.get(i) ?? {}, g = o.get(i) ?? {}, p = g.count ?? g.pit_count ?? g.total ?? (Array.isArray(g.stops) ? g.stops.length : void 0);
    return {
      num: i,
      pos: Se(c.position ?? c.pos ?? c.Position),
      code: String(c.tla ?? c.code ?? c.abbreviation ?? c.Tla ?? c.last_name ?? c.name ?? i),
      team: c.team ?? c.team_name ?? c.TeamName,
      color: An(void 0, c.team ?? c.team_name ?? c.TeamName, c.team_color ?? c.team_colour ?? c.TeamColour),
      gap: mt(c.gap_to_leader ?? c.gap ?? c.GapToLeader ?? c.time),
      interval: mt(c.interval ?? c.interval_to_ahead ?? c.IntervalToPositionAhead),
      lastLap: mt(c.last_lap ?? c.last_lap_time ?? c.LastLapTime),
      tyre: mt(f.compound ?? c.compound ?? c.tyre ?? c.Compound)?.toUpperCase(),
      tyreAge: f.tyre_age ?? f.age ?? f.laps ?? f.stint_laps ?? c.tyre_age,
      pits: p !== void 0 ? Se(p) : void 0,
      inPit: !!(c.in_pit ?? c.InPit ?? c.pit),
      out: !!(c.retired ?? c.Retired ?? c.stopped ?? c.dnf)
    };
  }).filter((i) => i.pos > 0).sort((i, l) => i.pos - l.pos);
}
function rs(e) {
  if (!e || !Ge(e)) return [];
  const t = e.attributes ?? {};
  return (Object.values(t).find((a) => Array.isArray(a) && a.length && typeof a[0] == "object" && ("message" in a[0] || "Message" in a[0])) ?? [{ message: t.message ?? e.state, flag: t.flag, lap: t.lap, utc: t.utc ?? t.date }]).map((a) => ({ text: String(a.message ?? a.Message ?? ""), flag: mt(a.flag ?? a.Flag), lap: mt(a.lap ?? a.Lap), at: rt(a.utc ?? a.Utc ?? a.date) })).filter((a) => a.text).sort((a, o) => (o.at?.getTime() ?? 0) - (a.at?.getTime() ?? 0)).slice(0, 6);
}
const Ya = {
  kicker: "Formuła 1",
  round: "Runda {n}",
  next: "Następny wyścig",
  untilSession: "Do sesji: {s}",
  untilRace: "Wyścig za {t}",
  liveNow: "Teraz na żywo",
  days: "dni",
  hours: "godz.",
  minutes: "min",
  seconds: "sek",
  raceWeek: "Tydzień wyścigowy",
  safetyCar: "Samochód bezpieczeństwa",
  weekend: "Weekend",
  schedule: "Harmonogram",
  done: "Zakończona",
  live: "Na żywo",
  upNext: "Następna",
  circuit: "Tor",
  length: "Długość",
  laps: "Okrążenia",
  turns: "Zakręty",
  held: "Edycje tutaj",
  firstGp: "Pierwsze GP",
  dnf: "DNF · 5 ost.",
  poleWin: "Pole → wygrana",
  drivers: "Kierowcy",
  constructors: "Konstruktorzy",
  championship: "Mistrzostwa {s}",
  pts: "pkt",
  wins: "zw.",
  showAll: "Pokaż wszystkich ({n})",
  showTop: "Pokaż top 10",
  lastRace: "Ostatni wyścig",
  fromGrid: "start P{g}",
  history: "Historia toru",
  lastYear: "Podium {y}",
  mostWins: "Najwięcej zwycięstw",
  defending: "Obrońca tytułu",
  pole: "Pole {y}",
  calendar: "Kalendarz {s}",
  sprint: "Sprint",
  forecast: "Prognoza na wyścig",
  atTrack: "Na torze",
  air: "Powietrze",
  asphalt: "Asfalt",
  humidity: "Wilgotność",
  wind: "Wiatr",
  rain: "Opady",
  rainChance: "Szansa deszczu",
  grip: "Przyczepność",
  lap: "Okrążenie",
  remaining: "Pozostało",
  positions: "Pozycje",
  raceControl: "Dyrekcja wyścigu",
  noTiming: "Pozycje na żywo pojawią się, gdy live timing f1_sensor będzie online.",
  pits: "pit",
  noData: "Brak danych F1",
  flag: "Flaga",
  FP1: "Trening 1",
  FP2: "Trening 2",
  FP3: "Trening 3",
  SQ: "Kwalifikacje sprintu",
  SPR: "Sprint",
  Q: "Kwalifikacje",
  R: "Wyścig",
  CLEAR: "Tor czysty",
  YELLOW: "Żółta flaga",
  VSC: "Wirtualny SC",
  SC: "Safety car",
  RED: "Czerwona flaga",
  pre: "Przed sesją",
  started: "Na żywo",
  suspended: "Wstrzymana",
  break: "Przerwa",
  finished: "Zakończona",
  finalised: "Wyniki oficjalne",
  ended: "Zakończona",
  aborted: "Przerwana",
  normal: "normalna",
  low: "niska",
  high: "wysoka"
}, _n = {
  ...Ya,
  kicker: "Formula 1",
  round: "Round {n}",
  next: "Next Grand Prix",
  untilSession: "Until {s}",
  untilRace: "Race in {t}",
  liveNow: "Live now",
  days: "days",
  hours: "hrs",
  minutes: "min",
  seconds: "sec",
  raceWeek: "Race week",
  safetyCar: "Safety car",
  schedule: "Schedule",
  done: "Done",
  live: "Live",
  upNext: "Next",
  circuit: "Circuit",
  length: "Length",
  laps: "Laps",
  turns: "Turns",
  held: "Races here",
  firstGp: "First GP",
  dnf: "DNF · last 5",
  poleWin: "Pole → win",
  drivers: "Drivers",
  constructors: "Constructors",
  championship: "{s} championship",
  pts: "pts",
  wins: "W",
  showAll: "Show all ({n})",
  showTop: "Show top 10",
  lastRace: "Last race",
  fromGrid: "from P{g}",
  history: "Circuit history",
  lastYear: "{y} podium",
  mostWins: "Most wins",
  defending: "Defending winner",
  pole: "{y} pole",
  calendar: "{s} calendar",
  forecast: "Race forecast",
  atTrack: "At the track",
  air: "Air",
  asphalt: "Track",
  humidity: "Humidity",
  wind: "Wind",
  rain: "Rain",
  rainChance: "Rain chance",
  grip: "Grip",
  lap: "Lap",
  remaining: "Remaining",
  positions: "Positions",
  raceControl: "Race control",
  noTiming: "Live positions appear once f1_sensor live timing is online.",
  noData: "No F1 data",
  flag: "Flag",
  FP1: "Practice 1",
  FP2: "Practice 2",
  FP3: "Practice 3",
  SQ: "Sprint qualifying",
  Q: "Qualifying",
  R: "Race",
  CLEAR: "Track clear",
  YELLOW: "Yellow flag",
  VSC: "Virtual SC",
  RED: "Red flag",
  pre: "Pre-session",
  started: "Live",
  suspended: "Suspended",
  break: "Break",
  finished: "Finished",
  finalised: "Final",
  ended: "Ended",
  aborted: "Aborted",
  normal: "normal",
  low: "low",
  high: "high"
}, as = {
  ..._n,
  round: "Runde {n}",
  next: "Nächster Grand Prix",
  untilSession: "Bis {s}",
  untilRace: "Rennen in {t}",
  liveNow: "Jetzt live",
  days: "Tage",
  hours: "Std.",
  raceWeek: "Rennwoche",
  schedule: "Zeitplan",
  done: "Beendet",
  upNext: "Als Nächstes",
  circuit: "Strecke",
  length: "Länge",
  laps: "Runden",
  turns: "Kurven",
  held: "Rennen hier",
  drivers: "Fahrer",
  constructors: "Konstrukteure",
  championship: "WM {s}",
  pts: "Pkt.",
  wins: "S",
  showAll: "Alle zeigen ({n})",
  showTop: "Top 10 zeigen",
  lastRace: "Letztes Rennen",
  history: "Streckenhistorie",
  mostWins: "Meiste Siege",
  calendar: "Kalender {s}",
  forecast: "Rennprognose",
  atTrack: "An der Strecke",
  air: "Luft",
  asphalt: "Strecke",
  humidity: "Feuchte",
  rain: "Regen",
  rainChance: "Regenrisiko",
  lap: "Runde",
  remaining: "Verbleibend",
  positions: "Positionen",
  raceControl: "Rennleitung",
  FP1: "Training 1",
  FP2: "Training 2",
  FP3: "Training 3",
  SQ: "Sprint-Qualifying",
  R: "Rennen",
  CLEAR: "Strecke frei",
  YELLOW: "Gelbe Flagge",
  RED: "Rote Flagge",
  flag: "Flagge"
}, is = { pl: Ya, en: _n, de: as };
function os(e, t, r) {
  let a = (is[e] ?? _n)[t] ?? _n[t] ?? t;
  for (const [o, i] of Object.entries(r ?? {})) a = a.replace(`{${o}}`, String(i));
  return a;
}
const ss = /^sensor\.octopus_energy_electricity_(.+)_current_rate$/, ls = /^sensor\.octopus_energy_gas_(.+)_current_rate$/, cs = /^sensor\.(.+)_yesterday_s_usage$/, ds = /(dryer|suszar|tumble|trockner)/;
function yr(e, t) {
  const r = Object.fromEntries(Object.entries(t).filter(([, n]) => typeof n == "string" && e.states[n]));
  return Object.keys(r).length ? r : void 0;
}
function fs(e) {
  const t = Object.keys(e.states), r = t.map((f) => f.match(ss)).find((f) => f && !e.states[f[0]].attributes.is_export), n = t.map((f) => f.match(ls)).find(Boolean), a = t.map((f) => f.match(cs)).find(Boolean), o = r?.[1], i = n?.[1], l = a?.[1], c = {
    ...o && {
      elecRate: `sensor.octopus_energy_electricity_${o}_current_rate`,
      elecNext: `sensor.octopus_energy_electricity_${o}_next_rate`,
      elecCost: `sensor.octopus_energy_electricity_${o}_current_accumulative_cost`,
      elecUse: `sensor.octopus_energy_electricity_${o}_current_accumulative_consumption`,
      demand: `sensor.octopus_energy_electricity_${o}_current_demand`,
      ratesToday: `event.octopus_energy_electricity_${o}_current_day_rates`,
      ratesTomorrow: `event.octopus_energy_electricity_${o}_next_day_rates`
    },
    ...i && {
      gasRate: `sensor.octopus_energy_gas_${i}_current_rate`,
      gasCost: `sensor.octopus_energy_gas_${i}_current_accumulative_cost`,
      gasUse: `sensor.octopus_energy_gas_${i}_current_accumulative_consumption_kwh`
    },
    ...l && {
      waterUse: `sensor.${l}_yesterday_s_usage`,
      waterCost: `sensor.${l}_yesterday_s_water_cost`,
      waterReading: `sensor.${l}_latest_reading`
    }
  };
  return yr(e, c);
}
function Yr(e, t) {
  const r = Object.keys(e.states).find(
    (a) => /^sensor\..+_machine_status$/.test(a) && ds.test(a) === t
  );
  if (!r) return;
  const n = r.replace(/_machine_status$/, "");
  return yr(e, {
    status: r,
    phase: `${n}_current_program_phase`,
    remaining: `${n}_remaining_time_of_selected_program`,
    total: `${n}_selected_program_total_time`,
    program: `${n}_selected_program`,
    progress: `${n}_program_progress`,
    finish: `${n}_finish_time`
  });
}
function ps(e, t) {
  return t ? !!e.connection : !!(e.services?.glasshome_fuel?.search || e.services?.fuel_prices);
}
function us(e, t, r) {
  const n = (a) => a ? yr(e, a) : void 0;
  return {
    energy: n(t?.energy) ?? fs(e),
    washer: n(t?.laundry?.washer) ?? Yr(e, !1),
    dryer: n(t?.laundry?.dryer) ?? Yr(e, !0),
    fuel: ps(e, r),
    f1: Vo(e, t?.f1),
    climateExtras: t?.climateExtras
  };
}
const gs = (e, t) => /energ/i.test(`${e} ${t}`), hs = (e, t) => /(pralni|laundr|wasch)/i.test(`${e} ${t}`), Za = "paliwo";
var ms = /* @__PURE__ */ u('<svg class=k-icon viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=1.7 stroke-linecap=round stroke-linejoin=round aria-hidden=true>'), bs = /* @__PURE__ */ u("<svg><rect x=4 y=4 width=7 height=9 rx=2></svg>", !1, !0, !1), xs = /* @__PURE__ */ u("<svg><rect x=13 y=4 width=7 height=5 rx=2></svg>", !1, !0, !1), ws = /* @__PURE__ */ u("<svg><rect x=4 y=15 width=7 height=5 rx=2></svg>", !1, !0, !1), ks = /* @__PURE__ */ u("<svg><rect x=13 y=11 width=7 height=9 rx=2></svg>", !1, !0, !1), ys = /* @__PURE__ */ u('<svg><path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11"></svg>', !1, !0, !1), vs = /* @__PURE__ */ u('<svg><path d="M3.5 12.5a1.8 1.8 0 0 1 3.5-.5v2h10v-2a1.8 1.8 0 0 1 3.5.5V17H3.5z"></svg>', !1, !0, !1), _s = /* @__PURE__ */ u('<svg><path d="M6 17v2M18 17v2"></svg>', !1, !0, !1), $s = /* @__PURE__ */ u('<svg><path d="M4 10h16"></svg>', !1, !0, !1), zs = /* @__PURE__ */ u('<svg><path d="M6 10v8.5h12V10"></svg>', !1, !0, !1), Ss = /* @__PURE__ */ u('<svg><path d="M9 6.5c0-1 .8-2 2-2h2c1.2 0 2 1 2 2V10H9z"></svg>', !1, !0, !1), Cs = /* @__PURE__ */ u('<svg><path d="M10 14h4"></svg>', !1, !0, !1), Ts = /* @__PURE__ */ u('<svg><path d="M3.5 18V7"></svg>', !1, !0, !1), Ps = /* @__PURE__ */ u('<svg><path d="M3.5 13h17v5"></svg>', !1, !0, !1), Ms = /* @__PURE__ */ u('<svg><path d="M20.5 13v-1.5A2.5 2.5 0 0 0 18 9h-6.5v4"></svg>', !1, !0, !1), Es = /* @__PURE__ */ u("<svg><circle cx=7.5 cy=10.5 r=1.8></svg>", !1, !0, !1), Ls = /* @__PURE__ */ u("<svg><circle cx=12 cy=13 r=5.5></svg>", !1, !0, !1), As = /* @__PURE__ */ u("<svg><circle cx=7 cy=7.5 r=2></svg>", !1, !0, !1), Rs = /* @__PURE__ */ u("<svg><circle cx=17 cy=7.5 r=2></svg>", !1, !0, !1), Os = /* @__PURE__ */ u('<svg><path d="M10 14.5c1.2 1 2.8 1 4 0"></svg>', !1, !0, !1), Ns = /* @__PURE__ */ u("<svg><circle cx=10 cy=12 r=.6></svg>", !1, !0, !1), js = /* @__PURE__ */ u("<svg><circle cx=14 cy=12 r=.6></svg>", !1, !0, !1), Ds = /* @__PURE__ */ u('<svg><path d="M6 20V8a4 4 0 0 1 8 0"></svg>', !1, !0, !1), Ws = /* @__PURE__ */ u('<svg><path d="M11 9h6"></svg>', !1, !0, !1), Gs = /* @__PURE__ */ u('<svg><path d="M12 12.5v.5M15 12.5v.5M18 12.5v.5M13.5 15.5v.5M16.5 15.5v.5"></svg>', !1, !0, !1), Is = /* @__PURE__ */ u("<svg><rect x=5 y=3.5 width=14 height=17 rx=2.5></svg>", !1, !0, !1), Bs = /* @__PURE__ */ u("<svg><circle cx=12 cy=13 r=4></svg>", !1, !0, !1), Fs = /* @__PURE__ */ u('<svg><path d="M8 6.5h2"></svg>', !1, !0, !1), Hs = /* @__PURE__ */ u('<svg><path d="M13 3 6 13.5h5.5L10.5 21 18 10h-5.5z"></svg>', !1, !0, !1), Ks = /* @__PURE__ */ u('<svg><path d="M9 17.5h6M10 20.5h4"></svg>', !1, !0, !1), Us = /* @__PURE__ */ u('<svg><path d="M8.5 14.5A5.5 5.5 0 1 1 15.5 14.5c-.8.7-1 1.6-1 3h-5c0-1.4-.2-2.3-1-3z"></svg>', !1, !0, !1), Vs = /* @__PURE__ */ u('<svg><path d="M12 3.5 5 6v5.5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6z"></svg>', !1, !0, !1), qs = /* @__PURE__ */ u('<svg><path d="m9 12 2.2 2.2L15.5 10"></svg>', !1, !0, !1), Ys = /* @__PURE__ */ u('<svg><path d="M7.5 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17.5 9a4.5 4.5 0 0 1 0 9z"></svg>', !1, !0, !1), Zs = /* @__PURE__ */ u('<svg><path d="M9 18V6l10-2v12"></svg>', !1, !0, !1), Qs = /* @__PURE__ */ u("<svg><circle cx=6.5 cy=18 r=2.5></svg>", !1, !0, !1), Xs = /* @__PURE__ */ u("<svg><circle cx=16.5 cy=16 r=2.5></svg>", !1, !0, !1), Js = /* @__PURE__ */ u('<svg><path d="M5 21V4"></svg>', !1, !0, !1), el = /* @__PURE__ */ u('<svg><path d="M5 4.5h12l-2.5 4 2.5 4H5"></svg>', !1, !0, !1), tl = /* @__PURE__ */ u("<svg><circle cx=12 cy=12 r=4></svg>", !1, !0, !1), nl = /* @__PURE__ */ u('<svg><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"></svg>', !1, !0, !1), rl = /* @__PURE__ */ u('<svg><path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"></svg>', !1, !0, !1), al = /* @__PURE__ */ u('<svg><path d="M12 9v7"></svg>', !1, !0, !1), il = /* @__PURE__ */ u('<svg><path d="M5 7h9M18 7h1M5 17h1M10 17h9"></svg>', !1, !0, !1), ol = /* @__PURE__ */ u("<svg><circle cx=16 cy=7 r=2></svg>", !1, !0, !1), sl = /* @__PURE__ */ u("<svg><circle cx=8 cy=17 r=2></svg>", !1, !0, !1), ll = /* @__PURE__ */ u('<svg><path d="M6 20.5V4.5h12v16"></svg>', !1, !0, !1), cl = /* @__PURE__ */ u('<svg><path d="M4 20.5h16"></svg>', !1, !0, !1), dl = /* @__PURE__ */ u("<svg><circle cx=14.5 cy=12.5 r=.8></svg>", !1, !0, !1), fl = /* @__PURE__ */ u("<svg><circle cx=12 cy=12 r=1.8></svg>", !1, !0, !1), pl = /* @__PURE__ */ u('<svg><path d="M12 10.2C11 6 13 3.5 15.5 4.5S16 9.5 12 10.2zM13.8 12c4.2-1 6.7 1 5.7 3.5s-5 .5-5.7-3.5zM10.2 12c-4.2 1-6.7-1-5.7-3.5s5-.5 5.7 3.5zM12 13.8c1 4.2-1 6.7-3.5 5.7s-.5-5 3.5-5.7z"></svg>', !1, !0, !1), ul = /* @__PURE__ */ u('<svg><path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.6-1.8-.3-1.3.6-2.2 1.9-2.2H17a3.5 3.5 0 0 0 3.5-3.5c0-5.2-3.8-9.5-8.5-9.5z"></svg>', !1, !0, !1), gl = /* @__PURE__ */ u("<svg><circle cx=8 cy=11 r=1.1></svg>", !1, !0, !1), hl = /* @__PURE__ */ u("<svg><circle cx=11 cy=7.5 r=1.1></svg>", !1, !0, !1), ml = /* @__PURE__ */ u("<svg><circle cx=15.5 cy=8.5 r=1.1></svg>", !1, !0, !1), bl = /* @__PURE__ */ u("<svg><rect x=5 y=3.5 width=14 height=17 rx=1.5></svg>", !1, !0, !1), xl = /* @__PURE__ */ u('<svg><path d="M12 3.5v17M5 12h14"></svg>', !1, !0, !1), wl = /* @__PURE__ */ u("<svg><circle cx=12 cy=12 r=7.5></svg>", !1, !0, !1), kl = /* @__PURE__ */ u("<svg><circle cx=12 cy=12 r=2.5></svg>", !1, !0, !1), yl = /* @__PURE__ */ u('<svg><path d="M12 4.5v2M12 17.5v2"></svg>', !1, !0, !1), vl = /* @__PURE__ */ u('<svg><path d="M4 9.5 15 6l2 6-11 3.5z"></svg>', !1, !0, !1), _l = /* @__PURE__ */ u('<svg><path d="M17 9h3v3h-3"></svg>', !1, !0, !1), $l = /* @__PURE__ */ u('<svg><path d="M8 15.5V19H5"></svg>', !1, !0, !1), zl = /* @__PURE__ */ u('<svg><path d="M6 6v12M10 6v12M14 6v12M18 6v12"></svg>', !1, !0, !1), Sl = /* @__PURE__ */ u('<svg><path d="M4 18h16M4 7h16"></svg>', !1, !0, !1), Cl = /* @__PURE__ */ u('<svg><path d="M5.5 7h13M9 7V4.5h6V7"></svg>', !1, !0, !1), Tl = /* @__PURE__ */ u('<svg><path d="M7 7l1 13h8l1-13"></svg>', !1, !0, !1), Pl = /* @__PURE__ */ u('<svg><path d="M10.5 10.5v6M13.5 10.5v6"></svg>', !1, !0, !1), Ml = /* @__PURE__ */ u('<svg><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"></svg>', !1, !0, !1), El = /* @__PURE__ */ u('<svg><path d="M5 19 13 11"></svg>', !1, !0, !1), Ll = /* @__PURE__ */ u('<svg><path d="M12 21c-3.6 0-6-2.5-6-5.8 0-2.6 1.4-4.4 2.8-6 .2 1.6.9 2.7 2 3.3-.3-3.2.9-6 3.7-8.5.2 2.8 1.6 4.4 2.7 6 .9 1.3 1.8 2.8 1.8 5.2 0 3.3-2.4 5.8-7 5.8z"></svg>', !1, !0, !1), Al = /* @__PURE__ */ u('<svg><path d="M12 21c-1.6 0-2.7-1.1-2.7-2.6 0-1.4.9-2.4 2.2-3.6.4 1 1 1.6 1.8 1.9.1-.9.5-1.6 1.1-2.1.4 1 .8 1.8.8 2.9 0 2.1-1.4 3.5-3.2 3.5z"></svg>', !1, !0, !1), Rl = /* @__PURE__ */ u('<svg><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"></svg>', !1, !0, !1), Ol = /* @__PURE__ */ u('<svg><path d="M9.5 4.5 12 6l2.5-1.5M9.5 19.5 12 18l2.5 1.5"></svg>', !1, !0, !1), Nl = /* @__PURE__ */ u('<svg><path d="M12 3.5v8"></svg>', !1, !0, !1), jl = /* @__PURE__ */ u('<svg><path d="M7.2 6.5a7 7 0 1 0 9.6 0"></svg>', !1, !0, !1), Dl = /* @__PURE__ */ u('<svg><path d="M12 3.5c3.5 4.4 6 7.8 6 10.8a6 6 0 0 1-12 0c0-3 2.5-6.4 6-10.8z"></svg>', !1, !0, !1), Wl = /* @__PURE__ */ u('<svg><path d="M5 20.5V5a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 5v15.5"></svg>', !1, !0, !1), Gl = /* @__PURE__ */ u('<svg><path d="M3.5 20.5h12M7 7.5h5"></svg>', !1, !0, !1), Il = /* @__PURE__ */ u('<svg><path d="M14 10h2a1.5 1.5 0 0 1 1.5 1.5V16a1.3 1.3 0 0 0 2.5 0V8.5L17.5 6"></svg>', !1, !0, !1), Bl = /* @__PURE__ */ u('<svg><path d="M12 3.5 19 20l-7-3.5L5 20z"></svg>', !1, !0, !1), Fl = /* @__PURE__ */ u('<svg><path d="M4 20h16"></svg>', !1, !0, !1), Hl = /* @__PURE__ */ u('<svg><path d="M7 17v-5M11 17V8M15 17v-3M19 17V6"></svg>', !1, !0, !1), Kl = /* @__PURE__ */ u('<svg><path d="M5 7h14M5 12h14M5 17h14"></svg>', !1, !0, !1), Ul = /* @__PURE__ */ u("<svg><circle cx=12 cy=12 r=6.5></svg>", !1, !0, !1), Vl = /* @__PURE__ */ u("<svg><circle cx=12 cy=12 r=1.6></svg>", !1, !0, !1), ql = /* @__PURE__ */ u("<ha-icon class=k-icon>", !0, !1, !1);
function ee(e) {
  return (() => {
    var t = ms();
    return s(t, () => e.children), t;
  })();
}
const ne = (e, ...t) => t.some((r) => e.includes(r));
function Yl(e) {
  const t = () => e.name;
  return d(Ii, {
    get fallback() {
      return d(ee, {
        get children() {
          return [Ul(), Vl()];
        }
      });
    },
    get children() {
      return [d(te, {
        get when() {
          return ne(t(), "view-dashboard", "view-grid");
        },
        get children() {
          return d(ee, {
            get children() {
              return [bs(), xs(), ws(), ks()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "sofa");
        },
        get children() {
          return d(ee, {
            get children() {
              return [ys(), vs(), _s()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "countertop", "kitchen", "stove", "pot");
        },
        get children() {
          return d(ee, {
            get children() {
              return [$s(), zs(), Ss(), Cs()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "bed");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Ts(), Ps(), Ms(), Es()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "teddy", "baby", "child", "human-child");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Ls(), As(), Rs(), Os(), Ns(), js()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "shower", "bath");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Ds(), Ws(), Gs()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "washing", "tumble", "laundry");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Is(), Bs(), Fs()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "lightning", "flash", "bolt", "power-plug");
        },
        get children() {
          return d(ee, {
            get children() {
              return Hs();
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "lightbulb", "ceiling-light", "lamp", "led");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Ks(), Us()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "shield", "alarm", "security");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Vs(), qs()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "weather", "cloud");
        },
        get children() {
          return d(ee, {
            get children() {
              return Ys();
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "music", "speaker", "television", "cast", "play");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Zs(), Qs(), Xs()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "flag");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Js(), el()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "sunny", "white-balance");
        },
        get children() {
          return d(ee, {
            get children() {
              return [tl(), nl()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "thermometer", "thermostat", "heat");
        },
        get children() {
          return d(ee, {
            get children() {
              return [rl(), al()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "cog", "tune", "settings");
        },
        get children() {
          return d(ee, {
            get children() {
              return [il(), ol(), sl()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "door", "garage", "stairs", "toilet", "home");
        },
        get children() {
          return d(ee, {
            get children() {
              return [ll(), cl(), dl()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "air", "fan", "filter", "molecule");
        },
        get children() {
          return d(ee, {
            get children() {
              return [fl(), pl()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "palette");
        },
        get children() {
          return d(ee, {
            get children() {
              return [ul(), gl(), hl(), ml()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "window");
        },
        get children() {
          return d(ee, {
            get children() {
              return [bl(), xl()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "smoke");
        },
        get children() {
          return d(ee, {
            get children() {
              return [wl(), kl(), yl()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "motion", "cctv", "camera");
        },
        get children() {
          return d(ee, {
            get children() {
              return [vl(), _l(), $l()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "radiator");
        },
        get children() {
          return d(ee, {
            get children() {
              return [zl(), Sl()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "recycle", "trash");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Cl(), Tl(), Pl()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "leaf");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Ml(), El()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "fire", "flame");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Ll(), Al()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "snowflake");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Rl(), Ol()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "power");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Nl(), jl()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "water");
        },
        get children() {
          return d(ee, {
            get children() {
              return Dl();
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "gas-station", "fuel");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Wl(), Gl(), Il()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "navigation", "directions");
        },
        get children() {
          return d(ee, {
            get children() {
              return Bl();
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "chart", "timeline");
        },
        get children() {
          return d(ee, {
            get children() {
              return [Fl(), Hl()];
            }
          });
        }
      }), d(te, {
        get when() {
          return ne(t(), "menu");
        },
        get children() {
          return d(ee, {
            get children() {
              return Kl();
            }
          });
        }
      })];
    }
  });
}
function ie(e) {
  const t = () => e.icon ?? "mdi:circle-outline";
  return d(N, {
    get when() {
      return Xa();
    },
    get fallback() {
      return d(Yl, {
        get name() {
          return t();
        }
      });
    },
    get children() {
      var r = ql();
      return r._$owner = Ti(), W(() => r.icon = t()), r;
    }
  });
}
const Qa = typeof customElements < "u", [Xa, Zl] = J(Qa && !!customElements.get("ha-icon"));
Qa && !Xa() && customElements.whenDefined("ha-icon").then(() => Zl(!0));
let dr = {};
function Ql(e) {
  dr = e ?? {};
}
const Xl = [
  [/\bliving[\s_-]*room\b/gi, "Salon"],
  [/\bfamily[\s_-]*room\b/gi, "Salon"],
  [/\blounge\b/gi, "Salon"],
  [/\bkitchen\b/gi, "Kuchnia"],
  [/\bbedroom\b/gi, "Sypialnia"],
  [/\bbathroom\b/gi, "Łazienka"],
  [/\blazienka\b/gi, "Łazienka"],
  [/\bhallway\b|\bhall\b|\bcorridor\b/gi, "Korytarz"],
  [/\btoilet\b|\bkibelek\b|\bwc\b/gi, "WC"],
  [/\bgarage\b/gi, "Garaż"],
  [/\bstairs\b/gi, "Schody"],
  [/\boffice\b/gi, "Biuro"],
  [/\bfloor\b/gi, "podłoga"],
  [/\bpokoj\b/gi, "pokój"],
  [/\bsalon\b/gi, "Salon"],
  [/\bkuchnia\b/gi, "Kuchnia"],
  [/\bsypialnia\b/gi, "Sypialnia"],
  [/\bgabinet\b/gi, "Gabinet"],
  [/\bpralnia\b/gi, "Pralnia"],
  [/\bpralka\b/gi, "Pralka"],
  [/\bprysznic\b/gi, "Prysznic"],
  [/\bwashing[\s_-]*machine\b/gi, "Pralka"],
  [/\bdryer\b/gi, "Suszarka"],
  [/\bair[\s_-]*conditioner\b/gi, "Klimatyzacja"]
], Jl = [
  [/\bcore\s?\d{3}s?\b|\bvital\s?\d{3}s?\b/gi, "Oczyszczacz"],
  [/\bpm\s?2[\s.,_]?5\b/gi, "PM2.5"],
  [/\bpm\s?10\b/gi, "PM10"],
  [/\bfilter[\s_]*life(time)?\b/gi, "filtr"],
  [/\bair[\s_]*quality\b/gi, "jakość powietrza"],
  [/\bwater[\s_]*box[\s_]*full\b/gi, "pojemnik na wodę"],
  [/\bclean[\s_]*filter\b/gi, "filtr do czyszczenia"],
  [/\bdetergent(\s+state)?\b/gi, "detergent"],
  [/\bsoftener(\s+state)?\b/gi, "zmiękczacz"],
  [/\bdoor\b/gi, "drzwi"],
  [/\bwindow\b/gi, "okno"],
  [/\bself[\s_-]*test(\s+result)?\b/gi, "autotest"],
  [/\bnowy\b|\bnew\b/gi, ""]
], ec = [
  [/\bwater[\s_]*sensor\b|\bleak[\s_]*sensor\b/gi, "Czujnik zalania", []],
  [/\bczujnik[\s_]*co\b/gi, "Czujnik CO", ["co", "coLevel"]],
  [/\btemp(?:erature)?[\s_]*sensor\b|^temp\b/gi, "Termometr", ["temperature", "humidity"]],
  [/\bokno\b/gi, "Okno", []],
  [/\bsensor\b/gi, "Czujnik", ["presence"]]
], tc = /\s*\b(thermostat|termostat|temperature|temperatura|humidity|wilgotnosc|wilgotność|battery|bateria|moisture|water[\s_]*leak|contact|occupancy|presence|carbon[\s_]*monoxide)\s*$/i, nc = {
  sleep: "Tryb nocny",
  clean: "Czyszczenie",
  power: "Zasilanie",
  quick: "Szybkie karmienie",
  slow: "Wolne karmienie",
  manual: "Ręczne karmienie",
  status: "Status",
  "air conditioner": "Klimatyzacja"
}, rc = /\b(?=[a-z0-9-]*\d)(?=[a-z0-9-]*[a-z])[a-z0-9]+(?:-[a-z0-9]+)+\b|\b[a-z]{2,5}\d{3,}[a-z0-9]*\b|\b\d{2}[a-z]\b|\b[0-9a-f]{10,}\b|\b\d{3,}\b/gi, ac = {
  temperature: "Temperatura",
  humidity: "Wilgotność",
  battery: "Bateria",
  climate: "Termostat",
  co: "Alarm CO",
  coLevel: "Poziom CO"
};
function ic(e) {
  return e && e.charAt(0).toLocaleUpperCase("pl") + e.slice(1);
}
function fr(e, t = "generic") {
  if (!e) return "";
  const r = nc[e.trim().toLowerCase()];
  if (r) return r;
  let n = e.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  n = n.replace(/\s*\((plug|socket|gniazdko|relay|przekaźnik|r\d+)\)/gi, "");
  for (const [o, i] of Jl) n = n.replace(o, i);
  n = n.replace(rc, " ");
  let a = "";
  for (const [o, i, l] of ec)
    if (o.test(n)) {
      n = n.replace(o, " "), l.includes(t) || (a = i);
      break;
    }
  if (t !== "generic") for (let o = 0; o < 2; o++) n = n.replace(tc, "");
  (t === "co" || t === "coLevel") && (n = n.replace(/^\s*(alarm\s+)?co\s*$/i, ""));
  for (const [o, i] of Xl) n = n.replace(o, i);
  return n = n.replace(/\s+/g, " ").replace(/^[\s·,-]+|[\s·,-]+$/g, "").trim(), n = n.replace(/^podłoga\s+(\S+)$/i, "$1 podłoga"), a ? n = n ? `${a} · ${n}` : a : n = ic(n), n || ac[t] || e.trim();
}
function oc(e, t = e?.entity_id ?? "") {
  const r = t.split(".")[0], n = String(e?.attributes.device_class ?? "");
  return r === "climate" ? "climate" : n === "temperature" ? "temperature" : n === "humidity" ? "humidity" : n === "battery" ? "battery" : n === "moisture" ? "leak" : ["occupancy", "presence", "motion"].includes(n) ? "presence" : ["window", "opening", "door"].includes(n) ? "window" : n === "carbon_monoxide" ? r === "binary_sensor" ? "co" : "coLevel" : /_co_co$/.test(t) ? "coLevel" : /_battery$/.test(t) ? "battery" : /_temperature$|_temperatura$/.test(t) ? "temperature" : /_humidity$|_wilgotnosc$/.test(t) ? "humidity" : "generic";
}
function me(e, t, r, n) {
  if (dr[e]) return dr[e];
  const a = oc(t, e);
  if (r) return fr(r, a);
  const o = t?.attributes.friendly_name ? String(t.attributes.friendly_name) : e.split(".")[1] ?? e;
  return fr(o, a);
}
var sc = /* @__PURE__ */ u("<img class=k-roomcard-photo alt loading=lazy>", !0, !1, !1), lc = /* @__PURE__ */ u("<span> °C"), cc = /* @__PURE__ */ u("<span>%"), dc = /* @__PURE__ */ u('<button type=button class="k-tile k-roomcard"><span class=k-roomcard-shade></span><span class=k-roomcard-icon></span><span class=k-roomcard-arrow aria-hidden=true>↗</span><span class=k-roomcard-copy><b></b><span class=k-roomcard-metrics></span><small>'), fc = /* @__PURE__ */ u("<span class=k-roomcard-ambient>");
function pc(e) {
  let t = 0;
  for (const r of e) t = (t * 31 + r.charCodeAt(0)) % 360;
  return t;
}
re({
  type: "roomcard",
  sizes: {
    lg: {
      w: 4,
      h: 3
    },
    md: {
      w: 4,
      h: 3
    },
    sm: {
      w: 2,
      h: 3
    }
  },
  component: (e) => {
    const t = de(), {
      navigate: r
    } = pt(), n = ae(), a = () => e.config.room, [o, i] = J(!1), l = (g) => g ? q(t()?.states[g]?.state) : void 0, c = () => (a().entities ?? []).filter((g) => t()?.states[g]), f = () => c().filter((g) => t()?.states[g]?.state === "on").length;
    return (() => {
      var g = dc(), p = g.firstChild, x = p.nextSibling, b = x.nextSibling, k = b.nextSibling, m = k.firstChild, h = m.nextSibling, v = h.nextSibling;
      return g.$$click = () => a().page && r(a().page), s(g, d(N, {
        get when() {
          return F(() => !!a().image)() && !o();
        },
        get fallback() {
          return fc();
        },
        get children() {
          var S = sc();
          return S.addEventListener("error", () => i(!0)), L(S, "draggable", !1), W(() => L(S, "src", a().image)), S;
        }
      }), p), s(x, d(ie, {
        get icon() {
          return a().icon;
        }
      })), s(m, () => a().name), s(h, d(N, {
        get when() {
          return l(a().temperature) !== void 0;
        },
        get children() {
          var S = lc(), _ = S.firstChild;
          return s(S, () => V(l(a().temperature), 1, n.lang()), _), S;
        }
      }), null), s(h, d(N, {
        get when() {
          return l(a().humidity) !== void 0;
        },
        get children() {
          var S = cc(), _ = S.firstChild;
          return s(S, () => V(l(a().humidity), 0, n.lang()), _), S;
        }
      }), null), s(v, (() => {
        var S = F(() => !!c().length);
        return () => S() ? n("roomCount", {
          n: f(),
          m: c().length
        }) : a().detail ?? "";
      })()), W((S) => {
        var _ = String(pc(a().name)), $ = !a().page, C = `${n("openRoom")}: ${a().name}`;
        return _ !== S.e && H(g, "--room-hue", S.e = _), $ !== S.t && (g.disabled = S.t = $), C !== S.a && L(g, "aria-label", S.a = C), S;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), g;
    })();
  }
});
ot(["click"]);
var uc = /* @__PURE__ */ u("<span class=k-glyph>");
function Ae(e) {
  return (() => {
    var t = uc();
    return s(t, d(ie, {
      get icon() {
        return e.icon;
      }
    })), W((r) => {
      var n = e.size ?? "md", a = e.accent ?? ar[e.category].accent;
      return n !== r.e && L(t, "data-size", r.e = n), a !== r.t && H(t, "--accent", r.t = a), r;
    }, {
      e: void 0,
      t: void 0
    }), t;
  })();
}
var gc = /* @__PURE__ */ u("<div class=k-ring><svg aria-hidden=true><defs><linearGradient id=k-ring-ice x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#bff1ff></stop><stop offset=0.5 stop-color=#5fdbff></stop><stop offset=1 stop-color=#159dec></stop></linearGradient><linearGradient id=k-ring-warm x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#ffe2a8></stop><stop offset=1 stop-color=#f29a3c></stop></linearGradient><linearGradient id=k-ring-green x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#c9ffe3></stop><stop offset=1 stop-color=#3fcf8e></stop></linearGradient></defs><circle class=k-ring-track stroke-width=7></circle><circle class=k-ring-fill stroke-width=7></circle></svg><div class=k-ring-label>"), hc = /* @__PURE__ */ u("<button type=button class=k-toggle role=switch><span>"), mc = /* @__PURE__ */ u("<span class=k-kicker>");
function Ja(e) {
  const r = () => (e.size - 7) / 2 - 3, n = () => 2 * Math.PI * r(), a = () => e.value === void 0 ? 0 : mr((e.value - e.min) / (e.max - e.min), 0, 1);
  return (() => {
    var o = gc(), i = o.firstChild, l = i.firstChild, c = l.nextSibling, f = c.nextSibling, g = i.nextSibling;
    return s(g, () => e.children), W((p) => {
      var x = e.tone ?? "ice", b = `${e.size}px`, k = `${e.size}px`, m = `0 0 ${e.size} ${e.size}`, h = e.size / 2, v = e.size / 2, S = r(), _ = e.size / 2, $ = e.size / 2, C = r(), y = `url(#k-ring-${e.tone ?? "ice"})`, z = `${n()}`, T = `${n() * (1 - a())}`, P = `rotate(-90 ${e.size / 2} ${e.size / 2})`;
      return x !== p.e && L(o, "data-tone", p.e = x), b !== p.t && H(o, "width", p.t = b), k !== p.a && H(o, "height", p.a = k), m !== p.o && L(i, "viewBox", p.o = m), h !== p.i && L(c, "cx", p.i = h), v !== p.n && L(c, "cy", p.n = v), S !== p.s && L(c, "r", p.s = S), _ !== p.h && L(f, "cx", p.h = _), $ !== p.r && L(f, "cy", p.r = $), C !== p.d && L(f, "r", p.d = C), y !== p.l && L(f, "stroke", p.l = y), z !== p.u && L(f, "stroke-dasharray", p.u = z), T !== p.c && L(f, "stroke-dashoffset", p.c = T), P !== p.w && L(f, "transform", p.w = P), p;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0,
      l: void 0,
      u: void 0,
      c: void 0,
      w: void 0
    }), o;
  })();
}
function Rn(e) {
  return (() => {
    var t = hc();
    return le(t, "click", (r) => {
      r.stopPropagation(), e.onToggle();
    }), W((r) => {
      var n = !!e.on, a = e.on, o = e.label, i = e.disabled;
      return n !== r.e && t.classList.toggle("on", r.e = n), a !== r.t && L(t, "aria-checked", r.t = a), o !== r.a && L(t, "aria-label", r.a = o), i !== r.o && (t.disabled = r.o = i), r;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), t;
  })();
}
function it(e) {
  return (() => {
    var t = mc();
    return s(t, () => e.children), t;
  })();
}
const bc = /(follow|prewash|steam|sleep|tryb|mode|child|lock|indicator|update|feeder|karmien|litter|czyszcz|zasilanie|camera|status_led|enabled|sync|motion_detection|privacy)/;
function xc(e) {
  return `${Ce(e.entity_id)} ${Ce(String(e.attributes.friendly_name ?? ""))}`;
}
function ei(e) {
  const t = be(e.entity_id);
  return t === "light" || t === "fan" || t === "input_boolean" ? !0 : t === "switch" && !bc.test(xc(e));
}
const wc = {
  moisture: ["detected", "dry"],
  carbon_monoxide: ["detected", "clear"],
  smoke: ["detected", "clear"],
  gas: ["detected", "clear"],
  safety: ["problem", "clear"],
  problem: ["problem", "clear"],
  window: ["open", "closed"],
  door: ["open", "closed"],
  garage_door: ["open", "closed"],
  opening: ["open", "closed"],
  occupancy: ["present", "away"],
  motion: ["present", "away"],
  presence: ["present", "away"]
}, kc = {
  run: "running",
  running: "running",
  idle: "idle",
  pause: "paused",
  paused: "paused",
  finished: "finished",
  ready: "ready",
  drying: "drying",
  playing: "playing",
  standby: "standby"
};
function Wt(e, t, r) {
  if (!t || ce(t)) return e("unavailable");
  const n = be(t.entity_id);
  if (n === "binary_sensor") {
    const l = wc[String(t.attributes.device_class)] ?? ["on", "off"];
    return e(t.state === "on" ? l[0] : l[1]);
  }
  if (n === "climate") {
    const l = q(t.attributes.current_temperature), c = q(t.attributes.temperature);
    return `${V(l, 1, e.lang())}° → ${t.state === "off" || c === void 0 ? "—" : `${V(c, 1, e.lang())}°`}`;
  }
  if (/^(success|succeeded|passed|pass|ok)$/i.test(t.state)) return "OK";
  if (/^(fail|failed|failure)$/i.test(t.state)) return e("testFailed");
  if (r?.formatEntityState)
    try {
      return r.formatEntityState(t);
    } catch {
    }
  if (t.state === "on") return e("on");
  if (t.state === "off") return e("off");
  const a = kc[t.state];
  if (a) return e(a);
  const o = q(t.state), i = t.attributes.unit_of_measurement;
  if (o !== void 0 && /^-?\d+(\.\d+)?$/.test(t.state)) {
    const l = Number.isInteger(o) ? 0 : Math.min(2, t.state.split(".")[1]?.length ?? 1);
    return `${V(o, l, e.lang())}${i ? ` ${i}` : ""}`;
  }
  return t.state;
}
function yc(e) {
  if (!e) return !1;
  const t = be(e.entity_id);
  return t === "alarm_control_panel" ? e.state === "triggered" : t !== "binary_sensor" ? !1 : e.state === "on" && !["occupancy", "motion", "presence", "battery_charging", "plug", "power", "running", "connectivity"].includes(String(e.attributes.device_class));
}
const vc = /* @__PURE__ */ new Set(["on", "playing", "heat", "cool", "heat_cool", "auto", "dry", "fan_only", "run", "running", "open", "home", "cleaning"]), _c = /* @__PURE__ */ new Set(["light", "switch", "fan", "media_player", "climate", "input_boolean", "humidifier", "water_heater"]);
function vr(e) {
  return !e || ce(e) ? "missing" : yc(e) ? "alert" : _c.has(be(e.entity_id)) ? vc.has(e.state) ? "on" : "dim" : be(e.entity_id) === "sensor" && /(machine_status|program_phase|_status)$/.test(e.entity_id) ? /(run|wash|dry|spin|rinse)/.test(e.state) ? "on" : "dim" : "plain";
}
var $c = /* @__PURE__ */ u("<img class=k-canvas-photo alt>"), zc = /* @__PURE__ */ u("<span> °C"), Sc = /* @__PURE__ */ u("<span>%"), Cc = /* @__PURE__ */ u('<article class="k-tile k-canvas"><span class=k-canvas-shade></span><header class=k-canvas-head><div><span class=k-kicker>Krystal / </span><h2></h2><span class=k-canvas-metrics></span></div><span class=k-live><i></i></span></header><div class=k-canvas-grid>'), Tc = /* @__PURE__ */ u("<img alt>"), Pc = /* @__PURE__ */ u("<div class=k-device role=button tabindex=0><span class=k-device-art></span><span class=k-device-copy><b></b><small>");
re({
  type: "canvas",
  sizes: {
    lg: {
      w: 12,
      h: 4
    },
    md: {
      w: 8,
      h: 5
    },
    sm: {
      w: 4,
      h: 7
    }
  },
  component: (e) => {
    const t = de(), r = ut(), n = Vt(), a = ae(), o = (c) => c ? q(t()?.states[c]?.state) : void 0, [i, l] = J(!1);
    return (() => {
      var c = Cc(), f = c.firstChild, g = f.nextSibling, p = g.firstChild, x = p.firstChild;
      x.firstChild;
      var b = x.nextSibling, k = b.nextSibling, m = p.nextSibling;
      m.firstChild;
      var h = g.nextSibling;
      return s(c, d(N, {
        get when() {
          return F(() => !!e.config.image)() && !i();
        },
        get children() {
          var v = $c();
          return v.addEventListener("error", () => l(!0)), L(v, "draggable", !1), W(() => L(v, "src", e.config.image)), v;
        }
      }), f), s(x, () => a("canvas"), null), s(b, () => e.config.title), s(k, d(N, {
        get when() {
          return o(e.config.temperature) !== void 0;
        },
        get children() {
          var v = zc(), S = v.firstChild;
          return s(v, () => V(o(e.config.temperature), 1, a.lang()), S), v;
        }
      }), null), s(k, d(N, {
        get when() {
          return o(e.config.humidity) !== void 0;
        },
        get children() {
          var v = Sc(), S = v.firstChild;
          return s(v, () => V(o(e.config.humidity), 0, a.lang()), S), v;
        }
      }), null), s(m, () => a("live"), null), s(h, d(B, {
        get each() {
          return e.config.devices;
        },
        children: (v) => {
          const S = () => t()?.states[v.entity], _ = () => S()?.state === "on" || S()?.state === "playing", $ = () => v.action === "toggle" && !!S() && ei(S()), C = () => qt(v.entity, S(), {
            ...v,
            name: v.name
          }), y = () => C().art ? fe[C().art] : void 0, z = () => {
            const P = me(v.entity, S(), v.name);
            return P.toLowerCase() === e.config.title.toLowerCase() ? Ao(C().art, a.lang()) ?? P : P;
          }, T = () => $() ? r(be(v.entity), "toggle", {
            entity_id: v.entity
          }) : n(v.entity);
          return (() => {
            var P = Pc(), w = P.firstChild, R = w.nextSibling, A = R.firstChild, E = A.nextSibling;
            return P.$$keydown = (j) => (j.key === "Enter" || j.key === " ") && (j.preventDefault(), T()), P.$$click = T, s(w, d(N, {
              get when() {
                return y();
              },
              get fallback() {
                return d(Ae, {
                  get icon() {
                    return C().glyph;
                  },
                  get category() {
                    return C().category;
                  }
                });
              },
              get children() {
                var j = Tc();
                return L(j, "draggable", !1), W(() => L(j, "src", y())), j;
              }
            })), s(A, z), s(E, () => Wt(a, S(), t())), s(P, d(N, {
              get when() {
                return $();
              },
              get children() {
                return d(Rn, {
                  get on() {
                    return _();
                  },
                  get label() {
                    return z();
                  },
                  onToggle: T
                });
              }
            }), null), W((j) => {
              var M = vr(S()), O = !!_(), G = !_(), D = !!ce(S());
              return M !== j.e && L(P, "data-state", j.e = M), O !== j.t && P.classList.toggle("on", j.t = O), G !== j.a && P.classList.toggle("off", j.a = G), D !== j.o && P.classList.toggle("missing", j.o = D), j;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0
            }), P;
          })();
        }
      })), c;
    })();
  }
});
ot(["click", "keydown"]);
var Mc = /* @__PURE__ */ u("<span class=k-panel-kicker>"), Ec = /* @__PURE__ */ u("<span class=k-panel-icon>"), Lc = /* @__PURE__ */ u('<article class="k-tile k-panel"><header class=k-panel-head><div><h3></h3></div></header><div class=k-panel-grid>'), Ac = /* @__PURE__ */ u("<img alt>"), Rc = /* @__PURE__ */ u("<em class=k-level-word>"), Oc = /* @__PURE__ */ u('<div class="k-well k-item"role=button tabindex=0><span class=k-item-art></span><span class=k-item-copy><small></small><b>');
re({
  type: "panel",
  sizes: {
    lg: {
      w: 6,
      h: 3
    },
    md: {
      w: 8,
      h: 3
    },
    sm: {
      w: 4,
      h: 4
    }
  },
  component: (e) => {
    const t = de(), r = ut(), n = Vt(), a = ae(), o = () => e.config.section;
    return (() => {
      var i = Lc(), l = i.firstChild, c = l.firstChild, f = c.firstChild, g = l.nextSibling;
      return s(c, d(N, {
        get when() {
          return o().kicker;
        },
        get children() {
          var p = Mc();
          return s(p, () => o().kicker), p;
        }
      }), f), s(f, () => o().title), s(l, d(N, {
        get when() {
          return o().icon;
        },
        get children() {
          var p = Ec();
          return s(p, d(ie, {
            get icon() {
              return o().icon;
            }
          })), p;
        }
      }), null), s(g, d(B, {
        get each() {
          return o().items;
        },
        children: (p) => {
          const x = () => t()?.states[p.entity], b = () => me(p.entity, x(), p.name), k = () => qt(p.entity, x(), {
            ...p,
            name: p.name
          }), m = () => Lo(p.entity, x(), p.name), h = () => p.action === "toggle" && !!x() && ei(x()), v = () => h() ? r(be(p.entity), "toggle", {
            entity_id: p.entity
          }) : n(p.entity);
          return (() => {
            var S = Oc(), _ = S.firstChild, $ = _.nextSibling, C = $.firstChild, y = C.nextSibling;
            return S.$$keydown = (z) => (z.key === "Enter" || z.key === " ") && (z.preventDefault(), v()), S.$$click = v, s(_, d(N, {
              get when() {
                return k().art;
              },
              get fallback() {
                return d(Ae, {
                  get icon() {
                    return k().glyph;
                  },
                  get category() {
                    return k().category;
                  }
                });
              },
              get children() {
                var z = Ac();
                return L(z, "draggable", !1), W(() => L(z, "src", fe[k().art])), z;
              }
            })), s(C, b), s(y, d(N, {
              get when() {
                return F(() => !!m()?.word)() && be(p.entity) === "sensor";
              },
              get fallback() {
                return Wt(a, x(), t());
              },
              get children() {
                return [d(N, {
                  get when() {
                    return Number.isFinite(Number(x()?.state));
                  },
                  get children() {
                    return [F(() => Wt(a, x(), t())), " · "];
                  }
                }), (() => {
                  var z = Rc();
                  return s(z, () => a(m().word)), z;
                })()];
              }
            })), s(S, d(N, {
              get when() {
                return h();
              },
              get children() {
                return d(Rn, {
                  get on() {
                    return x()?.state === "on";
                  },
                  get label() {
                    return b();
                  },
                  onToggle: v
                });
              }
            }), null), W((z) => {
              var T = vr(x()), P = m() ? "" : void 0, w = m() ? {
                "--level": m().color
              } : void 0;
              return T !== z.e && L(S, "data-state", z.e = T), P !== z.t && L(S, "data-level", z.t = P), z.a = $e(S, w, z.a), z;
            }, {
              e: void 0,
              t: void 0,
              a: void 0
            }), S;
          })();
        }
      })), W((p) => H(i, "--accent", o().accent ?? "#8cdbff")), i;
    })();
  }
});
ot(["click", "keydown"]);
const ti = 8e3;
function ni(e) {
  const [t, r] = J();
  let n, a, o = !1;
  return Be(() => {
    clearTimeout(n), clearTimeout(a);
  }), ft(() => {
    const l = t(), c = e.value();
    l !== void 0 && o && c !== void 0 && Math.abs(c - l) < 1e-6 && (o = !1, clearTimeout(a), r(void 0));
  }), { shown: () => t() ?? e.value(), nudge: (l) => {
    const c = t() ?? e.value();
    if (c === void 0) return;
    const f = e.step(), g = mr(Math.round((c + l * f) / f) * f, e.min(), e.max());
    r(Number(g.toFixed(2))), o = !1, clearTimeout(n), clearTimeout(a), n = setTimeout(() => {
      o = !0, e.commit(t()), a = setTimeout(() => {
        o = !1, r(void 0);
      }, ti);
    }, e.delay ?? 600);
  }, pending: t };
}
function ri(e) {
  const [t, r] = J({}), n = /* @__PURE__ */ new Map();
  return Be(() => n.forEach(clearTimeout)), ft(() => {
    const i = e(), l = t(), c = Object.keys(l).filter((f) => i[f] === l[f]);
    c.length && r(Object.fromEntries(Object.entries(l).filter(([f]) => !c.includes(f))));
  }), { choose: (i, l, c) => {
    r((f) => ({ ...f, [i]: l })), clearTimeout(n.get(i)), n.set(i, setTimeout(() => r(({ [i]: f, ...g }) => g), ti)), c();
  }, shown: (i) => t()[i] ?? e()[i] };
}
var Nc = /* @__PURE__ */ u("<div class=k-ac-chips>"), jc = /* @__PURE__ */ u("<section><span class=k-f1-label></span><div class=k-ac-extras>"), Dc = /* @__PURE__ */ u("<div class=k-ac-sheet><header><b></b><button type=button class=k-btn></button></header><div class=k-ac-sheet-body>"), Wc = /* @__PURE__ */ u('<article class="k-tile k-ac"><header class=k-ac-head><div><span class=k-kicker></span><h3 class=k-ac-status></h3><span class=k-ac-temps>° <i>→</i> <b></b></span></div><button type=button class="k-btn k-ac-gear"><span></span></button></header><div class=k-ac-body><div class=k-ac-hero><span class=k-ac-ring></span><img alt></div><div class=k-ac-side><div class="k-well k-metric"><span></span><strong>°</strong></div><div class="k-well k-metric k-ac-target"><span></span><strong></strong><div class=k-steppers><button type=button class=k-btn aria-label=−>−</button><button type=button class=k-btn aria-label=+>+</button></div></div></div></div><div class=k-ac-modes role=radiogroup>'), Gc = /* @__PURE__ */ u("<span class=k-ac-chip><small>"), Ic = /* @__PURE__ */ u("<button type=button role=radio class=k-ac-mode><span class=k-ac-mode-well>"), Bc = /* @__PURE__ */ u("<section><span class=k-f1-label></span><div class=k-ac-options>"), Fc = /* @__PURE__ */ u("<button type=button class=k-ac-option>"), Hc = /* @__PURE__ */ u('<div class="k-well k-ac-extra"><span>'), Kc = /* @__PURE__ */ u("<select>"), Uc = /* @__PURE__ */ u("<option>");
const sn = {
  fan: 8,
  preset: 16,
  swing: 32,
  swingH: 512
}, $n = {
  off: "mdi:power",
  // A sun reads as "heat" at chip size; mdi:fire renders like a droplet next to mdi:water-percent.
  heat: "mdi:white-balance-sunny",
  cool: "mdi:snowflake",
  heat_cool: "mdi:sun-snowflake-variant",
  auto: "mdi:thermostat-auto",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan"
}, Et = {
  off: "#8a98aa",
  heat: "#ffae62",
  cool: "#5fdbff",
  heat_cool: "#b9a6ff",
  auto: "#b9a6ff",
  dry: "#4fe0c8",
  fan_only: "#a8d4f0"
}, Zr = {
  pl: {
    off: "Wył.",
    heat: "Grzanie",
    cool: "Chłodzenie",
    heat_cool: "Auto",
    auto: "Auto",
    dry: "Osuszanie",
    fan_only: "Wentylator",
    heating: "Grzeje",
    cooling: "Chłodzi",
    drying: "Osusza",
    fan: "Wentyluje",
    idle: "Bezczynny",
    offState: "Wyłączony",
    holding: "Utrzymuje",
    above: "Powyżej celu",
    below: "Poniżej celu",
    now: "Teraz",
    target: "Cel",
    settings: "Ustawienia",
    close: "Zamknij",
    fanModes: "Wentylator",
    swing: "Klapa pion",
    swingH: "Klapa poziom",
    presets: "Presety",
    extras: "Dodatki",
    mode: "Tryb",
    unavailable: "Niedostępny"
  },
  en: {
    off: "Off",
    heat: "Heat",
    cool: "Cool",
    heat_cool: "Auto",
    auto: "Auto",
    dry: "Dry",
    fan_only: "Fan",
    heating: "Heating",
    cooling: "Cooling",
    drying: "Drying",
    fan: "Fan running",
    idle: "Idle",
    offState: "Off",
    holding: "Holding",
    above: "Above target",
    below: "Below target",
    now: "Now",
    target: "Target",
    settings: "Settings",
    close: "Close",
    fanModes: "Fan",
    swing: "Vertical swing",
    swingH: "Horizontal swing",
    presets: "Presets",
    extras: "Extras",
    mode: "Mode",
    unavailable: "Unavailable"
  }
}, Vc = {
  auto: "Auto",
  low: "Niski",
  "medium low": "Średnio-niski",
  medium_low: "Średnio-niski",
  medium: "Średni",
  "medium high": "Średnio-wysoki",
  medium_high: "Średnio-wysoki",
  high: "Wysoki",
  quiet: "Cichy",
  silent: "Cichy",
  turbo: "Turbo",
  strong: "Mocny",
  middle: "Średni",
  on: "Wł.",
  off: "Wył.",
  default: "Domyślnie",
  full_swing: "Pełny ruch",
  both: "Oba",
  vertical: "Pion",
  horizontal: "Poziom",
  fixed_upper: "Stała · góra",
  fixed_upper_middle: "Stała · góra-środek",
  fixed_middle: "Stała · środek",
  fixed_lower_middle: "Stała · dół-środek",
  fixed_lower: "Stała · dół",
  swing_upper: "Ruch · góra",
  swing_upper_middle: "Ruch · góra-środek",
  swing_middle: "Ruch · środek",
  swing_lower_middle: "Ruch · dół-środek",
  swing_lower: "Ruch · dół",
  left: "Lewo",
  left_center: "Lewo-środek",
  center: "Środek",
  right_center: "Prawo-środek",
  right: "Prawo",
  eco: "Eko",
  away: "Poza domem",
  boost: "Boost",
  none: "Brak",
  sleep: "Sen",
  comfort: "Komfort",
  home: "Dom",
  activity: "Aktywność",
  frost: "Przeciwmrozowy"
}, qc = [[/panel[\s_]*light|display|wyswietl|light|led/, "Podświetlenie panelu"], [/quiet|silent|cichy/, "Tryb cichy"], [/fresh[\s_]*air/, "Świeże powietrze"], [/x[\s_-]*fan|xfan|dry[\s_]*clean/, "X-Fan (suszenie wymiennika)"], [/health|anion|ionizer|jonizator/, "Jonizator"], [/sleep|sen/, "Tryb nocny"], [/turbo|powerful|boost/, "Turbo"], [/beep|buzzer|sound|dzwiek/, "Dźwięk"], [/eco/, "Eko"], [/anti[\s_]*mildew|mildew|self[\s_]*clean/, "Samoczyszczenie"]];
function Kn(e, t) {
  return e !== "pl" ? t.replace(/_/g, " ").replace(/^./, (r) => r.toUpperCase()) : Vc[t.toLowerCase()] ?? t.replace(/_/g, " ").replace(/^./, (r) => r.toUpperCase());
}
function Qr(e, t, r) {
  const n = Ce(String(t.attributes.friendly_name ?? t.entity_id.split(".")[1]));
  let a = n;
  for (const o of r) o && a.startsWith(o) && (a = a.slice(o.length).replace(/^_/, ""));
  if (e === "pl") {
    for (const [o, i] of qc) if (o.test(a)) return i;
  }
  return fr(a || n);
}
re({
  type: "ac",
  sizes: {
    lg: {
      w: 8,
      h: 5
    },
    md: {
      w: 8,
      h: 5
    },
    sm: {
      w: 4,
      h: 9
    }
  },
  component: (e) => {
    const t = En(() => e.config.entity), r = de(), n = ut(), a = ae(), o = () => a.lang() === "pl" ? "pl" : "en", i = (O) => Zr[o()][O] ?? Zr.en[O] ?? O, [l, c] = J(!1), f = () => t()?.attributes ?? {}, g = () => Number(f().supported_features ?? 0), p = (O, G) => (g() & O) !== 0 && Array.isArray(G) && G.length > 0, x = ri(() => ({
      hvac_mode: t()?.state,
      fan_mode: f().fan_mode,
      swing_mode: f().swing_mode,
      swing_horizontal_mode: f().swing_horizontal_mode,
      preset_mode: f().preset_mode
    })), b = () => String(x.shown("hvac_mode") ?? "off"), k = () => (f().hvac_modes ?? []).filter((O) => O in $n), m = () => q(f().target_temp_step) ?? 1, h = ni({
      value: () => q(f().temperature),
      min: () => q(f().min_temp) ?? 16,
      max: () => q(f().max_temp) ?? 31,
      step: m,
      commit: (O) => n("climate", "set_temperature", {
        entity_id: e.config.entity,
        temperature: O
      })
    }), v = () => h.shown(), S = () => q(f().current_temperature), _ = () => Et[b()] ?? Et.off, $ = () => b() === "off" || ce(t()), C = K(() => {
      if (ce(t())) return {
        text: i("unavailable"),
        active: !1
      };
      const O = f().hvac_action;
      if (O)
        return {
          text: i(O === "off" ? "offState" : O),
          active: O === "heating" || O === "cooling" || O === "drying"
        };
      const G = String(t()?.state ?? "off");
      if (G === "off") return {
        text: i("offState"),
        active: !1
      };
      const D = S(), U = q(f().temperature);
      return G === "heat" && D !== void 0 && U !== void 0 ? D < U - 0.3 ? {
        text: i("heating"),
        active: !0
      } : {
        text: i(D > U + 0.5 ? "above" : "holding"),
        active: !1
      } : G === "cool" && D !== void 0 && U !== void 0 ? D > U + 0.3 ? {
        text: i("cooling"),
        active: !0
      } : {
        text: i(D < U - 0.5 ? "below" : "holding"),
        active: !1
      } : G === "dry" ? {
        text: i("drying"),
        active: !0
      } : G === "fan_only" ? {
        text: i("fan"),
        active: !0
      } : {
        text: i(G),
        active: !1
      };
    }), y = (O) => h.nudge(O), z = (O, G, D) => x.choose(G, D, () => n("climate", O, {
      entity_id: e.config.entity,
      [G]: D
    })), T = () => [{
      key: "fanModes",
      list: f().fan_modes,
      value: x.shown("fan_mode"),
      ok: p(sn.fan, f().fan_modes),
      service: "set_fan_mode",
      field: "fan_mode"
    }, {
      key: "swing",
      list: f().swing_modes,
      value: x.shown("swing_mode"),
      ok: p(sn.swing, f().swing_modes),
      service: "set_swing_mode",
      field: "swing_mode"
    }, {
      key: "swingH",
      list: f().swing_horizontal_modes,
      value: x.shown("swing_horizontal_mode"),
      ok: p(sn.swingH, f().swing_horizontal_modes) || Array.isArray(f().swing_horizontal_modes) && f().swing_horizontal_modes.length > 0,
      service: "set_swing_horizontal_mode",
      field: "swing_horizontal_mode"
    }, {
      key: "presets",
      list: f().preset_modes,
      value: x.shown("preset_mode"),
      ok: p(sn.preset, f().preset_modes),
      service: "set_preset_mode",
      field: "preset_mode"
    }].filter((O) => O.ok), P = () => [e.config.entity.split(".")[1], Ce(String(f().friendly_name ?? ""))].filter(Boolean), w = K(() => {
      const O = r()?.states ?? {}, G = new Set(e.config.extras ?? []);
      for (const D of Object.keys(O)) {
        const [U, oe] = D.split(".");
        ["switch", "select"].includes(U) && P().some((xe) => xe.length > 3 && oe.startsWith(`${xe}_`)) && G.add(D);
      }
      return [...G].map((D) => O[D]).filter((D) => !!D && !ce(D));
    }), R = K(() => T().map((O) => O.key).join(","), "", {
      equals: (O, G) => O === G
    }), A = () => R() ? R().split(",") : [], E = K(() => w().map((O) => O.entity_id).join(","), "", {
      equals: (O, G) => O === G
    }), j = () => E() ? E().split(",") : [], M = () => T().filter((O) => O.value !== void 0 && O.value !== null && O.value !== "").map((O) => ({
      label: i(O.key),
      value: Kn(o(), String(O.value))
    }));
    return (() => {
      var O = Wc(), G = O.firstChild, D = G.firstChild, U = D.firstChild, oe = U.nextSibling, xe = oe.nextSibling, Oe = xe.firstChild, lt = Oe.nextSibling, Yt = lt.nextSibling, Zt = Yt.nextSibling, ct = D.nextSibling, yt = ct.firstChild, vt = G.nextSibling, _t = vt.firstChild, Qt = _t.firstChild, $t = Qt.nextSibling, Tr = _t.nextSibling, Pr = Tr.firstChild, Mr = Pr.firstChild, Er = Mr.nextSibling, xi = Er.firstChild, wi = Pr.nextSibling, Lr = wi.firstChild, Ar = Lr.nextSibling, ki = Ar.nextSibling, Nn = ki.firstChild, Rr = Nn.nextSibling, jn = vt.nextSibling;
      return s(U, () => me(e.config.entity, t())), s(oe, () => C().text), s(xe, () => V(S(), 1, a.lang()), Oe), s(Zt, (() => {
        var Z = F(() => !!$());
        return () => Z() ? "—" : `${V(v(), m() < 1 ? 1 : 0, a.lang())}°`;
      })()), le(ct, "click", () => c(!0)), s(ct, d(Ae, {
        icon: "mdi:tune-variant",
        category: "climate",
        size: "sm"
      }), yt), s(yt, () => i("settings")), L($t, "draggable", !1), s(Mr, () => i("now")), s(Er, () => V(S(), 1, a.lang()), xi), s(Lr, () => i("target")), s(Ar, (() => {
        var Z = F(() => !!$());
        return () => Z() ? i("off") : `${V(v(), m() < 1 ? 1 : 0, a.lang())}°`;
      })()), le(Nn, "click", () => y(-1)), le(Rr, "click", () => y(1)), s(Tr, d(N, {
        get when() {
          return M().length;
        },
        get children() {
          var Z = Nc();
          return s(Z, d(Gi, {
            get each() {
              return M();
            },
            children: (ue) => (() => {
              var Te = Gc(), ge = Te.firstChild;
              return s(ge, () => ue().label), s(Te, () => ue().value, null), Te;
            })()
          })), Z;
        }
      }), null), s(jn, d(B, {
        get each() {
          return k();
        },
        children: (Z) => (() => {
          var ue = Ic(), Te = ue.firstChild;
          return le(ue, "click", () => z("set_hvac_mode", "hvac_mode", Z)), s(Te, d(Ae, {
            get icon() {
              return $n[Z];
            },
            category: "climate",
            size: "xs",
            get accent() {
              return Et[Z];
            }
          })), s(ue, () => i(Z), null), W((ge) => {
            var Qe = b() === Z, Pe = b() === Z, ye = Et[Z], Ne = ce(t());
            return Qe !== ge.e && L(ue, "aria-checked", ge.e = Qe), Pe !== ge.t && ue.classList.toggle("selected", ge.t = Pe), ye !== ge.a && H(ue, "--tone", ge.a = ye), Ne !== ge.o && (ue.disabled = ge.o = Ne), ge;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          }), ue;
        })()
      })), s(O, d(N, {
        get when() {
          return l();
        },
        get children() {
          var Z = Dc(), ue = Z.firstChild, Te = ue.firstChild, ge = Te.nextSibling, Qe = ue.nextSibling;
          return s(Te, () => i("settings")), le(ge, "click", () => c(!1)), s(ge, () => i("close")), s(Qe, d(B, {
            get each() {
              return A();
            },
            children: (Pe) => {
              const ye = () => T().find((ve) => ve.key === Pe), Ne = K(() => (ye()?.list ?? []).join("\0"), "", {
                equals: (ve, _e) => ve === _e
              });
              return d(N, {
                get when() {
                  return ye();
                },
                get children() {
                  var ve = Bc(), _e = ve.firstChild, Xe = _e.nextSibling;
                  return s(_e, () => i(Pe)), s(Xe, d(B, {
                    get each() {
                      return F(() => !!Ne())() ? Ne().split("\0") : [];
                    },
                    children: (zt) => (() => {
                      var Fe = Fc();
                      return le(Fe, "click", () => z(ye().service, ye().field, zt)), s(Fe, () => Kn(o(), zt)), W(() => Fe.classList.toggle("selected", String(ye()?.value) === zt)), Fe;
                    })()
                  })), ve;
                }
              });
            }
          }), null), s(Qe, d(N, {
            get when() {
              return w().length;
            },
            get children() {
              var Pe = jc(), ye = Pe.firstChild, Ne = ye.nextSibling;
              return s(ye, () => i("extras")), s(Ne, d(B, {
                get each() {
                  return j();
                },
                children: (ve) => {
                  const _e = () => r().states[ve];
                  return d(N, {
                    get when() {
                      return _e();
                    },
                    get children() {
                      var Xe = Hc(), zt = Xe.firstChild;
                      return s(zt, () => Qr(o(), _e(), P())), s(Xe, d(N, {
                        get when() {
                          return be(ve) === "switch";
                        },
                        get fallback() {
                          return (() => {
                            var Fe = Kc();
                            return Fe.addEventListener("change", (Xt) => n("select", "select_option", {
                              entity_id: ve,
                              option: Xt.currentTarget.value
                            })), s(Fe, d(B, {
                              get each() {
                                return _e().attributes.options ?? [];
                              },
                              children: (Xt) => (() => {
                                var Dn = Uc();
                                return Dn.value = Xt, s(Dn, () => Kn(o(), Xt)), Dn;
                              })()
                            })), W(() => Fe.value = _e().state), Fe;
                          })();
                        },
                        get children() {
                          return d(Rn, {
                            get on() {
                              return _e().state === "on";
                            },
                            get label() {
                              return Qr(o(), _e(), P());
                            },
                            onToggle: () => n("switch", "toggle", {
                              entity_id: ve
                            })
                          });
                        }
                      }), null), Xe;
                    }
                  });
                }
              })), Pe;
            }
          }), null), Z;
        }
      }), null), W((Z) => {
        var ue = !!$(), Te = !!C().active, ge = b(), Qe = _(), Pe = i("settings"), ye = fe.ac, Ne = $(), ve = $(), _e = i("mode"), Xe = String(Math.max(1, k().length));
        return ue !== Z.e && O.classList.toggle("off", Z.e = ue), Te !== Z.t && O.classList.toggle("active", Z.t = Te), ge !== Z.a && L(O, "data-mode", Z.a = ge), Qe !== Z.o && H(O, "--mode", Z.o = Qe), Pe !== Z.i && L(ct, "aria-label", Z.i = Pe), ye !== Z.n && L($t, "src", Z.n = ye), Ne !== Z.s && (Nn.disabled = Z.s = Ne), ve !== Z.h && (Rr.disabled = Z.h = ve), _e !== Z.r && L(jn, "aria-label", Z.r = _e), Xe !== Z.d && H(jn, "--n", Z.d = Xe), Z;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0,
        h: void 0,
        r: void 0,
        d: void 0
      }), O;
    })();
  }
});
var Yc = /* @__PURE__ */ u("<div class=k-seg>"), Zc = /* @__PURE__ */ u('<article class="k-tile k-climate"><header class=k-head><h3></h3></header><div class=k-climate-hero><div class=k-dial><img alt><div class=k-dial-read><b>°</b><span></span></div></div></div><div class=k-side><div class="k-well k-metric"><span></span><strong></strong></div><div class=k-steppers><button type=button class=k-btn aria-label=->−</button><button type=button class=k-btn aria-label=+>+'), Qc = /* @__PURE__ */ u("<button type=button>");
const Xr = {
  off: "modeOff",
  heat: "modeHeat",
  cool: "modeCool",
  dry: "modeDry",
  fan_only: "modeFan",
  auto: "modeAuto",
  heat_cool: "modeAuto"
}, Xc = {
  heating: "heating",
  cooling: "cooling",
  drying: "drying",
  fan: "fan",
  idle: "idle",
  off: "off"
};
re({
  type: "climate",
  sizes: {
    lg: {
      w: 4,
      h: 3
    },
    md: {
      w: 4,
      h: 3
    },
    sm: {
      w: 4,
      h: 3
    }
  },
  component: (e) => {
    const t = En(() => e.config.entity), r = ut(), n = ae(), a = () => q(t()?.attributes.target_temp_step) ?? 0.5, o = ni({
      value: () => q(t()?.attributes.temperature),
      min: () => q(t()?.attributes.min_temp) ?? 7,
      max: () => q(t()?.attributes.max_temp) ?? 35,
      step: a,
      commit: (h) => r("climate", "set_temperature", {
        entity_id: e.config.entity,
        temperature: h
      })
    }), i = ri(() => ({
      hvac_mode: t()?.state
    })), l = () => o.shown(), c = () => q(t()?.attributes.current_temperature), f = () => String(t()?.attributes.hvac_action ?? (t()?.state === "off" ? "off" : "idle")), g = () => (t()?.attributes.hvac_modes ?? []).filter((h) => h in Xr), p = () => a() < 1 ? 1 : 0, x = () => me(e.config.entity, t()), b = () => qt(e.config.entity, t(), {
      name: x()
    }).art ?? "dial", k = (h) => o.nudge(h), m = () => i.shown("hvac_mode");
    return (() => {
      var h = Zc(), v = h.firstChild, S = v.firstChild, _ = v.nextSibling, $ = _.firstChild, C = $.firstChild, y = C.nextSibling, z = y.firstChild, T = z.firstChild, P = z.nextSibling, w = _.nextSibling, R = w.firstChild, A = R.firstChild, E = A.nextSibling, j = R.nextSibling, M = j.firstChild, O = M.nextSibling;
      return s(v, d(it, {
        get children() {
          return n(Xc[f()] ?? "idle");
        }
      }), S), s(S, x), L(C, "draggable", !1), s(z, () => V(c(), 1, n.lang()), T), s(P, () => n("now")), s(A, () => n("target")), s(E, d(N, {
        get when() {
          return m() !== "off";
        },
        get fallback() {
          return n("modeOff");
        },
        get children() {
          return [F(() => V(l(), p(), n.lang())), "°"];
        }
      })), le(M, "click", () => k(-1)), le(O, "click", () => k(1)), s(h, d(N, {
        get when() {
          return g().length > 1;
        },
        get children() {
          var G = Yc();
          return s(G, d(B, {
            get each() {
              return g();
            },
            children: (D) => (() => {
              var U = Qc();
              return le(U, "click", () => i.choose("hvac_mode", D, () => r("climate", "set_hvac_mode", {
                entity_id: e.config.entity,
                hvac_mode: D
              }))), s(U, d(N, {
                get when() {
                  return $n[D];
                },
                get children() {
                  return d(Ae, {
                    get icon() {
                      return $n[D];
                    },
                    category: "climate",
                    size: "xs",
                    get accent() {
                      return Et[D];
                    }
                  });
                }
              }), null), s(U, () => n(Xr[D]), null), W(() => U.classList.toggle("selected", m() === D)), U;
            })()
          })), G;
        }
      }), null), W((G) => {
        var D = f(), U = t()?.state === "off", oe = b(), xe = fe[b()], Oe = ce(t()) || m() === "off", lt = ce(t()) || m() === "off";
        return D !== G.e && L(h, "data-action", G.e = D), U !== G.t && h.classList.toggle("off", G.t = U), oe !== G.a && L(_, "data-art", G.a = oe), xe !== G.o && L(C, "src", G.o = xe), Oe !== G.i && (M.disabled = G.i = Oe), lt !== G.n && (O.disabled = G.n = lt), G;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0
      }), h;
    })();
  }
});
var Jc = /* @__PURE__ */ u("<b>"), ed = /* @__PURE__ */ u("<span class=k-sensor-name>"), td = /* @__PURE__ */ u('<article class="k-tile k-sensor">'), nd = /* @__PURE__ */ u("<small>");
const Jr = {
  temperature: [10, 30],
  humidity: [0, 100],
  power: [0, 3e3],
  generic: [0, 100]
}, rd = {
  temperature: "temperature",
  humidity: "humidity",
  power: "power",
  generic: "entities"
};
re({
  type: "sensor",
  sizes: {
    lg: {
      w: 2,
      h: 2
    },
    md: {
      w: 2,
      h: 2
    },
    sm: {
      w: 2,
      h: 2
    }
  },
  component: (e) => {
    const t = En(() => e.config.entity), r = ae(), n = () => e.config.kind ?? "generic", a = () => String(t()?.attributes.unit_of_measurement ?? ""), o = () => {
      const f = q(t()?.state);
      return n() === "power" && a() === "kW" && f !== void 0 ? f * 1e3 : f;
    }, i = () => n() === "temperature" ? 1 : 0, l = () => n() === "temperature" ? "°" : n() === "power" ? "W" : a(), c = () => me(e.config.entity, t()).split("·")[0].trim();
    return (() => {
      var f = td();
      return s(f, d(it, {
        get children() {
          return r(rd[n()]);
        }
      }), null), s(f, d(Ja, {
        get value() {
          return o();
        },
        get min() {
          return Jr[n()][0];
        },
        get max() {
          return Jr[n()][1];
        },
        size: 92,
        get tone() {
          return n() === "power" ? "warm" : "ice";
        },
        get children() {
          var g = Jc();
          return s(g, () => V(o(), i(), r.lang()), null), s(g, (() => {
            var p = F(() => n() === "temperature");
            return () => p() ? "°" : (() => {
              var x = nd();
              return s(x, l), x;
            })();
          })(), null), g;
        }
      }), null), s(f, d(N, {
        get when() {
          return F(() => n() !== "temperature")() && n() !== "humidity";
        },
        get children() {
          var g = ed();
          return s(g, c), g;
        }
      }), null), W(() => L(f, "data-kind", n())), f;
    })();
  }
});
var ad = /* @__PURE__ */ u("<img alt>"), id = /* @__PURE__ */ u('<article class="k-tile k-media"><header class=k-head><h3></h3></header><button type=button class=k-media-body><span class="k-well k-media-art"></span><span class=k-media-copy><b></b><small></small></span></button><div class=k-media-controls><button type=button class=k-btn aria-label=previous>⏮</button><button type=button class="k-btn primary"aria-label=play/pause></button><button type=button class=k-btn aria-label=next>⏭</button><span class=k-media-gap></span><button type=button class=k-btn aria-label="volume down">−</button><button type=button class=k-btn aria-label="volume up">+'), od = /* @__PURE__ */ u("<img class=k-media-device alt>");
const sd = 1, ea = 1024, ld = 16, cd = 32;
re({
  type: "media",
  sizes: {
    lg: {
      w: 4,
      h: 3
    },
    md: {
      w: 4,
      h: 3
    },
    sm: {
      w: 4,
      h: 3
    }
  },
  component: (e) => {
    const t = En(() => e.config.entity), r = ut(), n = Vt(), a = ae(), o = () => Number(t()?.attributes.supported_features ?? 0), i = (p) => (o() & p) === p, l = () => t()?.state === "playing", c = (p) => r("media_player", p, {
      entity_id: e.config.entity
    }), f = () => t()?.attributes.media_title ?? Wt(a, t()), g = () => t()?.attributes.media_artist ?? t()?.attributes.app_name ?? "";
    return (() => {
      var p = id(), x = p.firstChild, b = x.firstChild, k = x.nextSibling, m = k.firstChild, h = m.nextSibling, v = h.firstChild, S = v.nextSibling, _ = k.nextSibling, $ = _.firstChild, C = $.nextSibling, y = C.nextSibling, z = y.nextSibling, T = z.nextSibling, P = T.nextSibling;
      return s(x, d(it, {
        get children() {
          return Wt(a, t());
        }
      }), b), s(b, () => e.config.name ?? go(t())), k.$$click = () => n(e.config.entity), s(m, d(N, {
        get when() {
          return F(() => !!l())() && t()?.attributes.entity_picture;
        },
        get fallback() {
          return (() => {
            var w = od();
            return L(w, "draggable", !1), W(() => L(w, "src", fe[qt(e.config.entity, t()).art ?? "speaker"])), w;
          })();
        },
        get children() {
          var w = ad();
          return L(w, "draggable", !1), W(() => L(w, "src", t().attributes.entity_picture)), w;
        }
      })), s(v, f), s(S, g), $.$$click = () => c("media_previous_track"), C.$$click = () => c("media_play_pause"), s(C, () => l() ? "⏸" : "▶"), y.$$click = () => c("media_next_track"), T.$$click = () => c("volume_down"), P.$$click = () => c("volume_up"), W((w) => {
        var R = !!l(), A = vr(t()), E = ce(t()) || !i(ld), j = ce(t()) || !i(sd), M = ce(t()) || !i(cd), O = ce(t()) || !i(ea), G = ce(t()) || !i(ea);
        return R !== w.e && p.classList.toggle("playing", w.e = R), A !== w.t && L(m, "data-state", w.t = A), E !== w.a && ($.disabled = w.a = E), j !== w.o && (C.disabled = w.o = j), M !== w.i && (y.disabled = w.i = M), O !== w.n && (T.disabled = w.n = O), G !== w.s && (P.disabled = w.s = G), w;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0
      }), p;
    })();
  }
});
ot(["click"]);
var dd = /* @__PURE__ */ u('<section class=k-nexus><div class=k-nx-stage><div class="k-nx-col left"></div><div class=k-nx-hub><b></b><small></small></div><div class="k-nx-col right"></div></div><footer class=k-nx-legend>'), fd = /* @__PURE__ */ u("<i>"), pd = /* @__PURE__ */ u("<span><i>"), ud = /* @__PURE__ */ u("<article><img class=k-nx-art alt><small></small><strong></strong><em>");
function ta(e, t, r, n, a) {
  const o = e.left + e.width, i = e.top + e.height, l = n - t, c = a - r;
  let f = 2, g = {
    x: n,
    y: a
  };
  const p = (x, b, k) => {
    x <= 1e-3 || x >= 0.999 || x >= f || b < e.left - 1 || b > o + 1 || k < e.top - 1 || k > i + 1 || (f = x, g = {
      x: b,
      y: k
    });
  };
  if (Math.abs(l) > 0.01)
    for (const x of [e.left, o]) {
      const b = (x - t) / l;
      p(b, x, r + c * b);
    }
  if (Math.abs(c) > 0.01)
    for (const x of [e.top, i]) {
      const b = (x - r) / c;
      p(b, t + l * b, x);
    }
  return g;
}
function ht(e, t) {
  const r = t ? e?.states[t] : void 0, n = q(r?.state);
  return n === void 0 ? void 0 : {
    v: n,
    unit: String(r?.attributes.unit_of_measurement ?? "")
  };
}
function Un(e, t) {
  if (!t) return "";
  try {
    return new Intl.NumberFormat(e, {
      style: "currency",
      currency: t.unit || "GBP"
    }).format(t.v);
  } catch {
    return `${V(t.v, 2, e)} ${t.unit}`;
  }
}
function gd(e) {
  const t = de(), {
    breakpoint: r
  } = pt(), n = ae(), [a, o] = J([]);
  let i;
  const l = K(() => {
    const x = n.lang(), b = [];
    (e.demand !== void 0 || e.rateP !== void 0) && b.push({
      type: "electric",
      label: n("nxElectric"),
      value: e.demand !== void 0 ? `${V(e.demand, 0, x)} W` : "—",
      detail: e.rateP !== void 0 ? n("nxPriceNow", {
        v: V(e.rateP, Math.abs(e.rateP) < 10 ? 2 : 1, x)
      }) : ""
    });
    const k = ht(t(), e.ids.waterUse) ?? ht(t(), e.ids.waterReading);
    if (k) {
      const v = Un(x, ht(t(), e.ids.waterCost));
      b.push({
        type: "water",
        label: n("nxWater"),
        value: `${V(k.v, k.v < 10 ? 2 : 0, x)} ${k.unit}`.trim(),
        detail: [e.ids.waterUse && ht(t(), e.ids.waterUse) ? n("nxYesterday") : "", v].filter(Boolean).join(" · ")
      });
    }
    const m = ht(t(), e.ids.gasUse), h = ht(t(), e.ids.gasCost);
    return (m || h) && b.push({
      type: "gas",
      label: n("nxGas"),
      value: m ? `${V(m.v, m.v < 10 ? 2 : 1, x)} ${m.unit}` : Un(x, h),
      detail: [m && h ? `${Un(x, h)} ${n("nxToday")}` : "", e.heating ? n("nxHeating") : n("nxIdle")].filter(Boolean).join(" · ")
    }), b;
  }), c = () => l().filter((x) => x.type === "electric"), f = () => l().filter((x) => x.type !== "electric"), g = (x) => x === "electric" ? `${mr(5.5 - (e.demand ?? 0) / 600, 1.1, 5.5).toFixed(2)}s` : x === "gas" ? e.heating ? "2.4s" : "6s" : "4.2s", p = () => {
    if (!i) return;
    const x = i.getBoundingClientRect(), b = (_) => {
      const $ = _.getBoundingClientRect();
      return {
        left: $.left - x.left,
        top: $.top - x.top,
        width: $.width,
        height: $.height
      };
    }, k = i.querySelector(".k-nx-hub");
    if (!k) return;
    const m = b(k), h = m.left + m.width / 2, v = m.top + m.height / 2, S = [...i.querySelectorAll("[data-feed]")].flatMap((_) => {
      const $ = b(_), C = $.left + $.width / 2, y = $.top + $.height / 2, z = ta($, C, y, h, v), T = ta(m, C, y, h, v), P = Math.hypot(T.x - z.x, T.y - z.y);
      return P < 8 ? [] : [{
        type: _.dataset.feed,
        x: z.x,
        y: z.y - 1.5,
        length: P,
        angle: Math.atan2(T.y - z.y, T.x - z.x) * 180 / Math.PI
      }];
    });
    o(S);
  };
  return Ra(() => {
    const x = new ResizeObserver(() => p());
    x.observe(i), p(), Be(() => x.disconnect());
  }), ft(() => {
    l().length, r(), queueMicrotask(p);
  }), (() => {
    var x = dd(), b = x.firstChild, k = b.firstChild, m = k.nextSibling, h = m.firstChild, v = h.nextSibling, S = m.nextSibling, _ = b.nextSibling, $ = i;
    return typeof $ == "function" ? jt($, b) : i = b, s(b, d(B, {
      get each() {
        return a();
      },
      children: (C) => (() => {
        var y = fd();
        return W((z) => {
          var T = `k-nx-wire ${C.type}`, P = `${C.x}px`, w = `${C.y}px`, R = `${C.length}px`, A = `rotate(${C.angle}deg)`, E = `${Math.max(0, C.length - 10)}px`, j = g(C.type), M = C.type === "gas" && !e.heating;
          return T !== z.e && dt(y, z.e = T), P !== z.t && H(y, "left", z.t = P), w !== z.a && H(y, "top", z.a = w), R !== z.o && H(y, "width", z.o = R), A !== z.i && H(y, "transform", z.i = A), E !== z.n && H(y, "--run", z.n = E), j !== z.s && H(y, "--dur", z.s = j), M !== z.h && y.classList.toggle("idle", z.h = M), z;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0,
          h: void 0
        }), y;
      })()
    }), k), s(k, d(B, {
      get each() {
        return c();
      },
      children: (C) => d(na, {
        feed: C,
        get heating() {
          return e.heating;
        }
      })
    })), s(m, d(ie, {
      icon: "mdi:home-outline"
    }), h), s(h, () => n("nxHome")), s(v, () => n("nxLive", {
      n: l().length,
      m: l().length
    })), s(S, d(B, {
      get each() {
        return f();
      },
      children: (C) => d(na, {
        feed: C,
        get heating() {
          return e.heating;
        }
      })
    })), s(_, d(B, {
      get each() {
        return l();
      },
      children: (C) => (() => {
        var y = pd();
        return y.firstChild, s(y, () => C.label, null), W(() => dt(y, C.type)), y;
      })()
    })), W((C) => {
      var y = f().length === 0, z = String(Math.max(f().length, 1));
      return y !== C.e && b.classList.toggle("single", C.e = y), z !== C.t && H(b, "--stack", C.t = z), C;
    }, {
      e: void 0,
      t: void 0
    }), x;
  })();
}
function na(e) {
  return (() => {
    var t = ud(), r = t.firstChild, n = r.nextSibling, a = n.nextSibling, o = a.nextSibling;
    return L(r, "draggable", !1), s(n, () => e.feed.label), s(a, () => e.feed.value), s(o, () => e.feed.detail), W((i) => {
      var l = `k-nx-feed ${e.feed.type}`, c = e.feed.type, f = !!(e.feed.type === "gas" && e.heating), g = e.feed.type === "electric" ? fe.bolt : e.feed.type === "water" ? fe.watermeter : fe.flame;
      return l !== i.e && dt(t, i.e = l), c !== i.t && L(t, "data-feed", i.t = c), f !== i.a && t.classList.toggle("heating", i.a = f), g !== i.o && L(r, "src", i.o = g), i;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), t;
  })();
}
var hd = /* @__PURE__ */ u("<span class=k-tone-pill>"), md = /* @__PURE__ */ u('<div class="k-well k-metric sm"><span></span><strong> p'), bd = /* @__PURE__ */ u('<div class="k-well k-metric sm gas"><span></span><strong> p'), xd = /* @__PURE__ */ u("<b><small> W"), wd = /* @__PURE__ */ u('<article class="k-tile k-energy-hero"><section class=k-energy-prices><div class=k-energy-big><b></b><span>p/kWh</span></div><div class=k-energy-wells></div></section><section class=k-energy-ring>'), kd = /* @__PURE__ */ u("<div class=k-bars role=img>"), yd = /* @__PURE__ */ u("<p class=k-slots-hint>"), vd = /* @__PURE__ */ u('<article class="k-tile k-slots"><header class=k-panel-head><div><span class=k-panel-kicker style=color:#86e6ec></span><h3></h3></div><span class=k-panel-icon style=color:#86e6ec>'), _d = /* @__PURE__ */ u("<p class=k-sub>—"), $d = /* @__PURE__ */ u("<small>"), zd = /* @__PURE__ */ u("<div class=k-bar-col><i>"), Sd = /* @__PURE__ */ u('<article class="k-tile k-energy-today"><header class=k-panel-head><div><span class=k-panel-kicker style=color:#86e6ec></span><h3></h3></div></header><div class=k-today-grid>'), Cd = /* @__PURE__ */ u('<div class="k-well k-metric sm"><span></span><strong>');
const Td = 4;
function Pd(e, t, r = 48) {
  if (!e) return [];
  const n = Date.now();
  return [t.ratesToday, t.ratesTomorrow].flatMap((o) => (o && e.states[o]?.attributes.rates) ?? []).map((o) => ({
    start: new Date(o.start),
    end: new Date(o.end),
    p: Number(o.value_inc_vat) * 100
  })).filter((o) => o.end.getTime() > n && Number.isFinite(o.p)).sort((o, i) => o.start.getTime() - i.start.getTime()).slice(0, r);
}
function Md(e, t = Td) {
  const r = Math.min(t, e.length);
  if (!r) return;
  let n = {
    index: 0,
    sum: Number.POSITIVE_INFINITY
  };
  for (let a = 0; a + r <= e.length; a++) {
    const o = e.slice(a, a + r).reduce((i, l) => i + l.p, 0);
    o < n.sum && (n = {
      index: a,
      sum: o
    });
  }
  return {
    index: n.index,
    size: r,
    avg: n.sum / r
  };
}
const Rt = (e, t) => V(e, e !== void 0 && Math.abs(e) < 10 ? 2 : 1, t), Lt = (e, t) => e ? new Intl.DateTimeFormat(t, {
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(e)) : "";
function Ed(e, t, r) {
  if (t === void 0) return {
    tone: "normal",
    label: ""
  };
  if (t < 0) return {
    tone: "negative",
    label: e("negative")
  };
  const n = r ?? 25;
  return t <= n * 0.75 ? {
    tone: "cheap",
    label: e("cheap")
  } : t >= n * 1.25 ? {
    tone: "pricey",
    label: e("pricey")
  } : {
    tone: "normal",
    label: e("normal")
  };
}
function ra(e, t, r) {
  const n = t ? e?.states[t] : void 0, a = q(n?.state);
  if (a === void 0) return;
  const o = String(n?.attributes.unit_of_measurement ?? "GBP");
  try {
    return new Intl.NumberFormat(r, {
      style: "currency",
      currency: o
    }).format(a);
  } catch {
    return `${V(a, 2, r)} ${o}`;
  }
}
function aa(e, t, r) {
  const n = t ? e?.states[t] : void 0, a = q(n?.state);
  return a === void 0 ? void 0 : `${V(a, a < 10 ? 2 : 1, r)} ${n?.attributes.unit_of_measurement ?? ""}`.trim();
}
re({
  type: "energy-hero",
  sizes: {
    lg: {
      w: 12,
      h: 4
    },
    md: {
      w: 8,
      h: 6
    },
    sm: {
      w: 4,
      h: 12
    }
  },
  component: (e) => {
    const t = de(), r = ae(), n = () => e.config.ids, a = (b) => b ? t()?.states[b] : void 0, o = () => {
      const b = q(a(n().elecRate)?.state);
      return b === void 0 ? void 0 : b * 100;
    }, i = () => {
      const b = q(a(n().elecRate)?.attributes.current_day_average_rate ?? a(n().ratesToday)?.attributes.average_rate);
      return b === void 0 ? void 0 : b * 100;
    }, l = () => a(n().elecNext), c = () => {
      const b = q(l()?.state);
      return b === void 0 ? void 0 : b * 100;
    }, f = () => {
      const b = q(a(n().gasRate)?.state);
      return b === void 0 ? void 0 : b * 100;
    }, g = () => {
      const b = a(n().demand), k = q(b?.state);
      return k !== void 0 && b?.attributes.unit_of_measurement === "kW" ? k * 1e3 : k;
    }, p = () => Ed(r, o(), i()), x = K(() => Object.values(t()?.states ?? {}).some((b) => be(b.entity_id) === "climate" && b.attributes.hvac_action === "heating"));
    return (() => {
      var b = wd(), k = b.firstChild, m = k.firstChild, h = m.firstChild, v = m.nextSibling, S = k.nextSibling;
      return s(k, d(it, {
        get children() {
          return r("energyNow");
        }
      }), m), s(h, () => Rt(o(), r.lang())), s(k, d(N, {
        get when() {
          return p().label;
        },
        get children() {
          var _ = hd();
          return s(_, () => p().label), _;
        }
      }), v), s(v, d(N, {
        get when() {
          return c() !== void 0;
        },
        get children() {
          var _ = md(), $ = _.firstChild, C = $.nextSibling, y = C.firstChild;
          return s($, () => r("nextRate", {
            t: Lt(l()?.attributes.start, r.lang())
          })), s(C, () => Rt(c(), r.lang()), y), _;
        }
      }), null), s(v, d(N, {
        get when() {
          return f() !== void 0;
        },
        get children() {
          var _ = bd(), $ = _.firstChild, C = $.nextSibling, y = C.firstChild;
          return s($, () => r("gasPrice")), s(C, () => Rt(f(), r.lang()), y), _;
        }
      }), null), s(b, d(gd, {
        get ids() {
          return n();
        },
        get demand() {
          return g();
        },
        get rateP() {
          return o();
        },
        get heating() {
          return x();
        }
      }), S), s(S, d(it, {
        get children() {
          return r("demandNow");
        }
      }), null), s(S, d(Ja, {
        get value() {
          return g();
        },
        min: 0,
        max: 3e3,
        size: 150,
        get tone() {
          return (g() ?? 0) > 2e3 ? "warm" : "ice";
        },
        get children() {
          var _ = xd(), $ = _.firstChild;
          return s(_, () => V(g(), 0, r.lang()), $), _;
        }
      }), null), W(() => L(b, "data-tone", p().tone)), b;
    })();
  }
});
re({
  type: "energy-slots",
  sizes: {
    lg: {
      w: 8,
      h: 3
    },
    md: {
      w: 8,
      h: 3
    },
    sm: {
      w: 4,
      h: 4
    }
  },
  component: (e) => {
    const t = de(), r = ae(), n = K(() => Pd(t(), e.config.ids)), a = K(() => Md(n())), o = () => {
      const f = n().map((g) => g.p);
      return {
        min: Math.min(0, ...f),
        max: Math.max(1, ...f)
      };
    }, i = (f) => {
      const {
        min: g,
        max: p
      } = o();
      return `${Math.max(6, (f - g) / (p - g) * 100)}%`;
    }, l = (f) => !!a() && f >= a().index && f < a().index + a().size, c = () => {
      const f = a();
      if (!f) return "";
      const g = n()[f.index].start, p = n()[f.index + f.size - 1].end;
      return r("cheapestHint", {
        from: Lt(g, r.lang()),
        to: Lt(p, r.lang()),
        v: Rt(f.avg, r.lang())
      });
    };
    return (() => {
      var f = vd(), g = f.firstChild, p = g.firstChild, x = p.firstChild, b = x.nextSibling, k = p.nextSibling;
      return s(x, () => r("slotsKicker")), s(b, () => r("slotsTitle")), s(k, d(ie, {
        icon: "mdi:chart-timeline-variant"
      })), s(f, d(N, {
        get when() {
          return n().length;
        },
        get fallback() {
          return _d();
        },
        get children() {
          return [(() => {
            var m = kd();
            return s(m, d(B, {
              get each() {
                return n();
              },
              children: (h, v) => (() => {
                var S = zd(), _ = S.firstChild;
                return s(S, d(N, {
                  get when() {
                    return v() % 6 === 0;
                  },
                  get children() {
                    var $ = $d();
                    return s($, (() => {
                      var C = F(() => v() === 0);
                      return () => C() ? r("nowMarker") : Lt(h.start, r.lang());
                    })()), $;
                  }
                }), null), W(($) => {
                  var C = !!l(v()), y = v() === 0, z = h.p < 0, T = `${Lt(h.start, r.lang())} · ${Rt(h.p, r.lang())} p`, P = i(h.p);
                  return C !== $.e && S.classList.toggle("best", $.e = C), y !== $.t && S.classList.toggle("now", $.t = y), z !== $.a && S.classList.toggle("neg", $.a = z), T !== $.o && L(S, "title", $.o = T), P !== $.i && H(_, "height", $.i = P), $;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0,
                  o: void 0,
                  i: void 0
                }), S;
              })()
            })), W(() => L(m, "aria-label", c())), m;
          })(), (() => {
            var m = yd();
            return s(m, d(ie, {
              icon: "mdi:washing-machine"
            }), null), s(m, c, null), m;
          })()];
        }
      }), null), f;
    })();
  }
});
re({
  type: "energy-today",
  sizes: {
    lg: {
      w: 4,
      h: 3
    },
    md: {
      w: 8,
      h: 2
    },
    sm: {
      w: 4,
      h: 3
    }
  },
  component: (e) => {
    const t = de(), r = ae(), n = () => e.config.ids, a = () => [{
      label: r("elecCost"),
      value: ra(t(), n().elecCost, r.lang()),
      gas: !1
    }, {
      label: r("elecUse"),
      value: aa(t(), n().elecUse, r.lang()),
      gas: !1
    }, {
      label: r("gasCost"),
      value: ra(t(), n().gasCost, r.lang()),
      gas: !0
    }, {
      label: r("gasUse"),
      value: aa(t(), n().gasUse, r.lang()),
      gas: !0
    }].filter((o) => o.value !== void 0);
    return (() => {
      var o = Sd(), i = o.firstChild, l = i.firstChild, c = l.firstChild, f = c.nextSibling, g = i.nextSibling;
      return s(c, () => r("todayKicker")), s(f, () => r("todayTitle")), s(g, d(B, {
        get each() {
          return a();
        },
        children: (p) => (() => {
          var x = Cd(), b = x.firstChild, k = b.nextSibling;
          return s(b, () => p.label), s(k, () => p.value), W(() => x.classList.toggle("gas", !!p.gas)), x;
        })()
      })), o;
    })();
  }
});
const Ld = {
  0: "phReady",
  1: "phWash",
  2: "phWash",
  3: "phSpin",
  4: "phRinse",
  5: "phRinse",
  6: "phRinse",
  7: "phDry",
  9: "phSteam",
  10: "phReady",
  11: "phSpin",
  12: "phWeigh",
  13: "phWeigh",
  14: "phWash",
  15: "phWash",
  16: "phWash",
  17: "phRinse",
  18: "phRinse",
  19: "phScheduled",
  20: "phTumble",
  24: "phRefresh",
  25: "phWash",
  26: "phHeat",
  27: "phWash"
}, Ad = {
  0: "phReady",
  1: "phHeat",
  2: "phDry",
  3: "phCool",
  13: "phCool",
  14: "phHeat",
  15: "phHeat",
  16: "phCool",
  18: "phTumble",
  19: "phDry",
  20: "phDry"
}, Rd = {
  running: "running",
  paused: "paused",
  done: "laundryDone",
  alarm: "alarm",
  idle: "standby",
  off: "applianceOff",
  missing: "unavailable"
};
function Od(e, t, r, n) {
  const a = (_) => _ ? e?.states[_] : void 0, o = a(t.status)?.state ?? "unavailable", i = q(a(t.remaining)?.state), l = q(a(t.total)?.state), c = q(a(t.progress)?.state);
  let f;
  o === "unavailable" || o === "unknown" ? f = "missing" : /run|wash|dry|spin|rinse|active|on$/.test(o) ? f = "running" : /pause/.test(o) ? f = "paused" : /finish|done|end|complete/.test(o) ? f = "done" : /alarm|error|fault/.test(o) ? f = "alarm" : o === "off" ? f = "off" : f = "idle";
  const g = f === "running" || f === "paused", p = c !== void 0 ? c / 100 : g && i !== void 0 && l ? Math.min(1, Math.max(0, (l - i) / l)) : f === "done" ? 1 : void 0, x = a(t.phase)?.state, b = x !== void 0 && /^\d+$/.test(x) ? Number(x) : void 0, k = r ? Ad : Ld, m = !g || x === void 0 || x === "unavailable" ? void 0 : b !== void 0 ? k[b] ? n(k[b]) : n("phaseN", { n: b }) : x, h = a(t.finish)?.state, v = h && !Number.isNaN(Date.parse(h)) ? new Date(h) : g && i !== void 0 ? new Date(Date.now() + i * 6e4) : void 0, S = a(t.program)?.state;
  return {
    mode: f,
    status: n(Rd[f]),
    phase: m,
    remaining: g ? i : void 0,
    total: l,
    progress: p,
    finish: v,
    program: S && S !== "unavailable" && S !== "unknown" ? S : void 0
  };
}
var Nd = /* @__PURE__ */ u("<div class=k-appliance-big><small> min"), jd = /* @__PURE__ */ u("<span class=k-appliance-finish>"), ia = /* @__PURE__ */ u('<div class="k-well k-metric sm"><span></span><strong>'), Dd = /* @__PURE__ */ u('<div class="k-well k-metric sm"><span></span><strong>%'), Wd = /* @__PURE__ */ u('<article class="k-tile k-appliance"role=button tabindex=0><div class=k-appliance-ring><svg viewBox="0 0 196 196"aria-hidden=true><defs><linearGradient id=k-app-run x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#bff1ff></stop><stop offset=0.55 stop-color=#5fdbff></stop><stop offset=1 stop-color=#159dec></stop></linearGradient><linearGradient id=k-app-done x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color=#c9ffe3></stop><stop offset=1 stop-color=#3fcf8e></stop></linearGradient></defs><circle class=k-ring-track cx=98 cy=98 r=89.5 stroke-width=9></circle><circle class=k-appliance-fill cx=98 cy=98 r=89.5 stroke-width=9 transform="rotate(-90 98 98)"></circle></svg><span class=k-appliance-glow></span><img alt></div><div class=k-appliance-copy><h3></h3><div class=k-appliance-wells>'), Gd = /* @__PURE__ */ u('<div class="k-appliance-big muted">');
const Id = 196, Bd = 9;
re({
  type: "appliance",
  sizes: {
    lg: {
      w: 6,
      h: 4
    },
    md: {
      w: 4,
      h: 6
    },
    sm: {
      w: 4,
      h: 6
    }
  },
  component: (e) => {
    const t = de(), r = Vt(), n = ae(), a = K(() => Od(t(), e.config.ids, e.config.dryer, n)), o = (Id - Bd) / 2 - 4, i = 2 * Math.PI * o, l = (c) => c ? new Intl.DateTimeFormat(n.lang(), {
      hour: "2-digit",
      minute: "2-digit"
    }).format(c) : "";
    return (() => {
      var c = Wd(), f = c.firstChild, g = f.firstChild, p = g.firstChild, x = p.nextSibling, b = x.nextSibling, k = g.nextSibling, m = k.nextSibling, h = f.nextSibling, v = h.firstChild, S = v.nextSibling;
      return c.$$click = () => e.config.ids.status && r(e.config.ids.status), L(b, "stroke-dasharray", `${i}`), L(m, "draggable", !1), s(h, d(it, {
        get children() {
          return a().status;
        }
      }), v), s(v, (() => {
        var _ = F(() => !!e.config.dryer);
        return () => _() ? n("dryer") : n("washer");
      })()), s(h, d(N, {
        get when() {
          return a().remaining !== void 0;
        },
        get fallback() {
          return (() => {
            var _ = Gd();
            return s(_, () => a().status), _;
          })();
        },
        get children() {
          return [(() => {
            var _ = Nd(), $ = _.firstChild;
            return s(_, () => V(a().remaining, 0, n.lang()), $), _;
          })(), (() => {
            var _ = jd();
            return s(_, () => n("finishAt", {
              t: l(a().finish)
            })), _;
          })()];
        }
      }), S), s(S, d(N, {
        get when() {
          return a().phase;
        },
        get children() {
          var _ = ia(), $ = _.firstChild, C = $.nextSibling;
          return s($, () => n("phase")), s(C, () => a().phase), _;
        }
      }), null), s(S, d(N, {
        get when() {
          return a().progress !== void 0;
        },
        get children() {
          var _ = Dd(), $ = _.firstChild, C = $.nextSibling, y = C.firstChild;
          return s($, () => n("progress")), s(C, () => V((a().progress ?? 0) * 100, 0, n.lang()), y), _;
        }
      }), null), s(S, d(N, {
        get when() {
          return a().program;
        },
        get children() {
          var _ = ia(), $ = _.firstChild, C = $.nextSibling;
          return s($, () => n("program")), s(C, () => a().program), _;
        }
      }), null), W((_) => {
        var $ = a().mode, C = !!e.config.dryer, y = a().mode === "done" ? "url(#k-app-done)" : "url(#k-app-run)", z = `${i * (1 - (a().progress ?? 0))}`, T = e.config.dryer ? fe.dryer : fe.washer;
        return $ !== _.e && L(c, "data-mode", _.e = $), C !== _.t && c.classList.toggle("dryer", _.t = C), y !== _.a && L(b, "stroke", _.a = y), z !== _.o && L(b, "stroke-dashoffset", _.o = z), T !== _.i && L(m, "src", _.i = T), _;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), c;
    })();
  }
});
ot(["click"]);
const ln = 92, Vn = 28, qn = 26, Fd = [0, 26, 44, 64, 88, 116], Hd = [-90, -45, -135, 0, 180, 45, 135, 90], Kd = (e, t) => e.l < t.r && e.r > t.l && e.t < t.b && e.b > t.t;
function Ud(e, t, r, n) {
  const a = [];
  n && a.push({ l: n.x - 22, t: n.y - 22, r: n.x + 22, b: n.y + 22 });
  for (const i of e) a.push({ l: i.x - 9, t: i.y - 9, r: i.x + 9, b: i.y + 9 });
  const o = [];
  for (const i of [...e].sort((l, c) => l.rank - c.rank)) {
    const l = a.filter((p) => !(Math.abs((p.l + p.r) / 2 - i.x) < 0.5 && Math.abs((p.t + p.b) / 2 - i.y) < 0.5));
    let c;
    e: for (const p of Fd)
      for (const x of p === 0 ? [0] : Hd) {
        const b = x * Math.PI / 180, k = i.x + Math.cos(b) * p, m = i.y - qn + Math.sin(b) * p, h = { l: k - ln / 2, t: m - Vn / 2, r: k + ln / 2, b: m + Vn / 2 };
        if (!(h.l < 2 || h.t < 2 || h.r > t - 2 || h.b > r - 2) && !l.some((v) => Kd(v, h))) {
          c = { cx: k, cy: m }, a.push(h);
          break e;
        }
      }
    const f = {
      cx: Math.min(t - ln / 2 - 2, Math.max(ln / 2 + 2, i.x)),
      cy: Math.max(Vn / 2 + 2, i.y - qn)
    }, g = c ?? f;
    o.push({ ...i, ...g, moved: Math.hypot(g.cx - i.x, g.cy - (i.y - qn)) > 4 });
  }
  return o;
}
var Vd = /* @__PURE__ */ u("<span class=k-brand>");
const qd = {
  TESCO: {
    label: "TESCO",
    bg: "#ffffff",
    fg: "#00539f",
    accent: "#ee1c2e"
  },
  ASDA: {
    label: "ASDA",
    bg: "#78be20",
    fg: "#ffffff"
  },
  JET: {
    label: "JET",
    bg: "#ffd200",
    fg: "#111111"
  },
  ESSO: {
    label: "Esso",
    bg: "#ffffff",
    fg: "#e4002b"
  },
  SHELL: {
    label: "Shell",
    bg: "#ffd500",
    fg: "#dd1d21"
  },
  BP: {
    label: "bp",
    bg: "#007f3e",
    fg: "#ffe600"
  },
  MORRISONS: {
    label: "M",
    bg: "#ffe500",
    fg: "#00563f"
  },
  SAINSBURYS: {
    label: "S",
    bg: "#f06c00",
    fg: "#ffffff"
  },
  TEXACO: {
    label: "TEXACO",
    bg: "#e2001a",
    fg: "#ffffff"
  },
  GULF: {
    label: "Gulf",
    bg: "#f68b1f",
    fg: "#003d7c"
  },
  APPLEGREEN: {
    label: "ag",
    bg: "#8dc63f",
    fg: "#ffffff"
  },
  MURCO: {
    label: "Murco",
    bg: "#d7141a",
    fg: "#ffffff"
  },
  VALERO: {
    label: "Valero",
    bg: "#00447c",
    fg: "#ffb81c"
  },
  COSTCO: {
    label: "Costco",
    bg: "#e31837",
    fg: "#ffffff"
  }
};
function Yd(e) {
  const t = (e ?? "").toUpperCase().replace(/[^A-Z]/g, ""), r = Object.entries(qd).find(([a]) => t.startsWith(a));
  return r ? r[1] : {
    label: (e ?? "?").trim().slice(0, 6),
    bg: "linear-gradient(145deg,#a5b4c7,#647890)",
    fg: "#f4f8ff"
  };
}
function _r(e) {
  const t = () => Yd(e.brand);
  return (() => {
    var r = Vd();
    return s(r, () => t().label), W((n) => {
      var a = e.size === "sm", o = t().bg, i = t().fg, l = t().accent ?? "transparent";
      return a !== n.e && r.classList.toggle("sm", n.e = a), o !== n.t && H(r, "background", n.t = o), i !== n.a && H(r, "color", n.a = i), l !== n.o && H(r, "border-bottom-color", n.o = l), n;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0
    }), r;
  })();
}
const ai = 15 * 6e4, pr = { limit: 5, radius: 10, unit: "mi", sort: "price" }, Zd = 20, [$r, oa] = J({ loading: !1 }), [Ye, sa] = J("B7"), [hn, bt] = J();
let ur, Tt, Yn = 0, la = 0, Zn = "";
async function ii(e, t, r, n) {
  if (!e.connection) throw new Error("no websocket connection");
  let a;
  for (const o of t)
    try {
      const i = await e.connection.sendMessagePromise({
        type: "call_service",
        domain: o,
        service: r,
        service_data: n,
        return_response: !0
      });
      if (i?.response) return i.response;
      a = new Error(`${o}.${r} returned no response`);
    } catch (i) {
      a = i;
    }
  throw a ?? new Error(`${r} failed`);
}
const Qd = (e) => e?.message ?? String(e);
async function ca(e, t) {
  try {
    return await ii(e, ["glasshome_fuel", "fuel_prices"], "search", { ...pr, fuel: t });
  } catch (r) {
    console.warn(`[krystal] fuel search ${t} failed`, r);
    return;
  }
}
async function Xd(e, t, r) {
  const n = t.find((c) => c?.centre?.latitude !== void 0)?.centre, a = /* @__PURE__ */ new Map();
  for (const c of t)
    for (const f of (c?.stations ?? []).slice(0, 5)) {
      if (f.latitude === void 0 || f.longitude === void 0) continue;
      const g = String(f.id);
      a.has(g) || a.set(g, { id: g, latitude: f.latitude, longitude: f.longitude });
    }
  const o = [...a.values()].slice(0, Zd);
  if (!n || !o.length) return { map: void 0, mapError: "no stations" };
  const i = `${n.latitude},${n.longitude}|${o.map((c) => c.id).sort().join(",")}`, l = $r();
  if (!r && i === Zn && l.map) return { map: l.map };
  try {
    const c = await ii(e, ["glasshome_fuel"], "map", {
      home: { latitude: n.latitude, longitude: n.longitude },
      stations: o,
      radius: pr.radius,
      unit: pr.unit
    });
    if (!c?.image) throw new Error("map response without image");
    return Zn = i, { map: { ...c, pins: (c.pins ?? []).map((f) => ({ ...f, id: String(f.id) })) } };
  } catch (c) {
    return console.warn("[krystal] fuel map failed, showing radar", c), Zn = "", { map: void 0, mapError: Qd(c) };
  }
}
async function da(e = !1) {
  const t = ur;
  if (!t || $r().loading || !e && Date.now() - la < ai - 5e3) return;
  la = Date.now(), oa((o) => ({ ...o, loading: !0 }));
  const [r, n] = await Promise.all([ca(t, "B7"), ca(t, "E10")]), a = await Xd(t, [r, n], e);
  oa({ B7: r, E10: n, ...a, loading: !1, updated: /* @__PURE__ */ new Date(), error: r || n ? void 0 : "empty" });
}
function zr() {
  const e = de();
  return ft(() => {
    ur = e(), ur && da();
  }), Yn += 1, Tt || (Tt = setInterval(() => void da(!0), ai)), Be(() => {
    Yn -= 1, Yn <= 0 && Tt && (clearInterval(Tt), Tt = void 0);
  }), $r;
}
function Gt(e, t) {
  const r = /* @__PURE__ */ new Map();
  for (const a of [e.B7, e.E10])
    for (const o of a?.stations ?? []) {
      const i = String(o.id), l = r.get(i);
      r.set(i, { ...l, ...o, id: i, prices: { ...l?.prices, ...o.prices } });
    }
  const n = (a) => a.prices?.[t] ?? Number.POSITIVE_INFINITY;
  return [...r.values()].filter((a) => Number.isFinite(n(a))).sort((a, o) => n(a) - n(o));
}
function oi(e) {
  return `https://www.google.com/maps/dir/?api=1&destination=${e.latitude !== void 0 && e.longitude !== void 0 ? `${e.latitude},${e.longitude}` : encodeURIComponent(e.address ?? "")}`;
}
const Jd = /(SHIRE|^ESSEX|^KENT|^SURREY|^NORFOLK|^SUFFOLK|^CORNWALL|^DEVON|^LONDON$|^GREATER )/;
function fa(e) {
  return e.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (t) => t.toUpperCase());
}
function ef(e) {
  const r = (e.address ?? "").split(",").map((i) => i.trim()).filter(Boolean).filter((i) => !/\d/.test(i) && i.length > 2), n = [...r].reverse().find((i) => !Jd.test(i)) ?? "", a = (e.brand ?? "").trim().toUpperCase(), o = r.find((i) => i !== n && i.toUpperCase() !== a) ?? "";
  return { name: fa(o), town: fa(n) };
}
var tf = /* @__PURE__ */ u("<span class=k-fuel-where>"), nf = /* @__PURE__ */ u('<div class="k-well k-fuel-best"><img alt><div class=k-fuel-best-copy><span class=k-fuel-label></span><b><small>p'), rf = /* @__PURE__ */ u("<div class=k-fuel-pair>"), af = /* @__PURE__ */ u("<span class=k-fuel-foot> · <!> mi"), of = /* @__PURE__ */ u('<article class="k-tile k-fuelcard"><header class=k-panel-head><div><span class=k-panel-kicker style=color:#a8e7c8></span><h3></h3></div><span class=k-panel-icon style=color:#a8e7c8>'), si = /* @__PURE__ */ u("<p class=k-sub>"), sf = /* @__PURE__ */ u("<ol class=k-station-list>"), lf = /* @__PURE__ */ u('<article class="k-tile k-stations"><header class=k-panel-head><div><span class=k-panel-kicker style=color:#a8e7c8></span><h3></h3></div><div class="k-seg k-fuel-tabs"><button type=button></button><button type=button>'), cf = /* @__PURE__ */ u('<li><a class="k-well k-station"target=_blank rel="noopener noreferrer"><span class=k-station-rank></span><span class=k-station-copy><b></b><small></small></span><span class=k-station-price><small></small><b>p</b></span><span class="k-station-price petrol"><small></small><b>p</b></span><span class=k-station-dist></span><span class=k-station-go aria-hidden=true>'), df = /* @__PURE__ */ u("<svg class=k-pin-leaders aria-hidden=true>"), ff = /* @__PURE__ */ u("<span class=k-radar-home>"), pf = /* @__PURE__ */ u("<svg><line></svg>", !1, !0, !1), uf = /* @__PURE__ */ u("<span class=k-pin-dot>"), gf = /* @__PURE__ */ u('<a class=k-pin target=_blank rel="noopener noreferrer"><b>'), hf = /* @__PURE__ */ u("<span class=k-map-radius>"), mf = /* @__PURE__ */ u("<div class=k-mapimg><div class=k-mapframe><img alt>"), bf = /* @__PURE__ */ u('<article class="k-tile k-fuelmap"><header class=k-panel-head><div><span class=k-panel-kicker style=color:#a8e7c8></span><h3> · <!> mi'), xf = /* @__PURE__ */ u('<div class=k-radar><span class="k-radar-ring r1"></span><span class="k-radar-ring r2"></span><span class="k-radar-ring r3"></span><span class=k-radar-scale> mi'), wf = /* @__PURE__ */ u('<div class="k-mapimg loading">');
const It = (e, t) => V(e, 1, t), li = (e, t) => e === void 0 ? "" : `${V(e, 1, t)} mi`;
function pa(e) {
  const t = ae();
  return (() => {
    var r = nf(), n = r.firstChild, a = n.nextSibling, o = a.firstChild, i = o.nextSibling, l = i.firstChild;
    return L(n, "draggable", !1), s(o, (() => {
      var c = F(() => e.code === "B7");
      return () => c() ? t("diesel") : t("petrol");
    })()), s(i, () => It(e.station?.prices?.[e.code], t.lang()), l), s(a, d(N, {
      get when() {
        return e.station;
      },
      get children() {
        var c = tf();
        return s(c, d(_r, {
          get brand() {
            return e.station.brand;
          },
          size: "sm"
        }), null), s(c, () => li(e.station.distance, t.lang()), null), c;
      }
    }), null), W((c) => {
      var f = e.code, g = e.code === "B7" ? fe["pump-diesel"] : fe["pump-petrol"];
      return f !== c.e && L(r, "data-fuel", c.e = f), g !== c.t && L(n, "src", c.t = g), c;
    }, {
      e: void 0,
      t: void 0
    }), r;
  })();
}
re({
  type: "fuelcard",
  sizes: {
    lg: {
      w: 6,
      h: 3
    },
    md: {
      w: 8,
      h: 3
    },
    sm: {
      w: 4,
      h: 4
    }
  },
  component: (e) => {
    const t = zr(), {
      navigate: r
    } = pt(), n = ae(), a = () => Gt(t(), "B7")[0], o = () => Gt(t(), "E10")[0], i = () => t().updated ? new Intl.DateTimeFormat(n.lang(), {
      hour: "2-digit",
      minute: "2-digit"
    }).format(t().updated) : "";
    return (() => {
      var l = of(), c = l.firstChild, f = c.firstChild, g = f.firstChild, p = g.nextSibling, x = f.nextSibling;
      return l.$$click = () => e.config.link && r(Za), s(g, () => n("fuelKicker")), s(p, () => n("cheapestNearby")), s(x, d(ie, {
        icon: "mdi:gas-station"
      })), s(l, d(N, {
        get when() {
          return a() || o();
        },
        get fallback() {
          return (() => {
            var b = si();
            return s(b, (() => {
              var k = F(() => !!t().loading);
              return () => k() ? "…" : n("noFuel");
            })()), b;
          })();
        },
        get children() {
          var b = rf();
          return s(b, d(pa, {
            code: "B7",
            get station() {
              return a();
            }
          }), null), s(b, d(pa, {
            code: "E10",
            get station() {
              return o();
            }
          }), null), b;
        }
      }), null), s(l, d(N, {
        get when() {
          return i();
        },
        get children() {
          var b = af(), k = b.firstChild, m = k.nextSibling;
          return m.nextSibling, s(b, () => n("updatedAt", {
            t: i()
          }), k), s(b, () => t().B7?.radius ?? 10, m), b;
        }
      }), null), W((b) => {
        var k = !!e.config.link, m = e.config.link ? "button" : void 0, h = e.config.link ? "0" : void 0;
        return k !== b.e && l.classList.toggle("link", b.e = k), m !== b.t && L(l, "role", b.t = m), h !== b.a && L(l, "tabindex", b.a = h), b;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), l;
    })();
  }
});
re({
  type: "fuelstations",
  sizes: {
    lg: {
      w: 7,
      h: 6
    },
    md: {
      w: 8,
      h: 6
    },
    sm: {
      w: 4,
      h: 8
    }
  },
  component: () => {
    const e = zr(), t = ae(), r = K(() => Gt(e(), Ye()).slice(0, 5));
    return (() => {
      var n = lf(), a = n.firstChild, o = a.firstChild, i = o.firstChild, l = i.nextSibling, c = o.nextSibling, f = c.firstChild, g = f.nextSibling;
      return s(i, () => t("fuelKicker")), s(l, () => t("stations")), f.$$click = () => sa("B7"), s(f, () => t("dieselShort")), g.$$click = () => sa("E10"), s(g, () => t("petrolShort")), s(n, d(N, {
        get when() {
          return r().length;
        },
        get fallback() {
          return (() => {
            var p = si();
            return s(p, (() => {
              var x = F(() => !!e().loading);
              return () => x() ? "…" : t("noFuel");
            })()), p;
          })();
        },
        get children() {
          var p = sf();
          return s(p, d(B, {
            get each() {
              return r();
            },
            children: (x, b) => {
              const k = () => ef(x);
              return (() => {
                var m = cf(), h = m.firstChild, v = h.firstChild, S = v.nextSibling, _ = S.firstChild, $ = _.nextSibling, C = S.nextSibling, y = C.firstChild, z = y.nextSibling, T = z.firstChild, P = C.nextSibling, w = P.firstChild, R = w.nextSibling, A = R.firstChild, E = P.nextSibling, j = E.nextSibling;
                return m.addEventListener("mouseleave", () => bt(void 0)), m.addEventListener("mouseenter", () => bt(x.id)), h.addEventListener("blur", () => bt(void 0)), h.addEventListener("focus", () => bt(x.id)), s(v, () => b() + 1), s(h, d(_r, {
                  get brand() {
                    return x.brand;
                  }
                }), S), s(_, () => (x.brand ?? "").trim()), s($, () => [k().name, k().town].filter(Boolean).join(", ")), s(y, () => t("dieselShort")), s(z, () => It(x.prices?.B7, t.lang()), T), s(w, () => t("petrolShort")), s(R, () => It(x.prices?.E10, t.lang()), A), s(E, () => li(x.distance, t.lang())), s(j, d(ie, {
                  icon: "mdi:navigation-variant-outline"
                })), W((M) => {
                  var O = hn() === x.id, G = oi(x), D = `${t("directions")}: ${x.brand ?? ""}`, U = Ye() === "B7", oe = Ye() === "E10";
                  return O !== M.e && h.classList.toggle("hot", M.e = O), G !== M.t && L(h, "href", M.t = G), D !== M.a && L(h, "aria-label", M.a = D), U !== M.o && C.classList.toggle("active", M.o = U), oe !== M.i && P.classList.toggle("active", M.i = oe), M;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0,
                  o: void 0,
                  i: void 0
                }), m;
              })();
            }
          })), p;
        }
      }), null), W((p) => {
        var x = Ye() === "B7", b = Ye() === "E10";
        return x !== p.e && f.classList.toggle("selected", p.e = x), b !== p.t && g.classList.toggle("selected", p.t = b), p;
      }, {
        e: void 0,
        t: void 0
      }), n;
    })();
  }
});
function ua(e) {
  const t = ae(), r = K(() => Ud(e.points.map((o) => ({
    id: o.station.id,
    rank: o.rank,
    x: o.x,
    y: o.y
  })), e.width, e.height, e.home)), n = (o) => e.points.find((i) => i.station.id === o).station, a = () => [...r()].sort((o, i) => i.rank - o.rank);
  return [(() => {
    var o = df();
    return s(o, d(B, {
      get each() {
        return r().filter((i) => i.moved);
      },
      children: (i) => (() => {
        var l = pf();
        return W((c) => {
          var f = i.x, g = i.y, p = i.cx, x = i.cy, b = hn() === i.id;
          return f !== c.e && L(l, "x1", c.e = f), g !== c.t && L(l, "y1", c.t = g), p !== c.a && L(l, "x2", c.a = p), x !== c.o && L(l, "y2", c.o = x), b !== c.i && l.classList.toggle("hot", c.i = b), c;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0
        }), l;
      })()
    })), W((i) => {
      var l = e.width, c = e.height;
      return l !== i.e && L(o, "width", i.e = l), c !== i.t && L(o, "height", i.t = c), i;
    }, {
      e: void 0,
      t: void 0
    }), o;
  })(), d(N, {
    get when() {
      return e.home;
    },
    get children() {
      var o = ff();
      return s(o, d(ie, {
        icon: "mdi:home"
      })), W((i) => {
        var l = `${e.home.x}px`, c = `${e.home.y}px`;
        return l !== i.e && H(o, "left", i.e = l), c !== i.t && H(o, "top", i.t = c), i;
      }, {
        e: void 0,
        t: void 0
      }), o;
    }
  }), d(B, {
    get each() {
      return a();
    },
    children: (o) => (() => {
      var i = uf();
      return s(i, () => o.rank), W((l) => {
        var c = o.rank, f = o.rank === 1, g = hn() === o.id, p = `${o.x}px`, x = `${o.y}px`;
        return c !== l.e && L(i, "data-rank", l.e = c), f !== l.t && i.classList.toggle("best", l.t = f), g !== l.a && i.classList.toggle("hot", l.a = g), p !== l.o && H(i, "left", l.o = p), x !== l.i && H(i, "top", l.i = x), l;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), i;
    })()
  }), d(B, {
    get each() {
      return a();
    },
    children: (o) => (() => {
      var i = gf(), l = i.firstChild;
      return i.addEventListener("mouseleave", () => bt(void 0)), i.addEventListener("mouseenter", () => bt(o.id)), s(i, d(_r, {
        get brand() {
          return n(o.id).brand;
        },
        size: "sm"
      }), l), s(l, () => It(n(o.id).prices?.[Ye()], t.lang())), W((c) => {
        var f = o.rank, g = o.rank === 1, p = hn() === o.id, x = oi(n(o.id)), b = `${o.cx}px`, k = `${o.cy}px`, m = `${(n(o.id).brand ?? "").trim()} · ${It(n(o.id).prices?.[Ye()], t.lang())}p`;
        return f !== c.e && L(i, "data-rank", c.e = f), g !== c.t && i.classList.toggle("best", c.t = g), p !== c.a && i.classList.toggle("hot", c.a = p), x !== c.o && L(i, "href", c.o = x), b !== c.i && H(i, "left", c.i = b), k !== c.n && H(i, "top", c.n = k), m !== c.s && L(i, "title", c.s = m), c;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0
      }), i;
    })()
  })];
}
re({
  type: "fuelmap",
  sizes: {
    lg: {
      w: 5,
      h: 6
    },
    md: {
      w: 8,
      h: 6
    },
    sm: {
      w: 4,
      h: 5
    }
  },
  component: () => {
    const e = zr(), t = ae(), r = K(() => Gt(e(), Ye()).slice(0, 5)), n = K(() => new Map(Gt(e(), Ye()).map((k) => [k.id, k]))), a = (k) => r().findIndex((m) => m.id === k) + 1, o = () => e().map, [i, l] = J({
      w: 0,
      h: 0
    }), c = (k) => {
      const m = new ResizeObserver(([h]) => l({
        w: h.contentRect.width,
        h: h.contentRect.height
      }));
      m.observe(k), Be(() => m.disconnect());
    }, f = K(() => {
      const k = o(), {
        w: m,
        h
      } = i();
      if (!k || !m || !h) return;
      const v = Math.max(m / k.width, h / k.height);
      return {
        s: v,
        ox: (m - k.width * v) / 2,
        oy: (h - k.height * v) / 2
      };
    }), g = K(() => {
      const k = o(), m = f();
      return !k || !m ? [] : k.pins.map((h) => ({
        pin: h,
        station: n().get(h.id),
        rank: a(h.id)
      })).filter((h) => h.station && h.rank > 0).map((h) => ({
        station: h.station,
        rank: h.rank,
        x: h.pin.x * m.s + m.ox,
        y: h.pin.y * m.s + m.oy
      }));
    }), p = () => {
      const k = o(), m = f();
      return k?.home && m ? {
        x: k.home.x * m.s + m.ox,
        y: k.home.y * m.s + m.oy
      } : void 0;
    }, x = K(() => Math.max(1, Math.ceil(Math.max(0, ...r().map((k) => k.distance ?? 0)) * 1.15))), b = K(() => {
      const k = e().B7?.centre ?? e().E10?.centre, {
        w: m,
        h
      } = i();
      if (k?.latitude === void 0 || k.longitude === void 0 || !m || !h) return [];
      const v = Math.cos(k.latitude * Math.PI / 180), S = Math.min(m, h) / 2 * 0.88;
      return r().filter((_) => _.latitude !== void 0 && _.longitude !== void 0).map((_) => ({
        station: _,
        rank: a(_.id),
        x: m / 2 + (_.longitude - k.longitude) * 69.17 * v / x() * S,
        y: h / 2 - (_.latitude - k.latitude) * 69.17 / x() * S
      }));
    });
    return (() => {
      var k = bf(), m = k.firstChild, h = m.firstChild, v = h.firstChild, S = v.nextSibling, _ = S.firstChild, $ = _.nextSibling;
      return $.nextSibling, s(v, () => t("mapTitle")), s(S, () => e().B7?.centre?.label ?? t("home"), _), s(S, () => e().B7?.radius ?? 10, $), s(k, d(N, {
        get when() {
          return o();
        },
        get fallback() {
          return d(N, {
            get when() {
              return e().mapError;
            },
            get fallback() {
              return wf();
            },
            get children() {
              var C = xf(), y = C.firstChild, z = y.nextSibling, T = z.nextSibling, P = T.nextSibling, w = P.firstChild;
              return jt(c, C), s(P, x, w), s(C, d(ua, {
                get points() {
                  return b();
                },
                get width() {
                  return i().w;
                },
                get height() {
                  return i().h;
                },
                get home() {
                  return {
                    x: i().w / 2,
                    y: i().h / 2
                  };
                }
              }), null), C;
            }
          });
        },
        get children() {
          var C = mf(), y = C.firstChild, z = y.firstChild;
          return jt(c, y), L(z, "draggable", !1), s(y, d(N, {
            get when() {
              return F(() => !!(p() && o().radiusPixels))() && f();
            },
            get children() {
              var T = hf();
              return W((P) => {
                var w = `${p().x}px`, R = `${p().y}px`, A = `${o().radiusPixels * 2 * f().s}px`;
                return w !== P.e && H(T, "left", P.e = w), R !== P.t && H(T, "top", P.t = R), A !== P.a && H(T, "width", P.a = A), P;
              }, {
                e: void 0,
                t: void 0,
                a: void 0
              }), T;
            }
          }), null), s(y, d(ua, {
            get points() {
              return g();
            },
            get width() {
              return i().w;
            },
            get height() {
              return i().h;
            },
            get home() {
              return p();
            }
          }), null), W((T) => {
            var P = o().image, w = f() ? {
              width: `${o().width * f().s}px`,
              height: `${o().height * f().s}px`,
              left: `${f().ox}px`,
              top: `${f().oy}px`
            } : void 0;
            return P !== T.e && L(z, "src", T.e = P), T.t = $e(z, w, T.t), T;
          }, {
            e: void 0,
            t: void 0
          }), C;
        }
      }), null), k;
    })();
  }
});
ot(["click"]);
var kf = /* @__PURE__ */ u('<article class="k-tile k-about"><h3 class=k-room-name></h3><p class=k-sub></p><div class=k-facts>'), yf = /* @__PURE__ */ u('<div class="k-well k-metric sm"><span></span><strong>'), vf = /* @__PURE__ */ u('<article class="k-tile k-roadmap"><ul class=k-list>'), _f = /* @__PURE__ */ u('<li class=k-row><span class="k-thumb k-well"><b class=k-step-no></b></span><span class=k-row-copy><b>');
re({
  type: "about",
  sizes: {
    lg: {
      w: 6,
      h: 4
    },
    md: {
      w: 8,
      h: 4
    },
    sm: {
      w: 4,
      h: 5
    }
  },
  component: (e) => {
    const t = de(), {
      demo: r,
      version: n
    } = pt(), a = ae(), o = [["version", () => n()], ["mode", () => r() ? a("demo") : a("live")], ["language", () => a.lang().toUpperCase()], ["entities", () => String(Object.keys(t()?.states ?? {}).length)], ["layoutSource", () => e.config.source === "auto" ? a("layoutAuto") : `${a("layoutFile")} · ${e.config.pages}`]];
    return (() => {
      var i = kf(), l = i.firstChild, c = l.nextSibling, f = c.nextSibling;
      return s(i, d(it, {
        get children() {
          return a("settings");
        }
      }), l), s(l, () => a("aboutTitle")), s(c, () => a("aboutLead")), s(f, d(B, {
        each: o,
        children: ([g, p]) => (() => {
          var x = yf(), b = x.firstChild, k = b.nextSibling;
          return s(b, () => a(g)), s(k, p), x;
        })()
      })), i;
    })();
  }
});
re({
  type: "roadmap",
  sizes: {
    lg: {
      w: 6,
      h: 4
    },
    md: {
      w: 8,
      h: 3
    },
    sm: {
      w: 4,
      h: 4
    }
  },
  component: () => {
    const e = ae(), t = ["next1", "next2", "next3", "next4"];
    return (() => {
      var r = vf(), n = r.firstChild;
      return s(r, d(it, {
        get children() {
          return e("next");
        }
      }), n), s(n, d(B, {
        each: t,
        children: (a, o) => (() => {
          var i = _f(), l = i.firstChild, c = l.firstChild, f = l.nextSibling, g = f.firstChild;
          return s(c, () => o() + 1), s(g, () => e(a)), i;
        })()
      })), r;
    })();
  }
});
var $f = /* @__PURE__ */ u("<header class=k-panel-head><div><span class=k-panel-kicker></span><h3>"), zf = /* @__PURE__ */ u('<article class="k-tile k-style"><p class=k-sub></p><div class=k-art-grid>'), Sf = /* @__PURE__ */ u('<figure class=k-art-card><span class="k-well k-art-well"><img alt loading=lazy></span><figcaption><b></b><small><i>', !0, !1, !1), Cf = /* @__PURE__ */ u('<article class="k-tile k-style"><p class=k-sub></p><div class=k-glyph-row>'), Tf = /* @__PURE__ */ u("<span class=k-glyph-item><small>"), Pf = /* @__PURE__ */ u('<article class="k-tile k-style"><div class=k-style-devices>'), Mf = /* @__PURE__ */ u("<div class=k-device><span class=k-device-art><img alt></span><span class=k-device-copy><b></b><small>"), Ef = /* @__PURE__ */ u('<article class="k-tile k-style"><div class=k-style-chips>'), Lf = /* @__PURE__ */ u('<div class="k-well k-item"><span class=k-item-art><img alt></span><span class=k-item-copy><small></small><b>'), Af = /* @__PURE__ */ u('<article class="k-tile k-style"><div class="k-style-feeds k-nexus">'), Rf = /* @__PURE__ */ u("<article><img class=k-style-feed-art alt><small></small><strong></strong><em>");
const zn = (e, t) => e === "pl" ? t.pl : t.en;
function On(e) {
  return (() => {
    var t = $f(), r = t.firstChild, n = r.firstChild, a = n.nextSibling;
    return s(n, () => e.kicker), s(a, () => e.title), W((o) => H(n, "color", e.accent ?? "#8cdbff")), t;
  })();
}
re({
  type: "style-gallery",
  sizes: {
    lg: {
      w: 12,
      h: 12
    },
    md: {
      w: 8,
      h: 17
    },
    sm: {
      w: 4,
      h: 42
    }
  },
  component: () => {
    const e = ae();
    return (() => {
      var t = zf(), r = t.firstChild, n = r.nextSibling;
      return s(t, d(On, {
        get kicker() {
          return e("styleKicker");
        },
        get title() {
          return e("styleHeroArt");
        }
      }), r), s(r, () => e("styleHeroHint")), s(n, d(B, {
        each: br,
        children: (a) => (() => {
          var o = Sf(), i = o.firstChild, l = i.firstChild, c = i.nextSibling, f = c.firstChild, g = f.nextSibling;
          return g.firstChild, L(l, "draggable", !1), s(f, () => zn(e.lang(), a)), s(g, () => zn(e.lang(), ar[a.category]), null), s(g, (() => {
            var p = F(() => !!a.fresh);
            return () => p() ? ` · ${e("styleNew")}` : "";
          })(), null), W((p) => {
            var x = ar[a.category].accent, b = fe[a.key];
            return x !== p.e && H(o, "--accent", p.e = x), b !== p.t && L(l, "src", p.t = b), p;
          }, {
            e: void 0,
            t: void 0
          }), o;
        })()
      })), t;
    })();
  }
});
re({
  type: "style-glyphs",
  sizes: {
    lg: {
      w: 12,
      h: 4
    },
    md: {
      w: 8,
      h: 5
    },
    sm: {
      w: 4,
      h: 10
    }
  },
  component: () => {
    const e = ae();
    return (() => {
      var t = Cf(), r = t.firstChild, n = r.nextSibling;
      return s(t, d(On, {
        get kicker() {
          return e("styleKicker");
        },
        get title() {
          return e("styleGlyphs");
        }
      }), r), s(r, () => e("styleGlyphHint")), s(n, d(B, {
        get each() {
          return br.filter((a, o, i) => i.findIndex((l) => l.glyph === a.glyph) === o);
        },
        children: (a) => (() => {
          var o = Tf(), i = o.firstChild;
          return s(o, d(Ae, {
            get icon() {
              return a.glyph;
            },
            get category() {
              return a.category;
            }
          }), i), s(i, () => zn(e.lang(), a)), W(() => L(o, "title", zn(e.lang(), a))), o;
        })()
      })), t;
    })();
  }
});
re({
  type: "style-devices",
  sizes: {
    lg: {
      w: 4,
      h: 3
    },
    md: {
      w: 4,
      h: 3
    },
    sm: {
      w: 4,
      h: 3
    }
  },
  component: () => {
    const e = ae(), t = [{
      key: "bulb",
      title: e("styleLamp"),
      state: e("on"),
      on: !0
    }, {
      key: "purifier",
      title: e("stylePurifier"),
      state: e("off"),
      on: !1
    }, {
      key: "speaker",
      title: e("styleSpeaker"),
      state: e("standby"),
      on: !1
    }];
    return (() => {
      var r = Pf(), n = r.firstChild;
      return s(r, d(On, {
        get kicker() {
          return e("styleSample");
        },
        get title() {
          return e("styleDevices");
        }
      }), n), s(n, d(B, {
        each: t,
        children: (a) => (() => {
          var o = Mf(), i = o.firstChild, l = i.firstChild, c = i.nextSibling, f = c.firstChild, g = f.nextSibling;
          return L(l, "draggable", !1), s(f, () => a.title), s(g, () => a.state), s(o, d(Rn, {
            get on() {
              return a.on;
            },
            get label() {
              return a.title;
            },
            onToggle: () => {
            }
          }), null), W((p) => {
            var x = !!a.on, b = !a.on, k = fe[a.key];
            return x !== p.e && o.classList.toggle("on", p.e = x), b !== p.t && o.classList.toggle("off", p.t = b), k !== p.a && L(l, "src", p.a = k), p;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), o;
        })()
      })), r;
    })();
  }
});
re({
  type: "style-chips",
  sizes: {
    lg: {
      w: 4,
      h: 3
    },
    md: {
      w: 4,
      h: 3
    },
    sm: {
      w: 4,
      h: 4
    }
  },
  component: () => {
    const e = ae(), t = [{
      key: "window",
      title: e("styleWindow"),
      state: e("closed")
    }, {
      key: "leak",
      title: e("styleLeak"),
      state: e("dry")
    }, {
      key: "motion",
      title: e("styleMotion"),
      state: e("present")
    }, {
      key: "smoke",
      title: e("styleSmoke"),
      state: e("detected"),
      alert: !0
    }];
    return (() => {
      var r = Ef(), n = r.firstChild;
      return s(r, d(On, {
        get kicker() {
          return e("styleSample");
        },
        get title() {
          return e("styleChips");
        },
        accent: "#4be39a"
      }), n), s(n, d(B, {
        each: t,
        children: (a) => (() => {
          var o = Lf(), i = o.firstChild, l = i.firstChild, c = i.nextSibling, f = c.firstChild, g = f.nextSibling;
          return L(l, "draggable", !1), s(f, () => a.title), s(g, () => a.state), W((p) => {
            var x = !!a.alert, b = fe[a.key];
            return x !== p.e && o.classList.toggle("alert", p.e = x), b !== p.t && L(l, "src", p.t = b), p;
          }, {
            e: void 0,
            t: void 0
          }), o;
        })()
      })), r;
    })();
  }
});
re({
  type: "style-feeds",
  sizes: {
    lg: {
      w: 12,
      h: 2
    },
    md: {
      w: 8,
      h: 2
    },
    sm: {
      w: 4,
      h: 5
    }
  },
  component: () => {
    const e = ae(), t = [{
      key: "bolt",
      type: "electric",
      label: e("nxElectric"),
      value: "818 W",
      detail: e("nxPriceNow", {
        v: "14,4"
      })
    }, {
      key: "watermeter",
      type: "water",
      label: e("nxWater"),
      value: "162 L",
      detail: `${e("nxYesterday")} · £0,45`
    }, {
      key: "flame",
      type: "gas",
      label: e("nxGas"),
      value: "24,3 kWh",
      detail: `£2,16 ${e("nxToday")}`
    }];
    return (() => {
      var r = Af(), n = r.firstChild;
      return s(n, d(B, {
        each: t,
        children: (a) => (() => {
          var o = Rf(), i = o.firstChild, l = i.nextSibling, c = l.nextSibling, f = c.nextSibling;
          return L(i, "draggable", !1), s(l, () => a.label), s(c, () => a.value), s(f, () => a.detail), W((g) => {
            var p = `k-nx-feed ${a.type} k-style-feed`, x = fe[a.key];
            return p !== g.e && dt(o, g.e = p), x !== g.t && L(i, "src", g.t = x), g;
          }, {
            e: void 0,
            t: void 0
          }), o;
        })()
      })), r;
    })();
  }
});
var Of = /* @__PURE__ */ u("<img class=k-f1-flag>"), Nf = /* @__PURE__ */ u("<span class=k-f1-cc>"), jf = /* @__PURE__ */ u("<span class=k-f1-dot>"), Df = /* @__PURE__ */ u('<div class="k-well k-f1-ring"><svg viewBox="0 0 60 60"aria-hidden=true><circle class=track cx=30 cy=30 r=24></circle><circle class=bar cx=30 cy=30 r=24 transform="rotate(-90 30 30)"></circle></svg><b>%</b><small>'), Wf = /* @__PURE__ */ u('<div class="k-well k-item k-f1-fact"data-state=plain><span class=k-item-art></span><span class=k-item-copy><small></small><b>'), Gf = /* @__PURE__ */ u("<span class=k-sub>"), If = /* @__PURE__ */ u("<span class=k-panel-icon>"), Bf = /* @__PURE__ */ u("<header class=k-panel-head><div><span class=k-panel-kicker></span><h3>"), Ff = /* @__PURE__ */ u("<div class=k-f1-livebar><i></i> · "), Sn = /* @__PURE__ */ u("<span class=k-f1-label>"), Hf = /* @__PURE__ */ u("<div class=k-f1-countdown>"), Kf = /* @__PURE__ */ u("<span class=k-f1-when>"), ga = /* @__PURE__ */ u("<span class=k-pill>"), Uf = /* @__PURE__ */ u('<span class="k-pill k-f1-flagpill">'), Vf = /* @__PURE__ */ u('<span class="k-pill k-f1-flagpill"data-tone=yellow>'), qf = /* @__PURE__ */ u("<div class=k-f1-wx><span class=k-f1-label>"), Yf = /* @__PURE__ */ u('<article class="k-tile k-f1-hero"style=--accent:#ff5a5a><div class=k-f1-stage role=button tabindex=0><img class=k-f1-car alt></div><div class=k-f1-copy><span class=k-panel-kicker></span><h2><span></span></h2><span class=k-sub></span><div class=k-pills>'), Zf = /* @__PURE__ */ u('<div class="k-well k-metric"><span></span><strong>'), Qf = /* @__PURE__ */ u("<span class=k-f1-livebar><i>"), Xf = /* @__PURE__ */ u("<ol class=k-f1-board-rows>"), Jf = /* @__PURE__ */ u("<div class=k-f1-rc><span class=k-f1-label>"), ep = /* @__PURE__ */ u('<article class="k-tile k-panel k-f1-live"style=--accent:#ff5a5a><div class=k-f1-live-body><div class=k-f1-live-status><div class="k-well k-f1-board"><small></small><b>'), tp = /* @__PURE__ */ u('<p class="k-sub k-f1-hint">'), np = /* @__PURE__ */ u("<small>"), rp = /* @__PURE__ */ u("<span class=k-f1-tyre>"), ap = /* @__PURE__ */ u("<li class=k-well><span class=k-f1-pos></span><b></b><em></em><small>"), ip = /* @__PURE__ */ u("<span>"), op = /* @__PURE__ */ u('<div class="k-well k-f1-msg"><small></small><span>'), sp = /* @__PURE__ */ u('<div class="k-f1-facts three">'), lp = /* @__PURE__ */ u('<article class="k-tile k-panel k-f1-weekend"style=--accent:#ff5a5a><ol class=k-f1-sessions>'), cp = /* @__PURE__ */ u("<li class=k-well><span class=k-f1-code></span><span class=k-f1-sname><b></b><small> · </small></span><span class=k-f1-sstate>"), dp = /* @__PURE__ */ u('<div class="k-well k-f1-map"><img alt>'), fp = /* @__PURE__ */ u("<div class=k-f1-rings>"), pp = /* @__PURE__ */ u('<article class="k-tile k-panel k-f1-circuit"style=--accent:#ff5a5a><div class=k-f1-circuit-body><div class=k-f1-facts>'), up = /* @__PURE__ */ u('<button class="k-chip k-f1-more">'), gp = /* @__PURE__ */ u('<article class="k-tile k-panel k-f1-table"style=--accent:#ff5a5a><ol class=k-f1-rows>'), hp = /* @__PURE__ */ u("<li class=k-well><span class=k-f1-pos></span><span class=k-f1-who><b></b><small></small></span><small class=k-f1-team></small><span class=k-f1-wins></span><span class=k-f1-gap></span><em><small> "), mp = /* @__PURE__ */ u('<article class="k-tile k-panel k-f1-table"style=--accent:#ff5a5a><ol class="k-f1-rows teams">'), bp = /* @__PURE__ */ u("<li class=k-well><span class=k-f1-pos></span><span class=k-f1-who><b></b><span class=k-f1-share><i></i></span></span><span class=k-f1-wins></span><em><small> "), xp = /* @__PURE__ */ u('<article class="k-tile k-panel k-f1-results"style=--accent:#ff5a5a><div class=k-f1-podium></div><ol class="k-f1-rows compact">'), wp = /* @__PURE__ */ u('<div class="k-well k-f1-step"><span class=k-f1-medal>P</span><b></b><small></small><em>'), kp = /* @__PURE__ */ u("<li class=k-well><span class=k-f1-pos></span><span class=k-f1-who><b></b><small></small></span><span class=k-f1-delta></span><span class=k-f1-gap></span><em>"), ha = /* @__PURE__ */ u('<ol class="k-f1-rows compact">'), yp = /* @__PURE__ */ u("<div class=k-f1-facts>"), vp = /* @__PURE__ */ u('<article class="k-tile k-panel k-f1-history"style=--accent:#ff5a5a>'), _p = /* @__PURE__ */ u('<li class="k-well podium"><span class=k-f1-pos></span><span class=k-f1-who><b></b><small></small></span><small class=k-f1-team></small><em>'), $p = /* @__PURE__ */ u("<li class=k-well><span class=k-f1-pos>×</span><span></span><span class=k-f1-who><b></b><small></small></span><small class=k-f1-team>"), zp = /* @__PURE__ */ u('<article class="k-tile k-panel k-f1-calendar"style=--accent:#ff5a5a><ol class=k-f1-rounds>'), Sp = /* @__PURE__ */ u("<i>"), Cp = /* @__PURE__ */ u("<span class=k-f1-winner>"), Tp = /* @__PURE__ */ u("<li class=k-well><span class=k-f1-rnd>R</span><span class=k-f1-rname><b></b></span><small>");
function Ze(e) {
  const t = de(), r = ae(), n = (i) => {
    const l = e.ids?.[i];
    return l ? t()?.states[l] : void 0;
  }, a = () => r.lang();
  return {
    hass: t,
    get: n,
    lang: a,
    tr: (i, l) => os(a(), i, l)
  };
}
function ci(e) {
  const [t, r] = J(Date.now()), n = setInterval(() => r(Date.now()), e);
  return Be(() => clearInterval(n)), t;
}
const Pp = (e, t) => new Intl.DateTimeFormat(e, {
  weekday: "short",
  day: "numeric",
  month: "numeric"
}).format(t), di = (e, t) => new Intl.DateTimeFormat(e, {
  hour: "2-digit",
  minute: "2-digit"
}).format(t), Sr = (e, t, r) => new Intl.DateTimeFormat(e, r).format(t);
function fi(e) {
  const t = Math.max(0, Math.floor(e / 1e3));
  return {
    d: Math.floor(t / 86400),
    h: Math.floor(t % 86400 / 3600),
    m: Math.floor(t % 3600 / 60),
    s: t % 60
  };
}
function pi(e, t) {
  const {
    d: r,
    h: n,
    m: a
  } = fi(e), o = t === "pl" ? ["d", "godz.", "min"] : t === "de" ? ["T", "Std.", "Min"] : ["d", "h", "min"];
  return r ? `${r} ${o[0]} ${n} ${o[1]}` : n ? `${n} ${o[1]} ${a} ${o[2]}` : `${a} ${o[2]}`;
}
const Mp = (e) => e.replace(/\s*Grand Prix\s*/i, " ").replace(/\s+/g, " ").trim() || e;
function ui(e) {
  const [t, r] = J(!1);
  return d(N, {
    get when() {
      return F(() => !!e.url)() && !t();
    },
    get fallback() {
      return d(N, {
        get when() {
          return e.code;
        },
        get children() {
          var n = Nf();
          return s(n, () => e.code.toUpperCase()), n;
        }
      });
    },
    get children() {
      var n = Of();
      return n.addEventListener("error", () => r(!0)), L(n, "draggable", !1), W((a) => {
        var o = e.url, i = e.code ?? "";
        return o !== a.e && L(n, "src", a.e = o), i !== a.t && L(n, "alt", a.t = i), a;
      }, {
        e: void 0,
        t: void 0
      }), n;
    }
  });
}
function wt(e) {
  return (() => {
    var t = jf();
    return s(t, () => e.label ?? ""), W((r) => H(t, "--team", e.color)), t;
  })();
}
function ma(e) {
  const r = 2 * Math.PI * 24;
  return (() => {
    var n = Df(), a = n.firstChild, o = a.firstChild, i = o.nextSibling, l = a.nextSibling, c = l.firstChild, f = l.nextSibling;
    return s(l, () => Math.round(e.value), c), s(f, () => e.label), W(() => L(i, "stroke-dasharray", `${r * Math.max(0, Math.min(100, e.value)) / 100} ${r}`)), n;
  })();
}
function ze(e) {
  return d(N, {
    get when() {
      return F(() => e.value !== void 0)() && e.value !== "";
    },
    get children() {
      var t = Wf(), r = t.firstChild, n = r.nextSibling, a = n.firstChild, o = a.nextSibling;
      return s(r, d(Ae, {
        get icon() {
          return e.icon;
        },
        category: "f1",
        size: "sm"
      })), s(a, () => e.label), s(o, () => e.value), t;
    }
  });
}
function st(e) {
  return (() => {
    var t = Bf(), r = t.firstChild, n = r.firstChild, a = n.nextSibling;
    return s(n, () => e.kicker), s(a, () => e.title), s(r, d(N, {
      get when() {
        return e.sub;
      },
      get children() {
        var o = Gf();
        return s(o, () => e.sub), o;
      }
    }), null), s(t, () => e.children, null), s(t, d(N, {
      get when() {
        return F(() => !!e.icon)() && !e.children;
      },
      get children() {
        var o = If();
        return s(o, d(ie, {
          get icon() {
            return e.icon;
          }
        })), o;
      }
    }), null), t;
  })();
}
const Le = (e) => {
  const t = Number(e);
  return e == null || e === "" || !Number.isFinite(t) ? void 0 : t;
};
function gi(e, t, r, n) {
  const a = r?.attributes ?? {}, o = n?.attributes ?? {}, i = (g) => Le(g) === void 0 ? void 0 : `${V(Le(g), 1, t)}°`, l = Le(a.wind_speed ?? o.current_wind_speed), c = Le(a.humidity ?? o.current_humidity), f = Le(a.rainfall ?? o.current_precipitation);
  return [{
    label: e("air"),
    value: i(a.air_temperature ?? o.current_temperature ?? (Ge(n) ? n.state : void 0)),
    icon: "mdi:thermometer"
  }, {
    label: e("asphalt"),
    value: i(a.track_temperature),
    icon: "mdi:road-variant"
  }, {
    label: e("humidity"),
    value: c === void 0 ? void 0 : `${Math.round(c)}%`,
    icon: "mdi:water-percent"
  }, {
    label: e("wind"),
    value: l === void 0 ? void 0 : `${V(l, 1, t)} m/s`,
    icon: "mdi:weather-windy"
  }, {
    label: e("rain"),
    value: f === void 0 ? void 0 : `${V(f, 1, t)} mm`,
    icon: "mdi:weather-rainy"
  }].filter((g) => g.value !== void 0);
}
function gr(e) {
  const t = String(e ?? "").toUpperCase();
  return /RED/.test(t) ? "red" : /VSC|SC|YELLOW/.test(t) ? "yellow" : /CLEAR|GREEN/.test(t) ? "green" : "plain";
}
function Ep(e, t, r, n) {
  return r === e.code || t >= e.start.getTime() && t < e.end.getTime() ? "live" : t >= e.end.getTime() ? "done" : e.code === n ? "next" : "later";
}
re({
  type: "f1-hero",
  sizes: {
    lg: {
      w: 12,
      h: 5
    },
    md: {
      w: 8,
      h: 6
    },
    sm: {
      w: 4,
      h: 10
    }
  },
  component: (e) => {
    const {
      get: t,
      lang: r,
      tr: n
    } = Ze(e.config), a = Vt(), o = ci(1e3), i = () => t("nextRace"), l = () => i()?.attributes ?? {}, c = K(() => Ka(i())), f = () => Ua(t("session"), t("sessionStatus")), g = () => f() ? xr(t("session")?.state ?? t("session")?.attributes?.name) : void 0, p = () => c().find((y) => y.start.getTime() > o()), x = () => c().find((y) => y.code === "R") ?? (rt(i()?.state) ? {
      code: "R",
      start: rt(i().state),
      end: rt(i().state)
    } : void 0), b = () => p() ? fi(p().start.getTime() - o()) : void 0, k = () => String(We(l(), "race_name", "raceName") ?? We(t("session")?.attributes, "meeting_name") ?? n("noData")), m = () => [We(l(), "circuit_name"), [We(l(), "circuit_locality"), We(l(), "circuit_country")].filter(Boolean).join(", ")].filter(Boolean).join(" · "), h = () => [n("kicker"), l().round ? n("round", {
      n: l().round
    }) : void 0, l().season].filter(Boolean).join(" · "), v = () => t("trackStatus"), S = () => t("sessionStatus"), _ = () => t("safetyCar")?.state === "on", $ = () => t("raceWeek"), C = () => gi(n, r(), t("trackWeather"), t("raceWeather"));
    return (() => {
      var y = Yf(), z = y.firstChild, T = z.firstChild, P = z.nextSibling, w = P.firstChild, R = w.nextSibling, A = R.firstChild, E = R.nextSibling, j = E.nextSibling;
      return z.$$click = () => i() && a(i().entity_id), L(T, "draggable", !1), s(w, h), s(R, d(ui, {
        get url() {
          return l().country_flag_url;
        },
        get code() {
          return qa(l().country_code, l().circuit_country);
        }
      }), A), s(A, k), s(E, m), s(P, d(N, {
        get when() {
          return f();
        },
        get children() {
          var M = Ff(), O = M.firstChild, G = O.nextSibling;
          return s(M, () => n("liveNow"), G), s(M, (() => {
            var D = F(() => n(g() ?? "") !== (g() ?? ""));
            return () => D() ? n(g()) : String(t("session")?.state ?? "");
          })(), null), M;
        }
      }), j), s(P, d(N, {
        get when() {
          return b();
        },
        get children() {
          return [(() => {
            var M = Sn();
            return s(M, () => n("untilSession", {
              s: n(p().code)
            })), M;
          })(), (() => {
            var M = Hf();
            return s(M, d(B, {
              each: [["d", "days"], ["h", "hours"], ["m", "minutes"], ["s", "seconds"]],
              children: ([O, G]) => (() => {
                var D = Zf(), U = D.firstChild, oe = U.nextSibling;
                return s(U, () => n(G)), s(oe, () => String(b()[O]).padStart(O === "d" ? 1 : 2, "0")), D;
              })()
            })), M;
          })(), (() => {
            var M = Kf();
            return s(M, () => Sr(r(), p().start, {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit"
            }), null), s(M, d(N, {
              get when() {
                return F(() => !!(x() && p().code !== "R"))() && x().start.getTime() > o();
              },
              get children() {
                return [" · ", F(() => n("untilRace", {
                  t: pi(x().start.getTime() - o(), r())
                }))];
              }
            }), null), M;
          })()];
        }
      }), j), s(j, d(N, {
        get when() {
          return F(() => !!Ge(S()))() && !f();
        },
        get children() {
          var M = ga();
          return s(M, d(Ae, {
            icon: "mdi:timer-outline",
            category: "f1",
            size: "xs"
          }), null), s(M, () => n(String(S().state).toLowerCase()), null), M;
        }
      }), null), s(j, d(N, {
        get when() {
          return Ge(v());
        },
        get children() {
          var M = Uf();
          return s(M, d(Ae, {
            icon: "mdi:flag-variant",
            category: "f1",
            size: "xs"
          }), null), s(M, () => n(String(v().state).toUpperCase()), null), W(() => L(M, "data-tone", gr(v().state))), M;
        }
      }), null), s(j, d(N, {
        get when() {
          return _();
        },
        get children() {
          var M = Vf();
          return s(M, d(Ae, {
            icon: "mdi:car-emergency",
            category: "f1",
            size: "xs"
          }), null), s(M, () => n("safetyCar"), null), M;
        }
      }), null), s(j, d(N, {
        get when() {
          return $()?.state === "on";
        },
        get children() {
          var M = ga();
          return s(M, d(Ae, {
            icon: "mdi:calendar-range",
            category: "f1",
            size: "xs"
          }), null), s(M, () => n("raceWeek"), null), M;
        }
      }), null), s(y, d(N, {
        get when() {
          return C().length;
        },
        get children() {
          var M = qf(), O = M.firstChild;
          return s(O, () => n("atTrack")), s(M, d(B, {
            get each() {
              return C().slice(0, 4);
            },
            children: (G) => d(ze, {
              get label() {
                return G.label;
              },
              get value() {
                return G.value;
              },
              get icon() {
                return G.icon;
              }
            })
          }), null), M;
        }
      }), null), W((M) => {
        var O = !!f(), G = fe.f1;
        return O !== M.e && y.classList.toggle("live", M.e = O), G !== M.t && L(T, "src", M.t = G), M;
      }, {
        e: void 0,
        t: void 0
      }), y;
    })();
  }
});
const Lp = {
  SOFT: "#ff4d4d",
  MEDIUM: "#ffd34d",
  HARD: "#eef4fb",
  INTERMEDIATE: "#47d16c",
  WET: "#4da3ff"
};
re({
  type: "f1-live",
  sizes: {
    lg: {
      w: 12,
      h: 3
    },
    md: {
      w: 8,
      h: 4
    },
    sm: {
      w: 4,
      h: 7
    }
  },
  component: (e) => {
    const {
      hass: t,
      get: r,
      lang: n,
      tr: a
    } = Ze(e.config), o = () => r("session"), i = () => xr(o()?.state ?? o()?.attributes?.name), l = () => r("trackStatus"), c = () => {
      const k = r("lapCount");
      if (!k || !Ge(k)) return;
      const m = We(k.attributes, "total_laps", "total", "max");
      return m ? `${k.state} / ${m}` : k.state;
    }, f = () => Ge(r("remaining")) ? r("remaining").state : void 0, g = () => We(r("sessionStatus")?.attributes, "track_grip"), p = K(() => ns(e.config.ids, t()?.states ?? {}).slice(0, 20)), x = K(() => rs(r("raceControl"))), b = () => gi(a, n(), r("trackWeather"), r("raceWeather"));
    return (() => {
      var k = ep(), m = k.firstChild, h = m.firstChild, v = h.firstChild, S = v.firstChild, _ = S.nextSibling;
      return s(k, d(st, {
        get kicker() {
          return a("live");
        },
        get title() {
          return F(() => !!i())() ? a(i()) : String(o()?.state ?? a("live"));
        },
        get sub() {
          return We(o()?.attributes, "meeting_name");
        },
        get children() {
          var $ = Qf();
          return $.firstChild, s($, () => a(String(r("sessionStatus")?.state ?? "started").toLowerCase()), null), $;
        }
      }), m), s(S, () => a("flag")), s(_, (() => {
        var $ = F(() => !!Ge(l()));
        return () => $() ? a(String(l().state).toUpperCase()) : "—";
      })()), s(h, d(ze, {
        get label() {
          return a("lap");
        },
        get value() {
          return c();
        },
        icon: "mdi:counter"
      }), null), s(h, d(ze, {
        get label() {
          return a("remaining");
        },
        get value() {
          return f();
        },
        icon: "mdi:timer-sand"
      }), null), s(h, d(ze, {
        get label() {
          return a("grip");
        },
        get value() {
          return F(() => !!g())() ? a(String(g()).toLowerCase()) : void 0;
        },
        icon: "mdi:tire"
      }), null), s(h, d(B, {
        get each() {
          return b();
        },
        children: ($) => d(ze, {
          get label() {
            return $.label;
          },
          get value() {
            return $.value;
          },
          get icon() {
            return $.icon;
          }
        })
      }), null), s(m, d(N, {
        get when() {
          return p().length;
        },
        get fallback() {
          return (() => {
            var $ = tp();
            return s($, () => a("noTiming")), $;
          })();
        },
        get children() {
          var $ = Xf();
          return s($, d(B, {
            get each() {
              return p();
            },
            children: (C) => (() => {
              var y = ap(), z = y.firstChild, T = z.nextSibling, P = T.nextSibling, w = P.nextSibling;
              return s(z, () => C.pos), s(y, d(wt, {
                get color() {
                  return C.color;
                }
              }), T), s(T, () => C.code), s(y, d(N, {
                get when() {
                  return C.tyre;
                },
                get fallback() {
                  return ip();
                },
                get children() {
                  var R = rp();
                  return s(R, () => C.tyre.slice(0, 1), null), s(R, d(N, {
                    get when() {
                      return C.tyreAge !== void 0;
                    },
                    get children() {
                      var A = np();
                      return s(A, () => C.tyreAge), A;
                    }
                  }), null), W((A) => {
                    var E = Lp[C.tyre] ?? "#9fb3c8", j = C.tyre;
                    return E !== A.e && H(R, "--tyre", A.e = E), j !== A.t && L(R, "title", A.t = j), A;
                  }, {
                    e: void 0,
                    t: void 0
                  }), R;
                }
              }), P), s(P, (() => {
                var R = F(() => C.pos === 1);
                return () => R() ? C.lastLap ?? "" : C.interval ?? C.gap ?? "";
              })()), s(w, (() => {
                var R = F(() => C.pits !== void 0);
                return () => R() ? `${C.pits} ${a("pits")}` : "";
              })()), W((R) => {
                var A = !!C.out, E = !!C.inPit;
                return A !== R.e && y.classList.toggle("out", R.e = A), E !== R.t && y.classList.toggle("pit", R.t = E), R;
              }, {
                e: void 0,
                t: void 0
              }), y;
            })()
          })), $;
        }
      }), null), s(m, d(N, {
        get when() {
          return x().length;
        },
        get children() {
          var $ = Jf(), C = $.firstChild;
          return s(C, () => a("raceControl")), s($, d(B, {
            get each() {
              return x();
            },
            children: (y) => (() => {
              var z = op(), T = z.firstChild, P = T.nextSibling;
              return s(T, () => [y.lap ? `${a("lap")} ${y.lap}` : void 0, y.at ? di(n(), y.at) : void 0].filter(Boolean).join(" · ")), s(P, () => y.text), W(() => L(z, "data-tone", gr(y.flag))), z;
            })()
          }), null), $;
        }
      }), null), W(($) => {
        var C = !p().length, y = gr(l()?.state);
        return C !== $.e && k.classList.toggle("wide", $.e = C), y !== $.t && L(v, "data-tone", $.t = y), $;
      }, {
        e: void 0,
        t: void 0
      }), k;
    })();
  }
});
re({
  type: "f1-weekend",
  sizes: {
    lg: {
      w: 7,
      h: 6
    },
    md: {
      w: 8,
      h: 6
    },
    sm: {
      w: 4,
      h: 8
    }
  },
  component: (e) => {
    const {
      get: t,
      lang: r,
      tr: n
    } = Ze(e.config), a = ci(3e4), o = K(() => Ka(t("nextRace"))), i = () => Ua(t("session"), t("sessionStatus")) ? xr(t("session")?.state) : void 0, l = () => o().find((f) => f.start.getTime() > a() && f.code !== i())?.code, c = () => {
      const f = t("raceWeather")?.attributes;
      if (!f) return [];
      const g = Le(f.race_temperature);
      return [{
        label: n("air"),
        value: g === void 0 ? void 0 : `${V(g, 1, r())}°`,
        icon: String(f.race_weather_icon ?? "mdi:thermometer")
      }, {
        label: n("rainChance"),
        value: Le(f.race_precipitation_probability) === void 0 ? void 0 : `${f.race_precipitation_probability}%`,
        icon: "mdi:weather-rainy"
      }, {
        label: n("wind"),
        value: Le(f.race_wind_speed) === void 0 ? void 0 : `${V(Le(f.race_wind_speed), 1, r())} m/s ${f.race_wind_direction ?? ""}`.trim(),
        icon: "mdi:weather-windy"
      }].filter((p) => p.value !== void 0);
    };
    return (() => {
      var f = lp(), g = f.firstChild;
      return s(f, d(st, {
        get kicker() {
          return n("weekend");
        },
        get title() {
          return n("schedule");
        },
        icon: "mdi:calendar-clock"
      }), g), s(g, d(B, {
        get each() {
          return o();
        },
        children: (p) => {
          const x = () => Ep(p, a(), i(), l());
          return (() => {
            var b = cp(), k = b.firstChild, m = k.nextSibling, h = m.firstChild, v = h.nextSibling, S = v.firstChild, _ = m.nextSibling;
            return s(k, (() => {
              var $ = F(() => p.code === "R");
              return () => $() ? "GP" : p.code;
            })()), s(h, () => n(p.code)), s(v, () => Pp(r(), p.start), S), s(v, () => di(r(), p.start), null), s(_, (() => {
              var $ = F(() => x() === "live");
              return () => $() ? n("live") : F(() => x() === "done")() ? n("done") : F(() => x() === "next")() ? pi(p.start.getTime() - a(), r()) : "";
            })()), W(() => L(b, "data-state", x())), b;
          })();
        }
      })), s(f, d(N, {
        get when() {
          return c().length;
        },
        get children() {
          return [(() => {
            var p = Sn();
            return s(p, () => n("forecast")), p;
          })(), (() => {
            var p = sp();
            return s(p, d(B, {
              get each() {
                return c();
              },
              children: (x) => d(ze, {
                get label() {
                  return x.label;
                },
                get value() {
                  return x.value;
                },
                get icon() {
                  return x.icon;
                }
              })
            })), p;
          })()];
        }
      }), null), f;
    })();
  }
});
re({
  type: "f1-circuit",
  sizes: {
    lg: {
      w: 5,
      h: 6
    },
    md: {
      w: 8,
      h: 6
    },
    sm: {
      w: 4,
      h: 9
    }
  },
  component: (e) => {
    const {
      get: t,
      lang: r,
      tr: n
    } = Ze(e.config), a = () => t("nextRace")?.attributes ?? {}, o = () => String(a().circuit_id ?? ""), [i, l] = J(!1), c = () => Qo(o()) ? `${Ln}art/tracks/${o()}.svg` : a().circuit_outline_url ?? a().circuit_map_url, f = () => Zo(o()), g = () => We(a(), "first_f1_race_here.season"), p = () => Le(a().dnf_rate_last_5), x = () => Le(a().pole_to_win_conversion_last_5);
    return (() => {
      var b = pp(), k = b.firstChild, m = k.firstChild;
      return s(b, d(st, {
        get kicker() {
          return n("circuit");
        },
        get title() {
          return String(a().circuit_name ?? "—");
        },
        get sub() {
          return [a().circuit_locality, a().circuit_country].filter(Boolean).join(", ");
        },
        icon: "mdi:go-kart-track"
      }), k), s(k, d(N, {
        get when() {
          return F(() => !!c())() && !i();
        },
        get children() {
          var h = dp(), v = h.firstChild;
          return v.addEventListener("error", () => l(!0)), L(v, "draggable", !1), W(() => L(v, "src", c())), h;
        }
      }), m), s(m, d(ze, {
        get label() {
          return n("length");
        },
        get value() {
          return F(() => !!f())() ? `${V(f().km, 3, r())} km` : void 0;
        },
        icon: "mdi:map-marker-distance"
      }), null), s(m, d(ze, {
        get label() {
          return n("laps");
        },
        get value() {
          return f()?.laps;
        },
        icon: "mdi:counter"
      }), null), s(m, d(ze, {
        get label() {
          return n("turns");
        },
        get value() {
          return f()?.turns;
        },
        icon: "mdi:sign-direction"
      }), null), s(m, d(ze, {
        get label() {
          return n("held");
        },
        get value() {
          return a().races_held_here;
        },
        icon: "mdi:history"
      }), null), s(m, d(ze, {
        get label() {
          return n("firstGp");
        },
        get value() {
          return g();
        },
        icon: "mdi:flag-checkered"
      }), null), s(b, d(N, {
        get when() {
          return p() !== void 0 || x() !== void 0;
        },
        get children() {
          var h = fp();
          return s(h, d(N, {
            get when() {
              return x() !== void 0;
            },
            get children() {
              return d(ma, {
                get value() {
                  return x();
                },
                get label() {
                  return n("poleWin");
                }
              });
            }
          }), null), s(h, d(N, {
            get when() {
              return p() !== void 0;
            },
            get children() {
              return d(ma, {
                get value() {
                  return p();
                },
                get label() {
                  return n("dnf");
                }
              });
            }
          }), null), h;
        }
      }), null), b;
    })();
  }
});
function ba(e) {
  return e?.attributes?.round;
}
re({
  type: "f1-drivers",
  sizes: {
    lg: {
      w: 7,
      h: 8
    },
    md: {
      w: 8,
      h: 9
    },
    sm: {
      w: 4,
      h: 11
    }
  },
  component: (e) => {
    const {
      get: t,
      tr: r
    } = Ze(e.config), [n, a] = J(!1), o = K(() => Jo(t("drivers"))), i = () => o()[0]?.points ?? 0, l = () => n() ? o() : o().slice(0, 10);
    return (() => {
      var c = gp(), f = c.firstChild;
      return s(c, d(st, {
        get kicker() {
          return r("championship", {
            s: t("drivers")?.attributes?.season ?? ""
          });
        },
        get title() {
          return r("drivers");
        },
        get sub() {
          return F(() => !!ba(t("drivers")))() ? r("round", {
            n: ba(t("drivers"))
          }) : void 0;
        },
        icon: "mdi:account-multiple-check"
      }), f), s(f, d(B, {
        get each() {
          return l();
        },
        children: (g) => (() => {
          var p = hp(), x = p.firstChild, b = x.nextSibling, k = b.firstChild, m = k.nextSibling, h = b.nextSibling, v = h.nextSibling, S = v.nextSibling, _ = S.nextSibling, $ = _.firstChild;
          return $.firstChild, s(x, () => g.pos), s(p, d(wt, {
            get color() {
              return g.color;
            }
          }), b), s(k, () => g.code), s(m, () => g.name), s(h, () => g.team ?? ""), s(v, (() => {
            var C = F(() => !!g.wins);
            return () => C() ? `${g.wins} ${r("wins")}` : "";
          })()), s(S, (() => {
            var C = F(() => g.pos > 1);
            return () => C() ? `−${i() - g.points}` : "";
          })()), s(_, () => g.points, $), s($, () => r("pts"), null), W(() => p.classList.toggle("podium", g.pos <= 3)), p;
        })()
      })), s(c, d(N, {
        get when() {
          return o().length > 10;
        },
        get children() {
          var g = up();
          return g.$$click = () => a(!n()), s(g, (() => {
            var p = F(() => !!n());
            return () => p() ? r("showTop") : r("showAll", {
              n: o().length
            });
          })()), g;
        }
      }), null), W(() => f.classList.toggle("scroll", !!n())), c;
    })();
  }
});
re({
  type: "f1-constructors",
  sizes: {
    lg: {
      w: 5,
      h: 8
    },
    md: {
      w: 8,
      h: 8
    },
    sm: {
      w: 4,
      h: 10
    }
  },
  component: (e) => {
    const {
      get: t,
      tr: r
    } = Ze(e.config), n = K(() => es(t("constructors"))), a = () => Math.max(1, n()[0]?.points ?? 1);
    return (() => {
      var o = mp(), i = o.firstChild;
      return s(o, d(st, {
        get kicker() {
          return r("championship", {
            s: t("constructors")?.attributes?.season ?? ""
          });
        },
        get title() {
          return r("constructors");
        },
        icon: "mdi:factory"
      }), i), s(i, d(B, {
        get each() {
          return n();
        },
        children: (l) => (() => {
          var c = bp(), f = c.firstChild, g = f.nextSibling, p = g.firstChild, x = p.nextSibling, b = x.firstChild, k = g.nextSibling, m = k.nextSibling, h = m.firstChild;
          return h.firstChild, s(f, () => l.pos), s(c, d(wt, {
            get color() {
              return l.color;
            }
          }), g), s(p, () => l.name), s(k, (() => {
            var v = F(() => !!l.wins);
            return () => v() ? `${l.wins} ${r("wins")}` : "";
          })()), s(m, () => l.points, h), s(h, () => r("pts"), null), W((v) => {
            var S = l.pos <= 3, _ = l.color, $ = `${l.points / a() * 100}%`;
            return S !== v.e && c.classList.toggle("podium", v.e = S), _ !== v.t && H(c, "--team", v.t = _), $ !== v.a && H(b, "width", v.a = $), v;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), c;
        })()
      })), o;
    })();
  }
});
re({
  type: "f1-results",
  sizes: {
    lg: {
      w: 7,
      h: 7
    },
    md: {
      w: 8,
      h: 8
    },
    sm: {
      w: 4,
      h: 11
    }
  },
  component: (e) => {
    const {
      get: t,
      lang: r,
      tr: n
    } = Ze(e.config), a = () => t("lastRace"), o = () => a()?.attributes ?? {}, i = K(() => kr(o().results)), l = () => [i()[1], i()[0], i()[2]].filter(Boolean), c = () => i().slice(3, 10), f = () => rt(o().race_start);
    return (() => {
      var g = xp(), p = g.firstChild, x = p.nextSibling;
      return s(g, d(st, {
        get kicker() {
          return [n("lastRace"), o().round ? n("round", {
            n: o().round
          }) : void 0].filter(Boolean).join(" · ");
        },
        get title() {
          return String(o().race_name ?? "—");
        },
        get sub() {
          return [o().circuit_name, f() ? Sr(r(), f(), {
            day: "numeric",
            month: "long"
          }) : void 0].filter(Boolean).join(" · ");
        },
        icon: "mdi:trophy"
      }), p), s(p, d(B, {
        get each() {
          return l();
        },
        children: (b) => (() => {
          var k = wp(), m = k.firstChild;
          m.firstChild;
          var h = m.nextSibling, v = h.nextSibling, S = v.nextSibling;
          return s(m, () => b.pos, null), s(k, d(wt, {
            get color() {
              return b.color;
            },
            get label() {
              return b.code;
            }
          }), h), s(h, () => b.name), s(v, () => b.team ?? ""), s(S, () => b.time ?? b.status ?? ""), W((_) => {
            var $ = b.pos, C = b.color;
            return $ !== _.e && L(k, "data-pos", _.e = $), C !== _.t && H(k, "--team", _.t = C), _;
          }, {
            e: void 0,
            t: void 0
          }), k;
        })()
      })), s(x, d(B, {
        get each() {
          return c();
        },
        children: (b) => {
          const k = () => b.grid ? b.grid - b.pos : 0;
          return (() => {
            var m = kp(), h = m.firstChild, v = h.nextSibling, S = v.firstChild, _ = S.nextSibling, $ = v.nextSibling, C = $.nextSibling, y = C.nextSibling;
            return s(h, () => b.pos), s(m, d(wt, {
              get color() {
                return b.color;
              }
            }), v), s(S, () => b.code), s(_, () => b.team ?? ""), s($, (() => {
              var z = F(() => !!b.grid);
              return () => z() ? F(() => k() > 0)() ? `▲${k()}` : F(() => k() < 0)() ? `▼${-k()}` : "=" : "";
            })()), s(C, () => b.time ?? b.status ?? ""), s(y, (() => {
              var z = F(() => !!b.points);
              return () => z() ? `+${b.points}` : "";
            })()), W(() => L($, "data-dir", k() > 0 ? "up" : k() < 0 ? "down" : "same")), m;
          })();
        }
      })), g;
    })();
  }
});
re({
  type: "f1-history",
  sizes: {
    lg: {
      w: 5,
      h: 7
    },
    md: {
      w: 8,
      h: 7
    },
    sm: {
      w: 4,
      h: 10
    }
  },
  component: (e) => {
    const {
      get: t,
      tr: r
    } = Ze(e.config), n = () => t("nextRace")?.attributes ?? {}, a = () => kr(n().last_year_podium?.podium), o = () => Array.isArray(n().top_5_driver_wins_here) ? n().top_5_driver_wins_here.slice(0, 4) : [], i = () => n().defending_pole_sitter, l = () => We(i(), "q3", "q2", "q1");
    return (() => {
      var c = vp();
      return s(c, d(st, {
        get kicker() {
          return r("history");
        },
        get title() {
          return String(n().circuit_name ?? n().race_name ?? "—");
        },
        icon: "mdi:history"
      }), null), s(c, d(N, {
        get when() {
          return a().length;
        },
        get children() {
          return [(() => {
            var f = Sn();
            return s(f, () => r("lastYear", {
              y: n().last_year_podium?.season ?? ""
            })), f;
          })(), (() => {
            var f = ha();
            return s(f, d(B, {
              get each() {
                return a();
              },
              children: (g) => (() => {
                var p = _p(), x = p.firstChild, b = x.nextSibling, k = b.firstChild, m = k.nextSibling, h = b.nextSibling, v = h.nextSibling;
                return s(x, () => g.pos), s(p, d(wt, {
                  get color() {
                    return g.color;
                  }
                }), b), s(k, () => g.code), s(m, () => g.name), s(h, () => g.team ?? ""), s(v, (() => {
                  var S = F(() => !!g.grid);
                  return () => S() ? `P${g.grid}` : "";
                })()), p;
              })()
            })), f;
          })()];
        }
      }), null), s(c, d(N, {
        get when() {
          return o().length;
        },
        get children() {
          return [(() => {
            var f = Sn();
            return s(f, () => r("mostWins")), f;
          })(), (() => {
            var f = ha();
            return s(f, d(B, {
              get each() {
                return o();
              },
              children: (g) => (() => {
                var p = $p(), x = p.firstChild, b = x.firstChild, k = x.nextSibling, m = k.nextSibling, h = m.firstChild, v = h.nextSibling, S = m.nextSibling;
                return s(x, () => g.wins, b), s(h, () => g.driver_code ?? "—"), s(v, () => g.driver_name ?? ""), s(S, () => [g.first_win_season, g.last_win_season].filter(Boolean).join("–")), p;
              })()
            })), f;
          })()];
        }
      }), null), s(c, d(N, {
        get when() {
          return i();
        },
        get children() {
          var f = yp();
          return s(f, d(ze, {
            get label() {
              return r("pole", {
                y: i().season ?? ""
              });
            },
            get value() {
              return [i().driver_code, l()].filter(Boolean).join(" · ");
            },
            icon: "mdi:timer-outline"
          }), null), s(f, d(ze, {
            get label() {
              return r("defending");
            },
            get value() {
              return n().defending_winner?.driver_code;
            },
            icon: "mdi:trophy-outline"
          }), null), f;
        }
      }), null), c;
    })();
  }
});
re({
  type: "f1-calendar",
  sizes: {
    lg: {
      w: 12,
      h: 5
    },
    md: {
      w: 8,
      h: 7
    },
    sm: {
      w: 4,
      h: 14
    }
  },
  component: (e) => {
    const {
      get: t,
      lang: r,
      tr: n
    } = Ze(e.config), a = K(() => ts(t("season"), t("seasonResults"))), o = () => Number(t("nextRace")?.attributes?.round) || a().find((i) => i.date && i.date.getTime() > Date.now())?.round;
    return (() => {
      var i = zp(), l = i.firstChild;
      return s(i, d(st, {
        get kicker() {
          return n("kicker");
        },
        get title() {
          return n("calendar", {
            s: t("season")?.attributes?.season ?? ""
          });
        },
        icon: "mdi:calendar-month"
      }), l), s(l, d(B, {
        get each() {
          return a();
        },
        children: (c) => {
          const f = () => c.round === o() ? "next" : c.winner || c.date && c.date.getTime() < Date.now() ? "done" : "later";
          return (() => {
            var g = Tp(), p = g.firstChild;
            p.firstChild;
            var x = p.nextSibling, b = x.firstChild, k = x.nextSibling;
            return s(p, () => c.round, null), s(p, d(N, {
              get when() {
                return c.sprint;
              },
              get children() {
                var m = Sp();
                return s(m, () => n("sprint")), m;
              }
            }), null), s(x, d(ui, {
              get url() {
                return c.flag;
              },
              get code() {
                return c.country;
              }
            }), b), s(b, () => Mp(c.name)), s(k, (() => {
              var m = F(() => !!c.date);
              return () => m() ? Sr(r(), c.date, {
                day: "numeric",
                month: "short"
              }) : "";
            })(), null), s(k, d(N, {
              get when() {
                return c.winner;
              },
              get children() {
                return [" · ", (() => {
                  var m = Cp();
                  return s(m, () => c.winner.code), W((h) => H(m, "--team", c.winner.color)), m;
                })()];
              }
            }), null), W(() => L(g, "data-state", f())), g;
          })();
        }
      })), i;
    })();
  }
});
ot(["click"]);
var Ap = /* @__PURE__ */ u("<span class=tw-hud-date>"), Rp = /* @__PURE__ */ u("<small>"), Op = /* @__PURE__ */ u("<span class=tw-pill><b>°"), Np = /* @__PURE__ */ u("<small>£<!> dziś"), jp = /* @__PURE__ */ u('<span class="tw-pill energy"><b> W'), Dp = /* @__PURE__ */ u('<span class="tw-pill subtle"><small>'), Wp = /* @__PURE__ */ u("<header class=tw-hud><div class=tw-hud-brand><span class=tw-hud-kicker>Mieszkanie na żywo</span><b class=tw-hud-time></b></div><div class=tw-hud-chips><span class=tw-pill><b>"), Gp = /* @__PURE__ */ u("<nav class=tw-modes>"), Ip = /* @__PURE__ */ u("<button type=button class=tw-mode><span>");
const xa = {
  sunny: ["mdi:weather-sunny", "Słonecznie"],
  "clear-night": ["mdi:weather-night", "Bezchmurnie"],
  partlycloudy: ["mdi:weather-partly-cloudy", "Częściowe zachmurzenie"],
  cloudy: ["mdi:weather-cloudy", "Pochmurno"],
  fog: ["mdi:weather-fog", "Mgła"],
  rainy: ["mdi:weather-rainy", "Deszcz"],
  pouring: ["mdi:weather-pouring", "Ulewa"],
  snowy: ["mdi:weather-snowy", "Śnieg"],
  "snowy-rainy": ["mdi:weather-snowy-rainy", "Deszcz ze śniegiem"],
  windy: ["mdi:weather-windy", "Wietrznie"],
  "windy-variant": ["mdi:weather-windy-variant", "Wietrznie"],
  lightning: ["mdi:weather-lightning", "Burza"],
  "lightning-rainy": ["mdi:weather-lightning-rainy", "Burza"],
  hail: ["mdi:weather-hail", "Grad"],
  exceptional: ["mdi:alert-circle-outline", "Uwaga"]
};
function Bp(e) {
  const t = de(), r = ae(), n = () => e.hud.weather ? t()?.states[e.hud.weather] : void 0, a = () => {
    const c = e.hud.power ? t()?.states[e.hud.power] : void 0, f = q(c?.state);
    if (f !== void 0)
      return String(c?.attributes.unit_of_measurement ?? "W") === "kW" ? f * 1e3 : f;
  }, o = () => {
    const c = e.hud.cost ? t()?.states[e.hud.cost] : void 0;
    return ce(c) ? void 0 : q(c?.state);
  }, i = () => new Intl.DateTimeFormat("pl", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(e.now), l = () => new Intl.DateTimeFormat("pl", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(e.now);
  return (() => {
    var c = Wp(), f = c.firstChild, g = f.firstChild, p = g.nextSibling, x = f.nextSibling, b = x.firstChild, k = b.firstChild;
    return s(p, i), s(f, d(N, {
      get when() {
        return !e.phone;
      },
      get children() {
        var m = Ap();
        return s(m, l), m;
      }
    }), null), s(x, d(N, {
      get when() {
        return n();
      },
      get children() {
        var m = Op(), h = m.firstChild, v = h.firstChild;
        return s(m, d(ie, {
          get icon() {
            return xa[n().state]?.[0] ?? "mdi:weather-partly-cloudy";
          }
        }), h), s(h, () => V(q(n().attributes.temperature), 0, r.lang()), v), s(m, d(N, {
          get when() {
            return !e.phone;
          },
          get children() {
            var S = Rp();
            return s(S, () => xa[n().state]?.[1] ?? n().state), S;
          }
        }), null), m;
      }
    }), b), s(x, d(N, {
      get when() {
        return a() !== void 0;
      },
      get children() {
        var m = jp(), h = m.firstChild, v = h.firstChild;
        return s(m, d(ie, {
          icon: "mdi:lightning-bolt"
        }), h), s(h, () => V(a(), 0, r.lang()), v), s(m, d(N, {
          get when() {
            return F(() => o() !== void 0)() && !e.phone;
          },
          get children() {
            var S = Np(), _ = S.firstChild, $ = _.nextSibling;
            return $.nextSibling, s(S, () => V(o(), 2, r.lang()), $), S;
          }
        }), null), m;
      }
    }), b), s(b, d(ie, {
      get icon() {
        return e.alerts ? "mdi:alert" : "mdi:shield-home-outline";
      }
    }), k), s(k, (() => {
      var m = F(() => !!e.alerts);
      return () => m() ? `${e.alerts} alarm` : F(() => !!e.open)() ? `${e.open} otwarte` : "Spokój";
    })()), s(x, d(N, {
      get when() {
        return !e.phone;
      },
      get children() {
        var m = Dp(), h = m.firstChild;
        return s(m, d(ie, {
          get icon() {
            return e.tod === "day" ? "mdi:white-balance-sunny" : "mdi:weather-night";
          }
        }), h), s(h, () => e.tod === "day" ? "Dzień" : "Noc"), m;
      }
    }), null), W((m) => {
      var h = e.alerts > 0, v = e.alerts === 0 && e.open > 0;
      return h !== m.e && b.classList.toggle("alert", m.e = h), v !== m.t && b.classList.toggle("warn", m.t = v), m;
    }, {
      e: void 0,
      t: void 0
    }), c;
  })();
}
const Fp = [["home", "Cały dom", "mdi:home-outline"], ["heat", "Mapa ciepła", "mdi:thermometer"], ["security", "Bezpieczeństwo", "mdi:shield-home-outline"], ["energy", "Energia", "mdi:lightning-bolt"]];
function Hp(e) {
  return (() => {
    var t = Gp();
    return s(t, d(B, {
      each: Fp,
      children: ([r, n, a]) => (() => {
        var o = Ip(), i = o.firstChild;
        return le(o, "click", () => e.onMode(r)), s(o, d(ie, {
          icon: a
        }), i), s(i, n), W(() => o.classList.toggle("selected", e.mode === r)), o;
      })()
    })), W((r) => $e(t, e.style, r)), t;
  })();
}
const Kp = [1024, 576], Up = [{ id: "sypialnia", name: "Sypialnia", poly: [[162, 42], [407, 42], [407, 232], [139, 232]], label: [272, 228], glow: [[249, 110], [354, 110], [296, 174]], anchors: { ac: [226, 58], bed: [298, 168], lamp: [249, 110], tv: [171, 148], window: [278, 58] } }, { id: "gabinet", name: "Gabinet", poly: [[423, 42], [635, 42], [635, 232], [423, 232]], label: [528, 228], glow: [[507, 116], [592, 116], [464, 174]], anchors: { ac: [464, 58], desk: [583, 131], bed: [470, 163], feeder: [557, 209], litter: [510, 209], window: [528, 58] } }, { id: "lazienka", name: "Łazienka", poly: [[650, 42], [827, 42], [827, 232], [650, 232]], label: [737, 228], glow: [[696, 96], [766, 116]], anchors: { shower: [769, 134], fan: [696, 64], sink: [696, 125], leak: [769, 192], motion: [737, 174], washer: [668, 161] } }, { id: "wc", name: "WC", poly: [[836, 42], [905, 42], [905, 232], [836, 232]], label: [870, 228], glow: [[856, 105]], anchors: { toilet: [862, 164], motion: [870, 116] } }, { id: "salon", name: "Salon", poly: [[130, 238], [357, 238], [357, 447], [95, 447]], label: [226, 441], glow: [[336, 282], [226, 372], [162, 302]], anchors: { tv: [139, 343], lamp: [336, 282], purifier: [168, 415], thermostat: [243, 255], sofa: [296, 348], floor: [237, 401] } }, { id: "kuchnia", name: "Kuchnia", poly: [[368, 258], [612, 258], [612, 447], [368, 447]], label: [490, 441], glow: [[470, 354], [493, 325], [447, 314]], anchors: { fridge: [550, 325], dryer: [589, 345], hob: [487, 386], island: [478, 401], sink: [452, 326], leak: [592, 363], co: [394, 290], window: [487, 465], speaker: [510, 316], thermostat: [602, 302], floor: [493, 430] } }, { id: "korytarz", name: "Korytarz", poly: [[618, 232], [920, 232], [920, 258], [740, 258], [740, 450], [618, 450]], label: [679, 441], glow: [[670, 273], [807, 247], [670, 377]], anchors: { door: [668, 450], floor: [670, 366], stairs: [807, 247] } }, { id: "pralnia", name: "Pralnia", poly: [[743, 261], [931, 261], [931, 450], [743, 450]], label: [836, 441], glow: [[812, 302]], anchors: { washer: [792, 372], dryer: [827, 372], leak: [807, 406], shelf: [809, 305] } }], Cr = {
  size: Kp,
  rooms: Up
}, Bt = Cr.size[0], Ft = Cr.size[1], Ee = Cr.rooms, Je = { x: 63, y: 32, w: 897, h: 502 }, et = ([e, t]) => ({ left: `${e / Bt * 100}%`, top: `${t / Ft * 100}%` }), Vp = (e) => `polygon(${e.map(([t, r]) => `${t / Bt * 100}% ${r / Ft * 100}%`).join(", ")})`, qp = (e) => e.map(([t, r]) => `${t},${r}`).join(" ");
function Yp(e) {
  const t = e.map((o) => o[0]), r = e.map((o) => o[1]), n = Math.min(...t), a = Math.min(...r);
  return { x: n, y: a, w: Math.max(...t) - n, h: Math.max(...r) - a };
}
const Cn = (e) => Ee.find((t) => t.id === e), Q = (e, t) => t ? e?.states[t] : void 0, mn = (e) => !!e && !ce(e) && ["on", "playing", "open", "heat", "cool", "dry", "fan_only", "auto", "heat_cool"].includes(e.state);
function Ot(e, t) {
  return (t.lights ?? []).filter((r) => Q(e, r.entity)?.state === "on").length;
}
function Tn(e, t) {
  const r = q(Q(e, t.temperature)?.state);
  if (r !== void 0) return r;
  for (const n of t.climate ?? []) {
    const a = Q(e, n.entity);
    if (!a || a.state === "off" || ce(a)) continue;
    const o = q(a.attributes.current_temperature);
    if (o !== void 0) return o;
  }
}
const wa = (e, t) => {
  const r = Q(e, t.entity);
  return !r || ce(r);
};
function hr(e) {
  const t = [
    [16, [77, 140, 255]],
    [19, [80, 210, 255]],
    [21, [80, 230, 150]],
    [23, [255, 196, 90]],
    [26, [255, 90, 80]]
  ];
  if (e <= t[0][0]) return `rgb(${t[0][1].join(",")})`;
  for (let r = 1; r < t.length; r++) {
    const [n, a] = t[r], [o, i] = t[r - 1];
    if (e <= n) {
      const l = (e - o) / (n - o);
      return `rgb(${i.map((c, f) => Math.round(c + (a[f] - c) * l)).join(",")})`;
    }
  }
  return `rgb(${t[t.length - 1][1].join(",")})`;
}
function Pn(e) {
  if (!e || ce(e)) return;
  const t = String(e.attributes.hvac_action ?? "");
  if (!(t === "idle" || t === "off")) {
    if (e.state === "heat" || t === "heating") return "heat";
    if (e.state === "cool" || t === "cooling") return "cool";
    if (e.state === "dry" || t === "drying") return "dry";
    if (e.state === "fan_only" || t === "fan") return "fan";
    if (e.state === "auto" || e.state === "heat_cool") {
      const r = q(e.attributes.current_temperature), n = q(e.attributes.temperature);
      return r !== void 0 && n !== void 0 && r > n ? "cool" : "heat";
    }
  }
}
const Zp = /(run|wash|dry|spin|rinse|heat|cool|program|pranie|susz|wiro|płuk|pracuje|running|active)/i, hi = (e) => !!e && !ce(e) && Zp.test(e.state) && !/(off|idle|ready|finished|end|done|koniec|gotow)/i.test(e.state);
function ka(e) {
  if (!e || ce(e)) return;
  let t;
  const r = String(e.attributes.unit_of_measurement ?? ""), n = q(e.state);
  if (n !== void 0) t = r === "h" ? n * 60 : r === "s" ? n / 60 : n;
  else if (/^\d+:\d{2}(:\d{2})?$/.test(e.state)) {
    const [o, i] = e.state.split(":").map(Number);
    t = o * 60 + i;
  } else Number.isNaN(Date.parse(e.state)) || (t = (Date.parse(e.state) - Date.now()) / 6e4);
  if (t === void 0 || t <= 0) return;
  const a = Math.round(t);
  return a >= 60 ? `${Math.floor(a / 60)} h ${String(a % 60).padStart(2, "0")}` : `${a} min`;
}
const Ht = (e, t) => Q(e, t.entity)?.state === "on";
var Qp = /* @__PURE__ */ u("<div class=tw-roomlist>"), Xp = /* @__PURE__ */ u("<em>°"), Jp = /* @__PURE__ */ u("<button type=button class=tw-roomcard><b></b><span>");
function eu(e) {
  const t = de(), r = ae();
  return (() => {
    var n = Qp();
    return s(n, d(B, {
      get each() {
        return Ee.filter((a) => e.rooms[a.id]);
      },
      children: (a) => {
        const o = () => e.rooms[a.id], i = () => Tn(t(), o()), l = () => Ot(t(), o()), c = () => (o().alarms ?? []).some((g) => Ht(t(), g)), f = () => (o().climate ?? []).map((g) => Pn(Q(t(), g.entity))).find(Boolean);
        return (() => {
          var g = Jp(), p = g.firstChild, x = p.nextSibling;
          return le(g, "click", () => e.onRoom(a.id)), s(p, () => a.name), s(x, d(N, {
            get when() {
              return i() !== void 0;
            },
            get children() {
              var b = Xp(), k = b.firstChild;
              return s(b, () => V(i(), 1, r.lang()), k), W((m) => H(b, "--heat", hr(i()))), b;
            }
          }), null), s(x, d(N, {
            get when() {
              return l() > 0;
            },
            get children() {
              return d(ie, {
                icon: "mdi:lightbulb-on"
              });
            }
          }), null), s(x, d(N, {
            get when() {
              return f();
            },
            get children() {
              return d(ie, {
                get icon() {
                  return f() === "cool" ? "mdi:snowflake" : "mdi:white-balance-sunny";
                }
              });
            }
          }), null), s(x, d(N, {
            get when() {
              return c();
            },
            get children() {
              return d(ie, {
                icon: "mdi:alert"
              });
            }
          }), null), W((b) => {
            var k = !!c(), m = l() > 0;
            return k !== b.e && g.classList.toggle("alarm", b.e = k), m !== b.t && g.classList.toggle("lit", b.t = m), b;
          }, {
            e: void 0,
            t: void 0
          }), g;
        })();
      }
    })), W((a) => $e(n, e.style, a)), n;
  })();
}
var tu = /* @__PURE__ */ u('<div class="k-tile k-error"role=alert><span class=k-kicker>Krystal · </span><p>');
function nu(e) {
  return d(Bi, {
    fallback: (t) => (console.error(`[krystal] ${e.label} failed`, t), (() => {
      var r = tu(), n = r.firstChild;
      n.firstChild;
      var a = n.nextSibling;
      return s(n, () => e.label, null), s(a, () => String(t?.message ?? t)), r;
    })()),
    get children() {
      return e.children;
    }
  });
}
var ru = /* @__PURE__ */ u("<div class=k-grid>"), au = /* @__PURE__ */ u("<div class=k-cell>");
function iu(e) {
  const {
    breakpoint: t
  } = pt();
  return (() => {
    var r = ru();
    return s(r, d(B, {
      get each() {
        return e.tiles;
      },
      children: (n) => {
        const a = uo(n.type), o = K(() => a ? n.sizes?.[t()] ?? a.sizes[t()] : {
          w: 1,
          h: 1
        });
        return d(N, {
          when: a,
          get children() {
            var i = au();
            return s(i, d(nu, {
              get label() {
                return n.type;
              },
              get children() {
                return d(fo, {
                  get component() {
                    return a.component;
                  },
                  get config() {
                    return n.config;
                  },
                  get size() {
                    return o();
                  }
                });
              }
            })), W((l) => {
              var c = n.type, f = `span ${o().w}`, g = `span ${o().h}`;
              return c !== l.e && L(i, "data-tile", l.e = c), f !== l.t && H(i, "grid-column", l.t = f), g !== l.a && H(i, "grid-row", l.a = g), l;
            }, {
              e: void 0,
              t: void 0,
              a: void 0
            }), i;
          }
        });
      }
    })), r;
  })();
}
const ou = 70, ya = 16;
function mi(e) {
  return Math.max(2, Math.ceil((e + ya) / (ou + ya)));
}
function su(e) {
  const t = (r) => mi(72 + Math.ceil(e / r) * 64 + (Math.ceil(e / r) - 1) * 8);
  return { lg: { w: 6, h: t(2) }, md: { w: 8, h: t(3) }, sm: { w: 4, h: t(2) } };
}
function lu(e) {
  const t = (r) => mi(146 + Math.ceil(e / r) * 84 + (Math.ceil(e / r) - 1) * 10);
  return { lg: { w: 12, h: t(3) }, md: { w: 8, h: t(3) }, sm: { w: 4, h: t(1) } };
}
const va = /* @__PURE__ */ new Set(["climate", "water_heater"]);
function cu(e, t, r) {
  const n = [], a = e.devices ?? [], o = new Set(a.map((g) => g.entity));
  if (e.id === Za)
    return [
      { id: "fuelstations", type: "fuelstations", config: {} },
      { id: "fuelmap", type: "fuelmap", config: {} }
    ];
  if (e.kind === "overview") {
    for (const g of e.rooms ?? [])
      n.push({ id: `room-${g.page ?? g.name}`, type: "roomcard", config: { room: g } });
    t?.fuel && n.push({ id: "fuelcard", type: "fuelcard", config: { link: !0 } });
  }
  const i = t?.energy;
  i && gs(e.id, e.title) && (n.push({ id: "energy-hero", type: "energy-hero", config: { ids: i } }), i.ratesToday && n.push({ id: "energy-slots", type: "energy-slots", config: { ids: i } }), (i.elecCost || i.gasCost) && n.push({ id: "energy-today", type: "energy-today", config: { ids: i } })), hs(e.id, e.title) && (t?.washer && n.push({ id: "washer", type: "appliance", config: { ids: t.washer, dryer: !1 } }), t?.dryer && n.push({ id: "dryer", type: "appliance", config: { ids: t.dryer, dryer: !0 } })), e.kind === "room" && a.length && n.push({
    id: `canvas-${e.id}`,
    type: "canvas",
    config: { page: e.id, title: e.title, image: e.image, devices: a, temperature: e.temperature, humidity: e.humidity },
    sizes: lu(a.length)
  });
  const l = e.sections ?? [], c = [];
  if (e.kind !== "overview") {
    for (const g of l) for (const p of g.items) va.has(be(p.entity)) && !c.includes(p.entity) && c.push(p.entity);
    for (const g of a) va.has(be(g.entity)) && !c.includes(g.entity) && c.push(g.entity);
  }
  for (const g of c.slice(0, 4))
    r?.(g) ? n.push({ id: `ac-${g}`, type: "ac", config: { entity: g, extras: t?.climateExtras?.[g] ?? [] } }) : n.push({ id: `climate-${g}`, type: "climate", config: { entity: g } });
  e.kind === "room" && (e.temperature && n.push({ id: `t-${e.id}`, type: "sensor", config: { entity: e.temperature, kind: "temperature" } }), e.humidity && n.push({ id: `h-${e.id}`, type: "sensor", config: { entity: e.humidity, kind: "humidity" } }));
  for (const g of e.media ?? []) n.push({ id: `media-${g.entity}`, type: "media", config: { entity: g.entity, name: g.name } });
  const f = /* @__PURE__ */ new Set([...o, ...e.kind === "overview" ? [] : c]);
  for (const g of l) {
    const p = g.items.filter((b) => !f.has(b.entity));
    if (!p.length) continue;
    const x = { ...g, items: p };
    n.push({ id: `panel-${g.id}`, type: "panel", config: { section: x }, sizes: su(p.length) });
  }
  return n;
}
const du = "/mieszkanie-pokoje/pokoje", fu = "/krystal_twin_static/rooms/", pu = {
  salon: { id: "salon" },
  kuchnia: { id: "kuchnia" },
  sypialnia: { id: "sypialnia" },
  gabinet: { id: "gabinet" },
  lazienka: { id: "lazienka" },
  korytarz: { id: "korytarz", name: "Korytarz i WC" },
  wc: { id: "korytarz", name: "Korytarz i WC" },
  pralnia: { id: "pralnia" }
};
function uu(e) {
  const t = pu[e];
  if (t)
    return { id: t.id, name: t.name ?? "", image: `${fu}${t.id}.webp`, path: `${du}#${t.id}` };
}
const gu = {
  gabinet: [{ name: "Kocia strefa", kicker: "Kuweta i karmnik", image: "/krystal_twin_static/cats/day.webp", path: "/mieszkanie-pokoje/koty" }]
};
function hu(e) {
  history.pushState(null, "", e), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } }));
}
var mu = /* @__PURE__ */ u("<button type=button class=tw-portal><img alt loading=lazy><span class=tw-portal-text><span class=tw-hud-kicker></span><b></b></span><span class=tw-portal-go>", !0, !1, !1), bu = /* @__PURE__ */ u("<span> <!>°"), xu = /* @__PURE__ */ u("<span> <!>%"), wu = /* @__PURE__ */ u("<span> <!>/"), ku = /* @__PURE__ */ u("<button type=button class=tw-action><span>"), yu = /* @__PURE__ */ u("<div class=tw-panel-alarm>"), vu = /* @__PURE__ */ u('<aside class=tw-panel><header class=tw-panel-head><div><span class=tw-hud-kicker>Pomieszczenie</span><h2></h2><span class=tw-panel-meta></span></div><div class=tw-panel-actions><button type=button class="tw-action close"aria-label=Zamknij></button></div></header><div class=tw-panel-body><div class="k-app tw-tiles"data-bp=sm>'), _u = /* @__PURE__ */ u("<span>");
function _a(e) {
  return (() => {
    var t = mu(), r = t.firstChild, n = r.nextSibling, a = n.firstChild, o = a.nextSibling, i = n.nextSibling;
    return le(t, "click", () => hu(e.path)), L(r, "draggable", !1), s(a, () => e.kicker), s(o, () => e.title), s(i, d(ie, {
      icon: "mdi:arrow-right"
    })), W((l) => {
      var c = !!e.small, f = e.image;
      return c !== l.e && t.classList.toggle("small", l.e = c), f !== l.t && L(r, "src", l.t = f), l;
    }, {
      e: void 0,
      t: void 0
    }), t;
  })();
}
function $u(e, t, r) {
  const n = e?.pages.find((i) => i.id === r.page);
  if (n) return n;
  const a = Cn(t)?.name ?? t, o = [...r.motion ?? [], ...r.windows ?? [], ...r.alarms ?? []];
  return {
    id: t,
    title: a,
    kind: "room",
    devices: (r.lights ?? []).map((i) => ({
      entity: i.entity,
      name: i.name,
      kind: "light",
      art: "bulb",
      action: "toggle"
    })),
    sections: o.length ? [{
      id: `${t}-sensors`,
      kicker: "POD KONTROLĄ",
      title: "Czujniki",
      items: o.map((i) => ({
        entity: i.entity,
        name: i.name,
        action: "info"
      }))
    }] : [],
    temperature: r.temperature,
    humidity: r.humidity
  };
}
function zu(e) {
  const t = de(), r = ut(), n = ae(), a = () => e.layout?.twin?.rooms[e.id] ?? {}, o = () => Cn(e.id), i = K(() => $u(e.layout, e.id, a())), l = K(() => cu({
    ...i(),
    media: i().media ?? []
  }, e.features, e.isAc).filter((k) => k.type !== "fuelcard").map((k) => {
    if (k.type !== "canvas") return k;
    const m = i().devices?.length ?? 1, h = Math.max(2, Math.ceil((34 + m * 84 + (m - 1) * 10 + 12) / 82));
    return {
      ...k,
      sizes: {
        lg: {
          w: 4,
          h
        },
        md: {
          w: 4,
          h
        },
        sm: {
          w: 4,
          h
        }
      }
    };
  }), [], {
    equals: (k, m) => k.map((h) => h.id).join() === m.map((h) => h.id).join()
  }), c = () => Tn(t(), a()), f = () => q(Q(t(), a().humidity)?.state), g = () => Ot(t(), a()), p = () => a().lights ?? [], x = () => (a().alarms ?? []).filter((k) => Ht(t(), k)), b = () => void r("homeassistant", g() > 0 ? "turn_off" : "turn_on", {
    entity_id: p().map((k) => k.entity)
  });
  return (() => {
    var k = vu(), m = k.firstChild, h = m.firstChild, v = h.firstChild, S = v.nextSibling, _ = S.nextSibling, $ = h.nextSibling, C = $.firstChild, y = m.nextSibling, z = y.firstChild;
    return le(k, "click", (T) => T.stopPropagation()), s(S, () => o()?.name ?? e.id), s(_, d(N, {
      get when() {
        return c() !== void 0;
      },
      get children() {
        var T = bu(), P = T.firstChild, w = P.nextSibling;
        return w.nextSibling, s(T, d(ie, {
          icon: "mdi:thermometer"
        }), P), s(T, () => V(c(), 1, n.lang()), w), T;
      }
    }), null), s(_, d(N, {
      get when() {
        return f() !== void 0;
      },
      get children() {
        var T = xu(), P = T.firstChild, w = P.nextSibling;
        return w.nextSibling, s(T, d(ie, {
          icon: "mdi:water-percent"
        }), P), s(T, () => V(f(), 0, n.lang()), w), T;
      }
    }), null), s(_, d(N, {
      get when() {
        return p().length;
      },
      get children() {
        var T = wu(), P = T.firstChild, w = P.nextSibling;
        return w.nextSibling, s(T, d(ie, {
          icon: "mdi:lightbulb-outline"
        }), P), s(T, g, w), s(T, () => p().length, null), T;
      }
    }), null), s($, d(N, {
      get when() {
        return p().length;
      },
      get children() {
        var T = ku(), P = T.firstChild;
        return le(T, "click", b), s(T, d(ie, {
          get icon() {
            return g() > 0 ? "mdi:lightbulb-group-off-outline" : "mdi:lightbulb-group-outline";
          }
        }), P), s(P, () => g() > 0 ? "Zgaś" : "Zapal"), W(() => T.classList.toggle("on", g() > 0)), T;
      }
    }), C), le(C, "click", () => e.onClose()), s(C, d(ie, {
      icon: "mdi:close"
    })), s(k, d(N, {
      get when() {
        return x().length;
      },
      get children() {
        var T = yu();
        return s(T, d(ie, {
          icon: "mdi:alert"
        }), null), s(T, d(B, {
          get each() {
            return x();
          },
          children: (P) => (() => {
            var w = _u();
            return s(w, () => P.name ?? P.entity), w;
          })()
        }), null), T;
      }
    }), y), s(y, d(N, {
      get when() {
        return uu(e.id);
      },
      children: (T) => d(_a, {
        get image() {
          return T().image;
        },
        kicker: "Pomieszczenia · widok 3D",
        get title() {
          return `Wejdź do pokoju${T().name ? ` – ${T().name}` : ""}`;
        },
        get path() {
          return T().path;
        }
      })
    }), z), s(y, d(B, {
      get each() {
        return gu[e.id] ?? [];
      },
      children: (T) => d(_a, {
        small: !0,
        get image() {
          return T.image;
        },
        get kicker() {
          return T.kicker;
        },
        get title() {
          return T.name;
        },
        get path() {
          return T.path;
        }
      })
    }), z), s(z, d(iu, {
      get tiles() {
        return l();
      }
    })), W(() => k.classList.toggle("sheet", !!e.phone)), k;
  })();
}
const $a = ["unavailable", "unknown", ""];
async function Su(e, t, r) {
  const n = {
    type: "history/history_during_period",
    start_time: new Date(r - 216e5).toISOString(),
    end_time: new Date(r + 1e3).toISOString(),
    entity_ids: [t],
    minimal_response: !0,
    no_attributes: !0,
    significant_changes_only: !1,
    include_start_time_state: !0
  }, a = e.callWS ? (c) => e.callWS(c) : e.connection ? (c) => e.connection.sendMessagePromise(c) : void 0;
  if (!a) return;
  const l = ((await a(n))?.[t] ?? []).filter((c) => (c.lc ?? c.lu ?? 0) * 1e3 < r - 500);
  return l.length ? l[l.length - 1].s : void 0;
}
async function Cu(e, t) {
  const r = e.states[t];
  if (!r?.last_changed || $a.includes(r.state)) return;
  const n = Date.parse(r.last_changed);
  try {
    const a = await Su(e, t, n);
    return a === void 0 ? { kind: "atLeast", since: n, reason: "history" } : $a.includes(a) ? { kind: "atLeast", since: n, reason: "outage" } : a === r.state ? { kind: "atLeast", since: n, reason: "restart" } : { kind: "exact", since: n };
  } catch {
    return { kind: "atLeast", since: n, reason: "history" };
  }
}
const za = (e) => {
  const t = Math.max(0, Math.round(e / 6e4));
  return t >= 60 ? `${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")} min` : `${t} min`;
}, Tu = {
  restart: "czas liczony od restartu Home Assistant — wcześniejszy start nieznany",
  outage: "urządzenie było chwilowo niedostępne — wcześniejszy start nieznany",
  history: "brak historii przed tą chwilą — dokładny start nieznany"
}, De = Ee.find((e) => e.id === "korytarz")?.anchors.door ?? [648, 292], Pu = (e, t) => t === "ac" || /mts200/.test(e), Mu = ["off", "unavailable", "standby", "unknown", "idle"], bi = (e, t) => {
  const r = Q(e, t);
  if (!r || ce(r)) return;
  const n = q(r.state);
  if (n !== void 0)
    return String(r.attributes.unit_of_measurement ?? "W") === "kW" ? n * 1e3 : n;
};
let Sa, cn = /* @__PURE__ */ new Map();
function Eu(e, t) {
  const r = e?.entities;
  if (!r) return [];
  if (Sa !== r) {
    cn = /* @__PURE__ */ new Map();
    for (const a of Object.values(r))
      !a.device_id || !a.entity_id.startsWith("sensor.") || e?.states[a.entity_id]?.attributes.device_class === "power" && cn.set(a.device_id, [...cn.get(a.device_id) ?? [], a.entity_id]);
    Sa = r;
  }
  const n = r[t]?.device_id;
  return n ? cn.get(n) ?? [] : [];
}
function Pt(e, t) {
  let r;
  for (const n of t) {
    const a = n.power ? [n.power] : Eu(e, n.entity);
    for (const o of a) {
      const i = bi(e, o);
      i !== void 0 && (r = (r ?? 0) + i);
    }
  }
  return r;
}
const Mt = (e) => Object.fromEntries(e.map((t) => [t.entity, t.name]));
function Lu(e, t) {
  const r = [];
  for (const n of Ee) {
    const a = t[n.id];
    if (!a) continue;
    const o = (a.lights ?? []).filter((i) => Q(e, i.entity)?.state === "on");
    o.length && r.push({ id: `${n.id}:light`, room: n.id, at: n.glow[0], kind: "light", label: o.length === 1 ? "Światło" : `${o.length} × światło`, entities: o.map((i) => i.entity), names: Mt(o), watts: Pt(e, o) });
    for (const i of a.appliances ?? []) {
      const l = i.anchor ? n.anchors[i.anchor] : void 0;
      l && hi(Q(e, i.entity)) && r.push({ id: `${n.id}:${i.entity}`, room: n.id, at: l, kind: "appliance", label: i.anchor === "dryer" ? "Suszarka" : "Pralka", entities: [i.entity], names: Mt([i]), remaining: i.remaining, watts: Pt(e, [i]) });
    }
    for (const i of a.media ?? []) {
      const l = Q(e, i.entity), c = i.anchor ? n.anchors[i.anchor] : void 0;
      c && l && !Mu.includes(String(l.state)) && r.push({ id: `${n.id}:${i.entity}`, room: n.id, at: c, kind: "media", label: i.anchor === "speaker" ? "Głośnik" : "Telewizor", entities: [i.entity], names: Mt([i]), watts: Pt(e, [i]) });
    }
    for (const i of a.climate ?? []) {
      if (!Pu(i.entity, i.anchor)) continue;
      const l = Q(e, i.entity), c = i.anchor ? n.anchors[i.anchor === "thermostat" ? "floor" : i.anchor] ?? n.anchors[i.anchor] : void 0;
      if (!c || !l || ce(l)) continue;
      const f = i.anchor === "ac" ? Pn(l) : l.attributes.hvac_action === "heating" ? "heat" : void 0;
      f && r.push({ id: `${n.id}:${i.entity}`, room: n.id, at: c, kind: f === "cool" || f === "dry" ? "cool" : "heat", label: i.anchor === "ac" ? "Klimatyzacja" : "Ogrzewanie podłogowe", entities: [i.entity], names: Mt([i]), watts: Pt(e, [i]) });
    }
    for (const i of [...a.purifier ?? [], ...a.fan ?? []]) {
      const l = i.anchor ? n.anchors[i.anchor] : void 0;
      l && mn(Q(e, i.entity)) && r.push({ id: `${n.id}:${i.entity}`, room: n.id, at: l, kind: "air", label: i.anchor === "fan" ? "Wentylator" : "Oczyszczacz", entities: [i.entity], names: Mt([i]), watts: Pt(e, [i]) });
    }
  }
  return r;
}
const dn = (e, t) => t ? bi(e, t) : void 0, Qn = (e) => e.watts === void 0 ? 1.6 : 2.2 + Math.min(4.2, e.watts / 350), bn = 6e3, Ca = 9, Au = 27, Ta = (e) => Ca + (Au - Ca) * Math.min(1, Math.max(0, e ?? 0) / bn);
function Xn(e, t) {
  const [r, n] = e, [a, o] = t, i = (r + a) / 2, l = Math.min(n, o) - 30 - Math.abs(a - r) * 0.08;
  return `M ${r} ${n} Q ${i} ${l} ${a} ${o}`;
}
var Ru = /* @__PURE__ */ u("<b> W"), Ou = /* @__PURE__ */ u("<span>zmierzone"), Nu = /* @__PURE__ */ u("<div><header><div><small></small><b></b></div><button type=button aria-label=Zamknij>✕</button></header><div class=tw-powercard-watts></div><ul>"), ju = /* @__PURE__ */ u("<b>Brak pomiaru mocy"), Du = /* @__PURE__ */ u("<span>Linia pokazuje tylko, że urządzenie pracuje."), Wu = /* @__PURE__ */ u("<p>Temperatura <!>° → <!>°"), Gu = /* @__PURE__ */ u("<p>Do końca: "), Iu = /* @__PURE__ */ u("<li><span></span><em>"), Bu = /* @__PURE__ */ u("<small class=tw-powercard-since>"), Fu = /* @__PURE__ */ u("<i>"), Hu = /* @__PURE__ */ u("<button type=button><span class=tw-hot-dot>"), Ku = /* @__PURE__ */ u("<svg><g class=tw-power><circle class=tw-meter-scale></circle><circle class=tw-meter-load></circle><circle class=tw-meter-ring r=8></svg>", !1, !0, !1), Uu = /* @__PURE__ */ u("<span class=tw-meter><b></b><small>cały dom · <!> aktywnych · pierścień 0–<!> kW"), Vu = /* @__PURE__ */ u("<div class=tw-stage><div class=tw-scene><img class=tw-base alt><img class=tw-night alt><svg class=tw-svg preserveAspectRatio=none></svg><div class=tw-layer>"), qu = /* @__PURE__ */ u("<img class=tw-lit alt>"), Yu = /* @__PURE__ */ u("<span class=tw-daylight>"), Zu = /* @__PURE__ */ u("<svg><polygon class=tw-room></svg>", !1, !0, !1), Qu = /* @__PURE__ */ u("<svg><g></svg>", !1, !0, !1), Xu = /* @__PURE__ */ u("<svg><path></svg>", !1, !0, !1), Ju = /* @__PURE__ */ u("<svg><circle class=tw-pulse r=14></svg>", !1, !0, !1), eg = /* @__PURE__ */ u('<svg><circle class="tw-pulse late"r=14></svg>', !1, !0, !1), tg = /* @__PURE__ */ u("<svg><g><path class=tw-wire-glow></path><path class=tw-wire-flow></path><path class=tw-wire-hit></path><circle class=tw-wire-end r=5></circle><circle class=tw-wire-endhit r=20></svg>", !1, !0, !1), ng = /* @__PURE__ */ u("<em>°"), rg = /* @__PURE__ */ u("<em class=lit> × światło"), ag = /* @__PURE__ */ u("<span class=tw-label><b>"), ig = /* @__PURE__ */ u("<i>→ <!>°"), Pa = /* @__PURE__ */ u("<span class=tw-chip>"), og = /* @__PURE__ */ u("<span class=tw-screen>"), sg = /* @__PURE__ */ u("<span class=tw-particles><i></i><i></i><i>"), lg = /* @__PURE__ */ u("<span class=tw-chip>otwarte"), cg = /* @__PURE__ */ u("<span class=tw-chip>offline"), dg = /* @__PURE__ */ u("<span class=tw-motion>");
const fg = "2026-11-06", Jn = (e) => `${Ln}twin/${e}.webp?v=${fg}`;
function pg(e, t) {
  const r = e.glow;
  if (t < r.length) return r[t];
  const [n, a] = r[r.length - 1], o = t - r.length + 1;
  return [n + 16 * o, a + 10 * (o % 2 ? 1 : -1)];
}
function qe(e, t) {
  return t ? e.anchors[t] : void 0;
}
function Ma(e, t, r) {
  const n = t[r], a = qe(e, n.anchor);
  if (!a) return;
  const o = t.slice(0, r).filter((i) => i.anchor === n.anchor).length;
  return [a[0] + o * 6, a[1] + o * 22];
}
function ug(e) {
  const t = de(), r = ut(), n = ae(), a = (h) => e.rooms[h] ?? {}, o = K(() => e.mode === "energy" ? Lu(t(), e.rooms) : []), [i, l] = J(), c = () => o().find((h) => h.id === i());
  ft(() => e.mode !== "energy" && l(void 0));
  const f = (h) => h ? new Intl.DateTimeFormat("pl", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(h)) : "", g = (h) => h.entities.map((v) => ({
    id: v,
    lc: Q(t(), v)?.last_changed
  })).filter((v) => !!v.lc && !wa(t(), {
    entity: v.id
  })).sort((v, S) => v.lc.localeCompare(S.lc))[0], p = {
    on: "włączone",
    off: "wyłączone",
    playing: "odtwarza",
    paused: "pauza",
    idle: "czuwa",
    heat: "grzanie",
    cool: "chłodzenie",
    dry: "osuszanie",
    fan_only: "wentylacja",
    auto: "auto",
    running: "pracuje",
    unavailable: "niedostępne"
  }, x = (h) => {
    const v = Q(t(), h);
    return v ? p[v.state] ?? t()?.formatEntityState?.(v) ?? v.state : "—";
  }, b = (h) => {
    const v = () => Ee.find((_) => _.id === h.c.room)?.name ?? h.c.room, S = () => h.c.kind === "heat" || h.c.kind === "cool" ? Q(t(), h.c.entities[0]) : void 0;
    return (() => {
      var _ = Nu(), $ = _.firstChild, C = $.firstChild, y = C.firstChild, z = y.nextSibling, T = C.nextSibling, P = $.nextSibling, w = P.nextSibling;
      return le(_, "click", (R) => R.stopPropagation()), s(y, v), s(z, () => h.c.label), le(T, "click", () => l(void 0)), s(P, d(N, {
        get when() {
          return h.c.watts !== void 0;
        },
        get fallback() {
          return [ju(), Du()];
        },
        get children() {
          return [(() => {
            var R = Ru(), A = R.firstChild;
            return s(R, () => V(h.c.watts, 0, n.lang()), A), R;
          })(), Ou()];
        }
      })), s(_, d(N, {
        get when() {
          return S();
        },
        children: (R) => (() => {
          var A = Wu(), E = A.firstChild, j = E.nextSibling, M = j.nextSibling, O = M.nextSibling;
          return O.nextSibling, s(A, () => V(q(R().attributes.current_temperature), 1, n.lang()), j), s(A, () => V(q(R().attributes.temperature), 1, n.lang()), O), A;
        })()
      }), w), s(_, d(N, {
        get when() {
          return ka(Q(t(), h.c.remaining));
        },
        children: (R) => (() => {
          var A = Gu();
          return A.firstChild, s(A, R, null), A;
        })()
      }), w), s(w, d(B, {
        get each() {
          return h.c.entities;
        },
        children: (R) => (() => {
          var A = Iu(), E = A.firstChild, j = E.nextSibling;
          return s(E, () => me(R, Q(t(), R), h.c.names[R])), s(j, () => x(R)), A;
        })()
      })), s(_, d(N, {
        get when() {
          const R = g(h.c);
          return R ? `${R.id}|${R.lc}` : void 0;
        },
        keyed: !0,
        children: (R) => {
          const [A, E] = R.split("|"), j = {
            id: A,
            lc: E
          }, [M] = Si(() => `${j.id}|${j.lc}`, () => Cu(t(), j.id)), O = f(j.lc);
          return (() => {
            var G = Bu();
            return s(G, d(N, {
              get when() {
                return !M.loading;
              },
              get fallback() {
                return ["Włączone od ", O, " · sprawdzam historię…"];
              },
              get children() {
                return d(N, {
                  get when() {
                    return M()?.kind === "exact";
                  },
                  get fallback() {
                    return ["Włączone co najmniej od ", O, " (≥ ", F(() => za(Date.now() - Date.parse(j.lc))), ")", (() => {
                      var D = Fu();
                      return s(D, () => Tu[M()?.reason ?? "history"]), D;
                    })()];
                  },
                  get children() {
                    return ["Włączone od ", O, " · ", F(() => za(Date.now() - Date.parse(j.lc)))];
                  }
                });
              }
            })), G;
          })();
        }
      }), null), W((R) => {
        var A = `tw-powercard ${h.c.kind}`, E = et(h.c.at), j = h.c.watts !== void 0;
        return A !== R.e && dt(_, R.e = A), R.t = $e(_, E, R.t), j !== R.a && P.classList.toggle("measured", R.a = j), R;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), _;
    })();
  }, k = (h) => {
    const v = be(h.entity);
    ["light", "switch", "fan", "input_boolean"].includes(v) && r(v, "toggle", {
      entity_id: h.entity
    });
  }, m = (h) => (() => {
    var v = Hu(), S = v.firstChild;
    return le(v, "click", (_) => {
      _.stopPropagation(), h.onClick();
    }), s(S, d(ie, {
      get icon() {
        return h.icon;
      }
    })), s(v, () => h.children, null), W((_) => {
      var $ = `tw-hot ${h.cls ?? ""}`, C = !!h.on, y = et(h.at), z = h.label, T = h.label;
      return $ !== _.e && dt(v, _.e = $), C !== _.t && v.classList.toggle("on", _.t = C), _.a = $e(v, y, _.a), z !== _.o && L(v, "aria-label", _.o = z), T !== _.i && L(v, "title", _.i = T), _;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), v;
  })();
  return (() => {
    var h = Vu(), v = h.firstChild, S = v.firstChild, _ = S.nextSibling, $ = _.nextSibling, C = $.nextSibling;
    return le(h, "click", () => {
      l(void 0), e.onRoom(void 0);
    }), L(S, "draggable", !1), L(_, "draggable", !1), s(v, d(B, {
      each: Ee,
      children: (y) => (() => {
        var z = qu();
        return L(z, "draggable", !1), W((T) => {
          var P = Ot(t(), a(y.id)) > 0, w = Jn("lit"), R = Vp(y.poly);
          return P !== T.e && z.classList.toggle("on", T.e = P), w !== T.t && L(z, "src", T.t = w), R !== T.a && H(z, "clip-path", T.a = R), T;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), z;
      })()
    }), $), s(v, d(B, {
      each: Ee,
      children: (y) => d(B, {
        get each() {
          return y.glow;
        },
        children: (z) => (() => {
          var T = Yu();
          return W((P) => {
            var w = Ot(t(), a(y.id)) > 0, R = et(z);
            return w !== P.e && T.classList.toggle("on", P.e = w), P.t = $e(T, R, P.t), P;
          }, {
            e: void 0,
            t: void 0
          }), T;
        })()
      })
    }), $), L($, "viewBox", `0 0 ${Bt} ${Ft}`), s($, d(B, {
      each: Ee,
      children: (y) => {
        const z = () => Tn(t(), a(y.id));
        return (() => {
          var T = Zu();
          return le(T, "click", (P) => {
            P.stopPropagation(), e.onRoom(y.id);
          }), W((P) => {
            var w = e.selected === y.id, R = e.mode === "heat" && z() !== void 0, A = qp(y.poly), E = z() !== void 0 ? hr(z()) : "transparent";
            return w !== P.e && T.classList.toggle("selected", P.e = w), R !== P.t && T.classList.toggle("heat", P.t = R), A !== P.a && L(T, "points", P.a = A), E !== P.o && H(T, "--heat", P.o = E), P;
          }, {
            e: void 0,
            t: void 0,
            a: void 0,
            o: void 0
          }), T;
        })();
      }
    }), null), s($, d(B, {
      each: Ee,
      children: (y) => d(B, {
        get each() {
          return a(y.id).climate ?? [];
        },
        children: (z) => {
          const T = qe(y, z.anchor === "ac" ? "ac" : void 0), P = () => Pn(Q(t(), z.entity));
          return d(N, {
            get when() {
              return T && P();
            },
            get children() {
              var w = Qu();
              return s(w, d(B, {
                each: [-16, 0, 16],
                children: (R, A) => (() => {
                  var E = Xu();
                  return W((j) => {
                    var M = `M ${T[0] + R * 0.6} ${T[1] + 6} q ${R * 0.4} 18 ${R} 40`, O = `${A() * 0.35}s`;
                    return M !== j.e && L(E, "d", j.e = M), O !== j.t && H(E, "animation-delay", j.t = O), j;
                  }, {
                    e: void 0,
                    t: void 0
                  }), E;
                })()
              })), W(() => L(w, "class", `tw-flow ${P()}`)), w;
            }
          });
        }
      })
    }), null), s($, d(B, {
      each: Ee,
      children: (y) => d(B, {
        get each() {
          return a(y.id).alarms ?? [];
        },
        children: (z) => {
          const T = qe(y, z.anchor);
          return d(N, {
            get when() {
              return T && Ht(t(), z);
            },
            get children() {
              return [(() => {
                var P = Ju();
                return W((w) => {
                  var R = T[0], A = T[1];
                  return R !== w.e && L(P, "cx", w.e = R), A !== w.t && L(P, "cy", w.t = A), w;
                }, {
                  e: void 0,
                  t: void 0
                }), P;
              })(), (() => {
                var P = eg();
                return W((w) => {
                  var R = T[0], A = T[1];
                  return R !== w.e && L(P, "cx", w.e = R), A !== w.t && L(P, "cy", w.t = A), w;
                }, {
                  e: void 0,
                  t: void 0
                }), P;
              })()];
            }
          });
        }
      })
    }), null), s($, d(N, {
      get when() {
        return e.mode === "energy";
      },
      get children() {
        var y = Ku(), z = y.firstChild, T = z.nextSibling, P = T.nextSibling;
        return s(y, d(B, {
          get each() {
            return o();
          },
          children: (w, R) => (() => {
            var A = tg(), E = A.firstChild, j = E.nextSibling, M = j.nextSibling, O = M.nextSibling, G = O.nextSibling;
            return le(M, "click", (D) => {
              D.stopPropagation(), l(i() === w.id ? void 0 : w.id);
            }), le(G, "click", (D) => {
              D.stopPropagation(), l(i() === w.id ? void 0 : w.id);
            }), W((D) => {
              var U = `tw-wire ${w.kind}`, oe = w.watts !== void 0, xe = i() === w.id, Oe = Xn(De, w.at), lt = `${w.watts !== void 0 ? Qn(w) + 3 : Qn(w)}`, Yt = Xn(De, w.at), Zt = `${Qn(w)}`, ct = `${-(R() * 0.83 % 4)}s`, yt = Xn(De, w.at), vt = w.at[0], _t = w.at[1], Qt = w.at[0], $t = w.at[1];
              return U !== D.e && L(A, "class", D.e = U), oe !== D.t && A.classList.toggle("measured", D.t = oe), xe !== D.a && A.classList.toggle("picked", D.a = xe), Oe !== D.o && L(E, "d", D.o = Oe), lt !== D.i && H(E, "stroke-width", D.i = lt), Yt !== D.n && L(j, "d", D.n = Yt), Zt !== D.s && H(j, "stroke-width", D.s = Zt), ct !== D.h && H(j, "animation-delay", D.h = ct), yt !== D.r && L(M, "d", D.r = yt), vt !== D.d && L(O, "cx", D.d = vt), _t !== D.l && L(O, "cy", D.l = _t), Qt !== D.u && L(G, "cx", D.u = Qt), $t !== D.c && L(G, "cy", D.c = $t), D;
            }, {
              e: void 0,
              t: void 0,
              a: void 0,
              o: void 0,
              i: void 0,
              n: void 0,
              s: void 0,
              h: void 0,
              r: void 0,
              d: void 0,
              l: void 0,
              u: void 0,
              c: void 0
            }), A;
          })()
        }), z), W((w) => {
          var R = De[0], A = De[1], E = Ta(bn), j = (dn(t(), e.power) ?? 0) > bn, M = De[0], O = De[1], G = Ta(dn(t(), e.power)), D = De[0], U = De[1];
          return R !== w.e && L(z, "cx", w.e = R), A !== w.t && L(z, "cy", w.t = A), E !== w.a && L(z, "r", w.a = E), j !== w.o && T.classList.toggle("over", w.o = j), M !== w.i && L(T, "cx", w.i = M), O !== w.n && L(T, "cy", w.n = O), G !== w.s && L(T, "r", w.s = G), D !== w.h && L(P, "cx", w.h = D), U !== w.r && L(P, "cy", w.r = U), w;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0,
          i: void 0,
          n: void 0,
          s: void 0,
          h: void 0,
          r: void 0
        }), y;
      }
    }), null), s(C, d(N, {
      get when() {
        return e.mode === "energy";
      },
      get children() {
        return [(() => {
          var y = Uu(), z = y.firstChild, T = z.nextSibling, P = T.firstChild, w = P.nextSibling, R = w.nextSibling, A = R.nextSibling;
          return A.nextSibling, s(y, d(ie, {
            icon: "mdi:lightning-bolt"
          }), z), s(z, (() => {
            var E = F(() => dn(t(), e.power) !== void 0);
            return () => E() ? `${V(dn(t(), e.power), 0, n.lang())} W` : "licznik";
          })()), s(T, () => o().length, w), s(T, bn / 1e3, A), W((E) => $e(y, et(De), E)), y;
        })(), d(N, {
          get when() {
            return c();
          },
          children: (y) => d(b, {
            get c() {
              return y();
            }
          })
        })];
      }
    }), null), s(C, d(B, {
      each: Ee,
      children: (y) => {
        const z = () => a(y.id), T = () => Tn(t(), z()), P = () => Ot(t(), z());
        return [(() => {
          var w = ag(), R = w.firstChild;
          return s(R, () => y.name), s(w, d(N, {
            get when() {
              return F(() => e.mode === "heat" || e.mode === "home")() && T() !== void 0;
            },
            get children() {
              var A = ng(), E = A.firstChild;
              return s(A, () => V(T(), 1, n.lang()), E), W((j) => H(A, "--heat", hr(T()))), A;
            }
          }), null), s(w, d(N, {
            get when() {
              return F(() => e.mode === "energy")() && P() > 0;
            },
            get children() {
              var A = rg(), E = A.firstChild;
              return s(A, P, E), A;
            }
          }), null), W((A) => {
            var E = e.mode === "heat", j = e.selected === y.id, M = et(y.label);
            return E !== A.e && w.classList.toggle("heat", A.e = E), j !== A.t && w.classList.toggle("active", A.t = j), A.a = $e(w, M, A.a), A;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), w;
        })(), d(N, {
          get when() {
            return e.mode === "home" || e.mode === "energy" || e.selected === y.id;
          },
          get children() {
            return d(B, {
              get each() {
                return z().lights ?? [];
              },
              children: (w, R) => d(m, {
                get at() {
                  return pg(y, R());
                },
                get icon() {
                  return Q(t(), w.entity)?.state === "on" ? "mdi:lightbulb-on" : "mdi:lightbulb-outline";
                },
                cls: "light",
                get on() {
                  return Q(t(), w.entity)?.state === "on";
                },
                get label() {
                  return me(w.entity, Q(t(), w.entity), w.name);
                },
                onClick: () => k(w)
              })
            });
          }
        }), d(B, {
          get each() {
            return z().climate ?? [];
          },
          children: (w, R) => {
            const A = Ma(y, z().climate ?? [], R()), E = () => Q(t(), w.entity), j = () => Pn(E());
            return d(N, {
              when: A,
              get children() {
                return d(m, {
                  at: A,
                  get icon() {
                    return w.anchor === "ac" ? "mdi:air-conditioner" : "mdi:thermostat";
                  },
                  get cls() {
                    return `climate ${j() ?? "idle"}`;
                  },
                  get on() {
                    return mn(E());
                  },
                  get label() {
                    return me(w.entity, E(), w.name);
                  },
                  onClick: () => e.onRoom(y.id),
                  get children() {
                    var M = Pa();
                    return s(M, (() => {
                      var O = F(() => w.anchor === "ac" && E()?.state === "off");
                      return () => O() ? "wył." : `${V(q(E()?.attributes.current_temperature), 1, n.lang())}°`;
                    })(), null), s(M, d(N, {
                      get when() {
                        return F(() => E()?.state !== "off")() && q(E()?.attributes.temperature) !== void 0;
                      },
                      get children() {
                        var O = ig(), G = O.firstChild, D = G.nextSibling;
                        return D.nextSibling, s(O, () => V(q(E()?.attributes.temperature), Number(E()?.attributes.target_temp_step ?? 1) < 1 ? 1 : 0, n.lang()), D), O;
                      }
                    }), null), M;
                  }
                });
              }
            });
          }
        }), d(B, {
          get each() {
            return z().media ?? [];
          },
          children: (w, R) => {
            const A = Ma(y, z().media ?? [], R()), E = () => Q(t(), w.entity)?.state === "playing", j = () => !["off", "unavailable", "standby", "unknown"].includes(String(Q(t(), w.entity)?.state ?? "off"));
            return d(N, {
              get when() {
                return A && (R() === 0 || j());
              },
              get children() {
                return [d(N, {
                  get when() {
                    return E();
                  },
                  get children() {
                    var M = og();
                    return W((O) => $e(M, et(A), O)), M;
                  }
                }), d(m, {
                  at: A,
                  get icon() {
                    return w.anchor === "speaker" ? "mdi:speaker" : "mdi:television";
                  },
                  cls: "media",
                  get on() {
                    return j();
                  },
                  get label() {
                    return me(w.entity, Q(t(), w.entity), w.name);
                  },
                  onClick: () => e.onRoom(y.id)
                })];
              }
            });
          }
        }), d(B, {
          get each() {
            return z().purifier ?? [];
          },
          children: (w) => {
            const R = qe(y, w.anchor), A = () => mn(Q(t(), w.entity));
            return d(N, {
              when: R,
              get children() {
                return [d(N, {
                  get when() {
                    return A();
                  },
                  get children() {
                    var E = sg();
                    return W((j) => $e(E, et(R), j)), E;
                  }
                }), d(m, {
                  at: R,
                  icon: "mdi:air-purifier",
                  cls: "air",
                  get on() {
                    return A();
                  },
                  get label() {
                    return me(w.entity, Q(t(), w.entity), w.name);
                  },
                  onClick: () => k(w)
                })];
              }
            });
          }
        }), d(B, {
          get each() {
            return z().fan ?? [];
          },
          children: (w) => {
            const R = qe(y, w.anchor);
            return d(N, {
              when: R,
              get children() {
                return d(m, {
                  at: R,
                  icon: "mdi:fan",
                  cls: "fan",
                  get on() {
                    return mn(Q(t(), w.entity));
                  },
                  get label() {
                    return me(w.entity, Q(t(), w.entity), w.name);
                  },
                  onClick: () => k(w)
                });
              }
            });
          }
        }), d(B, {
          get each() {
            return z().appliances ?? [];
          },
          children: (w) => {
            const R = qe(y, w.anchor), A = () => Q(t(), w.entity), E = () => hi(A()), j = () => ka(Q(t(), w.remaining));
            return d(N, {
              when: R,
              get children() {
                return d(m, {
                  at: R,
                  get icon() {
                    return w.anchor === "dryer" ? "mdi:tumble-dryer" : "mdi:washing-machine";
                  },
                  cls: "appliance",
                  get on() {
                    return E();
                  },
                  get label() {
                    return me(w.entity, A(), w.name);
                  },
                  onClick: () => e.onRoom(y.id),
                  get children() {
                    return d(N, {
                      get when() {
                        return E();
                      },
                      get children() {
                        var M = Pa();
                        return s(M, () => j() ?? "pracuje"), M;
                      }
                    });
                  }
                });
              }
            });
          }
        }), d(B, {
          get each() {
            return z().windows ?? [];
          },
          children: (w) => {
            const R = qe(y, w.anchor), A = () => Q(t(), w.entity)?.state === "on";
            return d(N, {
              get when() {
                return R && (A() || e.mode === "security");
              },
              get children() {
                return d(m, {
                  at: R,
                  get icon() {
                    return A() ? "mdi:window-open-variant" : "mdi:window-closed-variant";
                  },
                  get cls() {
                    return A() ? "warn" : "ok";
                  },
                  get on() {
                    return A();
                  },
                  get label() {
                    return `${me(w.entity, Q(t(), w.entity), w.name)}: ${A() ? "otwarte" : "zamknięte"}`;
                  },
                  onClick: () => e.onRoom(y.id),
                  get children() {
                    return d(N, {
                      get when() {
                        return A();
                      },
                      get children() {
                        return lg();
                      }
                    });
                  }
                });
              }
            });
          }
        }), d(B, {
          get each() {
            return z().alarms ?? [];
          },
          children: (w) => {
            const R = qe(y, w.anchor), A = () => Ht(t(), w), E = () => wa(t(), w);
            return d(N, {
              get when() {
                return R && (A() || E() || e.mode === "security");
              },
              get children() {
                return d(m, {
                  at: R,
                  get icon() {
                    return F(() => !!E())() ? "mdi:battery-alert-variant-outline" : w.kind === "co" ? "mdi:molecule-co" : "mdi:water-alert";
                  },
                  get cls() {
                    return F(() => !!A())() ? "alarm" : E() ? "offline" : "ok";
                  },
                  get on() {
                    return A();
                  },
                  get label() {
                    return `${me(w.entity, Q(t(), w.entity), w.name)}${E() ? ": czujnik nie odpowiada" : ""}`;
                  },
                  onClick: () => e.onRoom(y.id),
                  get children() {
                    return d(N, {
                      get when() {
                        return E();
                      },
                      get children() {
                        return cg();
                      }
                    });
                  }
                });
              }
            });
          }
        }), d(B, {
          get each() {
            return z().motion ?? [];
          },
          children: (w) => {
            const R = qe(y, w.anchor), A = () => Q(t(), w.entity)?.state === "on";
            return d(N, {
              get when() {
                return R && (A() || e.mode === "security");
              },
              get children() {
                var E = dg();
                return W((j) => {
                  var M = !!A(), O = et(R), G = me(w.entity, Q(t(), w.entity), w.name);
                  return M !== j.e && E.classList.toggle("on", j.e = M), j.t = $e(E, O, j.t), G !== j.a && L(E, "title", j.a = G), j;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), E;
              }
            });
          }
        })];
      }
    }), null), W((y) => {
      var z = !!e.selected, T = `${e.box.left}px`, P = `${e.box.top}px`, w = `${e.box.width}px`, R = `${e.box.height}px`, A = `translate(${e.zoom.tx}px, ${e.zoom.ty}px) scale(${e.zoom.s})`, E = String(e.zoom.s), j = String(e.dark), M = Jn("day"), O = Jn("night"), G = String(e.dark);
      return z !== y.e && v.classList.toggle("zoomed", y.e = z), T !== y.t && H(v, "left", y.t = T), P !== y.a && H(v, "top", y.a = P), w !== y.o && H(v, "width", y.o = w), R !== y.i && H(v, "height", y.i = R), A !== y.n && H(v, "transform", y.n = A), E !== y.s && H(v, "--zoom", y.s = E), j !== y.h && H(v, "--dark", y.h = j), M !== y.r && L(S, "src", y.r = M), O !== y.d && L(_, "src", y.d = O), G !== y.l && H(_, "opacity", y.l = G), y;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0,
      s: void 0,
      h: void 0,
      r: void 0,
      d: void 0,
      l: void 0
    }), h;
  })();
}
var gg = /* @__PURE__ */ u("<div class=tw-banner><b></b><span>"), hg = /* @__PURE__ */ u("<div class=tw-empty>"), mg = /* @__PURE__ */ u("<div class=tw-app><div class=tw-backdrop>"), bg = /* @__PURE__ */ u("<span>");
function xg(e) {
  let t;
  const [r, n] = J({
    w: 1280,
    h: 800
  }), [a, o] = J(/* @__PURE__ */ new Date()), [i, l] = J("home"), [c, f] = J(), [g, p] = J(!1), x = new URLSearchParams(location.search), b = (Number(x.get("calm")) || 120) * 1e3;
  Ra(() => {
    const E = new ResizeObserver(() => n({
      w: t.clientWidth,
      h: t.clientHeight
    }));
    E.observe(t), n({
      w: t.clientWidth,
      h: t.clientHeight
    });
    const j = setInterval(() => o(/* @__PURE__ */ new Date()), 3e4), M = (U) => U.key === "Escape" && f(void 0);
    window.addEventListener("keydown", M);
    let O;
    const G = () => {
      p(!1), clearTimeout(O), O = setTimeout(() => p(!0), b);
    }, D = ["pointerdown", "pointermove", "mousedown", "click", "keydown", "wheel", "touchstart"];
    D.forEach((U) => t.addEventListener(U, G, {
      passive: !0,
      capture: !0
    })), G(), Be(() => {
      E.disconnect(), clearInterval(j), clearTimeout(O), window.removeEventListener("keydown", M), D.forEach((U) => t.removeEventListener(U, G, {
        capture: !0
      }));
    });
  }), ft(() => Ql(e.layout()?.names));
  const k = () => e.layout()?.twin?.rooms ?? {}, m = () => e.layout()?.twin?.hud ?? {}, h = () => r().w < 720, v = K(() => {
    const E = x.get("tod");
    if (E === "day") return 0;
    if (E === "night") return 1;
    const j = e.hass()?.states[m().sun ?? "sun.sun"], M = Number(j?.attributes?.elevation);
    if (j && Number.isFinite(M)) return Math.round(Math.min(1, Math.max(0, (6 - M) / 12)) * 100) / 100;
    if (j) return j.state === "above_horizon" ? 0 : 1;
    const O = a().getHours();
    return O >= 7 && O < 19 ? 0 : 1;
  }), S = K(() => v() >= 0.5 ? "night" : "day"), _ = K(() => e.hass() ? us(e.hass(), e.layout()?.features, e.demo()) : void 0, void 0, {
    equals: (E, j) => JSON.stringify(E ?? null) === JSON.stringify(j ?? null)
  }), $ = (E) => {
    const j = e.hass()?.states[E];
    return qt(E, j, {
      name: me(E, j)
    }).art === "ac";
  }, C = K(() => {
    const E = e.hass(), j = [];
    for (const [M, O] of Object.entries(k()))
      for (const G of O.alarms ?? []) Ht(E, G) && j.push({
        name: me(G.entity, Q(E, G.entity), G.name),
        room: M,
        kind: G.kind
      });
    return j;
  }), y = () => Object.values(k()).flatMap((E) => E.windows ?? []).filter((E) => Q(e.hass(), E.entity)?.state === "on").length, z = () => h() ? 62 : 84, T = () => h() ? 70 : 92, P = () => h() ? 0 : Math.round(Math.min(480, Math.max(400, r().w * 0.31))), w = K(() => {
    const {
      w: E,
      h: j
    } = r(), M = z(), O = E, G = h() ? Math.min(j - M - T(), E * 0.68) : j - M - T(), D = Math.min(O * 0.96 / Je.w, G * 0.96 / Je.h), U = O / 2, oe = M + G / 2;
    return {
      width: Bt * D,
      height: Ft * D,
      left: U - (Je.x + Je.w / 2) * D,
      top: oe - (Je.y + Je.h / 2) * D
    };
  }), R = K(() => {
    const E = Cn(c());
    if (!E) return {
      tx: 0,
      ty: 0,
      s: 1
    };
    const j = w(), M = j.width / Bt, O = Yp(E.poly), {
      w: G,
      h: D
    } = r(), U = h() ? {
      x: 0,
      y: z(),
      w: G,
      h: Math.max(160, D * 0.4 - z())
    } : {
      x: 0,
      y: z(),
      w: G - P() - 24,
      h: D - z() - 24
    }, oe = Math.max(1, Math.min(U.w * 0.84 / (O.w * M), U.h * 0.8 / (O.h * M), 3.2)), xe = (O.x + O.w / 2) * M, Oe = (O.y + O.h / 2) * M;
    return {
      tx: U.x + U.w / 2 - j.left - oe * xe,
      ty: U.y + U.h / 2 - j.top - oe * Oe,
      s: oe
    };
  }), A = (E) => f((j) => E && j === E ? j : E);
  return d(po, {
    get value() {
      return {
        hass: e.hass,
        demo: e.demo,
        narrow: e.narrow,
        breakpoint: () => "sm",
        version: e.version,
        page: () => c() ?? "home",
        navigate: (E) => f(E),
        host: e.host
      };
    },
    get children() {
      var E = mg();
      E.firstChild;
      var j = t;
      return typeof j == "function" ? jt(j, E) : t = E, s(E, d(ug, {
        get rooms() {
          return k();
        },
        get tod() {
          return S();
        },
        get dark() {
          return v();
        },
        get power() {
          return m().power;
        },
        get mode() {
          return i();
        },
        get selected() {
          return c();
        },
        get box() {
          return w();
        },
        get zoom() {
          return R();
        },
        onRoom: A
      }), null), s(E, d(Bp, {
        get hud() {
          return m();
        },
        get now() {
          return a();
        },
        get tod() {
          return S();
        },
        get alerts() {
          return C().length;
        },
        get open() {
          return y();
        },
        get phone() {
          return h();
        }
      }), null), s(E, d(N, {
        get when() {
          return C().length;
        },
        get children() {
          var M = gg(), O = M.firstChild, G = O.nextSibling;
          return le(M, "click", () => f(C()[0].room)), s(M, d(ie, {
            get icon() {
              return C()[0].kind === "co" ? "mdi:molecule-co" : "mdi:water-alert";
            }
          }), O), s(O, () => C()[0].kind === "co" ? "Alarm CO" : "Wyciek wody"), s(G, () => C().map((D) => {
            const U = Cn(D.room)?.name ?? D.room;
            return D.name.toLowerCase().includes(U.toLowerCase()) ? D.name : `${D.name} · ${U}`;
          }).join("  ·  ")), M;
        }
      }), null), s(E, d(N, {
        get when() {
          return F(() => !!h())() && !c();
        },
        get children() {
          return d(eu, {
            get rooms() {
              return k();
            },
            onRoom: (M) => f(M),
            get style() {
              return {
                top: `${w().top + w().height * ((Je.y + Je.h) / Ft) + 8}px`,
                bottom: `${T()}px`
              };
            }
          });
        }
      }), null), s(E, d(N, {
        get when() {
          return !(h() && c());
        },
        get children() {
          return d(Hp, {
            get mode() {
              return i();
            },
            onMode: l,
            get style() {
              return F(() => !!(c() && !h()))() ? {
                left: `${(r().w - P()) / 2}px`
              } : {};
            }
          });
        }
      }), null), s(E, d(N, {
        get when() {
          return c();
        },
        keyed: !0,
        children: (M) => d(zu, {
          id: M,
          get layout() {
            return e.layout();
          },
          get features() {
            return _();
          },
          isAc: $,
          get phone() {
            return h();
          },
          onClose: () => f(void 0)
        })
      }), null), s(E, d(N, {
        get when() {
          return F(() => !e.layout())() && e.layout() !== void 0;
        },
        get children() {
          var M = hg();
          return s(M, d(B, {
            each: ["Brak pliku layout.json", "Uruchom tools/twin_layout.py i skopiuj wynik do integracji."],
            children: (O) => (() => {
              var G = bg();
              return s(G, O), G;
            })()
          })), M;
        }
      }), null), W((M) => {
        var O = S(), G = i(), D = g() ? "true" : "false", U = !!h(), oe = !!c(), xe = `${P()}px`;
        return O !== M.e && L(E, "data-tod", M.e = O), G !== M.t && L(E, "data-mode", M.t = G), D !== M.a && L(E, "data-calm", M.a = D), U !== M.o && E.classList.toggle("phone", M.o = U), oe !== M.i && E.classList.toggle("zoomed", M.i = oe), xe !== M.n && H(E, "--panel-w", M.n = xe), M;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0
      }), E;
    }
  });
}
const wg = "0.1.0", kg = 1500, yg = 8e3, vg = 6e4;
class _g extends HTMLElement {
  hassSignal = J(void 0, {
    equals: !1
  });
  layoutSignal = J(void 0);
  narrowSignal = J(!1);
  demoSignal = J(!1);
  routeSignal = J(void 0);
  panelInfo;
  dispose;
  demoTimer;
  disposeTimer;
  live = !1;
  layoutRequested;
  set hass(t) {
    this.live = !0, this.demoSignal[1](!1), clearTimeout(this.demoTimer), this.hassSignal[1](t), this.layoutRequested === void 0 && this.loadLayout(this.panelInfo?.config?.layout ?? null);
  }
  get hass() {
    return this.hassSignal[0]();
  }
  set narrow(t) {
    this.narrowSignal[1](!!t);
  }
  get narrow() {
    return this.narrowSignal[0]();
  }
  set route(t) {
    this.routeSignal[1](t);
  }
  get route() {
    return this.routeSignal[0]();
  }
  set panel(t) {
    this.panelInfo = t, this.loadLayout(t?.config?.layout ?? null);
  }
  get panel() {
    return this.panelInfo;
  }
  async loadLayout(t) {
    const r = t ?? "";
    if (this.layoutRequested === r) return;
    this.layoutRequested = r;
    const n = new AbortController(), a = setTimeout(() => n.abort(), yg);
    let o = null;
    try {
      const i = `${Ln}layout.json${t ? `?v=${encodeURIComponent(t)}` : ""}`, l = await fetch(i, {
        credentials: "same-origin",
        cache: t ? "default" : "no-cache",
        signal: n.signal
      }), c = l.ok ? await l.json() : null;
      o = c && c.version === 1 ? c : null;
    } catch (i) {
      console.warn("[krystal-twin] layout.json could not be loaded", i);
    } finally {
      clearTimeout(a);
    }
    this.layoutRequested === r && (vo(o?.language ?? "pl"), this.layoutSignal[1](o));
  }
  /** Properties set before the element was upgraded shadow the setters; replay them. */
  upgradeProperties() {
    for (const t of ["hass", "narrow", "route", "panel"])
      if (Object.prototype.hasOwnProperty.call(this, t)) {
        const r = this[t];
        delete this[t], this[t] = r;
      }
  }
  connectedCallback() {
    if (this.upgradeProperties(), clearTimeout(this.disposeTimer), this.dispose && this.shadowRoot?.querySelector(".tw-mount")) return;
    if (!this.shadowRoot) {
      const n = this.attachShadow({
        mode: "open"
      }), a = document.createElement("style");
      a.textContent = `${Ho}
${Ko}`, n.append(a);
    }
    const t = this.shadowRoot;
    t.querySelector(".tw-mount")?.remove();
    const r = document.createElement("div");
    r.className = "tw-mount", t.append(r), this.dispose = Ji(() => {
      const n = this;
      return d(xg, {
        get hass() {
          return n.hassSignal[0];
        },
        get layout() {
          return n.layoutSignal[0];
        },
        get demo() {
          return n.demoSignal[0];
        },
        get narrow() {
          return n.narrowSignal[0];
        },
        version: () => wg,
        get route() {
          return n.routeSignal[0];
        },
        host: n
      });
    }, r), this.live ? this.layoutRequested === void 0 && this.loadLayout(this.panelInfo?.config?.layout ?? null) : this.demoTimer = setTimeout(() => this.startDemo(), new URLSearchParams(location.search).has("demo") ? 0 : kg);
  }
  disconnectedCallback() {
    clearTimeout(this.disposeTimer), this.disposeTimer = setTimeout(() => {
      clearTimeout(this.demoTimer), this.dispose?.(), this.dispose = void 0, this.shadowRoot?.querySelector(".tw-mount")?.remove();
    }, vg);
  }
  startDemo() {
    if (this.live) return;
    this.demoSignal[1](!0), this.loadLayout(null);
    const t = Fo((r) => this.hassSignal[1](r));
    this.hassSignal[1](t);
  }
}
customElements.get("krystal-twin-panel") || customElements.define("krystal-twin-panel", _g);
