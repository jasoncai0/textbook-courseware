'use strict';
/* 八上 2.5 等腰三角形的轴对称性 · 本课互动：拖顶点看“三线合一”、尺规作等腰三角形、等边三角形的对称轴、
 * 直角三角形斜边上的中线（C 在以 AB 为直径的半圆上移动）。通用部分见 ../shared/math.js、mgeo.js、mproof.js、mcheck.js。
 * 所有图形由坐标计算，作图板横纵同比例；角度、长度读数都由坐标实时算出。 */
const { fmt, slider } = MathKit;
const { add, sub, mul, dist, lerp, angle, meet, foot, line, right, arc, sketch } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const RAD = Math.PI / 180;
/** 角 V 的平分线与对边 PQ 的交点 */
const bisFoot = (V, P, Q) => lerp(P, Q, dist(V, P) / (dist(V, P) + dist(V, Q)));
const deg = (v) => `${fmt(v, 1)}°`;
const HIDE = [99, 99];

/* ---------- 第 4 页：三线合一 ---------- */
function initThree() {
  const B = [-3, 0];
  const C = [3, 0];
  const s = { A: [-1.2, 4], h: true, m: true, b: true };
  const H = () => [s.A[0], 0];
  const M = [0, 0];
  const D = () => bisFoot(s.A, B, C);
  const iso = () => s.A[0] === 0;
  const b = Geo.board($('three'), { x: [-4.2, 4.2], y: [-1, 5.6], w: 560 });
  b.poly(() => [s.A, B, C], { cls: 'tri-f' });
  b.seg(() => (s.h ? [s.A, H()] : [s.A, s.A]), { cls: 'ln-h' });
  b.seg(() => (s.m ? [s.A, M] : [s.A, s.A]), { cls: 'ln-m' });
  b.seg(() => (s.b ? [s.A, D()] : [s.A, s.A]), { cls: 'ln-b' });
  right(b, () => (s.h ? H() : HIDE), C, () => s.A, { s: 0.25 });
  arc(b, B, C, () => s.A, { r: 0.7, label: () => deg(angle(B, C, s.A)), lr: 1.9 });
  arc(b, C, B, () => s.A, { r: 0.7, label: () => deg(angle(C, B, s.A)), lr: 1.9 });
  b.text(() => s.A, 'A', { dx: 10, dy: -8 });
  b.text(B, 'B', { dx: -20, dy: 20 });
  b.text(C, 'C', { dx: 8, dy: 20 });
  b.drag(() => s.A, (x, y) => {
    const nx = clamp(x, -2.6, 2.6);
    s.A = [Math.abs(nx) < 0.15 ? 0 : nx, clamp(y, 1, 5.2)];
  });
  b.onUpdate = () => {
    $('tAB').textContent = fmt(dist(s.A, B));
    $('tAC').textContent = fmt(dist(s.A, C));
    $('tB').textContent = deg(angle(B, C, s.A));
    $('tC').textContent = deg(angle(C, B, s.A));
    const msg = $('tMsg');
    msg.className = `tip feedback ${iso() ? 'fb-ok' : ''}`;
    msg.textContent = iso()
      ? 'AB = AC：三条线重合成一条，∠B = ∠C。'
      : `AB ≠ AC：高线、中线、角平分线分别交 BC 于三个不同的点。`;
  };
  $('threeBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    const k = btn.dataset.k;
    s[k] = !s[k];
    btn.classList.toggle('solid', s[k]);
    b.update();
  });
  b.update();
}

