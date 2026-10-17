'use strict';
/* 五上 小数四则混合运算和简便计算 · 本课互动：例 14 按比例画的菜地（分开算 / 合起来算）、运算顺序逐步计算、
 * 运算律验证（两边结果由代码算出）。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent, txt) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (txt !== undefined) e.textContent = txt;
  if (parent) parent.appendChild(e);
  return e;
};
const fmt = (x) => String(+x.toFixed(6)); // 本课的数最多三位小数，保留 6 位再去尾 0，消除浮点误差

/* ---------- 第 3 页：菜地（1 米 = 60 单位） ---------- */
const PLOT = { u: 60, a: 6.5, b: 3.5, h: 3.8, x0: 60, y0: 34, gap: 34 };
function initPlot() {
  const svg = $('plot');
  const { u, a, b, h, x0, y0, gap } = PLOT;
  const H = h * u;
  const gA = svgEl('g', {}, svg);
  svgEl('rect', { x: x0, y: y0, width: a * u, height: H, class: 'pl-a' }, gA);
  svgEl('text', { x: x0 + (a * u) / 2, y: y0 + 46, class: 'pl-name' }, gA, '茄子');
  const tA = svgEl('text', { x: x0 + (a * u) / 2, y: y0 + H / 2 + 14, class: 'pl-eq' }, gA, '');
  const gB = svgEl('g', { class: 'pl-move' }, svg);
  svgEl('rect', { x: x0 + a * u, y: y0, width: b * u, height: H, class: 'pl-b' }, gB);
  svgEl('text', { x: x0 + a * u + (b * u) / 2, y: y0 + 46, class: 'pl-name' }, gB, '辣椒');
  const tB = svgEl('text', { x: x0 + a * u + (b * u) / 2, y: y0 + H / 2 + 14, class: 'pl-eq' }, gB, '');
  const tAll = svgEl('text', { x: x0 + ((a + b) * u) / 2, y: y0 + H / 2 + 14, class: 'pl-eq big' }, svg, '');
  // 宽
  svgEl('path', { d: `M${x0 - 18} ${y0}V${y0 + H}M${x0 - 26} ${y0}H${x0 - 10}M${x0 - 26} ${y0 + H}H${x0 - 10}`, class: 'pl-dim' }, svg);
  svgEl('text', { x: x0 - 30, y: y0 + H / 2, class: 'pl-dt', transform: `rotate(-90 ${x0 - 30} ${y0 + H / 2})` }, svg, '3.8 米');
  const dims = svgEl('g', {}, svg);
  const draw = (k) => {
    const sep = k === 'a';
    gB.setAttribute('transform', `translate(${sep ? gap : 0} 0)`);
    tA.textContent = sep ? `${a}×${h}=${fmt(a * h)}` : '';
    tB.textContent = sep ? `${b}×${h}=${fmt(b * h)}` : '';
    tAll.textContent = sep ? '' : `(${a}+${b})×${h}=${fmt((a + b) * h)}`;
    dims.innerHTML = '';
    const yd = y0 + H + 24;
    const seg = (xa, xb, t) => {
      svgEl('path', { d: `M${xa} ${yd}H${xb}M${xa} ${yd - 8}V${yd + 8}M${xb} ${yd - 8}V${yd + 8}`, class: 'pl-dim' }, dims);
      svgEl('text', { x: (xa + xb) / 2, y: yd + 30, class: 'pl-dt' }, dims, t);
    };
    if (sep) { seg(x0, x0 + a * u, `${a} 米`); seg(x0 + a * u + gap, x0 + (a + b) * u + gap, `${b} 米`); } else seg(x0, x0 + (a + b) * u, `${a} + ${b} = ${fmt(a + b)}（米）`);
  };
  $('plotPick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('plotPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    draw(btn.dataset.k);
  });
  draw('a');
}

/* ---------- 第 4 页：运算顺序（{…} 是这一步要算的部分） ---------- */
const ORD = [
  [['{3.2 × 1.5} + {4.8 ÷ 2.5}', '先乘除：3.2 × 1.5 和 4.8 ÷ 2.5 可以同时算'], ['= {4.8 + 1.92}', '后加减'], ['= 6.72', '']],
  [['0.42 ÷ [({3.2 − 0.5}) ÷ 9]', '先算小括号里的'], ['= 0.42 ÷ [{2.7 ÷ 9}]', '再算中括号里的'], ['= {0.42 ÷ 0.3}', '最后算中括号外面的'], ['= 1.4', '']],
];
function initOrder() {
  const st = { k: 0, n: 1 };
  const draw = () => {
    const lines = ORD[st.k].slice(0, st.n);
    $('ordBox').innerHTML = lines.map(([t, why], i) => {
      const html = t.replace(/\{([^}]*)\}/g, i === st.n - 1 ? '<mark>$1</mark>' : '$1');
      return `<div class="ord-l"><span>${html}</span><i>${i === st.n - 1 ? why : ''}</i></div>`;
    }).join('');
    $('ordGo').disabled = st.n >= ORD[st.k].length;
  };
  $('ordGo').addEventListener('click', () => { st.n += 1; draw(); });
  $('ordReset').addEventListener('click', () => { st.n = 1; draw(); });
  $('ordPick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('ordPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    Object.assign(st, { k: +btn.dataset.k, n: 1 });
    draw();
  });
  draw();
}

/* ---------- 第 5 页：运算律验证 ---------- */
const LAWS = [
  ['1.2 + 4.8', () => 1.2 + 4.8, '4.8 + 1.2', () => 4.8 + 1.2],
  ['8.9 + 3.6 + 6.4', () => 8.9 + 3.6 + 6.4, '8.9 + (3.6 + 6.4)', () => 8.9 + (3.6 + 6.4)],
  ['0.4 × 0.9 × 0.5', () => 0.4 * 0.9 * 0.5, '0.9 × (0.4 × 0.5)', () => 0.9 * (0.4 * 0.5)],
];
function initLaws() {
  const box = $('laws');
  box.innerHTML = LAWS.map(([l, , r], i) => `<div class="law-row" data-i="${i}">
    <span class="law-e">${l}<small class="law-v"></small></span>
    <div class="pick law-pick" data-ans="e"><button type="button" data-k="g">&gt;</button><button type="button" data-k="e">=</button><button type="button" data-k="l">&lt;</button></div>
    <span class="law-e">${r}<small class="law-v"></small></span>
    <button type="button" class="btn law-go">算一算</button></div>`).join('');
  MCheck.init(box);
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('.law-go');
    if (!btn) return;
    const row = btn.closest('.law-row');
    const [, fl, , fr] = LAWS[+row.dataset.i];
    const v = row.querySelectorAll('.law-v');
    v[0].textContent = `= ${fmt(fl())}`;
    v[1].textContent = `= ${fmt(fr())}`;
  });
}

window.LESSON = {
  init() {
    initPlot();
    initOrder();
    initLaws();
  },
};
