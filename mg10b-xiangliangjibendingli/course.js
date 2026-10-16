'use strict';
/* 高一下 9.3 向量基本定理及坐标表示 · 本课互动：
 * 斜面上重力分解、λ₁e₁+λ₂e₂ 正向合成、★向量分解（拖 a、e₁、e₂，解方程组得 λ₁、λ₂；切换正交单位基底得坐标）、
 * 例题精确作图、坐标表示、坐标运算、直角三角形分类、平行/垂直的坐标条件。
 * 通用部分见 ../shared/math.js、../shared/mvec.js；所有图形按坐标计算，横纵同比例。 */
const { board, vec, vecAdd, vecSub, vecMul, vecLen, vecDot, fmt, tex, slider } = MathKit;
const $ = (id) => document.getElementById(id);
const EPS = 1e-9;
const DEG = 180 / Math.PI;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, k = 10) => Math.round(v * k) / k; // k = 10 吸附到 0.1，k = 2 吸附到 0.5
const cross = (p, q) => p[0] * q[1] - p[1] * q[0];
const unit = (p) => vecMul(1 / vecLen(p), p);
const onStep = (nodes, n) => nodes.forEach((e) => e && e.setAttribute('data-step', n));
const label = (b, p, t, dx, dy) => { b.pt(p, { r: 4 }); return b.text(p, t, { cls: 'lb', dx, dy }); };
const setBtns = (box, key) => box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x.dataset.k === key));
const onBtn = (box, fn) => box.addEventListener('click', (e) => { const k = e.target.closest('[data-k]'); if (k) fn(k.dataset.k); });
const html = (id, s) => { $(id).innerHTML = s; tex($(id)); };
const MAX_DEN = 60;

/** 实数 → TeX：能化成分母不超过 60 的分数就写分数，否则写约等于的小数（含 "=" 或 "\approx"） */
function eqv(v) {
  if (Math.abs(v - Math.round(v)) < EPS) return `=${Math.round(v) || 0}`;
  for (let d = 2; d <= MAX_DEN; d += 1) {
    const n = Math.round(v * d);
    if (Math.abs(n / d - v) < EPS) return `=${n < 0 ? '-' : ''}\\dfrac{${Math.abs(n)}}{${d}}`;
  }
  return `\\approx${fmt(v)}`;
}
const num = (v) => fmt(Math.abs(v) < EPS ? 0 : v);
const pv = (v) => (v < -EPS ? `(${num(v)})` : num(v)); // 负数作运算数时加括号
const pair = (p) => `(${num(p[0])},\\ ${num(p[1])})`;
/** 直角记号：顶点 P，两边方向 u、v */
const rtMark = (P, u, v, s = 0.22) => {
  const a = vecMul(s, unit(u));
  const c = vecMul(s, unit(v));
  return [P, vecAdd(P, a), vecAdd(vecAdd(P, a), c), vecAdd(P, c)];
};
/** 过点 P、方向 d 的长直线（画板会裁掉多余部分） */
const longLine = (P, d) => { const u = vecMul(40, unit(d)); return [vecSub(P, u), vecAdd(P, u)]; };

/* 第 3 页左：斜面上的重力分解 G = F₁ + F₂（图 9-3-1，θ = 30°） */
function initSlope() {
  const TH = 30 / DEG;
  const G = 3;
  const b = board($('slopeB'), { x: [-0.3, 6.6], y: [-0.4, 4.2], axes: false, grid: false, w: 520 });
  const foot = [0, 0];
  const top = [6.2, 6.2 * Math.tan(TH)];
  b.poly([foot, [top[0], 0], top], { cls: 'slope' });
  const t = [Math.cos(TH), Math.sin(TH)]; // 沿斜面向上
  const n = [-Math.sin(TH), Math.cos(TH)]; // 垂直斜面向外
  const base = vecMul(3.6, t);
  const P = vecAdd(base, vecMul(0.45, n)); // 木块中心
  const h = 0.45;
  b.poly([vecAdd(base, vecMul(-h, t)), vecAdd(base, vecMul(h, t)), vecAdd(vecAdd(base, vecMul(h, t)), vecMul(2 * h, n)), vecAdd(vecAdd(base, vecMul(-h, t)), vecMul(2 * h, n))], { cls: 'blk' });
  const g = [0, -G];
  const f1 = vecMul(G * Math.cos(TH), vecMul(-1, n));
  const f2 = vecMul(G * Math.sin(TH), vecMul(-1, t));
  b.seg([vecAdd(P, f1), vecAdd(P, g)], { cls: 'dash' });
  b.seg([vecAdd(P, f2), vecAdd(P, g)], { cls: 'dash' });
  vec(b, [P, vecAdd(P, g)], { cls: 'v3', label: 'G', side: -1 });
  vec(b, [P, vecAdd(P, f1)], { cls: 'v1', label: 'F₁', side: -1 });
  vec(b, [P, vecAdd(P, f2)], { cls: 'v2', label: 'F₂', side: 1 });
  b.curve((s) => [0.9 * Math.cos(s * TH), 0.9 * Math.sin(s * TH)], 0, 1, { cls: 'c2 arc' });
  b.text([1.05, 0.25], 'θ', { cls: 'lb' });
  b.update();
}

