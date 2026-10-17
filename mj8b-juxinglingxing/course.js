'use strict';
/* 八下 9.4 矩形、菱形、正方形 · 本课互动：扭动框架成矩形、平移一边成菱形（图 9-19、9-24）、判定反例、例 2 精确图、
 * 平行线间距离、衣帽架（例 3）、菱形面积补成矩形、证明搭积木（例 4）、尺规作菱形、“加条件变身”+ 关系图、例 5 滑块、性质表打勾。
 * 通用部分见 ../shared/math.js、mgeo.js、mproof.js、mcheck.js；所有图形由坐标精确计算，读数由坐标实时算出。 */
const { fmt, slider } = MathKit;
const { add, sub, mul, dist, dir, rot, angle, lerp, meet, foot } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const HIDE = [99, 99];
const H3 = [HIDE, HIDE, HIDE];
const lab = (b, p, t, dx, dy, cls) => b.text(p, t, { dx, dy, cls });
const labs = (b, list, cls) => list.forEach(([n, p, dx, dy]) => lab(b, p, n, dx, dy, cls));
const deg = (v) => `${fmt(v, 1)}°`;
const isPara = (P) => dist(sub(P[0], P[1]), sub(P[3], P[2])) < 1e-6;
const btnGroup = (id, cb) => $(id).addEventListener('click', (e) => {
  const btn = e.target.closest('[data-k]');
  if (!btn) return;
  $(id).querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
  cb(btn.dataset.k);
});

MProof.addBasis({
  'jx-xz': { t: '矩形的对角线相等', kind: '定理', src: '八下 9.4（课本 p75）', body: '矩形的四个角都是直角，对角线相等．' },
  'px-djx': { t: '平行四边形的对角线互相平分', kind: '定理', src: '八下 9.3（课本 p65）', body: '矩形是平行四边形，所以它的对角线互相平分．' },
  'rt-mid': { t: '直角三角形斜边上的中线等于斜边的一半', kind: '定理', src: '八上 2.5', body: '在 $\\text{Rt}\\triangle ABC$ 中，$\\angle ACB=90^\\circ$，$D$ 是 $AB$ 的中点 ⇒ $CD=\\dfrac12AB$．' },
  sxhy: { t: '等腰三角形三线合一', kind: '定理', src: '八上 2.5', body: '等腰三角形顶角的平分线、底边上的中线和底边上的高互相重合．' },
  'jx-pd1': { t: '三个角是直角的四边形是矩形', kind: '判定', src: '八下 9.4（课本 p76）', body: '三个角是直角的四边形是矩形．对角线相等的平行四边形是矩形．' },
  asa: { t: '两角及其夹边分别相等的两个三角形全等（ASA）', kind: '基本事实', src: '八上 1.3 探索三角形全等的条件', body: '两角及其夹边分别相等的两个三角形全等（简写成“角边角”或“ASA”）．' },
  sas: { t: '两边及其夹角分别相等的两个三角形全等（SAS）', kind: '基本事实', src: '八上 1.3 探索三角形全等的条件', body: '两边及其夹角分别相等的两个三角形全等（简写成“边角边”或“SAS”）．' },
  'qd-dy': { t: '全等三角形的对应边相等', kind: '性质', src: '八上 1.2 全等三角形', body: '全等三角形的对应边相等，对应角相等．' },
  'pd-3': { t: '对角线互相平分的四边形是平行四边形', kind: '判定', src: '八下 9.3（课本 p69）', body: '$OA=OC$，$OB=OD$ ⇒ 四边形 $ABCD$ 是平行四边形．' },
  'lx-pd1': { t: '四边相等的四边形是菱形', kind: '判定', src: '八下 9.4（课本 p80）', body: '四边相等的四边形是菱形．' },
  'lx-pd2': { t: '对角线互相垂直的平行四边形是菱形', kind: '判定', src: '八下 9.4（课本 p80）', body: '对角线互相垂直的平行四边形是菱形．' },
  'zf-pd2': { t: '有一个角是直角的菱形是正方形', kind: '判定', src: '八下 9.4（课本 p81）', body: '有一组邻边相等的矩形是正方形．有一个角是直角的菱形是正方形．' },
});

