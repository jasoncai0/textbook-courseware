'use strict';
/* 七上 5.4 主视图、左视图、俯视图 · 本课互动：
 * 1) 立体图可旋转，按“从正面 / 左面 / 上面看”把视点精确转到正前方、正左方、正上方——正投影下看到的就是视图；
 * 2) 三视图按“主视图在左上、左视图在右、俯视图在下”排好（同一比例、同一中心：长对正、高平齐、宽相等）；
 * 3) 小立方块搭建：点格子加高，三视图按规则即时画出。
 * 立体图用 ../shared/poly3d.js（不透明面，画家算法，背面剔除）；坐标 x 向右、y 向里（向后）、z 向上。 */
const { box, prism, revolve } = Poly3D;
const $ = (id) => document.getElementById(id);
const views = [];
const mkView = (id, opt) => { const v = Poly3D.view($(id), opt); views.push(v); return v; };
const btnGroup = (box2, onPick) => box2.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box2.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});
const DIRS = { front: [0, 0], left: [90, 0], top: [0, 90] };
const WHITE = '#ffffff';
// 给一组物体统一上色：视图模式下一律白色、不加明暗（像画在纸上的视图）
const paintAll = (objs, color, vmode) => objs.map((o) => ({ ...o, color: vmode ? WHITE : (o.color || color), flat: vmode }));

/* 半球（平面朝下），光滑曲面：只描底面圆和轮廓线 */
function hemisphere(r, at = [0, 0, 0], n = 48, m = 12) {
  const V = [];
  for (let j = 0; j <= m; j += 1) {
    const phi = (Math.PI / 2) * (j / m);
    for (let i = 0; i < n; i += 1) {
      const t = (2 * Math.PI * i) / n;
      V.push([at[0] + r * Math.cos(phi) * Math.cos(t), at[1] + r * Math.cos(phi) * Math.sin(t), at[2] + r * Math.sin(phi)]);
    }
  }
  const id = (j, i) => j * n + (i % n);
  const F = [Array.from({ length: n }, (_, i) => id(0, n - 1 - i))];
  for (let j = 0; j < m; j += 1) for (let i = 0; i < n; i += 1) F.push([id(j, i), id(j, i + 1), id(j + 1, i + 1), id(j + 1, i)]);
  // 顶上一圈退化成一点：把最上层的四边形合并成三角形会更干净，但正投影下面积为 0 的面不影响画面
  const sharp = new Set();
  for (let i = 0; i < n; i += 1) { const a = id(0, i); const b = id(0, i + 1); sharp.add(a < b ? `${a}-${b}` : `${b}-${a}`); }
  return { type: 'mesh', V, F, smooth: true, sharp };
}

/* 可旋转 + 一键转到三个方向的立体图 */
function snapView(id, getObjs, btnId, o = {}) {
  const s = { vmode: false };
  const v = mkView(id, { w: o.w || 560, h: o.h || 400, scale: o.scale || 60, yaw: o.yaw ?? -32, pitch: o.pitch ?? 24, center: o.center || [0, 0, 0] });
  v.add(() => paintAll(getObjs(s), o.color || '#f6dcc0', s.vmode));
  v.onRotate = () => { if (s.vmode) { s.vmode = false; mark(''); } };
  const mark = (k) => { if (btnId) $(btnId).querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x.dataset.k === k)); };
  const go = (k) => {
    mark(k);
    if (k === 'free') { s.vmode = false; v.animateTo(o.yaw ?? -32, o.pitch ?? 24, 700); return; }
    s.vmode = true;
    v.animateTo(...DIRS[k], 800);
  };
  if (btnId) $(btnId).addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) { go(b.dataset.k); if (o.onSnap) o.onSnap(b.dataset.k); } });
  v.update();
  return { v, s, go };
}

/* 三视图：三个不可旋转的正投影，同一比例、同一中心 */
function threeViews(prefix, getObjs, o = {}) {
  const mk = (k, yaw, pitch) => mkView(`${prefix}${k}`, { w: o.w || 260, h: o.h || 200, scale: o.scale || 30, yaw, pitch, center: o.center || [0, 0, 0], rotate: false });
  const vs = [mk('F', 0, 0), mk('L', 90, 0), mk('T', 0, 90)];
  vs.forEach((v) => v.add(() => paintAll(getObjs(), WHITE, true)));
  const update = () => vs.forEach((v) => v.update());
  update();
  return { vs, update };
}

