'use strict';
/* 九下 5.3 用待定系数法确定二次函数表达式 · 本课互动：拖动已知点实时列方程组、解系数、画抛物线（核心）；
 * 例 3 与练习 2 的图像；习题 3 墨迹系数（对称轴随 a 移动）。所有系数由方程组精确求解。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const boards = [];
const keep = (b) => { boards.push(b); return b; };
const tx = (v) => fmt(v, 3);
const par = (x) => (x < 0 ? `(${tx(x)})` : tx(x));
const sgn = (v, t) => (v === 0 ? '' : `${v > 0 ? '+' : '-'}${Math.abs(v) === 1 && t ? '' : tx(Math.abs(v))}${t}`);

/** 二次函数表达式的 TeX：a、b、c 为数 */
function polyTex(a, b, c) {
  const A = a === 1 ? '' : a === -1 ? '-' : tx(a);
  return `y=${A}x^2${sgn(b, 'x')}${sgn(c, '')}`.replace('y=+', 'y=');
}
/** 3×3 线性方程组（克拉默法则）；奇异返回 null */
function solve3(m, r) {
  const det = (q) => q[0][0] * (q[1][1] * q[2][2] - q[1][2] * q[2][1]) - q[0][1] * (q[1][0] * q[2][2] - q[1][2] * q[2][0]) + q[0][2] * (q[1][0] * q[2][1] - q[1][1] * q[2][0]);
  const D = det(m);
  if (Math.abs(D) < 1e-9) return null;
  return [0, 1, 2].map((j) => det(m.map((row, i) => row.map((v, k) => (k === j ? r[i] : v)))) / D);
}

/* ---------- 第 3 页：核心——几个点钉住一条抛物线 ---------- */
const FORMS = [
  { key: 'a', tex: 'y=ax^2', n: 1, pts: [[-2, 8]] },
  { key: 'ac', tex: 'y=ax^2+c', n: 2, pts: [[-2, 8], [-1, 5]] },
  { key: 'abc', tex: 'y=ax^2+bx+c', n: 3, pts: [[-3, 6], [-2, -1], [0, -3]] },
];
function fit(form, pts) {
  if (form.key === 'a') {
    const [[x, y]] = pts;
    return x === 0 ? null : { a: y / (x * x), b: 0, c: 0 };
  }
  if (form.key === 'ac') {
    const [[x1, y1], [x2, y2]] = pts;
    if (x1 * x1 === x2 * x2) return null;
    const a = (y1 - y2) / (x1 * x1 - x2 * x2);
    return { a, b: 0, c: y1 - a * x1 * x1 };
  }
  const s = solve3(pts.map(([x]) => [x * x, x, 1]), pts.map(([, y]) => y));
  return s && { a: s[0], b: s[1], c: s[2] };
}
function eqTex(form, [x, y]) {
  const terms = { a: `${par(x)}^2a`, ac: `${par(x)}^2a+c`, abc: `${par(x)}^2a${x < 0 ? '' : '+'}${tx(x)}b+c` }[form.key];
  return `${tx(y)}=${terms}`;
}
function initFit() {
  const st = { form: FORMS[2], pts: FORMS.map((f) => f.pts.map((p) => [...p])), less: false };
  const cur = () => st.pts[FORMS.indexOf(st.form)];
  const b = keep(board($('fitBoard'), { x: [-5.6, 5.6], y: [-5.6, 10.6], w: 480, h: 640, ticks: [1, 1] }));
  const sol = () => fit(st.form, cur());
  const FAM = [-1.5, -0.5, 0.5, 1, 2.5];
  const fam = FAM.map((a) => b.fn((x) => {
    if (!(st.less && st.form.key === 'abc')) return NaN;
    const [[x1, y1], [x2, y2]] = cur();
    if (x1 === x2) return NaN;
    const bb = ((y1 - a * x1 * x1) - (y2 - a * x2 * x2)) / (x1 - x2);
    return a * x * x + bb * x + (y1 - a * x1 * x1 - bb * x1);
  }, { cls: 'fam' }));
  const main = b.fn((x) => { const s = sol(); return s && !st.less ? s.a * x * x + s.b * x + s.c : NaN; }, { cls: 'c1' });
  [0, 1, 2].forEach((i) => {
    const on = () => i < st.form.n - (st.less ? 1 : 0);
    b.text(() => (on() ? cur()[i] : null), () => `(${tx(cur()[i][0])}, ${tx(cur()[i][1])})`, { cls: 'lb up', dx: 14, dy: -10 });
    b.drag(() => (on() ? cur()[i] : [99, 99]), (px, py) => {
      if (!on()) return;
      cur()[i] = [clamp(snap(px, 1), -5, 5), clamp(snap(py, 1), -5, 10)];
    });
  });
  b.onUpdate = () => {
    fam.forEach((p) => { p.style.display = st.less && st.form.key === 'abc' ? '' : 'none'; });
    const n = st.form.n - (st.less ? 1 : 0);
    const P = cur().slice(0, n);
    const lines = P.map((p) => eqTex(st.form, p));
    $('fitEqs').innerHTML = `<p>设 $${st.form.tex}$，${n} 个待定系数${st.less ? '，却只有 ' + n + ' 个点' : ''}。代入：</p>`
      + `<p class="sys">$${n > 1 ? `\\begin{cases}${lines.join(',\\\\')}.\\end{cases}` : lines[0]}$</p>`;
    const m = $('fitMsg');
    const s = sol();
    if (st.less) {
      m.className = 'tip feedback fb-warn';
      m.innerHTML = '3 个未知数只有 2 个方程：解不唯一。图中的几条抛物线都经过这两个点。';
    } else if (!s) {
      m.className = 'tip feedback fb-warn';
      m.innerHTML = st.form.key === 'a' ? '点在 $y$ 轴上（$x=0$）：$0=0\\cdot a$，求不出 $a$。换一个点。' : '有两个点的横坐标相同或互为相反数（对这种形式）——方程组没有唯一解。拖开一点。';
    } else if (Math.abs(s.a) < 1e-9) {
      m.className = 'tip feedback fb-warn';
      m.innerHTML = `解得 $a=0$：${st.form.key === 'abc' ? '三点共线，' : ''}不是二次函数。`;
    } else {
      m.className = 'tip feedback fb-ok';
      m.innerHTML = `解得 ${st.form.key === 'a' ? '' : '唯一的一组解：'}$${['a', 'ac', 'abc'].indexOf(st.form.key) >= 0 ? `a=${tx(s.a)}` : ''}${st.form.key === 'abc' ? `,\\ b=${tx(s.b)}` : ''}${st.form.key !== 'a' ? `,\\ c=${tx(s.c)}` : ''}$，所求表达式 $${polyTex(+s.a.toFixed(3), +s.b.toFixed(3), +s.c.toFixed(3))}$。`;
    }
    main.style.display = s && !st.less && Math.abs(s.a) > 1e-9 ? '' : 'none';
    tex($('fitEqs')); tex(m);
    $('fitLess').hidden = st.form.key !== 'abc';
    $('fitLess').classList.toggle('solid', st.less);
  };
  $('fitForms').innerHTML = FORMS.map((f) => `<button type="button" class="btn${f === st.form ? ' solid' : ''}" data-k="${f.key}">$${f.tex}$</button>`).join('');
  tex($('fitForms'));
  $('fitForms').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    st.form = FORMS.find((f) => f.key === btn.dataset.k);
    st.less = false;
    $('fitForms').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  $('fitLess').addEventListener('click', () => { st.less = !st.less; b.update(); });
}

