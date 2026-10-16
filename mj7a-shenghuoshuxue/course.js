'use strict';
/* 七上 1.1 生活 数学 · 本课互动：圆轮 / 方轮滚动对比、身份证号码分段、五环、估大树、篱笆围长方形（核心）、面积变化点图。
 * 通用部分见 ../shared/math.js；所有图形由坐标计算绘制。 */
const { board, fmt, tex, slider } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const boards = [];

/* ---------- 第 3 页：圆轮与方轮 ----------
 * 方轮边长 2，绕着地的右下顶点顺时针转；每转 90° 向前滚 2（等于边长）。中心离地 = √2·sin(45° + φ)。
 * 圆轮半径 1，滚过距离 d 时转过 d 弧度，中心离地恒为 1。 */
const SQ_GROUND = 0;
const CI_GROUND = 3.4;
function squareAt(d) {
  const q = Math.min(3, Math.floor(d / 2));
  const phi = ((d - 2 * q) / 2) * (Math.PI / 2);
  const pivot = [2 * (q + 1), SQ_GROUND];
  const rot = ([x, y]) => [pivot[0] + x * Math.cos(phi) + y * Math.sin(phi), pivot[1] - x * Math.sin(phi) + y * Math.cos(phi)];
  const local = [[-2, 0], [0, 0], [0, 2], [-2, 2]]; // 未转动时四个顶点相对支点的位置
  return { pts: local.map(rot), c: rot([-1, 1]) };
}
function initWheel() {
  const s = { d: 0 };
  const b = board($('wheelBoard'), { x: [-0.6, 11.2], y: [-0.5, 5.7], w: 640, axes: false, grid: false });
  b.seg([[-0.6, SQ_GROUND], [11.2, SQ_GROUND]], { cls: 'ground' });
  b.seg([[-0.6, CI_GROUND], [11.2, CI_GROUND]], { cls: 'ground' });
  // 中心轨迹（滚过的部分）
  b.curve((t) => [1 + t, CI_GROUND + 1], 0, () => s.d, { cls: 'c2' });
  b.curve((t) => squareAt(t).c, 0, () => s.d, { cls: 'c2', n: 400 });
  b.poly(() => squareAt(s.d).pts, { cls: 'wheel' });
  b.curve((t) => [1 + s.d + Math.cos(t), CI_GROUND + 1 + Math.sin(t)], 0, 2 * Math.PI, { cls: 'wheel-c' });
  b.seg(() => [[1 + s.d, CI_GROUND + 1], [1 + s.d + Math.sin(s.d), CI_GROUND + 1 + Math.cos(s.d)]], { cls: 'spoke' }); // 转过 d 弧度
  b.pt(() => [1 + s.d, CI_GROUND + 1], { cls: 'c2', r: 6 });
  b.pt(() => squareAt(s.d).c, { cls: 'c2', r: 6 });
  b.text([10.9, CI_GROUND + 0.3], '圆形轮子', { cls: 'lb up end' });
  b.text([10.9, SQ_GROUND + 0.3], '方形轮子', { cls: 'lb up end' });
  b.onUpdate = () => {
    $('wheelDV').textContent = fmt(s.d, 1);
    $('hCircle').textContent = '1';
    $('hSquare').textContent = fmt(squareAt(s.d).c[1] - SQ_GROUND, 2);
  };
  const inp = $('wheelD');
  slider(inp, (v) => { s.d = v; b.update(); });
  let timer = 0;
  $('wheelPlay').addEventListener('click', () => {
    cancelAnimationFrame(timer);
    const t0 = performance.now();
    const tick = (now) => {
      s.d = Math.min(8, ((now - t0) / 6000) * 8);
      inp.value = s.d;
      b.update();
      if (s.d < 8) timer = requestAnimationFrame(tick);
    };
    timer = requestAnimationFrame(tick);
  });
  boards.push(b);
}

/* ---------- 第 4 页：身份证号码（课本 p6） ---------- */
const ID_PARTS = [
  { t: '32', m: '省（市、自治区）的编码' },
  { t: '01', m: '市的编码' },
  { t: '06', m: '县（市、区）的编码' },
  { t: '1962', m: '出生的年' },
  { t: '11', m: '出生的月' },
  { t: '18', m: '出生的日' },
  { t: '×××', m: '顺序码' },
  { t: '×', m: '校验码（由前面 17 位数字算出来，用来检查号码有没有写错）' },
];
function initId() {
  const host = $('idCard');
  host.innerHTML = ID_PARTS.map((p, i) => `<button type="button" class="seg seg${i}" data-i="${i}">${p.t}</button>`).join('');
  host.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    const p = ID_PARTS[+btn.dataset.i];
    btn.classList.add('seen');
    host.querySelectorAll('.seg').forEach((x) => x.classList.toggle('cur', x === btn));
    const msg = $('idMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `<b>${p.t}</b>：${p.m}（${p.t.length} 位）`;
  });
}

