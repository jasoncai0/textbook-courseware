'use strict';
/* 高一上 6.2 指数函数 · 本课互动：一尺之棰（精确截半）、拖动点 (1,a) 改底数、性质表小图、关于 y 轴对称、
 * 例 3 平移（拖点 / 表格）、复利计算器、例 6 读图。通用部分见 ../shared/math.js */
const { board, slider, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';

/* 第 3 页：一尺之棰。整条宽度 = 1 尺，剩余长度按 (1/2)^x 精确画出 */
const STICK_DAYS = 6;
function initStick() {
  const L = 900;
  const X0 = 50;
  const s = { x: 0 };
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 1000 120');
  $('stick').appendChild(svg);
  const fr = (k) => (k === 0 ? '1' : `\\frac{1}{${2 ** k}}`);
  const draw = () => {
    const left = L / 2 ** s.x;
    const cuts = Array.from({ length: s.x }, (_, k) => {
      const from = X0 + L / 2 ** (k + 1);
      const w = L / 2 ** (k + 1);
      return `<rect x="${from}" y="34" width="${w}" height="34" class="cut"/><text x="${from + w / 2}" y="98" class="ct">第${k + 1}天截去</text>`;
    }).join('');
    svg.innerHTML = `${cuts}<rect x="${X0}" y="34" width="${left}" height="34" class="wood"/>`
      + `<line x1="${X0}" y1="22" x2="${X0 + L}" y2="22" class="ruler"/><text x="${X0}" y="16" class="ct s">0</text><text x="${X0 + L}" y="16" class="ct s">1 尺</text>`;
    // 只给最近几天标注，太短的段不写字
    svg.querySelectorAll('.ct').forEach((t, i) => { if (i < s.x && L / 2 ** (i + 1) < 70) t.remove(); });
    $('stInfo').innerHTML = `第 ${s.x} 天：剩 $y=\\left(\\frac12\\right)^{${s.x}}=${fr(s.x)}$ 尺 $\\approx ${fmt(1 / 2 ** s.x, 4)}$ 尺`;
    tex($('stInfo'));
    const cells = Array.from({ length: STICK_DAYS + 1 }, (_, k) => k);
    $('stTab').innerHTML = `<tr><th>天数 $x$</th>${cells.map((k) => `<td>${k}</td>`).join('')}</tr>`
      + `<tr><th>剩余 $y$ / 尺</th>${cells.map((k) => `<td>${k <= s.x ? `$${fr(k)}$` : ''}</td>`).join('')}</tr>`;
    tex($('stTab'));
    $('stDay').disabled = s.x >= STICK_DAYS;
  };
  $('stDay').addEventListener('click', () => { s.x = Math.min(STICK_DAYS, s.x + 1); draw(); });
  $('stReset').addEventListener('click', () => { s.x = 0; draw(); });
  draw();
}

/* 第 5 页：拖动点 (1, a) 改变底数 */
function initBase() {
  const s = { a: 2 };
  const b = board($('base'), { x: [-3, 3], y: [-0.5, 10.5], w: 640, h: 560, ticks: [1, 1] });
  b.seg([[1, -0.5], [1, 10.5]], { cls: 'dash' });
  b.seg([[-3, 1], [3, 1]], { cls: 'dash' });
  const mirror = b.fn((x) => (1 / s.a) ** x, { cls: 'c3' });
  b.fn((x) => s.a ** x, { cls: 'c1' });
  b.pt([0, 1], { r: 8 });
  b.text([0, 1], '(0, 1)', { cls: 'lb up', dx: 10, dy: 26 });
  b.text(() => [1, s.a], () => `(1, ${fmt(s.a)})`, { cls: 'lb up', dx: 16, dy: 6 });
  b.drag(() => [1, s.a], (_, y) => {
    const a = Math.round(Math.min(10, Math.max(0.1, y)) * 20) / 20;
    s.a = Math.abs(a - 1) < 0.06 ? 1 : a;
  });
  b.onUpdate = () => {
    mirror.style.display = $('mirror').checked ? '' : 'none';
    [-2, -1, 0, 1, 2].forEach((x, i) => { $(`v${i}`).textContent = fmt(s.a ** x, 3); });
    const msg = $('baseMsg');
    let html;
    if (s.a === 1) html = `$a=1$：$y=1^x=1$，图象是一条水平直线——<b>不是</b>指数函数。`;
    else if (s.a > 1) html = `$a=${fmt(s.a)}\\gt 1$：图象<b>上升</b>，$y=a^x$ 是增函数。`;
    else html = `$0\\lt a=${fmt(s.a)}\\lt 1$：图象<b>下降</b>，$y=a^x$ 是减函数。`;
    if ($('mirror').checked && s.a !== 1) html += `　绿线 $y=\\left(\\frac1a\\right)^x$ 与它关于 $y$ 轴对称。`;
    msg.innerHTML = html;
    msg.className = `tip feedback ${s.a === 1 ? 'fb-warn' : 'fb-ok'}`;
    tex(msg);
  };
  document.querySelectorAll('[data-a]').forEach((btn) => btn.addEventListener('click', () => { s.a = +btn.dataset.a; b.update(); }));
  $('mirror').addEventListener('change', () => b.update());
  b.update();
}

/* 第 6 页：表 6-2-1 里的两幅小图 */
function initTableFig(id, a) {
  const b = board($(id), { x: [-2.5, 2.5], y: [-0.6, 4], w: 320, h: 220, ticks: [1, 1], tickLabels: false, grid: false });
  b.seg([[-2.5, 1], [2.5, 1]], { cls: 'dash' });
  b.fn((x) => a ** x, { cls: 'c1' });
  b.pt([0, 1], { r: 6 });
  b.text([0, 1], '1', { cls: 'lb up', dx: -22, dy: -8 });
  b.text([1, 0], '1', { cls: 'lb up', dx: -6, dy: 24 });
  b.text([0, 0], 'O', { cls: 'lb', dx: -22, dy: 24 });
  b.text([a > 1 ? -2.4 : 0.9, 2.6], a > 1 ? 'y=aˣ (a>1)' : 'y=aˣ (0<a<1)', { cls: 'lb up' });
  b.update();
}

/* 第 7 页：y = 2^x 与 y = (1/2)^x 关于 y 轴对称 */
function initSym() {
  const s = { m: 1.5 };
  const b = board($('sym'), { x: [-3.2, 3.2], y: [-0.5, 8.5], w: 520, h: 480, ticks: [1, 1] });
  b.fn((x) => 2 ** x, { cls: 'c1' });
  b.fn((x) => 0.5 ** x, { cls: 'c3' });
  b.seg(() => [[-s.m, 2 ** s.m], [s.m, 2 ** s.m]], { cls: 'dash' });
  b.pt(() => [-s.m, 2 ** s.m], { hollow: true, r: 8 });
  b.text(() => [s.m, 2 ** s.m], () => `P(${fmt(s.m)}, ${fmt(2 ** s.m)})`, { cls: 'lb up', dx: 14, dy: 22 });
  b.text(() => [-s.m, 2 ** s.m], () => `P′(${fmt(-s.m)}, ${fmt(2 ** s.m)})`, { cls: 'lb up', dx: -150, dy: 22 });
  b.text([2.2, 7.6], 'y=2ˣ', { cls: 'lb up' });
  b.text([-3.1, 7.6], 'y=(½)ˣ', { cls: 'lb up' });
  b.drag(() => [s.m, 2 ** s.m], (x) => { s.m = Math.round(Math.min(3, Math.max(-3, x)) * 20) / 20; });
  b.update();
}

/* 第 10 页：例 3 平移 */
function initShift() {
  const s = { h: 0 };
  const b = board($('shift'), { x: [-5, 4.5], y: [-0.5, 8.5], w: 560, h: 480, ticks: [1, 1] });
  b.fn((x) => 2 ** x, { cls: 'thin' });
  b.fn((x) => 2 ** (x + s.h), { cls: 'c1' });
  b.seg(() => [[0, 1], [-s.h, 1]], { cls: 'c2' });
  b.seg(() => [[2, 4], [2 - s.h, 4]], { cls: 'c2' });
  b.pt([0, 1], { r: 6 }); b.pt([2, 4], { r: 6 }); b.pt(() => [2 - s.h, 4], { cls: 'c2', r: 7 });
  b.text([2.3, 7.8], 'y=2ˣ', { cls: 'lb up' });
  b.text(() => [-s.h, 1], () => (s.h ? `平移 ${fmt(Math.abs(s.h))}` : ''), { cls: 'lb up', dx: s.h > 0 ? -10 : 10, dy: -14 });
  b.drag(() => [-s.h, 1], (x) => { s.h = -Math.round(Math.min(3, Math.max(-3, x)) * 10) / 10; });
  b.onUpdate = () => {
    document.querySelectorAll('[data-h]').forEach((btn) => btn.classList.toggle('solid', +btn.dataset.h === s.h));
  };
  document.querySelectorAll('[data-h]').forEach((btn) => btn.addEventListener('click', () => { s.h = +btn.dataset.h; b.update(); }));
  b.update();
  // 表 6-2-2：同一个函数值用同一种底色
  const cell = (e) => `<td class="${e >= -2 && e <= 0 ? `e${-e}` : ''}">$2^{${e}}$</td>`;
  $('shTab').innerHTML = '<tr><th>$x$</th><th>$y=2^{x-2}$</th><th>$y=2^x$</th><th>$y=2^{x+2}$</th></tr>'
    + [-4, -3, -2, -1, 0, 1, 2].map((x) => `<tr><td>${x}</td>${cell(x - 2)}${cell(x)}${cell(x + 2)}</tr>`).join('');
  tex($('shTab'));
}

/* 第 11 页：复利计算器（例 5 的数据） */
function initComp() {
  const A = 1000;
  const R = 0.0225;
  const s = { x: 5 };
  const y = (x) => A * (1 + R) ** x;
  const b = board($('comp'), { x: [0, 31], y: [-150, 2100], w: 520, h: 260, ticks: [5, 500], labels: ['x/期', 'y/元'] });
  b.seg([[0, 1500], [31, 1500]], { cls: 'dash' });
  b.text([0.5, 1500], '1 500', { cls: 'lb up', dy: -8 });
  Array.from({ length: 30 }, (_, i) => i + 1).forEach((x) => b.pt([x, y(x)], { r: 4 }));
  b.pt(() => [s.x, y(s.x)], { cls: 'c2', r: 8 });
  b.update();
  slider($('cx'), (v) => {
    s.x = v;
    $('cxV').textContent = v;
    const val = y(v);
    const msg = $('cMsg');
    msg.innerHTML = `$1\\,000\\times 1.022\\,5^{${v}}\\approx ${fmt(val, 2)}$ 元，是本金的 ${fmt(val / A, 3)} 倍${val > 1.5 * A ? '，<b>已超过 1.5 倍</b>' : ''}。`;
    msg.className = `tip feedback ${val > 1.5 * A ? 'fb-ok' : ''}`;
    tex(msg);
    b.update();
  });
}

/* 第 12 页：例 6 读图 */
function initGdp() {
  const s = { x: 16 };
  const f = (x) => 1.078 ** x;
  const b = board($('gdp'), { x: [-0.8, 21], y: [-0.7, 5.5], w: 520, h: 330, ticks: [2, 1] });
  b.fn(f, { from: 0, to: 21 });
  b.seg(() => [[s.x, 0], [s.x, f(s.x)]], { cls: 'dash' });
  b.seg(() => [[0, f(s.x)], [s.x, f(s.x)]], { cls: 'dash' });
  b.drag(() => [s.x, f(s.x)], (x) => { s.x = Math.round(Math.min(20, Math.max(0, x))); });
  b.onUpdate = () => { $('gdpV').innerHTML = `$x=${s.x}$（${2000 + s.x} 年），$y=1.078^{${s.x}}\\approx ${fmt(f(s.x), 2)}$`; tex($('gdpV')); };
  b.update();
}

window.LESSON = {
  init() {
    initStick();
    initBase();
    initTableFig('tA', 2);
    initTableFig('tB', 0.5);
    initSym();
    initShift();
    initComp();
    initGdp();
  },
};
