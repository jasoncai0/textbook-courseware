'use strict';
/* 七上 6.3 余角、补角、对顶角 · 本课互动：三角尺拼角、三组角连线、同角的余角、小孔成像、转动木条、数对顶角。
 * 所有角都由坐标计算（MAngle，见 ../shared/mangle.js），作图板横纵同比例。 */
const { board, slider, fmt } = MathKit;
const { at, dir, size, span, mark, square } = MAngle;
const $ = (id) => document.getElementById(id);
const O0 = [0, 0];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const val = (v) => (typeof v === 'function' ? v() : v);

/** 从 o 出发的射线 + 端点字母；d 可为函数 */
function ray(b, d, len, name, cls = 'ray', o = O0) {
  b.seg(() => [val(o), at(val(o), val(d), len)], { cls });
  if (name) b.text(() => at(val(o), val(d), len + 0.32), name, { dx: -6, dy: 7 });
}
/** 角内标注（弧 + 文字），d1 → d2 逆时针 */
function angLabel(b, o, d1, d2, r, txt, cls = '') {
  mark(b, o, () => at(val(o), val(d1), 1), () => at(val(o), val(d2), 1), r, { cls: `amark ${cls}` });
  b.text(() => { const [a, s] = span(val(o), at(val(o), val(d1), 1), at(val(o), val(d2), 1)); return at(val(o), a + s / 2, r + 0.38); }, txt, { cls: `deg ${cls}`, dy: 6 });
}

/* 第 3 页：三角尺拼角（图 6-25） */
function initSquares() {
  const s = { a: 35, m: 1 };
  const b = board($('sq'), { x: [-4.4, 4.4], y: [-0.9, 3.9], axes: false, grid: false, w: 560 });
  b.poly([[-4.3, 0], [4.3, 0], [4.3, -0.6], [-4.3, -0.6]], { cls: 'ruler' });
  for (let x = -4; x <= 4.01; x += 0.25) b.seg([[x, 0], [x, Number.isInteger(x) ? -0.3 : -0.15]], { cls: 'tick' });
  const L1 = 3.2;
  const L2 = L1 * Math.tan(Math.PI / 6);
  b.poly(() => (s.m === 1 ? [O0, at(O0, s.a, L1), at(O0, s.a + 90, L2)] : [O0, O0, O0]), { cls: 'setsq' });
  b.seg(() => (s.m === 1 ? [O0, at(O0, s.a, L1)] : [O0, at(O0, s.a, 3.6)]), { cls: 'ray hl' });
  b.seg(() => (s.m === 1 ? [O0, at(O0, s.a + 90, L2)] : [O0, O0]), { cls: 'ray hl' });
  square(b, O0, () => s.a, () => (s.m === 1 ? 0.28 : 0), { cls: 'rmark' });
  const bStart = () => (s.m === 1 ? s.a + 90 : s.a);
  angLabel(b, O0, 0, () => s.a, 0.75, 'α');
  angLabel(b, O0, bStart, 180, 0.75, 'β', 'b');
  b.pt(O0, { r: 4 });
  b.text(O0, 'O', { dx: -6, dy: 24 });
  b.onUpdate = () => {
    const beta = 180 - bStart();
    $('sqV').textContent = `${s.a}°`;
    $('sqA').textContent = `${s.a}°`;
    $('sqB').textContent = `${beta}°`;
    $('sqS').textContent = `${s.a + beta}°`;
  };
  slider($('sqR'), (v) => { s.a = v; b.update(); });
  $('sqBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    s.m = +btn.dataset.m;
    const r = $('sqR');
    r.max = s.m === 1 ? 85 : 175;
    s.a = clamp(s.a, 5, +r.max);
    r.value = s.a;
    $('sqBtns').querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
}

/* 第 4 页：图 6-26、6-27（两个角分开画） */
function initDefs() {
  const two = (id, a, bb) => {
    const b = board($(id), { x: [-0.4, 7.4], y: [-0.5, 2.6], axes: false, grid: false, w: 520 });
    const O2 = [bb > 90 ? 5.6 : 4.1, 0];
    ray(b, 0, 2.6); ray(b, a, 2.6);
    angLabel(b, O0, 0, a, 0.7, 'α');
    ray(b, 0, 1.6, null, 'ray', O2); ray(b, bb, 2.4, null, 'ray', O2);
    angLabel(b, O2, 0, bb, 0.55, 'β', 'b');
    b.update();
  };
  two('f626', 35, 55);
  two('f627', 45, 135);
}

/* 第 6 页：三组角连线 */
function initMatch() {
  const G = { A: [10, 55, 75, 100, 145], B: [35, 80, 105, 125, 170], C: [10, 15, 35, 55, 115] };
  const s = { sel: null, pairs: [] };
  const root = $('match');
  Object.entries(G).forEach(([g, vs]) => {
    const box = root.querySelector(`[data-g="${g}"]`);
    vs.forEach((v) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chipbtn';
      btn.dataset.g = g;
      btn.dataset.v = v;
      btn.textContent = `${v}°`;
      box.appendChild(btn);
    });
  });
  const key = (g, v) => `${g}${v}`;
  const render = () => {
    root.querySelectorAll('.chipbtn').forEach((x) => {
      const k = key(x.dataset.g, x.dataset.v);
      const idx = s.pairs.findIndex((p) => p.includes(k));
      x.className = `chipbtn${s.sel === k ? ' sel' : ''}${idx >= 0 ? ` p${idx}` : ''}`;
    });
    const n1 = s.pairs.filter((p) => p[0][0] === 'A').length;
    const n2 = s.pairs.length - n1;
    $('matchCount').textContent = `(1) 补角：已连 ${n1}/5 对　(2) 余角：已连 ${n2}/2 对`;
  };
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.chipbtn');
    if (!btn) return;
    const k = key(btn.dataset.g, btn.dataset.v);
    const msg = $('matchMsg');
    if (!s.sel || s.sel[0] === k[0]) { s.sel = s.sel === k ? null : k; render(); return; }
    const [p, q] = [s.sel, k].sort();
    const [gp, vp, gq, vq] = [p[0], +p.slice(1), q[0], +q.slice(1)];
    s.sel = null;
    if (gp === 'A' && gq === 'C') { msg.className = 'tip feedback'; msg.textContent = '题目只要求 A 组与 B 组、B 组与 C 组连线。'; render(); return; }
    const want = gp === 'A' ? 180 : 90;
    const ok = vp + vq === want;
    const dup = s.pairs.some((x) => x.includes(p) && x.includes(q));
    if (ok && !dup) s.pairs = [...s.pairs, [p, q]];
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = ok
      ? `✓ ${vp}° + ${vq}° = ${want}°，互为${want === 180 ? '补' : '余'}角。`
      : `✗ ${vp}° + ${vq}° = ${vp + vq}°，不是 ${want}°（要找${want === 180 ? '补' : '余'}角）。`;
    render();
  });
  render();
}

