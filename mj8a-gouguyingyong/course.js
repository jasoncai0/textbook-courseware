'use strict';
/* 八上 3.3 勾股定理的简单应用 · 本课互动：斜拉桥拉索（点拉索看直角三角形与计算）、“折竹”模拟（拖折断高度看落点）、
 * 育苗棚横截面、三个半圆面积。通用部分见 ../shared/math.js、mgeo.js。
 * 所有长度都按勾股定理由坐标精确算出；作图板横纵同比例。 */
const { fmt, slider, tex } = MathKit;
const { add, sub, mul, dist, lerp, right, sketch } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const HIDE = [99, 99];
const unit = (v) => mul(v, 1 / (Math.hypot(...v) || 1));

/* ---------- 第 3 页：斜拉桥（示意数据：AB = 24，锚点距 B 7、10、18、32、45，拉索长都是整数） ---------- */
const TOWER = 24;
const ANCHORS = [['G', -7], ['C', 10], ['D', 18], ['E', 32], ['F', 45]];
function initBridge() {
  const s = { k: -1, done: [] };
  const A = [0, TOWER];
  const B = [0, 0];
  const X = (i) => [ANCHORS[i][1], 0];
  const b = Geo.board($('bridge'), { x: [-13, 49], y: [-5, 28], w: 620 });
  b.poly(() => (s.k < 0 ? [HIDE, HIDE, HIDE] : [A, B, X(s.k)]), { cls: 'tri-hl' });
  b.seg([[-13, 0], [49, 0]], { cls: 'deck' });
  b.seg([[0, -5], A], { cls: 'tower' });
  const lines = ANCHORS.map((_, i) => b.seg([A, X(i)], { cls: 'cable' }));
  const hits = ANCHORS.map((_, i) => b.seg([A, X(i)], { cls: 'cable-hit' }));
  right(b, () => (s.k < 0 ? HIDE : B), () => (s.k < 0 ? HIDE : X(s.k)), A, { s: 1.4 });
  b.text(A, 'A', { dx: -22, dy: 0 });
  b.text(B, 'B', { dx: 6, dy: 22 });
  ANCHORS.forEach(([n], i) => b.text(X(i), n, { dx: -6, dy: 22 }));
  b.text(() => (s.k < 0 ? null : lerp(B, X(s.k), 0.5)), () => (s.k < 0 ? '' : `${Math.abs(ANCHORS[s.k][1])}`), { cls: 'lb up side-l', dx: -8, dy: -8 });
  b.text([0, TOWER / 2], '24', { cls: 'lb up side-l', dx: -30, dy: 6 });
  const pick = (i) => {
    s.k = i;
    s.done = s.done.includes(i) ? s.done : [...s.done, i];
    lines.forEach((l, j) => l.classList.toggle('on', j === i));
    [...$('cableBtns').children].forEach((x, j) => x.classList.toggle('solid', j === i));
    const [n, x] = ANCHORS[i];
    const d = Math.abs(x);
    const c2 = TOWER * TOWER + d * d;
    const c = Math.round(Math.sqrt(c2));
    const msg = $('cableMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$A${n}^2=AB^2+B${n}^2=24^2+${d}^2=${TOWER * TOWER}+${d * d}=${c2}$，$${c}^2=${c * c}$，∴ $A${n}=${c}$ m．`;
    tex(msg);
    const head = $('cableTab').rows[0].outerHTML;
    $('cableTab').innerHTML = head + s.done.map((j) => {
      const [m, xx] = ANCHORS[j];
      const dd = Math.abs(xx);
      return `<tr><td>$A${m}$</td><td>24</td><td>${dd}</td><td>${Math.round(Math.hypot(TOWER, dd))}</td></tr>`;
    }).join('');
    tex($('cableTab'));
    b.update();
  };
  hits.forEach((h, i) => h.addEventListener('click', () => pick(i)));
  $('cableBtns').innerHTML = ANCHORS.map(([n]) => `<button class="btn" type="button">$A${n}$</button>`).join('');
  tex($('cableBtns'));
  [...$('cableBtns').children].forEach((x, i) => x.addEventListener('click', () => pick(i)));
  b.update();
}

/* ---------- 第 4 页：折竹（竹高 10 尺，折断处高 x，竹梢落点 BC = √((10 − x)² − x²)） ---------- */
const BAMBOO = 10;
function initBamboo() {
  const s = { x: 3 };
  const d = () => Math.sqrt((BAMBOO - s.x) ** 2 - s.x ** 2);
  const C = [0, 0];
  const A = () => [0, s.x];
  const B = () => [d(), 0];
  const b = Geo.board($('bamboo'), { x: [-1.6, 9], y: [-0.9, 10.7], w: 520 });
  b.seg([[-1.6, 0], [9, 0]], { cls: 'ground' });
  b.seg([C, [0, BAMBOO]], { cls: 'gdash' });
  b.seg(() => [C, A()], { cls: 'bamboo' });
  b.seg(() => [A(), B()], { cls: 'bamboo top' });
  b.seg(() => [C, B()], { cls: 'gl c-a' });
  right(b, C, B, A, { s: 0.35 });
  b.pt(A, { cls: 'c2' });
  b.text(C, 'C', { dx: -20, dy: 20 });
  b.text(A, 'A', { dx: -22, dy: 0 });
  b.text(B, 'B', { dx: 2, dy: 22 });
  b.text([0, BAMBOO], '原竹梢', { cls: 'lb up note-l', dx: 8, dy: 6 });
  b.text(() => lerp(C, A(), 0.5), () => `x`, { cls: 'lb', dx: 8, dy: 6 });
  b.text(() => lerp(A(), B(), 0.5), () => '10 − x', { cls: 'lb up side-l', dx: 8, dy: -6 });
  b.onUpdate = () => {
    $('bxV').textContent = fmt(s.x);
    $('bAC').textContent = fmt(s.x);
    $('bAB').textContent = fmt(BAMBOO - s.x);
    $('bBC').textContent = fmt(d());
    const msg = $('bMsg');
    const hit = Math.abs(d() - 3) < 1e-6;
    msg.className = `tip feedback ${hit ? 'fb-ok' : ''}`;
    msg.textContent = hit ? 'x = 4.55 时 BC 正好等于 3！' : `竹梢离竹根 ${fmt(d())} 尺，${d() > 3 ? '比 3 尺远：把 x 调大' : '比 3 尺近：把 x 调小'}。`;
  };
  slider($('bx'), (v) => { s.x = v; b.update(); });
}

/* ---------- 第 8 页：育苗棚（斜二测示意：横截面在正面，长度方向斜画） ---------- */
function initShed() {
  const s = { cut: false };
  const P0 = [0, 0];
  const P1 = [2, 0];
  const P2 = [0, 1.5];
  const dv = mul([Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)], 9); // 20 m 的长度方向按比例缩画
  const b = Geo.board($('shed'), { x: [-0.9, 10.4], y: [-0.9, 6.6], w: 560 });
  b.poly([P1, P2, add(P2, dv), add(P1, dv)], { cls: 'roof' });
  [0.25, 0.5, 0.75].forEach((t) => b.seg([add(P1, mul(dv, t)), add(P2, mul(dv, t))], { cls: 'rib' }));
  b.seg([P0, add(P0, dv)], { cls: 'gdash' });
  b.seg([add(P0, dv), add(P2, dv)], { cls: 'gdash' });
  b.seg([add(P0, dv), add(P1, dv)], { cls: 'gdash' });
  b.poly(() => [P0, P1, P2], { cls: 'cut' });
  b.poly(() => (s.cut ? [P0, P1, P2] : [HIDE, HIDE, HIDE]), { cls: 'cut-on' });
  right(b, P0, P1, P2, { s: 0.22 });
  b.text(lerp(P0, P1, 0.5), '2 m', { cls: 'lb up side-l', dx: -14, dy: 22 });
  b.text(lerp(P0, P2, 0.5), '1.5 m', { cls: 'lb up side-l', dx: -58, dy: 6 });
  b.text(lerp(P2, add(P2, dv), 0.5), '20 m', { cls: 'lb up side-l', dx: -20, dy: -10 });
  b.text(() => (s.cut ? lerp(P1, P2, 0.5) : null), '?', { cls: 'lb up gnum', dx: 6, dy: 4 });
  $('shedCut').addEventListener('click', () => { s.cut = !s.cut; b.update(); });
  b.update();
}

