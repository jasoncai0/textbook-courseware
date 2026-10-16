'use strict';
/* 八上 1.1 全等图形 · 本课互动：枫叶叠合、图 1-1 点选叠合验证、图 1-2 点阵上的平移/翻折/旋转、正方形分成两个全等图形、习题分割图。
 * 通用部分见 ../shared/math.js、mgeo.js、mfold.js；所有图形由坐标计算，叠合判断用顶点坐标逐一比对。 */
const { add, rot, centroid } = Geo;
const { move, tween } = MFold;
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const lerp = (a, b, t) => a + (b - a) * t;
const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6;

/* ---------- 第 3 页：两片枫叶叠合（先平移再旋转） ---------- */
const LEAF = [[0, 3.2], [0.55, 2.1], [1.45, 2.55], [1.2, 1.5], [2.3, 1.75], [1.65, 0.95], [2.05, 0.55], [0.55, 0.35], [0.12, -0.2],
  [0.12, -1.1], [-0.12, -1.1], [-0.12, -0.2], [-0.55, 0.35], [-2.05, 0.55], [-1.65, 0.95], [-2.3, 1.75], [-1.2, 1.5], [-1.45, 2.55], [-0.55, 2.1]];
function initLeaf() {
  const P0 = [-3.4, -0.8];
  const P1 = [3.6, -0.5];
  const ANG = 38;
  const s = { t: 0 };
  const b = Geo.board($('leafBd'), { x: [-7, 7.4], y: [-2.6, 3.2], w: 560 });
  const place = (c, a) => LEAF.map((p) => add(rot(p, a), c));
  b.poly(place(P0, 0), { cls: 'leaf0' });
  const mover = b.poly(() => {
    const t1 = Math.min(1, s.t * 2);
    const t2 = Math.max(0, s.t * 2 - 1);
    return place([lerp(P1[0], P0[0], t1), lerp(P1[1], P0[1], t1)], lerp(ANG, 0, t2));
  }, { cls: 'leaf1' });
  b.onUpdate = () => mover.classList.toggle('on', s.t > 0.999);
  let stop = () => {};
  const run = (to) => {
    stop();
    const from = s.t;
    stop = tween(1600, (t) => { s.t = lerp(from, to, t); b.update(); }, () => {
      $('leafMsg').className = `tip feedback ${to ? 'fb-ok' : ''}`;
      $('leafMsg').textContent = to ? '先平移、再旋转 38°：两片枫叶完全重合，没有一处露出来。' : '两片“枫叶”由同样的正方形纸片剪成，右边那片被转了一个角度。';
    });
  };
  $('leafGo').addEventListener('click', () => run(1));
  $('leafBack').addEventListener('click', () => run(0));
  b.update();
}

