'use strict';
/* 高一上 5.4 函数的奇偶性 · 本课互动：图 5-4-1 观察、折一折转一转、定义域反例、例 2 图象、练习 3 补图。通用部分见 ../shared/math.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const OFF = [[99, 99], [99, 99]]; // 隐藏线段：移到画板外
const num = (v) => fmt(v).replace('-', '−');
const pair = (p) => `(${num(p[0])}, ${num(p[1])})`;
const stepOf = (node, n) => { node.setAttribute('data-step', String(n)); return node; };

/* 第 3 页：图 5-4-1（x₀ 取 1.5 与 2，按函数值描点） */
function markPair(b, p, q, cls) {
  b.seg([p, q], { cls: 'dash' });
  [p, q].forEach((pt) => { b.seg([[pt[0], 0], pt], { cls: 'dash' }); b.pt(pt, { cls, r: 7 }); });
}
function initObserve() {
  const X0 = 1.5;
  const e = board($('obsEven'), { x: [-3, 3], y: [-0.8, 4.2], w: 420 });
  e.fn((x) => x * x);
  markPair(e, [-X0, X0 * X0], [X0, X0 * X0], 'c2');
  e.text([-X0, X0 * X0], '(−x₀, x₀²)', { cls: 'lb up', dx: -6, dy: -12 }).setAttribute('text-anchor', 'end');
  e.text([X0, X0 * X0], '(x₀, x₀²)', { cls: 'lb up', dx: 6, dy: -12 });
  e.update();

  const X1 = 2;
  const o = board($('obsOdd'), { x: [-3.5, 3.5], y: [-2.6, 2.6], w: 420 });
  o.fn((x) => (x === 0 ? NaN : -1 / x));
  markPair(o, [-X1, 1 / X1], [X1, -1 / X1], 'c2');
  o.pt([0, 0], { r: 5 });
  o.text([-X1, 1 / X1], '(−x₀, 1/x₀)', { cls: 'lb up', dx: -6, dy: -12 }).setAttribute('text-anchor', 'end');
  o.text([X1, -1 / X1], '(x₀, −1/x₀)', { cls: 'lb up', dx: 6, dy: 26 });
  o.update();
}

/* 第 6 页：折一折、转一转 */
const ALL = () => true;
const FF_FUNCS = [
  { key: 'sq', label: '$x^2$', f: (x) => x * x, dom: ALL, even: true, odd: false,
    why: { turn: '转过去的图象落在 x 轴下方，而 x² 的图象在 x 轴上方：f(−x) = f(x) ≠ −f(x)，不是奇函数。' } },
  { key: 'inv', label: '$-\\dfrac1x$', f: (x) => -1 / x, dom: (x) => x !== 0, even: false, odd: true,
    why: { fold: '折过去落在第三象限，而原图象的左半边在第二象限：f(−x) = −f(x) ≠ f(x)，不是偶函数。' } },
  { key: 'cube', label: '$x^3$', f: (x) => x ** 3, dom: ALL, even: false, odd: true,
    why: { fold: '折过去落在第二象限，而 x³ 的左半边在第三象限：不是偶函数。' } },
  { key: 'sqx', label: '$x^2+x$', f: (x) => x * x + x, dom: ALL, even: false, odd: false,
    why: { fold: 'f(1) = 2，f(−1) = 0，f(−1) ≠ f(1)：不是偶函数。', turn: 'f(1) = 2，f(−1) = 0，f(−1) ≠ −f(1)：不是奇函数。x² + x 非奇非偶。' } },
  { key: 'seg', label: '$x^2,\\ x\\in[-1,2]$', f: (x) => x * x, dom: (x) => x >= -1 && x <= 2, even: false, odd: false,
    why: {
      fold: '定义域 [−1, 2] 不关于原点对称：右半边折过去落到 [−2, 0]，可 [−2, −1) 上没有图象接住。非奇非偶。',
      turn: '定义域 [−1, 2] 不关于原点对称：转过去落到 [−2, 0] 且在 x 轴下方，与原图象不重合。非奇非偶。',
    } },
];
const FF_X = [-3.7, 3.7];
const FF_MS = 1400;
const easeInOut = (u) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);

