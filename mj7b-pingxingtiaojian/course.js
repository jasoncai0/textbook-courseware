'use strict';
/* 七下 7.1 探索直线平行的条件 · 本课互动：推三角尺画平行线、转动直线看 ∠1 与 ∠2、点角辨“三线八角”。
 * 通用部分见 ../shared/math.js、../shared/mgeo.js；所有图形由坐标计算，角度读数就是图上真实的角。 */
const { tex } = MathKit;
const { add, sub, mul, dot, dir, ang, meet, line, arc } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const norm180 = (a) => ((a + 540) % 360) - 180; // 化到 (-180, 180]

/* ---------- 第 3 页：三角尺沿直尺平推（图 7-1） ---------- */
function initRuler() {
  const R0 = [0.4, 0];
  const U = dir(60); // 直尺边缘（截线 c）的方向
  const NL = dir(150); // 直尺在边缘左侧
  const s = { t: 0.6, marks: [] };
  const P0 = (t) => add(R0, mul(U, t));
  // 30°–60°–90° 三角尺：斜边贴直尺，60° 角在 P0，直角在 P2，P0P2 水平（沿它画线）
  const tri = (t) => { const p = P0(t); return [p, add(p, [1.5, 0]), add(p, mul(U, 3))]; };
  const b = Geo.board($('ruler'), { x: [-1.2, 9.2], y: [-0.7, 6.9], w: 560 });
  const ruler = [add(R0, mul(U, -0.6)), add(R0, mul(U, 7.9))];
  b.poly([ruler[0], ruler[1], add(ruler[1], mul(NL, 0.7)), add(ruler[0], mul(NL, 0.7))], { cls: 'ruler' });
  for (let k = 0; k <= 16; k++) {
    const p = add(R0, mul(U, k * 0.5 - 0.5));
    b.seg([p, add(p, mul(NL, k % 2 ? 0.15 : 0.28))], { cls: 'tick' });
  }
  line(b, ruler[0], ruler[1], { cls: 'gl c-c' });
  b.text(add(R0, mul(U, 7.5)), 'c', { dx: 10, dy: 4 });
  const MAX = 5;
  for (let i = 0; i < MAX; i++) {
    const on = () => i < s.marks.length;
    line(b, () => (on() ? P0(s.marks[i]) : [0, -99]), () => (on() ? add(P0(s.marks[i]), [1, 0]) : [1, -99]), { cls: 'gl c-a' });
    arc(b, () => P0(on() ? s.marks[i] : 0), () => add(P0(on() ? s.marks[i] : 0), [1, 0]), () => add(P0(on() ? s.marks[i] : 0), U), { r: 0.45, label: String(i + 1), show: on });
  }
  line(b, () => P0(s.t), () => add(P0(s.t), [1, 0]), { cls: 'gdash' });
  b.poly(() => tri(s.t), { cls: 'setsq' });
  b.text(() => add(P0(s.t), [0.62, 0.3]), '60°', { cls: 'lb up gdeg' });
  const grip = () => add(P0(s.t), [1, 0.866]);
  b.drag(grip, (x, y) => { s.t = +clamp(dot(sub([x, y], add(R0, [1, 0.866])), U), 0, 3.9).toFixed(2); });
  b.onUpdate = () => {
    const n = s.marks.length;
    const msg = $('rulerMsg');
    msg.className = `tip feedback ${n >= 2 ? 'fb-ok' : ''}`;
    if (!n) { msg.textContent = '推到一个位置，点“沿三角尺画一条线”。'; return; }
    const names = s.marks.map((_, i) => `∠${i + 1}`).join(' = ');
    msg.textContent = n === 1
      ? '画好 1 条。再推一推三角尺，多画几条。'
      : `${names} = 60°：画出的 ${n} 条线互相平行（怎么延长也不相交）。`;
  };
  $('rulerDraw').addEventListener('click', () => {
    const fresh = s.marks.every((m) => Math.abs(m - s.t) > 0.3);
    if (fresh) s.marks = [...s.marks, s.t].slice(-MAX);
    b.update();
  });
  $('rulerClr').addEventListener('click', () => { s.marks = []; b.update(); });
  b.update();
}

