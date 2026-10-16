'use strict';
/* 七上 6.1 线段、射线、直线 · 本课互动：比较几条路的长短（两点之间线段最短）、线段→射线→直线、数线段、
 * 过一点 / 两点画直线、画线段射线直线、叠合比较线段、和差关系与中点、抽水站选址。
 * 全部用 ../shared/math.js 的作图板，长度由坐标计算（单位：格）。 */
const { board, slider, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];
const mkBoard = (id, opt) => { const b = board($(id), opt); boards.push(b); return b; };
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const bez = (P, C, Q) => (t) => [(1 - t) ** 2 * P[0] + 2 * (1 - t) * t * C[0] + t * t * Q[0], (1 - t) ** 2 * P[1] + 2 * (1 - t) * t * C[1] + t * t * Q[1]];
const curveLen = (f, n = 400) => { let s = 0; let p = f(0); for (let i = 1; i <= n; i += 1) { const q = f(i / n); s += dist(p, q); p = q; } return s; };
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});

/* 第 3 页：图 6-1 从甲地到乙地 */
function initRoads() {
  const P = [0, 0];
  const Q = [8, 0];
  const R1 = bez(P, [4, 4.4], Q);
  const R2 = bez(P, [4, 2.6], Q);
  const R3 = (t) => { const x = 8 * t; return [x, -3.2 * Math.sin(Math.PI * t) + 0.5 * Math.sin(3 * Math.PI * t)]; };
  const s = { C: [4, -1.2], showSeg: false };
  const mine = () => bez(P, s.C, Q);
  const b = mkBoard('roads', { x: [-1, 9], y: [-3.6, 3], axes: false, grid: false, w: 600 });
  b.curve(R1, 0, 1, { cls: 'road' });
  b.curve(R2, 0, 1, { cls: 'road' });
  b.curve(R3, 0, 1, { cls: 'road' });
  b.curve((t) => mine()(t), 0, 1, { cls: 'c2' });
  b.seg(() => (s.showSeg ? [P, Q] : [P, P]), { cls: 'c1' });
  b.pt(P); b.pt(Q);
  b.text(P, '甲地', { cls: 'lb up', dx: -30, dy: 26 });
  b.text(Q, '乙地', { cls: 'lb up', dx: 0, dy: 26 });
  b.text(R1(0.5), '①', { cls: 'lb up', dx: -8, dy: -8 });
  b.text(R2(0.5), '②', { cls: 'lb up', dx: -8, dy: -8 });
  b.text(R3(0.5), '③', { cls: 'lb up', dx: 12, dy: 4 });
  b.drag(() => s.C, (x, y) => { s.C = [Math.max(0.5, Math.min(7.5, x)), Math.max(-3.4, Math.min(2.8, y))]; });
  const L = [R1, R2, R3].map((f) => curveLen(f));
  b.onUpdate = () => {
    const m = curveLen(mine());
    $('roadRead').innerHTML = `①≈${fmt(L[0], 1)}　②≈${fmt(L[1], 1)}　③≈${fmt(L[2], 1)}　橙色的路≈<b>${fmt(m, 2)}</b>　线段 甲乙 = <b>8</b>（格）`;
    $('roadMsg').textContent = m < 8.01 ? '橙色的路已经被拉直，和线段重合：长度正好最小，等于 8。' : `橙色的路比线段长 ${fmt(m - 8, 2)} 格。把橙点拖到两地的连线上试试。`;
  };
  b.update();
  $('roadSeg').addEventListener('click', () => { s.showSeg = !s.showSeg; b.update(); });
}