/* 第 3 页右：正着做——给定 λ₁、λ₂，作 λ₁e₁ + λ₂e₂ */
function initForward() {
  const O = [2.4, 1.2];
  const e1 = [1.6, 0.4];
  const e2 = [0.4, 1.1];
  const s = { l1: 2, l2: 1.5 };
  const b = board($('fwdB'), { x: [-0.6, 8.4], y: [-0.5, 4.7], axes: false, grid: false, w: 600 });
  const M = () => vecAdd(O, vecMul(s.l1, e1));
  const N = () => vecAdd(O, vecMul(s.l2, e2));
  const S = () => vecAdd(M(), vecMul(s.l2, e2));
  b.seg(longLine(O, e1), { cls: 'thin' });
  b.seg(longLine(O, e2), { cls: 'thin' });
  b.seg(() => [M(), S()], { cls: 'dash' });
  b.seg(() => [N(), S()], { cls: 'dash' });
  vec(b, () => [O, M()], { cls: 'v1 soft' });
  vec(b, () => [O, N()], { cls: 'v2 soft' });
  vec(b, [O, vecAdd(O, e1)], { cls: 'v1' });
  vec(b, [O, vecAdd(O, e2)], { cls: 'v2' });
  vec(b, () => [O, S()], { cls: 'v3' });
  // 标注错开放：e₁、e₂ 标在自身中点，λ 倍向量标在 85% 处，和向量标在终点旁
  const far = (P, k) => () => (Math.abs(k()) > 1.2 ? vecAdd(O, vecMul(0.85, vecSub(P(), O))) : null);
  b.text(vecAdd(O, vecMul(0.5, e1)), 'e₁', { cls: 'vlab v1', dx: 2, dy: 30 });
  b.text(vecAdd(O, vecMul(0.5, e2)), 'e₂', { cls: 'vlab v2', dx: -30, dy: 4 });
  b.text(far(M, () => s.l1), 'λ₁e₁', { cls: 'vlab v1', dx: 0, dy: 32 });
  b.text(far(N, () => s.l2), 'λ₂e₂', { cls: 'vlab v2', dx: -64, dy: 6 });
  b.text(S, 'λ₁e₁+λ₂e₂', { cls: 'vlab v3', dx: 10, dy: -10 });
  label(b, O, 'O', -22, 20);
  b.onUpdate = () => html('fwdV', `$\\lambda_1=${fmt(s.l1)}$，$\\lambda_2=${fmt(s.l2)}$：绿色向量 $${fmt(s.l1)}\\boldsymbol e_1${s.l2 < 0 ? '' : '+'}${fmt(s.l2)}\\boldsymbol e_2$——平行四边形法则，一定作得出来`);
  slider($('fwdL1'), (v) => { s.l1 = v; b.update(); });
  slider($('fwdL2'), (v) => { s.l2 = v; b.update(); });
}

