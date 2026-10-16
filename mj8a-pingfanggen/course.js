'use strict';
/* 八上 4.1 平方根 · 本课互动：图 4-1 方格纸、x² = a 寻根器（核心）、例 4 地平线。
 * 通用部分见 ../shared/math.js、numline.js；所有图形按坐标精确计算，作图板横纵同比例（正方形就是正方形）。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];
const keep = (b) => { boards.push(b); return b; };
const minus = (v) => NumLine.minus(v);

/* 第 3 页：图 4-1（左 3×4、右 4×5 的长方形及其对角线） */
function initFig41() {
  const b = keep(board($('fig41'), { x: [-0.5, 11.5], y: [-1.3, 5.7], axes: false, ticks: 1, w: 600 }));
  const R1 = { B: [1, 0], C: [4, 0], A: [4, 4] };
  const R2 = { B: [6, 0], C: [10, 0], A: [10, 5] };
  [R1, R2].forEach(({ B, C, A }) => {
    b.poly([B, C, A, [B[0], A[1]]], { cls: 'rect41' });
    b.seg([B, A], { cls: 'diag' });
  });
  const lab = (p, t, dx, dy) => b.text(p, t, { cls: 'fl', dx, dy });
  lab(R1.B, 'B', -18, 22); lab(R1.C, 'C', 4, 22); lab(R1.A, 'A', 6, -4);
  lab(R2.B, "B'", -22, 22); lab(R2.C, "C'", 4, 22); lab(R2.A, "A'", 6, -4);
  lab([2.5, 0], '3', -5, 22); lab([4, 2], '4', 8, 6);
  lab([8, 0], '4', -5, 22); lab([10, 2.5], '5', 8, 6);
}

/* 第 4 页：x² = a 寻根器 */
const SNAP = 0.06; // 离整数不到 0.06 就吸附到整数（a = 4、9、0 的根是整数）
const TOL = 0.05; // a = 2：|x² − 2| < 0.05 算找到（x 取 ±1.40～±1.43），提示里只说“≈ ±1.41”
function initRoot() {
  const s = { a: 4, x: 1, found: new Set(), seenL: false, seenR: false };
  // 横纵同比例：横向 [−4.1, 4.4] 宽 8.5，纵向 [−0.95, 3.45] 高 4.4 → 680 × 352
  const b = keep(NumLine.board($('rootBoard'), { from: -3.5, to: 3.5, y: [-0.95, 3.45], w: 680, h: 352, pad: 0.6 }));
  NumLine.axis(b, { from: -3, to: 3, step: 1, minor: 0.5 });
  const sq = () => {
    const x = s.x;
    return x >= 0 ? [[0, 0], [x, 0], [x, x], [0, x]] : [[x, 0], [0, 0], [0, -x], [x, -x]];
  };
  b.poly(() => (s.x >= 0 ? sq() : []), { cls: 'sqR' });
  b.poly(() => (s.x < 0 ? sq() : []), { cls: 'sqL' });
  b.text(() => (Math.abs(s.x) > 0.6 ? [s.x / 2, Math.abs(s.x) / 2] : null), () => `x² = ${fmt(s.x * s.x, 4)}`, { cls: 'area', dy: 8 });
  // 已找到的点
  [-1, 0, 1].forEach((sg) => {
    const pos = () => (sg === 0 ? 0 : sg * Math.sqrt(Math.max(s.a, 0)));
    b.pt(() => [pos(), 0], { r: 9, cls: 'hit', show: () => s.found.has(sg) });
    b.text(() => (s.found.has(sg) ? [pos(), 0] : null), () => (sg === 0 ? '0' : (s.a === 2 ? `${sg < 0 ? '−' : ''}√2` : minus(sg * Math.sqrt(s.a)))), { cls: 'nl-val', dy: 52 });
  });
  b.drag(() => [s.x, 0], (x) => {
    const v = Math.min(3.4, Math.max(-3.4, x));
    s.x = Math.abs(v - Math.round(v)) < SNAP ? Math.round(v) : Math.round(v * 100) / 100;
    if (s.x < -0.5) s.seenL = true;
    if (s.x > 0.5) s.seenR = true;
    if (Math.abs(s.x * s.x - s.a) < (Number.isInteger(Math.sqrt(Math.abs(s.a))) ? 1e-9 : TOL)) s.found = new Set([...s.found, Math.sign(s.x)]);
  });
  b.onUpdate = () => {
    $('rootX').textContent = minus(s.x);
    $('rootX2').textContent = fmt(s.x * s.x, 4);
    const msg = $('rootMsg');
    const n = s.found.size;
    let ok = false;
    let t;
    if (s.a < 0) {
      ok = s.seenL && s.seenR;
      t = ok ? `左右都找遍了：$x^2$ 最小是 0，从来不是负数——<b>找不到</b>平方等于 $${minus(s.a)}$ 的数。`
        : `现在 $x^2=${fmt(s.x * s.x, 4)}$。把点往左、往右都拖一拖，能让面积等于 $${minus(s.a)}$ 吗？`;
    } else if (s.a === 0) {
      ok = n > 0;
      t = ok ? '只有 $x=0$：$0^2=0$，正方形缩成了一个点。<b>只找到一个</b>。' : '拖动点 $x$，让正方形的面积等于 0。';
    } else if (n === 0) {
      t = `拖动点 $x$，让正方形的面积 $x^2$ 等于 $${s.a}$。`;
    } else if (n === 1) {
      t = `找到一个了！${s.found.has(1) ? '左边' : '右边'}还有吗？`;
    } else {
      ok = true;
      t = s.a === 2
        ? '找到两个：$x\\approx1.41$ 和 $x\\approx-1.41$（再细也只能接近），它们<b>互为相反数</b>。精确值要用新记号——下一页揭晓。'
        : `找到两个：$x=${Math.sqrt(s.a)}$ 和 $x=-${Math.sqrt(s.a)}$，它们<b>互为相反数</b>，两个正方形一样大。`;
    }
    msg.className = `tip feedback ${ok ? 'fb-ok' : (s.a < 0 ? 'fb-warn' : '')}`;
    msg.innerHTML = t;
    tex(msg);
    $('rootTargets').querySelectorAll('[data-a]').forEach((x) => x.classList.toggle('solid', +x.dataset.a === s.a));
  };
  $('rootTargets').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a]');
    if (!btn) return;
    s.a = +btn.dataset.a;
    s.found = new Set();
    s.seenL = false;
    s.seenR = false;
    b.update();
  });
}

