'use strict';
/* 九下 7.5 解直角三角形 · 本课互动：选两个已知元素 → 能否解、求解顺序（例子 a=3, b=4, c=5）；圆内接正 n 边形边长。
 * 所有图形按坐标精确计算。 */
const { slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const R3 = Math.sqrt(3);
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

/* 第 4 页：选两个已知元素 */
const ORDER = 'ABabc';
const ANG_A = Math.atan(3 / 4) / RAD;
const VALUE = { A: `${fmt(ANG_A)}°`, B: `${fmt(90 - ANG_A)}°`, a: '3', b: '4', c: '5' };
const STEPS = {
  Aa: ['\\angle B=90^\\circ-\\angle A', 'c=\\dfrac a{\\sin A}', 'b=\\dfrac a{\\tan A}'],
  Ab: ['\\angle B=90^\\circ-\\angle A', 'a=b\\cdot\\tan A', 'c=\\dfrac b{\\cos A}'],
  Ac: ['\\angle B=90^\\circ-\\angle A', 'a=c\\cdot\\sin A', 'b=c\\cdot\\cos A'],
  Ba: ['\\angle A=90^\\circ-\\angle B', 'b=a\\cdot\\tan B', 'c=\\dfrac a{\\cos B}'],
  Bb: ['\\angle A=90^\\circ-\\angle B', 'a=\\dfrac b{\\tan B}', 'c=\\dfrac b{\\sin B}'],
  Bc: ['\\angle A=90^\\circ-\\angle B', 'a=c\\cdot\\cos B', 'b=c\\cdot\\sin B'],
  ab: ['c=\\sqrt{a^2+b^2}', '\\tan A=\\dfrac ab\\Rightarrow\\angle A', '\\angle B=90^\\circ-\\angle A'],
  ac: ['b=\\sqrt{c^2-a^2}', '\\sin A=\\dfrac ac\\Rightarrow\\angle A', '\\angle B=90^\\circ-\\angle A'],
  bc: ['a=\\sqrt{c^2-b^2}', '\\cos A=\\dfrac bc\\Rightarrow\\angle A', '\\angle B=90^\\circ-\\angle A'],
};
function initSolve() {
  const s = { pick: [] };
  const P = { A: [0, 0], C: [4, 0], B: [4, 3] };
  const b = Geo.board($('solve'), { x: [-0.9, 6.6], y: [-1, 4.7], w: 520 });
  const angOnly = () => s.pick.length === 2 && s.pick.every((e) => e === 'A' || e === 'B');
  // 只知两角时：再画一大一小两个相似三角形（虚线），说明边不确定
  [0.6, 1.4].forEach((k) => b.poly(() => (angOnly() ? [[0, 0], [4 * k, 0], [4 * k, 3 * k]] : []), { cls: 'ghost' }));
  const node = {
    a: b.seg([P.B, P.C], { cls: 'gs' }),
    b: b.seg([P.A, P.C], { cls: 'gs' }),
    c: b.seg([P.A, P.B], { cls: 'gs' }),
    A: Geo.arc(b, P.A, P.C, P.B, { r: 0.7 }),
    B: Geo.arc(b, P.B, P.A, P.C, { r: 0.6 }),
  };
  Geo.right(b, P.C, P.A, P.B, { s: 0.25 });
  b.text(P.A, 'A', { dx: -22, dy: 8 }); b.text(P.B, 'B', { dx: 6, dy: -4 }); b.text(P.C, 'C', { dx: 6, dy: 22 });
  const state = (e) => {
    if (s.pick.includes(e)) return 'kn';
    return s.pick.length === 2 && !angOnly() ? 'sv' : '';
  };
  const lab = (e) => () => {
    const st = state(e);
    const name = { A: '∠A', B: '∠B' }[e] || e;
    return st ? `${name} = ${VALUE[e]}` : (s.pick.length === 2 && angOnly() ? `${name} = ?` : name);
  };
  const labNodes = {
    a: b.text(mid(P.B, P.C), lab('a'), { dx: 8, dy: 6 }),
    b: b.text(mid(P.A, P.C), lab('b'), { dx: -20, dy: 28 }),
    c: b.text(mid(P.A, P.B), lab('c'), { dx: -70, dy: -10 }),
    A: b.text([0.95, 0.3], lab('A'), { dx: 0, dy: 0 }),
    B: b.text([4, 3], lab('B'), { dx: 14, dy: 30 }),
  };
  b.onUpdate = () => {
    ORDER.split('').forEach((e) => {
      const st = state(e);
      const isAng = e === 'A' || e === 'B';
      node[e].setAttribute('class', `${isAng ? 'garc' : 'gs'} ${st}`);
      labNodes[e].setAttribute('class', `lb el ${st}`);
    });
    $('elBtns').querySelectorAll('[data-e]').forEach((x) => x.classList.toggle('solid', s.pick.includes(x.dataset.e)));
    const msg = $('slvMsg');
    const ol = $('slvSteps');
    if (s.pick.length < 2) {
      msg.className = 'tip feedback';
      msg.textContent = `再选 ${2 - s.pick.length} 个元素作为已知。`;
      ol.innerHTML = '';
      return;
    }
    if (angOnly()) {
      msg.className = 'tip feedback fb-warn';
      msg.textContent = '只知道两个锐角：不能解！虚线的大小三角形角都相同，边却各不相同（相似但不全等）。';
      ol.innerHTML = '';
      return;
    }
    const key = [...s.pick].sort((x, y) => ORDER.indexOf(x) - ORDER.indexOf(y)).join('');
    msg.className = 'tip feedback fb-ok';
    msg.textContent = '能解！按下面的顺序求出其余 3 个元素：';
    ol.innerHTML = STEPS[key].map((t) => `<li>$${t}$</li>`).join('');
    tex(ol);
  };
  $('elBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-e]');
    if (!btn) return;
    const k = btn.dataset.e;
    s.pick = s.pick.includes(k) ? s.pick.filter((x) => x !== k) : [...s.pick, k].slice(-2);
    b.update();
  });
  b.update();
}

