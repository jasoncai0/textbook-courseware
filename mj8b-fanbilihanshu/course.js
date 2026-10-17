'use strict';
/* 八下 11.1 反比例函数 · 本课互动：植树描点（填对一格出现一个点）、南京—上海汽车（按小时分段）、
 * 正比例 vs 反比例对照台、面积 50 的矩形。所有图形、数值都由函数表达式计算绘制。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const neg = (s) => String(s).replace('-', '−');

/* ---------- 第 3 页：植树 t = 120 / n ---------- */
function initTree() {
  const NS = [20, 40, 60, 80, 100, 120];
  const shown = new Set([60]);
  const b = board($('treeBoard'), { x: [-10, 148], y: [-0.8, 7.2], w: 560, h: 300, ticks: [20, 1], labels: ['人数', '时间'] });
  b.seg([[60, 0], [60, 2]], { cls: 'dash' });
  b.seg([[0, 2], [60, 2]], { cls: 'dash' });
  NS.forEach((n) => b.pt([n, 120 / n], { cls: 'c2', r: 7, show: () => shown.has(n) }));
  b.update();
  const cells = [...$('treeTab').rows[1].cells].slice(1);
  const sync = () => {
    cells.forEach((td, i) => { const bl = td.querySelector('.blank'); if (bl && bl.classList.contains('ok')) shown.add(NS[i]); });
    b.update();
  };
  new MutationObserver(sync).observe($('treeTab'), { subtree: true, attributes: true, attributeFilter: ['class'] });
}

/* ---------- 第 4 页：南京—上海 300 km，每小时走 v km ---------- */
function initRoad() {
  const svg = $('road');
  const L = 40;
  const R = 600; // 300 km 画成 560 px
  const px = (km) => L + (km / 300) * (R - L);
  let timer = 0;
  const draw = (v, frac) => {
    const t = 300 / v;
    const hours = Math.floor(t + 1e-9);
    let marks = '';
    for (let h = 1; h <= hours; h++) {
      const x = px(Math.min(300, h * v));
      if (h * v < 300 - 1e-9) marks += `<line x1="${x}" y1="52" x2="${x}" y2="76" stroke="#1d6fa5" stroke-width="2"/><text x="${x}" y="92" font-size="16" fill="#1d6fa5" text-anchor="middle">${h} h</text>`;
    }
    const segs = Array.from({ length: Math.ceil(t - 1e-9) }, (_, i) => {
      const a = px(i * v);
      const e = px(Math.min(300, (i + 1) * v));
      return `<rect x="${a + 1}" y="58" width="${Math.max(0, e - a - 2)}" height="12" rx="3" fill="${i % 2 ? '#bcd7ec' : '#8fbde0'}"/>`;
    }).join('');
    const cx = px(300 * frac);
    svg.innerHTML = `<line x1="${L}" y1="64" x2="${R}" y2="64" stroke="#cdd8e2" stroke-width="16" stroke-linecap="round"/>${segs}${marks}`
      + `<circle cx="${L}" cy="64" r="7" fill="#1f2d3a"/><circle cx="${R}" cy="64" r="7" fill="#1f2d3a"/>`
      + `<text x="${L}" y="30" font-size="18" fill="#1f2d3a" text-anchor="middle">南京</text><text x="${R}" y="30" font-size="18" fill="#1f2d3a" text-anchor="middle">上海</text>`
      + `<text x="${(L + R) / 2}" y="114" font-size="16" fill="#556575" text-anchor="middle">300 km（每一段是汽车 1 h 行驶的 ${v} km）</text>`
      + `<g transform="translate(${cx - 14} 34)"><rect width="28" height="14" rx="4" fill="#d9711c"/><circle cx="7" cy="15" r="3.5" fill="#1f2d3a"/><circle cx="21" cy="15" r="3.5" fill="#1f2d3a"/></g>`;
  };
  const run = (v) => {
    cancelAnimationFrame(timer);
    const dur = (300 / v) * 450; // 1 h 演示 0.45 s：速度越快，跑完越快
    const t0 = performance.now();
    const tick = (now) => {
      const f = Math.min(1, (now - t0) / dur);
      draw(v, f);
      if (f < 1) timer = requestAnimationFrame(tick);
    };
    timer = requestAnimationFrame(tick);
  };
  MathKit.slider($('vIn'), (v) => {
    const t = 300 / v;
    $('vV').textContent = v;
    const tTex = Number.isInteger(t) ? `=${t}` : `\\approx${fmt(t, 2)}`;
    $('vMsg').innerHTML = `$v=${v}$ 时，$t=\\dfrac{300}{${v}}${tTex}$（h）；$v\\cdot t=300$，<b>积不变</b>．`;
    tex($('vMsg'));
    [...$('vTab').rows[0].cells].forEach((td, i) => { if (i) td.classList.toggle('on', +td.textContent === v); });
    run(v);
  });
}

