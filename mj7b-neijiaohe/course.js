'use strict';
/* 七下 7.5 多边形的内角和与外角和 · 本课互动：转动直线（图 7-29）、铅笔转一圈、n 边形分三角形、
 * 点 P 在内部 / 边上、外角平移拼成周角、剪去一个角。通用部分见 ../shared/math.js、../shared/mgeo.js。
 * 所有角度都由顶点坐标逐个计算，不是用公式“凑”出来的。 */
const { tex, fmt } = MathKit;
const { add, sub, mul, dir, ang, dist, lerp, angle, meet, centroid, line, arc, right, sketch } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const SUB = '₀₁₂₃₄₅₆₇₈₉';
const An = (i) => `A${String(i).split('').map((d) => SUB[d]).join('')}`;
const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
/** 角的平分线与对边的交点：V 的平分线交 PQ */
const bisFoot = (V, P, Q) => lerp(P, Q, dist(V, P) / (dist(V, P) + dist(V, Q)));
/** 多边形每个内角（逆时针排列的凸多边形） */
const innerAngles = (pts) => pts.map((p, i) => angle(p, pts[(i + pts.length - 1) % pts.length], pts[(i + 1) % pts.length]));
const btnGroup = (id, cb) => $(id).addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  $(id).querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
  cb(btn.dataset);
});

/* ---------- 第 3 页：图 7-29 ---------- */
function initRot() {
  const B = [0, 0];
  const C = [2.2, 0];
  const A = mul(dir(70), 3); // ∠B = 70°
  const s = { x: 4.2, par: false };
  const Ck = () => [s.x, 0];
  const b = Geo.board($('rot'), { x: [-0.7, 12.4], y: [-0.9, 3.6], w: 620 });
  b.seg([C, [12.4, 0]], { cls: 'gdash' });
  b.poly([A, B, C], { cls: 'tri-s' });
  b.seg(() => (s.par ? [A, add(A, [12, 0])] : [A, add(A, mul(sub(Ck(), A), 1.15))]), { cls: 'rotl' });
  arc(b, A, B, () => (s.par ? add(A, [1, 0]) : Ck()), { r: 0.45, cls: 'garc' });
  arc(b, () => (s.par ? [-99, -99] : Ck()), A, B, { r: 0.6, cls: 'garc g2' });
  arc(b, B, C, A, { r: 0.45, label: '70°', lr: 2.2, cls: 'garc g3' });
  b.text(A, 'A', { dx: -5, dy: -12 }); b.text(B, 'B', { dx: -20, dy: 8 }); b.text(C, 'C', { dx: -6, dy: 24 });
  b.text(() => (s.par ? null : Ck()), 'Cₖ', { dx: -6, dy: 24 });
  b.text(() => (s.par ? add(A, [8, 0]) : null), "C′", { dx: 0, dy: -10 });
  b.drag(Ck, (x) => { s.par = false; s.x = Math.round(clamp(x, 2.2, 12) * 10) / 10; });
  b.onUpdate = () => {
    const a = s.par ? 110 : angle(A, B, Ck());
    const c = s.par ? 0 : angle(Ck(), A, B);
    $('rotA').textContent = `${fmt(a, 1)}°`;
    $('rotC').textContent = s.par ? '—' : `${fmt(c, 1)}°`;
    $('rotS').textContent = `${fmt(a + c, 1)}°`;
    const msg = $('rotMsg');
    msg.className = 'tip feedback fb-ok';
    msg.textContent = s.par
      ? "AC′ ∥ BC：直线与 BC 不再相交，∠BAC′ = 110° = 180° − ∠B。"
      : `∠BACₖ 变大，∠ACₖB 变小，和始终是 ${fmt(a + c, 1)}° = 180° − ∠B。`;
  };
  $('rotPar').addEventListener('click', () => { s.par = true; b.update(); });
  b.update();
}

