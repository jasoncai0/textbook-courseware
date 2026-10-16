'use strict';
/* 高一上 7.1 角与弧度 · 本课互动：转动终边（任意角）、同心圆上 l/r 不变（弧度）、半圆刻度盘、例 5 扇形。通用部分见 ../shared/math.js */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const QN = '一二三四';
const val = (v) => (typeof v === 'function' ? v() : v);

/** 象限名：a 为度数 */
function quadrant(a) {
  const a0 = ((a % 360) + 360) % 360;
  if (a0 % 90 === 0) return `${['x 轴正半轴', 'y 轴正半轴', 'x 轴负半轴', 'y 轴负半轴'][a0 / 90]}（轴线角）`;
  return `第${QN[Math.floor(a0 / 90)]}象限角`;
}

/** 表示旋转过程的螺线 + 箭头：deg() 为带符号的度数，螺线半径随圈数略增，多圈也看得清 */
function spiral(b, deg, o = {}) {
  const r0 = o.r0 ?? 0.2;
  const grow = o.grow ?? 0.07;
  const rho = (t) => r0 + (grow * Math.abs(t)) / (2 * Math.PI);
  const at = (t) => [rho(t) * Math.cos(t), rho(t) * Math.sin(t)];
  b.curve((t) => at(t), 0, () => deg() * DEG, { cls: o.cls || 'c2', n: 400 });
  b.poly(() => {
    const t = deg() * DEG;
    if (Math.abs(t) < 0.05) return [[0, 0], [0, 0], [0, 0]];
    const [x, y] = at(t);
    const [px, py] = at(t - Math.sign(t) * 0.02);
    const len = Math.hypot(x - px, y - py);
    const [ux, uy] = [(x - px) / len, (y - py) / len];
    const S = o.arrow ?? 0.09;
    return [[x + ux * S * 0.4, y + uy * S * 0.4], [x - ux * S + uy * S * 0.5, y - uy * S - ux * S * 0.5], [x - ux * S - uy * S * 0.5, y - uy * S + ux * S * 0.5]];
  }, { cls: o.fill || 'arrow2' });
}

/* 第 4 页：图 7-1-3，α = 420°，β = −150° */
function initDefFig() {
  const b = board($('defFig'), { x: [-1.6, 1.7], y: [-1.05, 1.3], axes: false, grid: false, w: 520 });
  const L = 1.45;
  b.seg([[0, 0], [L, 0]], { cls: 'c1' });
  b.seg([[0, 0], [L * Math.cos(60 * DEG), L * Math.sin(60 * DEG)]], { cls: 'c1' });
  b.seg([[0, 0], [L * Math.cos(-150 * DEG), L * Math.sin(-150 * DEG)]], { cls: 'c1' });
  spiral(b, () => 420, { r0: 0.22, grow: 0.12 });
  spiral(b, () => -150, { r0: 0.5, grow: 0, cls: 'c3', fill: 'arrow3' });
  b.pt([0, 0]);
  b.text([0, 0], 'O', { dx: -6, dy: 30 });
  b.text([L, 0], 'A', { dx: 6, dy: 26 });
  b.text([L * Math.cos(60 * DEG), L * Math.sin(60 * DEG)], 'B', { dx: 10, dy: 6 });
  b.text([L * Math.cos(-150 * DEG), L * Math.sin(-150 * DEG)], 'C', { dx: -22, dy: 6 });
  b.text([0.42, 0.42], 'α = 420°', { cls: 'lb up c2t', dx: 12 });
  b.text([-0.45, -0.62], 'β = −150°', { cls: 'lb up c3t', dx: -40, dy: 16 });
  b.text([0.95, 0], '始边', { cls: 'lb up', dy: 26 });
  b.update();
}