/* ---------- 第 5 页：例 3 的图像 ---------- */
function initEx3() {
  const b = keep(board($('ex3Board'), { x: [-4.6, 2.6], y: [-5, 7.6], w: 420, h: 560, ticks: [1, 1] }));
  b.fn((x) => 2 * x * x + 3 * x - 3, { cls: 'c1' });
  [[-3, 6], [-2, -1], [0, -3]].forEach((p) => { b.pt(p, { r: 6, cls: 'c2' }); b.text(p, `(${tx(p[0])}, ${tx(p[1])})`, { cls: 'lb up', dx: 10, dy: -8 }); });
}

/* ---------- 第 7 页：练习 2 的图像 ---------- */
function initPr2() {
  const b = keep(board($('pr2Board'), { x: [-2.6, 4.6], y: [-3.6, 5.6], w: 420, h: 400, ticks: [1, 1] }));
  b.fn((x) => -x * x + 2 * x + 3, { cls: 'c1' });
  [[0, 3], [3, 0], [1, 4]].forEach((p) => { b.pt(p, { r: 6, cls: 'c2' }); b.text(p, `(${p[0]}, ${p[1]})`, { cls: 'lb up', dx: 10, dy: -8 }); });
  $('pr2Board').closest('details').addEventListener('toggle', () => requestAnimationFrame(() => b.update()));
}

/* ---------- 第 8 页：习题 3 墨迹系数 ---------- */
function initInk() {
  const st = { a: 1 };
  const f = (x) => st.a * x * x + 6 * x - 5;
  const axis = () => -6 / (2 * st.a);
  const b = keep(board($('inkBoard'), { x: [-5.6, 2.6], y: [-15, 4], w: 460, h: 330, ticks: [1, 2] }));
  b.seg([[-1, -15], [-1, 4]], { cls: 'dash' });
  b.seg(() => [[axis(), -15], [axis(), 4]], { cls: 'axis-r' });
  b.fn(f, { cls: 'c1' });
  b.pt(() => [axis(), f(axis())], { r: 6, cls: 'c2' });
  const input = $('inkA');
  input.addEventListener('input', () => { st.a = +input.value; b.update(); });
  input.setAttribute('data-noswipe', '');
  b.onUpdate = () => {
    $('inkAV').textContent = fmt(st.a);
    const ok = Math.abs(st.a - 3) < 1e-9;
    const m = $('inkMsg');
    m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `$a=${fmt(st.a)}$：最低点的横坐标 $-\\dfrac{6}{2a}=${fmt(axis(), 3)}$${ok ? '，恰好是 $-1$！最小值 $3-6-5=-8$，和课本图一致。' : '，不是 $-1$。'}`;
    tex(m);
  };
}

window.LESSON = {
  init() { initFit(); initEx3(); initPr2(); initInk(); },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
