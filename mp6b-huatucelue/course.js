'use strict';
/* 六下 选择画图的策略解决问题 · 本课互动：可调线段图（总人数平均分成 n 份、男生占 k 份）、练习里的线段图。
 * 每一份都按等长精确计算坐标；通用部分见 ../shared/math.js、mcheck.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const text = (svg, x, y, s, cls = 'fl m') => { const t = svgEl('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
const BLUE = '#5aa9e6';
const ORANGE = '#f5a65b';
const GREY = '#e6edf3';

/* 一条平均分成 n 份的线段：每份等长，color(i) 给第 i 份上色 */
function bar(svg, { x, y, w, h = 26, n, color }) {
  const u = w / n;
  for (let i = 0; i < n; i += 1) {
    svgEl('rect', { x: x + i * u, y, width: u, height: h, fill: color(i), stroke: '#3d5568', 'stroke-width': 2 }, svg);
  }
  return u;
}
/* 大括号：x1→x2，在 y 处，d = -1 朝上、1 朝下；标签写在括号尖外侧 */
function brace(svg, x1, x2, y, d, label, color = '#3d5568') {
  const q = 10;
  const m = (x1 + x2) / 2;
  svgEl('path', {
    d: `M${x1} ${y}q0 ${d * q} ${q} ${d * q}L${m - q} ${y + d * q}q${q} 0 ${q} ${d * q}q0 ${-d * q} ${q} ${-d * q}L${x2 - q} ${y + d * q}q${q} 0 ${q} ${-d * q}`,
    fill: 'none', stroke: color, 'stroke-width': 2,
  }, svg);
  return text(svg, m, y + d * (2 * q + (d > 0 ? 20 : 8)), label, 'fl m b');
}
const fmt = (v) => (Number.isInteger(v) ? `${v}` : `${+v.toFixed(2)}`);

/* 第 4 页：可调线段图 */
const GIRLS = 21;
function initSegBar() {
  const st = { n: 4, k: 1 };
  const svg = $('segBar');
  const render = () => {
    const { n, k } = st;
    svg.innerHTML = '';
    const [x, y, w] = [60, 90, 880];
    text(svg, x - 10, y + 20, '总数', 'fl').setAttribute('text-anchor', 'end');
    const u = bar(svg, { x, y, w, n, color: (i) => (i < k ? BLUE : ORANGE) });
    brace(svg, x, x + k * u, y - 4, -1, `男生占 ${k}/${n}`, '#1d6fa5');
    brace(svg, x + k * u, x + w, y - 4, -1, `女生 ${GIRLS} 人（${n - k} 份）`, '#c0631a');
    brace(svg, x, x + k * u, y + 30, 1, '? 人', '#1d6fa5');
    const one = GIRLS / (n - k);
    text(svg, x + w - 4, y + 82, `1 份 = ${GIRLS} ÷ ${n - k} = ${fmt(one)}（人）`, 'fl b').setAttribute('text-anchor', 'end');
    $('sbN').textContent = n; $('sbK').textContent = k;
    const msg = $('sbMsg');
    const ok = n === 5 && k === 2;
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = ok
      ? '<b>✓ 和例 1 相符：</b>总人数平均分成 5 份，男生占 2 份，女生占 3 份——女生 21 人就是这 3 份。'
      : `现在表示“男生占总人数的 $\\dfrac{${k}}{${n}}$”。例 1 是男生占 $\\dfrac25$，再调一调。`;
    tex(msg);
  };
  svg.parentElement.querySelector('.steppers').addEventListener('click', (e) => {
    const d = e.target.closest('[data-d]')?.dataset.d;
    if (!d) return;
    const step = d[1] === '+' ? 1 : -1;
    if (d[0] === 'n') st.n = Math.min(10, Math.max(2, st.n + step));
    else st.k += step;
    st.k = Math.min(st.n - 1, Math.max(1, st.k));
    render();
  });
  render();
}