/* ---------- 第 3 页：扭动框架（图 9-19） ---------- */
function initFrameR() {
  const s = { t: 68 };
  const B = [0, 0]; const C = [4, 0];
  const A = () => mul(dir(s.t), 2.6);
  const D = () => add(A(), C);
  const b = Geo.board($('frameR'), { x: [-1.7, 5.6], y: [-0.7, 3.2], w: 560 });
  b.poly([[0, 2.6], B, C, [4, 2.6]], { cls: 'tri-ghost' });
  b.poly(() => [A(), B, C, D()], { cls: 'tri-o' });
  b.seg(() => [A(), C], { cls: 'gdash r' }); b.seg(() => [B, D()], { cls: 'gdash r' });
  Geo.right(b, () => (s.t === 90 ? B : HIDE), C, A, { s: 0.25 });
  Geo.arc(b, B, C, A, { r: 0.4, show: () => s.t !== 90 });
  labs(b, [['B', B, -18, 16], ['C', C, 4, 18]]);
  lab(b, A, 'A', -8, -8); lab(b, D, 'D', 4, -8);
  b.onUpdate = () => {
    $('frameRAV').textContent = `${s.t}°`;
    $('frR1').textContent = fmt(dist(A(), C)); $('frR2').textContent = fmt(dist(B, D()));
    const msg = $('frRMsg');
    msg.className = `tip feedback ${s.t === 90 ? 'fb-ok' : ''}`;
    msg.textContent = s.t === 90 ? '∠ABC = 90°：▱ABCD 成了矩形，两根橡皮筋一样长！' : `∠ABC = ${s.t}°：两条对角线${s.t < 90 ? 'AC 短、BD 长' : 'AC 长、BD 短'}。`;
  };
  slider($('frameRA'), (v) => { s.t = v; b.update(); });
}

/* ---------- 第 4 页：矩形的对称性 ---------- */
function initSymR() {
  const b = Geo.board($('symR'), { x: [-3, 3], y: [-1.7, 1.7], w: 300 });
  b.poly([[-2.2, 1.2], [-2.2, -1.2], [2.2, -1.2], [2.2, 1.2]], { cls: 'tri-o' });
  b.seg([[-2.2, 1.2], [2.2, -1.2]], { cls: 'gdash' }); b.seg([[-2.2, -1.2], [2.2, 1.2]], { cls: 'gdash' });
  b.seg([[-2.8, 0], [2.8, 0]], { cls: 'ax-l' }); b.seg([[0, -1.6], [0, 1.6]], { cls: 'ax-l' });
  b.pt([0, 0], { cls: 'ctr-p' });
  b.update();
}

/* ---------- 第 5 页：对角线相等的▱ vs 只是对角线相等 ---------- */
function initJudgeR() {
  const s = { k: 'p' };
  const A = mul(dir(150), 2.2); const C = mul(A, -1);
  const Q = { p: [A, mul(dir(210), 2.2), C, mul(dir(30), 2.2)], q: [A, mul(dir(210), 3.1), C, mul(dir(30), 1.3)] };
  const b = Geo.board($('judgeR'), { x: [-3.2, 3.2], y: [-1.8, 1.6], w: 480 });
  b.poly(() => Q[s.k], { cls: 'tri-o' });
  b.seg(() => [Q[s.k][0], Q[s.k][2]], { cls: 'gs hl' }); b.seg(() => [Q[s.k][1], Q[s.k][3]], { cls: 'gs hl' });
  b.pt([0, 0], { cls: 'ctr-p', r: 3 });
  ['A', 'B', 'C', 'D'].forEach((n, i) => lab(b, () => Q[s.k][i], n, i < 2 ? -18 : 6, i % 2 ? 18 : -6));
  lab(b, () => [0, 1.35], () => (s.k === 'p' ? 'AC = BD，且互相平分 → 矩形' : `AC = BD = 4.4，但 OB = 3.1，OD = 1.3 → ${isPara(Q.q) ? '' : '不是▱'}`), -120, 0, 'lb up sm');
  b.update();
  btnGroup('judgeRBtns', (k) => { s.k = k; b.update(); });
}

