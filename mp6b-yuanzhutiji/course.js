'use strict';
/* 六下 圆柱的体积 · 本课互动：例 4 等底等高的长方体、正方体、圆柱；把圆柱切开拼成近似长方体（3D，8/16/32/64 份）；
 * 练习三第 4 题三杯饮料按真实尺寸作图比较。
 * 切拼的拼法与五下《圆的面积》相同：相邻两块共用一条半径边，弦长 c = 2r·sin(π/n)，尖到弦的距离 r·cos(π/n)，
 * 拼成的近似长方体长 = n/2 个弦长 + 半个弦长（n 越大越接近 πr），宽 = r·cos(π/n)（越来越接近 r），高 = h。 */
const $ = (id) => document.getElementById(id);
const VIEWS = [];
const reg = (v) => { VIEWS.push(v); return v; };
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});

/* ---------- 第 3 页：等底等高的三个立体 ---------- */
function initSame() {
  const S = 9;
  const H = 3;
  const r = Math.sqrt(S / Math.PI); // 与 9 cm² 的正方形面积相等的圆
  const v = reg(Poly3D.view($('same'), { w: 760, h: 300, scale: 40, yaw: -18, pitch: 22, center: [0, 0, 1.5] }));
  v.add(() => [
    Poly3D.box([-8.2, -1, 0], [-3.7, 1, H], { color: '#f6dc9a' }),
    { type: 'face', pts: [[-8.2, -1, 0.01], [-3.7, -1, 0.01], [-3.7, 1, 0.01], [-8.2, 1, 0.01]], color: '#6fb3df', lines: [] },
    Poly3D.box([-1.5, -1.5, 0], [1.5, 1.5, H], { color: '#f6dc9a' }),
    Poly3D.revolve({ r1: r, r2: r, h: H, at: [5.6, 0, 0] }, { color: '#f6dc9a' }),
    { type: 'text', p: [-5.95, -1, -0.2], text: '底面 4.5×2', cls: 'cap', dy: 30 },
    { type: 'text', p: [0, -1.5, -0.2], text: '底面 3×3', cls: 'cap', dy: 30 },
    { type: 'text', p: [5.6, -r, -0.2], text: '底面 πr²≈9', cls: 'cap', dy: 30 },
  ]);
  v.update();
}

