'use strict';
/* 九上 1.4 用一元二次方程解决问题 · 本课互动：利润柱形图、缉私艇追及（图 1-4）、矩形中的动点（图 1-5）。
 * 图形均按题目数据精确绘制：柱高与利润成正比；船的位置 = 速度 × 时间；动点位置 AP = x、BQ = 2x。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* 第 4 页：利润柱形图（增长率 20%） */
function initBars() {
  const vals = [2500, 3000, 3600];
  const months = ['6 月', '7 月', '8 月'];
  const b = board($('bars'), { x: [0, 9], y: [-700, 4300], w: 480, h: 300, axes: false, grid: false });
  b.seg([[0.3, 0], [8.7, 0]], { cls: 'base' });
  vals.forEach((v, i) => {
    const cx = 1.5 + 3 * i;
    b.poly([[cx - 0.8, 0], [cx + 0.8, 0], [cx + 0.8, v], [cx - 0.8, v]], { cls: `bar b${i}` });
    b.text([cx, v], v.toLocaleString('en').replace(',', ' '), { cls: 'lb up c', dy: -8 });
    b.text([cx, 0], months[i], { cls: 'lb up c', dy: 26 });
    if (i) b.text([cx - 1.5, (vals[i - 1] + v) / 2 + 300], '×1.2', { cls: 'lb up c x12', dy: 0 });
  });
}

/* 第 9 页：缉私艇（图 1-4）。C(0,0)，A(0,30)；船 S(60t, 30)；艇沿 CB 方向（东 4 : 北 3）以 75 km/h 航行 */
const MEET = 40; // 分钟
function initShip() {
  const s = { m: 20 };
  const t = () => Math.min(s.m, MEET) / 60;
  const b = board($('ship'), { x: [-9, 52], y: [-5, 37], axes: false, grid: false, w: 560 });
  const C = [0, 0];
  const A = [0, 30];
  const B = [40, 30];
  const ship = () => [60 * t(), 30];
  const boat = () => [60 * t(), 45 * t()];
  b.seg([A, [50, 30]], { cls: 'dash' });
  b.seg([C, [44, 33]], { cls: 'dash' });
  b.seg([C, A], { cls: 'thin' });
  b.seg(() => [A, ship()], { cls: 'c2' });
  b.seg(() => [C, boat()], { cls: 'c1' });
  b.seg(() => [ship(), boat()], { cls: 'dotv' });
  b.seg([[48, 22], [48, 31]], { cls: 'north' });
  b.poly([[48, 33], [47.2, 30.6], [48.8, 30.6]], { cls: 'north-h' });
  b.text([48, 33], '北', { cls: 'lb up c', dy: -8 });
  b.pt(C); b.pt(A); b.pt(B, { hollow: true });
  b.pt(ship, { cls: 'c2', r: 8 });
  b.pt(boat, { r: 8 });
  b.text(C, 'C', { dx: -22, dy: 8 });
  b.text(A, 'A', { dx: -22, dy: 0 });
  b.text(B, 'B', { dx: 4, dy: -12 });
  b.text([0, 15], '30', { cls: 'lb up', dx: -30, dy: 6 });
  b.text(() => [30 * t(), 30], () => `60t = ${fmt(60 * t())}`, { cls: 'lb up c sm o', dy: -12 });
  b.text(() => [30 * t(), 22.5 * t()], () => `75t = ${fmt(75 * t())}`, { cls: 'lb up c sm b', dx: 46, dy: 14 });
  slider($('shipT'), (v) => { s.m = v; b.update(); });
  b.onUpdate = () => {
    $('shipTV').textContent = s.m;
    const T = t();
    const msg = $('shipMsg');
    const met = s.m >= MEET;
    msg.className = `tip feedback ${met ? 'fb-ok' : ''}`;
    msg.innerHTML = met
      ? `$t=\\frac23$ h：$AB=40$，$BC=50$，$40^2+30^2=50^2$，在 $B$ 处拦截！`
      : `$t=${fmt(T, 3)}$ h：船距 $A$ ${fmt(60 * T)} km，艇距 $C$ ${fmt(75 * T)} km，艇在船的正南方 ${fmt(30 - 45 * T)} km 处。`;
    tex(msg);
  };
  b.update();
}

