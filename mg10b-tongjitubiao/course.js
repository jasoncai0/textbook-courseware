'use strict';
/* 高一下 14.3 统计图表 · 本课互动：例 1 扇形图与折线图、例 2 频率分布表与频数直方图、
 * 组距不等的错觉（频数 / 频率÷组距切换）、例 3 频率直方图构建器（改组距实时重算）、招生数据录取率对比。
 * 所有表与图都由代码从课本原始数据计算。 */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const OFF = [[-1e4, -1e4], [-1e4, -1e4], [-1e4, -1e4]]; // 未使用的矩形画到画板外（被裁掉）

/* 课本 p222 例 2：40 个企业的年度销售收入（万元） */
const SALES = [152, 124, 129, 116, 100, 103, 92, 95, 127, 104, 105, 119, 114, 115, 87, 103, 118, 142, 135, 125,
  117, 108, 105, 110, 107, 137, 120, 136, 117, 108, 97, 88, 123, 115, 119, 138, 112, 146, 113, 126];
/* 课本 p225 例 3 表 14-3-3：100 株树木底部周长（cm） */
const TREES = [135, 98, 102, 110, 99, 121, 110, 96, 100, 103, 125, 97, 117, 113, 110, 92, 102, 109, 104, 112,
  109, 124, 87, 131, 97, 102, 123, 104, 104, 128, 105, 123, 111, 103, 105, 92, 114, 108, 104, 102,
  129, 126, 97, 100, 115, 111, 106, 117, 104, 109, 111, 89, 110, 121, 80, 120, 121, 104, 108, 118,
  129, 99, 90, 99, 121, 123, 107, 111, 91, 100, 99, 101, 116, 97, 102, 108, 101, 95, 107, 101,
  102, 108, 117, 99, 118, 106, 119, 97, 126, 108, 123, 119, 98, 121, 101, 113, 102, 103, 104, 108];

/** 分组计数：从 start 起每 w 一组，最后一组含右端点 */
function groupBy(data, start, w, end) {
  const n = Math.max(1, Math.ceil((end - start) / w - 1e-9));
  const groups = Array.from({ length: n }, (_, i) => ({ a: start + i * w, b: start + (i + 1) * w, c: 0 }));
  data.forEach((x) => { const i = Math.min(n - 1, Math.floor((x - start) / w + 1e-9)); groups[i].c += 1; });
  return groups;
}
const tableHTML = (groups, N, dens) => `<table class="mtab"><tr><th>分组</th><th>频数</th><th>频率</th>${dens ? '<th>频率/组距</th>' : ''}</tr>`
  + groups.map((g, i) => `<tr><td>[${fmt(g.a, 1)}, ${fmt(g.b, 1)}${i === groups.length - 1 ? ']' : ')'}</td><td>${g.c}</td><td>${fmt(g.c / N, 3)}</td>${dens ? `<td>${(g.c / N / (g.b - g.a)).toFixed(3)}</td>` : ''}</tr>`).join('')
  + `<tr><td>合计</td><td>${N}</td><td>1</td>${dens ? `<td>${fmt(groups.reduce((s, g) => s + g.c / N / (g.b - g.a), 0), 3)}</td>` : ''}</tr></table>`;

/** 直方图：矩形数量可变（最多 maxG 个），高度 h(g) 由调用方给出 */
function histogram(el, o) {
  const b = board(el, { x: o.x, y: o.y, w: o.w || 560, h: o.h || 320, ticks: o.ticks, labels: o.labels, grid: false });
  for (let i = 0; i < (o.maxG || 30); i += 1) {
    b.poly(() => { const g = o.groups()[i]; if (!g) return OFF; const h = o.height(g); return [[g.a, 0], [g.b, 0], [g.b, h], [g.a, h]]; }, { cls: 'bar' });
  }
  // poly 的 cls 只在创建时生效：按组上色时由 o.color 改 class
  if (o.color) b.onUpdate = () => { [...el.querySelectorAll('polygon')].forEach((p, i) => { const g = o.groups()[i]; p.setAttribute('class', g ? o.color(g, i) : 'bar'); }); };
  return b;
}

