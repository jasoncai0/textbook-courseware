'use strict';
/* 五下 分数的基本性质 · 本课互动：例 11 四个圆与叠合图、折纸（同一张纸越折份数越多，涂色部分不变，核心）、
 * 练一练涂六边形、分数条找相等分数。所有分割线按边长、角度精确计算。通用部分见 ../shared/fracfig.js */
const { el, pie, bar, grid, gcd, FILL, LINE } = FracFig;
const $ = (id) => document.getElementById(id);
const text = (svg, x, y, s, cls = 'ff-t') => { const t = el('text', { x, y, class: cls }, svg); t.textContent = s; return t; };

/* ---------- 前情回顾 + 例 11 ---------- */
function initE11() {
  const rc = $('rcStrip');
  [[2, 1], [4, 2], [8, 4]].forEach(([n, k], r) => bar(rc, { x: 20, y: 8 + r * 30, w: 200, h: 24, n, on: (i) => i < k }));
  // 涂色从 12 点钟方向往左（逆时针）数 k 份，和课本一样
  [['c1', 3, 1], ['c2', 2, 1], ['c3', 6, 2], ['c4', 9, 3]].forEach(([id, n, k]) => pie($(id), { cx: 60, cy: 60, r: 54, n, on: (i) => i >= n - k }));
  const st = $('stack');
  const [cx, cy, R] = [100, 100, 90];
  const P = (deg) => [cx + R * Math.cos((deg * Math.PI) / 180), cy + R * Math.sin((deg * Math.PI) / 180)];
  const [ax, ay] = P(-90 - 120);
  el('path', { d: `M${cx} ${cy}L${ax.toFixed(2)} ${ay.toFixed(2)}A${R} ${R} 0 0 1 ${cx} ${cy - R}Z`, fill: FILL }, st);
  el('circle', { cx, cy, r: R, fill: 'none', stroke: LINE, 'stroke-width': 2.5 }, st);
  [[9, '#9fb0bf', 1.5, '3 3'], [6, '#d9711c', 2, '7 4'], [3, '#c0392b', 3, '']].forEach(([n, color, w, dash]) => {
    for (let i = 0; i < n; i += 1) {
      const [x, y] = P(-90 + (i * 360) / n);
      el('line', { x1: cx, y1: cy, x2: x.toFixed(2), y2: y.toFixed(2), stroke: color, 'stroke-width': w, 'stroke-dasharray': dash }, st);
    }
  });
}

/* ---------- 核心：折纸 ---------- */
const FOLDS = [[2, 1], [2, 2], [4, 2], [4, 4]]; // 每次对折后的 [列数, 行数]
const PAPER = { x: 40, y: 40, s: 240 };
const FOLD_MS = 700;
function initFold() {
  const svg = $('fold');
  const state = { f: 0, busy: false };
  const chain = [];
  const msg = $('foldMsg');
  const draw = () => {
    const [cols, rows] = FOLDS[state.f];
    svg.innerHTML = '';
    const { x, y, s } = PAPER;
    el('rect', { x, y, width: s, height: s, fill: '#fff', stroke: LINE, 'stroke-width': 3 }, svg);
    el('rect', { x, y, width: s / 2, height: s, fill: FILL }, svg);
    for (let c = 1; c < cols; c += 1) el('line', { x1: x + (s * c) / cols, x2: x + (s * c) / cols, y1: y, y2: y + s, stroke: '#1d6fa5', 'stroke-width': 2, 'stroke-dasharray': '7 5' }, svg);
    for (let r = 1; r < rows; r += 1) el('line', { x1: x, x2: x + s, y1: y + (s * r) / rows, y2: y + (s * r) / rows, stroke: '#1d6fa5', 'stroke-width': 2, 'stroke-dasharray': '7 5' }, svg);
    el('rect', { x, y, width: s, height: s, fill: 'none', stroke: LINE, 'stroke-width': 3 }, svg);
    const n = cols * rows;
    msg.innerHTML = `折痕把这张纸平均分成了 <b>${n}</b> 份，涂色部分占 <b>${n / 2}</b> 份：$\\dfrac{${n / 2}}{${n}}$`;
    if (!chain.includes(n)) chain.push(n);
    $('foldChain').innerHTML = `$${chain.map((m) => `\\dfrac{${m / 2}}{${m}}`).join('=')}$`;
    MathKit.tex(msg); MathKit.tex($('foldChain'));
    $('foldGo').disabled = state.f >= FOLDS.length - 1;
  };
  // 演示一次对折：半张纸绕折痕翻过去，再展开
  const animate = (vertical) => new Promise((res) => {
    const { x, y, s } = PAPER;
    const flap = vertical
      ? el('rect', { x: x + s / 2, y, width: s / 2, height: s, class: 'flap', style: `transform-origin: ${x + s / 2}px ${y + s / 2}px` }, svg)
      : el('rect', { x, y: y + s / 2, width: s, height: s / 2, class: 'flap', style: `transform-origin: ${x + s / 2}px ${y + s / 2}px` }, svg);
    const t = vertical ? 'scaleX(-1)' : 'scaleY(-1)';
    svg.getBoundingClientRect();
    flap.style.transform = t;
    setTimeout(() => { flap.style.transform = ''; setTimeout(res, FOLD_MS); }, FOLD_MS + 250);
  });
  $('foldGo').addEventListener('click', async () => {
    if (state.busy || state.f >= FOLDS.length - 1) return;
    state.busy = true;
    const [c0] = FOLDS[state.f];
    const [c1] = FOLDS[state.f + 1];
    await animate(c1 > c0);
    state.f += 1;
    state.busy = false;
    draw();
  });
  $('foldReset').addEventListener('click', () => { if (state.busy) return; state.f = 0; chain.length = 0; draw(); });
  draw();
}

