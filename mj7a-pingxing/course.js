'use strict';
/* 七上 6.4 平行 · 本课互动：转动直线找唯一平行线、推三角尺画平行线、过中点的平行线、方格纸走法、平行线与角。
 * 交点、长度、角度全部由坐标计算（MAngle 见 ../shared/mangle.js），作图板横纵同比例。 */
const { board, slider, fmt } = MathKit;
const { at, dir, size, square } = MAngle;
const $ = (id) => document.getElementById(id);
const O0 = [0, 0];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const mul = (p, k) => [p[0] * k, p[1] * k];
const cross = (p, q) => p[0] * q[1] - p[1] * q[0];
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const unit = (d) => [Math.cos((d * Math.PI) / 180), Math.sin((d * Math.PI) / 180)];
/** 直线 p + t·r 与 q + u·s 的交点（平行时返回 null） */
const meet = (p, r, q, s) => { const k = cross(r, s); return Math.abs(k) < 1e-12 ? null : add(p, mul(r, cross(sub(q, p), s) / k)); };
/** 点击作图板 → 世界坐标 */
const toWorld = (b, opt, e) => {
  const pt = b.svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  const q = pt.matrixTransform(b.svg.getScreenCTM().inverse());
  return [opt.x[0] + (q.x / b.W) * (opt.x[1] - opt.x[0]), opt.y[1] - (q.y / b.H) * (opt.y[1] - opt.y[0])];
};

/* 第 3 页：图 6-32 与长方体 */
function initDefs() {
  const b = board($('f632'), { x: [-0.5, 8.5], y: [-0.4, 2.4], axes: false, grid: false, w: 520 });
  const e = unit(14);
  const a0 = [0.6, 0.2];
  const b0 = [0, 1.1];
  b.seg([a0, add(a0, mul(e, 7.6))], { cls: 'line' });
  b.seg([b0, add(b0, mul(e, 7.6))], { cls: 'line' });
  const A = add(a0, mul(e, 2.2)); const B = add(a0, mul(e, 4.6));
  const C = add(b0, mul(e, 1.6)); const D = add(b0, mul(e, 4.2));
  [[A, 'A', -4, 24], [B, 'B', -4, 24], [C, 'C', -6, -10], [D, 'D', -6, -10]].forEach(([p, t, dx, dy]) => { b.pt(p, { r: 4, cls: 'c2' }); b.text(p, t, { dx, dy }); });
  b.text(add(a0, mul(e, 7.6)), 'a', { dx: 6, dy: 6 });
  b.text(add(b0, mul(e, 7.6)), 'b', { dx: 6, dy: 6 });
  b.update();

  const bx = board($('box'), { x: [-0.8, 5.2], y: [-0.5, 3.0], axes: false, grid: false, w: 420 });
  const P = { A: [0, 0], B: [3, 0], C: [4.2, 0.8], D: [1.2, 0.8], E: [0, 1.8], F: [3, 1.8], G: [4.2, 2.6], H: [1.2, 2.6] };
  const E = [['A', 'B'], ['B', 'C'], ['A', 'E'], ['B', 'F'], ['C', 'G'], ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'E']];
  const HID = [['A', 'D'], ['D', 'C'], ['D', 'H']];
  E.forEach(([p, q]) => bx.seg([P[p], P[q]], { cls: (p === 'A' && q === 'B') || (p === 'C' && q === 'G') ? 'ray hl' : 'edge' }));
  HID.forEach(([p, q]) => bx.seg([P[p], P[q]], { cls: 'dash' }));
  const OFF = { A: [-18, 16], B: [4, 18], C: [6, 10], D: [-18, -4], E: [-18, -4], F: [-14, -8], G: [6, -4], H: [-6, -10] };
  Object.entries(P).forEach(([k, p]) => bx.text(p, k, { dx: OFF[k][0], dy: OFF[k][1], cls: 'lb sm' }));
  bx.update();
}

