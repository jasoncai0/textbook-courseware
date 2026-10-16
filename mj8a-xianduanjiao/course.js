'use strict';
/* 八上 2.4 线段、角的轴对称性 · 本课互动：沿垂直平分线 / 角平分线翻折、找“等距点”留下轨迹、尺规作垂直平分线、
 * 三边垂直平分线与三条角平分线的交点、直线上找等距点（车站问题）。通用部分见 ../shared/math.js、mgeo.js、mproof.js。
 * 所有图形由坐标计算，作图板横纵同比例；翻折 = 绕对称轴的空间翻转投影到平面（垂直于轴的分量乘 cos πt）。 */
const { fmt, slider } = MathKit;
const { add, sub, mul, dot, dir, dist, lerp, meet, foot, line, right, sketch } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const perp = (v) => [-v[1], v[0]];
const unit = (v) => mul(v, 1 / (Math.hypot(...v) || 1));

/** 点 X 绕过 O、方向 u（单位向量）的轴翻转 t（0～1，1 = 完全翻到另一侧，即关于轴对称） */
const foldPt = (X, O, u, t) => {
  const d = sub(X, O);
  const par = mul(u, dot(d, u));
  return add(O, add(par, mul(sub(d, par), Math.cos(Math.PI * t))));
};
/** 线段 PQ 的垂直平分线上的两点 */
const bisector = (P, Q) => { const m = lerp(P, Q, 0.5); return [m, add(m, perp(sub(Q, P)))]; };
/** 角 V 的平分线与对边 PQ 的交点 */
const bisFoot = (V, P, Q) => lerp(P, Q, dist(V, P) / (dist(V, P) + dist(V, Q)));
const area2 = (A, B, C) => Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]));
const MIN_AREA2 = 3; // 拖顶点时三角形不能压扁

/* ---------- 第 3 页：沿垂直平分线翻折 ---------- */
function initFold1() {
  const A = [-3.5, 0];
  const B = [3.5, 0];
  const O = [0, 0];
  const s = { p: 3.4, t: 0 };
  const P = () => [0, s.p];
  const A2 = () => foldPt(A, O, [0, 1], s.t);
  const b = Geo.board($('fold1'), { x: [-5, 5], y: [-1.3, 5.6], w: 560 });
  b.poly(() => [P(), O, B], { cls: 'tri-b' });
  b.poly(() => [P(), O, A2()], { cls: 'tri-m' });
  line(b, [0, -1], [0, 1], { cls: 'gl axis-l' });
  b.seg([A, B], { cls: 'gs' });
  b.seg(() => [P(), A2()], { cls: 'gl c-a' });
  b.seg(() => [P(), B], { cls: 'gl c-b' });
  right(b, O, B, P, { s: 0.32 });
  right(b, O, A, P, { s: 0.32 });
  b.text([-0.62, 0.75], '1', { cls: 'lb up gnum' });
  b.text([0.4, 0.75], '2', { cls: 'lb up gnum' });
  b.text([0.15, 5.25], 'l');
  b.text(A, 'A', { dx: -8, dy: 24 });
  b.text(() => (s.t > 0.02 ? A2() : null), () => (s.t > 0.98 ? '' : 'A'), { cls: 'lb ghost', dx: -6, dy: -10 });
  b.text(B, () => (s.t > 0.98 ? 'B(A)' : 'B'), { dx: -6, dy: 24 });
  b.text(O, 'O', { dx: 6, dy: 24 });
  b.text(P, 'P', { dx: 10, dy: 0 });
  b.drag(P, (x, y) => { s.p = clamp(y, 0.6, 5.1); });
  b.onUpdate = () => {
    $('f1PA').textContent = fmt(dist(P(), A));
    $('f1PB').textContent = fmt(dist(P(), B));
  };
  slider($('fold1t'), (v) => { s.t = v / 100; $('fold1tV').textContent = `${v}%`; b.update(); });
}

