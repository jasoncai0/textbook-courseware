'use strict';
/* 六上 综合与实践《表面涂色的正方体》· 本课互动：
 * 把 n×n×n 的大正方体切开、拆开，每个小正方体的每个面是否涂色由程序逐个判断（这个面朝外且在大正方体表面上），
 * 各类个数是真实数出来的，不是按公式写上去的。依赖 ../shared/poly3d.js、mcube.js（MCube.tween）。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const PAINT = '#f0932b';
const WOOD = '#f6e7c8';
const GAP_MAX = 0.6; // 拆开时相邻小正方体之间的空隙（棱长的倍数）
const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

/** n×n×n 个小正方体，每个记下坐标和涂色面数 */
function cutCube(n) {
  const cells = [];
  for (let k = 0; k < n; k += 1) for (let j = 0; j < n; j += 1) for (let i = 0; i < n; i += 1) {
    const c = [i, j, k];
    const painted = DIRS.map((d) => c.some((x, a) => d[a] !== 0 && x + d[a] === (d[a] > 0 ? n : -1)));
    cells.push({ c, painted, faces: painted.filter(Boolean).length });
  }
  return cells;
}
const countBy = (cells) => [3, 2, 1, 0].map((f) => cells.filter((x) => x.faces === f).length);

/** 小正方体逐面画（每个面单独上色）。show(cell) 决定显示哪些；gap 为拆开程度 0~1 */
function cubeObjects(n, cells, gap, show = () => true) {
  const sp = 1 + gap * GAP_MAX;
  const vis = new Set(cells.filter(show).map((x) => x.c.join(',')));
  const objs = [];
  cells.forEach((cell) => {
    if (!vis.has(cell.c.join(','))) return;
    const o = cell.c.map((x) => x * sp);
    DIRS.forEach((d, fi) => {
      const nb = cell.c.map((x, a) => x + d[a]).join(',');
      if (gap < 0.02 && vis.has(nb)) return; // 贴在一起时，两块之间的面看不见
      const ax = d.findIndex((v) => v !== 0);
      const [u, v] = [0, 1, 2].filter((a) => a !== ax);
      const base = o.map((x, a) => x + (a === ax && d[a] > 0 ? 1 : 0));
      const corner = (du, dv) => { const p = [...base]; p[u] += du; p[v] += dv; return p; };
      let quad = [corner(0, 0), corner(1, 0), corner(1, 1), corner(0, 1)];
      if (Poly3D.vec.dot(Poly3D.newell(quad), d) < 0) quad = quad.reverse();
      objs.push({ type: 'mesh', V: quad, F: [[0, 1, 2, 3]], color: cell.painted[fi] ? PAINT : WOOD, ecls: n > 4 ? 'thin' : '' });
    });
  });
  return objs;
}
/** 大正方体的轮廓（虚线），筛选时帮助看清位置 */
function outline(n, gap) {
  const S = n + (n - 1) * gap * GAP_MAX;
  const P = [[0, 0, 0], [S, 0, 0], [S, S, 0], [0, S, 0], [0, 0, S], [S, 0, S], [S, S, S], [0, S, S]];
  const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  return E.map(([a, b]) => ({ type: 'line', a: P[a], b: P[b], cls: 'h', bias: -1e3 }));
}
function cubeView(el, st, o = {}) {
  const size = () => st.n + (st.n - 1) * st.gap * GAP_MAX;
  const v = Poly3D.view(el, {
    w: o.w || 560, h: o.h || 420, yaw: -32, pitch: 24,
    scale: () => (o.k || 215) / size(),
    center: () => { const s = size() / 2; return [s, s, s]; },
  });
  v.add(() => {
    const cells = cutCube(st.n);
    const objs = cubeObjects(st.n, cells, st.gap, st.show || (() => true));
    return st.outline ? [...outline(st.n, st.gap), ...objs] : objs;
  });
  v.update();
  return v;
}

