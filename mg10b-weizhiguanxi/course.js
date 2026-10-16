'use strict';
/* 高一下 13.2 基本图形位置关系 · 本课互动：正方体里判断两直线关系并算夹角、线面关系与线面角、二面角翻折、
 * “无数条 ≠ 任意”演示，以及各例题的可旋转 3D 图。3D 线框见 ../shared/solid3d.js */
const { tex, fmt } = MathKit;
const { add, sub, mul, dot, lerp, norm } = Solid3D.vec;
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const views = [];
const deckStep = { n: 0 };
const on = (n) => () => deckStep.n >= n;
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const EPS = 1e-9;

/* ---------- 长方体 / 正方体：A 前左、B 前右、C 后右、D 后左，上底面加下标 1（或撇） ---------- */
const NAMES = ['A', 'B', 'C', 'D'];
function boxPts([a, b, c], prime) {
  const base = [[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0]];
  const P = {};
  NAMES.forEach((n, i) => { P[n] = base[i]; P[prime ? `${n}′` : `${n}₁`] = add(base[i], [0, 0, c]); });
  return P;
}
const boxVF = (P, up) => {
  const V = [...NAMES.map((n) => P[n]), ...NAMES.map((n) => P[up(n)])];
  return { V, F: [[3, 2, 1, 0], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]] };
};
function boxView(id, dims, opt = {}) {
  const v = Solid3D.view($(id), { w: opt.w || 420, h: opt.h || 330, scale: opt.scale || 80, yaw: opt.yaw ?? -26, pitch: opt.pitch ?? 22, center: mul(dims, 0.5) });
  views.push(v);
  const up = (n) => (opt.prime ? `${n}′` : `${n}₁`);
  const P = boxPts(dims, opt.prime);
  v.solid(boxVF(P, up));
  const off = { A: [-20, 22], B: [6, 22], C: [8, 16], D: [-22, -4] };
  NAMES.forEach((n) => {
    v.label(P[n], n, { dx: off[n][0], dy: off[n][1] });
    v.label(P[up(n)], up(n), { dx: off[n][0], dy: n === 'A' || n === 'B' ? -6 : -8 });
  });
  return { v, P };
}

/* ---------- 第 3 页：三个基本事实 ---------- */
const sq = (h, z = 0) => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]];
function smallView(id, o = {}) {
  const v = Solid3D.view($(id), { w: 300, h: 220, scale: 60, yaw: -22, pitch: 26, center: [0, 0, 0], ...o });
  views.push(v);
  return v;
}
function initBasics() {
  const v1 = smallView('bf1');
  v1.face(sq(1.6), { cls: 'f1' }); v1.curve(sq(1.6), { closed: true, cls: 'thin', hide: false });
  [[[-0.8, -0.7, 0], 'A'], [[0.9, -0.4, 0], 'B'], [[0.1, 0.9, 0], 'C']].forEach(([p, n]) => { v1.dot(p); v1.label(p, n); });
  v1.label([-1.5, -1.5, 0], 'α', { dx: 6, dy: -6 });
  v1.update();
  const v2 = smallView('bf2');
  v2.face(sq(1.6), { cls: 'f1' }); v2.curve(sq(1.6), { closed: true, cls: 'thin', hide: false });
  const A = [-1, -0.6, 0];
  const B = [0.7, 0.4, 0];
  v2.seg([lerp(A, B, -0.35), lerp(A, B, 1.4)], { cls: 'c1', hide: false });
  [[A, 'A'], [B, 'B']].forEach(([p, n]) => { v2.dot(p); v2.label(p, n); });
  v2.label([-1.5, -1.5, 0], 'α', { dx: 6, dy: -6 });
  v2.update();
  const v3 = smallView('bf3', { yaw: -35, pitch: 22 });
  v3.face(sq(1.6), { cls: 'f1' }); v3.curve(sq(1.6), { closed: true, cls: 'thin', hide: false });
  const beta = [[0, -1.6, -1.1], [0, 1.6, -1.1], [0, 1.6, 1.1], [0, -1.6, 1.1]];
  v3.face(beta, { cls: 'f2' }); v3.curve(beta, { closed: true, cls: 'thin', hide: false });
  v3.seg([[0, -1.6, 0], [0, 1.6, 0]], { cls: 'c1', hide: false });
  v3.dot([0, -0.7, 0], { cls: 'c2' }); v3.label([0, -0.7, 0], 'P', { dx: 8, dy: 18 });
  v3.label([0, 1.6, 0], 'l', { dx: 6, dy: -4 });
  v3.label([-1.5, -1.5, 0], 'α', { dx: 6, dy: -6 });
  v3.label([0, -1.6, 1.1], 'β', { dx: 6, dy: 18 });
  v3.update();
}

