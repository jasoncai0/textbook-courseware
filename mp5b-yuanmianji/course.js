'use strict';
/* 五下 圆的面积 · 本课互动：例 7 数方格、例 8 剪拼成近似长方形、拼成后的长宽关系图。通用部分见 ../shared/math.js、mcheck.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};

/* ---------- 第 3 页：例 7 数方格 ---------- */
const GRID = { C: 230, R: 200 }; // 圆心坐标、圆的半径（viewBox 单位）
const SAMPLES = 40;

// 每个小方格在 1/4 圆里的部分占几成（取样估算）
function cellShare(i, j, r) {
  let inside = 0;
  for (let a = 0; a < SAMPLES; a += 1) {
    for (let b = 0; b < SAMPLES; b += 1) {
      const x = i + (a + 0.5) / SAMPLES;
      const y = j + (b + 0.5) / SAMPLES;
      if (x * x + y * y <= r * r) inside += 1;
    }
  }
  return inside / (SAMPLES * SAMPLES);
}

// 整格 / 超过半格（看成整格）/ 不到半格（不算）
function classify(r) {
  const cells = [];
  for (let j = 0; j < r; j += 1) {
    for (let i = 0; i < r; i += 1) {
      const s = cellShare(i, j, r);
      if (s > 0) cells.push({ i, j, kind: s > 0.995 ? 'full' : s >= 0.5 ? 'big' : 'small' });
    }
  }
  return cells;
}

function initGrid() {
  const fig = $('gridFig');
  const st = { r: 4, full: false, part: false };
  const draw = () => {
    const { C, R } = GRID;
    const u = R / st.r;
    const cells = classify(st.r);
    fig.innerHTML = '';
    svgEl('circle', { cx: C, cy: C, r: R, class: 'g-circle' }, fig);
    svgEl('path', { d: `M${C - R} ${C}H${C}M${C} ${C}V${C + R}`, class: 'g-axis' }, fig);
    let no = 0;
    cells.forEach(({ i, j, kind }) => {
      const x = C + i * u;
      const y = C - (j + 1) * u;
      const on = kind === 'full' ? st.full : st.part;
      svgEl('rect', { x, y, width: u, height: u, class: `g-cell ${on ? kind : ''}` }, fig);
      if (!on) return;
      const t = svgEl('text', { x: x + u / 2, y: y + u / 2 + u * 0.15, class: 'g-num', 'font-size': u * 0.42 }, fig);
      if (kind === 'full') { no += 1; t.textContent = no; } else t.textContent = kind === 'big' ? '✓' : '✗';
    });
    for (let k = 0; k <= st.r; k += 1) {
      svgEl('line', { x1: C + k * u, y1: C - R, x2: C + k * u, y2: C, class: 'g-line' }, fig);
      svgEl('line', { x1: C, y1: C - k * u, x2: C + R, y2: C - k * u, class: 'g-line' }, fig);
    }
    svgEl('path', { d: `M${C} ${C - R}A${R} ${R} 0 0 1 ${C + R} ${C}`, class: 'g-arc' }, fig);
    svgEl('circle', { cx: C, cy: C, r: 4, fill: '#c0392b' }, fig);
    svgEl('text', { x: C - 26, y: C - 8, class: 'g-lb' }, fig).textContent = 'O';
    svgEl('text', { x: C + R / 2, y: C + 30, class: 'g-lb' }, fig).textContent = 'r';

    const n = (k) => cells.filter((c) => c.kind === k).length;
    $('nFull').textContent = st.full ? n('full') : '?';
    $('nBig').textContent = st.part ? n('big') : '?';
    $('nSmall').textContent = st.part ? n('small') : '?';
    const quarter = n('full') + n('big');
    setAnswer('bQuarter', quarter);
    setAnswer('bWhole', quarter * 4);
  };
  $('gridR').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-r]');
    if (!btn) return;
    Object.assign(st, { r: +btn.dataset.r, full: false, part: false });
    $('gridR').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    draw();
  });
  $('showFull').addEventListener('click', () => { st.full = !st.full; draw(); });
  $('showPart').addEventListener('click', () => { st.part = !st.part; draw(); });
  draw();
}

// 换一个圆时，填空的标准答案跟着换，已填的清空
function setAnswer(id, v) {
  const el = $(id);
  if (el.dataset.ans === String(v)) return;
  el.dataset.ans = String(v);
  el.classList.remove('ok', 'no');
  const inp = el.querySelector('input');
  if (inp) inp.value = '';
}

/* ---------- 第 5、6 页：把圆剪开拼成近似长方形 ---------- */
// 一个扇形：顶点在原点，中线沿 +x 方向
const sectorD = (R, a) => {
  const h = a / 2;
  const p = (t) => `${(R * Math.cos(t)).toFixed(2)} ${(R * Math.sin(t)).toFixed(2)}`;
  return `M0 0L${p(-h)}A${R} ${R} 0 0 1 ${p(h)}Z`;
};

// 精确拼法：相邻两块共用一条半径边。弦长 c = 2R·sin(π/n)，尖到弦的距离 h = R·cos(π/n)
const stripSize = (n, R) => ({ c: 2 * R * Math.sin(Math.PI / n), h: R * Math.cos(Math.PI / n) });

