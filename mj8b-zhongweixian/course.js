'use strict';
/* 八下 9.5 三角形的中位线 · 本课互动：剪开三角形并把 △ADE 绕 E 旋转 180° 拼成平行四边形（可拖三角形）、证明分步高亮、
 * 拖动三角形验证中位线定理（三条中位线 / 与中线对比）、中点四边形实验（按条件精确调整对角线）、测距与习题图。
 * 通用部分见 ../shared/math.js、mgeo.js、mproof.js、mcheck.js；所有点由坐标精确计算（中点、旋转、对称）。 */
const { fmt, slider } = MathKit;
const { add, sub, mul, dist, dir, rot, angle, lerp, meet, len } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const HIDE = [99, 99];
const H3 = [HIDE, HIDE, HIDE];
const mid = (P, Q) => lerp(P, Q, 0.5);
const lab = (b, p, t, dx, dy, cls) => b.text(p, t, { dx, dy, cls });
const labs = (b, list, cls) => list.forEach(([n, p, dx, dy]) => lab(b, p, n, dx, dy, cls));
const deg = (v) => `${fmt(v, 1)}°`;
const stg = { prf: 0 };
let prfBoard = null;

MProof.addBasis({
  sas: { t: '两边及其夹角分别相等的两个三角形全等（SAS）', kind: '基本事实', src: '八上 1.3 探索三角形全等的条件', body: '两边及其夹角分别相等的两个三角形全等（简写成“边角边”或“SAS”）．' },
  'pd-1': { t: '一组对边平行且相等的四边形是平行四边形', kind: '判定', src: '八下 9.3（课本 p67）', body: '$BD\\parallel CF$，$BD=CF$ ⇒ 四边形 $DBCF$ 是平行四边形．' },
  'px-db2': { t: '平行四边形的对边平行且相等', kind: '性质', src: '八下 9.3（课本 p64–65）', body: '由定义，平行四边形的对边平行；由性质定理，平行四边形的对边相等．' },
  zwx: { t: '三角形的中位线定理', kind: '定理', src: '八下 9.5（课本 p86）', body: '三角形的中位线平行于第三边，并且等于第三边的一半．' },
  'lx-pd1': { t: '四边相等的四边形是菱形', kind: '判定', src: '八下 9.4（课本 p80）', body: '四边相等的四边形是菱形．' },
});

/* ---------- 第 3 页：剪拼（图 9-31） ---------- */
function initCut() {
  const B = [0, 0];
  const s = { A: [1.6, 3.4], cx: 4.4, t: 0 };
  const C = () => [s.cx, 0];
  const D = () => mid(s.A, B); const E = () => mid(s.A, C());
  const top = () => [s.A, D(), E()].map((p) => rot(p, -s.t, E()));
  const b = Geo.board($('cut'), { x: [-0.6, 7.4], y: [-0.7, 4.2], w: 560 });
  b.poly(() => (s.t > 0 ? [s.A, D(), E()] : H3), { cls: 'tri-ghost' });
  b.poly(() => [D(), B, C(), E()], { cls: 'tri-o' });
  b.poly(top, { cls: 'fill-o' });
  b.poly(() => (s.t === 180 ? [D(), B, C(), top()[1]] : [HIDE, HIDE, HIDE, HIDE]), { cls: 'tri-g' });
  b.pt(E, { cls: 'ctr-p', r: 4 });
  lab(b, () => s.A, 'A', -4, -10); lab(b, B, 'B', -16, 16); lab(b, C, 'C', 4, 18);
  lab(b, D, 'D', -20, 0); lab(b, E, 'E', 4, -8);
  lab(b, () => (s.t === 180 ? top()[1] : null), 'F', 8, -4, 'lb r');
  b.drag(() => s.A, (x, y) => { s.A = [clamp(x, 0.4, 3.6), clamp(y, 1.8, 3.9)]; });
  b.drag(C, (x) => { s.cx = clamp(x, 2.6, 5); });
  b.onUpdate = () => {
    $('cutTV').textContent = `${s.t}°`;
    const msg = $('cutMsg');
    const done = s.t === 180;
    msg.className = `tip feedback ${done ? 'fb-ok' : ''}`;
    msg.textContent = done
      ? `拼成了！A 落在 C 上，D 落在 F 上。DF = ${fmt(dist(D(), top()[1]))}，BC = ${fmt(s.cx)}，DE = ${fmt(dist(D(), E()))}——正好是 BC 的一半。`
      : `已转 ${s.t}°（虚线是 △ADE 原来的位置）。也可以拖 A、C 换一个三角形。`;
  };
  slider($('cutT'), (v) => { s.t = v; b.update(); });
}

