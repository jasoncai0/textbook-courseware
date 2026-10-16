'use strict';
/* 高一上 7.2 三角函数概念 · 本课互动：单位圆上拖动 P（坐标 → 函数值）、三角函数线、诱导公式的对称点。通用部分见 ../shared/math.js */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const TAU = 2 * Math.PI;
const SNAP_DEG = 2; // 离 15° 的整数倍不到 2° 时吸附，读数给精确值
const EPS = 1e-9;

/* ---------- 数值 → 精确值（特殊角） ---------- */
const SIN_EXACT = [[0, '0'], [0.5, '\\frac12'], [Math.SQRT2 / 2, '\\frac{\\sqrt2}2'], [Math.sqrt(3) / 2, '\\frac{\\sqrt3}2'], [1, '1']];
const TAN_EXACT = [[0, '0'], [Math.sqrt(3) / 3, '\\frac{\\sqrt3}3'], [1, '1'], [Math.sqrt(3), '\\sqrt3']];
function exact(v, table) {
  const hit = table.find(([a]) => Math.abs(Math.abs(v) - a) < 1e-9);
  if (!hit) return fmt(v, 3);
  return hit[1] === '0' ? '0' : `${v < 0 ? '-' : ''}${hit[1]}`;
}
/** 角度（度）→ 弧度的 TeX：15° 的整数倍写成 kπ/12 的最简分数 */
function radTex(deg) {
  const d = Math.round(deg);
  if (Math.abs(deg - d) > EPS || d % 15 !== 0) return fmt(deg * DEG, 3);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const n = d / 15;
  if (n === 0) return '0';
  const g = gcd(Math.abs(n), 12);
  const [p, q] = [n / g, 12 / g];
  const top = Math.abs(p) === 1 ? '\\pi' : `${Math.abs(p)}\\pi`;
  const sign = p < 0 ? '-' : '';
  return q === 1 ? `${sign}${top}` : `${sign}\\frac{${top}}{${q}}`;
}
const quadrantOf = (t) => {
  const d = Math.round((((t / DEG) % 360) + 360) % 360 * 1e6) / 1e6;
  if (d % 90 === 0) return ['$x$ 轴正半轴上', '$y$ 轴正半轴上', '$x$ 轴负半轴上', '$y$ 轴负半轴上'][d / 90];
  return `第${'一二三四'[Math.floor(d / 90)]}象限`;
};
const sgn = (v) => (Math.abs(v) < EPS ? 'zero' : v > 0 ? 'pos' : 'neg');
const sgnTxt = { pos: '正', neg: '负', zero: '0' };

/** 拖动角度：吸附到 15° 的整数倍，结果在 [0°, 360°) */
function snapAngle(x, y) {
  let d = ((Math.atan2(y, x) / DEG) + 360) % 360;
  const k = Math.round(d / 15) * 15;
  if (Math.abs(d - k) < SNAP_DEG) d = k % 360;
  return d * DEG;
}

/** 箭头标记（有向线段用） */
function addMarker(b, id, color) {
  const NS = 'http://www.w3.org/2000/svg';
  const defs = b.svg.querySelector('defs');
  const m = document.createElementNS(NS, 'marker');
  [['id', id], ['viewBox', '0 0 10 10'], ['refX', '9'], ['refY', '5'], ['markerWidth', '4'], ['markerHeight', '4'], ['orient', 'auto']].forEach(([k, v]) => m.setAttribute(k, v));
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', 'M0 0L10 5L0 10z');
  p.setAttribute('fill', color);
  m.appendChild(p);
  defs.appendChild(m);
  return `url(#${id})`;
}

