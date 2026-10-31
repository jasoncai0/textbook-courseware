'use strict';
/* 五上 综合与实践《校园绿地面积》· 本课互动：示例学校平面图按比例绘制（坐标单位 = 米），点绿地显示尺寸线并登记到记录表；
 * 组合草坪的分割 / 添补；汇总条形图按面积精确画出。所有面积都可由图上尺寸算出，记录表答案与图一致。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const pts = (P) => P.map((p) => p.join(',')).join(' ');
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});

/** 尺寸线：p→q，向法线方向偏 off，中间写 label（fs 为字号，单位同坐标） */
function dimLine(g, p, q, label, off, fs) {
  const [dx, dy] = [q[0] - p[0], q[1] - p[1]];
  const L = Math.hypot(dx, dy);
  const [nx, ny] = [-dy / L, dx / L];
  const P = [p[0] + nx * off, p[1] + ny * off];
  const Q = [q[0] + nx * off, q[1] + ny * off];
  svgEl('line', { x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], class: 'dim' }, g);
  [[p, P], [q, Q]].forEach(([a, b]) => svgEl('line', { x1: a[0], y1: a[1], x2: b[0] + nx * fs * 0.25 * Math.sign(off), y2: b[1] + ny * fs * 0.25 * Math.sign(off), class: 'dimx' }, g));
  const mx = (P[0] + Q[0]) / 2 + nx * fs * 0.75 * Math.sign(off);
  const my = (P[1] + Q[1]) / 2 + ny * fs * 0.75 * Math.sign(off);
  svgEl('text', { x: mx, y: my, class: 'dimt', dy: '.35em', style: `font-size:${fs}px` }, g).textContent = label;
}
/** 高：从顶点 a 到垂足 b 的虚线 + 直角记号 */
function heightLine(g, a, b, label, fs, side = 1) {
  svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'hgt' }, g);
  const s = fs * 0.5;
  svgEl('polyline', { points: pts([[b[0] + s * side, b[1]], [b[0] + s * side, b[1] - s], [b[0], b[1] - s]]), class: 'ra' }, g);
  svgEl('text', { x: a[0] + side * fs * 0.6, y: (a[1] + b[1]) / 2, class: 'dimt', dy: '.35em', style: `font-size:${fs}px;text-anchor:${side > 0 ? 'start' : 'end'}` }, g).textContent = label;
}

/* 示例学校平面图（单位：米，y 向下） */
const AREAS = [
  { id: 1, kind: '草坪', poly: [[5, 5], [35, 5], [35, 15], [45, 15], [45, 30], [5, 30]], at: [20, 20], data: '下边 40、左边 25、上边 30、右边 15',
    dims: [[[5, 30], [45, 30], '40 米', 2.5], [[5, 5], [5, 30], '25 米', 2.5], [[5, 5], [35, 5], '30 米', -2.5], [[45, 15], [45, 30], '15 米', -2.5]] },
  { id: 2, kind: '草坪', poly: [[55, 40], [85, 40], [65, 22]], at: [70, 34], data: '底 30，高 18',
    dims: [[[55, 40], [85, 40], '30 米', 2.5]], h: [[65, 22], [65, 40], '18 米'] },
  { id: 3, kind: '花圃', poly: [[10, 58], [30, 58], [26, 50], [14, 50]], at: [20, 54.5], data: '上底 12，下底 20，高 8',
    dims: [[[14, 50], [26, 50], '12 米', -2.5], [[10, 58], [30, 58], '20 米', 2.5]], h: [[14, 50], [14, 58], '8 米', -1] },
  { id: 4, kind: '花圃', poly: [[40, 58], [56, 58], [60, 52], [44, 52]], at: [50, 55.3], data: '底 16，高 6',
    dims: [[[40, 58], [56, 58], '16 米', 2.5]], h: [[44, 52], [44, 58], '6 米', -1] },
  { id: 5, kind: '树木', poly: [[55, 4], [105, 4], [105, 8], [55, 8]], at: [80, 6], data: '长 50，宽 4',
    dims: [[[55, 4], [105, 4], '50 米', -2.5], [[105, 4], [105, 8], '4 米', -2.5]] },
  { id: 6, kind: '其他', poly: [[90, 48], [98, 48], [98, 55], [90, 55]], at: [94, 51.5], data: '长 8，宽 7',
    dims: [[[90, 55], [98, 55], '8 米', 2.5], [[98, 48], [98, 55], '7 米', -2.5]] },
];
const CIRC = ['', '①', '②', '③', '④', '⑤', '⑥'];
const MAP = { w: 110, h: 65 };

