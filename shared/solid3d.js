'use strict';
/* 课本插件 · 立体几何线框（新增模块，不依赖 math.js；加载在本课 course.js 之前）
 * 正交投影，按真实三维坐标计算，被遮挡的线自动画成虚线（遮挡体为凸多面体、旋转体、球）。
 * 世界坐标：x 向右、y 向里、z 向上。默认可拖动画面旋转（opt.rotate === false 关闭）。
 *
 *   const v = Solid3D.view(el, { w: 600, h: 440, scale: 70, yaw: -30, pitch: 22, center: [0, 0, 1] });
 *   v.solid(() => ({ V: [[x, y, z], …], F: [[0, 1, 2, 3], …] }), { cls: 'e' }); // 凸多面体：画全部棱 + 作为遮挡体
 *   v.revolve(() => ({ r1: 1, r2: 0.5, h: 2, at: [0, 0, 0] }));                  // 圆柱 r1=r2 / 圆锥 r2=0 / 圆台（轴平行 z）
 *   v.sphere(() => ({ c: [0, 0, 1], r: 1 }));                                     // 球：轮廓圆 + 赤道
 *   v.seg(() => [P, Q], { cls: 'c1', hide: 'auto' });   // 线段；hide: 'auto' 按遮挡体分实虚 / true 全虚 / false 全实
 *   v.curve(() => [P0, P1, …], { closed: true });        // 折线 / 曲线，同样自动分实虚
 *   v.face(() => [P0, P1, …], { cls: 'f1' });            // 半透明面（平面、截面），不参与遮挡
 *   v.dot(P, { cls }); v.label(P, 'A', { dx, dy });      // dx/dy 为屏幕像素偏移
 *   v.update(); v.onUpdate = () => {}; v.setView(yaw, pitch);
 * 所有几何参数都可以是值或函数（函数在每次 update 时重新求值），与 MathKit.board 的约定一致。
 */
