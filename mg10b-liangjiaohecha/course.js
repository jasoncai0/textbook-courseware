'use strict';
/* 高一下 10.1 两角和与差的三角函数 · 本课互动：误区数值实验、单位圆上数量积“算两次”（核心）、−β 的几何意义、
 * 图 10-1-3、辅助角图象、三个正方形。通用部分见 ../shared/math.js、../shared/mvec.js；横纵同比例，全部按坐标计算。 */
const { board, vec, vecLen, vecDot, fmt, slider } = MathKit;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const ORIGIN = [0, 0];
const val = (v) => (typeof v === 'function' ? v() : v);
const norm360 = (d) => ((d % 360) + 360) % 360;
const unit = (deg) => [Math.cos(deg * RAD), Math.sin(deg * RAD)];
const num = (v, d = 3) => { const t = fmt(v, d); return t.startsWith('-') ? `(−${t.slice(1)})` : t; };
const show = (v, d = 3) => fmt(v, d).replace('-', '−');
const setBtns = (box, key) => box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x.dataset.k === key));

/** 以 c 为圆心、半径 r 的圆弧：从 from° 起转过 sweep°（可为负） */
const arc = (b, c, r, from, sweep, cls) => b.curve((t) => {
  const a = (val(from) + val(sweep) * t) * RAD;
  return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
}, 0, 1, { cls, n: 90 });

/** 在角的平分线方向放一个文字标注 */
const arcLabel = (b, c, r, from, sweep, txt, cls) => {
  const t = b.text(() => { const m = (val(from) + val(sweep) / 2) * RAD; return [c[0] + r * Math.cos(m), c[1] + r * Math.sin(m)]; }, txt, { cls, dy: 7 });
  t.setAttribute('text-anchor', 'middle');
  return t;
};

/** 单位圆 + 坐标轴；拖动点吸附到整数度 */
function unitBoard(el) {
  const b = board(el, { x: [-1.5, 1.5], y: [-1.32, 1.32], w: 520, ticks: 1, grid: false });
  b.curve((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, { cls: 'circ', n: 240 });
  return b;
}
const dragDeg = (x, y) => norm360(Math.round(Math.atan2(y, x) / RAD));
const ptLabel = (b, get, txt) => {
  const t = b.text(() => { const p = val(get); const l = vecLen(p) || 1; return [p[0] * (1 + 0.2 / l), p[1] * (1 + 0.2 / l)]; }, txt, { cls: 'lb', dy: 7 });
  t.setAttribute('text-anchor', 'middle');
};

/* 第 4 页：cos(α−β) 与 cos α − cos β 的数值对比 */
function initGuess() {
  const s = { a: 45, b: 30 };
  const MAX = 2; // 柱子半宽对应 |值| = 2
  const bar = (id, v) => {
    const w = Math.min(50, (Math.abs(v) / MAX) * 50);
    const e = $(id);
    e.style.width = `${w}%`;
    e.style.left = v >= 0 ? '50%' : `${50 - w}%`;
  };
  const upd = () => {
    const [a, b] = [s.a * RAD, s.b * RAD];
    const v = [Math.cos(a - b), Math.cos(a) - Math.cos(b), Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b)];
    $('gAV').textContent = `${s.a}°`; $('gBV').textContent = `${s.b}°`;
    v.forEach((x, i) => { $(`gV${i + 1}`).textContent = show(x); bar(`gBar${i + 1}`, x); });
  };
  slider($('gA'), (x) => { s.a = x; upd(); });
  slider($('gB'), (x) => { s.b = x; upd(); });
}

/** 夹角 θ 与 α − β 的关系说明（课本：余弦是周期 2π 的偶函数，只需考虑 0 ≤ α−β ≤ π） */
function relation(d, th) {
  const t = `${fmt(th, 0)}°`;
  if (d >= 0 && d <= 180) return `$0^\\circ\\le\\alpha-\\beta\\le180^\\circ$：夹角 $\\theta=\\alpha-\\beta=${t}$`;
  if (d < 0 && d >= -180) return `$\\alpha-\\beta\\lt0$：夹角 $\\theta=\\beta-\\alpha=${t}$，而 $\\cos(\\alpha-\\beta)=\\cos(\\beta-\\alpha)$（<b>偶函数</b>）`;
  if (d > 180) return `$\\alpha-\\beta\\gt180^\\circ$：夹角 $\\theta=360^\\circ-(\\alpha-\\beta)=${t}$，$\\cos\\theta=\\cos(\\alpha-\\beta)$（<b>周期 360° + 偶函数</b>）`;
  return `$\\alpha-\\beta\\lt-180^\\circ$：夹角 $\\theta=360^\\circ+(\\alpha-\\beta)=${t}$，$\\cos\\theta=\\cos(\\alpha-\\beta)$（<b>周期 360°</b>）`;
}

