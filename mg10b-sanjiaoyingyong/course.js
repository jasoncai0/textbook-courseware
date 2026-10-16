'use strict';
/* 高一下 11.3 余弦定理、正弦定理的应用 · 本课互动：河对岸测距模拟、海上救援时间轴、力的三角形、半圆面积最值。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const D2R = Math.PI / 180;
const val = (v) => (typeof v === 'function' ? v() : v);
const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const ang = (p, q) => Math.atan2(q[1] - p[1], q[0] - p[0]);
const add = (p, q, k = 1) => [p[0] + k * q[0], p[1] + k * q[1]];
/* 顶点 V 的内角（由三边算，0～π） */
const angleAt = (V, P, Q) => {
  const [a, b] = [[P[0] - V[0], P[1] - V[1]], [Q[0] - V[0], Q[1] - V[1]]];
  return Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b)))));
};

function angleArc(b, V, P, Q, r, o) {
  const span = () => {
    const s = ang(val(V), val(P));
    let d = ang(val(V), val(Q)) - s;
    while (d <= -Math.PI) d += 2 * Math.PI;
    while (d > Math.PI) d -= 2 * Math.PI;
    return [s, d];
  };
  return b.curve((t) => { const [s, d] = span(); const v = val(V); return [v[0] + r * Math.cos(s + d * t), v[1] + r * Math.sin(s + d * t)]; }, 0, 1, o);
}
function bisect(V, P, Q, r) {
  const v = val(V);
  const u1 = ang(v, val(P));
  const u2 = ang(v, val(Q));
  const x = Math.cos(u1) + Math.cos(u2);
  const y = Math.sin(u1) + Math.sin(u2);
  const n = Math.hypot(x, y) || 1;
  return [v[0] + (r * x) / n, v[1] + (r * y) / n];
}
function addMarker(b, id, color) {
  b.svg.querySelector('defs').insertAdjacentHTML('beforeend',
    `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker>`);
}
const arrow = (b, s, id, cls = 'c1') => b.seg(s, { cls }).setAttribute('marker-end', `url(#${id})`);
const label = (b, list) => list.forEach(([p, n, dx, dy]) => { b.pt(p); b.text(p, n, { dx, dy }); });

/* 第 4 页：例 1 测量模拟。A、B 固定（按课本数据算出），C、D 在岸上可拖动 */
function initRiver() {
  const deg = (r) => r / D2R;
  const DA = (100 * Math.sin(47 * D2R)) / Math.sin(48 * D2R);
  const DB = (100 * Math.sin(72 * D2R)) / Math.sin(48 * D2R);
  const A = [DA * Math.cos(85 * D2R), DA * Math.sin(85 * D2R)];
  const B = [DB * Math.cos(60 * D2R), DB * Math.sin(60 * D2R)];
  const TRUE_AB = dist(A, B);
  const GAP = 30;
  const s = { d: 0, c: 100 };
  const D = () => [s.d, 0];
  const C = () => [s.c, 0];
  const b = board($('river'), { x: [-70, 200], y: [-26, 140], axes: false, grid: false, w: 600 });
  b.poly([[-70, 10], [200, 10], [200, 90], [-70, 90]], { cls: 'water' });
  b.seg([[-70, 0], [200, 0]], { cls: 'thin' });
  [[D, A], [D, B], [C, A], [C, B]].forEach(([p, q]) => b.seg(() => [p(), q], { cls: 'c1' }));
  b.seg(() => [D(), C()], { cls: 'c3' });
  b.seg([A, B], { cls: 'c2 dash2' });
  label(b, [[A, 'A', -24, -6], [B, 'B', 8, -8]]);
  b.text(D, 'D', { dx: -8, dy: 30 });
  b.text(C, 'C', { dx: -8, dy: 30 });
  b.drag(D, (x) => { s.d = Math.max(-60, Math.min(s.c - GAP, x)); });
  b.drag(C, (x) => { s.c = Math.min(190, Math.max(s.d + GAP, x)); });
  const round = $('rvRound');
  b.onUpdate = () => {
    const r = (v) => (round.checked ? Math.round(v) : v);
    const m = {
      CD: s.c - s.d,
      ADC: r(deg(angleAt(D(), A, C()))), BDC: r(deg(angleAt(D(), B, C()))),
      ACD: r(deg(angleAt(C(), A, D()))), BCD: r(deg(angleAt(C(), B, D()))),
    };
    const sin = (x) => Math.sin(x * D2R);
    const AC = (m.CD * sin(m.ADC)) / sin(180 - m.ADC - m.ACD);
    const BC = (m.CD * sin(m.BDC)) / sin(180 - m.BDC - m.BCD);
    const ACB = Math.abs(m.BCD - m.ACD);
    const AB = Math.sqrt(AC * AC + BC * BC - 2 * AC * BC * Math.cos(ACB * D2R));
    const f = (v) => fmt(v, round.checked ? 0 : 1);
    $('rvTab').innerHTML = '<tr><th>$CD$/m</th><th>$\\angle ADC$</th><th>$\\angle BDC$</th><th>$\\angle ACD$</th><th>$\\angle BCD$</th></tr>'
      + `<tr><td>${fmt(m.CD, 1)}</td><td>${f(m.ADC)}°</td><td>${f(m.BDC)}°</td><td>${f(m.ACD)}°</td><td>${f(m.BCD)}°</td></tr>`;
    $('rvRes').innerHTML = `算得 $AC\\approx${fmt(AC)}$，$BC\\approx${fmt(BC)}$，$\\angle ACB\\approx${f(ACB)}^\\circ$，<b>$AB\\approx${fmt(AB)}$ m</b>（真实 $AB=${fmt(TRUE_AB)}$ m）`;
    tex($('rvTab')); tex($('rvRes'));
  };
  round.addEventListener('change', () => b.update());
  b.update();
}

