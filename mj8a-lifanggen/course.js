'use strict';
/* 八上 4.2 立方根 · 本课互动：正方体棱长滑块（核心）——拖棱长 x，体积 x³ 实时变化，逐步逼近 x³ = 2。
 * 正方体按课本立体图画法：前面是边长 x 的正方形，向后的棱画成一半长、与水平方向成 45°；两个正方体同一比例。 */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];
const keep = (b) => { boards.push(b); return b; };

const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const TARGET = 2;
const NEAR = 0.005; // |x³ − 2| < 0.005 视为“约等于 2”（步长 0.01 时只有 x = 1.26）

/** 正方体（立体图）：o 为前面左下角，e 为棱长；返回各面与虚线棱 */
function cubeParts(o, e) {
  const d = [(e / 2) * Math.SQRT1_2, (e / 2) * Math.SQRT1_2];
  const A = o; const B = add(o, [e, 0]); const C = add(o, [e, e]); const D = add(o, [0, e]);
  const back = add(o, d);
  return {
    front: [A, B, C, D],
    top: [D, C, add(C, d), add(D, d)],
    right: [B, add(B, d), add(C, d), C],
    hidden: [[back, A], [back, add(B, d)], [back, add(D, d)]],
  };
}

function drawCube(b, o, getE, cls) {
  const parts = () => cubeParts(o, getE());
  [0, 1, 2].forEach((i) => b.seg(() => parts().hidden[i], { cls: 'hid' }));
  if (cls === 'unit') {
    ['front', 'top', 'right'].forEach((k) => b.poly(() => parts()[k], { cls: 'ucube' }));
    return;
  }
  b.poly(() => parts().right, { cls: 'face3' });
  b.poly(() => parts().top, { cls: 'face2' });
  b.poly(() => parts().front, { cls: 'face' });
}

/* 第 3 页：棱长滑块 */
function initCube() {
  const s = { x: 1.5, rows: [] };
  const O2 = [1.6, 0];
  // 横纵同比例：宽 5、高 3.3 → 600 × 396
  const b = keep(board($('cube'), { x: [-0.4, 4.6], y: [-0.45, 2.85], axes: false, grid: false, w: 600 }));
  drawCube(b, [0, 0], () => 1, 'unit');
  drawCube(b, O2, () => s.x, 'var');
  b.text([0.5, 0], '1', { cls: 'fl', dy: 24 });
  b.text([0.5, 0.5], 'V = 1', { cls: 'vol', dy: 6 });
  b.text(() => [O2[0] + s.x / 2, 0], 'x', { cls: 'fl', dy: 24 });
  b.text(() => [O2[0] + s.x / 2, s.x / 2], () => `V = ${fmt(s.x ** 3, 4)}`, { cls: 'vol', dy: 6 });
  const cmp = (v) => (Math.abs(v - TARGET) < NEAR ? 'eq' : (v > TARGET ? 'hi' : 'lo'));
  const CMP_TXT = { eq: '≈ 2', hi: '> 2', lo: '< 2' };
  b.onUpdate = () => {
    const v = s.x ** 3;
    $('xV').textContent = fmt(s.x);
    $('x3V').textContent = fmt(v, 4);
    $('cmpV').textContent = CMP_TXT[cmp(v)];
  };
  const MAX_ROWS = 6;
  const render = () => {
    const head = $('tryTab').rows[0].outerHTML;
    $('tryTab').innerHTML = head + s.rows.map((r) => {
      const c = cmp(r.x ** 3);
      return `<tr><td>${fmt(r.x)}</td><td>${fmt(r.x ** 3, 4)}</td><td class="${c}">${CMP_TXT[c]}</td></tr>`;
    }).join('');
    tex($('tryTab'));
  };
  $('tryRec').addEventListener('click', () => { s.rows = [...s.rows, { x: s.x }].slice(-MAX_ROWS); render(); });
  $('tryClr').addEventListener('click', () => { s.rows = []; render(); });
  slider($('xIn'), (v) => { s.x = v; b.update(); });
}

window.LESSON = {
  init() {
    initCube();
    boards.forEach((b) => b.update());
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
