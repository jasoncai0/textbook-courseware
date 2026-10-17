'use strict';
/* 九上 2.4 圆周角 · 本课互动：拖动顶点看圆周角不变、三种情形自动判别、直径所对的圆周角 / 找圆心、圆内接四边形对角互补。
 * 通用部分见 ../shared/math.js、mgeo.js、mproof.js、mcheck.js。所有图形由坐标计算，作图板横纵同比例；读数由坐标实时算出。 */
const { fmt } = MathKit;
const { add, sub, mul, len, angle, meet, line, arc, right } = Geo;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const HIDE = [99, 99];
const norm = (d) => ((d % 360) + 360) % 360;
const onC = (O, r, d) => [O[0] + r * Math.cos(d * RAD), O[1] + r * Math.sin(d * RAD)];
const degOf = (O, p) => norm(Math.atan2(p[1] - O[1], p[0] - O[0]) / RAD);
const deg = (v) => `${fmt(v, 1)}°`;
const circ = (b, O, r, cls = 'circ') => b.curve((t) => onC(O, r, 360 * t), 0, 1, { cls, n: 180 });
/** 名字外移：沿 O→P 方向偏出 off（世界单位），文字居中 */
const away = (P, O, off) => { const d = sub(P, O); const l = len(d) || 1; return add(P, mul(d, off / l)); };
const lab = (b, P, name, O = [0, 0], off = 0.36) => b.text(() => away(typeof P === 'function' ? P() : P, O, off), name, { dx: -6, dy: 7 });
const near = (a, b, tol) => { const d = norm(a - b); return Math.min(d, 360 - d) < tol; };

/** 静态圆形示意图：圆心 O 在原点。spec = { r, P: {A: 度数 | [x, y]}, seg, dash, ang: [[V, A, B, label, r]], right: [[V, A, B]], w, pad, lab: {A: off}, noO } */
function cfig(el, spec) {
  const r = spec.r || 2;
  const P = { O: [0, 0] };
  Object.entries(spec.P).forEach(([k, v]) => { P[k] = Array.isArray(v) ? v : onC([0, 0], r, v); });
  const pts = Object.values(P);
  const pad = spec.pad ?? 0.65;
  const xs = [...pts.map((p) => p[0]), -r, r];
  const ys = [...pts.map((p) => p[1]), -r, r];
  const b = Geo.board(el, { x: [Math.min(...xs) - pad, Math.max(...xs) + pad], y: [Math.min(...ys) - pad, Math.max(...ys) + pad], w: spec.w || 360 });
  circ(b, [0, 0], r);
  const pairs = (str) => (str || '').split(/\s+/).filter(Boolean).map((t) => t.match(/[A-Za-z][′0-9₀-₉]*/g).map((n) => P[n]));
  pairs(spec.dash).forEach(([p, q]) => b.seg([p, q], { cls: 'gdash' }));
  pairs(spec.seg).forEach(([p, q]) => b.seg([p, q], { cls: 'gs' }));
  (spec.ang || []).forEach(([v, a, c, t, rr]) => arc(b, P[v], P[a], P[c], { label: t, r: rr || r * 0.22 }));
  (spec.right || []).forEach(([v, a, c]) => right(b, P[v], P[a], P[c], { s: r * 0.1 }));
  Object.entries(P).forEach(([name, p]) => {
    if (name === 'O') {
      if (!spec.noO) { b.pt(p, { r: 3 }); b.text(p, 'O', { dx: 5, dy: 18 }); }
      return;
    }
    const off = (spec.lab && spec.lab[name]) ?? r * 0.13;
    b.text(len(p) < 1e-9 ? p : away(p, [0, 0], off), name, { dx: -6, dy: 7 });
  });
  b.update();
  return b;
}

