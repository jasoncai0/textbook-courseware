'use strict';
/* 七下 11.2 不等式的解集 · 本课互动：按比例的隧道、解的探测器、数轴画解集、课本插图。通用部分见 ../shared/math.js、numline.js、ineq.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const mk = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  parent.appendChild(e);
  return e;
};
const m = NumLine.minus;
const tn = (v) => String(+v.toFixed(2)); // TeX 里用普通减号

/* 第 3 页：隧道与汽车，同一比例（1 m = 40 px），隧道净高 4.2 m */
const PX = 40;
const GROUND = 214;
const LIMIT = 4.2;
function initTunnel() {
  const svg = $('tunnel');
  const top = GROUND - LIMIT * PX;
  mk('rect', { x: 190, y: top - 26, width: 180, height: 26, fill: '#b9c3cc' }, svg);
  mk('rect', { x: 190, y: top, width: 18, height: LIMIT * PX, fill: '#cfd8df' }, svg);
  mk('rect', { x: 208, y: top, width: 162, height: LIMIT * PX, fill: '#3b4652', opacity: 0.18 }, svg);
  mk('line', { x1: 0, x2: 380, y1: GROUND, y2: GROUND, stroke: '#556575', 'stroke-width': 2 }, svg);
  mk('line', { x1: 20, x2: 190, y1: top, y2: top, stroke: '#c0392b', 'stroke-width': 1.5, 'stroke-dasharray': '6 4' }, svg);
  // 净高标注
  mk('line', { x1: 352, x2: 352, y1: top + 2, y2: GROUND - 2, stroke: '#1d6fa5', 'stroke-width': 1.5, 'marker-start': 'url(#ar)', 'marker-end': 'url(#ar)' }, svg);
  const defs = mk('defs', {}, svg);
  const mkr = mk('marker', { id: 'ar', viewBox: '0 0 10 10', refX: 5, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  mk('path', { d: 'M0 0 L10 5 L0 10 z', fill: '#1d6fa5' }, mkr);
  mk('text', { x: 300, y: (top + GROUND) / 2, class: 'tn-lb' }, svg).textContent = '4.2 m';
  const car = mk('rect', { x: 50, width: 110, rx: 6 }, svg);
  const lab = mk('text', { x: 105, class: 'tn-car' }, svg);
  const msg = $('hMsg');
  const show = (h) => {
    car.setAttribute('y', GROUND - h * PX);
    car.setAttribute('height', h * PX);
    const ok = h <= LIMIT;
    car.setAttribute('fill', ok ? '#4f9bd0' : '#e07a6a');
    lab.setAttribute('y', GROUND - (h * PX) / 2 + 6);
    lab.textContent = `${h} m`;
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = ok
      ? `$x=${h}$：$${h}\\le 4.2$ 成立，${h === LIMIT ? '恰好等于限高，' : ''}可以通过．`
      : `$x=${h}$：$${h}\\le 4.2$ 不成立，车顶高过红色虚线，不能通过．`;
    tex(msg);
    $('hBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', +x.dataset.h === h));
  };
  $('hBtns').addEventListener('click', (e) => { const b = e.target.closest('[data-h]'); if (b) show(+b.dataset.h); });
  show(3);
}

/* 第 4 页：解的探测器 */
const PROBES = [
  { f: (x) => x - 3 > 0, v: (x) => x - 3, k: 3, cmp: '\\gt', set: { a: 3, op: '>' } },
  { f: (x) => x - 4 <= 0, v: (x) => x - 4, k: 4, cmp: '\\le', set: { a: 4, op: '<=' } },
];
const P_FROM = -3;
const P_TO = 8;
const SLOTS = 140;
function initProbe() {
  let st = { q: 0, x: 3.5, tested: [], showSet: false };
  const b = NumLine.board($('probe'), { from: P_FROM, to: P_TO, y: [-1.1, 2.2], h: 200 });
  NumLine.axis(b, { from: P_FROM, to: P_TO });
  const Y_DOT = 0.75;
  const nth = (i, ok) => () => { const t = st.tested[i]; return t !== undefined && PROBES[st.q].f(t) === ok ? [t, Y_DOT] : null; };
  for (let i = 0; i < SLOTS; i++) {
    b.pt(nth(i, true), { r: 4.5, cls: 'ok-dot' });
    b.pt(nth(i, false), { r: 4.5, cls: 'no-dot' });
  }
  Ineq.ray(b, { a: () => PROBES[st.q].set.a, op: () => PROBES[st.q].set.op, h: 1.5, from: P_FROM - 0.4, to: P_TO + 0.5, show: () => st.showSet, cls: 'iq-ray r1', dot: 'r1' });
  b.text(() => [st.x, 0], () => m(st.x), { cls: 'nl-or', dy: -18 });
  b.drag(() => [st.x, 0], (x) => { st = { ...st, x: Math.min(P_TO, Math.max(P_FROM, Math.round(x * 2) / 2)) }; });
  const msg = $('prMsg');
  const say = (html, cls) => { msg.className = `tip feedback ${cls}`; msg.innerHTML = html; tex(msg); };
  const testOne = () => {
    const P = PROBES[st.q];
    const x = st.x;
    const ok = P.f(x);
    st = { ...st, tested: [...st.tested.filter((t) => t !== x), x].slice(-SLOTS) };
    const d = tn(P.v(x));
    say(`$x=${tn(x)}$：$${tn(x)}-${P.k}=${d}$，$${d}${P.cmp} 0$ ${ok ? '<b>成立</b>，是解 ✓' : '<b>不成立</b>，不是解 ✗'}`, ok ? 'fb-ok' : 'fb-warn');
    b.update();
  };
  $('prTest').addEventListener('click', testOne);
  $('prMany').addEventListener('click', () => {
    const xs = Array.from({ length: Math.round((P_TO - P_FROM) / 0.1) + 1 }, (_, i) => +(P_FROM + i * 0.1).toFixed(1));
    st = { ...st, tested: xs };
    const n = xs.filter(PROBES[st.q].f).length;
    say(`检验了 ${xs.length} 个数，其中 ${n} 个成立（绿点）．绿点连成一片，都在 ${PROBES[st.q].set.a} 的${st.q === 0 ? '右' : '左'}边．`, 'fb-ok');
    b.update();
  });
  $('prSet').addEventListener('click', () => {
    st = { ...st, showSet: true };
    say(st.q === 0 ? '解集 $x\\gt 3$：3 不是解，画空心圈；比 3 大的数都是解，向右画．' : '解集 $x\\le 4$：4 是解，画实心点；比 4 小的数都是解，向左画．', 'fb-ok');
    b.update();
  });
  $('prClr').addEventListener('click', () => { st = { ...st, tested: [], showSet: false }; say('', ''); b.update(); });
  $('prTabs').addEventListener('click', (e) => {
    const t = e.target.closest('[data-q]');
    if (!t) return;
    st = { ...st, q: +t.dataset.q, tested: [], showSet: false };
    $('prTabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === t));
    say('', '');
    b.update();
  });
  b.update();
}

/* 分数显示：吸附到 1/4、1/3 的倍数，按 1/12 约分 */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function fracText(v) {
  const n = Math.round(v * 12);
  const g = gcd(n, 12);
  const [p, q] = [n / g, 12 / g];
  if (q === 1) return m(p);
  return `${p < 0 ? '−' : ''}${Math.abs(p)}/${q}`;
}
const SNAPS = (() => {
  const s = new Set();
  for (let k = -48; k <= 48; k++) { s.add(k / 4); s.add(k / 3); }
  return [...s].filter((v) => Math.abs(v) <= 4.0001).sort((a, b) => a - b);
})();
const snap = (x) => SNAPS.reduce((best, v) => (Math.abs(v - x) < Math.abs(best - x) ? v : best), SNAPS[0]);

/* 第 7 页：在数轴上画解集 */
const DRAWQ = [
  { t: '练一练 2(1)', tex: 'x\\le 2', a: 2, op: '<=' },
  { t: '2(2)', tex: 'x\\ge -2', a: -2, op: '>=' },
  { t: '2(3)', tex: 'x\\lt \\dfrac23', a: 2 / 3, op: '<' },
  { t: '2(4)', tex: 'x\\gt -\\dfrac14', a: -1 / 4, op: '>' },
  { t: '习题 1(1)', tex: 'x\\gt 2', a: 2, op: '>' },
  { t: '1(2)', tex: 'x\\ge 3', a: 3, op: '>=' },
  { t: '1(3)', tex: 'x\\lt -\\dfrac12', a: -1 / 2, op: '<' },
  { t: '1(4)', tex: 'x\\le \\dfrac34', a: 3 / 4, op: '<=' },
];
function initDraw() {
  let st = { q: 0, a: 0, hollow: true, right: true };
  const op = () => (st.right ? '>' : '<') + (st.hollow ? '' : '=');
  const b = NumLine.board($('draw'), { from: -4, to: 4, y: [-1.2, 2], h: 190 });
  NumLine.axis(b, { from: -4, to: 4, minor: 0.25 });
  Ineq.ray(b, { a: () => st.a, op, h: 1.1, from: -4.4, to: 4.5, cls: 'iq-ray r2', dot: 'r2' });
  b.text(() => [st.a, 1.1], () => fracText(st.a), { cls: 'nl-or', dy: -10 });
  b.drag(() => [st.a, 0], (x) => { st = { ...st, a: snap(x) }; });
  const msg = $('dMsg');
  const say = (html, cls) => { msg.className = `tip feedback ${cls}`; msg.innerHTML = html; tex(msg); };
  const sync = () => {
    $('dDot').textContent = st.hollow ? '端点：空心 ○' : '端点：实心 ●';
    $('dDir').textContent = st.right ? '方向：向右 →' : '方向：向左 ←';
    $('dTabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', +x.dataset.q === st.q));
    $('dQ').innerHTML = `${DRAWQ[st.q].t}：$${DRAWQ[st.q].tex}$`;
    tex($('dQ'));
    b.update();
  };
  $('dTabs').innerHTML = DRAWQ.map((q, i) => `<button class="btn" type="button" data-q="${i}">${q.t}</button>`).join('');
  $('dTabs').addEventListener('click', (e) => {
    const t = e.target.closest('[data-q]');
    if (!t) return;
    st = { q: +t.dataset.q, a: 0, hollow: true, right: true };
    say('', '');
    sync();
  });
  $('dDot').addEventListener('click', () => { st = { ...st, hollow: !st.hollow }; sync(); });
  $('dDir').addEventListener('click', () => { st = { ...st, right: !st.right }; sync(); });
  $('dChk').addEventListener('click', () => {
    const Q = DRAWQ[st.q];
    const errs = [];
    if (Math.abs(st.a - Q.a) > 1e-9) errs.push(`端点应在 ${fracText(Q.a)} 处（现在在 ${fracText(st.a)}）`);
    if (st.hollow !== Ineq.strict(Q.op)) errs.push(Ineq.strict(Q.op) ? '没有等号，端点应画<b>空心圈</b>' : '有等号，端点应画<b>实心点</b>');
    if (st.right !== Ineq.right(Q.op)) errs.push(Ineq.right(Q.op) ? '“大于”应<b>向右</b>画' : '“小于”应<b>向左</b>画');
    if (errs.length) say(`✗ ${errs.join('；')}．`, 'fb-warn');
    else say(`✓ 画对了！$${Q.tex}$：端点 ${fracText(Q.a)}，${st.hollow ? '空心' : '实心'}，向${st.right ? '右' : '左'}．`, 'fb-ok');
  });
  sync();
}

/* 课本插图：只标 0 和端点 */
function fig(id, o) {
  const from = o.from ?? -4;
  const to = o.to ?? 5;
  const b = NumLine.board($(id), { from, to, y: o.y || [-1.25, 1.05], h: o.h || 120 });
  Ineq.axis(b, { from, to, marks: o.marks });
  (o.sets || []).forEach((s, i) => Ineq.ray(b, { a: s.a, op: s.op, h: s.h ?? 0.7, from: from - 0.4, to: to + 0.4, cls: `iq-ray ${s.c || ''}`, dot: s.c || '' }));
  b.update();
}

/* 第 9 页：是不是 x + 2 > 4 的解 */
const VALUES = [-5, -3, -1.5, 0, 1, 2, 3.4, 4, 5, 6.2, 9];
function initChips() {
  const box = $('solChips');
  box.innerHTML = VALUES.map((v) => `<button type="button" class="vchip" data-v="${v}">${m(v)}</button>`).join('');
  box.addEventListener('click', (e) => {
    const c = e.target.closest('.vchip');
    if (!c) return;
    const v = +c.dataset.v;
    const sum = +(v + 2).toFixed(2);
    const ok = sum > 4;
    c.classList.add(ok ? 'ok' : 'no');
    const msg = $('solMsg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = `$x=${tn(v)}$：$${v < 0 ? `(${tn(v)})` : tn(v)}+2=${tn(sum)}$，$${tn(sum)}\\gt 4$ ${ok ? '成立，是解 ✓' : '不成立，不是解 ✗'}`;
    tex(msg);
  });
}

window.LESSON = {
  init() {
    initTunnel();
    initProbe();
    initDraw();
    initChips();
    fig('f112', { marks: [0, 3], sets: [{ a: 3, op: '>' }] });
    fig('f113', { marks: [0, 4], sets: [{ a: 4, op: '<=' }] });
    fig('f114', { marks: [-3, 0], sets: [{ a: -3, op: '>=' }] });
    fig('r1', { from: -4, to: 4, marks: [0, 3], sets: [{ a: 3, op: '<' }] });
    fig('r2', { from: -3, to: 3, marks: [0, [0.25, ['1', '4']]], sets: [{ a: 0.25, op: '>' }], y: [-1.6, 1.05], h: 135 });
    fig('r3', { from: -4, to: 3, marks: [-2, 0], sets: [{ a: -2, op: '>=' }] });
    fig('r4', { from: -4, to: 3, marks: [0, [1 / 3, ['1', '3']]], sets: [{ a: 1 / 3, op: '<=' }], y: [-1.6, 1.05], h: 135 });
    fig('sumFig', { from: -4, to: 4, marks: [-2, 0, 1], sets: [{ a: -2, op: '>=', h: 0.6, c: 'r1' }, { a: 1, op: '<', h: 1.0, c: 'r2' }], y: [-1.25, 1.3], h: 130 });
  },
};
