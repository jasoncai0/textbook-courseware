'use strict';
/* 高一下 9.2 向量运算 · 本课互动：加法两种法则、六边形例题、渡船航向、减法、数乘、共线定比、数量积与投影。
 * 通用部分见 ../shared/math.js、../shared/mvec.js；所有图形按坐标计算，横纵同比例。 */
const { board, vec, vecAdd, vecSub, vecMul, vecLen, vecDot, fmt, tex, slider } = MathKit;
const $ = (id) => document.getElementById(id);
const SNAP = 10; // 拖动吸附到 0.1
const snap = (v) => Math.round(v * SNAP) / SNAP;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const DEG = 180 / Math.PI;
const angleDeg = (p, q) => {
  const l = vecLen(p) * vecLen(q);
  return l < 1e-9 ? NaN : Math.acos(clamp(vecDot(p, q) / l, -1, 1)) * DEG;
};
const onStep = (nodes, n) => nodes.forEach((e) => e && e.setAttribute('data-step', n));
const label = (b, p, t, dx, dy) => { b.pt(p, { r: 4 }); return b.text(p, t, { cls: 'lb', dx, dy }); };
const setBtns = (box, key) => box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x.dataset.k === key));

/* 第 3 页：加法的三角形法则 / 平行四边形法则（拖 a、b 的终点） */
function initAdd() {
  const O = [0.6, 0.6];
  const s = { a: [3.6, 0.4], b: [1.4, 2.6], mode: 'tri' };
  const b = board($('addB'), { x: [-0.6, 9.4], y: [-0.4, 5.6], axes: false, w: 640 });
  const A = () => vecAdd(O, s.a);
  const C = () => vecAdd(O, s.b);
  const B = () => vecAdd(A(), s.b);
  const isPar = () => s.mode === 'par';
  b.seg(() => (isPar() ? [C(), B()] : null) || [O, O], { cls: 'dash' });
  b.seg(() => (isPar() ? [A(), B()] : [O, O]), { cls: 'dash' });
  vec(b, () => [O, A()], { cls: 'v1', label: 'a', side: -1 });
  vec(b, () => (isPar() ? [O, C()] : [A(), B()]), { cls: 'v2', label: 'b', side: () => (isPar() ? 1 : -1) });
  vec(b, () => [O, B()], { cls: 'v3', label: 'a+b', side: 1 });
  label(b, O, 'O', -22, 20);
  b.text(A, 'A', { cls: 'lb', dx: 10, dy: 24 });
  b.text(B, 'B', { cls: 'lb', dx: 12, dy: -8 });
  b.text(() => (isPar() ? C() : null), 'C', { cls: 'lb', dx: -24, dy: -6 });
  const lim = (p) => [clamp(snap(p[0]), -0.4, 9.2), clamp(snap(p[1]), -0.2, 5.4)];
  b.drag(A, (x, y) => { s.a = vecSub(lim([x, y]), O); });
  b.drag(() => (isPar() ? C() : B()), (x, y) => {
    const p = lim([x, y]);
    s.b = isPar() ? vecSub(p, O) : vecSub(p, A());
  });
  b.onUpdate = () => {
    const [la, lb, ls] = [vecLen(s.a), vecLen(s.b), vecLen(vecAdd(s.a, s.b))];
    const eq = Math.abs(la + lb - ls) < 1e-6;
    $('addV').innerHTML = `$|\\boldsymbol a|=${fmt(la)}$，$|\\boldsymbol b|=${fmt(lb)}$，$|\\boldsymbol a+\\boldsymbol b|=${fmt(ls)}$`
      + `　${eq ? '<b>= |a|+|b|</b>（a、b 同向共线）' : `&lt; |a|+|b| = ${fmt(la + lb)}`}`;
    tex($('addV'));
  };
  $('addBtns').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]');
    if (!k) return;
    if (k.dataset.k === 'col') { s.b = vecMul(0.6, s.a); } else { s.mode = k.dataset.k; }
    setBtns($('addBtns'), s.mode);
    b.update();
  });
  b.update();
}

