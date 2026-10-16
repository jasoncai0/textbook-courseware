'use strict';
/* 七上 2.3 数轴 · 本课互动：图 2-2 填数、三要素逐步画数轴（核心一）、辨一辨、例 1/例 2/例 4 拖点上轴、圆规画出 a、滚圆得 π（核心二）。
 * 通用部分见 ../shared/math.js、numline.js；所有位置按数值精确计算。 */
const { board, tex, slider, fmt } = MathKit;
const $ = (id) => document.getElementById(id);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const boards = [];
const keep = (b) => { boards.push(b); return b; };
const NO_SEG = [[0, -9], [0, -9]]; // 画到看不见的地方：用来隐藏线段

/* 静态数轴 + 若干带字母的点 */
function staticAxis(id, { from, to, pts, label, minor }) {
  const b = keep(NumLine.board($(id), { from, to }));
  NumLine.axis(b, { from, to, label, minor });
  pts.forEach(([v, name, cls]) => {
    b.pt([v, 0], { r: 6, cls: cls || '' });
    b.text([v, 0], name, { cls: 'nl-lb', dy: -14 });
  });
  return b;
}

/* ---------- 第 4 页：三要素 ---------- */
const PART = { o: '原点', d: '正方向', u: '单位长度' };
const WHY_MISS = { o: '没有原点：不知道 0 在哪里', d: '没有正方向：分不清哪边是正、哪边是负', u: '没有单位长度：不知道 1 有多长' };
function initBuild() {
  const s = { o: false, d: false, u: false };
  const b = keep(NumLine.board($('build'), { from: -5, to: 5, y: [-1.1, 1.6] }));
  const all = () => s.o && s.d && s.u;
  b.seg([[-5.5, 0], [5.6, 0]], { cls: 'nl-ax' });
  const ax = 16 / (b.X(1) - b.X(0));
  const ay = 7 / (b.Y(0) - b.Y(1));
  b.poly(() => (s.d ? [[5.6 + ax * 0.3, 0], [5.6 - ax * 0.7, ay], [5.6 - ax * 0.7, -ay]] : []), { cls: 'nl-arrow' });
  b.text(() => (s.d ? [5.2, 0] : null), '正方向', { cls: 'nl-or', dy: -16 });
  b.pt([0, 0], { r: 7, cls: 'c1', show: () => s.o });
  b.text(() => (s.o ? [0, 0] : null), '原点', { cls: 'nl-val', dy: -16 });
  for (let v = -5; v <= 5; v++) {
    b.seg(() => (s.u ? [[v, -0.16], [v, 0.16]] : NO_SEG), { cls: 'nl-tick' });
    b.text(() => ((all() || (v === 0 && s.o)) ? [v, 0] : null), NumLine.minus(v), { cls: 'nl-num', dy: 26 });
  }
  b.seg(() => (s.u ? [[0, -0.55], [1, -0.55]] : NO_SEG), { cls: 'unit-bar' });
  b.text(() => (s.u && !all() ? [0.5, -0.55] : null), '1 个单位长度', { cls: 'nl-or', dy: 22 });
  b.onUpdate = () => {
    const miss = Object.keys(PART).filter((k) => !s[k]);
    const msg = $('buildMsg');
    msg.className = `tip feedback ${miss.length ? '' : 'fb-ok'}`;
    msg.innerHTML = miss.length
      ? `还缺：${miss.map((k) => `<b>${PART[k]}</b>（${WHY_MISS[k]}）`).join('；')}。`
      : '三个都有了：原点、正方向、单位长度——这就是一条<b>数轴</b>。从原点向右每隔一个单位长度依次表示 1，2，3，…，向左依次表示 −1，−2，−3，…';
    $('buildBtns').querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('solid', !!s[x.dataset.k]));
  };
  $('buildBtns').addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k;
    if (!k) return;
    if (k === 'reset') Object.keys(PART).forEach((x) => { s[x] = false; });
    else s[k] = true;
    b.update();
  });
}

