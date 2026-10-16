'use strict';
/* 八上 2.1 轴对称与轴对称图形 · 本课互动：墨水折纸、图 2-3 拖动对称三角形、拖折痕检验轴对称图形、两个全等三角形翻折拼图、正五边形画对角线数对称轴。
 * 通用部分见 ../shared/math.js、mgeo.js、mfold.js；对称都是精确的反射变换，判断“重合”用顶点坐标逐一比对。 */
const { add, sub, mul, dist, dir, centroid, line } = Geo;
const { reflect, move, same, tween } = MFold;
const $ = (id) => document.getElementById(id);
const HIDE = [[-99, -99], [-99, -99]];
const RAD = Math.PI / 180;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* ---------- 第 3 页：墨水折纸 ---------- */
function blob(c) {
  const n = 14;
  const r0 = 0.25 + Math.random() * 0.2;
  const ks = [0, 1, 2].map(() => Math.random() * 0.35);
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 360;
    const r = r0 * (1 + ks[0] * Math.sin(2 * a * RAD) + ks[1] * Math.cos(3 * a * RAD + 1) + ks[2] * Math.sin(5 * a * RAD));
    return add(c, mul(dir(a), r));
  });
}
function initInk() {
  const W = 8; const H = 4.6; const X = 4;
  const AX = [[X, 0], [X, 1]];
  const s = { blobs: [], t: 0, pressed: false };
  const b = Geo.board($('ink'), { x: [-0.3, W + 0.3], y: [-0.3, H + 0.3], w: 560 });
  b.poly([[0, 0], [X, 0], [X, H], [0, H]], { cls: 'paper' });
  const MAX = 6;
  Array.from({ length: MAX }, (_, i) => b.poly(() => s.blobs[i] || HIDE, { cls: 'inkb' }));
  // 右半张纸（会翻过来），以及印上去的墨迹
  b.poly(() => move([[X, 0], [W, 0], [W, H], [X, H]], { F: AX }, s.t), { cls: 'paper r' });
  Array.from({ length: MAX }, (_, i) => b.poly(() => (s.pressed && s.blobs[i] ? move(s.blobs[i].map((p) => reflect(p, ...AX)), { F: AX }, s.t) : HIDE), { cls: 'inkb' }));
  b.seg([[X, -0.25], [X, H + 0.25]], { cls: 'axis-l' });
  b.svg.addEventListener('pointerdown', (e) => {
    if (s.t > 0 || s.pressed) return;
    const pt = b.svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(b.svg.getScreenCTM().inverse());
    const p = [q.x / (b.W / (W + 0.6)) - 0.3, H + 0.3 - q.y / (b.H / (H + 0.6))];
    if (p[0] < 0.3 || p[0] > X - 0.35 || p[1] < 0.3 || p[1] > H - 0.3 || s.blobs.length >= MAX) return;
    s.blobs = [...s.blobs, blob(p)];
    $('inkMsg').textContent = `已经滴了 ${s.blobs.length} 滴。滴好后点“折纸压平，再展开”。`;
    b.update();
  });
  let stop = () => {};
  $('inkGo').addEventListener('click', () => {
    if (!s.blobs.length) s.blobs = [blob([1.4, 3]), blob([2.6, 1.6]), blob([3.3, 3.4])];
    stop();
    s.pressed = false;
    stop = tween(1400, (t) => { s.t = t; b.update(); }, () => {
      s.pressed = true;
      $('inkMsg').textContent = '压平了！墨水印到了右半张纸上……';
      setTimeout(() => { stop = tween(1400, (t) => { s.t = 1 - t; b.update(); }, () => { $('inkMsg').className = 'tip feedback fb-ok'; $('inkMsg').textContent = '展开后，右边的墨迹与左边的墨迹沿折痕翻折能完全重合——它们关于折痕对称。'; }); }, 600);
    });
  });
  $('inkClr').addEventListener('click', () => { stop(); s.blobs = []; s.t = 0; s.pressed = false; $('inkMsg').className = 'tip feedback'; $('inkMsg').innerHTML = '先在纸的<b>左半边</b>点几下，滴上几滴墨水。'; b.update(); });
  b.update();
}

