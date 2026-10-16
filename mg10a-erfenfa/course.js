'use strict';
/* 高一上 8.1 二分法与求方程近似解 · 本课互动：零点图、拖端点看异号、定理辨析小图、二分法器（四个方程，精确到 0.1 / 0.01）、
 * 例 3 / 例 4 交点图、“为什么能停”数轴。通用部分见 ../shared/math.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const sq = (x) => x * x - 2 * x - 1;
const Z1 = 1 - Math.SQRT2;
const Z2 = 1 + Math.SQRT2;

/** 横轴不含原点时不能用 board 自带坐标轴（会把左端画成 y 轴、标 O），改为手画 x 轴与刻度 */
function bareAxis(b, [x0, x1], ticks) {
  b.seg([[x0, 0], [x1, 0]], { cls: 'ax' });
  ticks.forEach((t) => { b.pt([t, 0], { r: 3 }); b.text([t, 0], fmt(t, 4), { cls: 'tk', dx: -10, dy: 22 }); });
}

/* 第 3 页：零点 */
function initZero() {
  const b = board($('zero'), { x: [-1.5, 3.5], y: [-2.5, 3], w: 520 });
  b.fn(sq);
  [Z1, Z2].forEach((z) => { b.pt([z, 0], { cls: 'c2', r: 8 }); b.text([z, 0], fmt(z), { cls: 'lb up', dx: -18, dy: -14 }); });
  b.text([2.4, 2.6], 'y=x²−2x−1', { cls: 'lb up', dx: -60 });
  b.update();
}

/* 第 4 页：拖动 a、b，看 f(a)f(b) 的符号 */
function initSign() {
  const s = { a: 2, b: 3 };
  const b = board($('sign'), { x: [-1.5, 4], y: [-2.5, 4], w: 520 });
  b.fn(sq);
  b.seg(() => [[s.a, 0], [s.a, sq(s.a)]], { cls: 'dash' });
  b.seg(() => [[s.b, 0], [s.b, sq(s.b)]], { cls: 'dash' });
  const ptCls = (x) => (sq(x) < 0 ? 'neg' : 'pos');
  const pa = b.pt(() => [s.a, sq(s.a)], { r: 8 });
  const pb = b.pt(() => [s.b, sq(s.b)], { r: 8 });
  const snap = (x) => Math.round(Math.min(3.9, Math.max(-1.4, x)) * 10) / 10;
  b.drag(() => [s.a, 0], (x) => { s.a = Math.min(snap(x), s.b - 0.1); });
  b.drag(() => [s.b, 0], (x) => { s.b = Math.max(snap(x), s.a + 0.1); });
  b.text(() => [s.a, 0], 'a', { dx: -6, dy: 34 });
  b.text(() => [s.b, 0], 'b', { dx: -6, dy: 34 });
  b.onUpdate = () => {
    pa.setAttribute('class', `pt ${ptCls(s.a)}`); pb.setAttribute('class', `pt ${ptCls(s.b)}`);
    const [fa, fb] = [sq(s.a), sq(s.b)];
    const k = [Z1, Z2].filter((z) => z > s.a && z < s.b).length;
    const sgn = (v) => (v > 0 ? '\\gt 0' : v < 0 ? '\\lt 0' : '=0');
    const msg = $('signMsg');
    const head = `$f(${fmt(s.a)})=${fmt(fa)}$，$f(${fmt(s.b)})=${fmt(fb)}$，$f(a)f(b)${sgn(fa * fb)}$。`;
    msg.innerHTML = head + (fa * fb < 0 ? `<br>两端异号：图象穿过 $x$ 轴，$(a,b)$ 内<b>有零点</b>。` : `<br>两端不异号：定理用不上。（这里 $(a,b)$ 内实际有 ${k} 个零点）`);
    msg.className = `tip feedback ${fa * fb < 0 ? 'fb-ok' : 'fb-warn'}`;
    tex(msg);
  };
  b.update();
}