/* ---------- 物体 ---------- */
// 图 5-20：躺着的长方体（1×2.75×1，长边朝里）+ 竖直的圆柱（半径 0.5、高 2），按课本图 5-21 量得的比例
const SCENE520 = () => [box([0, 0, 0], [1, 2.75, 1]), revolve({ r1: 0.5, r2: 0.5, h: 2, at: [3, 1.43, 0] })];
// 试一试：圆柱、圆锥、棱柱（正四棱柱）
const TRY = {
  cyl: () => [revolve({ r1: 1, r2: 1, h: 2.2, at: [0, 0, 0] })],
  cone: () => [{ ...revolve({ r1: 1.1, r2: 0, h: 2.2, at: [0, 0, 0] }), apexDot: true }],
  prism: () => [box([-0.9, -0.9, 0], [0.9, 0.9, 2.2])],
};
// 图 5-22：台阶状物体（左视图为 L 形）：深 7、宽 6、高 4，后半部深 3、前半部高 2
const STEP522 = () => [prism([[0, 0], [7, 0], [7, 4], [4, 4], [4, 2], [0, 2]], 'x', 0, 6)];
// 图 5-24
const WEDGE = () => [prism([[0, 0], [6, 0], [6, 4]], 'y', 0, 1.6)];
const VALLEY = () => [prism([[0, 0], [6, 0], [6, 4.2], [3.4, 2.4], [0, 2.4]], 'y', 0, 2)];
// 练一练 1：侧面轮廓为直角梯形的物体（左视图是梯形）
const LEAN = () => [prism([[0, 0], [5.8, 0], [5.8, 4], [3.4, 4]], 'x', 0, 5.2)];
// 图 5-25：正面轮廓为“斜顶”的物体
const OBJ525 = () => [prism([[0, 0], [8, 0], [8, 3.75], [4, 3.75], [0, 2.1]], 'y', 0, 2.5)];
// 图 5-27
const BALL = () => [{ type: 'sphere', c: [0, 0, 1.5], r: 1.5, cls: 'ball' }];
const HALF = () => [hemisphere(1.5)];
// 图 5-29 四个候选物体
const CAND = {
  1: () => [revolve({ r1: 1.5, r2: 1.5, h: 1.4 }), revolve({ r1: 1.5, r2: 0, h: 0.9, at: [0, 0, 1.4] })],
  2: () => [revolve({ r1: 1.5, r2: 1.5, h: 1.4 }), revolve({ r1: 1.5, r2: 0.5, h: 0.6, at: [0, 0, 1.4] }), revolve({ r1: 0.5, r2: 0.5, h: 0.25, at: [0, 0, 2] })],
  3: () => [prism([[0, 0], [6, 0], [6, 4], [4.6, 4], [4.6, 3], [3.3, 3], [3.3, 2], [0, 2]], 'y', 0, 3.5)],
  4: () => [prism([[0, 0], [6, 0], [6, 4], [4, 4], [2, 2], [0, 2]], 'y', 0, 3.5)],
};
// 例：底面为正方形的棱柱（主视图、左视图都是长方形，俯视图是正方形）
const EX530 = () => [box([0, 0, 0], [3, 3, 4])];

