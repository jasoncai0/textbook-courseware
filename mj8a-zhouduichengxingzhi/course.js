'use strict';
/* 八上 2.2 轴对称的性质 · 本课互动：折纸扎孔测量、拖动三角形与对称轴验证基本性质、图 2-8 找格点、分步画对称三角形、
 * 图 2-11 对角线交点的对称点、练习 9 个点连图、习题 5 连续翻折。
 * 通用部分见 ../shared/math.js、mgeo.js、mfold.js；对称点 = 反射变换（垂足的 2 倍减原点），判断用坐标精确比对。 */
const { fmt, tex } = MathKit;
const { add, sub, mul, dist, angle, meet, foot, line, right } = Geo;
const { reflect, move, same, ticks, tween } = MFold;
const $ = (id) => document.getElementById(id);
const HIDE = [[-99, -99], [-99, -99]];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const near = (p, q) => dist(p, q) < 1e-6;
/** 把屏幕坐标换成作图板坐标 */
const toWorld = (b, e, x0, y1) => {
  const pt = b.svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  const q = pt.matrixTransform(b.svg.getScreenCTM().inverse());
  const sx = b.X(1) - b.X(0);
  return [q.x / sx + x0, y1 - q.y / sx];
};

/* ---------- 第 3 页：扎孔 ---------- */
function initPin() {
  const W = 8; const H = 5; const X = 4;
  const L = [[X, 0], [X, 1]];
  const s = { A: null, t: 0, done: false };
  const b = Geo.board($('pin'), { x: [-0.3, W + 0.3], y: [-0.3, H + 0.3], w: 540 });
  b.poly([[0, 0], [X, 0], [X, H], [0, H]], { cls: 'paper' });
  b.poly(() => move([[X, 0], [W, 0], [W, H], [X, H]], { F: L }, s.t), { cls: 'paper r' });
  b.seg([[X, -0.2], [X, H + 0.2]], { cls: 'axis-l' });
  const A2 = () => (s.A ? reflect(s.A, ...L) : null);
  b.seg(() => (s.done ? [s.A, A2()] : HIDE), { cls: 'gdash' });
  right(b, () => (s.done ? [X, s.A[1]] : [-99, -99]), () => (s.done ? s.A : [-98, -99]), () => (s.done ? [X, H] : [-99, -98]), { s: 0.25 });
  ticks(b, () => (s.done ? s.A : [-99, -99]), () => (s.done ? [X, s.A[1]] : [-98, -99]), 1);
  ticks(b, () => (s.done ? [X, s.A[1]] : [-99, -99]), () => (s.done ? A2() : [-98, -99]), 1);
  b.pt(() => s.A, { show: () => !!s.A, r: 6 });
  b.pt(() => (s.A && (s.t > 0.98 || s.done) ? move([A2()], { F: L }, s.t)[0] : null), { show: () => !!s.A && (s.t > 0.98 || s.done), r: 6 });
  b.text(() => s.A, 'A', { dx: -18, dy: 6 });
  b.text(() => (s.done ? A2() : null), 'A′', { dx: 8, dy: 6 });
  b.text(() => (s.done ? [X, s.A[1]] : null), 'O', { dx: 4, dy: 20 });
  b.text([X, H], 'l', { dx: 6, dy: 16 });
  b.svg.addEventListener('pointerdown', (e) => {
    if (s.t > 0) return;
    const p = toWorld(b, e, -0.3, H + 0.3);
    if (p[0] < 0.3 || p[0] > X - 0.3 || p[1] < 0.3 || p[1] > H - 0.3) return;
    s.A = p; s.done = false; b.update();
    $('pinMsg').textContent = '点“对折 · 扎孔 · 展开”。';
  });
  const read = () => {
    $('pinOA').textContent = s.done ? fmt(Math.abs(s.A[0] - X)) : '—';
    $('pinOA2').textContent = s.done ? fmt(Math.abs(A2()[0] - X)) : '—';
    $('pinAng').textContent = s.done ? `${fmt(angle([X, s.A[1]], s.A, [X, H]), 1)}°` : '—';
  };
  let stop = () => {};
  $('pinGo').addEventListener('click', () => {
    if (!s.A) s.A = [1.6, 2.2];
    stop(); s.done = false;
    stop = tween(1300, (t) => { s.t = t; b.update(); }, () => {
      $('pinMsg').textContent = '针穿过两层纸……';
      setTimeout(() => { stop = tween(1300, (t) => { s.t = 1 - t; b.update(); }, () => { s.done = true; read(); b.update(); $('pinMsg').className = 'tip feedback fb-ok'; $('pinMsg').textContent = '展开：两个针孔 A、A′，连接 AA′ 交折痕 l 于 O。量一量 ↓'; }); }, 500);
    });
  });
  $('pinClr').addEventListener('click', () => { stop(); s.A = null; s.t = 0; s.done = false; read(); $('pinMsg').className = 'tip feedback'; $('pinMsg').textContent = '先在左半张纸上点一下，确定针扎的位置 A。'; tex($('pinMsg')); b.update(); });
  b.update();
}

