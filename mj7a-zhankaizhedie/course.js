'use strict';
/* 七上 5.3 展开与折叠 · 本课互动：圆柱 / 圆锥侧面展开、各种展开图沿棱折叠（判断能否围成封闭的立体图形）、
 * 图 5-19 选格子、自己设计正方体展开图、相对面填数。立体图用 ../shared/poly3d.js（不透明面，画家算法）。
 * 折叠算法：展开图的每块按“谁连着谁”组成一棵树，每块绕它与父块的公共边（折痕）转同一个角度；
 * 折完后检查：没有两块重合、每条边恰好被两块共用 → 围成了封闭的立体图形。 */
const { slider, fmt } = MathKit;
const { sub, add, mul, dot, cross, unit, centroid } = Poly3D.vec;
const $ = (id) => document.getElementById(id);
const views = [];
const mkView = (id, opt) => { const v = Poly3D.view($(id), opt); views.push(v); return v; };
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});
const EPS = 1e-6;
const near2 = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < EPS;
const c2 = (P) => [P.reduce((a, p) => a + p[0], 0) / P.length, P.reduce((a, p) => a + p[1], 0) / P.length];
const COLORS = ['#f6c99a', '#a9d3f0', '#b9e2c4', '#f3b6c4', '#d8c7f0', '#f7e19a', '#c6e0e6', '#f1c7a8', '#cfe3a8', '#e6c3e8', '#b8d8f5', '#f5d2b0'];

/* ---------- 展开图：建树 / 折叠 / 检查 ---------- */
function buildNet(polys, root = 0) {
  const n = polys.length;
  const parent = Array(n).fill(-1);
  const hinge = Array(n).fill(null);
  const seen = Array(n).fill(false);
  const shared = (i, j) => {
    const P = polys[i];
    const Q = polys[j];
    for (let a = 0; a < P.length; a += 1) {
      const A = P[a];
      const B = P[(a + 1) % P.length];
      for (let b = 0; b < Q.length; b += 1) {
        const C = Q[b];
        const D = Q[(b + 1) % Q.length];
        if ((near2(A, D) && near2(B, C)) || (near2(A, C) && near2(B, D))) return [A, B];
      }
    }
    return null;
  };
  const queue = [root];
  seen[root] = true;
  while (queue.length) {
    const i = queue.shift();
    for (let j = 0; j < n; j += 1) {
      if (seen[j]) continue;
      const h = shared(i, j);
      if (h) { seen[j] = true; parent[j] = i; hinge[j] = h; queue.push(j); }
    }
  }
  return { polys, parent, hinge, connected: seen.every(Boolean) };
}
/** 折叠到 t（0 平铺 → 1 折完）。每块向下折（−z），平铺时朝上的一面折完后在外侧 */
function foldNet(net, t, angle = Math.PI / 2) {
  const { polys, parent, hinge } = net;
  const tf = (k, P) => {
    let p = P;
    for (let i = k; parent[i] >= 0; i = parent[i]) {
      const [A, B] = hinge[i];
      const A3 = [A[0], A[1], 0];
      const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 0];
      const cc = c2(polys[i]);
      const w = sub([cc[0], cc[1], 0], mid);
      const u = unit(cross(w, [0, 0, 1]));
      p = Poly3D.rotate(p, A3, u, -angle * t);
    }
    return p;
  };
  return polys.map((P, k) => {
    const pts = P.map(([x, y]) => tf(k, [x, y, 0]));
    const o = sub(tf(k, [0, 0, 1]), tf(k, [0, 0, 0]));
    return { pts, out: o, net: P };
  });
}
const R4 = (v) => v.map((x) => Math.round(x * 1e4) / 1e4).join(',');
function checkFolded(faces) {
  const cs = faces.map((f) => centroid(f.pts));
  const overlap = new Set();
  cs.forEach((a, i) => cs.forEach((b, j) => { if (i < j && Math.hypot(...sub(a, b)) < 1e-3) { overlap.add(i); overlap.add(j); } }));
  const edges = new Map();
  faces.forEach((f) => f.pts.forEach((p, i) => {
    const q = f.pts[(i + 1) % f.pts.length];
    const [a, b] = [R4(p), R4(q)].sort();
    edges.set(`${a}|${b}`, (edges.get(`${a}|${b}`) || 0) + 1);
  }));
  const open = [...edges.values()].filter((c) => c === 1).length;
  return { overlap: [...overlap], open, closed: overlap.size === 0 && open === 0 };
}
// 方格展开图：cells = [[行, 列], …]，可指定每列宽 / 每行高（长方体纸盒）
function gridPolys(cells, colW = () => 1, rowH = () => 1) {
  const X = (c) => { let s = 0; for (let i = 0; i < c; i += 1) s += colW(i); return s; };
  const Y = (r) => { let s = 0; for (let i = 0; i < r; i += 1) s += rowH(i); return -s; };
  return cells.map(([r, c]) => [[X(c), Y(r + 1)], [X(c + 1), Y(r + 1)], [X(c + 1), Y(r)], [X(c), Y(r)]]);
}
const bestRoot = (polys) => {
  const net = buildNet(polys, 0);
  const deg = polys.map((_, i) => net.parent.filter((p) => p === i).length + (net.parent[i] >= 0 ? 1 : 0));
  return deg.indexOf(Math.max(...deg));
};