/* ---------- 第 4 页：图 1-1 ---------- */
const SQ = 50;
const SHAPES = {
  ring: () => {
    const [R, r, h] = [52, 27, 10];
    const xo = Math.sqrt(R * R - h * h);
    const xi = Math.sqrt(r * r - h * h);
    return `M${-xo} ${-h} A${R} ${R} 0 1 1 ${-xo} ${h} L${-xi} ${h} A${r} ${r} 0 1 0 ${-xi} ${-h} Z`;
  },
  spool: () => 'M-26 -56 L22 -56 Q2 0 30 56 L-30 56 Q-6 -4 -26 -56 Z',
  thin: () => 'M-88 46 L86 -50 L8 46 Z',
  heart: () => 'M0 44 C-62 2 -58 -46 -27 -46 C-11 -46 0 -36 0 -24 C0 -36 11 -46 27 -46 C58 -46 62 2 0 44 Z',
  tee: () => `M${-1.5 * SQ} ${SQ} H${1.5 * SQ} V0 H${0.5 * SQ} V${-SQ} H${-0.5 * SQ} V0 H${-1.5 * SQ} Z M${-0.5 * SQ} 0 V${SQ} M${0.5 * SQ} 0 V${SQ} M${-0.5 * SQ} 0 H${0.5 * SQ}`,
  ell: () => `M${-1.5 * SQ} ${SQ} H${1.5 * SQ} V${-SQ} H${0.5 * SQ} V0 H${-1.5 * SQ} Z M${-0.5 * SQ} 0 V${SQ} M${0.5 * SQ} 0 V${SQ}`,
  para: () => 'M-48 32 L22 32 L48 -32 L-22 -32 Z',
};
// 每个图形：基本形状 + 位置、旋转角、是否翻面、缩放。基本形状和缩放都相同 ⇔ 全等
const F11 = [
  { k: 'ring', x: 75, y: 75 }, { k: 'spool', x: 240, y: 75 }, { k: 'thin', x: 405, y: 75 },
  { k: 'heart', x: 590, y: 75 }, { k: 'tee', x: 770, y: 75, s: 0.8 }, { k: 'para', x: 945, y: 75 },
  { k: 'heart', x: 75, y: 270, r: -24 }, { k: 'ell', x: 250, y: 270, s: 0.8 }, { k: 'spool', x: 415, y: 270, f: true },
  { k: 'thin', x: 590, y: 270 }, { k: 'ring', x: 770, y: 270 }, { k: 'para', x: 945, y: 270, s: 1.5 },
].map((o, i) => ({ r: 0, f: false, s: 1, ...o, i }));
const congruent = (a, b) => a.k === b.k && a.s === b.s;
const tf = (o) => `translate(${o.x} ${o.y}) rotate(${o.r}) scale(${o.sx ?? (o.f ? -1 : 1) * o.s} ${o.s})`;

function initF11() {
  const svg = el('svg', { viewBox: '-10 0 1040 370', class: 'f11svg' }, $('f11'));
  const st = { pick: null, busy: false, done: new Set(), found: [] };
  const nodes = F11.map((o) => {
    const g = el('g', { class: 'shp', transform: tf(o) }, svg);
    el('path', { d: SHAPES[o.k](), class: 'shp-p' }, g);
    el('text', { x: o.x, y: o.y + 92, class: 'shp-n' }, svg).textContent = `(${o.i + 1})`;
    g.addEventListener('click', () => choose(o.i));
    return g;
  });
  const msg = (t, c = '') => { $('f11Msg').className = `tip feedback ${c}`; $('f11Msg').textContent = t; };
  const renderFound = () => { $('f11Found').innerHTML = st.found.map(([a, b2]) => `<span class="chip">(${a + 1}) 与 (${b2 + 1})</span>`).join(''); };

  function fly(j, i, back) {
    const a = F11[j];
    const b2 = F11[i];
    const sa = (a.f ? -1 : 1) * a.s;
    const sb = (b2.f ? -1 : 1) * b2.s;
    const ok = congruent(a, b2);
    nodes[j].parentNode.appendChild(nodes[j]);
    // 全等：位置、角度、翻面一起过渡（翻面时横向缩放经过 0，像纸片翻过去）；不全等：只搬过去、转过去，保持原样
    return new Promise((res) => tween(back ? 900 : 1700, (t0) => {
      const t = back ? 1 - t0 : t0;
      const o = { ...a, x: lerp(a.x, b2.x, t), y: lerp(a.y, b2.y, t), r: lerp(a.r, b2.r, t), sx: ok ? lerp(sa, sb, t) : sa };
      nodes[j].setAttribute('transform', tf(o));
    }, res));
  }

  async function choose(i) {
    if (st.busy || st.done.has(i)) return;
    if (st.pick === null) { st.pick = i; nodes[i].classList.add('sel'); msg(`选了 (${i + 1})，再点一个你认为和它全等的图形。`); return; }
    if (st.pick === i) { nodes[i].classList.remove('sel'); st.pick = null; msg('点两个图形试试。'); return; }
    const first = st.pick;
    st.pick = null;
    st.busy = true;
    const a = F11[i];
    const b2 = F11[first];
    const how = a.f !== b2.f ? '翻折过去' : (a.r !== b2.r ? '转一个角度' : '平移');
    msg(`把 (${i + 1}) ${how}，叠到 (${first + 1}) 上……`);
    await fly(i, first, false);
    if (congruent(a, b2)) {
      nodes[i].classList.add('ok'); nodes[first].classList.add('ok');
      st.done.add(i); st.done.add(first);
      st.found = [...st.found, [first, i].sort((x, y) => x - y)];
      renderFound();
      msg(`完全重合！(${first + 1}) 与 (${i + 1}) 是全等图形（运动方式：${how}）。`, 'fb-ok');
      nodes[first].classList.remove('sel');
      st.busy = false;
      return;
    }
    nodes[i].classList.add('bad');
    msg(a.k === b2.k ? '形状相同，可是大小不同，怎么叠都盖不住——不全等。' : '怎么摆都对不齐：有的地方露出来了——不全等。', 'fb-warn');
    await new Promise((r) => setTimeout(r, 1700));
    await fly(i, first, true);
    nodes[i].classList.remove('bad'); nodes[first].classList.remove('sel');
    st.busy = false;
  }

  $('f11Reset').addEventListener('click', () => {
    if (st.busy) return;
    F11.forEach((o, k) => { nodes[k].setAttribute('transform', tf(o)); nodes[k].classList.remove('ok', 'sel', 'bad'); });
    st.pick = null; st.done = new Set(); st.found = []; renderFound(); msg('点两个图形试试。');
  });
}

