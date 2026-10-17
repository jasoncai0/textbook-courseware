'use strict';
/* 九上 2.7 弧长及扇形的面积 · 本课互动：把弧“拉直”放到圆周长上比（曲率连续变化、长度不变）、扇形占圆的份数、
 * 扇形切片交错重拼成近似平行四边形（每片刚体移动）。通用部分见 ../shared/math.js、mgeo.js、mcheck.js。
 * 所有图形由坐标计算，作图板横纵同比例；读数由坐标实时算出。 */
const { fmt, slider } = MathKit;
const { add, sub, mul, len, lerp } = Geo;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const val = (v) => (typeof v === 'function' ? v() : v);
const dirv = (d) => [Math.cos(d * RAD), Math.sin(d * RAD)];
const onC = (O, r, d) => add(O, mul(dirv(d), r));
const rot = (p, d) => { const [c, s] = dirv(d); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };
const circ = (b, O, r, cls = 'circ') => b.curve((t) => onC(val(O), val(r), 360 * t), 0, 1, { cls, n: 180 });
const away = (P, O, off) => { const d = sub(P, O); const l = len(d) || 1; return add(P, mul(d, off / l)); };
const piTxt = (v) => `${fmt(v / Math.PI, 3)}π ≈ ${fmt(v, 2)}`;

