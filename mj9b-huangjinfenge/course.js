'use strict';
/* 九下 6.2 黄金分割 · 本课互动：矩形调查、拖动找黄金分割点（线段 + 两个比的图象）、尺规作图、黄金矩形切正方形。
 * 黄金比一律用精确值 (√5 − 1)/2 计算，图上的点、矩形都按它画。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const PHI = (Math.sqrt(5) - 1) / 2; // 0.6180339…
const SVGNS = 'http://www.w3.org/2000/svg';

/* 第 3 页：四个矩形（宽 : 长按课本图量得），点选后显示比值 */
function initRects() {
  const box = $('rectPick');
  const btns = [...box.querySelectorAll('button')];
  const LONG = 100;
  btns.forEach((b) => {
    const r = +b.dataset.r;
    const w = LONG;
    const h = LONG * r;
    const rect = document.createElementNS(SVGNS, 'rect');
    Object.entries({ x: 10, y: 100 - h, width: w, height: h, fill: '#e3f1fb', stroke: '#1f2d3a', 'stroke-width': 2 }).forEach(([k, v]) => rect.setAttribute(k, v));
    b.querySelector('svg').appendChild(rect);
  });
  box.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    btns.forEach((x) => {
      x.classList.toggle('on', x === b);
      x.querySelector('.r').textContent = `宽 : 长 ≈ ${x.dataset.r === '0.618' ? '0.62' : x.dataset.r}`;
    });
    const msg = $('rectMsg');
    const gold = b.dataset.r === '0.618';
    msg.className = `tip feedback ${gold ? 'fb-ok' : ''}`;
    msg.textContent = gold
      ? '你和大多数同学一样，选了第②个！它的宽与长的比约为 0.62。'
      : '各有所爱！不过小丽的调查中，10 人里有 8 人选了第②个——看看它的宽长比。';
  });
}

/* 第 4 页：拖动 B，读两个比；右图画 y = (1 − x)/x 与 y = x */
function initSeg() {
  const s = { x: 0.5 };
  const L = 10;
  const b = Geo.board($('segBd'), { x: [-0.8, 10.8], y: [-1.6, 1.6], w: 640 });
  b.seg(() => [[0, 0], [s.x * L, 0]], { cls: 'seg-ab' });
  b.seg(() => [[s.x * L, 0], [L, 0]], { cls: 'seg-bc' });
  b.pt([0, 0]); b.pt([L, 0]);
  b.text([0, 0], 'A', { dx: -8, dy: 30 }); b.text([L, 0], 'C', { dx: -6, dy: 30 }); b.text(() => [s.x * L, 0], 'B', { dx: -6, dy: -18 });
  b.text(() => [s.x * L / 2, 0], () => `AB = ${fmt(s.x, 3)}`, { cls: 'lb up', dx: -40, dy: 32 });
  b.text(() => [(s.x * L + L) / 2, 0], () => `BC = ${fmt(1 - s.x, 3)}`, { cls: 'lb up', dx: -40, dy: 32 });
  b.drag(() => [s.x * L, 0], (x) => { s.x = Math.min(0.9, Math.max(0.3, Math.round(x / L * 1000) / 1000)); });

  const c = board($('curveBd'), { x: [0.17, 0.95], y: [0, 2.5], ticks: [0.1, 0.5], w: 480, h: 300, labels: ['x', 'y'] });
  c.fn((x) => (1 - x) / x, { cls: 'c2' });
  c.fn((x) => x, { cls: 'c1' });
  c.seg(() => [[s.x, 0], [s.x, 2.5]], { cls: 'dash' });
  c.pt(() => [s.x, (1 - s.x) / s.x], { cls: 'c2', r: 6 });
  c.pt(() => [s.x, s.x], { r: 6 });
  c.text([0.3, 2.3], 'y = BC/AB', { cls: 'lb up', dx: 10 });
  c.text([0.8, 0.8], 'y = AB/AC', { cls: 'lb up', dx: 10, dy: 22 });
  c.update();

  const sync = () => {
    const r1 = (1 - s.x) / s.x;
    const r2 = s.x;
    $('r1').textContent = fmt(r1, 3); $('r2').textContent = fmt(r2, 3);
    $('r1Bar').style.width = `${Math.min(100, r1 / 2.4 * 100)}%`;
    $('r2Bar').style.width = `${Math.min(100, r2 / 2.4 * 100)}%`;
    const msg = $('segMsg');
    const gap = r1 - r2;
    const close = Math.abs(gap) < 0.003;
    msg.className = `tip feedback ${close ? 'fb-ok' : ''}`;
    msg.innerHTML = close
      ? `两个比几乎相等了！此时 $x=${fmt(s.x, 3)}$——黄金比 $\\approx0.618$。`
      : `$\\dfrac{BC}{AB}$ ${gap > 0 ? '大于' : '小于'} $\\dfrac{AB}{AC}$，把 $B$ 向${gap > 0 ? '右' : '左'}移。`;
    tex(msg);
    c.update();
  };
  b.onUpdate = sync;
  const nudge = (d) => { s.x = Math.min(0.9, Math.max(0.3, Math.round((s.x + d) * 1000) / 1000)); b.update(); };
  $('segFine').addEventListener('click', () => nudge(-0.001));
  $('segFine2').addEventListener('click', () => nudge(0.001));
  b.update();
}

