'use strict';
/* 八上 6.6 一次函数、一元一次方程和一元一次不等式 · 本课互动：弹簧（图 6-18）、拖交点看解集（图 6-19 + 数轴）、
 * 汽车路程条、练习图像、行李费（习题 4）。所有图形由表达式精确计算。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const neg = (v) => (v < 0 ? `(${fmt(v)})` : fmt(v));

/* ---------- 第 3 页：弹簧 y = 0.5x + 25 ---------- */
function initSpring() {
  const s = { x: 8 };
  const f = (x) => 0.5 * x + 25;
  const U = 7; // 1 cm = 7 单位
  const b = board($('sprBoard'), { x: [-3, 27], y: [-4, 44], w: 420, h: 440, ticks: [5, 10], labels: ['x', 'y'] });
  b.fn(f, { cls: 'c1', from: 0, to: 20 });
  b.seg([[0, 35], [20, 35]], { cls: 'dash' });
  b.seg([[20, 0], [20, 35]], { cls: 'dash' });
  b.text([4, 39], 'y = 0.5x + 25', { cls: 'lb up' });
  b.pt(() => [s.x, f(s.x)], { cls: 'c2', r: 7, show: () => s.x <= 20 });
  b.pt(() => [s.x, f(s.x)], { r: 7, hollow: true, show: () => s.x > 20 });
  const draw = () => {
    const len = f(s.x) * U;
    const [cx, y0] = [45, 8];
    const y1 = y0 + len;
    const n = 14;
    const coil = Array.from({ length: n + 1 }, (_, i) => `${cx + (i === 0 || i === n ? 0 : i % 2 ? 12 : -12)},${y0 + 8 + ((len - 16) * i) / n}`).join(' ');
    const box = s.x ? 12 + s.x * 0.6 : 0;
    const over = s.x > 20;
    $('sprSvg').innerHTML = '<rect x="5" y="0" width="80" height="8" fill="#9fb0bf"/>'
      + [0, 5, 10, 15, 20, 25, 30, 35].map((c) => `<line x1="88" x2="94" y1="${y0 + c * U}" y2="${y0 + c * U}" stroke="#6f8191"/><text x="96" y="${y0 + c * U + 4}" font-size="10" fill="#6f8191">${c}</text>`).join('')
      + `<line x1="88" x2="88" y1="${y0}" y2="${y0 + 35 * U}" stroke="#6f8191"/><line x1="5" x2="95" y1="${y0 + 35 * U}" y2="${y0 + 35 * U}" stroke="#c0392b" stroke-dasharray="4 3"/>`
      + `<polyline points="${cx},${y0} ${coil} ${cx},${y1}" fill="none" stroke="${over ? '#c0392b' : '#1d6fa5'}" stroke-width="2.5"/>`
      + (s.x ? `<rect x="${cx - box / 2}" y="${y1}" width="${box}" height="${box * 0.7}" rx="3" fill="#d9711c"/>` : '');
    $('sprXV').textContent = s.x;
    const msg = $('sprMsg');
    msg.className = `tip feedback ${over ? 'fb-warn' : 'fb-ok'}`;
    msg.innerHTML = over
      ? `$x=${s.x}$：$y=${fmt(f(s.x))}\\gt35$，超出了弹簧允许的限度！`
      : `$x=${s.x}$：$y=0.5\\times${s.x}+25=${fmt(f(s.x))}$（cm）${s.x === 20 ? '——正好到 35 cm' : ''}`;
    tex(msg);
    b.update();
  };
  MathKit.slider($('sprX'), (v) => { s.x = v; draw(); });
}

