'use strict';
/* 八下 11.2 反比例函数的图像与性质 · 本课互动：描点连线、三种错误连法、y=±6/x 与 y=±4/x 对照、
 * k 滑块（数学实验室）、“每一个象限内”双点比较、例 1、中心对称、菱形对角线、例 3 读范围、矩形面积 |k|。
 * 所有曲线都按 y = k/x 逐点计算绘制。 */
const { board, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const neg = (s) => String(s).replace(/-/g, '−');
const num = (v, d = 2) => neg(fmt(v, d));
const P = (x, y) => `(${num(x)}, ${num(y)})`;
/** 保证 |x| ≥ lo，且不为 0：拖过 0 时按拖动所在的一侧取符号 */
const awayFrom0 = (x, lo, hi, st) => { const s = x < 0 ? -1 : 1; return s * clamp(snap(Math.abs(x), st), lo, hi); };
const redraws = [];

/** 画双曲线 y = k/x 的两支（分开画，不跨过 y 轴） */
function hyper(b, k, o = {}) {
  const lim = o.lim || 8;
  const kk = () => (typeof k === 'function' ? k() : k);
  const a = () => Math.min(lim, Math.abs(kk()) / (o.ymax || lim + 1));
  const p1 = b.fn((x) => kk() / x, { from: a, to: lim, cls: o.cls || 'c1', n: 300 });
  const p2 = b.fn((x) => kk() / x, { from: -lim, to: () => -a(), cls: o.cls || 'c1', n: 300 });
  return [p1, p2];
}

/* ---------- 第 4 页：描点连线 ---------- */
function initPlot() {
  const XS = [-6, -4, -3, -2, -1, 1, 2, 3, 4, 6];
  const s = { on: new Set(), joined: false };
  const b = board($('plotBoard'), { x: [-7.5, 7.5], y: [-7.5, 7.5], w: 440, ticks: 2 });
  const curves = hyper(b, 6, { lim: 7.5 });
  XS.forEach((x) => b.pt([x, 6 / x], { cls: 'c2', r: 6, show: () => s.on.has(x) }));
  b.text(() => (s.joined ? [2.2, 6.6] : null), 'y = 6/x', { cls: 'lb' });
  const cells = [...$('plotTab').rows[1].cells].slice(1);
  b.onUpdate = () => {
    curves.forEach((c) => { c.style.display = s.joined ? '' : 'none'; });
    const m = $('plotMsg');
    const n = s.on.size;
    m.className = `feedback tip ${s.joined ? 'fb-ok' : ''}`;
    m.innerHTML = s.joined ? '两支分别用平滑的曲线连接：这就是 $y=\\dfrac6x$ 的图像．'
      : `已描出 ${n} 个点${n === XS.length ? '，点“连线”试试．' : '．'}`;
    tex(m);
  };
  const sync = () => {
    cells.forEach((td, i) => { if (td.querySelector('.blank.ok')) s.on.add(XS[i]); });
    b.update();
  };
  new MutationObserver(sync).observe($('plotTab'), { subtree: true, attributes: true, attributeFilter: ['class'] });
  $('fillAll').addEventListener('click', () => {
    cells.forEach((td, i) => {
      const inp = td.querySelector('input');
      inp.value = String(6 / XS[i]);
      inp.dispatchEvent(new Event('change'));
    });
  });
  $('joinBtn').addEventListener('click', () => { s.joined = true; b.update(); });
  $('resetPlot').addEventListener('click', () => {
    s.on.clear(); s.joined = false;
    cells.forEach((td) => { const bl = td.querySelector('.blank'); bl.classList.remove('ok', 'no'); bl.querySelector('input').value = ''; });
    b.update();
  });
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 第 5 页：三种错误连法 ---------- */
function initBad() {
  const XS = [-6, -4, -3, -2, -1, 1, 2, 3, 4, 6];
  const mk = (id) => {
    const b = board($(id), { x: [-7.5, 7.5], y: [-7.5, 7.5], w: 300, ticks: 2, tickLabels: false });
    hyper(b, 6, { lim: 7.5, cls: 'thin' });
    XS.forEach((x) => b.pt([x, 6 / x], { r: 4 }));
    return b;
  };
  const b1 = mk('bad1');
  [XS.filter((x) => x > 0), XS.filter((x) => x < 0)].forEach((xs) => xs.slice(1).forEach((x, i) => b1.seg([[xs[i], 6 / xs[i]], [x, 6 / x]], { cls: 'bad' })));
  b1.pt([1.5, 4], { cls: 'c2', r: 5 });
  const b2 = mk('bad2');
  b2.seg([[-1, -6], [1, 6]], { cls: 'bad' });
  const b3 = mk('bad3');
  b3.seg([[6, 1], [7.5, 0]], { cls: 'bad' }); b3.seg([[1, 6], [0, 7.5]], { cls: 'bad' });
  b3.seg([[-6, -1], [-7.5, 0]], { cls: 'bad' }); b3.seg([[-1, -6], [0, -7.5]], { cls: 'bad' });
  [b1, b2, b3].forEach((b) => { b.update(); redraws.push(() => b.update()); });
}

/* ---------- 第 6 页：y = ±6/x、y = ±4/x ---------- */
function initTry() {
  const b = board($('tryBoard'), { x: [-7.5, 7.5], y: [-7.5, 7.5], w: 440, ticks: 2 });
  const C = [
    { k: 6, cls: 'c1', t: 'y = 6/x', on: true },
    { k: -6, cls: 'c2', t: 'y = −6/x', on: true },
    { k: 4, cls: 'c3', t: 'y = 4/x', on: false },
    { k: -4, cls: 'c4', t: 'y = −4/x', on: false },
  ];
  C.forEach((c) => { c.paths = hyper(b, c.k, { lim: 7.5, cls: c.cls }); });
  $('tryBtns').innerHTML = C.map((c, i) => `<button type="button" class="btn${c.on ? ' solid' : ''} sw-${c.cls}" data-i="${i}">${c.t}</button>`).join('');
  const sync = () => C.forEach((c, i) => {
    c.paths.forEach((p) => { p.style.display = c.on ? '' : 'none'; });
    $('tryBtns').children[i].classList.toggle('solid', c.on);
  });
  $('tryBtns').addEventListener('click', (e) => { const btn = e.target.closest('[data-i]'); if (!btn) return; const c = C[+btn.dataset.i]; c.on = !c.on; sync(); });
  b.onUpdate = sync;
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 第 7 页：数学实验室 拖动 k ---------- */
function initK() {
  const s = { k: 6, play: 0 };
  const b = board($('kBoard'), { x: [-8.5, 8.5], y: [-8.5, 8.5], w: 520, ticks: 2 });
  hyper(b, () => s.k, { lim: 8.5 });
  hyper(b, 1, { lim: 8.5, cls: 'dash' });
  b.text([1.1, 1.6], 'y = 1/x', { cls: 'lb up' });
  b.pt(() => [1, s.k], { cls: 'c2', r: 6 });
  b.text(() => [1, s.k], () => `(1, ${num(s.k)})`, { cls: 'lb up', dx: 10, dy: s.k > 0 ? -6 : 22 });
  b.onUpdate = () => {
    const k = s.k;
    $('kV').textContent = num(k);
    $('kIn').value = k;
    const pos = k > 0;
    $('kMsg').innerHTML = `$y=\\dfrac{${num(k)}}{x}$：两支在第${pos ? '一、三' : '二、四'}象限；在每一个象限内，$y$ 随 $x$ 的增大而<b>${pos ? '减小' : '增大'}</b>．图像过点 $(1,${num(k)})$，$|k|=${num(Math.abs(k))}$．（虚线：$y=\\dfrac1x$）`;
    tex($('kMsg'));
  };
  $('kIn').addEventListener('input', () => {
    let v = +$('kIn').value;
    if (v === 0) v = s.k > 0 ? -0.5 : 0.5; // 跳过 k = 0
    s.k = v; b.update();
  });
  $('kIn').setAttribute('data-noswipe', '');
  $('kPlay').addEventListener('click', () => {
    if (s.play) { cancelAnimationFrame(s.play); s.play = 0; $('kPlay').textContent = '▶ 自动变化'; return; }
    $('kPlay').textContent = '■ 停止';
    const t0 = performance.now();
    const tick = (now) => {
      const ph = ((now - t0) / 9000) % 1; // 9 s 一个来回：0.5→9→0.5，然后 −0.5→−9→−0.5
      const u = ph < 0.5 ? ph * 2 : (ph - 0.5) * 2;
      const mag = 0.5 + 8.5 * Math.sin(Math.PI * u);
      s.k = (ph < 0.5 ? 1 : -1) * Math.round(mag * 2) / 2;
      b.update();
      s.play = requestAnimationFrame(tick);
    };
    s.play = requestAnimationFrame(tick);
  });
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 第 8 页：“在每一个象限内” ---------- */
function initQuad() {
  const s = { a: 2, c: 4 };
  const f = (x) => 6 / x;
  const b = board($('quadBoard'), { x: [-7.5, 7.5], y: [-7.5, 7.5], w: 360, ticks: 2 });
  hyper(b, 6, { lim: 7.5 });
  [['a', 'A'], ['c', 'B']].forEach(([key, name]) => {
    b.seg(() => [[s[key], 0], [s[key], f(s[key])]], { cls: 'dash' });
    b.text(() => [s[key], f(s[key])], name, { cls: 'lb', dx: 8, dy: -8 });
    b.drag(() => [s[key], f(s[key])], (x) => { s[key] = awayFrom0(x, 1, 7, 0.5); });
  });
  b.onUpdate = () => {
    const [p, q] = s.a <= s.c ? [['A', s.a], ['B', s.c]] : [['B', s.c], ['A', s.a]];
    const same = Math.sign(s.a) === Math.sign(s.c);
    const m = $('quadMsg');
    if (s.a === s.c) { m.className = 'tip feedback'; m.textContent = '两点重合了，拖开一些．'; return; }
    const up = f(q[1]) > f(p[1]);
    m.className = `tip feedback ${same ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `$x_${p[0]}=${num(p[1])}&lt;x_${q[0]}=${num(q[1])}$，$y_${p[0]}=${num(f(p[1]))}$，$y_${q[0]}=${num(f(q[1]))}$：$y$ ${up ? '变大' : '变小'}了．`
      + (same ? '（同一支上：$y$ 随 $x$ 增大而减小 ✓）' : '（<b>两点不在同一支</b>：结论不成立！）');
    tex(m);
  };
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 第 9 页：例 1 y = −8/x ---------- */
function initEx1() {
  const b = board($('ex1Board'), { x: [-14, 15], y: [-17, 17], w: 420, h: 460, ticks: [4, 4] });
  hyper(b, -8, { lim: 15, ymax: 17 });
  [[[2, -4], 'A(2, −4)', 10, 20], [[0.5, -16], 'B(½, −16)', 10, 6], [[-3, 5], 'C(−3, 5)', -86, -8]].forEach(([p, t, dx, dy]) => {
    b.pt(p, { cls: 'c2', r: 6 });
    b.text(p, t, { cls: 'lb up', dx, dy });
  });
  b.text([-13, -12], 'y = −8/x', { cls: 'lb' });
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 第 10 页：中心对称 ---------- */
function initSym() {
  const s = { m: 2 };
  const f = (x) => -8 / x;
  const b = board($('symBoard'), { x: [-9, 9], y: [-9, 9], w: 440, ticks: 2 });
  hyper(b, -8, { lim: 9 });
  b.pt([4, -2], { r: 5 }); b.text([4, -2], 'A', { cls: 'lb', dx: 6, dy: 22 });
  b.pt([-4, 2], { r: 5 }); b.text([-4, 2], "A'", { cls: 'lb', dx: -22, dy: -8 });
  b.seg(() => [[s.m, f(s.m)], [-s.m, -f(s.m)]], { cls: 'dash' });
  b.pt(() => [-s.m, -f(s.m)], { cls: 'c2', r: 7 });
  b.text(() => [s.m, f(s.m)], 'B', { cls: 'lb', dx: 10, dy: -8 });
  b.text(() => [-s.m, -f(s.m)], "B'", { cls: 'lb', dx: 10, dy: -8 });
  b.drag(() => [s.m, f(s.m)], (x) => { s.m = awayFrom0(x, 1, 8, 0.5); });
  b.onUpdate = () => {
    const [m, n] = [s.m, f(s.m)];
    $('symMsg').innerHTML = `$B${P(m, n)}$，$B'${P(-m, -n)}$；$(${num(-m)})\\times(${num(-n)})=${num(m * n)}$，$B'$ 也在图像上．`;
    tex($('symMsg'));
  };
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 第 12 页：例 2 菱形 ---------- */
function initRhombus() {
  const s = { x: 2 };
  const host = $('rhBoard');
  const fig = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  fig.setAttribute('viewBox', '0 0 240 236');
  fig.setAttribute('class', 'rh-fig');
  host.before(fig);
  const b = board(host, { x: [-0.8, 11], y: [-0.8, 11], w: 360, ticks: 1 });
  b.fn((x) => 10 / x, { from: 0.9, to: 11, cls: 'c1' });
  b.seg(() => [[s.x, 0], [s.x, 10 / s.x]], { cls: 'dash' });
  b.seg(() => [[0, 10 / s.x], [s.x, 10 / s.x]], { cls: 'dash' });
  b.drag(() => [s.x, 10 / s.x], (x) => { s.x = snap(clamp(x, 1, 10), 0.5); });
  b.onUpdate = () => {
    const y = 10 / s.x;
    const U = 22; // 1 cm = 22 单位（横竖同比例）
    const [cx, cy] = [120, 118];
    const [hx, hy] = [(s.x * U) / 2, (y * U) / 2];
    fig.innerHTML = `<polygon points="${cx - hx},${cy} ${cx},${cy - hy} ${cx + hx},${cy} ${cx},${cy + hy}" fill="rgba(79,155,208,.2)" stroke="#1d6fa5" stroke-width="2"/>`
      + `<line x1="${cx - hx}" y1="${cy}" x2="${cx + hx}" y2="${cy}" stroke="#d9711c" stroke-width="2.5"/><line x1="${cx}" y1="${cy - hy}" x2="${cx}" y2="${cy + hy}" stroke="#2f7d6b" stroke-width="2.5"/>`
      + `<text x="${cx + hx / 2}" y="${cy - 4}" font-size="18" fill="#d9711c" font-style="italic" text-anchor="middle">x</text><text x="${cx + 5}" y="${cy - hy / 2}" font-size="18" fill="#2f7d6b" font-style="italic">y</text>`;
    $('rhIn').value = s.x;
    $('rhV').textContent = fmt(s.x);
    const exact = Math.abs(+fmt(y, 2) * s.x - 10) < 1e-9;
    $('rhMsg').innerHTML = `$x=${fmt(s.x)}$，$y=\\dfrac{10}{${fmt(s.x)}}${exact ? '=' : '\\approx'}${fmt(y, 2)}$；面积 $\\dfrac12xy=5$ cm²`;
    tex($('rhMsg'));
  };
  $('rhIn').addEventListener('input', () => { s.x = +$('rhIn').value; b.update(); });
  $('rhIn').setAttribute('data-noswipe', '');
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 第 13 页：例 3 ---------- */
function initEx3() {
  const s = { x: -2 };
  const b = board($('ex3Board'), { x: [-7.5, 7.5], y: [-7.5, 7.5], w: 420, ticks: 2 });
  hyper(b, 6, { lim: 7.5 });
  b.fn((x) => x + 1, { cls: 'c3' });
  b.seg([[-1, 0], [-1, -6]], { cls: 'dash' });
  b.seg([[0, -6], [-1, -6]], { cls: 'dash' });
  b.seg([[0, -6], [0, 0]], { cls: 'c2' });
  b.pt([0, -6], { hollow: true, r: 6 }); b.pt([0, 0], { hollow: true, r: 6 });
  b.pt([-3, -2], { r: 6 }); b.text([-7.2, -3.4], '(−3, −2)', { cls: 'lb up' });
  b.pt([-1, -6], { hollow: true, r: 5 });
  b.text([4.6, 4.2], 'y = x + 1', { cls: 'lb' }); b.text([1.2, 6.9], 'y = 6/x', { cls: 'lb' });
  b.seg(() => [[s.x, 6 / s.x], [0, 6 / s.x]], { cls: 'dash' });
  b.drag(() => [s.x, 6 / s.x], (x) => { s.x = clamp(snap(x, 0.25), -7.5, -1.25); });
  b.onUpdate = () => {
    $('ex3Msg').innerHTML = `$x=${num(s.x)}&lt;-1$ 时，$y=\\dfrac{6}{${num(s.x)}}\\approx${num(6 / s.x)}$，在 $-6$ 与 $0$ 之间．`;
    tex($('ex3Msg'));
  };
  b.update();
  redraws.push(() => b.update());
}

/* ---------- 第 15 页：矩形面积 |k| ---------- */
function initArea() {
  const s = { k: 6, x: 2 };
  const y = () => s.k / s.x;
  const b = board($('areaBoard'), { x: [-8.5, 8.5], y: [-8.5, 8.5], w: 500, ticks: 2 });
  hyper(b, () => s.k, { lim: 8.5 });
  b.poly(() => [[0, 0], [s.x, 0], [s.x, y()], [0, y()]], { cls: 'fillA' });
  b.text(() => [s.x / 2, y() / 2], () => `S = ${num(Math.abs(s.x * y()))}`, { cls: 'lb up mid', dy: 6 });
  b.text(() => [s.x, y()], 'P', { cls: 'lb', dx: 10, dy: y() > 0 ? -8 : 22 });
  b.drag(() => [s.x, y()], (x) => { s.x = awayFrom0(x, 0.75, 8, 0.25); });
  const show = () => {
    const [m, n] = [s.x, y()];
    return { p: P(m, n), a: num(Math.abs(m)), b: num(Math.abs(n), 3), S: num(Math.abs(m * n)) };
  };
  b.onUpdate = () => {
    const r = show();
    $('akV').textContent = num(s.k);
    $('akIn').value = s.k;
    $('areaMsg').innerHTML = `$P${r.p}$：矩形长 $${r.a}$、宽 $${r.b}$，面积 $=${r.a}\\times${r.b}=${r.S}$，而 $|k|=${num(Math.abs(s.k))}$．`;
    tex($('areaMsg'));
  };
  $('akIn').addEventListener('input', () => { let v = +$('akIn').value; if (v === 0) v = s.k > 0 ? -1 : 1; s.k = v; b.update(); });
  $('akIn').setAttribute('data-noswipe', '');
  $('areaRec').addEventListener('click', () => {
    const r = show();
    const row = $('areaLog').insertRow();
    row.innerHTML = `<td>$${r.p}$</td><td>${r.a}</td><td>${r.b}</td><td>${r.S}</td>`;
    if ($('areaLog').rows.length > 5) $('areaLog').deleteRow(1);
    tex(row);
  });
  $('areaClr').addEventListener('click', () => { while ($('areaLog').rows.length > 1) $('areaLog').deleteRow(1); });
  b.update();
  redraws.push(() => b.update());
}

window.LESSON = {
  init() {
    initPlot(); initBad(); initTry(); initK(); initQuad(); initEx1(); initSym(); initRhombus(); initEx3(); initArea();
  },
  onRender() { requestAnimationFrame(() => redraws.forEach((f) => f())); },
};
