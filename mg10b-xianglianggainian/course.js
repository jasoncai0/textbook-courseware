'use strict';
/* 高一下 9.1 向量概念 · 本课互动：斜面受力图、单位向量终点轨迹、平行/相等图、共线平移、正六边形例 1、
 * 向量平移判关系（核心）、例 2 方格点选作向量、练习 3 方格图、习题 7 点选比较。通用部分见 ../shared/math.js、mvec.js */
const { board, vec, vecAdd, vecSub, vecMul, vecLen, vecDot, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];
const mkBoard = (id, opt) => { const b = board($(id), opt); boards.push(b); return b; };
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const cross = (p, q) => p[0] * q[1] - p[1] * q[0];
const same = (p, q) => p[0] === q[0] && p[1] === q[1];
const DEG = 180 / Math.PI;

/** 整数平方长 n2 化成最简根式：18 → 3√2 */
function surd(n2) {
  if (n2 === 0) return '0';
  let k = 1;
  let m = n2;
  for (let f = 2; f * f <= m; f += 1) while (m % (f * f) === 0) { m /= f * f; k *= f; }
  return m === 1 ? String(k) : `${k === 1 ? '' : k}√${m}`;
}
const len2 = (p) => vecDot(p, p);
/** 方向角：从水平向右方向逆时针转到 p，0°～360° */
const dirAngle = (p) => ((Math.atan2(p[1], p[0]) * DEG) + 360) % 360;
const angleBetween = (p, q) => Math.acos(clamp(vecDot(p, q) / (vecLen(p) * vecLen(q)), -1, 1)) * DEG;

/** 两个向量（整数分量）的关系；与起点无关，只看分量 */
function relation(a, b) {
  if (len2(b) === 0) return { key: 'zero', text: '$\\boldsymbol b=\\boldsymbol 0$ 是<b>零向量</b>：方向任意，规定它与任一向量平行。' };
  const eqLen = len2(a) === len2(b);
  if (cross(a, b) === 0) {
    if (vecDot(a, b) > 0) return eqLen ? { key: 'equal', text: '<b>相等</b>：$\\boldsymbol b=\\boldsymbol a$（等长且同向）。' } : { key: 'same', text: '<b>共线（平行），方向相同</b>，但长度不等，所以不相等。' };
    return eqLen ? { key: 'opp', text: '<b>相反向量</b>：$\\boldsymbol b=-\\boldsymbol a$（等长且反向），也是共线向量。' } : { key: 'rev', text: '<b>共线（平行），方向相反</b>，但长度不等，不是相反向量。' };
  }
  const perp = vecDot(a, b) === 0;
  return { key: perp ? 'perp' : 'none', text: `<b>都不是</b>：不平行，也不相等。${perp ? '夹角 $90^\\circ$：$\\boldsymbol a\\perp\\boldsymbol b$。' : ''}${eqLen ? '只是模相等。' : ''}` };
}

/* 第 3 页：图 9-1-1，30° 光滑斜面上的木块 */
function initIncline() {
  const T = Math.PI / 6;
  const b = mkBoard('incline', { x: [-0.5, 7.2], y: [-0.4, 4.6], w: 560, axes: false, grid: false });
  const BASE = 6.4;
  b.poly([[0, 0], [BASE, 0], [BASE, BASE * Math.tan(T)]], { cls: 'slope' });
  const u = [Math.cos(T), Math.sin(T)];
  const n = [-Math.sin(T), Math.cos(T)];
  const SIDE = 0.9;
  const P = vecMul(3.4, u);
  b.poly([P, vecAdd(P, vecMul(SIDE, u)), vecAdd(vecAdd(P, vecMul(SIDE, u)), vecMul(SIDE, n)), vecAdd(P, vecMul(SIDE, n))], { cls: 'fill1' });
  const C = vecAdd(P, vecMul(SIDE / 2, vecAdd(u, n)));
  const G = 2.2;
  vec(b, [C, vecAdd(C, [0, -G])], { cls: 'v2', label: 'G', side: -1 });
  vec(b, [C, vecAdd(C, vecMul(G * Math.cos(T), n))], { cls: 'v1', label: 'N', side: 1 }); // 光滑斜面：N = G·cos30°
  b.pt(C, { r: 4 });
  b.update();
}

