'use strict';
/* 六上 综合与实践《树叶中的比》· 本课互动：树叶按示例数据的长、宽精确绘制（叶片外形函数的最长、最宽处正好等于数据），
 * 毫米方格纸上量长、量宽，比值即时判对错；10 片同种叶同比例对照；五种叶画成一样长比形状。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const r1 = (v) => Math.round(v * 10) / 10;

/* 五种树叶：外形参数 a、b（半宽 ∝ t^a(1-t)^b，t 从叶基 0 到叶尖 1），示例叶片长 L、宽 W（mm），比值平均数 avg（示例） */
const SPECIES = [
  { k: 'liu', name: '柳树叶', a: 1.0, b: 1.3, L: 98, W: 15, avg: 6.6, fill: '#8cc63f', vein: '#5b8f22' },
  { k: 'tao', name: '桃树叶', a: 0.9, b: 1.4, L: 126, W: 30, avg: 4.2, fill: '#6fb54a', vein: '#3f7d2a' },
  { k: 'pipa', name: '枇杷树叶', a: 1.4, b: 0.9, L: 165, W: 50, avg: 3.3, fill: '#4f9a4a', vein: '#2f6a2c' },
  { k: 'zhang', name: '香樟树叶', a: 0.8, b: 1.1, L: 85, W: 37, avg: 2.3, fill: '#9ccc65', vein: '#5f8f31' },
  { k: 'sang', name: '桑树叶', a: 0.55, b: 0.75, L: 110, W: 85, avg: 1.3, fill: '#5daa50', vein: '#36752f' },
];
const N = 72;
/** 叶片轮廓：返回局部坐标 [u, v]（u 沿叶长 0..L，v 横向 −W/2..W/2），最宽处正好 W */
function outline(sp, L, W) {
  const f = (t) => t ** sp.a * (1 - t) ** sp.b;
  const t0 = sp.a / (sp.a + sp.b);
  const fmax = f(t0);
  const top = [];
  const bot = [];
  for (let i = 0; i <= N; i += 1) {
    const t = i / N;
    const h = (W / 2) * (f(t) / fmax);
    top.push([t * L, -h]);
    bot.unshift([t * L, h]);
  }
  return { pts: [...top, ...bot], uMax: t0 * L };
}
/** 画一片叶。place(u, v) → [x, y] 把局部坐标变到画布 */
function drawLeaf(g, sp, L, W, place) {
  const { pts, uMax } = outline(sp, L, W);
  const P = pts.map(([u, v]) => place(u, v));
  svgEl('polygon', { points: P.map((p) => p.map((x) => x.toFixed(2)).join(',')).join(' '), fill: sp.fill, stroke: sp.vein, 'stroke-width': 1.2, class: 'leaf' }, g);
  const [a, b] = [place(0, 0), place(L, 0)];
  svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: sp.vein, 'stroke-width': 1, opacity: 0.8 }, g);
  const st = place(-L * 0.08, 0); // 叶柄（不计入长）
  svgEl('line', { x1: st[0], y1: st[1], x2: a[0], y2: a[1], stroke: sp.vein, 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
  return uMax;
}
const horiz = (x0, y0, k) => (u, v) => [x0 + u * k, y0 + v * k];
const vert = (x0, y0, k) => (u, v) => [x0 + v * k, y0 - u * k]; // 叶基在下、叶尖朝上

function dimH(g, x1, x2, y, label, up) {
  svgEl('line', { x1, x2, y1: y, y2: y, class: 'dim' }, g);
  [x1, x2].forEach((x) => svgEl('line', { x1: x, x2: x, y1: y - 6, y2: y + 6, class: 'dim' }, g));
  svgEl('text', { x: (x1 + x2) / 2, y: y + (up ? -9 : 20), class: 'dimt' }, g).textContent = label;
}
function dimV(g, x, y1, y2, label) {
  svgEl('line', { x1: x, x2: x, y1, y2, class: 'dim' }, g);
  [y1, y2].forEach((y) => svgEl('line', { x1: x - 6, x2: x + 6, y1: y, y2: y, class: 'dim' }, g));
  svgEl('text', { x: x + 10, y: (y1 + y2) / 2 + 6, class: 'dimt', style: 'text-anchor:start' }, g).textContent = label;
}

/* 第 3 页：五种树叶（每毫米 1 像素，按示例大小） */
function initGallery() {
  const s = $('gallery');
  SPECIES.forEach((sp, i) => {
    const cx = 100 + i * 200;
    drawLeaf(s, sp, sp.L, sp.W, vert(cx, 172, 0.95));
    svgEl('text', { x: cx, y: 194, class: 'gl-n' }, s).textContent = sp.name;
  });
}

/* 第 4 页：怎样量 */
function initHow() {
  const s = $('howFig');
  const sp = SPECIES[0];
  const k = 4.4;
  const [x0, y0] = [70, 95];
  const uMax = drawLeaf(s, sp, sp.L, sp.W, horiz(x0, y0, k));
  dimH(s, x0, x0 + sp.L * k, 175, '长', false);
  dimV(s, x0 + uMax * k, y0 - (sp.W / 2) * k, y0 + (sp.W / 2) * k, '宽');
  svgEl('line', { x1: x0, x2: x0, y1: y0, y2: 175, class: 'guide' }, s);
  svgEl('line', { x1: x0 + sp.L * k, x2: x0 + sp.L * k, y1: y0, y2: 175, class: 'guide' }, s);
  svgEl('text', { x: x0 - 20, y: y0 - 18, class: 'ql' }, s).textContent = '叶柄不量';
}

/* 第 5 页：毫米方格纸上量一量 */
function initMeasure() {
  const st = { i: 0, showL: false, showW: false };
  const s = $('mmFig');
  const box = $('spBtns');
  box.innerHTML = SPECIES.map((sp, i) => `<button type="button" class="btn ${i ? '' : 'solid'}" data-k="${i}">${sp.name}</button>`).join('');
  const render = () => {
    const sp = SPECIES[st.i];
    s.innerHTML = '';
    const k = Math.min(470 / (sp.L + 10), 230 / (sp.W + 10));
    const gx = 40;
    const gy = 30;
    const gw = Math.ceil((sp.L + 10) / 10) * 10;
    const gh = Math.ceil((sp.W + 10) / 10) * 10;
    for (let m = 0; m <= gw; m += 1) svgEl('line', { x1: gx + m * k, x2: gx + m * k, y1: gy, y2: gy + gh * k, class: m % 10 ? 'mm1' : 'mm10' }, s);
    for (let m = 0; m <= gh; m += 1) svgEl('line', { x1: gx, x2: gx + gw * k, y1: gy + m * k, y2: gy + m * k, class: m % 10 ? 'mm1' : 'mm10' }, s);
    const x0 = gx + 10 * k; // 叶基对齐 10 mm 粗线
    const y0 = gy + (gh / 2) * k;
    const uMax = drawLeaf(s, sp, sp.L, sp.W, horiz(x0, y0, k));
    const g = svgEl('g', {}, s);
    if (st.showL) dimH(g, x0, x0 + sp.L * k, gy + gh * k + 14, `${sp.L} mm`, false);
    if (st.showW) dimV(g, x0 + uMax * k, y0 - (sp.W / 2) * k, y0 + (sp.W / 2) * k, `${sp.W} mm`);
    $('mmMsg').innerHTML = `${sp.name}：先数一数大格（10 mm）和小格（1 mm），读出长和宽。`;
    $('mmCalc').innerHTML = `<p>长 <span class="blank" data-ans="${sp.L}"></span> mm，宽 <span class="blank" data-ans="${sp.W}"></span> mm</p>
      <p>长与宽的比值 ≈ <span class="blank" data-ans="${r1(sp.L / sp.W)}" data-w="3"></span>（保留一位小数）</p>`;
    MCheck.init($('mmCalc'));
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
    Object.assign(st, { i: +b.dataset.k, showL: false, showW: false });
    render();
  });
  $('mL').addEventListener('click', () => { st.showL = !st.showL; render(); });
  $('mW').addEventListener('click', () => { st.showW = !st.showW; render(); });
  render();
}

