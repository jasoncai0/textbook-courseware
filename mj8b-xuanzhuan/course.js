'use strict';
/* 八下 9.1 图形的旋转 · 本课互动：三角尺绕 C 旋转、旋转实验台（拖中心 / 拖对应点）、三要素对比、
 * 逐步作旋转后的点与线段、拖点作旋转图形并判对、正方形旋转找中心 + 量角器、习题（菊花、正方形、方格纸平移+旋转）。
 * 通用部分见 ../shared/math.js、mgeo.js、mangle.js；旋转一律用 Geo.rot（逆时针为正）精确计算，读数由坐标实时算出。 */
const { fmt, slider, tex } = MathKit;
const { add, sub, mul, dist, dir, ang, rot, angle, lerp, centroid } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const HIDE = [99, 99];
const rotAll = (pts, deg, c) => pts.map((p) => rot(p, deg, c));
/** 把角度化到 (-180, 180] */
const wrap = (d) => { const x = ((d % 360) + 360) % 360; return x > 180 ? x - 360 : x; };
/** 从射线 CP 转到射线 CQ 的有向角（逆时针为正） */
const signed = (C, P, Q) => wrap(ang(sub(Q, C)) - ang(sub(P, C)));
const deg = (v) => `${Math.round(v)}°`;
const lab = (b, p, t, dx, dy, cls) => b.text(p, t, { dx, dy, cls });
/** 记下 fn() 新画出的图元，之后用 vis(els, on) 显示 / 隐藏（用 visibility，不和作图板的 display 冲突） */
const capture = (b, fn) => { const before = new Set(b.svg.querySelectorAll('*')); fn(); return [...b.svg.querySelectorAll('*')].filter((e) => !before.has(e)); };
const vis = (els, on) => els.forEach((e) => e.setAttribute('visibility', on ? 'visible' : 'hidden'));

/* ---------- 第 3 页：三角尺绕 C 旋转（图 9-1） ---------- */
function initRuler() {
  const C = [0, 0];
  const A = mul(dir(8), 2.6);
  const B = mul(dir(98), 4.4);
  const s = { t: 35 };
  const D = () => rot(A, s.t, C);
  const E = () => rot(B, s.t, C);
  const b = Geo.board($('ruler'), { x: [-4.2, 3.6], y: [-0.9, 4.9], w: 560 });
  b.poly([A, B, C], { cls: 'tri-o' });
  b.poly(() => [D(), E(), C], { cls: 'tri-r' });
  Geo.right(b, C, A, B, { s: 0.3 });
  Geo.arc(b, C, A, D, { r: 1.1, cls: 'carc', show: () => s.t > 2 });
  Geo.arc(b, C, B, E, { r: 1.5, cls: 'carc', show: () => s.t > 2 });
  lab(b, A, 'A', 8, 18); lab(b, B, 'B', 4, -8); lab(b, C, 'C', -8, 24);
  lab(b, () => (s.t > 2 ? D() : null), 'D', 8, -4, 'lb r'); lab(b, () => (s.t > 2 ? E() : null), 'E', -20, -6, 'lb r');
  b.onUpdate = () => {
    $('rulerTV').textContent = `${s.t}°`;
    $('rulerA').textContent = deg(angle(C, A, D()));
    $('rulerB').textContent = deg(angle(C, B, E()));
  };
  slider($('rulerT'), (v) => { s.t = v; b.update(); });
}

