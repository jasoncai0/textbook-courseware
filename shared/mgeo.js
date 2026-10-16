'use strict';
/* 课本插件 · 平面几何作图小工具（七下第 7 章起用；依赖 math.js 的 MathKit.board，加载在 math.js 之后、course.js 之前）
 * 1. 向量：Geo.add/sub/mul/dot/len/dist/lerp/rot/dir(角度 → 单位向量)/ang(向量 → 角度，0–360)
 * 2. 几何量：Geo.angle(V, A, B) = ∠AVB（0–180°）；Geo.meet(P1, P2, Q1, Q2) 两直线交点（平行返回 null）；Geo.foot(P, A, B) 垂足
 * 3. 画在作图板上：Geo.line(b, P, Q) 直线（两端延长）；Geo.arc(b, V, A, B, { r, label }) 角的小弧 + 标号；Geo.right(b, V, A, B) 直角符号
 *    参数都可以是值或函数（跟 MathKit.board 一样，拖动后自动重算）。
 * 4. Geo.sketch(el, spec) 静态示意图：点、线段、角标、直角符号一次画好，字母自动放在图形外侧。
 * 5. Geo.board(el, opt) = MathKit.board + 登记；Geo.refresh() 重新排版全部作图板（翻页时调用，隐藏页上的字号才算得对）。
 */
