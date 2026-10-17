'use strict';
/* 九上 2.6 正多边形与圆 · 本课互动：n 等分圆周 vs 随手取点、正六边形旋转重合、对称轴与中心对称、尺规作正方形/正六边形（分步）。
 * 通用部分见 ../shared/math.js、mgeo.js、mcheck.js。所有图形由坐标计算，作图板横纵同比例；读数由坐标实时算出。 */
const { fmt, slider } = MathKit;
const { add, sub, mul, len, dist, angle, foot, arc, right } = Geo;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const HIDE = [99, 99];
const H2 = [HIDE, HIDE];
const val = (v) => (typeof v === 'function' ? v() : v);
const dirv = (d) => [Math.cos(d * RAD), Math.sin(d * RAD)];
const onC = (O, r, d) => add(O, mul(dirv(d), r));
const circ = (b, O, r, cls = 'circ') => b.curve((t) => onC(val(O), val(r), 360 * t), 0, 1, { cls, n: 180 });
const away = (P, O, off) => { const d = sub(P, O); const l = len(d) || 1; return add(P, mul(d, off / l)); };
const O = [0, 0];
/** 正 n 边形顶点（半径 r，第一个顶点方向 a0） */
const ngon = (n, r, a0) => Array.from({ length: n }, (_, k) => onC(O, r, a0 + (360 * k) / n));
const LETTERS = 'ABCDEFGHIJKL';

/** 静态正多边形示意图：顶点方向 a0 起逆时针；extra 回调可再画线 */
function polyFig(el, { n, r = 2, a0 = 90, w = 300, circle = true, extra }) {
  const b = Geo.board(el, { x: [-r - 0.6, r + 0.6], y: [-r - 0.6, r + 0.6], w });
  if (circle) circ(b, O, r);
  const V = ngon(n, r, a0);
  b.poly(V, { cls: 'pg' });
  V.forEach((p, k) => b.text(away(p, O, 0.3), LETTERS[k], { dx: -6, dy: 7 }));
  b.pt(O, { r: 3 });
  if (extra) extra(b, V);
  b.update();
  return { b, V };
}

/* ---------- 第 3 页：菱形与矩形 ---------- */
function initCounter() {
  const b = Geo.board($('cx'), { x: [-0.4, 7.8], y: [-0.5, 2.3], w: 480 });
  const h = Math.sqrt(3);
  const R = [[0, 0], [2, 0], [3, h], [1, h]];
  b.poly(R, { cls: 'rh' });
  arc(b, R[0], R[1], R[3], { r: 0.4, label: '60°', lr: 2 });
  arc(b, R[1], R[2], R[0], { r: 0.35, label: '120°', lr: 2.4 });
  const Q = [[4.4, 0.15], [7.4, 0.15], [7.4, 1.65], [4.4, 1.65]];
  b.poly(Q, { cls: 'rc' });
  Q.forEach((p, k) => right(b, p, Q[(k + 1) % 4], Q[(k + 3) % 4], { s: 0.18 }));
  b.text([1.5, 0], '菱形：四边都是 2', { dx: -50, dy: 22, cls: 'lb up cap' });
  b.text([5.9, 0.15], '矩形：长 3、宽 1.5', { dx: -52, dy: 22, cls: 'lb up cap' });
  b.update();
}

