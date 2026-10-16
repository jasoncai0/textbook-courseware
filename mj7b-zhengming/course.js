'use strict';
/* 七下 12.2 证明 · 本课互动：三幅错觉图“量一量”、曲径平移、代数式试值、64=65 剪拼、角平分线三角尺、
 * 第一个证明（简写切换）、证明搭积木（例 1、练一练）、转动辅助线 CE / 把角搬到 C 处、外角推论、例 2 八字形。
 * 通用部分见 ../shared/math.js、mgeo.js、mproof.js；所有图形按坐标计算。 */
const { tex, fmt } = MathKit;
const { add, sub, mul, dir, ang, angle, lerp, line, arc, right, sketch } = Geo;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const RAD = Math.PI / 180;

/* 0 → 1 的动画：每帧调用 step(t)，t 用缓动 */
function animate(ms, step) {
  const t0 = performance.now();
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / ms);
    step(ease(p));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- 第 3 页：三幅错觉图 ---------- */
function initIllusions() {
  // 图 12-1：CD = 6，B 为中点，AB = 5.4（竖直）
  {
    const s = { t: 0 };
    const b = Geo.board($('il1'), { x: [-3.6, 3.6], y: [-1.2, 6], w: 300 });
    b.seg([[-3, 0], [3, 0]], { cls: 'gs' });
    b.seg([[0, 0], [0, 5.4]], { cls: 'gs' });
    // 量一量：AB 的复制品先平移到 C，再转到 CD 上
    b.seg(() => {
      if (!s.t) return [[0, 0], [0, 0]];
      const P = lerp([0, 0], [-3, 0.35], Math.min(1, s.t * 2));
      const d = dir(90 - 90 * Math.max(0, s.t * 2 - 1));
      return [P, add(P, mul(d, 5.4))];
    }, { cls: 'ghost-l' });
    [[[0, 5.4], 'A', -6, -6], [[0, 0], 'B', -6, 22], [[-3, 0], 'C', -6, 22], [[3, 0], 'D', -6, 22]].forEach(([p, n, dx, dy]) => b.text(p, n, { dx, dy }));
    b.update();
    $('il1Btn').addEventListener('click', () => animate(1600, (t) => {
      s.t = t; b.update();
      if (t === 1) { $('il1Msg').innerHTML = '把 $AB$ 放到 $CD$ 上比一比：$AB$ 只有 $CD$ 的 $0.9$ 倍，<b>$CD$ 比 $AB$ 长</b>．'; $('il1Msg').className = 'tip feedback fb-ok'; tex($('il1Msg')); }
    }));
  }
  // 练一练 1：A(0,4) B(0,2) C(0,0)，AB = BC = 2；端点处的箭头方向不同
  {
    const s = { t: 0 };
    const b = Geo.board($('il2'), { x: [-2, 2], y: [-0.9, 4.9], w: 300 });
    b.seg([[0, 0], [0, 4]], { cls: 'gs' });
    const fins = (P, up) => [-1, 1].forEach((k) => b.seg([P, add(P, [0.45 * k, up * 0.5])], { cls: 'fin' }));
    fins([0, 4], 1); // A：向外张开（显得长）
    b.seg([[-0.25, 2], [0.25, 2]], { cls: 'fin' }); // B
    fins([0, 0], 1); // C：向里收（显得短）
    b.seg(() => (s.t ? [[1.2 * s.t, 4 - 2 * s.t], [1.2 * s.t, 2 - 2 * s.t]] : [[0, 0], [0, 0]]), { cls: 'ghost-l' });
    [[[0, 4], 'A'], [[0, 2], 'B'], [[0, 0], 'C']].forEach(([p, n]) => b.text(p, n, { dx: -30, dy: 8 }));
    b.update();
    $('il2Btn').addEventListener('click', () => animate(1400, (t) => {
      s.t = t; b.update();
      if (t === 1) { $('il2Msg').innerHTML = '把 $AB$ 向下平移到 $BC$ 旁边：两端正好对齐，<b>$AB=BC$</b>．'; $('il2Msg').className = 'tip feedback fb-ok'; tex($('il2Msg')); }
    }));
  }
  // 练一练 2：中央圆半径都是 0.55；左边围 6 个小圆，右边围 6 个大圆
  {
    const s = { t: 0 };
    const L = [-2.6, 0];
    const R = [2.2, 0];
    const r0 = 0.55;
    const b = Geo.board($('il3'), { x: [-3.9, 5.1], y: [-2.7, 2.7], w: 300 });
    const circle = (c, r, cls) => b.curve((u) => add(val(c), mul(dir(u * 360), r)), 0, 1, { cls, n: 72 });
    const val = (v) => (typeof v === 'function' ? v() : v);
    circle(L, r0, 'circ'); circle(R, r0, 'circ');
    for (let k = 0; k < 6; k++) {
      circle(add(L, mul(dir(60 * k + 30), 1.05)), 0.24, 'circ');
      circle(add(R, mul(dir(60 * k), 1.6)), 0.95, 'circ');
    }
    b.curve((u) => (s.t ? add(lerp(L, R, s.t), mul(dir(u * 360), r0)) : [NaN, NaN]), 0, 1, { cls: 'ghost-c', n: 72 });
    b.update();
    $('il3Btn').addEventListener('click', () => animate(1600, (t) => {
      s.t = t; b.update();
      if (t === 1) { $('il3Msg').innerHTML = '把左边中央的圆平移到右边：两个圆<b>完全重合</b>，一样大．'; $('il3Msg').className = 'tip feedback fb-ok'; }
    }));
  }
}

