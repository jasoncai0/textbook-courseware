'use strict';
/* 课本插件 · 数轴（七年级“有理数”一章用；加载在 math.js 之后、course.js 之前，不改动 math.js）
 * const b = NumLine.board(el, { from: -5, to: 5 });         // 横向数轴作图板（MathKit.board，无网格）
 * NumLine.axis(b, { from: -5, to: 5, step: 1, minor: 0.5 }); // 画轴线、刻度、数字、正方向箭头（tick：刻度半长）
 * 之后照常用 b.pt / b.seg / b.text / b.drag；数轴在 y = 0，上方 y > 0。 */
const NumLine = (() => {
  const minus = (v) => String(+v.toFixed(2)).replace('-', '−'); // 课本用长减号

  function board(el, o) {
    const pad = o.pad ?? 0.7;
    return MathKit.board(el, {
      x: [o.from - pad, o.to + pad + 0.3], y: o.y || [-1, 1.6], w: o.w || 680, h: o.h || 130, axes: false, grid: false,
    });
  }

  /** 轴线 + 刻度 + 数字 + 箭头。label(v) 返回 '' 表示该刻度不标数字 */
  function axis(b, o) {
    const { from, to } = o;
    const step = o.step || 1;
    const tl = o.tick || 0.16; // 刻度线半长（世界坐标）
    const cls = o.cls || 'nl-ax';
    const right = to + (o.tail ?? 0.75);
    const left = from - (o.lead ?? 0.45);
    b.seg([[left, 0], [right, 0]], { cls });
    // 箭头按 viewBox 像素定大小（横纵比例不同，直接用世界坐标画会变形）
    const ax = 16 / (b.X(1) - b.X(0));
    const ay = 7 / (b.Y(0) - b.Y(1));
    b.poly([[right + ax * 0.3, 0], [right - ax * 0.7, ay], [right - ax * 0.7, -ay]], { cls: 'nl-arrow' });
    const tick = (v, len, c) => b.seg([[v, -len], [v, len]], { cls: c });
    if (o.minor) for (let v = Math.ceil(from / o.minor) * o.minor; v <= to + 1e-9; v += o.minor) {
      if (Math.abs(v / step - Math.round(v / step)) > 1e-6) tick(v, tl / 2, 'nl-minor');
    }
    const label = o.label || minus;
    for (let v = Math.ceil(from / step) * step; v <= to + 1e-9; v += step) {
      const x = +v.toFixed(6);
      tick(x, tl, Math.abs(x) < 1e-9 ? 'nl-zero' : 'nl-tick');
      const t = label(x);
      if (t !== '') b.text([x, 0], t, { cls: 'nl-num', dy: 26 });
    }
    return b;
  }

  return { board, axis, minus };
})();
window.NumLine = NumLine;