/* 第 5 页（核心）：单位圆上拖动 P₁(cos α, sin α)、P₂(cos β, sin β)，数量积算两次 */
function initUc() {
  const s = { a: 120, b: 30 };
  const b = unitBoard($('ucB'));
  const P1 = () => unit(s.a);
  const P2 = () => unit(s.b);
  // θ 弧：从 OP₂ 转到 OP₁，取不超过 180° 的那一侧
  const thSweep = () => { const d = norm360(s.a - s.b); return d > 180 ? d - 360 : d; };
  arc(b, ORIGIN, 0.2, 0, () => s.a, 'c1 arc');
  arc(b, ORIGIN, 0.32, 0, () => s.b, 'c3 arc');
  arc(b, ORIGIN, 0.5, () => s.b, thSweep, 'c2 arc');
  arcLabel(b, ORIGIN, 0.13, 0, () => s.a, 'α', 'lb sm c1t');
  arcLabel(b, ORIGIN, 0.42, 0, () => s.b, 'β', 'lb sm c3t');
  arcLabel(b, ORIGIN, 0.64, () => s.b, thSweep, 'θ', 'lb sm c2t');
  vec(b, () => [ORIGIN, P1()], { cls: 'v1', label: 'a', side: -1 });
  vec(b, () => [ORIGIN, P2()], { cls: 'v3', label: 'b', side: 1 });
  b.pt(ORIGIN, { r: 4 });
  b.text(ORIGIN, 'O', { cls: 'lb', dx: -22, dy: 24 });
  b.pt([1, 0], { r: 4 });
  b.text([1, 0], 'P₀', { cls: 'lb', dx: 6, dy: 26 });
  ptLabel(b, P1, 'P₁');
  ptLabel(b, P2, 'P₂');
  b.drag(P1, (x, y) => { s.a = dragDeg(x, y); });
  b.drag(P2, (x, y) => { s.b = dragDeg(x, y); });
  b.onUpdate = () => {
    const [p, q] = [P1(), P2()];
    const cross = p[0] * q[1] - p[1] * q[0];
    const th = Math.abs(Math.atan2(cross, vecDot(p, q))) / RAD; // 几何夹角，独立于 α−β 计算
    const d = s.a - s.b;
    const [ca, sa, cb, sb] = [Math.cos(s.a * RAD), Math.sin(s.a * RAD), Math.cos(s.b * RAD), Math.sin(s.b * RAD)];
    $('ucAng').innerHTML = `$\\alpha=${s.a}^\\circ$，$\\beta=${s.b}^\\circ$，$\\alpha-\\beta=${d}^\\circ$，$\\theta=\\angle P_1OP_2=${fmt(th, 0)}^\\circ$`;
    $('ucV1').textContent = show(vecLen(p) * vecLen(q) * Math.cos(th * RAD));
    $('ucV2').textContent = show(ca * cb + sa * sb);
    $('ucTerms').textContent = `= ${num(ca)} × ${num(cb)} + ${num(sa)} × ${num(sb)}`;
    $('ucV3').textContent = show(Math.cos(d * RAD));
    $('ucV4').textContent = show(ca - cb);
    $('ucRel').innerHTML = relation(d, th);
    MathKit.tex($('ucAng')); MathKit.tex($('ucRel'));
  };
  const PRESET = { fig: [120, 30], neg: [40, 130], big: [300, 60] };
  $('ucBtns').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]');
    if (!k) return;
    [s.a, s.b] = PRESET[k.dataset.k];
    setBtns($('ucBtns'), k.dataset.k);
    b.update();
  });
  b.update();
}