/* 第 3 页：图 5-20 / 5-21 */
function initScene() {
  const sv = snapView('sc', SCENE520, 'scBtns', { scale: 88, center: [1.8, 1.4, 0.9], yaw: -28, pitch: 26 });
  void sv;
}
/* 第 4 页：试一试表格 */
function initTry() {
  const svs = ['cyl', 'cone', 'prism'].map((k) => snapView(`try_${k}`, TRY[k], null, { w: 260, h: 240, scale: 52, center: [0, 0, 1.1] }));
  $('tryBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    $('tryBtns').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
    svs.forEach((sv) => sv.go(b.dataset.k));
    $('tryTab').querySelectorAll(`[data-row="${b.dataset.k}"]`).forEach((td) => td.classList.add('on'));
  });
}
/* 第 6 页：图 5-22 / 5-23 */
function initStep() {
  snapView('st', STEP522, 'stBtns', { scale: 30, center: [3, 3.5, 2], yaw: -40, pitch: 24 });
}
/* 第 7 页：图 5-24 两个物体的三视图 */
function initDraw() {
  const s = { k: 'w' };
  const get = () => (s.k === 'w' ? WEDGE() : VALLEY());
  const sv = snapView('dr', get, null, { scale: 44, center: [3, 1, 2], yaw: -30, pitch: 22 });
  const tv = threeViews('dr', get, { scale: 28, center: [3, 1, 2.1] });
  btnGroup($('drK'), (k) => { s.k = k; sv.v.update(); tv.update(); });
}
/* 第 8 页：练一练 1 */
function initLean() {
  snapView('ln', LEAN, 'lnBtns', { scale: 30, center: [2.6, 2.9, 2], yaw: -36, pitch: 22 });
}
/* 第 9 页：图 5-25 / 5-26，三视图的位置 */
function initLayout() {
  snapView('ly', OBJ525, null, { scale: 30, center: [4, 1.25, 1.9], yaw: -30, pitch: 24 });
  threeViews('ly', OBJ525, { scale: 27, center: [4, 1.25, 1.9] });
}
/* 第 11 页：图 5-27 */
function initGuess() {
  const s = { k: '1' };
  const get = () => (s.k === '1' ? BALL() : HALF());
  const sv = snapView('gs', get, null, { scale: 60, center: [0, 0, 1.2], yaw: -30, pitch: 22 });
  const tv = threeViews('gs', get, { scale: 36, center: [0, 0, 1.5] });
  btnGroup($('gsK'), (k) => { s.k = k; sv.v.update(); tv.update(); });
}
/* 第 12 页：图 5-28 / 5-29 */
function initCand() {
  const s = { k: '1' };
  const get = () => CAND[s.k]();
  const cen = () => (['1', '2'].includes(s.k) ? [0, 0, 1.2] : [3, 1.75, 2]);
  const sv = snapView('cd', get, null, { scale: 50, center: cen, yaw: -30, pitch: 22 });
  const tv = threeViews('cd', get, { scale: 26, center: cen });
  btnGroup($('cdK'), (k) => { s.k = k; sv.v.update(); tv.update(); });
}
/* 第 13 页：例 */
function initEx() {
  snapView('ex', EX530, 'exBtns', { scale: 34, center: [1.5, 1.5, 2], yaw: -32, pitch: 24 });
}