/* ---------- 第 4 页：旋转实验台（图 9-2） ---------- */
function initLab() {
  const T = [[2.4, 3.7], [0.4, 1.9], [2.9, 1.1]];
  const s = { O: [-0.6, 0.2], t: -60 };
  const R = () => rotAll(T, s.t, s.O);
  const names = ['A', 'B', 'C'];
  const b = Geo.board($('lab'), { x: [-5.4, 7.2], y: [-5.2, 6.8], w: 600 });
  b.poly(T, { cls: 'tri-o' });
  b.poly(R, { cls: 'tri-r' });
  [0, 1, 2].forEach((i) => {
    b.seg(() => [s.O, T[i]], { cls: 'gdash' });
    b.seg(() => [s.O, R()[i]], { cls: 'gdash r' });
    Geo.arc(b, () => s.O, T[i], () => R()[i], { r: 0.5 + 0.35 * i, cls: 'carc', show: () => Math.abs(s.t) > 3 });
  });
  names.forEach((n, i) => {
    lab(b, T[i], n, i === 1 ? -22 : 8, i === 0 ? -6 : 18);
    if (i) lab(b, () => R()[i], `${n}′`, 8, 18, 'lb r');
  });
  lab(b, () => s.O, 'O', -34, 26);
  // 中心限制在三角形附近，保证转到任何角度，像都留在画板里
  b.drag(() => s.O, (x, y) => { s.O = [clamp(x, -1, 2.6), clamp(y, -0.6, 2.6)]; });
  b.drag(() => R()[0], (x, y) => {
    const t = Math.round(signed(s.O, T[0], [x, y]));
    s.t = Math.abs(t) > 177 ? 180 : t;
  });
  lab(b, () => R()[0], 'A′', 12, -10, 'lb r');
  b.onUpdate = () => {
    const r = R();
    const cells = [['lOA', 'lOA2', 'lAA'], ['lOB', 'lOB2', 'lBB'], ['lOC', 'lOC2', 'lCC']];
    cells.forEach(([a, a2, g], i) => {
      $(a).textContent = fmt(dist(s.O, T[i]));
      $(a2).textContent = fmt(dist(s.O, r[i]));
      $(g).textContent = dist(s.O, T[i]) < 1e-6 ? '—' : deg(angle(s.O, T[i], r[i]));
    });
    const way = s.t === 0 ? '没有转动' : s.t === 180 ? '旋转 180°' : `${s.t > 0 ? '逆' : '顺'}时针旋转 ${Math.abs(s.t)}°`;
    $('labMsg').textContent = `△ABC 绕点 O ${way}：三个“到中心的距离”两两相等，三个旋转角也相等。`;
  };
  b.update();
}

