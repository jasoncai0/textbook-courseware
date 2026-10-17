'use strict';
/* 九上 2.3 确定圆的条件 · 本课互动：过一点/两点作圆、拖动三点找外心（图 2-18～2-20）、尺规作外接圆、已知弧找圆心。
 * 作图板横纵同比例；垂直平分线、交点（外心）、圆规弧都由坐标精确计算。 */
const { board, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const polar = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] + r * Math.sin(deg * RAD)];
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const angOf = (c, p) => ((Math.atan2(p[1] - c[1], p[0] - c[0]) / RAD) + 360) % 360;
const FAR = 30;
/** 线段 PQ 的垂直平分线（画成很长的线段，由作图板裁剪） */
function bisector(P, Q) {
  const M = mid(P, Q);
  const L = dist(P, Q) || 1;
  const n = [-(Q[1] - P[1]) / L, (Q[0] - P[0]) / L];
  return [[M[0] - FAR * n[0], M[1] - FAR * n[1]], [M[0] + FAR * n[0], M[1] + FAR * n[1]]];
}
const COLLINEAR = 0.05;
/** 外心；三点（近似）共线时返回 null */
function circumcenter(A, B, C) {
  const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
  if (Math.abs(d) < COLLINEAR) return null;
  const a2 = A[0] ** 2 + A[1] ** 2;
  const b2 = B[0] ** 2 + B[1] ** 2;
  const c2 = C[0] ** 2 + C[1] ** 2;
  return [(a2 * (B[1] - C[1]) + b2 * (C[1] - A[1]) + c2 * (A[1] - B[1])) / d, (a2 * (C[0] - B[0]) + b2 * (A[0] - C[0]) + c2 * (B[0] - A[0])) / d];
}
const circle = (b, c, r, o = {}) => b.curve((t) => polar(typeof c === 'function' ? c() : c, typeof r === 'function' ? r() : r, t), 0, 360, o);
const clampXY = (x, y, X, Y) => [Math.max(-X, Math.min(X, x)), Math.max(-Y, Math.min(Y, y))];

/* 第 3 页：过一点、过两点 */
const KEEP_MAX = 8;
function initFew() {
  const A = [-0.9, -0.2];
  const B = [1.1, 0.5];
  const s = { two: false, O: [0.5, 0.9], kept: [] };
  const b = board($('few'), { x: [-4.2, 4.2], y: [-3.4, 3.4], axes: false, grid: false, w: 540 });
  const proj = (p) => { // 投影到 AB 的垂直平分线
    const M = mid(A, B);
    const [[x1, y1], [x2, y2]] = bisector(A, B);
    const u = [(x2 - x1) / (2 * FAR), (y2 - y1) / (2 * FAR)];
    const t = (p[0] - M[0]) * u[0] + (p[1] - M[1]) * u[1];
    return [M[0] + t * u[0], M[1] + t * u[1]];
  };
  Array.from({ length: KEEP_MAX }, (_, i) => i).forEach((i) => {
    circle(b, () => (s.kept[i] || [99, 99]), () => (s.kept[i] ? dist(s.kept[i], A) : 0.01), { cls: 'kept' });
    b.pt(() => s.kept[i] || null, { r: 3, cls: 'kp' });
  });
  b.seg(() => (s.two ? bisector(A, B) : [[0, 0], [0, 0]]), { cls: 'bis' });
  circle(b, () => s.O, () => dist(s.O, A), { cls: 'c1' });
  b.seg(() => [s.O, A], { cls: 'dash' });
  b.pt(A); b.pt(() => (s.two ? B : null));
  b.text(A, 'A', { dx: -20, dy: 18 });
  b.text(() => (s.two ? B : null), 'B', { dx: 8, dy: 18 });
  b.text(() => s.O, 'O', { dx: 10, dy: -10 });
  b.drag(() => s.O, (x, y) => { const p = clampXY(x, y, 3.8, 2.8); s.O = s.two ? proj(p) : p; });
  b.onUpdate = () => {
    const msg = $('fewMsg');
    msg.className = 'tip feedback';
    msg.textContent = s.two
      ? `圆心在 AB 的垂直平分线上：OA = OB = ${fmt(dist(s.O, A))}。已留下 ${s.kept.length} 个圆。`
      : `圆心 O 可以放在任何位置，半径 OA = ${fmt(dist(s.O, A))}。已留下 ${s.kept.length} 个圆。`;
  };
  const mode = (two) => {
    s.two = two; s.kept = [];
    s.O = two ? proj(s.O) : s.O;
    $('fewOne').classList.toggle('solid', !two);
    $('fewTwo').classList.toggle('solid', two);
    b.update();
  };
  $('fewOne').addEventListener('click', () => mode(false));
  $('fewTwo').addEventListener('click', () => mode(true));
  $('fewKeep').addEventListener('click', () => { s.kept = [...s.kept, [...s.O]].slice(-KEEP_MAX); b.update(); });
  b.update();
}

