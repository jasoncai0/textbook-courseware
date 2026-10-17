'use strict';
/* 五下 列方程解决稍复杂的实际问题 · 本课互动：例 9 逐步画的份数线段图、例 10 相遇动画（核心，按真实速度比例）、
 * 相遇和相背的线段图。所有长度都按题目数据同一比例计算 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const tex = (el) => MathKit.tex(el);
const txt = (svg, x, y, s, cls = 'lt') => { const t = svgEl('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
// 横向花括号：x1→x2，开口朝 dir（-1 朝上，1 朝下），高 10
function hBrace(g, x1, x2, y, dir) {
  const m = (x1 + x2) / 2;
  const d = 10 * dir;
  svgEl('path', { d: `M${x1} ${y}q0 ${d} 8 ${d}H${m - 6}l6 ${d}l6 ${-d}H${x2 - 8}q8 0 8 ${-d}`, class: 'br' }, g);
}

/* 第 3 页：例 9 份数线段图（陆地 72.5、水面 217.5，1 公顷 = 2.9 单位） */
function initPark() {
  const svg = $('park');
  const k = 2.9;
  const x0 = 150;
  const u = 72.5 * k;
  const g1 = svgEl('g', { 'data-step': 1 }, svg);
  txt(g1, x0 - 14, 66, '陆地面积', 'lt end');
  svgEl('rect', { x: x0, y: 52, width: u, height: 16, class: 'seg-l' }, g1);
  hBrace(g1, x0, x0 + u, 48, -1);
  txt(g1, x0 + u / 2, 24, 'x 公顷', 'lt mid it');
  const g2 = svgEl('g', { 'data-step': 2 }, svg);
  txt(g2, x0 - 14, 156, '水面面积', 'lt end');
  for (let i = 0; i < 3; i += 1) svgEl('rect', { x: x0 + i * u, y: 142, width: u, height: 16, class: 'seg-w' }, g2);
  hBrace(g2, x0, x0 + 3 * u, 138, -1);
  txt(g2, x0 + 1.5 * u, 114, '3x 公顷', 'lt mid it');
  const g3 = svgEl('g', { 'data-step': 3 }, svg);
  const bx = x0 + 3 * u + 18;
  svgEl('path', { d: `M${bx} 52q10 0 10 10V95l8 8l-8 8V148q0 10 -10 10`, class: 'br' }, g3);
  txt(g3, bx + 26, 110, '290 公顷', 'lt');
}

