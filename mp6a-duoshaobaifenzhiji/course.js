'use strict';
/* 六上 求一个数比另一个数多（少）百分之几 · 本课互动：例 6 线段图（按比例）、分段图、可拖动的两条线段对比器、练一练线段图。
 * 线段长度一律按数量精确换算；百分数由整数精确计算，除不尽保留一位小数写“≈”。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const INK = '#2a3b4c';
const BASE = '#2a7fb8';
const DIFF = '#e8743b';

function pct(a, b) {
  const g = gcd(a, b) || 1;
  let d = b / g;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  const exact = d === 1;
  const k = exact ? 4 : 1;
  const q = Math.floor((a * 100 * 10 ** k * 2 + b) / (2 * b));
  return { s: String(+(q / 10 ** k).toFixed(k)), exact };
}
const rel = (a, b) => (pct(a, b).exact ? '=' : '\\approx');

/* ---------- 线段图小工具 ---------- */
// 水平花括号：从 x1 到 x2，开口朝上（up=false 画在线段下方）
function brace(svg, x1, x2, y, up, label, color = INK) {
  const s = up ? -1 : 1;
  const m = (x1 + x2) / 2;
  const h = 12 * s;
  el('path', { d: `M${x1} ${y}q0 ${h} 10 ${h}H${m - 10}q10 0 10 ${h}q0 ${-h} 10 ${-h}H${x2 - 10}q10 0 10 ${-h}`, fill: 'none', stroke: color, 'stroke-width': 2 }, svg);
  el('text', { x: m, y: y + (up ? -30 : 46), class: 'ff-t s', fill: color, style: `fill:${color}` }, svg).textContent = label;
}
function seg(svg, x1, x2, y, color, dash) {
  el('line', { x1, x2, y1: y, y2: y, stroke: color, 'stroke-width': 4, 'stroke-dasharray': dash ? '8 6' : 'none' }, svg);
  [x1, x2].forEach((x) => el('line', { x1: x, x2: x, y1: y - 9, y2: y + 9, stroke: color, 'stroke-width': 2.5 }, svg));
}
const label = (svg, x, y, t) => { el('text', { x, y: y + 7, class: 'ff-t', style: 'text-anchor:end' }, svg).textContent = t; };

/* 第 3、5 页：例 6（16 公顷与 20 公顷），unit 像素/公顷 */
function ex6(svg, baseIsPlan) {
  const [x0, u, yP, yA] = [150, 35, 58, 128];
  const X = (v) => x0 + v * u;
  label(svg, 130, yP, '原计划造林');
  label(svg, 130, yA, '实际造林');
  seg(svg, X(0), X(16), yP, baseIsPlan ? BASE : INK);
  seg(svg, X(0), X(20), yA, baseIsPlan ? INK : BASE);
  el('line', { x1: X(16), x2: X(16), y1: yP, y2: yA, stroke: '#9aa8b4', 'stroke-dasharray': '4 4', 'stroke-width': 1.5 }, svg);
  if (baseIsPlan) {
    brace(svg, X(0), X(16), yP + 4, false, '16 公顷（单位“1”）', BASE);
    el('line', { x1: X(16), x2: X(20), y1: yA, y2: yA, stroke: DIFF, 'stroke-width': 7 }, svg);
    brace(svg, X(16), X(20), yA - 12, true, '实际比原计划多的', DIFF);
    brace(svg, X(0), X(20), yA + 4, false, '20 公顷', INK);
  } else {
    seg(svg, X(16), X(20), yP, DIFF, true);
    brace(svg, X(16), X(20), yP - 12, true, '原计划比实际少的', DIFF);
    brace(svg, X(0), X(16), yP + 4, false, '16 公顷', INK);
    brace(svg, X(0), X(20), yA + 4, false, '20 公顷（单位“1”）', BASE);
  }
}

/* 第 4 页：每段 4 公顷，原计划 4 段 = 100%，实际 5 段 = 125% */
function ex6parts(svg) {
  const [x0, u] = [150, 35];
  [[16, 30, '原计划'], [20, 85, '实际']].forEach(([v, y, t]) => {
    label(svg, 130, y, t);
    for (let k = 0; k < v / 4; k += 1) {
      const x = x0 + k * 4 * u;
      el('rect', { x, y: y - 14, width: 4 * u, height: 28, fill: k === 4 ? '#fbd9c2' : '#d5eaf8', stroke: k === 4 ? DIFF : BASE, 'stroke-width': 2 }, svg);
      el('text', { x: x + 2 * u, y: y + 7, class: 'ff-t s' }, svg).textContent = '25%';
    }
    el('text', { x: x0 + v * u + 12, y: y + 7, class: 'ff-t b', style: 'text-anchor:start' }, svg).textContent = `${(v / 16) * 100}%`;
  });
}

