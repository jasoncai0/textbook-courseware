'use strict';
/* 九下 6.1 图上距离与实际距离 · 本课互动：比例尺地图对照、图 6-2 格点线段、课本小图。
 * 地图示意按经纬度换算成千米再按比例尺画到“厘米格”上；图 6-2 按课本格点坐标画。 */
const { slider, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/* 三城经纬度（市中心，度）→ 以南京为原点的平面坐标（km）：等距圆柱投影，纬度 33.2° 处 1° 经度 ≈ 93.2 km */
const KM_LON = 111.32 * Math.cos((33.2 * Math.PI) / 180);
const KM_LAT = 110.6;
const LL = { 南京: [118.8, 32.06], 徐州: [117.18, 34.26], 连云港: [119.22, 34.6] };
const KM = Object.fromEntries(Object.entries(LL).map(([k, [lon, lat]]) => [k, [(lon - LL.南京[0]) * KM_LON, (lat - LL.南京[1]) * KM_LAT]]));
const kmDist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const REAL_A = kmDist(KM.南京, KM.徐州);
const REAL_C = kmDist(KM.南京, KM.连云港);
const LEFT_SCALE = 8e6;
const RIGHT_SCALES = [8e6, 1e7, 1.2e7, 1.4e7, 1.6e7, 2e7];
const CM_PER_KM = 1e5;

function initMap() {
  const s = { k: 1.6e7 };
  const b = Geo.board($('mapBd'), { x: [-2.6, 5.6], y: [-0.9, 4.1], w: 660 });
  const toMap = (scale, origin) => (p) => [origin[0] + (p[0] * CM_PER_KM) / scale, origin[1] + (p[1] * CM_PER_KM) / scale];
  const L = toMap(LEFT_SCALE, [0, 0]);
  const R = () => toMap(s.k, [4.8, 0]);
  for (let x = -2; x <= 5.6; x += 1) b.seg([[x, -0.9], [x, 4.1]], { cls: 'cmgrid' });
  for (let y = 0; y <= 4.1; y += 1) b.seg([[-2.6, y], [5.6, y]], { cls: 'cmgrid' });
  b.seg([[2.25, -0.9], [2.25, 4.1]], { cls: 'thin' });
  const city = (get, name, dx, dy) => { b.pt(get, { r: 5, cls: 'city' }); b.text(get, name, { cls: 'lb city-n', dx, dy }); };
  b.seg([L(KM.南京), L(KM.徐州)], { cls: 'seg-a' });
  b.seg([L(KM.南京), L(KM.连云港)], { cls: 'seg-c' });
  b.seg(() => [R()(KM.南京), R()(KM.徐州)], { cls: 'seg-a' });
  b.seg(() => [R()(KM.南京), R()(KM.连云港)], { cls: 'seg-c' });
  city(L(KM.南京), '南京', -12, 26); city(L(KM.徐州), '徐州', -46, 0); city(L(KM.连云港), '连云港', 8, 0);
  city(() => R()(KM.南京), '南京', -12, 26); city(() => R()(KM.徐州), '徐州', -46, 0); city(() => R()(KM.连云港), '连云港', 8, 0);
  b.text(() => { const p = L(KM.南京); const q = L(KM.徐州); return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }, 'a', { dx: -20, dy: 0 });
  b.text(() => { const p = L(KM.南京); const q = L(KM.连云港); return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }, 'c', { dx: 8, dy: 0 });
  b.text(() => { const p = R()(KM.南京); const q = R()(KM.徐州); return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }, 'b', { dx: -18, dy: 0 });
  b.text(() => { const p = R()(KM.南京); const q = R()(KM.连云港); return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }, 'd', { dx: 8, dy: 0 });
  b.text([-2.4, 3.75], '1 : 8 000 000', { cls: 'lb up' });
  b.text([2.45, 3.75], () => `1 : ${(s.k).toLocaleString('fr-FR')}`, { cls: 'lb up' });
  b.onUpdate = () => {
    const a = (REAL_A * CM_PER_KM) / LEFT_SCALE;
    const c = (REAL_C * CM_PER_KM) / LEFT_SCALE;
    const bb = (REAL_A * CM_PER_KM) / s.k;
    const d = (REAL_C * CM_PER_KM) / s.k;
    $('mA').textContent = `${fmt(a)} cm`; $('mC').textContent = `${fmt(c)} cm`;
    $('mB').textContent = `${fmt(bb)} cm`; $('mD').textContent = `${fmt(d)} cm`;
    $('mAB').textContent = fmt(a / bb, 3); $('mCD').textContent = fmt(c / d, 3);
    $('mapKV').textContent = s.k.toLocaleString('fr-FR');
    const msg = $('mapMsg');
    msg.className = 'tip feedback fb-ok';
    msg.textContent = `a/b = c/d = ${fmt(a / bb, 3)}，正好等于 ${s.k.toLocaleString('fr-FR')} ÷ 8 000 000。实际距离约 ${Math.round(REAL_A)} km、${Math.round(REAL_C)} km。`;
  };
  slider($('mapK'), (v) => { s.k = RIGHT_SCALES[v]; b.update(); });
}

/* 图 6-2：6×6 方格，课本格点坐标 */
function initGrid() {
  const s = { legs: false };
  const P = { A1: [2, 3], B1: [0, 1], C1: [6, 3], A2: [4, 4], B2: [3, 5], C2: [6, 4] };
  const b = Geo.board($('gridBd'), { x: [-1.4, 7.4], y: [-0.6, 6.6], w: 520 });
  for (let i = 1; i < 6; i++) { b.seg([[i, 0], [i, 6]], { cls: 'sq-grid' }); b.seg([[0, i], [6, i]], { cls: 'sq-grid' }); }
  b.poly([[0, 0], [6, 0], [6, 6], [0, 6]], { cls: 'sq-box' });
  const LEGS = [[P.B1, [2, 1], P.A1], [P.B1, [6, 1], P.C1], [P.B2, [4, 5], P.A2], [P.B2, [6, 5], P.C2]];
  LEGS.forEach(([p, q, r]) => { b.seg(() => (s.legs ? [p, q] : [p, p]), { cls: 'leg' }); b.seg(() => (s.legs ? [q, r] : [q, q]), { cls: 'leg' }); });
  b.seg([P.B1, P.A1], { cls: 'gs2' }); b.seg([P.B1, P.C1], { cls: 'gs2' });
  b.seg([P.B2, P.A2], { cls: 'gs3' }); b.seg([P.B2, P.C2], { cls: 'gs3' });
  const lab = { A1: [-4, -12], B1: [-30, 6], C1: [10, 4], A2: [-6, 26], B2: [-22, -10], C2: [10, 8] };
  Object.entries(P).forEach(([k, p]) => { b.pt(p, { r: 4 }); b.text(p, `${k[0]}${k[1] === '1' ? '₁' : '₂'}`, { dx: lab[k][0], dy: lab[k][1] }); });
  const legTxt = [[[1, 1], '2', 0, 22], [[2, 2], '2', 8, 6], [[4, 1], '6', 0, 22], [[6, 2], '2', 8, 6], [[3.5, 5], '1', -4, -8], [[4, 4.5], '1', 8, 6], [[4.5, 5], '3', 0, -8], [[6, 4.5], '1', 8, 6]];
  legTxt.forEach(([p, t, dx, dy]) => b.text(() => (s.legs ? p : null), t, { cls: 'lb up gnum', dx, dy }));
  $('legBtn').addEventListener('click', () => {
    s.legs = !s.legs;
    $('legBtn').classList.toggle('solid', s.legs);
    b.update();
  });
  b.update();
}

/* 课本小图（静态，按题目数据的比例画） */
function initFigs() {
  // 例 1：三边 4、5、6 cm 的三角形：B(0,0)、C(6,0)，AB=4、AC=5
  const ax = (36 + 16 - 25) / 12;
  const A = [ax, Math.sqrt(16 - ax * ax)];
  Geo.sketch($('ex1Fig'), { P: { A, B: [0, 0], C: [6, 0] }, seg: 'AB BC CA', hide: 'ABC', text: [[[A[0] / 2, A[1] / 2], '4 cm', -46, 0], [[3, 0], '6 cm', -18, 24], [[(A[0] + 6) / 2, A[1] / 2], '5 cm', 8, 0]], w: 420, pad: 0.7 });
  // 练习 4：AD = 15，AB = 40 → D、E 在 3/8 处
  const T = { A: [3.6, 3.2], B: [0, 0], C: [5, 0] };
  const at = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  Geo.sketch($('p4Fig'), { P: { ...T, D: at(T.A, T.B, 15 / 40), E: at(T.A, T.C, 15 / 40) }, seg: 'AB BC CA DE', w: 300, pad: 0.6 });
  // 习题 3：AD : DB = 2 → D、E 在 2/3 处
  const U = { A: [2.2, 3.4], B: [0, 0], C: [4.6, 0] };
  Geo.sketch($('h3Fig'), { P: { ...U, D: at(U.A, U.B, 2 / 3), E: at(U.A, U.C, 2 / 3) }, seg: 'AB BC CA DE', w: 300, pad: 0.6 });
  // 习题 4：EF∥BC，AG : AD = EF : BC = 2 : 3，GD = 4 → AD = 12
  const V = { A: [2.6, 3.6], B: [0, 0], C: [4.5, 0], D: [2.2, 0] };
  const k = 8 / 12;
  Geo.sketch($('h4Fig'), { P: { ...V, E: at(V.A, V.B, k), F: at(V.A, V.C, k), G: at(V.A, V.D, k) }, seg: 'AB BC CA EF AD', w: 300, pad: 0.6, lab: { G: [8, -8], D: [-4, 22] } });
}

window.LESSON = {
  init() {
    initMap();
    initGrid();
    initFigs();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
