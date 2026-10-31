'use strict';
/* 六下 图形的放大与缩小 · 本课互动：方格纸上拖动画出按比放大/缩小的图形（对齐格点，逐边判断对应边的比）。
 * 所有图形尺寸按课本格数精确画出；方格纸见 ../shared/mgrid.js */
const { tex } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const U = 30;
const shapePts = (shape, [x, y], w, h) => (shape === 'tri'
  ? [[x, y], [x, y + h], [x + w, y + h]]
  : [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
const fmt = (v) => (Number.isInteger(v) ? `${v}` : `${+v.toFixed(2)}`);
const setMsg = (el, ok, html) => {
  el.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
  el.innerHTML = html;
  tex(el);
};

/* 方格纸作图器：左边原图（w0×h0 格），右边从 at 点开始拖出新图形 */
function scaler(svgId, msgId, o) {
  const svg = $(svgId);
  const g = MGrid.paper(svg, { cols: o.cols, rows: o.rows, u: U, pad: 14 });
  const st = { ratio: o.ratio, w: o.w0, h: o.h0 };
  g.poly(shapePts(o.shape, o.origin, o.w0, o.h0), 'sh-a');
  g.text([o.origin[0] + o.w0 / 2, o.origin[1] - 0.45], '原图', 'mg-t b');
  const layer = g.group('');
  const dot = MGrid.mk('circle', { r: 10, class: 'sc-handle' }, svg);
  const [ax, ay] = o.at;
  const hyp = (w, h) => Math.hypot(w, h);
  const draw = () => {
    const { w, h } = st;
    layer.innerHTML = '';
    g.poly(shapePts(o.shape, o.at, w, h), 'sh-d', layer);
    g.dim([ax, ay + h], [ax + w, ay + h], `${w} 格`, -0.5, layer);
    g.dim([ax, ay], [ax, ay + h], `${h} 格`, -0.55, layer);
    const [px, py] = g.P([ax + w, ay + h]);
    dot.setAttribute('cx', px); dot.setAttribute('cy', py);
    const [p, q] = st.ratio;
    const tw = (o.w0 * p) / q;
    const th = (o.h0 * p) / q;
    const okW = w === tw;
    const okH = h === th;
    const name = o.shape === 'tri' ? ['一条直角边', '另一条直角边'] : ['长', '宽'];
    const part = (nm, v, v0, ok) => `${nm} ${v} 格（原来 ${v0} 格）${ok ? ' ✓' : `，$${v}:${v0}$ 不等于 $${p}:${q}$`}`;
    let html = `${part(name[0], w, o.w0, okW)}；${part(name[1], h, o.h0, okH)}。`;
    if (o.shape === 'tri') html += `<br>量一量斜边：原来约 <b>${fmt(hyp(o.w0, o.h0))}</b> 格，现在约 <b>${fmt(hyp(w, h))}</b> 格。`;
    if (okW && okH) html = `<b>✓ 画对了！</b>按 $${p}:${q}$ 的比${p > q ? '放大' : '缩小'}：${html}`;
    setMsg($(msgId), okW && okH, html);
  };
  MGrid.drag(svg, dot, ([x, y]) => {
    st.w = Math.min(o.cols - ax, Math.max(1, Math.round(x / U - ax)));
    st.h = Math.min(o.rows - ay, Math.max(1, Math.round(y / U - ay)));
    draw();
  });
  draw();
  return {
    setRatio(r) { st.ratio = r; draw(); },
    show() { st.w = (o.w0 * st.ratio[0]) / st.ratio[1]; st.h = (o.h0 * st.ratio[0]) / st.ratio[1]; draw(); },
  };
}

function initScalers() {
  const s1 = scaler('scale1', 'scMsg1', { shape: 'rect', w0: 4, h0: 2, cols: 26, rows: 8, origin: [1, 1], at: [8, 1], ratio: [3, 1] });
  $('scRatio').addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (!b) return;
    $('scRatio').querySelectorAll('button').forEach((x) => x.classList.toggle('solid', x === b));
    s1.setRatio(b.dataset.r.split(',').map(Number));
  });
  $('scShow').addEventListener('click', () => s1.show());
  scaler('scale2', 'scMsg2', { shape: 'tri', w0: 4, h0: 1, cols: 22, rows: 5, origin: [1, 1], at: [8, 1], ratio: [2, 1] });
}

