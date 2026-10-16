'use strict';
/* 课本插件 · 图形的运动与翻折（八上第 1 章 全等三角形、第 2 章 轴对称 共用；依赖 mgeo.js，加载在 mgeo.js 之后、course.js 之前）
 * 所有运动都是精确的刚体变换（坐标计算），t ∈ [0, 1] 表示动画进度：
 *   MFold.reflect(p, A, B)           点 p 关于直线 AB 的对称点
 *   MFold.move(pts, ms, t)           按运动序列 ms 变换点列；ms 为一个或多个：
 *                                    { T: [dx, dy] } 平移；{ R: 度, c: [x, y] } 绕 c 逆时针旋转；{ F: [A, B] } 沿直线 AB 翻折
 *                                    翻折动画 = 纸片绕折痕在空间里翻转后的正投影：到折痕的距离按 cos(πt) 变化，t = 1 时恰为对称点
 *   MFold.same(P, Q, eps)            两组点是否完全重合（顶点集合相同，与顺序无关）
 *   MFold.ticks(b, P, Q, n, o)       在线段 PQ 中点画 n 条“相等”短记号（参数可为函数）
 *   MFold.tween(ms, onT, done)       用 requestAnimationFrame 把 t 从 0 推到 1（缓动），返回取消函数
 */
const MFold = (() => {
  const { add, sub, mul, dist, rot, foot } = Geo;
  const val = (v) => (typeof v === 'function' ? v() : v);

  const reflect = (p, A, B) => sub(mul(foot(p, A, B), 2), p);

  function one(p, m, t) {
    if (m.T) return add(p, mul(m.T, t));
    if (m.R !== undefined) return rot(p, m.R * t, m.c || [0, 0]);
    if (m.F) {
      const f = foot(p, m.F[0], m.F[1]);
      return add(f, mul(sub(p, f), Math.cos(Math.PI * t)));
    }
    return p;
  }

  /** 多段运动按顺序进行：t 均分给每一段 */
  function move(pts, ms, t = 1) {
    const list = Array.isArray(ms) ? ms : [ms];
    const n = list.length;
    return pts.map((p0) => list.reduce((p, m, i) => one(p, m, Math.min(1, Math.max(0, t * n - i))), p0));
  }

  const same = (P, Q, eps = 1e-6) => P.length === Q.length
    && P.every((p) => Q.some((q) => dist(p, q) < eps))
    && Q.every((q) => P.some((p) => dist(p, q) < eps));

  function ticks(b, P, Q, n = 1, o = {}) {
    const len = o.len ?? 0.18;
    const gap = o.gap ?? 0.1;
    return Array.from({ length: n }, (_, i) => b.seg(() => {
      const p = val(P);
      const q = val(Q);
      const d = dist(p, q) || 1;
      const u = mul(sub(q, p), 1 / d);
      const nrm = [-u[1], u[0]];
      const c = add(mul(add(p, q), 0.5), mul(u, (i - (n - 1) / 2) * gap));
      return [add(c, mul(nrm, len)), add(c, mul(nrm, -len))];
    }, { cls: o.cls || 'gtick' }));
  }

  function tween(ms, onT, done) {
    let alive = true;
    const t0 = performance.now();
    const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - ((-2 * x + 2) ** 2) / 2);
    const tick = (now) => {
      if (!alive) return;
      const x = Math.min(1, (now - t0) / ms);
      onT(ease(x));
      if (x < 1) requestAnimationFrame(tick); else if (done) done();
    };
    requestAnimationFrame(tick);
    return () => { alive = false; };
  }

  return { reflect, move, same, ticks, tween };
})();
window.MFold = MFold;