/* ---------- 第 6 页：铅笔转一圈 ---------- */
function initPen() {
  const A = [0, 0]; const B = [4, 0]; const C = [1.2, 2.8];
  const aA = angle(A, B, C); const aC = angle(C, A, B); const aB = angle(B, A, C);
  const PH = [[A, 0, aA], [C, aA, aC], [B, aA + aC, aB]]; // [转动中心, 起始方向, 要转的角]
  const s = { t: 0 };
  const state = () => {
    const k = Math.min(2, Math.floor(s.t));
    const [P, th0, da] = PH[k];
    return { P, th0, th: th0 + da * (s.t - k), k };
  };
  const b = Geo.board($('pen'), { x: [-2.4, 6.4], y: [-1.6, 4.6], w: 540 });
  b.poly([A, B, C], { cls: 'tri-s' });
  b.text(A, 'A', { dx: -20, dy: 18 }); b.text(B, 'B', { dx: 6, dy: 18 }); b.text(C, 'C', { dx: -6, dy: -12 });
  arc(b, () => state().P, () => add(state().P, dir(state().th0)), () => add(state().P, dir(state().th)), { r: 0.5, cls: 'garc', show: () => state().th - state().th0 > 0.5 });
  const L = 2.3;
  b.poly(() => {
    const { P, th } = state();
    const u = dir(th); const n = mul(dir(th + 90), 0.11);
    const tail = P; const body = add(P, mul(u, L - 0.35)); const tip = add(P, mul(u, L));
    return [add(tail, n), add(body, n), tip, sub(body, n), sub(tail, n)];
  }, { cls: 'pencil' });
  b.onUpdate = () => {
    const { th, k } = state();
    $('penV').textContent = `${fmt(th, 1)}°`;
    const msg = $('penMsg');
    const done = s.t >= 2.999;
    msg.className = `tip feedback ${done ? 'fb-ok' : ''}`;
    msg.textContent = done
      ? `转完了：笔尖方向与原来相反，一共转了 ∠A + ∠C + ∠B = ${fmt(aA, 1)}° + ${fmt(aC, 1)}° + ${fmt(aB, 1)}° = 180°。`
      : `正在绕点 ${'ACB'[k]} 转（累计 ${fmt(th, 1)}°）。`;
  };
  MathKit.slider($('penT'), (v) => { s.t = v; b.update(); });
}

/* ---------- 第 7 页：n 边形分成三角形 ---------- */
function polyPts(n, seed) {
  // 顶点在同一个圆上（一定是凸多边形），角度在均分的基础上随机偏移
  let r = seed;
  const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  const step = 360 / n;
  return Array.from({ length: n }, (_, i) => mul(dir(-90 - step / 2 + i * step + (rnd() - 0.5) * step * 0.6), 2.3));
}
function initPoly() {
  const s = { n: 5, seed: 7 };
  const b = Geo.board($('poly'), { x: [-3.2, 3.2], y: [-2.8, 2.8], w: 420 });
  const P = () => polyPts(s.n, s.seed);
  for (let i = 0; i < 8; i++) b.poly(() => (i < s.n - 2 ? [P()[0], P()[i + 1], P()[i + 2]] : []), { cls: `cut-t t${i % 2}` });
  b.poly(P, { cls: 'poly-o' });
  for (let i = 0; i < 7; i++) b.seg(() => (i < s.n - 3 ? [P()[0], P()[i + 2]] : [[-99, -99], [-99, -99]]), { cls: 'diag' });
  for (let i = 0; i < 10; i++) {
    b.text(() => {
      if (i >= s.n) return null;
      const p = P()[i];
      return add(p, mul(p, 0.13));
    }, An(i + 1), { dx: -12, dy: 8 });
  }
  b.onUpdate = () => {
    const sum = innerAngles(P()).reduce((x, y) => x + y, 0);
    $('polyNV').textContent = s.n;
    $('polyD').textContent = `${s.n - 3} 条`;
    $('polyT').textContent = `${s.n - 2} 个`;
    $('polyS').textContent = `${fmt(sum, 1)}° = 180° × ${s.n - 2}`;
  };
  MathKit.slider($('polyN'), (v) => { s.n = v; b.update(); });
  $('polyNew').addEventListener('click', () => { s.seed = (s.seed * 7 + 13) % 1000; b.update(); });
}