/* 第 4 页：起点在 O 的单位向量，拖终点留下轨迹 */
function initUnit() {
  const s = { t: Math.PI / 6, lo: Math.PI / 6, hi: Math.PI / 6 };
  const b = mkBoard('unit', { x: [-1.7, 1.7], y: [-1.25, 1.25], w: 460, ticks: 0.5 });
  b.curve((t) => [Math.cos(t), Math.sin(t)], () => s.lo, () => s.hi, { cls: 'c3 trail' });
  vec(b, () => [[0, 0], [Math.cos(s.t), Math.sin(s.t)]], { cls: 'v1', label: 'e' });
  b.drag(() => [Math.cos(s.t), Math.sin(s.t)], (x, y) => {
    if (Math.hypot(x, y) < 1e-6) return;
    const raw = Math.atan2(y, x);
    const k = Math.round((s.t - raw) / (2 * Math.PI)); // 角度连续展开，轨迹才能绕满一圈
    s.t = raw + k * 2 * Math.PI;
    s.lo = Math.min(s.lo, s.t); s.hi = Math.max(s.hi, s.t);
  });
  b.onUpdate = () => {
    const full = s.hi - s.lo >= 2 * Math.PI - 0.02;
    const e = [Math.cos(s.t), Math.sin(s.t)];
    $('unitMsg').innerHTML = `$|\\boldsymbol e|=${fmt(vecLen(e))}$，方向角 ${fmt(dirAngle(e), 1)}°。`
      + (full ? '　<b>已经转满一圈！</b>' : `　已转过 ${fmt(Math.min(360, (s.hi - s.lo) * DEG), 0)}°`);
    tex($('unitMsg'));
  };
  b.update();
}

/* 第 5 页：图 9-1-3 平行向量 + 图 9-1-4 平行四边形 */
function initPar() {
  const b = mkBoard('par', { x: [-0.3, 10.6], y: [-0.6, 3.4], w: 620, axes: false, grid: false });
  vec(b, [[0, 0], [1.6, 1.6]], { cls: 'v1', label: 'a' });
  vec(b, [[2.4, 1.6], [1.6, 0.8]], { cls: 'v1', label: 'b', side: -1 });
  vec(b, [[2.2, 0.2], [4.2, 2.2]], { cls: 'v1', label: 'c', side: 1 });
  const [A, B, C, D] = [[6.2, 2.6], [5.4, 0.2], [9.6, 0.2], [10.4, 2.6]];
  b.seg([A, D], { cls: 'thin' }); b.seg([B, C], { cls: 'thin' });
  vec(b, [A, B], { cls: 'v2' });
  vec(b, [D, C], { cls: 'v2' });
  [[A, 'A', -10, -12], [B, 'B', -22, 14], [C, 'C', 6, 20], [D, 'D', 6, -10]].forEach(([p, t, dx, dy]) => b.text(p, t, { dx, dy }));
  b.update();
}

/* 第 6 页：图 9-1-5，a、b 水平平移到 c 所在直线 y = 2x − 4 上 */
function initCollinear() {
  const s = { t: 0 };
  const b = mkBoard('col', { x: [-0.5, 5.5], y: [-0.5, 4.5], w: 480, axes: false, grid: false });
  dashGrid(b, 5, 4);
  const SH_A = 3; // a 起点 (0,2) → (3,2)
  const SH_B = 1.5; // b 起点 (2,3) → (3.5,3)
  b.seg([[1.75, -0.5], [4.25, 4.5]], { cls: 'dash' });
  vec(b, () => (s.t > 0 ? [[0, 2], [1, 4]] : null), { cls: 'vg' }); // 原来的位置
  vec(b, () => (s.t > 0 ? [[2, 3], [1, 1]] : null), { cls: 'vg' });
  vec(b, [[2, 0], [4, 4]], { cls: 'v3 fat', label: 'c', side: 1 });
  vec(b, () => [[SH_A * s.t, 2], [1 + SH_A * s.t, 4]], { cls: 'v1', label: 'a' });
  vec(b, () => [[2 + SH_B * s.t, 3], [1 + SH_B * s.t, 1]], { cls: 'v2', label: 'b' });
  MathKit.slider($('colT'), (v) => {
    s.t = v;
    const a0 = SH_A * v;
    const b0 = 2 + SH_B * v;
    $('colV').textContent = v === 1 ? '三个向量都在直线 y = 2x − 4 上' : `a 起点 (${fmt(a0)}, 2)，b 起点 (${fmt(b0)}, 3)`;
    b.update();
  });
}

