'use strict';
/* 高一下 13.3 空间图形的表面积和体积 · 本课互动：圆柱/圆锥/圆台侧面连续展开（弧长守恒）、r′ 连续变化、
 * 祖暅原理截面对比（斜棱柱、半球与“圆柱挖圆锥”）、三棱柱分割、组合体。3D 见 ../shared/solid3d.js */
const { board, tex, fmt } = MathKit;
const { add, sub, mul, lerp } = Solid3D.vec;
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const views = [];
const deckStep = { n: 0 };
const mkView = (id, opt) => { const v = Solid3D.view($(id), opt); views.push(v); return v; };
const ring = (c, r, z, n = 96, a0 = 0, a1 = 2 * Math.PI) => Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z]; });
const regular = (n, R, rot = 0, z = 0) => Array.from({ length: n }, (_, i) => { const t = rot + (2 * Math.PI * i) / n; return [R * Math.cos(t), R * Math.sin(t), z]; });
function prismVF(B, T) {
  const n = B.length;
  return { V: [...B, ...T], F: [B.map((_, i) => n - 1 - i), T.map((_, i) => n + i), ...B.map((_, i) => [i, (i + 1) % n, n + ((i + 1) % n), n + i])] };
}
const viewDir = (v) => { const y = v.state.yaw * DEG; const p = v.state.pitch * DEG; return [-Math.sin(y) * Math.cos(p), -Math.cos(y) * Math.cos(p), Math.sin(p)]; };

/* ---------- 第 3 页：多面体侧面展开图（2D，按边长精确） ---------- */
function initFlat() {
  // 正六棱柱：底面边长 1，高 1.6 → 矩形 6 × 1.6
  const P = board($('unP'), { x: [-0.4, 6.4], y: [-0.7, 2.2], w: 420, axes: false, grid: false });
  for (let i = 0; i < 6; i += 1) P.poly([[i, 0], [i + 1, 0], [i + 1, 1.6], [i, 1.6]], { cls: 'fill1' });
  P.text([3, 0], 'c（底面周长）', { cls: 'lb up', dx: -40, dy: 24 });
  P.text([6, 0.8], 'h', { dx: 8, dy: 6 });
  P.update();
  // 正四棱锥：底边 1.5，斜高 1.25 → 侧棱 √(1.25² + 0.75²)
  const fan = (inner) => {
    const e = Math.hypot(1.25, 0.75);
    const phi = 2 * Math.asin(0.75 / e);
    const start = Math.PI / 2 - 2 * phi;
    return Array.from({ length: 4 }, (_, i) => {
      const a = start + i * phi;
      const p = (r, t) => [r * Math.cos(t), r * Math.sin(t) - 1.1];
      return inner ? [p(e, a), p(e, a + phi), p(e * inner, a + phi), p(e * inner, a)] : [[0, -1.1], p(e, a), p(e, a + phi)];
    });
  };
  const Y = board($('unY'), { x: [-1.7, 1.7], y: [-2.05, 0.5], w: 420, axes: false, grid: false });
  fan().forEach((t) => Y.poly(t, { cls: 'fill1' }));
  Y.seg([[0, -1.1], [0, 0.15]], { cls: 'dash' });
  Y.text([0, -0.5], "h′", { dx: 6, dy: 0 });
  Y.update();
  const T = board($('unT'), { x: [-1.7, 1.7], y: [-2.05, 0.5], w: 420, axes: false, grid: false });
  fan(0.5).forEach((t) => T.poly(t, { cls: 'fill1' }));
  T.update();
}