/* ---------- 第 4 页：图 2-3 ---------- */
function initF23() {
  const M = [[3, 0], [3, 1]];
  const s = { P: [[0.2, 0.6], [2.75, 1.9], [1.6, 2.6]], t: 0 };
  const b = Geo.board($('f23'), { x: [-0.4, 6.4], y: [-0.2, 3.6], w: 520 });
  const Q = () => s.P.map((p) => reflect(p, ...M));
  b.seg([[3, -0.1], [3, 3.5]], { cls: 'axis-l' });
  b.poly(Q, { cls: 'tri-b' });
  b.poly(() => s.P, { cls: 'tri-a' });
  b.poly(() => (s.t > 0 ? move(s.P, { F: M }, s.t) : HIDE), { cls: 'tri-m' });
  ['A', 'B', 'C'].forEach((n, i) => b.text(() => s.P[i], n, { dx: [-18, -4, -6][i], dy: [14, -10, -10][i] }));
  ['D', 'E', 'F'].forEach((n, i) => b.text(() => Q()[i], n, { dx: [6, -4, 2][i], dy: [14, -10, -10][i] }));
  b.text([3, 3.5], 'M', { dx: 6, dy: 14 });
  b.text([3, -0.1], 'N', { dx: 6, dy: 0 });
  s.P.forEach((_, i) => b.drag(() => s.P[i], (x, y) => { s.P = s.P.map((p, k) => (k === i ? [clamp(x, 0, 3), clamp(y, 0.1, 3.3)] : p)); }));
  let stop = () => {};
  const run = (to) => { stop(); const from = s.t; stop = tween(1500, (t) => { s.t = from + (to - from) * t; b.update(); }); };
  $('f23Go').addEventListener('click', () => run(1));
  $('f23Back').addEventListener('click', () => run(0));
  b.update();
}