/* 第 4 页：拖动三点 */
const START = { A: [-1.2, 1.7], B: [-2.2, -1.2], C: [1.9, -1.0] };
const LINE = { A: [-2.6, -0.6], B: [-0.6, -0.1], C: [1.8, 0.5] };
function angleAt(V, P, Q) {
  const u = [P[0] - V[0], P[1] - V[1]];
  const v = [Q[0] - V[0], Q[1] - V[1]];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))))) / RAD;
}
function initTri() {
  const s = { ...START };
  const b = board($('tri'), { x: [-4.2, 4.2], y: [-3.4, 3.4], axes: false, grid: false, w: 540 });
  const O = () => circumcenter(s.A, s.B, s.C);
  circle(b, () => O() || [99, 99], () => (O() ? dist(O(), s.A) : 0.01), { cls: 'c1' });
  b.seg(() => bisector(s.A, s.C), { cls: 'bis3' });
  b.seg(() => bisector(s.A, s.B), { cls: 'bis' });
  b.seg(() => bisector(s.B, s.C), { cls: 'bis2' });
  b.poly(() => [s.A, s.B, s.C], { cls: 'trif' });
  b.seg(() => (O() ? [O(), s.A] : [[0, 0], [0, 0]]), { cls: 'dash' });
  b.seg(() => (O() ? [O(), s.B] : [[0, 0], [0, 0]]), { cls: 'dash' });
  b.seg(() => (O() ? [O(), s.C] : [[0, 0], [0, 0]]), { cls: 'dash' });
  b.pt(O, { cls: 'c2', r: 6 });
  b.text(O, 'O', { dx: 8, dy: -8 });
  b.text(() => { const M = mid(s.A, s.B); const [, q] = bisector(s.A, s.B); const k = 1.6 / FAR; return [M[0] + (q[0] - M[0]) * k, M[1] + (q[1] - M[1]) * k]; }, 'l₁', { cls: 'lb o', dx: 4, dy: -4 });
  b.text(() => { const M = mid(s.B, s.C); const [, q] = bisector(s.B, s.C); const k = 1.6 / FAR; return [M[0] + (q[0] - M[0]) * k, M[1] + (q[1] - M[1]) * k]; }, 'l₂', { cls: 'lb g', dx: 4, dy: -4 });
  ['A', 'B', 'C'].forEach((k) => {
    b.text(() => s[k], k, { dx: 10, dy: -10 });
    b.drag(() => s[k], (x, y) => { s[k] = clampXY(x, y, 4, 3.2); });
  });
  b.onUpdate = () => {
    const o = O();
    const angs = [angleAt(s.A, s.B, s.C), angleAt(s.B, s.A, s.C), angleAt(s.C, s.A, s.B)];
    const mx = Math.max(...angs);
    const msg = $('triMsg');
    if (!o) {
      $('triR').textContent = '—';
      $('triAng').textContent = '—';
      msg.className = 'tip feedback fb-warn';
      msg.textContent = 'A、B、C 在同一条直线上：l₁ ∥ l₂，没有交点，不能作出经过三点的圆。';
      return;
    }
    const r = [dist(o, s.A), dist(o, s.B), dist(o, s.C)].map((v) => fmt(v)).join(' / ');
    $('triR').textContent = r;
    const deg = Math.round(mx);
    $('triAng').textContent = `${deg}°`;
    msg.className = 'tip feedback fb-ok';
    msg.textContent = deg === 90
      ? '直角三角形：外心 O 在斜边的中点上。'
      : (deg < 90 ? '锐角三角形：外心 O 在三角形的内部。' : '钝角三角形：外心 O 在三角形的外部。');
  };
  const put = (P) => { Object.assign(s, { A: [...P.A], B: [...P.B], C: [...P.C] }); b.update(); };
  $('triLine').addEventListener('click', () => put(LINE));
  $('triBack').addEventListener('click', () => put(START));
  b.update();
}