/* 图 6-4、两个黄金分割点、练习 2、习题 2 */
function initFigs() {
  Geo.sketch($('ex64'), { P: { A: [0, 0], B: [10 * PHI, 0], C: [10, 0] }, seg: 'AC', w: 420, pad: 0.8, lab: { A: [-6, 26], B: [-6, 26], C: [-6, 26] } });

  const t = Geo.board($('twoPts'), { x: [-0.8, 10.8], y: [-1.4, 1.4], w: 640 });
  t.seg([[0, 0], [10, 0]], { cls: 'gs' });
  [[0, 'A'], [10, 'C']].forEach(([x, n]) => { t.pt([x, 0]); t.text([x, 0], n, { dx: -6, dy: 28 }); });
  [[10 * PHI, 'B₁', '0.618'], [10 * (1 - PHI), 'B₂', '0.382']].forEach(([x, n, v]) => {
    t.pt([x, 0], { cls: 'gold-pt', r: 7 });
    t.text([x, 0], n, { dx: -8, dy: -16 });
    t.text([x, 0], `AC 的 ${v} 处`, { cls: 'lb up', dx: -40, dy: 32 });
  });
  t.update();

  // 练习 2：AB = 1，C、D 是两个黄金分割点（AC = 0.382，AD = 0.618）
  Geo.sketch($('pr2Fig'), { P: { A: [0, 0], C: [10 * (1 - PHI), 0], D: [10 * PHI, 0], B: [10, 0] }, seg: 'AB', w: 420, pad: 0.8, lab: { A: [-6, 26], B: [-6, 26], C: [-6, 26], D: [-6, 26] } });

  // 习题 2：B(0,0)、P(PB,0)、A(AB,0)，AB = 4（作图单位），S₁ = PA²，S₂ = AB·PB
  const AB = 4;
  const PB = AB * (1 - PHI);
  const h = Geo.board($('h2Fig'), { x: [-0.8, 4.8], y: [-4.4, 2.9], w: 300 });
  h.poly([[PB, 0], [AB, 0], [AB, AB * PHI], [PB, AB * PHI]], { cls: 'sq' });
  h.poly([[0, 0], [PB, 0], [PB, -AB], [0, -AB]], { cls: 'sq last' });
  h.seg([[0, 0], [AB, 0]], { cls: 'gs' });
  [[[0, 0], 'B', -16, -4], [[PB, 0], 'P', 4, 20], [[AB, 0], 'A', 6, 20]].forEach(([p, n, dx, dy]) => h.text(p, n, { dx, dy }));
  h.text([(PB + AB) / 2, AB * PHI / 2], 'S₁', { cls: 'lb up', dx: -10, dy: 6 });
  h.text([PB / 2, -AB / 2], 'S₂', { cls: 'lb up', dx: -10, dy: 6 });
  h.update();
}

