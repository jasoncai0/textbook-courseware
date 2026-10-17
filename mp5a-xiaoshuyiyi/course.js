'use strict';
/* 五上 小数的意义 · 本课互动：分米米尺（点格涂色）、米尺放大镜（厘米 / 毫米）、涂色板（10 / 100 / 1000 份）、练一练三幅图。
 * 刻度、格数、分数和小数都由代码按格数计算，保证准确。通用部分见 ../shared/math.js、mcheck.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const svgPoint = (svg, e) => {
  const p = svg.createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
};
const FILL = '#9fd3f2';
const EDGE = '#1d6fa5';

/* 第 3 页：1 米平均分成 10 分米，点哪一格涂到哪一格 */
function initDm() {
  const svg = $('dmFig');
  const [x0, x1, y0, h] = [40, 960, 30, 60];
  const w = (x1 - x0) / 10;
  const bar = svgEl('rect', { x: x0, y: y0, width: 0, height: h, fill: FILL }, svg);
  svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: h, fill: 'none', stroke: EDGE, 'stroke-width': 3 }, svg);
  for (let i = 0; i <= 10; i += 1) {
    if (i > 0 && i < 10) svgEl('line', { x1: x0 + i * w, x2: x0 + i * w, y1: y0, y2: y0 + h, stroke: EDGE, 'stroke-width': 1.5 }, svg);
    svgEl('text', { x: x0 + i * w, y: y0 + h + 28, class: 'r-num' }, svg).textContent = i === 10 ? '1 米' : i;
  }
  svgEl('text', { x: x0 + w / 2, y: y0 - 8, class: 'r-cap' }, svg).textContent = '1 分米';
  let n = 0;
  const show = () => {
    bar.setAttribute('width', n * w);
    $('dmRead').innerHTML = n
      ? `涂了 <b>${n}</b> 分米：$${n}$ 分米 $=${n === 10 ? '\\dfrac{10}{10}' : `\\dfrac{${n}}{10}`}$ 米 $=${n === 10 ? '1' : `0.${n}`}$ 米`
      : '点米尺上的格子试一试。';
    tex($('dmRead'));
  };
  svg.addEventListener('click', (e) => {
    const p = svgPoint(svg, e);
    if (p.x < x0 || p.x > x1) return;
    const k = Math.min(10, Math.floor((p.x - x0) / w) + 1);
    n = k === n ? k - 1 : k;
    show();
  });
  show();
}