/* ---------- 第 5 页：例 2 截面交线 ---------- */
function initJiaox() {
  const { v, P } = boxView('jiaox', [2.4, 1.6, 1.6], { w: 480, h: 380, scale: 120 });
  const Pm = lerp(P.B, P['B₁'], 0.5);
  v.face([P['A₁'], P['C₁'], Pm], { cls: 'f2', show: on(3) });
  [[P['A₁'], Pm], [Pm, P['C₁']], [P['A₁'], P['C₁']]].forEach((s) => v.seg(s, { cls: 'c2', show: on(3) }));
  v.dot(Pm, { cls: 'c2' }); v.label(Pm, 'P', { dx: 8, dy: 6 });
  v.update();
}

/* ---------- 点选正方体里的线（第 6、11 页共用） ---------- */
const CUBE = 2;
const CP = boxPts([CUBE, CUBE, CUBE], false);
const CN = Object.keys(CP);
const ALL_SEGS = [];
CN.forEach((a, i) => CN.slice(i + 1).forEach((b) => ALL_SEGS.push([a, b])));
const isEdge = ([a, b]) => { const d = sub(CP[a], CP[b]); return [0, 1, 2].filter((k) => Math.abs(d[k]) > EPS).length === 1; };
const segName = ([a, b]) => `${a}${b}`;
function cubeTool(id, onPick) {
  const v = Solid3D.view($(id), { w: 480, h: 440, scale: 108, yaw: -28, pitch: 22, center: [1, 1, 1] });
  views.push(v);
  v.solid(boxVF(CP, (n) => `${n}₁`));
  ALL_SEGS.filter((s) => !isEdge(s)).forEach((s) => v.seg([CP[s[0]], CP[s[1]]], { cls: 'cand' }));
  const off = { A: [-20, 22], B: [6, 22], C: [8, 16], D: [-22, -4] };
  CN.forEach((n) => { const k = n[0]; v.label(CP[n], n, { dx: off[k][0], dy: n.length > 1 ? -8 : off[k][1] }); });
  // 区分“拖动旋转”和“点一下”：按下与松开相距不到 6 像素才算点选
  let down = null;
  v.svg.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  v.svg.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const m = v.svg.getScreenCTM().inverse();
    const pt = v.svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(m);
    const unitsPerPx = v.W / v.svg.getBoundingClientRect().width;
    let best = null;
    ALL_SEGS.forEach((s) => {
      const [x1, y1] = v.proj(CP[s[0]]);
      const [x2, y2] = v.proj(CP[s[1]]);
      const L2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
      const t = Math.max(0.08, Math.min(0.92, ((q.x - x1) * (x2 - x1) + (q.y - y1) * (y2 - y1)) / L2));
      const d = Math.hypot(q.x - (x1 + t * (x2 - x1)), q.y - (y1 + t * (y2 - y1)));
      if (d < 16 * unitsPerPx && (!best || d < best.d)) best = { s, d };
    });
    if (best) onPick(best.s);
  });
  return v;
}
// 常见的角给出精确值
const NICE = [[0, '0'], [1, '1'], [Math.SQRT2, '\\sqrt2'], [Math.SQRT1_2, '\\frac{\\sqrt2}{2}'], [Math.sqrt(3), '\\sqrt3'], [Math.sqrt(3) / 3, '\\frac{\\sqrt3}{3}'], [0.5, '\\frac12'], [Math.sqrt(3) / 2, '\\frac{\\sqrt3}{2}'], [Math.sqrt(6) / 3, '\\frac{\\sqrt6}{3}'], [2, '2']];
const nice = (x) => { const f = NICE.find(([v]) => Math.abs(v - x) < 1e-9); return f ? f[1] : fmt(x, 3); };
const degStr = (rad) => `${fmt(rad / DEG, 1)}^\\circ`;