/* ---------- 第 5 页：l 外的点 ---------- */
function initOutside() {
  const A = [-3.5, 0];
  const B = [3.5, 0];
  const s = { P: [2.2, 3.4] };
  const L = [[0, -1], [0, 1]];
  // P 在 B 一侧时连 PA 交 l；在 A 一侧时连 PB 交 l（对称）
  const far = () => (s.P[0] > 0 ? A : B);
  const near = () => (s.P[0] > 0 ? B : A);
  const on = () => s.P[0] === 0;
  const Q = () => (on() ? null : meet(s.P, far(), ...L));
  const b = Geo.board($('outB'), { x: [-5, 5], y: [-1.3, 5.6], w: 560 });
  line(b, ...L, { cls: 'gl axis-l' });
  b.seg([A, B], { cls: 'gs' });
  right(b, [0, 0], B, [0, 1], { s: 0.3 });
  b.seg(() => [s.P, A], { cls: 'gl c-a' });
  b.seg(() => [s.P, B], { cls: 'gl c-b' });
  b.seg(() => (on() ? [[0, 0], [0, 0]] : [Q(), near()]), { cls: 'gdash' });
  b.pt(() => Q(), { show: () => !on() });
  b.text(() => (s.P[0] > 0 ? Q() : null), 'Q', { dx: -22, dy: -6 });
  b.text(() => (s.P[0] < 0 ? Q() : null), 'Q', { dx: 8, dy: -6 });
  b.text([0.15, 5.25], 'l');
  b.text(A, 'A', { dx: -8, dy: 24 });
  b.text(B, 'B', { dx: -6, dy: 24 });
  b.text(() => s.P, 'P', { dx: 10, dy: -6 });
  const SNAP = 0.15;
  b.drag(() => s.P, (x, y) => { s.P = [Math.abs(x) < SNAP ? 0 : clamp(x, -4.6, 4.6), clamp(y, 0.5, 5.2)]; });
  b.onUpdate = () => {
    const pa = dist(s.P, A);
    const pb = dist(s.P, B);
    $('oPA').textContent = fmt(pa);
    $('oPB').textContent = fmt(pb);
    const msg = $('oMsg');
    if (on()) {
      $('oSumL').textContent = '—';
      $('oSum').textContent = '';
      msg.className = 'tip feedback fb-ok';
      msg.textContent = `P 在 l 上：PA = PB = ${fmt(pa)}。`;
      return;
    }
    const q = Q();
    const sum = dist(s.P, q) + dist(q, near());
    $('oSumL').textContent = s.P[0] > 0 ? 'PQ+QB' : 'PQ+QA';
    $('oSum').textContent = fmt(sum);
    msg.className = 'tip feedback fb-warn';
    msg.textContent = s.P[0] > 0
      ? `P 在 l 的右侧（靠近 B）：PA = PQ + QB = ${fmt(sum)} > PB = ${fmt(pb)}。`
      : `P 在 l 的左侧（靠近 A）：PB = PQ + QA = ${fmt(sum)} > PA = ${fmt(pa)}。`;
  };
  b.update();
}

/* ---------- 第 6、12 页：找等距点，留下轨迹 ---------- */
const MAX_DOTS = 40;
const DOT_GAP = 0.45;
function huntBoard(cfg) {
  const s = { Q: cfg.start, dots: [], show: false, hit: false };
  const b = Geo.board($(cfg.id), cfg.box);
  cfg.draw(b, s);
  Array.from({ length: MAX_DOTS }, (_, i) => b.pt(() => s.dots[i] || null, { cls: 'trace', r: 5 }));
  b.drag(() => s.Q, (x, y) => {
    const q = cfg.clampQ([x, y]);
    const d = cfg.diff(q);
    s.hit = Math.abs(d) < cfg.tol;
    s.Q = s.hit ? cfg.snap(q) : q;
    if (s.hit && s.dots.every((p) => dist(p, s.Q) > DOT_GAP)) s.dots = [...s.dots, s.Q].slice(-MAX_DOTS);
  });
  b.onUpdate = () => {
    cfg.read(s);
    $(cfg.nId).textContent = s.dots.length;
    const msg = $(cfg.msgId);
    msg.className = `tip feedback ${s.hit ? 'fb-ok' : ''}`;
    msg.innerHTML = s.hit ? cfg.okText : `还没相等：再拖一拖（已留下 ${s.dots.length} 个点）。`;
    MathKit.tex(msg);
  };
  $(cfg.showId).addEventListener('click', () => { s.show = !s.show; b.update(); });
  $(cfg.clrId).addEventListener('click', () => { s.dots = []; s.show = false; b.update(); });
  b.update();
  return b;
}

