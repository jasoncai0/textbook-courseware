'use strict';
/* 六上 体积和体积单位 · 本课互动：例 6 往放了水果的杯子里倒水（剩下的水 = 水果体积，水面高度按圆柱体积精确计算）、
 * 试一试两杯互倒比容积、例 8 把长方体和正方体分成同样大的小正方体数一数、体积单位按真实比例对照、
 * 小正方体摆成的物体数体积、1 立方分米容器与 1 立方厘米方块、练习三第 10 题三视图。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const VIEWS = [];
const reg = (v) => { VIEWS.push(v); return v; };
const fmt = (v, d = 1) => String(+v.toFixed(d));
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});
const WATER = '#9fd3f2';
const cylV = (r, h) => Math.PI * r * r * h;
// 球放在杯底，水深 h（≤ 2r）时球浸在水下的体积（球冠）
const capV = (r, h) => { const x = Math.max(0, Math.min(2 * r, h)); return (Math.PI * x * x * (3 * r - x)) / 3; };
// 倒进体积 vol 的水后，杯里（杯底放着半径 r 的球）水面有多高：二分求解
function levelWith(R, r, vol, H) {
  let [lo, hi] = [0, H];
  for (let i = 0; i < 50; i += 1) {
    const m = (lo + hi) / 2;
    if (cylV(R, m) - capV(r, m) < vol) lo = m; else hi = m;
  }
  return lo;
}

/* 第 3 页：例 6 */
const FRUITS = { peach: { n: '桃', r: 3, c: '#f4a3a8' }, lychee: { n: '荔枝', r: 1.6, c: '#d94a4a' }, cherry: { n: '樱桃', r: 1.1, c: '#c0182c' }, none: { n: '', r: 0, c: '' } };
function initPour() {
  const R = 3.5;
  const H = 10;
  const PX = 25; // 每厘米 25 像素
  const BASE = 300;
  const X = [70, 315];
  const svg = $('cups');
  const s = { k: 'peach', p: 0 };
  let stop = null;
  const draw = () => {
    svg.replaceChildren();
    const f = FRUITS[s.k];
    const full = cylV(R, H);
    const vf = (4 / 3) * Math.PI * f.r ** 3;
    const poured = s.p * (full - vf);
    const leftH = H - poured / cylV(R, 1);
    const rightH = levelWith(R, f.r, poured, H);
    X.forEach((x0, i) => {
      const lv = i === 0 ? leftH : rightH;
      svgEl('rect', { x: x0, y: BASE - lv * PX, width: 2 * R * PX, height: lv * PX, fill: WATER }, svg);
      if (i === 1 && f.r) svgEl('circle', { cx: x0 + R * PX, cy: BASE - f.r * PX, r: f.r * PX, fill: f.c, stroke: '#7a3b3b', 'stroke-width': 1.5 }, svg);
      svgEl('path', { d: `M${x0} ${BASE - H * PX - 8}V${BASE}H${x0 + 2 * R * PX}V${BASE - H * PX - 8}`, fill: 'none', stroke: '#6f8191', 'stroke-width': 4 }, svg);
      svgEl('text', { x: x0 + R * PX, y: BASE + 26, class: 'cup-lb' }, svg).textContent = i ? '右杯' : '左杯';
    });
    return { leftH, vf };
  };
  const msg = (done) => {
    const { leftH, vf } = draw();
    const f = FRUITS[s.k];
    if (!done) { $('pourMsg').innerHTML = s.p > 0 ? '正在倒……' : `右杯里放了：<b>${f.n || '什么都没放'}</b>。左杯装满了水。`; return; }
    $('pourMsg').className = 'tip feedback fb-ok';
    $('pourMsg').innerHTML = f.r ? `右杯满了，左杯还剩下约 <b>${fmt(vf, 0)}</b> 立方厘米的水（水深约 ${fmt(leftH)} cm）——正好是${f.n}占的空间。` : '右杯是空的，左杯的水<b>正好全部倒完</b>：两个杯子一样大。';
  };
  btnGroup($('fruitK'), (k) => { if (stop) stop(); s.k = k; s.p = 0; $('pourMsg').className = 'tip feedback'; msg(false); });
  $('pourGo').addEventListener('click', () => {
    if (stop) stop();
    stop = MCube.tween(0, 1, 2200, (p) => { s.p = p; if (p < 1) msg(false); else msg(true); });
  });
  $('pourReset').addEventListener('click', () => { if (stop) stop(); s.p = 0; $('pourMsg').className = 'tip feedback'; msg(false); });
  msg(false);
}

