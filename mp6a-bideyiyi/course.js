'use strict';
/* 六上 比的意义 · 本课互动：例 7 杯子图、例 8 按真实速度走 900 米、调果汁牛奶（比值相同颜色相同）、练习九的图。
 * 图中的杯数、方格数、份数、路程都由代码按题目数据画出，保证数量准确。通用部分见 ../shared/math.js、mcheck.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const JUICE = '#f5a623';
const MILK = '#fbf8ee';
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/* 一只杯子：左上角 (x, y)，宽 w，高 h */
function cup(parent, x, y, w, h, color) {
  const g = svgEl('g', {}, parent);
  svgEl('path', { d: `M${x} ${y}L${x + w} ${y}L${x + w * 0.88} ${y + h}L${x + w * 0.12} ${y + h}Z`, fill: '#fff', stroke: '#9fb0bf', 'stroke-width': 2 }, g);
  svgEl('path', { d: `M${x + w * 0.04} ${y + h * 0.28}L${x + w * 0.96} ${y + h * 0.28}L${x + w * 0.87} ${y + h - 3}L${x + w * 0.13} ${y + h - 3}Z`, fill: color, stroke: color === MILK ? '#d8d2bf' : 'none' }, g);
  return g;
}

/* 第 3 页：2 杯果汁、3 杯牛奶 */
function initCups7() {
  const svg = $('cups7');
  [JUICE, JUICE, MILK, MILK, MILK].forEach((c, i) => cup(svg, 20 + i * 100 + (i >= 2 ? 10 : 0), 20, 80, 130, c));
}

