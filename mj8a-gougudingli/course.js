'use strict';
/* 八上 3.1 勾股定理 · 本课互动：图 3-1 补/割、格点操作板、两种拼图证明。通用部分见 ../shared/math.js
 * 所有图形都由坐标计算，作图板横纵同比例（直角就是直角、正方形就是正方形）。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const dot = (p, q) => p[0] * q[0] + p[1] * q[1];
const len2 = (p) => dot(p, p);
const centroid = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
const shift = (pts, d) => pts.map((p) => add(p, d));

/** 以 PQ 为边、向三角形 PQR 外侧作正方形 */
function outerSquare(P, Q, R) {
  const v = sub(Q, P);
  let n = [-v[1], v[0]];
  if (dot(n, sub(R, P)) > 0) n = [-n[0], -n[1]];
  return [P, Q, add(Q, n), add(P, n)];
}

/* 第 3 页：图 3-1（BC = 3，AC = 4），“补”与“割” */
function initFig31() {
  const C = [0, 0];
  const B = [0, 3];
  const A = [4, 0];
  const s = { mode: '' };
  const b = board($('fig31'), { x: [-3.6, 7.6], y: [-4.6, 7.6], axes: false, ticks: 1, w: 560 });
  const sq3 = outerSquare(A, B, C); // (4,0) (0,3) (3,7) (7,4)
  b.poly(outerSquare(B, C, A), { cls: 'sq1' });
  b.poly(outerSquare(C, A, B), { cls: 'sq2' });
  b.poly(sq3, { cls: 'sq3' });
  // 补：外接 7×7 正方形，四个角上的直角三角形（直角边 3、4）
  const BU = [[[0, 0], [4, 0], [0, 3]], [[4, 0], [7, 0], [7, 4]], [[7, 4], [7, 7], [3, 7]], [[3, 7], [0, 7], [0, 3]]];
  // 割：斜正方形内部 4 个直角三角形（直角边 3、4）+ 中间 1×1 小正方形
  const GE = [[A, B, [4, 3]], [A, [7, 4], [4, 4]], [[7, 4], [3, 7], [3, 4]], [[3, 7], B, [3, 3]]];
  BU.forEach((t) => b.poly(() => (s.mode === 'bu' ? t : []), { cls: 'cut' }));
  b.poly(() => (s.mode === 'bu' ? [[0, 0], [7, 0], [7, 7], [0, 7]] : []), { cls: 'frame-sq' });
  GE.forEach((t) => b.poly(() => (s.mode === 'ge' ? t : []), { cls: 'cut' }));
  b.poly(() => (s.mode === 'ge' ? [[3, 3], [4, 3], [4, 4], [3, 4]] : []), { cls: 'hole' });
  b.poly([A, B, C], { cls: 'tri' });
  b.text([-1.5, 1.5], '9', { cls: 'lb up c', dy: 8 });
  b.text([2, -2], '16', { cls: 'lb up c', dy: 8 });
  b.text(() => (s.mode ? null : centroid(sq3)), '?', { cls: 'lb up c', dy: 8 });
  [[A, 'A', 6, 22], [B, 'B', -20, -6], [C, 'C', 6, 22]].forEach(([p, n, dx, dy]) => b.text(p, n, { dx, dy }));
  $('f31Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mode]');
    if (!btn) return;
    s.mode = btn.dataset.mode;
    $('f31Btns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn && !!s.mode));
    b.update();
  });
  b.update();
}

