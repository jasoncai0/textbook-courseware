'use strict';
/* 五上 含有字母的式子的化简 · 本课互动：连着摆三角形（首个 3 根绿、每次新增 2 根橙，根数由代码数出）、
 * 冷水壶倒橙汁（式子 1100 − x − x − x 随倒随长，线段图按毫升精确画）、练习十八的线段图。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const GREEN = '#2e9b48';
const ORANGE = '#e07b18';

function stick(parent, [x1, y1], [x2, y2], color, w = 7) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const [dx, dy] = [((x2 - x1) / len) * 4, ((y2 - y1) / len) * 4];
  return svgEl('line', { x1: x1 + dx, y1: y1 + dy, x2: x2 - dx, y2: y2 - dy, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, parent);
}

/* 第 2 页：分开摆的 3 个三角形 */
function initSep() {
  const svg = $('sepTri');
  const [s, h] = [44, 38];
  for (let i = 0; i < 3; i += 1) {
    const x = 40 + i * 64;
    const [A, B, C] = [[x, 52], [x + s, 52], [x + s / 2, 52 - h]];
    [[A, B], [B, C], [C, A]].forEach(([p, q]) => stick(svg, p, q, GREEN, 5));
  }
}

/* 连着摆：一正一倒。返回第 n 个三角形新增的小棒（第 1 个 3 根，以后每个 2 根） */
function rowSticks(n, s, x0, yb) {
  const h = (s * Math.sqrt(3)) / 2;
  const B = (k) => [x0 + k * s, yb];
  const T = (k) => [x0 + s / 2 + k * s, yb - h];
  const out = [[B(0), B(1)], [B(1), T(0)], [T(0), B(0)]].map((seg) => ({ seg, first: true }));
  for (let i = 1; i < n; i += 1) {
    const j = Math.floor(i / 2);
    const added = i % 2
      ? [[T(j), T(j + 1)], [T(j + 1), B(j + 1)]] // 倒三角：上边、右边（左边与前一个共用）
      : [[B(j), B(j + 1)], [B(j + 1), T(j)]]; // 正三角：底边、右边
    added.forEach((seg) => out.push({ seg, first: false }));
  }
  return out;
}

/* 第 3 页 */
const ROW = { side: 80, max: 14 };
function initRow() {
  const svg = $('row');
  let n = 4;
  const draw = () => {
    svg.innerHTML = '';
    const width = ((n + 1) / 2) * ROW.side;
    const sticks = rowSticks(n, ROW.side, (700 - width) / 2, 108);
    sticks.forEach(({ seg, first }) => stick(svg, seg[0], seg[1], first ? GREEN : ORANGE));
    const added = n - 1;
    $('rowRead').innerHTML = `增加了 <b>${added}</b> 个三角形（共 ${n} 个）：$3+2\\times${added}=${3 + 2 * added}$，数一数：<b>${sticks.length}</b> 根`;
    tex($('rowRead'));
  };
  $('rowAdd').addEventListener('click', () => { n = Math.min(ROW.max, n + 1); draw(); });
  $('rowSub').addEventListener('click', () => { n = Math.max(1, n - 1); draw(); });
  draw();
}

