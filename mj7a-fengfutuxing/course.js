'use strict';
/* 七上 5.1 丰富的图形世界 · 本课互动：可旋转的常见几何体、n 棱柱 / n 棱锥、棱柱棱锥各部分、平面与曲面、
 * 正方体切去一块（面棱顶点由程序数出来）、七巧板拼图（覆盖检测）。
 * 3D 线框见 ../shared/solid3d.js（真实坐标正交投影，被挡住的线自动画虚线）；2D 见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const { add, sub, mul, dot } = Solid3D.vec;
const $ = (id) => document.getElementById(id);
const views = [];
const boards = [];
const mkView = (id, opt) => { const v = Solid3D.view($(id), opt); views.push(v); return v; };

const regular = (n, R, rot = 0) => Array.from({ length: n }, (_, i) => {
  const t = rot + (2 * Math.PI * i) / n;
  return [R * Math.cos(t), R * Math.sin(t), 0];
});
const centroid = (P) => mul(P.reduce(add, [0, 0, 0]), 1 / P.length);
function prismVF(B, T) {
  const n = B.length;
  return { V: [...B, ...T], F: [B.map((_, i) => n - 1 - i), T.map((_, i) => n + i), ...B.map((_, i) => [i, (i + 1) % n, n + ((i + 1) % n), n + i])] };
}
function pyramidVF(B, S) {
  const n = B.length;
  return { V: [...B, S], F: [B.map((_, i) => n - 1 - i), ...B.map((_, i) => [i, (i + 1) % n, n])] };
}
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});
// 屏幕上的右、上方向（世界坐标），用来画球的轮廓圆面
const screenAxes = (v) => {
  const y = (v.state.yaw * Math.PI) / 180;
  const p = (v.state.pitch * Math.PI) / 180;
  return [[Math.cos(y), -Math.sin(y), 0], [Math.sin(y) * Math.sin(p), Math.cos(y) * Math.sin(p), Math.cos(p)]];
};

/* 常见几何体（第 3、7 页共用）：返回在视图 v 上画出该几何体的函数 */
const SHAPES = {
  cyl: (v) => v.revolve(() => ({ r1: 0.9, r2: 0.9, h: 2, at: [0, 0, 0] })),
  cone: (v) => v.revolve(() => ({ r1: 1.05, r2: 0, h: 2, at: [0, 0, 0] })),
  cube: (v) => v.solid(() => prismVF([[-0.85, -0.85, 0], [0.85, -0.85, 0], [0.85, 0.85, 0], [-0.85, 0.85, 0]], [[-0.85, -0.85, 1.7], [0.85, -0.85, 1.7], [0.85, 0.85, 1.7], [-0.85, 0.85, 1.7]])),
  cuboid: (v) => v.solid(() => prismVF([[-1.3, -0.55, 0], [1.3, -0.55, 0], [1.3, 0.55, 0], [-1.3, 0.55, 0]], [[-1.3, -0.55, 1.1], [1.3, -0.55, 1.1], [1.3, 0.55, 1.1], [-1.3, 0.55, 1.1]])),
  ball: (v) => v.sphere(() => ({ c: [0, 0, 1], r: 1 })),
};

/* 第 3 页：五个常见几何体（可旋转） */
function initGallery() {
  [['g1', 'cyl'], ['g2', 'cone'], ['g3', 'cube'], ['g4', 'cuboid'], ['g5', 'ball']].forEach(([id, k]) => {
    const v = mkView(id, { w: 260, h: 240, scale: 68, yaw: -28, pitch: 20, center: [0, 0, k === 'cuboid' ? 0.6 : 1] });
    SHAPES[k](v);
    v.update();
  });
}

