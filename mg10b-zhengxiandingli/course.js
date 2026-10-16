'use strict';
/* 高一下 11.2 正弦定理 · 本课互动：垂直向量推导图、外接圆 2R 探究、SSA 圆弧定解个数、例 1 / 例 3 等比例图。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const D2R = Math.PI / 180;
const val = (v) => (typeof v === 'function' ? v() : v);
const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const ang = (p, q) => Math.atan2(q[1] - p[1], q[0] - p[0]);
const add = (p, q, k = 1) => [p[0] + k * q[0], p[1] + k * q[1]];
/* 顶点 V 的内角（由三边算，0～π） */
const angleAt = (V, P, Q) => {
  const [a, b] = [[P[0] - V[0], P[1] - V[1]], [Q[0] - V[0], Q[1] - V[1]]];
  return Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b)))));
};

function angleArc(b, V, P, Q, r, o) {
  const span = () => {
    const s = ang(val(V), val(P));
    let d = ang(val(V), val(Q)) - s;
    while (d <= -Math.PI) d += 2 * Math.PI;
    while (d > Math.PI) d -= 2 * Math.PI;
    return [s, d];
  };
  return b.curve((t) => { const [s, d] = span(); const v = val(V); return [v[0] + r * Math.cos(s + d * t), v[1] + r * Math.sin(s + d * t)]; }, 0, 1, o);
}
function bisect(V, P, Q, r) {
  const v = val(V);
  const u1 = ang(v, val(P));
  const u2 = ang(v, val(Q));
  const x = Math.cos(u1) + Math.cos(u2);
  const y = Math.sin(u1) + Math.sin(u2);
  const n = Math.hypot(x, y) || 1;
  return [v[0] + (r * x) / n, v[1] + (r * y) / n];
}
function addMarker(b, id, color) {
  b.svg.querySelector('defs').insertAdjacentHTML('beforeend',
    `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker>`);
}
const arrow = (b, s, id, cls = 'c1') => b.seg(s, { cls }).setAttribute('marker-end', `url(#${id})`);
const label = (b, list) => list.forEach(([p, n, dx, dy]) => { b.pt(p); b.text(p, n, { dx, dy }); });

/* 第 3 页：图 11-2-1，AD ⊥ BC，拖动 A */
function initAD() {
  const P = { B: [0, 0], C: [6, 0] };
  const s = { A: [5.6, 2.8] };
  const D = () => [s.A[0], 0];
  const b = board($('ad'), { x: [-0.8, 9.6], y: [-0.9, 4.8], axes: false, grid: false, w: 560 });
  addMarker(b, 'adAr', '#1d6fa5');
  addMarker(b, 'adAr2', '#d9711c');
  b.seg(() => [P.C, [Math.max(P.C[0], s.A[0]) + 0.4, 0]], { cls: 'dash' });
  arrow(b, () => [P.B, s.A], 'adAr');
  arrow(b, () => [s.A, P.C], 'adAr');
  arrow(b, [P.B, P.C], 'adAr');
  arrow(b, () => [s.A, D()], 'adAr2', 'c2');
  b.poly(() => { const [x] = s.A; const h = 0.25; return [[x, 0], [x - h, 0], [x - h, h], [x, h]]; }, { cls: 'rt' });
  angleArc(b, () => s.A, D, P.C, 0.9, { cls: 'c3' });
  b.text(() => bisect(() => s.A, D, P.C, 1.25), 'α', { dx: -4, dy: 6 });
  label(b, [[P.B, 'B', -24, 10], [P.C, 'C', -6, 28]]);
  b.text(() => s.A, 'A', { dx: 10, dy: -12 });
  b.text(D, 'D', { dx: 6, dy: 28 });
  b.drag(() => s.A, (x, y) => { s.A = [Math.min(9.2, Math.max(3.4, x)), Math.min(4.5, Math.max(1, y))]; });
  b.onUpdate = () => {
    const B = angleAt(P.B, P.C, s.A);
    const C = angleAt(P.C, P.B, s.A);
    const A = Math.PI - B - C;
    const alpha = angleAt(s.A, D(), P.C);
    const big = C >= A - 1e-9 && C >= B - 1e-9;
    $('adInfo').innerHTML = `<br>C ≈ ${fmt(C / D2R, 1)}°，α ≈ ${fmt(alpha / D2R, 1)}°，cos α ≈ ${fmt(Math.cos(alpha), 3)}，sin C ≈ ${fmt(Math.sin(C), 3)}${big ? '' : '（此时 C 不是最大角）'}`;
  };
  b.update();
}