/* ---------- 第 4 页：图 2-6；第 6 页：练习 2 ---------- */
function statics() {
  {
    const b = Geo.board($('f26'), { x: [-3, 3], y: [-2, 2.4], w: 360 });
    const A = [-2.2, 0]; const B = [2.2, 0]; const O = [0, 0];
    b.seg([A, B], { cls: 'gs' });
    b.seg([[0, -1.9], [0, 2.3]], { cls: 'gl' });
    right(b, O, B, [0, 1], { s: 0.25 });
    ticks(b, A, O, 1); ticks(b, O, B, 1);
    b.pt(A); b.pt(B);
    [['A', A, [-18, 6]], ['B', B, [6, 6]], ['O', O, [-18, 20]], ['l', [0, 2.3], [6, 14]], ['1', O, [8, -10]]].forEach(([n, p, o]) => b.text(p, n, { dx: o[0], dy: o[1] }));
    b.update();
  }
  {
    const L = [[0, 0], [0, 1]];
    const A = [-1, 2.4]; const B = [-1.8, 0.4];
    const [A2, B2] = [A, B].map((p) => reflect(p, ...L));
    const b = Geo.board($('x2'), { x: [-2.6, 2.6], y: [-0.5, 3], w: 360 });
    b.seg([[0, -0.4], [0, 2.9]], { cls: 'gl' });
    b.seg([A, B], { cls: 'gs' }); b.seg([A2, B2], { cls: 'gs' });
    b.seg([A, A2], { cls: 'gdash' }); b.seg([B, B2], { cls: 'gdash' });
    right(b, [0, A[1]], A2, [0, 2.9], { s: 0.18 }); right(b, [0, B[1]], B2, [0, 2.9], { s: 0.18 });
    [['A', A, [-16, 0]], ['B', B, [-16, 14]], ['A′', A2, [6, 0]], ['B′', B2, [6, 14]], ['P', [0, A[1]], [4, -6]], ['Q', [0, B[1]], [4, -6]], ['l', [0, 2.9], [6, 14]]].forEach(([n, p, o]) => b.text(p, n, { dx: o[0], dy: o[1] }));
    b.update();
  }
}

