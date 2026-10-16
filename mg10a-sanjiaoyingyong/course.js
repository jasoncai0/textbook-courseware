'use strict';
/* 高一上 7.4 三角函数应用 · 本课互动：振子同步动画 + 实时描图（核心 1）、例 2 水轮、
 * 港口/白昼数据拟合 A、b、T、φ 并显示残差（核心 2）、港口进港时段、卸货截止时刻。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const PI = Math.PI;
const TAU = 2 * PI;
const num = (v, d = 2) => fmt(v, d).replace('-', '−');

function piStr(v) {
  if (Math.abs(v) < 1e-9) return '0';
  for (const d of [1, 2, 3, 4, 6, 12]) {
    const n = Math.round((v / PI) * d);
    if (Math.abs((n * PI) / d - v) < 1e-6) {
      const a = Math.abs(n);
      return `${n < 0 ? '−' : ''}${a === 1 ? '' : a}π${d === 1 ? '' : `/${d}`}`;
    }
  }
  return num(v, 2);
}
/** 公式里的数：是 π 的简单倍数就写成 π 的形式 */
const texV = (v, d) => {
  const m = piStr(v).match(/^(−?)(\d*)π(?:\/(\d+))?$/);
  if (!m) return fmt(v, d);
  const top = `${m[2]}\\pi`;
  return `${m[1] ? '-' : ''}${m[3] ? `\\frac{${top}}{${m[3]}}` : top}`;
};
/** 小时数 → “h:mm” */
const clock = (h) => { const m = Math.round(h * 60); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; };
/** 二分法求 g 在 [a, b] 上的零点（g(a)、g(b) 异号） */
function root(g, a, b) {
  let [lo, hi] = [a, b];
  for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; }
  return (lo + hi) / 2;
}

