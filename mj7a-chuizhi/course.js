'use strict';
/* 七上 6.5 垂直 · 本课互动：转动直线看四个角、平移三角尺画垂线、线段的垂线、垂线段最短实验、翻折说理、
 * 比较 PH/PC/CO、方格纸画垂线、三角形三条垂线。垂足、交点、长度、角度全部由坐标计算（MAngle 见 ../shared/mangle.js）。 */
const { board, fmt } = MathKit;
const { at, dir, size, mark, square } = MAngle;
const $ = (id) => document.getElementById(id);
const O0 = [0, 0];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const mul = (p, k) => [p[0] * k, p[1] * k];
const dot = (p, q) => p[0] * q[0] + p[1] * q[1];
const cross = (p, q) => p[0] * q[1] - p[1] * q[0];
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
/** 点 p 在直线 AB 上的垂足 */
const foot = (p, A, B) => { const u = sub(B, A); return add(A, mul(u, dot(sub(p, A), u) / dot(u, u))); };
/** 直线 p + t·r 与 q + u·s 的交点 */
const meet = (p, r, q, s) => { const k = cross(r, s); return Math.abs(k) < 1e-12 ? null : add(p, mul(r, cross(sub(q, p), s) / k)); };
const toWorld = (b, opt, e) => {
  const pt = b.svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  const q = pt.matrixTransform(b.svg.getScreenCTM().inverse());
  return [opt.x[0] + (q.x / b.W) * (opt.x[1] - opt.x[0]), opt.y[1] - (q.y / b.H) * (opt.y[1] - opt.y[0])];
};
const label = (b, p, t, dx, dy, cls) => b.text(p, t, { dx, dy, cls: cls || 'lb' });

/* 第 3 页：转动直线 b（图 6-38） */
function initRot() {
  const s = { t: 64 };
  const L = 3.2;
  const b = board($('rot'), { x: [-4, 4], y: [-3.4, 3.4], axes: false, grid: false, w: 480 });
  b.seg([[-L, 0], [L, 0]], { cls: 'ray' });
  b.seg(() => [at(O0, s.t, L), at(O0, s.t + 180, L)], { cls: 'ray hl' });
  label(b, [L, 0], 'a', 4, -8); label(b, () => at(O0, s.t, L), 'b', 6, 0);
  label(b, [-2.2, 0], 'A', -6, 22); label(b, [2.2, 0], 'B', -6, 22);
  label(b, () => at(O0, s.t, 2.2), 'C', 10, 0); label(b, () => at(O0, s.t + 180, 2.2), 'D', 10, 6);
  const ANG = () => [[0, s.t], [s.t, 180], [180, s.t + 180], [s.t + 180, 360]];
  [0, 1, 2, 3].forEach((i) => {
    mark(b, O0, () => at(O0, ANG()[i][0], 1), () => at(O0, ANG()[i][1], 1), 0.5 + (i % 2) * 0.15, { cls: `amark ${i % 2 ? 'b' : ''}` });
    b.text(() => at(O0, (ANG()[i][0] + ANG()[i][1]) / 2, 1.05), String(i + 1), { cls: `deg ${i % 2 ? 'b' : ''}`, dy: 6 });
  });
  square(b, O0, 0, () => (s.t === 90 ? 0.3 : 0));
  b.pt(O0, { r: 4 });
  label(b, O0, 'O', 8, 22);
  b.drag(() => at(O0, s.t, L * 0.8), (x, y) => {
    let d = dir(O0, [x, y]);
    if (d > 180) d -= 180;
    const r = clamp(Math.round(d), 20, 160);
    s.t = Math.abs(r - 90) <= 3 ? 90 : r;
  });
  b.onUpdate = () => {
    const v = [s.t, 180 - s.t, s.t, 180 - s.t];
    v.forEach((x, i) => { $(`r${i + 1}`).textContent = `${x}°`; });
  };
  b.update();
}

