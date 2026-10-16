'use strict';
/* 高一下 13.1 基本立体图形 · 本课互动：平移生成棱柱、底面收缩成棱锥、截棱锥得棱台、旋转生成旋转体、斜二测作图。
 * 3D 线框见 ../shared/solid3d.js（真实坐标正交投影，被挡住的线自动虚线），2D 作图见 ../shared/math.js */
const { board, fmt, tex } = MathKit;
const { add, sub, mul, lerp } = Solid3D.vec;
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const views = []; // 每页翻到时重算尺寸
const deckStep = { n: 0 };

const regular = (n, R, rot = 0) => Array.from({ length: n }, (_, i) => {
  const t = rot + (2 * Math.PI * i) / n;
  return [R * Math.cos(t), R * Math.sin(t), 0];
});
const centroid = (P) => mul(P.reduce(add, [0, 0, 0]), 1 / P.length);
/** 底面 B（逆时针）与顶面 T（顶点一一对应）围成的凸多面体 */
function prismVF(B, T) {
  const n = B.length;
  return {
    V: [...B, ...T],
    F: [B.map((_, i) => n - 1 - i), T.map((_, i) => n + i), ...B.map((_, i) => [i, (i + 1) % n, n + ((i + 1) % n), n + i])],
  };
}
function pyramidVF(B, S) {
  const n = B.length;
  return { V: [...B, S], F: [B.map((_, i) => n - 1 - i), ...B.map((_, i) => [i, (i + 1) % n, n])] };
}
const btnGroup = (box, items, cur, onPick) => {
  box.innerHTML = items.map(([k, label]) => `<button type="button" class="btn${k === cur ? ' solid' : ''}" data-k="${k}">${label}</button>`).join('');
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    onPick(b.dataset.k);
  });
};
const mkView = (id, opt) => { const v = Solid3D.view($(id), opt); views.push(v); return v; };

/* ---------- 第 3 页：平移生成棱柱 ---------- */
const BASES = {
  tri: { label: '三角形', pts: regular(3, 1.35, Math.PI / 2) },
  para: { label: '平行四边形', pts: [[-1.4, -0.75, 0], [0.8, -0.75, 0], [1.4, 0.75, 0], [-0.8, 0.75, 0]] },
  pent: { label: '五边形', pts: regular(5, 1.3, Math.PI / 2) },
  hex: { label: '六边形', pts: regular(6, 1.25) },
};
const BASE_ITEMS = Object.entries(BASES).map(([k, b]) => [k, b.label]);
function initSweep() {
  const H = 2.2;
  const s = { base: 'para', dir: 'up', t: 1 };
  const v = mkView('sweep', { w: 560, h: 460, scale: 112, yaw: -28, pitch: 26, center: [0.3, 0, 1.2] });
  const d = () => mul(s.dir === 'up' ? [0, 0, H] : [0.9, 0.5, H], s.t);
  const B = () => BASES[s.base].pts;
  const T = () => B().map((p) => add(p, d()));
  const solidOn = () => s.t > 0.02;
  v.face(B, { cls: 'f2' });
  v.face(T, { cls: 'f2', show: solidOn });
  v.solid(() => prismVF(B(), T()), { show: solidOn });
  v.curve(B, { closed: true, cls: 'c2', show: () => !solidOn() });
  v.seg(() => [centroid(B()), centroid(T())], { cls: 'ax', hide: false, show: solidOn });
  v.update();
  btnGroup($('swBase'), BASE_ITEMS, s.base, (k) => { s.base = k; v.update(); });
  document.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => {
    s.dir = b.dataset.dir;
    document.querySelectorAll('[data-dir]').forEach((x) => x.classList.toggle('solid', x === b));
    v.update();
  }));
  MathKit.slider($('swT'), (t) => { s.t = t; $('swTV').textContent = `${Math.round(t * 100)}%`; v.update(); });
}

