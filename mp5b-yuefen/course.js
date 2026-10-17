'use strict';
/* 五下 约分 · 本课互动：例 13 邮票重新分组、约分器（同时除以公因数，小格合成大格，核心）、练习十条形图。
 * 格子位置、条形高度按数值精确计算。通用部分见 ../shared/fracfig.js */
const { el, gcd, FILL, LINE } = FracFig;
const $ = (id) => document.getElementById(id);
const text = (svg, x, y, s, cls = 'ff-t') => { const t = el('text', { x, y, class: cls }, svg); t.textContent = s; return t; };

/* ---------- 例 13：12 枚邮票（两版，每版 2 行 3 列），左版 6 枚送出 ---------- */
function initStamps() {
  const svg = $('stamps');
  const [W, H, gx, gy] = [86, 92, 10, 12];
  const pos = (col, row) => [20 + col * (W + gx) + (col >= 3 ? 26 : 0), 30 + row * (H + gy)];
  const groups = el('g', {}, svg);
  for (let col = 0; col < 6; col += 1) {
    for (let row = 0; row < 2; row += 1) {
      const [x, y] = pos(col, row);
      el('rect', { x, y, width: W, height: H, rx: 4, fill: col < 3 ? '#cfe8c5' : '#eef2f5', stroke: '#7a8c99', 'stroke-width': 2, 'stroke-dasharray': '3 2' }, svg);
      el('rect', { x: x + 10, y: y + 10, width: W - 20, height: H - 34, fill: col < 3 ? '#6aa84f' : '#a9b7c2' }, svg);
    }
  }
  text(svg, 160, 262 - 8, '送给小力', 'ff-t b');
  text(svg, 470, 262 - 8, '留下', 'ff-t s');
  const msg = $('stMsg');
  const show = (g) => {
    groups.innerHTML = '';
    svg.appendChild(groups);
    // 每 g 枚一份：g=1 每枚；g=2 每列（上下 2 枚）；g=6 每版
    const boxes = [];
    if (g === 1) for (let c = 0; c < 6; c += 1) for (let r = 0; r < 2; r += 1) boxes.push([c, r, c, r]);
    if (g === 2) for (let c = 0; c < 6; c += 1) boxes.push([c, 0, c, 1]);
    if (g === 6) boxes.push([0, 0, 2, 1], [3, 0, 5, 1]);
    boxes.forEach(([c0, r0, c1, r1]) => {
      const [x0, y0] = pos(c0, r0);
      const [x1, y1] = pos(c1, r1);
      el('rect', { x: x0 - 4, y: y0 - 4, width: x1 + W - x0 + 8, height: y1 + H - y0 + 8, rx: 8, fill: 'none', stroke: c0 < 3 ? '#c0392b' : '#1d6fa5', 'stroke-width': 3 }, groups);
    });
    const n = 12 / g;
    msg.innerHTML = `每 ${g} 枚看作一份：一共 <b>${n}</b> 份，送出 <b>${n / 2}</b> 份 → $\\dfrac{${n / 2}}{${n}}$`;
    MathKit.tex(msg);
  };
  $('stG').addEventListener('click', (e) => {
    const b = e.target.closest('[data-g]');
    if (!b) return;
    $('stG').querySelectorAll('[data-g]').forEach((x) => x.classList.toggle('solid', x === b));
    show(+b.dataset.g);
  });
  show(1);
}

