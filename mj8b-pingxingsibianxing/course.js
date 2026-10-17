'use strict';
/* 八下 9.3 平行四边形 · 本课互动：格点拖顶点判断平行四边形、透明纸绕 AC 中点转 180°、中心对称性的分步证实（随翻页）、
 * 拖动平行四边形读性质、例题分步高亮、证明搭积木、“条件检验台”（按条件作图，看是否一定是平行四边形）、例 2/例 3 滑块、反证法。
 * 通用部分见 ../shared/math.js、mgeo.js、mproof.js、mcheck.js；所有图形由坐标或条件精确计算（圆的交点、直线交点、二分法求解）。 */
const { fmt, slider } = MathKit;
const { add, sub, mul, dist, dir, ang, rot, angle, lerp, meet, len } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const HIDE = [99, 99];
const lab = (b, p, t, dx, dy, cls) => b.text(p, t, { dx, dy, cls });
const cross = (u, v) => u[0] * v[1] - u[1] * v[0];
const isPara = (P) => len(sub(sub(P[0], P[1]), sub(P[3], P[2]))) < 1e-6; // A − B = D − C
const deg = (v) => `${fmt(v, 1)}°`;
const stg = { prf: 0, ex1: 0 };

MProof.addBasis({
  'px-def': { t: '平行四边形的定义', kind: '定义', src: '八下 9.3（课本 p64）', body: '两组对边分别平行的四边形叫做平行四边形．<br>判定：$AB\\parallel DC$，$AD\\parallel BC$ ⇒ 四边形 $ABCD$ 是平行四边形．' },
  'px-db': { t: '平行四边形的对边相等', kind: '定理', src: '八下 9.3（课本 p65）', body: '平行四边形的对边相等，对角相等，对角线互相平分．' },
  'px-db2': { t: '平行四边形的对边平行且相等', kind: '定理', src: '八下 9.3（课本 p64–65）', body: '由定义，平行四边形的对边平行；由性质定理，平行四边形的对边相等．' },
  'px-djx': { t: '平行四边形的对角线互相平分', kind: '定理', src: '八下 9.3（课本 p65）', body: '▱$ABCD$ 的对角线 $AC$、$BD$ 交于 $O$ ⇒ $OA=OC$，$OB=OD$．' },
  'pd-1': { t: '一组对边平行且相等的四边形是平行四边形', kind: '判定', src: '八下 9.3（课本 p67）', body: '$AD\\parallel BC$，$AD=BC$ ⇒ 四边形 $ABCD$ 是平行四边形．' },
  'pd-2': { t: '两组对边分别相等的四边形是平行四边形', kind: '判定', src: '八下 9.3（课本 p67）', body: '$AB=CD$，$AD=BC$ ⇒ 四边形 $ABCD$ 是平行四边形．' },
  'pd-3': { t: '对角线互相平分的四边形是平行四边形', kind: '判定', src: '八下 9.3（课本 p69）', body: '$OA=OC$，$OB=OD$ ⇒ 四边形 $ABCD$ 是平行四边形．' },
  sas: { t: '两边及其夹角分别相等的两个三角形全等（SAS）', kind: '基本事实', src: '八上 1.3 探索三角形全等的条件', body: '两边及其夹角分别相等的两个三角形全等（简写成“边角边”或“SAS”）．' },
  sss: { t: '三边分别相等的两个三角形全等（SSS）', kind: '基本事实', src: '八上 1.3 探索三角形全等的条件', body: '三边分别相等的两个三角形全等（简写成“边边边”或“SSS”）．' },
  'qd-dj': { t: '全等三角形的对应角相等', kind: '性质', src: '八上 1.2 全等三角形', body: '全等三角形的对应边相等，对应角相等．' },
  'qd-dy': { t: '全等三角形的对应边相等', kind: '性质', src: '八上 1.2 全等三角形', body: '全等三角形的对应边相等，对应角相等．' },
});