/* ---------- 第 3 页：扇形图、折线图 ---------- */
function initPie() {
  const parts = [['0～14 岁', 16.5, '#4f9bd0'], ['15～64 岁', 73.4, '#d9711c'], ['65 岁及以上', 10.1, '#2f7d6b']];
  const R = 80;
  const C = [150, 118];
  let a0 = -Math.PI / 2;
  const paths = parts.map(([name, p, col]) => {
    const a1 = a0 + (2 * Math.PI * p) / 100;
    const pt = (a, r = R) => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)];
    const [x0, y0] = pt(a0);
    const [x1, y1] = pt(a1);
    const [lx, ly] = pt((a0 + a1) / 2, R + 16);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    a0 = a1;
    return `<path d="M${C[0]} ${C[1]} L${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z" fill="${col}" stroke="#fff" stroke-width="2"/>`
      + `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" class="pl" text-anchor="${lx < C[0] - 5 ? 'end' : lx > C[0] + 5 ? 'start' : 'middle'}">${name} ${p}%</text>`;
  });
  $('pie').innerHTML = `<svg viewBox="-20 0 340 240">${paths.join('')}</svg>`;
  const b = board($('line'), { x: [1984, 2020], y: [-1, 12.5], w: 420, h: 240, ticks: [0, 2], labels: ['年份', '%'], grid: false });
  const pts = [[1990, 5.6], [2000, 7.0], [2014, 10.1]];
  pts.forEach((p, i) => { if (i) b.seg([pts[i - 1], p], { cls: 'c2' }); });
  pts.forEach(([x, y]) => { b.pt([x, y], { cls: 'c2', r: 6 }); b.text([x, y], `${y}%`, { cls: 'lb up', dx: -14, dy: -12 }); b.text([x, 0], String(x), { cls: 'tk', dx: -16, dy: 18 }); });
  b.update();
}

/* ---------- 第 4 页：例 2 ---------- */
function initSales() {
  const rows = [];
  for (let i = 0; i < SALES.length; i += 10) rows.push(`<tr>${SALES.slice(i, i + 10).map((x) => `<td${x === 127 ? ' class="hl"' : ''}>${x}</td>`).join('')}</tr>`);
  $('salesTab').innerHTML = rows.join('');
  const g = groupBy(SALES, 80, 10, 160);
  $('salesFreq').outerHTML = `<div id="salesFreq" class="ftab" data-step="3">${tableHTML(g, SALES.length, false)}</div>`;
  const b = histogram($('salesHist'), { x: [72, 165], y: [-1.5, 14], h: 230, ticks: [10, 2], labels: ['万元', '频数'], groups: () => g, height: (x) => x.c, color: (x) => (x.a === 120 ? 'bar hot' : 'bar') });
  b.update();
}

/* ---------- 第 5 页：组距不等的错觉 ---------- */
function initMerge() {
  const s = { mg: 0, ax: 'cnt' };
  const eq = groupBy(SALES, 80, 10, 160);
  const merged = () => (s.mg ? [...eq.slice(0, 5), { a: 130, b: 160, c: eq.slice(5).reduce((t, x) => t + x.c, 0) }] : eq);
  const N = SALES.length;
  const host = $('mgHist');
  host.innerHTML = '<div class="hv" id="mgC"></div><div class="hv" id="mgD"></div>';
  const bc = histogram($('mgC'), { x: [72, 165], y: [-1.5, 14], h: 300, ticks: [10, 2], labels: ['万元', '频数'], groups: merged, height: (x) => x.c, color: (x) => (x.b - x.a > 10 ? 'bar hot' : 'bar') });
  const bd = histogram($('mgD'), { x: [72, 165], y: [-0.0035, 0.033], h: 300, ticks: [10, 0.005], labels: ['万元', '频率/组距'], groups: merged, height: (x) => x.c / N / (x.b - x.a), color: (x) => (x.b - x.a > 10 ? 'bar hot' : 'bar') });
  const render = () => {
    $('mgC').style.display = s.ax === 'cnt' ? '' : 'none';
    $('mgD').style.display = s.ax === 'den' ? '' : 'none';
    bc.update(); bd.update();
    const last = merged()[merged().length - 1];
    const f = last.c / N;
    $('mgMsg').innerHTML = s.mg
      ? (s.ax === 'cnt'
        ? `$[130,160]$ 上频数为 ${last.c}，矩形又宽又高、面积最大——<b>容易误以为这里的企业最多</b>。`
        : `高取 频率/组距 $=\\dfrac{${fmt(f, 3)}}{30}\\approx${fmt(f / 30, 4)}$，面积恰为频率 ${fmt(f, 3)}——错觉消失。`)
      : `各组组距都是 10，矩形面积与频数成比例。`;
    tex($('mgMsg'));
  };
  const group = (attr, key) => document.querySelectorAll(`[data-${attr}]`).forEach((btn) => btn.addEventListener('click', () => {
    s[key] = attr === 'mg' ? +btn.dataset[attr] : btn.dataset[attr];
    document.querySelectorAll(`[data-${attr}]`).forEach((x) => x.classList.toggle('solid', x === btn));
    render();
  }));
  group('mg', 'mg');
  group('ax', 'ax');
  render();
  return () => { bc.update(); bd.update(); };
}

