'use strict';
/* 高一上 8.2 函数与数学模型 · 本课互动：气温示意图、n 次方计算器、四函数赛跑（可拉大视野）、数量级比较器、
 * 例 3 成本收入图、例 4 冷却曲线、例 5 利润与边际利润。通用部分见 ../shared/math.js */
const { board, slider, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/* 第 3 页：依课本图 8-2-1 的走势描点（Catmull-Rom 样条） */
const TEMP_PTS = [[0, -1], [2, -1.8], [4, -2], [6, -0.7], [8, 1.8], [10, 4.8], [12, 7.6], [14, 9], [15, 8.2], [16, 7.7], [18, 7.5], [20, 4.8], [22, 1.2], [23, 0], [24, -1]];
function tempAt(t) {
  const n = TEMP_PTS.length;
  const after = TEMP_PTS.findIndex(([x]) => x > t);
  const i = Math.max(0, Math.min(n - 2, (after < 0 ? n : after) - 1));
  const y = (k) => TEMP_PTS[Math.max(0, Math.min(n - 1, k))][1];
  const u = (t - TEMP_PTS[i][0]) / (TEMP_PTS[i + 1][0] - TEMP_PTS[i][0]);
  const [p0, p1, p2, p3] = [y(i - 1), y(i), y(i + 1), y(i + 2)];
  return 0.5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (3 * p1 - p0 - 3 * p2 + p3) * u * u * u);
}
function initTemp() {
  const s = { t: 14 };
  const b = board($('temp'), { x: [-1, 26], y: [-3.2, 10.5], w: 560, h: 300, ticks: [2, 2], labels: ['t/h', 'T/℃'] });
  b.fn(tempAt, { from: 0, to: 24 });
  b.seg(() => [[s.t, 0], [s.t, tempAt(s.t)]], { cls: 'dash' });
  b.drag(() => [s.t, tempAt(s.t)], (x) => { s.t = Math.round(Math.min(24, Math.max(0, x)) * 2) / 2; });
  b.onUpdate = () => { $('tempV').innerHTML = `$t=${s.t}$ 时，$T\\approx ${fmt(tempAt(s.t), 1)}$ ℃`; tex($('tempV')); };
  b.update();
}

/** 用常用对数表示的数 10^L 写成 KaTeX：小的直接写，大的写成 m × 10^e */
function sciTex(L) {
  if (L > -4 && L < 7) return String(+(10 ** L).toPrecision(5));
  const e = Math.floor(L);
  return `${(10 ** (L - e)).toFixed(3)}\\times 10^{${e}}`;
}

/* 第 4 页：n 次方计算器 */
const POW_BASES = [1.01, 0.99, 1.1, 0.9];
function initPow() {
  const s = { a: 1.01, n: 365 };
  const draw = () => {
    const L = s.n * Math.log10(s.a);
    $('powV').innerHTML = `$${s.a}^{${s.n}}\\approx ${sciTex(L)}$`;
    tex($('powV'));
    $('powNV').textContent = s.n;
    $('powPlot').innerHTML = '';
    const top = s.a > 1 ? s.a ** s.n : 1;
    const xs = niceStep(s.n / 5);
    const b = board($('powPlot'), { x: [-s.n * 0.05, s.n * 1.05], y: [-top * 0.08, top * 1.12], w: 520, h: 220, ticks: [xs, 0], labels: ['n', 'aⁿ'] });
    b.fn((x) => s.a ** x, { from: 0, to: s.n, n: 300 });
    b.pt([s.n, s.a ** s.n], { cls: 'c2', r: 7 });
    b.text([0, top * 1.12], `最高 ${s.a > 1 ? sciPlain(L) : '1'}`, { cls: 'lb up', dx: 22, dy: 20 });
    b.update();
    $('powBase').querySelectorAll('.btn').forEach((btn) => btn.classList.toggle('solid', +btn.dataset.a === s.a));
  };
  $('powBase').innerHTML = POW_BASES.map((a) => `<button type="button" class="btn" data-a="${a}">底数 ${a}</button>`).join('');
  $('powBase').addEventListener('click', (e) => { const btn = e.target.closest('[data-a]'); if (btn) { s.a = +btn.dataset.a; draw(); } });
  slider($('powN'), (v) => { s.n = v; draw(); });
}
/** 1、2、5 × 10^k 中不小于 raw 的最小值 */
const niceStep = (raw) => { const k = 10 ** Math.floor(Math.log10(Math.max(raw, 1))); return [1, 2, 5, 10].map((m) => m * k).find((v) => v >= raw); };
const sciPlain = (L) => (L < 7 ? String(+(10 ** L).toPrecision(5)) : `${(10 ** (L - Math.floor(L))).toFixed(2)}×10^${Math.floor(L)}`);