/* ---------- 第 4 页：例 1 正四棱锥 ---------- */
function initEx1() {
  const a = 1.5;
  const h = 1.0;
  const B = [[-a / 2, -a / 2, 0], [a / 2, -a / 2, 0], [a / 2, a / 2, 0], [-a / 2, a / 2, 0]];
  const S = [0, 0, h];
  const O = [0, 0, 0];
  const E = [0, -a / 2, 0];
  const v = mkView('ex1', { w: 480, h: 360, scale: 210, yaw: -28, pitch: 18, center: [0, 0, 0.45] });
  v.solid({ V: [...B, S], F: [[3, 2, 1, 0], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]] });
  v.face([S, O, E], { cls: 'f1' });
  [[S, O], [O, E], [S, E]].forEach((s) => v.seg(s, { cls: 'c1' }));
  [[S, 'S', 6, -6], [O, 'O', 6, -4], [E, 'E', 4, 22]].forEach(([p, n, dx, dy]) => { v.dot(p); v.label(p, n, { dx, dy }); });
  v.label(lerp(S, O, 0.5), '1.0', { cls: 'up', dx: -36, dy: 4 });
  v.label(lerp(B[0], B[1], 0.75), '1.5', { cls: 'up', dx: 4, dy: 24 });
  v.update();
}

/* ---------- 第 5 页：旋转体侧面展开（核心互动）
 * 保持正面的一条母线不动，侧面在过这条母线的切平面上连续展平；整个过程中母线长、弧长（= 底面周长 2πr）都不变。 */
