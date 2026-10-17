'use strict';
/* 五下 用转化的策略解决问题（图形） · 本课互动：拖动半圆平移 8 格、两个半圆旋转 180°、直条/小路/线段平移。通用部分见 ../shared/math.js、mcheck.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const txt = (parent, x, y, t, cls = 'lb') => { const e = svgEl('text', { x, y, class: cls }, parent); e.textContent = t; return e; };
const svgPt = (svg, e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
function animate(ms, fn) {
  const t0 = performance.now();
  let id = 0;
  const step = (t) => { const u = Math.min(1, (t - t0) / ms); fn(u); if (u < 1) id = requestAnimationFrame(step); };
  id = requestAnimationFrame(step);
  return () => cancelAnimationFrame(id);
}

/* 方格纸：cols × rows 格，每格 u，左上角 (ox, oy) */
function grid(svg, cols, rows, u, ox, oy) {
  const d = [];
  for (let i = 0; i <= cols; i += 1) d.push(`M${ox + i * u} ${oy}v${rows * u}`);
  for (let j = 0; j <= rows; j += 1) d.push(`M${ox} ${oy + j * u}h${cols * u}`);
  svgEl('path', { d: d.join(''), class: 'grid' }, svg);
}

/* 例 1 两个图形的路径（格为单位，照课本：左图宽 6、半圆半径 3；右图中间 6 × 8、小半圆半径 2）
   pink(x, y)：左上角 (x, y) 是上面半圆的最左端所在列、半圆顶所在行 */
const pinkBody = (X, Y, u) => `M${X} ${Y + 3 * u}H${X + 6 * u}V${Y + 11 * u}A${3 * u} ${3 * u} 0 0 0 ${X} ${Y + 11 * u}Z`;
const pinkCap = (X, Y, u) => `M${X} ${Y + 3 * u}A${3 * u} ${3 * u} 0 0 1 ${X + 6 * u} ${Y + 3 * u}Z`;
// purple(X, Y)：中间长方形左上角
const purpleBody = (X, Y, u) => `M${X} ${Y}H${X + 6 * u}A${2 * u} ${2 * u} 0 0 0 ${X + 6 * u} ${Y + 4 * u}V${Y + 8 * u}H${X}V${Y + 4 * u}A${2 * u} ${2 * u} 0 0 0 ${X} ${Y}Z`;
const bulgeR = (X, Y, u) => `M${X + 6 * u} ${Y + 4 * u}A${2 * u} ${2 * u} 0 0 1 ${X + 6 * u} ${Y + 8 * u}Z`;
const bulgeL = (X, Y, u) => `M${X} ${Y + 8 * u}A${2 * u} ${2 * u} 0 0 1 ${X} ${Y + 4 * u}Z`;

function drawBoth(svg, u, ox, oy) {
  svgEl('path', { d: pinkBody(ox + u, oy + u, u) + pinkCap(ox + u, oy + u, u), class: 'pink' }, svg);
  svgEl('path', { d: purpleBody(ox + 11 * u, oy + 2 * u, u) + bulgeR(ox + 11 * u, oy + 2 * u, u) + bulgeL(ox + 11 * u, oy + 2 * u, u), class: 'purple' }, svg);
}

function initCover() {
  const s = $('coverFig');
  grid(s, 20, 13, 28, 30, 18);
  drawBoth(s, 28, 30, 18);
}

function initEx1() {
  const s = $('ex1');
  grid(s, 20, 13, 30, 10, 10);
  drawBoth(s, 30, 10, 10);
}

