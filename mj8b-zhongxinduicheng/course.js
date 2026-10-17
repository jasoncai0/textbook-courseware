'use strict';
/* 八下 9.2 中心对称与中心对称图形 · 本课互动：透明纸绕 O 转 180°、拖点看对应点连线被 O 平分、方格纸点格点画对称三角形（判对）、
 * 拖动 O 寻找图形的对称中心（六个图形）、练习图、习题第 1 题五图判断 + 转 180° 动画、两次轴对称 = 中心对称、雪花曲线。
 * 通用部分见 ../shared/math.js、mgeo.js、mcheck.js；对称点一律 A′ = 2O − A，旋转用 Geo.rot（逆时针为正）。 */
const { fmt, slider } = MathKit;
const { add, sub, mul, dist, dir, rot, angle, lerp, centroid } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const HIDE = [99, 99];
const sym = (P, O) => sub(mul(O, 2), P);
const rotAll = (pts, deg, c) => pts.map((p) => rot(p, deg, c));
const lab = (b, p, t, dx, dy, cls) => b.text(p, t, { dx, dy, cls });
const circle = (c, r, n = 64) => Array.from({ length: n }, (_, i) => add(c, mul(dir((360 * i) / n), r)));
const segBtnGroup = (id, cb) => $(id).addEventListener('click', (e) => {
  const btn = e.target.closest('[data-k]');
  if (!btn) return;
  $(id).querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
  cb(btn.dataset.k);
});
/** 0→1 的动画（ms 毫秒），每帧回调进度 */
function animate(ms, onFrame) {
  const t0 = performance.now();
  const tick = (now) => { const k = Math.min(1, (now - t0) / ms); onFrame(k); if (k < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}

/* 图 9-4 的四边形 ABCD 与对称中心 O */
const QUAD = [[-3.3, 0.7], [-4.2, -1.0], [-0.9, -1.0], [-1.5, 1.0]];
const QN = ['A', 'B', 'C', 'D'];
const QOFF = [[-6, -10], [-20, 18], [2, 22], [4, -8]];

/* ---------- 第 3 页：透明纸绕 O 转 180° ---------- */
function initTurn() {
  const O = [0, 0];
  const Q2 = QUAD.map((p) => sym(p, O));
  const s = { t: 0 };
  const b = Geo.board($('turn'), { x: [-4.8, 4.8], y: [-4.6, 4.6], w: 560 });
  b.poly(QUAD, { cls: 'tri-o' });
  b.poly(Q2, { cls: 'sqs' });
  b.poly(() => rotAll(QUAD, s.t, O), { cls: 'shp-r' });
  b.pt(O);
  lab(b, O, 'O', -8, -12);
  QUAD.forEach((p, i) => lab(b, p, QN[i], ...QOFF[i]));
  Q2.forEach((p, i) => lab(b, p, `${QN[i]}′`, -QOFF[i][0] - 10, -QOFF[i][1] + 10));
  b.onUpdate = () => {
    $('turnTV').textContent = `${s.t}°`;
    const msg = $('turnMsg');
    const done = s.t === 180;
    msg.className = `tip feedback ${done ? 'fb-ok' : ''}`;
    msg.textContent = done
      ? '转了 180°：透明纸上的四边形 ABCD 与四边形 A′B′C′D′ 完全重合！'
      : `转了 ${s.t}°，还没有与四边形 A′B′C′D′ 重合。`;
  };
  slider($('turnT'), (v) => { s.t = v; b.update(); });
}

/* ---------- 第 4 页：对应点连线经过 O 且被 O 平分 ---------- */
function initPair() {
  const s = { O: [0, 0], A: [...QUAD[0]], all: false };
  const Q = () => [s.A, ...QUAD.slice(1)];
  const Q2 = () => Q().map((p) => sym(p, s.O));
  const b = Geo.board($('pair'), { x: [-4.8, 4.8], y: [-4.2, 4.2], w: 560 });
  b.poly(Q, { cls: 'tri-o' });
  b.poly(Q2, { cls: 'tri-r' });
  [0, 1, 2, 3].forEach((i) => b.seg(() => (i === 0 || s.all ? [Q()[i], Q2()[i]] : [HIDE, HIDE]), { cls: i ? 'gdash' : 'gs hl' }));
  b.pt(() => s.O, { cls: 'ctr-p' });
  QN.forEach((n, i) => {
    if (i) lab(b, Q()[i], n, ...QOFF[i]);
    lab(b, () => Q2()[i], `${n}′`, -QOFF[i][0] - 10, -QOFF[i][1] + 10, 'lb r');
  });
  lab(b, () => s.A, 'A', -24, -10);
  lab(b, () => s.O, 'O', 10, 22);
  b.drag(() => s.O, (x, y) => { s.O = [clamp(x, -0.8, 0.8), clamp(y, -0.8, 0.8)]; });
  b.drag(() => s.A, (x, y) => { s.A = [clamp(x, -4, -2.4), clamp(y, -0.2, 2.6)]; });
  b.onUpdate = () => {
    const A2 = Q2()[0];
    $('pOA').textContent = fmt(dist(s.O, s.A));
    $('pOA2').textContent = fmt(dist(s.O, A2));
    $('pAng').textContent = `${Math.round(angle(s.O, s.A, A2))}°`;
  };
  $('pairAll').addEventListener('click', () => { s.all = !s.all; $('pairAll').classList.toggle('solid', s.all); b.update(); });
  b.update();
}

/* ---------- 第 5 页：方格纸上点格点，画 △ABC 关于 O 对称的三角形 ---------- */
function initGrid() {
  const T = [[3, 8], [2, 2], [5, 5]];
  const O = [7, 5];
  const G = T.map((p) => sym(p, O));
  const NM = ['A', 'B', 'C'];
  const s = { n: 0, help: false };
  const b = Geo.board($('grid'), { x: [-0.5, 14.5], y: [-0.5, 10.5], w: 600, grid: true, ticks: 1 });
  b.poly(T, { cls: 'tri-o' });
  b.poly(() => (s.n === 3 ? G : [HIDE, HIDE, HIDE]), { cls: 'tri-r' });
  [0, 1].forEach((i) => b.seg(() => (s.n > i + 1 ? [G[i], G[i + 1]] : [HIDE, HIDE]), { cls: 'gs r' }));
  T.forEach((p, i) => b.seg(() => (s.help ? [p, G[i]] : [HIDE, HIDE]), { cls: 'gdash' }));
  b.pt(O, { cls: 'ctr-p' });
  lab(b, O, 'O', 8, -8);
  T.forEach((p, i) => lab(b, p, NM[i], -18, -6));
  G.forEach((p, i) => { b.pt(p, { cls: 'c2', show: () => s.n > i }); lab(b, () => (s.n > i ? p : null), `${NM[i]}′`, 8, -8, 'lb r'); });
  const msg = $('gridMsg');
  const say = (t, cls = '') => { msg.className = `tip feedback ${cls}`; msg.textContent = t; };
  const steps = (P, Q) => { const d = sub(Q, P); return `${d[0] >= 0 ? '右' : '左'} ${Math.abs(d[0])} 格、${d[1] >= 0 ? '上' : '下'} ${Math.abs(d[1])} 格`; };
  const next = () => { $('gridNext').textContent = s.n < 3 ? `${NM[s.n]}′` : '（已完成）'; };
  for (let x = 0; x <= 14; x++) {
    for (let y = 0; y <= 10; y++) {
      const c = b.pt([x, y], { cls: 'gpt', r: 11 });
      c.addEventListener('click', () => {
        if (s.n >= 3) return;
        const i = s.n;
        if (x === G[i][0] && y === G[i][1]) {
          s.n += 1;
          say(s.n === 3 ? '全部画对了！△A′B′C′ 与 △ABC 关于点 O 对称：每对对应点的连线都经过 O，且被 O 平分。' : `${NM[i]}′ 放对了！从 ${NM[i]} 到 O 是“${steps(T[i], O)}”，从 O 再走同样的格数就到 ${NM[i]}′。`, 'fb-ok');
        } else {
          const m = lerp(T[i], [x, y], 0.5);
          say(`O 应是 ${NM[i]}${NM[i]}′ 的中点，而 ${NM[i]} 与这个点的中点在 (${fmt(m[0])}, ${fmt(m[1])})。从 ${NM[i]} 到 O 是“${steps(T[i], O)}”，再从 O 走同样的格数试试。`, 'fb-warn');
        }
        next();
        b.update();
      });
    }
  }
  say('先放 A′：它在直线 AO 上，并且 OA′ = OA。');
  $('gridHelp').addEventListener('click', () => { s.help = !s.help; $('gridHelp').classList.toggle('solid', s.help); b.update(); });
  $('gridReset').addEventListener('click', () => { s.n = 0; next(); say('先放 A′：它在直线 AO 上，并且 OA′ = OA。'); b.update(); });
  b.update();
}

/* ---------- 图形库（以对称中心或重心为原点） ---------- */
const BLADE = [[0.35, 0.22], [1.2, 0.62], [2.3, 0.62], [3.0, 0.22], [2.75, -0.2], [1.4, -0.3], [0.35, -0.22]];
const BOLT = (() => { const h = [[-0.9, 2.4], [1.3, 2.4], [0.3, 0.5], [1.4, 0.5]]; return [...h, ...h.map((p) => mul(p, -1))]; })();
const STAR = Array.from({ length: 10 }, (_, i) => mul(dir(90 + 36 * i), i % 2 ? 0.92 : 2.4));
const SHAPES = [
  { name: '螺旋桨', polys: [BLADE, BLADE.map((p) => mul(p, -1)), circle([0, 0], 0.42, 40)], sym: true },
  { name: '闪电', polys: [BOLT], sym: true },
  { name: '平行四边形', polys: [[[-2.3, -1.2], [1.1, -1.2], [2.3, 1.2], [-1.1, 1.2]]], sym: true },
  { name: '正六边形', polys: [Array.from({ length: 6 }, (_, i) => mul(dir(60 * i), 2.1))], sym: true },
  { name: '等边三角形', polys: [[90, 210, 330].map((a) => mul(dir(a), 2.3))], sym: false },
  { name: '五角星', polys: [STAR], sym: false },
];

/* ---------- 第 6 页：拖 O 找对称中心 ---------- */
function initFind() {
  const C = [0.7, 0.2];
  const s = { k: 0, O: [-3, -2.6] };
  const cur = () => SHAPES[s.k];
  const MAXP = 3;
  const polys = () => cur().polys.map((pl) => pl.map((p) => add(p, C)));
  const hit = () => cur().sym && dist(s.O, C) < 1e-9;
  const b = Geo.board($('find'), { x: [-4.6, 4.6], y: [-4, 4], w: 560 });
  const shp = Array.from({ length: MAXP }, (_, i) => b.poly(() => polys()[i] || [HIDE, HIDE, HIDE], { cls: 'shp' }));
  Array.from({ length: MAXP }, (_, i) => b.poly(() => (polys()[i] || [HIDE, HIDE, HIDE]).map((p) => sym(p, s.O)), { cls: 'shp-r' }));
  lab(b, () => s.O, 'O', 12, 24);
  b.drag(() => s.O, (x, y) => {
    const p = [clamp(x, -4.2, 4.2), clamp(y, -3.6, 3.6)];
    s.O = cur().sym && dist(p, C) < 0.35 ? [...C] : p;
  });
  b.onUpdate = () => {
    shp.forEach((p) => p.classList.toggle('ok', hit()));
    const msg = $('findMsg');
    msg.className = `tip feedback ${hit() ? 'fb-ok' : ''}`;
    msg.textContent = hit()
      ? `重合了！${cur().name}绕这个点旋转 180° 后与自身重合，它是中心对称图形，这个点就是对称中心。`
      : `${cur().name}：虚线（转 180° 后的图形）与原图形还没有重合，继续拖动 O。`;
  };
  segBtnGroup('findBtns', (k) => { s.k = +k; s.O = [-3, -2.6]; b.update(); });
  $('findGive').addEventListener('click', () => {
    s.O = [...C];
    b.update();
    if (!cur().sym) {
      const msg = $('findMsg');
      msg.className = 'tip feedback fb-warn';
      msg.textContent = `把 O 放在${cur().name}的正中心，转 180° 后仍不重合（尖角朝向反了）；放在别处更不行。所以${cur().name}不是中心对称图形——但它是轴对称图形。`;
    }
  });
  b.update();
}

/* ---------- 第 8 页：练习 1、3 的图 ---------- */
function initEx() {
  const A = [2.6, 3.2]; const B = [0, 0]; const C = [3, 0];
  const O = lerp(A, C, 0.5);
  const B2 = sym(B, O);
  const s = { show: false };
  const b = Geo.board($('ex1'), { x: [-0.6, 6.4], y: [-0.7, 3.9], w: 340 });
  b.poly([A, B, C], { cls: 'tri-o' });
  b.poly(() => (s.show ? [C, B2, A] : [HIDE, HIDE, HIDE]), { cls: 'tri-r' });
  b.seg(() => (s.show ? [B, B2] : [HIDE, HIDE]), { cls: 'gdash' });
  b.pt(O, { cls: 'ctr-p' });
  [['A', A, -6, -8], ['B', B, -18, 16], ['C', C, 4, 20], ['O', O, 8, 4]].forEach(([n, p, dx, dy]) => lab(b, p, n, dx, dy));
  lab(b, () => (s.show ? B2 : null), 'B′', 8, -4, 'lb r');
  lab(b, () => (s.show ? A : null), '(C′)', 10, -8, 'lb r sm');
  lab(b, () => (s.show ? C : null), '(A′)', 14, 6, 'lb r sm');
  b.update();
  $('ex1Show').addEventListener('click', () => { s.show = true; b.update(); });
  $('ex1Show').closest('.hint-ladder').addEventListener('toggle', () => b.update(), true);

  const H = 2; const c = 0.6;
  const cross = [[-H + c, -H], [H - c, -H], [H - c, -H + c], [H, -H + c], [H, H - c], [H - c, H - c], [H - c, H], [-H + c, H], [-H + c, H - c], [-H, H - c], [-H, -H + c], [-H + c, -H + c]];
  const e3 = Geo.board($('ex3'), { x: [-2.6, 2.6], y: [-2.4, 2.4], w: 300 });
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sy]) => e3.poly([[sx * H, sy * H], [sx * (H - c), sy * H], [sx * (H - c), sy * (H - c)], [sx * H, sy * (H - c)]], { cls: 'tri-ghost' }));
  e3.poly(cross, { cls: 'shp' });
  e3.seg([[-H, -H], [H, H]], { cls: 'gdash' });
  e3.seg([[-H, H], [H, -H]], { cls: 'gdash' });
  e3.pt([0, 0], { cls: 'ctr-p' });
  lab(e3, [0, 0], 'O', 8, 20);
  e3.update();
}