/* 第 8 页：练一练 2 的五个几何体 */
function initKinds() {
  const mk = (id, draw, c = [0, 0, 1]) => { const v = mkView(id, { w: 240, h: 240, scale: 64, yaw: -28, pitch: 20, center: c }); draw(v); v.update(); };
  mk('k1', (v) => v.solid(() => pyramidVF(regular(3, 1.25, -Math.PI / 6), [0, 0, 1.9])));
  mk('k2', SHAPES.ball);
  mk('k3', SHAPES.cyl);
  mk('k4', SHAPES.cone);
  mk('k5', (v) => v.solid(() => prismVF([[-0.55, -0.55, 0], [0.55, -0.55, 0], [0.55, 0.55, 0], [-0.55, 0.55, 0]], [[-0.55, -0.55, 2.2], [0.55, -0.55, 2.2], [0.55, 0.55, 2.2], [-0.55, 0.55, 2.2]])), [0, 0, 1.1]);
}

/* 第 4 页：n 棱柱 / n 棱锥 */
function initPP() {
  const s = { n: 4, kind: 'prism' };
  const H = 2.3;
  const v = mkView('pp', { w: 560, h: 440, scale: 100, yaw: -26, pitch: 20, center: [0, 0, 1.15] });
  const B = () => regular(s.n, 1.35, s.n === 4 ? Math.PI / 4 : Math.PI / 2);
  const T = () => B().map((p) => add(p, [0, 0, H]));
  v.face(B, { cls: 'f2' });
  v.face(T, { cls: 'f2', show: () => s.kind === 'prism' });
  v.solid(() => (s.kind === 'prism' ? prismVF(B(), T()) : pyramidVF(B(), [0, 0, H])));
  v.update();
  const name = () => `${'零一二三四五六七八'[s.n]}${s.kind === 'prism' ? '棱柱' : '棱锥'}`;
  const show = () => { $('ppName').textContent = name(); v.update(); };
  slider($('ppN'), (n) => { s.n = n; $('ppNV').textContent = `${n} 边形`; show(); });
  btnGroup($('ppKind'), (k) => { s.kind = k; show(); });
}

/* 第 5 页：棱柱、棱锥各部分名称（图 5-4） */
function initParts() {
  const s = { hl: '' };
  const on = (k) => () => s.hl === k;
  const H = 2.3;
  const vp = mkView('partP', { w: 400, h: 400, scale: 86, yaw: -22, pitch: 22, center: [0, 0, 1.15] });
  const B = regular(6, 1.2, 0);
  const T = B.map((p) => add(p, [0, 0, H]));
  vp.face(B, { cls: 'f1', show: on('di') });
  vp.face(T, { cls: 'f1', show: on('di') });
  vp.face([B[4], B[5], T[5], T[4]], { cls: 'f2', show: on('ce') });
  vp.solid(() => prismVF(B, T));
  B.forEach((p, i) => vp.seg([p, T[i]], { cls: 'c2', show: on('cl') }));
  B.forEach((p, i) => { vp.seg([p, B[(i + 1) % 6]], { cls: 'c1', show: on('dl') }); vp.seg([T[i], T[(i + 1) % 6]], { cls: 'c1', show: on('dl') }); });
  [...B, ...T].forEach((p) => vp.dot(p, { cls: 'c2', show: on('dd'), r: 6 }));
  vp.update();

  const vq = mkView('partQ', { w: 400, h: 400, scale: 86, yaw: -22, pitch: 22, center: [0, 0, 1.15] });
  const Q = regular(5, 1.3, Math.PI / 2);
  const S = [0, 0, 2.5];
  vq.face(Q, { cls: 'f1', show: on('di') });
  vq.face([Q[4], Q[0], S], { cls: 'f2', show: on('ce') });
  vq.solid(() => pyramidVF(Q, S));
  Q.forEach((p) => vq.seg([p, S], { cls: 'c2', show: on('cl') }));
  Q.forEach((p, i) => vq.seg([p, Q[(i + 1) % 5]], { cls: 'c1', show: on('dl') }));
  vq.dot(S, { cls: 'c2', show: on('dd'), r: 7 });
  vq.label(S, '顶点', { cls: 'up', dx: 10, dy: -4, show: on('dd') });
  vq.update();

  const TIP = {
    di: '棱柱有上、下两个底面，是相同的多边形；棱锥只有一个底面。',
    ce: '直棱柱的侧面都是长方形；棱锥的侧面都是三角形。',
    cl: '相邻两个侧面的交线叫做侧棱。棱柱的侧棱长相等；棱锥的各侧棱交于一点。',
    dl: '任何相邻两个面的交线都叫做棱：图中蓝色的是底面上的棱，再加上侧棱就是全部的棱。',
    dd: '棱柱：棱与棱的交点叫做顶点；棱锥：各侧棱的公共点叫做棱锥的顶点。',
  };
  btnGroup($('partBtns'), (k) => {
    s.hl = k;
    $('partTip').textContent = TIP[k];
    vp.update(); vq.update();
  });
}