/* ---------- 第 5 页：同一个三角形，换中心、换方向 ---------- */
function initTri3() {
  const T = [[0.6, 0.4], [2.4, 0.4], [0.9, 1.9]];
  const O = [0, 0];
  const P = [3.2, 1.6];
  const cases = { a: rotAll(T, 90, O), b: rotAll(T, -90, O), c: rotAll(T, 90, P) };
  const s = { k: 'a' };
  const b = Geo.board($('tri3'), { x: [-2.8, 5], y: [-3, 3], w: 560, grid: true, ticks: 1 });
  Object.keys(cases).forEach((k) => b.poly(() => (s.k === k ? [HIDE, HIDE, HIDE] : cases[k]), { cls: 'tri-ghost' }));
  b.poly(T, { cls: 'tri-o' });
  b.poly(() => cases[s.k], { cls: 'tri-r' });
  b.seg(() => [s.k === 'c' ? P : O, T[0]], { cls: 'gdash' });
  b.seg(() => [s.k === 'c' ? P : O, cases[s.k][0]], { cls: 'gdash r' });
  Geo.arc(b, () => (s.k === 'c' ? P : O), T[0], () => cases[s.k][0], { r: 0.45, cls: 'carc', label: '90°', lr: 2.2 });
  b.pt(O); b.pt(P);
  lab(b, O, 'O', -22, 18); lab(b, P, 'P', 8, -6);
  lab(b, T[0], 'A', -4, 20); lab(b, T[1], 'B', 6, 18); lab(b, T[2], 'C', 6, -4);
  b.update();
  $('tri3Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    s.k = btn.dataset.k;
    $('tri3Btns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
}

/* ---------- 第 6 页：逐步画旋转后的点、线段（随翻页步骤） ---------- */
const cons = { k: 0, mode: 'pt', b: null };
function initCons() {
  const O = [0, 0];
  const R0 = 100;
  const pts = { pt: [mul(dir(225), 2.5)], seg: [mul(dir(205), 2.4), mul(dir(255), 3.5)] };
  const on = (k) => cons.k >= k;
  const P = () => pts[cons.mode];
  const Q = () => P().map((p) => rot(p, R0, O));
  const b = Geo.board($('cons'), { x: [-4, 4.4], y: [-4, 2.2], w: 560 });
  cons.b = b;
  // 量角器：基线沿 OA（第一个点），逆时针量 100°
  const prot = { c: O, rot: 0 };
  const protEls = capture(b, () => MAngle.protractor(b, prot, { r: 1.7, fixed: true, inner: false }));
  b.seg(() => (cons.mode === 'seg' && on(4) ? Q() : [HIDE, HIDE]), { cls: 'gs hl' });
  b.seg(() => (cons.mode === 'seg' ? P() : [HIDE, HIDE]), { cls: 'gs' });
  [0, 1].forEach((i) => {
    const has = () => P().length > i;
    const p = () => (has() ? P()[i] : HIDE);
    const q = () => (has() ? Q()[i] : HIDE);
    b.seg(() => (on(1) && has() ? [O, p()] : [HIDE, HIDE]), { cls: 'gdash' });
    b.seg(() => (on(2) && has() ? [O, add(O, mul(sub(q(), O), 1.35))] : [HIDE, HIDE]), { cls: 'gdash r' });
    Geo.arc(b, O, p, q, { r: 0.55 + 0.3 * i, cls: 'carc', show: () => on(2) && has(), label: '100°', lr: 1.9 });
    b.curve((t) => {
      if (!(on(3) && has())) return [NaN, NaN];
      const a = ang(sub(q(), O)) - 12 + 24 * t;
      return add(O, mul(dir(a), dist(O, p())));
    }, 0, 1, { cls: 'carc', n: 30 });
    b.pt(p, { show: has });
    b.pt(q, { show: () => on(4) && has(), cls: 'c2' });
    lab(b, () => (on(2) && has() ? add(O, mul(sub(q(), O), 1.35)) : null), i ? '' : 'C', 6, 6);
  });
  b.pt(O);
  lab(b, O, 'O', -8, -12);
  lab(b, () => P()[0], 'A', -20, 16);
  lab(b, () => (cons.mode === 'seg' ? P()[1] : null), 'B', -6, 24);
  lab(b, () => (on(4) ? Q()[0] : null), 'A′', 10, 18, 'lb r');
  lab(b, () => (on(4) && cons.mode === 'seg' ? Q()[1] : null), 'B′', 10, -6, 'lb r');
  const setProt = () => { prot.rot = ang(sub(P()[0], O)); };
  b.onUpdate = () => vis(protEls, on(2) && cons.k < 4);
  setProt();
  b.update();
  $('consBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    cons.mode = btn.dataset.k;
    $('consBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    setProt();
    b.update();
  });
}

/* ---------- 第 7 页：拖点作旋转后的三角形，判对（图 9-3） ---------- */
function initPut() {
  const C = [0, 0];
  const A = [-0.9, 2.9];
  const B = [-4.3, 0.2];
  const ANG = -120;
  const goal = [rot(A, ANG, C), rot(B, ANG, C)];
  const START = [[-3.6, -1.2], [-2.2, -1.2]];
  const s = { p: START.map((p) => [...p]), ok: [false, false], help: false };
  const b = Geo.board($('put'), { x: [-5, 4.2], y: [-1.8, 4.4], w: 560 });
  b.poly([A, B, C], { cls: 'tri-o' });
  b.poly(() => (s.ok.every(Boolean) ? [goal[0], goal[1], C] : [HIDE, HIDE, HIDE]), { cls: 'tri-r' });
  b.seg(() => [C, s.p[0]], { cls: 'gdash r' });
  b.seg(() => [C, s.p[1]], { cls: 'gdash r' });
  // 作图痕迹：CA、CB 虚线、120° 弧、截取弧
  [A, B].forEach((P, i) => {
    b.seg(() => (s.help ? [C, P] : [HIDE, HIDE]), { cls: 'gdash' });
    Geo.arc(b, C, P, goal[i], { r: 0.6 + 0.4 * i, cls: 'carc', show: () => s.help, label: '120°', lr: 1.7 });
    b.curve((t) => {
      if (!s.help) return [NaN, NaN];
      const a = ang(goal[i]) - 10 + 20 * t;
      return mul(dir(a), dist(C, P));
    }, 0, 1, { cls: 'carc', n: 30 });
  });
  lab(b, A, 'A', 4, -8); lab(b, B, 'B', -20, 6); lab(b, C, 'C', 6, 22);
  lab(b, () => s.p[0], 'A′', 12, 20, 'lb r'); lab(b, () => s.p[1], 'B′', 12, -8, 'lb r');
  [0, 1].forEach((i) => b.drag(() => s.p[i], (x, y) => {
    const P = [A, B][i];
    const near = Math.abs(dist(C, [x, y]) - dist(C, P)) < 0.22 && Math.abs(signed(C, P, [x, y]) - ANG) < 5;
    s.ok = s.ok.map((v, k) => (k === i ? near : v));
    s.p = s.p.map((p, k) => (k === i ? (near ? goal[i] : [clamp(x, -4.8, 4), clamp(y, -1.6, 4.2)]) : p));
  }, { r: 8, hit: 20 }));
  const judge = (i) => {
    const P = [A, B][i];
    const n = ['A', 'B'][i];
    if (s.ok[i]) return `${n}′ 放对了`;
    const a = signed(C, P, s.p[i]);
    const dOk = Math.abs(dist(C, s.p[i]) - dist(C, P)) < 0.22;
    if (Math.abs(a - 120) < 5) return `${n}′ 转成了逆时针 120°，方向反了`;
    if (!dOk) return `C${n}′ 应等于 C${n}`;
    return `∠${n}C${n}′ 应为顺时针 120°`;
  };
  b.onUpdate = () => {
    [[0, 'putA1', 'putA2'], [1, 'putB1', 'putB2']].forEach(([i, d, g]) => {
      const P = [A, B][i];
      $(d).textContent = `${fmt(dist(C, s.p[i]), 1)} / ${fmt(dist(C, P), 1)}`;
      const a = signed(C, P, s.p[i]);
      $(g).textContent = `${a < 0 ? '顺' : '逆'} ${Math.round(Math.abs(a))}°`;
    });
    const msg = $('putMsg');
    const all = s.ok.every(Boolean);
    msg.className = `tip feedback ${all ? 'fb-ok' : ''}`;
    msg.textContent = all
      ? '画对了！△A′B′C 就是 △ABC 绕点 C 顺时针旋转 120° 得到的三角形：CA′ = CA，CB′ = CB，∠ACA′ = ∠BCB′ = 120°。'
      : `${judge(0)}；${judge(1)}。`;
  };
  $('putHelp').addEventListener('click', () => { s.help = !s.help; $('putHelp').classList.toggle('solid', s.help); b.update(); });
  $('putReset').addEventListener('click', () => { s.p = START.map((p) => [...p]); s.ok = [false, false]; b.update(); });
  b.update();
}

/* ---------- 第 8 页：正方形旋转找中心 + 量角器（练习 1）；练习 2 解答图 ---------- */
function initSq() {
  const A = [0, 0];
  const SIDE = 3;
  const sq = (d0) => { const u = mul(dir(d0), SIDE); const v = mul(dir(d0 + 90), SIDE); return [A, v, add(u, v), u]; }; // A B C D
  const P0 = sq(37);
  const P1 = sq(37 - 45);
  const prot = { c: [0, 0], rot: 37 - 45 };
  const b = Geo.board($('sq'), { x: [-2.8, 4.4], y: [-1.3, 4.8], w: 540 });
  b.poly(P0, { cls: 'sqo' });
  b.seg([A, P0[2]], { cls: 'gdash' });
  b.poly(P1, { cls: 'sqr' });
  ['A(A′)', 'B', 'C', 'D'].forEach((n, i) => lab(b, P0[i], n, i === 0 ? -30 : i === 1 ? -22 : 6, i === 0 ? 26 : i === 2 ? -8 : 6));
  ['', 'B′', 'C′', 'D′'].forEach((n, i) => { if (n) lab(b, P1[i], n, i === 1 ? -26 : 8, i === 3 ? 22 : -6); });
  const protEls = capture(b, () => MAngle.protractor(b, prot, { r: 2.1, snap: 1 }));
  vis(protEls, false);
  b.update();
  $('sqProt').addEventListener('click', () => { prot.c = [0, 0]; prot.rot = 37 - 45; vis(protEls, true); b.update(); });
  $('sqOff').addEventListener('click', () => vis(protEls, false));
  const WHY = {
    A: '对！点 A 和它的对应点 A′ 重合——转动时位置不变的点就是旋转中心。再放上量角器，量 ∠BAB′ 或 ∠DAD′：都是 45°。',
    B: '点 B 转到了 B′，位置变了，它不是旋转中心。找“和自己的对应点重合”的那个点。',
    D: '点 D 转到了 D′，位置变了，它不是旋转中心。',
    C2: 'C′ 是 C 的对应点，两点不重合，C′ 不是旋转中心。',
  };
  $('sqPick').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    const k = btn.dataset.k;
    btn.classList.add(k === 'A' ? 'ok' : 'no');
    const msg = $('sqMsg');
    msg.className = `tip feedback ${k === 'A' ? 'fb-ok' : 'fb-warn'}`;
    msg.textContent = WHY[k];
  });

  // 练习 2 完整解答图：△ABC 绕 A 逆时针 90°，D 为 AC 中点
  const T = [[0, 0], [2.2, 0], [1.7, 3.2]];
  const D = lerp(T[0], T[2], 0.5);
  const R = rotAll(T, 90, T[0]);
  const D2 = rot(D, 90, T[0]);
  const fig = Geo.board($('sq2Fig'), { x: [-3.8, 2.8], y: [-0.7, 3.7], w: 360 });
  fig.poly(T, { cls: 'tri-o' });
  fig.poly(R, { cls: 'tri-r' });
  Geo.right(fig, T[0], T[1], R[1], { s: 0.28 });
  fig.pt(D); fig.pt(D2, { cls: 'c2' });
  [['A', T[0], 4, 22], ['B', T[1], 6, 18], ['C', T[2], 6, -4], ['D', D, 8, 6]].forEach(([n, p, dx, dy]) => lab(fig, p, n, dx, dy));
  [['B′', R[1], -10, -8], ['C′', R[2], -22, -4], ['D′', D2, -8, -10]].forEach(([n, p, dx, dy]) => lab(fig, p, n, dx, dy, 'lb r'));
  $('sq2Fig').closest('details').addEventListener('toggle', () => fig.update());
  fig.update();
}

