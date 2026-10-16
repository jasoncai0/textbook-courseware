'use strict';
/* 课本插件 · 向量作图（高一下 第9章 等用）。加载在 math.js 之后、course.js 之前；配 mvec.css。
 * const b = MathKit.board(el, {...});
 * MathKit.vec(b, () => [[x1, y1], [x2, y2]], { cls: 'v1', label: 'a', side: 1 });
 *   画一条带箭头的有向线段（箭头大小按屏幕像素，不随缩放变形）；cls：v1 蓝 / v2 橙 / v3 绿 / v4 紫 / vg 灰虚线。
 *   label 为字符串或函数，标在线段中点的一侧（side = 1 左侧 / -1 右侧，按起点→终点方向看）；
 *   label 按课本印成粗斜体（a、b、e₁、a+b…）；点名 A、B 等用 b.text 普通标注。$\overrightarrow{AB}$ 这类记号写在 HTML 里（KaTeX）。
 * MathKit.vecAdd(p, q) / vecSub / vecMul(k, p) / vecLen / vecDot：纯函数，返回新数组。
 */
(() => {
  const M = window.MathKit;
  if (!M) { console.error('mvec.js 需要先加载 math.js'); return; }
  const HEAD_PX = 17; // 箭头长（屏幕像素）
  const HALF_PX = 7; // 箭头半宽
  const LABEL_PX = 22; // 标注离开线段的距离

  // 每个屏幕像素对应多少“世界单位”（横纵同比例时两者相等）
  const perPx = (b) => {
    const r = b.svg.getBoundingClientRect();
    const scale = r.width && r.height ? Math.min(r.width / b.W, r.height / b.H) : 1;
    return [1 / (scale * (b.X(1) - b.X(0))), 1 / (scale * (b.Y(0) - b.Y(1)))];
  };

  function geom(b, s) {
    const [[x1, y1], [x2, y2]] = s;
    const [ux, uy] = perPx(b);
    const dxp = (x2 - x1) / ux; // 换算到像素方向，箭头才不会因横纵比例不同而歪
    const dyp = (y2 - y1) / uy;
    const L = Math.hypot(dxp, dyp);
    if (L < 1e-6) return null;
    const [cx, cy] = [dxp / L, dyp / L];
    const head = Math.min(HEAD_PX, L * 0.6);
    const half = HALF_PX * (head / HEAD_PX);
    const base = [x2 - cx * head * ux, y2 - cy * head * uy];
    const n = [-cy, cx]; // 左法向（像素空间）
    return {
      line: [[x1, y1], [x2 - cx * head * 0.6 * ux, y2 - cy * head * 0.6 * uy]],
      head: [[x2, y2], [base[0] + n[0] * half * ux, base[1] + n[1] * half * uy], [base[0] - n[0] * half * ux, base[1] - n[1] * half * uy]],
      mid: (side) => [(x1 + x2) / 2 + n[0] * LABEL_PX * side * ux, (y1 + y2) / 2 + n[1] * LABEL_PX * side * uy],
    };
  }

  const val = (v) => (typeof v === 'function' ? v() : v);

  /** 有向线段 + 箭头 + 可选标注；get 返回 null 时整体隐藏 */
  function vec(b, get, o = {}) {
    const cls = o.cls || 'v1';
    let g = null;
    const cur = () => { const s = val(get); g = s ? geom(b, s) : null; return g; };
    const line = b.seg(() => (cur() ? g.line : [[0, 0], [0, 0]]), { cls: `vline ${cls}` });
    const head = b.poly(() => (g ? g.head : [[0, 0], [0, 0], [0, 0]]), { cls: `vhead ${cls}` });
    const parts = [line, head];
    let txt = null;
    if (o.label !== undefined) {
      txt = b.text(() => (g ? g.mid(val(o.side ?? 1)) : null), () => String(val(o.label)), { cls: `vlab ${cls}`, dy: 7 });
      txt.setAttribute('text-anchor', 'middle');
      parts.push(txt);
    }
    // 先画后求值：seg 在 poly 之前注册，所以 g 每次都是最新的；隐藏时整组不显示
    const hide = () => parts.forEach((p) => { p.style.display = g ? '' : 'none'; });
    b.text(() => { hide(); return null; }, '');
    return { line, head, label: txt };
  }

  const vecAdd = (p, q) => [p[0] + q[0], p[1] + q[1]];
  const vecSub = (p, q) => [p[0] - q[0], p[1] - q[1]];
  const vecMul = (k, p) => [k * p[0], k * p[1]];
  const vecLen = (p) => Math.hypot(p[0], p[1]);
  const vecDot = (p, q) => p[0] * q[0] + p[1] * q[1];

  Object.assign(M, { vec, vecAdd, vecSub, vecMul, vecLen, vecDot });
})();
