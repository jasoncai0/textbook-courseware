'use strict';
/* 高一上 4.2 对数 · 本课互动：指对互化转换器、运算性质验证器、换底公式验证器。通用部分见 ../shared/math.js */
const { tex, slider, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

const DIGITS = 4; // 课本“结果保留 4 位小数”
const SAME_EPS = 1e-9; // 左右两边相差小于它判为相等
const B_RANGE = [-4, 4];

// 底数：v 数值、t 公式写法、p 作乘方底数时的写法（分数要加括号）、s 图上纯文本
const BASE = {
  2: { v: 2, t: '2', p: '2', s: '2' },
  3: { v: 3, t: '3', p: '3', s: '3' },
  5: { v: 5, t: '5', p: '5', s: '5' },
  8: { v: 8, t: '8', p: '8', s: '8' },
  10: { v: 10, t: '10', p: '10', s: '10' },
  half: { v: 0.5, t: '\\frac12', p: '\\left(\\frac12\\right)', s: '1/2' },
  e: { v: Math.E, t: '\\mathrm e', p: '\\mathrm e', s: 'e' },
};

/* 按定义求 b，使 a^b = N（二分逼近，只用乘方，不借助换底公式）；N ≤ 0 时无解 */
function solveExp(a, N) {
  if (!(N > 0)) return NaN;
  const up = a > 1;
  let [lo, hi] = [-200, 200];
  for (let i = 0; i < 120; i += 1) {
    const mid = (lo + hi) / 2;
    if ((a ** mid < N) === up) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
const logBy = (c, x) => Math.log(x) / Math.log(c);

/* 数字写法：|v| ≥ 1 保留 4 位小数，|v| < 1 保留 4 位有效数字 */
function numStr(v) {
  if (Math.abs(v) < 1e-12) return '0';
  const s = Math.abs(v) >= 1 ? +v.toFixed(DIGITS) : +v.toPrecision(DIGITS);
  return String(s);
}
const isShown = (v) => Math.abs(+numStr(v) - v) < 1e-9; // 显示的数就是精确值
const rel = (v) => (isShown(v) ? '=' : '\\approx');
const fix4 = (v) => v.toFixed(DIGITS);
const rel4 = (...vs) => (vs.every((v) => Math.abs(+fix4(v) - v) < 1e-9) ? '=' : '\\approx');
const brace = (s) => `{${s}}`;
const setTex = (el, s) => { el.textContent = `$${s}$`; tex(el); };
const parseNum = (str) => {
  const s = str.trim().replace(/[−–]/g, '-');
  const m = s.match(/^(-?\d*\.?\d+)\s*\/\s*(\d*\.?\d+)$/);
  if (m) return +m[1] / +m[2];
  return s === '' ? NaN : Number(s);
};

function baseButtons(box, keys, cur, onPick) {
  box.innerHTML = keys.map((k) => `<button type="button" class="btn${k === cur ? ' solid' : ''}" data-b="${k}">$${BASE[k].t}$</button>`).join('');
  tex(box);
  box.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-b]');
    if (!btn) return;
    box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    onPick(btn.dataset.b);
  });
}

/* ---------- 第 5 页：指对互化转换器 ---------- */
function converterMsg(s, a) {
  if (s.from === 'b') return { cls: '', html: `已知 $a$、$b$，求 $N$：<b>乘方</b>。$${a.p}^${brace(fmt(s.b, 1))}$ 一定是正数。` };
  if (!(s.N > 0)) return { cls: 'warn', html: `$N=${numStr(s.N)}\\le 0$：$a\\gt0$ 时 $a^b$ 总是正数，找不到这样的 $b$——<b>负数和 0 没有对数</b>。` };
  if (Math.abs(s.N - 1) < 1e-12) return { cls: 'ok', html: '$\\log_a1=0$：不论底数是几，$a^0=1$。' };
  if (Math.abs(s.N - a.v) < 1e-12) return { cls: 'ok', html: '$\\log_aa=1$：因为 $a^1=a$。' };
  const out = s.b < B_RANGE[0] || s.b > B_RANGE[1] ? '（$b$ 超出了滑块范围）' : '';
  return { cls: 'ok', html: `已知 $a$、$N$，求 $b$：<b>取对数</b>${out}。` };
}