/* ---------- 第 4 页：棱柱各部分名称 ---------- */
function initNames() {
  const H = 2.2;
  const s = { n: 3 };
  const v = mkView('pnames', { w: 560, h: 440, scale: 108, yaw: -24, pitch: 20, center: [0, 0, 1.1] });
  const B = () => regular(s.n, 1.4, s.n === 3 ? Math.PI / 2 + Math.PI / 3 : 0);
  const T = () => B().map((p) => add(p, [0, 0, H]));
  const names = () => (s.n === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D', 'E', 'F']);
  v.face(B, { cls: 'f2' });
  v.face(T, { cls: 'f2' });
  v.solid(() => prismVF(B(), T()));
  v.seg(() => [B()[0], T()[0]], { cls: 'c1' });
  for (let i = 0; i < 6; i += 1) {
    const on = () => i < s.n;
    v.label(() => B()[i], () => names()[i], { show: on, dx: 8, dy: 22 });
    v.label(() => T()[i], () => `${names()[i]}′`, { show: on, dx: 8, dy: -8 });
  }
  v.label(() => add(centroid(T()), [0, 0, 0.35]), '底面', { cls: 'up' });
  v.label(() => lerp(B()[0], T()[0], 0.5), '侧棱', { cls: 'up', dx: -52, dy: 6 });
  v.update();
  $('pnBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-n]');
    if (!b) return;
    s.n = +b.dataset.n;
    $('pnBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    v.update();
  });
}

/* ---------- 第 5 页：上底面向中心收缩 ---------- */
function initShrink() {
  const H = 2.3;
  const s = { base: 'pent', k: 1 };
  const v = mkView('shrink', { w: 560, h: 400, scale: 98, yaw: -28, pitch: 20, center: [0, 0, 1.15] });
  const B = () => BASES[s.base].pts.map((p) => sub(p, centroid(BASES[s.base].pts)));
  const top = () => add([0, 0, H], [0, 0, 0]);
  const T = () => B().map((p) => add(top(), mul(p, s.k)));
  const isPyr = () => s.k < 0.005;
  v.solid(() => (isPyr() ? pyramidVF(B(), top()) : prismVF(B(), T())));
  v.face(B, { cls: 'f2' });
  v.face(T, { cls: 'f2', show: () => !isPyr() });
  v.dot(top, { cls: 'c2', show: isPyr, r: 6 });
  v.update();
  btnGroup($('shBase'), BASE_ITEMS, s.base, (k) => { s.base = k; v.update(); });
  MathKit.slider($('shK'), (k) => {
    s.k = k;
    $('shKV').textContent = k < 0.005 ? '缩成一点' : `${Math.round(k * 100)}%`;
    v.update();
  });
}

/* ---------- 第 6 页：平行于底面的平面截正四棱锥 ---------- */
function initCut() {
  const A = 1.3; // 底面正方形半边长
  const H = 2.8;
  const s = { u: 0.45 };
  const S = [0, 0, H];
  const base = [[-A, -A, 0], [A, -A, 0], [A, A, 0], [-A, A, 0]];
  const sec = () => base.map((p) => lerp(p, S, s.u)); // 截面在高 u·H 处
  const v = mkView('cut', { w: 560, h: 430, scale: 94, yaw: -28, pitch: 18, center: [0, 0, 1.35] });
  v.face(() => [[-2.1, -2.1, s.u * H], [2.1, -2.1, s.u * H], [2.1, 2.1, s.u * H], [-2.1, 2.1, s.u * H]], { cls: 'f1' });
  v.solid(() => prismVF(base, sec()));
  v.solid(() => pyramidVF(sec(), S), { cls: 'faint' });
  v.face(sec, { cls: 'f2' });
  ['A', 'B', 'C', 'D'].forEach((n, i) => {
    v.label(base[i], n, { dx: 6, dy: 22 });
    v.label(() => sec()[i], `${n}′`, { dx: 8, dy: -6 });
  });
  v.label(S, 'S', { dx: 8, dy: -8 });
  v.update();
  MathKit.slider($('cutU'), (u) => {
    s.u = u;
    $('cutUV').textContent = fmt(u, 2);
    const ratio = 1 - u; // 截面边长 : 底面边长 = SA′ : SA = 截面到 S 的距离 : 高
    $('cutInfo').innerHTML = `$A'B':AB=${fmt(ratio)}$　截面到 $S$ 的距离 : 高 $=${fmt(ratio)}$`;
    tex($('cutInfo'));
    v.update();
  });
}