/* 第 4 页：平移三角尺画垂线（图 6-39、6-40） */
function initDraw() {
  const PTS = { P: [1.4, 2.4], Q: [-1.2, 0] };
  const LEG_A = 2.2;
  const LEG_B = 3.4;
  const s = { k: 'P', x: 3.2, lines: [] };
  const b = board($('draw'), { x: [-4.6, 5], y: [-0.9, 3.9], axes: false, grid: false, w: 560 });
  b.seg([[-4.6, 0], [5, 0]], { cls: 'line' });
  label(b, [4.8, 0], 'a', -4, 22);
  [0, 1, 2].forEach((i) => b.seg(() => (s.lines[i] === undefined ? [O0, O0] : [[s.lines[i], -0.8], [s.lines[i], 3.8]]), { cls: 'drawn' }));
  b.poly(() => [[s.x, 0], [s.x - LEG_A, 0], [s.x, LEG_B]], { cls: 'setsq' });
  b.seg(() => [[s.x, 0], [s.x, LEG_B]], { cls: 'ray hl' });
  square(b, () => [s.x, 0], 90, 0.25);
  Object.entries(PTS).forEach(([k, p]) => { b.pt(p, { r: 5 }); label(b, p, k, 6, k === 'Q' ? 22 : -8); });
  b.drag(() => [s.x - LEG_A / 3, LEG_B / 3], (x) => {
    const nx = clamp(x + LEG_A / 3, -2, 4.8);
    s.x = Math.abs(nx - PTS[s.k][0]) < 0.15 ? PTS[s.k][0] : nx;
  });
  b.onUpdate = () => {
    const ok = s.x === PTS[s.k][0];
    $('drawMsg').className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    $('drawMsg').textContent = ok ? `直角边经过点 ${s.k}：点“画线”，画出的直线 b ⊥ a。` : `拖三角尺上的橙色点沿 a 移动，让竖直的直角边经过点 ${s.k}。`;
  };
  $('drawBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.k) {
      s.k = btn.dataset.k;
      $('drawBtns').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === btn));
    }
    if (btn.id === 'drawGo') {
      s.lines = [...s.lines.filter((v) => Math.abs(v - s.x) > 0.05), s.x].slice(-3);
      const ok = s.x === PTS[s.k][0];
      b.update();
      $('drawMsg').textContent = ok ? `画好了：过点 ${s.k} 的垂线只有这一条。` : `这条线也垂直于 a，但不经过点 ${s.k}。`;
      return;
    }
    b.update();
  });
  b.update();
}

/* 第 5 页：线段的垂线（图 6-41） */
function initSeg() {
  const B = [0, 0];
  const C = [2.6, 0];
  const s = { A: [-1.4, 2.2], D: [3.9, 3.0] };
  const b = board($('seg'), { x: [-3.2, 5.8], y: [-0.9, 3.7], axes: false, grid: false, w: 560 });
  b.seg(() => [s.A, B], { cls: 'ray' }); b.seg([B, C], { cls: 'ray' }); b.seg(() => [C, s.D], { cls: 'ray' }); b.seg(() => [s.D, s.A], { cls: 'ray' });
  const E = () => [s.A[0], 0];
  const F = () => [s.D[0], 0];
  b.seg(() => [[Math.min(E()[0], 0), 0], [Math.max(F()[0], 2.6), 0]], { cls: 'dash' });
  b.seg(() => [s.A, E()], { cls: 'ray hl' });
  b.seg(() => [s.D, F()], { cls: 'ray hl' });
  square(b, E, 0, 0.22);
  square(b, F, 90, 0.22);
  label(b, () => s.A, 'A', -20, -4); label(b, () => s.D, 'D', 6, -6);
  label(b, B, 'B', -4, 22); label(b, C, 'C', -4, 22);
  label(b, E, 'E', -20, 22); label(b, F, 'F', 4, 22);
  b.drag(() => s.A, (x, y) => { s.A = [clamp(x, -2.9, 2.4), clamp(y, 0.8, 3.4)]; });
  b.drag(() => s.D, (x, y) => { s.D = [clamp(x, 0.4, 5.5), clamp(y, 0.8, 3.4)]; });
  const where = (x) => (x < 0 || x > 2.6 ? `在 ${x < 0 ? 'CB' : 'BC'} 的延长线上` : '在线段 BC 上');
  b.onUpdate = () => { $('segMsg').textContent = `垂足 E ${where(E()[0])}；垂足 F ${where(F()[0])}。`; };
  b.update();
}

/* 第 6 页：跳远示意（图 6-42） */
function initJump() {
  const b = board($('jump'), { x: [-1.4, 5.2], y: [-0.4, 2.8], axes: false, grid: false, w: 480 });
  b.poly([[0, -0.3], [5, -0.3], [5, 2.7], [0, 2.7]], { cls: 'sand' });
  b.seg([[0, -0.3], [0, 2.7]], { cls: 'line' });
  label(b, [0, 2.7], 'l', -16, 10);
  const P = [3.2, 1.4];
  const O = [0, 1.4];
  const S = [0, 0.2];
  b.seg([P, S], { cls: 'slant' });
  b.seg([P, O], { cls: 'ray b' });
  square(b, O, 0, 0.18);
  b.poly([[3.2, 1.3], [3.55, 1.3], [3.55, 1.5], [3.2, 1.5]], { cls: 'foot' });
  b.pt(P, { r: 4 });
  label(b, P, 'P', 4, -10);
  label(b, O, 'O', -18, -6);
  b.text([1.6, 1.4], `垂线段 ${fmt(dist(P, O), 2)}`, { cls: 'deg b', dy: -8 });
  b.text([1.3, 0.55], `斜着量 ${fmt(dist(P, S), 2)}`, { cls: 'deg', dy: 18 });
  b.update();
}

