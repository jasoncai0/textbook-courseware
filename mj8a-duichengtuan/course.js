'use strict';
/* 八上 2.3 设计轴对称图案 · 本课互动：方格纸对称设计板、涂色数对称轴（3×3、4×4 三色）、纸片旋转拼图、剪纸展开、琴键对称检验。
 * 通用部分见 ../shared/math.js、mgeo.js、mfold.js；所有“是否对称”都由程序把图形翻折后逐点（逐格、逐个多边形）比对得出。 */
const { add, rot, line } = Geo;
const { reflect, move, same, tween } = MFold;
const $ = (id) => document.getElementById(id);
const HIDE = [[-99, -99], [-99, -99]];
const toWorld = (b, e, x0, y1) => {
  const pt = b.svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  const q = pt.matrixTransform(b.svg.getScreenCTM().inverse());
  const sx = b.X(1) - b.X(0);
  return [q.x / sx + x0, y1 - q.y / sx];
};
const msgTo = (id, t, c = '') => { $(id).className = `tip feedback ${c}`; $(id).innerHTML = t; };

/* ---------- 第 3 页：方格纸对称设计板（对称轴 x = 6） ---------- */
const AXIS_X = 6;
const DEMO = [
  [[6, 9], [5, 10], [4, 9], [5, 8], [6, 9]], [[6, 9], [4, 8], [5, 7], [6, 8]],
  [[6, 8], [6, 4]], [[6, 5], [4, 6], [2, 7], [3, 5], [6, 5]],
  [[6, 4], [3, 4], [4, 1], [6, 1]],
];
function initPad() {
  const W = 12; const H = 11;
  const s = { strokes: [[]] };
  const b = Geo.board($('pad'), { x: [-0.3, W + 0.3], y: [-0.3, H + 0.3], w: 560 });
  for (let x = 0; x <= W; x++) b.seg([[x, 0], [x, H]], { cls: 'gridl' });
  for (let y = 0; y <= H; y++) b.seg([[0, y], [W, y]], { cls: 'gridl' });
  b.seg([[AXIS_X, -0.2], [AXIS_X, H + 0.2]], { cls: 'axis-l' });
  const MAXSEG = 80;
  const segs = () => s.strokes.flatMap((st) => st.slice(1).map((p, i) => [st[i], p]));
  Array.from({ length: MAXSEG }, (_, i) => {
    b.seg(() => segs()[i] || HIDE, { cls: 'c1' });
    b.seg(() => (segs()[i] ? segs()[i].map((p) => reflect(p, [AXIS_X, 0], [AXIS_X, 1])) : HIDE), { cls: 'c2' });
    return i;
  });
  b.pt(() => { const st = s.strokes[s.strokes.length - 1]; return st[st.length - 1] || null; }, { show: () => s.strokes[s.strokes.length - 1].length > 0, r: 6, cls: 'c2' });
  b.svg.addEventListener('pointerdown', (e) => {
    const p = toWorld(b, e, -0.3, H + 0.3).map((v) => Math.round(v));
    if (p[0] < 0 || p[0] > AXIS_X || p[1] < 0 || p[1] > H) { msgTo('padMsg', '请在对称轴<b>左边</b>（含轴上）点格点。', 'fb-warn'); return; }
    const cur = s.strokes[s.strokes.length - 1];
    if (segs().length >= MAXSEG) return;
    s.strokes = [...s.strokes.slice(0, -1), [...cur, p]];
    msgTo('padMsg', `已画 ${segs().length} 段；点“新的一笔”可以另起一笔。`);
    b.update();
  });
  $('padNew').addEventListener('click', () => { if (s.strokes[s.strokes.length - 1].length) s.strokes = [...s.strokes, []]; b.update(); });
  $('padUndo').addEventListener('click', () => {
    const cur = s.strokes[s.strokes.length - 1];
    s.strokes = cur.length ? [...s.strokes.slice(0, -1), cur.slice(0, -1)] : (s.strokes.length > 1 ? s.strokes.slice(0, -1) : [[]]);
    b.update();
  });
  $('padClr').addEventListener('click', () => { s.strokes = [[]]; b.update(); });
  $('padDemo').addEventListener('click', () => { s.strokes = [...DEMO.map((st) => [...st]), []]; msgTo('padMsg', '示例“盆花”：只画了左边的花瓣、叶子和花盆，右边由对称自动画出。', 'fb-ok'); b.update(); });
  b.update();
}

