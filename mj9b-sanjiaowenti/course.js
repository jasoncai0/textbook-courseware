'use strict';
/* 九下 7.6 用锐角三角函数解决问题 · 本课互动：坡度器、水坝作高（图 7-19）、加固土方、摩天轮（图 7-20）、
 * 测角仪测气球（图 7-21）、暗礁方向角。所有图形按课本数据精确计算。 */
const { slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const tan = (d) => Math.tan(d * RAD);
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];

function modeButtons(id, s, b) {
  $(id).addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    s.m = +btn.dataset.m;
    $(id).querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
}

/* 第 3 页：坡度 i = 1 : m，铅直高度取 2 */
function initSlope() {
  const s = { m: 1.2 };
  const H = 2;
  const b = Geo.board($('slope'), { x: [-0.7, 9], y: [-1.1, 3.1], w: 520 });
  const P = () => ({ A: [0, 0], C: [H * s.m, 0], B: [H * s.m, H] });
  b.poly(() => [P().A, P().C, P().B], { cls: 'earth' });
  b.seg(() => [P().A, P().B], { cls: 'gl c-a' });
  b.seg(() => [P().B, P().C], { cls: 'gdash' });
  b.seg([[-0.6, 0], [8.9, 0]], { cls: 'gs' });
  Geo.right(b, () => P().C, () => P().A, () => P().B, { s: 0.2 });
  Geo.arc(b, () => P().A, () => P().C, () => P().B, { r: 0.8, label: 'α' });
  b.text(() => mid(P().B, P().C), 'h', { dx: 8, dy: 6 });
  b.text(() => mid(P().A, P().C), 'l', { dx: -4, dy: 26 });
  b.onUpdate = () => {
    $('mV').textContent = fmt(s.m, 1);
    const a = Math.atan(1 / s.m) / RAD;
    $('slopeMsg').innerHTML = `$i=1:${fmt(s.m, 1)}=\\tan\\alpha\\approx${(1 / s.m).toFixed(3)}$，坡角 $\\alpha\\approx${a.toFixed(1)}^\\circ$`;
    tex($('slopeMsg'));
  };
  slider($('mS'), (v) => { s.m = v; b.update(); });
}

/* 第 4 页：图 7-19 水坝。坝高 4.5，坝顶 2.5，AF = 1.2 × 4.5 = 5.4，EB = 4.5·tan60° */
const DAM = (() => {
  const h = 4.5;
  const af = 1.2 * h;
  const eb = h * tan(60);
  return { h, af, eb, A: [0, 0], F: [af, 0], D: [af, h], C: [af + 2.5, h], E: [af + 2.5, 0], B: [af + 2.5 + eb, 0] };
})();
function damBase(b) {
  const { A, B, C, D } = DAM;
  b.poly([A, B, C, D], { cls: 'damf' });
  b.seg([[-1.8, 0], [17.4, 0]], { cls: 'gs' });
  Geo.arc(b, A, B, D, { r: 1.1, label: 'β' });
  Geo.arc(b, B, A, C, { r: 1.3, label: 'α' });
  [[A, 'A', -20, 22], [B, 'B', 4, 22], [C, 'C', 4, -6], [D, 'D', -20, -6]].forEach(([p, n, dx, dy]) => b.text(p, n, { dx, dy }));
}
function initDam() {
  const s = { m: 0 };
  const { F, E, C, D, h, af, eb } = DAM;
  const b = Geo.board($('dam'), { x: [-1.9, 17.6], y: [-1.6, 5.6], w: 900 });
  damBase(b);
  const on = (k) => () => s.m >= k;
  b.seg(() => (s.m >= 1 ? [D, F] : [D, D]), { cls: 'gdash' });
  b.seg(() => (s.m >= 1 ? [C, E] : [C, C]), { cls: 'gdash' });
  b.poly(() => (s.m >= 1 ? [F, [F[0] + 0.3, 0], [F[0] + 0.3, 0.3], [F[0], 0.3]] : []), { cls: 'gright' });
  b.poly(() => (s.m >= 1 ? [E, [E[0] - 0.3, 0], [E[0] - 0.3, 0.3], [E[0], 0.3]] : []), { cls: 'gright' });
  b.text(() => (s.m >= 1 ? F : null), 'F', { dx: -6, dy: 24 });
  b.text(() => (s.m >= 1 ? E : null), 'E', { dx: -6, dy: 24 });
  const L = (p, t, dx, dy) => b.text(() => (on(2)() ? p : null), t, { cls: 'lb up gnum', dx, dy });
  L([af / 2, 0], '5.4', -14, -8);
  L([af + 1.25, 0], '2.5', -14, -8);
  L([af + 2.5 + eb / 2, 0], `${fmt(eb)}`, -20, -8);
  L(mid(D, C), '2.5', -14, -10);
  L([C[0], h / 2], '4.5', 6, 6);
  b.update();
  modeButtons('damBtns', s, b);
}

