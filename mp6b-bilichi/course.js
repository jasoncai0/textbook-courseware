'use strict';
/* 六下 比例尺 · 本课互动：比例尺换算器（数值比例尺 ⇄ 线段比例尺，图上距离按 1 cm = 48 单位画）、
 * 平面图上点地点用尺子量图上距离（1 cm = 40 单位，按课本图中的距离绘制）。 */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const label = (svg, x, y, s, cls = 'fl m') => { const t = svgEl('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
const num = (v) => `${+v.toFixed(4)}`;
const realText = (cm) => (cm >= 100000 ? `${num(cm / 100000)} 千米` : `${num(cm / 100)} 米`);

/* 第 3 页：草坪平面图 5×3 cm（1 cm = 60 单位） */
function initLawn() {
  const svg = $('lawn');
  const K = 60;
  svgEl('rect', { x: 60, y: 30, width: 5 * K, height: 3 * K, fill: '#bfe3a8', stroke: '#3e7d2c', 'stroke-width': 3 }, svg);
  label(svg, 60 + 2.5 * K, 30 + 3 * K + 28, '图上 5 cm（实际 50 m）');
  label(svg, 60 + 5 * K + 12, 30 + 1.5 * K - 4, '图上 3 cm', 'fl');
  label(svg, 60 + 5 * K + 12, 30 + 1.5 * K + 20, '（实际 30 m）', 'fl');
}

/* 线段比例尺：每段 k 单位（= 1 cm），共 n 段，标签 labels */
function lineScale(svg, x, y, k, labels, unit) {
  svgEl('line', { x1: x, x2: x + k * (labels.length - 1), y1: y, y2: y, stroke: '#1d6fa5', 'stroke-width': 3 }, svg);
  labels.forEach((s, i) => {
    svgEl('line', { x1: x + i * k, x2: x + i * k, y1: y - 10, y2: y, stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
    label(svg, x + i * k, y - 16, s);
  });
  label(svg, x + k * (labels.length - 1) + 30, y - 16, unit, 'fl');
}
function initLineScale() {
  lineScale($('lineScale'), 30, 50, 100, ['0', '10', '20', '30'], '米');
}

/* 第 5 页：换算器 */
const SCALES = [
  { den: 1000, src: '例 6' }, { den: 8000, src: '例 7' }, { den: 20000, src: '练一练' },
  { den: 500000, src: '荷花村' }, { den: 2200000, src: '地图' }, { den: 15000000, src: '练习八' },
];
function initConverter() {
  const st = { k: 1 };
  const list = $('scList');
  SCALES.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn';
    b.dataset.k = i;
    b.innerHTML = `1∶${s.den}<small>${s.src}</small>`;
    list.appendChild(b);
  });
  const K = 48;
  const render = () => {
    const { den } = SCALES[st.k];
    const d = +$('cvD').value;
    list.querySelectorAll('button').forEach((b) => b.classList.toggle('solid', +b.dataset.k === st.k));
    $('cvDv').textContent = `${d} cm`;
    const svg = $('conv');
    svg.innerHTML = '';
    label(svg, 20, 30, '地图上：', 'fl');
    svgEl('line', { x1: 30, x2: 30 + d * K, y1: 70, y2: 70, stroke: '#d6247a', 'stroke-width': 5 }, svg);
    [30, 30 + d * K].forEach((x) => svgEl('circle', { cx: x, cy: 70, r: 7, fill: '#d6247a' }, svg));
    label(svg, 30 + (d * K) / 2, 100, `图上 ${d} cm`, 'fl m b');
    const seg = den;
    const big = seg >= 100000;
    const v = big ? seg / 100000 : seg / 100;
    lineScale(svg, 30, 180, K, [0, 1, 2, 3].map((i) => num(i * v)), big ? '千米' : '米');
    label(svg, 20, 140, '线段比例尺（每段 1 cm）：', 'fl');
    const cm = d * den;
    const calc = $('cvCalc');
    calc.innerHTML = [
      `<div class="dl"><span>比例尺</span><span>$1:${den}$</span><i class="why">图上 1 cm 表示实际 ${realText(den)}</i></div>`,
      `<div class="dl"><span>实际距离</span><span>$${d}\\times${den}=${num(cm)}$（厘米）</span><i class="why">实际距离是图上距离的 ${den} 倍</i></div>`,
      `<div class="dl key"><span></span><span>$=$ ${realText(cm)}</span><i class="why">${big || cm >= 100000 ? '1 千米 = 100000 厘米' : '1 米 = 100 厘米'}</i></div>`,
    ].join('');
    tex(calc);
  };
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    st.k = +b.dataset.k;
    render();
  });
  $('cvD').addEventListener('input', render);
  render();
}