/* 第 4 页：转动过点 A（或 B）的直线（图 6-35） */
function initSpin() {
  const PTS = { A: [-0.8, 2], B: [1.6, -1.6] };
  const XR = 6;
  const s = { k: 'A', f: 12 };
  const b = board($('spin'), { x: [-XR, XR], y: [-2.6, 3.2], axes: false, grid: false, w: 600 });
  const Q = () => PTS[s.k];
  b.seg([[-XR, 0], [XR, 0]], { cls: 'line' });
  b.text([XR, 0], 'l', { dx: -16, dy: -8 });
  b.seg(() => [add(Q(), mul(unit(s.f), -20)), add(Q(), mul(unit(s.f), 20))], { cls: 'ray hl' });
  const X = () => (s.f === 0 ? null : Q()[0] - Q()[1] / Math.tan((s.f * Math.PI) / 180));
  b.pt(() => (X() !== null && Math.abs(X()) < XR - 0.2 ? [X(), 0] : null), { r: 6, cls: 'c2' });
  Object.entries(PTS).forEach(([k, p]) => { b.pt(p, { r: 5 }); b.text(p, k, { dx: -22, dy: -8 }); });
  b.drag(() => add(Q(), mul(unit(s.f), 3.2)), (x, y) => {
    let d = dir(Q(), [x, y]);
    if (d > 90 && d < 270) d -= 180;
    if (d >= 270) d -= 360;
    s.f = clamp(Math.round(d * 2) / 2, -30, 30);
    $('spinR').value = s.f;
  });
  b.onUpdate = () => {
    $('spinV').textContent = `${s.f}°`;
    const msg = $('spinMsg');
    const x = X();
    if (x === null) { msg.className = 'tip feedback fb-ok'; msg.textContent = `倾斜角 0°：过点 ${s.k} 的直线与 l 永不相交——平行。`; return; }
    msg.className = 'tip feedback';
    const far = Math.abs(x) >= XR - 0.2;
    msg.textContent = `倾斜角 ${s.f}°：与 l 相交，交点在点 ${s.k} 的${x > Q()[0] ? '右' : '左'}方，距点 ${s.k} 的水平距离约 ${fmt(Math.abs(x - Q()[0]), 1)}${far ? '（已在画面外）' : ''}。`;
  };
  slider($('spinR'), (v) => { s.f = v; b.update(); });
  $('spinBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.p) {
      s.k = btn.dataset.p;
      $('spinBtns').querySelectorAll('[data-p]').forEach((x) => x.classList.toggle('solid', x === btn));
    }
    if (btn.id === 'spinZero') { s.f = 0; $('spinR').value = 0; }
    b.update();
  });
}