/* 第 7 页：用 −β 代替 β —— P₂ 关于 x 轴对称到 P₂′，∠P₁OP₂′ 对应 α + β */
function initSum() {
  const s = { a: 110, b: 35 };
  const b = unitBoard($('sumB'));
  const P1 = () => unit(s.a);
  const P2 = () => unit(s.b);
  const P2r = () => unit(-s.b);
  arc(b, ORIGIN, 0.2, 0, () => s.a, 'c1 arc');
  arc(b, ORIGIN, 0.3, 0, () => -s.b, 'c3 arc');
  arc(b, ORIGIN, 0.48, () => -s.b, () => s.a + s.b, 'c2 arc');
  arcLabel(b, ORIGIN, 0.12, 0, () => s.a, 'α', 'lb sm c1t');
  arcLabel(b, ORIGIN, 0.4, 0, () => -s.b, 'β', 'lb sm c3t');
  arcLabel(b, ORIGIN, 0.66, () => -s.b, () => s.a + s.b, 'α+β', 'lb sm c2t');
  b.seg(() => [P2(), P2r()], { cls: 'dash' });
  vec(b, () => [ORIGIN, P2()], { cls: 'vg' });
  vec(b, () => [ORIGIN, P1()], { cls: 'v1' });
  vec(b, () => [ORIGIN, P2r()], { cls: 'v3' });
  b.pt(ORIGIN, { r: 4 });
  b.text(ORIGIN, 'O', { cls: 'lb', dx: -22, dy: 24 });
  ptLabel(b, P1, 'P₁');
  ptLabel(b, P2, 'P₂');
  ptLabel(b, P2r, 'P₂′');
  // 角限制在 [0°, 180°]，弧不绕圈，读图清楚
  const half = (x, y) => { const d = Math.round(Math.atan2(y, x) / RAD); return d >= 0 ? d : (d < -90 ? 180 : 0); };
  b.drag(P1, (x, y) => { s.a = half(x, y); });
  b.drag(P2, (x, y) => { s.b = half(x, y); });
  b.onUpdate = () => {
    const [ca, sa, cb, sb] = [Math.cos(s.a * RAD), Math.sin(s.a * RAD), Math.cos(s.b * RAD), Math.sin(s.b * RAD)];
    $('sumV').innerHTML = `$\\alpha=${s.a}^\\circ,\\ \\beta=${s.b}^\\circ$：$\\overrightarrow{OP_1}\\cdot\\overrightarrow{OP_2'}=${show(vecDot(P1(), P2r()))}$，`
      + `$\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta=${show(ca * cb - sa * sb)}$，$\\cos(\\alpha+\\beta)=${show(Math.cos((s.a + s.b) * RAD))}$`;
    MathKit.tex($('sumV'));
  };
  b.update();
}

/* 第 8 页：图 10-1-3，∠DBC = 30°，BD = AB = 2 ⇒ ∠A = 15° */
function initT15() {
  const R3 = Math.sqrt(3);
  const A = [0, 0];
  const B = [2, 0];
  const C = [2 + R3, 0];
  const D = [2 + R3, 1];
  const b = board($('t15B'), { x: [-0.35, 4.2], y: [-0.42, 1.3], w: 600, axes: false, grid: false });
  b.seg([A, C], { cls: 'c3' });
  b.seg([C, D], { cls: 'c3' });
  b.seg([B, D], { cls: 'c3' });
  b.seg([A, D], { cls: 'c1' });
  b.poly([[C[0] - 0.12, 0], [C[0] - 0.12, 0.12], [C[0], 0.12], C], { cls: 'rt' });
  arc(b, A, 0.75, 0, 15, 'c2 arc');
  arc(b, B, 0.42, 0, 30, 'c2 arc');
  [[A, 'A', -22, 22], [B, 'B', -6, 28], [C, 'C', 6, 26], [D, 'D', 8, -6]].forEach(([p, t, dx, dy]) => { b.pt(p, { r: 4 }); b.text(p, t, { cls: 'lb', dx, dy }); });
  [[[1, 0], '2', 0, 26], [[2 + R3 / 2, 0], '√3', 0, 26], [[2 + R3, 0.5], '1', 16, 6], [[2 + R3 / 2, 0.5], '2', -10, -10]].forEach(([p, t, dx, dy]) => {
    b.text(p, t, { cls: 'lb up', dx, dy }).setAttribute('text-anchor', 'middle');
  });
  b.text([0.78, 0.1], '15°', { cls: 'lb up sm2' });
  b.text([2.45, 0.12], '30°', { cls: 'lb up sm2' });
  const len = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  b.onUpdate = () => {
    const cosFig = len(A, C) / len(A, D);
    const tanFig = len(C, D) / len(A, C);
    $('t15V').textContent = `量图：AC/AD = ${fmt(cosFig, 4)}，公式 (√6+√2)/4 = ${fmt((Math.sqrt(6) + Math.sqrt(2)) / 4, 4)}；CD/AC = ${fmt(tanFig, 4)}，2−√3 = ${fmt(2 - R3, 4)}`;
  };
  b.update();
}