/* ---------- 第 3 页：把弧拉直 ---------- */
function initUnroll() {
  const O = [1.9, 2.3];
  const X0 = 0.3;
  const s = { n: 120, R: 1.5, t: 0 };
  const l = () => (s.n * Math.PI * s.R) / 180;
  const a0 = () => 90 - s.n / 2; // 弧从 a0 逆时针到 a0 + n
  /** 拉直进度 t：曲率 (1-t)/R，起点、起始方向线性过渡；弧长始终为 l */
  const bent = (u) => {
    const sl = u * l();
    const k = (1 - s.t) / s.R;
    const P0 = lerp(onC(O, s.R, a0()), [X0, 0], s.t);
    const th0 = (a0() + 90) * (1 - s.t) * RAD;
    if (k < 1e-9) return add(P0, [sl * Math.cos(th0), sl * Math.sin(th0)]);
    return add(P0, [(Math.sin(th0 + k * sl) - Math.sin(th0)) / k, (Math.cos(th0) - Math.cos(th0 + k * sl)) / k]);
  };
  const b = Geo.board($('ul'), { x: [-0.2, 9.9], y: [-1, 4], w: 800 });
  circ(b, O, () => s.R, 'circ faint');
  b.seg(() => [[X0, -0.35], [X0 + 2 * Math.PI * s.R, -0.35]], { cls: 'cbar' });
  b.text(() => [X0 + 2 * Math.PI * s.R, -0.35], '整个圆周长 2πR', { dx: -110, dy: 26, cls: 'lb up cap' });
  b.seg(() => [O, onC(O, s.R, a0())], { cls: 'rad' });
  b.seg(() => [O, onC(O, s.R, a0() + s.n)], { cls: 'rad' });
  b.curve((u) => (s.n > 0 ? onC(O, s.R, a0() + s.n * u) : [NaN, NaN]), 0, 1, { cls: 'arc-ghost', n: 160 });
  b.curve(bent, 0, 1, { cls: 'arc-l', n: 200 });
  b.pt(O, { r: 3 });
  b.text(O, 'O', { dx: -6, dy: 20 });
  b.text(() => (s.t > 0.98 ? [X0 + l() / 2, 0] : null), 'l', { dx: -4, dy: -10, cls: 'lb up llab' });
  b.onUpdate = () => {
    $('ulNv').textContent = `${s.n}°`;
    $('ulRv').textContent = fmt(s.R);
    const msg = $('ulMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$l=\\dfrac{${s.n}}{360}\\times2\\pi\\times${fmt(s.R)}\\approx${fmt(l(), 2)}$，占整个圆周长 $${fmt(2 * Math.PI * s.R, 2)}$ 的 $\\dfrac{${s.n}}{360}$．`;
    MathKit.tex(msg);
  };
  slider($('ulN'), (v) => { s.n = v; b.update(); });
  slider($('ulR'), (v) => { s.R = v; b.update(); });
  slider($('ulT'), (v) => { s.t = v; b.update(); });
}

/* ---------- 第 5 页：扇形占几份 ---------- */
function initSectorArea() {
  const O = [0, 0];
  const R = 2;
  const s = { n: 90 };
  const b = Geo.board($('sa'), { x: [-2.4, 2.4], y: [-2.4, 2.4], w: 420 });
  b.poly(() => [O, ...Array.from({ length: 121 }, (_, i) => onC(O, R, 90 + (s.n * i) / 120))], { cls: 'sec' });
  for (let k = 0; k < 36; k++) b.seg([O, onC(O, R, k * 10)], { cls: 'rad faint' });
  circ(b, O, R);
  b.pt(O, { r: 3 });
  b.text(O, 'O', { dx: 4, dy: 18 });
  b.onUpdate = () => {
    $('saNv').textContent = `${s.n}°`;
    const msg = $('saMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$n=${s.n}$：扇形占 $${fmt(s.n / 10, 1)}$ 份（每份 $10^\\circ$，共 36 份），面积是圆面积的 $\\dfrac{${s.n}}{360}$．`;
    MathKit.tex(msg);
  };
  slider($('saN'), (v) => { s.n = v; b.update(); });
}

/* ---------- 第 6 页：切片重拼 ---------- */
function initSlices() {
  const R = 2;
  const O = [2.2, 0.2];
  const X0 = 5.0;
  const Y0 = 0.2;
  const MAXK = 24;
  const s = { n: 120, k: 8, t: 0 };
  const delta = () => s.n / s.k;
  /** 单片（顶点在原点、弧朝上）的形状 */
  const shape = () => {
    const d = delta();
    return [[0, 0], ...Array.from({ length: 13 }, (_, i) => mul(dirv(90 - d / 2 + (d * i) / 12), R))];
  };
  const place = (i) => {
    const d = delta();
    const w = 2 * R * Math.sin((d / 2) * RAD);
    const h = R * Math.cos((d / 2) * RAD);
    const phi0 = 90 - s.n / 2 + (i + 0.5) * d - 90;
    const j = Math.floor(i / 2);
    const up = i % 2 === 1;
    const phi1 = up ? (phi0 >= 0 ? 180 : -180) : 0;
    const T1 = up ? [X0 + j * w + w / 2, Y0 + h] : [X0 + j * w, Y0];
    const phi = phi0 + (phi1 - phi0) * s.t;
    const T = lerp(O, T1, s.t);
    return shape().map((p) => add(rot(p, phi), T));
  };
  const b = Geo.board($('sl'), { x: [-0.1, 9.7], y: [-0.55, 2.7], w: 900 });
  for (let i = 0; i < MAXK; i++) b.poly(() => (i < s.k ? place(i) : []), { cls: i % 2 ? 'slice b' : 'slice' });
  b.pt(O, { r: 3, show: () => s.t < 0.02 });
  b.onUpdate = () => {
    const d = delta();
    const w = 2 * R * Math.sin((d / 2) * RAD);
    const h = R * Math.cos((d / 2) * RAD);
    const lArc = (s.n * Math.PI * R) / 180;
    $('slNv').textContent = `${s.n}°`;
    $('slKv').textContent = s.k;
    const msg = $('slMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = `$R=2$：近似平行四边形的底 $\\approx${fmt((s.k * w) / 2, 3)}$（$\\dfrac l2=${fmt(lArc / 2, 3)}$），高 $\\approx${fmt(h, 3)}$（$R=2$）；扇形面积 $\\dfrac12lR=${fmt(lArc, 3)}$．`;
    MathKit.tex(msg);
  };
  slider($('slN'), (v) => { s.n = v; b.update(); });
  slider($('slK'), (v) => { s.k = v; b.update(); });
  slider($('slT'), (v) => { s.t = v; b.update(); });
}

/* ---------- 静态精确图 ---------- */
function initFigs() {
  const O = [0, 0];
  // 图 2-59：∠BAC = 60°，弧 BC = 120°
  const r = 2;
  const [A, B, C] = [100, 210, 330].map((d) => onC(O, r, d));
  const b1 = Geo.board($('f259'), { x: [-2.6, 2.6], y: [-2.6, 2.6], w: 320 });
  circ(b1, O, r);
  b1.curve((u) => onC(O, r, 210 + 120 * u), 0, 1, { cls: 'arc-l', n: 60 });
  b1.poly([A, B, C], { cls: 'tri' });
  b1.seg([O, B], { cls: 'gdash' }); b1.seg([O, C], { cls: 'gdash' });
  Geo.arc(b1, A, B, C, { r: 0.45, label: '60°', lr: 2.2 });
  b1.pt(O, { r: 3 });
  [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p, t]) => b1.text(away(p, O, 0.3), t, { dx: -6, dy: 7 }));
  b1.text(O, 'O', { dx: -4, dy: -8 });
  b1.update();
  // 图 2-60：120°，OA = 3（30 cm），OC = 1（10 cm）
  const b2 = Geo.board($('f260'), { x: [-3.3, 3.3], y: [-0.5, 3.4], w: 380 });
  const ring = [...Array.from({ length: 61 }, (_, i) => onC(O, 3, 150 - 2 * i)), ...Array.from({ length: 61 }, (_, i) => onC(O, 1, 30 + 2 * i))];
  b2.poly(ring, { cls: 'fan' });
  for (let d = 30; d <= 150; d += 10) b2.seg([O, onC(O, 1, d)], { cls: 'rib' });
  b2.seg([O, onC(O, 3, 150)], { cls: 'gs' }); b2.seg([O, onC(O, 3, 30)], { cls: 'gs' });
  [[onC(O, 3, 150), 'A', -18, 4], [onC(O, 3, 30), 'B', 6, 4], [onC(O, 1, 150), 'C', -18, 6], [onC(O, 1, 30), 'D', 6, 6], [O, 'O', -6, 22]].forEach(([p, t, dx, dy]) => b2.text(p, t, { dx, dy }));
  b2.update();
  // 图 2-61：半圆直径 AB = 40（画成 4），C、D 三等分半圆
  const b3 = Geo.board($('f261'), { x: [-2.5, 2.5], y: [-0.5, 2.4], w: 260 });
  const Cc = onC(O, 2, 120);
  const Dd = onC(O, 2, 60);
  b3.poly([[-2, 0], ...Array.from({ length: 31 }, (_, i) => onC(O, 2, 120 - 2 * i))], { cls: 'shade' });
  b3.curve((u) => onC(O, 2, 180 * u), 0, 1, { cls: 'circ', n: 90 });
  b3.seg([[-2, 0], [2, 0]], { cls: 'gs' });
  b3.seg([[-2, 0], Cc], { cls: 'gs' }); b3.seg([[-2, 0], Dd], { cls: 'gs' });
  b3.pt(O, { r: 3 });
  [[[-2, 0], 'A', -16, 6], [[2, 0], 'B', 4, 6], [Cc, 'C', -10, -6], [Dd, 'D', 2, -6], [O, 'O', -4, 20]].forEach(([p, t, dx, dy]) => b3.text(p, t, { dx, dy }));
  b3.update();
}

window.LESSON = {
  init() {
    initUnroll();
    initSectorArea();
    initSlices();
    initFigs();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