/* ---------- 第 4 页：切开拼成近似长方体 ---------- */
const CP = { r: 1.7, h: 1.5 };
const ARC = (n) => Math.max(2, Math.ceil(64 / n)); // 每块弧上的分段数
function wedge(n) {
  const a = (2 * Math.PI) / n;
  const m = ARC(n);
  const prof = [[0, 0], ...Array.from({ length: m + 1 }, (_, i) => {
    const t = -a / 2 + (a * i) / m;
    return [CP.r * Math.cos(t), CP.r * Math.sin(t)];
  })];
  const base = Poly3D.prism(prof, 'z', 0, CP.h);
  const np = prof.length;
  const key = (i, j) => (i < j ? `${i}-${j}` : `${j}-${i}`);
  const sharp = new Set();
  for (let i = 0; i < np; i += 1) { sharp.add(key(i, (i + 1) % np)); sharp.add(key(np + i, np + ((i + 1) % np))); }
  [0, 1, np - 1].forEach((i) => sharp.add(key(i, np + i)));
  return { ...base, smooth: true, sharp };
}
// 第 k 块的位置（与五下《圆的面积》的拼法一致）：圆里 / 拼好后
function pose(k, n, done) {
  const a = (2 * Math.PI) / n;
  const top = k < n / 2;
  const mid = Math.PI + (k + 0.5) * a;
  if (!done) return { x: 0, y: 0, ang: top ? mid : mid - 2 * Math.PI };
  const c = 2 * CP.r * Math.sin(Math.PI / n);
  const hh = CP.r * Math.cos(Math.PI / n);
  const x0 = 1.35 * CP.r;
  const yt = -hh / 2;
  const m = top ? k : k - n / 2;
  return top ? { x: x0 + (m + 0.5) * c, y: yt + hh, ang: 1.5 * Math.PI } : { x: x0 + (m + 1) * c, y: yt, ang: 0.5 * Math.PI };
}
function initQiepin() {
  const st = { n: 16, t: 0, anim: null, W: {} };
  const getW = (n) => { st.W[n] = st.W[n] || wedge(n); return st.W[n]; };
  // 视图中心跟着拼的进度从圆柱移到长方体，两种状态都在画面正中
  const cx = () => (1.35 + Math.PI / 2) * CP.r * Math.min(1, Math.max(0, st.t));
  const v = reg(Poly3D.view($('qp'), { w: 760, h: 380, scale: 84, yaw: -12, pitch: 32, center: () => [cx(), 0, CP.h / 2] }));
  v.add(() => {
    const n = st.n;
    const w = getW(n);
    const out = [];
    for (let k = 0; k < n; k += 1) {
      const p0 = pose(k, n, false);
      const p1 = pose(k, n, true);
      // 上半圆的块先移，下半圆的块后移插空
      const tt = k < n / 2 ? Math.min(1, st.t * 2) : Math.max(0, st.t * 2 - 1);
      const e = tt < 0.5 ? 2 * tt * tt : 1 - ((-2 * tt + 2) ** 2) / 2;
      const x = p0.x + (p1.x - p0.x) * e;
      const y = p0.y + (p1.y - p0.y) * e;
      const ang = p0.ang + (p1.ang - p0.ang) * e;
      const [cs, sn] = [Math.cos(ang), Math.sin(ang)];
      const V = w.V.map(([px, py, pz]) => [x + px * cs - py * sn, y + px * sn + py * cs, pz]);
      out.push({ type: 'mesh', V, F: w.F, smooth: true, sharp: w.sharp, color: k < n / 2 ? '#f4a6c4' : '#fbe08a' });
    }
    if (st.t >= 1) {
      const c = 2 * CP.r * Math.sin(Math.PI / n);
      const hh = CP.r * Math.cos(Math.PI / n);
      const x0 = 1.35 * CP.r;
      const x1 = x0 + (n / 2 + 0.5) * c;
      const yf = -hh / 2;
      out.push({ type: 'line', a: [x0, yf - 0.25, 0], b: [x1, yf - 0.25, 0], cls: 'dim', top: true });
      out.push({ type: 'text', p: [(x0 + x1) / 2, yf - 0.25, 0], text: '长 ≈ πr', cls: 'dimt', dy: 28, top: true });
      out.push({ type: 'line', a: [x1 + 0.2, yf, 0], b: [x1 + 0.2, yf + hh, 0], cls: 'dim', top: true });
      out.push({ type: 'text', p: [x1 + 0.2, yf + hh / 2, 0], text: '宽 ≈ r', cls: 'dimt s', dx: 12, dy: 34, top: true });
      out.push({ type: 'line', a: [x1, yf, 0], b: [x1, yf, CP.h], cls: 'dim', top: true });
      out.push({ type: 'text', p: [x1, yf, CP.h * 0.8], text: '高 = h', cls: 'dimt s', dx: 12, top: true });
    }
    return out;
  });
  // 长方体长的读数：按真实拼法算出的长（以 r 为单位）与 π 比较
  const read = () => {
    const n = st.n;
    const c = 2 * Math.sin(Math.PI / n);
    const len = (n / 2) * c; // 上边：n/2 段弦（下边错开半个弦长）
    const wid = Math.cos(Math.PI / n);
    $('qpRead').innerHTML = `平均分成 <b>${n}</b> 份：拼成的立体长约 <b>${len.toFixed(3)}r</b>（$\\pi r\\approx3.142r$），宽约 <b>${wid.toFixed(3)}r</b>（$r$），高就是 $h$。`;
    MathKit.tex($('qpRead'));
  };
  const run = () => {
    if (st.anim) cancelAnimationFrame(st.anim);
    const from = st.t;
    const to = from >= 1 ? 0 : 1;
    const t0 = performance.now();
    const MS = 1800;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / MS);
      st.t = from + (to - from) * p;
      v.update();
      st.anim = p < 1 ? requestAnimationFrame(tick) : null;
      if (p >= 1) $('qpGo').textContent = st.t >= 1 ? '↺ 还原成圆柱' : '拼一拼 ▶';
    };
    st.anim = requestAnimationFrame(tick);
  };
  btnGroup($('qpN'), (k) => { st.n = +k; st.t = 0; if (st.anim) cancelAnimationFrame(st.anim); $('qpGo').textContent = '拼一拼 ▶'; v.update(); read(); });
  $('qpGo').addEventListener('click', run);
  v.update();
  read();
}

/* ---------- 第 9 页：哪个杯里的饮料最多（练习三第 4 题，按真实尺寸，1 cm = 22 单位） ---------- */
const CUPS = [{ d: 8, w: 4 }, { d: 6, w: 7 }, { d: 5, w: 10 }];
function initCups() {
  const svg = $('cups');
  const U = 22;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, a, text) => { const e = document.createElementNS(NS, tag); Object.entries(a).forEach(([k, val]) => e.setAttribute(k, val)); if (text !== undefined) e.textContent = text; svg.appendChild(e); return e; };
  const base = 320;
  let x = 30;
  CUPS.forEach((c, i) => {
    const w = c.d * U;
    const cupH = 12 * U;
    const ry = w * 0.12;
    el('rect', { x, y: base - cupH, width: w, height: cupH, class: 'glass' });
    el('rect', { x, y: base - c.w * U, width: w, height: c.w * U, class: 'juice' });
    el('ellipse', { cx: x + w / 2, cy: base - c.w * U, rx: w / 2, ry, class: 'juice-top' });
    el('ellipse', { cx: x + w / 2, cy: base, rx: w / 2, ry, class: 'juice-bot' });
    el('ellipse', { cx: x + w / 2, cy: base - cupH, rx: w / 2, ry, class: 'glass-top' });
    el('text', { x: x + w / 2, y: base + ry + 26, class: 'cup-t' }, `直径 ${c.d} cm`);
    el('text', { x: x + w + 6, y: base - (c.w * U) / 2 + 6, class: 'cup-t s' }, `${c.w} cm`);
    el('text', { x: x + w / 2, y: base - cupH - ry - 8, class: 'cup-n' }, `第 ${i + 1} 杯`);
    x += w + 80;
  });
}

window.LESSON = {
  init() {
    initSame();
    initQiepin();
    initCups();
  },
  onRender(slide) { VIEWS.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