/* 第 6 页：10 片柳树叶（示例数据） */
const WILLOW = [[98, 15], [112, 17], [86, 13], [105, 16], [120, 18], [92, 14], [101, 15], [79, 12], [110, 17], [95, 14]];
function initRecord() {
  const cell = (n) => {
    const [L, W] = WILLOW[n - 1];
    const r = r1(L / W);
    return `<td>${n}</td><td>${L}</td><td>${W}</td><td>${n <= 5 ? `<span class="blank" data-ans="${r}" data-w="3"></span>` : r.toFixed(1)}</td>`;
  };
  const head = '<tr><th>编号</th><th>长/mm</th><th>宽/mm</th><th>比值</th><th>编号</th><th>长/mm</th><th>宽/mm</th><th>比值</th></tr>';
  $('recTab').innerHTML = head + [1, 2, 3, 4, 5].map((n) => `<tr>${cell(n)}${cell(n + 5)}</tr>`).join('');
  MCheck.init($('recTab'));
  const s = $('tenFig');
  const k = 0.85;
  WILLOW.forEach(([L, W], i) => {
    const x0 = 8 + (i % 5) * 112;
    const y0 = 35 + Math.floor(i / 5) * 70;
    drawLeaf(s, SPECIES[0], L, W, horiz(x0 + 6, y0, k));
    svgEl('text', { x: x0 + 2, y: y0 - 12, class: 'tn' }, s).textContent = i + 1;
  });
}

/* 第 7 页：画成一样长，宽 = 长 ÷ 比值 */
function initCompare() {
  const s = $('cmpFig');
  const Lpx = 175;
  let x = 20;
  SPECIES.forEach((sp) => {
    const Wpx = Lpx / sp.avg;
    const cx = x + Wpx / 2;
    drawLeaf(s, sp, Lpx, Wpx, vert(cx, 196, 1));
    svgEl('text', { x: cx, y: 228, class: 'gl-n' }, s).textContent = sp.name;
    svgEl('text', { x: cx, y: 246, class: 'gl-v' }, s).textContent = sp.avg.toFixed(1);
    x += Math.max(Wpx, 74) + 20;
  });
}

window.LESSON = {
  init() {
    initGallery();
    initHow();
    initMeasure();
    initRecord();
    initCompare();
  },
};