/* ---------- 第 5 页：图 1-2 点阵 ---------- */
const FISH = [[[2, 0], [6, -2]], [[6, -2], [2, -4]], [[0, -1], [4, -3]], [[0, -3], [4, -1]]];
const UP = [[[6, -3], [8, -7]], [[10, -3], [8, -7]], [[7, -1], [9, -5]], [[9, -1], [7, -5]]];
const segMove = (segs, m, t) => segs.map((sg) => move(sg, m, t));
const sameSegs = (A, B) => A.length === B.length && A.every(([p, q]) => B.some(([u, v]) => (near(p, u) && near(q, v)) || (near(p, v) && near(q, u))));
const TABS = [
  { cols: 32, rows: 5, fig: FISH, ops: { T: { T: [7, 0] }, F: { F: [[7, 0], [7, -1]] }, R: { R: 180, c: [7, -2] } }, next: () => ({ T: [7, 0] }), say: '向右平移 7 格' },
  { cols: 32, rows: 5, fig: FISH, ops: { T: { T: [7, 0] }, F: { F: [[7, 0], [7, -1]] }, R: { R: 180, c: [7, -2] } }, next: (k) => ({ F: [[7 + 8 * k, 0], [7 + 8 * k, -1]] }), say: '沿竖线翻折', target: 'F' },
  { cols: 16, rows: 14, fig: UP, ops: { T: { T: [3, -3] }, F: { F: [[8, -7], [9, -6]] }, R: { R: -90, c: [8, -7] } }, next: () => ({ R: -90, c: [8, -7] }), say: '绕端点顺时针旋转 90°', target: 'R' },
];
TABS.forEach((tb) => { tb.goal = segMove(tb.fig, tb.ops[tb.target || 'T'], 1); });

