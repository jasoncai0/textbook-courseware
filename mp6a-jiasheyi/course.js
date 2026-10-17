'use strict';
/* 六上 用假设的策略解决问题（一）· 本课互动：杯子图（液面高度 ∝ 容量，大杯 = 3 小杯）、
 * 换杯子假设表（大杯 ⇄ 3 小杯，总量不变）、线段图（720 毫升按 80/240 比例画）、6 小杯换 2 大杯。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const txt = (p, x, y, s, cls = 'lb') => { el('text', { x, y, class: cls }, p).textContent = s; };

const TOTAL = 720;
const SMALL = 80;
const BIG = 240;
const PX_PER_ML = 150 / BIG; // 大杯液面 150 像素，小杯 50 像素：高度与容量成正比
const CUP_W = 44;
const BASE_Y = 215;

/* 直壁杯：x 为左边，cap 为容量（毫升） */
function cup(svg, x, cap, label) {
  const h = cap * PX_PER_ML;
  const g = el('g', {}, svg);
  el('rect', { x, y: BASE_Y - h, width: CUP_W, height: h, fill: '#f8a531', opacity: 0.9 }, g);
  el('path', { d: `M${x} ${BASE_Y - h - 8}V${BASE_Y}H${x + CUP_W}V${BASE_Y - h - 8}`, fill: 'none', stroke: '#7d8e9c', 'stroke-width': 3 }, g);
  if (label) txt(g, x + CUP_W / 2, BASE_Y + 24, label, 'lb s');
  return g;
}
function cupRow(svg, big, small, opt = {}) {
  svg.innerHTML = '';
  const gap = 14;
  const n = big + small;
  const W = n * CUP_W + (n - 1) * gap;
  let x = (560 - W) / 2;
  for (let i = 0; i < big; i += 1) { cup(svg, x, BIG, '大杯'); x += CUP_W + gap; }
  for (let i = 0; i < small; i += 1) { cup(svg, x, SMALL, '小杯'); x += CUP_W + gap; }
  if (opt.brace !== false) {
    const x0 = (560 - W) / 2;
    el('path', { d: `M${x0} 40v-8H${x0 + W}v8`, fill: 'none', stroke: '#d6448f', 'stroke-width': 2 }, svg);
    txt(svg, 280, 22, `一共 ${TOTAL} 毫升`, 'lb s');
  }
  return (560 - W) / 2;
}

/* 核心：换杯子 */
function initSwap() {
  const st = { big: 1, small: 6, log: [] };
  const tab = $('swTab');
  const render = () => {
    cupRow($('swap'), st.big, st.small);
    tab.querySelectorAll('tr.r').forEach((r) => r.remove());
    [['原题', 1, 6], ...st.log].forEach(([k, b, s]) => {
      const tr = document.createElement('tr');
      tr.className = 'r';
      tr.innerHTML = `<td>${k}</td><td>${b}</td><td>${s}</td><td>${b * BIG + s * SMALL === TOTAL ? '720 毫升' : '？'}</td>`;
      tab.appendChild(tr);
    });
    let msg = `现在有 ${st.big} 个大杯、${st.small} 个小杯，总量还是 ${TOTAL} 毫升。`;
    if (st.big === 0) msg = `<b>✓ 全是小杯了！</b>相当于 ${st.small} 个小杯装 720 毫升：每个小杯 $720\\div${st.small}=${TOTAL / st.small}$（毫升）。`;
    if (st.small === 0) msg = `<b>✓ 全是大杯了！</b>相当于 ${st.big} 个大杯装 720 毫升：每个大杯 $720\\div${st.big}=${TOTAL / st.big}$（毫升）。`;
    const m = $('swMsg');
    m.innerHTML = msg;
    m.classList.toggle('fb-ok', st.big === 0 || st.small === 0);
    tex(m);
    $('toSmall').disabled = st.big === 0;
    $('toBig').disabled = st.small < 3;
  };
  $('toSmall').addEventListener('click', () => {
    if (!st.big) return;
    st.big -= 1; st.small += 3;
    st.log.push([`第 ${st.log.length + 1} 次`, st.big, st.small]);
    render();
  });
  $('toBig').addEventListener('click', () => {
    if (st.small < 3) return;
    st.big += 1; st.small -= 3;
    st.log.push([`第 ${st.log.length + 1} 次`, st.big, st.small]);
    render();
  });
  $('swReset').addEventListener('click', () => { Object.assign(st, { big: 1, small: 6, log: [] }); render(); });
  render();
}

/* 线段图：720 毫升 = 6 × 80 + 240 */
function initSeg() {
  const svg = $('seg');
  const [x0, k] = [60, 540 / TOTAL];
  const y = 110;
  el('path', { d: `M${x0} 70v-8H${x0 + 540}v8`, fill: 'none', stroke: '#d6448f', 'stroke-width': 2 }, svg);
  txt(svg, x0 + 270, 50, '720 毫升');
  for (let i = 0; i < 6; i += 1) {
    const a = x0 + i * SMALL * k;
    el('line', { x1: a, x2: a + SMALL * k, y1: y, y2: y, stroke: '#2a9fd6', 'stroke-width': 7 }, svg);
    txt(svg, a + (SMALL * k) / 2, y + 40, '小', 'lb s');
  }
  const bx = x0 + 6 * SMALL * k;
  el('line', { x1: bx, x2: bx + BIG * k, y1: y, y2: y, stroke: '#d9711c', 'stroke-width': 7 }, svg);
  txt(svg, bx + (BIG * k) / 2, y + 40, '大杯', 'lb s');
  for (let i = 0; i <= 6; i += 1) el('line', { x1: x0 + i * SMALL * k, x2: x0 + i * SMALL * k, y1: y - 12, y2: y + 12, stroke: '#1f2d3a', 'stroke-width': 2 }, svg);
  el('line', { x1: x0 + 540, x2: x0 + 540, y1: y - 12, y2: y + 12, stroke: '#1f2d3a', 'stroke-width': 2 }, svg);
  const cuts = el('g', { class: 'cuts' }, svg);
  for (let i = 1; i < 3; i += 1) el('line', { x1: bx + i * SMALL * k, x2: bx + i * SMALL * k, y1: y - 12, y2: y + 12, stroke: '#d6448f', 'stroke-width': 2.5, 'stroke-dasharray': '4 3' }, cuts);
  txt(cuts, bx + (BIG * k) / 2, y + 70, '= 3 个小杯', 'lb s o');
  $('segGo').addEventListener('click', () => svg.classList.add('cut'));
}

/* 想一想：6 个小杯每 3 个一组，各换成 1 个大杯 */
function initBig() {
  const svg = $('cupsBig');
  const x0 = cupRow(svg, 1, 6);
  const step = CUP_W + 14;
  [1, 4].forEach((i) => {
    const a = x0 + i * step - 6;
    el('rect', { x: a, y: 120, width: 3 * step, height: 130, fill: 'none', stroke: '#d6448f', 'stroke-width': 2, 'stroke-dasharray': '6 4', rx: 8 }, svg);
    txt(svg, a + 1.5 * step - 3, 112, '= 1 个大杯', 'lb s o');
  });
}

window.LESSON = {
  init() {
    cupRow($('cups0'), 1, 6);
    initSwap();
    initSeg();
    initBig();
  },
};