/* 第 7 页：尺规作图。A(0,0)，C(L,0)，D(L, L/2)，E 在 AD 上且 DE = DC，B 在 AC 上且 AB = AE */
function initCons() {
  const s = { L: 8, step: 0 };
  const b = Geo.board($('consBd'), { x: [-1, 10.5], y: [-1.6, 5.8], w: 600 });
  const D = () => [s.L, s.L / 2];
  const AD = () => Math.hypot(s.L, s.L / 2);
  const E = () => { const k = (AD() - s.L / 2) / AD(); return [s.L * k, (s.L / 2) * k]; };
  const AE = () => AD() - s.L / 2;
  const B = () => [AE(), 0];
  const on = (n) => () => s.step >= n;
  const arc = (cx, r, a0, a1) => (t) => { const a = a0 + (a1 - a0) * t; return [cx()[0] + r() * Math.cos(a), cx()[1] + r() * Math.sin(a)]; };
  b.seg(() => [[0, 0], [s.L, 0]], { cls: 'gs' });
  b.seg(() => (on(1)() ? [[s.L, 0], D()] : [[s.L, 0], [s.L, 0]]), { cls: 'cons' });
  Geo.right(b, () => [s.L, 0], () => [0, 0], D, { s: 0.35 });
  b.seg(() => (on(2)() ? [[0, 0], D()] : [[0, 0], [0, 0]]), { cls: 'gs' });
  // 弧：以 D 为圆心、DC 为半径，画从 DC 方向（向下）到 DA 方向附近的一段
  b.curve((t) => {
    if (!on(3)()) return [NaN, NaN];
    const dirDA = Math.atan2(-s.L / 2, -s.L);
    return arc(D, () => s.L / 2, -Math.PI / 2 + 0.15, dirDA - 0.3)(t);
  }, 0, 1, { cls: 'cons-arc', n: 60 });
  b.curve((t) => {
    if (!on(4)()) return [NaN, NaN];
    const a1 = Math.atan2(E()[1], E()[0]);
    return arc(() => [0, 0], AE, a1 + 0.12, -0.18)(t);
  }, 0, 1, { cls: 'cons-arc', n: 60 });
  b.pt([0, 0]); b.text([0, 0], 'A', { dx: -8, dy: 26 });
  b.pt(() => [s.L, 0]); b.text(() => [s.L, 0], 'C', { dx: 6, dy: 26 });
  b.pt(D, { show: on(1) }); b.text(() => (on(1)() ? D() : null), 'D', { dx: 8, dy: -6 });
  b.pt(E, { show: on(3) }); b.text(() => (on(3)() ? E() : null), 'E', { dx: -6, dy: -12 });
  b.pt(B, { show: on(4), cls: 'gold-pt', r: 7 }); b.text(() => (on(4)() ? B() : null), 'B', { dx: -6, dy: 26 });
  b.drag(() => [s.L, 0], (x) => { s.L = Math.min(9.5, Math.max(4, x)); }, { r: 7, hit: 18 });
  b.onUpdate = () => {
    $('consSteps').querySelectorAll('.st').forEach((p, i) => p.classList.toggle('on', i < s.step));
    const msg = $('consMsg');
    if (s.step < 4) { msg.className = 'tip feedback'; msg.textContent = `AC = ${fmt(s.L, 2)}（作图单位）。点“下一步作图”。`; return; }
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$AC=${fmt(s.L, 2)}$，$AB=AE=${fmt(AE(), 3)}$，$\\dfrac{AB}{AC}=${fmt(AE() / s.L, 4)}$，$\\dfrac{BC}{AB}=${fmt((s.L - AE()) / AE(), 4)}$`;
    tex(msg);
  };
  $('consNext').addEventListener('click', () => { s.step = Math.min(4, s.step + 1); b.update(); });
  $('consPrev').addEventListener('click', () => { s.step = Math.max(0, s.step - 1); b.update(); });
  b.update();
}

/* 第 8 页：黄金矩形依次切掉正方形（左、上、右、下轮流），剩下的矩形宽长比恒为 PHI */
function cutSquares(n) {
  let r = { x: 0, y: 0, w: 10, h: 10 * PHI };
  const sq = [];
  for (let i = 0; i < n; i++) {
    const k = i % 4;
    if (k === 0) { const a = r.h; sq.push([r.x, r.y, a]); r = { ...r, x: r.x + a, w: r.w - a }; }
    if (k === 1) { const a = r.w; sq.push([r.x, r.y + r.h - a, a]); r = { ...r, h: r.h - a }; }
    if (k === 2) { const a = r.h; sq.push([r.x + r.w - a, r.y, a]); r = { ...r, w: r.w - a }; }
    if (k === 3) { const a = r.w; sq.push([r.x, r.y, a]); r = { ...r, y: r.y + a, h: r.h - a }; }
  }
  return { sq, rest: r };
}

function initRec() {
  const s = { n: 0 };
  const MAX = 7;
  const b = Geo.board($('recBd'), { x: [-0.4, 10.4], y: [-0.4, 10 * PHI + 0.4], w: 600 });
  for (let i = 0; i < MAX; i++) {
    b.poly(() => {
      const { sq } = cutSquares(s.n);
      if (i >= sq.length) return [];
      const [x, y, a] = sq[i];
      return [[x, y], [x + a, y], [x + a, y + a], [x, y + a]];
    }, { cls: 'sq' });
  }
  b.poly(() => { const { rest: r } = cutSquares(s.n); return s.n ? [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]] : []; }, { cls: 'sq last' });
  b.poly([[0, 0], [10, 0], [10, 10 * PHI], [0, 10 * PHI]], { cls: 'gold-rect' });
  b.onUpdate = () => {
    const { rest: r } = cutSquares(s.n);
    const ratio = Math.min(r.w, r.h) / Math.max(r.w, r.h);
    const msg = $('cutMsg');
    msg.className = `tip feedback ${s.n ? 'fb-ok' : ''}`;
    msg.textContent = s.n
      ? `切了 ${s.n} 次。剩下的黄色矩形：宽 ${fmt(Math.min(r.w, r.h) / 10, 4)}，长 ${fmt(Math.max(r.w, r.h) / 10, 4)}，宽 : 长 = ${fmt(ratio, 4)}`
      : `黄金矩形：长 1，宽 ${fmt(PHI, 4)}。点“切掉一个正方形”。`;
  };
  $('cutBtn').addEventListener('click', () => { s.n = Math.min(MAX, s.n + 1); b.update(); });
  $('cutReset').addEventListener('click', () => { s.n = 0; b.update(); });
  b.update();
}

window.LESSON = {
  init() {
    initRects();
    initSeg();
    initFigs();
    initCons();
    initRec();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