/* 第 6 页：数一数 n 棱柱 / n 棱锥的面、棱、顶点 */
function initCount() {
  const s = { n: 3 };
  const v1 = mkView('cntP', { w: 320, h: 300, scale: 66, yaw: -24, pitch: 22, center: [0, 0, 1] });
  const v2 = mkView('cntQ', { w: 320, h: 300, scale: 66, yaw: -24, pitch: 22, center: [0, 0, 1] });
  const B = () => regular(s.n, 1.2, Math.PI / 2);
  const T = () => B().map((p) => add(p, [0, 0, 2]));
  v1.solid(() => prismVF(B(), T()));
  v1.face(T, { cls: 'f1' }); v1.face(B, { cls: 'f1' });
  v2.solid(() => pyramidVF(B(), [0, 0, 2.2]));
  v2.face(B, { cls: 'f1' });
  slider($('cntN'), (n) => {
    s.n = n;
    $('cntNV').textContent = n;
    const cn = '零一二三四五六七八'[n];
    $('cntRow').innerHTML = `<td>${cn}棱柱</td><td>${n + 2}</td><td>${3 * n}</td><td>${2 * n}</td><td>${cn}棱锥</td><td>${n + 1}</td><td>${2 * n}</td><td>${n + 1}</td>`;
    v1.update(); v2.update();
  });
}

