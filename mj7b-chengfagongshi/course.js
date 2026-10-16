'use strict';
/* 七下 9.4 乘法公式 · 本课互动：面积拼图 (a+b)²、(a+b+c)²，(a−b)² 的剪去与加回，平方差剪拼，四块长方形围正方形。
 * 所有图形由 a、b、c 计算坐标，作图板横纵同比例（正方形就是正方形）。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const cen = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
const SQ = '²';
const MIN_LABEL = 0.9; // 小于这个尺寸的格子不写字，免得挤成一团

/* 面积拼图：正方形边长 = 各段之和；横向从左到右、纵向从下到上用同一顺序切分，正方形落在对角线上 */
function initGrid(id, names, onRead) {
  const s = { v: names.map(() => 1) };
  const span = names.length === 2 ? 7.8 : 9.4; // 滑块上限之和
  const b = board($(id), { x: [-1.2, span], y: [-1.2, span], axes: false, grid: false, w: 520 });
  const off = () => s.v.reduce((acc, v) => [...acc, acc[acc.length - 1] + v], [0]);
  const label = (i, j) => (i === j ? names[i] + SQ : [names[i], names[j]].sort().join(''));
  names.forEach((_, i) => names.forEach((__, j) => {
    const cell = () => { const o = off(); return rect(o[i], o[j], o[i + 1], o[j + 1]); };
    b.poly(cell, { cls: i === j ? `sq${i}` : 'rc' });
    b.text(() => (Math.min(s.v[i], s.v[j]) < MIN_LABEL ? null : cen(cell())), label(i, j), { cls: 'lb up c', dy: 8 });
  }));
  b.poly(() => { const n = off()[names.length]; return rect(0, 0, n, n); }, { cls: 'outer' });
  names.forEach((n, i) => {
    b.text(() => [(off()[i] + off()[i + 1]) / 2, 0], n, { cls: 'lb dim', dy: 26 });
    b.text(() => [0, (off()[i] + off()[i + 1]) / 2], n, { cls: 'lb dim', dx: -18, dy: 6 });
  });
  b.onUpdate = () => onRead(s.v);
  names.forEach((n, i) => slider($(`${id}${n}`), (v) => { s.v = s.v.map((x, k) => (k === i ? v : x)); $(`${id}${n}V`).textContent = fmt(v); b.update(); }));
}

function initG2() {
  // 顺序按课本图 9-5：横向先 b 后 a，纵向（从下往上）先 b 后 a，a² 在右上角
  initGrid('g2', ['b', 'a'], ([bv, av]) => {
    const sq = (x) => fmt(x * x);
    $('g2v1').textContent = sq(av + bv);
    $('g2v2').textContent = `${sq(av)} + ${fmt(av * bv)} + ${fmt(av * bv)} + ${sq(bv)} = ${fmt(av * av + 2 * av * bv + bv * bv)}`;
    $('g2v3').textContent = `${fmt(av * av + bv * bv)}（少 ${fmt(2 * av * bv)}）`;
  });
}

function initG3() {
  initGrid('g3', ['a', 'b', 'c'], ([a, b, c]) => {
    const whole = (a + b + c) ** 2;
    const parts = a * a + b * b + c * c + 2 * a * b + 2 * a * c + 2 * b * c;
    $('g3Read').innerHTML = `<span>$(a+b+c)^2$</span><b class="v">${fmt(whole)}</b><span>9 块面积之和</span><b class="v">${fmt(parts)}</b>`;
    tex($('g3Read'));
  });
}

