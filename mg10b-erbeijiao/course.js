'use strict';
/* 高一下 10.2 二倍角的三角函数 · 本课互动：单位圆中的二倍角几何、图象重合检验、降幂图象、例 5 半圆截矩形。通用部分见 ../shared/math.js */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
/** 圆弧：圆心 c、半径 r、从角 a0 到 a1（弧度，可为函数） */
const arc = (b, c, r, a0, a1, o) => b.curve((t) => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)], a0, a1, o);
/** 拖动点 → 圆心角（度，取整），限制在 [lo, hi] */
const dragDeg = (x, y, c, lo, hi) => clamp(Math.round(Math.atan2(y - c[1], x - c[0]) / DEG), lo, hi);

/* 第 5 页：单位圆，直径 AB，圆周角 ∠PAB = α，圆心角 ∠POB = 2α */
function initDouble() {
  const A = [-1, 0];
  const B = [1, 0];
  const O = [0, 0];
  const s = { a: 30 }; // α（度）
  const P = () => [Math.cos(2 * s.a * DEG), Math.sin(2 * s.a * DEG)];
  const H = () => [P()[0], 0];
  const b = board($('dbl'), { x: [-1.32, 1.32], y: [-0.62, 1.2], axes: false, grid: false, w: 640 });
  arc(b, O, 1, 0, Math.PI, { cls: 'thin' });
  b.seg([A, B], { cls: 'thin' });
  b.seg(() => [O, P()], { cls: 'dash' });
  b.seg(() => [A, P()], { cls: 'c1' });
  b.seg(() => [P(), B], { cls: 'c3' });
  b.seg(() => [P(), H()], { cls: 'c2' });
  // 横轴下方：H 的横坐标 = cos 2α（从 O 量起，带符号）
  b.seg(() => [[0, -0.2], [H()[0], -0.2]], { cls: 'c2 xh' });
  b.seg([[0, -0.14], [0, -0.26]], { cls: 'thin' });
  b.text(() => [H()[0] / 2, -0.2], () => `cos 2α = ${fmt(H()[0], 3)}`, { cls: 'lb sm', dy: 30 });
  // 直角记号：H 处、P 处（∠APB = 90°）
  const RM = 0.07;
  const sq = (v, u1, u2) => [[v[0] + u1[0] * RM, v[1] + u1[1] * RM], [v[0] + (u1[0] + u2[0]) * RM, v[1] + (u1[1] + u2[1]) * RM], [v[0] + u2[0] * RM, v[1] + u2[1] * RM]];
  const unit = (p, q) => { const d = dist(p, q); return [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; };
  const sqH = () => sq(H(), [0, 1], [P()[0] >= 0 ? 1 : -1, 0]);
  const sqP = () => sq(P(), unit(P(), A), unit(P(), B));
  [sqH, sqP].forEach((f) => { b.seg(() => f().slice(0, 2), { cls: 'thin' }); b.seg(() => f().slice(1), { cls: 'thin' }); });
  // 角：A 处 α，O 处 2α
  arc(b, A, 0.26, 0, () => s.a * DEG, { cls: 'c1 ang' });
  arc(b, O, 0.15, 0, () => 2 * s.a * DEG, { cls: 'c2 ang' });
  b.text(() => [A[0] + 0.36 * Math.cos(s.a * DEG / 2), 0.36 * Math.sin(s.a * DEG / 2)], 'α', { dx: -4, dy: 8 });
  b.text(() => [0.25 * Math.cos(Math.min(s.a, 30) * DEG), 0.25 * Math.sin(Math.min(s.a, 30) * DEG)], '2α', { dx: -8, dy: 8 }); // 标在弧内靠右，α 大时不压到 PB
  [[A, 'A', -26, 8], [B, 'B', 10, 8], [O, 'O', -8, 28]].forEach(([p, n, dx, dy]) => { b.pt(p); b.text(p, n, { dx, dy }); });
  b.pt(H, { r: 4 });
  b.text(H, 'H', { dx: 6, dy: 26 });
  b.text(P, 'P', { dx: 12, dy: -10 });
  b.drag(P, (x, y) => { s.a = clamp(Math.round(dragDeg(x, y, O, 2, 178) / 2), 1, 89); });
  b.onUpdate = () => {
    // 两列数值分别从“图上量”与“公式算”得到
    const p = P();
    const h = H();
    const ap = dist(A, p);
    const pb = dist(p, B);
    const ra = s.a * DEG;
    const rows = [
      [`α = ${s.a}°`, '图上量', '公式算'],
      ['sin 2α', `PH = ${fmt(dist(p, h), 4)}`, `2sinα cosα = ${fmt(2 * Math.sin(ra) * Math.cos(ra), 4)}`],
      ['cos 2α', `x_H = ${fmt(h[0], 4)}`, `2cos²α−1 = ${fmt(2 * Math.cos(ra) ** 2 - 1, 4)}<br>1−2sin²α = ${fmt(1 - 2 * Math.sin(ra) ** 2, 4)}`],
      ['AP，PB', `${fmt(ap, 4)}，${fmt(pb, 4)}`, `2cosα，2sinα = ${fmt(2 * Math.cos(ra), 4)}，${fmt(2 * Math.sin(ra), 4)}`],
    ];
    $('dblTab').innerHTML = rows.map((r, i) => `<tr>${r.map((c) => (i ? `<td>${c}</td>` : `<th>${c}</th>`)).join('')}</tr>`).join('');
  };
  b.update();
}

/* 第 6 页：y = sin 2x 与候选式子的图象，在 [0, 2π] 上判断是否恒等 */
const CANDS = [
  { label: '$y=2\\sin x\\cos x$', expr: '2\\sin x\\cos x', f: (x) => 2 * Math.sin(x) * Math.cos(x) },
  { label: '$y=2\\sin x$', expr: '2\\sin x', f: (x) => 2 * Math.sin(x) },
  { label: '$y=\\sin x\\cos x$', expr: '\\sin x\\cos x', f: (x) => Math.sin(x) * Math.cos(x) },
  { label: '$y=\\cos^2x-\\sin^2x$', expr: '\\cos^2x-\\sin^2x', f: (x) => Math.cos(x) ** 2 - Math.sin(x) ** 2 },
];
const TAU = 2 * Math.PI;
const SAMPLES = 720;
const maxDiff = (f, g) => Math.max(...Array.from({ length: SAMPLES + 1 }, (_, i) => Math.abs(f(i * TAU / SAMPLES) - g(i * TAU / SAMPLES))));
/** 横轴标 π/2 的倍数 */
function piTicks(b, y = 0) {
  ['π/2', 'π', '3π/2', '2π'].forEach((t, i) => {
    const x = (i + 1) * Math.PI / 2;
    b.seg([[x, y - 0.06], [x, y + 0.06]], { cls: 'thin' });
    b.text([x, y], t, { cls: 'tk pi', dx: -10, dy: 20 });
  });
}
function initCompare() {
  const target = (x) => Math.sin(2 * x);
  const s = { x: Math.PI / 6, cur: CANDS[0] };
  const b = board($('cmp'), { x: [-0.4, 6.75], y: [-2.3, 2.3], w: 640, ticks: [0, 1] });
  piTicks(b);
  b.fn(target, { from: 0, to: TAU });
  b.fn((x) => s.cur.f(x), { from: 0, to: TAU, cls: 'c2 dsh' });
  b.seg(() => [[s.x, 0], [s.x, target(s.x)]], { cls: 'dash' });
  b.pt(() => [s.x, target(s.x)], { cls: 'c1f', r: 7 });
  b.pt(() => [s.x, s.cur.f(s.x)], { cls: 'c2', r: 6 });
  b.drag(() => [s.x, 0], (x) => { s.x = Math.round(clamp(x, 0, TAU) / (Math.PI / 36)) * (Math.PI / 36); });
  b.onUpdate = () => {
    const d = maxDiff(target, s.cur.f);
    const same = d < 1e-9;
    const deg = Math.round(s.x / DEG);
    const msg = $('cmpMsg');
    msg.className = `tip feedback ${same ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `$x=${deg}^\\circ$：$\\sin2x=${fmt(target(s.x), 4)}$，$${s.cur.expr}=${fmt(s.cur.f(s.x), 4)}$<br>`
      + (same ? '<b>✓ 完全重合</b>：在 $[0,2\\pi]$ 上取 721 个点，最大偏差为 0。' : `<b>不重合</b>：最大偏差 $${fmt(d, 3)}$。`);
    tex(msg);
  };
  $('cmpBtns').innerHTML = CANDS.map((c, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${c.label}</button>`).join('');
  tex($('cmpBtns'));
  $('cmpBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    s.cur = CANDS[+btn.dataset.i];
    $('cmpBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* 第 10 页：降幂公式的图象 sin²x 与 (1 − cos 2x)/2 */
function initSquare() {
  const f = (x) => Math.sin(x) ** 2;
  const g = (x) => (1 - Math.cos(2 * x)) / 2;
  const s = { x: Math.PI / 4 };
  const b = board($('sq'), { x: [-0.4, 6.75], y: [-0.45, 1.35], w: 640, ticks: [0, 0.5] });
  piTicks(b);
  b.seg([[0, 0.5], [TAU, 0.5]], { cls: 'dash' });
  b.fn(f, { from: 0, to: TAU });
  b.fn(g, { from: 0, to: TAU, cls: 'c2 dsh' });
  b.pt(() => [s.x, f(s.x)], { cls: 'c2', r: 6 });
  b.drag(() => [s.x, 0], (x) => { s.x = Math.round(clamp(x, 0, TAU) / (Math.PI / 36)) * (Math.PI / 36); });
  b.onUpdate = () => { $('sqV').textContent = `x = ${Math.round(s.x / DEG)}°：${fmt(f(s.x), 4)} = ${fmt(g(s.x), 4)}`; };
  b.update();
}

/* 第 11 页：例 5 半圆截矩形（图 10-2-1，R = 1），θ = ∠AOB */
function initSteel() {
  const R = 1;
  const s = { t: 30 };
  const Bp = () => [R * Math.cos(s.t * DEG), R * Math.sin(s.t * DEG)];
  const b = board($('steel'), { x: [-1.25, 1.25], y: [-0.3, 1.12], axes: false, grid: false, w: 600 });
  arc(b, [0, 0], R, 0, Math.PI, { cls: 'thin' });
  b.seg([[-R, 0], [R, 0]], { cls: 'thin' });
  b.poly(() => { const [x, y] = Bp(); return [[x, 0], [x, y], [-x, y], [-x, 0]]; });
  b.seg(() => [[0, 0], Bp()], { cls: 'c2' });
  arc(b, [0, 0], 0.16, 0, () => s.t * DEG, { cls: 'c2 ang' });
  b.text(() => [0.26 * Math.cos(s.t * DEG / 2), 0.26 * Math.sin(s.t * DEG / 2)], 'θ', { dx: -4, dy: 8 });
  b.text(() => [Bp()[0] / 2, Bp()[1] / 2], 'R', { dx: -18, dy: -4 });
  b.pt([0, 0]);
  b.text([0, 0], 'O', { dx: -8, dy: 26 });
  b.text(() => [Bp()[0], 0], 'A', { dx: 4, dy: 26 });
  b.text(() => [-Bp()[0], 0], 'D', { dx: -16, dy: 26 });
  b.text(() => [-Bp()[0], Bp()[1]], 'C', { dx: -22, dy: -6 });
  b.text(Bp, 'B', { dx: 12, dy: -8 });
  b.drag(Bp, (x, y) => { s.t = dragDeg(x, y, [0, 0], 1, 89); });
  b.onUpdate = () => {
    const [x, y] = Bp();
    const ab = y;
    const da = 2 * x;
    const best = s.t === 45 ? '（最大）' : '';
    $('steelV').innerHTML = `θ = ${s.t}°${best}：AB = ${fmt(ab, 3)}R，DA = ${fmt(da, 3)}R<br>S = AB·DA = <b>${fmt(ab * da, 4)}</b>R²，R²sin2θ = ${fmt(Math.sin(2 * s.t * DEG), 4)}R²`;
  };
  b.update();
}

window.LESSON = {
  init() {
    initDouble();
    initCompare();
    initSquare();
    initSteel();
  },
};