/* 第 7 页：同角的余角相等 */
function initTong() {
  const s = { x: 30 };
  const b = board($('tong'), { x: [-3.8, 4.0], y: [-0.7, 3.9], axes: false, grid: false, w: 520 });
  const L = 3.3;
  ray(b, 0, L, 'B'); ray(b, () => 90 - s.x, L, 'C', 'ray b'); ray(b, 90, L, 'D', 'ray b'); ray(b, () => 180 - s.x, L, 'A');
  angLabel(b, O0, () => 90 - s.x, 90, 0.8, '1');
  angLabel(b, O0, 0, () => 90 - s.x, 1.25, '2', 'b');
  angLabel(b, O0, 90, () => 180 - s.x, 1.25, '3', 'g');
  b.pt(O0, { r: 4 });
  b.text(O0, 'O', { dx: -6, dy: 24 });
  b.onUpdate = () => {
    $('tongV').textContent = `${s.x}°`;
    $('tongMsg').textContent = `∠AOC = ∠BOD = 90°：∠1 = ${s.x}°，∠2 = ∠BOC = ${90 - s.x}°，∠3 = ∠AOD = ${90 - s.x}°。`;
  };
  slider($('tongR'), (v) => { s.x = v; b.update(); });
}

/* 第 8 页：练一练 2 的直角三角形（∠ACB = 90°，CD ⊥ AB） */
function initTri() {
  const C = [0, 0];
  const A = [4, 0];
  const B = [0, 3];
  const D = [4 - 0.8 * 3.2, 0.6 * 3.2]; // C 在 AB 上的垂足
  const b = board($('tri'), { x: [-0.6, 4.6], y: [-0.6, 3.4], axes: false, grid: false, w: 340 });
  b.poly([A, B, C], { cls: 'fig' });
  b.seg([C, D], { cls: 'ray' });
  square(b, C, 0, 0.25);
  square(b, D, dir(D, A), 0.22);
  [[A, 'A', 4, 20], [B, 'B', -18, 0], [C, 'C', -18, 18], [D, 'D', 4, -6]].forEach(([p, t, dx, dy]) => b.text(p, t, { dx, dy }));
  b.update();
}

