'use strict';
/* 六上 相邻体积单位间的进率 · 本课互动：两个同样大的正方体（1 dm / 10 cm）、把 1 dm³ 按 1 cm 精确分割
 * （拉出一排 10 个 → 抬起一层 100 个 → 分成 10 层 1000 个）、10 / 100 / 1000 对比图、思考题（高增加 2 cm 的 4 条侧面）。
 * 小正方体网格由 ../shared/mcube.js 生成，只画露在外面的小正方形面。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const VIEWS = [];
const reg = (v) => { VIEWS.push(v); return v; };
const fmt = (v) => String(+v.toFixed(2));
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
const GOLD = '#f7c948';
const N = 10;

/* 第 3 页：棱长 1 dm 与棱长 10 cm（同一比例） */
function initTwo() {
  const v = reg(Poly3D.view($('twov'), { w: 560, h: 320, scale: 16, yaw: -28, pitch: 24, center: [11, 5, 5] }));
  v.add(() => [
    Poly3D.box([0, 0, 0], [N, N, N], { color: '#f7e19a' }),
    MCube.voxels(MCube.block(N, N, N), { color: GOLD, at: [13, 0, 0] }),
    { type: 'text', p: [5, 0, 0], text: '1 dm', cls: 'dim', dx: -18, dy: 22, top: true },
    { type: 'text', p: [18, 0, 0], text: '10 cm', cls: 'dim', dx: -22, dy: 22, top: true },
  ]);
  v.update();
}

/* 第 4 页：放大分割 */
function initSplit() {
  const s = { stage: 0, g: 0 };
  const h3 = () => (s.stage === 3 ? N + (N - 1) * 0.8 * s.g : N + (s.stage === 2 ? 3 * s.g : 0));
  const v = reg(Poly3D.view($('splitv'), {
    w: 560, h: 440, yaw: -30, pitch: 24,
    scale: () => 340 / (h3() * 0.92 + 9),
    center: () => [N / 2, N / 2 - (s.stage === 1 ? 1.2 * s.g : 0), h3() / 2],
  }));
  const all = MCube.block(N, N, N);
  v.add(() => {
    const g = s.g;
    if (s.stage === 0) return [Poly3D.box([0, 0, 0], [N, N, N], { color: GOLD })];
    if (s.stage === 1) {
      return [
        MCube.voxels(all.filter(([, j, k]) => !(j === 0 && k === 0)), { color: GOLD }),
        MCube.voxels(MCube.block(N, 1, 1), { color: '#f19a5b', at: [0, -2.5 * g, 0] }),
      ];
    }
    if (s.stage === 2) {
      return [
        MCube.voxels(MCube.block(N, N, N - 1), { color: GOLD }),
        MCube.voxels(MCube.block(N, N, 1), { color: '#f19a5b', at: [0, 0, N - 1 + 3 * g] }),
      ];
    }
    return Array.from({ length: N }, (_, k) => MCube.voxels(MCube.block(N, N, 1), { color: k % 2 ? GOLD : '#f19a5b', at: [0, 0, k * (1 + 0.8 * g)] }));
  });
  const MSG = [
    '这是棱长 1 分米（10 厘米）的正方体。按 1 厘米切开，会有多少个 1 立方厘米的小正方体？',
    '最前面最下面的一<b>排</b>：棱长 10 厘米，一排有 <b>10</b> 个。',
    '最上面的一<b>层</b>：每排 10 个，有 10 排，$10\\times10=$ <b>100</b> 个。',
    '一共 <b>10 层</b>：$100\\times10=$ <b>1000</b> 个。所以 1 立方分米 = 1000 立方厘米。',
  ];
  let stop = null;
  const show = () => { $('splitMsg').innerHTML = MSG[s.stage]; MathKit.tex($('splitMsg')); };
  btnGroup($('splitK'), (k) => {
    if (stop) stop();
    s.stage = +k;
    s.g = 0;
    show();
    stop = MCube.tween(0, 1, 1200, (g) => { s.g = g; v.update(); });
  });
  v.update();
  show();
}

/* 第 5 页：10 / 100 / 1000 */
function initGrids() {
  const g1 = $('g1');
  const U = 18;
  svgEl('line', { x1: 20, y1: 90, x2: 20 + N * U, y2: 90, stroke: '#1f2d3a', 'stroke-width': 3 }, g1);
  for (let i = 0; i <= N; i += 1) svgEl('line', { x1: 20 + i * U, y1: i % 10 ? 82 : 76, x2: 20 + i * U, y2: i % 10 ? 98 : 104, stroke: '#1f2d3a', 'stroke-width': 2 }, g1);
  const g2 = $('g2');
  for (let i = 0; i < N; i += 1) for (let j = 0; j < N; j += 1) svgEl('rect', { x: 20 + j * U, y: 0 + i * U, width: U, height: U, fill: '#cfe7f6', stroke: '#1d6fa5', 'stroke-width': 1 }, g2);
  const v = reg(Poly3D.view($('g3'), { w: 220, h: 180, scale: 8.2, yaw: -30, pitch: 24, center: [5, 5, 5], rotate: false }));
  v.add(() => MCube.voxels(MCube.block(N, N, N), { color: GOLD }));
  v.update();
}

/* 第 9 页：思考题，原长方体 7 × 7 × 5，高增加 t */
function initThink() {
  const s = { t: 2 };
  const v = reg(Poly3D.view($('thinkv'), { w: 560, h: 340, scale: 30, yaw: -30, pitch: 22, center: [3.5, 3.5, 3.5] }));
  v.add(() => [
    Poly3D.box([0, 0, 0], [7, 7, 5], { color: '#a9d3f0' }),
    ...(s.t > 1e-3 ? [Poly3D.box([0, 0, 5], [7, 7, 5 + s.t], { color: '#f6c99a' })] : []),
    { type: 'text', p: [3.5, 0, 0], text: '7 cm', cls: 'dim', dx: -18, dy: 24, top: true },
    { type: 'text', p: [0, 0, 2.5], text: '5 cm', cls: 'dim', dx: -52, top: true },
    { type: 'text', p: [0, 0, 5 + s.t / 2], text: `+${fmt(s.t)} cm`, cls: 'dim', dx: -66, top: true },
  ]);
  MathKit.slider($('tH'), (t) => { s.t = t; $('tHv').textContent = fmt(t); v.update(); });
}

window.LESSON = {
  init() {
    initTwo();
    initSplit();
    initGrids();
    initThink();
  },
  onRender(slide) { VIEWS.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