function initF12() {
  const st = { tab: 0, op: null, t: 0, extra: 0 };
  const boards = TABS.map((tb, k) => {
    const host = $('f12').appendChild(document.createElement('div'));
    host.className = 'f12b';
    host.style.display = k ? 'none' : '';
    const b = Geo.board(host, { x: [-0.6, tb.cols + 0.6], y: [-tb.rows - 0.6, 0.6], w: tb.cols > 20 ? 900 : 520 });
    for (let x = 0; x <= tb.cols; x++) for (let y = 0; y <= tb.rows; y++) b.pt([x, -y], { r: 2.2, cls: 'dot' });
    tb.fig.forEach((sg) => b.seg(sg, { cls: 'fig0' }));
    tb.goal.forEach((sg) => b.seg(sg, { cls: 'fig0' }));
    // 第 3、4 个图形
    [1, 2].forEach((n) => tb.fig.forEach((sg, i) => b.seg(() => {
      if (st.tab !== k || st.extra < n) return [[-99, 0], [-99, 0]];
      let g = tb.goal[i];
      for (let m = 1; m <= n; m++) g = move(g, tb.next(m), m === n ? Math.min(1, st.extra - n) : 1);
      return g;
    }, { cls: 'fig3' })));
    // 正在运动的图形
    tb.fig.forEach((sg) => b.seg(() => (st.tab === k && st.op ? move(sg, tb.ops[st.op], st.t) : [[-99, 0], [-99, 0]]), { cls: 'fig-m' }));
    return b;
  });
  const msg = (t, c = '') => { $('f12Msg').className = `tip feedback ${c}`; $('f12Msg').textContent = t; };
  const NAME = { T: '平移', F: '翻折', R: '旋转' };
  const intro = () => msg(['图 (1)：左边的图形怎样运动，能与右边的重合？选一种运动试试。', '图 (2)：右边的图形“方向反了”，试试哪种运动能让它们重合。', '图 (3)：两个图形共用一个端点，试试哪种运动能让它们重合。'][st.tab]);
  let stop = () => {};
  const redraw = () => boards[st.tab].update();
  $('f12Tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    stop();
    st.tab = +btn.dataset.k; st.op = null; st.extra = 0;
    $('f12Tabs').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    boards.forEach((b, k) => { b.svg.parentNode.style.display = k === st.tab ? '' : 'none'; });
    redraw(); intro();
  });
  $('f12Ops').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-op]');
    if (!btn) return;
    stop();
    const op = btn.dataset.op;
    const tb = TABS[st.tab];
    if (op === 'reset') { st.op = null; st.extra = 0; redraw(); intro(); return; }
    if (op === 'next') {
      st.op = null; st.extra = 1;
      stop = tween(1400, (t) => { st.extra = 1 + t; redraw(); }, () => {
        stop = tween(1400, (t) => { st.extra = 2 + t * 0.999; redraw(); }, () => { st.extra = 3; redraw(); msg(`照同样的方法（${tb.say}）继续运动，画出第 3、4 个图形（绿色）。`, 'fb-ok'); });
      });
      return;
    }
    st.op = op; st.extra = 0;
    msg(`${NAME[op]}中……`);
    stop = tween(1600, (t) => { st.t = t; redraw(); }, () => {
      const ok = sameSegs(segMove(tb.fig, tb.ops[op], 1), tb.goal);
      const extra = ok && op !== (tb.target || 'T') ? '（这个图形本身是轴对称的，所以这样也能重合）' : '';
      msg(ok ? `${NAME[op]}后与另一个图形完全重合！${extra}` : `${NAME[op]}后没有重合（橙色与蓝色对不上），换一种运动试试。`, ok ? 'fb-ok' : 'fb-warn');
    });
  });
  intro();
  boards.forEach((b) => b.update());
}

