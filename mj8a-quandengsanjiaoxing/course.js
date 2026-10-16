'use strict';
/* 八上 1.2 全等三角形 · 本课互动：图 1-3 对应元素点选高亮、拖动顶点实时量对应边角、纸片三种运动、图 1-4 演示、图形的运动 (4)～(9)。
 * 通用部分见 ../shared/math.js、mgeo.js、mfold.js；△A′B′C′ 都由 △ABC 经精确的旋转、平移、翻折算出。 */
const { fmt } = MathKit;
const { add, sub, mul, dist, rot, angle, centroid, arc, sketch } = Geo;
const { move, ticks, tween, reflect } = MFold;
const $ = (id) => document.getElementById(id);
const P3 = ['A', 'B', 'C'];
const prime = (n) => `${n}′`;
const SIDES = [[0, 1], [1, 2], [2, 0]];
const HIDE = [[-99, -99], [-99, -99]];

/** 画一个三角形：边、相等记号、角弧、字母；返回各部分节点，便于高亮 */
function drawTri(b, pts, names, o = {}) {
  const P = (i) => () => pts()[i];
  const poly = b.poly(() => pts(), { cls: o.cls || 'tri-a' });
  const marks = o.marks !== false;
  if (marks) SIDES.forEach(([i, j], k) => ticks(b, P(i), P(j), k + 1, { len: 0.16, gap: 0.12 }));
  const arcs = marks ? P3.map((_, i) => [0, 1, 2].slice(0, [2, 1, 3][i]).map((m) => arc(b, P(i), P((i + 1) % 3), P((i + 2) % 3), { r: 0.42 + m * 0.12 }))) : [];
  const labels = names.map((n, i) => b.text(() => {
    const p = pts()[i];
    const g = centroid(pts());
    const d = sub(p, g);
    return add(p, mul(d, 0.42 / (Math.hypot(...d) || 1)));
  }, n, { dx: -7, dy: 8 }));
  return { poly, arcs, labels };
}

/* ---------- 第 3 页：图 1-3 对应元素 ---------- */
const T0 = [[0.6, 2.9], [-1.6, 0.2], [2.4, 0.2]];
const POSE = [{ R: 18, c: centroid(T0) }, { T: [5.4, -0.3] }];
function initCorr() {
  const s = { hl: null };
  const b = Geo.board($('corr'), { x: [-2.4, 9.2], y: [-0.9, 4.4], w: 600 });
  const L = () => T0;
  const R = () => move(T0, POSE);
  const hlSide = (pts, k, cls) => b.seg(() => (s.hl && s.hl.side === k ? [pts()[SIDES[k][0]], pts()[SIDES[k][1]]] : HIDE), { cls: `side-hl ${cls}` });
  [0, 1, 2].forEach((k) => { hlSide(L, k, ''); hlSide(R, k, ''); });
  const dl = drawTri(b, L, P3);
  const dr = drawTri(b, R, P3.map(prime), { cls: 'tri-b' });
  const vtx = (pts, i) => b.pt(() => (s.hl && s.hl.v === i ? pts()[i] : null), { r: 9, cls: 'c2' });
  [0, 1, 2].forEach((i) => { vtx(L, i); vtx(R, i); });
  const msg = (t) => { $('corrMsg').innerHTML = t; MathKit.tex($('corrMsg')); };
  const pick = (hl) => {
    s.hl = hl;
    [dl, dr].forEach((d) => d.arcs.forEach((as, i) => as.forEach((a) => a.classList.toggle('on', hl.v === i))));
    if (hl.v !== undefined) {
      const n = P3[hl.v];
      msg(`顶点 $${n}$ 的对应顶点是 $${n}'$；$\\angle ${n}$ 的对应角是 $\\angle ${n}'$（弧的条数相同）。`);
    } else {
      const [i, j] = SIDES[hl.side];
      msg(`边 $${P3[i]}${P3[j]}$ 的对应边是 $${P3[i]}'${P3[j]}'$（记号的条数相同）。`);
    }
    b.update();
  };
  [L, R].forEach((pts) => {
    SIDES.forEach(([i, j], k) => b.seg(() => [pts()[i], pts()[j]], { cls: 'ghit2' }).addEventListener('click', () => pick({ side: k })));
    P3.forEach((_, i) => b.pt(() => pts()[i], { r: 16, cls: 'hit' }).addEventListener('click', () => pick({ v: i })));
  });
  b.update();
}

