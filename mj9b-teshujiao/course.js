'use strict';
/* 九下 7.3 特殊角的三角函数 · 本课互动：三角板取值器（选角、选函数，高亮分子/分母边，k 可缩放）。
 * 三角板按准确边长比绘制：1 : 1 : √2 与 1 : √3 : 2。 */
const { slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const R3 = Math.sqrt(3);
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

const SIDES = { 45: { BC: 'k', AC: 'k', AB: '\\sqrt2k' }, 3060: { BC: 'k', AC: '\\sqrt3k', AB: '2k' } };
const VAL = {
  sin30: '\\frac12', cos30: '\\frac{\\sqrt3}2', tan30: '\\frac1{\\sqrt3}=\\frac{\\sqrt3}3',
  sin45: '\\frac1{\\sqrt2}=\\frac{\\sqrt2}2', cos45: '\\frac1{\\sqrt2}=\\frac{\\sqrt2}2', tan45: '1',
  sin60: '\\frac{\\sqrt3}2', cos60: '\\frac12', tan60: '\\sqrt3',
};
const NAME = { sin: ['对边', '斜边'], cos: ['邻边', '斜边'], tan: ['对边', '邻边'] };

function initTri() {
  const s = { a: 30, f: 'sin', k: 1 };
  const group = () => (s.a === 45 ? 45 : 3060);
  const P = () => {
    const k = s.k;
    return group() === 45 ? { A: [0, 0], C: [k, 0], B: [k, k] } : { A: [0, 0], C: [R3 * k, 0], B: [R3 * k, k] };
  };
  const vtx = () => (s.a === 60 ? 'B' : 'A'); // 30°–60° 三角板：30° 在 A，60° 在 B
  const sides = () => {
    const opp = vtx() === 'A' ? 'BC' : 'AC';
    const adj = vtx() === 'A' ? 'AC' : 'BC';
    return { sin: [opp, 'AB'], cos: [adj, 'AB'], tan: [opp, adj] }[s.f];
  };
  const b = Geo.board($('tri'), { x: [-0.7, 4.2], y: [-0.8, 2.5], w: 520 });
  const seg = {};
  ['AB', 'BC', 'AC'].forEach((n) => { seg[n] = b.seg(() => [P()[n[0]], P()[n[1]]], { cls: 'gs' }); });
  Geo.right(b, () => P().C, () => P().A, () => P().B, { s: 0.2 });
  Geo.arc(b, () => P().A, () => P().C, () => P().B, { r: 0.45, label: () => (group() === 45 ? '45°' : '30°'), cls: 'garc' });
  Geo.arc(b, () => P().B, () => P().A, () => P().C, { r: 0.35, label: () => (group() === 45 ? '45°' : '60°'), cls: 'garc', lr: 2.2 });
  b.text(() => P().A, 'A', { dx: -22, dy: 8 }); b.text(() => P().B, 'B', { dx: 6, dy: -4 }); b.text(() => P().C, 'C', { dx: 6, dy: 22 });
  const L = (n) => () => SIDES[group()][n].replace('\\sqrt2', '√2').replace('\\sqrt3', '√3');
  b.text(() => mid(P().A, P().B), L('AB'), { cls: 'lb up sl', dx: -46, dy: -8 });
  b.text(() => mid(P().B, P().C), L('BC'), { cls: 'lb up sl', dx: 8, dy: 6 });
  b.text(() => mid(P().A, P().C), L('AC'), { cls: 'lb up sl', dx: -12, dy: 26 });
  b.onUpdate = () => {
    const [num, den] = sides();
    Object.entries(seg).forEach(([n, node]) => node.setAttribute('class', n === num ? 'gl so' : n === den ? 'gl sa' : 'gs'));
    const sd = SIDES[group()];
    const [nn, dn] = NAME[s.f];
    $('triMsg').innerHTML = `$\\${s.f}${s.a}^\\circ=\\dfrac{\\text{${nn}}}{\\text{${dn}}}=\\dfrac{${num}}{${den}}=\\dfrac{${sd[num]}}{${sd[den]}}=${VAL[s.f + s.a].replace(/\\frac/g, '\\dfrac')}$`;
    tex($('triMsg'));
    $('kV').textContent = fmt(s.k);
  };
  $('angBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a],[data-f]');
    if (!btn) return;
    if (btn.dataset.a) s.a = +btn.dataset.a; else s.f = btn.dataset.f;
    $('angBtns').querySelectorAll('[data-a]').forEach((x) => x.classList.toggle('solid', +x.dataset.a === s.a));
    $('angBtns').querySelectorAll('[data-f]').forEach((x) => x.classList.toggle('solid', x.dataset.f === s.f));
    b.update();
  });
  slider($('kS'), (v) => { s.k = v; b.update(); });
}

function initSketches() {
  Geo.sketch($('pr2Fig'), { P: { A: [-3 / R3, 0], B: [3 * R3, 0], C: [0, 3], D: [0, 0] }, seg: 'AB BC CA CD', right: [['C', 'A', 'B'], ['D', 'B', 'C']], text: [[[1.5 * R3, 1.5], '2', 6, -4], [[1.5 * R3, 0], '√3', -8, 22]], w: 340, pad: 1 });
  const ac = 15 * R3;
  Geo.sketch($('hw3Fig'), { P: { A: [0, ac / 5], B: [-3, 0], C: [0, 0], D: [ac / 5, 0] }, seg: 'AB BD DA AC', ang: [['A', 'B', 'C', '30°', 2], ['A', 'C', 'D', '45°', 1.2]], right: [['C', 'D', 'A']], text: [[[-1.5, 0], '15', -8, 22]], w: 340, pad: 0.6 });
}

window.LESSON = {
  init() { initTri(); initSketches(); },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
