'use strict';
/* 九下 5.2 二次函数的图像和性质 · 本课互动：猜图特征、描点连线、对称点、y=ax² 的 a 滑块与水平线、
 * 沿抛物线走（增减性）、上下平移、左右平移、核心 a/h/k + 拖顶点、图 5-7 两次平移动画、例题图 5-8。
 * 所有曲线由函数表达式逐点计算绘制。课本写法 y = a(x + h)² + k，顶点 (−h, k)。 */
const { board, fmt, tex, slider } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const boards = [];
const keep = (b) => { boards.push(b); return b; };
const sq = (x) => x * x;
const tx = (v) => fmt(v, 2).replace('-', '−');

/** 给作图板加一个箭头标记，返回 url(#id) */
function arrowHead(b, color) {
  const id = `ah${Math.random().toString(36).slice(2, 8)}`;
  const NS = 'http://www.w3.org/2000/svg';
  const m = document.createElementNS(NS, 'marker');
  [['id', id], ['viewBox', '0 0 10 10'], ['refX', '9'], ['refY', '5'], ['markerWidth', '7'], ['markerHeight', '7'], ['orient', 'auto-start-reverse']].forEach(([k, v]) => m.setAttribute(k, v));
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', 'M0 0 L10 5 L0 10 z');
  path.setAttribute('fill', color);
  m.appendChild(path);
  b.svg.querySelector('defs').appendChild(m);
  return `url(#${id})`;
}
function arrowSeg(b, s, color, cls = 'arw') {
  const head = arrowHead(b, color);
  const l = b.seg(s, { cls });
  l.setAttribute('marker-end', head);
  l.style.stroke = color;
  return l;
}

/* ---------- 第 3 页：先猜 ---------- */
function initGuess() {
  const b = keep(board($('guessBoard'), { x: [-3.6, 3.6], y: [-0.9, 5.4], w: 420, h: 300, ticks: [1, 1] }));
  [[-2, 4, 'A(−2, 4)', -95], [2, 4, 'B(2, 4)', 10]].forEach(([x, y, t, dx]) => {
    b.seg([[x, 0], [x, y]], { cls: 'dash' });
    b.pt([x, y], { r: 6, cls: 'c2' });
    b.text([x, y], t, { cls: 'lb up', dx, dy: -10 });
  });
  b.seg([[-2, 4], [2, 4]], { cls: 'dash' });
  b.pt([0, 0], { r: 6 });
}