/* 第 4 页：试一试，甲、乙两杯互倒 */
const CUPS = [{ n: '甲', r: 2.5, h: 11, x: 90 }, { n: '乙', r: 3.2, h: 7, x: 330 }];
function initCap() {
  const PX = 22;
  const BASE = 270;
  const svg = $('cap');
  const lv = [CUPS[0].h, 0]; // 甲杯先装满
  let spill = 0;
  const draw = () => {
    svg.replaceChildren();
    CUPS.forEach((c, i) => {
      const w = 2 * c.r * PX;
      svgEl('rect', { x: c.x, y: BASE - lv[i] * PX, width: w, height: lv[i] * PX, fill: WATER }, svg);
      svgEl('path', { d: `M${c.x} ${BASE - c.h * PX}V${BASE}H${c.x + w}V${BASE - c.h * PX}`, fill: 'none', stroke: '#6f8191', 'stroke-width': 4 }, svg);
      svgEl('text', { x: c.x + w / 2, y: BASE + 24, class: 'cup-lb' }, svg).textContent = `${c.n}杯`;
    });
    if (spill > 0) svgEl('text', { x: CUPS[0].x + CUPS[0].r * PX, y: BASE - CUPS[0].h * PX - 10, class: 'cup-sp' }, svg).textContent = '溢出来了！';
  };
  let stop = null;
  const pour = (from, to) => {
    if (stop) stop();
    const vol = cylV(CUPS[from].r, CUPS[from].h);
    const cap = cylV(CUPS[to].r, CUPS[to].h);
    spill = 0;
    stop = MCube.tween(0, 1, 2000, (p) => {
      const v = vol * p;
      lv[from] = CUPS[from].h * (1 - p);
      lv[to] = Math.min(v, cap) / cylV(CUPS[to].r, 1);
      spill = to === 0 && v > cap ? v - cap : 0;
      draw();
      if (p < 1) return;
      const m = $('capMsg');
      m.className = 'tip feedback fb-ok';
      m.innerHTML = vol < cap
        ? `${CUPS[from].n}杯的水倒进${CUPS[to].n}杯，<b>没有装满</b>（还差约 ${fmt(cap - vol, 0)} 立方厘米）。`
        : `${CUPS[from].n}杯的水倒进${CUPS[to].n}杯，<b>溢出来</b>约 ${fmt(vol - cap, 0)} 立方厘米。`;
      m.innerHTML += '<br>所以<b>乙杯的容积大一些</b>。';
    });
  };
  $('capGo').addEventListener('click', () => pour(0, 1));
  $('capBack').addEventListener('click', () => pour(1, 0));
  draw();
  $('capMsg').innerHTML = '甲杯细而高，乙杯粗而矮。先猜一猜，再倒一倒。';
}

/* 第 5 页：例 8 分成小正方体（长方体 3×3×1，正方体 2×2×2） */
function initCompare() {
  const s = { g: 0 };
  const v = reg(Poly3D.view($('cmpv'), { w: 560, h: 420, scale: 62, yaw: -28, pitch: 26, center: [3.3, 1.2, 1] }));
  const cells = (nx, ny, nz, at) => MCube.block(nx, ny, nz).map(([i, j, k]) => ({ c: [i, j, k], at }));
  const parts = [...cells(3, 3, 1, [0, 0, 0]), ...cells(2, 2, 2, [4.4, 0.5, 0])];
  v.add(() => {
    if (s.g < 1e-3) {
      return [
        Poly3D.box([0, 0, 0], [3, 3, 1], { color: '#a9d3f0' }),
        Poly3D.box([4.4, 0.5, 0], [6.4, 2.5, 2], { color: '#f6c99a' }),
      ];
    }
    const k = 1 + s.g;
    return parts.map(({ c, at }) => {
      const o = c.map((x, i) => at[i] + x * k - (i === 2 ? 0 : 0));
      return Poly3D.box(o, o.map((x) => x + 1), { color: at[0] ? '#f6c99a' : '#a9d3f0' });
    });
  });
  v.update();
  let stop = null;
  const go = (to) => { if (stop) stop(); stop = MCube.tween(s.g, to, 900, (g) => { s.g = g; v.update(); }); };
  $('cutGo').addEventListener('click', () => go(0.25));
  $('cutBack').addEventListener('click', () => go(0));
}