/* 第 6 页：例 10 线段图（540 千米，相遇点在客车 285 千米处） */
const ROAD = { x0: 70, x1: 930, km: 540 };
const X = (km) => ROAD.x0 + ((ROAD.x1 - ROAD.x0) * km) / ROAD.km;
function initMeetSeg() {
  const svg = $('meetSeg');
  svgEl('line', { x1: X(0), x2: X(540), y1: 70, y2: 70, class: 'road' }, svg);
  [0, 540].forEach((v) => svgEl('line', { x1: X(v), x2: X(v), y1: 62, y2: 78, class: 'road' }, svg));
  svgEl('path', { d: `M${X(0)} 40H${X(110)}`, class: 'arw', 'marker-end': 'url(#ah)' }, svg);
  svgEl('path', { d: `M${X(540)} 40H${X(430)}`, class: 'arw', 'marker-end': 'url(#ah)' }, svg);
  const defs = svgEl('defs', {}, svg);
  const mk = svgEl('marker', { id: 'ah', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' }, defs);
  svgEl('path', { d: 'M0 0L10 5L0 10Z', fill: '#e0336f' }, mk);
  txt(svg, X(55), 30, '95 千米/时', 'lt mid');
  txt(svg, X(485), 30, 'x 千米/时', 'lt mid it');
  svgEl('path', { d: `M${X(285)} 66l-9 -16h18z`, fill: '#e0336f' }, svg);
  txt(svg, X(285), 40, '3 小时相遇', 'lt mid');
  hBrace(svg, X(0), X(540), 84, 1);
  txt(svg, X(270), 122, '540 千米', 'lt mid');
  txt(svg, X(0), 122, '客车', 'lt');
  txt(svg, X(540), 122, '货车', 'lt end');
}

/* 第 7 页：相遇动画。1 小时 = 1.5 秒 */
const BUS_V = 95;
const T = 3;
const SEC_PER_H = 1.5;
function initMeet() {
  const svg = $('meet');
  const st = { v: 70, raf: 0 };
  for (let km = 0; km <= 540; km += 60) {
    svgEl('line', { x1: X(km), x2: X(km), y1: 98, y2: 112, class: 'tick' }, svg);
    txt(svg, X(km), 136, String(km), 'tk');
  }
  svgEl('line', { x1: X(0), x2: X(540), y1: 105, y2: 105, class: 'road' }, svg);
  txt(svg, X(0), 170, '客车出发地', 'lt sm');
  txt(svg, X(540), 170, '货车出发地', 'lt sm end');
  const trail = svgEl('g', {}, svg);
  const busBar = svgEl('line', { y1: 105, y2: 105, class: 'run bus' }, svg);
  const truckBar = svgEl('line', { y1: 105, y2: 105, class: 'run truck' }, svg);
  const car = (cls, label) => {
    const g = svgEl('g', { class: cls }, svg);
    svgEl('rect', { x: -26, y: 56, width: 52, height: 28, rx: 6 }, g);
    svgEl('circle', { cx: -14, cy: 88, r: 6, class: 'wh' }, g);
    svgEl('circle', { cx: 14, cy: 88, r: 6, class: 'wh' }, g);
    txt(g, 0, 76, label, 'clb');
    return g;
  };
  const bus = car('car bus', '客车');
  const truck = car('car truck', '货车');
  const readout = txt(svg, 500, 205, '', 'lt mid ro');
  const show = (t) => {
    const a = BUS_V * t;
    const b = st.v * t;
    busBar.setAttribute('x1', X(0)); busBar.setAttribute('x2', X(a));
    truckBar.setAttribute('x1', X(540)); truckBar.setAttribute('x2', X(540 - b));
    bus.setAttribute("transform", `translate(${X(a)} -36)`);
    truck.setAttribute('transform', `translate(${X(540 - b)} 0)`);
    readout.textContent = `客车行了 ${+(a).toFixed(1)} 千米　货车行了 ${+(b).toFixed(1)} 千米`;
    $('tVal').textContent = +t.toFixed(1);
  };
  const reset = () => {
    cancelAnimationFrame(st.raf);
    trail.innerHTML = '';
    $('vVal').textContent = st.v;
    const m = $('meetMsg');
    m.className = 'tip feedback center';
    m.textContent = '先猜一猜，再点“出发”。';
    show(0);
  };
  const finish = () => {
    const sum = BUS_V * T + st.v * T;
    const m = $('meetMsg');
    const ok = sum === 540;
    m.className = `tip feedback center ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `3 小时：$95\\times3+${st.v}\\times3=${sum}$（千米）　${ok ? '<b>正好相遇！</b>' : sum < 540 ? `还差 ${540 - sum} 千米，货车要<b>快一些</b>。` : `已经错过 ${sum - 540} 千米，货车要<b>慢一些</b>。`}`;
    tex(m);
  };
  $('meetGo').addEventListener('click', () => {
    reset();
    const t0 = performance.now();
    let hour = 0;
    const tick = (now) => {
      const t = Math.min(T, (now - t0) / 1000 / SEC_PER_H);
      while (hour < Math.floor(t + 1e-9) && hour < T) {
        hour += 1;
        svgEl('circle', { cx: X(BUS_V * hour), cy: 105, r: 5, class: 'dot bus' }, trail);
        svgEl('circle', { cx: X(540 - st.v * hour), cy: 105, r: 5, class: 'dot truck' }, trail);
      }
      show(t);
      if (t < T) st.raf = requestAnimationFrame(tick);
      else finish();
    };
    st.raf = requestAnimationFrame(tick);
  });
  $('vDown').addEventListener('click', () => { st.v = Math.max(60, st.v - 5); reset(); });
  $('vUp').addEventListener('click', () => { st.v = Math.min(110, st.v + 5); reset(); });
  reset();
}

/* 第 9 页：相背而行（甲 26×8 = 208，乙 24×8 = 192，1 千米 = 1.3 单位） */
function initShips() {
  const svg = $('ships');
  const k = 1.3;
  const dock = 40 + 208 * k;
  svgEl('line', { x1: 40, x2: 40 + 400 * k, y1: 40, y2: 40, class: 'road' }, svg);
  svgEl('path', { d: `M${dock} 36l-7 -14h14z`, fill: '#2a8ac0' }, svg);
  txt(svg, dock, 16, '码头', 'lt mid sm');
  txt(svg, 40 + 104 * k, 32, '甲 26 千米/时', 'lt mid sm');
  txt(svg, dock + 96 * k, 32, '乙 x 千米/时', 'lt mid sm');
  hBrace(svg, 40, 40 + 400 * k, 46, 1);
  txt(svg, 40 + 200 * k, 84, '8 小时后相距 400 千米', 'lt mid sm');
}

window.LESSON = {
  init() {
    initPark();
    initMeetSeg();
    initMeet();
    initShips();
  },
};