/* ---------- 第 7 页：沿网格线把 4×4 正方形分成两个全等图形 ---------- */
const N = 4;
const PRESETS = [
  [[2, 0], [2, 4]],
  [[0, 1], [1, 1], [1, 2], [3, 2], [3, 3], [4, 3]],
  [[1, 0], [1, 2], [3, 2], [3, 4]],
  [[0, 2], [1, 2], [1, 1], [2, 1], [2, 3], [3, 3], [3, 2], [4, 2]],
];
const edgeKey = (p, q) => { const [a, c] = [p, q].sort((u, v) => u[0] - v[0] || u[1] - v[1]); return `${a[0]},${a[1]}-${c[0]},${c[1]}`; };
const pathEdges = (pts) => pts.slice(1).flatMap((q, i) => {
  const p = pts[i];
  const n = Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]);
  const d = [Math.sign(q[0] - p[0]), Math.sign(q[1] - p[1])];
  return Array.from({ length: n }, (_, k) => edgeKey([p[0] + d[0] * k, p[1] + d[1] * k], [p[0] + d[0] * (k + 1), p[1] + d[1] * (k + 1)]));
});
const norm = (cells) => {
  const mx = Math.min(...cells.map((c) => c[0]));
  const my = Math.min(...cells.map((c) => c[1]));
  return cells.map(([x, y]) => `${x - mx},${y - my}`).sort().join(' ');
};
const SYM = [(x, y) => [x, y], (x, y) => [-y, x], (x, y) => [-x, -y], (x, y) => [y, -x], (x, y) => [-x, y], (x, y) => [y, x], (x, y) => [x, -y], (x, y) => [-y, -x]];
const cellsCongruent = (A, B) => SYM.some((f) => norm(A.map(([x, y]) => f(x, y))) === norm(B));

function regions(cut) {
  const id = (x, y) => y * N + x;
  const parent = Array.from({ length: N * N }, (_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) {
    if (x + 1 < N && !cut.has(edgeKey([x + 1, y], [x + 1, y + 1]))) parent[find(id(x, y))] = find(id(x + 1, y));
    if (y + 1 < N && !cut.has(edgeKey([x, y + 1], [x + 1, y + 1]))) parent[find(id(x, y))] = find(id(x, y + 1));
  }
  const groups = {};
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) (groups[find(id(x, y))] ||= []).push([x, y]);
  return Object.values(groups);
}

function initCut() {
  const st = { cut: new Set(), demo: -1, fill: null };
  const b = Geo.board($('cut'), { x: [-0.3, N + 0.3], y: [-0.3, N + 0.3], w: 420 });
  const fills = [];
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) fills.push([x, y, b.poly([[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]], { cls: 'cell' })]);
  const edges = [];
  for (let i = 1; i < N; i++) for (let j = 0; j < N; j++) {
    edges.push([[i, j], [i, j + 1]]);
    edges.push([[j, i], [j + 1, i]]);
  }
  const lines = edges.map(([p, q]) => {
    const k = edgeKey(p, q);
    const vis = b.seg([p, q], { cls: 'gline' });
    const hit = b.seg([p, q], { cls: 'ghit' });
    hit.addEventListener('click', () => { st.cut.has(k) ? st.cut.delete(k) : st.cut.add(k); st.fill = null; paint(); });
    return [k, vis];
  });
  b.poly([[0, 0], [N, 0], [N, N], [0, N]], { cls: 'outer' });
  const paint = () => {
    lines.forEach(([k, vis]) => vis.classList.toggle('on', st.cut.has(k)));
    fills.forEach(([x, y, p]) => { p.classList.remove('ra', 'rb'); if (st.fill) p.classList.add(st.fill.get(`${x},${y}`) || ''); });
  };
  const msg = (t, c = '') => { $('cutMsg').className = `tip feedback ${c}`; $('cutMsg').innerHTML = t; };
  $('cutCheck').addEventListener('click', () => {
    const rs = regions(st.cut);
    if (rs.length === 1) { msg('还没有把正方形分开：剪痕要从一条边连到另一条边。', 'fb-warn'); return; }
    st.fill = new Map(rs.slice(0, 2).flatMap((r, i) => r.map(([x, y]) => [`${x},${y}`, i ? 'rb' : 'ra'])));
    paint();
    if (rs.length > 2) { msg(`分成了 ${rs.length} 块，题目要分成 2 块。`, 'fb-warn'); return; }
    const [A, B] = rs;
    if (A.length !== B.length) { msg(`两块分别是 ${A.length} 格和 ${B.length} 格，面积都不相等，不可能全等。`, 'fb-warn'); return; }
    msg(cellsCongruent(A, B) ? '两块都是 8 格，而且转一转（或翻过来）能完全重合：分成了两个<b>全等图形</b>！' : '两块都是 8 格，面积相等，但形状不同，不能重合——不全等。', cellsCongruent(A, B) ? 'fb-ok' : 'fb-warn');
  });
  $('cutDemo').addEventListener('click', () => {
    st.demo = (st.demo + 1) % PRESETS.length;
    st.cut = new Set(pathEdges(PRESETS[st.demo]));
    st.fill = null; paint();
    msg(`分法 ${st.demo + 1}：剪痕关于正方形的中心对称。点“检验”看看。`);
  });
  $('cutClr').addEventListener('click', () => { st.cut = new Set(); st.fill = null; paint(); msg('点网格线上的小段，画出“剪痕”（再点一次擦掉），画好后点“检验”。'); });
  b.update();
}