/* 第 5 页：图 2-20 静态 */
function initThm() {
  const A = [0.9, 1.6];
  const B = [-1.8, -0.9];
  const C = [1.5, -0.9];
  const O = circumcenter(A, B, C);
  const b = board($('thm'), { x: [-2.6, 2.6], y: [-2.3, 2.4], axes: false, grid: false, w: 420 });
  circle(b, O, dist(O, A), { cls: 'thin dk' });
  b.seg(bisector(A, B), { cls: 'bis' });
  b.seg(bisector(B, C), { cls: 'bis2' });
  b.poly([A, B, C], { cls: 'trif' });
  [[O, A], [O, B], [O, C]].forEach((sg) => b.seg(sg, { cls: 'dash' }));
  [[A, 'A', 8, -6], [B, 'B', -20, 8], [C, 'C', 8, 14], [O, 'O', 8, -8]].forEach(([p, n, dx, dy]) => { b.pt(p, { r: 3 }); b.text(p, n, { dx, dy }); });
  b.text(bisector(A, B)[1], 'l₁', { cls: 'lb o' });
  b.text(bisector(B, C)[0], 'l₂', { cls: 'lb g' });
}

/* 第 6 页：尺规作外接圆 */
function compassMarks(P, Q, k) {
  const d = dist(P, Q);
  const r = k * d;
  const M = mid(P, Q);
  const h = Math.sqrt(r * r - (d / 2) ** 2);
  const n = [-(Q[1] - P[1]) / d, (Q[0] - P[0]) / d];
  const X1 = [M[0] + h * n[0], M[1] + h * n[1]];
  const X2 = [M[0] - h * n[0], M[1] - h * n[1]];
  const SPAN = 14;
  const arcs = [];
  [P, Q].forEach((c) => [X1, X2].forEach((X) => { const a = angOf(c, X); arcs.push({ c, r, a0: a - SPAN, a1: a + SPAN }); }));
  return { arcs, X1, X2 };
}
function initCons() {
  const A = [0.4, 1.8];
  const B = [-2.1, -1.1];
  const C = [1.9, -1.1];
  const O = circumcenter(A, B, C);
  const m1 = compassMarks(A, B, 0.62);
  const m2 = compassMarks(B, C, 0.62);
  const s = { k: 0 };
  const LAST = 5;
  const b = board($('cons'), { x: [-3, 3], y: [-2.9, 2.8], axes: false, grid: false, w: 480 });
  const arcItem = (m, i, from) => b.curve((t) => polar(m.arcs[i].c, m.arcs[i].r, t), () => (s.k >= from ? m.arcs[i].a0 : 0), () => (s.k >= from ? m.arcs[i].a1 : 0), { cls: 'cmp' });
  [0, 1, 2, 3].forEach((i) => { arcItem(m1, i, 1); arcItem(m2, i, 3); });
  b.seg(() => (s.k >= 2 ? bisector(A, B) : [[0, 0], [0, 0]]), { cls: 'bis' });
  b.seg(() => (s.k >= 3 ? bisector(B, C) : [[0, 0], [0, 0]]), { cls: 'bis2' });
  b.pt(() => (s.k >= 1 && s.k < 3 ? m1.X1 : null), { r: 4, cls: 'xp' });
  b.pt(() => (s.k >= 1 && s.k < 3 ? m1.X2 : null), { r: 4, cls: 'xp' });
  b.pt(() => (s.k === 3 ? m2.X1 : null), { r: 4, cls: 'xp' });
  b.pt(() => (s.k === 3 ? m2.X2 : null), { r: 4, cls: 'xp' });
  circle(b, () => (s.k >= 5 ? O : [99, 99]), () => (s.k >= 5 ? dist(O, A) : 0.01), { cls: 'c1' });
  b.seg(() => (s.k >= 5 ? [O, A] : [[0, 0], [0, 0]]), { cls: 'dash' });
  b.poly([A, B, C], { cls: 'trif' });
  b.pt(() => (s.k >= 4 ? O : null), { cls: 'c2', r: 6 });
  b.text(() => (s.k >= 4 ? O : null), 'O', { dx: 8, dy: -8 });
  b.text(() => (s.k >= 2 ? bisector(A, B)[1] : null), 'l₁', { cls: 'lb o' });
  b.text(() => (s.k >= 3 ? bisector(B, C)[0] : null), 'l₂', { cls: 'lb g' });
  [[A, 'A', 8, -6], [B, 'B', -20, 10], [C, 'C', 8, 16]].forEach(([p, n, dx, dy]) => { b.pt(p, { r: 3 }); b.text(p, n, { dx, dy }); });
  const render = () => {
    $('consSteps').querySelectorAll('li').forEach((li, i) => { li.classList.toggle('now', i === s.k); li.classList.toggle('done', i < s.k); });
    $('consPrev').disabled = s.k === 0;
    $('consNext').disabled = s.k === LAST;
    b.update();
  };
  $('consNext').addEventListener('click', () => { s.k = Math.min(LAST, s.k + 1); render(); });
  $('consPrev').addEventListener('click', () => { s.k = Math.max(0, s.k - 1); render(); });
  render();
}