/* 第 4 页：线段 → 射线 → 直线 */
function initExtend() {
  const s = { k: 'seg' };
  const A = [2, 0];
  const B = [6, 0];
  const b = mkBoard('ext', { x: [-0.5, 10.5], y: [-1.3, 1.3], axes: false, grid: false, w: 640 });
  b.seg(() => {
    if (s.k === 'seg') return [A, B];
    if (s.k === 'ray') return [A, [10.5, 0]];
    return [[-0.5, 0], [10.5, 0]];
  }, { cls: 'c1' });
  b.pt(A); b.pt(B);
  b.text(A, 'A', { dx: -6, dy: 28 }); b.text(B, 'B', { dx: -6, dy: 28 });
  b.text(() => (s.k === 'seg' ? [4, 0] : null), 'a', { dx: -4, dy: -10 });
  b.text(() => (s.k === 'line' ? [9.6, 0] : null), 'l', { dx: 0, dy: -10 });
  const TXT = {
    seg: '线段 $AB$（或线段 $BA$），也可以记作线段 $a$：有 2 个端点，可以度量长度。',
    ray: '把线段 $AB$ 向 $B$ 的方向延长，得到<b>射线</b> $AB$：只有 1 个端点 $A$，向一方无限延伸。射线 $AB$ 中端点字母 $A$ 必须写在前面。',
    line: '再反向延长，得到<b>直线</b> $AB$（或直线 $BA$），也可以记作直线 $l$：没有端点，向两方无限延伸。',
  };
  b.onUpdate = () => { $('extMsg').innerHTML = TXT[s.k]; MathKit.tex($('extMsg')); };
  b.update();
  btnGroup($('extK'), (k) => { s.k = k; b.update(); });
}

/* 第 5 页：图 6-3 数线段 */
function initCount() {
  const s = { n: 4, pick: [], found: [] };
  const NAMES = 'ABCDEFG';
  const xs = () => Array.from({ length: s.n }, (_, i) => (s.n === 4 ? [0, 2, 4, 6.5][i] : (6.5 * i) / (s.n - 1)));
  const b = mkBoard('cnt', { x: [-0.8, 7.3], y: [-2.6, 1.2], axes: false, grid: false, w: 600 });
  b.seg(() => [[xs()[0], 0], [xs()[s.n - 1], 0]], { cls: 'thin' });
  for (let k = 0; k < 28; k += 1) {
    b.seg(() => {
      const f = s.found[k];
      if (!f) return [[0, 0], [0, 0]];
      const y = -0.35 - 0.3 * (k % 7);
      return [[xs()[f[0]], y], [xs()[f[1]], y]];
    }, { cls: 'c2 found' });
  }
  for (let i = 0; i < 7; i += 1) {
    const on = () => i < s.n;
    b.pt(() => (on() ? [xs()[i], 0] : null), { r: 7, cls: '', show: on });
    b.text(() => (on() ? [xs()[i], 0] : null), () => NAMES[i], { dx: -6, dy: -14 });
  }
  const total = () => (s.n * (s.n - 1)) / 2;
  b.onUpdate = () => {
    $('cntList').textContent = s.found.map(([i, j]) => `${NAMES[i]}${NAMES[j]}`).join('、') || '（还没有）';
    $('cntMsg').textContent = s.found.length === total() ? `找全了！${s.n} 个点共 ${total()} 条线段。` : `已找到 ${s.found.length} 条。${s.pick.length ? `已选 ${NAMES[s.pick[0]]}，再点一个点。` : '点两个点，组成一条线段。'}`;
  };
  b.svg.addEventListener('click', (e) => {
    const p = b.svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(b.svg.getScreenCTM().inverse());
    const x = q.x / (b.W / 8.1) - 0.8;
    const i = xs().findIndex((v) => Math.abs(v - x) < 0.4);
    if (i < 0) return;
    const pick = s.pick.includes(i) ? s.pick : [...s.pick, i];
    if (pick.length === 2) {
      const [a, c] = [Math.min(...pick), Math.max(...pick)];
      if (!s.found.some(([u, v]) => u === a && v === c)) s.found = [...s.found, [a, c]];
      s.pick = [];
    } else s.pick = pick;
    b.update();
  });
  slider($('cntN'), (n) => { s.n = n; s.pick = []; s.found = []; $('cntNV').textContent = n; b.update(); });
}

