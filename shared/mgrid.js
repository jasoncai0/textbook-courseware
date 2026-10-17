'use strict';
/* 课本插件 · 方格纸 + 剪移拼（五上“多边形的面积”用；不依赖其他模块，加载在 course.js 之前）
 * const g = MGrid.paper(svgEl, { cols: 14, rows: 6, u: 40, pad: 12 });  // 方格纸；坐标单位 = 格，x 向右、y 向下，原点在左上角
 * g.poly([[0,4],[2,0],[9,0],[7,4]], 'cls')  多边形 → <path>；g.seg(P, Q, cls)；g.text(P, '文字', cls)；g.dim(P, Q, '7 cm', off) 尺寸线
 * g.group(cls) 新建一层 <g>；以上方法最后一个参数可传 parent（默认画在 g.root）
 * MGrid.pose(el, g, { dx, dy, deg, c }) 把图块移到：先绕 c 点（格）旋转 deg 度，再平移 (dx, dy) 格。
 *   配合 CSS 的 transition，就是“剪—移—拼”的动画；终点位置由坐标精确算出。MGrid.pose(el, g) 回到原位。
 * MGrid.area(pts) 多边形面积（格²，鞋带公式）；MGrid.rot(P, c, deg) 点绕 c 旋转后的坐标（核对拼合用）。
 */
const MGrid = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (parent) parent.appendChild(e);
    return e;
  };
  const f = (v) => +v.toFixed(2);

  function paper(svg, o) {
    const u = o.u || 40;
    const pad = o.pad ?? 12;
    const W = o.cols * u;
    const H = o.rows * u;
    svg.setAttribute('viewBox', `${-pad} ${-pad} ${W + 2 * pad} ${H + 2 * pad}`);
    svg.classList.add('mgrid');
    const P = ([x, y]) => [f(x * u), f(y * u)];
    if (o.grid !== false) {
      const lines = mk('g', { class: 'mg-grid' }, svg);
      for (let i = 0; i <= o.cols; i += 1) mk('line', { x1: i * u, y1: 0, x2: i * u, y2: H }, lines);
      for (let j = 0; j <= o.rows; j += 1) mk('line', { x1: 0, y1: j * u, x2: W, y2: j * u }, lines);
    }
    const root = mk('g', {}, svg);
    const d = (pts) => `M${pts.map((p) => P(p).join(' ')).join('L')}Z`;
    const g = {
      svg, u, root, P, d,
      group: (cls, parent) => mk('g', { class: cls || '' }, parent || root),
      poly: (pts, cls, parent) => mk('path', { d: pts.length ? d(pts) : 'M0 0', class: cls || '' }, parent || root),
      seg: (p, q, cls, parent) => {
        const [a, b] = [P(p), P(q)];
        return mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: cls || '' }, parent || root);
      },
      text: (p, s, cls, parent) => {
        const [x, y] = P(p);
        const t = mk('text', { x, y, class: cls || 'mg-t' }, parent || root);
        t.textContent = s;
        return t;
      },
      // 尺寸线：P→Q 两端短竖线 + 中间文字；off = 向法线方向偏移的格数
      dim: (p, q, s, off = 0.45, parent) => {
        const gr = mk('g', { class: 'mg-dim' }, parent || root);
        const [dx, dy] = [q[0] - p[0], q[1] - p[1]];
        const L = Math.hypot(dx, dy);
        const n = [dy / L, -dx / L];
        const sh = (r, k) => [r[0] + n[0] * k, r[1] + n[1] * k];
        g.seg(sh(p, off), sh(q, off), '', gr);
        g.seg(sh(p, off - 0.15), sh(p, off + 0.15), '', gr);
        g.seg(sh(q, off - 0.15), sh(q, off + 0.15), '', gr);
        g.text(sh([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], off + Math.sign(off || 1) * 0.42), s, 'mg-dt', gr);
        return gr;
      },
    };
    return g;
  }

  function pose(el, g, o = {}) {
    const { u } = g;
    const [cx, cy] = o.c || [0, 0];
    const dx = o.dx || 0;
    const dy = o.dy || 0;
    const deg = o.deg || 0;
    // 列表结构保持一致（translate rotate translate），过渡时逐项插值：绕 c 转、同时平移
    el.style.transform = `translate(${f((dx + cx) * u)}px, ${f((dy + cy) * u)}px) rotate(${deg}deg) translate(${f(-cx * u)}px, ${f(-cy * u)}px)`;
  }

  const area = (pts) => Math.abs(pts.reduce((s, p, i) => {
    const q = pts[(i + 1) % pts.length];
    return s + p[0] * q[1] - q[0] * p[1];
  }, 0)) / 2;

  const rot = ([x, y], [cx, cy], deg) => {
    const a = (deg * Math.PI) / 180;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
  };

  // 拖动：在 el 上按下后，onMove 收到指针在 svg 里的坐标 [x, y]（viewBox 单位；方格纸上除以 g.u 就是格）
  function drag(svg, el, onMove) {
    const toUser = (e) => {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const q = pt.matrixTransform(svg.getScreenCTM().inverse());
      return [q.x, q.y];
    };
    el.style.touchAction = 'none';
    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      onMove(toUser(e));
      const mv = (ev) => onMove(toUser(ev));
      const up = () => ['pointermove', 'pointerup', 'pointercancel'].forEach((t, i) => el.removeEventListener(t, i ? up : mv));
      el.addEventListener('pointermove', mv);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }

  return { paper, pose, area, rot, drag, mk };
})();
window.MGrid = MGrid;