/* 第 7 页：图 9-1-7 正六边形 */
function initHex() {
  const b = mkBoard('hex', { x: [-1.45, 1.45], y: [-1.15, 1.15], w: 440, axes: false, grid: false });
  const names = ['C', 'D', 'E', 'F', 'A', 'B'];
  const P = {};
  names.forEach((nm, i) => { P[nm] = [Math.cos(i * Math.PI / 3), Math.sin(i * Math.PI / 3)]; });
  P.O = [0, 0];
  b.poly(names.map((nm) => P[nm]), { cls: 'hexf' });
  vec(b, [P.F, P.E], { cls: 'v1' });
  vec(b, [P.B, P.C], { cls: 'v1' });
  vec(b, [P.O, P.C], { cls: 'v2' });
  vec(b, [P.O, P.A], { cls: 'v2' });
  const OFF = { C: [12, 8], D: [8, -8], E: [-22, -8], F: [-26, 8], A: [-22, 24], B: [8, 24], O: [-8, -12] };
  Object.entries(OFF).forEach(([nm, [dx, dy]]) => { b.pt(P[nm], { r: 4 }); b.text(P[nm], nm, { dx, dy }); });
  b.update();
}

/* 第 9 页（核心）：拖起点平移、拖终点改变 b，判断与 a 的关系 */
const A_PRESETS = [[3, 1], [2, 2], [3, 0], [-1, 2]];
const TASKS = [
  { key: 'equal', label: '作出 $\\boldsymbol b=\\boldsymbol a$', ok: (r) => r.key === 'equal' },
  { key: 'opp', label: '作出 $\\boldsymbol b=-\\boldsymbol a$', ok: (r) => r.key === 'opp' },
  { key: 'par', label: '$\\boldsymbol b\\parallel\\boldsymbol a$ 但 $|\\boldsymbol b|\\ne|\\boldsymbol a|$', ok: (r) => r.key === 'same' || r.key === 'rev' },
  { key: 'perp', label: '作出 $\\boldsymbol b\\perp\\boldsymbol a$', ok: (r) => r.key === 'perp' },
  { key: 'unit', label: '$\\boldsymbol b$ 是单位向量', ok: (r, bv) => len2(bv) === 1 },
  { key: 'zero', label: '$\\boldsymbol b$ 是零向量', ok: (r) => r.key === 'zero' },
];
function initShift() {
  const XM = 12;
  const YM = 7;
  const s = { ai: 0, a0: [1, 2], b0: [6, 1], b1: [8, 4], ghost: false, done: new Set() };
  const av = () => A_PRESETS[s.ai];
  const bv = () => vecSub(s.b1, s.b0);
  const b = mkBoard('shift', { x: [-0.5, XM + 0.5], y: [-0.5, YM + 0.5], w: 640, axes: false, grid: false });
  dashGrid(b, XM, YM);
  vec(b, () => [s.a0, vecAdd(s.a0, av())], { cls: 'v1', label: 'a' });
  vec(b, () => (s.ghost && len2(bv()) ? [s.b0, vecAdd(s.b0, av())] : null), { cls: 'vg' });
  vec(b, () => [s.b0, s.b1], { cls: 'v2', label: 'b' });
  b.pt(() => (len2(bv()) ? null : s.b0), { cls: 'c2', r: 11 });
  b.drag(() => s.b0, (x, y) => {
    const d = bv();
    const nx = clamp(Math.round(x), Math.max(0, -d[0]), Math.min(XM, XM - d[0]));
    const ny = clamp(Math.round(y), Math.max(0, -d[1]), Math.min(YM, YM - d[1]));
    s.b0 = [nx, ny];
    s.b1 = vecAdd(s.b0, d);
  }).classList.add('h-start');
  b.drag(() => s.b1, (x, y) => { s.b1 = [clamp(Math.round(x), 0, XM), clamp(Math.round(y), 0, YM)]; });
  const row = (name, v, col) => `<span class="nm ${col}">$\\boldsymbol ${name}$</span><span>$(${v[0]},\\,${v[1]})$</span><span>模 <b>${surd(len2(v))}</b></span><span>${len2(v) ? `方向角 <b>${fmt(dirAngle(v), 1)}°</b>` : '方向任意'}</span>`;
  b.onUpdate = () => {
    const a = av();
    const v = bv();
    const r = relation(a, v);
    TASKS.forEach((t) => { if (t.ok(r, v)) s.done.add(t.key); });
    const theta = len2(v) ? `<span class="nm">夹角</span><span class="span3">$\\theta=$ <b>${fmt(angleBetween(a, v), 1)}°</b>（把起点移到一起量，$0^\\circ\\le\\theta\\le 180^\\circ$）</span>` : '';
    $('shRead').innerHTML = row('a', a, 'c-a') + row('b', v, 'c-b') + theta
      + '<span class="muted small-t span4">（括号里是“横走几格，竖走几格”；方向角：从水平向右方向逆时针转到该向量）</span>';
    const notes = [];
    if (len2(v) === 1) notes.push('$|\\boldsymbol b|=1$：<b>单位向量</b>。');
    $('shMsg').className = `tip feedback ${r.key === 'none' || r.key === 'perp' ? '' : 'fb-ok'}`;
    $('shMsg').innerHTML = r.text + notes.join('');
    $('shTasks').innerHTML = `<h4>任务（${s.done.size}/${TASKS.length}）</h4>` + TASKS.map((t) => `<span class="task ${s.done.has(t.key) ? 'ok' : ''}">${s.done.has(t.key) ? '✓' : '○'} ${t.label}</span>`).join('');
    [$('shRead'), $('shMsg'), $('shTasks')].forEach(tex);
  };
  $('shGhost').addEventListener('click', () => { s.ghost = !s.ghost; $('shGhost').classList.toggle('solid', s.ghost); b.update(); });
  $('shNext').addEventListener('click', () => { s.ai = (s.ai + 1) % A_PRESETS.length; b.update(); });
  b.update();
  return s;
}

