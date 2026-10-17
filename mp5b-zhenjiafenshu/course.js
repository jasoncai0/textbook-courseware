'use strict';
/* 五下 真分数和假分数 · 本课互动：例 5、例 6 点涂色、分数单位累加器（圆 + 数轴同步，核心）、带分数数轴、例 8 方格图、练习图。
 * 份数、位置都由代码按数值精确画出。通用部分见 ../shared/fracfig.js、numline.js */
const { el, pie, bar, grid, texFrac, FILL, LINE } = FracFig;
const $ = (id) => document.getElementById(id);
const text = (svg, x, y, s, cls = 'ff-t') => { const t = el('text', { x, y, class: cls }, svg); t.textContent = s; return t; };
const boards = [];

/* 可点击涂色的一组圆：groups = [{ pies: [{cx,cy}], n, r, want, label }]，每组单独判断 */
function clickPies(svg, groups, msg, okText) {
  const state = groups.map(() => new Set());
  const draw = () => {
    svg.innerHTML = '';
    groups.forEach((g, gi) => {
      g.pies.forEach((p, pi) => {
        const parts = pie(svg, { cx: p.cx, cy: p.cy, r: g.r, n: g.n, on: (i) => state[gi].has(pi * g.n + i) });
        parts.forEach((node, i) => { node.dataset.g = gi; node.dataset.k = pi * g.n + i; });
      });
      if (g.label) g.label(svg, state[gi].size === g.want);
    });
    const done = groups.map((g, gi) => state[gi].size === g.want);
    msg.classList.toggle('fb-ok', done.every(Boolean));
    if (okText && done.every(Boolean)) { msg.innerHTML = okText; MathKit.tex(msg); }
  };
  svg.addEventListener('click', (e) => {
    const t = e.target.closest('[data-g]');
    if (!t) return;
    const s = state[+t.dataset.g];
    const k = +t.dataset.k;
    if (s.has(k)) s.delete(k); else s.add(k);
    draw();
  });
  draw();
}
/* SVG 竖排分数 */
function svgFrac(svg, x, y, a, b, color) {
  const g = el('g', { fill: color || '#1f2d3a' }, svg);
  const t1 = el('text', { x, y, class: 'ff-t frac-n' }, g); t1.textContent = a;
  el('line', { x1: x - 16, x2: x + 16, y1: y + 8, y2: y + 8, stroke: color || '#1f2d3a', 'stroke-width': 2 }, g);
  const t2 = el('text', { x, y: y + 32, class: 'ff-t frac-n' }, g); t2.textContent = b;
  return g;
}
const tag = (ok) => (ok ? '✓' : '');

function initE5() {
  const R = 62;
  const fr = [[1, 4], [3, 4], [4, 4]];
  clickPies($('e5a'), fr.map(([a, b], i) => ({
    pies: [{ cx: 80 + i * 200, cy: 80 }], n: b, r: R, want: a,
    label: (svg, ok) => { svgFrac(svg, 175 + i * 200, 62, a, b); text(svg, 175 + i * 200, 135, tag(ok), 'ff-t ok'); },
  })), $('e5aMsg'), '✓ 都涂对了！$\\dfrac44$ 正好涂满一个圆。');
  clickPies($('e5b'), [{ pies: [{ cx: 100, cy: 80 }, { cx: 250, cy: 80 }], n: 4, r: R, want: 5,
    label: (svg, ok) => text(svg, 360, 92, ok ? '✓ 5 个' : '', 'ff-t ok') }], $('e5bMsg'), ''); // 这一行里有填空，涂对后只变绿、不改文字
}

function initE6() {
  const R = 58;
  const set = [[2, 1], [10, 2], [13, 3]];
  let x = 70;
  const groups = set.map(([a, cnt]) => {
    const pies = Array.from({ length: cnt }, (_, i) => ({ cx: x + i * 128, cy: 75 }));
    const mid = x + ((cnt - 1) * 128) / 2;
    x += cnt * 128 + 50;
    return { pies, n: 5, r: R, want: a, label: (svg, ok) => { svgFrac(svg, mid, 165, a, 5); text(svg, mid + 40, 185, tag(ok), 'ff-t ok'); } };
  });
  clickPies($('e6'), groups, $('e6Msg'), '✓ 都涂对了！$\\dfrac{10}5$ 正好涂满 2 个圆，$\\dfrac{13}5$ 涂满 2 个圆还多 3 份。');
}