/* 第 4 页：交换律（图 9-2-3），两条路径轮流高亮 */
function initComm() {
  const O = [0, 0];
  const a = [4, 0];
  const bb = [1.6, 1.8];
  const A = a;
  const C = bb;
  const B = vecAdd(a, bb);
  const b = board($('commB'), { x: [-0.8, 6.4], y: [-0.7, 2.6], axes: false, w: 560 });
  const s = { path: 'both' };
  const hi = (k) => s.path === 'both' || s.path === k;
  vec(b, () => (hi('ab') ? [O, A] : null), { cls: 'v1', label: 'a', side: -1 });
  vec(b, () => (hi('ab') ? [A, B] : null), { cls: 'v2', label: 'b', side: -1 });
  vec(b, () => (hi('ba') ? [O, C] : null), { cls: 'v2', label: 'b', side: 1 });
  vec(b, () => (hi('ba') ? [C, B] : null), { cls: 'v1', label: 'a', side: 1 });
  vec(b, [O, B], { cls: 'v3', label: 'a+b', side: 1 });
  [[O, 'O', -22, 20], [A, 'A', 6, 26], [B, 'B', 10, -6], [C, 'C', -20, -8]].forEach(([p, t, dx, dy]) => label(b, p, t, dx, dy));
  $('commBtns').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]');
    if (!k) return;
    s.path = k.dataset.k;
    setBtns($('commBtns'), s.path);
    b.update();
  });
  b.update();
}

/* 第 5 页：例 1 正六边形（中心 O，C 在正右方，逆时针 D、E、F、A、B） */
function initHex() {
  const P = {};
  ['C', 'D', 'E', 'F', 'A', 'B'].forEach((n, i) => { P[n] = [Math.cos(i * Math.PI / 3), Math.sin(i * Math.PI / 3)]; });
  P.O = [0, 0];
  const b = board($('hexB'), { x: [-1.5, 2.1], y: [-1.25, 1.25], axes: false, grid: false, w: 520 });
  const order = ['A', 'B', 'C', 'D', 'E', 'F'];
  b.poly(order.map((n) => P[n]), { cls: 'hexf' });
  const s = { k: '1' };
  const when = (k, seg) => () => (s.k === k ? seg : null);
  const BCFE = vecAdd(P.C, vecSub(P.E, P.F)); // C 加上 FE 的终点
  // (1) OA + OC = OB
  b.seg(() => (s.k === '1' ? [P.A, P.B] : [P.O, P.O]), { cls: 'dash' });
  b.seg(() => (s.k === '1' ? [P.C, P.B] : [P.O, P.O]), { cls: 'dash' });
  vec(b, when('1', [P.O, P.A]), { cls: 'v1' });
  vec(b, when('1', [P.O, P.C]), { cls: 'v2' });
  vec(b, when('1', [P.O, P.B]), { cls: 'v3' });
  // (2) BC + FE：FE 平移到 C 后首尾相接，和与 AD 相等
  vec(b, when('2', [P.B, P.C]), { cls: 'v1' });
  vec(b, when('2', [P.F, P.E]), { cls: 'v2' });
  vec(b, when('2', [P.C, BCFE]), { cls: 'vg' });
  vec(b, when('2', [P.B, BCFE]), { cls: 'v3' });
  vec(b, when('2', [P.A, P.D]), { cls: 'v3' });
  // (3) OA + FE = 0
  vec(b, when('3', [P.O, P.A]), { cls: 'v1' });
  vec(b, when('3', [P.F, P.E]), { cls: 'v2' });
  const OFF = { A: [-22, 20], B: [8, 22], C: [10, 6], D: [8, -8], E: [-22, -8], F: [-24, 6], O: [-8, -12] };
  Object.entries(OFF).forEach(([n, [dx, dy]]) => label(b, P[n], n, dx, dy));
  const MSG = {
    1: '$OABC$ 是以 $OA,OC$ 为邻边的平行四边形，$\\overrightarrow{OA}+\\overrightarrow{OC}=\\overrightarrow{OB}$。',
    2: '$\\overrightarrow{BC}$ 与 $\\overrightarrow{FE}$ 相等（同向等长），把 $\\overrightarrow{FE}$ 平移到 $C$ 接上：和的长度是 $BC$ 的 2 倍，可用 $\\overrightarrow{AD}$ 表示。',
    3: '$\\overrightarrow{OA}$ 与 $\\overrightarrow{FE}$ 是一对相反向量，$\\overrightarrow{OA}+\\overrightarrow{FE}=\\boldsymbol 0$。',
  };
  $('hexBtns').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]');
    if (!k) return;
    s.k = k.dataset.k;
    setBtns($('hexBtns'), s.k);
    $('hexMsg').innerHTML = MSG[s.k];
    tex($('hexMsg'));
    b.update();
  });
  b.update();
}

