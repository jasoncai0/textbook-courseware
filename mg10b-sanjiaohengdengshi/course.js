'use strict';
/* 高一下 10.3 几个三角恒等式 · 本课互动：调幅波图象、单位圆看半角 ± 号、例 4 直角三角形、正弦与余弦的叠加。
 * 通用部分见 ../shared/math.js、../shared/mvec.js；所有图形按函数/坐标计算绘制。 */
const { board, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const TAU = 2 * Math.PI;
const deg = (r) => (r * 180) / Math.PI;
const norm = (r) => ((r % TAU) + TAU) % TAU; // 化到 [0, 2π)
const num = (v, d = 3) => fmt(Math.abs(v) < 1e-12 ? 0 : v, d);

/** 圆弧（以原点为圆心，从 a0 到 a1，半径 r） */
const arc = (b, r, a0, a1, cls) => b.curve((t) => [r * Math.cos(t), r * Math.sin(t)], a0, a1, { cls, n: 80 });

/** 象限名称；落在坐标轴上单独说明 */
function quadrant(r) {
  const d = Math.round(deg(norm(r)) * 1e6) / 1e6;
  if (d % 90 === 0) return '坐标轴上';
  return ['第一象限', '第二象限', '第三象限', '第四象限'][Math.floor(d / 90)];
}

/* 第 6 页：链接 · f3 = cos2πx·cos16πx 夹在 ±cos2πx 之间（课本图 10-3-2） */
function initAM() {
  const b = board($('amB'), { x: [-0.05, 2.05], y: [-1.35, 1.35], w: 600, h: 300, ticks: [0.5, 1] });
  b.fn((x) => Math.cos(TAU * x), { cls: 'c1 thin2' });
  b.fn((x) => -Math.cos(TAU * x), { cls: 'c3 thin2' });
  b.fn((x) => Math.cos(TAU * x) * Math.cos(16 * Math.PI * x), { cls: 'c2 thin2', n: 2000 });
  b.update();
}

/* 第 8 页：单位圆上拖动 α 的终边 P，看 α/2 的两条可能终边 Q1、Q2 */
function initHalf() {
  const s = { a: deg2rad(240) };
  const b = board($('halfB'), { x: [-1.5, 1.5], y: [-1.5, 1.5], w: 480, ticks: 1, grid: false });
  const P = () => [Math.cos(s.a), Math.sin(s.a)];
  const Q1 = () => [Math.cos(s.a / 2), Math.sin(s.a / 2)];
  const Q2 = () => [-Math.cos(s.a / 2), -Math.sin(s.a / 2)];
  b.curve((t) => [Math.cos(t), Math.sin(t)], 0, TAU, { cls: 'thin' });
  arc(b, 0.22, 0, () => s.a, 'c1 thin2');
  arc(b, 0.4, 0, () => s.a / 2, 'c2 thin2');
  b.seg(() => [[Q1()[0], 0], Q1()], { cls: 'c2 dash2' });
  b.seg(() => [[Q2()[0], 0], Q2()], { cls: 'c3 dash2' });
  MathKit.vec(b, () => [[0, 0], P()], { cls: 'v1' });
  MathKit.vec(b, () => [[0, 0], Q1()], { cls: 'v2' });
  MathKit.vec(b, () => [[0, 0], Q2()], { cls: 'v3' });
  const lab = (f, t, cls) => b.text(() => f().map((v) => v * 1.17), t, { cls: `lb ${cls}`, dx: -8, dy: 8 });
  lab(P, 'P', 'tc1');
  lab(Q1, 'Q₁', 'tc2');
  lab(Q2, 'Q₂', 'tc3');
  b.drag(P, (x, y) => { s.a = norm(Math.round(deg(Math.atan2(y, x))) * Math.PI / 180); });
  b.onUpdate = () => {
    const c = Math.cos(s.a);
    const h1 = s.a / 2;
    const h2 = h1 + Math.PI;
    const t = Math.sin(s.a) / (1 + c);
    $('halfV').innerHTML = `<p>α = <b>${fmt(deg(s.a), 0)}°</b>，cos α = <b>${num(c)}</b>，√((1 − cos α)/2) = <b>${num(Math.sqrt((1 - c) / 2))}</b></p>`
      + `<p class="q1">Q₁：α/2 = ${fmt(deg(h1), 1)}°，${quadrant(h1)}，sin(α/2) = <b>${num(Math.sin(h1))}</b></p>`
      + `<p class="q2">Q₂：α/2 + 180° = ${fmt(deg(h2), 1)}°，${quadrant(h2)}，sin = <b>${num(Math.sin(h2))}</b></p>`
      + `<p>tan(Q₁) = ${Number.isFinite(t) && Math.abs(c + 1) > 1e-9 ? num(Math.tan(h1)) : '不存在'}，tan(Q₂) = ${Math.abs(c + 1) > 1e-9 ? num(Math.tan(h2)) : '不存在'}，sin α/(1 + cos α) = ${Math.abs(c + 1) > 1e-9 ? num(t) : '无意义'}</p>`;
  };
  b.update();
}
function deg2rad(d) { return (d * Math.PI) / 180; }

/* 第 10 页：例 4 · 直角边 1 − t²、2t，斜边 1 + t²（课本图 10-3-1） */
function initTri() {
  const s = { t: 0.5 };
  const b = board($('triB'), { x: [-0.25, 1.45], y: [-0.25, 1.6], w: 420, axes: false, grid: false });
  const C = () => [1 - s.t * s.t, 0];
  const B = () => [1 - s.t * s.t, 2 * s.t];
  const alpha = () => Math.atan2(2 * s.t, 1 - s.t * s.t);
  b.poly(() => [[0, 0], C(), B()], { cls: 'fill1' });
  b.poly(() => { const [x] = C(); const k = 0.07; return [[x - k, 0], [x - k, k], [x, k], [x, 0]]; }, { cls: 'rt' });
  arc(b, 0.2, 0, alpha, 'c2 thin2');
  b.text(() => [0.22 * Math.cos(alpha() / 2), 0.22 * Math.sin(alpha() / 2)], 'α', { dx: 6, dy: 4 });
  b.text(() => [C()[0] / 2, 0], () => `1 − t² = ${fmt(1 - s.t * s.t)}`, { cls: 'lb up sm', dy: 24 });
  b.text(() => [C()[0], s.t], () => `2t = ${fmt(2 * s.t)}`, { cls: 'lb up sm', dx: 8 });
  b.text(() => [C()[0] / 2, s.t], () => `1 + t² = ${fmt(1 + s.t * s.t)}`, { cls: 'lb up sm', dx: -16, dy: -12 }).setAttribute('text-anchor', 'end');
  b.onUpdate = () => {
    const t = s.t;
    const a = alpha();
    $('tV').textContent = fmt(t);
    $('triV').innerHTML = `<p>∠α 实测 = <b>${fmt(deg(a), 2)}°</b>；2·arctan t = <b>${fmt(deg(2 * Math.atan(t)), 2)}°</b></p>`
      + `<p>sin α = ${fmt(Math.sin(a), 4)}，2t/(1 + t²) = ${fmt((2 * t) / (1 + t * t), 4)}</p>`
      + `<p>cos α = ${fmt(Math.cos(a), 4)}，(1 − t²)/(1 + t²) = ${fmt((1 - t * t) / (1 + t * t), 4)}</p>`;
  };
  MathKit.slider($('tS'), (v) => { s.t = v; b.update(); });
}

/* 第 12 页：正弦与余弦的叠加 · 拖动 (a, b) */
const AB_MAX = 3; // 振幅上限（与波形板的 y 范围配合）
function initSuper() {
  const s = { a: 1, b: 1 };
  const amp = () => Math.hypot(s.a, s.b);
  const theta = () => norm(Math.atan2(s.b, s.a));
  const sum = (x) => s.a * Math.sin(x) + s.b * Math.cos(x);
  const one = (x) => amp() * Math.sin(x + theta());

  const w = board($('waveB'), { x: [-0.8, 7.2], y: [-3.3, 3.3], w: 640, ticks: [0, 1] });
  ['π/2', 'π', '3π/2', '2π'].forEach((t, i) => {
    const x = ((i + 1) * Math.PI) / 2;
    w.seg([[x, -0.08], [x, 0.08]], { cls: 'ax' });
    w.text([x, 0], t, { cls: 'tk', dy: 18 }).setAttribute('text-anchor', 'middle');
  });
  w.fn((x) => s.a * Math.sin(x), { cls: 'c1 thin2' });
  w.fn((x) => s.b * Math.cos(x), { cls: 'c2 thin2' });
  w.fn(sum, { cls: 'c3 thick' });
  w.fn(one, { cls: 'dk' });
  const top = () => { const x = norm(Math.PI / 2 - theta()); return [x, amp()]; };
  w.seg(() => [[top()[0], 0], top()], { cls: 'dash' });
  w.pt(top, { cls: 'c2', r: 6 });

  const g = board($('abB'), { x: [-3.3, 3.3], y: [-3.3, 3.3], w: 400, ticks: 1 });
  const P = () => [s.a, s.b];
  g.seg(() => [[s.a, 0], P()], { cls: 'dash' });
  g.seg(() => [[0, s.b], P()], { cls: 'dash' });
  arc(g, 0.7, 0, theta, 'c2 thin2');
  g.text(() => [0.95 * Math.cos(theta() / 2), 0.95 * Math.sin(theta() / 2)], 'θ', { cls: 'lb tc2', dx: -5, dy: 6 });
  MathKit.vec(g, () => [[0, 0], P()], { cls: 'v1' });
  g.text(P, () => `(${fmt(s.a, 2)}, ${fmt(s.b, 2)})`, { cls: 'lb up sm', dx: 10, dy: -10 });
  g.drag(P, (x, y) => {
    const r = Math.hypot(x, y);
    const k = r > AB_MAX ? AB_MAX / r : 1;
    const [a, bb] = [Math.round(x * k * 10) / 10, Math.round(y * k * 10) / 10];
    if (Math.hypot(a, bb) < 0.2) return; // a、b 不全为 0
    s.a = a; s.b = bb;
  });

  g.onUpdate = () => {
    w.update();
    let err = 0;
    for (let i = 0; i <= 2000; i++) { const x = (TAU * i) / 2000; err = Math.max(err, Math.abs(sum(x) - one(x))); }
    const th = theta();
    $('abV').innerHTML = `<p>a = <b>${fmt(s.a)}</b>，b = <b>${fmt(s.b)}</b>，√(a² + b²) = <b>${fmt(amp(), 3)}</b></p>`
      + `<p>θ = <b>${fmt(deg(th), 1)}°</b>（≈ ${fmt(th, 3)} rad），${quadrant(th)}</p>`
      + `<p>最大值 <b>${fmt(amp(), 3)}</b>，在 x = π/2 − θ + 2kπ（图中 x ≈ ${fmt(top()[0], 3)}）</p>`
      + `<p class="muted">绿线与虚线的最大偏差：${err < 1e-9 ? '0' : err.toExponential(1)}</p>`;
  };
  $('abBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ab]');
    if (!btn) return;
    [s.a, s.b] = btn.dataset.ab.split(',').map(Number);
    g.update();
  });
  g.update();
}

window.LESSON = {
  init() {
    initAM();
    initHalf();
    initTri();
    initSuper();
  },
};
