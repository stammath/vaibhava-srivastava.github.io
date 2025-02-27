/*
 *  /MathJax/jax/output/HTML-CSS/autoload/multiline.js
 *
 *  Copyright (c) 2009-2015 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

MathJax.Hub.Register.StartupHook("HTML-CSS Jax Ready", function() {
    var d = "2.5.0";
    var a = MathJax.ElementJax.mml, b = MathJax.OutputJax["HTML-CSS"];
    var e = {
        newline: 0,
        nobreak: 1000000,
        goodbreak: [ - 200],
        badbreak: [ + 200],
        auto: [0],
        toobig: 800,
        nestfactor: 400,
        spacefactor: - 100,
        spaceoffset: 2,
        spacelimit: 1,
        fence: 500,
        close: 500
    };
    var c = {
        linebreakstyle: "after"
    };
    a.mbase.Augment({
        HTMLlinebreakPenalty: e,
        HTMLmultiline: function(n) {
            var o = this;
            while (o.inferred || (o.parent && o.parent.type === "mrow" && o.parent.data.length === 1)) {
                o = o.parent
            }
            var l = ((o.type === "math" && o.Get("display") === "block") || o.type === "mtd");
            o.isMultiline = true;
            var p = this.getValues("linebreak", "linebreakstyle", "lineleading", "linebreakmultchar", "indentalign", "indentshift", "indentalignfirst", "indentshiftfirst", "indentalignlast", "indentshiftlast");
            if (p.linebreakstyle === a.LINEBREAKSTYLE.INFIXLINEBREAKSTYLE) {
                p.linebreakstyle = this.Get("infixlinebreakstyle")
            }
            p.lineleading = b.length2em(p.lineleading, 1, 0.5);
            this.HTMLremoveColor(n);
            var m = b.createStack(n);
            this.HTMLgetScale();
            var f = {
                n: 0,
                Y: 0,
                scale: this.scale || 1,
                isTop: l,
                values: {},
                VALUES: p
            }, k = this.HTMLgetAlign(f, {}), h = this.HTMLgetShift(f, {}, k), g = [], i = {
                index: [],
                penalty: e.nobreak,
                w: 0,
                W: h,
                shift: h,
                scanW: h,
                nest: 0
            }, j = false;
            while (this.HTMLbetterBreak(i, f) && (i.scanW >= b.linebreakWidth || i.penalty === e.newline)) {
                this.HTMLaddLine(m, g, i.index, f, i.values, j);
                g = i.index.slice(0);
                j = true;
                k = this.HTMLgetAlign(f, i.values);
                h = this.HTMLgetShift(f, i.values, k);
                if (k === a.INDENTALIGN.CENTER) {
                    h = 0
                }
                i.W = i.shift = i.scanW = h;
                i.penalty = e.nobreak
            }
            f.isLast = true;
            this.HTMLaddLine(m, g, [], f, c, j);
            if (l) {
                m.style.width = "100%";
                if (o.type === "math") {
                    n.bbox.width = "100%"
                }
            }
            this.HTMLhandleSpace(n);
            this.HTMLhandleColor(n);
            n.bbox.isMultiline = true;
            return n
        },
        HTMLbetterBreak: function(h, f) {
            if (this.isToken) {
                return false
            }
            if (this.isEmbellished()) {
                h.embellished = this;
                return this.CoreMO().HTMLbetterBreak(h, f)
            }
            if (this.linebreakContainer) {
                return false
            }
            var p = h.index.slice(0), n = h.index.shift(), l = this.data.length, k, q, j, o = (h.index.length > 0), g = false;
            if (n == null) {
                n =- 1
            }
            if (!o) {
                n++;
                h.W += h.w;
                h.w = 0
            }
            j = h.scanW = h.W;
            h.nest++;
            while (n < l && h.scanW < 1.33 * b.linebreakWidth) {
                if (this.data[n]) {
                    if (this.data[n].HTMLbetterBreak(h, f)) {
                        g = true;
                        p = [n].concat(h.index);
                        k = h.W;
                        q = h.w;
                        if (h.penalty === e.newline) {
                            h.index = p;
                            if (h.nest) {
                                h.nest--
                            }
                            return true
                        }
                    }
                    j = (o ? h.scanW : this.HTMLaddWidth(n, h, j))
                }
                h.index = [];
                n++;
                o = false
            }
            if (h.nest) {
                h.nest--
            }
            h.index = p;
            if (g) {
                h.W = k;
                h.w = q
            }
            return g
        },
        HTMLaddWidth: function(f, j, h) {
            if (this.data[f]) {
                var g = this.data[f].HTMLspanElement();
                h += g.bbox.w;
                if (g.style.paddingLeft) {
                    h += b.unEm(g.style.paddingLeft)
                }
                if (g.style.paddingRight) {
                    h += b.unEm(g.style.paddingRight)
                }
                j.W = j.scanW = h;
                j.w = 0
            }
            return h
        },
        HTMLaddLine: function(n, g, j, f, o, l) {
            line = b.createBox(n);
            line.bbox = this.HTMLemptyBBox({});
            f.first = l;
            f.last = true;
            this.HTMLmoveLine(g, j, line, f, o);
            this.HTMLcleanBBox(line.bbox);
            var m = this.HTMLgetAlign(f, o), h = this.HTMLgetShift(f, o, m);
            if (f.n > 0) {
                var k = b.FONTDATA.baselineskip * f.scale;
                var i = (f.values.lineleading == null ? f.VALUES : f.values).lineleading * f.scale;
                f.Y -= Math.max(k, f.d + line.bbox.h + i)
            }
            b.alignBox(line, m, f.Y, h);
            f.d = line.bbox.d;
            f.values = o;
            f.n++
        },
        HTMLgetAlign: function(i, f) {
            var j = f, g = i.values, h = i.VALUES, k;
            if (i.n === 0) {
                k = j.indentalignfirst || g.indentalignfirst || h.indentalignfirst
            } else {
                if (i.isLast) {
                    k = g.indentalignlast || h.indentalignlast
                } else {
                    k = g.indentalign || h.indentalign
                }
            }
            if (k === a.INDENTALIGN.INDENTALIGN) {
                k = g.indentalign || h.indentalign
            }
            if (k === a.INDENTALIGN.AUTO) {
                k = (i.isTop ? this.displayAlign : a.INDENTALIGN.LEFT)
            }
            return k
        },
        HTMLgetShift: function(k, h, m) {
            var l = h, i = k.values, j = k.VALUES, g;
            if (k.n === 0) {
                g = l.indentshiftfirst || i.indentshiftfirst || j.indentshiftfirst
            } else {
                if (k.isLast) {
                    g = i.indentshiftlast || j.indentshiftlast
                } else {
                    g = i.indentshift || j.indentshift
                }
            }
            if (g === a.INDENTSHIFT.INDENTSHIFT) {
                g = i.indentshift || j.indentshift
            }
            if (g === "auto" || g === "") {
                g = "0"
            }
            g = b.length2em(g, 1, b.cwidth);
            if (k.isTop && this.displayIndent !== "0") {
                var f = b.length2em(this.displayIndent, 1, b.cwidth);
                g += (m === a.INDENTALIGN.RIGHT?-f : f)
            }
            return g
        },
        HTMLmoveLine: function(o, f, l, n, g) {
            var k = o[0], h = f[0];
            if (k == null) {
                k =- 1
            }
            if (h == null) {
                h = this.data.length - 1
            }
            if (k === h && o.length > 1) {
                this.data[k].HTMLmoveSlice(o.slice(1), f.slice(1), l, n, g, "paddingLeft")
            } else {
                var m = n.last;
                n.last = false;
                while (k < h) {
                    if (this.data[k]) {
                        if (o.length <= 1) {
                            this.data[k].HTMLmoveSpan(l, n, g)
                        } else {
                            this.data[k].HTMLmoveSlice(o.slice(1), [], l, n, g, "paddingLeft")
                        }
                    }
                    k++;
                    n.first = false;
                    o = []
                }
                n.last = m;
                if (this.data[k]) {
                    if (f.length <= 1) {
                        this.data[k].HTMLmoveSpan(l, n, g)
                    } else {
                        this.data[k].HTMLmoveSlice([], f.slice(1), l, n, g, "paddingRight")
                    }
                }
            }
        },
        HTMLmoveSlice: function(g, j, m, f, o, k) {
            this.HTMLremoveColor();
            var l = this.HTMLcreateSliceSpan(m);
            this.HTMLmoveLine(g, j, l, f, o);
            l.style[k] = "";
            this.HTMLcombineBBoxes(l, m.bbox);
            this.HTMLcleanBBox(l.bbox);
            if (j.length === 0) {
                m = this.HTMLspanElement();
                m.parentNode.removeChild(m);
                m.nextMathJaxSpan.id = m.id;
                var h = 0;
                while (m = m.nextMathJaxSpan) {
                    var i = this.HTMLhandleColor(m);
                    if (i) {
                        i.id += "-MathJax-Continue-" + h;
                        h++
                    }
                }
            }
            return l
        },
        HTMLcreateSliceSpan: function(g) {
            var j = this.HTMLspanElement(), i = 0;
            var f = j;
            while (f.nextMathJaxSpan) {
                f = f.nextMathJaxSpan;
                i++
            }
            var h = j.cloneNode(false);
            f.nextMathJaxSpan = h;
            h.nextMathJaxSpan = null;
            h.id += "-MathJax-Continue-" + i;
            h.bbox = this.HTMLemptyBBox({});
            return g.appendChild(h)
        },
        HTMLmoveSpan: function(f, j, h) {
            if (!(j.first || j.last) || (j.first && j.values.linebreakstyle === a.LINEBREAKSTYLE.BEFORE) || (j.last && h.linebreakstyle === a.LINEBREAKSTYLE.AFTER)) {
                var g = document.getElementById("MathJax-Color-" + this.spanID + b.idPostfix);
                if (g) {
                    f.appendChild(g)
                }
                var i = this.HTMLspanElement();
                f.appendChild(i);
                if (j.last) {
                    i.style.paddingRight = ""
                }
                if (j.first || j.nextIsFirst) {
                    i.style.paddingLeft = "";
                    if (g) {
                        this.HTMLremoveColor(i);
                        this.HTMLhandleColor(i)
                    }
                }
                if (j.first && i.bbox.w === 0) {
                    j.nextIsFirst = true
                } else {
                    delete j.nextIsFirst
                }
                this.HTMLcombineBBoxes(this, f.bbox)
            }
        }
    });
    a.mfenced.Augment({
        HTMLbetterBreak: function(h, f) {
            var t = h.index.slice(0), r = h.index.shift(), o = this.data.length, n, u, l, s = (h.index.length > 0), g = false;
            if (r == null) {
                r =- 1
            }
            if (!s) {
                r++;
                h.W += h.w;
                h.w = 0
            }
            l = h.scanW = h.W;
            h.nest++;
            if (!this.dataI) {
                this.dataI = [];
                if (this.data.open) {
                    this.dataI.push("open")
                }
                if (o) {
                    this.dataI.push(0)
                }
                for (var q = 1; q < o; q++) {
                    if (this.data["sep" + q]) {
                        this.dataI.push("sep" + q)
                    }
                    this.dataI.push(q)
                }
                if (this.data.close) {
                    this.dataI.push("close")
                }
            }
            o = this.dataI.length;
            while (r < o && h.scanW < 1.33 * b.linebreakWidth) {
                var p = this.dataI[r];
                if (this.data[p]) {
                    if (this.data[p].HTMLbetterBreak(h, f)) {
                        g = true;
                        t = [r].concat(h.index);
                        n = h.W;
                        u = h.w;
                        if (h.penalty === e.newline) {
                            h.index = t;
                            if (h.nest) {
                                h.nest--
                            }
                            return true
                        }
                    }
                    l = (s ? h.scanW : this.HTMLaddWidth(r, h, l))
                }
                h.index = [];
                r++;
                s = false
            }
            if (h.nest) {
                h.nest--
            }
            h.index = t;
            if (g) {
                h.W = n;
                h.w = u
            }
            return g
        },
        HTMLmoveLine: function(g, l, o, f, q) {
            var n = g[0], m = l[0];
            if (n == null) {
                n =- 1
            }
            if (m == null) {
                m = this.dataI.length - 1
            }
            if (n === m && g.length > 1) {
                this.data[this.dataI[n]].HTMLmoveSlice(g.slice(1), l.slice(1), o, f, q, "paddingLeft")
            } else {
                var p = f.last;
                f.last = false;
                var h = this.dataI[n];
                while (n < m) {
                    if (this.data[h]) {
                        if (g.length <= 1) {
                            this.data[h].HTMLmoveSpan(o, f, q)
                        } else {
                            this.data[h].HTMLmoveSlice(g.slice(1), [], o, f, q, "paddingLeft")
                        }
                    }
                    n++;
                    h = this.dataI[n];
                    f.first = false;
                    g = []
                }
                f.last = p;
                if (this.data[h]) {
                    if (l.length <= 1) {
                        this.data[h].HTMLmoveSpan(o, f, q)
                    } else {
                        this.data[h].HTMLmoveSlice([], l.slice(1), o, f, q, "paddingRight")
                    }
                }
            }
        }
    });
    a.msubsup.Augment({
        HTMLbetterBreak: function(h, f) {
            if (!this.data[this.base]) {
                return false
            }
            var n = h.index.slice(0), l = h.index.shift(), k, o, j, m = (h.index.length > 0), g = false;
            if (!m) {
                h.W += h.w;
                h.w = 0
            }
            j = h.scanW = h.W;
            if (l == null) {
                this.HTMLbaseW = this.data[this.base].HTMLspanElement().bbox.w;
                this.HTMLdw = this.HTMLspanElement().bbox.w - this.HTMLbaseW
            }
            if (this.data[this.base].HTMLbetterBreak(h, f)) {
                g = true;
                n = [this.base].concat(h.index);
                k = h.W;
                o = h.w;
                if (h.penalty === e.newline) {
                    g = m = true
                }
            }
            if (!m) {
                this.HTMLaddWidth(this.base, h, j)
            }
            h.scanW += this.HTMLdw;
            h.W = h.scanW;
            h.index = [];
            if (g) {
                h.W = k;
                h.w = o;
                h.index = n
            }
            return g
        },
        HTMLmoveLine: function(m, g, j, l, h) {
            if (this.data[this.base]) {
                if (m.length > 1) {
                    this.data[this.base].HTMLmoveSlice(m.slice(1), g.slice(1), j, l, h, "paddingLeft")
                } else {
                    if (g.length <= 1) {
                        this.data[this.base].HTMLmoveSpan(j, l, h)
                    } else {
                        this.data[this.base].HTMLmoveSlice([], g.slice(1), j, l, h, "paddingRight")
                    }
                }
            }
            if (g.length === 0) {
                var i = this.data[this.sup] || this.data[this.sub];
                if (i && this.HTMLnotEmpty(i)) {
                    var k = i.HTMLspanElement().parentNode, f = k.parentNode;
                    if (this.data[this.base]) {
                        f.removeChild(f.firstChild)
                    }
                    for (k = f.firstChild; k; k = k.nextSibling) {
                        k.style.left = b.Em(b.unEm(k.style.left) - this.HTMLbaseW)
                    }
                    f.bbox.w -= this.HTMLbaseW;
                    f.style.width = b.Em(f.bbox.w);
                    this.HTMLcombineBBoxes(f, j.bbox);
                    j.appendChild(f)
                }
            }
        }
    });
    a.mmultiscripts.Augment({
        HTMLbetterBreak: function(j, g) {
            if (!this.data[this.base]) {
                return false
            }
            var n = j.index.slice(0);
            j.index.shift();
            var l, o, k, m = (j.index.length > 0), i = false;
            if (!m) {
                j.W += j.w;
                j.w = 0
            }
            j.scanW = j.W;
            var p = this.HTMLspanElement().bbox, h = this.data[this.base].HTMLspanElement().bbox;
            var f = p.w - h.w;
            j.scanW += p.dx;
            k = j.scanW;
            if (this.data[this.base].HTMLbetterBreak(j, g)) {
                i = true;
                n = [this.base].concat(j.index);
                l = j.W;
                o = j.w;
                if (j.penalty === e.newline) {
                    i = m = true
                }
            }
            if (!m) {
                this.HTMLaddWidth(this.base, j, k)
            }
            j.scanW += f;
            j.W = j.scanW;
            j.index = [];
            if (i) {
                j.W = l;
                j.w = o;
                j.index = n
            }
            return i
        },
        HTMLmoveLine: function(h, i, o, g, p) {
            var m = this.HTMLspanElement(), k = m.bbox, n = m.firstChild, f = {};
            if (b.msiePaddingWidthBug) {
                n = n.nextSibling
            }
            var l = n.firstChild;
            while (l) {
                if (l.bbox && l.bbox.name) {
                    f[l.bbox.name] = l
                }
                l = l.nextSibling
            }
            if (h.length < 1) {
                if (f.presub || f.presup) {
                    var j = b.createStack(o);
                    if (f.presup) {
                        b.addBox(j, f.presup);
                        b.placeBox(f.presup, k.dx - f.presup.bbox.w, k.u)
                    }
                    if (f.presub) {
                        b.addBox(j, f.presub);
                        b.placeBox(f.presub, k.dx + k.delta - f.presub.bbox.w, - k.v)
                    }
                    this.HTMLcombineBBoxes(j, o.bbox);
                    o.appendChild(j);
                    j.style.width = b.Em(k.dx)
                }
            }
            if (this.data[this.base]) {
                if (h.length > 1) {
                    this.data[this.base].HTMLmoveSlice(h.slice(1), i.slice(1), o, g, p, "paddingLeft")
                } else {
                    if (i.length <= 1) {
                        this.data[this.base].HTMLmoveSpan(o, g, p)
                    } else {
                        this.data[this.base].HTMLmoveSlice([], i.slice(1), o, g, p, "paddingRight")
                    }
                }
            }
            if (i.length === 0) {
                if (this.data[this.base]) {
                    n.removeChild(n.firstChild)
                }
                for (l = n.firstChild; l; l = l.nextSibling) {
                    l.style.left = b.Em(b.unEm(l.style.left) - k.px)
                }
                n.bbox.w -= k.px;
                n.style.width = b.Em(n.bbox.w);
                this.HTMLcombineBBoxes(n, o.bbox);
                o.appendChild(n)
            }
        }
    });
    a.mo.Augment({
        HTMLbetterBreak: function(h, f) {
            if (h.values && h.values.id === this.spanID) {
                return false
            }
            var p = this.getValues("linebreak", "linebreakstyle", "lineleading", "linebreakmultchar", "indentalign", "indentshift", "indentalignfirst", "indentshiftfirst", "indentalignlast", "indentshiftlast", "texClass", "fence");
            if (p.linebreakstyle === a.LINEBREAKSTYLE.INFIXLINEBREAKSTYLE) {
                p.linebreakstyle = this.Get("infixlinebreakstyle")
            }
            if (p.texClass === a.TEXCLASS.OPEN) {
                h.nest++
            }
            if (p.texClass === a.TEXCLASS.CLOSE && h.nest) {
                h.nest--
            }
            var i = h.scanW, j = (h.embellished || this);
            delete h.embellished;
            var n = j.HTMLspanElement(), o = n.bbox.w;
            if (n.style.paddingLeft) {
                o += b.unEm(n.style.paddingLeft)
            }
            if (p.linebreakstyle === a.LINEBREAKSTYLE.AFTER) {
                i += o;
                o = 0
            }
            if (i - h.shift === 0 && p.linebreak !== a.LINEBREAK.NEWLINE) {
                return false
            }
            var k = b.linebreakWidth - i;
            if (f.n === 0 && (p.indentshiftfirst !== f.VALUES.indentshiftfirst || p.indentalignfirst !== f.VALUES.indentalignfirst)) {
                var l = this.HTMLgetAlign(f, p), g = this.HTMLgetShift(f, p, l);
                k += (h.shift - g)
            }
            var m = Math.floor(k / b.linebreakWidth * 1000);
            if (m < 0) {
                m = e.toobig - 3 * m
            }
            if (p.fence) {
                m += e.fence
            }
            if ((p.linebreakstyle === a.LINEBREAKSTYLE.AFTER && p.texClass === a.TEXCLASS.OPEN) || p.texClass === a.TEXCLASS.CLOSE) {
                m += e.close
            }
            m += h.nest * e.nestfactor;
            var q = e[p.linebreak || a.LINEBREAK.AUTO];
            if (!(q instanceof Array)) {
                if (k >= 0) {
                    m = q * h.nest
                }
            } else {
                m = Math.max(1, m + q[0] * h.nest)
            }
            if (m >= h.penalty) {
                return false
            }
            h.penalty = m;
            h.values = p;
            h.W = i;
            h.w = o;
            p.lineleading = b.length2em(p.lineleading, 1, f.VALUES.lineleading);
            p.id = this.spanID;
            return true
        }
    });
    a.mspace.Augment({
        HTMLbetterBreak: function(g, f) {
            if (g.values && g.values.id === this.spanID) {
                return false
            }
            var n = this.getValues("linebreak");
            var k = n.linebreak;
            if (!k || this.hasDimAttr()) {
                k = a.LINEBREAK.AUTO
            }
            var h = g.scanW, l = this.HTMLspanElement(), m = l.bbox.w;
            if (l.style.paddingLeft) {
                m += b.unEm(l.style.paddingLeft)
            }
            if (h - g.shift === 0) {
                return false
            }
            var i = b.linebreakWidth - h;
            var j = Math.floor(i / b.linebreakWidth * 1000);
            if (j < 0) {
                j = e.toobig - 3 * j
            }
            j += g.nest * e.nestfactor;
            var o = e[k];
            if (k === a.LINEBREAK.AUTO && m >= e.spacelimit&&!this.mathbackground&&!this.background) {
                o = [(m + e.spaceoffset) * e.spacefactor]
            }
            if (!(o instanceof Array)) {
                if (i >= 0) {
                    j = o * g.nest
                }
            } else {
                j = Math.max(1, j + o[0] * g.nest)
            }
            if (j >= g.penalty) {
                return false
            }
            g.penalty = j;
            g.values = n;
            g.W = h;
            g.w = m;
            n.lineleading = f.VALUES.lineleading;
            n.linebreakstyle = "before";
            n.id = this.spanID;
            return true
        }
    });
    MathJax.Hub.Register.StartupHook("TeX mathchoice Ready", function() {
        a.TeXmathchoice.Augment({
            HTMLbetterBreak: function(g, f) {
                return this.Core().HTMLbetterBreak(g, f)
            },
            HTMLmoveLine: function(j, f, h, i, g) {
                return this.Core().HTMLmoveSlice(j, f, h, i, g)
            }
        })
    });
    a.maction.Augment({
        HTMLbetterBreak: function(g, f) {
            return this.Core().HTMLbetterBreak(g, f)
        },
        HTMLmoveLine: function(j, f, h, i, g) {
            return this.Core().HTMLmoveSlice(j, f, h, i, g)
        },
        HTMLmoveSlice: function(g, i, l, f, m, j) {
            var o = document.getElementById("MathJax-HitBox-" + this.spanID + b.idPostfix);
            if (o) {
                o.parentNode.removeChild(o)
            }
            var k = this.SUPER(arguments).HTMLmoveSlice.apply(this, arguments);
            if (i.length === 0) {
                l = this.HTMLspanElement();
                var h = 0;
                while (l) {
                    o = this.HTMLhandleHitBox(l, "-Continue-" + h);
                    l = l.nextMathJaxSpan;
                    h++
                }
            }
            return k
        }
    });
    a.semantics.Augment({
        HTMLbetterBreak: function(g, f) {
            return (this.data[0] ? this.data[0].HTMLbetterBreak(g, f) : false)
        },
        HTMLmoveLine: function(j, f, h, i, g) {
            return (this.data[0] ? this.data[0].HTMLmoveSlice(j, f, h, i, g) : null)
        }
    });
    MathJax.Hub.Startup.signal.Post("HTML-CSS multiline Ready");
    MathJax.Ajax.loadComplete(b.autoloadDir + "/multiline.js")
});


