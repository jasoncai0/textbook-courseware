'use strict';
/* 六下 正比例的图像 · 本课互动：例 2 在方格图上点出各组数据（点对才出现）并连线、沿直线拖点读值、
 * 改变速度比较直线的陡缓（含不过 0 点的反例）、练一练和练习十第 3～5 题的图像。
 * 所有方格图的刻度与课本一致，直线按 y = kx 精确画出（MathKit.board）。 */
const { board, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const boards = [];
const snap = (v, st) => Math.round(v / st) * st;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const near = (a, b) => Math.abs(a - b) < 1e-9;
// 用类名隐藏（画板重绘会改写内联 display）
const show = (nodes, on) => nodes.forEach((n) => n.classList.toggle('off', !on));

/** 课本样式的方格图：o = { x: [0, 8], y: [0, 600], tx, ty, xl, yl } */
function graph(el, o) {
  const px = (o.x[1] - o.x[0]) * 0.08;
  const py = (o.y[1] - o.y[0]) * 0.09;
  // 右端、上端只留半格多一点，免得多出课本没有的刻度
  const X = [o.x[0] - Math.min(px, o.tx * 0.95), o.x[1] + Math.min(px * 1.6, o.tx * 0.62)];
  const Y = [o.y[0] - Math.min(py, o.ty * 0.95), o.y[1] + Math.min(py * 1.3, o.ty * 0.62)];
  const b = board(el, { x: X, y: Y, w: o.w || 600, h: o.h || 400, ticks: [o.tx, o.ty], labels: ['', ''] });
  b.text([X[1], 0], o.xl, { cls: 'axlab end', dy: -10 });
  b.text([0, Y[1]], o.yl, { cls: 'axlab', dx: 10, dy: 16 });
  /** 屏幕坐标 → 世界坐标 */
  b.toWorld = (e) => {
    const p = b.svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(b.svg.getScreenCTM().inverse());
    return [X[0] + (q.x / b.W) * (X[1] - X[0]), Y[1] - (q.y / b.H) * (Y[1] - Y[0])];
  };
  boards.push(b);
  return b;
}

/** 正比例直线 y = kx（从 0 画到 to） */
const line = (b, k, to, cls = 'c1') => b.fn((x) => k * x, { from: 0, to, cls });

/** 点方格图描点：data 为 [[x, y], …]，点到对应格点才出现；返回 { placed, all() } */
function clickPlot(b, o, data, onChange, labels = {}) {
  const placed = new Set();
  data.forEach((d, i) => {
    b.pt(d, { cls: 'dp', r: 6, show: () => placed.has(i) });
    if (labels[i]) b.text(() => (placed.has(i) ? d : null), labels[i], { cls: 'lb', dx: 8, dy: 20 });
  });
  b.svg.addEventListener('click', (e) => {
    const [x, y] = b.toWorld(e);
    const p = [snap(x, o.tx), snap(y, o.ty)];
    const i = data.findIndex((d) => near(d[0], p[0]) && near(d[1], p[1]));
    if (i >= 0) placed.add(i);
    b.update();
    onChange(i, p);
  });
  return { placed, all() { data.forEach((_, i) => placed.add(i)); b.update(); } };
}

/** 沿直线 y = f(x) 拖动读值：虚线连到两条轴 */
function reader(b, f, o) {
  const s = { x: o.x0 };
  const nodes = [
    b.seg(() => [[s.x, 0], [s.x, f(s.x)]], { cls: 'dash' }),
    b.seg(() => [[0, f(s.x)], [s.x, f(s.x)]], { cls: 'dash' }),
    b.text(() => [s.x, 0], () => fmt(s.x, 2), { cls: 'rd', dy: -6 }),
    b.text(() => [0, f(s.x)], () => fmt(f(s.x), 2), { cls: 'rd', dx: 6, dy: -6 }),
    b.drag(() => [s.x, f(s.x)], (x) => { s.x = clamp(snap(x, o.step), 0, o.max); }),
  ];
  const old = b.onUpdate;
  b.onUpdate = () => { if (old) old(); if (o.read) o.read(s.x, f(s.x)); };
  return nodes;
}

/* ---------- 第 2 页小图 ---------- */
function svgEl(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
}
function initMini() {
  const g = $('pairFig');
  const [x0, y0, u] = [40, 105, 26];
  for (let i = 0; i <= 5; i += 1) svgEl('line', { x1: x0 + i * u, x2: x0 + i * u, y1: y0, y2: y0 - 3 * u, class: 'mg' }, g);
  for (let j = 0; j <= 3; j += 1) svgEl('line', { x1: x0, x2: x0 + 5 * u, y1: y0 - j * u, y2: y0 - j * u, class: 'mg' }, g);
  svgEl('circle', { cx: x0 + 3 * u, cy: y0 - 2 * u, r: 6, fill: '#c0392b' }, g);
  svgEl('text', { x: x0 + 3 * u + 8, y: y0 - 2 * u - 8, class: 'mt' }, g).textContent = '(3, 2)';
  const l = $('lineFig');
  const pts = [[30, 95], [65, 70], [100, 78], [135, 40], [170, 30]];
  svgEl('line', { x1: 25, x2: 180, y1: 105, y2: 105, class: 'mg' }, l);
  svgEl('line', { x1: 25, x2: 25, y1: 105, y2: 15, class: 'mg' }, l);
  svgEl('polyline', { points: pts.map((p) => p.join(',')).join(' '), fill: 'none', stroke: '#1d6fa5', 'stroke-width': 2.5 }, l);
  pts.forEach(([x, y]) => svgEl('circle', { cx: x, cy: y, r: 4, fill: '#c0392b' }, l));
}

/* ---------- 例 2：描点、连线 ---------- */
const CAR = Array.from({ length: 7 }, (_, i) => [i + 1, 80 * (i + 1)]);
function initEx2() {
  const o = { x: [0, 8], y: [0, 560], tx: 1, ty: 80, xl: '时间/时', yl: '路程/千米' };
  const b = graph($('b2'), o);
  const ln = line(b, 80, 7.6);
  show([ln], false);
  const tab = () => {
    $('b2Tab').innerHTML = `<tr><th>时间/时</th>${CAR.map((d, i) => `<td class="${cp.placed.has(i) ? 'on' : ''}">${d[0]}</td>`).join('')}</tr>`
      + `<tr><th>路程/千米</th>${CAR.map((d, i) => `<td class="${cp.placed.has(i) ? 'on' : ''}">${d[1]}</td>`).join('')}</tr>`;
  };
  const msg = $('b2Msg');
  const cp = clickPlot(b, o, CAR, (i, p) => {
    msg.className = `tip small feedback ${i >= 0 ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = i >= 0
      ? `✓ 点 (${p[0]}, ${p[1]})：${p[0]} 小时行 ${p[1]} 千米。还剩 ${CAR.length - cp.placed.size} 个点。`
      : `这个格点表示 ${fmt(p[0], 1)} 小时行 ${fmt(p[1], 1)} 千米，表里没有这组数。`;
    tab();
  }, { 0: 'A', 4: 'B' });
  msg.className = 'tip small feedback';
  msg.innerHTML = '在左图中点出表里各组数据对应的点（横轴是时间，纵轴是路程）。';
  tab();
  $('b2Auto').addEventListener('click', () => { cp.all(); tab(); });
  $('b2Line').addEventListener('click', () => { cp.all(); tab(); show([ln], true); b.update(); });
}

/* ---------- 拖点读值 ---------- */
function initRead() {
  const o = { x: [0, 8], y: [0, 560], tx: 1, ty: 80, xl: '时间/时', yl: '路程/千米' };
  const b = graph($('b3'), o);
  line(b, 80, 7.6);
  CAR.forEach((d) => b.pt(d, { cls: 'dp', r: 5 }));
  reader(b, (x) => 80 * x, { x0: 1, step: 0.1, max: 7, read: (x, y) => { $('b3Read').innerHTML = `时间 <b>${fmt(x, 1)}</b> 小时 → 路程 <b>${fmt(y, 1)}</b> 千米`; } });
}

/* ---------- 速度不同的直线 ---------- */
function initSlopes() {
  const o = { x: [0, 8], y: [0, 800], tx: 1, ty: 100, xl: '时间/时', yl: '路程/千米' };
  const b = graph($('b4'), o);
  const s = { k: 120, off: false };
  line(b, 80, 7.6, 'ghost');
  b.text([7.6, 608], '80', { cls: 'rd g', dx: 4 });
  b.fn((x) => s.k * x + (s.off ? 100 : 0), { from: 0, to: () => Math.min(7.6, (800 - (s.off ? 100 : 0)) / s.k), cls: 'c2' });
  b.pt(() => [0, s.off ? 100 : 0], { cls: 'zero', r: 7 });
  const render = () => {
    $('kV').textContent = s.k;
    $('kOff').classList.toggle('solid', s.off);
    const y1 = s.k + (s.off ? 100 : 0);
    const y2 = 2 * s.k + (s.off ? 100 : 0);
    $('b4Msg').innerHTML = s.off
      ? `$y=${s.k}x+100$：$${y1}\\div1=${y1}$，$${y2}\\div2=${y2 / 2}$，比值<b>不一定</b>，直线<b>不过 0 点</b>。`
      : `速度 ${s.k} 千米/时：$\\dfrac{路程}{时间}=${s.k}$（一定），直线经过 0 点。灰色虚线是 80 千米/时。`;
    MathKit.tex($('b4Msg'));
    b.update();
  };
  MathKit.slider($('kSl'), (v) => { s.k = v; render(); });
  $('kOff').addEventListener('click', () => { s.off = !s.off; render(); });

}

/* ---------- 练一练：小玲打字 ---------- */
const TYPE = Array.from({ length: 7 }, (_, i) => [2 * (i + 1), 100 * (i + 1)]);
function initTyping() {
  const o = { x: [0, 16], y: [0, 800], tx: 1, ty: 100, xl: '时间/分', yl: '数量/个' };
  const b = graph($('b5'), o);
  const msg = $('b5Msg');
  const ln = line(b, 50, 16);
  const rd = reader(b, (x) => 50 * x, { x0: 5, step: 0.5, max: 16, read: (x, y) => { if (!ln.classList.contains('off')) msg.innerHTML = `${fmt(x, 1)} 分钟 → ${fmt(y, 1)} 个字`; } });
  show([ln, ...rd], false);
  const cp = clickPlot(b, o, TYPE, (i, p) => {
    msg.className = `tip small feedback ${i >= 0 ? 'fb-ok' : 'fb-warn'}`;
    msg.innerHTML = i >= 0 ? `✓ (${p[0]}, ${p[1]})，还剩 ${TYPE.length - cp.placed.size} 个点。` : `这个格点是 ${fmt(p[0], 1)} 分钟、${fmt(p[1], 1)} 个，表里没有。`;
  });
  msg.innerHTML = '在方格图上点出表里的 7 个点。';
  $('b5Line').addEventListener('click', () => {
    if (cp.placed.size < TYPE.length) { msg.className = 'tip small feedback fb-warn'; msg.innerHTML = '先把 7 个点都描出来，再连线。'; return; }
    show([ln, ...rd], true);
    msg.className = 'tip small feedback fb-ok';
    b.update();
  });
}

/* ---------- 练习十 3：骑车（直线过 (30,8)(60,16)(90,24)） ---------- */
function initBike() {
  const o = { x: [0, 120], y: [0, 28], tx: 10, ty: 4, xl: '时间/分', yl: '路程/千米' };
  const b = graph($('b6'), o);
  const k = 8 / 30;
  line(b, k, 96);
  [30, 60, 90].forEach((x) => b.pt([x, k * x], { cls: 'dp', r: 5 }));
  reader(b, (x) => k * x, { x0: 20, step: 0.5, max: 96, read: (x, y) => { $('b6Read').innerHTML = `拖一拖：<b>${fmt(x, 1)}</b> 分钟 → 约 <b>${fmt(y, 2)}</b> 千米`; } });
}

/* ---------- 练习十 4：彩带（表填对一格就描一点） ---------- */
function initRibbon() {
  const o = { x: [0, 8], y: [0, 25], tx: 1, ty: 5, xl: '长度/米', yl: '总价/元' };
  const b = graph($('b7'), o);
  const blanks = [...document.querySelectorAll('#b7')[0].closest('.slide').querySelectorAll('.mtab .blank')];
  const ok = () => blanks.map((x) => x.classList.contains('ok'));
  [1, 2, 3, 4, 5].forEach((m, i) => b.pt([m, 5 * m], { cls: 'dp', r: 6, show: () => i === 0 || ok()[i - 1] }));
  const ln = line(b, 5, 5);
  const rd = reader(b, (x) => 5 * x, { x0: 3.5, step: 0.1, max: 5 });
  show([ln, ...rd], false);
  const sync = () => { const all = ok().every(Boolean); show([ln, ...rd], all); b.update(); };
  blanks.forEach((x) => new MutationObserver(sync).observe(x, { attributes: true, attributeFilter: ['class'] }));
}

/* ---------- 练习十 5：弹簧（质量不超过 20 千克） ---------- */
function initSpring() {
  const o = { x: [0, 20], y: [0, 5], tx: 2, ty: 0.5, xl: '质量/kg', yl: '长度/cm' };
  const b = graph($('b8'), o);
  line(b, 0.25, 20);
  [2, 4, 6, 8, 10, 20].forEach((x) => b.pt([x, x / 4], { cls: 'dp', r: 5 }));
  reader(b, (x) => x / 4, { x0: 5, step: 0.5, max: 20, read: (x, y) => { $('b8Read').innerHTML = `挂 <b>${fmt(x, 1)}</b> 千克 → 伸长 <b>${fmt(y, 3)}</b> 厘米`; } });
}

window.LESSON = {
  init() {
    initMini();
    initEx2();
    initRead();
    initSlopes();
    initTyping();
    initBike();
    initRibbon();
    initSpring();
  },
  onRender() {
    requestAnimationFrame(() => boards.forEach((b) => b.update()));
  },
};