/* 第 6 页：加固。D′ 向左 0.5，背水坡 1 : 1.4 → A′F′ = 6.3 */
function initDam2() {
  const s = { m: 0 };
  const { A, D, C, B, h } = DAM;
  const D2 = [D[0] - 0.5, h];
  const A2 = [D2[0] - 1.4 * h, 0];
  const b = Geo.board($('dam2'), { x: [-2.4, 17.2], y: [-1.6, 5.8], w: 700 });
  b.poly(() => (s.m ? [A2, A, D, D2] : []), { cls: 'added' });
  damBase(b);
  b.seg(() => (s.m ? [A2, D2] : [A, A]), { cls: 'gl c-a' });
  b.seg(() => (s.m ? [D2, D] : [A, A]), { cls: 'gl c-a' });
  b.text(() => (s.m ? A2 : null), 'A′', { dx: -22, dy: 22 });
  b.text(() => (s.m ? D2 : null), 'D′', { dx: -26, dy: -6 });
  b.text(() => (s.m ? mid(A2, A) : null), '1.4', { cls: 'lb up gnum', dx: -12, dy: 44 });
  b.text(() => (s.m ? mid(D2, D) : null), '0.5', { cls: 'lb up gnum', dx: -12, dy: -30 });
  b.update();
  modeButtons('d2Btns', s, b);
}

/* 第 8 页：摩天轮，半径 20，底部离地 0.3，每分钟转 30° */
function initWheel() {
  const s = { t: 2 };
  const R = 20;
  const O = [0, 20.3];
  const A = [0, 0.3];
  const th = () => 30 * s.t;
  const B = () => [O[0] + R * Math.sin(th() * RAD), O[1] - R * Math.cos(th() * RAD)];
  const C = () => [0, B()[1]];
  const b = Geo.board($('wheel'), { x: [-24, 26], y: [-3, 43], w: 440 });
  b.seg([[-23, 0], [25, 0]], { cls: 'gs' });
  b.curve((t) => [R * Math.cos(t), O[1] + R * Math.sin(t)], 0, 2 * Math.PI, { cls: 'circ' });
  b.seg([O, A], { cls: 'gs' });
  b.seg([[0, 0], A], { cls: 'thin' });
  b.seg(() => [O, B()], { cls: 'gl c-b' });
  b.seg(() => [B(), C()], { cls: 'gdash' });
  b.seg(() => [O, C()], { cls: 'gl so' });
  b.seg(() => [[B()[0], 0], B()], { cls: 'hline' });
  Geo.right(b, C, O, B, { s: 1.4 });
  Geo.arc(b, O, A, B, { r: 3.2, show: () => th() % 360 > 3 && th() % 360 < 357 });
  b.pt(O, { r: 4 });
  b.pt(B, { r: 7, cls: 'c2' });
  b.text(O, 'O', { dx: -22, dy: -4 }); b.text(A, 'A', { dx: -22, dy: 18 }); b.text(B, 'B', { dx: 10, dy: -6 }); b.text(C, 'C', { dx: -22, dy: 6 });
  b.text(() => [B()[0], (B()[1]) / 2], () => `${fmt(20.3 - R * Math.cos(th() * RAD), 1)} m`, { cls: 'lb up gnum', dx: 8, dy: 6 });
  b.onUpdate = () => {
    $('tV').textContent = fmt(s.t);
    $('wAng').textContent = `${fmt(th() % 360, 1)}°`;
    $('wH').textContent = `${(20.3 - R * Math.cos(th() * RAD)).toFixed(2)} m`;
  };
  slider($('tS'), (v) => { s.t = v; b.update(); });
}

