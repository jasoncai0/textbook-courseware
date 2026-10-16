'use strict';
/* 八上 1.3 探索三角形全等的条件 · 本课互动：反例机、SAS/ASA/SSS 作图并与“同学的三角形”叠合、SSA 两解、
 * 例题图（翻折/旋转/平移演示）、四边形框架不稳定、尺规作角平分线与垂线的分步作图、HL 作图。
 * 通用部分见 ../shared/math.js、mgeo.js、mfold.js；所有点都由长度、角度精确计算（正弦定理、圆与直线/圆的交点）。 */
const { fmt, tex } = MathKit;
const { add, sub, mul, dist, dir, angle, centroid, lerp, arc, right, line } = Geo;
const { move, ticks, tween } = MFold;
const $ = (id) => document.getElementById(id);
const HIDE = [[-99, -99], [-99, -99]];
const RAD = Math.PI / 180;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* ---------- 由条件作三角形（返回 [A, B, C]） ---------- */
const triSAS = (c, b, deg) => [[0, 0], [c, 0], mul(dir(deg), b)]; // AB = c，AC = b，∠A = deg
function triASA(c, al, be) { // AB = c，∠A = al，∠B = be
  const ac = (c * Math.sin(be * RAD)) / Math.sin((al + be) * RAD);
  return [[0, 0], [c, 0], mul(dir(al), ac)];
}
function triSSS(a, b, c) { // BC = a，AC = b，AB = c；B 在原点，C 在 x 轴正方向；不能构成时返回 null
  if (a + b <= c + 1e-9 || a + c <= b + 1e-9 || b + c <= a + 1e-9) return null;
  const x = (c * c - b * b + a * a) / (2 * a);
  return [[x, Math.sqrt(c * c - x * x)], [0, 0], [a, 0]];
}
/** 圆 (O, r) 与圆 (P, s) 的交点，取在 side 一侧（side = 1 左侧 / -1 右侧，相对 O→P 方向） */
function circles(O, r, P, s, side = 1) {
  const d = dist(O, P);
  if (d > r + s || d < Math.abs(r - s) || d < 1e-9) return null;
  const x = (r * r - s * s + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r * r - x * x));
  const u = mul(sub(P, O), 1 / d);
  return add(add(O, mul(u, x)), mul([-u[1], u[0]], h * side));
}
/** 以 O 为圆心、半径 r 的一段弧（从 a0 度到 a1 度） */
const arcPts = (b, O, r, a0, a1, cls = 'carc') => b.curve((t) => {
  const o = typeof O === 'function' ? O() : O;
  if (!o) return [NaN, NaN];
  const [x0, x1, rr] = [a0, a1, r].map((v) => (typeof v === 'function' ? v() : v));
  return add(o, mul(dir(x0 + (x1 - x0) * t), rr));
}, 0, 1, { cls, n: 60 });
const shiftTo = (pts, x0, y0 = 0) => { const mx = Math.min(...pts.map((p) => p[0])); return pts.map((p) => [p[0] - mx + x0, p[1] + y0]); };
const label = (b, P, names, opt = {}) => names.forEach((n, i) => n && b.text(() => {
  const pts = typeof P === 'function' ? P() : P;
  if (!pts) return null;
  const g = centroid(pts);
  const d = sub(pts[i], g);
  return add(pts[i], mul(d, (opt.k || 0.36) / (Math.hypot(...d) || 1)));
}, n, { dx: -7, dy: 8, cls: opt.cls }));