/* ---------- 第 9 页：习题 9.2 第 1 题五个图形 ---------- */
function lens(d, len, w) {
  const u = dir(d); const n = dir(d + 90);
  const side = (sg) => Array.from({ length: 21 }, (_, i) => { const t = i / 20; return add(mul(u, len * t), mul(n, sg * w * Math.sin(Math.PI * t))); });
  return [...side(1), ...side(-1).reverse()];
}
function halfDisk(d, r) {
  // 直径从中心沿方向 d 长 2r，半圆鼓向顺时针一侧
  const c = mul(dir(d), r);
  return [[0, 0], ...Array.from({ length: 31 }, (_, i) => add(c, mul(dir(d - 180 * (i / 30)), r))).reverse()];
}
const FIVE = [
  { polys: [45, 135, 225, 315].map((d) => ({ pts: lens(d, 2.3, 0.75), cls: 'shp' })), axes: [0, 45, 90, 135] },
  { polys: [...[90, 150, 210, 270, 330, 30].map((d) => ({ pts: circle(mul(dir(d), 1.45), 0.62, 40), cls: 'shp5' })), { pts: circle([0, 0], 1.5), cls: 'shp5' }], axes: [0, 30, 60, 90, 120, 150] },
  { polys: [{ pts: circle([0, 0], 2.1), cls: 'shp' }, { pts: [[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]], cls: 'shp-w' }], axes: [0, 45, 90, 135] },
  { polys: [90, 180, 270, 0].map((d) => ({ pts: halfDisk(d, 1.05), cls: 'shp' })), axes: [] },
  { polys: [...[0, 90, 180, 270].map((d) => ({ pts: rotAll([[-2, 2.1], [1.2, 2.1], [-0.45, 1.05]], d, [0, 0]), cls: 'shp' })), { pts: rotAll([[-0.85, -0.85], [0.85, -0.85], [0.85, 0.85], [-0.85, 0.85]], 25, [0, 0]), cls: 'shp' }], axes: [] },
];
function initFive() {
  const s = { t: 0, draw: false };
  const boards = FIVE.map((f, i) => {
    const b = Geo.board($(`f${i + 1}`), { x: [-2.7, 2.7], y: [-2.6, 2.6], w: 240 });
    f.polys.forEach((p) => b.poly(() => rotAll(p.pts, s.t, [0, 0]), { cls: p.cls }));
    f.axes.forEach((d) => b.seg(() => (s.draw ? [mul(dir(d), 2.65), mul(dir(d), -2.65)] : [HIDE, HIDE]), { cls: 'ax-l' }));
    b.pt([0, 0], { cls: 'ctr-p', show: () => s.draw, r: 4 });
    return b;
  });
  const all = () => boards.forEach((b) => b.update());
  all();
  $('fiveDraw').addEventListener('click', () => { s.draw = !s.draw; all(); });
  $('fiveRot').addEventListener('click', () => animate(1500, (k) => { s.t = k < 1 ? 180 * k : 0; all(); }));
}