/* ---------- 第 4 页：转动直线 b，比较 ∠1 与 ∠2（图 7-3） ---------- */
function initTilt() {
  const s = { g: 65, be: -9 };
  const BOX = { x: [-6.5, 6.5], y: [-3.2, 3.7] };
  const Pa = [0, -1.6];
  const Pb = () => add(Pa, mul(dir(s.g), 3.2));
  const b = Geo.board($('tilt'), { ...BOX, w: 560 });
  line(b, Pa, [1, -1.6], { cls: 'gl c-a' });
  line(b, Pb, () => add(Pb(), dir(s.be)), { cls: 'gl c-b' });
  line(b, Pa, () => add(Pa, dir(s.g)), { cls: 'gl c-c' });
  b.text([6.0, -1.6], 'a', { dx: 0, dy: -10 });
  b.text(() => add(Pb(), mul(dir(s.be), 5.4)), 'b', { dx: 0, dy: -10 });
  b.text(() => add(Pa, mul(dir(s.g), 5.0)), 'c', { dx: 10, dy: 4 });
  arc(b, Pb, () => add(Pb(), dir(s.be)), () => add(Pb(), dir(s.g)), { r: 0.6, label: '1' });
  arc(b, Pa, [1, -1.6], () => add(Pa, dir(s.g)), { r: 0.6, label: '2' });
  const X = () => (s.be === 0 ? null : meet(Pa, [1, -1.6], Pb(), add(Pb(), dir(s.be))));
  const inBox = (p) => p && p[0] > BOX.x[0] && p[0] < BOX.x[1];
  b.pt(() => (inBox(X()) ? X() : null), { r: 7, cls: 'c2' });
  b.text(() => (inBox(X()) ? X() : null), '交点', { cls: 'lb up', dx: -16, dy: 30 });
  b.drag(() => add(Pa, mul(dir(s.g), 4.7)), (x, y) => { s.g = Math.round(clamp(ang(sub([x, y], Pa)), 40, 140)); });
  b.drag(() => add(Pb(), mul(dir(s.be), 3.6)), (x, y) => {
    let a = norm180(ang(sub([x, y], Pb())));
    if (Math.abs(a) > 90) a = norm180(a + 180);
    a = Math.round(clamp(a, -30, 30));
    s.be = Math.abs(a) <= 1 ? 0 : a; // 差 1° 以内吸附到平行
  });
  b.onUpdate = () => {
    const a1 = s.g - s.be;
    $('tilt1').textContent = `${a1}°`;
    $('tilt2').textContent = `${s.g}°`;
    const msg = $('tiltMsg');
    if (s.be === 0) {
      msg.className = 'tip feedback fb-ok';
      msg.textContent = `∠1 = ∠2 = ${s.g}°：a、b 怎么延长也不相交，a ∥ b。`;
      return;
    }
    const side = X()[0] > 0 ? '右' : '左';
    msg.className = 'tip feedback fb-warn';
    msg.textContent = `∠1 ${a1 > s.g ? '>' : '<'} ∠2（相差 ${Math.abs(s.be)}°）：a、b 在${side}侧相交${inBox(X()) ? '' : '（交点在画面外，向' + side + '延长就能看到）'}。`;
  };
  b.update();
}

/* ---------- 第 5、9 页：点两个角，判断关系（图 7-4、7-8） ---------- */
// 每个角：在哪个交点（T 在 b 上、U 在 a 上），在截线 c 的哪一侧（L/R），在所在直线的哪一方（U 上/D 下）
const ANGLES = [
  [1, 'T', 'R', 'U'], [3, 'T', 'L', 'U'], [7, 'T', 'L', 'D'], [5, 'T', 'R', 'D'],
  [2, 'U', 'R', 'U'], [4, 'U', 'L', 'U'], [8, 'U', 'L', 'D'], [6, 'U', 'R', 'D'],
].map(([n, at, h, v]) => ({ n, at, h, v, inner: at === 'T' ? v === 'D' : v === 'U' }));
const SIDE = { L: '左侧', R: '右侧', U: '上方', D: '下方' };

