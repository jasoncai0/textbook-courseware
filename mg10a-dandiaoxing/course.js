'use strict';
/* 高一上 5.3 函数的单调性 · 本课互动：气温图上任取两点、任取两点检验器（随机抽 100 对）、
 * 例 1 图象、反例图、最大值的两个条件、例 3 图象读最值与单调区间、例 4/例 5 图象。通用部分见 ../shared/math.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 保单调的三次插值（Fritsch–Butland）：相邻节点之间不会多出“鼓包”，极值恰好落在节点上 ---------- */
function monoSpline(pts) {
  const n = pts.length;
  const h = pts.slice(1).map(([x], i) => x - pts[i][0]);
  const d = pts.slice(1).map(([, y], i) => (y - pts[i][1]) / h[i]);
  const m = pts.map((_, k) => {
    if (k === 0) return d[0];
    if (k === n - 1) return d[n - 2];
    const [a, b] = [d[k - 1], d[k]];
    if (a * b <= 0) return 0;
    const w1 = 2 * h[k] + h[k - 1];
    const w2 = h[k] + 2 * h[k - 1];
    return (w1 + w2) / (w1 / a + w2 / b);
  });
  return (x) => {
    if (x < pts[0][0] || x > pts[n - 1][0]) return NaN;
    const after = pts.findIndex(([px]) => px > x);
    const i = after < 0 ? n - 2 : after - 1;
    const t = (x - pts[i][0]) / h[i];
    const [y0, y1] = [pts[i][1], pts[i + 1][1]];
    const t2 = t * t;
    const t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * h[i] * m[i] + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * h[i] * m[i + 1];
  };
}

/* 气温：依课本图 5-3-1 描点；0–4 时下降，4–14 时上升，14–24 时下降 */
const TEMP_PTS = [[0, -0.5], [2, -1.6], [4, -2], [6, -1.2], [8, 1.2], [10, 4.3], [12, 7.4], [14, 9], [15, 7.9], [16, 7.6], [18, 7.4], [20, 4.4], [22, 0.4], [24, -1.6]];
const tempAt = monoSpline(TEMP_PTS);

/* 例 3：依课本图 5-3-4 描点；最高点 (3,3)、最低点 (−1.5,−2)，转折点 x = −1.5, 3, 5, 6 */
const EX3_PTS = [[-4, 1.2], [-3, 0], [-2, -1.7], [-1.5, -2], [-1, -1.8], [0, -0.9], [1, 0.6], [2, 2.2], [3, 3], [4, 1.8], [5, 0.9], [5.5, 1.4], [6, 1.7], [6.5, 1.1], [7, -1]];
const ex3At = monoSpline(EX3_PTS);
const EX3_PIECES = [[-4, -1.5, '减'], [-1.5, 3, '增'], [3, 5, '减'], [5, 6, '增'], [6, 7, '减']];

/* ---------- 任取两点：一块画板 + 区间 I + 两个可拖动的点 ---------- */
const SNAP = 100; // 拖动时 x 取到 0.01
const snap = (x) => Math.round(x * SNAP) / SNAP;
const EPS = 1e-9;
const relOf = (a, b) => (Math.abs(a - b) < EPS ? '=' : a < b ? '<' : '>');
const REL_TEX = { '<': '\\lt', '>': '\\gt', '=': '=' };

