'use strict';
/* 高一下 11.1 余弦定理 · 本课互动：拖角看“勾股缺口”、向量图、作高证明、水塘与渡船等比例图、锐钝判定。通用部分见 ../shared/math.js */
const { board, slider, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const D2R = Math.PI / 180;
const val = (v) => (typeof v === 'function' ? v() : v);
const setBar = (id, v, max) => { $(id).style.width = `${Math.max(0, Math.min(100, (v / max) * 100))}%`; };
const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const ang = (p, q) => Math.atan2(q[1] - p[1], q[0] - p[0]);

/* 顶点 V 处、夹在射线 VP 与 VQ 之间的角弧（取小于 π 的那一侧） */
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
/* 角平分方向上距顶点 r 处的点，用来放角的标注 */
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

/* 第 3 页：固定 b = 4、c = 5，拖动角 A，比较 a² 与 b² + c² */
function initGap() {
  const B4 = 4;
  const C5 = 5;
  const s = { A: 60 };
  const P = { A: [0, 0], B: [C5, 0] };
  const C = () => [B4 * Math.cos(s.A * D2R), B4 * Math.sin(s.A * D2R)];
  const b = board($('gap'), { x: [-4.8, 6.2], y: [-0.9, 4.6], axes: false, grid: false, w: 620 });
  b.poly(() => [P.A, P.B, C()], { cls: 'fill1' });
  b.seg(() => [P.B, C()], { cls: 'c2' });
  angleArc(b, P.A, P.B, C, 0.7, { cls: 'c2' });
  b.text(() => bisect(P.A, P.B, C, 1.15), 'A', { cls: 'lb up', dx: -8, dy: 8 });
  [[P.A, 'A', -24, 10], [P.B, 'B', 10, 10]].forEach(([p, n, dx, dy]) => { b.pt(p); b.text(p, n, { dx, dy }); });
  b.pt(C);
  b.text(C, 'C', { dx: 6, dy: -12 });
  b.text([C5 / 2, 0], 'c = 5', { cls: 'lb up', dx: -24, dy: 28 });
  b.text(() => [C()[0] / 2, C()[1] / 2], 'b = 4', { cls: 'lb up', dx: -66, dy: -4 });
  b.text(() => [(C()[0] + C5) / 2, C()[1] / 2], 'a', { dx: 10, dy: -6 });
  const A2_MAX = (B4 + C5) ** 2;
  slider($('gA'), (v) => {
    s.A = v;
    b.update();
    const cosA = Math.cos(v * D2R);
    const a2 = B4 * B4 + C5 * C5 - 2 * B4 * C5 * cosA;
    const gap = a2 - (B4 * B4 + C5 * C5);
    $('gAV').textContent = `${v}°`;
    $('vA2').textContent = fmt(a2); $('vBC').textContent = '41';
    $('vGap').textContent = fmt(gap);
    setBar('barA2', a2, A2_MAX); setBar('barBC', 41, A2_MAX);
    $('gRatio').textContent = v === 90 ? '（A = 90° 时 cos A = 0，差也是 0）' : `（当前 cos A ≈ ${fmt(cosA, 3)}，差 ÷ cos A = ${fmt(gap / cosA, 2)}）`;
  });
}

/* 第 4 页：图 11-1-1 的向量 BA、AC、BC 与夹角 180° − A */
function initVec() {
  const P = { B: [0, 0], C: [7, 0], A: [4.6, 3.6] };
  const b = board($('vecfig'), { x: [-0.8, 8.4], y: [-0.9, 5.6], axes: false, grid: false, w: 560 });
  addMarker(b, 'vArrow', '#1d6fa5');
  arrow(b, [P.B, P.A], 'vArrow');
  arrow(b, [P.A, P.C], 'vArrow');
  arrow(b, [P.B, P.C], 'vArrow');
  const u = 1.7 / dist(P.B, P.A);
  const E = [P.A[0] + (P.A[0] - P.B[0]) * u, P.A[1] + (P.A[1] - P.B[1]) * u];
  b.seg([P.A, E], { cls: 'dash' });
  angleArc(b, P.A, P.B, P.C, 0.55, { cls: 'c2' });
  angleArc(b, P.A, E, P.C, 0.85, { cls: 'c3' });
  b.text(bisect(P.A, P.B, P.C, 0.95), 'A', { cls: 'lb up c2t', dx: -6, dy: 10 });
  b.text(bisect(P.A, E, P.C, 1.1), '180°−A', { cls: 'lb up c3t', dx: 2, dy: 6 });
  [[P.B, 'B', -24, 10], [P.C, 'C', 8, 10], [P.A, 'A', -10, -14]].forEach(([p, n, dx, dy]) => { b.pt(p); b.text(p, n, { dx, dy }); });
  b.update();
}

/* 第 6 页：作高 CD，用勾股定理证明；拖动 C 可让 A 变钝角 */
function initAlt() {
  const C6 = 6;
  const s = { c: [2, 3] };
  const P = { A: [0, 0], B: [C6, 0] };
  const D = () => [s.c[0], 0];
  const b = board($('alt'), { x: [-3.6, 8.4], y: [-1, 4.8], axes: false, grid: false, w: 620 });
  b.seg([[-3.6, 0], [8.4, 0]], { cls: 'dash' });
  b.poly(() => [P.A, P.B, s.c], { cls: 'fill1' });
  b.seg(() => [s.c, D()], { cls: 'c2' });
  b.poly(() => {
    const [x] = s.c;
    const h = 0.28;
    const sx = x < C6 / 2 ? 1 : -1;
    return [[x, 0], [x + sx * h, 0], [x + sx * h, h], [x, h]];
  }, { cls: 'rt' });
  [[P.A, 'A', -10, 28], [P.B, 'B', 4, 28]].forEach(([p, n, dx, dy]) => { b.pt(p); b.text(p, n, { dx, dy }); });
  b.pt(D, { cls: 'c2' });
  b.text(D, 'D', { dx: 6, dy: 28 });
  b.text(() => s.c, 'C', { dx: 12, dy: -10 });
  b.text(() => [s.c[0] / 2, s.c[1] / 2], 'b', { dx: -18, dy: -4 });
  b.text(() => [(s.c[0] + C6) / 2, s.c[1] / 2], 'a', { dx: 10, dy: -4 });
  b.drag(() => s.c, (x, y) => { s.c = [Math.min(8, Math.max(-3.2, x)), Math.min(4.5, Math.max(0.6, y))]; });
  b.onUpdate = () => {
    const bb = dist(P.A, s.c);
    const A = ang(P.A, s.c);
    const a2 = dist(P.B, s.c) ** 2;
    const law = bb * bb + C6 * C6 - 2 * bb * C6 * Math.cos(A);
    $('altInfo').innerHTML = `A ≈ ${fmt(A / D2R, 1)}°，AD = b cos A ≈ ${fmt(bb * Math.cos(A))}，BD = c − b cos A ≈ ${fmt(C6 - bb * Math.cos(A))}<br>a² ≈ ${fmt(a2)}，b² + c² − 2bc cos A ≈ ${fmt(law)}`;
  };
  b.update();
}

/* 第 8 页：水塘图按 CA = 182、CB = 126、∠C = 63° 等比例绘制，AB 水平 */
function drawPond() {
  const CA = 182;
  const CB = 126;
  const C = 63 * D2R;
  const AB = Math.sqrt(CA * CA + CB * CB - 2 * CA * CB * Math.cos(C));
  const A = Math.asin((CB * Math.sin(C)) / AB); // 角 A 对边 CB，必为锐角（CB < CA）
  const S = 1.55;
  const O = [40, 76];
  const pA = O;
  const pB = [O[0] + AB * S, O[1]];
  const pC = [O[0] + CA * Math.cos(A) * S, O[1] + CA * Math.sin(A) * S];
  const mid = (pA[0] + pB[0]) / 2;
  const t = (p, n, dx, dy) => `<text x="${p[0] + dx}" y="${p[1] + dy}" class="fl">${n}</text>`;
  // C 处角弧：从 CA 方向转到 CB 方向
  const a1 = Math.atan2(pA[1] - pC[1], pA[0] - pC[0]);
  const a2 = Math.atan2(pB[1] - pC[1], pB[0] - pC[0]);
  const R = 26;
  const arc = `M${pC[0] + R * Math.cos(a1)} ${pC[1] + R * Math.sin(a1)} A${R} ${R} 0 0 1 ${pC[0] + R * Math.cos(a2)} ${pC[1] + R * Math.sin(a2)}`;
  $('pondTri').innerHTML = `<ellipse cx="${mid}" cy="${O[1] - 8}" rx="${(pB[0] - pA[0]) / 2 + 2}" ry="46" fill="#d6ecf8" stroke="#4f9bd0" stroke-width="2"/>`
    + `<ellipse cx="${mid}" cy="${O[1] - 12}" rx="${(pB[0] - pA[0]) / 3.2}" ry="22" fill="none" stroke="#9cc9ea" stroke-width="1.5"/>`
    + `<path d="M${pA} L${pC} L${pB}" fill="none" stroke="#1d6fa5" stroke-width="3"/>`
    + `<line x1="${pA[0]}" y1="${pA[1]}" x2="${pB[0]}" y2="${pB[1]}" stroke="#d9711c" stroke-width="3" stroke-dasharray="8 6"/>`
    + `<path d="${arc}" fill="none" stroke="#d9711c" stroke-width="2.5"/>`
    + `<text x="${pC[0] - 6}" y="${pC[1] - 40}" class="fl s" text-anchor="middle">63°</text>`
    + `<text x="${(pA[0] + pC[0]) / 2 - 46}" y="${(pA[1] + pC[1]) / 2 + 10}" class="fl s">182</text>`
    + `<text x="${(pB[0] + pC[0]) / 2 + 8}" y="${(pB[1] + pC[1]) / 2 + 6}" class="fl s">126</text>`
    + t(pA, 'A', -26, 8) + t(pB, 'B', 8, 8) + t(pC, 'C', -6, 24);
  $('pondAB').textContent = fmt((pB[0] - pA[0]) / S, 1);
}

/* 第 10 页：图 11-1-3 渡船，AB = 1.2、AC = 0.5、∠NAB = 15°，按比例绘制 */
function drawFerry() {
  const S = 200;
  const A = [110, 285];
  const B = [A[0] + 1.2 * S * Math.sin(15 * D2R), A[1] - 1.2 * S * Math.cos(15 * D2R)];
  const C = [A[0] + 0.5 * S, A[1]];
  const D = [A[0] + B[0] - C[0], A[1] + B[1] - C[1]];
  const ln = (p, q, extra) => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" ${extra}/>`;
  const wave = (y) => `<path d="M10 ${y} ${Array.from({ length: 8 }, (_, i) => `q ${20} ${i % 2 ? 6 : -6} 40 0`).join(' ')}" fill="none" stroke="#9cc9ea" stroke-width="2"/>`;
  const t = (p, n, dx, dy, c = 'fl') => `<text x="${p[0] + dx}" y="${p[1] + dy}" class="${c}">${n}</text>`;
  const r = 40;
  const a0 = -Math.PI / 2;
  const a1 = Math.atan2(B[1] - A[1], B[0] - A[0]);
  $('ferry').innerHTML = wave(B[1]) + wave(A[1])
    + ln(A, [A[0], 20], 'stroke="#556575" stroke-width="2" marker-end="url(#ar4)"')
    + ln(A, B, 'stroke="#1d6fa5" stroke-width="3" marker-end="url(#ar4)"')
    + ln(A, C, 'stroke="#1d6fa5" stroke-width="3" marker-end="url(#ar4)"')
    + ln(A, D, 'stroke="#d9711c" stroke-width="3" marker-end="url(#ar4)"')
    + ln(D, B, 'stroke="#9fb0bf" stroke-width="2" stroke-dasharray="6 5"')
    + ln(C, B, 'stroke="#9fb0bf" stroke-width="2" stroke-dasharray="6 5"')
    + `<path d="M${A[0] + r * Math.cos(a0)} ${A[1] + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${A[0] + r * Math.cos(a1)} ${A[1] + r * Math.sin(a1)}" fill="none" stroke="#d9711c" stroke-width="2"/>`
    + t(A, '15°', 6, -48, 'fl s') + t([A[0], 20], 'N', -22, 10) + t(A, 'A', -8, 24) + t(B, 'B', 6, -6) + t(C, 'C', 0, 24) + t(D, 'D', -24, -6);
}

/* 第 9 页：拖动 C，看 a² + b² − c² 的符号与角 C 的类型；以 AB 为直径的圆上 C 为直角 */
function initClassify() {
  const AB = 6;
  const R = AB / 2;
  const s = { c: [2, 3.6] };
  const P = { A: [0, 0], B: [AB, 0] };
  const O = [R, 0];
  const b = board($('cls'), { x: [-1.2, 7.2], y: [-0.9, 5.2], axes: false, grid: false, w: 560 });
  b.curve((t) => [R + R * Math.cos(t), R * Math.sin(t)], 0, Math.PI, { cls: 'dash' });
  b.poly(() => [P.A, P.B, s.c], { cls: 'fill1' });
  angleArc(b, () => s.c, P.A, P.B, 0.5, { cls: 'c2' });
  [[P.A, 'A', -22, 10], [P.B, 'B', 8, 10]].forEach(([p, n, dx, dy]) => { b.pt(p); b.text(p, n, { dx, dy }); });
  b.text(() => s.c, 'C', { dx: 12, dy: -12 });
  b.text([R, 0], 'c', { dy: 26 });
  b.drag(() => s.c, (x, y) => {
    let p = [Math.min(7, Math.max(-1, x)), Math.min(5, Math.max(0.5, y))];
    const d = dist(O, p);
    if (Math.abs(d - R) < 0.12) p = [O[0] + ((p[0] - O[0]) * R) / d, (p[1] * R) / d]; // 靠近圆时吸附到圆上
    s.c = p;
  });
  b.onUpdate = () => {
    const a = dist(P.B, s.c);
    const bb = dist(P.A, s.c);
    const g = a * a + bb * bb - AB * AB;
    const C = Math.acos(Math.max(-1, Math.min(1, g / (2 * a * bb)))) / D2R;
    const kind = Math.abs(g) < 1e-6 ? ['直角', '='] : g > 0 ? ['锐角', '>'] : ['钝角', '<'];
    const msg = $('clsMsg');
    msg.className = `tip feedback ${g > 1e-6 ? 'fb-ok' : g < -1e-6 ? 'fb-warn' : ''}`;
    msg.innerHTML = `$a^2+b^2-c^2\\approx${fmt(g)}$，$a^2+b^2${kind[1]}c^2$，$C\\approx${fmt(C, 1)}^\\circ$：<b>${kind[0]}</b><br><span class="muted">虚线是以 $AB$ 为直径的半圆：$C$ 在圆上为直角，圆内为钝角，圆外为锐角。</span>`;
    MathKit.tex(msg);
  };
  b.update();
}

window.LESSON = {
  init() {
    initGap();
    initVec();
    initAlt();
    drawPond();
    drawFerry();
    initClassify();
  },
};
