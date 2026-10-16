'use strict';
/* 高一上 5.2 函数的表示方法 · 本课互动：气温图、三种表示法联动（例 1、例 2）、分段函数搭建（例 3、习题 12）、练习图。通用部分见 ../shared/math.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snapTo = (v, st) => Math.round(v / st) * st;
const minus = (s) => String(s).replace(/^-/, '−'); // 表格里的负号用印刷体

/* 第 3 页：气温变化示意（与 5.1 同一组描点，依课本图 5-1-1 的走势，Catmull-Rom 样条） */
const TEMP_PTS = [[0, -1], [2, -1.8], [4, -2], [6, -1.2], [8, 1], [10, 4], [12, 7.3], [14, 9], [15, 7.9], [16, 7.6], [18, 7.4], [20, 4.2], [22, 0], [24, -1.4]];
function tempAt(t) {
  const n = TEMP_PTS.length;
  const after = TEMP_PTS.findIndex(([x]) => x > t);
  const i = clamp((after < 0 ? n : after) - 1, 0, n - 2);
  const y = (k) => TEMP_PTS[clamp(k, 0, n - 1)][1];
  const u = (t - TEMP_PTS[i][0]) / (TEMP_PTS[i + 1][0] - TEMP_PTS[i][0]);
  const [p0, p1, p2, p3] = [y(i - 1), y(i), y(i + 1), y(i + 2)];
  return 0.5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (3 * p1 - p0 - 3 * p2 + p3) * u * u * u);
}
function initTemp() {
  const b = board($('temp'), { x: [-1.5, 28], y: [-3.5, 11], w: 560, h: 300, ticks: [4, 2], labels: ['t/h', 'θ/℃'] });
  b.fn(tempAt, { from: 0, to: 24 });
  b.update();
}

/* 第 5、6 页：三种表示法联动——点表格一列 / 拖图上的点 / 拖滑块，三处高亮同一对 (x, y) */
const LINKED = {
  lk1: {
    f: (x) => 2 * x,
    xs: [1, 2, 3, 4], range: [1, 4, 1], x0: 2, heads: ['$x$/听', '$y$/元'],
    pieces: [{ tex: 'y=2x,\\ x\\in\\{1,2,3,4\\}', on: () => true }],
    calc: (x) => `x=${x}\\text{ 时，}y=2\\times ${x}=${2 * x}`,
    board: { x: [-0.8, 5.6], y: [-1, 9.5], w: 380, h: 330, ticks: [1, 2] },
    draw: (b, f, xs) => xs.forEach((x) => b.pt([x, f(x)], { r: 6 })),
  },
  lk2: {
    f: Math.abs,
    xs: [-3, -1, 0, 1, 3], range: [-4, 4, 0.5], x0: -3, heads: ['$x$', '$f(x)$'],
    pieces: [
      { tex: '-x,\\ x\\lt 0', on: (x) => x < 0 },
      { tex: 'x,\\ x\\ge 0', on: (x) => x >= 0 },
    ],
    calc: (x) => (x < 0 ? `${x}\\lt 0,\\ f(${x})=-(${x})=${-x}` : `${x}\\ge 0,\\ f(${x})=${x}`),
    board: { x: [-4.5, 4.5], y: [-1, 4.8], w: 420, ticks: 1 },
    draw: (b, f) => b.fn(f),
  },
};

function linkedHtml(cfg) {
  const [lo, hi, st] = cfg.range;
  const many = cfg.pieces.length > 1;
  const formula = many
    ? `<p class="lk-name">$f(x)=|x|=$</p>${cfg.pieces.map((p, i) => `<p class="lk-piece brace" data-i="${i}">$${p.tex}$</p>`).join('')}`
    : `<p class="lk-piece" data-i="0">$${cfg.pieces[0].tex}$</p>`;
  const cells = (row) => cfg.xs.map((x) => `<td><button type="button" data-x="${x}">${row(x)}</button></td>`).join('');
  return `<div class="lk-col lk-f"><h4>解析法</h4><div class="lk-pieces${many ? ' many' : ''}">${formula}</div><p class="lk-calc"></p>`
    + `<div class="slider-row" data-noswipe>$x=$<input type="range" min="${lo}" max="${hi}" step="${st}" value="${cfg.x0}"><b class="v"></b></div></div>`
    + `<div class="lk-col lk-t"><h4>列表法</h4><table class="mtab lk-tab" data-noswipe><tr><th>${cfg.heads[0]}</th>${cells(minus)}</tr>`
    + `<tr><th>${cfg.heads[1]}</th>${cells((x) => minus(cfg.f(x)))}</tr></table><p class="muted small-t">点表格中的任意一列</p></div>`
    + '<div class="lk-col lk-g"><h4>图象法</h4><div class="lk-board"></div><p class="muted small-t">拖动橙色点</p></div>';
}

