'use strict';
/* 六上 比的基本性质 · 本课互动：配比滑块（前后项同时 ×/÷ 相同的数，或只变前项，看蜂蜜水颜色与比例条）、化简工作台（精确分数运算）、练习九的正方形图。
 * 颜色只由“蜂蜜占几分之几”决定，比例条按比精确画。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const HONEY = '#e39b2d';
const WATER = '#eef7fb';

/* 精确有理数 {n, d} */
const Q = (n, d = 1) => { const g = gcd(Math.abs(n), Math.abs(d)) || 1; return { n: n / g, d: d / g }; };
const qmul = (a, b) => Q(a.n * b.n, a.d * b.d);
const qdiv = (a, b) => Q(a.n * b.d, a.d * b.n);
const isInt = (a) => a.d === 1;
/* 分母只含 2、5 时写成小数，否则写分数 */
function decStr(a) {
  let d = a.d;
  let k = 0;
  while (d % 2 === 0) { d /= 2; k += 1; }
  while (d % 5 === 0) { d /= 5; k += 1; }
  if (d !== 1) return null;
  return (a.n / a.d).toFixed(k).replace(/\.?0+$/, '');
}
const termTex = (a, kind) => {
  if (isInt(a)) return `${a.n}`;
  const s = kind === 'dec' ? decStr(a) : null;
  return s ?? `\\dfrac{${a.n}}{${a.d}}`;
};
const mix = (a, b) => {
  const p = a / (a + b);
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [h, w] = [hex(HONEY), hex(WATER)];
  return `rgb(${h.map((v, i) => Math.round(w[i] + (v - w[i]) * p)).join(',')})`;
};

