'use strict';
/* 六下 比例的意义 · 本课互动：照片按设定的长、宽拉伸（比值 ≠ 1.6 就变形）、八折价目表任选两列组成比例。
 * 照片尺寸按厘米精确换算成坐标；通用部分见 ../shared/math.js、mcheck.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const label = (svg, x, y, s, anchor = 'middle') => { const t = svgEl('text', { x, y, class: 'fl', 'text-anchor': anchor }, svg); t.textContent = s; return t; };
const setMsg = (el, ok, html) => {
  el.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
  el.innerHTML = html;
  tex(el);
};
const fmt = (v) => `${+v.toFixed(2)}`;

/* 一幅 8×5 的风景画，按 (x, y) 处宽 w、高 h 拉伸（非等比时会变形） */
function picture(parent, x, y, w, h) {
  const g = svgEl('g', { transform: `translate(${x} ${y}) scale(${w / 8} ${h / 5})` }, parent);
  svgEl('rect', { x: 0, y: 0, width: 8, height: 5, fill: '#bfe3f7' }, g);
  svgEl('path', { d: 'M0 3.5Q2 3 4 3.4T8 3.2V5H0Z', fill: '#e6c77a' }, g);
  svgEl('rect', { x: 4.55, y: 1.9, width: 0.2, height: 1.6, fill: '#7a5230' }, g);
  svgEl('ellipse', { cx: 4.65, cy: 1.75, rx: 1.15, ry: 0.5, fill: '#4f8f3a' }, g);
  svgEl('circle', { cx: 1.4, cy: 1.1, r: 0.5, fill: '#ffd36b' }, g);
  svgEl('rect', { x: 0, y: 0, width: 8, height: 5, fill: 'none', stroke: '#3d5568', 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke' }, g);
  return g;
}

/* 第 3 页：例 3 两张照片（1 cm = 25 单位） */
function initPhotos() {
  const svg = $('ph3');
  const K = 25;
  picture(svg, 30, 80, 6.4 * K, 4 * K);
  label(svg, 30 + 3.2 * K, 80 + 4 * K + 26, '6.4 cm');
  label(svg, 30 + 6.4 * K + 8, 80 + 2 * K + 7, '4 cm', 'start');
  label(svg, 30 + 3.2 * K, 70, '放大前');
  picture(svg, 270, 30, 9.6 * K, 6 * K);
  label(svg, 270 + 4.8 * K, 30 + 6 * K + 26, '9.6 cm');
  label(svg, 270 + 9.6 * K + 8, 30 + 3 * K + 7, '6 cm', 'start');
  label(svg, 270 + 4.8 * K, 22, '放大后');
}

/* 第 5 页：调照片 */
const BASE = { l: 6.4, w: 4 };
function initLive() {
  const svg = $('phLive');
  const K = 26;
  const found = new Set();
  const render = () => {
    const l = +$('phL').value;
    const w = +$('phW').value;
    svg.innerHTML = '';
    picture(svg, 20, 10, l * K, w * K);
    $('phLv').textContent = `${fmt(l)} cm`;
    $('phWv').textContent = `${fmt(w)} cm`;
    const same = Math.round(l * 10) * BASE.w * 10 === Math.round(w * 10) * BASE.l * 10;
    if (same) found.add(`${fmt(l)}:${fmt(w)}`);
    setMsg($('phMsg'), same, same
      ? `<b>✓ 不变形！</b>$${fmt(l)}:${fmt(w)}$ 的比值是 1.6，和原来一样：$6.4:4=${fmt(l)}:${fmt(w)}$。`
      : `$${fmt(l)}:${fmt(w)}$ 的比值约是 ${fmt(l / w)}，不是 1.6——照片被${l / w > 1.6 ? '<b>压扁</b>' : '<b>拉长</b>'}了。`);
    const list = [...found].sort((a, b) => parseFloat(a) - parseFloat(b));
    $('phFound').innerHTML = list.length ? list.map((r) => `$${r}$`).join('　') : '还没有找到，试一试！';
    $('phFound').classList.toggle('muted', !list.length);
    tex($('phFound'));
  };
  ['phL', 'phW'].forEach((id) => $(id).addEventListener('input', render));
  render();
}

/* 第 8 页：八折价目表，任选两列 */
const PRICE = [[50, 40], [80, 64], [150, 120], [200, 160]];
function initPrice() {
  const tab = $('priceTab');
  let pick = [];
  const render = () => {
    tab.querySelectorAll('td').forEach((td) => td.classList.toggle('sel', pick.includes(+td.dataset.c)));
    if (pick.length < 2) {
      setMsg($('priceMsg'), false, pick.length ? '再点一列。' : '点表格里的一列（原价和现价）。');
      return;
    }
    const [[a, b], [c, d]] = pick.map((i) => PRICE[i]);
    setMsg($('priceMsg'), a * d === b * c, `$${a}:${b}=${a / b}$，$${c}:${d}=${c / d}$，比值相等，组成比例：$${a}:${b}=${c}:${d}$。`);
  };
  tab.addEventListener('click', (e) => {
    const td = e.target.closest('td[data-c]');
    if (!td) return;
    const c = +td.dataset.c;
    pick = pick.includes(c) ? pick.filter((x) => x !== c) : [...pick, c].slice(-2);
    render();
  });
  render();
}

/* 第 10 页：三张剪纸（1 cm = 6.5 单位） */
function initCuts() {
  const svg = $('cut5');
  const K = 6.5;
  const bottom = 150;
  let x = 40;
  [[10, 15], [18, 12], [24, 16]].forEach(([w, h]) => {
    svgEl('rect', { x, y: bottom - h * K, width: w * K, height: h * K, fill: '#e2453c', stroke: '#9e1f18', 'stroke-width': 2 }, svg);
    label(svg, x + (w * K) / 2, bottom + 24, `${w} cm`);
    label(svg, x - 6, bottom - (h * K) / 2 + 7, `${h}`, 'end');
    x += w * K + 50;
  });
}

window.LESSON = {
  init() {
    initPhotos();
    initLive();
    initPrice();
    initCuts();
  },
};