/* ---------- 第 4 页：曲径（a = 8，b = 5） ---------- */
function initPath() {
  const A = 8;
  const B = 5;
  const left = (y) => 3.3 + 0.75 * Math.sin((2 * Math.PI * y) / 5 + 0.4); // 曲径左边界；右边界 = 左边界 + 1
  const N = 60;
  const ys = Array.from({ length: N + 1 }, (_, i) => (B * i) / N);
  const s = { m: 'q', t: 0 };
  const b = Geo.board($('qj'), { x: [-0.4, 8.6], y: [-0.9, 5.5], w: 560 });
  const lawnL = () => {
    const edge = s.m === 'q' ? ys.map((y) => [left(y), y]) : [[3.5, 0], [3.5, B]];
    return [[0, 0], ...edge, [0, B]].map(([x, y]) => [x + s.t, y]);
  };
  const lawnR = () => {
    const edge = s.m === 'q' ? ys.map((y) => [left(y) + 1, y]) : [[4.5, 0], [4.5, B]];
    return [...edge, [A, B], [A, 0]];
  };
  b.poly([[0, 0], [A, 0], [A, B], [0, B]], { cls: 'road' });
  b.poly(lawnR, { cls: 'lawn' });
  b.poly(lawnL, { cls: 'lawn l' });
  b.seg([[0, -0.45], [A, -0.45]], { cls: 'dim' });
  b.text([A / 2, -0.45], 'a m', { dx: -14, dy: 20 });
  b.text([0, B / 2], 'b m', { dx: -44, dy: 6 });
  b.text([3.8, B], '1 m', { dx: -6, dy: -8 });
  b.onUpdate = () => {
    const msg = $('qjMsg');
    $('qjTV').textContent = fmt(s.t);
    $('qjRow').hidden = s.m !== 'q';
    if (s.m === 'z') { msg.className = 'tip feedback'; msg.innerHTML = '直道是长 $b$ m、宽 1 m 的长方形，面积 $b$ m²．'; }
    else if (s.t < 1) { msg.className = 'tip feedback'; msg.innerHTML = '拖动滑块，把左边草坪向右平移，看它能不能和右边草坪拼在一起．'; }
    else { msg.className = 'tip feedback fb-ok'; msg.innerHTML = '平移 1 m 后，两块草坪的弯边完全重合，拼成长 $(a-1)$ m、宽 $b$ m 的长方形．'; }
    tex(msg);
  };
  MathKit.slider($('qjT'), (v) => { s.t = v; b.update(); });
  $('qjTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-m]');
    if (!btn) return;
    s.m = btn.dataset.m;
    s.t = 0;
    $('qjT').value = 0;
    $('qjTabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    b.update();
  });
}

