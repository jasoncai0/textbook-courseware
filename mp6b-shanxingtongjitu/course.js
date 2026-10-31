'use strict';
/* 六下 扇形统计图 · 本课互动：例 1 扇形统计图（点扇形看含义）、百分比 → 圆心角滑块、一块一块拼成整圆、
 * 同一组数据的条形图对比、练一练两个扇形。所有扇形的圆心角都按“百分比 × 360°”精确计算。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent, text) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
};
const fmt = (v, d = 2) => String(+v.toFixed(d));
const TOTAL = 960; // 万平方千米

// 课本 p1 例 1：从 12 点方向起顺时针的顺序
const LAND = [
  { n: '山地', p: 33.3, c: '#f7c6df' },
  { n: '高原', p: 26.0, c: '#d8d2f1' },
  { n: '盆地', p: 18.8, c: '#fbf1a9' },
  { n: '平原', p: 12.0, c: '#f8c8ae' },
  { n: '丘陵', p: 9.9, c: '#cbe8cb' },
];

/* 角度 deg 从 12 点方向起顺时针 */
const pt = (cx, cy, r, deg) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)];
function sectorD(cx, cy, r, a0, a1) {
  if (a1 - a0 >= 359.999) return `M${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}Z`;
  const [x0, y0] = pt(cx, cy, r, a0);
  const [x1, y1] = pt(cx, cy, r, a1);
  return `M${cx} ${cy}L${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z`;
}

/* 画一个扇形统计图：items [{ n, p, c }]，标注写在扇形里 */
function drawPie(svg, items, o) {
  const { cx, cy, r } = o;
  let a = o.start || 0;
  return items.map((it, i) => {
    const a1 = a + (it.p / 100) * 360;
    const g = svgEl('g', { class: 'sec', 'data-i': i }, svg);
    svgEl('path', { d: sectorD(cx, cy, r, a, a1), fill: it.c, class: 'sec-p' }, g);
    if (o.labels !== false) {
      const [lx, ly] = pt(cx, cy, r * (o.lr || 0.62), (a + a1) / 2);
      svgEl('text', { x: lx, y: ly - 4, class: 'sec-t' }, g, it.n);
      svgEl('text', { x: lx, y: ly + 18, class: 'sec-t v' }, g, `${it.p.toFixed(1)}%`);
    }
    a = a1;
    return g;
  });
}

/* 第 3 页：例 1 统计图，点扇形 */
function initPie1() {
  const svg = $('pie1');
  const gs = drawPie(svg, LAND, { cx: 200, cy: 165, r: 150 });
  svg.addEventListener('click', (e) => {
    const g = e.target.closest('.sec');
    if (!g) return;
    const it = LAND[+g.dataset.i];
    gs.forEach((x) => x.classList.toggle('dim', x !== g));
    const msg = $('pie1Msg');
    msg.className = 'tip feedback ok';
    msg.innerHTML = `这块扇形表示<b>${it.n}</b>的面积占我国陆地总面积的 <b>${it.p.toFixed(1)}%</b>。<br>它的圆心角 $=360^\\circ\\times${it.p.toFixed(1)}\\%\\approx${fmt(3.6 * it.p, 1)}^\\circ$。`;
    MathKit.tex(msg);
  });
}

/* 第 4 页：百分比 → 圆心角 */
function initAngle() {
  const svg = $('angFig');
  const [cx, cy, r] = [180, 160, 140];
  svgEl('circle', { cx, cy, r, class: 'ang-ghost' }, svg);
  const sec = svgEl('path', { class: 'ang-sec' }, svg);
  const arc = svgEl('path', { class: 'ang-arc' }, svg);
  svgEl('line', { x1: cx, y1: cy, x2: cx, y2: cy - r, class: 'ang-r' }, svg);
  const r2 = svgEl('line', { class: 'ang-r' }, svg);
  svgEl('circle', { cx, cy, r: 4, fill: '#1f2d3a' }, svg);
  const lab = svgEl('text', { class: 'ang-t' }, svg);
  const inp = $('angP');
  const draw = (p) => {
    const deg = 3.6 * p;
    sec.setAttribute('d', p > 0 ? sectorD(cx, cy, r, 0, deg) : '');
    const ra = 34;
    arc.setAttribute('d', p > 0 && p < 100 ? `M${cx} ${cy - ra}A${ra} ${ra} 0 ${deg > 180 ? 1 : 0} 1 ${pt(cx, cy, ra, deg).map((v) => v.toFixed(2)).join(' ')}` : '');
    const [x2, y2] = pt(cx, cy, r, deg);
    r2.setAttribute('x1', cx); r2.setAttribute('y1', cy); r2.setAttribute('x2', x2); r2.setAttribute('y2', y2);
    const [tx, ty] = pt(cx, cy, 62, deg / 2 || 0.01);
    lab.setAttribute('x', tx); lab.setAttribute('y', ty + 8);
    lab.textContent = p > 0 && p < 100 ? `${fmt(deg, 2)}°` : '';
    $('angPv').textContent = `${fmt(p, 1)}%`;
    const msg = $('angMsg');
    msg.innerHTML = `占整个圆的 $${fmt(p, 1)}\\%$，圆心角 $=360^\\circ\\times${fmt(p, 1)}\\%=${fmt(deg, 2)}^\\circ$`;
    MathKit.tex(msg);
  };
  MathKit.slider(inp, draw);
  $('angPre').addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    inp.value = b.dataset.p;
    draw(+b.dataset.p);
  });
}

