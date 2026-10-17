'use strict';
/* 九下 8.3 统计分析帮你做预测 · 本课互动：
 * GDP 统计表（含逐年增加量，由表中数据相减）、图 8-4/8-5 散点与直线 AB、选直线实验室（拖动 A、B，实时求 y = kx + b、
 * 偏离量、2004 年估计值）、练习（身高—体重）与习题（人口）的同款拖线作图。所有点的坐标即课本数据。 */
const { board } = MathKit;
const $ = (id) => document.getElementById(id);
const boards = [];

const GDP_X = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
const GDP_Y = [27194.5, 35673.2, 48637.5, 61339.9, 71813.6, 79715.0, 85195.5, 90564.4, 100280.1, 110863.1, 121717.4, 137422.0];

/** 千分位用空格分组（课本写法），保留 digits 位小数 */
function num(v, digits = 1) {
  const neg = v < 0;
  const [i, d] = Math.abs(v).toFixed(digits).split('.');
  const g = i.length > 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : i;
  return `${neg ? '−' : ''}${g}${d ? `.${d}` : ''}`;
}

/* ---------- 第 3 页：统计表 ---------- */
function initTable() {
  const row = (lo, hi) => {
    const xs = GDP_X.slice(lo, hi);
    return `<tr><th>年份</th>${xs.map((x) => `<td>${x}</td>`).join('')}</tr>`
      + `<tr><th>GDP</th>${xs.map((_, i) => `<td>${num(GDP_Y[lo + i])}</td>`).join('')}</tr>`
      + `<tr data-step="3"><th>比上年增加</th>${xs.map((_, i) => `<td class="muted">${lo + i ? num(GDP_Y[lo + i] - GDP_Y[lo + i - 1]) : '—'}</td>`).join('')}</tr>`;
  };
  $('gdpTab').innerHTML = row(0, 6) + row(6, 12);
}

const GDP_BOX = { x: [1990.3, 2006.2], y: [-14000, 160000], w: 640, h: 380, ticks: [1, 20000], labels: ['年份', 'GDP/亿元'] };

/* ---------- 第 4 页：散点（图 8-4、8-5）---------- */
function initScatter() {
  const st = { mode: 0 };
  const b = board($('scatBoard'), { ...GDP_BOX, tickLabels: false });
  yTicks(b, GDP_BOX, 20000, (v) => num(v, 0));
  xTicks(b, GDP_X, 2);
  const OFF = [[-1e5, -1e5], [-1e5, -1e5]];
  for (let i = 0; i < GDP_X.length - 1; i++) b.seg(() => (st.mode === 2 ? [[GDP_X[i], GDP_Y[i]], [GDP_X[i + 1], GDP_Y[i + 1]]] : OFF), { cls: 'thin' });
  const k = (GDP_Y[11] - GDP_Y[0]) / 11;
  b.seg(() => (st.mode === 1 ? [[1991.3, GDP_Y[0] - 0.7 * k], [2003.7, GDP_Y[11] + 0.7 * k]] : OFF), { cls: 'fitl' });
  GDP_X.forEach((x, i) => b.pt([x, GDP_Y[i]], { r: 4.5, cls: 'dat' }));
  b.text(() => (st.mode === 1 ? [1992, GDP_Y[0]] : null), 'A', { cls: 'ab', dx: 6, dy: 20 });
  b.text(() => (st.mode === 1 ? [2003, GDP_Y[11]] : null), 'B', { cls: 'ab', dx: 8, dy: -6 });
  const modes = ['图 8-4 只描点', '图 8-5 直线 AB', '连成折线'];
  $('scatBtns').innerHTML = modes.map((m, i) => `<button class="btn${i ? '' : ' solid'}" type="button" data-k="${i}">${m}</button>`).join('');
  $('scatBtns').addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    st.mode = +t.dataset.k;
    $('scatBtns').querySelectorAll('.btn').forEach((x) => x.classList.toggle('solid', x === t));
    b.update();
  });
  boards.push(b);
}

/* 坐标轴刻度（数值大，自己写，避免与轴重叠） */
function yTicks(b, box, step, f) {
  for (let v = step; v < box.y[1] - step * 0.6; v += step) b.text([box.x[0], v], f(v), { cls: 'tk', dx: 4, dy: 5 });
}
function xTicks(b, xs, every) {
  xs.forEach((x, i) => { if (i % every === 0) b.text([x, 0], String(x), { cls: 'tk', dy: 18 }); });
}