/* 第 4 页：外接圆，拖动三点，看 a/sinA = b/sinB = c/sinC = 2R */
function initCirc() {
  const R = 3;
  const s = { t: { A: 1.95, B: 3.75, C: 5.65 } }; // 三点在圆上的极角
  const pt = (k) => () => [R * Math.cos(s.t[k]), R * Math.sin(s.t[k])];
  const P = { A: pt('A'), B: pt('B'), C: pt('C') };
  const b = board($('circ'), { x: [-4.1, 4.1], y: [-3.7, 3.9], axes: false, grid: false, w: 460 });
  b.curve((t) => [R * Math.cos(t), R * Math.sin(t)], 0, 2 * Math.PI, { cls: 'thin' });
  b.poly(() => [P.A(), P.B(), P.C()], { cls: 'fill1' });
  b.pt([0, 0], { r: 3.5 });
  b.text([0, 0], 'O', { dx: 6, dy: 20 });
  ['A', 'B', 'C'].forEach((k) => {
    const [o1, o2] = ['A', 'B', 'C'].filter((x) => x !== k);
    angleArc(b, P[k], P[o1], P[o2], 0.55, { cls: 'c2' });
    b.text(() => { const p = P[k](); return [p[0] * 1.14, p[1] * 1.14]; }, k, { dx: -7, dy: 8 });
    b.drag(P[k], (x, y) => {
      const t = Math.atan2(y, x);
      const near = ['A', 'B', 'C'].some((o) => o !== k && Math.abs(Math.atan2(Math.sin(t - s.t[o]), Math.cos(t - s.t[o]))) < 0.2);
      if (!near) s.t[k] = t;
    }, { hit: 18, r: 8 });
  });
  b.onUpdate = () => {
    const [A, B, C] = [P.A(), P.B(), P.C()];
    const rows = [['a', dist(B, C), angleAt(A, B, C), 'A'], ['b', dist(A, C), angleAt(B, A, C), 'B'], ['c', dist(A, B), angleAt(C, A, B), 'C']];
    $('circTab').innerHTML = `<tr><th>边</th><th>对角</th><th>边 ÷ 对角正弦</th></tr>`
      + rows.map(([n, len, an, k]) => `<tr><td>${n} ≈ ${fmt(len)}</td><td>${k} ≈ ${fmt(an / D2R, 1)}°</td><td><b>${fmt(len / Math.sin(an))}</b></td></tr>`).join('')
      + `<tr><td colspan="2">外接圆直径 2R</td><td><b>${fmt(2 * R)}</b></td></tr>`;
  };
  b.update();
}

/* 第 5 页：例 1 等比例图，B = 50°，C = 100°，a = BC = 10 */
function initEx1() {
  const a = 10;
  const c = (a * Math.sin(100 * D2R)) / Math.sin(30 * D2R);
  const P = { B: [0, 0], C: [a, 0], A: [c * Math.cos(50 * D2R), c * Math.sin(50 * D2R)] };
  const b = board($('ex1'), { x: [-1.6, 15.2], y: [-1.8, 16.4], axes: false, grid: false, w: 420 });
  b.poly([P.A, P.B, P.C], { cls: 'fill1' });
  angleArc(b, P.A, P.B, P.C, 2.2, { cls: 'c2' });
  angleArc(b, P.C, P.A, P.B, 1.3, { cls: 'c2' });
  b.text(bisect(P.A, P.B, P.C, 3.3), '30°', { cls: 'lb up', dx: -14, dy: 6 });
  b.text(bisect(P.C, P.A, P.B, 2.4), '100°', { cls: 'lb up', dx: -18, dy: 6 });
  b.text([a / 2, 0], '10', { cls: 'lb up', dx: -8, dy: 26 });
  b.text([P.A[0] / 2, P.A[1] / 2], 'c', { dx: -22 });
  b.text([(P.A[0] + a) / 2, P.A[1] / 2], 'b', { dx: 10 });
  label(b, [[P.A, 'A', -6, -12], [P.B, 'B', -24, 10], [P.C, 'C', 4, 28]]);
  b.update();
}