/* ---------- 第 3 页：反例机 ---------- */
const CASES = [
  { t: [triSAS(3, 2.2, 75), triSAS(3, 3.6, 30)], s: [[0, 1, 1]], a: [], say: '都有一条边长 3，但形状、大小都不同。' },
  { t: [triSAS(2.2, 2.8, 50), triSAS(4.2, 2, 50)], s: [], a: [[0, '50°']], say: '都有一个 50° 的角，却不能重合。' },
  { t: [triSAS(3.4, 2.4, 45), triSAS(3.4, 2.4, 110)], s: [[0, 1, 1], [0, 2, 2]], a: [], say: '两条边分别是 3.4、2.4，可两边的夹角不同（45° 与 110°），第三边就不同。' },
  { t: [triASA(2.4, 45, 60), triASA(4.2, 45, 60)], s: [], a: [[0, '45°'], [1, '60°']], say: '两个角分别是 45°、60°，形状相同，但一大一小。' },
  { t: [triSAS(3.4, 2, 45), triSAS(3.4, 3.4, 45)], s: [[0, 1, 1]], a: [[0, '45°']], say: '一条边 3.4、它的一个邻角 45° 相同，另一条边不同。' },
];
function initCounter() {
  const s = { k: 0 };
  const b = Geo.board($('cx'), { x: [-0.5, 10.6], y: [-0.7, 4.2], w: 600 });
  const T = (j) => () => {
    if (s.k < 0) return null;
    const t = CASES[s.k].t[j];
    return shiftTo(t, j ? 5.6 : 0);
  };
  [0, 1].forEach((j) => {
    b.poly(() => T(j)() || HIDE, { cls: j ? 'tri-b' : 'tri-a' });
    [[0, 1], [0, 2], [1, 2]].forEach(([u, v]) => [1, 2].forEach((n) => ticks(b,
      () => { const p = T(j)(); const c = s.k >= 0 && CASES[s.k].s.find(([x, y, k]) => x === u && y === v && k === n); return p && c ? p[u] : [-99, -99]; },
      () => { const p = T(j)(); const c = s.k >= 0 && CASES[s.k].s.find(([x, y, k]) => x === u && y === v && k === n); return p && c ? p[v] : [-99, -98]; },
      n, { len: 0.16, gap: 0.12 })));
    [0, 1].forEach((m) => arc(b, () => (T(j)() || [[0, 0]])[m], () => (T(j)() || [[0, 0], [1, 0]])[(m + 1) % 3], () => (T(j)() || [[0, 0], [1, 0], [0, 1]])[(m + 2) % 3],
      { r: 0.5, show: () => s.k >= 0 && CASES[s.k].a.some(([v]) => v === m), label: () => { const c = s.k >= 0 && CASES[s.k].a.find(([v]) => v === m); return c ? c[1] : ''; }, lcls: 'lb up gdeg', lr: 2.1 }));
  });
  $('cxBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = +btn.dataset.k;
    $('cxBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    $('cxMsg').className = 'tip feedback fb-warn';
    $('cxMsg').innerHTML = `反例：${CASES[s.k].say}（相同的记号表示相等）`;
    b.update();
  });
  $('cxBtns').querySelector('[data-k="0"]').click();
}

