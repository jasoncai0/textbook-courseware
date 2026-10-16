'use strict';
/* 八上 3.2 勾股定理的逆定理 · 本课互动：三边搭三角形（SSS 精确作图，看 a²+b² 与 c² 和 ∠C）、
 * Rt△A′B′C′ 平移叠合到 △ABC、普林顿 322 泥板验算、勾股数生成器。通用部分见 ../shared/math.js、mgeo.js、mcheck.js。
 * 三角形都由三边长算出顶点坐标，作图板横纵同比例，角度读数由坐标实时计算。 */
const { fmt, slider, tex } = MathKit;
const { add, sub, mul, dist, lerp, angle, centroid, right, arc, sketch } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const HIDE = [99, 99];

/** 由三边作三角形：C 在原点，CB 在 x 轴正方向（CB = a，CA = b，AB = c）；搭不成返回 null */
function triFromSides(a, b, c) {
  if (a + b <= c || a + c <= b || b + c <= a) return null;
  const x = (a * a + b * b - c * c) / (2 * a);
  return { C: [0, 0], B: [a, 0], A: [x, Math.sqrt(b * b - x * x)] };
}
/** 把三角形缩放、平移进 box（保持形状） */
function fitTri(T, box) {
  const pts = [T.A, T.B, T.C];
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const w = Math.max(...xs) - Math.min(...xs);
  const h = Math.max(...ys) - Math.min(...ys);
  const k = Math.min((box.x[1] - box.x[0]) / w, (box.y[1] - box.y[0]) / h);
  const o = [(box.x[0] + box.x[1]) / 2 - k * (Math.min(...xs) + w / 2), box.y[0] - k * Math.min(...ys)];
  const f = (p) => add(o, mul(p, k));
  return { A: f(T.A), B: f(T.B), C: f(T.C), k };
}
/** 边 PQ 的标注位置：中点沿远离重心方向外移 */
const outside = (P, Q, G, d) => { const m = lerp(P, Q, 0.5); const v = sub(m, G); return add(m, mul(v, d / (Math.hypot(...v) || 1))); };

/* ---------- 第 3 页：三边搭三角形 ---------- */
function initSSS() {
  const s = { a: 3, b: 4, c: 5, rows: [] };
  const MAXV = 30;
  const b = Geo.board($('sss'), { x: [-0.6, 10.2], y: [-1.2, 7.6], w: 560 });
  const T = () => { const t = triFromSides(s.a, s.b, s.c); return t ? fitTri(t, { x: [0.6, 9], y: [0, 6.6] }) : null; };
  const P = (k) => () => { const t = T(); return t ? t[k] : HIDE; };
  const G = () => centroid([P('A')(), P('B')(), P('C')()]);
  const isRight = () => s.a * s.a + s.b * s.b === s.c * s.c;
  b.poly(() => (T() ? [P('A')(), P('B')(), P('C')()] : [HIDE, HIDE, HIDE]), { cls: 'tri-f' });
  arc(b, P('C'), P('B'), P('A'), { r: 0.75, show: () => !!T() && !isRight() });
  right(b, () => (T() && isRight() ? P('C')() : HIDE), P('B'), P('A'), { s: 0.4 });
  b.text(() => (T() ? P('A')() : null), 'A', { dx: 6, dy: -8 });
  b.text(() => (T() ? P('B')() : null), 'B', { dx: 8, dy: 20 });
  b.text(() => (T() ? P('C')() : null), 'C', { dx: -20, dy: 20 });
  b.text(() => (T() ? outside(P('C')(), P('B')(), G(), 0.5) : null), () => `a = ${s.a}`, { cls: 'lb up side-l', dx: -20, dy: 8 });
  b.text(() => (T() ? outside(P('C')(), P('A')(), G(), 0.6) : null), () => `b = ${s.b}`, { cls: 'lb up side-l', dx: -24, dy: 6 });
  b.text(() => (T() ? outside(P('A')(), P('B')(), G(), 0.6) : null), () => `c = ${s.c}`, { cls: 'lb up side-l', dx: -10, dy: 6 });
  b.onUpdate = () => {
    ['a', 'b', 'c'].forEach((k) => { $(`s${k}`).textContent = s[k]; });
    const ab = s.a * s.a + s.b * s.b;
    const cc = s.c * s.c;
    $('sab').textContent = ab;
    $('scc').textContent = cc;
    const t = T();
    const msg = $('sMsg');
    if (!t) {
      $('sC').textContent = '—';
      msg.className = 'tip feedback fb-warn';
      msg.textContent = '两边之和不大于第三边，搭不成三角形。';
      return;
    }
    const C = angle(t.C, t.A, t.B);
    $('sC').textContent = isRight() ? '90°' : `${fmt(C, 1)}°`;
    const cmp = ab === cc ? '=' : ab > cc ? '>' : '<';
    const kind = ab === cc ? '直角' : ab > cc ? '锐角' : '钝角';
    msg.className = `tip feedback ${ab === cc ? 'fb-ok' : ''}`;
    msg.textContent = `a² + b² ${cmp} c²：∠C 是${kind}。`;
  };
  const renderRows = () => {
    const head = $('sTab').rows[0].outerHTML;
    $('sTab').innerHTML = head + s.rows.map((r) => `<tr><td>${r.a}, ${r.b}, ${r.c}</td><td>${r.ab}</td><td>${r.cc}</td><td>${r.C}</td></tr>`).join('');
    tex($('sTab'));
  };
  const MAX_ROWS = 4;
  $('sRec').addEventListener('click', () => {
    const t = T();
    if (!t) return;
    const row = { a: s.a, b: s.b, c: s.c, ab: s.a * s.a + s.b * s.b, cc: s.c * s.c, C: isRight() ? '90°' : `${fmt(angle(t.C, t.A, t.B), 1)}°` };
    s.rows = [...s.rows, row].slice(-MAX_ROWS);
    renderRows();
  });
  $('sClr').addEventListener('click', () => { s.rows = []; renderRows(); });
  $('sss').closest('.col').querySelector('.steppers').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-s]');
    if (!btn) return;
    const k = btn.dataset.s;
    s[k] = clamp(s[k] + +btn.dataset.d, 1, MAXV);
    b.update();
  });
  $('sssPre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-p]');
    if (!btn) return;
    [s.a, s.b, s.c] = btn.dataset.p.split(',').map(Number);
    b.update();
  });
  b.update();
}