/* 方格纸：画虚线格子 */
function dashGrid(b, cols, rows) {
  for (let x = 0; x <= cols; x += 1) b.seg([[x, 0], [x, rows]], { cls: 'dash' });
  for (let y = 0; y <= rows; y += 1) b.seg([[0, y], [cols, y]], { cls: 'dash' });
}
/** 点击位置 → 最近格点（离格点太远返回 null） */
function latticeAt(b, opt, e, cols, rows) {
  const p = b.svg.createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  const q = p.matrixTransform(b.svg.getScreenCTM().inverse());
  const x = opt.x[0] + q.x * (opt.x[1] - opt.x[0]) / b.W;
  const y = opt.y[1] - q.y * (opt.y[1] - opt.y[0]) / b.H;
  const g = [Math.round(x), Math.round(y)];
  const ok = g[0] >= 0 && g[0] <= cols && g[1] >= 0 && g[1] <= rows && Math.hypot(x - g[0], y - g[1]) < 0.4;
  return ok ? g : null;
}

/* 第 10 页：例 2，4×5 方格纸，A(0,1)，B(2,4) */
function initGrid() {
  const COLS = 5;
  const ROWS = 4;
  const A = [0, 1];
  const AB = [2, 3];
  const opt = { x: [-0.7, 5.7], y: [-0.6, 4.6], w: 500, axes: false, grid: false };
  const b = mkBoard('grid', opt);
  const s = { p: null, q: null, eq: new Set(), op: new Set(), showAll: false };
  const pts = [];
  for (let x = 0; x <= COLS; x += 1) for (let y = 0; y <= ROWS; y += 1) pts.push([x, y]);
  const inGrid = (p) => p[0] >= 0 && p[0] <= COLS && p[1] >= 0 && p[1] <= ROWS;
  const eqStarts = pts.filter((p) => inGrid(vecAdd(p, AB)));
  const opStarts = pts.filter((p) => inGrid(vecSub(p, AB)));
  const key = (p) => p.join(',');
  dashGrid(b, COLS, ROWS);
  eqStarts.forEach((p) => {
    vec(b, () => (s.eq.has(key(p)) && !same(p, A) ? [p, vecAdd(p, AB)] : null), { cls: 'v3 found' });
    b.pt(p, { cls: 'c3', r: 9, show: () => s.showAll });
  });
  opStarts.forEach((p) => vec(b, () => (s.op.has(key(p)) ? [p, vecSub(p, AB)] : null), { cls: 'v4 found' }));
  vec(b, [A, vecAdd(A, AB)], { cls: 'v1' });
  vec(b, () => (s.p && s.q && !same(s.p, s.q) ? [s.p, s.q] : null), { cls: 'v2' });
  b.pt(() => s.p, { cls: 'c2', r: 8 });
  b.text(A, 'A', { dx: -24, dy: 8 });
  b.text(vecAdd(A, AB), 'B', { dx: -6, dy: -12 });
  const judge = (p, q) => {
    const d = vecSub(q, p);
    if (same(p, A) && same(d, AB)) return ['', '这就是 $\\overrightarrow{AB}$ 本身，换一个起点试试。'];
    if (same(d, AB)) { s.eq.add(key(p)); return ['fb-ok', '<b>✓ 与 $\\overrightarrow{AB}$ 相等</b>：同样向右 2 格、向上 3 格。']; }
    if (same(d, vecMul(-1, AB))) { s.op.add(key(p)); return ['fb-ok', '<b>✓ 长度相等的共线向量</b>，但方向与 $\\overrightarrow{AB}$ 相反（不相等）。']; }
    if (len2(d) === 0) return ['fb-warn', '起点和终点重合，是零向量。'];
    if (cross(d, AB) === 0) return ['fb-warn', `与 $\\overrightarrow{AB}$ 共线，但长度 ${surd(len2(d))} ≠ √13。`];
    if (len2(d) === len2(AB)) return ['fb-warn', '长度也是 √13，但方向不同，不共线。'];
    return ['fb-warn', `不共线，长度 ${surd(len2(d))}，与 $\\overrightarrow{AB}$ 无关。`];
  };
  const show = (cls, html) => {
    $('gMsg').className = `tip feedback ${cls}`;
    $('gMsg').innerHTML = html;
    const ne = [...s.eq].filter((k) => k !== key(A)).length;
    $('gCount').innerHTML = `已找到：与 $\\overrightarrow{AB}$ 相等 <b>${ne}</b> / 7　｜　长度相等的共线向量 <b>${ne + s.op.size}</b> / 15`;
    tex($('gMsg')); tex($('gCount'));
    b.update();
  };
  b.svg.addEventListener('pointerdown', (e) => {
    const g = latticeAt(b, opt, e, COLS, ROWS);
    if (!g) return;
    if (!s.p || s.q) { s.p = g; s.q = null; show('', `起点 (${g.join(', ')})，再点终点。`); return; }
    s.q = g;
    show(...judge(s.p, s.q));
  });
  $('gShow').addEventListener('click', () => { s.showAll = !s.showAll; $('gShow').classList.toggle('solid', s.showAll); b.update(); });
  $('gClear').addEventListener('click', () => { s.p = null; s.q = null; s.eq.clear(); s.op.clear(); show('', '点一个格点作起点。'); });
  show('', '点一个格点作起点。');
  return { s, eqStarts, opStarts };
}

