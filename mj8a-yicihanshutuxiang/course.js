'use strict';
/* 八上 6.3 一次函数的图像 · 本课互动：燃香描点、描点加密、两点法、练习核对、上升/下降、k·b 实验室、平移、看图定符号。
 * 所有直线按表达式精确绘制（MathKit.board）。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const lin = (k, b) => (x) => k * x + b;

/** 带箭头的线段：在画板 svg 里加一个 marker */
function arrowSeg(b, get, color = '#2f7d6b') {
  const id = `arr${Math.random().toString(36).slice(2, 8)}`;
  b.svg.insertAdjacentHTML('afterbegin', `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker></defs>`);
  const l = b.seg(get, { cls: 'stair2' });
  l.setAttribute('marker-end', `url(#${id})`);
  return l;
}
/** 写 y = kx + b（k、b 着色） */
function lineTex(k, b, color = true) {
  const K = color ? (v) => `\\color{#d9711c}{${v}}` : (v) => v;
  const B = color ? (v) => `\\color{#2f7d6b}{${v}}` : (v) => v;
  const kx = k === 1 ? 'x' : k === -1 ? '-x' : `${K(fmt(k))}x`;
  if (b === 0) return `y=${kx}`;
  return `y=${kx}${b > 0 ? '+' : '-'}${B(fmt(Math.abs(b)))}`;
}

/* ---------- 第 3 页：燃香 y = −0.8x + 16 ---------- */
function initIncense() {
  const s = { x: 0, line: false };
  const f = lin(-0.8, 16);
  const XS = [0, 5, 10, 15, 20];
  const b = board($('incBoard'), { x: [-2, 23], y: [-2, 18.5], w: 520, h: 380, ticks: [5, 5], labels: ['x', 'y'] });
  const ln = b.seg([[0, 16], [20, 0]], { cls: 'c1' });
  XS.forEach((t) => {
    b.seg(() => (s.x >= t ? [[t, 0], [t, f(t)]] : [[0, 0], [0, 0]]), { cls: 'dash' });
    b.pt([t, f(t)], { cls: 'red', r: 6, show: () => s.x >= t });
    b.text(() => (s.x >= t ? [t, f(t)] : null), `(${t},${f(t)})`, { cls: 'lb up', dx: 6, dy: -10 });
  });
  b.pt(() => [s.x, f(s.x)], { cls: 'c2', r: 7 });
  // 课本 p148 图：香长按 cm 精确画（1 cm = 10 单位），香头处画火星
  const draw = () => {
    const y = f(s.x);
    const base = 190;
    $('incSvg').innerHTML = `<rect x="34" y="${base}" width="56" height="6" rx="3" fill="#d8c79a"/>`
      + Array.from({ length: 5 }, (_, i) => `<line x1="24" x2="30" y1="${base - i * 40}" y2="${base - i * 40}" stroke="#6f8191"/><text x="21" y="${base - i * 40 + 4}" font-size="11" text-anchor="end" fill="#6f8191">${i * 4}</text>`).join('')
      + `<line x1="30" x2="30" y1="${base}" y2="${base - 160}" stroke="#6f8191"/><text x="30" y="${base - 166}" font-size="11" text-anchor="middle" fill="#6f8191">cm</text>`
      + (y > 0 ? `<rect x="60" y="${base - y * 10}" width="4" height="${y * 10}" fill="#7a5a3a"/><circle cx="62" cy="${base - y * 10}" r="4" fill="#e25b2a"/>` : '')
      + `<line x1="30" x2="96" y1="${base - y * 10}" y2="${base - y * 10}" stroke="#d9711c" stroke-dasharray="3 3"/>`;
    $('incXV').textContent = s.x;
    $('incTab').innerHTML = `<tr><th>燃烧时间/min</th>${XS.map((t) => `<td class="${t === s.x ? 'on' : ''}">${t}</td>`).join('')}</tr>`
      + `<tr><th>香的长度/cm</th>${XS.map((t) => `<td class="${t === s.x ? 'on' : ''}">${s.x >= t ? f(t) : ''}</td>`).join('')}</tr>`;
    ln.style.display = s.line ? '' : 'none';
    b.update();
  };
  MathKit.slider($('incX'), (v) => { s.x = v; draw(); });
  $('incLine').addEventListener('click', () => { s.x = 20; $('incX').value = 20; s.line = true; draw(); });
}