/* 第 5 页：推三角尺（图 6-33） */
function initPush() {
  const PHI = -12;
  const e = unit(PHI);
  const n = unit(PHI + 90);
  const LEG1 = 4;
  const LEG2 = 2.3;
  const U0 = [0.4, -1.7];
  const V0 = add(U0, mul(e, LEG1));
  const W0 = add(U0, mul(n, LEG2));
  const hyp = sub(W0, V0);
  const d = mul(hyp, 1 / Math.hypot(...hyp)); // 沿直尺滑动的方向
  const m = cross(d, sub(U0, V0)) > 0 ? [d[1], -d[0]] : [-d[1], d[0]]; // 直尺所在一侧（远离直角顶点）
  const T_STAR = 2.4;
  const P = add(add(U0, mul(d, T_STAR)), mul(e, 1.9));
  const s = { t: 0, lines: [] };
  const MAXL = 6;
  const b = board($('push'), { x: [-5.2, 4.8], y: [-2.6, 3.6], axes: false, grid: false, w: 600 });
  const U = () => add(U0, mul(d, s.t));
  const longLine = (p) => [add(p, mul(e, -9)), add(p, mul(e, 9))];
  b.seg(longLine(U0), { cls: 'line' });
  b.text(add(U0, mul(e, 4.4)), 'a', { dx: 0, dy: 22 });
  const R0 = add(V0, mul(d, -0.8));
  const R1 = add(W0, mul(d, 3.8));
  b.poly([R0, R1, add(R1, mul(m, 0.5)), add(R0, mul(m, 0.5))], { cls: 'ruler' });
  for (let k = 0; k <= 36; k += 1) {
    const p = add(R0, mul(d, k * 0.25));
    b.seg([p, add(p, mul(m, k % 4 === 0 ? 0.22 : 0.12))], { cls: 'tick' });
  }
  for (let i = 0; i < MAXL; i++) b.seg(() => (s.lines[i] === undefined ? [O0, O0] : longLine(add(U0, mul(d, s.lines[i])))), { cls: 'drawn' });
  b.poly(() => [U(), add(U(), mul(e, LEG1)), add(U(), mul(n, LEG2))], { cls: 'setsq' });
  b.seg(() => [U(), add(U(), mul(e, LEG1))], { cls: 'ray hl' });
  square(b, U, PHI, 0.25);
  b.pt(P, { r: 5 });
  b.text(P, 'P', { dx: 6, dy: -8 });
  const cen = () => add(U(), mul(add(mul(e, LEG1), mul(n, LEG2)), 1 / 3));
  b.drag(cen, (x, y) => {
    const t = (x - cen()[0]) * d[0] + (y - cen()[1]) * d[1] + s.t;
    const c = clamp(t, -0.4, 3.6);
    s.t = Math.abs(c - T_STAR) < 0.15 ? T_STAR : c;
  });
  b.onUpdate = () => {
    const msg = $('pushMsg');
    const onP = s.t === T_STAR;
    msg.className = `tip feedback ${onP ? 'fb-ok' : ''}`;
    msg.textContent = onP ? '贴边正好经过点 P：沿这条边画出的直线，就是过点 P 且与 a 平行的直线。'
      : `已画 ${s.lines.length} 条线。拖三角尺上的橙色点，沿直尺推一推；推到贴边经过点 P 试试。`;
  };
  $('pushDraw').addEventListener('click', () => {
    if (!s.lines.some((t) => Math.abs(t - s.t) < 0.05)) s.lines = [...s.lines, s.t].slice(-MAXL);
    b.update();
  });
  $('pushClr').addEventListener('click', () => { s.lines = []; b.update(); });
  b.update();
}

/* 第 6 页：图 6-36 过中点的平行线 */
function initMid() {
  const s = { A: [4.5, 4.6], B: [0.4, 0.4], C: [6.6, 0.4] };
  const b = board($('mid'), { x: [-0.4, 7.4], y: [-0.4, 5.4], axes: false, ticks: 1, w: 520 });
  const D = () => mul(add(s.A, s.B), 0.5);
  const E = () => meet(D(), sub(s.C, s.B), s.A, sub(s.C, s.A));
  const F = () => meet(D(), sub(s.C, s.A), s.B, sub(s.C, s.B));
  b.poly(() => [s.A, s.B, s.C], { cls: 'tri' });
  b.seg(() => [D(), E()], { cls: 'ray hl' });
  b.seg(() => [D(), F()], { cls: 'ray b' });
  b.pt(D, { r: 5, cls: 'c2' });
  b.pt(E, { r: 4 }); b.pt(F, { r: 4 });
  b.text(D, 'D', { dx: -22, dy: 0 });
  b.text(E, 'E', { dx: 8, dy: 0 });
  b.text(F, 'F', { dx: -4, dy: 22 });
  b.text(() => s.A, 'A', { dx: -4, dy: -12 });
  b.text(() => s.B, 'B', { dx: -20, dy: 18 });
  b.text(() => s.C, 'C', { dx: 6, dy: 18 });
  const lim = ([x, y]) => [clamp(x, 0, 7), clamp(y, 0, 5)];
  ['A', 'B', 'C'].forEach((k) => b.drag(() => s[k], (x, y) => {
    const p = lim([x, y]);
    const others = ['A', 'B', 'C'].filter((q) => q !== k).map((q) => s[q]);
    const area = Math.abs(cross(sub(others[0], p), sub(others[1], p)));
    if (area > 2) s[k] = p; // 三角形不能压扁
  }, { r: 7, hit: 18 }));
  b.onUpdate = () => {
    const v = { AE: dist(s.A, E()), EC: dist(E(), s.C), BF: dist(s.B, F()), FC: dist(F(), s.C) };
    Object.entries(v).forEach(([k, x]) => { $(`m${k}`).textContent = fmt(x, 2); });
  };
  b.update();
}