/* 第 4 页 ★：向量分解。拖 a 的终点 C、e₁ 的终点 A、e₂ 的终点 B；解方程组得 λ₁、λ₂ */
function initSplit() {
  const O = [2, 1]; // 整点，切换到 i、j 时网格就是单位正方形
  const XR = [-0.6, 9.6];
  const YR = [-0.6, 5.6];
  const IJ = [[1, 0], [0, 1]];
  const NEAR = Math.sin(6 / DEG); // 夹角小于 6° 视为“快共线”
  const s = { e1: [2, 1], e2: [-0.5, 1.5], a: [3.5, 3.5], mode: 'any' };
  const b = board($('splitB'), { x: XR, y: YR, axes: false, w: 640 });
  const isIJ = () => s.mode === 'ij';
  const E1 = () => (isIJ() ? IJ[0] : s.e1);
  const E2 = () => (isIJ() ? IJ[1] : s.e2);
  const det = () => cross(E1(), E2());
  const isBasis = () => Math.abs(det()) > EPS;
  // 克拉默法则：a = λ₁e₁ + λ₂e₂ ⇔ λ₁ = (a×e₂)/(e₁×e₂)，λ₂ = (e₁×a)/(e₁×e₂)
  const lam = () => (isBasis() ? [cross(s.a, E2()) / det(), cross(E1(), s.a) / det()] : null);
  const inB = (p) => p && p[0] > XR[0] && p[0] < XR[1] && p[1] > YR[0] && p[1] < YR[1];
  const C = () => vecAdd(O, s.a);
  const M = () => { const l = lam(); return l ? vecAdd(O, vecMul(l[0], E1())) : null; };
  const N = () => { const l = lam(); return l ? vecAdd(O, vecMul(l[1], E2())) : null; };
  b.seg(() => longLine(O, E1()), { cls: 'thin' });
  b.seg(() => longLine(O, E2()), { cls: 'thin' });
  b.seg(() => (isBasis() ? [C(), M()] : [O, O]), { cls: 'dash' });
  b.seg(() => (isBasis() ? [C(), N()] : [O, O]), { cls: 'dash' });
  vec(b, () => (isBasis() ? [O, M()] : null), { cls: 'v1 soft' });
  vec(b, () => (isBasis() ? [O, N()] : null), { cls: 'v2 soft' });
  // λ₁e₁、λ₂e₂ 的标注放在 80% 处，避开 e₁、e₂ 终点的拖动柄
  const at80 = (P) => () => { const p = P(); const q = p && vecAdd(O, vecMul(0.8, vecSub(p, O))); return inB(q) && vecLen(vecSub(p, O)) > 1.2 ? q : null; };
  b.text(at80(M), () => (isIJ() ? 'xi' : 'λ₁e₁'), { cls: 'vlab v1', dx: 6, dy: 30 });
  b.text(at80(N), () => (isIJ() ? 'yj' : 'λ₂e₂'), { cls: 'vlab v2', dx: -60, dy: 4 });
  vec(b, () => [O, vecAdd(O, E1())], { cls: 'v1', label: () => (isIJ() ? 'i' : 'e₁'), side: 1 });
  vec(b, () => [O, vecAdd(O, E2())], { cls: 'v2', label: () => (isIJ() ? 'j' : 'e₂'), side: () => (isIJ() ? 1 : -1) });
  vec(b, () => [O, C()], { cls: 'v3', label: 'a', side: 1 });
  label(b, O, 'O', -22, 20);
  b.text(C, 'C', { cls: 'lb', dx: 10, dy: -8 });
  b.text(() => (inB(M()) ? M() : null), 'M', { cls: 'lb', dx: 10, dy: 22 });
  b.text(() => (inB(N()) ? N() : null), 'N', { cls: 'lb', dx: -26, dy: -4 });
  b.text(() => (isIJ() ? [XR[1] - 0.2, O[1]] : null), 'x', { cls: 'lb', dy: 24 });
  b.text(() => (isIJ() ? [O[0], YR[1] - 0.3] : null), 'y', { cls: 'lb', dx: 10 });
  const lim = (x, y) => [clamp(snap(x), XR[0] + 0.2, XR[1] - 0.2), clamp(snap(y), YR[0] + 0.2, YR[1] - 0.2)];
  const notZero = (p, old) => (vecLen(p) < 0.4 ? old : p);
  b.drag(C, (x, y) => { s.a = vecSub(lim(x, y), O); });
  const h1 = b.drag(() => vecAdd(O, E1()), (x, y) => { if (!isIJ()) s.e1 = notZero(vecSub(lim(x, y), O), s.e1); });
  const h2 = b.drag(() => vecAdd(O, E2()), (x, y) => { if (!isIJ()) s.e2 = notZero(vecSub(lim(x, y), O), s.e2); });
  b.onUpdate = () => {
    [h1, h2].forEach((h) => { h.style.display = isIJ() ? 'none' : ''; });
    const box = $('splitV');
    box.classList.toggle('warnline', !isBasis());
    box.classList.toggle('okline', isBasis() && isIJ());
    if (!isBasis()) {
      html('splitV', '<b>$\\boldsymbol e_1\\parallel\\boldsymbol e_2$：不能作为基底！</b>过 $C$ 作的平行线与直线 $OA$ 平行（或重合），交点 $M$ 找不到：'
        + `${Math.abs(cross(s.a, E1())) < EPS ? '此时 $\\boldsymbol a$ 恰好也共线，$\\lambda_1,\\lambda_2$ 有无数对，不唯一。' : '$\\boldsymbol a$ 不在这条直线上，一对 $\\lambda_1,\\lambda_2$ 也找不到。'}`);
      return;
    }
    const [l1, l2] = lam();
    const back = vecAdd(vecMul(l1, E1()), vecMul(l2, E2()));
    const ok = vecLen(vecSub(back, s.a)) < 1e-9 ? '✓' : '✗';
    if (isIJ()) {
      html('splitV', `正交单位基底：$\\boldsymbol a=${num(l1)}\\boldsymbol i${l2 < 0 ? '' : '+'}${num(l2)}\\boldsymbol j$，`
        + `$x=${num(l1)}$，$y=${num(l2)}$ 就是网格上数出的横、纵格数，记作 $\\boldsymbol a=${pair([l1, l2])}$ ${ok}`);
      return;
    }
    const sinT = Math.abs(det()) / (vecLen(E1()) * vecLen(E2()));
    const near = sinT < NEAR ? '<br><b>快要共线了：</b>平行四边形被拉得又细又长，$\\lambda$ 变得很大。' : '';
    html('splitV', `$\\boldsymbol e_1=${pair(E1())}$，$\\boldsymbol e_2=${pair(E2())}$，$\\boldsymbol a=${pair(s.a)}$（以 $O$ 为原点读格子）<br>`
      + `解方程组得 $\\lambda_1${eqv(l1)}$，$\\lambda_2${eqv(l2)}$；验算 $\\lambda_1\\boldsymbol e_1+\\lambda_2\\boldsymbol e_2$ 的终点与 $C$ 重合 ${ok}${near}`);
  };
  onBtn($('splitBtns'), (k) => {
    if (k === 'col') { s.mode = 'any'; s.e2 = vecMul(-0.5, s.e1); } else { s.mode = k; }
    setBtns($('splitBtns'), k);
    b.update();
  });
  b.update();
}

