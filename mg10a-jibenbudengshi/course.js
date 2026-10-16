'use strict';
/* 高一上 3.2 基本不等式 · 本课互动：数值实验、半圆作图、例 2 图象、例 3 围矩形。通用部分见 ../shared/math.js */
const { board, slider, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const setBar = (id, v, max) => { $(id).style.width = `${Math.min(100, (v / max) * 100)}%`; };

/* 第 4 页：拖滑块比较两个平均数 */
function initGuess() {
  const s = { a: 2, b: 8 };
  const NUM_MAX = 16;
  const show = () => {
    const A = (s.a + s.b) / 2;
    const G = Math.sqrt(s.a * s.b);
    $('naV').textContent = fmt(s.a); $('nbV').textContent = fmt(s.b);
    $('vA').textContent = fmt(A); $('vG').textContent = fmt(G);
    $('vD').textContent = fmt(A - G, 3);
    setBar('barA', A, NUM_MAX); setBar('barG', G, NUM_MAX);
  };
  slider($('na'), (v) => { s.a = v; show(); });
  slider($('nb'), (v) => { s.b = v; show(); });
}

/* 第 5 页：半圆中拖动 C，比较 CD 与 OD（直径 AB = 10） */
function initSemi() {
  const D = 10;
  const R = D / 2;
  const s = { c: 2 }; // AC = a
  const b = board($('semi'), { x: [-0.8, 10.8], y: [-1.6, 5.8], axes: false, grid: false, w: 640 });
  const d = () => [s.c, Math.sqrt(s.c * (D - s.c))];
  b.curve((t) => [R + R * Math.cos(t), R * Math.sin(t)], 0, Math.PI, { cls: 'thin' });
  b.seg([[0, 0], [D, 0]], { cls: 'thin' });
  b.seg(() => [[0, 0], d()], { cls: 'dash' });
  b.seg(() => [[D, 0], d()], { cls: 'dash' });
  b.seg(() => [[R, 0], d()], { cls: 'c2' });
  b.seg(() => [[s.c, 0], d()], { cls: 'c1' });
  b.seg(() => [[0, -0.7], [s.c, -0.7]], { cls: 'thin' });
  b.seg(() => [[s.c, -0.7], [D, -0.7]], { cls: 'thin' });
  b.text(() => [s.c / 2, -0.7], 'a', { dy: 28 });
  b.text(() => [(s.c + D) / 2, -0.7], 'b', { dy: 28 });
  [[[0, 0], 'A', -26, 8], [[D, 0], 'B', 10, 8], [[R, 0], 'O', -22, 28]].forEach(([p, n, dx, dy]) => {
    b.pt(p); b.text(p, n, { dx, dy });
  });
  b.pt(d);
  b.text(d, 'D', { dx: 8, dy: -10 });
  b.text(() => [s.c, 0], 'C', { dx: 8, dy: 28 });
  b.drag(() => [s.c, 0], (x) => { s.c = Math.min(D - 0.05, Math.max(0.05, x)); });
  b.onUpdate = () => {
    const cd = Math.sqrt(s.c * (D - s.c));
    $('vCD').textContent = fmt(cd); $('vOD').textContent = fmt(R);
    setBar('barCD', cd, R); setBar('barOD', R, R);
    $('semiAB').textContent = `a = ${fmt(s.c, 1)}，b = ${fmt(D - s.c, 1)}`;
  };
  b.update();
}

/* 第 11 页：例 2 的图象，拖动曲线上的点 */
function initEx2() {
  const f = (x) => x + 16 / (x + 2);
  const s = { x: 6 };
  const b = board($('ex2'), { x: [-3, 11], y: [-1, 16], w: 560, h: 380, ticks: 2 });
  b.seg([[-2, -2], [-2, 16]], { cls: 'dash' });
  b.fn(f, { from: -1.6, to: 11 });
  b.seg([[2, 0], [2, 6]], { cls: 'dash' });
  b.pt([2, 6], { cls: 'c2' });
  b.text([2, 6], '(2, 6)', { cls: 'lb up', dx: 10, dy: 26 });
  b.drag(() => [s.x, f(s.x)], (x) => { s.x = Math.min(11, Math.max(-1.6, x)); });
  b.onUpdate = () => { $('ex2V').textContent = `x = ${fmt(s.x, 1)}，y = ${fmt(f(s.x))}`; };
  b.update();
}

/* 第 12 页：例 3 围矩形（取 a = 2，铁丝长 8） */
function initRect() {
  const A = 2;
  const UNIT_EM = 2.4; // 1 个单位画成 2.4em
  slider($('rx'), (x) => {
    const w = 2 * A - x;
    $('rect').style.width = `${x * UNIT_EM}em`;
    $('rect').style.height = `${w * UNIT_EM}em`;
    $('rxV').textContent = fmt(x, 1);
    $('rectInfo').innerHTML = `长 ${fmt(x, 1)}，宽 ${fmt(w, 1)}，面积 <b>${fmt(x * w)}</b>${Math.abs(x - A) < 1e-9 ? '　← 正方形，最大！' : ''}`;
  });
}

window.LESSON = {
  init() {
    initGuess();
    initSemi();
    initEx2();
    initRect();
  },
};