/* ---------- 第 4 页：描点加密 ---------- */
function initDraw() {
  const s = { k: 2, c: 1, pts: [], line: false };
  const b = board($('drawBoard'), { x: [-3.6, 3.6], y: [-3.6, 5.6], w: 420, h: 530, ticks: 1 });
  const ln = b.fn((x) => s.k * x + s.c, { from: -3.6, to: 3.6, cls: 'c1' });
  const dots = b.svg.querySelector('g:last-of-type');
  const render = () => {
    ln.style.display = s.line ? '' : 'none';
    dots.querySelectorAll('.dyn').forEach((e) => e.remove());
    s.pts.forEach((x) => {
      const y = s.k * x + s.c;
      if (y < -3.6 || y > 5.6) return;
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('class', 'pt red dyn');
      c.setAttribute('cx', b.X(x)); c.setAttribute('cy', b.Y(y)); c.setAttribute('r', s.pts.length > 20 ? 4 : 7);
      dots.appendChild(c);
    });
    const xs = [-2, -1, 0, 1, 2];
    $('drawTab').innerHTML = `<tr><th>$x$</th><td>…</td>${xs.map((x) => `<td>${x}</td>`).join('')}<td>…</td></tr>`
      + `<tr><th>$y$</th><td>…</td>${xs.map((x) => `<td>${s.k * x + s.c}</td>`).join('')}<td>…</td></tr>`;
    tex($('drawTab'));
  };
  const range = (st) => Array.from({ length: Math.round(6 / st) + 1 }, (_, i) => +(-3 + i * st).toFixed(2));
  $('drawBtns').addEventListener('click', (e) => {
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (!a) return;
    if (a === 'swap') {
      [s.k, s.c] = s.k === 2 ? [-1, 2] : [2, 1];
      e.target.closest('[data-a]').innerHTML = s.k === 2 ? '换成 $y=-x+2$' : '换回 $y=2x+1$';
      tex(e.target.closest('[data-a]'));
      s.pts = [-2, -1, 0, 1, 2]; s.line = false;
    } else if (a === 'line') s.line = true;
    else s.pts = a === '5' ? [-2, -1, 0, 1, 2] : range(+a);
    b.update();
    render();
  });
  b.onUpdate = () => requestAnimationFrame(render);
  s.pts = [-2, -1, 0, 1, 2];
  b.update();
}

/* ---------- 第 5 页：例 y = −3x + 3（按步骤出现两点、直线） ---------- */
const EX = { step: 0, x: 0.5 };
let exBoard;
function initExample() {
  const f = lin(-3, 3);
  const b = board($('exBoard'), { x: [-2.6, 3.2], y: [-2.6, 4.6], w: 420, h: 520, ticks: 1 });
  b.fn(f, { cls: 'c1', from: () => -2.6, to: () => (EX.step >= 7 ? 3.2 : -2.6) });
  b.pt([0, 3], { cls: 'red', r: 6, show: () => EX.step >= 4 });
  b.text(() => (EX.step >= 4 ? [0, 3] : null), '(0, 3)', { cls: 'lb up', dx: 10, dy: -6 });
  b.pt([1, 0], { cls: 'red', r: 6, show: () => EX.step >= 6 });
  b.text(() => (EX.step >= 6 ? [1, 0] : null), '(1, 0)', { cls: 'lb up', dx: 8, dy: -10 });
  b.text(() => (EX.step >= 7 ? [1.9, -1.4] : null), 'y = −3x + 3', { cls: 'lb up' });
  b.seg(() => [[EX.x, 0], [EX.x, f(EX.x)]], { cls: 'dash' });
  b.drag(() => [EX.x, f(EX.x)], (x) => { EX.x = snap(clamp(x, -0.5, 2.5), 0.1); });
  b.onUpdate = () => {
    const msg = $('exMsg');
    const y = f(EX.x);
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `直线上的点 $(${fmt(EX.x, 1)},\\ ${fmt(y, 1)})$：$-3\\times(${fmt(EX.x, 1)})+3=${fmt(y, 1)}$ ✓`;
    tex(msg);
  };
  exBoard = b;
  b.update();
}