/* 第 7 页：平面与曲面、面线点 */
function initSurf() {
  const s = { k: 'cyl', hl: 'flat' };
  const v = mkView('surf', { w: 520, h: 420, scale: 112, yaw: -26, pitch: 22, center: [0, 0, 1] });
  const N = 48;
  const ring = (r, z) => Array.from({ length: N }, (_, i) => [r * Math.cos((2 * Math.PI * i) / N), r * Math.sin((2 * Math.PI * i) / N), z]);
  const is = (k, h) => () => s.k === k && s.hl === h;
  // 圆柱
  v.revolve(() => (s.k === 'cyl' ? { r1: 0.9, r2: 0.9, h: 2 } : null));
  v.face(() => ring(0.9, 0), { cls: 'f1', show: is('cyl', 'flat') });
  v.face(() => ring(0.9, 2), { cls: 'f1', show: is('cyl', 'flat') });
  for (let i = 0; i < N; i += 1) {
    const j = (i + 1) % N;
    v.face(() => { const a = ring(0.9, 0); const b = ring(0.9, 2); return [a[i], a[j], b[j], b[i]]; }, { cls: 'f2 thinf', show: is('cyl', 'curve') });
  }
  v.curve(() => ring(0.9, 0), { closed: true, cls: 'c2', show: is('cyl', 'line') });
  v.curve(() => ring(0.9, 2), { closed: true, cls: 'c2', show: is('cyl', 'line') });
  // 圆锥（复用上面 48 片的显示开关时，用另一组面片）
  v.revolve(() => (s.k === 'cone' ? { r1: 1.05, r2: 0, h: 2 } : null));
  v.face(() => ring(1.05, 0), { cls: 'f1', show: is('cone', 'flat') });
  v.curve(() => ring(1.05, 0), { closed: true, cls: 'c2', show: is('cone', 'line') });
  v.dot([0, 0, 2], { cls: 'c2', r: 7, show: is('cone', 'line') });
  // 正方体
  const C = [[-0.85, -0.85, 0], [0.85, -0.85, 0], [0.85, 0.85, 0], [-0.85, 0.85, 0]];
  const CT = C.map((p) => add(p, [0, 0, 1.7]));
  v.solid(() => prismVF(C, CT), { show: () => s.k === 'cube' });
  v.face(CT, { cls: 'f1', show: is('cube', 'flat') });
  v.face([C[0], C[1], CT[1], CT[0]], { cls: 'f1', show: is('cube', 'flat') });
  v.face([C[1], C[2], CT[2], CT[1]], { cls: 'f1', show: is('cube', 'flat') });
  v.seg([C[1], CT[1]], { cls: 'c2', show: is('cube', 'line') });
  v.seg([CT[0], CT[1]], { cls: 'c2', show: is('cube', 'line') });
  v.seg([CT[1], CT[2]], { cls: 'c2', show: is('cube', 'line') });
  v.dot(CT[1], { cls: 'c2', r: 7, show: is('cube', 'line') });
  // 球
  v.sphere(() => (s.k === 'ball' ? { c: [0, 0, 1], r: 1 } : null), { show: () => s.k === 'ball' });
  v.face(() => { const [R, U] = screenAxes(v); return Array.from({ length: 72 }, (_, i) => { const t = (2 * Math.PI * i) / 72; return add([0, 0, 1], add(mul(R, Math.cos(t)), mul(U, Math.sin(t)))); }); }, { cls: 'f2', show: is('ball', 'curve') });
  // 圆锥侧面高亮：用三角形面片
  for (let i = 0; i < N; i += 1) {
    v.face(() => { const a = ring(1.05, 0); return [a[i], a[(i + 1) % N], [0, 0, 2]]; }, { cls: 'f2 thinf', show: is('cone', 'curve') });
  }
  v.update();
  const TIP = {
    cyl: { flat: '圆柱的两个底面是平的（平面）。', curve: '圆柱的侧面是曲的（曲面）。', line: '底面与侧面相交，得到两条曲线（两个圆）。' },
    cone: { flat: '圆锥的底面是平的（平面）。', curve: '圆锥的侧面是曲的（曲面）。', line: '底面与侧面相交得到一条曲线；侧面收拢到顶上一点。' },
    cube: { flat: '正方体的 6 个面都是平的（图中高亮了看得见的 3 个）。', curve: '正方体没有曲面。', line: '相邻两个面相交得到棱（线），三条棱相交得到顶点（点）。' },
    ball: { flat: '球没有平面。', curve: '球只有一个面，是曲面。', line: '球的表面上没有面与面相交，所以没有棱、没有顶点。' },
  };
  const tip = () => { $('surfTip').textContent = TIP[s.k][s.hl]; v.update(); };
  btnGroup($('surfK'), (k) => { s.k = k; tip(); });
  btnGroup($('surfH'), (k) => { s.hl = k; tip(); });
  tip();
}