/* 第 7 页：方格纸（图 6-37） */
function initGrids() {
  const o1 = { x: [0, 15], y: [0, 7], axes: false, ticks: 1, w: 560 };
  const g1 = board($('g1'), o1);
  const P1 = { A: [1, 6], B: [4, 5], C: [2, 2], D: [5, 1], E: [7, 4], F: [8, 3], G: [11, 6], H: [11, 1], I: [14, 4] };
  const SEGS = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['F', 'G'], ['H', 'I']];
  const PAIRS = [[['A', 'B'], ['C', 'D']], [['C', 'B'], ['D', 'E']], [['F', 'G'], ['H', 'I']]];
  const s1 = { k: -1 };
  SEGS.forEach(([p, q]) => g1.seg([P1[p], P1[q]], { cls: 'segk' }));
  const cur = () => (s1.k >= 0 ? PAIRS[s1.k] : []);
  [0, 1].forEach((i) => {
    g1.seg(() => (cur()[i] ? [P1[cur()[i][0]], P1[cur()[i][1]]] : [O0, O0]), { cls: 'ray hl' });
    g1.seg(() => { const sg = cur()[i]; return sg ? [P1[sg[0]], [P1[sg[1]][0], P1[sg[0]][1]]] : [O0, O0]; }, { cls: 'step' });
    g1.seg(() => { const sg = cur()[i]; return sg ? [[P1[sg[1]][0], P1[sg[0]][1]], P1[sg[1]]] : [O0, O0]; }, { cls: 'step v' });
  });
  const OFF = { A: [-16, -4], B: [6, -6], C: [-18, 4], D: [2, 20], E: [4, -6], F: [-18, 16], G: [6, -4], H: [-20, 14], I: [6, -4] };
  Object.entries(P1).forEach(([k, p]) => g1.text(p, k, { dx: OFF[k][0], dy: OFF[k][1], cls: 'lb sm' }));
  const walk = ([p, q]) => {
    const dx = P1[q][0] - P1[p][0];
    const dy = P1[q][1] - P1[p][1];
    return `${p}${q}：从 ${p} ${dx >= 0 ? '向右' : '向左'} ${Math.abs(dx)} 格、${dy >= 0 ? '向上' : '向下'} ${Math.abs(dy)} 格`;
  };
  g1.onUpdate = () => { if (s1.k >= 0) $('g1Msg').textContent = `${walk(cur()[0])}；${walk(cur()[1])}——走法相同，平行。`; };
  $('g1Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s1.k = +btn.dataset.k;
    $('g1Btns').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === btn));
    g1.update();
  });
  g1.update();

  const o2 = { x: [0, 17], y: [0, 7], axes: false, ticks: 1, w: 560 };
  const g2 = board($('g2'), o2);
  const P2 = { A: [4, 6], B: [1, 3], C: [13, 1], P: [5, 4] };
  const s2 = { lines: [] };
  g2.seg([P2.B, P2.A], { cls: 'segk' });
  g2.seg([P2.B, P2.C], { cls: 'segk' });
  [0, 1].forEach((i) => g2.seg(() => { const q = s2.lines[i]; if (!q) return [O0, O0]; const u = sub(q.p, P2.P); const k = 20 / Math.hypot(...u); return [add(P2.P, mul(u, -k)), add(P2.P, mul(u, k))]; }, { cls: 'drawn ok' }));
  g2.seg(() => (s2.try ? [P2.P, s2.try] : [O0, O0]), { cls: 'drawn no' });
  g2.pt(P2.P, { r: 5 });
  [['A', 4, -6], ['B', -18, 16], ['C', 6, -4], ['P', 6, 20]].forEach(([k, dx, dy]) => g2.text(P2[k], k, { dx, dy, cls: 'lb sm' }));
  g2.svg.addEventListener('pointerdown', (e) => {
    const [x, y] = toWorld(g2, o2, e).map(Math.round);
    const q = [x, y];
    const u = sub(q, P2.P);
    if (!u[0] && !u[1]) return;
    const par = (v) => Math.abs(cross(u, v)) < 1e-9;
    const which = par(sub(P2.A, P2.B)) ? 'AB' : par(sub(P2.C, P2.B)) ? 'BC' : '';
    const msg = $('g2Msg');
    if (which) {
      s2.lines = [...s2.lines.filter((l) => l.w !== which), { w: which, p: q }];
      s2.try = null;
      msg.className = 'tip feedback fb-ok';
      msg.textContent = `✓ 从 P 到 (${x}, ${y})：走法与 ${which} 相同，这条直线与 ${which} 平行。${s2.lines.length === 2 ? '两条都画好了！' : ''}`;
    } else {
      s2.try = q;
      msg.className = 'tip feedback fb-warn';
      msg.textContent = `从 P 向${u[0] >= 0 ? '右' : '左'} ${Math.abs(u[0])} 格、向${u[1] >= 0 ? '上' : '下'} ${Math.abs(u[1])} 格，与 AB、BC 的走法都不同，不平行。`;
    }
    g2.update();
  });
  g2.update();
}

