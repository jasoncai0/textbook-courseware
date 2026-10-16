'use strict';
/* 高一上 7.3 三角函数的图象和性质 · 本课互动：例 1 钟摆周期、单位圆展开成正弦曲线（核心）、余弦 = 正弦左移、
 * 性质读图、例 3 五点法、正切线作图、摩天轮高度、A/ω/φ 变换、例 7 两种变换顺序。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const PI = Math.PI;
const TAU = 2 * PI;

/** 把弧度写成 π 的倍数（分母不超过 12 时），否则给小数 */
function piStr(v) {
  if (Math.abs(v) < 1e-9) return '0';
  for (const d of [1, 2, 3, 4, 6, 12]) {
    const n = Math.round((v / PI) * d);
    if (Math.abs(n * PI / d - v) < 1e-6) {
      const sign = n < 0 ? '−' : '';
      const a = Math.abs(n);
      return `${sign}${a === 1 ? '' : a}π${d === 1 ? '' : `/${d}`}`;
    }
  }
  return fmt(v, 2).replace('-', '−');
}
const num = (v, d = 3) => fmt(v, d).replace('-', '−');

/** 在横轴上按 π/2 的倍数标刻度（横轴用弧度，与纵轴同比例） */
function piTicks(b, from, to, step = PI / 2, y = 0) {
  for (let k = Math.ceil(from / step); k * step <= to + 1e-9; k += 1) {
    const x = k * step;
    if (Math.abs(x) < 1e-9) continue;
    b.seg([[x, y - 0.06], [x, y + 0.06]], { cls: 'tickmark' });
    b.text([x, y], piStr(x), { cls: 'tk', dx: -10, dy: 20 });
  }
}

/* 第 4 页：例 1 钟摆高度（依课本图 7-3-1 读数：最高 50、最低 10、周期 1.5 s，t = 1 时 20） */
function initPend() {
  const T = 1.5;
  const h = (t) => 30 + 20 * Math.cos((TAU / T) * t);
  const s = { t: 0.3 };
  const b = board($('pend'), { x: [-0.25, 3.5], y: [-6, 60], w: 520, h: 300, ticks: [0.5, 10], labels: ['t/s', 'h/mm'] });
  b.fn(h, { from: 0, to: 3.4 });
  b.seg(() => [[s.t, 0], [s.t, h(s.t)]], { cls: 'dash' });
  b.seg(() => [[s.t + T, 0], [s.t + T, h(s.t)]], { cls: 'dash' });
  b.seg(() => [[s.t, h(s.t)], [s.t + T, h(s.t)]], { cls: 'c2 thinner' });
  b.pt(() => [s.t, h(s.t)], { cls: 'c2', r: 8 });
  b.pt(() => [s.t + T, h(s.t)], { r: 8 });
  b.text(() => [s.t + T / 2, h(s.t)], '1.5 s', { cls: 'lb up', dx: -18, dy: -10 });
  b.onUpdate = () => { $('pendV').textContent = `h(${fmt(s.t)}) = ${fmt(h(s.t), 1)} = h(${fmt(s.t + T)})`; };
  slider($('pendT'), (v) => { s.t = v; b.update(); });
}