/* ---------- 第 5 页：基本性质 ---------- */
function initProp() {
  const s = { L1: [4, 0.2], L2: [4, 5.2], P: [[1, 4.2], [2.6, 2.8], [1.2, 1.2]] };
  const b = Geo.board($('prop'), { x: [-0.4, 8.4], y: [-0.2, 5.4], w: 520 });
  const R = () => s.P.map((p) => reflect(p, s.L1, s.L2));
  line(b, () => s.L1, () => s.L2, { cls: 'axis-l' });
  b.poly(() => s.P, { cls: 'tri-a' });
  b.poly(R, { cls: 'tri-b' });
  [0, 1, 2].forEach((i) => {
    const F = () => foot(s.P[i], s.L1, s.L2);
    b.seg(() => [s.P[i], R()[i]], { cls: 'gdash' });
    right(b, F, () => s.P[i], () => s.L2, { s: 0.18 });
    ticks(b, () => s.P[i], F, i + 1, { len: 0.12, gap: 0.08 });
    ticks(b, F, () => R()[i], i + 1, { len: 0.12, gap: 0.08 });
  });
  ['A', 'B', 'C'].forEach((n, i) => { b.text(() => s.P[i], n, { dx: -18, dy: 0 }); b.text(() => R()[i], `${n}′`, { dx: 8, dy: 0 }); });
  b.text(() => s.L2, 'l', { dx: 8, dy: 10 });
  s.P.forEach((_, i) => b.drag(() => s.P[i], (x, y) => { s.P = s.P.map((p, k) => (k === i ? [clamp(x, 0, 8), clamp(y, 0, 5.2)] : p)); }));
  b.drag(() => s.L1, (x) => { s.L1 = [clamp(x, 2.5, 5.5), 0.2]; }, { r: 7 });
  b.drag(() => s.L2, (x) => { s.L2 = [clamp(x, 2.5, 5.5), 5.2]; }, { r: 7 });
  const tab = $('propTab');
  const head = tab.rows[0].outerHTML;
  b.onUpdate = () => {
    tab.innerHTML = head + ['A', 'B', 'C'].map((n, i) => {
      const F = foot(s.P[i], s.L1, s.L2);
      return `<tr><td>${n} 与 ${n}′</td><td class="v">${fmt(dist(s.P[i], F))}</td><td class="v">${fmt(dist(R()[i], F))}</td><td class="v">${fmt(angle(F, s.P[i], s.L2), 1)}°</td></tr>`;
    }).join('');
  };
  b.update();
}

/* ---------- 第 7 页：图 2-8 ---------- */
const PTS = { A: [3, 3], B: [5, 3], C: [7, 5] };
function symAxis(pts) {
  const lines = [];
  pts.forEach((p, i) => pts.forEach((q, j) => {
    if (j <= i) return;
    const m = mul(add(p, q), 0.5);
    const d = sub(q, p);
    lines.push([m, add(m, [-d[1], d[0]])]); // 垂直平分线
    lines.push([p, q]); // 经过两点的直线
  }));
  return lines.find(([P, Q]) => same(pts.map((x) => reflect(x, P, Q)), pts, 1e-6));
}
function initF28() {
  const N = 8;
  const s = { D: null, all: false };
  const b = Geo.board($('f28'), { x: [-0.3, N + 0.3], y: [-0.3, N + 0.3], w: 400 });
  for (let i = 0; i <= N; i++) { b.seg([[i, 0], [i, N]], { cls: 'gridl' }); b.seg([[0, i], [N, i]], { cls: 'gridl' }); }
  const pts = () => (s.D ? [PTS.A, PTS.B, PTS.C, s.D] : null);
  const ax = () => (pts() && !Object.values(PTS).some((p) => near(p, s.D)) ? symAxis(pts()) : null);
  line(b, () => (ax() ? ax()[0] : [-99, -99]), () => (ax() ? ax()[1] : [-99, -98]), { cls: 'axis-all' });
  const answers = [];
  for (let x = 0; x <= N; x++) for (let y = 0; y <= N; y++) {
    const d = [x, y];
    if (!Object.values(PTS).some((p) => near(p, d)) && symAxis([PTS.A, PTS.B, PTS.C, d])) answers.push(d);
  }
  answers.forEach((d) => b.pt(d, { show: () => s.all, r: 8, cls: 'ans' }));
  Object.entries(PTS).forEach(([n, p]) => { b.pt(p); b.text(p, n, { dx: -18, dy: 20 }); });
  b.pt(() => s.D, { show: () => !!s.D, r: 7, cls: 'c2' });
  b.text(() => s.D, 'D', { dx: 6, dy: -6 });
  b.svg.addEventListener('pointerdown', (e) => {
    const p = toWorld(b, e, -0.3, N + 0.3).map((v) => Math.round(v));
    if (p[0] < 0 || p[0] > N || p[1] < 0 || p[1] > N) return;
    s.D = p; b.update();
    const m = $('f28Msg');
    if (Object.values(PTS).some((q) => near(q, p))) { m.className = 'tip feedback'; m.textContent = '这个点已经有了，换一个格点。'; return; }
    const ok = !!ax();
    m.className = `tip feedback ${ok ? 'fb-ok' : 'fb-warn'}`;
    m.textContent = ok ? `D(${p[0]}, ${p[1]}) 可以！A、B、C、D 关于绿色虚线对称。` : `D(${p[0]}, ${p[1]}) 不行：找不到一条直线，使四个点翻折后仍落在这四个点上。`;
  });
  $('f28All').addEventListener('click', () => { s.all = true; b.update(); $('f28Msg').className = 'tip feedback fb-ok'; $('f28Msg').textContent = `共 ${answers.length} 个格点：${answers.map((d) => `(${d[0]}, ${d[1]})`).join('、')}（以左下角为原点）。`; });
  $('f28Clr').addEventListener('click', () => { s.D = null; s.all = false; b.update(); $('f28Msg').className = 'tip feedback'; $('f28Msg').textContent = '先确定对称轴，再找对称点 D。'; });
  b.update();
}