/* ---------- 第 5 页：x² − 2x + 2 ---------- */
function initPoly() {
  const show = () => {
    const raw = $('xIn').value;
    const x = Number(raw);
    if (raw === '' || !Number.isFinite(x)) { $('xOut').textContent = ''; $('xMsg').textContent = '请输入一个数'; return; }
    const v = x * x - 2 * x + 2;
    const sq = (x - 1) ** 2;
    const X = x < 0 ? `(${fmt(x, 4)})` : fmt(x, 4);
    $('xOut').innerHTML = `$\\Rightarrow\\ ${X}^2-2\\times${X}+2=${fmt(v, 4)}$`;
    $('xMsg').className = 'tip feedback fb-ok';
    $('xMsg').innerHTML = `$(x-1)^2+1=${fmt(sq, 4)}+1=${fmt(v, 4)}$：又是正数，而且不小于 1．`;
    tex($('xOut')); tex($('xMsg'));
  };
  $('xIn').addEventListener('input', show);
  show();
}

/* ---------- 第 6 页：64 = 65？ ----------
 * 每块纸片：正方形中的顶点 → 长方形中对应的顶点（刚体运动：旋转 + 平移） */
const PIECES = [
  { sq: [[0, 8], [3, 8], [0, 0]], rc: [[8, 5], [8, 2], [0, 5]], cls: 'pc1' }, // 三角形（直角边 8、3）
  { sq: [[3, 0], [0, 0], [3, 8]], rc: [[5, 0], [5, 3], [13, 0]], cls: 'pc1' },
  { sq: [[3, 8], [8, 8], [8, 3], [3, 5]], rc: [[8, 5], [13, 5], [13, 0], [8, 2]], cls: 'pc2' }, // 直角梯形
  { sq: [[3, 0], [8, 0], [8, 3], [3, 5]], rc: [[0, 0], [5, 0], [5, 3], [0, 5]], cls: 'pc2' },
];
const GAP = [[0, 5], [5, 3], [13, 0], [8, 2]];
const cen = (pts) => mul(pts.reduce(add, [0, 0]), 1 / pts.length);
function rigid(pc) {
  const th = ang(sub(pc.rc[1], pc.rc[0])) - ang(sub(pc.sq[1], pc.sq[0]));
  return { th, c0: cen(pc.sq), c1: cen(pc.rc) };
}
function placeAt(pc, t) {
  const { th, c0, c1 } = rigid(pc);
  const c = lerp(c0, c1, t);
  return pc.sq.map((p) => add(c, Geo.rot(sub(p, c0), th * t)));
}
function initPuzzle() {
  // 自检：刚体运动后与目标顶点重合（剪拼是精确的）
  PIECES.forEach((pc) => placeAt(pc, 1).forEach((p, i) => console.assert(Geo.dist(p, pc.rc[i]) < 1e-9, '剪拼顶点不重合')));
  const s = { t: 0, zoom: false };
  const b = Geo.board($('pz'), { x: [-0.6, 13.6], y: [-0.9, 8.6], w: 640 });
  for (let x = 0; x <= 13; x++) b.seg([[x, 0], [x, 8]], { cls: 'sqgrid' });
  for (let y = 0; y <= 8; y++) b.seg([[0, y], [13, y]], { cls: 'sqgrid' });
  PIECES.forEach((pc) => b.poly(() => placeAt(pc, s.t), { cls: pc.cls }));
  b.poly(() => (s.t === 1 ? GAP : []), { cls: 'gap' });
  b.text([4, 8], () => (s.t === 0 ? '面积 8 × 8 = 64' : ''), { dx: -50, dy: -8, cls: 'lb up' });
  b.text([6.5, 5], () => (s.t === 1 ? '13 × 5 = 65 ？' : ''), { dx: -50, dy: -10, cls: 'lb up' });
  // 4 倍放大图：x ∈ [3.5, 9.5]，y ∈ [1.3, 3.7]
  const z = Geo.board($('pzZoom'), { x: [3.5, 9.5], y: [1.3, 3.7], w: 480 });
  PIECES.forEach((pc) => z.poly(pc.rc, { cls: pc.cls }));
  z.poly(GAP, { cls: 'gap' });
  [[[5, 3], '(5, 3)', -20, -10], [[8, 2], '(8, 2)', -20, 24]].forEach(([p, t, dx, dy]) => { z.pt(p, { r: 4 }); z.text(p, t, { dx, dy, cls: 'lb up' }); });
  b.update();
  const go = (to) => {
    const from = s.t;
    animate(1800, (u) => { s.t = from + (to - from) * u; b.update(); });
  };
  $('pzBtns').addEventListener('click', (e) => {
    const a = e.target.closest('[data-a]');
    if (!a) return;
    if (a.dataset.a === 'go') go(1);
    else if (a.dataset.a === 'back') go(0);
    else {
      s.zoom = !s.zoom;
      $('pzZoom').hidden = !s.zoom;
      a.classList.toggle('solid', s.zoom);
      if (s.zoom && s.t < 1) go(1);
      z.update();
    }
  });
  return () => z.update();
}

