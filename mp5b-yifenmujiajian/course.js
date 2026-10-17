'use strict';
/* 五下 异分母分数加减法 · 本课互动：试验田图、折纸、分数条找公分母、涂色圆。通用部分见 ../shared/math.js、mcheck.js */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const C = { g: '#7cc47f', r: '#f08a7e', b: '#8fc3ea', o: '#f6b26b', line: '#1f2d3a' };

/* 结果要化成最简分数：mcheck 按数值判（16/30 = 8/15 也算对），data-strict 的空再按字面判一次 */
function strictBlanks() {
  document.querySelectorAll('.blank[data-strict]').forEach((el) => {
    const inp = el.querySelector('input');
    const judge = () => {
      const v = inp.value.trim().replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/／/g, '/').replace(/\s+/g, '');
      if (!v || !el.classList.contains('ok') || el.dataset.ans.split('|').includes(v)) { el.title = ''; return; }
      el.classList.replace('ok', 'no');
      el.title = '得数对了，但还要约成最简分数';
    };
    inp.addEventListener('change', judge);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') judge(); });
  });
}

/* 竖排分数文字：分子、分数线、分母 */
function fracText(parent, x, y, n, d, cls = 'ft') {
  const g = svgEl('g', { class: cls }, parent);
  svgEl('text', { x, y: y - 6, 'text-anchor': 'middle' }, g).textContent = n;
  svgEl('line', { x1: x - 14, y1: y, x2: x + 14, y2: y }, g);
  svgEl('text', { x, y: y + 22, 'text-anchor': 'middle' }, g).textContent = d;
  return g;
}

/* 平均分成 parts 份的横条，前 fills 段按颜色涂色：fills = [[从第几份, 到第几份, 颜色], ...] */
function bar(parent, x, y, w, h, parts, fills) {
  const u = w / parts;
  fills.forEach(([a, b, color]) => svgEl('rect', { x: x + a * u, y, width: (b - a) * u, height: h, fill: color }, parent));
  for (let k = 1; k < parts; k += 1) svgEl('line', { x1: x + k * u, y1: y, x2: x + k * u, y2: y + h, class: 'bar-div' }, parent);
  svgEl('rect', { x, y, width: w, height: h, class: 'bar-out' }, parent);
}

/* ---------- 第 2 页 回顾小条 ---------- */
function initRecall() {
  bar($('rcBar'), 20, 15, 200, 40, 5, [[0, 2, C.b], [2, 3, C.o]]);
}

/* ---------- 第 3 页 试验田 ---------- */
function initField() {
  const s = $('field');
  const [x, y, w, h] = [20, 15, 400, 220];
  svgEl('rect', { x, y, width: w / 2, height: h, fill: C.g }, s);
  svgEl('rect', { x: x + w / 2, y, width: w / 2, height: h / 2, fill: C.r }, s);
  svgEl('rect', { x, y, width: w, height: h, class: 'bar-out' }, s);
  svgEl('line', { x1: x + w / 2, y1: y, x2: x + w / 2, y2: y + h, class: 'bar-div' }, s);
  svgEl('line', { x1: x + w / 2, y1: y + h / 2, x2: x + w, y2: y + h / 2, class: 'bar-div' }, s);
  svgEl('text', { x: x + w / 4, y: y + h / 2 + 8, class: 'lab', 'text-anchor': 'middle' }, s).textContent = '黄瓜';
  svgEl('text', { x: x + (3 * w) / 4, y: y + h / 4 + 8, class: 'lab', 'text-anchor': 'middle' }, s).textContent = '番茄';
}

/* ---------- 第 4 页 折一折 ---------- */
function initFold() {
  const s = $('fold');
  const [x, y, w, h] = [40, 20, 360, 200];
  const draw = (st) => {
    s.innerHTML = '';
    svgEl('rect', { x, y, width: w, height: h, fill: '#fffdf6' }, s);
    if (st >= 1) svgEl('rect', { x, y, width: w / 2, height: h, fill: C.g, class: 'fade' }, s);
    if (st >= 2) svgEl('rect', { x: x + w / 2, y, width: w / 2, height: h / 2, fill: C.r, class: 'fade' }, s);
    if (st >= 1) svgEl('line', { x1: x + w / 2, y1: y, x2: x + w / 2, y2: y + h, class: 'crease' }, s);
    if (st >= 2) svgEl('line', { x1: x, y1: y + h / 2, x2: x + w, y2: y + h / 2, class: 'crease' }, s);
    svgEl('rect', { x, y, width: w, height: h, class: 'bar-out' }, s);
    if (st >= 2) {
      [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j]) => fracText(s, x + w / 4 + (i * w) / 2, y + h / 4 + (j * h) / 2 + 4, 1, 4));
    } else if (st === 1) fracText(s, x + w / 4, y + h / 2 + 4, 1, 2);
    svgEl('text', { x: x + w / 2, y: y + h + 34, class: 'lab', 'text-anchor': 'middle' }, s).textContent = ['一张长方形纸', '对折：左边一半涂绿（1/2）', '再对折：右上一格涂红（1/4）'][st];
  };
  $('fold1').addEventListener('click', () => draw(1));
  $('fold2').addEventListener('click', () => draw(2));
  $('fold0').addEventListener('click', () => draw(0));
  draw(0);
}