/* ---------- 第 5 页：拖折痕检验轴对称图形 ---------- */
const PENT = Array.from({ length: 5 }, (_, i) => add([4, 3.1], mul(dir(90 + 72 * i), 2.3)));
const SHAPES = [
  { name: '字母 A', polys: [[[0.5, 1.5], [2.5, 1.5], [3, 2], [6, 2], [6.5, 1.5], [8.5, 1.5], [4.5, 5.5]], [[4, 3], [5, 3], [4.5, 3.5]]] },
  { name: '字母 K', polys: [[[2, 1.5], [2, 5.5], [4, 5.5], [4, 4.5], [5, 5.5], [8, 5.5], [6, 3.5], [8, 1.5], [5, 1.5], [4, 2.5], [4, 1.5]]] },
  { name: '字母 L', polys: [[[2, 0.5], [2, 5.5], [4, 5.5], [4, 2.5], [7, 2.5], [7, 0.5]]] },
  { name: '平行四边形', polys: [[[1, 1], [6, 1], [8, 4.5], [3, 4.5]]] },
  { name: '正五边形', polys: [PENT] },
  { name: '长方形', polys: [[[1.5, 1.5], [7.5, 1.5], [7.5, 4.5], [1.5, 4.5]]] },
];
const reflPolys = (polys, P, Q) => polys.map((pg) => pg.map((p) => reflect(p, P, Q)));
const isAxis = (polys, P, Q, eps = 1e-6) => {
  const R = reflPolys(polys, P, Q);
  return R.every((pg) => polys.some((pg2) => same(pg, pg2, eps)));
};
function axesOf(polys) {
  const pts = polys[0];
  const G = centroid(pts);
  const cands = [...pts, ...pts.map((p, i) => mul(add(p, pts[(i + 1) % pts.length]), 0.5))].filter((p) => dist(p, G) > 1e-6);
  const found = [];
  cands.forEach((p) => {
    const d = sub(p, G);
    const ang = ((Math.atan2(d[1], d[0]) / RAD) % 180 + 180) % 180;
    if (found.some((a) => Math.abs(a.ang - ang) < 0.5 || Math.abs(Math.abs(a.ang - ang) - 180) < 0.5)) return;
    if (isAxis(polys, G, p)) found.push({ ang, G, p });
  });
  return found;
}
function initTry() {
  const s = { k: 0, P: [4.5, 0.4], Q: [4.5, 6.2], t: 0, all: false };
  const b = Geo.board($('tryF'), { x: [-0.2, 9.2], y: [0, 6.6], w: 520 });
  const polys = () => SHAPES[s.k].polys;
  const MAXP = 2;
  for (let x = 0; x <= 9; x++) b.seg([[x, 0], [x, 6.6]], { cls: 'gridl' });
  for (let y = 0; y <= 6; y++) b.seg([[-0.2, y], [9.2, y]], { cls: 'gridl' });
  Array.from({ length: MAXP }, (_, i) => b.poly(() => polys()[i] || HIDE, { cls: i ? 'hole' : 'shape' }));
  Array.from({ length: MAXP }, (_, i) => b.poly(() => (s.t > 0 && polys()[i] ? move(polys()[i], { F: [s.P, s.Q] }, s.t) : HIDE), { cls: 'tri-m' }));
  Array.from({ length: 6 }, (_, i) => line(b, () => { const a = s.all && axesOf(polys())[i]; return a ? a.G : [-99, -99]; }, () => { const a = s.all && axesOf(polys())[i]; return a ? a.p : [-99, -98]; }, { cls: 'axis-all' }));
  line(b, () => s.P, () => s.Q, { cls: 'axis-l' });
  b.drag(() => s.P, (x, y) => { s.P = [clamp(x, 0, 9), clamp(y, 0, 6.6)]; s.t = 0; });
  b.drag(() => s.Q, (x, y) => { s.Q = [clamp(x, 0, 9), clamp(y, 0, 6.6)]; s.t = 0; });
  const msg = (t, c = '') => { $('tryMsg').className = `tip feedback ${c}`; $('tryMsg').innerHTML = t; };
  let stop = () => {};
  $('tryGo').addEventListener('click', () => {
    if (dist(s.P, s.Q) < 0.3) return;
    // 接近某条对称轴时吸附到准确位置
    const near = axesOf(polys()).find((a) => isAxis(polys(), s.P, s.Q, 0.35));
    if (near) {
      const u = mul(sub(near.p, near.G), 1 / dist(near.p, near.G));
      const c = Geo.foot(mul(add(s.P, s.Q), 0.5), near.G, near.p);
      s.P = sub(c, mul(u, 3.2)); s.Q = add(c, mul(u, 3.2));
    }
    stop();
    stop = tween(1500, (t) => { s.t = t; b.update(); }, () => {
      const ok = isAxis(polys(), s.P, s.Q);
      msg(ok ? `折过去完全重合！这条直线是${SHAPES[s.k].name}的对称轴。` : '折过去以后对不齐（橙色露在外面）——这条直线不是对称轴，再换一条试试。', ok ? 'fb-ok' : 'fb-warn');
    });
  });
  $('tryAll').addEventListener('click', () => {
    s.all = !s.all;
    const n = axesOf(polys()).length;
    msg(s.all ? (n ? `${SHAPES[s.k].name}共有 ${n} 条对称轴（绿色虚线）。` : `${SHAPES[s.k].name}没有对称轴，不是轴对称图形。`) : '拖动蓝色虚线两端的橙色点，摆一条你认为的对称轴。', s.all && n ? 'fb-ok' : '');
    b.update();
  });
  $('shpBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    stop();
    s.k = +btn.dataset.k; s.t = 0; s.all = false;
    $('shpBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    msg('拖动蓝色虚线两端的橙色点，摆一条你认为的对称轴，再点“沿这条线折”。');
    b.update();
  });
  b.update();
}