/* 第 5 页：拖动终边转动任意角 */
const SPIN_MAX = 1080; // 最多转 3 圈，螺线仍清楚
function initSpin() {
  const s = { deg: 60 };
  const L = 1.45;
  const HANDLE_R = 1.15;
  const b = board($('spin'), { x: [-1.7, 1.7], y: [-1.55, 1.55], ticks: 0, grid: false, w: 560 });
  b.curve((t) => [HANDLE_R * Math.cos(t), HANDLE_R * Math.sin(t)], 0, 2 * Math.PI, { cls: 'dash' });
  b.seg([[0, 0], [L, 0]], { cls: 'c1' });
  b.seg(() => [[0, 0], [L * Math.cos(s.deg * DEG), L * Math.sin(s.deg * DEG)]], { cls: 'c1' });
  spiral(b, () => s.deg, { r0: 0.3, grow: 0.1 });
  b.text([L, 0], '始边', { cls: 'lb up', dx: -40, dy: -12 });
  b.text(() => [1.6 * Math.cos(s.deg * DEG), 1.6 * Math.sin(s.deg * DEG)], '终边', { cls: 'lb up mid', dy: 6 });
  b.drag(() => [HANDLE_R * Math.cos(s.deg * DEG), HANDLE_R * Math.sin(s.deg * DEG)], (x, y) => {
    if (Math.hypot(x, y) < 0.15) return;
    const raw = Math.atan2(y, x) / DEG;
    const delta = ((((raw - s.deg) % 360) + 540) % 360) - 180; // 走最近的方向，累计圈数
    s.deg = Math.max(-SPIN_MAX, Math.min(SPIN_MAX, Math.round(s.deg + delta)));
  });
  b.onUpdate = () => {
    const a = s.deg;
    const k = Math.floor(a / 360);
    const a0 = a - k * 360;
    $('spA').textContent = `${a}°`;
    const turns = Math.floor(Math.abs(a) / 360);
    const rest = Math.abs(a) % 360;
    const dir = a > 0 ? '逆时针' : '顺时针';
    $('spDir').textContent = a === 0 ? '没有旋转：零角' : `${dir}旋转${turns ? ` ${turns} 圈${rest ? `又 ${rest}°` : ''}` : ` ${rest}°`}，是${a > 0 ? '正' : '负'}角`;
    $('spQ').textContent = quadrant(a);
    $('spK').innerHTML = `$${a}^\\circ=${k < 0 ? `(${k})` : k}\\times360^\\circ+${a0}^\\circ$`;
    tex($('spK'));
    $('spSame').innerHTML = [-2, -1, 0, 1, 2].map((j) => {
      const v = a0 + (k + j) * 360;
      return j === 0 ? `<b class="hl">${v}°</b>` : `${v}°`;
    }).join('，') + '，…';
  };
  $('spinBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const next = btn.dataset.a !== undefined ? +btn.dataset.a : s.deg + +btn.dataset.d;
    s.deg = Math.max(-SPIN_MAX, Math.min(SPIN_MAX, next));
    b.update();
  });
  b.update();
}

