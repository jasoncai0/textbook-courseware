'use strict';
/* 七上 5.2 图形的运动 · 本课互动：点动成线 / 线动成面（雨刷扫出扇形）、平面图形绕直线旋转成几何体（扫掠）、
 * 两块相同三角尺拼图、图 5-10 平移、图 5-11 旋转三角尺、方格纸上翻折。
 * 3D 线框见 ../shared/solid3d.js；2D 见 ../shared/math.js。所有图形由坐标计算。 */
const { board, slider, fmt } = MathKit;
const { add, mul } = Solid3D.vec;
const $ = (id) => document.getElementById(id);
const DEG = Math.PI / 180;
const views = [];
const boards = [];
const mkBoard = (id, opt) => { const b = board($(id), opt); boards.push(b); return b; };
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});
const rot2 = ([x, y], [cx, cy], a) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)];

/* 第 3 页：点动成线（拖笔尖留下轨迹）、线动成面（雨刷扫出扇形） */
function initPointLine() {
  const s = { P: [1, 1], trail: [[1, 1]] };
  const b1 = mkBoard('ptl', { x: [0, 8], y: [0, 6], axes: false, ticks: 1, w: 400 });
  b1.curve((t) => s.trail[Math.min(s.trail.length - 1, Math.round(t))], 0, () => s.trail.length - 1, { cls: 'c1', n: 600 });
  b1.drag(() => s.P, (x, y) => {
    s.P = [Math.min(7.8, Math.max(0.2, x)), Math.min(5.8, Math.max(0.2, y))];
    s.trail = [...s.trail, s.P].slice(-600);
  });
  b1.update();
  $('ptlClr').addEventListener('click', () => { s.trail = [s.P]; b1.update(); });

  const w = { a: 0 };
  const O = [4, 0.4];
  const R1 = 1.2;
  const R2 = 3.6;
  const A0 = 160 * DEG; // 雨刷从左下摆到右下：160° → 20°
  const ang = () => A0 - w.a * DEG;
  const pt = (r, a) => [O[0] + r * Math.cos(a), O[1] + r * Math.sin(a)];
  const b2 = mkBoard('wiper', { x: [0, 8], y: [0, 4.6], axes: false, grid: false, w: 400 });
  b2.poly(() => {
    const n = Math.max(2, Math.ceil(w.a / 3));
    const outer = Array.from({ length: n + 1 }, (_, i) => pt(R2, A0 - (w.a * DEG * i) / n));
    const inner = Array.from({ length: n + 1 }, (_, i) => pt(R1, A0 - (w.a * DEG * (n - i)) / n));
    return w.a > 0.1 ? [...outer, ...inner] : [];
  }, { cls: 'swept' });
  b2.seg(() => [pt(R1, ang()), pt(R2, ang())], { cls: 'c2' });
  b2.seg(() => [O, pt(R1, ang())], { cls: 'thin' });
  b2.pt(O);
  b2.update();
  slider($('wiperA'), (v) => { w.a = v; $('wiperAV').textContent = `${v}°`; b2.update(); });
}