/* 第 6 页：过一点 / 过两点画直线 */
function initThrough() {
  const s = { ang: 20, lines: [], useB: false };
  const A = [3, 1.5];
  const B = [7, 3.2];
  const b = mkBoard('thr', { x: [0, 10], y: [0, 5], axes: false, grid: false, w: 520 });
  const lineAt = (P, a) => { const r = (a * Math.PI) / 180; const d = [Math.cos(r) * 20, Math.sin(r) * 20]; return [[P[0] - d[0], P[1] - d[1]], [P[0] + d[0], P[1] + d[1]]]; };
  for (let k = 0; k < 12; k += 1) b.seg(() => (s.lines[k] !== undefined ? lineAt(A, s.lines[k]) : [A, A]), { cls: 'thin' });
  b.seg(() => lineAt(A, s.ang), { cls: 'c1' });
  const handle = () => { const r = (s.ang * Math.PI) / 180; return [A[0] + 2.2 * Math.cos(r), A[1] + 2.2 * Math.sin(r)]; };
  b.drag(handle, (x, y) => {
    let a = (Math.atan2(y - A[1], x - A[0]) * 180) / Math.PI;
    const ab = (Math.atan2(B[1] - A[1], B[0] - A[0]) * 180) / Math.PI;
    if (Math.abs(a - ab) < 3) a = ab; // 靠近 B 时吸附：恰好经过 B
    s.ang = a;
  });
  b.pt(A); b.pt(B);
  b.text(A, 'A', { dx: -18, dy: 22 }); b.text(B, 'B', { dx: 8, dy: 22 });
  const throughB = () => { const ab = (Math.atan2(B[1] - A[1], B[0] - A[0]) * 180) / Math.PI; const d = (((s.ang - ab) % 180) + 180) % 180; return d < 1e-6 || d > 180 - 1e-6; };
  b.onUpdate = () => { $('thrMsg').textContent = throughB() ? '这条直线同时经过 A、B。再转一点就离开 B 了——过 A、B 的直线只有这一条。' : `过点 A 已经画了 ${s.lines.length + 1} 条直线。还能画吗？`; };
  b.update();
  $('thrKeep').addEventListener('click', () => { s.lines = [...s.lines, s.ang].slice(-12); b.update(); });
}

/* 第 7 页：做一做 图 6-5 / 练一练 1：选工具，点两个点 */
function initDraw() {
  const P = { A: [5, 4.2], B: [2.2, 1], C: [7.8, 1] };
  const s = { tool: 'seg', pick: [], items: [] };
  const b = mkBoard('drw', { x: [0, 10], y: [-0.5, 5.2], axes: false, grid: false, w: 520 });
  const ext = (p, q, back, fwd) => { const d = [q[0] - p[0], q[1] - p[1]]; return [[p[0] - d[0] * back, p[1] - d[1] * back], [q[0] + d[0] * fwd, q[1] + d[1] * fwd]]; };
  for (let k = 0; k < 8; k += 1) {
    b.seg(() => {
      const it = s.items[k];
      if (!it) return [[0, 0], [0, 0]];
      const p = P[it.a]; const q = P[it.b];
      if (it.tool === 'seg') return [p, q];
      if (it.tool === 'ray') return ext(p, q, 0, 6);
      return ext(p, q, 6, 6);
    }, { cls: 'c1' });
  }
  Object.entries(P).forEach(([n, p]) => { b.pt(p, { r: 6 }); b.text(p, n, { dx: 8, dy: -8 }); });
  b.pt(() => (s.pick.length ? P[s.pick[0]] : null), { cls: 'c2', r: 10, hollow: true });
  const NAME = { seg: '线段', ray: '射线', line: '直线' };
  b.onUpdate = () => { $('drwList').textContent = s.items.map((it) => `${NAME[it.tool]} ${it.a}${it.b}`).join('，') || '（还没有画）'; };
  b.svg.addEventListener('click', (e) => {
    const p = b.svg.createSVGPoint();
    p.x = e.clientX; p.y = e.clientY;
    const q = p.matrixTransform(b.svg.getScreenCTM().inverse());
    const w = [q.x / (b.W / 10), 5.2 - q.y / (b.H / 5.7)];
    const hit = Object.keys(P).find((n) => dist(P[n], w) < 0.5);
    if (!hit) return;
    if (!s.pick.length) s.pick = [hit];
    else if (s.pick[0] !== hit) { s.items = [...s.items, { tool: s.tool, a: s.pick[0], b: hit }].slice(-8); s.pick = []; }
    b.update();
  });
  btnGroup($('drwT'), (k) => { s.tool = k; s.pick = []; b.update(); });
  $('drwClr').addEventListener('click', () => { s.items = []; s.pick = []; b.update(); });
}