/* 通用折叠演示器：getPolys() 给出展开图，angle 为折角；返回 { s, refresh } */
function foldViewer(id, getPolys, o = {}) {
  const s = { t: 0, labels: o.labels || null };
  const st = { faces: [], net: null, center: [0, 0, 0], check: null };
  const v = mkView(id, { w: o.w || 560, h: o.h || 420, scale: o.scale || 70, yaw: o.yaw ?? -20, pitch: o.pitch ?? 50, center: () => st.center });
  const recompute = () => {
    const polys = getPolys();
    if (!polys.length) { st.faces = []; st.check = null; return; }
    const root = o.root !== undefined ? o.root : bestRoot(polys);
    st.net = buildNet(polys, root);
    const ang = typeof o.angle === 'function' ? o.angle() : (o.angle || Math.PI / 2);
    st.faces = foldNet(st.net, s.t, ang);
    st.full = foldNet(st.net, 1, ang);
    st.check = st.net.connected ? checkFolded(st.full) : { overlap: [], open: 1, closed: false };
    st.center = centroid(st.faces.flatMap((f) => f.pts));
  };
  v.add(() => {
    const flat = s.t < 0.02;
    const bad = s.t > 0.98 && st.check ? new Set(st.check.overlap) : new Set();
    return st.faces.map((f, i) => {
      const isHinge = (A, B) => st.net.hinge.some((h, k) => h && ((near2(h[0], A) && near2(h[1], B)) || (near2(h[0], B) && near2(h[1], A))) && (k === i || st.net.parent[k] === i));
      const lines = f.pts.map((p, k) => {
        const A = f.net[k];
        const B = f.net[(k + 1) % f.net.length];
        return [p, f.pts[(k + 1) % f.pts.length], flat && isHinge(A, B) ? 'h' : ''];
      });
      const lab = s.labels ? s.labels(i) : undefined;
      return { type: 'face', pts: f.pts, out: f.out, color: bad.has(i) ? '#f19a8f' : (o.color ? o.color(i) : COLORS[i % COLORS.length]), lines, label: lab };
    });
  });
  let ready = false; // 构造完成前不回调（回调里会用到返回的对象）
  const refresh = () => { recompute(); v.update(); if (ready && o.onChange) o.onChange(st); };
  const play = (to) => {
    const from = s.t;
    const t0 = performance.now();
    const DUR = 1600;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DUR);
      s.t = from + (to - from) * p;
      if (o.slider) o.slider.value = s.t;
      refresh();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (o.slider) slider(o.slider, (t) => { s.t = t; refresh(); });
  refresh();
  ready = true;
  if (o.onChange) setTimeout(() => o.onChange(st), 0);
  return { s, st, v, refresh, play };
}
const verdict = (st, okText) => {
  if (!st.check) return '';
  if (st.check.closed) return `<span class="ok">✓ 能围成：${okText}</span>`;
  if (st.check.overlap.length) return '<span class="no">✗ 不能：折起来有两个面<b>重叠</b>（红色），另一处就会缺一个面。</span>';
  return '<span class="no">✗ 不能：折起来有的地方<b>合不拢</b>（留下缺口）。</span>';
};

