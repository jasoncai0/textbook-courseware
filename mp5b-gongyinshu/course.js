'use strict';
/* 五下 公因数和最大公因数 · 本课互动：例 9 正方形纸片铺长方形（按真实比例）、例 10 / 练一练维恩图、练一练数表、练习七裁正方形。
 * 通用部分见 ../shared/math.js、mcheck.js、mnum.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const { factors } = MNum;
const divLine = (a, k) => (a % k ? `${a} ÷ ${k} = ${Math.floor(a / k)}……${a % k}` : `${a} ÷ ${k} = ${a / k}`);

/* 第 2 页小图 */
function initMini() {
  const g = document.querySelector('.mini-tile');
  for (let r = 0; r < 3; r += 1) for (let c = 0; c < 6; c += 1) svgEl('rect', { x: 30 + c * 30, y: 10 + r * 30, width: 30, height: 30, fill: '#e3f1fb', stroke: '#1d6fa5', 'stroke-width': 2 }, g);
}

/* ---------- 用边长 k 的正方形铺 W×H 的长方形（单位：厘米，按比例画） ---------- */
const BOX = { VW: 640, VH: 420, X0: 40, Y0: 20, MW: 540, MH: 340 };
function drawTiles(svg, W, H, k) {
  const s = Math.min(BOX.MW / W, BOX.MH / H); // 每厘米多少单位
  const [x0, y0] = [BOX.X0, BOX.Y0];
  svg.innerHTML = '';
  const defs = svgEl('defs', {}, svg);
  const pat = svgEl('pattern', { id: `${svg.id}H`, width: 10, height: 10, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
  svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 10, stroke: '#c0392b', 'stroke-width': 3 }, pat);
  svgEl('rect', { x: x0, y: y0, width: W * s, height: H * s, class: 'tl-rect' }, svg);
  const cols = Math.floor(W / k);
  const rows = Math.floor(H / k);
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
    svgEl('rect', { x: x0 + c * k * s, y: y0 + r * k * s, width: k * s, height: k * s, class: `tl-sq ${(r + c) % 2 ? 'b' : ''}` }, svg);
  }
  // 铺不满的部分：右边剩 W % k，下边剩 H % k
  if (W % k) svgEl('rect', { x: x0 + cols * k * s, y: y0, width: (W % k) * s, height: H * s, fill: `url(#${svg.id}H)`, class: 'tl-left' }, svg);
  if (H % k) svgEl('rect', { x: x0, y: y0 + rows * k * s, width: cols * k * s, height: (H % k) * s, fill: `url(#${svg.id}H)`, class: 'tl-left' }, svg);
  svgEl('rect', { x: x0, y: y0, width: W * s, height: H * s, class: 'tl-out' }, svg);
  svgEl('text', { x: x0 + (W * s) / 2, y: y0 + H * s + 34, class: 'tl-dim' }, svg).textContent = `${W} 厘米`;
  const t = svgEl('text', { x: x0 + W * s + 30, y: y0 + (H * s) / 2, class: 'tl-dim v' }, svg);
  t.textContent = `${H} 厘米`;
  t.setAttribute('transform', `rotate(90 ${x0 + W * s + 30} ${y0 + (H * s) / 2})`);
  return { ok: W % k === 0 && H % k === 0, n: cols * rows };
}

function initTiler({ svg, btns, calc, found, W, H, max, start }) {
  const got = new Set();
  const show = (k, record = true) => {
    const { ok, n } = drawTiles($(svg), W, H, k);
    $(btns).querySelectorAll('button').forEach((b) => b.classList.toggle('solid', +b.dataset.k === k));
    $(calc).innerHTML = `<p>宽：${divLine(H, k)}</p><p>长：${divLine(W, k)}</p><p class="${ok ? 'ok' : 'no'}">${ok ? `正好铺满！用了 ${n} 个` : '有余数，铺不满（红色斜线部分）'}</p>`;
    if (ok && found && record) {
      got.add(k);
      $(found).textContent = [...got].sort((a, b) => a - b).map((v) => `${v} 厘米`).join('、');
      $(found).classList.remove('muted');
    }
  };
  for (let k = 1; k <= max; k += 1) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn';
    b.dataset.k = k;
    b.textContent = k;
    b.addEventListener('click', () => show(k));
    $(btns).appendChild(b);
  }
  show(start, false);
}

/* ---------- 维恩图 ---------- */
function venn(id, a, b) {
  const fa = factors(a);
  const fb = factors(b);
  const nums = [...new Set([...fa, ...fb])].sort((x, y) => x - y);
  const v = MNum.venn($(id), { la: `${a} 的因数`, lb: `${b} 的因数`, mid: `${a} 和 ${b} 的公因数`, nums, inA: (n) => fa.includes(n), inB: (n) => fb.includes(n) });
  $(`${id}Fill`).addEventListener('click', () => v.fill());
}

/* ---------- 练一练 1：1～30 数表 ---------- */
function initT30() {
  const t = MNum.table($('t30'), { from: 1, to: 30, cols: 15, tools: { t: (n) => 18 % n === 0, o: (n) => 30 % n === 0 } });
  MNum.tools($('t30Tools'), t);
  $('t30Auto').addEventListener('click', () => { t.clear('t'); t.clear('o'); t.auto('t', 150); t.auto('o', 150); });
}

window.LESSON = {
  init() {
    initMini();
    initTiler({ svg: 'tlFig', btns: 'tlK', calc: 'tlCalc', found: 'tlFound', W: 18, H: 12, max: 12, start: 6 });
    initTiler({ svg: 'cuFig', btns: 'cuK', calc: 'cuCalc', found: null, W: 15, H: 9, max: 9, start: 2 });
    venn('vn10', 8, 12);
    venn('vn15', 15, 20);
    initT30();
  },
};
