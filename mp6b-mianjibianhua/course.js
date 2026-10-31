'use strict';
/* 六下 综合与实践《面积的变化》· 本课互动：方格纸上按真实厘米数画出放大前后的图形（坐标单位就是 cm），
 * “铺一铺”把放大后的多边形精确分成 n×n 块与原图形完全相同的小块；面积都由坐标计算。
 * 依赖 ../shared/poly3d.js（第 9 页体积）。 */
const $ = (id) => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (parent) parent.appendChild(e);
  return e;
};
const PI = 3.14;
const fmt = (v) => String(+v.toFixed(4));
const btnGroup = (box, onPick) => box.addEventListener('click', (e) => {
  const b = e.target.closest('[data-k]');
  if (!b) return;
  box.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', x === b));
  onPick(b.dataset.k);
});

/* 图形（单位 cm，左下角为原点，y 向上）。课本 p48 图上量得：正方形边长 1，三角形底 2 高 1，圆半径 0.5，长方形 3×1 */
const SHAPES = {
  sq: { name: '正方形', pts: [[0, 0], [1, 0], [1, 1], [0, 1]], kind: 'par', dims: [['边长', 1]] },
  rect: { name: '长方形', pts: [[0, 0], [3, 0], [3, 1], [0, 1]], kind: 'par', dims: [['长', 3], ['宽', 1]] },
  tri: { name: '三角形', pts: [[0, 0], [2, 0], [0.5, 1]], kind: 'tri', dims: [['底', 2], ['高', 1]] },
  cir: { name: '圆', r: 0.5, kind: 'cir', dims: [['半径', 0.5]] },
};
const parallelogram = (a, h, s) => ({ name: '平行四边形', pts: [[0, 0], [a, 0], [a + s, h], [s, h]], kind: 'par', dims: [['底', a], ['高', h]] });
const polyArea = (P) => Math.abs(P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const areaOf = (sh, n = 1) => (sh.kind === 'cir' ? PI * (sh.r * n) ** 2 : polyArea(sh.pts) * n * n);
const box = (sh) => (sh.kind === 'cir' ? [2 * sh.r, 2 * sh.r] : [Math.max(...sh.pts.map((p) => p[0])), Math.max(...sh.pts.map((p) => p[1]))]);

/** 把放大 n 倍的多边形精确分成 n×n 块与原图形全等的小块 */
function tiles(sh, n, at) {
  const P = sh.pts;
  const add = (...v) => v.reduce((s, q) => [s[0] + q[0], s[1] + q[1]], [0, 0]);
  const mul = (p, k) => [p[0] * k, p[1] * k];
  const u = [P[1][0] - P[0][0], P[1][1] - P[0][1]];
  const v = [P[sh.kind === 'tri' ? 2 : 3][0] - P[0][0], P[sh.kind === 'tri' ? 2 : 3][1] - P[0][1]];
  const o = add(at, P[0]);
  const Q = (i, j) => add(o, mul(u, i), mul(v, j));
  const out = [];
  for (let j = 0; j < n; j += 1) for (let i = 0; i < n; i += 1) {
    if (sh.kind === 'par') out.push([Q(i, j), Q(i + 1, j), Q(i + 1, j + 1), Q(i, j + 1)]);
    else if (i + j <= n - 1) {
      out.push([Q(i, j), Q(i + 1, j), Q(i, j + 1)]);
      if (i + j <= n - 2) out.push([Q(i + 1, j), Q(i + 1, j + 1), Q(i, j + 1)]);
    }
  }
  return out;
}

/** 方格纸场景：左边原图形，右边按 n:1 放大的图形，底边对齐。返回 { tileAll(ms), clear() } */
function scene(host, sh, n, o = {}) {
  host.innerHTML = '';
  const [w0, h0] = box(sh);
  const x0 = 1;
  const x1 = x0 + Math.ceil(w0) + 1;
  const W = Math.ceil(x1 + n * w0 + 1);
  const H = Math.ceil(n * h0 + 1.2);
  const fs = Math.max(0.42, (W + 1) / 30);
  const svg = svgEl('svg', { viewBox: `-0.2 ${-0.7 - fs} ${W + 0.4} ${H + 0.2 + fs}`, preserveAspectRatio: 'xMidYMid meet', style: `font-size:${fs}px` }, host);
  const Y = (y) => H - 0.6 - y; // 底边在 y = H-0.6，正好在格线上
  for (let x = 0; x <= W; x += 1) svgEl('line', { x1: x, x2: x, y1: -0.6, y2: H - 0.6, class: 'gl' }, svg);
  for (let y = -0.6; y <= H - 0.6 + 1e-9; y += 1) svgEl('line', { x1: 0, x2: W, y1: y, y2: y, class: 'gl' }, svg);
  const ptsAttr = (P, at, k = 1) => P.map(([x, y]) => `${at + x * k},${Y(y * k)}`).join(' ');
  const draw = (at, k, cls) => (sh.kind === 'cir'
    ? [svgEl('circle', { cx: at + sh.r * k, cy: Y(sh.r * k), r: sh.r * k, class: cls }, svg), svgEl('circle', { cx: at + sh.r * k, cy: Y(sh.r * k), r: 0.07, class: 'ctr' }, svg)][0]
    : svgEl('polygon', { points: ptsAttr(sh.pts, at, k), class: cls }, svg));
  draw(x0, 1, 'sh0');
  const big = draw(x1, n, 'sh1');
  const tg = svgEl('g', {}, svg);
  svgEl('text', { x: x0 + w0 / 2, y: -0.6 - fs * 0.25, class: 'lb' }, svg).textContent = '放大前';
  svgEl('text', { x: x1 + (n * w0) / 2, y: -0.6 - fs * 0.25, class: 'lb' }, svg).textContent = `按 ${n}∶1 放大后`;
  if (sh.kind === 'tri') {
    const apex = sh.pts[2];
    [[x0, 1], [x1, n]].forEach(([at, k]) => svgEl('line', { x1: at + apex[0] * k, x2: at + apex[0] * k, y1: Y(apex[1] * k), y2: Y(0), class: 'hgt' }, svg));
  }
  let timers = [];
  const clear = () => { timers.forEach(clearTimeout); timers = []; tg.innerHTML = ''; big.classList.remove('dim'); };
  const tileAll = (ms = 350, onEach) => {
    clear();
    if (sh.kind === 'cir') return 0;
    big.classList.add('dim');
    const T = tiles(sh, n, [x1, 0]);
    T.forEach((P, idx) => timers.push(setTimeout(() => {
      svgEl('polygon', { points: P.map(([x, y]) => `${x},${Y(y)}`).join(' '), class: `tile ${idx % 2 ? 't2' : ''}` }, tg);
      const cx = P.reduce((s, p) => s + p[0], 0) / P.length;
      const cy = P.reduce((s, p) => s + p[1], 0) / P.length;
      svgEl('text', { x: cx, y: Y(cy), class: 'tn', dy: '.35em' }, tg).textContent = idx + 1;
      if (onEach) onEach(idx + 1, T.length);
    }, ms * idx)));
    return T.length;
  };
  return { tileAll, clear };
}

/* 第 3 页：课本长方形 3×1 → 9×3 */
function initRect() {
  const sc = scene($('rectBoard'), SHAPES.rect, 3);
  $('tileGo').addEventListener('click', () => sc.tileAll(380));
  $('tileClr').addEventListener('click', () => sc.clear());
}

/* 第 4 页：核心——方格纸放大器 */
function initZoom() {
  const st = { k: 'sq', n: 3 };
  let sc = null;
  const render = () => {
    const sh = SHAPES[st.k];
    sc = scene($('zoomBoard'), sh, st.n);
    const a0 = areaOf(sh);
    const a1 = areaOf(sh, st.n);
    const rows = sh.dims.map(([nm, v]) => `<tr><th>${nm}/cm</th><td>${fmt(v)}</td><td>${fmt(v * st.n)}</td><td>${st.n}∶1</td></tr>`).join('');
    $('zTab').innerHTML = `<tr><th></th><th>放大前</th><th>放大后</th><th>后∶前</th></tr>${rows}<tr class="ar"><th>面积/cm²</th><td>${fmt(a0)}</td><td>${fmt(a1)}</td><td>${fmt(a1 / a0)}∶1</td></tr>`;
    $('zMsg').className = 'tip feedback';
    $('zMsg').innerHTML = sh.kind === 'cir'
      ? `圆铺不满，用公式算：$${PI}\\times${fmt(sh.r * st.n)}^2=${fmt(a1)}$，$${fmt(a1)}\\div${fmt(a0)}=${fmt(a1 / a0)}$。`
      : `长度放大到 ${st.n} 倍。点“铺一铺”，看放大后的${sh.name}里能放几个原来的${sh.name}。`;
    MathKit.tex($('zMsg'));
  };
  btnGroup($('shpBtns'), (k) => { st.k = k; render(); });
  btnGroup($('ratBtns'), (k) => { st.n = +k; render(); });
  $('zTile').addEventListener('click', () => {
    const sh = SHAPES[st.k];
    if (sh.kind === 'cir') { $('zMsg').classList.add('fb-warn'); return; }
    sc.tileAll(Math.max(90, 1400 / (st.n * st.n)), (i, total) => {
      if (i < total) return;
      $('zMsg').className = 'tip feedback fb-ok';
      $('zMsg').innerHTML = `正好铺 <b>${total}</b> 个：${st.n} × ${st.n} = ${total}，面积比是 <b>${total}∶1</b>。`;
    });
  });
  render();
}

/* 第 7 页：任意平行四边形验证 */
function initPar() {
  const st = { a: 3, h: 2, s: 1, n: 2 };
  const LIM = { a: [1, 4], h: [1, 3], s: [0, 3], n: [2, 3] };
  const render = () => {
    const sh = parallelogram(st.a, st.h, st.s);
    const sc = scene($('parBoard'), sh, st.n);
    sc.tileAll(0);
    ['a', 'h', 's', 'n'].forEach((k) => { $(`p${k.toUpperCase()}`).textContent = st[k]; });
    const a0 = areaOf(sh);
    const a1 = areaOf(sh, st.n);
    $('parMsg').innerHTML = `放大前 $${st.a}\\times${st.h}=${fmt(a0)}$ cm²，放大后 $${st.a * st.n}\\times${st.h * st.n}=${fmt(a1)}$ cm²，面积比 $${fmt(a1)}:${fmt(a0)}=${fmt(a1 / a0)}:1$。`;
    MathKit.tex($('parMsg'));
  };
  $('parSteps').addEventListener('click', (e) => {
    const d = e.target.closest('[data-d]')?.dataset.d;
    if (!d) return;
    const k = d[0];
    st[k] = Math.min(LIM[k][1], Math.max(LIM[k][0], st[k] + (d[1] === '+' ? 1 : -1)));
    render();
  });
  render();
}

/* 第 9 页：正方体按 n:1 放大，里面装 n×n×n 个原正方体 */
function initVol() {
  const st = { n: 2 };
  const v = Poly3D.view($('volView'), { w: 560, h: 380, scale: () => 210 / (st.n + 2), yaw: -30, pitch: 24, center: () => [(st.n - 2) / 2, st.n / 2, st.n / 2] });
  v.add(() => {
    const objs = [Poly3D.box([-2, 0, 0], [-1, 1, 1], { color: '#f7c948' })];
    for (let k = 0; k < st.n; k += 1) for (let j = 0; j < st.n; j += 1) for (let i = 0; i < st.n; i += 1) {
      objs.push(Poly3D.box([i, j, k], [i + 1, j + 1, k + 1], { color: '#9fd3f2' }));
    }
    return objs;
  });
  v.update();
  btnGroup($('volBtns'), (k) => { st.n = +k; v.update(); });
}

window.LESSON = {
  init() {
    initRect();
    initZoom();
    initPar();
    initVol();
  },
};