/* ---------- 第 6 页：例 2（图 9-22） ---------- */
function initEx2() {
  const A = [0, 0]; const B = [6, 0]; const D = [3, 0];
  const C = add(D, mul(dir(128), 3)); // 在以 AB 为直径的圆上，∠ACB = 90°
  const F = lerp(A, C, 0.5); const E = lerp(B, C, 0.5);
  const b = Geo.board($('ex2'), { x: [-0.6, 6.6], y: [-0.7, 3], w: 520 });
  b.poly([A, B, C], { cls: 'tri-o' });
  b.poly([D, E, C, F], { cls: 'fill-o' });
  b.seg([C, D], { cls: 'gs' });
  Geo.right(b, C, A, B, { s: 0.22 }); Geo.right(b, F, D, C, { s: 0.2 }); Geo.right(b, E, C, D, { s: 0.2 });
  labs(b, [['A', A, -16, 16], ['B', B, 4, 16], ['C', C, -4, -8], ['D', D, -4, 22], ['E', E, 6, -4], ['F', F, -20, -2]]);
  b.update();
}

/* ---------- 第 7 页：平行线间的距离 ---------- */
function initDist() {
  const H = 2.4;
  const s = { a: 0.8, c: 4.2 };
  const b = Geo.board($('dist'), { x: [-0.8, 6.8], y: [-0.8, 3.2], w: 520 });
  b.seg([[-0.8, H], [6.8, H]], { cls: 'gs' }); b.seg([[-0.8, 0], [6.8, 0]], { cls: 'gs' });
  b.seg(() => [[s.a, H], [s.a, 0]], { cls: 'gs hl' }); b.seg(() => [[s.c, H], [s.c, 0]], { cls: 'gs hl' });
  Geo.right(b, () => [s.a, 0], [6, 0], () => [s.a, H], { s: 0.22 }); Geo.right(b, () => [s.c, 0], [6, 0], () => [s.c, H], { s: 0.22 });
  lab(b, [6.5, H], 'l₁', -4, -8); lab(b, [6.5, 0], 'l₂', -4, -8);
  lab(b, () => [s.a, H], 'A', -18, -8); lab(b, () => [s.a, 0], 'B', -18, 20);
  lab(b, () => [s.c, H], 'C', 8, -8); lab(b, () => [s.c, 0], 'D', 8, 20);
  b.drag(() => [s.a, H], (x) => { s.a = clamp(x, -0.4, 6.4); });
  b.drag(() => [s.c, H], (x) => { s.c = clamp(x, -0.4, 6.4); });
  b.onUpdate = () => { $('dAB').textContent = fmt(H); $('dCD').textContent = fmt(dist([s.c, H], [s.c, 0])); };
  b.update();
}