/* 第 10 页：例 4 地平线。地球画成半径 1 的圆，h 放大画出；切点、直角按放大后的 h 精确计算 */
const R_KM = 6400;
const hOf = (t) => Math.max(1, Math.round(10 ** (3 * t))); // 滑块 0～1 → 1～1 000 m（对数刻度）
function initEarth() {
  const s = { t: 0.434 };
  const b = keep(board($('earth'), { x: [-1.25, 1.55], y: [0.05, 1.7], axes: false, grid: false, w: 600 }));
  const hd = () => 0.08 + 0.45 * s.t; // 画图用的高度（放大）
  const P = () => [0, 1 + hd()];
  const T = () => { const c = 1 / (1 + hd()); const sn = Math.sqrt(1 - c * c); return [sn, c]; }; // cos φ = R/(R+h)
  b.curve((th) => [Math.cos(th), Math.sin(th)], 0, Math.PI * 2, { cls: 'globe', n: 360 });
  b.seg(() => [[0, 1], P()], { cls: 'tower' });
  b.seg(() => [[0, 0], T()], { cls: 'rad' });
  b.seg(() => [[0, 0], [0, 1]], { cls: 'rad' });
  b.seg(() => [P(), T()], { cls: 'tan' });
  // 切点处直角记号
  b.poly(() => {
    const t = T(); const p = P(); const m = 0.07;
    const u1 = [-t[0], -t[1]]; // 指向圆心（单位向量，因 |OT| = 1）
    const v = [p[0] - t[0], p[1] - t[1]]; const l = Math.hypot(...v); const u2 = [v[0] / l, v[1] / l];
    return [[t[0] + u1[0] * m, t[1] + u1[1] * m], [t[0] + (u1[0] + u2[0]) * m, t[1] + (u1[1] + u2[1]) * m], [t[0] + u2[0] * m, t[1] + u2[1] * m]];
  }, { cls: 'rmark' });
  b.pt(() => T(), { r: 6, cls: 'c1' });
  b.text(() => [0, 1 + hd() / 2], 'h', { cls: 'lb', dx: -22, dy: 6 });
  b.text(() => { const p = P(); const t = T(); return [(p[0] + t[0]) / 2, (p[1] + t[1]) / 2]; }, 'd', { cls: 'lb', dx: 6, dy: -8 });
  b.text([0, 0.5], 'R', { cls: 'lb', dx: -22, dy: 6 });
  b.text(() => T(), '船', { cls: 'lb', dx: 10, dy: 22 });
  b.onUpdate = () => {
    const h = hOf(s.t);
    const d = Math.sqrt(2 * (h / 1000) * R_KM);
    $('hV').textContent = `${h} m`;
    $('dV').textContent = `${fmt(d, 1)} km`;
  };
  slider($('hIn'), (v) => { s.t = v; b.update(); });
}

window.LESSON = {
  init() {
    initFig41();
    initRoot();
    initEarth();
    boards.forEach((b) => b.update());
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