/* 第 11 页：测角仪测气球。CD = x ≈ 64.86，AD = x / tan27°，测角仪高 1 */
const BAL = (() => {
  const x = (50 * tan(27) * tan(40)) / (tan(40) - tan(27));
  return { x, ad: x / tan(27) };
})();
function initBalloon() {
  const s = { p: 0 };
  const C = [BAL.ad, BAL.x + 1];
  const D = [BAL.ad, 1];
  const eye = () => [s.p, 1];
  const ang = () => Math.atan((C[1] - 1) / (BAL.ad - s.p)) / RAD;
  const b = Geo.board($('balloon'), { x: [-9, 141], y: [-9, 78], w: 560 });
  b.seg([[-8, 0], [140, 0]], { cls: 'gs' });
  b.seg([[BAL.ad, 0], C], { cls: 'gdash' });
  b.seg(() => [eye(), D], { cls: 'gdash' });
  b.seg(() => [eye(), C], { cls: 'gl c-a' });
  b.seg(() => [[s.p, 0], eye()], { cls: 'stick' });
  b.curve((t) => [C[0] + 3.2 * Math.cos(t), C[1] + 4 + 4.2 * Math.sin(t)], 0, 2 * Math.PI, { cls: 'bal' });
  Geo.arc(b, eye, D, C, { r: 12, label: () => `${ang().toFixed(1)}°`, lr: 1.5 });
  [[0, 'A'], [50, 'B']].forEach(([x, n]) => { b.pt([x, 0], { r: 4 }); b.text([x, 0], n, { dx: -6, dy: 24 }); });
  b.text(C, 'C', { dx: 10, dy: 4 }); b.text(D, 'D', { dx: 8, dy: 20 });
  b.onUpdate = () => {
    $('pV').textContent = fmt(s.p, 1);
    const tag = Math.abs(s.p) < 0.01 ? '（A 处，课本 27°）' : (Math.abs(s.p - 50) < 0.01 ? '（B 处，课本 40°）' : '');
    $('bMsg').textContent = `仰角 ≈ ${ang().toFixed(1)}°${tag}；离气球越近，仰角越大。`;
  };
  slider($('pS'), (v) => { s.p = v; b.update(); });
}

/* 第 13 页：暗礁。小岛 O，航线在 O 正南 d 处，P 在南偏西 55°，Q 在南偏西 25°，PQ = 20 */
function initReef() {
  const s = { circ: false, perp: false };
  const d = 20 / (tan(55) - tan(25));
  const O = [0, 0];
  const H = [0, -d];
  const P = [-d * tan(55), -d];
  const Q = [-d * tan(25), -d];
  const b = Geo.board($('reef'), { x: [-36, 17], y: [-27, 13], w: 520 });
  b.curve((t) => [10 * Math.cos(t), 10 * Math.sin(t)], 0, 2 * Math.PI, { cls: 'zone' });
  const zone = b.svg.querySelector('.zone');
  b.seg([[-35, -d], [16, -d]], { cls: 'route' });
  b.seg([O, [0, 11]], { cls: 'thin' });
  b.text([0, 11], '北', { cls: 'lb up', dx: 6, dy: 14 });
  b.seg(() => (s.perp ? [O, H] : [O, [0, -6]]), { cls: 'gdash' });
  b.seg([O, P], { cls: 'gs' }); b.seg([O, Q], { cls: 'gs' });
  Geo.arc(b, O, [0, -5], P, { r: 5, label: '55°', lr: 1.45 });
  Geo.arc(b, O, [0, -5], Q, { r: 9, label: '25°', lr: 1.2 });
  b.poly(() => (s.perp ? [H, [1.2, -d], [1.2, -d + 1.2], [0, -d + 1.2]] : []), { cls: 'gright' });
  b.pt(O, { r: 5 });
  b.text(O, 'O', { dx: 8, dy: -6 }); b.text(P, 'P', { dx: -8, dy: 24 }); b.text(Q, 'Q', { dx: -8, dy: 24 });
  b.text(() => (s.perp ? H : null), 'H', { dx: 6, dy: 24 });
  b.text(mid(P, Q), '20 km', { cls: 'lb up gnum', dx: -24, dy: 24 });
  b.text(() => (s.perp ? [0, -15] : null), () => `OH ≈ ${d.toFixed(1)} km`, { cls: 'lb up gnum', dx: 8, dy: 4 });
  b.text([7, -d], '向东 →', { cls: 'lb up', dx: 0, dy: -10 });
  b.onUpdate = () => { if (zone) zone.style.display = s.circ ? '' : 'none'; };
  $('reefCirc').addEventListener('click', () => { s.circ = !s.circ; $('reefCirc').classList.toggle('solid', s.circ); b.update(); });
  $('reefPerp').addEventListener('click', () => { s.perp = !s.perp; $('reefPerp').classList.toggle('solid', s.perp); b.update(); });
  b.update();
}