/* 本课常用的一个平行四边形（O 为对角线交点，在原点） */
const PA = [[-1.4, 1.6], [-3.2, -1.6], [1.4, -1.6], [3.2, 1.6]];
const PN = ['A', 'B', 'C', 'D'];
const POFF = [[-6, -10], [-20, 18], [4, 22], [6, -8]];
const labQuad = (b, P, names = PN, off = POFF, cls) => names.forEach((n, i) => lab(b, () => (typeof P === 'function' ? P()[i] : P[i]), n, ...off[i], cls));

/* ---------- 第 3 页：格点上拖顶点 ---------- */
function initDef() {
  const s = { P: [[2, 5], [1, 1], [7, 1], [6, 5]] };
  const b = Geo.board($('defq'), { x: [-0.5, 10.5], y: [-0.5, 6.5], w: 600, grid: true, ticks: 1 });
  b.poly(() => s.P, { cls: 'tri-o' });
  const par = (i, j, k, l) => cross(sub(s.P[j], s.P[i]), sub(s.P[l], s.P[k])) === 0;
  b.seg(() => (par(0, 1, 3, 2) ? [s.P[0], s.P[1]] : [HIDE, HIDE]), { cls: 'gs hl' });
  b.seg(() => (par(0, 1, 3, 2) ? [s.P[3], s.P[2]] : [HIDE, HIDE]), { cls: 'gs hl' });
  b.seg(() => (par(0, 3, 1, 2) ? [s.P[0], s.P[3]] : [HIDE, HIDE]), { cls: 'gs g2' });
  b.seg(() => (par(0, 3, 1, 2) ? [s.P[1], s.P[2]] : [HIDE, HIDE]), { cls: 'gs g2' });
  labQuad(b, () => s.P, PN, [[-8, -10], [-20, 18], [4, 22], [6, -10]]);
  [0, 1, 2, 3].forEach((i) => b.drag(() => s.P[i], (x, y) => {
    s.P = s.P.map((p, k) => (k === i ? [clamp(Math.round(x), 0, 10), clamp(Math.round(y), 0, 6)] : p));
  }, { r: 7, hit: 18 }));
  b.onUpdate = () => {
    const p1 = par(0, 1, 3, 2);
    const p2 = par(0, 3, 1, 2);
    $('dq1').textContent = p1 ? '平行 ✓' : '不平行';
    $('dq2').textContent = p2 ? '平行 ✓' : '不平行';
    const msg = $('dqMsg');
    msg.className = `tip feedback ${p1 && p2 ? 'fb-ok' : ''}`;
    msg.textContent = p1 && p2
      ? '两组对边分别平行：四边形 ABCD 是平行四边形！'
      : p1 || p2 ? '只有一组对边平行（这是梯形），还不是平行四边形。拖一个顶点试试。' : '两组对边都不平行。';
  };
  b.update();
}

/* ---------- 第 4 页：透明纸绕 O 转 180° ---------- */
function initSpin() {
  const s = { t: 0 };
  const b = Geo.board($('spin'), { x: [-4.4, 4.4], y: [-3.6, 3.6], w: 560 });
  b.poly(PA, { cls: 'tri-o' });
  b.seg([PA[0], PA[2]], { cls: 'gdash' });
  b.poly(() => PA.map((p) => rot(p, s.t, [0, 0])), { cls: 'shp-r' });
  b.pt([0, 0], { cls: 'ctr-p' });
  lab(b, [0, 0], 'O', 8, -6);
  labQuad(b, PA);
  b.onUpdate = () => {
    $('spinTV').textContent = `${s.t}°`;
    const msg = $('spinMsg');
    const done = s.t === 180;
    msg.className = `tip feedback ${done ? 'fb-ok' : ''}`;
    msg.textContent = done ? '转了 180°：透明纸上的▱ABCD 与原来的图形重合（A 到了 C 处，B 到了 D 处）。' : `转了 ${s.t}°，还没有重合。`;
  };
  slider($('spinT'), (v) => { s.t = v; b.update(); });
}