function initConverter() {
  const s = { base: '2', b: 3, N: 8, from: 'b' };
  const inN = $('cvN');
  const show = () => {
    const a = BASE[s.base];
    const ok = s.from === 'b' || s.N > 0;
    $('cvTa').textContent = a.s;
    $('cvTb').textContent = ok ? numStr(s.b) : '不存在';
    $('cvTN').textContent = numStr(s.N);
    $('cvBV').textContent = ok ? numStr(s.b) : '—';
    $('cvArrPow').classList.toggle('on', s.from === 'b');
    $('cvArrLog').classList.toggle('on', s.from === 'N');
    $('cvNodeB').classList.toggle('ask', s.from === 'N');
    $('cvNodeN').classList.toggle('ask', s.from === 'b');
    const bT = numStr(s.b);
    const nT = numStr(s.N);
    const r = s.from === 'b' ? rel(s.N) : rel(s.b);
    const nick = { 10: '=\\lg ', e: '=\\ln ' }[s.base];
    setTex($('cvExp'), ok ? `${a.p}^${brace(bT)}${r}${nT}` : `${a.p}^b=${nT}\\ \\text{无解}`);
    setTex($('cvLog'), ok ? `\\log_${brace(a.t)}${nT}${nick ? `${nick}${nT}` : ''}${r}${bT}` : `\\log_${brace(a.t)}(${nT})\\ \\text{无意义}`);
    const m = converterMsg(s, a);
    $('cvMsg').className = `tip feedback ${m.cls ? `fb-${m.cls}` : ''}`;
    $('cvMsg').innerHTML = m.html;
    tex($('cvMsg'));
  };
  const fromB = (b) => { s.from = 'b'; s.b = b; s.N = BASE[s.base].v ** b; inN.value = numStr(s.N); show(); };
  const fromN = (N) => {
    s.from = 'N'; s.N = N; s.b = solveExp(BASE[s.base].v, N);
    if (N > 0) $('cvB').value = String(Math.min(B_RANGE[1], Math.max(B_RANGE[0], s.b)));
    show();
  };
  baseButtons($('cvBases'), ['2', '3', '10', 'half', 'e'], s.base, (k) => {
    s.base = k;
    if (s.from === 'b') fromB(s.b); else fromN(s.N);
  });
  slider($('cvB'), fromB);
  const readN = () => { const v = parseNum(inN.value); if (Number.isFinite(v)) fromN(v); };
  inN.addEventListener('input', readN);
  inN.addEventListener('keydown', (e) => { if (e.key === 'Enter') inN.blur(); });
  $('cvPre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]');
    if (!btn) return;
    const v = btn.dataset.n === 'a' ? BASE[s.base].v : +btn.dataset.n;
    inN.value = numStr(v);
    fromN(v);
  });
}

/* ---------- 第 11 页：运算性质验证器 ---------- */
const LAWS = [
  { l: '\\log_a(MN)', r: '\\log_aM+\\log_aN', L: (s, g) => g(s.M * s.N), R: (s, g) => g(s.M) + g(s.N) },
  { l: '\\log_a\\dfrac MN', r: '\\log_aM-\\log_aN', L: (s, g) => g(s.M / s.N), R: (s, g) => g(s.M) - g(s.N) },
  { l: '\\log_aM^n', r: 'n\\log_aM', L: (s, g) => g(s.M ** s.n), R: (s, g) => s.n * g(s.M) },
];
const FAKES = [
  { l: '\\log_a(M+N)', r: '\\log_aM+\\log_aN', L: (s, g) => g(s.M + s.N), R: (s, g) => g(s.M) + g(s.N) },
  { l: '\\log_a(MN)', r: '\\log_aM\\cdot\\log_aN', L: (s, g) => g(s.M * s.N), R: (s, g) => g(s.M) * g(s.N) },
];