/* ---------- 第 10 页：三个半圆（C 在以 AB 为直径的半圆上，∠ACB = 90°） ---------- */
function initSemi() {
  const A = [-3, 0];
  const B = [3, 0];
  const s = { t: 60 };
  const C = () => [3 * Math.cos(s.t * Math.PI / 180), 3 * Math.sin(s.t * Math.PI / 180)];
  const b = Geo.board($('semi'), { x: [-5.4, 5.4], y: [-3.4, 6.2], w: 560 });
  /** 以 PQ 为直径、在远离 R 的一侧的半圆 */
  const half = (P, Q, R) => (t) => {
    const p = P();
    const q = Q();
    const m = lerp(p, q, 0.5);
    const r = dist(p, q) / 2;
    const u = unit(sub(q, p));
    let n = [-u[1], u[0]];
    if ((R()[0] - m[0]) * n[0] + (R()[1] - m[1]) * n[1] > 0) n = mul(n, -1);
    const a = Math.PI * t;
    return add(m, add(mul(u, r * Math.cos(a)), mul(n, r * Math.sin(a))));
  };
  const fA = () => A;
  const fB = () => B;
  [['s1c', fB, C, fA], ['s2c', fA, C, fB], ['s3c', fA, fB, C]].forEach(([cls, P, Q, R]) => {
    b.curve(half(P, Q, R), 0, 1, { cls, n: 120 });
  });
  b.poly(() => [A, B, C()], { cls: 'tri-f' });
  right(b, C, A, B, { s: 0.3 });
  b.text(A, 'A', { dx: -20, dy: 6 });
  b.text(B, 'B', { dx: 8, dy: 6 });
  b.text(C, 'C', { dx: -4, dy: -12 });
  b.drag(C, (x, y) => { s.t = clamp(Math.atan2(Math.max(y, 0.01), x) * 180 / Math.PI, 20, 160); });
  b.onUpdate = () => {
    const k = Math.PI / 8;
    const s1 = k * dist(B, C()) ** 2;
    const s2 = k * dist(A, C()) ** 2;
    const s3 = k * dist(A, B) ** 2;
    $('s1').textContent = fmt(s1);
    $('s2').textContent = fmt(s2);
    $('s12').textContent = fmt(s1 + s2);
    $('s3').textContent = fmt(s3);
  };
  b.update();
}