/* ---------- 第 5 页：分步证实中心对称（图 9-12） ---------- */
let prfBoard = null;
function initPrf() {
  const [A, B, C, D] = PA;
  const on = (k) => stg.prf >= k;
  const far = (P, Q) => add(P, mul(sub(Q, P), 1.25));
  const b = Geo.board($('prf'), { x: [-4.4, 4.4], y: [-3, 3], w: 560 });
  prfBoard = b;
  b.poly(PA, { cls: 'tri-o' });
  b.seg([A, C], { cls: 'gdash' });
  b.seg(() => (on(2) ? [C, far(C, D)] : [HIDE, HIDE]), { cls: 'gs hl' });
  b.seg(() => (on(4) ? [A, far(A, D)] : [HIDE, HIDE]), { cls: 'gs g2' });
  b.seg(() => (on(8) ? [B, D] : [HIDE, HIDE]), { cls: 'gdash r' });
  Geo.arc(b, A, B, C, { r: 0.6, label: '1', show: () => on(2) });
  Geo.arc(b, C, D, A, { r: 0.6, label: '2', show: () => on(2) });
  Geo.arc(b, A, D, C, { r: 0.8, label: '3', show: () => on(4), cls: 'garc g', lcls: 'lb up gnum g' });
  Geo.arc(b, C, B, A, { r: 0.8, label: '4', show: () => on(4), cls: 'garc g', lcls: 'lb up gnum g' });
  b.pt([0, 0], { cls: 'ctr-p' });
  b.pt(B, { cls: 'c2', show: () => on(6) }); b.pt(D, { cls: 'c2', show: () => on(6) });
  lab(b, [0, 0], 'O', 6, -8);
  lab(b, A, () => (on(1) ? 'A(C)' : 'A'), -30, -10);
  lab(b, C, () => (on(1) ? 'C(A)' : 'C'), 4, 24);
  lab(b, B, () => (on(6) ? 'B(D)' : 'B'), -30, 20);
  lab(b, D, () => (on(6) ? 'D(B)' : 'D'), 6, -8);
  b.update();
}

/* ---------- 第 6 页：拖动平行四边形读性质 ---------- */
function initProp() {
  const s = { A: [-1.2, 2], B: [-2.8, -1.4], C: [2.4, -1.4] };
  const P = () => [s.A, s.B, s.C, sub(add(s.A, s.C), s.B)];
  const O = () => lerp(s.A, s.C, 0.5);
  const b = Geo.board($('prop'), { x: [-4.6, 6.6], y: [-3, 4.4], w: 600 });
  b.poly(P, { cls: 'tri-o' });
  b.seg(() => [P()[0], P()[1]], { cls: 'gs hl' }); b.seg(() => [P()[2], P()[3]], { cls: 'gs hl' });
  b.seg(() => [P()[1], P()[2]], { cls: 'gs g2' }); b.seg(() => [P()[3], P()[0]], { cls: 'gs g2' });
  b.seg(() => [P()[0], P()[2]], { cls: 'gdash' }); b.seg(() => [P()[1], P()[3]], { cls: 'gdash' });
  Geo.arc(b, () => P()[0], () => P()[3], () => P()[1], { r: 0.45 });
  Geo.arc(b, () => P()[2], () => P()[1], () => P()[3], { r: 0.45 });
  Geo.arc(b, () => P()[1], () => P()[0], () => P()[2], { r: 0.45, cls: 'garc g' });
  Geo.arc(b, () => P()[3], () => P()[2], () => P()[0], { r: 0.45, cls: 'garc g' });
  b.pt(O, { cls: 'ctr-p' });
  lab(b, O, 'O', 8, 20);
  lab(b, () => P()[3], 'D', 8, -6);
  lab(b, () => s.A, 'A', -10, -14); lab(b, () => s.B, 'B', -24, 18); lab(b, () => s.C, 'C', 8, 22);
  b.drag(() => s.A, (x, y) => { s.A = [clamp(x, -3, 1.5), clamp(y, 0.6, 3.8)]; });
  b.drag(() => s.B, (x, y) => { s.B = [clamp(x, -4.2, -1.2), clamp(y, -2.6, -0.6)]; });
  b.drag(() => s.C, (x, y) => { s.C = [clamp(x, 0.6, 4), clamp(y, -2.6, -0.6)]; });
  b.onUpdate = () => {
    const [A, B, C, D] = P();
    const o = O();
    const set = (id, v) => { $(id).textContent = v; };
    set('pAB', fmt(dist(A, B))); set('pCD', fmt(dist(C, D))); set('pBC', fmt(dist(B, C))); set('pDA', fmt(dist(D, A)));
    set('pA', deg(angle(A, D, B))); set('pC', deg(angle(C, B, D))); set('pB', deg(angle(B, A, C))); set('pD', deg(angle(D, C, A)));
    set('pOA', fmt(dist(o, A))); set('pOC', fmt(dist(o, C))); set('pOB', fmt(dist(o, B))); set('pOD', fmt(dist(o, D)));
  };
  b.update();
}

