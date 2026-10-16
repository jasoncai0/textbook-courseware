'use strict';
/* 七上 4.1 从问题到方程 · 本课互动：篮球胜场试算、以绳测井（三折 / 四折按比例绘制）、小鱼火柴棒图。
 * 通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 4 页：篮球 ---------- */
function initBasket() {
  const GAMES = 12;
  const TARGET = 20;
  slider($('bkX'), (x) => {
    $('bkXV').textContent = x;
    $('bkGames').innerHTML = Array.from({ length: GAMES }, (_, i) => `<span class="g ${i < x ? 'w' : 'l'}">${i < x ? '胜' : '负'}</span>`).join('');
    const pts = 2 * x + (GAMES - x);
    const m = $('bkMsg');
    m.className = `tip feedback ${pts === TARGET ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = `胜 ${x} 场得 $2\\times${x}=${2 * x}$ 分，负 ${GAMES - x} 场得 ${GAMES - x} 分，共 ${pts} 分${pts === TARGET ? '——正好 20 分！' : (pts < TARGET ? '，不够 20 分' : '，超过 20 分')}`;
    tex(m);
  });
}

/* ---------- 第 5 页：以绳测井 ---------- */
const FOLDS = [{ n: 3, out: 4, cx: 4, name: '三折' }, { n: 4, out: 1, cx: 12.5, name: '四折' }];
const WELL_HALF = 2.2;

function initWell() {
  const s = { x: 27 };
  const bd = board($('wellBoard'), { x: [-0.6, 17.1], y: [-14.4, 6.6], axes: false, grid: false, w: 560 });
  const depth = (f) => s.x / f.n - f.out;
  // 地面
  bd.seg([[-0.6, 0], [17.1, 0]], { cls: 'ground' });
  FOLDS.forEach((f) => {
    const L = f.cx - WELL_HALF;
    const R = f.cx + WELL_HALF;
    bd.poly(() => [[L - 0.8, 0], [L, 0], [L, -depth(f)], [L - 0.8, -depth(f)]], { cls: 'wall' });
    bd.poly(() => [[R, 0], [R + 0.8, 0], [R + 0.8, -depth(f)], [R, -depth(f)]], { cls: 'wall' });
    bd.poly(() => [[L, -depth(f)], [R, -depth(f)], [R, -depth(f) - 0.5], [L, -depth(f) - 0.5]], { cls: 'water' });
    // 绳子：n 股，每股长 x/n，顶端在地面上方 out 尺，底端在井底
    const gap = 0.55;
    const xs = Array.from({ length: f.n }, (_, i) => f.cx + (i - (f.n - 1) / 2) * gap);
    for (let i = 0; i < f.n; i++) bd.seg(() => [[xs[i], f.out], [xs[i], -depth(f)]], { cls: 'rope' });
    // 折返处
    for (let i = 0; i < f.n - 1; i++) bd.seg(() => { const y = i % 2 ? f.out : -depth(f); return [[xs[i], y], [xs[i + 1], y]]; }, { cls: 'rope' });
    // 井外部分的标注
    bd.seg([[f.cx + 1.3, 0], [f.cx + 1.3, f.out]], { cls: 'dimq' });
    bd.text([f.cx + 1.3, f.out / 2], `${f.out}尺`, { cls: 'lb up', dx: 6, dy: 6 });
    bd.text(() => [f.cx, -depth(f) - 0.5], () => `井深 ${fmt(depth(f))} 尺`, { cls: 'lb up c deep', dy: 22 });
    bd.text([f.cx, 5.6], f.name, { cls: 'lb up c' });
  });
  // 用三折算出的井深画一条参考虚线
  bd.seg(() => [[-0.6, -depth(FOLDS[0])], [17.1, -depth(FOLDS[0])]], { cls: 'ref' });
  bd.onUpdate = () => {
    $('wellXV').textContent = s.x;
    const [d3, d4] = FOLDS.map(depth);
    const m = $('wellMsg');
    const eq = Math.abs(d3 - d4) < 1e-9;
    m.className = `tip feedback ${eq ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = eq
      ? `$x=${s.x}$ 时：$\\frac13x-4=${fmt(d3)}$，$\\frac14x-1=${fmt(d4)}$——两种量法量出同一个井深，方程两边相等！`
      : `$x=${s.x}$ 时：三折得井深 $\\frac13x-4=${fmt(d3)}$，四折得井深 $\\frac14x-1=${fmt(d4)}$，<b>不相等</b>．可同一口井的深度只有一个……`;
    tex(m);
  };
  slider($('wellX'), (v) => { s.x = v; bd.update(); });
}

/* ---------- 第 6 页：小鱼（图 4-2） ---------- */
const H = 0.6;
function fishSticks(n) {
  const sticks = [[[-1, H], [0, 0]], [[-1, -H], [0, 0]]];
  for (let k = 0; k < n; k++) {
    const x = 2 * k;
    sticks.push([[x, 0], [x + 1, H]], [[x, 0], [x + 1, -H]], [[x + 1, H], [x + 2, 0]], [[x + 1, -H], [x + 2, 0]], [[x, 2 * H], [x + 1, H]], [[x, -2 * H], [x + 1, -H]]);
  }
  return sticks;
}
function drawFish(svg, n) {
  const U = 40;
  const X = (x) => (x + 1.2) * U;
  const Y = (y) => (1.45 - y) * U;
  svg.setAttribute('viewBox', `0 0 ${(2 * n + 1.6) * U} ${2.9 * U}`);
  svg.innerHTML = fishSticks(n).map(([[x1, y1], [x2, y2]]) => {
    const [hx, hy] = [X(x2) - (X(x2) - X(x1)) * 0.1, Y(y2) - (Y(y2) - Y(y1)) * 0.1];
    return `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${hx}" y2="${hy}" stroke="#c99a5b" stroke-width="5" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="6" fill="#e0679a"/>`;
  }).join('');
}

window.LESSON = {
  init() {
    initBasket();
    initWell();
    drawFish($('fishFig'), 3);
  },
};