/* ---------- 第 4 页：配比滑块 ---------- */
const BASE = { a: 4, b: 5 };
const KS = [{ t: '÷4', q: Q(1, 4) }, { t: '÷2', q: Q(1, 2) }, { t: '×1', q: Q(1) }, { t: '×2', q: Q(2) }, { t: '×3', q: Q(3) }, { t: '×4', q: Q(4) }, { t: '×10', q: Q(10) }];
function drawJug(svg, a, b) {
  svg.innerHTML = '';
  const [x0, x1, top, bot] = [40, 160, 30, 215];
  const level = top + (bot - top) * 0.2;
  el('rect', { x: x0, y: level, width: x1 - x0, height: bot - level, fill: mix(a, b) }, svg);
  el('path', { d: `M${x0} ${top}V${bot}H${x1}V${top}M${x1} ${top + 30}q32 10 0 80`, fill: 'none', stroke: '#7d8e9c', 'stroke-width': 4 }, svg);
}
function drawStrip(svg, rows) {
  svg.innerHTML = '';
  const [x0, w, h] = [110, 470, 26];
  rows.forEach(({ label, a, b }, i) => {
    const y = 10 + i * 42;
    const hw = (w * a) / (a + b);
    el('text', { x: x0 - 10, y: y + 20, class: 'bt s end' }, svg).textContent = label;
    el('rect', { x: x0, y, width: hw, height: h, fill: HONEY }, svg);
    el('rect', { x: x0 + hw, y, width: w - hw, height: h, fill: WATER }, svg);
    const units = a + b;
    if (Number.isInteger(a) && Number.isInteger(b) && units <= 30) {
      for (let u = 1; u < units; u += 1) el('line', { x1: x0 + (w * u) / units, x2: x0 + (w * u) / units, y1: y, y2: y + h, stroke: '#fff', 'stroke-width': u === a ? 0 : 1.2, opacity: 0.8 }, svg);
    }
    el('rect', { x: x0, y, width: w, height: h, fill: 'none', stroke: '#2a4256', 'stroke-width': 2 }, svg);
  });
}
function initPage4() {
  const st = { k: 3, mode: 'both' };
  drawJug($('jugA'), BASE.a, BASE.b);
  const render = () => {
    const K = KS[st.k];
    const a = qmul(Q(BASE.a), K.q);
    const b = st.mode === 'both' ? qmul(Q(BASE.b), K.q) : Q(BASE.b);
    const [av, bv] = [a.n / a.d, b.n / b.d];
    drawJug($('jugB'), av, bv);
    drawStrip($('strip4'), [{ label: '小壶', a: BASE.a, b: BASE.b }, { label: '大壶', a: av, b: bv }]);
    const r = `${termTex(a, 'dec')}:${termTex(b, 'dec')}`;
    $('ratioB').innerHTML = `$${r}$`;
    const val = qdiv(a, b);
    const same = val.n * BASE.b === val.d * BASE.a;
    const op = K.t.replace('×', '\\times').replace('÷', '\\div');
    $('op4').innerHTML = st.mode === 'both'
      ? `$(4${op}):(5${op})=${r}$`
      : `$(4${op}):5=${r}$`;
    const msg = $('msg4');
    msg.className = `tip feedback ${same ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = same
      ? `比值 $${termTex(a, 'dec')}\\div${termTex(b, 'dec')}=\\dfrac45$，<b>没有变</b>，两壶一样甜。`
      : `比值变成了 $${val.d === 1 ? val.n : `\\dfrac{${val.n}}{${val.d}}`}$，${av / bv > 0.8 ? '蜂蜜偏多，更甜' : '水偏多，更淡'}。`;
    [$('ratioB'), $('op4'), msg].forEach(tex);
    document.querySelectorAll('[data-mode4]').forEach((x) => x.classList.toggle('solid', x.dataset.mode4 === st.mode));
  };
  $('k4').addEventListener('input', (e) => { st.k = +e.target.value; render(); });
  document.querySelectorAll('[data-mode4]').forEach((x) => x.addEventListener('click', () => { st.mode = x.dataset.mode4; render(); }));
  render();
}

/* ---------- 第 6 页：化简工作台 ---------- */
const RATIOS = [
  { name: '例 10 (1)', a: Q(12), b: Q(18), kind: 'int' },
  { name: '例 10 (2)', a: Q(5, 6), b: Q(3, 4), kind: 'frac' },
  { name: '例 10 (3)', a: Q(18, 10), b: Q(9, 100), kind: 'dec' },
  { name: '21:35', a: Q(21), b: Q(35), kind: 'int' },
  { name: '5/6 : 4/9', a: Q(5, 6), b: Q(4, 9), kind: 'frac' },
  { name: '1.25:2', a: Q(125, 100), b: Q(2), kind: 'dec' },
  { name: '6.3:0.9', a: Q(63, 10), b: Q(9, 10), kind: 'dec' },
];
const OPS = [['×', 4], ['×', 10], ['×', 12], ['×', 18], ['×', 100], ['÷', 2], ['÷', 3], ['÷', 5], ['÷', 6], ['÷', 7], ['÷', 9], ['÷', 25]];
function initPage6() {
  const st = { i: 0, a: null, b: null, log: [] };
  const pre = $('presets6');
  RATIOS.forEach((R, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn'; b.dataset.r = i; b.textContent = R.name;
    pre.appendChild(b);
  });
  const ops = $('ops6');
  OPS.forEach(([o, k]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'btn'; b.dataset.op = `${o}${k}`; b.textContent = `同时 ${o}${k}`;
    ops.appendChild(b);
  });
  const ratioTex = () => `${termTex(st.a, RATIOS[st.i].kind)}:${termTex(st.b, RATIOS[st.i].kind)}`;
  const load = (i) => {
    st.i = i; st.a = RATIOS[i].a; st.b = RATIOS[i].b;
    st.log = [ratioTex()];
  };
  const render = () => {
    $('ratio6').innerHTML = `$${ratioTex()}$`;
    pre.querySelectorAll('button').forEach((b) => b.classList.toggle('solid', +b.dataset.r === st.i));
    $('log6').innerHTML = `过程：$${st.log.join('=')}$`;
    const msg = $('msg6');
    let html;
    let ok = false;
    if (isInt(st.a) && isInt(st.b)) {
      const g = gcd(st.a.n, st.b.n);
      if (g === 1) { ok = true; html = `<b>✓ 已经是最简单的整数比</b>：$${ratioTex()}$，比值 $${st.b.n === 1 ? st.a.n : `\\dfrac{${st.a.n}}{${st.b.n}}`}$。`; } else html = `前项、后项都是整数了，但还有公因数 <b>${g}</b>，可以同时除以 ${g}。`;
    } else if (RATIOS[st.i].kind === 'frac' || !decStr(st.a) || !decStr(st.b)) html = '还有分数：同时乘分母的最小公倍数，去掉分母。';
    else html = '还有小数：先同时乘 10、100……变成整数。';
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = html;
    [$('ratio6'), $('log6'), msg].forEach(tex);
  };
  pre.addEventListener('click', (e) => { const b = e.target.closest('[data-r]'); if (b) { load(+b.dataset.r); render(); } });
  ops.addEventListener('click', (e) => {
    const b = e.target.closest('[data-op]');
    if (!b) return;
    const k = Q(+b.dataset.op.slice(1));
    const f = b.dataset.op[0] === '×' ? qmul : qdiv;
    st.a = f(st.a, k); st.b = f(st.b, k);
    st.log.push(ratioTex());
    if (st.log.length > 5) st.log.splice(1, 1);
    render();
  });
  load(0);
  render();
}

/* ---------- 第 10 页：边长 3 cm 和 6 cm 的正方形（按真实比例） ---------- */
function initPage10() {
  const svg = $('sq10');
  const s = 17; // 每厘米 17 单位
  el('rect', { x: 20, y: 110 - 3 * s, width: 3 * s, height: 3 * s, fill: '#fff', stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
  el('rect', { x: 110, y: 110 - 6 * s, width: 6 * s, height: 6 * s, fill: '#fff', stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
  [[0, 1], [1, 0], [1, 1]].forEach(([i, j]) => el('rect', { x: 110 + i * 3 * s, y: 110 - 6 * s + j * 3 * s, width: 3 * s, height: 3 * s, fill: 'none', stroke: '#9fb0bf', 'stroke-dasharray': '4 3' }, svg));
  el('text', { x: 20 + 1.5 * s, y: 127, class: 'bt s' }, svg).textContent = '3 cm';
  el('text', { x: 110 + 3 * s, y: 127, class: 'bt s' }, svg).textContent = '6 cm';
}

window.LESSON = {
  init() {
    initPage4();
    initPage6();
    initPage10();
    FracFig.exact();
  },
};