/* 第 4 页：米尺放大镜。上面是 1 米长的米尺（100 厘米），下面把红色三角所在的那 1 分米放大 10 倍 */
const ZM = { x0: 40, x1: 960, rulerY: 28, rulerH: 52, lensY: 190, lensH: 92 };
function initZoom() {
  const svg = $('zmFig');
  const st = { unit: 'cm', mm: 10 }; // 内部一律用毫米计
  const pxPerMm = (ZM.x1 - ZM.x0) / 1000;
  const X = (mm) => ZM.x0 + mm * pxPerMm;
  // 上：整根米尺
  svgEl('rect', { x: ZM.x0, y: ZM.rulerY, width: ZM.x1 - ZM.x0, height: ZM.rulerH, class: 'rl-body' }, svg);
  const topFill = svgEl('rect', { x: ZM.x0, y: ZM.rulerY, width: 0, height: ZM.rulerH, class: 'rl-fill' }, svg);
  for (let cm = 0; cm <= 100; cm += 1) {
    const len = cm % 10 === 0 ? 26 : cm % 5 === 0 ? 17 : 10;
    svgEl('line', { x1: X(cm * 10), x2: X(cm * 10), y1: ZM.rulerY, y2: ZM.rulerY + len, class: 'rl-tick' }, svg);
    if (cm % 10 === 0) svgEl('text', { x: X(cm * 10), y: ZM.rulerY + ZM.rulerH - 6, class: 'rl-num' }, svg).textContent = cm;
  }
  svgEl('text', { x: ZM.x0, y: ZM.rulerY - 10, class: 'rl-unit' }, svg).textContent = '1 米长的米尺（单位：厘米）';
  const win = svgEl('rect', { y: ZM.rulerY - 4, height: ZM.rulerH + 8, class: 'zm-win' }, svg);
  const tri = svgEl('path', { class: 'zm-tri' }, svg);
  // 下：放大镜
  const linkL = svgEl('line', { class: 'zm-link' }, svg);
  const linkR = svgEl('line', { class: 'zm-link' }, svg);
  svgEl('rect', { x: ZM.x0, y: ZM.lensY, width: ZM.x1 - ZM.x0, height: ZM.lensH, class: 'rl-body lens' }, svg);
  const lensFill = svgEl('rect', { x: ZM.x0, y: ZM.lensY, width: 0, height: ZM.lensH, class: 'rl-fill' }, svg);
  const lensTicks = svgEl('g', {}, svg);
  const lensTri = svgEl('path', { class: 'zm-tri' }, svg);
  svgEl('text', { x: ZM.x0, y: ZM.lensY + ZM.lensH + 52, class: 'zm-cap', 'text-anchor': 'start' }, svg).textContent = '放大镜：把框里的 1 分米放大 10 倍看（单位：厘米）';
  const lensPx = (ZM.x1 - ZM.x0) / 100; // 放大后每毫米的宽度

  const draw = () => {
    const { mm } = st;
    const dm0 = Math.min(90, Math.floor((mm - 1e-9) / 100) * 10) * 10; // 三角所在那 1 分米的起点（毫米）
    const start = Math.max(0, dm0);
    topFill.setAttribute('width', mm * pxPerMm);
    win.setAttribute('x', X(start)); win.setAttribute('width', 100 * pxPerMm);
    tri.setAttribute('d', `M${X(mm)} ${ZM.rulerY + ZM.rulerH + 2}l-11 20h22Z`);
    linkL.setAttribute('x1', X(start)); linkL.setAttribute('y1', ZM.rulerY + ZM.rulerH + 4); linkL.setAttribute('x2', ZM.x0); linkL.setAttribute('y2', ZM.lensY);
    linkR.setAttribute('x1', X(start + 100)); linkR.setAttribute('y1', ZM.rulerY + ZM.rulerH + 4); linkR.setAttribute('x2', ZM.x1); linkR.setAttribute('y2', ZM.lensY);
    lensTicks.innerHTML = '';
    for (let k = 0; k <= 100; k += 1) {
      const x = ZM.x0 + k * lensPx;
      const len = k % 10 === 0 ? 40 : k % 5 === 0 ? 26 : 15;
      svgEl('line', { x1: x, x2: x, y1: ZM.lensY, y2: ZM.lensY + len, class: k % 10 === 0 ? 'rl-tick' : 'rl-tick mm' }, lensTicks);
      if (k % 10 === 0) svgEl('text', { x, y: ZM.lensY + ZM.lensH - 8, class: 'rl-num big' }, lensTicks).textContent = (start + k) / 10;
    }
    const inLens = Math.min(100, Math.max(0, mm - start));
    lensFill.setAttribute('width', inLens * lensPx);
    lensTri.setAttribute('d', `M${ZM.x0 + inLens * lensPx} ${ZM.lensY + ZM.lensH + 2}l-12 22h24Z`);
    const r = $('zmRead');
    if (st.unit === 'cm') {
      const cm = mm / 10;
      r.innerHTML = `<b>${cm}</b> 厘米 $=\\dfrac{${cm}}{100}$ 米 $=$ <b class="dec">${(cm / 100).toFixed(2)}</b> 米`;
    } else {
      r.innerHTML = `<b>${mm}</b> 毫米 $=\\dfrac{${mm}}{1000}$ 米 $=$ <b class="dec">${(mm / 1000).toFixed(3)}</b> 米`;
    }
    tex(r);
  };
  const step = () => (st.unit === 'cm' ? 10 : 1);
  const setMm = (v) => { st.mm = Math.max(step(), Math.min(1000, Math.round(v / step()) * step())); draw(); };
  const QUICK = { cm: [1, 4, 12], mm: [1, 40, 105] };
  const renderQuick = () => {
    $('zmQuick').innerHTML = QUICK[st.unit].map((v) => `<button type="button" class="btn" data-v="${v}">${v} ${st.unit === 'cm' ? '厘米' : '毫米'}</button>`).join('');
  };
  $('zmQuick').addEventListener('click', (e) => {
    const v = e.target.closest('[data-v]')?.dataset.v;
    if (v) setMm(+v * step());
  });
  $('zmMode').addEventListener('click', (e) => {
    const u = e.target.closest('[data-u]')?.dataset.u;
    if (!u) return;
    st.unit = u;
    $('zmMode').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b.dataset.u === u));
    renderQuick();
    setMm(st.mm);
  });
  $('zmMinus').addEventListener('click', () => setMm(st.mm - step()));
  $('zmPlus').addEventListener('click', () => setMm(st.mm + step()));
  // 拖动：在整根米尺上按 1/1000 米换算；在放大镜里按放大后的刻度换算
  let drag = null;
  const pick = (e) => {
    const p = svgPoint(svg, e);
    if (drag === 'lens') {
      const start = Math.floor((st.mm - 1e-9) / 100) * 100;
      setMm(Math.max(0, start) + (p.x - ZM.x0) / lensPx);
    } else setMm((p.x - ZM.x0) / pxPerMm);
  };
  svg.addEventListener('pointerdown', (e) => {
    const p = svgPoint(svg, e);
    if (p.x < ZM.x0 - 10 || p.x > ZM.x1 + 10) return;
    drag = p.y > ZM.lensY - 10 ? 'lens' : 'top';
    svg.setPointerCapture(e.pointerId);
    pick(e);
  });
  svg.addEventListener('pointermove', (e) => { if (drag) pick(e); });
  svg.addEventListener('pointerup', () => { drag = null; });
  renderQuick();
  draw();
}