/* 第 3 页：例 1 照片（1 厘米 = 16 个单位），同一幅画按比例缩放 */
function picture(parent, x, y, k) {
  const g = svgEl('g', { transform: `translate(${x} ${y}) scale(${k})` }, parent);
  svgEl('rect', { x: 0, y: 0, width: 8, height: 5, fill: '#bfe3f7' }, g);
  svgEl('path', { d: 'M0 3.4Q2 2.6 4 3.2T8 3V5H0Z', fill: '#e6c77a' }, g);
  svgEl('rect', { x: 4.6, y: 2.1, width: 0.22, height: 1.4, fill: '#7a5230' }, g);
  svgEl('ellipse', { cx: 4.7, cy: 1.9, rx: 1.1, ry: 0.55, fill: '#4f8f3a' }, g);
  svgEl('circle', { cx: 1.3, cy: 1, r: 0.45, fill: '#ffd36b' }, g);
  svgEl('rect', { x: 0, y: 0, width: 8, height: 5, fill: 'none', stroke: '#3d5568', 'stroke-width': 0.08 }, g);
}
function initPhoto() {
  const svg = $('photo1');
  const S = 16;
  picture(svg, 20, 90, S);
  picture(svg, 280, 40, S * 2);
  const t = (x, y, s, a = 'middle') => { const e = svgEl('text', { x, y, class: 'fl', 'text-anchor': a }, svg); e.textContent = s; };
  t(20 + 4 * S, 90 + 5 * S + 26, '8 cm');
  t(20 - 6, 90 + 2.5 * S + 7, '5 cm', 'end');
  t(20 + 4 * S, 80, '原来');
  t(280 + 8 * S, 40 + 10 * S + 26, '16 cm');
  t(280 + 16 * S + 6, 40 + 5 * S + 7, '10', 'start');
  t(280 + 16 * S + 6, 40 + 5 * S + 29, 'cm', 'start');
  t(280 + 8 * S, 30, '放大后');
}

/* 静态方格纸 */
function staticGrid(id, cols, rows, shapes) {
  const g = MGrid.paper($(id), { cols, rows, u: U, pad: 10 });
  shapes.forEach((s) => {
    const el = g.poly(s.pts, s.cls);
    if (s.step) el.dataset.step = s.step;
    if (s.label) g.text(s.label[0], s.label[1], 'mg-t b');
  });
  return g;
}
function initStatic() {
  // 第 5 页：三个长方形左下角重合，对角线在同一条直线上
  const c = staticGrid('cmpFig', 14, 8, [
    { pts: shapePts('rect', [1, 1], 12, 6), cls: 'sh-d' },
    { pts: shapePts('rect', [1, 5], 4, 2), cls: 'sh-a' },
    { pts: shapePts('rect', [1, 6], 2, 1), cls: 'sh-c' },
  ]);
  c.seg([1, 7], [13, 1], 'hgt');
  // 第 9 页：长宽各加 2 格（6×4），与按 2∶1 放大（8×4）对比
  const a = staticGrid('addFig', 10, 6, [
    { pts: shapePts('rect', [1, 1], 8, 4), cls: 'sh-ghost' },
    { pts: shapePts('rect', [1, 1], 6, 4), cls: 'sh-b' },
    { pts: shapePts('rect', [1, 3], 4, 2), cls: 'sh-a' },
  ]);
  a.seg([1, 5], [9, 1], 'hgt');
  a.text([4, 0.45], '6×4（加 2 格）', 'mg-t b');
  a.text([8.2, 5.5], '8×4', 'mg-t');
  // 第 7 页：练一练（正方形 4×4，直角三角形 6 和 4）
  staticGrid('ex1', 22, 6, [
    { pts: shapePts('rect', [1, 1], 4, 4), cls: 'sh-out' },
    { pts: [[9, 1], [9, 5], [15, 5]], cls: 'sh-out' },
    { pts: shapePts('rect', [6, 3], 2, 2), cls: 'sh-b', step: 1 },
    { pts: [[17, 3], [17, 5], [20, 5]], cls: 'sh-b', step: 1 },
  ]);
  // 第 8 页：练习六 1（① 6×2，② 3×2，③ 3×1，④ 2×2，⑤ 12×4）
  staticGrid('ex2', 20, 9, [
    { pts: shapePts('rect', [1, 1], 6, 2), cls: 'sh-out', label: [[4, 2], '①'] },
    { pts: shapePts('rect', [10, 1], 3, 2), cls: 'sh-out', label: [[11.5, 2], '②'] },
    { pts: shapePts('rect', [16, 2], 3, 1), cls: 'sh-out', label: [[17.5, 2.5], '③'] },
    { pts: shapePts('rect', [2, 5], 2, 2), cls: 'sh-out', label: [[3, 6], '④'] },
    { pts: shapePts('rect', [7, 4], 12, 4), cls: 'sh-out', label: [[13, 6], '⑤'] },
  ]);
  // 第 10 页：练习六 2（正方形 2×2 → 4×4；长方形 8×2 → 4×1）
  staticGrid('ex3', 24, 6, [
    { pts: shapePts('rect', [1, 1], 2, 2), cls: 'sh-out' },
    { pts: shapePts('rect', [10, 1], 8, 2), cls: 'sh-out' },
    { pts: shapePts('rect', [4, 1], 4, 4), cls: 'sh-b', step: 1 },
    { pts: shapePts('rect', [19, 3], 4, 1), cls: 'sh-b', step: 1 },
  ]);
}

window.LESSON = {
  init() {
    initPhoto();
    initScalers();
    initStatic();
  },
};
