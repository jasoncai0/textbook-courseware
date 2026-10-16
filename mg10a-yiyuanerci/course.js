'use strict';
/* 高一上 3.3 从函数观点看一元二次方程和一元二次不等式
 * 本课互动：一次函数看方程与不等式、零点图、可拖的抛物线（零点版 / 解集版）、a<0 小图、例题图象。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const EPS = 1e-9;
const SNAP = 0.5; // 拖动顶点时按 0.5 吸附，系数保持“好看”的数

/* ---------- 通用小工具 ---------- */
const isNice = (v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-7;
const num = (v) => fmt(v, 3);

/** 在 x 轴上标出解集：runs 为区间（可含 ±Infinity），ends 为 [x, 是否实心]；step 让它们分步出现 */
function markSet(b, { xr, runs = [], ends = [], cls = 'sol', step }) {
  const nodes = [
    ...runs.map(([l, r]) => b.seg([[Math.max(l, xr[0]), 0], [Math.min(r, xr[1]), 0]], { cls })),
    ...ends.map(([x, solid]) => b.pt([x, 0], { hollow: !solid, r: 7 })),
  ];
  if (step) nodes.forEach((n) => n.setAttribute('data-step', step));
  return nodes;
}
const stepOf = (nodes, step) => [].concat(nodes).forEach((n) => n.setAttribute('data-step', step));

/** ax² + bx + c 的 TeX（系数 1 省略、负号合并） */
function polyTex(a, b, c) {
  const term = (v, first, sym) => {
    if (Math.abs(v) < EPS) return '';
    const sign = v < 0 ? '-' : (first ? '' : '+');
    const m = Math.abs(v);
    return `${sign}${sym && Math.abs(m - 1) < EPS ? '' : num(m)}${sym}`;
  };
  return `${term(a, true, 'x^2')}${term(b, !a, 'x')}${term(c, !a && !b, '')}` || '0';
}

/** a > 0 时的判别式与零点（由小到大） */
function zerosOf({ a, b, c }) {
  const d = b * b - 4 * a * c;
  if (Math.abs(d) < EPS) return { d: 0, xs: [-b / (2 * a)] };
  if (d < 0) return { d, xs: [] };
  const r = Math.sqrt(d);
  return { d, xs: [(-b - r) / (2 * a), (-b + r) / (2 * a)] };
}

const ALL = { tex: '\\mathbf{R}', runs: [[-Infinity, Infinity]], ends: [] };
const EMPTY = { tex: '\\varnothing', runs: [], ends: [] };
/** 由零点和不等号得到解集（a > 0）：区间、端点虚实、TeX */
function solve(xs, sign) {
  const up = sign === 'gt' || sign === 'ge';
  const closed = sign === 'ge' || sign === 'le';
  const [L, R] = closed ? ['[', ']'] : ['(', ')'];
  if (xs.length === 0) return up ? ALL : EMPTY;
  if (xs.length === 1) {
    const x0 = fmt(xs[0]);
    if (up) return closed ? ALL : { tex: `(-\\infty,${x0})\\cup(${x0},+\\infty)`, runs: [[-Infinity, xs[0]], [xs[0], Infinity]], ends: [[xs[0], false]] };
    return closed ? { tex: `\\{${x0}\\}`, runs: [], ends: [[xs[0], true]] } : EMPTY;
  }
  const [x1, x2] = xs;
  const [t1, t2] = xs.map((v) => fmt(v));
  if (up) return { tex: `(-\\infty,${t1}${R}\\cup${L}${t2},+\\infty)`, runs: [[-Infinity, x1], [x2, Infinity]], ends: [[x1, closed], [x2, closed]] };
  return { tex: `${L}${t1},${t2}${R}`, runs: [[x1, x2]], ends: [[x1, closed], [x2, closed]] };
}

/* ---------- 第 3 页：一次函数 y = 2x − 3 ---------- */
function initLinear() {
  const XR = [-2, 5];
  const b = board($('lin'), { x: XR, y: [-4, 4], w: 460 });
  b.fn((x) => 2 * x - 3);
  stepOf([b.pt([1.5, 0], { cls: 'c2', r: 8 }), b.text([1.5, 0], 'x = 3/2', { cls: 'lb up', dx: 8, dy: 54 })], 2);
  stepOf(b.fn((x) => 2 * x - 3, { from: 1.5, to: 5, cls: 'c2' }), 4);
  markSet(b, { xr: XR, runs: [[1.5, Infinity]], ends: [[1.5, false]], step: 4 });
  stepOf(b.fn((x) => 2 * x - 3, { from: -2, to: 1.5, cls: 'c3' }), 6);
  markSet(b, { xr: XR, runs: [[-Infinity, 1.5]], cls: 'solb', step: 6 });
  b.update();
}

/* ---------- 第 4 页：y = x² − 2x − 3 的零点 ---------- */
const f0 = (x) => x * x - 2 * x - 3;
function initZeros() {
  const b = board($('zero'), { x: [-3, 5], y: [-5, 5], w: 440 });
  b.fn(f0);
  stepOf([b.pt([-1, 0], { cls: 'c2', r: 8 }), b.pt([3, 0], { cls: 'c2', r: 8 }), b.text([-1, 0], '−1', { cls: 'lb up', dx: -34, dy: -12 }), b.text([3, 0], '3', { cls: 'lb up', dx: 10, dy: -12 })], 2);
  b.update();
}

/* ---------- 第 5、10 页：可拖的抛物线 ---------- */
const SIGN_TEX = { gt: '>', ge: '\\ge', lt: '<', le: '\\le' };
const colOf = (d) => (d > EPS ? 0 : d < -EPS ? 2 : 1);

function readoutHtml(s, z, sol) {
  const p = polyTex(s.a, s.b, s.c);
  const approx = z.xs.some((v) => !isNice(v));
  const rel = approx ? '\\approx' : '=';
  const zs = z.xs.length === 2 ? `$x_1${rel}${fmt(z.xs[0])},\\ x_2${rel}${fmt(z.xs[1])}$`
    : z.xs.length === 1 ? `$x_1=x_2${rel}${fmt(z.xs[0])}$` : '无（方程没有实数根）';
  const lines = [
    `<p>$y=${p}$</p>`,
    `<p>$\\Delta=b^2-4ac=${num(z.d)}$</p>`,
    `<p>零点：${zs}</p>`,
  ];
  if (sol) {
    lines.push(`<p class="sol-line">$${p}${SIGN_TEX[s.sign]}0$ 的解集：<b>$${sol.tex}$</b></p>`);
    if (approx) lines.push('<p class="muted small">端点保留两位小数（近似值）</p>');
  }
  return lines.join('');
}

function initParabola(root) {
  const isIneq = root.dataset.mode === 'ineq';
  const XR = [-4.5, 6.5];
  const YR = [-4.5, 6.5];
  const s = { a: 1, b: -2, c: -3, sign: 'gt' };
  const f = (x) => s.a * x * x + s.b * x + s.c;
  const z = () => zerosOf(s);
  const sol = () => solve(z().xs, s.sign);
  const vtx = () => [-s.b / (2 * s.a), f(-s.b / (2 * s.a))];
  const b = board(root.querySelector('.pboard'), { x: XR, y: YR, w: 520 });

  b.seg(() => [[vtx()[0], YR[0]], [vtx()[0], YR[1]]], { cls: 'dash' });
  b.fn(f);
  // 先放拖动柄、再画零点：Δ = 0 时零点就在顶点上，空心/实心圈要露在柄的上面
  b.drag(vtx, (x, y) => {
    const h = Math.round(Math.min(5.5, Math.max(-3.5, x)) / SNAP) * SNAP;
    const k = Math.round(Math.min(5.5, Math.max(-4, y)) / SNAP) * SNAP;
    s.b = -2 * s.a * h;
    s.c = s.a * h * h + k;
    syncSliders();
  });
  if (isIneq) {
    // 解集对应的那段曲线标橙色；x 轴上同步画出解集
    const run = (k) => () => sol().runs[k];
    const part = (k, end) => () => { const r = run(k)(); return r ? Math.max(XR[0], Math.min(XR[1], r[end])) : XR[0]; };
    [0, 1].forEach((k) => {
      b.fn(f, { from: part(k, 0), to: part(k, 1), cls: 'c2' });
      b.seg(() => { const r = run(k)(); return r ? [[Math.max(r[0], XR[0]), 0], [Math.min(r[1], XR[1]), 0]] : [[0, 0], [0, 0]]; }, { cls: 'sol' });
    });
    [0, 1].forEach((k) => {
      const end = () => sol().ends[k];
      b.pt(() => (end() ? [end()[0], 0] : null), { hollow: true, r: 7, show: () => end() && !end()[1] });
      b.pt(() => (end() ? [end()[0], 0] : null), { r: 7, show: () => end() && end()[1] });
    });
  } else {
    [0, 1].forEach((k) => b.pt(() => (z().xs[k] === undefined ? null : [z().xs[k], 0]), { cls: 'c2', r: 8 }));
  }

  const inputs = [...root.querySelectorAll('input[data-p]')];
  function syncSliders() {
    inputs.forEach((inp) => { inp.value = s[inp.dataset.p]; });
    root.querySelectorAll('[data-v]').forEach((el) => { el.textContent = num(s[el.dataset.v]); });
  }
  b.onUpdate = () => {
    const zz = z();
    const read = root.querySelector('.p-read');
    read.innerHTML = readoutHtml(s, zz, isIneq ? sol() : null);
    tex(read);
    const col = String(colOf(zz.d));
    root.querySelectorAll('[data-col]').forEach((el) => el.classList.toggle('cur', el.dataset.col === col));
    const row = s.sign === 'gt' || s.sign === 'ge' ? 'gt' : 'lt';
    root.querySelectorAll('[data-row]').forEach((el) => el.classList.toggle('cur-row', isIneq && el.dataset.row === row));
    syncSliders();
  };
  inputs.forEach((inp) => slider(inp, (v) => { s[inp.dataset.p] = v; b.update(); }));
  root.querySelectorAll('[data-sign]').forEach((btn) => btn.addEventListener('click', () => {
    s.sign = btn.dataset.sign;
    root.querySelectorAll('[data-sign]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  }));
  root.querySelector('[data-reset]')?.addEventListener('click', () => { Object.assign(s, { a: 1, b: -2, c: -3 }); b.update(); });
  b.update();
}

/* ---------- 第 6 页：例 2，区间 (2, 3) 上的零点 ---------- */
function initEx2() {
  const f = (x) => x * x - 2 * x - 1;
  const b = board($('ex2'), { x: [-1.5, 4], y: [-2.5, 3], w: 420 });
  b.poly([[2, -2.5], [3, -2.5], [3, 3], [2, 3]], { cls: 'band' });
  b.fn(f);
  const r = Math.SQRT2;
  b.pt([1 + r, 0], { cls: 'c2', r: 8 });
  b.pt([1 - r, 0], { r: 6 });
  b.text([1 + r, 0], '1+√2', { cls: 'lb up', dx: 8, dy: -12 });
  b.text([1 - r, 0], '1−√2', { cls: 'lb up', dx: -70, dy: -12 });
  b.update();
}

/* ---------- 第 7 页：练习 1，a < 0 的三种情形 ---------- */
const NEG_CASES = [(x) => -x * x + 2 * x + 3, (x) => -x * x + 2 * x - 1, (x) => -x * x + 2 * x - 2];
const NEG_ZEROS = [[-1, 3], [1], []];
function initNeg() {
  NEG_CASES.forEach((f, i) => {
    const b = board($(`neg${i}`), { x: [-2, 4], y: [-3.5, 4.8], w: 240, ticks: 0, grid: false });
    b.fn(f);
    NEG_ZEROS[i].forEach((x) => b.pt([x, 0], { cls: 'c2', r: 6 }));
    b.update();
  });
}

/* ---------- 第 9 页：y = x² − 2x − 3 何时为正、为负 ---------- */
function initSigns() {
  const XR = [-3, 5];
  const b = board($('signs'), { x: XR, y: [-5, 5], w: 440 });
  b.fn(f0);
  stepOf([b.fn(f0, { from: -3, to: -1, cls: 'c2' }), b.fn(f0, { from: 3, to: 5, cls: 'c2' })], 2);
  markSet(b, { xr: XR, runs: [[-Infinity, -1], [3, Infinity]], step: 2 });
  stepOf(b.fn(f0, { from: -1, to: 3, cls: 'c3' }), 4);
  markSet(b, { xr: XR, runs: [[-1, 3]], cls: 'solb', step: 4 });
  markSet(b, { xr: XR, ends: [[-1, false], [3, false]], step: 2 });
  b.update();
}

/* ---------- 第 12 页：例 1 的四个图象（图 3-3-1） ---------- */
const EX1 = [
  { f: (x) => x * x - 7 * x + 12, x: [-0.6, 6], y: [-1.2, 4], runs: [[-Infinity, 3], [4, Infinity]], ends: [[3, false], [4, false]] },
  { f: (x) => x * x + 2 * x - 3, x: [-4.6, 2.6], y: [-4.5, 3], runs: [[-3, 1]], ends: [[-3, true], [1, true]] },
  { f: (x) => x * x - 2 * x + 1, x: [-1.5, 3.5], y: [-1, 4], runs: [], ends: [[1, false]] },
  { f: (x) => x * x - 2 * x + 2, x: [-1.5, 3.5], y: [-1, 4], runs: [[-Infinity, Infinity]], ends: [] },
];
function initEx1() {
  EX1.forEach((e, i) => {
    const b = board($(`e1g${i}`), { x: e.x, y: e.y, w: 260 });
    b.fn(e.f);
    markSet(b, { xr: e.x, runs: e.runs, ends: e.ends, step: 2 * i + 2 });
    b.update();
  });
}

window.LESSON = {
  init() {
    initLinear();
    initZeros();
    document.querySelectorAll('.pwork').forEach(initParabola);
    initEx2();
    initNeg();
    initSigns();
    initEx1();
  },
};