/* ---------- 第 4 页：描点画 y = x²、y = −x² ---------- */
function initPlot() {
  const XS = [-3, -2, -1, 0, 1, 2, 3];
  const DENSE = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];
  const st = { n: 0, mode: 'none', dense: false, neg: false };
  const b = keep(board($('plotBoard'), { x: [-4.3, 4.3], y: [-10.6, 10.6], w: 480, h: 560, ticks: [1, 2] }));
  const fns = [(x) => sq(x), (x) => -sq(x)];
  fns.forEach((f, k) => {
    const on = () => (k === 0 || st.neg);
    const smooth = b.fn(f, { from: -3, to: 3, cls: k ? 'c2' : 'c1' });
    const polys = XS.slice(1).map((x, i) => b.seg([[XS[i], f(XS[i])], [x, f(x)]], { cls: k ? 'c2 thinl' : 'c1 thinl' }));
    XS.forEach((x, i) => b.pt([x, f(x)], { r: 6, cls: k ? 'c2' : '', show: () => on() && i < st.n }));
    DENSE.forEach((x) => b.pt([x, f(x)], { r: 5, hollow: true, show: () => on() && st.dense }));
    const prev = b.onUpdate;
    b.onUpdate = () => {
      if (prev) prev();
      smooth.style.display = on() && st.mode === 'smooth' && st.n === 7 ? '' : 'none';
      polys.forEach((l, i) => { l.style.display = on() && st.mode === 'poly' && i + 1 < st.n ? '' : 'none'; });
    };
  });
  const prev = b.onUpdate;
  b.onUpdate = () => {
    prev();
    const cell = (x, f, i) => `<td class="${i < st.n ? 'on' : ''}">${i < st.n ? tx(f(x)) : ''}</td>`;
    $('plotTab').innerHTML = `<tr><th>$x$</th><td>…</td>${XS.map((x) => `<td>${tx(x)}</td>`).join('')}<td>…</td></tr>`
      + `<tr><th>$y=x^2$</th><td>…</td>${XS.map((x, i) => cell(x, fns[0], i)).join('')}<td>…</td></tr>`
      + (st.neg ? `<tr><th>$y=-x^2$</th><td>…</td>${XS.map((x, i) => cell(x, fns[1], i)).join('')}<td>…</td></tr>` : '');
    tex($('plotTab'));
    const msg = $('plotMsg');
    let t = '点“描下一个点”，或先自己算出表中的 $y$ 值。';
    if (st.n > 0 && st.n < 7) t = `已描 ${st.n} 个点：$(${tx(XS[st.n - 1])},\\ ${tx(sq(XS[st.n - 1]))})$。`;
    if (st.n === 7) t = '7 个点都描好了。用什么线把它们连起来？';
    if (st.mode === 'poly' && st.dense) t = '空心点是 $x=\\pm0.5,\\pm1.5,\\pm2.5$ 时的点：它们都在线段的<b>下方</b>，所以不能用线段连。';
    if (st.mode === 'smooth') t = '用平滑曲线顺次连接：空心点也都落在曲线上。';
    msg.innerHTML = t;
    tex(msg);
  };
  const set = (patch) => { Object.assign(st, patch); b.update(); };
  $('plotNext').addEventListener('click', () => set({ n: Math.min(7, st.n + 1) }));
  $('plotAll').addEventListener('click', () => set({ n: 7 }));
  $('plotPoly').addEventListener('click', () => set({ n: 7, mode: 'poly' }));
  $('plotSmooth').addEventListener('click', () => set({ n: 7, mode: 'smooth' }));
  $('plotDense').addEventListener('click', () => set({ dense: true }));
  $('plotNeg').addEventListener('click', () => set({ neg: !st.neg }));
  b.update();
}

/* ---------- 第 5 页：对称点 P、P′ ---------- */
function initSym() {
  const st = { x: 2 };
  const b = keep(board($('symBoard'), { x: [-3.6, 3.6], y: [-0.9, 10.2], w: 460, h: 520, ticks: [1, 1] }));
  b.fn(sq, { from: -3.25, to: 3.25 });
  b.seg(() => [[-st.x, sq(st.x)], [st.x, sq(st.x)]], { cls: 'dash' });
  b.pt(() => [0, sq(st.x)], { r: 4 });
  b.pt(() => [-st.x, sq(st.x)], { r: 7, cls: 'c2' });
  b.text(() => [-st.x, sq(st.x)], "P′", { cls: 'lb', dx: st.x > 0 ? -28 : 10, dy: -8 });
  b.text(() => [st.x, sq(st.x)], 'P', { cls: 'lb', dx: 12, dy: -8 });
  b.text([0, 0], '顶点', { cls: 'lb up', dx: 8, dy: -8 });
  b.drag(() => [st.x, sq(st.x)], (px) => { st.x = +clamp(snap(px, 0.1), -3.1, 3.1).toFixed(1); });
  b.onUpdate = () => {
    const m = $('symMsg');
    m.className = 'tip feedback fb-ok';
    m.innerHTML = `$P(${tx(st.x)},\\ ${tx(sq(st.x))})$，$P'(${tx(-st.x)},\\ ${tx(sq(st.x))})$：纵坐标相同，横坐标互为相反数，$PP'$ 被 $y$ 轴垂直平分。`;
    tex(m);
  };
}

