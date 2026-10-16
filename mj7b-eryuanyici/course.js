'use strict';
/* 七下 10.1 二元一次方程 · 本课互动：计分板列表找解（2x + y = 20）、格点板拖点找解（2x + 3y + 10 = 35）。
 * 通用部分见 ../shared/math.js */
const { board, slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);

const WIN_MAX = 10; // 2x + y = 20，y ≥ 0 ⇒ x ≤ 10
const TOTAL = 20;

function initWin() {
  const s = { x: 5, done: new Set([5]) };
  const yOf = (x) => TOTAL - 2 * x;
  const b = board($('winLat'), { x: [-0.8, 11.2], y: [-2, 22], w: 520, h: 420, ticks: [1, 2] });
  for (let x = 0; x <= WIN_MAX; x++) b.pt(() => (s.done.has(x) ? [x, yOf(x)] : null), { cls: 'c2', r: 6 });
  b.pt(() => [s.x, yOf(s.x)], { r: 11, cls: 'ring' });
  const tab = $('winTab');
  const render = () => {
    const xs = Array.from({ length: WIN_MAX + 1 }, (_, i) => i);
    const cell = (x, v) => `<td class="${s.done.has(x) ? 'hit' : ''} ${x === s.x ? 'cur' : ''}">${s.done.has(x) ? v : ''}</td>`;
    tab.innerHTML = `<tr><th>x</th>${xs.map((x) => cell(x, x)).join('')}</tr><tr><th>y</th>${xs.map((x) => cell(x, yOf(x))).join('')}</tr>`;
    $('winXV').textContent = s.x;
    $('winYV').textContent = yOf(s.x);
    $('winMsg').innerHTML = `检验：$2\\times${s.x}+${yOf(s.x)}=${2 * s.x + yOf(s.x)}$ ✓　已找到 ${s.done.size} / ${WIN_MAX + 1} 种`;
    tex($('winMsg'));
    b.update();
  };
  slider($('winX'), (v) => { s.x = v; s.done = new Set([...s.done, v]); render(); });
  $('winAll').addEventListener('click', () => { s.done = new Set(Array.from({ length: WIN_MAX + 1 }, (_, i) => i)); render(); });
  $('winClr').addEventListener('click', () => { s.done = new Set(); render(); });
}

const BALL_SUM = 35;
const FREE = 10;
function initBall() {
  const s = { p: [6, 2], found: [] };
  const sum = ([x, y]) => 2 * x + 3 * y + FREE;
  const b = board($('balLat'), { x: [-0.8, 13.6], y: [-0.8, 9.6], w: 560, ticks: 1 });
  const ALL = [[11, 1], [8, 3], [5, 5], [2, 7]];
  ALL.forEach((q) => b.pt(() => (s.found.some((f) => f[0] === q[0] && f[1] === q[1]) ? q : null), { cls: 'c2', r: 7 }));
  b.text(() => s.p, () => `(${s.p[0]}, ${s.p[1]})`, { cls: 'lb up', dx: 12, dy: -12 });
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(v)));
  b.drag(() => s.p, (x, y) => {
    s.p = [clamp(x, 0, 13), clamp(y, 0, 9)];
    if (sum(s.p) === BALL_SUM && !s.found.some((f) => f[0] === s.p[0] && f[1] === s.p[1])) s.found = [...s.found, s.p];
  });
  b.onUpdate = () => {
    const v = sum(s.p);
    $('balSum').textContent = v;
    $('balOk').innerHTML = v === BALL_SUM ? '<b style="color:var(--jade)">= 35 ✓</b>' : `<span class="muted">${v > BALL_SUM ? '多了' : '少了'} ${Math.abs(v - BALL_SUM)} 分</span>`;
    const sorted = [...s.found].sort((p, q) => q[0] - p[0]);
    if (sorted.length) {
      $('balFound').innerHTML = sorted.map(([x, y]) => `$\\begin{cases}x=${x}\\\\y=${y}\\end{cases}$`).join('　') + (sorted.length === ALL.length ? '　全部找到了！' : `　（共 ${ALL.length} 组）`);
      tex($('balFound'));
    }
  };
  b.update();
}

window.LESSON = {
  init() {
    initWin();
    initBall();
  },
};