/* 第 5 页：倒橙汁。壶和杯都按“液面高度 ∝ 毫升数”画，线段图按毫升精确画 */
const JUG = { ml: 1100, cap: 1200, cupCap: 400, cups: 3 };
function initJug() {
  const svg = $('jug');
  const bar = $('barModel');
  const st = { x: 250, poured: 0 };
  const drawJug = () => {
    svg.innerHTML = '';
    const [jx, jw, top, bot] = [30, 150, 30, 270];
    const k = (bot - top) / JUG.cap;
    const left = JUG.ml - st.x * st.poured;
    svgEl('rect', { x: jx, y: bot - left * k, width: jw, height: left * k, fill: '#f39a2b' }, svg);
    svgEl('path', { d: `M${jx} ${top}V${bot}H${jx + jw}V${top}`, fill: 'none', stroke: '#7d8e9c', 'stroke-width': 4 }, svg);
    svgEl('path', { d: `M${jx + jw} ${top + 40}q36 10 0 80`, fill: 'none', stroke: '#7d8e9c', 'stroke-width': 5 }, svg);
    svgEl('text', { x: jx + jw / 2, y: bot - left * k - 8, class: 'jg-lb' }, svg).textContent = `${left} 毫升`;
    const [cw, ctop, cbot] = [50, 150, 270];
    const ck = (cbot - ctop) / JUG.cupCap;
    for (let i = 0; i < JUG.cups; i += 1) {
      const cx = 230 + i * 62;
      if (i < st.poured) svgEl('rect', { x: cx, y: cbot - st.x * ck, width: cw, height: st.x * ck, fill: '#f39a2b' }, svg);
      svgEl('path', { d: `M${cx} ${ctop}V${cbot}H${cx + cw}V${ctop}`, fill: 'none', stroke: '#7d8e9c', 'stroke-width': 3 }, svg);
      svgEl('text', { x: cx + cw / 2, y: cbot + 22, class: 'jg-cup' }, svg).textContent = i < st.poured ? 'x' : '';
    }
  };
  const drawBar = () => {
    bar.innerHTML = '';
    const [x0, x1] = [10, 590];
    const X = (ml) => x0 + ((x1 - x0) * ml) / JUG.ml;
    for (let i = 0; i < st.poured; i += 1) {
      svgEl('rect', { x: X(i * st.x), y: 30, width: X(st.x) - X(0), height: 26, fill: i % 2 ? '#f6b35c' : '#f39a2b', stroke: '#fff', 'stroke-width': 2 }, bar);
      svgEl('text', { x: (X(i * st.x) + X((i + 1) * st.x)) / 2, y: 49, class: 'bm-in' }, bar).textContent = 'x';
    }
    const used = st.x * st.poured;
    svgEl('rect', { x: X(used), y: 30, width: X(JUG.ml) - X(used), height: 26, fill: '#e8f1f8', stroke: '#1d6fa5', 'stroke-width': 2 }, bar);
    svgEl('text', { x: (X(used) + X(JUG.ml)) / 2, y: 49, class: 'bm-left' }, bar).textContent = '还剩？';
    svgEl('path', { d: `M${X(0)} 22V14H${X(JUG.ml)}V22`, fill: 'none', stroke: '#556575', 'stroke-width': 2 }, bar);
    svgEl('text', { x: X(JUG.ml / 2), y: 11, class: 'bm-top' }, bar).textContent = '1100 毫升';
    svgEl('text', { x: X(JUG.ml / 2), y: 80, class: 'bm-top' }, bar).textContent = `每段 x = ${st.x} 毫升（线段图按毫升精确画）`;
  };
  const render = () => {
    drawJug(); drawBar();
    $('xOut').textContent = `${st.x} 毫升`;
    $('expr').innerHTML = `$1100${'-x'.repeat(st.poured)}$`;
    const left = JUG.ml - st.x * st.poured;
    const msg = $('pourMsg');
    msg.innerHTML = st.poured < JUG.cups
      ? `倒了 ${st.poured} 杯，还剩 $1100${'-x'.repeat(st.poured)}$，也就是 ${left} 毫升。`
      : `倒完 3 杯：$1100-x-x-x$，当 $x=${st.x}$ 时还剩 <b>${left}</b> 毫升。减了 <b>3 个 $x$</b>，能写得更短吗？`;
    tex($('expr')); tex(msg);
  };
  $('xSl').addEventListener('input', (e) => { st.x = +e.target.value; render(); });
  $('pour').addEventListener('click', () => { st.poured = Math.min(JUG.cups, st.poured + 1); render(); });
  $('pourReset').addEventListener('click', () => { st.poured = 0; render(); });
  render();
}

/* 第 8 页：练习十八第 2 题的线段图（照课本示意） */
function initLine2() {
  const svg = $('line2');
  const P = [[40, '小华家'], [300, '小军家'], [520, '学校'], [760, '小丽家']];
  svgEl('line', { x1: 40, x2: 760, y1: 40, y2: 40, stroke: '#4f9bd0', 'stroke-width': 4 }, svg);
  P.forEach(([x, t]) => {
    svgEl('circle', { cx: x, cy: 40, r: 6, fill: '#e0569a' }, svg);
    svgEl('text', { x, y: 68, class: 'ln-lb' }, svg).textContent = t;
  });
  [['800 米', 40, 300], ['x 米', 300, 520], ['y 米', 520, 760]].forEach(([t, a, b]) => {
    svgEl('path', { d: `M${a + 4} 18H${b - 4}`, stroke: '#556575', 'stroke-width': 1.5, 'marker-start': 'url(#ah)', 'marker-end': 'url(#ah)' }, svg);
    svgEl('text', { x: (a + b) / 2, y: 14, class: 'ln-lb it' }, svg).textContent = t;
  });
  const mk = svgEl('marker', { id: 'ah', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, svgEl('defs', {}, svg));
  svgEl('path', { d: 'M0 0L10 5L0 10Z', fill: '#556575' }, mk);
}

/* 第 9 页：练习十八第 4 题，四段 a 厘米 + 15 厘米（照课本示意） */
function initTape4() {
  const svg = $('tape4');
  const segs = [['a 厘米', 100], ['a 厘米', 100], ['a 厘米', 100], ['a 厘米', 100], ['15 厘米', 120]];
  let x = 20;
  segs.forEach(([t, w], i) => {
    svgEl('rect', { x, y: 30, width: w, height: 22, fill: '#bfe0f5', stroke: '#4f9bd0', 'stroke-width': 1.5 }, svg);
    svgEl('path', { d: `M${x + 2} 24q${w / 4} -6 ${w / 2 - 2} -6q${w / 4} 0 ${w / 2 - 2} 6`, fill: 'none', stroke: '#e0569a', 'stroke-width': 1.5 }, svg);
    svgEl('text', { x: x + w / 2, y: 14, class: `ln-lb${i < 4 ? ' it' : ''}` }, svg).textContent = t;
    x += w;
  });
  svgEl('path', { d: `M22 60q${(x - 22) / 4} 8 ${(x - 22) / 2} 8q${(x - 22) / 4} 0 ${(x - 22) / 2} -8`, fill: 'none', stroke: '#e0569a', 'stroke-width': 1.5 }, svg);
  svgEl('text', { x: (x + 20) / 2, y: 86, class: 'ln-lb' }, svg).textContent = '（　　）厘米';
}

window.LESSON = {
  init() {
    initSep();
    initRow();
    initJug();
    initLine2();
    initTape4();
  },
};