/* 两条线段比较：a 份与 b 份（每份等长），标出相差部分 */
function twoBars(svg, { a, b, la, lb, u, x = 110, top = 30, gap = 62, diffLabel, totalLabel }) {
  const ya = top;
  const yb = top + gap;
  text(svg, x - 14, ya + 19, la, 'fl b').setAttribute('text-anchor', 'end');
  text(svg, x - 14, yb + 19, lb, 'fl b').setAttribute('text-anchor', 'end');
  bar(svg, { x, y: ya, w: a * u, n: a, color: () => BLUE });
  bar(svg, { x, y: yb, w: b * u, n: b, color: () => ORANGE });
  const [lo, hi] = a < b ? [a, b] : [b, a];
  const yl = a < b ? ya : yb;
  if (diffLabel) {
    svgEl('rect', { x: x + lo * u, y: yl, width: (hi - lo) * u, height: 26, fill: 'none', stroke: '#c0392b', 'stroke-width': 2, 'stroke-dasharray': '6 4' }, svg);
    text(svg, x + ((lo + hi) / 2) * u, yl + 19, diffLabel, 'fl m b').setAttribute('fill', '#c0392b');
  }
  if (totalLabel) {
    svgEl('line', { x1: x + Math.max(a, b) * u + 14, x2: x + Math.max(a, b) * u + 14, y1: ya, y2: yb + 26, stroke: '#3d5568', 'stroke-width': 2 }, svg);
    text(svg, x + Math.max(a, b) * u + 24, (ya + yb + 26) / 2 + 7, totalLabel, 'fl b');
  }
}

function initExercises() {
  // 练一练：公鸡 4 份、母鸡 7 份，相差 3 份 = 30 只
  twoBars($('henFig'), { a: 4, b: 7, la: '公鸡', lb: '母鸡', u: 105, x: 120, diffLabel: '少 30 只', top: 40, gap: 70 });
  // 练习五 1(1)：杯子平均分成 5 份，剩 3 份
  const cup = $('cupFig');
  for (let i = 0; i < 5; i += 1) svgEl('rect', { x: 30, y: 10 + i * 26, width: 100, height: 26, fill: i >= 2 ? '#fde0c2' : '#fff', stroke: '#f08a24', 'stroke-width': 1.5 }, cup);
  // 1(2)：花彩带 5 段、红彩带 7 段，每段等长
  const rib = $('ribFig');
  bar(rib, { x: 10, y: 20, w: 5 * 70, h: 26, n: 5, color: () => '#bfe8c4' });
  bar(rib, { x: 10, y: 66, w: 7 * 70, h: 26, n: 7, color: () => '#f7c3df' });
  // 练习五 2(1)：全程 10 份，已行 3 份
  const car = $('carFig');
  text(car, 30, 45, '甲地', 'fl m');
  text(car, 490, 45, '乙地', 'fl m');
  const u = bar(car, { x: 60, y: 28, w: 400, h: 22, n: 10, color: (i) => (i < 3 ? BLUE : GREY) });
  brace(car, 60, 60 + 3 * u, 52, 1, '30%？千米');
  brace(car, 60 + 3 * u, 460, 52, 1, '140 千米');
  // 2(2)：白兔 5 份、黑兔 3 份，多 12 只
  twoBars($('rabFig'), { a: 5, b: 3, la: '白兔', lb: '黑兔', u: 62, x: 80, top: 12, gap: 52, diffLabel: '多12只', totalLabel: '?只' });
  // 练习五 7：300 千米平均分成 5 份，客车 3 份、货车 2 份
  const tr = $('trainFig');
  const [x0, w] = [80, 840];
  text(tr, 50, 70, '甲', 'fl m b');
  text(tr, 950, 70, '乙', 'fl m b');
  const v = bar(tr, { x: x0, y: 50, w, h: 26, n: 5, color: (i) => (i < 3 ? BLUE : ORANGE) });
  brace(tr, x0, x0 + 3 * v, 46, -1, '客车 3 份 = 180 千米', '#1d6fa5');
  brace(tr, x0 + 3 * v, x0 + w, 46, -1, '货车 2 份 = 120 千米', '#c0631a');
  brace(tr, x0, x0 + w, 80, 1, '300 千米');
}

window.LESSON = {
  init() {
    initSegBar();
    initExercises();
  },
};