/* ---------- 诱导公式：P′ 的角、对称轴、坐标关系、公式 ---------- */
const SYM = {
  neg: { f: (t) => -t, name: '-\\alpha', axis: 'x', rel: "x'=x,\\ y'=-y", say: '关于 $x$ 轴对称', no: '二',
    sin: '\\sin(-\\alpha)=-\\sin\\alpha', cos: '\\cos(-\\alpha)=\\cos\\alpha', tan: '\\tan(-\\alpha)=-\\tan\\alpha' },
  pim: { f: (t) => Math.PI - t, name: '\\pi-\\alpha', axis: 'y', rel: "x'=-x,\\ y'=y", say: '关于 $y$ 轴对称', no: '三',
    sin: '\\sin(\\pi-\\alpha)=\\sin\\alpha', cos: '\\cos(\\pi-\\alpha)=-\\cos\\alpha', tan: '\\tan(\\pi-\\alpha)=-\\tan\\alpha' },
  pip: { f: (t) => Math.PI + t, name: '\\pi+\\alpha', axis: 'o', rel: "x'=-x,\\ y'=-y", say: '关于原点 $O$ 对称', no: '四',
    sin: '\\sin(\\pi+\\alpha)=-\\sin\\alpha', cos: '\\cos(\\pi+\\alpha)=-\\cos\\alpha', tan: '\\tan(\\pi+\\alpha)=\\tan\\alpha' },
  hm: { f: (t) => Math.PI / 2 - t, name: '\\frac\\pi2-\\alpha', axis: 'yx', rel: "x'=y,\\ y'=x", say: '关于直线 $y=x$ 对称', no: '五',
    sin: '\\sin\\left(\\frac\\pi2-\\alpha\\right)=\\cos\\alpha', cos: '\\cos\\left(\\frac\\pi2-\\alpha\\right)=\\sin\\alpha' },
  hp: { f: (t) => Math.PI / 2 + t, name: '\\frac\\pi2+\\alpha', axis: 'rot', rel: "x'=-y,\\ y'=x", say: '$P$ 绕 $O$ 逆时针旋转 $\\frac\\pi2$', no: '六',
    sin: '\\sin\\left(\\frac\\pi2+\\alpha\\right)=\\cos\\alpha', cos: '\\cos\\left(\\frac\\pi2+\\alpha\\right)=-\\sin\\alpha' },
};

/**
 * 单位圆组件（三处共用）：mode = 'coord' 坐标投影 | 'lines' 三角函数线 | 'sym' 诱导公式对称点
 * 角 s.t 为弧度，范围 [0, 2π)。
 */