const Geo = (() => {
  const val = (v) => (typeof v === 'function' ? v() : v);
  const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
  const mul = (p, k) => [p[0] * k, p[1] * k];
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1];
  const len = (p) => Math.hypot(p[0], p[1]);
  const dist = (p, q) => len(sub(p, q));
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const RAD = Math.PI / 180;
  const dir = (deg) => [Math.cos(deg * RAD), Math.sin(deg * RAD)];
  const ang = (v) => ((Math.atan2(v[1], v[0]) / RAD) % 360 + 360) % 360;
  const rot = (p, deg, c = [0, 0]) => {
    const [x, y] = sub(p, c);
    const [cs, sn] = dir(deg);
    return add(c, [x * cs - y * sn, x * sn + y * cs]);
  };
  const angle = (V, A, B) => {
    const u = sub(A, V);
    const v = sub(B, V);
    return Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (len(u) * len(v))))) / RAD;
  };
  const centroid = (pts) => mul(pts.reduce(add, [0, 0]), 1 / pts.length);
  function meet(P1, P2, Q1, Q2) {
    const d1 = sub(P2, P1);
    const d2 = sub(Q2, Q1);
    const den = d1[0] * d2[1] - d1[1] * d2[0];
    if (Math.abs(den) < 1e-9) return null;
    const t = ((Q1[0] - P1[0]) * d2[1] - (Q1[1] - P1[1]) * d2[0]) / den;
    return add(P1, mul(d1, t));
  }
  const foot = (P, A, B) => {
    const d = sub(B, A);
    return add(A, mul(d, dot(sub(P, A), d) / dot(d, d)));
  };

  /* ---------- 画到作图板上 ---------- */
  const FAR = 60;
  function line(b, P, Q, o = {}) {
    return b.seg(() => {
      const [p, q] = [val(P), val(Q)];
      const d = sub(q, p);
      const k = FAR / (len(d) || 1);
      return [o.ray ? p : add(p, mul(d, -k)), add(p, mul(d, k))];
    }, { cls: o.cls || 'gl' });
  }
  /** ∠AVB 的小弧（取小于 180° 的那一侧）；o.r 半径（世界单位），o.label 标号（值或函数），o.show 是否显示 */
  function arc(b, V, A, B, o = {}) {
    const span = () => {
      const v = val(V);
      const a0 = ang(sub(val(A), v));
      let d = ang(sub(val(B), v)) - a0;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      return [v, a0, d];
    };
    const r = () => val(o.r ?? 0.5);
    const on = () => (o.show === undefined ? true : val(o.show));
    const node = b.curve((t) => {
      if (!on()) return [NaN, NaN];
      const [v, a0, d] = span();
      return add(v, mul(dir(a0 + d * t), r()));
    }, 0, 1, { cls: o.cls || 'garc', n: 48 });
    if (o.label !== undefined) {
      b.text(() => {
        if (!on()) return null;
        const [v, a0, d] = span();
        return add(v, mul(dir(a0 + d / 2), r() * (o.lr || 1.75)));
      }, o.label, { cls: o.lcls || 'lb up gnum', dx: -5, dy: 7 });
    }
    return node;
  }
  /** 直角符号：顶点 V，两边指向 A、B */
  function right(b, V, A, B, o = {}) {
    return b.poly(() => {
      const v = val(V);
      const s = val(o.s ?? 0.3);
      const u = mul(sub(val(A), v), s / (dist(val(A), v) || 1));
      const w = mul(sub(val(B), v), s / (dist(val(B), v) || 1));
      return [v, add(v, u), add(add(v, u), w), add(v, w)];
    }, { cls: 'gright' });
  }

  const boards = [];
  function board(el, opt) {
    const b = MathKit.board(el, { axes: false, grid: false, ...opt });
    boards.push(b);
    return b;
  }
  const refresh = () => boards.forEach((b) => b.update());

  /** 静态示意图。spec = { P: {A:[x,y],…}, seg: 'AB BC', line: 'AB', ray: 'AB', dash: 'AD', ang: [['A','B','C','1']], right: [['C','A','B']], hide: 'O', pad, w, lab: {A:[dx,dy]} } */
  function sketch(el, spec) {
    const P = spec.P;
    const pts = Object.values(P);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const pad = spec.pad ?? 0.9;
    const box = { x: [Math.min(...xs) - pad, Math.max(...xs) + pad], y: [Math.min(...ys) - pad, Math.max(...ys) + pad] };
    const b = board(el, { ...box, w: spec.w || 360 });
    const pt = (s) => P[s];
    // 'AB BC A′B′' → [['A','B'], ['B','C'], ['A′','B′']]
    const pairs = (str) => (str || '').split(/\s+/).filter(Boolean).map((t) => t.match(/[A-Za-z][′0-9₀-₉]*/g).map(pt));
    pairs(spec.line).forEach(([p, q]) => line(b, p, q, { cls: 'gl thin-l' }));
    pairs(spec.ray).forEach(([p, q]) => line(b, p, q, { ray: true, cls: 'gl thin-l' }));
    pairs(spec.dash).forEach(([p, q]) => b.seg([p, q], { cls: 'gdash' }));
    pairs(spec.seg).forEach(([p, q]) => b.seg([p, q], { cls: 'gs' }));
    (spec.ang || []).forEach(([v, a, c, t, r]) => arc(b, pt(v), pt(a), pt(c), { label: t, r: r || 0.45 }));
    (spec.right || []).forEach(([v, a, c]) => right(b, pt(v), pt(a), pt(c), { s: 0.28 }));
    const mid = centroid(pts);
    const hide = spec.hide || '';
    Object.entries(P).forEach(([name, p]) => {
      if (hide.includes(name)) return;
      const off = (spec.lab && spec.lab[name]) || (() => {
        const d = sub(p, mid);
        const u = len(d) ? mul(d, 1 / len(d)) : [0, 1];
        return [u[0] * 16 - 6, -u[1] * 16 + 8];
      })();
      b.text(p, name, { dx: off[0], dy: off[1] });
    });
    (spec.text || []).forEach(([p, t, dx, dy, cls]) => b.text(p, t, { dx, dy, cls: cls || 'lb up gnum' }));
    b.update();
    return b;
  }

  return { add, sub, mul, dot, len, dist, lerp, dir, ang, rot, angle, centroid, meet, foot, line, arc, right, board, refresh, sketch };
})();
window.Geo = Geo;
