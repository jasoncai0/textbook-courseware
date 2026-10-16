'use strict';
/* 八上 5.2 平面直角坐标系 · 本课互动：马路变数轴、拖点读坐标（或输入坐标描点）、象限符号、
 * 例题逐步描点、翻折与平移的坐标、连点成图、平移滑块、图形运动（平移 / 翻折 / 旋转）、三种建系方式。
 * 通用部分见 ../shared/math.js、mgeo.js、mcheck.js。所有点按坐标精确绘制，作图板横纵同比例。 */
const { fmt, tex } = MathKit;
const { add, mul, lerp, right } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const HIDE = [999, 999];
const AX = { x: [-5.6, 5.6], y: [-4.8, 5.4], ticks: 1, w: 520, axes: true, grid: true };
/** 数字显示：负号用“−” */
const num = (v) => fmt(v).replace('-', '−');
const xy = (p) => `(${num(p[0])}, ${num(p[1])})`;

/* 翻页时按步数刷新的画板 */
const stepHooks = [];
const onStep = (el, fn) => stepHooks.push({ el, fn });

/** 在坐标系中画一个点：圆点、名字、到两轴的垂线（可选） */
function plotPoint(b, P, name, o = {}) {
  const on = o.show || (() => true);
  if (o.perp !== false) {
    b.seg(() => (on() ? [P(), [P()[0], 0]] : [HIDE, HIDE]), { cls: 'gdash' });
    b.seg(() => (on() ? [P(), [0, P()[1]]] : [HIDE, HIDE]), { cls: 'gdash' });
  }
  b.pt(() => (on() ? P() : null), { cls: o.cls || 'c1' });
  b.text(() => (on() ? P() : null), name, { cls: 'lb', dx: o.dx ?? 6, dy: o.dy ?? -8 });
}