function initMap() {
  const svg = svgEl('svg', { viewBox: `-3 -3 ${MAP.w + 6} ${MAP.h + 6}`, 'aria-label': '示例学校平面图' }, $('mapBox'));
  svgEl('rect', { x: 0, y: 0, width: MAP.w, height: MAP.h, class: 'ground' }, svg);
  for (let x = 0; x <= MAP.w; x += 5) svgEl('line', { x1: x, x2: x, y1: 0, y2: MAP.h, class: 'gl' }, svg);
  for (let y = 0; y <= MAP.h; y += 5) svgEl('line', { x1: 0, x2: MAP.w, y1: y, y2: y, class: 'gl' }, svg);
  const bld = (x, y, w, h, t) => {
    svgEl('rect', { x, y, width: w, height: h, class: 'bld' }, svg);
    svgEl('text', { x: x + w / 2, y: y + h / 2, class: 'bt', dy: '.35em' }, svg).textContent = t;
  };
  bld(60, 12, 40, 7, '教学楼');
  bld(35, 5, 10, 10, '旗台');
  bld(64, 46, 20, 14, '食堂');
  const shapes = AREAS.map((a) => {
    const g = svgEl('g', { class: `area k-${a.kind}`, 'data-id': a.id, tabindex: 0, role: 'button', 'aria-label': `${a.id} 号${a.kind}` }, svg);
    svgEl('polygon', { points: pts(a.poly), class: 'af' }, g);
    svgEl('text', { x: a.at[0], y: a.at[1], class: 'an', dy: '.35em' }, g).textContent = CIRC[a.id];
    return g;
  });
  const dimG = svgEl('g', {}, svg);
  const seen = new Set();
  const pick = (id) => {
    const a = AREAS.find((x) => x.id === id);
    shapes.forEach((g) => g.classList.toggle('on', +g.dataset.id === id));
    dimG.innerHTML = '';
    a.dims.forEach(([p, q, t, off]) => dimLine(dimG, p, q, t, off, 2.6));
    if (a.h) heightLine(dimG, a.h[0], a.h[1], a.h[2], 2.6, a.h[3] || 1);
    seen.add(id);
    const row = $('recTab').querySelector(`tr[data-id="${id}"]`);
    row.querySelector('.dt').textContent = a.data;
    $('recTab').querySelectorAll('tr').forEach((r) => r.classList.toggle('hl', r === row));
    $('mapMsg').innerHTML = `${CIRC[id]} 号是<b>${a.kind}</b>，量得：${a.data}（米）。算出面积，填在右表里。${seen.size < AREAS.length ? `还有 ${AREAS.length - seen.size} 块没量。` : '全部量完了！'}`;
  };
  svg.addEventListener('click', (e) => { const g = e.target.closest('.area'); if (g) pick(+g.dataset.id); });
  svg.addEventListener('keydown', (e) => { const g = e.target.closest('.area'); if (g && e.key === 'Enter') pick(+g.dataset.id); });
}

/* 第 2 页、第 4 页的小图 */
function initFigs() {
  const rc = $('rcShapes');
  svgEl('polygon', { points: pts([[8, 80], [78, 80], [98, 20], [28, 20]]), class: 'sfig' }, rc);
  svgEl('polygon', { points: pts([[110, 80], [190, 80], [135, 20]]), class: 'sfig' }, rc);
  svgEl('polygon', { points: pts([[205, 80], [295, 80], [270, 20], [225, 20]]), class: 'sfig' }, rc);
  [[[28, 20], [28, 80]], [[135, 20], [135, 80]], [[225, 20], [225, 80]]].forEach(([a, b]) => svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'hgt' }, rc));

  const q = (id, poly, h, labels) => {
    const s = $(id);
    svgEl('polygon', { points: pts(poly), class: 'sfig g' }, s);
    heightLine(s, h[0], h[1], '高', 15, h[2] || 1);
    labels.forEach(([x, y, t]) => { svgEl('text', { x, y, class: 'ql' }, s).textContent = t; });
  };
  q('qTri', [[30, 115], [230, 115], [95, 15]], [[95, 15], [95, 115]], [[120, 128, '底'], [40, 60, '斜边'], [170, 60, '斜边']]);
  q('qPar', [[20, 110], [170, 110], [240, 20], [90, 20]], [[90, 20], [90, 110], -1], [[85, 126, '底'], [210, 72, '斜边']]);
  q('qTra', [[20, 110], [240, 110], [185, 20], [70, 20]], [[70, 20], [70, 110], -1], [[120, 14, '上底'], [120, 127, '下底'], [212, 70, '腰'], [28, 70, '腰']]);
}