/* ---------- 第 5 页：五环（5 个大小相同的圆环：上排 3 个，下排 2 个） ---------- */
function drawRings() {
  const R = 30;
  const C = [[60, 48, '#0081c8'], [120, 48, '#1f2d3a'], [180, 48, '#ee334e'], [90, 78, '#fcb131'], [150, 78, '#00a651']];
  $('rings').innerHTML = C.map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="${R}" fill="none" stroke="${c}" stroke-width="7"/>`).join('');
}

/* ---------- 第 6 页：估大树（俯视示意：人均匀站在圆周上） ---------- */
function initTree() {
  const s = { n: 4, a: 1.5 };
  const draw = () => {
    const C = s.n * s.a;
    const d = C / 3.14;
    const R = 92;
    const people = Array.from({ length: s.n }, (_, i) => {
      const t = (2 * Math.PI * i) / s.n - Math.PI / 2;
      return `<circle cx="${160 + R * Math.cos(t)}" cy="${130 + R * Math.sin(t)}" r="11" fill="#d9711c"/>`;
    }).join('');
    $('treeFig').innerHTML = `<circle cx="160" cy="130" r="${R}" fill="none" stroke="#d9711c" stroke-width="3" stroke-dasharray="7 6"/>`
      + `<circle cx="160" cy="130" r="${R - 12}" fill="#c9a77c" stroke="#8a6a44" stroke-width="3"/>`
      + `<circle cx="160" cy="130" r="${R - 40}" fill="none" stroke="#a5835a" stroke-width="2"/><circle cx="160" cy="130" r="${R - 62}" fill="none" stroke="#a5835a" stroke-width="2"/>`
      + `<line x1="${160 - R + 12}" y1="130" x2="${160 + R - 12}" y2="130" stroke="#1d6fa5" stroke-width="3"/>${people}`
      + `<text x="160" y="118" text-anchor="middle" class="tree-t">直径</text>`;
    $('treeNV').textContent = `${s.n} 人`;
    $('treeAV').textContent = `${fmt(s.a)} m`;
    $('treeC').innerHTML = `$${s.n}\\times${fmt(s.a)}=${fmt(C, 2)}$（m）`;
    $('treeD').innerHTML = `$${fmt(C, 2)}\\div3.14\\approx${fmt(d, 1)}$（m）`;
    tex($('treeC')); tex($('treeD'));
  };
  slider($('treeN'), (v) => { s.n = v; draw(); });
  slider($('treeA'), (v) => { s.a = v; draw(); });
}

/* ---------- 第 7 页：篱笆围长方形（核心）：一边长 L，邻边 8 − L，周长恒为 16 ---------- */
const HALF = 8;
function initFence() {
  const s = { L: 6, rec: [] };
  const b = board($('fenceBoard'), { x: [-0.8, 9.2], y: [-0.8, 9.2], w: 520, ticks: 1, labels: ['', ''] });
  const W = () => HALF - s.L;
  b.poly(() => [[0, 0], [s.L, 0], [s.L, W()], [0, W()]], { cls: 'pen' });
  b.seg([[0, HALF], [HALF, 0]], { cls: 'dash' });
  b.text(() => [s.L / 2, 0], () => `${fmt(s.L, 1)} m`, { cls: 'lb up mid', dy: -10 });
  b.text(() => [s.L, W() / 2], () => `${fmt(W(), 1)} m`, { cls: 'lb up', dx: 8, dy: 6 });
  b.drag(() => [s.L, W()], (x, y) => {
    // 角点只能在直线 一边长 + 邻边长 = 8 上移动：取鼠标位置在这条直线上的投影
    const L = (x - y + HALF) / 2;
    s.L = Math.round(clamp(L, 0.5, 7.5) * 10) / 10;
  });
  b.onUpdate = () => {
    const S = s.L * W();
    $('fL').textContent = `${fmt(s.L, 1)} m`;
    $('fW').textContent = `${fmt(W(), 1)} m`;
    $('fP').textContent = '16 m';
    $('fS').textContent = `${fmt(S, 2)} m²`;
    const msg = $('fenceMsg');
    const sq = Math.abs(s.L - 4) < 1e-9;
    msg.className = `tip feedback ${sq ? 'fb-ok' : ''}`;
    msg.innerHTML = sq ? '两边一样长：围成了<b>正方形</b>，面积 16 m²。' : `长 ${fmt(Math.max(s.L, W()), 1)} m、宽 ${fmt(Math.min(s.L, W()), 1)} m 的长方形，面积 ${fmt(S, 2)} m²。`;
  };
  const renderTab = () => {
    $('fenceTab').innerHTML = '<tr><th>一边长/m</th><th>邻边长/m</th><th>面积/m²</th></tr>'
      + s.rec.map(([l, w]) => `<tr><td>${fmt(l, 1)}</td><td>${fmt(w, 1)}</td><td>${fmt(l * w, 2)}</td></tr>`).join('');
  };
  $('fenceRec').addEventListener('click', () => {
    if (!s.rec.some(([l]) => l === s.L)) s.rec = [...s.rec, [s.L, W()]].sort((p, q) => p[0] - q[0]).slice(-6);
    renderTab();
  });
  $('fenceClr').addEventListener('click', () => { s.rec = []; renderTab(); });
  boards.push(b);
}

/* ---------- 第 8 页：面积随一边长变化的 7 个点 ---------- */
function initArea() {
  const b = board($('areaBoard'), { x: [-0.6, 8.8], y: [-2.5, 19], w: 520, h: 250, ticks: [1, 4], labels: ['一边长/m', '面积/m²'] });
  for (let L = 1; L <= 7; L++) b.pt([L, L * (HALF - L)], { cls: L === 4 ? 'c2' : '', r: L === 4 ? 7 : 5 });
  b.text([4, 16], '正方形', { cls: 'lb up mid', dy: -14 });
  boards.push(b);
}

window.LESSON = {
  init() {
    initWheel();
    initId();
    drawRings();
    initTree();
    initFence();
    initArea();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
