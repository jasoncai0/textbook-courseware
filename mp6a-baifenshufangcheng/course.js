'use strict';
/* 六上 列方程解决百分数问题 · 本课互动：例 10、例 11 线段图（按百分比精确画）、可调的“十份”线段图（方程与“份数”想法对照）。
 * 剩下的吨数总取“剩下份数”的整数倍，保证总数是整数；所有数值由代码计算。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el } = FracFig;
const $ = (id) => document.getElementById(id);
const INK = '#2a3b4c';
const BASE = '#2a7fb8';
const DIFF = '#e8743b';

function brace(svg, x1, x2, y, up, label, color = INK) {
  const s = up ? -1 : 1;
  const m = (x1 + x2) / 2;
  const h = 12 * s;
  el('path', { d: `M${x1} ${y}q0 ${h} 10 ${h}H${m - 10}q10 0 10 ${h}q0 ${-h} 10 ${-h}H${x2 - 10}q10 0 10 ${-h}`, fill: 'none', stroke: color, 'stroke-width': 2 }, svg);
  el('text', { x: m, y: y + (up ? -30 : 46), class: 'ff-t s', style: `fill:${color}` }, svg).textContent = label;
}
function seg(svg, x1, x2, y, color, ticks = []) {
  el('line', { x1, x2, y1: y, y2: y, stroke: color, 'stroke-width': 4 }, svg);
  [x1, x2, ...ticks].forEach((x) => el('line', { x1: x, x2: x, y1: y - 9, y2: y + 9, stroke: color, 'stroke-width': 2.5 }, svg));
}

/* 第 3 页：例 10，一共 x 吨，运走 60%，还剩 48 吨（每小格 10%） */
function initSeg10() {
  const svg = $('seg10');
  const [x0, w, y] = [150, 600, 95];
  const X = (p) => x0 + (w * p) / 100;
  seg(svg, X(0), X(100), y, INK, [10, 20, 30, 40, 50, 60, 70, 80, 90].map(X));
  el('line', { x1: X(0), x2: X(60), y1: y, y2: y, stroke: DIFF, 'stroke-width': 6 }, svg);
  brace(svg, X(0), X(100), y - 14, true, '一共 x 吨（单位“1”）', BASE);
  brace(svg, X(0), X(60), y + 12, false, '运走 60%', DIFF);
  brace(svg, X(60), X(100), y + 12, false, '还剩 48 吨（40%）', INK);
}

/* 第 7 页：例 11，原计划 x 棵（100%），实际比原计划多 20%，共 480 棵 */
function initSeg11() {
  const svg = $('seg11');
  const [x0, u] = [150, 5]; // 1% = 5 像素
  const X = (p) => x0 + p * u;
  el('text', { x: 130, y: 62, class: 'ff-t', style: 'text-anchor:end' }, svg).textContent = '原计划';
  el('text', { x: 130, y: 122, class: 'ff-t', style: 'text-anchor:end' }, svg).textContent = '实际';
  seg(svg, X(0), X(100), 55, BASE);
  seg(svg, X(0), X(120), 115, INK, [X(100)]);
  el('line', { x1: X(100), x2: X(120), y1: 115, y2: 115, stroke: DIFF, 'stroke-width': 6 }, svg);
  el('line', { x1: X(100), x2: X(100), y1: 55, y2: 115, stroke: '#9aa8b4', 'stroke-dasharray': '4 4' }, svg);
  brace(svg, X(0), X(100), 41, true, 'x 棵（单位“1”）', BASE);
  brace(svg, X(100), X(120), 101, true, '多 20%', DIFF);
  brace(svg, X(0), X(120), 127, false, '480 棵', INK);
}

/* 第 6 页：十份线段图 */
function initBlocks() {
  const svg = $('blk');
  const p = $('bP');
  const r = $('bR');
  const render = () => {
    const pv = +p.value;
    const k = (100 - pv) / 10; // 剩下几份
    // 剩下的吨数取 k 的整数倍，滑块步长随之改变
    r.min = k; r.max = k * 20; r.step = k;
    const rv = Math.min(k * 20, Math.max(k, Math.round(+r.value / k) * k));
    r.value = rv;
    const one = rv / k;
    const total = one * 10;
    $('bPv').textContent = pv;
    $('bRv').textContent = rv;
    svg.innerHTML = '';
    const [x0, bw, y] = [60, 78, 80];
    for (let i = 0; i < 10; i += 1) {
      const gone = i < pv / 10;
      el('rect', { x: x0 + i * bw, y: y - 25, width: bw, height: 50, fill: gone ? '#fbd9c2' : '#d5eaf8', stroke: gone ? DIFF : BASE, 'stroke-width': 2 }, svg);
      el('text', { x: x0 + i * bw + bw / 2, y: y - 2, class: 'ff-t s' }, svg).textContent = '10%';
      if (!gone) el('text', { x: x0 + i * bw + bw / 2, y: y + 19, class: 'ff-t b', style: 'font-size:17px' }, svg).textContent = `${one} 吨`;
    }
    brace(svg, x0, x0 + 10 * bw, y - 31, true, `一共 x 吨（单位“1”）`, BASE);
    brace(svg, x0, x0 + (pv / 10) * bw, y + 31, false, `运走 ${pv}%`, DIFF);
    brace(svg, x0 + (pv / 10) * bw, x0 + 10 * bw, y + 31, false, `还剩 ${rv} 吨（${100 - pv}%）`, INK);
    const dec = String(+((100 - pv) / 100).toFixed(2));
    $('bEq').innerHTML = `<small>列方程</small><br>$x-${pv}\\%x=${rv}$<br>$${100 - pv}\\%x=${rv}$<br>$x=${rv}\\div${dec}=${total}$`;
    $('bWhy').innerHTML = `<small>想份数</small><br>剩下 ${k} 份是 ${rv} 吨<br>1 份：$${rv}\\div${k}=${one}$（吨）<br>10 份：$${one}\\times10=${total}$（吨）`;
    tex($('bEq'));
    tex($('bWhy'));
  };
  [p, r].forEach((i) => i.addEventListener('input', render));
  render();
}

window.LESSON = {
  init() {
    initSeg10();
    initSeg11();
    initBlocks();
  },
};
