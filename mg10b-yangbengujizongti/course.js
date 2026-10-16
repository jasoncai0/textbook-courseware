'use strict';
/* 高一下 14.4 用样本估计总体 · 本课互动：离差平方和最小（拖动 x）、可拖动数据点（平均数/中位数/众数/方差实时）、
 * 两班成绩点图、牙膏销量、钢筋点线图、日光灯直方图与 x̄±2s、车流量直方图、百分位数滑块。
 * 所有统计量都由代码按课本数据计算。判对错见 ../shared/mcheck.js */
const { board, tex, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const OFF = [[-1e5, -1e5], [-1e5, -1e5], [-1e5, -1e5]];

const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const variance = (a) => { const m = mean(a); return mean(a.map((x) => (x - m) ** 2)); };
const median = (a) => { const b = [...a].sort((x, y) => x - y); const n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; };
const modes = (a) => {
  const c = new Map();
  a.forEach((x) => c.set(x, (c.get(x) || 0) + 1));
  const top = Math.max(...c.values());
  return top < 2 ? [] : [...c].filter(([, k]) => k === top).map(([v]) => v).sort((x, y) => x - y);
};
/** 课本 p243 的四步法求 k 百分位数，返回值与所用位置（从 1 开始） */
function percentile(a, k) {
  const b = [...a].sort((x, y) => x - y);
  const t = (b.length * k) / 100;
  if (Math.abs(t - Math.round(t)) < 1e-9) { const i = Math.round(t); return { v: (b[i - 1] + b[i]) / 2, pos: [i, i + 1], t, b }; }
  const i = Math.ceil(t);
  return { v: b[i - 1], pos: [i], t, b };
}

/* 课本数据 */
const SALES = [152, 124, 129, 116, 100, 103, 92, 95, 127, 104, 105, 119, 114, 115, 87, 103, 118, 142, 135, 125,
  117, 108, 105, 110, 107, 137, 120, 136, 117, 108, 97, 88, 123, 115, 119, 138, 112, 146, 113, 126];
const CLASS_A = [112, 86, 106, 84, 100, 105, 98, 102, 94, 107, 87, 112, 94, 94, 99, 90, 120, 98, 95, 119, 108, 100, 96, 115, 111,
  104, 95, 108, 111, 105, 104, 107, 119, 107, 93, 102, 98, 112, 112, 99, 92, 102, 93, 84, 94, 94, 100, 90, 84, 114];
const CLASS_B = [116, 95, 109, 96, 106, 98, 108, 99, 110, 103, 94, 98, 105, 101, 115, 104, 112, 101, 113, 96, 108, 100, 110, 98, 107,
  87, 108, 106, 103, 97, 107, 106, 111, 121, 97, 107, 114, 122, 101, 107, 107, 111, 114, 106, 104, 104, 95, 111, 111, 110];
const STEEL = { 甲: [110, 120, 130, 125, 120, 125, 135, 125, 135, 125], 乙: [115, 100, 125, 130, 115, 125, 125, 145, 125, 145] };
const BASKET = [108, 92, 42, 47, 343, 32, 50, 71, 51, 83, 112];
const WEIGHT = [47, 49, 52, 57, 60, 71];
const LAMP = [1, 11, 18, 20, 25, 16, 7, 2]; // 451～480, …, 661～690
const TRAFFIC = [40, 37, 19, 13, 36, 166, 319, 772, 570, 456, 488, 586, 458, 650, 279, 331, 426, 760, 680, 572, 486, 246, 108, 67];

/** 相同数值向上叠放的点图坐标 */
const stack = (data, y0, dy) => { const seen = {}; return data.map((x) => { seen[x] = (seen[x] || 0) + 1; return [x, y0 + (seen[x] - 1) * dy]; }); };
function axisX(b, a, z, step, y = 0) {
  b.seg([[a, y], [z, y]], { cls: 'thin' });
  for (let t = Math.ceil(a / step) * step; t <= z + 1e-9; t += step) { b.seg([[t, y], [t, y - 0.12]], { cls: 'thin' }); b.text([t, y], fmt(t, 2), { cls: 'tk', dx: -10, dy: 18 }); }
}

/* ---------- 第 3 页：离差平方和最小 ---------- */
function initLsq() {
  const A = [3, 5, 6, 9, 12];
  const s = { x: 10.5 };
  const f = (x) => A.reduce((t, a) => t + (x - a) ** 2, 0);
  const SC = 16; // 曲线纵向缩放：f/SC
  const b = board($('lsq'), { x: [0, 15], y: [-3.2, 9], w: 520, axes: false, grid: false });
  axisX(b, 0, 15, 1);
  b.fn((x) => f(x) / SC, { cls: 'c1', from: 0.3, to: 14.7 });
  A.forEach((a) => b.pt([a, 0], { r: 6 }));
  A.forEach((a, i) => b.seg(() => [[a, -0.7 - i * 0.45], [s.x, -0.7 - i * 0.45]], { cls: 'c3' }));
  b.seg(() => [[s.x, 0], [s.x, f(s.x) / SC]], { cls: 'dash' });
  b.pt(() => [s.x, f(s.x) / SC], { cls: 'c2', r: 7 });
  b.drag(() => [s.x, 0], (x) => { s.x = Math.round(Math.min(14.5, Math.max(0.5, x)) * 10) / 10; });
  b.onUpdate = () => {
    const m = mean(A);
    $('lsqMsg').innerHTML = `数据 ${A.join('，')}：$x=${fmt(s.x, 1)}$ 时，离差平方和 $=${fmt(f(s.x), 2)}$；`
      + (Math.abs(s.x - m) < 1e-9 ? '<b>最小！</b>恰好是平均数。' : `平均数 $\\bar a=${m}$ 时最小（$=${f(m)}$）。`);
    tex($('lsqMsg'));
  };
  b.update();
}

/* ---------- 第 4 页：两个班的点图 ---------- */
function initTwo() {
  const b = board($('twoCls'), { x: [80, 125], y: [-1.6, 13], w: 560, h: 220, axes: false, grid: false });
  axisX(b, 80, 125, 5);
  [[CLASS_A, 6.6, 'c2', '甲班'], [CLASS_B, 0.4, 'c1', '乙班']].forEach(([d, y0, c, name]) => {
    stack(d, y0, 0.55).forEach((p) => b.pt(p, { cls: c === 'c2' ? 'c2' : 'c1d', r: 3.6 }));
    const m = mean(d);
    b.seg([[m, y0 - 0.3], [m, y0 + 5.5]], { cls: c });
    b.text([m, y0 + 5.5], `${name} ${fmt(m, 2)}`, { cls: 'lb up', dx: 4, dy: 4 });
  });
  b.update();
}

/* ---------- 第 6 页：牙膏销量（表 14-4-2） ---------- */
function initPaste() {
  const SALE = [65, 70, 280, 547, 102];
  const b = board($('paste'), { x: [0, 6], y: [-60, 640], w: 420, h: 230, axes: false, grid: false });
  b.seg([[0.3, 0], [5.8, 0]], { cls: 'thin' });
  SALE.forEach((v, i) => {
    const x = i + 1;
    b.poly([[x - 0.35, 0], [x + 0.35, 0], [x + 0.35, v], [x - 0.35, v]], { cls: i === 3 ? 'bar hot' : 'bar' });
    b.text([x, v], String(v), { cls: 'lb up', dx: -14, dy: -6 });
    b.text([x, 0], `${x} 号`, { cls: 'tk', dx: -14, dy: 18 });
  });
  b.update();
}

/* ---------- 第 7 页：可拖动的数据点（核心） ---------- */
const SETS = [['篮球队得分', BASKET, [0, 360], 50], ['例 4 体重', WEIGHT, [40, 80], 5], ['钢筋（甲）', STEEL.甲, [95, 150], 5]];
function initDrag() {
  const host = $('dp');
  let cur = null;
  const build = (k) => {
    const [, data, [x0, x1], tick] = SETS[k];
    const s = { d: [...data] };
    host.innerHTML = '';
    const b = board(host, { x: [x0, x1], y: [-2.6, 4.2], w: 560, h: 300, axes: false, grid: false });
    axisX(b, x0, x1, tick);
    const pos = () => {
      const seen = {};
      return s.d.map((x) => { seen[x] = (seen[x] || 0) + 1; return [x, 0.5 + (seen[x] - 1) * 0.7]; });
    };
    const tri = (x, y, h) => [[x, y], [x - h * (x1 - x0) / 60, y - h], [x + h * (x1 - x0) / 60, y - h]];
    b.poly(() => tri(mean(s.d), -0.25, 0.9), { cls: 'tri2' });
    b.poly(() => tri(median(s.d), -0.25, 0.9).map(([x, y]) => [x, y - 1]), { cls: 'tri1' });
    b.text(() => [mean(s.d), -1.15], '平均数', { cls: 'tk', dx: 6, dy: 4 });
    b.text(() => [median(s.d), -2.15], '中位数', { cls: 'tk', dx: 6, dy: 4 });
    s.d.forEach((_, i) => b.drag(() => pos()[i], (x) => { s.d[i] = Math.round(Math.min(x1, Math.max(x0, x))); }, { r: 7, hit: 16 }));
    b.onUpdate = () => {
      const md = modes(s.d);
      const v = variance(s.d);
      $('dpMsg').innerHTML = `数据：${[...s.d].sort((p, q) => p - q).join('，')}<br>`
        + `平均数 $${fmt(mean(s.d), 2)}$，中位数 $${fmt(median(s.d), 2)}$，众数 ${md.length ? `$${md.join(',')}$` : '无'}；`
        + `极差 $${Math.max(...s.d) - Math.min(...s.d)}$，方差 $${fmt(v, 2)}$，标准差 $${fmt(Math.sqrt(v), 2)}$。`;
      tex($('dpMsg'));
    };
    b.update();
    cur = b;
  };
  $('dpSets').innerHTML = SETS.map(([n], i) => `<button type="button" class="btn${i ? '' : ' solid'}" data-i="${i}">${n}</button>`).join('');
  $('dpSets').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn) return;
    $('dpSets').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === btn));
    build(+btn.dataset.i);
  });
  build(0);
  return () => cur && cur.update();
}

