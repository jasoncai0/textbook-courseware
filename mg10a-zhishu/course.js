'use strict';
/* 高一上 4.1 指数 · 本课互动：x^n = a 的交点（n 次方根奇偶情形）、指数的“填空”（有理点越来越密）、√2 的夹逼表。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 4 页：x^n = a 有几个实数解 ---------- */
const ROOT_NS = [2, 3, 4, 5, 6];
const ROOT_X = 3.2;
const ROOT_Y = 9.6;
const EPS = 1e-9;

// x^n = a 的全部实数解（从大到小）
function realRoots(n, a) {
  if (a === 0) return [0];
  const r = Math.abs(a) ** (1 / n);
  if (n % 2 === 1) return [Math.sign(a) * r];
  return a > 0 ? [r, -r] : [];
}

const rootTex = (n, body) => (n === 2 ? `\\sqrt{${body}}` : `\\sqrt[${n}]{${body}}`);
// 恰为整数就写“=”，否则写“≈”
const approx = (v) => (Math.abs(v - Math.round(v)) < EPS ? `=${Math.round(v)}` : `\\approx ${fmt(v, 3)}`);

function rootMessage(n, a) {
  const eq = `$x^{${n}}=${fmt(a, 1)}$`;
  const roots = realRoots(n, a);
  if (a === 0) return { cls: 'ok', html: `${eq} 只有 1 个解 $x=0$：0 的 $n$ 次方根等于 0。` };
  if (!roots.length) return { cls: 'warn', html: `${eq} <b>没有</b>实数解：$n=${n}$ 是偶数，$x^{${n}}\\ge 0$，负数没有偶次方根。` };
  const rad = rootTex(n, fmt(Math.abs(a), 1));
  if (roots.length === 1) {
    return { cls: 'ok', html: `${eq} 有 <b>1</b> 个实数解：$x=${rootTex(n, fmt(a, 1))}${approx(roots[0])}$（$n$ 为奇数，与 $a$ 同号）。` };
  }
  return { cls: 'ok', html: `${eq} 有 <b>2</b> 个实数解：$x=\\pm${rad}${approx(roots[0]).replace(/^(=|\\approx )/, '$1\\pm ')}$，互为相反数。` };
}

function initRoots() {
  const s = { n: 3, a: -8 };
  const b = board($('rootB'), { x: [-ROOT_X, ROOT_X], y: [-ROOT_Y, ROOT_Y], w: 520, h: 460, ticks: [1, 2] });
  b.fn((x) => x ** s.n);
  b.seg(() => [[-ROOT_X, s.a], [ROOT_X, s.a]], { cls: 'c2' });
  const hit = (k) => () => { const r = realRoots(s.n, s.a)[k]; return r === undefined ? null : [r, s.a]; };
  [0, 1].forEach((k) => {
    b.seg(() => { const p = hit(k)(); return p ? [p, [p[0], 0]] : [[0, 0], [0, 0]]; }, { cls: 'dash' });
    b.pt(hit(k), { cls: 'c2', r: 8 });
  });
  b.text([0.45, -8.3], () => `y = x${'⁰¹²³⁴⁵⁶'[s.n]}`, { cls: 'lb' });
  b.onUpdate = () => {
    const m = rootMessage(s.n, s.a);
    $('rootAV').textContent = fmt(s.a, 1);
    $('rootMsg').className = `tip feedback fb-${m.cls}`;
    $('rootMsg').innerHTML = m.html;
    tex($('rootMsg'));
  };
  const btns = $('rootN');
  btns.innerHTML = ROOT_NS.map((n) => `<button type="button" class="btn${n === s.n ? ' solid' : ''}" data-n="${n}">$n=${n}$</button>`).join('');
  tex(btns);
  btns.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]');
    if (!btn) return;
    s.n = +btn.dataset.n;
    btns.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  slider($('rootA'), (v) => { s.a = v; b.update(); });
}

/* ---------- 第 9 页：指数的“填空” ---------- */
const FILL_DENS = [1, 2, 4, 16]; // 第 k 层：x 取 1/FILL_DENS[k] 的倍数
const FILL_X = 3;
const FILL_R = [8, 7, 6, 3.6];
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// x = k/d（化成最简）对应的 2^x 写法，如 2^{3/4} = ⁴√(2³)
function powTex(k, d) {
  const g = gcd(Math.abs(k), d);
  const [p, q] = [k / g, d / g];
  const xs = q === 1 ? `${p}` : `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`;
  const head = `2^{${xs}}`;
  if (q === 1) return p >= 0 ? `${head}=${2 ** p}` : `${head}=\\frac{1}{${2 ** -p}}`;
  const m = Math.abs(p);
  const rad = rootTex(q, m === 1 ? '2' : `2^{${m}}`);
  return `${head}=${p < 0 ? `\\frac{1}{${rad}}` : rad}\\approx ${fmt(2 ** (k / d), 4)}`;
}

// 第 lv 层新加入的点：分母为 FILL_DENS[lv]、但不在上一层里的 x
function levelPoints(lv) {
  const d = FILL_DENS[lv];
  const prev = lv ? FILL_DENS[lv - 1] : 0;
  const ks = [];
  for (let k = -FILL_X * d; k <= FILL_X * d; k += 1) if (!prev || k % (d / prev) !== 0) ks.push(k);
  return ks.map((k) => [k / d, 2 ** (k / d)]);
}