/* 第 7 页：涂色板。整数“1”是一个正方形：10 份 = 10 竖条；100 份 = 每条再分 10 格；1000 份 = 每格再分 10 细条。
 * 涂色顺序：先一整条，再一格一格，再一细条一细条，所以 0.1、0.01、0.001 的大小一眼看得出 */
const TU = { o: 10, s: 400 };
function initTu() {
  const svg = $('tuFig');
  const st = { u: 10, k: 0, task: null };
  const cw = TU.s / 10;
  const shade = svgEl('g', {}, svg);
  const lines = svgEl('g', {}, svg);
  svgEl('rect', { x: TU.o, y: TU.o, width: TU.s, height: TU.s, fill: 'none', stroke: EDGE, 'stroke-width': 3 }, svg);
  const drawLines = () => {
    lines.innerHTML = '';
    let d = '';
    for (let i = 1; i < 10; i += 1) d += `M${TU.o + i * cw} ${TU.o}V${TU.o + TU.s}`;
    let d2 = '';
    if (st.u >= 100) for (let i = 1; i < 10; i += 1) d2 += `M${TU.o} ${TU.o + i * cw}H${TU.o + TU.s}`;
    let d3 = '';
    if (st.u === 1000) for (let c = 0; c < 10; c += 1) for (let j = 1; j < 10; j += 1) d3 += `M${TU.o + c * cw + j * cw / 10} ${TU.o}V${TU.o + TU.s}`;
    if (d3) svgEl('path', { d: d3, stroke: '#9cc9ea', 'stroke-width': 0.8 }, lines);
    svgEl('path', { d, stroke: EDGE, 'stroke-width': 2 }, lines);
    if (d2) svgEl('path', { d: d2, stroke: EDGE, 'stroke-width': 1.5 }, lines);
  };
  const drawShade = () => {
    shade.innerHTML = '';
    const K = st.k * (1000 / st.u); // 换算成千分之几
    const cols = Math.floor(K / 100);
    const rows = Math.floor((K % 100) / 10);
    const sl = K % 10;
    const r = (x, y, w, h) => svgEl('rect', { x: TU.o + x, y: TU.o + y, width: w, height: h, fill: FILL }, shade);
    if (cols) r(0, 0, cols * cw, TU.s);
    if (rows) r(cols * cw, 0, cw, rows * cw);
    if (sl) r(cols * cw, rows * cw, (sl * cw) / 10, cw);
  };
  const dec = (k, u) => (k === u ? '1' : k === 0 ? '0' : (k / u).toFixed(String(u).length - 1));
  const unitWord = { 10: '0.1', 100: '0.01', 1000: '0.001' };
  const render = () => {
    drawShade();
    const { k, u } = st;
    $('tuRead').innerHTML = `涂了 <b>${k}</b> 份：$\\dfrac{${k}}{${u}}=$ <b class="dec">${dec(k, u)}</b><br><span class="sm">也就是 ${k} 个 ${unitWord[u]}</span>`;
    tex($('tuRead'));
    const msg = $('tuMsg');
    if (st.task) {
      const ok = st.task.u === u && st.task.t === k;
      msg.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
      msg.innerHTML = ok ? `<b>✓ 对了！</b>${dec(k, u)} 就是 ${k} 个 ${unitWord[u]}。` : `目标：涂出 <b>${dec(st.task.t, st.task.u)}</b>。想一想要涂几份？`;
    }
  };
  const setMode = (u) => {
    st.u = u; st.k = 0;
    $('tuMode').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', +b.dataset.u === u));
    drawLines(); render();
  };
  $('tuMode').addEventListener('click', (e) => {
    const u = e.target.closest('[data-u]')?.dataset.u;
    if (u) { st.task = null; $('tuMsg').className = 'tip feedback'; $('tuMsg').textContent = '点格子涂色：点到哪一格，就涂到哪一格。'; setMode(+u); }
  });
  $('tuTasks').addEventListener('click', (e) => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    st.task = { t: +b.dataset.t, u: +b.dataset.u };
    setMode(st.task.u);
  });
  $('tuPlus').addEventListener('click', () => { st.k = Math.min(st.u, st.k + 1); render(); });
  $('tuMinus').addEventListener('click', () => { st.k = Math.max(0, st.k - 1); render(); });
  $('tuClear').addEventListener('click', () => { st.k = 0; render(); });
  svg.addEventListener('click', (e) => {
    const p = svgPoint(svg, e);
    const x = p.x - TU.o;
    const y = p.y - TU.o;
    if (x < 0 || y < 0 || x > TU.s || y > TU.s) return;
    const col = Math.min(9, Math.floor(x / cw));
    let idx;
    if (st.u === 10) idx = col + 1;
    else {
      const row = Math.min(9, Math.floor(y / cw));
      idx = col * 10 + row + 1;
      if (st.u === 1000) idx = (col * 10 + row) * 10 + Math.min(9, Math.floor(((x - col * cw) / cw) * 10)) + 1;
    }
    st.k = idx === st.k ? idx - 1 : idx;
    render();
  });
  setMode(10);
}

