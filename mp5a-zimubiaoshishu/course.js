'use strict';
/* 五上 用字母表示数 · 本课互动：一个一个摆三角形（根数由代码数出）、数的阶梯 a × 3、280 千米公路（按比例）、
 * 1 厘米方格上的正方形（C = 4a，S = a²）、玲玲与妈妈的年龄条（差 28 岁不变）。 */
const { fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const STICK = ['#2e9b48', '#1f7a8c'];

/* 一根小棒：两端各缩进一点，让相邻小棒看得出是分开的 */
function stick(parent, [x1, y1], [x2, y2], color) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const [dx, dy] = [((x2 - x1) / len) * 4, ((y2 - y1) / len) * 4];
  return svgEl('line', { x1: x1 + dx, y1: y1 + dy, x2: x2 - dx, y2: y2 - dy, stroke: color, 'stroke-width': 7, 'stroke-linecap': 'round' }, parent);
}

/* 第 3 页：分开摆的三角形，每个 3 根 */
const TRI = { side: 56, gap: 12, max: 10 };
function initTri() {
  const svg = $('tri');
  const h = (TRI.side * Math.sqrt(3)) / 2;
  let n = 4;
  const draw = () => {
    svg.innerHTML = '';
    let sticks = 0;
    for (let i = 0; i < n; i += 1) {
      const x = (700 - n * (TRI.side + TRI.gap) + TRI.gap) / 2 + i * (TRI.side + TRI.gap); // 居中摆放
      const [A, B, C] = [[x, 95], [x + TRI.side, 95], [x + TRI.side / 2, 95 - h]];
      [[A, B], [B, C], [C, A]].forEach(([p, q]) => { stick(svg, p, q, STICK[i % 2]); sticks += 1; });
    }
    $('triRead').innerHTML = `摆了 <b>${n}</b> 个三角形，数一数：<b>${sticks}</b> 根小棒`;
  };
  $('triAdd').addEventListener('click', () => { n = Math.min(TRI.max, n + 1); draw(); });
  $('triSub').addEventListener('click', () => { n = Math.max(1, n - 1); draw(); });
  draw();
}

/* 第 4 页：a 取任意值，a × 3 实时算 */
function initLadder() {
  const show = (a) => { $('aOut').innerHTML = `$a=${a}$ 时，摆 ${a} 个三角形：${a} × 3 = <b>${a * 3}</b>（根）`; MathKit.tex($('aOut')); };
  $('aSl').addEventListener('input', (e) => show(+e.target.value));
  show(5);
}

/* 第 5 页：280 千米公路，按比例 */
const ROAD = { km: 280, x0: 70, x1: 930 };
function initRoad() {
  const svg = $('road');
  const X = (k) => ROAD.x0 + ((ROAD.x1 - ROAD.x0) * k) / ROAD.km;
  const draw = (b) => {
    svg.innerHTML = '';
    svgEl('rect', { x: X(0), y: 60, width: X(ROAD.km) - X(0), height: 16, rx: 3, fill: '#8d99a6' }, svg);
    svgEl('line', { x1: X(0), x2: X(ROAD.km), y1: 68, y2: 68, stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '14 10' }, svg);
    [['甲地', 0], ['乙地', ROAD.km]].forEach(([t, k]) => {
      svgEl('line', { x1: X(k), x2: X(k), y1: 52, y2: 84, stroke: '#163a5a', 'stroke-width': 3 }, svg);
      svgEl('text', { x: k ? X(k) + 30 : X(k) - 30, y: 75, class: 'rd-end' }, svg).textContent = t;
    });
    // 已行驶（蓝）与剩下（橙）两段，长度按千米数比例
    svgEl('rect', { x: X(0), y: 88, width: X(b) - X(0), height: 8, fill: '#1d6fa5' }, svg);
    svgEl('rect', { x: X(b), y: 88, width: X(ROAD.km) - X(b), height: 8, fill: '#d9711c' }, svg);
    if (b >= 30) svgEl('text', { x: (X(0) + X(b)) / 2, y: 124, class: 'rd-lb c1' }, svg).textContent = `已行驶 ${fmt(b, 1)} 千米`;
    if (ROAD.km - b >= 30) svgEl('text', { x: (X(b) + X(ROAD.km)) / 2, y: 124, class: 'rd-lb c2' }, svg).textContent = `剩下 280 − ${fmt(b, 1)} = ${fmt(ROAD.km - b, 1)} 千米`;
    const car = svgEl('g', { transform: `translate(${X(b)},0)` }, svg);
    svgEl('rect', { x: -26, y: 30, width: 52, height: 20, rx: 6, fill: '#2f6fd0' }, car);
    svgEl('rect', { x: -14, y: 18, width: 28, height: 15, rx: 5, fill: '#5d95e6' }, car);
    svgEl('circle', { cx: -14, cy: 52, r: 7, fill: '#1f2d3a' }, car);
    svgEl('circle', { cx: 14, cy: 52, r: 7, fill: '#1f2d3a' }, car);
    $('bOut').textContent = `${fmt(b, 1)} 千米`;
    $('bSl').value = b;
  };
  $('bSl').addEventListener('input', (e) => draw(+e.target.value));
  document.querySelector('.road .btns').addEventListener('click', (e) => { const t = e.target.closest('[data-b]'); if (t) draw(+t.dataset.b); });
  draw(50);
}

