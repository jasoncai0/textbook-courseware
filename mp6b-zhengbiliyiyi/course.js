'use strict';
/* 六下 正比例的意义 · 本课互动：例 1 汽车按 80 千米/时行驶（公路刻度按千米精确画，表格同步）、试一试点铅笔、
 * 比值检测仪（课本五组数据，每列比值按真实数值画成柱子）、练习十第 2 题正方形按 1 cm 一格画。 */
const { fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const txt = (svg, x, y, s, cls) => { svgEl('text', { x, y, class: cls }, svg).textContent = s; };

/* ---------- 例 1：汽车 ---------- */
const SPEED = 80;
const HOURS = 7;
const ROAD = { x0: 60, x1: 900 }; // 0～560 千米
const kmX = (km) => ROAD.x0 + ((ROAD.x1 - ROAD.x0) * km) / (SPEED * HOURS);
function initCar() {
  const svg = $('road');
  svgEl('rect', { x: ROAD.x0 - 20, y: 70, width: ROAD.x1 - ROAD.x0 + 40, height: 34, rx: 6, fill: '#6f7c88' }, svg);
  svgEl('line', { x1: ROAD.x0 - 14, x2: ROAD.x1 + 14, y1: 87, y2: 87, stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '14 10' }, svg);
  for (let h = 0; h <= HOURS; h += 1) {
    const x = kmX(SPEED * h);
    svgEl('line', { x1: x, x2: x, y1: 104, y2: 118, stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
    txt(svg, x, 138, `${SPEED * h}`, 'km');
  }
  txt(svg, ROAD.x1 + 40, 138, '千米', 'km');
  const trail = svgEl('rect', { x: ROAD.x0, y: 104, width: 0, height: 5, fill: '#d9711c' }, svg);
  const car = svgEl('g', {}, svg);
  svgEl('rect', { x: -26, y: -20, width: 52, height: 18, rx: 5, fill: '#c0392b' }, car);
  svgEl('path', { d: 'M-16 -20L-10 -32H10L18 -20Z', fill: '#e57368' }, car);
  [-14, 14].forEach((dx) => svgEl('circle', { cx: dx, cy: -1, r: 6, fill: '#1f2d3a' }, car));
  const tab = $('carTab');
  const show = (t) => {
    const km = SPEED * t;
    car.setAttribute('transform', `translate(${kmX(km)} 86)`);
    trail.setAttribute('width', kmX(km) - ROAD.x0);
    $('carTV').textContent = fmt(t, 2);
    $('carRead').innerHTML = `行驶 <b>${fmt(t, 2)}</b> 时，路程 <b>${fmt(km, 1)}</b> 千米`;
    const hs = Array.from({ length: HOURS }, (_, i) => i + 1);
    tab.innerHTML = `<tr><th>时间/时</th>${hs.map((h) => `<td class="${h <= t ? 'on' : ''}">${h}</td>`).join('')}<td>…</td></tr>`
      + `<tr><th>路程/千米</th>${hs.map((h) => `<td class="${h <= t ? 'on' : ''}">${h <= t ? SPEED * h : ''}</td>`).join('')}<td>…</td></tr>`;
  };
  const sl = $('carT');
  MathKit.slider(sl, (v) => show(v));
  let raf = 0;
  $('carPlay').addEventListener('click', () => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(HOURS, (now - t0) / 700); // 1 小时 ≈ 0.7 秒
      show(t);
      sl.value = Math.floor(t);
      if (t < HOURS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });
}

/* ---------- 试一试：铅笔 ---------- */
const PRICE = 0.4;
function initPencils() {
  const box = $('pencils');
  let n = 3;
  const render = () => {
    box.innerHTML = Array.from({ length: 6 }, (_, i) => `<button type="button" class="pen ${i < n ? 'on' : ''}" data-i="${i}" aria-label="第 ${i + 1} 支"></button>`).join('')
      + `<span class="pen-read">${n} 支，总价 ${fmt(n * PRICE, 2)} 元</span>`;
  };
  box.setAttribute('data-noswipe', '');
  box.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) { n = +b.dataset.i + 1; render(); } });
  render();
}