/* ---------- 通用：拖动 A、B 选直线 ---------- */
function fitLab(el, read, o) {
  const b = board(el, { ...o.box, tickLabels: o.tickLabels });
  if (o.decorate) o.decorate(b);
  const st = { A: [...o.A], B: [...o.B] };
  const line = () => {
    const [[x1, y1], [x2, y2]] = [st.A, st.B];
    const k = (y2 - y1) / (x2 - x1);
    return [k, y1 - k * x1];
  };
  const [X0, X1] = o.box.x;
  o.xs.forEach((x, i) => b.seg(() => { const [k, c] = line(); return [[x, o.ys[i]], [x, k * x + c]]; }, { cls: 'res' }));
  b.seg(() => { const [k, c] = line(); return [[X0, k * X0 + c], [X1, k * X1 + c]]; }, { cls: 'fitl' });
  o.xs.forEach((x, i) => b.pt([x, o.ys[i]], { r: 4.5, cls: 'dat' }));
  if (o.pred) b.pt(() => { const [k, c] = line(); return [o.pred, k * o.pred + c]; }, { r: 5, cls: 'pred' });
  const snapY = o.snapY || 1;
  const mover = (key) => (x, y) => {
    const nx = Math.min(o.xr[1], Math.max(o.xr[0], Math.round(x / o.snapX) * o.snapX));
    const other = st[key === 'A' ? 'B' : 'A'][0];
    if (Math.abs(nx - other) < o.snapX / 2) return;
    st[key] = [nx, Math.min(o.box.y[1], Math.max(o.box.y[0], Math.round(y / snapY) * snapY))];
  };
  b.drag(() => st.A, mover('A'));
  b.drag(() => st.B, mover('B'));
  b.text(() => st.A, 'A', { cls: 'ab', dx: -16, dy: -12 });
  b.text(() => st.B, 'B', { cls: 'ab', dx: 10, dy: -12 });
  b.onUpdate = () => {
    const [k, c] = line();
    const res = o.xs.map((x, i) => o.ys[i] - (k * x + c));
    const up = res.filter((r) => r > 1e-9).length;
    const down = res.filter((r) => r < -1e-9).length;
    const dev = res.reduce((s, r) => s + Math.abs(r), 0);
    read.innerHTML = `<p class="big">${o.expr(k, c)}</p>`
      + `<p>直线上方 ${up} 个点，下方 ${down} 个点，偏离量之和约 ${o.devFmt(dev)}</p>`
      + (o.more ? `<p>${o.more(k, c)}</p>` : '');
  };
  boards.push(b);
  return { b, set(A, B) { st.A = [...A]; st.B = [...B]; b.update(); } };
}

/* ---------- 第 5 页：GDP 选直线 ---------- */
function initFit() {
  const lab = fitLab($('fitBoard'), $('fitRead'), {
    box: { ...GDP_BOX, x: [1990.3, 2006.2] }, tickLabels: false, xs: GDP_X, ys: GDP_Y,
    A: [1992, GDP_Y[0]], B: [2003, GDP_Y[11]], xr: [1991, 2005], snapX: 1, snapY: 100, pred: 2004,
    decorate: (b) => { yTicks(b, GDP_BOX, 20000, (v) => num(v, 0)); xTicks(b, GDP_X, 2); },
    expr: (k, c) => `y ≈ ${num(k)}x ${c < 0 ? '−' : '+'} ${num(Math.abs(c))}`,
    devFmt: (d) => `${num(d, 0)} 亿元`,
    more: (k, c) => `估计 2004 年 GDP ≈ <b>${num(k * 2004 + c)}</b> 亿元（红点）`,
  });
  const presets = [
    ['课本的直线 AB（1992 与 2003）', [1992, GDP_Y[0]], [2003, GDP_Y[11]]],
    ['过 1994 与 2002 的点', [1994, GDP_Y[2]], [2002, GDP_Y[10]]],
    ['过 1992 与 1996 的点', [1992, GDP_Y[0]], [1996, GDP_Y[4]]],
  ];
  $('fitBtns').innerHTML = presets.map(([n], i) => `<button class="btn" type="button" data-k="${i}">${n}</button>`).join('');
  $('fitBtns').addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) { const [, A, B] = presets[+t.dataset.k]; lab.set(A, B); } });
}

/* ---------- 第 8 页：身高与体重 ---------- */
function initHw() {
  const W = [49, 43, 65, 46, 62, 56, 60, 52, 48, 69];
  const H = [170, 165, 177, 167, 176, 172, 175, 171, 168, 183];
  fitLab($('hwBoard'), $('hwRead'), {
    box: { x: [37, 75], y: [156.5, 188], w: 600, h: 300, ticks: [5, 5], labels: ['体重/kg', '身高/cm'] }, tickLabels: false,
    decorate: (b) => {
      for (let v = 160; v <= 180; v += 5) b.text([37, v], String(v), { cls: 'tk', dx: 4, dy: 5 });
      for (let x = 40; x <= 70; x += 5) b.text([x, 156.5], String(x), { cls: 'tk', dy: 18 });
    },
    xs: W, ys: H, A: [43, 165], B: [69, 183], xr: [38, 74], snapX: 1, snapY: 0.5,
    expr: (k, c) => `y ≈ ${k.toFixed(2)}x ${c < 0 ? '−' : '+'} ${Math.abs(c).toFixed(1)}`,
    devFmt: (d) => `${d.toFixed(1)} cm`,
    more: (k, c) => `身高 180 cm → 体重约 <b>${((180 - c) / k).toFixed(1)}</b> kg`,
  });
}

/* ---------- 第 9 页：人口 ---------- */
function initPop() {
  const X = [1949, 1954, 1959, 1964, 1969, 1974, 1979, 1984, 1989, 1994, 1999];
  const Y = [542, 603, 672, 705, 807, 909, 975, 1044, 1127, 1199, 1258];
  const box = { x: [1942, 2010], y: [330, 1390], w: 600, h: 300, ticks: [10, 200], labels: ['年份', '人口/百万'] };
  fitLab($('popBoard'), $('popRead'), {
    box, tickLabels: false, xs: X, ys: Y, A: [1949, 542], B: [1999, 1258], xr: [1944, 2006], snapX: 1, snapY: 1, pred: 2004,
    decorate: (b) => {
      for (let v = 400; v <= 1200; v += 200) b.text([1942, v], String(v), { cls: 'tk', dx: 4, dy: 5 });
      for (let x = 1950; x <= 2000; x += 10) b.text([x, 330], String(x), { cls: 'tk', dy: 18 });
    },
    expr: (k, c) => `y ≈ ${k.toFixed(2)}(x − 1949) + ${(k * 1949 + c).toFixed(1)}`,
    devFmt: (d) => `${d.toFixed(0)} 百万`,
    more: (k, c) => `估计 2004 年人口 ≈ <b>${(k * 2004 + c).toFixed(0)}</b> 百万（红点）`,
  });
}

window.LESSON = {
  init() {
    initTable();
    initScatter();
    initFit();
    initHw();
    initPop();
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