/* 第 5 页：一块一块拼成整圆（每块从上一块的边接着顺时针长出来） */
function initBuild() {
  const svg = $('build');
  const [cx, cy, r] = [200, 165, 150];
  const tab = $('buildTab');
  const st = { k: 0, anim: null };
  svgEl('circle', { cx, cy, r, class: 'ang-ghost' }, svg);
  const layer = svgEl('g', {}, svg);
  LAND.forEach((it, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><i class="sw" style="background:${it.c}"></i>${it.n}</td><td>${it.p.toFixed(1)}%</td><td>${fmt(3.6 * it.p, 2)}°</td><td><button type="button" class="btn small" data-i="${i}">放进圆里</button></td>`;
    tab.appendChild(tr);
  });
  const btns = () => tab.querySelectorAll('[data-i]');
  const sync = () => btns().forEach((b) => { b.disabled = +b.dataset.i !== st.k; b.classList.toggle('solid', +b.dataset.i === st.k); });
  const startOf = (k) => LAND.slice(0, k).reduce((s, it) => s + 3.6 * it.p, 0);
  const add = (k) => {
    const it = LAND[k];
    const a0 = startOf(k);
    const a1 = a0 + 3.6 * it.p;
    const g = svgEl('g', { class: 'sec' }, layer);
    const path = svgEl('path', { fill: it.c, class: 'sec-p' }, g);
    const t0 = performance.now();
    const MS = 700;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / MS);
      path.setAttribute('d', sectorD(cx, cy, r, a0, a0 + (a1 - a0) * t));
      if (t < 1) { st.anim = requestAnimationFrame(tick); return; }
      const [lx, ly] = pt(cx, cy, r * 0.62, (a0 + a1) / 2);
      svgEl('text', { x: lx, y: ly - 4, class: 'sec-t' }, g, it.n);
      svgEl('text', { x: lx, y: ly + 18, class: 'sec-t v' }, g, `${it.p.toFixed(1)}%`);
    };
    st.anim = requestAnimationFrame(tick);
    st.k = k + 1;
    const used = LAND.slice(0, st.k).reduce((s, x) => s + x.p, 0);
    const msg = $('buildMsg');
    msg.className = `tip feedback ${st.k === LAND.length ? 'ok' : ''}`;
    msg.innerHTML = st.k === LAND.length
      ? '拼满了！百分比合计 $100\\%$，圆心角合计 $360^\\circ$。'
      : `已经放进 ${st.k} 块：合计 $${fmt(used, 1)}\\%$，圆心角合计 $${fmt(3.6 * used, 2)}^\\circ$；还剩 $${fmt(100 - used, 1)}\\%$。`;
    MathKit.tex(msg);
    sync();
  };
  tab.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b && !b.disabled) add(+b.dataset.i); });
  $('buildReset').addEventListener('click', () => {
    if (st.anim) cancelAnimationFrame(st.anim);
    layer.innerHTML = '';
    st.k = 0;
    $('buildMsg').className = 'tip feedback';
    $('buildMsg').textContent = '按“放进圆里”，一块一块地拼。';
    sync();
  });
  sync();
}

/* 第 7 页：同一组数据的条形图（面积，万平方千米） */
function initCmpBar() {
  const svg = $('cmpBar');
  const [L, B, T, W] = [52, 186, 30, 400];
  const ymax = 350;
  const y = (v) => B - ((B - T) * v) / ymax;
  for (let v = 0; v <= ymax; v += 50) {
    svgEl('line', { x1: L, x2: W, y1: y(v), y2: y(v), class: v ? 'cb-grid' : 'cb-ax' }, svg);
    svgEl('text', { x: L - 6, y: y(v) + 5, class: 'cb-tk' }, svg, v);
  }
  svgEl("text", { x: 4, y: 16, class: "cb-tk st" }, svg, '万平方千米');
  LAND.forEach((it, i) => {
    const v = (TOTAL * it.p) / 100;
    const x = L + 18 + i * 68;
    svgEl('rect', { x, y: y(v), width: 40, height: B - y(v), fill: it.c, class: 'cb-bar' }, svg);
    svgEl('text', { x: x + 20, y: y(v) - 5, class: 'cb-v' }, svg, fmt(v, 2));
    svgEl('text', { x: x + 20, y: B + 22, class: 'cb-c' }, svg, it.n);
  });
}

/* 第 8 页：练一练两个扇形（课本：从 3 点方向起逆时针画小扇形） */
function miniPie(svg, p, color, rest) {
  const [cx, cy, r] = [120, 120, 108];
  svgEl('circle', { cx, cy, r, fill: rest, class: 'sec-p' }, svg);
  svgEl('path', { d: sectorD(cx, cy, r, 90 - 3.6 * p, 90), fill: color, class: 'sec-p' }, svg);
  const [lx, ly] = pt(cx, cy, r * 0.6, 90 - 1.8 * p);
  svgEl('text', { x: lx, y: ly + 6, class: 'sec-t v' }, svg, `${p}%`);
}

window.LESSON = {
  init() {
    initPie1();
    initAngle();
    initBuild();
    initCmpBar();
    miniPie($('pPop'), 19.6, '#f6ef8f', '#a9dcf3');
    miniPie($('pLand'), 9.9, '#9a95d6', '#c6e37c');
    drawPie($('sumPie'), LAND, { cx: 50, cy: 50, r: 46, labels: false });
  },
};