function unitCircle(boardEl, readEl, mode, t0) {
  const s = { t: t0, k: 'neg' };
  const L = 1.6;
  const YL = mode === 'lines' ? 2.2 : L; // 正切线可能很长，纵向多留一些
  const b = board(boardEl, { x: [-L, L], y: [-YL, YL], ticks: 0, grid: false, w: 520 });
  const P = () => [Math.cos(s.t), Math.sin(s.t)];
  b.curve((u) => [Math.cos(u), Math.sin(u)], 0, TAU, { cls: 'c1' });
  // 终边（射线）与角标
  b.seg(() => [[0, 0], [1.5 * Math.cos(s.t), 1.5 * Math.sin(s.t)]], { cls: 'term' });
  b.curve((u) => [0.22 * Math.cos(u), 0.22 * Math.sin(u)], 0, () => s.t, { cls: 'c2' });
  b.text(() => [0.32 * Math.cos(s.t / 2), 0.32 * Math.sin(s.t / 2)], 'α', { dx: -4, dy: 6 });
  b.text([0, 0], 'O', { dx: -18, dy: 22 });
  b.text([1, 0], '1', { cls: 'lb up small-lb', dx: 4, dy: 20 });

  if (mode === 'coord') {
    b.seg(() => [[P()[0], 0], P()], { cls: 'dash' });
    b.seg(() => [[0, P()[1]], P()], { cls: 'dash' });
    b.seg(() => [[0, 0], [P()[0], 0]], { cls: 'cosl' });
    b.seg(() => [[0, 0], [0, P()[1]]], { cls: 'sinl' });
    b.pt(() => [P()[0], 0], { cls: 'c2', r: 4 });
    b.pt(() => [0, P()[1]], { cls: 'c2', r: 4 });
    b.text(() => [P()[0], 0], () => `x = ${fmt(P()[0], 3)}`, { cls: 'lb up cos-t mid', dy: P()[1] >= 0 ? 24 : -12 });
    b.text(() => [0, P()[1]], () => `y = ${fmt(P()[1], 3)}`, { cls: 'lb up sin-t', dx: P()[0] >= 0 ? -100 : 8, dy: 6 });
  }

  if (mode === 'lines') {
    const arS = addMarker(b, `ms${Math.random().toString(36).slice(2)}`, '#c0392b');
    const arC = addMarker(b, `mc${Math.random().toString(36).slice(2)}`, '#d9711c');
    const arT = addMarker(b, `mt${Math.random().toString(36).slice(2)}`, '#2f7d6b');
    const tanOk = () => Math.abs(Math.cos(s.t)) > 1e-6;
    const T = () => [1, Math.tan(s.t)];
    b.seg([[1, -YL], [1, YL]], { cls: 'dash' });
    // 第二、三象限：T 在终边的反向延长线上
    b.seg(() => (tanOk() && Math.cos(s.t) < 0 ? [[0, 0], T()] : [[0, 0], [0, 0]]), { cls: 'dash' });
    const sl = b.seg(() => [[P()[0], 0], P()], { cls: 'sinl' });
    const cl = b.seg(() => [[0, 0], [P()[0], 0]], { cls: 'cosl' });
    const tl = b.seg(() => (tanOk() ? [[1, 0], T()] : [[1, 0], [1, 0]]), { cls: 'tanl' });
    sl.setAttribute('marker-end', arS); cl.setAttribute('marker-end', arC); tl.setAttribute('marker-end', arT);
    const hideShort = () => {
      sl.style.visibility = Math.abs(Math.sin(s.t)) < 0.02 ? 'hidden' : '';
      cl.style.visibility = Math.abs(Math.cos(s.t)) < 0.02 ? 'hidden' : '';
      tl.style.visibility = !tanOk() || Math.abs(Math.tan(s.t)) < 0.02 ? 'hidden' : '';
    };
    b.pt(() => (tanOk() && Math.abs(Math.tan(s.t)) < YL ? T() : null), { cls: 'c3p', r: 5 });
    b.pt([1, 0], { r: 4 });
    b.pt(() => [P()[0], 0], { r: 4 });
    b.text([1, 0], 'A', { dx: 8, dy: -8 });
    b.text(() => [P()[0], 0], 'M', { dx: -6, dy: Math.sin(s.t) >= 0 ? 24 : -10 });
    b.text(() => (tanOk() && Math.abs(Math.tan(s.t)) < YL ? T() : null), 'T', { dx: 10, dy: 6 });
    b.lineHide = hideShort;
  }

  if (mode === 'sym') {
    const Q = () => [Math.cos(SYM[s.k].f(s.t)), Math.sin(SYM[s.k].f(s.t))];
    const axisSeg = () => ({ x: [[-L, 0], [L, 0]], y: [[0, -L], [0, L]], yx: [[-L, -L], [L, L]], o: [[0, 0], [0, 0]], rot: [[0, 0], [0, 0]] })[SYM[s.k].axis];
    b.seg(axisSeg, { cls: 'axis-hl' });
    b.seg(() => [[0, 0], [1.5 * Q()[0], 1.5 * Q()[1]]], { cls: 'term2' });
    b.seg(() => [P(), Q()], { cls: 'dash' });
    b.pt(() => Q(), { cls: 'c3p', r: 7 });
    b.text(() => Q(), "P′", { dx: Q()[0] >= 0 ? 10 : -34, dy: Q()[1] >= 0 ? -8 : 24 });
    b.pt(() => (SYM[s.k].axis === 'o' || SYM[s.k].axis === 'rot' ? [0, 0] : null), { cls: 'c3p', r: 6 });
  }

  b.text(() => P(), 'P', { dx: P()[0] >= 0 ? 12 : -28, dy: P()[1] >= 0 ? -10 : 26 });
  b.drag(P, (x, y) => { if (Math.hypot(x, y) > 0.2) s.t = snapAngle(x, y); });

  b.onUpdate = () => {
    if (b.lineHide) b.lineHide();
    readEl.innerHTML = mode === 'sym' ? symRead(s) : coordRead(s, mode);
    tex(readEl);
  };
  return { b, s };
}