function ffMove(s) {
  const th = Math.PI * s.t;
  if (s.mode === 'fold') return ([x, y]) => [x * Math.cos(th), y]; // 绕 y 轴翻过去，从正面看就是 x ↦ x·cos θ
  if (s.mode === 'turn') return ([x, y]) => [x * Math.cos(th) - y * Math.sin(th), x * Math.sin(th) + y * Math.cos(th)];
  return (p) => p;
}

function ffRelation(fn, x0) {
  if (!fn.dom(x0)) return `$x_0=${num(x0)}$ 不在定义域内。`;
  if (!fn.dom(-x0)) return `$-x_0=${num(-x0)}$ <b>不在定义域内</b>，$f(-x_0)$ 无意义。`;
  const a = fn.f(-x0);
  const b = fn.f(x0);
  const near = (u, v) => Math.abs(u - v) < 1e-9;
  if (near(a, b)) return '$f(-x_0)=f(x_0)$';
  if (near(a, -b)) return '$f(-x_0)=-f(x_0)$';
  return '$f(-x_0)\\ne f(x_0)$，且 $f(-x_0)\\ne -f(x_0)$';
}

function ffVerdict(s) {
  const fn = s.fn;
  if (s.t < 1 || !s.mode) return { cls: '', html: '先<b>预测</b>：沿 $y$ 轴对折、绕原点旋转 $180^\\circ$ 后，橙色曲线能和蓝色图象的左半边重合吗？再点按钮。' };
  const ok = s.mode === 'fold' ? fn.even : fn.odd;
  if (ok) {
    const html = s.mode === 'fold'
      ? `<b>✓ 完全重合。</b>图象关于 $y$ 轴对称：对任意 $x$，$f(-x)=f(x)$，$f(x)=${fn.label.slice(1)} 是<b>偶函数</b>。`
      : `<b>✓ 完全重合。</b>图象关于原点对称：对任意 $x$，$f(-x)=-f(x)$，$f(x)=${fn.label.slice(1)} 是<b>奇函数</b>。`;
    return { cls: 'ok', html };
  }
  return { cls: 'warn', html: `<b>✗ 不重合。</b>${fn.why[s.mode]}` };
}

function ffReadout(s) {
  const { fn, x0 } = s;
  const fx = fn.dom(x0) ? `$f(x_0)=${num(fn.f(x0))}$` : '';
  const fmx = fn.dom(-x0) ? `$f(-x_0)=${num(fn.f(-x0))}$` : '$f(-x_0)$ 无意义';
  return `<span>$x_0=${num(x0)}$</span><span>${fx}</span><span>${fmx}</span><span class="rel">${ffRelation(fn, x0)}</span>`;
}