/* ---------- 核心：约分器 ---------- */
const YF = { a0: 6, b0: 12, a: 6, b: 12, chain: [] };
const KS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
function initYF() {
  const svg = $('yf');
  const [X0, W, Y, H] = [40, 920, 30, 80];
  const msg = $('yfMsg');
  const draw = () => {
    const { a0, b0, a, b } = YF;
    svg.innerHTML = '';
    const g = b0 / b; // 每个大格含几个小格
    for (let i = 0; i < b0; i += 1) el('rect', { x: X0 + (W * i) / b0, y: Y, width: W / b0, height: H, fill: i < a0 ? FILL : '#fff', stroke: 'none' }, svg);
    for (let i = 1; i < b0; i += 1) {
      const big = i % g === 0;
      el('line', { x1: X0 + (W * i) / b0, x2: X0 + (W * i) / b0, y1: Y, y2: Y + H, stroke: big ? LINE : '#cfe3f1', 'stroke-width': big ? 3 : 1, class: 'yf-line' }, svg);
    }
    el('rect', { x: X0, y: Y, width: W, height: H, fill: 'none', stroke: LINE, 'stroke-width': 3 }, svg);
    text(svg, X0 + (W * a0) / b0 / 2, Y + H + 32, `涂色 ${a} 格`, 'ff-t b');
    text(svg, X0 + W - 60, Y + H + 32, `共 ${b} 格`, 'ff-t s');
    $('yfChain').innerHTML = `$${YF.chain.map(([p, q]) => `\\dfrac{${p}}{${q}}`).join('=')}$`;
    MathKit.tex($('yfChain'));
  };
  const buttons = () => {
    $('yfK').innerHTML = KS.map((k) => `<button type="button" class="btn" data-k="${k}">÷${k}</button>`).join('');
  };
  const start = (a, b) => {
    Object.assign(YF, { a0: a, b0: b, a, b, chain: [[a, b]] });
    msg.className = 'tip feedback center';
    msg.innerHTML = `${a} 和 ${b} 的公因数有哪些？选一个，同时除以它。`;
    draw();
  };
  $('yfF').addEventListener('click', (e) => {
    const bt = e.target.closest('[data-f]');
    if (!bt) return;
    $('yfF').querySelectorAll('[data-f]').forEach((x) => x.classList.toggle('solid', x === bt));
    const [a, b] = bt.dataset.f.split('/').map(Number);
    start(a, b);
  });
  $('yfK').addEventListener('click', (e) => {
    const bt = e.target.closest('[data-k]');
    if (!bt) return;
    const k = +bt.dataset.k;
    const { a, b } = YF;
    if (gcd(a, b) === 1) {
      msg.className = 'tip feedback center fb-ok';
      msg.innerHTML = `$\\dfrac{${a}}{${b}}$ 的分子、分母只有公因数 1，已经是<b>最简分数</b>了。`;
    } else if (a % k || b % k) {
      msg.className = 'tip feedback center fb-warn';
      msg.innerHTML = `${k} 不是 ${a} 和 ${b} 的公因数（${a % k ? a : b} 不能被 ${k} 整除），每 ${k} 格合不整齐，不能同时除以 ${k}。`;
    } else {
      YF.a = a / k; YF.b = b / k;
      YF.chain.push([YF.a, YF.b]);
      const done = gcd(YF.a, YF.b) === 1;
      msg.className = `tip feedback center ${done ? 'fb-ok' : ''}`;
      msg.innerHTML = `分子、分母同时除以 ${k}：每 ${(YF.b0 / YF.b)} 个小格合成 1 个大格，涂色部分没变。${done ? '　<b>✓ 约成最简分数了！</b>' : '　还能再约吗？'}`;
    }
    MathKit.tex(msg);
    draw();
  });
  buttons();
  start(6, 12);
}

/* ---------- 练习十 15 条形图 ---------- */
function initChart() {
  const svg = $('chart');
  const [x0, y0, h] = [50, 200, 170]; // 0 刻度在 y0，40 件高 h
  const Y = (v) => y0 - (h * v) / 40;
  for (let v = 0; v <= 40; v += 4) {
    el('line', { x1: x0, x2: 340, y1: Y(v), y2: Y(v), stroke: v ? '#bfe1f3' : '#1f2d3a', 'stroke-width': v ? 1 : 2 }, svg);
    text(svg, x0 - 18, Y(v) + 5, String(v), 'ff-t s ax-t');
  }
  [['一班', 36], ['二班', 24], ['三班', 30]].forEach(([n, v], i) => {
    const x = x0 + 30 + i * 95;
    el('rect', { x, y: Y(v), width: 50, height: y0 - Y(v), fill: '#f4b6d2', stroke: '#d0456f', 'stroke-width': 2 }, svg);
    text(svg, x + 25, Y(v) - 6, String(v), 'ff-t s');
    text(svg, x + 25, y0 + 22, n, 'ff-t s');
  });
  text(svg, 40, 14, '数量/件', 'ff-t s ax-t');
}

window.LESSON = {
  init() {
    initStamps();
    initYF();
    initChart();
    FracFig.exact();
  },
};
