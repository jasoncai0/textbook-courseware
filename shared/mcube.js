'use strict';
/* 课本插件 · 长方体和正方体（六上第一单元共用；依赖 poly3d.js，加载在 poly3d.js 之后、course.js 之前）
 * 坐标与 poly3d 一致：x 向右（长）、y 向里（宽）、z 向上（高）。所有尺寸都按真实数据计算。
 *   MCube.boxFaces(l, w, h)        长方体的 6 个面 [{ key: '前', pts, out, dims: [a, b] }]，前 y=0、后 y=w、左 x=0、右 x=l、下 z=0、上 z=h
 *   MCube.voxels(cells, o)         由小正方体（cells = [[i, j, k], …]，棱长 o.s，默认 1）拼成的物体：只画露在外面的小正方形面（网格线精确）
 *   MCube.block(nx, ny, nz, at)    nx × ny × nz 个小正方体的格子坐标
 *   MCube.gridPolys(cells, colW, rowH)  方格展开图（每列宽、每行高可以不同）
 *   MCube.cuboidNet(l, w, h)       “1-4-1”型长方体展开图：{ polys, names }，names 为 ['上','左','前','右','后','下']
 *   MCube.fold(polys, t, root)     折叠到 t（0 平铺 → 1 折完）。平铺时展开图竖直立在 y=0 平面上、正面朝向观察者；
 *                                  折完后 root 块是“前面”，其余各块绕折痕向里折 90°。返回 [{ pts, out }]
 *   MCube.foldView(el, o)       折叠演示器（见函数说明）
 *   MCube.closed(faces)            折完的各块是否恰好围成封闭的盒子（没有重叠、每条边都被两块共用）
 * 折叠算法与七上《展开与折叠》相同：展开图按“谁连着谁”组成一棵树，每块绕它与父块的公共边转同一个角度。
 */
