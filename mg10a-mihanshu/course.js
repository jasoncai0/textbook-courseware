'use strict';
/* 高一上 6.1 幂函数 · 本课互动：α 实验室（滑块改指数，拖点看奇偶）、α>0 / α<0 两组图象、例 2 中间量图。通用部分见 ../shared/math.js */
const { board, slider, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/** x^(p/q)，q 为奇数时负数也有定义（如 x^(1/3)、x^(2/3)）；p/q 已约分 */
function powPQ(x, p, q) {
  if (x === 0) return p > 0 ? 0 : NaN;
  if (x > 0) return x ** (p / q);
  if (q % 2 === 0) return NaN;
  const v = (-x) ** (p / q);
  return Math.abs(p % 2) === 1 ? -v : v;
}

/* 第 6 页：α 实验室 */
const ALPHAS = [[-3, 1], [-2, 1], [-1, 1], [-1, 2], [-1, 3], [1, 3], [1, 2], [2, 3], [1, 1], [3, 2], [2, 1], [3, 1]];
const QUICK = [[3, 1], [2, 1], [1, 2], [2, 3], [-1, 1], [-2, 1]];
const texA = ([p, q]) => (q === 1 ? String(p) : `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`);

function describe([p, q]) {
  const evenRoot = q % 2 === 0;
  const dom = evenRoot ? (p > 0 ? '[0,+\\infty)' : '(0,+\\infty)') : (p > 0 ? '\\mathbf R' : '(-\\infty,0)\\cup(0,+\\infty)');
  const parity = evenRoot ? '既不是奇函数，也不是偶函数（定义域不对称）' : (Math.abs(p % 2) === 1 ? '<b>奇函数</b>' : '<b>偶函数</b>');
  return {
    f: `$y=x^{${texA([p, q])}}$`,
    dom: `$${dom}$`,
    parity,
    mono: p > 0 ? '增函数（图象上升）' : '减函数（图象下降）',
    fixed: p > 0 ? '$(0,0)$，$(1,1)$' : '$(1,1)$',
  };
}

function initLab() {
  const s = { i: 10, x: 1.4 };
  const f = (x) => powPQ(x, ...ALPHAS[s.i]);
  const b = board($('lab'), { x: [-3, 3], y: [-3, 3], w: 520 });
  b.seg([[-3, 1], [3, 1]], { cls: 'dash' });
  b.seg([[1, -3], [1, 3]], { cls: 'dash' });
  b.fn((x) => f(x), { n: 700 });
  b.pt([1, 1], { cls: 'c2', r: 6 });
  b.seg(() => [[s.x, 0], [s.x, Number.isFinite(f(s.x)) ? f(s.x) : 0]], { cls: 'dash' });
  b.pt(() => [s.x, f(s.x)], { show: () => Number.isFinite(f(s.x)), r: 8 });
  b.pt(() => [-s.x, f(-s.x)], { hollow: true, r: 8, show: () => Number.isFinite(f(-s.x)) });
  b.text(() => [s.x, f(s.x)], 'P', { dx: 10, dy: -10 });
  b.text(() => [-s.x, f(-s.x)], 'Q', { dx: 10, dy: -10 });
  b.drag(() => [s.x, 0], (x) => { s.x = Math.round(Math.max(-2.8, Math.min(2.8, x)) * 20) / 20 || 0.05; });
  b.onUpdate = () => {
    const d = describe(ALPHAS[s.i]);
    $('alphaV').innerHTML = `$${texA(ALPHAS[s.i])}$`;
    $('pF').innerHTML = d.f; $('pD').innerHTML = d.dom; $('pP').innerHTML = d.parity; $('pM').innerHTML = d.mono; $('pT').innerHTML = d.fixed;
    const [y, yq] = [f(s.x), f(-s.x)];
    const msg = $('pQ');
    let html;
    if (!Number.isFinite(y)) html = `$x=${fmt(s.x)}$ 不在定义域内：没有点 $P$。`;
    else if (!Number.isFinite(yq)) html = `$P(${fmt(s.x)},\\ ${fmt(y)})$；但 $-x=${fmt(-s.x)}$ 不在定义域内，没有点 $Q$。`;
    else {
      const rel = Math.abs(yq - y) < 1e-9 ? 'f(-x)=f(x)' : 'f(-x)=-f(x)';
      html = `$P(${fmt(s.x)},\\ ${fmt(y)})$，$Q(${fmt(-s.x)},\\ ${fmt(yq)})$：$${rel}$。`;
    }
    msg.innerHTML = html;
    [$('alphaV'), $('pF'), $('pD'), $('pT'), msg].forEach(tex);
    $('alphaBtns').querySelectorAll('.btn').forEach((btn) => btn.classList.toggle('solid', +btn.dataset.i === s.i));
  };
  $('alphaBtns').innerHTML = QUICK.map((a) => {
    const i = ALPHAS.findIndex(([p, q]) => p === a[0] && q === a[1]);
    return `<button type="button" class="btn" data-i="${i}">$\\alpha=${texA(a)}$</button>`;
  }).join('');
  tex($('alphaBtns'));
  $('alphaBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    $('alpha').value = btn.dataset.i;
    $('alpha').dispatchEvent(new Event('input'));
  });
  slider($('alpha'), (v) => { s.i = v; b.update(); });
}

/* 第 7、8 页：两组幂函数的图象（图 6-1-1、图 6-1-2） */
function initGroup(id, list, marks) {
  const b = board($(id), { x: [-2.5, 3], y: [-2.5, 3.5], w: 480 });
  list.forEach(([p, q], k) => b.fn((x) => powPQ(x, p, q), { cls: `c${k + 1}`, n: 700 }));
  marks.forEach((m) => { b.pt(m, { r: 7 }); b.text(m, `(${m[0]}, ${m[1]})`, { cls: 'lb up', dx: 10, dy: 24 }); });
  b.update();
}

/* 第 10 页：例 2(3) 中间量 1 */
function initEx2() {
  const b = board($('ex2'), { x: [-0.3, 3.6], y: [-0.3, 2.2], w: 480, ticks: [1, 1] });
  b.seg([[-0.3, 1], [3.6, 1]], { cls: 'dash' });
  b.fn((x) => (x < 0 ? NaN : x ** 1.3), { cls: 'c1' });
  b.fn((x) => (x < 0 ? NaN : Math.cbrt(x)), { cls: 'c2' });
  const p1 = [0.5, 0.5 ** 1.3];
  const p2 = [3, Math.cbrt(3)];
  b.seg([[0.5, 0], p1], { cls: 'dash' });
  b.seg([[3, 0], p2], { cls: 'dash' });
  b.pt(p1, { r: 7 }); b.pt(p2, { cls: 'c2', r: 7 }); b.pt([1, 1], { r: 6 });
  b.text(p1, `(½)^1.3 ≈ ${fmt(p1[1])}`, { cls: 'lb up', dx: 12, dy: 26 });
  b.text(p2, `3^⅓ ≈ ${fmt(p2[1])}`, { cls: 'lb up', dx: -40, dy: 30 });
  b.update();
}

window.LESSON = {
  init() {
    initLab();
    initGroup('pos', [[2, 1], [3, 1], [1, 2]], [[0, 0], [1, 1]]);
    initGroup('neg', [[-1, 1], [-3, 1], [-1, 2]], [[1, 1]]);
    initEx2();
  },
};