/* ---------- 第 3 页：图 2-22 与练习 1 ---------- */
function initDefFigs() {
  cfig($('f222'), { r: 2, P: { 'A₁': 55, 'A₂': 95, 'A₃': 140, B: 235, C: 305 }, seg: 'A₁B A₁C A₂B A₂C A₃B A₃C', w: 320 });
  const small = (id, draw) => {
    const r = 1.5;
    const b = Geo.board($(id), { x: [-2.3, 2.3], y: [-2, 2.7], w: 200 });
    circ(b, [0, 0], r);
    b.pt([0, 0], { r: 2.5 });
    draw(b, r);
    b.update();
  };
  small('pk1', (b, r) => { const V = [0.55, 2.35]; const p = onC([0, 0], r, 205); const q = onC([0, 0], r, 285); b.seg([V, p], { cls: 'gs' }); b.seg([V, q], { cls: 'gs' }); arc(b, V, p, q, { r: 0.4 }); });
  small('pk2', (b, r) => { const V = onC([0, 0], r, 90); const p = onC([0, 0], r, 225); const q = onC([0, 0], r, 315); b.seg([V, p], { cls: 'gs' }); b.seg([V, q], { cls: 'gs' }); arc(b, V, p, q, { r: 0.4 }); });
  small('pk3', (b, r) => { const V = [0, 0.95]; const p = onC([0, 0], r, 215); const q = onC([0, 0], r, 325); b.seg([V, p], { cls: 'gs' }); b.seg([V, q], { cls: 'gs' }); arc(b, V, p, q, { r: 0.4 }); });
  small('pk4', (b, r) => { const V = onC([0, 0], r, 120); const p = onC([0, 0], r, 260); const q = add(V, mul(Geo.dir(30), 1.9)); b.seg([V, p], { cls: 'gs' }); b.seg([V, q], { cls: 'gs' }); arc(b, V, p, q, { r: 0.4 }); });
}