/* 第 7 页：垂线段最短 */
function initShort() {
  const P = [0, 2.2];
  const s = { x: 2.6, rows: [] };
  const opt = { x: [-5, 5], y: [-0.7, 2.9], axes: false, grid: false, w: 600 };
  const b = board($('short'), opt);
  b.seg([[-5, 0], [5, 0]], { cls: 'line' });
  label(b, [4.8, 0], 'l', -2, -8);
  b.seg([P, O0], { cls: 'ray b' });
  square(b, O0, 0, 0.2);
  b.seg(() => [P, [s.x, 0]], { cls: 'ray hl' });
  b.pt(P, { r: 5 });
  label(b, P, 'P', 8, -6);
  label(b, O0, 'O', -18, 22);
  label(b, () => [s.x, 0], 'Oₖ', 6, 22);
  b.text(() => [s.x / 2 + 0.2, 1.1 + 0.02], () => fmt(dist(P, [s.x, 0]), 2), { cls: 'deg' });
  b.drag(() => [s.x, 0], (x) => { s.x = clamp(Math.round(x * 10) / 10, -4.8, 4.8); });
  const pl = board($('shortPlot'), { x: [-5, 5], y: [-1.2, 6], axes: true, ticks: [1, 2], w: 600, h: 230, labels: ['', 'POₖ 的长'] });
  pl.fn((x) => Math.hypot(x, 2.2), { cls: 'c2' });
  pl.pt([0, 2.2], { r: 5, cls: 'c2' });
  pl.pt(() => [s.x, dist(P, [s.x, 0])], { r: 5 });
  b.onUpdate = () => {
    const len = dist(P, [s.x, 0]);
    const msg = $('shortMsg');
    msg.className = `tip feedback ${s.x === 0 ? 'fb-ok' : ''}`;
    msg.textContent = s.x === 0 ? `Oₖ 与垂足 O 重合：PO = ${fmt(len, 2)}，最短。` : `POₖ = ${fmt(len, 2)} > PO = 2.2（离垂足越远越长）`;
    pl.update();
  };
  const render = () => {
    const head = $('shortTab').rows[0].outerHTML;
    $('shortTab').innerHTML = head + s.rows.map((r, i) => `<tr><td>${r.x === 0 ? 'O' : `O<sub>${i + 1}</sub>`}</td><td>${fmt(Math.abs(r.x), 1)}</td><td>${fmt(r.len, 2)}</td></tr>`).join('');
    MathKit.tex($('shortTab'));
  };
  $('shortRec').addEventListener('click', () => { s.rows = [...s.rows, { x: s.x, len: dist(P, [s.x, 0]) }].slice(-4); render(); });
  $('shortClr').addEventListener('click', () => { s.rows = []; render(); });
  b.update();
}

/* 第 8 页：翻折说理（p172 阅读） */
function initFold() {
  const P = [0, 1.8];
  const O1 = [-2.2, 0];
  const O2 = [1.6, 0];
  const s = { t: 0 };
  const b = board($('fold'), { x: [-3.4, 3.4], y: [-2.3, 2.5], axes: false, ticks: 0.6, w: 480 });
  const P2 = () => [0, 1.8 * Math.cos(Math.PI * s.t)];
  const done = () => s.t > 0.999;
  b.seg([[-3.4, 0], [3.4, 0]], { cls: 'line' });
  label(b, [3.3, 0], 'l', -4, -8);
  b.seg([P, O0], { cls: 'ray b' });
  b.seg([P, O1], { cls: 'ray' });
  b.seg([P, O2], { cls: 'ray' });
  b.seg(() => (s.t > 0 ? [P2(), O1] : [O0, O0]), { cls: 'ray hl' });
  b.seg(() => (s.t > 0 ? [P2(), O2] : [O0, O0]), { cls: 'ray hl' });
  b.seg(() => (done() ? [O0, P2()] : [O0, O0]), { cls: 'ray b' });
  square(b, O0, 0, 0.2);
  b.pt(P, { r: 4 });
  b.pt(() => (s.t > 0 ? P2() : null), { r: 4, cls: 'c2' });
  label(b, P, 'P', 8, -4);
  label(b, () => (s.t > 0 ? P2() : null), "P′", 8, 16);
  label(b, O0, 'O', 6, 22); label(b, O1, 'O₁', -12, 22); label(b, O2, 'O₂', -4, 22);
  let raf = 0;
  const animate = (to) => {
    cancelAnimationFrame(raf);
    const from = s.t;
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 900);
      s.t = from + (to - from) * k;
      b.update();
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  $('foldGo').addEventListener('click', () => animate(1));
  $('foldBack').addEventListener('click', () => animate(0));
  b.update();
}

