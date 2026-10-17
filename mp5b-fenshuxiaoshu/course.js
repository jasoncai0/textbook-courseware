'use strict';
/* 五下 分数和小数的互化 · 本课互动：例 9 直线上的 0.5 与 3/4、数轴放大镜（上分数刻度、下小数刻度，拖点，核心）、
 * 百格图。刻度位置都按数值精确计算。通用部分见 ../shared/fracfig.js */
const { el, bar, gcd, FILL, LINE } = FracFig;
const $ = (id) => document.getElementById(id);
const AX = '#c0392b';
const text = (svg, x, y, s, cls = 'ff-t') => { const t = el('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
const tick = (svg, x, y1, y2, w = 2) => el('line', { x1: x, x2: x, y1, y2, stroke: AX, 'stroke-width': w }, svg);
function svgFrac(svg, x, y, a, b, color = '#1f2d3a', size = 24) {
  const g = el('g', { fill: color }, svg);
  const t1 = el('text', { x, y, class: 'ff-t', 'font-size': size, fill: color }, g); t1.textContent = a;
  el('line', { x1: x - size * 0.55, x2: x + size * 0.55, y1: y + 7, y2: y + 7, stroke: color, 'stroke-width': 2 }, g);
  const t2 = el('text', { x, y: y + size + 6, class: 'ff-t', 'font-size': size, fill: color }, g); t2.textContent = b;
  return g;
}
function axisLine(svg, x0, x1, y) {
  el('line', { x1: x0 - 20, x2: x1 + 40, y1: y, y2: y, stroke: AX, 'stroke-width': 3 }, svg);
  el('polygon', { points: `${x1 + 54},${y} ${x1 + 38},${y - 7} ${x1 + 38},${y + 7}`, fill: AX }, svg);
}
/* 有限小数：约分后分母只含因数 2、5 */
const isFinite25 = (k, n) => { let d = n / gcd(k, n); while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; };
const decStr = (v, places) => String(+v.toFixed(places));

/* ---------- 例 9：0.5 与 3/4 ---------- */
function initE9() {
  const svg = $('e9');
  const [x0, x1, y] = [100, 900, 110];
  const X = (v) => x0 + (x1 - x0) * v;
  axisLine(svg, x0, x1, y);
  for (let i = 0; i <= 10; i += 1) tick(svg, X(i / 10), y - (i % 5 ? 6 : 11), y + (i % 5 ? 6 : 11), i % 5 ? 1.6 : 3);
  text(svg, X(0), y + 40, '0'); text(svg, X(1), y + 40, '1');
  el('circle', { cx: X(0.5), cy: y, r: 9, fill: '#1d6fa5' }, svg);
  text(svg, X(0.5), y + 40, '0.5', 'ff-t b');
  el('circle', { cx: X(0.75), cy: y, r: 9, fill: '#d9711c' }, svg);
  svgFrac(svg, X(0.75), y - 52, 3, 4, '#d9711c');
  for (let k = 1; k < 4; k += 1) el('line', { x1: X(k / 4), x2: X(k / 4), y1: y - 26, y2: y - 12, stroke: '#d9711c', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, svg);
}

/* ---------- 核心：数轴放大镜 ---------- */
const DL = { n: 4, k: 3 };
function initDL() {
  const svg = $('dl');
  const [x0, x1, y] = [90, 910, 130];
  const X = (v) => x0 + (x1 - x0) * v;
  const msg = $('dlMsg');
  const render = () => {
    const { n, k } = DL;
    svg.innerHTML = '';
    axisLine(svg, x0, x1, y);
    // 下方：小数刻度（0.01 细、0.1 粗）
    for (let i = 0; i <= 100; i += 1) {
      const big = i % 10 === 0;
      el('line', { x1: X(i / 100), x2: X(i / 100), y1: y, y2: y + (big ? 16 : 7), stroke: '#1d6fa5', 'stroke-width': big ? 2.2 : 1 }, svg);
      if (big) text(svg, X(i / 100), y + 42, i === 0 ? '0' : (i === 100 ? '1' : decStr(i / 100, 1)), 'ff-t dec');
    }
    // 上方：分数刻度
    for (let i = 0; i <= n; i += 1) {
      el('line', { x1: X(i / n), x2: X(i / n), y1: y - 18, y2: y, stroke: '#d9711c', 'stroke-width': 3 }, svg);
      if (i > 0 && i < n) svgFrac(svg, X(i / n), y - 66, i, n, i === k ? '#d9711c' : '#6f8191', 22);
    }
    text(svg, X(0), y - 30, '0', 'ff-t'); text(svg, X(1), y - 30, '1', 'ff-t');
    // 点
    const v = k / n;
    el('line', { x1: X(v), x2: X(v), y1: y - 20, y2: y + 60, stroke: '#d9711c', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, svg);
    const h = el('g', { class: 'dl-h' }, svg);
    el('circle', { cx: X(v), cy: y, r: 24, fill: 'rgba(217,113,28,.18)' }, h);
    el('circle', { cx: X(v), cy: y, r: 11, fill: '#d9711c', stroke: '#fff', 'stroke-width': 3 }, h);
    const fin = isFinite25(k, n);
    const dv = fin ? decStr(v, 4) : decStr(v, 3);
    text(svg, X(v), y + 92, `${fin ? '' : '≈ '}${dv}`, 'ff-t b big');
    if (k === 0 || k === n) msg.innerHTML = `$\\dfrac{${k}}{${n}}=${k / n}$。拖动橙色点试试。`;
    else if (fin) msg.innerHTML = `$\\dfrac{${k}}{${n}}=${k}\\div${n}=${dv}$：点正好落在小数刻度上。`;
    else msg.innerHTML = `$\\dfrac{${k}}{${n}}=${k}\\div${n}=${decStr(v, 4)}\\cdots\\cdots\\approx${dv}$：<b>除不尽</b>，点落在两个小数刻度之间，只能取近似值。`;
    msg.className = `tip feedback center ${fin ? 'fb-ok' : 'fb-warn'}`;
    MathKit.tex(msg);
  };
  const toK = (e) => {
    const p = svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const x = p.matrixTransform(svg.getScreenCTM().inverse()).x;
    return Math.min(DL.n, Math.max(0, Math.round(((x - x0) / (x1 - x0)) * DL.n)));
  };
  let drag = false;
  svg.addEventListener('pointerdown', (e) => { drag = true; svg.setPointerCapture(e.pointerId); DL.k = toK(e); render(); e.preventDefault(); });
  svg.addEventListener('pointermove', (e) => { if (!drag) return; const k = toK(e); if (k !== DL.k) { DL.k = k; render(); } });
  svg.addEventListener('pointerup', () => { drag = false; });
  svg.addEventListener('pointercancel', () => { drag = false; });
  $('dlN').addEventListener('click', (e) => {
    const b = e.target.closest('[data-n]');
    if (!b) return;
    DL.n = +b.dataset.n; DL.k = 1;
    $('dlN').querySelectorAll('[data-n]').forEach((x) => x.classList.toggle('solid', x === b));
    render();
  });
  render();
}

/* ---------- 例 10：百格图（按列涂：一列是 0.1） ---------- */
function initHG() {
  const svg = $('hg');
  const S = 22;
  const cells = [];
  for (let c = 0; c < 10; c += 1) {
    for (let r = 0; r < 10; r += 1) cells.push(el('rect', { x: 10 + c * S, y: 10 + r * S, width: S, height: S, fill: '#fff', stroke: '#9cc9ea', 'stroke-width': 1 }, svg));
  }
  el('rect', { x: 10, y: 10, width: 10 * S, height: 10 * S, fill: 'none', stroke: LINE, 'stroke-width': 2.5 }, svg);
  const msg = $('hgMsg');
  const show = (v) => {
    cells.forEach((c, i) => c.setAttribute('fill', i < v ? FILL : '#fff'));
    msg.innerHTML = v === 30
      ? '涂了 3 列（30 格）：$0.3=\\dfrac3{10}$（也等于 $\\dfrac{30}{100}$）'
      : '涂了 13 格：$0.13=\\dfrac{13}{100}$';
    MathKit.tex(msg);
  };
  $('hgPick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]');
    if (!b) return;
    $('hgPick').querySelectorAll('[data-v]').forEach((x) => x.classList.toggle('solid', x === b));
    show(+b.dataset.v);
  });
  show(30);
}

window.LESSON = {
  init() {
    bar($('rcDec'), { x: 20, y: 20, w: 200, h: 34, n: 10, on: (i) => i < 3 });
    initE9();
    initDL();
    initHG();
    FracFig.exact();
  },
};