/* ---------- 第 6 页：尺规作等腰三角形 ---------- */
function initCons2() {
  const s = { a: 4, h: 3.5, k: 0 };
  const B = () => [-s.a / 2, 0];
  const C = () => [s.a / 2, 0];
  const A = () => [0, s.h];
  const R = () => 0.65 * s.a; // 作垂直平分线用的半径（大于 a/2）
  const yx = () => Math.sqrt(R() * R() - (s.a / 2) ** 2); // 两弧交点的纵坐标
  const b = Geo.board($('cons2'), { x: [-3.8, 3.8], y: [-2.8, 5.6], w: 520 });
  const arcPts = (c, r, a0, a1) => (t) => { const a = (a0 + (a1 - a0) * t) * RAD; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]; };
  const on = (k) => s.k >= k;
  b.poly(() => (on(4) ? [A(), B(), C()] : [HIDE, HIDE, HIDE]), { cls: 'tri-f' });
  b.seg(() => (on(1) ? [B(), C()] : [HIDE, HIDE]), { cls: 'gs' });
  // 第 2 步：分别以 B、C 为圆心画弧（上下各一段），再连 MN
  [1, -1].forEach((sg) => {
    b.curve((t) => {
      if (!on(2)) return [NaN, NaN];
      const a = Math.atan2(sg * yx(), s.a / 2) / RAD;
      return arcPts(B(), R(), a - 14, a + 14)(t);
    }, 0, 1, { cls: 'carc', n: 40 });
    b.curve((t) => {
      if (!on(2)) return [NaN, NaN];
      const a = 180 - Math.atan2(sg * yx(), s.a / 2) / RAD;
      return arcPts(C(), R(), a - 14, a + 14)(t);
    }, 0, 1, { cls: 'carc', n: 40 });
  });
  line(b, () => (on(2) ? [0, 0] : HIDE), () => (on(2) ? [0, 1] : [99, 100]), { cls: 'gl axis-l' });
  right(b, () => (on(2) ? [0, 0] : HIDE), C, [0, 1], { s: 0.25 });
  b.text(() => (on(2) ? [0, 5.2] : null), 'M', { dx: 8, dy: 6 });
  b.text(() => (on(2) ? [0, -2.4] : null), 'N', { dx: 8, dy: 6 });
  b.text(() => (on(2) ? [0, 0] : null), 'D', { dx: 6, dy: 22 });
  // 第 3 步：以 D 为圆心、h 为半径画弧，交 MN 于 A
  b.curve((t) => (on(3) ? arcPts([0, 0], s.h, 76, 104)(t) : [NaN, NaN]), 0, 1, { cls: 'carc', n: 30 });
  b.seg(() => (on(3) ? [[0, 0], A()] : [HIDE, HIDE]), { cls: 'ln-h thin-h' });
  b.pt(A, { show: () => on(3) });
  b.text(() => (on(3) ? A() : null), 'A', { dx: 10, dy: -8 });
  b.seg(() => (on(4) ? [A(), B()] : [HIDE, HIDE]), { cls: 'gs' });
  b.seg(() => (on(4) ? [A(), C()] : [HIDE, HIDE]), { cls: 'gs' });
  b.text(() => (on(1) ? B() : null), 'B', { dx: -20, dy: 20 });
  b.text(() => (on(1) ? C() : null), 'C', { dx: 8, dy: 20 });
  b.onUpdate = () => {
    $('c2aV').textContent = fmt(s.a);
    $('c2hV').textContent = fmt(s.h);
    const T = [
      '按 1～4 的顺序作图；可以先拖滑块选定 a、h。',
      `作出线段 BC = ${fmt(s.a)}。`,
      `以 B、C 为圆心、大于 ½BC 的长为半径画弧，过两弧交点作直线 MN（BC 的垂直平分线），交 BC 于中点 D。`,
      `以 D 为圆心、h = ${fmt(s.h)} 为半径画弧，交 MN 于点 A。`,
      `AB = AC = ${fmt(dist(A(), B()))}，BC 边上的高 AD = ${fmt(s.h)}。`,
    ];
    const msg = $('c2Msg');
    msg.className = `tip feedback ${s.k === 4 ? 'fb-ok' : ''}`;
    msg.textContent = T[s.k];
  };
  $('c2Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = +btn.dataset.k;
    b.update();
  });
  slider($('c2a'), (v) => { s.a = v; b.update(); });
  slider($('c2h'), (v) => { s.h = v; b.update(); });
}

/* ---------- 第 10 页：等边三角形的对称轴 ---------- */
function initEqui() {
  const A = [0, 2 * Math.sqrt(3)];
  const B = [-2, 0];
  const C = [2, 0];
  const s = { ax: false };
  const b = Geo.board($('equi'), { x: [-3, 3], y: [-0.8, 4.2], w: 420 });
  b.poly([A, B, C], { cls: 'tri-f' });
  [[A, B, C], [B, C, A], [C, A, B]].forEach(([P, Q, R]) => {
    line(b, () => (s.ax ? P : HIDE), () => (s.ax ? lerp(Q, R, 0.5) : [99, 98]), { cls: 'gl axis-l' });
  });
  [[A, B, C], [B, C, A], [C, A, B]].forEach(([P, Q, R]) => arc(b, P, Q, R, { r: 0.45, label: '60°', lr: 2 }));
  b.text(A, 'A', { dx: 8, dy: -6 });
  b.text(B, 'B', { dx: -20, dy: 18 });
  b.text(C, 'C', { dx: 8, dy: 18 });
  $('eqAx').addEventListener('click', () => { s.ax = !s.ax; b.update(); });
  b.update();
}