// def: { f, x:[..], y:[..], h, pieces:[[from,to]], marks:[{p, hollow}], labels, ticks }
function pairBoard(host, def, I0, onChange) {
  const [Y0, Y1] = def.y;
  const s = { I: I0, u: 0, v: 0 };
  const b = board(host, { x: def.x, y: def.y, w: def.w || 600, h: def.h, ticks: def.ticks, labels: def.labels });
  const lo = () => s.I.a;
  const hi = () => (s.I.openR ? s.I.b - 1 / SNAP : s.I.b);
  b.poly(() => [[s.I.a, Y0], [s.I.b, Y0], [s.I.b, Y1], [s.I.a, Y1]], { cls: 'band' });
  const pieces = def.pieces || [[def.x[0], def.x[1]]];
  pieces.forEach(([p, q]) => {
    b.fn(def.f, { from: p, to: q, cls: 'thin', n: 800 });
    const from = () => Math.min(q, Math.max(p, s.I.a));
    b.fn(def.f, { from, to: () => Math.max(from(), Math.min(q, s.I.b)), cls: 'c1', n: 800 });
  });
  (def.marks || []).forEach((m) => b.pt(m.p, { hollow: m.hollow, r: 6 }));
  const P = () => [Math.min(s.u, s.v), def.f(Math.min(s.u, s.v))];
  const Q = () => [Math.max(s.u, s.v), def.f(Math.max(s.u, s.v))];
  const ax = Math.max(0, def.x[0]);
  const ay = Math.max(0, Y0);
  [P, Q].forEach((g) => {
    b.seg(() => [[g()[0], ay], g()], { cls: 'dash' });
    b.seg(() => [[ax, g()[1]], g()], { cls: 'dash' });
  });
  b.text(() => [P()[0], ay], def.names ? def.names[0] : 'x₁', { cls: 'lb sub', dx: -8, dy: 46 });
  b.text(() => [Q()[0], ay], def.names ? def.names[1] : 'x₂', { cls: 'lb sub', dx: -8, dy: 46 });
  b.text(P, 'P', { dx: -24, dy: -8 });
  b.text(Q, 'Q', { dx: 10, dy: -8 });
  const clamp = (x) => snap(Math.min(hi(), Math.max(lo(), x)));
  b.drag(() => [s.u, def.f(s.u)], (x) => { s.u = clamp(x); });
  b.drag(() => [s.v, def.f(s.v)], (x) => { s.v = clamp(x); });
  b.onUpdate = () => onChange(s);
  const api = {
    b,
    s,
    setI(I) { s.I = I; api.setPair(I.a + (I.b - I.a) * 0.3, I.a + (I.b - I.a) * 0.7); },
    setPair(u, v) { s.u = clamp(u); s.v = clamp(v); b.update(); },
  };
  api.setI(I0);
  return api;
}

// 读数：x₁、x₂、f(x₁)、f(x₂) 和不等号；names = [自变量, 第一个函数值, 第二个函数值] 的 TeX
function pairReadout(s, f, names = ['x', 'f(x_1)', 'f(x_2)']) {
  const [x1, x2] = [Math.min(s.u, s.v), Math.max(s.u, s.v)];
  if (x1 === x2) return { rel: '=', html: `两点重合了：把它们拖开，让 $${names[0]}_1\\lt ${names[0]}_2$。` };
  const [y1, y2] = [f(x1), f(x2)];
  const rel = relOf(y1, y2);
  const [X, F1, F2] = names;
  return {
    rel,
    html: `$${X}_1=${fmt(x1)}\\lt ${X}_2=${fmt(x2)}$　时<br>$${F1}=${fmt(y1, 3)}\\ ${REL_TEX[rel]}\\ ${F2}=${fmt(y2, 3)}$`,
  };
}

/* 第 3 页：气温变化图（图 5-3-1） */
function initTempStatic() {
  const b = board($('tempS'), { x: [-1.5, 26.5], y: [-3.5, 11], w: 640, h: 330, ticks: [2, 2], labels: ['t/h', 'θ/℃'] });
  b.fn(tempAt, { from: 0, to: 24 });
  b.seg([[14, 0], [14, 9]], { cls: 'dash' });
  b.seg([[0, 9], [14, 9]], { cls: 'dash' });
  b.seg([[0, -2], [4, -2]], { cls: 'dash' });
  b.update();
  return b;
}