/* ---------- 第 4、9、13 页：作图实验室（我作的 vs 同学作的） ---------- */
const LAB = {
  S: { sliders: ['al', 'a', 'b'], unit: { al: '°' }, make: (v) => triSAS(v.a, v.b, v.al), names: ['A', 'B', 'C'] },
  A: { sliders: ['a', 'al', 'be'], unit: { al: '°', be: '°' }, make: (v) => triASA(v.a, v.al, v.be), names: ['A', 'B', 'C'] },
  T: { sliders: ['a', 'b', 'c'], unit: {}, make: (v) => triSSS(v.a, v.b, v.c), names: ['A', 'B', 'C'] },
};
function initLab(mode) {
  const cfg = LAB[mode];
  const id = `lab${mode}`;
  const s = { v: Object.fromEntries(cfg.sliders.map((k) => [k, +$(`${id}${k}`).value])), t: 1, flip: true, rot: 140 };
  const b = Geo.board($(id), { x: [-0.9, 12.4], y: [-1.6, 5.4], w: 640 });
  const P = () => cfg.make(s.v);
  const motion = () => {
    const p = P();
    const g = centroid(p);
    return [...(s.flip ? [{ F: [g, add(g, [1, 0])] }] : []), { R: s.rot, c: g }, { T: sub([9.4, 1.9], g) }];
  };
  const Q = () => (P() ? move(P(), motion(), s.t) : null);
  // 作图痕迹
  if (mode === 'S') {
    line(b, [0, 0], [1, 0], { ray: true, cls: 'gl thin-l trace' });
    line(b, [0, 0], () => dir(s.v.al), { ray: true, cls: 'gl thin-l trace' });
    arcPts(b, [0, 0], () => s.v.a, -9, 9);
    arcPts(b, [0, 0], () => s.v.b, () => s.v.al - 9, () => s.v.al + 9);
    b.text(() => mul(dir(s.v.al), 5.3), 'N', { dx: 4, dy: 4 });
    b.text([5.4, 0], 'M', { dx: -6, dy: 22 });
  } else if (mode === 'A') {
    line(b, [0, 0], () => dir(s.v.al), { ray: true, cls: 'gl thin-l trace' });
    line(b, () => [s.v.a, 0], () => add([s.v.a, 0], dir(180 - s.v.be)), { ray: true, cls: 'gl thin-l trace' });
  } else {
    const A = () => P() && P()[0];
    const ang = (O) => () => { const a = A(); return a ? Math.atan2(a[1] - O()[1], a[0] - O()[0]) / RAD : 90; };
    const B0 = () => [0, 0];
    const C0 = () => [s.v.a, 0];
    arcPts(b, B0, () => s.v.c, () => ang(B0)() - 14, () => ang(B0)() + 14);
    arcPts(b, C0, () => s.v.b, () => ang(C0)() - 14, () => ang(C0)() + 14);
    b.seg(() => [[0, 0], [s.v.a, 0]], { cls: 'gs' });
  }
  b.poly(() => P() || HIDE, { cls: 'tri-a' });
  const qn = b.poly(() => Q() || HIDE, { cls: 'tri-m' });
  label(b, P, cfg.names);
  label(b, Q, cfg.names.map((n) => `${n}′`), { cls: 'lb mv' });
  if (mode === 'S') arc(b, [0, 0], [1, 0], () => dir(s.v.al), { r: 0.6 });
  if (mode === 'A') {
    arc(b, [0, 0], [1, 0], () => dir(s.v.al), { r: 0.6 });
    arc(b, () => [s.v.a, 0], [0, 0], () => add([s.v.a, 0], dir(180 - s.v.be)), { r: 0.6 });
  }
  b.text([2.2, -1.1], '我作的', { cls: 'lb up cap' });
  b.text([8.6, -1.1], '同学作的', { cls: 'lb up cap' });
  const msg = $(`${id}Msg`);
  const say = (t, c = '') => { msg.className = `tip feedback ${c}`; msg.innerHTML = t; tex(msg); };
  b.onUpdate = () => qn.classList.toggle('on', s.t < 0.001);
  const refresh = () => {
    cfg.sliders.forEach((k) => { $(`${id}${k}V`).textContent = `${fmt(s.v[k])}${cfg.unit[k] || ''}`; });
    if (!P()) say('两弧不相交：较短两边的和不大于最长边，<b>围不成三角形</b>。（三角形任意两边之和大于第三边）', 'fb-warn');
    else say(s.t > 0.5 ? '“同学作的”三角形摆放的方向不同，还可能翻了个面。点“叠一叠”。' : '完全重合！');
    b.update();
  };
  cfg.sliders.forEach((k) => MathKit.slider($(`${id}${k}`), (v) => { s.v = { ...s.v, [k]: v }; s.t = 1; refresh(); }));
  let stop = () => {};
  $(`${id}New`).addEventListener('click', () => { stop(); s.rot = Math.round(Math.random() * 300 - 150); s.flip = Math.random() < 0.5; s.t = 1; refresh(); });
  $(`${id}Go`).addEventListener('click', () => {
    if (!P()) return;
    stop();
    stop = tween(1800, (t) => { s.t = 1 - t; b.update(); }, () => { s.t = 0; say(`完全重合！条件相同，作出的三角形<b>唯一确定</b>，所以大家作的都全等。`, 'fb-ok'); b.update(); });
  });
}

/* ---------- 第 5 页：SSA 两解 ---------- */
function initSSA() {
  const B = [4, 0];
  const s = { A: 35, a: 2.8 };
  const b = Geo.board($('ssa'), { x: [-0.6, 8.6], y: [-0.8, 4.6], w: 560 });
  const u = () => dir(s.A);
  const sols = () => {
    const ub = u()[0] * B[0];
    const disc = ub * ub - (B[0] * B[0] - s.a * s.a);
    if (disc < 0) return [];
    return [ub - Math.sqrt(disc), ub + Math.sqrt(disc)].filter((t) => t > 1e-6).map((t) => mul(u(), t));
  };
  b.curve((t) => add(B, mul(dir(360 * t), s.a)), 0, 1, { cls: 'gdash', n: 180 });
  line(b, [0, 0], () => u(), { ray: true, cls: 'gl thin-l' });
  b.seg([[0, 0], B], { cls: 'gs' });
  const C = (i) => () => sols()[i];
  b.poly(() => (sols().length === 2 ? [[0, 0], B, sols()[1]] : HIDE), { cls: 'tri-b' });
  b.poly(() => (sols().length ? [[0, 0], B, sols()[0]] : HIDE), { cls: 'tri-a' });
  [0, 1].forEach((i) => b.seg(() => (C(i)() ? [B, C(i)()] : HIDE), { cls: i ? 'side-hl' : 'side-hl b' }));
  arc(b, [0, 0], B, u, { r: 0.7 });
  b.pt(C(0), { show: () => !!C(0)() });
  b.pt(C(1), { show: () => !!C(1)() });
  b.text([0, 0], 'A', { dx: -18, dy: 8 });
  b.text(B, 'B', { dx: 4, dy: 22 });
  b.text(() => C(0)() || null, () => (sols().length === 2 ? 'C₁' : 'C'), { dx: -22, dy: -6 });
  b.text(() => (sols().length === 2 ? C(1)() : null), 'C₂', { dx: 4, dy: -8 });
  b.text(() => mul(u(), 6.2), 'N', { dx: 4, dy: 4 });
  b.onUpdate = () => {
    const S = sols();
    $('ssaAV').textContent = `${s.A}°`;
    $('ssaaV').textContent = fmt(s.a, 1);
    const m = $('ssaMsg');
    const h = 4 * Math.sin(s.A * RAD);
    if (!S.length) { m.className = 'tip feedback'; m.innerHTML = `$BC=${fmt(s.a, 1)}$ 比 $B$ 到射线 $AN$ 的距离 $${fmt(h)}$ 还短，弧碰不到射线，作不出三角形。`; }
    else if (S.length === 1) { m.className = 'tip feedback'; m.innerHTML = `$BC=${fmt(s.a, 1)}\\ge AB$ 时，弧与射线 $AN$ 只有一个交点，三角形是唯一的。`; }
    else { m.className = 'tip feedback fb-warn'; m.innerHTML = `两个交点！$BC_1=BC_2=${fmt(s.a, 1)}$，但 $AC_1\\approx${fmt(dist([0, 0], S[0]))}$，$AC_2\\approx${fmt(dist([0, 0], S[1]))}$——两个三角形<b>不全等</b>。`; }
    tex(m);
  };
  MathKit.slider($('ssaA'), (v) => { s.A = v; b.update(); });
  MathKit.slider($('ssaa'), (v) => { s.a = v; b.update(); });
}