/* 第 9 页：圆内接正 n 边形，AB 在下方水平 */
function initPoly() {
  const s = { n: 5, r: 10 };
  const O = [0, 0];
  const V = (i) => { const t = (-90 - 180 / s.n + (360 / s.n) * i) * RAD; return [Math.cos(t), Math.sin(t)]; };
  const H = () => mid(V(0), V(1));
  const b = Geo.board($('poly'), { x: [-1.4, 1.4], y: [-1.35, 1.35], w: 440 });
  b.curve((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, { cls: 'circ' });
  b.poly(() => [O, V(0), H()], { cls: 'hl-tri' });
  b.poly(() => Array.from({ length: s.n }, (_, i) => V(i)), { cls: 'ngon' });
  b.seg(() => [O, V(0)], { cls: 'gs' }); b.seg(() => [O, V(1)], { cls: 'gs' });
  b.seg(() => [O, H()], { cls: 'gdash' });
  Geo.right(b, H, O, () => V(1), { s: 0.07 });
  Geo.arc(b, O, H, () => V(0), { r: 0.22 });
  b.pt(O, { r: 4 });
  b.text(O, 'O', { dx: 6, dy: -6 });
  b.text(() => V(0), 'A', { dx: -20, dy: 18 }); b.text(() => V(1), 'B', { dx: 6, dy: 18 }); b.text(H, 'H', { dx: -6, dy: 22 });
  ['C', 'D', 'E'].forEach((L, k) => b.text(() => (s.n === 5 ? V(k + 2) : null), L, { dx: k === 1 ? -6 : (k === 0 ? 8 : -22), dy: k === 1 ? -8 : 6 }));
  b.text(() => mid(O, V(0)), () => `r = ${s.r}`, { cls: 'lb up gnum', dx: -50, dy: 4 });
  b.onUpdate = () => {
    const side = 2 * s.r * Math.sin((180 / s.n) * RAD);
    $('nV').textContent = s.n; $('rV').textContent = s.r;
    $('polyMsg').innerHTML = `中心角 $\\angle AOB=\\frac{360^\\circ}{${s.n}}=${fmt(360 / s.n)}^\\circ$，$AB=2\\times${s.r}\\times\\sin${fmt(180 / s.n)}^\\circ\\approx${side.toFixed(1)}$`;
    tex($('polyMsg'));
  };
  slider($('nS'), (v) => { s.n = v; b.update(); });
  slider($('rS'), (v) => { s.r = v; b.update(); });
}

function initSketches() {
  Geo.sketch($('fig716'), { P: { A: [0, 0], C: [4, 0], B: [4, 3] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], text: [[[4, 1.5], 'a', 8, 6, 'lb'], [[2, 0], 'b', -4, 24, 'lb'], [[2, 1.5], 'c', -18, -6, 'lb']], w: 380, pad: 0.6 });
  const b1 = 5 * R3 / 2;
  Geo.sketch($('ex1Fig'), { P: { A: [0, 0], C: [b1, 0], B: [b1, 2.5] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], ang: [['A', 'C', 'B', '30°', 0.9]], text: [[[b1, 1.25], 'a = 5', 8, 6]], w: 400, pad: 0.6 });
  const k2 = 1 / 20;
  Geo.sketch($('ex2Fig'), { P: { A: [0, 0], C: [20.49 * k2, 0], B: [20.49 * k2, 104 * k2] }, seg: 'AB BC CA', right: [['C', 'A', 'B']], text: [[[20.49 * k2, 52 * k2], 'a = 104', 8, 6], [[10.245 * k2, 0], 'b = 20.49', -40, 46]], w: 300, pad: 0.5 });
  Geo.sketch($('ex3Fig'), { P: { A: [0, 0], D: [2 * R3, 0], C: [2 * R3, 2], B: [2 * R3 + 2, 0] }, seg: 'AB BC CA', dash: 'CD', right: [['D', 'B', 'C']], ang: [['A', 'D', 'C', '30°', 0.9], ['B', 'C', 'D', '45°', 0.6]], text: [[[R3, 1], '8', -16, -6]], w: 420, pad: 0.6 });
  const h = 3 * R3 / 2;
  Geo.sketch($('pr1Fig'), { P: { A: [0, 0], B: [4, 0], C: [5.5, h], D: [1.5, h], E: [1.5, 0] }, seg: 'AB BC CD DA', dash: 'DE', right: [['E', 'B', 'D']], ang: [['A', 'B', 'D', '60°', 0.5]], text: [[[2.75, 0], '8', 8, 22], [[0.75, h / 2], '6', -18, -2]], w: 340, pad: 0.5 });
  const cx = 2 * Math.cos(36 * RAD);
  const cy = 2 * Math.sin(36 * RAD);
  Geo.sketch($('hw4Fig'), { P: { A: [-cx, 0], C: [cx, 0], B: [0, cy], D: [0, -cy] }, seg: 'AB BC CD DA AC BD', ang: [['A', 'B', 'D', '72°', 0.45]], w: 300, pad: 0.4 });
}

window.LESSON = {
  init() { initSolve(); initPoly(); initSketches(); },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