/* 第 9 页：图 6-45 */
function initCmp() {
  const s = { th: 40, r: 2.8 };
  const b = board($('cmp'), { x: [-0.5, 6.3], y: [-0.7, 3.7], axes: false, grid: false, w: 520 });
  const rad = () => (s.th * Math.PI) / 180;
  const P = () => at(O0, s.th, s.r);
  const H = () => [P()[0], 0];
  const C = () => [s.r / Math.cos(rad()), 0];
  b.seg([O0, [6.1, 0]], { cls: 'ray' });
  b.seg(() => [O0, at(O0, s.th, 4.6)], { cls: 'ray' });
  b.seg(() => [P(), H()], { cls: 'ray b' });
  b.seg(() => [P(), C()], { cls: 'ray hl' });
  square(b, H, 90, 0.18);
  square(b, P, () => s.th + 180, 0.18);
  mark(b, O0, [1, 0], () => at(O0, s.th, 1), 0.45);
  label(b, [6.1, 0], 'A', -4, 22); label(b, () => at(O0, s.th, 4.6), 'B', 6, 0);
  label(b, O0, 'O', -18, 18); label(b, P, 'P', -18, -6); label(b, H, 'H', -6, 22); label(b, C, 'C', -2, 22);
  const fitR = (r) => clamp(r, 1.2, Math.min(4.2, 5.9 * Math.cos(rad())));
  b.drag(P, (x, y) => { s.r = fitR(dot([x, y], at(O0, s.th, 1))); });
  b.drag(() => at(O0, s.th, 4.3), (x, y) => { s.th = clamp(Math.round(dir(O0, [x, y])), 20, 60); s.r = fitR(s.r); });
  b.onUpdate = () => {
    $('pH').textContent = fmt(dist(P(), H()), 2);
    $('pC').textContent = fmt(dist(P(), C()), 2);
    $('cO').textContent = fmt(dist(C(), O0), 2);
  };
  b.update();
}

/* 第 10 页：练一练 1、2 */
function initPractice() {
  const b = board($('pipe'), { x: [-0.4, 5.6], y: [-0.4, 3.3], axes: false, grid: false, w: 420 });
  const Pp = [0.3, 0.2];
  const u = at(O0, 28, 1);
  const Qp = add(Pp, mul(u, 5));
  const n = [-u[1], u[0]];
  b.poly([add(Pp, mul(n, -0.25)), add(Qp, mul(n, -0.25)), add(Qp, mul(n, 0.25)), add(Pp, mul(n, 0.25))], { cls: 'ditch' });
  const A = [1.4, 2.9];
  const M = foot(A, Pp, Qp);
  [1.2, 4.2].forEach((t) => b.seg([A, add(Pp, mul(u, t))], { cls: 'dash' }));
  b.seg([A, M], { cls: 'ray b' });
  square(b, M, 28, 0.18);
  b.pt(A, { r: 4 });
  label(b, A, 'A', -18, -2); label(b, Pp, 'P', -16, 6); label(b, Qp, 'Q', -4, -10); label(b, M, 'M', 6, 18);
  b.text(add(mul(add(A, M), 0.5), [0.35, 0]), fmt(dist(A, M), 2), { cls: 'deg b' });
  b.update();

  const d2 = board($('dist'), { x: [-0.5, 4.9], y: [-0.5, 2.7], axes: false, grid: false, w: 420 });
  const B = [0, 0];
  const Cc = [4.4, 0];
  const Aa = [1.2, 1.2];
  const D = foot(Cc, B, Aa);
  const s = { open: false };
  d2.poly([Aa, B, Cc], { cls: 'tri' });
  d2.seg(() => (s.open ? [Aa, D] : [O0, O0]), { cls: 'dash' });
  d2.seg(() => (s.open ? [Cc, D] : [O0, O0]), { cls: 'ray b' });
  square(d2, () => (s.open ? D : O0), 225, () => (s.open ? 0.18 : 0));
  label(d2, Aa, 'A', -8, -10); label(d2, B, 'B', -18, 18); label(d2, Cc, 'C', 4, 18);
  label(d2, () => (s.open ? D : null), 'D', -6, -10);
  d2.update();
  $('distAns').addEventListener('toggle', () => { s.open = $('distAns').open; d2.update(); });
}