/* ---------- 第 9 页：点 P 在多边形内 / 边上（图 7-34） ---------- */
function initPin() {
  const H = [[-1.6, -1.5], [0.6, -1.9], [2.2, -0.4], [1.7, 1.6], [-0.3, 2.1], [-2.1, 0.5]]; // A1…A6 逆时针
  const n = H.length;
  const s = { m: 'in', p: [0.1, 0.1], t: 0.45 };
  const P = () => (s.m === 'in' ? s.p : lerp(H[1], H[2], s.t));
  const inside = (q) => H.every((a, i) => cross(a, H[(i + 1) % n], q) > 0.05);
  const b = Geo.board($('pin'), { x: [-2.9, 3.0], y: [-2.6, 2.8], w: 420 });
  b.poly(H, { cls: 'poly-o' });
  H.forEach((a, i) => b.seg(() => (s.m === 'side' && (i === 1 || i === 2) ? [[-99, -99], [-99, -99]] : [P(), a]), { cls: 'diag' }));
  H.forEach((a, i) => b.text(a, An(i + 1), { dx: a[0] > 0 ? 6 : -26, dy: a[1] > 0 ? -6 : 20 }));
  b.text(P, 'P', { dx: 8, dy: 22 });
  b.drag(P, (x, y) => {
    if (s.m === 'in') { if (inside([x, y])) s.p = [x, y]; return; }
    const d = sub(H[2], H[1]);
    s.t = clamp(Geo.dot(sub([x, y], H[1]), d) / Geo.dot(d, d), 0.12, 0.88);
  }, { r: 8 });
  b.onUpdate = () => {
    const p = P();
    // 点 P 处各三角形的顶角之和
    const tris = s.m === 'in' ? H.map((a, i) => [a, H[(i + 1) % n]]) : [[H[2], H[3]], [H[3], H[4]], [H[4], H[5]], [H[5], H[0]], [H[0], H[1]]];
    const atP = tris.reduce((acc, [a, c]) => acc + angle(p, a, c), 0);
    const k = tris.length;
    $('pinMsg').className = 'tip feedback fb-ok';
    $('pinMsg').textContent = `分成 ${k} 个三角形；点 P 处的角合起来 ${fmt(atP, 1)}°（${s.m === 'in' ? '周角' : '平角'}）。内角和 = 180° × ${k} − ${fmt(atP, 0)}° = ${180 * k - Math.round(atP)}°。`;
  };
  btnGroup('pBtns', (d) => { s.m = d.k; b.update(); });
  b.update();
}

/* ---------- 第 13 页：外角平移拼成周角 ---------- */
const SHAPES = {
  3: [[0, 0], [3.2, 0], [1.1, 2.3]],
  4: [[0, 0], [3.0, 0], [2.3, 1.8], [0.5, 2.1]],
  5: [[0, 0], [2.6, 0], [3.3, 1.7], [1.6, 2.8], [-0.4, 1.9]],
  6: [[0, 0], [2.1, -0.2], [3.2, 1.2], [2.6, 2.6], [0.6, 2.9], [-0.6, 1.4]],
};
const GREEK = ['α', 'β', 'γ', 'δ', 'ε', 'ζ'];
function extAngles(pts) {
  const n = pts.length;
  return pts.map((p, k) => {
    const a0 = ang(sub(p, pts[(k + n - 1) % n]));
    let d = ang(sub(pts[(k + 1) % n], p)) - a0;
    if (d < 0) d += 360;
    return { p, a0, d };
  });
}
function initExt() {
  const s = { n: 3, u: 0 };
  const O = [5.6, 1.2];
  const b = Geo.board($('ext'), { x: [-1.6, 7.6], y: [-1.5, 3.9], w: 560 });
  const E = () => extAngles(SHAPES[s.n]);
  b.poly(() => SHAPES[s.n], { cls: 'tri-s' });
  for (let k = 0; k < 6; k++) {
    b.seg(() => { const e = E()[k]; return e ? [e.p, add(e.p, mul(dir(e.a0), 1.3))] : [[-99, -99], [-99, -99]]; }, { cls: 'gdash' });
    b.poly(() => {
      const e = E()[k];
      if (!e) return [];
      const c = lerp(e.p, O, s.u);
      return [c, ...Array.from({ length: 25 }, (_, i) => add(c, mul(dir(e.a0 + (e.d * i) / 24), 0.75)))];
    }, { cls: `sec s${k}` });
    b.text(() => { const e = E()[k]; return e ? add(lerp(e.p, O, s.u), mul(dir(e.a0 + e.d / 2), 1.05)) : null; }, () => GREEK[k], { cls: `lb gk s${k}`, dx: -6, dy: 7 });
  }
  b.pt(O, { r: 4 });
  b.text(O, 'O', { dx: 8, dy: 24 });
  b.onUpdate = () => {
    const e = E();
    const sum = e.reduce((x, y) => x + y.d, 0);
    $('extMsg').className = `tip feedback ${s.u > 0.99 ? 'fb-ok' : ''}`;
    $('extMsg').textContent = `${e.map((x, i) => `${GREEK[i]} = ${Math.round(x.d)}°`).join('，')}；和 = ${fmt(sum, 1)}°${s.u > 0.99 ? '：在点 O 拼成一个周角。' : '。'}`;
  };
  btnGroup('extBtns', (d) => { s.n = +d.n; b.update(); });
  MathKit.slider($('extU'), (v) => { s.u = v; b.update(); });
}

