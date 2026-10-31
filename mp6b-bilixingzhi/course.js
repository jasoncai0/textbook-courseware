'use strict';
/* 六下 比例的基本性质 · 本课互动：外项积、内项积画成两块长方形比面积（格数精确）、答案不唯一的填空按乘积判断。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const label = (svg, x, y, s, cls = 'fl m') => { const t = svgEl('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
const setMsg = (el, ok, html) => {
  el.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
  el.innerHTML = html;
  tex(el);
};

/* 第 3 页：例 4 两个三角形（1 cm = 26 单位；顶点在底边 35% 处的正上方） */
function triangle(svg, x, base, b, h, K) {
  const [w, hh] = [b * K, h * K];
  const ax = x + 0.35 * w;
  svgEl('path', { d: `M${x} ${base}H${x + w}L${ax} ${base - hh}Z`, fill: 'rgba(240,120,170,.18)', stroke: '#d6247a', 'stroke-width': 2.5 }, svg);
  svgEl('line', { x1: ax, y1: base, x2: ax, y2: base - hh, stroke: '#d6247a', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }, svg);
  svgEl('path', { d: `M${ax} ${base - 9}h9v9`, fill: 'none', stroke: '#d6247a', 'stroke-width': 1.5 }, svg);
  label(svg, x + w / 2, base + 26, `${b} cm`);
  label(svg, ax + 8, base - hh / 2 + 7, `${h} cm`, 'fl');
}
function initTri() {
  const svg = $('tri4');
  triangle(svg, 20, 170, 6, 4, 26);
  triangle(svg, 260, 170, 3, 2, 26);
}

/* 第 4 页：内项、外项示意 */
function initTerms() {
  const svg = $('termFig');
  const xs = [100, 200, 320, 420];
  ['6', '3', '4', '2'].forEach((s, i) => label(svg, xs[i], 50, s, 'fl m big'));
  [150, 370].forEach((x) => label(svg, x, 50, ':', 'fl m big'));
  label(svg, 260, 50, '=', 'fl m big');
  const br = (x1, x2, y, color, s) => {
    svgEl('path', { d: `M${x1} ${y - 22}V${y}H${x2}V${y - 22}`, fill: 'none', stroke: color, 'stroke-width': 2.5 }, svg);
    label(svg, (x1 + x2) / 2, y + 26, s, 'fl m b').setAttribute('fill', color);
  };
  br(xs[1], xs[2], 82, '#d9711c', '内项');
  br(xs[0], xs[3], 132, '#1d6fa5', '外项');
}

/* 第 6 页：外项积、内项积两块长方形 */
let U = 20;
function rectCells(svg, x, y, w, h, fill, line) {
  svgEl('rect', { x, y, width: w * U, height: h * U, fill, stroke: line, 'stroke-width': 2.5 }, svg);
  for (let i = 1; i < w; i += 1) svgEl('line', { x1: x + i * U, x2: x + i * U, y1: y, y2: y + h * U, stroke: line, 'stroke-width': 0.6 }, svg);
  for (let j = 1; j < h; j += 1) svgEl('line', { x1: x, x2: x + w * U, y1: y + j * U, y2: y + j * U, stroke: line, 'stroke-width': 0.6 }, svg);
}
function initArea() {
  const st = { a: 6, b: 3, c: 4, d: 2 };
  const svg = $('areaFig');
  const render = () => {
    const { a, b, c, d } = st;
    svg.innerHTML = '';
    U = Math.min(36, 230 / Math.max(a, b, c, d)); // 最长边约占 230 单位，格子尽量大
    rectCells(svg, 20, 40, a, d, 'rgba(90,169,230,.35)', '#1d6fa5');
    rectCells(svg, 290, 40, b, c, 'rgba(245,166,91,.4)', '#c0631a');
    label(svg, 140, 26, `外项积 ${a} × ${d} = ${a * d}`, 'fl m b').setAttribute('fill', '#1d6fa5');
    label(svg, 410, 26, `内项积 ${b} × ${c} = ${b * c}`, 'fl m b').setAttribute('fill', '#c0631a');
    ['a', 'b', 'c', 'd'].forEach((k) => { $(`v${k}`).textContent = st[k]; });
    const isProp = a * d === b * c;
    const r1 = a / b;
    const r2 = c / d;
    const f = (v) => `${+v.toFixed(3)}`;
    setMsg($('areaMsg'), isProp, isProp
      ? `<b>✓ 是比例：</b>$${a}:${b}$ 和 $${c}:${d}$ 的比值都是 ${f(r1)}；两块面积都是 <b>${a * d}</b> 格。`
      : `$${a}:${b}$ 的比值 ${f(r1)}，$${c}:${d}$ 的比值 ${f(r2)}，不相等，<b>不能</b>组成比例；面积 ${a * d} 格 ≠ ${b * c} 格。`);
  };
  $('abcd').addEventListener('click', (e) => {
    const dd = e.target.closest('[data-d]')?.dataset.d;
    if (!dd) return;
    st[dd[0]] = Math.min(12, Math.max(1, st[dd[0]] + (dd[1] === '+' ? 1 : -1)));
    render();
  });
  document.querySelector('[data-p]').parentElement.addEventListener('click', (e) => {
    const p = e.target.closest('[data-p]')?.dataset.p;
    if (!p) return;
    [st.a, st.b, st.c, st.d] = p.split(',').map(Number);
    render();
  });
  render();
}

/* 第 7 页：分数形式交叉相乘 */
function initCross() {
  const svg = $('crossFig');
  const fr = (x, n, d) => {
    label(svg, x, 48, n, 'fl m big');
    svgEl('line', { x1: x - 22, x2: x + 22, y1: 62, y2: 62, stroke: '#2b3a4a', 'stroke-width': 2.5 }, svg);
    label(svg, x, 100, d, 'fl m big');
  };
  fr(90, '6', '3');
  label(svg, 150, 76, '=', 'fl m big');
  fr(210, '4', '2');
  svgEl('line', { x1: 108, y1: 42, x2: 190, y2: 92, stroke: '#d6247a', 'stroke-width': 2 }, svg);
  svgEl('line', { x1: 108, y1: 92, x2: 190, y2: 42, stroke: '#d6247a', 'stroke-width': 2 }, svg);
  label(svg, 150, 132, '6 × 2 = 3 × 4', 'fl m b');
}

/* 第 9 页：答案不唯一的填空，按两空乘积判断 */
function initFree() {
  document.querySelectorAll('.free').forEach((box) => {
    const prod = +box.dataset.prod;
    const spans = [...box.querySelectorAll('.fi')];
    const check = () => {
      const v = spans.map((s) => s.querySelector('input').value.trim());
      spans.forEach((s) => s.classList.remove('ok', 'no'));
      if (v.some((x) => !x)) return;
      const [x, y] = v.map(Number);
      const ok = Number.isFinite(x) && Number.isFinite(y) && Math.abs(x * y - prod) < 1e-9;
      spans.forEach((s) => s.classList.add(ok ? 'ok' : 'no'));
    };
    spans.forEach((s) => {
      const inp = s.querySelector('input');
      inp.addEventListener('change', check);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { check(); inp.blur(); } });
    });
  });
}

window.LESSON = {
  init() {
    initTri();
    initTerms();
    initArea();
    initCross();
    initFree();
  },
};
