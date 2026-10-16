'use strict';
/* 课本插件 · 数学模块。加载顺序：vendor/katex/katex.min.js → auto-render.min.js → math.js → 本课 course.js → deck.js
 * 1. 公式：页面里写 $…$（行内）、$$…$$（行间），加载时自动渲染；脚本生成的内容调用 MathKit.tex(el)。
 * 2. 先想一想：<span class="think" data-ask="依据是什么？" data-step="3">答案</span>
 *    答案先被“？依据是什么？”按钮盖住；按 → 走到第 3 步或点按钮揭示。不写 data-step 则只能点开。
 * 3. 作图板（容器加 .mboard）：const b = MathKit.board(el, { x: [-1, 9], y: [-1, 5] });
 *    b.fn(x => x * x, { cls: 'c1' }); b.pt(() => [s.x, f(s.x)]); b.drag(() => [s.x, 0], (x) => { s.x = x; });
 *    所有图元的参数都可以是值或函数；拖动后自动 b.update() 重新求值。
 */
const MathKit = (() => {
  const DELIMS = [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
  ];
  // 课本印刷体用 ⩾ ⩽，统一成课本样式
  const MACROS = { '\\ge': '\\geqslant', '\\le': '\\leqslant', '\\R': '\\mathbf{R}', '\\N': '\\mathbf{N}', '\\Z': '\\mathbf{Z}' };
  const tex = (el) => {
    if (!window.renderMathInElement) { console.error('KaTeX 未加载：检查 ../shared/vendor/katex/'); return; }
    window.renderMathInElement(el, { delimiters: DELIMS, throwOnError: false, ignoredClasses: ['no-tex'], macros: MACROS });
  };

  /* ---------- 先想一想 ---------- */
  function revealTo(n) {
    // 用 deck.js 的全局 next() 逐步推进，保持手机上的滚动位置；没有 deck 时直接展开
    if (typeof next === 'function' && typeof step === 'number') { while (step < n) next(); return true; }
    return false;
  }
  function initThink(root) {
    root.querySelectorAll('.think:not([data-think-ready])').forEach((el) => {
      el.dataset.thinkReady = '1';
      const a = document.createElement('span');
      a.className = 'think-a';
      while (el.firstChild) a.appendChild(el.firstChild);
      const q = document.createElement('button');
      q.type = 'button';
      q.className = 'think-q';
      q.textContent = el.dataset.ask || '先想一想，再点开';
      el.append(a, q);
      q.addEventListener('click', () => {
        const n = +el.dataset.step;
        if (!(n && revealTo(n))) el.classList.add('open');
      });
    });
  }

  /* ---------- 作图板 ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const val = (v) => (typeof v === 'function' ? v() : v);
  const mk = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
    if (parent) parent.appendChild(e);
    return e;
  };

  function board(el, opt) {
    const host = typeof el === 'string' ? document.querySelector(el) : el;
    const [x0, x1] = opt.x;
    const [y0, y1] = opt.y;
    const W = opt.w || 600;
    const H = opt.h || Math.round(W * (y1 - y0) / (x1 - x0)); // 默认横纵同比例，圆才是圆
    const sx = W / (x1 - x0);
    const sy = H / (y1 - y0);
    const X = (x) => (x - x0) * sx;
    const Y = (y) => (y1 - y) * sy;
    const svg = mk('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' }, host);
    host.classList.add('mboard');
    host.setAttribute('data-noswipe', '');
    // 曲线裁在画板内，超出 y 范围的部分不画到别的内容上
    const clipId = `mclip${++board.count}`;
    mk('rect', { x: 0, y: 0, width: W, height: H }, mk('clipPath', { id: clipId }, mk('defs', {}, svg)));
    const layers = { back: mk('g', {}, svg), main: mk('g', { 'clip-path': `url(#${clipId})` }, svg), top: mk('g', {}, svg) };
    const items = [];
    // 画板按容器缩放后，文字和点的大小仍按屏幕像素算：k = 每个屏幕像素对应的 viewBox 单位
    let k = 1;
    const fit = () => {
      const r = svg.getBoundingClientRect();
      if (!r.width || !r.height) return;
      k = 1 / Math.min(r.width / W, r.height / H); // preserveAspectRatio=meet：取较小的缩放比
      svg.style.fontSize = `${k * parseFloat(getComputedStyle(host).fontSize) * 0.62}px`;
    };

    // ticks：数字（两轴相同）或 [横轴步长, 纵轴步长]；0 表示不画
    const [tx, ty] = Array.isArray(opt.ticks) ? opt.ticks : [opt.ticks ?? 1, opt.ticks ?? 1];
    const each = (a, b, st, cb) => { if (st) for (let v = Math.ceil(a / st) * st; v <= b + 1e-9; v += st) cb(v); };
    if (opt.grid !== false) {
      each(x0, x1, tx, (x) => mk('line', { class: 'grid', x1: X(x), x2: X(x), y1: 0, y2: H }, layers.back));
      each(y0, y1, ty, (y) => mk('line', { class: 'grid', y1: Y(y), y2: Y(y), x1: 0, x2: W }, layers.back));
    }
    if (opt.axes !== false) {
      const ay = Math.min(Math.max(0, y0), y1);
      const ax = Math.min(Math.max(0, x0), x1);
      mk('line', { class: 'ax', x1: 0, x2: W, y1: Y(ay), y2: Y(ay) }, layers.back);
      mk('line', { class: 'ax', x1: X(ax), x2: X(ax), y1: H, y2: 0 }, layers.back);
      mk('path', { d: `M${W} ${Y(ay)} l-12 -6 v12z`, fill: '#6f8191' }, layers.back);
      mk('path', { d: `M${X(ax)} 0 l-6 12 h12z`, fill: '#6f8191' }, layers.back);
      const [lx, ly] = opt.labels || ['x', 'y'];
      mk('text', { class: 'lb', x: W, y: Y(ay), dy: '1.3em', 'text-anchor': 'end' }, layers.back).textContent = lx;
      mk('text', { class: 'lb', x: X(ax), dx: '.6em', y: 0, dy: '1em' }, layers.back).textContent = ly;
      if (opt.tickLabels !== false) {
        const lab = (v) => (Math.abs(v) < 1e-9 ? '' : String(+v.toFixed(2)));
        each(x0, x1 - tx / 2, tx, (x) => { const t = lab(x); if (t) mk('text', { class: 'tk', x: X(x), y: Y(ay), dy: '1.2em', 'text-anchor': 'middle' }, layers.back).textContent = t; });
        each(y0, y1 - ty / 2, ty, (y) => { const t = lab(y); if (t) mk('text', { class: 'tk', x: X(ax), dx: '-.4em', y: Y(y), dy: '.35em', 'text-anchor': 'end' }, layers.back).textContent = t; });
        mk('text', { class: 'tk', x: X(ax), dx: '-.4em', y: Y(ay), dy: '1.2em', 'text-anchor': 'end' }, layers.back).textContent = 'O';
      }
    }

    // 折线采样：遇到无定义 / 跳变就断开（如 1/x 在 0 处）
    const pathOf = (pts) => {
      let d = '';
      let pen = false;
      const big = (y1 - y0) * 4;
      pts.forEach(([x, y], i) => {
        const ok = Number.isFinite(x) && Number.isFinite(y) && Math.abs(y) < big + Math.abs(y0) + Math.abs(y1);
        const jump = i > 0 && pen && Math.abs(y - pts[i - 1][1]) > (y1 - y0);
        if (!ok || jump) { pen = false; if (!ok) return; }
        d += `${pen ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(y).toFixed(1)}`;
        pen = true;
      });
      return d;
    };
    const add = (draw, node) => { items.push(draw); draw(); return node; };
    const cls = (o, d) => (o && o.cls) || d;

    const api = {
      svg, X, Y, W, H,
      /** y = f(x) 的图象；from/to 默认整个横轴范围 */
      fn(f, o = {}) {
        const p = mk('path', { class: cls(o, 'c1') }, layers.main);
        const n = o.n || 400;
        return add(() => {
          const a = val(o.from ?? x0);
          const b = val(o.to ?? x1);
          const pts = Array.from({ length: n + 1 }, (_, i) => { const x = a + (b - a) * i / n; return [x, f(x)]; });
          p.setAttribute('d', pathOf(pts));
        }, p);
      },
      /** 参数曲线 t ↦ [x, y] */
      curve(g, t0, t1, o = {}) {
        const p = mk('path', { class: cls(o, 'c1') }, layers.main);
        const n = o.n || 300;
        return add(() => {
          const pts = Array.from({ length: n + 1 }, (_, i) => g(val(t0) + (val(t1) - val(t0)) * i / n));
          p.setAttribute('d', pathOf(pts));
        }, p);
      },
      /** 线段：() => [[x1, y1], [x2, y2]] */
      seg(s, o = {}) {
        const l = mk('line', { class: cls(o, 'thin') }, layers.main);
        return add(() => {
          const [[a, b], [c, d]] = val(s);
          l.setAttribute('x1', X(a)); l.setAttribute('y1', Y(b)); l.setAttribute('x2', X(c)); l.setAttribute('y2', Y(d));
        }, l);
      },
      /** 多边形 */
      poly(s, o = {}) {
        const p = mk('polygon', { class: cls(o, 'fill1') }, layers.main);
        return add(() => p.setAttribute('points', val(s).map(([a, b]) => `${X(a)},${Y(b)}`).join(' ')), p);
      },
      /** 点；o.hollow 空心，o.show 返回 false 时隐藏 */
      pt(s, o = {}) {
        const c = mk('circle', { class: `pt ${o.hollow ? 'hollow' : ''} ${o.cls || ''}` }, layers.top);
        return add(() => {
          c.setAttribute('r', (o.r || 5) * k);
          const v = val(s);
          const on = v && (o.show === undefined || val(o.show));
          c.style.display = on ? '' : 'none';
          if (on) { c.setAttribute('cx', X(v[0])); c.setAttribute('cy', Y(v[1])); }
        }, c);
      },
      /** 文字标注；o.dx / o.dy 为像素偏移 */
      text(s, txt, o = {}) {
        const t = mk('text', { class: cls(o, 'lb') }, layers.top);
        return add(() => {
          const v = val(s);
          t.style.display = v ? '' : 'none';
          if (!v) return;
          t.setAttribute('x', X(v[0]) + (o.dx || 0) * k); t.setAttribute('y', Y(v[1]) + (o.dy || 0) * k);
          t.textContent = val(txt);
        }, t);
      },
      /** 可拖动点：get() 给出当前位置，set(x, y) 写回状态（自行约束范围） */
      drag(get, set, o = {}) {
        const g = mk('g', {}, layers.top);
        const ring = mk('circle', { class: 'handle-ring' }, g);
        const dot = mk('circle', { class: 'handle' }, g);
        const toWorld = (e) => {
          const p = svg.createSVGPoint();
          p.x = e.clientX; p.y = e.clientY;
          const q = p.matrixTransform(svg.getScreenCTM().inverse());
          return [q.x / sx + x0, y1 - q.y / sy];
        };
        let dragging = false;
        g.addEventListener('pointerdown', (e) => { dragging = true; g.setPointerCapture(e.pointerId); e.preventDefault(); });
        g.addEventListener('pointermove', (e) => { if (!dragging) return; set(...toWorld(e)); api.update(); });
        g.addEventListener('pointerup', () => { dragging = false; });
        g.addEventListener('pointercancel', () => { dragging = false; });
        return add(() => {
          const [a, b] = val(get);
          ring.setAttribute('r', (o.hit || 22) * k); dot.setAttribute('r', (o.r || 9) * k);
          [ring, dot].forEach((c) => { c.setAttribute('cx', X(a)); c.setAttribute('cy', Y(b)); });
        }, g);
      },
      /** 外部状态（滑块等）改变后调用；onUpdate 回调用来刷新 HTML 读数 */
      update() { fit(); items.forEach((d) => d()); if (api.onUpdate) api.onUpdate(); },
    };
    window.addEventListener('resize', () => api.update());
    return api;
  }

  board.count = 0;

  /** 把滑块绑定到状态：MathKit.slider(input, v => { s.a = v; b.update(); }) */
  function slider(input, onInput) {
    const fire = () => onInput(+input.value);
    input.addEventListener('input', fire);
    input.closest('[data-noswipe]') || input.setAttribute('data-noswipe', '');
    fire();
  }

  /** 数字显示：保留 digits 位小数并去掉多余的 0 */
  const fmt = (v, digits = 2) => String(+v.toFixed(digits));

  tex(document.body);
  initThink(document);
  return { tex, initThink, board, slider, fmt };
})();
window.MathKit = MathKit;
