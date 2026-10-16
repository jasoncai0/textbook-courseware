'use strict';
/* 七上 6.2 角 · 本课互动：射门角、射线旋转、叠合比较、数角、量角器、尺规作角、角平分线、方向角。
 * 所有角都由坐标计算（MAngle，见 ../shared/mangle.js），作图板横纵同比例。 */
const { board, slider, fmt, tex } = MathKit;
const { at, dir, size, span, mark, protractor, dms, norm } = MAngle;
const $ = (id) => document.getElementById(id);
const O0 = [0, 0];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const deg = (v) => `${fmt(v, 1)}°`;

/** 一条射线 + 端点字母 */
function ray(b, o, d, len, name, o2 = {}) {
  b.seg(() => [o(), at(o(), d(), len)], { cls: o2.cls || 'ray' });
  if (name) b.text(() => at(o(), d(), len + 0.3), name, { dx: -6, dy: 7, cls: o2.lcls || 'lb' });
}

/* 第 3 页：射门角（图 6-13） */
function initGoal() {
  const M = [-1.6, 4];
  const N = [1.6, 4];
  const SPOTS = { A: [-3.5, 1], B: [0.4, 0], C: [3.6, 2.2] };
  const NUM = { A: '1', B: '2', C: '3' };
  const s = { P: [...SPOTS.B], shown: false };
  const b = board($('goal'), { x: [-5, 5], y: [-0.7, 4.9], axes: false, grid: false, w: 600 });
  b.poly([[-5, 4], [5, 4], [5, 4.9], [-5, 4.9]], { cls: 'endline' });
  b.poly([M, [-1.6, 4.6], [1.6, 4.6], N], { cls: 'net' });
  b.seg([[-2.6, 4], [-2.6, 3]], { cls: 'pitch' });
  b.seg([[2.6, 4], [2.6, 3]], { cls: 'pitch' });
  b.seg([[-2.6, 3], [2.6, 3]], { cls: 'pitch' });
  b.seg([M, N], { cls: 'goalline' });
  b.text(M, 'M', { dx: -18, dy: -6 });
  b.text(N, 'N', { dx: 6, dy: -6 });
  Object.entries(SPOTS).forEach(([k, p]) => {
    b.pt(p, { r: 4 });
    b.text(p, k, { dx: -8, dy: 26 });
  });
  b.seg(() => [s.P, M], { cls: 'ray' });
  b.seg(() => [s.P, N], { cls: 'ray' });
  mark(b, () => s.P, M, N, 0.7);
  const atSpot = () => Object.keys(SPOTS).find((k) => Math.hypot(s.P[0] - SPOTS[k][0], s.P[1] - SPOTS[k][1]) < 1e-6);
  b.text(() => { const [d1, sp] = span(s.P, M, N); return at(s.P, d1 + sp / 2, 1.05); }, () => (s.shown ? `${Math.round(size(s.P, M, N))}°` : (atSpot() ? NUM[atSpot()] : '')), { cls: 'deg', dy: 6 });
  b.drag(() => s.P, (x, y) => {
    const snapK = Object.keys(SPOTS).find((k) => Math.hypot(x - SPOTS[k][0], y - SPOTS[k][1]) < 0.25);
    s.P = snapK ? [...SPOTS[snapK]] : [clamp(x, -4.8, 4.8), clamp(y, -0.5, 3.7)];
  });
  b.onUpdate = () => {
    const a = size(s.P, M, N);
    const k = atSpot();
    $('goalMsg').innerHTML = s.shown
      ? `射门角 $\\angle MPN\\approx${Math.round(a)}^\\circ$${k ? `（在点 $${k}$，即 $\\angle${NUM[k]}$）` : ''}`
      : `射门角 $\\angle MPN$：先估一估，再点“量一量”。${k ? `（现在在点 $${k}$）` : ''}`;
    tex($('goalMsg'));
  };
  $('goalBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.p) s.P = [...SPOTS[btn.dataset.p]];
    if (btn.id === 'goalMeasure') {
      s.shown = true;
      Object.entries(SPOTS).forEach(([k, p]) => { $(`g${k}`).textContent = `${Math.round(size(p, M, N))}°`; });
    }
    b.update();
  });
  b.update();
}