/* ---------- 练一练 2 ---------- */
function hexPts(cx, cy, R) { return Array.from({ length: 6 }, (_, k) => [cx + R * Math.cos((k * Math.PI) / 3 - Math.PI / 2), cy + R * Math.sin((k * Math.PI) / 3 - Math.PI / 2)]); }
const f2 = ([a, b]) => `${a.toFixed(2)},${b.toFixed(2)}`;
function initHex() {
  const svg = $('hexes');
  const [R, cy] = [66, 75];
  // 左：3 个菱形（中心连隔一个顶点），涂 2 个
  const L = hexPts(100, cy, R);
  [0, 2, 4].forEach((k, i) => {
    el('polygon', { points: [[100, cy], L[k], L[k + 1], L[(k + 2) % 6]].map(f2).join(' '), fill: i < 2 ? FILL : '#fff', stroke: LINE, 'stroke-width': 2 }, svg);
  });
  text(svg, 210, 82, '=', 'ff-t');
  // 右：6 个三角形，可点
  const Rp = hexPts(320, cy, R);
  const on = new Set();
  const tris = Rp.map((p, k) => {
    const t = el('polygon', { points: [[320, cy], p, Rp[(k + 1) % 6]].map(f2).join(' '), fill: '#fff', stroke: LINE, 'stroke-width': 2, class: 'ff-part' }, svg);
    t.addEventListener('click', () => {
      if (on.has(k)) on.delete(k); else on.add(k);
      t.setAttribute('fill', on.has(k) ? FILL : '#fff');
      const m = $('hexMsg');
      m.textContent = on.size === 4 ? '✓ 涂了 4 份，和左边一样大' : (on.size ? `涂了 ${on.size} 份` : '');
      m.className = `small-t ${on.size === 4 ? 'ok-t' : ''}`;
    });
    return t;
  });
  return tris;
}
function initGrids() {
  const svg = $('grids');
  grid(svg, { x: 40, y: 15, w: 120, h: 120, rows: 4, cols: 4, on: (i) => i < 12 });
  text(svg, 210, 82, '=', 'ff-t');
  grid(svg, { x: 260, y: 15, w: 120, h: 120, rows: 4, cols: 1, on: (i) => i < 3 });
}

/* ---------- 分数条 ---------- */
const WALL = [1, 2, 3, 4, 6, 8, 12];
function initWall() {
  const svg = $('wall');
  const [x0, W, H, gap] = [70, 510, 38, 8];
  const rows = WALL.map((n, r) => {
    const y = 8 + r * (H + gap);
    const fr = n === 1 ? '1' : `1/${n}`;
    text(svg, 32, y + H / 2 + 7, fr, 'ff-t s');
    const cells = Array.from({ length: n }, (_, i) => {
      const c = el('rect', { x: x0 + (W * i) / n, y, width: W / n, height: H, fill: '#fff', stroke: LINE, 'stroke-width': 1.5, class: 'ff-part', 'data-n': n, 'data-i': i }, svg);
      return c;
    });
    return { n, cells };
  });
  const line = el('line', { y1: 0, y2: 330, stroke: '#c0392b', 'stroke-width': 3, 'stroke-dasharray': '8 5', opacity: 0 }, svg);
  const msg = $('wallMsg');
  svg.addEventListener('click', (e) => {
    const c = e.target.closest('[data-n]');
    if (!c) return;
    const n = +c.dataset.n;
    const k = +c.dataset.i + 1; // 前 k 格：k/n
    const eq = [];
    rows.forEach((row) => {
      const m = (k * row.n) / n; // 同样长需要的格数
      const hit = Number.isInteger(m);
      row.cells.forEach((cell, i) => cell.setAttribute('fill', hit && i < m ? (row.n === n ? '#f6c27a' : FILL) : '#fff'));
      if (hit && row.n !== n) eq.push([m, row.n]);
    });
    const x = x0 + (W * k) / n;
    line.setAttribute('x1', x); line.setAttribute('x2', x); line.setAttribute('opacity', 1);
    const g = gcd(k, n);
    const self = n === 1 ? '1' : `\\dfrac{${k}}{${n}}`;
    const list = eq.map(([a, b]) => {
      const t = b === 1 ? '1' : `\\dfrac{${a}}{${b}}`;
      const how = b > n ? `\\times${b / n}` : `\\div${n / b}`;
      return `$${t}$（分子、分母同时 $${how}$）`;
    });
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = list.length
      ? `和 $${self}$ 右端对齐的：${list.join('，')}。`
      : `在这些彩条里，没有和 $${self}$ 一样长的其他分数${g > 1 ? '' : ''}。`;
    MathKit.tex(msg);
  });
}

window.LESSON = {
  init() {
    initE11();
    initFold();
    initHex();
    initGrids();
    initWall();
    FracFig.exact();
  },
};
