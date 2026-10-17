'use strict';
/* 九下 7.2 正弦、余弦 · 本课互动：沿坡道行走（图 7-9）、三个比值选边、斜边为 1 的读数盘（图 7-12）、三角函数计算器。
 * 所有图形按坐标精确计算，作图板横纵同比例。 */
const { slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

/* 第 3 页：图 7-9 坡道，走 13 m 升 5 m（水平 12 m） */
function initSlope() {
  const s = { d: 13 };
  const SIN = 5 / 13;
  const COS = 12 / 13;
  const b = Geo.board($('slope'), { x: [-1.5, 21.5], y: [-2.6, 9.4], w: 700 });
  const top = [20 * COS, 20 * SIN];
  b.poly([[0, 0], [top[0], 0], top], { cls: 'ramp' });
  b.seg([[-1, 0], [21, 0]], { cls: 'gs' });
  const P = () => [s.d * COS, s.d * SIN];
  b.seg(() => [[0, 0], P()], { cls: 'walk' });
  b.seg(() => [P(), [P()[0], 0]], { cls: 'gl so' });
  b.seg(() => [[0, 0], [P()[0], 0]], { cls: 'gl sa' });
  Geo.right(b, () => [P()[0], 0], [0, 0], P, { s: 0.45 });
  Geo.arc(b, [0, 0], [5, 0], top, { r: 2.2 });
  b.pt(P, { r: 7, cls: 'c2' });
  b.text(() => mid([0, 0], P()), () => `${s.d} m`, { cls: 'lb up gnum', dx: -40, dy: -12 });
  b.text(() => [P()[0], P()[1] / 2], () => `${fmt(s.d * SIN)} m`, { cls: 'lb up so-t', dx: 8, dy: 6 });
  b.text(() => [P()[0] / 2, 0], () => `${fmt(s.d * COS)} m`, { cls: 'lb up sa-t', dx: -24, dy: 26 });
  b.onUpdate = () => {
    $('sSV').textContent = s.d;
    $('sUp').textContent = `${fmt(s.d * SIN)} m`;
    $('sRun').textContent = `${fmt(s.d * COS)} m`;
    $('sR1').textContent = (SIN).toFixed(3);
    $('sR2').textContent = (COS).toFixed(3);
  };
  slider($('sS'), (v) => { s.d = v; b.update(); });
}

/* 第 4 页：sin / cos / tan 各用哪两条边（分子红、分母绿） */
const RATIO = {
  sin: { num: 'BC', den: 'AB', tex: '\\sin A=\\dfrac{\\angle A\\text{ 的对边}}{\\text{斜边}}=\\dfrac ac' },
  cos: { num: 'AC', den: 'AB', tex: '\\cos A=\\dfrac{\\angle A\\text{ 的邻边}}{\\text{斜边}}=\\dfrac bc' },
  tan: { num: 'BC', den: 'AC', tex: '\\tan A=\\dfrac{\\angle A\\text{ 的对边}}{\\angle A\\text{ 的邻边}}=\\dfrac ab' },
};
function initDef() {
  const s = { v: 'sin' };
  const P = { A: [0, 0], C: [4.4, 0], B: [4.4, 2.6] };
  const b = Geo.board($('defFig'), { x: [-0.9, 5.8], y: [-1, 3.4], w: 420 });
  const seg = { AB: b.seg([P.A, P.B], { cls: 'gs' }), BC: b.seg([P.B, P.C], { cls: 'gs' }), AC: b.seg([P.A, P.C], { cls: 'gs' }) };
  Geo.right(b, P.C, P.A, P.B, { s: 0.28 });
  Geo.arc(b, P.A, P.C, P.B, { r: 0.6, cls: 'garc on' });
  b.text(P.A, 'A', { dx: -22, dy: 8 }); b.text(P.B, 'B', { dx: 6, dy: -4 }); b.text(P.C, 'C', { dx: 6, dy: 22 });
  b.text(mid(P.A, P.B), '斜边 c', { cls: 'lb up', dx: -70, dy: -8 });
  b.text(mid(P.B, P.C), '对边 a', { cls: 'lb up', dx: 8, dy: 6 });
  b.text(mid(P.A, P.C), '邻边 b', { cls: 'lb up', dx: -30, dy: 26 });
  b.onUpdate = () => {
    const r = RATIO[s.v];
    Object.entries(seg).forEach(([k, node]) => node.setAttribute('class', k === r.num ? 'gl so' : k === r.den ? 'gl sa' : 'gs'));
    $('defMsg').innerHTML = `$${r.tex}$`;
    tex($('defMsg'));
  };
  $('defBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    s.v = btn.dataset.v;
    $('defBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* 第 5 页：图 7-12，OP = 1，P 的坐标就是 (cosθ, sinθ) */
function initDial() {
  const s = { th: 15 };
  const b = Geo.board($('dial'), { x: [-0.14, 1.2], y: [-0.14, 1.16], axes: true, grid: false, ticks: [0.5, 0.5], w: 460 });
  for (let v = 0.1; v < 1.11; v += 0.1) { b.seg([[v, 0], [v, 1.1]], { cls: 'fgrid' }); b.seg([[0, v], [1.1, v]], { cls: 'fgrid' }); }
  b.curve((t) => [Math.cos(t * RAD), Math.sin(t * RAD)], 0, 90, { cls: 'arc1' });
  for (let d = 5; d < 90; d += 5) {
    const u = [Math.cos(d * RAD), Math.sin(d * RAD)];
    b.seg([u, [u[0] * 1.03, u[1] * 1.03]], { cls: 'tickm' });
    if (d % 15 === 0) b.text([u[0] * 1.05, u[1] * 1.05], `${d}°`, { cls: 'lb up deg', dx: -4, dy: 6 });
  }
  const P = () => [Math.cos(s.th * RAD), Math.sin(s.th * RAD)];
  b.seg(() => [[0, 0], P()], { cls: 'gs' });
  b.seg(() => [P(), [P()[0], 0]], { cls: 'gl so' });
  b.seg(() => [[0, 0], [P()[0], 0]], { cls: 'gl sa' });
  b.seg(() => [[0, P()[1]], P()], { cls: 'dash' });
  Geo.right(b, () => [P()[0], 0], [0, 0], P, { s: 0.04 });
  Geo.arc(b, [0, 0], [1, 0], P, { r: 0.13, label: () => `${s.th}°`, lr: 1.9 });
  b.text(P, 'P', { dx: 8, dy: -8 });
  b.text(() => [0, P()[1]], () => P()[1].toFixed(2), { cls: 'lb up so-t', dx: -46, dy: 6 });
  b.text(() => [P()[0], 0], () => P()[0].toFixed(2), { cls: 'lb up sa-t', dx: -16, dy: 40 });
  b.drag(P, (x, y) => { s.th = Math.round(clamp(Math.atan2(y, x) / RAD, 1, 89)); }, { r: 8 });
  b.onUpdate = () => {
    $('dTh').textContent = `${s.th}°`;
    $('dSin').textContent = P()[1].toFixed(2);
    $('dCos').textContent = P()[0].toFixed(2);
  };
  b.update();
}

/* 例题、练习静态图（按题中数据精确绘制） */
function initSketches() {
  const r3 = Math.sqrt(3);
  Geo.sketch($('ex1Fig'), { P: { B: [0, 0], C: [6, 0], A: [3, 3 * r3], D: [3, 0] }, seg: 'AB BC CA', dash: 'AD', right: [['D', 'C', 'A']], w: 320, pad: 1 });
  // 练习 1：AC = 4，BC = 3，CD ⊥ AB
  const A = [0, 4];
  const B = [3, 0];
  const D = Geo.foot([0, 0], A, B);
  Geo.sketch($('pr1Fig'), { P: { A, C: [0, 0], B, D }, seg: 'AB BC CA CD', right: [['C', 'B', 'A'], ['D', 'B', 'C']], w: 300, pad: 0.6 });
  Geo.sketch($('ex3Fig'), { P: { A: [0, 0], C: [6, 0], B: [6, 2.5] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], text: [[[3, 0], '12', -8, 24], [[6, 1.25], '5', 8, 6]], w: 320, pad: 0.6 });
  const t15 = Math.tan(15 * RAD);
  Geo.sketch($('ex4Fig'), { P: { A: [0, 0], C: [1.5 / t15, 0], B: [1.5 / t15, 1.5] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], ang: [['A', 'C', 'B', '15°', 1.4]], text: [[[1.5 / t15, 0.75], '6', 8, 6]], w: 360, pad: 0.45 });
  Geo.sketch($('p2a'), { P: { A: [0, 0], C: [Math.sqrt(21), 0], B: [Math.sqrt(21), 2] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], text: [[[Math.sqrt(21) / 2, 1], '5', -10, -10], [[Math.sqrt(21), 1], '2', 8, 6]], w: 240, pad: 0.6 });
  // ②：A₁C₁ = 6，C₁B₁ = 4，直角在 C₁（上方）；A₁B₁ = 2√13 放在底边
  const h = Math.sqrt(52);
  const c1 = [36 / h, (6 * 4) / h];
  Geo.sketch($('p2b'), { P: { 'A₁': [0, 0], 'B₁': [h, 0], 'C₁': c1 }, seg: 'A₁B₁ B₁C₁ C₁A₁', right: [['C₁', 'A₁', 'B₁']], text: [[mid([0, 0], c1), '6', -16, -4], [mid(c1, [h, 0]), '4', 8, -2]], w: 260, pad: 0.7 });
  Geo.sketch($('h1a'), { P: { C: [0, 0], B: [6, 0], A: [0, 2] }, seg: 'AB BC CA', right: [['C', 'B', 'A']], text: [[[0, 1], '1', -18, 6], [[3, 0], '3', -4, 22]], w: 260, pad: 0.8 });
  // ②：直角在 E，EF = 3，DF = 4（斜边）
  const F = [4, 0];
  const E = [7 / 4, (3 * Math.sqrt(7)) / 4];
  Geo.sketch($('h1b'), { P: { D: [0, 0], F, E }, seg: 'DE EF FD', right: [['E', 'D', 'F']], text: [[[2, 0], '4', -4, 22], [mid(E, F), '3', 8, -2]], w: 240, pad: 0.5 });
}

/* 第 7 页：计算器（核对用），支持度分秒 */
function initCalc() {
  const run = () => {
    const fn = $('cFn').value;
    const d = clamp(+$('cDeg').value || 0, 0, 89);
    const m = clamp(+$('cMin').value || 0, 0, 59);
    const sec = clamp(+$('cSec').value || 0, 0, 59);
    const deg = d + m / 60 + sec / 3600;
    const v = Math[fn](deg * RAD);
    $('cAng').textContent = `${fn} ${d}°${m || sec ? `${m}′` : ''}${sec ? `${sec}″` : ''}`;
    $('cVal').textContent = v.toPrecision(10);
    $('cRound').textContent = `精确到 0.01：≈ ${v.toFixed(2)}${m || sec ? `（≈ ${fmt(deg, 4)}°）` : ''}`;
  };
  ['cFn', 'cDeg', 'cMin', 'cSec'].forEach((id) => $(id).addEventListener('input', run));
  run();
}

window.LESSON = {
  init() {
    initSlope();
    initDef();
    initDial();
    initSketches();
    initCalc();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