/* 第 6 页：1 厘米方格上的正方形 */
const SQ = { cell: 40, max: 6, o: 30 };
function initSquare() {
  const svg = svgEl('svg', { viewBox: '0 0 300 300', 'aria-label': '方格纸上的正方形' }, $('sqBoard'));
  const draw = (a) => {
    svg.innerHTML = '';
    const { cell, max, o } = SQ;
    for (let i = 0; i <= max; i += 1) {
      svgEl('line', { x1: o, x2: o + max * cell, y1: o + i * cell, y2: o + i * cell, class: 'gridl' }, svg);
      svgEl('line', { y1: o, y2: o + max * cell, x1: o + i * cell, x2: o + i * cell, class: 'gridl' }, svg);
    }
    svgEl('rect', { x: o, y: o, width: a * cell, height: a * cell, fill: 'rgba(79,155,208,.28)', stroke: '#1d6fa5', 'stroke-width': 4 }, svg);
    svgEl('text', { x: o + (a * cell) / 2, y: o - 8, class: 'sq-lb' }, svg).textContent = `a = ${fmt(a, 1)}`;
    $('sqOut').textContent = `${fmt(a, 1)} 厘米`;
    $('sqRead').innerHTML = `边长 <b>${fmt(a, 1)}</b> 厘米：<br>周长 $C$ = ${fmt(a, 1)} × 4 = <b>${fmt(a * 4, 2)}</b>（厘米）<br>面积 $S$ = ${fmt(a, 1)} × ${fmt(a, 1)} = <b>${fmt(a * a, 2)}</b>（平方厘米）`;
    MathKit.tex($('sqRead'));
  };
  $('sqSl').addEventListener('input', (e) => draw(+e.target.value));
  draw(3);
}

/* 第 9 页：年龄条，相差 28 岁 */
const AGE = { diff: 28, maxYear: 45, x0: 80, x1: 880 };
function initAge() {
  const svg = $('age');
  const X = (y) => AGE.x0 + ((AGE.x1 - AGE.x0) * y) / AGE.maxYear;
  const draw = (a) => {
    svg.innerHTML = '';
    for (let y = 0; y <= AGE.maxYear; y += 5) {
      svgEl('line', { x1: X(y), x2: X(y), y1: 22, y2: 178, stroke: '#e3eaf0', 'stroke-width': 1 }, svg);
      svgEl('text', { x: X(y), y: 192, class: 'ag-tk' }, svg).textContent = y;
    }
    svgEl('text', { x: 8, y: 62, class: 'ag-nm' }, svg).textContent = '玲玲';
    svgEl('text', { x: 8, y: 142, class: 'ag-nm' }, svg).textContent = '妈妈';
    svgEl('rect', { x: X(0), y: 42, width: X(a) - X(0), height: 28, rx: 4, fill: '#e0569a' }, svg);
    svgEl('rect', { x: X(0), y: 122, width: X(a) - X(0), height: 28, rx: 4, fill: '#e98bb9' }, svg);
    svgEl('rect', { x: X(a), y: 122, width: X(a + AGE.diff) - X(a), height: 28, fill: '#1d6fa5' }, svg);
    svgEl('line', { x1: X(a), x2: X(a), y1: 70, y2: 122, stroke: '#556575', 'stroke-dasharray': '4 3' }, svg);
    svgEl('text', { x: (X(a) + X(a + AGE.diff)) / 2, y: 141, class: 'ag-in' }, svg).textContent = '28 岁';
    svgEl('text', { x: X(a) + 6, y: 62, class: 'ag-v' }, svg).textContent = `${a} 岁`;
    svgEl('text', { x: X(a + AGE.diff), y: 170, class: 'ag-v end' }, svg).textContent = `${a} + 28 = ${a + AGE.diff} 岁`;
    $('ageOut').textContent = `${a} 岁`;
  };
  $('ageSl').addEventListener('input', (e) => draw(+e.target.value));
  draw(1);
}

window.LESSON = {
  init() {
    initTri();
    initLadder();
    initRoad();
    initSquare();
    initAge();
  },
};