// 第 k 块在圆里 / 拼好后的位置与角度（度）；上半圆尖朝下（弦在 yt），下半圆尖朝上（尖在 yt），交错插空
function piecePose(k, n, g, assembled) {
  const a = (2 * Math.PI) / n;
  const top = k < n / 2;
  const mid = Math.PI + (k + 0.5) * a;
  if (!assembled) return { x: g.cx, y: g.cy, deg: ((top ? mid : mid - 2 * Math.PI) * 180) / Math.PI };
  const { c, h } = stripSize(n, g.R);
  const m = top ? k : k - n / 2;
  return top
    ? { x: g.x0 + (m + 0.5) * c, y: g.yt + h, deg: 270 }
    : { x: g.x0 + (m + 1) * c, y: g.yt, deg: 90 };
}

const poseCss = ({ x, y, deg }) => `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${deg.toFixed(2)}deg)`;

function drawPieces(svg, n, g, assembled) {
  const a = (2 * Math.PI) / n;
  return Array.from({ length: n }, (_, k) => {
    const p = svgEl('g', { class: `qp-piece ${k < n / 2 ? 'top' : 'bot'}` }, svg);
    svgEl('path', { d: sectorD(g.R, a) }, p);
    svgEl('path', { d: sectorD(g.R, a).replace(/^M0 0L/, 'M').replace(/Z$/, ''), class: 'arc' }, p);
    p.style.transform = poseCss(piecePose(k, n, g, assembled));
    return p;
  });
}

const QP = { cx: 170, cy: 165, R: 140, x0: 390, yt: 95 };
function initQiepin() {
  const svg = $('qpFig');
  const st = { n: 16, assembled: false, pieces: [] };
  const caption = svgEl('text', { x: 620, y: 300, class: 'qp-cap' }, svg);
  svgEl('circle', { cx: QP.cx, cy: QP.cy, r: QP.R, class: 'qp-ghost' }, svg);
  const layer = svgEl('g', {}, svg);
  const build = () => {
    layer.innerHTML = '';
    st.pieces = drawPieces(layer, st.n, QP, false);
    st.assembled = false;
    caption.textContent = '';
    $('qpGo').textContent = '拼一拼 ▶';
  };
  const move = () => {
    st.assembled = !st.assembled;
    st.pieces.forEach((p, k) => {
      // 拼：先移上半圆，再移下半圆插空；还原：一起回去
      p.style.transitionDelay = st.assembled && k >= st.n / 2 ? '.8s' : '0s';
      p.style.transform = poseCss(piecePose(k, st.n, QP, st.assembled));
    });
    caption.textContent = st.assembled ? (st.n <= 16 ? `${st.n} 份：拼成了一个近似的平行四边形` : `${st.n} 份：越来越接近长方形了`) : '';
    $('qpGo').textContent = st.assembled ? '↺ 还原成圆' : '拼一拼 ▶';
  };
  $('qpN').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]');
    if (!btn) return;
    st.n = +btn.dataset.n;
    $('qpN').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    build();
  });
  $('qpGo').addEventListener('click', move);
  build();
}

/* 第 6 页：拼好的近似长方形（32 份），标出长（下边蓝色弧 = 半个圆周）和宽（边上那条半径） */
function initRel() {
  const svg = $('relFig');
  const n = 32;
  const g = { cx: 0, cy: 0, R: 110, x0: 40, yt: 60 };
  const { c, h } = stripSize(n, g.R);
  const right = g.x0 + (n / 2 + 0.5) * c;
  const yb = g.yt + h;
  const pieces = svgEl('g', { class: 'rel-pieces' }, svg);
  drawPieces(pieces, n, g, true);
  const add = (tag, attrs, text, step) => {
    const e = svgEl(tag, attrs, svg);
    if (text) e.textContent = text;
    if (step) e.setAttribute('data-step', step);
    return e;
  };
  add('line', { x1: right - 0.5 * c, y1: g.yt, x2: right, y2: yb, class: 'rel-o' }, '', 3); // 最右边的半径边，长正好是 R
  add('text', { x: right + 14, y: (g.yt + yb) / 2 + 9, class: 'rel-t o start' }, '宽：r', 3);
  add('path', { d: `M${g.x0 + 0.5 * c} ${yb + 26}H${right}M${g.x0 + 0.5 * c} ${yb + 16}v20M${right} ${yb + 16}v20`, class: 'rel-b' }, '', 5);
  add('text', { x: (g.x0 + right) / 2, y: yb + 60, class: 'rel-t b' }, '长：蓝色弧合起来 = 半个圆周 = πr', 5);
  // 第 5 步时给下边的弧描蓝、上边的弧描红
  pieces.setAttribute('data-step', '5');
  pieces.classList.add('paint-arcs');
}

/* 小结：8 份的圆和它拼成的图形（同一套拼法，份数一致） */
function initSummary() {
  drawPieces($('sumCircle'), 8, { cx: 40, cy: 40, R: 34 }, false);
  const R = 34;
  const { c, h } = stripSize(8, R);
  drawPieces($('sumStrip'), 8, { R, x0: (120 - 4.5 * c) / 2, yt: (80 - h) / 2 }, true);
}

window.LESSON = {
  init() {
    initGrid();
    initQiepin();
    initRel();
    initSummary();
  },
};