/* ---------- 第 6 页：两条直线的位置关系 ---------- */
function lineRelation(s1, s2) {
  const [p1, q1] = [CP[s1[0]], CP[s1[1]]];
  const [p2, q2] = [CP[s2[0]], CP[s2[1]]];
  const d1 = sub(q1, p1);
  const d2 = sub(q2, p2);
  const c = cross(d1, d2);
  const cosv = Math.abs(dot(d1, d2)) / (norm(d1) * norm(d2));
  const ang = Math.acos(Math.min(1, cosv));
  if (norm(c) < EPS) return { kind: '平行', ang: 0, cosv };
  const coplanar = Math.abs(dot(sub(p2, p1), c)) < EPS;
  return { kind: coplanar ? '相交' : '异面', ang, cosv };
}
function initLL() {
  const s = { sel: [] };
  const v = cubeTool('ll', (seg) => {
    s.sel = s.sel.length >= 2 ? [seg] : [...s.sel, seg];
    v.update();
  });
  const L = (i) => () => s.sel[i] && [CP[s.sel[i][0]], CP[s.sel[i][1]]];
  v.seg(L(0), { cls: 'c2 wide', show: () => !!s.sel[0] });
  v.seg(L(1), { cls: 'c1 wide', show: () => !!s.sel[1] });
  // 异面时：把第二条线平移到经过第一条线的端点，显示所成角
  const moved = () => {
    const [a, b] = s.sel;
    const p = CP[a[0]];
    const d = sub(CP[b[1]], CP[b[0]]);
    const sign = dot(d, sub(CP[a[1]], CP[a[0]])) < 0 ? -1 : 1;
    return [p, add(p, mul(d, sign))];
  };
  const skew = () => s.sel.length === 2 && lineRelation(...s.sel).kind === '异面';
  v.seg(() => (skew() ? moved() : null), { cls: 'c3 mv', hide: false, show: skew });
  v.onUpdate = () => {
    const msg = $('llMsg');
    if (s.sel.length < 2) {
      msg.className = 'tip feedback';
      msg.innerHTML = s.sel.length ? `已选 <b class="o">${segName(s.sel[0])}</b>，再点一条线。` : '在正方体里点一条线（棱、面对角线或体对角线）。';
      return;
    }
    const [a, b] = s.sel;
    const r = lineRelation(a, b);
    const angTxt = r.kind === '平行' ? '' : `，所成角 $${degStr(r.ang)}$（$\\cos=${nice(r.cosv)}$）${Math.abs(r.ang - Math.PI / 2) < 1e-9 ? '，<b>互相垂直</b>' : ''}`;
    const extra = r.kind === '异面' ? '<br>绿色虚线：把第二条线<b>平移</b>到与第一条线相交，它们的夹角就是异面直线所成的角。' : '';
    msg.className = `tip feedback ${r.kind === '异面' ? 'fb-warn' : 'fb-ok'}`;
    msg.innerHTML = `<b class="o">${segName(a)}</b> 与 <b class="b">${segName(b)}</b>：<b>${r.kind}</b>${angTxt}。${extra}`;
    tex(msg);
  };
  const PRESET = [['A₁B₁ 与 BC', [['A₁', 'B₁'], ['B', 'C']]], ['BC₁ 与 AC', [['B', 'C₁'], ['A', 'C']]], ['A₁C 与 DD₁', [['A₁', 'C'], ['D', 'D₁']]], ['清空', []]];
  $('llBtns').innerHTML = PRESET.map(([t], i) => `<button type="button" class="btn" data-i="${i}">${t}</button>`).join('');
  $('llBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    s.sel = PRESET[+b.dataset.i][1].map((x) => [...x].sort((p, q) => CN.indexOf(p) - CN.indexOf(q)));
    v.update();
  });
  v.update();
}

/* ---------- 第 7 页：基本事实 4 例 1 + 等角定理 ---------- */
function initDJ() {
  const { v, P } = boxView('dj', [2.4, 1.8, 1.5], { w: 460, h: 330, scale: 100 });
  const E = lerp(P.A, P.B, 0.5);
  const F = lerp(P.B, P.C, 0.5);
  v.seg([P.A, P.C], { cls: 'c1', show: on(3) });
  v.seg([E, F], { cls: 'c2', show: on(2) });
  v.seg([P['A₁'], P['C₁']], { cls: 'c1', show: on(4) });
  v.face([E, P.B, F], { cls: 'f3', show: on(8) });
  v.face([P['A₁'], P['B₁'], P['C₁']], { cls: 'f3', show: on(8) });
  [[E, 'E', -8, 22], [F, 'F', 8, 14]].forEach(([p, n, dx, dy]) => { v.dot(p, { show: on(2) }); v.label(p, n, { dx, dy, show: on(2) }); });
  v.update();
}

