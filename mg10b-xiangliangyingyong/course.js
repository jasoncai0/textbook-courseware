'use strict';
/* 高一下 9.4 向量应用 · 本课互动：两人提水（拖夹角，拉力实时算）、例 1 三绳受力、例 2 垂心恒等式（拖顶点）、
 * 例 3 直线上点的坐标条件，以及练习的精确配图。通用部分见 ../shared/math.js、../shared/mvec.js；横纵同比例。 */
const { board, vec, vecAdd, vecSub, vecMul, vecLen, vecDot, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snapTo = (v, st) => Math.round(v / st) * st;
const setBtns = (box, key) => box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x.dataset.k === key));
const label = (b, p, t, dx, dy) => { b.pt(p, { r: 4 }); return b.text(p, t, { cls: 'lb', dx, dy }); };
/** 以 c 为圆心、半径 r，从方向角 a0 到 a1（弧度）的圆弧 */
const arc = (b, c, r, a0, a1, o = {}) => b.curve((t) => {
  const [p, q, R] = [val(a0), val(a1), val(r)];
  const a = p + (q - p) * t;
  return [val(c)[0] + R * Math.cos(a), val(c)[1] + R * Math.sin(a)];
}, 0, 1, { cls: o.cls || 'c2 arc', n: 60 });
const val = (v) => (typeof v === 'function' ? v() : v);
const hatch = (b, from, to, d, n) => {
  // 墙/天花板的短斜线：沿 from→to 等距画 n 条，方向 d
  for (let i = 0; i <= n; i++) {
    const p = vecAdd(from, vecMul(i / n, vecSub(to, from)));
    b.seg([p, vecAdd(p, d)], { cls: 'thin' });
  }
};

/* ---------- 提水：两拉力对称，夹角 θ，合力与重力平衡 ---------- */
const LIFT_G = 4 * Math.SQRT2; // N：θ = 90° 时每根恰为 4 N（习题 9.4 第 1 题）
const LIFT_MAX = 140;
const liftF = (th) => LIFT_G / (2 * Math.cos((th / 2) * DEG));
const liftVecs = (th) => {
  const h = (th / 2) * DEG;
  const F = liftF(th);
  return { F, f1: [-F * Math.sin(h), F * Math.cos(h)], f2: [F * Math.sin(h), F * Math.cos(h)] };
};

/** 两拉力 + 重力 + 合力虚线 + 菱形 + θ 弧；th 为函数 */
function drawLift(b, th, o = {}) {
  const O = [0, 0];
  const v = () => liftVecs(th());
  const up = [0, LIFT_G];
  b.seg(() => [v().f1, up], { cls: 'dash' });
  b.seg(() => [v().f2, up], { cls: 'dash' });
  vec(b, [O, up], { cls: 'vg' });
  vec(b, [O, [0, -LIFT_G]], { cls: 'v3', label: 'G', side: -1 });
  vec(b, () => [O, v().f1], { cls: 'v1', label: 'F₁', side: 1 });
  vec(b, () => [O, v().f2], { cls: 'v2', label: 'F₂', side: -1 });
  const R = o.arcR || 1.2;
  arc(b, O, R, () => (90 - th() / 2) * DEG, () => (90 + th() / 2) * DEG);
  b.text(() => (th() > 8 ? [0, R + 0.2] : null), 'θ', { cls: 'lb c2t', dx: 8 });
  label(b, O, 'O', 10, 22);
  return v;
}

function initLift() {
  const s = { th: 90 };
  const b = board($('liftB'), { x: [-8.6, 8.6], y: [-6.4, 6.4], axes: false, grid: false, w: 640 });
  const v = drawLift(b, () => s.th);
  b.drag(() => v().f2, (x, y) => {
    const h = Math.atan2(Math.max(x, 0), y) / DEG; // 与竖直向上方向的夹角
    s.th = clamp(Math.round(2 * h), 0, LIFT_MAX);
  });
  const fMax = liftF(LIFT_MAX);
  b.onUpdate = () => {
    const F = liftF(s.th);
    $('vF').textContent = `${fmt(F)} N`;
    $('vG').textContent = `${fmt(LIFT_G)} N`;
    $('barF').style.width = `${(F / fMax) * 100}%`;
    $('barG').style.width = `${(LIFT_G / fMax) * 100}%`;
    const cmp = Math.abs(F - LIFT_G) < 1e-9 ? '=' : F < LIFT_G ? '\\lt' : '\\gt';
    $('liftV').innerHTML = `$\\theta=${s.th}^\\circ$　每人拉力 $=${fmt(F / LIFT_G, 3)}\\,|\\boldsymbol G|\\ ${cmp}\\ |\\boldsymbol G|$`;
    tex($('liftV'));
    setBtns($('liftBtns'), String(s.th));
  };
  $('liftBtns').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]');
    if (!k) return;
    s.th = +k.dataset.k;
    b.update();
  });
  b.update();
}