/* 第 3 页：圆柱、圆锥的侧面展开 */
function initRoll() {
  const s = { k: 'cyl', t: 0 };
  const r = 0.8;
  const h = 2;
  const l = 2.2; // 圆锥母线长
  const N = 48;
  const v = mkView('roll', { w: 600, h: 420, scale: 105, yaw: -16, pitch: 16, center: () => (s.k === 'cyl' ? [0, 0, 1] : [0, 0.4, 0.4]) });
  // 圆柱：沿最后面的一条母线剪开，侧面以最前面的母线为“铰链”逐渐摊平到 y = −r 的竖直平面上
  const cylPt = (sArc, z) => {
    if (s.t > 0.999) return [sArc, -r, z];
    const rho = r / (1 - s.t); // 弯曲半径越来越大，弧长不变
    const a = sArc / rho;
    return [rho * Math.sin(a), -r + rho - rho * Math.cos(a), z];
  };
  // 圆锥：母线长 l 不变，底面半径 r' 从 r 增大到 l，侧面张开成平面扇形（圆心角 360°·r/l）
  const conePt = (sArc, f) => { // f∈[0,1]：从顶点到底边
    const rp = r + (l - r) * s.t;
    const hp = Math.sqrt(Math.max(0, l * l - rp * rp));
    const psi = -Math.PI / 2 + sArc / rp;
    const B = [rp * Math.cos(psi), rp * Math.sin(psi) + rp, 0];
    const A = [0, rp, hp];
    return add(A, mul(sub(B, A), f));
  };
  v.add(() => {
    const out = [];
    if (s.k === 'cyl') {
      const L = 2 * Math.PI * r;
      for (let i = 0; i < N; i += 1) {
        const a0 = -L / 2 + (L * i) / N;
        const a1 = -L / 2 + (L * (i + 1)) / N;
        const P = [cylPt(a0, 0), cylPt(a1, 0), cylPt(a1, h), cylPt(a0, h)];
        const n = unit(cross(sub(P[1], P[0]), sub(P[3], P[0])));
        const lines = [[P[0], P[1], 'rim'], [P[2], P[3], 'rim']];
        if (i === 0) lines.push([P[3], P[0], 'cut']);
        if (i === N - 1) lines.push([P[1], P[2], 'cut']);
        out.push({ type: 'face', pts: P, out: mul(n, -1), color: '#a9d3f0', lines, cls: 'strip' });
      }
      if (s.t < 0.02) {
        const ring = (z) => Array.from({ length: N }, (_, i) => [r * Math.cos((2 * Math.PI * i) / N), r * Math.sin((2 * Math.PI * i) / N), z]);
        out.push({ type: 'face', pts: ring(h), color: '#d6ebf9', out: [0, 0, 1], lines: [] });
      }
    } else {
      const L = 2 * Math.PI * r;
      for (let i = 0; i < N; i += 1) {
        const a0 = -L / 2 + (L * i) / N;
        const a1 = -L / 2 + (L * (i + 1)) / N;
        const P = [conePt(a0, 0), conePt(a0, 1), conePt(a1, 1)];
        const n = unit(cross(sub(P[1], P[0]), sub(P[2], P[0])));
        const lines = [[P[1], P[2], 'rim']];
        if (i === 0) lines.push([P[0], P[1], 'cut']);
        if (i === N - 1) lines.push([P[2], P[0], 'cut']);
        out.push({ type: 'face', pts: P, out: n, color: '#f6c99a', lines, cls: 'strip' });
      }
    }
    return out;
  });
  const read = () => {
    const L = 2 * Math.PI * r;
    $('rollRead').innerHTML = s.k === 'cyl'
      ? (s.t > 0.999 ? `展开成<b>长方形</b>：长 = 底面周长 $2\\pi r\\approx${fmt(L)}$，宽 = 圆柱的高 $${h}$` : '沿红色的线剪开，再慢慢摊平…')
      : (s.t > 0.999 ? `展开成<b>扇形</b>：半径 = 母线长 $${l}$，弧长 = 底面周长 $\\approx${fmt(L)}$，圆心角 $=360^\\circ\\times\\dfrac{${r}}{${l}}\\approx${Math.round((360 * r) / l)}^\\circ$` : '沿红色的线剪开，再慢慢摊平…');
    MathKit.tex($('rollRead'));
  };
  slider($('rollT'), (t) => { s.t = t; read(); v.update(); });
  btnGroup($('rollK'), (k) => { s.k = k; read(); v.update(); });
}