/* ---------- 第 4 页：拖动顶点 A ---------- */
function initMove() {
  const O = [0, 0];
  const R = 3;
  const s = { a: 110, b: 235, c: 305, keep: [] };
  const P = (d) => onC(O, R, d);
  const A = () => P(s.a);
  const B = () => P(s.b);
  const C = () => P(s.c);
  /** ∠BAC 所对的弧（不含 A 的那条）：[起点方向, 度数]（逆时针） */
  const opp = () => {
    const span = norm(s.c - s.b);
    return norm(s.a - s.b) < span ? [s.c, 360 - span] : [s.b, span];
  };
  const b = Geo.board($('mv'), { x: [-4.3, 4.3], y: [-3.9, 3.9], w: 520 });
  circ(b, O, R);
  b.curve((t) => { const [st, sp] = opp(); return P(st + sp * t); }, 0, 1, { cls: 'arc-hl', n: 160 });
  [0, 1, 2, 3].forEach((i) => {
    const G = () => (s.keep[i] === undefined ? HIDE : P(s.keep[i]));
    const on = () => s.keep[i] !== undefined;
    b.seg(() => (on() ? [G(), B()] : [HIDE, HIDE]), { cls: 'ghost' });
    b.seg(() => (on() ? [G(), C()] : [HIDE, HIDE]), { cls: 'ghost' });
    b.text(() => (s.keep[i] === undefined ? null : away(G(), O, 0.4)), `A${'₁₂₃₄'[i]}`, { dx: -8, dy: 7, cls: 'lb ghost-l' });
  });
  b.seg(() => [O, B()], { cls: 'ln-o' });
  b.seg(() => [O, C()], { cls: 'ln-o' });
  b.seg(() => [A(), B()], { cls: 'gs' });
  b.seg(() => [A(), C()], { cls: 'gs' });
  arc(b, O, B, C, { r: 0.55, cls: 'garc o' });
  arc(b, A, B, C, { r: 0.7, cls: 'garc on' });
  b.pt(O, { r: 4 });
  b.text(O, 'O', { dx: 6, dy: -8 });
  lab(b, A, 'A', O, 0.42); lab(b, B, 'B', O, 0.42); lab(b, C, 'C', O, 0.42);
  const ok = (d, others) => others.every((o) => !near(d, o, 8));
  b.drag(A, (x, y) => { const d = degOf(O, [x, y]); if (ok(d, [s.b, s.c])) s.a = d; });
  b.drag(B, (x, y) => { const d = degOf(O, [x, y]); if (ok(d, [s.a, s.c])) s.b = d; }, { r: 7, hit: 18 });
  b.drag(C, (x, y) => { const d = degOf(O, [x, y]); if (ok(d, [s.a, s.b])) s.c = d; }, { r: 7, hit: 18 });
  b.onUpdate = () => {
    const a = angle(A(), B(), C());
    const o = angle(O, B(), C());
    const sp = opp()[1];
    $('mvA').textContent = deg(a);
    $('mvO').textContent = deg(o);
    $('mvArc').textContent = deg(sp);
    $('mvSide').textContent = sp <= 180 ? '优弧上' : '劣弧上';
    const msg = $('mvMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = sp <= 180
      ? `$\\angle BAC=${fmt(a, 1)}^\\circ=\\dfrac12\\times${fmt(o, 1)}^\\circ$，正好是 $\\angle BOC$ 的一半．`
      : `$A$ 在劣弧上：$\\angle BAC$ 对的是<b>优弧</b> $${fmt(sp, 1)}^\\circ$，$\\angle BAC=${fmt(a, 1)}^\\circ=\\dfrac12\\times${fmt(sp, 1)}^\\circ$．`;
    MathKit.tex(msg);
  };
  $('mvKeep').addEventListener('click', () => { s.keep = [...s.keep, s.a].slice(-4); b.update(); });
  $('mvClr').addEventListener('click', () => { s.keep = []; b.update(); });
  const preset = (pb, pc) => { s.b = pb; s.c = pc; s.a = 110; s.keep = []; b.update(); };
  $('mv90').addEventListener('click', () => preset(225, 315));
  $('mv60').addEventListener('click', () => preset(240, 300));
  b.update();
}

/* ---------- 第 5 页：三种情形 ---------- */
function initCases() {
  const O = [0, 0];
  const R = 3;
  const s = { a: 130 };
  const SB = 230;
  const SC = 310;
  const P = (d) => onC(O, R, d);
  const A = () => P(s.a);
  const B = P(SB);
  const C = P(SC);
  const D = () => P(s.a + 180);
  const kind = () => {
    const d = norm(s.a + 180);
    if (near(d, SB, 0.01) || near(d, SC, 0.01)) return 1;
    return d > SB && d < SC ? 2 : 3;
  };
  const b = Geo.board($('cs'), { x: [-4.2, 4.2], y: [-3.9, 3.9], w: 500 });
  circ(b, O, R);
  b.seg(() => (kind() === 1 ? [HIDE, HIDE] : [A(), D()]), { cls: 'gdash' });
  b.seg(() => [O, A()], { cls: 'ln-o' });
  b.seg([O, B], { cls: 'ln-o' });
  b.seg([O, C], { cls: 'ln-o' });
  b.seg(() => [A(), B], { cls: 'gs' });
  b.seg(() => [A(), C], { cls: 'gs' });
  arc(b, O, B, C, { r: 0.55, cls: 'garc o', label: () => deg(angle(O, B, C)), lr: 1.9 });
  arc(b, A, B, C, { r: 0.75, cls: 'garc on', label: () => deg(angle(A(), B, C)), lr: 1.7 });
  b.pt(O, { r: 4 });
  b.text(O, 'O', { dx: 8, dy: -6 });
  lab(b, A, 'A', O, 0.42); lab(b, B, 'B', O, 0.42); lab(b, C, 'C', O, 0.42);
  b.text(() => (kind() === 1 ? null : away(D(), O, 0.42)), 'D', { dx: -6, dy: 7 });
  b.drag(A, (x, y) => {
    let d = degOf(O, [x, y]);
    if (d > SB - 10 && d < SC + 10) return; // A 只在优弧上
    if (near(d + 180, SC, 3)) d = SC - 180;
    if (near(d + 180, SB, 3)) d = SB - 180 + 360;
    s.a = norm(d);
  });
  const TXT = {
    1: '情形（1）：圆心 $O$ 在 $\\angle BAC$ 的一边 $AC$ 上．',
    2: '情形（2）：圆心 $O$ 在 $\\angle BAC$ 的<b>内部</b>——虚线是直径 $AD$．',
    3: '情形（3）：圆心 $O$ 在 $\\angle BAC$ 的<b>外部</b>——虚线是直径 $AD$．',
  };
  b.onUpdate = () => {
    const k = kind();
    const msg = $('csMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `${TXT[k]}　$\\angle BAC=${fmt(angle(A(), B, C), 1)}^\\circ$，$\\angle BOC=${fmt(angle(O, B, C), 1)}^\\circ$．`;
    MathKit.tex(msg);
    $('csBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', +x.dataset.case === k));
  };
  const POS = { 1: SC - 180, 2: 90, 3: 165 };
  $('csBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-case]');
    if (!btn) return;
    s.a = POS[btn.dataset.case];
    b.update();
  });
  b.update();
}