/* 第 4 页：格点操作板。C 固定在原点，A 在横轴格点上，B 在格点上 */
function initLab() {
  const s = { A: [4, 0], B: [0, 3], rows: [] };
  const C = [0, 0];
  const b = board($('lab'), { x: [-6.5, 12.5], y: [-6.5, 12.5], axes: false, ticks: 1, w: 560 });
  b.poly(() => outerSquare(s.B, C, s.A), { cls: 'sq1' });
  b.poly(() => outerSquare(C, s.A, s.B), { cls: 'sq2' });
  b.poly(() => outerSquare(s.A, s.B, C), { cls: 'sq3' });
  b.poly(() => [s.A, s.B, C], { cls: 'tri' });
  const S = () => ({ s1: len2(s.B), s2: len2(s.A), s3: len2(sub(s.A, s.B)) });
  const angC = () => Math.round((Math.acos(dot(s.A, s.B) / Math.sqrt(len2(s.A) * len2(s.B))) * 180) / Math.PI);
  b.text(() => centroid(outerSquare(s.B, C, s.A)), () => S().s1, { cls: 'lb up c', dy: 8 });
  b.text(() => centroid(outerSquare(C, s.A, s.B)), () => S().s2, { cls: 'lb up c', dy: 8 });
  b.text(() => centroid(outerSquare(s.A, s.B, C)), () => S().s3, { cls: 'lb up c', dy: 8 });
  b.text(C, 'C', { dx: 6, dy: 22 });
  b.text(() => s.A, 'A', { dx: 8, dy: 24 });
  b.text(() => s.B, 'B', { dx: -24, dy: -8 });
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(v)));
  b.drag(() => s.A, (x) => { s.A = [clamp(x, 1, 6), 0]; });
  b.drag(() => s.B, (x, y) => { s.B = [clamp(x, -3, 3), clamp(y, 1, 6)]; });
  b.onUpdate = () => {
    const { s1, s2, s3 } = S();
    const ang = angC();
    $('labS1').textContent = s1; $('labS2').textContent = s2; $('labS3').textContent = s3;
    $('labC').textContent = `${ang}°`;
    const msg = $('labMsg');
    const ok = s1 + s2 === s3;
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = ang === 90
      ? `∠C = 90°：${s1} + ${s2} = ${s1 + s2}，正好等于 ${s3}。`
      : `∠C = ${ang}°，不是直角：${s1} + ${s2} = ${s1 + s2}，${s1 + s2 > s3 ? '大于' : '小于'} ${s3}。`;
  };
  const renderRows = () => {
    const head = $('labTab').rows[0].outerHTML;
    $('labTab').innerHTML = head + s.rows.map((r) => `<tr><td>${r.ang}°</td><td>${r.s1}</td><td>${r.s2}</td><td>${r.s1 + r.s2}</td><td>${r.s3}</td></tr>`).join('');
    tex($('labTab'));
  };
  const MAX_ROWS = 5;
  $('labRec').addEventListener('click', () => { s.rows = [...s.rows, { ...S(), ang: angC() }].slice(-MAX_ROWS); renderRows(); });
  $('labClr').addEventListener('click', () => { s.rows = []; renderRows(); });
  b.update();
}

/* 拼图：kind = 'out'（图 3-3，外框边长 a+b）或 'zhao'（图 3-4 弦图，外框边长 c） */
function slotsOf(kind, a, bb) {
  if (kind === 'out') {
    const s = a + bb;
    return {
      side: s,
      tris: [[[0, 0], [bb, 0], [0, a]], [[bb, 0], [s, 0], [s, bb]], [[s, bb], [s, s], [a, s]], [[a, s], [0, s], [0, a]]],
      inner: [[bb, 0], [s, bb], [a, s], [0, a]],
    };
  }
  const c = Math.hypot(a, bb);
  const R0 = [(bb * bb) / c, (a * bb) / c]; // 直角顶点：到 (0,0) 距离 b，到 (c,0) 距离 a
  const rot = (p, k) => { // 绕中心 (c/2, c/2) 逆时针转 k×90°
    let [x, y] = [p[0] - c / 2, p[1] - c / 2];
    for (let i = 0; i < k; i++) [x, y] = [-y, x];
    return [x + c / 2, y + c / 2];
  };
  const base = [[0, 0], [c, 0], R0];
  const tris = [0, 1, 2, 3].map((k) => base.map((p) => rot(p, k)));
  return { side: c, tris, inner: tris.map((t) => t[2]) };
}