/* ---------- 第 10 页：两次轴对称（习题 5） ---------- */
function initTwo() {
  const O = [0, 0];
  const s = { A: [2.2, 1.4] };
  const A1 = () => [s.A[0], -s.A[1]];
  const A2 = () => [-s.A[0], s.A[1]];
  const sg = (v) => (v < 0 ? -1 : 1);
  const b = Geo.board($('two'), { x: [-4.2, 4.2], y: [-3.3, 3.3], w: 560 });
  Geo.line(b, [-1, 0], [1, 0], { cls: 'gl thin-l' });
  Geo.line(b, [0, -1], [0, 1], { cls: 'gl thin-l' });
  Geo.right(b, O, [1, 0], [0, 1], { s: 0.25 });
  b.seg(() => [s.A, A1()], { cls: 'gdash' });
  b.seg(() => [s.A, A2()], { cls: 'gdash' });
  b.seg(() => [O, s.A], { cls: 'gs' });
  b.seg(() => [A1(), A2()], { cls: 'gs hl' });
  Geo.arc(b, O, () => [sg(s.A[0]), 0], () => s.A, { r: 0.55, label: '1' });
  Geo.arc(b, O, () => [0, sg(s.A[1])], () => s.A, { r: 0.75, label: '2', lr: 1.6 });
  b.pt(A1, { cls: 'c2' }); b.pt(A2, { cls: 'c2' });
  lab(b, [3.9, 0], 'l₁', -10, -8); lab(b, [0, 3.1], 'l₂', 8, 8);
  lab(b, O, 'O', -22, 22);
  lab(b, () => s.A, 'A', 12, -8);
  lab(b, A1, 'A₁', 10, 18, 'lb r'); lab(b, A2, 'A₂', -26, -6, 'lb r');
  b.drag(() => s.A, (x, y) => {
    const fx = clamp(x, -3.8, 3.8); const fy = clamp(y, -2.9, 2.9);
    s.A = [Math.abs(fx) < 0.4 ? 0.4 * sg(fx) : fx, Math.abs(fy) < 0.4 ? 0.4 * sg(fy) : fy];
  });
  b.onUpdate = () => {
    $('tOA1').textContent = fmt(dist(O, A1()));
    $('tOA2').textContent = fmt(dist(O, A2()));
    $('tAng').textContent = `${Math.round(angle(O, A1(), A2()))}°`;
  };
  b.update();
}

