'use strict';
/* 七下 9.1 单项式乘单项式 · 本课互动：电视墙（图 9-1）。每台电视长 a、宽 b（按比例绘制），
 * 拖右上角改变列数 p、行数 q：大长方形 (pa)·(qb) 与 pq 个小长方形 pq·ab 是同一块面积。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);
const MAX_P = 5;
const MAX_Q = 4;

function initWall() {
  const s = { p: 3, q: 3, a: 1.8, b: 1.2 };
  const b = board($('tvwall'), { x: [-1.2, 10.6], y: [-1.1, 6.1], axes: false, grid: false, w: 640 });
  for (let j = 0; j < MAX_Q; j++) {
    for (let i = 0; i < MAX_P; i++) {
      b.poly(() => (i < s.p && j < s.q ? [[i * s.a, j * s.b], [(i + 1) * s.a, j * s.b], [(i + 1) * s.a, (j + 1) * s.b], [i * s.a, (j + 1) * s.b]] : []), { cls: i === 0 && j === 0 ? 'tv tv1' : 'tv' });
    }
  }
  b.poly(() => [[0, 0], [s.p * s.a, 0], [s.p * s.a, s.q * s.b], [0, s.q * s.b]], { cls: 'wall' });
  b.text(() => [s.a / 2, 0], 'a', { dx: -5, dy: 24 });
  b.text(() => [0, s.b / 2], 'b', { dx: -22, dy: 6 });
  b.text(() => [s.p * s.a / 2, s.q * s.b], () => `${s.p}a`, { cls: 'lb', dx: -10, dy: -10 });
  b.text(() => [s.p * s.a, s.q * s.b / 2], () => `${s.q}b`, { cls: 'lb', dx: 10, dy: 6 });
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(v)));
  b.drag(() => [s.p * s.a, s.q * s.b], (x, y) => { s.p = clamp(x / s.a, 1, MAX_P); s.q = clamp(y / s.b, 1, MAX_Q); });
  b.onUpdate = () => {
    $('tvBig').innerHTML = `$${s.p}a\\cdot${s.q}b$`;
    $('tvSmall').innerHTML = `$${s.p * s.q}ab$（${s.p}×${s.q} = ${s.p * s.q} 台）`;
    $('tvEq').innerHTML = `$${s.p}a\\cdot${s.q}b=${s.p * s.q}ab$`;
    $('tvNum').innerHTML = `$a=${fmt(s.a)}$，$b=${fmt(s.b)}$ 时：$${fmt(s.p * s.a)}\\times${fmt(s.q * s.b)}=${fmt(s.p * s.a * s.q * s.b, 3)}$，$${s.p * s.q}\\times${fmt(s.a)}\\times${fmt(s.b)}=${fmt(s.p * s.q * s.a * s.b, 3)}$`;
    tex($('tvRead'));
  };
  slider($('tvA'), (v) => { s.a = v; $('tvAV').textContent = fmt(v); b.update(); });
  slider($('tvB'), (v) => { s.b = v; $('tvBV').textContent = fmt(v); b.update(); });
}

window.LESSON = {
  init() {
    initWall();
  },
};