const SHAPES = {
  cyl: { label: '圆柱', r: 0.8, h: 1.8 },
  cone: { label: '圆锥', r: 0.9, l: 2.4 },
  frus: { label: '圆台', r: 1.0, r2: 0.5, l: 1.6 },
};
const N_ARC = 96;
// 圆柱：曲率从 1/r 线性降到 0；返回高度 z 处的那条“纬线”
function cylSheet(sh, u, z) {
  const R = u < 1 - 1e-6 ? sh.r / (1 - u) : Infinity;
  return Array.from({ length: N_ARC + 1 }, (_, i) => {
    const s = -Math.PI * sh.r + (2 * Math.PI * sh.r * i) / N_ARC; // 弧长参数，0 处为固定母线
    return Number.isFinite(R) ? [-sh.r + R * (1 - Math.cos(s / R)), -R * Math.sin(s / R), z] : [-sh.r, -s, z];
  });
}
// 圆锥 / 圆台：母线总长 L（台为补成的大圆锥），底面半径 r。展开中锥面“底圆”半径 ρ 从 r 增到 L（展平）
function coneParts(sh) {
  if (sh.r2 === undefined) return { L: sh.l, t0: 0 };
  const x = (sh.l * sh.r2) / (sh.r - sh.r2); // 小圆锥母线长
  return { L: sh.l + x, t0: x };
}
function coneSheet(sh, u) {
  const { L, t0 } = coneParts(sh);
  const H = Math.sqrt(L * L - sh.r * sh.r);
  const A = [0, 0, H]; // （补成的）圆锥顶点
  const rho = sh.r + (L - sh.r) * u;
  const al = Math.asin(Math.min(1, rho / L));
  const al0 = Math.asin(sh.r / L);
  const psi = (2 * Math.PI * sh.r) / rho; // 当前锥面上覆盖的角度，弧长 ρψ = 2πr 不变
  const th = (a) => Math.atan2(-Math.cos(a), -Math.sin(a));
  const beta = th(al0) - th(al); // 绕过顶点、平行于 y 轴的直线转回，使固定母线方向不变
  const [cb, sb] = [Math.cos(beta), Math.sin(beta)];
  const pt = (t, sig) => {
    const ph = Math.PI + sig;
    const d = [Math.sin(al) * Math.cos(ph), Math.sin(al) * Math.sin(ph), -Math.cos(al)];
    return add(A, mul([d[0] * cb - d[2] * sb, d[1], d[0] * sb + d[2] * cb], t));
  };
  const arc = (t) => Array.from({ length: N_ARC + 1 }, (_, i) => pt(t, -psi / 2 + (psi * i) / N_ARC));
  return { arc, pt, psi, L, t0, A, H };
}
function initUnfold() {
  const s = { key: 'cone', u: 0.5 };
  const sh = () => SHAPES[s.key];
  const v = mkView('unfold', { w: 560, h: 460, scale: 92, yaw: 72, pitch: 14, center: [-0.4, 0, 1.1] });
  const cur = () => {
    const k = s.key;
    if (k === 'cyl') {
      const b = cylSheet(sh(), s.u, 0);
      const t = cylSheet(sh(), s.u, sh().h);
      return { outer: b, inner: t, gen: (i) => [b[i], t[i]] };
    }
    const c = coneSheet(sh(), s.u);
    const outer = c.arc(c.L);
    const inner = c.t0 > 0 ? c.arc(c.t0) : null;
    return { outer, inner, gen: (i) => [inner ? inner[i] : c.A, outer[i]] };
  };
  v.face(() => { const c = cur(); return [...c.outer, ...(c.inner ? [...c.inner].reverse() : [cur().gen(0)[0]])]; }, { cls: 'f2' });
  v.curve(() => cur().outer, { cls: 'c1', hide: false });
  v.curve(() => cur().inner, { cls: 'c1', hide: false, show: () => !!cur().inner });
  for (let k = 1; k < 8; k += 1) v.seg(() => cur().gen((k * N_ARC) / 8), { cls: 'thin', hide: false });
  v.seg(() => cur().gen(0), { cls: 'c2', hide: false });
  v.seg(() => cur().gen(N_ARC), { cls: 'c2', hide: false });
  // 原来的底面（顶面）圆，作参照
  v.curve(() => ring([0, 0], sh().r, 0), { cls: 'ref', hide: false });
  v.curve(() => (s.key === 'cyl' ? ring([0, 0], sh().r, sh().h) : s.key === 'frus' ? ring([0, 0], sh().r2, coneSheet(sh(), 0).H * (1 - sh().r2 / sh().r)) : null), { cls: 'ref', hide: false, show: () => s.key !== 'cone' });
  v.onUpdate = () => {
    const S = sh();
    const msg = $('ufMsg');
    const C = 2 * Math.PI * S.r;
    let t;
    if (s.key === 'cyl') t = `展开图是<b>矩形</b>：长 $2\\pi r=${fmt(C)}$，宽 $=h=${S.h}$（$r=${S.r}$）。`;
    else if (s.key === 'cone') t = `展开图是<b>扇形</b>：半径 $l=${S.l}$，弧长 $2\\pi r=${fmt(C)}$，圆心角 $\\dfrac{360^\\circ r}{l}=${fmt((360 * S.r) / S.l, 1)}^\\circ$（$r=${S.r}$）。`;
    else { const { L, t0 } = coneParts(S); t = `展开图是<b>扇环</b>：内、外半径 $${fmt(t0)}$、$${fmt(L)}$（差 = 母线 $l=${S.l}$），外弧 $2\\pi r=${fmt(C)}$，内弧 $2\\pi r'=${fmt(2 * Math.PI * S.r2)}$，圆心角 $${fmt((360 * S.r) / L, 1)}^\\circ$。`; }
    msg.innerHTML = s.u >= 0.999 ? t : `已展开 ${Math.round(s.u * 100)}%：橙色是剪开的那条母线，蓝色弧长始终等于底面周长 $${fmt(C)}$。`;
    tex(msg);
  };
  $('ufBtns').innerHTML = Object.entries(SHAPES).map(([k, x]) => `<button type="button" class="btn${k === s.key ? ' solid' : ''}" data-k="${k}">${x.label}</button>`).join('');
  $('ufBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    s.key = b.dataset.k;
    $('ufBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    v.update();
  });
  MathKit.slider($('ufU'), (u) => { s.u = u; $('ufUV').textContent = `${Math.round(u * 100)}%`; v.update(); });
}