/* 第 6 页：例 2 渡船。1 个单位 = 5 km/h；水速 12.5 向东，船速 25，航向北偏西 φ */
function initFerry() {
  const UNIT = 5;
  const WATER = 12.5;
  const BOAT = 25;
  const A = [0, 0];
  const s = { phi: 15 };
  const b = board($('ferryB'), { x: [-5.6, 3.6], y: [-0.7, 5.6], axes: false, grid: false, w: 560 });
  b.poly([[-5.6, 0], [3.6, 0], [3.6, 5], [-5.6, 5]], { cls: 'river' });
  b.seg([[-5.6, 0], [3.6, 0]], { cls: 'thin' });
  b.seg([[-5.6, 5], [3.6, 5]], { cls: 'thin' });
  const boat = () => { const r = s.phi / DEG; return [-BOAT * Math.sin(r) / UNIT, BOAT * Math.cos(r) / UNIT]; };
  const water = [WATER / UNIT, 0];
  const real = () => vecAdd(boat(), water);
  b.seg(() => [water, real()], { cls: 'dash' });
  b.seg(() => [boat(), real()], { cls: 'dash' });
  b.seg([[0, 0], [0, 5]], { cls: 'dash' });
  vec(b, [A, water], { cls: 'v2' });
  vec(b, () => [A, boat()], { cls: 'v1' });
  vec(b, () => [A, real()], { cls: 'v3' });
  label(b, A, 'A', -10, 26);
  b.text(water, 'B', { cls: 'lb', dx: 8, dy: 24 });
  b.text(() => boat(), 'D', { cls: 'lb', dx: -22, dy: -6 });
  b.text(() => real(), 'C', { cls: 'lb', dx: 8, dy: -8 });
  b.text([0, 5], '北', { cls: 'lb up', dx: 6, dy: -8 });
  b.onUpdate = () => {
    const [x, y] = real();
    const sp = vecLen(real()) * UNIT;
    const off = Math.atan2(x, y) * DEG; // 实际航线偏离正北的角度
    const dir = Math.abs(off) < 0.05 ? '<b>正好垂直于江岸！</b>' : `实际航线偏向${off > 0 ? '东' : '西'} ${fmt(Math.abs(off), 1)}°`;
    $('ferryV').innerHTML = `航向北偏西 <b>${s.phi}°</b>：实际速度 $|\\overrightarrow{AC}|=${fmt(sp)}$ km/h，${dir}`;
    tex($('ferryV'));
  };
  slider($('ferryS'), (v) => { s.phi = v; b.update(); });
}

/* 第 7 页：减法——共起点，从 b 的终点指向 a 的终点；可显示 a + (−b) */
function initSub() {
  const O = [0.4, 0.6];
  const s = { a: [4.4, 0.2], b: [1.6, 3], neg: false };
  const b = board($('subB'), { x: [-0.6, 8.4], y: [-0.4, 4.8], axes: false, w: 600 });
  const A = () => vecAdd(O, s.a);
  const B = () => vecAdd(O, s.b);
  vec(b, () => [O, A()], { cls: 'v1', label: 'a', side: -1 });
  vec(b, () => [O, B()], { cls: 'v2', label: 'b', side: 1 });
  vec(b, () => [B(), A()], { cls: 'v4', label: 'a−b', side: 1 });
  vec(b, () => (s.neg ? [A(), vecSub(A(), s.b)] : null), { cls: 'vg', label: '−b', side: 1 });
  vec(b, () => (s.neg ? [O, vecSub(A(), s.b)] : null), { cls: 'v4', label: 'a+(−b)', side: -1 });
  label(b, O, 'O', -22, 20);
  b.text(A, 'A', { cls: 'lb', dx: 10, dy: 20 });
  b.text(B, 'B', { cls: 'lb', dx: -8, dy: -12 });
  const lim = (x, y) => [clamp(snap(x), -0.4, 8.2), clamp(snap(y), -0.2, 4.6)];
  b.drag(A, (x, y) => { s.a = vecSub(lim(x, y), O); });
  b.drag(B, (x, y) => { s.b = vecSub(lim(x, y), O); });
  b.onUpdate = () => {
    const d = vecSub(s.a, s.b);
    $('subV').innerHTML = `$|\\boldsymbol a-\\boldsymbol b|=${fmt(vecLen(d))}$`;
    tex($('subV'));
  };
  $('subNeg').addEventListener('click', () => { s.neg = !s.neg; $('subNeg').classList.toggle('solid', s.neg); b.update(); });
  b.update();
}