/* 第 5 页：三张辨析小图 */
function initMinis() {
  const b1 = board($('d1'), { x: [-1.6, 1.6], y: [-3, 3], w: 300, h: 190, ticks: 1 });
  b1.fn((x) => 1 / x);
  b1.pt([-1, -1], { cls: 'c2', r: 6 }); b1.pt([1, 1], { cls: 'c2', r: 6 });
  b1.update();
  const b2 = board($('d2'), { x: [-1.6, 1.6], y: [-0.6, 2.4], w: 300, h: 190, ticks: 1 });
  b2.fn((x) => x * x);
  b2.pt([-1, 1], { cls: 'c2', r: 6 }); b2.pt([1, 1], { cls: 'c2', r: 6 }); b2.pt([0, 0], { r: 6 });
  b2.update();
  const b3 = board($('d3'), { x: [-2.3, 2.3], y: [-6.5, 6.5], w: 300, h: 190, ticks: [1, 3] });
  b3.fn((x) => x ** 3 - x);
  b3.pt([-2, -6], { cls: 'c2', r: 6 }); b3.pt([2, 6], { cls: 'c2', r: 6 });
  [-1, 0, 1].forEach((z) => b3.pt([z, 0], { r: 5 }));
  b3.update();
}

/* 第 7 页：(2, 3) 附近放大 */
function initZoom() {
  const b = board($('zoom'), { x: [1.9, 3.1], y: [-1.3, 2.3], w: 480, h: 420, axes: false, ticks: [0.25, 0.5] });
  bareAxis(b, [1.9, 3.1], [2, 2.5, 3]);
  b.fn(sq);
  [[2, 'f(2)<0'], [2.5, 'f(2.5)>0'], [3, 'f(3)>0']].forEach(([x, t]) => {
    b.seg([[x, 0], [x, sq(x)]], { cls: 'dash' });
    b.pt([x, sq(x)], { cls: sq(x) < 0 ? 'neg' : 'pos', r: 7 });
    b.text([x, sq(x)], t, { cls: 'lb up', dx: x === 3 ? -90 : 10, dy: sq(x) < 0 ? 26 : -8 });
  });
  b.pt([Z2, 0], { hollow: true, r: 6 });
  b.text([Z2, 0], 'x₁', { dx: -8, dy: -12 });
  b.update();
}

/* 第 8 页：二分法器 */
const BS_FNS = [
  { key: 'q', label: 'x^2-2x-1=0', f: sq, a: 2, b: 3 },
  { key: 'lg', label: '\\lg x+x-3=0', f: (x) => Math.log10(x) + x - 3, a: 2, b: 3 },
  { key: 'sin', label: 'x+\\sin x-1=0', f: (x) => x + Math.sin(x) - 1, a: 0, b: 1 },
  { key: 'cub', label: 'x^3+3x-1=0', f: (x) => x ** 3 + 3 * x - 1, a: 0, b: 1 },
];
const num = (v) => String(+v.toFixed(8));
const sgnTex = (v) => (v > 0 ? '\\gt 0' : v < 0 ? '\\lt 0' : '=0');