function initHunt1() {
  const A = [-2.5, 0];
  const B = [2.5, 0];
  huntBoard({
    id: 'hunt', nId: 'hN', msgId: 'hMsg', showId: 'hShow', clrId: 'hClr',
    box: { x: [-5, 5], y: [-3.6, 4.6], w: 560 },
    start: [1.8, 3],
    tol: 0.15,
    clampQ: ([x, y]) => [clamp(x, -4.7, 4.7), clamp(y, -3.3, 4.3)],
    diff: (q) => dist(q, A) - dist(q, B),
    snap: (q) => [0, q[1]],
    draw(b, s) {
      line(b, () => (s.show ? [0, 0] : [99, 99]), () => (s.show ? [0, 1] : [99, 100]), { cls: 'gl axis-l' });
      b.seg([A, B], { cls: 'gs' });
      b.seg(() => [s.Q, A], { cls: 'gl c-a' });
      b.seg(() => [s.Q, B], { cls: 'gl c-b' });
      b.pt(A); b.pt(B);
      b.text(A, 'A', { dx: -18, dy: 22 });
      b.text(B, 'B', { dx: 6, dy: 22 });
      b.text(() => s.Q, 'Q', { dx: 10, dy: -8 });
      b.text(() => (s.show ? [0.15, -3.2] : null), 'AB 的垂直平分线', { cls: 'lb up note-l' });
    },
    read(s) {
      $('hQA').textContent = fmt(dist(s.Q, A));
      $('hQB').textContent = fmt(dist(s.Q, B));
    },
    okText: '$QA=QB$！留下一个红点。换个地方再找一个。',
  });
}

/* 第 11、12 页共用的角：OA 方向 −22°，OB 方向 38°，平分线方向 8° */
const ANG = { a: -22, b: 38 };
const BIS = (ANG.a + ANG.b) / 2;
const RAY = 7.6;

function drawAngle(b) {
  const O = [0, 0];
  b.seg([O, mul(dir(ANG.a), RAY)], { cls: 'gs' });
  b.seg([O, mul(dir(ANG.b), RAY)], { cls: 'gs' });
  b.text(O, 'O', { dx: -20, dy: 6 });
  b.text(mul(dir(ANG.a), RAY - 0.3), 'A', { dx: 0, dy: 22 });
  b.text(mul(dir(ANG.b), RAY - 0.3), 'B', { dx: -4, dy: -8 });
}

function initHunt2() {
  const O = [0, 0];
  const uA = dir(ANG.a);
  const uB = dir(ANG.b);
  const uC = dir(BIS);
  const C = (q) => foot(q, O, uA);
  const D = (q) => foot(q, O, uB);
  huntBoard({
    id: 'hunt2', nId: 'h2N', msgId: 'h2Msg', showId: 'h2Show', clrId: 'h2Clr',
    box: { x: [-0.9, 8.4], y: [-3.4, 5.2], w: 560 },
    start: [5.2, 2.2],
    tol: 0.12,
    clampQ: (q) => {
      // 限制在角的内部、离 O 不太近也不太远
      const a = Math.atan2(q[1], q[0]) * 180 / Math.PI;
      const r = clamp(Math.hypot(...q), 1.2, 6.8);
      const t = clamp(a, ANG.a + 4, ANG.b - 4);
      return mul(dir(t), r);
    },
    diff: (q) => dist(q, C(q)) - dist(q, D(q)),
    snap: (q) => mul(uC, dot(q, uC)),
    draw(b, s) {
      drawAngle(b);
      b.seg(() => (s.show ? [O, mul(uC, RAY)] : [O, O]), { cls: 'gl axis-l' });
      b.seg(() => [s.Q, C(s.Q)], { cls: 'gl c-a' });
      b.seg(() => [s.Q, D(s.Q)], { cls: 'gl c-b' });
      right(b, () => C(s.Q), O, () => s.Q, { s: 0.28 });
      right(b, () => D(s.Q), O, () => s.Q, { s: 0.28 });
      b.text(() => C(s.Q), 'C', { dx: -4, dy: 24 });
      b.text(() => D(s.Q), 'D', { dx: -16, dy: -8 });
      b.text(() => s.Q, 'Q', { dx: 10, dy: 0 });
      b.text(() => (s.show ? mul(uC, RAY - 0.6) : null), '角平分线', { cls: 'lb up note-l', dx: -30, dy: -12 });
    },
    read(s) {
      $('h2C').textContent = fmt(dist(s.Q, C(s.Q)));
      $('h2D').textContent = fmt(dist(s.Q, D(s.Q)));
    },
    okText: '$QC=QD$！留下一个红点。换个地方再找一个。',
  });
}

