'use strict';
/* 课本插件 · 课本样式的折线统计图（五下“折线统计图”用；不依赖其他脚本）
 * const c = MZx.chart(svgEl, {
 *   cats: ['6岁', '7岁', …],          // 横轴各点的名称
 *   atAxis: false,                     // true：第一个点在纵轴上（如时间 0 分）；false：离纵轴一格
 *   y: [110, 145], ty: 5, minor: 1,    // 纵轴范围、主格（实线、标数）、细格（虚线）
 *   broken: true,                      // 纵轴下端画折断号，0 写在最下面
 *   yName: '身高/cm', xName: '年龄',
 *   series: [{ name, vals: [116, …], color, dash: false, labels: true, lbDy: [-1, …], lbDx, skip: [0] }],  // skip：不标数的点
 *   edit: { s: 0, idx: [0, 1, …], snap: 1, onChange(vals) {} },   // 可选：点/拖动描点
 * });
 * c.set(k, vals) 换数据重画；c.X(i)、c.Y(v) 坐标换算；c.top 是不会被重画清掉的图层（课件自画标注用）。
 * 点和线段的位置都由数据精确计算；值为 null 的点不画，相邻两个点都有值才连线。
 */
const MZx = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
    if (parent) parent.appendChild(e);
    return e;
  };
  const COLORS = ['#e0336f', '#1d6fa5', '#2f7d6b', '#d9711c'];
  const GAP = 30; // 折断号占的高度

  function chart(svg, o) {
    const W = o.w || 700;
    const H = o.h || 400;
    const M = { l: 70, r: o.xName ? 74 : 30, t: 46, b: 46 };
    const pl = M.l;
    const pr = W - M.r;
    const pt = M.t;
    const pb = H - M.b;
    const [lo, hi] = o.y;
    const n = o.cats.length;
    const slots = (o.atAxis ? n - 1 : n) + (o.tail ?? 0.6);
    const step = (pr - pl) / slots;
    const X = (i) => pl + (o.atAxis ? i : i + 1) * step;
    const base = o.broken ? pb - GAP : pb;
    const Y = (v) => base - ((v - lo) / (hi - lo)) * (base - pt);
    const invY = (py) => lo + ((base - py) / (base - pt)) * (hi - lo);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.classList.add('mzx');
    svg.innerHTML = '';
    const g = { grid: mk('g', {}, svg), data: mk('g', {}, svg) };
    const top = mk('g', {}, svg);
    const series = o.series.map((s, k) => ({ color: COLORS[k], labels: true, ...s, vals: [...s.vals] }));

    // 网格与坐标轴（不随数据变）
    const eps = 1e-9;
    if (o.minor) for (let v = lo; v <= hi + eps; v += o.minor) {
      if (Math.abs(((v - lo) / o.ty) - Math.round((v - lo) / o.ty)) > 1e-6) mk('line', { x1: pl, x2: pr, y1: Y(v), y2: Y(v), class: 'zx-minor' }, g.grid);
    }
    for (let v = lo; v <= hi + eps; v += o.ty) {
      mk('line', { x1: pl, x2: pr, y1: Y(v), y2: Y(v), class: 'zx-major' }, g.grid);
      mk('text', { x: pl - 8, y: Y(v) + 6, class: 'zx-tk end' }, g.grid).textContent = String(+v.toFixed(2));
    }
    o.cats.forEach((c, i) => {
      mk('line', { x1: X(i), x2: X(i), y1: pt, y2: o.atAxis && i === 0 ? pt : pb, class: 'zx-major' }, g.grid);
      mk('text', { x: X(i), y: pb + 24, class: 'zx-tk mid' }, g.grid).textContent = c;
    });
    mk('line', { x1: pr, x2: pr, y1: pt, y2: pb, class: 'zx-major' }, g.grid);
    if (o.broken) {
      mk('line', { x1: pl, x2: pr, y1: pb, y2: pb, class: 'zx-axis' }, g.grid);
      mk('text', { x: pl - 8, y: pb + 6, class: 'zx-tk end' }, g.grid).textContent = '0';
      mk('line', { x1: pl, x2: pl, y1: pt, y2: base, class: 'zx-axis' }, g.grid);
      mk('path', { d: `M${pl} ${base}l-6 5l12 6l-12 6l6 5V${pb}`, class: 'zx-zig' }, g.grid);
    } else {
      mk('line', { x1: pl, x2: pr, y1: pb, y2: pb, class: 'zx-axis' }, g.grid);
      mk('line', { x1: pl, x2: pl, y1: pt, y2: pb, class: 'zx-axis' }, g.grid);
    }
    if (o.yName) mk('text', { x: pl - 8, y: pt - 16, class: 'zx-nm end' }, g.grid).textContent = o.yName;
    if (o.xName) mk('text', { x: pr + 10, y: pb + 24, class: 'zx-nm' }, g.grid).textContent = o.xName;
    if (o.legend !== false && series.length > 1) {
      series.forEach((s, k) => {
        const lx = pr - (series.length - k) * 150;
        mk('line', { x1: lx, x2: lx + 46, y1: pt - 22, y2: pt - 22, stroke: s.color, class: `zx-line${s.dash ? ' dash' : ''}` }, g.grid);
        mk('text', { x: lx + 52, y: pt - 16, class: 'zx-nm' }, g.grid).textContent = s.name;
      });
    }

    function draw() {
      g.data.innerHTML = '';
      series.forEach((s) => {
        const p = s.vals.map((v, i) => (v === null || v === undefined ? null : [X(i), Y(v)]));
        for (let i = 0; i + 1 < p.length; i += 1) {
          if (p[i] && p[i + 1] && !(s.until !== undefined && i + 1 > s.until)) {
            mk('line', { x1: p[i][0], y1: p[i][1], x2: p[i + 1][0], y2: p[i + 1][1], stroke: s.color, class: `zx-line${s.dash ? ' dash' : ''}` }, g.data);
          }
        }
        p.forEach((q, i) => {
          if (!q) return;
          mk('circle', { cx: q[0], cy: q[1], r: 5, fill: s.color, class: `zx-pt${s.hl && s.hl[i] ? ` ${s.hl[i]}` : ''}` }, g.data);
          if (s.labels && !(s.skip && s.skip.includes(i))) {
            const dy = (s.lbDy && s.lbDy[i]) || -1;
            mk('text', { x: q[0] + ((s.lbDx && s.lbDx[i]) || 0), y: q[1] + (dy < 0 ? -12 : 26), class: 'zx-val mid' }, g.data).textContent = String(s.vals[i]);
          }
        });
      });
    }

    if (o.edit) {
      const e = o.edit;
      const hit = mk('rect', { x: pl - step / 2, y: pt - 10, width: pr - pl + step, height: base - pt + 20, class: 'zx-hit' }, svg);
      svg.appendChild(top);
      let on = false;
      const at = (ev) => {
        const p = svg.createSVGPoint();
        p.x = ev.clientX; p.y = ev.clientY;
        const q = p.matrixTransform(svg.getScreenCTM().inverse());
        const i = e.idx.reduce((best, j) => (Math.abs(X(j) - q.x) < Math.abs(X(best) - q.x) ? j : best), e.idx[0]);
        if (Math.abs(X(i) - q.x) > step * 0.6) return;
        const v = Math.min(hi, Math.max(lo, Math.round(invY(q.y) / e.snap) * e.snap));
        const vals = [...series[e.s].vals];
        vals[i] = +v.toFixed(6);
        series[e.s].vals = vals;
        draw();
        if (e.onChange) e.onChange(vals, i);
      };
      hit.addEventListener('pointerdown', (ev) => { on = true; hit.setPointerCapture(ev.pointerId); at(ev); ev.preventDefault(); });
      hit.addEventListener('pointermove', (ev) => { if (on) at(ev); });
      hit.addEventListener('pointerup', () => { on = false; });
      hit.addEventListener('pointercancel', () => { on = false; });
      svg.closest('[data-noswipe]') || svg.setAttribute('data-noswipe', '');
    }
    draw();
    return {
      svg, X, Y, top, step, plot: { l: pl, r: pr, t: pt, b: pb, base },
      vals: (k) => [...series[k].vals],
      set(k, vals, extra) { series[k] = { ...series[k], ...(extra || {}), vals: [...vals] }; draw(); },
    };
  }

  return { chart, COLORS };
})();
window.MZx = MZx;