/* 方格展开图 */
const NETS = {
  box514: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 1]],
  n515a: [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 2]],
  n515b: [[0, 1], [1, 1], [1, 2], [1, 3], [2, 0], [2, 1]],
  p2a: [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3], [1, 4]],
  p2b: [[0, 0], [0, 1], [1, 0], [1, 1], [1, 2], [1, 3]],
  e5: [[0, 2], [1, 0], [1, 1], [1, 2], [1, 3], [2, 2]],
};

/* 第 4 页：无盖正方体纸盒（图 5-14）沿红线剪开 */
function initBox() {
  const t = $('boxT');
  const f = foldViewer('box', () => gridPolys(NETS.box514), { slider: t, root: 1, pitch: 34, scale: 125 });
  f.s.t = 1; t.value = 1; f.refresh();
  $('boxPlay').addEventListener('click', () => f.play(f.s.t > 0.5 ? 0 : 1));
}

/* 第 5 页：图 5-15 两个展开图 */
function initLab() {
  const s = { k: 'n515a' };
  const msg = () => { $('labMsg').innerHTML = verdict(f.st, '正方体纸盒'); };
  const f = foldViewer('lab', () => gridPolys(NETS[s.k]), { slider: $('labT'), onChange: msg, scale: 92 });
  btnGroup($('labK'), (k) => { s.k = k; f.s.t = 0; $('labT').value = 0; f.refresh(); });
  $('labPlay').addEventListener('click', () => f.play(f.s.t > 0.5 ? 0 : 1));
}