/* 第 6 页：组合草坪的分割与添补（每米 10 像素） */
function initL() {
  const s = $('lFig');
  const K = 10;
  const T = (P) => P.map(([x, y]) => [(x - 5) * K + 50, (y - 5) * K + 55]);
  const L = AREAS[0].poly;
  const extra = svgEl('g', {}, s);
  svgEl('polygon', { points: pts(T(L)), class: 'lf' }, s);
  const over = svgEl('g', {}, s);
  const dims = svgEl('g', {}, s);
  [[[5, 30], [45, 30], '40 米', 25], [[5, 5], [5, 30], '25 米', 25], [[5, 5], [35, 5], '30 米', -25], [[45, 15], [45, 30], '15 米', -25]]
    .forEach(([p, q, t, off]) => dimLine(dims, T([p])[0], T([q])[0], t, off, 17));
  const show = (k) => {
    extra.innerHTML = '';
    over.innerHTML = '';
    $('lCut').classList.toggle('dimmed', k !== 'cut');
    $('lAdd').classList.toggle('dimmed', k !== 'add');
    if (k === 'cut') {
      const [a, b] = T([[35, 15], [35, 30]]);
      svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'cut' }, over);
      const lab = (x, y, t) => { const [X, Y] = T([[x, y]])[0]; svgEl('text', { x: X, y: Y, class: 'lt', dy: '.35em' }, over).textContent = t; };
      lab(20, 17.5, '30 × 25');
      lab(40, 22.5, '10 × 15');
    } else {
      svgEl('polygon', { points: pts(T([[35, 5], [45, 5], [45, 15], [35, 15]])), class: 'lplus' }, extra);
      const [X, Y] = T([[40, 10]])[0];
      svgEl('text', { x: X, y: Y, class: 'lt', dy: '.35em' }, over).textContent = '补 10×10';
      const [A, B] = T([[5, 5], [45, 30]]);
      svgEl('rect', { x: A[0], y: A[1], width: B[0] - A[0], height: B[1] - A[1], class: 'lbig' }, over);
    }
  };
  btnGroup($('lBtns'), show);
  show('cut');
}

/* 第 7 页：各类绿地面积条形图（按数值精确画） */
function initBars() {
  const s = $('bars');
  const data = [['草坪', 1170], ['花圃', 224], ['树木', 200], ['其他', 56]];
  const max = 1200;
  const [x0, w] = [70, 400];
  for (let v = 0; v <= max; v += 200) {
    const x = x0 + (w * v) / max;
    svgEl('line', { x1: x, x2: x, y1: 8, y2: 148, class: 'bgl' }, s);
    svgEl('text', { x, y: 165, class: 'btk' }, s).textContent = v;
  }
  data.forEach(([n, v], i) => {
    const y = 14 + i * 33;
    svgEl('text', { x: x0 - 10, y: y + 13, class: 'bn' }, s).textContent = n;
    svgEl('rect', { x: x0, y, width: (w * v) / max, height: 24, class: `bar b${i}` }, s);
    svgEl('text', { x: x0 + (w * v) / max + 6, y: y + 17, class: 'bv' }, s).textContent = v;
  });
}

/* 第 8 页：2 平方米有多大（每格 1 米） */
function initTwoM() {
  const s = $('twoM');
  const c = 34;
  const [ox, oy] = [20, 12];
  for (let i = 0; i <= 6; i += 1) svgEl('line', { x1: ox + i * c, x2: ox + i * c, y1: oy, y2: oy + 3 * c, class: 'gl2' }, s);
  for (let j = 0; j <= 3; j += 1) svgEl('line', { x1: ox, x2: ox + 6 * c, y1: oy + j * c, y2: oy + j * c, class: 'gl2' }, s);
  svgEl('rect', { x: ox + 2 * c, y: oy + c, width: 2 * c, height: c, class: 'two' }, s);
  svgEl('text', { x: ox + 3 * c, y: oy + c - 6, class: 'ql' }, s).textContent = '2 米';
  svgEl('text', { x: ox + 4 * c + 6, y: oy + 1.6 * c, class: 'ql', style: 'text-anchor:start' }, s).textContent = '1 米';
  svgEl('text', { x: ox + 3 * c, y: oy + 3 * c + 15, class: 'qs' }, s).textContent = '每小格是 1 平方米';
}

window.LESSON = {
  init() {
    initFigs();
    initMap();
    initL();
    initBars();
    initTwoM();
  },
};