/* ---------- 第 8 页：例 3 ---------- */
function initEx3() {
  const { v, P } = boxView('ex3', [2, 2, 2], { w: 380, h: 300, scale: 82 });
  v.seg([P.B, P['C₁']], { cls: 'c2' });
  v.seg([P.A, P.C], { cls: 'c1' });
  v.seg([P['A₁'], P['C₁']], { cls: 'c1', show: on(6) });
  v.seg([P['A₁'], P.B], { cls: 'c3', show: on(7) });
  v.face([P['A₁'], P.B, P['C₁']], { cls: 'f2', show: on(7) });
  const skewEdges = [['A₁', 'A'], ['A₁', 'B₁'], ['A₁', 'D₁'], ['D', 'A'], ['D', 'C'], ['D', 'D₁']];
  skewEdges.forEach(([a, b]) => v.seg([P[a], P[b]], { cls: 'c3', show: () => deckStep.n === 5 }));
  v.update();
}

/* ---------- 第 9 页：线面平行例 1 ---------- */
function initXM1() {
  const B = [-1.3, -0.7, 0];
  const C = [1.4, -0.5, 0];
  const D = [0.1, 1.1, 0];
  const A = [-0.1, 0, 1.9];
  const v = smallView('xm1', { w: 320, h: 230, scale: 80, center: [0, 0, 0.8], yaw: -15, pitch: 20 });
  v.solid({ V: [B, C, D, A], F: [[0, 2, 1], [0, 1, 3], [1, 2, 3], [2, 0, 3]] });
  v.face([B, C, D], { cls: 'f1' });
  const E = lerp(A, B, 0.5);
  const F = lerp(A, D, 0.5);
  v.seg([E, F], { cls: 'c2' });
  v.seg([B, D], { cls: 'c1' });
  [[A, 'A', 6, -6], [B, 'B', -18, 18], [C, 'C', 6, 18], [D, 'D', 6, -4], [E, 'E', -18, 4], [F, 'F', 6, -4]].forEach(([p, n, dx, dy]) => v.label(p, n, { dx, dy }));
  v.update();
}