/* 第 11 页：y = ½sin x + (√3/2)cos x = sin(x + π/3) 的图象，拖动曲线上的点 */
function initAux() {
  const PI = Math.PI;
  const f = (x) => 0.5 * Math.sin(x) + (Math.sqrt(3) / 2) * Math.cos(x);
  const g = (x) => Math.sin(x + PI / 3);
  const s = { x: 2 };
  const b = board($('auxB'), { x: [-3.7, 7.1], y: [-1.45, 1.55], w: 640, ticks: [PI / 2, 1], tickLabels: false });
  [[-PI / 2, '−π/2'], [PI / 2, 'π/2'], [PI, 'π'], [3 * PI / 2, '3π/2'], [2 * PI, '2π']].forEach(([x, t]) => {
    b.text([x, 0], t, { cls: 'tk', dy: 16 }).setAttribute('text-anchor', 'middle');
  });
  [[1, '1'], [-1, '−1']].forEach(([y, t]) => b.text([0, y], t, { cls: 'tk', dx: -16, dy: 5 }));
  b.seg([[-3.7, 1], [7.1, 1]], { cls: 'dash' });
  b.fn(f, { cls: 'c1' });
  b.pt([PI / 6, 1], { cls: 'c2' });
  b.text([PI / 6, 1], '(π/6, 1)', { cls: 'lb up', dx: 10, dy: -10 });
  b.drag(() => [s.x, f(s.x)], (x) => { s.x = Math.round(Math.min(7, Math.max(-3.6, x)) * 100) / 100; });
  b.onUpdate = () => {
    $('auxV').innerHTML = `$x=${fmt(s.x, 2)}$：$\\frac12\\sin x+\\frac{\\sqrt3}2\\cos x=${show(f(s.x))}$，$\\sin\\left(x+\\frac\\pi3\\right)=${show(g(s.x))}$`;
    MathKit.tex($('auxV'));
  };
  b.update();
}

/* 第 13 页：图 10-1-4，三个边长为 1 的正方形 */
function initSq() {
  const b = board($('sqB'), { x: [-0.2, 3.25], y: [-0.32, 1.22], w: 560, axes: false, grid: false });
  [0, 1, 2].forEach((i) => b.poly([[i, 0], [i + 1, 0], [i + 1, 1], [i, 1]], { cls: 'sqf' }));
  const T = [3, 1];
  b.seg([[0, 0], T], { cls: 'c1' });
  b.seg([[1, 0], T], { cls: 'c2' });
  const al = Math.atan2(1, 2) / RAD;
  const be = Math.atan2(1, 3) / RAD;
  arc(b, [0, 0], 0.55, 0, be, 'c1 arc');
  arc(b, [1, 0], 0.42, 0, al, 'c2 arc');
  arcLabel(b, [0, 0], 0.72, 0, be, 'β', 'lb sm c1t');
  arcLabel(b, [1, 0], 0.6, 0, al, 'α', 'lb sm c2t');
  const deg = (p, q) => Math.atan2(q[1] - p[1], q[0] - p[0]) / RAD; // 由坐标重新量角
  b.onUpdate = () => {
    const [a, c] = [deg([1, 0], T), deg([0, 0], T)];
    $('sqV').textContent = `量图：α = ${fmt(a, 2)}°，β = ${fmt(c, 2)}°，α + β = ${fmt(a + c, 2)}°`;
  };
  b.update();
}

window.LESSON = {
  init() {
    initGuess();
    initUc();
    initSum();
    initT15();
    initAux();
    initSq();
  },
};