/* 第 5 页（核心）：单位圆“展开”成正弦曲线。单位圆圆心 O'(−1.65, 0)，A 为圆与 x 轴右交点；横纵同比例 */
const UR_C = -1.65;
const UR_BINS = 720;
function initUnroll() {
  const s = { a: PI / 3, fn: 'sin', seen: new Array(UR_BINS + 1).fill(false), twelve: false, playing: 0 };
  const F = { sin: Math.sin, cos: Math.cos };
  const b = board($('unroll'), { x: [-2.8, 6.75], y: [-1.38, 1.42], w: 1000, ticks: [0, 1], labels: ['x', 'y'], tickLabels: false });
  const P = () => [UR_C + Math.cos(s.a), Math.sin(s.a)];
  const val = () => F[s.fn](s.a);
  const mark = (a) => { const i = Math.round((a / TAU) * UR_BINS); for (let k = Math.max(0, i - 1); k <= Math.min(UR_BINS, i + 1); k += 1) s.seen[k] = true; };

  // 单位圆、直径、刻度
  b.curve((t) => [UR_C + Math.cos(t), Math.sin(t)], 0, TAU, { cls: 'thin' });
  b.seg([[UR_C, -1.3], [UR_C, 1.3]], { cls: 'thin' });
  b.seg([[0, 1], [6.5, 1]], { cls: 'dash faint' });
  b.seg([[0, -1], [6.5, -1]], { cls: 'dash faint' });
  piTicks(b, 0, TAU);
  b.text([0, 0], 'O', { cls: 'tk', dx: -16, dy: 20 });
  b.text([0, 1], '1', { cls: 'tk', dx: -16, dy: 6 });
  b.text([0, -1], '−1', { cls: 'tk', dx: -26, dy: 6 });
  b.text([UR_C, 0], "O'", { cls: 'lb', dx: -26, dy: 24 });
  b.text([UR_C + 1, 0], 'A', { cls: 'lb', dx: 6, dy: 24 });

  // 12 等分：课本图 7-3-3
  const twelve = Array.from({ length: 13 }, (_, k) => (k * PI) / 6);
  twelve.forEach((a) => {
    const on = () => s.twelve;
    b.seg(() => (on() ? [[UR_C, 0], [UR_C + Math.cos(a), Math.sin(a)]] : [[0, 0], [0, 0]]), { cls: 'thin faint' });
    b.seg(() => (on() ? [[a, 0], [a, F[s.fn](a)]] : [[0, 0], [0, 0]]), { cls: 'c1 thinner' });
    b.pt(() => [a, F[s.fn](a)], { show: on, r: 5 });
  });

  // 描出的曲线：访问过的位置才画
  b.fn((x) => { const i = Math.round((x / TAU) * UR_BINS); return s.seen[i] ? F[s.fn](x) : NaN; }, { from: 0, to: TAU, n: UR_BINS, cls: 'c1 trace' });

  // 弧 AP 与 x 轴上等长的线段（“拉直”的弧）
  b.curve((t) => [UR_C + Math.cos(t), Math.sin(t)], 0, () => s.a, { cls: 'c2 thick' });
  b.seg(() => [[0, 0], [s.a, 0]], { cls: 'c2 thick' });
  // 正弦线 MP / 余弦线 O'M
  b.seg(() => [[UR_C, 0], P()], { cls: 'thin' });
  b.seg(() => (s.fn === 'sin' ? [[P()[0], 0], P()] : [[UR_C, 0], [P()[0], 0]]), { cls: 'c1 thick' });
  // 平移到 x 处的纵坐标线段与投影线
  b.seg(() => [[s.a, 0], [s.a, val()]], { cls: 'c1 thick' });
  b.seg(() => (s.fn === 'sin' ? [P(), [s.a, val()]] : [[0, 0], [0, 0]]), { cls: 'dash' });
  b.pt(() => [s.a, val()], { r: 7 });
  b.text(() => [s.a, val()], () => `S(x₀, ${s.fn} x₀)`, { cls: 'lb up', dx: 10, dy: val() >= 0 ? -12 : 30 });
  b.text(() => [P()[0], 0], 'M', { cls: 'lb', dx: -8, dy: 24 });
  b.text(P, 'P', { cls: 'lb', dx: 10, dy: -10 });
  b.drag(P, (x, y) => {
    let a = Math.atan2(y, x - UR_C);
    if (a < 0) a += TAU;
    // 让角连续变化：取与上一次最接近的那一个（不越过 0 与 2π）
    if (s.a > 5 && a < 1.2) a = TAU;
    else if (s.a < 1.2 && a > 5) a = 0;
    setA(a);
  });

  function setA(a) {
    // 靠近 π/12 的整数倍时吸附过去，便于读出 π/2、π 等处的精确值
    const near = Math.round(a / (PI / 12)) * (PI / 12);
    s.a = Math.min(TAU, Math.max(0, Math.abs(a - near) < 0.012 ? near : a));
    mark(s.a);
    $('urX').value = s.a;
  }
  b.onUpdate = () => {
    $('urXV').textContent = `${piStr(s.a)} ≈ ${fmt(s.a)}`;
    const deg = (s.a * 180) / PI;
    const line = s.fn === 'sin' ? '正弦线 MP' : "余弦线 O'M";
    $('urMsg').innerHTML = `弧 AP 长 = x₀ = <b>${fmt(s.a, 3)}</b>（${fmt(deg, 1)}°）；${line} 的数量 = <b>${num(val())}</b> = ${s.fn} x₀。橙色弧与 x 轴上橙色线段等长。`;
  };
  slider($('urX'), (v) => { setA(v); b.update(); });

  const setFn = (fn) => {
    s.fn = fn;
    s.seen.fill(false);
    mark(s.a);
    document.querySelectorAll('[data-fn]').forEach((x) => x.classList.toggle('solid', x.dataset.fn === fn));
    b.update();
  };
  document.querySelectorAll('[data-fn]').forEach((btn) => btn.addEventListener('click', () => setFn(btn.dataset.fn)));
  $('urClear').addEventListener('click', () => { s.seen.fill(false); s.twelve = false; mark(s.a); b.update(); });
  $('urTwelve').addEventListener('click', () => { s.twelve = !s.twelve; b.update(); });
  const ROUND_MS = 6000;
  $('urPlay').addEventListener('click', () => {
    cancelAnimationFrame(s.playing);
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / ROUND_MS);
      setA(p * TAU); b.update();
      if (p < 1) s.playing = requestAnimationFrame(tick);
    };
    s.seen.fill(false);
    s.playing = requestAnimationFrame(tick);
  });
  setA(s.a);
  b.update();
}