/* ---------- 第 9 页：习题 1 菊花 ---------- */
function initFlower() {
  const N = 8;
  const s = { t: 0 };
  const petal = (a, d) => Array.from({ length: 40 }, (_, i) => {
    const u = (i / 40) * 2 * Math.PI;
    return rot([1.4 + 0.95 * Math.cos(u), 0.34 * Math.sin(u)], a + d, [0, 0]);
  });
  const b = Geo.board($('flower'), { x: [-2.6, 2.6], y: [-2.6, 2.6], w: 300 });
  const on = () => s.t % (360 / N) === 0;
  const orig = Array.from({ length: N }, (_, k) => b.poly(petal(k * 45 + 22.5, 0), { cls: 'petal' }));
  Array.from({ length: N }, (_, k) => b.poly(() => petal(k * 45 + 22.5, s.t), { cls: 'petal r' }));
  b.poly(Array.from({ length: 30 }, (_, i) => mul(dir(i * 12), 0.42)), { cls: 'ctr' });
  // 一片花瓣做记号，看清转了多少
  b.pt(() => rot(mul(dir(22.5), 2.2), s.t, [0, 0]), { cls: 'c2', r: 5 });
  b.onUpdate = () => {
    $('flowerTV').textContent = `${s.t}°${s.t && on() ? ' 重合！' : ''}`;
    orig.forEach((p) => p.classList.toggle('ok', s.t > 0 && on()));
  };
  slider($('flowerT'), (v) => { s.t = v; b.update(); });
}

