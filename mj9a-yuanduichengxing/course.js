'use strict';
/* 九上 2.2 圆的对称性 · 本课互动：旋转不变、两圆叠合（图 2-10）、圆心角·弧·弦联动、沿直径翻折（图 2-14）、例题精确作图。
 * 作图板横纵同比例；旋转、翻折、交点都由坐标精确计算。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const RAD = Math.PI / 180;
const polar = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] + r * Math.sin(deg * RAD)];
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const angOf = (c, p) => ((Math.atan2(p[1] - c[1], p[0] - c[0]) / RAD) + 360) % 360;
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const circle = (b, c, r, o = {}) => b.curve((t) => polar(typeof c === 'function' ? c() : c, r, t), 0, 360, o);
/** 直角记号：顶点 v，沿方向 d1、d2（单位向量）各走 s */
const rightMark = (v, d1, d2, s) => [[v[0] + d1[0] * s, v[1] + d1[1] * s], [v[0] + (d1[0] + d2[0]) * s, v[1] + (d1[1] + d2[1]) * s], [v[0] + d2[0] * s, v[1] + d2[1] * s]];

/* 第 3 页：旋转任意角度 */
function initSpin() {
  const O = [0, 0];
  const R = 2;
  const s = { a: 0 };
  const b = board($('spin'), { x: [-2.8, 2.8], y: [-2.6, 2.6], axes: false, grid: false, w: 460 });
  b.seg([polar(O, R, 30), polar(O, R, 150)], { cls: 'dash' });
  b.pt(polar(O, R, 250), { hollow: true, r: 6 });
  circle(b, O, R, { cls: 'c1 thick' });
  b.seg(() => [polar(O, R, 30 + s.a), polar(O, R, 150 + s.a)], { cls: 'c2' });
  b.seg(() => [O, polar(O, R, 250 + s.a)], { cls: 'thin' });
  b.pt(() => polar(O, R, 250 + s.a), { cls: 'red', r: 7 });
  b.pt(O);
  b.text(O, 'O', { dx: -20, dy: 18 });
  b.onUpdate = () => { $('spinAV').textContent = `${s.a}°`; };
  slider($('spinA'), (v) => { s.a = v; b.update(); });
}

/* 第 4 页：叠合。∠AOB = ∠A'O'B' = 70°；⊙O' 中的角比 ⊙O 中的多转 40° */
const OFFSET = 40;
function initFit() {
  const R = 1.8;
  const O = [-2.4, 0];
  const O1 = [2.4, 0];
  const [a, bb] = [245, 315];
  const s = { t: 0 };
  const b = board($('fit'), { x: [-4.5, 4.5], y: [-2.3, 2.3], axes: false, grid: false, w: 620 });
  const c1 = () => { const e = ease(Math.min(1, s.t)); return [O1[0] + (O[0] - O1[0]) * e, 0]; };
  const off = () => OFFSET * (1 - ease(Math.max(0, s.t - 1)));
  circle(b, O, R, { cls: 'c1' });
  b.curve((t) => polar(O, R, t), a, bb, { cls: 'c1 thick' });
  b.seg([O, polar(O, R, a)], { cls: 'c1' });
  b.seg([O, polar(O, R, bb)], { cls: 'c1' });
  b.seg([polar(O, R, a), polar(O, R, bb)], { cls: 'c1' });
  circle(b, c1, R, { cls: 'c2 dsh' });
  b.curve((t) => polar(c1(), R, t), () => a + off(), () => bb + off(), { cls: 'c2 thick' });
  b.seg(() => [c1(), polar(c1(), R, a + off())], { cls: 'c2' });
  b.seg(() => [c1(), polar(c1(), R, bb + off())], { cls: 'c2' });
  b.seg(() => [polar(c1(), R, a + off()), polar(c1(), R, bb + off())], { cls: 'c2' });
  b.pt(O); b.pt(c1, { cls: 'c2' });
  b.text(O, 'O', { dx: -8, dy: -12 });
  b.text(c1, "O'", { cls: 'lb o', dx: 6, dy: -12 });
  b.text(polar(O, R, a), 'A', { dx: -18, dy: 18 });
  b.text(polar(O, R, bb), 'B', { dx: 6, dy: 18 });
  b.text(() => polar(c1(), R, a + off()), "A'", { cls: 'lb o', dx: -8, dy: 26 });
  b.text(() => polar(c1(), R, bb + off()), "B'", { cls: 'lb o', dx: 10, dy: 12 });
  b.onUpdate = () => {
    const msg = $('fitMsg');
    const done = s.t >= 2;
    msg.className = `tip feedback ${done ? 'fb-ok' : ''}`;
    msg.innerHTML = s.t <= 1
      ? `① 平移：$O'$ 向 $O$ 移动（${Math.round(Math.min(1, s.t) * 100)}%）`
      : (done ? '② 旋转完成：$A\'$ 与 $A$、$B\'$ 与 $B$ 重合，$\\overset{\\frown}{A\'B\'}$ 与 $\\overset{\\frown}{AB}$ 重合，$A\'B\'$ 与 $AB$ 重合。'
        : `② 旋转：还差 ${fmt(off(), 0)}°`);
    tex(msg);
  };
  slider($('fitT'), (v) => { s.t = v; b.update(); });
  let raf = 0;
  $('fitPlay').addEventListener('click', () => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const DUR = 3000;
    const tick = (now) => {
      s.t = Math.min(2, (2 * (now - t0)) / DUR);
      $('fitT').value = s.t;
      b.update();
      if (s.t < 2) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });
}