function relation(p, q) {
  if (p.at === q.at) return p.h !== q.h && p.v !== q.v ? '对顶角' : '邻补角';
  if (p.h === q.h && p.v === q.v) return '同位角';
  if (p.inner && q.inner) return p.h !== q.h ? '内错角' : '同旁内角';
  return '';
}

function explain(p, q, mode) {
  const r = relation(p, q);
  const pq = `∠${p.n} 与 ∠${q.n}`;
  if (r === '对顶角' || r === '邻补角') return [false, `${pq} 在同一个顶点处，是${r}（七上 6.3），不是“三线八角”里的一对。`];
  if (mode === 'tw') {
    if (r === '同位角') return [true, `✓ ${pq} 是同位角：都在截线 c 的${SIDE[p.h]}，都在被截直线的${SIDE[p.v]}。`];
    const why = p.h !== q.h ? `一个在 c 的${SIDE[p.h]}、一个在${SIDE[q.h]}` : `一个在被截直线的${SIDE[p.v]}、一个在${SIDE[q.v]}`;
    return [false, `✗ ${pq} 不是同位角：${why}。`];
  }
  if (r === '同位角') return [true, `${pq} 是同位角：同在 c 的${SIDE[p.h]}，同在被截直线的${SIDE[p.v]}（“F”形）。`];
  if (r === '内错角') return [true, `${pq} 是内错角：都在 a、b 之间，分别在 c 的两侧（“Z”形）。`];
  if (r === '同旁内角') return [true, `${pq} 是同旁内角：都在 a、b 之间，同在 c 的${SIDE[p.h]}（“U”形）。`];
  return [false, `${pq} 不是同位角、内错角或同旁内角（至少有一个角在 a、b 外面，又不同侧同方）。`];
}

function initPairs(id, mode) {
  const s = { sel: [] };
  const U = [0, -1.4];
  const G = 70;
  const T = add(U, mul(dir(G), 2.9));
  const BE = -13;
  const b = Geo.board($(id), { x: [-5, 5], y: [-3.2, 3.4], w: 520 });
  line(b, U, add(U, [1, 0]), { cls: 'gl c-a' });
  line(b, T, add(T, dir(BE)), { cls: 'gl c-b' });
  line(b, U, add(U, dir(G)), { cls: 'gl c-c' });
  b.text([4.6, -1.4], 'a', { dy: -10 });
  b.text(add(T, mul(dir(BE), 4.4)), 'b', { dy: -10 });
  b.text(add(U, mul(dir(G), 5.0)), 'c', { dx: 10 });
  const rays = (at) => {
    const [P, th] = at === 'T' ? [T, BE] : [U, 0];
    return { P, R: dir(th), L: dir(th + 180), Up: dir(G), Dn: dir(G + 180) };
  };
  const ends = (a) => {
    const r = rays(a.at);
    const pair = { RU: [r.R, r.Up], LU: [r.Up, r.L], LD: [r.L, r.Dn], RD: [r.Dn, r.R] }[a.h + a.v];
    return [r.P, add(r.P, pair[0]), add(r.P, pair[1])];
  };
  const arcs = ANGLES.map((a) => {
    const [P, A, B] = ends(a);
    const node = arc(b, P, A, B, { r: 0.42 });
    const mid = Geo.angle(P, A, B) / 2;
    const ab = ang(sub(A, P));
    const turn = norm180(ang(sub(B, P)) - ab) > 0 ? 1 : -1;
    const pos = add(P, mul(dir(ab + turn * mid), 0.85));
    const lab = b.text(pos, String(a.n), { cls: 'lb up gnum', dx: -5, dy: 7 });
    const hit = b.pt(pos, { cls: 'hit', r: 16 });
    hit.addEventListener('click', () => pick(a));
    return { a, node, lab };
  });
  function pick(a) {
    const has = s.sel.includes(a);
    s.sel = has ? s.sel.filter((x) => x !== a) : (s.sel.length >= 2 ? [a] : [...s.sel, a]);
    paint();
  }
  function paint() {
    arcs.forEach(({ a, node, lab }) => { const on = s.sel.includes(a); node.classList.toggle('on', on); lab.classList.toggle('on', on); });
    const msg = $(`${id}Msg`);
    if (s.sel.length < 2) {
      msg.className = 'tip feedback';
      msg.textContent = s.sel.length ? `已选 ∠${s.sel[0].n}，再点一个角。` : (mode === 'tw' ? '点图中两个角的编号：它们是同位角吗？' : '点图中两个角的编号，看它们是什么关系。');
      return;
    }
    const [ok, text] = explain(s.sel[0], s.sel[1], mode);
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = text;
  }
  b.update();
  paint();
}