/* 第 6 页：例 2 海上救援。北为 +y，方位角 θ 对应方向 (sin θ, cos θ) */
function initSea() {
  const dir = (t) => [Math.sin(t * D2R), Math.cos(t * D2R)];
  const C = [10 * dir(45)[0], 10 * dir(45)[1]];
  const HEAD = 45 + Math.asin((3 * Math.sqrt(3)) / 14) / D2R; // 舰艇航向（方位角）
  const MEET = 2 / 3;
  const Bm = add(C, dir(105), 9 * MEET);
  const s = { t: 0 };
  const fish = () => add(C, dir(105), (9 * s.t) / 60);
  const ship = () => [((21 * s.t) / 60) * dir(HEAD)[0], ((21 * s.t) / 60) * dir(HEAD)[1]];
  const b = board($('sea'), { x: [-2, 18], y: [-1.6, 11], axes: false, grid: false, w: 600 });
  addMarker(b, 'nAr', '#556575');
  b.poly([[16.2, 4.6], [17.4, 4.2], [17.6, 5.2], [16.6, 5.6]], { cls: 'island' });
  arrow(b, [[0, 0], [0, 4]], 'nAr', 'thin');
  arrow(b, [C, [C[0], C[1] + 3]], 'nAr', 'thin');
  b.text([0, 4], '北', { cls: 'lb up', dx: -8, dy: -8 });
  b.text([C[0], C[1] + 3], '北', { cls: 'lb up', dx: -8, dy: -8 });
  b.seg([[0, 0], C], { cls: 'c1' });
  b.seg([C, add(C, dir(105), 10)], { cls: 'dash' });
  b.seg([[0, 0], Bm], { cls: 'dash' });
  b.seg(() => [C, fish()], { cls: 'c3' });
  b.seg(() => [[0, 0], ship()], { cls: 'c2' });
  b.curve((t) => [2.2 * Math.sin(t * D2R), 2.2 * Math.cos(t * D2R)], 0, 45, { cls: 'thin' });
  b.curve((t) => [C[0] + 1.2 * Math.sin(t * D2R), C[1] + 1.2 * Math.cos(t * D2R)], 0, 105, { cls: 'thin' });
  b.text([0.8, 2.6], '45°', { cls: 'lb up' });
  b.text([C[0] + 1.3, C[1] + 1.2], '105°', { cls: 'lb up' });
  label(b, [[[0, 0], 'A', -24, 10], [C, 'C', -26, -4], [Bm, 'B', 6, 26]]);
  b.pt(fish, { cls: 'c3d', r: 7 });
  b.pt(ship, { cls: 'c2', r: 7 });
  slider($('seaT'), (v) => {
    s.t = v;
    b.update();
    const d = dist(fish(), ship());
    $('seaTV').textContent = `${v} min`;
    $('seaInfo').innerHTML = `舰艇（橙）沿方位角 ${fmt(HEAD, 1)}° 航行 ${fmt((21 * v) / 60)} n mile；渔轮（绿）航行 ${fmt((9 * v) / 60)} n mile；两船相距 <b>${fmt(d)}</b> n mile${d < 1e-6 ? '——<b>靠拢！</b>' : ''}`;
  });
}

