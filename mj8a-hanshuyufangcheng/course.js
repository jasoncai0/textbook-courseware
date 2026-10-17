'use strict';
/* 八上 6.5 一次函数与二元一次方程 · 本课互动：点 ↔ 解检验器、拖交点（两直线绕定点转动）、例题分步作图、
 * 图像解法练习器、平行与非整数交点。所有直线由方程精确计算。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/** 分数 n/d（整数）→ TeX，自动约分 */
function frac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  [n, d] = [n / g, d / g];
  if (d === 1) return String(n);
  return `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
}
/** 整系数方程 ax + by + c = 0 → TeX */
function eqTex(a, b, c) {
  const term = (k, v, first) => {
    if (!k) return '';
    const s = k < 0 ? '-' : first ? '' : '+';
    const m = Math.abs(k);
    return `${s}${v && m === 1 ? '' : m}${v}`;
  };
  return `${term(a, 'x', true)}${term(b, 'y', !a)}${term(c, '', false)}=0`;
}

/* ---------- 第 4 页：点 ↔ 解 ---------- */
function initPoint() {
  const s = { x: 4, y: 5, found: [] };
  const b = board($('ptBoard'), { x: [-2.6, 6.6], y: [-5.6, 7.6], w: 420, h: 600, ticks: 1 });
  b.fn((x) => 2 * x - 3, { cls: 'c1' });
  b.text([4.3, 7], 'y = 2x − 3', { cls: 'lb up' });
  const foundLayer = b.svg.querySelector('g:last-of-type');
  b.seg(() => [[s.x, 0], [s.x, s.y]], { cls: 'dash' });
  b.seg(() => [[0, s.y], [s.x, s.y]], { cls: 'dash' });
  b.drag(() => [s.x, s.y], (x, y) => { s.x = clamp(Math.round(x), -2, 6); s.y = clamp(Math.round(y), -5, 7); });
  const showFound = () => {
    foundLayer.querySelectorAll('.dyn').forEach((e) => e.remove());
    s.found.forEach(([x, y]) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('class', 'pt c3 dyn'); c.setAttribute('cx', b.X(x)); c.setAttribute('cy', b.Y(y)); c.setAttribute('r', 7);
      foundLayer.insertBefore(c, foundLayer.firstChild);
    });
    $('ptFound').innerHTML = s.found.map(([x, y]) => `<span>$x=${x},\\ y=${y}$</span>`).join('');
    tex($('ptFound'));
  };
  b.onUpdate = () => {
    const v = 2 * s.x - s.y - 3;
    const msg = $('ptMsg');
    msg.className = `tip feedback ${v === 0 ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `$P(${s.x},${s.y})$：$2\\times${s.x < 0 ? `(${s.x})` : s.x}-${s.y < 0 ? `(${s.y})` : s.y}-3=${v}$　`
      + (v === 0 ? '结果是 0：<b>是方程的解</b>，点在直线上 ✓' : '结果不是 0：不是方程的解，点不在直线上');
    tex(msg);
  };
  $('ptRec').addEventListener('click', () => {
    if (2 * s.x - s.y - 3 !== 0) { $('ptMsg').innerHTML += '　——先把 P 拖到直线上'; return; }
    if (!s.found.some(([x, y]) => x === s.x && y === s.y)) s.found = [...s.found, [s.x, s.y]];
    showFound();
  });
  $('ptClr').addEventListener('click', () => { s.found = []; showFound(); });
  b.update();
}