/* ---------- 第 7 页：正比例 vs 反比例对照台 ---------- */
function initCompare() {
  const s = { k: 6, x: 2, prev: null };
  const KS = [6, 2, -6];
  const XS = [1, 2, 3, 4, 6];
  const yP = (x) => s.k * x;
  const yI = (x) => (x === 0 ? NaN : s.k / x);
  const show = (v) => (Number.isFinite(v) ? neg(fmt(v, 3)) : '无意义');
  const fracTex = (k, x) => {
    if (x === 0) return '';
    const v = k / x;
    return Number.isInteger(v * 1000) ? neg(fmt(v, 3)) : `${neg(k)}\\div${x < 0 ? `(${neg(x)})` : x}`;
  };
  const render = (why) => {
    const { k, x } = s;
    $('xV').textContent = neg(fmt(x));
    $('xIn').value = x;
    $('pX1').textContent = neg(fmt(x)); $('pY1').textContent = show(yP(x));
    $('pX2').textContent = neg(fmt(x)); $('pY2').textContent = show(yI(x));
    $('pR1').innerHTML = x === 0 ? '$x=0$ 时，商 $\\dfrac{y}{x}$ 没有意义（$y=0$）' : `商：$\\dfrac{y}{x}=\\dfrac{${neg(fmt(yP(x), 3))}}{${neg(fmt(x))}}=${neg(k)}$`;
    $('pR2').innerHTML = x === 0 ? '$x=0$ 时，$\\dfrac{k}{x}$ <b>没有意义</b>' : `积：$xy=${x < 0 ? `(${neg(fmt(x))})` : fmt(x)}\\times${yI(x) < 0 ? `(${fracTex(k, x)})` : fracTex(k, x)}=${neg(k)}$`;
    const row = (f) => XS.map((a) => `<td class="${a === x ? 'on' : ''}">${neg(fmt(f(a), 2))}</td>`).join('');
    $('tab1').innerHTML = `<tr><th>$x$</th>${XS.map((a) => `<td class="${a === x ? 'on' : ''}">${a}</td>`).join('')}</tr><tr><th>$y=${neg(k)}x$</th>${row(yP)}</tr>`;
    $('tab2').innerHTML = `<tr><th>$x$</th>${XS.map((a) => `<td class="${a === x ? 'on' : ''}">${a}</td>`).join('')}</tr><tr><th>$y=\\frac{${neg(k)}}{x}$</th>${row(yI)}</tr>`;
    const m = $('cmpMsg');
    m.className = `tip feedback ${why ? 'fb-ok' : ''}`;
    m.innerHTML = why || '拖动 $x$，或点“× 2”“× 3”“÷ 2”，比较左右两边 $y$ 的变化．';
    ['pR1', 'pR2', 'tab1', 'tab2', 'cmpMsg'].forEach((id) => tex($(id)));
  };
  $('kBtns').innerHTML = KS.map((k) => `<button type="button" class="btn${k === s.k ? ' solid' : ''}" data-k="${k}">${neg(k)}</button>`).join('');
  $('kBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = +btn.dataset.k;
    $('kBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    render();
  });
  $('mulBtns').innerHTML = [['×2', 2], ['×3', 3], ['÷2', 0.5]].map(([t, m]) => `<button type="button" class="btn" data-m="${m}">${t.replace('×', '× ').replace('÷', '÷ ')}</button>`).join('');
  $('mulBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    const m = +btn.dataset.m;
    const nx = s.x * m;
    if (s.x === 0) { render('$x=0$ 乘几都还是 0，先把 $x$ 拖到别的值．'); return; }
    if (Math.abs(nx) > 6 || Math.abs(nx * 2 - Math.round(nx * 2)) > 1e-9) { render(`$x=${neg(fmt(nx, 2))}$ 超出了滑块范围，先把 $x$ 调小一些再试．`); return; }
    const [a1, a2] = [yP(s.x), yI(s.x)];
    s.x = nx;
    const word = m > 1 ? `扩大到原来的 ${m} 倍` : '缩小到原来的 $\\dfrac12$';
    const inv = m > 1 ? `缩小到原来的 $\\dfrac1{${m}}$` : '扩大到原来的 2 倍';
    render(`$x$ ${word}：正比例 $y$ 从 ${neg(fmt(a1, 3))} 变为 ${neg(fmt(yP(nx), 3))}，<b>也${word}</b>；反比例 $y$ 从 ${neg(fmt(a2, 3))} 变为 ${neg(fmt(yI(nx), 3))}，<b>${inv}</b>．`);
  });
  $('xIn').addEventListener('input', () => { s.x = +$('xIn').value; render(); });
  $('xIn').setAttribute('data-noswipe', '');
  render();
}

/* ---------- 第 9 页：面积 50 cm² 的矩形 ---------- */
function initRect() {
  const s = { x: 5 };
  const b = board($('rectBoard'), { x: [-1.5, 27], y: [-1.5, 27], w: 420, ticks: 5, labels: ['x', 'y'] });
  b.fn((x) => 50 / x, { from: 1.9, to: 26, cls: 'dash' });
  b.poly(() => [[0, 0], [s.x, 0], [s.x, 50 / s.x], [0, 50 / s.x]], { cls: 'fillA' });
  b.drag(() => [s.x, 50 / s.x], (x) => { s.x = snap(clamp(x, 2, 25), 0.5); });
  b.onUpdate = () => {
    $('rxIn').value = s.x;
    $('rxV').textContent = fmt(s.x);
    $('rectMsg').innerHTML = `$x=${fmt(s.x)}$，$y=\\dfrac{50}{${fmt(s.x)}}=${fmt(50 / s.x, 2)}$，面积 $=${fmt(s.x)}\\times${fmt(50 / s.x, 2)}${Math.abs(+fmt(50 / s.x, 2) * s.x - 50) < 1e-9 ? '=' : '\\approx'}50$ cm²`;
    tex($('rectMsg'));
  };
  $('rxIn').addEventListener('input', () => { s.x = +$('rxIn').value; b.update(); });
  $('rxIn').setAttribute('data-noswipe', '');
  b.update();
  return () => b.update();
}

let redraw = () => {};
window.LESSON = {
  init() {
    initTree();
    initRoad();
    initCompare();
    redraw = initRect();
  },
  onRender() { requestAnimationFrame(redraw); },
};