/* ---------- 第 6 页：r′ 从 0 到 r ---------- */
function initRR() {
  const R = 1.2;
  const L = 2;
  const s = { r2: 0.6 };
  const hh = () => Math.sqrt(L * L - (R - s.r2) ** 2);
  const v = mkView('rr', { w: 460, h: 360, scale: 92, yaw: -25, pitch: 16, center: [0, 0, 0.95] });
  v.revolve(() => ({ r1: R, r2: s.r2, h: hh(), at: [0, 0, 0] }));
  v.seg(() => [[R, 0, 0], [s.r2, 0, hh()]], { cls: 'c2', hide: false });
  v.label(() => lerp([R, 0, 0], [s.r2, 0, hh()], 0.5), 'l', { dx: 8, dy: 0 });
  v.onUpdate = () => {
    const S = Math.PI * (R + s.r2) * L;
    const name = s.r2 < 1e-9 ? '圆锥：$\\pi rl$' : Math.abs(s.r2 - R) < 1e-9 ? '圆柱：$2\\pi rl$' : '圆台';
    $('rrMsg').innerHTML = `$r=${R}$，$r'=${fmt(s.r2)}$，$l=${L}$：$S_{\\text{侧}}=\\pi(r+r')l\\approx${fmt(S)}$（${name}）`;
    tex($('rrMsg'));
  };
  v.update();
  MathKit.slider($('rrR'), (x) => { s.r2 = x; $('rrRV').textContent = fmt(x); v.update(); });
}

/* ---------- 第 7 页：例 2 轴截面的一半（x = 1） ---------- */
function initEx2() {
  const r5 = Math.sqrt(5);
  const b = board($('ex2'), { x: [-0.8, 4.8], y: [-0.7, 2.9], w: 420, axes: false, grid: false });
  b.seg([[0, -0.5], [0, 2.8]], { cls: 'dash' });
  b.poly([[0, 0], [4, 0], [2, r5], [0, r5]], { cls: 'fill1' });
  b.seg([[2, r5], [2, 0]], { cls: 'dash' });
  [['O', [0, 0], -22, 20], ['A', [4, 0], 6, 20], ['B', [2, r5], 6, -6], ["O′", [0, r5], -30, -4], ['C', [2, 0], -4, 22]].forEach(([n, p, dx, dy]) => { b.pt(p); b.text(p, n, { dx, dy }); });
  b.text([1, r5], '2x', { cls: 'lb up', dx: -10, dy: -8 });
  b.text([2, 0], '4x', { cls: 'lb up', dx: -12, dy: 40 });
  b.text([3.1, 1.2], '3x', { cls: 'lb up', dx: 6, dy: 0 });
  b.update();
}

/* ---------- 第 8 页：祖暅原理 · 直棱柱与斜棱柱 ---------- */
function initZG1() {
  const a = 1.2;
  const H = 2;
  const SHIFT = 1.1;
  const s = { k: 0.6, h: 0.5 };
  const sq = (cx, z, dx = 0) => [[cx - a / 2 + dx, -a / 2, z], [cx + a / 2 + dx, -a / 2, z], [cx + a / 2 + dx, a / 2, z], [cx - a / 2 + dx, a / 2, z]];
  const v = mkView('zg1', { w: 520, h: 380, scale: 85, yaw: -18, pitch: 18, center: [0.3, 0, 1] });
  v.solid(() => prismVF(sq(-1.3, 0), sq(-1.3, H)));
  v.solid(() => prismVF(sq(1.0, 0), sq(1.0, H, s.k * SHIFT)));
  const zc = () => s.h * H;
  v.face(() => [[-2.6, -1.2, zc()], [3.2, -1.2, zc()], [3.2, 1.2, zc()], [-2.6, 1.2, zc()]], { cls: 'f1' });
  v.face(() => sq(-1.3, zc()), { cls: 'f2' });
  v.face(() => sq(1.0, zc(), s.k * SHIFT * s.h), { cls: 'f2' });
  v.curve(() => sq(-1.3, zc()), { cls: 'c2', closed: true, hide: false });
  v.curve(() => sq(1.0, zc(), s.k * SHIFT * s.h), { cls: 'c2', closed: true, hide: false });
  v.onUpdate = () => {
    $('zgMsg').innerHTML = `两个截面都是边长 $${a}$ 的正方形，面积都是 $${fmt(a * a)}$；高都是 $${H}$ ⇒ 体积相等，$V=Sh=${fmt(a * a * H)}$。`;
    tex($('zgMsg'));
  };
  v.update();
  MathKit.slider($('zgK'), (k) => { s.k = k; $('zgKV').textContent = `${Math.round(k * 100)}%`; v.update(); });
  MathKit.slider($('zgH'), (h) => { s.h = h; $('zgHV').textContent = fmt(h * H); v.update(); });
}