/* ---------- 第 4 页：Rt△A′B′C′ 平移叠合 ---------- */
function initProve() {
  const A0 = 3.6;
  const B0 = 2.7;
  const C0 = Math.hypot(A0, B0); // a² + b² = c²
  const T = triFromSides(A0, B0, C0);
  const OFF = 5.2;
  const s = { off: OFF };
  const b = Geo.board($('prove'), { x: [-0.9, 9.6], y: [-1.1, 3.7], w: 560 });
  const sh = (p) => () => add(p, [s.off, 0]);
  const Rt = { A: [0, B0], B: [A0, 0], C: [0, 0] }; // 先画直角，再取两直角边
  const done = () => s.off < 1e-6;
  b.poly([T.A, T.B, T.C], { cls: 'tri-f' });
  b.poly(() => [sh(Rt.A)(), sh(Rt.B)(), sh(Rt.C)()], { cls: 'tri-m' });
  right(b, sh(Rt.C), sh(Rt.B), sh(Rt.A), { s: 0.3 });
  b.text(T.A, 'A', { dx: -20, dy: 0 });
  b.text(T.B, 'B', { dx: 2, dy: 22 });
  b.text(T.C, 'C', { dx: -20, dy: 22 });
  b.text(() => (done() ? null : lerp(T.C, T.B, 0.5)), 'a', { cls: 'lb', dy: 22 });
  b.text(() => (done() ? null : lerp(T.C, T.A, 0.5)), 'b', { cls: 'lb', dx: -18 });
  b.text(lerp(T.A, T.B, 0.5), 'c', { cls: 'lb', dx: 6, dy: -6 });
  b.text(() => (done() ? null : T.C), '?', { cls: 'lb up gnum', dx: 8, dy: -8 });
  b.text(sh(Rt.A), "A'", { cls: 'lb ghost', dx: 6, dy: -4 });
  b.text(sh(Rt.B), "B'", { cls: 'lb ghost', dx: 4, dy: 22 });
  b.text(sh(Rt.C), "C'", { cls: 'lb ghost', dx: 8, dy: 22 });
  let raf = 0;
  const animate = (to) => {
    cancelAnimationFrame(raf);
    const from = s.off;
    const t0 = performance.now();
    const DUR = 900;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DUR);
      const e = 1 - (1 - p) ** 3;
      s.off = from + (to - from) * e;
      if (p === 1) s.off = to;
      b.update();
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  $('pvGo').addEventListener('click', () => animate(0));
  $('pvBack').addEventListener('click', () => animate(OFF));
  b.update();
}