/* 第 6 页：图 5-16 三个展开图，折成正多面体 */
const H3 = Math.sqrt(3) / 2;
const tri = (p, q, r) => [p, q, r];
const OCTA = (() => {
  const P = (x, j) => [x, j * H3];
  return [
    tri(P(1, 2), P(0.5, 1), P(1.5, 1)), tri(P(0, 0), P(1, 0), P(0.5, 1)), tri(P(0.5, 1), P(1, 0), P(1.5, 1)), tri(P(1, 0), P(2, 0), P(1.5, 1)),
    tri(P(1.5, 1), P(2, 0), P(2.5, 1)), tri(P(2, 0), P(3, 0), P(2.5, 1)), tri(P(2.5, 1), P(3, 0), P(3.5, 1)), tri(P(2, 0), P(2.5, -1), P(3, 0)),
  ];
})();
const ICOSA = (() => {
  const out = [];
  const P = (x, j) => [x, j * H3];
  for (let i = 0; i < 5; i += 1) {
    out.push(tri(P(i + 0.5, 1), P(i + 1.5, 1), P(i + 1, 2)));
    out.push(tri(P(i, 0), P(i + 1, 0), P(i + 0.5, 1)));
    out.push(tri(P(i + 0.5, 1), P(i + 1, 0), P(i + 1.5, 1)));
    out.push(tri(P(i, 0), P(i + 0.5, -1), P(i + 1, 0)));
  }
  return out;
})();
// 正十二面体：两朵“花”（中心五边形 + 5 片花瓣），花瓣与花瓣相连
const reflect2 = (p, A, B) => {
  const d = [B[0] - A[0], B[1] - A[1]];
  const t = ((p[0] - A[0]) * d[0] + (p[1] - A[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2);
  return [2 * (A[0] + d[0] * t) - p[0], 2 * (A[1] + d[1] * t) - p[1]];
};
const flipAcross = (P, i) => { const A = P[i]; const B = P[(i + 1) % P.length]; return P.map((p) => reflect2(p, A, B)).reverse(); };
const DODECA = (() => {
  const R = 1 / (2 * Math.sin(Math.PI / 5));
  const C = Array.from({ length: 5 }, (_, i) => { const t = Math.PI / 2 + (2 * Math.PI * i) / 5; return [R * Math.cos(t), R * Math.sin(t)]; });
  const flower = (center) => [center, ...center.map((_, i) => flipAcross(center, i))];
  const A = flower(C);
  // 花瓣 A[k] 的某条边连出 B 的一片花瓣，B 的中心再由这片花瓣翻出（具体的边由下面的搜索确定，保证能折成）
  return { A, flower, flipAcross };
})();
let DODECA_NET = null;
function dodecaNet() {
  if (DODECA_NET) return DODECA_NET;
  const { A, flower } = DODECA;
  const ang = Math.PI - Math.acos(-1 / Math.sqrt(5));
  for (let k = 1; k <= 5 && !DODECA_NET; k += 1) {
    for (let e = 0; e < 5 && !DODECA_NET; e += 1) {
      const petalB = flipAcross(A[k], e);
      for (let e2 = 0; e2 < 5 && !DODECA_NET; e2 += 1) {
        const centerB = flipAcross(petalB, e2);
        const B = flower(centerB);
        // B 的花瓣里有一片就是 petalB 本身（同一位置），去掉重复
        const all = [...A, ...B];
        const uniq = all.filter((P, i) => all.findIndex((Q) => near2(c2(P), c2(Q))) === i);
        if (uniq.length !== 12) continue;
        const net = buildNet(uniq, 0);
        if (!net.connected) continue;
        if (checkFolded(foldNet(net, 1, ang)).closed) DODECA_NET = uniq;
      }
    }
  }
  return DODECA_NET;
}
const SOLIDS = {
  octa: { polys: () => OCTA, angle: Math.PI - Math.acos(-1 / 3), name: '正八面体（8 个正三角形）' },
  dodeca: { polys: () => dodecaNet(), angle: Math.PI - Math.acos(-1 / Math.sqrt(5)), name: '正十二面体（12 个正五边形）' },
  icosa: { polys: () => ICOSA, angle: Math.PI - Math.acos(-Math.sqrt(5) / 3), name: '正二十面体（20 个正三角形）' },
};
function initPoly() {
  const s = { k: 'octa' };
  const msg = () => { $('polyMsg').innerHTML = f.s.t > 0.99 ? verdict(f.st, SOLIDS[s.k].name) : `折叠角：每条虚线折过 ${fmt((SOLIDS[s.k].angle * 180) / Math.PI, 1)}°`; };
  const f = foldViewer('poly', () => SOLIDS[s.k].polys(), { slider: $('polyT'), angle: () => SOLIDS[s.k].angle, onChange: msg, scale: 82, pitch: 40 });
  btnGroup($('polyK'), (k) => { s.k = k; f.s.t = 0; $('polyT').value = 0; f.refresh(); });
  $('polyPlay').addEventListener('click', () => f.play(f.s.t > 0.5 ? 0 : 1));
}

/* 第 7 页：图 5-18 棱柱体纸盒（3×1×1）与练一练 1 长方体纸盒（2.75×1×1） */
const strips = (col, rows) => rows.map((r) => [r, col]);
const BOX518 = {
  1: { cells: [...strips(1, [0, 1, 2]), [2, 0], [2, 2]] },
  2: { cells: [...strips(1, [0, 1, 2, 3, 4]), [4, 0], [4, 2]] },
  3: { cells: [...strips(1, [0, 1, 2, 3]), [0, 0], [3, 0]] },
  4: { cells: [...strips(1, [0, 1, 2, 3]), [0, 0], [3, 2]] },
};
const W518 = (c) => (c === 1 ? 3 : 1);
const L = 2.75; // 练一练 1：长方体长 2.75、宽 1、高 1（按课本图量得的比例）
const BOXP = {
  1: { cells: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1], [3, 1]], w: (c) => (c === 1 ? L : 1), h: () => 1 },
  2: { cells: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 2], [2, 2]], w: (c) => (c % 2 === 0 ? L : 1), h: () => 1 },
  3: { cells: [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]], w: (c) => (c % 2 === 1 ? L : 1), h: () => 1 },
  4: { cells: [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]], w: (c) => ([1, 2].includes(c) ? L : 1), h: () => 1 },
};
function initBoxes() {
  const s = { set: '518', k: '1' };
  const polys = () => (s.set === '518' ? gridPolys(BOX518[s.k].cells, W518) : gridPolys(BOXP[s.k].cells, BOXP[s.k].w, BOXP[s.k].h));
  const msg = () => { $('bxMsg').innerHTML = f.s.t > 0.99 ? verdict(f.st, s.set === '518' ? '棱柱体（长方体）纸盒' : '长方体纸盒') : '先想一想，再拖滑块或点“折一折”验证。'; };
  const f = foldViewer('bx', polys, { slider: $('bxT'), onChange: msg, scale: 62, pitch: 42 });
  const pick = (set, k) => { s.set = set; s.k = k; f.s.t = 0; $('bxT').value = 0; f.refresh(); };
  $('bxK').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    $('bxK').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
    pick(b.dataset.set, b.dataset.k);
  });
  $('bxPlay').addEventListener('click', () => f.play(f.s.t > 0.5 ? 0 : 1));
}