/* ---------- 例题图（带演示） ---------- */
function demoBoard(id, btnId, opt) {
  const s = { t: 0 };
  const b = Geo.board($(id), { x: opt.x, y: opt.y, w: opt.w || 420 });
  (opt.fill || []).forEach((p) => b.poly(p, { cls: 'tri-a' }));
  b.poly(() => (s.t > 0 ? move(opt.tri, opt.m, s.t) : HIDE), { cls: 'tri-m' });
  opt.segs.forEach((sg) => b.seg(sg, { cls: 'gs' }));
  (opt.ticks || []).forEach(([p, q, n]) => ticks(b, p, q, n));
  (opt.arcs || []).forEach(([v, a, c, r]) => arc(b, v, a, c, { r: r || 0.4 }));
  (opt.rights || []).forEach(([v, a, c]) => right(b, v, a, c, { s: 0.22 }));
  Object.entries(opt.P).forEach(([n, p]) => b.text(p, n, { dx: (opt.lab[n] || [-6, 8])[0], dy: (opt.lab[n] || [-6, 8])[1] }));
  let stop = () => {};
  if (btnId) $(btnId).addEventListener('click', () => { stop(); stop = tween(1800, (t) => { s.t = t; b.update(); }); });
  b.update();
  return b;
}

function examples() {
  // 例 1（图 1-7）：AB = AD，∠BAC = ∠DAC，关于 AC 对称
  {
    const A = [0, 0]; const C = [4.2, 0]; const D = [2.9, 1.4]; const B = [2.9, -1.4];
    demoBoard('e1', 'e1Go', { x: [-0.7, 4.9], y: [-1.9, 1.9], P: { A, B, C, D }, lab: { A: [-20, 8], B: [-4, 22], C: [6, 8], D: [-4, -8] },
      segs: [[A, C], [A, B], [A, D], [B, C], [D, C]], ticks: [[A, B, 1], [A, D, 1]], arcs: [[A, C, D, 0.6], [A, B, C, 0.75]], tri: [A, B, C], m: { F: [A, C] } });
  }
  // 例 2（图 1-8）：E 是 AB、CD 的中点
  {
    const E = [1.9, 1]; const A = [0.7, 2]; const B = sub(mul(E, 2), A); const C = [3.3, 2]; const D = sub(mul(E, 2), C);
    demoBoard('e2', null, { x: [0, 3.9], y: [-0.4, 2.4], w: 360, P: { A, B, C, D, E }, lab: { E: [8, 6], A: [-8, -8], C: [4, -8], D: [-16, 14], B: [4, 16] },
      segs: [[A, B], [C, D], [A, C], [D, B]], ticks: [[A, E, 1], [E, B, 1], [C, E, 2], [E, D, 2]], tri: [A, E, C], m: { R: 180, c: E } });
  }
  // 例 3（图 1-9）：△AEC 绕 CD 中点 M 旋转 180° 得 △BFD
  {
    const D = [0, 0]; const C = [4, 2]; const M = [2, 1]; const A = [0.8, 2.2]; const B = sub(mul(M, 2), A);
    const E = lerp(D, C, 0.3); const F = lerp(D, C, 0.7);
    demoBoard('e3', 'e3Go', { x: [-0.5, 4.5], y: [-0.6, 2.6], w: 360, P: { A, B, C, D, E, F }, lab: { A: [-8, -8], C: [4, -6], D: [-16, 10], B: [4, 16], E: [-4, 22], F: [2, -8] },
      segs: [[A, C], [A, E], [D, C], [B, F], [B, D]], tri: [A, E, C], m: { R: 180, c: M } });
  }
  // 练习 p16 第 1 题：C 是 AB 中点，AE = BD，∠A = ∠B
  {
    const A = [0, 0]; const B = [4, 0]; const C = [2, 0]; const E = [3.2, 2.3]; const D = [0.8, 2.3];
    demoBoard('pr1', null, { x: [-0.5, 4.5], y: [-0.6, 2.7], w: 340, P: { A, B, C, D, E }, lab: { A: [-14, 14], B: [4, 14], C: [-4, 22], D: [-6, -8], E: [-2, -8] },
      segs: [[A, B], [A, E], [C, E], [B, D], [C, D]], arcs: [[A, B, E, 0.45], [B, D, A, 0.45]], tri: [], m: { T: [0, 0] } });
  }
  // 例 4（图 1-11）
  {
    const B = [0, 0]; const C = [4.4, 0]; const A = [3, 3.4]; const D = lerp(B, C, 0.5); const E = lerp(B, A, 0.5); const F = lerp(A, C, 0.5);
    demoBoard('e4', null, { x: [-0.5, 4.9], y: [-0.6, 3.8], w: 380, P: { A, B, C, D, E, F }, lab: { A: [-4, -8], B: [-16, 14], C: [4, 14], D: [-4, 22], E: [-18, 2], F: [6, 2] },
      segs: [[A, B], [B, C], [C, A], [D, E], [D, F]], tri: [], m: { T: [0, 0] } });
  }
  // 图 1-12（AAS）与 例 5（图 1-13）
  {
    const B = [0, 0]; const C = [2.6, 0]; const A = [1.6, 2.2]; const v = [3.8, 0];
    const [M, N, P] = [add(A, v), add(B, v), add(C, v)];
    demoBoard('f112', null, { x: [-0.4, 6.8], y: [-0.5, 2.6], w: 420, P: { A, B, C, M, N, P }, lab: { A: [-6, -8], M: [-6, -8], B: [-16, 14], N: [-16, 14], C: [4, 14], P: [4, 14] },
      segs: [[A, B], [B, C], [C, A], [M, N], [N, P], [P, M]], ticks: [[B, C, 2], [N, P, 2]], arcs: [[A, B, C, 0.4], [M, N, P, 0.4], [B, C, A, 0.4], [B, C, A, 0.52], [N, P, M, 0.4], [N, P, M, 0.52]], tri: [], m: { T: [0, 0] } });
    const Bq = [0, 0]; const Cq = [3, 0]; const Aq = [2.3, 1.7]; const Dq = [2.3, 0]; const w = [3.8, 0];
    demoBoard('e5', null, { x: [-0.5, 7.3], y: [-0.5, 2.1], w: 420, P: { A: Aq, B: Bq, C: Cq, D: Dq, 'A′': add(Aq, w), 'B′': add(Bq, w), 'C′': add(Cq, w), 'D′': add(Dq, w) },
      lab: { A: [-6, -8], B: [-14, 16], C: [2, 16], D: [-8, 20], 'A′': [-6, -8], 'B′': [-14, 16], 'C′': [2, 16], 'D′': [-8, 20] },
      segs: [[Aq, Bq], [Bq, Cq], [Cq, Aq], [Aq, Dq], [add(Aq, w), add(Bq, w)], [add(Bq, w), add(Cq, w)], [add(Cq, w), add(Aq, w)], [add(Aq, w), add(Dq, w)]],
      rights: [[Dq, Aq, Bq], [add(Dq, w), add(Aq, w), add(Bq, w)]], tri: [], m: { T: [0, 0] } });
  }
  // 例 6（图 1-16）：△EAC 沿直线平移 AB 得 △FBD
  {
    const A = [0, 0]; const B = [1.6, 0]; const C = [3.2, 0]; const D = [4.8, 0]; const E = [2.2, 1.6]; const F = add(E, [1.6, 0]);
    demoBoard('e6', 'e6Go', { x: [-0.5, 5.3], y: [-0.5, 2], w: 420, P: { A, B, C, D, E, F }, lab: { A: [-14, 16], B: [-6, 22], C: [-2, 22], D: [4, 16], E: [-6, -8], F: [-2, -8] },
      segs: [[A, D], [A, E], [E, C], [B, F], [F, D]], tri: [E, A, C], m: { T: [1.6, 0] } });
  }
  // 例 7（图 1-18）
  {
    const A = [2, 2.8]; const B = [0, 0]; const C = [4, 0]; const D = [2, 0];
    const b = demoBoard('e7', null, { x: [-0.5, 4.5], y: [-0.5, 3.2], w: 340, P: { A, B, C, D }, lab: { A: [-6, -8], B: [-14, 14], C: [4, 14], D: [-4, 22] },
      segs: [[A, B], [B, C], [C, A]], ticks: [[A, B, 1], [A, C, 1], [B, D, 2], [D, C, 2]], tri: [], m: { T: [0, 0] } });
    b.seg([A, D], { cls: 'gdash' });
    b.update();
  }
}