function initLinked(id) {
  const cfg = LINKED[id];
  const host = $(id);
  const [lo, hi, st] = cfg.range;
  const s = { x: cfg.x0 };
  host.innerHTML = linkedHtml(cfg);
  tex(host);
  const input = host.querySelector('input');
  const calc = host.querySelector('.lk-calc');
  const b = board(host.querySelector('.lk-board'), cfg.board);
  const p = () => [s.x, cfg.f(s.x)];
  cfg.draw(b, cfg.f, cfg.xs);
  b.seg(() => [[s.x, 0], p()], { cls: 'dash' });
  b.seg(() => [[0, cfg.f(s.x)], p()], { cls: 'dash' });
  b.text(p, () => `(${fmt(s.x)}, ${fmt(cfg.f(s.x))})`, { cls: 'lb up', dx: 12, dy: -12 });
  b.drag(p, (x) => { s.x = clamp(snapTo(x, st), lo, hi); });
  b.onUpdate = () => {
    input.value = s.x;
    host.querySelector('.slider-row .v').textContent = minus(fmt(s.x));
    host.querySelectorAll('.lk-tab button').forEach((btn) => btn.classList.toggle('cur', +btn.dataset.x === s.x));
    host.querySelectorAll('.lk-piece').forEach((el) => el.classList.toggle('cur', cfg.pieces[+el.dataset.i].on(s.x)));
    calc.innerHTML = `$${cfg.calc(s.x)}$`;
    tex(calc);
  };
  input.addEventListener('input', () => { s.x = +input.value; b.update(); });
  host.querySelector('.lk-tab').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-x]');
    if (!btn) return;
    s.x = +btn.dataset.x;
    b.update();
  });
  b.update();
  return b;
}

/* 第 8 页：分段函数搭建。每段 (a, b]：左端空心、右端实心（b 为 Infinity 时是射线） */
const POST_STEP_G = 20;
const POST_MAX_G = 90;
const POST_PIECES = Array.from({ length: Math.ceil(POST_MAX_G / POST_STEP_G) }, (_, k) => {
  const a = k * POST_STEP_G;
  const c = Math.min(a + POST_STEP_G, POST_MAX_G);
  const y = 120 * (k + 1);
  return { a, b: c, f: () => y, ftex: String(y), dtex: `${a}\\lt x\\le ${c}`, calc: () => `y=${y}` };
});
const PW_SETS = {
  taxi: {
    unit: ['km', '元'], drawMax: 8.5, snap: 0.1,
    board: { x: [-0.9, 9.4], y: [-2.4, 23.5], w: 600, h: 420, ticks: [1, 3], labels: ['x/km', 'y/元'] },
    pieces: [
      { a: 0, b: 3, f: () => 9, ftex: '9', dtex: '0\\lt x\\le 3', calc: () => 'y=9' },
      { a: 3, b: Infinity, f: (x) => 2.4 * x + 1.8, ftex: '2.4x+1.8', dtex: 'x\\gt 3', calc: (x) => `y=2.4\\times ${x}+1.8=${fmt(2.4 * x + 1.8)}` },
    ],
  },
  post: {
    unit: ['g', '分'], drawMax: POST_MAX_G, snap: 1,
    board: { x: [-9, 101], y: [-75, 690], w: 600, h: 420, ticks: [20, 120], labels: ['x/g', 'y/分'] },
    pieces: POST_PIECES,
  },
};

const pieceAt = (set, x) => set.pieces.findIndex((p) => x > p.a && x <= p.b);

function pwFormulaTex(set, built, active) {
  if (!built) return '$y=\\ ?$　还没有画任何一段';
  const rows = set.pieces.slice(0, built).map((p, i) => {
    const row = `${p.ftex}, & ${p.dtex}`;
    return i === active ? `\\textcolor{#d9711c}{${p.ftex}}, & \\textcolor{#d9711c}{${p.dtex}}` : row;
  });
  return `$$y=\\begin{cases}${rows.join('\\\\')}\\end{cases}$$`;
}

function pwMessage(set, s) {
  const [ux, uy] = set.unit;
  const i = pieceAt(set, s.x);
  const xs = fmt(s.x, 1);
  if (i < 0) return { cls: 'warn', html: `$x=${xs}$ ${ux} 不在定义域内（$x\\gt 0$）。` };
  if (i >= s.built) return { cls: '', html: `$x=${xs}$ ${ux} 落在第 ${i + 1} 段 $${set.pieces[i].dtex}$——这一段还没画，点“画下一段”。` };
  const p = set.pieces[i];
  const edge = s.x === p.b && i + 1 < s.built ? `<br>端点 $x=${p.b}$ 属于这一段（实心）；下一段在这里是空心，取不到 ${fmt(set.pieces[i + 1].f(p.b))}。` : '';
  return { cls: 'ok', html: `$x=${xs}$ ${ux}，落在第 ${i + 1} 段 $${p.dtex}$：$${p.calc(+xs)}$ ${uy}。${edge}` };
}