/* ---------- 核心：分数单位累加器 ---------- */
const AC = { n: 4, k: 0 };
const AC_WHOLES = 3;
function initAcc() {
  const svg = $('ac');
  const NL = { x0: 120, x1: 900, y: 300 };
  const X = (v) => NL.x0 + ((NL.x1 - NL.x0) * v) / AC_WHOLES;
  const msg = $('acMsg');
  const render = () => {
    const { n, k } = AC;
    svg.innerHTML = '';
    for (let c = 0; c < AC_WHOLES; c += 1) {
      const used = k > c * n;
      const g = el('g', { opacity: used || c === 0 ? 1 : 0.35 }, svg);
      pie(g, { cx: 210 + c * 290, cy: 110, r: 92, n, on: (i) => c * n + i < k });
      if (k >= (c + 1) * n) text(svg, 210 + c * 290, 225, '涂满：1', 'ff-t s');
    }
    // 数轴
    el('line', { x1: NL.x0 - 30, x2: NL.x1 + 40, y1: NL.y, y2: NL.y, stroke: '#c0392b', 'stroke-width': 3 }, svg);
    el('polygon', { points: `${NL.x1 + 52},${NL.y} ${NL.x1 + 36},${NL.y - 7} ${NL.x1 + 36},${NL.y + 7}`, fill: '#c0392b' }, svg);
    for (let i = 0; i <= AC_WHOLES * n; i += 1) {
      const whole = i % n === 0;
      el('line', { x1: X(i / n), x2: X(i / n), y1: NL.y - (whole ? 11 : 6), y2: NL.y + (whole ? 11 : 6), stroke: '#c0392b', 'stroke-width': whole ? 3 : 1.6 }, svg);
      if (whole) text(svg, X(i / n), NL.y + 38, String(i / n), 'ff-t nl-big');
    }
    if (k > 0) {
      el('circle', { cx: X(k / n), cy: NL.y, r: 9, fill: '#d9711c', stroke: '#fff', 'stroke-width': 2.5 }, svg);
      svgFrac(svg, X(k / n), NL.y - 50, k, n, '#d9711c');
    }
    let kind;
    if (k === 0) kind = `点“＋1 个”，一个一个地加 $\\dfrac1{${n}}$。`;
    else if (k < n) kind = `$\\dfrac{${k}}{${n}}$：分子 ${k} &lt; 分母 ${n}，没有涂满一个圆，<b>小于 1</b>——真分数。`;
    else if (k === n) kind = `$\\dfrac{${k}}{${n}}$：分子 = 分母，正好涂满一个圆，<b>等于 1</b>——假分数。`;
    else {
      const w = Math.floor(k / n);
      const r = k % n;
      const as = r ? `$=${w}\\dfrac{${r}}{${n}}$（带分数）` : `$=${w}$`;
      kind = `$\\dfrac{${k}}{${n}}$：分子 ${k} &gt; 分母 ${n}，<b>大于 1</b>——假分数，${as}。`;
    }
    msg.className = `tip feedback center ${k && k < n ? 'fb-ok' : (k ? 'fb-warn' : '')}`;
    msg.innerHTML = `${k} 个 $\\dfrac1{${n}}$ 是 ${kind}`;
    if (!k) msg.innerHTML = kind;
    MathKit.tex(msg);
  };
  $('acN').addEventListener('click', (e) => {
    const b = e.target.closest('[data-n]');
    if (!b) return;
    AC.n = +b.dataset.n; AC.k = 0;
    $('acN').querySelectorAll('[data-n]').forEach((x) => x.classList.toggle('solid', x === b));
    render();
  });
  $('acPlus').addEventListener('click', () => { AC.k = Math.min(AC_WHOLES * AC.n, AC.k + 1); render(); });
  $('acMinus').addEventListener('click', () => { AC.k = Math.max(0, AC.k - 1); render(); });
  render();
}