/* ---------- 第 8 页：尺规作垂直平分线 ---------- */
function initCons() {
  const A = [-3, 0];
  const B = [3, 0];
  const HALF = 3;
  const s = { r: 4, k: 0 };
  const h = () => (s.r > HALF ? Math.sqrt(s.r * s.r - HALF * HALF) : 0);
  const meets = () => s.r > HALF + 1e-9;
  const C = () => [0, h()];
  const D = () => [0, -h()];
  const RAD = Math.PI / 180;
  // 弧画在交点附近 ±18°；不相交时画在靠近中点的一段
  const span = () => (meets() ? Math.atan2(h(), HALF) / RAD + 18 : 32);
  const arcAt = (c, base, sign) => (t) => {
    const a = (base + sign * span() * (2 * t - 1)) * RAD;
    return [c[0] + s.r * Math.cos(a), c[1] + s.r * Math.sin(a)];
  };
  const b = Geo.board($('cons'), { x: [-5.2, 5.2], y: [-4.8, 4.8], w: 520 });
  b.seg([A, B], { cls: 'gs' });
  b.pt(A); b.pt(B);
  b.text(A, 'A', { dx: -20, dy: 6 });
  b.text(B, 'B', { dx: 8, dy: 6 });
  b.curve((t) => (s.k >= 1 ? arcAt(A, 0, 1)(t) : [NaN, NaN]), 0, 1, { cls: 'carc', n: 80 });
  b.curve((t) => (s.k >= 2 ? arcAt(B, 180, -1)(t) : [NaN, NaN]), 0, 1, { cls: 'carc', n: 80 });
  b.seg(() => (s.k >= 1 ? [A, add(A, [s.r * Math.cos(span() * RAD), s.r * Math.sin(span() * RAD)])] : [A, A]), { cls: 'gdash' });
  const showCD = () => s.k >= 2 && meets();
  b.pt(C, { show: showCD });
  b.pt(D, { show: showCD });
  b.text(() => (showCD() ? C() : null), 'C', { dx: 8, dy: -6 });
  b.text(() => (showCD() ? D() : null), 'D', { dx: 8, dy: 18 });
  line(b, () => (s.k >= 3 && meets() ? C() : [99, 99]), () => (s.k >= 3 && meets() ? D() : [99, 98]), { cls: 'gl axis-l' });
  right(b, () => (s.k >= 3 && meets() ? [0, 0] : [99, 99]), B, [0, 1], { s: 0.3 });
  b.onUpdate = () => {
    $('consRV').textContent = fmt(s.r);
    const msg = $('consMsg');
    let cls = '';
    let t = '按 ①②③ 的顺序作图。';
    if (s.k >= 2 && !meets()) {
      cls = 'fb-warn';
      t = Math.abs(s.r - HALF) < 1e-9 ? '半径 = ½AB = 3：两弧只在 AB 的中点碰一下，只有 1 个公共点，作不出直线。' : `半径 ${fmt(s.r)} < 3：两弧不相交，找不到 C、D。`;
    } else if (s.k >= 3) {
      cls = 'fb-ok';
      t = `CA = CB = DA = DB = ${fmt(s.r)}，直线 CD 垂直平分 AB。`;
    } else if (s.k === 2) t = '两弧相交于 C、D。下一步：过 C、D 作直线。';
    msg.className = `tip feedback ${cls}`;
    msg.textContent = t;
  };
  $('consBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = +btn.dataset.k;
    b.update();
  });
  slider($('consR'), (v) => { s.r = v; b.update(); });
}

/* ---------- 可拖顶点的三角形 ---------- */
function dragTri(b, s, box) {
  ['A', 'B', 'C'].forEach((k) => b.drag(() => s[k], (x, y) => {
    const p = [clamp(x, box.x[0] + 0.3, box.x[1] - 0.3), clamp(y, box.y[0] + 0.3, box.y[1] - 0.3)];
    const t = { ...s, [k]: p };
    if (area2(t.A, t.B, t.C) > MIN_AREA2) s[k] = p;
  }, { r: 7, hit: 18 }));
}

