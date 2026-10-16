'use strict';
/* 七下 7.3 图形的平移 · 本课互动：三角尺沿直尺平移、方格纸两次平移、拖动四边形到位、例题分步作图。
 * 通用部分见 ../shared/math.js、../shared/mgeo.js；方格纸上的点都是整数格点，平移量按格计算。 */
const { tex, fmt } = MathKit;
const { add, sub, mul, dir, len, lerp, line, sketch } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const shift = (pts, v) => pts.map((p) => add(p, v));
const prime = (n, k = 1) => n + '′'.repeat(k);

/** 方格纸：cols × rows 格，画网格线 */
function gridBoard(id, cols, rows, w = 560) {
  const b = Geo.board($(id), { x: [-0.4, cols + 0.4], y: [-0.4, rows + 0.4], w, grid: false });
  for (let x = 0; x <= cols; x++) b.seg([[x, 0], [x, rows]], { cls: 'gridl' });
  for (let y = 0; y <= rows; y++) b.seg([[0, y], [cols, y]], { cls: 'gridl' });
  return b;
}
const moveText = ([dx, dy]) => {
  const parts = [];
  if (dx) parts.push(`向${dx > 0 ? '右' : '左'} ${Math.abs(dx)} 格`);
  if (dy) parts.push(`向${dy > 0 ? '上' : '下'} ${Math.abs(dy)} 格`);
  return parts.join('、') || '没有移动';
};

/* ---------- 第 3 页：三角尺沿直尺平移（图 7-16） ---------- */
function initS16() {
  const U = dir(105);
  const N = dir(15); // 垂直于直尺、指向右侧
  const B0 = [1.2, 0.3];
  const tri = (d) => { const B = add(B0, mul(U, d)); return { B, C: sub(B, mul(U, 2.2)), A: add(B, mul(N, 2.6)) }; };
  const s = { d: 1.8 };
  const b = Geo.board($('slide16'), { x: [-1.6, 4.6], y: [-2.6, 5.4], w: 420 });
  const R = [add(B0, mul(U, -3.2)), add(B0, mul(U, 5.4))];
  b.poly([R[0], R[1], add(R[1], mul(N, -0.6)), add(R[0], mul(N, -0.6))], { cls: 'ruler' });
  b.poly(() => { const t = tri(0); return [t.A, t.B, t.C]; }, { cls: 'tri0' });
  ['A', 'B', 'C'].forEach((k) => b.seg(() => [tri(0)[k], tri(s.d)[k]], { cls: 'corr' }));
  b.poly(() => { const t = tri(s.d); return [t.A, t.B, t.C]; }, { cls: 'tri1' });
  const off = { A: [8, 6], B: [-22, -4], C: [-22, 10] };
  ['A', 'B', 'C'].forEach((k) => {
    b.text(() => tri(0)[k], k, { dx: off[k][0], dy: off[k][1] });
    b.text(() => (s.d > 0.25 ? tri(s.d)[k] : null), prime(k), { dx: off[k][0], dy: off[k][1] });
  });
  b.onUpdate = () => {
    $('s16V').textContent = `${fmt(s.d, 1)} 格`;
    ['a', 'b', 'c'].forEach((k) => { $(`s16${k}`).textContent = `${fmt(s.d, 1)} 格`; });
  };
  MathKit.slider($('s16'), (v) => { s.d = v; b.update(); });
}