/* ---------- 第 7、8 页：静态图（六角星、平行四边形、等边三角形的分法） ---------- */
function drawStar() {
  const [cx, cy, R] = [100, 95, 82];
  const P = (deg) => [cx + R * Math.cos((deg * Math.PI) / 180), cy - R * Math.sin((deg * Math.PI) / 180)];
  const tri = (a) => `M${[a, a + 120, a + 240].map((d) => P(d).map((v) => v.toFixed(2)).join(' ')).join(' L')} Z`;
  $('starPath').setAttribute('d', `${tri(90)} ${tri(270)}`);
}

function splitFig(gid, btns, shape, methods) {
  const g = $(gid);
  const line = (p, q, cls = 'cutl') => el('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], class: cls }, g);
  const draw = (k) => {
    g.innerHTML = '';
    el('polygon', { points: shape.map((p) => p.join(',')).join(' '), class: 'shape' }, g);
    if (k >= 0) methods[k]().forEach(([p, q]) => line(p, q));
  };
  $(btns).addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    $(btns).querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    draw(+btn.dataset.k);
  });
  draw(-1);
}
const mix = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
function initSplits() {
  const [A, B, C, D] = [[30, 115], [250, 115], [290, 15], [70, 15]];
  splitFig('pgSplit', 'pgBtns', [A, B, C, D], [
    () => [[mix(A, B, 0.5), mix(D, C, 0.5)], [mix(A, D, 0.5), mix(B, C, 0.5)]],
    () => [1, 2, 3].map((k) => [mix(A, B, k / 4), mix(D, C, k / 4)]),
    () => [1, 2, 3].map((k) => [mix(A, D, k / 4), mix(B, C, k / 4)]),
  ]);
  const h = 160 * Math.sqrt(3) / 2;
  const [P, Q, R] = [[80, 145], [240, 145], [160, 145 - h]];
  const G = centroid([P, Q, R]);
  splitFig('trSplit', 'trBtns', [P, Q, R], [
    () => [[R, mix(P, Q, 0.5)]],
    () => [[G, P], [G, Q], [G, R]],
    () => [[mix(P, Q, 0.5), mix(Q, R, 0.5)], [mix(Q, R, 0.5), mix(R, P, 0.5)], [mix(R, P, 0.5), mix(P, Q, 0.5)]],
  ]);
}

function gridRects() {
  const g = document.querySelector('.rect-fig .gridg');
  for (let x = 20; x <= 500; x += 40) el('line', { x1: x, y1: 30, x2: x, y2: 110, class: 'gl2' }, g);
  for (let y = 30; y <= 110; y += 40) el('line', { x1: 20, y1: y, x2: 500, y2: y, class: 'gl2' }, g);
}

window.LESSON = {
  init() {
    initLeaf();
    initF11();
    initF12();
    initCut();
    drawStar();
    initSplits();
    gridRects();
  },
  onRender() { requestAnimationFrame(Geo.refresh); },
};