/* 第 4 页：θ = 100° 的菱形，标出半角与半条对角线 */
function initRhomb() {
  const TH = 100;
  const b = board($('rhombB'), { x: [-6, 6], y: [-6.4, 6.4], axes: false, grid: false, w: 520 });
  const v = drawLift(b, () => TH, { arcR: 1 });
  const half = [0, LIFT_G / 2];
  b.seg(() => [v().f2, half], { cls: 'c2' }); // 两条对角线互相垂直平分
  b.seg([[0, 0], half], { cls: 'c3' }); // 半条对角线 = |G|/2
  b.poly(() => [[0, half[1]], [0.35, half[1]], [0.35, half[1] - 0.35], [0, half[1] - 0.35]], { cls: 'rt' });
  arc(b, [0, 0], 2, (90 - TH / 2) * DEG, 90 * DEG, { cls: 'c3 arc' });
  b.text([2.35 * Math.cos(62 * DEG), 2.35 * Math.sin(62 * DEG)], 'θ/2', { cls: 'lb c3t', dx: -4, dy: 6 });
  b.text([0, 2.1], '|G|/2', { cls: 'lb up c3t', dx: -62, dy: 6 });
  b.update();
}

/* ---------- 例 1：OA 方向可拖，OB 水平，OC 竖直；称盘重 10 N ---------- */
function initEx1() {
  const W = 2.5; // 10 N 画成 2.5 个单位
  const N_PER = 10 / W;
  const CEIL = 4;
  const WALL = 3;
  const O = [0, 0];
  const s = { ax: -2.4 };
  const b = board($('ex1B'), { x: [-5.4, 3.9], y: [-4.5, 4.7], axes: false, grid: false, w: 560 });
  const A = () => [s.ax, CEIL];
  const forces = () => {
    const u = vecMul(1 / vecLen(vecSub(A(), O)), vecSub(A(), O));
    const t = W / u[1];
    return { a: vecMul(t, u), b: [-t * u[0], 0], c: [0, -W] };
  };
  b.seg([[-5.2, CEIL], [0.6, CEIL]], { cls: 'ink' });
  hatch(b, [-5.1, CEIL], [0.5, CEIL], [0.3, 0.3], 18);
  b.seg([[WALL, -1], [WALL, 1.1]], { cls: 'ink' });
  hatch(b, [WALL, -0.95], [WALL, 1.05], [0.3, 0.3], 6);
  b.seg(() => [O, A()], { cls: 'rope' });
  b.seg([O, [WALL, 0]], { cls: 'rope' });
  b.seg([O, [0, -3]], { cls: 'rope' });
  b.poly([[0, -3], [-0.75, -4.2], [0.75, -4.2]], { cls: 'pan' });
  const cp = () => vecAdd(forces().a, forces().b);
  b.seg(() => [forces().a, cp()], { cls: 'dash' });
  b.seg(() => [forces().b, cp()], { cls: 'dash' });
  vec(b, () => [O, cp()], { cls: 'vg', label: 'c′', side: -1 });
  vec(b, () => [O, forces().c], { cls: 'v3', label: 'c', side: -1 });
  vec(b, () => [O, forces().b], { cls: 'v2', label: 'b', side: -1 });
  vec(b, () => [O, forces().a], { cls: 'v1', label: 'a', side: 1 });
  b.text(A, 'A', { cls: 'lb', dx: -8, dy: -12 });
  b.text([WALL, 0], 'B', { cls: 'lb', dx: 10, dy: 24 });
  b.text([0, -3], 'C', { cls: 'lb', dx: -24, dy: 4 });
  label(b, O, 'O', -26, 24);
  b.drag(A, (x) => { s.ax = snapTo(clamp(x, -4.6, -0.4), 0.05); });
  b.onUpdate = () => {
    const f = forces();
    const phi = Math.atan2(-s.ax, CEIL) / DEG;
    const [la, lb, lc] = [vecLen(f.a), vecLen(f.b), vecLen(f.c)].map((x) => x * N_PER);
    $('ex1V').innerHTML = `$OA$ 与竖直方向夹角 $\\varphi=${fmt(phi, 1)}^\\circ$：`
      + `$|\\boldsymbol a|=${fmt(la)}$ N，$|\\boldsymbol b|=${fmt(lb)}$ N，$|\\boldsymbol c|=${fmt(lc)}$ N　<b>$|\\boldsymbol a|$ 最大</b>`;
    tex($('ex1V'));
  };
  b.update();
}