/* ---------- 第 9 页：例 1 三边垂直平分线 ---------- */
function initEx1() {
  const s = { A: [0.8, 4.2], B: [-3, 0], C: [4, 0], l3: false };
  const box = { x: [-5, 6], y: [-2.6, 6], w: 560 };
  const b = Geo.board($('ex1'), box);
  const O = () => meet(...bisector(s.A, s.B), ...bisector(s.A, s.C));
  const lab = (P, Q, t, cls) => {
    line(b, () => bisector(P(), Q())[0], () => bisector(P(), Q())[1], { cls });
    // 标号放在直线靠上的一端（画板内）
    b.text(() => {
      const [m, n] = bisector(P(), Q());
      const u = unit(sub(n, m));
      const v = u[1] < 0 ? mul(u, -1) : u;
      const k = Math.min(...[(box.y[1] - 0.6 - m[1]) / (v[1] || 1e-9), v[0] ? Math.abs((v[0] > 0 ? box.x[1] - 0.5 - m[0] : m[0] - box.x[0] - 0.5) / v[0]) : 99]);
      return add(m, mul(v, Math.max(0, k)));
    }, t, { cls: 'lb up note-l', dx: 6, dy: 4 });
  };
  b.poly(() => [s.A, s.B, s.C], { cls: 'tri-f' });
  lab(() => s.A, () => s.B, 'l₁', 'gl c-a');
  lab(() => s.A, () => s.C, 'l₂', 'gl c-b');
  line(b, () => (s.l3 ? bisector(s.B, s.C)[0] : [99, 99]), () => (s.l3 ? bisector(s.B, s.C)[1] : [99, 98]), { cls: 'gl c-c' });
  ['A', 'B', 'C'].forEach((k) => b.seg(() => [O() || s[k], s[k]], { cls: 'gdash' }));
  b.pt(() => O(), { cls: 'c2' });
  b.text(() => O(), 'O', { dx: 8, dy: 20 });
  b.text(() => s.A, 'A', { dx: 8, dy: -8 });
  b.text(() => s.B, 'B', { dx: -20, dy: 20 });
  b.text(() => s.C, 'C', { dx: 8, dy: 20 });
  dragTri(b, s, box);
  b.onUpdate = () => {
    const o = O();
    ['A', 'B', 'C'].forEach((k) => { $(`e1${k}`).textContent = o ? fmt(dist(o, s[k])) : '—'; });
  };
  $('e1L3').addEventListener('click', () => { s.l3 = !s.l3; b.update(); });
  b.update();
}

/* ---------- 第 10 页：直线 l 上找等距点（车站） ---------- */
function initBus() {
  const s = { A: [-2.6, 1.3], B: [1.6, 3.1] };
  const box = { x: [-5, 5], y: [-3.6, 4.4], w: 560 };
  const L = [[0, 0], [1, 0]];
  const b = Geo.board($('bus'), box);
  const SNAP = 0.2;
  const sym = () => s.A[0] === s.B[0] && s.A[1] === -s.B[1];
  const vert = () => s.A[0] === s.B[0];
  const P = () => (vert() ? null : meet(...bisector(s.A, s.B), ...L));
  b.seg([[box.x[0], 0], [box.x[1], 0]], { cls: 'road' });
  b.seg([[box.x[0], 0], [box.x[1], 0]], { cls: 'road-c' });
  b.text([box.x[1] - 0.4, 0], 'l', { dx: 0, dy: -10 });
  line(b, () => bisector(s.A, s.B)[0], () => bisector(s.A, s.B)[1], { cls: 'gl axis-l' });
  b.seg(() => [s.A, s.B], { cls: 'gdash' });
  b.seg(() => (P() ? [P(), s.A] : [s.A, s.A]), { cls: 'gl c-a' });
  b.seg(() => (P() ? [P(), s.B] : [s.B, s.B]), { cls: 'gl c-b' });
  b.pt(() => P(), { cls: 'c2', r: 7 });
  b.text(() => P(), 'P', { dx: 8, dy: 22 });
  b.text(() => s.A, 'A', { dx: -22, dy: -6 });
  b.text(() => s.B, 'B', { dx: 10, dy: -6 });
  const put = (k, x, y) => {
    const o = k === 'A' ? 'B' : 'A';
    let p = [clamp(x, -4.6, 4.6), clamp(y, -3.2, 4)];
    if (Math.abs(p[1]) < 0.4) p = [p[0], p[1] < 0 ? -0.4 : 0.4];
    if (Math.abs(p[0] - s[o][0]) < SNAP) p = [s[o][0], p[1]];
    if (p[0] === s[o][0] && Math.abs(p[1] + s[o][1]) < SNAP) p = [p[0], -s[o][1]];
    if (dist(p, s[o]) > 0.5) s[k] = p;
  };
  b.drag(() => s.A, (x, y) => put('A', x, y), { r: 8, hit: 20 });
  b.drag(() => s.B, (x, y) => put('B', x, y), { r: 8, hit: 20 });
  b.onUpdate = () => {
    const p = P();
    $('bPA').textContent = p ? fmt(dist(p, s.A)) : '—';
    $('bPB').textContent = p ? fmt(dist(p, s.B)) : '—';
    const msg = $('bMsg');
    if (sym()) { msg.className = 'tip feedback fb-ok'; msg.textContent = 'A、B 关于 l 对称：l 就是 AB 的垂直平分线，l 上每一点都满足——有无数个。'; return; }
    if (vert()) { msg.className = 'tip feedback fb-warn'; msg.textContent = 'AB ⊥ l：AB 的垂直平分线与 l 平行，没有交点——找不到。'; return; }
    msg.className = 'tip feedback';
    msg.textContent = `AB 的垂直平分线与 l 交于点 P：PA = PB = ${fmt(dist(p, s.A))}。`;
  };
  b.update();
}

