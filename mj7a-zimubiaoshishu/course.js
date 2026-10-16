'use strict';
/* 七上 3.1 字母表示数 · 本课互动：图 3-1 拼正方形（第 n 个图形 = n×n，新增 L 形 2n−1 个）；练一练第 4 题的阴影图。
 * 小正方形逐格由坐标画出；层数 k = max(行, 列) + 1，奇数层为涂色纸片（与课本图 3-1 一致）。 */
const { board, slider, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const MAX_N = 10;

function initSquares() {
  const s = { n: 4 };
  const b = board($('sq'), { x: [-0.25, 10.25], y: [-0.25, 10.25], axes: false, grid: false, w: 440 });
  const u = () => 10 / Math.max(s.n, 4); // 小正方形边长：n 较大时缩小，整个图形不超出画板
  for (let r = 0; r < MAX_N; r++) for (let c = 0; c < MAX_N; c++) {
    const layer = Math.max(r, c) + 1;
    b.poly(() => {
      if (layer > s.n) return [];
      const k = u();
      return [[c * k, r * k], [(c + 1) * k, r * k], [(c + 1) * k, (r + 1) * k], [c * k, (r + 1) * k]];
    }, { cls: layer % 2 ? 'cell-a' : 'cell-b' });
  }
  b.poly(() => {
    const k = u();
    const n = s.n;
    return [[0, (n - 1) * k], [0, n * k], [n * k, n * k], [n * k, 0], [(n - 1) * k, 0], [(n - 1) * k, (n - 1) * k]];
  }, { cls: 'new-l' });

  b.onUpdate = () => {
    const n = s.n;
    $('sqNV').textContent = `(${n})`;
    const msg = $('sqMsg');
    msg.innerHTML = n === 1
      ? '第 (1) 个图形中有 1 个小正方形。'
      : `第 (${n}) 个图形比第 (${n - 1}) 个多 <b>${2 * n - 1}</b> 个：上边一行 ${n} 个 + 右边一列 ${n - 1} 个；共 $${n}\\times${n}=${n * n}$ 个。`;
    tex(msg);
    const rows = Array.from({ length: n }, (_, i) => i + 1).slice(-5);
    $('sqTab').innerHTML = `<tr><th>第几个</th>${rows.map((k) => `<td class="${k === n ? 'on' : ''}">(${k})</td>`).join('')}</tr>`
      + `<tr><th>比上一个多</th>${rows.map((k) => `<td class="${k === n ? 'on' : ''}">${k === 1 ? '—' : 2 * k - 1}</td>`).join('')}</tr>`
      + `<tr><th>一共</th>${rows.map((k) => `<td class="${k === n ? 'on' : ''}">${k * k}</td>`).join('')}</tr>`;
  };
  slider($('sqN'), (v) => { s.n = v; b.update(); });
}

/* 练一练第 4 题：大圆半径 r，两个小半圆半径 r/2，圆心都在水平直径上 */
function drawYinYang() {
  const C = 100;
  const R = 86;
  const h = R / 2;
  const L = C - R;
  const Rt = C + R;
  const shade = `M${L} ${C} A${h} ${h} 0 0 1 ${C} ${C} A${h} ${h} 0 0 0 ${Rt} ${C} A${R} ${R} 0 0 1 ${L} ${C} Z`;
  $('yyFig').innerHTML = `<defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#1f2d3a" stroke-width="1.3"/></pattern></defs>`
    + `<path d="${shade}" fill="url(#hatch)" stroke="#1f2d3a" stroke-width="2"/>`
    + `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="#1f2d3a" stroke-width="2"/>`
    + `<line x1="${L}" y1="${C}" x2="${Rt}" y2="${C}" stroke="#1f2d3a" stroke-width="1.5" stroke-dasharray="6 4"/>`
    + `<line x1="${C}" y1="${C}" x2="${C + R * Math.cos(Math.PI / 4)}" y2="${C - R * Math.sin(Math.PI / 4)}" stroke="#1d6fa5" stroke-width="2"/>`
    + `<text x="${C + 34}" y="${C - 38}" class="fl">r</text>`
    + `<line x1="${C - h}" y1="${C}" x2="${C - h - h * Math.cos(Math.PI / 4)}" y2="${C - h * Math.sin(Math.PI / 4)}" stroke="#1d6fa5" stroke-width="2"/>`
    + `<text x="${C - h - 12}" y="${C - 30}" class="fl s">r/2</text>`;
}

window.LESSON = {
  init() {
    initSquares();
    drawYinYang();
  },
};