/* ---------- 第 4 页：证明图（随翻页高亮） ---------- */
function initPrf() {
  const A = [1.4, 3.2]; const B = [0, 0]; const C = [4.2, 0];
  const D = mid(A, B); const E = mid(A, C); const F = sub(mul(E, 2), D);
  const on = (k) => stg.prf >= k;
  const b = Geo.board($('prf'), { x: [-0.6, 5.6], y: [-0.6, 3.6], w: 520 });
  prfBoard = b;
  b.poly(() => (on(6) ? [D, B, C, F] : [HIDE, HIDE, HIDE, HIDE]), { cls: 'tri-g' });
  b.poly(() => (on(2) ? [A, D, E] : H3), { cls: 'fill-o' });
  b.poly(() => (on(2) ? [C, F, E] : H3), { cls: 'fill-g' });
  b.poly([A, B, C], { cls: 'tri-o' });
  b.seg([D, E], { cls: 'gs' }); b.seg([E, F], { cls: 'gdash' }); b.seg([C, F], { cls: 'gs' });
  b.seg(() => (on(4) ? [B, D] : [HIDE, HIDE]), { cls: 'gs hl' }); b.seg(() => (on(4) ? [C, F] : [HIDE, HIDE]), { cls: 'gs hl' });
  labs(b, [['A', A, -4, -8], ['B', B, -16, 16], ['C', C, 4, 16], ['D', D, -18, 0], ['E', E, -2, -10], ['F', F, 6, 0]]);
  b.update();
}