const TRAY = [[10.6, 5.6], [14.6, 5.6], [10.6, 1.8], [14.6, 1.8]];
const SNAP = 0.8;

function initPuzzle(id, kind) {
  const s = { a: 2, b: 3.5, pos: TRAY.map((p) => [...p]), placed: [false, false, false, false] };
  const geo = () => slotsOf(kind, s.a, s.b);
  const b = board($(id), { x: [-0.6, 17.2], y: [-0.9, 8.1], axes: false, grid: false, w: 640 });
  const allIn = () => s.placed.every(Boolean);
  b.poly(() => { const n = geo().side; return [[0, 0], [n, 0], [n, n], [0, n]]; }, { cls: 'frame-sq' });
  [0, 1, 2, 3].forEach((i) => b.poly(() => geo().tris[i], { cls: 'slot' }));
  b.poly(() => (allIn() ? geo().inner : []), { cls: 'hole' });
  const pieces = [0, 1, 2, 3].map((i) => b.poly(() => { const t = geo().tris[i]; return shift(t, sub(s.pos[i], centroid(t))); }, { cls: 'piece' }));
  // 边长标注
  const lab = (p, t, dx, dy) => b.text(p, t, { dx, dy });
  if (kind === 'out') {
    lab(() => [s.b / 2, 0], 'b', -4, 26); lab(() => [s.b + s.a / 2, 0], 'a', -4, 26);
    lab(() => [0, s.a / 2], 'a', -22, 6); lab(() => [0, s.a + s.b / 2], 'b', -22, 6);
    lab(() => (allIn() ? centroid(geo().inner) : null), 'c²', -12, 8);
  } else {
    lab(() => [geo().side / 2, 0], 'c', -4, 26); lab(() => [0, geo().side / 2], 'c', -22, 6);
    lab(() => (allIn() && Math.abs(s.a - s.b) > 0.4 ? centroid(geo().inner) : null), 'b−a', -16, 8);
  }
  [0, 1, 2, 3].forEach((i) => b.drag(() => s.pos[i], (x, y) => {
    const target = centroid(geo().tris[i]);
    const near = Math.hypot(x - target[0], y - target[1]) < SNAP;
    s.placed = s.placed.map((v, k) => (k === i ? near : v));
    s.pos = s.pos.map((p, k) => (k === i ? (near ? target : [x, y]) : p));
  }, { r: 7, hit: 18 }));
  b.onUpdate = () => {
    pieces.forEach((p, i) => p.classList.toggle('in', s.placed[i]));
    const n = s.placed.filter(Boolean).length;
    const msg = $(`${id}Msg`);
    const c = Math.hypot(s.a, s.b);
    msg.className = `tip feedback ${n === 4 ? 'fb-ok' : ''}`;
    if (n < 4) { msg.textContent = `拖动纸片中心的橙色点，把纸片放进虚线框（已放入 ${n}/4）`; return; }
    msg.innerHTML = kind === 'out'
      ? `拼好了！外框边长 $a+b=${fmt(s.a + s.b)}$，中间正方形边长 $c\\approx${fmt(c)}$。`
      : (Math.abs(s.a - s.b) < 0.01
        ? `拼好了！$a=b$ 时中间的小正方形<b>消失</b>：$c^2=4\\times\\frac12ab$。`
        : `拼好了！外框边长 $c\\approx${fmt(c)}$，中间小正方形边长 $b-a=${fmt(s.b - s.a)}$。`);
    tex(msg);
  };
  const resync = () => {
    s.pos = s.pos.map((p, i) => (s.placed[i] ? centroid(geo().tris[i]) : p));
    $(`${id}aV`).textContent = fmt(s.a); $(`${id}bV`).textContent = fmt(s.b);
    b.update();
  };
  slider($(`${id}a`), (v) => { s.a = v; resync(); });
  slider($(`${id}b`), (v) => { s.b = v; resync(); });
}

window.LESSON = {
  init() {
    initFig31();
    initLab();
    initPuzzle('pz1', 'out');
    initPuzzle('pz2', 'zhao');
  },
};
