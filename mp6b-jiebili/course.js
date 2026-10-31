'use strict';
/* 六下 解比例 · 本课互动：逐步解比例（分数精确运算，每步写依据）、例 5 与练习七第 7 题的图（按数据等比例画）。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const label = (svg, x, y, s, cls = 'fl m') => { const t = svgEl('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
const setMsg = (el, ok, html) => {
  el.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
  el.innerHTML = html;
  tex(el);
};

/* ---- 分数：[分子, 分母]，始终约分 ---- */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const fr = (n, d = 1) => { const g = gcd(n, d) || 1; const s = d < 0 ? -1 : 1; return [(s * n) / g, (s * d) / g]; };
const mul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
const div = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
const parse = (s) => {
  const t = String(s).trim().replace(/[／]/g, '/');
  if (t.includes('/')) { const [n, d] = t.split('/').map(parse); return div(n, d); }
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  const k = (t.split('.')[1] || '').length;
  return fr(Math.round(+t * 10 ** k), 10 ** k);
};
const terminates = ([, d]) => { let x = d; [2, 5].forEach((p) => { while (x % p === 0) x /= p; }); return x === 1; };
// useDec：题目里没有分数时，结果写成小数
const F = (f, useDec) => {
  if (f[1] === 1) return `${f[0]}`;
  if (useDec && terminates(f)) return `${+(f[0] / f[1]).toFixed(6)}`;
  return `\\dfrac{${f[0]}}{${f[1]}}`;
};
const T = (s) => (s.includes('/') ? `\\dfrac{${s.split('/')[0]}}{${s.split('/')[1]}}` : s);

/* 课本中的比例：form r = 比号，f = 分数形式 */
const PROBS = [
  { name: '例 5', form: 'r', t: ['6', '4', '13.5', 'x'] },
  { name: '试一试', form: 'f', t: ['1.2', '75', '0.4', 'x'] },
  { name: '练一练①', form: 'r', t: ['9', 'x', '3', '4'] },
  { name: '练一练②', form: 'r', t: ['1/4', '1/8', 'x', '1/10'] },
  { name: '练一练③', form: 'f', t: ['0.1', '0.01', '100', 'x'] },
  { name: '练习七 6①', form: 'r', t: ['5', '8', 'x', '32'] },
  { name: '练习七 6②', form: 'f', t: ['x', '9', '7', '3'] },
  { name: '练习七 6③', form: 'r', t: ['1/2', 'x', '1/6', '2/5'] },
];
const PARTNER = [3, 2, 1, 0];
function solveSteps(p) {
  const i = p.t.indexOf('x');
  const j = PARTNER[i];
  const others = [0, 1, 2, 3].filter((k) => k !== i && k !== j);
  const useDec = !p.t.some((s) => s.includes('/'));
  const coef = parse(p.t[j]);
  const prod = mul(parse(p.t[others[0]]), parse(p.t[others[1]]));
  const ans = div(prod, coef);
  const [a, b, c, d] = p.t.map(T);
  const head = p.form === 'r' ? `${a}:${b}=${c}:${d}` : `\\dfrac{${a}}{${b}}=\\dfrac{${c}}{${d}}`;
  const kind = i === 0 || i === 3 ? '外项' : '内项';
  const cx = coef[0] === 1 && coef[1] === 1 ? 'x' : `${T(p.t[j])}x`;
  return {
    ans,
    steps: [
      { tex: head, why: '要解的比例' },
      { tex: `${cx}=${T(p.t[others[0]])}\\times${T(p.t[others[1]])}`, why: `比例的基本性质：$x$ 是${kind}，和另一个${kind} ${'$'}${T(p.t[j])}${'$'} 相乘` },
      { tex: `${cx}=${F(prod, useDec)}`, why: '计算' },
      { tex: `x=${F(prod, useDec)}\\div${T(p.t[j])}`, why: `等式两边同时除以 $${T(p.t[j])}$` },
      { tex: `x=${F(ans, useDec)}`, why: '解出 $x$', key: true },
      { tex: `${T(p.t[j])}\\times${F(ans, useDec)}=${F(prod, useDec)}`, why: '检验：代回去，外项积 = 内项积 ✓' },
    ],
  };
}

function initSolver() {
  const st = { k: 0, shown: 1 };
  const list = $('svList');
  PROBS.forEach((p, k) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn';
    b.dataset.k = k;
    b.textContent = p.name;
    list.appendChild(b);
  });
  const render = () => {
    const { steps } = solveSteps(PROBS[st.k]);
    list.querySelectorAll('button').forEach((b) => b.classList.toggle('solid', +b.dataset.k === st.k));
    $('svSteps').innerHTML = `<div class="derive">${steps.slice(0, st.shown).map((s) => `<div class="dl${s.key ? ' key' : ''}"><span>$${s.tex}$</span><i class="why">${s.why}</i></div>`).join('')}</div>`;
    tex($('svSteps'));
    $('svNext').disabled = st.shown >= steps.length;
  };
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    st.k = +b.dataset.k;
    st.shown = 1;
    $('svIn').value = '';
    $('svMsg').className = 'tip feedback';
    $('svMsg').textContent = '';
    render();
  });
  $('svNext').addEventListener('click', () => { st.shown += 1; render(); });
  $('svReset').addEventListener('click', () => { st.shown = 1; render(); });
  const check = () => {
    const v = parse($('svIn').value);
    const { ans } = solveSteps(PROBS[st.k]);
    if (!v) { setMsg($('svMsg'), false, '请输入一个数，可以是小数或分数（如 1/5）。'); return; }
    const ok = v[0] === ans[0] && v[1] === ans[1];
    setMsg($('svMsg'), ok, ok ? '<b>✓ 算对了！</b>点“下一步”看看每一步的依据。' : '还不对。先想第一步：$x$ 和哪一项相乘？');
  };
  $('svCheck').addEventListener('click', check);
  $('svIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
  render();
}