/* ---------- 第 14 页：剪去一个三角形（图 7-41） ---------- */
function initCut() {
  const A = [0, 0]; const B = [2.6, 0]; const C = [3.3, 1.9]; const D = [1.8, 3.0]; const E = [-0.2, 2.2];
  const M = lerp(A, E, 0.55); const N = lerp(A, B, 0.45);
  const CASES = [
    { cut: [B, E], keep: [B, C, D, E], off: [A, B, E], name: '四' },
    { cut: [B, M], keep: [B, C, D, E, M], off: [A, B, M], name: '五' },
    { cut: [N, M], keep: [N, B, C, D, E, M], off: [A, N, M], name: '六' },
  ];
  const s = { k: 0 };
  const b = Geo.board($('cut'), { x: [-0.9, 4.0], y: [-0.6, 3.5], w: 360 });
  b.poly(() => CASES[s.k].off, { cls: 'off' });
  b.poly(() => CASES[s.k].keep, { cls: 'keep' });
  b.seg(() => CASES[s.k].cut, { cls: 'cutl' });
  [[A, 'A', -18, 18], [B, 'B', 6, 18], [C, 'C', 8, 6], [D, 'D', -4, -10], [E, 'E', -20, -2]].forEach(([p, t, dx, dy]) => b.text(p, t, { dx, dy }));
  b.onUpdate = () => {
    const c = CASES[s.k];
    const n = c.keep.length;
    $('cutMsg').className = 'tip feedback fb-ok';
    $('cutMsg').textContent = `剩下${c.name}边形：内角和 (${n} − 2) × 180° = ${(n - 2) * 180}°，外角和 360°。`;
  };
  btnGroup('cutBtns', (d) => { s.k = +d.k; b.update(); });
  b.update();
}