/* ---------- 第 9 页：三棱柱分成三个三棱锥 ---------- */
function initCut3() {
  const A = [-1, -0.6, 0];
  const B = [1, -0.6, 0];
  const C = [0.2, 0.9, 0];
  const up = (p) => add(p, [0, 0, 1.8]);
  const [A1, B1, C1] = [up(A), up(B), up(C)];
  const tets = [[A, B, C, A1], [A1, B1, C1, B], [A1, B, C, C1]];
  const cls = ['c2', 'c1', 'c3'];
  const cen = mul([A, B, C, A1, B1, C1].reduce(add, [0, 0, 0]), 1 / 6);
  const s = { k: 0 };
  const v = mkView('cut3', { w: 480, h: 380, scale: 118, yaw: -20, pitch: 18, center: [0, 0, 0.9] });
  const F = [[0, 2, 1], [0, 1, 3], [1, 2, 3], [2, 0, 3]];
  tets.forEach((T, i) => {
    const tc = mul(T.reduce(add, [0, 0, 0]), 0.25);
    const off = () => mul(sub(tc, cen), 1.6 * s.k);
    const V = () => T.map((p) => add(p, off()));
    v.solid(() => ({ V: V(), F }), { cls: cls[i] });
    F.forEach((f) => v.face(() => f.map((j) => V()[j]), { cls: ['f2', 'f1', 'f3'][i] }));
  });
  [[A, 'A'], [B, 'B'], [C, 'C'], [A1, "A′"], [B1, "B′"], [C1, "C′"]].forEach(([p, n]) => v.label(p, n, { show: () => s.k < 0.05 }));
  v.update();
  MathKit.slider($('c3K'), (k) => { s.k = k; $('c3KV').textContent = `${Math.round(k * 100)}%`; v.update(); });
}

/* ---------- 第 10 页：半球与“圆柱挖去圆锥” ---------- */
function initBall() {
  const R = 1.2;
  const CH = [-1.45, 0, 0];
  const CC = [1.45, 0, 0];
  const s = { t: 0.5 };
  const v = mkView('ball', { w: 560, h: 400, scale: 100, yaw: -12, pitch: 20, center: [0, 0, 0.6] });
  // 半球：轮廓是垂直于视线的大圆在底面以上的一半；底面圆背面一半被球面挡住
  const outline = () => {
    const E = viewDir(v);
    const hz = Math.hypot(E[0], E[1]) || 1;
    const u = [E[1] / hz, -E[0] / hz, 0];
    const w = [-E[2] * u[1], E[2] * u[0], E[0] * u[1] - E[1] * u[0]];
    const sign = w[2] >= 0 ? 1 : -1;
    return Array.from({ length: 61 }, (_, i) => { const a = (Math.PI * i) / 60; return add(CH, add(mul(u, R * Math.cos(a)), mul(w, sign * R * Math.sin(a)))); });
  };
  v.curve(outline, { hide: false });
  const baseHalf = (front) => () => {
    const E = viewDir(v);
    const phi = Math.atan2(E[1], E[0]);
    const pts = ring(CH, R, 0, 48, phi - Math.PI / 2, phi + Math.PI / 2);
    return front ? pts : pts.map((p) => [2 * CH[0] - p[0], -p[1], 0]);
  };
  v.curve(baseHalf(true), { hide: false });
  v.curve(baseHalf(false), { hide: true, show: () => viewDir(v)[2] > 0 });
  v.curve(baseHalf(false), { hide: false, show: () => viewDir(v)[2] <= 0 });
  v.revolve({ r1: R, r2: R, h: R, at: CC });
  // 挖去的圆锥：顶点在下底面圆心，母线画虚线（在圆柱内部）
  const coneGen = (sgn) => () => {
    const E = viewDir(v);
    const hz = Math.hypot(E[0], E[1]) || 1;
    return [CC, add(CC, [sgn * R * (E[1] / hz), -sgn * R * (E[0] / hz), R])];
  };
  v.seg(coneGen(1), { hide: true });
  v.seg(coneGen(-1), { hide: true });
  const z = () => s.t * R;
  v.face(() => [[-3, -1.6, z()], [3, -1.6, z()], [3, 1.6, z()], [-3, 1.6, z()]], { cls: 'f1' });
  const rh = () => Math.sqrt(Math.max(0, R * R - z() * z()));
  v.face(() => ring(CH, rh(), z()), { cls: 'f2' });
  v.curve(() => ring(CH, rh(), z()), { cls: 'c2', hide: false });
  v.face(() => [...ring(CC, R, z()), ...ring(CC, z(), z()).reverse()], { cls: 'f2' });
  v.curve(() => ring(CC, R, z()), { cls: 'c2', hide: false });
  v.curve(() => ring(CC, z(), z()), { cls: 'c1', hide: false, show: () => z() > 1e-6 });
  v.onUpdate = () => {
    const S1 = Math.PI * (R * R - z() * z());
    const S2 = Math.PI * R * R - Math.PI * z() * z();
    $('blMsg').innerHTML = `$R=${R}$，$t=${fmt(z())}$：半球截面 $\\approx${fmt(S1, 3)}$，圆环截面 $\\approx${fmt(S2, 3)}$——<b>相等</b>。`;
    tex($('blMsg'));
  };
  v.update();
  MathKit.slider($('blT'), (t) => { s.t = t; $('blTV').textContent = fmt(t * R); v.update(); });
}

