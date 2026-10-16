'use strict';
/* 八上 6.1 函数 · 本课互动：火柴小鱼、变化观察器（表格/式子/图像同步）、y²=x 反例、汽车图像、潮位图、例 2 折线、练习 2 四个图像。
 * 通用部分见 ../shared/math.js；所有图形由数据计算绘制。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;

/* ---------- 火柴小鱼（图 6-1）：第 k 条鱼 = 菱形 4 根 + 上下鳍 2 根，第 1 条另有鱼尾 2 根 → S = 8 + 6(n − 1) ---------- */
const H = 0.6; // 火柴棒的竖直分量（单位：水平 1）
function fishSticks(n) {
  const sticks = [[[-1, H], [0, 0]], [[-1, -H], [0, 0]]]; // 鱼尾
  for (let k = 0; k < n; k++) {
    const x = 2 * k;
    sticks.push(
      [[x, 0], [x + 1, H]], [[x, 0], [x + 1, -H]], [[x + 1, H], [x + 2, 0]], [[x + 1, -H], [x + 2, 0]],
      [[x, 2 * H], [x + 1, H]], [[x, -2 * H], [x + 1, -H]],
    );
  }
  return sticks;
}
function drawFish(svg, n, maxN = n) {
  const U = 40;
  const X = (x) => (x + 1.2) * U;
  const Y = (y) => (1.45 - y) * U;
  svg.setAttribute('viewBox', `0 0 ${(2 * maxN + 1.6) * U} ${2.9 * U}`);
  svg.innerHTML = fishSticks(n).map(([[x1, y1], [x2, y2]]) => {
    // 火柴头画在终点一侧，杆身留出头的位置
    const [hx, hy] = [X(x2) - (X(x2) - X(x1)) * 0.1, Y(y2) - (Y(y2) - Y(y1)) * 0.1];
    return `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${hx}" y2="${hy}" stroke="#c99a5b" stroke-width="5" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="6" fill="#e0679a"/>`;
  }).join('');
}

/* ---------- 第 5 页：变化观察器 ---------- */
const OBS = [
  {
    key: 'fish', tab: '搭小鱼', x: 'n', y: 'S', min: 1, max: 8, step: 1, init: 3, xs: [1, 2, 3, 4, 5, 6],
    f: (n) => 8 + 6 * (n - 1), discrete: true,
    box: { x: [-0.7, 8.9], y: [-7, 62], w: 600, h: 330, ticks: [1, 10], labels: ['n', 'S'] },
    tex: (n, v) => `S=8+6(n-1)=8+6\\times(${n}-1)=${v}`,
    hint: '拖动橙色点：n 只能取正整数，图像是一个个点',
  },
  {
    key: 'circle', tab: '水波的圆', x: 'r', y: 'S', min: 0, max: 4, step: 0.1, init: 2, xs: [1, 2, 3, 4],
    f: (r) => Math.PI * r * r,
    box: { x: [-0.5, 4.6], y: [-6, 56], w: 600, h: 330, ticks: [1, 10], labels: ['r', 'S'] },
    tex: (r, v) => `S=\\pi r^2=\\pi\\times ${fmt(r, 1)}^2\\approx ${fmt(v, 1)}`,
    show: (v) => fmt(v, 2), hint: '拖动橙色点改变半径 r（π 取 3.14…）',
  },
  {
    key: 'car', tab: '汽车行驶', x: 't', y: 'y', min: 0, max: 6, step: 0.5, init: 2, xs: [1, 2, 3, 4],
    f: (t) => 100 * t,
    box: { x: [-0.5, 6.8], y: [-70, 660], w: 600, h: 330, ticks: [1, 100], labels: ['t/h', 'y/km'] },
    tex: (t, v) => `y=100t=100\\times ${fmt(t, 1)}=${fmt(v)}`,
    hint: '拖动橙色点改变行驶时间 t（h）',
  },
];