/* ---------- 第 4 页：拖动半圆向下平移 ---------- */
function initTranslate() {
  const s = $('tr');
  const [u, ox, oy] = [30, 15, 10];
  grid(s, 9, 13, u, ox, oy);
  const X = ox + u;
  const Y = oy + u;
  svgEl('path', { d: pinkBody(X, Y, u), class: 'pink' }, s);
  svgEl('path', { d: `M${X} ${Y + 11 * u}A${3 * u} ${3 * u} 0 0 1 ${X + 6 * u} ${Y + 11 * u}`, class: 'ghost-arc' }, s);
  const cap = svgEl('path', { d: pinkCap(X, Y, u), class: 'pink cap' }, s);
  const st = { dy: 0, drag: null, stop: () => {} };
  const set = (dy) => {
    st.dy = dy;
    cap.setAttribute('transform', `translate(0 ${(dy * u).toFixed(2)})`);
    $('trN').textContent = Math.round(dy);
    cap.classList.toggle('fit', Math.round(dy * 100) === 800);
  };
  cap.addEventListener('pointerdown', (e) => { st.stop(); st.drag = { y: svgPt(s, e).y, dy: st.dy }; cap.setPointerCapture(e.pointerId); });
  cap.addEventListener('pointermove', (e) => {
    if (!st.drag) return;
    const d = st.drag.dy + Math.round((svgPt(s, e).y - st.drag.y) / u); // 按整格吸附
    set(Math.max(0, Math.min(8, d)));
  });
  cap.addEventListener('pointerup', () => { st.drag = null; });
  $('trGo').addEventListener('click', () => { st.stop(); const from = st.dy; st.stop = animate(1600, (k) => set(from + (8 - from) * k)); });
  $('trBack').addEventListener('click', () => { st.stop(); set(0); });
  set(0);
}

/* ---------- 第 5 页：两个半圆各绕连接点旋转 180° ---------- */
function initRotate() {
  const s = $('rot');
  const [u, ox, oy] = [30, 10, 5];
  grid(s, 12, 11, u, ox, oy);
  const X = ox + 3 * u;
  const Y = oy + 2 * u;
  svgEl('path', { d: purpleBody(X, Y, u), class: 'purple' }, s);
  const pR = [X + 6 * u, Y + 4 * u];
  const pL = [X, Y + 4 * u];
  const bR = svgEl('path', { d: bulgeR(X, Y, u), class: 'purple bulge' }, s);
  const bL = svgEl('path', { d: bulgeL(X, Y, u), class: 'purple bulge' }, s);
  [pR, pL].forEach(([x, y]) => svgEl('circle', { cx: x, cy: y, r: 6, class: 'pivot' }, s));
  let stop = () => {};
  const set = (a) => {
    bR.setAttribute('transform', `rotate(${-a} ${pR[0]} ${pR[1]})`); // 右边向外、向上转
    bL.setAttribute('transform', `rotate(${a} ${pL[0]} ${pL[1]})`);
    $('rotAv').textContent = `${Math.round(a)}°`;
    $('rotA').value = a;
    [bR, bL].forEach((b) => b.classList.toggle('fit', Math.round(a) === 180));
  };
  $('rotA').addEventListener('input', (e) => { stop(); set(+e.target.value); });
  $('rotGo').addEventListener('click', () => { stop(); stop = animate(2000, (k) => set(180 * k)); });
  set(0);
}

/* ---------- 第 7 页：直条平移（纸 12 × 7，直条宽 1） ---------- */
function initRoad() {
  const s = $('road');
  const u = 24;
  const panels = [[20, '明明'], [340, '冬冬']];
  const roads = [];
  panels.forEach(([ox, name], i) => {
    const oy = 20;
    svgEl('rect', { x: ox, y: oy, width: 12 * u, height: 7 * u, class: 'paper' }, s);
    const v = svgEl('rect', { x: ox + (i ? 0 : 5) * u, y: oy, width: u, height: 7 * u, class: 'strip' }, s);
    const h = svgEl('rect', { x: ox, y: oy + (i ? 6 : 3) * u, width: 12 * u, height: u, class: 'strip' }, s);
    svgEl('rect', { x: ox, y: oy, width: 12 * u, height: 7 * u, class: 'frame-r' }, s);
    txt(s, ox + 6 * u, oy + 7 * u + 32, name, 'lb mid');
    if (!i) roads.push(v, h);
  });
  const [v, h] = roads;
  $('roadGo').addEventListener('click', () => { v.classList.add('mv'); h.classList.add('mv'); v.style.transform = `translateX(${-5 * u}px)`; h.style.transform = `translateY(${3 * u}px)`; });
  $('roadBack').addEventListener('click', () => { v.style.transform = ''; h.style.transform = ''; });
}

