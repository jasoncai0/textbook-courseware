'use strict';
/* 九下 5.4 二次函数与一元二次方程 · 本课互动：图 5-9 沿抛物线找根、图 5-10 三条抛物线、
 * a/b/c 滑块与 b²−4ac 联动（核心）、读图解不等式、逐步放大估根（表 1–3）。
 * 根与判别式全部按公式精确计算，图像逐点绘制。 */
const { board, fmt, tex, slider } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const boards = [];
const keep = (b) => { boards.push(b); return b; };
const tx = (v, d = 3) => fmt(v, d);
const quad = (a, b, c) => (x) => a * x * x + b * x + c;
function polyTex(a, b, c, rhs = '') {
  const t = (v, s) => (v === 0 ? '' : `${v > 0 ? '+' : '-'}${Math.abs(v) === 1 && s ? '' : tx(Math.abs(v))}${s}`);
  const A = a === 1 ? '' : a === -1 ? '-' : tx(a);
  return `${A}x^2${t(b, 'x')}${t(c, '')}${rhs}`;
}

/* ---------- 第 3 页：图 5-9 ---------- */
function initMN() {
  const f = quad(1, -2, -3);
  const st = { x: 0 };
  const b = keep(board($('mnBoard'), { x: [-3.6, 4.6], y: [-4.6, 4.2], w: 520, h: 480, ticks: [1, 1] }));
  b.fn(f, { cls: 'c1' });
  [[3, 'M'], [-1, 'N']].forEach(([x, n]) => { b.pt([x, 0], { r: 5 }); b.text([x, 0], n, { cls: 'lb', dx: 6, dy: -8 }); });
  b.seg(() => [[st.x, 0], [st.x, f(st.x)]], { cls: 'dash' });
  b.drag(() => [st.x, f(st.x)], (px) => { st.x = clamp(snap(px, 0.25), -1.75, 3.75); });
  b.onUpdate = () => {
    const y = f(st.x);
    const m = $('mnMsg');
    const root = Math.abs(y) < 1e-9;
    m.className = `tip feedback ${root ? 'fb-ok' : ''}`;
    m.innerHTML = `$x=${tx(st.x)}$ 时，$y=${tx(st.x)}^2-2\\times${st.x < 0 ? `(${tx(st.x)})` : tx(st.x)}-3=${tx(y)}$`
      + (root ? `——$y=0$！点在 $x$ 轴上，$x=${tx(st.x)}$ 是方程 $x^2-2x-3=0$ 的根。` : `，${y > 0 ? '在 $x$ 轴上方' : '在 $x$ 轴下方'}。`);
    tex(m);
  };
}

/* ---------- 第 4 页：图 5-10 ---------- */
function initThree() {
  [
    ['t1Board', quad(-0.5, -4, -6), [-7.6, 1.6], [-7.2, 3.2], [[-6, 0], [-2, 0]], 'y=−½x²−4x−6'],
    ['t2Board', quad(1, -6, 9), [-1.6, 6.6], [-1.6, 7.2], [[3, 0]], 'y=x²−6x+9'],
    ['t3Board', quad(1, -2, 3), [-1.6, 6.6], [-1.6, 7.2], [], 'y=x²−2x+3'],
  ].forEach(([id, f, xr, yr, roots, label]) => {
    const b = keep(board($(id), { x: xr, y: yr, w: 420, h: 320, ticks: [1, 1] }));
    b.fn(f, { cls: 'c1' });
    roots.forEach((p) => b.pt(p, { r: 6, cls: 'c2' }));
    b.text([xr[1], yr[1]], label, { cls: 'lb up end', dx: -6, dy: 18 });
  });
}