/* ---------- 第 7 页：角平分线上的点与三角尺 ---------- */
function initBisector() {
  const s = { p: 2, d: 0 };
  const b = Geo.board($('bis'), { x: [-0.8, 5.2], y: [-0.8, 5.2], w: 460 });
  const O = [0, 0];
  b.seg([O, [0, 4.9]], { cls: 'gs' });
  b.seg([O, [4.9, 0]], { cls: 'gs' });
  b.seg([O, [4.6, 4.6]], { cls: 'gdash' });
  const P = () => [s.p, s.p];
  // 直角边方向：u 指向 OA 一侧，v 指向 OB 一侧；PE = PF = p / cos δ
  const u = () => dir(180 + s.d);
  const v = () => dir(270 + s.d);
  const L = () => s.p / Math.cos(s.d * RAD);
  const E = () => add(P(), mul(u(), L()));
  const F = () => add(P(), mul(v(), L()));
  b.poly(() => [P(), add(P(), mul(u(), L() + 0.9)), add(P(), mul(v(), L() + 0.9))], { cls: 'ruler' });
  b.seg(() => [P(), E()], { cls: 'gl c-a' });
  b.seg(() => [P(), F()], { cls: 'gl c-b' });
  right(b, P, E, F, { s: 0.28 });
  right(b, O, [0, 1], [1, 0], { s: 0.25 });
  b.pt(E); b.pt(F);
  [[[0, 4.9], 'A', -24, 8], [[4.9, 0], 'B', -4, 24], [[4.6, 4.6], 'C', 4, 0], [O, 'O', -22, 22]].forEach(([p, n, dx, dy]) => b.text(p, n, { dx, dy }));
  b.text(E, 'E', { dx: -24, dy: 6 }); b.text(F, 'F', { dx: -4, dy: 24 }); b.text(P, 'P', { dx: 10, dy: -6 });
  b.drag(P, (x, y) => { s.p = clamp(Math.round(((x + y) / 2) * 10) / 10, 1, 3.2); });
  b.onUpdate = () => {
    $('bisPE').textContent = fmt(Geo.dist(P(), E()), 2);
    $('bisPF').textContent = fmt(Geo.dist(P(), F()), 2);
    $('bisRV').textContent = `${s.d}°`;
    const msg = $('bisMsg');
    msg.className = 'tip feedback fb-ok';
    msg.innerHTML = s.d === 0
      ? '两条直角边分别与 $OA$、$OB$ 垂直：$PE=PF$．'
      : `三角尺转了 $${s.d}^\\circ$，$PE$、$PF$ 都变长了，但仍然相等．`;
    tex(msg);
  };
  MathKit.slider($('bisR'), (val) => { s.d = val; b.update(); });
}