/* ---------- 静态图（按题中数据精确作出） ---------- */
function initSketches() {
  sketch($('sk310'), {
    P: { A: [0, 4.55], B: [3, 0], C: [0, 0] }, seg: 'AB BC CA', right: [['C', 'B', 'A']], w: 300, pad: 0.9,
    text: [[[0, 2.27], 'x', -22, 6, 'lb'], [[1.5, 2.27], '10 − x', 6, -2, 'lb up side-l'], [[1.5, 0], '3', -4, 22, 'lb up side-l']],
  });
  sketch($('sk311'), {
    P: { A: [0, 24], B: [-10, 0], C: [10, 0], D: [0, 0] }, seg: 'AB AC BC AD', right: [['D', 'C', 'A']], w: 300, pad: 2.5,
    text: [[[0, 12], '24', 4, 6, 'lb up side-l'], [[-5, 12], '26', -30, 6, 'lb up side-l'], [[-5, 0], '10', -10, 22, 'lb up side-l'], [[5, 0], '10', -10, 22, 'lb up side-l']],
  });
  // 练习 1：∠A = 90°，AD = 12，AB = 16 ⇒ BD = 20；CD = 15，BC = 25 ⇒ ∠BDC = 90°
  const A = [(144 - 256 + 400) / 40, Math.sqrt(144 - ((144 - 256 + 400) / 40) ** 2)];
  sketch($('q1'), {
    P: { A, B: [20, 0], C: [0, -15], D: [0, 0] }, seg: 'AB AD DC CB', dash: 'BD', right: [['A', 'B', 'D']], w: 320, pad: 2.5,
    text: [[lerp(A, [0, 0], 0.5), '12', -26, 0, 'lb up side-l'], [lerp(A, [20, 0], 0.5), '16', 4, -6, 'lb up side-l'], [[0, -7.5], '15', -26, 6, 'lb up side-l'], [[10, -7.5], '25', 6, 6, 'lb up side-l']],
  });
  sketch($('q3'), {
    P: { A: [0, 18], B: [0, 0], C: [7.5, 0] }, seg: 'AB BC CA', right: [['B', 'C', 'A']], w: 200, pad: 1.5,
    text: [[[3.75, 0], '7.5', -10, 22, 'lb up side-l'], [[3.75, 9], '19.5', 6, 0, 'lb up side-l']],
  });
  // 习题 3：AC = 12，BC = 9，AE = BE = 9.375
  sketch($('q5'), {
    P: { A: [0, 12], B: [9, 0], C: [0, 0], D: [4.5, 6], E: [0, 12 - 9.375] },
    seg: 'AC CB BA', line: 'DE', dash: 'BE', right: [['C', 'B', 'A'], ['D', 'A', 'E']], w: 300, pad: 1.4,
  });
}

window.LESSON = {
  init() {
    initBridge();
    initBamboo();
    initShed();
    initSemi();
    initSketches();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
