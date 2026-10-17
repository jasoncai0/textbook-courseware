'use strict';
/* 九下 6.6 图形的位似 · 本课互动：点光源投影、按步骤作位似图形、位似作图台（拖位似中心 + 比的滑块）、放大缩小、坐标乘 k。
 * 所有位似点都按 P′ = O + k(P − O) 计算（k < 0 表示在 O 的另一侧），读数实时度量。 */
const { board, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const { add, sub, mul, dist, angle } = Geo;
const homo = (O, k) => (P) => add(O, mul(sub(P, O), k));
const cross = (u, v) => u[0] * v[1] - u[1] * v[0];

MProof.addBasis({
  'sas-s': { t: '两边成比例且夹角相等的两个三角形相似', kind: '判定', src: '九下 6.4（课本 p58）', body: '两边成比例且夹角相等的两个三角形相似．' },
  'sss-s': { t: '三边成比例的两个三角形相似', kind: '判定', src: '九下 6.4（课本 p60）', body: '三边成比例的两个三角形相似．' },
});

/* 顶点字母放在多边形外侧 */
function placeOut(b, get, names) {
  const nodes = names.map((n) => b.text([0, 0], n));
  return () => {
    const w = b.svg.getBoundingClientRect().width;
    const k = w ? b.W / w : 1;
    const T = get();
    const c = Geo.centroid(T.filter(Boolean));
    nodes.forEach((t, i) => {
      if (!T[i]) { t.style.display = 'none'; return; }
      t.style.display = '';
      const d = sub(T[i], c);
      const u = mul(d, 1 / (Math.hypot(...d) || 1));
      t.setAttribute('x', b.X(T[i][0]) + (u[0] * 18 - 6) * k);
      t.setAttribute('y', b.Y(T[i][1]) + (-u[1] * 18 + 8) * k);
    });
  };
}
const NAMES = ['A', 'B', 'C', 'D'];

/* ---------- 第 3 页：点光源投影 ---------- */
function initProj() {
  const s = { d: 4 };
  const O = [0, 3];
  const WALL = 10;
  const TRI = [[0, 0.8], [-0.6, -0.5], [0.7, -0.5]]; // 玻璃片上的三角形（以光轴为原点的正面坐标）
  const FC = [16.2, 3]; // 正面图的中心
  const b = Geo.board($('prBd'), { x: [-0.8, 20.2], y: [-0.8, 7.3], w: 660 });
  const k = () => WALL / s.d;
  const top = () => 3 + TRI[0][1];
  const bot = () => 3 + TRI[1][1];
  const onWall = (y) => 3 + (y - 3) * k();
  b.poly(() => [O, [WALL, onWall(top())], [WALL, onWall(bot())]], { cls: 'beam' });
  b.seg([[WALL, -0.6], [WALL, 7.1]], { cls: 'wall' });
  b.seg(() => [[s.d, 1.6], [s.d, 4.4]], { cls: 'glass' });
  b.seg(() => [O, [WALL, onWall(top())]], { cls: 'ray' });
  b.seg(() => [O, [WALL, onWall(bot())]], { cls: 'ray' });
  b.seg(() => [[s.d, top()], [s.d, bot()]], { cls: 'seg2' });
  b.seg(() => [[WALL, onWall(top())], [WALL, onWall(bot())]], { cls: 'seg1' });
  b.pt(O, { r: 8, cls: 'light' });
  b.text(O, 'O', { dx: -6, dy: 26 });
  b.text(() => [s.d, 4.4], '玻璃片', { cls: 'lb up', dx: -24, dy: -10 });
  b.text([WALL, 7.1], '墙', { cls: 'lb up', dx: 8, dy: 14 });
  b.seg([[12.4, -0.6], [12.4, 7.1]], { cls: 'thin' });
  b.text([12.6, 7.1], '正面看', { cls: 'lb up', dx: 0, dy: 14 });
  b.poly(() => TRI.map((p) => add(FC, mul(p, k()))), { cls: 'pb' });
  b.poly(TRI.map((p) => add(FC, p)), { cls: 'pa' });
  b.onUpdate = () => {
    $('prDV').textContent = fmt(s.d, 1);
    $('prMsg').className = 'tip feedback small-d fb-ok';
    $('prMsg').textContent = `相似比 = 墙上三角形 : 玻璃片上的三角形 = 10 : ${fmt(s.d, 1)} = ${fmt(k(), 2)}；影子的面积是原来的 ${fmt(k() * k(), 2)} 倍`;
  };
  MathKit.slider($('prD'), (v) => { s.d = v; b.update(); });
}

/* ---------- 第 4 页：按步骤作图（图 6-36） ---------- */
const TRY = {
  1: { O: [0, 0], P: [[2.2, 2.15], [2.1, -1.6], [4, 1.5]], k: -2 },
  2: { O: [0, 0], P: [[-2.85, 0], [2.75, 0], [2.1, 3.85], [-1.8, 2.6]].map((p) => mul(p, 1.5)), k: 0.5 },
};
function initTry() {
  const s = { q: 1, step: 0 };
  const cur = () => TRY[s.q];
  const img = () => cur().P.map(homo(cur().O, cur().k));
  const n = () => cur().P.length;
  const b = Geo.board($('tryBd'), { x: [-9.2, 6.6], y: [-4.8, 6.4], w: 620 });
  for (let i = 0; i < 4; i++) {
    b.seg(() => {
      if (i >= n() || s.step <= i) return [[0, 0], [0, 0]];
      const P = cur().P[i];
      const Q = img()[i];
      return cur().k < 0 ? [P, Q] : [cur().O, P];
    }, { cls: 'ray' });
    b.pt(() => (i < n() && s.step > i ? img()[i] : null), { r: 5, cls: 'opt' });
  }
  b.poly(() => cur().P, { cls: 'pa' });
  b.poly(() => (s.step > n() ? img() : []), { cls: 'pb' });
  b.pt(() => cur().O, { r: 6, cls: 'light' });
  b.text(() => cur().O, 'O', { dx: -18, dy: 22 });
  const l1 = placeOut(b, () => cur().P, NAMES);
  const l2 = placeOut(b, () => img().map((p, i) => (s.step > i ? p : null)).concat(n() < 4 ? [null] : []), NAMES.map((x) => `${x}′`));
  b.onUpdate = () => {
    l1(); l2();
    const msg = $('tryMsg');
    if (s.step <= n()) {
      msg.className = 'tip feedback small-d';
      msg.textContent = s.step === 0 ? '点“下一步”，依次作出各顶点的对应点。' : `已作出 ${s.step} 个对应点。${s.step === n() ? '再点一次，顺次连接。' : ''}`;
      return;
    }
    const r = cur().P.map((p, i) => dist(cur().O, img()[i]) / dist(cur().O, p));
    msg.className = 'tip feedback small-d fb-ok';
    msg.textContent = `画好了！${r.map((x, i) => `O${NAMES[i]}′ : O${NAMES[i]} = ${fmt(x, 2)}`).join('，')}。新图形与原图形形状相同。`;
  };
  document.querySelectorAll('[data-try]').forEach((btn) => btn.addEventListener('click', () => {
    s.q = +btn.dataset.try; s.step = 0;
    document.querySelectorAll('[data-try]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  }));
  $('tryStep').addEventListener('click', () => { s.step = Math.min(n() + 1, s.step + 1); b.update(); });
  $('tryReset').addEventListener('click', () => { s.step = 0; b.update(); });
  b.update();
}

/* ---------- 静态图：图 6-37 ---------- */
function homoFig(id, O, P, k, o = {}) {
  const Q = P.map(homo(O, k));
  const all = [O, ...P, ...Q];
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const b = Geo.board($(id), { x: [Math.min(...xs) - 0.8, Math.max(...xs) + 0.8], y: [Math.min(...ys) - 0.8, Math.max(...ys) + 0.8], w: o.w || 280 });
  P.forEach((p, i) => b.seg(k < 0 ? [p, Q[i]] : [O, Math.abs(k) > 1 ? Q[i] : p], { cls: 'ray' }));
  b.poly(P, { cls: 'pa' });
  b.poly(Q, { cls: 'pb' });
  b.pt(O, { r: 4 });
  b.text(O, o.oName || 'O', { dx: -6, dy: 22 });
  const l1 = placeOut(b, () => P, NAMES.slice(0, P.length));
  const l2 = placeOut(b, () => Q, NAMES.slice(0, P.length).map((x) => `${x}′`));
  b.onUpdate = () => { l1(); l2(); };
  b.update();
  return b;
}

/* ---------- 第 6 页：位似作图台 ---------- */
function initHomo() {
  let s = { O: [-1.5, 0.5], P: [[1.6, 2.6], [0.8, 0.2], [3.4, 0.9]], k: 2 };
  const Q = () => s.P.map(homo(s.O, s.k));
  const b = Geo.board($('hoBd'), { x: [-7, 9], y: [-4.6, 6.2], w: 640 });
  [0, 1, 2].forEach((i) => b.seg(() => {
    const P = s.P[i];
    const R = Q()[i];
    const far = (X) => add(s.O, mul(sub(X, s.O), 1.12));
    return s.k < 0 ? [far(P), far(R)] : [s.O, far(Math.abs(s.k) >= 1 ? R : P)];
  }, { cls: 'ray' }));
  b.poly(() => s.P, { cls: 'pa' });
  b.poly(Q, { cls: 'pb' });
  const l1 = placeOut(b, () => s.P, ['A', 'B', 'C']);
  const l2 = placeOut(b, Q, ['A′', 'B′', 'C′']);
  b.text(() => s.O, 'O', { dx: -20, dy: 22 });
  [0, 1, 2].forEach((i) => b.drag(() => s.P[i], (x, y) => {
    const nx = s.P.map((p, j) => (j === i ? [Math.min(8.6, Math.max(-6.6, x)), Math.min(5.9, Math.max(-4.3, y))] : p));
    if (Math.abs(cross(sub(nx[2], nx[1]), sub(nx[0], nx[1]))) > 0.8) s = { ...s, P: nx };
  }, { r: 7, hit: 16 }));
  b.drag(() => s.O, (x, y) => { s = { ...s, O: [Math.min(8.6, Math.max(-6.6, x)), Math.min(5.9, Math.max(-4.3, y))] }; }, { r: 9, hit: 20 });
  const dirDiff = (p1, p2, q1, q2) => {
    const a = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
    const c = Math.atan2(q2[1] - q1[1], q2[0] - q1[0]);
    let d = Math.abs(((a - c) * 180) / Math.PI) % 180;
    if (d > 90) d = 180 - d;
    return d;
  };
  b.onUpdate = () => {
    l1(); l2();
    const P = s.P;
    const R = Q();
    $('hoKV').textContent = fmt(s.k, 1);
    const angs = [0, 1, 2].map((i) => [angle(P[i], P[(i + 1) % 3], P[(i + 2) % 3]), angle(R[i], R[(i + 1) % 3], R[(i + 2) % 3])]);
    const rat = [0, 1, 2].map((i) => dist(R[i], R[(i + 1) % 3]) / dist(P[i], P[(i + 1) % 3]));
    const par = [0, 1, 2].map((i) => dirDiff(P[i], P[(i + 1) % 3], R[i], R[(i + 1) % 3]));
    const side = ['AB', 'BC', 'CA'];
    $('hoTab').innerHTML = `<tr><th></th>${['A', 'B', 'C'].map((x) => `<th>∠${x} / ∠${x}′</th>`).join('')}</tr>
      <tr><td>角</td>${angs.map(([a, c]) => `<td class="ok">${fmt(a, 1)}° / ${fmt(c, 1)}°</td>`).join('')}</tr>
      <tr><th></th>${side.map((x) => `<th>${x[0]}′${x[1]}′ : ${x}</th>`).join('')}</tr>
      <tr><td>边的比</td>${rat.map((r) => `<td class="ok">${fmt(r, 3)}</td>`).join('')}</tr>
      <tr><td>方向夹角</td>${par.map((d) => `<td class="ok">${fmt(d, 1)}°</td>`).join('')}</tr>`;
    const msg = $('hoMsg');
    const ak = Math.abs(s.k);
    msg.className = 'tip feedback small-d fb-ok';
    msg.textContent = Math.abs(s.k) < 1e-9 ? 'k = 0 时所有点都缩到 O，不是三角形。'
      : `${s.k > 0 ? 'A′ 与 A 在 O 的同侧' : 'A′ 在 OA 的反向延长线上（O 的另一侧）'}；${ak > 1 ? '放大' : ak < 1 ? '缩小' : (s.k > 0 ? '两图重合' : '大小不变：关于 O 中心对称')}，相似比 ${fmt(ak, 2)}，对应边互相平行。`;
  };
  const kIn = $('hoK');
  MathKit.slider(kIn, (v) => { s = { ...s, k: Math.abs(v) < 0.05 ? 0.1 : v }; b.update(); });
  $('hoNeg').addEventListener('click', () => { s = { ...s, k: -s.k }; kIn.value = s.k; b.update(); });
}

/* ---------- 第 8 页：图 6-38、6-39 ---------- */
const DR = {
  38: { O: [0, 0], P: [[-2, -0.7], [1.2, -0.7], [0.3, 2.5]], k: 2 },
  39: { O: [0, 0], P: [[-7.75, -1.25], [-4.25, -1.25], [-4.75, 3.9], [-7.25, 2.75]], k: 0.5 },
};
function initDraw() {
  const s = { q: 38, sign: 1 };
  const cur = () => DR[s.q];
  const k = () => cur().k * s.sign;
  const img = () => cur().P.map(homo(cur().O, k()));
  const b = Geo.board($('drBd'), { x: [-9, 5], y: [-5.4, 5.4], w: 600 });
  for (let i = 0; i < 4; i++) {
    b.seg(() => {
      if (i >= cur().P.length) return [[0, 0], [0, 0]];
      const P = cur().P[i];
      const Q = img()[i];
      return k() < 0 ? [P, Q] : [cur().O, Math.abs(k()) > 1 ? Q : P];
    }, { cls: 'ray' });
  }
  b.poly(() => cur().P, { cls: 'pa' });
  b.poly(img, { cls: 'pb' });
  b.pt(() => cur().O, { r: 6, cls: 'light' });
  b.text(() => cur().O, 'O', { dx: 8, dy: 20 });
  const l1 = placeOut(b, () => cur().P, NAMES);
  const l2 = placeOut(b, img, NAMES.map((x) => `${x}′`));
  b.onUpdate = () => { l1(); l2(); };
  document.querySelectorAll('[data-dr]').forEach((btn) => btn.addEventListener('click', () => {
    s.q = +btn.dataset.dr; s.sign = 1;
    document.querySelectorAll('[data-dr]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  }));
  $('drSide').addEventListener('click', () => { s.sign = -s.sign; b.update(); });
  b.update();
}

/* ---------- 第 9 页：坐标乘 k ---------- */
function initCoord() {
  let s = { mode: 'tri', P: [[0, 0], [5, 4], [3, 0]], k: 2 };
  const names = () => (s.mode === 'tri' ? ['O', 'A', 'B'] : NAMES);
  const img = () => s.P.map((p) => [p[0] * s.k, p[1] * s.k]);
  const b = board($('coBd'), { x: [-11, 11], y: [-9, 9], ticks: 2, w: 520 });
  b.poly(() => s.P, { cls: 'pa' });
  b.poly(img, { cls: 'pb' });
  const handles = [];
  const canDrag = (i) => !!s.P[i] && !(s.mode === 'tri' && i === 0);
  for (let i = 0; i < 4; i++) {
    b.text(() => s.P[i] || null, () => names()[i] || '', { dx: 6, dy: -6 });
    b.text(() => (img()[i] && !(s.mode === 'tri' && i === 0) ? img()[i] : null), () => `${names()[i] || ''}′`, { dx: 6, dy: -6 });
    handles[i] = b.drag(() => s.P[i] || [0, 0], (x, y) => {
      if (!s.P[i] || (s.mode === 'tri' && i === 0)) return;
      const p = [Math.round(Math.min(5, Math.max(-5, x))), Math.round(Math.min(4, Math.max(-4, y)))];
      s = { ...s, P: s.P.map((q, j) => (j === i ? p : q)) };
    }, { r: 7, hit: 16 });
  }
  b.onUpdate = () => {
    handles.forEach((g, i) => { g.style.display = canDrag(i) ? '' : 'none'; });
    const I = img();
    const f = (v) => fmt(v, 1);
    $('coTab').innerHTML = `<tr><th>点</th>${names().map((n) => `<th>${n}</th>`).join('')}</tr>
      <tr><td>原坐标</td>${s.P.map((p) => `<td>(${f(p[0])}, ${f(p[1])})</td>`).join('')}</tr>
      <tr><td>× ${fmt(s.k, 2)}</td>${I.map((p) => `<td>(${f(p[0])}, ${f(p[1])})</td>`).join('')}</tr>`;
  };
  document.querySelectorAll('[data-ck]').forEach((btn) => btn.addEventListener('click', () => {
    s = { ...s, k: +btn.dataset.ck };
    document.querySelectorAll('[data-ck]').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  }));
  $('coFig').addEventListener('click', () => { s = { ...s, mode: 'tri', P: [[0, 0], [5, 4], [3, 0]] }; b.update(); });
  $('coQuad').addEventListener('click', () => { s = { ...s, mode: 'quad', P: [[1, 1], [4, 1], [4, 3], [2, 4]] }; b.update(); });
  b.update();
}

/* ---------- 习题图 ---------- */
function initHw() {
  const s = { solved: false };
  // 第 1 题 (1)：矩形 ABCD，O 为 AB 中点，相似比 1 : 2
  const R = [[0, 0], [4, 0], [4, 2.6], [0, 2.6]];
  const O1 = [2, 0];
  const b1 = Geo.board($('h1a'), { x: [-0.6, 4.6], y: [-0.6, 3.2], w: 240 });
  b1.poly(R, { cls: 'pa' });
  b1.poly(() => (s.solved ? R.map(homo(O1, 0.5)) : []), { cls: 'pb' });
  const lr = placeOut(b1, () => R, ['A', 'B', 'C', 'D']);
  b1.pt(O1, { r: 4 }); b1.text(O1, 'O', { dx: -6, dy: 22 });
  // 第 1 题 (2)：以 B 为位似中心，△ABC 按 2 : 1 放大
  const T = [[0, 0], [3.1, 0.9], [2.1, 2.2]];
  const b2 = Geo.board($('h1b'), { x: [-3.8, 3.8], y: [-1.4, 4.1], w: 240 });
  b2.poly(T, { cls: 'pa' });
  b2.poly(() => (s.solved ? T.map(homo(T[1], 2)) : []), { cls: 'pb' });
  const lt = placeOut(b2, () => T, ['A', 'B', 'C']);
  // 第 2 题：A(2,2)、B(5,1)、C(4,3)
  const P = [[2, 2], [5, 1], [4, 3]];
  const b3 = board($('h2fig'), { x: [-11, 11], y: [-7, 7], ticks: 2, w: 320 });
  b3.poly(P, { cls: 'pa' });
  b3.poly(() => (s.solved ? P.map((p) => mul(p, 2)) : []), { cls: 'pb' });
  b3.poly(() => (s.solved ? P.map((p) => mul(p, -2)) : []), { cls: 'pc' });
  [b1, b2, b3].forEach((b) => { b.onUpdate = () => { lr(); lt(); }; });
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (!d.closest || !d.closest('.hint-ladder')) return;
    const box = d.closest('.slide');
    if (!box || !box.contains($('h2fig'))) return;
    s.solved = [...box.querySelectorAll('.hint-ladder details:last-child')].some((x) => x.open);
    [b1, b2, b3].forEach((b) => b.update());
  }, true);
  [b1, b2, b3].forEach((b) => b.update());
}

window.LESSON = {
  init() {
    MProof.init();
    initProj();
    initTry();
    homoFig('f637a', [0, 0], TRY[1].P, -2);
    homoFig('f637b', [0, 0], TRY[2].P, 0.5);
    homoFig('f637c', [0, 0], TRY[1].P, -2, { w: 300 });
    initHomo();
    initDraw();
    initCoord();
    initHw();
    document.addEventListener('toggle', () => requestAnimationFrame(Geo.refresh), true);
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
