'use strict';
/* 九上 2.1 圆 · 本课互动：动态画圆、点与圆的位置关系（撒点）、图 2-3 点的集合、弦与弧、例题精确作图。
 * 作图板横纵同比例；交点、角度、距离都由坐标计算。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const polar = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] + r * Math.sin(deg * RAD)];
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const angOf = (c, p) => ((Math.atan2(p[1] - c[1], p[0] - c[0]) / RAD) + 360) % 360;
/** 圆心 c、半径 r、从 a0 到 a1 度（逆时针）的折线点列 */
const arcPts = (c, r, a0, a1, n = 120) => Array.from({ length: n + 1 }, (_, i) => polar(c, r, a0 + ((a1 - a0) * i) / n));

/* 第 3 页：拖动 P 绕 O 转一周，留下轨迹 */
function initDraw() {
  const O = [0, 0];
  const s = { r: 2, ang: 0, lo: 0, hi: 0, prev: 0 };
  const b = board($('draw'), { x: [-3.6, 3.6], y: [-3.6, 3.6], axes: false, grid: false, w: 480 });
  b.curve((t) => polar(O, s.r, t), () => s.lo, () => s.hi, { cls: 'trace' });
  b.seg(() => [O, polar(O, s.r, s.ang)], { cls: 'c1' });
  b.pt(O);
  b.text(O, 'O', { dx: -20, dy: 20 });
  b.text(() => polar(O, s.r, s.ang), 'P', { dx: 12, dy: -10 });
  b.drag(() => polar(O, s.r, s.ang), (x, y) => {
    const a = Math.atan2(y, x) / RAD;
    let d = a - s.prev;
    d -= 360 * Math.round(d / 360);
    s.prev = a;
    s.ang += d;
    s.lo = Math.min(s.lo, s.ang);
    s.hi = Math.max(s.hi, s.ang);
  });
  b.onUpdate = () => {
    $('drRV').textContent = fmt(s.r);
    const swept = s.hi - s.lo;
    const msg = $('drMsg');
    msg.className = `tip feedback ${swept >= 360 ? 'fb-ok' : ''}`;
    msg.textContent = swept >= 360
      ? `转满一周！P 运动形成的图形就是圆；P 到 O 的距离始终是 ${fmt(s.r)}。`
      : `已转过 ${Math.round(Math.min(swept, 360))}°，P 到 O 的距离始终是 ${fmt(s.r)}。`;
  };
  const reset = () => { s.ang = 0; s.lo = 0; s.hi = 0; s.prev = 0; b.update(); };
  $('drReset').addEventListener('click', reset);
  slider($('drR'), (v) => { s.r = v; reset(); });
}

/* 第 4 页：点与圆的位置关系 */
const DOT_N = 400;
function initPos() {
  const O = [0, 0];
  const s = { r: 2, P: [2.6, 1.2], dots: false };
  const b = board($('pos'), { x: [-4, 4], y: [-3.6, 3.6], axes: false, grid: false, w: 520 });
  // 伪随机撒点（固定种子，每次一样）
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const pts = Array.from({ length: DOT_N }, () => [rnd() * 7.6 - 3.8, rnd() * 7 - 3.5]);
  const dotLayer = pts.map((p) => b.pt(() => (s.dots ? p : null), { r: 3 }));
  b.curve((t) => polar(O, s.r, t), 0, 360, { cls: 'c1' });
  b.seg(() => [O, s.P], { cls: 'dash' });
  b.seg(() => [O, polar(O, s.r, -90)], { cls: 'rline' });
  b.text(() => polar(O, s.r / 2, -90), 'r', { dx: 8, dy: 4 });
  b.pt(O);
  b.text(O, 'O', { dx: -20, dy: 20 });
  b.text(() => s.P, 'P', { dx: 12, dy: -12 });
  b.drag(() => s.P, (x, y) => {
    s.P = [Math.max(-3.8, Math.min(3.8, x)), Math.max(-3.4, Math.min(3.4, y))];
    const d = dist(O, s.P);
    if (Math.abs(d - s.r) < 0.08) s.P = polar(O, s.r, angOf(O, s.P)); // 靠近圆周时吸附到圆上
  });
  b.onUpdate = () => {
    const d = dist(O, s.P);
    const dd = Math.round(d * 10) / 10;
    const k = Math.abs(d - s.r) < 1e-6 ? 0 : Math.sign(d - s.r);
    $('posRV').textContent = fmt(s.r);
    $('posD').textContent = fmt(dd, 1);
    $('posRr').textContent = fmt(s.r);
    const msg = $('posMsg');
    msg.className = `tip feedback k${k}`;
    msg.innerHTML = [`$d&lt;r$：点 $P$ 在<b>圆内</b>`, `$d=r$：点 $P$ 在<b>圆上</b>`, `$d&gt;r$：点 $P$ 在<b>圆外</b>`][k + 1];
    tex(msg);
    dotLayer.forEach((c, i) => {
      const e = dist(O, pts[i]) - s.r;
      c.setAttribute('class', `pt dot ${Math.abs(e) < 0.05 ? 'on' : (e < 0 ? 'in' : 'out')}`);
    });
  };
  $('posDots').addEventListener('click', () => {
    s.dots = !s.dots;
    $('posDots').textContent = s.dots ? '收起点' : `撒 ${DOT_N} 个点`;
    b.update();
  });
  slider($('posR'), (v) => { s.r = v; b.update(); });
}