/* ---------- 第 11 页：例 3 六角螺帽（1 单位 = 10 mm） ---------- */
function initNut() {
  const A = 1.2;
  const H = 1.0;
  const r = 0.5;
  const v = mkView('nut', { w: 380, h: 240, scale: 75, yaw: -25, pitch: 30, center: [0, 0, 0.5] });
  const hex = regular(6, A);
  v.solid(prismVF(hex, hex.map((p) => add(p, [0, 0, H]))));
  const seen = (P) => {
    const e = viewDir(v);
    if (Math.abs(e[2]) < 1e-6) return false;
    const t = ((e[2] > 0 ? H : 0) - P[2]) / e[2];
    const Q = add(P, mul(e, t));
    return Math.hypot(Q[0], Q[1]) <= r + 1e-6;
  };
  const N = 72;
  [0, H].forEach((zz) => {
    const pts = ring([0, 0], r, zz, N);
    for (let i = 0; i < N; i += 1) {
      const vis = () => seen(lerp(pts[i], pts[i + 1], 0.5));
      v.seg([pts[i], pts[i + 1]], { hide: false, show: vis });
      v.seg([pts[i], pts[i + 1]], { hide: true, show: () => !vis() });
    }
  });
  v.update();
}

/* ---------- 第 12 页：例 4 奖杯（1 单位 = 10 cm） ---------- */
function initCup() {
  const sq = (a, z) => [[-a / 2, -a / 2, z], [a / 2, -a / 2, z], [a / 2, a / 2, z], [-a / 2, a / 2, z]];
  const rect = (w, d, z) => [[-w / 2, -d / 2, z], [w / 2, -d / 2, z], [w / 2, d / 2, z], [-w / 2, d / 2, z]];
  const v = mkView('cup', { w: 420, h: 480, scale: 150, yaw: -28, pitch: 16, center: [0, 0, 1.45] });
  v.solid(prismVF(sq(1.5, 0), sq(1.1, 0.5)));
  v.solid(prismVF(rect(0.8, 0.6, 0.5), rect(0.8, 0.6, 2.3)));
  v.sphere({ c: [0, 0, 2.6], r: 0.3 });
  v.update();
  const vt = (5 / 3) * (15 * 15 + 15 * 11 + 11 * 11);
  const total = vt + 6 * 8 * 18 + (4 / 3) * Math.PI * 27;
  $('cupV').textContent = `代码核算 ${total.toFixed(2)}`;
}

window.LESSON = {
  init() {
    initFlat();
    initEx1();
    initUnfold();
    initRR();
    initEx2();
    initZG1();
    initCut3();
    initBall();
    initNut();
    initCup();
  },
  onRender(slide, step) {
    deckStep.n = step;
    views.forEach((v) => { if (slide.contains(v.svg)) v.update(); });
  },
};