/* ---------- 第 8 页：周长——线段平移 ---------- */
function initPeri() {
  const s = $('peri');
  const u = 40;
  grid(s, 21, 5, u, 15, 10);
  const L = [15 + u, 10 + u];
  svgEl('rect', { x: L[0], y: L[1], width: 5 * u, height: 3 * u, class: 'edge-r' }, s);
  // 右图：照课本形状，转折点不在格线上（格为单位）
  const O = [15 + 13 * u, 10 + u];
  const P = (x, y) => [O[0] + x * u, O[1] + y * u];
  // [起点, 终点, 平移量(格)]
  const segs = [
    [[1.5, 0], [3.5, 0], [0, 0]],
    [[3.5, 0], [3.5, 1.35], [1.5, 0]],
    [[3.5, 1.35], [4.4, 1.35], [0, -1.35]],
    [[4.4, 1.35], [4.4, 2.45], [0.6, 0]],
    [[4.4, 2.45], [5, 2.45], [0, -2.45]],
    [[5, 2.45], [5, 3], [0, 0]],
    [[5, 3], [0, 3], [0, 0]],
    [[0, 3], [0, 2.5], [0, 0]],
    [[0, 2.5], [1.5, 2.5], [0, -2.5]],
    [[1.5, 2.5], [1.5, 0], [-1.5, 0]],
  ];
  const lines = segs.map(([a, b, mv]) => {
    const [x1, y1] = P(...a);
    const [x2, y2] = P(...b);
    const l = svgEl('line', { x1, y1, x2, y2, class: `edge ${mv[0] || mv[1] ? 'moving' : ''}` }, s);
    return { l, mv };
  });
  $('periGo').addEventListener('click', () => lines.forEach(({ l, mv }) => { l.style.transform = `translate(${mv[0] * u}px, ${mv[1] * u}px)`; }));
  $('periBack').addEventListener('click', () => lines.forEach(({ l }) => { l.style.transform = ''; }));
}

/* ---------- 第 9 页：草坪 45 × 27，4 条 1 米宽的小路（1 米 = 10 个单位） ---------- */
function initLawn() {
  const s = $('lawn');
  const [u, ox, oy] = [10, 45, 20];
  const [W, H] = [45, 27];
  svgEl('rect', { x: ox, y: oy, width: W * u, height: H * u, class: 'grass' }, s);
  const bw = (W - 2) / 3; // 每块草坪的长
  const bh = (H - 2) / 3;
  const vs = [bw, 2 * bw + 1].map((x, i) => ({ el: svgEl('rect', { x: ox + x * u, y: oy, width: u, height: H * u, class: 'path-r' }, s), dx: W - 2 + i - x, dy: 0 }));
  const hs = [bh, 2 * bh + 1].map((y, i) => ({ el: svgEl('rect', { x: ox, y: oy + y * u, width: W * u, height: u, class: 'path-r' }, s), dx: 0, dy: H - 2 + i - y }));
  svgEl('rect', { x: ox, y: oy, width: W * u, height: H * u, class: 'frame-r' }, s);
  txt(s, ox + (W * u) / 2, oy + H * u + 30, '45 米', 'lb mid');
  txt(s, ox + W * u + 8, oy + (H * u) / 2, '27 米', 'lb');
  const all = [...vs, ...hs];
  $('lawnGo').addEventListener('click', () => all.forEach(({ el, dx, dy }) => { el.style.transform = `translate(${(dx * u).toFixed(2)}px, ${(dy * u).toFixed(2)}px)`; }));
  $('lawnBack').addEventListener('click', () => all.forEach(({ el }) => { el.style.transform = ''; }));
}

/* ---------- 第 9 页：练习十六第 11 题左图（1 cm = 25 个单位） ---------- */
function initEx11() {
  const s = $('ex11');
  const d = 'M75 15A50 50 0 0 0 175 15A50 50 0 0 1 175 115A50 50 0 0 0 75 115A50 50 0 0 1 75 15Z';
  svgEl('path', { d, class: 'shade' }, s);
  svgEl('path', { d: 'M75 15V115M175 15V115', class: 'dashl' }, s);
  svgEl('path', { d: 'M75 130H175', class: 'dim' }, s);
  txt(s, 125, 148, '4', 'lb mid');
  txt(s, 183, 72, '4', 'lb');
}

window.LESSON = {
  init() {
    initCover();
    initEx1();
    initTranslate();
    initRotate();
    initRoad();
    initPeri();
    initLawn();
    initEx11();
  },
};