/* ---------- 第 7 页：例 1（图 9-13） ---------- */
let ex1Board = null;
function initEx1() {
  const F = [0, 3]; const E = [6, 3]; const D = [4, -1.6];
  const A = lerp(F, E, 0.5); const B = lerp(F, D, 0.5); const C = lerp(E, D, 0.5);
  const b = Geo.board($('ex1'), { x: [-0.8, 6.8], y: [-2.2, 3.7], w: 520 });
  ex1Board = b;
  b.poly(() => (stg.ex1 >= 2 ? [A, B, C, E] : [HIDE, HIDE, HIDE]), { cls: 'fill-o' });
  b.poly(() => (stg.ex1 >= 4 ? [A, F, B, C] : [HIDE, HIDE, HIDE]), { cls: 'fill-g' });
  b.poly([F, E, D], { cls: 'tri-o' });
  b.poly([A, B, C], { cls: 'sqs' });
  [['F', F, -18, -6], ['E', E, 6, -6], ['D', D, 4, 20], ['A', A, -4, -10], ['B', B, -20, 14], ['C', C, 8, 14]].forEach(([n, p, dx, dy]) => lab(b, p, n, dx, dy));
  b.update();
}

/* ---------- 第 8 页：练习图 ---------- */
function initPractice() {
  const B = [0, 0]; const C = [3.4, 0]; const A = mul(dir(50), 2); const D = add(A, C);
  const b1 = Geo.board($('pr1'), { x: [-0.6, 5.2], y: [-0.6, 2.1], w: 360 });
  b1.poly([A, B, C, D], { cls: 'tri-o' });
  Geo.arc(b1, B, C, A, { r: 0.45, label: '50°', lr: 2.3 });
  [['A', A, -8, -6], ['B', B, -16, 16], ['C', C, 4, 18], ['D', D, 4, -6]].forEach(([n, p, dx, dy]) => lab(b1, p, n, dx, dy));
  b1.update();
  // OA = 3，OD = 5，AD = 7 ⇒ cos∠AOD = (9 + 25 − 49) / 30 = −1/2，∠AOD = 120°
  const OA = mul(dir(145), 3); const OD = mul(dir(25), 5);
  const Q = [OA, mul(OD, -1), mul(OA, -1), OD];
  const b2 = Geo.board($('pr2'), { x: [-5.2, 5.2], y: [-2.7, 2.7], w: 360 });
  b2.poly(Q, { cls: 'tri-o' });
  b2.seg([Q[0], Q[2]], { cls: 'gs' }); b2.seg([Q[1], Q[3]], { cls: 'gs' });
  b2.poly([Q[0], [0, 0], Q[3]], { cls: 'fill-o' });
  lab(b2, [0, 0], 'O', -6, 22);
  labQuad(b2, Q, PN, [[-8, -8], [-18, 14], [4, 20], [6, -6]]);
  b2.update();
}