/* 第 4 页：(a−b)²。k 由页内步骤驱动：7 减右条、8 再减上条、9 加回角上 b² */
const sqm = { a: 6, b: 2, k: 0 };
let sqmBoard = null;
function initSqm() {
  const b = board($('sqm'), { x: [-1.2, 7.8], y: [-1.2, 7.8], axes: false, grid: false, w: 520 });
  const m = () => sqm.a - sqm.b;
  b.poly(() => rect(0, 0, sqm.a, sqm.a), { cls: 'base' });
  b.poly(() => (sqm.k >= 1 ? rect(m(), 0, sqm.a, sqm.a) : []), { cls: 'cutA' });
  b.poly(() => (sqm.k >= 2 ? rect(0, m(), sqm.a, sqm.a) : []), { cls: 'cutA' });
  b.poly(() => (sqm.k === 2 ? rect(m(), m(), sqm.a, sqm.a) : []), { cls: 'twice' });
  b.poly(() => (sqm.k >= 3 ? rect(m(), m(), sqm.a, sqm.a) : []), { cls: 'addback' });
  b.poly(() => (sqm.k >= 3 ? rect(0, 0, m(), m()) : []), { cls: 'keep' });
  b.seg(() => [[m(), 0], [m(), sqm.a]], { cls: 'dash' });
  b.seg(() => [[0, m()], [sqm.a, m()]], { cls: 'dash' });
  b.text(() => [sqm.a / 2, 0], 'a', { cls: 'lb dim', dy: 26 });
  b.text(() => [0, sqm.a / 2], 'a', { cls: 'lb dim', dx: -18, dy: 6 });
  b.text(() => [m() + sqm.b / 2, sqm.a], 'b', { cls: 'lb dim', dy: -10 });
  b.text(() => [sqm.a, m() + sqm.b / 2], 'b', { cls: 'lb dim', dx: 16, dy: 6 });
  b.text(() => (sqm.k >= 3 ? [m() / 2, m() / 2] : null), '(a−b)²', { cls: 'lb up c', dy: 8 });
  b.text(() => (sqm.k >= 1 && sqm.k < 3 ? [m() + sqm.b / 2, m() / 2] : null), '−ab', { cls: 'lb up c', dy: 8 });
  b.text(() => (sqm.k === 2 ? [m() / 2, m() + sqm.b / 2] : null), '−ab', { cls: 'lb up c', dy: 8 });
  b.text(() => (sqm.k >= 3 ? [m() + sqm.b / 2, m() + sqm.b / 2] : null), '+b²', { cls: 'lb up c', dy: 8 });
  b.onUpdate = () => {
    const { a, b: bb, k } = sqm;
    const msg = $('sqmMsg');
    const txt = [
      `边长 $a=${fmt(a)}$ 的正方形，面积 $a^2=${fmt(a * a)}$。`,
      `减去右边长条：$${fmt(a * a)}-${fmt(a * bb)}=${fmt(a * a - a * bb)}$。`,
      `再减去上边长条：$${fmt(a * a - a * bb)}-${fmt(a * bb)}=${fmt(a * a - 2 * a * bb)}$，角上的 $b^2=${fmt(bb * bb)}$ 被减了两次！`,
      `加回一次 $b^2$：$${fmt(a * a - 2 * a * bb)}+${fmt(bb * bb)}=${fmt((a - bb) ** 2)}$，正是 $(a-b)^2=${fmt(a - bb)}^2$。`,
    ][k];
    msg.className = `tip feedback ${k === 3 ? 'fb-ok' : ''}`;
    msg.innerHTML = txt;
    tex(msg);
  };
  slider($('sqma'), (v) => { sqm.a = v; $('sqmaV').textContent = fmt(v); b.update(); });
  slider($('sqmb'), (v) => { sqm.b = v; $('sqmbV').textContent = fmt(v); b.update(); });
  sqmBoard = b;
}

