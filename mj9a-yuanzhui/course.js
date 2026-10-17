'use strict';
/* 九上 2.8 圆锥的侧面积 · 本课互动：立体圆锥（拖 r、h，母线绕一周）、扇形纸片卷成圆锥（等距映射，卷的过程中纸片不伸缩）、
 * 展开扇形的真实形状与读数。通用部分见 ../shared/math.js、mgeo.js、mcheck.js。
 * 立体图投影：X = x，Y = 0.94z + 0.34y（从前上方看）；所有长度由坐标计算。 */
const { fmt, slider } = MathKit;
const { add, mul } = Geo;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const dirv = (d) => [Math.cos(d * RAD), Math.sin(d * RAD)];
const onC = (O, r, d) => add(O, mul(dirv(d), r));
const KZ = 0.94;
const KY = 0.34;
const prj = ([x, y, z]) => [x, KZ * z + KY * y];

/** 在作图板上画立体圆锥：g() 返回 { r, h, a }（a 为母线端点 A 的方位角，度）；opt.labels 额外标注 */
function drawCone(b, g, opt = {}) {
  const S = () => prj([0, 0, g().h]);
  const O = [0, 0];
  const E = (th) => prj([g().r * Math.cos(th), g().r * Math.sin(th), 0]);
  // 切点：sinθ = b / H（b = KY·r，H = KZ·h）
  const t1 = () => { const q = (KY * g().r) / (KZ * g().h); return Math.asin(Math.min(1, q)); };
  b.poly(() => [S(), ...Array.from({ length: 61 }, (_, i) => E(Math.PI - t1() + ((Math.PI + 2 * t1()) * i) / 60))], { cls: 'cone-f' });
  b.curve((u) => E(t1() + (Math.PI - 2 * t1()) * u), 0, 1, { cls: 'hid', n: 60 });
  b.curve((u) => E(Math.PI - t1() + (Math.PI + 2 * t1()) * u), 0, 1, { cls: 'edge', n: 100 });
  b.seg(() => [S(), E(Math.PI - t1())], { cls: 'edge' });
  b.seg(() => [S(), E(t1())], { cls: 'edge' });
  b.seg(() => [S(), O], { cls: 'hid' });
  const A = () => E(g().a * RAD);
  b.seg(() => [O, A()], { cls: 'hid' });
  if (opt.gen !== false) b.seg(() => [S(), A()], { cls: 'gen' });
  // 直角记号：O 处，OS 与 OA 方向
  const q = 0.18;
  b.poly(() => {
    const u = [Math.cos(g().a * RAD), Math.sin(g().a * RAD)];
    const p1 = prj([u[0] * q, u[1] * q, 0]);
    return [p1, prj([u[0] * q, u[1] * q, q]), prj([0, 0, q]), [0, 0]];
  }, { cls: 'rmk' });
  b.pt(O, { r: 3 });
  if (opt.names !== false) {
    b.text(S, 'S', { dx: -5, dy: -8 });
    b.text(O, 'O', { dx: -18, dy: 4 });
    b.text(A, 'A', { dx: 6, dy: 16 });
  }
  return { S, A, E };
}

/* ---------- 第 3 页：母线 ---------- */
function initCone() {
  const s = { r: 1.2, h: 2.4, a: 300 };
  const b = Geo.board($('cn'), { x: [-2.6, 2.6], y: [-1, 3.1], w: 420 });
  drawCone(b, () => s);
  b.text(() => mul(prj([s.r * Math.cos(s.a * RAD), s.r * Math.sin(s.a * RAD), 0]), 0.5), 'r', { dx: -2, dy: 18, cls: 'lb up rlab' });
  b.text(() => [0, (KZ * s.h) / 2], 'h', { dx: -16, dy: 4, cls: 'lb up rlab' });
  b.text(() => mul(prj([s.r * Math.cos(s.a * RAD), s.r * Math.sin(s.a * RAD), s.h]), 0.5), 'l', { dx: 8, dy: 4, cls: 'lb up llab' });
  b.onUpdate = () => {
    const l = Math.hypot(s.r, s.h);
    $('cnRv').textContent = fmt(s.r); $('cnHv').textContent = fmt(s.h);
    $('cnR2').textContent = fmt(s.r); $('cnH2').textContent = fmt(s.h);
    $('cnL').textContent = fmt(l, 3);
    $('cnSum').textContent = fmt(s.r * s.r + s.h * s.h, 3);
  };
  slider($('cnR'), (v) => { s.r = v; b.update(); });
  slider($('cnH'), (v) => { s.h = v; b.update(); });
  const TURN_MS = 3000;
  $('cnTurn').addEventListener('click', () => {
    const t0 = performance.now();
    const a0 = s.a;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / TURN_MS);
      s.a = a0 + 360 * k;
      b.update();
      if (k < 1) requestAnimationFrame(step); else s.a = a0;
    };
    requestAnimationFrame(step);
  });
}