/* ---------- 第 11 页：沿角平分线翻折 ---------- */
function initFold2() {
  const O = [0, 0];
  const uA = dir(ANG.a);
  const uB = dir(ANG.b);
  const uC = dir(BIS);
  const s = { d: 4.6, t: 0 };
  const P = () => mul(uC, s.d);
  const C = () => foot(P(), O, uA);
  const D = () => foot(P(), O, uB);
  const fl = (X) => foldPt(X, O, uC, s.t);
  const b = Geo.board($('fold2'), { x: [-0.9, 8.4], y: [-3.4, 5.2], w: 560 });
  b.poly(() => [O, P(), D()], { cls: 'tri-b' });
  b.poly(() => [O, P(), fl(C())], { cls: 'tri-m' });
  drawAngle(b);
  b.seg(() => (s.t > 0.01 ? [O, fl(mul(uA, RAY))] : [O, O]), { cls: 'gl ghost-l' });
  b.seg([O, mul(uC, RAY)], { cls: 'gl axis-l' });
  b.seg(() => [P(), fl(C())], { cls: 'gl c-a' });
  b.seg(() => [P(), D()], { cls: 'gl c-b' });
  right(b, () => fl(C()), O, P, { s: 0.28 });
  right(b, D, O, P, { s: 0.28 });
  Geo.arc(b, O, mul(uA, 3), mul(uC, 3), { r: 1.3, label: '1', lr: 1.35 });
  Geo.arc(b, O, mul(uC, 3), mul(uB, 3), { r: 1.5, label: '2', lr: 1.3 });
  b.text(mul(uC, RAY - 0.2), 'C', { dx: 4, dy: -8 });
  b.text(() => (s.t < 0.98 ? fl(C()) : null), "C'", { cls: 'lb ghost', dx: -4, dy: 24 });
  b.text(() => (s.t < 0.98 ? null : D()), 'D(C)', { dx: -36, dy: -8 });
  b.text(() => (s.t < 0.98 ? D() : null), 'D', { dx: -16, dy: -8 });
  b.text(P, 'P', { dx: 6, dy: 22 });
  b.drag(P, (x, y) => { s.d = clamp(dot([x, y], uC), 1.6, 7); });
  b.onUpdate = () => {
    $('f2C').textContent = fmt(dist(P(), C()));
    $('f2D').textContent = fmt(dist(P(), D()));
  };
  slider($('fold2t'), (v) => { s.t = v / 100; $('fold2tV').textContent = `${v}%`; b.update(); });
}

