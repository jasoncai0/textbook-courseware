'use strict';
/* 课本插件 · 实体着色立体图（新增模块，不依赖 math.js / solid3d.js；加载在本课 course.js 之前）
 * 与 solid3d.js 同一套坐标与投影：x 向右、y 向里、z 向上，正交投影，yaw 绕 z 轴、pitch 抬高视点。
 * 区别：solid3d 画线框（被挡的线画虚线，课本立体图风格）；本模块画不透明的面（画家算法：远的先画），
 * 适合折纸展开图、小立方块、把视点转到正前方 / 正左方 / 正上方直接得到“视图”。
 *
 *   const v = Poly3D.view(el, { w: 600, h: 440, scale: 70, yaw: -30, pitch: 22, center: [0, 0, 1] });
 *   v.add(() => [Poly3D.box([0,0,0], [2,1,1], { cls: 'm1' }), …]);   // 返回物体数组的函数，每次 update 重新求值
 *   物体种类：
 *     （任何物体可加 color: '#rrggbb' 按朝向加明暗；再加 flat: true 则不加明暗，画“视图”时用白色）
 *     { type: 'mesh', V, F, smooth, sharp, cls }   封闭多面体，面朝外逆时针；背面剔除。smooth=true 时只描轮廓线和 sharp 棱
 *     { type: 'face', pts, cls, out, label, lines } 单张双面纸片（展开图用）；out 为“外侧”法向，label 只在外侧朝向观察者时显示
 *     { type: 'sphere', c, r, cls }  { type: 'dot', p, cls }  { type: 'text', p, text, cls, dx, dy }
 *   v.update(); v.setView(yaw, pitch); v.animateTo(yaw, pitch, ms); v.onUpdate = () => {};
 *   构造：Poly3D.box(min, max, o)、Poly3D.prism(profile2D, axis, w0, w1, o)、Poly3D.revolve({ r1, r2, h, at, n }, o)
 */
