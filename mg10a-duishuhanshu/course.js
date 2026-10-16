'use strict';
/* 高一上 6.3 对数函数 · 本课互动：沿 y = x 翻折（逐点对称动画）、性质小图、反函数图、例 3 平移、例 4 对称作图、
 * “底数藏在 y = 1 的交点里”。通用部分见 ../shared/math.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const log = (a, x) => Math.log(x) / Math.log(a);
const FOLD_MS = 1400;

/* 第 5 页：沿 y = x 翻折 */
const FOLD_BASES = [[2, '2'], [0.5, '\\frac12'], [3, '3'], [1 / 3, '\\frac13']];
function initFold() {
  const s = { a: 2, m: 1, t: 0 };
  const Y_MAX = 5.8;
  const b = board($('fold'), { x: [-2.5, 6], y: [-2.5, 6], w: 520 });
  b.seg([[-2.5, -2.5], [6, 6]], { cls: 'dash' });
  b.text([4.6, 5.4], 'y=x', { cls: 'lb up' });
  b.fn((x) => s.a ** x, { cls: 'c1' });
  // 翻折中的曲线：每个点 (u, a^u) 沿垂直于 y = x 的线段走向 (a^u, u)，t = 1 时恰为 y = log_a x
  const moving = b.curve((u) => {
    const v = s.a ** u;
    return [(1 - s.t) * u + s.t * v, (1 - s.t) * v + s.t * u];
  }, -2.5, 6, { cls: 'c2', n: 500 });
  const P = () => [s.m, s.a ** s.m];
  const P2 = () => [s.a ** s.m, s.m];
  b.seg(() => [P(), P2()], { cls: 'dash' });
  b.pt(() => { const [x, y] = P(); return [(x + y) / 2, (x + y) / 2]; }, { r: 6, cls: 'c2' });
  b.pt(P2, { hollow: true, r: 8 });
  b.text(P, 'P', { dx: -24, dy: -10 });
  b.text(P2, "P′", { dx: 10, dy: 26 });
  b.text(() => { const [x, y] = P(); return [(x + y) / 2, (x + y) / 2]; }, 'M', { dx: 10, dy: -6 });
  b.drag(P, (x) => {
    const hi = log(s.a, Y_MAX);
    const [lo, up] = s.a > 1 ? [-2.4, hi] : [hi, 2.4];
    s.m = Math.round(Math.min(up, Math.max(lo, x)) * 20) / 20;
  });
  b.onUpdate = () => {
    moving.style.display = s.t > 0 ? '' : 'none';
    const [m, n] = P();
    const msg = $('foldMsg');
    msg.innerHTML = `$P(${fmt(m)},\\ ${fmt(n)})$ 在 $y=a^x$ 上，$P'(${fmt(n)},\\ ${fmt(m)})$ 在 $y=\\log_ax$ 上：横纵坐标对调。${s.t >= 1 ? '<br>橙色曲线就是 $y=\\log_ax$ 的图象。' : ''}`;
    tex(msg);
    $('foldBase').querySelectorAll('.btn').forEach((btn) => btn.classList.toggle('solid', +btn.dataset.a === s.a));
  };
  let raf = 0;
  const animate = (to) => {
    cancelAnimationFrame(raf);
    const from = s.t;
    const t0 = performance.now();
    const tick = (now) => {
      const u = Math.min(1, (now - t0) / FOLD_MS);
      const e = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
      s.t = from + (to - from) * e;
      b.update();
      if (u < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  $('foldBase').innerHTML = FOLD_BASES.map(([a, l]) => `<button type="button" class="btn" data-a="${a}">$a=${l}$</button>`).join('');
  tex($('foldBase'));
  $('foldBase').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a]');
    if (!btn) return;
    s.a = +btn.dataset.a; s.m = s.a > 1 ? 1 : -1; s.t = 0;
    b.update();
  });
  $('foldGo').addEventListener('click', () => animate(1));
  $('foldBack').addEventListener('click', () => animate(0));
  b.update();
}

/* 第 6 页：表 6-3-1 的两幅小图 */
function initLogFig(id, a) {
  const b = board($(id), { x: [-0.6, 4.6], y: [-2.4, 2.4], w: 340, h: 200, ticks: [1, 1], tickLabels: false, grid: false });
  b.seg([[1, -2.4], [1, 2.4]], { cls: 'dash' });
  b.fn((x) => (x > 0 ? log(a, x) : NaN), { cls: 'c1', from: 0.005 });
  b.pt([1, 0], { r: 6 });
  b.text([1, 0], '1', { cls: 'lb up', dx: 6, dy: a > 1 ? 24 : -10 });
  b.text([0, 0], 'O', { cls: 'lb', dx: -22, dy: 24 });
  b.update();
}

