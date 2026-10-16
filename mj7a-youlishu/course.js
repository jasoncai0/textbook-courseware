'use strict';
/* 七上 2.2 有理数与无理数 · 本课互动：分数化小数（竖式除法找循环节）、剪拼正方形、试分数、逐位逼近 a（核心，BigInt 精确计算）、练一练判断。
 * 通用部分见 ../shared/math.js、numline.js。 */
const { board, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];

/* ---------- 第 4 页：分数化小数（模拟竖式：记下每一步的余数，余数重复处开始循环） ---------- */
const MAX_SHOW = 40;
function toDecimal(m, n) {
  const neg = m < 0;
  const a = Math.abs(m);
  const int = Math.floor(a / n);
  let r = a % n;
  const seen = new Map();
  const digits = [];
  while (r !== 0 && !seen.has(r)) {
    seen.set(r, digits.length);
    r *= 10;
    digits.push(Math.floor(r / n));
    r %= n;
  }
  return { neg, int, digits, start: r === 0 ? -1 : seen.get(r) };
}
const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));
function decimalTex({ neg, int, digits, start }) {
  const s = neg ? '-' : '';
  if (start < 0) return `${s}${int}${digits.length ? `.${digits.join('')}` : ''}`;
  const pre = digits.slice(0, start).join('');
  const cyc = digits.slice(start);
  if (cyc.length > 12) return null;
  const dotted = cyc.length === 1 ? `\\dot{${cyc[0]}}` : `\\dot{${cyc[0]}}${cyc.slice(1, -1).join('')}\\dot{${cyc[cyc.length - 1]}}`;
  return `${s}${int}.${pre}${dotted}`;
}
function initDivider() {
  const QUICK = [[3, 10], [-311, 100], [1, 3], [4, 15], [1, 7], [2, 111], [22, 7]];
  $('dvQuick').innerHTML = QUICK.map(([m, n]) => `<button type="button" class="btn" data-m="${m}" data-n="${n}">${m < 0 ? '−' : ''}${Math.abs(m)}/${n}</button>`).join('');
  const show = () => {
    const m = Math.trunc(+$('dvM').value);
    const n = Math.trunc(+$('dvN').value);
    const out = $('dvOut');
    if (!Number.isFinite(m) || !Number.isFinite(n) || n < 1 || n > 999 || Math.abs(m) > 999) {
      out.innerHTML = '请输入整数：分子在 −999～999 之间，分母在 1～999 之间（分母不能是 0）。';
      return;
    }
    const d = toDecimal(m, n);
    const fr = `${m < 0 ? '-' : ''}\\dfrac{${Math.abs(m)}}{${n}}`;
    const long = `${d.neg ? '−' : ''}${d.int}${d.digits.length ? '.' : ''}${d.digits.slice(0, MAX_SHOW).map((x, i) => (d.start >= 0 && i >= d.start ? `<b class="cyc">${x}</b>` : x)).join('')}${d.start >= 0 ? '<b class="cyc">…</b>' : ''}`;
    const t = decimalTex(d);
    const kind = d.start < 0
      ? `除到余数为 0，是<b>有限小数</b>。`
      : `余数重复出现，是<b>循环小数</b>，循环节有 ${d.digits.length - d.start} 位。`;
    out.innerHTML = `<span class="dv-big">$${fr}=${t ?? '\\cdots'}$</span><br><span class="dv-long">${long}</span><br>${kind}${gcd(m, n) > 1 && m !== 0 ? `（约分后是 $\\frac{${Math.abs(m) / gcd(m, n)}}{${n / gcd(m, n)}}$）` : ''}`;
    tex(out);
  };
  ['dvM', 'dvN'].forEach((id) => $(id).addEventListener('input', show));
  $('dvQuick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    $('dvM').value = btn.dataset.m;
    $('dvN').value = btn.dataset.n;
    show();
  });
  show();
}

/* ---------- 第 5 页：剪拼（图 2-1）----------
 * 每个三角形 = 直角顶点 R + 两条长为 1 的直角边，方向角 θ 与 θ + 90°。
 * 剪拼时只做平移和旋转（刚体运动），R 移到大正方形中心 C，θ 转到 0°、90°、180°、270° 中的一个。 */