/* 第 4 页：图 6-14 */
function initFig614() {
  const b = board($('fig614'), { x: [-0.6, 5], y: [-0.6, 3.1], axes: false, grid: false, w: 520 });
  const d = 38;
  ray(b, () => O0, () => 0, 4.4, 'A');
  ray(b, () => O0, () => d, 4, 'B');
  mark(b, O0, [1, 0], at(O0, d, 1), 0.6);
  b.pt(O0, { r: 4 });
  b.text(O0, 'O', { dx: -20, dy: 18 });
  b.text(at(O0, d / 2, 0.95), 'α', { cls: 'lb sm', dy: 7 });
}

/* 第 5 页：射线绕端点旋转（图 6-15、6-16） */
function initSpin() {
  const s = { th: 50 };
  const L = 3.6;
  const b = board($('spin'), { x: [-4.4, 4.4], y: [-3.9, 3.9], axes: false, grid: false, w: 520 });
  b.seg([O0, [L, 0]], { cls: 'ray' });
  b.seg(() => [O0, at(O0, s.th, L)], { cls: 'ray hl' });
  // 旋转轨迹：从始边开始画到终边，半径略增，转满一周也看得清
  b.curve((t) => at(O0, s.th * t, 0.6 + 0.35 * (s.th * t) / 360), 0, 1, { cls: 'amark', n: 240 });
  b.pt(O0, { r: 4 });
  b.text(O0, 'O', { dx: -10, dy: 26 });
  b.text([L, 0], () => (s.th % 360 === 0 && s.th > 0 ? 'A(B)' : 'A'), { dx: -14, dy: 26 });
  b.text(() => (s.th % 360 === 0 ? null : at(O0, s.th, L + 0.35)), 'B', { dx: -6, dy: 7 });
  b.text([2.2, 0], '始边', { cls: 'lb up', dy: -10 });
  b.text(() => (s.th % 360 === 0 ? null : at(O0, s.th, 2.3)), '终边', { cls: 'lb up', dx: 6, dy: -6 });
  const SNAPS = [0, 90, 180, 270, 360];
  const setTh = (v) => {
    const r = Math.round(v);
    const k = SNAPS.find((q) => near(r, q, 3));
    s.th = k === undefined ? r : k;
    $('spinR').value = s.th;
  };
  b.drag(() => at(O0, s.th, L), (x, y) => {
    let d = dir(O0, [x, y]);
    if (s.th > 270 && d < 90) d = 360;
    else if (s.th < 90 && d > 270) d = 0;
    setTh(d);
  });
  const name = (t) => {
    if (t === 0) return '终边与始边重合：还没开始转';
    if (t < 90) return `${t}°，比直角小：<b>锐角</b>`;
    if (t === 90) return '90°：<b>直角</b>（转了四分之一周）';
    if (t < 180) return `${t}°，比直角大、比平角小：<b>钝角</b>`;
    if (t === 180) return '180°：终边与始边成一条直线，<b>平角</b>（转了半周）';
    if (t < 360) return `${t}°：大于平角的角（本课暂不研究）`;
    return '360°：终边与始边重合，<b>周角</b>（转了一整周）';
  };
  b.onUpdate = () => {
    $('spinV').textContent = `${s.th}°`;
    $('spinMsg').innerHTML = name(s.th);
  };
  slider($('spinR'), (v) => { s.th = v; b.update(); });
  $('spinBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-v]');
    if (!btn) return;
    s.th = +btn.dataset.v;
    $('spinR').value = s.th;
    b.update();
  });
}

