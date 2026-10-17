'use strict';
/* 六上 百分数的意义和读写 · 本课互动：例 1 投篮圆点图、三张百格图按 64/65/60 格涂色对比、可涂色的百格图、练一练百格图。
 * 所有格数、圆点数都按课本数据由代码算出。通用部分见 ../shared/math.js、mcheck.js、fracfig.js */
const { tex } = MathKit;
const { el } = FracFig;
const $ = (id) => document.getElementById(id);
const FILL = '#8fd3f4';
const HIT = '#e8743b';

/* 百格图：10×10，按“先竖列、从上到下”的顺序涂前 n 格（课本插图就是这样涂的） */
const colOrder = (i) => (i % 10) * 10 + Math.floor(i / 10);
function hundred(svg, n, o = {}) {
  return FracFig.grid(svg, { x: 5, y: 5, w: o.w || 200, h: o.w || 200, rows: 10, cols: 10, sw: 1.2, on: (i) => colOrder(i) < n, fill: o.fill || FILL });
}

/* 第 3 页：每场比赛的投篮记录，每个圆代表一次投篮 */
const GAMES = [{ name: '第一场', shots: 25, hit: 16 }, { name: '第二场', shots: 20, hit: 13 }, { name: '第三场', shots: 30, hit: 18 }];
function initShots() {
  const svg = $('shots');
  GAMES.forEach((g, k) => {
    const y = 40 + k * 62;
    el('text', { x: 10, y: y + 7, class: 'ff-t', style: 'text-anchor:start' }, svg).textContent = g.name;
    for (let i = 0; i < g.shots; i += 1) {
      const isHit = i < g.hit;
      el('circle', { cx: 120 + i * 29, cy: y, r: 11, fill: isHit ? HIT : '#fff', stroke: HIT, 'stroke-width': 2.5 }, svg);
    }
    el('text', { x: 120 + g.shots * 29 + 4, y: y + 7, class: 'ff-t s', style: 'text-anchor:start' }, svg).textContent = `${g.hit}/${g.shots}`;
  });
}

/* 第 4 页：三张百格图同时涂到 64、65、60 格 */
const HG = [['hgA', 64], ['hgB', 65], ['hgC', 60]];
function initHg() {
  const parts = HG.map(([id]) => hundred($(id), 0));
  let raf = 0;
  const show = (t) => HG.forEach(([id, n], k) => {
    const m = Math.min(n, Math.floor(t));
    parts[k].forEach((p, i) => p.setAttribute('fill', colOrder(i) < m ? FILL : '#fff'));
    $(`${id}n`).textContent = m;
  });
  $('hgGo').addEventListener('click', () => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const tick = (now) => {
      const t = (now - t0) / 40; // 每 40 毫秒涂一格
      show(t);
      if (t < 65) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });
}

/* 第 6 页：可涂色的百格图（点击或拖动） */
function initPaint() {
  const svg = $('paint');
  const on = new Array(100).fill(false);
  const parts = FracFig.grid(svg, { x: 5, y: 5, w: 400, h: 400, rows: 10, cols: 10, sw: 1.5 });
  const goals = [...document.querySelectorAll('.goals [data-goal]')];
  const render = () => {
    const n = on.filter(Boolean).length;
    parts.forEach((p, i) => p.setAttribute('fill', on[i] ? FILL : '#fff'));
    $('pRead').innerHTML = `涂了 <b>${n}</b> 格　$\\dfrac{${n}}{100}=${n}\\%$　空白 ${100 - n}%`;
    tex($('pRead'));
  };
  // 松手后才判挑战，拖动途中经过的格数不算
  const checkGoals = () => {
    const n = on.filter(Boolean).length;
    goals.forEach((g) => { if (+g.dataset.goal === n) g.classList.add('done'); });
  };
  const cellAt = (e) => {
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const c = Math.floor((pt.x - 5) / 40);
    const r = Math.floor((pt.y - 5) / 40);
    return c >= 0 && c < 10 && r >= 0 && r < 10 ? r * 10 + c : -1;
  };
  let mode = null;
  svg.addEventListener('pointerdown', (e) => {
    const i = cellAt(e);
    if (i < 0) return;
    mode = !on[i];
    on[i] = mode;
    svg.setPointerCapture(e.pointerId);
    render();
  });
  svg.addEventListener('pointermove', (e) => {
    if (mode === null) return;
    const i = cellAt(e);
    if (i >= 0 && on[i] !== mode) { on[i] = mode; render(); }
  });
  const stop = () => { if (mode !== null) checkGoals(); mode = null; };
  svg.addEventListener('pointerup', stop);
  svg.addEventListener('pointercancel', stop);
  $('pClear').addEventListener('click', () => { on.fill(false); render(); });
  $('pFlip').addEventListener('click', () => { on.forEach((v, i) => { on[i] = !v; }); render(); checkGoals(); });
  render();
}

/* 第 9 页：课本 p85 练一练第 1 题的三幅百格图（7 格；3 整列；9 整列又 5 格） */
function initEx() {
  [['ex1', 7], ['ex2', 30], ['ex3', 95]].forEach(([id, n]) => hundred($(id), n));
}

window.LESSON = {
  init() {
    initShots();
    initHg();
    initPaint();
    initEx();
    FracFig.exact();
  },
};
