'use strict';
/* 七上 课题学习 制作无盖的长方体纸盒 · 本课互动：十字展开图折叠、剪角折盒器（b 联动纸板与纸盒）、
 * 此消彼长三根长条、容积散点与曲线、最大值附近加密。所有图形与数值都由 V = b(a − 2b)² 精确计算。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const A = 20; // 纸板边长 cm
const vol = (b, a = A) => b * (a - 2 * b) ** 2;
const boards = [];
const reg = (b) => { boards.push(b); return b; };

const BASE = '#a9d3f0';
const SIDE = '#f6c99a';

/** 无盖纸盒：底面在中间，四个侧面向上折起。返回 Poly3D 视图与 set(b, t) */
function boxView(el, o) {
  const st = { b: o.b, t: o.t };
  const polys = () => {
    const cols = [st.b, A - 2 * st.b, st.b];
    return MCube.gridPolys([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]], (i) => cols[i], (i) => cols[i]);
  };
  // MCube.fold 把展开图立起来、root 当前面；这里再换回“底面朝下、侧面向上折”：(X, Y, Z) → (X, Z, Y)
  const flip = (p) => [p[0], p[2], p[1]];
  const v = Poly3D.view(el, {
    w: o.w || 520, h: o.h || 400, yaw: -28, pitch: 34,
    scale: () => (o.scale || 15) + ((o.scaleFolded || o.scale || 15) - (o.scale || 15)) * st.t,
    center: () => [A / 2, -A / 2, (st.t * st.b) / 2],
  });
  v.add(() => {
    const P = polys();
    return MCube.fold(P, st.t, 2).map((f, i) => ({
      type: 'face', pts: f.pts.map(flip), out: flip(f.out), color: i === 2 ? BASE : SIDE,
    }));
  });
  let stop = null;
  const api = {
    v, st, svg: v.svg,
    set(b, t) { st.b = b ?? st.b; st.t = t ?? st.t; v.update(); },
    play(input) {
      if (stop) stop();
      const to = st.t > 0.5 ? 0 : 1;
      stop = MCube.tween(st.t, to, 1400, (t) => { st.t = t; if (input) input.value = t; v.update(); });
    },
    update: () => v.update(),
  };
  v.update();
  return api;
}

/* 第 3 页：展开图 */
function initNet() {
  const bv = reg(boxView($('netView'), { b: 4, t: 1, scale: 14, scaleFolded: 20 }));
  $('netT').addEventListener('input', (e) => bv.set(null, +e.target.value));
  $('netPlay').addEventListener('click', () => bv.play($('netT')));
}

/* 第 4 页：剪角折盒器 */
function initCutter() {
  const s = { b: 4 };
  const bv = reg(boxView($('boxView'), { b: s.b, t: 0.75, w: 520, h: 360, scale: 13, scaleFolded: 19 }));
  const g = reg(board($('sheet'), { x: [-1.5, 21.5], y: [-1.5, 21.5], axes: false, ticks: 1, w: 460 }));
  g.poly([[0, 0], [A, 0], [A, A], [0, A]], { cls: 'paper' });
  const corners = () => [[0, 0], [A - s.b, 0], [A - s.b, A - s.b], [0, A - s.b]];
  [0, 1, 2, 3].forEach((i) => g.poly(() => { const [x, y] = corners()[i]; return [[x, y], [x + s.b, y], [x + s.b, y + s.b], [x, y + s.b]]; }, { cls: 'cutsq' }));
  // 折痕（底面的四条边）
  g.poly(() => [[s.b, s.b], [A - s.b, s.b], [A - s.b, A - s.b], [s.b, A - s.b]], { cls: 'crease' });
  g.text(() => [A / 2, A / 2], () => `底面 ${fmt(A - 2 * s.b)}×${fmt(A - 2 * s.b)}`, { cls: 'lb up c', dy: 8 });
  g.text(() => [s.b / 2, s.b / 2], 'b', { cls: 'lb c', dy: 8 });
  g.text([A / 2, A], 'a = 20', { cls: 'lb up c', dy: -10 });
  g.drag(() => [s.b, s.b], (x, y) => {
    const v = Math.round(((x + y) / 2) * 2) / 2;
    s.b = Math.min(9.5, Math.max(0.5, v));
    $('cutB').value = s.b;
    sync();
  });
  const sync = () => {
    $('cutBV').textContent = fmt(s.b);
    $('rdSide').textContent = `${fmt(A - 2 * s.b)} cm`;
    $('rdH').textContent = `${fmt(s.b)} cm`;
    $('rdV').textContent = `${fmt(vol(s.b))} cm³`;
    bv.set(s.b, null);
    g.update();
  };
  slider($('cutB'), (v) => { s.b = v; sync(); });
  $('boxT').addEventListener('input', (e) => bv.set(null, +e.target.value));
  $('boxPlay').addEventListener('click', () => bv.play($('boxT')));
}

