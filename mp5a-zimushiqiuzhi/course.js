'use strict';
/* 五上 求含有字母的式子的值 · 本课互动：按真实比例画的例 6 三角形、例 7 小棒两种数法（3a + 4a 与 7a，根数由代码数出）、
 * 练一练彩带（每段等长）、练习十九第 4 题平面图（12 : 4 按比例）。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};

function stick(parent, [x1, y1], [x2, y2], color) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const [dx, dy] = [((x2 - x1) / len) * 3.5, ((y2 - y1) / len) * 3.5];
  return svgEl('line', { x1: x1 + dx, y1: y1 + dy, x2: x2 - dx, y2: y2 - dy, stroke: color, 'stroke-width': 6, 'stroke-linecap': 'round' }, parent);
}

/* 第 3 页：底 14、高 8.4，顶点在底边上方离左端 4 处（照课本示意），每厘米 24 像素 */
function initTri6() {
  const svg = $('tri6');
  const k = 24;
  const [x0, yb] = [42, 230];
  const A = [x0, yb];
  const B = [x0 + 14 * k, yb];
  const C = [x0 + 4 * k, yb - 8.4 * k];
  svgEl('polygon', { points: [A, B, C].map((p) => p.join(',')).join(' '), fill: '#dbeaf6', stroke: '#1d6fa5', 'stroke-width': 3 }, svg);
  svgEl('line', { x1: C[0], y1: C[1], x2: C[0], y2: yb, stroke: '#d9711c', 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, svg);
  svgEl('path', { d: `M${C[0]} ${yb - 12}h12v12`, fill: 'none', stroke: '#d9711c', 'stroke-width': 2 }, svg);
  svgEl('text', { x: C[0] + 10, y: (C[1] + yb) / 2 + 30, class: 'f-lb st' }, svg).textContent = '高 8.4 cm';
  svgEl('text', { x: (A[0] + B[0]) / 2, y: yb + 30, class: 'f-lb' }, svg).textContent = '底 14 cm';
}

/* 第 5 页：a 个三角形 + a 个正方形，两种数法 */
const PAIR = { slot: 78, side: 54, tri: '#2e9b48', sq: '#2f6fd0', grp: ['#2e9b48', '#d9711c'] };
function initPair() {
  const svg = $('pair');
  const st = { a: 5, g: 'shape' };
  const draw = () => {
    svg.innerHTML = '';
    const { a, g } = st;
    const { slot, side } = PAIR;
    const x0 = (760 - a * slot) / 2 + (slot - side) / 2;
    const h = (side * Math.sqrt(3)) / 2;
    let n = 0;
    for (let i = 0; i < a; i += 1) {
      const x = x0 + i * slot;
      const [ct, cs] = g === 'shape' ? [PAIR.tri, PAIR.sq] : [PAIR.grp[i % 2], PAIR.grp[i % 2]];
      if (g === 'pair') {
        svgEl('rect', { x: x - 9, y: 6, width: side + 18, height: 170, rx: 10, fill: i % 2 ? '#fdf1e6' : '#eef6f2', stroke: ct, 'stroke-width': 2, 'stroke-dasharray': '6 4' }, svg);
        svgEl('text', { x: x + side / 2, y: 200, class: 'p-lb', fill: ct }, svg).textContent = '7 根';
      }
      const [A, B, C] = [[x, 78], [x + side, 78], [x + side / 2, 78 - h]];
      [[A, B], [B, C], [C, A]].forEach(([p, q]) => { stick(svg, p, q, ct); n += 1; });
      const [y1, y2] = [100, 100 + side];
      [[[x, y1], [x + side, y1]], [[x + side, y1], [x + side, y2]], [[x + side, y2], [x, y2]], [[x, y2], [x, y1]]].forEach(([p, q]) => { stick(svg, p, q, cs); n += 1; });
    }
    $('pOut').textContent = `${a}`;
    const msg = $('pMsg');
    msg.innerHTML = g === 'shape'
      ? `小华：$3\\times${a}=${3 * a}$ 根，小芳：$4\\times${a}=${4 * a}$ 根，一共 $${3 * a}+${4 * a}=${7 * a}$ 根。数一数图中：<b>${n}</b> 根。`
      : `每组 1 个三角形 + 1 个正方形 = 7 根，${a} 组：$7\\times${a}=${7 * a}$ 根。数一数图中：<b>${n}</b> 根。`;
    tex(msg);
  };
  $('pSl').addEventListener('input', (e) => { st.a = +e.target.value; draw(); });
  document.querySelector('.ctl .seg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-g]');
    if (!b) return;
    st.g = b.dataset.g;
    document.querySelectorAll('.ctl .seg .btn').forEach((x) => x.classList.toggle('solid', x === b));
    draw();
  });
  draw();
}

/* 第 7 页：绿彩带 5 段、红彩带 6 段，每段 x 米 */
function initRibbon() {
  const svg = $('ribbon');
  const [x0, w] = [110, 100];
  [['绿彩带', 5, 50, '#b5e3b8', '#3a9a4a'], ['红彩带', 6, 92, '#f7b3d6', '#e0569a']].forEach(([t, n, y, fill, line]) => {
    svgEl('text', { x: x0 - 12, y: y + 22, class: 'f-lb end' }, svg).textContent = t;
    for (let i = 0; i < n; i += 1) svgEl('rect', { x: x0 + i * w, y, width: w, height: 30, fill, stroke: line, 'stroke-width': 1.5 }, svg);
  });
  svgEl('path', { d: `M${x0 + 2} 44q${w / 4} -8 ${w / 2 - 2} -8q${w / 4} 0 ${w / 2 - 2} 8`, fill: 'none', stroke: '#e0569a', 'stroke-width': 2 }, svg);
  svgEl('text', { x: x0 + w / 2, y: 26, class: 'f-lb it' }, svg).textContent = 'x 米';
}

/* 第 9 页：实验室 12 米、准备室 4 米，宽 a 米 */
function initLab() {
  const svg = $('lab');
  const k = 22;
  const [x0, y0, hgt] = [30, 20, 110];
  svgEl('rect', { x: x0, y: y0, width: 12 * k, height: hgt, fill: '#fbf3b8', stroke: '#8a7a2a', 'stroke-width': 2 }, svg);
  svgEl('rect', { x: x0 + 12 * k, y: y0, width: 4 * k, height: hgt, fill: '#bfe6f7', stroke: '#8a7a2a', 'stroke-width': 2 }, svg);
  svgEl('text', { x: x0 + 6 * k, y: y0 + hgt / 2 + 6, class: 'f-lb' }, svg).textContent = '科学实验室';
  svgEl('text', { x: x0 + 14 * k, y: y0 + hgt / 2 - 6, class: 'f-sm' }, svg).textContent = '实验';
  svgEl('text', { x: x0 + 14 * k, y: y0 + hgt / 2 + 14, class: 'f-sm' }, svg).textContent = '准备室';
  svgEl('text', { x: x0 + 6 * k, y: y0 + hgt + 26, class: 'f-lb' }, svg).textContent = '12 米';
  svgEl('text', { x: x0 + 14 * k, y: y0 + hgt + 26, class: 'f-lb' }, svg).textContent = '4 米';
  svgEl('text', { x: x0 + 16 * k + 10, y: y0 + hgt / 2 + 6, class: 'f-lb st it' }, svg).textContent = 'a 米';
}

window.LESSON = {
  init() {
    initTri6();
    initPair();
    initRibbon();
    initLab();
  },
};