/* 第 6 页：固定 A = 30°、b = 26，以 C 为圆心 a 为半径画弧，交射线 AB 的点就是 B */
function initSSA() {
  const A = 30 * D2R;
  const B26 = 26;
  const C = [B26 * Math.cos(A), B26 * Math.sin(A)];
  const H = C[1]; // C 到射线 AB 的距离 b sin A = 13
  const s = { a: 16 };
  // 圆与直线 y = 0 的交点：x = Cx ± √(a² − H²)
  const hits = () => {
    const d = s.a * s.a - H * H;
    if (d < -1e-9) return [];
    const r = Math.sqrt(Math.max(0, d));
    return (r < 1e-6 ? [C[0]] : [C[0] + r, C[0] - r]).map((x) => ({ x, ok: x > 1e-9 }));
  };
  const b = board($('ssa'), { x: [-10, 52], y: [-5, 21], axes: false, grid: false, w: 640 });
  b.seg([[-10, 0], [0, 0]], { cls: 'dash' });
  b.seg([[0, 0], [52, 0]], { cls: 'thin' });
  b.seg([[0, 0], C], { cls: 'c1' });
  angleArc(b, [0, 0], [10, 0], C, 4.5, { cls: 'c2' });
  b.text([5.4, 1.4], '30°', { cls: 'lb up' });
  b.text([C[0] / 2, C[1] / 2], 'b = 26', { cls: 'lb up', dx: -70, dy: -6 });
  b.curve((t) => [C[0] + s.a * Math.cos(t), C[1] + s.a * Math.sin(t)], 0, 2 * Math.PI, { cls: 'dash' });
  b.seg([C, [C[0], 0]], { cls: 'dash' });
  const get = (k) => () => hits()[k];
  [0, 1].forEach((k) => {
    b.poly(() => { const h = get(k)(); return h && h.ok ? [[0, 0], C, [h.x, 0]] : [[0, 0], [0, 0], [0, 0]]; }, { cls: k ? 'fill2' : 'fill3' });
    b.seg(() => { const h = get(k)(); return h ? [C, [h.x, 0]] : [C, C]; }, { cls: 'c2' });
    b.pt(() => { const h = get(k)(); return h ? [h.x, 0] : null; }, { r: 6, hollow: true, show: () => { const h = get(k)(); return h && !h.ok; } });
    b.pt(() => { const h = get(k)(); return h ? [h.x, 0] : null; }, { r: 6, show: () => { const h = get(k)(); return h && h.ok; } });
    b.text(() => { const h = get(k)(); return h ? [h.x, 0] : null; }, () => {
      const hs = hits();
      const h = hs[k];
      if (!h) return '';
      if (!h.ok) return '舍去';
      return hs.filter((x) => x.ok).length === 2 ? k ? "B₂" : "B₁" : 'B';
    }, { cls: 'lb up', dx: -10, dy: 26 });
  });
  label(b, [[[0, 0], 'A', -8, 28]]);
  b.pt(C);
  b.text(C, 'C', { dx: -6, dy: -14 });
  const show = () => {
    const ok = hits().filter((h) => h.ok);
    const n = ok.length;
    const msg = $('ssaMsg');
    const head = `$a=${fmt(s.a, 1)}$，$b\\sin A=13$，$b=26$：`;
    const body = n === 0 ? '弧够不着射线——<b>无解</b>。'
      : n === 2 ? `弧与射线交于两点——<b>两解</b>：$B_1\\approx${fmt(angleAt([ok[0].x, 0], [0, 0], C) / D2R, 1)}^\\circ$，$B_2\\approx${fmt(angleAt([ok[1].x, 0], [0, 0], C) / D2R, 1)}^\\circ$。`
        : hits().length === 1 ? '弧与射线相切——<b>一解</b>（$B=90^\\circ$）。'
          : `另一个交点不在射线 $AB$ 上——<b>一解</b>：$B\\approx${fmt(angleAt([ok[0].x, 0], [0, 0], C) / D2R, 1)}^\\circ$。`;
    msg.className = `tip feedback ${n === 2 ? 'fb-ok' : n === 0 ? 'fb-warn' : ''}`;
    msg.innerHTML = head + body;
    tex(msg);
  };
  slider($('sa'), (v) => { s.a = v; $('saV').textContent = fmt(v, 1); b.update(); show(); });
  document.querySelectorAll('[data-a]').forEach((btn) => btn.addEventListener('click', () => {
    $('sa').value = btn.dataset.a;
    $('sa').dispatchEvent(new Event('input'));
  }));
}