/* ---------- 静态示意图 ---------- */
function figures() {
  // 试一试：过 A 作 AC′ ∥ BC
  {
    const B = [0, 0]; const C = [3.6, 0]; const A = [1.3, 2.3]; const Cp = [4.0, 2.3];
    sketch($('prf'), { P: { A, B, C, 'C′': Cp }, seg: 'AB BC CA', dash: 'AC′', ang: [['C', 'A', 'B', '', 0.4], ['A', 'C', 'C′', '', 0.4], ['B', 'C', 'A', '', 0.4]], lab: { 'C′': [6, -6] } });
  }
  // 图 7-30：∠B = 50°，∠C = 60°，∠A = 70°
  {
    const B = [0, 0]; const C = [3.1, 0];
    const A = meet(B, dir(50), C, add(C, dir(120)));
    const D = bisFoot(B, A, C); const E = bisFoot(C, A, B);
    sketch($('f730'), { P: { A, B, C, D, E, P: meet(B, D, C, E) }, seg: 'AB BC CA BD CE', ang: [['B', 'C', 'D', '1', 0.6], ['C', 'E', 'B', '2', 0.5]], lab: { P: [-4, -10] } });
  }
  // 练一练 1：两个三角形（72°、81°、x；31°、y）
  {
    const L = [0, 0]; const R = mul(dir(-20), 2.9);
    const T = meet(L, dir(52), R, add(R, dir(133)));
    const L2 = [3.6, -0.9]; const R2 = [6.8, -0.9]; const T2 = [6.8, -0.9 + 3.2 * Math.tan(31 * Math.PI / 180)];
    sketch($('lx1'), {
      P: { L, R, T, L2, R2, T2 }, hide: 'LRTL2R2T2', seg: 'LR RT TL L2R2 R2T2 T2L2', right: [['R2', 'L2', 'T2']], pad: 0.5,
      ang: [['L', 'R', 'T', '72°', 0.4], ['T', 'L', 'R', '81°', 0.35], ['R', 'T', 'L', 'x°', 0.45], ['L2', 'R2', 'T2', '31°', 0.6], ['T2', 'L2', 'R2', 'y°', 0.35]],
    });
  }
  // 图 7-35：A、B、C、D 共圆，∠A + ∠C = 180°
  {
    const O = [1.3, 0.9]; const r = Math.hypot(1.3, 0.9);
    const A = [0, 0]; const B = [2.6, 0]; const C = add(O, mul(dir(42), r)); const D = add(O, mul(dir(142), r));
    const E = meet(B, add(B, add(mul(sub(A, B), 1 / dist(A, B)), mul(sub(C, B), 1 / dist(C, B)))), C, D);
    const F = meet(D, add(D, add(mul(sub(A, D), 1 / dist(A, D)), mul(sub(C, D), 1 / dist(C, D)))), A, B);
    sketch($('f735'), { P: { A, B, C, D, E, F }, seg: 'AB BC CD DA BE DF', ang: [['B', 'A', 'E', '1', 0.45], ['D', 'F', 'C', '2', 0.4]], lab: { E: [-4, -10], F: [-4, 22] } });
  }
  // 练一练（p32）1 ①：∠A = 90°，∠D = 150°，x = 60°
  {
    const A = [0, 0]; const B = [2.8, 0]; const D = [0, 1.4];
    const C = meet(D, add(D, dir(60)), B, add(B, dir(120)));
    sketch($('lx4a'), { P: { A, B, C, D }, seg: 'AB BC CD DA', right: [['A', 'B', 'D']], ang: [['D', 'C', 'A', '150°', 0.3], ['B', 'C', 'A', 'x°', 0.35], ['C', 'D', 'B', 'x°', 0.35]] });
  }
  // ②：五边形 90°、y = 60°、120°、150°、2y = 120°
  {
    const A = [0, 0]; const B = [3, 0]; const C = add(B, mul(dir(120), 1.6)); const D = add(C, mul(dir(180), 1.334)); const E = add(D, mul(dir(210), 1.0)); // 回到 A：EA 沿 270°，长 0.886
    sketch($('lx4b'), { P: { A, B, C, D, E }, seg: 'AB BC CD DE EA', right: [['A', 'B', 'E']], ang: [['B', 'C', 'A', 'y°', 0.35], ['C', 'D', 'B', '120°', 0.3], ['D', 'E', 'C', '150°', 0.3], ['E', 'A', 'D', '2y°', 0.25]] });
  }
  // 正六边形
  {
    const P = {};
    'ABCDEF'.split('').forEach((k, i) => { P[k] = mul(dir(-120 + i * 60), 1.5); });
    sketch($('lx5'), { P, seg: 'AB BC CD DE EF FA' });
  }
  // 图 7-36、7-37：延长 AB 得外角
  sketch($('f736'), { P: { A: [0, 0], B: [2.2, 0], C: [1.3, 1.9], D: [3.4, 0] }, seg: 'AB BC CA BD', ang: [['B', 'D', 'C', '', 0.35]] });
  sketch($('f737'), { P: { A: [0, 0], B: [1.6, 0], C: [2.3, 0.9], D: [1.5, 2.0], E: [-0.4, 1.4], F: [3.0, 0] }, seg: 'AB BC CD DE EA BF', ang: [['B', 'F', 'C', '', 0.3]] });
  // 习题 12：前进 10 m、左转 30°，共 12 段
  {
    const pts = [[0, 0]];
    for (let i = 0; i < 12; i++) pts.push(add(pts[i], dir(30 * i)));
    const P = { A: pts[0], B: pts[1], C: pts[2], D: pts[3], X: add(pts[1], [0.7, 0]) };
    'EFGHIJKL'.split('').forEach((k, i) => { P[k] = pts[i + 4]; }); // 只为撑开画板范围
    const b = sketch($('xt12'), { P, hide: 'XEFGHIJKL', dash: 'BX', ang: [['B', 'X', 'C', '30°', 0.35]], seg: 'AB BC CD', lab: { A: [-14, 20], B: [0, 22], C: [8, 6], D: [8, 4] } });
    for (let i = 3; i < 12; i++) b.seg([pts[i], pts[i + 1]], { cls: 'gdash' });
    b.update();
  }
}
window.LESSON = {
  init() {
    initRot();
    initPen();
    initPoly();
    initPin();
    initExt();
    initCut();
    figures();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