/* ---------- 第 7 页：例 1 分步画四棱柱、三棱台 ---------- */
function initEx1() {
  const on = (n) => () => deckStep.n >= n;
  const quad = [[-1.3, -0.8, 1.8], [0.9, -0.8, 1.8], [1.3, 0.8, 1.8], [-0.7, 0.8, 1.8]]; // 上底面
  const down = quad.map((p) => add(p, [0, 0, -1.8]));
  const va = mkView('ex1a', { w: 420, h: 300, scale: 92, yaw: -20, pitch: 22, center: [0, 0, 0.9] });
  va.solid(() => prismVF(down, quad), { cls: 'occ-only' });
  quad.forEach((p, i) => va.seg([p, quad[(i + 1) % 4]], { show: on(1) }));
  quad.forEach((p, i) => va.seg([p, down[i]], { show: on(2) }));
  down.forEach((p, i) => va.seg([p, down[(i + 1) % 4]], { show: on(3) }));
  va.update();

  const B = regular(3, 1.35, -Math.PI / 2 + 0.35);
  const S = [0, 0, 2.6];
  const U = 0.45;
  const T = B.map((p) => lerp(p, S, U));
  const vb = mkView('ex1b', { w: 420, h: 300, scale: 80, yaw: -20, pitch: 20, center: [0, 0, 1.2] });
  vb.solid(() => pyramidVF(B, S), { show: () => deckStep.n >= 4 && deckStep.n < 6 });
  vb.solid(() => prismVF(B, T), { show: on(6) });
  vb.curve(T, { closed: true, cls: 'c2', show: () => deckStep.n === 5 });
  vb.dot(T[0], { cls: 'c2', show: () => deckStep.n === 5 });
  vb.update();
}

/* ---------- 第 8 页：旋转生成（核心互动） ---------- */
const SPIN = {
  rect: { label: '矩形', prof: [[0, 0], [1.3, 0], [1.3, 2.3], [0, 2.3]], solid: { r1: 1.3, r2: 1.3, h: 2.3 }, name: '圆柱' },
  tri: { label: '直角三角形', prof: [[0, 0], [1.45, 0], [0, 2.4]], solid: { r1: 1.45, r2: 0, h: 2.4 }, name: '圆锥' },
  trap: { label: '直角梯形', prof: [[0, 0], [1.5, 0], [0.75, 2.1], [0, 2.1]], solid: { r1: 1.5, r2: 0.75, h: 2.1 }, name: '圆台' },
  semi: {
    label: '半圆',
    prof: Array.from({ length: 37 }, (_, i) => { const t = -Math.PI / 2 + (Math.PI * i) / 36; return [1.2 * Math.cos(t), 1.2 + 1.2 * Math.sin(t)]; }),
    sphere: { c: [0, 0, 1.2], r: 1.2 },
    lat: [-60, -30, 0, 30, 60].map((d) => [1.2 * Math.cos(d * DEG), 1.2 + 1.2 * Math.sin(d * DEG)]),
    name: '球',
  },
};
const MERIDIAN_STEP = 30;
function initSpin() {
  const s = { key: 'rect', a: 150 };
  const cur = () => SPIN[s.key];
  const at = (rz, th) => [rz[0] * Math.cos(th), rz[0] * Math.sin(th), rz[1]];
  const v = mkView('spin', { w: 520, h: 520, scale: 145, yaw: -15, pitch: 18, center: [0, 0, 1.2] });
  const done = () => s.a >= 360;
  v.seg([[0, 0, -0.5], [0, 0, 2.9]], { cls: 'ax', hide: false });
  // 扫过的母线（每 30° 一条）
  for (let k = 1; k < 360 / MERIDIAN_STEP; k += 1) {
    v.curve(() => cur().prof.map((p) => at(p, k * MERIDIAN_STEP * DEG)), { cls: 'thin sweep', hide: false, show: () => !done() && k * MERIDIAN_STEP <= s.a });
  }
  // 各顶点扫出的纬圆弧
  for (let j = 0; j < 5; j += 1) {
    const pt = () => { const c = cur(); const L = c.lat || c.prof.filter((p) => p[0] > 1e-9); return L[j]; };
    v.curve(() => {
      const p = pt();
      const n = Math.max(2, Math.ceil(s.a / 4));
      return Array.from({ length: n + 1 }, (_, i) => at(p, (s.a * DEG * i) / n));
    }, { cls: 'c1 sweep', hide: false, show: () => !done() && pt() && s.a > 0 });
  }
  v.revolve(() => ({ ...(cur().solid || { r1: 1, r2: 1, h: 1 }), at: [0, 0, 0] }), { show: () => done() && !!cur().solid });
  v.sphere(() => cur().sphere || { c: [0, 0, 0], r: 1 }, { show: () => done() && !!cur().sphere });
  // 转到当前位置的平面图形
  v.face(() => cur().prof.map((p) => at(p, s.a * DEG)), { cls: 'f2' });
  v.curve(() => cur().prof.map((p) => at(p, s.a * DEG)), { cls: 'c2', closed: true, hide: false });
  v.face(() => cur().prof.map((p) => at(p, 0)), { cls: 'f2', show: () => s.a > 0 && !done() });
  v.onUpdate = () => {
    $('spInfo').textContent = done() ? `转满一周：得到${cur().name}（拖动可旋转观察）` : `${cur().label}已转过 ${s.a}°；蓝线是边上各点扫过的圆弧`;
  };
  v.update();
  btnGroup($('spBtns'), Object.entries(SPIN).map(([k, c]) => [k, c.label]), s.key, (k) => { s.key = k; v.update(); });
  MathKit.slider($('spA'), (a) => { s.a = a; $('spAV').textContent = `${a}°`; v.update(); });
}