/* ---------- 静态图 ---------- */
function initFigs() {
  bar($('rcUnit'), { x: 20, y: 20, w: 200, h: 34, n: 4, on: (i) => i < 3 });

  pie($('e7'), { cx: 110, cy: 55, r: 48, n: 5, on: () => true });
  pie($('e7'), { cx: 250, cy: 55, r: 48, n: 5, on: () => true });
  text($('e7'), 360, 62, '10 个 1/5', 'ff-t s');

  pie($('mix'), { cx: 90, cy: 60, r: 52, n: 3, on: () => true });
  pie($('mix'), { cx: 230, cy: 60, r: 52, n: 3, on: (i) => i === 0 });
  text($('mix'), 160, 66, '+', 'ff-t');
  text($('mix'), 340, 66, '= 4 个 1/3', 'ff-t s');

  const b = NumLine.board($('nlMix'), { from: 0, to: 2, y: [-1.4, 1.6], h: 150 });
  NumLine.axis(b, { from: 0, to: 2, step: 1, minor: 1 / 3, label: (v) => String(v) });
  b.pt([4 / 3, 0], { r: 6, cls: 'c2' });
  b.text([4 / 3, 0], '4/3', { cls: 'nl-val', dy: -16 });
  b.text([4 / 3, 0], '1又1/3', { cls: 'nl-or', dy: 54 });
  boards.push(b);

  // 例 8：3 个正方形，各 2×2，共涂 11 格
  const e8 = $('e8');
  const sq = [];
  for (let s = 0; s < 3; s += 1) sq.push(grid(e8, { x: 30 + s * 165, y: 20, w: 120, h: 120, rows: 2, cols: 2, on: (i) => s * 4 + i < 11, sw: 2.5 }));
  $('e8Go').addEventListener('click', () => {
    sq.forEach((parts, s) => parts.forEach((p, i) => {
      if (s * 4 + i < 11) p.setAttribute('fill', s < 2 ? '#5fb6e6' : '#f6c27a');
    }));
    const m = $('e8Msg');
    m.innerHTML = '4 个 $\\dfrac14$ 是 1：涂满 <b>2</b> 个，还剩 <b>3</b> 个 $\\dfrac14$ → $2\\dfrac34$';
    MathKit.tex(m);
  });

  // 练一练：三角形 3 个各 3 份涂 7 份；六边形 2 个各 6 份涂 11 份
  const tri = $('pTri');
  for (let t = 0; t < 3; t += 1) {
    const ax = 70 + t * 140;
    const top = [ax, 10]; const l = [ax - 60, 110]; const r = [ax + 60, 110];
    const c = [ax, (10 + 110 + 110) / 3];
    [[top, l], [l, r], [r, top]].forEach(([p, q], i) => {
      el('polygon', { points: `${c} ${p} ${q}`, fill: t * 3 + i < 7 ? FILL : '#fff', stroke: LINE, 'stroke-width': 2 }, tri);
    });
  }
  const hex = $('pHex');
  for (let h = 0; h < 2; h += 1) {
    const [cx, cy, R] = [120 + h * 180, 60, 54];
    for (let i = 0; i < 6; i += 1) {
      const p = (k) => `${(cx + R * Math.cos((k * Math.PI) / 3)).toFixed(2)},${(cy + R * Math.sin((k * Math.PI) / 3)).toFixed(2)}`;
      el('polygon', { points: `${cx},${cy} ${p(i)} ${p(i + 1)}`, fill: h * 6 + i < 11 ? FILL : '#fff', stroke: LINE, 'stroke-width': 2 }, hex);
    }
  }
}

window.LESSON = {
  init() {
    initE5();
    initE6();
    initAcc();
    initFigs();
    FracFig.exact();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