/* 第 8 页：例 4 的图（图 9-2-8） */
function initPar() {
  const A = [0, 0];
  const B = [4, 0];
  const D = [1.3, 1.9];
  const C = vecAdd(D, B);
  const O = vecMul(0.5, C);
  const b = board($('parB'), { x: [-0.6, 6], y: [-0.5, 2.4], axes: false, grid: false, w: 560 });
  b.poly([A, B, C, D], { cls: 'hexf' });
  b.seg([A, C], { cls: 'thin' });
  b.seg([B, D], { cls: 'thin' });
  vec(b, [A, B], { cls: 'v1', label: 'a', side: -1 });
  vec(b, [D, A], { cls: 'v2', label: 'b', side: -1 });
  vec(b, [O, C], { cls: 'v3', label: 'c', side: 1 });
  [[A, 'A', -20, 18], [B, 'B', 8, 20], [C, 'C', 8, -6], [D, 'D', -22, -6], [O, 'O', -6, 26]].forEach(([p, t, dx, dy]) => label(b, p, t, dx, dy));
  b.update();
}

/* 第 9 页：图 9-2-9 与数乘滑块 */
function initMul() {
  const O = [4.5, 2.1];
  const s = { a: [1.05, 0.35], k: 2 };
  const b = board($('mulB'), { x: [0.8, 8.2], y: [0.2, 4], axes: false, w: 620 });
  const n = () => { const L = vecLen(s.a) || 1; return [-s.a[1] / L * 0.55, s.a[0] / L * 0.55]; }; // 往 a 的左侧平移一点，两条线不重叠
  const O2 = () => vecSub(O, n());
  vec(b, () => [O, vecAdd(O, s.a)], { cls: 'v1', label: 'a', side: 1 });
  vec(b, () => (Math.abs(s.k) < 1e-9 ? null : [O2(), vecAdd(O2(), vecMul(s.k, s.a))]), { cls: 'v2', label: () => `${fmt(s.k)}a`, side: -1 });
  b.pt(() => (Math.abs(s.k) < 1e-9 ? O2() : null), { cls: 'c2', r: 7 });
  // λa 上每隔 |a| 一个刻度点，长度关系一目了然
  const ticks = Array.from({ length: 9 }, (_, i) => i - 4).filter((i) => i !== 0);
  ticks.forEach((i) => b.pt(() => ((i > 0 ? i <= s.k : i >= s.k) ? vecAdd(O2(), vecMul(i, s.a)) : null), { r: 3.5 }));
  b.drag(() => vecAdd(O, s.a), (x, y) => {
    const p = vecSub([snap(x), snap(y)], O);
    const q = [p[0], clamp(p[1], -0.45, 0.45)]; // 3 倍后仍留在画板内
    const L = vecLen(q);
    s.a = L > 1.1 ? vecMul(1.1 / L, q) : (L < 0.4 ? s.a : q);
  });
  b.onUpdate = () => {
    const la = vecLen(s.a);
    const dir = s.k > 0 ? '与 <b>a</b> 同向' : s.k < 0 ? '与 <b>a</b> 反向' : '是零向量 <b>0</b>';
    $('mulV').innerHTML = `$\\lambda=${fmt(s.k)}$：$|\\lambda\\boldsymbol a|=${fmt(Math.abs(s.k))}\\times${fmt(la)}=${fmt(Math.abs(s.k) * la)}$，$\\lambda\\boldsymbol a$ ${dir}`;
    tex($('mulV'));
  };
  slider($('mulS'), (v) => { s.k = v; b.update(); });
}

/* 第 10 页：例 1 作 −2.5a 与 2a − 3b（图 9-2-11） */
function initEx1m() {
  const a = [0.8, 0];
  const bb = [0.5, 0.6];
  const b = board($('ex1mB'), { x: [-0.3, 7.4], y: [-0.5, 2.3], axes: false, w: 600 });
  const P = [0.1, 1.5];
  vec(b, [P, vecAdd(P, bb)], { cls: 'v2', label: 'b', side: 1 });
  vec(b, [[0.9, 1.5], vecAdd([0.9, 1.5], a)], { cls: 'v1', label: 'a', side: 1 });
  const Q = [4.1, 2];
  const n1 = vec(b, [Q, vecAdd(Q, vecMul(-2.5, a))], { cls: 'v1', label: '−2.5a', side: -1 });
  const O = [4, 0];
  const A = vecAdd(O, vecMul(2, a));
  const B = vecAdd(O, vecMul(3, bb));
  const n2 = vec(b, [O, A], { cls: 'v1', label: '2a', side: -1 });
  const n3 = vec(b, [O, B], { cls: 'v2', label: '3b', side: 1 });
  const n4 = vec(b, [B, A], { cls: 'v4', label: '2a−3b', side: 1 });
  onStep([n1.line, n1.head, n1.label], 1);
  onStep([n2.line, n2.head, n2.label, n3.line, n3.head, n3.label], 2);
  onStep([n4.line, n4.head, n4.label], 3);
  [[O, 'O', -20, 18], [A, 'A', 6, 22], [B, 'B', 8, -6]].forEach(([p, t, dx, dy]) => onStep([label(b, p, t, dx, dy)], 2));
  b.update();
}