/* 第 6 页：叠合法比较（图 6-17、6-18） */
function initCompare() {
  const O1 = [0.1, 0];
  const O2 = [5.8, 0];
  const BIG = 45; // ∠A'O'B'
  const s = { a: 32, t: 0, deg: false };
  const L = 3.9;
  const b = board($('cmp'), { x: [-0.5, 10.4], y: [-0.8, 3.6], axes: false, grid: false, w: 640 });
  const o1 = () => [O1[0] + (O2[0] - O1[0]) * s.t, 0];
  ray(b, () => O2, () => 0, L, null, { cls: 'ray b' });
  ray(b, () => O2, () => BIG, L, null, { cls: 'ray b' });
  mark(b, O2, [O2[0] + 1, 0], at(O2, BIG, 1), 1.0, { cls: 'amark b' });
  ray(b, o1, () => 0, L - 0.4, null, { cls: 'ray hl' });
  ray(b, o1, () => s.a, L - 0.4, null, { cls: 'ray hl' });
  mark(b, o1, () => [o1()[0] + 1, 0], () => at(o1(), s.a, 1), 0.7);
  const done = () => s.t > 0.999;
  b.text(() => at(O2, BIG, L + 0.25), 'B′', { dx: -6, dy: 4 });
  b.text(() => [O2[0] + L, 0], () => (done() ? 'A′(A)' : 'A′'), { dx: -14, dy: 26 });
  b.text(O2, () => (done() ? 'O′(O)' : 'O′'), { dx: -18, dy: 26 });
  b.text(() => at(o1(), s.a, L - 0.15), 'B', { dx: 2, dy: -2 });
  b.text(() => (done() ? null : o1()), 'O', { dx: -10, dy: 26 });
  b.text(() => (done() ? null : [o1()[0] + L - 0.4, 0]), 'A', { dx: -6, dy: 26 });
  b.text(() => (s.deg ? at(O2, BIG / 2, 1.5) : null), `${BIG}°`, { cls: 'deg b', dy: 6 });
  b.text(() => (s.deg && !done() ? at(o1(), s.a / 2, 1.15) : null), () => `${s.a}°`, { cls: 'deg', dy: 6 });
  b.onUpdate = () => {
    $('cmpV').textContent = s.deg ? `${s.a}°` : '?';
    const msg = $('cmpMsg');
    if (!done()) { msg.className = 'tip feedback'; msg.textContent = '先估计：∠AOB 与 ∠A′O′B′ 哪个大？再点“叠合”。'; return; }
    msg.className = 'tip feedback fb-ok';
    msg.textContent = s.a < BIG ? 'OB 落在 ∠A′O′B′ 的内部，所以 ∠AOB < ∠A′O′B′。'
      : s.a === BIG ? 'OB 与 O′B′ 重合，所以 ∠AOB = ∠A′O′B′。'
        : 'OB 落在 ∠A′O′B′ 的外部，所以 ∠AOB > ∠A′O′B′。';
  };
  let raf = 0;
  const animate = (to) => {
    cancelAnimationFrame(raf);
    const from = s.t;
    const t0 = performance.now();
    const DUR = 700;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / DUR);
      s.t = from + (to - from) * (1 - (1 - k) ** 3);
      b.update();
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  slider($('cmpR'), (v) => { s.a = v; b.update(); });
  $('cmpGo').addEventListener('click', () => animate(1));
  $('cmpBack').addEventListener('click', () => animate(0));
  $('cmpDeg').addEventListener('click', () => { s.deg = !s.deg; b.update(); });
}

