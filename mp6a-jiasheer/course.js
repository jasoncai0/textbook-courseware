'use strict';
/* 六上 用假设的策略解决问题（二）· 本课互动：盒子柱状图（柱高 ∝ 球数，大盒 = 小盒 + 8）、
 * 可调整的假设表（猜小盒个数 → 算总数 → 调整）、大盒换小盒拿走 8 个（总数 80 → 72）、小盒换大盒各添 8 个（→ 120）。 */
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

const TOTAL = 80;
const DIFF = 8;
const N_SMALL = 5;
const ANS_SMALL = 12;
const K = 6; // 每个球 6 像素高
const BOX_W = 50;
const GAP = 22;
const BASE_Y = 222;

/* 一排盒子：items = [{ base, extra, label, extraCls, extraTxt, num }] */
function boxRow(svg, items, braceText) {
  svg.innerHTML = '';
  const W = items.length * BOX_W + (items.length - 1) * GAP;
  const x0 = (560 - W) / 2;
  items.forEach((it, i) => {
    const x = x0 + i * (BOX_W + GAP);
    const hb = it.base * K;
    el('rect', { x, y: BASE_Y - hb, width: BOX_W, height: hb, fill: '#c9a06b', stroke: '#8a6a3e', 'stroke-width': 2 }, svg);
    if (it.extra) {
      const he = it.extra * K;
      el('rect', { x, y: BASE_Y - hb - he, width: BOX_W, height: he, class: it.extraCls || 'ex', 'stroke-width': 2 }, svg);
      if (it.extraTxt) txt(svg, x + BOX_W / 2, BASE_Y - hb - he - 8, it.extraTxt, 'lb s o');
    }
    if (it.num !== undefined) txt(svg, x + BOX_W / 2, BASE_Y - 10, String(it.num), 'lb w');
    txt(svg, x + BOX_W / 2, BASE_Y + 22, it.label, 'lb s');
  });
  if (braceText) {
    el('path', { d: `M${x0} 30v-7H${x0 + W}v7`, fill: 'none', stroke: '#d6448f', 'stroke-width': 2 }, svg);
    txt(svg, 280, 16, braceText, 'lb s');
  }
}
const original = (opts = {}) => [
  { base: ANS_SMALL, extra: DIFF, label: '大盒', extraTxt: '多 8 个', ...opts },
  ...Array.from({ length: N_SMALL }, () => ({ base: ANS_SMALL, label: '小盒' })),
];

/* 核心：猜一猜、调一调 */
const G_MIN = 1;
const G_MAX = 20;
function initGuess() {
  const st = { x: 10 };
  const tab = $('gTab');
  const draw = () => {
    $('gx').textContent = st.x;
    const total = st.x * (N_SMALL + 1) + DIFF;
    boxRow($('gfig'), [
      { base: st.x, extra: DIFF, label: '大盒', num: st.x + DIFF },
      ...Array.from({ length: N_SMALL }, () => ({ base: st.x, label: '小盒', num: st.x })),
    ], `总数 ${total} 个`);
  };
  document.querySelector('.guess').addEventListener('click', (e) => {
    const g = e.target.closest('[data-g]')?.dataset.g;
    if (!g) return;
    st.x = Math.min(G_MAX, Math.max(G_MIN, st.x + (g === '+' ? 1 : -1)));
    draw();
  });
  $('gTry').addEventListener('click', () => {
    const { x } = st;
    const big = x + DIFF;
    const total = big + N_SMALL * x;
    const d = total - TOTAL;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${x}</td><td>${big}</td><td>${big} + ${x}×5 = ${total}</td><td>${d === 0 ? '正好 ✓' : d > 0 ? `多 ${d}` : `少 ${-d}`}</td>`;
    if (d === 0) tr.className = 'hit';
    tab.appendChild(tr);
    if (tab.rows.length > 7) tab.deleteRow(1);
    const m = $('gMsg');
    m.innerHTML = d === 0 ? '<b>✓ 正好 80 个！</b>每个小盒 12 个，大盒 20 个。'
      : d < 0 ? `少了 ${-d} 个，小盒应该<b>再多猜一些</b>。` : `多了 ${d} 个，小盒应该<b>少猜一些</b>。`;
    m.classList.toggle('fb-ok', d === 0);
  });
  draw();
}

/* 假设全是小盒：大盒拿走 8 个 */
function initSwap() {
  const show = (done) => boxRow($('swap'), original(done ? { extraCls: 'gone', extraTxt: '拿走 8 个' } : {}), done ? '6 个小盒：80 − 8 = 72 个' : '一共 80 个');
  $('swGo').addEventListener('click', () => show(true));
  $('swBack').addEventListener('click', () => show(false));
  show(false);
}

/* 假设全是大盒：5 个小盒各添 8 个 */
function initSwapBig() {
  const show = (done) => boxRow($('swapBig'), [
    { base: ANS_SMALL, extra: DIFF, label: '大盒' },
    ...Array.from({ length: N_SMALL }, () => (done ? { base: ANS_SMALL, extra: DIFF, extraCls: 'add', extraTxt: '+8', label: '小→大' } : { base: ANS_SMALL, label: '小盒' })),
  ], done ? '6 个大盒：80 + 8 × 5 = 120 个' : '一共 80 个');
  $('sbGo').addEventListener('click', () => show(true));
  show(false);
}

window.LESSON = {
  init() {
    boxRow($('boxes0'), original(), '一共 80 个');
    initGuess();
    initSwap();
    initSwapBig();
  },
};