/* 第 9 页：小孔成像光路 */
function initHole() {
  const O = [0, 0];
  const A = [-3.4, 2.1];
  const B = [-3.4, -2.1];
  const WALL = 2.6;
  const A2 = [WALL, (A[1] / A[0]) * WALL];
  const B2 = [WALL, (B[1] / B[0]) * WALL];
  const b = board($('hole'), { x: [-4.3, 3.6], y: [-2.6, 2.6], axes: false, grid: false, w: 520 });
  b.seg([[0, 2.5], [0, 0.18]], { cls: 'screen' });
  b.seg([[0, -0.18], [0, -2.5]], { cls: 'screen' });
  b.seg([[WALL, 2.5], [WALL, -2.5]], { cls: 'screen' });
  b.seg([A, B], { cls: 'person' });
  b.pt([A[0], A[1] - 0.3], { r: 9, cls: 'head' });
  b.seg([A2, B2], { cls: 'person thin2' });
  b.seg([A, A2], { cls: 'light' });
  b.seg([B, B2], { cls: 'light' });
  angLabel(b, O, dir(O, B), dir(O, A), 0.6, '', 'b');
  angLabel(b, O, dir(O, A2), dir(O, B2), 0.6, '', 'b');
  angLabel(b, O, dir(O, A), dir(O, B2), 0.45, '', 'g');
  angLabel(b, O, dir(O, B), dir(O, A2), 0.45, '', 'g');
  [[A, 'A', -22, 0], [B, 'B', -22, 14], [A2, 'A′', 8, 8], [B2, 'B′', 8, 8], [O, 'O', 8, -10]].forEach(([p, t, dx, dy]) => b.text(p, t, { dx, dy }));
  b.update();
}

/* 第 10 页：转动木条（图 6-29、6-30） */
function initCross() {
  const A_DIR = 340; // 直线 a：右端略向下
  const s = { t: 30 }; // 直线 b 右端的方向
  const L = 3.4;
  const b = board($('cross'), { x: [-4, 4], y: [-2.6, 2.9], axes: false, grid: false, w: 520 });
  b.seg([at(O0, A_DIR, L), at(O0, A_DIR - 180, L)], { cls: 'stick' });
  b.seg(() => [at(O0, s.t, L), at(O0, s.t + 180, L)], { cls: 'stick b' });
  b.text(at(O0, A_DIR, L + 0.3), 'a', { dx: -4, dy: 8 });
  b.text(() => at(O0, s.t, L + 0.3), 'b', { dx: -4, dy: 6 });
  const ANG = () => ({ 1: [160, s.t + 180], 2: [s.t + 180, 340], 3: [340, s.t + 360], 4: [s.t, 160] });
  [1, 2, 3, 4].forEach((k) => angLabel(b, O0, () => ANG()[k][0], () => ANG()[k][1], k % 2 ? 0.55 : 0.75, String(k), k % 2 ? '' : 'b'));
  b.pt(O0, { r: 4 });
  b.drag(() => at(O0, s.t, L * 0.85), (x, y) => {
    const d = dir(O0, [x, y]);
    s.t = clamp(Math.round(d > 250 ? d - 180 : d), 5, 150);
  });
  b.onUpdate = () => {
    const v = { 1: s.t + 20, 2: 160 - s.t, 3: s.t + 20, 4: 160 - s.t };
    [1, 2, 3, 4].forEach((k) => { $(`c${k}`).textContent = `${v[k]}°`; });
  };
  b.update();
}