/* 旋转扫掠：平面图形（xz 平面内，x ≥ 0）绕 z 轴转 θ。full：转满一周后画成实体的几何体 */
const circ = (cx, cz, r, n = 36, a0 = 0, a1 = 2 * Math.PI) => Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return [cx + r * Math.cos(t), cz + r * Math.sin(t)]; });
const FIGS = {
  rect: { profile: [[0, 0], [1, 0], [1, 2], [0, 2]], full: (v, on) => v.revolve(() => (on() ? { r1: 1, r2: 1, h: 2 } : null)), name: '圆柱' },
  tri: { profile: [[0, 0], [1.1, 0], [0, 2]], full: (v, on) => v.revolve(() => (on() ? { r1: 1.1, r2: 0, h: 2 } : null)), name: '圆锥' },
  coin: { profile: circ(0, 1, 1, 48), keys: [0, 4, 44], full: (v, on) => v.sphere(() => (on() ? { c: [0, 0, 1], r: 1 } : null), { show: on }), name: '球' },
  trap: { profile: [[0, 0], [0.9, 0], [0.9, 1.3], [0, 2]], full: (v, on) => { v.revolve(() => (on() ? { r1: 0.9, r2: 0.9, h: 1.3 } : null)); v.revolve(() => (on() ? { r1: 0.9, r2: 0, h: 0.7, at: [0, 0, 1.3] } : null)); }, name: '圆柱和圆锥组成的几何体' },
  tri2: { profile: [[0, 0], [1.1, 0.45], [0, 2]], full: (v, on) => { v.revolve(() => (on() ? { r1: 0.001, r2: 1.1, h: 0.45 } : null)); v.revolve(() => (on() ? { r1: 1.1, r2: 0, h: 1.55, at: [0, 0, 0.45] } : null)); }, name: '两个圆锥组成的几何体（底面贴在一起）' },
  semi: { profile: circ(0, 1, 1, 36, -Math.PI / 2, Math.PI / 2), keys: [6, 18, 30], full: (v, on) => v.sphere(() => (on() ? { c: [0, 0, 1], r: 1 } : null), { show: on }), name: '球' },
  vase: { profile: [[0, 0], [0.55, 0], [0.5, 0.25], [0.85, 0.85], [0.75, 1.3], [0.38, 1.65], [0.34, 1.85], [0.55, 2], [0, 2]], name: '花瓶形' },
  ring: { profile: circ(1.25, 1, 0.42, 36), keys: [0, 9, 18, 27], name: '圆环' },
};
function initSweep(id, sliderId, btnsId, readId, first) {
  const s = { k: first, th: 0 };
  const v = Solid3D.view($(id), { w: 520, h: 440, scale: 128, yaw: -28, pitch: 18, center: [0, 0, 1] });
  views.push(v);
  const F = () => FIGS[s.k];
  const isFull = () => s.th >= 359.5;
  const at3 = ([x, z], t) => [x * Math.cos(t), x * Math.sin(t), z];
  // 轴
  v.seg([[0, 0, -0.5], [0, 0, 2.6]], { cls: 'ax', hide: false });
  // 原位置的图形（淡）与转到 θ 处的图形
  v.face(() => F().profile.map((p) => at3(p, 0)), { cls: 'f1', show: () => !isFull() });
  v.face(() => F().profile.map((p) => at3(p, s.th * DEG)), { cls: 'f2', show: () => !isFull() || !F().full });
  v.curve(() => F().profile.map((p) => at3(p, s.th * DEG)), { closed: true, cls: 'c2', hide: false, show: () => !isFull() || !F().full });
  // 扫过的痕迹：每隔 30° 留一条“母线”，关键点画出转过的圆弧
  for (let k = 1; k < 12; k += 1) {
    v.curve(() => F().profile.map((p) => at3(p, k * 30 * DEG)), { closed: true, cls: 'thin sweep', hide: false, show: () => k * 30 <= s.th && (!isFull() || !F().full) });
  }
  const keysOf = () => (F().keys || F().profile.map((_, i) => i)).filter((i) => F().profile[i][0] > 1e-6);
  for (let j = 0; j < 12; j += 1) {
    v.curve(() => {
      const i = keysOf()[j];
      if (i === undefined || s.th < 1) return null;
      const p = F().profile[i];
      const n = Math.max(2, Math.ceil(s.th / 4));
      return Array.from({ length: n + 1 }, (_, m) => at3(p, (s.th * DEG * m) / n));
    }, { cls: 'c1 sweep', hide: false, show: () => !isFull() || !F().full });
  }
  // 转满一周：画成真正的几何体（被挡住的线画虚线）
  Object.entries(FIGS).forEach(([k, f]) => { if (f.full) f.full(v, () => isFull() && s.k === k); });
  v.update();
  const read = () => {
    $(readId).innerHTML = isFull() ? `转满一周，得到<b>${F().name}</b>。` : `已经转过 ${Math.round(s.th)}°，再转 ${Math.round(360 - s.th)}° 就满一周。`;
  };
  const sl = $(sliderId);
  slider(sl, (t) => { s.th = t; read(); v.update(); });
  btnGroup($(btnsId), (k) => { s.k = k; s.th = 0; sl.value = 0; read(); v.update(); });
  let anim = null;
  const playBtn = document.querySelector(`[data-play="${id}"]`);
  if (playBtn) playBtn.addEventListener('click', () => {
    if (anim) cancelAnimationFrame(anim);
    const t0 = performance.now();
    const DUR = 3000;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DUR);
      s.th = 360 * p; sl.value = s.th; read(); v.update();
      anim = p < 1 ? requestAnimationFrame(tick) : null;
    };
    anim = requestAnimationFrame(tick);
  });
}

