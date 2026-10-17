'use strict';
/* 五上 梯形的面积 · 本课互动：例 6 三种分法、例 7 两个梯形拼平行四边形、上底滑块（梯形 ↔ 三角形 ↔ 平行四边形）、
 * 练习按数据等比例作图、动手做（过中心的直线分平行四边形）。方格纸与“剪—移—拼”见 ../shared/mgrid.js */
const $ = (id) => document.getElementById(id);
const { mk } = MGrid;
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const later = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn)); // 先放好起点，下一帧再动

/* ---------- 第 3 页：例 6（课本 p14 方格图：上底 3、下底 7、高 4） ---------- */
const T6 = { A: [1, 5], B: [8, 5], C: [5, 1], D: [2, 1] };
const WAYS = {
  1: '长方形 $3\\times4=12$，左三角形 $1\\times4\\div2=2$，右三角形 $3\\times4\\div2=6$<br>$12+2+6=20$（平方厘米）',
  2: '平行四边形 $3\\times4=12$，三角形 $4\\times4\\div2=8$<br>$12+8=20$（平方厘米）',
  3: '拼成的平行四边形：底 $3+7=10$，高 4<br>$10\\times4\\div2=20$（平方厘米）',
};
function initEx6() {
  const g = MGrid.paper($('ex6Fig'), { cols: 13, rows: 6, u: 40 });
  const { A, B, C, D } = T6;
  g.poly([A, B, C, D], 'sh-a');
  const layer = g.group();
  const show = (w) => {
    layer.innerHTML = '';
    if (w === 1) {
      g.poly([D, C, [5, 5], [2, 5]], 'sh-d', layer);
      g.poly([A, D, [2, 5]], 'sh-c', layer);
      g.poly([C, B, [5, 5]], 'sh-c', layer);
    } else if (w === 2) {
      g.poly([A, D, C, [4, 5]], 'sh-d', layer);
      g.poly([[4, 5], C, B], 'sh-c', layer);
    } else {
      const M = mid(B, C);
      const copy = g.poly([A, B, C, D], 'sh-c mg-move', layer);
      MGrid.pose(copy, g, { c: M });
      later(() => MGrid.pose(copy, g, { deg: 180, c: M }));
      g.dim(A, B, '7', -0.45, layer);
      g.dim(B, [11, 5], '3', -0.45, layer);
    }
    const out = $('ex6Calc');
    out.innerHTML = WAYS[w];
    MathKit.tex(out);
  };
  $('ex6Way').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-w]');
    if (!btn) return;
    $('ex6Way').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    show(+btn.dataset.w);
  });
}

/* ---------- 第 4 页：例 7 两个完全一样的梯形拼平行四边形 ---------- */
const TZ = {
  gen: { A: [1, 5], B: [7, 5], C: [5, 1], D: [2, 1], name: '一般梯形' },  // 上底 3 下底 6
  right: { A: [1, 5], B: [6, 5], C: [3, 1], D: [1, 1], name: '直角梯形' }, // 上底 2 下底 5
  iso: { A: [1, 5], B: [7, 5], C: [5, 1], D: [3, 1], name: '等腰梯形' },   // 上底 2 下底 6
};
function initTz() {
  const g = MGrid.paper($('tzFig'), { cols: 12, rows: 6, u: 44 });
  const st = { k: 'gen' };
  const layer = g.group();
  let copy;
  let extra;
  const say = $('tzSay');
  const build = () => {
    const { A, B, C, D } = TZ[st.k];
    layer.innerHTML = '';
    g.poly([A, B, C, D], 'sh-a', layer);
    g.seg(D, [D[0], 5], 'hgt', layer);
    const M = mid(B, C);
    copy = g.poly([A, B, C, D], 'sh-c mg-move fade hide', layer);
    MGrid.pose(copy, g, { dx: 0.35, dy: -0.35, c: M });
    const a = C[0] - D[0];
    const b = B[0] - A[0];
    extra = g.group('fade hide', layer);
    g.dim(A, B, `下底 ${b}`, -0.45, extra);
    g.dim(B, [B[0] + a, 5], `上底 ${a}`, -0.45, extra);
    g.text(M, '●', 'mg-t r pivot', layer);
    $('tzCopy').disabled = false;
    $('tzTurn').disabled = true;
    say.textContent = '先点“复制一个”。';
  };
  $('tzKind').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    st.k = btn.dataset.k;
    $('tzKind').querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    build();
  });
  $('tzCopy').addEventListener('click', () => {
    copy.classList.remove('hide');
    $('tzCopy').disabled = true;
    $('tzTurn').disabled = false;
    say.innerHTML = `复制了一个<b>完全一样</b>的${TZ[st.k].name}。红点是右边那条腰的中点。`;
  });
  $('tzTurn').addEventListener('click', () => {
    const { A, B, C, D } = TZ[st.k];
    const a = C[0] - D[0];
    const b = B[0] - A[0];
    MGrid.pose(copy, g, { deg: 180, c: mid(B, C) });
    setTimeout(() => extra.classList.remove('hide'), 1000);
    $('tzTurn').disabled = true;
    const shape = st.k === 'right' ? '长方形（特殊的平行四边形）' : '平行四边形';
    say.innerHTML = `拼成了${shape}：底 ${a} + ${b} = ${a + b}，高 4，面积 <b>${(a + b) * 4}</b> 格；每个梯形是它的一半：<b>${(a + b) * 2}</b> 格。`;
  });
  build();
}