const Poly3D = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const DEG = Math.PI / 180;
  const EPS = 1e-6;
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
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => Math.hypot(a[0], a[1], a[2]);
  const unit = (a) => mul(a, 1 / (norm(a) || 1));
  const centroid = (P) => mul(P.reduce(add, [0, 0, 0]), 1 / P.length);
  function newell(pts) {
    const n = [0, 0, 0];
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      n[0] += (p[1] - q[1]) * (p[2] + q[2]);
      n[1] += (p[2] - q[2]) * (p[0] + q[0]);
      n[2] += (p[0] - q[0]) * (p[1] + q[1]);
    });
    return unit(n);
  }
  /** 绕过点 A、方向 u（单位向量）的轴旋转 ang 弧度（Rodrigues 公式） */
  function rotate(P, A, u, ang) {
    const v = sub(P, A);
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    const r = add(add(mul(v, c), mul(cross(u, v), s)), mul(u, dot(u, v) * (1 - c)));
    return add(A, r);
  }

  /* ---------- 构造封闭多面体（面朝外，逆时针） ---------- */
  const key = (i, j) => (i < j ? `${i}-${j}` : `${j}-${i}`);
  function box(a, b, o = {}) {
    const [x0, y0, z0] = a;
    const [x1, y1, z1] = b;
    const V = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
    const F = [[3, 2, 1, 0], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
    return { type: 'mesh', V, F, ...o };
  }
  /** 平面多边形 profile（[[u, v], …]，顺逆时针均可）沿轴拉伸成柱体。axis：'y'（profile 在 xz 平面，即正面轮廓，沿 y 从 w0 到 w1）、'x'（profile 在 yz 平面）、'z'（在 xy 平面） */
  function prism(profile, axis, w0, w1, o = {}) {
    const [U, W, D] = { y: [[1, 0, 0], [0, 0, 1], [0, 1, 0]], x: [[0, 1, 0], [0, 0, 1], [1, 0, 0]], z: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] }[axis];
    const area = profile.reduce((s2, p, i) => { const q = profile[(i + 1) % profile.length]; return s2 + p[0] * q[1] - q[0] * p[1]; }, 0);
    const pr = area < 0 ? [...profile].reverse() : profile; // 统一成逆时针
    const at = (p, w) => add(add(mul(U, p[0]), mul(W, p[1])), mul(D, w));
    const n = pr.length;
    const V = [...pr.map((p) => at(p, w0)), ...pr.map((p) => at(p, w1))];
    const fix = (f, want) => (dot(newell(f.map((i) => V[i])), want) < 0 ? [...f].reverse() : f);
    const dw = Math.sign(w1 - w0) || 1;
    const F = [
      fix(pr.map((_, i) => i), mul(D, -dw)),
      fix(pr.map((_, i) => n + i), mul(D, dw)),
      ...pr.map((p, i) => {
        const q = pr[(i + 1) % n];
        const outward = sub(mul(U, q[1] - p[1]), mul(W, q[0] - p[0])); // 逆时针多边形的外法向 (dv, −du)
        return fix([i, (i + 1) % n, n + ((i + 1) % n), n + i], outward);
      }),
    ];
    return { type: 'mesh', V, F, ...o };
  }
  /** 圆柱 / 圆锥 / 圆台（轴平行 z），侧面光滑：只描底面圆和轮廓母线 */
  function revolve({ r1, r2, h, at = [0, 0, 0], n = 72 }, o = {}) {
    const ring = (r, z) => Array.from({ length: n }, (_, i) => add(at, [r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n), z]));
    const sharp = new Set();
    if (r2 <= 1e-9) {
      const V = [...ring(r1, 0), add(at, [0, 0, h])];
      const F = [ring(r1, 0).map((_, i) => n - 1 - i), ...Array.from({ length: n }, (_, i) => [i, (i + 1) % n, n])];
      for (let i = 0; i < n; i += 1) sharp.add(key(i, (i + 1) % n));
      return { type: 'mesh', V, F, smooth: true, sharp, apex: n, ...o };
    }
    const V = [...ring(r1, 0), ...ring(r2, h)];
    const F = [ring(r1, 0).map((_, i) => n - 1 - i), ring(r2, h).map((_, i) => n + i), ...Array.from({ length: n }, (_, i) => [i, (i + 1) % n, n + ((i + 1) % n), n + i])];
    for (let i = 0; i < n; i += 1) { sharp.add(key(i, (i + 1) % n)); sharp.add(key(n + i, n + ((i + 1) % n))); }
    return { type: 'mesh', V, F, smooth: true, sharp, ...o };
  }
  // 物体给了 color（#rrggbb）时按面的朝向加一点明暗，立体感更强；没给就用 CSS 类的颜色
  const LIGHT = unit([-0.45, -0.75, 0.8]);
  function shade(hex, n) {
    const s = 0.74 + 0.26 * Math.max(0, dot(n, LIGHT));
    const c = parseInt(hex.slice(1), 16);
    const ch = (v) => Math.round(Math.min(255, v * s));
    return `rgb(${ch((c >> 16) & 255)},${ch((c >> 8) & 255)},${ch(c & 255)})`;
  }
  const paint = (el, obj, n) => { if (obj.color) { const c = obj.flat ? obj.color : shade(obj.color, n); el.style.fill = c; el.style.stroke = el.classList.contains('sm') ? c : ''; } return el; };

  function view(el, opt = {}) {
    const host = typeof el === 'string' ? document.querySelector(el) : el;
    const W = opt.w || 600;
    const H = opt.h || 440;
    const init = { yaw: opt.yaw ?? -30, pitch: opt.pitch ?? 22 };
    const st = { ...init };
    const svg = mk('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' }, host);
    host.classList.add('p3d');
    host.setAttribute('data-noswipe', '');
    const root = mk('g', {}, svg);
    const getters = [];
    let k = 1;
    let E = [0, -1, 0];
    let anim = null;

    const basis = () => {
      const y = st.yaw * DEG;
      const p = st.pitch * DEG;
      E = [-Math.sin(y) * Math.cos(p), -Math.cos(y) * Math.cos(p), Math.sin(p)]; // 指向观察者
    };
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
    const ptsAttr = (P) => P.map((q) => proj(q).map((v) => v.toFixed(2)).join(',')).join(' ');
    const fit = () => {
      const r = svg.getBoundingClientRect();
      if (!r.width || !r.height) return;
      k = 1 / Math.min(r.width / W, r.height / H);
      svg.style.fontSize = `${k * parseFloat(getComputedStyle(host).fontSize) * 0.62}px`;
    };

    // 把物体拆成可排序的绘制单元 { depth, draw(g) }
    function units(obj) {
      const out = [];
      if (obj.type === 'mesh') {
        const { V, F } = obj;
        const nrm = F.map((f) => newell(f.map((i) => V[i])));
        const front = nrm.map((nn) => dot(nn, E) > EPS);
        // 边 → 相邻面（用于光滑面的轮廓线）
        const adj = new Map();
        F.forEach((f, fi) => f.forEach((x, i) => { const kk = key(x, f[(i + 1) % f.length]); adj.set(kk, [...(adj.get(kk) || []), fi]); }));
        F.forEach((f, fi) => {
          if (!front[fi]) return;
          const P = f.map((i) => V[i]);
          const edges = [];
          f.forEach((x, i) => {
            const y = f[(i + 1) % f.length];
            const kk = key(x, y);
            const nb = (adj.get(kk) || []).filter((g) => g !== fi);
            const sil = nb.length === 0 || nb.some((g) => !front[g]);
            if (!obj.smooth || sil || (obj.sharp && obj.sharp.has(kk))) edges.push([V[x], V[y]]);
          });
          out.push({
            depth: dot(centroid(P), E),
            draw(g) {
              paint(mk('polygon', { class: `pf ${obj.cls || ''} ${f.length === 3 || obj.smooth ? 'sm' : ''}`, points: ptsAttr(P) }, g), obj, nrm[fi]);
              if (edges.length) mk('path', { class: `pe ${obj.ecls || ''}`, d: edges.map(([a, b]) => { const [x1, y1] = proj(a); const [x2, y2] = proj(b); return `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`; }).join('') }, g);
            },
          });
        });
        if (obj.apex !== undefined && obj.apexDot) out.push({ depth: dot(V[obj.apex], E) + 1e-3, draw(g) { const [x, y] = proj(V[obj.apex]); mk('circle', { class: 'pd', cx: x, cy: y, r: 3.5 * k }, g); } });
      } else if (obj.type === 'face') {
        const P = obj.pts;
        const nOut = obj.out || newell(P);
        const outside = dot(nOut, E) > 0;
        out.push({
          depth: dot(centroid(P), E),
          draw(g) {
            paint(mk('polygon', { class: `pf ${obj.cls || ''} ${outside ? 'out' : 'in'}`, points: ptsAttr(P) }, g), obj, outside ? nOut : mul(nOut, -1));
            (obj.lines || P.map((p, i) => [p, P[(i + 1) % P.length], ''])).forEach((ln) => {
              const [a, b, c] = ln;
              const [x1, y1] = proj(a); const [x2, y2] = proj(b);
              mk('line', { class: `pe ${c || ''}`, x1, y1, x2, y2 }, g);
            });
            if (obj.label !== undefined && outside) {
              const [x, y] = proj(obj.labelAt || centroid(P));
              mk('text', { class: `pl ${obj.lcls || ''}`, x, y, dy: '.35em' }, g).textContent = obj.label;
            }
          },
        });
      } else if (obj.type === 'sphere') {
        out.push({ depth: dot(obj.c, E), draw(g) { const [x, y] = proj(obj.c); const c = mk('circle', { class: `pf sphere ${obj.cls || ''}`, cx: x, cy: y, r: obj.r * (val(opt.scale) || 60) }, g); if (obj.color) c.style.fill = obj.color; } });
      } else if (obj.type === 'dot') {
        out.push({ depth: dot(obj.p, E) + 1e-3, draw(g) { const [x, y] = proj(obj.p); mk('circle', { class: `pd ${obj.cls || ''}`, cx: x, cy: y, r: (obj.r || 4) * k }, g); } });
      } else if (obj.type === 'text') {
        out.push({ depth: obj.top ? Infinity : dot(obj.p, E) + 1e-3, draw(g) { const [x, y] = proj(obj.p); mk('text', { class: `pt ${obj.cls || ''}`, x: x + (obj.dx || 0) * k, y: y + (obj.dy || 0) * k }, g).textContent = obj.text; } });
      } else if (obj.type === 'line') {
        out.push({ depth: obj.top ? Infinity : dot(centroid([obj.a, obj.b]), E) + (obj.bias || 0), draw(g) { const [x1, y1] = proj(obj.a); const [x2, y2] = proj(obj.b); mk('line', { class: `pe ${obj.cls || ''}`, x1, y1, x2, y2 }, g); } });
      }
      return out;
    }

    const api = {
      svg, W, H, proj, state: st, rotate, newell,
      add(get) { getters.push(get); return api; },
      setView(yaw, pitch) { st.yaw = yaw; st.pitch = Math.max(-90, Math.min(90, pitch)); api.update(); },
      reset() { api.animateTo(init.yaw, init.pitch, 500); },
      /** 视点平滑转到 (yaw, pitch)；转到 0/90 等整数角时结果是精确的正投影视图 */
      animateTo(yaw, pitch, ms = 700) {
        if (anim) cancelAnimationFrame(anim);
        const from = { ...st };
        let dy = yaw - from.yaw;
        dy -= 360 * Math.round(dy / 360);
        const t0 = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - t0) / ms);
          const e = t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
          st.yaw = from.yaw + dy * e;
          st.pitch = from.pitch + (pitch - from.pitch) * e;
          if (t >= 1) { st.yaw = from.yaw + dy; st.pitch = pitch; }
          api.update();
          anim = t < 1 ? requestAnimationFrame(tick) : null;
        };
        anim = requestAnimationFrame(tick);
      },
      update() {
        fit();
        basis();
        const all = getters.flatMap((g) => [val(g)].flat().filter(Boolean)).flatMap(units);
        all.sort((a, b) => a.depth - b.depth);
        root.replaceChildren();
        all.forEach((u) => u.draw(mk('g', {}, root)));
        if (api.onUpdate) api.onUpdate();
      },
    };

    if (opt.rotate !== false) {
      let drag = null;
      svg.addEventListener('pointerdown', (e) => {
        if (e.target.closest('[data-pick]')) return;
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        drag = { x: e.clientX, y: e.clientY, yaw: st.yaw, pitch: st.pitch };
        svg.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      svg.addEventListener('pointermove', (e) => {
        if (!drag) return;
        const SPEED = 0.45; // 每像素转 0.45°
        api.setView(drag.yaw - (e.clientX - drag.x) * SPEED, drag.pitch + (e.clientY - drag.y) * SPEED);
        if (api.onRotate) api.onRotate();
      });
      const end = () => { drag = null; };
      svg.addEventListener('pointerup', end);
      svg.addEventListener('pointercancel', end);
      svg.classList.add('rot');
    }
    window.addEventListener('resize', () => api.update());
    return api;
  }

  return { view, box, prism, revolve, rotate, newell, vec: { sub, add, mul, dot, cross, norm, unit, centroid } };
})();
window.Poly3D = Poly3D;