/* 第 6 页：两块相同的直角三角尺（30°、60°）相等的边拼在一起 */
function initSetSquares() {
  const s = { edge: 'long', mode: 'flip' };
  const k = 1.6;
  const C = [0, 0];
  const B = [0, k]; // 短直角边 CB = k
  const A = [k * Math.sqrt(3), 0]; // 长直角边 CA = √3 k，斜边 AB = 2k
  const T1 = [A, B, C];
  const EDGES = { short: [B, C], long: [C, A], hyp: [A, B] };
  const reflect = (p, [P, Q]) => {
    const d = [Q[0] - P[0], Q[1] - P[1]];
    const t = ((p[0] - P[0]) * d[0] + (p[1] - P[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2);
    const f = [P[0] + d[0] * t, P[1] + d[1] * t];
    return [2 * f[0] - p[0], 2 * f[1] - p[1]];
  };
  const second = () => {
    const e = EDGES[s.edge];
    const M = [(e[0][0] + e[1][0]) / 2, (e[0][1] + e[1][1]) / 2];
    return T1.map((p) => (s.mode === 'flip' ? reflect(p, e) : [2 * M[0] - p[0], 2 * M[1] - p[1]]));
  };
  const NAMES = {
    'short-flip': ['等腰三角形', '两条斜边成了腰，两条长直角边连成一条底边（顶角 120°）'],
    'short-turn': ['平行四边形', '两组对边分别相等'],
    'long-flip': ['等边三角形', '三条边都等于斜边，三个角都是 60°'],
    'long-turn': ['平行四边形', '两组对边分别相等'],
    'hyp-flip': ['四边形（像风筝，两组邻边分别相等）', '短直角边与短直角边相邻，长直角边与长直角边相邻'],
    'hyp-turn': ['长方形', '四个角都是直角'],
  };
  const b = mkBoard('sq', { x: [-3.6, 6.4], y: [-3.4, 3.6], axes: false, grid: false, w: 520 });
  b.poly(T1, { cls: 'ts1' });
  b.poly(second, { cls: 'ts2' });
  b.seg(() => EDGES[s.edge], { cls: 'joint' });
  b.update();
  const read = () => {
    const [n, why] = NAMES[`${s.edge}-${s.mode}`];
    $('sqName').innerHTML = `拼成了<b>${n}</b>：${why}。`;
    b.update();
  };
  btnGroup($('sqEdge'), (x) => { s.edge = x; read(); });
  btnGroup($('sqMode'), (x) => { s.mode = x; read(); });
  read();
}

/* 第 7 页：图 5-10 平移。每格为 1；“回”字外框 6×6、内框 2×2，相邻两个相隔 2 格（周期 8 格） */
function initShift() {
  const s = { k: 0 };
  const b = mkBoard('shift', { x: [-1, 33], y: [-1, 7], axes: false, ticks: 1, w: 800 });
  b.seg([[-1, 3], [33, 3]], { cls: 'cutline' });
  for (let m = 0; m < 4; m += 1) {
    const o = 8 * m;
    const up = [[[o, 3], [o, 6], [o + 6, 6], [o + 6, 3]], [[o + 2, 3], [o + 2, 4], [o + 4, 4], [o + 4, 3]]];
    const lo = [[[o, 3], [o, 0], [o + 6, 0], [o + 6, 3]], [[o + 2, 3], [o + 2, 2], [o + 4, 2], [o + 4, 3]]];
    up.forEach((pl) => pl.slice(1).forEach((p, i) => b.seg([pl[i], p], { cls: 'c1' })));
    lo.forEach((pl) => pl.slice(1).forEach((p, i) => b.seg(() => [[pl[i][0] + s.k, pl[i][1]], [p[0] + s.k, p[1]]], { cls: 'c2' })));
  }
  b.update();
  slider($('shiftK'), (k) => {
    s.k = k;
    $('shiftKV').textContent = `${k} 格`;
    $('shiftMsg').innerHTML = k === 2 ? '这正是图 5-10(2)：虚线以下的部分向右平移了 <b>2</b> 格。' : (k === 4 ? '向右平移 <b>4</b> 格：这就是课本让你在图 5-10(3) 中画的图形。' : (k === 0 ? '这是图 5-10(1)。拖动滑块，把虚线以下的部分向右平移。' : ''));
    b.update();
  });
}

/* 第 8 页：图 5-11 旋转三角尺。R 为直角顶点，A 为 30° 角的顶点 */
function initTurn() {
  const sc = 2;
  const R = [0, 0];
  const A = [-sc * Math.sqrt(3), 0];
  const B = [0, sc];
  const T = [R, A, B];
  const targets = { t1: T.map((p) => rot2(p, R, -90 * DEG)), t2: T.map((p) => rot2(p, A, 180 * DEG)) };
  const s = { c: 'R', a: 0, found: {} };
  const centers = { R, A, B };
  const cur = () => T.map((p) => rot2(p, centers[s.c], s.a * DEG));
  const b = mkBoard('turn', { x: [-8, 4.5], y: [-3, 4.5], axes: false, ticks: 1, w: 600 });
  b.poly(targets.t1, { cls: 'tgt' });
  b.poly(targets.t2, { cls: 'tgt' });
  b.poly(cur, { cls: 'tri' });
  b.pt(() => centers[s.c], { cls: 'c2', r: 7 });
  b.text(R, 'R', { dx: 6, dy: 22 }); b.text(A, 'A', { dx: -6, dy: -10 }); b.text(B, 'B', { dx: -22, dy: 0 });
  const match = (P, Q) => P.every((p, i) => Math.hypot(p[0] - Q[i][0], p[1] - Q[i][1]) < 0.05);
  b.onUpdate = () => {
    const c = cur();
    const hit = Object.keys(targets).find((k) => match(c, targets[k]));
    if (hit) s.found = { ...s.found, [hit]: true };
    const name = { R: '直角顶点 R', A: '30° 角的顶点 A', B: '60° 角的顶点 B' }[s.c];
    const dir = s.a > 0 ? `逆时针 ${s.a}°` : (s.a < 0 ? `顺时针 ${-s.a}°` : '没有转');
    $('turnMsg').className = `tip feedback ${hit ? 'fb-ok' : ''}`;
    $('turnMsg').textContent = `绕${name}${dir}${hit ? '：和虚线位置重合了！' : '。'}（已找到 ${Object.keys(s.found).length}/2 个）`;
  };
  b.update();
  const sl = $('turnA');
  slider(sl, (a) => { s.a = a; b.update(); });
  btnGroup($('turnC'), (k) => { s.c = k; s.a = 0; sl.value = 0; b.update(); });
}

/* 第 9 页：方格纸上的翻折：沿竖直的线翻折，左边的图形与右边能完全重合吗？ */
function initFold() {
  const W = 5; // 直线左右各 5 列
  const H = 6;
  const LEFT = ['0,1', '1,1', '1,2', '2,2', '2,3', '3,3', '3,4', '4,4', '4,1', '4,2', '4,3', '4,5', '3,5', '2,5'];
  const s = { right: new Set(), show: false };
  const b = mkBoard('fold', { x: [-W - 0.3, W + 0.3], y: [-0.3, H + 0.3], axes: false, ticks: 1, w: 520 });
  const cell = (c, r) => [[c, r], [c + 1, r], [c + 1, r + 1], [c, r + 1]];
  LEFT.forEach((k) => { const [c, r] = k.split(',').map(Number); b.poly(cell(-W + c, r), { cls: 'cellL' }); });
  for (let c = 0; c < W; c += 1) {
    for (let r = 0; r < H; r += 1) {
      const key = `${c},${r}`;
      const el = b.poly(cell(c, r), { cls: 'cellR' });
      el.addEventListener('click', () => {
        s.right = new Set(s.right.has(key) ? [...s.right].filter((x) => x !== key) : [...s.right, key]);
        b.update();
      });
      b.poly(() => (s.right.has(key) ? cell(c, r) : []), { cls: 'cellOn' });
    }
  }
  b.seg([[0, -0.3], [0, H + 0.3]], { cls: 'axisl' });
  // 正确答案：左边第 c 列（离直线 W−1−c 格）翻到右边第 W−1−c 列
  const want = new Set(LEFT.map((k) => { const [c, r] = k.split(',').map(Number); return `${W - 1 - c},${r}`; }));
  LEFT.forEach((k) => { const [c, r] = k.split(',').map(Number); b.poly(() => (s.show ? cell(W - 1 - c, r) : []), { cls: 'cellAns' }); });
  b.onUpdate = () => {
    const ok = want.size === s.right.size && [...want].every((k) => s.right.has(k));
    const wrong = [...s.right].filter((k) => !want.has(k)).length;
    $('foldMsg').className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    $('foldMsg').textContent = ok ? '完全重合！每个格子到直线的距离，翻过去以后不变。' : `点右边的格子涂色（再点一次取消）。已涂 ${s.right.size} 格${wrong ? `，其中 ${wrong} 格位置不对` : ''}。`;
  };
  b.update();
  $('foldAns').addEventListener('click', () => { s.show = !s.show; b.update(); });
}

/* 第 10 页：练一练 1 的四种图案（基本图形 + 运动） */
function initPatterns() {
  const NS = 'http://www.w3.org/2000/svg';
  const put = (svg, pts, cls) => { const p = document.createElementNS(NS, 'polygon'); p.setAttribute('points', pts.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ')); p.setAttribute('class', cls); svg.appendChild(p); };
  // ① 羽毛：同一形状沿 (12, -16) 方向平移 6 次
  const feather = [[20, 140], [60, 118], [100, 112], [140, 96], [118, 108], [80, 124], [40, 138]];
  for (let i = 0; i < 6; i += 1) put($('pat1'), feather.map(([x, y]) => [x + 8 * i, y - 18 * i]), 'pf1');
  // ② 正八边形 3×3 平移
  const oct = Array.from({ length: 8 }, (_, i) => { const t = Math.PI / 8 + (i * Math.PI) / 4; return [22 * Math.cos(t), 22 * Math.sin(t)]; });
  for (let r = 0; r < 3; r += 1) for (let c = 0; c < 3; c += 1) put($('pat2'), oct.map(([x, y]) => [55 + 45 * c + x, 35 + 45 * r + y]), 'pf2');
  // ③ 三角形绕中心每次 60°
  const tri = [[0, 0], [60, -10], [52, 20]];
  for (let k = 0; k < 6; k += 1) put($('pat3'), tri.map((p) => rot2(p, [0, 0], (k * 60 * Math.PI) / 180)).map(([x, y]) => [100 + x, 80 + y]), 'pf3');
  // ④ 60° 菱形绕中心每次 60°
  const s3 = Math.sqrt(3);
  const rh = [[0, 0], [17 * s3, -17], [34 * s3, 0], [17 * s3, 17]].map(([x, y]) => [x * 0.95, y * 0.95]);
  for (let k = 0; k < 6; k += 1) put($('pat4'), rh.map((p) => rot2(p, [0, 0], (k * 60 * Math.PI) / 180)).map(([x, y]) => [100 + x, 80 + y]), 'pf4');
}

window.LESSON = {
  init() {
    initPointLine();
    initSweep('sweep', 'swT', 'swFig', 'swRead', 'rect');
    initSweep('sweep2', 'sw2T', 'sw2Fig', 'sw2Read', 'trap');
    initSetSquares();
    initShift();
    initTurn();
    initFold();
    initPatterns();
  },
  onRender(slide) {
    views.forEach((v) => { if (slide.contains(v.svg)) v.update(); });
    boards.forEach((b) => { if (slide.contains(b.svg)) b.update(); });
  },
};