/* ---------- 涂色网格：n×n，检验横、竖、两条对角线 ---------- */
const CAND = (n) => [
  { name: '竖直中线', f: (i, j) => [n - 1 - i, j], seg: [[n / 2, -0.4], [n / 2, n + 0.4]] },
  { name: '水平中线', f: (i, j) => [i, n - 1 - j], seg: [[-0.4, n / 2], [n + 0.4, n / 2]] },
  { name: '对角线', f: (i, j) => [j, i], seg: [[-0.3, -0.3], [n + 0.3, n + 0.3]] },
  { name: '另一条对角线', f: (i, j) => [n - 1 - j, n - 1 - i], seg: [[-0.3, n + 0.3], [n + 0.3, -0.3]] },
];
function colorGrid(id, n, opt) {
  const s = { c: opt.init ? opt.init() : {}, pen: 'r' };
  const b = Geo.board($(id), { x: [-0.6, n + 0.6], y: [-0.6, n + 0.6], w: 360 });
  const key = (i, j) => `${i},${j}`;
  const axes = () => CAND(n).filter((a) => {
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const [u, v] = a.f(i, j);
      if ((s.c[key(i, j)] || '') !== (s.c[key(u, v)] || '')) return false;
    }
    return true;
  });
  const cells = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const p = b.poly([[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], { cls: 'cell' });
    p.addEventListener('click', () => {
      const k = key(i, j);
      const want = opt.palette ? s.pen : 'r';
      s.c = { ...s.c, [k]: s.c[k] === want || !want ? '' : want };
      b.update();
    });
    cells.push([key(i, j), p]);
  }
  CAND(n).forEach((a) => line(b, () => (axes().includes(a) ? a.seg[0] : [-99, -99]), () => (axes().includes(a) ? a.seg[1] : [-99, -98]), { cls: 'axis-all' }));
  b.onUpdate = () => {
    cells.forEach(([k, p]) => { p.setAttribute('class', `cell ${s.c[k] || ''}`); });
    opt.report(axes(), Object.values(s.c).filter(Boolean).length);
  };
  b.update();
  return {
    set(c) { s.c = { ...c }; b.update(); },
    pen(p) { s.pen = p; },
  };
}
const fromList = (list, col = 'r') => Object.fromEntries(list.map(([i, j]) => [`${i},${j}`, col]));

function initColor3() {
  // 图 2-13：(1) 右上、左下涂色；(2) 上中、右中涂色（i 为列，j 为行，从左下数起）
  const PRE = [fromList([[2, 2], [0, 0]]), fromList([[1, 2], [2, 1]]), {}];
  const g = colorGrid('c3', 3, {
    init: () => PRE[0],
    report: (ax, cnt) => msgTo('c3Msg', ax.length ? `有 ${ax.length} 条对称轴：${ax.map((a) => a.name).join('、')}（绿色虚线）。` : `涂了 ${cnt} 格，现在没有对称轴。`, ax.length === 4 ? 'fb-ok' : ''),
  });
  $('c3Pre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('c3Pre').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    g.set(PRE[+btn.dataset.k]);
  });
}

function initColor4() {
  const g = colorGrid('c4', 4, {
    palette: true,
    report: (ax, cnt) => {
      const ok = cnt === 8 && ax.length === 2;
      msgTo('c4Msg', `已涂 ${cnt} 格（要求 8 格），对称轴 ${ax.length} 条（要求 2 条）。${ok ? '完成！' : ''}`, ok ? 'fb-ok' : '');
    },
  });
  $('c4Pal').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-c]');
    if (!btn) return;
    $('c4Pal').querySelectorAll('[data-c]').forEach((x) => x.classList.toggle('solid', x === btn));
    g.pen(btn.dataset.c);
  });
  $('c4Clr').addEventListener('click', () => g.set({}));
}