/* 第 6 页：例 1 □ABCD，对角线交于 M（图 9-3-4） */
function initEx1() {
  const A = [0, 0];
  const B = [4, 0];
  const D = [1.4, 2];
  const C = vecAdd(B, D);
  const M = vecMul(0.5, C);
  const b = board($('ex1B'), { x: [-0.6, 6.2], y: [-0.6, 2.6], axes: false, grid: false, w: 560 });
  b.poly([A, B, C, D], { cls: 'hexf' });
  b.seg([A, C], { cls: 'thin' });
  b.seg([B, D], { cls: 'thin' });
  vec(b, [A, B], { cls: 'v1', label: 'a', side: -1 });
  vec(b, [A, D], { cls: 'v2', label: 'b', side: 1 });
  const steps = [[[M, C], 'v3', 2], [[M, A], 'v3', 3], [[M, B], 'v4', 4], [[M, D], 'v4', 5]];
  steps.forEach(([sg, cls, n]) => { const v = vec(b, sg, { cls }); onStep([v.line, v.head], n); });
  [[A, 'A', -20, 18], [B, 'B', 8, 20], [C, 'C', 8, -6], [D, 'D', -22, -6], [M, 'M', -6, 28]].forEach(([p, t, dx, dy]) => label(b, p, t, dx, dy));
  b.update();
}