/* ---------- 例 2：垂心。OC·AB = OB·AC − OA·BC 对任意 O 成立 ---------- */
/** 解 (H−A)·(C−B)=0，(H−B)·(C−A)=0；三点共线时返回 null */
function orthocenter(A, B, C) {
  const [u, w] = [vecSub(C, B), vecSub(C, A)];
  const det = u[0] * w[1] - u[1] * w[0];
  if (Math.abs(det) < 1e-9) return null;
  const [r1, r2] = [vecDot(A, u), vecDot(B, w)];
  return [(r1 * w[1] - r2 * u[1]) / det, (u[0] * r2 - w[0] * r1) / det];
}
/** P 在直线 QR 上的垂足 */
const foot = (P, Q, R) => {
  const d = vecSub(R, Q);
  return vecAdd(Q, vecMul(vecDot(vecSub(P, Q), d) / vecDot(d, d), d));
};
const dotsOf = ({ A, B, C, O }) => {
  const [oa, ob, oc] = [vecSub(A, O), vecSub(B, O), vecSub(C, O)];
  return { d1: vecDot(oa, vecSub(C, B)), d2: vecDot(ob, vecSub(C, A)), d3: vecDot(oc, vecSub(B, A)) };
};

function initEx2() {
  const s = { A: [-3.2, -2], B: [3.8, -2.2], C: [0.6, 3.4], O: [-1.6, 1.2], mode: 'free' };
  const b = board($('ex2B'), { x: [-5, 5.4], y: [-3.6, 4.6], axes: false, grid: false, w: 600 });
  const isH = () => s.mode === 'H';
  const lim = (x, y) => [clamp(snapTo(x, 0.1), -4.8, 5.2), clamp(snapTo(y, 0.1), -3.4, 4.4)];
  const pin = () => { if (isH()) { const h = orthocenter(s.A, s.B, s.C); if (h) s.O = h; } };
  // 高：从顶点到对边垂足，并延长到 O（O 在三角形外时也画得出）
  const alt = (P, Q, R) => () => (isH() ? [P(), foot(P(), Q(), R())] : null);
  const ext = (P, Q, R) => () => (isH() ? [foot(P(), Q(), R()), s.O] : null);
  const [gA, gB, gC] = [() => s.A, () => s.B, () => s.C];
  [[gA, gB, gC], [gB, gA, gC], [gC, gA, gB]].forEach(([P, Q, R]) => {
    b.seg(() => alt(P, Q, R)() || [[0, 0], [0, 0]], { cls: 'dash' });
    b.seg(() => ext(P, Q, R)() || [[0, 0], [0, 0]], { cls: 'dash' });
  });
  b.seg(() => [s.B, s.C], { cls: 'c1 side' });
  b.seg(() => [s.A, s.C], { cls: 'c2 side' });
  b.seg(() => [s.A, s.B], { cls: 'c3 side' });
  vec(b, () => [s.O, s.A], { cls: 'v1' });
  vec(b, () => [s.O, s.B], { cls: 'v2' });
  vec(b, () => [s.O, s.C], { cls: 'v3' });
  b.text(gA, 'A', { cls: 'lb', dx: -24, dy: 10 });
  b.text(gB, 'B', { cls: 'lb', dx: 12, dy: 10 });
  b.text(gC, 'C', { cls: 'lb', dx: -6, dy: -16 });
  b.text(() => s.O, 'O', { cls: 'lb', dx: 12, dy: -10 });
  ['A', 'B', 'C'].forEach((k) => b.drag(() => s[k], (x, y) => {
    const p = lim(x, y);
    const next = { ...s, [k]: p };
    if (isH() && !orthocenter(next.A, next.B, next.C)) return; // 不让三点共线
    s[k] = p;
    pin();
  }));
  b.drag(() => s.O, (x, y) => { s.O = lim(x, y); s.mode = 'free'; });
  const cell = (id, v) => {
    const z = Math.abs(v) < 5e-3;
    $(id).textContent = fmt(z ? 0 : v);
    $(id).classList.toggle('zero', z);
  };
  b.onUpdate = () => {
    const d = dotsOf(s);
    cell('d1', d.d1); cell('d2', d.d2); cell('d3', d.d3); cell('d4', d.d2 - d.d1);
    setBtns($('ex2Btns'), s.mode);
  };
  $('ex2Btns').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]');
    if (!k) return;
    s.mode = k.dataset.k;
    pin();
    b.update();
  });
  b.update();
}