/* 第 10 页：小立方块搭建，三视图按规则画出 */
const N = 3; // 3×3 底座
const PRESETS = {
  read: [[0, 0, 1], [0, 0, 1], [1, 1, 2]], // 阅读图(2)：heights[y][x]，y=0 最前、y=2 最后
  stair: [[1, 1, 1], [2, 2, 2], [3, 3, 3]],
  empty: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
};
function initBuild() {
  const s = { h: PRESETS.read.map((r) => [...r]) };
  const v = mkView('bd', { w: 460, h: 380, scale: 72, yaw: -32, pitch: 28, center: [1.5, 1.5, 1.2] });
  const has = (x, y, z) => x >= 0 && y >= 0 && x < N && y < N && z >= 0 && z < s.h[y][x];
  v.add(() => {
    const out = [];
    for (let y = 0; y < N; y += 1) for (let x = 0; x < N; x += 1) for (let z = 0; z < s.h[y][x]; z += 1) {
      const b = box([x, y, z], [x + 1, y + 1, z + 1]);
      // 只保留露在外面的面（与相邻小立方块贴着的面去掉）
      const nb = [[0, 0, -1], [0, 0, 1], [0, -1, 0], [1, 0, 0], [0, 1, 0], [-1, 0, 0]];
      b.F = b.F.filter((_, i) => !has(x + nb[i][0], y + nb[i][1], z + nb[i][2]));
      out.push({ ...b, color: '#d8d0f0' });
    }
    return out;
  });
  // 三视图：每格记“最近的深度”，相邻两格都有而深度不同 → 画线；一有一无 → 画轮廓
  const U = 30;
  const NS = 'http://www.w3.org/2000/svg';
  const drawGrid = (svg, cell, W, H) => { // cell(i, j) → 深度或 null；i 向右、j 向上
    svg.replaceChildren();
    svg.setAttribute('viewBox', `-4 -4 ${W * U + 8} ${H * U + 8}`);
    const X = (i) => i * U;
    const Y = (j) => (H - j) * U;
    const seg = (x1, y1, x2, y2) => { const l = document.createElementNS(NS, 'line'); Object.entries({ x1, y1, x2, y2 }).forEach(([k, val]) => l.setAttribute(k, val)); svg.appendChild(l); };
    for (let i = 0; i < W; i += 1) for (let j = 0; j < H; j += 1) {
      const d = cell(i, j);
      if (d === null) continue;
      const r = document.createElementNS(NS, 'rect');
      Object.entries({ x: X(i), y: Y(j + 1), width: U, height: U, class: 'vf' }).forEach(([k, val]) => r.setAttribute(k, val));
      svg.insertBefore(r, svg.firstChild);
      const edge = (n) => n === null || n !== d;
      if (edge(i > 0 ? cell(i - 1, j) : null)) seg(X(i), Y(j), X(i), Y(j + 1));
      if (edge(i < W - 1 ? cell(i + 1, j) : null)) seg(X(i + 1), Y(j), X(i + 1), Y(j + 1));
      if (edge(j > 0 ? cell(i, j - 1) : null)) seg(X(i), Y(j), X(i + 1), Y(j));
      if (edge(j < H - 1 ? cell(i, j + 1) : null)) seg(X(i), Y(j + 1), X(i + 1), Y(j + 1));
    }
  };
  const H = 3;
  const render = () => {
    const minY = (x, z) => { for (let y = 0; y < N; y += 1) if (has(x, y, z)) return y; return null; };
    const minX = (y, z) => { for (let x = 0; x < N; x += 1) if (has(x, y, z)) return x; return null; };
    drawGrid($('bvF'), (i, j) => minY(i, j), N, H);
    drawGrid($('bvL'), (i, j) => minX(N - 1 - i, j), N, H); // 左视图：左边是物体的后面
    drawGrid($('bvT'), (i, j) => (s.h[j][i] > 0 ? -s.h[j][i] : null), N, N); // 俯视图：上边是物体的后面
    // 底座编辑格（俯视），数字是这一摞的块数
    const ed = $('bdEdit');
    ed.replaceChildren();
    for (let y = 0; y < N; y += 1) for (let x = 0; x < N; x += 1) {
      const g = document.createElementNS(NS, 'g');
      const r = document.createElementNS(NS, 'rect');
      Object.entries({ x: x * 40 + 2, y: (N - 1 - y) * 40 + 2, width: 40, height: 40, class: `ec h${s.h[y][x]}` }).forEach(([k, val]) => r.setAttribute(k, val));
      const t = document.createElementNS(NS, 'text');
      Object.entries({ x: x * 40 + 22, y: (N - 1 - y) * 40 + 30, class: 'et' }).forEach(([k, val]) => t.setAttribute(k, val));
      t.textContent = s.h[y][x] || '';
      g.append(r, t);
      g.addEventListener('click', () => { s.h = s.h.map((row, yy) => row.map((hv, xx) => (xx === x && yy === y ? (hv + 1) % 4 : hv))); render(); });
      ed.appendChild(g);
    }
    $('bdCount').textContent = s.h.flat().reduce((a, b) => a + b, 0);
    v.update();
  };
  $('bdPre').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (!b) return; s.h = PRESETS[b.dataset.k].map((r) => [...r]); render(); });
  render();
}

window.LESSON = {
  init() {
    initScene();
    initTry();
    initStep();
    initDraw();
    initLean();
    initLayout();
    initBuild();
    initGuess();
    initCand();
    initEx();
  },
  onRender(slide) { views.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