/* ---------- 静态图：图 12-6、12-7、练一练、习题 ---------- */
function initFigures() {
  // 图 12-6：a、b 竖直，c 水平
  {
    const b = Geo.board($('f126'), { x: [-1.4, 3.6], y: [-1.6, 2.2], w: 380 });
    line(b, [0, 0], [0, 1], { cls: 'gl thin-l' });
    line(b, [2, 0], [2, 1], { cls: 'gl thin-l' });
    line(b, [0, 0], [1, 0], { cls: 'gl thin-l' });
    right(b, [0, 0], [0, 1], [1, 0], { s: 0.22 });
    right(b, [2, 0], [2, 1], [3, 0], { s: 0.22 });
    b.text([0, 0], '1', { dx: 14, dy: -16, cls: 'lb up gnum' });
    b.text([2, 0], '2', { dx: 14, dy: -16, cls: 'lb up gnum' });
    b.text([0, 2.2], 'a', { dx: 6, dy: 20 }); b.text([2, 2.2], 'b', { dx: 6, dy: 20 }); b.text([3.6, 0], 'c', { dx: -16, dy: -6 });
    b.update();
  }
  // 图 12-7：AB: y = 2，CD: y = 0，EF 与水平方向成 70°；MG、NH 分别平分 ∠EMB、∠END（35°）
  {
    const T = 70;
    const N = [1.4, 0];
    const M = add(N, mul(dir(T), 2 / Math.sin(T * RAD)));
    const P = {
      A: [-0.8, 2], B: [4.4, 2], C: [-0.8, 0], D: [4.4, 0], M, N,
      E: add(M, mul(dir(T), 1.1)), F: add(N, mul(dir(T), -1)), G: add(M, mul(dir(T / 2), 1.9)), H: add(N, mul(dir(T / 2), 1.9)),
    };
    sketch($('f127'), { P, seg: 'AB CD EF MG NH', lab: { M: [-22, -6], N: [-22, 18], A: [-18, 6], C: [-18, 6] }, w: 400, pad: 0.5 });
  }
  // 练一练 1：A(0,0) B(3,0) E(4,0) D(1,1.6) C(4,1.6)
  {
    const P = { A: [0, 0], B: [3, 0], E: [4.2, 0], D: [1, 1.6], C: [4, 1.6] };
    const b = sketch($('lx1'), { P, seg: 'AE AD DC CB AC', w: 400, pad: 0.55, lab: { E: [4, 22], B: [-4, 22], A: [-14, 20] } });
    arc(b, P.C, P.D, P.A, { r: 0.42, label: '1', lr: 1.5 });
    arc(b, P.C, P.A, P.B, { r: 0.55, label: '2', lr: 1.5 });
    arc(b, P.A, P.C, P.B, { r: 0.55, label: '3', lr: 1.5 });
    arc(b, P.A, P.D, P.C, { r: 0.42, label: '4', lr: 1.5 });
    b.update();
  }
  // p154 练一练：∠EAC = ∠B，AD 平分 ∠BAC（按此条件精确作图）
  {
    const B = [0, 0];
    const C = [3, 0];
    const A = [2.2, 2.2];
    const half = angle(A, B, C) / 2;
    const D = Geo.meet(A, add(A, dir(ang(sub(B, A)) + half)), B, C);
    const angB = angle(B, A, C);
    const E = Geo.meet(A, add(A, dir(ang(sub(C, A)) + angB)), B, C);
    sketch($('lx2'), { P: { A, B, C, D, E }, seg: 'BE AB AC AD AE', w: 360, pad: 0.4, lab: { D: [-8, 22], C: [-4, 22] } });
  }
  // 习题 5：AB ∥ CD，BC ∥ DE
  {
    const P = { A: [0, 3], B: [1.2, 3], C: [0, 0], D: [1.3, 0], E: [2.5, 3], X: [3.4, 0] };
    sketch($('hx5'), { P, seg: 'AB BC CX DE', hide: 'X', w: 300, pad: 0.4 });
  }
}