/* 第 11 页：三条直线交于一点（图 6-28），6 对对顶角 */
function initThree() {
  const D = { D: 8, F: 30, A: 152, C: 188, E: 210, B: 332 };
  const PAIRS = [['D', 'F', 'C', 'E'], ['F', 'A', 'E', 'B'], ['A', 'C', 'B', 'D'], ['D', 'A', 'C', 'B'], ['F', 'C', 'E', 'D'], ['A', 'E', 'B', 'F']];
  const s = { k: -1 };
  const L = 3.2;
  const b = board($('three'), { x: [-3.9, 3.9], y: [-2.2, 2.4], axes: false, grid: false, w: 520 });
  Object.entries(D).forEach(([n, d]) => ray(b, d, L, n));
  const cur = () => (s.k >= 0 ? PAIRS[s.k] : null);
  const ang = (i) => () => (cur() ? D[cur()[i]] : 0);
  angLabel(b, O0, ang(0), ang(1), 0.7, () => (cur() ? `${Math.round(size(O0, at(O0, D[cur()[0]], 1), at(O0, D[cur()[1]], 1)))}°` : ''));
  angLabel(b, O0, ang(2), ang(3), 0.7, () => (cur() ? `${Math.round(size(O0, at(O0, D[cur()[2]], 1), at(O0, D[cur()[3]], 1)))}°` : ''));
  b.pt(O0, { r: 4 });
  b.text(O0, 'O', { dx: -4, dy: 26 });
  b.onUpdate = () => {
    const p = cur();
    $('threeMsg').textContent = p ? `第 ${s.k + 1} 对：∠${p[0]}O${p[1]} 与 ∠${p[2]}O${p[3]}（${s.k + 1}/6）` : '如图 6-28，直线 AB、CD、EF 相交于点 O。先自己数，再点“下一对”验证。';
  };
  $('threeNext').addEventListener('click', () => { s.k = (s.k + 1) % PAIRS.length; b.update(); });
  $('threeClr').addEventListener('click', () => { s.k = -1; b.update(); });
  b.update();
}

/** 静态小图：若干条从 O 出发的射线 */
function rays(id, list, opt = {}) {
  const b = board($(id), { x: opt.x || [-3.5, 3.5], y: opt.y || [-2.3, 2.5], axes: false, grid: false, w: 360 });
  list.forEach(([n, d, cls]) => ray(b, d, opt.len || 2.8, n, cls || 'ray'));
  b.pt(O0, { r: 3.5 });
  b.text(O0, 'O', opt.o || { dx: -4, dy: 24 });
  return b;
}

function initFigs() {
  const e2 = rays('ex2', [['A', 225], ['B', 45], ['C', 153], ['D', 333], ['E', 63, 'ray b']], { w: 420 });
  angLabel(e2, O0, 153, 225, 0.6, '72°');
  angLabel(e2, O0, 45, 63, 1.3, '?', 'b');
  square(e2, O0, 333, 0.25);
  e2.update();

  const db = rays('dirB', [['A', 45, 'ray b'], ['A′', 225, 'ray hl']], { y: [-2.6, 2.6] });
  [['北', [0, 2.4], -8, 4], ['南', [0, -2.4], -8, 14], ['东', [2.9, 0], 2, 6], ['西', [-2.9, 0], -24, 6]].forEach(([t, p, dx, dy]) => db.text(p, t, { cls: 'lb up', dx, dy }));
  db.seg([[-2.6, 0], [2.6, 0]], { cls: 'dash' });
  db.seg([[0, -2.2], [0, 2.2]], { cls: 'dash' });
  angLabel(db, O0, 45, 90, 0.6, '45°', 'b');
  db.update();

  const p3 = rays('pr3', [['A', 155], ['B', 335], ['C', 210], ['D', 30], ['E', 245]]);
  square(p3, O0, 155, 0.22);
  p3.update();

  const r5 = rays('h5', [['A', 0], ['C', 90], ['B', 25], ['D', 205]], { y: [-1.6, 3.1] });
  square(r5, O0, 0, 0.25);
  angLabel(r5, O0, 90, 205, 0.5, '115°', 'b');
  r5.update();

  const r8 = rays('h8', [['A', 230], ['B', 50], ['C', 160], ['D', 340], ['E', 25]]);
  angLabel(r8, O0, 25, 50, 1.0, '1');
  angLabel(r8, O0, 340, 25, 0.7, '2', 'b');
  r8.update();

  const r9 = rays('h9', [['A', 216], ['B', 36], ['C', 144], ['D', 324], ['E', 0], ['F', 54, 'ray b']]);
  square(r9, O0, 324, 0.22);
  r9.update();
}

window.LESSON = {
  init() {
    initSquares();
    initDefs();
    initMatch();
    initTong();
    initTri();
    initHole();
    initCross();
    initThree();
    initFigs();
  },
};