/* 第 7 页：图 6-19 一个顶点的四条射线 */
function initRays() {
  const DIRS = { A: 210, B: 290, C: 335, D: 15 };
  const L = 3.5;
  const s = { sel: [], found: [] };
  const b = board($('rays'), { x: [-3.9, 4.2], y: [-3.9, 1.5], axes: false, grid: false, w: 560 });
  Object.entries(DIRS).forEach(([k, d]) => {
    b.seg([O0, at(O0, d, L)], { cls: 'ray' });
    b.seg(() => (s.sel.includes(k) ? [O0, at(O0, d, L)] : [O0, O0]), { cls: 'ray hl' });
    b.text(at(O0, d, L + 0.3), k, { dx: -6, dy: 7 });
  });
  const pair = () => (s.sel.length === 2 ? [...s.sel].sort() : null);
  const pts = () => pair().map((k) => at(O0, DIRS[k], 1));
  mark(b, O0, () => (pair() ? pts()[0] : [1, 0]), () => (pair() ? pts()[1] : [1, 0]), 0.8);
  b.text(() => { if (!pair()) return null; const [d1, sp] = span(O0, ...pts()); return at(O0, d1 + sp / 2, 1.35); }, () => (pair() ? `${Math.round(size(O0, ...pts()))}°` : ''), { cls: 'deg', dy: 6 });
  b.pt(O0, { r: 4 });
  b.text(O0, 'O', { dx: -6, dy: -12 });
  b.onUpdate = () => {
    const p = pair();
    const msg = $('rayMsg');
    if (!p) { msg.textContent = `任选两条射线，看它们组成的角。已找到 ${s.found.length}/6 个角`; return; }
    const nm = `∠${p[0]}O${p[1]}`;
    msg.textContent = `${nm} = ${Math.round(size(O0, ...pts()))}°　已找到 ${s.found.length}/6 个：${s.found.join('、')}`;
  };
  $('rayBtns').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-r]');
    if (!btn) return;
    const k = btn.dataset.r;
    s.sel = s.sel.includes(k) ? s.sel.filter((x) => x !== k) : [...s.sel, k].slice(-2);
    const p = pair();
    if (p && !s.found.includes(`∠${p[0]}O${p[1]}`)) s.found = [...s.found, `∠${p[0]}O${p[1]}`].sort();
    $('rayBtns').querySelectorAll('[data-r]').forEach((x) => x.classList.toggle('solid', s.sel.includes(x.dataset.r)));
    b.update();
  });
  b.update();
}

/* 第 9 页：可拖动、可旋转的量角器 */
function initProtractor() {
  const R = 3.3;
  const s = { c: [1.4, -2.3], rot: 0, oa: 20, ang: 65, O: [0, 0] };
  const b = board($('prot'), { x: [-5.2, 5.2], y: [-2.9, 4.4], axes: false, grid: false, w: 600 });
  const aligned = () => [norm(s.rot - s.oa), norm(s.rot + 180 - s.oa)].some((d) => d < 0.6 || d > 359.4);
  const centered = () => Math.hypot(s.c[0] - s.O[0], s.c[1] - s.O[1]) < 0.06;
  protractor(b, s, {
    r: R,
    onMove(st) {
      if (Math.hypot(st.c[0] - st.O[0], st.c[1] - st.O[1]) < 0.3) st.c = [...st.O];
      [st.oa, st.oa - 180].forEach((t) => { const d = norm(st.rot - t); if (d < 2.5 || d > 357.5) st.rot = t; });
    },
  });
  b.seg(() => [s.O, at(s.O, s.oa, 4.6)], { cls: 'ray b' });
  b.seg(() => [s.O, at(s.O, s.oa + s.ang, 4.6)], { cls: 'ray b' });
  mark(b, () => s.O, () => at(s.O, s.oa, 1), () => at(s.O, s.oa + s.ang, 1), 0.5, { cls: 'amark b' });
  b.text(() => at(s.O, s.oa, 4.85), 'A', { dx: -6, dy: 7 });
  b.text(() => at(s.O, s.oa + s.ang, 4.85), 'B', { dx: -6, dy: 7 });
  b.text(() => s.O, 'O', { dx: -22, dy: 6 });
  b.onUpdate = () => {
    const c1 = centered();
    const c2 = aligned();
    $('protC1').classList.toggle('ok', c1);
    $('protC2').classList.toggle('ok', c2);
    $('protC3').classList.toggle('ok', c1 && c2);
  };
  const ans = $('protAns');
  const fresh = () => {
    const oa = 5 + Math.floor(Math.random() * 36);
    let ang = 25 + Math.floor(Math.random() * 131);
    if (Math.abs(ang - s.ang) < 15) ang = ((ang + 47 - 25) % 131) + 25;
    s.oa = oa; s.ang = ang;
    s.c = [1.4, -2.3]; s.rot = 0;
    ans.dataset.ans = String(ang);
    const inp = ans.querySelector('input');
    if (inp) inp.value = '';
    ans.classList.remove('ok', 'no');
    b.update();
  };
  $('protNew').addEventListener('click', fresh);
  $('protSnap').addEventListener('click', () => { s.c = [...s.O]; s.rot = s.oa; b.update(); });
  ans.dataset.ans = String(s.ang);
  b.update();
}