/* ---------- 第 13 页：例 2 三条角平分线 ---------- */
function initEx2() {
  const s = { A: [1.2, 5], B: [-3.4, 0], C: [4.4, 0], c3: false };
  const box = { x: [-4.6, 5.8], y: [-1.2, 6.2], w: 560 };
  const b = Geo.board($('ex2'), box);
  const Dp = () => bisFoot(s.A, s.B, s.C);
  const Ep = () => bisFoot(s.B, s.A, s.C);
  const Gp = () => bisFoot(s.C, s.A, s.B);
  const P = () => meet(s.A, Dp(), s.B, Ep());
  const F = () => foot(P(), s.A, s.B);
  const M = () => foot(P(), s.B, s.C);
  const N = () => foot(P(), s.A, s.C);
  b.poly(() => [s.A, s.B, s.C], { cls: 'tri-f' });
  b.seg(() => [s.A, Dp()], { cls: 'gl c-a' });
  b.seg(() => [s.B, Ep()], { cls: 'gl c-b' });
  b.seg(() => (s.c3 ? [s.C, Gp()] : [s.C, s.C]), { cls: 'gl c-c' });
  [F, M, N].forEach((X) => {
    b.seg(() => [P(), X()], { cls: 'gdash' });
  });
  right(b, F, () => s.A, P, { s: 0.25 });
  right(b, M, () => s.C, P, { s: 0.25 });
  right(b, N, () => s.C, P, { s: 0.25 });
  b.pt(() => P(), { cls: 'c2' });
  b.text(() => P(), 'P', { dx: -20, dy: -4 });
  b.text(() => s.A, 'A', { dx: 8, dy: -8 });
  b.text(() => s.B, 'B', { dx: -20, dy: 20 });
  b.text(() => s.C, 'C', { dx: 8, dy: 20 });
  b.text(Dp, 'D', { dx: -6, dy: 22 });
  b.text(Ep, 'E', { dx: 8, dy: -4 });
  b.text(F, 'F', { dx: -22, dy: -2 });
  b.text(M, 'M', { dx: 4, dy: 22 });
  b.text(N, 'N', { dx: 8, dy: 6 });
  dragTri(b, s, box);
  b.onUpdate = () => {
    $('e2F').textContent = fmt(dist(P(), F()));
    $('e2M').textContent = fmt(dist(P(), M()));
    $('e2N').textContent = fmt(dist(P(), N()));
  };
  $('e2C').addEventListener('click', () => { s.c3 = !s.c3; b.update(); });
  b.update();
}