/* 第 9 页：正方体切去一块（习题 3）。用平面截凸多面体，面、棱、顶点由程序数出来 */
const R6 = (x) => Math.round(x * 1e6) / 1e6;
const same = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 1e-7;
function clipConvex(V, F, n, d) { // 保留 n·X ≤ d 的部分
  const side = (p) => dot(n, p) - d;
  const faces = [];
  const cap = [];
  F.forEach((f) => {
    const P = f.map((i) => V[i]);
    const out = [];
    P.forEach((a, i) => {
      const b = P[(i + 1) % P.length];
      const sa = side(a);
      const sb = side(b);
      if (sa <= 1e-9) out.push(a);
      if ((sa < -1e-9 && sb > 1e-9) || (sa > 1e-9 && sb < -1e-9)) {
        const t = sa / (sa - sb);
        out.push(add(a, mul(sub(b, a), t)));
      }
    });
    const clean = out.filter((p, i) => !same(p, out[(i + 1) % out.length]));
    clean.forEach((p) => { if (Math.abs(side(p)) < 1e-9) cap.push(p); });
    if (clean.length >= 3) faces.push(clean);
  });
  const uniq = cap.filter((p, i) => cap.findIndex((q) => same(p, q)) === i);
  if (uniq.length >= 3) {
    const c = centroid(uniq);
    const u = sub(uniq[0], c);
    const w = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
    uniq.sort((a, b) => Math.atan2(dot(sub(a, c), w), dot(sub(a, c), u)) - Math.atan2(dot(sub(b, c), w), dot(sub(b, c), u)));
    faces.push(uniq);
  }
  // 合并为 V、F
  const NV = [];
  const idx = (p) => { let i = NV.findIndex((q) => same(p, q)); if (i < 0) { NV.push(p.map(R6)); i = NV.length - 1; } return i; };
  const NF = faces.map((P) => P.map(idx));
  const edges = new Set();
  NF.forEach((f) => f.forEach((x, i) => { const y = f[(i + 1) % f.length]; edges.add(x < y ? `${x}-${y}` : `${y}-${x}`); }));
  return { V: NV, F: NF, cap: uniq, counts: { F: NF.length, E: edges.size, V: NV.length } };
}
const CUBE = prismVF([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]], [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]);
// 被切的是右前上角 (1,0,1)；三个点确定截面
const CUTS = {
  1: null,
  2: [[0.5, 0, 1], [1, 0.5, 1], [1, 0, 0.5]],
  3: [[0.5, 0, 1], [1, 1, 1], [1, 0, 0.5]],
  4: [[0.5, 0, 1], [1, 1, 1], [1, 0, 0]],
  5: [[0, 0, 1], [1, 1, 1], [1, 0, 0]],
};
function cutCube(k) {
  const P = CUTS[k];
  if (!P) return { V: CUBE.V, F: CUBE.F, cap: null, counts: { F: 6, E: 12, V: 8 } };
  let n = (([a, b, c]) => { const u = sub(b, a); const w = sub(c, a); return [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]]; })(P);
  let d = dot(n, P[0]);
  if (dot(n, [1, 0, 1]) < d) { n = mul(n, -1); d = -d; } // 让被切掉的角 (1,0,1) 在 n·X > d 一侧
  return clipConvex(CUBE.V, CUBE.F, n, d);
}
function initCut() {
  const s = { k: '2', seen: {} };
  const v = mkView('cut', { w: 460, h: 420, scale: 190, yaw: -32, pitch: 24, center: [0.5, 0.5, 0.5] });
  const cur = () => cutCube(s.k);
  v.face(() => cur().cap || [], { cls: 'f2', show: () => !!cur().cap });
  v.solid(() => ({ V: cur().V, F: cur().F }));
  v.update();
  const render = () => {
    const c = cur().counts;
    s.seen[s.k] = c;
    $('cutRead').innerHTML = `面 <b>${c.F}</b> 个　棱 <b>${c.E}</b> 条　顶点 <b>${c.V}</b> 个`;
    $('cutTab').querySelectorAll('[data-col]').forEach((td) => {
      const r = s.seen[td.dataset.col];
      td.textContent = r ? r[td.dataset.row] : '';
    });
    v.update();
  };
  btnGroup($('cutBtns'), (k) => { s.k = k; render(); });
  render();
}