/* ---------- 第 9 页：例 2 圆锥 + 圆柱；例 3 六棱柱挖去圆柱 ---------- */
function initEx2() {
  // 例 2：AB 竖直，A 在上（圆锥顶点），B 在下；BC = 1.2，CD 平行于 AB 长 1.6，DA 斜
  const v = mkView('ex2', { w: 320, h: 360, scale: 80, yaw: -30, pitch: 18, center: [0, 0, 1.4] });
  v.revolve({ r1: 1.2, r2: 1.2, h: 1.6, at: [0, 0, 0] });
  v.revolve({ r1: 1.2, r2: 0, h: 1.2, at: [0, 0, 1.6] });
  v.seg([[0, 0, -0.3], [0, 0, 3.1]], { cls: 'ax', hide: false });
  v.label([0, 0, 2.8], 'A', { dx: 8, dy: -4 });
  v.label([0, 0, 0], 'B', { dx: 6, dy: 20 });
  v.update();
}
function initEx3() {
  const R = 1.55;
  const H = 1.0;
  const r = 0.6;
  const v = mkView('ex3', { w: 360, h: 300, scale: 82, yaw: -25, pitch: 30, center: [0, 0, 0.5] });
  const hex = regular(6, R);
  v.solid(() => prismVF(hex, hex.map((p) => add(p, [0, 0, H]))));
  // 孔壁上的点：沿视线走到孔口所在平面时仍在孔内，才看得见
  const E = () => {
    const y = v.state.yaw * DEG;
    const p = v.state.pitch * DEG;
    return [-Math.sin(y) * Math.cos(p), -Math.cos(y) * Math.cos(p), Math.sin(p)];
  };
  const seen = (P) => {
    const e = E();
    if (Math.abs(e[2]) < 1e-6) return false;
    const zExit = e[2] > 0 ? H : 0;
    const t = (zExit - P[2]) / e[2];
    const Q = add(P, mul(e, t));
    return Math.hypot(Q[0], Q[1]) <= r + 1e-6;
  };
  const N = 72;
  const ringPt = (i, z) => [r * Math.cos((2 * Math.PI * i) / N), r * Math.sin((2 * Math.PI * i) / N), z];
  [0, H].forEach((z) => {
    for (let i = 0; i < N; i += 1) {
      const a = ringPt(i, z);
      const b = ringPt(i + 1, z);
      const vis = () => seen(lerp(a, b, 0.5));
      v.seg([a, b], { hide: false, show: vis });
      v.seg([a, b], { hide: true, show: () => !vis() });
    }
  });
  v.update();
}

/* ---------- 第 10 页：斜二测画法（例 4 正三角形，边长 4） ---------- */
const SIN45 = Math.SQRT1_2;
const oblique = ([x, y]) => [x + (y / 2) * SIN45, (y / 2) * SIN45]; // 横向不变，y 方向沿 45° 且减半
function initOblique() {
  const C = [0, 2 * Math.sqrt(3)];
  const tri = [[-2, 0], [2, 0], C];
  const s = { p: [1, 1.5] };
  const a = board($('obA'), { x: [-3, 3], y: [-0.8, 4.2], w: 360, ticks: 1 });
  a.poly(tri, { cls: 'fill1' });
  a.seg(() => [s.p, [s.p[0], 0]], { cls: 'dash' });
  [['A', [-2, 0], -18, 22], ['B', [2, 0], 4, 22], ['C', C, 8, -4]].forEach(([n, p, dx, dy]) => { a.pt(p); a.text(p, n, { dx, dy }); });
  a.text(() => s.p, 'P', { dx: 10, dy: -8 });
  a.drag(() => s.p, (x, y) => { s.p = [Math.max(-2.8, Math.min(2.8, x)), Math.max(0, Math.min(4, y))]; b.update(); });

  const b = board($('obB'), { x: [-3, 3], y: [-0.8, 2.2], w: 360, axes: false, grid: false });
  b.seg([[-3, 0], [3, 0]], { cls: 'thin' });
  b.seg([[-1.1, -1.1], [2, 2]], { cls: 'thin' });
  b.text([3, 0], "x'", { dx: -16, dy: 22 });
  b.text([2, 2], "y'", { dx: 6, dy: 4 });
  b.text([0, 0], "O'", { dx: -24, dy: 22 });
  b.poly(tri.map(oblique), { cls: 'fill1' });
  b.seg(() => [[s.p[0], 0], oblique(s.p)], { cls: 'dash' });
  [["A'", [-2, 0], -24, 22], ["B'", [2, 0], 2, 22], ["C'", C, 8, -4]].forEach(([n, p, dx, dy]) => { b.pt(oblique(p)); b.text(oblique(p), n, { dx, dy }); });
  b.pt(() => oblique(s.p), { cls: 'c2', r: 7 });
  b.text(() => oblique(s.p), "P'", { dx: 10, dy: -8 });
  b.onUpdate = () => {
    $('obMsg').innerHTML = `$P(${fmt(s.p[0], 1)},\\ ${fmt(s.p[1], 1)})$：$P$ 到 $x$ 轴的距离 $${fmt(s.p[1], 2)}$，$P'$ 沿 $y'$ 方向的距离 $${fmt(s.p[1] / 2, 2)}$（减半）。`;
    tex($('obMsg'));
  };
  a.update();
  b.update();
}