/* ---------- 第 10 页：垂直于无数条直线 ≠ 垂直于平面 ---------- */
function initXC() {
  const s = { t: 0 };
  const v = Solid3D.view($('xc'), { w: 480, h: 330, scale: 92, yaw: -30, pitch: 22, center: [0, 0, 0.6] });
  views.push(v);
  v.face(sq(1.7), { cls: 'f1' }); v.curve(sq(1.7), { closed: true, cls: 'thin', hide: false });
  const N = [0.6, 0.8, 0];
  [-1.2, -0.6, 0.6, 1.2].forEach((y) => v.seg([[-1.6, y, 0], [1.6, y, 0]], { cls: 'thin fam', hide: false }));
  v.seg([[-1.6, 0, 0], [1.6, 0, 0]], { cls: 'c3', hide: false });
  v.seg([mul(N, -1.6), mul(N, 1.6)], { cls: 'c2', hide: false });
  const a = () => [0, -Math.sin(s.t * DEG), Math.cos(s.t * DEG)];
  v.seg(() => [[0, 0, 0], mul(a(), 1.9)], { cls: 'c1', hide: false });
  v.label(() => mul(a(), 1.9), 'a', { dx: 6, dy: 0 });
  v.label([1.6, 0, 0], 'm', { dx: 4, dy: 18 });
  v.label(mul(N, 1.6), 'n', { dx: 6, dy: 4 });
  v.label([-1.65, -1.65, 0], 'α', { dx: 6, dy: -6 });
  v.onUpdate = () => {
    const an = Math.acos(Math.abs(dot(a(), N)));
    const msg = $('xcMsg');
    msg.className = `tip feedback ${s.t === 0 ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = s.t === 0
      ? '$a\\perp m$，$a\\perp n$，$m,n$ 相交 ⇒ $a\\perp\\alpha$。'
      : `$a$ 仍垂直于 $m$ 及所有与 $m$ 平行的直线（<b>无数条</b>），但 $a$ 与 $n$ 成 $${degStr(an)}$ ⇒ $a$ <b>不</b>垂直于 $\\alpha$。`;
    tex(msg);
  };
  v.update();
  MathKit.slider($('xcT'), (t) => { s.t = t; $('xcTV').textContent = `${t}°`; v.update(); });
}

/* ---------- 第 11 页：线面关系与线面角 ---------- */
const PLANES = [
  ['平面 ABCD', ['A', 'B', 'C', 'D']],
  ['平面 A₁B₁C₁D₁', ['A₁', 'B₁', 'C₁', 'D₁']],
  ['平面 ABB₁A₁', ['A', 'B', 'B₁', 'A₁']],
  ['平面 BCC₁B₁', ['B', 'C', 'C₁', 'B₁']],
  ['平面 ADD₁A₁', ['A', 'D', 'D₁', 'A₁']],
  ['平面 ACC₁A₁', ['A', 'C', 'C₁', 'A₁']],
  ['平面 A₁BD', ['A₁', 'B', 'D']],
];
function lineVsPlane(seg, pl) {
  const [p, q] = [CP[seg[0]], CP[seg[1]]];
  const V = pl.map((n) => CP[n]);
  const n = cross(sub(V[1], V[0]), sub(V[2], V[0]));
  const dp = dot(sub(p, V[0]), n);
  const dq = dot(sub(q, V[0]), n);
  const d = sub(q, p);
  const sinv = Math.abs(dot(d, n)) / (norm(d) * norm(n));
  const foot = (x) => sub(x, mul(n, dot(sub(x, V[0]), n) / dot(n, n)));
  if (Math.abs(dp) < EPS && Math.abs(dq) < EPS) return { kind: '在平面内', ang: 0 };
  if (Math.abs(dot(d, n)) < EPS) return { kind: '平行', ang: 0 };
  if (Math.abs(sinv - 1) < 1e-9) return { kind: '垂直', ang: Math.PI / 2, proj: [foot(p), foot(q)] };
  return { kind: '斜交', ang: Math.asin(sinv), proj: [foot(p), foot(q)], feet: [[p, foot(p)], [q, foot(q)]] };
}
function initLP() {
  const s = { pl: 0, seg: ['A', 'D₁'] };
  const v = cubeTool('lp', (seg) => { s.seg = seg; v.update(); });
  v.face(() => PLANES[s.pl][1].map((n) => CP[n]), { cls: 'f1' });
  v.seg(() => [CP[s.seg[0]], CP[s.seg[1]]], { cls: 'c2 wide' });
  const rel = () => lineVsPlane(s.seg, PLANES[s.pl][1]);
  v.seg(() => rel().proj, { cls: 'c3 mv', hide: false, show: () => !!rel().proj });
  [0, 1].forEach((i) => v.seg(() => rel().feet && rel().feet[i], { cls: 'thin drop', hide: false, show: () => !!rel().feet }));
  v.onUpdate = () => {
    const r = rel();
    const msg = $('lpMsg');
    const nm = segName(s.seg);
    const pl = PLANES[s.pl][0];
    const angTxt = r.kind === '斜交' ? `是斜线，射影为绿色虚线，所成角 $${degStr(r.ang)}$（$\\tan=${nice(Math.tan(r.ang))}$）` : r.kind === '垂直' ? '<b>垂直</b>，所成角 $90^\\circ$' : `<b>${r.kind}</b>，所成角 $0^\\circ$`;
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `直线 <b class="o">${nm}</b> 与${pl}：${angTxt}。`;
    tex(msg);
  };
  $('lpBtns').innerHTML = PLANES.map(([t], i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${t}</button>`).join('');
  $('lpBtns').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    s.pl = +b.dataset.i;
    $('lpBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    v.update();
  });
  v.update();
}

/* ---------- 第 12 页：面面平行例 1 ---------- */
function initMP() {
  const { v, P } = boxView('mp', [2.4, 1.6, 1.5], { prime: true, w: 400, h: 300, scale: 90 });
  v.face([P['C′'], P.D, P.B], { cls: 'f2', show: on(3) });
  v.face([P.A, P['B′'], P['D′']], { cls: 'f1', show: on(3) });
  [[P['C′'], P.D], [P.D, P.B], [P.B, P['C′']]].forEach((x) => v.seg(x, { cls: 'c2', show: on(3) }));
  [[P.A, P['B′']], [P['B′'], P['D′']], [P['D′'], P.A]].forEach((x) => v.seg(x, { cls: 'c1', show: on(3) }));
  v.update();
}