/** 简单动画：from → to，逐帧回调 */
function animate(from, to, cb, dur = 800) {
  const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    const e = 1 - (1 - p) ** 3;
    cb(p === 1 ? to : from + (to - from) * e);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- 第 3 页：马路 → 数轴（图 5-3） ---------- */
function initRoad() {
  const F = [-50, 30];
  const host = $('road');
  const b = Geo.board(host, { x: [-72, 42], y: [-32, 52], ticks: 10, w: 520, axes: true, grid: true });
  b.seg([[-72, 0], [42, 0]], { cls: 'road' });
  b.seg([[0, -32], [0, 52]], { cls: 'road' });
  b.seg([F, [F[0], 0]], { cls: 'gdash' });
  b.seg([F, [0, F[1]]], { cls: 'gdash' });
  b.pt(F, { cls: 'c2', r: 7 });
  b.text(F, '音乐喷泉', { cls: 'lb up note-l', dx: -20, dy: -12 });
  b.text([-60, 0], '北京西路', { cls: 'lb up road-n', dx: -10, dy: -8 });
  b.text([22, 0], '北京东路', { cls: 'lb up road-n', dx: -10, dy: -8 });
  b.text([0, 44], '中山北路', { cls: 'lb up road-n', dx: 6, dy: 0 });
  b.text([0, -24], '中山南路', { cls: 'lb up road-n', dx: 6, dy: 0 });
  b.text(() => (host.classList.contains('ax-on') ? F : null), '(−50, 30)', { cls: 'lb up coord', dx: -26, dy: 26 });
  $('roadAx').addEventListener('click', () => { host.classList.toggle('ax-on'); b.update(); });
  b.update();
}

/* ---------- 第 4 页：拖点读坐标 / 输入坐标描点 ---------- */
function initCoordP() {
  const s = { P: [2, 3] };
  const b = Geo.board($('coordP'), AX);
  plotPoint(b, () => s.P, 'P', { cls: 'c2' });
  right(b, () => [s.P[0], 0], [0, 0], () => s.P, { s: 0.25 });
  right(b, () => [0, s.P[1]], [0, 0], () => s.P, { s: 0.25 });
  b.text(() => [s.P[0], 0], () => num(s.P[0]), { cls: 'lb up coord', dx: -6, dy: s.P[1] >= 0 ? 34 : -28 });
  b.text(() => [0, s.P[1]], () => num(s.P[1]), { cls: 'lb up coord', dx: s.P[0] >= 0 ? -40 : 10, dy: 6 });
  b.drag(() => s.P, (x, y) => { s.P = [clamp(Math.round(x), -5, 5), clamp(Math.round(y), -4, 5)]; });
  b.onUpdate = () => {
    const msg = $('cpMsg');
    msg.className = 'tip feedback fb-ok';
    msg.textContent = `P${xy(s.P)}：横坐标 ${num(s.P[0])}，纵坐标 ${num(s.P[1])}。`;
  };
  const parse = (v) => +String(v).trim().replace(/[−－]/g, '-');
  $('inGo').addEventListener('click', () => {
    const a = parse($('inA').value);
    const c = parse($('inB').value);
    const msg = $('cpMsg');
    if (!Number.isFinite(a) || !Number.isFinite(c) || a < -5.5 || a > 5.5 || c < -4.5 || c > 5.2) {
      msg.className = 'tip feedback fb-warn';
      msg.textContent = '请输入两个数：横坐标在 −5.5～5.5 之间，纵坐标在 −4.5～5.2 之间。';
      return;
    }
    s.P = [a, c];
    b.update();
  });
  b.update();
}

/* ---------- 第 5、6 页：例 1、例 2 逐步描点 ---------- */
function initExamples() {
  const s1 = { k: 0 };
  const b1 = Geo.board($('ex1'), AX);
  const P1 = [['A', [4, 1], 1], ['B', [-1, 4], 2], ['C', [-4, -2], 3], ['D', [3, -2], 4], ['E', [0, 1], 5], ['F', [-4, 0], 5]];
  P1.forEach(([n, p, k]) => plotPoint(b1, () => p, n, { show: () => s1.k >= k, perp: p[0] !== 0 && p[1] !== 0, dx: n === 'E' ? 6 : 6, dy: n === 'F' ? -10 : -8 }));
  onStep($('ex1'), (st) => { s1.k = st; b1.update(); });
  const s2 = { k: 0 };
  const b2 = Geo.board($('ex2'), AX);
  const P2 = [['A', [-4, 3], 2], ['B', [-3, -2], 4], ['C', [1, -3], 6]];
  P2.forEach(([n, p]) => b2.pt(p, { cls: 'c2' }));
  P2.forEach(([n, p, k]) => {
    b2.seg(() => (s2.k >= k ? [p, [p[0], 0]] : [HIDE, HIDE]), { cls: 'gdash' });
    b2.seg(() => (s2.k >= k ? [p, [0, p[1]]] : [HIDE, HIDE]), { cls: 'gdash' });
    b2.text(p, n, { cls: 'lb', dx: 6, dy: -8 });
  });
  onStep($('ex2'), (st) => { s2.k = st; b2.update(); });
  b1.update();
  b2.update();
}

/* ---------- 第 7 页：象限 ---------- */
function initQuad() {
  const s = { P: [3, 2] };
  const b = Geo.board($('quad'), AX);
  const BIG = 9;
  const Q = [
    [[0, 0], [BIG, 0], [BIG, BIG], [0, BIG]], [[0, 0], [0, BIG], [-BIG, BIG], [-BIG, 0]],
    [[0, 0], [-BIG, 0], [-BIG, -BIG], [0, -BIG]], [[0, 0], [0, -BIG], [BIG, -BIG], [BIG, 0]],
  ].map((pts) => b.poly(pts, { cls: 'qd' }));
  [['第一象限', [2.2, 4.4]], ['第二象限', [-4.2, 4.4]], ['第三象限', [-4.2, -3.9]], ['第四象限', [2.2, -3.9]]].forEach(([t, p]) => b.text(p, t, { cls: 'lb up qn' }));
  plotPoint(b, () => s.P, 'P', { cls: 'c2' });
  b.drag(() => s.P, (x, y) => { s.P = [clamp(Math.round(x), -5, 5), clamp(Math.round(y), -4, 5)]; });
  const sg = (v) => (v > 0 ? '正' : '负');
  b.onUpdate = () => {
    const [x, y] = s.P;
    const q = x > 0 && y > 0 ? 0 : x < 0 && y > 0 ? 1 : x < 0 && y < 0 ? 2 : x > 0 && y < 0 ? 3 : -1;
    Q.forEach((p, i) => p.classList.toggle('on', i === q));
    const msg = $('qMsg');
    msg.className = `tip feedback ${q < 0 ? 'fb-warn' : 'fb-ok'}`;
    if (q >= 0) { msg.textContent = `P${xy(s.P)} 在第${'一二三四'[q]}象限：横坐标为${sg(x)}，纵坐标为${sg(y)}。`; return; }
    msg.textContent = x === 0 && y === 0 ? 'P 是原点 (0, 0)，不属于任何象限。'
      : y === 0 ? `P${xy(s.P)} 在 x 轴上：纵坐标为 0，不属于任何象限。` : `P${xy(s.P)} 在 y 轴上：横坐标为 0，不属于任何象限。`;
  };
  b.update();
}

/* ---------- 第 8 页：练习（p122） ---------- */
function initPractice() {
  const s = { show: false };
  const b = Geo.board($('pr1'), { ...AX, y: [-4.8, 5.8] });
  [['A', [4, 5]], ['B', [-5, -3]], ['C', [3, -4]]].forEach(([n, p]) => plotPoint(b, () => p, n, { perp: false }));
  [[2, 4], [-2.5, 3], [-3, -2], [1.5, -3.5]].forEach((p) => {
    plotPoint(b, () => p, `(${num(p[0])}, ${num(p[1])})`, { show: () => s.show, cls: 'c2', dx: -20, dy: -10 });
  });
  $('pr2Show').addEventListener('click', () => { s.show = !s.show; b.update(); });
  b.update();
}

/* ---------- 第 9 页：例 3 与讨论：沿 y 轴翻折、向下平移 3 ---------- */
function initTri() {
  const T = { A: [3, 5], B: [1, 0], C: [5, 0] };
  const s = { t: 0, d: 0 };
  const b = Geo.board($('tri'), { x: [-5.8, 5.8], y: [-3.8, 5.8], ticks: 1, w: 520, axes: true, grid: true });
  const cur = (p) => [p[0] * Math.cos(Math.PI * s.t), p[1] - s.d];
  const mark = () => (s.d > 2.999 ? '″' : s.t > 0.999 ? '′' : '');
  b.poly([T.A, T.B, T.C], { cls: 'tri-o' });
  b.poly(() => [cur(T.A), cur(T.B), cur(T.C)], { cls: 'tri-m' });
  ['A', 'B', 'C'].forEach((k) => b.text(() => cur(T[k]), () => k + mark(), { cls: 'lb', dx: k === 'A' ? 6 : -6, dy: k === 'A' ? -8 : 20 }));
  ['A', 'B', 'C'].forEach((k) => b.text(() => (s.t > 0.01 ? T[k] : null), k, { cls: 'lb ghost', dx: 6, dy: k === 'A' ? -8 : 20 }));
  const ROWS = [
    ['△ABC', (p) => p, () => true],
    ["△A′B′C′", (p) => [-p[0], p[1]], () => s.t > 0.999],
    ['△A″B″C″', (p) => [-p[0], p[1] - 3], () => s.d > 2.999],
  ];
  b.onUpdate = () => {
    $('trTab').innerHTML = `<tr><th></th><th>顶角顶点</th><th>底边端点</th><th>底边端点</th></tr>${ROWS.map(([n, f, on]) => `<tr><td>${n}</td>${['A', 'B', 'C'].map((k) => `<td>${on() ? xy(f(T[k])) : '?'}</td>`).join('')}</tr>`).join('')}`;
  };
  $('trFold').addEventListener('click', () => animate(s.t, 1, (v) => { s.t = v; b.update(); }));
  $('trDown').addEventListener('click', () => {
    if (s.t < 0.999) { animate(s.t, 1, (v) => { s.t = v; b.update(); if (v === 1) animate(0, 3, (w) => { s.d = w; b.update(); }); }); return; }
    animate(s.d, 3, (v) => { s.d = v; b.update(); });
  });
  $('trReset').addEventListener('click', () => { s.t = 0; s.d = 0; b.update(); });
  b.update();
}

/* ---------- 第 10 页：数学实验室 1（依次连点） ---------- */
const LAB = [[0.5, 4], [0, 0], [1, 3], [2, 3], [3, 2], [3, 0], [1, -1], [2, -1], [1, -3], [0, -1], [-1, -3], [-2, -1], [-1, -1], [-3, 0], [-3, 2], [-2, 3], [-1, 3], [0, 0], [-0.5, 4]];
function initLab() {
  const s = { k: 1 };
  const b = Geo.board($('lab'), { x: [-4.6, 4.6], y: [-4, 4.8], ticks: 1, w: 480, axes: true, grid: true });
  LAB.forEach((p) => b.pt(p, { cls: 'dot', r: 3.5 }));
  LAB.slice(1).forEach((p, i) => b.seg(() => (s.k > i + 1 ? [LAB[i], p] : [HIDE, HIDE]), { cls: 'labl' }));
  b.pt(() => LAB[s.k - 1], { cls: 'c2', r: 6 });
  b.text(() => LAB[s.k - 1], () => xy(LAB[s.k - 1]), { cls: 'lb up coord', dx: 8, dy: -8 });
  [[1, -3], [1, 3], [-1, -3], [-1, 3]].forEach((p) => b.pt(p, { cls: 'ring', r: 7 }));
  $('labNext').addEventListener('click', () => { s.k = Math.min(LAB.length, s.k + 1); b.update(); });
  $('labAll').addEventListener('click', () => { s.k = LAB.length; b.update(); });
  $('labClr').addEventListener('click', () => { s.k = 1; b.update(); });
  b.update();
}

/* ---------- 第 11 页：平移线段 AB（图 5-11） ---------- */
function initShift() {
  const A = [-4, 1];
  const B = [-2, 3];
  const C = lerp(A, B, 0.5);
  const s = { dx: 0, dy: 0 };
  const sh = (p) => () => [p[0] + s.dx, p[1] + s.dy];
  const moved = () => s.dx !== 0 || s.dy !== 0;
  const b = Geo.board($('shift'), { x: [-5.6, 6.6], y: [-3.8, 5.8], ticks: 1, w: 520, axes: true, grid: true });
  b.seg([A, B], { cls: 'seg-o' });
  b.seg(() => (moved() ? [sh(A)(), sh(B)()] : [HIDE, HIDE]), { cls: 'seg-m' });
  b.seg(() => (moved() ? [A, sh(A)()] : [HIDE, HIDE]), { cls: 'gdash' });
  b.seg(() => (moved() ? [B, sh(B)()] : [HIDE, HIDE]), { cls: 'gdash' });
  b.pt(C, { cls: 'c1', r: 4 });
  b.pt(() => (moved() ? sh(C)() : null), { cls: 'c2', r: 4 });
  b.text(A, 'A', { cls: 'lb', dx: -18, dy: 6 });
  b.text(B, 'B', { cls: 'lb', dx: 4, dy: -8 });
  b.text(C, 'C', { cls: 'lb', dx: 6, dy: 14 });
  b.text(() => (moved() ? sh(A)() : null), "A'", { cls: 'lb ghost', dx: 6, dy: 14 });
  b.text(() => (moved() ? sh(B)() : null), "B'", { cls: 'lb ghost', dx: 6, dy: -8 });
  b.text(() => (moved() ? sh(C)() : null), "C'", { cls: 'lb ghost', dx: 6, dy: 14 });
  b.onUpdate = () => {
    $('shXV').textContent = s.dx;
    $('shYV').textContent = s.dy;
    const msg = $('shMsg');
    msg.className = `tip feedback ${s.dx === 7 && s.dy === 2 ? 'fb-ok' : ''}`;
    msg.textContent = `A${xy(A)} → A′${xy(sh(A)())}，B${xy(B)} → B′${xy(sh(B)())}：横坐标${s.dx >= 0 ? '加' : '减'} ${Math.abs(s.dx)}，纵坐标${s.dy >= 0 ? '加' : '减'} ${Math.abs(s.dy)}。`;
  };
  MathKit.slider($('shX'), (v) => { s.dx = v; b.update(); });
  MathKit.slider($('shY'), (v) => { s.dy = v; b.update(); });
}

/* ---------- 第 12 页：图①→②③④（p125 练习，点位照课本） ---------- */
const FIG = { O: [0, 0], A: [2, 3], B: [3, 0], M: [1, 1.5], N: [2.5, 1.5] };
const MOVES = [
  { t: '图①', f: (p) => p, msg: '图①：O(0, 0)，A(2, 3)，B(3, 0)；M、N 分别是 OA、AB 的中点。' },
  { t: '图②', f: (p, u) => [p[0] + 2 * u, p[1]], msg: '图①向右平移 2 个单位长度得到图②：横坐标都加 2，纵坐标不变。' },
  { t: '图③', f: (p, u) => [p[0], p[1] * Math.cos(Math.PI * u)], msg: '图①沿 x 轴翻折得到图③：横坐标不变，纵坐标变为相反数。' },
  { t: '图④', f: (p, u) => { const a = (-Math.PI / 2) * u; return [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)]; }, msg: '图①绕点 O 顺时针旋转 90° 得到图④。' },
];
function initMoves() {
  const s = { k: 0, u: 0 };
  const b = Geo.board($('moves'), { x: [-0.9, 5.7], y: [-3.6, 3.6], ticks: 1, w: 480, axes: true, grid: true });
  const P = (n) => () => MOVES[s.k].f(FIG[n], s.u);
  b.poly([FIG.O, FIG.A, FIG.B], { cls: 'tri-o' });
  b.seg([FIG.M, FIG.N], { cls: 'seg-o' });
  b.poly(() => [P('O')(), P('A')(), P('B')()], { cls: 'tri-m' });
  b.seg(() => [P('M')(), P('N')()], { cls: 'seg-m' });
  const prime = () => (s.k > 0 && s.u > 0.999 ? '′' : '');
  ['A', 'B', 'M', 'N'].forEach((n) => b.text(P(n), () => n + prime(), { cls: 'lb', dx: 6, dy: -6 }));
  b.text(P('O'), () => (s.k === 1 && s.u > 0.999 ? "O'" : ''), { cls: 'lb', dx: -4, dy: 20 });
  const render = () => {
    const m = MOVES[s.k];
    $('mvTab').innerHTML = `<tr><th></th>${['A', 'B', 'M', 'N'].map((n) => `<th>${n}${s.k ? '′' : ''}</th>`).join('')}</tr><tr><td>${m.t}</td>${['A', 'B', 'M', 'N'].map((n) => `<td>${xy(m.f(FIG[n], 1).map((v) => Math.round(v * 100) / 100))}</td>`).join('')}</tr>`;
    $('mvMsg').textContent = m.msg;
  };
  $('mvBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = +btn.dataset.k;
    [...$('mvBtns').children].forEach((x) => x.classList.toggle('solid', x === btn));
    render();
    animate(0, 1, (v) => { s.u = v; b.update(); }, 900);
  });
  s.u = 1;
  render();
  b.update();
}