/* ---------- 第 9 页：钢筋点线图 ---------- */
function initSteel() {
  const b = board($('steel'), { x: [95, 150], y: [-1.6, 9], w: 520, h: 230, axes: false, grid: false });
  axisX(b, 95, 150, 5);
  [['甲', 5.2, 'c2'], ['乙', 0.4, 'c1d']].forEach(([n, y0, c]) => {
    stack(STEEL[n], y0, 0.6).forEach((p) => b.pt(p, { cls: c, r: 5 }));
    b.text([95, y0], n, { cls: 'lb up', dx: 2, dy: 6 });
  });
  b.seg([[125, -0.2], [125, 8.6]], { cls: 'dash' });
  b.update();
}

/* ---------- 第 10 页：日光灯直方图与 [x̄−2s, x̄+2s] ---------- */
function initLamp() {
  const N = 100;
  const W = 30;
  const mids = LAMP.map((_, i) => 465.5 + W * i);
  const m = mids.reduce((t, x, i) => t + x * LAMP[i] / N, 0);
  const sd = Math.sqrt(mids.reduce((t, x, i) => t + LAMP[i] / N * (x - m) ** 2, 0));
  const b = board($('lamp'), { x: [440, 700], y: [-1.2, 10], w: 520, h: 200, axes: false, grid: false });
  const H = (c) => (c / N / W) * 1000; // 纵向放大，便于显示
  b.poly([[m - 2 * sd, 0], [m + 2 * sd, 0], [m + 2 * sd, 9.5], [m - 2 * sd, 9.5]], { cls: 'band' });
  LAMP.forEach((c, i) => { const a = 450.5 + W * i; b.poly([[a, 0], [a + W, 0], [a + W, H(c)], [a, H(c)]], { cls: 'bar' }); });
  b.seg([[440, 0], [700, 0]], { cls: 'thin' });
  [450.5, 510.5, 570.5, 630.5, 690.5].forEach((t) => b.text([t, 0], String(t), { cls: 'tk', dx: -16, dy: 18 }));
  b.seg([[m, 0], [m, 9.5]], { cls: 'c2' });
  b.text([m, 9.5], `x̄≈${fmt(m, 1)}，s≈${fmt(sd, 1)}`, { cls: 'lb up', dx: 6, dy: 4 });
  b.update();
}