/* 第 10 页：尺规作一个角等于已知角（按 → 逐步作图） */
function initConstruct() {
  const O1 = [1.6, 0];
  const O2 = [7.4, 0];
  const L = 3.3;
  const s = { th: 40, r: 1.8 };
  const b = board($('cons'), { x: [-0.3, 11.6], y: [-0.8, 3.9], axes: false, grid: false, w: 640 });
  const st = (node, n) => { node.setAttribute('data-step', n); return node; };
  const C = () => at(O1, 0, s.r);
  const D = () => at(O1, s.th, s.r);
  const C2 = () => at(O2, 0, s.r);
  const D2 = () => at(O2, s.th, s.r); // 两圆交点：|O′D′| = OC，|C′D′| = CD
  const chord = () => Math.hypot(C()[0] - D()[0], C()[1] - D()[1]);
  // 已知角
  ray(b, () => O1, () => 0, L, 'A');
  ray(b, () => O1, () => s.th, L, 'B');
  b.text(O1, 'O', { dx: -10, dy: 26 });
  // 第 1 步
  st(b.curve((t) => at(O1, -12 + (s.th + 24) * t, s.r), 0, 1, { cls: 'arc' }), 1);
  st(b.pt(C, { r: 4 }), 1); st(b.text(C, 'C', { dx: 4, dy: 24 }), 1);
  st(b.pt(D, { r: 4 }), 1); st(b.text(D, 'D', { dx: -22, dy: -4 }), 1);
  // 第 2 步
  st(b.seg(() => [O2, at(O2, 0, L + 0.5)], { cls: 'ray' }), 2);
  st(b.text(() => at(O2, 0, L + 0.5), 'A′', { dx: -6, dy: 26 }), 2);
  st(b.text(O2, 'O′', { dx: -12, dy: 26 }), 2);
  st(b.curve((t) => at(O2, -12 + (s.th + 30) * t, s.r), 0, 1, { cls: 'arc' }), 2);
  st(b.pt(C2, { r: 4 }), 2); st(b.text(C2, 'C′', { dx: 4, dy: 24 }), 2);
  // 第 3 步：以 C′ 为圆心、CD 为半径
  st(b.seg(() => [C(), D()], { cls: 'chord' }), 3);
  st(b.curve((t) => { const d0 = dir(C2(), D2()); return at(C2(), d0 - 18 + 36 * t, chord()); }, 0, 1, { cls: 'arc b' }), 3);
  st(b.seg(() => [C2(), D2()], { cls: 'chord' }), 3);
  st(b.pt(D2, { r: 4, cls: 'c2' }), 3); st(b.text(D2, 'D′', { dx: -26, dy: -4 }), 3);
  // 第 4 步
  st(b.seg(() => [O2, at(O2, s.th, L)], { cls: 'ray hl' }), 4);
  st(b.text(() => at(O2, s.th, L + 0.3), 'B′', { dx: -6, dy: 7 }), 4);
  st(mark(b, O1, () => at(O1, 0, 1), () => at(O1, s.th, 1), 0.55), 4);
  st(mark(b, O2, () => at(O2, 0, 1), () => at(O2, s.th, 1), 0.55), 4);
  b.onUpdate = () => {
    $('consV').textContent = `${s.th}°`;
    // 复核：用作出的点 D′ 的坐标重新量 ∠A′O′B′
    const check = size(O2, at(O2, 0, 1), D2());
    $('consMsg').textContent = `量一量：∠A′O′B′ = ${fmt(check, 1)}°，∠AOB = ${s.th}°，相等。`;
  };
  slider($('consR'), (v) => { s.th = v; b.update(); });
  slider($('consK'), (v) => { s.r = v; b.update(); });
}