/* ---------- 静态图（按题目条件精确作出） ---------- */
function initSketches() {
  sketch($('sk218'), {
    P: { A: [-2.2, 0], B: [2.2, 0], O: [0, 0], P: [0, 3.2], T: [0, 1] },
    seg: 'PA PB AB', line: 'OT', right: [['O', 'B', 'P']], hide: 'T',
    lab: { O: [6, 22], P: [10, 0] }, text: [[[0.12, 3.8], 'l', 0, 0, 'lb']], w: 360,
  });
  sketch($('sk221a'), {
    P: { A: [-2.4, 0], B: [2.4, 0], Q: [0, 0], T: [0, 1] },
    seg: 'AB', line: 'QT', right: [['Q', 'B', 'T']], hide: 'T', lab: { Q: [6, 22] }, w: 360, pad: 0.6,
  });
  sketch($('sk221b'), {
    P: { A: [-2.4, 0], B: [2.4, 0], Q: [0, 1.9], M: [0, 0] },
    seg: 'QA QB AB', dash: 'QM', right: [['M', 'B', 'Q']], w: 360, pad: 0.6,
  });
  // 图 2-28：AD 平分 ∠BAC，DE ⊥ AB，DF ⊥ AC
  const A = [0.4, 3.6];
  const B = [-3.2, 0];
  const C = [3, 0];
  const D = bisFoot(A, B, C);
  const E = foot(D, A, B);
  const F = foot(D, A, C);
  sketch($('sk228'), {
    P: { A, B, C, D, E, F },
    seg: 'AB AC BC AD DE DF EF',
    ang: [['A', 'B', 'D', '1', 0.75], ['A', 'D', 'C', '2', 0.95], ['D', 'E', 'A', '3', 0.55], ['D', 'A', 'F', '4', 0.7]],
    right: [['E', 'A', 'D'], ['F', 'A', 'D']], lab: { D: [-4, 24] }, w: 420, pad: 0.6,
  });
  // 辨一辨 1：C、D 随便取
  const u1 = dir(-18);
  const u2 = dir(42);
  sketch($('jg1'), {
    P: { O: [0, 0], A: mul(u1, 4), B: mul(u2, 4), P: mul(dir(12), 2.8), C: mul(u1, 2.3), D: mul(u2, 1.5) },
    seg: 'OA OB PC PD', dash: 'OP', w: 240, pad: 0.5,
  });
  // 辨一辨 2：Q 在 ∠AOB 外（在它邻补角的平分线上）
  const uB = dir(70);
  const Q = mul(dir(125), 2.6);
  sketch($('jg2'), {
    P: { O: [0, 0], A: [3.2, 0], B: mul(uB, 3.2), Q, C: [Q[0], 0], D: foot(Q, [0, 0], uB), E: [-2.4, 0] },
    seg: 'OA OB QC QD', dash: 'OE', right: [['C', 'A', 'Q'], ['D', 'O', 'Q']], hide: 'E', w: 240, pad: 0.5,
  });
  // 习题 1：BC = 7
  const A1 = [2.4, 1.7];
  const B1 = [0, 0];
  const C1 = [7, 0];
  const [m1, n1] = bisector(A1, B1);
  const [m2, n2] = bisector(A1, C1);
  const E1 = meet(m1, n1, B1, C1);
  const G1 = meet(m2, n2, B1, C1);
  sketch($('pr1'), {
    P: { A: A1, B: B1, C: C1, D: m1, E: E1, F: m2, G: G1 },
    seg: 'AB AC BC AE AG DE FG', right: [['D', 'A', 'E'], ['F', 'A', 'G']], lab: { D: [-18, -2], F: [4, -8] }, w: 360, pad: 0.5,
  });
  // 习题 2：AC = 9，AE = 6，EC = 3，∠C = 90°，BE = AE = 6 ⇒ BC = √27
  const BC2 = Math.sqrt(27);
  const A2 = [BC2, 9];
  const B2 = [0, 0];
  const D2 = lerp(A2, B2, 0.5);
  sketch($('pr2'), {
    P: { A: A2, B: B2, C: [BC2, 0], D: D2, E: [BC2, 3] },
    seg: 'AB BC CA', line: 'DE', right: [['D', 'A', 'E'], ['C', 'B', 'A']], w: 300, pad: 0.8,
  });
  // 习题 9：AB = 16，BC = 12，面积 70 ⇒ A 的高 = 70 × 2 ÷ 12
  const hA = (70 * 2) / 12;
  const A3 = [Math.sqrt(16 * 16 - hA * hA), hA];
  const D3 = bisFoot([0, 0], A3, [12, 0]);
  const E3 = foot(D3, [0, 0], A3);
  sketch($('pr3'), {
    P: { A: A3, B: [0, 0], C: [12, 0], D: D3, E: E3 },
    seg: 'AB BC CA BD DE', right: [['E', 'B', 'D']], w: 360, pad: 1.2,
  });
}

/* ---------- 依据卡：本课四条定理 + 全等判定 ---------- */
MProof.addBasis({
  'pb-xz': { t: '线段垂直平分线上的点到线段两端的距离相等', kind: '定理', src: '八上 2.4（课本 p51）', body: '点 $P$ 在线段 $AB$ 的垂直平分线上 ⇒ $PA=PB$．' },
  'pb-pd': { t: '到线段两端距离相等的点在线段的垂直平分线上', kind: '定理', src: '八上 2.4（课本 p53）', body: '$QA=QB$ ⇒ 点 $Q$ 在线段 $AB$ 的垂直平分线上．<br>线段的垂直平分线是到线段两端距离相等的点的集合．' },
  'ab-xz': { t: '角平分线上的点到角两边的距离相等', kind: '定理', src: '八上 2.4（课本 p54）', body: '点 $P$ 在 $\\angle AOB$ 的平分线上，$PC\\perp OA$，$PD\\perp OB$ ⇒ $PC=PD$．' },
  'ab-pd': { t: '角的内部到角两边距离相等的点在角的平分线上', kind: '定理', src: '八上 2.4（课本 p55）', body: '点 $Q$ 在 $\\angle AOB$ 内部，$QC\\perp OA$，$QD\\perp OB$，$QC=QD$ ⇒ 点 $Q$ 在 $\\angle AOB$ 的平分线上．' },
});

window.LESSON = {
  init() {
    MProof.init();
    initFold1();
    initOutside();
    initHunt1();
    initCons();
    initEx1();
    initBus();
    initFold2();
    initHunt2();
    initEx2();
    initSketches();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