/* ---------- 第 9 页：简写切换 ---------- */
function initBrief() {
  $('briefBtn').addEventListener('click', () => {
    const on = $('pf126').classList.toggle('brief');
    $('briefBtn').textContent = on ? '恢复完整写法' : '省略虚线框（简写）';
    $('briefBtn').classList.toggle('solid', on);
  });
}

/* ---------- 第 13 页：转动射线 CE；把 ∠A、∠B 搬到 C 处 ---------- */
function initTriangle() {
  const B = [0, 0];
  const C = [4, 0];
  const A = [1.3, 2.9];
  const D = [6.6, 0];
  const PAR = ang(sub(A, B)); // CE ∥ AB 时射线 CE 的方向
  const s = { e: 40, move: false };
  const E = () => add(C, mul(dir(s.e), 2.4));
  const b = Geo.board($('tri'), { x: [-0.6, 7.2], y: [-0.7, 3.5], w: 540 });
  b.poly([A, B, C], { cls: 'trif' });
  b.seg(() => [C, D], { cls: 'gdash' });
  b.seg(() => [C, E()], { cls: 'gdash e-ray' });
  // “搬过来”的角：∠B 的复制品在 CD 与 CE∥ 之间，∠A 的复制品在 CE∥ 与 CA 之间（扇形，按真实角度）
  const wedge = (a0, a1, r) => () => (s.move ? [C, ...Array.from({ length: 31 }, (_, i) => add(C, mul(dir(a0 + ((a1 - a0) * i) / 30), r)))] : []);
  b.poly(wedge(0, PAR, 0.85), { cls: 'wB' });
  b.poly(wedge(PAR, ang(sub(A, C)), 0.85), { cls: 'wA' });
  b.poly(() => (s.move ? [B, ...Array.from({ length: 31 }, (_, i) => add(B, mul(dir((PAR * i) / 30), 0.85)))] : []), { cls: 'wB' });
  b.poly(() => (s.move ? [A, ...Array.from({ length: 31 }, (_, i) => add(A, mul(dir(ang(sub(B, A)) + ((ang(sub(C, A)) - ang(sub(B, A))) * i) / 30), 0.85)))] : []), { cls: 'wA' });
  arc(b, C, A, E, { r: 0.45, label: '1', show: () => !s.move });
  arc(b, C, E, D, { r: 0.6, label: '2', show: () => !s.move });
  [[A, 'A', -6, -8], [B, 'B', -20, 20], [C, 'C', -6, 24], [D, 'D', -6, 24]].forEach(([p, n, dx, dy]) => b.text(p, n, { dx, dy }));
  b.text(E, 'E', { dx: 6, dy: -4 });
  b.drag(E, (x, y) => {
    let d = Math.round(ang(sub([x, y], C)));
    d = clamp(d, 8, 108);
    if (Math.abs(d - PAR) < 3) d = PAR;
    s.e = d;
  });
  b.onUpdate = () => {
    const a1 = angle(C, A, E());
    const a2 = s.e;
    const aA = angle(A, B, C);
    const aB = angle(B, A, C);
    const par = s.e === PAR;
    const msg = $('triMsg');
    msg.className = `tip feedback ${par ? 'fb-ok' : ''}`;
    msg.innerHTML = s.move
      ? `$\\angle B$、$\\angle A$、$\\angle ACB$ 在 $C$ 处拼成一个平角；两块拼缝正是与 $AB$ 平行的射线．`
      : `$\\angle1=${Math.round(a1)}^\\circ$，$\\angle A=${Math.round(aA)}^\\circ$；$\\angle2=${Math.round(a2)}^\\circ$，$\\angle B=${Math.round(aB)}^\\circ$．${par ? '<b>$CE\\parallel AB$：两对角都相等！</b>' : '拖动 $E$，什么时候两对角同时相等？'}`;
    tex(msg);
  };
  $('triMove').addEventListener('click', () => {
    s.move = !s.move;
    if (s.move) s.e = PAR;
    $('triMove').classList.toggle('solid', s.move);
    b.update();
  });
  b.update();
}

