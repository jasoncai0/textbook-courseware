'use strict';
/* 课本插件 · 角与作图工具（七上第 6 章 角/余角补角/平行/垂直 共用；依赖 math.js 的 MathKit.board，加载在 math.js 之后、course.js 之前）
 * 角度一律用“度”，方向角从 x 轴正方向逆时针量；所有图形按坐标精确计算。
 *   MAngle.dir(o, p)                 射线 OP 的方向角（0～360）
 *   MAngle.at(o, d, r)               从 o 沿方向 d 走 r 的点
 *   MAngle.size(o, p, q)             ∠POQ 的度数（0～180）
 *   MAngle.mark(b, o, p, q, r, opt)  在 b 上画 ∠POQ 的弧（较小的那个角）；参数都可为函数
 *   MAngle.square(b, o, d, s, opt)   直角记号：顶点 o，一边方向 d（另一边 d+90）
 *   MAngle.protractor(b, s, opt)     可拖动、可旋转的量角器；s = { c: [x, y], rot: 度 }，opt.r 半径
 *   MAngle.dms(deg)                  29.75 → "29°45′"
 */
const MAngle = (() => {
  const RAD = Math.PI / 180;
  const val = (v) => (typeof v === 'function' ? v() : v);
  const norm = (d) => ((d % 360) + 360) % 360;
  const at = (o, d, r) => [o[0] + r * Math.cos(d * RAD), o[1] + r * Math.sin(d * RAD)];
  const dir = (o, p) => norm(Math.atan2(p[1] - o[1], p[0] - o[0]) / RAD);
  const size = (o, p, q) => { const s = norm(dir(o, q) - dir(o, p)); return s > 180 ? 360 - s : s; };
  // 较小角的起始方向与张角
  const span = (o, p, q) => {
    const d1 = dir(o, p);
    const s = norm(dir(o, q) - d1);
    return s > 180 ? [dir(o, q), 360 - s] : [d1, s];
  };

  function mark(b, o, p, q, r, opt = {}) {
    return b.curve((t) => {
      const O = val(o);
      const [d1, s] = span(O, val(p), val(q));
      return at(O, d1 + s * t, val(r));
    }, 0, 1, { cls: 'amark', n: 60, ...opt });
  }

  function square(b, o, d, s, opt = {}) {
    return b.poly(() => {
      const O = val(o);
      const D = val(d);
      const S = val(s);
      const u = at(O, D, S);
      return [O, u, at(u, D + 90, S), at(O, D + 90, S)];
    }, { cls: 'rmark', ...opt });
  }

  const dms = (deg) => {
    const total = Math.round(deg * 3600);
    const d = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const sec = total % 60;
    return `${d}°${m || sec ? `${m}′` : ''}${sec ? `${sec}″` : ''}`;
  };

  /* 量角器：半圆，外圈刻度从基线右端 0° 逆时针到 180°，内圈反向（与真实量角器一致）
   * 拖中心点平移，拖基线右端的把手旋转；opt.snap 旋转吸附步长（度），opt.onMove(s) 拖动后可修正 s（如吸附），opt.fixed 为 true 时不可拖 */
  function protractor(b, s, opt = {}) {
    const R = opt.r || 4;
    const snap = opt.snap || 0;
    const c = () => s.c;
    const P = (deg, k) => at(c(), s.rot + deg, R * k);
    b.poly(() => Array.from({ length: 91 }, (_, i) => P(i * 2, 1)), { cls: 'prot-body' });
    b.seg(() => [P(0, 1), P(180, 1)], { cls: 'prot-base' });
    for (let i = 0; i <= 180; i++) {
      const k = i % 10 === 0 ? 0.86 : i % 5 === 0 ? 0.91 : 0.95;
      b.seg(() => [P(i, k), P(i, 1)], { cls: i % 10 === 0 ? 'prot-tk big' : 'prot-tk' });
    }
    for (let i = 0; i <= 180; i += 10) {
      b.text(() => P(i, 0.76), String(i), { cls: 'prot-n', dy: 5 });
      if (opt.inner !== false) b.text(() => P(i, 0.6), String(180 - i), { cls: 'prot-n in', dy: 5 });
    }
    b.seg(() => [P(90, 0), P(90, 0.12)], { cls: 'prot-tk big' });
    if (opt.fixed) return;
    b.drag(c, (x, y) => { s.c = [x, y]; if (opt.onMove) opt.onMove(s); }, { r: 7, hit: 18 });
    b.drag(() => P(0, 1.1), (x, y) => {
      const d = dir(c(), [x, y]);
      s.rot = snap ? Math.round(d / snap) * snap : d;
      if (opt.onMove) opt.onMove(s);
    }, { r: 7, hit: 18 });
  }

  return { RAD, norm, at, dir, size, span, mark, square, protractor, dms };
})();
window.MAngle = MAngle;