/* 第 8 页：叠合法比较线段 AB 与 CD（图 6-6、6-7） */
function initOverlay() {
  const s = { len: 2.6, pos: [1, 2.2], placed: false };
  const C = [1, 0.6];
  const CD = 4;
  const b = mkBoard('ovl', { x: [0, 10], y: [-0.2, 3.2], axes: false, grid: false, w: 600 });
  b.seg([C, [9.5, C[1]]], { cls: 'dash' });
  b.seg([C, [C[0] + CD, C[1]]], { cls: 'c1' });
  b.pt(C); b.pt([C[0] + CD, C[1]]);
  b.text(C, 'C', { dx: -6, dy: 28 }); b.text([C[0] + CD, C[1]], 'D', { dx: -6, dy: 28 });
  const A = () => s.pos;
  const B = () => [s.pos[0] + s.len, s.pos[1]];
  b.seg(() => [A(), B()], { cls: 'c2' });
  b.pt(B, { cls: 'c2' });
  b.text(A, () => (s.placed ? 'C(A)' : 'A'), { dx: -6, dy: -12 });
  b.text(B, 'B', { dx: -6, dy: -12 });
  b.drag(A, (x, y) => {
    const near = Math.hypot(x - C[0], y - C[1]) < 0.35;
    s.placed = near;
    s.pos = near ? [...C] : [Math.max(0.2, Math.min(9.6 - s.len, x)), Math.max(0, Math.min(3, y))];
  });
  b.onUpdate = () => {
    const d = s.len - CD;
    const rel = Math.abs(d) < 1e-9 ? '点 B 与点 D 重合，$AB=CD$' : (d < 0 ? '点 B 落在线段 CD 上，$AB\\lt CD$' : '点 B 落在线段 CD 的延长线上，$AB\\gt CD$');
    $('ovlMsg').innerHTML = s.placed ? rel : '拖动橙色点 A，让 A 与 C 重合，AB 落在射线 CD 上。';
    MathKit.tex($('ovlMsg'));
  };
  b.update();
  slider($('ovlL'), (v) => { s.len = v; $('ovlLV').textContent = fmt(v); if (!s.placed) s.pos = [Math.min(s.pos[0], 9.6 - v), s.pos[1]]; b.update(); });
}