/* ---------- 静态示意图（课本插图按坐标重画） ---------- */
// 两条被截直线 b（上）、a（下）与截线 c；specs: [交点 'T'|'U', 区域 'RU'|'LU'|'LD'|'RD', 标号]
function threeLines(id, specs) {
  const U = [0, 0];
  const T = [0.75, 1.7];
  const c = Geo.sub(T, U);
  const P = { U, T, c1: add(T, mul(c, 0.5)), c0: add(U, mul(c, -0.5)), a1: [2.4, 0], a0: [-2.0, 0], b1: [3.15, 1.7], b0: [-1.25, 1.7] };
  const b = Geo.board($(id), { x: [-2.2, 3.6], y: [-0.9, 2.65], w: 340 });
  line(b, P.a0, P.a1, { cls: 'gl thin-l' });
  line(b, P.b0, P.b1, { cls: 'gl thin-l' });
  line(b, U, T, { cls: 'gl thin-l c-c' });
  b.text([3.2, 0], 'a', { dy: -8 }); b.text([3.2, 1.7], 'b', { dy: -8 }); b.text(add(T, mul(c, 0.5)), 'c', { dx: 8 });
  specs.forEach(([at, reg, n]) => {
    const X = at === 'T' ? T : U;
    const up = add(X, c);
    const dn = sub(X, c);
    const r = add(X, [1, 0]);
    const l = sub(X, [1, 0]);
    const [A, B] = { RU: [r, up], LU: [up, l], LD: [l, dn], RD: [dn, r] }[reg];
    arc(b, X, A, B, { r: 0.3, label: n, lr: 1.9 });
  });
  b.update();
}