function initSketches() {
  Geo.sketch($('road'), { P: { P: [0, 0], Q: [26, 0], R: [26, 1] }, seg: 'PQ QR RP', right: [['Q', 'P', 'R']], hide: 'PQR', text: [[[13, 0.5], '100 m', -20, -10], [[26, 0.5], '1', 8, 6], [[13, 0], '26', -8, 22]], w: 420, pad: 1.2 });
  Geo.sketch($('trees'), { P: { P: [0, 0], Q: [6, 0], R: [6, 6 / 3.5] }, seg: 'PQ QR RP', right: [['Q', 'P', 'R']], hide: 'PQR', text: [[[3, 0], '株距 6 m', -30, 22], [[3, 3 / 3.5], '?', -14, -8], [[0, 0], '●', -6, 4], [[6, 6 / 3.5], '●', -6, 4]], w: 360, pad: 0.6 });
  const sp = (d, k = 1) => [-3 * k * Math.sin(d * RAD), -3 * k * Math.cos(d * RAD)];
  Geo.sketch($('pend'), { P: { A: [0, 0], B: [0, -3], 'B′': sp(11), C: [0, sp(11)[1]] }, seg: 'AB AB′', dash: 'B′C', ang: [['A', 'B', 'B′', '11°', 1.2]], w: 200, pad: 0.35, lab: { C: [8, 4] } });
  const run = Math.sqrt(16 - 2.25);
  Geo.sketch($('seesaw'), { P: { P: [0, 0], S: [run, 0], T: [run, 1.5] }, seg: 'PT PS', dash: 'TS', right: [['S', 'P', 'T']], hide: 'PST', ang: [['P', 'S', 'T', 'θ', 0.8]], text: [[mid([0, 0], [run, 1.5]), '4 m', -18, -10], [[run, 0.75], '1.5 m', 8, 6]], w: 360, pad: 0.5 });
  const h = 10 / (1 / tan(15) - 1 / tan(52));
  const p1 = [-h / tan(15), h];
  const p2 = [p1[0] + 10, h];
  Geo.sketch($('plane'), { P: { A: p1, B: p2, S: [0, 0], E: [1.2, h], W: [p1[0], 0], Z: [1.2, 0] }, seg: 'AE AS BS', dash: 'WZ', ang: [['A', 'E', 'S', '15°', 2.4], ['B', 'E', 'S', '52°', 0.9]], hide: 'EWZ', text: [[mid(p1, p2), '10 km', -24, -10], [[p1[0] + 2, 0], '海面', 0, 22]], w: 420, pad: 0.8 });
  const ad = 4 * Math.sin(65 * RAD);
  Geo.sketch($('stair'), { P: { A: [0, ad], B: [-4 * Math.cos(65 * RAD), 0], C: [-ad / tan(40), 0], D: [0, 0] }, seg: 'AC AB AD CD', right: [['D', 'A', 'C']], ang: [['B', 'D', 'A', '65°', 0.5], ['C', 'D', 'A', '40°', 0.7]], text: [[mid([0, ad], [-4 * Math.cos(65 * RAD), 0]), '4 m', 10, 2]], w: 360, pad: 0.5 });
  Geo.sketch($('fig721'), { P: { A: [0, 0], B: [2.5, 0], D: [BAL.ad / 20, 0], C: [BAL.ad / 20, BAL.x / 20] }, seg: 'AD AC BC CD', right: [['D', 'A', 'C']], ang: [['A', 'D', 'C', '27°', 1], ['B', 'D', 'C', '40°', 0.6]], text: [[[1.25, 0], '50 m', -18, 24], [[BAL.ad / 20, BAL.x / 40], 'x m', 8, 6]], w: 420, pad: 0.6 });
}

window.LESSON = {
  init() { initSlope(); initDam(); initDam2(); initWheel(); initBalloon(); initReef(); initSketches(); },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