/* ---------- 第 9 页：习题 2 正方形中 △ABE → △ADF ---------- */
function initEx2() {
  const A = [0, 4]; const B = [0, 0]; const C = [4, 0]; const D = [4, 4];
  const E = [1, 0]; const G = [0, 1.6];
  const F = rot(E, 90, A);
  const s = { t: 0 };
  const b = Geo.board($('ex2'), { x: [-0.9, 5.4], y: [-0.8, 5.6], w: 320 });
  b.poly([A, B, C, D], { cls: 'sqs' });
  b.poly([A, D, F], { cls: 'tri-g' });
  b.poly([A, B, E], { cls: 'tri-o' });
  b.poly(() => rotAll([A, B, E], s.t, A), { cls: 'tri-r' });
  b.pt(G);
  b.pt(() => rot(G, s.t, A), { cls: 'c2', show: () => s.t > 0 });
  [['A', A, -18, -4], ['B', B, -18, 18], ['C', C, 6, 18], ['D', D, 2, 20], ['E', E, -4, 22], ['F', F, 8, 2], ['G', G, -20, 6]].forEach(([n, p, dx, dy]) => lab(b, p, n, dx, dy));
  lab(b, () => (s.t === 90 ? rot(G, 90, A) : null), 'G′', -8, -10, 'lb r');
  b.onUpdate = () => { $('ex2TV').textContent = `${s.t}°${s.t === 90 ? ' 与 △ADF 重合' : ''}`; };
  slider($('ex2T'), (v) => { s.t = v; b.update(); });
}