/* 第 6 页：1 cm³ 与 1 dm³ 按真实比例 */
function initUnits() {
  const v = reg(Poly3D.view($('unitv'), { w: 560, h: 330, scale: 21, yaw: -28, pitch: 22, center: [3.5, 5, 5] }));
  v.add(() => [
    Poly3D.box([-6, 0, 0], [-5, 1, 1], { color: '#f7c948' }),
    Poly3D.box([0, 0, 0], [10, 10, 10], { color: '#f7e19a' }),
    { type: 'text', p: [-5.5, 0, 1], text: '1 cm³', cls: 'dim', dx: -26, dy: -16, top: true },
    { type: 'text', p: [5, 0, 0], text: '1 dm（10 cm）', cls: 'dim', dx: -50, dy: 24, top: true },
    { type: 'text', p: [5, 5, 10], text: '1 dm³', cls: 'dim', dx: -16, dy: 6, top: true },
  ]);
  v.update();
}

/* 第 7 页、第 9 页：小正方体摆成的物体 */
function voxView(el, cells, o = {}) {
  const xs = cells.map((c) => c[0]);
  const zs = cells.map((c) => c[2]);
  const cen = [(Math.min(...xs) + Math.max(...xs) + 1) / 2, 0.5, (Math.min(...zs) + Math.max(...zs) + 1) / 2];
  const v = reg(Poly3D.view(el, { w: 320, h: 200, scale: o.scale || 50, yaw: -30, pitch: 26, center: cen }));
  v.add(() => (o.show && !o.show() ? [] : MCube.voxels(cells, { color: '#f7c948' })));
  v.update();
  return v;
}
const KS = {
  k1: MCube.block(4, 1, 1),
  k2: MCube.block(3, 1, 2),
  k3: [...MCube.block(4, 1, 1), ...MCube.block(3, 1, 1, [0, 0, 1])],
  k4: [...MCube.block(2, 2, 1), [0, 1, 1], [1, 1, 1]],
};
const K5 = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 0, 1]];

/* 第 8 页：1 dm³ 容器装满水，旁边 1 cm³ */
function initLiter() {
  const v = reg(Poly3D.view($('literv'), { w: 560, h: 330, scale: 23, yaw: -28, pitch: 24, center: [5, 5, 5] }));
  v.add(() => [
    ...MCube.boxFaces(10, 10, 10).map((f) => ({ type: 'face', pts: f.pts, out: f.out, color: '#b6dcf3' })),
    Poly3D.box([10.6, 0, 0], [11.6, 1, 1], { color: '#f7c948' }),
    { type: 'text', p: [5, 0, 0], text: '1 dm', cls: 'dim', dx: -20, dy: 24, top: true },
    { type: 'text', p: [5, 5, 10], text: '1 升', cls: 'dim', dx: -16, dy: 6, top: true },
    { type: 'text', p: [11.1, 0, 1], text: '1 毫升', cls: 'dim', dx: 14, dy: 4, top: true },
  ]);
  v.update();
}

/* 第 9 页：练习三 10 三视图 */
function initViews() {
  const svg = $('views3');
  const U = 24;
  const VIEWS3 = [{ n: '前面', cells: [[0, 0], [1, 0], [2, 0], [2, 1]], x: 20 }, { n: '上面', cells: [[0, 0], [1, 0], [2, 0]], x: 200 }, { n: '右面', cells: [[0, 0], [0, 1]], x: 400 }];
  VIEWS3.forEach((w) => {
    w.cells.forEach(([c, r]) => svgEl('rect', { x: w.x + c * U, y: 70 - r * U, width: U, height: U, fill: '#dff0e6', stroke: '#2f7d6b', 'stroke-width': 2 }, svg));
    svgEl('text', { x: w.x + 36, y: 116, class: 'cup-lb' }, svg).textContent = w.n;
  });
  const s = { on: false };
  const v = voxView($('k5'), K5, { scale: 34, show: () => s.on });
  $('k5Show').addEventListener('click', () => { s.on = !s.on; v.update(); });
}

window.LESSON = {
  init() {
    initPour();
    initCap();
    initCompare();
    initUnits();
    Object.entries(KS).forEach(([id, cells]) => voxView($(id), cells));
    initLiter();
    initViews();
  },
  onRender(slide) { VIEWS.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