/* 第 11 页：例 4 —— C 在直线 AB 上，AC = λCB，验证 OC = (OA + λOB)/(1 + λ) */
function initRatio() {
  const O = [0, 0];
  const A = [0.6, 3.2];
  const B = [5.4, 1.2];
  const s = { t: 0.4 }; // C = A + t(B − A)
  const b = board($('ratioB'), { x: [-0.6, 6.6], y: [-0.6, 3.9], axes: false, w: 560 });
  const AB = vecSub(B, A);
  const C = () => vecAdd(A, vecMul(s.t, AB));
  b.seg([vecSub(A, vecMul(0.12, AB)), vecAdd(B, vecMul(0.2, AB))], { cls: 'thin' });
  vec(b, [O, A], { cls: 'v1' });
  vec(b, [O, B], { cls: 'v2' });
  vec(b, () => [O, C()], { cls: 'v3' });
  [[O, 'O', -10, 24], [A, 'A', -20, -8], [B, 'B', 10, 20]].forEach(([p, t, dx, dy]) => label(b, p, t, dx, dy));
  b.text(C, 'C', { cls: 'lb', dx: 6, dy: -12 });
  // 只在直线上拖；t = 1 是 B 点（λ 无穷），限制在 [−0.1, 1.18] 且避开 1
  b.drag(C, (x, y) => {
    const p = vecSub([x, y], A);
    let t = vecDot(p, AB) / vecDot(AB, AB);
    t = Math.round(clamp(t, -0.1, 1.18) * 100) / 100;
    s.t = Math.abs(t - 1) < 0.02 ? (t < 1 ? 0.98 : 1.02) : t;
  });
  b.onUpdate = () => {
    const lam = s.t / (1 - s.t); // AC = λ CB
    const rhs = vecMul(1 / (1 + lam), vecAdd(A, vecMul(lam, B)));
    const ok = vecLen(vecSub(rhs, C())) < 1e-9;
    const where = s.t > 0 && s.t < 1 ? '在线段 AB 上，λ > 0' : s.t === 0 ? '与 A 重合，λ = 0' : '在 AB 的延长线上，λ < 0';
    $('ratioV').innerHTML = `C ${where}：$\\lambda=${fmt(lam)}$，$\\dfrac{\\overrightarrow{OA}+\\lambda\\overrightarrow{OB}}{1+\\lambda}$ 的终点与 $C$ ${ok ? '<b>重合 ✓</b>' : '不重合'}`;
    tex($('ratioV'));
  };
  b.update();
}