/** 坐标模式 / 三角函数线模式的读数 */
function coordRead(s, mode) {
  const deg = Math.round(s.t / DEG * 1e6) / 1e6;
  const [x, y] = [Math.cos(s.t), Math.sin(s.t)];
  const hasTan = Math.abs(x) > 1e-9;
  const tanV = hasTan ? y / x : NaN;
  const cell = (v, txt) => `<td class="sg-${sgn(v)}">$${txt}$<small>${Number.isNaN(v) ? '' : sgnTxt[sgn(v)]}</small></td>`;
  const name = mode === 'lines' ? ['正弦线 $MP$', '余弦线 $OM$', '正切线 $AT$'] : ['$\\sin\\alpha=y$', '$\\cos\\alpha=x$', '$\\tan\\alpha=\\dfrac yx$'];
  return `<p class="uc-ang">$\\alpha=${fmt(deg, 2)}^\\circ=${radTex(deg)}$，$P$ 在${quadrantOf(s.t)}</p>`
    + `<p class="muted uc-p">$P(\\cos\\alpha,\\ \\sin\\alpha)=(${fmt(x, 3)},\\ ${fmt(y, 3)})$</p>`
    + '<table class="mtab uc-tab">'
    + `<tr><th>${name[0]}</th>${cell(y, exact(y, SIN_EXACT))}</tr>`
    + `<tr><th>${name[1]}</th>${cell(x, exact(x, SIN_EXACT))}</tr>`
    + `<tr><th>${name[2]}</th>${hasTan ? cell(tanV, exact(tanV, TAN_EXACT)) : '<td class="sg-none">不存在（$x=0$）</td>'}</tr>`
    + '</table>';
}

/** 诱导公式模式：P、P′ 坐标与公式，并用当前数值核对 */
function symRead(s) {
  const k = SYM[s.k];
  const deg = Math.round(s.t / DEG * 1e6) / 1e6;
  const [x, y] = [Math.cos(s.t), Math.sin(s.t)];
  const bt = k.f(s.t);
  const [x2, y2] = [Math.cos(bt), Math.sin(bt)];
  const rows = [k.sin, k.cos, k.tan].filter(Boolean).map((f) => `<li>$${f}$</li>`).join('');
  return `<p class="uc-ang">$\\alpha=${fmt(deg, 2)}^\\circ$，$P'$ 是角 $${k.name}$ 的终边与单位圆的交点</p>`
    + `<p>$P(${fmt(x, 3)},\\ ${fmt(y, 3)})$　$P'(${fmt(x2, 3)},\\ ${fmt(y2, 3)})$</p>`
    + `<p>${k.say}：$${k.rel}$</p>`
    + `<div class="def sym-f"><h4>公式${k.no}</h4><ul>${rows}</ul></div>`;
}

/* 第 3 页：终边上两点，相似三角形 */
function initRatio() {
  const a = 50 * DEG;
  const b = board($('ratioFig'), { x: [-0.3, 2.6], y: [-0.35, 2.4], ticks: 0, grid: false, w: 480 });
  const P1 = [1.1 * Math.cos(a), 1.1 * Math.sin(a)];
  const P2 = [2.0 * Math.cos(a), 2.0 * Math.sin(a)];
  b.seg([[0, 0], [2.35 * Math.cos(a), 2.35 * Math.sin(a)]], { cls: 'term' });
  [P1, P2].forEach((p, i) => {
    b.poly([[0, 0], [p[0], 0], p], { cls: i ? 'fill2' : 'fill1' });
    b.seg([[p[0], 0], p], { cls: 'dash' });
    b.pt(p);
    b.text(p, `P${'₁₂'[i]}`, { dx: 10, dy: 4 });
  });
  b.curve((u) => [0.25 * Math.cos(u), 0.25 * Math.sin(u)], 0, a, { cls: 'c2' });
  b.text([0.3, 0.12], 'α', { dx: 2 });
  b.update();
}

