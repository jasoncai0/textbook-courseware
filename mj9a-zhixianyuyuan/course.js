'use strict';
/* 九上 2.5 直线与圆的位置关系 · 本课互动：平移直线看 d 与 r、例 1 三个半径、绕半径外端旋转直线（切线判定）、
 * 三角形里剪最大的圆、尺规作内切圆（顶点可拖）、切线长与沿 OP 翻折。
 * 通用部分见 ../shared/math.js、mgeo.js、mproof.js、mcheck.js。所有图形由坐标计算，作图板横纵同比例；读数由坐标实时算出。 */
const { fmt, slider } = MathKit;
const { add, sub, mul, dot, len, dist, lerp, angle, meet, foot, line, arc, right } = Geo;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const HIDE = [99, 99];
const H2 = [HIDE, HIDE];
const val = (v) => (typeof v === 'function' ? v() : v);
const norm = (d) => ((d % 360) + 360) % 360;
const dirv = (d) => [Math.cos(d * RAD), Math.sin(d * RAD)];
const onC = (O, r, d) => add(O, mul(dirv(d), r));
const degOf = (O, p) => norm(Math.atan2(p[1] - O[1], p[0] - O[0]) / RAD);
const circ = (b, O, r, cls = 'circ') => b.curve((t) => onC(val(O), val(r), 360 * t), 0, 1, { cls, n: 180 });
const away = (P, O, off) => { const d = sub(P, O); const l = len(d) || 1; return add(P, mul(d, off / l)); };
const lab = (b, P, name, O, off = 0.36) => b.text(() => away(val(P), val(O), off), name, { dx: -6, dy: 7 });
/** 点 P 到直线 AB 的距离 */
const dLine = (P, A, B) => dist(P, foot(P, A, B));
/** 三角形内心与内切圆半径 */
function incircle(A, B, C) {
  const [a, b, c] = [dist(B, C), dist(C, A), dist(A, B)];
  const s = a + b + c;
  const I = [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s];
  return { I, r: dLine(I, B, C) };
}

/** 静态示意图。spec = { P: {A: [x, y]}, circles: [[C, r]], seg, dash, line, ang: [[V, A, B, label, r]], right: [[V, A, B]], w, pad, center, lab: {A: [dx, dy]}, hide, dots } */
function gfig(el, spec) {
  const P = spec.P;
  const xs = [];
  const ys = [];
  Object.values(P).forEach((p) => { xs.push(p[0]); ys.push(p[1]); });
  (spec.circles || []).forEach(([c, r]) => { xs.push(c[0] - r, c[0] + r); ys.push(c[1] - r, c[1] + r); });
  const pad = spec.pad ?? 0.55;
  const b = Geo.board(el, { x: [Math.min(...xs) - pad, Math.max(...xs) + pad], y: [Math.min(...ys) - pad, Math.max(...ys) + pad], w: spec.w || 360 });
  (spec.circles || []).forEach(([c, r]) => circ(b, c, r));
  const pairs = (str) => (str || '').split(/\s+/).filter(Boolean).map((t) => t.match(/[A-Za-z][′0-9₀-₉]*/g).map((n) => P[n]));
  pairs(spec.line).forEach(([p, q]) => line(b, p, q, { cls: 'gl thin-l' }));
  pairs(spec.dash).forEach(([p, q]) => b.seg([p, q], { cls: 'gdash' }));
  pairs(spec.seg).forEach(([p, q]) => b.seg([p, q], { cls: 'gs' }));
  (spec.ang || []).forEach(([v, a, c, t, rr]) => arc(b, P[v], P[a], P[c], { label: t, r: rr || 0.35 }));
  (spec.right || []).forEach(([v, a, c, s]) => right(b, P[v], P[a], P[c], { s: s || 0.2 }));
  (spec.dots || '').split('').filter(Boolean).forEach((n) => b.pt(P[n], { r: 3 }));
  const ctr = spec.center || mul(Object.values(P).reduce(add, [0, 0]), 1 / Object.keys(P).length);
  Object.entries(P).forEach(([name, p]) => {
    if ((spec.hide || '').includes(name)) return;
    const d = sub(p, ctr);
    const u = len(d) ? mul(d, 1 / len(d)) : [0, -1];
    const [dx, dy] = (spec.lab && spec.lab[name]) || [u[0] * 15 - 6, -u[1] * 15 + 7];
    b.text(p, name, { dx, dy });
  });
  b.update();
  return b;
}