/* 第 4 页：两人走 900 米，按真实速度比例播放 */
const ROAD = { x0: 70, x1: 930, m: 900 };
const RUNNERS = [{ name: '小军', min: 15, y: 60, color: '#1d6fa5' }, { name: '小伟', min: 20, y: 125, color: '#d9711c' }];
const SEC_PER_MIN = 0.25;
function initRace() {
  const svg = $('race');
  const X = (m) => ROAD.x0 + ((ROAD.x1 - ROAD.x0) * m) / ROAD.m;
  for (let m = 0; m <= ROAD.m; m += 100) {
    svgEl('line', { x1: X(m), x2: X(m), y1: 22, y2: 150, stroke: '#dfe7ee', 'stroke-width': m % 300 ? 1 : 2 }, svg);
    if (m % 300 === 0) svgEl('text', { x: X(m), y: 16, class: 'r-tk' }, svg).textContent = `${m} 米`;
  }
  const dots = RUNNERS.map((r) => {
    svgEl('line', { x1: X(0), x2: X(ROAD.m), y1: r.y, y2: r.y, stroke: '#cdd8e2', 'stroke-width': 10, 'stroke-linecap': 'round' }, svg);
    const bar = svgEl('line', { x1: X(0), x2: X(0), y1: r.y, y2: r.y, stroke: r.color, 'stroke-width': 10, 'stroke-linecap': 'round' }, svg);
    const dot = svgEl('circle', { cx: X(0), cy: r.y, r: 13, fill: r.color, stroke: '#fff', 'stroke-width': 3 }, svg);
    svgEl('text', { x: 8, y: r.y + 7, class: 'r-name', fill: r.color }, svg).textContent = r.name;
    const done = svgEl('text', { x: X(ROAD.m) + 18, y: r.y + 7, class: 'r-done', fill: r.color }, svg);
    return { r, bar, dot, done };
  });
  const show = (t) => {
    dots.forEach(({ r, bar, dot, done }) => {
      const m = Math.min(ROAD.m, (ROAD.m / r.min) * t);
      bar.setAttribute('x2', X(m)); dot.setAttribute('cx', X(m));
      done.textContent = t >= r.min ? `${r.min} 分` : '';
    });
    $('raceT').textContent = Math.floor(t + 1e-9);
  };
  let raf = 0;
  $('raceGo').addEventListener('click', () => {
    cancelAnimationFrame(raf);
    const total = Math.max(...RUNNERS.map((r) => r.min));
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(total, (now - t0) / 1000 / SEC_PER_MIN);
      show(t);
      if (t < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });
  show(0);
}

/* 第 7 页：调果汁牛奶。颜色只由“果汁占几分之几”决定：比值相同 ⇒ 颜色完全相同 */
const MOM = { a: 2, b: 3 };
const MAX_CUPS = 12;
const GLASS_CUPS = 24; // 杯子最多装 24 小杯，液面高度按总杯数精确画
const mixColor = (a, b) => {
  const p = a / (a + b);
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [j, m] = [hex(JUICE), hex(MILK)];
  return `rgb(${j.map((v, i) => Math.round(m[i] + (v - m[i]) * p)).join(',')})`;
};
// 直壁杯：液面高度与杯数成正比（总量看得出不同，颜色只看比）
function drawGlass(svg, a, b) {
  svg.innerHTML = '';
  const [x0, x1, top, bot] = [45, 155, 14, 196];
  const level = bot - ((bot - top) * (a + b)) / GLASS_CUPS;
  svgEl('rect', { x: x0, y: level, width: x1 - x0, height: bot - level, fill: mixColor(a, b) }, svg);
  svgEl('path', { d: `M${x0} ${top}V${bot}H${x1}V${top}`, fill: 'none', stroke: '#7d8e9c', 'stroke-width': 3 }, svg);
}
function fracTex(a, b) {
  const g = gcd(a, b);
  return b / g === 1 ? `${a / g}` : `\\dfrac{${a / g}}{${b / g}}`;
}
function initMix() {
  const st = { a: 4, b: 3, found: new Set() };
  drawGlass($('mixMom'), MOM.a, MOM.b);
  const render = () => {
    const { a, b } = st;
    drawGlass($('mixYou'), a, b);
    $('mixA').textContent = a; $('mixB').textContent = b;
    $('mixRatio').innerHTML = `$${a}:${b}$　比值 $${fracTex(a, b)}$`;
    const cups = $('mixCups');
    cups.innerHTML = '';
    [...Array(a).fill(JUICE), ...Array(b).fill(MILK)].forEach((c, i) => cup(cups, 2 + i * 24.8, 8, 20, 44, c));
    const same = a * MOM.b === b * MOM.a;
    if (same) st.found.add(`${a}:${b}`);
    const msg = $('mixMsg');
    msg.className = `tip feedback ${same ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = same
      ? `<b>✓ 颜色一样！</b>$${a}:${b}$ 的比值是 $${fracTex(a, b)}$，和妈妈的 $2:3$ 一样。`
      : `${a * MOM.b > b * MOM.a ? '果汁偏多，颜色<b>更黄</b>' : '牛奶偏多，颜色<b>更淡</b>'}。比值 $${fracTex(a, b)}$，妈妈的是 $\\dfrac23$。`;
    const list = [...st.found].sort((p, q) => +p.split(':')[0] - +q.split(':')[0]);
    $('mixFound').innerHTML = list.length ? list.map((r) => `$${r}$`).join('　') : '还没有找到，试一试！';
    $('mixFound').classList.toggle('muted', !list.length);
    [msg, $('mixRatio'), $('mixFound')].forEach(tex);
  };
  document.querySelector('.steppers').addEventListener('click', (e) => {
    const d = e.target.closest('[data-d]')?.dataset.d;
    if (!d) return;
    const k = d[0];
    st[k] = Math.min(MAX_CUPS, Math.max(1, st[k] + (d[1] === '+' ? 1 : -1)));
    render();
  });
  render();
}

/* 第 10 页：练习九第 1 题的两幅图（5×5 红白相间；圆平均分成 10 份，3 份黄色） */
const PIE_YELLOW = [1, 4, 7];
function initExFigs() {
  const ck = $('checker');
  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      svgEl('rect', { x: 5 + j * 28, y: 5 + i * 28, width: 28, height: 28, fill: (i + j) % 2 ? '#fff' : '#f287c4', stroke: '#e0569a', 'stroke-width': 1.5 }, ck);
    }
  }
  const pie = $('pie');
  const [c, R, n] = [75, 68, 10];
  for (let k = 0; k < n; k += 1) {
    const t0 = -Math.PI / 2 + (k * 2 * Math.PI) / n;
    const t1 = t0 + (2 * Math.PI) / n;
    const p = (t) => `${(c + R * Math.cos(t)).toFixed(2)} ${(c + R * Math.sin(t)).toFixed(2)}`;
    svgEl('path', { d: `M${c} ${c}L${p(t0)}A${R} ${R} 0 0 1 ${p(t1)}Z`, fill: PIE_YELLOW.includes(k) ? '#f7e017' : '#7cbf2a', stroke: '#2b3a1e', 'stroke-width': 1.5 }, pie);
  }
}

window.LESSON = {
  init() {
    initCups7();
    initRace();
    initMix();
    initExFigs();
  },
};
