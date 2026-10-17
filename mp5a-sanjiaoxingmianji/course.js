'use strict';
/* 五上 三角形的面积 · 本课互动：例 4 看成平行四边形的一半、例 5 复制旋转拼成平行四边形（核心）、
 * 练一练按数据等比例作图、练习二第 7 题、刘徽“以盈补虚”。方格纸与“剪—移—拼”见 ../shared/mgrid.js */
const $ = (id) => document.getElementById(id);
const { mk } = MGrid;
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

/* ---------- 第 3 页：例 4（坐标与课本 p9 方格图一致） ---------- */
const EX4 = [
  { tri: [[5, 1], [5, 5], [9, 5]], par: [[1, 1], [5, 1], [9, 5], [5, 5]] },      // 底 4 高 4
  { tri: [[15, 1], [12, 6], [16, 6]], par: [[11, 1], [15, 1], [16, 6], [12, 6]] }, // 底 4 高 5
  { tri: [[20, 2], [28, 2], [26, 5]], par: [[18, 5], [26, 5], [28, 2], [20, 2]] }, // 底 8 高 3
];
function initEx4() {
  const g = MGrid.paper($('ex4Fig'), { cols: 29, rows: 7, u: 36 });
  const halves = g.group('fade hide');
  EX4.forEach(({ tri, par }) => {
    g.poly(par, 'sh-out', halves);
    g.poly(tri, 'sh-a');
  });
  let on = false;
  $('ex4Par').addEventListener('click', () => {
    on = !on;
    halves.classList.toggle('hide', !on);
    $('ex4Par').classList.toggle('solid', on);
  });
}

/* ---------- 第 4 页：例 5 两个完全一样的三角形拼平行四边形（核心） ---------- */
const TRI = {
  acute: { A: [5, 5], B: [11, 5], C: [7, 1], name: '锐角三角形' },  // 底 6 高 4
  right: { A: [5, 5], B: [10, 5], C: [5, 1], name: '直角三角形' },  // 底 5 高 4
  obtuse: { A: [5, 5], B: [9, 5], C: [11, 1], name: '钝角三角形' }, // 底 4 高 4，高在外面
};
function initPin() {
  const g = MGrid.paper($('pinFig'), { cols: 16, rows: 6, u: 44 });
  const st = { k: 'acute', s: 'r', phase: 0 };
  const layer = g.group();
  let copy = null;
  let par = null;
  const say = $('triSay');
  const pivot = () => {
    const { A, B, C } = TRI[st.k];
    return st.s === 'r' ? mid(B, C) : mid(A, C);
  };
  const build = () => {
    const { A, B, C } = TRI[st.k];
    layer.innerHTML = '';
    st.phase = 0;
    const foot = [C[0], 5];
    if (foot[0] > B[0]) g.seg(B, foot, 'hgt', layer);           // 钝角：延长底边
    g.poly([A, B, C], 'sh-a', layer);
    g.seg(C, foot, 'hgt', layer);
    g.poly([[foot[0], 4.7], [foot[0] + (foot[0] > B[0] ? -0.3 : 0.3), 4.7], [foot[0] + (foot[0] > B[0] ? -0.3 : 0.3), 5]], 'sh-out', layer);
    g.dim(A, B, `底 ${B[0] - A[0]}`, -0.45, layer);
    const M = pivot();
    // 旋转 180° 后：A、B、C 绕 M 的像；拼成的平行四边形四个顶点
    const img = [A, B, C].map((p) => MGrid.rot(p, M, 180).map((v) => Math.round(v * 1e6) / 1e6));
    par = g.poly(st.s === 'r' ? [A, B, img[0], C] : [A, B, C, img[1]], 'sh-out fade hide', layer);
    copy = g.poly([A, B, C], 'sh-c mg-move fade hide', layer);
    MGrid.pose(copy, g, { dx: 0.35, dy: -0.35, c: M });
    g.text(M, '●', 'mg-t r pivot', layer);
    $('triTurn').disabled = true;
    $('triCopy').disabled = false;
    say.textContent = '先点“复制一个”。';
  };
  const choose = (box, key, attr) => box.addEventListener('click', (e) => {
    const btn = e.target.closest(`[data-${attr}]`);
    if (!btn) return;
    st[key] = btn.dataset[attr];
    box.querySelectorAll('.btn').forEach((b) => b.classList.toggle('solid', b === btn));
    build();
  });
  choose($('triKind'), 'k', 'k');
  choose($('triSide'), 's', 's');
  $('triCopy').addEventListener('click', () => {
    copy.classList.remove('hide');
    $('triCopy').disabled = true;
    $('triTurn').disabled = false;
    say.innerHTML = `复制了一个<b>完全一样</b>的${TRI[st.k].name}。红点是${st.s === 'r' ? '右' : '左'}边的中点。`;
  });
  $('triTurn').addEventListener('click', () => {
    const { A, B } = TRI[st.k];
    const a = B[0] - A[0];
    MGrid.pose(copy, g, { deg: 180, c: pivot() });
    setTimeout(() => par.classList.remove('hide'), 1000);
    $('triTurn').disabled = true;
    say.innerHTML = `拼成了平行四边形：底 ${a}、高 4，面积 ${a} × 4 = <b>${a * 4}</b> 格；每个三角形是它的一半：<b>${a * 2}</b> 格。`;
  });
  build();
}