/* ---------- 第 4 页：拖动顶点量对应边角 ---------- */
function initMeas() {
  const s = { P: [[0.4, 3.2], [-1.4, 0.4], [2.6, 0.6]] };
  const b = Geo.board($('meas'), { x: [-2.6, 9.4], y: [-1.2, 5.2], w: 600 });
  const Q = () => move(s.P, [{ R: -28, c: centroid(s.P) }, { T: [5.6, 0.2] }]);
  drawTri(b, () => s.P, P3);
  drawTri(b, Q, P3.map(prime), { cls: 'tri-b' });
  s.P.forEach((_, i) => b.drag(() => s.P[i], (x, y) => {
    const p = [Math.max(-2.2, Math.min(3.4, x)), Math.max(-0.4, Math.min(4.6, y))];
    const next = s.P.map((q, k) => (k === i ? p : q));
    const area = Math.abs((next[1][0] - next[0][0]) * (next[2][1] - next[0][1]) - (next[2][0] - next[0][0]) * (next[1][1] - next[0][1]));
    if (area > 0.8 && SIDES.every(([u, v]) => dist(next[u], next[v]) > 0.9)) s.P = next;
  }));
  const tab = $('measTab');
  const head = tab.rows[0].outerHTML;
  b.onUpdate = () => {
    const q = Q();
    const rows = SIDES.map(([i, j]) => [`${P3[i]}${P3[j]}`, fmt(dist(s.P[i], s.P[j])), `${P3[i]}′${P3[j]}′`, fmt(dist(q[i], q[j]))])
      .concat(P3.map((n, i) => [`∠${n}`, `${fmt(angle(s.P[i], s.P[(i + 1) % 3], s.P[(i + 2) % 3]), 1)}°`, `∠${n}′`, `${fmt(angle(q[i], q[(i + 1) % 3], q[(i + 2) % 3]), 1)}°`]));
    tab.innerHTML = head + rows.map((r) => `<tr>${r.map((c, k) => `<td class="${k % 2 ? 'v' : ''}">${c}</td>`).join('')}</tr>`).join('');
  };
  b.update();
}

/* ---------- 第 5、6 页：一个三角形动到另一个位置 ---------- */
function motionBoard(id, btn, spec) {
  const s = { t: 0 };
  const b = Geo.board($(id), { x: spec.x, y: spec.y, w: 360 });
  if (spec.line) Geo.line(b, spec.line[0], spec.line[1], { cls: 'axis-l' });
  if (spec.target) {
    b.poly(spec.target, { cls: 'tri-b' });
    spec.tnames.forEach((n, i) => n && b.text(spec.target[i], n, { dx: spec.toff[i][0], dy: spec.toff[i][1] }));
  }
  b.poly(spec.tri, { cls: 'tri-a' });
  const cur = () => move(spec.tri, spec.m, s.t);
  b.poly(() => (s.t > 0 ? cur() : HIDE), { cls: 'tri-m' });
  spec.names.forEach((n, i) => b.text(spec.tri[i], n, { dx: spec.off[i][0], dy: spec.off[i][1] }));
  (spec.mnames || []).forEach((n, i) => n && b.text(() => (s.t > 0.98 ? cur()[i] : null), n, { dx: spec.moff[i][0], dy: spec.moff[i][1], cls: 'lb mv' }));
  let stop = () => {};
  $(btn).addEventListener('click', () => { stop(); stop = tween(1800, (t) => { s.t = t; b.update(); }); });
  b.update();
}

function initOps() {
  const tri = [[0.9, 2], [0, 0], [2.6, 0.3]]; // A B C
  const [A, B, C] = tri;
  const base = { tri, names: ['A', 'B', 'C'], off: [[-6, -8], [-18, 14], [6, 14]] };
  const ab = sub(A, B);
  motionBoard('op0', 'op0Go', { ...base, x: [-0.8, 4.4], y: [-0.7, 3.4], line: [B, A], m: { T: mul(ab, 0.8) }, mnames: ['A′', 'B′', 'C′'], moff: [[-6, -8], [-22, 12], [6, 14]] });
  motionBoard('op1', 'op1Go', { ...base, x: [-1.2, 4], y: [-0.7, 3.4], line: [A, C], m: { F: [A, C] }, mnames: ['', 'B′', ''], moff: [[0, 0], [6, -4], [0, 0]] });
  motionBoard('op2', 'op2Go', { ...base, x: [-2, 3.6], y: [-0.8, 4], m: { R: 180, c: A }, mnames: ['', 'B′', 'C′'], moff: [[0, 0], [6, -4], [-22, -4]] });
  void C;
}