/* 第 7 页：例 2 斜面上的摩擦力（图 9-3-5，θ = 30°，|G| = mg 取 3 个单位） */
function initFric() {
  const TH = 30 / DEG;
  const G = 3;
  const b = board($('fricB'), { x: [-0.3, 6.6], y: [-0.5, 5.2], axes: false, grid: false, w: 520 });
  const t = [Math.cos(TH), Math.sin(TH)];
  const n = [-Math.sin(TH), Math.cos(TH)];
  b.poly([[0, 0], [6.2, 0], [6.2, 6.2 * Math.tan(TH)]], { cls: 'slope' });
  const base = vecMul(3.4, t);
  const h = 0.42;
  b.poly([vecAdd(base, vecMul(-h, t)), vecAdd(base, vecMul(h, t)), vecAdd(vecAdd(base, vecMul(h, t)), vecMul(2 * h, n)), vecAdd(vecAdd(base, vecMul(-h, t)), vecMul(2 * h, n))], { cls: 'blk' });
  const P = vecAdd(base, vecMul(h, n));
  const g = [0, -G];
  const N = vecMul(G * Math.cos(TH), n);
  const f = vecMul(G * Math.sin(TH), t);
  b.seg([vecAdd(P, vecMul(-1, f)), vecAdd(P, g)], { cls: 'dash' });
  b.seg([vecAdd(P, vecMul(-1, N)), vecAdd(P, g)], { cls: 'dash' });
  vec(b, [P, vecAdd(P, g)], { cls: 'v3', label: 'G', side: 1 });
  vec(b, [P, vecAdd(P, N)], { cls: 'v1', label: 'N', side: 1 });
  vec(b, [P, vecAdd(P, f)], { cls: 'v2', label: 'f', side: 1 });
  vec(b, [P, vecSub(P, f)], { cls: 'vg', label: '−f', side: 1 });
  b.curve((s) => [0.9 * Math.cos(s * TH), 0.9 * Math.sin(s * TH)], 0, 1, { cls: 'c2 arc' });
  b.text([1.05, 0.25], 'θ', { cls: 'lb' });
  b.update();
}

/* 第 8 页：向量的坐标——任意起点的 a 与从原点出发的 OA 坐标相同（图 9-3-6、9-3-7） */
function initCoord() {
  const XR = [-1.5, 8.5];
  const YR = [-1.2, 5.6];
  const s = { P: [3, 1], Q: [7, 3.5] };
  const b = board($('coordB'), { x: XR, y: YR, w: 600 });
  const a = () => vecSub(s.Q, s.P);
  const K = () => [s.Q[0], s.P[1]];
  vec(b, () => [s.P, K()], { cls: 'vg', label: () => (Math.abs(a()[0]) > 0.6 ? 'xi' : ''), side: () => (a()[0] > 0 ? -1 : 1) });
  vec(b, () => [K(), s.Q], { cls: 'vg', label: () => (Math.abs(a()[1]) > 0.6 ? 'yj' : ''), side: () => (a()[1] > 0 ? -1 : 1) });
  vec(b, () => [[0, 0], a()], { cls: 'v3 soft' });
  vec(b, () => [s.P, s.Q], { cls: 'v3', label: 'a', side: 1 });
  vec(b, [[0, 0], [1, 0]], { cls: 'v1', label: 'i', side: -1 });
  vec(b, [[0, 0], [0, 1]], { cls: 'v2', label: 'j', side: 1 });
  b.pt(a, { r: 5 });
  b.text(a, () => `A(${num(a()[0])}, ${num(a()[1])})`, { cls: 'lb up sm', dx: -10, dy: -10 }).setAttribute('text-anchor', 'end');
  const lim = (x, y) => [clamp(snap(x, 2), XR[0] + 0.5, XR[1] - 0.5), clamp(snap(y, 2), YR[0] + 0.7, YR[1] - 0.5)];
  b.drag(() => s.P, (x, y) => { const p = lim(x, y); if (vecLen(vecSub(s.Q, p)) > 0.4) s.P = p; });
  b.drag(() => s.Q, (x, y) => { const q = lim(x, y); if (vecLen(vecSub(q, s.P)) > 0.4) s.Q = q; });
  b.onUpdate = () => {
    const [x, y] = a();
    html('coordV', `$\\boldsymbol a=${num(x)}\\boldsymbol i${y < 0 ? '' : '+'}${num(y)}\\boldsymbol j=${pair(a())}$；平移到原点得 $\\overrightarrow{OA}$，终点 $A${pair(a())}$`);
  };
  b.update();
}