/* ---------- 第 4 页：n 等分圆周 ---------- */
function initDivide() {
  const R = 2.6;
  const s = { n: 5, rand: null };
  const angs = () => s.rand || Array.from({ length: s.n }, (_, k) => 90 + (360 * k) / s.n);
  const V = () => angs().map((d) => onC(O, R, d));
  const b = Geo.board($('nd'), { x: [-3.3, 3.3], y: [-3.2, 3.2], w: 460 });
  circ(b, O, R);
  for (let k = 0; k < 12; k++) b.seg(() => (k < s.n ? [O, V()[k]] : H2), { cls: 'rad' });
  arc(b, O, () => V()[0], () => V()[1], { r: 0.6, cls: 'garc on', label: () => `${fmt(((angs()[1] - angs()[0]) % 360 + 360) % 360, 1)}°`, lr: 1.9 });
  b.poly(V, { cls: 'pg' });
  for (let k = 0; k < 12; k++) b.pt(() => (k < s.n ? V()[k] : null), { r: 5, cls: 'vx' });
  b.pt(O, { r: 3 });
  b.text(O, 'O', { dx: 6, dy: 18 });
  const sides = () => V().map((p, k, a) => dist(p, a[(k + 1) % a.length]));
  const inner = () => V().map((p, k, a) => angle(p, a[(k + a.length - 1) % a.length], a[(k + 1) % a.length]));
  b.onUpdate = () => {
    const sd = sides();
    const ia = inner();
    const ratio = Math.min(...sd) / Math.max(...sd);
    const eq = !s.rand;
    $('ndNv').textContent = s.n;
    $('ndC').textContent = eq ? `${fmt(360 / s.n, 2)}°` : '不相等';
    $('ndS').textContent = `1 : ${fmt(1 / ratio, 2)}`;
    $('ndA1').textContent = `${fmt(Math.min(...ia), 1)}°`;
    $('ndA2').textContent = `${fmt(Math.max(...ia), 1)}°`;
    const msg = $('ndMsg');
    msg.className = `tip feedback ${eq ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = eq
      ? `各边相等，各角都是 ${fmt(ia[0], 2)}°——内接正 ${s.n} 边形。`
      : '点都在圆上，但没有等分：边不相等、角也不相等，不是正多边形。';
  };
  const MIN_GAP = 12;
  const randomAngles = (n) => {
    for (;;) {
      const a = Array.from({ length: n }, () => Math.random() * 360).sort((x, y) => x - y);
      const ok = a.every((v, k) => (k ? v - a[k - 1] : v + 360 - a[n - 1]) > MIN_GAP);
      if (ok) return a;
    }
  };
  slider($('ndN'), (v) => { s.n = v; s.rand = null; b.update(); });
  $('ndRand').addEventListener('click', () => { s.rand = randomAngles(s.n); b.update(); });
  $('ndEq').addEventListener('click', () => { s.rand = null; b.update(); });
}

/* ---------- 第 6 页：正六边形绕中心旋转 ---------- */
function initRotate() {
  const R = 2.6;
  const A0 = 240; // 图 2-55：A 在左下，逆时针 B、C、D、E、F
  const s = { t: 0 };
  const base = ngon(6, R, A0);
  const b = Geo.board($('rt'), { x: [-3.4, 3.4], y: [-3.3, 3.3], w: 460 });
  circ(b, O, R);
  b.poly(base, { cls: 'pg' });
  [0, 3, 1, 4, 2, 5].forEach((k) => { if (k < 3) b.seg([base[k], base[k + 3]], { cls: 'gdash' }); });
  const rot = () => ngon(6, R, A0 + s.t);
  b.poly(rot, { cls: 'copy' });
  base.forEach((p, k) => b.text(away(p, O, 0.32), LETTERS[k], { dx: -6, dy: 7 }));
  b.pt(() => rot()[0], { r: 6, cls: 'vx' });
  b.text(() => away(rot()[0], O, -0.42), 'A′', { dx: -8, dy: 7, cls: 'lb ac' });
  b.pt(O, { r: 3 });
  b.text(O, 'O', { dx: 6, dy: 18 });
  const SNAP = 3;
  b.onUpdate = () => {
    const k = Math.round(s.t / 60);
    const hit = Math.abs(s.t - 60 * k) < 1e-9 && k % 6 !== 0;
    $('rtAv').textContent = `${s.t}°`;
    const msg = $('rtMsg');
    msg.className = `tip feedback ${hit ? 'fb-ok' : ''}`;
    msg.textContent = hit
      ? `转了 ${s.t}°：与原图重合！A 转到了 ${LETTERS[k % 6]}，每条边都转到了另一条边上。`
      : s.t % 360 === 0 ? '橙色是透明纸上的图形，现在与原图叠在一起。拖动滑块旋转。' : `转了 ${s.t}°：不重合。`;
  };
  slider($('rtA'), (v) => {
    const k = Math.round(v / 60);
    s.t = Math.abs(v - 60 * k) < SNAP ? 60 * k : v;
    b.update();
  });
}

/* ---------- 第 8 页：对称性 ---------- */
function initSym() {
  const R = 2.5;
  const s = { n: 6, rot: false };
  const V = () => ngon(s.n, R, 90);
  const b = Geo.board($('sy'), { x: [-3.4, 3.4], y: [-3.1, 3.1], w: 460 });
  for (let k = 0; k < 8; k++) {
    b.seg(() => {
      if (k >= s.n) return H2;
      const d = dirv(90 + (180 * k) / s.n);
      return [mul(d, -3.1), mul(d, 3.1)];
    }, { cls: 'axis' });
  }
  b.poly(V, { cls: 'pg' });
  b.poly(() => (s.rot ? ngon(s.n, R, 270) : []), { cls: 'copy dashc' });
  b.pt(O, { r: 4 });
  b.onUpdate = () => {
    const even = s.n % 2 === 0;
    $('syAx').textContent = s.n;
    $('syC').textContent = even ? '是' : '不是';
    const msg = $('syMsg');
    msg.className = `tip feedback ${s.rot ? (even ? 'fb-ok' : 'fb-warn') : ''}`;
    msg.textContent = s.rot
      ? (even ? `正 ${s.n} 边形转 180° 后与自身重合：是中心对称图形。` : `正 ${s.n} 边形转 180° 后（橙色虚线）与原图不重合：不是中心对称图形。`)
      : `正 ${s.n} 边形有 ${s.n} 条对称轴（紫色虚线），都经过中心。`;
  };
  $('syBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.id === 'syRot') { s.rot = !s.rot; btn.classList.toggle('solid', s.rot); } else {
      s.n = +btn.dataset.n;
      $('syBtns').querySelectorAll('[data-n]').forEach((x) => x.classList.toggle('solid', x === btn));
    }
    b.update();
  });
  b.update();
}

/* ---------- 第 9 页：尺规作正方形、正六边形 ---------- */
function initConstruct() {
  const R = 2.4;
  const s = { m: 4, k: 0 };
  const P = (d) => onC(O, R, d);
  const STEPS = {
    4: ['在 $\\odot O$ 中作两条互相垂直的直径 $AC$、$BD$．', '依次连接 $A$、$B$、$C$、$D$ 各点．四边形 $ABCD$ 就是所求作的正方形．'],
    6: ['在 $\\odot O$ 中任意作一条直径 $AD$．', '分别以点 $A$、$D$ 为圆心，$\\odot O$ 的半径为半径作弧，与 $\\odot O$ 相交于点 $B$、$F$ 和点 $C$、$E$．', '依次连接 $A$、$B$、$C$、$D$、$E$、$F$ 各点．六边形 $ABCDEF$ 就是所求作的正六边形．'],
  };
  // 正方形：A 90°，B 180°，C 270°，D 0°；正六边形：A 180°，B 240°，C 300°，D 0°，E 60°，F 120°
  const SQ = [90, 180, 270, 0].map(P);
  const HX = [180, 240, 300, 0, 60, 120].map(P);
  const b = Geo.board($('cs'), { x: [-3.3, 3.3], y: [-3.1, 3.1], w: 460 });
  circ(b, O, R);
  const sq = () => s.m === 4;
  const hx = () => s.m === 6;
  b.seg(() => (sq() && s.k >= 1 ? [SQ[0], SQ[2]] : H2), { cls: 'gs' });
  b.seg(() => (sq() && s.k >= 1 ? [SQ[1], SQ[3]] : H2), { cls: 'gs' });
  right(b, () => (sq() && s.k >= 1 ? O : HIDE), SQ[0], SQ[3], { s: 0.25 });
  b.poly(() => (sq() && s.k >= 2 ? SQ : []), { cls: 'pg' });
  b.seg(() => (hx() && s.k >= 1 ? [HX[0], HX[3]] : H2), { cls: 'gs' });
  // 以 A、D 为圆心、R 为半径的弧（只画圆内附近的一段，经过交点 B、F 与 C、E）
  b.curve((t) => (hx() && s.k >= 2 ? onC(HX[0], R, -75 + 150 * t) : [NaN, NaN]), 0, 1, { cls: 'carc', n: 80 });
  b.curve((t) => (hx() && s.k >= 2 ? onC(HX[3], R, 105 + 150 * t) : [NaN, NaN]), 0, 1, { cls: 'carc', n: 80 });
  b.poly(() => (hx() && s.k >= 3 ? HX : []), { cls: 'pg' });
  const vis = (i) => (sq() ? (s.k >= 1 ? SQ[i] : null) : (i === 0 || i === 3 ? (s.k >= 1 ? HX[i] : null) : (s.k >= 2 ? HX[i] : null)));
  for (let i = 0; i < 6; i++) {
    b.pt(() => (sq() && i > 3 ? null : vis(i)), { r: 4, cls: 'vx' });
    b.text(() => { const p = sq() && i > 3 ? null : vis(i); return p ? away(p, O, 0.3) : null; }, LETTERS[i], { dx: -6, dy: 7 });
  }
  b.pt(O, { r: 3 });
  b.text(O, 'O', { dx: 6, dy: 18 });
  const ol = $('csSteps');
  const render = () => {
    ol.innerHTML = STEPS[s.m].map((t, i) => `<li class="${i < s.k ? 'done' : ''}">${t}</li>`).join('');
    MathKit.tex(ol);
    b.update();
  };
  $('csBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.m) {
      s.m = +btn.dataset.m; s.k = 0;
      $('csBtns').querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('solid', x === btn));
    } else if (btn.id === 'csNext') s.k = Math.min(s.k + 1, STEPS[s.m].length);
    else s.k = 0;
    render();
  });
  render();
}

/* ---------- 静态精确图 ---------- */
function initFigs() {
  polyFig($('f254'), { n: 5, r: 2, a0: 90, w: 320 });
  polyFig($('f256'), {
    n: 6, r: 4, a0: 240, w: 320, circle: false,
    extra: (b, V) => {
      const G = foot(O, V[0], V[1]);
      b.seg([O, V[0]], { cls: 'gdash' }); b.seg([O, V[1]], { cls: 'gdash' }); b.seg([O, G], { cls: 'gdash' });
      right(b, G, O, V[1], { s: 0.3 });
      b.text(G, 'G', { dx: -6, dy: 22 });
      b.text(O, 'O', { dx: -6, dy: -8 });
    },
  });
  polyFig($('q2'), { n: 6, r: 2, a0: 240, w: 200, circle: false, extra: (b, V) => { b.seg([V[0], V[3]], { cls: 'gs' }); b.seg([V[0], V[2]], { cls: 'gs' }); } });
}

window.LESSON = {
  init() {
    initCounter();
    initDivide();
    initRotate();
    initSym();
    initConstruct();
    initFigs();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