/* ---------- 第 5 页：核心 a、b、c 与 b² − 4ac ---------- */
const PRE = [[1, -2, -3, '图 5-9'], [-0.5, -4, -6, '图 5-10 ①'], [1, -6, 9, '图 5-10 ②'], [1, -2, 3, '图 5-10 ③']];
function initCore() {
  const st = { a: 1, b: -2, c: -3 };
  const f = (x) => st.a * x * x + st.b * x + st.c;
  const D = () => st.b * st.b - 4 * st.a * st.c;
  const roots = () => {
    const d = D();
    if (d < -1e-12) return [];
    if (Math.abs(d) < 1e-12) return [-st.b / (2 * st.a)];
    const r = Math.sqrt(d);
    return [(-st.b - r) / (2 * st.a), (-st.b + r) / (2 * st.a)].sort((p, q) => p - q);
  };
  const b = keep(board($('qBoard'), { x: [-8.6, 8.6], y: [-8.6, 8.6], w: 540, h: 540, ticks: [1, 1] }));
  b.fn(f, { cls: 'c1' });
  [0, 1].forEach((i) => b.pt(() => { const r = roots()[i]; return r === undefined || Math.abs(r) > 8.6 ? null : [r, 0]; }, { r: 7, cls: 'c2' }));
  b.onUpdate = () => {
    [['qA', st.a], ['qB', st.b], ['qC', st.c]].forEach(([id, v]) => { $(`${id}V`).textContent = fmt(v); });
    const d = D();
    const rs = roots();
    const pos = clamp(50 + d * 1.2, 2, 98); // 数轴：0 在中间
    const cls = d > 1e-12 ? 'pos' : d < -1e-12 ? 'neg' : 'zero';
    $('qDelta').innerHTML = `<p class="eq">方程 $${polyTex(st.a, st.b, st.c, '=0')}$</p>`
      + `<p>$b^2-4ac=${st.b < 0 ? `(${tx(st.b)})` : tx(st.b)}^2-4\\times${st.a < 0 ? `(${tx(st.a)})` : tx(st.a)}\\times${st.c < 0 ? `(${tx(st.c)})` : tx(st.c)}=$ <b class="dv ${cls}">${tx(d)}</b></p>`
      + `<div class="dbar"><span class="z">0</span><i class="${cls}" style="left:${pos}%"></i><em>负</em><em>正</em></div>`;
    const m = $('qMsg');
    m.className = `tip feedback ${cls === 'neg' ? 'fb-warn' : 'fb-ok'}`;
    if (cls === 'pos') m.innerHTML = `$b^2-4ac&gt;0$：<b>两个</b>公共点；方程有两个不相等的实数根 $x_1=${tx(rs[0])}$，$x_2=${tx(rs[1])}$。`;
    else if (cls === 'zero') m.innerHTML = `$b^2-4ac=0$：<b>只有一个</b>公共点（顶点在 $x$ 轴上）；$x_1=x_2=${tx(rs[0])}$。`;
    else m.innerHTML = `$b^2-4ac&lt;0$：<b>没有</b>公共点，抛物线整个在 $x$ 轴${st.a > 0 ? '上' : '下'}方；方程没有实数根。`;
    tex($('qDelta')); tex(m);
  };
  const ids = { a: 'qA', b: 'qB', c: 'qC' };
  Object.entries(ids).forEach(([k, id]) => slider($(id), (v) => { st[k] = k === 'a' && v === 0 ? 0.5 : v; b.update(); }));
  $('qPre').innerHTML = PRE.map(([a, bb, c, t]) => `<button type="button" class="btn" data-p="${a},${bb},${c}">${t}</button>`).join('');
  $('qPre').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-p]');
    if (!btn) return;
    const [a, bb, c] = btn.dataset.p.split(',').map(Number);
    Object.assign(st, { a, b: bb, c });
    $('qA').value = a; $('qB').value = bb; $('qC').value = c;
    b.update();
  });
}

/* ---------- 第 8 页：读图 y = x² − 4x + 3 ---------- */
function initRead() {
  const f = quad(1, -4, 3);
  const st = { x: 0, pos: false, neg: false };
  const b = keep(board($('rdBoard'), { x: [-1.6, 5.6], y: [-1.8, 5.2], w: 520, h: 420, ticks: [1, 1] }));
  const p1 = b.seg([[-1.6, 0], [1, 0]], { cls: 'zone-p' });
  const p2 = b.seg([[3, 0], [5.6, 0]], { cls: 'zone-p' });
  const n1 = b.seg([[1, 0], [3, 0]], { cls: 'zone-n' });
  b.seg([[2, -1.8], [2, 5.2]], { cls: 'axis-r' });
  b.fn(f, { cls: 'c1' });
  b.seg(() => [[st.x, 0], [st.x, f(st.x)]], { cls: 'dash' });
  b.pt(() => [st.x, f(st.x)], { r: 6, cls: 'c2' });
  [[1, 'M'], [3, 'N'], [2, 'P']].forEach(([x, n]) => { b.pt([x, 0], { r: 4 }); b.text([x, 0], n, { cls: 'lb', dx: 4, dy: -8 }); });
  b.drag(() => [st.x, 0], (px) => { st.x = clamp(snap(px, 0.25), -1, 5); });
  b.onUpdate = () => {
    p1.style.display = st.pos ? '' : 'none'; p2.style.display = st.pos ? '' : 'none'; n1.style.display = st.neg ? '' : 'none';
    const y = f(st.x);
    const m = $('rdMsg');
    const s = Math.abs(y) < 1e-9 ? '=0' : y > 0 ? '&gt;0' : '&lt;0';
    m.className = `tip feedback ${y > 1e-9 ? 'fb-ok' : y < -1e-9 ? 'fb-warn' : ''}`;
    m.innerHTML = `$x=${tx(st.x)}$ 时，$y=${tx(y)}${s === '=0' ? '' : ''}$，即 $x^2-4x+3${s}$：图像上的点在 $x$ 轴${y > 1e-9 ? '上方' : y < -1e-9 ? '下方' : '上'}。`;
    tex(m);
  };
  $('rdPos').addEventListener('click', () => { st.pos = !st.pos; b.update(); });
  $('rdNeg').addEventListener('click', () => { st.neg = !st.neg; b.update(); });
}

