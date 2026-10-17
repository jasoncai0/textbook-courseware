'use strict';
/* 六上 纳税、利息和折扣 · 本课互动：试一试的 20%/80% 长条、生活计算器（纳税 / 利息 / 折扣）。
 * 计算器全部用整数精确运算：金额化成“分”，百分率化成“万分之几”，结果再换回元，不出现浮点误差。
 * 通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el } = FracFig;
const $ = (id) => document.getElementById(id);
const BLUE = '#8fd3f4';
const ORANGE = '#f6b27a';

/* 第 4 页：5000 元奖金，20% 缴税，80% 实得 */
function initTaxBar() {
  const svg = $('tax');
  el('rect', { x: 10, y: 10, width: 156, height: 44, fill: ORANGE, stroke: '#5b6b78', 'stroke-width': 1.5 }, svg);
  el('rect', { x: 166, y: 10, width: 624, height: 44, fill: BLUE, stroke: '#5b6b78', 'stroke-width': 1.5 }, svg);
  el('text', { x: 88, y: 39, class: 'ff-t' }, svg).textContent = '20% 缴税';
  el('text', { x: 478, y: 39, class: 'ff-t' }, svg).textContent = '80% 实得';
  el('text', { x: 400, y: 80, class: 'ff-t s' }, svg).textContent = '奖金 5000 元（100%）';
}

/* ---------- 精确运算 ---------- */
const parseCents = (s) => {
  const m = String(s).trim().match(/^(\d{1,7})(?:\.(\d{1,2}))?$/);
  return m ? +m[1] * 100 + +(m[2] || '0').padEnd(2, '0') : null;
};
const parseBp = (s) => { // 百分率 → 万分之几（20 → 2000，3.25 → 325）
  const m = String(s).trim().match(/^(\d{1,3})(?:\.(\d{1,2}))?$/);
  if (!m) return null;
  const bp = +m[1] * 100 + +(m[2] || '0').padEnd(2, '0');
  return bp <= 10000 ? bp : null;
};
// num 的单位是“百万分之一元”（分 × 万分之几），转成元的字符串；超过两位小数时另给“约 … 元”
function yuan(num) {
  const s = String(num).padStart(7, '0');
  const exact = `${s.slice(0, -6)}.${s.slice(-6)}`.replace(/\.?0+$/, '');
  const r = Math.floor((num + 5000) / 10000); // 四舍五入到分
  const rs = (r / 100).toFixed(2).replace(/\.?0+$/, '');
  return { exact, approx: exact.split('.')[1]?.length > 2 ? rs : null };
}
const yTex = (num) => { const y = yuan(num); return y.approx ? `${y.exact}\\approx${y.approx}` : y.exact; };
const pctTex = (bp) => `${String(+(bp / 100).toFixed(2))}\\%`;
const money = (c) => String(+(c / 100).toFixed(2));

const RATES = { 1: 325, 2: 375, 3: 425, 5: 475 }; // 课本 p98 2012 年整存整取年利率
const ZHE = { 95: '九五折', 90: '九折', 85: '八五折', 80: '八折', 78: '七八折', 75: '七五折', 70: '七折', 68: '六八折', 50: '五折' };

function bar(parts) {
  const svg = $('calcBar');
  svg.innerHTML = '';
  const total = parts.reduce((s, p) => s + p.v, 0) || 1;
  let x = 10;
  parts.forEach((p) => {
    const w = (580 * p.v) / total;
    if (w > 0) {
      el('rect', { x, y: 8, width: w, height: 40, fill: p.c, stroke: '#5b6b78', 'stroke-width': 1.5, 'stroke-dasharray': p.dash ? '6 4' : 'none' }, svg);
      if (w > 60) el('text', { x: x + w / 2, y: 34, class: 'ff-t s' }, svg).textContent = p.t;
    }
    x += w;
  });
}

function calc(tab, f) {
  if (tab === 'tax') {
    const [c, bp] = [parseCents(f['tax.base']), parseBp(f['tax.rate'])];
    if (c === null || bp === null) return null;
    const t = c * bp;
    const after = c * 10000 - t;
    bar([{ v: bp, c: ORANGE, t: '缴税' }, { v: 10000 - bp, c: BLUE, t: '税后实得' }]);
    return [`<b>应纳税额 = 收入 × 税率</b>`, `$${money(c)}\\times${pctTex(bp)}=${yTex(t)}$（元）`, `税后实得：$${money(c)}-${yuan(t).exact}=${yTex(after)}$（元）`];
  }
  if (tab === 'int') {
    const c = parseCents(f['int.base']);
    const yrs = +f['int.years'];
    if (c === null) return null;
    const bp = RATES[yrs];
    const i = c * bp * yrs;
    bar([{ v: c * 10000, c: BLUE, t: '本金' }, { v: i, c: ORANGE, t: '利息' }]);
    return [`<b>利息 = 本金 × 利率 × 时间</b>`, `$${money(c)}\\times${pctTex(bp)}\\times${yrs}=${yTex(i)}$（元）`, `本息合计：$${money(c)}+${yuan(i).exact}=${yTex(c * 10000 + i)}$（元）`];
  }
  const c = parseCents(f['dis.base']);
  const r = +f['dis.rate'];
  if (c === null) return null;
  const now = c * r * 100;
  bar([{ v: r, c: BLUE, t: `现价 ${r}%` }, { v: 100 - r, c: '#eef3f7', t: '便宜', dash: true }]);
  return [`<b>${ZHE[r]}：现价 = 原价 × ${r}%</b>`, `$${money(c)}\\times${r}\\%=${yTex(now)}$（元）`, `便宜了：$${money(c)}-${yuan(now).exact}=${yTex(c * 10000 - now)}$（元）`];
}

function initCalc() {
  let tab = 'tax';
  const forms = { tax: $('fTax'), int: $('fInt'), dis: $('fDis') };
  const fields = () => Object.fromEntries([...document.querySelectorAll('[data-f]')].map((i) => [i.dataset.f, i.value]));
  const render = () => {
    const lines = calc(tab, fields());
    $('receipt').innerHTML = lines ? lines.map((l) => `<p>${l}</p>`).join('') : '<p class="bad">请检查输入：金额最多两位小数，税率不超过 100%。</p>';
    tex($('receipt'));
  };
  $('calcTabs').addEventListener('click', (e) => {
    const t = e.target.closest('[data-t]')?.dataset.t;
    if (!t) return;
    tab = t;
    $('calcTabs').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.t === t));
    Object.entries(forms).forEach(([k, f]) => { f.hidden = k !== t; });
    render();
  });
  document.querySelectorAll('[data-f]').forEach((i) => i.addEventListener(i.tagName === 'SELECT' ? 'change' : 'input', render));
  render();
}

window.LESSON = {
  init() {
    initTaxBar();
    initCalc();
  },
};