/* ---------- 第 8 页：平移一边（图 9-24） ---------- */
function initFrameL() {
  const s = { bc: 4.2 };
  const B = [0, 0];
  const A = mul(dir(60), 3);
  const C = () => [s.bc, 0];
  const D = () => add(A, C());
  const O = () => lerp(A, C(), 0.5);
  const b = Geo.board($('frameL'), { x: [-0.8, 7], y: [-0.7, 3.2], w: 560 });
  b.poly(() => [A, B, C(), D()], { cls: 'tri-o' });
  b.seg(() => [A, C()], { cls: 'gdash r' }); b.seg(() => [B, D()], { cls: 'gdash r' });
  Geo.right(b, () => (s.bc === 3 ? O() : HIDE), () => C(), () => D(), { s: 0.2 });
  lab(b, A, 'A', -8, -8); lab(b, B, 'B', -18, 16); lab(b, C, 'C', 2, 20); lab(b, D, 'D', 4, -8); lab(b, O, 'O', -4, 22);
  b.onUpdate = () => {
    $('frameLBV').textContent = fmt(s.bc, 1);
    $('frL1').textContent = deg(angle(O(), A, B));
    $('frL2').textContent = fmt(s.bc - 3, 1);
    const ok = s.bc === 3;
    const msg = $('frLMsg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    msg.textContent = ok ? 'BC = AB：▱ABCD 成了菱形，对角线互相垂直！' : `BC ≠ AB，∠AOB = ${deg(angle(O(), A, B))}，对角线不垂直。`;
  };
  slider($('frameLB'), (v) => { s.bc = Math.round(v * 10) / 10; b.update(); });
}

/* ---------- 第 9 页：衣帽架（例 3，单位 cm，画图按 0.1 缩放） ---------- */
function initRack() {
  const SIDE = 13;
  const K = 0.1;
  const s = { ac: 24 };
  const bo = () => Math.sqrt(SIDE * SIDE - (s.ac / 2) ** 2);
  const P = (i, row) => [K * bo() * i, K * row * s.ac / 2]; // i：0…6，row：1 上 / 0 中 / −1 下
  const b = Geo.board($('rack'), { x: [-0.7, 7.8], y: [-1.6, 1.6], w: 560 });
  [0, 1, 2].forEach((k) => b.poly(() => [P(2 * k + 1, 1), P(2 * k, 0), P(2 * k + 1, -1), P(2 * k + 2, 0)], { cls: k ? 'tri-o' : 'fill-o' }));
  b.seg(() => [P(1, 1), P(1, -1)], { cls: 'gdash' }); b.seg(() => [P(0, 0), P(2, 0)], { cls: 'gdash' });
  b.seg(() => [P(0, 0), P(6, 0)], { cls: 'gs hl' });
  [['A', 1, 1, -4, -8], ['E', 3, 1, -4, -8], ['F', 5, 1, -4, -8], ['B', 0, 0, -18, 6], ['D', 2, 0, -4, -8], ['M', 6, 0, 6, 6], ['C', 1, -1, -4, 22], ['G', 3, -1, -4, 22], ['H', 5, -1, -4, 22], ['O', 1, 0, 4, 20]]
    .forEach(([n, i, r, dx, dy]) => lab(b, () => P(i, r), n, dx, dy));
  b.onUpdate = () => {
    $('rackACV').textContent = s.ac;
    $('rkBO').textContent = `${fmt(bo())} cm`;
    $('rkBM').textContent = `${fmt(6 * bo())} cm`;
  };
  slider($('rackAC'), (v) => { s.ac = v; b.update(); });
}

/* ---------- 第 10 页：菱形面积补成矩形 ---------- */
function initArea() {
  const a = 2.5; const c = 1.7;
  const A = [-a, 0]; const C = [a, 0]; const B = [0, -c]; const D = [0, c];
  const s = { on: false };
  const b = Geo.board($('area'), { x: [-3.1, 3.1], y: [-2.2, 2.2], w: 480 });
  const outer = [[[-a, 0], [-a, c], [0, c]], [[0, c], [a, c], [a, 0]], [[a, 0], [a, -c], [0, -c]], [[0, -c], [-a, -c], [-a, 0]]];
  outer.forEach((t) => b.poly(() => (s.on ? t : H3), { cls: 'fill-g' }));
  b.poly([A, B, C, D], { cls: 'fill-o' });
  b.seg([A, C], { cls: 'gs' }); b.seg([B, D], { cls: 'gs' });
  Geo.right(b, [0, 0], C, D, { s: 0.2 });
  labs(b, [['A', A, -18, 6], ['C', C, 6, 6], ['B', B, -4, 22], ['D', D, -4, -8], ['O', [0, 0], -16, 20]]);
  b.update();
  $('areaBtn').addEventListener('click', () => { s.on = !s.on; $('areaBtn').classList.toggle('solid', s.on); b.update(); });
}

/* ---------- 第 11 页：菱形 vs 筝形；例 4 图 ---------- */
function initKite() {
  const s = { k: 'p' };
  const Q = { p: [[-2.2, 0], [0, -1.2], [2.2, 0], [0, 1.2]], q: [[-2.8, 0], [0, -1.2], [1, 0], [0, 1.2]] };
  const b = Geo.board($('kite'), { x: [-3.2, 3.2], y: [-1.6, 1.6], w: 400 });
  b.poly(() => Q[s.k], { cls: 'tri-o' });
  b.seg(() => [Q[s.k][0], Q[s.k][2]], { cls: 'gs hl' }); b.seg(() => [Q[s.k][1], Q[s.k][3]], { cls: 'gs hl' });
  Geo.right(b, [0, 0], [1, 0], [0, 1], { s: 0.18 });
  lab(b, [0, 1.35], () => (s.k === 'p' ? '菱形' : '筝形：对角线垂直，但不是菱形'), -40, 0, 'lb up sm');
  b.update();
  btnGroup('kiteBtns', (k) => { s.k = k; b.update(); });

  const B = [0, 0]; const C = [5, 0]; const A = [1.2, 2.2]; const D = [4.8, 2.2];
  const O = lerp(A, C, 0.5);
  const n = rot(sub(C, A), 90);
  const E = meet(O, add(O, n), A, D); const F = meet(O, add(O, n), B, C);
  const e = Geo.board($('ex4'), { x: [-0.5, 5.6], y: [-0.5, 2.7], w: 520 });
  e.poly([A, B, C, D], { cls: 'tri-o' });
  e.poly([A, F, C, E], { cls: 'fill-o' });
  e.seg([A, C], { cls: 'gs' }); e.seg([E, F], { cls: 'gs' });
  Geo.right(e, O, C, E, { s: 0.16 });
  Geo.arc(e, A, E, C, { r: 0.5, label: '1' }); Geo.arc(e, C, F, A, { r: 0.5, label: '2' });
  labs(e, [['A', A, -10, -6], ['B', B, -14, 14], ['C', C, 4, 16], ['D', D, 4, -6], ['E', E, -2, -8], ['F', F, -4, 18], ['O', O, 6, 4]]);
  e.update();
}

/* ---------- 第 12 页：矩形中点四边形；尺规作菱形 ---------- */
function initMidCons() {
  const R = [[0, 2.4], [0, 0], [4, 0], [4, 2.4]]; // A B C D
  const M = [lerp(R[0], R[1], 0.5), lerp(R[1], R[2], 0.5), lerp(R[2], R[3], 0.5), lerp(R[3], R[0], 0.5)]; // E F G H
  const b = Geo.board($('mid'), { x: [-0.6, 4.6], y: [-0.5, 2.9], w: 320 });
  b.poly(R, { cls: 'tri-o' });
  b.poly(M, { cls: 'fill-o' });
  labs(b, [['A', R[0], -14, -4], ['B', R[1], -14, 14], ['C', R[2], 4, 14], ['D', R[3], 4, -4], ['E', M[0], -16, 6], ['F', M[1], -4, 18], ['G', M[2], 6, 6], ['H', M[3], -4, -6]]);
  b.update();

  const A = [-2, 0]; const C = [2, 0]; const r = 2.6;
  const h = Math.sqrt(r * r - 4);
  const B = [0, -h]; const D = [0, h];
  const s = { k: 0 };
  const c = Geo.board($('cons'), { x: [-3, 3], y: [-2.3, 2.3], w: 320 });
  c.seg([A, C], { cls: 'gs' });
  const arcAt = (P, a0, a1) => (t) => add(P, mul(dir(a0 + (a1 - a0) * t), r));
  const aB = Math.atan2(h, 2) * 180 / Math.PI;
  [[A, aB, 1], [A, -aB, 1], [C, 180 - aB, 2], [C, 180 + aB, 2]].forEach(([P, a, k]) => c.curve((t) => (s.k >= k ? arcAt(P, a - 15, a + 15)(t) : [NaN, NaN]), 0, 1, { cls: 'carc', n: 30 }));
  c.poly(() => (s.k >= 3 ? [A, B, C, D] : [HIDE, HIDE, HIDE, HIDE]), { cls: 'fill-o' });
  labs(c, [['A', A, -16, 6], ['C', C, 6, 6]]);
  lab(c, () => (s.k >= 2 ? B : null), 'B', -4, 22); lab(c, () => (s.k >= 2 ? D : null), 'D', -4, -8);
  const TXT = ['画线段 AC', '以 A 为圆心画弧', '以 C 为圆心、同样半径画弧', '连接四边'];
  c.onUpdate = () => { $('consKV').textContent = TXT[s.k]; };
  slider($('consK'), (v) => { s.k = v; c.update(); });
}

/* ---------- 第 13 页：加条件变身 + 关系图（图 9-29） ---------- */
function initMorph() {
  const s = { r: false, l: false, th: 62, bc: 4.2 };
  const B = [0, 0];
  const P = () => { const A = mul(dir(s.th), 3); const C = [s.bc, 0]; return [A, B, C, add(A, C)]; };
  const b = Geo.board($('morph'), { x: [-0.8, 6.4], y: [-0.6, 3.4], w: 520 });
  b.poly(P, { cls: 'tri-o' });
  Geo.right(b, () => (s.r ? B : HIDE), () => P()[2], () => P()[0], { s: 0.25 });
  ['A', 'B', 'C', 'D'].forEach((n, i) => lab(b, () => P()[i], n, i < 2 ? -16 : 4, i % 2 ? 18 : -6));
  const v = Geo.board($('venn'), { x: [-2.7, 2.7], y: [-1.75, 1.75], w: 420 });
  const big = v.poly(Array.from({ length: 80 }, (_, i) => [2.5 * Math.cos(i * Math.PI / 40), 1.6 * Math.sin(i * Math.PI / 40)]), { cls: 'venn' });
  const cl = v.poly(Array.from({ length: 60 }, (_, i) => add([-0.55, -0.3], mul(dir(i * 6), 1.05))), { cls: 'venn' });
  const cr = v.poly(Array.from({ length: 60 }, (_, i) => add([0.55, -0.3], mul(dir(i * 6), 1.05))), { cls: 'venn' });
  const t0 = lab(v, [0, 1.05], '平行四边形', 0, 6, 'vt');
  const t1 = lab(v, [-1.05, -0.3], '矩形', 0, 6, 'vt');
  const t2 = lab(v, [1.05, -0.3], '菱形', 0, 6, 'vt');
  const t3 = lab(v, [0, -0.3], '正方形', 0, 6, 'vt');
  const name = () => (s.r && s.l ? '正方形' : s.r ? '矩形' : s.l ? '菱形' : '平行四边形');
  const sync = () => {
    big.classList.toggle('on', !s.r && !s.l);
    cl.classList.toggle('on', s.r); cr.classList.toggle('on', s.l);
    [[t0, !s.r && !s.l], [t1, s.r && !s.l], [t2, s.l && !s.r], [t3, s.r && s.l]].forEach(([t, on]) => t.classList.toggle('on', on));
    $('morphMsg').textContent = `现在是：${name()}。${s.r || s.l ? '' : '点按钮给它加条件。'}`;
    $('morphMsg').className = `tip feedback ${s.r || s.l ? 'fb-ok' : ''}`;
  };
  let raf = 0;
  const go = () => {
    cancelAnimationFrame(raf);
    const [th0, bc0] = [s.th, s.bc];
    const [th1, bc1] = [s.r ? 90 : 62, s.l ? 3 : 4.2];
    const t0s = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0s) / 700);
      s.th = th0 + (th1 - th0) * k; s.bc = bc0 + (bc1 - bc0) * k;
      b.update();
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    sync(); v.update();
  };
  $('morphBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s[btn.dataset.k] = !s[btn.dataset.k];
    btn.classList.toggle('solid', s[btn.dataset.k]);
    go();
  });
  b.update(); v.update(); sync();
}