/* 第 10 页：矩形 ABCD 中的动点（图 1-5）。A(0,0) B(6,0) C(6,12) D(0,12)；P(x,0)，Q(6,2x) */
const T_MAX = 6;
const TARGET = 28;
function initDP() {
  const s = { x: 1, playing: false };
  const A = [0, 0];
  const B = [6, 0];
  const C = [6, 12];
  const D = [0, 12];
  const P = () => [s.x, 0];
  const Q = () => [6, 2 * s.x];
  const b = board($('dp'), { x: [-1.4, 7.6], y: [-1.6, 13.4], axes: false, grid: false, w: 420 });
  b.poly([A, B, C, D], { cls: 'rectg' });
  b.poly(() => [D, A, P()], { cls: 'cor c-a' });
  b.poly(() => [P(), B, Q()], { cls: 'cor c-b' });
  b.poly(() => [Q(), C, D], { cls: 'cor c-c' });
  b.poly(() => [D, P(), Q()], { cls: 'tri-dpq' });
  b.pt(P, { cls: 'c2', r: 7 }); b.pt(Q, { cls: 'c2', r: 7 });
  [[A, 'A', -22, 20], [B, 'B', 8, 20], [C, 'C', 8, -4], [D, 'D', -22, -4]].forEach(([p, n, dx, dy]) => b.text(p, n, { dx, dy }));
  b.text(() => P(), 'P', { dx: -6, dy: 26 });
  b.text(() => Q(), 'Q', { dx: 10, dy: 6 });
  b.text([3, 12], '6', { cls: 'lb up c', dy: -8 });
  b.text([0, 6], '12', { cls: 'lb up', dx: -30, dy: 6 });
  const S = () => {
    const x = s.x;
    const s1 = 6 * x;
    const s2 = x * (6 - x);
    const s3 = 3 * (12 - 2 * x);
    return { s1, s2, s3, S: 72 - s1 - s2 - s3 };
  };
  b.onUpdate = () => {
    const v = S();
    $('dpTV').textContent = fmt(s.x, 1);
    $('dpS1').textContent = fmt(v.s1);
    $('dpS2').textContent = fmt(v.s2);
    $('dpS3').textContent = fmt(v.s3);
    $('dpS').textContent = fmt(v.S);
    const hit = Math.abs(v.S - TARGET) < 1e-6;
    const msg = $('dpMsg');
    msg.className = `tip feedback ${hit ? 'fb-ok' : ''}`;
    msg.innerHTML = hit
      ? `$x=${fmt(s.x)}$ s：$S_{\\triangle DPQ}=28$！`
      : `$AP=${fmt(s.x)}$，$PB=${fmt(6 - s.x)}$，$BQ=${fmt(2 * s.x)}$，$QC=${fmt(12 - 2 * s.x)}$（cm）`;
    tex(msg);
  };
  const set = (v) => { s.x = Math.round(v * 10) / 10; $('dpT').value = s.x; b.update(); };
  slider($('dpT'), (v) => { s.x = v; b.update(); });
  let raf = 0;
  const stop = () => { s.playing = false; cancelAnimationFrame(raf); $('dpPlay').textContent = '▶ 播放'; };
  $('dpPlay').addEventListener('click', () => {
    if (s.playing) { stop(); return; }
    if (s.x >= T_MAX) set(0);
    s.playing = true;
    $('dpPlay').textContent = '⏸ 暂停';
    let last = performance.now();
    let x = s.x;
    const tick = (now) => {
      x = Math.min(T_MAX, x + (now - last) / 1000); // 1 秒走 1 秒：与题目的速度一致
      last = now;
      set(x);
      if (x < T_MAX && s.playing) raf = requestAnimationFrame(tick); else stop();
    };
    raf = requestAnimationFrame(tick);
  });
}

window.LESSON = {
  init() {
    initBars();
    initShip();
    initDP();
  },
};