/* ---------- 第 6 页：练习 p150 ---------- */
function initP150() {
  const s = { q: 1 };
  const b = board($('p150Board'), { x: [-6.6, 4.8], y: [-6.6, 4.8], w: 460, h: 460, ticks: 1 });
  const q1 = () => s.q === 1;
  b.fn(lin(0.5, 3), { cls: 'c1', from: () => (q1() ? -6.6 : 0), to: () => (q1() ? 4.8 : 0) });
  b.fn(lin(-4, -5), { cls: 'c2', from: () => (q1() ? -6.6 : 0), to: () => (q1() ? 4.8 : 0) });
  b.fn(lin(2, 1), { cls: 'c1', from: () => (q1() ? 0 : -6.6), to: () => (q1() ? 0 : 4.8) });
  b.fn(lin(2, -1), { cls: 'c3', from: () => (q1() ? 0 : -6.6), to: () => (q1() ? 0 : 4.8) });
  b.pt([2, 4], { r: 6, show: q1 });
  b.text([2, 4], 'A(2, 4)', { cls: 'lb up', dx: 10, dy: 22 }).dataset.q = '1';
  b.pt([-0.5, -3], { r: 6, show: q1 });
  b.text([-0.5, -3], 'B(−½, −3)', { cls: 'lb up', dx: 10, dy: 6 }).dataset.q = '1';
  b.text([-6.3, 1.2], 'y = ½x + 3', { cls: 'lb up bl' }).dataset.q = '1';
  b.text([0.5, -6.1], 'y = −4x − 5', { cls: 'lb up o' }).dataset.q = '1';
  b.text([0.6, 4.2], 'y = 2x + 1', { cls: 'lb up bl' }).dataset.q = '2';
  b.text([2.2, 1.5], 'y = 2x − 1', { cls: 'lb up g' }).dataset.q = '2';
  b.onUpdate = () => b.svg.querySelectorAll('[data-q]').forEach((t) => { t.style.display = +t.dataset.q === s.q ? '' : 'none'; });
  $('p150Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-q]');
    if (!btn) return;
    s.q = +btn.dataset.q;
    $('p150Btns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* ---------- 第 7 页：上升 / 下降（图 6-11、6-12） ---------- */
function initUpDown() {
  const make = (id, msgId, k, c, label, x0) => {
    const s = { x: x0, last: x0 };
    const f = lin(k, c);
    const b = board($(id), { x: [-5.6, 5.6], y: [-5.6, 5.6], w: 400, h: 400, ticks: 1 });
    b.fn(f, { cls: 'c1' });
    b.pt([-2, 0], { r: 5 });
    b.pt([0, c], { r: 5 });
    b.text([0, c], `(0,${c})`, { cls: 'lb up', dx: 8, dy: k > 0 ? 4 : 16 });
    b.text([-2, 0], '(−2,0)', { cls: 'lb up', dx: -52, dy: -10 });
    b.text(k > 0 ? [1.2, 4.6] : [-5.3, -4.6], label, { cls: 'lb up' });
    b.seg(() => [[s.x, 0], [s.x, f(s.x)]], { cls: 'dash' });
    b.seg(() => [[0, f(s.x)], [s.x, f(s.x)]], { cls: 'dash' });
    b.drag(() => [s.x, f(s.x)], (x) => { s.last = s.x; s.x = snap(clamp(x, -4, 4), 0.5); });
    b.onUpdate = () => {
      const msg = $(msgId);
      const y = f(s.x);
      const dir = s.x === s.last ? '' : s.x > s.last ? `$x$ 增大，$y$ <b>${k > 0 ? '增大' : '减小'}</b>` : `$x$ 减小，$y$ ${k > 0 ? '减小' : '增大'}`;
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = `$x=${fmt(s.x)}$，$y=${fmt(y)}$　${dir}`;
      tex(msg);
    };
    b.update();
  };
  make('upBoard', 'upMsg', 2, 4, 'y = 2x + 4', -3);
  make('downBoard', 'downMsg', -1.5, -3, 'y = −³⁄₂x − 3', -3);
}

/* ---------- 第 8 页：k、b 实验室（核心） ---------- */
function initKB() {
  const s = { k: 2, b: 1 };
  const B = board($('kbBoard'), { x: [-5.6, 5.6], y: [-5.6, 5.6], w: 520, h: 520, ticks: 1 });
  B.fn((x) => s.k * x, { cls: 'ghost' });
  B.fn((x) => s.k * x + s.b, { cls: 'c1' });
  // 台阶：从 (x0, y0) 向右 1，再竖直变化 k
  const x0 = () => (s.k > 0 ? 1 : 1);
  B.seg(() => [[x0(), s.k * x0() + s.b], [x0() + 1, s.k * x0() + s.b]], { cls: 'stair' });
  B.seg(() => [[x0() + 1, s.k * x0() + s.b], [x0() + 1, s.k * (x0() + 1) + s.b]], { cls: 'stair' });
  B.text(() => [x0() + 0.5, s.k * x0() + s.b], '1', { cls: 'lb up c k', dy: s.k > 0 ? 20 : -8 });
  B.text(() => [x0() + 1, s.k * x0() + s.b + s.k / 2], () => `k = ${fmt(s.k)}`, { cls: 'lb up k', dx: 8, dy: 6 });
  arrowSeg(B, () => [[0, 0], [0, s.b]]);
  B.pt(() => [0, s.b], { cls: 'c3', r: 7 });
  B.text(() => [0, s.b], () => `(0, ${fmt(s.b)})`, { cls: 'lb up b', dx: -70, dy: s.b >= 0 ? -8 : 20 });
  B.onUpdate = () => {
    $('kbKV').textContent = fmt(s.k);
    $('kbBV').textContent = fmt(s.b);
    $('kbF').innerHTML = s.k === 0 ? `$y=${fmt(s.b)}$` : `$${lineTex(s.k, s.b)}$`;
    const msg = $('kbMsg');
    if (s.k === 0) {
      msg.className = 'tip feedback fb-warn';
      msg.innerHTML = '$k=0$：$y=b$ 是一条水平线，<b>不是一次函数</b>（定义要求 $k\\ne0$）．';
    } else {
      msg.className = 'tip feedback fb-ok';
      msg.innerHTML = `$k${s.k > 0 ? '\\gt' : '\\lt'}0$：从左向右<b>${s.k > 0 ? '上升' : '下降'}</b>；由虚线 $y=${s.k === 1 ? '' : s.k === -1 ? '-' : fmt(s.k)}x$ 向${s.b >= 0 ? '上' : '下'}平移 $${fmt(Math.abs(s.b))}$ 个单位．`;
    }
    tex($('kbF')); tex(msg);
  };
  MathKit.slider($('kbK'), (v) => { s.k = v; B.update(); });
  MathKit.slider($('kbB'), (v) => { s.b = v; B.update(); });
  tex($('kbPre'));
  $('kbPre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = +btn.dataset.k; s.b = +btn.dataset.b;
    $('kbK').value = s.k; $('kbB').value = s.b;
    B.update();
  });
  return () => B.update();
}

/* ---------- 第 10 页：平移（图 6-13） ---------- */
function initShift() {
  const s = { x: 1, d: null, timer: 0 };
  const B = board($('shiftBoard'), { x: [-4.6, 4.6], y: [-6.6, 6.6], w: 400, h: 574, ticks: 1 });
  B.fn(lin(2, 3), { cls: 'c2' });
  B.fn(lin(2, 0), { cls: 'c1' });
  B.fn(lin(2, -3), { cls: 'c3' });
  B.fn((x) => 2 * x + (s.d ?? 0), { cls: 'c4', from: () => (s.d === null ? 0 : -4.6), to: () => (s.d === null ? 0 : 4.6) });
  B.text([-3.4, 5.6], 'y₂ = 2x + 3', { cls: 'lb up o' });
  B.text([3.0, 5.6], 'y₁ = 2x', { cls: 'lb up bl' });
  B.text([3.0, 1.2], 'y₃ = 2x − 3', { cls: 'lb up g' });
  B.seg(() => [[s.x, -6.6], [s.x, 6.6]], { cls: 'dash' });
  arrowSeg(B, () => [[s.x, 2 * s.x], [s.x, 2 * s.x + 3]]);
  arrowSeg(B, () => [[s.x, 2 * s.x], [s.x, 2 * s.x - 3]]);
  [3, 0, -3].forEach((c) => B.pt(() => [s.x, 2 * s.x + c], { r: 6 }));
  B.text(() => [s.x, 2 * s.x + 1.5], '+3', { cls: 'lb up b', dx: 8 });
  B.text(() => [s.x, 2 * s.x - 1.5], '−3', { cls: 'lb up b', dx: 8 });
  MathKit.slider($('shX'), (v) => { s.x = v; $('shXV').textContent = fmt(v); B.update(); });
  $('shPlay').addEventListener('click', () => {
    cancelAnimationFrame(s.timer);
    const t0 = performance.now();
    const tick = (t) => {
      const u = (t - t0) / 1000; // 0–2 s 上移到 +3，2–2.5 s 停，2.5–5.5 s 下移到 −3，再停 1 s
      s.d = u < 2 ? 1.5 * u : u < 2.5 ? 3 : u < 5.5 ? 3 - 2 * (u - 2.5) : -3;
      B.update();
      if (u < 6.5) s.timer = requestAnimationFrame(tick); else { s.d = null; B.update(); }
    };
    s.timer = requestAnimationFrame(tick);
  });
  return () => B.update();
}

/* ---------- 第 11 页：y = 2x − 4 ---------- */
function initP153() {
  const s = { x: 3.5 };
  const f = lin(2, -4);
  const B = board($('p153Board'), { x: [-1.6, 4.6], y: [-5.6, 4.6], w: 380, h: 520, ticks: 1 });
  B.fn(f, { cls: 'c3', from: 2, to: 4.6 });
  B.fn(f, { cls: 'c2', from: -1.6, to: 2 });
  B.pt([2, 0], { r: 6 });
  B.text([2, 0], '(2, 0)', { cls: 'lb up', dx: 8, dy: 22 });
  B.seg(() => [[s.x, 0], [s.x, f(s.x)]], { cls: 'dash' });
  B.seg(() => [[0, f(s.x)], [s.x, f(s.x)]], { cls: 'dash' });
  B.drag(() => [s.x, f(s.x)], (x) => { s.x = snap(clamp(x, -0.5, 4.2), 0.5); });
  B.onUpdate = () => {
    const y = f(s.x);
    const msg = $('p153Msg');
    msg.className = `tip feedback ${y >= 0 ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `$x=${fmt(s.x)}$，$y=${fmt(y)}$：${y > 0 ? '图像在 $x$ 轴上方，$y\\gt0$' : y === 0 ? '图像与 $x$ 轴相交，$y=0$' : '图像在 $x$ 轴下方，$y\\lt0$'}`;
    tex(msg);
  };
  B.update();
}

/* ---------- 第 12 页：习题 4 四个图像 ---------- */
const SIGNS = [[1, 1.2], [-1, 1.5], [0.4, -0.8], [-2.5, -1.5]];
function initSigns() {
  const host = $('signs');
  SIGNS.forEach(([k, c], i) => {
    const cell = document.createElement('div');
    cell.innerHTML = `<div class="m"></div><div class="pick" data-ans="${k > 0 ? 'kp' : 'kn'}"><button data-k="kp">k&gt;0</button><button data-k="kn">k&lt;0</button></div><div class="pick" data-ans="${c > 0 ? 'bp' : 'bn'}"><button data-k="bp">b&gt;0</button><button data-k="bn">b&lt;0</button></div>`;
    host.appendChild(cell);
    const b = board(cell.querySelector('.m'), { x: [-3.2, 3.2], y: [-2.6, 2.6], w: 300, h: 240, ticks: 0, tickLabels: false });
    b.fn(lin(k, c), { cls: 'c1' });
    b.text([2.6, 2.1], '①②③④'[i], { cls: 'lb up' });
    b.update();
  });
  MCheck.init(host);
}

/* ---------- 第 13 页：习题 2 两个图像 ---------- */
function initFromGraph() {
  const host = $('fromGraph');
  [[4 / 7, 0, [3.5, 2], '(3.5, 2)'], [-1, 1, [1, 0], '']].forEach(([k, c, p, lab], i) => {
    const cell = document.createElement('div');
    cell.className = 'm';
    host.appendChild(cell);
    const b = board(cell, { x: [-2.6, 5.4], y: [-2.6, 3.4], w: 400, h: 300, ticks: 1, tickLabels: false });
    b.fn(lin(k, c), { cls: 'c1' });
    b.text([0, 1], '1', { cls: 'lb up', dx: -16, dy: 6 });
    b.text([1, 0], '1', { cls: 'lb up', dx: -4, dy: 20 });
    if (lab) {
      b.seg([[0, 2], p], { cls: 'dash' }); b.seg([[3.5, 0], p], { cls: 'dash' });
      b.pt(p, { r: 5 }); b.text(p, lab, { cls: 'lb up', dx: 6, dy: -8 });
    }
    b.text([4.4, 2.8], '①②'[i], { cls: 'lb up' });
    b.update();
  });
}

let redraws = [];
window.LESSON = {
  init() {
    initIncense();
    initDraw();
    initExample();
    initP150();
    initUpDown();
    redraws = [initKB(), initShift()];
    initP153();
    initSigns();
    initFromGraph();
  },
  onRender(slide, step) {
    if (slide.querySelector('#exBoard')) { EX.step = step; exBoard.update(); }
    requestAnimationFrame(() => redraws.forEach((r) => r()));
  },
};