/* ---------- 第 13 页：正方形的三种建系方式（边长 4） ---------- */
const R2 = 2 * Math.SQRT2;
const SQ = [
  { A: [0, 0], B: [4, 0], C: [4, 4], D: [0, 4], lab: { A: '(0, 0)', B: '(4, 0)', C: '(4, 4)', D: '(0, 4)' }, off: { A: [-62, 22], B: [6, 22], C: [6, -8], D: [-62, -8] } },
  { A: [-2, -2], B: [2, -2], C: [2, 2], D: [-2, 2], lab: { A: '(−2, −2)', B: '(2, −2)', C: '(2, 2)', D: '(−2, 2)' }, off: { A: [-86, 22], B: [6, 22], C: [6, -8], D: [-86, -8] } },
  { A: [0, R2], B: [-R2, 0], C: [0, -R2], D: [R2, 0], lab: { A: '(0, 2√2)', B: '(−2√2, 0)', C: '(0, −2√2)', D: '(2√2, 0)' }, off: { A: [8, -8], B: [-40, -12], C: [8, 22], D: [-10, -12] } },
];
function initSquare() {
  const s = { k: 0 };
  const b = Geo.board($('sq'), { x: [-4.6, 5.6], y: [-3.8, 5.4], ticks: 1, w: 500, axes: true, grid: true });
  b.poly(() => ['A', 'B', 'C', 'D'].map((n) => SQ[s.k][n]), { cls: 'tri-m' });
  ['A', 'B', 'C', 'D'].forEach((n) => b.pt(() => SQ[s.k][n], { cls: 'c2', r: 5 }));
  SQ.forEach((c, i) => ['A', 'B', 'C', 'D'].forEach((n) => {
    b.text(() => (s.k === i ? c[n] : null), `${n}${c.lab[n]}`, { cls: 'lb up coord', dx: c.off[n][0], dy: c.off[n][1] });
  }));
  $('sqBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = +btn.dataset.k;
    [...$('sqBtns').children].forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* ---------- 第 15 页：习题 7（平行于坐标轴的直线） ---------- */
function initPar() {
  const s = { k: 0 };
  const b = Geo.board($('par'), AX);
  b.seg(() => (s.k >= 2 ? [[3, -4.8], [3, 5.4]] : [HIDE, HIDE]), { cls: 'gl c-a' });
  b.seg(() => (s.k >= 4 ? [[-5.6, 3], [5.6, 3]] : [HIDE, HIDE]), { cls: 'gl c-b' });
  [['A', [3, -2]], ['B', [3, 1]], ['C', [3, 4]], ['D', [-2, 3]], ['E', [1, 3]], ['F', [4, 3]]].forEach(([n, p]) => {
    b.pt(p, { cls: 'c2' });
    b.text(p, n, { cls: 'lb', dx: 6, dy: n < 'D' ? 14 : -8 });
  });
  onStep($('par'), (st) => { s.k = st; b.update(); });
  b.update();
}

window.LESSON = {
  init() {
    initRoad();
    initCoordP();
    initExamples();
    initQuad();
    initPractice();
    initTri();
    initLab();
    initShift();
    initMoves();
    initSquare();
    initPar();
  },
  onRender(slide, step) {
    stepHooks.forEach((h) => { if (slide.contains(h.el)) h.fn(step); });
    requestAnimationFrame(Geo.refresh);
  },
};