/* ---------- 第 6 页：上底滑块（下底 8、高 4 不变） ---------- */
function initMorph() {
  const g = MGrid.paper($('morphFig'), { cols: 12, rows: 6, u: 40 });
  const shape = g.poly([], 'sh-a');
  g.seg([3, 1], [3, 5], 'hgt');
  g.text([3.85, 3.1], 'h = 4', 'mg-t r');
  g.dim([1, 5], [9, 5], 'b = 8', -0.45);
  const top = g.group();
  const set = (a) => {
    shape.setAttribute('d', g.d(a ? [[1, 5], [9, 5], [3 + a, 1], [3, 1]] : [[1, 5], [9, 5], [3, 1]]));
    top.innerHTML = '';
    if (a) g.dim([3, 1], [3 + a, 1], `a = ${a}`, 0.45, top);
    $('morphAv').textContent = a;
    const S = ((a + 8) * 4) / 2;
    const name = a === 0 ? '三角形' : a === 8 ? '平行四边形' : '梯形';
    const out = $('morphCalc');
    out.innerHTML = `${name}：$(${a}+8)\\times4\\div2=${S}$`;
    MathKit.tex(out);
  };
  MathKit.slider($('morphA'), set);
}

/* ---------- 第 8 页：练习三第 2 题（按题目数据等比例画） ---------- */
function initTz3() {
  const svg = $('tz3Fig');
  svg.setAttribute('viewBox', '0 0 900 210');
  const P = (pts, cls = 'pf-sh') => mk('path', { d: `M${pts.map((p) => p.join(' ')).join('L')}Z`, class: cls }, svg);
  const L = (p, q) => mk('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: 'pf-h' }, svg);
  const T = (p, s, cls = 'pf-t') => { mk('text', { x: p[0], y: p[1], class: cls }, svg).textContent = s; };
  const corner = (x, y, sx, sy) => mk('path', { d: `M${x + sx} ${y}V${y + sy}H${x}`, class: 'pf-r' }, svg);
  // ① 上底 4 m、下底 2 m、高 5 m（1 m = 25 px）
  P([[40, 40], [140, 40], [115, 165], [65, 165]]);
  L([90, 40], [90, 165]);
  T([90, 30], '4 m');
  T([90, 190], '2 m');
  T([98, 108], '5 m', 'pf-t r start');
  // ② 上底 4 dm、下底 7 dm、高 8 dm（直角梯形，1 dm = 18 px）
  P([[330, 30], [402, 30], [456, 174], [330, 174]]);
  corner(330, 174, 12, -12);
  T([366, 22], '4 dm');
  T([393, 198], '7 dm');
  T([320, 108], '8 dm', 'pf-t end');
  // ③ 两底 52 cm、27 cm（竖着），高 46 cm（横着，1 cm = 3 px）
  P([[640, 25], [778, 50], [778, 131], [640, 181]]);
  L([640, 50], [778, 50]);
  corner(778, 50, -10, 10);
  T([630, 108], '52 cm', 'pf-t end');
  T([788, 96], '27 cm', 'pf-t start');
  T([709, 72], '46 cm', 'pf-t r');
  T([18, 30], '①');
  T([300, 30], '②');
  T([600, 30], '③');
}

/* ---------- 第 9 页：练习三第 1 题（坐标与课本 p18 方格图一致） ---------- */
function initEq() {
  const g = MGrid.paper($('eqFig'), { cols: 29, rows: 6, u: 36 });
  [
    [[1, 5], [7, 5], [4, 1], [2, 1]],
    [[8, 1], [13, 1], [12, 5], [9, 5]],
    [[15, 1], [19, 1], [18, 5], [15, 5]],
    [[21, 5], [28, 5], [28, 1], [27, 1]],
  ].forEach((t, i) => {
    g.poly(t, 'sh-a');
    g.text([(Math.min(...t.map((p) => p[0])) + Math.max(...t.map((p) => p[0]))) / 2, 5.5], 'ABCD'[i], 'mg-t b');
  });
}

/* ---------- 第 10 页：过中心的直线分平行四边形 ---------- */
// 用一条直线把多边形分成两块：dot(P - O, n) ≥ 0 的一侧和 ≤ 0 的一侧
function split(poly, O, n) {
  const side = (p) => (p[0] - O[0]) * n[0] + (p[1] - O[1]) * n[1];
  const a = [];
  const b = [];
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length];
    const [sp, sq] = [side(p), side(q)];
    if (sp >= 0) a.push(p);
    if (sp <= 0) b.push(p);
    if (sp * sq < 0) {
      const t = sp / (sp - sq);
      const X = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
      a.push(X);
      b.push(X);
    }
  });
  return [a, b];
}
function initCenter() {
  const svg = $('cenFig');
  svg.classList.add('mgrid');
  const PG = [[60, 240], [300, 240], [380, 60], [140, 60]]; // A B C D
  const O = [220, 150];
  const pathOf = (pts) => `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z`;
  const pa = mk('path', { class: 'sh-d' }, svg);
  const pb = mk('path', { class: 'sh-c mg-move' }, svg);
  mk('line', { x1: 60, y1: 240, x2: 380, y2: 60, class: 'cen-dg' }, svg);
  mk('line', { x1: 300, y1: 240, x2: 140, y2: 60, class: 'cen-dg' }, svg);
  const ln = mk('line', { class: 'cut' }, svg);
  mk('circle', { cx: O[0], cy: O[1], r: 5, fill: '#c0392b' }, svg);
  [['A', 44, 262], ['B', 306, 262], ['C', 392, 56], ['D', 124, 56], ['O', 232, 172]].forEach(([s, x, y]) => {
    mk('text', { x, y, class: 'mg-t i' }, svg).textContent = s;
  });
  const one = { u: 1 };
  let turned = false;
  const set = (deg) => {
    const r = (deg * Math.PI) / 180;
    const d = [Math.cos(r), -Math.sin(r)];
    const [a, b] = split(PG, O, [-d[1], d[0]]);
    pa.setAttribute('d', pathOf(a));
    pb.setAttribute('d', pathOf(b));
    Object.entries({ x1: O[0] - d[0] * 300, y1: O[1] - d[1] * 300, x2: O[0] + d[0] * 300, y2: O[1] + d[1] * 300 })
      .forEach(([k, v]) => ln.setAttribute(k, v.toFixed(1)));
    turned = false;
    pb.style.transition = 'none';
    MGrid.pose(pb, one, { c: O });
    $('cenTurn').textContent = '把一部分绕 O 转 180° ▶';
  };
  $('cenTurn').addEventListener('click', () => {
    turned = !turned;
    pb.style.transition = '';
    MGrid.pose(pb, one, turned ? { deg: 180, c: O } : { c: O });
    $('cenTurn').textContent = turned ? '↺ 转回来' : '把一部分绕 O 转 180° ▶';
  });
  MathKit.slider($('cenAng'), set);
}

window.LESSON = {
  init() {
    initEx6();
    initTz();
    initMorph();
    initTz3();
    initEq();
    initCenter();
  },
};