const MCube = (() => {
  const { sub, add, mul, dot, cross, unit, centroid } = Poly3D.vec;
  const EPS = 1e-6;
  const near2 = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < EPS;
  const c2 = (P) => [P.reduce((a, p) => a + p[0], 0) / P.length, P.reduce((a, p) => a + p[1], 0) / P.length];

  function boxFaces(l, w, h) {
    const P = (x, y, z) => [x, y, z];
    return [
      { key: '下', pts: [P(0, 0, 0), P(l, 0, 0), P(l, w, 0), P(0, w, 0)], out: [0, 0, -1], dims: [l, w] },
      { key: '上', pts: [P(0, 0, h), P(l, 0, h), P(l, w, h), P(0, w, h)], out: [0, 0, 1], dims: [l, w] },
      { key: '前', pts: [P(0, 0, 0), P(l, 0, 0), P(l, 0, h), P(0, 0, h)], out: [0, -1, 0], dims: [l, h] },
      { key: '后', pts: [P(0, w, 0), P(l, w, 0), P(l, w, h), P(0, w, h)], out: [0, 1, 0], dims: [l, h] },
      { key: '左', pts: [P(0, 0, 0), P(0, w, 0), P(0, w, h), P(0, 0, h)], out: [-1, 0, 0], dims: [w, h] },
      { key: '右', pts: [P(l, 0, 0), P(l, w, 0), P(l, w, h), P(l, 0, h)], out: [1, 0, 0], dims: [w, h] },
    ];
  }

  const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  function voxels(cells, o = {}) {
    const s = o.s || 1;
    const at = o.at || [0, 0, 0];
    const has = new Set(cells.map((c) => c.join(',')));
    const V = [];
    const F = [];
    cells.forEach(([i, j, k]) => DIRS.forEach((d) => {
      if (has.has(`${i + d[0]},${j + d[1]},${k + d[2]}`)) return;
      const ax = d.findIndex((v) => v !== 0);
      const [u, v] = [0, 1, 2].filter((a) => a !== ax);
      const base = [i, j, k].map((c, a) => (c + (a === ax && d[a] > 0 ? 1 : 0)));
      const corner = (du, dv) => {
        const p = [...base];
        p[u] += du; p[v] += dv;
        return add(at, mul(p, s));
      };
      let quad = [corner(0, 0), corner(1, 0), corner(1, 1), corner(0, 1)];
      if (dot(Poly3D.newell(quad), d) < 0) quad = quad.reverse();
      const n0 = V.length;
      V.push(...quad);
      F.push([n0, n0 + 1, n0 + 2, n0 + 3]);
    }));
    return { type: 'mesh', V, F, ...o };
  }

  function block(nx, ny, nz, at = [0, 0, 0]) {
    const out = [];
    for (let k = 0; k < nz; k += 1) for (let j = 0; j < ny; j += 1) for (let i = 0; i < nx; i += 1) out.push([at[0] + i, at[1] + j, at[2] + k]);
    return out;
  }

  function gridPolys(cells, colW = () => 1, rowH = () => 1) {
    const X = (c) => { let s = 0; for (let i = 0; i < c; i += 1) s += colW(i); return s; };
    const Y = (r) => { let s = 0; for (let i = 0; i < r; i += 1) s += rowH(i); return -s; };
    return cells.map(([r, c]) => [[X(c), Y(r + 1)], [X(c + 1), Y(r + 1)], [X(c + 1), Y(r)], [X(c), Y(r)]]);
  }

  function cuboidNet(l, w, h) {
    const cols = [w, l, w, l];
    const rows = [w, h, w];
    return { polys: gridPolys([[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]], (i) => cols[i], (i) => rows[i]), names: ['上', '左', '前', '右', '后', '下'], root: 2 };
  }

  function buildNet(polys, root) {
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
        const hg = shared(i, j);
        if (hg) { seen[j] = true; parent[j] = i; hinge[j] = hg; queue.push(j); }
      }
    }
    return { parent, hinge, connected: seen.every(Boolean) };
  }
  // 展开图在 xy 平面上折（向 −z 折），再整体转到“竖直立着、root 块当前面”：(x, y, z) → (x, −z, y)
  const stand = (p) => [p[0], -p[2], p[1]];
  function fold(polys, t, root = 0) {
    const { parent, hinge } = buildNet(polys, root);
    const tf = (k, P) => {
      let p = P;
      for (let i = k; parent[i] >= 0; i = parent[i]) {
        const [A, B] = hinge[i];
        const A3 = [A[0], A[1], 0];
        const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, 0];
        const cc = c2(polys[i]);
        const u = unit(cross(sub([cc[0], cc[1], 0], mid), [0, 0, 1]));
        p = Poly3D.rotate(p, A3, u, (-Math.PI / 2) * t);
      }
      return p;
    };
    return polys.map((P, k) => ({
      pts: P.map(([x, y]) => stand(tf(k, [x, y, 0]))),
      out: stand(sub(tf(k, [0, 0, 1]), tf(k, [0, 0, 0]))),
    }));
  }
  const R4 = (v) => v.map((x) => Math.round(x * 1e4) / 1e4).join(',');
  function closed(faces) {
    const cs = faces.map((f) => centroid(f.pts));
    let overlap = false;
    cs.forEach((a, i) => cs.forEach((b, j) => { if (i < j && Math.hypot(...sub(a, b)) < 1e-3) overlap = true; }));
    const edges = new Map();
    faces.forEach((f) => f.pts.forEach((p, i) => {
      const k = [R4(p), R4(f.pts[(i + 1) % f.pts.length])].sort().join('|');
      edges.set(k, (edges.get(k) || 0) + 1);
    }));
    const open = [...edges.values()].filter((c) => c !== 2).length;
    return { overlap, open, ok: !overlap && open === 0 };
  }
  /** 连着最多的一块当 root（折起来最好看） */
  function bestRoot(polys) {
    const { parent } = buildNet(polys, 0);
    const deg = polys.map((_, i) => parent.filter((p) => p === i).length + (parent[i] >= 0 ? 1 : 0));
    return deg.indexOf(Math.max(...deg));
  }

  /** 把 t 从 from 推到 to（缓动），每帧回调 onT；返回取消函数 */
  function tween(from, to, ms, onT) {
    let alive = true;
    const t0 = performance.now();
    const tick = (now) => {
      if (!alive) return;
      const x = Math.min(1, (now - t0) / ms);
      const e = x < 0.5 ? 2 * x * x : 1 - ((-2 * x + 2) ** 2) / 2;
      onT(from + (to - from) * e);
      if (x < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { alive = false; };
  }

  /** 折叠演示器：MCube.foldView(el, { net: () => ({ polys, root, color(i), label(i) }), slider, w, h, scale, yaw, pitch, onChange })
   *  平铺时画出折痕（虚线）；api.play(to) 动画折叠 / 展开；api.st.check 为折完后的检查结果 */
  function foldView(el, o = {}) {
    const st = { t: o.t ?? 0, faces: [], check: null, center: [0, 0, 0], polys: [] };
    const v = Poly3D.view(el, { w: o.w || 560, h: o.h || 420, scale: o.scale || 60, yaw: o.yaw ?? -24, pitch: o.pitch ?? 18, center: () => st.center });
    let cur = null;
    const recompute = () => {
      cur = o.net();
      const { polys } = cur;
      st.polys = polys;
      if (!polys.length) { st.faces = []; st.check = null; return; }
      const root = cur.root ?? bestRoot(polys);
      st.faces = fold(polys, st.t, root);
      st.check = buildNet(polys, root).connected ? closed(fold(polys, 1, root)) : { ok: false, overlap: false, open: 1 };
      // 视图中心用折好后的中心，折叠过程中画面不乱跑
      const full = fold(polys, 1, root);
      const c0 = centroid(full.flatMap((f) => f.pts));
      const c1 = centroid(st.faces.flatMap((f) => f.pts));
      st.center = add(mul(c0, st.t), mul(c1, 1 - st.t));
    };
    v.add(() => st.faces.map((f, i) => {
      const net = st.polys[i];
      const lines = f.pts.map((p, k) => {
        const A = net[k];
        const B = net[(k + 1) % net.length];
        const shared = st.polys.some((P, j) => j !== i && P.some((q, m) => {
          const r = P[(m + 1) % P.length];
          return (near2(q, A) && near2(r, B)) || (near2(q, B) && near2(r, A));
        }));
        return [p, f.pts[(k + 1) % f.pts.length], shared && st.t < 0.02 ? 'h' : ''];
      });
      return { type: 'face', pts: f.pts, out: f.out, color: cur.color ? cur.color(i) : '#a9d3f0', lines, label: cur.label ? cur.label(i) : undefined };
    }));
    let ready = false;
    const refresh = () => { recompute(); v.update(); if (ready && o.onChange) o.onChange(st); };
    let stop = null;
    const api = {
      v, st, refresh,
      set(t) { st.t = t; if (o.slider) o.slider.value = t; refresh(); },
      play(to = st.t > 0.5 ? 0 : 1, ms = 1600) { if (stop) stop(); stop = tween(st.t, to, ms, (t) => api.set(t)); },
    };
    if (o.slider) {
      o.slider.addEventListener('input', () => { if (stop) stop(); st.t = +o.slider.value; refresh(); });
      o.slider.setAttribute('data-noswipe', '');
    }
    refresh();
    ready = true;
    if (o.onChange) o.onChange(st);
    return api;
  }

  return { boxFaces, voxels, block, gridPolys, cuboidNet, fold, closed, bestRoot, tween, foldView };
})();
window.MCube = MCube;
