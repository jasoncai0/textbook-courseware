'use strict';
/* 高一上 2.1 命题、定理、定义 · 本课互动：拖动 A′ 找“面积相等的三角形全等”的反例（图 2-1-1）。通用部分见 ../shared/math.js；判真假、找错步用 ../shared/mcheck.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);

/* 第 9 页：B(0,0)、C(4,0)、A(0,3)；A′ 在直线 y = 3 上移动，与 ABC 同底等高 */
const BC = 4;
const HGT = 3;
const T_MIN = -2;
const T_MAX = 6;
const SNAP = 0.1;
function initTri() {
  const s = { t: 2.6 };
  const A = [0, HGT];
  const B = [0, 0];
  const C = [BC, 0];
  const Ap = () => [s.t, HGT];
  const b = board($('tri'), { x: [-2.6, 6.6], y: [-0.9, 4.1], w: 620, axes: false, grid: false });
  b.seg([[-2.6, HGT], [6.6, HGT]], { cls: 'dash' });
  b.seg([[-2.6, 0], [6.6, 0]], { cls: 'thin' });
  b.poly([A, B, C], { cls: 'fill1' });
  b.poly(() => [Ap(), B, C], { cls: 'fill2' });
  b.seg(() => [Ap(), [s.t, 0]], { cls: 'dash' });
  b.poly([[0, 0.28], [0.28, 0.28], [0.28, 0]], { cls: 'rt' });
  [[A, 'A', -26, -8], [B, 'B', -24, 26], [C, 'C', 8, 26]].forEach(([p, n, dx, dy]) => { b.pt(p); b.text(p, n, { dx, dy }); });
  b.text(Ap, "A′", { dx: 10, dy: -12 });
  b.drag(Ap, (x) => { s.t = Math.round(Math.min(T_MAX, Math.max(T_MIN, x)) / SNAP) * SNAP; });
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  b.onUpdate = () => {
    const ab = dist(Ap(), B);
    const ac = dist(Ap(), C);
    const area = 0.5 * BC * HGT;
    const same = [ab, ac, BC].sort((x, y) => x - y).every((v, i) => Math.abs(v - [3, 4, 5][i]) < 1e-6);
    $('triRead').innerHTML = `<span>$S_{\\triangle ABC}$</span><span class="v">${fmt(area)}</span><span class="muted">三边 3, 4, 5</span>`
      + `<span>$S_{\\triangle A'BC}$</span><span class="v">${fmt(area)}</span><span class="muted">三边 ${fmt(ab)}, ${fmt(ac)}, 4</span>`;
    tex($('triRead'));
    const m = $('triMsg');
    m.className = `tip feedback ${same ? 'fb-ok' : 'fb-warn'}`;
    m.innerHTML = same
      ? '这个位置两个三角形三边对应相等，<b>全等</b>。但只是个别位置！'
      : '面积相等，三边却不对应相等——<b>不全等</b>。一个反例就说明命题为假。';
  };
  b.update();
}

window.LESSON = { init() { initTri(); } };