/* ---------- 第 14 页：例 5（图 9-30） ---------- */
function initEx5() {
  const A = [0, 4]; const B = [0, 0]; const C = [4, 0]; const D = [4, 4];
  const s = { u: 1.2 };
  const Q = () => [[0, 4 - s.u], [s.u, 0], [4, s.u], [4 - s.u, 4]]; // A′ B′ C′ D′
  const b = Geo.board($('ex5'), { x: [-0.8, 4.8], y: [-0.6, 4.6], w: 420 });
  b.poly([A, B, C, D], { cls: 'tri-o' });
  b.poly(Q, { cls: 'fill-o' });
  Geo.arc(b, () => Q()[0], A, () => Q()[3], { r: 0.4, label: '1' });
  Geo.arc(b, () => Q()[3], A, () => Q()[0], { r: 0.4, label: '2' });
  Geo.arc(b, () => Q()[0], B, () => Q()[1], { r: 0.4, label: '3' });
  labs(b, [['A', A, -16, -4], ['B', B, -16, 16], ['C', C, 4, 16], ['D', D, 4, -4]]);
  ['A′', 'B′', 'C′', 'D′'].forEach((n, i) => lab(b, () => Q()[i], n, [-26, -4, 6, -4][i], [6, 20, 6, -8][i], 'lb r'));
  b.onUpdate = () => {
    const q = Q();
    $('ex5UV').textContent = `${fmt(s.u, 1)}；A′B′ = ${fmt(dist(q[0], q[1]))}，B′C′ = ${fmt(dist(q[1], q[2]))}，∠D′A′B′ = ${deg(angle(q[0], q[3], q[1]))}`;
  };
  slider($('ex5U'), (v) => { s.u = v; b.update(); });
}