/* ---------- 第 5 页：四条“像数轴”的直线 ---------- */
function miniAxis(id, { arrow = true, xs, labels }) {
  const y = 34;
  const ticks = xs.map((x, i) => `<line x1="${x}" y1="${y - 7}" x2="${x}" y2="${y + 7}" stroke="#c0392b" stroke-width="2.5"/>${labels ? `<text x="${x}" y="${y + 27}" text-anchor="middle" class="mini-t">${labels[i]}</text>` : ''}`).join('');
  const arr = arrow ? `<path d="M392 ${y} l-14 -6 v12z" fill="#c0392b"/>` : '';
  const el = $(id);
  el.setAttribute('viewBox', '0 0 400 70');
  el.innerHTML = `<line x1="8" y1="${y}" x2="${arrow ? 386 : 392}" y2="${y}" stroke="#c0392b" stroke-width="2.5"/>${arr}${ticks}`;
}
function initMini() {
  const eq = (n, x0, d) => Array.from({ length: n }, (_, i) => x0 + i * d);
  miniAxis('ax1', { xs: eq(7, 30, 55) }); // 有箭头、刻度均匀，但没有原点（也就没有数）
  miniAxis('ax2', { arrow: false, xs: eq(7, 30, 55), labels: ['−3', '−2', '−1', '0', '1', '2', '3'] });
  miniAxis('ax3', { xs: [30, 75, 160, 205, 250, 295, 340], labels: ['−2', '−1', '0', '1', '2', '3', '4'] }); // 第 2 格是 85，其余是 45
  miniAxis('ax4', { xs: eq(5, 40, 82), labels: ['−2', '−1', '0', '1', '2'] });
}

/* ---------- 第 6、11 页：把点拖到数轴上 ---------- */
function placeGame(id, { from, to, items, minor = 0.5, onAll }) {
  const s = { x: items.map(() => null) };
  const b = keep(NumLine.board($(id), { from, to, y: [-1.1, 2.3], h: 170 }));
  NumLine.axis(b, { from, to, minor });
  const trayX = (i) => from + ((to - from) * (i + 0.5)) / items.length;
  const pos = (i) => (s.x[i] === null ? [trayX(i), 1.5] : [s.x[i], 0]);
  const ok = (i) => s.x[i] !== null && Math.abs(s.x[i] - items[i].v) < 0.051;
  const handles = items.map((it, i) => {
    b.text(() => pos(i), it.label, { cls: 'nl-val', dy: -18 });
    return b.drag(() => pos(i), (x, y) => {
      s.x[i] = y > 0.9 ? null : Math.round(clamp(x, from, to) * 10) / 10;
    }, { r: 8 });
  });
  b.onUpdate = () => {
    handles.forEach((g, i) => g.querySelector('.handle').classList.toggle('ok', ok(i)));
    const n = items.filter((_, i) => ok(i)).length;
    const wrong = items.filter((_, i) => s.x[i] !== null && !ok(i));
    const msg = $(`${id}Msg`);
    msg.className = `tip feedback ${n === items.length ? 'fb-ok' : wrong.length ? 'fb-warn' : ''}`;
    msg.innerHTML = n === items.length
      ? (onAll ? onAll(items) : '全部画对了！')
      : `已画对 ${n} / ${items.length} 个。${wrong.length ? `再看看：${wrong.map((it) => it.label).join('、')} 的位置不对。` : '把上方的点一个个拖到数轴上（以 0.1 为单位吸附）。'}`;
  };
}

/* ---------- 第 7 页：以原点为圆心、a 为半径画弧（图 2-6） ---------- */
const A = Math.SQRT2;
function initArc() {
  const s = { t: 0 };
  const b = keep(board($('sq2'), { x: [-2.7, 3.7], y: [-1.35, 1.5], w: 620 }));
  b.svg.querySelectorAll('.ax, .grid, .tk, .lb, path').forEach((e) => e.remove()); // 只要数轴，不要坐标系
  NumLine.axis(b, { from: -2, to: 3, tick: 0.07 });
  b.poly([[0, 0], [1, 1], [2, 0], [1, -1]], { cls: 'sq' });
  b.seg([[1, 1], [1, -1]], { cls: 'thin' });
  b.text([0.5, 0.5], 'a', { cls: 'lb', dx: -18, dy: -4 });
  // 弧：从 P(1, 1)（角 45°）顺时针转到数轴（角 0°），半径 a
  b.curve((u) => [A * Math.cos(u), A * Math.sin(u)], () => Math.PI / 4 * (1 - s.t), Math.PI / 4, { cls: 'arc2' });
  b.seg(() => [[0, 0], [A * Math.cos(Math.PI / 4 * (1 - s.t)), A * Math.sin(Math.PI / 4 * (1 - s.t))]], { cls: 'dash' });
  b.pt([A, 0], { r: 7, cls: 'c2', show: () => s.t > 0.999 });
  b.text(() => (s.t > 0.999 ? [A, 0] : null), 'A', { cls: 'nl-lb', dy: -14 });
  b.text(() => (s.t > 0.999 ? [A, -0.55] : null), `a = ${A.toFixed(6)}…`, { cls: 'nl-or' });
  let busy = false;
  $('arcBtn').addEventListener('click', () => {
    if (busy) return;
    busy = true;
    const t0 = performance.now();
    const tick = (now) => { s.t = Math.min(1, (now - t0) / 1500); b.update(); if (s.t < 1) requestAnimationFrame(tick); else busy = false; };
    requestAnimationFrame(tick);
  });
  $('arcReset').addEventListener('click', () => { s.t = 0; b.update(); });
}