/* 第 5 页：课本插图（按比例：a = 20，b = 4） */
function drawSqFig() {
  const u = 11; const o = 40; const a = 20; const b = 4;
  const X = (x) => o + x * u;
  const Y = (y) => o + (a - y) * u;
  let s = `<rect x="${X(0)}" y="${Y(a)}" width="${a * u}" height="${a * u}" fill="#e3f1fb" stroke="#1f2d3a" stroke-width="2"/>`;
  [[0, 0], [a - b, 0], [a - b, a - b], [0, a - b]].forEach(([x, y]) => {
    s += `<rect x="${X(x)}" y="${Y(y + b)}" width="${b * u}" height="${b * u}" fill="#fff" stroke="#d9711c" stroke-width="2" stroke-dasharray="6 4"/>`;
  });
  s += `<line x1="${X(0)}" y1="${Y(a) - 18}" x2="${X(a)}" y2="${Y(a) - 18}" stroke="#1f2d3a" stroke-width="1.5" marker-start="url(#ar)" marker-end="url(#ar)"/>`;
  s += `<text x="${X(a / 2)}" y="${Y(a) - 24}" class="fl" text-anchor="middle">a</text>`;
  s += `<line x1="${X(a - b)}" y1="${Y(0) + 18}" x2="${X(a)}" y2="${Y(0) + 18}" stroke="#1f2d3a" stroke-width="1.5" marker-start="url(#ar)" marker-end="url(#ar)"/>`;
  s += `<text x="${X(a - b / 2)}" y="${Y(0) + 38}" class="fl" text-anchor="middle">b</text>`;
  s += `<text x="${X(a / 2)}" y="${Y(a / 2) + 6}" class="fl s" text-anchor="middle">a − 2b</text>`;
  $('sqFig').innerHTML = `<defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9z" fill="#1f2d3a"/></marker></defs>${s}`;
}

/* 第 6 页：此消彼长 */
function initSeesaw() {
  slider($('ssB'), (b) => {
    const S = (A - 2 * b) ** 2;
    const V = vol(b);
    $('ssBV').textContent = fmt(b);
    $('ssH').style.width = `${(b / 10) * 100}%`; $('ssHV').textContent = fmt(b);
    $('ssS').style.width = `${(S / 400) * 100}%`; $('ssSV').textContent = fmt(S);
    $('ssV').style.width = `${(V / 600) * 100}%`; $('ssVV').textContent = fmt(V);
  });
}

/* 第 8 页：容积随 b 变化 */
function initChart() {
  const s = { dots: false, curve: false };
  const b = reg(board($('vChart'), { x: [-0.9, 11.4], y: [-70, 690], w: 560, h: 380, ticks: [1, 100], labels: ['b / cm', 'V / cm³'] }));
  const curve = b.fn((x) => (x > 0 && x < 10 ? vol(x) : NaN), { cls: 'c1', from: 0, to: 10 });
  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((k) => {
    b.pt([k, vol(k)], { cls: k === 3 ? 'c2' : '', r: 6, show: () => s.dots });
    b.text(() => (s.dots ? [k, vol(k)] : null), String(vol(k)), { cls: 'tk', dx: -14, dy: k === 3 ? -14 : -10 });
  });
  b.onUpdate = () => { curve.style.display = s.curve ? '' : 'none'; };
  $('vDots').addEventListener('click', () => { s.dots = true; b.update(); });
  $('vCurve').addEventListener('click', () => { s.dots = true; s.curve = true; b.update(); });
  b.update();
}

/* 第 9 页：加密 */
function initZoom() {
  const s = { b: 3 };
  const z = reg(board($('zoom'), { x: [2.5, 4.2], y: [563, 597], w: 560, h: 380, ticks: [0.25, 5], labels: ['b', 'V'] }));
  [...z.svg.querySelectorAll('text.tk')].filter((t) => t.textContent === 'O').forEach((t) => t.remove()); // 坐标轴不过原点，去掉“O”
  z.fn((x) => vol(x), { cls: 'c1' });
  z.seg(() => [[s.b, 563], [s.b, vol(s.b)]], { cls: 'dash' });
  z.pt([10 / 3, vol(10 / 3)], { cls: 'c2', r: 6 });
  z.drag(() => [s.b, vol(s.b)], (x) => { s.b = Math.min(4.1, Math.max(2.6, Math.round(x * 100) / 100)); $('zB').value = s.b; show(); });
  const show = () => { $('zBV').textContent = s.b.toFixed(2); $('zVV').textContent = vol(s.b).toFixed(2); z.update(); };
  slider($('zB'), (v) => { s.b = v; show(); });
  const fill = (list) => {
    const head = $('zTab').rows[0].outerHTML;
    const best = Math.max(...list.map((x) => vol(x)));
    $('zTab').innerHTML = head + list.map((x) => `<tr class="${vol(x) === best ? 'on' : ''}"><td>${fmt(x)}</td><td>${fmt(A - 2 * x)}</td><td>${vol(x).toFixed(2)}</td></tr>`).join('');
    tex($('zTab'));
  };
  const range = (a, n, st) => Array.from({ length: n }, (_, i) => Math.round((a + i * st) * 100) / 100);
  $('zStep1').addEventListener('click', () => fill(range(2.9, 7, 0.1)));
  $('zStep2').addEventListener('click', () => fill(range(3.3, 7, 0.01)));
}

window.LESSON = {
  init() {
    initNet();
    initCutter();
    drawSqFig();
    initSeesaw();
    initChart();
    initZoom();
  },
  onRender(slide) {
    boards.forEach((b) => { const host = b.svg; if (host && slide.contains(host)) b.update(); });
  },
};