/* ---------- 第 5 页：拖三角形看定理 ---------- */
function initThm() {
  const s = { A: [1.8, 3.4], B: [0, 0], C: [4.8, 0.2], k: '1' };
  const D = () => mid(s.A, s.B); const E = () => mid(s.A, s.C); const M = () => mid(s.B, s.C);
  const b = Geo.board($('thm'), { x: [-0.8, 5.8], y: [-0.8, 4.2], w: 560 });
  b.poly(() => (s.k === '3' ? [D(), E(), M()] : H3), { cls: 'fill-o' });
  b.poly(() => [s.A, s.B, s.C], { cls: 'tri-o' });
  b.seg(() => [D(), E()], { cls: 'gs hl' });
  b.seg(() => (s.k === '3' ? [D(), M()] : [HIDE, HIDE]), { cls: 'gs hl' });
  b.seg(() => (s.k === '3' ? [E(), M()] : [HIDE, HIDE]), { cls: 'gs hl' });
  b.seg(() => (s.k === 'm' ? [s.A, M()] : [HIDE, HIDE]), { cls: 'gs g2' });
  Geo.arc(b, D, () => s.A, E, { r: 0.4, show: () => s.k === '1' });
  Geo.arc(b, () => s.B, () => s.A, () => s.C, { r: 0.4, show: () => s.k === '1' });
  lab(b, () => s.A, 'A', -4, -10); lab(b, () => s.B, 'B', -16, 16); lab(b, () => s.C, 'C', 4, 18);
  lab(b, D, 'D', -20, 0); lab(b, E, 'E', 6, 0); lab(b, () => (s.k === '1' ? null : M()), 'M', -4, 20);
  b.drag(() => s.A, (x, y) => { s.A = [clamp(x, -0.4, 5.2), clamp(y, 1.6, 4)]; });
  b.drag(() => s.B, (x, y) => { s.B = [clamp(x, -0.6, 1.6), clamp(y, -0.6, 1)]; });
  b.drag(() => s.C, (x, y) => { s.C = [clamp(x, 3, 5.6), clamp(y, -0.6, 1)]; });
  b.onUpdate = () => {
    $('tDE').textContent = fmt(dist(D(), E())); $('tBC').textContent = fmt(dist(s.B, s.C));
    $('tA1').textContent = deg(angle(D(), s.A, E())); $('tA2').textContent = deg(angle(s.B, s.A, s.C));
  };
  $('thmBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = btn.dataset.k;
    $('thmBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
  b.update();
}

/* ---------- 第 6 页：中点四边形 ---------- */
function initMq() {
  const START = { A: [0.8, 3], B: [0, 0], C: [4.6, 0.3], D: [4.2, 3.4] };
  const s = { ...START };
  const P = () => [s.A, s.B, s.C, s.D];
  const M = () => P().map((p, i) => mid(p, P()[(i + 1) % 4])); // E F G H
  const b = Geo.board($('mq'), { x: [-0.8, 6], y: [-0.8, 4.6], w: 560 });
  b.poly(P, { cls: 'tri-o' });
  b.seg(() => [s.A, s.C], { cls: 'gdash' }); b.seg(() => [s.B, s.D], { cls: 'gdash' });
  b.poly(M, { cls: 'fill-o' });
  ['A', 'B', 'C', 'D'].forEach((n) => lab(b, () => s[n], n, n === 'A' || n === 'B' ? -18 : 6, n === 'B' || n === 'C' ? 18 : -6));
  ['E', 'F', 'G', 'H'].forEach((n, i) => lab(b, () => M()[i], n, -4, i === 1 ? 20 : -8, 'lb r sm'));
  ['A', 'B', 'C', 'D'].forEach((n) => b.drag(() => s[n], (x, y) => { s[n] = [clamp(x, -0.5, 5.6), clamp(y, -0.5, 4.3)]; }, { r: 7, hit: 18 }));
  const kind = () => {
    const ac = dist(s.A, s.C); const bd = dist(s.B, s.D);
    const a = angle([0, 0], sub(s.C, s.A), sub(s.D, s.B));
    const eq = Math.abs(ac - bd) < 0.02; const pp = Math.abs(a - 90) < 0.5;
    const name = eq && pp ? '正方形' : eq ? '菱形' : pp ? '矩形' : '平行四边形';
    return { ac, bd, a, name };
  };
  b.onUpdate = () => {
    const k = kind();
    const msg = $('mqMsg');
    msg.className = `tip feedback ${k.name === '平行四边形' ? '' : 'fb-ok'}`;
    msg.textContent = `AC = ${fmt(k.ac)}，BD = ${fmt(k.bd)}，AC 与 BD 夹角 ${deg(k.a)} → EFGH 是${k.name}。`;
  };
  const setD = (L, u) => { s.D = add(s.B, mul(u, L / len(u))); };
  $('mqBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    const k = btn.dataset.k;
    $('mqBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    const ac = sub(s.C, s.A);
    const perp = rot(ac, 90);
    s.D = [...START.D]; // 每次从原来的 D 出发，只改一个条件
    if (k === 'any') Object.assign(s, START);
    if (k === 'eq') setD(len(ac), sub(s.D, s.B));
    if (k === 'pp') setD(dist(s.B, s.D), perp);
    if (k === 'both') setD(len(ac), perp);
    b.update();
  });
  b.update();
}

/* ---------- 第 7、8 页：练习与习题图 ---------- */
function initFigs() {
  const A = [1.3, 3.2]; const B = [0, 0]; const C = [4.6, 0];
  const D = mid(C, A); const E = mid(C, B);
  const f = Geo.board($('far'), { x: [-0.6, 5.2], y: [-0.6, 3.6], w: 360 });
  f.poly([[-0.2, 1], [1.5, 1], [1.5, 2.1], [-0.2, 2.1]], { cls: 'bldg' });
  f.seg([A, B], { cls: 'gdash r' }); f.seg([C, A], { cls: 'gs' }); f.seg([C, B], { cls: 'gs' }); f.seg([D, E], { cls: 'gs hl' });
  labs(f, [['A', A, -4, -8], ['B', B, -16, 14], ['C', C, 4, 16], ['D', D, 6, -2], ['E', E, -4, 18]]);
  lab(f, mid(D, E), '36 m', 6, 4, 'lb up sm');
  f.update();

  const C1 = [0, 0]; const A1 = [0, 3]; const B1 = [3.6, 0];
  const D1 = mid(A1, C1); const E1 = mid(A1, B1); const F1 = mid(B1, C1);
  const h1 = Geo.board($('hw1'), { x: [-0.6, 4.2], y: [-0.5, 3.4], w: 300 });
  h1.poly([A1, C1, B1], { cls: 'tri-o' });
  h1.seg([C1, E1], { cls: 'gs hl' }); h1.seg([D1, F1], { cls: 'gs g2' });
  Geo.right(h1, C1, A1, B1, { s: 0.25 });
  labs(h1, [['A', A1, -16, 0], ['C', C1, -16, 16], ['B', B1, 4, 16], ['D', D1, -18, 4], ['E', E1, 6, -4], ['F', F1, -4, 18]]);
  h1.update();

  const A2 = [1.5, 2.8]; const B2 = [0, 0]; const C2 = [4, 0];
  const D2 = mid(A2, B2); const E2 = mid(A2, C2); const F2 = mid(B2, C2);
  const O2 = meet(A2, F2, D2, E2);
  const h2 = Geo.board($('hw2'), { x: [-0.5, 4.5], y: [-0.5, 3.2], w: 300 });
  h2.poly([A2, B2, C2], { cls: 'tri-o' });
  h2.seg([A2, F2], { cls: 'gs hl' }); h2.seg([D2, E2], { cls: 'gs hl' });
  h2.seg([D2, F2], { cls: 'gdash' }); h2.seg([E2, F2], { cls: 'gdash' });
  labs(h2, [['A', A2, -4, -8], ['B', B2, -16, 14], ['C', C2, 4, 14], ['D', D2, -18, 2], ['E', E2, 6, 0], ['F', F2, -4, 18], ['O', O2, 6, -4]]);
  h2.update();
}

window.LESSON = {
  init() {
    MProof.init();
    initCut(); initPrf(); initThm(); initMq(); initFigs();
  },
  onRender(slide, k) {
    if (slide.querySelector('#prf')) { stg.prf = k; prfBoard.update(); }
    requestAnimationFrame(Geo.refresh);
  },
};