/* 第 9 页：坐标运算——拖 a、b 看 a+b、a−b、λa 的坐标 */
function initOps() {
  const XR = [-5.5, 6.5];
  const YR = [-4.2, 5.2];
  const O = [0, 0];
  const s = { a: [3, 1], b: [1, 3], mode: 'add', k: 1.5 };
  const b = board($('opsB'), { x: XR, y: YR, w: 600 });
  const A = () => s.a;
  const B = () => s.b;
  const is = (m) => s.mode === m;
  const res = () => (is('add') ? vecAdd(s.a, s.b) : is('sub') ? vecSub(s.a, s.b) : vecMul(s.k, s.a));
  b.seg(() => (is('add') ? [A(), res()] : [O, O]), { cls: 'dash' });
  b.seg(() => (is('add') ? [B(), res()] : [O, O]), { cls: 'dash' });
  vec(b, () => (is('sub') ? [B(), A()] : null), { cls: 'v4', label: '', side: 1 });
  vec(b, () => [O, A()], { cls: 'v1', label: 'a', side: -1 });
  vec(b, () => (is('mul') ? null : [O, B()]), { cls: 'v2', label: 'b', side: 1 });
  // mvec 的 cls 不能是函数：差向量（紫）与和/数乘（绿）各画一条，按模式显示
  vec(b, () => (is('sub') && vecLen(res()) > EPS ? [O, res()] : null), { cls: 'v4', label: 'a−b', side: -1 });
  vec(b, () => (!is('sub') && vecLen(res()) > EPS ? [O, res()] : null), { cls: 'v3', label: () => (is('add') ? 'a+b' : `${fmt(s.k)}a`), side: () => (is('mul') ? 1 : -1) });
  label(b, O, 'O', -20, 22);
  b.text(A, 'A', { cls: 'lb', dx: 8, dy: 22 });
  b.text(() => (is('mul') ? null : B()), 'B', { cls: 'lb', dx: -22, dy: -6 });
  b.pt(res, { r: 4 });
  const lim = (x, y) => [clamp(snap(x, 2), XR[0] + 0.5, XR[1] - 0.5), clamp(snap(y, 2), YR[0] + 0.5, YR[1] - 0.5)];
  const notZero = (p, old) => (vecLen(p) < 0.4 ? old : p);
  b.drag(A, (x, y) => { s.a = notZero(lim(x, y), s.a); });
  const hb = b.drag(B, (x, y) => { s.b = notZero(lim(x, y), s.b); });
  b.onUpdate = () => {
    hb.style.display = is('mul') ? 'none' : '';
    $('opsK').closest('.slider-row').style.visibility = is('mul') ? 'visible' : 'hidden';
    const [x1, y1] = s.a;
    const [x2, y2] = s.b;
    const head = `$\\boldsymbol a=${pair(s.a)}$${is('mul') ? '' : `，$\\boldsymbol b=${pair(s.b)}$`}<br>`;
    const r = res();
    const line = is('add') ? `$\\boldsymbol a+\\boldsymbol b=(${num(x1)}+${pv(x2)},\\ ${num(y1)}+${pv(y2)})=${pair(r)}$`
      : is('sub') ? `$\\boldsymbol a-\\boldsymbol b=\\overrightarrow{BA}=(${num(x1)}-${pv(x2)},\\ ${num(y1)}-${pv(y2)})=${pair(r)}$<br><span class="muted">紫色 $\\overrightarrow{BA}$：终点 $A$ 的坐标减去起点 $B$ 的坐标</span>`
        : `$${fmt(s.k)}\\boldsymbol a=(${fmt(s.k)}\\times${pv(x1)},\\ ${fmt(s.k)}\\times${pv(y1)})=${pair(r)}$`;
    html('opsV', `${head}${line}　<b>与图中终点坐标一致 ✓</b>`);
  };
  onBtn($('opsBtns'), (k) => { s.mode = k; setBtns($('opsBtns'), k); b.update(); });
  slider($('opsK'), (v) => { s.k = v; b.update(); });
}

/* 第 10 页：例 2 A(−1, 3)，B(1, −3)，C(4, 1)，D(3, 4)（图 9-3-10） */
function initEx2c() {
  const P = { O: [0, 0], A: [-1, 3], B: [1, -3], C: [4, 1], D: [3, 4] };
  const b = board($('ex2cB'), { x: [-2.4, 5.4], y: [-3.8, 4.8], w: 460 });
  const par = b.poly([P.O, P.C, P.D, P.A], { cls: 'hexf' });
  onStep([par], 3);
  vec(b, [P.O, P.A], { cls: 'v1' });
  vec(b, [P.O, P.B], { cls: 'v2' });
  vec(b, [P.C, P.D], { cls: 'v3' });
  [['A', -24, -4], ['B', 10, 6], ['C', 10, 20], ['D', 6, -10]].forEach(([n, dx, dy]) => label(b, P[n], n, dx, dy));
  b.update();
}