const Solid3D = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const DEG = Math.PI / 180;
  const val = (v) => (typeof v === 'function' ? v() : v);
  const mk = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
    if (parent) parent.appendChild(e);
    return e;
  };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const lerp = (a, b, t) => add(a, mul(sub(b, a), t));
  const norm = (a) => Math.hypot(a[0], a[1], a[2]);

  /* ---------- 遮挡体 ---------- */
  // Newell 法求多边形法向，顶点多于 3 个、或有共线顶点时也稳
  function newell(pts) {
    const n = [0, 0, 0];
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      n[0] += (p[1] - q[1]) * (p[2] + q[2]);
      n[1] += (p[2] - q[2]) * (p[0] + q[0]);
      n[2] += (p[0] - q[0]) * (p[1] + q[1]);
    });
    const l = norm(n) || 1;
    return mul(n, 1 / l);
  }
  function polyOccluder(V, F) {
    const cen = mul(V.reduce(add, [0, 0, 0]), 1 / V.length);
    const size = Math.max(...V.map((p) => norm(sub(p, cen)))) || 1;
    const eps = size * 1e-7;
    const planes = F.map((f) => {
      let n = newell(f.map((i) => V[i]));
      let d = dot(n, V[f[0]]);
      if (dot(n, cen) > d) { n = mul(n, -1); d = -d; }
      return { n, d };
    });
    // 从 P 沿视线方向 E（指向观察者）出发，射线是否穿过多面体内部（Cyrus–Beck 裁剪）
    const hides = (P, E) => {
      let t0 = 1e-9;
      let t1 = Infinity;
      for (const { n, d } of planes) {
        const den = dot(n, E);
        const num = d - dot(n, P) - eps; // 要求 n·(P+tE) − d < −eps
        if (Math.abs(den) < 1e-12) { if (num <= 0) return false; continue; }
        const t = num / den;
        if (den > 0) t1 = Math.min(t1, t); else t0 = Math.max(t0, t);
        if (t0 >= t1) return false;
      }
      return t0 < t1;
    };
    return { hides, planes };
  }
  function sphereOccluder(c, r) {
    const r2 = r * r * (1 - 1e-7);
    return {
      hides(P, E) {
        const w = sub(P, c);
        const b = dot(w, E);
        const disc = b * b - (dot(w, w) - r2);
        return disc > 0 && -b + Math.sqrt(disc) > 1e-9;
      },
    };
  }

  // 圆柱 / 圆锥 / 圆台的多面体近似（与画出来的圆用同一组采样点，圆上的点恰好落在网格棱上）
  const REV_N = 96;
  function revMesh({ r1, r2, h, at = [0, 0, 0] }) {
    const ring = (r, z) => Array.from({ length: REV_N }, (_, i) => add(at, [r * Math.cos((2 * Math.PI * i) / REV_N), r * Math.sin((2 * Math.PI * i) / REV_N), z]));
    const bottom = ring(r1, 0);
    if (r2 <= 1e-9) {
      const V = [...bottom, add(at, [0, 0, h])];
      const F = [bottom.map((_, i) => REV_N - 1 - i), ...bottom.map((_, i) => [i, (i + 1) % REV_N, REV_N])];
      return { V, F, bottom, top: null };
    }
    const top = ring(r2, h);
    const V = [...bottom, ...top];
    const F = [
      bottom.map((_, i) => REV_N - 1 - i),
      top.map((_, i) => REV_N + i),
      ...bottom.map((_, i) => [i, (i + 1) % REV_N, REV_N + ((i + 1) % REV_N), REV_N + i]),
    ];
    return { V, F, bottom, top };
  }

  function view(el, opt = {}) {
    const host = typeof el === 'string' ? document.querySelector(el) : el;
    const W = opt.w || 600;
    const H = opt.h || 440;
    const init = { yaw: opt.yaw ?? -30, pitch: opt.pitch ?? 22 };
    const st = { ...init };
    const svg = mk('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' }, host);
    host.classList.add('s3d');
    host.setAttribute('data-noswipe', '');
    const layers = { face: mk('g', {}, svg), hid: mk('g', {}, svg), vis: mk('g', {}, svg), top: mk('g', {}, svg) };
    const items = [];
    let occluders = [];
    let k = 1;
    let E = [0, -1, 0];

    const basis = () => {
      const y = st.yaw * DEG;
      const p = st.pitch * DEG;
      const [c, s] = [Math.cos(y), Math.sin(y)];
      E = [-s * Math.cos(p), -c * Math.cos(p), Math.sin(p)]; // 指向观察者
    };
    // 投影：先绕 z 轴转 yaw，再按俯仰角 pitch 抬高视点
    const proj = (P) => {
      const q = sub(P, val(opt.center) || [0, 0, 0]);
      const y = st.yaw * DEG;
      const p = st.pitch * DEG;
      const [c, s] = [Math.cos(y), Math.sin(y)];
      const xr = q[0] * c - q[1] * s;
      const yr = q[0] * s + q[1] * c;
      const sc = val(opt.scale) || 60;
      return [W / 2 + xr * sc, H / 2 - (yr * Math.sin(p) + q[2] * Math.cos(p)) * sc];
    };
    const fit = () => {
      const r = svg.getBoundingClientRect();
      if (!r.width || !r.height) return;
      k = 1 / Math.min(r.width / W, r.height / H);
      svg.style.fontSize = `${k * parseFloat(getComputedStyle(host).fontSize) * 0.62}px`;
    };
    const hidden = (P) => occluders.some((o) => o.hides(P, E));

    // 把一条折线按遮挡情况拆成实线段与虚线段，分别写进两条 path
    const pieces = (pts, closed, hide) => {
      const list = closed ? [...pts, pts[0]] : pts;
      let dv = '';
      let dh = '';
      let lastV = null;
      let lastH = null;
      for (let i = 0; i + 1 < list.length; i += 1) {
        const a = list[i];
        const b = list[i + 1];
        // 长线段细分，保证“一半在前、一半在后”的线也能分对
        const n = list.length > 3 ? 1 : 24;
        for (let j = 0; j < n; j += 1) {
          const p = lerp(a, b, j / n);
          const q = lerp(a, b, (j + 1) / n);
          // 长直线段看中点；曲线（采样点落在曲面上，弦的中点会陷进曲面里）看两端点
          const test = () => (n > 1 ? hidden(lerp(p, q, 0.5)) : hidden(p) && hidden(q));
          const isHid = hide === true || (hide !== false && test());
          const [x1, y1] = proj(p);
          const [x2, y2] = proj(q);
          const seg = (last) => `${last && Math.abs(last[0] - x1) < 0.01 && Math.abs(last[1] - y1) < 0.01 ? '' : `M${x1.toFixed(1)} ${y1.toFixed(1)}`}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
          if (isHid) { dh += seg(lastH); lastH = [x2, y2]; lastV = null; } else { dv += seg(lastV); lastV = [x2, y2]; lastH = null; }
        }
      }
      return [dv, dh];
    };
    const mkPaths = (cls) => ({ pv: mk('path', { class: `e ${cls || ''}` }, layers.vis), ph: mk('path', { class: `e h ${cls || ''}` }, layers.hid) });
    const setPaths = ({ pv, ph }, pts, closed, hide) => {
      pv.style.display = ph.style.display = pts ? '' : 'none';
      if (!pts || pts.length < 2) return;
      const [dv, dh] = pieces(pts, closed, hide);
      pv.setAttribute('d', dv); ph.setAttribute('d', dh);
    };
    const shown = (o) => o.show === undefined || val(o.show);
    const line = (getPts, o = {}) => {
      const ps = mkPaths(o.cls);
      items.push({ draw: () => setPaths(ps, shown(o) ? val(getPts) : null, o.closed, o.hide ?? 'auto') });
      return ps;
    };

    const api = {
      svg, W, H, proj, state: st,
      /** 凸多面体：() => ({ V, F }) */
      solid(get, o = {}) {
        const paths = [];
        const g = {};
        const edges = (V, F) => {
          const seen = new Set();
          const out = [];
          F.forEach((f) => f.forEach((x, i) => {
            const y = f[(i + 1) % f.length];
            const key = x < y ? `${x}-${y}` : `${y}-${x}`;
            if (!seen.has(key)) { seen.add(key); out.push([V[x], V[y]]); }
          }));
          return out;
        };
        items.push({
          pre() {
            g.cur = shown(o) ? val(get) : null;
            return g.cur && o.occlude !== false ? polyOccluder(g.cur.V, g.cur.F) : null;
          },
          draw() {
            const es = g.cur ? edges(g.cur.V, g.cur.F) : [];
            while (paths.length < es.length) paths.push(mkPaths(o.cls));
            paths.forEach((p, i) => setPaths(p, es[i] || null, false, o.hide ?? 'auto'));
          },
        });
        return api;
      },
      /** 圆柱 / 圆锥 / 圆台：() => ({ r1, r2, h, at }) ，轴平行于 z 轴 */
      revolve(get, o = {}) {
        const g = {};
        const bot = line(() => g.m && g.m.bottom, { ...o, closed: true });
        const top = line(() => g.m && g.m.top, { ...o, closed: true });
        const gens = [0, 1].map((i) => line(() => g.gen && g.gen[i], o));
        items.push({
          pre() {
            const p = shown(o) ? val(get) : null;
            if (!p) { g.m = null; g.gen = null; return null; }
            g.m = revMesh(p);
            const { r1, r2, h, at = [0, 0, 0] } = p;
            // 轮廓母线：侧面法向 (h cosθ, h sinθ, r1 − r2) 与视线垂直
            const A = h * Math.hypot(E[0], E[1]);
            const rhs = -(r1 - r2) * E[2];
            g.gen = [];
            if (A > 1e-9 && Math.abs(rhs) <= A) {
              const phi = Math.atan2(E[1], E[0]);
              const dlt = Math.acos(rhs / A);
              g.gen = [phi + dlt, phi - dlt].map((t) => [add(at, [r1 * Math.cos(t), r1 * Math.sin(t), 0]), add(at, [r2 * Math.cos(t), r2 * Math.sin(t), h])]);
            }
            return o.occlude === false ? null : polyOccluder(g.m.V, g.m.F);
          },
          draw() {},
        });
        return { bot, top, gens };
      },
      /** 球：() => ({ c, r })；画轮廓圆和赤道（背面一半自动虚线） */
      sphere(get, o = {}) {
        const g = {};
        const outline = mk('circle', { class: `e ${o.cls || ''}`, fill: 'none' }, layers.vis);
        const N = 120;
        line(() => g.p && Array.from({ length: N }, (_, i) => add(g.p.c, [g.p.r * Math.cos((2 * Math.PI * i) / N), g.p.r * Math.sin((2 * Math.PI * i) / N), 0])), { cls: `${o.cls || ''} thin`, closed: true, show: () => o.equator !== false });
        items.push({
          pre() { g.p = shown(o) ? val(get) : null; return g.p && o.occlude !== false ? sphereOccluder(g.p.c, g.p.r) : null; },
          draw() {
            outline.style.display = g.p ? '' : 'none';
            if (!g.p) return;
            const [cx, cy] = proj(g.p.c);
            outline.setAttribute('cx', cx); outline.setAttribute('cy', cy); outline.setAttribute('r', g.p.r * (val(opt.scale) || 60));
          },
        });
        return api;
      },
      seg(get, o = {}) { line(get, o); return api; },
      curve(get, o = {}) { line(get, o); return api; },
      face(get, o = {}) {
        const p = mk('polygon', { class: `f ${o.cls || 'f1'}` }, layers.face);
        items.push({ draw() { const on = o.show === undefined || val(o.show); const pts = on ? val(get) : null; p.style.display = pts ? '' : 'none'; if (pts) p.setAttribute('points', pts.map((q) => proj(q).map((v) => v.toFixed(1)).join(',')).join(' ')); } });
        return api;
      },
      dot(get, o = {}) {
        const c = mk('circle', { class: `pt ${o.cls || ''}` }, layers.top);
        items.push({ draw() { const on = o.show === undefined || val(o.show); const P = on ? val(get) : null; c.style.display = P ? '' : 'none'; if (!P) return; const [x, y] = proj(P); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', (o.r || 4.5) * k); } });
        return api;
      },
      label(get, txt, o = {}) {
        const t = mk('text', { class: `lb ${o.cls || ''}` }, layers.top);
        items.push({ draw() { const on = o.show === undefined || val(o.show); const P = on ? val(get) : null; t.style.display = P ? '' : 'none'; if (!P) return; const [x, y] = proj(P); t.setAttribute('x', x + (o.dx ?? 6) * k); t.setAttribute('y', y + (o.dy ?? -6) * k); t.textContent = val(txt); } });
        return api;
      },
      setView(yaw, pitch) { st.yaw = yaw; st.pitch = Math.max(-89, Math.min(89, pitch)); api.update(); },
      reset() { api.setView(init.yaw, init.pitch); },
      update() {
        fit();
        basis();
        occluders = items.map((it) => (it.pre ? it.pre() : null)).filter(Boolean);
        items.forEach((it) => it.draw && it.draw());
        if (api.onUpdate) api.onUpdate();
      },
    };

    // 拖动旋转
    if (opt.rotate !== false) {
      let drag = null;
      svg.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, yaw: st.yaw, pitch: st.pitch }; svg.setPointerCapture(e.pointerId); e.preventDefault(); });
      svg.addEventListener('pointermove', (e) => {
        if (!drag) return;
        const SPEED = 0.45; // 每像素转 0.45°
        api.setView(drag.yaw - (e.clientX - drag.x) * SPEED, drag.pitch + (e.clientY - drag.y) * SPEED);
      });
      const end = () => { drag = null; };
      svg.addEventListener('pointerup', end);
      svg.addEventListener('pointercancel', end);
      svg.classList.add('rot');
    }
    window.addEventListener('resize', () => api.update());
    return api;
  }

  return { view, vec: { sub, add, mul, dot, lerp, norm } };
})();
window.Solid3D = Solid3D;
