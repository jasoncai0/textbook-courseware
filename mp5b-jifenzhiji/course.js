'use strict';
/* 五下 求一个数是另一个数的几分之几 · 本课互动：例 4 平均分红彩带、彩带比一比（拖动蓝彩带、改红彩带长度，核心）、
 * 练习图。彩带长度按“每米同样长”精确画出。通用部分见 ../shared/fracfig.js */
const { el, bar, texFrac, FILL, LINE } = FracFig;
const $ = (id) => document.getElementById(id);
const RED = '#f28cb1';
const RED_LINE = '#d0456f';
const YEL = '#f7dc5c';
const BLUE = '#8fd3f4';
const text = (svg, x, y, s, cls = 'ff-t') => { const t = el('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
const rect = (svg, x, y, w, h, fill, stroke) => el('rect', { x, y, width: w, height: h, fill, stroke, 'stroke-width': 2 }, svg);
const dash = (svg, x1, y1, x2, y2, color = '#c0392b') => el('line', { x1, y1, x2, y2, stroke: color, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);

/* ---------- 例 4 ---------- */
function initE4() {
  const svg = $('e4');
  const [x0, W] = [110, 400];
  text(svg, 50, 52, '红彩带', 'ff-t s');
  rect(svg, x0, 30, W, 30, RED, RED_LINE);
  text(svg, 50, 132, '黄彩带', 'ff-t s');
  const ticks = el('g', { class: 'e4-ticks' }, svg);
  for (let k = 1; k < 4; k += 1) dash(ticks, x0 + (W * k) / 4, 24, x0 + (W * k) / 4, 66);
  for (let k = 0; k < 4; k += 1) text(ticks, x0 + (W * (k + 0.5)) / 4, 90, '1 份', 'ff-t s');
  const y = rect(svg, x0 + 180, 110, W / 4, 30, YEL, '#d9a800');
  y.classList.add('e4-move');
  $('e4Go').addEventListener('click', () => { svg.classList.add('cut'); });
  return y;
}

/* ---------- 第 4 页：彩带比一比 ---------- */
const RB = { a: 3, b: 4 };
const U = 76; // 每米的像素数（两条彩带同一比例）
const X0 = 110;
const B_MIN = 2;
const B_MAX = 8;
const A_MAX = 11;
function initRB() {
  const svg = $('rb');
  const g = el('g', {}, svg);
  const handle = el('g', { class: 'rb-handle' }, svg);
  el('circle', { r: 26, fill: 'rgba(217,113,28,.18)' }, handle);
  el('circle', { r: 12, fill: '#d9711c', stroke: '#fff', 'stroke-width': 3 }, handle);
  const msg = $('rbMsg');
  const render = () => {
    const { a, b } = RB;
    g.innerHTML = '';
    $('rbB').textContent = b;
    text(g, 50, 70, '红', 'ff-t');
    rect(g, X0, 48, b * U, 34, RED, RED_LINE);
    for (let k = 0; k <= b; k += 1) {
      if (k > 0 && k < b) dash(g, X0 + k * U, 42, X0 + k * U, 88);
      dash(g, X0 + k * U, 96, X0 + k * U, 140, '#c9d4de');
      text(g, X0 + k * U, 34, `${k}`, 'ff-t s');
    }
    text(g, 50, 172, '蓝', 'ff-t');
    rect(g, X0, 150, a * U, 34, BLUE, LINE);
    for (let k = 1; k < a; k += 1) el('line', { x1: X0 + k * U, x2: X0 + k * U, y1: 150, y2: 184, stroke: LINE, 'stroke-width': 1, opacity: 0.5 }, g);
    text(g, X0 + (b * U) / 2, 112, `红彩带 ${b} 米（单位“1”）`, 'ff-t b');
    text(g, X0 + (a * U) / 2, 214, `蓝彩带 ${a} 米`, 'ff-t');
    handle.setAttribute('transform', `translate(${X0 + a * U} 167)`);
    const q = `$${a}\\div${b}=${texFrac(a, b)}$`;
    let tail = '';
    if (a === b) tail = '　两条一样长，是 1 倍。';
    else if (a > b) tail = '　蓝彩带比红彩带长，分子比分母大，这样的分数比 1 大（下一课认识它）。';
    msg.className = `tip feedback center ${a < b ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `把红彩带平均分成 <b>${b}</b> 份（每份 1 米），蓝彩带有这样的 <b>${a}</b> 份：蓝彩带的长是红彩带的 ${q}。${tail}`;
    MathKit.tex(msg);
  };
  const toA = (e) => {
    const p = svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const x = p.matrixTransform(svg.getScreenCTM().inverse()).x;
    return Math.min(A_MAX, Math.max(1, Math.round((x - X0) / U)));
  };
  let drag = false;
  svg.addEventListener('pointerdown', (e) => { drag = true; svg.setPointerCapture(e.pointerId); RB.a = toA(e); render(); e.preventDefault(); });
  svg.addEventListener('pointermove', (e) => { if (!drag) return; const a = toA(e); if (a !== RB.a) { RB.a = a; render(); } });
  svg.addEventListener('pointerup', () => { drag = false; });
  svg.addEventListener('pointercancel', () => { drag = false; });
  const setB = (d) => { RB.b = Math.min(B_MAX, Math.max(B_MIN, RB.b + d)); render(); };
  $('rbMinus').addEventListener('click', () => setB(-1));
  $('rbPlus').addEventListener('click', () => setB(1));
  render();
}

/* ---------- 其他图 ---------- */
function initFigs() {
  bar($('rcBar'), { x: 20, y: 18, w: 200, h: 34, n: 4, on: (i) => i === 0 });

  // 试一试：红 4 米，蓝 3 米（每米 100 像素）
  const tr = $('tr');
  const M = 100;
  text(tr, 55, 62, '红彩带', 'ff-t s');
  rect(tr, 100, 40, 4 * M, 30, RED, RED_LINE);
  for (let k = 1; k < 4; k += 1) dash(tr, 100 + k * M, 36, 100 + k * M, 74);
  text(tr, 300, 26, '4 米', 'ff-t');
  text(tr, 55, 132, '蓝彩带', 'ff-t s');
  rect(tr, 100, 110, 3 * M, 30, BLUE, LINE);
  text(tr, 250, 170, '3 米', 'ff-t');

  // 5 个圆，11 个三角形
  const ct = $('ct');
  for (let i = 0; i < 5; i += 1) el('circle', { cx: 40 + i * 46, cy: 26, r: 17, fill: '#f59fc4', stroke: '#d0456f', 'stroke-width': 2 }, ct);
  for (let i = 0; i < 11; i += 1) {
    const x = 40 + i * 46;
    el('polygon', { points: `${x},64 ${x - 19},96 ${x + 19},96`, fill: BLUE, stroke: LINE, 'stroke-width': 2 }, ct);
  }

  // 松树 8 棵、杨树 11 棵（每棵同样长）；平行四边形 底 10 cm、高 7 cm（每厘米 11 像素）
  const tr2 = $('tree');
  const T = 20;
  text(tr2, 30, 38, '松树', 'ff-t s'); el('line', { x1: 60, x2: 60 + 8 * T, y1: 34, y2: 34, stroke: LINE, 'stroke-width': 4 }, tr2);
  text(tr2, 60 + 4 * T, 22, '8 棵', 'ff-t s');
  text(tr2, 30, 88, '杨树', 'ff-t s'); el('line', { x1: 60, x2: 60 + 11 * T, y1: 84, y2: 84, stroke: LINE, 'stroke-width': 4 }, tr2);
  text(tr2, 60 + 5.5 * T, 72, '11 棵', 'ff-t s');
  const C = 11;
  const [px, py] = [340, 98];
  el('polygon', { points: `${px},${py} ${px + 10 * C},${py} ${px + 10 * C + 50},${py - 7 * C} ${px + 50},${py - 7 * C}`, fill: '#fff', stroke: LINE, 'stroke-width': 2.5 }, tr2);
  dash(tr2, px + 60, py, px + 60, py - 7 * C, '#d0456f');
  text(tr2, px + 80, py - 30, '7 cm', 'ff-t s');
  text(tr2, px + 5 * C, py + 18, '10 cm', 'ff-t s');

  // 12 支铅笔分成 2 份
  const pen = $('pen');
  for (let i = 0; i < 12; i += 1) {
    const x = 18 + i * 22 + (i >= 6 ? 12 : 0);
    rect(pen, x, 18, 10, 56, '#f2b134', '#b47b10');
    el('polygon', { points: `${x},18 ${x + 10},18 ${x + 5},6`, fill: '#f6e2c0', stroke: '#b47b10', 'stroke-width': 1.5 }, pen);
  }
  dash(pen, 150, 4, 150, 86, '#e0569a');

  // 10 个苹果分 5 份；12 只鸡分 4 份
  const ap = $('apple');
  el('ellipse', { cx: 150, cy: 65, rx: 145, ry: 60, fill: '#fff', stroke: LINE, 'stroke-width': 2 }, ap);
  for (let c = 0; c < 5; c += 1) {
    for (let r = 0; r < 2; r += 1) el('circle', { cx: 50 + c * 50, cy: 45 + r * 40, r: 15, fill: '#e74c3c', stroke: '#a93226', 'stroke-width': 1.5 }, ap);
    if (c) dash(ap, 25 + c * 50, 12, 25 + c * 50, 118, '#e0569a');
  }
  const hn = $('hen');
  el('ellipse', { cx: 150, cy: 65, rx: 145, ry: 60, fill: '#fff', stroke: LINE, 'stroke-width': 2 }, hn);
  for (let c = 0; c < 6; c += 1) for (let r = 0; r < 2; r += 1) el('circle', { cx: 40 + c * 44 + (c >= 3 ? 6 : 0), cy: 42 + r * 46, r: 14, fill: '#f6d55c', stroke: '#b38b00', 'stroke-width': 1.5 }, hn);
  dash(hn, 153, 8, 153, 122, '#e0569a'); dash(hn, 10, 65, 290, 65, '#e0569a');

  // 3 米木料锯成 4 段（每米 160 像素）
  const wd = $('wood');
  const WM = 160;
  rect(wd, 40, 30, 3 * WM, 30, '#e8c99a', '#9c6b2f');
  rect(wd, 40, 30, (3 * WM) / 4, 30, '#f2a65a', '#9c6b2f');
  for (let k = 1; k < 3; k += 1) el('line', { x1: 40 + k * WM, x2: 40 + k * WM, y1: 60, y2: 74, stroke: '#6f8191', 'stroke-width': 2 }, wd);
  for (let k = 1; k < 4; k += 1) el('line', { x1: 40 + (3 * WM * k) / 4, x2: 40 + (3 * WM * k) / 4, y1: 22, y2: 68, stroke: '#c0392b', 'stroke-width': 3 }, wd);
  ['0', '1 米', '2 米', '3 米'].forEach((s, k) => text(wd, 40 + k * WM, 92, s, 'ff-t s'));

  // 一堆煤，10 天烧完：平均分成 10 份
  const cl = $('coal');
  bar(cl, { x: 40, y: 30, w: 480, h: 30, n: 10, on: (i) => i < 3, fill: '#5d6d7e', line: '#2c3e50' });
  text(cl, 112, 90, '3 天', 'ff-t s'); text(cl, 280, 20, '这堆煤（10 天烧完）', 'ff-t s');
}

window.LESSON = {
  init() {
    initE4();
    initRB();
    initFigs();
    FracFig.exact();
  },
};