function sceneHtml(c, x, v) {
  if (c.key === 'fish') return '<svg id="obsFish" class="fish-fig"></svg>';
  if (c.key === 'circle') {
    const R = 9 * x; // 1 个单位 = 9 px
    return `<svg viewBox="0 0 220 80" class="scene-svg"><circle cx="110" cy="40" r="${R}" fill="rgba(79,155,208,.25)" stroke="#1d6fa5" stroke-width="2"/><line x1="110" y1="40" x2="${110 + R}" y2="40" stroke="#d9711c" stroke-width="2.5"/></svg>`;
  }
  const W = 200; // 600 km 画成 200 px
  return `<svg viewBox="0 0 220 60" class="scene-svg"><line x1="10" y1="40" x2="210" y2="40" stroke="#9fb0bf" stroke-width="3"/><line x1="10" y1="40" x2="${10 + (v / 600) * W}" y2="40" stroke="#d9711c" stroke-width="5"/><rect x="${(v / 600) * W}" y="24" width="20" height="12" rx="3" fill="#1d6fa5"/><text x="10" y="58" font-size="11" fill="#556575">甲地</text></svg>`;
}

function initObserver() {
  const st = { cur: OBS[0], x: Object.fromEntries(OBS.map((c) => [c.key, c.init])) };
  const holder = $('obsBoard');
  const boards = {};
  OBS.forEach((c) => {
    const el = document.createElement('div');
    el.className = 'obs-one';
    el.dataset.k = c.key;
    holder.appendChild(el);
    const b = board(el, c.box);
    const x = () => st.x[c.key];
    if (c.discrete) {
      for (let n = c.min; n <= c.max; n++) b.pt([n, c.f(n)], { r: 4 });
    } else {
      b.fn(c.f, { from: c.min, to: c.max });
    }
    b.seg(() => [[x(), 0], [x(), c.f(x())]], { cls: 'dash' });
    b.seg(() => [[0, c.f(x())], [x(), c.f(x())]], { cls: 'dash' });
    b.pt(() => [x(), c.f(x())], { cls: 'c2', r: 7 });
    b.drag(() => [x(), c.f(x())], (px) => { st.x[c.key] = +snap(clamp(px, c.min, c.max), c.step).toFixed(2); });
    b.onUpdate = () => { if (st.cur === c) render(); };
    boards[c.key] = b;
  });

  function render() {
    const c = st.cur;
    const x = st.x[c.key];
    const v = c.f(x);
    const show = c.show || ((y) => fmt(y));
    $('obsScene').innerHTML = sceneHtml(c, x, v);
    if (c.key === 'fish') drawFish($('obsFish'), x, c.max);
    $('obsTab').innerHTML = `<tr><th>$${c.x}$</th>${c.xs.map((a) => `<td class="${Math.abs(a - x) < 1e-9 ? 'on' : ''}">${a}</td>`).join('')}<td>…</td></tr>`
      + `<tr><th>$${c.y}$</th>${c.xs.map((a) => `<td class="${Math.abs(a - x) < 1e-9 ? 'on' : ''}">${show(c.f(a))}</td>`).join('')}<td>…</td></tr>`;
    $('obsF').innerHTML = `当 $${c.x}=${fmt(x, 1)}$ 时，$${c.tex(x, v)}$<br><b>${c.y} 只有一个值</b>，图上只有一个点 $(${fmt(x, 1)},\\ ${show(v)})$。`;
    $('obsHint').textContent = c.hint;
    tex($('obsTab')); tex($('obsF'));
  }

  $('obsTabs').innerHTML = OBS.map((c, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-k="${c.key}">${c.tab}</button>`).join('');
  const pick = (key) => {
    st.cur = OBS.find((c) => c.key === key);
    holder.querySelectorAll('.obs-one').forEach((el) => { el.hidden = el.dataset.k !== key; });
    $('obsTabs').querySelectorAll('.btn').forEach((btn) => btn.classList.toggle('solid', btn.dataset.k === key));
    boards[key].update();
    render();
  };
  $('obsTabs').addEventListener('click', (e) => { const btn = e.target.closest('[data-k]'); if (btn) pick(btn.dataset.k); });
  pick('fish');
  return () => boards[st.cur.key].update();
}

/* ---------- 第 7 页：y² = x ---------- */
function initSquare() {
  const s = { x: 4 };
  const b = board($('sqBoard'), { x: [-0.8, 10.4], y: [-3.6, 3.6], w: 520 });
  b.curve((t) => [t * t, t], -3.25, 3.25);
  b.seg(() => [[s.x, -3.6], [s.x, 3.6]], { cls: 'dash' });
  b.pt(() => [s.x, Math.sqrt(s.x)], { cls: 'c2', r: 8 });
  b.pt(() => [s.x, -Math.sqrt(s.x)], { cls: 'c2', r: 8, show: () => s.x > 0 });
  b.text(() => [s.x, Math.sqrt(s.x)], () => `(${s.x}, ${Math.sqrt(s.x)})`, { cls: 'lb up', dx: 10, dy: -8 });
  b.text(() => (s.x > 0 ? [s.x, -Math.sqrt(s.x)] : null), () => `(${s.x}, ${-Math.sqrt(s.x)})`, { cls: 'lb up', dx: 10, dy: 22 });
  b.onUpdate = () => {
    const r = Math.sqrt(s.x);
    const msg = $('sqMsg');
    msg.className = `tip feedback ${s.x > 0 ? 'fb-warn' : ''}`;
    msg.innerHTML = s.x > 0
      ? `$x=${s.x}$：$y=${r}$ 或 $y=-${r}$（$(\\pm${r})^2=${s.x}$），<b>两个</b> $y$。`
      : '$x=0$：只有 $y=0$。但只要有一个 $x$ 对应两个 $y$，就不是函数。';
    tex(msg);
  };
  $('sqBtns').innerHTML = [0, 1, 4, 9].map((v) => `<button type="button" class="btn${v === 4 ? ' solid' : ''}" data-x="${v}">$x=${v}$</button>`).join('');
  tex($('sqBtns'));
  $('sqBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-x]');
    if (!btn) return;
    s.x = +btn.dataset.x;
    $('sqBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* ---------- 第 8 页：汽车 y = 100t（图 6-3） ---------- */
function initCar() {
  const b = board($('carBoard'), { x: [-0.6, 7.6], y: [-70, 620], w: 420, h: 260, ticks: [1, 100], labels: ['t', 'y'] });
  b.fn((t) => 100 * t, { from: 0, to: 6 });
  [1, 2, 3, 4].forEach((t) => b.pt([t, 100 * t], { r: 4 }));
  b.update();
}

/* ---------- 第 10 页：潮位图（依课本图 6-4 逐小时读点，Catmull-Rom 样条连成光滑曲线） ---------- */
const TIDE = [[0, 2.14], [1, 2.0], [2, 1.56], [3, 1.2], [4, 0.95], [5, 0.86], [6, 1.03], [7, 1.22], [8, 1.46], [10, 1.87], [11, 2.0], [12, 2.04], [13, 1.86], [14, 1.56], [15, 1.25], [16, 0.93], [17, 0.72], [18, 0.7], [19, 0.87], [20, 1.2], [21, 1.5], [22, 1.75], [23, 1.96], [24, 2.23]];
function tideAt(t) {
  const n = TIDE.length;
  const after = TIDE.findIndex(([x]) => x > t);
  const i = Math.max(0, Math.min(n - 2, (after < 0 ? n : after) - 1));
  const y = (k) => TIDE[Math.max(0, Math.min(n - 1, k))][1];
  const u = (t - TIDE[i][0]) / (TIDE[i + 1][0] - TIDE[i][0]);
  const [p0, p1, p2, p3] = [y(i - 1), y(i), y(i + 1), y(i + 2)];
  return 0.5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (3 * p1 - p0 - 3 * p2 + p3) * u * u * u);
}
function initTide() {
  const s = { t: 12 };
  const b = board($('tideBoard'), { x: [-1.2, 26], y: [-0.35, 2.9], w: 620, h: 300, ticks: [2, 0.5], labels: ['t', 'y'] });
  b.fn(tideAt, { from: 0, to: 24, cls: 'c1' });
  b.seg(() => [[s.t, 0], [s.t, tideAt(s.t)]], { cls: 'dash' });
  b.seg(() => [[0, tideAt(s.t)], [s.t, tideAt(s.t)]], { cls: 'dash' });
  b.drag(() => [s.t, tideAt(s.t)], (x) => { s.t = snap(clamp(x, 0, 24), 0.5); });
  b.onUpdate = () => {
    const msg = $('tideMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$t=${fmt(s.t, 1)}$ 时，潮位 $y\\approx${fmt(tideAt(s.t), 1)}$ m——只读出<b>一个</b>值。`;
    tex(msg);
  };
  b.update();
}

/* ---------- 第 11 页：例 2 折线（图 6-5） ---------- */
const RIDE = [[0, 0], [2, 20], [4, 20], [7, 50]];
function rideAt(t) {
  const i = Math.max(0, RIDE.findIndex(([x], k) => k > 0 && t <= x) - 1);
  const [[x0, y0], [x1, y1]] = [RIDE[i], RIDE[i + 1]];
  return y0 + ((y1 - y0) * (t - x0)) / (x1 - x0);
}
function initRide() {
  const s = { t: 5 };
  const b = board($('rideBoard'), { x: [-0.6, 8.2], y: [-5, 58], w: 560, h: 330, ticks: [1, 10], labels: ['t', 's'] });
  b.fn(rideAt, { from: 0, to: 7, cls: 'c1' });
  b.seg([[2, 0], [2, 20]], { cls: 'dash' }); b.seg([[4, 0], [4, 20]], { cls: 'dash' }); b.seg([[7, 0], [7, 50]], { cls: 'dash' });
  b.text([5, 30], 'P(5, 30)', { cls: 'lb up', dx: 10, dy: 22 });
  b.pt([5, 30], { r: 5 });
  b.seg(() => [[s.t, 0], [s.t, rideAt(s.t)]], { cls: 'dash' });
  b.seg(() => [[0, rideAt(s.t)], [s.t, rideAt(s.t)]], { cls: 'dash' });
  b.drag(() => [s.t, rideAt(s.t)], (x) => { s.t = snap(clamp(x, 0, 7), 0.25); });
  b.onUpdate = () => {
    const v = rideAt(s.t);
    const stay = s.t > 2 && s.t < 4;
    const msg = $('rideMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$t=${fmt(s.t)}$ 时，$s=${fmt(v)}$：出发 ${fmt(s.t)} h，离甲地 ${fmt(v)} km${stay ? '（正在途中停留）' : ''}。`;
    tex(msg);
  };
  b.update();
}

/* ---------- 第 12 页：练习 2 的四个图像（按课本数据） ---------- */
const WALKS = [
  [[0, 0], [20, 900], [40, 900], [55, 0]],
  [[0, 0], [20, 900], [40, 0]],
  [[0, 0], [30, 900], [45, 0]],
  [[0, 0], [20, 900], [30, 900], [45, 0]],
];
function initWalk() {
  const host = $('walk4');
  WALKS.forEach((w, i) => {
    const cell = document.createElement('div');
    cell.className = 'walk-one';
    host.appendChild(cell);
    const b = board(cell, { x: [-6, 60], y: [-150, 1100], w: 300, h: 170, ticks: [10, 900], labels: ['t', 's'] });
    w.slice(1).forEach((p, k) => b.seg([w[k], p], { cls: 'c2' }));
    b.text([30, 1100], '①②③④'[i], { cls: 'lb up', dy: 22 });
    b.update();
  });
}

let redraw = () => {};
window.LESSON = {
  init() {
    drawFish($('fishStatic'), 3);
    redraw = initObserver();
    initSquare();
    initCar();
    initTide();
    initRide();
    initWalk();
  },
  onRender() { requestAnimationFrame(redraw); },
};