/* 第 5 页：四个函数赛跑 */
const RACE = [
  { name: '2^x', f: (x) => 2 ** x, cls: 'c1' },
  { name: 'x^2', f: (x) => x * x, cls: 'c2' },
  { name: 'x^{0.5}', f: (x) => Math.sqrt(x), cls: 'c3' },
  { name: '\\log_2x', f: (x) => Math.log2(x), cls: 'k4' },
];
const CROSS = [[2, 4], [4, 16], [4, 2], [16, 4]];
function initRace() {
  const s = { X: 5, t: 3 };
  let b = null;
  const rank = () => {
    const vals = RACE.map((r) => ({ ...r, v: r.f(s.t) })).sort((p, q) => q.v - p.v);
    $('raceRank').innerHTML = vals.map((r) => `<li><span class="sw ${r.cls}"></span>$${r.name}$ $=${fmt(r.v, 3)}$</li>`).join('');
    tex($('raceRank'));
  };
  const build = () => {
    $('race').innerHTML = '';
    const m = s.X * 0.07;
    b = board($('race'), { x: [-m, s.X], y: [-m * 1.6, s.X], w: 520, ticks: s.X <= 10 ? 1 : 2 });
    RACE.forEach((r) => b.fn((x) => (x > 0 ? r.f(x) : NaN), { cls: r.cls, from: 0.001, n: 600 }));
    CROSS.filter(([x, y]) => x <= s.X && y <= s.X).forEach((p) => { b.pt(p, { r: 6 }); b.text(p, `(${p[0]}, ${p[1]})`, { cls: 'lb up', dx: 8, dy: 22 }); });
    b.seg(() => [[s.t, -m * 1.6], [s.t, s.X]], { cls: 'dash' });
    b.drag(() => [s.t, -m * 0.8], (x) => { s.t = Math.round(Math.min(s.X, Math.max(0.1, x)) * 10) / 10; });
    b.onUpdate = rank;
    b.update();
  };
  slider($('raceX'), (v) => { s.X = v; s.t = Math.min(s.t, v); $('raceXV').textContent = v; build(); });
  return () => b && b.update();
}

/* 第 7 页：数量级比较（都用常用对数 L 表示，避免溢出） */
const LG = Math.log10;
const PAIRS = [
  { k: '1', a: ['1.01^x', (x) => x * LG(1.01)], b: ['x^{10}', (x) => 10 * LG(x)], jumps: [9000, 10000] },
  { k: '2', a: ['x^{0.1}', (x) => 0.1 * LG(x)], b: ['\\lg x', (x) => LG(LG(x))], jumps: [30, 1e10, 1e11] },
  { k: '3', a: ['2^x', (x) => x * LG(2)], b: ['x^{100}', (x) => 100 * LG(x)], jumps: [997, 1000] },
  { k: '4', a: ['x^{0.25}', (x) => 0.25 * LG(x)], b: ['\\log_2x', (x) => LG(Math.log2(x))], jumps: [16, 65536, 1e6] },
];
const xTex = (x) => (x < 1e6 ? fmt(x, 2).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : `10^{${fmt(LG(x), 2)}}`);
function initMag() {
  const s = { p: PAIRS[0], lx: 3 };
  const draw = () => {
    const x = 10 ** s.lx;
    const [La, Lb] = [s.p.a[1](x), s.p.b[1](x)];
    $('magXV').innerHTML = `$${xTex(x)}$`;
    $('magOut').innerHTML = [[s.p.a[0], La], [s.p.b[0], Lb]].map(([n, L]) => `<p><span>$y=${n}$</span><b>$\\approx ${sciTex(L)}$</b></p>`).join('');
    const diff = La - Lb;
    const msg = $('magMsg');
    msg.innerHTML = Math.abs(diff) < 1e-6 ? '两者<b>相等</b>。' : `$${diff > 0 ? s.p.a[0] : s.p.b[0]}$ 更大，大约是另一个的 $${sciTex(Math.abs(diff))}$ 倍。`;
    [$('magXV'), $('magOut'), msg].forEach(tex);
    $('magPair').querySelectorAll('.btn').forEach((btn) => btn.classList.toggle('solid', btn.dataset.k === s.p.k));
  };
  $('magPair').innerHTML = PAIRS.map((p) => `<button type="button" class="btn" data-k="${p.k}">$${p.a[0]}$ 与 $${p.b[0]}$</button>`).join('');
  tex($('magPair'));
  const jumps = () => {
    $('magJump').innerHTML = '跳到：' + s.p.jumps.map((x) => `<button type="button" class="btn" data-x="${x}">$x=${xTex(x)}$</button>`).join('');
    tex($('magJump'));
  };
  $('magPair').addEventListener('click', (e) => { const btn = e.target.closest('[data-k]'); if (btn) { s.p = PAIRS.find((p) => p.k === btn.dataset.k); jumps(); draw(); } });
  $('magJump').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-x]');
    if (!btn) return;
    s.lx = LG(+btn.dataset.x);
    $('magX').value = s.lx;
    draw();
  });
  jumps();
  slider($('magX'), (v) => { s.lx = v; draw(); });
}