/* 第 9 页：图 9-6 平方差剪拼。右边一条（宽 a−b、高 a）绕自身中心逆时针转 90°，接到左上块（宽 b、高 a−b）右边 */
function initCut() {
  const s = { a: 5, b: 2, t: 0, trap: false };
  const b = board($('cut'), { x: [-1.2, 9.6], y: [-1.2, 7.6], axes: false, grid: false, w: 560 });
  const rot = ([x, y], [cx, cy], th) => [cx + (x - cx) * Math.cos(th) - (y - cy) * Math.sin(th), cy + (x - cx) * Math.sin(th) + (y - cy) * Math.cos(th)];
  const moving = () => {
    const { a, b: bb, t } = s;
    const c0 = [(a + bb) / 2, a / 2];
    const c1 = [bb + a / 2, (a + bb) / 2];
    const c = [c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t];
    const pts = rect(bb, 0, a, a).map((p) => [p[0] - c0[0] + c[0], p[1] - c0[1] + c[1]]);
    return pts.map((p) => rot(p, c, (Math.PI / 2) * t));
  };
  b.poly(() => rect(0, 0, s.a, s.a), { cls: 'ghost' });
  b.poly(() => (s.trap ? [] : rect(0, 0, s.b, s.b)), { cls: 'hole' });
  b.poly(() => (s.trap ? [] : rect(0, s.b, s.b, s.a)), { cls: 'shade2' });
  b.poly(() => (s.trap ? [] : moving()), { cls: 'shade' });
  b.poly(() => (s.trap ? [[0, s.b], [s.b, s.b], [s.a, s.a], [0, s.a]] : []), { cls: 'shade2' });
  b.poly(() => (s.trap ? [[s.b, 0], [s.a, 0], [s.a, s.a], [s.b, s.b]] : []), { cls: 'shade' });
  b.poly(() => (s.trap ? rect(0, 0, s.b, s.b) : []), { cls: 'hole' });
  b.seg(() => (s.t > 0 || s.trap ? [[0, 0], [0, 0]] : [[s.b, s.b], [s.b, s.a]]), { cls: 'cutline' });
  b.poly(() => (s.t >= 1 && !s.trap ? rect(0, s.b, s.a + s.b, s.a) : []), { cls: 'outer' });
  b.text(() => (s.t === 0 && !s.trap ? [s.b / 2, s.b / 2] : null), 'b²', { cls: 'lb up c', dy: 8 });
  b.text(() => [s.a / 2, 0], 'a', { cls: 'lb dim', dy: 26 });
  b.text(() => [0, s.b / 2], 'b', { cls: 'lb dim', dx: -18, dy: 6 });
  b.text(() => [0, (s.a + s.b) / 2], 'a−b', { cls: 'lb dim', dx: -30, dy: 6 });
  b.text(() => (s.t >= 1 && !s.trap ? [(s.a + s.b) / 2, s.a] : null), 'a + b', { cls: 'lb dim', dy: -12 });
  b.onUpdate = () => {
    const { a, b: bb, t } = s;
    const msg = $('cutMsg');
    msg.className = `tip feedback ${t >= 1 || s.trap ? 'fb-ok' : ''}`;
    msg.innerHTML = s.trap
      ? `两个梯形：$2\\times\\dfrac{(${fmt(a)}+${fmt(bb)})\\times${fmt(a - bb)}}2=${fmt((a + bb) * (a - bb))}$，$a^2-b^2=${fmt(a * a - bb * bb)}$。`
      : (t >= 1
        ? `拼成长 $${fmt(a + bb)}$、宽 $${fmt(a - bb)}$ 的长方形：$${fmt(a + bb)}\\times${fmt(a - bb)}=${fmt((a + bb) * (a - bb))}=${fmt(a * a)}-${fmt(bb * bb)}$。`
        : `阴影面积 $a^2-b^2=${fmt(a * a)}-${fmt(bb * bb)}=${fmt(a * a - bb * bb)}$。拖动“剪拼”滑块或点“演示”。`);
    tex(msg);
  };
  const setT = (v) => { s.t = v; $('cutT').value = v; b.update(); };
  slider($('cutT'), (v) => { s.trap = false; setT(v); });
  slider($('cuta'), (v) => { s.a = v; $('cutaV').textContent = fmt(v); b.update(); });
  slider($('cutb'), (v) => { s.b = v; $('cutbV').textContent = fmt(v); b.update(); });
  const DURATION = 2200;
  $('cutPlay').addEventListener('click', () => {
    s.trap = false;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setT(+(p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2).toFixed(3));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  $('cutTrap').addEventListener('click', () => { s.trap = !s.trap; setT(0); });
}

/* 第 14 页：4 块长 a、宽 b 的长方形围成边长 a+b 的正方形，中间空出边长 a−b 的正方形 */
function initRing4() {
  const s = { a: 5, b: 2 };
  const b = board($('ring4'), { x: [-1.2, 9.4], y: [-0.6, 8.6], axes: false, grid: false, w: 520 });
  const n = () => s.a + s.b;
  [() => rect(0, 0, s.a, s.b), () => rect(s.a, 0, n(), s.a), () => rect(s.b, s.a, n(), n()), () => rect(0, s.b, s.b, n())]
    .forEach((f) => b.poly(f, { cls: 'shade' }));
  b.poly(() => rect(s.b, s.b, s.a, s.a), { cls: 'hole' });
  b.text(() => (s.a - s.b >= 1.2 ? [n() / 2, n() / 2] : null), '(a−b)²', { cls: 'lb up c', dy: 8 });
  b.text(() => [s.a / 2, 0], 'a', { cls: 'lb dim', dy: 26 });
  b.text(() => [s.a + s.b / 2, 0], 'b', { cls: 'lb dim', dy: 26 });
  b.text(() => [s.a / 2, s.b / 2], 'ab', { cls: 'lb up c', dy: 8 });
  b.onUpdate = () => {
    $('ring4aV').textContent = fmt(s.a); $('ring4bV').textContent = fmt(s.b);
    $('ring4a').value = s.a; $('ring4b').value = s.b;
    $('ring4Msg').innerHTML = `$4ab=${fmt(4 * s.a * s.b)}$；$(a+b)^2-(a-b)^2=${fmt(n() ** 2)}-${fmt((s.a - s.b) ** 2)}=${fmt(n() ** 2 - (s.a - s.b) ** 2)}$`;
    tex($('ring4Msg'));
  };
  // 保持 a > b（长方形的长大于宽）
  slider($('ring4a'), (v) => { s.a = Math.max(v, s.b + 0.5); b.update(); });
  slider($('ring4b'), (v) => { s.b = Math.min(v, s.a - 0.5); b.update(); });
}

/* 习题 2：边长 20 的正方形草坪，横、竖两条宽 a = 3 的小路（按比例画） */
function drawLawn() {
  const svg = $('lawnFig');
  const K = 5.5; // 1 单位 = 5.5 px
  const OX = 45;
  const OY = 120;
  const A = 3;
  const X = (x) => OX + x * K;
  const Y = (y) => OY - y * K;
  const r = (x0, y0, x1, y1, fill) => `<rect x="${X(x0)}" y="${Y(y1)}" width="${(x1 - x0) * K}" height="${(y1 - y0) * K}" fill="${fill}" stroke="#1f2d3a" stroke-width="1"/>`;
  const PATH_X = 12; // 竖路左边缘
  const PATH_Y = 4; // 横路下边缘
  svg.innerHTML = r(0, 0, 20, 20, '#7fcf8a') + r(PATH_X, 0, PATH_X + A, 20, '#fff') + r(0, PATH_Y, 20, PATH_Y + A, '#fff')
    + `<text x="${X(10)}" y="${Y(0) + 11}" class="fl" font-size="11" text-anchor="middle">20</text>`
    + `<text x="${X(20) + 4}" y="${Y(10)}" class="fl" font-size="11">20</text>`
    + `<text x="${X(PATH_X + A / 2)}" y="${Y(20) - 2}" class="fl" font-size="11" text-anchor="middle">a</text>`
    + `<text x="${X(0) - 10}" y="${Y(PATH_Y + A / 2) + 4}" class="fl" font-size="11">a</text>`;
}

window.LESSON = {
  init() {
    initG2();
    initSqm();
    initG3();
    initCut();
    initRing4();
    drawLawn();
  },
  onRender(slide, step) {
    if (!slide.contains($('sqm'))) return;
    const k = Math.max(0, Math.min(3, step - 6));
    if (k !== sqm.k) { sqm.k = k; sqmBoard.update(); }
  },
};
