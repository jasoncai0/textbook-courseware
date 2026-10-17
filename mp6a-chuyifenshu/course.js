'use strict';
/* 六上 一个数除以分数 · 本课互动：切橙子数份数（例 2）、按 2/3 米剪彩带（例 3，可换每段长度，余下部分按真实比例显示）、
 * 量杯倒果汁（例 4）、练一练数 1/5 与 3/10。所有份数、长度都按题目数据精确计算。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el, gcd } = FracFig;
const $ = (id) => document.getElementById(id);
const PEOPLE = ['#f5a623', '#4f9bd0', '#2fa37f', '#e0607e', '#8e6bbf', '#c9a227'];
const LINE = '#7d8e9c';
const texFrac = (a, b) => {
  const g = gcd(a, b);
  return b / g === 1 ? `${a / g}` : `\\dfrac{${a / g}}{${b / g}}`;
};
const say = (id, html, ok = true) => {
  const m = $(id);
  m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
  m.innerHTML = html;
  tex(m);
};

/* ---------- 橙子：4 个，每个平均切成 k 块并按顺序编号；k = 0 表示还没切 ---------- */
const ORANGES = 4;
function drawOranges(svg, k) {
  svg.innerHTML = '';
  const r = 62;
  let no = 0;
  for (let i = 0; i < ORANGES; i += 1) {
    const cx = 75 + i * 137;
    const cy = 82;
    el('circle', { cx, cy, r: r + 4, fill: '#e98a12' }, svg);
    if (!k) { el('circle', { cx, cy, r, fill: '#f7a531' }, svg); continue; }
    for (let j = 0; j < k; j += 1) {
      const t0 = -Math.PI / 2 + (j * 2 * Math.PI) / k;
      const t1 = t0 + (2 * Math.PI) / k;
      const p = (t) => `${(cx + r * Math.cos(t)).toFixed(2)} ${(cy + r * Math.sin(t)).toFixed(2)}`;
      const d = k === 1 ? `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0` : `M${cx} ${cy}L${p(t0)}A${r} ${r} 0 0 1 ${p(t1)}Z`;
      el('path', { d, fill: j % 2 ? '#f9b94d' : '#f7a531', stroke: '#fff', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
      no += 1;
      const tm = (t0 + t1) / 2;
      const rr = k === 1 ? 0 : r * 0.62;
      el('text', { x: cx + rr * Math.cos(tm), y: cy + rr * Math.sin(tm) + 7, class: 'or-n' }, svg).textContent = no;
    }
  }
  return no;
}

function initPage3() {
  const svg = $('or3');
  drawOranges(svg, 0);
  document.querySelectorAll('[data-k3]').forEach((b) => b.addEventListener('click', () => {
    const k = +b.dataset.k3;
    const n = drawOranges(svg, k);
    say('msg3', k === 1 ? `每人 1 个，可以分给 <b>${n}</b> 人。` : `每个橙子切成 2 块，每人 1 块（$\\dfrac12$ 个），数一数：可以分给 <b>${n}</b> 人。`);
  }));
}

function initPage4() {
  const svg = $('or4');
  const render = (k) => {
    const n = drawOranges(svg, k);
    $('k4v').innerHTML = `$\\dfrac1{${k}}$`;
    $('eq4').innerHTML = `一共 ${n} 块：$4\\div\\dfrac1{${k}}=4\\times${k}=${n}$（人）`;
    tex($('k4v'));
    tex($('eq4'));
  };
  $('k4').addEventListener('input', (e) => render(+e.target.value));
  render(3);
}

/* ---------- 例 3：4 米彩带，每段 n/d 米（以 1/d 米为单位精确计算） ---------- */
const TAPE = { m: 4, x0: 40, x1: 960, y: 50, h: 46 };
const SEGS = [[2, 3], [1, 3], [3, 4], [1, 2]];
function initPage5() {
  const svg = $('tape5');
  const st = { n: 2, d: 3, cut: 0 };
  const X = (meters) => TAPE.x0 + ((TAPE.x1 - TAPE.x0) * meters) / TAPE.m;
  const units = () => TAPE.m * st.d; // 一共有几个 1/d 米
  const full = () => Math.floor(units() / st.n);
  const render = () => {
    svg.innerHTML = '';
    const { n, d } = st;
    el('rect', { x: X(0), y: TAPE.y, width: X(TAPE.m) - X(0), height: TAPE.h, fill: '#fff', stroke: '#2a4256', 'stroke-width': 2 }, svg);
    for (let s = 0; s < st.cut; s += 1) {
      el('rect', { x: X((s * n) / d), y: TAPE.y, width: X((n) / d) - X(0), height: TAPE.h, fill: s % 2 ? '#8fd3f4' : '#f7b2c8' }, svg);
      el('text', { x: X(((s + 0.5) * n) / d), y: TAPE.y + TAPE.h / 2 + 7, class: 'or-n' }, svg).textContent = s + 1;
    }
    const rem = units() - full() * n;
    if (st.cut === full() && rem > 0) {
      el('rect', { x: X((full() * n) / d), y: TAPE.y, width: X(rem / d) - X(0), height: TAPE.h, fill: '#eee', stroke: '#c0392b', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, svg);
    }
    for (let u = 0; u <= units(); u += 1) {
      const whole = u % d === 0;
      el('line', { x1: X(u / d), x2: X(u / d), y1: TAPE.y - (whole ? 16 : 6), y2: TAPE.y + TAPE.h + (whole ? 10 : 0), stroke: whole ? '#2a4256' : LINE, 'stroke-width': whole ? 2.5 : 1.5, 'stroke-dasharray': whole ? 'none' : '4 3' }, svg);
      if (whole) el('text', { x: X(u / d), y: TAPE.y + TAPE.h + 34, class: 'or-t' }, svg).textContent = `${u / d} 米`;
    }
    el('rect', { x: X(0), y: TAPE.y, width: X(TAPE.m) - X(0), height: TAPE.h, fill: 'none', stroke: '#2a4256', 'stroke-width': 2.5 }, svg);
    const seg = `$\\dfrac{${n}}{${d}}$`;
    if (!st.cut) { say('msg5', `每段 ${seg} 米：1 米被虚线平均分成 ${d} 小格，每段占 ${n} 小格。点“剪一段”。`); return; }
    const f = full();
    const done = st.cut === f;
    let html = `已经剪了 <b>${st.cut}</b> 段。`;
    if (done) {
      html = `一共剪成 <b>${f}</b> 段`;
      html += rem ? `，还剩 $${texFrac(rem, d)}$ 米，不够一段（是一段的 $${texFrac(rem, n)}$）。` : '，正好剪完。';
      html += `　$4\\div\\dfrac{${n}}{${d}}=4\\times\\dfrac{${d}}{${n}}=${texFrac(4 * d, n)}$`;
    }
    say('msg5', html, true);
  };
  const pick = $('segPick');
  SEGS.forEach(([n, d]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    btn.dataset.seg = `${n}/${d}`;
    btn.innerHTML = `$\\dfrac{${n}}{${d}}$ 米`;
    pick.appendChild(btn);
  });
  tex(pick);
  const mark = () => pick.querySelectorAll('button').forEach((b) => b.classList.toggle('solid', b.dataset.seg === `${st.n}/${st.d}`));
  pick.addEventListener('click', (e) => {
    const b = e.target.closest('[data-seg]');
    if (!b) return;
    [st.n, st.d] = b.dataset.seg.split('/').map(Number);
    st.cut = 0;
    mark();
    render();
  });
  $('cut5').addEventListener('click', () => { st.cut = Math.min(full(), st.cut + 1); render(); });
  $('all5').addEventListener('click', () => { st.cut = full(); render(); });
  $('reset5').addEventListener('click', () => { st.cut = 0; render(); });
  mark();
  render();
}

/* ---------- 例 4：量杯 9/10 升，每杯 3/10 升 ---------- */
const CUP = { x: 50, w: 150, top: 20, bot: 280, tenths: 10, juice: 9, glass: 3 };
function initPage7() {
  const svg = $('pour7');
  const unit = (CUP.bot - CUP.top) / CUP.tenths;
  const maxGlasses = Math.floor(CUP.juice / CUP.glass);
  let poured = 0;
  const render = () => {
    svg.innerHTML = '';
    const left = CUP.juice - poured * CUP.glass;
    el('rect', { x: CUP.x, y: CUP.bot - left * unit, width: CUP.w, height: left * unit, fill: '#f9c23c' }, svg);
    for (let i = 1; i < CUP.tenths; i += 1) {
      el('line', { x1: CUP.x, x2: CUP.x + 26, y1: CUP.bot - i * unit, y2: CUP.bot - i * unit, stroke: '#2a4256', 'stroke-width': 2 }, svg);
    }
    el('path', { d: `M${CUP.x} ${CUP.top}V${CUP.bot}H${CUP.x + CUP.w}V${CUP.top}`, fill: 'none', stroke: '#2a4256', 'stroke-width': 3 }, svg);
    el('text', { x: CUP.x + CUP.w + 8, y: CUP.top + 8, class: 'or-t start' }, svg).textContent = '1 升';
    for (let g = 0; g < maxGlasses; g += 1) {
      const gx = 290 + g * 75;
      const gh = CUP.glass * unit;
      if (g < poured) el('rect', { x: gx, y: CUP.bot - gh, width: 55, height: gh, fill: '#f9c23c' }, svg);
      el('path', { d: `M${gx} ${CUP.bot - gh - 4}V${CUP.bot}H${gx + 55}V${CUP.bot - gh - 4}`, fill: 'none', stroke: '#2a4256', 'stroke-width': 2.5 }, svg);
      if (g < poured) el('text', { x: gx + 27, y: CUP.bot - gh / 2 + 7, class: 'or-n' }, svg).textContent = g + 1;
    }
    el('text', { x: 290 + 1.5 * 75 - 10, y: CUP.bot - CUP.glass * unit - 24, class: 'or-t' }, svg).textContent = '每杯容量 3/10 升（3 格高）';
    $('pour7n').textContent = poured;
  };
  $('pour7go').addEventListener('click', () => { poured = Math.min(maxGlasses, poured + 1); render(); });
  $('pour7reset').addEventListener('click', () => { poured = 0; render(); });
  render();
}

/* ---------- 练一练：3/5 里有几个 1/5、几个 3/10 ---------- */
const F8 = { x: 40, y: 20, w: 440, h: 130, fifths: 5, on: 3 };
function initPage8() {
  const svg = $('fig8');
  const render = (group) => {
    svg.innerHTML = '';
    const hw = F8.w / (F8.fifths * 2);
    for (let i = 0; i < F8.fifths * 2; i += 1) {
      const colored = i < F8.on * 2;
      let fill = colored ? '#8fd3f4' : '#fff';
      let gi = -1;
      if (colored && group) { gi = Math.floor(i / (group === 1 ? 2 : 3)); fill = PEOPLE[gi]; }
      el('rect', { x: F8.x + i * hw, y: F8.y, width: hw, height: F8.h, fill }, svg);
      if (gi >= 0 && i % (group === 1 ? 2 : 3) === 0) el('text', { x: F8.x + (i + (group === 1 ? 1 : 1.5)) * hw, y: F8.y + F8.h + 30, class: 'or-t', fill }, svg).textContent = `第${gi + 1}个`;
    }
    for (let i = 1; i < F8.fifths * 2; i += 1) {
      el('line', { x1: F8.x + i * hw, x2: F8.x + i * hw, y1: F8.y, y2: F8.y + F8.h, stroke: i % 2 ? LINE : '#2a9fd6', 'stroke-width': i % 2 ? 1.5 : 2.5, 'stroke-dasharray': i % 2 ? '5 4' : 'none' }, svg);
    }
    el('rect', { x: F8.x, y: F8.y, width: F8.w, height: F8.h, fill: 'none', stroke: '#2a9fd6', 'stroke-width': 3 }, svg);
  };
  document.querySelectorAll('[data-g8]').forEach((b) => b.addEventListener('click', () => {
    const g = +b.dataset.g8;
    render(g);
    say('msg8', g === 1 ? '$\\dfrac35$ 里有 <b>3</b> 个 $\\dfrac15$。' : '每个 $\\dfrac3{10}$ 是 3 个小格，$\\dfrac35$ 里有 <b>2</b> 个 $\\dfrac3{10}$。');
  }));
  render(0);
}

window.LESSON = {
  init() {
    initPage3();
    initPage4();
    initPage5();
    initPage7();
    initPage8();
    FracFig.exact();
  },
};