/* ---------- 第 4 页：扇形卷成圆锥 ---------- */
function initWrap() {
  const s = { r: 1.2, l: 3, t: 0 };
  const MIN_GAP = 0.4;
  const Phi = () => (2 * Math.PI * s.r) / s.l; // 展开扇形的圆心角（弧度）
  const rho = () => s.l - (s.l - s.r) * s.t; // 卷到一半时所在圆锥的底面半径
  /** 扇形上的点（到顶点距离 d，角 φ）→ 卷起后的立体坐标（等距映射） */
  const map = (d, phi) => {
    const sa = rho() / s.l;
    const ca = Math.sqrt(Math.max(0, 1 - sa * sa));
    const H = s.l * ca;
    const psi = (phi * s.l) / rho() - Math.PI / 2; // 扇形正中对着观察者
    return prj([d * sa * Math.cos(psi), d * sa * Math.sin(psi), H - d * ca]);
  };
  const edge = (u) => map(s.l, -Phi() / 2 + Phi() * u);
  const b = Geo.board($('wr'), { x: [-3.4, 3.4], y: [-1.45, 3.2], w: 440 });
  b.curve((u) => prj([s.r * Math.cos(2 * Math.PI * u), s.r * Math.sin(2 * Math.PI * u), 0]), 0, 1, { cls: 'base', n: 120 });
  b.poly(() => [map(0, 0), ...Array.from({ length: 81 }, (_, i) => edge(i / 80))], { cls: 'paper' });
  const GEN = 12;
  for (let i = 0; i <= GEN; i++) b.seg(() => [map(0, 0), edge(i / GEN)], { cls: i === 0 || i === GEN ? 'seam' : 'gline' });
  b.curve(edge, 0, 1, { cls: 'arc-o', n: 120 });
  b.pt(() => map(0, 0), { r: 3 });
  b.text(() => map(0, 0), 'S', { dx: -5, dy: -8 });
  b.onUpdate = () => {
    $('wrRv').textContent = fmt(s.r);
    $('wrLv').textContent = fmt(s.l);
  };
  const fb = initFlat(() => s);
  const upd = () => { b.update(); fb.update(); };
  slider($('wrT'), (v) => { s.t = v; upd(); });
  slider($('wrR'), (v) => { s.r = Math.min(v, s.l - MIN_GAP); upd(); });
  slider($('wrL'), (v) => { s.l = Math.max(v, s.r + MIN_GAP); upd(); });
}

/** 右侧：展开扇形的真实形状 */
function initFlat(g) {
  const b = Geo.board($('fl'), { x: [-3.4, 3.4], y: [-3.4, 3.4], w: 300 });
  const n = () => (360 * g().r) / g().l;
  const P = (u) => onC([0, 0], g().l, -90 - n() / 2 + n() * u);
  b.poly(() => [[0, 0], ...Array.from({ length: 81 }, (_, i) => P(i / 80))], { cls: 'paper' });
  b.curve(P, 0, 1, { cls: 'arc-o', n: 120 });
  b.seg(() => [[0, 0], P(0)], { cls: 'seam' });
  b.seg(() => [[0, 0], P(1)], { cls: 'seam' });
  b.text(() => mul(P(0), 0.5), 'l', { dx: -14, dy: 2, cls: 'lb up llab' });
  b.text(() => mul(P(0.5), 1.08), '2πr', { dx: -14, dy: 18, cls: 'lb up alab' });
  b.pt([0, 0], { r: 3 });
  b.text([0, 0], 'S', { dx: -5, dy: -8 });
  b.onUpdate = () => {
    const { r, l } = g();
    $('flR').textContent = `l = ${fmt(l)}`;
    $('flA').textContent = fmt((n() * Math.PI * l) / 180, 3);
    $('flC').textContent = fmt(2 * Math.PI * r, 3);
    $('flN').textContent = `${fmt(n(), 1)}°`;
  };
  b.update();
  return b;
}

/* ---------- 静态精确图 ---------- */
function initFigs() {
  // 图 2-63：底面直径 80、母线 50（高 30），按 1:20 画成 r = 2、h = 1.5
  const g = { r: 2, h: 1.5, a: 330 };
  const b1 = Geo.board($('f263'), { x: [-2.6, 2.9], y: [-1.1, 2.2], w: 380 });
  const { E } = drawCone(b1, () => g, { gen: false, names: false });
  b1.seg([E(Math.PI), E(0)], { cls: 'dim' });
  b1.text(E(Math.PI / 2 * 3), '80 cm', { dx: -24, dy: 22, cls: 'lb up cap' });
  b1.text(mul(add(prj([0, 0, g.h]), E(0.18)), 0.5), '50 cm', { dx: 8, dy: -2, cls: 'lb up cap' });
  b1.update();
  // 图 2-64：圆半径 √2；扇形顶点 A 在圆上，圆心角 90°，半径 AB = AC = 2
  const R2 = Math.SQRT2;
  const A = [0, R2];
  const B = [-R2, 0];
  const C = [R2, 0];
  const Ee = [0, R2 - 2];
  const F = [0, -R2];
  const b2 = Geo.board($('f264'), { x: [-2, 2], y: [-1.85, 1.95], w: 320 });
  b2.poly([A, ...Array.from({ length: 46 }, (_, i) => onC(A, 2, 225 + 2 * i))], { cls: 'paper' });
  b2.curve((u) => onC([0, 0], R2, 360 * u), 0, 1, { cls: 'edge', n: 160 });
  b2.seg([A, B], { cls: 'edge' }); b2.seg([A, C], { cls: 'edge' });
  b2.seg([A, F], { cls: 'hid' });
  b2.seg([Ee, F], { cls: 'ef' });
  Geo.right(b2, A, B, C, { s: 0.2 });
  b2.pt([0, 0], { r: 3 });
  [[A, 'A', -5, -8], [B, 'B', -18, 6], [C, 'C', 6, 6], [[0, 0], 'O', 6, -4], [Ee, 'E', 6, 18], [F, 'F', 6, 18]].forEach(([p, t, dx, dy]) => b2.text(p, t, { dx, dy }));
  b2.update();
}

window.LESSON = {
  init() {
    initCone();
    initWrap();
    initFigs();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
