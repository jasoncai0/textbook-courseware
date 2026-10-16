'use strict';
/* 七上 2.7 有理数的乘方 · 本课互动：拉面根数（按实际根数画线）、负数的幂符号配对、科学记数法小数点移动器。
 * 根数、幂、科学记数法全部由代码精确计算（小数点移动用字符串处理，不经过浮点数）。 */
const { slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const mn = (v) => String(v).replace('-', '−');

/* 第 3 页：拉扣 n 次 → 2^n 根面条 */
function initLamian() {
  const fig = $('lmFig');
  const draw = (n) => {
    const N = 2 ** n;
    const top = 28;
    const bot = 232;
    const gap = (bot - top) / N;
    const sw = Math.max(0.35, Math.min(7, gap * 0.55));
    const paths = Array.from({ length: N }, (_, i) => {
      const y = top + gap * (i + 0.5);
      return `M40 ${y.toFixed(2)} Q260 ${(y + 14).toFixed(2)} 480 ${y.toFixed(2)}`;
    }).join(' ');
    fig.innerHTML = `<rect x="18" y="14" width="22" height="232" rx="8" class="hand"/><rect x="480" y="14" width="22" height="232" rx="8" class="hand"/>`
      + `<path d="${paths}" class="noodle" style="stroke-width:${sw}"/>`;
    $('lmNV').textContent = `${n} 次`;
    const expr = n === 0 ? '1' : n <= 6 ? `${Array(n).fill(2).join('\\times')}` : `\\underbrace{2\\times2\\times\\cdots\\times2}_{${n}\\text{ 个}}`;
    $('lmEq').innerHTML = `面条根数：$${n === 1 ? '2^{1}' : `${expr}${n ? `=2^{${n}}` : ''}`}=${N}$`;
    tex($('lmEq'));
    $('lmTab').innerHTML = '<tr><th>拉扣次数</th><th>面条根数</th><th>算式</th></tr>'
      + Array.from({ length: n + 1 }, (_, k) => `<tr class="${k === n ? 'on' : ''}"><td>${k}</td><td>${2 ** k}</td><td>${k === 0 ? '还没拉' : k === 1 ? '$2$' : `$2^{${k}}$`}</td></tr>`).slice(-5).join('');
    tex($('lmTab'));
  };
  slider($('lmN'), draw);
}

/* 第 7 页：负因数两两配对。底数用分子/分母表示，结果精确 */
const BASES = [
  { k: '-1', num: -1, den: 1, tx: '(-1)' },
  { k: '-1/2', num: -1, den: 2, tx: '\\left(-\\frac12\\right)' },
  { k: '-2', num: -2, den: 1, tx: '(-2)' },
  { k: '2', num: 2, den: 1, tx: '2' },
];
function initSign() {
  const s = { b: BASES[0], n: 4 };
  $('sgBase').innerHTML = BASES.map((b, i) => `<button class="btn ${i ? '' : 'solid'}" type="button" data-i="${i}">底数 ${mn(b.k)}</button>`).join('');
  const frac = (p, q) => (q === 1 ? `${p}` : `${p < 0 ? '-' : ''}\\dfrac{${Math.abs(p)}}{${q}}`);
  const draw = () => {
    const { b, n } = s;
    const p = b.num ** n;
    const q = b.den ** n;
    const neg = b.num < 0;
    const f = b.k.replace('-', '−');
    const chips = [];
    for (let i = 0; i + 1 < n; i += 2) chips.push(`<span class="pair ${neg ? 'pp' : ''}">${f} × ${f}${neg ? '<i>正</i>' : ''}</span>`);
    if (n % 2) chips.push(`<span class="pair ${neg ? 'single' : ''}">${f}${neg ? '<i>剩一个：负</i>' : ''}</span>`);
    $('sgPairs').innerHTML = chips.join('<b>×</b>');
    $('sgNV').textContent = `${n}（${n % 2 ? '奇' : '偶'}数）`;
    $('sgEq').innerHTML = `$${b.tx}^{${n}}=${frac(p, q)}$`;
    tex($('sgEq'));
    const msg = $('sgMsg');
    msg.className = `tip feedback ${p > 0 ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = neg
      ? `${n} 个负因数，${n % 2 ? `配成 ${(n - 1) / 2} 对后还剩 1 个，积为负` : `正好配成 ${n / 2} 对，积为正`}。`
      : '底数是正数，不管指数是几，幂都是正数。';
  };
  $('sgBase').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    s.b = BASES[+btn.dataset.i];
    $('sgBase').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    draw();
  });
  slider($('sgN'), (v) => { s.n = v; draw(); });
}

/* 第 10 页：小数点移动器。digits 为原数的数字串，pos 为小数点已左移的位数 */
const SN = [
  { label: '红细胞', digits: '25000000000000' },
  { label: '嫦娥行程', digits: '1800000' },
  { label: '地月距离', digits: '384000' },
  { label: '日地距离', digits: '150000000' },
  { label: '光速', digits: '300000000' },
];
const group3 = (s) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
function initSci() {
  const s = { d: SN[0].digits, pos: 0 };
  $('snPick').innerHTML = SN.map((x, i) => `<button class="btn ${i ? '' : 'solid'}" type="button" data-i="${i}">${x.label}</button>`).join('');
  const draw = () => {
    const L = s.d.length;
    const intPart = s.pos >= L ? '0' : s.d.slice(0, L - s.pos);
    const fracRaw = s.pos >= L ? s.d : s.d.slice(L - s.pos);
    const fracShown = fracRaw.replace(/0+$/, '');
    $('snNum').innerHTML = `<span class="int">${intPart}</span>${s.pos ? `<span class="pt">.</span><span class="frac">${fracRaw}</span>` : ''}`
      + `${s.pos ? `<span class="x10">× 10<sup>${s.pos}</sup></span>` : ''}`;
    const a = fracShown ? `${intPart}.${fracShown}` : intPart;
    $('snEq').innerHTML = s.pos ? `$${group3(s.d).replace(/ /g, '\\,')}=${a}\\times10^{${s.pos}}$` : `原数：$${group3(s.d).replace(/ /g, '\\,')}$`;
    tex($('snEq'));
    const ok = intPart.length === 1 && intPart !== '0';
    const msg = $('snMsg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : intPart === '0' ? 'fb-warn' : ''}`;
    msg.textContent = ok
      ? `科学记数法 ✓：a = ${a}，1 ≤ a < 10；原数有 ${L} 位整数，n = ${L} − 1 = ${s.pos}。`
      : intPart === '0'
        ? `a = ${a} < 1，移过头了，往右移一位。`
        : s.pos === 0 ? '小数点在最后一位数字后面。点“左移一位”开始。' : `小数点左移了 ${s.pos} 位，就要乘 ${s.pos} 个 10；现在 a = ${a}，还不小于 10，继续左移。`;
  };
  $('snPick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    s.d = SN[+btn.dataset.i].digits;
    s.pos = 0;
    $('snPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    draw();
  });
  $('snLeft').addEventListener('click', () => { s.pos = Math.min(s.d.length, s.pos + 1); draw(); });
  $('snRight').addEventListener('click', () => { s.pos = Math.max(0, s.pos - 1); draw(); });
  draw();
}

window.LESSON = {
  init() {
    initLamian();
    initSign();
    initSci();
  },
};