function buildPwBoard(set, s) {
  const host = $('pw');
  host.innerHTML = '';
  const b = board(host, set.board);
  const [xMin, xMax] = set.board.x;
  const shown = (i) => () => s.built > i;
  const right = (p) => Math.min(p.b, set.drawMax);
  set.pieces.forEach((p, i) => {
    const seg = b.fn(p.f, { from: p.a, to: right(p) });
    seg.dataset.i = i;
  });
  // 空心点先画、实心点后画：相邻两段在同一点相接时（如例 3 的 (3, 9)），实心点盖在上面
  set.pieces.forEach((p, i) => b.pt([p.a, p.f(p.a)], { hollow: true, r: 7, show: shown(i) }));
  set.pieces.forEach((p, i) => { if (p.b !== Infinity) b.pt([p.b, p.f(p.b)], { r: 7, show: shown(i) }); });
  const on = () => { const i = pieceAt(set, s.x); return i >= 0 && i < s.built; };
  const hit = () => [s.x, set.pieces[pieceAt(set, s.x)].f(s.x)];
  b.seg(() => (on() ? [[s.x, 0], hit()] : [[s.x, 0], [s.x, 0]]), { cls: 'dash' });
  b.seg(() => (on() ? [[0, hit()[1]], hit()] : [[0, 0], [0, 0]]), { cls: 'dash' });
  b.pt(() => (on() ? hit() : null), { cls: 'c2', r: 8 });
  b.drag(() => [s.x, 0], (x) => { s.x = +clamp(snapTo(x, set.snap), 0, set.drawMax).toFixed(1); });
  b.onUpdate = () => {
    host.querySelectorAll('path[data-i]').forEach((el) => { el.style.display = +el.dataset.i < s.built ? '' : 'none'; });
    const i = pieceAt(set, s.x);
    $('pwFormula').innerHTML = pwFormulaTex(set, s.built, i < s.built ? i : -1);
    const m = pwMessage(set, s);
    $('pwMsg').className = `tip feedback ${m.cls ? `fb-${m.cls}` : ''}`;
    $('pwMsg').innerHTML = m.html;
    tex($('pwFormula'));
    tex($('pwMsg'));
    $('pwNext').disabled = s.built >= set.pieces.length;
  };
  b.update();
  return b;
}

function initPiecewise() {
  const s = { key: 'taxi', built: 0, x: 2 };
  let b = null;
  const load = (key) => {
    s.key = key; s.built = 0;
    s.x = key === 'taxi' ? 2 : 30;
    $('pwTabs').querySelectorAll('[data-set]').forEach((btn) => btn.classList.toggle('solid', btn.dataset.set === key));
    b = buildPwBoard(PW_SETS[key], s);
  };
  $('pwTabs').addEventListener('click', (e) => { const btn = e.target.closest('[data-set]'); if (btn) load(btn.dataset.set); });
  $('pwNext').addEventListener('click', () => { s.built = Math.min(PW_SETS[s.key].pieces.length, s.built + 1); b.update(); });
  $('pwReset').addEventListener('click', () => { s.built = 0; b.update(); });
  load('taxi');
}

/* 第 10 页：练习 2、3(1) 答案里的小图（在折叠的提示里，展开后重新量尺寸） */
function initAnswerBoards() {
  const vBoard = board($('ex2b'), { x: [-6.5, 2.5], y: [-0.8, 4.2], w: 360, ticks: 1 });
  vBoard.fn(Math.abs, { cls: 'dash' });
  vBoard.fn((x) => Math.abs(x + 3));
  vBoard.pt([-3, 0], { r: 6 });
  const sBoard = board($('ex3b'), { x: [-2, 17], y: [-8, 64], w: 360, h: 220, ticks: [5, 20] });
  sBoard.fn((x) => x * (15 - x), { from: 0, to: 15 });
  sBoard.pt([0, 0], { hollow: true, r: 6 });
  sBoard.pt([15, 0], { hollow: true, r: 6 });
  sBoard.pt([7.5, 56.25], { r: 6 });
  [vBoard, sBoard].forEach((bd) => {
    bd.svg.closest('details').addEventListener('toggle', () => requestAnimationFrame(() => bd.update()));
    bd.update();
  });
}

/* 第 11 页：练习 4 的四个图（依课本描绘的示意） */
function initPractice4() {
  const opt = { x: [-2.2, 3.2], y: [-2.2, 3.2], w: 240, ticks: 0, tickLabels: false };
  const a = board($('g4a'), opt);
  a.fn((x) => x * x);
  const bb = board($('g4b'), opt);
  bb.curve((t) => [t * t, t], -1.7, 1.7);
  const c = board($('g4c'), opt);
  c.curve((t) => [1.6 * Math.cos(t), 0.4 + 1.6 * Math.sin(t)], -Math.PI / 2, Math.PI / 2);
  const d = board($('g4d'), { ...opt, ticks: 1, tickLabels: true });
  const pts = [[-1, 0], [0, 1], [1, 1.15], [2, 2]];
  pts.slice(1).forEach((q, i) => d.seg([pts[i], q], { cls: 'c1' }));
  [a, bb, c, d].forEach((bd) => bd.update());
}

window.LESSON = {
  init() {
    initTemp();
    initLinked('lk1');
    initLinked('lk2');
    initPiecewise();
    initAnswerBoards();
    initPractice4();
  },
};