function initFill() {
  const s = { lv: 0, k: 1 }; // 拖动点在 x = k / FILL_DENS[lv]
  const b = board($('fillB'), { x: [-3.4, 3.4], y: [-0.7, 8.7], w: 520, h: 520, ticks: [1, 1] });
  const den = () => FILL_DENS[s.lv];
  const total = () => FILL_DENS.slice(0, s.lv + 1).reduce((n, _, i) => n + levelPoints(i).length, 0);
  const curve = b.fn((x) => 2 ** x, { cls: 'dash', from: -FILL_X, to: FILL_X });
  FILL_DENS.forEach((_, lv) => levelPoints(lv).forEach((p) => b.pt(p, { cls: `lv${lv}`, r: FILL_R[lv], show: () => s.lv >= lv })));
  const cur = () => [s.k / den(), 2 ** (s.k / den())];
  b.seg(() => [[cur()[0], 0], cur()], { cls: 'c2' });
  b.pt(cur, { cls: 'ring', r: 12 });
  b.drag(() => [cur()[0], 0], (x) => { s.k = Math.round(Math.max(-FILL_X, Math.min(FILL_X, x)) * den()); }, { r: 8 });
  b.text([1.2, 8.1], 'y = 2ˣ', { cls: 'lb' });
  b.onUpdate = () => {
    curve.style.display = s.lv >= 2 ? '' : 'none'; // 先让学生猜新点落在哪，第 ③ 层再露出曲线
    $('fillMsg').innerHTML = `已填 <b>${total()}</b> 个点。当前：$${powTex(s.k, den())}$`;
    tex($('fillMsg'));
  };
  $('fillBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lv]');
    if (!btn) return;
    const x = s.k / den();
    s.lv = +btn.dataset.lv;
    s.k = Math.round(x * den());
    $('fillBtns').querySelectorAll('.btn').forEach((el) => el.classList.toggle('solid', +el.dataset.lv <= s.lv));
    b.update();
  });
  b.update();
}

/* ---------- 第 12 页：用有理数夹逼 2^√2 ---------- */
const SQRT2_DIGITS = Math.SQRT2.toFixed(12); // "1.414213562373"
const SHOW_DEC = 9; // 课本表 4-1-1 保留 9 位小数

// √2 精确到 10^-k 的不足近似、过剩近似（十进制字符串运算，避免浮点误差）
function sqrt2Bounds(k) {
  const lo = SQRT2_DIGITS.slice(0, k ? 2 + k : 1);
  const hiInt = Number(lo.replace('.', '')) + 1;
  const hi = (hiInt / 10 ** k).toFixed(k);
  return [lo, hi];
}

// 2^x 截取 9 位小数，每 3 位空一格，如 2.639 015 821…
function powShow(x) {
  const v = 2 ** Number(x);
  if (Number.isInteger(v)) return String(v);
  const [i, f] = v.toFixed(SHOW_DEC + 3).split('.');
  return `${i}.${f.slice(0, SHOW_DEC).replace(/(\d{3})(?=\d)/g, '$1 ')}…`;
}

function initSqrt2() {
  const s = { k: 1 };
  const [X0, X1, Y0, Y1] = [0.9, 2.1, 1.7, 4.45];
  const b = board($('sqB'), { x: [X0, X1], y: [Y0, Y1], w: 520, h: 440, ticks: [0.1, 0.25], tickLabels: false, labels: ['x', 'y'] });
  const bounds = () => sqrt2Bounds(s.k).map(Number);
  b.poly(() => { const [lo, hi] = bounds(); return [[lo, Y0], [hi, Y0], [hi, Y1], [lo, Y1]]; }, { cls: 'band-x' });
  b.poly(() => { const [lo, hi] = bounds(); return [[X0, 2 ** lo], [X1, 2 ** lo], [X1, 2 ** hi], [X0, 2 ** hi]]; }, { cls: 'band-y' });
  b.fn((x) => 2 ** x);
  b.seg([[Math.SQRT2, Y0], [Math.SQRT2, Y1]], { cls: 'dash' });
  b.pt(() => [bounds()[0], 2 ** bounds()[0]], { cls: 'c2', r: 6 });
  b.pt(() => [bounds()[1], 2 ** bounds()[1]], { cls: 'c2', r: 6 });
  [1, 1.5, 2].forEach((x) => b.text([x, Y0], String(x), { cls: 'tk', dy: -8, dx: 4 }));
  [2, 3, 4].forEach((y) => b.text([X0, y], String(y), { cls: 'tk', dx: 6, dy: 5 }));
  b.text([Math.SQRT2, Y1], '√2', { cls: 'lb', dx: 6, dy: 24 });
  b.text([1.62, 3.55], 'y = 2ˣ', { cls: 'lb' });
  b.onUpdate = () => {
    const [lo, hi] = sqrt2Bounds(s.k);
    $('sqKV').textContent = s.k;
    $('sqRows').innerHTML = Array.from({ length: s.k + 1 }, (_, i) => sqrt2Bounds(i))
      .map(([a, c]) => `<tr><td>${a}</td><td>${powShow(a)}</td><td>${c}</td><td>${powShow(c)}</td></tr>`).join('');
    $('sqMsg').innerHTML = `$${lo}\\lt\\sqrt2\\lt ${hi}$，所以 $2^{${lo}}\\lt 2^{\\sqrt2}\\lt 2^{${hi}}$；两端相差 $${fmt(2 ** Number(hi) - 2 ** Number(lo), 7)}$`;
    tex($('sqMsg'));
  };
  slider($('sqK'), (v) => { s.k = v; b.update(); });
}

window.LESSON = {
  init() {
    initRoots();
    initFill();
    initSqrt2();
  },
};