/* ---------- 第 4 页：拖交点看解集 ---------- */
function initIneq() {
  const s = { c: 0 };
  const f = (x) => 2 * x + 4;
  const xp = () => (s.c - 4) / 2;
  const box = { x: [-5.6, 3.6], y: [-2.6, 8.6] };
  const b = board($('ineqBoard'), { ...box, w: 460, h: 556, ticks: 1 });
  b.fn(f, { cls: 'c3', from: () => xp(), to: 3.6 });
  b.fn(f, { cls: 'c2', from: -5.6, to: () => xp() });
  b.seg(() => [[-5.6, s.c], [3.6, s.c]], { cls: 'dash' });
  b.seg(() => [[xp(), s.c], [xp(), -2.6]], { cls: 'dash' });
  b.text([1.7, 6.6], 'y = 2x + 4', { cls: 'lb up' });
  b.text(() => [2.3, s.c], () => `y = ${fmt(s.c)}`, { cls: 'lb up', dy: -8 });
  b.text(() => [xp(), s.c], () => `P(${fmt(xp())}, ${fmt(s.c)})`, { cls: 'lb up', dx: -118, dy: -12 });
  b.drag(() => [0, s.c], (x, y) => { s.c = clamp(snap(y, 0.5), -2, 8); sync(); }, { r: 7 });
  b.drag(() => [xp(), s.c], (x) => { s.c = clamp(2 * snap(x, 0.25) + 4, -2, 8); sync(); });
  // 数轴：与上图横坐标对齐
  const n = board($('nlBoard'), { x: box.x, y: [-1, 1], w: 460, h: 100, axes: false, grid: false });
  n.seg([[-5.6, 0], [3.6, 0]], { cls: 'thin' });
  for (let k = -5; k <= 3; k++) { n.seg([[k, -0.15], [k, 0.15]], { cls: 'thin' }); n.text([k, -0.2], String(k).replace('-', '−'), { cls: 'tk', dy: 18 }); }
  n.seg(() => [[xp(), 0.35], [3.5, 0.35]], { cls: 'c3' });
  n.seg(() => [[-5.5, -0.35], [xp(), -0.35]], { cls: 'c2' });
  n.pt(() => [xp(), 0.35], { r: 6, hollow: true });
  n.pt(() => [xp(), -0.35], { r: 6, hollow: true });
  n.text(() => [3.5, 0.35], '>', { cls: 'lb up', dx: 4, dy: 6 });
  n.text(() => [-5.5, -0.35], '<', { cls: 'lb up', dx: -14, dy: 6 });
  function sync() {
    const r = b.svg.getBoundingClientRect();
    const w = Math.min(r.width, (r.height * b.W) / b.H); // meet 缩放后实际画面宽度
    if (w) $('nlBoard').style.width = `${w}px`;
    n.update();
    const x = xp();
    $('ineqTab').innerHTML = `<tr><th></th><th>解</th><th>图像</th></tr>`
      + `<tr><td>$2x+4=${fmt(s.c)}$</td><td>$x=${fmt(x)}$</td><td>交点 $P$ 的横坐标</td></tr>`
      + `<tr><td class="g">$2x+4\\gt${neg(s.c)}$</td><td class="g">$x\\gt${fmt(x)}$</td><td class="g">直线在 $y=${fmt(s.c)}$ 上方</td></tr>`
      + `<tr><td class="r">$2x+4\\lt${neg(s.c)}$</td><td class="r">$x\\lt${fmt(x)}$</td><td class="r">直线在 $y=${fmt(s.c)}$ 下方</td></tr>`;
    tex($('ineqTab'));
  }
  b.onUpdate = sync;
  $('ineqBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-c]');
    if (!btn) return;
    s.c = +btn.dataset.c;
    $('ineqBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
  return () => { b.update(); n.update(); };
}

/* ---------- 第 6 页：汽车 s = 105x + 35 ---------- */
function initCar() {
  const X = (km) => 20 + km * 0.9; // 665 km 画成 598 px
  const draw = (x) => {
    const sKm = 105 * x + 35;
    $('carSvg').innerHTML = `<rect x="${X(0)}" y="30" width="${X(665) - X(0)}" height="14" rx="4" fill="#e3e7ea"/>`
      + `<rect x="${X(0)}" y="30" width="${X(35) - X(0)}" height="14" fill="#9fb0bf"/><rect x="${X(35)}" y="30" width="${X(sKm) - X(35)}" height="14" fill="#1d6fa5"/>`
      + [0, 100, 200, 300, 400, 500, 600].map((k) => `<line x1="${X(k)}" x2="${X(k)}" y1="46" y2="52" stroke="#6f8191"/><text x="${X(k)}" y="66" font-size="12" text-anchor="middle" fill="#6f8191">${k}</text>`).join('')
      + `<text x="${X(0)}" y="22" font-size="12" fill="#556575">普通公路 35 km</text><circle cx="${X(sKm)}" cy="37" r="9" fill="#d9711c"/><text x="${X(665)}" y="66" font-size="12" text-anchor="end" fill="#6f8191" dx="14">km</text>`;
    $('carXV').textContent = fmt(x);
    const msg = $('carMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$x=${fmt(x)}$：$s=105\\times${fmt(x)}+35=${fmt(sKm)}$（km）`;
    tex(msg);
  };
  MathKit.slider($('carX'), draw);
}

/* ---------- 第 7 页：练习 1 y = −2x + 2 ---------- */
function initP1() {
  const b = board($('p1Board'), { x: [-2.6, 3.6], y: [-3.6, 4.6], w: 400, h: 520, ticks: 1 });
  b.fn((x) => -2 * x + 2, { cls: 'c3', from: -2.6, to: 1 });
  b.fn((x) => -2 * x + 2, { cls: 'c2', from: 1, to: 3.6 });
  b.pt([1, 0], { r: 6 });
  b.text([1, 0], '(1, 0)', { cls: 'lb up', dx: 8, dy: -10 });
  b.text([0.4, 4.1], 'y = −2x + 2', { cls: 'lb up' });
  b.update();
}

/* ---------- 第 9 页：行李费 ---------- */
function initLuggage() {
  const s = { x: 50 };
  const f = (x) => 0.2 * x - 2;
  const b = board($('lugBoard'), { x: [-6, 98], y: [-2.5, 19], w: 520, h: 420, ticks: [10, 2], labels: ['x', 'y'] });
  b.poly([[30, 4], [85, 4], [85, 15], [30, 15]], { cls: 'fill1' }).setAttribute('style', 'fill: rgba(47,125,107,.1); stroke: none');
  b.seg([[0, 4], [96, 4]], { cls: 'dash' });
  b.seg([[0, 15], [96, 15]], { cls: 'dash' });
  b.fn(f, { cls: 'c1', from: 10, to: 96 });
  [[40, 6], [60, 10]].forEach((p) => { b.pt(p, { r: 5 }); b.seg([[p[0], 0], p], { cls: 'dash' }); b.seg([[0, p[1]], p], { cls: 'dash' }); });
  b.seg([[30, 0], [30, 4]], { cls: 'stair2' });
  b.seg([[85, 0], [85, 15]], { cls: 'stair2' });
  b.pt([10, 0], { r: 5 });
  b.text([10, 0], '10', { cls: 'lb up', dx: -6, dy: 22 });
  b.drag(() => [s.x, f(s.x)], (x) => { s.x = clamp(snap(x, 1), 10, 95); });
  b.onUpdate = () => {
    const y = f(s.x);
    const ok = y >= 4 && y <= 15;
    const msg = $('lugMsg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `$x=${s.x}$ kg：$y=0.2\\times${s.x}-2=${fmt(y)}$ 元${ok ? '，在 4～15 元之间 ✓' : '，不在 4～15 元之间'}`;
    tex(msg);
  };
  b.update();
}

let redraws = [];
window.LESSON = {
  init() {
    initSpring();
    redraws = [initIneq()];
    initCar();
    initP1();
    initLuggage();
  },
  onRender() { requestAnimationFrame(() => redraws.forEach((r) => r())); },
};