/* 第 7 页：三条高交于一点（静态，按坐标算垂心） */
function initOrtho() {
  const [A, B, C] = [[-3, -1.6], [3.4, -1.6], [0.8, 3]];
  const H = orthocenter(A, B, C);
  const b = board($('orthoB'), { x: [-3.8, 4.2], y: [-2.3, 3.6], axes: false, grid: false, w: 480 });
  b.poly([A, B, C], { cls: 'tri' });
  [[A, B, C], [B, A, C], [C, A, B]].forEach(([P, Q, R]) => {
    const F = foot(P, Q, R);
    b.seg([P, F], { cls: 'c2' });
    const d = vecMul(0.3 / vecLen(vecSub(R, Q)), vecSub(R, Q));
    const n = vecMul(0.3 / vecLen(vecSub(P, F)), vecSub(P, F));
    b.poly([F, vecAdd(F, d), vecAdd(vecAdd(F, d), n), vecAdd(F, n)], { cls: 'rt' });
  });
  b.text(A, 'A', { cls: 'lb', dx: -22, dy: 10 });
  b.text(B, 'B', { cls: 'lb', dx: 8, dy: 10 });
  b.text(C, 'C', { cls: 'lb', dx: -6, dy: -12 });
  label(b, H, 'O', 10, -8);
  b.update();
}

/* ---------- 例 3：P 在直线 P₁P₂ 上 ⇔ (x₂−x₁)(y−y₁) = (y₂−y₁)(x−x₁) ---------- */
function initEx3() {
  const s = { p1: [1, 1], p2: [7, 4], p: [3.5, 4] };
  const b = board($('ex3B'), { x: [-0.8, 9.2], y: [-0.8, 6.2], w: 600 });
  const lim = (x, y) => [clamp(snapTo(x, 0.5), 0, 9), clamp(snapTo(y, 0.5), 0, 6)];
  const line = () => {
    const d = vecSub(s.p2, s.p1);
    return [vecAdd(s.p1, vecMul(-30, d)), vecAdd(s.p1, vecMul(30, d))];
  };
  b.seg(line, { cls: 'thin' });
  vec(b, () => [s.p1, s.p2], { cls: 'v1' });
  vec(b, () => [s.p1, s.p], { cls: 'v2' });
  b.text(() => s.p1, 'P₁', { cls: 'lb', dx: -14, dy: 28 });
  b.text(() => s.p2, 'P₂', { cls: 'lb', dx: 12, dy: 24 });
  b.text(() => s.p, 'P', { cls: 'lb', dx: -10, dy: -14 });
  b.text(() => vecAdd(s.p2, vecMul(0.12, vecSub(s.p2, s.p1))), 'l', { cls: 'lb', dx: 8, dy: -6 });
  const move = (k) => (x, y) => {
    const p = lim(x, y);
    if (k !== 'p' && vecLen(vecSub(p, k === 'p1' ? s.p2 : s.p1)) < 1e-9) return; // P₁ ≠ P₂
    s[k] = p;
  };
  b.drag(() => s.p1, move('p1'));
  b.drag(() => s.p2, move('p2'));
  b.drag(() => s.p, move('p'));
  b.onUpdate = () => {
    const [[x1, y1], [x2, y2], [x, y]] = [s.p1, s.p2, s.p];
    const L = (x2 - x1) * (y - y1);
    const R = (y2 - y1) * (x - x1);
    const on = Math.abs(L - R) < 1e-6;
    $('ex3V').innerHTML = `$(x_2-x_1)(y-y_1)=${fmt(L)}$，$(y_2-y_1)(x-x_1)=${fmt(R)}$　`
      + (on ? '<b class="ok">相等：P 在 l 上</b>' : '<b class="no">不等：P 不在 l 上</b>');
    tex($('ex3V'));
  };
  $('ex3On').addEventListener('click', () => {
    const f = foot(s.p, s.p1, s.p2);
    // 先找直线上离垂足最近的 0.5 格点（若有），否则用垂足本身
    const d = vecSub(s.p2, s.p1);
    const cands = [];
    for (let i = 0; i <= 18; i++) for (let j = 0; j <= 12; j++) {
      const q = [i / 2, j / 2];
      const cr = d[0] * (q[1] - s.p1[1]) - d[1] * (q[0] - s.p1[0]);
      if (Math.abs(cr) < 1e-9) cands.push(q);
    }
    cands.sort((u, w) => vecLen(vecSub(u, f)) - vecLen(vecSub(w, f)));
    s.p = cands.length && vecLen(vecSub(cands[0], f)) < 1.5 ? cands[0] : f;
    b.update();
  });
  b.update();
}