/* ---------- 第 5 页：图 7-17 两次平移 ---------- */
function initG717() {
  const AB = [[6, 1], [12, 3]];
  const V1 = [-4, 0];
  const V2 = [-4, 3];
  const s = { k: 0, t: 1 };
  const b = gridBoard('g717', 14, 7);
  const seg2 = (v, show) => b.seg(() => (show() ? shift(AB, v()) : [[-9, -9], [-9, -9]]), { cls: 'gs mv' });
  b.seg(AB, { cls: 'gs org' });
  // 动画：t 从 0 到 1，新线段从上一个位置滑到新位置
  const v1 = () => (s.k === 1 ? mul(V1, s.t) : V1);
  const v2 = () => (s.k === 2 ? lerp(V1, V2, s.t) : V2);
  seg2(v1, () => s.k >= 1);
  seg2(v2, () => s.k >= 2);
  b.seg(() => (s.k >= 3 ? [AB[0], add(AB[0], V2)] : [[-9, -9], [-9, -9]]), { cls: 'corr2' });
  b.seg(() => (s.k >= 3 ? [AB[1], add(AB[1], V2)] : [[-9, -9], [-9, -9]]), { cls: 'corr2' });
  const lab = (p, t, on) => b.text(() => (on() ? p() : null), t, { dx: -18, dy: 22 });
  lab(() => AB[0], 'A', () => true); lab(() => AB[1], 'B', () => true);
  lab(() => add(AB[0], v1()), "A′", () => s.k >= 1 && (s.k > 1 || s.t > 0.99)); lab(() => add(AB[1], v1()), "B′", () => s.k >= 1 && (s.k > 1 || s.t > 0.99));
  lab(() => add(AB[0], v2()), "A″", () => s.k >= 2 && (s.k > 2 || s.t > 0.99)); lab(() => add(AB[1], v2()), "B″", () => s.k >= 2 && (s.k > 2 || s.t > 0.99));
  const MSG = [
    '点按钮，一步一步平移线段 AB。',
    'A(6,1)、B(12,3) 都向左移 4 格：A′(2,1)、B′(8,3)，再连线。',
    'A′、B′ 都向上移 3 格：A″(2,4)、B″(8,6)。',
    'AA″ 与 BB″：都是“向左 4 格、向上 3 格”，互相平行且相等。',
  ];
  b.onUpdate = () => { $('g717Msg').textContent = MSG[s.k]; };
  const animate = () => {
    const t0 = performance.now();
    const tick = (now) => { s.t = Math.min(1, (now - t0) / 700); b.update(); if (s.t < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  $('g717Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    const k = +btn.dataset.k;
    if (k && k !== s.k + 1) return; // 按顺序来
    s.k = k;
    s.t = k === 1 || k === 2 ? 0 : 1;
    if (s.t === 0) animate(); else b.update();
  });
  b.update();
}

/* ---------- 可拖动的方格纸图形（第 6、9 页） ---------- */
// opt: { cols, rows, polys: [[pts]...], names: {A: [x,y]}, target: [dx,dy], grip: 'A', fill }
function gridDrag(id, opt) {
  const s = { v: [0, 0] };
  const b = gridBoard(id, opt.cols, opt.rows, opt.w || 560);
  const done = () => s.v[0] === opt.target[0] && s.v[1] === opt.target[1];
  opt.polys.forEach((P, i) => b.poly(shift(P, opt.target), { cls: i ? 'ghost hole' : 'ghost' }));
  opt.polys.forEach((P, i) => b.poly(P, { cls: i ? 'org-f hole' : 'org-f' }));
  Object.entries(opt.names).forEach(([n, p]) => {
    b.seg(() => (done() && opt.links ? [p, add(p, s.v)] : [[-9, -9], [-9, -9]]), { cls: 'corr2' });
  });
  const moved = opt.polys.map((P, i) => b.poly(() => shift(P, s.v), { cls: i ? 'mv-f hole' : 'mv-f' }));
  Object.entries(opt.names).forEach(([n, p]) => {
    const o = (opt.lab && opt.lab[n]) || [-18, 22];
    b.text(p, n, { dx: o[0], dy: o[1] });
    // 目标位置标 A′ 等；移动中的图形不另标，免得出现两个 A′
    if (opt.showTarget || opt.markTarget) b.text(add(p, opt.target), prime(n), { dx: o[0], dy: o[1], cls: 'lb tgt' });
  });
  if (opt.markTarget) b.pt(add(opt.names[opt.grip], opt.target), { cls: 'c2', r: 6 });
  const g = opt.names[opt.grip];
  b.drag(() => add(g, s.v), (x, y) => {
    s.v = [Math.round(clamp(x, 0, opt.cols)) - g[0], Math.round(clamp(y, 0, opt.rows)) - g[1]];
    // 整个图形不能出格
    const pts = opt.polys.flat().map((p) => add(p, s.v));
    const xs = pts.map((p) => p[0]); const ys = pts.map((p) => p[1]);
    const fx = Math.max(0, -Math.min(...xs)) - Math.max(0, Math.max(...xs) - opt.cols);
    const fy = Math.max(0, -Math.min(...ys)) - Math.max(0, Math.max(...ys) - opt.rows);
    s.v = [s.v[0] + fx, s.v[1] + fy];
  });
  b.onUpdate = () => {
    moved.forEach((m) => m.classList.toggle('ok', done()));
    if (opt.onState) opt.onState(s.v, done());
  };
  b.update();
}

function initG718() {
  gridDrag('g718', {
    cols: 15, rows: 7, grip: 'A', target: [8, -1], links: true, showTarget: true,
    polys: [[[1, 2], [6, 2], [5, 5], [3, 4]]],
    names: { A: [1, 2], B: [6, 2], C: [5, 5], D: [3, 4] },
    lab: { A: [-20, 20], B: [6, 20], C: [-6, -10], D: [-22, -6] },
    onState(v, ok) {
      $('g718Mv').textContent = moveText(v);
      const msg = $('g718Msg');
      msg.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
      msg.textContent = ok
        ? '到位！四边形 ABCD 向右平移 8 格、向下平移 1 格。图中已连出 AA′、BB′、CC′、DD′。'
        : '还没到位：对照点 A′ 的位置，数一数还要向哪里移几格。';
    },
  });
}

function initG8() {
  const outer = [[4, 8], [5, 8], [6, 7], [6, 6], [5, 5], [6, 4], [6, 3], [5, 2], [4, 2], [3, 3], [3, 4], [4, 5], [3, 6], [3, 7]];
  gridDrag('g8', {
    cols: 15, rows: 9, grip: 'A', target: [6, -1], markTarget: true, w: 520,
    polys: [outer, [[4, 6], [5, 6], [5, 7], [4, 7]], [[4, 3], [5, 3], [5, 4], [4, 4]]],
    names: { A: [6, 7] }, lab: { A: [6, -6] },
    onState(v, ok) {
      const msg = $('g8Msg');
      msg.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
      msg.textContent = ok ? '对了！向右平移 6 格、向下平移 1 格。' : `现在：${moveText(v)}。把橙色点拖到点 A′ 上。`;
    },
  });
}

/* ---------- 第 8 页：例题分步作图（图 7-19、7-20） ---------- */
const EX = { A: [1.25, 1.93], B: [0, 0], C: [0.93, 0.5], Ap: [3.33, 1.18] };
let exStep = () => {};
function initEx() {
  const V = sub(EX.Ap, EX.A);
  const Bp = add(EX.B, V);
  const Cp = add(EX.C, V);
  const s = { k: 0 };
  const b = Geo.board($('ex'), { x: [-0.6, 4.6], y: [-1.3, 2.5], w: 520 });
  const on = (k, v) => () => (s.k >= k ? v : [[-9, -9], [-9, -9]]);
  b.seg(on(2, [EX.A, EX.Ap]), { cls: 'gdash' });
  b.seg(on(3, [EX.B, add(EX.B, mul(V, 1.35))]), { cls: 'gdash' });
  b.seg(on(3, [EX.C, add(EX.C, mul(V, 1.35))]), { cls: 'gdash' });
  // 圆规截取：以 B、C 为圆心、AA′ 为半径的小弧
  const r = len(V);
  const ang0 = Math.atan2(V[1], V[0]);
  [EX.B, EX.C].forEach((P) => b.curve((t) => (s.k >= 4 ? add(P, mul([Math.cos(ang0 + t), Math.sin(ang0 + t)], r)) : [NaN, NaN]), -0.18, 0.18, { cls: 'compass' }));
  b.poly([EX.A, EX.B, EX.C], { cls: 'tri-ex' });
  b.poly(() => (s.k >= 5 ? [EX.Ap, Bp, Cp] : []), { cls: 'tri-ex new' });
  b.pt(EX.Ap, { r: 4 });
  b.pt(() => (s.k >= 4 ? Bp : null), { r: 4, cls: 'c2' });
  b.pt(() => (s.k >= 4 ? Cp : null), { r: 4, cls: 'c2' });
  b.text(EX.A, 'A', { dx: -6, dy: -10 }); b.text(EX.B, 'B', { dx: -22, dy: 8 }); b.text(EX.C, 'C', { dx: 8, dy: 10 }); b.text(EX.Ap, 'A′', { dx: 6, dy: -8 });
  b.text(() => (s.k >= 4 ? Bp : null), 'B′', { dx: -10, dy: 26 }); b.text(() => (s.k >= 4 ? Cp : null), 'C′', { dx: 8, dy: 4 });
  b.text(() => (s.k >= 3 ? add(EX.B, mul(V, 1.35)) : null), 'D', { dx: 4, dy: 20 }); b.text(() => (s.k >= 3 ? add(EX.C, mul(V, 1.35)) : null), 'E', { dx: 6, dy: 6 });
  b.update();
  return (k) => { s.k = k; b.update(); };
}

/* ---------- 静态示意图 ---------- */
function figures() {
  // 沿自身方向平移的线段
  const M = [0, 0]; const N = [2, 0.8]; const v = mul([2, 0.8], 0.75);
  const fb = Geo.board($('same'), { x: [-0.6, 4.4], y: [-0.7, 2.2], w: 420 });
  line(fb, M, N, { cls: 'gdash' });
  fb.seg([M, N], { cls: 'gs org' });
  fb.seg([add(M, v), add(N, v)], { cls: 'gs mv' });
  [[M, 'M', 0], [N, 'N', 0], [add(M, v), 'M′', 1], [add(N, v), 'N′', 1]].forEach(([p, t, k]) => { fb.pt(p, { r: 5, cls: k ? 'c2' : '' }); fb.text(p, t, { dx: -8, dy: k ? -12 : 26 }); });
  fb.update();
  // 练一练 1
  const B = [0, 0]; const D = [2.4, 0]; const F = [1.2, 1.2 * Math.sqrt(3)];
  sketch($('lx1'), { P: { B, D, F, A: lerp(B, F, 0.5), C: lerp(B, D, 0.5), E: lerp(D, F, 0.5) }, seg: 'BD DF FB AC CE EA', lab: { A: [-20, 4], E: [8, 4], C: [-4, 24] } });
  // 习题 1：方格纸，打开“完整解答”后显示答案
  const tri = [[3, 3], [7, 4], [5, 7]];
  const xs = { on: false };
  const gb = gridBoard('xt1', 16, 8, 420);
  gb.poly(tri, { cls: 'org-f' });
  gb.poly(() => (xs.on ? shift(tri, [6, -2]) : []), { cls: 'mv-f ok' });
  [['A', 0, [-18, 18]], ['B', 1, [6, 18]], ['C', 2, [-6, -8]]].forEach(([n, i, o]) => {
    gb.text(tri[i], n, { dx: o[0], dy: o[1] });
    gb.text(() => (xs.on ? add(tri[i], [6, -2]) : null), prime(n), { dx: o[0], dy: o[1], cls: 'lb mvl' });
  });
  gb.update();
  const det = document.querySelector('.xt1-show').closest('details');
  det.addEventListener('toggle', () => { xs.on = det.open; gb.update(); });
  // 习题 2：方向 A → A′
  const A = [1.55, 1.05]; const v2 = [1.72, -1.15];
  const P2 = { A, B: [0, 0], C: [2.08, 0] };
  const P2p = Object.fromEntries(Object.entries(P2).map(([k, p]) => [prime(k), add(p, v2)]));
  sketch($('xt2'), { P: { ...P2, ...P2p }, seg: 'AB BC CA A′B′ B′C′ C′A′', lab: { A: [-4, -10], 'A′': [6, -6], B: [-18, 8], 'B′': [-18, 8], C: [6, 10], 'C′': [6, 10] } });
  // 习题 3：作法中的平行线（虚线）
  const Q = { A: [0, 0], B: [2.53, 0], C: [1.95, 1.45], D: [0.58, 1.63] };
  const v3 = sub([3.15, 0.38], Q.A);
  const Qp = Object.fromEntries(Object.entries(Q).map(([k, p]) => [prime(k), add(p, v3)]));
  sketch($('xt3'), { P: { ...Q, ...Qp }, seg: 'AB BC CD DA A′B′ B′C′ C′D′ D′A′', dash: 'AA′ BB′ CC′ DD′', lab: { A: [-16, 14], 'A′': [-16, 14], B: [2, 22], 'B′': [4, 18], C: [6, -6], 'C′': [6, -6], D: [-8, -10], 'D′': [-8, -10] } });
}

window.LESSON = {
  init() {
    initS16();
    initG717();
    initG718();
    initG8();
    exStep = initEx();
    figures();
  },
  onRender(slide, step) {
    if (slide.contains($('ex'))) exStep(step);
    requestAnimationFrame(Geo.refresh);
  },
};