function figures() {
  const { sketch, meet: mt, lerp } = Geo;
  // p7 练一练 1：DE ∥ BC，DF ∥ AC
  sketch($('lx1'), { P: { A: [2, 4], B: [0, 0], C: [4, 0], D: [1, 2], E: [3, 2], F: [2, 0] }, seg: 'AB BC CA DE DF', ang: [['E', 'A', 'D', '1'], ['D', 'A', 'E', '2'], ['F', 'D', 'B', '3']] });
  // p8 练一练 2：DE ∥ AB
  sketch($('lx2'), { P: { A: [2.2, 3], B: [0, 0], C: [4, 0], E: [2.74, 2.1], D: [1.2, 0] }, seg: 'AB BC CA DE', ang: [['A', 'B', 'C', ''], ['E', 'D', 'C', '']] });
  // p8 练一练 3：按答案的状态作图（∠ABC = 60°，∠ABE = 30°）
  {
    const B = [0, 0];
    const A = mul(dir(60), 4.6);
    const C = [3.1, 0];
    const E = mt(B, dir(30), A, C);
    const D = mt(A, B, E, add(E, [1, 0]));
    const F = mt(D, add(D, dir(30)), A, C);
    sketch($('lx3'), { P: { A, B, C, D, E, F }, seg: 'AB BC CA DE BE DF', ang: [['D', 'A', 'E', '60°', 0.35], ['B', 'A', 'E', '30°', 0.5]] });
  }
  // 图 7-5
  sketch($('ex1'), {
    P: { A: [1.3, 2.2], B: [4.7, 2.2], C: [0, 0], D: [3.4, 0], X: [1.95, 3.3], Y: [4.4, 0], Z: [5.35, 3.3] },
    hide: 'XYZ', line: 'AB CD CA DB', ang: [['A', 'B', 'X', '1'], ['C', 'D', 'A', ''], ['D', 'Y', 'B', '2']], lab: { A: [-20, -6], B: [8, -8], C: [-18, 20], D: [-4, 22] },
  });
  threeLines('f76', [['T', 'RU', '1'], ['T', 'LD', '3'], ['U', 'RU', '2']]);
  threeLines('f77', [['T', 'RU', '1'], ['T', 'RD', '3'], ['U', 'RU', '2']]);
  // 图 7-9：DE ∥ BC，EF ∥ AB
  {
    const A = [2.6, 4];
    const B = [0, 0];
    const C = [4, 0];
    const D = lerp(A, B, 0.45);
    const E = mt(D, add(D, [1, 0]), A, C);
    const F = mt(E, add(E, sub(B, A)), B, C);
    sketch($('ex2'), { P: { A, B, C, D, E, F }, seg: 'AB BC CA DE EF', ang: [['D', 'A', 'E', '1'], ['E', 'D', 'F', '2']] });
  }
  sketch($('jd1'), { P: { A: [0.3, 2], D: [3.2, 2], B: [-0.3, 0], C: [3.8, 0] }, seg: 'AD DC CB BA AC', ang: [['A', 'C', 'D', '1', 0.55], ['C', 'A', 'B', '2', 0.55]] });
  // p10 练一练 1
  sketch($('lx4'), { P: { A: [0.6, 2.2], B: [0, 0], C: [3.3, 2.2], D: [2.9, 0], E: [0.87, 3.2] }, seg: 'BE AC AD CD BD', ang: [['A', 'E', 'C', '1', 0.32], ['A', 'C', 'D', '2', 0.5], ['A', 'B', 'D', '3', 0.38], ['D', 'A', 'B', '4', 0.45]] });
  // p10 练一练 2：AB ∥ CE，AD ∥ BE
  sketch($('lx5'), { P: { A: [1, 2], B: [3.2, 2], C: [0, 0], D: [2, 0], E: [4.2, 0], X: [1.45, 2.9] }, hide: 'X', seg: 'AB CE AD BE CX', ang: [['A', 'B', 'D', '1', 0.4], ['D', 'A', 'C', '2', 0.4]] });
  // p10 练一练 3：∠BOE = 130°，∠D = 50°
  {
    const O = [1.9, 1.5];
    const E = add(O, mul(dir(130), 1.4));
    const D = add(O, mul(dir(-50), 1.5 / Math.sin(50 * Math.PI / 180)));
    sketch($('lx6'), { P: { A: [0, 1.5], B: [4, 1.5], O, E, D, C: [0.2, 0] }, seg: 'AB DE CD', lab: { O: [-8, 24] } });
  }
  // 习题 2：∠ABC = 50°，BD 平分，ED ∥ BC
  {
    const B = [0, 0];
    const A = mul(dir(50), 4);
    const C = [5.2, 0];
    const D = mt(B, dir(25), A, C);
    const E = mt(A, B, D, add(D, [1, 0]));
    sketch($('xt2'), { P: { A, B, C, D, E }, seg: 'AB BC CA BD ED', ang: [['B', 'D', 'C', '1', 0.8], ['E', 'A', 'D', '2', 0.38]] });
  }
  // 习题 10：∠1 = 25°，AB ⊥ AD，∠B = 65°
  {
    const A = [0, 2];
    const D = add(A, mul(dir(-25), 2 / Math.sin(25 * Math.PI / 180)));
    const B = add(A, mul(dir(-115), 2 / Math.sin(115 * Math.PI / 180)));
    sketch($('xt10'), { P: { A, B, C: [4.2, 2], D }, seg: 'AC AB BD CD AD', ang: [['A', 'D', 'C', '1', 0.7]], right: [['A', 'B', 'D']] });
  }
}

window.LESSON = {
  init() {
    initRuler();
    initTilt();
    initPairs('pair1', 'tw');
    initPairs('pair2', 'all');
    figures();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