/* 第 10 页：七巧板。边长 4 的正方形分成 7 块（坐标精确：小三角形直角边 √2、正方形边长 √2 …） */
const TANGRAM = [
  { name: '大三角形', pts: [[0, 0], [4, 0], [2, 2]], cls: 'tg1' },
  { name: '大三角形', pts: [[0, 0], [2, 2], [0, 4]], cls: 'tg2' },
  { name: '中三角形', pts: [[2, 4], [4, 4], [4, 2]], cls: 'tg3' },
  { name: '小三角形', pts: [[3, 1], [4, 0], [4, 2]], cls: 'tg4' },
  { name: '小三角形', pts: [[1, 3], [2, 2], [3, 3]], cls: 'tg5' },
  { name: '正方形', pts: [[2, 2], [3, 1], [4, 2], [3, 3]], cls: 'tg6' },
  { name: '平行四边形', pts: [[0, 4], [1, 3], [3, 3], [2, 4]], cls: 'tg7' },
];
const r2 = Math.SQRT2;
const TARGETS = {
  sq2: { pts: [[1, 2], [1 + r2, 2], [1 + r2, 2 + r2], [1, 2 + r2]], n: [2], tip: '用 2 块拼一个正方形' },
  rect3: { pts: [[0.5, 2], [0.5 + 2 * r2, 2], [0.5 + 2 * r2, 2 + r2], [0.5, 2 + r2]], n: [3], tip: '用 3 块拼一个长方形' },
  tri3: { pts: [[0.5, 1.5], [4.5, 1.5], [2.5, 3.5]], n: [3], tip: '用 3 块拼一个三角形' },
  tri45: { pts: [[0.5, 0.5], [4.5, 0.5], [0.5, 4.5]], n: [4, 5], tip: '用 4 块或 5 块拼一个三角形' },
  full: { pts: [[0.5, 0.5], [4.5, 0.5], [4.5, 4.5], [0.5, 4.5]], n: [7], tip: '用全部 7 块拼回正方形' },
};
const pip = (p, P) => { // 严格在多边形内（不含边界附近 1e-6）
  let inside = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i, i += 1) {
    if ((P[i][1] > p[1]) !== (P[j][1] > p[1]) && p[0] < ((P[j][0] - P[i][0]) * (p[1] - P[i][1])) / (P[j][1] - P[i][1]) + P[i][0]) inside = !inside;
  }
  return inside;
};
const c2 = (P) => [P.reduce((a, p) => a + p[0], 0) / P.length, P.reduce((a, p) => a + p[1], 0) / P.length];
function initTangram() {
  const OFF = [10.2, 0.5];
  const s = {
    target: 'tri3',
    sel: 0,
    pcs: TANGRAM.map((p) => ({ rot: 0, flip: false, pos: c2(p.pts).map((x, i) => x + OFF[i]) })),
  };
  const world = (i) => {
    const P = TANGRAM[i].pts;
    const c0 = c2(P);
    const { rot, flip, pos } = s.pcs[i];
    const a = (rot * Math.PI) / 4;
    return P.map(([x, y]) => {
      let dx = x - c0[0];
      const dy = y - c0[1];
      if (flip) dx = -dx;
      return [pos[0] + dx * Math.cos(a) - dy * Math.sin(a), pos[1] + dx * Math.sin(a) + dy * Math.cos(a)];
    });
  };
  const b = board($('tg'), { x: [-0.3, 14.7], y: [-0.3, 5.3], axes: false, grid: false, w: 760 });
  boards.push(b);
  b.poly(() => TARGETS[s.target].pts, { cls: 'tgt' });
  const polys = TANGRAM.map((p, i) => b.poly(() => world(i), { cls: `tgp ${p.cls}` }));
  polys.forEach((el, i) => el.addEventListener('pointerdown', () => { s.sel = i; b.update(); }));
  const snap = (i) => {
    const mine = world(i);
    const others = [...TARGETS[s.target].pts, ...s.pcs.flatMap((_, j) => (j === i ? [] : world(j)))];
    let best = null;
    mine.forEach((p) => others.forEach((q) => {
      const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
      if (d < 0.32 && (!best || d < best.d)) best = { d, dx: q[0] - p[0], dy: q[1] - p[1] };
    }));
    if (best) s.pcs = s.pcs.map((pc, j) => (j === i ? { ...pc, pos: [pc.pos[0] + best.dx, pc.pos[1] + best.dy] } : pc));
  };
  TANGRAM.forEach((_, i) => b.drag(() => s.pcs[i].pos, (x, y) => {
    s.sel = i;
    s.pcs = s.pcs.map((pc, j) => (j === i ? { ...pc, pos: [Math.min(14.3, Math.max(0, x)), Math.min(5, Math.max(0, y))] } : pc));
    snap(i);
  }, { r: 6, hit: 16 }));
  const check = () => {
    const T = TARGETS[s.target];
    const inT = s.pcs.map((_, i) => pip(c2(world(i)), T.pts));
    const used = inT.filter(Boolean).length;
    // 用到的每一块都要整块落在目标内：顶点在目标内或在边界上（往重心方向挪一点点再判断）
    const fullyIn = s.pcs.every((_, i) => !inT[i] || world(i).every((p) => { const c = c2(world(i)); return pip([p[0] + (c[0] - p[0]) * 0.02, p[1] + (c[1] - p[1]) * 0.02], T.pts); }));
    // 覆盖检测：目标内的采样点恰好被一块盖住
    const xs = T.pts.map((p) => p[0]);
    const ys = T.pts.map((p) => p[1]);
    let ok = fullyIn && T.n.includes(used);
    for (let x = Math.min(...xs) + 0.037; ok && x < Math.max(...xs); x += 0.09) {
      for (let y = Math.min(...ys) + 0.041; ok && y < Math.max(...ys); y += 0.09) {
        if (!pip([x, y], T.pts)) continue;
        const cnt = s.pcs.reduce((a, _, i) => a + (inT[i] && pip([x, y], world(i)) ? 1 : 0), 0);
        if (cnt !== 1) ok = false;
      }
    }
    return { used, ok };
  };
  b.onUpdate = () => {
    polys.forEach((el, i) => el.classList.toggle('sel', i === s.sel));
    const { used, ok } = check();
    const T = TARGETS[s.target];
    const msg = $('tgMsg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    msg.textContent = ok ? `拼成了！${T.tip.replace('用', '你用了 ').replace(' 块或 5 块', ` 块中的 ${used} 块`)}。` : `${T.tip}：目标框里现在有 ${used} 块。选中的是「${TANGRAM[s.sel].name}」。`;
  };
  $('tgRot').addEventListener('click', () => { s.pcs = s.pcs.map((pc, j) => (j === s.sel ? { ...pc, rot: (pc.rot + 1) % 8 } : pc)); snap(s.sel); b.update(); });
  $('tgFlip').addEventListener('click', () => { s.pcs = s.pcs.map((pc, j) => (j === s.sel ? { ...pc, flip: !pc.flip } : pc)); snap(s.sel); b.update(); });
  $('tgReset').addEventListener('click', () => { s.pcs = TANGRAM.map((p) => ({ rot: 0, flip: false, pos: c2(p.pts).map((x, i) => x + OFF[i]) })); b.update(); });
  btnGroup($('tgT'), (k) => { s.target = k; b.update(); });
  b.update();
  window.TG = { s, check, b, OFF }; // 供自测
}

window.LESSON = {
  init() {
    initGallery();
    initPP();
    initKinds();
    initParts();
    initCount();
    initSurf();
    initCut();
    initTangram();
  },
  onRender(slide) {
    views.forEach((v) => { if (slide.contains(v.svg)) v.update(); });
    boards.forEach((b) => { if (slide.contains(b.svg)) b.update(); });
  },
};
window.cutCube = cutCube; // 供自测核对面棱顶点