/* 第 2 页：正方体的顶点、棱、面 */
function initRecall() {
  const svg = $('rcCube');
  const [x0, y0, a, dx, dy] = [40, 50, 85, 40, -30];
  const F = [[x0, y0], [x0 + a, y0], [x0 + a, y0 + a], [x0, y0 + a]];
  const B = F.map(([x, y]) => [x + dx, y + dy]);
  svgEl('polygon', { points: [F[0], F[1], B[1], B[0]].join(' '), fill: '#fde2c4' }, svg);
  svgEl('polygon', { points: [F[1], F[2], B[2], B[1]].join(' '), fill: '#f8c690' }, svg);
  svgEl('polygon', { points: F.join(' '), fill: '#fbd3a8' }, svg);
  const seg = (p, q, dash) => svgEl('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: '#1f2d3a', 'stroke-width': 2, 'stroke-dasharray': dash ? '5 4' : '' }, svg);
  [0, 1, 2, 3].forEach((i) => seg(F[i], F[(i + 1) % 4]));
  seg(B[0], B[1]); seg(B[1], B[2]); seg(B[2], B[3], true); seg(B[3], B[0], true);
  seg(F[0], B[0]); seg(F[1], B[1]); seg(F[2], B[2]); seg(F[3], B[3], true);
  [...F, ...B].forEach(([x, y]) => svgEl('circle', { cx: x, cy: y, r: 5, fill: '#c0392b' }, svg));
  svgEl('text', { x: 175, y: 70, class: 't-m' }, svg).textContent = '8 个顶点';
  svgEl('text', { x: 175, y: 98, class: 't-m' }, svg).textContent = '12 条棱';
  svgEl('text', { x: 175, y: 126, class: 't-m' }, svg).textContent = '6 个面';
}

/* 第 3 页：分成 2 份 */
function initTwo() {
  const st = { n: 2, gap: 0 };
  const v = cubeView($('v2'), st, { k: 190 });
  $('gap2').addEventListener('input', (e) => { st.gap = +e.target.value; v.update(); });
}

/* 第 4 页：核心——任意份数切一切、筛一筛 */
const FLT_MSG = {
  all: '橙色是原来涂过色的面，木色是切开后新露出来的面。拖动图可以转着看。',
  3: '3 面涂色的小正方体在大正方体的<b>顶点</b>上。',
  2: '2 面涂色的小正方体在大正方体的<b>棱</b>上（不含两头的顶点）。',
  1: '1 面涂色的小正方体在大正方体每个<b>面</b>的中间（不含四周的棱）。',
  0: '没有涂色的小正方体藏在大正方体的<b>最里面</b>。',
};
function initCut() {
  const st = { n: 3, gap: 0.5, flt: 'all', shown: false, outline: false };
  st.show = (x) => st.flt === 'all' || x.faces === +st.flt;
  const v = cubeView($('vN'), st, { w: 560, h: 470, k: 235 });
  const row = $('cntRow');
  const render = () => {
    const cells = cutCube(st.n);
    const cnt = [st.n ** 3, ...countBy(cells)];
    [...row.children].forEach((td, i) => { td.textContent = st.shown ? cnt[i] : '?'; });
    const pick = st.flt === 'all' ? -1 : 4 - +st.flt;
    [...row.children].forEach((td, i) => td.classList.toggle('hl', i === pick));
    const none = st.flt !== 'all' && cnt[pick] === 0;
    $('fltMsg').innerHTML = none ? `每条棱平均分成 ${st.n} 份时，这样的小正方体<b>一个也没有</b>。` : FLT_MSG[st.flt];
    $('nVal').textContent = st.n;
    st.outline = st.flt !== 'all';
    v.update();
  };
  $('nIn').addEventListener('input', (e) => { st.n = +e.target.value; st.shown = false; render(); });
  $('gapN').addEventListener('input', (e) => { st.gap = +e.target.value; render(); });
  $('flt').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    $('flt').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
    st.flt = b.dataset.k;
    if (st.flt !== 'all' && st.gap < 0.3) { st.gap = 0.5; $('gapN').value = 0.5; }
    render();
  });
  $('cntShow').addEventListener('click', () => { st.shown = true; render(); });
  render();
}

/* 第 6 页：一个顶点 / 一条棱 / 一个面上（分成 5 份） */
function initPos() {
  const n = 5;
  const st = { n, gap: 0.45, outline: true, k: '3' };
  const onEdge = (c) => c[1] === 0 && c[2] === 0 && c[0] > 0 && c[0] < n - 1;
  const onFace = (c) => c[1] === 0 && c[0] > 0 && c[0] < n - 1 && c[2] > 0 && c[2] < n - 1;
  st.show = (x) => (st.k === '3' ? x.faces === 3 : st.k === '2' ? onEdge(x.c) : onFace(x.c));
  const v = cubeView($('vPos'), st, { k: 215 });
  $('posBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    $('posBtns').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
    st.k = b.dataset.k;
    v.update();
  });
}

/* 第 8 页：没有涂色的 + 分类相加验证总数 */
function initZero() {
  const st = { n: 5, gap: 0.45, outline: true, show: (x) => x.faces === 0 };
  const v = cubeView($('v0'), st, { k: 215 });
  const render = () => {
    const [c3, c2, c1, c0] = countBy(cutCube(st.n));
    $('n0Val').textContent = st.n;
    $('sumMsg').innerHTML = `分成 ${st.n} 份：$${c3}+${c2}+${c1}+${c0}=${c3 + c2 + c1 + c0}$，$${st.n}\\times${st.n}\\times${st.n}=${st.n ** 3}$ ✓`;
    MathKit.tex($('sumMsg'));
    v.update();
  };
  $('n0In').addEventListener('input', (e) => { st.n = +e.target.value; render(); });
  render();
}

window.LESSON = {
  init() {
    initRecall();
    initTwo();
    initCut();
    initPos();
    initZero();
  },
};