/* ---------- 第 6 页：两个全等三角形翻折 ---------- */
function initKite() {
  const A = [1.2, 0]; const B = [0, 2.2]; const C = [3, 2.6];
  const T = [A, B, C];
  const s = { m: null, t: 0, d: [0, 0] };
  const b = Geo.board($('kite'), { x: [-0.8, 6.8], y: [-1.6, 5.4], w: 480 });
  b.poly(T, { cls: 'tri-a' });
  const cur = () => {
    if (!s.m) return T;
    return move(T, s.m, s.t);
  };
  b.poly(cur, { cls: 'tri-m' });
  b.seg(() => (s.m && s.t > 0.99 ? (() => { const [P, Q] = s.m.F; const u = mul(sub(Q, P), 1 / dist(P, Q)); return [sub(P, mul(u, 1.6)), add(Q, mul(u, 1.6))]; })() : HIDE), { cls: 'axis-all' });
  [['A', A, [-4, 22]], ['B', B, [-18, 6]], ['C', C, [4, -6]]].forEach(([n, p, o]) => b.text(p, n, { dx: o[0], dy: o[1] }));
  let stop = () => {};
  const go = (m, d, txt) => {
    stop();
    s.m = m; s.d = d; s.t = 0;
    stop = tween(2000, (t) => { s.t = t; b.update(); }, () => { $('kiteMsg').className = 'tip feedback fb-ok'; $('kiteMsg').textContent = txt; });
  };
  const u = mul(sub(C, A), 1 / dist(A, C));
  const n = [u[1], -u[0]]; // AC 的法向，指向远离 B 的一侧
  const off = mul(n, Geo.dot(n, sub(A, B)) > 0 ? 0.9 : -0.9);
  $('kite1').addEventListener('click', () => go({ F: [A, C] }, [0, 0], '拼成的四边形是轴对称图形，对称轴是直线 AC。'));
  $('kite2').addEventListener('click', () => go({ F: [B, C] }, [0, 0], '拼成的图形也是轴对称图形，对称轴是直线 BC。'));
  $('kite3').addEventListener('click', () => go({ F: [add(A, off), add(C, off)] }, [0, 0], '两个三角形分开了，但仍关于绿色虚线对称——它们成轴对称；看成一个整体，也是轴对称图形。'));
  b.update();
}

/* ---------- 第 7 页：正五边形 + 对角线 ---------- */
function initPent() {
  const V = Array.from({ length: 5 }, (_, i) => mul(dir(90 + 72 * i), 2.2));
  const DIAG = [[1, 4], [0, 2], [0, 3], [1, 3], [2, 4]];
  const s = { on: new Set([]) };
  const b = Geo.board($('pent'), { x: [-3.4, 3.4], y: [-2.6, 3], w: 440 });
  const axes = () => [0, 1, 2, 3, 4].filter((k) => [...s.on].every((d) => {
    const [i, j] = DIAG[d];
    const m = (x) => ((2 * k - x) % 5 + 5) % 5;
    const img = [m(i), m(j)].sort().join();
    return [...s.on].some((e) => DIAG[e].slice().sort().join() === img);
  }));
  [0, 1, 2, 3, 4].forEach((k) => line(b, () => (axes().includes(k) ? [0, 0] : [-99, -99]), () => (axes().includes(k) ? V[k] : [-99, -98]), { cls: 'axis-all' }));
  b.poly(V, { cls: 'shape' });
  DIAG.forEach(([i, j], d) => {
    const vis = b.seg([V[i], V[j]], { cls: 'diag' });
    const hit = b.seg([V[i], V[j]], { cls: 'ghit' });
    hit.addEventListener('click', () => { s.on.has(d) ? s.on.delete(d) : s.on.add(d); vis.classList.toggle('on', s.on.has(d)); b.update(); });
  });
  b.onUpdate = () => { $('pentMsg').className = 'tip feedback fb-ok'; $('pentMsg').textContent = `已画 ${s.on.size} 条对角线：这个图形有 ${axes().length} 条对称轴（绿色虚线）。`; };
  b.update();
}

window.LESSON = {
  init() {
    initInk();
    initF23();
    initTry();
    initKite();
    initPent();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