function initFold() {
  const s = { fn: FF_FUNCS[0], x0: 1.5, mode: null, t: 0, run: 0 };
  const b = board($('ff'), { x: FF_X, y: [-3.4, 4], w: 600 });
  const f = (x) => (s.fn.dom(x) ? s.fn.f(x) : NaN);
  b.fn(f, { n: 600 });
  // y 轴右边的图象（橙色），随对折 / 旋转移动
  b.curve((x) => (s.fn.dom(x) ? ffMove(s)([x, s.fn.f(x)]) : [NaN, NaN]), 0.005, FF_X[1], { cls: 'c2', n: 500 });
  const P = () => (s.fn.dom(s.x0) ? [s.x0, s.fn.f(s.x0)] : null);
  const Q = () => (s.fn.dom(-s.x0) ? [-s.x0, s.fn.f(-s.x0)] : null);
  b.seg(() => (P() && Q() ? [Q(), P()] : OFF), { cls: 'dash' });
  b.seg(() => (Q() ? [[-s.x0, 0], Q()] : OFF), { cls: 'dash' });
  b.seg(() => (P() ? [[s.x0, 0], P()] : OFF), { cls: 'dash' });
  b.pt(() => (s.fn.key === 'seg' ? [-1, 1] : null), { r: 6 });
  b.pt(Q, { r: 8 });
  b.pt(() => (P() ? ffMove(s)(P()) : null), { cls: 'c2', r: 8 });
  b.text(Q, () => (Q() ? pair(Q()) : ''), { cls: 'lb up', dx: -8, dy: -14 }).setAttribute('text-anchor', 'end');
  b.text(() => (P() && s.t === 0 ? P() : null), () => (P() ? pair(P()) : ''), { cls: 'lb up', dx: 8, dy: -14 });
  b.text(() => [-s.x0, 0], '−x₀', { cls: 'lb', dx: -14, dy: 46 });
  b.drag(() => [s.x0, 0], (x) => { s.x0 = Math.round(Math.min(3.4, Math.max(0.1, x)) * 20) / 20; });
  b.onUpdate = () => {
    $('ffRead').innerHTML = ffReadout(s);
    tex($('ffRead'));
    const v = ffVerdict(s);
    $('ffMsg').className = `tip feedback ${v.cls ? `fb-${v.cls}` : ''}`;
    $('ffMsg').innerHTML = v.html;
    tex($('ffMsg'));
  };

  const play = (mode) => {
    s.mode = mode; s.t = 0;
    const id = ++s.run;
    const start = performance.now();
    const tick = (now) => {
      if (id !== s.run) return;
      const u = Math.min(1, (now - start) / FF_MS);
      s.t = u < 1 ? easeInOut(u) : 1;
      b.update();
      if (u < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const reset = () => { s.run += 1; s.mode = null; s.t = 0; b.update(); };
  $('ffFold').addEventListener('click', () => play('fold'));
  $('ffTurn').addEventListener('click', () => play('turn'));
  $('ffReset').addEventListener('click', reset);

  const btns = $('ffBtns');
  btns.innerHTML = FF_FUNCS.map((fn, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-k="${fn.key}">$f(x)=${fn.label.slice(1)}</button>`).join('');
  tex(btns);
  btns.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.fn = FF_FUNCS.find((fn) => fn.key === btn.dataset.k);
    btns.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    reset();
  });
  b.update();
}

/* 第 7 页：f(x) = x², x ∈ [−1, 2] 与它关于 y 轴的镜像 */
function initDomain() {
  const b = board($('domEx'), { x: [-2.6, 2.6], y: [-0.5, 4.4], w: 440 });
  b.fn((x) => x * x, { from: -2, to: 1, cls: 'dash' });
  b.fn((x) => x * x, { from: -1, to: 2 });
  b.pt([-1, 1], { r: 6 });
  b.pt([2, 4], { r: 6 });
  b.pt([-2, 4], { hollow: true, r: 6 });
  b.text([-2, 4], 'f(−2) 无意义', { cls: 'lb up', dx: 12, dy: 30 });
  b.update();
}

/* 第 10 页：例 2 的图象 */
function initEx2() {
  const b = board($('ex2'), { x: [-2.5, 2.5], y: [-9, 9], w: 460, h: 300, ticks: [1, 3] });
  b.fn((x) => x ** 3 + 5 * x);
  markPair(b, [-1, -6], [1, 6], 'c2');
  b.text([1, 6], '(1, 6)', { cls: 'lb up', dx: 8, dy: 4 });
  b.text([-1, -6], '(−1, −6)', { cls: 'lb up', dx: -8, dy: 4 }).setAttribute('text-anchor', 'end');
  b.update();
}

/* 第 11 页：练习 3，已知 y 轴右边的图象（依课本题图描绘的示意曲线） */
const P3_FROM = 0.25;
const P3_TO = 3.4;
const p3 = (x) => 1.45 + 1.15 * Math.sin((2 * Math.PI * (x - P3_FROM)) / 3.2);
function initPractice3() {
  const e = board($('p3e'), { x: [-3.8, 3.8], y: [-0.8, 3.2], w: 460, tickLabels: false });
  e.fn(p3, { from: P3_FROM, to: P3_TO });
  stepOf(e.fn((x) => p3(-x), { from: -P3_TO, to: -P3_FROM, cls: 'c2' }), 2);
  e.update();
  const o = board($('p3o'), { x: [-3.8, 3.8], y: [-3.2, 3.2], w: 460, tickLabels: false });
  o.fn(p3, { from: P3_FROM, to: P3_TO });
  stepOf(o.fn((x) => -p3(-x), { from: -P3_TO, to: -P3_FROM, cls: 'c2' }), 4);
  o.update();
}

window.LESSON = {
  init() {
    initObserve();
    initFold();
    initDomain();
    initEx2();
    initPractice3();
  },
};