const C = [5, 1];
const PIECES = [
  { r: [1, 0], th: 90, to: 90 }, { r: [0, 1], th: 270, to: 270 },
  { r: [2.6, 0], th: 90, to: 180 }, { r: [1.6, 1], th: 270, to: 360 },
];
const rad = (d) => (d * Math.PI) / 180;
function triAt(p, u) {
  const R = [p.r[0] + (C[0] - p.r[0]) * u, p.r[1] + (C[1] - p.r[1]) * u];
  const th = rad(p.th + (p.to - p.th) * u);
  return [R, [R[0] + Math.cos(th), R[1] + Math.sin(th)], [R[0] + Math.cos(th + Math.PI / 2), R[1] + Math.sin(th + Math.PI / 2)]];
}
function initCut() {
  const s = { u: 0 };
  const b = board($('cutBoard'), { x: [-0.4, 6.6], y: [-0.5, 2.5], w: 620, axes: false, grid: false });
  PIECES.forEach((p, i) => {
    b.poly(() => triAt(p, s.u), { cls: `tri t${i % 2}` });
    b.seg(() => { const [, A, B] = triAt(p, s.u); return [A, B]; }, { cls: 'cutred' });
  });
  b.text(() => (s.u < 0.01 ? [0.5, 0] : null), '1', { cls: 'lb up mid', dy: 22 }); b.text(() => (s.u < 0.01 ? [2.1, 0] : null), '1', { cls: 'lb up mid', dy: 22 });
  b.text(() => (s.u > 0.99 ? [5.5, 1.5] : null), 'a', { cls: 'lb', dx: 6, dy: -6 });
  b.text(() => (s.u > 0.99 ? [4.5, 1.5] : null), 'a', { cls: 'lb', dx: -18, dy: -6 });
  b.text(() => (s.u > 0.99 ? [4.5, 0.5] : null), 'a', { cls: 'lb', dx: -18, dy: 18 });
  b.text(() => (s.u > 0.99 ? [5.5, 0.5] : null), 'a', { cls: 'lb', dx: 6, dy: 18 });
  b.text(() => (s.u > 0.99 ? [5, -0.1] : null), '面积 = 1 + 1 = 2', { cls: 'lb up mid', dy: 20 });
  let busy = false;
  const run = (to) => {
    if (busy) return;
    busy = true;
    const from = s.u;
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 1800);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      s.u = from + (to - from) * e;
      b.update();
      if (k < 1) requestAnimationFrame(tick); else busy = false;
    };
    requestAnimationFrame(tick);
  };
  $('cutBtns').addEventListener('click', (e) => {
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (a === 'go') run(1);
    if (a === 'back') run(0);
  });
  boards.push(b);
}

/* ---------- 第 6 页：试分数：(m/n)² 落在数轴上的哪里？ ---------- */
function initFrac() {
  const s = { v: 2.25 };
  const b = NumLine.board($('frBoard'), { from: 1, to: 3, w: 620, h: 130, pad: 0.15 });
  NumLine.axis(b, { from: 1, to: 3, step: 0.5, minor: 0.1, tail: 0.2, lead: 0.1 });
  b.seg([[2, -0.5], [2, 0.9]], { cls: 'two' });
  b.text([2, 0.9], '2', { cls: 'nl-val', dy: -6 });
  b.pt(() => [Math.min(3.1, Math.max(0.9, s.v)), 0], { cls: 'c2', r: 8 });
  b.text(() => [Math.min(3.1, Math.max(0.9, s.v)), 0], () => 'a²', { cls: 'nl-or', dy: -16 });
  const QUICK = [[3, 2], [4, 3], [5, 3], [5, 4], [7, 4], [7, 5], [17, 12], [41, 29]];
  $('frQuick').innerHTML = QUICK.map(([m, n]) => `<button type="button" class="btn" data-m="${m}" data-n="${n}">${m}/${n}</button>`).join('');
  const show = () => {
    const m = Math.trunc(+$('frM').value);
    const n = Math.trunc(+$('frN').value);
    const msg = $('frMsg');
    if (!(m >= 1 && n >= 1 && m <= 999 && n <= 999)) { msg.innerHTML = '请输入 1～999 之间的整数。'; return; }
    s.v = (m * m) / (n * n);
    const [mm, nn2] = [m * m, 2 * n * n];
    const cmp = mm > nn2 ? '比 2 大' : mm < nn2 ? '比 2 小' : '正好等于 2';
    msg.className = 'tip feedback fb-warn';
    msg.innerHTML = `$\\left(\\frac{${m}}{${n}}\\right)^2=\\frac{${mm}}{${n * n}}\\approx${(mm / (n * n)).toFixed(4)}$，${cmp}。<br>分子 $${m}\\times${m}=${mm}$，而分母的 2 倍是 $${nn2}$：不相等。`;
    tex(msg);
    b.update();
  };
  ['frM', 'frN'].forEach((id) => $(id).addEventListener('input', show));
  $('frQuick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    $('frM').value = btn.dataset.m;
    $('frN').value = btn.dataset.n;
    show();
  });
  show();
  boards.push(b);
}