/* 第 5 页：圆心角、弧、弦联动。∠AOB = 60° 固定，拖 D 改变 ∠COD */
function initThree() {
  const O = [0, 0];
  const R = 2;
  const A0 = 200;
  const FIX = 60;
  const C0 = 320;
  const s = { k: 95 };
  const b = board($('three'), { x: [-2.7, 2.7], y: [-2.6, 2.6], axes: false, grid: false, w: 440 });
  circle(b, O, R, { cls: 'thin dk' });
  b.curve((t) => polar(O, R, t), A0, A0 + FIX, { cls: 'c1 thick' });
  b.curve((t) => polar(O, R, t), C0, () => C0 + s.k, { cls: 'c2 thick' });
  [[A0, 'A', -18, 4], [A0 + FIX, 'B', -6, 24]].forEach(([d, n, dx, dy]) => { b.seg([O, polar(O, R, d)], { cls: 'c1' }); b.text(polar(O, R, d), n, { dx, dy }); });
  b.seg([polar(O, R, A0), polar(O, R, A0 + FIX)], { cls: 'c1 chd' });
  b.seg([O, polar(O, R, C0)], { cls: 'c2' });
  b.seg(() => [O, polar(O, R, C0 + s.k)], { cls: 'c2' });
  b.seg(() => [polar(O, R, C0), polar(O, R, C0 + s.k)], { cls: 'c2 chd' });
  b.text(polar(O, R, C0), 'C', { dx: 6, dy: 18 });
  b.text(() => polar(O, R, C0 + s.k), 'D', { dx: 8, dy: -6 });
  b.pt(O);
  b.text(O, 'O', { dx: -22, dy: 6 });
  b.drag(() => polar(O, R, C0 + s.k), (x, y) => {
    let k = Math.round(((angOf(O, [x, y]) - C0) % 360 + 360) % 360);
    k = Math.max(15, Math.min(150, k));
    s.k = Math.abs(k - FIX) <= 3 ? FIX : k;
  });
  const chord = (deg) => 2 * R * Math.sin((deg / 2) * RAD);
  b.onUpdate = () => {
    const eq = s.k === FIX ? ' class="eq"' : '';
    $('threeTab').innerHTML = `<tr><th></th><th>$\\angle AOB$ 一组</th><th>$\\angle COD$ 一组</th></tr>
      <tr${eq}><td>圆心角</td><td>${FIX}°</td><td>${s.k}°</td></tr>
      <tr${eq}><td>弧的度数</td><td>${FIX}°</td><td>${s.k}°</td></tr>
      <tr${eq}><td>弦长</td><td>${fmt(chord(FIX))}</td><td>${fmt(chord(s.k))}</td></tr>`;
    tex($('threeTab'));
  };
  b.update();
}

/* 第 6 页：图 2-12（∠AOC = ∠BOC = 110°） */
function initEx1() {
  const O = [0, 0];
  const C = polar(O, 1, 270);
  const A = polar(O, 1, 160);
  const B = polar(O, 1, 20);
  const b = board($('ex1'), { x: [-1.3, 1.3], y: [-1.2, 1.2], axes: false, grid: false, w: 340 });
  circle(b, O, 1, { cls: 'thin dk' });
  [[O, A], [O, B], [O, C], [A, B], [A, C], [B, C]].forEach((sg) => b.seg(sg, { cls: 'thin dk' }));
  [[O, 'O', -6, -10], [A, 'A', -20, 8], [B, 'B', 8, 8], [C, 'C', -6, 24]].forEach(([p, n, dx, dy]) => { b.pt(p, { r: 3 }); b.text(p, n, { dx, dy }); });
}