/* ---------- 第 5 页：四张纸片 ---------- */
// 图 2-14 纸片（单位正方形）：紫色“V”形六边形，k 表示逆时针转 k×90°（k = 0 时 V 朝下）
const V = [[0, 1], [0.5, 0.5], [1, 1], [1, 0.5], [0.5, 0], [0, 0.5]];
const tilePoly = (k, ox, oy) => V.map((p) => add(rot(p, 90 * k, [0.5, 0.5]), [ox, oy]));
const TPRE = [[0, 0, 0, 0], [2, 2, 0, 0], [2, 1, 3, 0]]; // 左上、右上、左下、右下
const POS = [[0, 1], [1, 1], [0, 0], [1, 0]];
const T_AX = [
  { name: '竖直中线', P: [1, 0], Q: [1, 2] }, { name: '水平中线', P: [0, 1], Q: [2, 1] },
  { name: '对角线', P: [0, 0], Q: [2, 2] }, { name: '另一条对角线', P: [0, 2], Q: [2, 0] },
];
function tileAxes(ks) {
  const polys = ks.map((k, i) => tilePoly(k, ...POS[i]));
  return T_AX.filter((a) => polys.every((pg) => {
    const r = pg.map((p) => reflect(p, a.P, a.Q));
    return polys.some((q) => same(r, q, 1e-6));
  }));
}
function initTiles() {
  const s = { ks: [...TPRE[0]] };
  const b = Geo.board($('tiles'), { x: [-0.3, 2.3], y: [-0.3, 2.3], w: 360 });
  POS.forEach(([ox, oy], i) => {
    const bg = b.poly([[ox, oy], [ox + 1, oy], [ox + 1, oy + 1], [ox, oy + 1]], { cls: 'tile-bg' });
    const fg = b.poly(() => tilePoly(s.ks[i], ox, oy), { cls: 'tile-v' });
    [bg, fg].forEach((el) => el.addEventListener('click', () => { s.ks = s.ks.map((k, j) => (j === i ? (k + 1) % 4 : k)); b.update(); }));
  });
  T_AX.forEach((a) => line(b, () => (tileAxes(s.ks).includes(a) ? a.P : [-99, -99]), () => (tileAxes(s.ks).includes(a) ? a.Q : [-99, -98]), { cls: 'axis-all' }));
  b.onUpdate = () => {
    const ax = tileAxes(s.ks);
    msgTo('tMsg', ax.length ? `是轴对称图形，有 ${ax.length} 条对称轴：${ax.map((a) => a.name).join('、')}。` : '不是轴对称图形。', ax.length ? 'fb-ok' : '');
  };
  $('tPre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('tPre').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    s.ks = [...TPRE[+btn.dataset.k]];
    b.update();
  });
  b.update();
}

/* ---------- 第 6 页：剪纸（折痕 x = 0，纸在右边） ---------- */
const CUP = [[0, 7], [3, 7], [3, 6], [2, 4], [1, 3], [1, 2], [2, 1], [2, 0], [0, 0]];
function initCut() {
  const W = 5; const H = 8;
  const s = { pts: [], t: 0, open: false };
  const b = Geo.board($('cut'), { x: [-W - 0.4, W + 0.4], y: [-0.4, H + 0.4], w: 440 });
  for (let x = 0; x <= W; x++) b.seg([[x, 0], [x, H]], { cls: 'gridl' });
  for (let y = 0; y <= H; y++) b.seg([[0, y], [W, y]], { cls: 'gridl' });
  b.poly([[0, 0], [W, 0], [W, H], [0, H]], { cls: 'paper' });
  const FOLD = [[0, 0], [0, 1]];
  const closed = () => s.pts.length >= 3 && s.pts[0][0] === 0 && s.pts[s.pts.length - 1][0] === 0;
  b.poly(() => (s.open ? s.pts : HIDE), { cls: 'cutp' });
  b.poly(() => (s.open ? move(s.pts, { F: FOLD }, s.t).map((p) => p) : HIDE), { cls: 'cutp' });
  const MAX = 40;
  Array.from({ length: MAX }, (_, i) => b.seg(() => (!s.open && s.pts[i + 1] ? [s.pts[i], s.pts[i + 1]] : HIDE), { cls: 'c1' }));
  b.pt(() => s.pts[s.pts.length - 1] || null, { show: () => !s.open && s.pts.length > 0, r: 6, cls: 'c2' });
  b.seg([[0, -0.3], [0, H + 0.3]], { cls: 'axis-l' });
  b.svg.addEventListener('pointerdown', (e) => {
    if (s.open) return;
    const p = toWorld(b, e, -W - 0.4, H + 0.4).map((v) => Math.round(v));
    if (p[0] < 0 || p[0] > W || p[1] < 0 || p[1] > H || s.pts.length >= MAX) return;
    s.pts = [...s.pts, p];
    msgTo('cutMsg', closed() ? '轮廓两端都在折痕上了，可以“剪下 · 展开”。' : `已点 ${s.pts.length} 个点。${s.pts[0][0] === 0 ? '' : '第一个点要在折痕上！'}`);
    b.update();
  });
  let stop = () => {};
  $('cutUndo').addEventListener('click', () => { if (!s.open) { s.pts = s.pts.slice(0, -1); b.update(); } });
  $('cutClr').addEventListener('click', () => { stop(); s.pts = []; s.open = false; s.t = 0; msgTo('cutMsg', '在折痕右边依次点格点，画出图案的<b>一半</b>轮廓（从折痕上出发，回到折痕上），再点“剪下 · 展开”。'); b.update(); });
  $('cutDemo').addEventListener('click', () => { stop(); s.pts = CUP.map((p) => [...p]); s.open = false; s.t = 0; msgTo('cutMsg', '示例：奖杯的一半轮廓。点“剪下 · 展开”。'); b.update(); });
  $('cutGo').addEventListener('click', () => {
    if (!closed()) { msgTo('cutMsg', '轮廓的第一个点和最后一个点都要落在折痕（蓝色虚线）上，否则剪下来会断开。', 'fb-warn'); return; }
    stop(); s.open = true;
    stop = tween(1600, (t) => { s.t = t; b.update(); }, () => msgTo('cutMsg', '展开了！得到一个以折痕为对称轴的轴对称剪纸。', 'fb-ok'));
  });
  b.update();
}