/* ---------- 第 7 页：逐位逼近 a（a² = 2），全部用 BigInt 精确比较 ---------- */
const TEN = 10n;
function isqrt(n) {
  if (n < 2n) return n;
  let x = n;
  let y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + n / x) / 2n; }
  return x;
}
const p10 = (k) => TEN ** BigInt(k);
const dec = (N, k) => { const s = N.toString().padStart(k + 1, '0'); return k ? `${s.slice(0, -k)}.${s.slice(-k)}` : s; };
const MAX_LEVEL = 6;
function initZoom() {
  const s = { k: 0 };
  const b = board($('zoomBoard'), { x: [-0.8, 10.8], y: [-1.3, 1.7], w: 900, h: 190, axes: false, grid: false });
  const L = () => isqrt(2n * p10(2 * s.k)); // a 的前 k 位小数：L / 10^k ≤ a < (L + 1) / 10^k
  const tickN = (j) => L() * TEN + BigInt(j); // 第 j 个刻度 = tickN / 10^(k+1)
  const isBig = (j) => tickN(j) * tickN(j) > 2n * p10(2 * s.k + 2);
  const cross = () => Array.from({ length: 10 }, (_, j) => j).find((j) => !isBig(j) && isBig(j + 1));
  b.seg([[-0.5, 0], [10.5, 0]], { cls: 'zax' });
  for (let j = 0; j <= 10; j++) {
    b.seg([[j, -0.22], [j, 0.22]], { cls: 'ztick' });
    b.pt([j, 0], { r: 7, cls: '' }).classList.add(`zpt${j}`);
    b.text([j, 0], () => (j === 0 || j === 10 ? dec(tickN(j), s.k + 1) : String(j)), { cls: j === 0 || j === 10 ? 'zend' : 'zdig', dy: j === 0 || j === 10 ? -20 : 32 });
  }
  b.poly(() => { const j = cross(); return [[j, -0.12], [j + 1, -0.12], [j + 1, 0.12], [j, 0.12]]; }, { cls: 'zband' });
  // a 的真实位置（只用于画小三角形；颜色判断用上面的整数比较）
  b.poly(() => {
    const x = (Math.SQRT2 * 10 ** (s.k + 1)) - Number(L() * TEN);
    return [[x, 0.3], [x - 0.12, 0.75], [x + 0.12, 0.75]];
  }, { cls: 'zmark' });
  b.onUpdate = () => {
    for (let j = 0; j <= 10; j++) b.svg.querySelector(`.zpt${j}`)?.setAttribute('class', `pt zpt${j} ${isBig(j) ? 'big' : 'small'}`);
    const j = cross();
    const [lo, hi] = [tickN(j), tickN(j + 1)];
    const k1 = s.k + 1;
    $('zoomRead').innerHTML = `$${dec(lo, k1)}^2=${dec(lo * lo, 2 * k1)}\\lt 2\\lt ${dec(hi * hi, 2 * k1)}=${dec(hi, k1)}^2$，所以 $${dec(lo, k1)}\\lt a\\lt ${dec(hi, k1)}$`;
    tex($('zoomRead'));
    $('zoomIn').disabled = s.k >= MAX_LEVEL;
    $('zoomOut').disabled = s.k <= 0;
  };
  $('zoomIn').addEventListener('click', () => { s.k = Math.min(MAX_LEVEL, s.k + 1); b.update(); });
  $('zoomOut').addEventListener('click', () => { s.k = Math.max(0, s.k - 1); b.update(); });
  boards.push(b);
}

/* ---------- 第 10 页：练一练（课本 p17）有理数 / 无理数 ---------- */
const RQ = [
  ['-6', 'r'], ['9.3', 'r'], ['-\\frac16', 'r'], ['42', 'r'], ['0', 'r'], ['-0.33', 'r'],
  ['0.333\\cdots', 'r'], ['1.414\\,213\\,56', 'r'], ['-2\\pi', 'i'], ['3.303\\,003\\,000\\,3\\cdots', 'i'], ['-3.141\\,592\\,6', 'r'],
];
function initRq() {
  $('rq').innerHTML = RQ.map(([t, k]) => `<div class="rq-one"><span class="rq-n">$${t}$</span><div class="pick" data-ans="${k}"><button type="button" data-k="r">有理数</button><button type="button" data-k="i">无理数</button></div></div>`).join('');
  tex($('rq'));
  MCheck.init($('rq'));
}

window.LESSON = {
  init() {
    initDivider();
    initCut();
    initFrac();
    initZoom();
    initRq();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