/* 第 8 页：沿直径 AB 翻折（图 2-14）。A(0,2)、B(0,-2)；C 在左半圆，D 在右半圆；右半边按 x·cosφ 翻转 */
function initFold() {
  const O = [0, 0];
  const R = 2;
  const s = { c: 205, d: -40, phi: 0 };
  const b = board($('fold'), { x: [-2.8, 2.8], y: [-2.5, 2.5], axes: false, grid: false, w: 460 });
  const fx = (p) => [p[0] * Math.cos(s.phi * RAD), p[1]];
  const C = () => polar(O, R, s.c);
  const D = () => polar(O, R, s.d);
  const P = () => { const c = C(); const d = D(); const t = -c[0] / (d[0] - c[0]); return [0, c[1] + t * (d[1] - c[1])]; };
  const perp = () => Math.abs(s.d - (180 - s.c)) < 1e-9;
  b.curve((t) => polar(O, R, t), -90, 90, { cls: 'ghost' });
  b.curve((t) => polar(O, R, t), 90, 270, { cls: 'c1' });
  b.curve((t) => fx(polar(O, R, t)), -90, 90, { cls: 'c2' });
  b.seg([[0, R], [0, -R]], { cls: 'axis' });
  b.seg(() => [C(), P()], { cls: 'chordl' });
  b.seg(() => [P(), fx(D())], { cls: 'chordr' });
  b.poly(() => (perp() ? rightMark(P(), [0, 1], [-1, 0], 0.22) : []), { cls: 'rmk' });
  b.pt(O, { r: 3 });
  b.pt(P, { r: 4 });
  b.text(O, 'O', { dx: 6, dy: -6 });
  b.text([0, R], 'A', { dx: 6, dy: -8 });
  b.text([0, -R], 'B', { dx: 6, dy: 22 });
  b.text(P, 'P', { dx: 6, dy: 22 });
  b.text(C, 'C', { dx: -22, dy: 6 });
  b.text(() => fx(D()), 'D', { cls: 'lb o', dx: 8, dy: -8 });
  b.drag(C, (x, y) => {
    const a = angOf(O, [x, y]);
    s.c = Math.max(100, Math.min(260, Math.round(a)));
  });
  b.drag(() => fx(D()), (x, y) => {
    if (s.phi !== 0) return; // 翻折时不能拖 D
    let a = Math.round(angOf(O, [x, y]));
    if (a > 180) a -= 360;
    a = Math.max(-80, Math.min(80, a));
    s.d = Math.abs(a - (180 - s.c)) <= 3 ? 180 - s.c : a;
  });
  b.onUpdate = () => {
    const c = C(); const d = D(); const p = P();
    const ang = Math.round(Math.acos((d[1] - p[1]) / dist(p, d)) / RAD);
    $('foldAV').textContent = `${s.phi}°`;
    $('fdAng').textContent = `${ang}°`;
    $('fdP').textContent = `${fmt(dist(p, c))} / ${fmt(dist(p, d))}`;
    $('fdA').textContent = `${s.c - 90}° / ${90 - s.d}°`;
    $('fdB').textContent = `${270 - s.c}° / ${s.d + 90}°`;
    const msg = $('fdMsg');
    const full = s.phi === 180;
    const ok = perp();
    msg.className = `tip feedback ${full ? (ok ? 'fb-ok' : 'fb-warn') : ''}`;
    msg.textContent = !full
      ? (ok ? '现在 CD ⊥ AB。把翻折角度拖到 180°，看 D 落在哪里。' : '现在 CD 不垂直于 AB。折过去试试，再按“设 CD ⊥ AB”比较。')
      : (ok ? 'D 与 C 重合！PC = PD，弧 AC = 弧 AD，弧 BC = 弧 BD。' : 'D 没有落在 C 上：CD 不垂直于 AB 时，PC ≠ PD。');
  };
  slider($('foldA'), (v) => { s.phi = v; b.update(); });
  $('foldPerp').addEventListener('click', () => { s.d = 180 - s.c; b.update(); });
}

