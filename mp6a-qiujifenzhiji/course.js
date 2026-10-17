'use strict';
/* 六上 求一个数的几分之几是多少（例 3）· 本课互动：条形图（每格 5 朵）、可调整的线段图画板（多/少几分之几）、
 * 练一练分组图、单位“1”选词。线段长度、格数都按题目数量精确计算。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const txt = (parent, x, y, s, cls = 'lb') => { el('text', { x, y, class: cls }, parent).textContent = s; };

/* 第 3 页：条形图，每格 5 朵（课本：黄 10 格、红 11 格、绿 6 格） */
const BARS = [['黄花', 10, '#f2d21b'], ['红花', 11, '#e83e8c'], ['绿花', 6, '#2fa65a']];
function initChart() {
  const svg = $('chart');
  const [x0, cw, cols] = [90, 42, 12];
  const nums = el('g', { class: 'cnum' }, svg);
  for (let c = 0; c <= cols; c += 1) el('line', { x1: x0 + c * cw, x2: x0 + c * cw, y1: 10, y2: 200, stroke: '#7cc3e8', 'stroke-width': 1.2 }, svg);
  BARS.forEach(([name, n, color], i) => {
    const y = 25 + i * 60;
    el('rect', { x: x0, y, width: n * cw, height: 30, fill: color }, svg);
    txt(svg, 50, y + 22, name);
    for (let c = 0; c < n; c += 1) txt(nums, x0 + c * cw + cw / 2, y + 22, String(c + 1), 'lb s');
  });
  el('line', { x1: x0, x2: x0 + cols * cw, y1: 200, y2: 200, stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
  txt(svg, x0 + cols * cw - 30, 224, '数量/朵', 'lb s');
  $('cGrid').addEventListener('click', () => svg.classList.toggle('show-n'));
}

/* 线段图：base 是单位“1”的数量，平均分成 d 份；另一个量多（sign=1）或少（sign=-1）k 份 */
function drawSeg(svg, o) {
  svg.innerHTML = '';
  const x0 = 130;
  const maxParts = o.d + Math.max(0, o.sign * o.k);
  const pw = Math.min(70, 540 / maxParts); // 每份的像素长度：两条线段按同一比例画
  const [y1, y2] = [80, 150];
  const L = o.d * pw;
  txt(svg, 60, y1 + 7, o.baseName);
  txt(svg, 60, y2 + 7, o.otherName);
  el('line', { x1: x0, x2: x0 + L, y1, y2: y1, stroke: '#1d6fa5', 'stroke-width': 6 }, svg);
  for (let i = 0; i <= o.d; i += 1) el('line', { x1: x0 + i * pw, x2: x0 + i * pw, y1: y1 - 10, y2: y1 + 10, stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
  el('path', { d: `M${x0} ${y1 - 18}v-8H${x0 + L}v8`, fill: 'none', stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
  txt(svg, x0 + L / 2, y1 - 34, `${o.base} ${o.unit}（单位“1”）`, 'lb s');
  const otherParts = o.d + o.sign * o.k;
  const Lo = otherParts * pw;
  const keep = Math.min(L, Lo);
  el('line', { x1: x0, x2: x0 + keep, y1: y2, y2, stroke: o.color, 'stroke-width': 6 }, svg);
  const xa = x0 + keep;
  const xb = x0 + Math.max(L, Lo);
  if (o.sign > 0) el('line', { x1: xa, x2: xb, y1: y2, y2, stroke: '#d9711c', 'stroke-width': 8 }, svg);
  else el('line', { x1: xa, x2: xb, y1: y2, y2, stroke: '#9aa7b3', 'stroke-width': 3, 'stroke-dasharray': '7 6' }, svg);
  el('line', { x1: x0, x2: x0, y1: y2 - 10, y2: y2 + 10, stroke: o.color, 'stroke-width': 2 }, svg);
  el('line', { x1: xa, x2: xa, y1: y2 - 10, y2: y2 + 10, stroke: o.color, 'stroke-width': 2 }, svg);
  el('line', { x1: x0 + Lo, x2: x0 + Lo, y1: y2 - 10, y2: y2 + 10, stroke: o.color, 'stroke-width': 2 }, svg);
  if (o.k > 0) {
    el('path', { d: `M${xa} ${y2 + 18}v8H${xb}v-8`, fill: 'none', stroke: '#d9711c', 'stroke-width': 2 }, svg);
    txt(svg, (xa + xb) / 2, y2 + 46, o.diffLabel || `${o.sign > 0 ? '多' : '少'} ? ${o.unit}`, 'lb s o');
  }
}

const QS = [
  { text: '红花比黄花多 $\\dfrac{1}{10}$，黄花有 50 朵。', base: 50, baseName: '黄花', otherName: '红花', unit: '朵', d: 10, k: 1, sign: 1, color: '#e83e8c' },
  { text: '绿花比黄花少 $\\dfrac25$，黄花有 50 朵。', base: 50, baseName: '黄花', otherName: '绿花', unit: '朵', d: 5, k: 2, sign: -1, color: '#2fa65a' },
  { text: '小军有 28 颗玻璃球，小力的玻璃球比小军多 $\\dfrac27$。', base: 28, baseName: '小军', otherName: '小力', unit: '颗', d: 7, k: 2, sign: 1, color: '#7a5cc7' },
  { text: '毛衣原价 56 元，现在的售价比原来降低 $\\dfrac27$。', base: 56, baseName: '原价', otherName: '现价', unit: '元', d: 7, k: 2, sign: -1, color: '#2a9fd6' },
];
const MAX_D = 12;
function initBoard() {
  const st = { q: 0, d: 2, k: 1, sign: 1 };
  const render = () => {
    const Q = QS[st.q];
    $('qText').innerHTML = `<b>这句话：</b>${Q.text}`;
    $('baseName').textContent = Q.baseName;
    $('vD').textContent = st.d; $('vK').textContent = st.k;
    $('vSign').textContent = st.sign > 0 ? '多' : '少';
    drawSeg($('seg'), { ...Q, d: st.d, k: st.k, sign: st.sign });
    const ok = st.d === Q.d && st.k === Q.k && st.sign === Q.sign;
    const word = st.sign > 0 ? '多' : '少';
    const msg = $('segMsg');
    msg.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    msg.innerHTML = ok
      ? `<b>✓ 画对了！</b>把${Q.baseName}平均分成 ${Q.d} 份，${Q.otherName}${word} ${Q.k} 份。${word}的部分是 ${Q.base} ${Q.unit}的 $\\frac{${Q.k}}{${Q.d}}$：$${Q.base}\\times\\frac{${Q.k}}{${Q.d}}=${(Q.base * Q.k) / Q.d}$（${Q.unit}）`
      : `现在的图表示：${Q.otherName}比${Q.baseName}${word} $\\frac{${st.k}}{${st.d}}$。和这句话一样吗？`;
    [$('qText'), msg].forEach(tex);
  };
  $('qPick').addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    Object.assign(st, { q: +b.dataset.q, d: 2, k: 1, sign: 1 });
    $('qPick').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
    render();
  });
  document.querySelector('.seg-ctl').addEventListener('click', (e) => {
    if (e.target.id === 'vSign') { st.sign = -st.sign; }
    const d = e.target.closest('[data-d]')?.dataset.d;
    if (d === 'd+') st.d = Math.min(MAX_D, st.d + 1);
    if (d === 'd-') st.d = Math.max(2, st.d - 1);
    if (d === 'k+') st.k += 1;
    if (d === 'k-') st.k = Math.max(1, st.k - 1);
    st.k = Math.min(st.k, st.d - 1);
    render();
  });
  render();
}

function initFixedSegs() {
  drawSeg($('seg1'), { ...QS[0], diffLabel: '多 ? 朵' });
  drawSeg($('seg2'), { ...QS[1], diffLabel: '少 ? 朵' });
  drawSeg($('seg14'), { base: 24, baseName: '排球', otherName: '足球', unit: '个', d: 4, k: 1, sign: 1, color: '#2fa65a', diffLabel: '多 1 份' });
  const s = $('seg14');
  txt(s, 130 + 2.5 * 70, 196, '足球一共 5 份', 'lb s');
}

/* 单位“1”选词：点一下换一个选项 */
function initPk() {
  document.querySelectorAll('.pk').forEach((p) => {
    const opts = p.dataset.opts.split('|');
    let i = -1;
    p.setAttribute('data-noswipe', '');
    p.textContent = '点我选';
    p.addEventListener('click', () => {
      i = (i + 1) % opts.length;
      p.textContent = opts[i];
      p.classList.toggle('ok', opts[i] === p.dataset.ans);
    });
  });
}

/* 练一练：△ 6 个，○ 比 △ 多 1/3；○ 8 个，□ 比 ○ 少 3/4 */
function tri(svg, x, y, fill) { el('path', { d: `M${x} ${y - 14}L${x + 14} ${y + 12}L${x - 14} ${y + 12}Z`, fill, stroke: '#2f9a55', 'stroke-width': 2 }, svg); }
function ring(svg, x, y, fill, dash) { el('circle', { cx: x, cy: y, r: 13, fill, stroke: '#d6448f', 'stroke-width': 2, ...(dash ? { 'stroke-dasharray': '4 3' } : {}) }, svg); }
function sq(svg, x, y, fill, dash) { el('rect', { x: x - 13, y: y - 13, width: 26, height: 26, fill, stroke: '#2a9fd6', 'stroke-width': 2, ...(dash ? { 'stroke-dasharray': '4 3', fill: 'none' } : {}) }, svg); }
const GX = (i) => 40 + i * 34 + Math.floor(i / 2) * 22; // 每 2 个一组，组间留空
function initShapes() {
  const a = $('shp1');
  for (let i = 0; i < 6; i += 1) tri(a, GX(i), 30, '#d6f0dc');
  $('shp1Go').addEventListener('click', () => {
    if (a.dataset.done) return;
    a.dataset.done = '1';
    for (let i = 0; i < 8; i += 1) ring(a, GX(i), 85, i >= 6 ? '#ffd08a' : '#fbd3e6');
    txt(a, GX(6) + 17, 116, '多 1 份', 'lb s o');
  });
  const b = $('shp2');
  for (let i = 0; i < 8; i += 1) ring(b, GX(i), 30, '#fbd3e6');
  $('shp2Go').addEventListener('click', () => {
    if (b.dataset.done) return;
    b.dataset.done = '1';
    for (let i = 0; i < 8; i += 1) sq(b, GX(i), 85, '#d7eefb', i >= 2);
    txt(b, (GX(2) + GX(7)) / 2, 116, '少 3 份', 'lb s o');
  });
}

window.LESSON = {
  init() {
    initChart();
    initBoard();
    initFixedSegs();
    initPk();
    initShapes();
  },
};