/* 第 8 页：练一练三幅图（课本 p32）：10 份涂 7 份；100 格涂 43 格；10×10×10 正方体前面最右一列涂 9 个 */
function initEx() {
  const a = $('ex1');
  svgEl('rect', { x: 5, y: 5, width: 98, height: 140, fill: FILL }, a);
  for (let i = 0; i <= 10; i += 1) svgEl('line', { x1: 5 + i * 14, x2: 5 + i * 14, y1: 5, y2: 145, stroke: EDGE, 'stroke-width': i % 10 ? 1.2 : 2 }, a);
  svgEl('path', { d: 'M5 5H145M5 145H145', stroke: EDGE, 'stroke-width': 2 }, a);

  const b = $('ex2');
  const c = 14;
  svgEl('rect', { x: 5, y: 5, width: 4 * c, height: 140, fill: FILL }, b);
  svgEl('rect', { x: 5 + 4 * c, y: 5 + 7 * c, width: c, height: 3 * c, fill: FILL }, b);
  for (let i = 0; i <= 10; i += 1) {
    svgEl('line', { x1: 5 + i * c, x2: 5 + i * c, y1: 5, y2: 145, stroke: EDGE, 'stroke-width': i % 10 ? 1 : 2 }, b);
    svgEl('line', { y1: 5 + i * c, y2: 5 + i * c, x1: 5, x2: 145, stroke: EDGE, 'stroke-width': i % 10 ? 1 : 2 }, b);
  }

  // 斜二测正方体：正面 10×10，侧面、顶面按 45° 方向缩一半
  const s = $('ex3');
  const [ox, oy, e] = [5, 40, 10.5]; // 正面左上角、每个小正方体棱长
  const dx = e * 0.5 * Math.SQRT1_2 * 1.2;
  const dy = -dx;
  const P = (i, j, k) => [ox + i * e + k * dx, oy + j * e + k * dy]; // i 向右，j 向下，k 向后
  const poly = (pts, attrs) => svgEl('path', { d: `M${pts.map((q) => q.map((v) => v.toFixed(2)).join(' ')).join('L')}Z`, ...attrs }, s);
  for (let j = 1; j < 10; j += 1) poly([P(9, j, 0), P(10, j, 0), P(10, j + 1, 0), P(9, j + 1, 0)], { fill: FILL }); // 涂色：最右一列第 2–10 个
  const ln = (p, q, w) => svgEl('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: EDGE, 'stroke-width': w }, s);
  for (let t = 0; t <= 10; t += 1) {
    const w = t % 10 ? 0.8 : 1.6;
    ln(P(t, 0, 0), P(t, 10, 0), w); ln(P(0, t, 0), P(10, t, 0), w); // 正面
    ln(P(t, 0, 0), P(t, 0, 10), w); ln(P(0, 0, t), P(10, 0, t), w); // 顶面
    ln(P(10, t, 0), P(10, t, 10), w); ln(P(10, 0, t), P(10, 10, t), w); // 右侧面
  }
}

window.LESSON = {
  init() {
    initDm();
    initZoom();
    initTu();
    initEx();
  },
};