/* ---------- 第 8 页：分步画对称三角形 ---------- */
function initDraw() {
  const L = [[4, 0], [4, 1]];
  const P = [[1.4, 4.2], [2.7, 2.6], [0.8, 0.9]];
  const R = P.map((p) => reflect(p, ...L));
  const s = { step: 0 };
  const b = Geo.board($('draw'), { x: [-0.3, 8.3], y: [-0.2, 5], w: 500 });
  b.seg([[4, -0.1], [4, 4.9]], { cls: 'axis-l' });
  b.poly(P, { cls: 'tri-a' });
  // 每个点两步：作垂线、截取
  P.forEach((p, i) => {
    const F = [4, p[1]];
    b.seg(() => (s.step >= 1 + 2 * i ? [p, F] : HIDE), { cls: 'gdash' });
    right(b, () => (s.step >= 1 + 2 * i ? F : [-99, -99]), () => (s.step >= 1 + 2 * i ? p : [-98, -99]), [4, 5], { s: 0.18 });
    b.seg(() => (s.step >= 2 + 2 * i ? [F, R[i]] : HIDE), { cls: 'gdash' });
    ticks(b, () => (s.step >= 2 + 2 * i ? p : [-99, -99]), () => (s.step >= 2 + 2 * i ? F : [-98, -99]), i + 1, { len: 0.12, gap: 0.08 });
    ticks(b, () => (s.step >= 2 + 2 * i ? F : [-99, -99]), () => (s.step >= 2 + 2 * i ? R[i] : [-98, -99]), i + 1, { len: 0.12, gap: 0.08 });
    b.pt(R[i], { show: () => s.step >= 2 + 2 * i, cls: 'c2' });
  });
  b.poly(() => (s.step >= 7 ? R : HIDE), { cls: 'tri-b' });
  ['A', 'B', 'C'].forEach((n, i) => { b.text(P[i], n, { dx: -18, dy: 0 }); b.text(() => (s.step >= 2 + 2 * i ? R[i] : null), `${n}′`, { dx: 8, dy: 0 }); });
  b.text([4, 4.9], 'l', { dx: 8, dy: 14 });
  const TXT = ['已知 △ABC 和直线 l，画 △ABC 关于 l 对称的 △A′B′C′。', '画 AO ⊥ l，垂足为 O。', '在 AO 的延长线上截取 OA′ = AO，得 A′。', '同样，过 B 作 l 的垂线。', '截取等长，得 B′。', '过 C 作 l 的垂线。', '截取等长，得 C′。', '连接 A′B′、B′C′、C′A′，△A′B′C′ 就是所求作的三角形。'];
  b.onUpdate = () => { $('drawMsg').className = `tip feedback ${s.step === 7 ? 'fb-ok' : ''}`; $('drawMsg').textContent = TXT[s.step]; };
  $('drawNext').addEventListener('click', () => { s.step = Math.min(7, s.step + 1); b.update(); });
  $('drawPrev').addEventListener('click', () => { s.step = Math.max(0, s.step - 1); b.update(); });
  b.update();
}

