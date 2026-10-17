'use strict';
/* 课本插件 · 分数图（五下“分数的意义和性质”用；加载在 mcheck.js 之后、course.js 之前，不改动其他 shared 文件）
 * 所有图形的份数、位置都按数值精确计算。
 * FracFig.el(tag, attrs, parent)                       → SVG 元素
 * FracFig.pie(svg, { cx, cy, r, n, on })               → 平均分成 n 份的圆，on(i) 为真的扇形涂色；返回扇形数组
 * FracFig.bar(svg, { x, y, w, h, n, on })              → 平均分成 n 份的长条
 * FracFig.grid(svg, { x, y, w, h, rows, cols, on })     → rows × cols 方格（on(i) 按行优先编号）
 * FracFig.gcd(a, b)、FracFig.texFrac(a, b, simplify)   → KaTeX 分数字符串
 * FracFig.exact(root)：<span class="blank" data-exact data-ans="1/2"> 只认字面答案（如“约成最简分数”），
 *   mcheck 按数值判对后，这里再按字面复核。
 */
const FracFig = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const FILL = '#8fd3f4';
  const LINE = '#2a9fd6';
  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
    if (parent) parent.appendChild(e);
    return e;
  };
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const texFrac = (a, b, simplify) => {
    const g = simplify ? gcd(a, b) : 1;
    return b / g === 1 ? `${a / g}` : `\\dfrac{${a / g}}{${b / g}}`;
  };
  const pt = (cx, cy, r, t) => `${(cx + r * Math.cos(t)).toFixed(2)} ${(cy + r * Math.sin(t)).toFixed(2)}`;

  function pie(svg, o) {
    const { cx, cy, r, n } = o;
    const on = o.on || (() => false);
    const fill = o.fill || FILL;
    const line = o.line || LINE;
    const g = el('g', { class: 'ff-pie' }, svg);
    if (n === 1) {
      const c = el('circle', { cx, cy, r, fill: on(0) ? fill : '#fff', stroke: line, 'stroke-width': 2, class: 'ff-part', 'data-i': 0 }, g);
      return [c];
    }
    const start = o.start ?? -Math.PI / 2;
    return Array.from({ length: n }, (_, i) => {
      const t0 = start + (i * 2 * Math.PI) / n;
      const t1 = t0 + (2 * Math.PI) / n;
      return el('path', {
        d: `M${cx} ${cy}L${pt(cx, cy, r, t0)}A${r} ${r} 0 0 1 ${pt(cx, cy, r, t1)}Z`,
        fill: on(i) ? fill : '#fff', stroke: line, 'stroke-width': 2, 'stroke-linejoin': 'round', class: 'ff-part', 'data-i': i,
      }, g);
    });
  }

  function bar(svg, o) {
    const { x, y, w, h, n } = o;
    const on = o.on || (() => false);
    const g = el('g', { class: 'ff-bar' }, svg);
    const parts = Array.from({ length: n }, (_, i) => el('rect', {
      x: x + (w * i) / n, y, width: w / n, height: h, fill: on(i) ? (o.fill || FILL) : (o.empty || '#fff'),
      stroke: o.line || LINE, 'stroke-width': o.sw || 2, class: 'ff-part', 'data-i': i,
    }, g));
    el('rect', { x, y, width: w, height: h, fill: 'none', stroke: o.line || LINE, 'stroke-width': (o.sw || 2) + 0.5 }, g);
    return parts;
  }

  function grid(svg, o) {
    const { x, y, w, h, rows, cols } = o;
    const on = o.on || (() => false);
    const g = el('g', { class: 'ff-grid' }, svg);
    const cw = w / cols;
    const ch = h / rows;
    const parts = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const i = r * cols + c;
        parts.push(el('rect', { x: x + c * cw, y: y + r * ch, width: cw, height: ch, fill: on(i) ? (o.fill || FILL) : '#fff', stroke: o.line || LINE, 'stroke-width': o.sw || 1.5, class: 'ff-part', 'data-i': i }, g));
      }
    }
    return parts;
  }

  /* 字面复核：mcheck 判“数值相等”后，按字面再判一次（在 mcheck 的监听之后执行） */
  const norm = (s) => String(s).trim()
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[∶：]/g, ':').replace(/[．。]/g, '.').replace(/／/g, '/').replace(/\s+/g, '');
  function exact(root = document) {
    root.querySelectorAll('.blank[data-exact]:not([data-exact-ready])').forEach((b) => {
      b.dataset.exactReady = '1';
      const inp = b.querySelector('input');
      if (!inp) return;
      const recheck = () => setTimeout(() => {
        const v = norm(inp.value);
        if (!v || !b.classList.contains('ok')) return;
        if (!b.dataset.ans.split('|').map(norm).includes(v)) b.classList.replace('ok', 'no');
      }, 0);
      inp.addEventListener('change', recheck);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') recheck(); });
    });
  }

  return { el, pie, bar, grid, gcd, texFrac, exact, FILL, LINE };
})();
window.FracFig = FracFig;