function rowsHtml(rules) {
  return rules.map((r) => `<div class="vrow"><span class="vh"><span>$${r.l}$</span><b></b></span><span class="vs"></span><span class="vh"><span>$${r.r}$</span><b></b></span></div>`).join('');
}

function fillRows(box, rules, s, g, isLaw) {
  box.querySelectorAll('.vrow').forEach((row, i) => {
    const [L, R] = [rules[i].L(s, g), rules[i].R(s, g)];
    const same = Math.abs(L - R) < SAME_EPS;
    const [bl, br] = row.querySelectorAll('b');
    bl.textContent = L.toFixed(DIGITS);
    br.textContent = R.toFixed(DIGITS);
    row.className = `vrow ${same ? (isLaw ? 'ok' : 'luck') : 'no'}`;
    row.querySelector('.vs').textContent = same ? (isLaw ? '= ✓' : '= 碰巧') : '≠ ✗';
  });
}

function initVerifier() {
  const s = { base: '2', M: 4, N: 8, n: 3 };
  $('vfLaws').innerHTML = rowsHtml(LAWS);
  $('vfFakes').innerHTML = rowsHtml(FAKES);
  tex($('vfLaws')); tex($('vfFakes'));
  const show = () => {
    const a = BASE[s.base].v;
    const g = (x) => logBy(a, x);
    $('vfMV').textContent = fmt(s.M, 1); $('vfNV').textContent = fmt(s.N, 1); $('vfnV').textContent = fmt(s.n, 1);
    fillRows($('vfLaws'), LAWS, s, g, true);
    fillRows($('vfFakes'), FAKES, s, g, false);
  };
  baseButtons($('vfBases'), ['2', '10', 'e'], s.base, (k) => { s.base = k; show(); });
  slider($('vfM'), (v) => { s.M = v; show(); });
  slider($('vfN'), (v) => { s.N = v; show(); });
  slider($('vfn'), (v) => { s.n = v; show(); });
}

/* ---------- 第 13 页：换底公式验证器 ---------- */
const LOG_NAME = { 10: (x) => `\\lg ${x}`, e: (x) => `\\ln ${x}`, 2: (x) => `\\log_2${x}` };

function initChangeBase() {
  const s = { a: '3', c: '10', N: 5 };
  const show = () => {
    const a = BASE[s.a];
    const c = BASE[s.c].v;
    const nT = numStr(s.N);
    const left = solveExp(a.v, s.N);
    const [up, dn] = [logBy(c, s.N), logBy(c, a.v)];
    const right = up / dn;
    const name = LOG_NAME[s.c];
    $('cbNV').textContent = fmt(s.N, 1);
    setTex($('cbDefQ'), `${a.p}^b=${nT}`);
    setTex($('cbL'), `\\log_${brace(a.t)}${nT}${rel4(left)}${fix4(left)}`);
    setTex($('cbR'), `\\dfrac{${name(nT)}}{${name(a.t)}}${rel4(up, dn)}\\dfrac{${fix4(up)}}{${fix4(dn)}}${rel4(right)}${fix4(right)}`);
    const same = fix4(left) === fix4(right);
    $('cbOk').className = `cb-ok ${same ? 'ok' : 'no'}`;
    $('cbOk').textContent = same ? '两种算法精确到 4 位小数完全一致 ✓' : '两边不一致 ✗';
  };
  baseButtons($('cbA'), ['2', '3', '5', 'half'], s.a, (k) => { s.a = k; show(); });
  baseButtons($('cbC'), ['10', 'e', '2'], s.c, (k) => { s.c = k; show(); });
  slider($('cbN'), (v) => { s.N = v; show(); });
}

window.LESSON = {
  init() {
    initConverter();
    initVerifier();
    initChangeBase();
  },
};