/* ---------- 第 9 页：图 2-11 ---------- */
function initF211() {
  const L = [[4, 0], [4, 1]];
  const s = { P: [[1.2, 3], [0.9, 1.9], [2.6, 0.7], [3.3, 3.4]], show: false };
  const b = Geo.board($('f211'), { x: [-0.2, 8.2], y: [0, 4.3], w: 520 });
  const R = () => s.P.map((p) => reflect(p, ...L));
  const Pp = () => meet(s.P[0], s.P[2], s.P[1], s.P[3]);
  const Q = () => meet(R()[0], R()[2], R()[1], R()[3]);
  b.seg([[4, 0.05], [4, 4.2]], { cls: 'axis-l' });
  b.poly(() => s.P, { cls: 'tri-a' });
  b.poly(R, { cls: 'tri-b' });
  b.seg(() => [s.P[0], s.P[2]], { cls: 'thin' }); b.seg(() => [s.P[1], s.P[3]], { cls: 'thin' });
  b.seg(() => (s.show ? [R()[0], R()[2]] : HIDE), { cls: 'c2' }); b.seg(() => (s.show ? [R()[1], R()[3]] : HIDE), { cls: 'c2' });
  b.seg(() => (s.show && Pp() ? [Pp(), Q()] : HIDE), { cls: 'gdash' });
  b.pt(Pp, { show: () => !!Pp() }); b.pt(Q, { show: () => s.show && !!Q(), cls: 'c2' });
  b.text(Pp, 'P', { dx: -6, dy: 22 }); b.text(() => (s.show ? Q() : null), 'Q', { dx: -6, dy: 22 });
  const NM = ['A', 'B', 'C', 'D'];
  const NM2 = ['E', 'F', 'G', 'H'];
  const off = [[-18, 0], [-18, 10], [-4, 22], [-4, -8]];
  NM.forEach((n, i) => { b.text(() => s.P[i], n, { dx: off[i][0], dy: off[i][1] }); b.text(() => R()[i], NM2[i], { dx: -off[i][0] - 8, dy: off[i][1] }); });
  b.text([4, 4.2], 'l', { dx: 8, dy: 14 });
  s.P.forEach((_, i) => b.drag(() => s.P[i], (x, y) => { s.P = s.P.map((p, k) => (k === i ? [clamp(x, 0.2, 3.7), clamp(y, 0.3, 4)] : p)); }));
  b.onUpdate = () => {
    const m = $('f211Msg');
    if (!s.show || !Pp() || !Q()) { m.className = 'tip feedback'; m.textContent = '点按钮画出 EG、FH。'; return; }
    const ok = near(Q(), reflect(Pp(), ...L));
    m.className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    m.textContent = `EG 与 FH 的交点 Q 到 l 的距离 ${fmt(Math.abs(Q()[0] - 4))}，P 到 l 的距离 ${fmt(Math.abs(Pp()[0] - 4))}，PQ ⊥ l——Q 正是 P 的对称点。`;
  };
  $('f211Go').addEventListener('click', () => { s.show = true; b.update(); });
  b.update();
}

