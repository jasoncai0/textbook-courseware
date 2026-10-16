'use strict';
/* 高一下 12.2 复数的运算 · 本课互动：乘法“四格表”、i 的乘方循环、除法分母实数化计算器。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/* 整数实部、虚部 → a + bi 的 TeX（省略 0 和系数 1） */
function cx(re, im) {
  if (im === 0) return String(re);
  const coef = Math.abs(im) === 1 ? '' : String(Math.abs(im));
  const ip = `${coef}\\mathrm i`;
  if (re === 0) return im < 0 ? `-${ip}` : ip;
  return `${re}${im < 0 ? '-' : '+'}${ip}`;
}
/* p/q 约分成 TeX 分数（q > 0） */
function frac(p, q) {
  if (p === 0) return '0';
  const g = gcd(p, q);
  const [n, d] = [Math.abs(p) / g, q / g];
  const sign = p < 0 ? '-' : '';
  return d === 1 ? `${sign}${n}` : `${sign}\\dfrac{${n}}{${d}}`;
}
/* (p + r i) / q 化成 x + y i 的 TeX */
function cxFrac(p, r, q) {
  if (r === 0) return frac(p, q);
  const absIm = frac(Math.abs(r), q);
  const ip = `${absIm === '1' ? '' : absIm}\\mathrm i`;
  if (p === 0) return r < 0 ? `-${ip}` : ip;
  return `${frac(p, q)}${r < 0 ? '-' : '+'}${ip}`;
}
const intIn = (id) => { const v = Math.round(+$(id).value || 0); return Math.max(-9, Math.min(9, v)); };
const paren = (v) => (v < 0 ? `(${v})` : String(v));

/* 第 4 页：乘法四格表 */
function initMul() {
  const ids = ['ma', 'mb', 'mc', 'md'];
  const show = () => {
    const [a, b, c, d] = ids.map(intIn);
    $('mGrid').innerHTML = `<tr><th>×</th><th>$${c}$</th><th>$${cx(0, d) === '0' ? '0\\mathrm i' : cx(0, d)}$</th></tr>`
      + `<tr><th>$${a}$</th><td>$${a * c}$</td><td>$${cx(0, a * d) === '0' ? '0' : cx(0, a * d)}$</td></tr>`
      + `<tr><th>$${cx(0, b) === '0' ? '0\\mathrm i' : cx(0, b)}$</th><td>$${cx(0, b * c) === '0' ? '0' : cx(0, b * c)}$</td><td class="hot">$${paren(b * d)}\\mathrm i^2=${-b * d}$</td></tr>`;
    $('mRes').innerHTML = `实部 $=${a * c}${-b * d < 0 ? '' : '+'}${-b * d}=${a * c - b * d}$，虚部 $=${b * c}${a * d < 0 ? '' : '+'}${a * d}=${b * c + a * d}$<br>结果：$(${cx(a, b)})(${cx(c, d)})=$ <b>$${cx(a * c - b * d, b * c + a * d)}$</b>`;
    tex($('mGrid')); tex($('mRes'));
  };
  ids.forEach((id) => $(id).addEventListener('input', show));
  show();
}

/* 第 6 页：i 的乘方，1 → i → −1 → −i 循环 */
const POW = [['1', [1, 0]], ['i', [0, 1]], ['−1', [-1, 0]], ['−i', [0, -1]]];
function initRing() {
  const s = { n: 1 };
  const b = board($('ring'), { x: [-1.9, 1.9], y: [-1.55, 1.55], axes: false, grid: false, w: 420 });
  b.curve((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, { cls: 'dash' });
  b.svg.querySelector('defs').insertAdjacentHTML('beforeend', '<marker id="rgAr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="#d9711c"/></marker>');
  [0, 1, 2, 3].forEach((k) => {
    const t0 = (k * Math.PI) / 2 + 0.28;
    b.curve((t) => [1.22 * Math.cos(t), 1.22 * Math.sin(t)], t0, t0 + Math.PI / 2 - 0.56, { cls: 'c3' }).setAttribute('marker-end', 'url(#rgAr)');
  });
  b.text([1.22 * Math.cos(Math.PI / 4), 1.22 * Math.sin(Math.PI / 4)], '×i', { cls: 'lb up c3t', dx: 6, dy: -4 });
  POW.forEach(([t, p], k) => {
    b.pt(p, { r: 22, cls: 'card' });
    b.pt(p, { r: 22, cls: 'card on', show: () => s.n % 4 === k });
    b.text(p, t, { cls: 'lb cardt', dx: t.length > 1 ? -16 : -6, dy: 9 });
  });
  b.seg(() => [[0, 0], POW[s.n % 4][1].map((v) => v * 0.72)], { cls: 'c2' }).setAttribute('marker-end', 'url(#rgAr)');
  slider($('ipow'), (v) => {
    s.n = v;
    b.update();
    const r = v % 4;
    $('ipowV').textContent = String(v);
    const k = Math.floor(v / 4);
    $('ipowMsg').innerHTML = r === 0
      ? `$${v}=4\\times${k}$，所以 $\\mathrm i^{${v}}=(\\mathrm i^4)^{${k}}=1$`
      : `$${v}=4\\times${k}+${r}$，所以 $\\mathrm i^{${v}}=(\\mathrm i^4)^{${k}}\\cdot\\mathrm i^{${r}}=${['1', '\\mathrm i', '-1', '-\\mathrm i'][r]}$`;
    tex($('ipowMsg'));
  });
}

/* 第 9 页：除法 (a + bi) ÷ (c + di) 分母实数化 */
function initDiv() {
  const ids = ['da', 'db', 'dc', 'dd'];
  const row = (l, m, why, cls = '') => `<div class="dl ${cls}"><span>${l}</span><span>${m}</span><i class="why">${why}</i></div>`;
  const show = () => {
    const [a, b, c, d] = ids.map(intIn);
    if (c === 0 && d === 0) {
      $('dSteps').innerHTML = row('', '除数为 0', '$c+d\\mathrm i\\ne0$ 才能除');
      $('dCheck').innerHTML = '';
      tex($('dSteps'));
      return;
    }
    const q = c * c + d * d;
    const p = a * c + b * d;
    const r = b * c - a * d;
    $('dSteps').innerHTML = row('', `$\\dfrac{${cx(a, b)}}{${cx(c, d)}}=\\dfrac{(${cx(a, b)})(${cx(c, -d)})}{(${cx(c, d)})(${cx(c, -d)})}$`, `同乘共轭 $${cx(c, -d)}$`, 'key')
      + row('', `$=\\dfrac{${cx(p, r)}}{${c * c}+${d * d}}=\\dfrac{${cx(p, r)}}{${q}}$`, '分子按乘法法则；分母 $c^2+d^2$')
      + row('', `$=${cxFrac(p, r, q)}$`, '约分', 'end');
    $('dCheck').innerHTML = `验算：$(${cx(c, d)})\\left(${cxFrac(p, r, q)}\\right)$ 应等于 $${cx(a, b)}$ ✓`;
    tex($('dSteps')); tex($('dCheck'));
  };
  ids.forEach((id) => $(id).addEventListener('input', show));
  show();
}

window.LESSON = {
  init() {
    initMul();
    initRing();
    initDiv();
  },
};