/* 第 8 页：例 3 成本与收入 */
function initCost() {
  const b = board($('cost'), { x: [-120, 2100], y: [-90, 1100], w: 520, h: 260, ticks: [500, 200], labels: ['x/台', '万元'] });
  b.fn((x) => 200 + 0.3 * x, { cls: 'c2', from: 0 });
  b.fn((x) => 0.5 * x, { cls: 'c1', from: 0 });
  b.pt([1000, 500], { r: 7 });
  b.text([1000, 500], '(1000, 500)', { cls: 'lb up', dx: 10, dy: 26 });
  b.text([1700, 1000], 'R', { cls: 'lb' });
  b.text([1800, 660], 'C', { cls: 'lb' });
  b.update();
}

/* 第 9 页：例 4 冷却曲线 */
function initCool() {
  const T = (t) => 24 + 64 * 0.5 ** (t / 10);
  const tStar = 10 * Math.log2(64 / 11);
  const s = { t: 20 };
  const b = board($('cool'), { x: [-4, 64], y: [-7, 96], w: 520, h: 420, ticks: [10, 10], labels: ['t/min', 'T/℃'] });
  b.seg([[0, 24], [64, 24]], { cls: 'dash' });
  b.fn(T, { from: 0, to: 64 });
  [[20, 40], [tStar, 35]].forEach(([t, v]) => { b.seg([[t, 0], [t, v]], { cls: 'dash' }); b.seg([[0, v], [t, v]], { cls: 'dash' }); b.pt([t, v], { r: 6 }); });
  b.text([20, 40], '(20, 40)', { cls: 'lb up', dx: 8, dy: -10 });
  b.text([tStar, 35], `(${fmt(tStar, 1)}, 35)`, { cls: 'lb up', dx: 8, dy: 26 });
  b.text([48, 24], '室温 24 ℃', { cls: 'lb up', dy: -8 });
  b.drag(() => [s.t, T(s.t)], (x) => { s.t = Math.round(Math.min(60, Math.max(0, x)) * 10) / 10; });
  b.onUpdate = () => { $('coolV').innerHTML = `$t=${fmt(s.t, 1)}$ min 时，$T\\approx ${fmt(T(s.t), 1)}$ ℃`; tex($('coolV')); };
  b.update();
}

/* 第 10 页：例 5 利润与边际利润 */
function initMarginal() {
  const P = (x) => -20 * x * x + 2500 * x - 4000;
  const MP = (x) => 2480 - 40 * x;
  const s = { x: 30 };
  const xs = Array.from({ length: 100 }, (_, i) => i + 1);
  const b1 = board($('mp1'), { x: [-4, 104], y: [-12000, 84000], w: 520, h: 210, ticks: [10, 20000], labels: ['x', 'P(x)'] });
  xs.forEach((x) => b1.pt([x, P(x)], { r: 2.5 }));
  b1.pt(() => [s.x, P(s.x)], { cls: 'c2', r: 6 });
  b1.pt(() => [s.x + 1, P(s.x + 1)], { cls: 'c2', r: 6 });
  b1.seg([[0, 74120], [104, 74120]], { cls: 'dash' });
  const b2 = board($('mp2'), { x: [-4, 104], y: [-2000, 2900], w: 520, h: 150, ticks: [10, 1000], labels: ['x', 'MP(x)'] });
  xs.slice(0, 99).forEach((x) => b2.pt([x, MP(x)], { r: 2.5 }));
  b2.pt(() => [s.x, MP(s.x)], { cls: 'c2', r: 6 });
  slider($('mx'), (v) => {
    s.x = v;
    $('mxV').textContent = v;
    $('mpV').innerHTML = `$P(${v})=${P(v)}$，$P(${v + 1})=${P(v + 1)}$；$MP(${v})=P(${v + 1})-P(${v})=${MP(v)}$`;
    tex($('mpV'));
    b1.update(); b2.update();
  });
}

let redrawRace = () => {};
window.LESSON = {
  init() {
    initTemp();
    initPow();
    redrawRace = initRace();
    initMag();
    initCost();
    initCool();
    initMarginal();
  },
  onRender(slide) { if (slide.contains($('race'))) requestAnimationFrame(redrawRace); },
};