/* 第 8 页：练一练 2 */
function initPCD() {
  const s = { th: 50, P: [0.6, 2.6] };
  const L = 4.2;
  const b = board($('pcd'), { x: [-4.4, 4.8], y: [-0.7, 3.7], axes: false, grid: false, w: 560 });
  const tn = () => Math.tan((s.th * Math.PI) / 180);
  const C = () => [s.P[1] / tn(), s.P[1]];
  const D = () => [s.P[0] - s.P[1] / tn(), 0];
  b.seg([O0, [L, 0]], { cls: 'ray' });
  b.seg(() => [D(), O0], { cls: 'dash' });
  b.seg(() => [O0, at(O0, s.th, L)], { cls: 'ray' });
  b.seg(() => [s.P, C()], { cls: 'ray hl' });
  b.seg(() => [s.P, D()], { cls: 'ray b' });
  const mk = (o, p, q, r, cls) => MAngle.mark(b, o, p, q, r, { cls: `amark ${cls}` });
  mk(O0, [1, 0], () => at(O0, s.th, 1), 0.5, '');
  mk(C, () => s.P, O0, 0.4, 'g');
  mk(D, () => s.P, O0, 0.4, 'g');
  mk(() => s.P, C, D, 0.4, 'b');
  b.text([L, 0], 'A', { dx: 4, dy: 20 });
  b.text(() => at(O0, s.th, L), 'B', { dx: 6, dy: 0 });
  b.text(O0, 'O', { dx: -4, dy: 22 });
  b.text(C, 'C', { dx: 8, dy: 4 });
  b.text(D, 'D', { dx: -8, dy: 22 });
  b.text(() => s.P, 'P', { dx: -6, dy: -14 });
  b.drag(() => s.P, (x, y) => {
    const p = [clamp(x, -3.8, 3), clamp(y, 0.6, 3.2)];
    const d = dir(O0, p);
    if (d > s.th + 8 && d < 172 && p[1] / tn() < L) s.P = p;
  });
  b.drag(() => at(O0, s.th, L * 0.8), (x, y) => {
    const t = clamp(Math.round(dir(O0, [x, y])), 30, 75);
    if (dir(O0, s.P) > t + 8 && s.P[1] / Math.tan((t * Math.PI) / 180) < L) s.th = t;
  }, { r: 7, hit: 18 });
  b.onUpdate = () => {
    const v = [s.th, size(C(), s.P, O0), size(D(), s.P, O0), size(s.P, C(), D())];
    v.forEach((x, i) => { $(`q${i + 1}`).textContent = `${fmt(x, 1)}°`; });
  };
  b.update();
}

window.LESSON = {
  init() {
    initDefs();
    initSpin();
    initPush();
    initMid();
    initGrids();
    initPCD();
  },
};