/* ---------- 第 12 页：车流量直方图（表 14-4-7） ---------- */
function initTraffic() {
  const N = TRAFFIC.reduce((t, x) => t + x, 0);
  const b = board($('traffic'), { x: [-1, 25], y: [-0.012, 0.1], w: 560, h: 300, ticks: [0, 0.02], labels: ['时', '频率'], grid: false });
  TRAFFIC.forEach((c, i) => { const h = c / N; b.poly([[i, 0], [i + 1, 0], [i + 1, h], [i, h]], { cls: (i === 7 || (i >= 17 && i <= 19)) ? 'bar hot' : 'bar' }); });
  for (let t = 4; t <= 24; t += 4) b.text([t, 0], String(t), { cls: 'tk', dx: -6, dy: 18 });
  b.update();
}

/* ---------- 第 13 页：百分位数 ---------- */
function initPct() {
  const sorted = [...SALES].sort((x, y) => x - y);
  $('pkRow').innerHTML = sorted.map((x, i) => `<span data-i="${i + 1}"><i>${i + 1}</i>${x}</span>`).join('');
  MathKit.slider($('pkK'), (k) => {
    $('pkKV').textContent = k;
    const r = percentile(SALES, k);
    $('pkRow').querySelectorAll('span').forEach((el) => {
      const i = +el.dataset.i;
      el.classList.toggle('lo', i < r.pos[0]);
      el.classList.toggle('on', r.pos.includes(i));
    });
    const integer = r.pos.length === 2;
    $('pkMsg').innerHTML = `$n\\cdot\\dfrac{k}{100}=40\\times\\dfrac{${k}}{100}=${fmt(r.t, 2)}$，`
      + (integer ? `是整数：取第 ${r.pos[0]}、${r.pos[1]} 位的平均数 $\\dfrac{${r.b[r.pos[0] - 1]}+${r.b[r.pos[1] - 1]}}{2}=${fmt(r.v, 2)}$` : `不是整数，向上取整为 ${r.pos[0]}：第 ${r.pos[0]} 位的数值 $${r.v}$`)
      + `，即 $p_{${k}}=${fmt(r.v, 2)}$。`;
    tex($('pkMsg'));
  });
}

let redrawDrag = () => {};
window.LESSON = {
  init() {
    initLsq();
    initTwo();
    initPaste();
    redrawDrag = initDrag();
    initSteel();
    initLamp();
    initTraffic();
    initPct();
  },
  onRender(slide) { if (slide.contains($('dp'))) redrawDrag(); },
};
