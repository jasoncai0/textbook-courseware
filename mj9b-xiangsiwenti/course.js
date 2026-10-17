'use strict';
/* 九下 6.7 用相似三角形解决问题 · 本课互动：太阳光下的影子（平行投影）、路灯下的影子（中心投影）、由影子找光源、课本插图。
 * 影长都按光线的直线方程计算；插图按题目数据（按比例缩小）精确作出。 */
const { fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const { add, sub, mul, dir, meet } = Geo;
const RAD = Math.PI / 180;

/* 第 3 页：太阳光（平行投影） */
const STICKS = [['甲', 1, 2], ['乙', 5, 3], ['丙', 8.6, 1.2]];
function initSun() {
  const s = { a: 40 };
  const b = Geo.board($('sunBd'), { x: [-0.6, 15.6], y: [-0.7, 4.2], w: 640 });
  const sh = (h) => h / Math.tan(s.a * RAD);
  b.seg([[-0.6, 0], [15.6, 0]], { cls: 'ground' });
  STICKS.forEach(([n, x, h]) => {
    b.seg(() => [[x, 0], [x + sh(h), 0]], { cls: 'shadow' });
    b.seg(() => [add([x, h], mul(dir(180 - s.a), 1.6)), [x + sh(h), 0]], { cls: 'sunray' });
    b.seg([[x, 0], [x, h]], { cls: 'stick' });
    b.text([x, h], n, { cls: 'lb up', dx: -24, dy: 8 });
  });
  b.onUpdate = () => {
    $('sunAV').textContent = `${s.a}°`;
    $('sunTab').innerHTML = `<tr><th>木杆</th><th>木杆长度</th><th>杆影长度</th><th>木杆长度 : 杆影长度</th></tr>${STICKS.map(([n, , h]) => `<tr><td>${n}</td><td>${fmt(h, 2)}</td><td>${fmt(sh(h), 2)}</td><td class="ok">${fmt(h / sh(h), 3)}</td></tr>`).join('')}`;
  };
  MathKit.slider($('sunA'), (v) => { s.a = v; b.update(); });
}

/* 第 6 页：路灯（中心投影） */
function initLamp() {
  let s = { d: 3, rows: [] };
  const H = 5;
  const h = 1.6;
  const L = [0, H];
  const tip = () => s.d + (h * s.d) / (H - h);
  const b = Geo.board($('lampBd'), { x: [-0.8, 15], y: [-0.7, 5.8], w: 640 });
  b.seg([[-0.8, 0], [15, 0]], { cls: 'ground' });
  b.seg([[0, 0], L], { cls: 'lamp' });
  b.poly(() => [L, [tip(), 0], [s.d, 0]], { cls: 'beam' });
  b.seg(() => [[s.d, 0], [tip(), 0]], { cls: 'shadow' });
  b.seg(() => [L, [tip(), 0]], { cls: 'sunray' });
  b.seg(() => [[s.d, 0], [s.d, h]], { cls: 'person' });
  b.pt(L, { r: 8, cls: 'light' });
  b.text(L, '路灯', { cls: 'lb up', dx: 10, dy: -4 });
  b.text(() => [s.d, h], '小明', { cls: 'lb up', dx: -16, dy: -10 });
  b.drag(() => [s.d, h / 2], (x) => { s = { ...s, d: Math.min(9.5, Math.max(0.6, Math.round(x * 10) / 10)) }; }, { r: 8, hit: 20 });
  const render = () => {
    const rows = [...s.rows, { d: s.d, cur: true }];
    $('lampTab').innerHTML = `<tr><th>到灯杆的距离</th><th>身高</th><th>影长</th><th>身高 : 影长</th></tr>${rows.map((r) => { const t = (h * r.d) / (H - h); return `<tr${r.cur ? ' class="cur"' : ''}><td>${fmt(r.d, 1)} m${r.cur ? '（当前）' : ''}</td><td>1.6 m</td><td>${fmt(t, 2)} m</td><td>${fmt(h / t, 3)}</td></tr>`; }).join('')}`;
  };
  b.onUpdate = render;
  $('lampRec').addEventListener('click', () => { s = { ...s, rows: [...s.rows, { d: s.d }].slice(-4) }; render(); });
  $('lampClr').addEventListener('click', () => { s = { ...s, rows: [] }; render(); });
  b.update();
}

/* 第 7 页：图 6-45 找光源（按课本图量得的位置，单位：课本图上 0.2 mm 左右，按比例） */
function initSrc() {
  const s = { src: false, third: false };
  const P = [{ x: 1.8, h: 2.04, tip: 2.96 }, { x: 4.34, h: 2.74, tip: 8.04 }, { x: 9.12, h: 1.88 }];
  const Lsrc = meet([P[0].tip, 0], [P[0].x, P[0].h], [P[1].tip, 0], [P[1].x, P[1].h]);
  const tip3 = meet(Lsrc, [P[2].x, P[2].h], [0, 0], [1, 0]);
  const b = Geo.board($('srcBd'), { x: [-1.4, 13.8], y: [-0.5, 7.1], w: 460 });
  b.seg([[-1.4, 0], [13.8, 0]], { cls: 'ground' });
  P.forEach((p, i) => {
    b.seg([[p.x, 0], [p.x, p.h]], { cls: 'stick' });
    if (p.tip) b.seg([[p.x, 0], [p.tip, 0]], { cls: 'shadow' });
    if (i < 2) b.seg(() => (s.src ? [Lsrc, [p.tip, 0]] : [[0, 0], [0, 0]]), { cls: 'sunray' });
  });
  b.seg(() => (s.third ? [Lsrc, tip3] : [[0, 0], [0, 0]]), { cls: 'sunray' });
  b.seg(() => (s.third ? [[P[2].x, 0], tip3] : [[0, 0], [0, 0]]), { cls: 'shadow' });
  b.pt(() => (s.src ? Lsrc : null), { r: 8, cls: 'light' });
  b.text(() => (s.src ? Lsrc : null), '光源', { cls: 'lb up', dx: 12, dy: 6 });
  b.update();
  $('srcFind').addEventListener('click', () => { s.src = true; $('srcFind').classList.add('solid'); b.update(); });
  $('srcThird').addEventListener('click', () => { s.src = true; s.third = true; $('srcThird').classList.add('solid'); b.update(); });
}

/* 插图 */
function initFigs() {
  const sk = (id, spec) => Geo.sketch($(id), spec);
  const sc = (k) => (p) => mul(p, k);
  // 图 6-43(2)：CD = 115，DB = 32，AC = 147（缩小 1/30）
  const py = sc(1 / 30);
  const pb = Geo.sketch($('pyBd'), { P: { A: py([0, 147]), C: py([0, 0]), D: py([115, 0]), B: py([147, 0]), E: py([-115, 0]) }, seg: 'AE AD AC EB', dash: 'AB', right: [['C', 'D', 'A']], hide: 'E', w: 380, pad: 0.7,
    text: [[py([57, 0]), '115', -12, 22], [py([131, 0]), '32', -8, 22], [py([0, 75]), '147 ?', 6, 4]] });
  pb.seg([add(py([0, 147]), mul([-1, 1], 1.4)), py([0, 147])], { cls: 'sunray' });
  pb.update();
  // 图 6-46（缩小 1/4）：BD = 24，NB = 6，NE = 2，MN = 1.6，AB = CD = 6.4
  const q = sc(0.25);
  sk('f646', { P: { A: q([0, 6.4]), B: q([0, 0]), C: q([24, 6.4]), D: q([24, 0]), N: q([6, 0]), E: q([8, 0]), M: q([6, 1.6]) }, seg: 'AB CD BD MN', dash: 'AE CB', w: 360, pad: 0.4, lab: { M: [8, -4], N: [-8, 20], E: [-2, 20] } });
  // 图 6-47（缩小 1/2）：AB = 6.4，BD = 9，DF = 3，FG = 4，身高 1.6
  const r = sc(0.5);
  sk('f647', { P: { A: r([0, 6.4]), B: r([0, 0]), C: r([-9, 1.6]), D: r([-9, 0]), E: r([-12, 1.6]), F: r([-12, 0]), G: r([-16, 0]) }, seg: 'AB GB CD EF', dash: 'AF AG', w: 360, pad: 0.4, lab: { C: [-4, -10], E: [-4, -10] } });
  // 练习 1：CD = 5.1，BD = 4，PB = 2，AB = 1.7
  sk('p84a', { P: { C: [0, 5.1], D: [0, 0], A: [-4, 1.7], B: [-4, 0], P: [-6, 0] }, seg: 'CD PD AB', dash: 'PC', right: [['D', 'P', 'C'], ['B', 'P', 'A']], w: 300, pad: 0.5 });
  // 练习 2：O 在桌面中心正上方 2 m，桌面半径 0.8 m，桌面距地面 1 m
  sk('p85a', { P: { O: [0, 3], A: [0, 1], C: [0.8, 1], 'C′': [-0.8, 1], B: [0, 0], D: [1.2, 0], 'D′': [-1.2, 0] }, seg: 'C′C D′D OB', dash: 'OD OD′', hide: 'C′D′', w: 240, pad: 0.4, lab: { A: [-20, -4], B: [-20, 16] } });
  // 习题 1：CA = 120，CB = 60，CD = 20，CE = 40，∠C ≈ 90.9°（由 AB = 135 反算）
  const cosC = (120 * 120 + 60 * 60 - 135 * 135) / (2 * 120 * 60);
  const Cang = Math.acos(cosC) / RAD;
  const u = sc(1 / 30);
  sk('h1fig', { P: { C: [0, 0], A: u(mul(dir(140), 120)), B: u(mul(dir(140 - Cang), 60)), D: u(mul(dir(140), 20)), E: u(mul(dir(140 - Cang), 40)) }, seg: 'CA CB DE', dash: 'AB', w: 260, pad: 0.5 });
  // 习题 3：镜子在 C，BC = 60，CD = 3，眼高 1.65，楼高 33（缩小 1/6）
  const v = sc(1 / 6);
  sk('h3fig', { P: { A: v([0, 33]), B: v([0, 0]), C: v([60, 0]), D: v([63, 0]), E: v([63, 1.65]) }, seg: 'AB BD DE', dash: 'AC CE', w: 300, pad: 0.6, lab: { D: [4, 20], C: [-10, 20], E: [8, -6] } });
}

window.LESSON = {
  init() {
    initSun();
    initLamp();
    initSrc();
    initFigs();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