/* ---------- 第 4 页（核心 1）：竖直弹簧振子与 x–t 图象同步；振子的位移与图象纵坐标同一高度 ---------- */
const OSC = {
  ex1: { A: 3, T: 3, phi: PI / 2, peaks: [0, 3, 6, 9, 12], tex: '3\\sin\\left(\\frac{2\\pi}3t+\\frac\\pi2\\right)', note: '例 1：t = 5 s 时 x = −1.5 cm' },
  p4: { A: 5, T: 4, phi: 0, peaks: [1, 5, 9], tex: '5\\sin\\frac\\pi2t', note: '练习 4：t = 7.5 s 时 x ≈ −3.54 cm' },
};
const OSC_X = -4; // 振子所在的横坐标（画板坐标）
const CEIL = 7.1;
const T_MAX = 12;
function initOsc() {
  const s = { k: 'ex1', t: 0, raf: 0, playing: false };
  const m = () => OSC[s.k];
  const pos = (t) => m().A * Math.sin((TAU / m().T) * t + m().phi);
  const b = board($('osc'), { x: [-7.2, 12.8], y: [-6.6, 7.7], w: 900, axes: false, grid: false, ticks: 0 });
  // 图象坐标系：t 轴就是平衡位置所在的水平线
  for (let t = 1; t <= T_MAX; t += 1) { b.seg([[t, -6.2], [t, 6.2]], { cls: 'grid' }); b.text([t, 0], String(t), { cls: 'tk', dx: -5, dy: 20 }); }
  [-5, -3, 3, 5].forEach((v) => { b.seg([[0, v], [T_MAX, v]], { cls: 'grid' }); b.text([0, v], num(v, 0), { cls: 'tk', dx: v < 0 ? -26 : -18, dy: 6 }); });
  b.seg([[-6.4, 0], [12.5, 0]], { cls: 'eq' });
  b.seg([[0, -6.3], [0, 6.6]], { cls: 'ax' });
  b.text([12.5, 0], 't/s', { cls: 'tk', dx: -24, dy: -10 });
  b.text([0, 6.6], 'x/cm', { cls: 'tk', dx: 8, dy: 10 });
  b.text([0, 0], 'O', { cls: 'tk', dx: -16, dy: 20 });
  b.text([-6.4, 0], '平衡位置', { cls: 'tk', dx: 0, dy: -8 });
  // 振幅与周期标注
  b.seg(() => [[m().peaks[1], 0], [m().peaks[1], m().A]], { cls: 'c3' });
  b.text(() => [m().peaks[1], m().A / 2], () => `A = ${m().A}`, { cls: 'lb up', dx: 8, dy: 6 });
  b.seg(() => [[m().peaks[1], m().A + 0.6], [m().peaks[2], m().A + 0.6]], { cls: 'c3' });
  b.text(() => [(m().peaks[1] + m().peaks[2]) / 2, m().A + 0.6], () => `T = ${m().T} s`, { cls: 'lb up', dx: -28, dy: -8 });
  // 振子：天花板、弹簧（锯齿）、物块
  b.seg([[OSC_X - 1.6, CEIL], [OSC_X + 1.6, CEIL]], { cls: 'ceil' });
  const COILS = 11;
  const tri = (u) => 2 * Math.abs(2 * ((u * COILS) % 1) - 1) - 1;
  b.curve((u) => { const bottom = pos(s.t) + 0.55; const y = CEIL - 0.4 - (CEIL - 0.4 - bottom) * u; const w = u < 0.04 || u > 0.96 ? 0 : 0.42 * tri(u); return [OSC_X + w, y]; }, 0, 1, { cls: 'spring', n: 300 });
  b.seg([[OSC_X, CEIL], [OSC_X, CEIL - 0.4]], { cls: 'spring' });
  b.poly(() => { const y = pos(s.t); return [[OSC_X - 0.75, y - 0.55], [OSC_X + 0.75, y - 0.55], [OSC_X + 0.75, y + 0.55], [OSC_X - 0.75, y + 0.55]]; }, { cls: 'block' });
  b.pt(() => [OSC_X, pos(s.t)], { r: 5 });
  // 描出的曲线、同一时刻的连线
  b.fn((t) => (t <= s.t + 1e-9 ? pos(t) : NaN), { from: 0, to: T_MAX, n: 1200, cls: 'c1 trace' });
  b.seg(() => [[OSC_X + 0.75, pos(s.t)], [s.t, pos(s.t)]], { cls: 'dash' });
  b.pt(() => [s.t, pos(s.t)], { cls: 'c2', r: 8 });

  b.onUpdate = () => {
    const x = pos(s.t);
    const side = Math.abs(x) < 0.005 ? '在平衡位置' : (x > 0 ? '在平衡位置右侧（图中上方）' : '在平衡位置左侧（图中下方）');
    $('oscTV').textContent = `${fmt(s.t, 2)} s`;
    $('oscT').value = s.t;
    const msg = $('oscMsg');
    msg.innerHTML = `$x=${m().tex}$<br>$t=${fmt(s.t, 2)}$ s 时，$x=${num(Math.abs(x) < 0.005 ? 0 : x, 2)}$ cm，${side}。<br><span class="muted">${m().note}</span>`;
    tex(msg);
  };
  const stop = () => { cancelAnimationFrame(s.raf); s.playing = false; $('oscPlay').textContent = '▶ 播放'; };
  const play = () => {
    if (s.t >= T_MAX - 1e-6) s.t = 0;
    s.playing = true;
    $('oscPlay').textContent = '⏸ 暂停';
    let last = performance.now();
    const tick = (now) => {
      s.t = Math.min(T_MAX, s.t + (now - last) / 1000); // 真实时间：1 秒走 1 s
      last = now;
      b.update();
      if (s.t < T_MAX && s.playing) s.raf = requestAnimationFrame(tick); else stop();
    };
    s.raf = requestAnimationFrame(tick);
  };
  $('oscPlay').addEventListener('click', () => (s.playing ? stop() : play()));
  $('oscReset').addEventListener('click', () => { stop(); s.t = 0; b.update(); });
  slider($('oscT'), (v) => { if (s.playing) stop(); s.t = v; b.update(); });
  $('oscPre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    stop();
    s.k = btn.dataset.k; s.t = 0;
    $('oscPre').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  return stop;
}

/* ---------- 第 6 页：例 2 水轮（横纵同比例；右侧 z–t 图象横轴按 0.5 单位/s 压缩，纵坐标与 P 同高） ---------- */
function initWheel() {
  const PHI = Math.asin(-2 / 3); // 课本取 −0.73
  const W = TAU / 15;
  const s = { t: 0 };
  const z = (t) => 3 * Math.sin(W * t + PHI) + 2;
  const b = board($('wheel'), { x: [-4.2, 13.4], y: [-4.3, 5.8], w: 620, axes: false, grid: false, ticks: 0 });
  b.poly([[-4.2, -2], [13.4, -2], [13.4, -4.3], [-4.2, -4.3]], { cls: 'water' });
  b.curve((u) => [3 * Math.cos(u), 3 * Math.sin(u)], 0, TAU, { cls: 'thin' });
  b.seg([[-3.6, 0], [3.6, 0]], { cls: 'thin faint' });
  b.seg([[0, -3.6], [0, 3.6]], { cls: 'thin faint' });
  const P = () => [3 * Math.cos(W * s.t + PHI), 3 * Math.sin(W * s.t + PHI)];
  b.seg([[0, 0], [3 * Math.cos(PHI), 3 * Math.sin(PHI)]], { cls: 'dash' });
  b.seg(() => [[0, 0], P()], { cls: 'c2' });
  b.seg(() => [[P()[0], -2], P()], { cls: 'c1 thick' });
  b.pt(() => P(), { cls: 'c2', r: 8 });
  b.text([0, 0], 'O', { cls: 'lb', dx: -22, dy: -6 });
  b.text([3 * Math.cos(PHI), 3 * Math.sin(PHI)], 'P₀', { cls: 'lb', dx: 8, dy: 20 });
  b.text(P, 'P', { cls: 'lb', dx: 10, dy: -8 });
  // z–t 图象
  const X0 = 5.4;
  const KX = 0.5;
  b.seg([[X0, -3.3], [X0, 4.6]], { cls: 'ax' });
  b.seg([[X0, -2], [X0 + 15.6 * KX, -2]], { cls: 'ax' });
  [5, 2, -1].forEach((v) => { b.seg([[X0, v - 2], [X0 + 15 * KX, v - 2]], { cls: 'grid' }); b.text([X0, v - 2], num(v, 0), { cls: 'tk', dx: -20, dy: 6 }); });
  [5, 10, 15].forEach((t) => b.text([X0 + t * KX, -2], String(t), { cls: 'tk', dx: -8, dy: 20 }));
  b.text([X0, 4.6], 'z/m', { cls: 'tk', dx: 8, dy: 6 });
  b.text([X0 + 15.6 * KX, -2], 't/s', { cls: 'tk', dx: -10, dy: -8 });
  b.fn((x) => z((x - X0) / KX) - 2, { from: X0, to: X0 + 15 * KX });
  b.seg(() => [P(), [X0 + s.t * KX, z(s.t) - 2]], { cls: 'dash' });
  b.pt(() => [X0 + s.t * KX, z(s.t) - 2], { r: 7 });
  b.onUpdate = () => { $('wheelV').textContent = `${fmt(s.t, 1)} s，z = ${num(z(s.t), 2)} m`; };
  slider($('wheelT'), (v) => { s.t = v; b.update(); });
}

/* ---------- 第 8 页（核心 2）：用数据表拟合 y = A sin(ωx + φ) + b，ω = 2π/T ---------- */
const FIT = {
  port: {
    name: '港口水深', xl: '时刻', yl: '水深/m', unit: 'm',
    pts: [[0, 5], [3, 7.5], [6, 5], [9, 2.5], [12, 5], [15, 7.5], [18, 5], [21, 2.5], [24, 5]],
    xs: (x) => `${x}:00`,
    view: { x: [-1.6, 25.6], y: [-0.9, 9.4], ticks: [3, 1], labels: ['x/时', '水深/m'] },
    sl: { b: [0, 10, 0.1, 3], A: [0, 5, 0.1, 1], T: [2, 24, 0.5, 8], P: [-PI, PI, PI / 12, PI / 2] },
    ans: { b: 5, A: 2.5, T: 12, P: 0 },
    tol: 0.1,
  },
  day: {
    name: '白昼时间', xl: '日序', yl: '白昼/h', unit: 'h',
    // 习题 7.4 第 7 题：1/1, 2/28, 3/21, 4/27, 5/6, 6/21, 8/14, 9/23, 10/25, 11/21（平年日序）
    pts: [[1, 5.59], [59, 10.23], [80, 12.38], [117, 16.39], [126, 17.26], [172, 19.4], [226, 16.34], [266, 12.01], [298, 8.48], [325, 6.13]],
    xs: (x) => String(x),
    view: { x: [-25, 385], y: [-1.6, 23], ticks: [30, 2], labels: ['日序', '白昼/h'] },
    sl: { b: [0, 24, 0.05, 10], A: [0, 12, 0.05, 3], T: [100, 500, 5, 300], P: [-PI, PI, 0.01, 0] },
    ans: null,
    tol: 0.3,
  },
};
const fitF = (q) => (x) => q.A * Math.sin((TAU / q.T) * x + q.P) + q.b;
function initFit() {
  const s = { k: 'port', q: {} };
  const boards = {};
  Object.entries(FIT).forEach(([k, D]) => {
    const host = document.createElement('div');
    host.className = 'fit-b';
    $('fit').appendChild(host);
    const st = () => s.q;
    const b = board(host, { ...D.view, w: 620, h: 360 });
    b.fn((x) => fitF(st())(x), { from: D.view.x[0], to: D.view.x[1], n: 600 });
    D.pts.forEach(([x, y]) => {
      const res = () => y - fitF(st())(x);
      b.seg(() => (Math.abs(res()) <= D.tol ? [[x, y], [x, y - res()]] : [[x, y], [x, y]]), { cls: 'res ok' });
      b.seg(() => (Math.abs(res()) > D.tol ? [[x, y], [x, y - res()]] : [[x, y], [x, y]]), { cls: 'res bad' });
      b.pt([x, y], { cls: 'c2', r: 7 });
    });
    boards[k] = { b, host };
  });
  const SL = { b: 'fb', A: 'fA', T: 'fT', P: 'fP' };
  const show = () => {
    const D = FIT[s.k];
    const q = s.q;
    const f = fitF(q);
    const res = D.pts.map(([x, y]) => y - f(x));
    const good = res.filter((r) => Math.abs(r) <= D.tol).length;
    const sse = res.reduce((a, r) => a + r * r, 0);
    const w = TAU / q.T;
    $('fbV').textContent = fmt(q.b, 2);
    $('fAV').textContent = fmt(q.A, 2);
    $('fTV').textContent = `${fmt(q.T, 1)}（ω = ${piStr(w).includes('π') ? piStr(w) : num(w, 4)}）`;
    $('fPV').textContent = piStr(q.P);
    Object.entries(SL).forEach(([p]) => {
      const ok = D.ans && Math.abs(q[p] - D.ans[p]) < 1e-6;
      $(`f${p}Ok`).textContent = ok ? '✓' : '';
    });
    const done = good === D.pts.length;
    const msg = $('fitMsg');
    msg.className = `tip feedback ${done ? 'ok' : ''}`;
    msg.innerHTML = `$y=${fmt(q.A, 2)}\\sin\\left(${texV(w, 4)}x${Math.abs(q.P) < 1e-9 ? '' : `${q.P < 0 ? '-' : '+'}${texV(Math.abs(q.P), 3)}`}\\right)+${fmt(q.b, 2)}$<br>`
      + `吻合 <b>${good}/${D.pts.length}</b> 个点（|残差| ≤ ${D.tol}）；残差平方和 $S=${fmt(sse, 3)}$；最大 |残差| = ${fmt(Math.max(...res.map(Math.abs)), 2)} ${D.unit}`
      + (done && s.k === 'port' ? '<br><b>✓ 全部吻合：$f(x)=2.5\\sin\\frac\\pi6x+5$（课本答案）</b>' : '');
    tex(msg);
    boards[s.k].b.update();
  };
  const table = (D) => {
    const half = Math.ceil(D.pts.length / 2);
    const row = (arr) => `<tr><th>${D.xl}</th>${arr.map(([x]) => `<td>${D.xs(x)}</td>`).join('')}</tr><tr><th>${D.yl}</th>${arr.map(([, y]) => `<td>${y}</td>`).join('')}</tr>`;
    $('fitTable').innerHTML = `<table class="mtab small">${row(D.pts.slice(0, half))}${row(D.pts.slice(half))}</table>`;
  };
  const load = (k) => {
    s.k = k;
    const D = FIT[k];
    Object.entries(SL).forEach(([p, id]) => {
      const [min, max, step, v] = D.sl[p];
      Object.assign($(id), { min, max, step });
      $(id).value = v;
      s.q[p] = v;
    });
    Object.entries(boards).forEach(([kk, { host }]) => { host.hidden = kk !== k; });
    table(D);
    document.querySelectorAll('#fitSet .btn').forEach((x) => x.classList.toggle('solid', x.dataset.set === k));
    show();
  };
  Object.entries(SL).forEach(([p, id]) => {
    $(id).setAttribute('data-noswipe', '');
    $(id).addEventListener('input', () => { s.q[p] = +$(id).value; if (p === 'P' && Math.abs(s.q.P) < 1e-9) s.q.P = 0; show(); });
  });
  $('fitSet').addEventListener('click', (e) => { const btn = e.target.closest('[data-set]'); if (btn) load(btn.dataset.set); });
  load('port');
  return () => boards[s.k].b.update();
}

/* ---------- 第 9 页：港口水深，水深 ≥ 5.5 m 的时段 ---------- */
const portF = (x) => 2.5 * Math.sin((PI / 6) * x) + 5;
function initPort() {
  const s = { x: 3 };
  const x1 = (6 / PI) * Math.asin(0.2);
  const bands = [[x1, 6 - x1], [12 + x1, 18 - x1]];
  const b = board($('port'), { x: [-1.6, 25.6], y: [-0.9, 9.4], w: 600, h: 320, ticks: [3, 1], labels: ['x/时', '水深/m'] });
  bands.forEach(([a, c]) => b.poly([[a, 0], [c, 0], [c, 9], [a, 9]], { cls: 'band' }));
  b.seg([[0, 5.5], [24, 5.5]], { cls: 'c2 dashed' });
  b.text([24, 5.5], '5.5', { cls: 'tk', dx: 4, dy: -6 });
  b.fn(portF, { from: 0, to: 24 });
  b.drag(() => [s.x, portF(s.x)], (x) => { s.x = Math.min(24, Math.max(0, Math.round(x * 12) / 12)); });
  b.onUpdate = () => {
    const d = portF(s.x);
    const ok = d >= 5.5;
    $('portMsg').innerHTML = `${clock(s.x)}，水深 <b>${fmt(d, 2)}</b> m：${ok ? '≥ 5.5，<b>可以进港</b>' : '&lt; 5.5，不能进港'}。<br>`
      + `精确边界 x ≈ ${bands.map(([a, c]) => `${fmt(a, 2)}～${fmt(c, 2)}`).join('、')}（课本取 0.4～5.6、12.4～17.6）`;
  };
  b.update();
}

/* ---------- 第 10 页：卸货截止时刻：f(x) 与需要的水深 h(x) + 1.5 ---------- */
function initUnload() {
  const need = (x) => 4 - 0.3 * (x - 2) + 1.5;
  const gap = (x) => portF(x) - need(x);
  const xs = root(gap, 2.5, 9); // ≈ 6.715
  const s = { x: 4 };
  const b = board($('unload'), { x: [0.8, 12.8], y: [-0.9, 9.2], w: 560, h: 380, ticks: [1, 1], labels: ['x/时', 'm'] });
  b.poly(() => { const pts = []; for (let i = 0; i <= 60; i += 1) { const x = 2 + ((xs - 2) * i) / 60; pts.push([x, portF(x)]); } for (let i = 60; i >= 0; i -= 1) { const x = 2 + ((xs - 2) * i) / 60; pts.push([x, need(x)]); } return pts; }, { cls: 'band' });
  b.fn(portF, { from: 0.8, to: 12.8 });
  b.fn(need, { from: 2, to: 12.8, cls: 'c2' });
  b.seg([[xs, 0], [xs, portF(xs)]], { cls: 'dash' });
  b.pt([xs, portF(xs)], { r: 7 });
  b.text([xs, 0], 'x ≈ 6.7', { cls: 'lb up', dx: 6, dy: -8 });
  b.seg(() => [[s.x, portF(s.x)], [s.x, need(s.x)]], { cls: 'c3 thick' });
  b.text([11, need(11)], 'h(x)+1.5', { cls: 'lb up', dx: -30, dy: 30 });
  b.text([11.4, portF(11.4)], 'f(x)', { cls: 'lb up', dx: -44, dy: -6 });
  b.onUpdate = () => {
    const g = gap(s.x);
    $('unXV').textContent = clock(s.x);
    $('unMsg').innerHTML = `水深 f = ${fmt(portF(s.x), 2)} m，需要 h + 1.5 = ${fmt(need(s.x), 2)} m，差 = <b>${num(g, 2)}</b> m：${g >= 0 ? '安全，可以继续卸货' : '<b>水已不够深，必须离开</b>'}。交点 x ≈ ${fmt(xs, 3)}（课本取 6.7，即 6:42）`;
  };
  slider($('unX'), (v) => { s.x = v; b.update(); });
}

let stopOsc = () => {};
let redrawFit = () => {};
window.LESSON = {
  init() {
    stopOsc = initOsc();
    initWheel();
    redrawFit = initFit();
    initPort();
    initUnload();
  },
  onRender(slide) {
    if (!slide.contains($('osc'))) stopOsc();
    if (slide.contains($('fit'))) requestAnimationFrame(redrawFit);
  },
};