/* ---------- 第 15 页：性质表打勾 ---------- */
function initTable() {
  const rows = [...$('ptab').querySelectorAll('tr[data-ans]')];
  const cells = () => rows.flatMap((r) => [...r.cells].slice(1).map((c, i) => [c, r.dataset.ans[i] === '1']));
  cells().forEach(([c]) => c.addEventListener('click', () => { c.classList.toggle('on'); c.classList.remove('ok', 'no'); }));
  $('ptabCheck').addEventListener('click', () => {
    let wrong = 0;
    cells().forEach(([c, want]) => { const ok = c.classList.contains('on') === want; c.classList.toggle('ok', ok); c.classList.toggle('no', !ok); if (!ok) wrong += 1; });
    const msg = $('ptabMsg');
    msg.className = `tip feedback ${wrong ? 'fb-warn' : 'fb-ok'}`;
    msg.textContent = wrong ? `有 ${wrong} 个格子不对（红色），再想想。` : '全对！正方形一列全是“√”。';
  });
  $('ptabReset').addEventListener('click', () => cells().forEach(([c]) => c.classList.remove('on', 'ok', 'no')));
}

window.LESSON = {
  init() {
    MProof.init();
    initFrameR(); initSymR(); initJudgeR(); initEx2(); initDist(); initFrameL(); initRack();
    initArea(); initKite(); initMidCons(); initMorph(); initEx5(); initTable();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
