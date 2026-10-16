'use strict';
/* 课本插件 · 不等式的解集（七下第 11 章用；加载在 math.js、numline.js 之后、course.js 之前，不改动它们）
 * 画法照课本图 11-2、11-3：在端点处竖直升起，再水平画向解集所在的一侧；不含端点画空心圈，含端点画实心点。
 *   const b = NumLine.board(el, { from: -5, to: 5 }); NumLine.axis(b, { from: -5, to: 5 });
 *   Ineq.ray(b, { a: 3, op: '>', h: 0.8, from: -5, to: 5 });      // x > 3；参数都可以是函数（拖动后自动刷新）
 *   Ineq.both(sets) → 公共部分 { lo, loIn, hi, hiIn, empty }；Ineq.texOf(part) → "136\le x\le 170"
 *   Ineq.frac(b, 2/3, '2', '3') 在 2/3 处标竖排分数刻度。op 取 '>' '>=' '<' '<='。 */
const Ineq = (() => {
  const V = (v) => (typeof v === 'function' ? v() : v);
  const OFF = [[-1e4, -1e4], [-1e4, -1e4]]; // 隐藏线段：移到画板裁剪区外
  const TEX = { '>': '>', '>=': '\\ge', '<': '<', '<=': '\\le' };
  const strict = (op) => op.length === 1;
  const right = (op) => op[0] === '>';
  const num = (v) => NumLine.minus(v);

  /** 一个不等式 x op a 的解集。o: { a, op, h, from, to, cls, show } */
  function ray(b, o) {
    const on = () => o.show === undefined || !!V(o.show);
    const cls = o.cls || 'iq-ray';
    const end = () => (right(V(o.op)) ? V(o.to) : V(o.from));
    b.seg(() => (on() ? [[V(o.a), 0], [V(o.a), V(o.h)]] : OFF), { cls });
    b.seg(() => (on() ? [[V(o.a), V(o.h)], [end(), V(o.h)]] : OFF), { cls });
    b.pt(() => [V(o.a), 0], { show: () => on() && !strict(V(o.op)), r: o.r || 5.5, cls: `iq-dot ${o.dot || ''}` });
    b.pt(() => [V(o.a), 0], { show: () => on() && strict(V(o.op)), r: o.r || 5.5, hollow: true, cls: `iq-dot ${o.dot || ''}` });
  }

  /** 若干个 x op a 的公共部分 */
  function both(sets) {
    let lo = -Infinity; let loIn = false; let hi = Infinity; let hiIn = false;
    sets.forEach(({ a, op }) => {
      if (right(op)) {
        if (a > lo || (a === lo && strict(op))) { lo = a; loIn = !strict(op); }
      } else if (a < hi || (a === hi && strict(op))) { hi = a; hiIn = !strict(op); }
    });
    const empty = lo > hi || (lo === hi && !(loIn && hiIn));
    return { lo, loIn, hi, hiIn, empty };
  }

  /** 公共部分的 TeX 写法（课本：-2 < x ≤ 2；x ≤ -1；无解） */
  function texOf(p, x = 'x', f = num) {
    if (p.empty) return '\\text{无解}';
    const L = Number.isFinite(p.lo);
    const H = Number.isFinite(p.hi);
    const n = (v) => f(v).replace('−', '-');
    if (L && H && p.lo === p.hi) return `${x}=${n(p.lo)}`;
    if (L && H) return `${n(p.lo)}${p.loIn ? '\\le ' : '<'}${x}${p.hiIn ? '\\le ' : '<'}${n(p.hi)}`;
    if (L) return `${x}${p.loIn ? '\\ge ' : '>'}${n(p.lo)}`;
    if (H) return `${x}${p.hiIn ? '\\le ' : '<'}${n(p.hi)}`;
    return `${x}\\text{ 为任意数}`;
  }

  /** 在数轴上给公共部分涂色（粗线 + 端点），o: { part: () => both(...), from, to, cls } */
  function band(b, o) {
    const p = () => V(o.part);
    b.seg(() => {
      const q = p();
      if (q.empty) return OFF;
      return [[Math.max(q.lo, V(o.from)), 0], [Math.min(q.hi, V(o.to)), 0]];
    }, { cls: o.cls || 'iq-band' });
  }

  /** 在任意位置 v 加刻度与竖排分数标签（负分数在分数线左边加“−”） */
  function frac(b, v, top, bot, o = {}) {
    b.seg([[v, 0], [v, 0.16]], { cls: o.tcls || 'iq-tick' });
    const dy = o.dy || 0;
    b.text([v, 0], top, { cls: 'iq-fr', dy: 24 + dy });
    b.text([v, 0], '—', { cls: 'iq-fr bar', dy: 31 + dy });
    b.text([v, 0], bot, { cls: 'iq-fr', dy: 47 + dy });
    if (v < 0) b.text([v, 0], '−', { cls: 'iq-fr', dx: -14, dy: 35 + dy });
  }

  /** 单独一个刻度 + 数字（不在整数步长上的端点，如 136、170） */
  function tick(b, v, label, o = {}) {
    b.seg([[v, 0], [v, 0.16]], { cls: o.tcls || 'iq-tick' });
    b.text([v, 0], label ?? num(v), { cls: o.cls || 'nl-num', dy: o.dy || 26, dx: o.dx || 0 });
  }

  /** 课本插图式数轴：只在 marks 处画刻度和数字（课本图 11-2 只标 0 和端点）。marks 元素为数或 [数, 标签] */
  function axis(b, o) {
    const left = o.from - (o.lead ?? 0.45);
    const right = o.to + (o.tail ?? 0.75);
    b.seg([[left, 0], [right, 0]], { cls: 'iq-ax' });
    const ax = 16 / (b.X(1) - b.X(0));
    const ay = 7 / (b.Y(0) - b.Y(1));
    b.poly([[right + ax * 0.3, 0], [right - ax * 0.7, ay], [right - ax * 0.7, -ay]], { cls: 'iq-arrow' });
    (o.marks || []).forEach((m) => {
      const [v, t] = Array.isArray(m) ? m : [m, num(m)];
      if (t && typeof t === 'object') frac(b, v, t[0], t[1]);
      else tick(b, v, t);
    });
    return b;
  }

  return { ray, both, texOf, band, frac, tick, axis, TEX, strict, right };
})();
window.Ineq = Ineq;