/* ---------- 第 8 页：练习 1 的 6 个三角形（按两边及夹角精确画） ---------- */
const PK = [
  { L: [5, 4], ang: 30, d: 250, n: '①' }, { L: [4, 4], ang: 40, d: 200, n: '②' }, { L: [4, 6], ang: 40, d: 260, n: '③' },
  { L: [5, 4], ang: 30, d: 110, n: '④' }, { L: [6, 4], ang: 40, d: 0, n: '⑤' }, { L: [4, 4], ang: 30, d: 90, n: '⑥' },
];
function initPick() {
  const b = Geo.board($('pk'), { x: [0, 18], y: [0.2, 10.8], w: 560 });
  const K = 0.8;
  PK.forEach((o, i) => {
    const V0 = [0, 0];
    const P1 = mul(dir(o.d), o.L[0] * K);
    const P2 = mul(dir(o.d + (o.d === 0 ? -o.ang : o.ang)), o.L[1] * K);
    const g = centroid([V0, P1, P2]);
    const cc = [3 + (i % 3) * 6, 7.9 - Math.floor(i / 3) * 5.2];
    const [V, A, B] = [V0, P1, P2].map((p) => add(sub(p, g), cc));
    b.poly([V, A, B], { cls: 'tri-line' });
    arc(b, V, A, B, { r: 0.55, label: `${o.ang}°`, lcls: 'lb up gdeg sm', lr: 2.1 });
    [[A, o.L[0]], [B, o.L[1]]].forEach(([P, len]) => {
      const m = lerp(V, P, 0.55);
      const nrm = mul([-(P[1] - V[1]), P[0] - V[0]], 1 / dist(V, P));
      const out = Geo.dot(nrm, sub(m, centroid([V, A, B]))) > 0 ? 1 : -1;
      b.text(add(m, mul(nrm, 0.45 * out)), String(len), { cls: 'lb up sm', dx: -5, dy: 6 });
    });
    b.text([cc[0] - 2.4, cc[1] + 1.6], o.n, { cls: 'lb up', dx: -8, dy: 6 });
  });
  b.update();
}