/* 第 11 页：方格纸画垂线（习题 4） */
function initGrid() {
  const opt = { x: [0, 15], y: [0, 7], axes: false, ticks: 1, w: 560 };
  const g = board($('g4'), opt);
  const T = { A: [3, 6], B: [1, 3], C: [4, 1], P: [7, 5], Q: [9, 1] };
  const s = { q: null };
  g.seg([T.A, T.B], { cls: 'segk' }); g.seg([T.B, T.C], { cls: 'segk' }); g.seg([T.P, T.Q], { cls: 'segk' });
  square(g, T.B, dir(T.B, T.C), 0.35);
  g.seg(() => { if (!s.q) return [O0, O0]; const v = sub(s.q, T.P); const k = 20 / Math.hypot(...v); return [add(T.P, mul(v, -k)), add(T.P, mul(v, k))]; }, { cls: 'drawn' });
  [['A', 4, -6], ['B', -18, 6], ['C', 4, 20], ['P', -18, -6], ['Q', 4, 20]].forEach(([k, dx, dy]) => label(g, T[k], k, dx, dy, 'lb sm'));
  g.svg.addEventListener('pointerdown', (e) => {
    const q = toWorld(g, opt, e).map(Math.round);
    const v = sub(q, T.P);
    if (!v[0] && !v[1]) return;
    s.q = q;
    const w = sub(T.Q, T.P);
    const ang = size(T.P, add(T.P, v), add(T.P, w));
    const ok = dot(v, w) === 0;
    const msg = $('g4Msg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = ok
      ? `✓ 从 P 向${v[0] >= 0 ? '右' : '左'} ${Math.abs(v[0])}、向${v[1] >= 0 ? '上' : '下'} ${Math.abs(v[1])}：与 PQ 的夹角 90°，垂直。`
      : `与 PQ 的夹角约 ${fmt(ang, 1)}°，不垂直。PQ 的走法是右 2、下 4，试试“交换并反向”。`;
    g.update();
  });
  g.update();
}

/* 第 12 页：三角形三条垂线（习题 2） */
function initAlt() {
  const s = { A: [2.1, 3.6], B: [0, 0], C: [4.4, 0] };
  const b = board($('alt'), { x: [-0.6, 5.2], y: [-0.6, 4.2], axes: false, grid: false, w: 480 });
  const D = () => foot(s.A, s.B, s.C);
  const E = () => foot(s.B, s.A, s.C);
  const H = () => meet(s.A, sub(D(), s.A), s.B, sub(E(), s.B));
  const F = () => meet(s.C, sub(H(), s.C), s.A, sub(s.B, s.A));
  b.poly(() => [s.A, s.B, s.C], { cls: 'tri' });
  b.seg(() => [s.A, D()], { cls: 'ray b' });
  b.seg(() => [s.B, E()], { cls: 'ray g' });
  b.seg(() => [s.C, F()], { cls: 'ray hl' });
  square(b, D, () => dir(s.B, s.C), 0.18);
  square(b, E, () => dir(s.C, s.A), 0.18);
  square(b, F, () => dir(s.A, s.B), 0.18);
  b.pt(H, { r: 4, cls: 'c2' });
  label(b, () => s.A, 'A', -6, -12); label(b, () => s.B, 'B', -18, 16); label(b, () => s.C, 'C', 6, 16);
  label(b, D, 'D', -4, 22); label(b, E, 'E', 8, 0); label(b, F, 'F', -20, 0); label(b, H, 'H', 8, 4);
  const acute = (A, B, C) => [[A, B, C], [B, C, A], [C, A, B]].every(([p, q, r]) => size(p, q, r) < 85);
  ['A', 'B', 'C'].forEach((k) => b.drag(() => s[k], (x, y) => {
    const p = [clamp(x, -0.4, 5), clamp(y, -0.4, 4)];
    const t = { ...s, [k]: p };
    if (acute(t.A, t.B, t.C) && cross(sub(t.B, t.A), sub(t.C, t.A)) > 3) s[k] = p; // 保持逆时针，直角记号朝内
  }, { r: 7, hit: 18 }));
  b.onUpdate = () => { $('altMsg').textContent = `量一量：∠CFB = ${fmt(size(F(), s.C, s.B), 1)}°`; };
  b.update();
}

window.LESSON = {
  init() {
    initRot();
    initDraw();
    initSeg();
    initJump();
    initShort();
    initFold();
    initCmp();
    initPractice();
    initGrid();
    initAlt();
  },
};