/* 第 6 页：y = sin(x + s) 左移，s = π/2 时与 y = cos x 重合 */
function initShift() {
  const s = { v: 0 };
  const b = board($('shift'), { x: [-6.6, 6.6], y: [-1.5, 1.6], w: 640, ticks: [0, 1], tickLabels: false });
  piTicks(b, -TAU, TAU, PI / 2);
  b.text([0, 1], '1', { cls: 'tk', dx: -14, dy: 6 });
  b.fn(Math.cos, { cls: 'c2 dashed' });
  b.fn((x) => Math.sin(x + s.v));
  b.pt(() => [PI / 2 - s.v, 1], { r: 7 });
  b.pt([PI / 2, 1], { cls: 'c2', r: 6 });
  b.seg(() => [[PI / 2, 1.25], [PI / 2 - s.v, 1.25]], { cls: 'c3' });
  b.onUpdate = () => {
    const done = Math.abs(s.v - PI / 2) < 0.01;
    $('shiftV').textContent = piStr(s.v === 0 ? 0 : (done ? PI / 2 : s.v));
    const msg = $('shiftMsg');
    msg.className = `tip feedback ${done ? 'ok' : ''}`;
    msg.innerHTML = done
      ? '<b>重合！</b>$y=\\sin\\left(x+\\frac\\pi2\\right)=\\cos x$：把正弦曲线向左平移 $\\frac\\pi2$，就是余弦曲线。'
      : `蓝线 $y=\\sin(x+${fmt(s.v)})$，最高点从 $\\frac\\pi2$ 移到 ${fmt(PI / 2 - s.v)}（绿线为平移量）。橙色虚线是 $y=\\cos x$。`;
    tex(msg);
  };
  slider($('shiftS'), (v) => { s.v = v > 1.565 ? PI / 2 : v; b.update(); });
}