/* 第 9 页：图 2-15；第 10 页：图 2-16 */
function initEx2() {
  const O = [0, 0];
  const yP = -0.55;
  const hx = Math.sqrt(1 - yP * yP);
  const C = [-hx, yP];
  const D = [hx, yP];
  const P = [0, yP];
  const b = board($('ex2'), { x: [-1.35, 1.35], y: [-1.2, 1.2], axes: false, grid: false, w: 340 });
  circle(b, O, 1, { cls: 'thin dk' });
  b.seg([[0, 1], [0, -1]], { cls: 'thin dk' });
  b.seg([C, D], { cls: 'thin dk' });
  b.seg([O, C], { cls: 'dash' }); b.seg([O, D], { cls: 'dash' });
  b.poly(rightMark(P, [0, 1], [1, 0], 0.09), { cls: 'rmk' });
  [[O, 'O', 6, -4], [[0, 1], 'A', 6, -6], [[0, -1], 'B', 6, 20], [C, 'C', -20, 6], [D, 'D', 6, 6], [P, 'P', -18, 22]].forEach(([p, n, dx, dy]) => { b.pt(p, { r: 3 }); b.text(p, n, { dx, dy }); });
}
function initEx3() {
  const O = [0, 0];
  const yP = -0.35;
  const xa = Math.sqrt(1 - yP * yP);
  const xc = Math.sqrt(0.36 - yP * yP);
  const b = board($('ex3'), { x: [-1.3, 1.3], y: [-1.15, 1.15], axes: false, grid: false, w: 340 });
  circle(b, O, 1, { cls: 'thin dk' });
  circle(b, O, 0.6, { cls: 'thin dk' });
  b.seg([[-xa, yP], [xa, yP]], { cls: 'thin dk' });
  b.seg([O, [0, yP]], { cls: 'dash' });
  b.poly(rightMark([0, yP], [0, 1], [1, 0], 0.08), { cls: 'rmk' });
  [[O, 'O', 6, -4], [[-xa, yP], 'A', -20, 6], [[xa, yP], 'B', 6, 6], [[-xc, yP], 'C', -10, 22], [[xc, yP], 'D', 0, 22], [[0, yP], 'P', -6, 22]].forEach(([p, n, dx, dy]) => { b.pt(p, { r: 3 }); b.text(p, n, { dx, dy }); });
}

MProof.addBasis({
  'same-r': { t: '同圆的半径相等', kind: '性质', src: '九上 2.1（课本 p40）', body: '同圆或等圆的半径相等．' },
  sxhy: { t: '等腰三角形三线合一', kind: '定理', src: '八上 2.5 等腰三角形的轴对称性', body: '等腰三角形底边上的高线、中线及顶角平分线重合．<br>$OC=OD$，$OP\\perp CD$ ⇒ $PC=PD$，$\\angle COP=\\angle DOP$．' },
  'same-supp': { t: '等角的补角相等', kind: '性质', src: '七上 6.3 余角、补角、对顶角', body: '同角或等角的补角相等．<br>$\\angle AOC=180^\\circ-\\angle BOC$，$\\angle AOD=180^\\circ-\\angle BOD$．' },
  'ang-arc': { t: '同圆中，相等的圆心角所对的弧相等', kind: '定理', src: '九上 2.2（课本 p45）', body: '在同圆或等圆中，相等的圆心角所对的弧相等，所对的弦相等．' },
  'ang-chord': { t: '同圆中，相等的圆心角所对的弦相等', kind: '定理', src: '九上 2.2（课本 p45）', body: '在同圆或等圆中，相等的圆心角所对的弧相等，所对的弦相等．' },
  'dy-xz': { t: '等边对等角', kind: '定理', src: '八上 2.5 等腰三角形的轴对称性', body: '等腰三角形的两个底角相等．在同一个三角形中：$AC=BC$ ⇒ $\\angle ABC=\\angle BAC$．' },
  cj: { t: '垂直于弦的直径平分弦', kind: '定理', src: '九上 2.2（课本 p47）', body: '垂直于弦的直径平分弦以及弦所对的两条弧．过圆心且垂直于弦的直线也是这样．' },
});

window.LESSON = {
  init() {
    MProof.init();
    initSpin();
    initFit();
    initThree();
    initEx1();
    initFold();
    initEx2();
    initEx3();
  },
};
