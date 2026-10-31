'use strict';
/* 六下 反比例的意义 · 本课互动：例 3 按单价画出买到的笔记本（总价始终 60 元）、面积始终 12 的长方形（拖角，宽 = 12 ÷ 长，
 * 角点连成曲线）、练习十一第 2 题六个长方形、动手做纸条支架（孔号 × 珠数相等才平衡）。图形都按数值精确计算。 */
const { board, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const txt = (svg, x, y, s, cls) => { svgEl('text', { x, y, class: cls }, svg).textContent = s; };
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const snap = (v, st) => Math.round(v / st) * st;
const boards = [];

/* ---------- 小图 ---------- */
function gridRect(svg, x0, y0, u, w, h, cls = 'rc') {
  svgEl('rect', { x: x0, y: y0, width: w * u, height: h * u, class: cls }, svg);
}
function initMini() {
  const m = $('rectMini');
  const [x0, y0, u] = [50, 12, 26];
  gridRect(m, x0, y0, u, 4, 3);
  for (let i = 1; i < 4; i += 1) svgEl('line', { x1: x0 + i * u, x2: x0 + i * u, y1: y0, y2: y0 + 3 * u, class: 'gl' }, m);
  for (let j = 1; j < 3; j += 1) svgEl('line', { x1: x0, x2: x0 + 4 * u, y1: y0 + j * u, y2: y0 + j * u, class: 'gl' }, m);
  txt(m, x0 + 2 * u, y0 + 3 * u + 16, '长 4 cm', 'ms'); txt(m, x0 + 4 * u + 30, y0 + 1.6 * u, '宽 3 cm', 'ms');
  // 比一比表格里的两个小图：y = x 与 y = 12/x（同一坐标比例）
  [['gZ', (x) => x], ['gF', (x) => 12 / x]].forEach(([id, f]) => {
    const g = $(id);
    const [ox, oy, s] = [12, 62, 7.5];
    svgEl('path', { d: `M${ox} ${oy}H114M${ox} ${oy}V4`, class: 'tax' }, g);
    const pts = [];
    for (let x = 0.2; x <= 13.4; x += 0.1) { const y = f(x); if (y <= 7.6) pts.push(`${ox + x * s},${oy - y * s}`); }
    svgEl('polyline', { points: pts.join(' '), class: id === 'gZ' ? 'tl1' : 'tl2' }, g);
  });
}

/* ---------- 例 3：60 元买笔记本 ---------- */
const TOTAL = 60;
const PRICES = [1, 2, 3, 4, 5, 6];
function initBooks() {
  const st = { p: 2 };
  $('nbBtns').innerHTML = PRICES.map((p) => `<button type="button" class="btn" data-p="${p}">每本 ${p} 元</button>`).join('');
  const svg = $('books');
  const render = () => {
    const n = TOTAL / st.p;
    svg.innerHTML = '';
    const [cols, w, h, gx, gy] = [15, 34, 46, 4, 10];
    for (let i = 0; i < n; i += 1) {
      const [x, y] = [6 + (i % cols) * (w + gx), 6 + Math.floor(i / cols) * (h + gy)];
      svgEl('rect', { x, y, width: w, height: h, rx: 3, class: `book b${st.p}` }, svg);
      txt(svg, x + w / 2, y + h / 2 + 6, `${st.p}`, 'bk');
    }
    document.querySelectorAll('#nbBtns .btn').forEach((b) => b.classList.toggle('solid', +b.dataset.p === st.p));
    $('nbRead').innerHTML = `每本 <b>${st.p}</b> 元，能买 <b>${n}</b> 本：$${st.p}\\times${n}=60$（元）`;
    MathKit.tex($('nbRead'));
    $('nbTab').innerHTML = `<tr><th>单价/(元/本)</th>${PRICES.map((p) => `<td class="${p === st.p ? 'hi' : ''}">${p}</td>`).join('')}<td>…</td></tr>`
      + `<tr><th>数量/本</th>${PRICES.map((p) => `<td class="${p === st.p ? 'hi' : ''}">${TOTAL / p}</td>`).join('')}<td>…</td></tr>`;
  };
  $('nbBtns').addEventListener('click', (e) => { const b = e.target.closest('[data-p]'); if (b) { st.p = +b.dataset.p; render(); } });
  render();
}

/* ---------- 面积始终 12 的长方形 ---------- */
const AREA = 12;
function initRect() {
  const b = board($('rectB'), { x: [-0.7, 13.2], y: [-0.7, 13.2], w: 520, h: 520, ticks: [1, 1], labels: ['', ''] });
  boards.push(b);
  b.text([13.2, 0], '长/cm', { cls: 'axlab end', dy: -10 });
  b.text([0, 13.2], '宽/cm', { cls: 'axlab', dx: 10, dy: 16 });
  const s = { x: 4, log: new Map(), curve: false };
  const y = () => AREA / s.x;
  b.poly(() => [[0, 0], [s.x, 0], [s.x, y()], [0, y()]], { cls: 'fill1' });
  const curve = b.fn((x) => AREA / x, { from: 1, to: 12, cls: 'c2' });
  curve.classList.add('off');
  for (let x = 1; x <= 12; x += 1) b.pt([x, AREA / x], { cls: 'logpt', r: 5, show: () => s.log.has(x) });
  b.drag(() => [s.x, y()], (x) => { s.x = clamp(snap(x, 0.25), 1, 12); });
  const render = () => {
    const yy = y();
    const exact = Number.isInteger(yy * 1000);
    if (Number.isInteger(s.x)) s.log.set(s.x, yy);
    $('rectRead').innerHTML = `长 <b>${fmt(s.x, 2)}</b> cm，宽 ${exact ? '' : '≈ '}<b>${fmt(yy, 2)}</b> cm<br>长 × 宽 = <b>12</b> cm²（面积不变）`;
    const list = [...s.log.entries()].sort((a, c) => a[0] - c[0]);
    $('rectLog').innerHTML = list.length ? list.map(([x, v]) => `${x}×${Number.isInteger(v * 1000) ? '' : '≈'}${fmt(v, 2)}`).join('，') : '还没有记录。';
    $('rectLog').classList.toggle('muted', !list.length);
  };
  b.onUpdate = render;
  $('rectCurve').addEventListener('click', () => { s.curve = !s.curve; curve.classList.toggle('off', !s.curve); b.update(); });
  b.update();
}

/* ---------- 练习十一第 2 题：每格 1 cm ---------- */
const U = 25;
function rectSet(id, list) {
  const svg = $(id);
  const [x0, y0, cols, rows] = [20, 12, 16, 6];
  for (let i = 0; i <= cols; i += 1) svgEl('line', { x1: x0 + i * U, x2: x0 + i * U, y1: y0, y2: y0 + rows * U, class: 'gl' }, svg);
  for (let j = 0; j <= rows; j += 1) svgEl('line', { x1: x0, x2: x0 + cols * U, y1: y0 + j * U, y2: y0 + j * U, class: 'gl' }, svg);
  list.forEach(([name, c, r, w, h]) => {
    gridRect(svg, x0 + c * U, y0 + r * U, U, w, h, 'rp');
    txt(svg, x0 + (c + w / 2) * U, y0 + (r + h / 2) * U + 7, name, 'rn');
  });
}

/* ---------- 动手做：纸条支架（18 cm，每隔 2 cm 一个孔；1 cm = 28 单位） ---------- */
const CM = 28;
const PIV = [300, 110];
function initLever() {
  const svg = $('lever');
  const st = { lh: 4, lb: 2, rh: 2, rb: 1 };
  const LIM = { lh: [1, 4], rh: [1, 4], lb: [0, 6], rb: [0, 6] };
  const render = () => {
    const L = st.lh * st.lb;
    const R = st.rh * st.rb;
    const ang = clamp((R - L) * 1.5, -14, 14); // 右边重 → 顺时针（右端下沉）
    const rot = (dx) => { const a = (ang * Math.PI) / 180; return [PIV[0] + dx * Math.cos(a), PIV[1] + dx * Math.sin(a)]; };
    svg.innerHTML = '';
    svgEl('path', { d: `M${PIV[0]} ${PIV[1]}L${PIV[0] - 14} 238H${PIV[0] + 14}Z`, class: 'stand' }, svg);
    svgEl('rect', { x: PIV[0] - 70, y: 238, width: 140, height: 12, rx: 3, class: 'stand' }, svg);
    const g = svgEl('g', { transform: `rotate(${ang} ${PIV[0]} ${PIV[1]})` }, svg);
    svgEl('rect', { x: PIV[0] - 9 * CM, y: PIV[1] - 11, width: 18 * CM, height: 22, rx: 3, class: 'strip' }, g);
    for (let k = -4; k <= 4; k += 1) svgEl('circle', { cx: PIV[0] + k * 2 * CM, cy: PIV[1], r: k ? 4 : 6, class: k ? 'hole' : 'pin' }, g);
    [[-1, st.lh, st.lb], [1, st.rh, st.rb]].forEach(([side, h, n]) => {
      const [hx, hy] = rot(side * h * 2 * CM);
      if (!n) return;
      svgEl('line', { x1: hx, y1: hy, x2: hx, y2: hy + 34, class: 'thread' }, svg);
      for (let i = 0; i < n; i += 1) svgEl('ellipse', { cx: hx, cy: hy + 44 + i * 17, rx: 10, ry: 8, class: 'bead' }, svg);
    });
    ['lh', 'lb', 'rh', 'rb'].forEach((k) => { $(`lv${k.toUpperCase()}`).textContent = st[k]; });
    const msg = $('lvMsg');
    msg.className = `tip feedback ${L === R ? 'fb-ok' : ''}`;
    msg.innerHTML = L === R
      ? `<b>✓ 平衡了！</b>左：${st.lh} × ${st.lb} = ${L}，右：${st.rh} × ${st.rb} = ${R}。`
      : `${L > R ? '左' : '右'}边往下沉了，再调一调。`;
  };
  document.querySelector('.lv-ctrl').addEventListener('click', (e) => {
    const d = e.target.closest('[data-d]')?.dataset.d;
    if (!d) return;
    const k = d.slice(0, 2);
    st[k] = clamp(st[k] + (d[2] === '+' ? 1 : -1), ...LIM[k]);
    render();
  });
  render();
}

window.LESSON = {
  init() {
    initMini();
    initBooks();
    initRect();
    rectSet('rectA', [['①', 1, 1, 12, 1], ['②', 1, 3, 6, 2], ['③', 9, 3, 4, 3]]);
    rectSet('rectP', [['④', 4, 1, 6, 1], ['⑤', 1, 3, 5, 2], ['⑥', 9, 3, 4, 3]]);
    initLever();
  },
  onRender() {
    requestAnimationFrame(() => boards.forEach((b) => b.update()));
  },
};