/* ---------- 第 10 页：练习 1 的 9 个点（按课本方格图读取的坐标，l 为 x = 0） ---------- */
const NINE = [[0, 2], [-1, 3], [-2, 1], [-4, 2], [-4, 4], [-7, 7], [-5, 9], [-1, 7], [2, 10]];
function initNine() {
  const s = { left: false, t: 0 };
  const b = Geo.board($('nine'), { x: [-8.4, 9.4], y: [-0.4, 11.4], w: 560 });
  for (let x = -8; x <= 9; x++) b.seg([[x, 0], [x, 11]], { cls: 'gridl' });
  for (let y = 0; y <= 11; y++) b.seg([[-8, y], [9, y]], { cls: 'gridl' });
  b.seg([[0, -0.3], [0, 11.3]], { cls: 'axis-l' });
  const M = NINE.map(([x, y]) => [-x, y]);
  const k = () => Math.floor(s.t * 9.999); // 已画出几个对称点
  NINE.slice(1).forEach((p, i) => b.seg(() => (s.left ? [NINE[i], p] : HIDE), { cls: 'c1' }));
  M.slice(1).forEach((p, i) => b.seg(() => (s.t >= 1 ? [M[i], p] : HIDE), { cls: 'c2' }));
  NINE.forEach((p, i) => { b.pt(p); b.text(p, String(i + 1), { cls: 'lb up sm', dx: -16, dy: 18 }); });
  M.forEach((p, i) => { b.pt(p, { show: () => i < k() || s.t >= 1, cls: 'c2' }); b.text(() => (i < k() || s.t >= 1 ? p : null), `${i + 1}′`, { cls: 'lb up sm mv', dx: 6, dy: 18 }); });
  let stop = () => {};
  $('nineLeft').addEventListener('click', () => { s.left = true; b.update(); });
  $('nineGo').addEventListener('click', () => { stop(); s.left = true; stop = tween(3000, (t) => { s.t = t; b.update(); }); });
  $('nineClr').addEventListener('click', () => { stop(); s.left = false; s.t = 0; b.update(); });
  b.update();
}

/* ---------- 第 11 页：习题 5 ---------- */
function initFour() {
  const l1 = [[0, 0], [1, 0]]; const l2 = [[0, 0], [0, 1]];
  const I = [[0, 1.8], [0.8, 0], [1.9, 1.2]];
  const II = I.map((p) => reflect(p, ...l2));
  const III = II.map((p) => reflect(p, ...l1));
  const IV = III.map((p) => reflect(p, ...l2));
  const s = { n: 1, t: 1 };
  const b = Geo.board($('four'), { x: [-2.6, 2.6], y: [-2.3, 2.3], w: 420 });
  b.seg([[-2.5, 0], [2.5, 0]], { cls: 'gl' }); b.seg([[0, -2.2], [0, 2.2]], { cls: 'gl' });
  right(b, [0, 0], [1, 0], [0, 1], { s: 0.18 });
  const FR = [null, [I, l2], [II, l1], [III, l2]];
  const TR = [I, II, III, IV];
  TR.forEach((T, i) => b.poly(() => (s.n > i + 1 || (s.n === i + 1 && s.t >= 1) ? T : (s.n === i + 1 ? move(FR[i][0], { F: FR[i][1] }, s.t) : HIDE)), { cls: i ? 'tri-m' : 'tri-a' }));
  ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'].forEach((n, i) => b.text(() => (s.n >= i + 1 && (s.n > i + 1 || s.t >= 1) ? Geo.centroid(TR[i]) : null), n, { cls: 'lb up', dx: -6, dy: 7 }));
  b.text([2.5, 0], 'l₁', { dx: -16, dy: -8 }); b.text([0, 2.2], 'l₂', { dx: 6, dy: 14 });
  let stop = () => {};
  const go = (n) => {
    if (n !== s.n + 1) return;
    stop(); s.n = n;
    stop = tween(1400, (t) => { s.t = t; b.update(); }, () => {
      if (n === 4) { const ok = same(IV.map((p) => reflect(p, ...l1)), I); $('fourMsg').className = 'tip feedback fb-ok'; $('fourMsg').textContent = ok ? '检验：把 Ⅳ 沿 l₁ 翻折，与 Ⅰ 完全重合——Ⅳ 与 Ⅰ 关于 l₁ 对称。' : ''; }
    });
  };
  $('four2').addEventListener('click', () => go(2));
  $('four3').addEventListener('click', () => go(3));
  $('four4').addEventListener('click', () => go(4));
  $('fourR').addEventListener('click', () => { stop(); s.n = 1; s.t = 1; $('fourMsg').className = 'tip feedback'; $('fourMsg').textContent = '按顺序点三个按钮。'; b.update(); });
  $('fourMsg').textContent = '按顺序点三个按钮。';
  b.update();
}

window.LESSON = {
  init() {
    initPin();
    statics();
    initProp();
    initF28();
    initDraw();
    initF211();
    initNine();
    initFour();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};

