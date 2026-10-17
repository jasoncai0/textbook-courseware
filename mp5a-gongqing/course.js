'use strict';
/* 五上 公顷和平方千米 · 本课互动：正方形一层层放大（边长 1 米 → 10 米 → 100 米 → 1000 米），
 * 每一层的大正方形里正好 10 × 10 个上一层的正方形（按真实比例缩放）。即时判对错见 ../shared/mcheck.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};

const LEVELS = [
  { side: '1 米', area: '1 平方米', calc: '$1\\times1=1$（平方米）', note: '大约是 3 张课桌面那么大。' },
  { side: '10 米', area: '100 平方米', calc: '$10\\times10=100$（平方米）', note: '大约 28 名同学手拉手围成的正方形。' },
  { side: '100 米', area: '1 公顷', calc: '$100\\times100=10000$（平方米）<br>= <b>1 公顷</b>', note: '比一个足球场还大一些。' },
  { side: '1000 米', area: '1 平方千米', calc: '$1000\\times1000=1000000$（平方米）<br>= 100 公顷 = <b>1 平方千米</b>', note: '大约是 100 个“1 公顷”。' },
];
const Z = { x: 30, y: 20, s: 360 };

function initZoom() {
  const svg = $('zoomFig');
  mk('rect', { x: Z.x, y: Z.y, width: Z.s, height: Z.s, class: 'z-sq' }, svg);
  const clip = mk('clipPath', { id: 'zClip' }, mk('defs', {}, svg));
  mk('rect', { x: Z.x, y: Z.y, width: Z.s, height: Z.s }, clip);
  const inner = mk('g', { class: 'z-inner' }, mk('g', { 'clip-path': 'url(#zClip)' }, svg));
  mk('rect', { x: Z.x, y: Z.y, width: Z.s, height: Z.s, class: 'z-edge' }, svg);
  const dim = mk('text', { x: Z.x + Z.s / 2, y: Z.y + Z.s + 34, class: 'z-dim' }, svg);
  const big = mk('text', { x: Z.x + Z.s / 2, y: Z.y + Z.s / 2 + 14, class: 'z-big' }, svg);
  const draw = (l, animate) => {
    inner.innerHTML = '';
    const c = Z.s / 10;
    if (l > 0) {
      mk('rect', { x: Z.x, y: Z.y, width: c, height: c, class: 'z-prev' }, inner);
      for (let i = 1; i < 10; i += 1) {
        mk('line', { x1: Z.x + i * c, y1: Z.y, x2: Z.x + i * c, y2: Z.y + Z.s, class: 'z-grid' }, inner);
        mk('line', { x1: Z.x, y1: Z.y + i * c, x2: Z.x + Z.s, y2: Z.y + i * c, class: 'z-grid' }, inner);
      }
    }
    // 放大前：上一层的正方形占满画面（scale 10）；放大后它缩成左上角的一小格
    inner.style.transition = 'none';
    inner.style.transform = animate ? 'scale(10)' : 'none';
    big.classList.toggle('hide', l > 0);
    if (animate) requestAnimationFrame(() => requestAnimationFrame(() => {
      inner.style.transition = '';
      inner.style.transform = 'none';
    }));
    dim.textContent = `边长 ${LEVELS[l].side}`;
    big.textContent = LEVELS[l].area;
    const card = $('zoomCard');
    card.innerHTML = `<p class="z-h">边长 <b>${LEVELS[l].side}</b> 的正方形</p><p>${LEVELS[l].calc}</p>`
      + (l > 0 ? `<p>里面有 <b>10 × 10 = 100</b> 个边长 ${LEVELS[l - 1].side}的正方形（左上角橙色的那一个）。</p>` : '')
      + `<p class="muted">${LEVELS[l].note}</p>`;
    MathKit.tex(card);
  };
  let cur = 0;
  $('zoomLv').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-l]');
    if (!btn) return;
    const l = +btn.dataset.l;
    $('zoomLv').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    draw(l, l === cur + 1);
    cur = l;
  });
  draw(0, false);
}

window.LESSON = {
  init() {
    initZoom();
  },
};