/* 第 12 页：练习 3 的方格图 */
function initPr3() {
  const b = mkBoard('pr3', { x: [-0.6, 6.6], y: [-0.6, 4.6], w: 420, axes: false, grid: false });
  dashGrid(b, 6, 4);
  const P = { A: [0, 1], B: [3, 4], C: [2, 0], D: [5, 2], E: [5, 4], F: [6, 1] };
  vec(b, [P.A, P.B], { cls: 'v1' }); vec(b, [P.C, P.D], { cls: 'v1' }); vec(b, [P.E, P.F], { cls: 'v1' });
  const OFF = { A: [-22, 8], B: [-6, -10], C: [-6, 24], D: [-20, -10], E: [-6, -10], F: [8, 16] };
  Object.entries(OFF).forEach(([nm, [dx, dy]]) => b.text(P[nm], nm, { dx, dy }));
  b.update();
}

/* 第 13 页：习题 7，点两个向量比较 */
const EX7 = { a: [[0, 0], [1, 2]], b: [[1, 2], [2, 3]], c: [[1, 2], [2, 0]], d: [[3, 3], [2, 1]], e: [[4, 2], [2, 0]] };
const EX7_SIDE = { a: 1, b: 1, c: -1, d: 1, e: -1 };
function initEx7() {
  const b = mkBoard('ex7', { x: [-0.5, 4.5], y: [-0.5, 3.5], w: 420, axes: false, grid: false });
  const s = { sel: [] };
  dashGrid(b, 4, 3);
  Object.entries(EX7).forEach(([nm, seg]) => {
    vec(b, seg, { cls: 'v1', label: nm, side: EX7_SIDE[nm] });
    vec(b, () => (s.sel.includes(nm) ? seg : null), { cls: 'v2' }); // 选中的向量改成橙色
  });
  const comp = (nm) => vecSub(EX7[nm][1], EX7[nm][0]);
  const msg = () => {
    if (s.sel.length < 2) return ['', s.sel.length ? `已选 $\\boldsymbol ${s.sel[0]}$，再点一个。` : '点两个向量，比一比它们的关系。'];
    const [p, q] = s.sel;
    const r = relation(comp(p), comp(q)).text.replaceAll('\\boldsymbol a', '@P').replaceAll('\\boldsymbol b', '@Q').replaceAll('@P', `\\boldsymbol ${p}`).replaceAll('@Q', `\\boldsymbol ${q}`);
    const lens = `$|\\boldsymbol ${p}|=${surd(len2(comp(p))).replace('√', '\\sqrt')}$，$|\\boldsymbol ${q}|=${surd(len2(comp(q))).replace('√', '\\sqrt')}$。`;
    return ['fb-ok', `${r}<br>${lens}`];
  };
  const refresh = () => {
    const [cls, html] = msg();
    $('e7Msg').className = `tip feedback ${cls}`;
    $('e7Msg').innerHTML = html;
    tex($('e7Msg'));
    $('e7Btns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', s.sel.includes(x.dataset.k)));
    b.update();
  };
  $('e7Btns').innerHTML = Object.keys(EX7).map((nm) => `<button type="button" class="btn" data-k="${nm}">$\\boldsymbol ${nm}$</button>`).join('');
  tex($('e7Btns'));
  $('e7Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    const k = btn.dataset.k;
    s.sel = s.sel.length >= 2 || s.sel.includes(k) ? [k] : [...s.sel, k];
    refresh();
  });
  refresh();
}

window.LESSON = {
  init() {
    initIncline();
    initUnit();
    initPar();
    initCollinear();
    initHex();
    window.__shift = initShift();
    window.__grid = initGrid();
    initPr3();
    initEx7();
  },
  // 箭头与文字按屏幕像素计算，翻到本页（转场缩放结束后）重新量一次
  onRender(slide) {
    const redraw = () => boards.forEach((b) => { if (slide.contains(b.svg)) b.update(); });
    requestAnimationFrame(redraw);
    setTimeout(redraw, 750);
  },
};