/* ---------- 第 6 页：普林顿 322（图 3-8，课本抄录；15 行均已核对 a² + b² = c²） ---------- */
const PLIMPTON = [
  [120, 119, 169], [3456, 3367, 4825], [4800, 4601, 6649], [13500, 12709, 18541], [72, 65, 97],
  [360, 319, 481], [2700, 2291, 3541], [960, 799, 1249], [600, 481, 769], [6480, 4961, 8161],
  [60, 45, 75], [2400, 1679, 2929], [240, 161, 289], [2700, 1771, 3229], [90, 56, 106],
];
function initPlimpton() {
  const tab = $('plTab');
  tab.insertAdjacentHTML('beforeend', PLIMPTON.map((r, i) => `<tr data-i="${i}">${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join(''));
  tab.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-i]');
    if (!tr) return;
    const [x, y, z] = PLIMPTON[+tr.dataset.i];
    tab.querySelectorAll('tr').forEach((r) => r.classList.toggle('on', r === tr));
    const msg = $('plMsg');
    const ok = x * x + y * y === z * z;
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `$${x}^2+${y}^2=${x * x}+${y * y}=${x * x + y * y}$，$${z}^2=${z * z}$．${ok ? '相等，是勾股数！' : '不相等．'}`;
    tex(msg);
  });
}

/* ---------- 第 9 页：勾股数生成器 ---------- */
function initGen() {
  const s = { n: 2, k: 1 };
  const b = Geo.board($('gen'), { x: [-0.8, 10], y: [-1, 6.4], w: 560 });
  const sides = () => [(s.n * s.n - 1) * s.k, 2 * s.n * s.k, (s.n * s.n + 1) * s.k];
  const pts = () => {
    const [a, bb] = sides();
    const q = Math.min(8.6 / a, 5.6 / bb);
    return { C: [0, 0], B: [a * q, 0], A: [0, bb * q] };
  };
  b.poly(() => { const p = pts(); return [p.A, p.B, p.C]; }, { cls: 'tri-f' });
  right(b, [0, 0], () => pts().B, () => pts().A, { s: 0.35 });
  b.text(() => lerp(pts().C, pts().B, 0.5), () => `a = ${sides()[0]}`, { cls: 'lb up side-l', dx: -24, dy: 24 });
  b.text(() => lerp(pts().C, pts().A, 0.5), () => `b = ${sides()[1]}`, { cls: 'lb up side-l', dx: -64, dy: 6 });
  b.text(() => lerp(pts().A, pts().B, 0.5), () => `c = ${sides()[2]}`, { cls: 'lb up side-l', dx: 8, dy: -8 });
  b.onUpdate = () => {
    $('gnV').textContent = s.n;
    $('gkV').textContent = s.k;
    const [a, bb, c] = sides();
    const msg = $('gMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$${a}^2+${bb}^2=${a * a}+${bb * bb}=${a * a + bb * bb}=${c}^2$`;
    tex(msg);
  };
  slider($('gn'), (v) => { s.n = v; b.update(); });
  slider($('gk'), (v) => { s.k = v; b.update(); });
}

/* ---------- 静态图 ---------- */
function initSketches() {
  // 练习 1：绳环 12 段，BC = 5，AC = 4，AB = 3（∠BAC = 90°）
  const A = [4, 0];
  const B = [4, 3];
  const C = [0, 0];
  const b = Geo.board($('rope'), { x: [-0.9, 5], y: [-0.8, 3.7], w: 360 });
  b.poly([A, B, C], { cls: 'rope' });
  right(b, A, C, B, { s: 0.3 });
  [[C, A, 4], [A, B, 3], [B, C, 5]].forEach(([P, Q, n]) => {
    for (let i = 0; i < n; i++) b.pt(lerp(P, Q, i / n), { cls: 'knot', r: 5 });
  });
  b.text(A, 'A', { dx: 6, dy: 20 });
  b.text(B, 'B', { dx: 6, dy: -4 });
  b.text(C, 'C', { dx: -20, dy: 20 });
  b.update();
  // 习题 2：CD = 1，AD = 2，BD = 4
  sketch($('sk2'), {
    P: { A: [0, 2], B: [4, 0], C: [-1, 0], D: [0, 0] },
    seg: 'AB AC BC AD', right: [['D', 'B', 'A'], ['A', 'B', 'C']], w: 380, pad: 0.6,
    text: [[[-0.5, 0], '1', -4, 22, 'lb up gnum'], [[0, 1], '2', 6, 6, 'lb up gnum'], [[2, 0], '4', -4, 22, 'lb up gnum']],
  });
}

window.LESSON = {
  init() {
    initSSS();
    initProve();
    initPlimpton();
    initGen();
    initSketches();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