/* 第 11 页：角的平分线 */
function initBisector() {
  const L = 3.8;
  const s = { th: 100, c: 34 };
  const b = board($('bis'), { x: [-4.3, 4.6], y: [-0.7, 4.2], axes: false, grid: false, w: 560 });
  ray(b, () => O0, () => 0, L, 'A');
  ray(b, () => O0, () => s.th, L, 'B');
  b.seg(() => [O0, at(O0, s.c, L)], { cls: 'ray hl' });
  b.text(() => at(O0, s.c, L + 0.3), 'C', { dx: -6, dy: 7 });
  mark(b, O0, [1, 0], () => at(O0, s.c, 1), 0.85);
  mark(b, O0, () => at(O0, s.c, 1), () => at(O0, s.th, 1), 1.05, { cls: 'amark b' });
  b.text(() => at(O0, s.c / 2, 1.5), () => deg(s.c), { cls: 'deg', dy: 6 });
  b.text(() => at(O0, (s.c + s.th) / 2, 1.7), () => deg(s.th - s.c), { cls: 'deg b', dy: 6 });
  b.pt(O0, { r: 4 });
  b.text(O0, 'O', { dx: -10, dy: 26 });
  const fitC = (c) => {
    const v = clamp(Math.round(c * 2) / 2, 3, s.th - 3);
    return near(v, s.th / 2, 1) ? s.th / 2 : v;
  };
  b.drag(() => at(O0, s.c, L * 0.72), (x, y) => { s.c = fitC(dir(O0, [x, y]) > 270 ? 0 : dir(O0, [x, y])); });
  b.drag(() => at(O0, s.th, L * 0.9), (x, y) => {
    const d = dir(O0, [x, y]);
    const half = s.c === s.th / 2;
    s.th = clamp(Math.round(d > 270 ? 30 : d), 30, 170);
    s.c = half ? s.th / 2 : fitC(s.c);
  });
  b.onUpdate = () => {
    const msg = $('bisMsg');
    const ok = s.c === s.th / 2;
    msg.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    msg.textContent = ok
      ? `∠AOC = ∠BOC = ${deg(s.c)}，OC 是 ∠AOB 的平分线；∠AOB = ${s.th}° = 2 × ${deg(s.c)}。`
      : `∠AOC = ${deg(s.c)}，∠BOC = ${deg(s.th - s.c)}，∠AOB = ${s.th}°。拖 OC，让两个角相等。`;
  };
  b.update();
}

/** 静态小图：一组从 O 出发的射线（度数按题中数据） */
function fan(id, rays, opt = {}) {
  const L = opt.len || 3.4;
  const b = board($(id), { x: opt.x || [-0.5, 4.3], y: opt.y || [-0.6, 3.9], axes: false, grid: false, w: opt.w || 360 });
  rays.forEach(([k, d]) => ray(b, () => O0, () => (typeof d === 'function' ? d() : d), L, k));
  b.pt(O0, { r: 3.5 });
  b.text(O0, 'O', { dx: -20, dy: 18 });
  return b;
}