/* ---------- 第 6 页：拖交点 ---------- */
function initCross() {
  const s = { x: 1, y: -1 };
  const A = [0, -3];   // 直线①过 (0, −3)
  const B = [0, -1.5]; // 直线②过 (0, −3/2)
  const b = board($('crossBoard'), { x: [-4.6, 4.6], y: [-5.6, 4.6], w: 460, h: 510, ticks: 1 });
  const k1 = () => (s.y - A[1]) / s.x;
  const k2 = () => (s.y - B[1]) / s.x;
  b.fn((x) => k1() * x + A[1], { cls: 'c1' });
  b.fn((x) => k2() * x + B[1], { cls: 'c2' });
  b.pt(A, { cls: 'c1', r: 6 });
  b.pt(B, { cls: 'c2', r: 6 });
  b.seg(() => [[s.x, 0], [s.x, s.y]], { cls: 'dash' });
  b.seg(() => [[0, s.y], [s.x, s.y]], { cls: 'dash' });
  b.text(() => [s.x, s.y], () => `P(${fmt(s.x)}, ${fmt(s.y)})`, { cls: 'lb up', dx: 14, dy: 26 });
  b.drag(() => [s.x, s.y], (x, y) => {
    let nx = clamp(snap(x, 0.5), -4, 4);
    if (nx === 0) nx = x < 0 ? -0.5 : 0.5; // 交点不能在 y 轴上（两直线都过 y 轴上的不同点）
    s.x = nx; s.y = clamp(snap(y, 0.5), -5, 4);
  });
  b.onUpdate = () => {
    // 直线①：y = (2y+6)/(2x)·x − 3 → 整系数；直线②：y = (2y+3)/(2x)·x − 3/2
    const [n1, d1] = [2 * s.y + 6, 2 * s.x];
    const [n2, d2] = [2 * s.y + 3, 2 * s.x];
    const g1 = gcd(n1, d1) || 1;
    const g2 = gcd(n2, d2) || 1;
    const [a1, e1] = [n1 / g1, d1 / g1]; // k1 = a1/e1
    const [a2, e2] = [n2 / g2, d2 / g2];
    // ① a1 x − e1 y − 3 e1 = 0；② 2a2 x − 2e2 y − 3e2 = 0（再约去公因数）
    const norm = (a, bb, c) => { const g = gcd(gcd(a, bb), c) || 1; const sg = a < 0 || (a === 0 && bb < 0) ? -1 : 1; return [sg * a / g, sg * bb / g, sg * c / g]; };
    const q1 = norm(a1, -e1, -3 * e1);
    const q2 = norm(2 * a2, -2 * e2, -3 * e2);
    const fx1 = `y=${a1 === 0 ? '' : `${frac(a1, e1) === '1' ? '' : frac(a1, e1) === '-1' ? '-' : frac(a1, e1)}x`}-3`;
    const fx2 = `y=${a2 === 0 ? '' : `${frac(a2, e2) === '1' ? '' : frac(a2, e2) === '-1' ? '-' : frac(a2, e2)}x`}-\\frac32`;
    $('crossEqs').innerHTML = `<div><span class="l1">直线①</span> $${fx1}$ ⇔ $${eqTex(...q1)}$</div><div><span class="l2">直线②</span> $${fx2}$ ⇔ $${eqTex(...q2)}$</div>`;
    const v1 = q1[0] * s.x + q1[1] * s.y + q1[2];
    const v2 = q2[0] * s.x + q2[1] * s.y + q2[2];
    const msg = $('crossMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `代入 $x=${fmt(s.x)},\\ y=${fmt(s.y)}$：方程①左边 $=${fmt(v1)}$，方程②左边 $=${fmt(v2)}$——<b>两个方程都成立</b>，这组值是方程组的解．`;
    tex($('crossEqs')); tex(msg);
  };
  $('crossReset').addEventListener('click', () => { s.x = 1; s.y = -1; b.update(); });
  tex($('crossReset'));
  b.update();
  return () => b.update();
}

/* ---------- 第 7 页：例（随步骤出现） ---------- */
const EX = { step: 0 };
let exBoard;
function initExample() {
  const b = board($('exBoard'), { x: [-3.6, 5.6], y: [-3.6, 4.6], w: 520, h: 460, ticks: 1 });
  b.fn((x) => -0.5 * x + 2, { cls: 'c1', from: -3.6, to: () => (EX.step >= 2 ? 5.6 : -3.6) });
  b.fn((x) => 2 * x - 3, { cls: 'c2', from: -3.6, to: () => (EX.step >= 4 ? 5.6 : -3.6) });
  b.text(() => (EX.step >= 2 ? [-3.4, 4] : null), 'y = −½x + 2', { cls: 'lb up bl' });
  b.text(() => (EX.step >= 4 ? [3.1, 4.2] : null), 'y = 2x − 3', { cls: 'lb up o' });
  b.seg(() => (EX.step >= 5 ? [[2, 0], [2, 1]] : [[0, 0], [0, 0]]), { cls: 'dash' });
  b.seg(() => (EX.step >= 5 ? [[0, 1], [2, 1]] : [[0, 0], [0, 0]]), { cls: 'dash' });
  b.pt([2, 1], { r: 7, show: () => EX.step >= 5 });
  b.text(() => (EX.step >= 5 ? [2, 1] : null), 'P(2, 1)', { cls: 'lb up', dx: 10, dy: -12 });
  exBoard = b;
  b.update();
}

/* ---------- 第 8 页：图像解法练习器 ---------- */
// [标签, 方程组 TeX, 直线① [k, b, TeX], 直线② [k, b, TeX], 解]
const SYS = [
  ['练习 2(1)', '\\begin{cases}x-y=5\\\\y=3-x\\end{cases}', [1, -5, 'y=x-5'], [-1, 3, 'y=-x+3'], [4, -1]],
  ['练习 2(2)', '\\begin{cases}2x+3y=5\\\\3x-y=2\\end{cases}', [-2 / 3, 5 / 3, 'y=-\\frac23x+\\frac53'], [3, -2, 'y=3x-2'], [1, 1]],
  ['习题 1(1)', '\\begin{cases}3x-y=0\\\\x+3y=0\\end{cases}', [3, 0, 'y=3x'], [-1 / 3, 0, 'y=-\\frac13x'], [0, 0]],
  ['习题 1(2)', '\\begin{cases}x+y=0\\\\x-y+2=0\\end{cases}', [-1, 0, 'y=-x'], [1, 2, 'y=x+2'], [-1, 1]],
  ['习题 2(1)', '\\begin{cases}5x-y-4=0\\\\3x+2y-18=0\\end{cases}', [5, -4, 'y=5x-4'], [-1.5, 9, 'y=-\\frac32x+9'], [2, 6]],
  ['习题 2(2)', '\\begin{cases}7x+6y-8=0\\\\5x-9y-19=0\\end{cases}', [-7 / 6, 4 / 3, 'y=-\\frac76x+\\frac43'], [5 / 9, -19 / 9, 'y=\\frac59x-\\frac{19}{9}'], [2, -1]],
];
function initSolve() {
  const s = { i: 0, show: false };
  const cur = () => SYS[s.i];
  const b = board($('solveBoard'), { x: [-5.6, 5.6], y: [-5.6, 7.6], w: 440, h: 520, ticks: 1 });
  b.fn((x) => cur()[2][0] * x + cur()[2][1], { cls: 'c1' });
  b.fn((x) => cur()[3][0] * x + cur()[3][1], { cls: 'c2' });
  b.pt(() => cur()[4], { r: 7, show: () => s.show });
  b.seg(() => (s.show ? [[cur()[4][0], 0], cur()[4]] : [[0, 0], [0, 0]]), { cls: 'dash' });
  b.seg(() => (s.show ? [[0, cur()[4][1]], cur()[4]] : [[0, 0], [0, 0]]), { cls: 'dash' });
  b.text(() => (s.show ? cur()[4] : null), () => `(${cur()[4].join(', ').replace(/-/g, '−')})`, { cls: 'lb up', dx: 10, dy: -12 });
  b.onUpdate = () => {
    const [, sys, l1, l2, [x, y]] = cur();
    $('solveEqs').innerHTML = `<div>$${sys}$</div><div><span class="l1">直线①</span> $${l1[2]}$　<span class="l2">直线②</span> $${l2[2]}$</div>`;
    const msg = $('solveMsg');
    msg.className = `tip feedback ${s.show ? 'fb-ok' : ''}`;
    msg.innerHTML = s.show ? `交点 $(${x},${y})$，所以方程组的解为 $\\begin{cases}x=${x}\\\\y=${y}\\end{cases}$．别忘了代入原方程组检验．` : '先在方格纸上画出两条直线，读出交点，再点“显示交点”核对．';
    tex($('solveEqs')); tex(msg);
  };
  $('solveBtns').innerHTML = SYS.map(([lab], i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${lab}</button>`).join('') + '<button type="button" class="btn" data-show="1">显示交点</button>';
  $('solveBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.show) s.show = !s.show;
    else {
      s.i = +btn.dataset.i; s.show = false;
      $('solveBtns').querySelectorAll('[data-i]').forEach((x) => x.classList.toggle('solid', x === btn));
    }
    b.update();
  });
  b.update();
}

/* ---------- 第 9 页：平行、非整数交点 ---------- */
function initLimits() {
  const p = board($('parBoard'), { x: [-3.6, 3.6], y: [-3.6, 3.6], w: 400, h: 400, ticks: 1 });
  p.fn((x) => 2 * x + 1, { cls: 'c1' });
  p.fn((x) => 2 * x - 1, { cls: 'c2' });
  p.update();
  const q = board($('fracBoard'), { x: [-1.6, 3.6], y: [-1.6, 3.6], w: 400, h: 400, ticks: 1 });
  q.fn((x) => -x + 3, { cls: 'c1' });
  q.fn((x) => 2 * x - 1, { cls: 'c2' });
  q.pt([4 / 3, 5 / 3], { r: 6 });
  q.text([4 / 3, 5 / 3], '?', { cls: 'lb up', dx: 10, dy: -8 });
  q.update();
}

let redraws = [];
window.LESSON = {
  init() {
    initPoint();
    redraws = [initCross()];
    initExample();
    initSolve();
    initLimits();
  },
  onRender(slide, step) {
    if (slide.querySelector('#exBoard')) { EX.step = step; exBoard.update(); }
    requestAnimationFrame(() => redraws.forEach((r) => r()));
  },
};