/* 第 5 页：图 2-3，PQ = 2，⊙P 半径 1，⊙Q 半径 1.5 */
function initSet() {
  const P = [0, 0];
  const Q = [2, 0];
  const R1 = 1;
  const R2 = 1.5;
  const s = { k: 0 };
  const b = board($('set'), { x: [-1.6, 3.9], y: [-1.9, 1.9], axes: false, grid: false, w: 560 });
  // 两圆交点：x = (d² + r1² − r2²) / 2d
  const ix = (4 + R1 * R1 - R2 * R2) / 4;
  const iy = Math.sqrt(R1 * R1 - ix * ix);
  const I1 = [ix, iy];
  const I2 = [ix, -iy];
  // 区域 (3)：⊙P 上远离 Q 的大弧 + ⊙Q 在 ⊙P 内的小弧
  const aP = Math.atan2(iy, ix) / RAD;
  const aQ = Math.atan2(iy, ix - 2) / RAD; // 约 151°
  const region = [...arcPts(P, R1, aP, 360 - aP), ...arcPts(Q, R2, 360 - aQ, aQ)];
  b.poly(() => (s.k >= 3 ? region : []), { cls: 'moon' });
  b.curve((t) => polar(P, R1, t), 0, 360, { cls: 'c1 cp' });
  b.curve((t) => polar(Q, R2, t), 0, 360, { cls: 'c3 cq' });
  b.seg([P, Q], { cls: 'pq' });
  b.pt(P); b.pt(Q);
  b.text(P, 'P', { dx: -8, dy: 24 });
  b.text(Q, 'Q', { dx: -6, dy: 24 });
  b.text([1, 0], '2 cm', { cls: 'lb up c', dy: -8 });
  b.pt(() => (s.k >= 2 ? I1 : null), { cls: 'c2', r: 7 });
  b.pt(() => (s.k >= 2 ? I2 : null), { cls: 'c2', r: 7 });
  const circles = b.svg.querySelectorAll('.cp, .cq');
  b.onUpdate = () => circles.forEach((c) => { c.style.display = s.k >= 1 ? '' : 'none'; });
  $('setBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = +btn.dataset.k;
    $('setBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', +x.dataset.k <= s.k));
    b.update();
  });
  b.update();
}

/* 第 7 页：弦与弧 */
function initArc() {
  const O = [0, 0];
  const R = 2;
  const s = { c: 140, d: 30 };
  const b = board($('arc'), { x: [-2.9, 2.9], y: [-2.6, 2.6], axes: false, grid: false, w: 460 });
  const ccw = () => ((s.d - s.c) % 360 + 360) % 360; // 从 C 逆时针到 D 的度数
  const minor = () => (ccw() <= 180 ? [s.c, s.c + ccw()] : [s.d, s.d + 360 - ccw()]);
  const major = () => { const [a0, a1] = minor(); return [a1, a0 + 360]; };
  b.curve((t) => polar(O, R, t), () => major()[0], () => major()[1], { cls: 'c1 thick' });
  b.curve((t) => polar(O, R, t), () => minor()[0], () => minor()[1], { cls: 'c2 thick' });
  b.seg(() => [O, polar(O, R, s.c)], { cls: 'thin' });
  b.seg(() => [O, polar(O, R, s.d)], { cls: 'thin' });
  b.curve((t) => polar(O, 0.35, t), () => minor()[0], () => minor()[1], { cls: 'amark' });
  b.seg(() => [polar(O, R, s.c), polar(O, R, s.d)], { cls: 'chord' });
  b.pt(O);
  b.text(O, 'O', { dx: -6, dy: 24 });
  b.text(() => polar(O, R, s.c), 'C', { dx: -6, dy: -14 });
  b.text(() => polar(O, R, s.d), 'D', { dx: 8, dy: -10 });
  const snap = (a) => {
    const other = a === 'c' ? s.d : s.c;
    const opp = (other + 180) % 360;
    return (v) => (Math.abs(((v - opp + 540) % 360) - 180) < 4 ? opp : Math.round(v));
  };
  b.drag(() => polar(O, R, s.c), (x, y) => { s.c = snap('c')(angOf(O, [x, y])); });
  b.drag(() => polar(O, R, s.d), (x, y) => { s.d = snap('d')(angOf(O, [x, y])); });
  b.onUpdate = () => {
    const m = Math.min(ccw(), 360 - ccw());
    $('arcAng').textContent = `${m}°`;
    $('arcMin').textContent = `${m}°`;
    $('arcMaj').textContent = `${360 - m}°`;
    const msg = $('arcMsg');
    const dia = m === 180;
    msg.className = `tip feedback ${dia ? 'fb-ok' : ''}`;
    msg.innerHTML = dia
      ? '弦 $CD$ 经过圆心：它是<b>直径</b>；两条弧都是<b>半圆</b>。'
      : `弦 $CD$ 长 ${fmt(dist(polar(O, R, s.c), polar(O, R, s.d)))}（半径 2）；劣弧 ${m}°，优弧 ${360 - m}°。`;
    tex(msg);
  };
  b.update();
}

