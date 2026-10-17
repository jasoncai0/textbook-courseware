'use strict';
/* 课本插件 · 托盘天平（五下“简易方程”用；不依赖其他脚本，加载在 course.js 之前）
 * const bal = MBalance.create(svgEl);            // svgEl 为空的 <svg>，自动设 viewBox 0 0 600 300
 * bal.set(left, right) → 'eq' | 'L' | 'R'        // 哪边重：L 左边重（左盘下沉）
 * 物品：{ k: 'w', v: 50 } 砝码（默认标 “50 g”，t 可改标签，如 'a g'）
 *       { k: 'box', v: 40, t: 'x 克' } 木块（v 是真实质量，只参与判断轻重，不显示）
 *       { k: 'egg', v: 50, t: '50克' } 鸡蛋；{ k: 'ball', v, r, color, t } 水果等圆形物体
 * 只要两边质量不相等，横梁就倾斜到止挡（真实天平的样子）；相等时水平。
 */
const MBalance = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
    if (parent) parent.appendChild(e);
    return e;
  };
  const P = { x: 300, y: 196 }; // 支点
  const ARM = 190; // 支点到托盘柱的距离
  const POST = 34; // 托盘面高出横梁
  const TILT = 8; // 倾斜角（度）
  const PAN_W = 230;
  const W_SIZE = { 1: 26, 2: 28, 5: 30, 10: 34, 20: 38, 50: 46, 100: 54, 200: 62, 500: 70 };
  const sum = (items) => items.reduce((s, it) => s + it.v, 0);

  function itemWidth(it) {
    if (it.k === 'w') return W_SIZE[it.v] || 30;
    if (it.k === 'box') return it.w || 78;
    if (it.k === 'egg') return 52;
    return 2 * (it.r || 18);
  }

  // 在 (x, 底边 y) 处画一个物品，返回元素
  function drawItem(g, it, x, y) {
    const w = itemWidth(it);
    if (it.k === 'w') {
      const h = w * 1.05;
      mk('rect', { x: x - w / 2, y: y - h, width: w, height: h, rx: 3, class: 'mb-w' }, g);
      mk('rect', { x: x - w * 0.14, y: y - h - w * 0.32, width: w * 0.28, height: w * 0.34, rx: 2, class: 'mb-w' }, g);
      mk('rect', { x: x - w / 2 + 3, y: y - h * 0.62, width: w - 6, height: Math.min(19, h * 0.42), class: 'mb-wl' }, g);
      const t = mk('text', { x, y: y - h * 0.62 + Math.min(19, h * 0.42) * 0.8, class: 'mb-t', 'font-size': Math.min(16, w * 0.4) }, g);
      t.textContent = it.t || `${it.v} g`;
    } else if (it.k === 'box') {
      const h = it.h || 64;
      mk('rect', { x: x - w / 2, y: y - h, width: w, height: h, rx: 3, class: 'mb-box' }, g);
      const t = mk('text', { x, y: y - h / 2 + 8, class: 'mb-t mb-x', 'font-size': it.fs || 22 }, g);
      t.textContent = it.t || 'x 克';
    } else if (it.k === 'egg') {
      mk('ellipse', { cx: x, cy: y - 31, rx: 25, ry: 31, class: 'mb-egg' }, g);
      const t = mk('text', { x, y: y - 25, class: 'mb-t', 'font-size': 15 }, g);
      t.textContent = it.t || '';
    } else {
      const r = it.r || 18;
      mk('circle', { cx: x, cy: y - r, r, fill: it.color || '#f5a623', class: 'mb-ball' }, g);
      if (it.t) mk('text', { x, y: y - r + 5, class: 'mb-t', 'font-size': 13 }, g).textContent = it.t;
    }
  }

  function create(svg) {
    svg.setAttribute('viewBox', '-14 40 628 256');
    svg.classList.add('mbal');
    svg.innerHTML = '';
    // 底座和立柱（不动）
    mk('path', { d: 'M150 292L176 252H424L450 292Z', class: 'mb-base' }, svg);
    mk('rect', { x: 288, y: P.y, width: 24, height: 58, class: 'mb-base' }, svg);
    // 指针表盘（圆心在支点，指针随横梁转）
    const pol = (deg, r) => { const t = (deg * Math.PI) / 180; return `${(P.x + r * Math.sin(t)).toFixed(1)} ${(P.y - r * Math.cos(t)).toFixed(1)}`; };
    mk('path', { d: `M${pol(-34, 70)}A70 70 0 0 1 ${pol(34, 70)}L${pol(34, 42)}A42 42 0 0 0 ${pol(-34, 42)}Z`, class: 'mb-dial' }, svg);
    for (let a = -30; a <= 30; a += 5) mk('path', { d: `M${pol(a, a ? 58 : 50)}L${pol(a, 68)}`, class: a ? 'mb-tick' : 'mb-tick0' }, svg);
    const needle = mk('line', { x1: P.x, y1: P.y, x2: P.x, y2: P.y - 66, class: 'mb-needle' }, svg);
    // 横梁（绕支点转）
    const beam = mk('g', { class: 'mb-beam' }, svg);
    mk('rect', { x: P.x - ARM - 12, y: P.y - 7, width: 2 * ARM + 24, height: 14, rx: 6, class: 'mb-arm' }, beam);
    // 托盘（保持水平，只平移）
    const pans = [-1, 1].map((s) => {
      const g = mk('g', { class: 'mb-pan' }, svg);
      const cx = P.x + s * ARM;
      mk('rect', { x: cx - 7, y: P.y - POST, width: 14, height: POST, class: 'mb-post' }, g);
      mk('rect', { x: cx - PAN_W / 2, y: P.y - POST - 9, width: PAN_W, height: 10, rx: 4, class: 'mb-plate' }, g);
      const items = mk('g', {}, g);
      return { g, cx, items };
    });
    mk('circle', { cx: P.x, cy: P.y, r: 9, class: 'mb-pivot' }, svg);
    [needle, beam, ...pans.map((p) => p.g)].forEach((e) => { e.style.transformBox = 'view-box'; e.style.transformOrigin = `${P.x}px ${P.y}px`; });

    function fill(pan, list) {
      pan.items.innerHTML = '';
      const ws = list.map(itemWidth);
      const gap = 4;
      const total = ws.reduce((s, w) => s + w, 0) + gap * Math.max(0, list.length - 1);
      const k = Math.min(1, (PAN_W - 8) / Math.max(total, 1));
      const base = P.y - POST - 9;
      const g = mk('g', { transform: `translate(${pan.cx} ${base}) scale(${k}) translate(${-pan.cx} ${-base})` }, pan.items);
      let x = pan.cx - total / 2;
      list.forEach((it, i) => { drawItem(g, it, x + ws[i] / 2, base); x += ws[i] + gap; });
    }

    return {
      set(left, right) {
        fill(pans[0], left);
        fill(pans[1], right);
        const d = sum(right) - sum(left);
        const state = Math.abs(d) < 1e-9 ? 'eq' : d > 0 ? 'R' : 'L';
        const deg = state === 'eq' ? 0 : state === 'R' ? TILT : -TILT;
        const r = (deg * Math.PI) / 180;
        beam.style.transform = `rotate(${deg}deg)`;
        needle.style.transform = `rotate(${deg}deg)`;
        pans.forEach((p, i) => {
          const s = i ? 1 : -1;
          p.g.style.transform = `translate(${s * ARM * (Math.cos(r) - 1)}px, ${s * ARM * Math.sin(r)}px)`;
        });
        svg.dataset.state = state;
        return state;
      },
    };
  }

  return { create, sum };
})();
window.MBalance = MBalance;