/* 第 7 页：已知弧找圆心（半径 2，圆心角 110°） */
function initArcCenter() {
  const O = [0, -0.9];
  const R = 2;
  const A = polar(O, R, 145);
  const B = polar(O, R, 35);
  const C = polar(O, R, 75);
  const s = { on: false };
  const b = board($('arcc'), { x: [-2.6, 2.6], y: [-1.5, 1.6], axes: false, grid: false, w: 480 });
  b.curve((t) => polar(O, R, t), 35, 145, { cls: 'c1 thick' });
  b.curve((t) => polar(O, R, t), () => (s.on ? -35 : 35), 35, { cls: 'ghost' });
  b.curve((t) => polar(O, R, t), 145, () => (s.on ? 215 : 145), { cls: 'ghost' });
  b.seg(() => (s.on ? [A, C] : [A, A]), { cls: 'chd' });
  b.seg(() => (s.on ? [C, B] : [B, B]), { cls: 'chd' });
  b.seg(() => (s.on ? bisector(A, C) : [[0, 0], [0, 0]]), { cls: 'bis' });
  b.seg(() => (s.on ? bisector(C, B) : [[0, 0], [0, 0]]), { cls: 'bis2' });
  b.pt(() => (s.on ? O : null), { cls: 'c2', r: 6 });
  b.text(() => (s.on ? O : null), 'O', { dx: 8, dy: 4 });
  b.pt(A, { r: 3 }); b.pt(B, { r: 3 }); b.pt(() => (s.on ? C : null), { r: 3 });
  b.text(A, 'A', { dx: -20, dy: 6 });
  b.text(B, 'B', { dx: 8, dy: 6 });
  b.text(() => (s.on ? C : null), 'C', { dx: 4, dy: -8 });
  $('arccGo').addEventListener('click', () => {
    s.on = !s.on;
    $('arccGo').textContent = s.on ? '收起作图' : '作图找圆心';
    b.update();
  });
  b.update();
}

window.LESSON = {
  init() {
    initFew();
    initTri();
    initThm();
    initCons();
    initArcCenter();
  },
};