/* 第 3 页：例 5 照片（1 cm = 18 单位） */
function scene(parent, x, y, w, h) {
  const g = svgEl('g', { transform: `translate(${x} ${y}) scale(${w / 6} ${h / 4})` }, parent);
  svgEl('rect', { x: 0, y: 0, width: 6, height: 4, fill: '#cfe9d8' }, g);
  svgEl('path', { d: 'M0 2.2L.6 .8 1.2 2 1.9 .5 2.6 2 3.4 .7 4.1 2 4.9 .6 5.5 1.9 6 1.2V3H0Z', fill: '#3d8b4a' }, g);
  svgEl('ellipse', { cx: 3.6, cy: 2.6, rx: 1.4, ry: 0.35, fill: '#f0a830' }, g);
  svgEl('rect', { x: 0, y: 3, width: 6, height: 1, fill: '#8cc7e0' }, g);
  svgEl('rect', { x: 0, y: 0, width: 6, height: 4, fill: 'none', stroke: '#3d5568', 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke' }, g);
}
function initPhoto() {
  const svg = $('ph5');
  const K = 18;
  scene(svg, 20, 150, 6 * K, 4 * K);
  label(svg, 20 + 3 * K, 150 + 4 * K + 24, '6 cm');
  label(svg, 20 + 6 * K + 6, 150 + 2 * K + 7, '4 cm', 'fl');
  label(svg, 20 + 3 * K, 140, '放大前');
  scene(svg, 200, 30, 13.5 * K, 9 * K);
  label(svg, 200 + 6.75 * K, 30 + 9 * K + 24, '13.5 cm');
  label(svg, 200 + 13.5 * K + 6, 30 + 4.5 * K + 9, 'x cm', 'fl b');
  label(svg, 200 + 6.75 * K, 22, '放大后');
}

/* 第 6 页：交叉相乘示意 */
function initCross() {
  const svg = $('crossT');
  const frac = (x, n, d) => {
    label(svg, x, 46, n, 'fl m big');
    svgEl('line', { x1: x - 30, x2: x + 30, y1: 60, y2: 60, stroke: '#2b3a4a', 'stroke-width': 2.5 }, svg);
    label(svg, x, 98, d, 'fl m big');
  };
  frac(80, '1.2', '75');
  label(svg, 150, 74, '=', 'fl m big');
  frac(220, '0.4', 'x');
  svgEl('line', { x1: 108, y1: 40, x2: 196, y2: 88, stroke: '#d6247a', 'stroke-width': 2 }, svg);
  svgEl('line', { x1: 108, y1: 88, x2: 196, y2: 40, stroke: '#d6247a', 'stroke-width': 2 }, svg);
  label(svg, 150, 132, '1.2 × x = 75 × 0.4', 'fl m b');
}

/* 第 8 页：练习七第 7 题（每组左右图同一比例尺） */
function dimV(svg, x, y1, y2, s) {
  svgEl('line', { x1: x, x2: x, y1, y2, stroke: '#d6247a', 'stroke-width': 1.5 }, svg);
  label(svg, x - 6, (y1 + y2) / 2 + 6, s, 'fl').setAttribute('text-anchor', 'end');
}
function dimH(svg, x1, x2, y, s) {
  svgEl('line', { x1, x2, y1: y, y2: y, stroke: '#d6247a', 'stroke-width': 1.5 }, svg);
  label(svg, (x1 + x2) / 2, y + 22, s);
}
function initEx7() {
  const svg = $('ex7');
  const k1 = 4.2; // (1) 1 cm = 4.2 单位
  svgEl('rect', { x: 50, y: 10 + (30 - 12) * k1, width: 20 * k1, height: 12 * k1, fill: '#e3f1fb', stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
  dimV(svg, 44, 10 + 18 * k1, 10 + 30 * k1, '12');
  dimH(svg, 50, 50 + 20 * k1, 14 + 30 * k1, '20');
  svgEl('rect', { x: 260, y: 10, width: 50 * k1, height: 30 * k1, fill: '#e3f1fb', stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
  dimV(svg, 254, 10, 10 + 30 * k1, 'x');
  dimH(svg, 260, 260 + 50 * k1, 14 + 30 * k1, '50');
  const k2 = 20; // (2) 1 cm = 20 单位
  const base = 292;
  svgEl('path', { d: `M60 ${base - 4.8 * k2}V${base}H${60 + 6.4 * k2}Z`, fill: '#e3f1fb', stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
  dimV(svg, 54, base - 4.8 * k2, base, '4.8');
  label(svg, 60 + 3.2 * k2, base - 6, '6.4', 'fl m');
  svgEl('path', { d: `M320 ${base - 3 * k2}V${base}H${320 + 4 * k2}Z`, fill: '#e3f1fb', stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
  dimV(svg, 314, base - 3 * k2, base, '3');
  label(svg, 320 + 2 * k2, base - 6, 'x', 'fl m b');
  label(svg, 20, 30, '(1)', 'fl');
  label(svg, 20, 200, '(2)', 'fl');
}

window.LESSON = {
  init() {
    initPhoto();
    initSolver();
    initCross();
    initEx7();
  },
};