/* ---------- 第 3 页：平移直线 ---------- */
function initSlide() {
  const O = [0, 0];
  const s = { d: 1.2, r: 2 };
  const SNAP = 0.06;
  const b = Geo.board($('sl'), { x: [-3.3, 3.3], y: [-4.15, 3], w: 480 });
  const D = () => [0, -s.d];
  const pts = () => (s.d < s.r - 1e-9 ? [-1, 1].map((k) => [k * Math.sqrt(s.r * s.r - s.d * s.d), -s.d]) : s.d <= s.r + 1e-9 ? [D()] : []);
  b.poly(() => [[-4.2, -s.d], [4.2, -s.d], [4.2, -s.d - 0.42], [-4.2, -s.d - 0.42]], { cls: 'ruler-band' });
  for (let i = -8; i <= 8; i++) b.seg(() => [[i * 0.5, -s.d], [i * 0.5, -s.d - (i % 2 ? 0.12 : 0.22)]], { cls: 'ruler-tk' });
  circ(b, O, () => s.r);
  b.seg(() => [[-4.2, -s.d], [4.2, -s.d]], { cls: 'gl' });
  b.seg(() => (s.d > 0.05 ? [O, D()] : H2), { cls: 'ln-d' });
  b.seg(() => [O, onC(O, s.r, 150)], { cls: 'ln-r' });
  right(b, () => (s.d > 0.3 ? D() : HIDE), O, [1, -s.d], { s: 0.2 });
  b.text(() => (s.d > 0.4 ? [0, -s.d / 2] : null), 'd', { dx: 6, dy: 6, cls: 'lb up dlab' });
  b.text(() => mul(onC(O, s.r, 150), 0.5), 'r', { dx: -2, dy: -6, cls: 'lb up rlab' });
  [0, 1].forEach((k) => b.pt(() => pts()[k] || null, { r: 6, cls: 'meet' }));
  b.pt(O, { r: 4 });
  b.text(O, 'O', { dx: 6, dy: -8 });
  b.text(() => [3.9, -s.d], 'l', { dx: -4, dy: -8 });
  b.text(() => (s.d > 0.3 ? D() : null), 'D', { dx: -18, dy: 20 });
  b.onUpdate = () => {
    const n = pts().length;
    $('slDv').textContent = fmt(s.d);
    $('slRv').textContent = fmt(s.r);
    $('slN').textContent = n;
    $('slCmp').textContent = n === 2 ? 'd < r' : n === 1 ? 'd = r' : 'd > r';
    const msg = $('slMsg');
    msg.className = `tip feedback ${n === 1 ? 'fb-ok' : ''}`;
    msg.textContent = ['没有公共点：直线与圆相离。', '只有一个公共点：直线与圆相切，D 就是切点。', '两个公共点：直线与圆相交。'][n];
  };
  const inp = $('slD');
  const setD = (v) => { s.d = Math.abs(v - s.r) < SNAP ? s.r : v; b.update(); };
  slider(inp, setD);
  slider($('slR'), (v) => { s.r = v; setD(+inp.value); });
  $('slBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-d]');
    if (!btn) return;
    const v = btn.dataset.d === 'r' ? s.r : +btn.dataset.d;
    inp.value = v;
    setD(v);
  });
}