/* ---------- 第 12 页：斜边上的中线（C 在以 AB 为直径的半圆上） ---------- */
function initThales() {
  const A = [-3, 0];
  const B = [3, 0];
  const D = [0, 0];
  const R = 3;
  const s = { t: 62, cir: false };
  const C = () => [R * Math.cos(s.t * RAD), R * Math.sin(s.t * RAD)];
  const b = Geo.board($('thales'), { x: [-4, 4], y: [-3.4, 3.8], w: 560 });
  b.curve((t) => (s.cir ? [R * Math.cos(2 * Math.PI * t), R * Math.sin(2 * Math.PI * t)] : [NaN, NaN]), 0, 1, { cls: 'gdash', n: 200 });
  b.poly(() => [A, B, C()], { cls: 'tri-f' });
  b.seg(() => [C(), D], { cls: 'ln-m' });
  right(b, C, A, B, { s: 0.3 });
  b.pt(D);
  b.text(A, 'A', { dx: -20, dy: 18 });
  b.text(B, 'B', { dx: 8, dy: 18 });
  b.text(D, 'D', { dx: -6, dy: 24 });
  b.text(C, 'C', { dx: 8, dy: -8 });
  b.drag(C, (x, y) => {
    const a = Math.atan2(Math.max(y, 0.01), x) / RAD;
    s.t = clamp(a, 12, 168);
  });
  b.onUpdate = () => {
    $('thC').textContent = deg(angle(C(), A, B));
    $('thCD').textContent = fmt(dist(C(), D));
    $('thAD').textContent = fmt(dist(A, D));
    $('thBD').textContent = fmt(dist(B, D));
  };
  $('thCir').addEventListener('click', () => { s.cir = !s.cir; b.update(); });
  b.update();
}

