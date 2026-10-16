'use strict';
/* 高一下 12.4 复数的三角形式 · 本课互动：拖点看模与辐角、例 1 辐角图、乘法 = 旋转 + 伸缩（带演示）、n 次单位根。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const STEP = Math.PI / 12; // 角按 15° 取整
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const mod = (k, n) => ((k % n) + n) % n;

/* kπ/12 → TeX（如 5π/6），k 为整数 */
function piTex(k) {
  if (k === 0) return '0';
  const g = gcd(k, 12);
  const [n, d] = [Math.abs(k) / g, 12 / g];
  const sign = k < 0 ? '-' : '';
  const num = n === 1 ? '\\pi' : `${n}\\pi`;
  return d === 1 ? `${sign}${num}` : `${sign}\\frac{${num}}{${d}}`;
}
function cxApprox(a, b) {
  const [A, B] = [+fmt(a), +fmt(b)];
  if (B === 0) return String(A);
  if (A === 0) return `${B}\\mathrm i`;
  return `${A}${B < 0 ? '-' : '+'}${Math.abs(B)}\\mathrm i`;
}
const trig = (r, kTex) => `${fmt(r)}\\left(\\cos${kTex}+\\mathrm i\\sin${kTex}\\right)`;
function addMarker(b, id, color) {
  b.svg.querySelector('defs').insertAdjacentHTML('beforeend',
    `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker>`);
}
const arrow = (b, s, id, cls = 'c1') => { const l = b.seg(s, { cls }); l.setAttribute('marker-end', `url(#${id})`); return l; };
const polar = (r, t) => [r * Math.cos(t), r * Math.sin(t)];
/* 从 0 到 θ 的角弧（逆时针） */
const arc = (b, r, th, cls = 'c2') => b.curve((t) => polar(val(r), t * val(th)), 0, 1, { cls });
const val = (v) => (typeof v === 'function' ? v() : v);
/* 拖动时把 (x, y) 换成按步长取整的 (r, k) */
const toPolar = (x, y, rMin, rMax, rStep) => ({ r: clamp(Math.round(Math.hypot(x, y) / rStep) * rStep, rMin, rMax), k: mod(Math.round(Math.atan2(y, x) / STEP), 24) });
function plane(el, x, y, w) {
  const b = board(el, { x, y, w, labels: ['x', 'y'] });
  return b;
}

/* 第 3 页：模与辐角 */
function initArg() {
  const s = { r: 2, k: 2 };
  const th = () => s.k * STEP;
  const Z = () => polar(s.r, th());
  const b = plane($('arg'), [-3.9, 3.9], [-3.5, 3.5], 520);
  addMarker(b, 'argA', '#1d6fa5');
  b.seg(() => [Z(), [Z()[0], 0]], { cls: 'dash' });
  b.seg(() => [Z(), [0, Z()[1]]], { cls: 'dash' });
  arc(b, 0.6, th);
  arrow(b, () => [[0, 0], Z()], 'argA');
  b.text(() => polar(0.95, th() / 2), 'θ', { cls: 'lb c2t', dx: -4, dy: 6 });
  b.text(() => Z(), 'Z', { dx: 10, dy: -10 });
  b.text(() => polar(s.r / 2, th()), 'r', { dx: -16, dy: -6 });
  b.drag(Z, (x, y) => { Object.assign(s, toPolar(x, y, 0.5, 3, 0.5)); });
  b.onUpdate = () => {
    const [a, bb] = Z();
    const kt = piTex(s.k);
    $('argMsg').innerHTML = `$r=|z|=${fmt(s.r)}$，$\\arg z=${kt}$（$${s.k * 15}^\\circ$）；辐角 $${kt}+2k\\pi\\ (k\\in\\Z)$<br>三角形式 $z=${trig(s.r, kt)}$，代数形式 $z\\approx${cxApprox(a, bb)}$`;
    tex($('argMsg'));
  };
  b.update();
}

/* 第 4 页：例 1 四个复数的辐角主值 */
function initEx1() {
  const S2 = Math.SQRT2;
  // [名称, 点, 辐角主值 k（×π/12）, 角弧半径, 角标注位置]
  const pts = [['1+i', [1, 1], 3, 0.3, 'c2'], ['−1−i', [-1, -1], 15, 0.55, 'c3'], ['√2', [S2, 0], 0, 0, ''], ['−√2 i', [0, -S2], 18, 0.82, 'c4']];
  const LAB = { 3: ['π/4', Math.PI / 8], 15: ['5π/4', (5 * Math.PI) / 8], 18: ['3π/2', (9 * Math.PI) / 8] };
  const b = plane($('ex1'), [-1.9, 1.9], [-1.75, 1.75], 440);
  addMarker(b, 'e1A', '#1d6fa5');
  pts.forEach(([n, p, k, r, cls]) => {
    arrow(b, [[0, 0], p], 'e1A');
    if (k) { arc(b, r, k * STEP, cls); b.text(polar(1.12, LAB[k][1]), LAB[k][0], { cls: `lb up ${cls}t`, dx: -16, dy: 6 }); }
    b.pt(p, { cls: 'c2', r: 6 });
    b.text(p, n, { cls: 'lb up', dx: p[0] >= 0 ? 8 : -46, dy: p[1] > 0 ? -8 : 24 });
  });
  b.update();
}