/* ---------- 第 13 页：四边形框架 ---------- */
function initFrame4() {
  const s = { th: 70 };
  const b = Geo.board($('frame4'), { x: [-0.6, 9.6], y: [-0.5, 2.4], w: 520 });
  const A = [0, 0]; const B = [2.8, 0];
  const D = () => mul(dir(s.th), 1.9);
  const C = () => add(D(), B);
  b.poly(() => [A, B, C(), D()], { cls: 'frame-q' });
  b.drag(D, (x, y) => { s.th = clamp(Math.atan2(y, x) / RAD, 35, 145); });
  const T = [[5.6, 0], [8.8, 0], [7.4, 1.9]];
  b.poly(T, { cls: 'frame-q' });
  b.text([1.6, -0.3], '四边形：拖得动', { cls: 'lb up cap', dx: -40, dy: 4 });
  b.text([7.2, -0.3], '三角形：三边定了，拖不动', { cls: 'lb up cap', dx: -70, dy: 4 });
  b.update();
}

/* ---------- 第 15 页：作角平分线 ---------- */
function initBisector() {
  const s = { step: 0, th: 64 };
  const b = Geo.board($('bis'), { x: [-0.8, 6.4], y: [-0.9, 5.4], w: 480 });
  const R1 = 2.4;
  const Cp = () => mul(dir(s.th), R1);
  const Dp = [R1, 0];
  const rho = () => 0.8 * dist(Cp(), Dp);
  const M = () => [1, -1].map((sd) => circles(Dp, rho(), Cp(), rho(), sd)).sort((p, q) => Math.hypot(...q) - Math.hypot(...p))[0]; // 取在角内部、离 O 较远的交点
  const on = (k) => () => s.step >= k;
  line(b, [0, 0], [1, 0], { ray: true, cls: 'gl' });
  line(b, [0, 0], () => dir(s.th), { ray: true, cls: 'gl' });
  arcPts(b, () => (s.step >= 1 ? [0, 0] : null), R1, -8, () => s.th + 8);
  const ang = (P, Q) => Math.atan2(Q[1] - P[1], Q[0] - P[0]) / RAD;
  arcPts(b, () => (s.step >= 2 ? Cp() : null), rho, () => ang(Cp(), M()) - 18, () => ang(Cp(), M()) + 18);
  arcPts(b, () => (s.step >= 2 ? Dp : null), rho, () => ang(Dp, M()) - 18, () => ang(Dp, M()) + 18);
  b.seg(() => (s.step >= 3 ? [[0, 0], add([0, 0], mul(M(), 5.6 / Math.hypot(...M())))] : HIDE), { cls: 'c2' });
  b.seg(() => (s.step >= 3 ? [Cp(), M()] : HIDE), { cls: 'gdash' });
  b.seg(() => (s.step >= 3 ? [Dp, M()] : HIDE), { cls: 'gdash' });
  arc(b, [0, 0], Dp, () => M(), { r: 1.0, show: on(3) });
  arc(b, [0, 0], () => M(), Cp, { r: 1.15, show: on(3) });
  b.pt(Cp, { show: on(1) }); b.pt(Dp, { show: on(1) }); b.pt(() => M(), { show: on(2) });
  b.text([0, 0], 'O', { dx: -18, dy: 16 });
  b.text(() => mul(dir(s.th), 5.1), 'A', { dx: 6, dy: 4 });
  b.text([5.6, 0], 'B', { dx: 0, dy: 22 });
  b.text(() => (s.step >= 1 ? Cp() : null), 'C', { dx: -20, dy: 0 });
  b.text(() => (s.step >= 1 ? Dp : null), 'D', { dx: -4, dy: 22 });
  b.text(() => (s.step >= 2 ? M() : null), 'M', { dx: 6, dy: -6 });
  b.drag(() => mul(dir(s.th), 4.6), (x, y) => { s.th = clamp(Math.atan2(y, x) / RAD, 30, 150); });
  const TXT = ['先看已知角 ∠AOB。点“下一步”开始作图。', '第 1 步：以 O 为圆心画弧，得 C、D，OC = OD。', '第 2 步：分别以 C、D 为圆心、相同的半径（大于 ½CD）画弧，交于 M，CM = DM。', ''];
  b.onUpdate = () => {
    const m = $('bisMsg');
    m.className = `tip feedback ${s.step === 3 ? 'fb-ok' : ''}`;
    m.textContent = s.step < 3 ? TXT[s.step] : `第 3 步：作射线 OM。量一量：∠COM = ${fmt(angle([0, 0], Cp(), M()), 1)}°，∠DOM = ${fmt(angle([0, 0], Dp, M()), 1)}°——OM 平分 ∠AOB（SSS）。`;
  };
  $('bisNext').addEventListener('click', () => { s.step = Math.min(3, s.step + 1); b.update(); });
  $('bisPrev').addEventListener('click', () => { s.step = Math.max(0, s.step - 1); b.update(); });
  b.update();
}