/* ---------- 第 14 页：外角 ---------- */
function initExterior() {
  const B = [0, 0];
  const C = [4, 0];
  const D = [6.6, 0];
  const s = { A: [1.4, 2.6] };
  const b = Geo.board($('ext'), { x: [-0.6, 7.2], y: [-0.7, 3.5], w: 540 });
  b.poly(() => [s.A, B, C], { cls: 'trif' });
  b.seg([C, D], { cls: 'gs' });
  arc(b, () => s.A, B, C, { r: 0.4, cls: 'garc c1' });
  arc(b, B, C, () => s.A, { r: 0.4, cls: 'garc c1' });
  arc(b, C, D, () => s.A, { r: 0.55, cls: 'garc c2' });
  b.text(() => s.A, 'A', { dx: -6, dy: -10 });
  [[B, 'B', -20, 20], [C, 'C', -6, 24], [D, 'D', -6, 24]].forEach(([p, n, dx, dy]) => b.text(p, n, { dx, dy }));
  b.drag(() => s.A, (x, y) => { s.A = [clamp(x, -0.3, 6), clamp(y, 0.8, 3.2)]; });
  b.onUpdate = () => {
    const aA = angle(s.A, B, C);
    const aB = angle(B, s.A, C);
    const ext = angle(C, D, s.A);
    $('extAB').textContent = `${fmt(aA + aB, 1)}°`;
    $('extD').textContent = `${fmt(ext, 1)}°`;
  };
  b.update();
}

/* ---------- 第 15 页：例 2 八字形 ---------- */
function initEight() {
  const O = [0, 0];
  const s = { A: [1.7, 1.4], B: [-1.3, 1.6] };
  const C = () => mul(s.A, -0.9);
  const D = () => mul(s.B, -0.8);
  const b = Geo.board($('eight'), { x: [-2.6, 2.6], y: [-2, 2.2], w: 420 });
  b.seg(() => [s.A, C()], { cls: 'gs' });
  b.seg(() => [s.B, D()], { cls: 'gs' });
  b.seg(() => [s.A, s.B], { cls: 'gs' });
  b.seg(() => [C(), D()], { cls: 'gs' });
  arc(b, () => s.A, O, () => s.B, { r: 0.32, cls: 'garc c1' });
  arc(b, () => s.B, O, () => s.A, { r: 0.32, cls: 'garc c1' });
  arc(b, C, O, D, { r: 0.32, cls: 'garc c2' });
  arc(b, D, O, C, { r: 0.32, cls: 'garc c2' });
  b.text(() => s.A, 'A', { dx: 8, dy: -4 }); b.text(() => s.B, 'B', { dx: -22, dy: -4 });
  b.text(C, 'C', { dx: -22, dy: 16 }); b.text(D, 'D', { dx: 6, dy: 18 }); b.text(O, 'O', { dx: 10, dy: 6 });
  b.drag(() => s.A, (x, y) => { s.A = [clamp(x, 0.6, 2.3), clamp(y, 0.5, 2)]; });
  b.drag(() => s.B, (x, y) => { s.B = [clamp(x, -2.3, -0.4), clamp(y, 0.5, 2)]; });
  b.onUpdate = () => {
    const ab = angle(s.A, O, s.B) + angle(s.B, O, s.A);
    const cd = angle(C(), O, D()) + angle(D(), O, C());
    $('e8AB').textContent = `${fmt(ab, 1)}°`;
    $('e8CD').textContent = `${fmt(cd, 1)}°`;
  };
  b.update();
}

let redraw = () => {};
window.LESSON = {
  init() {
    initIllusions();
    initPath();
    initPoly();
    redraw = initPuzzle();
    initBisector();
    initFigures();
    initBrief();
    initTriangle();
    initExterior();
    initEight();
    MProof.init();
  },
  onRender() { requestAnimationFrame(() => { Geo.refresh(); redraw(); }); },
};