/* 第 6 页：两条线段对比器 */
const MAXV = 40;
function initCmp() {
  const svg = $('cmp');
  const st = { a: 16, b: 20 };
  const [x0, u] = [70, 20];
  const X = (v) => x0 + v * u;
  const Y = { a: 70, b: 160 };
  let drag = null;
  const render = () => {
    svg.innerHTML = '';
    for (let v = 0; v <= MAXV; v += 1) {
      el('line', { x1: X(v), x2: X(v), y1: 20, y2: 210, stroke: v % 5 ? '#eef3f7' : '#dfe7ee', 'stroke-width': 1 }, svg);
      if (v % 10 === 0) el('text', { x: X(v), y: 226, class: 'ff-t s' }, svg).textContent = v;
    }
    const lo = Math.min(st.a, st.b);
    ['a', 'b'].forEach((k) => {
      const y = Y[k];
      el('text', { x: 40, y: y + 8, class: 'ff-t b' }, svg).textContent = k.toUpperCase();
      el('rect', { x: X(0), y: y - 16, width: st[k] * u, height: 32, fill: '#d5eaf8', stroke: BASE, 'stroke-width': 2 }, svg);
      if (st[k] > lo) el('rect', { x: X(lo), y: y - 16, width: (st[k] - lo) * u, height: 32, fill: '#fbd9c2', stroke: DIFF, 'stroke-width': 2 }, svg);
      el('text', { x: X(st[k] / 2), y: y + 7, class: 'ff-t' }, svg).textContent = st[k];
      const h = el('circle', { cx: X(st[k]), cy: y, r: 13, fill: '#fff', stroke: DIFF, 'stroke-width': 4, class: 'tap', 'data-k': k }, svg);
      h.style.cursor = 'ew-resize';
    });
    el('line', { x1: X(lo), x2: X(lo), y1: Y.a - 24, y2: Y.b + 24, stroke: '#9aa8b4', 'stroke-dasharray': '4 4' }, svg);
    const say = (p, q, P, Q) => {
      if (p === q) return `${P} 和 ${Q} 一样长`;
      const word = p > q ? '多' : '少';
      const d = Math.abs(p - q);
      return `${P} 比 ${Q} ${word}：$${d}\\div${q}${rel(d, q)}${pct(d, q).s}\\%$<br><small>（${Q} 是单位“1”）</small>`;
    };
    $('cmpMore').innerHTML = say(st.b, st.a, 'B', 'A');
    $('cmpLess').innerHTML = say(st.a, st.b, 'A', 'B');
    tex($('cmpMore'));
    tex($('cmpLess'));
  };
  const valAt = (e) => {
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    return Math.max(1, Math.min(MAXV, Math.round((p.x - x0) / u)));
  };
  svg.addEventListener('pointerdown', (e) => {
    const k = e.target.dataset?.k;
    if (!k) return;
    drag = k;
    svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const v = valAt(e);
    if (v !== st[drag]) { st[drag] = v; render(); }
  });
  const stop = () => { drag = null; };
  svg.addEventListener('pointerup', stop);
  svg.addEventListener('pointercancel', stop);
  $('cmpBtns').addEventListener('click', (e) => {
    const c = e.target.closest('[data-c]')?.dataset.c;
    if (!c) return;
    st[c[0]] = Math.max(1, Math.min(MAXV, st[c[0]] + (c[1] === '+' ? 1 : -1)));
    render();
  });
  $('cmpSame').addEventListener('click', () => {
    if (st.b - st.a !== 4) { st.b = Math.min(MAXV, st.a + 4); st.a = st.b - 4; } else { st.a += 4; st.b += 4; }
    if (st.b > MAXV) { st.a = 4; st.b = 8; }
    render();
  });
  render();
}

/* 第 8 页：鸵鸟蛋 42 天、鸽蛋 18 天 */
function initEggs() {
  const svg = $('eggs');
  const [x0, u] = [110, 7];
  label(svg, 95, 62, '鸵鸟蛋');
  label(svg, 95, 118, '鸽蛋');
  seg(svg, x0, x0 + 42 * u, 62, BASE);
  seg(svg, x0, x0 + 18 * u, 118, INK);
  seg(svg, x0 + 18 * u, x0 + 42 * u, 118, DIFF, true);
  brace(svg, x0, x0 + 42 * u, 50, true, '42 天（单位“1”）', BASE);
  brace(svg, x0 + 18 * u, x0 + 42 * u, 128, false, '短的天数', DIFF);
  el('text', { x: x0 + 9 * u, y: 146, class: 'ff-t s' }, svg).textContent = '18 天';
}

window.LESSON = {
  init() {
    ex6($('seg6'), true);
    ex6parts($('seg6b'));
    ex6($('seg6c'), false);
    initCmp();
    initEggs();
    FracFig.exact();
  },
};