/* 第 12 页：数量积与投影向量（拖 a、b） */
function initDot() {
  const O = [2.8, 1.4];
  const s = { a: [1.6, 2], b: [3.2, 0.6] };
  const b = board($('dotB'), { x: [-0.6, 7.6], y: [-0.6, 4.4], axes: false, w: 600 });
  const A = () => vecAdd(O, s.a);
  const B = () => vecAdd(O, s.b);
  const A1 = () => vecAdd(O, vecMul(vecDot(s.a, s.b) / vecDot(s.b, s.b), s.b));
  const far = (k) => () => vecAdd(O, vecMul(k / vecLen(s.b), s.b));
  b.seg(() => [far(-3)(), far(5)()], { cls: 'thin' });
  b.seg(() => [A(), A1()], { cls: 'dash' });
  b.poly(() => {
    // 垂足处的直角记号（边长 0.22）
    const u = vecMul(0.22 / vecLen(s.b), s.b);
    const w0 = vecSub(A(), A1());
    const wl = vecLen(w0);
    if (wl < 0.3) return [A1(), A1(), A1()];
    const w = vecMul(0.22 / wl, w0);
    const p = A1();
    const sgn = vecDot(vecSub(O, p), u) >= 0 ? 1 : -1;
    const u2 = vecMul(sgn, u);
    return [p, vecAdd(p, u2), vecAdd(vecAdd(p, u2), w), vecAdd(p, w)];
  }, { cls: 'rt' });
  vec(b, () => [O, A()], { cls: 'v1', label: 'a', side: 1 });
  vec(b, () => [O, B()], { cls: 'v2', label: 'b', side: -1 });
  vec(b, () => (vecLen(vecSub(A1(), O)) > 0.05 ? [O, A1()] : null), { cls: 'v3' });
  b.curve((t) => {
    const r = 0.5;
    const a0 = Math.atan2(s.b[1], s.b[0]);
    const a1 = Math.atan2(s.a[1], s.a[0]);
    let d = a1 - a0;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return [O[0] + r * Math.cos(a0 + d * t), O[1] + r * Math.sin(a0 + d * t)];
  }, 0, 1, { cls: 'c2 arc' });
  label(b, O, 'O', -18, 24);
  b.text(A, 'A', { cls: 'lb', dx: 8, dy: -8 });
  b.text(A1, 'A₁', { cls: 'lb', dx: 6, dy: 24 });
  const lim = (x, y) => [clamp(snap(x), -0.4, 7.4), clamp(snap(y), -0.4, 4.2)];
  const notZero = (p, old) => (vecLen(p) < 0.4 ? old : p);
  b.drag(A, (x, y) => { s.a = notZero(vecSub(lim(x, y), O), s.a); });
  b.drag(B, (x, y) => { s.b = notZero(vecSub(lim(x, y), O), s.b); });
  b.onUpdate = () => {
    const th = angleDeg(s.a, s.b);
    const d = vecDot(s.a, s.b);
    const [la, lb] = [vecLen(s.a), vecLen(s.b)];
    const r = Math.abs(d) < 1e-9 ? '<b>= 0，a ⊥ b</b>' : d > 0 ? '&gt; 0（锐角）' : '&lt; 0（钝角）';
    $('dotV').innerHTML = `$\\theta=${fmt(th, 1)}^\\circ$　$|\\boldsymbol a|=${fmt(la)}$，$|\\boldsymbol b|=${fmt(lb)}$<br>`
      + `$\\boldsymbol a\\cdot\\boldsymbol b=|\\boldsymbol a||\\boldsymbol b|\\cos\\theta=${fmt(d)}$ ${r}<br>`
      + `投影向量 $\\overrightarrow{OA_1}=(|\\boldsymbol a|\\cos\\theta)\\dfrac{\\boldsymbol b}{|\\boldsymbol b|}$，$|\\boldsymbol a|\\cos\\theta=${fmt(la * Math.cos(th / DEG))}$`;
    tex($('dotV'));
  };
  b.update();
}

/* 第 13 页：例 1 的四种夹角（|a| = 2，|b| = 3） */
function initEx1d() {
  const LA = 2;
  const LB = 3;
  const O = [0, 0];
  const s = { th: 135 };
  const b = board($('ex1dB'), { x: [-3.6, 3.6], y: [-0.6, 2.6], axes: false, grid: false, w: 520 });
  const a = () => [LA * Math.cos(s.th / DEG), LA * Math.sin(s.th / DEG)];
  vec(b, [O, [LB, 0]], { cls: 'v2', label: 'b', side: -1 });
  vec(b, () => [O, a()], { cls: 'v1', label: 'a', side: 1 });
  b.curve((t) => [0.5 * Math.cos(t * s.th / DEG), 0.5 * Math.sin(t * s.th / DEG)], 0, 1, { cls: 'c2 arc' });
  label(b, O, 'O', -8, 26);
  const VAL = { 135: '-3\\sqrt2', 0: '6', 180: '-6', 90: '0' };
  $('ex1dBtns').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]');
    if (!k) return;
    s.th = +k.dataset.k;
    setBtns($('ex1dBtns'), k.dataset.k);
    const v = 2 * 3 * Math.cos(s.th / DEG);
    $('ex1dV').innerHTML = `$\\theta=${s.th}^\\circ$：$\\boldsymbol a\\cdot\\boldsymbol b=2\\times3\\times\\cos${s.th}^\\circ=${VAL[s.th]}$（$\\approx${fmt(v)}$）`;
    tex($('ex1dV'));
    b.update();
  });
  $('ex1dBtns').querySelector('[data-k="135"]').click();
}

window.LESSON = {
  init() {
    initAdd();
    initComm();
    initHex();
    initFerry();
    initSub();
    initPar();
    initMul();
    initEx1m();
    initRatio();
    initDot();
    initEx1d();
  },
};