/* ---------- 第 8 页：琴键 ---------- */
const KEYS = ['C', '♯C', 'D', '♭E', 'E', 'F', '♯F', 'G', '♭A', 'A', '♭B', 'B'];
const BLACK_AT = { 1: 1, 3: 2, 6: 4, 8: 5, 10: 6 }; // 黑键序号 → 骑在第几条白键分界线上
const WHITE_IDX = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
const BW = 0.3; const BH = 0.38;
function keyPoly(k) {
  if (BLACK_AT[k] !== undefined) { const x = BLACK_AT[k]; return [[x - BW, BH], [x + BW, BH], [x + BW, 1], [x - BW, 1]]; }
  const i = WHITE_IDX[k];
  const bl = Object.values(BLACK_AT).includes(i);
  const br = Object.values(BLACK_AT).includes(i + 1);
  return [[i, 0], [i + 1, 0], ...(br ? [[i + 1, BH], [i + 1 - BW, BH], [i + 1 - BW, 1]] : [[i + 1, 1]]), ...(bl ? [[i + BW, 1], [i + BW, BH], [i, BH]] : [[i, 1]])];
}
function rangeSym(a, z) {
  const polys = KEYS.map((_, k) => keyPoly(k)).slice(a, z + 1);
  const xs = polys.flat().map((p) => p[0]);
  const c = (Math.min(...xs) + Math.max(...xs)) / 2;
  return polys.every((pg) => polys.some((q) => same(pg.map((p) => reflect(p, [c, 0], [c, 1])), q, 1e-6)));
}
function initPiano() {
  const s = { a: null, z: null };
  const b = Geo.board($('piano'), { x: [-0.2, 7.2], y: [-0.35, 1.3], w: 560 });
  const sel = (k) => s.a !== null && k >= Math.min(s.a, s.z ?? s.a) && k <= Math.max(s.a, s.z ?? s.a);
  const order = [...KEYS.keys()].sort((p, q) => (BLACK_AT[p] !== undefined) - (BLACK_AT[q] !== undefined));
  const nodes = order.map((k) => {
    const p = b.poly(keyPoly(k), { cls: BLACK_AT[k] !== undefined ? 'kb' : 'kw' });
    p.addEventListener('click', () => {
      if (s.a === null || s.z !== null) { s.a = k; s.z = null; } else s.z = k;
      b.update();
    });
    return [k, p];
  });
  KEYS.forEach((n, k) => {
    const pg = keyPoly(k);
    const xs = pg.map((p) => p[0]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    b.text([cx, BLACK_AT[k] !== undefined ? 1.08 : -0.08], n, { cls: `lb up kn ${BLACK_AT[k] !== undefined ? 'top' : ''}`, dx: -6, dy: BLACK_AT[k] !== undefined ? 0 : 14 });
  });
  b.onUpdate = () => {
    nodes.forEach(([k, p]) => p.classList.toggle('on', sel(k)));
    if (s.a === null) { msgTo('pMsg', '点起点琴键。'); return; }
    if (s.z === null) { msgTo('pMsg', `起点 ${KEYS[s.a]}，再点终点琴键。`); return; }
    const [a, z] = [Math.min(s.a, s.z), Math.max(s.a, s.z)];
    const names = KEYS.slice(a, z + 1).join('、');
    const ok = rangeSym(a, z);
    msgTo('pMsg', `${names}：${ok ? '组成轴对称图形 ✓' : '不是轴对称图形'}`, ok ? 'fb-ok' : 'fb-warn');
  };
  b.update();
}

window.LESSON = {
  init() {
    initPad();
    initColor3();
    initTiles();
    initCut();
    initColor4();
    initPiano();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