/* 第 12 页：例 3 直角三角形 ABC，AB = (2, 3)，AC = (1, k)，分类讨论 */
function initRt() {
  const A = [0, 0];
  const B = [2, 3];
  const KS = { A: -2 / 3, B: 11 / 3, C1: (3 + Math.sqrt(13)) / 2, C2: (3 - Math.sqrt(13)) / 2 };
  const KT = { A: '-\\dfrac23', B: '\\dfrac{11}{3}', C1: '\\dfrac{3+\\sqrt{13}}{2}', C2: '\\dfrac{3-\\sqrt{13}}{2}' };
  const s = { k: 'A' };
  const b = board($('rtB'), { x: [-0.8, 3.6], y: [-1.2, 4.2], w: 380, axes: false });
  const C = () => [1, KS[s.k]];
  b.poly(() => [A, B, C()], { cls: 'tri' });
  b.poly(() => {
    const v = s.k[0];
    if (v === 'A') return rtMark(A, B, C());
    if (v === 'B') return rtMark(B, vecSub(A, B), vecSub(C(), B));
    return rtMark(C(), vecSub(A, C()), vecSub(B, C()));
  }, { cls: 'rt' });
  label(b, A, 'A', -22, 20);
  label(b, B, 'B', 8, -6);
  b.pt(C, { r: 4 });
  b.text(C, 'C', { cls: 'lb', dx: 10, dy: 8 });
  onBtn($('rtBtns'), (k) => {
    s.k = k;
    setBtns($('rtBtns'), k);
    const c = C();
    const dots = { A: vecDot(B, c), B: vecDot(B, vecSub(c, B)), C: vecDot(c, vecSub(c, B)) };
    const v = k[0];
    const nm = { A: '\\overrightarrow{AB}\\cdot\\overrightarrow{AC}', B: '\\overrightarrow{AB}\\cdot\\overrightarrow{BC}', C: '\\overrightarrow{AC}\\cdot\\overrightarrow{BC}' }[v];
    html('rtV', `$k=${KT[k]}\\approx${fmt(c[1])}$：$\\angle ${v}=90^\\circ$，$${nm}=${num(dots[v])}$ ✓`);
    b.update();
  });
  $('rtBtns').querySelector('[data-k="A"]').click();
}

/* 第 13 页：平行与垂直的坐标条件——拖 a、b，实时看 x₁y₂ − x₂y₁ 与 x₁x₂ + y₁y₂ */
function initPar() {
  const XR = [-5.5, 5.5];
  const YR = [-4.2, 4.6];
  const s = { a: [3, 1], b: [1.5, 2.5] };
  const b = board($('parB'), { x: XR, y: YR, w: 560 });
  const O = [0, 0];
  b.seg(() => longLine(O, s.a), { cls: 'dash' });
  b.poly(() => (Math.abs(vecDot(s.a, s.b)) < EPS ? rtMark(O, s.a, s.b, 0.35) : [O, O, O]), { cls: 'rt' });
  vec(b, () => [O, s.a], { cls: 'v1', label: 'a', side: -1 });
  vec(b, () => [O, s.b], { cls: 'v2', label: 'b', side: 1 });
  label(b, O, 'O', -20, 22);
  const lim = (x, y) => [clamp(snap(x, 2), XR[0] + 0.5, XR[1] - 0.5), clamp(snap(y, 2), YR[0] + 0.5, YR[1] - 0.5)];
  const notZero = (p, old) => (vecLen(p) < 0.4 ? old : p);
  b.drag(() => s.a, (x, y) => { s.a = notZero(lim(x, y), s.a); });
  b.drag(() => s.b, (x, y) => { s.b = notZero(lim(x, y), s.b); });
  b.onUpdate = () => {
    const [x1, y1] = s.a;
    const [x2, y2] = s.b;
    const cr = x1 * y2 - x2 * y1;
    const dt = x1 * x2 + y1 * y2;
    const isPar = Math.abs(cr) < EPS;
    const isPerp = Math.abs(dt) < EPS;
    const st = isPar ? `<b>$\\boldsymbol a\\parallel\\boldsymbol b$（${dt > 0 ? '同向' : '反向'}，$\\boldsymbol b=${fmt(vecLen(s.b) / vecLen(s.a) * Math.sign(dt), 3)}\\boldsymbol a$）</b>`
      : isPerp ? '<b>$\\boldsymbol a\\perp\\boldsymbol b$</b>' : '既不平行也不垂直';
    $('parV').classList.toggle('okline', isPar || isPerp);
    html('parV', `$\\boldsymbol a=${pair(s.a)}$，$\\boldsymbol b=${pair(s.b)}$<br>`
      + `$x_1y_2-x_2y_1=${num(x1)}\\times${pv(y2)}-${pv(x2)}\\times${pv(y1)}=${num(cr)}$<br>`
      + `$x_1x_2+y_1y_2=${num(x1)}\\times${pv(x2)}+${pv(y1)}\\times${pv(y2)}=${num(dt)}$<br>${st}`);
  };
  b.update();
}