/* ---------- 第 8 页：练一练 2（按题目数据等比例画） ---------- */
function initTri3() {
  const svg = $('tri3Fig');
  svg.setAttribute('viewBox', '0 0 900 200');
  const P = (pts, cls = 'pf-sh') => mk('path', { d: `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z`, class: cls }, svg);
  const L = (p, q, cls = 'pf-h') => mk('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: cls }, svg);
  const T = (p, s, cls = 'pf-t') => { mk('text', { x: p[0], y: p[1], class: cls }, svg).textContent = s; };
  const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
  const dir = (deg) => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
  // 直角记号：在顶点 R，沿两条垂直方向 u、v
  const corner = (R, u, v, s = 11) => mk('path', { d: `M${add(R, u, s).join(' ')}L${add(add(R, u, s), v, s).join(' ')}L${add(R, v, s).join(' ')}`, class: 'pf-r' }, svg);
  // ① 底 8 cm、高 5 cm（直角在右下，1 cm = 18 px）
  P([[40, 175], [184, 175], [184, 85]]);
  corner([184, 175], [-1, 0], [0, -1]);
  T([112, 198], '8 cm');
  T([192, 136], '5 cm', 'pf-t start');
  // ② 直角三角形，两条直角边 3 dm、4 dm（1 dm = 30 px），斜放
  const R = [375, 45];
  const u = dir(110);
  const v = dir(20);
  P([R, add(R, u, 90), add(R, v, 120)]);
  corner(R, u, v);
  T(add(add(R, u, 45), [-1, 0], 22), '3 dm', 'pf-t end');
  T(add(add(R, v, 60), [0.3, -1], 16), '4 dm');
  // ③ 一条边 45 m，这条边上的高 16 m（1 m = 4 px）
  const S1 = [600, 30];
  const w = dir(32);
  const S2 = add(S1, w, 180);
  const F = add(S1, w, 70);
  const n = [-w[1], w[0]];
  const V = add(F, n, 64);
  P([S1, S2, V]);
  L(V, F);
  corner(F, [-w[0], -w[1]], n, 9);
  T(add(mid(S1, S2), [w[1], -w[0]], 18), '45 m');
  T(add(mid(V, F), [-1, 0], 20), '16 m', 'pf-t r end');
  T([110, 25], '①');
  T([330, 25], '②');
  T([570, 25], '③');
}

/* ---------- 第 9 页：练习二第 7 题（坐标与课本 p12 方格图一致） ---------- */
function initHalf() {
  const g = MGrid.paper($('halfFig'), { cols: 26, rows: 6, u: 36 });
  g.poly([[1, 5], [4, 5], [5, 1], [2, 1]], 'sh-d');
  [[[6, 5], [9, 5], [8, 1]], [[11, 5], [15, 5], [11, 1]], [[17, 5], [19, 5], [18, 1]], [[21, 5], [25, 5], [22, 2]]]
    .forEach((t, i) => {
      g.poly(t, 'sh-a');
      g.text([(t[0][0] + t[1][0]) / 2, 5.5], 'ABCD'[i], 'mg-t b');
    });
}

/* ---------- 第 10 页：以盈补虚 ---------- */
function initYing() {
  const svg = $('yingFig');
  svg.classList.add('mgrid');
  const one = { u: 1 };
  const P = (pts, cls) => mk('path', { d: `M${pts.map((p) => p.join(' ')).join('L')}Z`, class: cls }, svg);
  const T = (p, s, cls = 'yt') => { mk('text', { x: p[0], y: p[1], class: cls }, svg).textContent = s; };
  // 三角形：底（广）320，高（从）240；长方形宽 = 半广 160
  P([[120, 30], [280, 30], [280, 270], [120, 270]], 'sh-ghost');
  P([[120, 270], [280, 270], [280, 150], [200, 30], [120, 150]], 'sh-d');
  T([150, 70], '虚', 'yt xu');
  T([250, 70], '虚', 'yt xu');
  const left = P([[40, 270], [120, 270], [120, 150]], 'sh-c mg-move');
  const right = P([[360, 270], [280, 270], [280, 150]], 'sh-c mg-move');
  T([200, 296], '广（底）');
  T([200, 22], '半广');
  T([302, 150], '从', 'yt start');
  const lbL = mk('text', { x: 95, y: 255, class: 'yt ying' }, svg);
  lbL.textContent = '盈';
  const lbR = mk('text', { x: 305, y: 255, class: 'yt ying' }, svg);
  lbR.textContent = '盈';
  let moved = false;
  $('yingGo').addEventListener('click', () => {
    moved = !moved;
    // 两块“盈”各绕三角形腰的中点 (120,150)、(280,150) 旋转 180°，正好落在“虚”的位置
    MGrid.pose(left, one, moved ? { deg: 180, c: [120, 150] } : { c: [120, 150] });
    MGrid.pose(right, one, moved ? { deg: -180, c: [280, 150] } : { c: [280, 150] });
    [lbL, lbR].forEach((e) => e.classList.toggle('gone', moved));
    $('yingGo').textContent = moved ? '↺ 还原' : '以盈补虚 ▶';
  });
}

window.LESSON = {
  init() {
    initEx4();
    initPin();
    initTri3();
    initHalf();
    initYing();
  },
};