function initFig14() {
  // (1) 平移：B→E
  const t1 = [[1.8, 1.2], [0, 0], [2.3, 0]];
  const v = [2.6, 0];
  motionBoard('d0', 'd0Go', { tri: t1, names: ['A', 'B', 'C'], off: [[-6, -8], [-16, 14], [-8, 16]], x: [-0.6, 5.6], y: [-0.6, 1.9], m: { T: v }, target: move(t1, { T: v }), tnames: ['D', 'E', 'F'], toff: [[-4, -8], [-2, 16], [4, 14]] });
  // (2) 翻折：沿 BC
  const t2 = [[-1.1, 2], [0, 0], [0, 2.7]];
  const B2 = t2[1];
  const C2 = t2[2];
  motionBoard('d1', 'd1Go', { tri: t2, names: ['A', 'B', 'C'], off: [[-20, 6], [-6, 22], [-6, -8]], x: [-2, 2], y: [-0.5, 3.1], line: [B2, C2], m: { F: [B2, C2] }, target: [reflect(t2[0], B2, C2), B2, C2], tnames: ['D', '', ''], toff: [[8, 6], [0, 0], [0, 0]] });
  // (3) 旋转：绕 C 转 180°
  const t3 = [[-1, 1.06], [-2, -1.06], [0, 0]];
  motionBoard('d2', 'd2Go', { tri: t3, names: ['A', 'B', 'C'], off: [[-8, -8], [-18, 12], [-4, 22]], x: [-2.6, 2.6], y: [-1.6, 1.6], m: { R: 180, c: [0, 0] }, target: move(t3, { R: 180, c: [0, 0] }), tnames: ['D', 'E', ''], toff: [[4, 16], [6, -4], [0, 0]] });
}

/* ---------- 第 7、9 页：静态图 ---------- */
function figures() {
  sketch($('pg'), { P: { A: [1.2, 2], B: [0, 0], C: [3.2, 0], D: [4.4, 2] }, seg: 'AB BC CD DA AC', w: 420 });
  const O = [2, 1.2];
  const u = Geo.dir(125);
  const vv = Geo.dir(55);
  sketch($('x1'), { P: { M: add(O, mul(u, 1.6)), N: sub(O, mul(u, 2)), P: add(O, mul(vv, 1.6)), Q: sub(O, mul(vv, 2)), O }, seg: 'MN PQ MQ PN', lab: { O: [-6, 24] }, w: 320 });
  sketch($('x2'), { P: { B: [0, 0], C: [4, 0], E: [0.6, 2.2], D: [3.4, 2.2], O: [2, 1.3] }, seg: 'BC BE CD BD CE', lab: { O: [-5, -10] }, w: 320 });
  // 第 3 题：∠A = 45°，∠ACB = 38°，∠ABC = 97°（正弦定理算出 A 的位置），D 与 A 关于 BC 对称
  const BC = 2.6;
  const BA = (BC * Math.sin((38 * Math.PI) / 180)) / Math.sin((45 * Math.PI) / 180);
  const A = mul(Geo.dir(187), BA);
  sketch($('x3'), { P: { A, B: [0, 0], C: [0, BC], D: [-A[0], A[1]] }, seg: 'AB BD AC BC CD', lab: { B: [-4, 22] }, w: 320 });
}

/* ---------- 第 8 页：图形的运动 (4)～(9)，点图演示 ---------- */
const MOVES = [
  { tri: [[0, 0], [2.6, 0], [1.5, 1.7]], m: { T: [1.5, 0] } },
  { tri: [[0, 1], [3.6, 1], [2.4, 2.3]], m: { R: 180, c: [2.6, 1] } },
  { tri: [[0, 2.6], [0.3, 0], [1.95, 1.3]], m: { F: [[1.5, 0], [1.5, 1]] } },
  { tri: [[1.5, 3], [0, 1.3], [0.8, 0]], m: { F: [[1.5, 0], [1.5, 1]] } },
  { tri: [[2.4, 2], [0, 1.4], [2.9, 0.4]], m: { R: -90, c: [2.4, 2] } },
  { tri: [[0, 0], [3.4, 0], [0.7, 1.8]], m: { F: [[2.2, 0], [2.2, 1]] } },
];
function initMoves() {
  MOVES.forEach((o, k) => {
    const s = { t: 0 };
    const tgt = move(o.tri, o.m);
    const all = [...o.tri, ...tgt];
    const xs = all.map((p) => p[0]);
    const ys = all.map((p) => p[1]);
    const b = Geo.board($(`m${k}`), { x: [Math.min(...xs) - 0.4, Math.max(...xs) + 0.4], y: [Math.min(...ys) - 0.4, Math.max(...ys) + 0.4], w: 300 });
    b.poly(o.tri, { cls: 'tri-line' });
    b.poly(tgt, { cls: 'tri-line' });
    b.poly(() => (s.t > 0 ? move(o.tri, o.m, s.t) : HIDE), { cls: 'tri-m' });
    let stop = () => {};
    b.svg.addEventListener('click', () => { stop(); stop = tween(1600, (t) => { s.t = t; b.update(); }); });
    b.update();
  });
}

window.LESSON = {
  init() {
    initCorr();
    initMeas();
    initOps();
    initFig14();
    figures();
    initMoves();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
void rot;