function initFigs() {
  const ex = fan('ex24', [['A', 0], ['B', 30], ['C', 60], ['D', 80]], { w: 420, y: [-0.6, 3.8], x: [-0.6, 4.2] });
  mark(ex, O0, [1, 0], at(O0, 30, 1), 0.8);
  ex.text(at(O0, 15, 1.25), '30°', { cls: 'deg', dy: 6 });
  ex.update();
  fan('pr2', [['A', 0], ['B', 20], ['C', 40], ['D', 50], ['E', 60]]).update();
  fan('pr3', [['A', 0], ['B', 29.75], ['C', 50]]).update();
  fan('pr4', [['A', 0], ['B', 20], ['C', 40], ['D', 80]]).update();
  const s = { x: 30 };
  const b8 = fan('pr8', [['B', 0], ['C', () => 90 - s.x], ['D', 90], ['A', () => 180 - s.x]], { x: [-3.6, 3.9], y: [-0.6, 3.8], w: 440 });
  mark(b8, O0, () => at(O0, 90 - s.x, 1), [0, 1], 0.9);
  b8.text(() => at(O0, 90 - s.x / 2, 1.35), () => `${s.x}°`, { cls: 'deg', dy: 6 });
  b8.text(() => at(O0, 135 - s.x / 2, 2.5), () => `∠AOD=${90 - s.x}°`, { cls: 'deg g', dy: 6 });
  b8.text(() => at(O0, 45 - s.x / 2, 2.5), () => `∠BOC=${90 - s.x}°`, { cls: 'deg b', dy: 6 });
  MAngle.square(b8, O0, 0, 0.32);
  b8.onUpdate = () => { $('pr8V').textContent = `${s.x}°`; };
  slider($('pr8R'), (v) => { s.x = v; b8.update(); });
}

/* 第 14 页：方向角（习题 5） */
function initCompass() {
  const L = 3.6;
  const s = { d: 150 };
  const b = board($('compass'), { x: [-4.4, 4.4], y: [-4.4, 4.4], axes: false, grid: false, w: 440 });
  b.seg([[-L, 0], [L, 0]], { cls: 'dash' });
  b.seg([[0, -L], [0, L]], { cls: 'dash' });
  [['北', [0, L], -8, -8], ['南', [0, -L], -8, 24], ['东', [L, 0], 6, 8], ['西', [-L, 0], -30, 8]].forEach(([t, p, dx, dy]) => b.text(p, t, { cls: 'lb up', dx, dy }));
  b.seg([O0, at(O0, 40, L)], { cls: 'ray b' });
  b.text(at(O0, 40, L + 0.3), 'A', { dx: -6, dy: 7 });
  mark(b, O0, [0, 1], at(O0, 40, 1), 0.9, { cls: 'amark b' });
  b.text(at(O0, 65, 1.4), '50°', { cls: 'deg b', dy: 6 });
  b.seg(() => [O0, at(O0, s.d, L)], { cls: 'ray hl' });
  const ref = () => (s.d > 0 && s.d < 180 ? [0, 1] : [0, -1]);
  mark(b, O0, ref, () => at(O0, s.d, 1), 0.7);
  b.text(O0, 'O', { dx: 6, dy: 22 });
  b.drag(() => at(O0, s.d, L), (x, y) => { s.d = Math.round(dir(O0, [x, y])); });
  const bearing = (d) => {
    if (d === 90) return '正北';
    if (d === 270) return '正南';
    if (d === 0) return '正东';
    if (d === 180) return '正西';
    if (d < 180) return `北偏${d < 90 ? '东' : '西'} ${Math.abs(90 - d)}°`;
    return `南偏${d > 270 ? '东' : '西'} ${Math.abs(270 - d)}°`;
  };
  b.onUpdate = () => {
    const t = bearing(s.d);
    const hit = s.d === 120 || s.d === 345;
    $('compMsg').className = `tip feedback ${hit ? 'fb-ok' : ''}`;
    $('compMsg').textContent = `拖动橙色射线的端点：现在是 ${t}${hit ? '　✓ 这正是题目要画的方向之一' : ''}`;
  };
  b.update();
}

window.LESSON = {
  init() {
    initGoal();
    initFig614();
    initSpin();
    initCompare();
    initRays();
    initProtractor();
    initConstruct();
    initBisector();
    initFigs();
    initCompass();
  },
};