/* ---------- 第 7 页：频率直方图构建器 ---------- */
const WIDTHS = [2, 4, 5, 6, 8, 10];
function initBuilder() {
  const N = TREES.length;
  const s = { w: 5, line: false };
  const groups = () => groupBy(TREES, 80, s.w, 135);
  const maxDen = Math.max(...WIDTHS.flatMap((w) => groupBy(TREES, 80, w, 135).map((g) => g.c / N / w)));
  const b = histogram($('bwHist'), { x: [74, 144], y: [-maxDen * 0.1, maxDen * 1.12], h: 340, ticks: [10, 0.01], labels: ['cm', '频率/组距'], groups, height: (g) => g.c / N / (g.b - g.a), maxG: 30 });
  // 频率折线：各矩形上底中点，两端向外延伸半个组距到横轴
  const line = () => {
    const g = groups();
    const w = s.w;
    return [[g[0].a - w / 2, 0], ...g.map((x) => [(x.a + x.b) / 2, x.c / N / w]), [g[g.length - 1].b + w / 2, 0]];
  };
  const MAXP = 32;
  for (let i = 0; i < MAXP - 1; i += 1) b.seg(() => { const L = line(); return s.line && L[i + 1] ? [L[i], L[i + 1]] : OFF.slice(0, 2); }, { cls: 'c2' });
  b.onUpdate = () => {
    const g = groups();
    $('bwTab').innerHTML = tableHTML(g, N, true);
    const area = g.reduce((t, x) => t + (x.b - x.a) * (x.c / N / (x.b - x.a)), 0);
    $('bwMsg').innerHTML = `组距 ${s.w}，共 ${g.length} 组；所有矩形面积之和 $=${fmt(area, 6)}$。${s.w === 5 ? '（与课本表 14-3-4 相同）' : ''}`;
    tex($('bwMsg'));
  };
  MathKit.slider($('bwW'), (i) => { s.w = WIDTHS[i]; $('bwWV').textContent = s.w; b.update(); });
  $('bwLine').addEventListener('click', () => { s.line = !s.line; $('bwLine').classList.toggle('solid', s.line); b.update(); });
  return b;
}

/* ---------- 第 8 页：例 3 表与图 ---------- */
function initEx3() {
  const N = TREES.length;
  const g = groupBy(TREES, 80, 5, 135);
  $('ex3Tab').innerHTML = tableHTML(g, N, true);
  const b = histogram($('ex3Hist'), { x: [74, 140], y: [-0.005, 0.054], h: 250, ticks: [5, 0.01], labels: ['cm', '频率/组距'], groups: () => g, height: (x) => x.c / N / 5, color: (x) => (x.b <= 100 ? 'bar hot' : x.a >= 120 ? 'bar jade' : 'bar') });
  b.update();
}

/* ---------- 第 9 页：练习 p223 第 3 题 录取率 ---------- */
const ADM = [['合计', [35, 80], [20, 60]], ['电机工程', [30, 60], [10, 20]], ['英文', [5, 20], [10, 40]]];
function initAdm() {
  const b = board($('adm'), { x: [-0.3, 9], y: [-12, 62], w: 460, h: 260, ticks: [0, 10], labels: ['', '录取率/%'], grid: false });
  const BW = 1;
  ADM.forEach(([name, m, f], k) => {
    const x0 = 0.6 + k * 3;
    [[m, 'bar', '男'], [f, 'bar hot', '女']].forEach(([[a, n], cls, sex], j) => {
      const r = (100 * a) / n;
      const x = x0 + j * BW * 1.1;
      b.poly([[x, 0], [x + BW, 0], [x + BW, r], [x, r]], { cls });
      b.text([x + BW / 2, r], `${fmt(r, 1)}`, { cls: 'lb up', dx: -14, dy: -6 });
      b.text([x + BW / 2, 0], sex, { cls: 'tk', dx: -6, dy: 18 });
    });
    b.text([x0 + BW, 0], name, { cls: 'lb up', dx: -24, dy: 42 });
  });
  b.update();
  $('admMsg').innerHTML = '指责者看<b>合计</b>：女生录取率低；学校看<b>分专业</b>：每个专业男女录取率相同。';
}

let redrawMerge = () => {};
let builder = null;
window.LESSON = {
  init() {
    initPie();
    initSales();
    redrawMerge = initMerge();
    builder = initBuilder();
    initEx3();
    initAdm();
  },
  onRender(slide) {
    if (slide.contains($('mgHist'))) redrawMerge();
    if (builder && slide.contains($('bwHist'))) builder.update();
  },
};