/* 第 4 页：气温图上任取两点 */
const TEMP_I = [
  { key: '4-14', a: 4, b: 14, label: '$[4,14]$' },
  { key: '14-24', a: 14, b: 24, label: '$[14,24]$' },
  { key: '0-24', a: 0, b: 24, label: '$[0,24]$' },
];
function initTemp() {
  const def = { f: tempAt, x: [-1.5, 26.5], y: [-3.5, 11], w: 640, h: 330, ticks: [2, 2], labels: ['t/h', 'θ/℃'], pieces: [[0, 24]], names: ['t₁', 't₂'] };
  const show = (s) => {
    const r = pairReadout(s, tempAt, ['t', '\\theta_1', '\\theta_2']);
    const msg = $('tpMsg');
    msg.innerHTML = r.html;
    msg.className = `tip feedback ${r.rel === '<' ? 'fb-ok' : r.rel === '>' ? 'fb-down' : ''}`;
    tex(msg);
  };
  const pb = pairBoard($('tp'), def, TEMP_I[0], show);
  $('tpBtns').innerHTML = TEMP_I.map((I, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-k="${I.key}">${I.label}</button>`).join('');
  tex($('tpBtns'));
  $('tpBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $('tpBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    pb.setI(TEMP_I.find((I) => I.key === btn.dataset.k));
  });
  return pb;
}

/* 第 6 页：任取两点检验器 */
const cubic = (x) => x ** 3 - 6 * x * x + 9 * x;
const jump = (x) => (x < 2 ? x + 1 : x - 1.5);
const DENT = { c: 2.5, w: 0.08, d: 0.15 }; // 在 [2.42, 2.58] 上有一个深 0.15 的小凹坑
const dent = (x) => 0.5 * x + 1 - DENT.d * Math.max(0, 1 - Math.abs(x - DENT.c) / DENT.w);
const CK_FNS = [
  { key: 'sq', label: '① $f(x)=x^2$', f: (x) => x * x, x: [-2.8, 3.6], y: [-1, 9.6], h: 380, ticks: [1, 2],
    I: [{ a: 0, b: 3, label: '$[0,3]$' }, { a: -2, b: 0, label: '$[-2,0]$' }, { a: -2, b: 3, label: '$[-2,3]$' }] },
  { key: 'cu', label: '② $f(x)=x^3-6x^2+9x$', f: cubic, x: [-0.7, 4.6], y: [-0.8, 5], h: 380,
    I: [{ a: 0, b: 4, label: '$[0,4]$' }, { a: 1, b: 3, label: '$[1,3]$' }, { a: 3, b: 4, label: '$[3,4]$' }] },
  { key: 'jp', label: '③ 分段函数（$x=2$ 处跳一下）', f: jump, x: [-0.7, 4.6], y: [-0.8, 3.6], h: 380, pieces: [[-0.7, 2 - 1e-6], [2, 4.6]],
    marks: [{ p: [2, 3], hollow: true }, { p: [2, 0.5] }],
    I: [{ a: 0, b: 4, label: '$[0,4]$' }, { a: 0, b: 2, openR: true, label: '$[0,2)$' }, { a: 2, b: 4, label: '$[2,4]$' }] },
  { key: 'dt', label: '④ 看起来像一条直线', f: dent, x: [-0.7, 4.6], y: [-0.8, 3.6], h: 380,
    I: [{ a: 0, b: 4, label: '$[0,4]$' }, { a: 0, b: 2, label: '$[0,2]$' }] },
];
const SAMPLES = 100;

function sampleCount(f, I) {
  const hiX = I.openR ? I.b - 1e-6 : I.b;
  const cnt = { '<': 0, '>': 0, '=': 0 };
  let bad = null;
  for (let i = 0; i < SAMPLES; i++) {
    const p = I.a + Math.random() * (hiX - I.a);
    const q = I.a + Math.random() * (hiX - I.a);
    const [x1, x2] = [Math.min(p, q), Math.max(p, q)];
    const r = relOf(f(x1), f(x2));
    cnt[r] += 1;
    if (!bad && r !== '<') bad = [x1, x2, r];
  }
  return { cnt, bad };
}

function sampleVerdict(cnt) {
  const n = `抽了 ${SAMPLES} 对 $x_1\\lt x_2$：$f(x_1)\\lt f(x_2)$ 有 <b>${cnt['<']}</b> 对，$f(x_1)\\gt f(x_2)$ 有 <b>${cnt['>']}</b> 对。`;
  if (cnt['<'] && cnt['>']) return { cls: 'warn', html: `${n}<br>两种情况都出现了：在 $I$ 上<b>既不是增函数，也不是减函数</b>。<b>一个反例</b>就够否定。` };
  const all = cnt['<'] ? '&lt;' : '&gt;';
  return { cls: 'ok', html: `${n}<br>${SAMPLES} 对全部是“${all}”。能断定吗？<b>不能！</b>“任意”有无穷多对，抽样只能<b>支持</b>猜想，不能<b>证明</b>它。` };
}

function initChecker() {
  const st = { fn: CK_FNS[0], I: CK_FNS[0].I[0] };
  const msg = $('ckMsg');
  const say = (cls, html) => { msg.className = `tip feedback ${cls ? `fb-${cls}` : ''}`; msg.innerHTML = html; tex(msg); };
  const live = (s) => {
    if (s !== st.cur?.s) return;
    const r = pairReadout(s, st.fn.f);
    $('ckRead').innerHTML = r.html;
    tex($('ckRead'));
  };
  const boards = Object.fromEntries(CK_FNS.map((d) => {
    const host = document.createElement('div');
    host.className = 'ck-b';
    host.dataset.k = d.key;
    $('ckBoards').appendChild(host);
    return [d.key, pairBoard(host, d, d.I[0], live)];
  }));
  const fnBtns = $('ckFn');
  const iBtns = $('ckI');
  const paintI = () => {
    iBtns.innerHTML = '区间 $I$：' + st.fn.I.map((I, i) => `<button type="button" class="btn${I === st.I ? ' solid' : ''}" data-i="${i}">${I.label}</button>`).join('');
    tex(iBtns);
  };
  const pick = (fn, I) => {
    st.fn = fn; st.I = I; st.cur = boards[fn.key];
    $('ckBoards').querySelectorAll('.ck-b').forEach((h) => { h.hidden = h.dataset.k !== fn.key; });
    fnBtns.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x.dataset.k === fn.key));
    paintI();
    st.cur.setI(I);
    say('', '拖动 $P$、$Q$ 多试几对；也可以点“只比较端点”或“随机抽 100 对”。');
  };
  fnBtns.innerHTML = CK_FNS.map((d) => `<button type="button" class="btn" data-k="${d.key}">${d.label}</button>`).join('');
  tex(fnBtns);
  fnBtns.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (btn) { const fn = CK_FNS.find((d) => d.key === btn.dataset.k); pick(fn, fn.I[0]); }
  });
  iBtns.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (btn) pick(st.fn, st.fn.I[+btn.dataset.i]);
  });
  $('ckEnds').addEventListener('click', () => {
    const { a, b, openR } = st.I;
    st.cur.setPair(a, openR ? b - 1 / SNAP : b);
    const r = relOf(st.fn.f(st.cur.s.u), st.fn.f(st.cur.s.v));
    say('', `只比较两个端点：$f(${fmt(a)})\\ ${REL_TEX[r]}\\ f(${fmt(st.cur.s.v)})$。能凭这一对就下结论吗？`);
  });
  $('ckRand').addEventListener('click', () => {
    const { cnt, bad } = sampleCount(st.fn.f, st.I);
    const v = sampleVerdict(cnt);
    if (bad && cnt['<'] && cnt['>']) st.cur.setPair(bad[0], bad[1]);
    say(v.cls, v.html + (bad && cnt['<'] && cnt['>'] ? '（$P$、$Q$ 已移到抽到的第一个反例上。）' : ''));
  });
  pick(CK_FNS[0], CK_FNS[0].I[0]);
  return () => st.cur.b.update();
}

/* 第 7 页：例 1 两个图象（增的部分蓝色，减的部分橙色） */
function initEx1() {
  const f = (x) => 2 - x * x;
  const b1 = board($('ex1a'), { x: [-2.8, 2.8], y: [-2.6, 3], w: 420 });
  b1.fn(f, { from: -2.8, to: 0, cls: 'c1' });
  b1.fn(f, { from: 0, to: 2.8, cls: 'c2' });
  b1.pt([0, 2]);
  b1.update();
  const b2 = board($('ex1b'), { x: [-3.2, 3.2], y: [-3.2, 3.2], w: 420 });
  b2.fn((x) => (x === 0 ? NaN : 1 / x), { cls: 'c2', n: 800 });
  b2.seg([[1, 0], [1, 1]], { cls: 'dash' });
  b2.seg([[0, 1], [1, 1]], { cls: 'dash' });
  b2.seg([[-1, 0], [-1, -1]], { cls: 'dash' });
  b2.seg([[0, -1], [-1, -1]], { cls: 'dash' });
  b2.pt([-1, -1], { cls: 'c2', r: 7 });
  b2.pt([1, 1], { cls: 'c2', r: 7 });
  b2.text([-1, -1], '(−1, −1)', { cls: 'lb up', dx: -60, dy: 28 });
  b2.text([1, 1], '(1, 1)', { cls: 'lb up', dx: 8, dy: -10 });
  b2.update();
  return [b1, b2];
}

/* 第 8 页：练习 8(4) 的反例：x ≤ 0 时 f(x)=x，x > 0 时 f(x)=x−1 */
function initCounter() {
  const b = board($('ctr'), { x: [-2.2, 2.6], y: [-2.2, 1.4], w: 460 });
  b.fn((x) => x, { from: -2.2, to: 0 });
  b.fn((x) => x - 1, { from: 0.0001, to: 2.6 });
  b.pt([0, 0], { r: 6 });
  b.pt([0, -1], { hollow: true, r: 6 });
  b.update();
  return b;
}

/* 第 11 页：最大值的两个条件——拖动水平线 y = M */
function initMax() {
  const f = (x) => 2 - x * x;
  const s = { M: 3 };
  const b = board($('mx'), { x: [-2.6, 2.6], y: [-2.4, 4], w: 460 });
  b.fn(f);
  b.seg(() => [[-2.6, s.M], [2.6, s.M]], { cls: 'c2' });
  b.pt(() => (Math.abs(s.M - 2) < EPS ? [0, 2] : null), { cls: 'c2', r: 8 });
  b.text(() => [2.6, s.M], () => `y = ${fmt(s.M, 1)}`, { cls: 'lb up', dx: -78, dy: -10 });
  b.drag(() => [-2.1, s.M], (x, y) => { s.M = Math.round(Math.min(3.8, Math.max(-2, y)) * 10) / 10; });
  b.onUpdate = () => {
    const allBelow = s.M >= 2 - EPS; // f(x) = 2 − x² 的值域是 (−∞, 2]
    const reached = s.M <= 2 + EPS;
    const mark = (ok) => (ok ? '<b class="ok">✓</b>' : '<b class="no">✗</b>');
    $('mxMsg').innerHTML = `$M=${fmt(s.M, 1)}$<br>${mark(allBelow)} ① 对任意 $x$，都有 $f(x)\\le M$<br>${mark(reached)} ② 存在 $x_0$，使 $f(x_0)=M$`
      + `<br>${allBelow && reached ? '<b>两条都满足：$M=2=f(0)$ 就是最大值。</b>' : '两条没有同时满足，$M$ 不是最大值。'}`;
    tex($('mxMsg'));
  };
  b.update();
  return b;
}

/* 第 12 页：例 3，沿图象拖动一个点 */
function initEx3() {
  const s = { x: 0.5 };
  const b = board($('ex3'), { x: [-4.6, 7.8], y: [-3.1, 3.6], w: 680 });
  b.fn(ex3At, { from: -4, to: 7, n: 600 });
  b.seg([[0, 3], [3, 3]], { cls: 'dash' });
  b.seg([[3, 0], [3, 3]], { cls: 'dash' });
  b.seg([[0, -2], [-1.5, -2]], { cls: 'dash' });
  b.seg([[-1.5, 0], [-1.5, -2]], { cls: 'dash' });
  [[-4, ex3At(-4)], [7, ex3At(7)]].forEach((p) => b.pt(p, { r: 6 }));
  b.pt([3, 3], { cls: 'c2', r: 8 });
  b.pt([-1.5, -2], { cls: 'c2', r: 8 });
  b.text([3, 3], '(3, 3)', { cls: 'lb up', dx: 10, dy: -10 });
  b.text([-1.5, -2], '(−1.5, −2)', { cls: 'lb up', dx: -40, dy: 34 });
  b.drag(() => [s.x, ex3At(s.x)], (x) => { s.x = snap(Math.min(7, Math.max(-4, x))); });
  b.onUpdate = () => {
    const pc = EX3_PIECES.find(([p, q]) => s.x >= p && s.x <= q);
    $('ex3V').innerHTML = `点 $(${fmt(s.x)},\\ ${fmt(ex3At(s.x))})$　在${pc[2]}区间 $[${pc[0]},${pc[1]}]$ 上`;
    tex($('ex3V'));
  };
  b.update();
  return b;
}

/* 第 13 页：例 4 两个图象 */
function initEx4() {
  const b1 = board($('ex4a'), { x: [-1.4, 3.4], y: [-1.6, 3.2], w: 400 });
  b1.fn((x) => x * x - 2 * x);
  b1.seg([[1, 0], [1, -1]], { cls: 'dash' });
  b1.pt([1, -1], { cls: 'c2', r: 8 });
  b1.text([1, -1], '(1, −1)', { cls: 'lb up', dx: 12, dy: 10 });
  b1.update();
  const b2 = board($('ex4b'), { x: [-0.4, 3.6], y: [-0.25, 1.35], w: 400, h: 220, ticks: [1, 1 / 3], tickLabels: false });
  b2.fn((x) => 1 / x, { from: 0.72, to: 3.6, cls: 'thin' });
  b2.fn((x) => 1 / x, { from: 1, to: 3 });
  b2.seg([[3, 0], [3, 1 / 3]], { cls: 'dash' });
  b2.seg([[1, 0], [1, 1]], { cls: 'dash' });
  b2.pt([1, 1], { r: 7 });
  b2.pt([3, 1 / 3], { cls: 'c2', r: 8 });
  b2.text([1, 1], '(1, 1)', { cls: 'lb up', dx: 10, dy: -6 });
  b2.text([3, 1 / 3], '(3, 1/3)', { cls: 'lb up', dx: -30, dy: -16 });
  [1, 2, 3].forEach((x) => b2.text([x, 0], String(x), { cls: 'tk', dx: -4, dy: 20 }));
  [[1 / 3, '1/3'], [1, '1']].forEach(([y, t]) => b2.text([0, y], t, { cls: 'tk', dx: -30, dy: 5 }));
  b2.update();
  return [b1, b2];
}

/* 第 14 页：例 5 示意（[a, c] 上增、[c, b] 上减） */
const EX5_PTS = [[0.6, 1], [1.6, 2], [2.6, 2.9], [3.4, 2.4], [4.6, 1.3]];
function initEx5() {
  const f = monoSpline(EX5_PTS);
  const b = board($('ex5'), { x: [-1.1, 5.2], y: [-0.5, 3.5], w: 460, ticks: 0 });
  b.fn(f, { from: 0.6, to: 2.6, cls: 'c1' });
  b.fn(f, { from: 2.6, to: 4.6, cls: 'c2' });
  b.seg([[2.6, 0], [2.6, 2.9]], { cls: 'dash' });
  b.seg([[0, 2.9], [2.6, 2.9]], { cls: 'dash' });
  b.pt([2.6, 2.9], { cls: 'c2', r: 8 });
  [[0.6, 'a'], [2.6, 'c'], [4.6, 'b']].forEach(([x, n]) => { b.pt([x, 0], { r: 4 }); b.text([x, 0], n, { dx: -6, dy: 26 }); });
  b.text([0, 2.9], 'f(c)', { cls: 'lb', dx: -52, dy: 8 });
  b.update();
  return b;
}

let redraws = [];
window.LESSON = {
  init() {
    const all = [initTempStatic(), initTemp().b, initChecker(), ...initEx1(), initCounter(), initMax(), initEx3(), ...initEx4(), initEx5()];
    redraws = all.map((x) => (typeof x === 'function' ? x : () => x.update()));
  },
  // 画板里的点和文字按屏幕像素定大小：翻到这一页时重新量一次
  onRender(slide) {
    if (!slide.querySelector('.mboard')) return;
    requestAnimationFrame(() => redraws.forEach((r) => r()));
    setTimeout(() => redraws.forEach((r) => r()), 750);
  },
};
