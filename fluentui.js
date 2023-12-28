const t = function () {
    if ("undefined" != typeof globalThis) return globalThis;
    if ("undefined" != typeof global) return global;
    if ("undefined" != typeof self) return self;
    if ("undefined" != typeof window) return window;
    try {
        return new Function("return this")()
    } catch (t) {
        return {}
    }
}();
void 0 === t.trustedTypes && (t.trustedTypes = {createPolicy: (t, e) => e});
const e = {configurable: !1, enumerable: !1, writable: !1};
void 0 === t.FAST && Reflect.defineProperty(t, "FAST", Object.assign({value: Object.create(null)}, e));
const i = t.FAST;
if (void 0 === i.getById) {
    const t = Object.create(null);
    Reflect.defineProperty(i, "getById", Object.assign({
        value(e, i) {
            let o = t[e];
            return void 0 === o && (o = i ? t[e] = i() : null), o
        }
    }, e))
}
const o = Object.freeze([]);

function s() {
    const t = new WeakMap;
    return function (e) {
        let i = t.get(e);
        if (void 0 === i) {
            let o = Reflect.getPrototypeOf(e);
            for (; void 0 === i && null !== o;) i = t.get(o), o = Reflect.getPrototypeOf(o);
            i = void 0 === i ? [] : i.slice(0), t.set(e, i)
        }
        return i
    }
}

const n = t.FAST.getById(1, () => {
    const e = [], i = [];

    function o() {
        if (i.length) throw i.shift()
    }

    function s(t) {
        try {
            t.call()
        } catch (t) {
            i.push(t), setTimeout(o, 0)
        }
    }

    function n() {
        let t = 0;
        for (; t < e.length;) if (s(e[t]), t++, t > 1024) {
            for (let i = 0, o = e.length - t; i < o; i++) e[i] = e[i + t];
            e.length -= t, t = 0
        }
        e.length = 0
    }

    return Object.freeze({
        enqueue: function (i) {
            e.length < 1 && t.requestAnimationFrame(n), e.push(i)
        }, process: n
    })
}), r = t.trustedTypes.createPolicy("fast-html", {createHTML: t => t});
let a = r;
const l = "fast-" + Math.random().toString(36).substring(2, 8), c = l + "{", h = "}" + l, d = Object.freeze({
    supportsAdoptedStyleSheets: Array.isArray(document.adoptedStyleSheets) && "replace" in CSSStyleSheet.prototype,
    setHTMLPolicy(t) {
        if (a !== r) throw new Error("The HTML policy can only be set once.");
        a = t
    },
    createHTML: t => a.createHTML(t),
    isMarker: t => t && 8 === t.nodeType && t.data.startsWith(l),
    extractDirectiveIndexFromMarker: t => parseInt(t.data.replace(l + ":", "")),
    createInterpolationPlaceholder: t => `${c}${t}${h}`,
    createCustomAttributePlaceholder(t, e) {
        return `${t}="${this.createInterpolationPlaceholder(e)}"`
    },
    createBlockPlaceholder: t => `\x3c!--${l}:${t}--\x3e`,
    queueUpdate: n.enqueue,
    processUpdates: n.process,
    nextUpdate: () => new Promise(n.enqueue),
    setAttribute(t, e, i) {
        null == i ? t.removeAttribute(e) : t.setAttribute(e, i)
    },
    setBooleanAttribute(t, e, i) {
        i ? t.setAttribute(e, "") : t.removeAttribute(e)
    },
    removeChildNodes(t) {
        for (let e = t.firstChild; null !== e; e = t.firstChild) t.removeChild(e)
    },
    createTemplateWalker: t => document.createTreeWalker(t, 133, null, !1)
});

class u {
    constructor(t, e) {
        this.sub1 = void 0, this.sub2 = void 0, this.spillover = void 0, this.source = t, this.sub1 = e
    }

    has(t) {
        return void 0 === this.spillover ? this.sub1 === t || this.sub2 === t : -1 !== this.spillover.indexOf(t)
    }

    subscribe(t) {
        const e = this.spillover;
        if (void 0 === e) {
            if (this.has(t)) return;
            if (void 0 === this.sub1) return void (this.sub1 = t);
            if (void 0 === this.sub2) return void (this.sub2 = t);
            this.spillover = [this.sub1, this.sub2, t], this.sub1 = void 0, this.sub2 = void 0
        } else {
            -1 === e.indexOf(t) && e.push(t)
        }
    }

    unsubscribe(t) {
        const e = this.spillover;
        if (void 0 === e) this.sub1 === t ? this.sub1 = void 0 : this.sub2 === t && (this.sub2 = void 0); else {
            const i = e.indexOf(t);
            -1 !== i && e.splice(i, 1)
        }
    }

    notify(t) {
        const e = this.spillover, i = this.source;
        if (void 0 === e) {
            const e = this.sub1, o = this.sub2;
            void 0 !== e && e.handleChange(i, t), void 0 !== o && o.handleChange(i, t)
        } else for (let o = 0, s = e.length; o < s; ++o) e[o].handleChange(i, t)
    }
}

class p {
    constructor(t) {
        this.subscribers = {}, this.sourceSubscribers = null, this.source = t
    }

    notify(t) {
        var e;
        const i = this.subscribers[t];
        void 0 !== i && i.notify(t), null === (e = this.sourceSubscribers) || void 0 === e || e.notify(t)
    }

    subscribe(t, e) {
        var i;
        if (e) {
            let i = this.subscribers[e];
            void 0 === i && (this.subscribers[e] = i = new u(this.source)), i.subscribe(t)
        } else this.sourceSubscribers = null !== (i = this.sourceSubscribers) && void 0 !== i ? i : new u(this.source), this.sourceSubscribers.subscribe(t)
    }

    unsubscribe(t, e) {
        var i;
        if (e) {
            const i = this.subscribers[e];
            void 0 !== i && i.unsubscribe(t)
        } else null === (i = this.sourceSubscribers) || void 0 === i || i.unsubscribe(t)
    }
}

const g = i.getById(2, () => {
    const t = /(:|&&|\|\||if)/, e = new WeakMap, i = d.queueUpdate;
    let o = void 0, n = t => {
        throw new Error("Must call enableArrayObservation before observing arrays.")
    };

    function r(t) {
        let i = t.$fastController || e.get(t);
        return void 0 === i && (Array.isArray(t) ? i = n(t) : e.set(t, i = new p(t))), i
    }

    const a = s();

    class l {
        constructor(t) {
            this.name = t, this.field = "_" + t, this.callback = t + "Changed"
        }

        getValue(t) {
            return void 0 !== o && o.watch(t, this.name), t[this.field]
        }

        setValue(t, e) {
            const i = this.field, o = t[i];
            if (o !== e) {
                t[i] = e;
                const s = t[this.callback];
                "function" == typeof s && s.call(t, o, e), r(t).notify(this.name)
            }
        }
    }

    class c extends u {
        constructor(t, e, i = !1) {
            super(t, e), this.binding = t, this.isVolatileBinding = i, this.needsRefresh = !0, this.needsQueue = !0, this.first = this, this.last = null, this.propertySource = void 0, this.propertyName = void 0, this.notifier = void 0, this.next = void 0
        }

        observe(t, e) {
            this.needsRefresh && null !== this.last && this.disconnect();
            const i = o;
            o = this.needsRefresh ? this : void 0, this.needsRefresh = this.isVolatileBinding;
            const s = this.binding(t, e);
            return o = i, s
        }

        disconnect() {
            if (null !== this.last) {
                let t = this.first;
                for (; void 0 !== t;) t.notifier.unsubscribe(this, t.propertyName), t = t.next;
                this.last = null, this.needsRefresh = this.needsQueue = !0
            }
        }

        watch(t, e) {
            const i = this.last, s = r(t), n = null === i ? this.first : {};
            if (n.propertySource = t, n.propertyName = e, n.notifier = s, s.subscribe(this, e), null !== i) {
                if (!this.needsRefresh) {
                    let e;
                    o = void 0, e = i.propertySource[i.propertyName], o = this, t === e && (this.needsRefresh = !0)
                }
                i.next = n
            }
            this.last = n
        }

        handleChange() {
            this.needsQueue && (this.needsQueue = !1, i(this))
        }

        call() {
            null !== this.last && (this.needsQueue = !0, this.notify(this))
        }

        records() {
            let t = this.first;
            return {
                next: () => {
                    const e = t;
                    return void 0 === e ? {value: void 0, done: !0} : (t = t.next, {value: e, done: !1})
                }, [Symbol.iterator]: function () {
                    return this
                }
            }
        }
    }

    return Object.freeze({
        setArrayObserverFactory(t) {
            n = t
        }, getNotifier: r, track(t, e) {
            void 0 !== o && o.watch(t, e)
        }, trackVolatile() {
            void 0 !== o && (o.needsRefresh = !0)
        }, notify(t, e) {
            r(t).notify(e)
        }, defineProperty(t, e) {
            "string" == typeof e && (e = new l(e)), a(t).push(e), Reflect.defineProperty(t, e.name, {
                enumerable: !0,
                get: function () {
                    return e.getValue(this)
                },
                set: function (t) {
                    e.setValue(this, t)
                }
            })
        }, getAccessors: a, binding(t, e, i = this.isVolatileBinding(t)) {
            return new c(t, e, i)
        }, isVolatileBinding: e => t.test(e.toString())
    })
});

function f(t, e) {
    g.defineProperty(t, e)
}

const m = i.getById(3, () => {
    let t = null;
    return {
        get: () => t, set(e) {
            t = e
        }
    }
});

class v {
    constructor() {
        this.index = 0, this.length = 0, this.parent = null, this.parentContext = null
    }

    get event() {
        return m.get()
    }

    get isEven() {
        return this.index % 2 == 0
    }

    get isOdd() {
        return this.index % 2 != 0
    }

    get isFirst() {
        return 0 === this.index
    }

    get isInMiddle() {
        return !this.isFirst && !this.isLast
    }

    get isLast() {
        return this.index === this.length - 1
    }

    static setEvent(t) {
        m.set(t)
    }
}

g.defineProperty(v.prototype, "index"), g.defineProperty(v.prototype, "length");
const b = Object.seal(new v);

class y {
    constructor() {
        this.targetIndex = 0
    }
}

class x extends y {
    constructor() {
        super(...arguments), this.createPlaceholder = d.createInterpolationPlaceholder
    }
}

class $ extends y {
    constructor(t, e, i) {
        super(), this.name = t, this.behavior = e, this.options = i
    }

    createPlaceholder(t) {
        return d.createCustomAttributePlaceholder(this.name, t)
    }

    createBehavior(t) {
        return new this.behavior(t, this.options)
    }
}

function w(t, e) {
    this.source = t, this.context = e, null === this.bindingObserver && (this.bindingObserver = g.binding(this.binding, this, this.isBindingVolatile)), this.updateTarget(this.bindingObserver.observe(t, e))
}

function k(t, e) {
    this.source = t, this.context = e, this.target.addEventListener(this.targetName, this)
}

function C() {
    this.bindingObserver.disconnect(), this.source = null, this.context = null
}

function I() {
    this.bindingObserver.disconnect(), this.source = null, this.context = null;
    const t = this.target.$fastView;
    void 0 !== t && t.isComposed && (t.unbind(), t.needsBindOnly = !0)
}

function F() {
    this.target.removeEventListener(this.targetName, this), this.source = null, this.context = null
}

function D(t) {
    d.setAttribute(this.target, this.targetName, t)
}

function T(t) {
    d.setBooleanAttribute(this.target, this.targetName, t)
}

function S(t) {
    if (null == t && (t = ""), t.create) {
        this.target.textContent = "";
        let e = this.target.$fastView;
        void 0 === e ? e = t.create() : this.target.$fastTemplate !== t && (e.isComposed && (e.remove(), e.unbind()), e = t.create()), e.isComposed ? e.needsBindOnly && (e.needsBindOnly = !1, e.bind(this.source, this.context)) : (e.isComposed = !0, e.bind(this.source, this.context), e.insertBefore(this.target), this.target.$fastView = e, this.target.$fastTemplate = t)
    } else {
        const e = this.target.$fastView;
        void 0 !== e && e.isComposed && (e.isComposed = !1, e.remove(), e.needsBindOnly ? e.needsBindOnly = !1 : e.unbind()), this.target.textContent = t
    }
}

function O(t) {
    this.target[this.targetName] = t
}

function E(t) {
    const e = this.classVersions || Object.create(null), i = this.target;
    let o = this.version || 0;
    if (null != t && t.length) {
        const s = t.split(/\s+/);
        for (let t = 0, n = s.length; t < n; ++t) {
            const n = s[t];
            "" !== n && (e[n] = o, i.classList.add(n))
        }
    }
    if (this.classVersions = e, this.version = o + 1, 0 !== o) {
        o -= 1;
        for (const t in e) e[t] === o && i.classList.remove(t)
    }
}

class V extends x {
    constructor(t) {
        super(), this.binding = t, this.bind = w, this.unbind = C, this.updateTarget = D, this.isBindingVolatile = g.isVolatileBinding(this.binding)
    }

    get targetName() {
        return this.originalTargetName
    }

    set targetName(t) {
        if (this.originalTargetName = t, void 0 !== t) switch (t[0]) {
            case":":
                if (this.cleanedTargetName = t.substr(1), this.updateTarget = O, "innerHTML" === this.cleanedTargetName) {
                    const t = this.binding;
                    this.binding = (e, i) => d.createHTML(t(e, i))
                }
                break;
            case"?":
                this.cleanedTargetName = t.substr(1), this.updateTarget = T;
                break;
            case"@":
                this.cleanedTargetName = t.substr(1), this.bind = k, this.unbind = F;
                break;
            default:
                this.cleanedTargetName = t, "class" === t && (this.updateTarget = E)
        }
    }

    targetAtContent() {
        this.updateTarget = S, this.unbind = I
    }

    createBehavior(t) {
        return new R(t, this.binding, this.isBindingVolatile, this.bind, this.unbind, this.updateTarget, this.cleanedTargetName)
    }
}

class R {
    constructor(t, e, i, o, s, n, r) {
        this.source = null, this.context = null, this.bindingObserver = null, this.target = t, this.binding = e, this.isBindingVolatile = i, this.bind = o, this.unbind = s, this.updateTarget = n, this.targetName = r
    }

    handleChange() {
        this.updateTarget(this.bindingObserver.observe(this.source, this.context))
    }

    handleEvent(t) {
        v.setEvent(t);
        const e = this.binding(this.source, this.context);
        v.setEvent(null), !0 !== e && t.preventDefault()
    }
}

let A = null;

class L {
    addFactory(t) {
        t.targetIndex = this.targetIndex, this.behaviorFactories.push(t)
    }

    captureContentBinding(t) {
        t.targetAtContent(), this.addFactory(t)
    }

    reset() {
        this.behaviorFactories = [], this.targetIndex = -1
    }

    release() {
        A = this
    }

    static borrow(t) {
        const e = A || new L;
        return e.directives = t, e.reset(), A = null, e
    }
}

function P(t) {
    if (1 === t.length) return t[0];
    let e;
    const i = t.length, o = t.map(t => "string" == typeof t ? () => t : (e = t.targetName || e, t.binding)),
        s = new V((t, e) => {
            let s = "";
            for (let n = 0; n < i; ++n) s += o[n](t, e);
            return s
        });
    return s.targetName = e, s
}

const z = h.length;

function H(t, e) {
    const i = e.split(c);
    if (1 === i.length) return null;
    const o = [];
    for (let e = 0, s = i.length; e < s; ++e) {
        const s = i[e], n = s.indexOf(h);
        let r;
        if (-1 === n) r = s; else {
            const e = parseInt(s.substring(0, n));
            o.push(t.directives[e]), r = s.substring(n + z)
        }
        "" !== r && o.push(r)
    }
    return o
}

function M(t, e, i = !1) {
    const o = e.attributes;
    for (let s = 0, n = o.length; s < n; ++s) {
        const r = o[s], a = r.value, l = H(t, a);
        let c = null;
        null === l ? i && (c = new V(() => a), c.targetName = r.name) : c = P(l), null !== c && (e.removeAttributeNode(r), s--, n--, t.addFactory(c))
    }
}

function B(t, e, i) {
    const o = H(t, e.textContent);
    if (null !== o) {
        let s = e;
        for (let n = 0, r = o.length; n < r; ++n) {
            const r = o[n], a = 0 === n ? e : s.parentNode.insertBefore(document.createTextNode(""), s.nextSibling);
            "string" == typeof r ? a.textContent = r : (a.textContent = " ", t.captureContentBinding(r)), s = a, t.targetIndex++, a !== e && i.nextNode()
        }
        t.targetIndex--
    }
}

const N = document.createRange();

class j {
    constructor(t, e) {
        this.fragment = t, this.behaviors = e, this.source = null, this.context = null, this.firstChild = t.firstChild, this.lastChild = t.lastChild
    }

    appendTo(t) {
        t.appendChild(this.fragment)
    }

    insertBefore(t) {
        if (this.fragment.hasChildNodes()) t.parentNode.insertBefore(this.fragment, t); else {
            const e = this.lastChild;
            if (t.previousSibling === e) return;
            const i = t.parentNode;
            let o, s = this.firstChild;
            for (; s !== e;) o = s.nextSibling, i.insertBefore(s, t), s = o;
            i.insertBefore(e, t)
        }
    }

    remove() {
        const t = this.fragment, e = this.lastChild;
        let i, o = this.firstChild;
        for (; o !== e;) i = o.nextSibling, t.appendChild(o), o = i;
        t.appendChild(e)
    }

    dispose() {
        const t = this.firstChild.parentNode, e = this.lastChild;
        let i, o = this.firstChild;
        for (; o !== e;) i = o.nextSibling, t.removeChild(o), o = i;
        t.removeChild(e);
        const s = this.behaviors, n = this.source;
        for (let t = 0, e = s.length; t < e; ++t) s[t].unbind(n)
    }

    bind(t, e) {
        const i = this.behaviors;
        if (this.source !== t) if (null !== this.source) {
            const o = this.source;
            this.source = t, this.context = e;
            for (let s = 0, n = i.length; s < n; ++s) {
                const n = i[s];
                n.unbind(o), n.bind(t, e)
            }
        } else {
            this.source = t, this.context = e;
            for (let o = 0, s = i.length; o < s; ++o) i[o].bind(t, e)
        }
    }

    unbind() {
        if (null === this.source) return;
        const t = this.behaviors, e = this.source;
        for (let i = 0, o = t.length; i < o; ++i) t[i].unbind(e);
        this.source = null
    }

    static disposeContiguousBatch(t) {
        if (0 !== t.length) {
            N.setStartBefore(t[0].firstChild), N.setEndAfter(t[t.length - 1].lastChild), N.deleteContents();
            for (let e = 0, i = t.length; e < i; ++e) {
                const i = t[e], o = i.behaviors, s = i.source;
                for (let t = 0, e = o.length; t < e; ++t) o[t].unbind(s)
            }
        }
    }
}

class U {
    constructor(t, e) {
        this.behaviorCount = 0, this.hasHostBehaviors = !1, this.fragment = null, this.targetOffset = 0, this.viewBehaviorFactories = null, this.hostBehaviorFactories = null, this.html = t, this.directives = e
    }

    create(t) {
        if (null === this.fragment) {
            let t;
            const e = this.html;
            if ("string" == typeof e) {
                t = document.createElement("template"), t.innerHTML = d.createHTML(e);
                const i = t.content.firstElementChild;
                null !== i && "TEMPLATE" === i.tagName && (t = i)
            } else t = e;
            const i = function (t, e) {
                const i = t.content;
                document.adoptNode(i);
                const o = L.borrow(e);
                M(o, t, !0);
                const s = o.behaviorFactories;
                o.reset();
                const n = d.createTemplateWalker(i);
                let r;
                for (; r = n.nextNode();) switch (o.targetIndex++, r.nodeType) {
                    case 1:
                        M(o, r);
                        break;
                    case 3:
                        B(o, r, n);
                        break;
                    case 8:
                        d.isMarker(r) && o.addFactory(e[d.extractDirectiveIndexFromMarker(r)])
                }
                let a = 0;
                (d.isMarker(i.firstChild) || 1 === i.childNodes.length && e.length) && (i.insertBefore(document.createComment(""), i.firstChild), a = -1);
                const l = o.behaviorFactories;
                return o.release(), {fragment: i, viewBehaviorFactories: l, hostBehaviorFactories: s, targetOffset: a}
            }(t, this.directives);
            this.fragment = i.fragment, this.viewBehaviorFactories = i.viewBehaviorFactories, this.hostBehaviorFactories = i.hostBehaviorFactories, this.targetOffset = i.targetOffset, this.behaviorCount = this.viewBehaviorFactories.length + this.hostBehaviorFactories.length, this.hasHostBehaviors = this.hostBehaviorFactories.length > 0
        }
        const e = this.fragment.cloneNode(!0), i = this.viewBehaviorFactories, o = new Array(this.behaviorCount),
            s = d.createTemplateWalker(e);
        let n = 0, r = this.targetOffset, a = s.nextNode();
        for (let t = i.length; n < t; ++n) {
            const t = i[n], e = t.targetIndex;
            for (; null !== a;) {
                if (r === e) {
                    o[n] = t.createBehavior(a);
                    break
                }
                a = s.nextNode(), r++
            }
        }
        if (this.hasHostBehaviors) {
            const e = this.hostBehaviorFactories;
            for (let i = 0, s = e.length; i < s; ++i, ++n) o[n] = e[i].createBehavior(t)
        }
        return new j(e, o)
    }

    render(t, e, i) {
        "string" == typeof e && (e = document.getElementById(e)), void 0 === i && (i = e);
        const o = this.create(i);
        return o.bind(t, b), o.appendTo(e), o
    }
}

const q = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

function _(t, ...e) {
    const i = [];
    let o = "";
    for (let s = 0, n = t.length - 1; s < n; ++s) {
        const n = t[s];
        let r = e[s];
        if (o += n, r instanceof U) {
            const t = r;
            r = () => t
        }
        if ("function" == typeof r && (r = new V(r)), r instanceof x) {
            const t = q.exec(n);
            null !== t && (r.targetName = t[2])
        }
        r instanceof y ? (o += r.createPlaceholder(i.length), i.push(r)) : o += r
    }
    return o += t[t.length - 1], new U(o, i)
}

class G {
    constructor() {
        this.targets = new WeakSet
    }

    addStylesTo(t) {
        this.targets.add(t)
    }

    removeStylesFrom(t) {
        this.targets.delete(t)
    }

    isAttachedTo(t) {
        return this.targets.has(t)
    }

    withBehaviors(...t) {
        return this.behaviors = null === this.behaviors ? t : this.behaviors.concat(t), this
    }
}

function W(t) {
    return t.map(t => t instanceof G ? W(t.styles) : [t]).reduce((t, e) => t.concat(e), [])
}

function K(t) {
    return t.map(t => t instanceof G ? t.behaviors : null).reduce((t, e) => null === e ? t : (null === t && (t = []), t.concat(e)), null)
}

G.create = (() => {
    if (d.supportsAdoptedStyleSheets) {
        const t = new Map;
        return e => new Q(e, t)
    }
    return t => new J(t)
})();
let X = (t, e) => {
    t.adoptedStyleSheets = [...t.adoptedStyleSheets, ...e]
}, Y = (t, e) => {
    t.adoptedStyleSheets = t.adoptedStyleSheets.filter(t => -1 === e.indexOf(t))
};
if (d.supportsAdoptedStyleSheets) try {
    document.adoptedStyleSheets.push(), document.adoptedStyleSheets.splice(), X = (t, e) => {
        t.adoptedStyleSheets.push(...e)
    }, Y = (t, e) => {
        for (const i of e) {
            const e = t.adoptedStyleSheets.indexOf(i);
            -1 !== e && t.adoptedStyleSheets.splice(e, 1)
        }
    }
} catch (t) {
}

class Q extends G {
    constructor(t, e) {
        super(), this.styles = t, this.styleSheetCache = e, this._styleSheets = void 0, this.behaviors = K(t)
    }

    get styleSheets() {
        if (void 0 === this._styleSheets) {
            const t = this.styles, e = this.styleSheetCache;
            this._styleSheets = W(t).map(t => {
                if (t instanceof CSSStyleSheet) return t;
                let i = e.get(t);
                return void 0 === i && (i = new CSSStyleSheet, i.replaceSync(t), e.set(t, i)), i
            })
        }
        return this._styleSheets
    }

    addStylesTo(t) {
        X(t, this.styleSheets), super.addStylesTo(t)
    }

    removeStylesFrom(t) {
        Y(t, this.styleSheets), super.removeStylesFrom(t)
    }
}

let Z = 0;

class J extends G {
    constructor(t) {
        super(), this.styles = t, this.behaviors = null, this.behaviors = K(t), this.styleSheets = W(t), this.styleClass = "fast-style-class-" + ++Z
    }

    addStylesTo(t) {
        const e = this.styleSheets, i = this.styleClass;
        t = this.normalizeTarget(t);
        for (let o = 0; o < e.length; o++) {
            const s = document.createElement("style");
            s.innerHTML = e[o], s.className = i, t.append(s)
        }
        super.addStylesTo(t)
    }

    removeStylesFrom(t) {
        const e = (t = this.normalizeTarget(t)).querySelectorAll("." + this.styleClass);
        for (let i = 0, o = e.length; i < o; ++i) t.removeChild(e[i]);
        super.removeStylesFrom(t)
    }

    isAttachedTo(t) {
        return super.isAttachedTo(this.normalizeTarget(t))
    }

    normalizeTarget(t) {
        return t === document ? document.body : t
    }
}

const tt = Object.freeze({locate: s()}),
    et = {toView: t => t ? "true" : "false", fromView: t => null != t && "false" !== t && !1 !== t && 0 !== t}, it = {
        toView(t) {
            if (null == t) return null;
            const e = 1 * t;
            return isNaN(e) ? null : e.toString()
        }, fromView(t) {
            if (null == t) return null;
            const e = 1 * t;
            return isNaN(e) ? null : e
        }
    };

class ot {
    constructor(t, e, i = e.toLowerCase(), o = "reflect", s) {
        this.guards = new Set, this.Owner = t, this.name = e, this.attribute = i, this.mode = o, this.converter = s, this.fieldName = "_" + e, this.callbackName = e + "Changed", this.hasCallback = this.callbackName in t.prototype, "boolean" === o && void 0 === s && (this.converter = et)
    }

    setValue(t, e) {
        const i = t[this.fieldName], o = this.converter;
        void 0 !== o && (e = o.fromView(e)), i !== e && (t[this.fieldName] = e, this.tryReflectToAttribute(t), this.hasCallback && t[this.callbackName](i, e), t.$fastController.notify(this.name))
    }

    getValue(t) {
        return g.track(t, this.name), t[this.fieldName]
    }

    onAttributeChangedCallback(t, e) {
        this.guards.has(t) || (this.guards.add(t), this.setValue(t, e), this.guards.delete(t))
    }

    tryReflectToAttribute(t) {
        const e = this.mode, i = this.guards;
        i.has(t) || "fromView" === e || d.queueUpdate(() => {
            i.add(t);
            const o = t[this.fieldName];
            switch (e) {
                case"reflect":
                    const e = this.converter;
                    d.setAttribute(t, this.attribute, void 0 !== e ? e.toView(o) : o);
                    break;
                case"boolean":
                    d.setBooleanAttribute(t, this.attribute, o)
            }
            i.delete(t)
        })
    }

    static collect(t, ...e) {
        const i = [];
        e.push(tt.locate(t));
        for (let o = 0, s = e.length; o < s; ++o) {
            const s = e[o];
            if (void 0 !== s) for (let e = 0, o = s.length; e < o; ++e) {
                const o = s[e];
                "string" == typeof o ? i.push(new ot(t, o)) : i.push(new ot(t, o.property, o.attribute, o.mode, o.converter))
            }
        }
        return i
    }
}

function st(t, e) {
    let i;

    function o(t, e) {
        arguments.length > 1 && (i.property = e), tt.locate(t.constructor).push(i)
    }

    return arguments.length > 1 ? (i = {}, void o(t, e)) : (i = void 0 === t ? {} : t, o)
}

const nt = {mode: "open"}, rt = {}, at = i.getById(4, () => {
    const t = new Map;
    return Object.freeze({register: e => !t.has(e.type) && (t.set(e.type, e), !0), getByType: e => t.get(e)})
});

class lt {
    constructor(t, e = t.definition) {
        "string" == typeof e && (e = {name: e}), this.type = t, this.name = e.name, this.template = e.template;
        const i = ot.collect(t, e.attributes), o = new Array(i.length), s = {}, n = {};
        for (let t = 0, e = i.length; t < e; ++t) {
            const e = i[t];
            o[t] = e.attribute, s[e.name] = e, n[e.attribute] = e
        }
        this.attributes = i, this.observedAttributes = o, this.propertyLookup = s, this.attributeLookup = n, this.shadowOptions = void 0 === e.shadowOptions ? nt : null === e.shadowOptions ? void 0 : Object.assign(Object.assign({}, nt), e.shadowOptions), this.elementOptions = void 0 === e.elementOptions ? rt : Object.assign(Object.assign({}, rt), e.elementOptions), this.styles = void 0 === e.styles ? void 0 : Array.isArray(e.styles) ? G.create(e.styles) : e.styles instanceof G ? e.styles : G.create([e.styles])
    }

    get isDefined() {
        return !!at.getByType(this.type)
    }

    define(t = customElements) {
        const e = this.type;
        if (at.register(this)) {
            const t = this.attributes, i = e.prototype;
            for (let e = 0, o = t.length; e < o; ++e) g.defineProperty(i, t[e]);
            Reflect.defineProperty(e, "observedAttributes", {value: this.observedAttributes, enumerable: !0})
        }
        return t.get(this.name) || t.define(this.name, e, this.elementOptions), this
    }
}

lt.forType = at.getByType;
const ct = new WeakMap, ht = {bubbles: !0, composed: !0, cancelable: !0};

function dt(t) {
    return t.shadowRoot || ct.get(t) || null
}

class ut extends p {
    constructor(t, e) {
        super(t), this.boundObservables = null, this.behaviors = null, this.needsInitialization = !0, this._template = null, this._styles = null, this._isConnected = !1, this.$fastController = this, this.view = null, this.element = t, this.definition = e;
        const i = e.shadowOptions;
        if (void 0 !== i) {
            const e = t.attachShadow(i);
            "closed" === i.mode && ct.set(t, e)
        }
        const o = g.getAccessors(t);
        if (o.length > 0) {
            const e = this.boundObservables = Object.create(null);
            for (let i = 0, s = o.length; i < s; ++i) {
                const s = o[i].name, n = t[s];
                void 0 !== n && (delete t[s], e[s] = n)
            }
        }
    }

    get isConnected() {
        return g.track(this, "isConnected"), this._isConnected
    }

    setIsConnected(t) {
        this._isConnected = t, g.notify(this, "isConnected")
    }

    get template() {
        return this._template
    }

    set template(t) {
        this._template !== t && (this._template = t, this.needsInitialization || this.renderTemplate(t))
    }

    get styles() {
        return this._styles
    }

    set styles(t) {
        this._styles !== t && (null !== this._styles && this.removeStyles(this._styles), this._styles = t, this.needsInitialization || null === t || this.addStyles(t))
    }

    addStyles(t) {
        const e = dt(this.element) || this.element.getRootNode();
        if (t instanceof HTMLStyleElement) e.append(t); else if (!t.isAttachedTo(e)) {
            const i = t.behaviors;
            t.addStylesTo(e), null !== i && this.addBehaviors(i)
        }
    }

    removeStyles(t) {
        const e = dt(this.element) || this.element.getRootNode();
        if (t instanceof HTMLStyleElement) e.removeChild(t); else if (t.isAttachedTo(e)) {
            const i = t.behaviors;
            t.removeStylesFrom(e), null !== i && this.removeBehaviors(i)
        }
    }

    addBehaviors(t) {
        const e = this.behaviors || (this.behaviors = new Map), i = t.length, o = [];
        for (let s = 0; s < i; ++s) {
            const i = t[s];
            e.has(i) ? e.set(i, e.get(i) + 1) : (e.set(i, 1), o.push(i))
        }
        if (this._isConnected) {
            const t = this.element;
            for (let e = 0; e < o.length; ++e) o[e].bind(t, b)
        }
    }

    removeBehaviors(t, e = !1) {
        const i = this.behaviors;
        if (null === i) return;
        const o = t.length, s = [];
        for (let n = 0; n < o; ++n) {
            const o = t[n];
            if (i.has(o)) {
                const t = i.get(o) - 1;
                0 === t || e ? i.delete(o) && s.push(o) : i.set(o, t)
            }
        }
        if (this._isConnected) {
            const t = this.element;
            for (let e = 0; e < s.length; ++e) s[e].unbind(t)
        }
    }

    onConnectedCallback() {
        if (this._isConnected) return;
        const t = this.element;
        this.needsInitialization ? this.finishInitialization() : null !== this.view && this.view.bind(t, b);
        const e = this.behaviors;
        if (null !== e) for (const [i] of e) i.bind(t, b);
        this.setIsConnected(!0)
    }

    onDisconnectedCallback() {
        if (!this._isConnected) return;
        this.setIsConnected(!1);
        const t = this.view;
        null !== t && t.unbind();
        const e = this.behaviors;
        if (null !== e) {
            const t = this.element;
            for (const [i] of e) i.unbind(t)
        }
    }

    onAttributeChangedCallback(t, e, i) {
        const o = this.definition.attributeLookup[t];
        void 0 !== o && o.onAttributeChangedCallback(this.element, i)
    }

    emit(t, e, i) {
        return !!this._isConnected && this.element.dispatchEvent(new CustomEvent(t, Object.assign(Object.assign({detail: e}, ht), i)))
    }

    finishInitialization() {
        const t = this.element, e = this.boundObservables;
        if (null !== e) {
            const i = Object.keys(e);
            for (let o = 0, s = i.length; o < s; ++o) {
                const s = i[o];
                t[s] = e[s]
            }
            this.boundObservables = null
        }
        const i = this.definition;
        null === this._template && (this.element.resolveTemplate ? this._template = this.element.resolveTemplate() : i.template && (this._template = i.template || null)), null !== this._template && this.renderTemplate(this._template), null === this._styles && (this.element.resolveStyles ? this._styles = this.element.resolveStyles() : i.styles && (this._styles = i.styles || null)), null !== this._styles && this.addStyles(this._styles), this.needsInitialization = !1
    }

    renderTemplate(t) {
        const e = this.element, i = dt(e) || e;
        null !== this.view ? (this.view.dispose(), this.view = null) : this.needsInitialization || d.removeChildNodes(i), t && (this.view = t.render(e, i, e))
    }

    static forCustomElement(t) {
        const e = t.$fastController;
        if (void 0 !== e) return e;
        const i = lt.forType(t.constructor);
        if (void 0 === i) throw new Error("Missing FASTElement definition.");
        return t.$fastController = new ut(t, i)
    }
}

function pt(t) {
    return class extends t {
        constructor() {
            super(), ut.forCustomElement(this)
        }

        $emit(t, e, i) {
            return this.$fastController.emit(t, e, i)
        }

        connectedCallback() {
            this.$fastController.onConnectedCallback()
        }

        disconnectedCallback() {
            this.$fastController.onDisconnectedCallback()
        }

        attributeChangedCallback(t, e, i) {
            this.$fastController.onAttributeChangedCallback(t, e, i)
        }
    }
}

const gt = Object.assign(pt(HTMLElement), {from: t => pt(t), define: (t, e) => new lt(t, e).define().type});

class ft {
    createCSS() {
        return ""
    }

    createBehavior() {
    }
}

function mt(t, e) {
    const i = [];
    let o = "";
    const s = [];
    for (let n = 0, r = t.length - 1; n < r; ++n) {
        o += t[n];
        let r = e[n];
        if (r instanceof ft) {
            const t = r.createBehavior();
            r = r.createCSS(), t && s.push(t)
        }
        r instanceof G || r instanceof CSSStyleSheet ? ("" !== o.trim() && (i.push(o), o = ""), i.push(r)) : o += r
    }
    return o += t[t.length - 1], "" !== o.trim() && i.push(o), {styles: i, behaviors: s}
}

function vt(t, ...e) {
    const {styles: i, behaviors: o} = mt(t, e), s = G.create(i);
    return o.length && s.withBehaviors(...o), s
}

class bt extends ft {
    constructor(t, e) {
        super(), this.behaviors = e, this.css = "";
        const i = t.reduce((t, e) => ("string" == typeof e ? this.css += e : t.push(e), t), []);
        i.length && (this.styles = G.create(i))
    }

    createBehavior() {
        return this
    }

    createCSS() {
        return this.css
    }

    bind(t) {
        this.styles && t.$fastController.addStyles(this.styles), this.behaviors.length && t.$fastController.addBehaviors(this.behaviors)
    }

    unbind(t) {
        this.styles && t.$fastController.removeStyles(this.styles), this.behaviors.length && t.$fastController.removeBehaviors(this.behaviors)
    }
}

function yt(t, ...e) {
    const {styles: i, behaviors: o} = mt(t, e);
    return new bt(i, o)
}

function xt(t, e, i) {
    return {index: t, removed: e, addedCount: i}
}

function $t(t, e, i, s, n, r) {
    let a = 0, l = 0;
    const c = Math.min(i - e, r - n);
    if (0 === e && 0 === n && (a = function (t, e, i) {
        for (let o = 0; o < i; ++o) if (t[o] !== e[o]) return o;
        return i
    }(t, s, c)), i === t.length && r === s.length && (l = function (t, e, i) {
        let o = t.length, s = e.length, n = 0;
        for (; n < i && t[--o] === e[--s];) n++;
        return n
    }(t, s, c - a)), n += a, r -= l, (i -= l) - (e += a) == 0 && r - n == 0) return o;
    if (e === i) {
        const t = xt(e, [], 0);
        for (; n < r;) t.removed.push(s[n++]);
        return [t]
    }
    if (n === r) return [xt(e, [], i - e)];
    const h = function (t) {
        let e = t.length - 1, i = t[0].length - 1, o = t[e][i];
        const s = [];
        for (; e > 0 || i > 0;) {
            if (0 === e) {
                s.push(2), i--;
                continue
            }
            if (0 === i) {
                s.push(3), e--;
                continue
            }
            const n = t[e - 1][i - 1], r = t[e - 1][i], a = t[e][i - 1];
            let l;
            l = r < a ? r < n ? r : n : a < n ? a : n, l === n ? (n === o ? s.push(0) : (s.push(1), o = n), e--, i--) : l === r ? (s.push(3), e--, o = r) : (s.push(2), i--, o = a)
        }
        return s.reverse(), s
    }(function (t, e, i, o, s, n) {
        const r = n - s + 1, a = i - e + 1, l = new Array(r);
        let c, h;
        for (let t = 0; t < r; ++t) l[t] = new Array(a), l[t][0] = t;
        for (let t = 0; t < a; ++t) l[0][t] = t;
        for (let i = 1; i < r; ++i) for (let n = 1; n < a; ++n) t[e + n - 1] === o[s + i - 1] ? l[i][n] = l[i - 1][n - 1] : (c = l[i - 1][n] + 1, h = l[i][n - 1] + 1, l[i][n] = c < h ? c : h);
        return l
    }(t, e, i, s, n, r)), d = [];
    let u = void 0, p = e, g = n;
    for (let t = 0; t < h.length; ++t) switch (h[t]) {
        case 0:
            void 0 !== u && (d.push(u), u = void 0), p++, g++;
            break;
        case 1:
            void 0 === u && (u = xt(p, [], 0)), u.addedCount++, p++, u.removed.push(s[g]), g++;
            break;
        case 2:
            void 0 === u && (u = xt(p, [], 0)), u.addedCount++, p++;
            break;
        case 3:
            void 0 === u && (u = xt(p, [], 0)), u.removed.push(s[g]), g++
    }
    return void 0 !== u && d.push(u), d
}

const wt = Array.prototype.push;

function kt(t, e, i, o) {
    const s = xt(e, i, o);
    let n = !1, r = 0;
    for (let e = 0; e < t.length; e++) {
        const i = t[e];
        if (i.index += r, n) continue;
        const o = (a = s.index, l = s.index + s.removed.length, c = i.index, h = i.index + i.addedCount, l < c || h < a ? -1 : l === c || h === a ? 0 : a < c ? l < h ? l - c : h - c : h < l ? h - a : l - a);
        if (o >= 0) {
            t.splice(e, 1), e--, r -= i.addedCount - i.removed.length, s.addedCount += i.addedCount - o;
            const a = s.removed.length + i.removed.length - o;
            if (s.addedCount || a) {
                let t = i.removed;
                if (s.index < i.index) {
                    const e = s.removed.slice(0, i.index - s.index);
                    wt.apply(e, t), t = e
                }
                if (s.index + s.removed.length > i.index + i.addedCount) {
                    const e = s.removed.slice(i.index + i.addedCount - s.index);
                    wt.apply(t, e)
                }
                s.removed = t, i.index < s.index && (s.index = i.index)
            } else n = !0
        } else if (s.index < i.index) {
            n = !0, t.splice(e, 0, s), e++;
            const o = s.addedCount - s.removed.length;
            i.index += o, r += o
        }
    }
    var a, l, c, h;
    n || t.push(s)
}

function Ct(t, e) {
    let i = [];
    const o = function (t) {
        const e = [];
        for (let i = 0, o = t.length; i < o; i++) {
            const o = t[i];
            kt(e, o.index, o.removed, o.addedCount)
        }
        return e
    }(e);
    for (let e = 0, s = o.length; e < s; ++e) {
        const s = o[e];
        1 !== s.addedCount || 1 !== s.removed.length ? i = i.concat($t(t, s.index, s.index + s.addedCount, s.removed, 0, s.removed.length)) : s.removed[0] !== t[s.index] && i.push(s)
    }
    return i
}

let It = !1;

function Ft(t, e) {
    let i = t.index;
    const o = e.length;
    return i > o ? i = o - t.addedCount : i < 0 && (i = o + t.removed.length + i - t.addedCount), i < 0 && (i = 0), t.index = i, t
}

class Dt extends u {
    constructor(t) {
        super(t), this.oldCollection = void 0, this.splices = void 0, this.needsQueue = !0, this.call = this.flush, Reflect.defineProperty(t, "$fastController", {
            value: this,
            enumerable: !1
        })
    }

    subscribe(t) {
        this.flush(), super.subscribe(t)
    }

    addSplice(t) {
        void 0 === this.splices ? this.splices = [t] : this.splices.push(t), this.needsQueue && (this.needsQueue = !1, d.queueUpdate(this))
    }

    reset(t) {
        this.oldCollection = t, this.needsQueue && (this.needsQueue = !1, d.queueUpdate(this))
    }

    flush() {
        const t = this.splices, e = this.oldCollection;
        if (void 0 === t && void 0 === e) return;
        this.needsQueue = !0, this.splices = void 0, this.oldCollection = void 0;
        const i = void 0 === e ? Ct(this.source, t) : $t(this.source, 0, this.source.length, e, 0, e.length);
        this.notify(i)
    }
}

class Tt {
    constructor(t, e) {
        this.target = t, this.propertyName = e
    }

    bind(t) {
        t[this.propertyName] = this.target
    }

    unbind() {
    }
}

function St(t) {
    return new $("fast-ref", Tt, t)
}

function Ot(t, e) {
    const i = "function" == typeof e ? e : () => e;
    return (e, o) => t(e, o) ? i(e, o) : null
}

const Et = Object.freeze({positioning: !1, recycle: !0});

function Vt(t, e, i, o) {
    t.bind(e[i], o)
}

function Rt(t, e, i, o) {
    const s = Object.create(o);
    s.index = i, s.length = e.length, t.bind(e[i], s)
}

class At {
    constructor(t, e, i, o, s, n) {
        this.location = t, this.itemsBinding = e, this.templateBinding = o, this.options = n, this.source = null, this.views = [], this.items = null, this.itemsObserver = null, this.originalContext = void 0, this.childContext = void 0, this.bindView = Vt, this.itemsBindingObserver = g.binding(e, this, i), this.templateBindingObserver = g.binding(o, this, s), n.positioning && (this.bindView = Rt)
    }

    bind(t, e) {
        this.source = t, this.originalContext = e, this.childContext = Object.create(e), this.childContext.parent = t, this.childContext.parentContext = this.originalContext, this.items = this.itemsBindingObserver.observe(t, this.originalContext), this.template = this.templateBindingObserver.observe(t, this.originalContext), this.observeItems(!0), this.refreshAllViews()
    }

    unbind() {
        this.source = null, this.items = null, null !== this.itemsObserver && this.itemsObserver.unsubscribe(this), this.unbindAllViews(), this.itemsBindingObserver.disconnect(), this.templateBindingObserver.disconnect()
    }

    handleChange(t, e) {
        t === this.itemsBinding ? (this.items = this.itemsBindingObserver.observe(this.source, this.originalContext), this.observeItems(), this.refreshAllViews()) : t === this.templateBinding ? (this.template = this.templateBindingObserver.observe(this.source, this.originalContext), this.refreshAllViews(!0)) : this.updateViews(e)
    }

    observeItems(t = !1) {
        if (!this.items) return void (this.items = o);
        const e = this.itemsObserver, i = this.itemsObserver = g.getNotifier(this.items), s = e !== i;
        s && null !== e && e.unsubscribe(this), (s || t) && i.subscribe(this)
    }

    updateViews(t) {
        const e = this.childContext, i = this.views, o = this.bindView, s = this.items, n = this.template,
            r = this.options.recycle, a = [];
        let l = 0, c = 0;
        for (let h = 0, d = t.length; h < d; ++h) {
            const d = t[h], u = d.removed;
            let p = 0, g = d.index;
            const f = g + d.addedCount, m = i.splice(d.index, u.length), v = c = a.length + m.length;
            for (; g < f; ++g) {
                const t = i[g], h = t ? t.firstChild : this.location;
                let d;
                r && c > 0 ? (p <= v && m.length > 0 ? (d = m[p], p++) : (d = a[l], l++), c--) : d = n.create(), i.splice(g, 0, d), o(d, s, g, e), d.insertBefore(h)
            }
            m[p] && a.push(...m.slice(p))
        }
        for (let t = l, e = a.length; t < e; ++t) a[t].dispose();
        if (this.options.positioning) for (let t = 0, e = i.length; t < e; ++t) {
            const o = i[t].context;
            o.length = e, o.index = t
        }
    }

    refreshAllViews(t = !1) {
        const e = this.items, i = this.childContext, o = this.template, s = this.location, n = this.bindView;
        let r = e.length, a = this.views, l = a.length;
        if (0 !== r && !t && this.options.recycle || (j.disposeContiguousBatch(a), l = 0), 0 === l) {
            this.views = a = new Array(r);
            for (let t = 0; t < r; ++t) {
                const r = o.create();
                n(r, e, t, i), a[t] = r, r.insertBefore(s)
            }
        } else {
            let t = 0;
            for (; t < r; ++t) if (t < l) {
                n(a[t], e, t, i)
            } else {
                const r = o.create();
                n(r, e, t, i), a.push(r), r.insertBefore(s)
            }
            const c = a.splice(t, l - t);
            for (t = 0, r = c.length; t < r; ++t) c[t].dispose()
        }
    }

    unbindAllViews() {
        const t = this.views;
        for (let e = 0, i = t.length; e < i; ++e) t[e].unbind()
    }
}

class Lt extends y {
    constructor(t, e, i) {
        super(), this.itemsBinding = t, this.templateBinding = e, this.options = i, this.createPlaceholder = d.createBlockPlaceholder, function () {
            if (It) return;
            It = !0, g.setArrayObserverFactory(t => new Dt(t));
            const t = Array.prototype;
            if (t.$fastPatch) return;
            Reflect.defineProperty(t, "$fastPatch", {value: 1, enumerable: !1});
            const e = t.pop, i = t.push, o = t.reverse, s = t.shift, n = t.sort, r = t.splice, a = t.unshift;
            t.pop = function () {
                const t = this.length > 0, i = e.apply(this, arguments), o = this.$fastController;
                return void 0 !== o && t && o.addSplice(xt(this.length, [i], 0)), i
            }, t.push = function () {
                const t = i.apply(this, arguments), e = this.$fastController;
                return void 0 !== e && e.addSplice(Ft(xt(this.length - arguments.length, [], arguments.length), this)), t
            }, t.reverse = function () {
                let t;
                const e = this.$fastController;
                void 0 !== e && (e.flush(), t = this.slice());
                const i = o.apply(this, arguments);
                return void 0 !== e && e.reset(t), i
            }, t.shift = function () {
                const t = this.length > 0, e = s.apply(this, arguments), i = this.$fastController;
                return void 0 !== i && t && i.addSplice(xt(0, [e], 0)), e
            }, t.sort = function () {
                let t;
                const e = this.$fastController;
                void 0 !== e && (e.flush(), t = this.slice());
                const i = n.apply(this, arguments);
                return void 0 !== e && e.reset(t), i
            }, t.splice = function () {
                const t = r.apply(this, arguments), e = this.$fastController;
                return void 0 !== e && e.addSplice(Ft(xt(+arguments[0], t, arguments.length > 2 ? arguments.length - 2 : 0), this)), t
            }, t.unshift = function () {
                const t = a.apply(this, arguments), e = this.$fastController;
                return void 0 !== e && e.addSplice(Ft(xt(0, [], arguments.length), this)), t
            }
        }(), this.isItemsBindingVolatile = g.isVolatileBinding(t), this.isTemplateBindingVolatile = g.isVolatileBinding(e)
    }

    createBehavior(t) {
        return new At(t, this.itemsBinding, this.isItemsBindingVolatile, this.templateBinding, this.isTemplateBindingVolatile, this.options)
    }
}

function Pt(t, e, i = Et) {
    return new Lt(t, "function" == typeof e ? e : () => e, Object.assign(Object.assign({}, Et), i))
}

function zt(t) {
    return t ? function (e, i, o) {
        return 1 === e.nodeType && e.matches(t)
    } : function (t, e, i) {
        return 1 === t.nodeType
    }
}

class Ht {
    constructor(t, e) {
        this.target = t, this.options = e, this.source = null
    }

    bind(t) {
        const e = this.options.property;
        this.shouldUpdate = g.getAccessors(t).some(t => t.name === e), this.source = t, this.updateTarget(this.computeNodes()), this.shouldUpdate && this.observe()
    }

    unbind() {
        this.updateTarget(o), this.source = null, this.shouldUpdate && this.disconnect()
    }

    handleEvent() {
        this.updateTarget(this.computeNodes())
    }

    computeNodes() {
        let t = this.getNodes();
        return void 0 !== this.options.filter && (t = t.filter(this.options.filter)), t
    }

    updateTarget(t) {
        this.source[this.options.property] = t
    }
}

class Mt extends Ht {
    constructor(t, e) {
        super(t, e)
    }

    observe() {
        this.target.addEventListener("slotchange", this)
    }

    disconnect() {
        this.target.removeEventListener("slotchange", this)
    }

    getNodes() {
        return this.target.assignedNodes(this.options)
    }
}

function Bt(t) {
    return "string" == typeof t && (t = {property: t}), new $("fast-slotted", Mt, t)
}

class Nt extends Ht {
    constructor(t, e) {
        super(t, e), this.observer = null, e.childList = !0
    }

    observe() {
        null === this.observer && (this.observer = new MutationObserver(this.handleEvent.bind(this))), this.observer.observe(this.target, this.options)
    }

    disconnect() {
        this.observer.disconnect()
    }

    getNodes() {
        return "subtree" in this.options ? Array.from(this.target.querySelectorAll(this.options.selector)) : Array.from(this.target.childNodes)
    }
}

function jt(t) {
    return "string" == typeof t && (t = {property: t}), new $("fast-children", Nt, t)
}

class Ut {
    handleStartContentChange() {
        this.startContainer.classList.toggle("start", this.start.assignedNodes().length > 0)
    }

    handleEndContentChange() {
        this.endContainer.classList.toggle("end", this.end.assignedNodes().length > 0)
    }
}

const qt = (t, e) => _`<span part="end" ${St("endContainer")} class=${t => e.end ? "end" : void 0}><slot name="end" ${St("end")} @slotchange="${t => t.handleEndContentChange()}">${e.end || ""}</slot></span>`,
    _t = (t, e) => _`<span part="start" ${St("startContainer")} class="${t => e.start ? "start" : void 0}"><slot name="start" ${St("start")} @slotchange="${t => t.handleStartContentChange()}">${e.start || ""}</slot></span>`,
    Gt = _`<span part="end" ${St("endContainer")}><slot name="end" ${St("end")} @slotchange="${t => t.handleEndContentChange()}"></slot></span>`,
    Wt = _`<span part="start" ${St("startContainer")}><slot name="start" ${St("start")} @slotchange="${t => t.handleStartContentChange()}"></slot></span>`;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function Kt(t, e, i, o) {
    var s, n = arguments.length, r = n < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, i) : o;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(t, e, i, o); else for (var a = t.length - 1; a >= 0; a--) (s = t[a]) && (r = (n < 3 ? s(r) : n > 3 ? s(e, i, r) : s(e, i)) || r);
    return n > 3 && r && Object.defineProperty(e, i, r), r
}

const Xt = new Map;
"metadata" in Reflect || (Reflect.metadata = function (t, e) {
    return function (i) {
        Reflect.defineMetadata(t, e, i)
    }
}, Reflect.defineMetadata = function (t, e, i) {
    let o = Xt.get(i);
    void 0 === o && Xt.set(i, o = new Map), o.set(t, e)
}, Reflect.getOwnMetadata = function (t, e) {
    const i = Xt.get(e);
    if (void 0 !== i) return i.get(t)
});

class Yt {
    constructor(t, e) {
        this.container = t, this.key = e
    }

    instance(t) {
        return this.registerResolver(0, t)
    }

    singleton(t) {
        return this.registerResolver(1, t)
    }

    transient(t) {
        return this.registerResolver(2, t)
    }

    callback(t) {
        return this.registerResolver(3, t)
    }

    cachedCallback(t) {
        return this.registerResolver(3, be(t))
    }

    aliasTo(t) {
        return this.registerResolver(5, t)
    }

    registerResolver(t, e) {
        const {container: i, key: o} = this;
        return this.container = this.key = void 0, i.registerResolver(o, new re(o, t, e))
    }
}

function Qt(t) {
    const e = t.slice(), i = Object.keys(t), o = i.length;
    let s;
    for (let n = 0; n < o; ++n) s = i[n], Fe(s) || (e[s] = t[s]);
    return e
}

const Zt = Object.freeze({
    none(t) {
        throw Error(t.toString() + " not registered, did you forget to add @singleton()?")
    }, singleton: t => new re(t, 1, t), transient: t => new re(t, 2, t)
}), Jt = Object.freeze({
    default: Object.freeze({
        parentLocator: () => null,
        responsibleForOwnerRequests: !1,
        defaultResolver: Zt.singleton
    })
}), te = new Map;

function ee(t) {
    return e => Reflect.getOwnMetadata(t, e)
}

let ie = null;
const oe = Object.freeze({
    createContainer: t => new me(null, Object.assign({}, Jt.default, t)),
    findResponsibleContainer(t) {
        const e = t.$$container$$;
        return e && e.responsibleForOwnerRequests ? e : oe.findParentContainer(t)
    },
    findParentContainer(t) {
        const e = new CustomEvent(ge, {bubbles: !0, composed: !0, cancelable: !0, detail: {container: void 0}});
        return t.dispatchEvent(e), e.detail.container || oe.getOrCreateDOMContainer()
    },
    getOrCreateDOMContainer: (t, e) => t ? t.$$container$$ || new me(t, Object.assign({}, Jt.default, e, {parentLocator: oe.findParentContainer})) : ie || (ie = new me(null, Object.assign({}, Jt.default, e, {parentLocator: () => null}))),
    getDesignParamtypes: ee("design:paramtypes"),
    getAnnotationParamtypes: ee("di:paramtypes"),
    getOrCreateAnnotationParamTypes(t) {
        let e = this.getAnnotationParamtypes(t);
        return void 0 === e && Reflect.defineMetadata("di:paramtypes", e = [], t), e
    },
    getDependencies(t) {
        let e = te.get(t);
        if (void 0 === e) {
            const i = t.inject;
            if (void 0 === i) {
                const i = oe.getDesignParamtypes(t), o = oe.getAnnotationParamtypes(t);
                if (void 0 === i) if (void 0 === o) {
                    const i = Object.getPrototypeOf(t);
                    e = "function" == typeof i && i !== Function.prototype ? Qt(oe.getDependencies(i)) : []
                } else e = Qt(o); else if (void 0 === o) e = Qt(i); else {
                    e = Qt(i);
                    let t, s = o.length;
                    for (let i = 0; i < s; ++i) t = o[i], void 0 !== t && (e[i] = t);
                    const n = Object.keys(o);
                    let r;
                    s = n.length;
                    for (let t = 0; t < s; ++t) r = n[t], Fe(r) || (e[r] = o[r])
                }
            } else e = Qt(i);
            te.set(t, e)
        }
        return e
    },
    defineProperty(t, e, i, o = !1) {
        const s = "$di_" + e;
        Reflect.defineProperty(t, e, {
            get: function () {
                let t = this[s];
                if (void 0 === t) {
                    const n = this instanceof HTMLElement ? oe.findResponsibleContainer(this) : oe.getOrCreateDOMContainer();
                    if (t = n.get(i), this[s] = t, o && this instanceof gt) {
                        const o = this.$fastController, n = () => {
                            oe.findResponsibleContainer(this).get(i) !== this[s] && (this[s] = t, o.notify(e))
                        };
                        o.subscribe({handleChange: n}, "isConnected")
                    }
                }
                return t
            }
        })
    },
    createInterface(t, e) {
        const i = "function" == typeof t ? t : e,
            o = "string" == typeof t ? t : t && "friendlyName" in t && t.friendlyName || we,
            s = "string" != typeof t && (t && "respectConnection" in t && t.respectConnection || !1),
            n = function (t, e, i) {
                if (null == t || void 0 !== new.target) throw new Error(`No registration for interface: '${n.friendlyName}'`);
                if (e) oe.defineProperty(t, e, n, s); else {
                    oe.getOrCreateAnnotationParamTypes(t)[i] = n
                }
            };
        return n.$isInterface = !0, n.friendlyName = null == o ? "(anonymous)" : o, null != i && (n.register = function (t, e) {
            return i(new Yt(t, null != e ? e : n))
        }), n.toString = function () {
            return `InterfaceSymbol<${n.friendlyName}>`
        }, n
    },
    inject: (...t) => function (e, i, o) {
        if ("number" == typeof o) {
            const i = oe.getOrCreateAnnotationParamTypes(e), s = t[0];
            void 0 !== s && (i[o] = s)
        } else if (i) oe.defineProperty(e, i, t[0]); else {
            const i = o ? oe.getOrCreateAnnotationParamTypes(o.value) : oe.getOrCreateAnnotationParamTypes(e);
            let s;
            for (let e = 0; e < t.length; ++e) s = t[e], void 0 !== s && (i[e] = s)
        }
    },
    transient: t => (t.register = function (e) {
        return ye.transient(t, t).register(e)
    }, t.registerInRequestor = !1, t),
    singleton: (t, e = ne) => (t.register = function (e) {
        return ye.singleton(t, t).register(e)
    }, t.registerInRequestor = e.scoped, t)
}), se = oe.createInterface("Container");
oe.inject;
const ne = {scoped: !1};

class re {
    constructor(t, e, i) {
        this.key = t, this.strategy = e, this.state = i, this.resolving = !1
    }

    get $isResolver() {
        return !0
    }

    register(t) {
        return t.registerResolver(this.key, this)
    }

    resolve(t, e) {
        switch (this.strategy) {
            case 0:
                return this.state;
            case 1:
                if (this.resolving) throw new Error("Cyclic dependency found: " + this.state.name);
                return this.resolving = !0, this.state = t.getFactory(this.state).construct(e), this.strategy = 0, this.resolving = !1, this.state;
            case 2: {
                const i = t.getFactory(this.state);
                if (null === i) throw new Error(`Resolver for ${String(this.key)} returned a null factory`);
                return i.construct(e)
            }
            case 3:
                return this.state(t, e, this);
            case 4:
                return this.state[0].resolve(t, e);
            case 5:
                return e.get(this.state);
            default:
                throw new Error(`Invalid resolver strategy specified: ${this.strategy}.`)
        }
    }

    getFactory(t) {
        var e, i, o;
        switch (this.strategy) {
            case 1:
            case 2:
                return t.getFactory(this.state);
            case 5:
                return null !== (o = null === (i = null === (e = t.getResolver(this.state)) || void 0 === e ? void 0 : e.getFactory) || void 0 === i ? void 0 : i.call(e, t)) && void 0 !== o ? o : null;
            default:
                return null
        }
    }
}

function ae(t) {
    return this.get(t)
}

function le(t, e) {
    return e(t)
}

class ce {
    constructor(t, e) {
        this.Type = t, this.dependencies = e, this.transformers = null
    }

    construct(t, e) {
        let i;
        return i = void 0 === e ? new this.Type(...this.dependencies.map(ae, t)) : new this.Type(...this.dependencies.map(ae, t), ...e), null == this.transformers ? i : this.transformers.reduce(le, i)
    }

    registerTransformer(t) {
        (this.transformers || (this.transformers = [])).push(t)
    }
}

const he = {$isResolver: !0, resolve: (t, e) => e};

function de(t) {
    return "function" == typeof t.register
}

function ue(t) {
    return function (t) {
        return de(t) && "boolean" == typeof t.registerInRequestor
    }(t) && t.registerInRequestor
}

const pe = new Set(["Array", "ArrayBuffer", "Boolean", "DataView", "Date", "Error", "EvalError", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Number", "Object", "Promise", "RangeError", "ReferenceError", "RegExp", "Set", "SharedArrayBuffer", "String", "SyntaxError", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "URIError", "WeakMap", "WeakSet"]),
    ge = "__DI_LOCATE_PARENT__", fe = new Map;

class me {
    constructor(t, e) {
        this.owner = t, this.config = e, this._parent = void 0, this.registerDepth = 0, this.context = null, null !== t && (t.$$container$$ = this), this.resolvers = new Map, this.resolvers.set(se, he), t instanceof Node && t.addEventListener(ge, t => {
            t.composedPath()[0] !== this.owner && (t.detail.container = this, t.stopImmediatePropagation())
        })
    }

    get parent() {
        return void 0 === this._parent && (this._parent = this.config.parentLocator(this.owner)), this._parent
    }

    get depth() {
        return null === this.parent ? 0 : this.parent.depth + 1
    }

    get responsibleForOwnerRequests() {
        return this.config.responsibleForOwnerRequests
    }

    registerWithContext(t, ...e) {
        return this.context = t, this.register(...e), this.context = null, this
    }

    register(...t) {
        if (100 == ++this.registerDepth) throw new Error("Unable to autoregister dependency");
        let e, i, o, s, n;
        const r = this.context;
        for (let a = 0, l = t.length; a < l; ++a) if (e = t[a], ke(e)) if (de(e)) e.register(this, r); else if (void 0 !== e.prototype) ye.singleton(e, e).register(this); else for (i = Object.keys(e), s = 0, n = i.length; s < n; ++s) o = e[i[s]], ke(o) && (de(o) ? o.register(this, r) : this.register(o));
        return --this.registerDepth, this
    }

    registerResolver(t, e) {
        xe(t);
        const i = this.resolvers, o = i.get(t);
        return null == o ? i.set(t, e) : o instanceof re && 4 === o.strategy ? o.state.push(e) : i.set(t, new re(t, 4, [o, e])), e
    }

    registerTransformer(t, e) {
        const i = this.getResolver(t);
        if (null == i) return !1;
        if (i.getFactory) {
            const t = i.getFactory(this);
            return null != t && (t.registerTransformer(e), !0)
        }
        return !1
    }

    getResolver(t, e = !0) {
        if (xe(t), void 0 !== t.resolve) return t;
        let i, o = this;
        for (; null != o;) {
            if (i = o.resolvers.get(t), null != i) return i;
            if (null == o.parent) {
                const i = ue(t) ? this : o;
                return e ? this.jitRegister(t, i) : null
            }
            o = o.parent
        }
        return null
    }

    has(t, e = !1) {
        return !!this.resolvers.has(t) || !(!e || null == this.parent) && this.parent.has(t, !0)
    }

    get(t) {
        if (xe(t), t.$isResolver) return t.resolve(this, this);
        let e, i = this;
        for (; null != i;) {
            if (e = i.resolvers.get(t), null != e) return e.resolve(i, this);
            if (null == i.parent) {
                const o = ue(t) ? this : i;
                return e = this.jitRegister(t, o), e.resolve(i, this)
            }
            i = i.parent
        }
        throw new Error("Unable to resolve key: " + t)
    }

    getAll(t, e = !1) {
        xe(t);
        const i = this;
        let s, n = i;
        if (e) {
            let e = o;
            for (; null != n;) s = n.resolvers.get(t), null != s && (e = e.concat($e(s, n, i))), n = n.parent;
            return e
        }
        for (; null != n;) {
            if (s = n.resolvers.get(t), null != s) return $e(s, n, i);
            if (n = n.parent, null == n) return o
        }
        return o
    }

    getFactory(t) {
        let e = fe.get(t);
        if (void 0 === e) {
            if (Ce(t)) throw new Error(t.name + " is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.");
            fe.set(t, e = new ce(t, oe.getDependencies(t)))
        }
        return e
    }

    registerFactory(t, e) {
        fe.set(t, e)
    }

    createChild(t) {
        return new me(null, Object.assign({}, this.config, t, {parentLocator: () => this}))
    }

    jitRegister(t, e) {
        if ("function" != typeof t) throw new Error(`Attempted to jitRegister something that is not a constructor: '${t}'. Did you forget to register this dependency?`);
        if (pe.has(t.name)) throw new Error(`Attempted to jitRegister an intrinsic type: ${t.name}. Did you forget to add @inject(Key)`);
        if (de(t)) {
            const i = t.register(e);
            if (!(i instanceof Object) || null == i.resolve) {
                const i = e.resolvers.get(t);
                if (null != i) return i;
                throw new Error("A valid resolver was not returned from the static register method")
            }
            return i
        }
        if (t.$isInterface) throw new Error("Attempted to jitRegister an interface: " + t.friendlyName);
        {
            const i = this.config.defaultResolver(t, e);
            return e.resolvers.set(t, i), i
        }
    }
}

const ve = new WeakMap;

function be(t) {
    return function (e, i, o) {
        if (ve.has(o)) return ve.get(o);
        const s = t(e, i, o);
        return ve.set(o, s), s
    }
}

const ye = Object.freeze({
    instance: (t, e) => new re(t, 0, e),
    singleton: (t, e) => new re(t, 1, e),
    transient: (t, e) => new re(t, 2, e),
    callback: (t, e) => new re(t, 3, e),
    cachedCallback: (t, e) => new re(t, 3, be(e)),
    aliasTo: (t, e) => new re(e, 5, t)
});

function xe(t) {
    if (null == t) throw new Error("key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?")
}

function $e(t, e, i) {
    if (t instanceof re && 4 === t.strategy) {
        const o = t.state;
        let s = o.length;
        const n = new Array(s);
        for (; s--;) n[s] = o[s].resolve(e, i);
        return n
    }
    return [t.resolve(e, i)]
}

const we = "(anonymous)";

function ke(t) {
    return "object" == typeof t && null !== t || "function" == typeof t
}

const Ce = function () {
    const t = new WeakMap;
    let e = !1, i = "", o = 0;
    return function (s) {
        return e = t.get(s), void 0 === e && (i = s.toString(), o = i.length, e = o >= 29 && o <= 100 && 125 === i.charCodeAt(o - 1) && i.charCodeAt(o - 2) <= 32 && 93 === i.charCodeAt(o - 3) && 101 === i.charCodeAt(o - 4) && 100 === i.charCodeAt(o - 5) && 111 === i.charCodeAt(o - 6) && 99 === i.charCodeAt(o - 7) && 32 === i.charCodeAt(o - 8) && 101 === i.charCodeAt(o - 9) && 118 === i.charCodeAt(o - 10) && 105 === i.charCodeAt(o - 11) && 116 === i.charCodeAt(o - 12) && 97 === i.charCodeAt(o - 13) && 110 === i.charCodeAt(o - 14) && 88 === i.charCodeAt(o - 15), t.set(s, e)), e
    }
}(), Ie = {};

function Fe(t) {
    switch (typeof t) {
        case"number":
            return t >= 0 && (0 | t) === t;
        case"string": {
            const e = Ie[t];
            if (void 0 !== e) return e;
            const i = t.length;
            if (0 === i) return Ie[t] = !1;
            let o = 0;
            for (let e = 0; e < i; ++e) if (o = t.charCodeAt(e), 0 === e && 48 === o && i > 1 || o < 48 || o > 57) return Ie[t] = !1;
            return Ie[t] = !0
        }
        default:
            return !1
    }
}

function De(t) {
    return t.toLowerCase() + ":presentation"
}

const Te = new Map, Se = Object.freeze({
    define(t, e, i) {
        const o = De(t);
        void 0 === Te.get(o) ? Te.set(o, e) : Te.set(o, !1), i.register(ye.instance(o, e))
    }, forTag(t, e) {
        const i = De(t), o = Te.get(i);
        if (!1 === o) {
            return oe.findResponsibleContainer(e).get(i)
        }
        return o || null
    }
});

class Oe {
    constructor(t, e) {
        this.template = t || null, this.styles = void 0 === e ? null : Array.isArray(e) ? G.create(e) : e instanceof G ? e : G.create([e])
    }

    applyTo(t) {
        const e = t.$fastController;
        null === e.template && (e.template = this.template), null === e.styles && (e.styles = this.styles)
    }
}

class Ee extends gt {
    constructor() {
        super(...arguments), this._presentation = void 0
    }

    get $presentation() {
        return void 0 === this._presentation && (this._presentation = Se.forTag(this.tagName, this)), this._presentation
    }

    templateChanged() {
        void 0 !== this.template && (this.$fastController.template = this.template)
    }

    stylesChanged() {
        void 0 !== this.styles && (this.$fastController.styles = this.styles)
    }

    connectedCallback() {
        null !== this.$presentation && this.$presentation.applyTo(this), super.connectedCallback()
    }

    static compose(t) {
        return (e = {}) => new Re(this === Ee ? class extends Ee {
        } : this, t, e)
    }
}

function Ve(t, e, i) {
    return "function" == typeof t ? t(e, i) : t
}

Kt([f], Ee.prototype, "template", void 0), Kt([f], Ee.prototype, "styles", void 0);

class Re {
    constructor(t, e, i) {
        this.type = t, this.elementDefinition = e, this.overrideDefinition = i, this.definition = Object.assign(Object.assign({}, this.elementDefinition), this.overrideDefinition)
    }

    register(t, e) {
        const i = this.definition, o = this.overrideDefinition, s = `${i.prefix || e.elementPrefix}-${i.baseName}`;
        e.tryDefineElement({
            name: s, type: this.type, baseClass: this.elementDefinition.baseClass, callback: t => {
                const e = new Oe(Ve(i.template, t, i), Ve(i.styles, t, i));
                t.definePresentation(e);
                let s = Ve(i.shadowOptions, t, i);
                t.shadowRootMode && (s ? o.shadowOptions || (s.mode = t.shadowRootMode) : null !== s && (s = {mode: t.shadowRootMode})), t.defineElement({
                    elementOptions: Ve(i.elementOptions, t, i),
                    shadowOptions: s,
                    attributes: Ve(i.attributes, t, i)
                })
            }
        })
    }
}

function Ae(t, ...e) {
    const i = tt.locate(t);
    e.forEach(e => {
        Object.getOwnPropertyNames(e.prototype).forEach(i => {
            "constructor" !== i && Object.defineProperty(t.prototype, i, Object.getOwnPropertyDescriptor(e.prototype, i))
        });
        tt.locate(e).forEach(t => i.push(t))
    })
}

class Le extends Ee {
    constructor() {
        super(...arguments), this.headinglevel = 2, this.expanded = !1, this.clickHandler = t => {
            this.expanded = !this.expanded, this.change()
        }, this.change = () => {
            this.$emit("change")
        }
    }
}

Kt([st({
    attribute: "heading-level",
    mode: "fromView",
    converter: it
})], Le.prototype, "headinglevel", void 0), Kt([st({mode: "boolean"})], Le.prototype, "expanded", void 0), Kt([st], Le.prototype, "id", void 0), Ae(Le, Ut);
const Pe = "horizontal", ze = "vertical";

function He(...t) {
    return t.every(t => t instanceof HTMLElement)
}

let Me;
var Be;
!function (t) {
    t[t.alt = 18] = "alt", t[t.arrowDown = 40] = "arrowDown", t[t.arrowLeft = 37] = "arrowLeft", t[t.arrowRight = 39] = "arrowRight", t[t.arrowUp = 38] = "arrowUp", t[t.back = 8] = "back", t[t.backSlash = 220] = "backSlash", t[t.break = 19] = "break", t[t.capsLock = 20] = "capsLock", t[t.closeBracket = 221] = "closeBracket", t[t.colon = 186] = "colon", t[t.colon2 = 59] = "colon2", t[t.comma = 188] = "comma", t[t.ctrl = 17] = "ctrl", t[t.delete = 46] = "delete", t[t.end = 35] = "end", t[t.enter = 13] = "enter", t[t.equals = 187] = "equals", t[t.equals2 = 61] = "equals2", t[t.equals3 = 107] = "equals3", t[t.escape = 27] = "escape", t[t.forwardSlash = 191] = "forwardSlash", t[t.function1 = 112] = "function1", t[t.function10 = 121] = "function10", t[t.function11 = 122] = "function11", t[t.function12 = 123] = "function12", t[t.function2 = 113] = "function2", t[t.function3 = 114] = "function3", t[t.function4 = 115] = "function4", t[t.function5 = 116] = "function5", t[t.function6 = 117] = "function6", t[t.function7 = 118] = "function7", t[t.function8 = 119] = "function8", t[t.function9 = 120] = "function9", t[t.home = 36] = "home", t[t.insert = 45] = "insert", t[t.menu = 93] = "menu", t[t.minus = 189] = "minus", t[t.minus2 = 109] = "minus2", t[t.numLock = 144] = "numLock", t[t.numPad0 = 96] = "numPad0", t[t.numPad1 = 97] = "numPad1", t[t.numPad2 = 98] = "numPad2", t[t.numPad3 = 99] = "numPad3", t[t.numPad4 = 100] = "numPad4", t[t.numPad5 = 101] = "numPad5", t[t.numPad6 = 102] = "numPad6", t[t.numPad7 = 103] = "numPad7", t[t.numPad8 = 104] = "numPad8", t[t.numPad9 = 105] = "numPad9", t[t.numPadDivide = 111] = "numPadDivide", t[t.numPadDot = 110] = "numPadDot", t[t.numPadMinus = 109] = "numPadMinus", t[t.numPadMultiply = 106] = "numPadMultiply", t[t.numPadPlus = 107] = "numPadPlus", t[t.openBracket = 219] = "openBracket", t[t.pageDown = 34] = "pageDown", t[t.pageUp = 33] = "pageUp", t[t.period = 190] = "period", t[t.print = 44] = "print", t[t.quote = 222] = "quote", t[t.scrollLock = 145] = "scrollLock", t[t.shift = 16] = "shift", t[t.space = 32] = "space", t[t.tab = 9] = "tab", t[t.tilde = 192] = "tilde", t[t.windowsLeft = 91] = "windowsLeft", t[t.windowsOpera = 219] = "windowsOpera", t[t.windowsRight = 92] = "windowsRight"
}(Be || (Be = {}));
const Ne = {ArrowDown: "ArrowDown", ArrowLeft: "ArrowLeft", ArrowRight: "ArrowRight", ArrowUp: "ArrowUp"};
var je;

function Ue(t, e, i) {
    return i < t ? e : i > e ? t : i
}

function qe(t, e, i) {
    return Math.min(Math.max(i, t), e)
}

function _e(t, e, i = 0) {
    return [e, i] = [e, i].sort((t, e) => t - e), e <= t && t < i
}

!function (t) {
    t.ltr = "ltr", t.rtl = "rtl"
}(je || (je = {}));
let Ge = 0;

function We(t = "") {
    return `${t}${Ge++}`
}

var Ke;
!function (t) {
    t.Canvas = "Canvas", t.CanvasText = "CanvasText", t.LinkText = "LinkText", t.VisitedText = "VisitedText", t.ActiveText = "ActiveText", t.ButtonFace = "ButtonFace", t.ButtonText = "ButtonText", t.Field = "Field", t.FieldText = "FieldText", t.Highlight = "Highlight", t.HighlightText = "HighlightText", t.GrayText = "GrayText"
}(Ke || (Ke = {}));
const Xe = "single", Ye = "multi";

class Qe extends Ee {
    constructor() {
        super(...arguments), this.expandmode = Ye, this.activeItemIndex = 0, this.change = () => {
            this.$emit("change", this.activeid)
        }, this.setItems = () => {
            var t;
            if (0 !== this.accordionItems.length && (this.accordionIds = this.getItemIds(), this.accordionItems.forEach((t, e) => {
                t instanceof Le && (t.addEventListener("change", this.activeItemChange), this.isSingleExpandMode() && (this.activeItemIndex !== e ? t.expanded = !1 : t.expanded = !0));
                const i = this.accordionIds[e];
                t.setAttribute("id", "string" != typeof i ? "accordion-" + (e + 1) : i), this.activeid = this.accordionIds[this.activeItemIndex], t.addEventListener("keydown", this.handleItemKeyDown), t.addEventListener("focus", this.handleItemFocus)
            }), this.isSingleExpandMode())) {
                (null !== (t = this.findExpandedItem()) && void 0 !== t ? t : this.accordionItems[0]).setAttribute("aria-disabled", "true")
            }
        }, this.removeItemListeners = t => {
            t.forEach((t, e) => {
                t.removeEventListener("change", this.activeItemChange), t.removeEventListener("keydown", this.handleItemKeyDown), t.removeEventListener("focus", this.handleItemFocus)
            })
        }, this.activeItemChange = t => {
            if (t.defaultPrevented || t.target !== t.currentTarget) return;
            t.preventDefault();
            const e = t.target;
            this.activeid = e.getAttribute("id"), this.isSingleExpandMode() && (this.resetItems(), e.expanded = !0, e.setAttribute("aria-disabled", "true"), this.accordionItems.forEach(t => {
                t.hasAttribute("disabled") || t.id === this.activeid || t.removeAttribute("aria-disabled")
            })), this.activeItemIndex = Array.from(this.accordionItems).indexOf(e), this.change()
        }, this.handleItemKeyDown = t => {
            if (t.target === t.currentTarget) switch (this.accordionIds = this.getItemIds(), t.key) {
                case"ArrowUp":
                    t.preventDefault(), this.adjust(-1);
                    break;
                case"ArrowDown":
                    t.preventDefault(), this.adjust(1);
                    break;
                case"Home":
                    this.activeItemIndex = 0, this.focusItem();
                    break;
                case"End":
                    this.activeItemIndex = this.accordionItems.length - 1, this.focusItem()
            }
        }, this.handleItemFocus = t => {
            if (t.target === t.currentTarget) {
                const e = t.target, i = this.activeItemIndex = Array.from(this.accordionItems).indexOf(e);
                this.activeItemIndex !== i && -1 !== i && (this.activeItemIndex = i, this.activeid = this.accordionIds[this.activeItemIndex])
            }
        }
    }

    accordionItemsChanged(t, e) {
        this.$fastController.isConnected && (this.removeItemListeners(t), this.setItems())
    }

    findExpandedItem() {
        for (let t = 0; t < this.accordionItems.length; t++) if ("true" === this.accordionItems[t].getAttribute("expanded")) return this.accordionItems[t];
        return null
    }

    resetItems() {
        this.accordionItems.forEach((t, e) => {
            t.expanded = !1
        })
    }

    getItemIds() {
        return this.accordionItems.map(t => t.getAttribute("id"))
    }

    isSingleExpandMode() {
        return this.expandmode === Xe
    }

    adjust(t) {
        this.activeItemIndex = Ue(0, this.accordionItems.length - 1, this.activeItemIndex + t), this.focusItem()
    }

    focusItem() {
        const t = this.accordionItems[this.activeItemIndex];
        t instanceof Le && t.expandbutton.focus()
    }
}

Kt([st({attribute: "expand-mode"})], Qe.prototype, "expandmode", void 0), Kt([f], Qe.prototype, "accordionItems", void 0);
const Ze = (t, e) => _`<a class="control" part="control" download="${t => t.download}" href="${t => t.href}" hreflang="${t => t.hreflang}" ping="${t => t.ping}" referrerpolicy="${t => t.referrerpolicy}" rel="${t => t.rel}" target="${t => t.target}" type="${t => t.type}" aria-atomic="${t => t.ariaAtomic}" aria-busy="${t => t.ariaBusy}" aria-controls="${t => t.ariaControls}" aria-current="${t => t.ariaCurrent}" aria-describedby="${t => t.ariaDescribedby}" aria-details="${t => t.ariaDetails}" aria-disabled="${t => t.ariaDisabled}" aria-errormessage="${t => t.ariaErrormessage}" aria-expanded="${t => t.ariaExpanded}" aria-flowto="${t => t.ariaFlowto}" aria-haspopup="${t => t.ariaHaspopup}" aria-hidden="${t => t.ariaHidden}" aria-invalid="${t => t.ariaInvalid}" aria-keyshortcuts="${t => t.ariaKeyshortcuts}" aria-label="${t => t.ariaLabel}" aria-labelledby="${t => t.ariaLabelledby}" aria-live="${t => t.ariaLive}" aria-owns="${t => t.ariaOwns}" aria-relevant="${t => t.ariaRelevant}" aria-roledescription="${t => t.ariaRoledescription}" ${St("control")}>${_t(0, e)}<span class="content" part="content"><slot ${Bt("defaultSlottedContent")}></slot></span>${qt(0, e)}</a>`;

class Je {
}

Kt([st({attribute: "aria-atomic"})], Je.prototype, "ariaAtomic", void 0), Kt([st({attribute: "aria-busy"})], Je.prototype, "ariaBusy", void 0), Kt([st({attribute: "aria-controls"})], Je.prototype, "ariaControls", void 0), Kt([st({attribute: "aria-current"})], Je.prototype, "ariaCurrent", void 0), Kt([st({attribute: "aria-describedby"})], Je.prototype, "ariaDescribedby", void 0), Kt([st({attribute: "aria-details"})], Je.prototype, "ariaDetails", void 0), Kt([st({attribute: "aria-disabled"})], Je.prototype, "ariaDisabled", void 0), Kt([st({attribute: "aria-errormessage"})], Je.prototype, "ariaErrormessage", void 0), Kt([st({attribute: "aria-flowto"})], Je.prototype, "ariaFlowto", void 0), Kt([st({attribute: "aria-haspopup"})], Je.prototype, "ariaHaspopup", void 0), Kt([st({attribute: "aria-hidden"})], Je.prototype, "ariaHidden", void 0), Kt([st({attribute: "aria-invalid"})], Je.prototype, "ariaInvalid", void 0), Kt([st({attribute: "aria-keyshortcuts"})], Je.prototype, "ariaKeyshortcuts", void 0), Kt([st({attribute: "aria-label"})], Je.prototype, "ariaLabel", void 0), Kt([st({attribute: "aria-labelledby"})], Je.prototype, "ariaLabelledby", void 0), Kt([st({attribute: "aria-live"})], Je.prototype, "ariaLive", void 0), Kt([st({attribute: "aria-owns"})], Je.prototype, "ariaOwns", void 0), Kt([st({attribute: "aria-relevant"})], Je.prototype, "ariaRelevant", void 0), Kt([st({attribute: "aria-roledescription"})], Je.prototype, "ariaRoledescription", void 0);

class ti extends Ee {
    constructor() {
        super(...arguments), this.handleUnsupportedDelegatesFocus = () => {
            var t;
            window.ShadowRoot && !window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus") && (null === (t = this.$fastController.definition.shadowOptions) || void 0 === t ? void 0 : t.delegatesFocus) && (this.focus = () => {
                var t;
                null === (t = this.control) || void 0 === t || t.focus()
            })
        }
    }

    connectedCallback() {
        super.connectedCallback(), this.handleUnsupportedDelegatesFocus()
    }
}

Kt([st], ti.prototype, "download", void 0), Kt([st], ti.prototype, "href", void 0), Kt([st], ti.prototype, "hreflang", void 0), Kt([st], ti.prototype, "ping", void 0), Kt([st], ti.prototype, "referrerpolicy", void 0), Kt([st], ti.prototype, "rel", void 0), Kt([st], ti.prototype, "target", void 0), Kt([st], ti.prototype, "type", void 0), Kt([f], ti.prototype, "defaultSlottedContent", void 0);

class ei {
}

Kt([st({attribute: "aria-expanded"})], ei.prototype, "ariaExpanded", void 0), Ae(ei, Je), Ae(ti, Ut, ei);
const ii = t => {
    const e = t.closest("[dir]");
    return null !== e && "rtl" === e.dir ? je.rtl : je.ltr
};

class oi extends Ee {
    constructor() {
        super(...arguments), this.anchor = "", this.viewport = "", this.horizontalPositioningMode = "uncontrolled", this.horizontalDefaultPosition = "unset", this.horizontalViewportLock = !1, this.horizontalInset = !1, this.horizontalScaling = "content", this.verticalPositioningMode = "uncontrolled", this.verticalDefaultPosition = "unset", this.verticalViewportLock = !1, this.verticalInset = !1, this.verticalScaling = "content", this.fixedPlacement = !1, this.autoUpdateMode = "anchor", this.anchorElement = null, this.viewportElement = null, this.initialLayoutComplete = !1, this.resizeDetector = null, this.baseHorizontalOffset = 0, this.baseVerticalOffset = 0, this.pendingPositioningUpdate = !1, this.pendingReset = !1, this.currentDirection = je.ltr, this.regionVisible = !1, this.forceUpdate = !1, this.updateThreshold = .5, this.update = () => {
            this.pendingPositioningUpdate || this.requestPositionUpdates()
        }, this.startObservers = () => {
            this.stopObservers(), null !== this.anchorElement && (this.requestPositionUpdates(), null !== this.resizeDetector && (this.resizeDetector.observe(this.anchorElement), this.resizeDetector.observe(this)))
        }, this.requestPositionUpdates = () => {
            null === this.anchorElement || this.pendingPositioningUpdate || (oi.intersectionService.requestPosition(this, this.handleIntersection), oi.intersectionService.requestPosition(this.anchorElement, this.handleIntersection), null !== this.viewportElement && oi.intersectionService.requestPosition(this.viewportElement, this.handleIntersection), this.pendingPositioningUpdate = !0)
        }, this.stopObservers = () => {
            this.pendingPositioningUpdate && (this.pendingPositioningUpdate = !1, oi.intersectionService.cancelRequestPosition(this, this.handleIntersection), null !== this.anchorElement && oi.intersectionService.cancelRequestPosition(this.anchorElement, this.handleIntersection), null !== this.viewportElement && oi.intersectionService.cancelRequestPosition(this.viewportElement, this.handleIntersection)), null !== this.resizeDetector && this.resizeDetector.disconnect()
        }, this.getViewport = () => "string" != typeof this.viewport || "" === this.viewport ? document.documentElement : document.getElementById(this.viewport), this.getAnchor = () => document.getElementById(this.anchor), this.handleIntersection = t => {
            this.pendingPositioningUpdate && (this.pendingPositioningUpdate = !1, this.applyIntersectionEntries(t) && this.updateLayout())
        }, this.applyIntersectionEntries = t => {
            const e = t.find(t => t.target === this), i = t.find(t => t.target === this.anchorElement),
                o = t.find(t => t.target === this.viewportElement);
            return void 0 !== e && void 0 !== o && void 0 !== i && (!!(!this.regionVisible || this.forceUpdate || void 0 === this.regionRect || void 0 === this.anchorRect || void 0 === this.viewportRect || this.isRectDifferent(this.anchorRect, i.boundingClientRect) || this.isRectDifferent(this.viewportRect, o.boundingClientRect) || this.isRectDifferent(this.regionRect, e.boundingClientRect)) && (this.regionRect = e.boundingClientRect, this.anchorRect = i.boundingClientRect, this.viewportElement === document.documentElement ? this.viewportRect = new DOMRectReadOnly(o.boundingClientRect.x + document.documentElement.scrollLeft, o.boundingClientRect.y + document.documentElement.scrollTop, o.boundingClientRect.width, o.boundingClientRect.height) : this.viewportRect = o.boundingClientRect, this.updateRegionOffset(), this.forceUpdate = !1, !0))
        }, this.updateRegionOffset = () => {
            this.anchorRect && this.regionRect && (this.baseHorizontalOffset = this.baseHorizontalOffset + (this.anchorRect.left - this.regionRect.left) + (this.translateX - this.baseHorizontalOffset), this.baseVerticalOffset = this.baseVerticalOffset + (this.anchorRect.top - this.regionRect.top) + (this.translateY - this.baseVerticalOffset))
        }, this.isRectDifferent = (t, e) => Math.abs(t.top - e.top) > this.updateThreshold || Math.abs(t.right - e.right) > this.updateThreshold || Math.abs(t.bottom - e.bottom) > this.updateThreshold || Math.abs(t.left - e.left) > this.updateThreshold, this.handleResize = t => {
            this.update()
        }, this.reset = () => {
            this.pendingReset && (this.pendingReset = !1, null === this.anchorElement && (this.anchorElement = this.getAnchor()), null === this.viewportElement && (this.viewportElement = this.getViewport()), this.currentDirection = ii(this), this.startObservers())
        }, this.updateLayout = () => {
            let t = void 0, e = void 0;
            if ("uncontrolled" !== this.horizontalPositioningMode) {
                const t = this.getPositioningOptions(this.horizontalInset);
                if ("center" === this.horizontalDefaultPosition) e = "center"; else if ("unset" !== this.horizontalDefaultPosition) {
                    let t = this.horizontalDefaultPosition;
                    if ("start" === t || "end" === t) {
                        const e = ii(this);
                        if (e !== this.currentDirection) return this.currentDirection = e, void this.initialize();
                        t = this.currentDirection === je.ltr ? "start" === t ? "left" : "right" : "start" === t ? "right" : "left"
                    }
                    switch (t) {
                        case"left":
                            e = this.horizontalInset ? "insetStart" : "start";
                            break;
                        case"right":
                            e = this.horizontalInset ? "insetEnd" : "end"
                    }
                }
                const i = void 0 !== this.horizontalThreshold ? this.horizontalThreshold : void 0 !== this.regionRect ? this.regionRect.width : 0,
                    o = void 0 !== this.anchorRect ? this.anchorRect.left : 0,
                    s = void 0 !== this.anchorRect ? this.anchorRect.right : 0,
                    n = void 0 !== this.anchorRect ? this.anchorRect.width : 0,
                    r = void 0 !== this.viewportRect ? this.viewportRect.left : 0,
                    a = void 0 !== this.viewportRect ? this.viewportRect.right : 0;
                (void 0 === e || "locktodefault" !== this.horizontalPositioningMode && this.getAvailableSpace(e, o, s, n, r, a) < i) && (e = this.getAvailableSpace(t[0], o, s, n, r, a) > this.getAvailableSpace(t[1], o, s, n, r, a) ? t[0] : t[1])
            }
            if ("uncontrolled" !== this.verticalPositioningMode) {
                const e = this.getPositioningOptions(this.verticalInset);
                if ("center" === this.verticalDefaultPosition) t = "center"; else if ("unset" !== this.verticalDefaultPosition) switch (this.verticalDefaultPosition) {
                    case"top":
                        t = this.verticalInset ? "insetStart" : "start";
                        break;
                    case"bottom":
                        t = this.verticalInset ? "insetEnd" : "end"
                }
                const i = void 0 !== this.verticalThreshold ? this.verticalThreshold : void 0 !== this.regionRect ? this.regionRect.height : 0,
                    o = void 0 !== this.anchorRect ? this.anchorRect.top : 0,
                    s = void 0 !== this.anchorRect ? this.anchorRect.bottom : 0,
                    n = void 0 !== this.anchorRect ? this.anchorRect.height : 0,
                    r = void 0 !== this.viewportRect ? this.viewportRect.top : 0,
                    a = void 0 !== this.viewportRect ? this.viewportRect.bottom : 0;
                (void 0 === t || "locktodefault" !== this.verticalPositioningMode && this.getAvailableSpace(t, o, s, n, r, a) < i) && (t = this.getAvailableSpace(e[0], o, s, n, r, a) > this.getAvailableSpace(e[1], o, s, n, r, a) ? e[0] : e[1])
            }
            const i = this.getNextRegionDimension(e, t),
                o = this.horizontalPosition !== e || this.verticalPosition !== t;
            if (this.setHorizontalPosition(e, i), this.setVerticalPosition(t, i), this.updateRegionStyle(), !this.initialLayoutComplete) return this.initialLayoutComplete = !0, void this.requestPositionUpdates();
            this.regionVisible || (this.regionVisible = !0, this.style.removeProperty("pointer-events"), this.style.removeProperty("opacity"), this.classList.toggle("loaded", !0), this.$emit("loaded", this, {bubbles: !1})), this.updatePositionClasses(), o && this.$emit("positionchange", this, {bubbles: !1})
        }, this.updateRegionStyle = () => {
            this.style.width = this.regionWidth, this.style.height = this.regionHeight, this.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`
        }, this.updatePositionClasses = () => {
            this.classList.toggle("top", "start" === this.verticalPosition), this.classList.toggle("bottom", "end" === this.verticalPosition), this.classList.toggle("inset-top", "insetStart" === this.verticalPosition), this.classList.toggle("inset-bottom", "insetEnd" === this.verticalPosition), this.classList.toggle("vertical-center", "center" === this.verticalPosition), this.classList.toggle("left", "start" === this.horizontalPosition), this.classList.toggle("right", "end" === this.horizontalPosition), this.classList.toggle("inset-left", "insetStart" === this.horizontalPosition), this.classList.toggle("inset-right", "insetEnd" === this.horizontalPosition), this.classList.toggle("horizontal-center", "center" === this.horizontalPosition)
        }, this.setHorizontalPosition = (t, e) => {
            if (void 0 === t || void 0 === this.regionRect || void 0 === this.anchorRect || void 0 === this.viewportRect) return;
            let i = 0;
            switch (this.horizontalScaling) {
                case"anchor":
                case"fill":
                    i = this.horizontalViewportLock ? this.viewportRect.width : e.width, this.regionWidth = i + "px";
                    break;
                case"content":
                    i = this.regionRect.width, this.regionWidth = "unset"
            }
            let o = 0;
            switch (t) {
                case"start":
                    this.translateX = this.baseHorizontalOffset - i, this.horizontalViewportLock && this.anchorRect.left > this.viewportRect.right && (this.translateX = this.translateX - (this.anchorRect.left - this.viewportRect.right));
                    break;
                case"insetStart":
                    this.translateX = this.baseHorizontalOffset - i + this.anchorRect.width, this.horizontalViewportLock && this.anchorRect.right > this.viewportRect.right && (this.translateX = this.translateX - (this.anchorRect.right - this.viewportRect.right));
                    break;
                case"insetEnd":
                    this.translateX = this.baseHorizontalOffset, this.horizontalViewportLock && this.anchorRect.left < this.viewportRect.left && (this.translateX = this.translateX - (this.anchorRect.left - this.viewportRect.left));
                    break;
                case"end":
                    this.translateX = this.baseHorizontalOffset + this.anchorRect.width, this.horizontalViewportLock && this.anchorRect.right < this.viewportRect.left && (this.translateX = this.translateX - (this.anchorRect.right - this.viewportRect.left));
                    break;
                case"center":
                    if (o = (this.anchorRect.width - i) / 2, this.translateX = this.baseHorizontalOffset + o, this.horizontalViewportLock) {
                        const t = this.anchorRect.left + o, e = this.anchorRect.right - o;
                        t < this.viewportRect.left && !(e > this.viewportRect.right) ? this.translateX = this.translateX - (t - this.viewportRect.left) : e > this.viewportRect.right && !(t < this.viewportRect.left) && (this.translateX = this.translateX - (e - this.viewportRect.right))
                    }
            }
            this.horizontalPosition = t
        }, this.setVerticalPosition = (t, e) => {
            if (void 0 === t || void 0 === this.regionRect || void 0 === this.anchorRect || void 0 === this.viewportRect) return;
            let i = 0;
            switch (this.verticalScaling) {
                case"anchor":
                case"fill":
                    i = this.verticalViewportLock ? this.viewportRect.height : e.height, this.regionHeight = i + "px";
                    break;
                case"content":
                    i = this.regionRect.height, this.regionHeight = "unset"
            }
            let o = 0;
            switch (t) {
                case"start":
                    this.translateY = this.baseVerticalOffset - i, this.verticalViewportLock && this.anchorRect.top > this.viewportRect.bottom && (this.translateY = this.translateY - (this.anchorRect.top - this.viewportRect.bottom));
                    break;
                case"insetStart":
                    this.translateY = this.baseVerticalOffset - i + this.anchorRect.height, this.verticalViewportLock && this.anchorRect.bottom > this.viewportRect.bottom && (this.translateY = this.translateY - (this.anchorRect.bottom - this.viewportRect.bottom));
                    break;
                case"insetEnd":
                    this.translateY = this.baseVerticalOffset, this.verticalViewportLock && this.anchorRect.top < this.viewportRect.top && (this.translateY = this.translateY - (this.anchorRect.top - this.viewportRect.top));
                    break;
                case"end":
                    this.translateY = this.baseVerticalOffset + this.anchorRect.height, this.verticalViewportLock && this.anchorRect.bottom < this.viewportRect.top && (this.translateY = this.translateY - (this.anchorRect.bottom - this.viewportRect.top));
                    break;
                case"center":
                    if (o = (this.anchorRect.height - i) / 2, this.translateY = this.baseVerticalOffset + o, this.verticalViewportLock) {
                        const t = this.anchorRect.top + o, e = this.anchorRect.bottom - o;
                        t < this.viewportRect.top && !(e > this.viewportRect.bottom) ? this.translateY = this.translateY - (t - this.viewportRect.top) : e > this.viewportRect.bottom && !(t < this.viewportRect.top) && (this.translateY = this.translateY - (e - this.viewportRect.bottom))
                    }
            }
            this.verticalPosition = t
        }, this.getPositioningOptions = t => t ? ["insetStart", "insetEnd"] : ["start", "end"], this.getAvailableSpace = (t, e, i, o, s, n) => {
            const r = e - s, a = n - (e + o);
            switch (t) {
                case"start":
                    return r;
                case"insetStart":
                    return r + o;
                case"insetEnd":
                    return a + o;
                case"end":
                    return a;
                case"center":
                    return 2 * Math.min(r, a) + o
            }
        }, this.getNextRegionDimension = (t, e) => {
            const i = {
                height: void 0 !== this.regionRect ? this.regionRect.height : 0,
                width: void 0 !== this.regionRect ? this.regionRect.width : 0
            };
            return void 0 !== t && "fill" === this.horizontalScaling ? i.width = this.getAvailableSpace(t, void 0 !== this.anchorRect ? this.anchorRect.left : 0, void 0 !== this.anchorRect ? this.anchorRect.right : 0, void 0 !== this.anchorRect ? this.anchorRect.width : 0, void 0 !== this.viewportRect ? this.viewportRect.left : 0, void 0 !== this.viewportRect ? this.viewportRect.right : 0) : "anchor" === this.horizontalScaling && (i.width = void 0 !== this.anchorRect ? this.anchorRect.width : 0), void 0 !== e && "fill" === this.verticalScaling ? i.height = this.getAvailableSpace(e, void 0 !== this.anchorRect ? this.anchorRect.top : 0, void 0 !== this.anchorRect ? this.anchorRect.bottom : 0, void 0 !== this.anchorRect ? this.anchorRect.height : 0, void 0 !== this.viewportRect ? this.viewportRect.top : 0, void 0 !== this.viewportRect ? this.viewportRect.bottom : 0) : "anchor" === this.verticalScaling && (i.height = void 0 !== this.anchorRect ? this.anchorRect.height : 0), i
        }, this.startAutoUpdateEventListeners = () => {
            window.addEventListener("resize", this.update, {passive: !0}), window.addEventListener("scroll", this.update, {
                passive: !0,
                capture: !0
            }), null !== this.resizeDetector && null !== this.viewportElement && this.resizeDetector.observe(this.viewportElement)
        }, this.stopAutoUpdateEventListeners = () => {
            window.removeEventListener("resize", this.update), window.removeEventListener("scroll", this.update), null !== this.resizeDetector && null !== this.viewportElement && this.resizeDetector.unobserve(this.viewportElement)
        }
    }

    anchorChanged() {
        this.initialLayoutComplete && (this.anchorElement = this.getAnchor())
    }

    viewportChanged() {
        this.initialLayoutComplete && (this.viewportElement = this.getViewport())
    }

    horizontalPositioningModeChanged() {
        this.requestReset()
    }

    horizontalDefaultPositionChanged() {
        this.updateForAttributeChange()
    }

    horizontalViewportLockChanged() {
        this.updateForAttributeChange()
    }

    horizontalInsetChanged() {
        this.updateForAttributeChange()
    }

    horizontalThresholdChanged() {
        this.updateForAttributeChange()
    }

    horizontalScalingChanged() {
        this.updateForAttributeChange()
    }

    verticalPositioningModeChanged() {
        this.requestReset()
    }

    verticalDefaultPositionChanged() {
        this.updateForAttributeChange()
    }

    verticalViewportLockChanged() {
        this.updateForAttributeChange()
    }

    verticalInsetChanged() {
        this.updateForAttributeChange()
    }

    verticalThresholdChanged() {
        this.updateForAttributeChange()
    }

    verticalScalingChanged() {
        this.updateForAttributeChange()
    }

    fixedPlacementChanged() {
        this.$fastController.isConnected && this.initialLayoutComplete && this.initialize()
    }

    autoUpdateModeChanged(t, e) {
        this.$fastController.isConnected && this.initialLayoutComplete && ("auto" === t && this.stopAutoUpdateEventListeners(), "auto" === e && this.startAutoUpdateEventListeners())
    }

    anchorElementChanged() {
        this.requestReset()
    }

    viewportElementChanged() {
        this.$fastController.isConnected && this.initialLayoutComplete && this.initialize()
    }

    connectedCallback() {
        super.connectedCallback(), "auto" === this.autoUpdateMode && this.startAutoUpdateEventListeners(), this.initialize()
    }

    disconnectedCallback() {
        super.disconnectedCallback(), "auto" === this.autoUpdateMode && this.stopAutoUpdateEventListeners(), this.stopObservers(), this.disconnectResizeDetector()
    }

    adoptedCallback() {
        this.initialize()
    }

    disconnectResizeDetector() {
        null !== this.resizeDetector && (this.resizeDetector.disconnect(), this.resizeDetector = null)
    }

    initializeResizeDetector() {
        this.disconnectResizeDetector(), this.resizeDetector = new window.ResizeObserver(this.handleResize)
    }

    updateForAttributeChange() {
        this.$fastController.isConnected && this.initialLayoutComplete && (this.forceUpdate = !0, this.update())
    }

    initialize() {
        this.initializeResizeDetector(), null === this.anchorElement && (this.anchorElement = this.getAnchor()), this.requestReset()
    }

    requestReset() {
        this.$fastController.isConnected && !1 === this.pendingReset && (this.setInitialState(), d.queueUpdate(() => this.reset()), this.pendingReset = !0)
    }

    setInitialState() {
        this.initialLayoutComplete = !1, this.regionVisible = !1, this.translateX = 0, this.translateY = 0, this.baseHorizontalOffset = 0, this.baseVerticalOffset = 0, this.viewportRect = void 0, this.regionRect = void 0, this.anchorRect = void 0, this.verticalPosition = void 0, this.horizontalPosition = void 0, this.style.opacity = "0", this.style.pointerEvents = "none", this.forceUpdate = !1, this.style.position = this.fixedPlacement ? "fixed" : "absolute", this.updatePositionClasses(), this.updateRegionStyle()
    }
}

oi.intersectionService = new class {
    constructor() {
        this.intersectionDetector = null, this.observedElements = new Map, this.requestPosition = (t, e) => {
            var i;
            null !== this.intersectionDetector && (this.observedElements.has(t) ? null === (i = this.observedElements.get(t)) || void 0 === i || i.push(e) : (this.observedElements.set(t, [e]), this.intersectionDetector.observe(t)))
        }, this.cancelRequestPosition = (t, e) => {
            const i = this.observedElements.get(t);
            if (void 0 !== i) {
                const t = i.indexOf(e);
                -1 !== t && i.splice(t, 1)
            }
        }, this.initializeIntersectionDetector = () => {
            t.IntersectionObserver && (this.intersectionDetector = new IntersectionObserver(this.handleIntersection, {
                root: null,
                rootMargin: "0px",
                threshold: [0, 1]
            }))
        }, this.handleIntersection = t => {
            if (null === this.intersectionDetector) return;
            const e = [], i = [];
            t.forEach(t => {
                var o;
                null === (o = this.intersectionDetector) || void 0 === o || o.unobserve(t.target);
                const s = this.observedElements.get(t.target);
                void 0 !== s && (s.forEach(o => {
                    let s = e.indexOf(o);
                    -1 === s && (s = e.length, e.push(o), i.push([])), i[s].push(t)
                }), this.observedElements.delete(t.target))
            }), e.forEach((t, e) => {
                t(i[e])
            })
        }, this.initializeIntersectionDetector()
    }
}, Kt([st], oi.prototype, "anchor", void 0), Kt([st], oi.prototype, "viewport", void 0), Kt([st({attribute: "horizontal-positioning-mode"})], oi.prototype, "horizontalPositioningMode", void 0), Kt([st({attribute: "horizontal-default-position"})], oi.prototype, "horizontalDefaultPosition", void 0), Kt([st({
    attribute: "horizontal-viewport-lock",
    mode: "boolean"
})], oi.prototype, "horizontalViewportLock", void 0), Kt([st({
    attribute: "horizontal-inset",
    mode: "boolean"
})], oi.prototype, "horizontalInset", void 0), Kt([st({attribute: "horizontal-threshold"})], oi.prototype, "horizontalThreshold", void 0), Kt([st({attribute: "horizontal-scaling"})], oi.prototype, "horizontalScaling", void 0), Kt([st({attribute: "vertical-positioning-mode"})], oi.prototype, "verticalPositioningMode", void 0), Kt([st({attribute: "vertical-default-position"})], oi.prototype, "verticalDefaultPosition", void 0), Kt([st({
    attribute: "vertical-viewport-lock",
    mode: "boolean"
})], oi.prototype, "verticalViewportLock", void 0), Kt([st({
    attribute: "vertical-inset",
    mode: "boolean"
})], oi.prototype, "verticalInset", void 0), Kt([st({attribute: "vertical-threshold"})], oi.prototype, "verticalThreshold", void 0), Kt([st({attribute: "vertical-scaling"})], oi.prototype, "verticalScaling", void 0), Kt([st({
    attribute: "fixed-placement",
    mode: "boolean"
})], oi.prototype, "fixedPlacement", void 0), Kt([st({attribute: "auto-update-mode"})], oi.prototype, "autoUpdateMode", void 0), Kt([f], oi.prototype, "anchorElement", void 0), Kt([f], oi.prototype, "viewportElement", void 0), Kt([f], oi.prototype, "initialLayoutComplete", void 0);

class si extends Ee {
    constructor() {
        super(...arguments), this.generateBadgeStyle = () => {
            if (!this.fill && !this.color) return;
            const t = `background-color: var(--badge-fill-${this.fill});`,
                e = `color: var(--badge-color-${this.color});`;
            return this.fill && !this.color ? t : this.color && !this.fill ? e : `${e} ${t}`
        }
    }
}

Kt([st({attribute: "fill"})], si.prototype, "fill", void 0), Kt([st({attribute: "color"})], si.prototype, "color", void 0), Kt([st({mode: "boolean"})], si.prototype, "circular", void 0);

class ni extends ti {
    constructor() {
        super(...arguments), this.separator = !0
    }
}

Kt([f], ni.prototype, "separator", void 0), Ae(ni, Ut, ei);

class ri extends Ee {
    slottedBreadcrumbItemsChanged() {
        if (this.$fastController.isConnected) {
            if (void 0 === this.slottedBreadcrumbItems || 0 === this.slottedBreadcrumbItems.length) return;
            const t = this.slottedBreadcrumbItems[this.slottedBreadcrumbItems.length - 1];
            this.slottedBreadcrumbItems.forEach(e => {
                const i = e === t;
                this.setItemSeparator(e, i), this.setAriaCurrent(e, i)
            })
        }
    }

    setItemSeparator(t, e) {
        t instanceof ni && (t.separator = !e)
    }

    findChildWithHref(t) {
        var e, i;
        return t.childElementCount > 0 ? t.querySelector("a[href]") : (null === (e = t.shadowRoot) || void 0 === e ? void 0 : e.childElementCount) ? null === (i = t.shadowRoot) || void 0 === i ? void 0 : i.querySelector("a[href]") : null
    }

    setAriaCurrent(t, e) {
        const i = this.findChildWithHref(t);
        null === i && t.hasAttribute("href") && t instanceof ni ? e ? t.setAttribute("aria-current", "page") : t.removeAttribute("aria-current") : null !== i && (e ? i.setAttribute("aria-current", "page") : i.removeAttribute("aria-current"))
    }
}

Kt([f], ri.prototype, "slottedBreadcrumbItems", void 0);
const ai = "ElementInternals" in window && "setFormValue" in window.ElementInternals.prototype, li = new WeakMap;

function ci(t) {
    const e = class extends t {
        constructor(...t) {
            super(...t), this.dirtyValue = !1, this.disabled = !1, this.proxyEventsToBlock = ["change", "click"], this.proxyInitialized = !1, this.required = !1, this.initialValue = this.initialValue || "", this.elementInternals || (this.formResetCallback = this.formResetCallback.bind(this))
        }

        static get formAssociated() {
            return ai
        }

        get validity() {
            return this.elementInternals ? this.elementInternals.validity : this.proxy.validity
        }

        get form() {
            return this.elementInternals ? this.elementInternals.form : this.proxy.form
        }

        get validationMessage() {
            return this.elementInternals ? this.elementInternals.validationMessage : this.proxy.validationMessage
        }

        get willValidate() {
            return this.elementInternals ? this.elementInternals.willValidate : this.proxy.willValidate
        }

        get labels() {
            if (this.elementInternals) return Object.freeze(Array.from(this.elementInternals.labels));
            if (this.proxy instanceof HTMLElement && this.proxy.ownerDocument && this.id) {
                const t = this.proxy.labels,
                    e = Array.from(this.proxy.getRootNode().querySelectorAll(`[for='${this.id}']`)),
                    i = t ? e.concat(Array.from(t)) : e;
                return Object.freeze(i)
            }
            return o
        }

        valueChanged(t, e) {
            this.dirtyValue = !0, this.proxy instanceof HTMLElement && (this.proxy.value = this.value), this.currentValue = this.value, this.setFormValue(this.value), this.validate()
        }

        currentValueChanged() {
            this.value = this.currentValue
        }

        initialValueChanged(t, e) {
            this.dirtyValue || (this.value = this.initialValue, this.dirtyValue = !1)
        }

        disabledChanged(t, e) {
            this.proxy instanceof HTMLElement && (this.proxy.disabled = this.disabled), d.queueUpdate(() => this.classList.toggle("disabled", this.disabled))
        }

        nameChanged(t, e) {
            this.proxy instanceof HTMLElement && (this.proxy.name = this.name)
        }

        requiredChanged(t, e) {
            this.proxy instanceof HTMLElement && (this.proxy.required = this.required), d.queueUpdate(() => this.classList.toggle("required", this.required)), this.validate()
        }

        get elementInternals() {
            if (!ai) return null;
            let t = li.get(this);
            return t || (t = this.attachInternals(), li.set(this, t)), t
        }

        connectedCallback() {
            super.connectedCallback(), this.addEventListener("keypress", this._keypressHandler), this.value || (this.value = this.initialValue, this.dirtyValue = !1), this.elementInternals || (this.attachProxy(), this.form && this.form.addEventListener("reset", this.formResetCallback))
        }

        disconnectedCallback() {
            this.proxyEventsToBlock.forEach(t => this.proxy.removeEventListener(t, this.stopPropagation)), !this.elementInternals && this.form && this.form.removeEventListener("reset", this.formResetCallback)
        }

        checkValidity() {
            return this.elementInternals ? this.elementInternals.checkValidity() : this.proxy.checkValidity()
        }

        reportValidity() {
            return this.elementInternals ? this.elementInternals.reportValidity() : this.proxy.reportValidity()
        }

        setValidity(t, e, i) {
            this.elementInternals ? this.elementInternals.setValidity(t, e, i) : "string" == typeof e && this.proxy.setCustomValidity(e)
        }

        formDisabledCallback(t) {
            this.disabled = t
        }

        formResetCallback() {
            this.value = this.initialValue, this.dirtyValue = !1
        }

        attachProxy() {
            var t;
            this.proxyInitialized || (this.proxyInitialized = !0, this.proxy.style.display = "none", this.proxyEventsToBlock.forEach(t => this.proxy.addEventListener(t, this.stopPropagation)), this.proxy.disabled = this.disabled, this.proxy.required = this.required, "string" == typeof this.name && (this.proxy.name = this.name), "string" == typeof this.value && (this.proxy.value = this.value), this.proxy.setAttribute("slot", "form-associated-proxy"), this.proxySlot = document.createElement("slot"), this.proxySlot.setAttribute("name", "form-associated-proxy")), null === (t = this.shadowRoot) || void 0 === t || t.appendChild(this.proxySlot), this.appendChild(this.proxy)
        }

        detachProxy() {
            var t;
            this.removeChild(this.proxy), null === (t = this.shadowRoot) || void 0 === t || t.removeChild(this.proxySlot)
        }

        validate(t) {
            this.proxy instanceof HTMLElement && this.setValidity(this.proxy.validity, this.proxy.validationMessage, t)
        }

        setFormValue(t, e) {
            this.elementInternals && this.elementInternals.setFormValue(t, e || t)
        }

        _keypressHandler(t) {
            switch (t.key) {
                case"Enter":
                    if (this.form instanceof HTMLFormElement) {
                        const t = this.form.querySelector("[type=submit]");
                        null == t || t.click()
                    }
            }
        }

        stopPropagation(t) {
            t.stopPropagation()
        }
    };
    return st({mode: "boolean"})(e.prototype, "disabled"), st({
        mode: "fromView",
        attribute: "value"
    })(e.prototype, "initialValue"), st({attribute: "current-value"})(e.prototype, "currentValue"), st(e.prototype, "name"), st({mode: "boolean"})(e.prototype, "required"), f(e.prototype, "value"), e
}

function hi(t) {
    class e extends (ci(t)) {
    }

    class i extends e {
        constructor(...t) {
            super(t), this.dirtyChecked = !1, this.checkedAttribute = !1, this.checked = !1, this.dirtyChecked = !1
        }

        checkedAttributeChanged() {
            this.defaultChecked = this.checkedAttribute
        }

        defaultCheckedChanged() {
            this.dirtyChecked || (this.checked = this.defaultChecked, this.dirtyChecked = !1)
        }

        checkedChanged(t, e) {
            this.dirtyChecked || (this.dirtyChecked = !0), this.currentChecked = this.checked, this.updateForm(), this.proxy instanceof HTMLInputElement && (this.proxy.checked = this.checked), void 0 !== t && this.$emit("change"), this.validate()
        }

        currentCheckedChanged(t, e) {
            this.checked = this.currentChecked
        }

        updateForm() {
            const t = this.checked ? this.value : null;
            this.setFormValue(t, t)
        }

        connectedCallback() {
            super.connectedCallback(), this.updateForm()
        }

        formResetCallback() {
            super.formResetCallback(), this.checked = !!this.checkedAttribute, this.dirtyChecked = !1
        }
    }

    return st({
        attribute: "checked",
        mode: "boolean"
    })(i.prototype, "checkedAttribute"), st({
        attribute: "current-checked",
        converter: et
    })(i.prototype, "currentChecked"), f(i.prototype, "defaultChecked"), f(i.prototype, "checked"), i
}

class di extends Ee {
}

class ui extends (ci(di)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("input")
    }
}

class pi extends ui {
    constructor() {
        super(...arguments), this.handleClick = t => {
            var e;
            this.disabled && (null === (e = this.defaultSlottedContent) || void 0 === e ? void 0 : e.length) <= 1 && t.stopPropagation()
        }, this.handleSubmission = () => {
            if (!this.form) return;
            const t = this.proxy.isConnected;
            t || this.attachProxy(), "function" == typeof this.form.requestSubmit ? this.form.requestSubmit(this.proxy) : this.proxy.click(), t || this.detachProxy()
        }, this.handleFormReset = () => {
            var t;
            null === (t = this.form) || void 0 === t || t.reset()
        }, this.handleUnsupportedDelegatesFocus = () => {
            var t;
            window.ShadowRoot && !window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus") && (null === (t = this.$fastController.definition.shadowOptions) || void 0 === t ? void 0 : t.delegatesFocus) && (this.focus = () => {
                this.control.focus()
            })
        }
    }

    formactionChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.formAction = this.formaction)
    }

    formenctypeChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.formEnctype = this.formenctype)
    }

    formmethodChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.formMethod = this.formmethod)
    }

    formnovalidateChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.formNoValidate = this.formnovalidate)
    }

    formtargetChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.formTarget = this.formtarget)
    }

    typeChanged(t, e) {
        this.proxy instanceof HTMLInputElement && (this.proxy.type = this.type), "submit" === e && this.addEventListener("click", this.handleSubmission), "submit" === t && this.removeEventListener("click", this.handleSubmission), "reset" === e && this.addEventListener("click", this.handleFormReset), "reset" === t && this.removeEventListener("click", this.handleFormReset)
    }

    validate() {
        super.validate(this.control)
    }

    connectedCallback() {
        var t;
        super.connectedCallback(), this.proxy.setAttribute("type", this.type), this.handleUnsupportedDelegatesFocus();
        const e = Array.from(null === (t = this.control) || void 0 === t ? void 0 : t.children);
        e && e.forEach(t => {
            t.addEventListener("click", this.handleClick)
        })
    }

    disconnectedCallback() {
        var t;
        super.disconnectedCallback();
        const e = Array.from(null === (t = this.control) || void 0 === t ? void 0 : t.children);
        e && e.forEach(t => {
            t.removeEventListener("click", this.handleClick)
        })
    }
}

Kt([st({mode: "boolean"})], pi.prototype, "autofocus", void 0), Kt([st({attribute: "form"})], pi.prototype, "formId", void 0), Kt([st], pi.prototype, "formaction", void 0), Kt([st], pi.prototype, "formenctype", void 0), Kt([st], pi.prototype, "formmethod", void 0), Kt([st({mode: "boolean"})], pi.prototype, "formnovalidate", void 0), Kt([st], pi.prototype, "formtarget", void 0), Kt([st], pi.prototype, "type", void 0), Kt([f], pi.prototype, "defaultSlottedContent", void 0);

class gi {
}

Kt([st({attribute: "aria-expanded"})], gi.prototype, "ariaExpanded", void 0), Kt([st({attribute: "aria-pressed"})], gi.prototype, "ariaPressed", void 0), Ae(gi, Je), Ae(pi, Ut, gi);

class fi {
    constructor(t) {
        if (this.dayFormat = "numeric", this.weekdayFormat = "long", this.monthFormat = "long", this.yearFormat = "numeric", this.date = new Date, t) for (const e in t) {
            const i = t[e];
            "date" === e ? this.date = this.getDateObject(i) : this[e] = i
        }
    }

    getDateObject(t) {
        if ("string" == typeof t) {
            const e = t.split(/[/-]/);
            return e.length < 3 ? new Date : new Date(parseInt(e[2], 10), parseInt(e[0], 10) - 1, parseInt(e[1], 10))
        }
        if ("day" in t && "month" in t && "year" in t) {
            const {day: e, month: i, year: o} = t;
            return new Date(o, i - 1, e)
        }
        return t
    }

    getDate(t = this.date, e = {
        weekday: this.weekdayFormat,
        month: this.monthFormat,
        day: this.dayFormat,
        year: this.yearFormat
    }, i = this.locale) {
        const o = this.getDateObject(t);
        if (!o.getTime()) return "";
        const s = Object.assign({timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone}, e);
        return new Intl.DateTimeFormat(i, s).format(o)
    }

    getDay(t = this.date.getDate(), e = this.dayFormat, i = this.locale) {
        return this.getDate({month: 1, day: t, year: 2020}, {day: e}, i)
    }

    getMonth(t = this.date.getMonth() + 1, e = this.monthFormat, i = this.locale) {
        return this.getDate({month: t, day: 2, year: 2020}, {month: e}, i)
    }

    getYear(t = this.date.getFullYear(), e = this.yearFormat, i = this.locale) {
        return this.getDate({month: 2, day: 2, year: t}, {year: e}, i)
    }

    getWeekday(t = 0, e = this.weekdayFormat, i = this.locale) {
        const o = `1-${t + 1}-2017`;
        return this.getDate(o, {weekday: e}, i)
    }

    getWeekdays(t = this.weekdayFormat, e = this.locale) {
        return Array(7).fill(null).map((i, o) => this.getWeekday(o, t, e))
    }
}

class mi extends Ee {
    constructor() {
        super(...arguments), this.dateFormatter = new fi, this.readonly = !1, this.locale = "en-US", this.month = (new Date).getMonth() + 1, this.year = (new Date).getFullYear(), this.dayFormat = "numeric", this.weekdayFormat = "short", this.monthFormat = "long", this.yearFormat = "numeric", this.minWeeks = 0, this.disabledDates = "", this.selectedDates = "", this.oneDayInMs = 864e5
    }

    localeChanged() {
        this.dateFormatter.locale = this.locale
    }

    dayFormatChanged() {
        this.dateFormatter.dayFormat = this.dayFormat
    }

    weekdayFormatChanged() {
        this.dateFormatter.weekdayFormat = this.weekdayFormat
    }

    monthFormatChanged() {
        this.dateFormatter.monthFormat = this.monthFormat
    }

    yearFormatChanged() {
        this.dateFormatter.yearFormat = this.yearFormat
    }

    getMonthInfo(t = this.month, e = this.year) {
        const i = t => new Date(t.getFullYear(), t.getMonth(), 1).getDay(), o = t => {
            const e = new Date(t.getFullYear(), t.getMonth() + 1, 1);
            return new Date(e.getTime() - this.oneDayInMs).getDate()
        }, s = new Date(e, t - 1), n = new Date(e, t), r = new Date(e, t - 2);
        return {
            length: o(s),
            month: t,
            start: i(s),
            year: e,
            previous: {length: o(r), month: r.getMonth() + 1, start: i(r), year: r.getFullYear()},
            next: {length: o(n), month: n.getMonth() + 1, start: i(n), year: n.getFullYear()}
        }
    }

    getDays(t = this.getMonthInfo(), e = this.minWeeks) {
        e = e > 10 ? 10 : e;
        const {start: i, length: o, previous: s, next: n} = t, r = [];
        let a = 1 - i;
        for (; a < o + 1 || r.length < e || r[r.length - 1].length % 7 != 0;) {
            const {month: e, year: i} = a < 1 ? s : a > o ? n : t, l = a < 1 ? s.length + a : a > o ? a - o : a,
                c = `${e}-${l}-${i}`, h = {
                    day: l,
                    month: e,
                    year: i,
                    disabled: this.dateInString(c, this.disabledDates),
                    selected: this.dateInString(c, this.selectedDates)
                }, d = r[r.length - 1];
            0 === r.length || d.length % 7 == 0 ? r.push([h]) : d.push(h), a++
        }
        return r
    }

    dateInString(t, e) {
        const i = e.split(",").map(t => t.trim());
        return t = "string" == typeof t ? t : `${t.getMonth() + 1}-${t.getDate()}-${t.getFullYear()}`, i.some(e => e === t)
    }

    getDayClassNames(t, e) {
        const {day: i, month: o, year: s, disabled: n, selected: r} = t;
        return ["day", e === `${o}-${i}-${s}` && "today", this.month !== o && "inactive", n && "disabled", r && "selected"].filter(Boolean).join(" ")
    }

    getWeekdayText() {
        const t = this.dateFormatter.getWeekdays().map(t => ({text: t}));
        if ("long" !== this.weekdayFormat) {
            const e = this.dateFormatter.getWeekdays("long");
            t.forEach((t, i) => {
                t.abbr = e[i]
            })
        }
        return t
    }

    handleDateSelect(t, e) {
        t.preventDefault, this.$emit("dateselected", e)
    }

    handleKeydown(t, e) {
        return "Enter" === t.key && this.handleDateSelect(t, e), !0
    }
}

Kt([st({mode: "boolean"})], mi.prototype, "readonly", void 0), Kt([st], mi.prototype, "locale", void 0), Kt([st({converter: it})], mi.prototype, "month", void 0), Kt([st({converter: it})], mi.prototype, "year", void 0), Kt([st({
    attribute: "day-format",
    mode: "fromView"
})], mi.prototype, "dayFormat", void 0), Kt([st({
    attribute: "weekday-format",
    mode: "fromView"
})], mi.prototype, "weekdayFormat", void 0), Kt([st({
    attribute: "month-format",
    mode: "fromView"
})], mi.prototype, "monthFormat", void 0), Kt([st({
    attribute: "year-format",
    mode: "fromView"
})], mi.prototype, "yearFormat", void 0), Kt([st({
    attribute: "min-weeks",
    converter: it
})], mi.prototype, "minWeeks", void 0), Kt([st({attribute: "disabled-dates"})], mi.prototype, "disabledDates", void 0), Kt([st({attribute: "selected-dates"})], mi.prototype, "selectedDates", void 0);
const vi = "none", bi = "default", yi = "sticky", xi = "default", $i = "columnheader", wi = "rowheader", ki = "default",
    Ci = "header", Ii = "sticky-header";

class Fi extends Ee {
    constructor() {
        super(...arguments), this.rowType = ki, this.rowData = null, this.columnDefinitions = null, this.isActiveRow = !1, this.cellsRepeatBehavior = null, this.cellsPlaceholder = null, this.focusColumnIndex = 0, this.refocusOnLoad = !1, this.updateRowStyle = () => {
            this.style.gridTemplateColumns = this.gridTemplateColumns
        }
    }

    gridTemplateColumnsChanged() {
        this.$fastController.isConnected && this.updateRowStyle()
    }

    rowTypeChanged() {
        this.$fastController.isConnected && this.updateItemTemplate()
    }

    rowDataChanged() {
        null !== this.rowData && this.isActiveRow && (this.refocusOnLoad = !0)
    }

    cellItemTemplateChanged() {
        this.updateItemTemplate()
    }

    headerCellItemTemplateChanged() {
        this.updateItemTemplate()
    }

    connectedCallback() {
        super.connectedCallback(), null === this.cellsRepeatBehavior && (this.cellsPlaceholder = document.createComment(""), this.appendChild(this.cellsPlaceholder), this.updateItemTemplate(), this.cellsRepeatBehavior = new Lt(t => t.columnDefinitions, t => t.activeCellItemTemplate, {positioning: !0}).createBehavior(this.cellsPlaceholder), this.$fastController.addBehaviors([this.cellsRepeatBehavior])), this.addEventListener("cell-focused", this.handleCellFocus), this.addEventListener("focusout", this.handleFocusout), this.addEventListener("keydown", this.handleKeydown), this.updateRowStyle(), this.refocusOnLoad && (this.refocusOnLoad = !1, this.cellElements.length > this.focusColumnIndex && this.cellElements[this.focusColumnIndex].focus())
    }

    disconnectedCallback() {
        super.disconnectedCallback(), this.removeEventListener("cell-focused", this.handleCellFocus), this.removeEventListener("focusout", this.handleFocusout), this.removeEventListener("keydown", this.handleKeydown)
    }

    handleFocusout(t) {
        this.contains(t.target) || (this.isActiveRow = !1, this.focusColumnIndex = 0)
    }

    handleCellFocus(t) {
        this.isActiveRow = !0, this.focusColumnIndex = this.cellElements.indexOf(t.target), this.$emit("row-focused", this)
    }

    handleKeydown(t) {
        if (t.defaultPrevented) return;
        let e = 0;
        switch (t.key) {
            case"ArrowLeft":
                e = Math.max(0, this.focusColumnIndex - 1), this.cellElements[e].focus(), t.preventDefault();
                break;
            case"ArrowRight":
                e = Math.min(this.cellElements.length - 1, this.focusColumnIndex + 1), this.cellElements[e].focus(), t.preventDefault();
                break;
            case"Home":
                t.ctrlKey || (this.cellElements[0].focus(), t.preventDefault());
                break;
            case"End":
                t.ctrlKey || (this.cellElements[this.cellElements.length - 1].focus(), t.preventDefault())
        }
    }

    updateItemTemplate() {
        this.activeCellItemTemplate = this.rowType === ki && void 0 !== this.cellItemTemplate ? this.cellItemTemplate : this.rowType === ki && void 0 === this.cellItemTemplate ? this.defaultCellItemTemplate : void 0 !== this.headerCellItemTemplate ? this.headerCellItemTemplate : this.defaultHeaderCellItemTemplate
    }
}

Kt([st({attribute: "grid-template-columns"})], Fi.prototype, "gridTemplateColumns", void 0), Kt([st({attribute: "row-type"})], Fi.prototype, "rowType", void 0), Kt([f], Fi.prototype, "rowData", void 0), Kt([f], Fi.prototype, "columnDefinitions", void 0), Kt([f], Fi.prototype, "cellItemTemplate", void 0), Kt([f], Fi.prototype, "headerCellItemTemplate", void 0), Kt([f], Fi.prototype, "rowIndex", void 0), Kt([f], Fi.prototype, "isActiveRow", void 0), Kt([f], Fi.prototype, "activeCellItemTemplate", void 0), Kt([f], Fi.prototype, "defaultCellItemTemplate", void 0), Kt([f], Fi.prototype, "defaultHeaderCellItemTemplate", void 0), Kt([f], Fi.prototype, "cellElements", void 0);

class Di extends Ee {
    constructor() {
        super(), this.noTabbing = !1, this.generateHeader = bi, this.rowsData = [], this.columnDefinitions = null, this.focusRowIndex = 0, this.focusColumnIndex = 0, this.rowsPlaceholder = null, this.generatedHeader = null, this.isUpdatingFocus = !1, this.pendingFocusUpdate = !1, this.rowindexUpdateQueued = !1, this.columnDefinitionsStale = !0, this.generatedGridTemplateColumns = "", this.focusOnCell = (t, e, i) => {
            if (0 === this.rowElements.length) return this.focusRowIndex = 0, void (this.focusColumnIndex = 0);
            const o = Math.max(0, Math.min(this.rowElements.length - 1, t)),
                s = this.rowElements[o].querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]'),
                n = s[Math.max(0, Math.min(s.length - 1, e))];
            i && this.scrollHeight !== this.clientHeight && (o < this.focusRowIndex && this.scrollTop > 0 || o > this.focusRowIndex && this.scrollTop < this.scrollHeight - this.clientHeight) && n.scrollIntoView({
                block: "center",
                inline: "center"
            }), n.focus()
        }, this.onChildListChange = (t, e) => {
            t && t.length && (t.forEach(t => {
                t.addedNodes.forEach(t => {
                    1 === t.nodeType && "row" === t.getAttribute("role") && (t.columnDefinitions = this.columnDefinitions)
                })
            }), this.queueRowIndexUpdate())
        }, this.queueRowIndexUpdate = () => {
            this.rowindexUpdateQueued || (this.rowindexUpdateQueued = !0, d.queueUpdate(this.updateRowIndexes))
        }, this.updateRowIndexes = () => {
            let t = this.gridTemplateColumns;
            if (void 0 === t) {
                if ("" === this.generatedGridTemplateColumns && this.rowElements.length > 0) {
                    const t = this.rowElements[0];
                    this.generatedGridTemplateColumns = new Array(t.cellElements.length).fill("1fr").join(" ")
                }
                t = this.generatedGridTemplateColumns
            }
            this.rowElements.forEach((e, i) => {
                const o = e;
                o.rowIndex = i, o.gridTemplateColumns = t, this.columnDefinitionsStale && (o.columnDefinitions = this.columnDefinitions)
            }), this.rowindexUpdateQueued = !1, this.columnDefinitionsStale = !1
        }
    }

    static generateTemplateColumns(t) {
        let e = "";
        return t.forEach(t => {
            e = `${e}${"" === e ? "" : " "}1fr`
        }), e
    }

    noTabbingChanged() {
        this.$fastController.isConnected && (this.noTabbing ? this.setAttribute("tabIndex", "-1") : this.setAttribute("tabIndex", this.contains(document.activeElement) || this === document.activeElement ? "-1" : "0"))
    }

    generateHeaderChanged() {
        this.$fastController.isConnected && this.toggleGeneratedHeader()
    }

    gridTemplateColumnsChanged() {
        this.$fastController.isConnected && this.updateRowIndexes()
    }

    rowsDataChanged() {
        null === this.columnDefinitions && this.rowsData.length > 0 && (this.columnDefinitions = Di.generateColumns(this.rowsData[0])), this.$fastController.isConnected && this.toggleGeneratedHeader()
    }

    columnDefinitionsChanged() {
        null !== this.columnDefinitions ? (this.generatedGridTemplateColumns = Di.generateTemplateColumns(this.columnDefinitions), this.$fastController.isConnected && (this.columnDefinitionsStale = !0, this.queueRowIndexUpdate())) : this.generatedGridTemplateColumns = ""
    }

    headerCellItemTemplateChanged() {
        this.$fastController.isConnected && null !== this.generatedHeader && (this.generatedHeader.headerCellItemTemplate = this.headerCellItemTemplate)
    }

    focusRowIndexChanged() {
        this.$fastController.isConnected && this.queueFocusUpdate()
    }

    focusColumnIndexChanged() {
        this.$fastController.isConnected && this.queueFocusUpdate()
    }

    connectedCallback() {
        super.connectedCallback(), void 0 === this.rowItemTemplate && (this.rowItemTemplate = this.defaultRowItemTemplate), this.rowsPlaceholder = document.createComment(""), this.appendChild(this.rowsPlaceholder), this.toggleGeneratedHeader(), this.rowsRepeatBehavior = new Lt(t => t.rowsData, t => t.rowItemTemplate, {positioning: !0}).createBehavior(this.rowsPlaceholder), this.$fastController.addBehaviors([this.rowsRepeatBehavior]), this.addEventListener("row-focused", this.handleRowFocus), this.addEventListener("focus", this.handleFocus), this.addEventListener("keydown", this.handleKeydown), this.addEventListener("focusout", this.handleFocusOut), this.observer = new MutationObserver(this.onChildListChange), this.observer.observe(this, {childList: !0}), this.noTabbing && this.setAttribute("tabindex", "-1"), d.queueUpdate(this.queueRowIndexUpdate)
    }

    disconnectedCallback() {
        super.disconnectedCallback(), this.removeEventListener("row-focused", this.handleRowFocus), this.removeEventListener("focus", this.handleFocus), this.removeEventListener("keydown", this.handleKeydown), this.removeEventListener("focusout", this.handleFocusOut), this.observer.disconnect(), this.rowsPlaceholder = null, this.generatedHeader = null
    }

    handleRowFocus(t) {
        this.isUpdatingFocus = !0;
        const e = t.target;
        this.focusRowIndex = this.rowElements.indexOf(e), this.focusColumnIndex = e.focusColumnIndex, this.setAttribute("tabIndex", "-1"), this.isUpdatingFocus = !1
    }

    handleFocus(t) {
        this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, !0)
    }

    handleFocusOut(t) {
        null !== t.relatedTarget && this.contains(t.relatedTarget) || this.setAttribute("tabIndex", this.noTabbing ? "-1" : "0")
    }

    handleKeydown(t) {
        if (t.defaultPrevented) return;
        let e;
        const i = this.rowElements.length - 1, o = this.offsetHeight + this.scrollTop, s = this.rowElements[i];
        switch (t.key) {
            case"ArrowUp":
                t.preventDefault(), this.focusOnCell(this.focusRowIndex - 1, this.focusColumnIndex, !0);
                break;
            case"ArrowDown":
                t.preventDefault(), this.focusOnCell(this.focusRowIndex + 1, this.focusColumnIndex, !0);
                break;
            case"PageUp":
                if (t.preventDefault(), 0 === this.rowElements.length) {
                    this.focusOnCell(0, 0, !1);
                    break
                }
                if (0 === this.focusRowIndex) return void this.focusOnCell(0, this.focusColumnIndex, !1);
                for (e = this.focusRowIndex - 1; e >= 0; e--) {
                    const t = this.rowElements[e];
                    if (t.offsetTop < this.scrollTop) {
                        this.scrollTop = t.offsetTop + t.clientHeight - this.clientHeight;
                        break
                    }
                }
                this.focusOnCell(e, this.focusColumnIndex, !1);
                break;
            case"PageDown":
                if (t.preventDefault(), 0 === this.rowElements.length) {
                    this.focusOnCell(0, 0, !1);
                    break
                }
                if (this.focusRowIndex >= i || s.offsetTop + s.offsetHeight <= o) return void this.focusOnCell(i, this.focusColumnIndex, !1);
                for (e = this.focusRowIndex + 1; e <= i; e++) {
                    const t = this.rowElements[e];
                    if (t.offsetTop + t.offsetHeight > o) {
                        let e = 0;
                        this.generateHeader === yi && null !== this.generatedHeader && (e = this.generatedHeader.clientHeight), this.scrollTop = t.offsetTop - e;
                        break
                    }
                }
                this.focusOnCell(e, this.focusColumnIndex, !1);
                break;
            case"Home":
                t.ctrlKey && (t.preventDefault(), this.focusOnCell(0, 0, !0));
                break;
            case"End":
                t.ctrlKey && null !== this.columnDefinitions && (t.preventDefault(), this.focusOnCell(this.rowElements.length - 1, this.columnDefinitions.length - 1, !0))
        }
    }

    queueFocusUpdate() {
        this.isUpdatingFocus && (this.contains(document.activeElement) || this === document.activeElement) || !1 === this.pendingFocusUpdate && (this.pendingFocusUpdate = !0, d.queueUpdate(() => this.updateFocus()))
    }

    updateFocus() {
        this.pendingFocusUpdate = !1, this.focusOnCell(this.focusRowIndex, this.focusColumnIndex, !0)
    }

    toggleGeneratedHeader() {
        if (null !== this.generatedHeader && (this.removeChild(this.generatedHeader), this.generatedHeader = null), this.generateHeader !== vi && this.rowsData.length > 0) {
            const t = document.createElement(this.rowElementTag);
            return this.generatedHeader = t, this.generatedHeader.columnDefinitions = this.columnDefinitions, this.generatedHeader.gridTemplateColumns = this.gridTemplateColumns, this.generatedHeader.rowType = this.generateHeader === yi ? Ii : Ci, void (null === this.firstChild && null === this.rowsPlaceholder || this.insertBefore(t, null !== this.firstChild ? this.firstChild : this.rowsPlaceholder))
        }
    }
}

Di.generateColumns = t => Object.getOwnPropertyNames(t).map((t, e) => ({
    columnDataKey: t,
    gridColumn: "" + e
})), Kt([st({
    attribute: "no-tabbing",
    mode: "boolean"
})], Di.prototype, "noTabbing", void 0), Kt([st({attribute: "generate-header"})], Di.prototype, "generateHeader", void 0), Kt([st({attribute: "grid-template-columns"})], Di.prototype, "gridTemplateColumns", void 0), Kt([f], Di.prototype, "rowsData", void 0), Kt([f], Di.prototype, "columnDefinitions", void 0), Kt([f], Di.prototype, "rowItemTemplate", void 0), Kt([f], Di.prototype, "cellItemTemplate", void 0), Kt([f], Di.prototype, "headerCellItemTemplate", void 0), Kt([f], Di.prototype, "focusRowIndex", void 0), Kt([f], Di.prototype, "focusColumnIndex", void 0), Kt([f], Di.prototype, "defaultRowItemTemplate", void 0), Kt([f], Di.prototype, "rowElementTag", void 0), Kt([f], Di.prototype, "rowElements", void 0);
const Ti = _`<template>${t => null === t.rowData || null === t.columnDefinition || null === t.columnDefinition.columnDataKey ? null : t.rowData[t.columnDefinition.columnDataKey]}</template>`,
    Si = _`<template>${t => null === t.columnDefinition ? null : void 0 === t.columnDefinition.title ? t.columnDefinition.columnDataKey : t.columnDefinition.title}</template>`;

class Oi extends Ee {
    constructor() {
        super(...arguments), this.cellType = xi, this.rowData = null, this.columnDefinition = null, this.isActiveCell = !1, this.customCellView = null, this.updateCellStyle = () => {
            this.style.gridColumn = this.gridColumn
        }
    }

    cellTypeChanged() {
        this.$fastController.isConnected && this.updateCellView()
    }

    gridColumnChanged() {
        this.$fastController.isConnected && this.updateCellStyle()
    }

    columnDefinitionChanged(t, e) {
        this.$fastController.isConnected && this.updateCellView()
    }

    connectedCallback() {
        var t;
        super.connectedCallback(), this.addEventListener("focusin", this.handleFocusin), this.addEventListener("focusout", this.handleFocusout), this.addEventListener("keydown", this.handleKeydown), this.style.gridColumn = "" + (void 0 === (null === (t = this.columnDefinition) || void 0 === t ? void 0 : t.gridColumn) ? 0 : this.columnDefinition.gridColumn), this.updateCellView(), this.updateCellStyle()
    }

    disconnectedCallback() {
        super.disconnectedCallback(), this.removeEventListener("focusin", this.handleFocusin), this.removeEventListener("focusout", this.handleFocusout), this.removeEventListener("keydown", this.handleKeydown), this.disconnectCellView()
    }

    handleFocusin(t) {
        if (!this.isActiveCell) {
            switch (this.isActiveCell = !0, this.cellType) {
                case $i:
                    if (null !== this.columnDefinition && !0 !== this.columnDefinition.headerCellInternalFocusQueue && "function" == typeof this.columnDefinition.headerCellFocusTargetCallback) {
                        const t = this.columnDefinition.headerCellFocusTargetCallback(this);
                        null !== t && t.focus()
                    }
                    break;
                default:
                    if (null !== this.columnDefinition && !0 !== this.columnDefinition.cellInternalFocusQueue && "function" == typeof this.columnDefinition.cellFocusTargetCallback) {
                        const t = this.columnDefinition.cellFocusTargetCallback(this);
                        null !== t && t.focus()
                    }
            }
            this.$emit("cell-focused", this)
        }
    }

    handleFocusout(t) {
        this === document.activeElement || this.contains(document.activeElement) || (this.isActiveCell = !1)
    }

    handleKeydown(t) {
        if (!(t.defaultPrevented || null === this.columnDefinition || this.cellType === xi && !0 !== this.columnDefinition.cellInternalFocusQueue || this.cellType === $i && !0 !== this.columnDefinition.headerCellInternalFocusQueue)) switch (t.key) {
            case"Enter":
            case"F2":
                if (this.contains(document.activeElement) && document.activeElement !== this) return;
                switch (this.cellType) {
                    case $i:
                        if (void 0 !== this.columnDefinition.headerCellFocusTargetCallback) {
                            const e = this.columnDefinition.headerCellFocusTargetCallback(this);
                            null !== e && e.focus(), t.preventDefault()
                        }
                        break;
                    default:
                        if (void 0 !== this.columnDefinition.cellFocusTargetCallback) {
                            const e = this.columnDefinition.cellFocusTargetCallback(this);
                            null !== e && e.focus(), t.preventDefault()
                        }
                }
                break;
            case"Escape":
                this.contains(document.activeElement) && document.activeElement !== this && (this.focus(), t.preventDefault())
        }
    }

    updateCellView() {
        if (this.disconnectCellView(), null !== this.columnDefinition) switch (this.cellType) {
            case $i:
                void 0 !== this.columnDefinition.headerCellTemplate ? this.customCellView = this.columnDefinition.headerCellTemplate.render(this, this) : this.customCellView = Si.render(this, this);
                break;
            case void 0:
            case wi:
            case xi:
                void 0 !== this.columnDefinition.cellTemplate ? this.customCellView = this.columnDefinition.cellTemplate.render(this, this) : this.customCellView = Ti.render(this, this)
        }
    }

    disconnectCellView() {
        null !== this.customCellView && (this.customCellView.dispose(), this.customCellView = null)
    }
}

Kt([st({attribute: "cell-type"})], Oi.prototype, "cellType", void 0), Kt([st({attribute: "grid-column"})], Oi.prototype, "gridColumn", void 0), Kt([f], Oi.prototype, "rowData", void 0), Kt([f], Oi.prototype, "columnDefinition", void 0);
const Ei = _`<div class="title" part="title" aria-label="${t => t.dateFormatter.getDate(`${t.month}-2-${t.year}`, {
        month: "long",
        year: "numeric"
    })}"><span part="month">${t => t.dateFormatter.getMonth(t.month)}</span><span part="year">${t => t.dateFormatter.getYear(t.year)}</span></div>`,
    Vi = (t, e) => {
        const i = t.tagFor(Fi);
        return _`<${i} class="week" part="week" role="row" role-type="default" grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr">${Pt(t => t, ((t, e) => {
            const i = t.tagFor(Oi);
            return _`<${i} class="${(t, i) => i.parentContext.parent.getDayClassNames(t, e)}" part="day" tabindex="-1" role="gridcell" grid-column="${(t, e) => e.index + 1}" @click="${(t, e) => e.parentContext.parent.handleDateSelect(e.event, t)}" @keydown="${(t, e) => e.parentContext.parent.handleKeydown(e.event, t)}" aria-label="${(t, e) => e.parentContext.parent.dateFormatter.getDate(`${t.month}-${t.day}-${t.year}`, {
                month: "long",
                day: "numeric"
            })}"><div class="date" part="${t => e === `${t.month}-${t.day}-${t.year}` ? "today" : "date"}">${(t, e) => e.parentContext.parent.dateFormatter.getDay(t.day)}</div><slot name="${t => t.month}-${t => t.day}-${t => t.year}"></slot></${i}>`
        })(t, e), {positioning: !0})}</${i}>`
    }, Ri = (t, e) => {
        const i = t.tagFor(Di), o = t.tagFor(Fi);
        return _`<${i} class="days interact" part="days" generate-header="none"><${o} class="week-days" part="week-days" role="row" row-type="header" grid-template-columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr">${Pt(t => t.getWeekdayText(), (t => {
            const e = t.tagFor(Oi);
            return _`<${e} class="week-day" part="week-day" tabindex="-1" grid-column="${(t, e) => e.index + 1}" abbr="${t => t.abbr}">${t => t.text}</${e}>`
        })(t), {positioning: !0})}</${o}>${Pt(t => t.getDays(), Vi(t, e))}</${i}>`
    };

class Ai extends Ee {
}

class Li extends Ee {
}

class Pi extends (hi(Li)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("input")
    }
}

class zi extends Pi {
    constructor() {
        super(), this.initialValue = "on", this.indeterminate = !1, this.keypressHandler = t => {
            if (!this.readOnly) switch (t.key) {
                case" ":
                    this.indeterminate && (this.indeterminate = !1), this.checked = !this.checked
            }
        }, this.clickHandler = t => {
            this.disabled || this.readOnly || (this.indeterminate && (this.indeterminate = !1), this.checked = !this.checked)
        }, this.proxy.setAttribute("type", "checkbox")
    }

    readOnlyChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly)
    }
}

function Hi(t) {
    return He(t) && ("option" === t.getAttribute("role") || t instanceof HTMLOptionElement)
}

Kt([st({
    attribute: "readonly",
    mode: "boolean"
})], zi.prototype, "readOnly", void 0), Kt([f], zi.prototype, "defaultSlottedNodes", void 0), Kt([f], zi.prototype, "indeterminate", void 0);

class Mi extends Ee {
    constructor(t, e, i, o) {
        super(), this.defaultSelected = !1, this.dirtySelected = !1, this.selected = this.defaultSelected, this.dirtyValue = !1, t && (this.textContent = t), e && (this.initialValue = e), i && (this.defaultSelected = i), o && (this.selected = o), this.proxy = new Option("" + this.textContent, this.initialValue, this.defaultSelected, this.selected), this.proxy.disabled = this.disabled
    }

    checkedChanged(t, e) {
        this.ariaChecked = "boolean" != typeof e ? null : e ? "true" : "false"
    }

    contentChanged(t, e) {
        this.proxy instanceof HTMLOptionElement && (this.proxy.textContent = this.textContent), this.$emit("contentchange", null, {bubbles: !0})
    }

    defaultSelectedChanged() {
        this.dirtySelected || (this.selected = this.defaultSelected, this.proxy instanceof HTMLOptionElement && (this.proxy.selected = this.defaultSelected))
    }

    disabledChanged(t, e) {
        this.ariaDisabled = this.disabled ? "true" : "false", this.proxy instanceof HTMLOptionElement && (this.proxy.disabled = this.disabled)
    }

    selectedAttributeChanged() {
        this.defaultSelected = this.selectedAttribute, this.proxy instanceof HTMLOptionElement && (this.proxy.defaultSelected = this.defaultSelected)
    }

    selectedChanged() {
        this.ariaSelected = this.selected ? "true" : "false", this.dirtySelected || (this.dirtySelected = !0), this.proxy instanceof HTMLOptionElement && (this.proxy.selected = this.selected)
    }

    initialValueChanged(t, e) {
        this.dirtyValue || (this.value = this.initialValue, this.dirtyValue = !1)
    }

    get label() {
        var t;
        return null !== (t = this.value) && void 0 !== t ? t : this.text
    }

    get text() {
        var t, e;
        return null !== (e = null === (t = this.textContent) || void 0 === t ? void 0 : t.replace(/\s+/g, " ").trim()) && void 0 !== e ? e : ""
    }

    set value(t) {
        const e = "" + (null != t ? t : "");
        this._value = e, this.dirtyValue = !0, this.proxy instanceof HTMLOptionElement && (this.proxy.value = e), g.notify(this, "value")
    }

    get value() {
        var t;
        return g.track(this, "value"), null !== (t = this._value) && void 0 !== t ? t : this.text
    }

    get form() {
        return this.proxy ? this.proxy.form : null
    }
}

Kt([f], Mi.prototype, "checked", void 0), Kt([f], Mi.prototype, "content", void 0), Kt([f], Mi.prototype, "defaultSelected", void 0), Kt([st({mode: "boolean"})], Mi.prototype, "disabled", void 0), Kt([st({
    attribute: "selected",
    mode: "boolean"
})], Mi.prototype, "selectedAttribute", void 0), Kt([f], Mi.prototype, "selected", void 0), Kt([st({
    attribute: "value",
    mode: "fromView"
})], Mi.prototype, "initialValue", void 0);

class Bi {
}

Kt([f], Bi.prototype, "ariaChecked", void 0), Kt([f], Bi.prototype, "ariaPosInSet", void 0), Kt([f], Bi.prototype, "ariaSelected", void 0), Kt([f], Bi.prototype, "ariaSetSize", void 0), Ae(Bi, Je), Ae(Mi, Ut, Bi);

class Ni extends Ee {
    constructor() {
        super(...arguments), this._options = [], this.selectedIndex = -1, this.selectedOptions = [], this.shouldSkipFocus = !1, this.typeaheadBuffer = "", this.typeaheadExpired = !0, this.typeaheadTimeout = -1
    }

    get firstSelectedOption() {
        var t;
        return null !== (t = this.selectedOptions[0]) && void 0 !== t ? t : null
    }

    get hasSelectableOptions() {
        return this.options.length > 0 && !this.options.every(t => t.disabled)
    }

    get length() {
        var t, e;
        return null !== (e = null === (t = this.options) || void 0 === t ? void 0 : t.length) && void 0 !== e ? e : 0
    }

    get options() {
        return g.track(this, "options"), this._options
    }

    set options(t) {
        this._options = t, g.notify(this, "options")
    }

    get typeAheadExpired() {
        return this.typeaheadExpired
    }

    set typeAheadExpired(t) {
        this.typeaheadExpired = t
    }

    clickHandler(t) {
        const e = t.target.closest("option,[role=option]");
        if (e && !e.disabled) return this.selectedIndex = this.options.indexOf(e), !0
    }

    focusAndScrollOptionIntoView(t = this.firstSelectedOption) {
        this.contains(document.activeElement) && null !== t && (t.focus(), requestAnimationFrame(() => {
            t.scrollIntoView({block: "nearest"})
        }))
    }

    focusinHandler(t) {
        this.shouldSkipFocus || t.target !== t.currentTarget || (this.setSelectedOptions(), this.focusAndScrollOptionIntoView()), this.shouldSkipFocus = !1
    }

    getTypeaheadMatches() {
        const t = this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), e = new RegExp("^" + t, "gi");
        return this.options.filter(t => t.text.trim().match(e))
    }

    getSelectableIndex(t = this.selectedIndex, e) {
        const i = t > e ? -1 : t < e ? 1 : 0, o = t + i;
        let s = null;
        switch (i) {
            case-1:
                s = this.options.reduceRight((t, e, i) => !t && !e.disabled && i < o ? e : t, s);
                break;
            case 1:
                s = this.options.reduce((t, e, i) => !t && !e.disabled && i > o ? e : t, s)
        }
        return this.options.indexOf(s)
    }

    handleChange(t, e) {
        switch (e) {
            case"selected":
                Ni.slottedOptionFilter(t) && (this.selectedIndex = this.options.indexOf(t)), this.setSelectedOptions()
        }
    }

    handleTypeAhead(t) {
        this.typeaheadTimeout && window.clearTimeout(this.typeaheadTimeout), this.typeaheadTimeout = window.setTimeout(() => this.typeaheadExpired = !0, Ni.TYPE_AHEAD_TIMEOUT_MS), t.length > 1 || (this.typeaheadBuffer = `${this.typeaheadExpired ? "" : this.typeaheadBuffer}${t}`)
    }

    keydownHandler(t) {
        if (this.disabled) return !0;
        this.shouldSkipFocus = !1;
        const e = t.key;
        switch (e) {
            case"Home":
                t.shiftKey || (t.preventDefault(), this.selectFirstOption());
                break;
            case"ArrowDown":
                t.shiftKey || (t.preventDefault(), this.selectNextOption());
                break;
            case"ArrowUp":
                t.shiftKey || (t.preventDefault(), this.selectPreviousOption());
                break;
            case"End":
                t.preventDefault(), this.selectLastOption();
                break;
            case"Tab":
                return this.focusAndScrollOptionIntoView(), !0;
            case"Enter":
            case"Escape":
                return !0;
            case" ":
                if (this.typeaheadExpired) return !0;
            default:
                return 1 === e.length && this.handleTypeAhead("" + e), !0
        }
    }

    mousedownHandler(t) {
        return this.shouldSkipFocus = !this.contains(document.activeElement), !0
    }

    multipleChanged(t, e) {
        this.ariaMultiSelectable = e ? "true" : null
    }

    selectedIndexChanged(t, e) {
        var i;
        if (this.hasSelectableOptions) {
            if ((null === (i = this.options[this.selectedIndex]) || void 0 === i ? void 0 : i.disabled) && "number" == typeof t) {
                const i = this.getSelectableIndex(t, e), o = i > -1 ? i : t;
                return this.selectedIndex = o, void (e === o && this.selectedIndexChanged(e, o))
            }
            this.setSelectedOptions()
        } else this.selectedIndex = -1
    }

    selectedOptionsChanged(t, e) {
        var i;
        const o = e.filter(Ni.slottedOptionFilter);
        null === (i = this.options) || void 0 === i || i.forEach(t => {
            const e = g.getNotifier(t);
            e.unsubscribe(this, "selected"), t.selected = o.includes(t), e.subscribe(this, "selected")
        })
    }

    selectFirstOption() {
        var t, e;
        this.disabled || (this.selectedIndex = null !== (e = null === (t = this.options) || void 0 === t ? void 0 : t.findIndex(t => !t.disabled)) && void 0 !== e ? e : -1)
    }

    selectLastOption() {
        this.disabled || (this.selectedIndex = function (t, e) {
            let i = t.length;
            for (; i--;) if (e(t[i], i, t)) return i;
            return -1
        }(this.options, t => !t.disabled))
    }

    selectNextOption() {
        !this.disabled && this.selectedIndex < this.options.length - 1 && (this.selectedIndex += 1)
    }

    selectPreviousOption() {
        !this.disabled && this.selectedIndex > 0 && (this.selectedIndex = this.selectedIndex - 1)
    }

    setDefaultSelectedOption() {
        var t, e;
        this.selectedIndex = null !== (e = null === (t = this.options) || void 0 === t ? void 0 : t.findIndex(t => t.defaultSelected)) && void 0 !== e ? e : -1
    }

    setSelectedOptions() {
        var t, e, i;
        (null === (t = this.options) || void 0 === t ? void 0 : t.length) && (this.selectedOptions = [this.options[this.selectedIndex]], this.ariaActiveDescendant = null !== (i = null === (e = this.firstSelectedOption) || void 0 === e ? void 0 : e.id) && void 0 !== i ? i : "", this.focusAndScrollOptionIntoView())
    }

    slottedOptionsChanged(t, e) {
        this.options = e.reduce((t, e) => (Hi(e) && t.push(e), t), []);
        const i = "" + this.options.length;
        this.options.forEach((t, e) => {
            t.id || (t.id = We("option-")), t.ariaPosInSet = "" + (e + 1), t.ariaSetSize = i
        }), this.$fastController.isConnected && (this.setSelectedOptions(), this.setDefaultSelectedOption())
    }

    typeaheadBufferChanged(t, e) {
        if (this.$fastController.isConnected) {
            const t = this.getTypeaheadMatches();
            if (t.length) {
                const e = this.options.indexOf(t[0]);
                e > -1 && (this.selectedIndex = e)
            }
            this.typeaheadExpired = !1
        }
    }
}

Ni.slottedOptionFilter = t => Hi(t) && !t.hidden, Ni.TYPE_AHEAD_TIMEOUT_MS = 1e3, Kt([st({mode: "boolean"})], Ni.prototype, "disabled", void 0), Kt([f], Ni.prototype, "selectedIndex", void 0), Kt([f], Ni.prototype, "selectedOptions", void 0), Kt([f], Ni.prototype, "slottedOptions", void 0), Kt([f], Ni.prototype, "typeaheadBuffer", void 0);

class ji {
}

Kt([f], ji.prototype, "ariaActiveDescendant", void 0), Kt([f], ji.prototype, "ariaDisabled", void 0), Kt([f], ji.prototype, "ariaExpanded", void 0), Kt([f], ji.prototype, "ariaMultiSelectable", void 0), Ae(ji, Je), Ae(Ni, ji);
const Ui = "above", qi = "below";

class _i extends Ni {
}

class Gi extends (ci(_i)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("input")
    }
}

const Wi = "inline", Ki = "list", Xi = "both", Yi = "none";

class Qi extends Gi {
    constructor() {
        super(...arguments), this._value = "", this.filteredOptions = [], this.filter = "", this.forcedPosition = !1, this.listboxId = We("listbox-"), this.maxHeight = 0, this.open = !1
    }

    formResetCallback() {
        super.formResetCallback(), this.setDefaultSelectedOption(), this.updateValue()
    }

    validate() {
        super.validate(this.control)
    }

    get isAutocompleteInline() {
        return this.autocomplete === Wi || this.isAutocompleteBoth
    }

    get isAutocompleteList() {
        return this.autocomplete === Ki || this.isAutocompleteBoth
    }

    get isAutocompleteBoth() {
        return this.autocomplete === Xi
    }

    openChanged() {
        if (this.open) return this.ariaControls = this.listboxId, this.ariaExpanded = "true", this.setPositioning(), this.focusAndScrollOptionIntoView(), void d.queueUpdate(() => this.focus());
        this.ariaControls = "", this.ariaExpanded = "false"
    }

    get options() {
        return g.track(this, "options"), this.filteredOptions.length ? this.filteredOptions : this._options
    }

    set options(t) {
        this._options = t, g.notify(this, "options")
    }

    placeholderChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.placeholder = this.placeholder)
    }

    positionChanged(t, e) {
        this.positionAttribute = e, this.setPositioning()
    }

    get value() {
        return g.track(this, "value"), this._value
    }

    set value(t) {
        var e, i, o;
        const s = "" + this._value;
        if (this.$fastController.isConnected && this.options) {
            const s = this.options.findIndex(e => e.text.toLowerCase() === t.toLowerCase()),
                n = null === (e = this.options[this.selectedIndex]) || void 0 === e ? void 0 : e.text,
                r = null === (i = this.options[s]) || void 0 === i ? void 0 : i.text;
            this.selectedIndex = n !== r ? s : this.selectedIndex, t = (null === (o = this.firstSelectedOption) || void 0 === o ? void 0 : o.text) || t
        }
        s !== t && (this._value = t, super.valueChanged(s, t), g.notify(this, "value"))
    }

    clickHandler(t) {
        if (!this.disabled) {
            if (this.open) {
                const e = t.target.closest("option,[role=option]");
                if (!e || e.disabled) return;
                this.selectedOptions = [e], this.control.value = e.text, this.clearSelectionRange(), this.updateValue(!0)
            }
            return this.open = !this.open, this.open && this.control.focus(), !0
        }
    }

    connectedCallback() {
        super.connectedCallback(), this.forcedPosition = !!this.positionAttribute, this.value && (this.initialValue = this.value)
    }

    disabledChanged(t, e) {
        super.disabledChanged && super.disabledChanged(t, e), this.ariaDisabled = this.disabled ? "true" : "false"
    }

    filterOptions() {
        this.autocomplete && this.autocomplete !== Yi || (this.filter = "");
        const t = this.filter.toLowerCase();
        this.filteredOptions = this._options.filter(t => t.text.toLowerCase().startsWith(this.filter.toLowerCase())), this.isAutocompleteList && (this.filteredOptions.length || t || (this.filteredOptions = this._options), this._options.forEach(t => {
            t.hidden = !this.filteredOptions.includes(t)
        }))
    }

    focusAndScrollOptionIntoView() {
        this.contains(document.activeElement) && (this.control.focus(), this.firstSelectedOption && requestAnimationFrame(() => {
            var t;
            null === (t = this.firstSelectedOption) || void 0 === t || t.scrollIntoView({block: "nearest"})
        }))
    }

    focusoutHandler(t) {
        if (this.syncValue(), !this.open) return !0;
        const e = t.relatedTarget;
        this.isSameNode(e) ? this.focus() : this.options && this.options.includes(e) || (this.open = !1)
    }

    inputHandler(t) {
        if (this.filter = this.control.value, this.filterOptions(), this.isAutocompleteInline || (this.selectedIndex = this.options.map(t => t.text).indexOf(this.control.value)), t.inputType.includes("deleteContent") || !this.filter.length) return !0;
        this.isAutocompleteList && !this.open && (this.open = !0), this.isAutocompleteInline && (this.filteredOptions.length ? (this.selectedOptions = [this.filteredOptions[0]], this.selectedIndex = this.options.indexOf(this.firstSelectedOption), this.setInlineSelection()) : this.selectedIndex = -1)
    }

    keydownHandler(t) {
        const e = t.key;
        if (t.ctrlKey || t.shiftKey) return !0;
        switch (e) {
            case"Enter":
                this.syncValue(), this.isAutocompleteInline && (this.filter = this.value), this.open = !1, this.clearSelectionRange();
                break;
            case"Escape":
                if (this.isAutocompleteInline || (this.selectedIndex = -1), this.open) {
                    this.open = !1;
                    break
                }
                this.value = "", this.control.value = "", this.filter = "", this.filterOptions();
                break;
            case"Tab":
                if (this.setInputToSelection(), !this.open) return !0;
                t.preventDefault(), this.open = !1;
                break;
            case"ArrowUp":
            case"ArrowDown":
                if (this.filterOptions(), !this.open) {
                    this.open = !0;
                    break
                }
                this.filteredOptions.length > 0 && super.keydownHandler(t), this.isAutocompleteInline && this.setInlineSelection();
                break;
            default:
                return !0
        }
    }

    keyupHandler(t) {
        switch (t.key) {
            case"ArrowLeft":
            case"ArrowRight":
            case"Backspace":
            case"Delete":
            case"Home":
            case"End":
                this.filter = this.control.value, this.selectedIndex = -1, this.filterOptions()
        }
    }

    selectedIndexChanged(t, e) {
        if (this.$fastController.isConnected) {
            if ((e = qe(-1, this.options.length - 1, e)) !== this.selectedIndex) return void (this.selectedIndex = e);
            super.selectedIndexChanged(t, e)
        }
    }

    selectPreviousOption() {
        !this.disabled && this.selectedIndex >= 0 && (this.selectedIndex = this.selectedIndex - 1)
    }

    setDefaultSelectedOption() {
        if (this.$fastController.isConnected && this.options) {
            const t = this.options.findIndex(t => null !== t.getAttribute("selected") || t.selected);
            this.selectedIndex = t, !this.dirtyValue && this.firstSelectedOption && (this.value = this.firstSelectedOption.text), this.setSelectedOptions()
        }
    }

    setInputToSelection() {
        this.firstSelectedOption && (this.control.value = this.firstSelectedOption.text, this.control.focus())
    }

    setInlineSelection() {
        this.firstSelectedOption && (this.setInputToSelection(), this.control.setSelectionRange(this.filter.length, this.control.value.length, "backward"))
    }

    syncValue() {
        var t;
        const e = this.selectedIndex > -1 ? null === (t = this.firstSelectedOption) || void 0 === t ? void 0 : t.text : this.control.value;
        this.updateValue(this.value !== e)
    }

    setPositioning() {
        const t = this.getBoundingClientRect(), e = window.innerHeight - t.bottom;
        this.position = this.forcedPosition ? this.positionAttribute : t.top > e ? Ui : qi, this.positionAttribute = this.forcedPosition ? this.positionAttribute : this.position, this.maxHeight = this.position === Ui ? ~~t.top : ~~e
    }

    selectedOptionsChanged(t, e) {
        this.$fastController.isConnected && this._options.forEach(t => {
            t.selected = e.includes(t)
        })
    }

    slottedOptionsChanged(t, e) {
        super.slottedOptionsChanged(t, e), this.updateValue()
    }

    updateValue(t) {
        var e;
        this.$fastController.isConnected && (this.value = (null === (e = this.firstSelectedOption) || void 0 === e ? void 0 : e.text) || this.control.value, this.control.value = this.value), t && this.$emit("change")
    }

    clearSelectionRange() {
        const t = this.control.value.length;
        this.control.setSelectionRange(t, t)
    }
}

Kt([st({
    attribute: "autocomplete",
    mode: "fromView"
})], Qi.prototype, "autocomplete", void 0), Kt([f], Qi.prototype, "maxHeight", void 0), Kt([st({
    attribute: "open",
    mode: "boolean"
})], Qi.prototype, "open", void 0), Kt([st], Qi.prototype, "placeholder", void 0), Kt([st({attribute: "position"})], Qi.prototype, "positionAttribute", void 0), Kt([f], Qi.prototype, "position", void 0);

class Zi {
}

Kt([f], Zi.prototype, "ariaAutoComplete", void 0), Kt([f], Zi.prototype, "ariaControls", void 0), Ae(Zi, ji), Ae(Qi, Ut, Zi);

function Ji(t) {
    const e = t.parentElement;
    if (e) return e;
    {
        const e = t.getRootNode();
        if (e.host instanceof HTMLElement) return e.host
    }
    return null
}

const to = document.createElement("div");

class eo {
    setProperty(t, e) {
        d.queueUpdate(() => this.target.setProperty(t, e))
    }

    removeProperty(t) {
        d.queueUpdate(() => this.target.removeProperty(t))
    }
}

class io extends eo {
    constructor() {
        super();
        const t = new CSSStyleSheet;
        this.target = t.cssRules[t.insertRule(":root{}")].style, document.adoptedStyleSheets = [...document.adoptedStyleSheets, t]
    }
}

class oo extends eo {
    constructor() {
        super(), this.style = document.createElement("style"), document.head.appendChild(this.style);
        const {sheet: t} = this.style;
        if (t) {
            const e = t.insertRule(":root{}", t.cssRules.length);
            this.target = t.cssRules[e].style
        }
    }
}

class so {
    constructor(t) {
        this.store = new Map, this.target = null;
        const e = t.$fastController;
        this.style = document.createElement("style"), e.addStyles(this.style), g.getNotifier(e).subscribe(this, "isConnected"), this.handleChange(e, "isConnected")
    }

    targetChanged() {
        if (null !== this.target) for (const [t, e] of this.store.entries()) this.target.setProperty(t, e)
    }

    setProperty(t, e) {
        this.store.set(t, e), d.queueUpdate(() => {
            null !== this.target && this.target.setProperty(t, e)
        })
    }

    removeProperty(t) {
        this.store.delete(t), d.queueUpdate(() => {
            null !== this.target && this.target.removeProperty(t)
        })
    }

    handleChange(t, e) {
        const {sheet: i} = this.style;
        if (i) {
            const t = i.insertRule(":host{}", i.cssRules.length);
            this.target = i.cssRules[t].style
        } else this.target = null
    }
}

Kt([f], so.prototype, "target", void 0);

class no {
    constructor(t) {
        this.target = t.style
    }

    setProperty(t, e) {
        d.queueUpdate(() => this.target.setProperty(t, e))
    }

    removeProperty(t) {
        d.queueUpdate(() => this.target.removeProperty(t))
    }
}

class ro {
    setProperty(t, e) {
        ro.properties[t] = e;
        for (const i of ro.roots.values()) co.getOrCreate(ro.normalizeRoot(i)).setProperty(t, e)
    }

    removeProperty(t) {
        delete ro.properties[t];
        for (const e of ro.roots.values()) co.getOrCreate(ro.normalizeRoot(e)).removeProperty(t)
    }

    static registerRoot(t) {
        const {roots: e} = ro;
        if (!e.has(t)) {
            e.add(t);
            const i = co.getOrCreate(this.normalizeRoot(t));
            for (const t in ro.properties) i.setProperty(t, ro.properties[t])
        }
    }

    static unregisterRoot(t) {
        const {roots: e} = ro;
        if (e.has(t)) {
            e.delete(t);
            const i = co.getOrCreate(ro.normalizeRoot(t));
            for (const t in ro.properties) i.removeProperty(t)
        }
    }

    static normalizeRoot(t) {
        return t === to ? document : t
    }
}

ro.roots = new Set, ro.properties = {};
const ao = new WeakMap, lo = d.supportsAdoptedStyleSheets ? class extends eo {
    constructor(t) {
        super();
        const e = new CSSStyleSheet;
        this.target = e.cssRules[e.insertRule(":host{}")].style, t.$fastController.addStyles(G.create([e]))
    }
} : so, co = Object.freeze({
    getOrCreate(t) {
        if (ao.has(t)) return ao.get(t);
        let e;
        return t === to ? e = new ro : t instanceof Document ? e = d.supportsAdoptedStyleSheets ? new io : new oo : e = t instanceof gt ? new lo(t) : new no(t), ao.set(t, e), e
    }
});

class ho extends ft {
    constructor(t) {
        super(), this.subscribers = new WeakMap, this._appliedTo = new Set, this.name = t.name, null !== t.cssCustomPropertyName && (this.cssCustomProperty = "--" + t.cssCustomPropertyName, this.cssVar = `var(${this.cssCustomProperty})`), this.id = ho.uniqueId(), ho.tokensById.set(this.id, this)
    }

    get appliedTo() {
        return [...this._appliedTo]
    }

    static from(t) {
        return new ho({
            name: "string" == typeof t ? t : t.name,
            cssCustomPropertyName: "string" == typeof t ? t : void 0 === t.cssCustomPropertyName ? t.name : t.cssCustomPropertyName
        })
    }

    static isCSSDesignToken(t) {
        return "string" == typeof t.cssCustomProperty
    }

    static isDerivedDesignTokenValue(t) {
        return "function" == typeof t
    }

    static getTokenById(t) {
        return ho.tokensById.get(t)
    }

    getOrCreateSubscriberSet(t = this) {
        return this.subscribers.get(t) || this.subscribers.set(t, new Set) && this.subscribers.get(t)
    }

    createCSS() {
        return this.cssVar || ""
    }

    getValueFor(t) {
        const e = mo.getOrCreate(t).get(this);
        if (void 0 !== e) return e;
        throw new Error(`Value could not be retrieved for token named "${this.name}". Ensure the value is set for ${t} or an ancestor of ${t}.`)
    }

    setValueFor(t, e) {
        return this._appliedTo.add(t), e instanceof ho && (e = this.alias(e)), mo.getOrCreate(t).set(this, e), this
    }

    deleteValueFor(t) {
        return this._appliedTo.delete(t), mo.existsFor(t) && mo.getOrCreate(t).delete(this), this
    }

    withDefault(t) {
        return this.setValueFor(to, t), this
    }

    subscribe(t, e) {
        const i = this.getOrCreateSubscriberSet(e);
        e && !mo.existsFor(e) && mo.getOrCreate(e), i.has(t) || i.add(t)
    }

    unsubscribe(t, e) {
        const i = this.subscribers.get(e || this);
        i && i.has(t) && i.delete(t)
    }

    notify(t) {
        const e = Object.freeze({token: this, target: t});
        this.subscribers.has(this) && this.subscribers.get(this).forEach(t => t.handleChange(e)), this.subscribers.has(t) && this.subscribers.get(t).forEach(t => t.handleChange(e))
    }

    alias(t) {
        return e => t.getValueFor(e)
    }
}

ho.uniqueId = (() => {
    let t = 0;
    return () => (t++, t.toString(16))
})(), ho.tokensById = new Map;

class uo {
    constructor(t, e, i) {
        this.source = t, this.token = e, this.node = i, this.dependencies = new Set, this.observer = g.binding(t, this, !1), this.observer.handleChange = this.observer.call, this.handleChange()
    }

    disconnect() {
        this.observer.disconnect()
    }

    handleChange() {
        this.node.store.set(this.token, this.observer.observe(this.node.target, b))
    }
}

class po {
    constructor() {
        this.values = new Map
    }

    set(t, e) {
        this.values.get(t) !== e && (this.values.set(t, e), g.getNotifier(this).notify(t.id))
    }

    get(t) {
        return g.track(this, t.id), this.values.get(t)
    }

    delete(t) {
        this.values.delete(t)
    }

    all() {
        return this.values.entries()
    }
}

const go = new WeakMap, fo = new WeakMap;

class mo {
    constructor(t) {
        this.target = t, this.store = new po, this.children = [], this.assignedValues = new Map, this.reflecting = new Set, this.bindingObservers = new Map, this.tokenValueChangeHandler = {
            handleChange: (t, e) => {
                const i = ho.getTokenById(e);
                if (i && (i.notify(this.target), ho.isCSSDesignToken(i))) {
                    const e = this.parent, o = this.isReflecting(i);
                    if (e) {
                        const s = e.get(i), n = t.get(i);
                        s === n || o ? s === n && o && this.stopReflectToCSS(i) : this.reflectToCSS(i)
                    } else o || this.reflectToCSS(i)
                }
            }
        }, go.set(t, this), g.getNotifier(this.store).subscribe(this.tokenValueChangeHandler), t instanceof gt ? t.$fastController.addBehaviors([this]) : t.isConnected && this.bind()
    }

    static getOrCreate(t) {
        return go.get(t) || new mo(t)
    }

    static existsFor(t) {
        return go.has(t)
    }

    static findParent(t) {
        if (to !== t.target) {
            let e = Ji(t.target);
            for (; null !== e;) {
                if (go.has(e)) return go.get(e);
                e = Ji(e)
            }
            return mo.getOrCreate(to)
        }
        return null
    }

    static findClosestAssignedNode(t, e) {
        let i = e;
        do {
            if (i.has(t)) return i;
            i = i.parent ? i.parent : i.target !== to ? mo.getOrCreate(to) : null
        } while (null !== i);
        return null
    }

    get parent() {
        return fo.get(this) || null
    }

    has(t) {
        return this.assignedValues.has(t)
    }

    get(t) {
        const e = this.store.get(t);
        if (void 0 !== e) return e;
        const i = this.getRaw(t);
        return void 0 !== i ? (this.hydrate(t, i), this.get(t)) : void 0
    }

    getRaw(t) {
        var e;
        return this.assignedValues.has(t) ? this.assignedValues.get(t) : null === (e = mo.findClosestAssignedNode(t, this)) || void 0 === e ? void 0 : e.getRaw(t)
    }

    set(t, e) {
        ho.isDerivedDesignTokenValue(this.assignedValues.get(t)) && this.tearDownBindingObserver(t), this.assignedValues.set(t, e), ho.isDerivedDesignTokenValue(e) ? this.setupBindingObserver(t, e) : this.store.set(t, e)
    }

    delete(t) {
        this.assignedValues.delete(t), this.tearDownBindingObserver(t);
        const e = this.getRaw(t);
        e ? this.hydrate(t, e) : this.store.delete(t)
    }

    bind() {
        const t = mo.findParent(this);
        t && t.appendChild(this);
        for (const t of this.assignedValues.keys()) t.notify(this.target)
    }

    unbind() {
        if (this.parent) {
            fo.get(this).removeChild(this)
        }
    }

    appendChild(t) {
        t.parent && fo.get(t).removeChild(t);
        const e = this.children.filter(e => t.contains(e));
        fo.set(t, this), this.children.push(t), e.forEach(e => t.appendChild(e)), g.getNotifier(this.store).subscribe(t);
        for (const [e, i] of this.store.all()) t.hydrate(e, this.bindingObservers.has(e) ? this.getRaw(e) : i)
    }

    removeChild(t) {
        const e = this.children.indexOf(t);
        return -1 !== e && this.children.splice(e, 1), g.getNotifier(this.store).unsubscribe(t), t.parent === this && fo.delete(t)
    }

    contains(t) {
        return function (t, e) {
            let i = e;
            for (; null !== i;) {
                if (i === t) return !0;
                i = Ji(i)
            }
            return !1
        }(this.target, t.target)
    }

    reflectToCSS(t) {
        this.isReflecting(t) || (this.reflecting.add(t), mo.cssCustomPropertyReflector.startReflection(t, this.target))
    }

    stopReflectToCSS(t) {
        this.isReflecting(t) && (this.reflecting.delete(t), mo.cssCustomPropertyReflector.stopReflection(t, this.target))
    }

    isReflecting(t) {
        return this.reflecting.has(t)
    }

    handleChange(t, e) {
        const i = ho.getTokenById(e);
        i && this.hydrate(i, this.getRaw(i))
    }

    hydrate(t, e) {
        if (!this.has(t)) {
            const i = this.bindingObservers.get(t);
            ho.isDerivedDesignTokenValue(e) ? i ? i.source !== e && (this.tearDownBindingObserver(t), this.setupBindingObserver(t, e)) : this.setupBindingObserver(t, e) : (i && this.tearDownBindingObserver(t), this.store.set(t, e))
        }
    }

    setupBindingObserver(t, e) {
        const i = new uo(e, t, this);
        return this.bindingObservers.set(t, i), i
    }

    tearDownBindingObserver(t) {
        return !!this.bindingObservers.has(t) && (this.bindingObservers.get(t).disconnect(), this.bindingObservers.delete(t), !0)
    }
}

mo.cssCustomPropertyReflector = new class {
    startReflection(t, e) {
        t.subscribe(this, e), this.handleChange({token: t, target: e})
    }

    stopReflection(t, e) {
        t.unsubscribe(this, e), this.remove(t, e)
    }

    handleChange(t) {
        const {token: e, target: i} = t;
        this.add(e, i)
    }

    add(t, e) {
        co.getOrCreate(e).setProperty(t.cssCustomProperty, this.resolveCSSValue(mo.getOrCreate(e).get(t)))
    }

    remove(t, e) {
        co.getOrCreate(e).removeProperty(t.cssCustomProperty)
    }

    resolveCSSValue(t) {
        return t && "function" == typeof t.createCSS ? t.createCSS() : t
    }
}, Kt([f], mo.prototype, "children", void 0);
const vo = Object.freeze({
    create: function (t) {
        return ho.from(t)
    },
    notifyConnection: t => !(!t.isConnected || !mo.existsFor(t)) && (mo.getOrCreate(t).bind(), !0),
    notifyDisconnection: t => !(t.isConnected || !mo.existsFor(t)) && (mo.getOrCreate(t).unbind(), !0),
    registerRoot(t = to) {
        ro.registerRoot(t)
    },
    unregisterRoot(t = to) {
        ro.unregisterRoot(t)
    }
}), bo = Object.freeze({definitionCallbackOnly: null, ignoreDuplicate: Symbol()}), yo = new Map, xo = new Map;
let $o = null;
const wo = oe.createInterface(t => t.cachedCallback(t => (null === $o && ($o = new Co(null, t)), $o))),
    ko = Object.freeze({
        tagFor: t => xo.get(t), responsibleFor(t) {
            const e = t.$$designSystem$$;
            if (e) return e;
            return oe.findResponsibleContainer(t).get(wo)
        }, getOrCreate(t) {
            if (!t) return null === $o && ($o = oe.getOrCreateDOMContainer().get(wo)), $o;
            const e = t.$$designSystem$$;
            if (e) return e;
            const i = oe.getOrCreateDOMContainer(t);
            if (i.has(wo, !1)) return i.get(wo);
            {
                const e = new Co(t, i);
                return i.register(ye.instance(wo, e)), e
            }
        }
    });

class Co {
    constructor(t, e) {
        this.owner = t, this.container = e, this.designTokensInitialized = !1, this.prefix = "fast", this.shadowRootMode = void 0, this.disambiguate = () => bo.definitionCallbackOnly, null !== t && (t.$$designSystem$$ = this)
    }

    withPrefix(t) {
        return this.prefix = t, this
    }

    withShadowRootMode(t) {
        return this.shadowRootMode = t, this
    }

    withElementDisambiguation(t) {
        return this.disambiguate = t, this
    }

    withDesignTokenRoot(t) {
        return this.designTokenRoot = t, this
    }

    register(...t) {
        const e = this.container, i = [], o = this.disambiguate, s = this.shadowRootMode, n = {
            elementPrefix: this.prefix, tryDefineElement(t, n, r) {
                const a = function (t, e, i) {
                    return "string" == typeof t ? {name: t, type: e, callback: i} : t
                }(t, n, r), {name: l, callback: c, baseClass: h} = a;
                let {type: d} = a, u = l, p = yo.get(u), g = !0;
                for (; p;) {
                    const t = o(u, d, p);
                    switch (t) {
                        case bo.ignoreDuplicate:
                            return;
                        case bo.definitionCallbackOnly:
                            g = !1, p = void 0;
                            break;
                        default:
                            u = t, p = yo.get(u)
                    }
                }
                g && ((xo.has(d) || d === Ee) && (d = class extends d {
                }), yo.set(u, d), xo.set(d, u), h && xo.set(h, u)), i.push(new Io(e, u, d, s, c, g))
            }
        };
        this.designTokensInitialized || (this.designTokensInitialized = !0, null !== this.designTokenRoot && vo.registerRoot(this.designTokenRoot)), e.registerWithContext(n, ...t);
        for (const t of i) t.callback(t), t.willDefine && null !== t.definition && t.definition.define();
        return this
    }
}

class Io {
    constructor(t, e, i, o, s, n) {
        this.container = t, this.name = e, this.type = i, this.shadowRootMode = o, this.callback = s, this.willDefine = n, this.definition = null
    }

    definePresentation(t) {
        Se.define(this.name, t, this.container)
    }

    defineElement(t) {
        this.definition = new lt(this.type, Object.assign(Object.assign({}, t), {name: this.name}))
    }

    tagFor(t) {
        return ko.tagFor(t)
    }
}

/*!
* tabbable 5.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var Fo = ["input", "select", "textarea", "a[href]", "button", "[tabindex]", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"],
    Do = Fo.join(","), To = "undefined" == typeof Element ? function () {
    } : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector,
    So = function (t) {
        return "INPUT" === t.tagName
    }, Oo = function (t) {
        return function (t) {
            return So(t) && "radio" === t.type
        }(t) && !function (t) {
            if (!t.name) return !0;
            var e, i = t.form || t.ownerDocument, o = function (t) {
                return i.querySelectorAll('input[type="radio"][name="' + t + '"]')
            };
            if ("undefined" != typeof window && void 0 !== window.CSS && "function" == typeof window.CSS.escape) e = o(window.CSS.escape(t.name)); else try {
                e = o(t.name)
            } catch (t) {
                return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", t.message), !1
            }
            var s = function (t, e) {
                for (var i = 0; i < t.length; i++) if (t[i].checked && t[i].form === e) return t[i]
            }(e, t.form);
            return !s || s === t
        }(t)
    }, Eo = function (t, e) {
        return !(e.disabled || function (t) {
            return So(t) && "hidden" === t.type
        }(e) || function (t, e) {
            if ("hidden" === getComputedStyle(t).visibility) return !0;
            var i = To.call(t, "details>summary:first-of-type") ? t.parentElement : t;
            if (To.call(i, "details:not([open]) *")) return !0;
            if (e && "full" !== e) {
                if ("non-zero-area" === e) {
                    var o = t.getBoundingClientRect(), s = o.width, n = o.height;
                    return 0 === s && 0 === n
                }
            } else for (; t;) {
                if ("none" === getComputedStyle(t).display) return !0;
                t = t.parentElement
            }
            return !1
        }(e, t.displayCheck) || function (t) {
            return "DETAILS" === t.tagName && Array.prototype.slice.apply(t.children).some((function (t) {
                return "SUMMARY" === t.tagName
            }))
        }(e))
    }, Vo = function (t, e) {
        return !(!Eo(t, e) || Oo(e) || function (t) {
            var e = parseInt(t.getAttribute("tabindex"), 10);
            return isNaN(e) ? function (t) {
                return "true" === t.contentEditable
            }(t) ? 0 : "AUDIO" !== t.nodeName && "VIDEO" !== t.nodeName && "DETAILS" !== t.nodeName || null !== t.getAttribute("tabindex") ? t.tabIndex : 0 : e
        }(e) < 0)
    }, Ro = function (t, e) {
        if (e = e || {}, !t) throw new Error("No node provided");
        return !1 !== To.call(t, Do) && Vo(e, t)
    }, Ao = Fo.concat("iframe").join(","), Lo = function (t, e) {
        if (e = e || {}, !t) throw new Error("No node provided");
        return !1 !== To.call(t, Ao) && Eo(e, t)
    };

class Po extends Ee {
    constructor() {
        super(...arguments), this.modal = !0, this.hidden = !1, this.trapFocus = !0, this.trapFocusChanged = () => {
            this.$fastController.isConnected && this.updateTrapFocus()
        }, this.isTrappingFocus = !1, this.handleDocumentKeydown = t => {
            if (!t.defaultPrevented && !this.hidden) switch (t.key) {
                case"Escape":
                    this.dismiss(), t.preventDefault();
                    break;
                case"Tab":
                    this.handleTabKeyDown(t)
            }
        }, this.handleDocumentFocus = t => {
            !t.defaultPrevented && this.shouldForceFocus(t.target) && (this.focusFirstElement(), t.preventDefault())
        }, this.handleTabKeyDown = t => {
            if (!this.trapFocus || this.hidden) return;
            const e = this.getTabQueueBounds();
            return 0 !== e.length ? 1 === e.length ? (e[0].focus(), void t.preventDefault()) : void (t.shiftKey && t.target === e[0] ? (e[e.length - 1].focus(), t.preventDefault()) : t.shiftKey || t.target !== e[e.length - 1] || (e[0].focus(), t.preventDefault())) : void 0
        }, this.getTabQueueBounds = () => Po.reduceTabbableItems([], this), this.focusFirstElement = () => {
            const t = this.getTabQueueBounds();
            t.length > 0 ? t[0].focus() : this.dialog instanceof HTMLElement && this.dialog.focus()
        }, this.shouldForceFocus = t => this.isTrappingFocus && !this.contains(t), this.shouldTrapFocus = () => this.trapFocus && !this.hidden, this.updateTrapFocus = t => {
            const e = void 0 === t ? this.shouldTrapFocus() : t;
            e && !this.isTrappingFocus ? (this.isTrappingFocus = !0, document.addEventListener("focusin", this.handleDocumentFocus), d.queueUpdate(() => {
                this.shouldForceFocus(document.activeElement) && this.focusFirstElement()
            })) : !e && this.isTrappingFocus && (this.isTrappingFocus = !1, document.removeEventListener("focusin", this.handleDocumentFocus))
        }
    }

    dismiss() {
        this.$emit("dismiss"), this.$emit("cancel")
    }

    show() {
        this.hidden = !1
    }

    hide() {
        this.hidden = !0, this.$emit("close")
    }

    connectedCallback() {
        super.connectedCallback(), document.addEventListener("keydown", this.handleDocumentKeydown), this.notifier = g.getNotifier(this), this.notifier.subscribe(this, "hidden"), this.updateTrapFocus()
    }

    disconnectedCallback() {
        super.disconnectedCallback(), document.removeEventListener("keydown", this.handleDocumentKeydown), this.updateTrapFocus(!1), this.notifier.unsubscribe(this, "hidden")
    }

    handleChange(t, e) {
        switch (e) {
            case"hidden":
                this.updateTrapFocus()
        }
    }

    static reduceTabbableItems(t, e) {
        return "-1" === e.getAttribute("tabindex") ? t : Ro(e) || Po.isFocusableFastElement(e) && Po.hasTabbableShadow(e) ? (t.push(e), t) : e.childElementCount ? t.concat(Array.from(e.children).reduce(Po.reduceTabbableItems, [])) : t
    }

    static isFocusableFastElement(t) {
        var e, i;
        return !!(null === (i = null === (e = t.$fastController) || void 0 === e ? void 0 : e.definition.shadowOptions) || void 0 === i ? void 0 : i.delegatesFocus)
    }

    static hasTabbableShadow(t) {
        var e, i;
        return Array.from(null !== (i = null === (e = t.shadowRoot) || void 0 === e ? void 0 : e.querySelectorAll("*")) && void 0 !== i ? i : []).some(t => Ro(t))
    }
}

Kt([st({mode: "boolean"})], Po.prototype, "modal", void 0), Kt([st({mode: "boolean"})], Po.prototype, "hidden", void 0), Kt([st({
    attribute: "trap-focus",
    mode: "boolean"
})], Po.prototype, "trapFocus", void 0), Kt([st({attribute: "aria-describedby"})], Po.prototype, "ariaDescribedby", void 0), Kt([st({attribute: "aria-labelledby"})], Po.prototype, "ariaLabelledby", void 0), Kt([st({attribute: "aria-label"})], Po.prototype, "ariaLabel", void 0);
const zo = "separator";

class Ho extends Ee {
    constructor() {
        super(...arguments), this.role = zo, this.orientation = Pe
    }
}

Kt([st], Ho.prototype, "role", void 0), Kt([st], Ho.prototype, "orientation", void 0);
const Mo = "next", Bo = "previous";

class No extends Ee {
    constructor() {
        super(...arguments), this.hiddenFromAT = !0, this.direction = Mo
    }

    keyupHandler(t) {
        if (!this.hiddenFromAT) {
            const e = t.key;
            "Enter" !== e && "Space" !== e || this.$emit("click", t), "Escape" === e && this.blur()
        }
    }
}

Kt([st({mode: "boolean"})], No.prototype, "disabled", void 0), Kt([st({
    attribute: "aria-hidden",
    converter: et
})], No.prototype, "hiddenFromAT", void 0), Kt([st], No.prototype, "direction", void 0);

class jo extends Ni {
    constructor() {
        super(...arguments), this.activeIndex = -1, this.rangeStartIndex = -1
    }

    get activeOption() {
        return this.options[this.activeIndex]
    }

    get checkedOptions() {
        var t;
        return null === (t = this.options) || void 0 === t ? void 0 : t.filter(t => t.checked)
    }

    get firstSelectedOptionIndex() {
        return this.options.indexOf(this.firstSelectedOption)
    }

    activeIndexChanged(t, e) {
        var i, o;
        this.ariaActiveDescendant = null !== (o = null === (i = this.options[e]) || void 0 === i ? void 0 : i.id) && void 0 !== o ? o : "", this.focusAndScrollOptionIntoView()
    }

    checkActiveIndex() {
        if (!this.multiple) return;
        const t = this.activeOption;
        t && (t.checked = !0)
    }

    checkFirstOption(t = !1) {
        t ? (-1 === this.rangeStartIndex && (this.rangeStartIndex = this.activeIndex + 1), this.options.forEach((t, e) => {
            t.checked = _e(e, this.rangeStartIndex)
        })) : this.uncheckAllOptions(), this.activeIndex = 0, this.checkActiveIndex()
    }

    checkLastOption(t = !1) {
        t ? (-1 === this.rangeStartIndex && (this.rangeStartIndex = this.activeIndex), this.options.forEach((t, e) => {
            t.checked = _e(e, this.rangeStartIndex, this.options.length)
        })) : this.uncheckAllOptions(), this.activeIndex = this.options.length - 1, this.checkActiveIndex()
    }

    connectedCallback() {
        super.connectedCallback(), this.addEventListener("focusout", this.focusoutHandler)
    }

    disconnectedCallback() {
        this.removeEventListener("focusout", this.focusoutHandler), super.disconnectedCallback()
    }

    checkNextOption(t = !1) {
        t ? (-1 === this.rangeStartIndex && (this.rangeStartIndex = this.activeIndex), this.options.forEach((t, e) => {
            t.checked = _e(e, this.rangeStartIndex, this.activeIndex + 1)
        })) : this.uncheckAllOptions(), this.activeIndex += this.activeIndex < this.options.length - 1 ? 1 : 0, this.checkActiveIndex()
    }

    checkPreviousOption(t = !1) {
        t ? (-1 === this.rangeStartIndex && (this.rangeStartIndex = this.activeIndex), 1 === this.checkedOptions.length && (this.rangeStartIndex += 1), this.options.forEach((t, e) => {
            t.checked = _e(e, this.activeIndex, this.rangeStartIndex)
        })) : this.uncheckAllOptions(), this.activeIndex -= this.activeIndex > 0 ? 1 : 0, this.checkActiveIndex()
    }

    clickHandler(t) {
        var e;
        if (!this.multiple) return super.clickHandler(t);
        const i = null === (e = t.target) || void 0 === e ? void 0 : e.closest("[role=option]");
        return i && !i.disabled ? (this.uncheckAllOptions(), this.activeIndex = this.options.indexOf(i), this.checkActiveIndex(), this.toggleSelectedForAllCheckedOptions(), !0) : void 0
    }

    focusAndScrollOptionIntoView() {
        super.focusAndScrollOptionIntoView(this.activeOption)
    }

    focusinHandler(t) {
        if (!this.multiple) return super.focusinHandler(t);
        this.shouldSkipFocus || t.target !== t.currentTarget || (this.uncheckAllOptions(), -1 === this.activeIndex && (this.activeIndex = -1 !== this.firstSelectedOptionIndex ? this.firstSelectedOptionIndex : 0), this.checkActiveIndex(), this.setSelectedOptions(), this.focusAndScrollOptionIntoView()), this.shouldSkipFocus = !1
    }

    focusoutHandler(t) {
        this.multiple && this.uncheckAllOptions()
    }

    keydownHandler(t) {
        if (!this.multiple) return super.keydownHandler(t);
        if (this.disabled) return !0;
        const {key: e, shiftKey: i} = t;
        switch (this.shouldSkipFocus = !1, e) {
            case"Home":
                return void this.checkFirstOption(i);
            case"ArrowDown":
                return void this.checkNextOption(i);
            case"ArrowUp":
                return void this.checkPreviousOption(i);
            case"End":
                return void this.checkLastOption(i);
            case"Tab":
                return this.focusAndScrollOptionIntoView(), !0;
            case"Escape":
                return this.uncheckAllOptions(), this.checkActiveIndex(), !0;
            case" ":
                if (t.preventDefault(), this.typeAheadExpired) return void this.toggleSelectedForAllCheckedOptions();
            default:
                return 1 === e.length && this.handleTypeAhead("" + e), !0
        }
    }

    mousedownHandler(t) {
        if (t.offsetX >= 0 && t.offsetX <= this.scrollWidth) return super.mousedownHandler(t)
    }

    multipleChanged(t, e) {
        var i;
        this.ariaMultiSelectable = e ? "true" : null, null === (i = this.options) || void 0 === i || i.forEach(t => {
            t.checked = !e && void 0
        }), this.setSelectedOptions()
    }

    setSelectedOptions() {
        this.multiple ? this.$fastController.isConnected && this.options && (this.selectedOptions = this.options.filter(t => t.selected), this.focusAndScrollOptionIntoView()) : super.setSelectedOptions()
    }

    sizeChanged(t, e) {
        var i;
        const o = Math.max(0, parseInt(null !== (i = null == e ? void 0 : e.toFixed()) && void 0 !== i ? i : "", 10));
        o !== e && d.queueUpdate(() => {
            this.size = o
        })
    }

    toggleSelectedForAllCheckedOptions() {
        const t = this.checkedOptions.filter(t => !t.disabled), e = !t.every(t => t.selected);
        t.forEach(t => t.selected = e), this.selectedIndex = this.options.indexOf(t[t.length - 1]), this.setSelectedOptions()
    }

    typeaheadBufferChanged(t, e) {
        if (this.multiple) {
            if (this.$fastController.isConnected) {
                const t = this.getTypeaheadMatches(), e = this.options.indexOf(t[0]);
                e > -1 && (this.activeIndex = e, this.uncheckAllOptions(), this.checkActiveIndex()), this.typeAheadExpired = !1
            }
        } else super.typeaheadBufferChanged(t, e)
    }

    uncheckAllOptions(t = !1) {
        this.options.forEach(t => t.checked = !this.multiple && void 0), t || (this.rangeStartIndex = -1)
    }
}

Kt([f], jo.prototype, "activeIndex", void 0), Kt([st({mode: "boolean"})], jo.prototype, "multiple", void 0), Kt([st({converter: it})], jo.prototype, "size", void 0);
const Uo = "menuitem", qo = "menuitemcheckbox", _o = "menuitemradio",
    Go = {[Uo]: "menuitem", [qo]: "menuitemcheckbox", [_o]: "menuitemradio"};

class Wo extends Ee {
    constructor() {
        super(...arguments), this.role = Uo, this.hasSubmenu = !1, this.currentDirection = je.ltr, this.focusSubmenuOnLoad = !1, this.handleMenuItemKeyDown = t => {
            if (t.defaultPrevented) return !1;
            switch (t.key) {
                case"Enter":
                case" ":
                    return this.invoke(), !1;
                case"ArrowRight":
                    return this.expandAndFocus(), !1;
                case"ArrowLeft":
                    if (this.expanded) return this.expanded = !1, this.focus(), !1
            }
            return !0
        }, this.handleMenuItemClick = t => (t.defaultPrevented || this.disabled || this.invoke(), !1), this.submenuLoaded = () => {
            this.focusSubmenuOnLoad && (this.focusSubmenuOnLoad = !1, this.hasSubmenu && (this.submenu.focus(), this.setAttribute("tabindex", "-1")))
        }, this.handleMouseOver = t => (this.disabled || !this.hasSubmenu || this.expanded || (this.expanded = !0), !1), this.handleMouseOut = t => (!this.expanded || this.contains(document.activeElement) || (this.expanded = !1), !1), this.expandAndFocus = () => {
            this.hasSubmenu && (this.focusSubmenuOnLoad = !0, this.expanded = !0)
        }, this.invoke = () => {
            if (!this.disabled) switch (this.role) {
                case qo:
                    this.checked = !this.checked;
                    break;
                case Uo:
                    this.updateSubmenu(), this.hasSubmenu ? this.expandAndFocus() : this.$emit("change");
                    break;
                case _o:
                    this.checked || (this.checked = !0)
            }
        }, this.updateSubmenu = () => {
            this.submenu = this.domChildren().find(t => "menu" === t.getAttribute("role")), this.hasSubmenu = void 0 !== this.submenu
        }
    }

    expandedChanged(t) {
        if (this.$fastController.isConnected) {
            if (void 0 === this.submenu) return;
            !1 === this.expanded ? this.submenu.collapseExpandedItem() : this.currentDirection = ii(this), this.$emit("expanded-change", this, {bubbles: !1})
        }
    }

    checkedChanged(t, e) {
        this.$fastController.isConnected && this.$emit("change")
    }

    connectedCallback() {
        super.connectedCallback(), d.queueUpdate(() => {
            this.updateSubmenu()
        }), this.startColumnCount || (this.startColumnCount = 1), this.observer = new MutationObserver(this.updateSubmenu)
    }

    disconnectedCallback() {
        super.disconnectedCallback(), this.submenu = void 0, void 0 !== this.observer && (this.observer.disconnect(), this.observer = void 0)
    }

    domChildren() {
        return Array.from(this.children).filter(t => !t.hasAttribute("hidden"))
    }
}

Kt([st({mode: "boolean"})], Wo.prototype, "disabled", void 0), Kt([st({mode: "boolean"})], Wo.prototype, "expanded", void 0), Kt([f], Wo.prototype, "startColumnCount", void 0), Kt([st], Wo.prototype, "role", void 0), Kt([st({mode: "boolean"})], Wo.prototype, "checked", void 0), Kt([f], Wo.prototype, "submenuRegion", void 0), Kt([f], Wo.prototype, "hasSubmenu", void 0), Kt([f], Wo.prototype, "currentDirection", void 0), Kt([f], Wo.prototype, "submenu", void 0), Ae(Wo, Ut);

class Ko extends Ee {
    constructor() {
        super(...arguments), this.expandedItem = null, this.focusIndex = -1, this.isNestedMenu = () => null !== this.parentElement && He(this.parentElement) && "menuitem" === this.parentElement.getAttribute("role"), this.handleFocusOut = t => {
            if (!this.contains(t.relatedTarget) && void 0 !== this.menuItems) {
                this.collapseExpandedItem();
                const t = this.menuItems.findIndex(this.isFocusableElement);
                this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"), this.menuItems[t].setAttribute("tabindex", "0"), this.focusIndex = t
            }
        }, this.handleItemFocus = t => {
            const e = t.target;
            void 0 !== this.menuItems && e !== this.menuItems[this.focusIndex] && (this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"), this.focusIndex = this.menuItems.indexOf(e), e.setAttribute("tabindex", "0"))
        }, this.handleExpandedChanged = t => {
            if (t.defaultPrevented || null === t.target || void 0 === this.menuItems || this.menuItems.indexOf(t.target) < 0) return;
            t.preventDefault();
            const e = t.target;
            null === this.expandedItem || e !== this.expandedItem || !1 !== e.expanded ? e.expanded && (null !== this.expandedItem && this.expandedItem !== e && (this.expandedItem.expanded = !1), this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"), this.expandedItem = e, this.focusIndex = this.menuItems.indexOf(e), e.setAttribute("tabindex", "0")) : this.expandedItem = null
        }, this.removeItemListeners = () => {
            void 0 !== this.menuItems && this.menuItems.forEach(t => {
                t.removeEventListener("expanded-change", this.handleExpandedChanged), t.removeEventListener("focus", this.handleItemFocus)
            })
        }, this.setItems = () => {
            const t = this.domChildren();
            this.removeItemListeners(), this.menuItems = t;
            const e = this.menuItems.filter(this.isMenuItemElement);
            e.length && (this.focusIndex = 0);
            const i = e.reduce((t, e) => {
                const i = function (t) {
                    const e = t.getAttribute("role"), i = t.querySelector("[slot=start]");
                    return e !== Uo && null === i || e === Uo && null !== i ? 1 : e !== Uo && null !== i ? 2 : 0
                }(e);
                return t > i ? t : i
            }, 0);
            e.forEach((t, e) => {
                t.setAttribute("tabindex", 0 === e ? "0" : "-1"), t.addEventListener("expanded-change", this.handleExpandedChanged), t.addEventListener("focus", this.handleItemFocus), t instanceof Wo && (t.startColumnCount = i)
            })
        }, this.changeHandler = t => {
            if (void 0 === this.menuItems) return;
            const e = t.target, i = this.menuItems.indexOf(e);
            if (-1 !== i && "menuitemradio" === e.role && !0 === e.checked) {
                for (let t = i - 1; t >= 0; --t) {
                    const e = this.menuItems[t], i = e.getAttribute("role");
                    if (i === _o && (e.checked = !1), "separator" === i) break
                }
                const t = this.menuItems.length - 1;
                for (let e = i + 1; e <= t; ++e) {
                    const t = this.menuItems[e], i = t.getAttribute("role");
                    if (i === _o && (t.checked = !1), "separator" === i) break
                }
            }
        }, this.isMenuItemElement = t => He(t) && Ko.focusableElementRoles.hasOwnProperty(t.getAttribute("role")), this.isFocusableElement = t => this.isMenuItemElement(t)
    }

    itemsChanged(t, e) {
        this.$fastController.isConnected && void 0 !== this.menuItems && this.setItems()
    }

    connectedCallback() {
        super.connectedCallback(), d.queueUpdate(() => {
            this.setItems()
        }), this.addEventListener("change", this.changeHandler)
    }

    disconnectedCallback() {
        super.disconnectedCallback(), this.removeItemListeners(), this.menuItems = void 0, this.removeEventListener("change", this.changeHandler)
    }

    focus() {
        this.setFocus(0, 1)
    }

    collapseExpandedItem() {
        null !== this.expandedItem && (this.expandedItem.expanded = !1, this.expandedItem = null)
    }

    handleMenuKeyDown(t) {
        if (!t.defaultPrevented && void 0 !== this.menuItems) switch (t.key) {
            case"ArrowDown":
                return void this.setFocus(this.focusIndex + 1, 1);
            case"ArrowUp":
                return void this.setFocus(this.focusIndex - 1, -1);
            case"End":
                return void this.setFocus(this.menuItems.length - 1, -1);
            case"Home":
                return void this.setFocus(0, 1);
            default:
                return !0
        }
    }

    domChildren() {
        return Array.from(this.children).filter(t => !t.hasAttribute("hidden"))
    }

    setFocus(t, e) {
        if (void 0 !== this.menuItems) for (; t >= 0 && t < this.menuItems.length;) {
            const i = this.menuItems[t];
            if (this.isFocusableElement(i)) {
                this.focusIndex > -1 && this.menuItems.length >= this.focusIndex - 1 && this.menuItems[this.focusIndex].setAttribute("tabindex", "-1"), this.focusIndex = t, i.setAttribute("tabindex", "0"), i.focus();
                break
            }
            t += e
        }
    }
}

Ko.focusableElementRoles = Go, Kt([f], Ko.prototype, "items", void 0);

class Xo extends Ee {
}

class Yo extends (ci(Xo)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("input")
    }
}

const Qo = "text";

class Zo extends Yo {
    constructor() {
        super(...arguments), this.type = Qo
    }

    readOnlyChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly, this.validate())
    }

    autofocusChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.autofocus = this.autofocus, this.validate())
    }

    placeholderChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.placeholder = this.placeholder)
    }

    typeChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.type = this.type, this.validate())
    }

    listChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.setAttribute("list", this.list), this.validate())
    }

    maxlengthChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.maxLength = this.maxlength, this.validate())
    }

    minlengthChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.minLength = this.minlength, this.validate())
    }

    patternChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.pattern = this.pattern, this.validate())
    }

    sizeChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.size = this.size)
    }

    spellcheckChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.spellcheck = this.spellcheck)
    }

    connectedCallback() {
        super.connectedCallback(), this.proxy.setAttribute("type", this.type), this.validate(), this.autofocus && d.queueUpdate(() => {
            this.focus()
        })
    }

    select() {
        this.control.select(), this.$emit("select")
    }

    handleTextInput() {
        this.value = this.control.value
    }

    handleChange() {
        this.$emit("change")
    }

    validate() {
        super.validate(this.control)
    }
}

Kt([st({
    attribute: "readonly",
    mode: "boolean"
})], Zo.prototype, "readOnly", void 0), Kt([st({mode: "boolean"})], Zo.prototype, "autofocus", void 0), Kt([st], Zo.prototype, "placeholder", void 0), Kt([st], Zo.prototype, "type", void 0), Kt([st], Zo.prototype, "list", void 0), Kt([st({converter: it})], Zo.prototype, "maxlength", void 0), Kt([st({converter: it})], Zo.prototype, "minlength", void 0), Kt([st], Zo.prototype, "pattern", void 0), Kt([st({converter: it})], Zo.prototype, "size", void 0), Kt([st({mode: "boolean"})], Zo.prototype, "spellcheck", void 0), Kt([f], Zo.prototype, "defaultSlottedNodes", void 0);

class Jo {
}

Ae(Jo, Je), Ae(Zo, Ut, Jo);

class ts extends Ee {
}

class es extends (ci(ts)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("input")
    }
}

class is extends es {
    constructor() {
        super(...arguments), this.hideStep = !1, this.step = 1, this.isUserInput = !1
    }

    maxChanged(t, e) {
        var i;
        this.max = Math.max(e, null !== (i = this.min) && void 0 !== i ? i : e);
        const o = Math.min(this.min, this.max);
        void 0 !== this.min && this.min !== o && (this.min = o), this.value = this.getValidValue(this.value)
    }

    minChanged(t, e) {
        var i;
        this.min = Math.min(e, null !== (i = this.max) && void 0 !== i ? i : e);
        const o = Math.max(this.min, this.max);
        void 0 !== this.max && this.max !== o && (this.max = o), this.value = this.getValidValue(this.value)
    }

    get valueAsNumber() {
        return parseFloat(super.value)
    }

    set valueAsNumber(t) {
        this.value = t.toString()
    }

    valueChanged(t, e) {
        this.value = this.getValidValue(e), e === this.value && (this.control && !this.isUserInput && (this.control.value = this.value), super.valueChanged(t, this.value), void 0 === t || this.isUserInput || (this.$emit("input"), this.$emit("change")), this.isUserInput = !1)
    }

    validate() {
        super.validate(this.control)
    }

    getValidValue(t) {
        var e, i;
        let o = parseFloat(parseFloat(t).toPrecision(12));
        return isNaN(o) ? o = "" : (o = Math.min(o, null !== (e = this.max) && void 0 !== e ? e : o), o = Math.max(o, null !== (i = this.min) && void 0 !== i ? i : o).toString()), o
    }

    stepUp() {
        const t = parseFloat(this.value),
            e = isNaN(t) ? this.min > 0 ? this.min : this.max < 0 ? this.max : this.min ? 0 : this.step : t + this.step;
        this.value = e.toString()
    }

    stepDown() {
        const t = parseFloat(this.value),
            e = isNaN(t) ? this.min > 0 ? this.min : this.max < 0 ? this.max : this.min ? 0 : 0 - this.step : t - this.step;
        this.value = e.toString()
    }

    connectedCallback() {
        super.connectedCallback(), this.proxy.setAttribute("type", "number"), this.validate(), this.control.value = this.value, this.autofocus && d.queueUpdate(() => {
            this.focus()
        })
    }

    select() {
        this.control.select(), this.$emit("select")
    }

    handleTextInput() {
        this.control.value = this.control.value.replace(/[^0-9\-+e.]/g, ""), this.isUserInput = !0, this.value = this.control.value
    }

    handleChange() {
        this.$emit("change")
    }

    handleKeyDown(t) {
        switch (t.key) {
            case"ArrowUp":
                return this.stepUp(), !1;
            case"ArrowDown":
                return this.stepDown(), !1
        }
        return !0
    }

    handleBlur() {
        this.control.value = this.value
    }
}

Kt([st({
    attribute: "readonly",
    mode: "boolean"
})], is.prototype, "readOnly", void 0), Kt([st({mode: "boolean"})], is.prototype, "autofocus", void 0), Kt([st({
    attribute: "hide-step",
    mode: "boolean"
})], is.prototype, "hideStep", void 0), Kt([st], is.prototype, "placeholder", void 0), Kt([st], is.prototype, "list", void 0), Kt([st({converter: it})], is.prototype, "maxlength", void 0), Kt([st({converter: it})], is.prototype, "minlength", void 0), Kt([st({converter: it})], is.prototype, "size", void 0), Kt([st({converter: it})], is.prototype, "step", void 0), Kt([st({converter: it})], is.prototype, "max", void 0), Kt([st({converter: it})], is.prototype, "min", void 0), Kt([f], is.prototype, "defaultSlottedNodes", void 0), Ae(is, Ut, Jo);

class os extends Ee {
    constructor() {
        super(...arguments), this.percentComplete = 0
    }

    valueChanged() {
        this.$fastController.isConnected && this.updatePercentComplete()
    }

    minChanged() {
        this.$fastController.isConnected && this.updatePercentComplete()
    }

    maxChanged() {
        this.$fastController.isConnected && this.updatePercentComplete()
    }

    connectedCallback() {
        super.connectedCallback(), this.updatePercentComplete()
    }

    updatePercentComplete() {
        const t = "number" == typeof this.min ? this.min : 0, e = "number" == typeof this.max ? this.max : 100,
            i = "number" == typeof this.value ? this.value : 0, o = e - t;
        this.percentComplete = 0 === o ? 0 : Math.fround((i - t) / o * 100)
    }
}

Kt([st({converter: it})], os.prototype, "value", void 0), Kt([st({converter: it})], os.prototype, "min", void 0), Kt([st({converter: it})], os.prototype, "max", void 0), Kt([st({mode: "boolean"})], os.prototype, "paused", void 0), Kt([f], os.prototype, "percentComplete", void 0);

class ss extends Ee {
    constructor() {
        super(...arguments), this.orientation = Pe, this.radioChangeHandler = t => {
            const e = t.target;
            e.checked && (this.slottedRadioButtons.forEach(t => {
                t !== e && (t.checked = !1, this.isInsideFoundationToolbar || t.setAttribute("tabindex", "-1"))
            }), this.selectedRadio = e, this.value = e.value, e.setAttribute("tabindex", "0"), this.focusedRadio = e), t.stopPropagation()
        }, this.moveToRadioByIndex = (t, e) => {
            const i = t[e];
            this.isInsideToolbar || (i.setAttribute("tabindex", "0"), i.readOnly ? this.slottedRadioButtons.forEach(t => {
                t !== i && t.setAttribute("tabindex", "-1")
            }) : (i.checked = !0, this.selectedRadio = i)), this.focusedRadio = i, i.focus()
        }, this.moveRightOffGroup = () => {
            var t;
            null === (t = this.nextElementSibling) || void 0 === t || t.focus()
        }, this.moveLeftOffGroup = () => {
            var t;
            null === (t = this.previousElementSibling) || void 0 === t || t.focus()
        }, this.focusOutHandler = t => {
            const e = this.slottedRadioButtons, i = t.target, o = null !== i ? e.indexOf(i) : 0,
                s = this.focusedRadio ? e.indexOf(this.focusedRadio) : -1;
            return (0 === s && o === s || s === e.length - 1 && s === o) && (this.selectedRadio ? (this.focusedRadio = this.selectedRadio, this.isInsideFoundationToolbar || (this.selectedRadio.setAttribute("tabindex", "0"), e.forEach(t => {
                t !== this.selectedRadio && t.setAttribute("tabindex", "-1")
            }))) : (this.focusedRadio = e[0], this.focusedRadio.setAttribute("tabindex", "0"), e.forEach(t => {
                t !== this.focusedRadio && t.setAttribute("tabindex", "-1")
            }))), !0
        }, this.clickHandler = t => {
            const e = t.target;
            if (e) {
                const t = this.slottedRadioButtons;
                e.checked || 0 === t.indexOf(e) ? (e.setAttribute("tabindex", "0"), this.selectedRadio = e) : (e.setAttribute("tabindex", "-1"), this.selectedRadio = null), this.focusedRadio = e
            }
            t.preventDefault()
        }, this.shouldMoveOffGroupToTheRight = (t, e, i) => t === e.length && this.isInsideToolbar && "ArrowRight" === i, this.shouldMoveOffGroupToTheLeft = (t, e) => (this.focusedRadio ? t.indexOf(this.focusedRadio) - 1 : 0) < 0 && this.isInsideToolbar && "ArrowLeft" === e, this.checkFocusedRadio = () => {
            null === this.focusedRadio || this.focusedRadio.readOnly || this.focusedRadio.checked || (this.focusedRadio.checked = !0, this.focusedRadio.setAttribute("tabindex", "0"), this.focusedRadio.focus(), this.selectedRadio = this.focusedRadio)
        }, this.moveRight = t => {
            const e = this.slottedRadioButtons;
            let i = 0;
            if (i = this.focusedRadio ? e.indexOf(this.focusedRadio) + 1 : 1, this.shouldMoveOffGroupToTheRight(i, e, t.key)) this.moveRightOffGroup(); else for (i === e.length && (i = 0); i < e.length && e.length > 1;) {
                if (!e[i].disabled) {
                    this.moveToRadioByIndex(e, i);
                    break
                }
                if (this.focusedRadio && i === e.indexOf(this.focusedRadio)) break;
                if (i + 1 >= e.length) {
                    if (this.isInsideToolbar) break;
                    i = 0
                } else i += 1
            }
        }, this.moveLeft = t => {
            const e = this.slottedRadioButtons;
            let i = 0;
            if (i = this.focusedRadio ? e.indexOf(this.focusedRadio) - 1 : 0, i = i < 0 ? e.length - 1 : i, this.shouldMoveOffGroupToTheLeft(e, t.key)) this.moveLeftOffGroup(); else for (; i >= 0 && e.length > 1;) {
                if (!e[i].disabled) {
                    this.moveToRadioByIndex(e, i);
                    break
                }
                if (this.focusedRadio && i === e.indexOf(this.focusedRadio)) break;
                i - 1 < 0 ? i = e.length - 1 : i -= 1
            }
        }, this.keydownHandler = t => {
            const e = t.key;
            if (e in Ne && this.isInsideFoundationToolbar) return !0;
            switch (e) {
                case"Enter":
                    this.checkFocusedRadio();
                    break;
                case"ArrowRight":
                case"ArrowDown":
                    this.direction === je.ltr ? this.moveRight(t) : this.moveLeft(t);
                    break;
                case"ArrowLeft":
                case"ArrowUp":
                    this.direction === je.ltr ? this.moveLeft(t) : this.moveRight(t);
                    break;
                default:
                    return !0
            }
        }
    }

    readOnlyChanged() {
        void 0 !== this.slottedRadioButtons && this.slottedRadioButtons.forEach(t => {
            this.readOnly ? t.readOnly = !0 : t.readOnly = !1
        })
    }

    disabledChanged() {
        void 0 !== this.slottedRadioButtons && this.slottedRadioButtons.forEach(t => {
            this.disabled ? t.disabled = !0 : t.disabled = !1
        })
    }

    nameChanged() {
        this.slottedRadioButtons && this.slottedRadioButtons.forEach(t => {
            t.setAttribute("name", this.name)
        })
    }

    valueChanged() {
        this.slottedRadioButtons && this.slottedRadioButtons.forEach(t => {
            t.value === this.value && (t.checked = !0, this.selectedRadio = t)
        }), this.$emit("change")
    }

    slottedRadioButtonsChanged(t, e) {
        this.slottedRadioButtons && this.slottedRadioButtons.length > 0 && this.setupRadioButtons()
    }

    get parentToolbar() {
        return this.closest('[role="toolbar"]')
    }

    get isInsideToolbar() {
        var t;
        return null !== (t = this.parentToolbar) && void 0 !== t && t
    }

    get isInsideFoundationToolbar() {
        var t;
        return !!(null === (t = this.parentToolbar) || void 0 === t ? void 0 : t.$fastController)
    }

    connectedCallback() {
        super.connectedCallback(), this.direction = ii(this), this.setupRadioButtons()
    }

    disconnectedCallback() {
        this.slottedRadioButtons.forEach(t => {
            t.removeEventListener("change", this.radioChangeHandler)
        })
    }

    setupRadioButtons() {
        const t = this.slottedRadioButtons.filter(t => t.hasAttribute("checked")), e = t ? t.length : 0;
        if (e > 1) {
            t[e - 1].checked = !0
        }
        let i = !1;
        if (this.slottedRadioButtons.forEach(t => {
            void 0 !== this.name && t.setAttribute("name", this.name), this.disabled && (t.disabled = !0), this.readOnly && (t.readOnly = !0), this.value && this.value === t.value ? (this.selectedRadio = t, this.focusedRadio = t, t.checked = !0, t.setAttribute("tabindex", "0"), i = !0) : (this.isInsideFoundationToolbar || t.setAttribute("tabindex", "-1"), t.checked = !1), t.addEventListener("change", this.radioChangeHandler)
        }), void 0 === this.value && this.slottedRadioButtons.length > 0) {
            const t = this.slottedRadioButtons.filter(t => t.hasAttribute("checked")), e = null !== t ? t.length : 0;
            if (e > 0 && !i) {
                const i = t[e - 1];
                i.checked = !0, this.focusedRadio = i, i.setAttribute("tabindex", "0")
            } else this.slottedRadioButtons[0].setAttribute("tabindex", "0"), this.focusedRadio = this.slottedRadioButtons[0]
        }
    }
}

Kt([st({attribute: "readonly", mode: "boolean"})], ss.prototype, "readOnly", void 0), Kt([st({
    attribute: "disabled",
    mode: "boolean"
})], ss.prototype, "disabled", void 0), Kt([st], ss.prototype, "name", void 0), Kt([st], ss.prototype, "value", void 0), Kt([st], ss.prototype, "orientation", void 0), Kt([f], ss.prototype, "childItems", void 0), Kt([f], ss.prototype, "slottedRadioButtons", void 0);

class ns extends Ee {
}

class rs extends (hi(ns)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("input")
    }
}

class as extends rs {
    constructor() {
        super(), this.initialValue = "on", this.keypressHandler = t => {
            switch (t.key) {
                case" ":
                    return void (this.checked || this.readOnly || (this.checked = !0))
            }
            return !0
        }, this.proxy.setAttribute("type", "radio")
    }

    readOnlyChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly)
    }

    defaultCheckedChanged() {
        var t;
        this.$fastController.isConnected && !this.dirtyChecked && (this.isInsideRadioGroup() || (this.checked = null !== (t = this.defaultChecked) && void 0 !== t && t, this.dirtyChecked = !1))
    }

    connectedCallback() {
        var t, e;
        super.connectedCallback(), this.validate(), "radiogroup" !== (null === (t = this.parentElement) || void 0 === t ? void 0 : t.getAttribute("role")) && null === this.getAttribute("tabindex") && (this.disabled || this.setAttribute("tabindex", "0")), this.checkedAttribute && (this.dirtyChecked || this.isInsideRadioGroup() || (this.checked = null !== (e = this.defaultChecked) && void 0 !== e && e, this.dirtyChecked = !1))
    }

    isInsideRadioGroup() {
        return null !== this.closest("[role=radiogroup]")
    }

    clickHandler(t) {
        this.disabled || this.readOnly || this.checked || (this.checked = !0)
    }
}

Kt([st({
    attribute: "readonly",
    mode: "boolean"
})], as.prototype, "readOnly", void 0), Kt([f], as.prototype, "name", void 0), Kt([f], as.prototype, "defaultSlottedNodes", void 0);

class ls extends Ee {
    constructor() {
        super(...arguments), this.framesPerSecond = 60, this.updatingItems = !1, this.speed = 600, this.easing = "ease-in-out", this.flippersHiddenFromAT = !1, this.scrolling = !1, this.resizeDetector = null
    }

    get frameTime() {
        return 1e3 / this.framesPerSecond
    }

    scrollingChanged(t, e) {
        if (this.scrollContainer) {
            const t = 1 == this.scrolling ? "scrollstart" : "scrollend";
            this.$emit(t, this.scrollContainer.scrollLeft)
        }
    }

    get isRtl() {
        return this.scrollItems.length > 1 && this.scrollItems[0].offsetLeft > this.scrollItems[1].offsetLeft
    }

    connectedCallback() {
        super.connectedCallback(), this.initializeResizeDetector()
    }

    disconnectedCallback() {
        this.disconnectResizeDetector(), super.disconnectedCallback()
    }

    scrollItemsChanged(t, e) {
        e && !this.updatingItems && d.queueUpdate(() => this.setStops())
    }

    disconnectResizeDetector() {
        this.resizeDetector && (this.resizeDetector.disconnect(), this.resizeDetector = null)
    }

    initializeResizeDetector() {
        this.disconnectResizeDetector(), this.resizeDetector = new window.ResizeObserver(this.resized.bind(this)), this.resizeDetector.observe(this)
    }

    updateScrollStops() {
        this.updatingItems = !0;
        const t = this.scrollItems.reduce((t, e) => e instanceof HTMLSlotElement ? t.concat(e.assignedElements()) : (t.push(e), t), []);
        this.scrollItems = t, this.updatingItems = !1
    }

    setStops() {
        this.updateScrollStops();
        const {scrollContainer: t} = this, {scrollLeft: e} = t, {width: i, left: o} = t.getBoundingClientRect();
        this.width = i;
        let s = 0, n = this.scrollItems.map((t, i) => {
            const {left: n, width: r} = t.getBoundingClientRect(), a = Math.round(n + e - o), l = Math.round(a + r);
            return this.isRtl ? -l : (s = l, 0 === i ? 0 : a)
        }).concat(s);
        n = this.fixScrollMisalign(n), n.sort((t, e) => Math.abs(t) - Math.abs(e)), this.scrollStops = n, this.setFlippers()
    }

    validateStops(t = !0) {
        const e = () => !!this.scrollStops.find(t => t > 0);
        return !e() && t && this.setStops(), e()
    }

    fixScrollMisalign(t) {
        if (this.isRtl && t.some(t => t > 0)) {
            t.sort((t, e) => e - t);
            const e = t[0];
            t = t.map(t => t - e)
        }
        return t
    }

    setFlippers() {
        var t, e;
        const i = this.scrollContainer.scrollLeft;
        if (null === (t = this.previousFlipperContainer) || void 0 === t || t.classList.toggle("disabled", 0 === i), this.scrollStops) {
            const t = Math.abs(this.scrollStops[this.scrollStops.length - 1]);
            null === (e = this.nextFlipperContainer) || void 0 === e || e.classList.toggle("disabled", this.validateStops(!1) && Math.abs(i) + this.width >= t)
        }
    }

    scrollInView(t, e = 0, i) {
        var o;
        if ("number" != typeof t && t && (t = this.scrollItems.findIndex(e => e === t || e.contains(t))), void 0 !== t) {
            i = null != i ? i : e;
            const {
                    scrollContainer: s,
                    scrollStops: n,
                    scrollItems: r
                } = this, {scrollLeft: a} = this.scrollContainer, {width: l} = s.getBoundingClientRect(),
                c = n[t], {width: h} = r[t].getBoundingClientRect(), d = c + h, u = a + e > c;
            if (u || a + l - i < d) {
                const t = null !== (o = [...n].sort((t, e) => u ? e - t : t - e).find(t => u ? t + e < c : t + l - (null != i ? i : 0) > d)) && void 0 !== o ? o : 0;
                this.scrollToPosition(t)
            }
        }
    }

    keyupHandler(t) {
        switch (t.key) {
            case"ArrowLeft":
                this.scrollToPrevious();
                break;
            case"ArrowRight":
                this.scrollToNext()
        }
    }

    scrollToPrevious() {
        this.validateStops();
        const t = this.scrollContainer.scrollLeft,
            e = this.scrollStops.findIndex((e, i) => e >= t && (this.isRtl || i === this.scrollStops.length - 1 || this.scrollStops[i + 1] > t)),
            i = Math.abs(this.scrollStops[e + 1]);
        let o = this.scrollStops.findIndex(t => Math.abs(t) + this.width > i);
        (o >= e || -1 === o) && (o = e > 0 ? e - 1 : 0), this.scrollToPosition(this.scrollStops[o], t)
    }

    scrollToNext() {
        this.validateStops();
        const t = this.scrollContainer.scrollLeft, e = this.scrollStops.findIndex(e => Math.abs(e) >= Math.abs(t)),
            i = this.scrollStops.findIndex(e => Math.abs(t) + this.width <= Math.abs(e));
        let o = e;
        i > e + 2 ? o = i - 2 : e < this.scrollStops.length - 2 && (o = e + 1), this.scrollToPosition(this.scrollStops[o], t)
    }

    scrollToPosition(t, e = this.scrollContainer.scrollLeft) {
        var i;
        if (this.scrolling) return;
        this.scrolling = !0;
        const o = null !== (i = this.duration) && void 0 !== i ? i : Math.abs(t - e) / this.speed + "s";
        this.content.style.setProperty("transition-duration", o);
        const s = parseFloat(getComputedStyle(this.content).getPropertyValue("transition-duration")), n = e => {
            e && e.target !== e.currentTarget || (this.content.style.setProperty("transition-duration", "0s"), this.content.style.removeProperty("transform"), this.scrollContainer.style.setProperty("scroll-behavior", "auto"), this.scrollContainer.scrollLeft = t, this.setFlippers(), this.content.removeEventListener("transitionend", n), this.scrolling = !1)
        };
        if (0 === s) return void n();
        this.content.addEventListener("transitionend", n);
        const r = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
        let a = this.scrollContainer.scrollLeft - Math.min(t, r);
        this.isRtl && (a = this.scrollContainer.scrollLeft + Math.min(Math.abs(t), r)), this.content.style.setProperty("transition-property", "transform"), this.content.style.setProperty("transition-timing-function", this.easing), this.content.style.setProperty("transform", `translateX(${a}px)`)
    }

    resized() {
        this.resizeTimeout && (this.resizeTimeout = clearTimeout(this.resizeTimeout)), this.resizeTimeout = setTimeout(() => {
            this.width = this.scrollContainer.offsetWidth, this.setFlippers()
        }, this.frameTime)
    }

    scrolled() {
        this.scrollTimeout && (this.scrollTimeout = clearTimeout(this.scrollTimeout)), this.scrollTimeout = setTimeout(() => {
            this.setFlippers()
        }, this.frameTime)
    }
}

Kt([st({converter: it})], ls.prototype, "speed", void 0), Kt([st], ls.prototype, "duration", void 0), Kt([st], ls.prototype, "easing", void 0), Kt([st({
    attribute: "flippers-hidden-from-at",
    converter: et
})], ls.prototype, "flippersHiddenFromAT", void 0), Kt([f], ls.prototype, "scrolling", void 0), Kt([f], ls.prototype, "scrollItems", void 0), Kt([st({attribute: "view"})], ls.prototype, "view", void 0);

function cs(t, e, i) {
    return t.nodeType !== Node.TEXT_NODE || "string" == typeof t.nodeValue && !!t.nodeValue.trim().length
}

class hs extends Ee {
}

class ds extends (ci(hs)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("input")
    }
}

class us extends ds {
    readOnlyChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly, this.validate())
    }

    autofocusChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.autofocus = this.autofocus, this.validate())
    }

    placeholderChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.placeholder = this.placeholder)
    }

    listChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.setAttribute("list", this.list), this.validate())
    }

    maxlengthChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.maxLength = this.maxlength, this.validate())
    }

    minlengthChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.minLength = this.minlength, this.validate())
    }

    patternChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.pattern = this.pattern, this.validate())
    }

    sizeChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.size = this.size)
    }

    spellcheckChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.spellcheck = this.spellcheck)
    }

    connectedCallback() {
        super.connectedCallback(), this.validate(), this.autofocus && d.queueUpdate(() => {
            this.focus()
        })
    }

    validate() {
        super.validate(this.control)
    }

    handleTextInput() {
        this.value = this.control.value
    }

    handleClearInput() {
        this.value = "", this.control.focus(), this.handleChange()
    }

    handleChange() {
        this.$emit("change")
    }
}

Kt([st({
    attribute: "readonly",
    mode: "boolean"
})], us.prototype, "readOnly", void 0), Kt([st({mode: "boolean"})], us.prototype, "autofocus", void 0), Kt([st], us.prototype, "placeholder", void 0), Kt([st], us.prototype, "list", void 0), Kt([st({converter: it})], us.prototype, "maxlength", void 0), Kt([st({converter: it})], us.prototype, "minlength", void 0), Kt([st], us.prototype, "pattern", void 0), Kt([st({converter: it})], us.prototype, "size", void 0), Kt([st({mode: "boolean"})], us.prototype, "spellcheck", void 0), Kt([f], us.prototype, "defaultSlottedNodes", void 0);

class ps {
}

Ae(ps, Je), Ae(us, Ut, ps);

class gs extends jo {
}

class fs extends (ci(gs)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("select")
    }
}

class ms extends fs {
    constructor() {
        super(...arguments), this.open = !1, this.forcedPosition = !1, this.listboxId = We("listbox-"), this.maxHeight = 0
    }

    openChanged(t, e) {
        if (this.collapsible) {
            if (this.open) return this.ariaControls = this.listboxId, this.ariaExpanded = "true", this.setPositioning(), this.focusAndScrollOptionIntoView(), this.indexWhenOpened = this.selectedIndex, void d.queueUpdate(() => this.focus());
            this.ariaControls = "", this.ariaExpanded = "false"
        }
    }

    get collapsible() {
        return !(this.multiple || "number" == typeof this.size)
    }

    get value() {
        return g.track(this, "value"), this._value
    }

    set value(t) {
        var e, i, o, s, n, r, a;
        const l = "" + this._value;
        if (null === (e = this._options) || void 0 === e ? void 0 : e.length) {
            const e = this._options.findIndex(e => e.value === t),
                l = null !== (o = null === (i = this._options[this.selectedIndex]) || void 0 === i ? void 0 : i.value) && void 0 !== o ? o : null,
                c = null !== (n = null === (s = this._options[e]) || void 0 === s ? void 0 : s.value) && void 0 !== n ? n : null;
            -1 !== e && l === c || (t = "", this.selectedIndex = e), t = null !== (a = null === (r = this.firstSelectedOption) || void 0 === r ? void 0 : r.value) && void 0 !== a ? a : t
        }
        l !== t && (this._value = t, super.valueChanged(l, t), g.notify(this, "value"), this.updateDisplayValue())
    }

    updateValue(t) {
        var e, i;
        this.$fastController.isConnected && (this.value = null !== (i = null === (e = this.firstSelectedOption) || void 0 === e ? void 0 : e.value) && void 0 !== i ? i : ""), t && (this.$emit("input"), this.$emit("change", this, {
            bubbles: !0,
            composed: void 0
        }))
    }

    selectedIndexChanged(t, e) {
        super.selectedIndexChanged(t, e), this.updateValue()
    }

    positionChanged(t, e) {
        this.positionAttribute = e, this.setPositioning()
    }

    setPositioning() {
        const t = this.getBoundingClientRect(), e = window.innerHeight - t.bottom;
        this.position = this.forcedPosition ? this.positionAttribute : t.top > e ? Ui : qi, this.positionAttribute = this.forcedPosition ? this.positionAttribute : this.position, this.maxHeight = this.position === Ui ? ~~t.top : ~~e
    }

    get displayValue() {
        var t, e;
        return g.track(this, "displayValue"), null !== (e = null === (t = this.firstSelectedOption) || void 0 === t ? void 0 : t.text) && void 0 !== e ? e : ""
    }

    disabledChanged(t, e) {
        super.disabledChanged && super.disabledChanged(t, e), this.ariaDisabled = this.disabled ? "true" : "false"
    }

    formResetCallback() {
        this.setProxyOptions(), super.setDefaultSelectedOption(), -1 === this.selectedIndex && (this.selectedIndex = 0)
    }

    clickHandler(t) {
        if (!this.disabled) {
            if (this.open) {
                const e = t.target.closest("option,[role=option]");
                if (e && e.disabled) return
            }
            return super.clickHandler(t), this.open = this.collapsible && !this.open, this.open || this.indexWhenOpened === this.selectedIndex || this.updateValue(!0), !0
        }
    }

    focusoutHandler(t) {
        var e;
        if (super.focusoutHandler(t), !this.open) return !0;
        const i = t.relatedTarget;
        this.isSameNode(i) ? this.focus() : (null === (e = this.options) || void 0 === e ? void 0 : e.includes(i)) || (this.open = !1, this.indexWhenOpened !== this.selectedIndex && this.updateValue(!0))
    }

    handleChange(t, e) {
        super.handleChange(t, e), "value" === e && this.updateValue()
    }

    slottedOptionsChanged(t, e) {
        this.options.forEach(t => {
            g.getNotifier(t).unsubscribe(this, "value")
        }), super.slottedOptionsChanged(t, e), this.options.forEach(t => {
            g.getNotifier(t).subscribe(this, "value")
        }), this.setProxyOptions(), this.updateValue()
    }

    mousedownHandler(t) {
        var e;
        return t.offsetX >= 0 && t.offsetX <= (null === (e = this.listbox) || void 0 === e ? void 0 : e.scrollWidth) ? super.mousedownHandler(t) : this.collapsible
    }

    multipleChanged(t, e) {
        super.multipleChanged(t, e), this.proxy && (this.proxy.multiple = e)
    }

    selectedOptionsChanged(t, e) {
        var i;
        super.selectedOptionsChanged(t, e), null === (i = this.options) || void 0 === i || i.forEach((t, e) => {
            var i;
            const o = null === (i = this.proxy) || void 0 === i ? void 0 : i.options.item(e);
            o && (o.selected = t.selected)
        })
    }

    setDefaultSelectedOption() {
        var t;
        const e = null !== (t = this.options) && void 0 !== t ? t : Array.from(this.children).filter(Ni.slottedOptionFilter),
            i = null == e ? void 0 : e.findIndex(t => t.hasAttribute("selected") || t.selected || t.value === this.value);
        this.selectedIndex = -1 === i ? 0 : i
    }

    setProxyOptions() {
        this.proxy instanceof HTMLSelectElement && this.options && (this.proxy.options.length = 0, this.options.forEach(t => {
            const e = t.proxy || (t instanceof HTMLOptionElement ? t.cloneNode() : null);
            e && this.proxy.options.add(e)
        }))
    }

    keydownHandler(t) {
        super.keydownHandler(t);
        const e = t.key || t.key.charCodeAt(0);
        switch (e) {
            case" ":
                t.preventDefault(), this.collapsible && this.typeAheadExpired && (this.open = !this.open);
                break;
            case"Home":
            case"End":
                t.preventDefault();
                break;
            case"Enter":
                t.preventDefault(), this.open = !this.open;
                break;
            case"Escape":
                this.collapsible && this.open && (t.preventDefault(), this.open = !1);
                break;
            case"Tab":
                return this.collapsible && this.open && (t.preventDefault(), this.open = !1), !0
        }
        return this.open || this.indexWhenOpened === this.selectedIndex || (this.updateValue(!0), this.indexWhenOpened = this.selectedIndex), !("ArrowDown" === e || "ArrowUp" === e)
    }

    connectedCallback() {
        super.connectedCallback(), this.forcedPosition = !!this.positionAttribute, this.addEventListener("contentchange", this.updateDisplayValue)
    }

    disconnectedCallback() {
        this.removeEventListener("contentchange", this.updateDisplayValue), super.disconnectedCallback()
    }

    sizeChanged(t, e) {
        super.sizeChanged(t, e), this.proxy && (this.proxy.size = e)
    }

    updateDisplayValue() {
        this.collapsible && g.notify(this, "displayValue")
    }
}

Kt([st({attribute: "open", mode: "boolean"})], ms.prototype, "open", void 0), Kt([function (t, e, i) {
    return Object.assign({}, i, {
        get: function () {
            return g.trackVolatile(), i.get.apply(this)
        }
    })
}], ms.prototype, "collapsible", null), Kt([f], ms.prototype, "control", void 0), Kt([st({attribute: "position"})], ms.prototype, "positionAttribute", void 0), Kt([f], ms.prototype, "position", void 0), Kt([f], ms.prototype, "maxHeight", void 0);

class vs {
}

Kt([f], vs.prototype, "ariaControls", void 0), Ae(vs, ji), Ae(ms, Ut, vs);

class bs extends Ee {
    constructor() {
        super(...arguments), this.shape = "rect"
    }
}

Kt([st], bs.prototype, "fill", void 0), Kt([st], bs.prototype, "shape", void 0), Kt([st], bs.prototype, "pattern", void 0), Kt([st({mode: "boolean"})], bs.prototype, "shimmer", void 0);

function ys(t, e, i, o) {
    let s = qe(0, 1, (t - e) / (i - e));
    return o === je.rtl && (s = 1 - s), s
}

const xs = {min: 0, max: 0, direction: je.ltr, orientation: Pe, disabled: !1};

class $s extends Ee {
    constructor() {
        super(...arguments), this.hideMark = !1, this.sliderDirection = je.ltr, this.getSliderConfiguration = () => {
            if (this.isSliderConfig(this.parentNode)) {
                const t = this.parentNode, {min: e, max: i, direction: o, orientation: s, disabled: n} = t;
                void 0 !== n && (this.disabled = n), this.sliderDirection = o || je.ltr, this.sliderOrientation = s || Pe, this.sliderMaxPosition = i, this.sliderMinPosition = e
            } else this.sliderDirection = xs.direction || je.ltr, this.sliderOrientation = xs.orientation, this.sliderMaxPosition = xs.max, this.sliderMinPosition = xs.min
        }, this.positionAsStyle = () => {
            const t = this.sliderDirection ? this.sliderDirection : je.ltr,
                e = ys(Number(this.position), Number(this.sliderMinPosition), Number(this.sliderMaxPosition));
            let i = Math.round(100 * (1 - e)), o = Math.round(100 * e);
            return Number.isNaN(o) && Number.isNaN(i) && (i = 50, o = 50), this.sliderOrientation === Pe ? t === je.rtl ? `right: ${o}%; left: ${i}%;` : `left: ${o}%; right: ${i}%;` : `top: ${o}%; bottom: ${i}%;`
        }
    }

    positionChanged() {
        this.positionStyle = this.positionAsStyle()
    }

    sliderOrientationChanged() {
    }

    connectedCallback() {
        super.connectedCallback(), this.getSliderConfiguration(), this.positionStyle = this.positionAsStyle(), this.notifier = g.getNotifier(this.parentNode), this.notifier.subscribe(this, "orientation"), this.notifier.subscribe(this, "direction"), this.notifier.subscribe(this, "max"), this.notifier.subscribe(this, "min")
    }

    disconnectedCallback() {
        super.disconnectedCallback(), this.notifier.unsubscribe(this, "orientation"), this.notifier.unsubscribe(this, "direction"), this.notifier.unsubscribe(this, "max"), this.notifier.unsubscribe(this, "min")
    }

    handleChange(t, e) {
        switch (e) {
            case"direction":
                this.sliderDirection = t.direction;
                break;
            case"orientation":
                this.sliderOrientation = t.orientation;
                break;
            case"max":
                this.sliderMaxPosition = t.max;
                break;
            case"min":
                this.sliderMinPosition = t.min
        }
        this.positionStyle = this.positionAsStyle()
    }

    isSliderConfig(t) {
        return void 0 !== t.max && void 0 !== t.min
    }
}

Kt([f], $s.prototype, "positionStyle", void 0), Kt([st], $s.prototype, "position", void 0), Kt([st({
    attribute: "hide-mark",
    mode: "boolean"
})], $s.prototype, "hideMark", void 0), Kt([st({
    attribute: "disabled",
    mode: "boolean"
})], $s.prototype, "disabled", void 0), Kt([f], $s.prototype, "sliderOrientation", void 0), Kt([f], $s.prototype, "sliderMinPosition", void 0), Kt([f], $s.prototype, "sliderMaxPosition", void 0), Kt([f], $s.prototype, "sliderDirection", void 0);

class ws extends Ee {
}

class ks extends (ci(ws)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("input")
    }
}

const Cs = "single-value";

class Is extends ks {
    constructor() {
        super(...arguments), this.direction = je.ltr, this.isDragging = !1, this.trackWidth = 0, this.trackMinWidth = 0, this.trackHeight = 0, this.trackLeft = 0, this.trackMinHeight = 0, this.valueTextFormatter = () => null, this.min = 0, this.max = 10, this.step = 1, this.orientation = Pe, this.mode = Cs, this.keypressHandler = t => {
            if (!this.readOnly) if ("Home" === t.key) t.preventDefault(), this.value = "" + this.min; else if ("End" === t.key) t.preventDefault(), this.value = "" + this.max; else if (!t.shiftKey) switch (t.key) {
                case"ArrowRight":
                case"ArrowUp":
                    t.preventDefault(), this.increment();
                    break;
                case"ArrowLeft":
                case"ArrowDown":
                    t.preventDefault(), this.decrement()
            }
        }, this.setupTrackConstraints = () => {
            const t = this.track.getBoundingClientRect();
            this.trackWidth = this.track.clientWidth, this.trackMinWidth = this.track.clientLeft, this.trackHeight = t.bottom, this.trackMinHeight = t.top, this.trackLeft = this.getBoundingClientRect().left, 0 === this.trackWidth && (this.trackWidth = 1)
        }, this.setupListeners = (t = !1) => {
            const e = (t ? "remove" : "add") + "EventListener";
            this[e]("keydown", this.keypressHandler), this[e]("mousedown", this.handleMouseDown), this.thumb[e]("mousedown", this.handleThumbMouseDown, {passive: !0}), this.thumb[e]("touchstart", this.handleThumbMouseDown, {passive: !0}), t && (this.handleMouseDown(null), this.handleThumbMouseDown(null))
        }, this.initialValue = "", this.handleThumbMouseDown = t => {
            if (t) {
                if (this.readOnly || this.disabled || t.defaultPrevented) return;
                t.target.focus()
            }
            const e = (null !== t ? "add" : "remove") + "EventListener";
            window[e]("mouseup", this.handleWindowMouseUp), window[e]("mousemove", this.handleMouseMove, {passive: !0}), window[e]("touchmove", this.handleMouseMove, {passive: !0}), window[e]("touchend", this.handleWindowMouseUp), this.isDragging = null !== t
        }, this.handleMouseMove = t => {
            if (this.readOnly || this.disabled || t.defaultPrevented) return;
            const e = window.TouchEvent && t instanceof TouchEvent ? t.touches[0] : t,
                i = this.orientation === Pe ? e.pageX - document.documentElement.scrollLeft - this.trackLeft : e.pageY - document.documentElement.scrollTop;
            this.value = "" + this.calculateNewValue(i)
        }, this.calculateNewValue = t => {
            const e = ys(t, this.orientation === Pe ? this.trackMinWidth : this.trackMinHeight, this.orientation === Pe ? this.trackWidth : this.trackHeight, this.direction),
                i = (this.max - this.min) * e + this.min;
            return this.convertToConstrainedValue(i)
        }, this.handleWindowMouseUp = t => {
            this.stopDragging()
        }, this.stopDragging = () => {
            this.isDragging = !1, this.handleMouseDown(null), this.handleThumbMouseDown(null)
        }, this.handleMouseDown = t => {
            const e = (null !== t ? "add" : "remove") + "EventListener";
            if ((null === t || !this.disabled && !this.readOnly) && (window[e]("mouseup", this.handleWindowMouseUp), window.document[e]("mouseleave", this.handleWindowMouseUp), window[e]("mousemove", this.handleMouseMove), t)) {
                t.preventDefault(), this.setupTrackConstraints(), t.target.focus();
                const e = this.orientation === Pe ? t.pageX - document.documentElement.scrollLeft - this.trackLeft : t.pageY - document.documentElement.scrollTop;
                this.value = "" + this.calculateNewValue(e)
            }
        }, this.convertToConstrainedValue = t => {
            isNaN(t) && (t = this.min);
            let e = t - this.min;
            const i = e - Math.round(e / this.step) * (this.stepMultiplier * this.step) / this.stepMultiplier;
            return e = i >= Number(this.step) / 2 ? e - i + Number(this.step) : e - i, e + this.min
        }
    }

    readOnlyChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly)
    }

    get valueAsNumber() {
        return parseFloat(super.value)
    }

    set valueAsNumber(t) {
        this.value = t.toString()
    }

    valueChanged(t, e) {
        super.valueChanged(t, e), this.$fastController.isConnected && this.setThumbPositionForOrientation(this.direction), this.$emit("change")
    }

    minChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.min = "" + this.min), this.validate()
    }

    maxChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.max = "" + this.max), this.validate()
    }

    stepChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.step = "" + this.step), this.updateStepMultiplier(), this.validate()
    }

    orientationChanged() {
        this.$fastController.isConnected && this.setThumbPositionForOrientation(this.direction)
    }

    connectedCallback() {
        super.connectedCallback(), this.proxy.setAttribute("type", "range"), this.direction = ii(this), this.updateStepMultiplier(), this.setupTrackConstraints(), this.setupListeners(), this.setupDefaultValue(), this.setThumbPositionForOrientation(this.direction)
    }

    disconnectedCallback() {
        this.setupListeners(!0)
    }

    increment() {
        const t = this.direction !== je.rtl && this.orientation !== ze ? Number(this.value) + Number(this.step) : Number(this.value) - Number(this.step),
            e = this.convertToConstrainedValue(t), i = e < Number(this.max) ? "" + e : "" + this.max;
        this.value = i
    }

    decrement() {
        const t = this.direction !== je.rtl && this.orientation !== ze ? Number(this.value) - Number(this.step) : Number(this.value) + Number(this.step),
            e = this.convertToConstrainedValue(t), i = e > Number(this.min) ? "" + e : "" + this.min;
        this.value = i
    }

    setThumbPositionForOrientation(t) {
        const e = 100 * (1 - ys(Number(this.value), Number(this.min), Number(this.max), t));
        this.orientation === Pe ? this.position = this.isDragging ? `right: ${e}%; transition: none;` : `right: ${e}%; transition: all 0.2s ease;` : this.position = this.isDragging ? `bottom: ${e}%; transition: none;` : `bottom: ${e}%; transition: all 0.2s ease;`
    }

    updateStepMultiplier() {
        const t = this.step + "", e = this.step % 1 ? t.length - t.indexOf(".") - 1 : 0;
        this.stepMultiplier = Math.pow(10, e)
    }

    get midpoint() {
        return "" + this.convertToConstrainedValue((this.max + this.min) / 2)
    }

    setupDefaultValue() {
        if ("string" == typeof this.value) if (0 === this.value.length) this.initialValue = this.midpoint; else {
            const t = parseFloat(this.value);
            !Number.isNaN(t) && (t < this.min || t > this.max) && (this.value = this.midpoint)
        }
    }
}

Kt([st({
    attribute: "readonly",
    mode: "boolean"
})], Is.prototype, "readOnly", void 0), Kt([f], Is.prototype, "direction", void 0), Kt([f], Is.prototype, "isDragging", void 0), Kt([f], Is.prototype, "position", void 0), Kt([f], Is.prototype, "trackWidth", void 0), Kt([f], Is.prototype, "trackMinWidth", void 0), Kt([f], Is.prototype, "trackHeight", void 0), Kt([f], Is.prototype, "trackLeft", void 0), Kt([f], Is.prototype, "trackMinHeight", void 0), Kt([f], Is.prototype, "valueTextFormatter", void 0), Kt([st({converter: it})], Is.prototype, "min", void 0), Kt([st({converter: it})], Is.prototype, "max", void 0), Kt([st({converter: it})], Is.prototype, "step", void 0), Kt([st], Is.prototype, "orientation", void 0), Kt([st], Is.prototype, "mode", void 0);

class Fs extends Ee {
}

class Ds extends (hi(Fs)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("input")
    }
}

class Ts extends Ds {
    constructor() {
        super(), this.initialValue = "on", this.keypressHandler = t => {
            if (!this.readOnly) switch (t.key) {
                case"Enter":
                case" ":
                    this.checked = !this.checked
            }
        }, this.clickHandler = t => {
            this.disabled || this.readOnly || (this.checked = !this.checked)
        }, this.proxy.setAttribute("type", "checkbox")
    }

    readOnlyChanged() {
        this.proxy instanceof HTMLInputElement && (this.proxy.readOnly = this.readOnly), this.readOnly ? this.classList.add("readonly") : this.classList.remove("readonly")
    }

    checkedChanged(t, e) {
        super.checkedChanged(t, e), this.checked ? this.classList.add("checked") : this.classList.remove("checked")
    }
}

Kt([st({
    attribute: "readonly",
    mode: "boolean"
})], Ts.prototype, "readOnly", void 0), Kt([f], Ts.prototype, "defaultSlottedNodes", void 0);

class Ss extends Ee {
}

class Os extends Ee {
}

Kt([st({mode: "boolean"})], Os.prototype, "disabled", void 0);
const Es = "horizontal";

class Vs extends Ee {
    constructor() {
        super(...arguments), this.orientation = Es, this.activeindicator = !0, this.showActiveIndicator = !0, this.prevActiveTabIndex = 0, this.activeTabIndex = 0, this.ticking = !1, this.change = () => {
            this.$emit("change", this.activetab)
        }, this.isDisabledElement = t => "true" === t.getAttribute("aria-disabled"), this.isFocusableElement = t => !this.isDisabledElement(t), this.setTabs = () => {
            const t = this.isHorizontal() ? "gridColumn" : "gridRow";
            this.activeTabIndex = this.getActiveIndex(), this.showActiveIndicator = !1, this.tabs.forEach((e, i) => {
                if ("tab" === e.slot) {
                    const t = this.activeTabIndex === i && this.isFocusableElement(e);
                    this.activeindicator && this.isFocusableElement(e) && (this.showActiveIndicator = !0);
                    const o = this.tabIds[i], s = this.tabpanelIds[i];
                    e.setAttribute("id", o), e.setAttribute("aria-selected", t ? "true" : "false"), e.setAttribute("aria-controls", s), e.addEventListener("click", this.handleTabClick), e.addEventListener("keydown", this.handleTabKeyDown), e.setAttribute("tabindex", t ? "0" : "-1"), t && (this.activetab = e)
                }
                e.style.gridColumn = "", e.style.gridRow = "", e.style[t] = "" + (i + 1), this.isHorizontal() ? e.classList.remove("vertical") : e.classList.add("vertical")
            })
        }, this.setTabPanels = () => {
            this.tabpanels.forEach((t, e) => {
                const i = this.tabIds[e], o = this.tabpanelIds[e];
                t.setAttribute("id", o), t.setAttribute("aria-labelledby", i), this.activeTabIndex !== e ? t.setAttribute("hidden", "") : t.removeAttribute("hidden")
            })
        }, this.handleTabClick = t => {
            const e = t.currentTarget;
            1 === e.nodeType && this.isFocusableElement(e) && (this.prevActiveTabIndex = this.activeTabIndex, this.activeTabIndex = this.tabs.indexOf(e), this.setComponent())
        }, this.handleTabKeyDown = t => {
            if (this.isHorizontal()) switch (t.key) {
                case"ArrowLeft":
                    t.preventDefault(), this.adjustBackward(t);
                    break;
                case"ArrowRight":
                    t.preventDefault(), this.adjustForward(t)
            } else switch (t.key) {
                case"ArrowUp":
                    t.preventDefault(), this.adjustBackward(t);
                    break;
                case"ArrowDown":
                    t.preventDefault(), this.adjustForward(t)
            }
            switch (t.key) {
                case"Home":
                    t.preventDefault(), this.adjust(-this.activeTabIndex);
                    break;
                case"End":
                    t.preventDefault(), this.adjust(this.tabs.length - this.activeTabIndex - 1)
            }
        }, this.adjustForward = t => {
            const e = this.tabs;
            let i = 0;
            for (i = this.activetab ? e.indexOf(this.activetab) + 1 : 1, i === e.length && (i = 0); i < e.length && e.length > 1;) {
                if (this.isFocusableElement(e[i])) {
                    this.moveToTabByIndex(e, i);
                    break
                }
                if (this.activetab && i === e.indexOf(this.activetab)) break;
                i + 1 >= e.length ? i = 0 : i += 1
            }
        }, this.adjustBackward = t => {
            const e = this.tabs;
            let i = 0;
            for (i = this.activetab ? e.indexOf(this.activetab) - 1 : 0, i = i < 0 ? e.length - 1 : i; i >= 0 && e.length > 1;) {
                if (this.isFocusableElement(e[i])) {
                    this.moveToTabByIndex(e, i);
                    break
                }
                i - 1 < 0 ? i = e.length - 1 : i -= 1
            }
        }, this.moveToTabByIndex = (t, e) => {
            const i = t[e];
            this.activetab = i, this.prevActiveTabIndex = this.activeTabIndex, this.activeTabIndex = e, i.focus(), this.setComponent()
        }
    }

    orientationChanged() {
        this.$fastController.isConnected && (this.setTabs(), this.setTabPanels(), this.handleActiveIndicatorPosition())
    }

    activeidChanged(t, e) {
        this.$fastController.isConnected && this.tabs.length <= this.tabpanels.length && (this.prevActiveTabIndex = this.tabs.findIndex(e => e.id === t), this.setTabs(), this.setTabPanels(), this.handleActiveIndicatorPosition())
    }

    tabsChanged() {
        this.$fastController.isConnected && this.tabs.length <= this.tabpanels.length && (this.tabIds = this.getTabIds(), this.tabpanelIds = this.getTabPanelIds(), this.setTabs(), this.setTabPanels(), this.handleActiveIndicatorPosition())
    }

    tabpanelsChanged() {
        this.$fastController.isConnected && this.tabpanels.length <= this.tabs.length && (this.tabIds = this.getTabIds(), this.tabpanelIds = this.getTabPanelIds(), this.setTabs(), this.setTabPanels(), this.handleActiveIndicatorPosition())
    }

    getActiveIndex() {
        return void 0 !== this.activeid ? -1 === this.tabIds.indexOf(this.activeid) ? 0 : this.tabIds.indexOf(this.activeid) : 0
    }

    getTabIds() {
        return this.tabs.map(t => {
            var e;
            return null !== (e = t.getAttribute("id")) && void 0 !== e ? e : "tab-" + We()
        })
    }

    getTabPanelIds() {
        return this.tabpanels.map(t => {
            var e;
            return null !== (e = t.getAttribute("id")) && void 0 !== e ? e : "panel-" + We()
        })
    }

    setComponent() {
        this.activeTabIndex !== this.prevActiveTabIndex && (this.activeid = this.tabIds[this.activeTabIndex], this.focusTab(), this.change())
    }

    isHorizontal() {
        return this.orientation === Es
    }

    handleActiveIndicatorPosition() {
        this.showActiveIndicator && this.activeindicator && this.activeTabIndex !== this.prevActiveTabIndex && (this.ticking ? this.ticking = !1 : (this.ticking = !0, this.animateActiveIndicator()))
    }

    animateActiveIndicator() {
        this.ticking = !0;
        const t = this.isHorizontal() ? "gridColumn" : "gridRow", e = this.isHorizontal() ? "translateX" : "translateY",
            i = this.isHorizontal() ? "offsetLeft" : "offsetTop", o = this.activeIndicatorRef[i];
        this.activeIndicatorRef.style[t] = "" + (this.activeTabIndex + 1);
        const s = this.activeIndicatorRef[i];
        this.activeIndicatorRef.style[t] = "" + (this.prevActiveTabIndex + 1);
        const n = s - o;
        this.activeIndicatorRef.style.transform = `${e}(${n}px)`, this.activeIndicatorRef.classList.add("activeIndicatorTransition"), this.activeIndicatorRef.addEventListener("transitionend", () => {
            this.ticking = !1, this.activeIndicatorRef.style[t] = "" + (this.activeTabIndex + 1), this.activeIndicatorRef.style.transform = e + "(0px)", this.activeIndicatorRef.classList.remove("activeIndicatorTransition")
        })
    }

    adjust(t) {
        this.prevActiveTabIndex = this.activeTabIndex, this.activeTabIndex = Ue(0, this.tabs.length - 1, this.activeTabIndex + t), this.setComponent()
    }

    focusTab() {
        this.tabs[this.activeTabIndex].focus()
    }

    connectedCallback() {
        super.connectedCallback(), this.tabIds = this.getTabIds(), this.tabpanelIds = this.getTabPanelIds(), this.activeTabIndex = this.getActiveIndex()
    }
}

Kt([st], Vs.prototype, "orientation", void 0), Kt([st], Vs.prototype, "activeid", void 0), Kt([f], Vs.prototype, "tabs", void 0), Kt([f], Vs.prototype, "tabpanels", void 0), Kt([st({mode: "boolean"})], Vs.prototype, "activeindicator", void 0), Kt([f], Vs.prototype, "activeIndicatorRef", void 0), Kt([f], Vs.prototype, "showActiveIndicator", void 0), Ae(Vs, Ut);

class Rs extends Ee {
}

class As extends (ci(Rs)) {
    constructor() {
        super(...arguments), this.proxy = document.createElement("textarea")
    }
}

const Ls = "none";

class Ps extends As {
    constructor() {
        super(...arguments), this.resize = Ls, this.cols = 20, this.handleTextInput = () => {
            this.value = this.control.value
        }
    }

    readOnlyChanged() {
        this.proxy instanceof HTMLTextAreaElement && (this.proxy.readOnly = this.readOnly)
    }

    autofocusChanged() {
        this.proxy instanceof HTMLTextAreaElement && (this.proxy.autofocus = this.autofocus)
    }

    listChanged() {
        this.proxy instanceof HTMLTextAreaElement && this.proxy.setAttribute("list", this.list)
    }

    maxlengthChanged() {
        this.proxy instanceof HTMLTextAreaElement && (this.proxy.maxLength = this.maxlength)
    }

    minlengthChanged() {
        this.proxy instanceof HTMLTextAreaElement && (this.proxy.minLength = this.minlength)
    }

    spellcheckChanged() {
        this.proxy instanceof HTMLTextAreaElement && (this.proxy.spellcheck = this.spellcheck)
    }

    select() {
        this.control.select(), this.$emit("select")
    }

    handleChange() {
        this.$emit("change")
    }

    validate() {
        super.validate(this.control)
    }
}

Kt([st({mode: "boolean"})], Ps.prototype, "readOnly", void 0), Kt([st], Ps.prototype, "resize", void 0), Kt([st({mode: "boolean"})], Ps.prototype, "autofocus", void 0), Kt([st({attribute: "form"})], Ps.prototype, "formId", void 0), Kt([st], Ps.prototype, "list", void 0), Kt([st({converter: it})], Ps.prototype, "maxlength", void 0), Kt([st({converter: it})], Ps.prototype, "minlength", void 0), Kt([st], Ps.prototype, "name", void 0), Kt([st], Ps.prototype, "placeholder", void 0), Kt([st({
    converter: it,
    mode: "fromView"
})], Ps.prototype, "cols", void 0), Kt([st({
    converter: it,
    mode: "fromView"
})], Ps.prototype, "rows", void 0), Kt([st({mode: "boolean"})], Ps.prototype, "spellcheck", void 0), Kt([f], Ps.prototype, "defaultSlottedNodes", void 0), Ae(Ps, Jo);
const zs = Object.freeze({
    [Ne.ArrowUp]: {[ze]: -1},
    [Ne.ArrowDown]: {[ze]: 1},
    [Ne.ArrowLeft]: {[Pe]: {[je.ltr]: -1, [je.rtl]: 1}},
    [Ne.ArrowRight]: {[Pe]: {[je.ltr]: 1, [je.rtl]: -1}}
});

class Hs extends Ee {
    constructor() {
        super(...arguments), this._activeIndex = 0, this.direction = je.ltr, this.orientation = Pe
    }

    get activeIndex() {
        return g.track(this, "activeIndex"), this._activeIndex
    }

    set activeIndex(t) {
        this.$fastController.isConnected && (this._activeIndex = qe(0, this.focusableElements.length - 1, t), g.notify(this, "activeIndex"))
    }

    slottedItemsChanged() {
        this.$fastController.isConnected && this.reduceFocusableElements()
    }

    clickHandler(t) {
        var e;
        const i = null === (e = this.focusableElements) || void 0 === e ? void 0 : e.indexOf(t.target);
        return i > -1 && this.activeIndex !== i && this.setFocusedElement(i), !0
    }

    childItemsChanged(t, e) {
        this.$fastController.isConnected && this.reduceFocusableElements()
    }

    connectedCallback() {
        super.connectedCallback(), this.direction = ii(this)
    }

    focusinHandler(t) {
        const e = t.relatedTarget;
        e && !this.contains(e) && this.setFocusedElement()
    }

    getDirectionalIncrementer(t) {
        var e, i, o, s, n;
        return null !== (n = null !== (o = null === (i = null === (e = zs[t]) || void 0 === e ? void 0 : e[this.orientation]) || void 0 === i ? void 0 : i[this.direction]) && void 0 !== o ? o : null === (s = zs[t]) || void 0 === s ? void 0 : s[this.orientation]) && void 0 !== n ? n : 0
    }

    keydownHandler(t) {
        const e = t.key;
        if (!(e in Ne) || t.defaultPrevented || t.shiftKey) return !0;
        const i = this.getDirectionalIncrementer(e);
        if (!i) return !t.target.closest("[role=radiogroup]");
        const o = this.activeIndex + i;
        return this.focusableElements[o] && t.preventDefault(), this.setFocusedElement(o), !0
    }

    get allSlottedItems() {
        return [...this.start.assignedElements(), ...this.slottedItems, ...this.end.assignedElements()]
    }

    reduceFocusableElements() {
        var t;
        const e = null === (t = this.focusableElements) || void 0 === t ? void 0 : t[this.activeIndex];
        this.focusableElements = this.allSlottedItems.reduce(Hs.reduceFocusableItems, []);
        const i = this.focusableElements.indexOf(e);
        this.activeIndex = Math.max(0, i), this.setFocusableElements()
    }

    setFocusedElement(t = this.activeIndex) {
        var e;
        this.activeIndex = t, this.setFocusableElements(), null === (e = this.focusableElements[this.activeIndex]) || void 0 === e || e.focus()
    }

    static reduceFocusableItems(t, e) {
        var i, o, s, n;
        const r = "radio" === e.getAttribute("role"),
            a = null === (o = null === (i = e.$fastController) || void 0 === i ? void 0 : i.definition.shadowOptions) || void 0 === o ? void 0 : o.delegatesFocus,
            l = Array.from(null !== (n = null === (s = e.shadowRoot) || void 0 === s ? void 0 : s.querySelectorAll("*")) && void 0 !== n ? n : []).some(t => Lo(t));
        return e.hasAttribute("disabled") || e.hasAttribute("hidden") || !(Lo(e) || r || a || l) ? e.childElementCount ? t.concat(Array.from(e.children).reduce(Hs.reduceFocusableItems, [])) : t : (t.push(e), t)
    }

    setFocusableElements() {
        this.$fastController.isConnected && this.focusableElements.length > 0 && this.focusableElements.forEach((t, e) => {
            t.tabIndex = this.activeIndex === e ? 0 : -1
        })
    }
}

Kt([f], Hs.prototype, "direction", void 0), Kt([st], Hs.prototype, "orientation", void 0), Kt([f], Hs.prototype, "slottedItems", void 0), Kt([f], Hs.prototype, "slottedLabel", void 0), Kt([f], Hs.prototype, "childItems", void 0);

class Ms {
}

Kt([st({attribute: "aria-labelledby"})], Ms.prototype, "ariaLabelledby", void 0), Kt([st({attribute: "aria-label"})], Ms.prototype, "ariaLabel", void 0), Ae(Ms, Je), Ae(Hs, Ut, Ms);
const Bs = "top", Ns = "right", js = "bottom", Us = "left", qs = "start", _s = "end", Gs = "top-left", Ws = "top-right",
    Ks = "bottom-left", Xs = "bottom-right", Ys = "top-start", Qs = "top-end", Zs = "bottom-start", Js = "bottom-end";

class tn extends Ee {
    constructor() {
        super(...arguments), this.anchor = "", this.delay = 300, this.autoUpdateMode = "anchor", this.anchorElement = null, this.viewportElement = null, this.verticalPositioningMode = "dynamic", this.horizontalPositioningMode = "dynamic", this.horizontalInset = "false", this.verticalInset = "false", this.horizontalScaling = "content", this.verticalScaling = "content", this.verticalDefaultPosition = void 0, this.horizontalDefaultPosition = void 0, this.tooltipVisible = !1, this.currentDirection = je.ltr, this.showDelayTimer = null, this.hideDelayTimer = null, this.isAnchorHoveredFocused = !1, this.isRegionHovered = !1, this.handlePositionChange = t => {
            this.classList.toggle("top", "start" === this.region.verticalPosition), this.classList.toggle("bottom", "end" === this.region.verticalPosition), this.classList.toggle("inset-top", "insetStart" === this.region.verticalPosition), this.classList.toggle("inset-bottom", "insetEnd" === this.region.verticalPosition), this.classList.toggle("center-vertical", "center" === this.region.verticalPosition), this.classList.toggle("left", "start" === this.region.horizontalPosition), this.classList.toggle("right", "end" === this.region.horizontalPosition), this.classList.toggle("inset-left", "insetStart" === this.region.horizontalPosition), this.classList.toggle("inset-right", "insetEnd" === this.region.horizontalPosition), this.classList.toggle("center-horizontal", "center" === this.region.horizontalPosition)
        }, this.handleRegionMouseOver = t => {
            this.isRegionHovered = !0
        }, this.handleRegionMouseOut = t => {
            this.isRegionHovered = !1, this.startHideDelayTimer()
        }, this.handleAnchorMouseOver = t => {
            this.tooltipVisible ? this.isAnchorHoveredFocused = !0 : this.startShowDelayTimer()
        }, this.handleAnchorMouseOut = t => {
            this.isAnchorHoveredFocused = !1, this.clearShowDelayTimer(), this.startHideDelayTimer()
        }, this.handleAnchorFocusIn = t => {
            this.startShowDelayTimer()
        }, this.handleAnchorFocusOut = t => {
            this.isAnchorHoveredFocused = !1, this.clearShowDelayTimer(), this.startHideDelayTimer()
        }, this.startHideDelayTimer = () => {
            this.clearHideDelayTimer(), this.tooltipVisible && (this.hideDelayTimer = window.setTimeout(() => {
                this.updateTooltipVisibility()
            }, 60))
        }, this.clearHideDelayTimer = () => {
            null !== this.hideDelayTimer && (clearTimeout(this.hideDelayTimer), this.hideDelayTimer = null)
        }, this.startShowDelayTimer = () => {
            this.isAnchorHoveredFocused || (this.delay > 1 ? null === this.showDelayTimer && (this.showDelayTimer = window.setTimeout(() => {
                this.startHover()
            }, this.delay)) : this.startHover())
        }, this.startHover = () => {
            this.isAnchorHoveredFocused = !0, this.updateTooltipVisibility()
        }, this.clearShowDelayTimer = () => {
            null !== this.showDelayTimer && (clearTimeout(this.showDelayTimer), this.showDelayTimer = null)
        }, this.getAnchor = () => {
            const t = this.getRootNode();
            return t instanceof ShadowRoot ? t.getElementById(this.anchor) : document.getElementById(this.anchor)
        }, this.handleDocumentKeydown = t => {
            if (!t.defaultPrevented && this.tooltipVisible) switch (t.key) {
                case"Escape":
                    this.isAnchorHoveredFocused = !1, this.updateTooltipVisibility(), this.$emit("dismiss")
            }
        }, this.updateTooltipVisibility = () => {
            if (!1 === this.visible) this.hideTooltip(); else {
                if (!0 === this.visible) return void this.showTooltip();
                if (this.isAnchorHoveredFocused || this.isRegionHovered) return void this.showTooltip();
                this.hideTooltip()
            }
        }, this.showTooltip = () => {
            this.tooltipVisible || (this.currentDirection = ii(this), this.tooltipVisible = !0, document.addEventListener("keydown", this.handleDocumentKeydown), d.queueUpdate(this.setRegionProps))
        }, this.hideTooltip = () => {
            this.tooltipVisible && (this.clearHideDelayTimer(), null !== this.region && void 0 !== this.region && (this.region.removeEventListener("positionchange", this.handlePositionChange), this.region.viewportElement = null, this.region.anchorElement = null, this.region.removeEventListener("mouseover", this.handleRegionMouseOver), this.region.removeEventListener("mouseout", this.handleRegionMouseOut)), document.removeEventListener("keydown", this.handleDocumentKeydown), this.tooltipVisible = !1)
        }, this.setRegionProps = () => {
            this.tooltipVisible && (this.region.viewportElement = this.viewportElement, this.region.anchorElement = this.anchorElement, this.region.addEventListener("positionchange", this.handlePositionChange), this.region.addEventListener("mouseover", this.handleRegionMouseOver, {passive: !0}), this.region.addEventListener("mouseout", this.handleRegionMouseOut, {passive: !0}))
        }
    }

    visibleChanged() {
        this.$fastController.isConnected && (this.updateTooltipVisibility(), this.updateLayout())
    }

    anchorChanged() {
        this.$fastController.isConnected && (this.anchorElement = this.getAnchor())
    }

    positionChanged() {
        this.$fastController.isConnected && this.updateLayout()
    }

    anchorElementChanged(t) {
        if (this.$fastController.isConnected) {
            if (null != t && (t.removeEventListener("mouseover", this.handleAnchorMouseOver), t.removeEventListener("mouseout", this.handleAnchorMouseOut), t.removeEventListener("focusin", this.handleAnchorFocusIn), t.removeEventListener("focusout", this.handleAnchorFocusOut)), null !== this.anchorElement && void 0 !== this.anchorElement) {
                this.anchorElement.addEventListener("mouseover", this.handleAnchorMouseOver, {passive: !0}), this.anchorElement.addEventListener("mouseout", this.handleAnchorMouseOut, {passive: !0}), this.anchorElement.addEventListener("focusin", this.handleAnchorFocusIn, {passive: !0}), this.anchorElement.addEventListener("focusout", this.handleAnchorFocusOut, {passive: !0});
                const t = this.anchorElement.id;
                null !== this.anchorElement.parentElement && this.anchorElement.parentElement.querySelectorAll(":hover").forEach(e => {
                    e.id === t && this.startShowDelayTimer()
                })
            }
            null !== this.region && void 0 !== this.region && this.tooltipVisible && (this.region.anchorElement = this.anchorElement), this.updateLayout()
        }
    }

    viewportElementChanged() {
        null !== this.region && void 0 !== this.region && (this.region.viewportElement = this.viewportElement), this.updateLayout()
    }

    connectedCallback() {
        super.connectedCallback(), this.anchorElement = this.getAnchor(), this.updateTooltipVisibility()
    }

    disconnectedCallback() {
        this.hideTooltip(), this.clearShowDelayTimer(), this.clearHideDelayTimer(), super.disconnectedCallback()
    }

    updateLayout() {
        switch (this.verticalPositioningMode = "locktodefault", this.horizontalPositioningMode = "locktodefault", this.position) {
            case Bs:
            case js:
                this.verticalDefaultPosition = this.position, this.horizontalDefaultPosition = "center";
                break;
            case Ns:
            case Us:
            case qs:
            case _s:
                this.verticalDefaultPosition = "center", this.horizontalDefaultPosition = this.position;
                break;
            case Gs:
                this.verticalDefaultPosition = "top", this.horizontalDefaultPosition = "left";
                break;
            case Ws:
                this.verticalDefaultPosition = "top", this.horizontalDefaultPosition = "right";
                break;
            case Ks:
                this.verticalDefaultPosition = "bottom", this.horizontalDefaultPosition = "left";
                break;
            case Xs:
                this.verticalDefaultPosition = "bottom", this.horizontalDefaultPosition = "right";
                break;
            case Ys:
                this.verticalDefaultPosition = "top", this.horizontalDefaultPosition = "start";
                break;
            case Qs:
                this.verticalDefaultPosition = "top", this.horizontalDefaultPosition = "end";
                break;
            case Zs:
                this.verticalDefaultPosition = "bottom", this.horizontalDefaultPosition = "start";
                break;
            case Js:
                this.verticalDefaultPosition = "bottom", this.horizontalDefaultPosition = "end";
                break;
            default:
                this.verticalPositioningMode = "dynamic", this.horizontalPositioningMode = "dynamic", this.verticalDefaultPosition = void 0, this.horizontalDefaultPosition = "center"
        }
    }
}

Kt([st({mode: "boolean"})], tn.prototype, "visible", void 0), Kt([st], tn.prototype, "anchor", void 0), Kt([st], tn.prototype, "delay", void 0), Kt([st], tn.prototype, "position", void 0), Kt([st({attribute: "auto-update-mode"})], tn.prototype, "autoUpdateMode", void 0), Kt([st({attribute: "horizontal-viewport-lock"})], tn.prototype, "horizontalViewportLock", void 0), Kt([st({attribute: "vertical-viewport-lock"})], tn.prototype, "verticalViewportLock", void 0), Kt([f], tn.prototype, "anchorElement", void 0), Kt([f], tn.prototype, "viewportElement", void 0), Kt([f], tn.prototype, "verticalPositioningMode", void 0), Kt([f], tn.prototype, "horizontalPositioningMode", void 0), Kt([f], tn.prototype, "horizontalInset", void 0), Kt([f], tn.prototype, "verticalInset", void 0), Kt([f], tn.prototype, "horizontalScaling", void 0), Kt([f], tn.prototype, "verticalScaling", void 0), Kt([f], tn.prototype, "verticalDefaultPosition", void 0), Kt([f], tn.prototype, "horizontalDefaultPosition", void 0), Kt([f], tn.prototype, "tooltipVisible", void 0), Kt([f], tn.prototype, "currentDirection", void 0);

function en(t) {
    return He(t) && "treeitem" === t.getAttribute("role")
}

class on extends Ee {
    constructor() {
        super(...arguments), this.expanded = !1, this.focusable = !1, this.isNestedItem = () => en(this.parentElement), this.handleExpandCollapseButtonClick = t => {
            this.disabled || t.defaultPrevented || (this.expanded = !this.expanded)
        }, this.handleFocus = t => {
            this.setAttribute("tabindex", "0")
        }, this.handleBlur = t => {
            this.setAttribute("tabindex", "-1")
        }
    }

    expandedChanged() {
        this.$fastController.isConnected && this.$emit("expanded-change", this)
    }

    selectedChanged() {
        this.$fastController.isConnected && this.$emit("selected-change", this)
    }

    itemsChanged(t, e) {
        this.$fastController.isConnected && this.items.forEach(t => {
            en(t) && (t.nested = !0)
        })
    }

    static focusItem(t) {
        t.focusable = !0, t.focus()
    }

    childItemLength() {
        const t = this.childItems.filter(t => en(t));
        return t ? t.length : 0
    }
}

Kt([st({mode: "boolean"})], on.prototype, "expanded", void 0), Kt([st({mode: "boolean"})], on.prototype, "selected", void 0), Kt([st({mode: "boolean"})], on.prototype, "disabled", void 0), Kt([f], on.prototype, "focusable", void 0), Kt([f], on.prototype, "childItems", void 0), Kt([f], on.prototype, "items", void 0), Kt([f], on.prototype, "nested", void 0), Kt([f], on.prototype, "renderCollapsedChildren", void 0), Ae(on, Ut);

class sn extends Ee {
    constructor() {
        super(...arguments), this.currentFocused = null, this.handleFocus = t => {
            if (!(this.slottedTreeItems.length < 1)) return t.target === this ? (null === this.currentFocused && (this.currentFocused = this.getValidFocusableItem()), void (null !== this.currentFocused && on.focusItem(this.currentFocused))) : void (this.contains(t.target) && (this.setAttribute("tabindex", "-1"), this.currentFocused = t.target))
        }, this.handleBlur = t => {
            t.target instanceof HTMLElement && (null === t.relatedTarget || !this.contains(t.relatedTarget)) && this.setAttribute("tabindex", "0")
        }, this.handleKeyDown = t => {
            if (t.defaultPrevented) return;
            if (this.slottedTreeItems.length < 1) return !0;
            const e = this.getVisibleNodes();
            switch (t.key) {
                case"Home":
                    return void (e.length && on.focusItem(e[0]));
                case"End":
                    return void (e.length && on.focusItem(e[e.length - 1]));
                case"ArrowLeft":
                    if (t.target && this.isFocusableElement(t.target)) {
                        const e = t.target;
                        e instanceof on && e.childItemLength() > 0 && e.expanded ? e.expanded = !1 : e instanceof on && e.parentElement instanceof on && on.focusItem(e.parentElement)
                    }
                    return !1;
                case"ArrowRight":
                    if (t.target && this.isFocusableElement(t.target)) {
                        const e = t.target;
                        e instanceof on && e.childItemLength() > 0 && !e.expanded ? e.expanded = !0 : e instanceof on && e.childItemLength() > 0 && this.focusNextNode(1, t.target)
                    }
                    return;
                case"ArrowDown":
                    return void (t.target && this.isFocusableElement(t.target) && this.focusNextNode(1, t.target));
                case"ArrowUp":
                    return void (t.target && this.isFocusableElement(t.target) && this.focusNextNode(-1, t.target));
                case"Enter":
                    return void this.handleClick(t)
            }
            return !0
        }, this.handleSelectedChange = t => {
            if (t.defaultPrevented) return;
            if (!(t.target instanceof Element && en(t.target))) return !0;
            const e = t.target;
            e.selected ? (this.currentSelected && this.currentSelected !== e && (this.currentSelected.selected = !1), this.currentSelected = e) : e.selected || this.currentSelected !== e || (this.currentSelected = null)
        }, this.setItems = () => {
            const t = this.treeView.querySelector("[aria-selected='true']");
            this.currentSelected = t, null !== this.currentFocused && this.contains(this.currentFocused) || (this.currentFocused = this.getValidFocusableItem()), this.nested = this.checkForNestedItems();
            this.getVisibleNodes().forEach(t => {
                en(t) && (t.nested = this.nested)
            })
        }, this.isFocusableElement = t => en(t), this.isSelectedElement = t => t.selected
    }

    slottedTreeItemsChanged() {
        this.$fastController.isConnected && this.setItems()
    }

    connectedCallback() {
        super.connectedCallback(), this.setAttribute("tabindex", "0"), d.queueUpdate(() => {
            this.setItems()
        })
    }

    handleClick(t) {
        if (t.defaultPrevented) return;
        if (!(t.target instanceof Element && en(t.target))) return !0;
        const e = t.target;
        e.disabled || (e.selected = !e.selected)
    }

    focusNextNode(t, e) {
        const i = this.getVisibleNodes();
        if (!i) return;
        const o = i[i.indexOf(e) + t];
        He(o) && on.focusItem(o)
    }

    getValidFocusableItem() {
        const t = this.getVisibleNodes();
        let e = t.findIndex(this.isSelectedElement);
        return -1 === e && (e = t.findIndex(this.isFocusableElement)), -1 !== e ? t[e] : null
    }

    checkForNestedItems() {
        return this.slottedTreeItems.some(t => en(t) && t.querySelector("[role='treeitem']"))
    }

    getVisibleNodes() {
        return function (t, e) {
            if (!t || !e || !He(t)) return;
            return Array.from(t.querySelectorAll(e)).filter(t => null !== t.offsetParent)
        }(this, "[role='treeitem']") || []
    }
}

Kt([st({attribute: "render-collapsed-nodes"})], sn.prototype, "renderCollapsedNodes", void 0), Kt([f], sn.prototype, "currentSelected", void 0), Kt([f], sn.prototype, "slottedTreeItems", void 0);

class nn extends class {
    constructor(t) {
        this.listenerCache = new WeakMap, this.query = t
    }

    bind(t) {
        const {query: e} = this, i = this.constructListener(t);
        i.bind(e)(), e.addListener(i), this.listenerCache.set(t, i)
    }

    unbind(t) {
        const e = this.listenerCache.get(t);
        e && (this.query.removeListener(e), this.listenerCache.delete(t))
    }
} {
    constructor(t, e) {
        super(t), this.styles = e
    }

    static with(t) {
        return e => new nn(t, e)
    }

    constructListener(t) {
        let e = !1;
        const i = this.styles;
        return function () {
            const {matches: o} = this;
            o && !e ? (t.$fastController.addStyles(i), e = o) : !o && e && (t.$fastController.removeStyles(i), e = o)
        }
    }

    unbind(t) {
        super.unbind(t), t.$fastController.removeStyles(this.styles)
    }
}

const rn = nn.with(window.matchMedia("(forced-colors)"));
nn.with(window.matchMedia("(prefers-color-scheme: dark)")), nn.with(window.matchMedia("(prefers-color-scheme: light)"));

class an {
    constructor(t, e, i) {
        this.propertyName = t, this.value = e, this.styles = i
    }

    bind(t) {
        g.getNotifier(t).subscribe(this, this.propertyName), this.handleChange(t, this.propertyName)
    }

    unbind(t) {
        g.getNotifier(t).unsubscribe(this, this.propertyName), t.$fastController.removeStyles(this.styles)
    }

    handleChange(t, e) {
        t[e] === this.value ? t.$fastController.addStyles(this.styles) : t.$fastController.removeStyles(this.styles)
    }
}

function ln(t) {
    return `:host([hidden]){display:none}:host{display:${t}}`
}

const cn = function () {
    if ("boolean" == typeof Me) return Me;
    if ("undefined" == typeof window || !window.document || !window.document.createElement) return Me = !1, Me;
    const t = document.createElement("style"), e = function () {
        const t = document.querySelector('meta[property="csp-nonce"]');
        return t ? t.getAttribute("content") : null
    }();
    null !== e && t.setAttribute("nonce", e), document.head.appendChild(t);
    try {
        t.sheet.insertRule("foo:focus-visible {color:inherit}", 0), Me = !0
    } catch (t) {
        Me = !1
    } finally {
        document.head.removeChild(t)
    }
    return Me
}() ? "focus-visible" : "focus";

function hn(t, e, i) {
    return isNaN(t) || t <= e ? e : t >= i ? i : t
}

function dn(t, e, i) {
    return isNaN(t) || t <= e ? 0 : t >= i ? 1 : t / (i - e)
}

function un(t, e, i) {
    return isNaN(t) ? e : e + t * (i - e)
}

function pn(t, e, i) {
    return isNaN(t) || t <= 0 ? e : t >= 1 ? i : e + t * (i - e)
}

function gn(t, e) {
    const i = Math.pow(10, e);
    return Math.round(t * i) / i
}

class fn {
    constructor(t, e, i) {
        this.h = t, this.s = e, this.l = i
    }

    static fromObject(t) {
        return !t || isNaN(t.h) || isNaN(t.s) || isNaN(t.l) ? null : new fn(t.h, t.s, t.l)
    }

    equalValue(t) {
        return this.h === t.h && this.s === t.s && this.l === t.l
    }

    roundToPrecision(t) {
        return new fn(gn(this.h, t), gn(this.s, t), gn(this.l, t))
    }

    toObject() {
        return {h: this.h, s: this.s, l: this.l}
    }
}

class mn {
    constructor(t, e, i) {
        this.l = t, this.a = e, this.b = i
    }

    static fromObject(t) {
        return !t || isNaN(t.l) || isNaN(t.a) || isNaN(t.b) ? null : new mn(t.l, t.a, t.b)
    }

    equalValue(t) {
        return this.l === t.l && this.a === t.a && this.b === t.b
    }

    roundToPrecision(t) {
        return new mn(gn(this.l, t), gn(this.a, t), gn(this.b, t))
    }

    toObject() {
        return {l: this.l, a: this.a, b: this.b}
    }
}

mn.epsilon = 216 / 24389, mn.kappa = 24389 / 27;

class vn {
    constructor(t, e, i, o) {
        this.r = t, this.g = e, this.b = i, this.a = "number" != typeof o || isNaN(o) ? 1 : o
    }

    static fromObject(t) {
        return !t || isNaN(t.r) || isNaN(t.g) || isNaN(t.b) ? null : new vn(t.r, t.g, t.b, t.a)
    }

    equalValue(t) {
        return this.r === t.r && this.g === t.g && this.b === t.b && this.a === t.a
    }

    toStringHexRGB() {
        return "#" + [this.r, this.g, this.b].map(this.formatHexValue).join("")
    }

    toStringHexRGBA() {
        return this.toStringHexRGB() + this.formatHexValue(this.a)
    }

    toStringHexARGB() {
        return "#" + [this.a, this.r, this.g, this.b].map(this.formatHexValue).join("")
    }

    toStringWebRGB() {
        return `rgb(${Math.round(un(this.r, 0, 255))},${Math.round(un(this.g, 0, 255))},${Math.round(un(this.b, 0, 255))})`
    }

    toStringWebRGBA() {
        return `rgba(${Math.round(un(this.r, 0, 255))},${Math.round(un(this.g, 0, 255))},${Math.round(un(this.b, 0, 255))},${hn(this.a, 0, 1)})`
    }

    roundToPrecision(t) {
        return new vn(gn(this.r, t), gn(this.g, t), gn(this.b, t), gn(this.a, t))
    }

    clamp() {
        return new vn(hn(this.r, 0, 1), hn(this.g, 0, 1), hn(this.b, 0, 1), hn(this.a, 0, 1))
    }

    toObject() {
        return {r: this.r, g: this.g, b: this.b, a: this.a}
    }

    formatHexValue(t) {
        return function (t) {
            const e = Math.round(hn(t, 0, 255)).toString(16);
            return 1 === e.length ? "0" + e : e
        }(un(t, 0, 255))
    }
}

class bn {
    constructor(t, e, i) {
        this.x = t, this.y = e, this.z = i
    }

    static fromObject(t) {
        return !t || isNaN(t.x) || isNaN(t.y) || isNaN(t.z) ? null : new bn(t.x, t.y, t.z)
    }

    equalValue(t) {
        return this.x === t.x && this.y === t.y && this.z === t.z
    }

    roundToPrecision(t) {
        return new bn(gn(this.x, t), gn(this.y, t), gn(this.z, t))
    }

    toObject() {
        return {x: this.x, y: this.y, z: this.z}
    }
}

function yn(t) {
    function e(t) {
        return t <= .03928 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4)
    }

    return function (t) {
        return .2126 * t.r + .7152 * t.g + .0722 * t.b
    }(new vn(e(t.r), e(t.g), e(t.b), 1))
}

function xn(t, e, i) {
    return i - e == 0 ? 0 : (t - e) / (i - e)
}

function $n(t, e, i) {
    return (xn(t.r, e.r, i.r) + xn(t.g, e.g, i.g) + xn(t.b, e.b, i.b)) / 3
}

function wn(t) {
    const e = Math.max(t.r, t.g, t.b), i = Math.min(t.r, t.g, t.b), o = e - i;
    let s = 0;
    0 !== o && (s = e === t.r ? (t.g - t.b) / o % 6 * 60 : e === t.g ? 60 * ((t.b - t.r) / o + 2) : 60 * ((t.r - t.g) / o + 4)), s < 0 && (s += 360);
    const n = (e + i) / 2;
    let r = 0;
    return 0 !== o && (r = o / (1 - Math.abs(2 * n - 1))), new fn(s, r, n)
}

function kn(t) {
    return function (t) {
        function e(t) {
            return t > mn.epsilon ? Math.pow(t, 1 / 3) : (mn.kappa * t + 16) / 116
        }

        const i = e(t.x / bn.whitePoint.x), o = e(t.y / bn.whitePoint.y), s = e(t.z / bn.whitePoint.z);
        return new mn(116 * o - 16, 500 * (i - o), 200 * (o - s))
    }(function (t) {
        function e(t) {
            return t <= .04045 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4)
        }

        const i = e(t.r), o = e(t.g), s = e(t.b);
        return new bn(.4124564 * i + .3575761 * o + .1804375 * s, .2126729 * i + .7151522 * o + .072175 * s, .0193339 * i + .119192 * o + .9503041 * s)
    }(t))
}

function Cn(t, e = 1) {
    return function (t, e = 1) {
        function i(t) {
            return t <= .0031308 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - .055
        }

        const o = i(3.2404542 * t.x - 1.5371385 * t.y - .4985314 * t.z),
            s = i(-.969266 * t.x + 1.8760108 * t.y + .041556 * t.z),
            n = i(.0556434 * t.x - .2040259 * t.y + 1.0572252 * t.z);
        return new vn(o, s, n, e)
    }(function (t) {
        const e = (t.l + 16) / 116, i = e + t.a / 500, o = e - t.b / 200, s = Math.pow(i, 3), n = Math.pow(e, 3),
            r = Math.pow(o, 3);
        let a = 0;
        a = s > mn.epsilon ? s : (116 * i - 16) / mn.kappa;
        let l = 0;
        l = t.l > mn.epsilon * mn.kappa ? n : t.l / mn.kappa;
        let c = 0;
        return c = r > mn.epsilon ? r : (116 * o - 16) / mn.kappa, a = bn.whitePoint.x * a, l = bn.whitePoint.y * l, c = bn.whitePoint.z * c, new bn(a, l, c)
    }(t), e)
}

var In, Fn;

function Dn(t, e, i) {
    return isNaN(t) || t <= 0 ? e : t >= 1 ? i : new vn(pn(t, e.r, i.r), pn(t, e.g, i.g), pn(t, e.b, i.b), pn(t, e.a, i.a))
}

bn.whitePoint = new bn(.95047, 1, 1.08883), function (t) {
    t[t.Burn = 0] = "Burn", t[t.Color = 1] = "Color", t[t.Darken = 2] = "Darken", t[t.Dodge = 3] = "Dodge", t[t.Lighten = 4] = "Lighten", t[t.Multiply = 5] = "Multiply", t[t.Overlay = 6] = "Overlay", t[t.Screen = 7] = "Screen"
}(In || (In = {})), function (t) {
    t[t.RGB = 0] = "RGB", t[t.HSL = 1] = "HSL", t[t.HSV = 2] = "HSV", t[t.XYZ = 3] = "XYZ", t[t.LAB = 4] = "LAB", t[t.LCH = 5] = "LCH"
}(Fn || (Fn = {}));
const Tn = /^#((?:[0-9a-f]{6}|[0-9a-f]{3}))$/i;

function Sn(t) {
    const e = Tn.exec(t);
    if (null === e) return null;
    let i = e[1];
    if (3 === i.length) {
        const t = i.charAt(0), e = i.charAt(1), o = i.charAt(2);
        i = t.concat(t, e, e, o, o)
    }
    const o = parseInt(i, 16);
    return isNaN(o) ? null : new vn(dn((16711680 & o) >>> 16, 0, 255), dn((65280 & o) >>> 8, 0, 255), dn(255 & o, 0, 255), 1)
}

function On(t, e) {
    const i = t.relativeLuminance > e.relativeLuminance ? t : e, o = t.relativeLuminance > e.relativeLuminance ? e : t;
    return (i.relativeLuminance + .05) / (o.relativeLuminance + .05)
}

const En = Object.freeze({create: (t, e, i) => new Vn(t, e, i), from: t => new Vn(t.r, t.g, t.b)});

class Vn extends vn {
    constructor(t, e, i) {
        super(t, e, i, 1), this.toColorString = this.toStringHexRGB, this.contrast = On.bind(null, this), this.createCSS = this.toColorString, this.relativeLuminance = yn(this)
    }

    static fromObject(t) {
        return new Vn(t.r, t.g, t.b)
    }
}

const Rn = (-.1 + Math.sqrt(.21)) / 2;

function An(t) {
    return t.relativeLuminance <= Rn
}

function Ln(t) {
    return An(t) ? -1 : 1
}

const Pn = {stepContrast: 1.03, stepContrastRamp: .03, preserveSource: !1};
const zn = Object.freeze({
    create: function (t, e, i) {
        return "number" == typeof t ? zn.from(En.create(t, e, i)) : zn.from(t)
    }, from: function (t, e) {
        return function (t) {
            const e = {r: 0, g: 0, b: 0, toColorString: () => "", contrast: () => 0, relativeLuminance: 0};
            for (const i in e) if (typeof e[i] != typeof t[i]) return !1;
            return !0
        }(t) ? Hn.from(t, e) : Hn.from(En.create(t.r, t.g, t.b), e)
    }
});

class Hn {
    constructor(t, e) {
        this.closestIndexCache = new Map, this.source = t, this.swatches = e, this.reversedSwatches = Object.freeze([...this.swatches].reverse()), this.lastIndex = this.swatches.length - 1
    }

    colorContrast(t, e, i, o) {
        void 0 === i && (i = this.closestIndexOf(t));
        let s = this.swatches;
        const n = this.lastIndex;
        let r = i;
        void 0 === o && (o = Ln(t));
        return -1 === o && (s = this.reversedSwatches, r = n - r), function t(e, i, o = 0, s = e.length - 1) {
            if (s === o) return e[o];
            const n = Math.floor((s - o) / 2) + o;
            return i(e[n]) ? t(e, i, o, n) : t(e, i, n + 1, s)
        }(s, i => On(t, i) >= e, r, n)
    }

    get(t) {
        return this.swatches[t] || this.swatches[hn(t, 0, this.lastIndex)]
    }

    closestIndexOf(t) {
        if (this.closestIndexCache.has(t.relativeLuminance)) return this.closestIndexCache.get(t.relativeLuminance);
        let e = this.swatches.indexOf(t);
        if (-1 !== e) return this.closestIndexCache.set(t.relativeLuminance, e), e;
        const i = this.swatches.reduce((e, i) => Math.abs(i.relativeLuminance - t.relativeLuminance) < Math.abs(e.relativeLuminance - t.relativeLuminance) ? i : e);
        return e = this.swatches.indexOf(i), this.closestIndexCache.set(t.relativeLuminance, e), e
    }

    static saturationBump(t, e) {
        const i = wn(t).s, o = wn(e);
        if (o.s < i) {
            return function (t, e = 1) {
                const i = (1 - Math.abs(2 * t.l - 1)) * t.s, o = i * (1 - Math.abs(t.h / 60 % 2 - 1)), s = t.l - i / 2;
                let n = 0, r = 0, a = 0;
                return t.h < 60 ? (n = i, r = o, a = 0) : t.h < 120 ? (n = o, r = i, a = 0) : t.h < 180 ? (n = 0, r = i, a = o) : t.h < 240 ? (n = 0, r = o, a = i) : t.h < 300 ? (n = o, r = 0, a = i) : t.h < 360 && (n = i, r = 0, a = o), new vn(n + s, r + s, a + s, e)
            }(new fn(o.h, i, o.l))
        }
        return e
    }

    static ramp(t) {
        const e = t / 100;
        return e > .5 ? (e - .5) / .5 : 2 * e
    }

    static createHighResolutionPalette(t) {
        const e = [], i = kn(vn.fromObject(t).roundToPrecision(4)),
            o = Cn(new mn(0, i.a, i.b)).clamp().roundToPrecision(4),
            s = Cn(new mn(50, i.a, i.b)).clamp().roundToPrecision(4),
            n = Cn(new mn(100, i.a, i.b)).clamp().roundToPrecision(4), r = new vn(0, 0, 0), a = new vn(1, 1, 1),
            l = n.equalValue(a) ? 0 : 14, c = o.equalValue(r) ? 0 : 14;
        for (let t = 100 + l; t >= 0 - c; t -= .5) {
            let i;
            if (t < 0) {
                i = Dn(t / c + 1, r, o)
            } else if (t <= 50) i = Dn(Hn.ramp(t), o, s); else if (t <= 100) i = Dn(Hn.ramp(t), s, n); else {
                i = Dn((t - 100) / l, n, a)
            }
            i = Hn.saturationBump(s, i).roundToPrecision(4), e.push(En.from(i))
        }
        return new Hn(t, e)
    }

    static adjustEnd(t, e, i, o) {
        const s = -1 === o ? e.swatches : e.reversedSwatches, n = t => {
            const i = e.closestIndexOf(t);
            return 1 === o ? e.lastIndex - i : i
        };
        1 === o && i.reverse();
        const r = t(i[i.length - 2]);
        if (gn(On(i[i.length - 1], i[i.length - 2]), 2) < r) {
            i.pop();
            const t = n(e.colorContrast(s[e.lastIndex], r, void 0, o)) - n(i[i.length - 2]);
            let a = 1;
            for (let o = i.length - t - 1; o < i.length; o++) {
                const t = n(i[o]), r = o === i.length - 1 ? e.lastIndex : t + a;
                i[o] = s[r], a++
            }
        }
        1 === o && i.reverse()
    }

    static createColorPaletteByContrast(t, e) {
        const i = Hn.createHighResolutionPalette(t),
            o = t => gn(e.stepContrast + e.stepContrast * (1 - t.relativeLuminance) * e.stepContrastRamp, 2), s = [];
        let n = e.preserveSource ? t : i.swatches[0];
        s.push(n);
        do {
            const t = o(n);
            n = i.colorContrast(n, t, void 0, 1), s.push(n)
        } while (n.relativeLuminance > 0);
        if (e.preserveSource) {
            n = t;
            do {
                const t = o(n);
                n = i.colorContrast(n, t, void 0, -1), s.unshift(n)
            } while (n.relativeLuminance < 1)
        }
        return this.adjustEnd(o, i, s, -1), e.preserveSource && this.adjustEnd(o, i, s, 1), s
    }

    static from(t, e) {
        const i = void 0 === e ? Pn : Object.assign(Object.assign({}, Pn), e);
        return new Hn(t, Object.freeze(Hn.createColorPaletteByContrast(t, i)))
    }
}

const Mn = En.create(1, 1, 1), Bn = En.create(0, 0, 0), Nn = En.create(.5, .5, .5), jn = Sn("#0078D4"),
    Un = En.create(jn.r, jn.g, jn.b);

function qn(t, e, i, o, s) {
    const n = t => t.contrast(Mn) >= s ? Mn : Bn, r = n(t), a = n(e);
    return {rest: r, hover: a, active: r.relativeLuminance === a.relativeLuminance ? r : n(i), focus: n(o)}
}

class _n {
    constructor(t, e, i, o) {
        this.toColorString = () => this.cssGradient, this.contrast = On.bind(null, this), this.createCSS = this.toColorString, this.color = new vn(t, e, i), this.cssGradient = o, this.relativeLuminance = yn(this.color), this.r = t, this.g = e, this.b = i
    }

    static fromObject(t, e) {
        return new _n(t.r, t.g, t.b, e)
    }
}

const Gn = new vn(0, 0, 0), Wn = new vn(1, 1, 1);

function Kn(t, e, i, o, s, n, r, a, l = 10, c = !1) {
    const h = t.closestIndexOf(e);

    function d(i) {
        if (c) {
            const o = t.closestIndexOf(e), s = t.get(o), n = i.relativeLuminance < e.relativeLuminance ? Gn : Wn,
                r = function (t, e, i = null) {
                    let o = 0, s = i;
                    return null !== s ? o = $n(t, e, s) : (s = new vn(0, 0, 0, 1), o = $n(t, e, s), o <= 0 && (s = new vn(1, 1, 1, 1), o = $n(t, e, s))), o = Math.round(1e3 * o) / 1e3, new vn(s.r, s.g, s.b, o)
                }(Sn(i.toColorString()), Sn(s.toColorString()), n).roundToPrecision(2), a = function (t, e) {
                    if (e.a >= 1) return e;
                    if (e.a <= 0) return new vn(t.r, t.g, t.b, 1);
                    const i = e.a * e.r + (1 - e.a) * t.r, o = e.a * e.g + (1 - e.a) * t.g, s = e.a * e.b + (1 - e.a) * t.b;
                    return new vn(i, o, s, 1)
                }(Sn(e.toColorString()), r);
            return En.from(a)
        }
        return i
    }

    void 0 === a && (a = Ln(e));
    const u = h + a * i, p = u + a * (o - i), g = u + a * (s - i), f = u + a * (n - i), m = -1 === a ? 0 : 100 - l,
        v = -1 === a ? l : 100;

    function b(e, i) {
        const o = t.get(e);
        if (i) {
            const i = t.get(e + a * r), s = -1 === a ? i : o, n = -1 === a ? o : i,
                l = `linear-gradient(${d(s).toColorString()} ${m}%, ${d(n).toColorString()} ${v}%)`;
            return _n.fromObject(s, l)
        }
        return d(o)
    }

    return {rest: b(u, !0), hover: b(p, !0), active: b(g, !1), focus: b(f, !0)}
}

function Xn(t, e, i, o, s, n, r, a) {
    null == a && (a = Ln(e));
    const l = t.closestIndexOf(t.colorContrast(e, i));
    return {rest: t.get(l + a * o), hover: t.get(l + a * s), active: t.get(l + a * n), focus: t.get(l + a * r)}
}

function Yn(t, e, i, o, s, n, r) {
    const a = t.closestIndexOf(e);
    return null == r && (r = Ln(e)), {
        rest: t.get(a + r * i),
        hover: t.get(a + r * o),
        active: t.get(a + r * s),
        focus: t.get(a + r * n)
    }
}

function Qn(t, e, i, o, s, n, r, a, l, c, h, d) {
    return An(e) ? Yn(t, e, a, l, c, h, d) : Yn(t, e, i, o, s, n, r)
}

var Zn;

function Jn(t, e) {
    return t.closestIndexOf((i = e, En.create(i, i, i)));
    var i
}

function tr(t, e, i) {
    return t.get(Jn(t, e) + -1 * i)
}

!function (t) {
    t[t.LightMode = .98] = "LightMode", t[t.DarkMode = .15] = "DarkMode"
}(Zn || (Zn = {}));
const {create: er} = vo;

function ir(t) {
    return vo.create({name: t, cssCustomPropertyName: null})
}

const or = er("direction").withDefault(je.ltr), sr = er("disabled-opacity").withDefault(.3),
    nr = er("base-height-multiplier").withDefault(8), rr = er("base-horizontal-spacing-multiplier").withDefault(3),
    ar = er("density").withDefault(0), lr = er("design-unit").withDefault(4),
    cr = er("control-corner-radius").withDefault(4), hr = er("layer-corner-radius").withDefault(8),
    dr = er("stroke-width").withDefault(1), ur = er("focus-stroke-width").withDefault(2),
    pr = er("body-font").withDefault('"Segoe UI Variable", "Segoe UI", sans-serif'),
    gr = er("font-weight").withDefault(400);

function fr(t) {
    return e => {
        const i = t.getValueFor(e), o = gr.getValueFor(e);
        if (i.endsWith("px")) {
            const t = Number.parseFloat(i.replace("px", ""));
            if (t <= 12) return `"wght" ${o}, "opsz" 8`;
            if (t > 24) return `"wght" ${o}, "opsz" 36`
        }
        return `"wght" ${o}, "opsz" 10.5`
    }
}

const mr = er("type-ramp-base-font-size").withDefault("14px"),
    vr = er("type-ramp-base-line-height").withDefault("20px"),
    br = er("type-ramp-base-font-variations").withDefault(fr(mr)),
    yr = er("type-ramp-minus-1-font-size").withDefault("12px"),
    xr = er("type-ramp-minus-1-line-height").withDefault("16px"),
    $r = er("type-ramp-minus-1-font-variations").withDefault(fr(yr)),
    wr = er("type-ramp-minus-2-font-size").withDefault("10px"),
    kr = er("type-ramp-minus-2-line-height").withDefault("14px"),
    Cr = er("type-ramp-minus-2-font-variations").withDefault(fr(wr)),
    Ir = er("type-ramp-plus-1-font-size").withDefault("16px"),
    Fr = er("type-ramp-plus-1-line-height").withDefault("22px"),
    Dr = er("type-ramp-plus-1-font-variations").withDefault(fr(Ir)),
    Tr = er("type-ramp-plus-2-font-size").withDefault("20px"),
    Sr = er("type-ramp-plus-2-line-height").withDefault("26px"),
    Or = er("type-ramp-plus-2-font-variations").withDefault(fr(Tr)),
    Er = er("type-ramp-plus-3-font-size").withDefault("24px"),
    Vr = er("type-ramp-plus-3-line-height").withDefault("32px"),
    Rr = er("type-ramp-plus-3-font-variations").withDefault(fr(Er)),
    Ar = er("type-ramp-plus-4-font-size").withDefault("28px"),
    Lr = er("type-ramp-plus-4-line-height").withDefault("36px"),
    Pr = er("type-ramp-plus-4-font-variations").withDefault(fr(Ar)),
    zr = er("type-ramp-plus-5-font-size").withDefault("32px"),
    Hr = er("type-ramp-plus-5-line-height").withDefault("40px"),
    Mr = er("type-ramp-plus-5-font-variations").withDefault(fr(zr)),
    Br = er("type-ramp-plus-6-font-size").withDefault("40px"),
    Nr = er("type-ramp-plus-6-line-height").withDefault("52px"),
    jr = er("type-ramp-plus-6-font-variations").withDefault(fr(Br)),
    Ur = er("base-layer-luminance").withDefault(Zn.LightMode), qr = ir("accent-fill-rest-delta").withDefault(0),
    _r = ir("accent-fill-hover-delta").withDefault(-2), Gr = ir("accent-fill-active-delta").withDefault(-5),
    Wr = ir("accent-fill-focus-delta").withDefault(0), Kr = ir("accent-foreground-rest-delta").withDefault(0),
    Xr = ir("accent-foreground-hover-delta").withDefault(3), Yr = ir("accent-foreground-active-delta").withDefault(-8),
    Qr = ir("accent-foreground-focus-delta").withDefault(0), Zr = ir("neutral-fill-rest-delta").withDefault(-1),
    Jr = ir("neutral-fill-hover-delta").withDefault(1), ta = ir("neutral-fill-active-delta").withDefault(0),
    ea = ir("neutral-fill-focus-delta").withDefault(0), ia = ir("neutral-fill-input-rest-delta").withDefault(-1),
    oa = ir("neutral-fill-input-hover-delta").withDefault(1), sa = ir("neutral-fill-input-active-delta").withDefault(0),
    na = ir("neutral-fill-input-focus-delta").withDefault(-2),
    ra = ir("neutral-fill-input-alt-rest-delta").withDefault(2),
    aa = ir("neutral-fill-input-alt-hover-delta").withDefault(4),
    la = ir("neutral-fill-input-alt-active-delta").withDefault(6),
    ca = ir("neutral-fill-input-alt-focus-delta").withDefault(2),
    ha = ir("neutral-fill-layer-rest-delta").withDefault(-2), da = ir("neutral-fill-layer-hover-delta").withDefault(-3),
    ua = ir("neutral-fill-layer-active-delta").withDefault(-3),
    pa = ir("neutral-fill-layer-alt-rest-delta").withDefault(-1),
    ga = ir("neutral-fill-secondary-rest-delta").withDefault(3),
    fa = ir("neutral-fill-secondary-hover-delta").withDefault(2),
    ma = ir("neutral-fill-secondary-active-delta").withDefault(1),
    va = ir("neutral-fill-secondary-focus-delta").withDefault(3),
    ba = ir("neutral-fill-stealth-rest-delta").withDefault(0),
    ya = ir("neutral-fill-stealth-hover-delta").withDefault(3),
    xa = ir("neutral-fill-stealth-active-delta").withDefault(2),
    $a = ir("neutral-fill-stealth-focus-delta").withDefault(0),
    wa = ir("neutral-fill-strong-rest-delta").withDefault(0), ka = ir("neutral-fill-strong-hover-delta").withDefault(8),
    Ca = ir("neutral-fill-strong-active-delta").withDefault(-5),
    Ia = ir("neutral-fill-strong-focus-delta").withDefault(0), Fa = ir("neutral-stroke-rest-delta").withDefault(8),
    Da = ir("neutral-stroke-hover-delta").withDefault(12), Ta = ir("neutral-stroke-active-delta").withDefault(6),
    Sa = ir("neutral-stroke-focus-delta").withDefault(8), Oa = ir("neutral-stroke-control-rest-delta").withDefault(3),
    Ea = ir("neutral-stroke-control-hover-delta").withDefault(5),
    Va = ir("neutral-stroke-control-active-delta").withDefault(5),
    Ra = ir("neutral-stroke-control-focus-delta").withDefault(5),
    Aa = ir("neutral-stroke-divider-rest-delta").withDefault(4),
    La = ir("neutral-stroke-layer-rest-delta").withDefault(3),
    Pa = ir("neutral-stroke-layer-hover-delta").withDefault(3),
    za = ir("neutral-stroke-layer-active-delta").withDefault(3),
    Ha = ir("neutral-stroke-strong-hover-delta").withDefault(0),
    Ma = ir("neutral-stroke-strong-active-delta").withDefault(0),
    Ba = ir("neutral-stroke-strong-focus-delta").withDefault(0), Na = er("neutral-base-color").withDefault(Nn),
    ja = ir("neutral-palette").withDefault(t => zn.from(Na.getValueFor(t))),
    Ua = er("accent-base-color").withDefault(Un),
    qa = ir("accent-palette").withDefault(t => zn.from(Ua.getValueFor(t))),
    _a = ir("neutral-layer-card-container-recipe").withDefault({evaluate: t => tr(ja.getValueFor(t), Ur.getValueFor(t), ha.getValueFor(t))}),
    Ga = er("neutral-layer-card-container").withDefault(t => _a.getValueFor(t).evaluate(t)),
    Wa = ir("neutral-layer-floating-recipe").withDefault({
        evaluate: t => function (t, e, i) {
            return t.get(Jn(t, e) + i)
        }(ja.getValueFor(t), Ur.getValueFor(t), ha.getValueFor(t))
    }), Ka = er("neutral-layer-floating").withDefault(t => Wa.getValueFor(t).evaluate(t)),
    Xa = ir("neutral-layer-1-recipe").withDefault({
        evaluate: t => function (t, e) {
            return t.get(Jn(t, e))
        }(ja.getValueFor(t), Ur.getValueFor(t))
    }), Ya = er("neutral-layer-1").withDefault(t => Xa.getValueFor(t).evaluate(t)),
    Qa = ir("neutral-layer-2-recipe").withDefault({evaluate: t => tr(ja.getValueFor(t), Ur.getValueFor(t), ha.getValueFor(t))}),
    Za = er("neutral-layer-2").withDefault(t => Qa.getValueFor(t).evaluate(t)),
    Ja = ir("neutral-layer-3-recipe").withDefault({
        evaluate: t => function (t, e, i) {
            return t.get(Jn(t, e) + -1 * i * 2)
        }(ja.getValueFor(t), Ur.getValueFor(t), ha.getValueFor(t))
    }), tl = er("neutral-layer-3").withDefault(t => Ja.getValueFor(t).evaluate(t)),
    el = ir("neutral-layer-4-recipe").withDefault({
        evaluate: t => function (t, e, i) {
            return t.get(Jn(t, e) + -1 * i * 3)
        }(ja.getValueFor(t), Ur.getValueFor(t), ha.getValueFor(t))
    }), il = er("neutral-layer-4").withDefault(t => el.getValueFor(t).evaluate(t)),
    ol = er("fill-color").withDefault(t => Ya.getValueFor(t));
var sl;
!function (t) {
    t[t.normal = 4.5] = "normal", t[t.large = 3] = "large"
}(sl || (sl = {}));
const nl = ir("accent-fill-recipe").withDefault({
        evaluate: (t, e) => function (t, e, i, o, s, n, r, a, l, c, h, d, u, p) {
            return An(e) ? Xn(t, e, l, c, h, d, u, p) : Xn(t, e, i, o, s, n, r, a)
        }(qa.getValueFor(t), e || ol.getValueFor(t), 5, qr.getValueFor(t), _r.getValueFor(t), Gr.getValueFor(t), Wr.getValueFor(t), void 0, 8, qr.getValueFor(t), _r.getValueFor(t), Gr.getValueFor(t), Wr.getValueFor(t), void 0)
    }), rl = er("accent-fill-rest").withDefault(t => nl.getValueFor(t).evaluate(t).rest),
    al = er("accent-fill-hover").withDefault(t => nl.getValueFor(t).evaluate(t).hover),
    ll = er("accent-fill-active").withDefault(t => nl.getValueFor(t).evaluate(t).active),
    cl = er("accent-fill-focus").withDefault(t => nl.getValueFor(t).evaluate(t).focus),
    hl = ir("foreground-on-accent-recipe").withDefault({evaluate: t => qn(rl.getValueFor(t), al.getValueFor(t), ll.getValueFor(t), cl.getValueFor(t), sl.normal)}),
    dl = er("foreground-on-accent-rest").withDefault(t => hl.getValueFor(t).evaluate(t).rest),
    ul = er("foreground-on-accent-hover").withDefault(t => hl.getValueFor(t).evaluate(t).hover),
    pl = er("foreground-on-accent-active").withDefault(t => hl.getValueFor(t).evaluate(t).active),
    gl = er("foreground-on-accent-focus").withDefault(t => hl.getValueFor(t).evaluate(t).focus),
    fl = ir("accent-foreground-recipe").withDefault({evaluate: (t, e) => Xn(qa.getValueFor(t), e || ol.getValueFor(t), 9.5, Kr.getValueFor(t), Xr.getValueFor(t), Yr.getValueFor(t), Qr.getValueFor(t))}),
    ml = er("accent-foreground-rest").withDefault(t => fl.getValueFor(t).evaluate(t).rest),
    vl = er("accent-foreground-hover").withDefault(t => fl.getValueFor(t).evaluate(t).hover),
    bl = er("accent-foreground-active").withDefault(t => fl.getValueFor(t).evaluate(t).active),
    yl = er("accent-foreground-focus").withDefault(t => fl.getValueFor(t).evaluate(t).focus),
    xl = ir("accent-stroke-control-recipe").withDefault({evaluate: (t, e) => Kn(ja.getValueFor(t), e || ol.getValueFor(t), -3, -3, -3, -3, 10, 1, void 0, !0)}),
    $l = er("accent-stroke-control-rest").withDefault(t => xl.getValueFor(t).evaluate(t, rl.getValueFor(t)).rest),
    wl = er("accent-stroke-control-hover").withDefault(t => xl.getValueFor(t).evaluate(t, al.getValueFor(t)).hover),
    kl = er("accent-stroke-control-active").withDefault(t => xl.getValueFor(t).evaluate(t, ll.getValueFor(t)).active),
    Cl = er("accent-stroke-control-focus").withDefault(t => xl.getValueFor(t).evaluate(t, cl.getValueFor(t)).focus),
    Il = ir("neutral-fill-recipe").withDefault({evaluate: (t, e) => Qn(ja.getValueFor(t), e || ol.getValueFor(t), Zr.getValueFor(t), Jr.getValueFor(t), ta.getValueFor(t), ea.getValueFor(t), void 0, 2, 3, 1, 2, void 0)}),
    Fl = er("neutral-fill-rest").withDefault(t => Il.getValueFor(t).evaluate(t).rest),
    Dl = er("neutral-fill-hover").withDefault(t => Il.getValueFor(t).evaluate(t).hover),
    Tl = er("neutral-fill-active").withDefault(t => Il.getValueFor(t).evaluate(t).active),
    Sl = er("neutral-fill-focus").withDefault(t => Il.getValueFor(t).evaluate(t).focus),
    Ol = ir("neutral-fill-input-recipe").withDefault({evaluate: (t, e) => Qn(ja.getValueFor(t), e || ol.getValueFor(t), ia.getValueFor(t), oa.getValueFor(t), sa.getValueFor(t), na.getValueFor(t), void 0, 2, 3, 1, 0, void 0)}),
    El = er("neutral-fill-input-rest").withDefault(t => Ol.getValueFor(t).evaluate(t).rest),
    Vl = er("neutral-fill-input-hover").withDefault(t => Ol.getValueFor(t).evaluate(t).hover),
    Rl = er("neutral-fill-input-active").withDefault(t => Ol.getValueFor(t).evaluate(t).active),
    Al = er("neutral-fill-input-focus").withDefault(t => Ol.getValueFor(t).evaluate(t).focus),
    Ll = ir("neutral-fill-input-alt-recipe").withDefault({evaluate: (t, e) => Qn(ja.getValueFor(t), e || ol.getValueFor(t), ra.getValueFor(t), aa.getValueFor(t), la.getValueFor(t), ca.getValueFor(t), 1, ra.getValueFor(t), ra.getValueFor(t) - aa.getValueFor(t), ra.getValueFor(t) - la.getValueFor(t), ca.getValueFor(t), 1)}),
    Pl = er("neutral-fill-input-alt-rest").withDefault(t => Ll.getValueFor(t).evaluate(t).rest),
    zl = er("neutral-fill-input-alt-hover").withDefault(t => Ll.getValueFor(t).evaluate(t).hover),
    Hl = er("neutral-fill-input-alt-active").withDefault(t => Ll.getValueFor(t).evaluate(t).active),
    Ml = er("neutral-fill-input-alt-focus").withDefault(t => Ll.getValueFor(t).evaluate(t).focus),
    Bl = ir("neutral-fill-layer-recipe").withDefault({evaluate: (t, e) => Yn(ja.getValueFor(t), e || ol.getValueFor(t), ha.getValueFor(t), da.getValueFor(t), ua.getValueFor(t), ha.getValueFor(t), 1)}),
    Nl = er("neutral-fill-layer-rest").withDefault(t => Bl.getValueFor(t).evaluate(t).rest),
    jl = er("neutral-fill-layer-hover").withDefault(t => Bl.getValueFor(t).evaluate(t).hover),
    Ul = er("neutral-fill-layer-active").withDefault(t => Bl.getValueFor(t).evaluate(t).active),
    ql = ir("neutral-fill-layer-alt-recipe").withDefault({evaluate: (t, e) => Yn(ja.getValueFor(t), e || ol.getValueFor(t), pa.getValueFor(t), pa.getValueFor(t), pa.getValueFor(t), pa.getValueFor(t))}),
    _l = er("neutral-fill-layer-alt-rest").withDefault(t => ql.getValueFor(t).evaluate(t).rest),
    Gl = ir("neutral-fill-secondary-recipe").withDefault({evaluate: (t, e) => Yn(ja.getValueFor(t), e || ol.getValueFor(t), ga.getValueFor(t), fa.getValueFor(t), ma.getValueFor(t), va.getValueFor(t))}),
    Wl = er("neutral-fill-secondary-rest").withDefault(t => Gl.getValueFor(t).evaluate(t).rest),
    Kl = er("neutral-fill-secondary-hover").withDefault(t => Gl.getValueFor(t).evaluate(t).hover),
    Xl = er("neutral-fill-secondary-active").withDefault(t => Gl.getValueFor(t).evaluate(t).active),
    Yl = er("neutral-fill-secondary-focus").withDefault(t => Gl.getValueFor(t).evaluate(t).focus),
    Ql = ir("neutral-fill-stealth-recipe").withDefault({evaluate: (t, e) => Yn(ja.getValueFor(t), e || ol.getValueFor(t), ba.getValueFor(t), ya.getValueFor(t), xa.getValueFor(t), $a.getValueFor(t))}),
    Zl = er("neutral-fill-stealth-rest").withDefault(t => Ql.getValueFor(t).evaluate(t).rest),
    Jl = er("neutral-fill-stealth-hover").withDefault(t => Ql.getValueFor(t).evaluate(t).hover),
    tc = er("neutral-fill-stealth-active").withDefault(t => Ql.getValueFor(t).evaluate(t).active),
    ec = er("neutral-fill-stealth-focus").withDefault(t => Ql.getValueFor(t).evaluate(t).focus),
    ic = ir("neutral-fill-strong-recipe").withDefault({evaluate: (t, e) => Xn(ja.getValueFor(t), e || ol.getValueFor(t), 4.5, wa.getValueFor(t), ka.getValueFor(t), Ca.getValueFor(t), Ia.getValueFor(t))}),
    oc = er("neutral-fill-strong-rest").withDefault(t => ic.getValueFor(t).evaluate(t).rest),
    sc = er("neutral-fill-strong-hover").withDefault(t => ic.getValueFor(t).evaluate(t).hover),
    nc = er("neutral-fill-strong-active").withDefault(t => ic.getValueFor(t).evaluate(t).active),
    rc = er("neutral-fill-strong-focus").withDefault(t => ic.getValueFor(t).evaluate(t).focus),
    ac = ir("neutral-foreground-recipe").withDefault({evaluate: (t, e) => Xn(ja.getValueFor(t), e || ol.getValueFor(t), 16, 0, -19, -30, 0)}),
    lc = er("neutral-foreground-rest").withDefault(t => ac.getValueFor(t).evaluate(t).rest),
    cc = er("neutral-foreground-hover").withDefault(t => ac.getValueFor(t).evaluate(t).hover),
    hc = er("neutral-foreground-active").withDefault(t => ac.getValueFor(t).evaluate(t).active),
    dc = er("neutral-foreground-focus").withDefault(t => ac.getValueFor(t).evaluate(t).focus),
    uc = ir("neutral-foreground-hint-recipe").withDefault({
        evaluate: (t, e) => function (t, e, i) {
            return t.colorContrast(e, i)
        }(ja.getValueFor(t), e || ol.getValueFor(t), 4.5)
    }), pc = er("neutral-foreground-hint").withDefault(t => uc.getValueFor(t).evaluate(t)),
    gc = ir("neutral-stroke-recipe").withDefault({evaluate: (t, e) => Yn(ja.getValueFor(t), e || ol.getValueFor(t), Fa.getValueFor(t), Da.getValueFor(t), Ta.getValueFor(t), Sa.getValueFor(t))}),
    fc = er("neutral-stroke-rest").withDefault(t => gc.getValueFor(t).evaluate(t).rest),
    mc = er("neutral-stroke-hover").withDefault(t => gc.getValueFor(t).evaluate(t).hover),
    vc = er("neutral-stroke-active").withDefault(t => gc.getValueFor(t).evaluate(t).active),
    bc = er("neutral-stroke-focus").withDefault(t => gc.getValueFor(t).evaluate(t).focus),
    yc = ir("neutral-stroke-control-recipe").withDefault({evaluate: (t, e) => Kn(ja.getValueFor(t), e || ol.getValueFor(t), Oa.getValueFor(t), Ea.getValueFor(t), Va.getValueFor(t), Ra.getValueFor(t), 5)}),
    xc = er("neutral-stroke-control-rest").withDefault(t => yc.getValueFor(t).evaluate(t).rest),
    $c = er("neutral-stroke-control-hover").withDefault(t => yc.getValueFor(t).evaluate(t).hover),
    wc = er("neutral-stroke-control-active").withDefault(t => yc.getValueFor(t).evaluate(t).active),
    kc = er("neutral-stroke-control-focus").withDefault(t => yc.getValueFor(t).evaluate(t).focus),
    Cc = ir("neutral-stroke-divider-recipe").withDefault({
        evaluate: (t, e) => function (t, e, i) {
            return t.get(t.closestIndexOf(e) + Ln(e) * i)
        }(ja.getValueFor(t), e || ol.getValueFor(t), Aa.getValueFor(t))
    }), Ic = er("neutral-stroke-divider-rest").withDefault(t => Cc.getValueFor(t).evaluate(t)),
    Fc = ir("neutral-stroke-input-recipe").withDefault({
        evaluate: (t, e) => function (t, e, i, o, s, n, r, a) {
            const l = t.closestIndexOf(e), c = Ln(e), h = l + c * i, d = h + c * (o - i), u = h + c * (s - i),
                p = h + c * (n - i), g = `calc(100% - ${a})`;

            function f(e, i) {
                const o = t.get(e);
                if (i) {
                    const i = t.get(e + c * r),
                        s = `linear-gradient(${o.toColorString()} ${g}, ${i.toColorString()} ${g}, ${i.toColorString()})`;
                    return _n.fromObject(o, s)
                }
                return o
            }

            return {rest: f(h, !0), hover: f(d, !0), active: f(u, !1), focus: f(p, !0)}
        }(ja.getValueFor(t), e || ol.getValueFor(t), Oa.getValueFor(t), Ea.getValueFor(t), Va.getValueFor(t), Ra.getValueFor(t), 20, dr.getValueFor(t) + "px")
    }), Dc = er("neutral-stroke-input-rest").withDefault(t => Fc.getValueFor(t).evaluate(t).rest),
    Tc = er("neutral-stroke-input-hover").withDefault(t => Fc.getValueFor(t).evaluate(t).hover),
    Sc = er("neutral-stroke-input-active").withDefault(t => Fc.getValueFor(t).evaluate(t).active),
    Oc = er("neutral-stroke-input-focus").withDefault(t => Fc.getValueFor(t).evaluate(t).focus),
    Ec = ir("neutral-stroke-layer-recipe").withDefault({evaluate: (t, e) => Yn(ja.getValueFor(t), e || ol.getValueFor(t), La.getValueFor(t), Pa.getValueFor(t), za.getValueFor(t), La.getValueFor(t))}),
    Vc = er("neutral-stroke-layer-rest").withDefault(t => Ec.getValueFor(t).evaluate(t).rest),
    Rc = er("neutral-stroke-layer-hover").withDefault(t => Ec.getValueFor(t).evaluate(t).hover),
    Ac = er("neutral-stroke-layer-active").withDefault(t => Ec.getValueFor(t).evaluate(t).active),
    Lc = ir("neutral-stroke-strong-recipe").withDefault({evaluate: (t, e) => Xn(ja.getValueFor(t), e || ol.getValueFor(t), 5.5, 0, Ha.getValueFor(t), Ma.getValueFor(t), Ba.getValueFor(t))}),
    Pc = er("neutral-stroke-strong-rest").withDefault(t => Lc.getValueFor(t).evaluate(t).rest),
    zc = er("neutral-stroke-strong-hover").withDefault(t => Lc.getValueFor(t).evaluate(t).hover),
    Hc = er("neutral-stroke-strong-active").withDefault(t => Lc.getValueFor(t).evaluate(t).active),
    Mc = er("neutral-stroke-strong-focus").withDefault(t => Lc.getValueFor(t).evaluate(t).focus),
    Bc = ir("focus-stroke-outer-recipe").withDefault({evaluate: t => (ja.getValueFor(t), An(ol.getValueFor(t)) ? Mn : Bn)}),
    Nc = er("focus-stroke-outer").withDefault(t => Bc.getValueFor(t).evaluate(t)),
    jc = ir("focus-stroke-inner-recipe").withDefault({
        evaluate: t => {
            return qa.getValueFor(t), e = ol.getValueFor(t), Nc.getValueFor(t), An(e) ? Bn : Mn;
            var e
        }
    }), Uc = er("focus-stroke-inner").withDefault(t => jc.getValueFor(t).evaluate(t)),
    qc = ir("foreground-on-accent-large-recipe").withDefault({evaluate: t => qn(rl.getValueFor(t), al.getValueFor(t), ll.getValueFor(t), cl.getValueFor(t), sl.large)}),
    _c = er("foreground-on-accent-rest-large").withDefault(t => qc.getValueFor(t).evaluate(t).rest),
    Gc = er("foreground-on-accent-hover-large").withDefault(t => qc.getValueFor(t).evaluate(t, al.getValueFor(t)).hover),
    Wc = er("foreground-on-accent-active-large").withDefault(t => qc.getValueFor(t).evaluate(t, ll.getValueFor(t)).active),
    Kc = er("foreground-on-accent-focus-large").withDefault(t => qc.getValueFor(t).evaluate(t, cl.getValueFor(t)).focus),
    Xc = er("neutral-fill-inverse-rest-delta").withDefault(0),
    Yc = er("neutral-fill-inverse-hover-delta").withDefault(-3),
    Qc = er("neutral-fill-inverse-active-delta").withDefault(7),
    Zc = er("neutral-fill-inverse-focus-delta").withDefault(0);
const Jc = ir("neutral-fill-inverse-recipe").withDefault({
        evaluate: (t, e) => function (t, e, i, o, s, n) {
            const r = Ln(e), a = t.closestIndexOf(t.colorContrast(e, 14)), l = a + r * Math.abs(i - o);
            let c, h;
            return (1 === r ? i < o : r * i > r * o) ? (c = a, h = l) : (c = l, h = a), {
                rest: t.get(c),
                hover: t.get(h),
                active: t.get(c + r * s),
                focus: t.get(c + r * n)
            }
        }(ja.getValueFor(t), e || ol.getValueFor(t), Xc.getValueFor(t), Yc.getValueFor(t), Qc.getValueFor(t), Zc.getValueFor(t))
    }), th = er("neutral-fill-inverse-rest").withDefault(t => Jc.getValueFor(t).evaluate(t).rest),
    eh = er("neutral-fill-inverse-hover").withDefault(t => Jc.getValueFor(t).evaluate(t).hover),
    ih = er("neutral-fill-inverse-active").withDefault(t => Jc.getValueFor(t).evaluate(t).active),
    oh = er("neutral-fill-inverse-focus").withDefault(t => Jc.getValueFor(t).evaluate(t).focus), sh = cr, nh = hr,
    rh = dr, ah = ur, lh = Xc, ch = Yc, hh = Qc, dh = Zc, uh = ha, ph = wa, gh = ka, fh = Ca, mh = Ia, vh = Aa, bh = Ya,
    yh = Za, xh = tl, $h = il, wh = dl, kh = _c, Ch = Ic, Ih = Nl, Fh = th, Dh = eh, Th = ih, Sh = oh, Oh = oc, Eh = sc,
    Vh = nc, Rh = rc, Ah = Nc, Lh = Uc, Ph = fc, zh = mc, Hh = vc, Mh = bc, Bh = yt`
  font-family: ${pr};
  font-size: ${mr};
  line-height: ${vr};
  font-weight: initial;
  font-variation-settings: ${br};
`, Nh = yt`
  font-family: ${pr};
  font-size: ${yr};
  line-height: ${xr};
  font-weight: initial;
  font-variation-settings: ${$r};
`, jh = yt`
  font-family: ${pr};
  font-size: ${wr};
  line-height: ${kr};
  font-weight: initial;
  font-variation-settings: ${Cr};
`, Uh = yt`
  font-family: ${pr};
  font-size: ${Ir};
  line-height: ${Fr};
  font-weight: initial;
  font-variation-settings: ${Dr};
`, qh = yt`
  font-family: ${pr};
  font-size: ${Tr};
  line-height: ${Sr};
  font-weight: initial;
  font-variation-settings: ${Or};
`, _h = yt`
  font-family: ${pr};
  font-size: ${Er};
  line-height: ${Vr};
  font-weight: initial;
  font-variation-settings: ${Rr};
`, Gh = yt`
  font-family: ${pr};
  font-size: ${Ar};
  line-height: ${Lr};
  font-weight: initial;
  font-variation-settings: ${Pr};
`, Wh = yt`
  font-family: ${pr};
  font-size: ${zr};
  line-height: ${Hr};
  font-weight: initial;
  font-variation-settings: ${Mr};
`, Kh = yt`
  font-family: ${pr};
  font-size: ${Br};
  line-height: ${Nr};
  font-weight: initial;
  font-variation-settings: ${jr};
`, Xh = (t, e) => vt`
    ${ln("flex")} :host{box-sizing:border-box;flex-direction:column;${Bh}
      color:${lc};gap:calc(${lr} * 1px)}`, Yh = yt`
  outline: calc(${ur} * 1px) solid ${Nc};
  outline-offset: calc(${ur} * -1px);
`, Qh = yt`
  outline: calc(${ur} * 1px) solid ${Nc};
  outline-offset: calc(${dr} * 1px);
`, Zh = yt`(${nr} + ${ar}) * ${lr}`,
    Jh = vo.create("neutral-fill-stealth-rest-on-neutral-fill-layer-rest").withDefault(t => {
        const e = Bl.getValueFor(t);
        return Ql.getValueFor(t).evaluate(t, e.evaluate(t).rest).rest
    }), td = vo.create("neutral-fill-stealth-hover-on-neutral-fill-layer-rest").withDefault(t => {
        const e = Bl.getValueFor(t);
        return Ql.getValueFor(t).evaluate(t, e.evaluate(t).rest).hover
    }), ed = vo.create("neutral-fill-stealth-active-on-neutral-fill-layer-rest").withDefault(t => {
        const e = Bl.getValueFor(t);
        return Ql.getValueFor(t).evaluate(t, e.evaluate(t).rest).active
    }), id = (t, e) => vt`
    ${ln("flex")} :host{box-sizing:border-box;${Bh};flex-direction:column;background:${Nl};color:${lc};border:calc(${dr} * 1px) solid ${Vc};border-radius:calc(${hr} * 1px)}.region{display:none;padding:calc(${lr} * 2 * 1px);background:${_l}}.heading{display:grid;position:relative;grid-template-columns:auto 1fr auto auto;align-items:center}.button{appearance:none;border:none;background:none;grid-column:2;grid-row:1;outline:none;margin:calc(${lr} * 3 * 1px) 0;padding:0 calc(${lr} * 2 * 1px);text-align:left;color:inherit;cursor:pointer;font:inherit}.button::before{content:'';position:absolute;top:calc(${dr} * -1px);left:calc(${dr} * -1px);right:calc(${dr} * -1px);bottom:calc(${dr} * -1px);cursor:pointer}.button:${cn}::before{${Yh}
      border-radius:calc(${hr} * 1px)}:host(.expanded) .button:${cn}::before{border-bottom-left-radius:0;border-bottom-right-radius:0}:host(.expanded) .region{display:block;border-top:calc(${dr} * 1px) solid ${Vc};border-bottom-left-radius:calc((${hr} - ${dr}) * 1px);border-bottom-right-radius:calc((${hr} - ${dr}) * 1px)}.icon{display:flex;align-items:center;justify-content:center;grid-column:4;pointer-events:none;background:${Jh};border-radius:calc(${cr} * 1px);fill:currentcolor;width:calc(${Zh} * 1px);height:calc(${Zh} * 1px);margin:calc(${lr} * 2 * 1px)}.heading:hover .icon{background:${td}}.heading:active .icon{background:${ed}}slot[name='collapsed-icon']{display:flex}:host(.expanded) slot[name='collapsed-icon']{display:none}slot[name='expanded-icon']{display:none}:host(.expanded) slot[name='expanded-icon']{display:flex}.start{display:flex;align-items:center;padding-inline-start:calc(${lr} * 2 * 1px);justify-content:center;grid-column:1}.end{display:flex;align-items:center;justify-content:center;grid-column:3}.icon,.start,.end{position:relative}`.withBehaviors(rn(vt`
        .button:${cn}::before{outline-color:${Ke.Highlight}}.icon{fill:${Ke.ButtonText}}`)), od = Le.compose({
        baseName: "accordion-item",
        template: (t, e) => _`<template class="${t => t.expanded ? "expanded" : ""}"><div class="heading" part="heading" role="heading" aria-level="${t => t.headinglevel}"><button class="button" part="button" ${St("expandbutton")} aria-expanded="${t => t.expanded}" aria-controls="${t => t.id}-panel" id="${t => t.id}" @click="${(t, e) => t.clickHandler(e.event)}"><span class="heading-content" part="heading-content"><slot name="heading"></slot></span></button>${_t(0, e)} ${qt(0, e)}<span class="icon" part="icon" aria-hidden="true"><slot name="expanded-icon" part="expanded-icon">${e.expandedIcon || ""}</slot><slot name="collapsed-icon" part="collapsed-icon">${e.collapsedIcon || ""}</slot><span></div><div class="region" part="region" id="${t => t.id}-panel" role="region" aria-labelledby="${t => t.id}"><slot></slot></div></template>`,
        styles: id,
        collapsedIcon: '\n    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">\n      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>\n    </svg>\n  ',
        expandedIcon: '\n    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">\n      <path d="M2.15 7.35c.2.2.5.2.7 0L6 4.21l3.15 3.14a.5.5 0 10.7-.7l-3.5-3.5a.5.5 0 00-.7 0l-3.5 3.5a.5.5 0 000 .7z"/>\n    </svg>\n  '
    }), sd = id, nd = Qe.compose({
        baseName: "accordion",
        template: (t, e) => _`<template><slot ${Bt({
            property: "accordionItems",
            filter: zt()
        })}></slot><slot name="item" part="item" ${Bt("accordionItems")}></slot></template>`,
        styles: Xh
    }), rd = Xh;

function ad(t, e, i, o) {
    var s, n = arguments.length, r = n < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, i) : o;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(t, e, i, o); else for (var a = t.length - 1; a >= 0; a--) (s = t[a]) && (r = (n < 3 ? s(r) : n > 3 ? s(e, i, r) : s(e, i)) || r);
    return n > 3 && r && Object.defineProperty(e, i, r), r
}

class ld {
    constructor(t, e) {
        this.cache = new WeakMap, this.ltr = t, this.rtl = e
    }

    bind(t) {
        this.attach(t)
    }

    unbind(t) {
        const e = this.cache.get(t);
        e && or.unsubscribe(e)
    }

    attach(t) {
        const e = this.cache.get(t) || new cd(this.ltr, this.rtl, t), i = or.getValueFor(t);
        or.subscribe(e), e.attach(i), this.cache.set(t, e)
    }
}

class cd {
    constructor(t, e, i) {
        this.ltr = t, this.rtl = e, this.source = i, this.attached = null
    }

    handleChange({target: t, token: e}) {
        this.attach(e.getValueFor(this.source))
    }

    attach(t) {
        this.attached !== this[t] && (null !== this.attached && this.source.$fastController.removeStyles(this.attached), this.attached = this[t], null !== this.attached && this.source.$fastController.addStyles(this.attached))
    }
}

const hd = "0 0 2px rgba(0, 0, 0, 0.14)",
    dd = "0 calc(var(--elevation) * 0.5px) calc((var(--elevation) * 1px)) rgba(0, 0, 0, 0.2)",
    ud = `box-shadow: 0 0 2px rgba(0, 0, 0, 0.14), ${dd};`,
    pd = vo.create({name: "elevation-shadow", cssCustomPropertyName: null}).withDefault({
        evaluate: (t, e, i) => {
            let o = .12, s = .14;
            e > 16 && (o = .2, s = .24);
            return `${`0 0 2px rgba(0, 0, 0, ${o})`}, ${`0 calc(${e} * 0.5px) calc((${e} * 1px)) rgba(0, 0, 0, ${s})`}`
        }
    }), gd = vo.create("elevation-shadow-card-rest-size").withDefault(4),
    fd = vo.create("elevation-shadow-card-hover-size").withDefault(8),
    md = vo.create("elevation-shadow-card-active-size").withDefault(0),
    vd = vo.create("elevation-shadow-card-focus-size").withDefault(8),
    bd = vo.create("elevation-shadow-card-rest").withDefault(t => pd.getValueFor(t).evaluate(t, gd.getValueFor(t))),
    yd = vo.create("elevation-shadow-card-hover").withDefault(t => pd.getValueFor(t).evaluate(t, fd.getValueFor(t))),
    xd = vo.create("elevation-shadow-card-active").withDefault(t => pd.getValueFor(t).evaluate(t, md.getValueFor(t))),
    $d = vo.create("elevation-shadow-card-focus").withDefault(t => pd.getValueFor(t).evaluate(t, vd.getValueFor(t))),
    wd = vo.create("elevation-shadow-tooltip-size").withDefault(16),
    kd = vo.create("elevation-shadow-tooltip").withDefault(t => pd.getValueFor(t).evaluate(t, wd.getValueFor(t))),
    Cd = vo.create("elevation-shadow-flyout-size").withDefault(32),
    Id = vo.create("elevation-shadow-flyout").withDefault(t => pd.getValueFor(t).evaluate(t, Cd.getValueFor(t))),
    Fd = vo.create("elevation-shadow-dialog-size").withDefault(128),
    Dd = vo.create("elevation-shadow-dialog").withDefault(t => pd.getValueFor(t).evaluate(t, Fd.getValueFor(t))),
    Td = (t, e, i, o = "[disabled]") => vt`
    ${ln("inline-flex")}
    
    :host{position:relative;box-sizing:border-box;${Bh}
      height:calc(${Zh} * 1px);min-width:calc(${Zh} * 1px);color:${lc};border-radius:calc(${cr} * 1px);fill:currentcolor}.control{border:calc(${dr} * 1px) solid transparent;flex-grow:1;box-sizing:border-box;display:inline-flex;justify-content:center;align-items:center;padding:0 calc((10 + (${lr} * 2 * ${ar})) * 1px);white-space:nowrap;outline:none;text-decoration:none;color:inherit;border-radius:inherit;fill:inherit;font-family:inherit}.control,.end,.start{font:inherit}.control.icon-only{padding:0;line-height:0}.control:${cn}{${Yh}}.control::-moz-focus-inner{border:0}.content{pointer-events:none}.start,.end{display:flex;pointer-events:none}.start{margin-inline-end:11px}.end{margin-inline-start:11px}`,
    Sd = (t, e, i, o = "[disabled]") => vt`
    .control{background:padding-box linear-gradient(${Fl},${Fl}),border-box ${xc}}:host(${i}:hover) .control{background:padding-box linear-gradient(${Dl},${Dl}),border-box ${$c}}:host(${i}:active) .control{background:padding-box linear-gradient(${Tl},${Tl}),border-box ${wc}}:host(${o}) .control{background:padding-box linear-gradient(${Fl},${Fl}),border-box ${fc}}`.withBehaviors(rn(vt`
        .control{background:${Ke.ButtonFace};border-color:${Ke.ButtonText};color:${Ke.ButtonText}}:host(${i}:hover) .control,:host(${i}:active) .control{forced-color-adjust:none;background:${Ke.HighlightText};border-color:${Ke.Highlight};color:${Ke.Highlight}}:host(${o}) .control{background:transparent;border-color:${Ke.GrayText};color:${Ke.GrayText}}.control:${cn}{outline-color:${Ke.CanvasText}}:host([href]) .control{background:transparent;border-color:${Ke.LinkText};color:${Ke.LinkText}}:host([href]:hover) .control,:host([href]:active) .control{background:transparent;border-color:${Ke.CanvasText};color:${Ke.CanvasText}}`)),
    Od = (t, e, i, o = "[disabled]") => vt`
    .control{background:padding-box linear-gradient(${rl},${rl}),border-box ${$l};color:${dl}}:host(${i}:hover) .control{background:padding-box linear-gradient(${al},${al}),border-box ${wl};color:${ul}}:host(${i}:active) .control{background:padding-box linear-gradient(${ll},${ll}),border-box ${kl};color:${pl}}:host(${o}) .control{background:${rl}}.control:${cn}{box-shadow:0 0 0 calc(${ur} * 1px) ${Uc} inset !important}`.withBehaviors(rn(vt`
        .control{forced-color-adjust:none;background:${Ke.Highlight};color:${Ke.HighlightText}}:host(${i}:hover) .control,:host(${i}:active) .control{background:${Ke.HighlightText};border-color:${Ke.Highlight};color:${Ke.Highlight}}:host(${o}) .control{background:transparent;border-color:${Ke.GrayText};color:${Ke.GrayText}}.control:${cn}{outline-color:${Ke.CanvasText};box-shadow:0 0 0 calc(${ur} * 1px) ${Ke.HighlightText} inset !important}:host([href]) .control{background:${Ke.LinkText};color:${Ke.HighlightText}}:host([href]:hover) .control,:host([href]:active) .control{background:${Ke.ButtonFace};border-color:${Ke.LinkText};color:${Ke.LinkText}}`)),
    Ed = (t, e, i, o = "[disabled]") => vt`
    :host{height:auto;font-family:inherit;font-size:inherit;line-height:inherit;min-width:0}.control{display:inline;padding:0;border:none;box-shadow:none;line-height:1}:host(${i}) .control{color:${ml};text-decoration:underline 1px}:host(${i}:hover) .control{color:${vl};text-decoration:none}:host(${i}:active) .control{color:${bl};text-decoration:none}.control:${cn}{${Qh}}`.withBehaviors(rn(vt`
        :host(${i}) .control{color:${Ke.LinkText}}:host(${i}:hover) .control,:host(${i}:active) .control{color:${Ke.CanvasText}}.control:${cn}{outline-color:${Ke.CanvasText}}`)),
    Vd = (t, e, i, o = "[disabled]") => vt`
    :host{color:${ml}}.control{background:${Zl}}:host(${i}:hover) .control{background:${Jl};color:${vl}}:host(${i}:active) .control{background:${tc};color:${bl}}:host(${o}) .control{background:${Zl}}`.withBehaviors(rn(vt`
        :host{color:${Ke.ButtonText}}.control{forced-color-adjust:none;background:transparent}:host(${i}:hover) .control,:host(${i}:active) .control{background:transparent;border-color:${Ke.ButtonText};color:${Ke.ButtonText}}:host(${o}) .control{background:transparent;color:${Ke.GrayText}}.control:${cn}{outline-color:${Ke.CanvasText}}:host([href]) .control{color:${Ke.LinkText}}:host([href]:hover) .control,:host([href]:active) .control{border-color:${Ke.LinkText};color:${Ke.LinkText}}`)),
    Rd = (t, e, i, o = "[disabled]") => vt`
    .control{background:transparent !important;border-color:${fc}}:host(${i}:hover) .control{border-color:${mc}}:host(${i}:active) .control{border-color:${vc}}:host(${o}) .control{background:transparent !important;border-color:${fc}}`.withBehaviors(rn(vt`
        .control{border-color:${Ke.ButtonText};color:${Ke.ButtonText}}:host(${i}:hover) .control,:host(${i}:active) .control{background:${Ke.HighlightText};border-color:${Ke.Highlight};color:${Ke.Highlight}}:host(${o}) .control{border-color:${Ke.GrayText};color:${Ke.GrayText}}.control:${cn}{outline-color:${Ke.CanvasText}}:host([href]) .control{border-color:${Ke.LinkText};color:${Ke.LinkText}}:host([href]:hover) .control,:host([href]:active) .control{border-color:${Ke.CanvasText};color:${Ke.CanvasText}}`)),
    Ad = (t, e, i, o = "[disabled]") => vt`
    .control{background:${Zl}}:host(${i}:hover) .control{background:${Jl}}:host(${i}:active) .control{background:${tc}}:host(${o}) .control{background:${Zl}}`.withBehaviors(rn(vt`
        .control{forced-color-adjust:none;background:transparent;color:${Ke.ButtonText}}:host(${i}:hover) .control,:host(${i}:active) .control{background:transparent;border-color:${Ke.ButtonText};color:${Ke.ButtonText}}:host(${o}) .control{background:transparent;color:${Ke.GrayText}}.control:${cn}{outline-color:${Ke.CanvasText}}:host([href]) .control{color:${Ke.LinkText}}:host([href]:hover) .control,:host([href]:active) .control{background:transparent;border-color:${Ke.LinkText};color:${Ke.LinkText}}`)),
    Ld = vo.create("input-placeholder-rest").withDefault(t => {
        const e = Ol.getValueFor(t);
        return uc.getValueFor(t).evaluate(t, e.evaluate(t).rest)
    }), Pd = vo.create("input-placeholder-hover").withDefault(t => {
        const e = Ol.getValueFor(t);
        return uc.getValueFor(t).evaluate(t, e.evaluate(t).hover)
    }), zd = vo.create("input-filled-placeholder-rest").withDefault(t => {
        const e = Gl.getValueFor(t);
        return uc.getValueFor(t).evaluate(t, e.evaluate(t).rest)
    }), Hd = vo.create("input-filled-placeholder-hover").withDefault(t => {
        const e = Gl.getValueFor(t);
        return uc.getValueFor(t).evaluate(t, e.evaluate(t).hover)
    }), Md = (t, e, i) => vt`
  :host{${Bh}
    color:${lc};fill:currentcolor;user-select:none;position:relative}${i}{box-sizing:border-box;position:relative;color:inherit;border:calc(${dr} * 1px) solid transparent;border-radius:calc(${cr} * 1px);height:calc(${Zh} * 1px);font-family:inherit;font-size:inherit;line-height:inherit}.control{width:100%;outline:none}.label{display:block;color:${lc};cursor:pointer;${Bh}
    margin-bottom:4px}.label__hidden{display:none;visibility:hidden}:host([disabled]) ${i},:host([readonly]) ${i},:host([disabled]) .label,:host([readonly]) .label,:host([disabled]) .control,:host([readonly]) .control{cursor:${"not-allowed"}}:host([disabled]){opacity:${sr}}`,
    Bd = (t, e, i) => vt`
  @media (forced-colors:none){:host(:not([disabled]):active)::after{left:50%;width:40%;transform:translateX(-50%);border-bottom-left-radius:0;border-bottom-right-radius:0}:host(:not([disabled]):focus-within)::after{left:0;width:100%;transform:none}:host(:not([disabled]):active)::after,:host(:not([disabled]):focus-within:not(:active))::after{content:'';position:absolute;height:calc(${ur} * 1px);bottom:0;border-bottom:calc(${ur} * 1px) solid ${rl};border-bottom-left-radius:calc(${cr} * 1px);border-bottom-right-radius:calc(${cr} * 1px);z-index:2;transition:all 300ms cubic-bezier(0.1,0.9,0.2,1)}}`,
    Nd = (t, e, i, o = ":not([disabled]):not(:focus-within)") => vt`
  ${i}{background:padding-box linear-gradient(${El},${El}),border-box ${Dc}}:host(${o}:hover) ${i}{background:padding-box linear-gradient(${Vl},${Vl}),border-box ${Tc}}:host(:not([disabled]):focus-within) ${i}{background:padding-box linear-gradient(${Al},${Al}),border-box ${Dc}}:host([disabled]) ${i}{background:padding-box linear-gradient(${El},${El}),border-box ${fc}}.control::placeholder{color:${Ld}}:host(${o}:hover) .control::placeholder{color:${Pd}}`,
    jd = (t, e, i, o = ":not([disabled]):not(:focus-within)") => vt`
  ${i}{background:${Wl}}:host(${o}:hover) ${i}{background:${Kl}}:host(:not([disabled]):focus-within) ${i}{background:${Yl}}:host([disabled]) ${i}{background:${Wl}}.control::placeholder{color:${zd}}:host(${o}:hover) .control::placeholder{color:${Hd}}`,
    Ud = (t, e, i, o = ":not([disabled]):not(:focus-within)") => vt`
  :host{color:${Ke.ButtonText}}${i}{background:${Ke.ButtonFace};border-color:${Ke.ButtonText}}:host(${o}:hover) ${i},:host(:not([disabled]):focus-within) ${i}{border-color:${Ke.Highlight}}:host([disabled]) ${i}{opacity:1;background:${Ke.ButtonFace};border-color:${Ke.GrayText}}.control::placeholder,:host(${o}:hover) .control::placeholder{color:${Ke.CanvasText}}:host(:not([disabled]):focus) ${i}{${Yh}
    outline-color:${Ke.Highlight}}:host([disabled]){opacity:1;color:${Ke.GrayText}}:host([disabled]) ::placeholder,:host([disabled]) ::-webkit-input-placeholder{color:${Ke.GrayText}}`;

function qd(t, e) {
    return new an("appearance", t, e)
}

const _d = (t, e) => Td().withBehaviors(qd("neutral", Sd(0, 0, "[href]")), qd("accent", Od(0, 0, "[href]")), qd("hypertext", Ed(0, 0, "[href]")), qd("lightweight", Vd(0, 0, "[href]")), qd("outline", Rd(0, 0, "[href]")), qd("stealth", Ad(0, 0, "[href]")));

class Gd extends ti {
    appearanceChanged(t, e) {
        t !== e && (this.classList.add(e), this.classList.remove(t))
    }

    connectedCallback() {
        super.connectedCallback(), this.appearance || (this.appearance = "neutral")
    }

    defaultSlottedContentChanged() {
        var t, e;
        const i = this.defaultSlottedContent.filter(t => t.nodeType === Node.ELEMENT_NODE);
        1 === i.length && i[0] instanceof SVGElement ? null === (t = this.control) || void 0 === t || t.classList.add("icon-only") : null === (e = this.control) || void 0 === e || e.classList.remove("icon-only")
    }
}

ad([st], Gd.prototype, "appearance", void 0);
const Wd = _d,
    Kd = Gd.compose({baseName: "anchor", baseClass: ti, template: Ze, styles: _d, shadowOptions: {delegatesFocus: !0}}),
    Xd = (t, e) => vt`
  :host{contain:layout;display:block}`, Yd = oi.compose({
        baseName: "anchored-region",
        template: (t, e) => _`<template class="${t => t.initialLayoutComplete ? "loaded" : ""}">${Ot(t => t.initialLayoutComplete, _`<slot></slot>`)}</template>`,
        styles: Xd
    }), Qd = Xd, Zd = (t, e) => vt`
    ${ln("inline-block")} :host{box-sizing:border-box;${Nh}}.control{border-radius:calc(${cr} * 1px);padding:calc(((${lr} * 0.5) - ${dr}) * 1px) calc((${lr} - ${dr}) * 1px);border:calc(${dr} * 1px) solid transparent}:host(.lightweight) .control{background:transparent;color:${lc};font-weight:600}:host(.accent) .control{background:${rl};color:${dl}}:host(.neutral) .control{background:${Wl};color:${lc}}:host([circular]) .control{border-radius:100px;min-width:calc(${xr} - calc(${lr} * 1px));display:flex;align-items:center;justify-content:center}`;

class Jd extends si {
    constructor() {
        super(...arguments), this.appearance = "lightweight"
    }

    appearanceChanged(t, e) {
        t !== e && d.queueUpdate(() => {
            this.classList.add(e), this.classList.remove(t)
        })
    }
}

ad([st({mode: "fromView"})], Jd.prototype, "appearance", void 0);
const tu = Jd.compose({
        baseName: "badge",
        baseClass: si,
        template: (t, e) => _`<template class="${t => t.circular ? "circular" : ""}"><div class="control" part="control" style="${t => t.generateBadgeStyle()}"><slot></slot></div></template>`,
        styles: Zd
    }), eu = Zd, iu = (t, e) => vt`
  ${ln("inline-block")} :host{box-sizing:border-box;${Bh}}.list{display:flex}`, ou = ri.compose({
        baseName: "breadcrumb",
        template: (t, e) => _`<template role="navigation"><div role="list" class="list" part="list"><slot ${Bt({
            property: "slottedBreadcrumbItems",
            filter: zt()
        })}></slot></div></template>`,
        styles: iu
    }), su = iu, nu = (t, e) => vt`
    ${ln("inline-flex")} :host{background:transparent;color:${lc};fill:currentcolor;box-sizing:border-box;${Bh};min-width:calc(${Zh} * 1px);border-radius:calc(${cr} * 1px)}.listitem{display:flex;align-items:center;border-radius:inherit}.control{position:relative;align-items:center;box-sizing:border-box;color:inherit;fill:inherit;cursor:pointer;display:flex;outline:none;text-decoration:none;white-space:nowrap;border-radius:inherit}.control:hover{color:${cc}}.control:active{color:${hc}}.control:${cn}{${Qh}}:host(:not([href])),:host([aria-current]) .control{color:${lc};fill:currentcolor;cursor:default}.start{display:flex;margin-inline-end:6px}.end{display:flex;margin-inline-start:6px}.separator{display:flex}`.withBehaviors(rn(vt`
        :host(:not([href])),.start,.end,.separator{background:${Ke.ButtonFace};color:${Ke.ButtonText};fill:currentcolor}.separator{fill:${Ke.ButtonText}}:host([href]){forced-color-adjust:none;background:${Ke.ButtonFace};color:${Ke.LinkText}}:host([href]) .control:hover{background:${Ke.LinkText};color:${Ke.HighlightText};fill:currentcolor}.control:${cn}{outline-color:${Ke.LinkText}}`)),
    ru = ni.compose({
        baseName: "breadcrumb-item",
        template: (t, e) => _`<div role="listitem" class="listitem" part="listitem">${Ot(t => t.href && t.href.length > 0, _` ${Ze(0, e)} `)} ${Ot(t => !t.href, _` ${_t(0, e)}<slot></slot>${qt(0, e)} `)} ${Ot(t => t.separator, _`<span class="separator" part="separator" aria-hidden="true"><slot name="separator">${e.separator || ""}</slot></span>`)}</div>`,
        styles: nu,
        shadowOptions: {delegatesFocus: !0},
        separator: '\n    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">\n      <path d="M4.65 2.15a.5.5 0 000 .7L7.79 6 4.65 9.15a.5.5 0 10.7.7l3.5-3.5a.5.5 0 000-.7l-3.5-3.5a.5.5 0 00-.7 0z"/>\n    </svg>\n  '
    }), au = nu, lu = (t, e) => vt`
    :host(${":not([disabled])"}) .control{cursor:pointer}:host(${"[disabled]"}) .control{cursor:${"not-allowed"}}@media (forced-colors:none){:host(${"[disabled]"}) .control{opacity:${sr}}}${Td(0, 0, 0, "[disabled]")}
  `.withBehaviors(qd("neutral", Sd(0, 0, ":not([disabled])", "[disabled]")), qd("accent", Od(0, 0, ":not([disabled])", "[disabled]")), qd("lightweight", Vd(0, 0, ":not([disabled])", "[disabled]")), qd("outline", Rd(0, 0, ":not([disabled])", "[disabled]")), qd("stealth", Ad(0, 0, ":not([disabled])", "[disabled]")));

class cu extends pi {
    appearanceChanged(t, e) {
        t !== e && (this.classList.add(e), this.classList.remove(t))
    }

    connectedCallback() {
        super.connectedCallback(), this.appearance || (this.appearance = "neutral")
    }

    defaultSlottedContentChanged() {
        const t = this.defaultSlottedContent.filter(t => t.nodeType === Node.ELEMENT_NODE);
        1 === t.length && t[0] instanceof SVGElement ? this.control.classList.add("icon-only") : this.control.classList.remove("icon-only")
    }
}

ad([st], cu.prototype, "appearance", void 0);
const hu = cu.compose({
    baseName: "button",
    baseClass: pi,
    template: (t, e) => _`<button class="control" part="control" ?autofocus="${t => t.autofocus}" ?disabled="${t => t.disabled}" form="${t => t.formId}" formaction="${t => t.formaction}" formenctype="${t => t.formenctype}" formmethod="${t => t.formmethod}" formnovalidate="${t => t.formnovalidate}" formtarget="${t => t.formtarget}" name="${t => t.name}" type="${t => t.type}" value="${t => t.value}" aria-atomic="${t => t.ariaAtomic}" aria-busy="${t => t.ariaBusy}" aria-controls="${t => t.ariaControls}" aria-current="${t => t.ariaCurrent}" aria-describedby="${t => t.ariaDescribedby}" aria-details="${t => t.ariaDetails}" aria-disabled="${t => t.ariaDisabled}" aria-errormessage="${t => t.ariaErrormessage}" aria-expanded="${t => t.ariaExpanded}" aria-flowto="${t => t.ariaFlowto}" aria-haspopup="${t => t.ariaHaspopup}" aria-hidden="${t => t.ariaHidden}" aria-invalid="${t => t.ariaInvalid}" aria-keyshortcuts="${t => t.ariaKeyshortcuts}" aria-label="${t => t.ariaLabel}" aria-labelledby="${t => t.ariaLabelledby}" aria-live="${t => t.ariaLive}" aria-owns="${t => t.ariaOwns}" aria-pressed="${t => t.ariaPressed}" aria-relevant="${t => t.ariaRelevant}" aria-roledescription="${t => t.ariaRoledescription}" ${St("control")}>${_t(0, e)}<span class="content" part="content"><slot ${Bt("defaultSlottedContent")}></slot></span>${qt(0, e)}</button>`,
    styles: lu,
    shadowOptions: {delegatesFocus: !0}
}), du = lu, uu = vt`
.day.disabled::before{transform:translate(-50%,0) rotate(45deg)}`, pu = vt`
.day.disabled::before{transform:translate(50%,0) rotate(-45deg)}`;

class gu extends mi {
    constructor() {
        super(...arguments), this.readonly = !0
    }
}

ad([st({converter: et})], gu.prototype, "readonly", void 0);
const fu = gu.compose({
    baseName: "calendar",
    template: (t, e) => {
        var i;
        const o = new Date, s = `${o.getMonth() + 1}-${o.getDate()}-${o.getFullYear()}`;
        return _`<template>${Wt} ${e.title instanceof Function ? e.title(t, e) : null !== (i = e.title) && void 0 !== i ? i : ""}<slot></slot>${Ot(t => !1 === t.readonly, Ri(t, s))} ${Ot(t => !0 === t.readonly, (t => _`<div class="days" part="days"><div class="week-days" part="week-days">${Pt(t => t.getWeekdayText(), _`<div class="week-day" part="week-day" abbr="${t => t.abbr}">${t => t.text}</div>`)}</div>${Pt(t => t.getDays(), _`<div class="week">${Pt(t => t, _`<div class="${(e, i) => i.parentContext.parent.getDayClassNames(e, t)}" part="day" aria-label="${(t, e) => e.parentContext.parent.dateFormatter.getDate(`${t.month}-${t.day}-${t.year}`, {
            month: "long",
            day: "numeric"
        })}"><div class="date" part="${e => t === `${e.month}-${e.day}-${e.year}` ? "today" : "date"}">${(t, e) => e.parentContext.parent.dateFormatter.getDay(t.day)}</div><slot name="${t => t.month}-${t => t.day}-${t => t.year}"></slot></div>`)}</div>`)}</div>`)(s))} ${Gt}</template>`
    },
    styles: (t, e) => vt`
${ln("inline-block")} :host{--calendar-cell-size:calc((${nr} + 2 + ${ar}) * ${lr} * 1px);--calendar-gap:2px;${Bh}
  color:${lc}}.title{padding:calc(${lr} * 2px);font-weight:600}.days{text-align:center}.week-days,.week{display:grid;grid-template-columns:repeat(7,1fr);grid-gap:var(--calendar-gap);border:0;padding:0}.day,.week-day{border:0;width:var(--calendar-cell-size);height:var(--calendar-cell-size);line-height:var(--calendar-cell-size);padding:0;box-sizing:initial}.week-day{font-weight:600}.day{border:calc(${dr} * 1px) solid transparent;border-radius:calc(${cr} * 1px)}.interact .day{cursor:pointer}.date{height:100%}.inactive .date,.inactive.disabled::before{color:${pc}}.disabled::before{content:'';display:inline-block;width:calc(var(--calendar-cell-size) * .8);height:calc(${dr} * 1px);background:currentColor;position:absolute;margin-top:calc(var(--calendar-cell-size) / 2);transform-origin:center;z-index:1}.selected{color:${rl};border:1px solid ${rl};background:${ol}}.selected + .selected{border-start-start-radius:0;border-end-start-radius:0;border-inline-start-width:0;padding-inline-start:calc(var(--calendar-gap) + (${dr} + ${cr}) * 1px);margin-inline-start:calc((${cr} * -1px) - var(--calendar-gap))}.today.disabled::before{color:${dl}}.today .date{color:${dl};background:${rl};border-radius:50%;position:relative}`.withBehaviors(rn(vt`
          .day.selected{color:${Ke.Highlight}}.today .date{background:${Ke.Highlight};color:${Ke.HighlightText}}`), new ld(uu, pu)),
    title: Ei
}), mu = (t, e) => vt`
    ${ln("block")} :host{display:block;contain:content;height:var(--card-height,100%);width:var(--card-width,100%);box-sizing:border-box;background:${ol};color:${lc};border:calc(${dr} * 1px) solid ${Vc};border-radius:calc(${hr} * 1px);box-shadow:${bd}}:host{content-visibility:auto}`.withBehaviors(rn(vt`
        :host{background:${Ke.Canvas};color:${Ke.CanvasText}}`));

class vu extends Ai {
    cardFillColorChanged(t, e) {
        if (e) {
            const t = Sn(e);
            null !== t && (this.neutralPaletteSource = e, ol.setValueFor(this, En.create(t.r, t.g, t.b)))
        }
    }

    neutralPaletteSourceChanged(t, e) {
        if (e) {
            const t = Sn(e), i = En.create(t.r, t.g, t.b);
            ja.setValueFor(this, zn.create(i))
        }
    }

    handleChange(t, e) {
        this.cardFillColor || ol.setValueFor(this, e => Bl.getValueFor(e).evaluate(e, ol.getValueFor(t)).rest)
    }

    connectedCallback() {
        super.connectedCallback();
        const t = Ji(this);
        if (t) {
            const e = g.getNotifier(t);
            e.subscribe(this, "fillColor"), e.subscribe(this, "neutralPalette"), this.handleChange(t, "fillColor")
        }
    }
}

ad([st({
    attribute: "card-fill-color",
    mode: "fromView"
})], vu.prototype, "cardFillColor", void 0), ad([st({
    attribute: "neutral-palette-source",
    mode: "fromView"
})], vu.prototype, "neutralPaletteSource", void 0);
const bu = vu.compose({baseName: "card", baseClass: Ai, template: (t, e) => _`<slot></slot>`, styles: mu}), yu = mu,
    xu = (t, e) => vt`
    ${ln("inline-flex")} :host{align-items:center;outline:none;${""} user-select:none}.control{position:relative;width:calc((${Zh} / 2 + ${lr}) * 1px);height:calc((${Zh} / 2 + ${lr}) * 1px);box-sizing:border-box;border-radius:calc(${cr} * 1px);border:calc(${dr} * 1px) solid ${Pc};background:${Pl};cursor:pointer}.label__hidden{display:none;visibility:hidden}.label{${Bh}
      color:${lc};${""} padding-inline-start:calc(${lr} * 2px + 2px);margin-inline-end:calc(${lr} * 2px + 2px);cursor:pointer}slot[name='checked-indicator'],slot[name='indeterminate-indicator']{display:flex;align-items:center;justify-content:center;width:100%;height:100%;fill:${lc};opacity:0;pointer-events:none}slot[name='indeterminate-indicator']{position:absolute;top:0}:host(.checked) slot[name='checked-indicator'],:host(.checked) slot[name='indeterminate-indicator']{fill:${dl}}:host(:not(.disabled):hover) .control{background:${zl};border-color:${zc}}:host(:not(.disabled):active) .control{background:${Hl};border-color:${Hc}}:host(:${cn}) .control{background:${Ml};${Qh}}:host(.checked) .control{background:${rl};border-color:transparent}:host(.checked:not(.disabled):hover) .control{background:${al};border-color:transparent}:host(.checked:not(.disabled):active) .control{background:${ll};border-color:transparent}:host(.disabled) .label,:host(.readonly) .label,:host(.readonly) .control,:host(.disabled) .control{cursor:${"not-allowed"}}:host(.checked:not(.indeterminate)) slot[name='checked-indicator'],:host(.indeterminate) slot[name='indeterminate-indicator']{opacity:1}:host(.disabled){opacity:${sr}}`.withBehaviors(rn(vt`
        .control{border-color:${Ke.FieldText};background:${Ke.Field}}:host(:not(.disabled):hover) .control,:host(:not(.disabled):active) .control{border-color:${Ke.Highlight};background:${Ke.Field}}slot[name='checked-indicator'],slot[name='indeterminate-indicator']{fill:${Ke.FieldText}}:host(:${cn}) .control{forced-color-adjust:none;outline-color:${Ke.FieldText};background:${Ke.Field};border-color:${Ke.Highlight}}:host(.checked) .control{background:${Ke.Highlight};border-color:${Ke.Highlight}}:host(.checked:not(.disabled):hover) .control,:host(.checked:not(.disabled):active) .control{background:${Ke.HighlightText};border-color:${Ke.Highlight}}:host(.checked) slot[name='checked-indicator'],:host(.checked) slot[name='indeterminate-indicator']{fill:${Ke.HighlightText}}:host(.checked:hover ) .control slot[name='checked-indicator'],:host(.checked:hover ) .control slot[name='indeterminate-indicator']{fill:${Ke.Highlight}}:host(.disabled){opacity:1}:host(.disabled) .control{border-color:${Ke.GrayText};background:${Ke.Field}}:host(.disabled) slot[name='checked-indicator'],:host(.checked.disabled:hover) .control slot[name='checked-indicator'],:host(.disabled) slot[name='indeterminate-indicator'],:host(.checked.disabled:hover) .control slot[name='indeterminate-indicator']{fill:${Ke.GrayText}}`)),
    $u = zi.compose({
        baseName: "checkbox",
        template: (t, e) => _`<template role="checkbox" aria-checked="${t => t.checked}" aria-required="${t => t.required}" aria-disabled="${t => t.disabled}" aria-readonly="${t => t.readOnly}" tabindex="${t => t.disabled ? null : 0}" @keypress="${(t, e) => t.keypressHandler(e.event)}" @click="${(t, e) => t.clickHandler(e.event)}" class="${t => t.readOnly ? "readonly" : ""} ${t => t.checked ? "checked" : ""} ${t => t.indeterminate ? "indeterminate" : ""}"><div part="control" class="control"><slot name="checked-indicator">${e.checkedIndicator || ""}</slot><slot name="indeterminate-indicator">${e.indeterminateIndicator || ""}</slot></div><label part="label" class="${t => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"><slot ${Bt("defaultSlottedNodes")}></slot></label></template>`,
        styles: xu,
        checkedIndicator: '\n    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n      <path d="M13.86 3.66a.5.5 0 01-.02.7l-7.93 7.48a.6.6 0 01-.84-.02L2.4 9.1a.5.5 0 01.72-.7l2.4 2.44 7.65-7.2a.5.5 0 01.7.02z"/>\n    </svg>\n  ',
        indeterminateIndicator: '\n    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n      <path d="M3 8c0-.28.22-.5.5-.5h9a.5.5 0 010 1h-9A.5.5 0 013 8z"/>\n    </svg>\n  '
    }), wu = xu, ku = (t, e) => vt`
    ${ln("inline-flex")}
    
    :host{border-radius:calc(${cr} * 1px);box-sizing:border-box;color:${lc};fill:currentcolor;font-family:${pr};position:relative;user-select:none;min-width:250px;vertical-align:top}.listbox{box-shadow:${Id};background:${ol};border-radius:calc(${hr} * 1px);box-sizing:border-box;display:inline-flex;flex-direction:column;left:0;max-height:calc(var(--max-height) - (${Zh} * 1px));padding:calc((${lr} - ${dr} ) * 1px);overflow-y:auto;position:absolute;width:100%;z-index:1;margin:1px 0;border:calc(${dr} * 1px) solid transparent}.listbox[hidden]{display:none}.control{border:calc(${dr} * 1px) solid transparent;border-radius:calc(${cr} * 1px);height:calc(${Zh} * 1px);align-items:center;box-sizing:border-box;cursor:pointer;display:flex;${Bh}
      min-height:100%;padding:0 calc(${lr} * 2.25px);width:100%}:host(:${cn}){${Yh}}:host([disabled]) .control{cursor:${"not-allowed"};opacity:${sr};user-select:none}:host([open][position='above']) .listbox{bottom:calc((${Zh} + ${lr} * 2) * 1px)}:host([open][position='below']) .listbox{top:calc((${Zh} + ${lr} * 2) * 1px)}.selected-value{font-family:inherit;flex:1 1 auto;text-align:start}.indicator{flex:0 0 auto;margin-inline-start:1em}slot[name='listbox']{display:none;width:100%}:host([open]) slot[name='listbox']{display:flex;position:absolute}.start{margin-inline-end:11px}.end{margin-inline-start:11px}.start,.end,.indicator,::slotted(svg){display:flex}::slotted([role='option']){flex:0 0 auto}`,
    Cu = (t, e) => ku().withBehaviors(qd("outline", Sd(0, 0, ":not([disabled]):not([open])", "[disabled]")), qd("filled", jd(0, 0, ".control", ":not([disabled]):not([open])").withBehaviors(rn(Ud(0, 0, ".control", ":not([disabled]):not([open])")))), qd("stealth", Ad(0, 0, ":not([disabled]):not([open])", "[disabled]")), rn(vt`
    :host([open]) .listbox{background:${Ke.ButtonFace};border-color:${Ke.CanvasText}}`)), Iu = (t, e) => vt`
    ${ku()}

    ${Bd()}

    :host(:empty) .listbox{display:none}:host([disabled]) *,:host([disabled]){cursor:${"not-allowed"};user-select:none}:host(:active) .selected-value{user-select:none}.selected-value{-webkit-appearance:none;background:transparent;border:none;color:inherit;${Bh}
      height:calc(100% - ${dr} * 1px));margin:auto 0;width:100%;outline:none}`.withBehaviors(qd("outline", Nd(0, 0, ".control", ":not([disabled]):not([open])")), qd("filled", jd(0, 0, ".control", ":not([disabled]):not([open])")), rn(Ud(0, 0, ".control", ":not([disabled]):not([open])")));

class Fu extends Qi {
    appearanceChanged(t, e) {
        t !== e && (this.classList.add(e), this.classList.remove(t))
    }

    connectedCallback() {
        super.connectedCallback(), this.appearance || (this.appearance = "outline"), this.listbox && ol.setValueFor(this.listbox, Ka)
    }
}

ad([st({mode: "fromView"})], Fu.prototype, "appearance", void 0);
const Du = Fu.compose({
        baseName: "combobox",
        baseClass: Qi,
        shadowOptions: {delegatesFocus: !0},
        template: (t, e) => _`<template aria-disabled="${t => t.ariaDisabled}" autocomplete="${t => t.autocomplete}" class="${t => t.open ? "open" : ""} ${t => t.disabled ? "disabled" : ""} ${t => t.position}" ?open="${t => t.open}" tabindex="${t => t.disabled ? null : "0"}" @click="${(t, e) => t.clickHandler(e.event)}" @focusout="${(t, e) => t.focusoutHandler(e.event)}" @keydown="${(t, e) => t.keydownHandler(e.event)}"><div class="control" part="control">${_t(0, e)}<slot name="control"><input aria-activedescendant="${t => t.open ? t.ariaActiveDescendant : null}" aria-autocomplete="${t => t.ariaAutoComplete}" aria-controls="${t => t.ariaControls}" aria-disabled="${t => t.ariaDisabled}" aria-expanded="${t => t.ariaExpanded}" aria-haspopup="listbox" class="selected-value" part="selected-value" placeholder="${t => t.placeholder}" role="combobox" type="text" ?disabled="${t => t.disabled}" :value="${t => t.value}" @input="${(t, e) => t.inputHandler(e.event)}" @keyup="${(t, e) => t.keyupHandler(e.event)}" ${St("control")} /><div class="indicator" part="indicator" aria-hidden="true"><slot name="indicator">${e.indicator || ""}</slot></div></slot>${qt(0, e)}</div><div class="listbox" id="${t => t.listboxId}" part="listbox" role="listbox" ?disabled="${t => t.disabled}" ?hidden="${t => !t.open}" ${St("listbox")}><slot ${Bt({
            filter: Ni.slottedOptionFilter,
            flatten: !0,
            property: "slottedOptions"
        })}></slot></div></template>`,
        styles: Iu,
        indicator: '\n    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">\n      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>\n    </svg>\n  '
    }), Tu = Iu, Su = (t, e) => vt`
  :host{display:flex;position:relative;flex-direction:column}`, Ou = (t, e) => vt`
    :host{display:grid;padding:1px 0;box-sizing:border-box;width:100%;border-bottom:calc(${dr} * 1px) solid ${Ic}}:host(.header){}:host(.sticky-header){background:${ol};position:sticky;top:0}`.withBehaviors(rn(vt`
        :host{}`)), Eu = (t, e) => vt`
    :host{padding:calc((${lr} + ${ur} - ${dr}) * 1px) calc(((${lr} * 3) + ${ur} - ${dr}) * 1px);color:${lc};box-sizing:border-box;${Bh}
      border:transparent calc(${dr} * 1px) solid;overflow:hidden;white-space:nowrap;border-radius:calc(${cr} * 1px)}:host(.column-header){font-weight:600}:host(:${cn}){${Yh}}`.withBehaviors(rn(vt`
        :host{forced-color-adjust:none;background:${Ke.Field};color:${Ke.FieldText}}:host(:${cn}){outline-color:${Ke.FieldText}}`)),
    Vu = Oi.compose({
        baseName: "data-grid-cell",
        template: (t, e) => _`<template tabindex="-1" role="${t => t.cellType && "default" !== t.cellType ? t.cellType : "gridcell"}" class=" ${t => "columnheader" === t.cellType ? "column-header" : "rowheader" === t.cellType ? "row-header" : ""} "><slot></slot></template>`,
        styles: Eu
    }), Ru = Eu, Au = Fi.compose({
        baseName: "data-grid-row",
        template: (t, e) => _`<template role="row" class="${t => "default" !== t.rowType ? t.rowType : ""}" :defaultCellItemTemplate="${function (t) {
            const e = t.tagFor(Oi);
            return _`<${e} cell-type="${t => t.isRowHeader ? "rowheader" : void 0}" grid-column="${(t, e) => e.index + 1}" :rowData="${(t, e) => e.parent.rowData}" :columnDefinition="${t => t}"></${e}>`
        }(t)}" :defaultHeaderCellItemTemplate="${function (t) {
            const e = t.tagFor(Oi);
            return _`<${e} cell-type="columnheader" grid-column="${(t, e) => e.index + 1}" :columnDefinition="${t => t}"></${e}>`
        }(t)}" ${jt({
            property: "cellElements",
            filter: zt('[role="cell"],[role="gridcell"],[role="columnheader"],[role="rowheader"]')
        })}><slot ${Bt("slottedCellElements")}></slot></template>`,
        styles: Ou
    }), Lu = Ou, Pu = Di.compose({
        baseName: "data-grid", template: (t, e) => {
            const i = function (t) {
                const e = t.tagFor(Fi);
                return _`<${e} :rowData="${t => t}" :cellItemTemplate="${(t, e) => e.parent.cellItemTemplate}" :headerCellItemTemplate="${(t, e) => e.parent.headerCellItemTemplate}"></${e}>`
            }(t), o = t.tagFor(Fi);
            return _`<template role="grid" tabindex="0" :rowElementTag="${() => o}" :defaultRowItemTemplate="${i}" ${jt({
                property: "rowElements",
                filter: zt("[role=row]")
            })}><slot></slot></template>`
        }, styles: Su
    }), zu = Su, Hu = {
        toView: t => null == t ? null : null == t ? void 0 : t.toColorString(), fromView(t) {
            if (null == t) return null;
            const e = Sn(t);
            return e ? En.create(e.r, e.g, e.b) : null
        }
    }, Mu = vt`
  :host{background-color:${ol};color:${lc}}`.withBehaviors(rn(vt`
      :host{background-color:${Ke.Canvas};box-shadow:0 0 0 1px ${Ke.CanvasText};color:${Ke.CanvasText}}`));

function Bu(t) {
    return (e, i) => {
        e[i + "Changed"] = function (e, i) {
            null != i ? t.setValueFor(this, i) : t.deleteValueFor(this)
        }
    }
}

class Nu extends Ee {
    constructor() {
        super(), this.noPaint = !1;
        const t = {handleChange: this.noPaintChanged.bind(this)};
        g.getNotifier(this).subscribe(t, "fillColor"), g.getNotifier(this).subscribe(t, "baseLayerLuminance")
    }

    connectedCallback() {
        super.connectedCallback(), this.noPaintChanged()
    }

    noPaintChanged() {
        this.noPaint || void 0 === this.fillColor && !this.baseLayerLuminance ? this.$fastController.removeStyles(Mu) : this.$fastController.addStyles(Mu)
    }
}

ad([st({attribute: "no-paint", mode: "boolean"})], Nu.prototype, "noPaint", void 0), ad([st({
    attribute: "fill-color",
    converter: Hu,
    mode: "fromView"
}), Bu(ol)], Nu.prototype, "fillColor", void 0), ad([st({
    attribute: "accent-base-color",
    converter: Hu,
    mode: "fromView"
}), Bu(Ua)], Nu.prototype, "accentBaseColor", void 0), ad([st({
    attribute: "neutral-base-color",
    converter: Hu,
    mode: "fromView"
}), Bu(Na)], Nu.prototype, "neutralBaseColor", void 0), ad([st({converter: it}), Bu(ar)], Nu.prototype, "density", void 0), ad([st({
    attribute: "design-unit",
    converter: it
}), Bu(lr)], Nu.prototype, "designUnit", void 0), ad([st({attribute: "direction"}), Bu(or)], Nu.prototype, "direction", void 0), ad([st({
    attribute: "base-height-multiplier",
    converter: it
}), Bu(nr)], Nu.prototype, "baseHeightMultiplier", void 0), ad([st({
    attribute: "base-horizontal-spacing-multiplier",
    converter: it
}), Bu(rr)], Nu.prototype, "baseHorizontalSpacingMultiplier", void 0), ad([st({
    attribute: "control-corner-radius",
    converter: it
}), Bu(cr)], Nu.prototype, "controlCornerRadius", void 0), ad([st({
    attribute: "layer-corner-radius",
    converter: it
}), Bu(hr)], Nu.prototype, "layerCornerRadius", void 0), ad([st({
    attribute: "stroke-width",
    converter: it
}), Bu(dr)], Nu.prototype, "strokeWidth", void 0), ad([st({
    attribute: "focus-stroke-width",
    converter: it
}), Bu(ur)], Nu.prototype, "focusStrokeWidth", void 0), ad([st({
    attribute: "disabled-opacity",
    converter: it
}), Bu(sr)], Nu.prototype, "disabledOpacity", void 0), ad([st({attribute: "type-ramp-minus-2-font-size"}), Bu(wr)], Nu.prototype, "typeRampMinus2FontSize", void 0), ad([st({attribute: "type-ramp-minus-2-line-height"}), Bu(kr)], Nu.prototype, "typeRampMinus2LineHeight", void 0), ad([st({attribute: "type-ramp-minus-1-font-size"}), Bu(yr)], Nu.prototype, "typeRampMinus1FontSize", void 0), ad([st({attribute: "type-ramp-minus-1-line-height"}), Bu(xr)], Nu.prototype, "typeRampMinus1LineHeight", void 0), ad([st({attribute: "type-ramp-base-font-size"}), Bu(mr)], Nu.prototype, "typeRampBaseFontSize", void 0), ad([st({attribute: "type-ramp-base-line-height"}), Bu(vr)], Nu.prototype, "typeRampBaseLineHeight", void 0), ad([st({attribute: "type-ramp-plus-1-font-size"}), Bu(Ir)], Nu.prototype, "typeRampPlus1FontSize", void 0), ad([st({attribute: "type-ramp-plus-1-line-height"}), Bu(Fr)], Nu.prototype, "typeRampPlus1LineHeight", void 0), ad([st({attribute: "type-ramp-plus-2-font-size"}), Bu(Tr)], Nu.prototype, "typeRampPlus2FontSize", void 0), ad([st({attribute: "type-ramp-plus-2-line-height"}), Bu(Sr)], Nu.prototype, "typeRampPlus2LineHeight", void 0), ad([st({attribute: "type-ramp-plus-3-font-size"}), Bu(Er)], Nu.prototype, "typeRampPlus3FontSize", void 0), ad([st({attribute: "type-ramp-plus-3-line-height"}), Bu(Vr)], Nu.prototype, "typeRampPlus3LineHeight", void 0), ad([st({attribute: "type-ramp-plus-4-font-size"}), Bu(Ar)], Nu.prototype, "typeRampPlus4FontSize", void 0), ad([st({attribute: "type-ramp-plus-4-line-height"}), Bu(Lr)], Nu.prototype, "typeRampPlus4LineHeight", void 0), ad([st({attribute: "type-ramp-plus-5-font-size"}), Bu(zr)], Nu.prototype, "typeRampPlus5FontSize", void 0), ad([st({attribute: "type-ramp-plus-5-line-height"}), Bu(Hr)], Nu.prototype, "typeRampPlus5LineHeight", void 0), ad([st({attribute: "type-ramp-plus-6-font-size"}), Bu(Br)], Nu.prototype, "typeRampPlus6FontSize", void 0), ad([st({attribute: "type-ramp-plus-6-line-height"}), Bu(Nr)], Nu.prototype, "typeRampPlus6LineHeight", void 0), ad([st({
    attribute: "accent-fill-rest-delta",
    converter: it
}), Bu(qr)], Nu.prototype, "accentFillRestDelta", void 0), ad([st({
    attribute: "accent-fill-hover-delta",
    converter: it
}), Bu(_r)], Nu.prototype, "accentFillHoverDelta", void 0), ad([st({
    attribute: "accent-fill-active-delta",
    converter: it
}), Bu(Gr)], Nu.prototype, "accentFillActiveDelta", void 0), ad([st({
    attribute: "accent-fill-focus-delta",
    converter: it
}), Bu(Wr)], Nu.prototype, "accentFillFocusDelta", void 0), ad([st({
    attribute: "accent-foreground-rest-delta",
    converter: it
}), Bu(Kr)], Nu.prototype, "accentForegroundRestDelta", void 0), ad([st({
    attribute: "accent-foreground-hover-delta",
    converter: it
}), Bu(Xr)], Nu.prototype, "accentForegroundHoverDelta", void 0), ad([st({
    attribute: "accent-foreground-active-delta",
    converter: it
}), Bu(Yr)], Nu.prototype, "accentForegroundActiveDelta", void 0), ad([st({
    attribute: "accent-foreground-focus-delta",
    converter: it
}), Bu(Qr)], Nu.prototype, "accentForegroundFocusDelta", void 0), ad([st({
    attribute: "neutral-fill-rest-delta",
    converter: it
}), Bu(Zr)], Nu.prototype, "neutralFillRestDelta", void 0), ad([st({
    attribute: "neutral-fill-hover-delta",
    converter: it
}), Bu(Jr)], Nu.prototype, "neutralFillHoverDelta", void 0), ad([st({
    attribute: "neutral-fill-active-delta",
    converter: it
}), Bu(ta)], Nu.prototype, "neutralFillActiveDelta", void 0), ad([st({
    attribute: "neutral-fill-focus-delta",
    converter: it
}), Bu(ea)], Nu.prototype, "neutralFillFocusDelta", void 0), ad([st({
    attribute: "neutral-fill-input-rest-delta",
    converter: it
}), Bu(ia)], Nu.prototype, "neutralFillInputRestDelta", void 0), ad([st({
    attribute: "neutral-fill-input-hover-delta",
    converter: it
}), Bu(oa)], Nu.prototype, "neutralFillInputHoverDelta", void 0), ad([st({
    attribute: "neutral-fill-input-active-delta",
    converter: it
}), Bu(sa)], Nu.prototype, "neutralFillInputActiveDelta", void 0), ad([st({
    attribute: "neutral-fill-input-focus-delta",
    converter: it
}), Bu(na)], Nu.prototype, "neutralFillInputFocusDelta", void 0), ad([st({
    attribute: "neutral-fill-layer-rest-delta",
    converter: it
}), Bu(ha)], Nu.prototype, "neutralFillLayerRestDelta", void 0), ad([st({
    attribute: "neutral-fill-stealth-rest-delta",
    converter: it
}), Bu(ba)], Nu.prototype, "neutralFillStealthRestDelta", void 0), ad([st({
    attribute: "neutral-fill-stealth-hover-delta",
    converter: it
}), Bu(ya)], Nu.prototype, "neutralFillStealthHoverDelta", void 0), ad([st({
    attribute: "neutral-fill-stealth-active-delta",
    converter: it
}), Bu(xa)], Nu.prototype, "neutralFillStealthActiveDelta", void 0), ad([st({
    attribute: "neutral-fill-stealth-focus-delta",
    converter: it
}), Bu($a)], Nu.prototype, "neutralFillStealthFocusDelta", void 0), ad([st({
    attribute: "neutral-fill-strong-hover-delta",
    converter: it
}), Bu(ka)], Nu.prototype, "neutralFillStrongHoverDelta", void 0), ad([st({
    attribute: "neutral-fill-strong-active-delta",
    converter: it
}), Bu(Ca)], Nu.prototype, "neutralFillStrongActiveDelta", void 0), ad([st({
    attribute: "neutral-fill-strong-focus-delta",
    converter: it
}), Bu(Ia)], Nu.prototype, "neutralFillStrongFocusDelta", void 0), ad([st({
    attribute: "base-layer-luminance",
    converter: it
}), Bu(Ur)], Nu.prototype, "baseLayerLuminance", void 0), ad([st({
    attribute: "neutral-stroke-divider-rest-delta",
    converter: it
}), Bu(Aa)], Nu.prototype, "neutralStrokeDividerRestDelta", void 0), ad([st({
    attribute: "neutral-stroke-rest-delta",
    converter: it
}), Bu(Fa)], Nu.prototype, "neutralStrokeRestDelta", void 0), ad([st({
    attribute: "neutral-stroke-hover-delta",
    converter: it
}), Bu(Da)], Nu.prototype, "neutralStrokeHoverDelta", void 0), ad([st({
    attribute: "neutral-stroke-active-delta",
    converter: it
}), Bu(Ta)], Nu.prototype, "neutralStrokeActiveDelta", void 0), ad([st({
    attribute: "neutral-stroke-focus-delta",
    converter: it
}), Bu(Sa)], Nu.prototype, "neutralStrokeFocusDelta", void 0);
const ju = Nu.compose({
        baseName: "design-system-provider", template: _`<slot></slot>`, styles: vt`
    ${ln("block")}
  `
    }), Uu = (t, e) => vt`
  :host([hidden]){display:none}:host{--dialog-height:480px;--dialog-width:640px;display:block}.overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);touch-action:none}.positioning-region{display:flex;justify-content:center;position:fixed;top:0;bottom:0;left:0;right:0;overflow:auto}.control{box-shadow:${Dd};margin-top:auto;margin-bottom:auto;border-radius:calc(${hr} * 1px);width:var(--dialog-width);height:var(--dialog-height);background:${ol};z-index:1;border:calc(${dr} * 1px) solid transparent}`,
    qu = Po.compose({
        baseName: "dialog",
        template: (t, e) => _`<div class="positioning-region" part="positioning-region">${Ot(t => t.modal, _`<div class="overlay" part="overlay" role="presentation" @click="${t => t.dismiss()}"></div>`)}<div role="dialog" tabindex="-1" class="control" part="control" aria-modal="${t => t.modal}" aria-describedby="${t => t.ariaDescribedby}" aria-labelledby="${t => t.ariaLabelledby}" aria-label="${t => t.ariaLabel}" ${St("dialog")}><slot></slot></div></div>`,
        styles: Uu
    }), _u = Uu, Gu = (t, e) => vt`
    ${ln("block")} :host{box-sizing:content-box;height:0;border:none;border-top:calc(${dr} * 1px) solid ${Ic}}:host([orientation="vertical"]){border:none;height:100%;margin:0 calc(${lr} * 1px);border-left:calc(${dr} * 1px) solid ${Ic}}`,
    Wu = Ho.compose({
        baseName: "divider",
        template: (t, e) => _`<template role="${t => t.role}" aria-orientation="${t => t.orientation}"></template>`,
        styles: Gu
    }), Ku = Gu, Xu = (t, e) => vt`
    ${ln("inline-flex")} :host{height:calc((${Zh} + ${lr}) * 1px);justify-content:center;align-items:center;fill:currentcolor;color:${oc};background:padding-box linear-gradient(${Fl},${Fl}),border-box ${xc};box-sizing:border-box;border:calc(${dr} * 1px) solid transparent;border-radius:calc(${cr} * 1px);padding:0}:host(.disabled){opacity:${sr};cursor:${"not-allowed"};pointer-events:none}.next,.previous{display:flex}:host(:not(.disabled):hover){cursor:pointer}:host(:not(.disabled):hover){color:${sc}}:host(:not(.disabled):active){color:${nc}}:host(:${cn}){${Yh}}:host::-moz-focus-inner{border:0}`.withBehaviors(rn(vt`
        :host{background:${Ke.ButtonFace};border-color:${Ke.ButtonText}}:host .next,:host .previous{color:${Ke.ButtonText};fill:currentcolor}:host(:not(.disabled):hover){background:${Ke.Highlight}}:host(:not(.disabled):hover) .next,:host(:not(.disabled):hover) .previous{color:${Ke.HighlightText};fill:currentcolor}:host(.disabled){opacity:1}:host(.disabled),:host(.disabled) .next,:host(.disabled) .previous{border-color:${Ke.GrayText};color:${Ke.GrayText};fill:currentcolor}:host(:${cn}){forced-color-adjust:none;outline-color:${Ke.Highlight}}`)),
    Yu = No.compose({
        baseName: "flipper",
        template: (t, e) => _`<template role="button" aria-disabled="${t => !!t.disabled || void 0}" tabindex="${t => t.hiddenFromAT ? -1 : 0}" class="${t => t.direction} ${t => t.disabled ? "disabled" : ""}" @keyup="${(t, e) => t.keyupHandler(e.event)}">${Ot(t => t.direction === Mo, _`<span part="next" class="next"><slot name="next">${e.next || ""}</slot></span>`)} ${Ot(t => t.direction === Bo, _`<span part="previous" class="previous"><slot name="previous">${e.previous || ""}</slot></span>`)}</template>`,
        styles: Xu,
        next: '\n    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n      <path d="M7.57 11.84A1 1 0 016 11.02V4.98a1 1 0 011.57-.82l3.79 2.62c.85.59.85 1.85 0 2.44l-3.79 2.62z"/>\n    </svg>\n  ',
        previous: '\n    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n      <path d="M9.43 11.84a1 1 0 001.57-.82V4.98a1 1 0 00-1.57-.82L5.64 6.78c-.85.59-.85 1.85 0 2.44l3.79 2.62z"/>\n    </svg>\n  '
    }), Qu = Xu, Zu = vt`
  .scroll-prev{right:auto;left:0}.scroll.scroll-next::before,.scroll-next .scroll-action{left:auto;right:0}.scroll.scroll-next::before{background:linear-gradient(to right,transparent,var(--scroll-fade-next))}.scroll-next .scroll-action{transform:translate(50%,-50%)}`,
    Ju = vt`
  .scroll.scroll-next{right:auto;left:0}.scroll.scroll-next::before{background:linear-gradient(to right,var(--scroll-fade-next),transparent);left:auto;right:0}.scroll.scroll-prev::before{background:linear-gradient(to right,transparent,var(--scroll-fade-previous))}.scroll-prev .scroll-action{left:auto;right:0;transform:translate(50%,-50%)}`,
    tp = vt`
  .scroll-area{position:relative}div.scroll-view{overflow-x:hidden}.scroll{bottom:0;pointer-events:none;position:absolute;right:0;top:0;user-select:none;width:100px}.scroll.disabled{display:none}.scroll::before,.scroll-action{left:0;position:absolute}.scroll::before{background:linear-gradient(to right,var(--scroll-fade-previous),transparent);content:'';display:block;height:100%;width:100%}.scroll-action{pointer-events:auto;right:auto;top:50%;transform:translate(-50%,-50%)}::slotted(fluent-flipper){opacity:0;transition:opacity 0.2s ease-in-out}.scroll-area:hover ::slotted(fluent-flipper){opacity:1}`.withBehaviors(new ld(Zu, Ju)),
    ep = (t, e) => vt`
  ${ln("block")} :host{--scroll-align:center;--scroll-item-spacing:4px;contain:layout;position:relative}.scroll-view{overflow-x:auto;scrollbar-width:none}::-webkit-scrollbar{display:none}.content-container{align-items:var(--scroll-align);display:inline-flex;flex-wrap:nowrap;position:relative}.content-container ::slotted(*){margin-right:var(--scroll-item-spacing)}.content-container ::slotted(*:last-child){margin-right:0}`;

class ip extends ls {
    connectedCallback() {
        super.connectedCallback(), "mobile" !== this.view && this.$fastController.addStyles(tp)
    }
}

const op = ip.compose({
    baseName: "horizontal-scroll",
    baseClass: ls,
    template: (t, e) => {
        var i, o;
        return _`<template class="horizontal-scroll" @keyup="${(t, e) => t.keyupHandler(e.event)}">${_t(0, e)}<div class="scroll-area" part="scroll-area"><div class="scroll-view" part="scroll-view" @scroll="${t => t.scrolled()}" ${St("scrollContainer")}><div class="content-container" part="content-container" ${St("content")}><slot ${Bt({
            property: "scrollItems",
            filter: zt()
        })}></slot></div></div>${Ot(t => "mobile" !== t.view, _`<div class="scroll scroll-prev" part="scroll-prev" ${St("previousFlipperContainer")}><div class="scroll-action" part="scroll-action-previous"><slot name="previous-flipper">${e.previousFlipper instanceof Function ? e.previousFlipper(t, e) : null !== (i = e.previousFlipper) && void 0 !== i ? i : ""}</slot></div></div><div class="scroll scroll-next" part="scroll-next" ${St("nextFlipperContainer")}><div class="scroll-action" part="scroll-action-next"><slot name="next-flipper">${e.nextFlipper instanceof Function ? e.nextFlipper(t, e) : null !== (o = e.nextFlipper) && void 0 !== o ? o : ""}</slot></div></div>`)}</div>${qt(0, e)}</template>`
    },
    styles: ep,
    nextFlipper: _`<fluent-flipper @click="${t => t.scrollToNext()}" aria-hidden="${t => t.flippersHiddenFromAT}"></fluent-flipper>`,
    previousFlipper: _`<fluent-flipper @click="${t => t.scrollToPrevious()}" direction="previous" aria-hidden="${t => t.flippersHiddenFromAT}"></fluent-flipper>`
}), sp = ep, np = (t, e) => vt`
    ${ln("inline-flex")} :host{border:calc(${dr} * 1px) solid ${fc};border-radius:calc(${cr} * 1px);box-sizing:border-box;flex-direction:column;padding:calc(${lr} * 1px) 0}::slotted(${t.tagFor(Mi)}){margin:0 calc(${lr} * 1px)}:host(:focus-within:not([disabled])){${Yh}}`;

class rp extends Ni {
}

const ap = rp.compose({
        baseName: "listbox",
        template: (t, e) => _`<template aria-activedescendant="${t => t.ariaActiveDescendant}" aria-multiselectable="${t => t.ariaMultiSelectable}" class="listbox" role="listbox" tabindex="${t => t.disabled ? null : "0"}" @click="${(t, e) => t.clickHandler(e.event)}" @focusin="${(t, e) => t.focusinHandler(e.event)}" @keydown="${(t, e) => t.keydownHandler(e.event)}" @mousedown="${(t, e) => t.mousedownHandler(e.event)}"><slot ${Bt({
            filter: jo.slottedOptionFilter,
            flatten: !0,
            property: "slottedOptions"
        })}></slot></template>`,
        styles: np
    }), lp = np, cp = (t, e) => vt`
    ${ln("inline-flex")} :host{position:relative;${Bh}
      background:${Zl};border-radius:calc(${cr} * 1px);border:calc(${dr} * 1px) solid transparent;box-sizing:border-box;color:${lc};cursor:pointer;fill:currentcolor;height:calc(${Zh} * 1px);overflow:hidden;align-items:center;padding:0 calc(((${lr} * 3) - ${dr} - 1) * 1px);user-select:none;white-space:nowrap}:host::before{content:'';display:block;position:absolute;left:calc((${ur} - ${dr}) * 1px);top:calc((${Zh} / 4) - ${ur} * 1px);width:3px;height:calc((${Zh} / 2) * 1px);background:transparent;border-radius:calc(${cr} * 1px)}:host(:not([disabled]):hover){background:${Jl}}:host(:not([disabled]):active){background:${tc}}:host(:not([disabled]):active)::before{background:${rl};height:calc(((${Zh} / 2) - 6) * 1px)}:host([aria-selected='true'])::before{background:${rl}}:host(:${cn}){${Yh}
      background:${ec}}:host([aria-selected='true']){background:${Wl}}:host(:not([disabled])[aria-selected='true']:hover){background:${Kl}}:host(:not([disabled])[aria-selected='true']:active){background:${Xl}}:host(:not([disabled]):not([aria-selected='true']):hover){background:${Jl}}:host(:not([disabled]):not([aria-selected='true']):active){background:${tc}}:host([disabled]){cursor:${"not-allowed"};opacity:${sr}}.content{grid-column-start:2;justify-self:start;overflow:hidden;text-overflow:ellipsis}.start,.end,::slotted(svg){display:flex}::slotted([slot='end']){margin-inline-start:1ch}::slotted([slot='start']){margin-inline-end:1ch}`.withBehaviors(new ld(null, vt`
      :host::before{right:calc((${ur} - ${dr}) * 1px)}`), rn(vt`
        :host{background:${Ke.ButtonFace};border-color:${Ke.ButtonFace};color:${Ke.ButtonText}}:host(:not([disabled]):not([aria-selected="true"]):hover),:host(:not([disabled])[aria-selected="true"]:hover),:host([aria-selected="true"]){forced-color-adjust:none;background:${Ke.Highlight};color:${Ke.HighlightText}}:host(:not([disabled]):active)::before,:host([aria-selected='true'])::before{background:${Ke.HighlightText}}:host([disabled]),:host([disabled]:not([aria-selected='true']):hover){background:${Ke.Canvas};color:${Ke.GrayText};fill:currentcolor;opacity:1}:host(:${cn}){outline-color:${Ke.CanvasText}}`)),
    hp = Mi.compose({
        baseName: "option",
        template: (t, e) => _`<template aria-checked="${t => t.ariaChecked}" aria-disabled="${t => t.ariaDisabled}" aria-posinset="${t => t.ariaPosInSet}" aria-selected="${t => t.ariaSelected}" aria-setsize="${t => t.ariaSetSize}" class="${t => [t.checked && "checked", t.selected && "selected", t.disabled && "disabled"].filter(Boolean).join(" ")}" role="option">${_t(0, e)}<span class="content" part="content"><slot ${Bt("content")}></slot></span>${qt(0, e)}</template>`,
        styles: cp
    }), dp = cp, up = (t, e) => vt`
    ${ln("block")} :host{background:${Ka};border:calc(${dr} * 1px) solid transparent;border-radius:calc(${hr} * 1px);box-shadow:${Id};padding:calc((${lr} - ${dr}) * 1px) 0;max-width:368px;min-width:64px}:host([slot='submenu']){width:max-content;margin:0 calc(${lr} * 2px)}::slotted(${t.tagFor(Wo)}){margin:0 calc(${lr} * 1px)}::slotted(${t.tagFor(Ho)}){margin:calc(${lr} * 1px) 0}::slotted(hr){box-sizing:content-box;height:0;margin:calc(${lr} * 1px) 0;border:none;border-top:calc(${dr} * 1px) solid ${Ic}}`.withBehaviors(rn(vt`
        :host([slot='submenu']){background:${Ke.Canvas};border-color:${Ke.CanvasText}}`));

class pp extends Ko {
    connectedCallback() {
        super.connectedCallback(), ol.setValueFor(this, Ka)
    }
}

const gp = pp.compose({
    baseName: "menu",
    baseClass: Ko,
    template: (t, e) => _`<template slot="${t => t.slot ? t.slot : t.isNestedMenu() ? "submenu" : void 0}" role="menu" @keydown="${(t, e) => t.handleMenuKeyDown(e.event)}" @focusout="${(t, e) => t.handleFocusOut(e.event)}"><slot ${Bt("items")}></slot></template>`,
    styles: up
}), fp = up, mp = (t, e) => vt`
    ${ln("grid")} :host{contain:layout;overflow:visible;${Bh}
      box-sizing:border-box;height:calc(${Zh} * 1px);grid-template-columns:minmax(32px,auto) 1fr minmax(32px,auto);grid-template-rows:auto;justify-items:center;align-items:center;padding:0;white-space:nowrap;color:${lc};fill:currentcolor;cursor:pointer;border-radius:calc(${cr} * 1px);border:calc(${dr} * 1px) solid transparent;position:relative}:host(.indent-0){grid-template-columns:auto 1fr minmax(32px,auto)}:host(.indent-0) .content{grid-column:1;grid-row:1;margin-inline-start:10px}:host(.indent-0) .expand-collapse-glyph-container{grid-column:5;grid-row:1}:host(.indent-2){grid-template-columns:minmax(32px,auto) minmax(32px,auto) 1fr minmax(32px,auto) minmax(32px,auto)}:host(.indent-2) .content{grid-column:3;grid-row:1;margin-inline-start:10px}:host(.indent-2) .expand-collapse-glyph-container{grid-column:5;grid-row:1}:host(.indent-2) .start{grid-column:2}:host(.indent-2) .end{grid-column:4}:host(:${cn}){${Yh}}:host(:not([disabled]):hover){background:${Jl}}:host(:not([disabled]):active),:host(.expanded){background:${tc};color:${lc};z-index:2}:host([disabled]){cursor:${"not-allowed"};opacity:${sr}}.content{grid-column-start:2;justify-self:start;overflow:hidden;text-overflow:ellipsis}.start,.end{display:flex;justify-content:center}:host(.indent-0[aria-haspopup='menu']){display:grid;grid-template-columns:minmax(32px,auto) auto 1fr minmax(32px,auto) minmax(32px,auto);align-items:center;min-height:32px}:host(.indent-1[aria-haspopup='menu']),:host(.indent-1[role='menuitemcheckbox']),:host(.indent-1[role='menuitemradio']){display:grid;grid-template-columns:minmax(32px,auto) auto 1fr minmax(32px,auto) minmax(32px,auto);align-items:center;min-height:32px}:host(.indent-2:not([aria-haspopup='menu'])) .end{grid-column:5}:host .input-container,:host .expand-collapse-glyph-container{display:none}:host([aria-haspopup='menu']) .expand-collapse-glyph-container,:host([role='menuitemcheckbox']) .input-container,:host([role='menuitemradio']) .input-container{display:grid}:host([aria-haspopup='menu']) .content,:host([role='menuitemcheckbox']) .content,:host([role='menuitemradio']) .content{grid-column-start:3}:host([aria-haspopup='menu'].indent-0) .content{grid-column-start:1}:host([aria-haspopup='menu']) .end,:host([role='menuitemcheckbox']) .end,:host([role='menuitemradio']) .end{grid-column-start:4}:host .expand-collapse,:host .checkbox,:host .radio{display:flex;align-items:center;justify-content:center;position:relative;box-sizing:border-box}:host .checkbox-indicator,:host .radio-indicator,slot[name='checkbox-indicator'],slot[name='radio-indicator']{display:none}::slotted([slot='end']:not(svg)){margin-inline-end:10px;color:${pc}}:host([aria-checked='true']) .checkbox-indicator,:host([aria-checked='true']) slot[name='checkbox-indicator'],:host([aria-checked='true']) .radio-indicator,:host([aria-checked='true']) slot[name='radio-indicator']{display:flex}`.withBehaviors(rn(vt`
        :host,::slotted([slot='end']:not(svg)){forced-color-adjust:none;color:${Ke.ButtonText};fill:currentcolor}:host(:not([disabled]):hover){background:${Ke.Highlight};color:${Ke.HighlightText};fill:currentcolor}:host(:hover) .start,:host(:hover) .end,:host(:hover)::slotted(svg),:host(:active) .start,:host(:active) .end,:host(:active)::slotted(svg),:host(:hover) ::slotted([slot='end']:not(svg)),:host(:${cn}) ::slotted([slot='end']:not(svg)){color:${Ke.HighlightText};fill:currentcolor}:host(.expanded){background:${Ke.Highlight};color:${Ke.HighlightText}}:host(:${cn}){background:${Ke.Highlight};outline-color:${Ke.ButtonText};color:${Ke.HighlightText};fill:currentcolor}:host([disabled]),:host([disabled]:hover),:host([disabled]:hover) .start,:host([disabled]:hover) .end,:host([disabled]:hover)::slotted(svg),:host([disabled]:${cn}){background:${Ke.ButtonFace};color:${Ke.GrayText};fill:currentcolor;opacity:1}:host([disabled]:${cn}){outline-color:${Ke.GrayText}}:host .expanded-toggle,:host .checkbox,:host .radio{border-color:${Ke.ButtonText};background:${Ke.HighlightText}}:host([checked]) .checkbox,:host([checked]) .radio{background:${Ke.HighlightText};border-color:${Ke.HighlightText}}:host(:hover) .expanded-toggle,:host(:hover) .checkbox,:host(:hover) .radio,:host(:${cn}) .expanded-toggle,:host(:${cn}) .checkbox,:host(:${cn}) .radio,:host([checked]:hover) .checkbox,:host([checked]:hover) .radio,:host([checked]:${cn}) .checkbox,:host([checked]:${cn}) .radio{border-color:${Ke.HighlightText}}:host([aria-checked='true']){background:${Ke.Highlight};color:${Ke.HighlightText}}:host([aria-checked='true']) .checkbox-indicator,:host([aria-checked='true']) ::slotted([slot='checkbox-indicator']),:host([aria-checked='true']) ::slotted([slot='radio-indicator']){fill:${Ke.Highlight}}:host([aria-checked='true']) .radio-indicator{background:${Ke.Highlight}}`), new ld(vt`
        .expand-collapse-glyph-container{transform:rotate(0deg)}`, vt`
        .expand-collapse-glyph-container{transform:rotate(180deg)}`)), vp = Wo.compose({
    baseName: "menu-item",
    template: (t, e) => _`<template role="${t => t.role}" aria-haspopup="${t => t.hasSubmenu ? "menu" : void 0}" aria-checked="${t => t.role !== Uo ? t.checked : void 0}" aria-disabled="${t => t.disabled}" aria-expanded="${t => t.expanded}" @keydown="${(t, e) => t.handleMenuItemKeyDown(e.event)}" @click="${(t, e) => t.handleMenuItemClick(e.event)}" @mouseover="${(t, e) => t.handleMouseOver(e.event)}" @mouseout="${(t, e) => t.handleMouseOut(e.event)}" class="${t => t.disabled ? "disabled" : ""} ${t => t.expanded ? "expanded" : ""} ${t => "indent-" + t.startColumnCount}">${Ot(t => t.role === qo, _`<div part="input-container" class="input-container"><span part="checkbox" class="checkbox"><slot name="checkbox-indicator">${e.checkboxIndicator || ""}</slot></span></div>`)} ${Ot(t => t.role === _o, _`<div part="input-container" class="input-container"><span part="radio" class="radio"><slot name="radio-indicator">${e.radioIndicator || ""}</slot></span></div>`)}</div>${_t(0, e)}<span class="content" part="content"><slot></slot></span>${qt(0, e)} ${Ot(t => t.hasSubmenu, _`<div part="expand-collapse-glyph-container" class="expand-collapse-glyph-container"><span part="expand-collapse" class="expand-collapse"><slot name="expand-collapse-indicator">${e.expandCollapseGlyph || ""}</slot></span></div>`)} ${Ot(t => t.expanded, _`<${t.tagFor(oi)} :anchorElement="${t => t}" vertical-positioning-mode="dynamic" vertical-default-position="bottom" vertical-inset="true" horizontal-positioning-mode="dynamic" horizontal-default-position="end" class="submenu-region" dir="${t => t.currentDirection}" @loaded="${t => t.submenuLoaded()}" ${St("submenuRegion")} part="submenu-region"><slot name="submenu"></slot></${t.tagFor(oi)}>`)}</template>`,
    styles: mp,
    checkboxIndicator: '\n    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n      <path d="M13.86 3.66a.5.5 0 01-.02.7l-7.93 7.48a.6.6 0 01-.84-.02L2.4 9.1a.5.5 0 01.72-.7l2.4 2.44 7.65-7.2a.5.5 0 01.7.02z"/>\n    </svg>\n  ',
    expandCollapseGlyph: '\n    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n      <path d="M5.65 3.15a.5.5 0 000 .7L9.79 8l-4.14 4.15a.5.5 0 00.7.7l4.5-4.5a.5.5 0 000-.7l-4.5-4.5a.5.5 0 00-.7 0z"/>\n    </svg>\n  ',
    radioIndicator: '\n    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n      <circle cx="8" cy="8" r="2"/>\n    </svg>\n  '
}), bp = mp, yp = (t, e) => vt`
    ${ln("inline-block")}

    ${Md(0, 0, ".root")}

    ${Bd()}

    .root{display:flex;flex-direction:row}.control{-webkit-appearance:none;color:inherit;background:transparent;border:0;height:calc(100% - 4px);margin-top:auto;margin-bottom:auto;padding:0 calc(${lr} * 2px + 1px);font-family:inherit;font-size:inherit;line-height:inherit}.start,.end{margin:auto;fill:currentcolor}.start{display:flex;margin-inline-start:11px}.end{display:flex;margin-inline-end:11px}.controls{opacity:0;position:relative;top:-1px;z-index:3}:host(:hover:not([disabled])) .controls,:host(:focus-within:not([disabled])) .controls{opacity:1}.step-up,.step-down{display:flex;padding:0 8px;cursor:pointer}.step-up{padding-top:3px}`.withBehaviors(qd("outline", Nd(0, 0, ".root")), qd("filled", jd(0, 0, ".root")), rn(Ud(0, 0, ".root")));

class xp extends is {
    connectedCallback() {
        super.connectedCallback(), this.appearance || (this.appearance = "outline")
    }
}

ad([st], xp.prototype, "appearance", void 0);
const $p = yp, wp = xp.compose({
    baseName: "number-field",
    baseClass: is,
    styles: yp,
    template: (t, e) => _`<template class="${t => t.readOnly ? "readonly" : ""}"><label part="label" for="control" class="${t => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"><slot ${Bt("defaultSlottedNodes")}></slot></label><div class="root" part="root">${_t(0, e)}<input class="control" part="control" id="control" @input="${t => t.handleTextInput()}" @change="${t => t.handleChange()}" @keydown="${(t, e) => t.handleKeyDown(e.event)}" @blur="${(t, e) => t.handleBlur()}" ?autofocus="${t => t.autofocus}" ?disabled="${t => t.disabled}" list="${t => t.list}" maxlength="${t => t.maxlength}" minlength="${t => t.minlength}" placeholder="${t => t.placeholder}" ?readonly="${t => t.readOnly}" ?required="${t => t.required}" size="${t => t.size}" type="text" inputmode="numeric" min="${t => t.min}" max="${t => t.max}" step="${t => t.step}" aria-atomic="${t => t.ariaAtomic}" aria-busy="${t => t.ariaBusy}" aria-controls="${t => t.ariaControls}" aria-current="${t => t.ariaCurrent}" aria-describedby="${t => t.ariaDescribedby}" aria-details="${t => t.ariaDetails}" aria-disabled="${t => t.ariaDisabled}" aria-errormessage="${t => t.ariaErrormessage}" aria-flowto="${t => t.ariaFlowto}" aria-haspopup="${t => t.ariaHaspopup}" aria-hidden="${t => t.ariaHidden}" aria-invalid="${t => t.ariaInvalid}" aria-keyshortcuts="${t => t.ariaKeyshortcuts}" aria-label="${t => t.ariaLabel}" aria-labelledby="${t => t.ariaLabelledby}" aria-live="${t => t.ariaLive}" aria-owns="${t => t.ariaOwns}" aria-relevant="${t => t.ariaRelevant}" aria-roledescription="${t => t.ariaRoledescription}" ${St("control")} />${Ot(t => !t.hideStep && !t.readOnly && !t.disabled, _`<div class="controls" part="controls"><div class="step-up" part="step-up" @click="${t => t.stepUp()}"><slot name="step-up-glyph">${e.stepUpGlyph || ""}</slot></div><div class="step-down" part="step-down" @click="${t => t.stepDown()}"><slot name="step-down-glyph">${e.stepDownGlyph || ""}</slot></div></div>`)} ${qt(0, e)}</div></template>`,
    shadowOptions: {delegatesFocus: !0},
    stepDownGlyph: '\n    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">\n      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>\n    </svg>\n  ',
    stepUpGlyph: '\n    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">\n      <path d="M2.15 7.35c.2.2.5.2.7 0L6 4.21l3.15 3.14a.5.5 0 10.7-.7l-3.5-3.5a.5.5 0 00-.7 0l-3.5 3.5a.5.5 0 000 .7z"/>\n    </svg>\n'
}), kp = (t, e) => vt`
    ${ln("flex")} :host{align-items:center;height:calc((${dr} * 3) * 1px)}.progress{background-color:${Pc};border-radius:calc(${lr} * 1px);width:100%;height:calc(${dr} * 1px);display:flex;align-items:center;position:relative}.determinate{background-color:${rl};border-radius:calc(${lr} * 1px);height:calc((${dr} * 3) * 1px);transition:all 0.2s ease-in-out;display:flex}.indeterminate{height:calc((${dr} * 3) * 1px);border-radius:calc(${lr} * 1px);display:flex;width:100%;position:relative;overflow:hidden}.indeterminate-indicator-1{position:absolute;opacity:0;height:100%;background-color:${rl};border-radius:calc(${lr} * 1px);animation-timing-function:cubic-bezier(0.4,0,0.6,1);width:40%;animation:indeterminate-1 2s infinite}.indeterminate-indicator-2{position:absolute;opacity:0;height:100%;background-color:${rl};border-radius:calc(${lr} * 1px);animation-timing-function:cubic-bezier(0.4,0,0.6,1);width:60%;animation:indeterminate-2 2s infinite}:host(.paused) .indeterminate-indicator-1,:host(.paused) .indeterminate-indicator-2{animation:none;background-color:${pc};width:100%;opacity:1}:host(.paused) .determinate{background-color:${pc}}@keyframes indeterminate-1{0%{opacity:1;transform:translateX(-100%)}70%{opacity:1;transform:translateX(300%)}70.01%{opacity:0}100%{opacity:0;transform:translateX(300%)}}@keyframes indeterminate-2{0%{opacity:0;transform:translateX(-150%)}29.99%{opacity:0}30%{opacity:1;transform:translateX(-150%)}100%{transform:translateX(166.66%);opacity:1}}`.withBehaviors(rn(vt`
        .indeterminate-indicator-1,.indeterminate-indicator-2,.determinate,.progress{background-color:${Ke.ButtonText}}:host(.paused) .indeterminate-indicator-1,:host(.paused) .indeterminate-indicator-2,:host(.paused) .determinate{background-color:${Ke.GrayText}}`));

class Cp extends os {
}

const Ip = Cp.compose({
    baseName: "progress",
    template: (t, e) => _`<template role="progressbar" aria-valuenow="${t => t.value}" aria-valuemin="${t => t.min}" aria-valuemax="${t => t.max}" class="${t => t.paused ? "paused" : ""}">${Ot(t => "number" == typeof t.value, _`<div class="progress" part="progress" slot="determinate"><div class="determinate" part="determinate" style="width: ${t => t.percentComplete}%"></div></div>`)} ${Ot(t => "number" != typeof t.value, _`<div class="progress" part="progress" slot="indeterminate"><slot class="indeterminate" name="indeterminate">${e.indeterminateIndicator1 || ""} ${e.indeterminateIndicator2 || ""}</slot></div>`)}</template>`,
    styles: kp,
    indeterminateIndicator1: '\n    <span class="indeterminate-indicator-1" part="indeterminate-indicator-1"></span>\n  ',
    indeterminateIndicator2: '\n    <span class="indeterminate-indicator-2" part="indeterminate-indicator-2"></span>\n  '
}), Fp = kp, Dp = (t, e) => vt`
    ${ln("flex")} :host{align-items:center;height:calc(${Zh} * 1px);width:calc(${Zh} * 1px)}.progress{height:100%;width:100%}.background{fill:none;stroke-width:2px}.determinate{stroke:${rl};fill:none;stroke-width:2px;stroke-linecap:round;transform-origin:50% 50%;transform:rotate(-90deg);transition:all 0.2s ease-in-out}.indeterminate-indicator-1{stroke:${rl};fill:none;stroke-width:2px;stroke-linecap:round;transform-origin:50% 50%;transform:rotate(-90deg);transition:all 0.2s ease-in-out;animation:spin-infinite 2s linear infinite}:host(.paused) .indeterminate-indicator-1{animation:none;stroke:${pc}}:host(.paused) .determinate{stroke:${pc}}@keyframes spin-infinite{0%{stroke-dasharray:0.01px 43.97px;transform:rotate(0deg)}50%{stroke-dasharray:21.99px 21.99px;transform:rotate(450deg)}100%{stroke-dasharray:0.01px 43.97px;transform:rotate(1080deg)}}`.withBehaviors(rn(vt`
        .background{stroke:${Ke.Field}}.determinate,.indeterminate-indicator-1{stroke:${Ke.ButtonText}}:host(.paused) .determinate,:host(.paused) .indeterminate-indicator-1{stroke:${Ke.GrayText}}`));

class Tp extends os {
}

const Sp = Tp.compose({
        baseName: "progress-ring",
        template: (t, e) => _`<template role="progressbar" aria-valuenow="${t => t.value}" aria-valuemin="${t => t.min}" aria-valuemax="${t => t.max}" class="${t => t.paused ? "paused" : ""}">${Ot(t => "number" == typeof t.value, _`<svg class="progress" part="progress" viewBox="0 0 16 16" slot="determinate"><circle class="background" part="background" cx="8px" cy="8px" r="7px"></circle><circle class="determinate" part="determinate" style="stroke-dasharray: ${t => 44 * t.percentComplete / 100}px ${44}px" cx="8px" cy="8px" r="7px"></circle></svg>`)} ${Ot(t => "number" != typeof t.value, _`<slot name="indeterminate" slot="indeterminate">${e.indeterminateIndicator || ""}</slot>`)}</template>`,
        styles: Dp,
        indeterminateIndicator: '\n    <svg class="progress" part="progress" viewBox="0 0 16 16">\n        <circle\n            class="background"\n            part="background"\n            cx="8px"\n            cy="8px"\n            r="7px"\n        ></circle>\n        <circle\n            class="indeterminate-indicator-1"\n            part="indeterminate-indicator-1"\n            cx="8px"\n            cy="8px"\n            r="7px"\n        ></circle>\n    </svg>\n  '
    }), Op = Dp, Ep = (t, e) => vt`
    ${ln("inline-flex")} :host{--input-size:calc((${Zh} / 2) + ${lr});align-items:center;outline:none;${""} user-select:none;position:relative;flex-direction:row;transition:all 0.2s ease-in-out}.control{position:relative;width:calc(var(--input-size) * 1px);height:calc(var(--input-size) * 1px);box-sizing:border-box;border-radius:50%;border:calc(${dr} * 1px) solid ${Pc};background:${Pl};cursor:pointer}.label__hidden{display:none;visibility:hidden}.label{${Bh}
      color:${lc};${""} padding-inline-start:calc(${lr} * 2px + 2px);margin-inline-end:calc(${lr} * 2px + 2px);cursor:pointer}.control,slot[name='checked-indicator']{flex-shrink:0}slot[name='checked-indicator']{display:flex;align-items:center;justify-content:center;width:100%;height:100%;fill:${dl};opacity:0;pointer-events:none}:host(:not(.disabled):hover) .control{background:${zl};border-color:${zc}}:host(:not(.disabled):active) .control{background:${Hl};border-color:${Hc}}:host(:not(.disabled):active) slot[name='checked-indicator']{opacity:1}:host(:${cn}) .control{${Qh}
      background:${Ml}}:host(.checked) .control{background:${rl};border-color:transparent}:host(.checked:not(.disabled):hover) .control{background:${al};border-color:transparent}:host(.checked:not(.disabled):active) .control{background:${ll};border-color:transparent}:host(.disabled) .label,:host(.readonly) .label,:host(.readonly) .control,:host(.disabled) .control{cursor:${"not-allowed"}}:host(.checked) slot[name='checked-indicator']{opacity:1}:host(.disabled){opacity:${sr}}`.withBehaviors(rn(vt`
        .control{background:${Ke.Field};border-color:${Ke.FieldText}}:host(:not(.disabled):hover) .control,:host(:not(.disabled):active) .control{border-color:${Ke.Highlight}}:host(:${cn}) .control{forced-color-adjust:none;background:${Ke.Field};outline-color:${Ke.FieldText}}:host(.checked:not(.disabled):hover) .control,:host(.checked:not(.disabled):active) .control{border-color:${Ke.Highlight};background:${Ke.Highlight}}:host(.checked) slot[name='checked-indicator']{fill:${Ke.Highlight}}:host(.checked:hover) .control slot[name='checked-indicator']{fill:${Ke.HighlightText}}:host(.disabled){opacity:1}:host(.disabled) .label{color:${Ke.GrayText}}:host(.disabled) .control,:host(.checked.disabled) .control{background:${Ke.Field};border-color:${Ke.GrayText}}:host(.disabled) slot[name='checked-indicator'],:host(.checked.disabled) slot[name='checked-indicator']{fill:${Ke.GrayText}}`)),
    Vp = as.compose({
        baseName: "radio",
        template: (t, e) => _`<template role="radio" class="${t => t.checked ? "checked" : ""} ${t => t.readOnly ? "readonly" : ""}" aria-checked="${t => t.checked}" aria-required="${t => t.required}" aria-disabled="${t => t.disabled}" aria-readonly="${t => t.readOnly}" @keypress="${(t, e) => t.keypressHandler(e.event)}" @click="${(t, e) => t.clickHandler(e.event)}"><div part="control" class="control"><slot name="checked-indicator">${e.checkedIndicator || ""}</slot></div><label part="label" class="${t => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"><slot ${Bt("defaultSlottedNodes")}></slot></label></template>`,
        styles: Ep,
        checkedIndicator: '\n    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">\n      <circle cx="8" cy="8" r="4"/>\n    </svg>\n  '
    }), Rp = Ep, Ap = (t, e) => vt`
  ${ln("flex")} :host{align-items:flex-start;flex-direction:column}.positioning-region{display:flex;flex-wrap:wrap}:host([orientation='vertical']) .positioning-region{flex-direction:column}:host([orientation='horizontal']) .positioning-region{flex-direction:row}`,
    Lp = ss.compose({
        baseName: "radio-group",
        template: (t, e) => _`<template role="radiogroup" aria-disabled="${t => t.disabled}" aria-readonly="${t => t.readOnly}" @click="${(t, e) => t.clickHandler(e.event)}" @keydown="${(t, e) => t.keydownHandler(e.event)}" @focusout="${(t, e) => t.focusOutHandler(e.event)}"><slot name="label"></slot><div class="positioning-region ${t => t.orientation === Pe ? "horizontal" : "vertical"}" part="positioning-region"><slot ${Bt({
            property: "slottedRadioButtons",
            filter: zt("[role=radio]")
        })}></slot></div></template>`,
        styles: Ap
    }), Pp = Ap,
    zp = (t, e) => _`<template class=" ${t => t.readOnly ? "readonly" : ""} "><label part="label" for="control" class="${t => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"><slot ${Bt({
        property: "defaultSlottedNodes",
        filter: cs
    })}></slot></label><div class="root" part="root" ${St("root")}>${_t(0, e)}<div class="input-wrapper" part="input-wrapper"><input class="control" part="control" id="control" @input="${t => t.handleTextInput()}" @change="${t => t.handleChange()}" ?autofocus="${t => t.autofocus}" ?disabled="${t => t.disabled}" list="${t => t.list}" maxlength="${t => t.maxlength}" minlength="${t => t.minlength}" pattern="${t => t.pattern}" placeholder="${t => t.placeholder}" ?readonly="${t => t.readOnly}" ?required="${t => t.required}" size="${t => t.size}" ?spellcheck="${t => t.spellcheck}" :value="${t => t.value}" type="search" aria-atomic="${t => t.ariaAtomic}" aria-busy="${t => t.ariaBusy}" aria-controls="${t => t.ariaControls}" aria-current="${t => t.ariaCurrent}" aria-describedby="${t => t.ariaDescribedby}" aria-details="${t => t.ariaDetails}" aria-disabled="${t => t.ariaDisabled}" aria-errormessage="${t => t.ariaErrormessage}" aria-flowto="${t => t.ariaFlowto}" aria-haspopup="${t => t.ariaHaspopup}" aria-hidden="${t => t.ariaHidden}" aria-invalid="${t => t.ariaInvalid}" aria-keyshortcuts="${t => t.ariaKeyshortcuts}" aria-label="${t => t.ariaLabel}" aria-labelledby="${t => t.ariaLabelledby}" aria-live="${t => t.ariaLive}" aria-owns="${t => t.ariaOwns}" aria-relevant="${t => t.ariaRelevant}" aria-roledescription="${t => t.ariaRoledescription}" ${St("control")} /><slot name="clear-button"><button class="clear-button ${t => t.value ? "" : "clear-button__hidden"}" part="clear-button" tabindex="-1" @click=${t => t.handleClearInput()}><slot name="clear-glyph"><svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="m2.09 2.22.06-.07a.5.5 0 0 1 .63-.06l.07.06L6 5.29l3.15-3.14a.5.5 0 1 1 .7.7L6.71 6l3.14 3.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L6 6.71 2.85 9.85a.5.5 0 0 1-.7-.7L5.29 6 2.15 2.85a.5.5 0 0 1-.06-.63l.06-.07-.06.07Z" /></svg></slot></button></slot></div>${qt(0, e)}</div></template>`,
    Hp = vo.create("clear-button-hover").withDefault(t => {
        const e = Ql.getValueFor(t), i = Ol.getValueFor(t);
        return e.evaluate(t, i.evaluate(t).focus).hover
    }), Mp = vo.create("clear-button-active").withDefault(t => {
        const e = Ql.getValueFor(t), i = Ol.getValueFor(t);
        return e.evaluate(t, i.evaluate(t).focus).active
    }), Bp = (t, e) => vt`
    ${ln("inline-block")}

    ${Md(0, 0, ".root")}

    ${Bd()}

    .root{display:flex;flex-direction:row}.control{-webkit-appearance:none;color:inherit;background:transparent;border:0;height:calc(100% - 4px);margin-top:auto;margin-bottom:auto;padding:0 calc(${lr} * 2px + 1px);font-family:inherit;font-size:inherit;line-height:inherit}.clear-button{display:inline-flex;align-items:center;margin:1px;height:calc(100% - 2px);opacity:0;background:transparent;color:${lc};fill:currentcolor;border:none;border-radius:calc(${cr} * 1px);min-width:calc(${Zh} * 1px);${Bh}
      outline:none;padding:0 calc((10 + (${lr} * 2 * ${ar})) * 1px)}.clear-button:hover{background:${Hp}}.clear-button:active{background:${Mp}}:host(:hover:not([disabled],[readOnly])) .clear-button,:host(:active:not([disabled],[readOnly])) .clear-button,:host(:focus-within:not([disabled],[readOnly])) .clear-button{opacity:1}:host(:hover:not([disabled],[readOnly])) .clear-button__hidden,:host(:active:not([disabled],[readOnly])) .clear-button__hidden,:host(:focus-within:not([disabled],[readOnly])) .clear-button__hidden{opacity:0}.control::-webkit-search-cancel-button{-webkit-appearance:none}.input-wrapper{display:flex;position:relative;width:100%}.start,.end{display:flex;margin:1px;align-items:center}.start{display:flex;margin-inline-start:11px}::slotted([slot="end"]){height:100%}.clear-button__hidden{opacity:0}.end{margin-inline-end:11px}::slotted(${t.tagFor(pi)}){margin-inline-end:1px}`.withBehaviors(qd("outline", Nd(0, 0, ".root")), qd("filled", jd(0, 0, ".root")), rn(Ud(0, 0, ".root")));

class Np extends us {
    constructor() {
        super(...arguments), this.appearance = "outline"
    }
}

ad([st], Np.prototype, "appearance", void 0);
const jp = Np.compose({
    baseName: "search",
    baseClass: us,
    template: zp,
    styles: Bp,
    start: '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg%22%3E"><path d="M8.5 3a5.5 5.5 0 0 1 4.23 9.02l4.12 4.13a.5.5 0 0 1-.63.76l-.07-.06-4.13-4.12A5.5 5.5 0 1 1 8.5 3Zm0 1a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"/></svg>',
    shadowOptions: {delegatesFocus: !0}
}), Up = Bp;

class qp extends ms {
    appearanceChanged(t, e) {
        t !== e && (this.classList.add(e), this.classList.remove(t))
    }

    connectedCallback() {
        super.connectedCallback(), this.appearance || (this.appearance = "outline"), this.listbox && ol.setValueFor(this.listbox, Ka)
    }
}

ad([st({mode: "fromView"})], qp.prototype, "appearance", void 0);
const _p = qp.compose({
        baseName: "select",
        baseClass: ms,
        template: (t, e) => _`<template class="${t => [t.collapsible && "collapsible", t.collapsible && t.open && "open", t.disabled && "disabled", t.collapsible && t.position].filter(Boolean).join(" ")}" aria-activedescendant="${t => t.ariaActiveDescendant}" aria-controls="${t => t.ariaControls}" aria-disabled="${t => t.ariaDisabled}" aria-expanded="${t => t.ariaExpanded}" aria-haspopup="${t => t.collapsible ? "listbox" : null}" aria-multiselectable="${t => t.ariaMultiSelectable}" ?open="${t => t.open}" role="combobox" tabindex="${t => t.disabled ? null : "0"}" @click="${(t, e) => t.clickHandler(e.event)}" @focusin="${(t, e) => t.focusinHandler(e.event)}" @focusout="${(t, e) => t.focusoutHandler(e.event)}" @keydown="${(t, e) => t.keydownHandler(e.event)}" @mousedown="${(t, e) => t.mousedownHandler(e.event)}">${Ot(t => t.collapsible, _`<div class="control" part="control" ?disabled="${t => t.disabled}" ${St("control")}>${_t(0, e)}<slot name="button-container"><div class="selected-value" part="selected-value"><slot name="selected-value">${t => t.displayValue}</slot></div><div aria-hidden="true" class="indicator" part="indicator"><slot name="indicator">${e.indicator || ""}</slot></div></slot>${qt(0, e)}</div>`)}<div class="listbox" id="${t => t.listboxId}" part="listbox" role="listbox" ?disabled="${t => t.disabled}" ?hidden="${t => !!t.collapsible && !t.open}" ${St("listbox")}><slot ${Bt({
            filter: Ni.slottedOptionFilter,
            flatten: !0,
            property: "slottedOptions"
        })}></slot></div></template>`,
        styles: Cu,
        indicator: '\n    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">\n      <path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 11.7.7l-3.5 3.5a.5.5 0 01-.7 0l-3.5-3.5a.5.5 0 010-.7z"/>\n    </svg>\n  '
    }), Gp = Cu, Wp = (t, e) => vt`
    ${ln("block")} :host{--skeleton-fill-default:${Wl};overflow:hidden;width:100%;position:relative;background-color:var(--skeleton-fill,var(--skeleton-fill-default));--skeleton-animation-gradient-default:linear-gradient(
        270deg,var(--skeleton-fill,var(--skeleton-fill-default)) 0%,${Kl} 51%,var(--skeleton-fill,var(--skeleton-fill-default)) 100%
      );--skeleton-animation-timing-default:ease-in-out}:host(.rect){border-radius:calc(${cr} * 1px)}:host(.circle){border-radius:100%;overflow:hidden}object{position:absolute;width:100%;height:auto;z-index:2}object img{width:100%;height:auto}${ln("block")} span.shimmer{position:absolute;width:100%;height:100%;background-image:var(--skeleton-animation-gradient,var(--skeleton-animation-gradient-default));background-size:0px 0px / 90% 100%;background-repeat:no-repeat;background-color:var(--skeleton-animation-fill,${Wl});animation:shimmer 2s infinite;animation-timing-function:var(--skeleton-animation-timing,var(--skeleton-timing-default));animation-direction:normal;z-index:1}::slotted(svg){z-index:2}::slotted(.pattern){width:100%;height:100%}@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`.withBehaviors(rn(vt`
        :host{background-color:${Ke.CanvasText}}`)), Kp = bs.compose({
        baseName: "skeleton",
        template: (t, e) => _`<template class="${t => "circle" === t.shape ? "circle" : "rect"}" pattern="${t => t.pattern}" ?shimmer="${t => t.shimmer}">${Ot(t => !0 === t.shimmer, _`<span class="shimmer"></span>`)}<object type="image/svg+xml" data="${t => t.pattern}" role="presentation"><img class="pattern" src="${t => t.pattern}" /></object><slot></slot></template>`,
        styles: Wp
    }), Xp = Wp, Yp = (t, e) => vt`
    ${ln("inline-grid")} :host{--thumb-size:calc((${Zh} / 2) + ${lr} + (${dr} * 2));--thumb-translate:calc(var(--thumb-size) * -0.5 + var(--track-width) / 2);--track-overhang:calc((${lr} / 2) * -1);--track-width:${lr};align-items:center;width:100%;user-select:none;box-sizing:border-box;border-radius:calc(${cr} * 1px);outline:none;cursor:pointer}:host(.horizontal) .positioning-region{position:relative;margin:0 8px;display:grid;grid-template-rows:calc(var(--thumb-size) * 1px) 1fr}:host(.vertical) .positioning-region{position:relative;margin:0 8px;display:grid;height:100%;grid-template-columns:calc(var(--thumb-size) * 1px) 1fr}:host(:${cn}) .thumb-cursor{box-shadow:0 0 0 2px ${ol},0 0 0 4px ${Nc}}.thumb-container{position:absolute;height:calc(var(--thumb-size) * 1px);width:calc(var(--thumb-size) * 1px);transition:all 0.2s ease}.thumb-cursor{display:flex;position:relative;border:none;width:calc(var(--thumb-size) * 1px);height:calc(var(--thumb-size) * 1px);background:padding-box linear-gradient(${Fl},${Fl}),border-box ${xc};border:calc(${dr} * 1px) solid transparent;border-radius:50%;box-sizing:border-box}.thumb-cursor::after{content:'';display:block;border-radius:50%;width:100%;margin:4px;background:${rl}}:host(:not(.disabled)) .thumb-cursor:hover::after{background:${al};margin:3px}:host(:not(.disabled)) .thumb-cursor:active::after{background:${ll};margin:5px}:host(:not(.disabled)) .thumb-cursor:hover{background:padding-box linear-gradient(${Fl},${Fl}),border-box ${$c}}:host(:not(.disabled)) .thumb-cursor:active{background:padding-box linear-gradient(${Fl},${Fl}),border-box ${wc}}.track-start{background:${rl};position:absolute;height:100%;left:0;border-radius:calc(${cr} * 1px)}:host(.horizontal) .thumb-container{transform:translateX(calc(var(--thumb-size) * 0.5px)) translateY(calc(var(--thumb-translate) * 1px))}:host(.vertical) .thumb-container{transform:translateX(calc(var(--thumb-translate) * 1px)) translateY(calc(var(--thumb-size) * 0.5px))}:host(.horizontal){min-width:calc(var(--thumb-size) * 1px)}:host(.horizontal) .track{right:calc(var(--track-overhang) * 1px);left:calc(var(--track-overhang) * 1px);align-self:start;height:calc(var(--track-width) * 1px)}:host(.vertical) .track{top:calc(var(--track-overhang) * 1px);bottom:calc(var(--track-overhang) * 1px);width:calc(var(--track-width) * 1px);height:100%}.track{background:${oc};border:1px solid ${Pc};border-radius:2px;box-sizing:border-box;position:absolute}:host(.vertical){height:100%;min-height:calc(${lr} * 60px);min-width:calc(${lr} * 20px)}:host(.vertical) .track-start{height:auto;width:100%;top:0}:host(.disabled),:host(.readonly){cursor:${"not-allowed"}}:host(.disabled){opacity:${sr}}`.withBehaviors(rn(vt`
        .thumb-cursor{forced-color-adjust:none;border-color:${Ke.FieldText};background:${Ke.FieldText}}:host(:not(.disabled)) .thumb-cursor:hover,:host(:not(.disabled)) .thumb-cursor:active{background:${Ke.Highlight}}.track{forced-color-adjust:none;background:${Ke.FieldText}}.thumb-cursor::after,:host(:not(.disabled)) .thumb-cursor:hover::after,:host(:not(.disabled)) .thumb-cursor:active::after{background:${Ke.Field}}:host(:${cn}) .thumb-cursor{background:${Ke.Highlight};border-color:${Ke.Highlight};box-shadow:0 0 0 1px ${Ke.Field},0 0 0 3px ${Ke.FieldText}}:host(.disabled){opacity:1}:host(.disabled) .track,:host(.disabled) .thumb-cursor{forced-color-adjust:none;background:${Ke.GrayText}}`)),
    Qp = Is.compose({
        baseName: "slider",
        template: (t, e) => _`<template role="slider" class="${t => t.readOnly ? "readonly" : ""} ${t => t.orientation || Pe}" tabindex="${t => t.disabled ? null : 0}" aria-valuetext="${t => t.valueTextFormatter(t.value)}" aria-valuenow="${t => t.value}" aria-valuemin="${t => t.min}" aria-valuemax="${t => t.max}" aria-disabled="${t => !!t.disabled || void 0}" aria-readonly="${t => !!t.readOnly || void 0}" aria-orientation="${t => t.orientation}" class="${t => t.orientation}"><div part="positioning-region" class="positioning-region"><div ${St("track")} part="track-container" class="track"><slot name="track"></slot><div part="track-start" class="track-start" style="${t => t.position}"><slot name="track-start"></slot></div></div><slot></slot><div ${St("thumb")} part="thumb-container" class="thumb-container" style="${t => t.position}"><slot name="thumb">${e.thumb || ""}</slot></div></div></template>`,
        styles: Yp,
        thumb: '\n    <div class="thumb-cursor"></div>\n  '
    }), Zp = Yp, Jp = (t, e) => vt`
    ${ln("block")} :host{${Nh}}.root{position:absolute;display:grid}:host(.horizontal){align-self:start;grid-row:2;margin-top:-4px}:host(.vertical){justify-self:start;grid-column:2;margin-left:2px}.container{display:grid;justify-self:center}:host(.horizontal) .container{grid-template-rows:auto auto;grid-template-columns:0}:host(.vertical) .container{grid-template-columns:auto auto;grid-template-rows:0;min-width:calc(var(--thumb-size) * 1px);height:calc(var(--thumb-size) * 1px)}.label{justify-self:center;align-self:center;white-space:nowrap;max-width:30px;margin:2px 0}.mark{width:calc(${dr} * 1px);height:calc(${lr} * 1px);background:${Pc};justify-self:center}:host(.vertical) .mark{transform:rotate(90deg);align-self:center}:host(.vertical) .label{margin-left:calc((${lr} / 2) * 2px);align-self:center}:host(.disabled){opacity:${sr}}`.withBehaviors(rn(vt`
        .mark{forced-color-adjust:none;background:${Ke.FieldText}}:host(.disabled){forced-color-adjust:none;opacity:1}:host(.disabled) .label{color:${Ke.GrayText}}:host(.disabled) .mark{background:${Ke.GrayText}}`)),
    tg = $s.compose({
        baseName: "slider-label",
        template: (t, e) => _`<template aria-disabled="${t => t.disabled}" class="${t => t.sliderOrientation || Pe} ${t => t.disabled ? "disabled" : ""}"><div ${St("root")} part="root" class="root" style="${t => t.positionStyle}"><div class="container">${Ot(t => !t.hideMark, _`<div class="mark"></div>`)}<div class="label"><slot></slot></div></div></div></template>`,
        styles: Jp
    }), eg = Jp, ig = (t, e) => vt`
    :host([hidden]){display:none}${ln("inline-flex")} :host{align-items:center;outline:none;font-family:${pr};${""} user-select:none}:host(.disabled){opacity:${sr}}:host(.disabled) .label,:host(.readonly) .label,:host(.disabled) .switch,:host(.readonly) .switch,:host(.disabled) .status-message,:host(.readonly) .status-message{cursor:${"not-allowed"}}.switch{position:relative;box-sizing:border-box;width:calc(((${Zh} / 2) + ${lr}) * 2px);height:calc(((${Zh} / 2) + ${lr}) * 1px);background:${Pl};border-radius:calc(${Zh} * 1px);border:calc(${dr} * 1px) solid ${Pc};cursor:pointer}:host(:not(.disabled):hover) .switch{background:${zl};border-color:${zc}}:host(:not(.disabled):active) .switch{background:${Hl};border-color:${Hc}}:host(:${cn}) .switch{${Qh}
      background:${Ml}}:host(.checked) .switch{background:${rl};border-color:transparent}:host(.checked:not(.disabled):hover) .switch{background:${al};border-color:transparent}:host(.checked:not(.disabled):active) .switch{background:${ll};border-color:transparent}slot[name='switch']{position:absolute;display:flex;border:1px solid transparent;fill:${lc};transition:all 0.2s ease-in-out}.status-message{color:${lc};cursor:pointer;${Bh}}.label__hidden{display:none;visibility:hidden}.label{color:${lc};${Bh}
      margin-inline-end:calc(${lr} * 2px + 2px);cursor:pointer}::slotted([slot="checked-message"]),::slotted([slot="unchecked-message"]){margin-inline-start:calc(${lr} * 2px + 2px)}:host(.checked) .switch{background:${rl}}:host(.checked) .switch slot[name='switch']{fill:${dl};filter:drop-shadow(0px 1px 1px rgba(0,0,0,0.15))}:host(.checked:not(.disabled)) .switch:hover{background:${al}}:host(.checked:not(.disabled)) .switch:hover slot[name='switch']{fill:${ul}}:host(.checked:not(.disabled)) .switch:active{background:${ll}}:host(.checked:not(.disabled)) .switch:active slot[name='switch']{fill:${pl}}.unchecked-message{display:block}.checked-message{display:none}:host(.checked) .unchecked-message{display:none}:host(.checked) .checked-message{display:block}`.withBehaviors(new ld(vt`
        slot[name='switch']{left:0}:host(.checked) slot[name='switch']{left:100%;transform:translateX(-100%)}`, vt`
        slot[name='switch']{right:0}:host(.checked) slot[name='switch']{right:100%;transform:translateX(100%)}`), rn(vt`
        :host(:not(.disabled)) .switch slot[name='switch']{forced-color-adjust:none;fill:${Ke.FieldText}}.switch{background:${Ke.Field};border-color:${Ke.FieldText}}:host(.checked) .switch{background:${Ke.Highlight};border-color:${Ke.Highlight}}:host(:not(.disabled):hover) .switch,:host(:not(.disabled):active) .switch,:host(.checked:not(.disabled):hover) .switch{background:${Ke.HighlightText};border-color:${Ke.Highlight}}:host(.checked:not(.disabled)) .switch slot[name="switch"]{fill:${Ke.HighlightText}}:host(.checked:not(.disabled):hover) .switch slot[name='switch']{fill:${Ke.Highlight}}:host(:${cn}) .switch{forced-color-adjust:none;background:${Ke.Field};border-color:${Ke.Highlight};outline-color:${Ke.FieldText}}:host(.disabled){opacity:1}:host(.disabled) slot[name='switch']{forced-color-adjust:none;fill:${Ke.GrayText}}:host(.disabled) .switch{background:${Ke.Field};border-color:${Ke.GrayText}}.status-message,.label{color:${Ke.FieldText}}`)),
    og = Ts.compose({
        baseName: "switch",
        template: (t, e) => _`<template role="switch" aria-checked="${t => t.checked}" aria-disabled="${t => t.disabled}" aria-readonly="${t => t.readOnly}" tabindex="${t => t.disabled ? null : 0}" @keypress="${(t, e) => t.keypressHandler(e.event)}" @click="${(t, e) => t.clickHandler(e.event)}" class="${t => t.checked ? "checked" : ""}"><label part="label" class="${t => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"><slot ${Bt("defaultSlottedNodes")}></slot></label><div part="switch" class="switch"><slot name="switch">${e.switch || ""}</slot></div><span class="status-message" part="status-message"><span class="checked-message" part="checked-message"><slot name="checked-message"></slot></span><span class="unchecked-message" part="unchecked-message"><slot name="unchecked-message"></slot></span></span></template>`,
        styles: ig,
        switch: '\n    <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">\n      <rect x="2" y="2" width="12" height="12" rx="6"/>\n    </svg>\n  '
    }), sg = ig, ng = (t, e) => vt`
      ${ln("grid")} :host{box-sizing:border-box;${Bh}
        color:${lc};grid-template-columns:auto 1fr auto;grid-template-rows:auto 1fr}.tablist{display:grid;grid-template-rows:calc(${Zh} * 1px);auto;grid-template-columns:auto;position:relative;width:max-content;align-self:end}.start,.end{align-self:center}.activeIndicator{grid-row:2;grid-column:1;width:20px;height:3px;border-radius:calc(${cr} * 1px);justify-self:center;background:${rl}}.activeIndicatorTransition{transition:transform 0.2s ease-in-out}.tabpanel{grid-row:2;grid-column-start:1;grid-column-end:4;position:relative}:host(.vertical){grid-template-rows:auto 1fr auto;grid-template-columns:auto 1fr}:host(.vertical) .tablist{grid-row-start:2;grid-row-end:2;display:grid;grid-template-rows:auto;grid-template-columns:auto 1fr;position:relative;width:max-content;justify-self:end;align-self:flex-start;width:100%}:host(.vertical) .tabpanel{grid-column:2;grid-row-start:1;grid-row-end:4}:host(.vertical) .end{grid-row:3}:host(.vertical) .activeIndicator{grid-column:1;grid-row:1;width:3px;height:20px;margin-inline-start:calc(${ur} * 1px);border-radius:calc(${cr} * 1px);align-self:center;background:${rl}}:host(.vertical) .activeIndicatorTransition{transition:transform 0.2s linear}`.withBehaviors(rn(vt`
        .activeIndicator,:host(.vertical) .activeIndicator{background:${Ke.Highlight}}`)), rg = (t, e) => vt`
      ${ln("inline-flex")} :host{box-sizing:border-box;${Bh}
        height:calc((${Zh} + (${lr} * 2)) * 1px);padding:0 calc((6 + (${lr} * 2 * ${ar})) * 1px);color:${lc};border-radius:calc(${cr} * 1px);border:calc(${dr} * 1px) solid transparent;align-items:center;justify-content:center;grid-row:1 / 3;cursor:pointer}:host([aria-selected='true']){z-index:2}:host(:hover),:host(:active){color:${lc}}:host(:${cn}){${Yh}}:host(.vertical){justify-content:start;grid-column:1 / 3}:host(.vertical[aria-selected='true']){z-index:2}:host(.vertical:hover),:host(.vertical:active){color:${lc}}:host(.vertical:hover[aria-selected='true']){}`.withBehaviors(rn(vt`
          :host{forced-color-adjust:none;border-color:transparent;color:${Ke.ButtonText};fill:currentcolor}:host(:hover),:host(.vertical:hover),:host([aria-selected='true']:hover){background:transparent;color:${Ke.Highlight};fill:currentcolor}:host([aria-selected='true']){background:transparent;color:${Ke.Highlight};fill:currentcolor}:host(:${cn}){background:transparent;outline-color:${Ke.ButtonText}}`)),
    ag = Os.compose({
        baseName: "tab",
        template: (t, e) => _`<template slot="tab" role="tab" aria-disabled="${t => t.disabled}"><slot></slot></template>`,
        styles: rg
    }), lg = rg, cg = (t, e) => vt`
  ${ln("block")} :host{box-sizing:border-box;${Bh}
    padding:0 calc((6 + (${lr} * 2 * ${ar})) * 1px)}`, hg = Ss.compose({
        baseName: "tab-panel",
        template: (t, e) => _`<template slot="tabpanel" role="tabpanel"><slot></slot></template>`,
        styles: cg
    }), dg = cg, ug = Vs.compose({
        baseName: "tabs",
        template: (t, e) => _`<template class="${t => t.orientation}">${_t(0, e)}<div class="tablist" part="tablist" role="tablist"><slot class="tab" name="tab" part="tab" ${Bt("tabs")}></slot>${Ot(t => t.showActiveIndicator, _`<div ${St("activeIndicatorRef")} class="activeIndicator" part="activeIndicator"></div>`)}</div>${qt(0, e)}<div class="tabpanel" part="tabpanel"><slot name="tabpanel" ${Bt("tabpanels")}></slot></div></template>`,
        styles: ng
    }), pg = ng, gg = (t, e) => vt`
    ${ln("inline-flex")}

    ${Md(0, 0, ".control")}

    ${Bd()}

    :host{flex-direction:column;vertical-align:bottom}.control{height:calc((${Zh} * 2) * 1px);padding:calc(${lr} * 1.5px) calc(${lr} * 2px + 1px)}:host .control{resize:none}:host(.resize-both) .control{resize:both}:host(.resize-horizontal) .control{resize:horizontal}:host(.resize-vertical) .control{resize:vertical}:host([cols]){width:initial}:host([rows]) .control{height:initial}`.withBehaviors(qd("outline", Nd(0, 0, ".control")), qd("filled", jd(0, 0, ".control")), rn(Ud(0, 0, ".control")));

class fg extends Ps {
    appearanceChanged(t, e) {
        t !== e && (this.classList.add(e), this.classList.remove(t))
    }

    connectedCallback() {
        super.connectedCallback(), this.appearance || (this.appearance = "outline")
    }
}

ad([st], fg.prototype, "appearance", void 0);
const mg = fg.compose({
    baseName: "text-area",
    baseClass: Ps,
    template: (t, e) => _`<template class=" ${t => t.readOnly ? "readonly" : ""} ${t => t.resize !== Ls ? "resize-" + t.resize : ""}"><label part="label" for="control" class="${t => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"><slot ${Bt("defaultSlottedNodes")}></slot></label><textarea part="control" class="control" id="control" ?autofocus="${t => t.autofocus}" cols="${t => t.cols}" ?disabled="${t => t.disabled}" form="${t => t.form}" list="${t => t.list}" maxlength="${t => t.maxlength}" minlength="${t => t.minlength}" name="${t => t.name}" placeholder="${t => t.placeholder}" ?readonly="${t => t.readOnly}" ?required="${t => t.required}" rows="${t => t.rows}" ?spellcheck="${t => t.spellcheck}" :value="${t => t.value}" aria-atomic="${t => t.ariaAtomic}" aria-busy="${t => t.ariaBusy}" aria-controls="${t => t.ariaControls}" aria-current="${t => t.ariaCurrent}" aria-describedby="${t => t.ariaDescribedby}" aria-details="${t => t.ariaDetails}" aria-disabled="${t => t.ariaDisabled}" aria-errormessage="${t => t.ariaErrormessage}" aria-flowto="${t => t.ariaFlowto}" aria-haspopup="${t => t.ariaHaspopup}" aria-hidden="${t => t.ariaHidden}" aria-invalid="${t => t.ariaInvalid}" aria-keyshortcuts="${t => t.ariaKeyshortcuts}" aria-label="${t => t.ariaLabel}" aria-labelledby="${t => t.ariaLabelledby}" aria-live="${t => t.ariaLive}" aria-owns="${t => t.ariaOwns}" aria-relevant="${t => t.ariaRelevant}" aria-roledescription="${t => t.ariaRoledescription}" @input="${(t, e) => t.handleTextInput()}" @change="${t => t.handleChange()}" ${St("control")}></textarea></template>`,
    styles: gg,
    shadowOptions: {delegatesFocus: !0}
}), vg = gg, bg = (t, e) => vt`
    ${ln("inline-block")}

    ${Md(0, 0, ".root")}

    ${Bd()}

    .root{display:flex;flex-direction:row}.control{-webkit-appearance:none;color:inherit;background:transparent;border:0;height:calc(100% - 4px);margin-top:auto;margin-bottom:auto;padding:0 calc(${lr} * 2px + 1px);font-family:inherit;font-size:inherit;line-height:inherit}.start,.end{display:flex;margin:auto}.start{display:flex;margin-inline-start:11px}.end{display:flex;margin-inline-end:11px}`.withBehaviors(qd("outline", Nd(0, 0, ".root")), qd("filled", jd(0, 0, ".root")), rn(Ud(0, 0, ".root")));

class yg extends Zo {
    appearanceChanged(t, e) {
        t !== e && (this.classList.add(e), this.classList.remove(t))
    }

    connectedCallback() {
        super.connectedCallback(), this.appearance || (this.appearance = "outline")
    }
}

ad([st], yg.prototype, "appearance", void 0);
const xg = yg.compose({
    baseName: "text-field",
    baseClass: Zo,
    template: (t, e) => _`<template class=" ${t => t.readOnly ? "readonly" : ""} "><label part="label" for="control" class="${t => t.defaultSlottedNodes && t.defaultSlottedNodes.length ? "label" : "label label__hidden"}"><slot ${Bt({
        property: "defaultSlottedNodes",
        filter: cs
    })}></slot></label><div class="root" part="root">${_t(0, e)}<input class="control" part="control" id="control" @input="${t => t.handleTextInput()}" @change="${t => t.handleChange()}" ?autofocus="${t => t.autofocus}" ?disabled="${t => t.disabled}" list="${t => t.list}" maxlength="${t => t.maxlength}" minlength="${t => t.minlength}" pattern="${t => t.pattern}" placeholder="${t => t.placeholder}" ?readonly="${t => t.readOnly}" ?required="${t => t.required}" size="${t => t.size}" ?spellcheck="${t => t.spellcheck}" :value="${t => t.value}" type="${t => t.type}" aria-atomic="${t => t.ariaAtomic}" aria-busy="${t => t.ariaBusy}" aria-controls="${t => t.ariaControls}" aria-current="${t => t.ariaCurrent}" aria-describedby="${t => t.ariaDescribedby}" aria-details="${t => t.ariaDetails}" aria-disabled="${t => t.ariaDisabled}" aria-errormessage="${t => t.ariaErrormessage}" aria-flowto="${t => t.ariaFlowto}" aria-haspopup="${t => t.ariaHaspopup}" aria-hidden="${t => t.ariaHidden}" aria-invalid="${t => t.ariaInvalid}" aria-keyshortcuts="${t => t.ariaKeyshortcuts}" aria-label="${t => t.ariaLabel}" aria-labelledby="${t => t.ariaLabelledby}" aria-live="${t => t.ariaLive}" aria-owns="${t => t.ariaOwns}" aria-relevant="${t => t.ariaRelevant}" aria-roledescription="${t => t.ariaRoledescription}" ${St("control")} />${qt(0, e)}</div></template>`,
    styles: bg,
    shadowOptions: {delegatesFocus: !0}
}), $g = bg;

class wg extends Hs {
}

const kg = wg.compose({
    baseName: "toolbar",
    baseClass: Hs,
    template: (t, e) => _`<template aria-label="${t => t.ariaLabel}" aria-labelledby="${t => t.ariaLabelledby}" aria-orientation="${t => t.orientation}" orientation="${t => t.orientation}" role="toolbar" @click="${(t, e) => t.clickHandler(e.event)}" @focusin="${(t, e) => t.focusinHandler(e.event)}" @keydown="${(t, e) => t.keydownHandler(e.event)}" ${jt({
        property: "childItems",
        attributeFilter: ["disabled", "hidden"],
        filter: zt(),
        subtree: !0
    })}><slot name="label"></slot><div class="positioning-region" part="positioning-region">${_t(0, e)}<slot ${Bt({
        filter: zt(),
        property: "slottedItems"
    })}></slot>${qt(0, e)}</div></template>`,
    styles: (t, e) => vt`
    ${ln("inline-flex")} :host{--toolbar-item-gap:calc(${lr} * 1px);background:${ol};fill:currentcolor;padding:var(--toolbar-item-gap);box-sizing:border-box;align-items:center}:host(${cn}){${Yh}}.positioning-region{align-items:center;display:inline-flex;flex-flow:row wrap;justify-content:flex-start;flex-grow:1}:host([orientation='vertical']) .positioning-region{flex-direction:column;align-items:start}::slotted(:not([slot])){flex:0 0 auto;margin:0 var(--toolbar-item-gap)}:host([orientation='vertical']) ::slotted(:not([slot])){margin:var(--toolbar-item-gap) 0}:host([orientation='vertical']){display:inline-flex;flex-direction:column}.start,.end{display:flex;align-items:center}.end{margin-inline-start:auto}.start__hidden,.end__hidden{display:none}::slotted(svg){${""}
      width:16px;height:16px}`.withBehaviors(rn(vt`
        :host(:${cn}){outline-color:${Ke.Highlight};color:${Ke.ButtonText};forced-color-adjust:none}`))
});

class Cg extends tn {
    connectedCallback() {
        super.connectedCallback(), ol.setValueFor(this, Ka)
    }
}

const Ig = Cg.compose({
        baseName: "tooltip",
        baseClass: tn,
        template: (t, e) => _` ${Ot(t => t.tooltipVisible, _`<${t.tagFor(oi)} fixed-placement="true" auto-update-mode="${t => t.autoUpdateMode}" vertical-positioning-mode="${t => t.verticalPositioningMode}" vertical-default-position="${t => t.verticalDefaultPosition}" vertical-inset="${t => t.verticalInset}" vertical-scaling="${t => t.verticalScaling}" horizontal-positioning-mode="${t => t.horizontalPositioningMode}" horizontal-default-position="${t => t.horizontalDefaultPosition}" horizontal-scaling="${t => t.horizontalScaling}" horizontal-inset="${t => t.horizontalInset}" vertical-viewport-lock="${t => t.horizontalViewportLock}" horizontal-viewport-lock="${t => t.verticalViewportLock}" dir="${t => t.currentDirection}" ${St("region")}><div class="tooltip" part="tooltip" role="tooltip"><slot></slot></div></${t.tagFor(oi)}>`)} `,
        styles: (t, e) => vt`
    :host{position:relative;contain:layout;overflow:visible;height:0;width:0;z-index:10000}.tooltip{box-sizing:border-box;border-radius:calc(${cr} * 1px);border:calc(${dr} * 1px) solid ${Vc};background:${ol};color:${lc};padding:4px 12px;height:fit-content;width:fit-content;${Bh}
      white-space:nowrap;box-shadow:${kd}}${t.tagFor(oi)}{display:flex;justify-content:center;align-items:center;overflow:visible;flex-direction:row}${t.tagFor(oi)}.right,${t.tagFor(oi)}.left{flex-direction:column}${t.tagFor(oi)}.top .tooltip::after,${t.tagFor(oi)}.bottom .tooltip::after,${t.tagFor(oi)}.left .tooltip::after,${t.tagFor(oi)}.right .tooltip::after{content:'';width:12px;height:12px;background:${ol};border-top:calc(${dr} * 1px) solid ${Vc};border-left:calc(${dr} * 1px) solid ${Vc};position:absolute}${t.tagFor(oi)}.top .tooltip::after{transform:translateX(-50%) rotate(225deg);bottom:5px;left:50%}${t.tagFor(oi)}.top .tooltip{margin-bottom:12px}${t.tagFor(oi)}.bottom .tooltip::after{transform:translateX(-50%) rotate(45deg);top:5px;left:50%}${t.tagFor(oi)}.bottom .tooltip{margin-top:12px}${t.tagFor(oi)}.left .tooltip::after{transform:translateY(-50%) rotate(135deg);top:50%;right:5px}${t.tagFor(oi)}.left .tooltip{margin-right:12px}${t.tagFor(oi)}.right .tooltip::after{transform:translateY(-50%) rotate(-45deg);top:50%;left:5px}${t.tagFor(oi)}.right .tooltip{margin-left:12px}`.withBehaviors(rn(vt`
        :host([disabled]){opacity:1}${t.tagFor(oi)}.top .tooltip::after,${t.tagFor(oi)}.bottom .tooltip::after,${t.tagFor(oi)}.left .tooltip::after,${t.tagFor(oi)}.right .tooltip::after{content:'';width:unset;height:unset}`))
    }), Fg = (t, e) => vt`
  :host([hidden]){display:none}${ln("flex")} :host{flex-direction:column;align-items:stretch;min-width:fit-content;font-size:0}`,
    Dg = sn.compose({
        baseName: "tree-view",
        template: (t, e) => _`<template role="tree" ${St("treeView")} @keydown="${(t, e) => t.handleKeyDown(e.event)}" @focusin="${(t, e) => t.handleFocus(e.event)}" @focusout="${(t, e) => t.handleBlur(e.event)}" @click="${(t, e) => t.handleClick(e.event)}" @selected-change="${(t, e) => t.handleSelectedChange(e.event)}"><slot ${Bt("slottedTreeItems")}></slot></template>`,
        styles: Fg
    }), Tg = Fg, Sg = vt`
  .expand-collapse-button svg{transform:rotate(0deg)}:host(.nested) .expand-collapse-button{left:var(--expand-collapse-button-nested-width,calc(${Zh} * -1px))}:host([selected])::after{left:calc(${ur} * 1px)}:host([expanded]) > .positioning-region .expand-collapse-button svg{transform:rotate(90deg)}`,
    Og = vt`
  .expand-collapse-button svg{transform:rotate(180deg)}:host(.nested) .expand-collapse-button{right:var(--expand-collapse-button-nested-width,calc(${Zh} * -1px))}:host([selected])::after{right:calc(${ur} * 1px)}:host([expanded]) > .positioning-region .expand-collapse-button svg{transform:rotate(90deg)}`,
    Eg = yt`((${nr} / 2) * ${lr}) + ((${lr} * ${ar}) / 2)`,
    Vg = vo.create("tree-item-expand-collapse-hover").withDefault(t => {
        const e = Ql.getValueFor(t);
        return e.evaluate(t, e.evaluate(t).hover).hover
    }), Rg = vo.create("tree-item-expand-collapse-selected-hover").withDefault(t => {
        const e = Gl.getValueFor(t);
        return Ql.getValueFor(t).evaluate(t, e.evaluate(t).rest).hover
    }), Ag = (t, e) => vt`
    ${ln("block")} :host{contain:content;position:relative;outline:none;color:${lc};fill:currentcolor;cursor:pointer;font-family:${pr};--expand-collapse-button-size:calc(${Zh} * 1px);--tree-item-nested-width:0}.positioning-region{display:flex;position:relative;box-sizing:border-box;background:${Zl};border:calc(${dr} * 1px) solid transparent;border-radius:calc(${cr} * 1px);height:calc((${Zh} + 1) * 1px)}:host(:${cn}) .positioning-region{${Yh}}.positioning-region::before{content:'';display:block;width:var(--tree-item-nested-width);flex-shrink:0}:host(:not([disabled])) .positioning-region:hover{background:${Jl}}:host(:not([disabled])) .positioning-region:active{background:${tc}}.content-region{display:inline-flex;align-items:center;white-space:nowrap;width:100%;height:calc(${Zh} * 1px);margin-inline-start:calc(${lr} * 2px + 8px);${Bh}}.items{display:none;${""} font-size:calc(1em + (${lr} + 16) * 1px)}.expand-collapse-button{background:none;border:none;border-radius:calc(${cr} * 1px);${""} width:calc((${Eg} + (${lr} * 2)) * 1px);height:calc((${Eg} + (${lr} * 2)) * 1px);padding:0;display:flex;justify-content:center;align-items:center;cursor:pointer;margin:0 6px}.expand-collapse-button svg{transition:transform 0.1s linear;pointer-events:none}.start,.end{display:flex}.start{${""} margin-inline-end:calc(${lr} * 2px + 2px)}.end{${""} margin-inline-start:calc(${lr} * 2px + 2px)}:host(.expanded) > .items{display:block}:host([disabled]){opacity:${sr};cursor:${"not-allowed"}}:host(.nested) .content-region{position:relative;margin-inline-start:var(--expand-collapse-button-size)}:host(.nested) .expand-collapse-button{position:absolute}:host(.nested) .expand-collapse-button:hover{background:${Vg}}:host(:not([disabled])[selected]) .positioning-region{background:${Wl}}:host(:not([disabled])[selected]) .expand-collapse-button:hover{background:${Rg}}:host([selected])::after{content:'';display:block;position:absolute;top:calc((${Zh} / 4) * 1px);width:3px;height:calc((${Zh} / 2) * 1px);${""} background:${rl};border-radius:calc(${cr} * 1px)}::slotted(fluent-tree-item){--tree-item-nested-width:1em;--expand-collapse-button-nested-width:calc(${Zh} * -1px)}`.withBehaviors(new ld(Sg, Og), rn(vt`
        :host{color:${Ke.ButtonText}}.positioning-region{border-color:${Ke.ButtonFace};background:${Ke.ButtonFace}}:host(:not([disabled])) .positioning-region:hover,:host(:not([disabled])) .positioning-region:active,:host(:not([disabled])[selected]) .positioning-region{background:${Ke.Highlight}}:host .positioning-region:hover .content-region,:host([selected]) .positioning-region .content-region{forced-color-adjust:none;color:${Ke.HighlightText}}:host([disabled][selected]) .positioning-region .content-region{color:${Ke.GrayText}}:host([selected])::after{background:${Ke.HighlightText}}:host(:${cn}) .positioning-region{forced-color-adjust:none;outline-color:${Ke.ButtonFace}}:host([disabled]),:host([disabled]) .content-region,:host([disabled]) .positioning-region:hover .content-region{opacity:1;color:${Ke.GrayText}}:host(.nested) .expand-collapse-button:hover,:host(:not([disabled])[selected]) .expand-collapse-button:hover{background:${Ke.ButtonFace};fill:${Ke.ButtonText}}`)),
    Lg = on.compose({
        baseName: "tree-item",
        template: (t, e) => _`<template role="treeitem" slot="${t => t.isNestedItem() ? "item" : void 0}" tabindex="-1" class="${t => t.expanded ? "expanded" : ""} ${t => t.selected ? "selected" : ""} ${t => t.nested ? "nested" : ""} ${t => t.disabled ? "disabled" : ""}" aria-expanded="${t => t.childItems && t.childItemLength() > 0 ? t.expanded : void 0}" aria-selected="${t => t.selected}" aria-disabled="${t => t.disabled}" @focusin="${(t, e) => t.handleFocus(e.event)}" @focusout="${(t, e) => t.handleBlur(e.event)}" ${jt({
            property: "childItems",
            filter: zt()
        })}><div class="positioning-region" part="positioning-region"><div class="content-region" part="content-region">${Ot(t => t.childItems && t.childItemLength() > 0, _`<div aria-hidden="true" class="expand-collapse-button" part="expand-collapse-button" @click="${(t, e) => t.handleExpandCollapseButtonClick(e.event)}" ${St("expandCollapseButton")}><slot name="expand-collapse-glyph">${e.expandCollapseGlyph || ""}</slot></div>`)} ${_t(0, e)}<slot></slot>${qt(0, e)}</div></div>${Ot(t => t.childItems && t.childItemLength() > 0 && (t.expanded || t.renderCollapsedChildren), _`<div role="group" class="items" part="items"><slot name="item" ${Bt("items")}></slot></div>`)}</template>`,
        styles: Ag,
        expandCollapseGlyph: '\n    <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">\n      <path d="M4.65 2.15a.5.5 0 000 .7L7.79 6 4.65 9.15a.5.5 0 10.7.7l3.5-3.5a.5.5 0 000-.7l-3.5-3.5a.5.5 0 00-.7 0z"/>\n    </svg>\n  '
    }), Pg = Ag, zg = {
        fluentAccordion: nd,
        fluentAccordionItem: od,
        fluentAnchor: Kd,
        fluentAnchoredRegion: Yd,
        fluentBadge: tu,
        fluentBreadcrumb: ou,
        fluentBreadcrumbItem: ru,
        fluentButton: hu,
        fluentCalendar: fu,
        fluentCard: bu,
        fluentCheckbox: $u,
        fluentCombobox: Du,
        fluentDataGrid: Pu,
        fluentDataGridCell: Vu,
        fluentDataGridRow: Au,
        fluentDesignSystemProvider: ju,
        fluentDialog: qu,
        fluentDivider: Wu,
        fluentFlipper: Yu,
        fluentHorizontalScroll: op,
        fluentListbox: ap,
        fluentOption: hp,
        fluentMenu: gp,
        fluentMenuItem: vp,
        fluentNumberField: wp,
        fluentProgress: Ip,
        fluentProgressRing: Sp,
        fluentRadio: Vp,
        fluentRadioGroup: Lp,
        fluentSearch: jp,
        fluentSelect: _p,
        fluentSkeleton: Kp,
        fluentSlider: Qp,
        fluentSliderLabel: tg,
        fluentSwitch: og,
        fluentTabs: ug,
        fluentTab: ag,
        fluentTabPanel: hg,
        fluentTextArea: mg,
        fluentTextField: xg,
        fluentToolbar: kg,
        fluentTooltip: Ig,
        fluentTreeView: Dg,
        fluentTreeItem: Lg,
        register(t, ...e) {
            if (t) for (const i in this) "register" !== i && this[i]().register(t, ...e)
        }
    };

function Hg(t) {
    return ko.getOrCreate(t).withPrefix("fluent")
}

const Mg = Hg().register(zg);
export {
    Od as AccentButtonStyles,
    Qe as Accordion,
    Le as AccordionItem,
    Gd as Anchor,
    oi as AnchoredRegion,
    Jd as Badge,
    ri as Breadcrumb,
    ni as BreadcrumbItem,
    cu as Button,
    vu as Card,
    Fu as Combobox,
    Di as DataGrid,
    Oi as DataGridCell,
    Fi as DataGridRow,
    Nu as DesignSystemProvider,
    Po as Dialog,
    ld as DirectionalStyleSheetBehavior,
    Ho as Divider,
    No as Flipper,
    Mg as FluentDesignSystem,
    ip as HorizontalScroll,
    Ed as HypertextStyles,
    Vd as LightweightButtonStyles,
    rp as Listbox,
    pp as Menu,
    Wo as MenuItem,
    Sd as NeutralButtonStyles,
    xp as NumberField,
    dp as OptionStyles,
    Rd as OutlineButtonStyles,
    zn as PaletteRGB,
    Cp as Progress,
    Tp as ProgressRing,
    as as Radio,
    ss as RadioGroup,
    Rp as RadioStyles,
    Np as Search,
    qp as Select,
    bs as Skeleton,
    Is as Slider,
    $s as SliderLabel,
    Zn as StandardLuminance,
    Ad as StealthButtonStyles,
    En as SwatchRGB,
    Ts as Switch,
    Os as Tab,
    Ss as TabPanel,
    Vs as Tabs,
    fg as TextArea,
    yg as TextField,
    wg as Toolbar,
    Cg as Tooltip,
    on as TreeItem,
    sn as TreeView,
    Ua as accentBaseColor,
    ll as accentFillActive,
    Gr as accentFillActiveDelta,
    cl as accentFillFocus,
    Wr as accentFillFocusDelta,
    al as accentFillHover,
    _r as accentFillHoverDelta,
    nl as accentFillRecipe,
    rl as accentFillRest,
    qr as accentFillRestDelta,
    bl as accentForegroundActive,
    Yr as accentForegroundActiveDelta,
    wh as accentForegroundCut,
    kh as accentForegroundCutLarge,
    yl as accentForegroundFocus,
    Qr as accentForegroundFocusDelta,
    vl as accentForegroundHover,
    Xr as accentForegroundHoverDelta,
    fl as accentForegroundRecipe,
    ml as accentForegroundRest,
    Kr as accentForegroundRestDelta,
    qa as accentPalette,
    kl as accentStrokeControlActive,
    Cl as accentStrokeControlFocus,
    wl as accentStrokeControlHover,
    xl as accentStrokeControlRecipe,
    $l as accentStrokeControlRest,
    sd as accordionItemStyles,
    rd as accordionStyles,
    zg as allComponents,
    hd as ambientShadow,
    Wd as anchorStyles,
    Qd as anchoredRegionStyles,
    eu as badgeStyles,
    Td as baseButtonStyles,
    nr as baseHeightMultiplier,
    rr as baseHorizontalSpacingMultiplier,
    Md as baseInputStyles,
    Ur as baseLayerLuminance,
    pr as bodyFont,
    au as breadcrumbItemStyles,
    su as breadcrumbStyles,
    du as buttonStyles,
    yu as cardStyles,
    wu as checkboxStyles,
    Tu as comboboxStyles,
    cr as controlCornerRadius,
    sh as cornerRadius,
    Ru as dataGridCellStyles,
    Lu as dataGridRowStyles,
    zu as dataGridStyles,
    ar as density,
    lr as designUnit,
    _u as dialogStyles,
    or as direction,
    dd as directionalShadow,
    sr as disabledOpacity,
    Ku as dividerStyles,
    nh as elevatedCornerRadius,
    ud as elevation,
    xd as elevationShadowCardActive,
    md as elevationShadowCardActiveSize,
    $d as elevationShadowCardFocus,
    vd as elevationShadowCardFocusSize,
    yd as elevationShadowCardHover,
    fd as elevationShadowCardHoverSize,
    bd as elevationShadowCardRest,
    gd as elevationShadowCardRestSize,
    Dd as elevationShadowDialog,
    Fd as elevationShadowDialogSize,
    Id as elevationShadowFlyout,
    Cd as elevationShadowFlyoutSize,
    pd as elevationShadowRecipe,
    kd as elevationShadowTooltip,
    wd as elevationShadowTooltipSize,
    ol as fillColor,
    Qu as flipperStyles,
    nd as fluentAccordion,
    od as fluentAccordionItem,
    Kd as fluentAnchor,
    Yd as fluentAnchoredRegion,
    tu as fluentBadge,
    ou as fluentBreadcrumb,
    ru as fluentBreadcrumbItem,
    hu as fluentButton,
    fu as fluentCalendar,
    bu as fluentCard,
    $u as fluentCheckbox,
    Du as fluentCombobox,
    Pu as fluentDataGrid,
    Vu as fluentDataGridCell,
    Au as fluentDataGridRow,
    ju as fluentDesignSystemProvider,
    qu as fluentDialog,
    Wu as fluentDivider,
    Yu as fluentFlipper,
    op as fluentHorizontalScroll,
    ap as fluentListbox,
    gp as fluentMenu,
    vp as fluentMenuItem,
    wp as fluentNumberField,
    hp as fluentOption,
    Ip as fluentProgress,
    Sp as fluentProgressRing,
    Vp as fluentRadio,
    Lp as fluentRadioGroup,
    jp as fluentSearch,
    _p as fluentSelect,
    Kp as fluentSkeleton,
    Qp as fluentSlider,
    tg as fluentSliderLabel,
    og as fluentSwitch,
    ag as fluentTab,
    hg as fluentTabPanel,
    ug as fluentTabs,
    mg as fluentTextArea,
    xg as fluentTextField,
    kg as fluentToolbar,
    Ig as fluentTooltip,
    Lg as fluentTreeItem,
    Dg as fluentTreeView,
    ah as focusOutlineWidth,
    Uc as focusStrokeInner,
    jc as focusStrokeInnerRecipe,
    Nc as focusStrokeOuter,
    Bc as focusStrokeOuterRecipe,
    ur as focusStrokeWidth,
    Yh as focusTreatmentBase,
    Qh as focusTreatmentTight,
    gr as fontWeight,
    pl as foregroundOnAccentActive,
    Wc as foregroundOnAccentActiveLarge,
    gl as foregroundOnAccentFocus,
    Kc as foregroundOnAccentFocusLarge,
    ul as foregroundOnAccentHover,
    Gc as foregroundOnAccentHoverLarge,
    qc as foregroundOnAccentLargeRecipe,
    hl as foregroundOnAccentRecipe,
    dl as foregroundOnAccentRest,
    _c as foregroundOnAccentRestLarge,
    Zh as heightNumber,
    sp as horizontalScrollStyles,
    jd as inputFilledStyles,
    Ud as inputForcedColorStyles,
    Nd as inputOutlineStyles,
    Bd as inputStateStyles,
    An as isDark,
    hr as layerCornerRadius,
    lp as listboxStyles,
    bp as menuItemStyles,
    fp as menuStyles,
    Na as neutralBaseColor,
    Th as neutralContrastFillActive,
    hh as neutralContrastFillActiveDelta,
    Sh as neutralContrastFillFocus,
    dh as neutralContrastFillFocusDelta,
    Dh as neutralContrastFillHover,
    ch as neutralContrastFillHoverDelta,
    Fh as neutralContrastFillRest,
    lh as neutralContrastFillRestDelta,
    Ch as neutralDivider,
    vh as neutralDividerRestDelta,
    Tl as neutralFillActive,
    ta as neutralFillActiveDelta,
    Ih as neutralFillCard,
    uh as neutralFillCardDelta,
    Sl as neutralFillFocus,
    ea as neutralFillFocusDelta,
    Dl as neutralFillHover,
    Jr as neutralFillHoverDelta,
    Rl as neutralFillInputActive,
    sa as neutralFillInputActiveDelta,
    Hl as neutralFillInputAltActive,
    la as neutralFillInputAltActiveDelta,
    Ml as neutralFillInputAltFocus,
    ca as neutralFillInputAltFocusDelta,
    zl as neutralFillInputAltHover,
    aa as neutralFillInputAltHoverDelta,
    Ll as neutralFillInputAltRecipe,
    Pl as neutralFillInputAltRest,
    ra as neutralFillInputAltRestDelta,
    Al as neutralFillInputFocus,
    na as neutralFillInputFocusDelta,
    Vl as neutralFillInputHover,
    oa as neutralFillInputHoverDelta,
    Ol as neutralFillInputRecipe,
    El as neutralFillInputRest,
    ia as neutralFillInputRestDelta,
    ih as neutralFillInverseActive,
    Qc as neutralFillInverseActiveDelta,
    oh as neutralFillInverseFocus,
    Zc as neutralFillInverseFocusDelta,
    eh as neutralFillInverseHover,
    Yc as neutralFillInverseHoverDelta,
    Jc as neutralFillInverseRecipe,
    th as neutralFillInverseRest,
    Xc as neutralFillInverseRestDelta,
    Ul as neutralFillLayerActive,
    ua as neutralFillLayerActiveDelta,
    ql as neutralFillLayerAltRecipe,
    _l as neutralFillLayerAltRest,
    pa as neutralFillLayerAltRestDelta,
    jl as neutralFillLayerHover,
    da as neutralFillLayerHoverDelta,
    Bl as neutralFillLayerRecipe,
    Nl as neutralFillLayerRest,
    ha as neutralFillLayerRestDelta,
    Il as neutralFillRecipe,
    Fl as neutralFillRest,
    Zr as neutralFillRestDelta,
    Xl as neutralFillSecondaryActive,
    ma as neutralFillSecondaryActiveDelta,
    Yl as neutralFillSecondaryFocus,
    va as neutralFillSecondaryFocusDelta,
    Kl as neutralFillSecondaryHover,
    fa as neutralFillSecondaryHoverDelta,
    Gl as neutralFillSecondaryRecipe,
    Wl as neutralFillSecondaryRest,
    ga as neutralFillSecondaryRestDelta,
    tc as neutralFillStealthActive,
    xa as neutralFillStealthActiveDelta,
    ec as neutralFillStealthFocus,
    $a as neutralFillStealthFocusDelta,
    Jl as neutralFillStealthHover,
    ya as neutralFillStealthHoverDelta,
    Ql as neutralFillStealthRecipe,
    Zl as neutralFillStealthRest,
    ba as neutralFillStealthRestDelta,
    nc as neutralFillStrongActive,
    Ca as neutralFillStrongActiveDelta,
    rc as neutralFillStrongFocus,
    Ia as neutralFillStrongFocusDelta,
    sc as neutralFillStrongHover,
    ka as neutralFillStrongHoverDelta,
    ic as neutralFillStrongRecipe,
    oc as neutralFillStrongRest,
    wa as neutralFillStrongRestDelta,
    Vh as neutralFillToggleActive,
    fh as neutralFillToggleActiveDelta,
    Rh as neutralFillToggleFocus,
    mh as neutralFillToggleFocusDelta,
    Eh as neutralFillToggleHover,
    gh as neutralFillToggleHoverDelta,
    Oh as neutralFillToggleRest,
    ph as neutralFillToggleRestDelta,
    Ah as neutralFocus,
    Lh as neutralFocusInnerAccent,
    hc as neutralForegroundActive,
    dc as neutralForegroundFocus,
    pc as neutralForegroundHint,
    uc as neutralForegroundHintRecipe,
    cc as neutralForegroundHover,
    ac as neutralForegroundRecipe,
    lc as neutralForegroundRest,
    Ya as neutralLayer1,
    Xa as neutralLayer1Recipe,
    Za as neutralLayer2,
    Qa as neutralLayer2Recipe,
    tl as neutralLayer3,
    Ja as neutralLayer3Recipe,
    il as neutralLayer4,
    el as neutralLayer4Recipe,
    Ga as neutralLayerCardContainer,
    _a as neutralLayerCardContainerRecipe,
    Ka as neutralLayerFloating,
    Wa as neutralLayerFloatingRecipe,
    bh as neutralLayerL1,
    yh as neutralLayerL2,
    xh as neutralLayerL3,
    $h as neutralLayerL4,
    Hh as neutralOutlineActive,
    Mh as neutralOutlineFocus,
    zh as neutralOutlineHover,
    Ph as neutralOutlineRest,
    ja as neutralPalette,
    vc as neutralStrokeActive,
    Ta as neutralStrokeActiveDelta,
    wc as neutralStrokeControlActive,
    Va as neutralStrokeControlActiveDelta,
    kc as neutralStrokeControlFocus,
    Ra as neutralStrokeControlFocusDelta,
    $c as neutralStrokeControlHover,
    Ea as neutralStrokeControlHoverDelta,
    yc as neutralStrokeControlRecipe,
    xc as neutralStrokeControlRest,
    Oa as neutralStrokeControlRestDelta,
    Cc as neutralStrokeDividerRecipe,
    Ic as neutralStrokeDividerRest,
    Aa as neutralStrokeDividerRestDelta,
    bc as neutralStrokeFocus,
    Sa as neutralStrokeFocusDelta,
    mc as neutralStrokeHover,
    Da as neutralStrokeHoverDelta,
    Sc as neutralStrokeInputActive,
    Oc as neutralStrokeInputFocus,
    Tc as neutralStrokeInputHover,
    Fc as neutralStrokeInputRecipe,
    Dc as neutralStrokeInputRest,
    Ac as neutralStrokeLayerActive,
    za as neutralStrokeLayerActiveDelta,
    Rc as neutralStrokeLayerHover,
    Pa as neutralStrokeLayerHoverDelta,
    Ec as neutralStrokeLayerRecipe,
    Vc as neutralStrokeLayerRest,
    La as neutralStrokeLayerRestDelta,
    gc as neutralStrokeRecipe,
    fc as neutralStrokeRest,
    Fa as neutralStrokeRestDelta,
    Hc as neutralStrokeStrongActive,
    Ma as neutralStrokeStrongActiveDelta,
    Mc as neutralStrokeStrongFocus,
    Ba as neutralStrokeStrongFocusDelta,
    zc as neutralStrokeStrongHover,
    Ha as neutralStrokeStrongHoverDelta,
    Lc as neutralStrokeStrongRecipe,
    Pc as neutralStrokeStrongRest,
    $p as numberFieldStyles,
    rh as outlineWidth,
    Op as progressRingStyles,
    Fp as progressStyles,
    Hg as provideFluentDesignSystem,
    Pp as radioGroupStyles,
    Up as searchStyles,
    zp as searchTemplate,
    Gp as selectStyles,
    Xp as skeletonStyles,
    eg as sliderLabelStyles,
    Zp as sliderStyles,
    dr as strokeWidth,
    sg as switchStyles,
    dg as tabPanelStyles,
    lg as tabStyles,
    pg as tabsStyles,
    vg as textAreaStyles,
    $g as textFieldStyles,
    Pg as treeItemStyles,
    Tg as treeViewStyles,
    Bh as typeRampBase,
    mr as typeRampBaseFontSize,
    br as typeRampBaseFontVariations,
    vr as typeRampBaseLineHeight,
    Nh as typeRampMinus1,
    yr as typeRampMinus1FontSize,
    $r as typeRampMinus1FontVariations,
    xr as typeRampMinus1LineHeight,
    jh as typeRampMinus2,
    wr as typeRampMinus2FontSize,
    Cr as typeRampMinus2FontVariations,
    kr as typeRampMinus2LineHeight,
    Uh as typeRampPlus1,
    Ir as typeRampPlus1FontSize,
    Dr as typeRampPlus1FontVariations,
    Fr as typeRampPlus1LineHeight,
    qh as typeRampPlus2,
    Tr as typeRampPlus2FontSize,
    Or as typeRampPlus2FontVariations,
    Sr as typeRampPlus2LineHeight,
    _h as typeRampPlus3,
    Er as typeRampPlus3FontSize,
    Rr as typeRampPlus3FontVariations,
    Vr as typeRampPlus3LineHeight,
    Gh as typeRampPlus4,
    Ar as typeRampPlus4FontSize,
    Pr as typeRampPlus4FontVariations,
    Lr as typeRampPlus4LineHeight,
    Wh as typeRampPlus5,
    zr as typeRampPlus5FontSize,
    Mr as typeRampPlus5FontVariations,
    Hr as typeRampPlus5LineHeight,
    Kh as typeRampPlus6,
    Br as typeRampPlus6FontSize,
    jr as typeRampPlus6FontVariations,
    Nr as typeRampPlus6LineHeight
};