/* ---------- 第 16 页：过直线外一点作垂线 ---------- */
function initPerp() {
  const s = { step: 0, P: [2.6, 2.2] };
  const b = Geo.board($('perp'), { x: [-0.6, 6.6], y: [-3.4, 3.2], w: 480 });
  const r = () => s.P[1] * 1.45;
  const half = () => Math.sqrt(r() * r() - s.P[1] * s.P[1]);
  const C = () => [s.P[0] - half(), 0];
  const D = () => [s.P[0] + half(), 0];
  const rho = () => 0.8 * 2 * half();
  const Q = () => [s.P[0], -Math.sqrt(rho() * rho() - half() * half())];
  const ang = (O, X) => Math.atan2(X[1] - O[1], X[0] - O[0]) / RAD;
  b.seg([[-0.5, 0], [6.5, 0]], { cls: 'gl' });
  arcPts(b, () => (s.step >= 1 ? s.P : null), r, () => ang(s.P, C()) + 10, () => ang(s.P, D()) - 10);
  arcPts(b, () => (s.step >= 2 ? C() : null), rho, () => ang(C(), Q()) - 16, () => ang(C(), Q()) + 16);
  arcPts(b, () => (s.step >= 2 ? D() : null), rho, () => ang(D(), Q()) - 16, () => ang(D(), Q()) + 16);
  b.seg(() => (s.step >= 3 ? [[s.P[0], 3.1], [s.P[0], -3.3]] : HIDE), { cls: 'c2' });
  right(b, () => (s.step >= 3 ? [s.P[0], 0] : [-99, -99]), () => (s.step >= 3 ? [6, 0] : [-98, -99]), () => (s.step >= 3 ? s.P : [-99, -98]), { s: 0.28 });
  b.pt(C, { show: () => s.step >= 1 }); b.pt(D, { show: () => s.step >= 1 }); b.pt(Q, { show: () => s.step >= 2 });
  b.pt(() => s.P);
  b.text([-0.5, 0], 'A', { dx: 0, dy: -8 });
  b.text([6.5, 0], 'B', { dx: -12, dy: -8 });
  b.text(() => s.P, 'P', { dx: 10, dy: -6 });
  b.text(() => (s.step >= 1 ? C() : null), 'C', { dx: -16, dy: 22 });
  b.text(() => (s.step >= 1 ? D() : null), 'D', { dx: 4, dy: 22 });
  b.text(() => (s.step >= 2 ? Q() : null), 'Q', { dx: 8, dy: 10 });
  b.drag(() => s.P, (x, y) => { s.P = [clamp(x, 1.4, 4.8), clamp(y, 1, 2.1)]; });
  const TXT = ['已知直线 AB 和直线外一点 P。拖动 P 可换位置。', '第 1 步：以 P 为圆心画弧，交 AB 于 C、D，PC = PD。', '第 2 步：分别以 C、D 为圆心、相同的半径（大于 ½CD）画弧，交于 Q，QC = QD。'];
  b.onUpdate = () => {
    const m = $('perpMsg');
    m.className = `tip feedback ${s.step === 3 ? 'fb-ok' : ''}`;
    m.textContent = s.step < 3 ? TXT[s.step] : `第 3 步：作直线 PQ。量一量：PQ 与 AB 的夹角 = ${fmt(angle([s.P[0], 0], [6, 0], Q()), 1)}°。`;
  };
  $('perpNext').addEventListener('click', () => { s.step = Math.min(3, s.step + 1); b.update(); });
  $('perpPrev').addEventListener('click', () => { s.step = Math.max(0, s.step - 1); b.update(); });
  b.update();
}