/* 第 8 页：乘法 = 旋转 θ₂ + 伸缩 r₂ 倍；anim ∈ [0, 2]：0–1 旋转，1–2 伸缩 */
function initMul() {
  const s = { z1: { r: 1.5, k: 2 }, z2: { r: 1.5, k: 4 }, anim: 2 };
  const t1 = () => s.z1.k * STEP;
  const t2 = () => s.z2.k * STEP;
  const Z1 = () => polar(s.z1.r, t1());
  const Z2 = () => polar(s.z2.r, t2());
  const Zp = () => polar(s.z1.r, t1() + t2()); // 旋转后的 OZ₁′
  const cur = () => {
    const a = s.anim;
    if (a <= 1) return polar(s.z1.r, t1() + a * t2());
    return polar(s.z1.r * (1 + (a - 1) * (s.z2.r - 1)), t1() + t2());
  };
  const b = plane($('mul'), [-3.3, 3.3], [-3, 3.2], 520);
  addMarker(b, 'mA1', '#1d6fa5');
  addMarker(b, 'mA2', '#d9711c');
  addMarker(b, 'mA3', '#2f7d6b');
  arc(b, () => s.z1.r * 0.35, t1, 'thin');
  b.curve((u) => polar(s.z1.r, t1() + u * t2() * Math.min(1, s.anim)), 0, 1, { cls: 'c3 dash2' });
  arrow(b, () => [[0, 0], Z1()], 'mA1');
  arrow(b, () => [[0, 0], Z2()], 'mA1', 'c1 faint');
  const prime = arrow(b, () => [[0, 0], Zp()], 'mA3', 'c3 dash2');
  arrow(b, () => [[0, 0], cur()], 'mA2', 'c2');
  b.text(Z1, 'Z₁', { dx: 10, dy: 4 });
  b.text(Z2, 'Z₂', { dx: 10, dy: 4 });
  b.text(Zp, 'Z₁′', { dx: -34, dy: -6 });
  b.text(cur, 'Z', { dx: 10, dy: -10 });
  b.drag(Z1, (x, y) => { s.z1 = toPolar(x, y, 0.5, 2, 0.25); s.anim = 2; });
  b.drag(Z2, (x, y) => { s.z2 = toPolar(x, y, 0.5, 2, 0.25); s.anim = 2; });
  b.onUpdate = () => {
    prime.style.display = s.anim >= 1 ? '' : 'none';
    const [k1, k2] = [s.z1.k, s.z2.k];
    const ks = k1 + k2;
    const [r1, r2] = [s.z1.r, s.z2.r];
    const P = polar(r1 * r2, ks * STEP);
    $('mulMsg').innerHTML = `$z_1=${trig(r1, piTex(k1))}$，$z_2=${trig(r2, piTex(k2))}$<br>`
      + `$z_1z_2=${fmt(r1 * r2)}\\left[\\cos\\left(${piTex(k1)}+${piTex(k2)}\\right)+\\mathrm i\\sin\\left(${piTex(k1)}+${piTex(k2)}\\right)\\right]\\approx${cxApprox(...P)}$`;
    tex($('mulMsg'));
  };
  const play = () => {
    const T = 2400;
    const t0 = performance.now();
    const tick = (now) => {
      s.anim = Math.min(2, ((now - t0) / T) * 2);
      b.update();
      if (s.anim < 2) requestAnimationFrame(tick);
    };
    s.anim = 0;
    requestAnimationFrame(tick);
  };
  $('mulPlay').addEventListener('click', play);
  $('mulI').addEventListener('click', () => { s.z2 = { r: 1, k: 6 }; play(); });
  $('mul2').addEventListener('click', () => { s.z2 = { r: 2, k: 0 }; play(); });
  b.update();
}

/* 第 10 页：z^n = 1 的 n 个根 */
function initRoots() {
  const s = { n: 3 };
  const w = (k) => polar(1, (2 * Math.PI * k) / s.n);
  const b = board($('roots'), { x: [-1.75, 1.75], y: [-1.5, 1.5], w: 440, ticks: 0.5, labels: ['x', 'y'] });
  addMarker(b, 'rA', '#d9711c');
  b.curve((t) => polar(1, t), 0, 2 * Math.PI, { cls: 'dash' });
  b.poly(() => Array.from({ length: s.n }, (_, k) => w(k)), { cls: 'fill1' });
  b.curve((t) => polar(1.18, (t * 2 * Math.PI) / s.n), 0.08, 0.92, { cls: 'c2' }).setAttribute('marker-end', 'url(#rA)');
  b.text(() => polar(1.36, Math.PI / s.n), () => `×ω₁`, { cls: 'lb up c2t', dx: -6, dy: 4 });
  const SUB = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇'];
  SUB.forEach((sub, k) => {
    b.pt(() => (k < s.n ? w(k) : null), { cls: 'c2', r: 6 });
    b.text(() => (k < s.n ? polar(1, (2 * Math.PI * k) / s.n) : null), `ω${sub}`, { dx: 8, dy: k === 0 ? 22 : -6 });
  });
  slider($('rn'), (v) => { s.n = v; $('rnV').textContent = String(v); b.update(); });
}

window.LESSON = {
  init() {
    initArg();
    initEx1();
    initMul();
    initRoots();
  },
};