/* 第 7 页：沿曲线拖点，读出函数值与单调性 */
function initProp() {
  const FN = {
    sin: { f: Math.sin, d: Math.cos, name: 'sin' },
    cos: { f: Math.cos, d: (x) => -Math.sin(x), name: 'cos' },
  };
  const s = { x: 0.8, k: 'sin' };
  const b = board($('prop'), { x: [-3.9, 7.4], y: [-1.6, 1.6], w: 640, ticks: [0, 1], tickLabels: false });
  piTicks(b, -PI, TAU, PI / 2);
  b.text([0, 1], '1', { cls: 'tk', dx: -14, dy: 6 });
  b.text([0, -1], '−1', { cls: 'tk', dx: -24, dy: 6 });
  b.seg([[-3.9, 1], [7.4, 1]], { cls: 'dash faint' });
  b.seg([[-3.9, -1], [7.4, -1]], { cls: 'dash faint' });
  b.fn((x) => FN[s.k].f(x));
  b.seg(() => [[s.x, 0], [s.x, FN[s.k].f(s.x)]], { cls: 'dash' });
  b.drag(() => [s.x, FN[s.k].f(s.x)], (x) => { s.x = Math.round(Math.min(7.2, Math.max(-3.7, x)) * 100) / 100; });
  b.onUpdate = () => {
    const { f, d, name } = FN[s.k];
    const slope = d(s.x);
    const trend = Math.abs(slope) < 0.03 ? '到达最值附近' : (slope > 0 ? '曲线<b>上升</b>（增区间内）' : '曲线<b>下降</b>（减区间内）');
    $('propMsg').innerHTML = `x = ${num(s.x, 2)}，${name} x = <b>${num(f(s.x))}</b>，${trend}；${name}(−x) = ${num(f(-s.x))}`;
  };
  $('propBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-p]');
    if (!btn) return;
    s.k = btn.dataset.p;
    $('propBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* 第 8 页：例 3 五点法 */
function initEx3() {
  const SETS = {
    a: { f: (x) => 2 * Math.cos(x), g: Math.cos, pts: [0, PI / 2, PI, 1.5 * PI, TAU] },
    b: { f: (x) => Math.sin(2 * x), g: Math.sin, pts: [0, PI / 4, PI / 2, 0.75 * PI, PI] },
  };
  const s = { k: 'a' };
  const b = board($('ex3'), { x: [-3.6, 7.1], y: [-2.5, 2.6], w: 620, ticks: [0, 1], tickLabels: false });
  piTicks(b, -PI, TAU, PI / 2);
  [1, 2, -1, -2].forEach((v) => b.text([0, v], num(v), { cls: 'tk', dx: v < 0 ? -24 : -14, dy: 6 }));
  b.fn((x) => SETS[s.k].g(x), { cls: 'thin dashed' });
  b.fn((x) => SETS[s.k].f(x));
  for (let i = 0; i < 5; i += 1) b.pt(() => { const S = SETS[s.k]; return [S.pts[i], S.f(S.pts[i])]; }, { cls: 'c2', r: 7 });
  $('ex3Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-e]');
    if (!btn) return;
    s.k = btn.dataset.e;
    $('ex3Btns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* 第 10 页：正切线 AT 平移到 x 处，描出 (−π/2, π/2) 内的一支 */
const TAN_C = -6.4;
function initTan() {
  const s = { a: 0.9 };
  const LIM = 1.45;
  const b = board($('tan'), { x: [-7.6, 5], y: [-3.2, 3.2], w: 620, ticks: [0, 1], tickLabels: false });
  [-1.5 * PI, -PI / 2, PI / 2, 1.5 * PI].forEach((x) => b.seg([[x, -3.2], [x, 3.2]], { cls: 'dash' }));
  [-PI, -PI / 2, PI / 2, PI].forEach((x) => b.text([x, 0], piStr(x), { cls: 'tk', dx: -12, dy: 20 }));
  b.text([0, 1], '1', { cls: 'tk', dx: -14, dy: 6 });
  b.curve((t) => [TAN_C + Math.cos(t), Math.sin(t)], 0, TAU, { cls: 'thin' });
  b.seg([[TAN_C + 1, -3.2], [TAN_C + 1, 3.2]], { cls: 'thin faint' });
  b.fn(Math.tan, { from: -1.5 * PI + 0.01, to: 5, n: 1400 });
  const T = () => [TAN_C + 1, Math.tan(s.a)];
  b.seg(() => [[TAN_C, 0], T()], { cls: 'thin' });
  b.seg(() => [[TAN_C + 1, 0], T()], { cls: 'c2 thick' });
  b.seg(() => [[s.a, 0], [s.a, Math.tan(s.a)]], { cls: 'c2 thick' });
  b.seg(() => [T(), [s.a, Math.tan(s.a)]], { cls: 'dash' });
  b.text([TAN_C + 1, 0], 'A', { cls: 'lb', dx: 6, dy: 24 });
  b.text(T, 'T', { cls: 'lb', dx: 8, dy: -6 });
  b.drag(() => [TAN_C + Math.cos(s.a), Math.sin(s.a)], (x, y) => {
    const a = Math.atan2(y, x - TAN_C);
    s.a = Math.min(LIM, Math.max(-LIM, Math.abs(a) > PI / 2 ? Math.sign(a) * LIM : a));
  });
  b.onUpdate = () => { $('tanMsg').innerHTML = `x = ${num(s.a, 2)}，正切线 AT 的数量 = tan x = <b>${num(Math.tan(s.a))}</b>（拖动圆上橙点）`; };
  b.update();
}

/* 第 11 页：摩天轮 H = 40 sin(πt/15 − π/2) + 48（米、分钟，横纵不同比例，刻度已标） */
function initWheel() {
  const H = (t) => 40 * Math.sin((PI / 15) * t - PI / 2) + 48;
  const s = { t: 5 };
  const b = board($('wheel'), { x: [-50, 100], y: [-9, 97], w: 640, ticks: [0, 0], axes: false, grid: false }); // 横纵同比例：轮子是圆
  // 左：摩天轮（等比例，圆心离地 48）
  const OX = -8;
  b.seg([[-50, 0], [34, 0]], { cls: 'thin' });
  b.curve((t) => [OX + 40 * Math.cos(t), 48 + 40 * Math.sin(t)], 0, TAU, { cls: 'thin' });
  b.seg([[OX, 48], [OX - 8, 0]], { cls: 'thin' });
  b.seg([[OX, 48], [OX + 8, 0]], { cls: 'thin' });
  const P = () => { const a = (PI / 15) * s.t - PI / 2; return [OX + 40 * Math.cos(a), 48 + 40 * Math.sin(a)]; };
  b.seg(() => [[OX, 48], P()], { cls: 'c2' });
  b.seg(() => [[P()[0], 0], P()], { cls: 'c1' });
  b.pt(P, { cls: 'c2', r: 8 });
  b.text([OX, 48], 'O', { cls: 'lb', dx: 6, dy: -6 });
  b.text(P, 'P', { cls: 'lb', dx: 10, dy: 6 });
  // 右：H–t 图象（横轴 0～30 min 压缩画在 8～62 之间）
  const X0 = 42;
  const KX = 1.8;
  b.seg([[X0, 0], [X0 + 32 * KX, 0]], { cls: 'ax' });
  b.seg([[X0, 0], [X0, 96]], { cls: 'ax' });
  [0, 15, 30].forEach((t) => b.text([X0 + t * KX, 0], String(t), { cls: 'tk', dx: -8, dy: 20 }));
  [8, 48, 88].forEach((h) => { b.text([X0, h], String(h), { cls: 'tk', dx: -26, dy: 6 }); b.seg([[X0, h], [X0 + 30 * KX, h]], { cls: 'grid' }); });
  b.text([X0 + 32 * KX, 0], 't/min', { cls: 'tk', dx: -30, dy: -8 });
  b.text([X0, 96], 'H/m', { cls: 'tk', dx: 6, dy: 4 });
  b.fn((x) => H((x - X0) / KX), { from: X0, to: X0 + 30 * KX });
  b.seg(() => [P(), [X0 + s.t * KX, H(s.t)]], { cls: 'dash' });
  b.pt(() => [X0 + s.t * KX, H(s.t)], { r: 7 });
  b.onUpdate = () => { $('wheelV').textContent = `${fmt(s.t, 1)} min，H = ${fmt(H(s.t), 2)} m`; };
  slider($('wheelT'), (v) => { s.t = v; b.update(); });
}

/* 第 12 页：A、ω、φ 对 y = A sin(ωx + φ) 的影响，基准 y = sin x；最高点 (π/2, 1) ↦ ((π/2 − φ)/ω, A) */
function initAw() {
  const s = { A: 1, w: 1, p: 0 };
  const b = board($('aw'), { x: [-4.2, 7.4], y: [-3.3, 3.4], w: 620, ticks: [0, 1], tickLabels: false });
  piTicks(b, -PI, TAU, PI / 2);
  [1, 2, 3, -1, -2, -3].forEach((v) => b.text([0, v], num(v), { cls: 'tk', dx: v < 0 ? -24 : -14, dy: 6 }));
  b.fn(Math.sin, { cls: 'thin dashed' });
  b.fn((x) => s.A * Math.sin(s.w * x + s.p));
  const top = () => [(PI / 2 - s.p) / s.w, s.A];
  b.seg(() => [[PI / 2, 1], top()], { cls: 'c3' });
  b.pt([PI / 2, 1], { cls: 'c2', r: 7 });
  b.pt(top, { cls: 'c3fill', r: 8 });
  b.onUpdate = () => {
    const [tx] = top();
    $('awAV').textContent = fmt(s.A, 1);
    $('awWV').textContent = fmt(s.w, 1);
    $('awPV').textContent = piStr(s.p);
    const msg = $('awMsg');
    msg.innerHTML = `$y=${s.A === 1 ? '' : fmt(s.A, 1)}\\sin(${s.w === 1 ? '' : fmt(s.w, 1)}x${s.p === 0 ? '' : (s.p > 0 ? '+' : '-') + fmt(Math.abs(s.p), 2)})$<br>`
      + `周期 $T=\\dfrac{2\\pi}{\\omega}=${fmt(TAU / s.w, 3)}$，最大值 $${fmt(s.A, 1)}$；最高点 $\\left(\\frac\\pi2,1\\right)\\mapsto(${fmt(tx, 3)},\\ ${fmt(s.A, 1)})$`;
    tex(msg);
  };
  slider($('awA'), (v) => { s.A = v; b.update(); });
  slider($('awW'), (v) => { s.w = v; b.update(); });
  slider($('awP'), (v) => { s.p = Math.abs(v) < 0.005 ? 0 : v; b.update(); });
  $('awPre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pre]');
    if (!btn) return;
    const [A, w, p] = btn.dataset.pre.split(',').map(Number);
    Object.assign(s, { A, w, p });
    $('awA').value = A; $('awW').value = w; $('awP').value = p;
    b.update();
  });
}

/* 第 13 页：例 7 两种变换顺序，参数连续变化（平移改 φ、伸缩改 ω 或 A，正是课本所说的变换） */
const EX7 = {
  2: [
    { A: 1, w: 1, p: 0, say: '起点：$y=\\sin x$' },
    { A: 1, w: 2, p: 0, say: '① 横坐标变为原来的 $\\frac12$：$y=\\sin2x$' },
    { A: 1, w: 2, p: -PI / 3, say: '② 向右平移 $\\frac\\pi6$：$y=\\sin2\\left(x-\\frac\\pi6\\right)=\\sin\\left(2x-\\frac\\pi3\\right)$' },
    { A: 3, w: 2, p: -PI / 3, say: '③ 纵坐标变为原来的 3 倍：$y=3\\sin\\left(2x-\\frac\\pi3\\right)$' },
  ],
  3: [
    { A: 1, w: 1, p: 0, say: '起点：$y=\\sin x$' },
    { A: 1, w: 1, p: -PI / 3, say: '① 向右平移 $\\frac\\pi3$：$y=\\sin\\left(x-\\frac\\pi3\\right)$' },
    { A: 1, w: 2, p: -PI / 3, say: '② 横坐标变为原来的 $\\frac12$：$y=\\sin\\left(2x-\\frac\\pi3\\right)$' },
    { A: 3, w: 2, p: -PI / 3, say: '③ 纵坐标变为原来的 3 倍：$y=3\\sin\\left(2x-\\frac\\pi3\\right)$' },
  ],
};
function initEx7() {
  const s = { m: 2, i: 0, cur: { ...EX7[2][0] }, prev: null, raf: 0 };
  const b = board($('ex7'), { x: [-0.9, 7.6], y: [-3.4, 3.5], w: 560, ticks: [0, 1], tickLabels: false });
  for (let k = 1; k <= 7; k += 1) b.seg([[(k * PI) / 6, -0.06], [(k * PI) / 6, 0.06]], { cls: 'tickmark' });
  [PI / 6, (2 * PI) / 3, (7 * PI) / 6, TAU].forEach((x) => b.text([x, 0], piStr(x), { cls: 'tk', dx: -12, dy: 20 }));
  [3, -3, 1].forEach((v) => b.text([0, v], num(v), { cls: 'tk', dx: v < 0 ? -24 : -14, dy: 6 }));
  const y = (q) => (x) => q.A * Math.sin(q.w * x + q.p);
  b.fn((x) => (s.prev ? y(s.prev)(x) : NaN), { cls: 'thin dashed' });
  b.fn((x) => y(s.cur)(x));
  const zero = () => [-s.cur.p / s.cur.w, 0];
  b.pt(zero, { cls: 'c2', r: 8 });
  b.text(zero, () => `x = ${piStr(-s.cur.p / s.cur.w)}`, { cls: 'lb up', dx: 8, dy: -14 });
  const say = () => { const msg = $('ex7Msg'); msg.innerHTML = `${s.m === 2 ? '方法 2' : '方法 3'} · ${EX7[s.m][s.i].say}`; tex(msg); };
  const animate = (from, to) => {
    cancelAnimationFrame(s.raf);
    const t0 = performance.now();
    const DUR = 1200;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DUR);
      const e = p * p * (3 - 2 * p);
      s.cur = { A: from.A + (to.A - from.A) * e, w: from.w + (to.w - from.w) * e, p: from.p + (to.p - from.p) * e };
      b.update();
      if (p < 1) s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);
  };
  $('ex7Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.m) {
      s.m = +btn.dataset.m; s.i = 0; s.prev = null;
      cancelAnimationFrame(s.raf);
      s.cur = { ...EX7[s.m][0] };
      $('ex7Btns').querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('solid', x === btn));
    } else {
      const seq = EX7[s.m];
      if (s.i >= seq.length - 1) { s.i = 0; s.prev = null; s.cur = { ...seq[0] }; } else {
        s.prev = { ...seq[s.i] };
        s.i += 1;
        animate(seq[s.i - 1], seq[s.i]);
      }
    }
    say();
    b.update();
  });
  say();
  b.update();
}

window.LESSON = {
  init() {
    initPend();
    initUnroll();
    initShift();
    initProp();
    initEx3();
    initTan();
    initWheel();
    initAw();
    initEx7();
  },
};