/* ---------- 第 17 页：HL 作图 ---------- */
function initHL() {
  const s = { a: 2.5, c: 4 };
  const b = Geo.board($('hl'), { x: [-1, 6.4], y: [-1.6, 5.6], w: 460 });
  const C = [0, 0];
  const B = () => [s.a, 0];
  const A = () => (s.c > s.a ? [0, Math.sqrt(s.c * s.c - s.a * s.a)] : null);
  line(b, C, [1, 0], { ray: true, cls: 'gl thin-l trace' });
  line(b, C, [0, 1], { ray: true, cls: 'gl thin-l trace' });
  right(b, C, [1, 0], [0, 1], { s: 0.3 });
  b.curve((t) => add(B(), mul(dir(90 + 180 * t), s.c)), 0, 1, { cls: 'carc', n: 120 });
  b.poly(() => (A() ? [A(), B(), C] : HIDE), { cls: 'tri-a' });
  b.pt(() => A(), { show: () => !!A() });
  b.text(C, 'C', { dx: -18, dy: 18 });
  b.text(B, 'B', { dx: -4, dy: 22 });
  b.text(() => A(), 'A', { dx: -20, dy: 4 });
  b.text([6, 0], 'P', { dx: -6, dy: 22 });
  b.text([0, 5.4], 'Q', { dx: 8, dy: 8 });
  b.onUpdate = () => {
    $('hlaV').textContent = fmt(s.a); $('hlcV').textContent = fmt(s.c);
    const m = $('hlMsg');
    if (!A()) { m.className = 'tip feedback fb-warn'; m.textContent = '斜边必须比直角边长，否则弧与射线 CQ 没有交点。'; return; }
    m.className = 'tip feedback fb-ok';
    m.textContent = `弧与射线 CQ 只有一个交点 A（另一个交点在射线的反向延长线上），CA = √(c² − a²) ≈ ${fmt(A()[1])}，三角形唯一确定。`;
  };
  MathKit.slider($('hla'), (v) => { s.a = v; b.update(); });
  MathKit.slider($('hlc'), (v) => { s.c = v; b.update(); });
}

window.LESSON = {
  init() {
    initCounter();
    ['S', 'A', 'T'].forEach(initLab);
    initSSA();
    examples();
    initPick();
    initFrame4();
    initBisector();
    initPerp();
    initHL();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