function initBisect() {
  const s = { fn: BS_FNS[0], p: 0.1, rows: [], a: 2, b: 3, done: false, exact: null };
  let plot = null;
  const near = (v) => Math.round(v / s.p);
  const approx = (v) => (near(v) * s.p).toFixed(s.p === 0.1 ? 1 : 2);
  const finished = () => s.exact !== null || near(s.a) === near(s.b);

  const buildPlot = () => {
    const { f, a, b } = s.fn;
    const w = b - a;
    const [x0, x1] = [a - 0.15 * w, b + 0.15 * w];
    const ys = Array.from({ length: 101 }, (_, i) => f(x0 + (x1 - x0) * i / 100));
    const [lo, hi] = [Math.min(0, ...ys), Math.max(0, ...ys)];
    const pad = (hi - lo) * 0.12;
    $('bsPlot').innerHTML = '';
    plot = board($('bsPlot'), { x: [x0, x1], y: [lo - pad, hi + pad], w: 520, h: 300, axes: false, grid: false });
    plot.poly(() => [[s.a, lo - pad], [s.b, lo - pad], [s.b, hi + pad], [s.a, hi + pad]], { cls: 'band' });
    bareAxis(plot, [x0, x1], [a, (a + b) / 2, b]);
    plot.fn(f, { from: x0, to: x1 });
    plot.pt(() => [s.a, f(s.a)], { cls: 'neg', r: 6 });
    plot.pt(() => [s.b, f(s.b)], { cls: 'pos', r: 6 });
    plot.update();
  };

  const drawLine = () => {
    const { a: a0, b: b0 } = s.fn;
    const W = 520;
    const X = (x) => 20 + (x - a0) / (b0 - a0) * (W - 40);
    const ivs = [[a0, b0], ...s.rows.map((r) => [r.a, r.b])].slice(-6);
    const rowH = 30;
    const body = ivs.map(([a, b], i) => {
      const y = 16 + i * rowH;
      return `<line x1="${X(a0)}" y1="${y}" x2="${X(b0)}" y2="${y}" class="nl"/><line x1="${X(a)}" y1="${y}" x2="${X(b)}" y2="${y}" class="nlh"/>`
        + `<text x="${X(a)}" y="${y + 15}" class="nt" text-anchor="end">${num(a)}</text><text x="${X(b)}" y="${y + 15}" class="nt">${num(b)}</text>`;
    }).join('');
    $('bsLine').innerHTML = `<svg viewBox="0 0 ${W} ${16 + ivs.length * rowH}">${body}</svg>`;
  };

  const render = () => {
    const { f } = s.fn;
    const first = `<tr><td>—</td><td>$f(${num(s.fn.a)})${sgnTex(f(s.fn.a))},\\ f(${num(s.fn.b)})${sgnTex(f(s.fn.b))}\\Rightarrow x_0\\in(${num(s.fn.a)},\\ ${num(s.fn.b)})$</td></tr>`;
    const rows = s.rows.map((r) => `<tr><td>$${num(r.c)}$</td><td>${r.exact ? `$f(${num(r.c)})=0$` : `$f(${num(r.a)})\\lt 0,\\ f(${num(r.b)})\\gt 0\\Rightarrow x_0\\in(${num(r.a)},\\ ${num(r.b)})$`}</td></tr>`).join('');
    $('bsTab').innerHTML = `<table class="mtab small"><tr><th>中点 $c$</th><th>判断（课本写法）</th></tr>${first}${rows}</table>`;
    tex($('bsTab'));
    $('bsTab').scrollTop = $('bsTab').scrollHeight;
    const msg = $('bsMsg');
    if (s.exact !== null) msg.innerHTML = `$f(${num(s.exact)})=0$：${num(s.exact)} 就是方程的<b>精确解</b>。`;
    else if (finished()) msg.innerHTML = `两端 ${num(s.a)} 与 ${num(s.b)} 精确到 ${s.p} 的近似值都是 <b>${approx(s.a)}</b>，所以 $x_0\\approx ${approx(s.a)}$。共取中点 ${s.rows.length} 次。`;
    else msg.innerHTML = `当前区间 $(${num(s.a)},\\ ${num(s.b)})$，长度 ${num(s.b - s.a)}；两端精确到 ${s.p} 分别是 ${approx(s.a)}、${approx(s.b)}，还不相同。`;
    msg.className = `tip feedback ${finished() ? 'fb-ok' : ''}`;
    tex(msg);
    $('bsStep').disabled = finished();
    drawLine();
    if (plot) plot.update();
    document.querySelectorAll('[data-p]').forEach((btn) => btn.classList.toggle('solid', +btn.dataset.p === s.p));
    $('bsFn').querySelectorAll('.btn').forEach((btn) => btn.classList.toggle('solid', btn.dataset.k === s.fn.key));
  };

  const reset = () => { s.rows = []; s.a = s.fn.a; s.b = s.fn.b; s.exact = null; render(); };
  // 课本的写法默认 f(a) < 0 < f(b)；四个方程都满足
  const step = () => {
    if (finished()) return;
    const c = (s.a + s.b) / 2;
    const fc = s.fn.f(c);
    if (fc === 0) { s.exact = c; s.rows.push({ c, a: s.a, b: s.b, exact: true }); render(); return; }
    if (fc > 0) s.b = c; else s.a = c;
    s.rows.push({ c, a: s.a, b: s.b });
    render();
  };

  $('bsFn').innerHTML = BS_FNS.map((o) => `<button type="button" class="btn" data-k="${o.key}">$${o.label}$</button>`).join('');
  tex($('bsFn'));
  $('bsFn').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.fn = BS_FNS.find((o) => o.key === btn.dataset.k);
    buildPlot(); reset();
  });
  document.querySelectorAll('[data-p]').forEach((btn) => btn.addEventListener('click', () => { s.p = +btn.dataset.p; reset(); }));
  $('bsStep').addEventListener('click', step);
  $('bsReset').addEventListener('click', reset);
  buildPlot();
  reset();
  return () => plot && plot.update();
}