/* ---------- 第 9 页：方格纸上 AD 与 BC 平行且相等 ---------- */
function initJd1() {
  const A = [2, 4]; const D = [6, 4];
  const s = { B: [1, 1] };
  const C = () => add(s.B, sub(D, A));
  const b = Geo.board($('jd1'), { x: [-0.5, 10.5], y: [-0.5, 5.5], w: 560, grid: true, ticks: 1 });
  b.poly(() => [A, s.B, C(), D], { cls: 'tri-o' });
  b.seg([A, D], { cls: 'gs hl' }); b.seg(() => [s.B, C()], { cls: 'gs hl' });
  b.seg(() => [A, C()], { cls: 'gdash' });
  lab(b, A, 'A', -8, -10); lab(b, D, 'D', 6, -10);
  lab(b, () => s.B, 'B', -20, 18); lab(b, () => C(), 'C', 6, 20);
  b.drag(() => s.B, (x, y) => { s.B = [clamp(Math.round(x), 0, 6), clamp(Math.round(y), 0, 2)]; });
  b.update();
}

/* ---------- 第 10 页：判定 2、3 的图 ---------- */
function initJd23() {
  const B = [0, 0]; const C = [4, 0]; const A = [1.2, 2.2]; const D = [5.2, 2.2];
  const b2 = Geo.board($('jd2'), { x: [-0.7, 6], y: [-0.6, 2.8], w: 360 });
  b2.poly([A, B, C, D], { cls: 'tri-o' });
  b2.seg([A, C], { cls: 'gdash' });
  Geo.arc(b2, A, B, C, { r: 0.55, label: '1' });
  Geo.arc(b2, C, D, A, { r: 0.55, label: '2' });
  labQuad(b2, [A, B, C, D], PN, [[-8, -6], [-16, 16], [4, 18], [4, -6]]);
  b2.update();
  const Q = [[-2, 1.4], [-3, -1], [2, -1.4], [3, 1]];
  const b3 = Geo.board($('jd3'), { x: [-3.7, 3.7], y: [-1.9, 1.9], w: 360 });
  b3.poly(Q, { cls: 'tri-o' });
  b3.seg([Q[0], Q[2]], { cls: 'gs' }); b3.seg([Q[1], Q[3]], { cls: 'gs' });
  lab(b3, [0, 0], 'O', -6, 22);
  labQuad(b3, Q, PN, [[-8, -6], [-16, 16], [4, 18], [4, -6]]);
  b3.update();
}