/* 第 7 页：y = 3x + 6 与它的反函数 */
function initInverse() {
  const b = board($('inv'), { x: [-7, 5], y: [-7, 5], w: 440 });
  b.seg([[-7, -7], [5, 5]], { cls: 'dash' });
  b.fn((x) => 3 * x + 6, { cls: 'c1' });
  b.fn((x) => x / 3 - 2, { cls: 'c2' });
  b.seg([[-1, 3], [3, -1]], { cls: 'thin' });
  b.pt([-1, 3], { r: 7 }); b.pt([3, -1], { hollow: true, r: 7 });
  b.text([-1, 3], '(−1, 3)', { cls: 'lb up', dx: -80, dy: -8 });
  b.text([3, -1], '(3, −1)', { cls: 'lb up', dx: 8, dy: 26 });
  b.update();
}

/* 第 10 页：例 3 平移 */
function initShift3() {
  const s = { on: false };
  const b = board($('sh3'), { x: [-2.6, 5], y: [-2.6, 2.6], w: 560 });
  b.seg([[0, -2.6], [0, 2.6]], { cls: 'dash' });
  const asym = b.seg([[-2, -2.6], [-2, 2.6]], { cls: 'dash' });
  b.fn((x) => (x > 0 ? log(3, x) : NaN), { cls: 'thin', from: 0.001 });
  const moved = b.fn((x) => (x > -2 ? log(3, x + 2) : NaN), { cls: 'c1', from: -1.999 });
  const arrow = b.seg([[3, 1], [1, 1]], { cls: 'c2' });
  const pts = [b.pt([1, 1], { cls: 'c2', r: 7 }), b.pt([3, 1], { r: 7 })];
  b.text([4.2, 1.45], 'y=log₃x', { cls: 'lb up' });
  const lb = b.text([-1.9, 1.75], 'y=log₃(x+2)', { cls: 'lb up' });
  b.onUpdate = () => { [asym, moved, arrow, lb, pts[0]].forEach((n) => { n.style.display = s.on ? '' : 'none'; }); };
  $('sh3Go').addEventListener('click', () => { s.on = !s.on; b.update(); });
  b.update();
}

/* 第 11 页：例 4 y = log2|x| */
function initAbs() {
  const s = { on: false };
  const b = board($('absx'), { x: [-4.5, 4.5], y: [-3, 3], w: 560 });
  b.fn((x) => (x > 0 ? log(2, x) : NaN), { cls: 'c1', from: 0.001 });
  const c2 = b.fn((x) => (x < 0 ? log(2, -x) : NaN), { cls: 'c2', to: -0.001 });
  b.text([3.4, 2.2], 'C₁', { cls: 'lb up' });
  const l2 = b.text([-3.9, 2.2], 'C₂', { cls: 'lb up' });
  b.onUpdate = () => { [c2, l2].forEach((n) => { n.style.display = s.on ? '' : 'none'; }); };
  $('c2Go').addEventListener('click', () => { s.on = !s.on; b.update(); });
  b.update();
}

/* 第 12 页：底数 = 曲线与 y = 1 交点的横坐标 */
const BASES = [[0.5, 'C₁'], [1 / 3, 'C₂'], [3, 'C₃'], [2, 'C₄']];
function initBases() {
  const s = { on: false };
  const b = board($('bases'), { x: [-0.4, 4.6], y: [-2.6, 2.6], w: 520 });
  BASES.forEach(([a, name], i) => {
    b.fn((x) => (x > 0 ? log(a, x) : NaN), { cls: ['c1', 'c3', 'c2', 'thick4'][i], from: 0.001 });
    b.text([3.95, log(a, 3.95)], name, { cls: 'lb up', dx: 6, dy: a > 1 ? -6 : 22 });
  });
  const line = b.seg([[-0.4, 1], [4.6, 1]], { cls: 'dash' });
  const marks = BASES.flatMap(([a]) => [b.pt([a, 1], { cls: 'c2', r: 7 }), b.seg([[a, 0], [a, 1]], { cls: 'thin' })]);
  const labels = [[1 / 3, '1/3', -32], [0.5, '1/2', 4], [2, '2', -6], [3, '3', -6]].map(([a, t, dx]) => b.text([a, 0], t, { cls: 'lb up', dx, dy: 26 }));
  b.onUpdate = () => { [line, ...marks, ...labels].forEach((n) => { n.style.display = s.on ? '' : 'none'; }); };
  $('y1Go').addEventListener('click', () => { s.on = !s.on; b.update(); });
  b.update();
}

window.LESSON = {
  init() {
    initFold();
    initLogFig('lA', 2);
    initLogFig('lB', 0.5);
    initInverse();
    initShift3();
    initAbs();
    initBases();
  },
};