/* 第 14 页左：9.3.3 例 1 a = (1, 0)，b = (2, 1)，滑块调 k（步长 1/3） */
function initK() {
  const a = [1, 0];
  const bb = [2, 1];
  const s = { k3: 0 };
  const b = board($('kB'), { x: [-5.2, 7.6], y: [-1.6, 3.6], w: 560 });
  const O = [0, 0];
  const u = () => vecSub(vecMul(s.k3 / 3, a), bb); // ka − b
  const w = vecAdd(a, vecMul(3, bb)); // a + 3b = (7, 3)
  b.seg(longLine(O, w), { cls: 'dash' });
  vec(b, [O, w], { cls: 'v2', label: 'a+3b', side: 1 });
  vec(b, () => [O, u()], { cls: 'v1', label: 'ka−b', side: -1 });
  label(b, O, 'O', -8, 24);
  slider($('kS'), (v) => {
    s.k3 = v;
    const k = v / 3;
    const c = 3 * (k - 2) + 7;
    const isPar = Math.abs(c) < EPS;
    $('kV').classList.toggle('okline', isPar);
    html('kV', `$k${eqv(k)}$：$k\\boldsymbol a-\\boldsymbol b=${pair(u())}$，$3(k-2)-(-1)\\times7=${num(c)}$　${isPar ? '<b>平行，且方向相反</b>' : '不平行'}`);
    b.update();
  });
}

/* 第 14 页右：9.3.3 例 2 OA + tOB 的终点 P 只能在过 A、平行于 OB 的直线上 */
function initT() {
  const A = [3, 4];
  const B = [-1, 2];
  const C = [1, 1];
  const O = [0, 0];
  const s = { t: -1 };
  const b = board($('tB'), { x: [-1.6, 6.2], y: [-1.6, 6.4], w: 440 });
  const P = () => vecAdd(A, vecMul(s.t, B));
  b.seg(longLine(A, B), { cls: 'dash' });
  vec(b, [O, A], { cls: 'v1' });
  vec(b, [O, B], { cls: 'v2' });
  vec(b, () => (Math.abs(s.t) < EPS ? null : [A, P()]), { cls: 'v2 soft' });
  vec(b, () => [O, P()], { cls: 'v3' });
  label(b, O, 'O', -20, 20);
  b.text(A, 'A', { cls: 'lb', dx: 8, dy: -8 });
  b.text(B, 'B', { cls: 'lb', dx: -22, dy: -6 });
  b.pt(C, { r: 6, cls: 'c2' });
  b.text(C, 'C', { cls: 'lb', dx: 10, dy: 20 });
  b.text(P, 'P', { cls: 'lb', dx: 10, dy: -6 });
  const dist = Math.abs(cross(vecSub(C, A), B)) / vecLen(B); // C 到这条直线的距离 7/√5
  slider($('tS'), (v) => {
    s.t = v;
    html('tV', `$t=${fmt(v)}$：$P${pair(P())}$，$|PC|=${fmt(vecLen(vecSub(P(), C)))}$；$C$ 到直线的距离 $\\dfrac{7}{\\sqrt5}\\approx${fmt(dist)}\\gt0$，$P$ 永远到不了 $C$`);
    b.update();
  });
}

window.LESSON = {
  init() {
    initSlope();
    initForward();
    initSplit();
    initEx1();
    initFric();
    initCoord();
    initOps();
    initEx2c();
    initRt();
    initPar();
    initK();
    initT();
  },
};