/* 第 9 页：例 3 测山高，按 35°、20°、AD = 1000、65° 等比例绘制 */
function initMountain() {
  const AD = 1000;
  const AB = (AD * Math.sin(135 * D2R)) / Math.sin(30 * D2R);
  const P = { A: [0, 0] };
  P.D = [AD * Math.cos(20 * D2R), AD * Math.sin(20 * D2R)];
  P.B = [AB * Math.cos(35 * D2R), AB * Math.sin(35 * D2R)];
  P.C = [P.B[0], 0];
  P.E = [P.B[0], P.D[1]];
  const b = board($('mt'), { x: [-90, 1480], y: [-110, 900], axes: false, grid: false, w: 560 });
  b.poly([P.A, P.D, [P.B[0] - 60, P.B[1] - 200], P.B, [P.B[0] + 110, P.B[1] - 330], [P.B[0] + 270, 0]], { cls: 'hill' });
  b.seg([P.A, [P.B[0] + 300, 0]], { cls: 'thin' });
  b.seg([P.A, P.B], { cls: 'c1' });
  b.seg([P.A, P.D], { cls: 'c2' });
  b.seg([P.D, P.B], { cls: 'c1' });
  b.seg([P.B, P.C], { cls: 'c3' });
  b.seg([P.D, P.E], { cls: 'dash' });
  b.poly([[P.C[0], 0], [P.C[0] - 30, 0], [P.C[0] - 30, 30], [P.C[0], 30]], { cls: 'rt' });
  angleArc(b, P.A, P.C, P.D, 240, { cls: 'c2' });
  angleArc(b, P.A, P.D, P.B, 330, { cls: 'c1' });
  angleArc(b, P.D, P.E, P.B, 90, { cls: 'c1' });
  b.text([250, 20], '20°', { cls: 'lb up', dy: 2 });
  b.text(bisect(P.A, P.D, P.B, 370), '15°', { cls: 'lb up', dx: 2, dy: 6 });
  b.text(bisect(P.D, P.E, P.B, 140), '65°', { cls: 'lb up', dx: -2, dy: 6 });
  b.text([P.D[0] / 2, P.D[1] / 2], '1 000', { cls: 'lb up', dx: -10, dy: 28 });
  label(b, [[P.A, 'A', -24, 10], [P.D, 'D', -10, 28], [P.B, 'B', 10, -4], [P.C, 'C', 8, 26], [P.E, 'E', 8, 8]]);
  b.update();
  $('mtBC').textContent = fmt(P.B[1], 1);
}

window.LESSON = {
  init() {
    initAD();
    initCirc();
    initEx1();
    initSSA();
    initMountain();
  },
};