/* ---------- 第 9 页：习题 3 方格纸平移 + 旋转 ---------- */
function initGrid3() {
  const T = [[2, 1], [6, 3], [3, 6]];
  const O = [12, 6];
  const T1 = T.map((p) => add(p, [11, 0]));
  const T2 = rotAll(T1, 90, O);
  const s = { a: 0, b: 0 }; // a：平移进度 0–1；b：旋转进度 0–1
  const b = Geo.board($('grid3'), { x: [-0.4, 24.4], y: [-0.4, 12.4], w: 420, grid: true, ticks: 1 });
  b.poly(T, { cls: 'tri-o' });
  b.poly(() => (s.a > 0 ? T.map((p) => add(p, [11 * s.a, 0])) : [HIDE, HIDE, HIDE]), { cls: 'tri-g' });
  b.poly(() => (s.b > 0 ? rotAll(T1, 90 * s.b, O) : [HIDE, HIDE, HIDE]), { cls: 'tri-r' });
  b.pt(O);
  lab(b, O, 'O', 4, -6, 'lb sm');
  ['A', 'B', 'C'].forEach((n, i) => lab(b, T[i], n, -14, 12, 'lb sm'));
  ['A₁', 'B₁', 'C₁'].forEach((n, i) => lab(b, () => (s.a === 1 ? T1[i] : null), n, 4, 14, 'lb sm g'));
  ['A₂', 'B₂', 'C₂'].forEach((n, i) => lab(b, () => (s.b === 1 ? T2[i] : null), n, 4, -4, 'lb sm r'));
  b.update();
  let raf = 0;
  const run = (key, to) => {
    cancelAnimationFrame(raf);
    const from = s[key];
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 900);
      s[key] = from + (to - from) * k;
      b.update();
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  $('grid3Btns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    const k = btn.dataset.k;
    if (k === '1') run('a', 1);
    if (k === '2') { s.a = 1; run('b', 1); }
    if (k === '0') { cancelAnimationFrame(raf); s.a = 0; s.b = 0; b.update(); }
  });
}

window.LESSON = {
  init() {
    initRuler();
    initLab();
    initTri3();
    initCons();
    initPut();
    initSq();
    initFlower();
    initEx2();
    initGrid3();
  },
  onRender(slide, step) {
    if (slide.querySelector('#cons')) { cons.k = step; cons.b.update(); }
    requestAnimationFrame(Geo.refresh);
  },
};