/* 平面图：点地点画尺子量距离 */
const MK = 40; // 1 cm = 40 单位
function rulerTo(layer, o, p) {
  const [dx, dy] = [p[0] - o[0], p[1] - o[1]];
  const L = Math.hypot(dx, dy);
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const g = svgEl('g', { transform: `translate(${o[0]} ${o[1]}) rotate(${deg})` }, layer);
  const cm = L / MK;
  svgEl('rect', { x: -6, y: 4, width: L + 12, height: 22, fill: 'rgba(255,236,170,.92)', stroke: '#b08a1a', 'stroke-width': 1.2 }, g);
  for (let i = 0; i <= Math.round(cm * 2); i += 1) {
    svgEl('line', { x1: (i * MK) / 2, x2: (i * MK) / 2, y1: 4, y2: i % 2 ? 11 : 16, stroke: '#6b5310', 'stroke-width': 1.2 }, g);
  }
  svgEl('line', { x1: 0, x2: L, y1: 0, y2: 0, stroke: '#d6247a', 'stroke-width': 3 }, g);
  return Math.round(cm * 100) / 100;
}
function mapView(svgId, o) {
  const svg = $(svgId);
  svgEl('rect', { x: 0, y: 0, width: 520, height: 300, fill: o.bg || '#fdf3ea', rx: 10 }, svg);
  if (o.deco) o.deco(svg);
  svgEl('path', { d: 'M480 70V30m-7 12l7-12 7 12', fill: 'none', stroke: '#1d6fa5', 'stroke-width': 2 }, svg);
  label(svg, 480, 22, '北', 'fl m b').setAttribute('fill', '#1d6fa5');
  label(svg, 500, 288, `比例尺 1∶${o.den}`, 'fl').setAttribute('text-anchor', 'end');
  const layer = svgEl('g', {}, svg);
  const readout = label(svg, 16, 28, '点一个地点量一量', 'fl b');
  const pts = svgEl('g', {}, svg);
  const draw = (sel) => {
    layer.innerHTML = '';
    pts.innerHTML = '';
    [o.origin, ...o.places].forEach((pl, i) => {
      const hidden = pl.hidden && sel !== pl;
      const g = svgEl('g', { class: i ? 'place' : '' }, pts);
      svgEl('circle', { cx: pl.p[0], cy: pl.p[1], r: 9, fill: '#fff', stroke: '#d6247a', 'stroke-width': hidden ? 0 : 2.5 }, g);
      if (!hidden) svgEl('circle', { cx: pl.p[0], cy: pl.p[1], r: 3, fill: '#d6247a' }, g);
      const t = label(g, pl.p[0] + (pl.dx ?? 14), pl.p[1] + (pl.dy ?? 6), hidden ? `${pl.name}？` : pl.name, 'fl b');
      if (pl.anchor) t.setAttribute('text-anchor', pl.anchor);
      if (i) {
        svgEl('circle', { cx: pl.p[0], cy: pl.p[1], r: 22, fill: 'transparent' }, g);
        g.addEventListener('click', () => draw(pl));
      }
    });
    if (!sel) return;
    const cm = rulerTo(layer, o.origin.p, sel.p);
    readout.textContent = `${o.origin.name}→${sel.name}：图上 ${cm} cm，实际 ${realText(cm * o.den)}`;
  };
  draw(null);
}
function initMaps() {
  const r2 = Math.SQRT1_2;
  const MH = [400, 220];
  mapView('map7', {
    den: 8000,
    origin: { name: '明华小学', p: MH, dy: 30, dx: -10 },
    places: [
      { name: '少年宫', p: [MH[0] - 5 * MK, MH[1]], dx: -10, dy: -16, anchor: 'end' },
      { name: '体育馆', p: [MH[0] - 3 * MK * r2, MH[1] - 3 * MK * r2], dx: -14, anchor: 'end' },
      { name: '医院', p: [MH[0], MH[1] - 3 * MK], hidden: true },
    ],
  });
  const ZC = [300, 240];
  mapView('map9', {
    den: 20000,
    bg: '#fbe1ef',
    origin: { name: '汽车站', p: ZC, dy: 6 },
    places: [
      { name: '镇政府', p: [ZC[0], ZC[1] - 3 * MK], dx: -14, anchor: 'end' },
      { name: '敬老院', p: [ZC[0] + 3.5 * MK * r2, ZC[1] - 3.5 * MK * r2] },
      { name: '幼儿园', p: [ZC[0] - 2 * MK, ZC[1]], hidden: true, dx: -14, anchor: 'end' },
    ],
  });
}
function initVillage() {
  const svg = $('village');
  svg.setAttribute('viewBox', '0 0 520 300');
  const a = (36 * Math.PI) / 180;
  const H = [150, 210];
  mapView('village', {
    den: 500000,
    bg: '#eef7e6',
    deco: (s) => svgEl('path', { d: 'M0 60C120 80 160 150 260 170S420 230 520 280', fill: 'none', stroke: '#8cc7e0', 'stroke-width': 26 }, s),
    origin: { name: '荷花村', p: H, dy: 30, dx: -20 },
    places: [{ name: '杏树村', p: [H[0] + 3 * MK * Math.cos(a), H[1] - 3 * MK * Math.sin(a)], dy: -14 }],
  });
}

window.LESSON = {
  init() {
    initLawn();
    initLineScale();
    initConverter();
    initMaps();
    initVillage();
    FracFig.exact();
  },
};