/* 第 8 页：三个同心圆，同一圆心角，l/r 相同 */
const RING_SNAPS = [1, 2, Math.PI]; // 拖到附近吸附，便于演示 1 rad、2 rad、平角
function initRings() {
  const s = { t: 0.8, r: 2 };
  const R1 = 1;
  const R3 = 3;
  const b = board($('rings'), { x: [-3.3, 3.4], y: [-3.3, 3.4], ticks: 0, grid: false, w: 560 });
  [R1, () => s.r, R3].forEach((r) => b.curve((u) => [val(r) * Math.cos(u), val(r) * Math.sin(u)], 0, 2 * Math.PI, { cls: 'dash' }));
  const cls = ['c3', 'c1', 'c2'];
  [R1, () => s.r, R3].forEach((r, i) => b.curve((u) => [val(r) * Math.cos(u), val(r) * Math.sin(u)], 0, () => s.t, { cls: `${cls[i]} thick` }));
  b.seg(() => [[0, 0], [3.25 * Math.cos(s.t), 3.25 * Math.sin(s.t)]], { cls: 'thin' });
  b.seg([[0, 0], [3.25, 0]], { cls: 'thin' });
  b.curve((u) => [0.45 * Math.cos(u), 0.45 * Math.sin(u)], 0, () => s.t, { cls: 'c2' });
  b.text([R1 / 2, 0], 'r₁', { dy: 26 });
  b.text(() => [(R1 + s.r) / 2 + 0.25, 0], 'r₂', { dy: 26 });
  b.text([R3 - 0.2, 0], 'r₃', { dy: 26 });
  b.text(() => [0.62 * Math.cos(s.t / 2), 0.62 * Math.sin(s.t / 2)], 'α', { dx: -4, dy: 8 });
  b.drag(() => [R3 * Math.cos(s.t), R3 * Math.sin(s.t)], (x, y) => {
    if (Math.hypot(x, y) < 0.3) return;
    const raw = Math.atan2(y, x);
    let d = raw - s.t;
    d = ((((d + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
    let t = Math.max(0.05, Math.min(2 * Math.PI, s.t + d));
    RING_SNAPS.forEach((v) => { if (Math.abs(t - v) < 0.015) t = v; });
    s.t = t;
  });
  b.drag(() => [s.r, 0], (x) => { s.r = Math.round(Math.max(1.3, Math.min(2.7, x)) * 20) / 20; }, { r: 8 }).classList.add('blue-h');
  const tab = $('ringTab');
  b.onUpdate = () => {
    const rows = [R1, s.r, R3].map((r, i) => `<tr><td class="ring-${i + 1}">圆 ${i + 1}</td><td>${fmt(r)}</td><td>${fmt(r * s.t)}</td><td><b>${fmt(s.t, 3)}</b></td></tr>`);
    tab.innerHTML = '<tr><th></th><th>半径 r</th><th>弧长 l</th><th>l / r</th></tr>' + rows.join('');
    const deg = s.t / DEG;
    const msg = $('ringMsg');
    const named = { 1: '三条弧都<b>恰好等于各自的半径</b>：这个角就是 <b>1 rad</b>', 2: '弧长都是半径的 2 倍：<b>2 rad</b>' };
    const head = `圆心角 ${Number.isInteger(+deg.toFixed(6)) ? `${Math.round(deg)}°` : `≈ ${deg.toFixed(2)}°`}，`;
    if (s.t === Math.PI) msg.innerHTML = `${head}l / r = π ≈ 3.142：平角 = <b>π rad</b>`;
    else if (named[s.t]) msg.innerHTML = `${head}${named[s.t]}`;
    else msg.innerHTML = `${head}三个圆的 l / r 都是 <b>${fmt(s.t, 3)}</b>——只和角有关，与半径无关。`;
  };
  const setT = (t) => { s.t = t; b.update(); };
  $('ring1').addEventListener('click', () => setT(1));
  $('ring2').addEventListener('click', () => setT(2));
  $('ring180').addEventListener('click', () => setT(Math.PI));
  b.update();
}

/* 第 10 页：图 7-1-9 半圆刻度盘（每 15°） */
const DIAL_LABELS = ['0', 'π/12', 'π/6', 'π/4', 'π/3', '5π/12', 'π/2', '7π/12', '2π/3', '3π/4', '5π/6', '11π/12', 'π'];
function initHalfDial() {
  const b = board($('halfDial'), { x: [-1.5, 1.5], y: [-0.12, 1.3], axes: false, grid: false, w: 600 });
  b.curve((t) => [Math.cos(t), Math.sin(t)], 0, Math.PI, { cls: 'c1' });
  b.seg([[-1, 0], [1, 0]], { cls: 'c1' });
  b.seg([[0, 0], [0, 1]], { cls: 'thin' });
  DIAL_LABELS.forEach((lab, i) => {
    const t = i * 15 * DEG;
    const [c, n] = [Math.cos(t), Math.sin(t)];
    b.seg([[0.92 * c, 0.92 * n], [c, n]], { cls: 'thin' });
    b.text([1.2 * c, 1.12 * n], lab, { cls: 'lb up dial-r', dy: 6 });
    if (i > 0 && i < 12) b.text([0.8 * c, 0.8 * n], `${i * 15}°`, { cls: 'tk dial-d', dy: 6 });
  });
  b.update();
}

/* 第 11 页：例 5 扇形，r = 2，圆心角 2 rad（弧长 4） */
function initSector() {
  const R = 2;
  const A = 2;
  const b = board($('sector'), { x: [-1.3, 2.5], y: [-0.45, 2.35], axes: false, grid: false, w: 420 });
  const pts = [[0, 0], ...Array.from({ length: 61 }, (_, i) => [R * Math.cos((A * i) / 60), R * Math.sin((A * i) / 60)])];
  b.poly(pts, { cls: 'fill1' });
  b.curve((t) => [R * Math.cos(t), R * Math.sin(t)], 0, A, { cls: 'c2 thick' });
  b.curve((t) => [0.35 * Math.cos(t), 0.35 * Math.sin(t)], 0, A, { cls: 'c2' });
  b.text([1, 0], 'r = 2', { cls: 'lb up', dx: -24, dy: 26 });
  b.text([R * Math.cos(1) * 1.08, R * Math.sin(1) * 1.08], 'l = 4', { cls: 'lb up c2t', dx: 4 });
  b.text([0.42 * Math.cos(1), 0.42 * Math.sin(1)], '2 rad', { cls: 'lb up', dx: 2, dy: 2 });
  b.update();
}

window.LESSON = {
  init() {
    initDefFig();
    initSpin();
    initRings();
    initHalfDial();
    initSector();
    tex(document.getElementById('spinBtns'));
  },
};