/* ---------- 第 11 页：例 5 正方体直观图（AB = 2，AD = 1，∠BAD = 45°） ---------- */
function initEx5() {
  const b = board($('ex5'), { x: [-0.6, 3.6], y: [-0.5, 3.1], w: 420, axes: false, grid: false });
  const D0 = [SIN45, SIN45];
  const P = { A: [0, 0], B: [2, 0], C: [2 + SIN45, SIN45], D: D0 };
  const up = (p) => [p[0], p[1] + 2];
  const E = (p, q, cls, st) => { const l = b.seg([p, q], { cls }); l.setAttribute('data-step', st); };
  E(P.A, P.B, 'c1', 2); E(P.B, P.C, 'c1', 2); E(P.C, P.D, 'dash', 2); E(P.D, P.A, 'dash', 2);
  ['A', 'B', 'C'].forEach((k) => E(P[k], up(P[k]), 'c1', 3));
  E(P.D, up(P.D), 'dash', 3);
  const top = ['A', 'B', 'C', 'D'].map((k) => up(P[k]));
  top.forEach((p, i) => E(p, top[(i + 1) % 4], 'c1', 4));
  Object.entries(P).forEach(([k, p]) => {
    const dx = k === 'A' ? -22 : 8;
    b.text(p, k, { dx, dy: k === 'D' ? -6 : 22 }).setAttribute('data-step', 2);
    b.text(up(p), `${k}′`, { dx, dy: -6 }).setAttribute('data-step', 4);
  });
  b.text([0.42, 0.12], '45°', { cls: 'lb up' }).setAttribute('data-step', 2);
  b.update();
}

/* ---------- 第 12 页：两个反例 ---------- */
function initBian() {
  const v2 = mkView('bian2', { w: 300, h: 240, scale: 66, yaw: -30, pitch: 22, center: [0, 0, 0.8] });
  const sq = [[-1.2, -1.2, 0], [1.2, -1.2, 0], [1.2, 1.2, 0], [-1.2, 1.2, 0]];
  const rc = [[-0.8, -0.35, 1.6], [0.8, -0.35, 1.6], [0.8, 0.35, 1.6], [-0.8, 0.35, 1.6]];
  v2.solid(prismVF(sq, rc));
  v2.update();
  const v3 = mkView('bian3', { w: 300, h: 240, scale: 60, yaw: -30, pitch: 18, center: [0, 0, 1.3] });
  const q = [[-1, -0.8, 0], [1, -0.8, 0], [1, 0.8, 0], [-1, 0.8, 0]];
  const mid = q.map((p) => add(p, [0.7, 0, 1.3]));
  const tp = mid.map((p) => add(p, [-0.7, 0, 1.3]));
  v3.solid(prismVF(q, mid));
  v3.solid(prismVF(mid, tp));
  v3.update();
}

window.LESSON = {
  init() {
    initSweep();
    initNames();
    initShrink();
    initCut();
    initEx1();
    initSpin();
    initEx2();
    initEx3();
    initOblique();
    initEx5();
    initBian();
  },
  onRender(slide, step) {
    deckStep.n = step;
    views.forEach((v) => { if (slide.contains(v.svg)) v.update(); });
  },
};
