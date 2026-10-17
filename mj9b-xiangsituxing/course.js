'use strict';
/* 九下 6.3 相似图形 · 本课互动：相似形图组、度量图 6-5/6-6、相似检测器（拖顶点 + 相似比滑块）、图 6-7/6-8、中点三角形。
 * 所有角度、边长比都由坐标实时计算；“相似”的图形都是用同一个比例缩放坐标得到的。 */
const { slider, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const { add, sub, mul, dist, dir, angle, lerp } = Geo;
const SVGNS = 'http://www.w3.org/2000/svg';
const deg = (v) => `${Math.round(v)}°`;

/* 多边形第 i 个内角（凸多边形） */
const innerAngle = (pts, i) => angle(pts[i], pts[(i + pts.length - 1) % pts.length], pts[(i + 1) % pts.length]);
const scaleAbout = (pts, c, k) => pts.map((p) => add(c, mul(sub(p, c), k)));
const isConvex = (pts) => {
  const cr = pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length];
    const r = pts[(i + 2) % pts.length];
    return (q[0] - p[0]) * (r[1] - q[1]) - (q[1] - p[1]) * (r[0] - q[0]);
  });
  return cr.every((c) => c > 0) || cr.every((c) => c < 0);
};

/* 第 3 页：五组相似形（每组按一个固定比例缩放） */
function initShapes() {
  const svg = $('shapesSvg');
  const el = (tag, attrs) => { const e = document.createElementNS(SVGNS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); svg.appendChild(e); return e; };
  const poly = (pts, fill, stroke) => el('polygon', { points: pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '), fill, stroke, 'stroke-width': 1.5 });
  const regular = (cx, by, n, R, rot, inner) => {
    // 底边对齐 by：先按中心 (0,0) 生成，再平移使最低点落在 by
    const pts = [];
    for (let i = 0; i < n * (inner ? 2 : 1); i++) {
      const a = ((rot + (i * 360) / (n * (inner ? 2 : 1))) * Math.PI) / 180;
      const r = inner && i % 2 ? R * inner : R;
      pts.push([r * Math.cos(a), -r * Math.sin(a)]);
    }
    const low = Math.max(...pts.map((p) => p[1]));
    return pts.map(([x, y]) => [cx + x, by + y - low]);
  };
  const STAR_IN = Math.sin((18 * Math.PI) / 180) / Math.sin((54 * Math.PI) / 180);
  const BY = 112;
  [[60, 1], [160, 0.6]].forEach(([cx, k]) => poly(regular(cx, BY, 5, 52 * k, 90, STAR_IN), '#e53935', '#b71c1c'));
  [[285, 1], [372, 0.65]].forEach(([cx, k]) => poly(regular(cx, BY, 6, 48 * k, 90), '#1d6fa5', '#163a5a'));
  [[500, 1], [592, 0.5]].forEach(([cx, k]) => poly(regular(cx, BY, 3, 60 * k, 90), '#8fa8dc', '#4a64a8'));
  const cuboid = (x, by, k) => {
    const [w, h, d] = [50 * k, 70 * k, 30 * k];
    const [dx, dy] = [d * 0.6, -d * 0.5];
    poly([[x, by], [x + w, by], [x + w, by - h], [x, by - h]], '#d7f0dc', '#2f7d6b');
    poly([[x, by - h], [x + w, by - h], [x + w + dx, by - h + dy], [x + dx, by - h + dy]], '#e9f7ec', '#2f7d6b');
    poly([[x + w, by], [x + w + dx, by + dy], [x + w + dx, by - h + dy], [x + w, by - h]], '#bfe5c8', '#2f7d6b');
  };
  const cylinder = (cx, by, k) => {
    const [rx, ry, h] = [34 * k, 10 * k, 70 * k];
    el('path', { d: `M${cx - rx} ${by - h} L${cx - rx} ${by} A${rx} ${ry} 0 0 0 ${cx + rx} ${by} L${cx + rx} ${by - h}`, fill: '#d7f0dc', stroke: '#2f7d6b', 'stroke-width': 1.5 });
    el('ellipse', { cx, cy: by - h, rx, ry, fill: '#e9f7ec', stroke: '#2f7d6b', 'stroke-width': 1.5 });
  };
  cuboid(660, BY, 1); cuboid(755, BY, 0.75);
  cylinder(890, BY - 10, 1); cylinder(985, BY - 10, 0.75);
  [[110, '五角星 · 0.6'], [328, '正六边形 · 0.65'], [546, '正三角形 · 0.5'], [720, '长方体 · 0.75'], [938, '圆柱 · 0.75']].forEach(([x, t]) => { const e = el('text', { x, y: 142, 'text-anchor': 'middle', 'font-size': 15, fill: '#556575' }); e.textContent = t; });
}

/* 静态图：多边形 + 角弧 + 度数（度数按坐标算） */
function polyFig(el, pts, names, o = {}) {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const pad = o.pad ?? 0.7;
  const b = Geo.board(el, { x: [Math.min(...xs) - pad, Math.max(...xs) + pad], y: [Math.min(...ys) - pad, Math.max(...ys) + pad], w: o.w || 320 });
  b.poly(pts, { cls: o.cls || 'pa' });
  const c = Geo.centroid(pts);
  pts.forEach((p, i) => {
    const d = sub(p, c);
    const u = mul(d, 1 / (Math.hypot(...d) || 1));
    b.text(p, names[i], { dx: u[0] * 16 - 6, dy: -u[1] * 16 + 8 });
    const lab = o.labels ? o.labels[i] : deg(innerAngle(pts, i));
    if (lab) Geo.arc(b, p, pts[(i + pts.length - 1) % pts.length], pts[(i + 1) % pts.length], { r: o.r || 0.35, label: lab, lr: o.lr || 2.1, lcls: 'lb up gnum' });
  });
  (o.text || []).forEach(([p, t, dx, dy]) => b.text(p, t, { cls: 'lb up gnum', dx, dy }));
  b.update();
  return b;
}

/* 第 4 页：图 6-5、6-6 */
function initMeasure() {
  const eq = (s, x0) => [[x0 + s / 2, (s * Math.sqrt(3)) / 2], [x0, 0], [x0 + s, 0]];
  const T = [[1.6, 2.1], [0, 0], [2.4, 0]];
  const K = 1.4;
  const T2 = T.map((p) => add(mul(p, K), [3.2, 0]));
  // 两个正三角形画在同一块板上
  const b1 = $('f65a');
  const ptsA = eq(2.2, 0);
  const ptsB = eq(3.1, 3.0);
  const both = Geo.board(b1, { x: [-0.5, 6.6], y: [-0.6, 3.2], w: 320 });
  [[ptsA, ['A', 'B', 'C'], 'pa'], [ptsB, ['A′', 'B′', 'C′'], 'pb']].forEach(([pts, nm, cls]) => {
    both.poly(pts, { cls });
    pts.forEach((p, i) => {
      both.text(p, nm[i], { dx: i === 0 ? -6 : i === 1 ? -18 : 6, dy: i === 0 ? -8 : 20 });
      Geo.arc(both, p, pts[(i + 2) % 3], pts[(i + 1) % 3], { r: 0.3, label: deg(innerAngle(pts, i)), lr: 2.3, lcls: 'lb up gnum' });
    });
  });
  both.update();

  const pair = (el, P, Q, nm, w = 320) => {
    const all = [...P, ...Q];
    const xs = all.map((p) => p[0]);
    const ys = all.map((p) => p[1]);
    const b = Geo.board(el, { x: [Math.min(...xs) - 0.6, Math.max(...xs) + 0.6], y: [Math.min(...ys) - 0.6, Math.max(...ys) + 0.7], w });
    [[P, nm, 'pa'], [Q, nm.map((n) => `${n}′`), 'pb']].forEach(([pts, names, cls]) => {
      b.poly(pts, { cls });
      const c = Geo.centroid(pts);
      pts.forEach((p, i) => {
        const d = sub(p, c);
        const u = mul(d, 1 / Math.hypot(...d));
        b.text(p, names[i], { dx: u[0] * 16 - 6, dy: -u[1] * 16 + 8 });
        Geo.arc(b, p, pts[(i + pts.length - 1) % pts.length], pts[(i + 1) % pts.length], { r: 0.25, label: deg(innerAngle(pts, i)), lr: 2.6, lcls: 'lb up gnum' });
      });
    });
    b.update();
  };
  pair($('f65b'), T, T2, ['A', 'B', 'C']);
  pair($('f66a'), [[0, 1.6], [0, 0], [1.6, 0], [1.6, 1.6]], [[2.4, 2.3], [2.4, 0], [4.7, 0], [4.7, 2.3]], ['A', 'B', 'C', 'D']);
  const Qd = [[0.35, 1.25], [0, 0], [1.9, 0], [1.6, 1.55]];
  pair($('f66b'), Qd, Qd.map((p) => add(mul(p, 1.35), [2.5, 0])), ['A', 'B', 'C', 'D']);

  // 图 6-5(2) 的读数表
  ['A', 'B', 'C'].forEach((n, i) => { $(`t65${n}`).textContent = `${fmt(innerAngle(T, i), 1)}° / ${fmt(innerAngle(T2, i), 1)}°`; });
  const r = (i, j) => fmt(dist(T[i], T[j]) / dist(T2[i], T2[j]), 3);
  $('r65a').textContent = r(0, 1); $('r65b').textContent = r(1, 2); $('r65c').textContent = r(2, 0);
}

/* 第 6 页：相似检测器 */
const NAMES = ['A', 'B', 'C', 'D'];
const BASE_P = [[1.2, 3.6], [0.3, 0.8], [4.3, 0.5], [4.9, 3.0]];
const Q_ORIGIN = [9.6, 0.8];
function presetOf(kind) {
  if (kind === 'rect') {
    return { P: [[0.5, 3.5], [0.5, 0.5], [5.3, 0.5], [5.3, 3.5]], Q: [[9.6, 1.9], [9.6, 0.5], [17, 0.5], [17, 1.9]] };
  }
  if (kind === 'rhomb') {
    const rh = (A, s, a) => [A, add(A, mul(dir(-a / 2), s)), add(A, [2 * s * Math.cos((a / 2) * Math.PI / 180), 0]), add(A, mul(dir(a / 2), s))];
    return { P: rh([0.4, 2.4], 3, 60), Q: rh([9.4, 2.4], 3.9, 30) };
  }
  return { P: BASE_P.map((p) => [...p]), Q: BASE_P.map((p) => add(Q_ORIGIN, mul(sub(p, BASE_P[1]), 1.3))) };
}

function initChecker() {
  let s = presetOf('sim');
  const b = Geo.board($('chkBd'), { x: [-0.4, 17.6], y: [-0.6, 6.6], w: 700 });
  b.seg([[8.2, -0.6], [8.2, 6.6]], { cls: 'thin' });
  b.poly(() => s.P, { cls: 'pa' });
  b.poly(() => s.Q, { cls: 'pb' });
  [0, 1, 2, 3].forEach((i) => {
    const prev = (i + 3) % 4;
    const next = (i + 1) % 4;
    Geo.arc(b, () => s.P[i], () => s.P[prev], () => s.P[next], { r: 0.4, label: () => deg(innerAngle(s.P, i)), lr: 2.3 });
    Geo.arc(b, () => s.Q[i], () => s.Q[prev], () => s.Q[next], { r: 0.4, label: () => deg(innerAngle(s.Q, i)), lr: 2.3, cls: 'garc a2' });
    b.text(() => s.P[i], NAMES[i], { dx: 0, dy: 0 }).classList.add('vn');
    b.text(() => s.Q[i], `${NAMES[i]}′`, { dx: 0, dy: 0 }).classList.add('vn');
    b.drag(() => s.P[i], (x, y) => { s = { ...s, P: s.P.map((p, k) => (k === i ? [Math.min(7.8, Math.max(0, x)), Math.min(6.3, Math.max(0, y))] : p)) }; }, { r: 7, hit: 16 });
    b.drag(() => s.Q[i], (x, y) => { s = { ...s, Q: s.Q.map((p, k) => (k === i ? [Math.min(17.4, Math.max(8.5, x)), Math.min(6.3, Math.max(0, y))] : p)) }; }, { r: 7, hit: 16 });
  });
  // 顶点字母放在多边形外侧：每次更新时按重心方向重设偏移
  const labels = [...b.svg.querySelectorAll('text.vn')];
  const placeLabels = () => {
    const w = b.svg.getBoundingClientRect().width;
    const k = w ? b.W / w : 1;
    [0, 1, 2, 3].forEach((i) => {
      [[s.P, labels[2 * i]], [s.Q, labels[2 * i + 1]]].forEach(([pts, t]) => {
        const c = Geo.centroid(pts);
        const d = sub(pts[i], c);
        const u = mul(d, 1 / (Math.hypot(...d) || 1));
        t.setAttribute('x', b.X(pts[i][0]) + (u[0] * 18 - 6) * k);
        t.setAttribute('y', b.Y(pts[i][1]) + (-u[1] * 18 + 8) * k);
      });
    });
  };
  const ratioK = () => dist(s.Q[0], s.Q[1]) / dist(s.P[0], s.P[1]);
  b.onUpdate = () => {
    placeLabels();
    const angP = [0, 1, 2, 3].map((i) => innerAngle(s.P, i));
    const angQ = [0, 1, 2, 3].map((i) => innerAngle(s.Q, i));
    const rat = [0, 1, 2, 3].map((i) => dist(s.Q[i], s.Q[(i + 1) % 4]) / dist(s.P[i], s.P[(i + 1) % 4]));
    const angOk = angP.map((a, i) => Math.abs(a - angQ[i]) < 0.6);
    const r0 = rat[0];
    const ratOk = rat.map((r) => Math.abs(r - r0) / r0 < 0.01);
    const cell = (ok, t) => `<td class="${ok ? 'ok' : 'no'}">${t} ${ok ? '✓' : '✗'}</td>`;
    $('chkTab').innerHTML = `<tr><th>对应角</th>${NAMES.map((n) => `<th>∠${n} / ∠${n}′</th>`).join('')}</tr>
      <tr><td>度数</td>${angP.map((a, i) => cell(angOk[i], `${fmt(a, 1)}° / ${fmt(angQ[i], 1)}°`)).join('')}</tr>
      <tr><th>对应边</th>${NAMES.map((n, i) => `<th>${NAMES[(i + 1) % 4] === 'A' ? `${n}′A′ : ${n}A` : `${n}′${NAMES[i + 1]}′ : ${n}${NAMES[i + 1]}`}</th>`).join('')}</tr>
      <tr><td>比</td>${rat.map((r, i) => cell(ratOk[i], fmt(r, 3))).join('')}</tr>`;
    const A = angOk.every(Boolean);
    const R = ratOk.every(Boolean);
    const msg = $('chkMsg');
    const convex = isConvex(s.P) && isConvex(s.Q);
    msg.className = `tip feedback ${A && R && convex ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = !convex ? '请保持两个四边形都是凸四边形（没有凹进去的角）。'
      : A && R ? `各角分别相等，各边成比例：四边形 ABCD ∽ 四边形 A′B′C′D′，相似比 A′B′ : AB = ${fmt(r0, 2)}。`
        : A ? '各角分别相等，但各边不成比例——不相似。'
          : R ? '各边成比例，但各角不分别相等——不相似。'
            : '角不分别相等，边也不成比例——不相似。';
    $('chkKV').textContent = fmt(ratioK(), 2);
  };
  const kIn = $('chkK');
  kIn.addEventListener('input', () => {
    const f = +kIn.value / ratioK();
    s = { ...s, Q: scaleAbout(s.Q, s.Q[1], f) };
    b.update();
  });
  kIn.setAttribute('data-noswipe', '');
  document.querySelectorAll('[data-pre]').forEach((btn) => btn.addEventListener('click', () => {
    s = presetOf(btn.dataset.pre);
    kIn.value = String(Math.round(ratioK() * 20) / 20);
    b.update();
  }));
  b.update();
}

/* 第 7 页图 6-7，第 8 页图 6-8，练习 2 */
function initFigs() {
  const rect = (x, y, w, h) => [[x, y + h], [x, y], [x + w, y], [x + w, y + h]];
  const both = (el, P, Q, nm, labsP, labsQ) => {
    const all = [...P, ...Q];
    const xs = all.map((p) => p[0]);
    const ys = all.map((p) => p[1]);
    const b = Geo.board(el, { x: [Math.min(...xs) - 0.7, Math.max(...xs) + 0.7], y: [Math.min(...ys) - 0.7, Math.max(...ys) + 0.7], w: 340 });
    [[P, nm, 'pa', labsP], [Q, nm.map((n) => `${n}′`), 'pb', labsQ]].forEach(([pts, names, cls, labs]) => {
      b.poly(pts, { cls });
      const c = Geo.centroid(pts);
      pts.forEach((p, i) => {
        const d = sub(p, c);
        const u = mul(d, 1 / Math.hypot(...d));
        b.text(p, names[i], { dx: u[0] * 16 - 6, dy: -u[1] * 16 + 8 });
        if (labs && labs[i]) Geo.arc(b, p, pts[(i + pts.length - 1) % pts.length], pts[(i + 1) % pts.length], { r: 0.3, label: labs[i], lr: 2.6, lcls: 'lb up gnum' });
      });
    });
    b.update();
  };
  both($('f67a'), rect(0, 0, 4, 2.5), rect(5.4, 0, 4, 1), ['A', 'B', 'C', 'D']);
  const rh = (A, s, a) => [A, add(A, mul(dir(-a / 2), s)), add(A, [2 * s * Math.cos((a / 2) * Math.PI / 180), 0]), add(A, mul(dir(a / 2), s))];
  both($('f67b'), rh([0, 0], 2.2, 60), rh([5.0, 0], 1.8, 30), ['A', 'B', 'C', 'D'], ['60°'], ['30°']);

  // 图 6-8：A 为原点，AB 方向 255°、AC 方向 315°（∠A = 60°），AB = 8、AC = 10；A′B′C′ 是 3/4
  const tri = (k, o) => [o, add(o, mul(dir(255), 8 * k)), add(o, mul(dir(315), 10 * k))];
  const T1 = tri(0.25, [0, 0]);
  const T2 = tri(0.25 * 0.75, [0, 0]);
  polyFig($('f68a'), T1, ['A', 'B', 'C'], { labels: ['60°'], text: [[lerp(T1[0], T1[1], 0.5), '8', -18, 4], [lerp(T1[0], T1[2], 0.5), '10', 8, -2]], w: 260 });
  polyFig($('f68b'), T2, ['A′', 'B′', 'C′'], { labels: ['α'], cls: 'pb', text: [[lerp(T2[0], T2[1], 0.5), '6', -18, 4]], w: 260, pad: 0.7 + (T1[2][0] - T2[2][0]) / 2 });

  // 练习 2：B 原点，∠B = 75°，AB = 6，∠A = 120°，AD = 8，∠D = 85°，∠C = 80°
  const B = [0, 0];
  const A = mul(dir(75), 6);
  const D = add(A, mul(dir(15), 8));
  const t = D[1] / Math.sin((80 * Math.PI) / 180);
  const C = add(D, mul(dir(280), t));
  const Q1 = [A, B, C, D].map((p) => mul(p, 0.32));
  const Q2 = [A, B, C, D].map((p) => mul(p, 0.48));
  polyFig($('p2a'), Q1, ['A', 'B', 'C', 'D'], { labels: [null, '75°', '80°', 'β'], text: [[lerp(Q1[0], Q1[1], 0.5), '6', -16, 4], [lerp(Q1[0], Q1[3], 0.5), '8', -4, -8]], w: 220, r: 0.3 });
  polyFig($('p2b'), Q2, ['A′', 'B′', 'C′', 'D′'], { labels: ['120°', null, 'α', null], cls: 'pb', text: [[lerp(Q2[0], Q2[1], 0.5), '9', -16, 4]], w: 220, r: 0.3 });
}

/* 第 9 页：中点三角形 */
function initMid() {
  let s = { A: [2.4, 4.2], B: [0, 0], C: [5.6, 0] };
  const b = Geo.board($('midBd'), { x: [-0.6, 6.6], y: [-0.7, 5], w: 460 });
  const M = () => ({ D: lerp(s.B, s.C, 0.5), E: lerp(s.C, s.A, 0.5), F: lerp(s.A, s.B, 0.5) });
  b.poly(() => [s.A, s.B, s.C], { cls: 'pa' });
  b.poly(() => { const m = M(); return [m.D, m.E, m.F]; }, { cls: 'pc' });
  const lab = (get, n, dx, dy) => b.text(get, n, { dx, dy });
  lab(() => s.A, 'A', -6, -12); lab(() => s.B, 'B', -20, 18); lab(() => s.C, 'C', 6, 18);
  lab(() => M().D, 'D', -6, 24); lab(() => M().E, 'E', 8, 0); lab(() => M().F, 'F', -22, 0);
  ['A', 'B', 'C'].forEach((k) => b.drag(() => s[k], (x, y) => { s = { ...s, [k]: [Math.min(6.4, Math.max(-0.4, x)), Math.min(4.8, Math.max(-0.4, y))] }; }, { r: 7, hit: 16 }));
  b.onUpdate = () => {
    const { D, E, F } = M();
    const angA = angle(s.A, s.B, s.C);
    const angD = angle(D, E, F);
    const angB = angle(s.B, s.A, s.C);
    const angE = angle(E, D, F);
    const r = dist(E, F) / dist(s.B, s.C);
    $('midMsg').className = 'tip feedback fb-ok';
    $('midMsg').innerHTML = `∠EDF = ${fmt(angD, 1)}°，∠A = ${fmt(angA, 1)}°；∠DEF = ${fmt(angE, 1)}°，∠B = ${fmt(angB, 1)}°<br>EF : BC = ${fmt(r, 3)}，DE : AB = ${fmt(dist(D, E) / dist(s.A, s.B), 3)}，DF : AC = ${fmt(dist(D, F) / dist(s.A, s.C), 3)}`;
  };
  b.update();
}

window.LESSON = {
  init() {
    initShapes();
    initMeasure();
    initChecker();
    initFigs();
    initMid();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