/* ---------- 第 11 页：雪花曲线 ---------- */
function koch(n) {
  let pts = [90, 210, 330].map((a) => mul(dir(a), 2.3)); // 逆时针排列，外侧在每条边的右边
  for (let k = 0; k < n; k++) {
    const out = [];
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      const a = lerp(p, q, 1 / 3);
      const c = lerp(p, q, 2 / 3);
      out.push(p, a, add(a, rot(sub(c, a), -60)), c);
    });
    pts = out;
  }
  return pts;
}
function initKoch() {
  const s = { n: 0, t: 0 };
  const b = Geo.board($('koch'), { x: [-2.7, 2.7], y: [-2.6, 2.6], w: 500 });
  b.poly(() => koch(s.n), { cls: 'koch' });
  b.poly(() => (s.t ? rotAll(koch(s.n), s.t, [0, 0]) : [HIDE, HIDE, HIDE]), { cls: 'koch-r' });
  b.pt([0, 0], { cls: 'ctr-p', r: 3 });
  b.onUpdate = () => {
    $('kochNV').textContent = s.n;
    $('kochE').textContent = 3 * 4 ** s.n;
    $('kochP').textContent = s.n ? `${4 ** s.n}/${3 ** s.n}` : '1';
  };
  slider($('kochN'), (v) => { s.n = v; b.update(); });
  $('kochRot').addEventListener('click', () => animate(1400, (k) => { s.t = 180 * k; b.update(); }));
}

window.LESSON = {
  init() {
    initTurn();
    initPair();
    initGrid();
    initFind();
    initEx();
    initFive();
    initTwo();
    initKoch();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