/* ---------- 第 13 页：二面角翻折 ---------- */
function initFold() {
  const s = { t: 60, o: 0 };
  const W = 1.8;
  const L = 1.7;
  const v = Solid3D.view($('fold'), { w: 520, h: 420, scale: 110, yaw: -24, pitch: 20, center: [0, -0.3, 0.5] });
  views.push(v);
  const u2 = () => [0, -Math.cos(s.t * DEG), Math.sin(s.t * DEG)];
  const U1 = [0, -1, 0];
  const half = (u) => [[-L, 0, 0], [L, 0, 0], add([L, 0, 0], mul(u, W)), add([-L, 0, 0], mul(u, W))];
  v.face(half(U1), { cls: 'f1' }); v.curve(half(U1), { closed: true, cls: 'thin', hide: false });
  v.face(() => half(u2()), { cls: 'f2' }); v.curve(() => half(u2()), { closed: true, cls: 'thin', hide: false });
  v.seg([[-L - 0.3, 0, 0], [L + 0.3, 0, 0]], { cls: 'e', hide: false });
  const O = () => [s.o, 0, 0];
  const R = 1.3;
  v.seg(() => [O(), add(O(), mul(U1, R))], { cls: 'c1', hide: false });
  v.seg(() => [O(), add(O(), mul(u2(), R))], { cls: 'c2', hide: false });
  // 直角符号：OA ⊥ l，OB ⊥ l
  const K = 0.16;
  const mark = (u) => () => [add(O(), [K, 0, 0]), add(O(), add([K, 0, 0], mul(u(), K))), add(O(), mul(u(), K))];
  v.curve(mark(() => U1), { cls: 'thin', hide: false });
  v.curve(mark(u2), { cls: 'thin', hide: false });
  // 平面角的弧
  v.curve(() => Array.from({ length: 31 }, (_, i) => { const a = (s.t * DEG * i) / 30; return add(O(), [0, -0.45 * Math.cos(a), 0.45 * Math.sin(a)]); }), { cls: 'c3', hide: false, show: () => s.t > 0 });
  v.dot(O); v.label(O, 'O', { dx: -6, dy: 22 });
  v.label(() => add(O(), mul(U1, R)), 'A', { dx: -18, dy: 18 });
  v.label(() => add(O(), mul(u2(), R)), 'B', { dx: 6, dy: -4 });
  v.label([L + 0.3, 0, 0], 'l', { dx: 6, dy: 4 });
  v.label(add([-L, 0, 0], mul(U1, W)), 'α', { dx: 8, dy: -8 });
  v.label(() => add([-L, 0, 0], mul(u2(), W)), 'β', { dx: 8, dy: 20 });
  v.onUpdate = () => {
    const ang = Math.acos(Math.max(-1, Math.min(1, dot(U1, u2())))) / DEG;
    const msg = $('fdMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$OA\\perp l$，$OB\\perp l$，平面角 $\\angle AOB=${fmt(ang, 1)}^\\circ$${Math.abs(ang - 90) < 1e-9 ? '——<b>直二面角</b>' : ''}。移动点 $O$，平面角不变。`;
    tex(msg);
  };
  v.update();
  MathKit.slider($('fdT'), (t) => { s.t = t; $('fdTV').textContent = `${t}°`; v.update(); });
  MathKit.slider($('fdO'), (o) => { s.o = o; $('fdOV').textContent = fmt(o, 2); v.update(); });
}

/* ---------- 第 14 页：面面垂直例 4 ---------- */
function initMZ() {
  const { v, P } = boxView('mz', [2, 2, 2], { prime: true, w: 380, h: 300, scale: 80 });
  v.face([P["A′"], P["C′"], P.C, P.A], { cls: 'f1' });
  v.face([P["B′"], P["D′"], P.D, P.B], { cls: 'f2' });
  v.seg([P.B, P.D], { cls: 'c2', show: on(3) });
  v.seg([P.A, P.C], { cls: 'c1', show: on(3) });
  v.seg([P.A, P["A′"]], { cls: 'c1', show: on(3) });
  v.update();
}

window.LESSON = {
  init() {
    initBasics();
    initJiaox();
    initLL();
    initDJ();
    initEx3();
    initXM1();
    initXC();
    initLP();
    initMP();
    initFold();
    initMZ();
  },
  onRender(slide, step) {
    deckStep.n = step;
    views.forEach((v) => { if (slide.contains(v.svg)) v.update(); });
  },
};