/* ---------- 第 8 页：直径为 1 的圆片无滑动滚动一周（点 A 的轨迹是摆线） ---------- */
const R = 0.5;
function initRoll() {
  const s = { th: 0 };
  const b = keep(board($('roll'), { x: [-0.8, 4.1], y: [-0.55, 1.25], w: 820 }));
  b.svg.querySelectorAll('.ax, .grid, .tk, .lb, path').forEach((e) => e.remove());
  NumLine.axis(b, { from: 0, to: 4, tick: 0.04, minor: 0.1, tail: 0.0, lead: 0.5, label: (v) => NumLine.minus(v) });
  const Apos = (th) => [R * th - R * Math.sin(th), R - R * Math.cos(th)];
  b.curve(Apos, 0, () => s.th, { cls: 'c2', n: 300 });
  b.curve((u) => [R * s.th + R * Math.cos(u), R + R * Math.sin(u)], 0, 2 * Math.PI, { cls: 'disc' });
  b.seg(() => [[R * s.th, R], Apos(s.th)], { cls: 'spoke' });
  b.pt(() => [R * s.th, R], { r: 4 });
  b.pt(() => Apos(s.th), { r: 7, cls: 'c2' });
  b.text(() => Apos(s.th), () => (s.th > 2 * Math.PI - 1e-6 ? "A'" : 'A'), { cls: 'nl-lb', dx: 10, dy: -10 });
  b.seg([[Math.PI, -0.22], [Math.PI, 0.22]], { cls: 'pi-tick' });
  b.text(() => (s.th > 2 * Math.PI - 1e-6 ? [Math.PI, 0] : null), 'π ≈ 3.14', { cls: 'nl-or', dy: 46 });
  b.onUpdate = () => {
    const deg = Math.round((s.th * 180) / Math.PI);
    $('rollTV').textContent = `${deg}°（滚过 ${fmt(R * s.th, 2)} 个单位长度）`;
  };
  const inp = $('rollT');
  slider(inp, (v) => { s.th = (v * Math.PI) / 180; b.update(); });
  $('rollPlay').addEventListener('click', () => {
    const t0 = performance.now();
    const tick = (now) => {
      const u = Math.min(1, (now - t0) / 5000);
      s.th = 2 * Math.PI * u;
      inp.value = 360 * u;
      b.update();
      if (u < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

window.LESSON = {
  init() {
    staticAxis('f22', {
      from: -5, to: 5, label: (v) => ([-4, -3, 3, 5].includes(v) ? '' : NumLine.minus(v)),
      pts: [[-4, '①', 'c1'], [-3, '②', 'c1'], [3, '③', 'c1'], [5, '④', 'c1']],
    });
    initBuild();
    initMini();
    staticAxis('ex1', { from: -4, to: 4, pts: [[-2.5, 'A'], [0, 'B'], [3.5, 'C']] });
    placeGame('ex2', {
      from: -4, to: 4,
      items: [{ v: -1.5, label: '−1.5' }, { v: 3, label: '3' }, { v: -0.6, label: '−3/5' }, { v: 1.5, label: '1.5' }, { v: -3.5, label: '−3½' }],
      onAll: () => '全部画对了！$-\\frac35=-0.6$，$-3\\frac12=-3.5$。',
    });
    initArc();
    initRoll();
    staticAxis('p20', { from: -5, to: 5, minor: 0.5, pts: [[-4, 'A'], [3, 'B'], [-0.5, 'C'], [-1, 'D'], [4.5, 'E']] });
    staticAxis('cmp', { from: -4, to: 6, pts: [[-3, '−3 ℃', 'c1'], [-2, '−2 ℃', 'c1'], [0, '0 ℃', 'c1'], [5, '5 ℃', 'c1']] });
    placeGame('ex4', {
      from: -4, to: 6,
      items: [{ v: -0.5, label: '−1/2' }, { v: 0, label: '0' }, { v: 2, label: '2' }, { v: -3, label: '−3' }, { v: 5, label: '5' }, { v: -1.5, label: '−1.5' }],
      onAll: (items) => `全部画对了！从左往右读：${[...items].sort((p, q) => p.v - q.v).map((it) => it.label).join(' &lt; ')}`,
    });
  },
  onRender() { requestAnimationFrame(() => boards.forEach((b) => b.update())); },
};
