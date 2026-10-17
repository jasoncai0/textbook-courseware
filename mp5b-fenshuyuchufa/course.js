'use strict';
/* 五下 分数与除法 · 本课互动：例 2 分 1 块饼、例 3 分饼动画（两种分法，饼数 / 人数可调，核心）、米尺与钟面、
 * “3/4 米与 3 米的 1/4”长度对比、绳子图。饼块大小、位置、长度都按数值精确计算。通用部分见 ../shared/fracfig.js */
const { el, pie, bar, texFrac, FILL, LINE } = FracFig;
const $ = (id) => document.getElementById(id);
const CAKE = '#e9a54b';
const CAKE_LINE = '#9c5b1c';
const text = (svg, x, y, s, cls = 'ff-t') => { const t = el('text', { x, y, class: cls }, svg); t.textContent = s; return t; };

/* ---------- 分饼动画（例 2、例 3 共用） ---------- */
const MOVE_MS = 900;
function makeDivider(svg, opt) {
  const W = 1000;
  const PIE_R = opt.pieR || 62;
  const PIE_Y = 92;
  const PLATE_Y = opt.plateY || 300;
  let token = 0;
  let pieces = [];
  let geo = null;

  const sectorPath = (b) => {
    if (b === 1) return 'M1 0A1 1 0 1 1 1 -0.0001Z';
    const t = (2 * Math.PI) / b;
    const p = (a) => `${Math.cos(a - Math.PI / 2).toFixed(4)} ${Math.sin(a - Math.PI / 2).toFixed(4)}`;
    return `M0 0L${p(0)}A1 1 0 0 1 ${p(t)}Z`;
  };
  const place = (node, { x, y, rot, s }) => { node.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${s})`; };

  function layout(a, b) {
    svg.innerHTML = '';
    const pieGap = Math.min(170, (W - 80) / a);
    const pieX = (i) => W / 2 + (i - (a - 1) / 2) * pieGap;
    const plateW = W / b;
    const cols = Math.ceil(a / b);
    const r2 = Math.min(44, (plateW / cols) / 2 - 10);
    const plateX = (j) => plateW * (j + 0.5);
    // 盘子
    for (let j = 0; j < b; j += 1) {
      el('ellipse', { cx: plateX(j), cy: PLATE_Y, rx: plateW / 2 - 8, ry: r2 + 16, fill: '#f4f7fa', stroke: '#c9d4de', 'stroke-width': 2 }, svg);
      text(svg, plateX(j), PLATE_Y + r2 + 44, `第 ${j + 1} 人`, 'ff-t s');
    }
    // 饼的虚线轮廓（饼块离开后还能看出原来的位置）
    for (let i = 0; i < a; i += 1) el('circle', { cx: pieX(i), cy: PIE_Y, r: PIE_R, fill: 'none', stroke: '#d9c3a3', 'stroke-width': 2, 'stroke-dasharray': '7 6' }, svg);
    const d = sectorPath(b);
    pieces = [];
    for (let i = 0; i < a; i += 1) {
      for (let j = 0; j < b; j += 1) {
        const node = el('path', { d, fill: CAKE, stroke: CAKE_LINE, 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke', class: 'dv-piece' }, svg);
        const from = { x: pieX(i), y: PIE_Y, rot: (j * 360) / b, s: PIE_R };
        const c = Math.floor(i / b);
        const to = { x: plateX(j) + (c - (cols - 1) / 2) * (2 * r2 + 10), y: PLATE_Y, rot: ((i % b) * 360) / b, s: r2 };
        node.style.transition = 'none';
        place(node, from);
        pieces.push({ node, i, j, from, to });
      }
    }
    geo = { a, b };
    svg.getBoundingClientRect(); // 先让初始位置生效，再开启过渡
    pieces.forEach((p) => { p.node.style.transition = ''; });
  }

  const wait = (ms, t) => new Promise((res) => setTimeout(() => res(t === token), ms));
  async function run(method) {
    const { a, b } = opt.get();
    const t = ++token;
    layout(a, b);
    if (opt.onStart) opt.onStart();
    if (!(await wait(400, t))) return;
    if (method === 'one') {
      for (let i = 0; i < a; i += 1) {
        pieces.filter((p) => p.i === i).forEach((p) => place(p.node, p.to));
        if (!(await wait(MOVE_MS + 250, t))) return;
      }
    } else {
      // 叠起来：所有饼移到中间，一块压一块
      pieces.forEach((p) => place(p.node, { ...p.from, x: W / 2, y: PIE_Y - p.i * 5 }));
      if (!(await wait(MOVE_MS + 300, t))) return;
      pieces.forEach((p) => place(p.node, p.to));
      if (!(await wait(MOVE_MS + 200, t))) return;
    }
    if (opt.onDone) opt.onDone(method);
  }
  return { run, layout, get geo() { return geo; } };
}

function quotientTex(a, b) {
  return a % b === 0 ? `${a}\\div${b}=${a / b}` : `${a}\\div${b}=\\dfrac{${a}}{${b}}`;
}

function initE2() {
  const dv = makeDivider($('e2'), { get: () => ({ a: 1, b: 4 }), pieR: 55, plateY: 190 });
  $('e2').setAttribute('viewBox', '0 0 1000 270');
  dv.layout(1, 4);
  $('e2Go').addEventListener('click', () => dv.run('one'));
}

const DV = { a: 3, b: 4 };
const A_MAX = 5;
const B_MIN = 2;
const B_MAX = 6;
function initDV() {
  const msg = $('dvMsg');
  const show = (html) => { msg.innerHTML = html; MathKit.tex(msg); };
  const dv = makeDivider($('dv'), {
    get: () => DV,
    onStart: () => show('分一分……'),
    onDone: (m) => {
      const { a, b } = DV;
      const how = m === 'one'
        ? `每次分 1 块，每人得 $\\dfrac1{${b}}$ 块；分 ${a} 次，每人得到 <b>${a} 个 $\\dfrac1{${b}}$ 块</b>`
        : `${a} 块叠起来平均分成 ${b} 份，每人分得 <b>${a} 块的 $\\dfrac1{${b}}$</b>`;
      const more = a > b && a % b ? '（比 1 块多）' : '';
      show(`${how}。　$${quotientTex(a, b)}$（块）${more}`);
    },
  });
  const reset = () => {
    $('dvA').textContent = DV.a; $('dvB').textContent = DV.b;
    dv.layout(DV.a, DV.b);
    show(`把 ${DV.a} 块饼平均分给 ${DV.b} 人：选一种方法分一分。`);
  };
  document.querySelector('#dv').closest('.slide').querySelector('.ctrlrow').addEventListener('click', (e) => {
    const d = e.target.closest('[data-d]')?.dataset.d;
    if (!d) return;
    if (d[0] === 'a') DV.a = Math.min(A_MAX, Math.max(1, DV.a + (d[1] === '+' ? 1 : -1)));
    else DV.b = Math.min(B_MAX, Math.max(B_MIN, DV.b + (d[1] === '+' ? 1 : -1)));
    reset();
  });
  $('dvOne').addEventListener('click', () => dv.run('one'));
  $('dvAll').addEventListener('click', () => dv.run('all'));
  reset();
}

/* ---------- 静态图 ---------- */
function initFigs() {
  pie($('rcPie'), { cx: 120, cy: 50, r: 44, n: 4, on: (i) => i < 3 });

  // 米尺：1 米 = 10 分米，涂出 7 分米
  const ru = $('ruler');
  bar(ru, { x: 30, y: 40, w: 500, h: 34, n: 10, on: (i) => i < 7 });
  for (let i = 0; i <= 10; i += 1) text(ru, 30 + 50 * i, 100, String(i), 'ff-t s');
  text(ru, 30, 26, '0', 'ff-t s'); text(ru, 530, 26, '1 米', 'ff-t');
  text(ru, 205, 128, '7 分米', 'ff-t b');

  // 钟面：从 12 开始的 23 分
  const ck = $('clock');
  const [cx, cy, R] = [110, 110, 96];
  el('circle', { cx, cy, r: R, fill: '#fff', stroke: '#6f8191', 'stroke-width': 3 }, ck);
  const ang = (m) => -Math.PI / 2 + (m / 60) * 2 * Math.PI;
  const P = (m, r) => `${(cx + r * Math.cos(ang(m))).toFixed(2)} ${(cy + r * Math.sin(ang(m))).toFixed(2)}`;
  el('path', { d: `M${cx} ${cy}L${P(0, R - 2)}A${R - 2} ${R - 2} 0 0 1 ${P(23, R - 2)}Z`, fill: FILL, stroke: LINE, 'stroke-width': 2 }, ck);
  for (let m = 0; m < 60; m += 1) {
    const long = m % 5 === 0;
    el('line', { x1: P(m, R).split(' ')[0], y1: P(m, R).split(' ')[1], x2: P(m, R - (long ? 14 : 7)).split(' ')[0], y2: P(m, R - (long ? 14 : 7)).split(' ')[1], stroke: '#1f2d3a', 'stroke-width': long ? 3 : 1.4 }, ck);
  }
  el('circle', { cx, cy, r: 4, fill: '#1f2d3a' }, ck);

  // 1 米的 3/4 与 3 米的 1/4（每米 240 像素，按比例）
  const cm = $('cmp');
  const M = 240;
  const X0 = 110;
  text(cm, 55, 52, '1 米', 'ff-t');
  bar(cm, { x: X0, y: 30, w: M, h: 30, n: 4, on: (i) => i < 3 });
  text(cm, 55, 132, '3 米', 'ff-t');
  bar(cm, { x: X0, y: 110, w: 3 * M, h: 30, n: 4, on: (i) => i === 0, fill: '#f6c27a', line: '#d9711c' });
  el('line', { x1: X0 + 0.75 * M, x2: X0 + 0.75 * M, y1: 18, y2: 160, stroke: '#c0392b', 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, cm);
  text(cm, X0 + 0.375 * M, 22, '1 米的 3/4', 'ff-t b');
  text(cm, X0 + 0.375 * M, 175, '3 米的 1/4', 'ff-t b');

  // 绳子：1 米 3 份；2 根 1 米各 3 份，每份 2 个 1/3 米
  const rp = $('rope');
  const rope = (y, on) => {
    el('line', { x1: 40, x2: 460, y1: y, y2: y, stroke: '#b48a52', 'stroke-width': 10, 'stroke-linecap': 'round' }, rp);
    for (let k = 1; k < 3; k += 1) el('line', { x1: 40 + 140 * k, x2: 40 + 140 * k, y1: y - 12, y2: y + 12, stroke: '#c0392b', 'stroke-width': 3 }, rp);
    if (on) el('line', { x1: 40, x2: 180, y1: y, y2: y, stroke: '#f05a5a', 'stroke-width': 10, 'stroke-linecap': 'round' }, rp);
  };
  rope(22, false);
  text(rp, 490, 28, '(1)', 'ff-t s');
  rope(82, true); rope(112, true);
  text(rp, 490, 102, '(2)', 'ff-t s');
  text(rp, 250, 145, '每根都是 1 米', 'ff-t s');
}

window.LESSON = {
  init() {
    initFigs();
    initE2();
    initDV();
    FracFig.exact();
  },
};
