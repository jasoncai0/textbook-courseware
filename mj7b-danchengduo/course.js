'use strict';
/* 七下 9.2 单项式乘多项式 · 本课互动：
 * ① 图 9-2：宽 a 的长方形被分成 2～4 条，拖顶边上的分隔点改变 b、c、d…，a(b+c+d) 与 ab+ac+ad 实时对照；
 * ② 图 9-3：长方形地块（住宅、广场、商厦）按 a、b 的值精确绘制，两种算法面积相等。通用部分见 ../shared/math.js */
const { board, slider, fmt, tex } = MathKit;
const $ = (id) => document.getElementById(id);

/* ---------- 第 3 页：分条长方形 ---------- */
const LET = ['b', 'c', 'd', 'e'];
const MIN_W = 0.6;
const MAX_TOTAL = 10.5;
/** 宽度取到 0.1，读数与面积的数值检验一致 */
const snap = (v) => Math.round(v * 10) / 10;

function initStrip() {
  const s = { a: 2.5, k: 3, w: [3.5, 2.5, 1.5, 1.5] };
  const b = board($('strip'), { x: [-1, 11.5], y: [-1.3, 5.2], axes: false, grid: false, w: 640 });
  const start = (i) => s.w.slice(0, i).reduce((t, v) => t + v, 0);
  const total = () => start(s.k);
  [0, 1, 2, 3].forEach((i) => {
    b.poly(() => (i < s.k ? [[start(i), 0], [start(i + 1), 0], [start(i + 1), s.a], [start(i), s.a]] : []), { cls: `s${i}` });
    b.text(() => (i < s.k ? [start(i) + s.w[i] / 2, s.a / 2] : null), `a${LET[i]}`, { dx: 0, dy: 8, cls: 'lb c' });
    b.text(() => (i < s.k ? [start(i) + s.w[i] / 2, s.a] : null), LET[i], { dx: -4, dy: -12 });
  });
  b.poly(() => [[0, 0], [total(), 0], [total(), s.a], [0, s.a]], { cls: 'outer' });
  b.text(() => [0, s.a / 2], 'a', { dx: -22, dy: 6 });
  // 多出来的拖动点与最后一个重合，拖它就等于拖最后一个
  [0, 1, 2, 3].forEach((j) => b.drag(() => [start(Math.min(j, s.k - 1) + 1), s.a], (x) => {
    const i = Math.min(j, s.k - 1);
    const lo = start(i) + MIN_W;
    if (i === s.k - 1) {
      const nx = snap(Math.min(Math.max(x, lo), MAX_TOTAL));
      s.w = s.w.map((v, j) => (j === i ? nx - start(i) : v));
      return;
    }
    const hi = start(i + 2) - MIN_W;
    const nx = snap(Math.min(Math.max(x, lo), hi));
    const right = start(i + 2);
    s.w = s.w.map((v, j) => (j === i ? nx - start(i) : j === i + 1 ? right - nx : v));
  }, { r: 8, hit: 20 }));
  b.onUpdate = () => {
    const L = LET.slice(0, s.k);
    const sumTex = L.join('+');
    $('stripBig').innerHTML = `$a(${sumTex})$`;
    $('stripSmall').innerHTML = `$${L.map((l) => `a${l}`).join('+')}$`;
    const r = (v) => fmt(v, 1);
    const big = s.a * total();
    const parts = s.w.slice(0, s.k).map((v) => s.a * v);
    $('stripNum').innerHTML = `$a=${r(s.a)}$，${L.map((l, i) => `$${l}=${r(s.w[i])}$`).join('，')}：$${r(s.a)}\\times${r(total())}=${fmt(big, 2)}$；$${parts.map((p) => fmt(p, 2)).join('+')}=${fmt(parts.reduce((t, v) => t + v, 0), 2)}$`;
    $('nParts').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', +x.dataset.k === s.k));
    tex($('stripRead'));
  };
  slider($('stripA'), (v) => { s.a = v; $('stripAV').textContent = fmt(v); b.update(); });
  $('nParts').addEventListener('click', (e) => {
    const x = e.target.closest('[data-k]');
    if (!x) return;
    s.k = +x.dataset.k;
    const over = total() - MAX_TOTAL; // 加条后超出画板就把最后一条缩回
    if (over > 0) s.w = s.w.map((v, j) => (j === s.k - 1 ? Math.max(MIN_W, v - over) : v));
    b.update();
  });
}

/* ---------- 第 6 页：图 9-3 地块 ---------- */
function initLand() {
  const s = { a: 1.2, b: 0.8 };
  const g = board($('land'), { x: [-1.4, 9.6], y: [-1.1, 6.6], axes: false, grid: false, w: 600 });
  const W1 = () => 3 * s.a + 2 * s.b; // 住宅宽
  const W2 = () => 2 * s.a - s.b; // 右侧一列宽
  const H = () => 4 * s.a;
  g.poly(() => [[0, 0], [W1(), 0], [W1(), H()], [0, H()]], { cls: 'zhu' });
  g.poly(() => [[W1(), s.a], [W1() + W2(), s.a], [W1() + W2(), H()], [W1(), H()]], { cls: 'guang' });
  g.poly(() => [[W1(), 0], [W1() + W2(), 0], [W1() + W2(), s.a], [W1(), s.a]], { cls: 'sha' });
  g.text(() => [W1() / 2, H() / 2], '住宅', { cls: 'lb zh', dy: 6 });
  g.text(() => [W1() + W2() / 2, (s.a + H()) / 2], '广场', { cls: 'lb zh', dy: 6 });
  g.text(() => [W1() + W2() / 2, s.a / 2], '商厦', { cls: 'lb zh', dy: 6 });
  g.text(() => [W1() / 2, H()], '3a+2b', { cls: 'lb dim', dy: -10 });
  g.text(() => [W1() + W2() / 2, H()], '2a−b', { cls: 'lb dim', dy: -10 });
  g.text(() => [0, H() / 2], '4a', { cls: 'lb dim', dx: -22, dy: 6 });
  g.text(() => [W1() + W2(), (s.a + H()) / 2], '3a', { cls: 'lb dim', dx: 20, dy: 6 });
  g.text(() => [W1() + W2(), s.a / 2], 'a', { cls: 'lb dim', dx: 16, dy: 6 });
  g.onUpdate = () => {
    const A = s.a;
    const B = s.b;
    const whole = 4 * A * (5 * A + B);
    const formula = 20 * A * A + 4 * A * B;
    $('landNum').innerHTML = `$a=${fmt(A)}$，$b=${fmt(B)}$：$4a\\cdot(5a+b)=${fmt(whole, 3)}$，$20a^2+4ab=${fmt(formula, 3)}$`;
    tex($('landNum'));
  };
  slider($('landA'), (v) => { s.a = v; s.b = Math.min(s.b, 2 * v - 0.4); $('landB').value = s.b; $('landAV').textContent = fmt(v); $('landBV').textContent = fmt(s.b); g.update(); });
  slider($('landB'), (v) => { s.b = Math.min(v, 2 * s.a - 0.4); $('landBV').textContent = fmt(s.b); g.update(); });
}

window.LESSON = {
  init() {
    initStrip();
    initLand();
  },
};