/* ---------- 第 11 页：条件检验台 ---------- */
function circleMeet(P, r1, Q, r2) {
  const d = dist(P, Q);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const m = add(P, mul(sub(Q, P), a / d));
  const n = mul([-(Q[1] - P[1]), Q[0] - P[0]], h / d);
  return [add(m, n), sub(m, n)];
}
/** 解 f(t) = 0（二分法），找不到变号区间时返回 null */
function solve(f, lo, hi) {
  let [a, b] = [lo, hi];
  if (f(a) * f(b) > 0) return null;
  for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; }
  return (a + b) / 2;
}
const B0 = [0, 0];
const C0 = [4, 0];
const LEN = 2.6;
const COND = {
  a: { ok: '是（定义）', build(u) { const A = mul(dir(55 + 70 * u), LEN); const D = meet(A, add(A, [1, 0]), C0, add(C0, A)); return { P: [A, B0, C0, D], o: [[0, 1], [3, 2]], g: [[0, 3], [1, 2]] }; },
    read: ([A, B, C, D]) => `AB 与 DC 方向夹角 ${deg(angle([0, 0], sub(A, B), sub(D, C)))}，AD 与 BC 方向夹角 ${deg(angle([0, 0], sub(D, A), sub(C, B)))}（都平行）` },
  b: { ok: '是（判定定理：两组对边分别相等）', build(u) { const A = mul(dir(55 + 70 * u), LEN); const D = circleMeet(A, 4, C0, LEN).find((p) => cross(sub(C0, A), sub(p, A)) * cross(sub(C0, A), sub(B0, A)) < 0); return { P: [A, B0, C0, D], o: [[0, 1], [3, 2]], g: [[0, 3], [1, 2]] }; },
    read: ([A, B, C, D]) => `作法：以 A 为圆心 4、以 C 为圆心 ${LEN} 画弧定 D。AB = ${fmt(dist(A, B))}，CD = ${fmt(dist(C, D))}，AD = ${fmt(dist(A, D))}，BC = ${fmt(dist(B, C))}` },
  c: { ok: '是（判定定理：一组对边平行且相等）', build(u) { const A = mul(dir(55 + 70 * u), LEN); return { P: [A, B0, C0, add(A, [4, 0])], o: [[0, 3], [1, 2]], g: [] }; },
    read: ([A, B, C, D]) => `作法：过 A 作 BC 的平行线，截取 AD = BC。AD = ${fmt(dist(A, D))}，BC = ${fmt(dist(B, C))}` },
  d: { ok: '是（判定定理：对角线互相平分）', diag: true, build(u) { const O = [2.2, 1.5]; const p = mul(dir(115 + 30 * u), 2.1); const q = mul(dir(200 + 25 * u), 2.4); return { P: [add(O, p), add(O, q), sub(O, p), sub(O, q)], o: [[0, 2]], g: [[1, 3]] }; },
    read: ([A, B, C, D]) => { const O = meet(A, C, B, D); return `OA = ${fmt(dist(O, A))}，OC = ${fmt(dist(O, C))}，OB = ${fmt(dist(O, B))}，OD = ${fmt(dist(O, D))}`; } },
  f: { ok: '是（可以证明，课本 p68 练习 1）', build(u) {
    const A = mul(dir(55 + 70 * u), LEN);
    const Dt = (t) => add(C0, mul(sub(A, B0), t));
    const t = solve((x) => angle(A, Dt(x), B0) - angle(C0, B0, Dt(x)), 0.2, 3) ?? 1;
    return { P: [A, B0, C0, Dt(t)], o: [[0, 1], [3, 2]], g: [] };
  },
    read: ([A, B, C, D]) => `作法：过 C 作 AB 的平行线，在上面找使 ∠A = ∠C 的点 D（数值求解）。∠A = ${deg(angle(A, D, B))}，∠C = ${deg(angle(C, B, D))}` },
  g: { ok: '是（可以证明，习题 9.3 第 5 题）', build(u) {
    const beta = 55 + 70 * u;
    const A = mul(dir(beta), LEN);
    const D = meet(A, add(A, dir(ang(sub(B0, A)) + 180 - beta)), C0, add(C0, dir(beta)));
    return { P: [A, B0, C0, D], o: [], g: [] };
  },
    read: ([A, B, C, D]) => `作法：只按角作图。∠A = ${deg(angle(A, D, B))}，∠C = ${deg(angle(C, B, D))}，∠B = ${deg(angle(B, A, C))}，∠D = ${deg(angle(D, C, A))}` },
  e: { ok: '不一定！', build(u) { const d = -1.3 + 2.6 * u; return { P: [[-d, 2.2], B0, C0, [4 + d, 2.2]], o: [[0, 3], [1, 2]], g: [[0, 1], [3, 2]] }; },
    read: ([A, B, C, D]) => `AD∥BC，AB = ${fmt(dist(A, B))}，CD = ${fmt(dist(C, D))}`, bad: '满足条件，却不是平行四边形——这是等腰梯形，一个反例就够了。' },
  i: { ok: '不一定！', diag: true, build(u) { const A = [0.8, 2.6]; const L = dist(A, C0); return { P: [A, B0, C0, mul(dir(18 + 30 * u), L)], o: [[0, 2], [1, 3]], g: [] }; },
    read: ([A, B, C, D]) => `AC = ${fmt(dist(A, C))}，BD = ${fmt(dist(B, D))}`, bad: '两条对角线相等，四边形却不是平行四边形——反例。' },
};
function initLab() {
  const s = { k: 'a', u: 0.3 };
  const cur = () => COND[s.k].build(s.u);
  const b = Geo.board($('lab'), { x: [-1.8, 7.2], y: [-1, 4.4], w: 560 });
  b.poly(() => cur().P, { cls: 'tri-o' });
  b.seg(() => (COND[s.k].diag ? [cur().P[0], cur().P[2]] : [HIDE, HIDE]), { cls: 'gdash' });
  b.seg(() => (COND[s.k].diag ? [cur().P[1], cur().P[3]] : [HIDE, HIDE]), { cls: 'gdash' });
  [0, 1].forEach((i) => {
    b.seg(() => { const h = cur().o[i]; return h ? [cur().P[h[0]], cur().P[h[1]]] : [HIDE, HIDE]; }, { cls: 'gs hl' });
    b.seg(() => { const h = cur().g[i]; return h ? [cur().P[h[0]], cur().P[h[1]]] : [HIDE, HIDE]; }, { cls: 'gs g2' });
  });
  labQuad(b, () => cur().P, PN, [[-8, -10], [-18, 18], [4, 22], [6, -10]]);
  b.onUpdate = () => {
    const c = COND[s.k];
    const P = cur().P;
    const para = isPara(P);
    $('labRead').textContent = `实测：${c.read(P)}`;
    const msg = $('labMsg');
    msg.className = `tip feedback ${para ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = para
      ? `这个图形是平行四边形（AB∥DC 且 AD∥BC）。结论：${c.ok}${c.bad ? '——但只是这一个位置恰好如此，再拖一拖。' : '拖动滑块，它始终是平行四边形。'}`
      : `这个图形不是平行四边形。${c.bad || ''}`;
  };
  slider($('labU'), (v) => { s.u = v; b.update(); });
  $('labBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = btn.dataset.k;
    $('labBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
}

/* ---------- 第 12、13 页：例 2、例 3 ---------- */
function initEx23() {
  const B = [0, 0]; const C = [4.4, 0]; const A = [1.2, 2.2]; const D = [5.6, 2.2];
  const s2 = { u: 1.4 };
  const b2 = Geo.board($('ex2'), { x: [-0.7, 6.3], y: [-0.7, 2.9], w: 520 });
  const E = () => add(A, [s2.u, 0]); const F = () => sub(C, [s2.u, 0]);
  b2.poly([A, B, C, D], { cls: 'tri-o' });
  b2.poly(() => [B, F(), D, E()], { cls: 'fill-o' });
  labQuad(b2, [A, B, C, D], PN, [[-8, -6], [-16, 16], [4, 18], [4, -6]]);
  lab(b2, E, 'E', -4, -8); lab(b2, F, 'F', -4, 20);
  b2.onUpdate = () => { $('ex2UV').textContent = fmt(s2.u, 1); };
  slider($('ex2U'), (v) => { s2.u = v; b2.update(); });

  const B3 = [0, 0]; const C3 = [4.6, 0]; const A3 = [1, 2.6]; const D3 = [5.6, 2.6];
  const O = lerp(A3, C3, 0.5);
  const u = mul(sub(C3, A3), 1 / dist(A3, C3));
  const s3 = { u: 1 };
  const E3 = () => add(A3, mul(u, s3.u)); const F3 = () => sub(C3, mul(u, s3.u));
  const b3 = Geo.board($('ex3'), { x: [-0.7, 6.3], y: [-0.7, 3.2], w: 520 });
  b3.poly([A3, B3, C3, D3], { cls: 'tri-o' });
  b3.seg([A3, C3], { cls: 'gs' }); b3.seg([B3, D3], { cls: 'gdash' });
  b3.poly(() => [E3(), B3, F3(), D3], { cls: 'fill-o' });
  b3.pt(O, { cls: 'ctr-p', r: 3 });
  labQuad(b3, [A3, B3, C3, D3], PN, [[-8, -6], [-16, 16], [4, 18], [4, -6]]);
  lab(b3, O, 'O', 4, -8); lab(b3, E3, 'E', -16, -4); lab(b3, F3, 'F', 6, 14);
  b3.onUpdate = () => { $('ex3UV').textContent = `${fmt(s3.u, 1)}（OA ≈ ${fmt(dist(O, A3))}）`; };
  slider($('ex3U'), (v) => { s3.u = v; b3.update(); });
}

/* ---------- 第 14 页：反证法（图 9-18） ---------- */
function initFz() {
  const O = [0, 0];
  const A = mul(dir(150), 2.6); const C = mul(A, -1);
  const OB = 2.4;
  const B = mul(dir(212), OB);
  const s = { t: 1.6 };
  const D = () => mul(dir(32), s.t);
  const b = Geo.board($('fz'), { x: [-3.6, 4.2], y: [-1.9, 2.6], w: 520 });
  b.poly(() => [A, B, C, D()], { cls: 'tri-o' });
  b.seg([A, C], { cls: 'gs' }); b.seg(() => [B, D()], { cls: 'gs' });
  b.seg([A, B], { cls: 'gs hl' }); b.seg(() => [C, D()], { cls: 'gs hl' });
  lab(b, O, 'O', -4, 22);
  labQuad(b, () => [A, B, C, D()], PN, [[-16, -4], [-16, 16], [4, 18], [6, -4]]);
  b.onUpdate = () => {
    $('fzUV').textContent = fmt(s.t, 1);
    const ok = Math.abs(s.t - OB) < 1e-9;
    const msg = $('fzMsg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = ok
      ? 'OB = OD：对角线互相平分，是平行四边形（AB∥CD）。'
      : `OB ≠ OD：AB 与 CD 的方向相差 ${deg(angle([0, 0], sub(B, A), sub(D(), C)) > 90 ? 180 - angle([0, 0], sub(B, A), sub(D(), C)) : angle([0, 0], sub(B, A), sub(D(), C)))}，不平行——不是平行四边形。`;
  };
  slider($('fzU'), (v) => { s.t = Math.round(v * 10) / 10; b.update(); });
}

/* ---------- 第 15 页：练习图 ---------- */
function initLx() {
  const A = [1.6, 2.4]; const B = [0, 0]; const C = [3.6, 0];
  const D = lerp(B, C, 0.5); const E = sub(mul(D, 2), A);
  const b1 = Geo.board($('lx1'), { x: [-0.6, 4.2], y: [-2.8, 2.9], w: 300 });
  b1.poly([A, B, C], { cls: 'tri-o' });
  b1.seg([A, D], { cls: 'gs' }); b1.seg([D, E], { cls: 'gdash r' });
  b1.seg([B, E], { cls: 'gdash r' }); b1.seg([C, E], { cls: 'gdash r' });
  [['A', A, -4, -8], ['B', B, -16, 6], ['C', C, 6, 6], ['D', D, 4, -6], ['E', E, -4, 20]].forEach(([n, p, dx, dy]) => lab(b1, p, n, dx, dy));
  b1.update();
  const Q = [[-1.4, 1.4], [-2.6, -1.4], [1.4, -1.4], [2.6, 1.4]];
  const M = Q.map((p) => mul(p, 0.5));
  const b2 = Geo.board($('lx2'), { x: [-3.2, 3.2], y: [-1.9, 1.9], w: 300 });
  b2.poly(Q, { cls: 'tri-o' });
  b2.seg([Q[0], Q[2]], { cls: 'gs' }); b2.seg([Q[1], Q[3]], { cls: 'gs' });
  b2.poly(M, { cls: 'fill-o' });
  labQuad(b2, Q, PN, [[-8, -6], [-16, 16], [4, 18], [4, -6]]);
  ['E', 'F', 'G', 'H'].forEach((n, i) => lab(b2, M[i], n, i === 0 || i === 1 ? -16 : 6, i === 0 || i === 3 ? -4 : 16, 'lb r sm'));
  b2.update();
}

window.LESSON = {
  init() {
    MProof.init();
    initDef();
    initSpin();
    initPrf();
    initProp();
    initEx1();
    initPractice();
    initJd1();
    initJd23();
    initLab();
    initEx23();
    initFz();
    initLx();
  },
  onRender(slide, k) {
    if (slide.querySelector('#prf')) { stg.prf = k; prfBoard.update(); }
    if (slide.querySelector('#ex1')) { stg.ex1 = k; ex1Board.update(); }
    requestAnimationFrame(Geo.refresh);
  },
};