/* ---------- 第 6 页：y = ax²，a 滑块 + 水平线 ---------- */
function initA() {
  const st = { a: 1, m: 4 };
  const b = keep(board($('aBoard'), { x: [-4.6, 4.6], y: [-6.6, 6.6], w: 520, h: 520, ticks: [1, 1] }));
  const BOOK = [0.5, 2, -0.5, -2];
  BOOK.forEach((a) => b.fn((x) => a * sq(x), { cls: 'ghost' }));
  const main = b.fn((x) => st.a * sq(x), { cls: 'c1' });
  b.seg(() => [[-4.6, st.m], [4.6, st.m]], { cls: 'c2 thinl' });
  const hit = () => (st.a !== 0 && st.m / st.a > 0 ? Math.sqrt(st.m / st.a) : null);
  b.pt(() => (hit() ? [-hit(), st.m] : null), { r: 6, cls: 'c2' });
  b.pt(() => (hit() ? [hit(), st.m] : null), { r: 6, cls: 'c2' });
  b.drag(() => [0, st.m], (px, py) => { st.m = clamp(snap(py, 0.5), -6, 6) || 0.5; });
  b.onUpdate = () => {
    main.style.display = st.a === 0 ? 'none' : '';
    $('aV').textContent = fmt(st.a, 2);
    const m = $('aMsg');
    const h = hit();
    if (st.a === 0) { m.className = 'tip feedback fb-warn'; m.innerHTML = '$a=0$ 时 $y=0$，不是二次函数。'; tex(m); return; }
    m.className = 'tip feedback';
    m.innerHTML = `$y=${st.a === 1 ? '' : st.a === -1 ? '-' : fmt(st.a, 2)}x^2$：开口<b>${st.a > 0 ? '向上' : '向下'}</b>；`
      + (h ? `水平线 $y=${fmt(st.m)}$ 与抛物线交于 $x=\\pm${fmt(h, 2)}$，两交点相距 <b>${fmt(2 * h, 2)}</b>。` : `水平线 $y=${fmt(st.m)}$ 与抛物线没有交点——把橙色点拖到${st.a > 0 ? '上' : '下'}方。`);
    tex(m);
  };
  const input = $('aSlide');
  slider(input, (v) => { st.a = +v.toFixed(2); if (st.m / (st.a || 1) < 0) st.m = -st.m; b.update(); });
  $('aPresets').innerHTML = BOOK.map((a) => `<button type="button" class="btn" data-a="${a}">$a=${a === 0.5 ? '\\frac12' : a === -0.5 ? '-\\frac12' : a}$</button>`).join('') + '<span class="muted ghost-l">灰色虚线：课本 p11 的四条</span>';
  tex($('aPresets'));
  $('aPresets').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a]');
    if (!btn) return;
    input.value = btn.dataset.a;
    input.dispatchEvent(new Event('input'));
  });
}