/* ---------- 第 4、6 页：图 2-37 三种位置 ---------- */
function rel(id, d, w) {
  const r = 1.4;
  const D = [0, -d];
  const b = Geo.board($(id), { x: [-2.4, 2.4], y: [-2.75, 1.7], w });
  circ(b, [0, 0], r);
  b.seg([[-2.3, -d], [2.3, -d]], { cls: 'gl thin-l' });
  b.seg([[0, 0], D], { cls: 'gs' });
  right(b, D, [0, 0], [1, -d], { s: 0.18 });
  b.pt([0, 0], { r: 3 });
  b.text([0, 0], 'O', { dx: 5, dy: -5 });
  b.text(D, 'D', { dx: -6, dy: 20 });
  b.text([2.2, -d], 'l', { dx: -4, dy: -6 });
  b.update();
}

/* ---------- 第 5 页：例 1 ---------- */
function initEx1() {
  const A = [0, 0];
  const O = [2 * Math.SQRT2, 2 * Math.SQRT2];
  const D = [O[0], 0];
  const s = { r: 2 };
  const b = Geo.board($('ex1'), { x: [-0.7, 6.6], y: [-0.9, 6], w: 500 });
  b.seg([A, [6.4, 0]], { cls: 'gs' });
  b.seg([A, [4.6, 4.6]], { cls: 'gs' });
  circ(b, O, () => s.r);
  b.seg([O, D], { cls: 'gdash' });
  right(b, D, O, [6, 0], { s: 0.25 });
  arc(b, A, [1, 0], [1, 1], { r: 0.6, label: '45°', lr: 2 });
  const xs = () => { const d = O[1]; if (s.r < d - 1e-9) return []; const h = Math.sqrt(Math.max(0, s.r * s.r - d * d)); return h < 1e-6 ? [D] : [[O[0] - h, 0], [O[0] + h, 0]]; };
  [0, 1].forEach((k) => b.pt(() => xs()[k] || null, { r: 6, cls: 'meet' }));
  b.pt(O, { r: 4 });
  [[A, 'A', -8, 22], [[6.2, 0], 'B', -4, 22], [[4.5, 4.5], 'C', 8, 4], [O, 'O', -22, -4], [D, 'D', 6, 22]].forEach(([p, t, dx, dy]) => b.text(p, t, { dx, dy }));
  b.text([O[0], O[1] / 2], 'd', { dx: 6, dy: 6, cls: 'lb up dlab' });
  b.onUpdate = () => {
    const d = O[1];
    const k = Math.abs(s.r - d) < 1e-9 ? 0 : s.r < d ? 1 : -1;
    const rTxt = k === 0 ? '2\\sqrt2' : fmt(s.r);
    const msg = $('ex1Msg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$d=2\\sqrt2\\approx2.83$，$r=${rTxt}$：${['$d=r$，相切（1 个公共点）', '$d&gt;r$，相离（没有公共点）', '$d&lt;r$，相交（2 个公共点）'][k === 0 ? 0 : k === 1 ? 1 : 2]}．`;
    MathKit.tex(msg);
  };
  $('ex1Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-r]');
    if (!btn) return;
    s.r = +btn.dataset.r;
    $('ex1Btns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* ---------- 第 7 页：绕半径外端旋转直线 ---------- */
function initTangent() {
  const O = [0, 0];
  const R = 2;
  const D = [0, -R];
  const s = { t: 25 }; // 直线 l 的方向角
  const u = () => dirv(s.t);
  const H = () => add(D, mul(u(), 2.6));
  const ang = () => Math.acos(Math.min(1, Math.abs(Math.sin(s.t * RAD)))) / RAD; // l 与 OD（竖直）的夹角
  const dd = () => R * Math.abs(Math.cos(s.t * RAD));
  const other = () => add(D, mul(u(), 4 * Math.sin(s.t * RAD)));
  const b = Geo.board($('tg'), { x: [-3.6, 3.6], y: [-4.2, 2.5], w: 480 });
  circ(b, O, R);
  b.seg([O, D], { cls: 'gs' });
  line(b, D, H, { cls: 'gl' });
  b.seg(() => (Math.abs(ang() - 90) < 1e-6 ? H2 : [O, foot(O, D, H())]), { cls: 'ln-d' });
  right(b, () => (Math.abs(ang() - 90) < 1e-6 ? D : HIDE), O, [1, -R], { s: 0.22 });
  b.pt(() => (Math.abs(ang() - 90) < 1e-6 ? null : other()), { r: 6, cls: 'meet' });
  b.pt(D, { r: 6, cls: 'meet' });
  b.pt(O, { r: 4 });
  b.text(O, 'O', { dx: 6, dy: -8 });
  b.text(D, 'D', { dx: -22, dy: 20 });
  b.text(() => add(D, mul(u(), 3.2)), 'l', { dx: -4, dy: 6 });
  b.drag(H, (x, y) => {
    let t = degOf(D, [x, y]);
    if (t > 180) t -= 180;
    if (Math.abs(t) < 2.5 || Math.abs(t - 180) < 2.5) t = 0;
    s.t = t;
  });
  b.onUpdate = () => {
    const a = ang();
    const tan = Math.abs(a - 90) < 1e-6;
    $('tgA').textContent = `${fmt(a, 1)}°`;
    $('tgN').textContent = tan ? 1 : 2;
    $('tgD').textContent = fmt(dd());
    const msg = $('tgMsg');
    msg.className = `tip feedback ${tan ? 'fb-ok' : ''}`;
    msg.textContent = tan ? 'l ⊥ OD：d = OD = r，只有一个公共点 D——l 是切线。' : `l 与 OD 不垂直：d = ${fmt(dd())} < 2，有两个公共点。`;
  };
  b.update();
}

/* ---------- 第 12 页：剪最大的圆 ---------- */
function initCut() {
  const A = [1.4, 4.4];
  const B = [0, 0];
  const C = [6.2, 0];
  const { I, r: rIn } = incircle(A, B, C);
  const s = { P: [4, 1] };
  const ds = () => [dLine(s.P, B, C), dLine(s.P, C, A), dLine(s.P, A, B)];
  const rr = () => Math.min(...ds());
  const side = (p, q, x) => (q[0] - p[0]) * (x[1] - p[1]) - (q[1] - p[1]) * (x[0] - p[0]);
  const inside = (x) => side(B, C, x) > 0 && side(C, A, x) > 0 && side(A, B, x) > 0;
  const b = Geo.board($('cut'), { x: [-0.5, 6.7], y: [-0.6, 4.9], w: 500 });
  b.poly([A, B, C], { cls: 'tri-f' });
  circ(b, () => s.P, rr, 'cut-c');
  b.pt(() => s.P, { r: 3 });
  [[A, 'A', -4, -8], [B, 'B', -18, 18], [C, 'C', 4, 18]].forEach(([p, t, dx, dy]) => b.text(p, t, { dx, dy }));
  b.drag(() => s.P, (x, y) => {
    let p = [x, y];
    if (dist(p, I) < 0.12) p = I;
    if (inside(p) && Math.min(dLine(p, B, C), dLine(p, C, A), dLine(p, A, B)) > 0.15) s.P = p;
  });
  b.onUpdate = () => {
    const d = ds();
    const r = rr();
    [['cutA', d[0]], ['cutB', d[1]], ['cutC', d[2]], ['cutR', r]].forEach(([id, v]) => { $(id).textContent = fmt(v); });
    const touch = d.filter((v) => v - r < 1e-6).length;
    const msg = $('cutMsg');
    const best = dist(s.P, I) < 1e-9;
    msg.className = `tip feedback ${best ? 'fb-ok' : ''}`;
    msg.textContent = best
      ? `三条边都碰到了，半径 ${fmt(rIn)} 最大：圆心到三边的距离相等。`
      : `圆只碰到 ${touch} 条边，往离边远的方向挪一挪，还能更大。`;
  };
  $('cutBest').addEventListener('click', () => { s.P = I; b.update(); });
  b.update();
}

/* ---------- 第 13 页：尺规作内切圆 ---------- */
function initIncircle() {
  const s = { A: [2, 4.3], B: [0, 0], C: [6, 0], k: 0 };
  const bisFoot = (V, P, Q) => lerp(P, Q, dist(V, P) / (dist(V, P) + dist(V, Q)));
  const M = () => bisFoot(s.B, s.C, s.A); // ∠B 的平分线与 AC 的交点
  const N = () => bisFoot(s.C, s.B, s.A); // ∠C 的平分线与 AB 的交点
  const inc = () => incircle(s.A, s.B, s.C);
  const D = () => foot(inc().I, s.B, s.C);
  const b = Geo.board($('ic'), { x: [-0.6, 6.8], y: [-0.7, 5], w: 500 });
  b.poly(() => [s.A, s.B, s.C], { cls: 'tri-f' });
  const on = (n) => () => s.k >= n;
  b.seg(() => (on(1)() ? [s.B, M()] : H2), { cls: 'bis' });
  b.seg(() => (on(1)() ? [s.C, N()] : H2), { cls: 'bis' });
  arc(b, () => s.B, () => s.C, () => s.A, { r: 0.55, show: on(1), cls: 'garc' });
  arc(b, () => s.C, () => s.A, () => s.B, { r: 0.55, show: on(1), cls: 'garc' });
  b.seg(() => (on(2)() ? [inc().I, D()] : H2), { cls: 'ln-d' });
  right(b, () => (on(2)() ? D() : HIDE), () => s.C, () => inc().I, { s: 0.2 });
  b.curve((t) => (on(3)() ? onC(inc().I, inc().r, 360 * t) : [NaN, NaN]), 0, 1, { cls: 'in-c', n: 160 });
  b.pt(() => (on(1)() ? inc().I : null), { r: 4 });
  b.text(() => (on(1)() ? inc().I : null), 'O', { dx: 4, dy: -8 });
  b.text(() => (on(1)() ? M() : null), 'M', { dx: 6, dy: -4 });
  b.text(() => (on(1)() ? N() : null), 'N', { dx: -20, dy: -4 });
  b.text(() => (on(2)() ? D() : null), 'D', { dx: -6, dy: 22 });
  b.text(() => s.A, 'A', { dx: -6, dy: -10 });
  b.text(() => s.B, 'B', { dx: -20, dy: 16 });
  b.text(() => s.C, 'C', { dx: 6, dy: 16 });
  const area = (A, B, C) => ((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
  const fits = (p) => p[0] > -0.4 && p[0] < 6.6 && p[1] > -0.5 && p[1] < 4.8;
  ['A', 'B', 'C'].forEach((n) => b.drag(() => s[n], (x, y) => {
    const t = { ...s, [n]: [x, y] };
    if (fits([x, y]) && area(t.A, t.B, t.C) > 2) Object.assign(s, t); // 保持顶点顺序（A 在 BC 上方）且不退化
  }, { r: 7, hit: 18 }));
  const setK = (k) => {
    s.k = k;
    $('icBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', +x.dataset.k <= s.k));
    b.update();
  };
  $('icBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (btn) setK(+btn.dataset.k);
  });
  b.update();
  return setK;
}

/* ---------- 第 16 页：切线长与翻折 ---------- */
function initTanLen() {
  const O = [0, 0];
  const R = 2;
  const s = { P: [4.4, 0.6], f: 0 };
  const al = () => degOf(O, s.P);
  const phi = () => Math.acos(R / dist(O, s.P)) / RAD;
  const A = () => onC(O, R, al() + phi());
  const Bo = () => onC(O, R, al() - phi());
  /** 沿直线 OP 翻折（俯视）：翻折进度 f，从 0 到 1 */
  const fold = (X) => { const F = foot(X, O, s.P); return add(F, mul(sub(X, F), 1 - 2 * s.f)); };
  const B = () => fold(Bo());
  const b = Geo.board($('tl'), { x: [-2.7, 5.6], y: [-3, 3], w: 500 });
  b.curve((t) => onC(O, R, al() + 180 * t), 0, 1, { cls: 'circ', n: 120 });
  b.curve((t) => onC(O, R, al() - 180 * t), 0, 1, { cls: 'circ low', n: 120 });
  b.curve((t) => fold(onC(O, R, al() - 180 * t)), 0, 1, { cls: 'circ fold', n: 120 });
  b.seg(() => [add(O, mul(sub(O, s.P), 0.45)), add(s.P, mul(sub(s.P, O), 0.12))], { cls: 'gdash' });
  b.seg(() => [s.P, A()], { cls: 'gs' });
  b.seg(() => [O, A()], { cls: 'ln-d' });
  b.seg(() => [s.P, B()], { cls: 'gs fold-l' });
  b.seg(() => [O, B()], { cls: 'ln-d' });
  right(b, A, O, () => s.P, { s: 0.22 });
  right(b, B, O, () => s.P, { s: 0.22 });
  b.pt(O, { r: 4 });
  b.text(O, 'O', { dx: -8, dy: 22 });
  b.text(() => s.P, 'P', { dx: 8, dy: 6 });
  lab(b, A, 'A', O, 0.35);
  b.text(() => (s.f > 0.97 ? null : away(B(), O, 0.35)), 'B', { dx: -6, dy: 7 });
  b.drag(() => s.P, (x, y) => {
    if (dist(O, [x, y]) > 2.7 && x < 5.3 && Math.abs(y) < 2.7) s.P = [x, y];
  });
  b.onUpdate = () => {
    $('tlA').textContent = fmt(dist(s.P, A()));
    $('tlB').textContent = fmt(dist(s.P, Bo()));
  };
  slider($('tlF'), (v) => { s.f = v; b.update(); });
}

/* ---------- 例题、练习的精确示意图 ---------- */
function initFigs() {
  rel('f237a', 0.8, 220); rel('f237b', 1.4, 220); rel('f237c', 2.0, 220);
  rel('t1', 0.8, 150); rel('t2', 1.4, 150); rel('t3', 2.0, 150);
  const O = [0, 0];
  gfig($('f242'), { P: { O, D: [0, -2], 'D′': [0.6, -2], l: [3, -2] }, circles: [[O, 2]], seg: 'OD', dash: 'OD′', line: 'Dl', right: [['D′', 'O', 'l']], hide: 'l', dots: 'O', w: 340, lab: { D: [-18, 20], 'D′': [2, 20], O: [6, -6] } });
  gfig($('f243'), { P: { O, A: [-2, 0], B: [2, 0], C: onC(O, 2, 245), D: [-2, -2.3] }, circles: [[O, 2]], seg: 'AB AC BC', line: 'AD', dots: 'O', center: O, w: 340, lab: { O: [-4, 20], A: [-22, -6], D: [-22, 8] } });
  const A4 = [-2, 0];
  const D4 = onC(O, 2, 70);
  const E4 = meet(A4, add(A4, dirv(70)), D4, add(D4, dirv(160)));
  gfig($('f244'), { P: { O, A: A4, B: [2, 0], D: D4, E: E4, C: add(A4, mul(sub(E4, A4), 1.18)) }, circles: [[O, 2]], seg: 'AB AC AD DE', dash: 'OD', dots: 'O', center: O, w: 340, lab: { O: [-4, 20], E: [-20, -2], C: [-6, -8] } });
  const [B7, C7] = [[0, 0], [4, 0]];
  const A7 = meet(B7, dirv(60), C7, add(C7, dirv(110)));
  const { I, r } = incircle(A7, B7, C7);
  gfig($('f247'), { P: { A: A7, B: B7, C: C7, O: I, D: foot(I, B7, C7), E: foot(I, C7, A7), F: foot(I, A7, B7) }, circles: [[I, r]], seg: 'AB BC CA DE DF', dash: 'OE OF', dots: 'O', w: 300, lab: { O: [-4, 20], D: [-6, 22] } });
  const D5 = onC(O, 1, 120);
  const E5 = onC(O, 1, 240);
  const A5 = [-2, 0];
  gfig($('f251'), { P: { O, A: A5, B: sub(mul(D5, 2), A5), C: sub(mul(E5, 2), A5), D: D5, E: E5 }, circles: [[O, 2], [O, 1]], seg: 'AB AC', dash: 'OD OE', dots: 'O', center: O, w: 300, lab: { O: [6, 6], D: [-4, -6], E: [-4, 20] } });
  gfig($('p1'), { P: { O, P: onC(O, 2, 50) }, circles: [[O, 2]], dots: 'OP', center: O, w: 200, lab: { O: [-18, 6] } });
  gfig($('p2'), { P: { O, A: [0, -2], B: [0, 2], C: [4, -2] }, circles: [[O, 2]], seg: 'AB BC AC', dots: 'O', w: 240, lab: { O: [-18, 6], A: [-6, 20], B: [-6, -8] } });
  gfig($('p3'), { P: { O, A: [-1.6, -1.2], B: [1.6, -1.2], P: [0, -1.2] }, circles: [[O, 2], [O, 1.2]], seg: 'AB', dots: 'OP', center: O, w: 200, lab: { O: [6, -4], P: [-6, 20] } });
  const [Bp, Cp] = [[0, 0], [4, 0]];
  const Ap = meet(Bp, dirv(50), Cp, add(Cp, dirv(120)));
  gfig($('p70'), { P: { A: Ap, B: Bp, C: Cp, O: incircle(Ap, Bp, Cp).I }, seg: 'AB BC CA OB OC', w: 320, lab: { O: [-4, -8] } });
}

MProof.addBasis({
  'zj-90': { t: '直径所对的圆周角是直角', kind: '推论', src: '九上 2.4（课本 p56）', body: '直径所对的圆周角是直角，$90^\\circ$ 的圆周角所对的弦是直径．' },
  yzj: { t: '圆周角定理', kind: '定理', src: '九上 2.4（课本 p55）', body: '圆周角的度数等于它所对弧上的圆心角度数的一半，同弧或等弧所对的圆周角相等．' },
  'dy-xz': { t: '等边对等角', kind: '定理', src: '八上 2.5 等腰三角形的轴对称性', body: '等腰三角形的两底角相等．' },
  'qx-pd': { t: '切线的判定', kind: '定理', src: '九上 2.5（课本 p66）', body: '经过半径的外端并且垂直于这条半径的直线是圆的切线．' },
  'qx-xz': { t: '切线的性质', kind: '定理', src: '九上 2.5（课本 p67）', body: '圆的切线垂直于经过切点的半径．' },
  qxc: { t: '切线长定理', kind: '定理', src: '九上 2.5（课本 p71）', body: '过圆外一点所画的圆的两条切线长相等．' },
  hl: { t: '“HL”', kind: '定理', src: '八上 1.3 探索三角形全等的条件', body: '斜边和一条直角边分别相等的两个直角三角形全等．' },
  cj: { t: '垂径定理', kind: '定理', src: '九上 2.2 圆的对称性', body: '垂直于弦的直径平分弦以及弦所对的两条弧．所以 $OD\\perp AB$ ⇒ $AD=BD$，$AB=2AD$．' },
});

let icStep = null;

window.LESSON = {
  init() {
    MProof.init();
    initSlide();
    initEx1();
    initTangent();
    initCut();
    icStep = initIncircle();
    initTanLen();
    initFigs();
  },
  onRender(slide, step) {
    // 作图三步跟着翻页步骤走（第 1–3 步），也可以直接点按钮
    if (icStep && slide.contains($('ic'))) icStep(Math.min(step, 3));
    requestAnimationFrame(Geo.refresh);
  },
};