/* ---------- 练习 2：正方形边长 2，DE ⊥ AF ---------- */
function initSquare() {
  const [A, B, C, D] = [[0, 0], [2, 0], [2, 2], [0, 2]];
  const [E, F] = [[1, 0], [2, 1]];
  const X = [0.8, 0.4]; // DE 与 AF 的交点：D + t(1,−2) = s(2,1) ⇒ s = 0.4
  const b = board($('sqB'), { x: [-0.5, 2.6], y: [-0.4, 2.4], axes: false, grid: false, w: 420 });
  b.poly([A, B, C, D], { cls: 'tri' });
  vec(b, [D, E], { cls: 'v1' });
  vec(b, [A, F], { cls: 'v2' });
  const u = vecMul(0.12 / vecLen([1, -2]), [1, -2]);
  const w = vecMul(0.12 / vecLen([2, 1]), [2, 1]);
  b.poly([X, vecAdd(X, u), vecAdd(vecAdd(X, u), w), vecAdd(X, w)], { cls: 'rt' });
  [[A, 'A', -20, 18], [B, 'B', 8, 18], [C, 'C', 8, -6], [D, 'D', -20, -6], [E, 'E', -5, 24], [F, 'F', 10, 6]].forEach(([p, t, dx, dy]) => label(b, p, t, dx, dy));
  b.update();
}

/* ---------- 练习 1：角铁支架 AB:AC:BC = 3:4:5 ---------- */
function initPr1() {
  const [A, B, C] = [[0, 4], [3, 4], [0, 0]];
  const b = board($('pr1B'), { x: [-0.9, 4.2], y: [-0.5, 4.6], axes: false, grid: false, w: 300 });
  b.seg([[0, -0.3], [0, 4.4]], { cls: 'ink' });
  hatch(b, [0, -0.25], [0, 4.35], [-0.3, -0.3], 10);
  b.seg([A, B], { cls: 'beam' });
  b.seg([B, C], { cls: 'beam' });
  vec(b, [B, [3, 2.2]], { cls: 'v3', label: 'G', side: 1 });
  b.text(A, 'A', { cls: 'lb', dx: 8, dy: -8 });
  b.text(B, 'B', { cls: 'lb', dx: 6, dy: -8 });
  b.text(C, 'C', { cls: 'lb', dx: 8, dy: 6 });
  b.update();
}

/* ---------- 练习 6：平衡位置精确作图（30 N、40 N、50 N ⇒ F₁ ∝ (−4, 3)，F₂ ∝ (3, 4)） ---------- */
function initPr6() {
  const O = [0, 0];
  const P = [-4, 3];
  const P2 = [2.25, 3]; // 沿 (3, 4) 方向到同一高度
  const b = board($('pr6B'), { x: [-5, 3.3], y: [-2.6, 3.8], axes: false, grid: false, w: 400 });
  b.seg([[-4.6, 3.35], [-3.4, 3.35]], { cls: 'ink' });
  b.seg([[1.65, 3.35], [2.85, 3.35]], { cls: 'ink' });
  b.seg([P, O], { cls: 'rope' });
  b.seg([O, P2], { cls: 'rope' });
  b.seg([P, [-4, 1.2]], { cls: 'rope' });
  b.seg([P2, [2.25, 1.2]], { cls: 'rope' });
  b.seg([O, [0, -1.6]], { cls: 'rope' });
  const box = (x, y) => b.poly([[x - 0.35, y], [x + 0.35, y], [x + 0.35, y - 0.6], [x - 0.35, y - 0.6]], { cls: 'pan' });
  box(-4, 1.2); box(2.25, 1.2); box(0, -1.6);
  b.pt(P, { hollow: true, r: 7 });
  b.pt(P2, { hollow: true, r: 7 });
  b.text([-4, 0.6], '3 kg', { cls: 'lb up', dx: -22, dy: 22 });
  b.text([2.25, 0.6], '4 kg', { cls: 'lb up', dx: -22, dy: 22 });
  b.text([0, -2.2], '5 kg', { cls: 'lb up', dx: 22, dy: 6 });
  b.text(P, 'P', { cls: 'lb', dx: -30, dy: 8 });
  b.text(P2, 'P′', { cls: 'lb', dx: 12, dy: 0 });
  label(b, O, 'O', -8, 26);
  b.update();
}

window.LESSON = {
  init() {
    initLift();
    initRhomb();
    initEx1();
    initEx2();
    initOrtho();
    initEx3();
    initSquare();
    initPr1();
    initPr6();
  },
};