/* 第 8 页：长度相等但不能重合的两条弧（r = 40, 90° 与 r = 80, 45°，弧长都是 20π） */
function initEqualArcs() {
  const path = (c, r, a0, a1) => {
    const p0 = [c[0] + r * Math.cos(a0 * RAD), c[1] - r * Math.sin(a0 * RAD)];
    const p1 = [c[0] + r * Math.cos(a1 * RAD), c[1] - r * Math.sin(a1 * RAD)];
    return `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 0 0 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`;
  };
  const set = (id, d, col) => { const e = $(id); e.setAttribute('d', d); e.setAttribute('fill', 'none'); e.setAttribute('stroke', col); e.setAttribute('stroke-width', '3'); };
  set('arcSmall', path([42, 100], 40, 45, 135), '#d9711c');
  set('arcBig', path([116, 158], 80, 67.5, 112.5), '#1d6fa5');
}

/* 第 9 页：图 2-7。内圆半径 0.55，外圆半径 1；A 200°、B 280°、C 150°、D 70°（∠AOB = ∠COD = 80°） */
function initEx1() {
  const O = [0, 0];
  const A = polar(O, 0.55, 200);
  const B = polar(O, 0.55, 280);
  const C = polar(O, 1, 150);
  const D = polar(O, 1, 70);
  const b = board($('ex1'), { x: [-1.35, 1.35], y: [-1.15, 1.2], axes: false, grid: false, w: 360 });
  b.curve((t) => polar(O, 1, t), 0, 360, { cls: 'thin dk' });
  b.curve((t) => polar(O, 0.55, t), 0, 360, { cls: 'thin dk' });
  b.poly([B, O, C], { cls: 'tri1' });
  b.poly([A, O, D], { cls: 'tri2' });
  [[O, 'O', 6, 18], [A, 'A', -20, 10], [B, 'B', -4, 24], [C, 'C', -22, -6], [D, 'D', 6, -8]].forEach(([p, n, dx, dy]) => { b.pt(p, { r: 3 }); b.text(p, n, { dx, dy }); });
}

/* 第 10 页：图 2-8。半径 1；∠C = 20°，CD = OA ⇒ OC = 2cos20° */
function initEx2() {
  const O = [0, 0];
  const c20 = Math.cos(20 * RAD);
  const C = [-2 * c20, 0];
  const u = [c20, Math.sin(20 * RAD)];
  const D = [C[0] + u[0], C[1] + u[1]];
  const sE = 4 * c20 * c20 - 1; // 直线 CD 与圆的另一个交点
  const E = [C[0] + sE * u[0], C[1] + sE * u[1]];
  const b = board($('ex2'), { x: [-2.25, 1.35], y: [-1.15, 1.2], axes: false, grid: false, w: 460 });
  b.curve((t) => polar(O, 1, t), 0, 360, { cls: 'thin dk' });
  b.seg([C, [1, 0]], { cls: 'thin dk' });
  b.seg([C, E], { cls: 'thin dk' });
  b.seg([O, E], { cls: 'thin dk' });
  b.seg([O, D], { cls: 'dash' });
  const angE = Math.round(angOf(O, E));
  [[O, 'O', -6, 22], [[-1, 0], 'A', -4, 22], [[1, 0], 'B', 6, 20], [C, 'C', -18, 6], [D, 'D', -8, -10], [E, 'E', 4, -8]].forEach(([p, n, dx, dy]) => { b.pt(p, { r: 3 }); b.text(p, n, { dx, dy }); });
  b.text(O, `∠BOE = ${angE}°`, { cls: 'lb up sm', dx: 20, dy: -12 });
}

MProof.addBasis({
  'same-r': { t: '同圆的半径相等', kind: '性质', src: '九上 2.1（课本 p40）', body: '同圆或等圆的半径相等．<br>同心圆中，同一个圆上的点到圆心的距离相等．' },
  sas: { t: 'SAS', kind: '基本事实', src: '八上 1.3 探索三角形全等的条件', body: '两边及其夹角分别相等的两个三角形全等（简写成“边角边”或“SAS”）．' },
  'cong-ang': { t: '全等三角形的对应角相等', kind: '性质', src: '八上 1.2 全等三角形', body: '全等三角形的对应边相等，对应角相等．' },
});

window.LESSON = {
  init() {
    MProof.init();
    initDraw();
    initPos();
    initSet();
    initArc();
    initEqualArcs();
    initEx1();
    initEx2();
  },
};