/* 第 8 页：图 5-19 从 10 个空白格中选 1 个 */
const SHADED = [[1, 1], [1, 2], [1, 3], [2, 3], [2, 4]];
const BLANK = [[0, 1], [0, 2], [0, 3], [1, 0], [1, 4], [2, 1], [2, 2], [2, 5], [3, 3], [3, 4]];
function initPick() {
  const s = { pick: null, tried: {} };
  const svg = $('pickGrid');
  const NS = 'http://www.w3.org/2000/svg';
  const U = 50;
  const draw = () => {
    svg.replaceChildren();
    const rect = ([r, c], cls) => { const e = document.createElementNS(NS, 'rect'); Object.entries({ x: c * U + 4, y: r * U + 4, width: U, height: U, class: cls }).forEach(([k, v]) => e.setAttribute(k, v)); svg.appendChild(e); return e; };
    SHADED.forEach((cell) => rect(cell, 'g-shade'));
    BLANK.forEach((cell, i) => {
      const key = cell.join(',');
      const res = s.tried[key];
      const e = rect(cell, `g-blank ${s.pick === i ? 'on' : ''} ${res === true ? 'yes' : res === false ? 'no' : ''}`);
      e.addEventListener('click', () => { s.pick = i; f.s.t = 0; $('pickT').value = 0; f.refresh(); f.play(1); });
      if (res !== undefined) { const t = document.createElementNS(NS, 'text'); t.setAttribute('x', cell[1] * U + 4 + U / 2); t.setAttribute('y', cell[0] * U + 4 + U / 2 + 8); t.setAttribute('class', `g-mark ${res ? 'yes' : 'no'}`); t.textContent = res ? '✓' : '✗'; svg.appendChild(t); }
    });
  };
  const cells = () => (s.pick === null ? SHADED : [...SHADED, BLANK[s.pick]]);
  const msg = (st) => {
    if (s.pick === null) { $('pickMsg').innerHTML = '点左边任意一个白色小方格，把它和 5 个阴影方格一起折一折。'; return; }
    if (f.s.t > 0.99) s.tried = { ...s.tried, [BLANK[s.pick].join(',')]: st.check.closed };
    $('pickMsg').innerHTML = f.s.t > 0.99 ? verdict(st, '正方体纸盒') : '正在折……';
    draw();
  };
  const f = foldViewer('pickV', () => gridPolys(cells()), { slider: $('pickT'), onChange: msg, scale: 78, color: (i) => (i < 5 ? '#c9d3dc' : '#f6c99a') });
  draw();
}