/* ---------- 第 7 页：沿抛物线走 ---------- */
function initInc() {
  const CH = [[1, 'y=x^2'], [-1, 'y=-x^2'], [0.5, 'y=\\frac12x^2'], [-2, 'y=-2x^2']];
  const st = { a: 1, x: -2 };
  const f = (x) => st.a * sq(x);
  const b = keep(board($('incBoard'), { x: [-3.6, 3.6], y: [-6.4, 6.4], w: 520, h: 460, ticks: [1, 1] }));
  b.fn(f, { cls: 'c1' });
  arrowSeg(b, () => [[st.x, f(st.x)], [st.x + 0.5, f(st.x + 0.5)]], '#2f7d6b');
  b.seg(() => [[st.x, 0], [st.x, f(st.x)]], { cls: 'dash' });
  b.drag(() => [st.x, f(st.x)], (px) => { st.x = clamp(snap(px, 0.25), -3, 2.5); });
  b.onUpdate = () => {
    const y0 = f(st.x);
    const y1 = f(st.x + 0.5);
    const up = y1 > y0;
    const flat = st.x < 0 && st.x + 0.5 > 0;
    const m = $('incMsg');
    m.className = `tip feedback ${up ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `$x$ 从 $${tx(st.x)}$ 增大到 $${tx(st.x + 0.5)}$，$y$ 从 $${tx(y0)}$ 变为 $${tx(y1)}$：<b>${up ? '增大（上坡）' : '减小（下坡）'}</b>。`
      + (flat ? '（这一步跨过了对称轴，先降后升，看对称轴两侧要分开说。）' : `点在对称轴${st.x < 0 ? '左' : '右'}侧。`);
    tex(m);
  };
  $('incBtns').innerHTML = CH.map(([a, t], i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-a="${a}">$${t}$</button>`).join('');
  tex($('incBtns'));
  $('incBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-a]');
    if (!btn) return;
    st.a = +btn.dataset.a;
    $('incBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
}

/* ---------- 第 9 页：上下平移 y = x² + k ---------- */
function initV() {
  const st = { k: 1 };
  const XS = [-2, -1, 0, 1, 2];
  const b = keep(board($('vBoard'), { x: [-3.6, 3.6], y: [-3.6, 9.6], w: 460, h: 560, ticks: [1, 1] }));
  b.fn(sq, { cls: 'c1' });
  b.fn((x) => sq(x) + st.k, { cls: 'c2' });
  XS.forEach((x) => arrowSeg(b, () => [[x, sq(x)], [x, sq(x) + st.k]], '#4f9bd0'));
  b.pt([1, 1], { r: 5 });
  b.text([1, 1], 'A', { cls: 'lb', dx: 10, dy: 16 });
  b.pt(() => [1, 1 + st.k], { r: 5, cls: 'c2' });
  b.text(() => [1, 1 + st.k], "A′", { cls: 'lb', dx: 10, dy: -4 });
  b.onUpdate = () => {
    $('vKV').textContent = fmt(st.k);
    const ks = st.k === 0 ? '' : st.k > 0 ? `+${fmt(st.k)}` : fmt(st.k);
    $('vTab').innerHTML = `<tr><th>$x$</th><td>…</td>${XS.map((x) => `<td>${tx(x)}</td>`).join('')}<td>…</td></tr>`
      + `<tr><th>$y=x^2$</th><td>…</td>${XS.map((x) => `<td>${tx(sq(x))}</td>`).join('')}<td>…</td></tr>`
      + `<tr><th>$y=x^2${ks}$</th><td>…</td>${XS.map((x) => `<td class="on">${tx(sq(x) + st.k)}</td>`).join('')}<td>…</td></tr>`;
    tex($('vTab'));
  };
  slider($('vK'), (v) => { st.k = v; b.update(); });
}

/* ---------- 第 10 页：左右平移 y = (x + h)² ---------- */
function initH() {
  const st = { h: 3 };
  const b = keep(board($('hBoard'), { x: [-7.6, 4.6], y: [-1.2, 9.6], w: 560, h: 500, ticks: [1, 1] }));
  b.fn(sq, { cls: 'c1' });
  b.fn((x) => sq(x + st.h), { cls: 'c2' });
  b.seg(() => [[-st.h, -1.2], [-st.h, 9.6]], { cls: 'axis-r' });
  [-2, 2].forEach((x, i) => {
    arrowSeg(b, () => [[x, 4], [x - st.h, 4]], '#4f9bd0');
    b.pt([x, 4], { r: 5 });
    b.text([x, 4], i ? 'B' : 'A', { cls: 'lb', dx: 6, dy: 22 });
    b.pt(() => [x - st.h, 4], { r: 5, cls: 'c2' });
    b.text(() => [x - st.h, 4], i ? "B′" : "A′", { cls: 'lb', dx: -10, dy: -10 });
  });
  slider($('hH'), (v) => { st.h = v; $('hHV').textContent = fmt(v); b.update(); });
}

/* ---------- 第 11 页：练习，点对后画出新图像 ---------- */
function initP11() {
  const pairs = [['p11a', sq, (x) => sq(x) - 1, [-3.6, 3.6], [-1.6, 6.6]], ['p11b', (x) => -sq(x), (x) => -sq(x - 2), [-3.6, 5.6], [-6.6, 1.2]]];
  pairs.forEach(([id, f0, f1, xr, yr]) => {
    const b = keep(board($(id), { x: xr, y: yr, w: 460, h: 300, ticks: [1, 1] }));
    b.fn(f0, { cls: 'c1' });
    const g = b.fn(f1, { cls: 'c2' });
    const pick = $(id).previousElementSibling;
    const show = () => { g.style.display = pick.classList.contains('done') ? '' : 'none'; };
    b.onUpdate = show;
    pick.addEventListener('click', () => requestAnimationFrame(show));
  });
}

/* ---------- 第 12 页：核心 y = a(x + h)² + k ---------- */
function signed(v) { return v > 0 ? `+${fmt(v, 2)}` : `-${fmt(-v, 2)}`; }
function formulaTex(a, h, k) {
  const A = a === 1 ? '' : a === -1 ? '-' : fmt(a, 2);
  const inner = h === 0 ? 'x^2' : `(x${signed(h)})^2`;
  return `y=${A}${inner}${k === 0 ? '' : signed(k)}`;
}
function initCore() {
  const st = { a: 1, h: 1, k: 2 };
  const f = (x) => st.a * sq(x + st.h) + st.k;
  const b = keep(board($('gBoard'), { x: [-6.6, 6.6], y: [-6.6, 6.6], w: 540, h: 540, ticks: [1, 1] }));
  b.fn((x) => st.a * sq(x), { cls: 'ghost2' });
  b.seg(() => [[-st.h, -6.6], [-st.h, 6.6]], { cls: 'axis-r' });
  const a1 = arrowSeg(b, () => [[0, 0], [-st.h, 0]], '#2f7d6b', 'arw2');
  const a2 = arrowSeg(b, () => [[-st.h, 0], [-st.h, st.k]], '#2f7d6b', 'arw2');
  b.fn(f, { cls: 'c2' });
  b.text(() => [-st.h, st.k], () => `(${tx(-st.h)}, ${tx(st.k)})`, { cls: 'lb up', dx: 14, dy: st.a > 0 ? 24 : -12 });
  const sync = () => {
    [['gA', st.a], ['gH', st.h], ['gK', st.k]].forEach(([id, v]) => { $(id).value = v; $(`${id}V`).textContent = fmt(v, 2); });
  };
  b.drag(() => [-st.h, st.k], (px, py) => {
    st.h = -clamp(snap(px, 0.5), -4, 4) || 0;
    st.k = clamp(snap(py, 0.5), -4, 4) || 0;
  });
  b.onUpdate = () => {
    sync();
    a1.style.display = st.h ? '' : 'none';
    a2.style.display = st.k ? '' : 'none';
    $('gF').innerHTML = `$${formulaTex(st.a, st.h, st.k)}$`;
    const up = st.a > 0;
    $('gRead').innerHTML = `<span>开口</span><b>${up ? '向上' : '向下'}</b><span>（$a${up ? '&gt;' : '&lt;'}0$，$|a|=${fmt(Math.abs(st.a), 2)}$）</span>`
      + `<span>顶点</span><b>$(${tx(-st.h)},\\ ${tx(st.k)})$</b><span>即 $(-h,\\ k)$</span>`
      + `<span>对称轴</span><b>直线 $x=${tx(-st.h)}$</b><span></span>`
      + `<span>最值</span><b>${up ? '最小值' : '最大值'} $${tx(st.k)}$</b><span>当 $x=${tx(-st.h)}$ 时</span>`;
    const lr = st.h > 0 ? `向<b>左</b>平移 ${fmt(st.h)} 个单位` : st.h < 0 ? `向<b>右</b>平移 ${fmt(-st.h)} 个单位` : '';
    const ud = st.k > 0 ? `向<b>上</b>平移 ${fmt(st.k)} 个单位` : st.k < 0 ? `向<b>下</b>平移 ${fmt(-st.k)} 个单位` : '';
    const steps = [lr, ud].filter(Boolean).join('，再');
    const m = $('gMsg');
    m.className = 'tip feedback fb-ok';
    m.innerHTML = steps ? `把 $y=${st.a === 1 ? '' : st.a === -1 ? '-' : fmt(st.a, 2)}x^2$ 的图像${steps}，就得到它的图像（绿色箭头是顶点的移动路线）。` : '没有平移：就是 $y=ax^2$ 本身。';
    tex($('gF')); tex($('gRead')); tex(m);
  };
  slider($('gA'), (v) => { st.a = v === 0 ? 0.25 : v; b.update(); });
  slider($('gH'), (v) => { st.h = v; b.update(); });
  slider($('gK'), (v) => { st.k = v; b.update(); });
}

/* ---------- 第 13 页：图 5-7 两次平移 ---------- */
function initF57() {
  const st = { t: 2 }; // t ∈ [0, 2]：前一半左移 1，后一半上移 2
  const sh = () => [Math.min(st.t, 1), Math.max(0, st.t - 1) * 2];
  const b = keep(board($('f57Board'), { x: [-4.6, 3.6], y: [-1.2, 9.4], w: 480, h: 560, ticks: [1, 1] }));
  b.fn(sq, { cls: 'c1' });
  b.fn((x) => sq(x + 1), { cls: 'ghost2' });
  b.seg([[-1, -1.2], [-1, 9.4]], { cls: 'axis-r' });
  b.fn((x) => sq(x + sh()[0]) + sh()[1], { cls: 'c2' });
  b.pt(() => [-sh()[0], sh()[1]], { r: 6, cls: 'c2' });
  b.text([2.1, 4.4], 'y=x²', { cls: 'lb up c1t' });
  b.text([-3.9, 8.6], 'y=(x+1)²+2', { cls: 'lb up c2t' });
  b.text([-4.4, 4.3], 'y=(x+1)²', { cls: 'lb up gt' });
  let anim = 0;
  $('f57Play').addEventListener('click', () => {
    cancelAnimationFrame(anim);
    const t0 = performance.now();
    const tick = (now) => {
      st.t = Math.min(2, (now - t0) / 1600);
      b.update();
      if (st.t < 2) anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
  });
}

/* ---------- 第 15 页：例 y = −x² − 4x − 5（图 5-8） ---------- */
function initEx() {
  const f = (x) => -sq(x) - 4 * x - 5;
  const b = keep(board($('exBoard'), { x: [-4.7, 1.7], y: [-6.7, 1.1], w: 480, h: 560, ticks: [1, 1] }));
  b.seg([[-2, -6.7], [-2, 1.1]], { cls: 'axis-r' });
  b.fn(f, { from: -4.3, to: 0.3, cls: 'c1' });
  [-4, -3, -1, 0].forEach((x) => b.pt([x, f(x)], { r: 5 }));
  b.pt([-2, -1], { r: 7, cls: 'c2' });
  b.text([-2, -1], '顶点(−2, −1)', { cls: 'lb up', dx: 10, dy: -10 });
}

/* ---------- 第 16 页：练习 2 的图像（在“完整解答”里） ---------- */
function initP16() {
  const f = (x) => 0.5 * sq(x) - 3 * x - 2.5;
  const b = keep(board($('p16Board'), { x: [-2.6, 8.6], y: [-7.8, 5.2], w: 460, h: 420, ticks: [1, 1] }));
  const det = [...document.querySelectorAll('details')].find((d) => d.textContent.includes('图像见右下'));
  const on = () => det.open;
  const ax = b.seg([[3, -7.8], [3, 5.2]], { cls: 'axis-r' });
  const cv = b.fn(f, { cls: 'c1' });
  b.pt([3, -7], { r: 6, cls: 'c2', show: on });
  b.text(() => (on() ? [3, -7] : null), '(3, −7)', { cls: 'lb up', dx: 10, dy: 4 });
  b.onUpdate = () => { [ax, cv].forEach((e) => { e.style.display = on() ? '' : 'none'; }); };
  det.addEventListener('toggle', () => requestAnimationFrame(() => b.update()));
}

window.LESSON = {
  init() {
    initGuess(); initPlot(); initSym(); initA(); initInc(); initV(); initH(); initP11(); initCore(); initF57(); initEx(); initP16();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