/* ---------- 第 9 页：直径所对的圆周角 / 找圆心 ---------- */
function initDia() {
  const O = [0, 0];
  const R = 3;
  const s = { a: 115, m: 'd' };
  const P = (d) => onC(O, R, d);
  const isD = () => s.m === 'd';
  const H2 = [HIDE, HIDE];
  const b = Geo.board($('dia'), { x: [-4.2, 4.2], y: [-3.8, 3.8], w: 500 });
  circ(b, O, R);
  const A = () => P(s.a);
  const B = P(180);
  const C = P(0);
  b.seg(() => (isD() ? [B, C] : H2), { cls: 'gs' });
  b.seg(() => (isD() ? [A(), B] : H2), { cls: 'gs' });
  b.seg(() => (isD() ? [A(), C] : H2), { cls: 'gs' });
  right(b, () => (isD() ? A() : HIDE), B, C, { s: 0.35 });
  b.text(() => (isD() ? away(B, O, 0.4) : null), 'B', { dx: -6, dy: 7 });
  b.text(() => (isD() ? away(C, O, 0.4) : null), 'C', { dx: -6, dy: 7 });
  b.text(() => (isD() ? away(A(), O, 0.4) : null), 'A', { dx: -6, dy: 7 });
  // 找圆心：两次放三角尺（直角顶点在圆上），直角边与圆的交点连成直径
  const RULERS = [[100, 30, 210], [345, 120, 300]];
  RULERS.forEach(([v, p, q], i) => {
    const V = P(v);
    b.poly(() => (isD() ? [] : [V, P(p), P(q)]), { cls: `ruler r${i}` });
    b.seg(() => (isD() ? H2 : [P(p), P(q)]), { cls: 'gdash' });
    right(b, () => (isD() ? HIDE : V), P(p), P(q), { s: 0.35 });
  });
  b.pt(O, { r: 4 });
  b.text(O, 'O', { dx: 8, dy: -6 });
  b.drag(() => (isD() ? A() : HIDE), (x, y) => {
    const d = degOf(O, [x, y]);
    if (!near(d, 0, 6) && !near(d, 180, 6)) s.a = d;
  });
  b.onUpdate = () => {
    const msg = $('diaMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = isD()
      ? `$\\angle BAC=${fmt(angle(A(), B, C), 1)}^\\circ$——$A$ 走到哪里都是直角．`
      : '两次放直角三角尺，两条斜边（直径）的交点就是圆心 $O$．';
    MathKit.tex(msg);
  };
  $('diaBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    s.m = btn.dataset.m;
    $('diaBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* ---------- 第 12 页：圆内接四边形 ---------- */
function initQuad() {
  const O = [0, 0];
  const R = 3;
  const s = { d: [220, 320, 390, 480] }; // A、B、C、D 的方向角，逆时针递增
  const P = (k) => onC(O, R, s.d[k]);
  const NAMES = ['A', 'B', 'C', 'D'];
  const GAP = 14;
  const b = Geo.board($('qd'), { x: [-4.2, 4.2], y: [-3.8, 3.8], w: 500 });
  circ(b, O, R);
  b.poly(() => [0, 1, 2, 3].map(P), { cls: 'quad' });
  const ang = (k) => angle(P(k), P((k + 3) % 4), P((k + 1) % 4));
  [0, 1, 2, 3].forEach((k) => {
    arc(b, () => P(k), () => P((k + 3) % 4), () => P((k + 1) % 4), { r: 0.55, cls: k % 2 ? 'garc o' : 'garc on' });
    lab(b, () => P(k), NAMES[k], O, 0.42);
    b.drag(() => P(k), (x, y) => {
      const raw = degOf(O, [x, y]);
      const cur = s.d[k];
      const t = cur + ((((raw - cur) % 360) + 540) % 360) - 180; // 与当前值最接近的同终边角
      const prev = k === 0 ? s.d[3] - 360 : s.d[k - 1];
      const nxt = k === 3 ? s.d[0] + 360 : s.d[k + 1];
      if (t > prev + GAP && t < nxt - GAP) s.d = s.d.map((v, i) => (i === k ? t : v));
    });
  });
  b.pt(O, { r: 4 });
  b.text(O, 'O', { dx: 8, dy: -6 });
  b.onUpdate = () => {
    const [a, bb, c, d] = [0, 1, 2, 3].map(ang);
    $('qA').textContent = deg(a); $('qB').textContent = deg(bb); $('qC').textContent = deg(c); $('qD').textContent = deg(d);
    $('qAC').textContent = deg(a + c); $('qBD').textContent = deg(bb + d);
  };
  b.update();
}

/* ---------- 例题、练习的精确示意图 ---------- */
function initFigs() {
  cfig($('f226'), { r: 2, P: { A: 100, B: 230, C: 310, D: 280 }, seg: 'AB AC OB OC', dash: 'AD', w: 300 });
  cfig($('f227'), { r: 2, P: { A: 150, B: 200, C: 300, D: 330 }, seg: 'AB AC OB OC', dash: 'AD', w: 300 });
  cfig($('fw'), { r: 2, P: { A: 90, B: 220, C: 320, E: 270 }, seg: 'AB AC EB EC BC', ang: [['A', 'B', 'C', '', 0.45], ['E', 'B', 'C', '', 0.3]], w: 220 });
  // 图 2-27：∠AOD = 150°，弧 BC = 70°
  const r = 2;
  const [A, B, C, D] = [105, 25, 315, 255].map((d) => onC([0, 0], r, d));
  cfig($('f227e'), { r, P: { A, B, C, D, E: meet(A, B, D, C) }, seg: 'AE DE OA OD BD', w: 420 });
  // 图 2-30：AB 直径，∠ACD = 60°（弧 AD = 120°），∠ADC = 50°（弧 AC = 100°）
  const Q = { A: 180, B: 0, C: 80, D: 300 };
  const q = Object.fromEntries(Object.entries(Q).map(([k, d]) => [k, onC([0, 0], r, d)]));
  cfig($('f230'), { r, P: { ...q, E: meet(q.C, q.D, q.A, q.B) }, seg: 'AB CD AC AD', dash: 'DB', w: 380, lab: { E: 0.3 } });
  // 图 2-31：BC 直径，弧 AE = 弧 AB = 60°
  const t = Object.fromEntries(Object.entries({ A: 120, B: 180, C: 0, E: 60 }).map(([k, d]) => [k, onC([0, 0], r, d)]));
  const Dd = [t.A[0], 0];
  cfig($('f231'), { r, P: { ...t, D: Dd, F: meet(t.B, t.E, t.A, Dd), G: meet(t.B, t.E, t.A, t.C) }, seg: 'BC AB AC AD BE', right: [['D', 'A', 'C']], w: 380, lab: { D: 0.3, F: 0.32, G: 0.3 } });
  // 图 2-36：AB = AD，∠C = 110°
  cfig($('f236'), { r, P: { A: 90, B: 200, C: 270, D: 340, E: 40 }, seg: 'AB BC CD DA AE ED', dash: 'BD', w: 360 });
  cfig($('h1'), { r: 2, P: { A: 160, D: 20, B: 235, C: 305 }, seg: 'AB AC DB DC OB OC', w: 220 });
  cfig($('h2'), { r: 2, P: { A: 90, B: 210, C: 330, D: 50 }, seg: 'AB BC CA BD DC', w: 220 });
  cfig($('h3'), { r: 2, P: { A: 90, B: 220, C: 270, D: 320 }, seg: 'AB BC CD DA OB OD', w: 220 });
}

MProof.addBasis({
  'r-eq': { t: '同圆的半径相等', kind: '性质', src: '九上 2.1 圆', body: '圆上各点到圆心的距离都等于半径，所以同圆（或等圆）的半径相等．' },
  'dy-xz': { t: '等边对等角', kind: '定理', src: '八上 2.5 等腰三角形的轴对称性', body: '等腰三角形的两底角相等．在同一个三角形中：$OA=OC$ ⇒ $\\angle OCA=\\angle OAC$．' },
  'dy-pd': { t: '等角对等边', kind: '定理', src: '八上 2.5 等腰三角形的轴对称性', body: '有两个角相等的三角形是等腰三角形．' },
  yzj: { t: '圆周角定理', kind: '定理', src: '九上 2.4（课本 p55）', body: '圆周角的度数等于它所对弧上的圆心角度数的一半，同弧或等弧所对的圆周角相等．' },
  'yzj-hu': { t: '圆周角的度数等于它所对弧的度数的一半', kind: '定理', src: '九上 2.4（课本 p55）', body: '圆心角的度数与它所对的弧的度数相等（2.2），所以圆周角的度数等于它所对弧的度数的一半．' },
  'zj-90': { t: '直径所对的圆周角是直角', kind: '推论', src: '九上 2.4（课本 p56）', body: '直径所对的圆周角是直角，$90^\\circ$ 的圆周角所对的弦是直径．' },
  'nj-hb': { t: '圆内接四边形的对角互补', kind: '定理', src: '九上 2.4（课本 p59）', body: '圆内接四边形 $ABCD$ 中，$\\angle A+\\angle C=180^\\circ$，$\\angle B+\\angle D=180^\\circ$．' },
});

window.LESSON = {
  init() {
    MProof.init();
    initDefFigs();
    initMove();
    initCases();
    initDia();
    initQuad();
    initFigs();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