/* 第 9 页：练一练 2 与自己设计展开图 */
function initDesign() {
  const s = { cells: new Set(NETS.p2a.map((c) => c.join(','))) };
  const svg = $('dsGrid');
  const NS = 'http://www.w3.org/2000/svg';
  const U = 44;
  const ROWS = 4;
  const COLS = 6;
  const cells = () => [...s.cells].map((k) => k.split(',').map(Number));
  const draw = () => {
    svg.replaceChildren();
    for (let r = 0; r < ROWS; r += 1) for (let c = 0; c < COLS; c += 1) {
      const key = `${r},${c}`;
      const e = document.createElementNS(NS, 'rect');
      Object.entries({ x: c * U + 3, y: r * U + 3, width: U, height: U, class: `d-cell ${s.cells.has(key) ? 'on' : ''}` }).forEach(([k, v]) => e.setAttribute(k, v));
      e.addEventListener('click', () => {
        const next = new Set(s.cells);
        if (next.has(key)) next.delete(key); else if (next.size < 6) next.add(key);
        s.cells = next; f.s.t = 0; $('dsT').value = 0; draw(); f.refresh();
      });
      svg.appendChild(e);
    }
  };
  const msg = (st) => {
    const n = s.cells.size;
    if (n !== 6) { $('dsMsg').innerHTML = `已选 ${n} 个方格，正方体要 6 个面。`; return; }
    if (!st.net || !st.net.connected) { $('dsMsg').innerHTML = '<span class="no">这 6 个方格没有连成一整块。</span>'; return; }
    $('dsMsg').innerHTML = f.s.t > 0.99 ? verdict(st, '正方体纸盒') : '拖滑块或点“折一折”。';
  };
  const f = foldViewer('dsV', () => gridPolys(cells()), { slider: $('dsT'), onChange: msg, scale: 78 });
  const load = (k) => { s.cells = new Set(NETS[k].map((c) => c.join(','))); f.s.t = 0; $('dsT').value = 0; draw(); f.refresh(); };
  $('dsLoad').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) load(b.dataset.k); });
  $('dsPlay').addEventListener('click', () => f.play(f.s.t > 0.5 ? 0 : 1));
  draw();
}

/* 第 10 页：习题 5 相对面填互为相反数 */
function initNums() {
  const VALS = ['', '1', '2', '3', '−1', '−2', '−3'];
  const s = { v: Array(6).fill(0) };
  const f = foldViewer('numV', () => gridPolys(NETS.e5), { slider: $('numT'), labels: (i) => VALS[s.v[i]] || '', scale: 88, onChange: () => check() });
  const box = $('numCells');
  const NS = 'http://www.w3.org/2000/svg';
  const U = 54;
  const draw = () => {
    box.replaceChildren();
    NETS.e5.forEach(([r, c], i) => {
      const g = document.createElementNS(NS, 'g');
      const e = document.createElementNS(NS, 'rect');
      Object.entries({ x: c * U + 3, y: r * U + 3, width: U, height: U, class: 'd-cell on' }).forEach(([k, v]) => e.setAttribute(k, v));
      const t = document.createElementNS(NS, 'text');
      Object.entries({ x: c * U + 3 + U / 2, y: r * U + 3 + U / 2 + 9, class: 'n-txt' }).forEach(([k, v]) => t.setAttribute(k, v));
      t.textContent = VALS[s.v[i]];
      g.append(e, t);
      g.addEventListener('click', () => { s.v = s.v.map((x, j) => (j === i ? (x + 1) % VALS.length : x)); draw(); f.refresh(); });
      box.appendChild(g);
    });
  };
  // 折好后哪两块相对：外法向相反
  const check = () => {
    if (!f.st.full) return;
    const num = (i) => ({ 1: 1, 2: 2, 3: 3, 4: -1, 5: -2, 6: -3 }[s.v[i]]);
    const pairs = [];
    f.st.full.forEach((a, i) => f.st.full.forEach((b, j) => { if (i < j && dot(unit(a.out), unit(b.out)) < -0.99) pairs.push([i, j]); }));
    const filled = s.v.every((x) => x > 0) && new Set(s.v).size === 6;
    const ok = filled && pairs.every(([i, j]) => num(i) + num(j) === 0);
    $('numMsg').className = `tip feedback ${ok ? 'fb-ok' : ''}`;
    $('numMsg').innerHTML = !filled ? '点展开图的方格，依次换成 1、2、3、−1、−2、−3（每个数用一次）。' : (ok ? '✓ 三组相对的面都互为相反数！' : '还不对：折起来看看，哪两个面是相对的？');
  };
  draw();
  $('numPlay').addEventListener('click', () => f.play(f.s.t > 0.5 ? 0 : 1));
  check();
}

window.LESSON = {
  init() {
    initRoll();
    initBox();
    initLab();
    initPoly();
    initBoxes();
    initPick();
    initDesign();
    initNums();
  },
  onRender(slide) { views.forEach((v) => { if (slide.contains(v.svg)) v.update(); }); },
};
window.J4 = { buildNet, foldNet, checkFolded, gridPolys, NETS, BOX518, W518, BOXP, SHADED, BLANK, OCTA, ICOSA, dodecaNet };