/** 二分到很高精度，求两条曲线交点（作图用） */
function rootOf(f, a, b) {
  let [lo, hi] = [a, b];
  for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; }
  return (lo + hi) / 2;
}

/* 第 10、11 页：两条曲线的交点 */
function initCross(id, opt, g1, g2, from, labels) {
  const b = board($(id), opt);
  b.fn(g1, { cls: 'c1', from });
  b.fn(g2, { cls: 'c2' });
  const r = rootOf((x) => g1(x) - g2(x), ...labels.range);
  b.seg([[r, 0], [r, g1(r)]], { cls: 'dash' });
  b.pt([r, g1(r)], { r: 7 });
  b.text([r, g1(r)], labels.root, { cls: 'lb up', dx: 12, dy: 28 });
  labels.names.forEach(([p, t]) => b.text(p, t, { cls: 'lb up' }));
  b.update();
}

/* 第 12 页：(2.375, 2.4375) ⊆ [2.35, 2.45) */
function initWhy() {
  const b = board($('why'), { x: [2.28, 2.52], y: [-1, 1], w: 560, h: 110, axes: false, grid: false });
  b.poly([[2.35, -0.45], [2.45, -0.45], [2.45, 0.45], [2.35, 0.45]], { cls: 'band' });
  b.seg([[2.28, 0], [2.52, 0]], { cls: 'ax' });
  [2.3, 2.35, 2.4, 2.45, 2.5].forEach((t) => { b.seg([[t, -0.12], [t, 0.12]], { cls: 'ax' }); b.text([t, 0], String(t), { cls: 'tk', dx: -14, dy: 34 }); });
  b.seg([[2.375, 0], [2.4375, 0]], { cls: 'c2' });
  b.pt([2.375, 0], { hollow: true, r: 6 }); b.pt([2.4375, 0], { hollow: true, r: 6 });
  b.text([2.36, 0.62], '精确到 0.1 是 2.4 的数', { cls: 'lb up' });
  b.update();
}

let redraw = () => {};
window.LESSON = {
  init() {
    initZero();
    initSign();
    initMinis();
    initZoom();
    redraw = initBisect();
    initCross('ex3', { x: [-0.4, 5.6], y: [-1.6, 4.2], w: 520 }, (x) => (x > 0 ? Math.log10(x) : NaN), (x) => 3 - x, 0.01,
      { range: [2, 3], root: 'x₁≈2.59', names: [[[4.3, 0.9], 'y=lg x'], [[1.0, 2.7], 'y=3−x']] });
    initCross('ex4', { x: [-1.6, 3.8], y: [-1.5, 1.9], w: 520 }, Math.sin, (x) => 1 - x, -1.6,
      { range: [0, 1], root: 'x₀≈0.51', names: [[[2.2, 1.25], 'y=sin x'], [[-1.45, 2.2], 'y=1−x']] });
    initWhy();
  },
  onRender(slide) { if (slide.contains($('bsPlot'))) requestAnimationFrame(redraw); },
};