/* ---------- 比值检测仪：数据全部来自课本 ---------- */
const SETS = [
  { tab: '零件', q: '张师傅生产零件（练一练 1）：零件数量和时间成正比例吗？', x: '时间/时', y: '零件数量/个', xs: [1, 2, 4, 6, 8], ys: [25, 50, 100, 150, 200], yes: true, k: '工作效率' },
  { tab: '服装', q: '做同一种服装（练一练 2）：用布米数和套数成正比例吗？', x: '服装数量/套', y: '用布数量/米', xs: [1, 2, 3, 4, 5], ys: [2.2, 4.4, 6.6, 8.8, 11], yes: true, k: '每套用布米数' },
  { tab: '杂志', q: '订阅《趣味数学》（练习十 1）：总价和订阅数量成正比例吗？', x: '订阅数量/份', y: '总价/元', xs: [6, 8, 12, 10, 9], ys: [180, 240, 360, 300, 270], yes: true, k: '单价' },
  { tab: '正方形面积', q: '正方形（练习十 2）：面积和边长成正比例吗？', x: '边长/cm', y: '面积/cm²', xs: [1, 2, 3, 4], ys: [1, 4, 9, 16], yes: false },
  { tab: '身高', q: '小明（练习十一 4）：身高和年龄成正比例吗？', x: '年龄/岁', y: '身高/cm', xs: [10, 11, 12], ys: [140, 143, 150], yes: false },
];
function initDetector() {
  const st = { i: 0, run: false, guess: null };
  $('detTabs').innerHTML = SETS.map((s, i) => `<button type="button" class="btn" data-i="${i}">${s.tab}</button>`).join('');
  const svg = $('detBars');
  const render = () => {
    const s = SETS[st.i];
    document.querySelectorAll('#detTabs .btn').forEach((b) => b.classList.toggle('solid', +b.dataset.i === st.i));
    document.querySelectorAll('#detGuess .btn').forEach((b) => b.classList.toggle('solid', b.dataset.g === st.guess));
    $('detQ').textContent = s.q;
    $('detTab').innerHTML = `<tr><th>${s.x}</th>${s.xs.map((v) => `<td>${v}</td>`).join('')}</tr><tr><th>${s.y}</th>${s.ys.map((v) => `<td>${v}</td>`).join('')}</tr>`;
    svg.innerHTML = '';
    const ks = s.xs.map((x, j) => s.ys[j] / x);
    const max = Math.max(...ks);
    const [base, top, w] = [200, 30, 560 / s.xs.length];
    svgEl('line', { x1: 10, x2: 550, y1: base, y2: base, stroke: '#6f8191', 'stroke-width': 2 }, svg);
    ks.forEach((k, j) => {
      const h = st.run ? ((base - top) * k) / max : 0;
      const x = j * w + w / 2;
      svgEl('rect', { x: x - w * 0.28, y: base - h, width: w * 0.56, height: h, class: 'bar' }, svg);
      txt(svg, x, base + 22, `${s.ys[j]}÷${s.xs[j]}`, 'bar-x');
      if (st.run) txt(svg, x, base - h - 8, fmt(k, 2), 'bar-v');
    });
    const msg = $('detMsg');
    if (!st.run) { msg.className = 'tip feedback'; msg.innerHTML = st.guess ? '点“开始检测”验证你的猜想。' : '先猜一猜，再检测。'; return; }
    const same = ks.every((k) => Math.abs(k - ks[0]) < 1e-9);
    const right = st.guess === null ? '' : (st.guess === 'y') === s.yes ? '你猜对了！' : '和你猜的不一样哦。';
    msg.className = `tip feedback ${same ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = same
      ? `<b>柱子一样高：</b>比值都是 ${fmt(ks[0], 2)}（${s.k}一定），所以<b>成正比例</b>。${right}`
      : `<b>柱子高低不同：</b>比值不一定，虽然两个量一起增加，但<b>不成正比例</b>。${right}`;
  };
  $('detTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) { Object.assign(st, { i: +b.dataset.i, run: false, guess: null }); render(); } });
  $('detGuess').addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (b) { st.guess = b.dataset.g; render(); } });
  $('detRun').addEventListener('click', () => { st.run = true; render(); });
  render();
}

/* ---------- 练习十第 2 题：边长 1、2、3、4 cm 的正方形（1 cm = 40 单位） ---------- */
function initSquares() {
  const svg = $('sqFig');
  const U = 40;
  const [x0, y0] = [10, 200];
  for (let i = 0; i <= 10; i += 1) svgEl('line', { x1: x0 + i * U, x2: x0 + i * U, y1: y0, y2: y0 - 4 * U, class: 'grid' }, svg);
  for (let j = 0; j <= 4; j += 1) svgEl('line', { x1: x0, x2: x0 + 10 * U, y1: y0 - j * U, y2: y0 - j * U, class: 'grid' }, svg);
  let x = x0;
  [1, 2, 3, 4].forEach((a) => {
    svgEl('rect', { x, y: y0 - a * U, width: a * U, height: a * U, class: 'sq' }, svg);
    txt(svg, x + (a * U) / 2, y0 - a * U - 6, `${a} cm`, 'sq-lb');
    x += a * U;
  });
}

window.LESSON = {
  init() {
    initCar();
    initPencils();
    initDetector();
    initSquares();
  },
};