/* 第 4 页：图 7-2-3 */
function initEx1() {
  const b = board($('ex1Fig'), { x: [-1.5, 4], y: [-4, 1.5], ticks: 1, w: 460 });
  b.seg([[0, 0], [2.3, -3.45]], { cls: 'term' });
  b.seg([[2, 0], [2, -3]], { cls: 'dash' });
  b.seg([[0, -3], [2, -3]], { cls: 'dash' });
  b.pt([2, -3], { cls: 'c2', r: 6 });
  b.text([2, -3], 'P(2, −3)', { cls: 'lb up', dx: 10, dy: 6 });
  b.update();
}

/* 第 5 页：图 7-2-5，π/6 与 5π/6 */
function initEx2() {
  const b = board($('ex2Fig'), { x: [-1.6, 1.6], y: [-1.2, 1.3], ticks: 0, grid: false, w: 480 });
  b.curve((u) => [Math.cos(u), Math.sin(u)], 0, TAU, { cls: 'c1' });
  [Math.PI / 6, 5 * Math.PI / 6].forEach((t, i) => {
    const p = [Math.cos(t), Math.sin(t)];
    b.seg([[0, 0], [1.4 * p[0], 1.4 * p[1]]], { cls: 'term' });
    b.seg([[p[0], 0], p], { cls: 'dash' });
    b.pt(p, { cls: 'c2', r: 6 });
    b.text(p, i ? "P′" : 'P', { dx: i ? -30 : 10, dy: -10 });
  });
  b.text([0, 0], 'O', { dx: -18, dy: 22 });
  b.update();
}

/* 第 7 页：(α, sin α) 的描点，横轴弧度，横纵同比例 */
function initSinPts() {
  const b = board($('sinPts'), { x: [-0.35, 6.9], y: [-1.35, 1.35], ticks: [0, 1], w: 640, labels: ['α', 'sin α'] });
  b.fn(Math.sin, { from: 0, to: TAU, cls: 'dash' });
  const LAB = { 3: 'π/2', 6: 'π', 9: '3π/2', 12: '2π' };
  for (let k = 0; k <= 12; k += 1) {
    const t = (k * Math.PI) / 6;
    b.seg([[t, 0], [t, Math.sin(t)]], { cls: 'thin' });
    b.pt([t, Math.sin(t)], { cls: 'c2', r: 5 });
    if (LAB[k]) b.text([t, 0], LAB[k], { cls: 'lb up small-lb mid', dy: Math.sin(t) > 0.1 || k === 6 || k === 12 ? 22 : -10 });
  }
  b.update();
}

/* 第 8 页：图 7-2-7 三张符号图 */
function initSigns() {
  const S = { sgSin: ['+', '+', '−', '−'], sgCos: ['+', '−', '−', '+'], sgTan: ['+', '−', '+', '−'] };
  const POS = [[0.5, 0.5], [-0.5, 0.5], [-0.5, -0.5], [0.5, -0.5]];
  Object.entries(S).forEach(([id, signs]) => {
    const b = board($(id), { x: [-1, 1], y: [-1, 1], ticks: 0, grid: false, w: 200 });
    signs.forEach((g, i) => b.text(POS[i], g, { cls: `lb up sign ${g === '+' ? 'plus' : 'minus'}`, dy: 10 }));
    b.update();
  });
}

let symApi = null;
window.LESSON = {
  init() {
    initRatio();
    initEx1();
    initEx2();
    unitCircle($('ucCoord'), $('ucCoordR'), 'coord', 2 * Math.PI / 3).b.update();
    unitCircle($('ucLines'), $('ucLinesR'), 'lines', Math.PI / 3).b.update();
    symApi = unitCircle($('ucSym'), $('ucSymR'), 'sym', Math.PI / 6);
    symApi.b.update();
    $('symBtns').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-k]');
      if (!btn) return;
      symApi.s.k = btn.dataset.k;
      $('symBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
      symApi.b.update();
    });
    initSinPts();
    initSigns();
  },
};