/* ---------- 静态图（按题目条件精确作出） ---------- */
function initSketches() {
  const iso = { A: [0, 3.6], B: [-1.5, 0], C: [1.5, 0], D: [0, 0] };
  sketch($('sk229a'), { P: iso, seg: 'AB AC BC AD', ang: [['A', 'B', 'D', undefined, 0.7], ['A', 'D', 'C', undefined, 0.85]], w: 260, pad: 0.6, lab: { D: [-6, 22] } });
  sketch($('sk229b'), {
    P: { A: [0, 3.6], D: [0, 0], C: [1.5, 0], E: [-1.5, 0] },
    seg: 'AC AD DC', dash: 'AE ED', right: [['D', 'C', 'A']], hide: 'CE',
    text: [[[1.5, 0], 'C(B)', -6, 22, 'lb']], w: 260, pad: 0.6, lab: { D: [-6, 22] },
  });
  sketch($('pf1'), { P: iso, seg: 'AB AC BC AD', ang: [['A', 'B', 'D', undefined, 0.7], ['A', 'D', 'C', undefined, 0.85]], w: 220, pad: 0.5, lab: { D: [-6, 22] } });
  sketch($('pf2'), { P: iso, seg: 'AB AC BC AD', text: [[[-0.75, 0], '‖', -3, 6, 'lb up gnum'], [[0.75, 0], '‖', -3, 6, 'lb up gnum']], w: 220, pad: 0.5, lab: { D: [-6, 22] } });
  sketch($('pf3'), { P: iso, seg: 'AB AC BC AD', right: [['D', 'C', 'A']], w: 220, pad: 0.5, lab: { D: [-6, 22] } });
  // 图 2-30：AB = AC = 4，底角 30°；AD = BD
  const L = 4;
  const A = [L * Math.cos(30 * RAD), L * Math.sin(30 * RAD)];
  const D = [(L / 2) / Math.cos(30 * RAD), 0];
  sketch($('sk230'), {
    P: { A, B: [0, 0], C: [2 * L * Math.cos(30 * RAD), 0], D },
    seg: 'AB AC BC AD', ang: [['A', 'B', 'D', '1', 0.7], ['A', 'D', 'C', '2', 0.55], ['D', 'B', 'A', undefined, 0.35]], w: 420, pad: 0.5,
  });
  sketch($('sk231'), { P: { A: [0, 3.8], B: [-1.8, 0], C: [1.8, 0], D: [0, 0] }, seg: 'AB AC BC', dash: 'AD', ang: [['B', 'C', 'A', undefined, 0.5], ['C', 'A', 'B', undefined, 0.5]], w: 300, pad: 0.6, lab: { D: [-6, 22] } });
  // 图 2-32：AB = AC，AD ∥ BC，E 在 BA 的延长线上
  const A2 = [1.3, 2.9];
  sketch($('sk232'), {
    P: { A: A2, B: [0, 0], C: [2.6, 0], D: add(A2, [1.7, 0]), E: add(A2, mul(sub(A2, [0, 0]), 0.32)) },
    seg: 'BC CA BE AD', w: 300, pad: 0.6, lab: { A: [-18, -4] },
  });
  // ∠A = 30° 的直角三角形
  const A3 = [0, 2 * Math.sqrt(3)];
  sketch($('sk30'), {
    P: { A: A3, B: [-2, 0], C: [0, 0], D: lerp(A3, [-2, 0], 0.5) },
    seg: 'AB BC CA CD', right: [['C', 'B', 'A']], ang: [['A', 'C', 'B', '30°', 0.8]], w: 300, pad: 0.6,
  });
  // 人字梁：顶角 110°，底角 35°
  sketch($('truss'), {
    P: { A: [3, 3 * Math.tan(35 * RAD)], B: [0, 0], C: [6, 0], D: [3, 0] },
    seg: 'AB AC BC AD', right: [['D', 'C', 'A']], w: 320, pad: 0.4, lab: { D: [-6, 22] },
  });
  // 练习 1（p66）
  sketch($('q661'), {
    P: { B: [0, 3], C: [0, 0], A: [4, 0], D: [2, 1.5], E: [2, 0] },
    seg: 'BC CA AB CD DE', right: [['C', 'A', 'B'], ['E', 'A', 'D']], w: 300, pad: 0.5,
  });
  // 练习 2（p66）
  const P2 = { A: [0, 3.6], B: [-1.6, 0], C: [1.6, 0] };
  const D2 = bisFoot(P2.B, P2.A, P2.C);
  const E2 = bisFoot(P2.C, P2.A, P2.B);
  sketch($('q662'), { P: { ...P2, D: D2, E: E2, O: meet(P2.B, D2, P2.C, E2) }, seg: 'AB AC BC BD CE', w: 260, pad: 0.5, lab: { O: [-5, -10] } });
  // 辨一辨：∠1 = ∠BAD 与 ∠2 = ∠C 相等，但不在同一个三角形里
  const B4 = [0, 0];
  const C4 = [5, 0];
  const A4 = [1.2, 2.6];
  const c = angle(C4, B4, A4);
  const dirAD = Geo.rot(sub(B4, A4), c); // 从 AB 方向逆时针转过 ∠C（转向 AC 一侧）
  const D4 = meet(A4, add(A4, dirAD), B4, C4);
  sketch($('jgA'), {
    P: { A: A4, B: B4, C: C4, D: D4 },
    seg: 'AB AC BC AD', ang: [['A', 'B', 'D', '1', 0.6], ['C', 'A', 'B', '2', 0.8]], w: 260, pad: 0.4,
  });
}

MProof.addBasis({
  'dy-xz': { t: '等边对等角', kind: '定理', src: '八上 2.5（课本 p60）', body: '等腰三角形的两底角相等．<br>在同一个三角形中：$AB=AC$ ⇒ $\\angle B=\\angle C$．' },
  'dy-pd': { t: '等角对等边', kind: '定理', src: '八上 2.5（课本 p62）', body: '有两个角相等的三角形是等腰三角形．<br>在同一个三角形中：$\\angle B=\\angle C$ ⇒ $AB=AC$．' },
  'rt-mid': { t: '直角三角形斜边上的中线等于斜边的一半', kind: '定理', src: '八上 2.5（课本 p65）', body: '在 $\\text{Rt}\\triangle ABC$ 中，$\\angle ACB=90^\\circ$，$D$ 是 $AB$ 的中点 ⇒ $CD=\\dfrac12AB$．' },
  'eq-60': { t: '有一个角是 60° 的等腰三角形是等边三角形', kind: '定理', src: '八上 2.5（课本 p63）', body: '等腰三角形中有一个角是 $60^\\circ$（不论顶角还是底角）⇒ 三个角都是 $60^\\circ$ ⇒ 等边三角形．' },
});

window.LESSON = {
  init() {
    MProof.init();
    initThree();
    initCons2();
    initEqui();
    initThales();
    initSketches();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