/* 第 7 页：例 3 力的平行四边形，1 N 画成 0.06 单位 */
function initForce() {
  const K = 0.06;
  const F1 = [30 * K * Math.cos(120 * D2R), 30 * K * Math.sin(120 * D2R)];
  const F2 = [50 * K * Math.cos(60 * D2R), 50 * K * Math.sin(60 * D2R)];
  const F = add(F1, F2);
  const F3 = [-F[0], -F[1]];
  const O = [0, 0];
  const b = board($('force'), { x: [-2.6, 3.2], y: [-4.6, 4.6], axes: false, grid: false, w: 360 });
  addMarker(b, 'fAr', '#1d6fa5');
  addMarker(b, 'fAr2', '#d9711c');
  b.seg([F1, F], { cls: 'dash' });
  b.seg([F2, F], { cls: 'dash' });
  arrow(b, [O, F1], 'fAr');
  arrow(b, [O, F2], 'fAr');
  arrow(b, [O, F], 'fAr2', 'c2 dash2');
  arrow(b, [O, F3], 'fAr2', 'c2');
  angleArc(b, O, F1, F2, 0.6, { cls: 'c3' });
  angleArc(b, O, F1, F3, 0.45, { cls: 'c3' });
  b.text(bisect(O, F1, F2, 0.95), '60°', { cls: 'lb up', dx: -12, dy: 6 });
  b.text(bisect(O, F1, F3, 0.8), `${fmt(angleAt(O, F1, F3) / D2R, 1)}°`, { cls: 'lb up', dx: -44, dy: 4 });
  b.pt(O);
  b.text(O, 'O', { dx: 10, dy: 8 });
  b.text(F1, 'F₁', { dx: -26, dy: 0 });
  b.text(F2, 'F₂', { dx: 8, dy: 0 });
  b.text(F, 'F', { dx: 10, dy: 4 });
  b.text(F3, 'F₃', { dx: 8, dy: 0 });
  b.update();
}

/* 第 8 页：例 4 半圆 O（半径 1），OA = 2，拖动 B，等边 △ABC 在远离 O 的一侧 */
function initSemi4() {
  const A = [2, 0];
  const s = { a: Math.PI / 2 };
  const B = () => [Math.cos(s.a), Math.sin(s.a)];
  const C = () => { const [x, y] = [B()[0] - A[0], B()[1] - A[1]]; const c = 0.5; const sn = Math.sqrt(3) / 2; return [A[0] + x * c + y * sn, A[1] - x * sn + y * c]; };
  const S = (a) => Math.sin(a) + (Math.sqrt(3) / 4) * (5 - 4 * Math.cos(a));
  const b = board($('semi4'), { x: [-1.5, 3.6], y: [-0.6, 3.7], axes: false, grid: false, w: 460 });
  b.curve((t) => [Math.cos(t), Math.sin(t)], 0, Math.PI, { cls: 'thin' });
  b.seg([[-1, 0], A], { cls: 'thin' });
  b.poly(() => [[0, 0], A, C(), B()], { cls: 'fill1' });
  b.poly(() => [A, C(), B()], { cls: 'fill2' });
  b.seg(() => [[0, 0], B()], { cls: 'c1' });
  b.seg(() => [A, B()], { cls: 'c2' });
  angleArc(b, [0, 0], A, B, 0.28, { cls: 'c3' });
  b.text(() => bisect([0, 0], A, B, 0.45), 'α', { dx: -4, dy: 6 });
  label(b, [[[0, 0], 'O', -6, 26], [A, 'A', 6, 26]]);
  b.pt(C);
  b.text(C, 'C', { dx: 8, dy: -8 });
  b.text(B, 'B', { dx: -22, dy: -10 });
  b.drag(B, (x, y) => { s.a = Math.min(Math.PI - 0.02, Math.max(0.02, Math.atan2(Math.max(y, 0), x))); });
  const g = board($('area4'), { x: [-0.3, 3.45], y: [-0.7, 4.9], w: 460, h: 230, ticks: [Math.PI / 6, 1], tickLabels: false, labels: ['α', 'S'] });
  ['π/6', 'π/3', 'π/2', '2π/3', '5π/6', 'π'].forEach((t, i) => g.text([((i + 1) * Math.PI) / 6, 0], t, { cls: 'tk', dx: -10, dy: 18 }));
  [1, 2, 3, 4].forEach((y) => g.text([0, y], String(y), { cls: 'tk', dx: -14, dy: 5 }));
  g.fn(S, { from: 0, to: Math.PI });
  g.seg([[(5 * Math.PI) / 6, 0], [(5 * Math.PI) / 6, S((5 * Math.PI) / 6)]], { cls: 'dash' });
  g.pt(() => [s.a, S(s.a)], { cls: 'c2', r: 8 });
  b.onUpdate = () => {
    g.update();
    $('area4V').innerHTML = `$\\alpha\\approx${fmt(s.a / D2R, 1)}^\\circ$，$AB^2=5-4\\cos\\alpha\\approx${fmt(5 - 4 * Math.cos(s.a))}$，面积 $S\\approx${fmt(S(s.a), 3)}$`;
    tex($('area4V'));
  };
  b.update();
}

window.LESSON = {
  init() {
    initRiver();
    initSea();
    initForce();
    initSemi4();
  },
};