/* ---------- 第 5 页 核心：分数条找公分母 ---------- */
const FB = { x0: 130, L: 760, h: 46, rows: [22, 102, 202] };
function initFracBars() {
  const s = $('fbFig');
  const st = { q: [1, 2, '+', 1, 4], n: 3 };
  const draw = () => {
    const [a, b, op, c, d] = st.q;
    const { n } = st;
    const { x0, L, h, rows } = FB;
    s.innerHTML = '';
    const okA = (a * n) % b === 0;
    const okC = (c * n) % d === 0;
    const row = (y, num, den, color, ok) => {
      fracText(s, 60, y + h / 2 + 4, num, den);
      bar(s, x0, y, L, h, den, [[0, num, color]]);
      const ex = x0 + (num / den) * L;
      svgEl('line', { x1: ex, y1: y - 8, x2: ex, y2: y + h + 8, class: ok ? 'end ok' : 'end no' }, s);
      if (ok) fracText(s, 945, y + h / 2 + 4, (num * n) / den, n, 'ft ok');
      else svgEl('text', { x: 945, y: y + h / 2 + 10, class: 'mark no', 'text-anchor': 'middle' }, s).textContent = '✗';
    };
    row(rows[0], a, b, C.g, okA);
    row(rows[1], c, d, C.r, okC);
    // n 等分的格线（精确位置 k·L/n），穿过三行
    for (let k = 1; k < n; k += 1) svgEl('line', { x1: x0 + (k * L) / n, y1: 12, x2: x0 + (k * L) / n, y2: rows[2] + h + 10, class: 'ngrid' }, s);
    const both = okA && okC;
    const y = rows[2];
    if (both) {
      const p = (a * n) / b;
      const q = (c * n) / d;
      if (op === '+') bar(s, x0, y, L, h, n, [[0, p, C.g], [p, p + q, C.r]]);
      else {
        bar(s, x0, y, L, h, n, [[0, p - q, C.g], [p - q, p, '#e8eef3']]);
        svgEl('rect', { x: x0 + ((p - q) * L) / n, y, width: (q * L) / n, height: h, class: 'cut' }, s);
      }
      const r = op === '+' ? p + q : p - q;
      fracText(s, 945, y + h / 2 + 4, r, n, 'ft hot');
      svgEl('text', { x: 60, y: y + h / 2 + 10, class: 'lab', 'text-anchor': 'middle' }, s).textContent = op === '+' ? '合起来' : '去掉后';
      const g = gcd(r, n);
      $('fbSay').innerHTML = `分成 ${n} 份：$\\dfrac{${a}}{${b}}=\\dfrac{${p}}{${n}}$，$\\frac{${c}}{${d}}=\\frac{${q}}{${n}}$，都用 $\\frac1{${n}}$ 来数，$\\frac{${p}}{${n}}${op}\\frac{${q}}{${n}}=\\frac{${r}}{${n}}$${g > 1 ? `$=\\frac{${r / g}}{${n / g}}$` : ''}`;
    } else {
      svgEl('rect', { x: x0, y, width: L, height: h, class: 'bar-out dash' }, s);
      svgEl('text', { x: x0 + L / 2, y: y + h / 2 + 9, class: 'lab', 'text-anchor': 'middle' }, s).textContent = '还拼不出来：有分数的右端没落在格线上';
      $('fbSay').innerHTML = `分成 ${n} 份：${okA ? '' : `$\\frac{${a}}{${b}}$ `}${okC ? '' : `$\\frac{${c}}{${d}}$ `}不能正好用 $\\frac1{${n}}$ 数出来。`;
    }
    $('fbNv').textContent = n;
    MathKit.tex($('fbSay'));
  };
  $('fbQ').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-q]');
    if (!btn) return;
    st.q = btn.dataset.q.split(',').map((v) => (/\d/.test(v) ? +v : v));
    $('fbQ').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    draw();
  });
  $('fbN').addEventListener('input', (e) => { st.n = +e.target.value; draw(); });
  draw();
}

/* ---------- 第 6 页 1/2 + 1/4 = 3/4 ---------- */
function initSumBar() {
  const s = $('sumBar');
  [[0, 2, [[0, 1, C.g]], [1, 2]], [1, 4, [[0, 1, C.r]], [1, 4]], [2, 4, [[0, 2, C.g], [2, 3, C.r]], [3, 4, 'ft hot']]].forEach(([i, parts, fills, [n, d, cls]]) => {
    bar(s, 80, 10 + i * 62, 360, 38, parts, fills);
    fracText(s, 35, 33 + i * 62, n, d, cls);
  });
}

/* ---------- 第 10 页 涂色圆 ---------- */
function initPaint() {
  document.querySelectorAll('svg.tuse').forEach((s) => {
    const n = +s.dataset.n;
    const R = 54;
    for (let k = 0; k < n; k += 1) {
      const t0 = -Math.PI / 2 + (2 * Math.PI * k) / n;
      const t1 = t0 + (2 * Math.PI) / n;
      const p = (t) => `${(60 + R * Math.cos(t)).toFixed(2)} ${(60 + R * Math.sin(t)).toFixed(2)}`;
      const path = svgEl('path', { d: `M60 60L${p(t0)}A${R} ${R} 0 0 1 ${p(t1)}Z`, class: 'psec' }, s);
      path.addEventListener('click', () => path.classList.toggle('on'));
    }
  });
}

window.LESSON = {
  init() {
    strictBlanks();
    initRecall();
    initField();
    initFold();
    initFracBars();
    initSumBar();
    initPaint();
  },
};
