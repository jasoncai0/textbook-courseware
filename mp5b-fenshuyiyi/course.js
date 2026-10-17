'use strict';
/* 五下 分数的意义 · 本课互动：例 1 的四幅图、单位“1”工作台（选整体 → 平均分 → 点涂色，核心）、分数单位逐个亮起、
 * 练一练图、数轴、练习八“涂出 2/3”。所有份数、位置都由代码按数值画出。通用部分见 ../shared/fracfig.js */
const { el, pie, bar, grid, texFrac, FILL, LINE } = FracFig;
const $ = (id) => document.getElementById(id);
const PEACH = '#f59fb0';
const MOON = '#d98b3a';

/* 一组小圆：centers 为圆心数组，on(i) 涂色 */
const dots = (svg, centers, r, on, color = PEACH) => centers.map(([x, y], i) => el('circle', {
  cx: x, cy: y, r, fill: on(i) ? color : '#fff', stroke: '#d0587e', 'stroke-width': 2, class: 'ff-part tap', 'data-i': i,
}, svg));
const dash = (svg, x1, y1, x2, y2) => el('line', { x1, y1, x2, y2, stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
const text = (svg, x, y, s, cls = 'ff-t') => { const t = el('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
/* 竖排分数 a/b（SVG 文字） */
function svgFrac(svg, x, y, a, b, cls = 'ff-t') {
  text(svg, x, y, a, cls);
  el('line', { x1: x - 11, x2: x + 11, y1: y + 6, y2: y + 6, stroke: 'currentColor', 'stroke-width': 1.6, class: cls }, svg);
  text(svg, x, y + 26, b, cls);
}
/* 下方的大括号 + 文字 */
function brace(svg, x1, x2, y, label) {
  const m = (x1 + x2) / 2;
  el('path', { d: `M${x1} ${y}q0 8 8 8H${m - 8}q8 0 8 8q0-8 8-8H${x2 - 8}q8 0 8-8`, fill: 'none', stroke: '#e0569a', 'stroke-width': 2 }, svg);
  if (label) text(svg, m, y + 36, label);
}

/* 6 个圆分成 3 组（2 行 × 3 列），第 1 组涂色 */
function sixGroup(svg, w, h, shadeFirst) {
  el('ellipse', { cx: w / 2, cy: h / 2, rx: w / 2 - 4, ry: h / 2 - 6, fill: '#fff', stroke: '#e0569a', 'stroke-width': 2 }, svg);
  const xs = [w * 0.3, w * 0.5, w * 0.7];
  const ys = [h * 0.36, h * 0.66];
  const c = [];
  xs.forEach((x) => ys.forEach((y) => c.push([x, y])));
  dots(svg, c, Math.min(w, h) * 0.09, (i) => shadeFirst && i < 2);
  dash(svg, w * 0.4, h * 0.14, w * 0.4, h * 0.86);
  dash(svg, w * 0.6, h * 0.14, w * 0.6, h * 0.86);
}

function initRecall() {
  sixGroup($('rcAvg'), 240, 110, false);
  pie($('rcOne'), { cx: 120, cy: 55, r: 48, n: 4, on: (i) => i === 3 });
  sixGroup($('rcGroup'), 240, 110, true);
}

function initE1() {
  pie($('e1a'), { cx: 80, cy: 60, r: 52, n: 4, on: (i) => i === 2, fill: MOON, line: '#9c5b1c' });
  grid($('e1b'), { x: 20, y: 25, w: 120, h: 60, rows: 2, cols: 4, on: (i) => [0, 1, 2, 4, 5].includes(i) });
  bar($('e1c'), { x: 10, y: 40, w: 140, h: 22, n: 5, on: (i) => i < 3 });
  brace($('e1c'), 10, 150, 66);
  sixGroup($('e1d'), 160, 120, true);
  // 单位“1”三类
  pie($('k1'), { cx: 80, cy: 50, r: 42, n: 1, on: () => true, fill: MOON, line: '#9c5b1c' });
  const k2 = $('k2');
  el('line', { x1: 15, x2: 145, y1: 45, y2: 45, stroke: LINE, 'stroke-width': 5 }, k2);
  [15, 145].forEach((x) => el('line', { x1: x, x2: x, y1: 33, y2: 57, stroke: LINE, 'stroke-width': 3 }, k2));
  text(k2, 80, 85, '1 米');
  sixGroup($('k3'), 160, 100, false);
}

/* ---------- 第 5 页：单位“1”工作台 ---------- */
const WB = { kind: 'pie', n: 4, on: new Set() };
const N_MIN = 2;
const N_MAX = 12;
const PEACHES = 12;
function drawWB() {
  const svg = $('wb');
  svg.innerHTML = '';
  const { kind, n } = WB;
  const isOn = (i) => WB.on.has(i);
  let parts = [];
  const okGroup = kind !== 'peach' || PEACHES % n === 0;
  if (kind === 'pie') parts = pie(svg, { cx: 280, cy: 150, r: 135, n, on: isOn });
  if (kind === 'rect') parts = bar(svg, { x: 40, y: 70, w: 480, h: 160, n, on: isOn });
  if (kind === 'line') {
    parts = bar(svg, { x: 30, y: 130, w: 500, h: 26, n, on: isOn, fill: '#f0a63a', line: '#c0392b' });
    for (let i = 0; i <= n; i += 1) el('line', { x1: 30 + (500 * i) / n, x2: 30 + (500 * i) / n, y1: 118, y2: 168, stroke: '#c0392b', 'stroke-width': 2.5 }, svg);
    text(svg, 30, 205, '0'); text(svg, 530, 205, '1 米');
  }
  if (kind === 'peach') {
    el('ellipse', { cx: 280, cy: 150, rx: 272, ry: 142, fill: '#fff', stroke: '#e0569a', 'stroke-width': 2 }, svg);
    if (!okGroup) {
      // 不能平均分：12 个桃排成一排，不画分隔线
      const c = Array.from({ length: PEACHES }, (_, i) => [70 + (i % 6) * 84, 110 + Math.floor(i / 6) * 80]);
      dots(svg, c, 26, () => false);
    } else {
      const per = PEACHES / n;
      const cols = n > 6 ? 6 : n; // 份数多于 6 时排两行
      const rows = Math.ceil(n / cols);
      const gw = 480 / cols;
      const gh = 230 / rows;
      const pr = Math.min(22, gw / 4.2);
      const c = [];
      const owner = [];
      for (let g = 0; g < n; g += 1) {
        const gx = 40 + (g % cols) * gw;
        const gy = 35 + Math.floor(g / cols) * gh;
        const pc = Math.ceil(Math.sqrt(per));
        for (let k = 0; k < per; k += 1) {
          const prc = Math.ceil(per / pc);
          c.push([gx + gw * ((k % pc) + 0.5) / pc, gy + gh * (Math.floor(k / pc) + 0.5) / prc]);
          owner.push(g);
        }
        if (g % cols) dash(svg, gx, gy + 6, gx, gy + gh - 6);
        if (g >= cols && g % cols === 0) dash(svg, 60, gy, 500, gy);
      }
      parts = dots(svg, c, pr, (i) => isOn(owner[i]));
      parts.forEach((p, i) => p.setAttribute('data-i', owner[i]));
    }
  }
  return { parts, okGroup };
}
function renderWB() {
  const { okGroup } = drawWB();
  const { n, kind } = WB;
  const k = WB.on.size;
  $('wbN').textContent = n;
  const msg = $('wbMsg');
  const what = { pie: '这个圆', rect: '这个长方形', line: '1 米', peach: `这 ${PEACHES} 个桃` }[kind];
  if (!okGroup) {
    msg.className = 'tip feedback fb-warn';
    msg.innerHTML = `${PEACHES} 个桃<b>不能平均分成 ${n} 份</b>（${PEACHES} ÷ ${n} 有余数，每份不一样多），不能用 $\\dfrac1{${n}}$ 表示。换一个份数试试。`;
    $('wbFrac').innerHTML = '';
  } else {
    msg.className = 'tip feedback fb-ok';
    const extra = kind === 'peach' ? `，每份 <b>${PEACHES / n}</b> 个，涂色的是 <b>${(k * PEACHES) / n}</b> 个桃` : '';
    msg.innerHTML = `把${what}看作单位“1”，平均分成 <b>${n}</b> 份，涂色的是 <b>${k}</b> 份${extra}。`;
    $('wbFrac').innerHTML = k
      ? `涂色部分是 $${texFrac(k, n)}$　分数单位 $\\dfrac1{${n}}$，有 ${k} 个`
      : '点一份试试，涂色部分用分数怎样表示？';
  }
  MathKit.tex(msg); MathKit.tex($('wbFrac'));
}
function initWB() {
  $('wbKind').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    WB.kind = b.dataset.k;
    WB.on.clear();
    $('wbKind').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
    renderWB();
  });
  const setN = (d) => { WB.n = Math.min(N_MAX, Math.max(N_MIN, WB.n + d)); WB.on.clear(); renderWB(); };
  $('wbMinus').addEventListener('click', () => setN(-1));
  $('wbPlus').addEventListener('click', () => setN(1));
  $('wbClear').addEventListener('click', () => { WB.on.clear(); renderWB(); });
  $('wb').addEventListener('click', (e) => {
    const p = e.target.closest('[data-i]');
    if (!p) return;
    const i = +p.dataset.i;
    if (WB.on.has(i)) WB.on.delete(i); else WB.on.add(i);
    renderWB();
  });
  renderWB();
}

/* ---------- 第 6 页：5/8 由 5 个 1/8 组成 ---------- */
function initUnit() {
  const svg = $('unitFig');
  const parts = bar(svg, { x: 20, y: 20, w: 480, h: 50, n: 8 });
  parts.forEach((p, i) => {
    if (i < 5) {
      p.style.transition = `fill .3s ${0.3 + i * 0.35}s`;
      p.classList.add('u-on');
    }
    svgFrac(svg, 20 + 60 * i + 30, 95, '1', '8', 'ff-t s');
  });
  svg.querySelectorAll('.ff-t.s').forEach((t) => t.setAttribute('font-size', '15'));
}

/* ---------- 第 7 页：练一练 1 ---------- */
function initP1() {
  // 正六边形 6 个三角形，底部 1 个涂色
  const h = $('p1a');
  const [cx, cy, R] = [80, 60, 52];
  for (let i = 0; i < 6; i += 1) {
    const t0 = (i * Math.PI) / 3;
    const t1 = t0 + Math.PI / 3;
    const p = (t) => `${(cx + R * Math.cos(t)).toFixed(2)},${(cy + R * Math.sin(t)).toFixed(2)}`;
    el('polygon', { points: `${cx},${cy} ${p(t0)} ${p(t1)}`, fill: i === 1 ? FILL : '#fff', stroke: LINE, 'stroke-width': 2 }, h);
  }
  grid($('p1b'), { x: 35, y: 15, w: 90, h: 90, rows: 3, cols: 3, on: (i) => [0, 2, 4, 6, 8].includes(i) });
  // 15 个三角形，5 列 × 3 行，前 2 列涂色
  const t = $('p1c');
  el('ellipse', { cx: 80, cy: 60, rx: 76, ry: 52, fill: '#fff', stroke: '#e0569a', 'stroke-width': 2 }, t);
  for (let c = 0; c < 5; c += 1) {
    for (let r = 0; r < 3; r += 1) {
      const x = 32 + c * 24;
      const y = 38 + r * 22;
      el('polygon', { points: `${x},${y - 9} ${x - 9},${y + 7} ${x + 9},${y + 7}`, fill: c < 2 ? PEACH : '#fff', stroke: '#d0587e', 'stroke-width': 1.5 }, t);
    }
    if (c) dash(t, 20 + c * 24, 18, 20 + c * 24, 102);
  }
  // 8 个圆，4 份（田字虚线），右下 1 份不涂
  const d = $('p1d');
  el('ellipse', { cx: 80, cy: 60, rx: 76, ry: 52, fill: '#fff', stroke: '#e0569a', 'stroke-width': 2 }, d);
  dash(d, 80, 10, 80, 110); dash(d, 6, 60, 154, 60);
  const c8 = [[38, 38], [60, 38], [100, 38], [122, 38], [38, 82], [60, 82], [100, 82], [122, 82]];
  dots(d, c8, 9, (i) => !(i === 6 || i === 7));
}

/* ---------- 第 8 页：数轴 0~2，0~1 平均分成 6 份 ---------- */
function initNL() {
  const b = NumLine.board($('nl8'), { from: 0, to: 2, y: [-1.3, 1.5], h: 150 });
  NumLine.axis(b, { from: 0, to: 2, step: 1, label: (v) => String(v) });
  const POS = { A: 1 / 6, B: 4 / 6, C: 5 / 6 };
  for (let k = 1; k < 6; k += 1) b.seg([[k / 6, -0.1], [k / 6, 0.1]], { cls: 'nl-minor' });
  Object.entries(POS).forEach(([n, v]) => { b.pt([v, 0], { r: 6, cls: 'c2' }); b.text([v, 0], n, { cls: 'nl-lb', dy: -14 }); });
  b.text([2 / 6, 0], '1', { cls: 'nl-num', dy: 26 });
  b.seg([[2 / 6 - 0.035, -0.62], [2 / 6 + 0.035, -0.62]], { cls: 'nl-tick' });
  b.text([2 / 6, 0], '3', { cls: 'nl-num', dy: 52 });
  return b;
}

/* ---------- 第 9 页：练习八 1，涂出 2/3 ---------- */
const PAINT_SETS = [3, 6, 9];
function initPaint() {
  const svg = $('paint23');
  const state = PAINT_SETS.map(() => new Set());
  const boxes = [];
  PAINT_SETS.forEach((n, s) => {
    const y0 = 10 + s * 108;
    el('ellipse', { cx: 300, cy: y0 + 48, rx: 290, ry: 46, fill: '#fff', stroke: '#2a9fd6', 'stroke-width': 2 }, svg);
    const step = 480 / n;
    const flags = Array.from({ length: n }, (_, i) => {
      const x = 60 + step * (i + 0.5);
      const g = el('g', { class: 'tap', 'data-s': s, 'data-i': i }, svg);
      el('line', { x1: x - 12, x2: x - 12, y1: y0 + 22, y2: y0 + 76, stroke: '#6f8191', 'stroke-width': 3 }, g);
      return el('polygon', { points: `${x - 12},${y0 + 22} ${x + 22},${y0 + 34} ${x - 12},${y0 + 46}`, fill: '#fff', stroke: '#c0392b', 'stroke-width': 2 }, g);
    });
    boxes.push(flags);
  });
  const msg = $('paintMsg');
  const render = () => {
    boxes.forEach((flags, s) => flags.forEach((f, i) => f.setAttribute('fill', state[s].has(i) ? '#f05a5a' : '#fff')));
    const lines = PAINT_SETS.map((n, s) => {
      const k = state[s].size;
      const want = (n * 2) / 3;
      if (!k) return '';
      if (k === want) return `✓ ${n} 个涂 ${k} 个，正好是 $\\dfrac23$（平均分成 3 份，每份 ${n / 3} 个，涂 2 份）`;
      return `${n} 个涂了 ${k} 个：${k > want ? '多了' : '还不够'}。想一想：平均分成 3 份，每份几个？`;
    }).filter(Boolean);
    msg.className = `tip feedback small-t ${lines.length && lines.every((l) => l.startsWith('✓')) ? 'fb-ok' : ''}`;
    msg.innerHTML = lines.join('<br>') || '先想：每个图要平均分成几份？涂几份？';
    MathKit.tex(msg);
  };
  svg.addEventListener('click', (e) => {
    const g = e.target.closest('[data-s]');
    if (!g) return;
    const st = state[+g.dataset.s];
    const i = +g.dataset.i;
    if (st.has(i)) st.delete(i); else st.add(i);
    render();
  });
}

let nl = null;
window.LESSON = {
  init() {
    initRecall();
    initE1();
    initWB();
    initUnit();
    initP1();
    nl = initNL();
    initPaint();
    FracFig.exact();
  },
  onRender() { requestAnimationFrame(() => nl && nl.update()); },
};