/* ---------- 第 9 页：逐步放大估根（表 1–3） ---------- */
function initZoom() {
  const f = quad(1, 2, -5);
  const ROOTS = [{ t: '1 与 2 之间的根', L: 1 }, { t: '$-4$ 与 $-3$ 之间的根', L: -4 }];
  const st = { r: 0, L: 1, k: 0 }; // 区间 [L, L + 10^−k]
  const r6 = (v) => Math.round(v * 1e9) / 1e9;
  const all = keep(board($('zmAll'), { x: [-5.2, 3.2], y: [-6.6, 4.2], w: 420, h: 300, ticks: [1, 2] }));
  all.fn(f, { cls: 'c1' });
  all.poly(() => { const w = 10 ** -st.k; return [[st.L, -6.6], [st.L + w, -6.6], [st.L + w, 4.2], [st.L, 4.2]]; }, { cls: 'band' });
  let zb = null;
  const step = () => 10 ** -(st.k + 1);
  const xs = () => Array.from({ length: 11 }, (_, i) => r6(st.L + i * step()));
  function change() {
    const v = xs();
    for (let i = 0; i < 10; i++) if (f(v[i]) * f(v[i + 1]) <= 0) return i;
    return -1;
  }
  function drawZoom() {
    const w = 10 ** -st.k;
    const ys = [f(st.L), f(st.L + w)];
    const lo = Math.min(...ys, 0);
    const hi = Math.max(...ys, 0);
    const pad = (hi - lo) * 0.15;
    $('zmBoard').innerHTML = '';
    zb = keep(board($('zmBoard'), { x: [st.L - w * 0.06, st.L + w * 1.06], y: [lo - pad, hi + pad], w: 420, h: 250, ticks: [step(), 0], tickLabels: false, labels: ['', ''] }));
    zb.seg([[st.L - w, 0], [st.L + 2 * w, 0]], { cls: 'xax' });
    zb.text([st.L + w * 1.06, 0], 'x 轴', { cls: 'lb up end', dx: -4, dy: -8 });
    zb.fn(f, { cls: 'c1', from: st.L, to: st.L + w });
    xs().forEach((x) => zb.pt([x, f(x)], { r: 3.5 }));
    const i = change();
    if (i >= 0) [i, i + 1].forEach((j) => zb.pt([xs()[j], f(xs()[j])], { r: 6, cls: 'c2' }));
    zb.text([st.L, lo - pad], tx(st.L, 4), { cls: 'lb up', dx: 2, dy: -6 });
    zb.text([st.L + w, lo - pad], tx(r6(st.L + w), 4), { cls: 'lb up end', dx: -2, dy: -6 });
    zb.update();
  }
  function render() {
    const v = xs();
    const i = change();
    const d = st.k + 1;
    const cell = (x) => r6(f(x)).toFixed(2 * d).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    const hl = (j) => (j === i || j === i + 1 ? ' class="on"' : '');
    const part = (js) => `<tr><th>$x$</th>${js.map((j) => `<td${hl(j)}>${v[j].toFixed(d)}</td>`).join('')}</tr><tr><th>$y$</th>${js.map((j) => `<td${hl(j)}><span class="${f(v[j]) < 0 ? 'neg' : 'pos'}">${cell(v[j])}</span></td>`).join('')}</tr>`;
    $('zmTab').innerHTML = part([0, 1, 2, 3, 4, 5]) + part([6, 7, 8, 9, 10]);
    tex($('zmTab'));
    const m = $('zmMsg');
    const a = v[i];
    const c = v[i + 1];
    const near = Math.abs(f(a)) < Math.abs(f(c)) ? a : c;
    m.className = 'tip feedback fb-ok';
    m.innerHTML = `$y$ 在 $x=${a.toFixed(d)}$ 与 $x=${c.toFixed(d)}$ 之间变号，所以 $${a.toFixed(d)}&lt;x&lt;${c.toFixed(d)}$；精确到 ${step()}，$x\\approx${near.toFixed(d)}$。`;
    tex(m);
    $('zmIn').disabled = st.k >= 2;
    drawZoom();
    all.update();
  }
  $('zmRoot').innerHTML = ROOTS.map((r, i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-r="${i}">${r.t}</button>`).join('');
  tex($('zmRoot'));
  $('zmRoot').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-r]');
    if (!btn) return;
    st.r = +btn.dataset.r; st.L = ROOTS[st.r].L; st.k = 0;
    $('zmRoot').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    render();
  });
  $('zmIn').addEventListener('click', () => { const i = change(); if (i < 0 || st.k >= 2) return; st.L = xs()[i]; st.k += 1; render(); });
  $('zmOut').addEventListener('click', () => { st.L = ROOTS[st.r].L; st.k = 0; render(); });
  render();
}

window.LESSON = {
  init() { initMN(); initThree(); initCore(); initRead(); initZoom(); },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