/* 第 9 页：和差与中点（图 6-9、6-11） */
function initSum() {
  const s = { B: 3, C: 6 };
  const A = 0.5;
  const D = 9.5;
  const b = mkBoard('sum', { x: [0, 10], y: [-1.4, 1.2], axes: false, grid: false, w: 640 });
  b.seg([[A, 0], [D, 0]], { cls: 'c1' });
  b.pt([A, 0]); b.pt([D, 0]);
  b.text([A, 0], 'A', { dx: -6, dy: 28 }); b.text([D, 0], 'D', { dx: -6, dy: 28 });
  b.text(() => [s.B, 0], 'B', { dx: -6, dy: 30 }); b.text(() => [s.C, 0], 'C', { dx: -6, dy: 30 });
  b.drag(() => [s.B, 0], (x) => { s.B = Math.round(Math.max(A + 0.5, Math.min(s.C - 0.5, x)) * 2) / 2; });
  b.drag(() => [s.C, 0], (x) => { s.C = Math.round(Math.max(s.B + 0.5, Math.min(D - 0.5, x)) * 2) / 2; });
  b.onUpdate = () => {
    const AB = s.B - A; const BC = s.C - s.B; const CD = D - s.C;
    $('sumRead').innerHTML = `$AB=${fmt(AB)}$，$BC=${fmt(BC)}$，$CD=${fmt(CD)}$，$AC=AB+BC=${fmt(AB + BC)}$，$AB=AD-DB=${fmt(D - A)}-${fmt(D - s.B)}=${fmt(AB)}$`;
    MathKit.tex($('sumRead'));
  };
  b.update();

  const m = { B: 2.6 };
  const b2 = mkBoard('mid', { x: [0, 10], y: [-1.2, 1.2], axes: false, grid: false, w: 640 });
  const Am = 1; const Cm = 9;
  b2.seg([[Am, 0], [Cm, 0]], { cls: 'c1' });
  b2.pt([Am, 0]); b2.pt([Cm, 0]);
  b2.text([Am, 0], 'A', { dx: -6, dy: 28 }); b2.text([Cm, 0], 'C', { dx: -6, dy: 28 });
  b2.text(() => [m.B, 0], 'B', { dx: -6, dy: 30 });
  b2.drag(() => [m.B, 0], (x) => { m.B = Math.round(Math.max(Am + 0.5, Math.min(Cm - 0.5, x)) * 4) / 4; });
  b2.onUpdate = () => {
    const AB = m.B - Am; const BC = Cm - m.B;
    const ok = Math.abs(AB - BC) < 1e-9;
    $('midRead').className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    $('midRead').innerHTML = `$AB=${fmt(AB)}$，$BC=${fmt(BC)}$，$AC=8$　${ok ? '→ $AB=BC=\\dfrac12AC$，点 $B$ 是线段 $AC$ 的中点！' : '→ 拖动 $B$，让 $AB=BC$'}`;
    MathKit.tex($('midRead'));
  };
  b2.update();
}

/* 第 12 页：习题 8 抽水站 */
function initPump() {
  const A = [3, 2.6];
  const B = [7.5, -2.2];
  const s = { x: 2, shown: false };
  const b = mkBoard('pump', { x: [0, 10], y: [-3, 3.4], axes: false, grid: false, w: 600 });
  b.poly([[0, -0.15], [10, -0.15], [10, 0.15], [0, 0.15]], { cls: 'river' });
  b.seg([[0, 0], [10, 0]], { cls: 'c1' });
  b.text([9.6, 0], 'l', { dx: 0, dy: -10 });
  const C = () => [s.x, 0];
  b.seg(() => [A, C()], { cls: 'c2' });
  b.seg(() => [C(), B], { cls: 'c2' });
  b.seg(() => (s.shown ? [A, B] : [A, A]), { cls: 'dash' });
  b.pt(A); b.pt(B);
  b.text(A, 'A', { dx: 8, dy: -8 }); b.text(B, 'B', { dx: 8, dy: 22 });
  b.text(C, 'C', { dx: -20, dy: -10 });
  const best = A[0] + ((B[0] - A[0]) * A[1]) / (A[1] - B[1]);
  b.drag(C, (x) => { s.x = Math.max(0.2, Math.min(9.8, x)); if (Math.abs(s.x - best) < 0.12) s.x = best; });
  b.onUpdate = () => {
    const sum = dist(A, C()) + dist(C(), B);
    const min = dist(A, B);
    $('pumpRead').innerHTML = `$AC+CB\\approx${fmt(sum, 2)}$，线段 $AB\\approx${fmt(min, 2)}$${Math.abs(sum - min) < 1e-6 ? '　→ 最小！C 在线段 AB 上' : ''}`;
    MathKit.tex($('pumpRead'));
  };
  b.update();
  $('pumpShow').addEventListener('click', () => { s.shown = !s.shown; b.update(); });
}

window.LESSON = {
  init() {
    initRoads();
    initExtend();
    initCount();
    initThrough();
    initDraw();
    initOverlay();
    initSum();
    initPump();
  },
  onRender(slide) { boards.forEach((b) => { if (slide.contains(b.svg)) b.update(); }); },
};
